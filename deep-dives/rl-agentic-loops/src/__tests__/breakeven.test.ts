import { describe, it, expect } from 'vitest';
import {
  BreakevenInputError,
  breakeven,
  compareAtVolume,
  evaluate,
  formatCompact,
  formatCount,
  formatUsd,
  niceAxis,
  niceStep,
  perQueryCostFrom,
  priceQualityGap,
  totalCost,
  trainingCostFrom,
} from '../lib/breakeven';

/**
 * The Training-Free GRPO paper's cost pair (arXiv 2510.08191v1, Section 4.2 and Table 3):
 * ReTool RL on Qwen2.5-32B-Instruct, about $10,000 to train and $0.005 per problem served, AIME
 * 2024 67.0; Training-Free GRPO on DeepSeek-V3.1-Terminus, about $18 to learn and $0.02 per
 * problem, AIME 2024 82.7. Cross-model: the pair compares artifacts on different base models.
 */
const RL = { trainingCost: 10_000, perQueryCost: 0.005, quality: 67.0 };
const TEXT_LOOP = { trainingCost: 18, perQueryCost: 0.02, quality: 82.7 };

function expectInputError(fn: () => unknown, code: string, field?: string): void {
  try {
    fn();
  } catch (e) {
    expect(e).toBeInstanceOf(BreakevenInputError);
    expect((e as BreakevenInputError).code).toBe(code);
    if (field) expect((e as BreakevenInputError).field).toBe(field);
    return;
  }
  throw new Error(`expected BreakevenInputError(${code}), nothing was thrown`);
}

describe('breakeven: the paper pair', () => {
  it('crosses at ($10,000 - $18) / ($0.02 - $0.005) = 665,467 problems', () => {
    const be = breakeven(RL, TEXT_LOOP);
    expect(be.kind).toBe('crossover');
    if (be.kind !== 'crossover') return;
    expect(be.volume).toBeCloseTo(9_982 / 0.015, 6);
    expect(Math.round(be.volume)).toBe(665_467);
    expect(formatCount(be.volume)).toBe('665,467');
    // The cheaper-to-train text loop wins below the breakeven, the cheaper-to-serve RL model above.
    expect(be.cheaperBelow).toBe('b');
    expect(be.cheaperAbove).toBe('a');
  });

  it('gives the same volume with the options swapped, and swaps the winners', () => {
    const be = breakeven(TEXT_LOOP, RL);
    expect(be.kind).toBe('crossover');
    if (be.kind !== 'crossover') return;
    expect(Math.round(be.volume)).toBe(665_467);
    expect(be.cheaperBelow).toBe('a');
    expect(be.cheaperAbove).toBe('b');
  });

  it('keeps the 4-GPU server busy for 1,664 hours at the paper\'s 400 problems per hour', () => {
    const be = breakeven(RL, TEXT_LOOP);
    if (be.kind !== 'crossover') throw new Error('expected a crossover');
    expect(Math.round(be.volume / 400)).toBe(1_664);
    // The RL side's $0.005: 4 GPUs at $0.5 per GPU-hour, 400 problems an hour.
    expect((4 * 0.5) / 400).toBeCloseTo(0.005, 12);
  });

  it('totals both options and reports the side at a given volume', () => {
    const below = compareAtVolume(RL, TEXT_LOOP, 100_000);
    expect(below.totalA).toBeCloseTo(10_500, 6);
    expect(below.totalB).toBeCloseTo(2_018, 6);
    expect(below.cheaper).toBe('b');
    expect(below.position).toBe('below');

    const above = compareAtVolume(RL, TEXT_LOOP, 1_000_000);
    expect(above.totalA).toBeCloseTo(15_000, 6);
    expect(above.totalB).toBeCloseTo(20_018, 6);
    expect(above.cheaper).toBe('a');
    expect(above.position).toBe('above');
  });

  it('prices the quality gap on the side where the cheaper option scores lower', () => {
    const atLow = evaluate({ a: RL, b: TEXT_LOOP, volume: 100_000 });
    expect(atLow.quality).toEqual({ kind: 'cheaper-scores-at-least-as-well', cheaper: 'b', qualityGap: expect.closeTo(15.7, 6) });

    const atHigh = evaluate({ a: RL, b: TEXT_LOOP, volume: 1_000_000 });
    expect(atHigh.quality.kind).toBe('pay-for-quality');
    if (atHigh.quality.kind !== 'pay-for-quality') return;
    expect(atHigh.quality.better).toBe('b');
    expect(atHigh.quality.extraCost).toBeCloseTo(5_018, 6);
    expect(atHigh.quality.qualityGap).toBeCloseTo(15.7, 6);
    expect(atHigh.quality.costPerPoint).toBeCloseTo(5_018 / 15.7, 6);
  });
});

