import { describe, expect, it } from 'vitest';
import { DENSE_MODELS, INSTANCES, shapeOf } from '../lib/presets';
import {
  attentionCrossoverSequenceLength,
  denseRuntimeInputs,
  estimateRun,
  flopsPerToken,
  mfuFromThroughput,
  priceRun,
  type RuntimeInput,
} from '../lib/runtime';

const H100_BF16 = INSTANCES['p5.48xlarge'].denseBf16TflopsPerAccelerator.value; // 989.5
const H100_FP8 = INSTANCES['p5.48xlarge'].denseFp8TflopsPerAccelerator?.value ?? 0; // 1,979
const m8 = shapeOf(DENSE_MODELS['llama-3.1-8b']);
const m70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const m405 = shapeOf(DENSE_MODELS['llama-3.1-405b']);

function run70(tokens: number, overrides: Partial<RuntimeInput> = {}) {
  return estimateRun({
    ...denseRuntimeInputs(m70, 'full'),
    tokens,
    sequenceLength: 8_192,
    attention: 'none',
    peakTflopsPerAccelerator: H100_BF16,
    accelerators: 256,
    mfu: 0.4,
    ...overrides,
  });
}

describe('01 W7 and wave2-step-maths W1-13: 6ND for Llama 3 405B', () => {
  const base = { tokens: 15.6e12, sequenceLength: 8_192, attention: 'none' as const, peakTflopsPerAccelerator: H100_BF16, accelerators: 16_384 };

  // Tolerance: the register prints three significant figures, so 0.005e25.
  it('01 W7: 405B at D = 15.6T is 3.80e25 FLOPs on the full count', () => {
    const r = estimateRun({ ...denseRuntimeInputs(m405, 'full'), ...base });
    expect(r.totalFlops / 1e25).toBeCloseTo(3.8, 2);
  });

  it('W1-13: matmul-only N gives 3.78e25, with no overhead factor', () => {
    const r = estimateRun({ ...denseRuntimeInputs(m405, 'matmul'), ...base });
    expect(r.totalFlops / 1e25).toBeCloseTo(3.78, 2);
    expect(r.totalFlops).toBe(6 * m405.matmulParameters * 15.6e12);
  });
});

describe('01 W8: Llama 3.1 70B accelerator-hours', () => {
  // Tolerance: "about 297,000" is rounded to the thousand, so 500 hours.
  it('01 W8: 70B on 1T tokens at 40% MFU is about 297,000 H100-hours', () => {
    expect(Math.abs(run70(1e12).acceleratorHours - 297_000)).toBeLessThan(500);
  });

  it('01 W8: 70B on 1T tokens takes about 48 days on 256 GPUs', () => {
    expect(Math.abs(run70(1e12).wallClockDays - 48)).toBeLessThan(0.5);
  });

  it('01 W8: 70B on 15T tokens is about 4.46M H100-hours', () => {
    expect(run70(15e12).acceleratorHours / 1e6).toBeCloseTo(4.46, 2);
  });

  it('MFU defaults to 0.40 and the result says so', () => {
    const r = run70(1e12, { mfu: undefined });
    expect(r.mfu).toBe(0.4);
    expect(r.mfuIsDefaultAssumption).toBe(true);
    expect(run70(1e12).mfuIsDefaultAssumption).toBe(false);
  });
});

