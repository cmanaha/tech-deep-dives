/**
 * Calculator C: parallelism sizing (section 14).
 *
 * Enumerates TP, CP, PP (with interleaved chunks v), DP, the sharding mode, micro-batch,
 * recomputation and FSDP gradient-sync mode for a dense model on a cluster; checks each layout's
 * memory through Calculator B; and ranks the survivors by one estimated step time:
 *
 *   step = compute x recomputation factor x (1 + (p - 1) / (v x m)) + exposed communication
 *
 * compute from Calculator A's identity at the stated MFU (T01-58), the bubble from the interleaved
 * 1F1B schedule (2104.04473v5, T02-30), and exposed communication as a range from 0 (full overlap)
 * to the sum over dimensions of bytes per link / link bandwidth (no overlap). Per-link bytes:
 * TP 8bsh(t-1)/t elements per layer per micro-batch (T02-13); PP bsh/t per micro-batch per
 * boundary per direction (T02-31); DP and ZeRO-1 a reduce-scatter plus an all-gather per step, ZeRO-2 a
 * gradient reduce-scatter per micro-batch (DeepSpeed v0.19.9) plus one all-gather per step
 * (T02-7); FSDP at PyTorch 2.15.0 defaults 2 all-gathers and 1 reduce-scatter per unit per
 * micro-batch, deferred k + 1 all-gathers and 1 reduce-scatter (E3); HSDP an in-instance
 * gather and scatter plus a cross-instance all-reduce of the shard (2304.11277v2, W2-14, W2-15).
 *
 * Pricing a collective (our reading, supported by AWS's nccl-tests sample, SOURCES.ncclTestsSample):
 * a group inside one instance runs per GPU over the scale-up link at (n - 1)/n x S for an
 * all-gather or reduce-scatter and 2(n - 1)/n x S for an all-reduce (T02-60, T02-61). A group that
 * spans M instances is priced per instance against the instance's whole EFA bandwidth, because
 * NCCL spreads the crossing over all of an instance's NICs: (M - 1)/M x S per group per instance
 * for an all-gather or reduce-scatter, 2(M - 1)/M x S for an all-reduce, times the number of such
 * groups with members in the instance. That is a lower bound: the sample all-reduces 16 GiB across
 * 2 p5.48xlarge in 66,132 us, against 43 ms from this bound and at least 0.64 s from pricing each
 * GPU's 2(n - 1)/n x S at its 50 GB/s share. The in-instance leg of a spanning collective rides the
 * scale-up link at the same time and is not added. PP point-to-point stays per GPU.
 *
 * The MoE mode reports model state on the attention grid and the expert grid, expert-parallel
 * bytes per token, and the world-size check on both grids (T02-41, T02-72); it does not model
 * activations.
 */

import {
  DEFAULT_HEADROOM,
  DEFAULT_MFU,
  E3_FSDP2_PER_UNIT,
  GB,
  rankFacts,
  requirePositive,
  requirePositiveInteger,
  requireUnitFraction,
  type InstancePreset,
  type ModelShape,
  type MoeModelShape,
  type OptimizerRowId,
  type RankFacts,
} from './presets';
import {
  memoryBudget,
  optimizerComponents,
  type ActivationSpec,
  type GradientDtype,
  type LogitsMode,
  type MemoryResult,
  type RecomputeMode,
  type ZeroStage,
} from './memory';
import { denseRuntimeInputs, flopsPerToken, type AttentionMode } from './runtime';

/** ddp = replicated state; zero1/zero2 shard optimizer (and gradients) over DP; fsdp shards everything over DP; hsdp shards inside one instance and replicates across. */
export type Sharding = 'ddp' | 'zero1' | 'zero2' | 'fsdp' | 'hsdp';
/** oncePerStep for DDP and ZeRO-1/2; FSDP and HSDP sync every micro-batch by default or defer to the last (T03-2, T03-3). */
export type GradientSync = 'oncePerStep' | 'everyMicroBatch' | 'deferred';

export interface Layout {
  tp: number;
  cp: number;
  pp: number;
  dp: number;
  interleavedChunks: number;
  sharding: Sharding;
  microBatch: number;
  recompute: RecomputeMode;
  gradientSync: GradientSync;
}

export interface ParallelismInput {
  model: ModelShape;
  instance: InstancePreset;
  instanceCount: number;
  sequenceLength: number;
  globalBatch: { sequences: number } | { tokens: number };
  /** Fraction of HBM a layout may use before it is flagged; default 0.75 (an assumption). */
  headroomFraction?: number;
  /** BF16 gradients (16 bytes per parameter) or FP32 main gradients (18), which also sets the reduce dtype. */
  gradientDtype?: GradientDtype;
  optimizer?: OptimizerRowId;
  mfu?: number;
  /** N for the compute estimate; default the full count. */
  parameterBasis?: 'full' | 'matmul' | 'nonEmbedding';
  /** Attention FLOPs for the compute estimate; default causal. */
  attention?: AttentionMode;
  activations?: ActivationSpec;
  logits?: LogitsMode;
  /** Recomputation modes to enumerate; default none and full (selective equals none in memory with a flash kernel). */
  recomputeModes?: readonly RecomputeMode[];
  /** Largest CP degree to enumerate; CP is tried only at 8,192 tokens and above (T02-25). Default 8. */
  maxContextParallel?: number;
  /** Survivors to return, best first; default 20. */
  limit?: number;
}

