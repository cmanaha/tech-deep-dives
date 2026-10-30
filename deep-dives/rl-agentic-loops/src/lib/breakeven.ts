/**
 * Breakeven arithmetic for section 20, Cost per Improvement.
 *
 * Two ways to buy the same improvement, option A and option B. Each has a one-off cost (a
 * training run, a prompt-optimisation run) and a serving cost per query. Its total cost at a
 * volume of V queries is a straight line in V:
 *
 *   total = trainingCost + perQueryCost * V
 *
 * The breakeven is the volume where the two lines cross:
 *
 *   V* = (trainingCostA - trainingCostB) / (perQueryCostB - perQueryCostA)
 *
 * Below V* the option that is cheaper to train costs less in total; above it, the option that is
 * cheaper per query does. When one option is no more expensive to train and cheaper per query,
 * the lines never cross at a positive volume and that option wins everywhere.
 *
 * Pure functions, no I/O. Invalid input throws BreakevenInputError carrying a code and the name
 * of the field that failed, so a form can show an accurate message next to that field. No
 * function returns null.
 */

export type OptionKey = 'a' | 'b';

/** The two numbers that set an option's cost line. Dollars. */
export interface CostOption {
  /** One-off cost of producing the artifact: a training run, an optimisation run. */
  readonly trainingCost: number;
  /** Serving cost of one query once the artifact exists. */
  readonly perQueryCost: number;
}

/** A cost line plus the quality the reader measured for it, on a scale shared by both options. */
export interface ScoredOption extends CostOption {
  readonly quality: number;
}

export type BreakevenErrorCode = 'not-a-number' | 'negative' | 'not-positive' | 'equal-per-query-cost';

/** Raised for input the arithmetic cannot accept. `field` names the input that failed. */
export class BreakevenInputError extends Error {
  readonly code: BreakevenErrorCode;
  readonly field: string;

  constructor(code: BreakevenErrorCode, field: string, message: string) {
    super(message);
    this.name = 'BreakevenInputError';
    this.code = code;
    this.field = field;
  }
}

/* ------------------------------------------------------------------------ */
/* Validation                                                               */
/* ------------------------------------------------------------------------ */

/** A finite number, any sign (a quality score may be negative on some scales). */
export function requireFinite(value: number, field: string): number {
  if (!Number.isFinite(value)) {
    throw new BreakevenInputError('not-a-number', field, `${field} must be a number, got ${String(value)}`);
  }
  return value;
}

/** A finite number of zero or more: costs, rates, quantities and volumes. */
export function requireNonNegative(value: number, field: string): number {
  requireFinite(value, field);
  if (value < 0) {
    throw new BreakevenInputError('negative', field, `${field} must be zero or more, got ${value}`);
  }
  return value;
}

/** A finite number above zero: the token multiplier. */
export function requirePositive(value: number, field: string): number {
  requireFinite(value, field);
  if (value <= 0) {
    throw new BreakevenInputError('not-positive', field, `${field} must be above zero, got ${value}`);
  }
  return value;
}

function validateOption(option: CostOption, key: OptionKey): void {
  requireNonNegative(option.trainingCost, `${key}.trainingCost`);
  requireNonNegative(option.perQueryCost, `${key}.perQueryCost`);
}

/* ------------------------------------------------------------------------ */
/* Building the inputs                                                      */
/* ------------------------------------------------------------------------ */

/** Training cost from a published quantity (GPU-hours, training hours, rollouts) and your price per unit. */
export function trainingCostFrom(quantity: number, pricePerUnit: number): number {
  return requireNonNegative(quantity, 'quantity') * requireNonNegative(pricePerUnit, 'pricePerUnit');
}

/**
 * Cost per query when an option spends a multiple of the tokens of a reference query, for
 * example an inference-time sampler at 8.84 times the tokens of standard inference. Assumes the
 * per-query cost scales with tokens.
 */
