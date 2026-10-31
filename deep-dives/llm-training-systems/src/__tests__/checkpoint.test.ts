import { describe, expect, it } from 'vitest';
import { DENSE_MODELS, FAILURE_RATES, GB } from '../lib/presets';
import {
  CHECKED_REGIME_MTTF_DAYS,
  checkpointBytesPerParameter,
  checkpointPlan,
  checkpointSize,
  jobMttfSeconds,
  roundUpToFsxSize,
  type CheckpointInput,
} from '../lib/checkpoint';

const N70 = DENSE_MODELS['llama-3.1-70b'].totalParameters.value;
const BYTES_70B = checkpointSize({ parameters: N70, bytesPerParameter: 14, ranks: 256 }).totalBytes;

function plan(overrides: Partial<CheckpointInput> = {}) {
  return checkpointPlan({
    checkpointBytes: BYTES_70B,
    nodes: 32,
    failuresPerThousandNodeDays: FAILURE_RATES.rsc1.value,
    stepSeconds: 17.5,
    saveMode: 'synchronous',
    blockingSeconds: 60,
    restartSeconds: 600,
    ...overrides,
  });
}
const codes = (r: ReturnType<typeof plan>) => r.warnings.map((w) => w.code);

describe('04 W1 and T04-7: job MTTF across the failure-rate presets', () => {
  const days = (nodes: number, rate: number) => jobMttfSeconds(nodes, rate) / 86_400;
  const hours = (nodes: number, rate: number) => jobMttfSeconds(nodes, rate) / 3_600;

  // Tolerance: the spec rounds to whole days ("2 to 13") and to tenths of an hour ("0.7 to 5").
  it('04 W1: a 256-GPU job (32 p5.48xlarge) has an MTTF of 2 to 13 days across the presets', () => {
    expect(Math.abs(days(32, FAILURE_RATES.rsc1WorstMonth.value) - 2)).toBeLessThan(0.5);
    expect(Math.abs(days(32, FAILURE_RATES.rsc1.value) - 4.8)).toBeLessThan(0.05);
    expect(Math.abs(days(32, FAILURE_RATES.rsc2.value) - 13)).toBeLessThan(0.5);
  });

  it('04 W1: a 16,384-GPU job (2,048 nodes) has an MTTF of 0.7 to 5 hours', () => {
    expect(Math.abs(hours(2_048, FAILURE_RATES.rsc1WorstMonth.value) - 0.7)).toBeLessThan(0.05);
    expect(Math.abs(hours(2_048, FAILURE_RATES.rsc2.value) - 5)).toBeLessThan(0.05);
  });
});

describe('04 W2: checkpoint size', () => {
  it('04 W2: mixed-precision Adam saves 14 bytes per parameter with the working weights, 12 without', () => {
    expect(checkpointBytesPerParameter('adamMixed', { saveWorkingWeights: true })).toBe(14);
    expect(checkpointBytesPerParameter('adamMixed', { saveWorkingWeights: false })).toBe(12);
  });

  // Tolerance: 987.75 GB is exact to the printed digits; 3.86 GB to 0.005.
  it('04 W2: the 70B checkpoint at 14 bytes per parameter is about 988 GB, 3.86 GB per GPU on 256 GPUs', () => {
    const size = checkpointSize({ parameters: N70, bytesPerParameter: 14, ranks: 256 });
    expect(Math.abs(size.totalBytes / GB - 987.75)).toBeLessThan(0.005);
    expect(Math.abs(size.perRankBytes / GB - 3.86)).toBeLessThan(0.005);
  });
});