describe('07 W1 and wave2-observability W6-9: tokens per second per H100 at 40% MFU', () => {
  const tps = (model: typeof m8, basis: 'full' | 'nonEmbedding', attention: 'none' | 'noDiscount') =>
    estimateRun({
      ...denseRuntimeInputs(model, basis),
      tokens: 1e12,
      sequenceLength: 8_192,
      attention,
      peakTflopsPerAccelerator: H100_BF16,
      accelerators: 8,
      mfu: 0.4,
    }).tokensPerSecondPerAccelerator;

  // Tolerances follow the printed rounding: 8,200 to the hundred, 935 to the unit, 6,800 to the hundred, 820 to the ten.
  it('07 W1: about 8,200 tokens per second for 8B with 6N on the full count', () => {
    expect(Math.abs(tps(m8, 'full', 'none') - 8_200)).toBeLessThan(50);
  });

  it('07 W1: about 935 tokens per second for 70B with 6N on the full count', () => {
    expect(Math.abs(tps(m70, 'full', 'none') - 935)).toBeLessThan(1);
  });

  it("W6-9: TorchTitan's count (attention added, embedding left out) at s = 8,192 gives about 6,800 for 8B", () => {
    expect(Math.abs(tps(m8, 'nonEmbedding', 'noDiscount') - 6_800)).toBeLessThan(50);
  });

  it("W6-9: TorchTitan's count gives about 820 for 70B", () => {
    expect(Math.abs(tps(m70, 'nonEmbedding', 'noDiscount') - 820)).toBeLessThan(5);
  });

  it('W6-9: 4,000 tokens per second for 8B on that count reads as about 23% MFU', () => {
    const perToken = flopsPerToken({ ...denseRuntimeInputs(m8, 'nonEmbedding'), sequenceLength: 8_192, attention: 'noDiscount' });
    const mfu = mfuFromThroughput({ tokensPerSecondPerAccelerator: 4_000, flopsPerToken: perToken.total, peakTflopsPerAccelerator: H100_BF16 });
    expect(Math.abs(mfu - 0.23)).toBeLessThan(0.005);
  });
});

describe('01 W6: attention share of per-token FLOPs for 8B', () => {
  const at8k = (attention: 'causal' | 'noDiscount') =>
    flopsPerToken({ ...denseRuntimeInputs(m8, 'matmul'), sequenceLength: 8_192, attention });

  // Tolerance: 12.5% to a tenth of a point; 22% to half a point.
  it('01 W6: 12.5% of per-token FLOPs with a causal kernel at 8,192 tokens', () => {
    expect(Math.abs(at8k('causal').attentionShare - 0.125)).toBeLessThan(0.0005);
  });

  it('01 W6: 22% with no causal discount at 8,192 tokens', () => {
    expect(Math.abs(at8k('noDiscount').attentionShare - 0.22)).toBeLessThan(0.005);
  });

  it('01 W6: attention equals 6N at about 57K tokens (causal) and about 29K (no discount)', () => {
    const causal = attentionCrossoverSequenceLength({ ...denseRuntimeInputs(m8, 'matmul'), attention: 'causal', share: 0.5 });
    const noDiscount = attentionCrossoverSequenceLength({ ...denseRuntimeInputs(m8, 'matmul'), attention: 'noDiscount', share: 0.5 });
    expect(Math.abs(causal - 57_000)).toBeLessThan(500);
    expect(Math.abs(noDiscount - 29_000)).toBeLessThan(500);
  });

  it("the 'none' mode adds no attention term", () => {
    const r = flopsPerToken({ ...denseRuntimeInputs(m8, 'full'), sequenceLength: 8_192, attention: 'none' });
    expect(r.attention).toBe(0);
    expect(r.attentionShare).toBe(0);
  });
});

describe('section 6: FP8 upper bound', () => {
  // Tolerance: "about 148,500", so 500 hours.
  it('section 6: 297,000 H100-hours falls to about 148,500 at the same MFU against the FP8 peak', () => {
    expect(H100_FP8).toBe(1_979);
    const r = run70(1e12, { peakTflopsPerAccelerator: H100_FP8 });
    expect(Math.abs(r.acceleratorHours - 148_500)).toBeLessThan(500);
  });
});