export interface LinkLoad {
  dimension: 'TP' | 'CP' | 'PP' | 'DP' | 'FSDP' | 'HSDP';
  link: 'scale-up' | 'EFA';
  what: string;
  /** 'per GPU' for scale-up and point-to-point loads; 'per instance' for collectives that cross instances. */
  basis: 'per GPU' | 'per instance';
  /** Bytes per step on the stated basis. */
  bytesPerStep: number;
  /** The bandwidth those bytes are priced against: per GPU, or the instance's whole EFA. */
  bandwidthBytesPerSecond: number;
  seconds: number;
  /** seconds / compute seconds (Calculator A's identity before recomputation and bubble). */
  shareOfCompute: number;
}

export type CollectiveKind = 'allGather' | 'reduceScatter' | 'allReduce';

export interface CollectiveLoad {
  link: 'scale-up' | 'EFA';
  basis: 'per GPU' | 'per instance';
  /** Bytes for one collective on the stated basis. */
  bytes: number;
  bandwidthBytesPerSecond: number;
  seconds: number;
  /** Instances the group spans and its largest number of members in one of them. */
  instances: number;
  membersPerInstance: number;
}

/**
 * Lower-bound cost of one collective of S bytes over a group of global ranks (rank r sits on
 * instance floor(r / ranks per instance)). Inside one instance: per GPU over the scale-up link,
 * (n - 1)/n x S, doubled for an all-reduce (T02-60, T02-61). Across M instances: per instance over
 * its whole EFA, (g / k) groups x (M - 1)/M x S, doubled for an all-reduce, with g ranks per
 * instance and k members of the group in each (our reading, supported by AWS's nccl-tests sample).
 */
export function collectiveLoad(
  facts: RankFacts,
  members: readonly number[],
  bytesPerCollective: number,
  kind: CollectiveKind,
): CollectiveLoad {
  if (members.length === 0) throw new RangeError('members must list at least one rank');
  for (const r of members) {
    if (!Number.isInteger(r) || r < 0) throw new RangeError(`members must be ranks 0 or above (got ${r})`);
  }
  if (!Number.isFinite(bytesPerCollective) || bytesPerCollective < 0) {
    throw new RangeError(`bytesPerCollective must be 0 or more (got ${bytesPerCollective})`);
  }
  const g = facts.ranksPerInstance;
  const perInstance = new Map<number, number>();
  for (const r of members) {
    const instance = Math.floor(r / g);
    perInstance.set(instance, (perInstance.get(instance) ?? 0) + 1);
  }
  const instances = perInstance.size;
  const k = Math.max(...perInstance.values());
  const factor = kind === 'allReduce' ? 2 : 1;
  if (instances === 1) {
    const n = members.length;
    const bytes = factor * ((n - 1) / n) * bytesPerCollective;
    const bandwidth = facts.scaleUpBytesPerSecondPerRank;
    return { link: 'scale-up', basis: 'per GPU', bytes, bandwidthBytesPerSecond: bandwidth, seconds: bytes / bandwidth, instances, membersPerInstance: k };
  }
  const bytes = (g / k) * factor * ((instances - 1) / instances) * bytesPerCollective;
  const bandwidth = facts.efaBytesPerSecondPerInstance;
  return { link: 'EFA', basis: 'per instance', bytes, bandwidthBytesPerSecond: bandwidth, seconds: bytes / bandwidth, instances, membersPerInstance: k };
}

export type FitStatus = 'fits' | 'fitsAboveHeadroom' | 'doesNotFit';

export interface Candidate {
  layout: Layout;
  description: string;
  microBatchesPerStep: number;
  memory: MemoryResult;
  status: FitStatus;
  flags: string[];
  computeSeconds: number;
  recomputeFactor: number;
  bubbleFraction: number;
  links: LinkLoad[];
  exposedCommunicationSeconds: { min: number; max: number };
  stepSeconds: { low: number; high: number; midpoint: number };
}

export interface ParallelismResult {
  worldSize: number;
  sequencesPerStep: number;
  tokensPerStep: number;
  computeSeconds: number;
  mfu: number;
  assumptions: string[];
  /** Layouts within the headroom target, ranked by the midpoint of the step-time range. */
  survivors: Candidate[];
  /** Layouts that fit HBM only above the headroom target, ranked the same way; confirm with a measured step. */
  aboveHeadroom: Candidate[];
  counts: { evaluated: number; survivors: number; aboveHeadroom: number; doesNotFit: number };
  measureNext: string;
}

export const UNEVEN_STAGES_FLAG =
  "uneven stages: Megatron Core needs `--decoder-first/last-pipeline-num-layers` or `--pipeline-model-parallel-layout`; TorchTitan's default already splits this way";

export const MEASURE_NEXT =
  'measure these two or three: run each surviving layout for a few hundred steps and keep the one with the best measured throughput (02 section 3.5, step 12)';

/** Recomputation factor on compute: full adds one forward pass, about a third (T01-34, T01-37); selective about 1.0x, our assumption with a flash kernel. */
export const RECOMPUTE_FACTOR: Readonly<Record<RecomputeMode, number>> = { none: 1, selective: 1, full: 4 / 3 };

interface Context {
  input: ParallelismInput;
  facts: RankFacts;
  worldSize: number;
  sequences: number;
  tokensPerStep: number;
  computeSeconds: number;
  gradientBytes: number;
  mfu: number;
  headroom: number;
}

