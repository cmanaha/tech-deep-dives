/** Small scale helpers for hand-written SVG charts (no charting dependency). */

/** Linear map from a data domain to a pixel range. */
export function linear(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  const k = (r1 - r0) / (d1 - d0);
  return (v) => r0 + (v - d0) * k;
}

/** Base-10 logarithmic map from a positive data domain to a pixel range. */
export function log10Scale(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  const a = Math.log10(d0);
  const k = (r1 - r0) / (Math.log10(d1) - a);
  return (v) => r0 + (Math.log10(v) - a) * k;
}

/** Powers of ten from d0 to d1 inclusive, for log-axis ticks. */
export function decades(d0: number, d1: number): number[] {
  const out: number[] = [];
  for (let e = Math.ceil(Math.log10(d0) - 1e-9); e <= Math.floor(Math.log10(d1) + 1e-9); e += 1) out.push(10 ** e);
  return out;
}

/** Evenly spaced ticks from 0 (or d0) to d1 in the given step. */
export function ticks(d0: number, d1: number, step: number): number[] {
  const out: number[] = [];
  for (let v = d0; v <= d1 + step * 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

/** 12345.6 -> "12,346"; keeps `digits` decimals when given. */
export function fmt(v: number, digits = 0): string {
  return v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
