import { describe, expect, it } from 'vitest';
import { DENSE_MODELS, E1_MEASURED_SBH, GB, INSTANCES, rankFacts, shapeOf } from '../lib/presets';
import { activationCoefficient, memoryBudget, modelStateBytes, optimizerComponents, type MemoryInput } from '../lib/memory';

const m8 = shapeOf(DENSE_MODELS['llama-3.1-8b']);
const m70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const p5 = rankFacts(INSTANCES['p5.48xlarge']);
const gb = (bytes: number) => bytes / GB;

/** 8B at s = 8,192, b = 1, no parallelism, no sharding: the 01 W4 baseline. */
function base8(overrides: Partial<MemoryInput> = {}): MemoryInput {
  return {
    model: m8,
    optimizer: { row: 'adamMixed' },
    zero: { stage: 0, degree: 1 },
    recompute: 'none',
    microBatch: 1,
    sequenceLength: 8_192,
    logits: 'fp32Upcast',
    hbmPerRank: p5.hbmPerRank,
    ...overrides,
  };
}

describe('01 W2: model state', () => {
  // Tolerance: the register prints one decimal (128.5, 1,128.9), so 0.05 GB; "about 1,270" to the GB.
  it('01 W2: Llama 3.1 8B model state is 128.5 GB at 16 bytes per parameter', () => {
    expect(Math.abs(gb(memoryBudget(base8()).modelState.totalBytes) - 128.5)).toBeLessThan(0.05);
    expect(memoryBudget(base8()).modelState.bytesPerParameterUnsharded).toBe(16);
  });

  it('01 W2: Llama 3.1 70B is 1,128.9 GB at 16 bytes', () => {
    const r = memoryBudget(base8({ model: m70 }));
    expect(Math.abs(gb(r.modelState.totalBytes) - 1_128.9)).toBeLessThan(0.05);
  });

  it('01 W2, T03-17: Llama 3.1 70B is about 1,270 GB at 18 bytes (FP32 main gradients)', () => {
    const r = memoryBudget(base8({ model: m70, optimizer: { row: 'adamMixed', gradientDtype: 'fp32' } }));
    expect(r.modelState.bytesPerParameterUnsharded).toBe(18);
    expect(Math.abs(gb(r.modelState.totalBytes) - 1_270)).toBeLessThan(0.5);
  });

  it('ZeRO stages divide optimizer, then gradients, then weights (1910.02054v3 Sec 5)', () => {
    const n = m8.totalParameters;
    const at = (stage: 0 | 1 | 2 | 3) => memoryBudget(base8({ zero: { stage, degree: 8 } })).modelState.totalBytes / n;
    expect(at(0)).toBeCloseTo(16, 9);
    expect(at(1)).toBeCloseTo(4 + 12 / 8, 9);
    expect(at(2)).toBeCloseTo(2 + 14 / 8, 9);
    expect(at(3)).toBeCloseTo(16 / 8, 9);
  });
});

describe('01 W3 and E1: activation coefficients', () => {
  // Tolerance: E1 measured to two decimals; the derived coefficient agrees within 0.05 sbh.
  it('01 W3, E1: the fused SwiGLU coefficient for 8B is 34.0 sbh, E1 measured 34.03', () => {
    expect(activationCoefficient(m8, 'fused')).toBe(34);
    expect(Math.abs(activationCoefficient(m8, 'fused') - E1_MEASURED_SBH.fusedSwiglu.value)).toBeLessThan(0.05);
  });

  it('01 W3, E1: the eager SwiGLU coefficient for 8B is 41.0 sbh, E1 measured 41.03', () => {
    expect(activationCoefficient(m8, 'eager')).toBe(41);
    expect(Math.abs(activationCoefficient(m8, 'eager') - E1_MEASURED_SBH.eagerSwiglu.value)).toBeLessThan(0.05);
  });

  it('01 W3: the fused coefficient for 70B is 33.5 sbh', () => {
    expect(activationCoefficient(m70, 'fused')).toBe(33.5);
  });
});