function buildContext(input: ParallelismInput): Context {
  requirePositiveInteger('instanceCount', input.instanceCount);
  requirePositiveInteger('sequenceLength', input.sequenceLength);
  const facts = rankFacts(input.instance);
  const worldSize = facts.ranksPerInstance * input.instanceCount;
  let sequences: number;
  if ('sequences' in input.globalBatch) {
    requirePositiveInteger('globalBatch.sequences', input.globalBatch.sequences);
    sequences = input.globalBatch.sequences;
  } else {
    requirePositiveInteger('globalBatch.tokens', input.globalBatch.tokens);
    if (input.globalBatch.tokens % input.sequenceLength !== 0) {
      throw new RangeError(`globalBatch.tokens (${input.globalBatch.tokens}) must divide by sequenceLength (${input.sequenceLength})`);
    }
    sequences = input.globalBatch.tokens / input.sequenceLength;
  }
  const mfu = input.mfu ?? DEFAULT_MFU.value;
  requireUnitFraction('mfu', mfu);
  const headroom = input.headroomFraction ?? DEFAULT_HEADROOM.value;
  requireUnitFraction('headroomFraction', headroom);
  const tokensPerStep = sequences * input.sequenceLength;
  const perToken = flopsPerToken({
    ...denseRuntimeInputs(input.model, input.parameterBasis ?? 'full'),
    sequenceLength: input.sequenceLength,
    attention: input.attention ?? 'causal',
  });
  // Compute per step: FLOPs per token x tokens / (world x peak x MFU) (T01-58; 02 section 3.2's 17.5 s).
  const computeSeconds = (perToken.total * tokensPerStep) / (worldSize * facts.denseBf16TflopsPerRank * 1e12 * mfu);
  const gradientBytes = optimizerComponents({ row: input.optimizer ?? 'adamMixed', gradientDtype: input.gradientDtype }).gradientBytes;
  return { input, facts, worldSize, sequences, tokensPerStep, computeSeconds, gradientBytes, mfu, headroom };
}

/** Throws a RangeError naming the field when a layout is not runnable on this model and cluster. */
function validateLayout(ctx: Context, layout: Layout): number {
  const { input, facts, worldSize } = ctx;
  const m = input.model;
  requirePositiveInteger('layout.tp', layout.tp);
  requirePositiveInteger('layout.cp', layout.cp);
  requirePositiveInteger('layout.pp', layout.pp);
  requirePositiveInteger('layout.dp', layout.dp);
  requirePositiveInteger('layout.interleavedChunks', layout.interleavedChunks);
  requirePositiveInteger('layout.microBatch', layout.microBatch);
  const product = layout.tp * layout.cp * layout.pp * layout.dp;
  if (product !== worldSize) {
    throw new RangeError(`layout: TP x CP x PP x DP = ${product} does not equal the world size ${worldSize} (T02-15)`);
  }
  // Megatron's checks: heads divide by TP; KV heads a multiple or divisor of TP (T02-15).
  if (m.heads % layout.tp !== 0) throw new RangeError(`layout.tp (${layout.tp}) must divide the ${m.heads} attention heads (T02-15)`);
  if (m.kvHeads % layout.tp !== 0 && layout.tp % m.kvHeads !== 0) {
    throw new RangeError(`layout.tp (${layout.tp}) must be a multiple or divisor of the ${m.kvHeads} KV heads (T02-15)`);
  }
  // TP stays inside one instance (Megatron Takeaway #1, T02-14).
  if (facts.ranksPerInstance % layout.tp !== 0) {
    throw new RangeError(`layout.tp (${layout.tp}) must divide the ${facts.ranksPerInstance} ranks of one instance (T02-14)`);
  }
  if (layout.pp > m.layers) throw new RangeError(`layout.pp (${layout.pp}) exceeds the ${m.layers} layers`);
  if (input.sequenceLength % layout.cp !== 0) {
    throw new RangeError(`layout.cp (${layout.cp}) must divide the sequence length ${input.sequenceLength}`);
  }
  // Global batch divisible by micro-batch x DP (T02-15).
  if (ctx.sequences % (layout.microBatch * layout.dp) !== 0) {
    throw new RangeError(`layout.microBatch x layout.dp (${layout.microBatch * layout.dp}) must divide the ${ctx.sequences}-sequence global batch (T02-15)`);
  }
  const microBatches = ctx.sequences / (layout.microBatch * layout.dp);
  if (layout.interleavedChunks > 1) {
    if (layout.pp === 1) throw new RangeError('layout.interleavedChunks needs layout.pp above 1');
    if (m.layers % layout.pp !== 0 || (m.layers / layout.pp) % layout.interleavedChunks !== 0) {
      throw new RangeError(`layout.interleavedChunks (${layout.interleavedChunks}) must divide the layers per stage evenly`);
    }
    // Interleaving needs the micro-batch count to be a multiple of p (T02-30).
    if (microBatches % layout.pp !== 0) {
      throw new RangeError(`layout.interleavedChunks needs ${microBatches} micro-batches to be a multiple of layout.pp (${layout.pp}) (T02-30)`);
    }
  }
  const shardings: Sharding[] = ['ddp', 'zero1', 'zero2', 'fsdp', 'hsdp'];
  if (!shardings.includes(layout.sharding)) throw new RangeError(`layout.sharding: unknown mode ${String(layout.sharding)}`);
  const fsdpLike = layout.sharding === 'fsdp' || layout.sharding === 'hsdp';
  if (fsdpLike && layout.gradientSync === 'oncePerStep') {
    throw new RangeError("layout.gradientSync must be 'everyMicroBatch' or 'deferred' for FSDP and HSDP");
  }
  if (!fsdpLike && layout.gradientSync !== 'oncePerStep') {
    throw new RangeError("layout.gradientSync must be 'oncePerStep' for DDP, ZeRO-1 and ZeRO-2");
  }
  if (layout.sharding === 'hsdp') hsdpShardDegree(ctx, layout); // throws when HSDP has no in-instance group
  if (!['none', 'selective', 'full'].includes(layout.recompute)) throw new RangeError("layout.recompute must be 'none', 'selective' or 'full'");
  return microBatches;
}