describe('04 W3 and wave2-reliability W4-17, W4-18: interval and ETTR for 70B on 256 GPUs', () => {
  // Tolerance: seconds to the second, ETTR to the five decimals W4-18 prints.
  it('W4-18: a 60 s blocking save at r_f 6.50 and u_0 = 10 minutes gives an interval of 7,060 s (2.0 hours)', () => {
    const r = plan();
    expect(Math.abs(r.intervalSeconds - 7_060)).toBeLessThan(1);
    expect(r.intervalSeconds / 3_600).toBeCloseTo(2.0, 1);
    expect(r.intervalSteps).toBe(Math.round(r.intervalSeconds / 17.5));
  });

  it('W4-18: a 2 s blocking save gives 1,289 s (21.5 minutes)', () => {
    const r = plan({ blockingSeconds: 2 });
    expect(Math.abs(r.intervalSeconds - 1_289)).toBeLessThan(1);
    expect(Math.abs(r.intervalMinutes - 21.5)).toBeLessThan(0.05);
  });

  it('W4-18: ETTR is 0.98171 for the 60 s save, printed 0.982', () => {
    const r = plan();
    expect(Math.abs(r.ettr - 0.98171)).toBeLessThan(0.000005);
    expect(r.ettr.toFixed(3)).toBe('0.982');
  });

  it('W4-18: ETTR is 0.99546 for the 2 s save, printed 0.995 (0.996 was a rounding error)', () => {
    const r = plan({ blockingSeconds: 2 });
    expect(Math.abs(r.ettr - 0.99546)).toBeLessThan(0.000005);
    expect(r.ettr.toFixed(3)).toBe('0.995');
  });

  it('G5: the 2 s row raises the interval-to-restart warning (1,289 s is below 3 x 600 s); the 60 s row raises none', () => {
    expect(codes(plan({ blockingSeconds: 2 }))).toEqual(['intervalNotMuchLongerThanRestart']);
    expect(codes(plan())).toEqual([]);
  });
});

describe('04 W3 and wave2-reliability G5: 16,384 GPUs', () => {
  const big = (overrides: Partial<CheckpointInput> = {}) => plan({ nodes: 2_048, ...overrides });

  // Tolerance: two decimals as printed, 0.005.
  it('04 W3: ETTR 0.79 for a 60 s save at a 10-minute restart', () => {
    expect(Math.abs(big().ettr - 0.79)).toBeLessThan(0.005);
  });

  it('04 W3: ETTR 0.88 for a 2 s save at a 10-minute restart, and 0.93 at 5 minutes', () => {
    expect(Math.abs(big({ blockingSeconds: 2 }).ettr - 0.88)).toBeLessThan(0.005);
    expect(Math.abs(big({ blockingSeconds: 2, restartSeconds: 300 }).ettr - 0.93)).toBeLessThan(0.005);
  });

  // The spec and wave2-reliability say dt* of 2.7 to 15 minutes "is shorter than u_0"; that holds for
  // 2.7 minutes (161 s) but not for 14.7 minutes (883 s) against a 600 s u_0. Both are below 3 x u_0,
  // which is the warning's threshold, so both rows warn.
  it('G5: an MTTF of 1.8 hours triggers both warnings; dt* is 2.7 to 15 minutes, below 3 x u_0', () => {
    const slow = big();
    const fast = big({ blockingSeconds: 2 });
    expect(Math.abs(slow.mttfHours - 1.8)).toBeLessThan(0.05);
    expect(slow.mttfDays).toBeLessThan(CHECKED_REGIME_MTTF_DAYS);
    expect(Math.abs(fast.intervalMinutes - 2.7)).toBeLessThan(0.05);
    expect(Math.abs(slow.intervalMinutes - 15)).toBeLessThan(0.5);
    expect(fast.intervalSeconds).toBeLessThan(600);
    expect(slow.intervalSeconds).toBeGreaterThan(600);
    for (const r of [slow, fast]) {
      expect(codes(r)).toContain('mttfBelowCheckedRegime');
      expect(codes(r)).toContain('intervalNotMuchLongerThanRestart');
      expect(r.intervalSeconds).toBeLessThan(3 * 600);
    }
  });

  it('ETTR is clamped at 0 with a warning when the approximation goes negative', () => {
    const r = plan({ nodes: 100_000, failuresPerThousandNodeDays: 17.5, restartSeconds: 3_600 });
    expect(r.ettr).toBe(0);
    expect(codes(r)).toContain('ettrBelowZero');
  });
});

