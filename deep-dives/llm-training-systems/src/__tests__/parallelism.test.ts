import { describe, expect, it } from 'vitest';
import { DEEPSEEK_V3, DENSE_MODELS, GB, INSTANCES, moeShapeOf, rankFacts, shapeOf } from '../lib/presets';
import {
  MEASURE_NEXT,
  UNEVEN_STAGES_FLAG,
  collectiveLoad,
  evaluateLayout,
  evaluateMoeGrid,
  routedExpertParameters,
  sizeMoeGrids,
  sizeParallelism,
  type Candidate,
  type Layout,
  type MoeInput,
  type ParallelismInput,
} from '../lib/parallelism';

const m8 = shapeOf(DENSE_MODELS['llama-3.1-8b']);
const m70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const gb = (bytes: number) => bytes / GB;

const layout = (overrides: Partial<Layout>): Layout => ({
  tp: 1,
  cp: 1,
  pp: 1,
  dp: 1,
  interleavedChunks: 1,
  sharding: 'zero1',
  microBatch: 1,
  recompute: 'none',
  gradientSync: 'oncePerStep',
  ...overrides,
});
const link = (c: Candidate, dimension: string, on: 'EFA' | 'scale-up') => {
  const found = c.links.find((l) => l.dimension === dimension && l.link === on);
  if (!found) throw new Error(`no ${dimension} load on ${on}`);
  return found;
};

/** 02 section 3.2: 70B on 32 p5.48xlarge, 8,192 tokens, a 4.2M-token (512-sequence) batch, 6N compute. */
const in70: ParallelismInput = {
  model: m70,
  instance: INSTANCES['p5.48xlarge'],
  instanceCount: 32,
  sequenceLength: 8_192,
  globalBatch: { tokens: 4_194_304 },
  attention: 'none',
};