/** HSDP's sharding group is the DP ranks inside one instance; it replicates across instances (T02-9, W2-14). */
function hsdpShardDegree(ctx: Context, layout: Layout): number {
  const perInstance = ctx.facts.ranksPerInstance / (layout.tp * layout.pp);
  if (layout.cp !== 1) throw new RangeError('layout.sharding hsdp is modelled only with layout.cp = 1');
  if (ctx.input.instanceCount < 2) throw new RangeError('layout.sharding hsdp needs more than one instance');
  if (!Number.isInteger(perInstance) || perInstance < 2 || layout.dp % perInstance !== 0 || layout.dp / perInstance < 2) {
    throw new RangeError('layout.sharding hsdp needs at least two DP ranks inside one instance and at least two replicas');
  }
  return perInstance;
}

/** Evaluates one layout: memory through Calculator B, step-time range and per-link shares. */
export function evaluateLayout(input: ParallelismInput, layout: Layout): Candidate {
  const ctx = buildContext(input);
  const microBatches = validateLayout(ctx, layout);
  return evaluateValid(ctx, layout, microBatches);
}

function evaluateValid(ctx: Context, layout: Layout, microBatches: number): Candidate {
  const { input, facts } = ctx;
  const model = input.model;
  const { tp, cp, pp, dp, interleavedChunks: v, microBatch: b } = layout;
  const n = dp * cp; // CP ranks join the DP group for the gradient reduction (T02-26)
  const shardDegree = layout.sharding === 'hsdp' ? hsdpShardDegree(ctx, layout) : n;
  const zeroStage: ZeroStage =
    layout.sharding === 'ddp' ? 0 : layout.sharding === 'zero1' ? 1 : layout.sharding === 'zero2' ? 2 : 3;
  const deferred = layout.gradientSync === 'deferred';

  const memory = memoryBudget({
    model,
    optimizer: { row: input.optimizer ?? 'adamMixed', gradientDtype: input.gradientDtype },
    zero: { stage: zeroStage, degree: shardDegree },
    tensorParallel: { degree: tp, sequenceParallel: tp > 1 }, // SP always paired with TP (W2-20)
    pipelineParallel: { degree: pp, interleavedChunks: v },
    contextParallel: cp,
    recompute: layout.recompute,
    activations: input.activations,
    microBatch: b,
    microBatchesPerStep: microBatches,
    sequenceLength: input.sequenceLength,
    logits: input.logits ?? 'fp32Upcast',
    unshardedGradientCopy: deferred, // T03-3
    hbmPerRank: facts.hbmPerRank,
    headroomFraction: ctx.headroom,
  });
  const status: FitStatus = !memory.fits ? 'doesNotFit' : memory.confirmWithMeasuredStep ? 'fitsAboveHeadroom' : 'fits';

  const flags: string[] = [];
  if (model.layers % pp !== 0) flags.push(UNEVEN_STAGES_FLAG); // W2-56
  if (status === 'fitsAboveHeadroom') flags.push('above the headroom target: confirm with a measured step');

  // ---- per-link bytes per step: per GPU on the scale-up link and for PP, per instance for collectives across instances
  const links: LinkLoad[] = [];
  const share = (seconds: number): number => seconds / ctx.computeSeconds;
  const addPerGpu = (dimension: LinkLoad['dimension'], onEfa: boolean, what: string, bytes: number): void => {
    if (bytes <= 0) return;
    const bandwidth = onEfa ? facts.efaBytesPerSecondPerRank : facts.scaleUpBytesPerSecondPerRank;
    const seconds = bytes / bandwidth;
    links.push({ dimension, link: onEfa ? 'EFA' : 'scale-up', what, basis: 'per GPU', bytesPerStep: bytes, bandwidthBytesPerSecond: bandwidth, seconds, shareOfCompute: share(seconds) });
  };
  const addCollectives = (
    dimension: LinkLoad['dimension'],
    what: string,
    members: readonly number[],
    parts: readonly { bytes: number; kind: CollectiveKind; count: number }[],
  ): void => {
    if (members.length < 2) return;
    let bytes = 0;
    let seconds = 0;
    let first: CollectiveLoad | undefined;
    for (const part of parts) {
      if (part.count <= 0 || part.bytes <= 0) continue;
      const load = collectiveLoad(facts, members, part.bytes, part.kind);
      first ??= load;
      bytes += part.count * load.bytes;
      seconds += part.count * load.seconds;
    }
    if (!first) return;
    links.push({ dimension, link: first.link, what, basis: first.basis, bytesPerStep: bytes, bandwidthBytesPerSecond: first.bandwidthBytesPerSecond, seconds, shareOfCompute: share(seconds) });
  };
  const layersPerStage = Math.ceil(model.layers / pp);
  const localSeq = input.sequenceLength / cp;
  const ranks = facts.ranksPerInstance;
  // Rank order TP innermost, then CP, PP, DP (T02-46); rank r sits on instance floor(r / ranks per instance).
  const dpStride = tp * cp * pp;
  if (tp > 1) {
    // T02-13: 8bsh(t-1)/t elements per layer per micro-batch, BF16, per GPU inside the instance.
    const bytes = 8 * b * localSeq * model.hidden * ((tp - 1) / tp) * 2 * layersPerStage * microBatches;
    addPerGpu('TP', false, 'all-reduce and its SP equivalent, every layer and micro-batch', bytes);
  }
  if (cp > 1) {
    // Our reading: all-gather K and V forward (Llama 3's method, W2-30) and reduce-scatter their gradients backward.
    const kvDimPerRank = model.headDim * Math.max(1, model.kvHeads / tp);
    const kvBytes = 2 * b * input.sequenceLength * kvDimPerRank * 2;
    const count = layersPerStage * microBatches;
    const members = Array.from({ length: cp }, (_, c) => c * tp);
    addCollectives('CP', 'K and V all-gather forward, gradient reduce-scatter backward', members, [
      { bytes: kvBytes, kind: 'allGather', count },
      { bytes: kvBytes, kind: 'reduceScatter', count },
    ]);
  }
  if (pp > 1) {
    // T02-31: bsh/t per micro-batch per boundary per direction (scatter-gather), activations forward and gradients back, times v (T02-30); per GPU.
    const bytes = ((b * localSeq * model.hidden) / tp) * 2 * 2 * microBatches * v;
    addPerGpu('PP', dpStride > ranks, 'point-to-point activations and gradients per stage boundary', bytes);
  }
  const paramsPerRank = model.totalParameters / (tp * pp);
  const g = ctx.gradientBytes;
  const paramBytes = paramsPerRank * 2; // BF16 parameters
  const gradBytes = paramsPerRank * g;
  if (layout.sharding === 'hsdp') {
    const f = shardDegree;
    const r = dp / f;
    const gathers = deferred ? microBatches + 1 : E3_FSDP2_PER_UNIT.allGathersPerMicroBatch.value * microBatches;
    const scatters = deferred ? 1 : E3_FSDP2_PER_UNIT.reduceScattersPerMicroBatch.value * microBatches;
    const shardGroup = Array.from({ length: f }, (_, d) => d * dpStride);
    addCollectives('HSDP', `${gathers} all-gathers and ${scatters} reduce-scatters inside the instance`, shardGroup, [
      { bytes: paramBytes, kind: 'allGather', count: gathers },
      { bytes: gradBytes, kind: 'reduceScatter', count: scatters },
    ]);
    // Cross-instance all-reduce of each rank's 1/F gradient shard over R replicas (W2-14, W2-15).
    const allReduces = deferred ? 1 : microBatches;
    const replicaGroup = Array.from({ length: r }, (_, j) => j * f * dpStride);
    addCollectives('HSDP', `${allReduces} all-reduces of the gradient shard across replicas`, replicaGroup, [
      { bytes: gradBytes / f, kind: 'allReduce', count: allReduces },
    ]);
  } else if (n > 1) {
    // CP ranks join the DP group for the gradient reduction (T02-26).
    const group: number[] = [];
    for (let d = 0; d < dp; d += 1) for (let c = 0; c < cp; c += 1) group.push(c * tp + d * dpStride);
    if (layout.sharding === 'fsdp') {
      // E3: 2 all-gathers and 1 reduce-scatter per unit per micro-batch by default; deferred k + 1 and 1.
      const gathers = deferred ? microBatches + 1 : E3_FSDP2_PER_UNIT.allGathersPerMicroBatch.value * microBatches;
      const scatters = deferred ? 1 : E3_FSDP2_PER_UNIT.reduceScattersPerMicroBatch.value * microBatches;
      addCollectives('FSDP', `${gathers} parameter all-gathers and ${scatters} gradient reduce-scatters`, group, [
        { bytes: paramBytes, kind: 'allGather', count: gathers },
        { bytes: gradBytes, kind: 'reduceScatter', count: scatters },
      ]);
    } else if (layout.sharding === 'ddp') {
      // Gradient all-reduce once per step (T02-4, T02-60).
      addCollectives('DP', 'gradient all-reduce once per step', group, [{ bytes: gradBytes, kind: 'allReduce', count: 1 }]);
    } else if (layout.sharding === 'zero2') {
      // ZeRO-2 partitions gradients, so DeepSpeed reduces them on every backward pass, not only at the
      // accumulation boundary: `reduce_ready_partitions_and_remove_grads` runs the reduction when
      // `partition_gradients` is set (deepspeed/runtime/zero/stage_1_and_2.py L2293-L2295 at v0.19.9).
      // One gradient reduce-scatter per micro-batch, one parameter all-gather per step.
      addCollectives('DP', `${microBatches} gradient reduce-scatters and one parameter all-gather per step`, group, [
        { bytes: gradBytes, kind: 'reduceScatter', count: microBatches },
        { bytes: paramBytes, kind: 'allGather', count: 1 },
      ]);
    } else {
      // ZeRO-1: reduce-scatter of gradients at the accumulation boundary plus all-gather of updated
      // BF16 parameters, once per step (T02-7, W2-43; stage_1_and_2.py L2294 at v0.19.9).
      addCollectives('DP', 'gradient reduce-scatter and parameter all-gather once per step', group, [
        { bytes: gradBytes, kind: 'reduceScatter', count: 1 },
        { bytes: paramBytes, kind: 'allGather', count: 1 },
      ]);
    }
  }

  const recomputeFactor = RECOMPUTE_FACTOR[layout.recompute];
  // Interleaved 1F1B bubble (p - 1) / (v x m) (T02-30).
  const bubbleFraction = pp > 1 ? (pp - 1) / (v * microBatches) : 0;
  const low = ctx.computeSeconds * recomputeFactor * (1 + bubbleFraction);
  const max = links.reduce((sum, l) => sum + l.seconds, 0);

  return {
    layout,
    description: describe(layout),
    microBatchesPerStep: microBatches,
    memory,
    status,
    flags,
    computeSeconds: ctx.computeSeconds,
    recomputeFactor,
    bubbleFraction,
    links,
    exposedCommunicationSeconds: { min: 0, max },
    stepSeconds: { low, high: low + max, midpoint: low + max / 2 },
  };
}

