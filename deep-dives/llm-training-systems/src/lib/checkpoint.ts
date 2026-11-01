/**
 * Calculator D: checkpoint interval and storage (section 18).
 *
 * Failure model (2410.21680v2 Sec III, T04-7): a synchronous job fails when any node fails, so
 * job MTTF = 1 / (N_nodes x r_f).
 *
 * Interval (2410.21680v2 Eq. 3, the Daly and Young result as Meta cites it, T04-9):
 *   dt* = sqrt(2 w_cp / (N_nodes r_f))
 * with w_cp the time a save blocks training.
 *
 * Expected ETTR (2410.21680v2 Appendix A Eq. 10, read as wave2-reliability W4-17 and G5 do):
 *   E[ETTR] ~= (1 - N_nodes r_f (u_0 + dt/2)) / (1 + w_cp / dt)
 * for long, high-priority runs with negligible queue time, where u_0 is the restart overhead and
 * u_0 + dt/2 is much smaller than the run. Appendix A derives dt* assuming dt >> u_0, w_cp, and
 * Sec III checked the approximation against Monte Carlo only for job MTTF of about 0.1 day or
 * more; both regimes raise a warning here (G5).
 *
 * Storage: a synchronous save needs bytes / w_cp of aggregate write bandwidth; an asynchronous save
 * needs bytes / drain budget, the budget being no longer than the interval (04 W2, G9). FSx for
 * Lustre bandwidth is bought with capacity, with MBps read as 1e6 bytes per second because AWS does
 * not define it (U04-7), rounded up to a valid SSD size (W4-21).
 */

import {
  FSX_CAPACITY_STEPS_GIB,
  FSX_TIERS,
  GB,
  GiB,
  OPTIMIZER_ROWS,
  S3_CONNECTOR_PART_BYTES,
  S3_PUT_PER_SECOND_PER_PREFIX,
  TiB,
  requireFinite,
  requireNonNegative,
  requirePositive,
  requirePositiveInteger,
  type FsxTier,
  type OptimizerRowId,
} from './presets';

const SECONDS_PER_DAY = 86_400;

/** Job MTTF below this many days is outside the regime Meta checked against Monte Carlo (G5). */
export const CHECKED_REGIME_MTTF_DAYS = 0.1;
/** dt* below this multiple of u_0 breaks Appendix A's dt >> u_0 assumption (G5; "about three times", spec). */
export const INTERVAL_TO_RESTART_WARNING_RATIO = 3;

/**
 * Checkpoint bytes per parameter from an optimizer row: gradients are not saved, so the bytes are
 * the master copy and the optimizer state, plus the 16-bit working weights when they are saved
 * beside the master (14 for mixed-precision Adam) or not (12) (04 W2, our reading of T01-9).
 */
export function checkpointBytesPerParameter(row: OptimizerRowId, options: { saveWorkingWeights: boolean }): number {
  const r = OPTIMIZER_ROWS[row];
  if (!r) throw new RangeError(`row: unknown optimizer row ${String(row)}`);
  return r.masterBytes + r.stateBytes + (options.saveWorkingWeights ? r.weightBytes : 0);
}

/** Checkpoint size in total and per rank (04 W2: 70B at 14 bytes is 987.75 GB, 3.86 GB on 256 GPUs). */
export function checkpointSize(input: { parameters: number; bytesPerParameter: number; ranks: number }): {
  totalBytes: number;
  perRankBytes: number;
} {
  requirePositive('parameters', input.parameters);
  requirePositive('bytesPerParameter', input.bytesPerParameter);
  requirePositiveInteger('ranks', input.ranks);
  const totalBytes = input.parameters * input.bytesPerParameter;
  return { totalBytes, perRankBytes: totalBytes / input.ranks };
}

/** Job MTTF = 1 / (N_nodes x r_f), with r_f in failures per thousand node-days (T04-7). */
export function jobMttfSeconds(nodes: number, failuresPerThousandNodeDays: number): number {
  requirePositiveInteger('nodes', nodes);
  requirePositive('failuresPerThousandNodeDays', failuresPerThousandNodeDays);
  return SECONDS_PER_DAY / ((nodes * failuresPerThousandNodeDays) / 1_000);
}