describe('02 section 3.2 and wave2-parallelism W2-42, W2-44: 70B on 32 p5.48xlarge', () => {
  const pipeline = (v: number) =>
    evaluateLayout({ ...in70, activations: { sbhPerLayer: 34 } }, layout({ tp: 8, pp: 4, dp: 8, interleavedChunks: v }));
  const fsdp = (microBatch: number, recompute: 'none' | 'full') =>
    evaluateLayout(in70, layout({ tp: 8, dp: 32, sharding: 'fsdp', gradientSync: 'everyMicroBatch', microBatch, recompute }));

  // Tolerance: "about 38" to the GB (0.5); 17.5 s to a tenth (0.05).
  it('W2-42: TP 8 x PP 4 x DP 8 with ZeRO-1 and v = 5 passes at about 38 GB', () => {
    const c = pipeline(5);
    expect(Math.abs(c.memory.totalGB - 38)).toBeLessThan(0.5);
    expect(c.status).toBe('fits');
  });

  it('02 section 3.2: compute is 17.5 s per step at 40% MFU', () => {
    expect(Math.abs(pipeline(5).computeSeconds - 17.5)).toBeLessThan(0.05);
  });

  // Tolerance: the register prints 4.7% and 0.94%, so 0.05 and 0.005 points.
  it('02 section 3.2: the bubble is 4.7% at v = 1 and 0.94% at v = 5, with m = 64', () => {
    expect(pipeline(1).microBatchesPerStep).toBe(64);
    expect(Math.abs(pipeline(1).bubbleFraction - 0.047)).toBeLessThan(0.0005);
    expect(Math.abs(pipeline(5).bubbleFraction - 0.0094)).toBeLessThan(0.00005);
  });

  // Tolerance: "about 1%" to the whole point.
  it('W2-42: DP traffic is about 1% of a 17.5 s step and rides EFA', () => {
    expect(Math.abs(link(pipeline(5), 'DP', 'EFA').shareOfCompute - 0.01)).toBeLessThan(0.005);
  });

  // W1-23 prints 38.8 GB for this layout (FP32 logits only, V = 128,000, 34 sbh). Calculator B counts the
  // FP32 logits and their BF16 source at V = 128,256 (01 W4) and 33.5 sbh, which gives 43.0 GB. Both pass.
  it('W2-44: TP 8 x FSDP 32 with 16 sequences as one micro-batch and full recomputation passes (43.0 GB)', () => {
    const c = fsdp(16, 'full');
    expect(c.microBatchesPerStep).toBe(1);
    expect(c.status).toBe('fits');
    expect(Math.abs(c.memory.totalGB - 43)).toBeLessThan(0.05);
  });

  // One FSDP member per instance, so per-instance pricing equals W2-44's per-GPU count: 3 x 136.7 GB per
  // instance (8 groups x 31/32 x 17.64 GB) over 400 GB/s, the same 1.03 s as 51.3 GB per GPU over 50 GB/s.
  // Tolerance: 410.1 GB and 1.03 s as printed; "about 6%" to the whole point.
  it('W2-44: its FSDP traffic is 410.1 GB per instance (51.3 GB per GPU), 1.03 s, about 6% of the 17.5 s compute', () => {
    const f = link(fsdp(16, 'full'), 'FSDP', 'EFA');
    expect(f.basis).toBe('per instance');
    expect(f.bandwidthBytesPerSecond).toBe(400 * GB);
    expect(Math.abs(gb(f.bytesPerStep) - 410.1)).toBeLessThan(0.05);
    expect(Math.abs(gb(f.bytesPerStep) / 8 - 51.3)).toBeLessThan(0.05);
    expect(Math.abs(f.seconds - 1.03)).toBeLessThan(0.005);
    expect(Math.abs(f.shareOfCompute - 0.06)).toBeLessThan(0.005);
  });

  it('W2-44: full recomputation lengthens the step to about 23.3 s, so the share is about 4.4%', () => {
    const c = fsdp(16, 'full');
    expect(c.recomputeFactor).toBeCloseTo(4 / 3, 12);
    expect(Math.abs(c.stepSeconds.low - 23.3)).toBeLessThan(0.1);
    expect(Math.abs(link(c, 'FSDP', 'EFA').seconds / c.stepSeconds.low - 0.044)).toBeLessThan(0.0005);
  });

  // Tolerance: 6,561.5 GB per instance (48 x 136.7 GB) to 0.05; 820 GB per GPU and 16.4 s as printed; 94% to the whole point.
  it('W2-44: at micro-batch 1 with per-micro-batch sync it is 16 cycles, 6,561.5 GB per instance (820 GB per GPU), 16.4 s, about 94%', () => {
    const f = link(fsdp(1, 'none'), 'FSDP', 'EFA');
    expect(fsdp(1, 'none').microBatchesPerStep).toBe(16);
    expect(Math.abs(gb(f.bytesPerStep) - 6_561.5)).toBeLessThan(0.05);
    expect(Math.abs(gb(f.bytesPerStep) / 8 - 820)).toBeLessThan(0.5);
    expect(Math.abs(f.seconds - 16.4)).toBeLessThan(0.05);
    expect(Math.abs(f.shareOfCompute - 0.94)).toBeLessThan(0.005);
  });

  it('the step-time range runs from full overlap to none', () => {
    const c = pipeline(5);
    const sum = c.links.reduce((s, l) => s + l.seconds, 0);
    expect(c.exposedCommunicationSeconds).toEqual({ min: 0, max: sum });
    expect(c.stepSeconds.low).toBeCloseTo(c.computeSeconds * (1 + c.bubbleFraction), 9);
    expect(c.stepSeconds.high).toBeCloseTo(c.stepSeconds.low + sum, 9);
    expect(link(c, 'TP', 'scale-up').basis).toBe('per GPU');
    expect(link(c, 'PP', 'EFA').basis).toBe('per GPU');
    expect(link(c, 'PP', 'EFA').bandwidthBytesPerSecond).toBe(50 * GB);
    expect(link(c, 'DP', 'EFA').basis).toBe('per instance');
  });
});

