/**
 * Calculator B: the memory budget per rank (section 5; reused by sections 14 and 16).
 *
 * Model state: bytes per parameter by component (01 W2; ZeRO 1910.02054v3 Sec 5 for how the stages
 * divide them; Megatron's FP32 main gradients, T03-17). Activations: Korthikanti et al.'s method
 * adapted to Llama's layer (01 W3, W4), measured in E1 (34 sbh fused SwiGLU, 41 sbh eager, 2 sbh
 * stored under full recomputation). Pipeline stages: the first stage holds L layers' worth under
 * 1F1B whatever p is (2205.05198v1 Eq. 5, T01-62). Logits: 4sbV in FP32 plus their 2sbV BF16
 * source when the loss upcasts (01 W4, wave2-step-maths W1-38).
 *
 * Temporary buffers, gathered FSDP layers and allocator fragmentation are not modelled; the
 * headroom target exists for them (T01-11, T01-63).
 */

import {
  DEFAULT_HEADROOM,
  FP32_GRADIENT_BYTES,
  FROZEN_BASE_BYTES,
  GB,
  OPTIMIZER_ROWS,
  memoryFigureBytes,
  requireFinite,
  requirePositive,
  requirePositiveInteger,
  requireUnitFraction,
  type MemoryFigure,
  type MemoryUnit,
  type OptimizerRowId,
  type Source,
} from './presets';

export type ZeroStage = 0 | 1 | 2 | 3;
export type RecomputeMode = 'none' | 'selective' | 'full';
export type LogitsMode = 'fp32Upcast' | 'bf16Fused';
export type GradientDtype = 'bf16' | 'fp32';

/** The shape fields Calculator B reads. */
export interface MemoryModel {
  layers: number;
  hidden: number;
  ffn: number;
  kvHeads: number;
  headDim: number;
  vocab: number;
  totalParameters: number;
}

/** Activation coefficient: derived from the shape for a fused or eager SwiGLU, or a number. */
export type ActivationSpec = { swiglu: 'fused' | 'eager' } | { sbhPerLayer: number };

export type OptimizerChoice =
  | { row: OptimizerRowId; gradientDtype?: GradientDtype }
  | { frozenBase: 'lora' | 'qlora4bit'; adapterFraction: number };

export interface MemoryInput {
  model: MemoryModel;
  optimizer: OptimizerChoice;
  /** ZeRO stage and the number of ranks the sharded state is divided over (DP, or DP x CP for Megatron). */
  zero: { stage: ZeroStage; degree: number };
  tensorParallel?: { degree: number; sequenceParallel: boolean };
  pipelineParallel?: { degree: number; interleavedChunks?: number };
  contextParallel?: number;
  recompute: RecomputeMode;
  /** Default: the fused-SwiGLU coefficient derived from the shape (34.0 sbh for Llama 3.1 8B). */
  activations?: ActivationSpec;
  microBatch: number;
  /** Micro-batches per pipeline per step; when fewer than p, the first stage holds only that many. */
  microBatchesPerStep?: number;
  sequenceLength: number;
  logits: LogitsMode;
  /** FSDP gradient-sync deferral keeps a full unsharded gradient per rank (T03-3, 03 W1). */
  unshardedGradientCopy?: boolean;
  /** Per-rank HBM figures in their sources' units; the smallest in bytes is the capacity (C02-7). */
  hbmPerRank: readonly MemoryFigure[];
  /** Fraction of HBM past which the result is flagged; default 0.75 (an assumption). */
  headroomFraction?: number;
}

export interface CapacityFigure {
  value: number;
  unit: MemoryUnit;
  bytes: number;
  gb: number;
  source: Source;
}

export interface StageMemory {
  activationBytes: number;
  logitBytes: number;
  totalBytes: number;
}