export type SaveMode = 'synchronous' | 'asynchronous';

export interface CheckpointInput {
  checkpointBytes: number;
  nodes: number;
  failuresPerThousandNodeDays: number;
  stepSeconds: number;
  saveMode: SaveMode;
  /** w_cp: seconds a save blocks training. */
  blockingSeconds: number;
  /** u_0: seconds from failure to training again. */
  restartSeconds: number;
  /** Asynchronous only: seconds the storage has to drain one checkpoint; default the interval dt*. */
  drainBudgetSeconds?: number;
  /** FSx for Lustre PERSISTENT SSD tier in MBps per TiB; default 1,000. */
  fsxTier?: FsxTier;
  /** S3 multipart part size; default the S3 Connector for PyTorch's 8 MiB. */
  s3PartBytes?: number;
}

export interface CheckpointWarning {
  code: 'mttfBelowCheckedRegime' | 'intervalNotMuchLongerThanRestart' | 'drainBudgetLongerThanInterval' | 'ettrBelowZero';
  message: string;
}

export interface CheckpointResult {
  failuresPerSecond: number;
  mttfSeconds: number;
  mttfHours: number;
  mttfDays: number;
  intervalSeconds: number;
  intervalMinutes: number;
  intervalSteps: number;
  ettr: number;
  warnings: CheckpointWarning[];
  storage: {
    basis: 'blocking time' | 'drain budget';
    windowSeconds: number;
    writeBytesPerSecond: number;
    writeGBps: number;
    fsx: {
      tier: FsxTier;
      requiredTiB: number;
      requiredTiBTwoSignificant: number;
      requiredGiB: number;
      provisionedGiB: number;
      usdPerMonth: number;
      /** The same size if the offer's GB-month were decimal rather than the provisioned GiB count (W4-21). */
      usdPerMonthIfDecimalGB: number;
    };
    s3: {
      partBytes: number;
      partUploads: number;
      secondsAtOnePrefix: number;
    };
  };
  label: string;
}