export function describe(layout: Layout): string {
  const parts = [`TP ${layout.tp}`];
  if (layout.cp > 1) parts.push(`CP ${layout.cp}`);
  if (layout.pp > 1) parts.push(layout.interleavedChunks > 1 ? `PP ${layout.pp} (v ${layout.interleavedChunks})` : `PP ${layout.pp}`);
  const shardName: Record<Sharding, string> = { ddp: 'DDP', zero1: 'ZeRO-1', zero2: 'ZeRO-2', fsdp: 'FSDP', hsdp: 'HSDP' };
  parts.push(`${layout.sharding === 'fsdp' || layout.sharding === 'hsdp' ? shardName[layout.sharding] : 'DP'} ${layout.dp}`);
  const sync = layout.gradientSync === 'deferred' ? ', deferred sync' : layout.gradientSync === 'everyMicroBatch' ? ', sync every micro-batch' : '';
  const shard = layout.sharding === 'zero1' || layout.sharding === 'zero2' ? `, ${shardName[layout.sharding]}` : '';
  const recompute = layout.recompute === 'none' ? 'no recomputation' : `${layout.recompute} recomputation`;
  return `${parts.join(' x ')}${shard}${sync}, micro-batch ${layout.microBatch}, ${recompute}`;
}

function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= n; d += 1) if (n % d === 0) out.push(d);
  return out;
}