export function perQueryCostFrom(referenceCostPerQuery: number, tokenMultiplier: number): number {
  return (
    requireNonNegative(referenceCostPerQuery, 'referenceCostPerQuery') *
    requirePositive(tokenMultiplier, 'tokenMultiplier')
  );
}

/* ------------------------------------------------------------------------ */
/* Totals, breakeven, comparison                                            */
/* ------------------------------------------------------------------------ */

/** Total cost of one option after serving `volume` queries. */
export function totalCost(option: CostOption, volume: number): number {
  requireNonNegative(option.trainingCost, 'trainingCost');
  requireNonNegative(option.perQueryCost, 'perQueryCost');
  requireNonNegative(volume, 'volume');
  return option.trainingCost + option.perQueryCost * volume;
}

export type Breakeven =
  /** The lines cross at a positive volume. */
  | {
      readonly kind: 'crossover';
      readonly volume: number;
      /** Cheaper below the breakeven: the option with the lower training cost. */
      readonly cheaperBelow: OptionKey;
      /** Cheaper above the breakeven: the option with the lower cost per query. */
      readonly cheaperAbove: OptionKey;
    }
  /** One option costs no more to train and less per query, so it is cheaper at every volume. */
  | { readonly kind: 'dominates'; readonly winner: OptionKey };

/**
 * Where the two cost lines cross. Throws BreakevenInputError('equal-per-query-cost') when the
 * two options cost the same per query: the lines are parallel and there is no breakeven.
 */
export function breakeven(a: CostOption, b: CostOption): Breakeven {
  validateOption(a, 'a');
  validateOption(b, 'b');
  const perQueryGap = b.perQueryCost - a.perQueryCost;
  if (perQueryGap === 0) {
    throw new BreakevenInputError(
      'equal-per-query-cost',
      'perQueryCost',
      'Both options cost the same per query, so their cost lines never cross',
    );
  }
  const cheaperAbove: OptionKey = perQueryGap > 0 ? 'a' : 'b';
  const cheaperBelow: OptionKey = cheaperAbove === 'a' ? 'b' : 'a';
  const volume = (a.trainingCost - b.trainingCost) / perQueryGap;
  if (volume <= 0) return { kind: 'dominates', winner: cheaperAbove };
  return { kind: 'crossover', volume, cheaperBelow, cheaperAbove };
}

/** Where a volume sits against the breakeven. */
export type Position = 'below' | 'at' | 'above' | 'no-crossover';

export interface Comparison {
  readonly volume: number;
  readonly totalA: number;
  readonly totalB: number;
  /** The option with the lower total at this volume. */
  readonly cheaper: OptionKey | 'tie';
  readonly breakeven: Breakeven;
  readonly position: Position;
}

/** Totals of both options at `volume`, the breakeven, and which side of it `volume` is on. */
export function compareAtVolume(a: CostOption, b: CostOption, volume: number): Comparison {
  requireNonNegative(volume, 'volume');
  const be = breakeven(a, b);
  const totalA = totalCost(a, volume);
  const totalB = totalCost(b, volume);
  const cheaper: OptionKey | 'tie' = totalA < totalB ? 'a' : totalB < totalA ? 'b' : 'tie';
  let position: Position = 'no-crossover';
  if (be.kind === 'crossover') {
    position = volume < be.volume ? 'below' : volume > be.volume ? 'above' : 'at';
  }
  return { volume, totalA, totalB, cheaper, breakeven: be, position };
}

/* ------------------------------------------------------------------------ */
/* Quality                                                                  */
/* ------------------------------------------------------------------------ */

export type QualityTrade =
  /** The option that is cheaper at this volume also scores at least as well. */
  | { readonly kind: 'cheaper-scores-at-least-as-well'; readonly cheaper: OptionKey; readonly qualityGap: number }
  /** Both options cost the same at this volume. */
  | { readonly kind: 'equal-cost'; readonly better: OptionKey | 'tie' }
  /** The cheaper option scores lower: what the better one costs per point of quality. */
  | {
      readonly kind: 'pay-for-quality';
      readonly better: OptionKey;
      readonly extraCost: number;
      readonly qualityGap: number;
      readonly costPerPoint: number;
    };