export interface MemoryResult {
  modelState: {
    weightsBytes: number;
    gradientsBytes: number;
    optimizerBytes: number;
    unshardedGradientBytes: number;
    totalBytes: number;
    bytesPerParameterUnsharded: number;
  };
  activations: {
    sbhPerLayer: number;
    /** Activation bytes per rank for one layer and one micro-batch, before recomputation. */
    perLayerBytes: number;
    /** Bytes stored per layer per micro-batch under full recomputation (2sbh, divided by t with SP). */
    storedPerLayerBytes: number;
    /** Layers' worth the first stage holds (L under 1F1B, times the interleaving factor). */
    firstStageLayersHeld: number;
  };
  logits: { fp32Bytes: number; bf16Bytes: number; totalBytes: number };
  firstStage: StageMemory;
  lastStage: StageMemory;
  peakStage: 'first' | 'last';
  totalBytes: number;
  totalGB: number;
  capacity: { bytes: number; gb: number; figures: CapacityFigure[] };
  headroomFraction: number;
  headroomTargetBytes: number;
  /** Capacity minus total; negative when it does not fit. */
  freeBytes: number;
  fits: boolean;
  confirmWithMeasuredStep: boolean;
  label: string;
}

/**
 * Activation bytes per layer per (s x b x h) for Llama's layer with a FlashAttention-style kernel
 * (01 W3): attention 8sbh + 4 sbh kvDim/h; MLP 4sbh + 6sbF (fused SwiGLU saves its two inputs)
 * or 8sbF (eager also saves the SiLU output). Llama 3.1 8B: 34.0 fused, 41.0 eager; 70B: 33.5, 40.5.
 */
export function activationCoefficient(model: MemoryModel, swiglu: 'fused' | 'eager'): number {
  const kvDim = model.kvHeads * model.headDim;
  const ffnTerm = swiglu === 'fused' ? 6 : 8;
  return 12 + (4 * kvDim) / model.hidden + (ffnTerm * model.ffn) / model.hidden;
}

/** Per-component bytes per parameter for an optimizer choice (01 W2; T03-17 for FP32 main gradients). */
export function optimizerComponents(choice: OptimizerChoice): {
  weightBytes: number;
  gradientBytes: number;
  masterBytes: number;
  stateBytes: number;
  /** Fraction of the parameters that train (1 except for LoRA and QLoRA adapters). */
  trainableFraction: number;
  /** Bytes per frozen parameter (0 unless a frozen base is chosen). */
  frozenBytes: number;
} {
  if ('frozenBase' in choice) {
    requireFinite('optimizer.adapterFraction', choice.adapterFraction);
    if (choice.adapterFraction < 0 || choice.adapterFraction > 1) {
      throw new RangeError(`optimizer.adapterFraction must be in [0, 1] (got ${choice.adapterFraction})`);
    }
    const base = FROZEN_BASE_BYTES[choice.frozenBase];
    if (!base) throw new RangeError(`optimizer.frozenBase must be 'lora' or 'qlora4bit'`);
    // Adapters train as mixed-precision AdamW (16 bytes each), the frozen base holds only its weights (03 W4).
    const adam = OPTIMIZER_ROWS.adamMixed;
    return {
      weightBytes: adam.weightBytes,
      gradientBytes: adam.gradientBytes,
      masterBytes: adam.masterBytes,
      stateBytes: adam.stateBytes,
      trainableFraction: choice.adapterFraction,
      frozenBytes: base.value,
    };
  }
  const row = OPTIMIZER_ROWS[choice.row];
  if (!row) throw new RangeError(`optimizer.row: unknown optimizer row ${String(choice.row)}`);
  if (choice.gradientDtype !== undefined && choice.gradientDtype !== 'bf16' && choice.gradientDtype !== 'fp32') {
    throw new RangeError(`optimizer.gradientDtype must be 'bf16' or 'fp32'`);
  }
  const gradientBytes =
    choice.gradientDtype === 'fp32' ? FP32_GRADIENT_BYTES.value : choice.gradientDtype === 'bf16' ? 2 : row.gradientBytes;
  return {
    weightBytes: row.weightBytes,
    gradientBytes,
    masterBytes: row.masterBytes,
    stateBytes: row.stateBytes,
    trainableFraction: 1,
    frozenBytes: 0,
  };
}