describe('01 W4: activation memory at micro-batch 1 and sequence 8,192', () => {
  // Tolerance: the register prints three decimals per layer (0.0005 GB) and two decimals in total (0.005 GB).
  it('01 W4: 8B is 1.141 GB per layer and 36.51 GB for 32 layers at 34 sbh', () => {
    const r = memoryBudget(base8());
    expect(Math.abs(gb(r.activations.perLayerBytes) - 1.141)).toBeLessThan(0.0005);
    expect(Math.abs(gb(r.firstStage.activationBytes) - 36.51)).toBeLessThan(0.005);
  });

  it('01 W4, E1: 41.03 sbh (E1 measured) gives 1.377 GB per layer', () => {
    const r = memoryBudget(base8({ activations: { sbhPerLayer: E1_MEASURED_SBH.eagerSwiglu.value } }));
    expect(Math.abs(gb(r.activations.perLayerBytes) - 1.377)).toBeLessThan(0.0005);
  });

  it('01 W4: the derived eager coefficient 41.0 sbh gives 1.376 GB per layer (spec prints 1.377, from E1 41.03)', () => {
    const r = memoryBudget(base8({ activations: { swiglu: 'eager' } }));
    expect(Math.abs(gb(r.activations.perLayerBytes) - 1.376)).toBeLessThan(0.0005);
  });

  it('01 W4: 8B with TP 8 + SP is 4.56 GB for 32 layers', () => {
    const r = memoryBudget(base8({ tensorParallel: { degree: 8, sequenceParallel: true } }));
    expect(Math.abs(gb(r.firstStage.activationBytes) - 4.56)).toBeLessThan(0.005);
  });

  it('01 W4: 8B with TP 8 and no SP is 12.08 GB (8 sbh stays replicated); TP 2 no SP 22.55 GB', () => {
    const tp8 = memoryBudget(base8({ tensorParallel: { degree: 8, sequenceParallel: false } }));
    const tp2 = memoryBudget(base8({ tensorParallel: { degree: 2, sequenceParallel: false } }));
    expect(Math.abs(gb(tp8.firstStage.activationBytes) - 12.08)).toBeLessThan(0.005);
    expect(Math.abs(gb(tp2.firstStage.activationBytes) - 22.55)).toBeLessThan(0.005);
  });

  it('01 W4, E1: 8B under full recomputation is 2.15 + 1.14 = 3.29 GB (2 sbh stored per layer)', () => {
    const r = memoryBudget(base8({ recompute: 'full' }));
    expect(gb(r.activations.storedPerLayerBytes * m8.layers)).toBeCloseTo(2.15, 2);
    expect(Math.abs(gb(r.firstStage.activationBytes) - 3.29)).toBeLessThan(0.005);
    expect(r.activations.storedPerLayerBytes / (8_192 * m8.hidden)).toBe(E1_MEASURED_SBH.fullRecompute.value);
  });

  it('01 W4: FP32 logits are 4.20 GB per sequence, 6.30 GB with their BF16 source', () => {
    const r = memoryBudget(base8());
    expect(Math.abs(gb(r.logits.fp32Bytes) - 4.2)).toBeLessThan(0.005);
    expect(Math.abs(gb(r.logits.totalBytes) - 6.3)).toBeLessThan(0.005);
    expect(memoryBudget(base8({ logits: 'bf16Fused' })).logits.fp32Bytes).toBe(0);
  });

  it('01 W4: 70B is 2.248 GB per layer at 33.5 sbh and 179.85 GB for 80 layers', () => {
    const r = memoryBudget(base8({ model: m70 }));
    expect(Math.abs(gb(r.activations.perLayerBytes) - 2.248)).toBeLessThan(0.0005);
    expect(Math.abs(gb(r.firstStage.activationBytes) - 179.85)).toBeLessThan(0.005);
  });

  it('01 W4: 70B with TP 8 + SP is 22.48 GB; TP 8 no SP 60.06 GB; full recomputation 12.99 GB', () => {
    const sp = memoryBudget(base8({ model: m70, tensorParallel: { degree: 8, sequenceParallel: true } }));
    const noSp = memoryBudget(base8({ model: m70, tensorParallel: { degree: 8, sequenceParallel: false } }));
    const full = memoryBudget(base8({ model: m70, recompute: 'full' }));
    expect(Math.abs(gb(sp.firstStage.activationBytes) - 22.48)).toBeLessThan(0.005);
    expect(Math.abs(gb(noSp.firstStage.activationBytes) - 60.06)).toBeLessThan(0.005);
    expect(Math.abs(gb(full.firstStage.activationBytes) - 12.99)).toBeLessThan(0.005);
  });

  it('T01-62: under 1F1B the first stage holds L layers whatever p is', () => {
    const p1 = memoryBudget(base8({ model: m70 }));
    const p4 = memoryBudget(base8({ model: m70, pipelineParallel: { degree: 4 } }));
    expect(p4.firstStage.activationBytes).toBeCloseTo(p1.firstStage.activationBytes, 0);
    expect(p4.lastStage.activationBytes).toBeCloseTo(p1.firstStage.activationBytes / 4, 0);
  });
});