describe('section 22: cost panel', () => {
  const hours = run70(15e12).acceleratorHours;
  const cost = priceRun({ acceleratorHours: hours, accelerators: 2_048, instance: 'p5.48xlarge', managedSpotDiscount: 0.5 });
  const line = (path: string) => cost.lines.find((l) => l.path === path);

  // Tolerance: the spec prints $30.7M and $26.6M, so $0.05M; 91 days to the day.
  it('section 22: 4.46M H100-hours is about $30.7M On-Demand on p5.48xlarge', () => {
    expect(Math.abs((line('ec2OnDemand')?.usd ?? 0) / 1e6 - 30.7)).toBeLessThan(0.05);
  });

  it('section 22: about $26.6M on Capacity Blocks', () => {
    expect(Math.abs((line('capacityBlock')?.usd ?? 0) / 1e6 - 26.6)).toBeLessThan(0.05);
  });

  it('section 22: about 91 days at 2,048 GPUs', () => {
    expect(Math.abs(cost.wallClockDays - 91)).toBeLessThan(0.5);
    expect(cost.instances).toBe(256);
  });

  it('U05-4: managed Spot is a user-entered discount on the training-job rate', () => {
    const spot = line('sagemakerManagedSpot');
    const training = line('sagemakerTraining');
    expect(spot?.usd).toBeCloseTo((training?.usd ?? 0) * 0.5, 6);
    expect(spot?.note).toMatch(/user-entered/);
  });

  it('W5-11: every price line carries its Region; the Trn2 block rate is Ohio', () => {
    for (const l of cost.lines) expect(l.region.length).toBeGreaterThan(0);
    const trn2 = priceRun({ acceleratorHours: 64_000, accelerators: 64, instance: 'trn2.48xlarge' });
    expect(trn2.lines.find((l) => l.path === 'capacityBlock')?.region).toBe('US East (Ohio)');
  });

  it('T06-35: 256 instances fit a medium PCS controller; 4,096 instances exceed the large one', () => {
    const pcs = cost.fees.find((f) => f.fee === 'pcs');
    expect(pcs?.description).toMatch(/medium/);
    const big = priceRun({ acceleratorHours: 1e6, accelerators: 32_768, instance: 'p5.48xlarge' });
    expect(big.fees.find((f) => f.fee === 'pcs')).toBeUndefined();
    expect(big.notes.join(' ')).toMatch(/PCS/);
  });

  it('every number in the cost result is finite', () => {
    for (const l of cost.lines) expect(Number.isFinite(l.usd)).toBe(true);
    for (const f of cost.fees) expect(Number.isFinite(f.usd)).toBe(true);
  });
});

describe('input validation', () => {
  const ok: RuntimeInput = {
    ...denseRuntimeInputs(m8, 'full'),
    tokens: 1e12,
    sequenceLength: 8_192,
    attention: 'causal',
    peakTflopsPerAccelerator: H100_BF16,
    accelerators: 8,
    mfu: 0.4,
  };

  it('throws a RangeError naming the field on non-positive counts', () => {
    expect(() => estimateRun({ ...ok, accelerators: 0 })).toThrow(/accelerators/);
    expect(() => estimateRun({ ...ok, tokens: -1 })).toThrow(/tokens/);
    expect(() => estimateRun({ ...ok, layers: 0 })).toThrow(/layers/);
    expect(() => estimateRun({ ...ok, sequenceLength: 0 })).toThrow(RangeError);
    expect(() => estimateRun({ ...ok, parameters: 0 })).toThrow(/parameters/);
  });

  it('throws a RangeError on MFU outside (0, 1]', () => {
    expect(() => estimateRun({ ...ok, mfu: 0 })).toThrow(/mfu/);
    expect(() => estimateRun({ ...ok, mfu: 1.2 })).toThrow(/mfu/);
    expect(() => estimateRun({ ...ok, mfu: Number.NaN })).toThrow(RangeError);
    expect(() => estimateRun({ ...ok, mfu: 1 })).not.toThrow();
  });

  it('throws when accelerators are not whole instances, and on a discount of 1 or more', () => {
    expect(() => priceRun({ acceleratorHours: 100, accelerators: 12, instance: 'p5.48xlarge' })).toThrow(/accelerators/);
    expect(() => priceRun({ acceleratorHours: 100, accelerators: 8, instance: 'p5.48xlarge', managedSpotDiscount: 1 })).toThrow(
      /managedSpotDiscount/,
    );
  });

  it('throws on a crossover share outside (0, 1)', () => {
    expect(() =>
      attentionCrossoverSequenceLength({ ...denseRuntimeInputs(m8, 'matmul'), attention: 'causal', share: 1 }),
    ).toThrow(/share/);
  });
});