/** Prices the quality gap at the comparison's volume. */
export function priceQualityGap(comparison: Comparison, qualityA: number, qualityB: number): QualityTrade {
  requireFinite(qualityA, 'a.quality');
  requireFinite(qualityB, 'b.quality');
  if (comparison.cheaper === 'tie') {
    const better: OptionKey | 'tie' = qualityA > qualityB ? 'a' : qualityB > qualityA ? 'b' : 'tie';
    return { kind: 'equal-cost', better };
  }
  const cheaper = comparison.cheaper;
  const qCheaper = cheaper === 'a' ? qualityA : qualityB;
  const qOther = cheaper === 'a' ? qualityB : qualityA;
  if (qCheaper >= qOther) {
    return { kind: 'cheaper-scores-at-least-as-well', cheaper, qualityGap: qCheaper - qOther };
  }
  const better: OptionKey = cheaper === 'a' ? 'b' : 'a';
  const extraCost = Math.abs(comparison.totalA - comparison.totalB);
  const qualityGap = qOther - qCheaper;
  return { kind: 'pay-for-quality', better, extraCost, qualityGap, costPerPoint: extraCost / qualityGap };
}

export interface Evaluation extends Comparison {
  readonly quality: QualityTrade;
}

/** The whole calculation: totals, breakeven, side, and the price of the quality gap. */
export function evaluate(input: { readonly a: ScoredOption; readonly b: ScoredOption; readonly volume: number }): Evaluation {
  const comparison = compareAtVolume(input.a, input.b, input.volume);
  return { ...comparison, quality: priceQualityGap(comparison, input.a.quality, input.b.quality) };
}

/* ------------------------------------------------------------------------ */
/* Axis scaling and number formatting for the chart and the result lines    */
/* ------------------------------------------------------------------------ */

/** Smallest step of the form 1, 2, 2.5 or 5 times a power of ten that is at least `raw`. */
export function niceStep(raw: number): number {
  requireNonNegative(raw, 'raw');
  if (raw === 0) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const f = raw / power;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * power;
}

export interface Axis {
  readonly step: number;
  readonly max: number;
  readonly ticks: readonly number[];
}

/** An axis from zero that covers `rawMax` in about `target` nice steps. */
export function niceAxis(rawMax: number, target = 5): Axis {
  requireNonNegative(rawMax, 'rawMax');
  requirePositive(target, 'target');
  const step = niceStep(rawMax / target);
  const intervals = Math.max(1, Math.ceil(rawMax / step - 1e-9));
  const ticks = Array.from({ length: intervals + 1 }, (_, i) => i * step);
  return { step, max: intervals * step, ticks };
}

/** Whole count with thousands separators: 665466.67 -> "665,467". */
export function formatCount(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

/** Dollars: "$10,000" from 100 up, "$2.50" from 1, three significant digits below 1 ("$0.005"). */
export function formatUsd(n: number): string {
  const sign = n < 0 ? '-' : '';
  const x = Math.abs(n);
  if (x === 0) return '$0';
  if (x >= 100) return `${sign}$${Math.round(x).toLocaleString('en-US')}`;
  if (x >= 1) return `${sign}$${x.toFixed(2)}`;
  return `${sign}$${Number(x.toPrecision(3)).toString()}`;
}

/** Short axis label: 250000 -> "250K", 1250000 -> "1.25M". */
export function formatCompact(n: number): string {
  const x = Math.abs(n);
  const short = (v: number) => Number(v.toPrecision(3)).toString();
  if (x >= 1e9) return `${short(n / 1e9)}B`;
  if (x >= 1e6) return `${short(n / 1e6)}M`;
  if (x >= 1e3) return `${short(n / 1e3)}K`;
  return short(n);
}