describe('section 14 step 12 and Calculator C: enumeration and ranking', () => {
  const result = sizeParallelism({ ...in70, limit: 100_000 });

  it('02 section 3.2: both published layouts survive the enumeration', () => {
    const names = result.survivors.map((c) => c.description);
    expect(names).toContain('TP 8 x PP 4 (v 5) x DP 8, ZeRO-1, micro-batch 1, no recomputation');
    expect(names).toContain('TP 8 x FSDP 32, sync every micro-batch, micro-batch 16, full recomputation');
  });

  it('survivors are ranked by the midpoint of the step-time range and every one multiplies to the world size', () => {
    expect(result.survivors.length).toBeGreaterThan(10);
    for (let i = 1; i < result.survivors.length; i += 1) {
      expect(result.survivors[i].stepSeconds.midpoint).toBeGreaterThanOrEqual(result.survivors[i - 1].stepSeconds.midpoint);
    }
    for (const c of result.survivors) {
      const { tp, cp, pp, dp } = c.layout;
      expect(tp * cp * pp * dp).toBe(256);
      expect(c.status).toBe('fits');
      expect(Number.isFinite(c.stepSeconds.midpoint)).toBe(true);
    }
    for (const c of result.aboveHeadroom) expect(c.status).toBe('fitsAboveHeadroom');
    expect(result.counts.evaluated).toBe(result.counts.survivors + result.counts.aboveHeadroom + result.counts.doesNotFit);
  });

  it('02 section 3.5 step 12: the result ends with "measure these two or three"', () => {
    expect(result.measureNext).toBe(MEASURE_NEXT);
    expect(result.measureNext).toMatch(/^measure these two or three/);
    expect(Object.keys(result).at(-1)).toBe('measureNext');
  });

  it('the default limit keeps the 20 best', () => {
    expect(sizeParallelism(in70).survivors.length).toBe(20);
  });
});

describe('section 14 example 2 and wave2-parallelism G7: 70B on 4 p5en.48xlarge (32 H200)', () => {
  const in32: ParallelismInput = {
    model: m70,
    instance: INSTANCES['p5en.48xlarge'],
    instanceCount: 4,
    sequenceLength: 8_192,
    globalBatch: { sequences: 512 },
  };

  // Tolerance: one decimal as G7 prints, 0.05 GB.
  it('G7: ZeRO-1 over 32 is 308.7 GB of state and fails; ZeRO-2 is 172.0 GB and fails', () => {
    const z1 = evaluateLayout(in32, layout({ dp: 32, sharding: 'zero1' }));
    const z2 = evaluateLayout(in32, layout({ dp: 32, sharding: 'zero2' }));
    expect(Math.abs(gb(z1.memory.modelState.totalBytes) - 308.7)).toBeLessThan(0.05);
    expect(Math.abs(gb(z2.memory.modelState.totalBytes) - 172.0)).toBeLessThan(0.05);
    expect(z1.status).toBe('doesNotFit');
    expect(z2.status).toBe('doesNotFit');
  });

  it('G7, W2-52: HSDP sharded inside one instance is 141.1 GB of state, above the 141 GB capacity, and fails', () => {
    const c = evaluateLayout(in32, layout({ dp: 32, sharding: 'hsdp', gradientSync: 'everyMicroBatch' }));
    expect(Math.abs(gb(c.memory.modelState.totalBytes) - 141.1)).toBeLessThan(0.05);
    expect(c.memory.modelState.totalBytes).toBeGreaterThan(c.memory.capacity.bytes);
    expect(c.memory.capacity.figures.map((f) => `${f.value} ${f.unit}`)).toEqual(['141 GiB', '141 GB']);
    expect(c.status).toBe('doesNotFit');
  });

  it('G7: TP 8 x DP 4 with ZeRO-1 is 85.0 GB and passes; 102.6 GB with FP32 gradients', () => {
    const bf16 = evaluateLayout(in32, layout({ tp: 8, dp: 4 }));
    const fp32 = evaluateLayout({ ...in32, gradientDtype: 'fp32' }, layout({ tp: 8, dp: 4 }));
    expect(Math.abs(bf16.memory.totalGB - 85.0)).toBeLessThan(0.05);
    expect(Math.abs(fp32.memory.totalGB - 102.6)).toBeLessThan(0.05);
    expect(bf16.status).toBe('fits');
    expect(fp32.status).toBe('fits');
  });

  it('G7: TP 8 x PP 2 x DP 2 with ZeRO-1: first stage 66.6 GB, last stage 56.1 GB, bubble 1/256', () => {
    const c = evaluateLayout(in32, layout({ tp: 8, pp: 2, dp: 2 }));
    expect(Math.abs(gb(c.memory.firstStage.totalBytes) - 66.6)).toBeLessThan(0.05);
    expect(Math.abs(gb(c.memory.lastStage.totalBytes) - 56.1)).toBeLessThan(0.05);
    expect(c.bubbleFraction).toBe(1 / 256);
    expect(c.status).toBe('fits');
  });

  // G7 prints 58.0 GB for this row: it adds 3.42 GB for two gathered layers in flight (its reading of FSDP2
  // prefetch). Calculator B leaves gathered layers to the headroom target, so it gives 54.6 GB.
  it('G7: flat FSDP 32 with full recomputation is 35.28 + 12.99 + 6.30 = 54.6 GB before gathered layers', () => {
    const c = evaluateLayout(in32, layout({ dp: 32, sharding: 'fsdp', gradientSync: 'everyMicroBatch', recompute: 'full' }));
    expect(Math.abs(c.memory.totalGB - 54.6)).toBeLessThan(0.05);
    expect(c.status).toBe('fits');
  });

  it('W2-55: on 32 H100 the same TP 8 x DP 4 needs 85.0 GB and fails; full recomputation fits on paper at 64.1 GB', () => {
    const h100 = { ...in32, instance: INSTANCES['p5.48xlarge'] };
    const none = evaluateLayout(h100, layout({ tp: 8, dp: 4 }));
    const full = evaluateLayout(h100, layout({ tp: 8, dp: 4, recompute: 'full' }));
    expect(Math.abs(none.memory.totalGB - 85.0)).toBeLessThan(0.05);
    expect(none.status).toBe('doesNotFit');
    expect(Math.abs(full.memory.totalGB - 64.1)).toBeLessThan(0.05);
    // Above the 60 GB headroom target on 80 GB, so it is flagged rather than passed outright.
    expect(full.status).toBe('fitsAboveHeadroom');
    expect(full.flags.join(' ')).toMatch(/measured step/);
  });
});