describe('04 W2, wave2-reliability W4-21, W4-22 and G9: storage', () => {
  // Tolerance: two decimals as printed (16.46, 0.77), whole GiB and dollars exactly.
  it('W4-21: a 60 s save of the 70B checkpoint needs 16.46 GB/s, 16.46 TiB at PERSISTENT-1000 (decimal MB)', () => {
    const r = plan();
    expect(Math.abs(r.storage.writeGBps - 16.46)).toBeLessThan(0.005);
    expect(Math.abs(r.storage.fsx.requiredTiB - 16.46)).toBeLessThan(0.005);
    expect(r.storage.fsx.requiredTiBTwoSignificant).toBe(16);
    expect(r.storage.basis).toBe('blocking time');
  });

  it('W4-21: rounded up to 19,200 GiB, $11,520 a month at $0.600 on 19,200 GB-months', () => {
    const r = plan();
    expect(r.storage.fsx.provisionedGiB).toBe(19_200);
    expect(r.storage.fsx.usdPerMonth).toBeCloseTo(11_520, 6);
    // "On the order of $10,000 to $12,000" (W4-21).
    expect(r.storage.fsx.usdPerMonth).toBeGreaterThan(10_000);
    expect(r.storage.fsx.usdPerMonth).toBeLessThan(12_000);
  });

  it('G9: the asynchronous drain target for the 2 s row is 987.75 GB over 1,289 s = 0.77 GB/s', () => {
    const r = plan({ blockingSeconds: 2, saveMode: 'asynchronous' });
    expect(r.storage.basis).toBe('drain budget');
    expect(Math.abs(r.storage.windowSeconds - 1_289)).toBeLessThan(1);
    expect(Math.abs(r.storage.writeGBps - 0.77)).toBeLessThan(0.005);
  });

  it('G9: a drain budget longer than the interval is flagged', () => {
    const r = plan({ blockingSeconds: 2, saveMode: 'asynchronous', drainBudgetSeconds: 5_000 });
    expect(codes(r)).toContain('drainBudgetLongerThanInterval');
  });

  it('W4-22: 987.75 GB at 8 MiB parts is 117,749 part uploads, 33.6 s at 3,500 PUT per second', () => {
    const r = plan({ checkpointBytes: 987.75 * GB });
    expect(r.storage.s3.partUploads).toBe(117_749);
    expect(Math.abs(r.storage.s3.secondsAtOnePrefix - 33.6)).toBeLessThan(0.05);
  });

  it('W4-22: the unrounded 70B checkpoint (987,751,890,944 bytes) needs one part more, 117,750', () => {
    expect(BYTES_70B).toBe(987_751_890_944);
    expect(plan().storage.s3.partUploads).toBe(117_750);
  });

  it('W4-21: FSx sizes round up to 1,200 GiB, 2,400 GiB, then steps of 2,400 GiB', () => {
    expect(roundUpToFsxSize(1)).toBe(1_200);
    expect(roundUpToFsxSize(1_200)).toBe(1_200);
    expect(roundUpToFsxSize(1_201)).toBe(2_400);
    expect(roundUpToFsxSize(2_401)).toBe(4_800);
    expect(roundUpToFsxSize(16_857)).toBe(19_200);
  });
});

describe('input validation', () => {
  it('throws a RangeError naming the field on non-positive counts and times', () => {
    expect(() => plan({ nodes: 0 })).toThrow(/nodes/);
    expect(() => plan({ nodes: 1.5 })).toThrow(/nodes/);
    expect(() => plan({ failuresPerThousandNodeDays: 0 })).toThrow(/failuresPerThousandNodeDays/);
    expect(() => plan({ blockingSeconds: 0 })).toThrow(/blockingSeconds/);
    expect(() => plan({ stepSeconds: -1 })).toThrow(/stepSeconds/);
    expect(() => plan({ checkpointBytes: 0 })).toThrow(/checkpointBytes/);
    expect(() => plan({ restartSeconds: -1 })).toThrow(/restartSeconds/);
    expect(() => checkpointSize({ parameters: N70, bytesPerParameter: 14, ranks: 0 })).toThrow(/ranks/);
  });

  it('throws on an unknown FSx tier or save mode', () => {
    expect(() => plan({ fsxTier: 300 as never })).toThrow(/fsxTier/);
    expect(() => plan({ saveMode: 'eventually' as never })).toThrow(/saveMode/);
  });

  it('every number in a result is finite', () => {
    const r = plan({ saveMode: 'asynchronous', blockingSeconds: 2 });
    const numbers = [
      r.mttfSeconds,
      r.intervalSeconds,
      r.ettr,
      r.storage.writeBytesPerSecond,
      r.storage.fsx.requiredTiB,
      r.storage.fsx.usdPerMonth,
      r.storage.fsx.usdPerMonthIfDecimalGB,
      r.storage.s3.secondsAtOnePrefix,
    ];
    for (const n of numbers) expect(Number.isFinite(n)).toBe(true);
  });
});