describe('breakeven: edge cases', () => {
  it('throws when both options cost the same per query', () => {
    expectInputError(
      () => breakeven({ trainingCost: 100, perQueryCost: 0.01 }, { trainingCost: 5, perQueryCost: 0.01 }),
      'equal-per-query-cost',
    );
    expectInputError(
      () => compareAtVolume({ trainingCost: 0, perQueryCost: 0 }, { trainingCost: 0, perQueryCost: 0 }, 10),
      'equal-per-query-cost',
    );
  });

  it('reports dominance when one option is cheaper to train and to serve', () => {
    const cheapBoth = { trainingCost: 100, perQueryCost: 0.01 };
    const dearBoth = { trainingCost: 5_000, perQueryCost: 0.05 };
    expect(breakeven(cheapBoth, dearBoth)).toEqual({ kind: 'dominates', winner: 'a' });
    expect(breakeven(dearBoth, cheapBoth)).toEqual({ kind: 'dominates', winner: 'b' });
    for (const volume of [0, 1, 1e3, 1e9]) {
      const c = compareAtVolume(dearBoth, cheapBoth, volume);
      expect(c.position).toBe('no-crossover');
      expect(c.cheaper).toBe('b');
    }
  });

  it('treats equal training cost with a lower per-query cost as dominance', () => {
    expect(breakeven({ trainingCost: 50, perQueryCost: 0.02 }, { trainingCost: 50, perQueryCost: 0.01 })).toEqual({
      kind: 'dominates',
      winner: 'b',
    });
  });

  it('reports a volume exactly at the breakeven', () => {
    const a = { trainingCost: 1_000, perQueryCost: 0 };
    const b = { trainingCost: 0, perQueryCost: 1 };
    const c = compareAtVolume(a, b, 1_000);
    expect(c.position).toBe('at');
    expect(c.cheaper).toBe('tie');
    expect(priceQualityGap(c, 3, 1)).toEqual({ kind: 'equal-cost', better: 'a' });
  });

  it('allows zero volume: totals are the training costs', () => {
    const c = compareAtVolume(RL, TEXT_LOOP, 0);
    expect(c.totalA).toBe(10_000);
    expect(c.totalB).toBe(18);
  });

  it('rejects negative rates, volumes and quantities, naming the field', () => {
    expectInputError(() => breakeven({ trainingCost: -1, perQueryCost: 0.01 }, TEXT_LOOP), 'negative', 'a.trainingCost');
    expectInputError(() => breakeven(RL, { trainingCost: 18, perQueryCost: -0.02 }), 'negative', 'b.perQueryCost');
    expectInputError(() => compareAtVolume(RL, TEXT_LOOP, -5), 'negative', 'volume');
    expectInputError(() => trainingCostFrom(-10, 2), 'negative', 'quantity');
    expectInputError(() => trainingCostFrom(10, -2), 'negative', 'pricePerUnit');
    expectInputError(() => totalCost(RL, -1), 'negative', 'volume');
  });

  it('rejects values that are not numbers', () => {
    expectInputError(() => breakeven({ trainingCost: Number.NaN, perQueryCost: 0.01 }, TEXT_LOOP), 'not-a-number');
    expectInputError(() => compareAtVolume(RL, TEXT_LOOP, Number.POSITIVE_INFINITY), 'not-a-number', 'volume');
    expectInputError(() => priceQualityGap(compareAtVolume(RL, TEXT_LOOP, 10), Number.NaN, 1), 'not-a-number', 'a.quality');
  });
});

describe('building the inputs', () => {
  it('prices a published quantity at the reader\'s rate', () => {
    // DeepSeek-R1: 147K H800 GPU-hours at the authors' assumed $2 per GPU-hour is $294K.
    expect(trainingCostFrom(147_000, 2)).toBe(294_000);
    // The Training-Free GRPO authors' ReTool replication: 20,000 GPU-hours at $0.5.
    expect(trainingCostFrom(20_000, 0.5)).toBe(10_000);
    // Bedrock RFT at $80.00 per training hour, for hours the reader enters.
    expect(trainingCostFrom(3, 80)).toBe(240);
  });

  it('applies the token multiplier of the inference-time sampling option', () => {
    expect(perQueryCostFrom(0.005, 8.84)).toBeCloseTo(0.0442, 12);
    expect(perQueryCostFrom(0.02, 1)).toBe(0.02);
    expectInputError(() => perQueryCostFrom(0.005, 0), 'not-positive', 'tokenMultiplier');
    expectInputError(() => perQueryCostFrom(0.005, -2), 'not-positive', 'tokenMultiplier');
  });

  it('moves the breakeven when the sampler multiplies the per-query cost on the same model', () => {
    // Same model on both sides: RL at $10,000 and $0.005 a query; the sampler trains nothing and
    // spends 8.84 times the tokens, so $0.0442 a query.
    const sampler = { trainingCost: 0, perQueryCost: perQueryCostFrom(0.005, 8.84) };
    const be = breakeven(RL, sampler);
    if (be.kind !== 'crossover') throw new Error('expected a crossover');
    expect(be.volume).toBeCloseTo(10_000 / (0.0442 - 0.005), 6);
    expect(be.cheaperBelow).toBe('b');
  });
});

describe('axis and formatting helpers', () => {
  it('picks steps of 1, 2, 2.5 or 5 times a power of ten', () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(1)).toBe(1);
    expect(niceStep(1.2)).toBe(2);
    expect(niceStep(2.2)).toBe(2.5);
    expect(niceStep(166_366)).toBe(200_000);
    expect(niceStep(4_003.6)).toBe(5_000);
    expect(niceStep(7_000)).toBe(10_000);
  });

  it('builds axes from zero that cover the data', () => {
    const x = niceAxis(831_833);
    expect(x.max).toBe(1_000_000);
    expect(x.ticks).toEqual([0, 200_000, 400_000, 600_000, 800_000, 1_000_000]);
    const y = niceAxis(20_018);
    expect(y.max).toBe(25_000);
    expect(y.ticks[y.ticks.length - 1]).toBeGreaterThanOrEqual(20_018);
  });

  it('formats dollars, counts and short axis labels', () => {
    expect(formatUsd(10_000)).toBe('$10,000');
    expect(formatUsd(0.005)).toBe('$0.005');
    expect(formatUsd(0.0442)).toBe('$0.0442');
    expect(formatUsd(2.5)).toBe('$2.50');
    expect(formatUsd(0)).toBe('$0');
    expect(formatCount(1_663.67)).toBe('1,664');
    expect(formatCompact(250_000)).toBe('250K');
    expect(formatCompact(1_250_000)).toBe('1.25M');
    expect(formatCompact(0)).toBe('0');
  });
});