describe('01 W5: memory budget on a real instance', () => {
  // Tolerance: one decimal, 0.05 GB.
  it('01 W5: 8B on one p5.48xlarge, FSDP 8, s = 8,192, b = 1: 16.06 + 36.51 + 6.30 = 58.9 GB', () => {
    const r = memoryBudget(base8({ zero: { stage: 3, degree: 8 } }));
    expect(Math.abs(gb(r.modelState.totalBytes) - 16.06)).toBeLessThan(0.005);
    expect(Math.abs(r.totalGB - 58.9)).toBeLessThan(0.05);
    expect(r.fits).toBe(true);
    expect(r.confirmWithMeasuredStep).toBe(false);
  });

  it('01 W5: at b = 2 the 8B layout needs 101.7 GB and does not fit; full recomputation brings it to 35.2 GB', () => {
    const b2 = memoryBudget(base8({ zero: { stage: 3, degree: 8 }, microBatch: 2 }));
    const b2full = memoryBudget(base8({ zero: { stage: 3, degree: 8 }, microBatch: 2, recompute: 'full' }));
    expect(Math.abs(b2.totalGB - 101.7)).toBeLessThan(0.05);
    expect(b2.fits).toBe(false);
    expect(Math.abs(b2full.totalGB - 35.2)).toBeLessThan(0.05);
  });

  it('01 W5: 70B TP 8 + SP, ZeRO-1 over DP 32: 35.28 + 3.31 + 22.48 + 0.79 = 61.9 GB', () => {
    const r = memoryBudget(
      base8({ model: m70, zero: { stage: 1, degree: 32 }, tensorParallel: { degree: 8, sequenceParallel: true } }),
    );
    expect(Math.abs(gb(r.modelState.weightsBytes + r.modelState.gradientsBytes) - 35.28)).toBeLessThan(0.005);
    expect(Math.abs(gb(r.modelState.optimizerBytes) - 3.31)).toBeLessThan(0.005);
    expect(Math.abs(gb(r.logits.totalBytes) - 0.79)).toBeLessThan(0.005);
    expect(Math.abs(r.totalGB - 61.9)).toBeLessThan(0.05);
    expect(r.fits).toBe(true);
    // 61.9 GB is above 0.75 x 80 GB = 60 GB, so the flag is raised.
    expect(r.confirmWithMeasuredStep).toBe(true);
  });

  it('01 W5: 70B FSDP over 256 GPUs with full recomputation sums to 23.7 GB', () => {
    const r = memoryBudget(base8({ model: m70, zero: { stage: 3, degree: 256 }, recompute: 'full' }));
    expect(Math.abs(gb(r.modelState.totalBytes) - 4.41)).toBeLessThan(0.005);
    expect(Math.abs(r.totalGB - 23.7)).toBeLessThan(0.05);
  });

  it('C02-7: p5 capacity is the smaller of 80 GiB (AWS) and 80 GB (NVIDIA), both shown in their units', () => {
    const r = memoryBudget(base8());
    expect(r.capacity.bytes).toBe(80 * GB);
    expect(r.capacity.figures.map((f) => `${f.value} ${f.unit}`)).toEqual(['80 GiB', '80 GB']);
    expect(r.headroomTargetBytes).toBe(60 * GB);
  });
});

describe('02 section 3.2 and wave2-parallelism W2-42: 70B TP 8 x PP 4 x DP 8, ZeRO-1, v = 5', () => {
  const w242 = (gradientDtype: 'bf16' | 'fp32') =>
    memoryBudget({
      model: m70,
      optimizer: { row: 'adamMixed', gradientDtype },
      zero: { stage: 1, degree: 8 },
      tensorParallel: { degree: 8, sequenceParallel: true },
      pipelineParallel: { degree: 4, interleavedChunks: 5 },
      recompute: 'none',
      activations: { sbhPerLayer: 34 },
      microBatch: 1,
      microBatchesPerStep: 64,
      sequenceLength: 8_192,
      logits: 'fp32Upcast',
      hbmPerRank: p5.hbmPerRank,
    });

  // Tolerance: "about 38" and "about 43" are rounded to the GB, so 0.5 GB.
  it('W2-42: about 38 GB per GPU with BF16 gradients', () => {
    const r = w242('bf16');
    expect(Math.abs(r.totalGB - 38)).toBeLessThan(0.5);
    expect(r.peakStage).toBe('first');
  });

  it('W2-42: about 43 GB per GPU with FP32 main gradients', () => {
    expect(Math.abs(w242('fp32').totalGB - 43)).toBeLessThan(0.5);
  });
});