/** Calculator C: enumerate, check memory, rank by the midpoint of the step-time range. */
export function sizeParallelism(input: ParallelismInput): ParallelismResult {
  const ctx = buildContext(input);
  const model = input.model;
  const limit = input.limit ?? 20;
  requirePositiveInteger('limit', limit);
  const maxCp = input.maxContextParallel ?? 8;
  requirePositiveInteger('maxContextParallel', maxCp);
  const recomputeModes = input.recomputeModes ?? (['none', 'full'] as const);
  if (recomputeModes.length === 0) throw new RangeError('recomputeModes must list at least one mode');
  const ranks = ctx.facts.ranksPerInstance;

  const tpOptions = divisors(ranks).filter(
    (t) => model.heads % t === 0 && (model.kvHeads % t === 0 || t % model.kvHeads === 0),
  );
  // CP only from 8K tokens (T02-25), with two chunks per rank for the causal mask (W2-30).
  const cpOptions = [1, 2, 4, 8, 16, 32].filter(
    (c) => c === 1 || (c <= maxCp && input.sequenceLength >= 8_192 && input.sequenceLength % (2 * c) === 0),
  );

  const survivors: Candidate[] = [];
  const aboveHeadroom: Candidate[] = [];
  let evaluated = 0;
  let doesNotFit = 0;

  for (const tp of tpOptions) {
    for (const cp of cpOptions) {
      if (ctx.worldSize % (tp * cp) !== 0) continue;
      for (const pp of divisors(ctx.worldSize / (tp * cp))) {
        if (pp > model.layers) continue;
        const dp = ctx.worldSize / (tp * cp * pp);
        if (ctx.sequences % dp !== 0) continue;
        for (const b of divisors(ctx.sequences / dp)) {
          const m = ctx.sequences / (dp * b);
          const vOptions =
            pp > 1 && model.layers % pp === 0 && m % pp === 0 ? divisors(model.layers / pp) : [1];
          for (const v of vOptions) {
            for (const sharding of shardingOptions(ctx, tp, cp, pp, dp)) {
              const syncs: GradientSync[] =
                sharding === 'fsdp' || sharding === 'hsdp' ? ['everyMicroBatch', 'deferred'] : ['oncePerStep'];
              for (const gradientSync of syncs) {
                for (const recompute of recomputeModes) {
                  const layout: Layout = { tp, cp, pp, dp, interleavedChunks: v, sharding, microBatch: b, recompute, gradientSync };
                  const candidate = evaluateValid(ctx, layout, m);
                  evaluated += 1;
                  if (candidate.status === 'fits') survivors.push(candidate);
                  else if (candidate.status === 'fitsAboveHeadroom') aboveHeadroom.push(candidate);
                  else doesNotFit += 1;
                }
              }
            }
          }
        }
      }
    }
  }

  const rank = (a: Candidate, c: Candidate): number =>
    a.stepSeconds.midpoint - c.stepSeconds.midpoint ||
    a.memory.totalBytes - c.memory.totalBytes ||
    a.description.localeCompare(c.description);
  survivors.sort(rank);
  aboveHeadroom.sort(rank);

  return {
    worldSize: ctx.worldSize,
    sequencesPerStep: ctx.sequences,
    tokensPerStep: ctx.tokensPerStep,
    computeSeconds: ctx.computeSeconds,
    mfu: ctx.mfu,
    assumptions: [
      `MFU ${ctx.mfu} for compute${input.mfu === undefined ? ' (default assumption)' : ''}`,
      'recomputation factor 4/3 for full and about 1.0 for selective (our assumption with a flash kernel)',
      'exposed communication is a range from full overlap to none',
      'buffers, gathered FSDP layers and fragmentation are not modelled; the headroom target covers them',
    ],
    survivors: survivors.slice(0, limit),
    aboveHeadroom: aboveHeadroom.slice(0, limit),
    counts: { evaluated, survivors: survivors.length, aboveHeadroom: aboveHeadroom.length, doesNotFit },
    measureNext: MEASURE_NEXT,
  };
}