/** Calculator D: Young-Daly interval, expected ETTR with regime warnings, and the storage it implies. */
export function checkpointPlan(input: CheckpointInput): CheckpointResult {
  requirePositive('checkpointBytes', input.checkpointBytes);
  requirePositiveInteger('nodes', input.nodes);
  requirePositive('failuresPerThousandNodeDays', input.failuresPerThousandNodeDays);
  requirePositive('stepSeconds', input.stepSeconds);
  requirePositive('blockingSeconds', input.blockingSeconds);
  requireNonNegative('restartSeconds', input.restartSeconds);
  if (input.saveMode !== 'synchronous' && input.saveMode !== 'asynchronous') {
    throw new RangeError(`saveMode must be 'synchronous' or 'asynchronous'`);
  }
  const tier = input.fsxTier ?? 1000;
  if (!FSX_TIERS[tier]) throw new RangeError(`fsxTier must be 125, 250, 500 or 1000 (got ${String(tier)})`);
  const partBytes = input.s3PartBytes ?? S3_CONNECTOR_PART_BYTES.value;
  requirePositive('s3PartBytes', partBytes);

  const mttfSeconds = jobMttfSeconds(input.nodes, input.failuresPerThousandNodeDays);
  const failuresPerSecond = 1 / mttfSeconds; // N_nodes r_f
  const w = input.blockingSeconds;
  const u0 = input.restartSeconds;
  // Eq. 3: dt* = sqrt(2 w_cp / (N_nodes r_f)).
  const dt = Math.sqrt((2 * w) / failuresPerSecond);
  // Eq. 10: E[ETTR] ~= (1 - N_nodes r_f (u_0 + dt/2)) / (1 + w_cp / dt).
  const rawEttr = (1 - failuresPerSecond * (u0 + dt / 2)) / (1 + w / dt);

  const warnings: CheckpointWarning[] = [];
  if (mttfSeconds / SECONDS_PER_DAY < CHECKED_REGIME_MTTF_DAYS) {
    warnings.push({
      code: 'mttfBelowCheckedRegime',
      message:
        'Job MTTF is below about 0.1 day, outside the regime Meta checked against a Monte Carlo estimate (2410.21680v2 Sec III); treat ETTR as indicative.',
    });
  }
  if (dt < INTERVAL_TO_RESTART_WARNING_RATIO * u0) {
    warnings.push({
      code: 'intervalNotMuchLongerThanRestart',
      message:
        'The interval is less than about three restart times; Appendix A derives it assuming the interval is much longer than the restart (2410.21680v2 Appendix A).',
    });
  }
  if (rawEttr < 0) {
    warnings.push({ code: 'ettrBelowZero', message: 'The ETTR approximation falls below zero here; it is reported as 0.' });
  }

  // Storage window: blocking time (synchronous) or drain budget (asynchronous, at most the interval).
  let windowSeconds = w;
  let basis: 'blocking time' | 'drain budget' = 'blocking time';
  if (input.saveMode === 'asynchronous') {
    basis = 'drain budget';
    windowSeconds = input.drainBudgetSeconds ?? dt;
    requirePositive('drainBudgetSeconds', windowSeconds);
    if (windowSeconds > dt) {
      warnings.push({
        code: 'drainBudgetLongerThanInterval',
        message: 'The drain budget is longer than the interval, so the next save would start before this one has drained.',
      });
    }
  }
  const writeBytesPerSecond = input.checkpointBytes / windowSeconds;

  // FSx: TiB = MBps needed / MBps per TiB, with MB = 1e6 bytes (U04-7); round up to 1,200, 2,400, then 2,400 steps (W4-21).
  const fsxTier = FSX_TIERS[tier];
  const requiredTiB = writeBytesPerSecond / 1e6 / fsxTier.mbpsPerTib.value;
  const requiredGiB = (requiredTiB * TiB) / GiB;
  const provisionedGiB = roundUpToFsxSize(requiredGiB);
  const usdPerMonth = provisionedGiB * fsxTier.usdPerGbMonth.value;
  const usdPerMonthIfDecimalGB = ((provisionedGiB * GiB) / GB) * fsxTier.usdPerGbMonth.value;

  // S3: one PUT per part at the connector's part size; seconds at one prefix's 3,500 PUT/s floor (W4-22).
  const partUploads = Math.ceil(input.checkpointBytes / partBytes);

  return {
    failuresPerSecond,
    mttfSeconds,
    mttfHours: mttfSeconds / 3_600,
    mttfDays: mttfSeconds / SECONDS_PER_DAY,
    intervalSeconds: dt,
    intervalMinutes: dt / 60,
    intervalSteps: Math.max(1, Math.round(dt / input.stepSeconds)),
    ettr: Math.max(0, rawEttr),
    warnings,
    storage: {
      basis,
      windowSeconds,
      writeBytesPerSecond,
      writeGBps: writeBytesPerSecond / GB,
      fsx: {
        tier,
        requiredTiB,
        requiredTiBTwoSignificant: Number(requiredTiB.toPrecision(2)),
        requiredGiB,
        provisionedGiB,
        usdPerMonth,
        usdPerMonthIfDecimalGB,
      },
      s3: {
        partBytes,
        partUploads,
        secondsAtOnePrefix: partUploads / S3_PUT_PER_SECOND_PER_PREFIX.value,
      },
    },
    label: 'estimate; confirm with a measured step',
  };
}

/** Smallest valid FSx SSD size at or above the need: 1,200 GiB, 2,400 GiB, then increments of 2,400 GiB (W4-21). */
export function roundUpToFsxSize(requiredGiB: number): number {
  requireFinite('requiredGiB', requiredGiB);
  if (requiredGiB <= FSX_CAPACITY_STEPS_GIB.first.value) return FSX_CAPACITY_STEPS_GIB.first.value;
  if (requiredGiB <= FSX_CAPACITY_STEPS_GIB.second.value) return FSX_CAPACITY_STEPS_GIB.second.value;
  const step = FSX_CAPACITY_STEPS_GIB.increment.value;
  return Math.ceil(requiredGiB / step) * step;
}