describe('section 16 and register 03 W4: fine-tuning 70B before activations', () => {
  const ft = (optimizer: MemoryInput['optimizer']) => gb(memoryBudget(base8({ model: m70, optimizer })).modelState.totalBytes);

  // Tolerance: the spec prints whole GB (1,129, 141, 35), so 0.5 GB.
  it('section 16: full fine-tuning is 1,129 GB at 16 bytes per parameter', () => {
    expect(Math.abs(ft({ row: 'adamMixed' }) - 1_129)).toBeLessThan(0.5);
  });

  it('03 W4: full fine-tuning is 1,270 GB at 18 bytes per parameter (the register row the spec quotes as 1,129 at 16)', () => {
    expect(Math.abs(ft({ row: 'adamMixed', gradientDtype: 'fp32' }) - 1_270)).toBeLessThan(0.5);
  });

  it('03 W4: LoRA is about 141 GB before adapters (2 bytes per frozen parameter)', () => {
    expect(Math.abs(ft({ frozenBase: 'lora', adapterFraction: 0 }) - 141)).toBeLessThan(0.5);
  });

  it('03 W4: 4-bit QLoRA is about 35 GB before adapters (0.5 bytes per parameter)', () => {
    expect(Math.abs(ft({ frozenBase: 'qlora4bit', adapterFraction: 0 }) - 35)).toBeLessThan(0.5);
  });

  it('adapters add 16 bytes per trainable parameter on top of the frozen base', () => {
    const withAdapters = ft({ frozenBase: 'lora', adapterFraction: 0.01 });
    expect(withAdapters - ft({ frozenBase: 'lora', adapterFraction: 0 })).toBeCloseTo(gb(m70.totalParameters * 0.01 * 16), 6);
  });

  it('modelStateBytes is N x bytes per parameter', () => {
    expect(modelStateBytes(70.55e9, 2)).toBe(141.1e9);
  });
});

describe('input validation', () => {
  it('throws a RangeError naming the field on non-positive counts', () => {
    expect(() => memoryBudget(base8({ zero: { stage: 1, degree: 0 } }))).toThrow(/zero\.degree/);
    expect(() => memoryBudget(base8({ microBatch: 0 }))).toThrow(/microBatch/);
    expect(() => memoryBudget(base8({ sequenceLength: -1 }))).toThrow(/sequenceLength/);
    expect(() => memoryBudget(base8({ tensorParallel: { degree: 0, sequenceParallel: true } }))).toThrow(/tensorParallel\.degree/);
    expect(() => memoryBudget(base8({ model: { ...m8, layers: 0 } }))).toThrow(/model\.layers/);
    expect(() => memoryBudget(base8({ activations: { sbhPerLayer: 0 } }))).toThrow(/sbhPerLayer/);
  });

  it('throws on a headroom fraction outside (0, 1] and an adapter fraction outside [0, 1]', () => {
    expect(() => memoryBudget(base8({ headroomFraction: 0 }))).toThrow(/headroomFraction/);
    expect(() => memoryBudget(base8({ headroomFraction: 1.5 }))).toThrow(/headroomFraction/);
    expect(() => optimizerComponents({ frozenBase: 'lora', adapterFraction: 1.5 })).toThrow(/adapterFraction/);
  });

  it('throws when PP exceeds the layers, the sequence does not divide by CP, or no capacity is given', () => {
    expect(() => memoryBudget(base8({ pipelineParallel: { degree: 33 } }))).toThrow(/pipelineParallel\.degree/);
    expect(() => memoryBudget(base8({ contextParallel: 3 }))).toThrow(/contextParallel/);
    expect(() => memoryBudget(base8({ hbmPerRank: [] }))).toThrow(/hbmPerRank/);
  });

  it('every number in a result is finite', () => {
    const r = memoryBudget(base8({ zero: { stage: 3, degree: 8 }, recompute: 'full' }));
    const numbers = [
      r.totalBytes,
      r.totalGB,
      r.freeBytes,
      r.headroomTargetBytes,
      r.modelState.totalBytes,
      r.activations.perLayerBytes,
      r.logits.totalBytes,
      r.capacity.gb,
    ];
    for (const n of numbers) expect(Number.isFinite(n)).toBe(true);
  });
});