describe('section 8, 03 W1 and E3: 8B on 4 p5.48xlarge, 8 micro-batches', () => {
  const in8: ParallelismInput = {
    model: m8,
    instance: INSTANCES['p5.48xlarge'],
    instanceCount: 4,
    sequenceLength: 8_192,
    globalBatch: { sequences: 256 },
  };
  const at = (sharding: 'fsdp' | 'hsdp', gradientSync: 'everyMicroBatch' | 'deferred', input: ParallelismInput = in8) =>
    evaluateLayout(input, layout({ dp: 32, sharding, gradientSync }));
  const efaGB = (c: Candidate, dimension: string) => gb(link(c, dimension, 'EFA').bytesPerStep);

  // Per instance across EFA, S = 16.06 GB of BF16 parameters (our reading, supported by AWS's nccl-tests
  // sample). The per-GPU figures these replace were 373, 24, 156, 3 and 498 GB per GPU at 50 GB/s.
  // Tolerance: whole GB, 0.5.
  it('03 W1, E3: flat FSDP 32 moves 24 collectives x 3/4 x 16.06 = 289 GB per instance per step at the defaults', () => {
    const c = at('fsdp', 'everyMicroBatch');
    expect(c.microBatchesPerStep).toBe(8);
    expect(link(c, 'FSDP', 'EFA').basis).toBe('per instance');
    expect(Math.abs(efaGB(c, 'FSDP') - 289)).toBeLessThan(0.5);
    expect(Math.abs(link(c, 'FSDP', 'EFA').seconds - 0.72)).toBeLessThan(0.005);
  });

  it('03 W1: HSDP (shard 8, replicate 4) moves 8 all-reduces x 2 x 3/4 x 16.06 = 193 GB per instance; the rest stays inside', () => {
    const c = at('hsdp', 'everyMicroBatch');
    expect(Math.abs(efaGB(c, 'HSDP') - 193)).toBeLessThan(0.5);
    // Equal to each GPU's 24.1 GB over its 50 GB/s share.
    expect(Math.abs(link(c, 'HSDP', 'EFA').seconds - 24.09 / 50)).toBeLessThan(0.001);
    expect(link(c, 'HSDP', 'scale-up').basis).toBe('per GPU');
  });

  it('03 W1, E3: deferred sync cuts flat FSDP to 10 x 12.05 = 120 GB per instance and HSDP to 24.1 GB', () => {
    expect(Math.abs(efaGB(at('fsdp', 'deferred'), 'FSDP') - 120)).toBeLessThan(0.5);
    expect(Math.abs(efaGB(at('hsdp', 'deferred'), 'HSDP') - 24.1)).toBeLessThan(0.05);
  });

  it('03 W1: flat FSDP with an FP32 reduce moves 16 x 12.05 + 8 x 24.09 = 385 GB per instance', () => {
    const c = at('fsdp', 'everyMicroBatch', { ...in8, gradientDtype: 'fp32' });
    expect(Math.abs(efaGB(c, 'FSDP') - 385)).toBeLessThan(0.5);
  });

  it('T03-3: deferral adds a full unsharded gradient per rank (16.06 GB for 8B)', () => {
    expect(at('fsdp', 'everyMicroBatch').memory.modelState.unshardedGradientBytes).toBe(0);
    expect(Math.abs(gb(at('fsdp', 'deferred').memory.modelState.unshardedGradientBytes) - 16.06)).toBeLessThan(0.005);
  });

  it('DeepSpeed v0.19.9 stage_1_and_2.py L2294: ZeRO-2 reduce-scatters on every micro-batch, ZeRO-1 once per step', () => {
    const zero = (sharding: 'zero1' | 'zero2') =>
      evaluateLayout(in8, layout({ dp: 32, sharding, gradientSync: 'oncePerStep' }));
    // ZeRO-1: one reduce-scatter plus one all-gather, 2 x 3/4 x 16.06 = 24.1 GB per instance.
    expect(Math.abs(efaGB(zero('zero1'), 'DP') - 24.1)).toBeLessThan(0.05);
    // ZeRO-2: 8 reduce-scatters plus one all-gather, 9 x 12.05 = 108.4 GB per instance.
    expect(Math.abs(efaGB(zero('zero2'), 'DP') - 108.4)).toBeLessThan(0.05);
  });
});