/** Calculator B: model state, activations, logits and headroom per rank. */
export function memoryBudget(input: MemoryInput): MemoryResult {
  const m = input.model;
  requirePositiveInteger('model.layers', m.layers);
  requirePositiveInteger('model.hidden', m.hidden);
  requirePositiveInteger('model.ffn', m.ffn);
  requirePositiveInteger('model.kvHeads', m.kvHeads);
  requirePositiveInteger('model.headDim', m.headDim);
  requirePositiveInteger('model.vocab', m.vocab);
  requirePositive('model.totalParameters', m.totalParameters);
  requirePositiveInteger('zero.degree', input.zero.degree);
  if (![0, 1, 2, 3].includes(input.zero.stage)) throw new RangeError(`zero.stage must be 0, 1, 2 or 3`);
  const t = input.tensorParallel?.degree ?? 1;
  const sp = input.tensorParallel?.sequenceParallel ?? false;
  const p = input.pipelineParallel?.degree ?? 1;
  const v = input.pipelineParallel?.interleavedChunks ?? 1;
  const cp = input.contextParallel ?? 1;
  requirePositiveInteger('tensorParallel.degree', t);
  requirePositiveInteger('pipelineParallel.degree', p);
  requirePositiveInteger('pipelineParallel.interleavedChunks', v);
  requirePositiveInteger('contextParallel', cp);
  requirePositiveInteger('microBatch', input.microBatch);
  requirePositiveInteger('sequenceLength', input.sequenceLength);
  if (input.microBatchesPerStep !== undefined) requirePositiveInteger('microBatchesPerStep', input.microBatchesPerStep);
  if (p > m.layers) throw new RangeError(`pipelineParallel.degree (${p}) exceeds model.layers (${m.layers})`);
  if (input.sequenceLength % cp !== 0) {
    throw new RangeError(`sequenceLength (${input.sequenceLength}) must divide by contextParallel (${cp})`);
  }
  if (!['none', 'selective', 'full'].includes(input.recompute)) throw new RangeError(`recompute must be 'none', 'selective' or 'full'`);
  if (input.logits !== 'fp32Upcast' && input.logits !== 'bf16Fused') throw new RangeError(`logits must be 'fp32Upcast' or 'bf16Fused'`);
  if (!input.hbmPerRank || input.hbmPerRank.length === 0) throw new RangeError('hbmPerRank must list at least one figure');
  const headroomFraction = input.headroomFraction ?? DEFAULT_HEADROOM.value;
  requireUnitFraction('headroomFraction', headroomFraction);

  // ---- model state (01 W2; ZeRO Sec 5: stage 1 shards optimizer, 2 adds gradients, 3 adds weights)
  const opt = optimizerComponents(input.optimizer);
  const paramsPerModelRank = m.totalParameters / (t * p); // TP and PP divide every parameter (02 section 3.2)
  const trainable = paramsPerModelRank * opt.trainableFraction;
  const d = input.zero.degree;
  const stage = input.zero.stage;
  const weightsBytes =
    (paramsPerModelRank * opt.frozenBytes + trainable * opt.weightBytes) / (stage >= 3 ? d : 1);
  const gradientsBytes = (trainable * opt.gradientBytes) / (stage >= 2 ? d : 1);
  const optimizerBytes = (trainable * (opt.masterBytes + opt.stateBytes)) / (stage >= 1 ? d : 1);
  // Deferred FSDP sync accumulates a full unsharded gradient per rank (T03-3, 03 W1).
  const unshardedGradientBytes = input.unshardedGradientCopy ? trainable * opt.gradientBytes : 0;
  const modelStateBytes = weightsBytes + gradientsBytes + optimizerBytes + unshardedGradientBytes;

  // ---- activations (01 W3, W4; E1)
  const coefficient = resolveCoefficient(m, input.activations);
  const localSeq = input.sequenceLength / cp; // CP splits every activation along the sequence (T02-26, W2-27)
  const sbh = localSeq * input.microBatch * m.hidden;
  // TP without SP keeps the two RMSNorm inputs and two shared projection inputs (8 sbh) replicated (01 W4).
  const replicated = Math.min(8, coefficient);
  const perLayerSbh = t === 1 ? coefficient : sp ? coefficient / t : replicated + (coefficient - replicated) / t;
  const perLayerBytes = perLayerSbh * sbh;
  // Full recomputation stores the 2sbh layer input per layer (2205.05198v1 Table 2; E1 measured 2.00).
  const storedPerLayerBytes = (2 * sbh) / (sp ? t : 1);
  // 1F1B: the first stage holds min(p, m) micro-batches of L/p layers; interleaving scales by 1 + (p-1)/(p v) (T01-62).
  const inFlight = Math.min(p, input.microBatchesPerStep ?? p);
  const interleave = v > 1 ? 1 + (p - 1) / (p * v) : 1;
  const firstStageLayersHeld = (m.layers / p) * inFlight * interleave;
  const lastStageLayersHeld = m.layers / p; // one micro-batch in flight on the last stage (W2-54)
  const stageActivations = (layersHeld: number): number =>
    input.recompute === 'full'
      ? storedPerLayerBytes * layersHeld + perLayerBytes // plus one layer's working set during its backward (01 W4)
      : perLayerBytes * layersHeld; // selective recomputation drops only the attention scores, which a flash kernel never stores (02 section 3)

  // ---- logits on the last stage: 4sbV FP32 plus 2sbV BF16 when upcast; vocabulary-parallel over t (01 W4)
  const tokens = localSeq * input.microBatch;
  const bf16Bytes = (2 * tokens * m.vocab) / t;
  const fp32Bytes = input.logits === 'fp32Upcast' ? (4 * tokens * m.vocab) / t : 0;
  const logitBytes = fp32Bytes + bf16Bytes;

  const firstAct = stageActivations(firstStageLayersHeld);
  const lastAct = stageActivations(lastStageLayersHeld);
  const firstStage: StageMemory =
    p === 1
      ? { activationBytes: firstAct, logitBytes, totalBytes: modelStateBytes + firstAct + logitBytes }
      : { activationBytes: firstAct, logitBytes: 0, totalBytes: modelStateBytes + firstAct };
  const lastStage: StageMemory =
    p === 1 ? firstStage : { activationBytes: lastAct, logitBytes, totalBytes: modelStateBytes + lastAct + logitBytes };
  const peakStage = lastStage.totalBytes > firstStage.totalBytes ? 'last' : 'first';
  const totalBytes = Math.max(firstStage.totalBytes, lastStage.totalBytes);

  // ---- capacity in the sources' units, converted explicitly (C02-7: the smaller figure is the conservative one)
  const figures: CapacityFigure[] = input.hbmPerRank.map((f) => {
    const bytes = memoryFigureBytes(f);
    return { value: f.value, unit: f.unit, bytes, gb: bytes / GB, source: f.source };
  });
  const capacityBytes = Math.min(...figures.map((f) => f.bytes));
  const headroomTargetBytes = headroomFraction * capacityBytes;

  return {
    modelState: {
      weightsBytes,
      gradientsBytes,
      optimizerBytes,
      unshardedGradientBytes,
      totalBytes: modelStateBytes,
      bytesPerParameterUnsharded:
        opt.frozenBytes + opt.trainableFraction * (opt.weightBytes + opt.gradientBytes + opt.masterBytes + opt.stateBytes),
    },
    activations: { sbhPerLayer: coefficient, perLayerBytes, storedPerLayerBytes, firstStageLayersHeld },
    logits: { fp32Bytes, bf16Bytes, totalBytes: logitBytes },
    firstStage,
    lastStage,
    peakStage,
    totalBytes,
    totalGB: totalBytes / GB,
    capacity: { bytes: capacityBytes, gb: capacityBytes / GB, figures },
    headroomFraction,
    headroomTargetBytes,
    freeBytes: capacityBytes - totalBytes,
    fits: totalBytes <= capacityBytes,
    confirmWithMeasuredStep: totalBytes > headroomTargetBytes,
    label: 'estimate; confirm with a measured step',
  };
}

/** Model state alone for N parameters at a byte count and no sharding (01 W2, 03 W4). */
export function modelStateBytes(parameters: number, bytesPerParameter: number): number {
  requirePositive('parameters', parameters);
  requirePositive('bytesPerParameter', bytesPerParameter);
  return parameters * bytesPerParameter;
}

function resolveCoefficient(model: MemoryModel, spec: ActivationSpec | undefined): number {
  if (spec === undefined) return activationCoefficient(model, 'fused');
  if ('sbhPerLayer' in spec) {
    requirePositive('activations.sbhPerLayer', spec.sbhPerLayer);
    return spec.sbhPerLayer;
  }
  if (spec.swiglu !== 'fused' && spec.swiglu !== 'eager') throw new RangeError(`activations.swiglu must be 'fused' or 'eager'`);
  return activationCoefficient(model, spec.swiglu);
}