function shardingOptions(ctx: Context, tp: number, cp: number, pp: number, dp: number): Sharding[] {
  const n = dp * cp;
  if (n === 1) return ['ddp'];
  const out: Sharding[] = ['ddp', 'zero1', 'zero2', 'fsdp'];
  const perInstance = ctx.facts.ranksPerInstance / (tp * pp);
  if (
    cp === 1 &&
    ctx.input.instanceCount > 1 &&
    Number.isInteger(perInstance) &&
    perInstance >= 2 &&
    dp % perInstance === 0 &&
    dp / perInstance >= 2
  ) {
    out.push('hsdp');
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// MoE mode
// ---------------------------------------------------------------------------------------------

export interface MoeGrid {
  /** Attention grid: TP x CP x DP x PP = world size, CP fixed at 1 here. */
  tp: number;
  pp: number;
  dp: number;
  /** Expert grid: ETP x EP x EDP x PP = world size, sharing only PP (T02-41, T02-72). */
  etp: number;
  ep: number;
  edp: number;
}

export interface MoeInput {
  model: MoeModelShape;
  instance: InstancePreset;
  instanceCount: number;
  optimizer?: OptimizerRowId;
  gradientDtype?: GradientDtype;
  /** ZeRO stage over DP on the attention grid and EDP on the expert grid; default 1. */
  zeroStage?: ZeroStage;
  headroomFraction?: number;
  /** Bytes per element for dispatch (FP8) and combine (BF16) (T02-39). */
  dispatchBytes?: number;
  combineBytes?: number;
  limit?: number;
}

export interface MoeCandidate {
  grid: MoeGrid;
  description: string;
  worldSize: number;
  attentionGrid: { product: number; matchesWorldSize: boolean };
  expertGrid: { product: number; matchesWorldSize: boolean };
  modelState: {
    attentionGridBytesPerRank: number;
    expertGridBytesPerRank: number;
    totalBytesPerRank: number;
    totalGB: number;
    capacityBytes: number;
    withinHeadroomTarget: boolean;
  };
  expertTraffic: {
    dispatchBytesPerTokenPerMoeLayer: number;
    combineBytesPerTokenPerMoeLayer: number;
    bytesPerTokenPerMoeLayer: number;
    /** With node-limited routing, the dispatch crosses the network at most once per target node. */
    crossNodeDispatchBytesPerTokenPerMoeLayer: number;
    bytesPerTokenAllMoeLayers: number;
    epSpansInstances: boolean;
  };
  activations: 'not modelled; measure a step';
}

export interface MoeResult {
  candidates: MoeCandidate[];
  counts: { evaluated: number; valid: number; withinHeadroom: number };
  wording: string;
  measureNext: string;
}

/**
 * Routed-expert parameters from the published totals: total - activated is the routed experts a
 * token skips, (E - k) of E, so routed = (total - activated) x E / (E - k) [derived; 671B and 37B
 * for DeepSeek-V3, T01-26, with E = 256 and k = 8, T02-71].
 */
export function routedExpertParameters(model: MoeModelShape): number {
  requirePositive('model.totalParameters', model.totalParameters);
  requirePositive('model.activatedParameters', model.activatedParameters);
  requirePositiveInteger('model.routedExperts', model.routedExperts);
  requirePositiveInteger('model.topK', model.topK);
  if (model.topK >= model.routedExperts) throw new RangeError('model.topK must be below model.routedExperts');
  if (model.activatedParameters >= model.totalParameters) throw new RangeError('model.activatedParameters must be below model.totalParameters');
  return ((model.totalParameters - model.activatedParameters) * model.routedExperts) / (model.routedExperts - model.topK);
}

/** Evaluates one MoE grid pair; the world-size checks are outputs, not exceptions. */
export function evaluateMoeGrid(input: MoeInput, grid: MoeGrid): MoeCandidate {
  requirePositiveInteger('instanceCount', input.instanceCount);
  for (const key of ['tp', 'pp', 'dp', 'etp', 'ep', 'edp'] as const) requirePositiveInteger(`grid.${key}`, grid[key]);
  const facts = rankFacts(input.instance);
  const model = input.model;
  requirePositiveInteger('model.layers', model.layers);
  requirePositiveInteger('model.hidden', model.hidden);
  requirePositiveInteger('model.maxNodesPerToken', model.maxNodesPerToken);
  if (model.denseLayers < 0 || model.denseLayers >= model.layers) throw new RangeError('model.denseLayers must be in [0, model.layers)');
  const headroom = input.headroomFraction ?? DEFAULT_HEADROOM.value;
  requireUnitFraction('headroomFraction', headroom);
  const dispatchBytes = input.dispatchBytes ?? 1;
  const combineBytes = input.combineBytes ?? 2;
  requirePositive('dispatchBytes', dispatchBytes);
  requirePositive('combineBytes', combineBytes);
  const zeroStage = input.zeroStage ?? 1;
  const worldSize = facts.ranksPerInstance * input.instanceCount;

  const routed = routedExpertParameters(model);
  const nonRouted = model.totalParameters - routed;
  const opt = optimizerComponents({ row: input.optimizer ?? 'adamMixed', gradientDtype: input.gradientDtype });
  const sharded = (params: number, degree: number): number =>
    (params * opt.weightBytes) / (zeroStage >= 3 ? degree : 1) +
    (params * opt.gradientBytes) / (zeroStage >= 2 ? degree : 1) +
    (params * (opt.masterBytes + opt.stateBytes)) / (zeroStage >= 1 ? degree : 1);
  const attentionGridBytesPerRank = sharded(nonRouted / (grid.tp * grid.pp), grid.dp);
  const expertGridBytesPerRank = sharded(routed / (grid.etp * grid.ep * grid.pp), grid.edp);
  const totalBytesPerRank = attentionGridBytesPerRank + expertGridBytesPerRank;

  // 02 section 3.4: dispatch k x h in FP8, combine k x h in BF16, per token per MoE layer, forward.
  const dispatch = model.topK * model.hidden * dispatchBytes;
  const combine = model.topK * model.hidden * combineBytes;
  const epSpansInstances = grid.etp * grid.ep > facts.ranksPerInstance;
  const crossNode = epSpansInstances ? Math.min(model.topK, model.maxNodesPerToken) * model.hidden * dispatchBytes : 0;
  const moeLayers = model.layers - model.denseLayers;

  const attentionProduct = grid.tp * grid.dp * grid.pp;
  const expertProduct = grid.etp * grid.ep * grid.edp * grid.pp;
  return {
    grid,
    description: `candidate grid to test: attention TP ${grid.tp} x PP ${grid.pp} x DP ${grid.dp}; experts ETP ${grid.etp} x EP ${grid.ep} x EDP ${grid.edp} x PP ${grid.pp}`,
    worldSize,
    attentionGrid: { product: attentionProduct, matchesWorldSize: attentionProduct === worldSize },
    expertGrid: { product: expertProduct, matchesWorldSize: expertProduct === worldSize },
    modelState: {
      attentionGridBytesPerRank,
      expertGridBytesPerRank,
      totalBytesPerRank,
      totalGB: totalBytesPerRank / GB,
      capacityBytes: facts.hbmPerRankBytes,
      withinHeadroomTarget: totalBytesPerRank <= headroom * facts.hbmPerRankBytes,
    },
    expertTraffic: {
      dispatchBytesPerTokenPerMoeLayer: dispatch,
      combineBytesPerTokenPerMoeLayer: combine,
      bytesPerTokenPerMoeLayer: dispatch + combine,
      crossNodeDispatchBytesPerTokenPerMoeLayer: crossNode,
      bytesPerTokenAllMoeLayers: (dispatch + combine) * moeLayers,
      epSpansInstances,
    },
    activations: 'not modelled; measure a step',
  };
}

/** MoE mode: enumerate grid pairs that pass both world-size checks and fit model state within the headroom target. */
export function sizeMoeGrids(input: MoeInput): MoeResult {
  const facts = rankFacts(input.instance);
  requirePositiveInteger('instanceCount', input.instanceCount);
  const limit = input.limit ?? 20;
  requirePositiveInteger('limit', limit);
  const model = input.model;
  const world = facts.ranksPerInstance * input.instanceCount;
  const valid: MoeCandidate[] = [];
  let evaluated = 0;
  for (const pp of divisors(world)) {
    if (pp > model.layers) continue;
    for (const tp of divisors(facts.ranksPerInstance).filter((t) => model.heads % t === 0)) {
      if (world % (tp * pp) !== 0) continue;
      const dp = world / (tp * pp);
      for (const etp of [...new Set([1, tp])]) {
        for (const ep of divisors(model.routedExperts)) {
          if (world % (etp * ep * pp) !== 0) continue;
          const edp = world / (etp * ep * pp);
          const candidate = evaluateMoeGrid(input, { tp, pp, dp, etp, ep, edp });
          evaluated += 1;
          if (candidate.attentionGrid.matchesWorldSize && candidate.expertGrid.matchesWorldSize) valid.push(candidate);
        }
      }
    }
  }
  const within = valid.filter((c) => c.modelState.withinHeadroomTarget);
  // Ordering is a convenience for reading, not an estimate: EP inside one instance first, then fewer stages, then less state.
  within.sort(
    (a, c) =>
      Number(a.expertTraffic.epSpansInstances) - Number(c.expertTraffic.epSpansInstances) ||
      a.grid.pp - c.grid.pp ||
      a.modelState.totalBytesPerRank - c.modelState.totalBytesPerRank,
  );
  return {
    candidates: within.slice(0, limit),
    counts: { evaluated, valid: valid.length, withinHeadroom: within.length },
    wording: 'candidate grids to test; activation memory is not modelled; measure a step',
    measureNext: MEASURE_NEXT,
  };
}