describe("collective pricing (our reading, supported by AWS's nccl-tests sample)", () => {
  const p5 = rankFacts(INSTANCES['p5.48xlarge']);
  const sixteenGiB = 17_179_869_184;

  it('nccl-tests sample: the per-instance bound for 16 GiB across 2 p5.48xlarge (43 ms) sits under the measured 66,132 us', () => {
    const load = collectiveLoad(p5, Array.from({ length: 16 }, (_, r) => r), sixteenGiB, 'allReduce');
    expect(load.instances).toBe(2);
    expect(load.basis).toBe('per instance');
    expect(Math.abs(load.seconds - 0.043)).toBeLessThan(0.0005);
    expect(load.seconds).toBeLessThan(66_132e-6);
    // Pricing each GPU's 2(n-1)/n x S at its 50 GB/s share would need at least 0.64 s.
    expect((2 * (15 / 16) * sixteenGiB) / p5.efaBytesPerSecondPerRank).toBeGreaterThan(0.64);
  });

  it('T02-60: a group inside one instance runs per GPU over NVLink at 2(n-1)/n x S for an all-reduce', () => {
    const load = collectiveLoad(p5, Array.from({ length: 8 }, (_, r) => r), 8 * GB, 'allReduce');
    expect(load.link).toBe('scale-up');
    expect(load.bytes).toBeCloseTo(2 * (7 / 8) * 8 * GB, 0);
    expect(load.seconds).toBeCloseTo(load.bytes / (450 * GB), 12);
  });

  it('a group with one member per instance prices the same per instance as per GPU', () => {
    const members = Array.from({ length: 4 }, (_, i) => i * 8);
    const load = collectiveLoad(p5, members, 8 * GB, 'allGather');
    expect(load.membersPerInstance).toBe(1);
    expect(load.seconds).toBeCloseTo(((3 / 4) * 8 * GB) / (50 * GB), 12);
  });

  it('throws a RangeError on an empty group or negative bytes', () => {
    expect(() => collectiveLoad(p5, [], 1, 'allGather')).toThrow(/members/);
    expect(() => collectiveLoad(p5, [0, 1], -1, 'allGather')).toThrow(/bytesPerCollective/);
  });
});

describe('T03-38 and 03 W3: trn2.48xlarge', () => {
  // Sequence length and batch are not stated by T03-38; 8,192 tokens and micro-batch 1 are our choice.
  it('T03-38: TP 4 x FSDP 16 for Llama3-8B on 64 ranks of 24 GiB passes the memory check', () => {
    const c = evaluateLayout(
      { model: m8, instance: INSTANCES['trn2.48xlarge'], instanceCount: 1, sequenceLength: 8_192, globalBatch: { sequences: 16 } },
      layout({ tp: 4, dp: 16, sharding: 'fsdp', gradientSync: 'everyMicroBatch' }),
    );
    expect(c.status).toBe('fits');
    expect(c.memory.capacity.figures.map((f) => `${f.value} ${f.unit}`)).toEqual(['24 GiB']);
    // 03 W3: model state 8.03e9 x 16 / 64 = 2.0 GB per rank.
    expect(Math.abs(gb(c.memory.modelState.totalBytes) - 2.0)).toBeLessThan(0.05);
  });
});

describe('wave2-parallelism W2-56: uneven stages', () => {
  it('W2-56: PP 32 on 80 layers is flagged with the framework settings that allow it', () => {
    const c = evaluateLayout(in70, layout({ tp: 8, pp: 32, dp: 1 }));
    expect(c.flags).toContain(UNEVEN_STAGES_FLAG);
    expect(UNEVEN_STAGES_FLAG).toMatch(/--decoder-first\/last-pipeline-num-layers/);
    expect(evaluateLayout(in70, layout({ tp: 8, pp: 4, dp: 8 })).flags).not.toContain(UNEVEN_STAGES_FLAG);
  });
});

describe('02 section 3.4, T02-40 and T02-41: MoE mode', () => {
  const moe: MoeInput = { model: moeShapeOf(DEEPSEEK_V3), instance: INSTANCES['p5.48xlarge'], instanceCount: 256 };
  const deepseek = evaluateMoeGrid(moe, { tp: 1, pp: 16, dp: 128, etp: 1, ep: 64, edp: 2 });

  // Tolerance: the register prints whole KB (decimal) and "about 10 MB".
  it('02 section 3.4: dispatch 57 KB in FP8 plus combine 115 KB in BF16, about 172 KB per token per MoE layer', () => {
    const t = deepseek.expertTraffic;
    expect(Math.abs(t.dispatchBytesPerTokenPerMoeLayer / 1e3 - 57)).toBeLessThan(0.5);
    expect(Math.abs(t.combineBytesPerTokenPerMoeLayer / 1e3 - 115)).toBeLessThan(0.5);
    expect(Math.abs(t.bytesPerTokenPerMoeLayer / 1e3 - 172)).toBeLessThan(0.5);
  });

  it('02 section 3.4: node-limited routing sends at most 4 dispatch copies across nodes, 29 KB', () => {
    expect(deepseek.expertTraffic.epSpansInstances).toBe(true);
    expect(Math.abs(deepseek.expertTraffic.crossNodeDispatchBytesPerTokenPerMoeLayer / 1e3 - 29)).toBeLessThan(0.5);
  });

  it('02 section 3.4: about 10 MB of forward dispatch-plus-combine per token across 58 MoE layers', () => {
    expect(Math.abs(deepseek.expertTraffic.bytesPerTokenAllMoeLayers / 1e6 - 10)).toBeLessThan(0.5);
  });

  it("T02-40, T02-41: DeepSeek-V3's PP 16, EP 64, EDP 2 layout passes both world-size checks on 2,048 ranks", () => {
    expect(deepseek.worldSize).toBe(2_048);
    expect(deepseek.attentionGrid).toEqual({ product: 2_048, matchesWorldSize: true });
    expect(deepseek.expertGrid).toEqual({ product: 2_048, matchesWorldSize: true });
    expect(deepseek.activations).toBe('not modelled; measure a step');
    expect(deepseek.description).toMatch(/^candidate grid to test/);
  });

  it('T02-41: a grid whose expert product misses the world size fails that check only', () => {
    const bad = evaluateMoeGrid(moe, { tp: 1, pp: 16, dp: 128, etp: 1, ep: 64, edp: 3 });
    expect(bad.attentionGrid.matchesWorldSize).toBe(true);
    expect(bad.expertGrid.matchesWorldSize).toBe(false);
  });

  it('routed and non-routed parameters reproduce the 37B activated count with top-8 of 256', () => {
    const shape = moeShapeOf(DEEPSEEK_V3);
    const routed = routedExpertParameters(shape);
    const activated = shape.totalParameters - routed + (routed * shape.topK) / shape.routedExperts;
    expect(activated / 1e9).toBeCloseTo(37, 9);
  });

  it('sizeMoeGrids returns candidate grids that pass both checks, unmodelled activations, and ends with measure these two or three', () => {
    const r = sizeMoeGrids(moe);
    expect(r.candidates.length).toBeGreaterThan(0);
    for (const c of r.candidates) {
      expect(c.attentionGrid.matchesWorldSize && c.expertGrid.matchesWorldSize).toBe(true);
      expect(c.modelState.withinHeadroomTarget).toBe(true);
    }
    expect(r.wording).toMatch(/^candidate grids to test/);
    expect(r.measureNext).toBe(MEASURE_NEXT);
  });
});

describe('input validation', () => {
  it('throws a RangeError when the degrees do not multiply to the world size', () => {
    expect(() => evaluateLayout(in70, layout({ tp: 8, pp: 4, dp: 4 }))).toThrow(RangeError);
    expect(() => evaluateLayout(in70, layout({ tp: 8, pp: 4, dp: 4 }))).toThrow(/world size 256/);
  });

  it('T02-15, T02-14: throws when TP does not divide the heads or spans more than one instance', () => {
    expect(() => evaluateLayout({ ...in70, instanceCount: 24 }, layout({ tp: 3, dp: 64 }))).toThrow(/layout\.tp/);
    expect(() => evaluateLayout(in70, layout({ tp: 16, dp: 16 }))).toThrow(/layout\.tp/);
  });

  it('T02-15, T02-30: throws when micro-batch x DP misses the batch or interleaving lacks a multiple of p', () => {
    expect(() => evaluateLayout(in70, layout({ tp: 8, pp: 4, dp: 8, microBatch: 3 }))).toThrow(/layout\.microBatch/);
    expect(() => evaluateLayout(in70, layout({ tp: 8, pp: 4, dp: 8, interleavedChunks: 5, microBatch: 32 }))).toThrow(
      /interleavedChunks/,
    );
  });

  it('throws on a sync mode that does not match the sharding', () => {
    expect(() => evaluateLayout(in70, layout({ tp: 8, dp: 32, sharding: 'fsdp', gradientSync: 'oncePerStep' }))).toThrow(
      /gradientSync/,
    );
    expect(() => evaluateLayout(in70, layout({ tp: 8, dp: 32, gradientSync: 'deferred' }))).toThrow(/gradientSync/);
  });

  it('throws a RangeError naming the field on non-positive counts', () => {
    expect(() => sizeParallelism({ ...in70, instanceCount: 0 })).toThrow(/instanceCount/);
    expect(() => sizeParallelism({ ...in70, sequenceLength: -1 })).toThrow(/sequenceLength/);
    expect(() => evaluateLayout(in70, layout({ tp: 8, dp: 0 }))).toThrow(/layout\.dp/);
    expect(() => evaluateMoeGrid({ model: moeShapeOf(DEEPSEEK_V3), instance: INSTANCES['p5.48xlarge'], instanceCount: 1 }, {
      tp: 1, pp: 1, dp: 8, etp: 1, ep: 0, edp: 8,
    })).toThrow(/grid\.ep/);
  });

  it('throws on MFU outside (0, 1] and a token batch that does not divide by the sequence length', () => {
    expect(() => sizeParallelism({ ...in70, mfu: 0 })).toThrow(/mfu/);
    expect(() => sizeParallelism({ ...in70, mfu: 1.5 })).toThrow(/mfu/);
    expect(() => sizeParallelism({ ...in70, globalBatch: { tokens: 4_200_000 } })).toThrow(/globalBatch\.tokens/);
  });

  it('throws on an instance with no ranks per instance in the registers', () => {
    expect(() => sizeParallelism({ ...in70, instance: INSTANCES['p6e-gb200.36xlarge'] })).toThrow(/instance/);
  });
});
