/**
 * Calculator A: run time and accelerator-hours (section 4), with the cost panel of section 22.
 *
 * Identity (T01-58, assembled from PaLM 2204.02311v5 Appendix B and Megatron-LM 2104.04473v5):
 *   time = D x FLOPs per token / (accelerators x dense peak x MFU)
 * with FLOPs per token = 6N (T01-14, T01-18) plus the attention term 12 L (H Q) s, or half of it
 * with a causal kernel (01 W6, C01-2). No overhead factor is applied anywhere (01 W7, wave2-step-maths W1-13).
 * Plain data in, plain data out.
 */

import {
  DEFAULT_MFU,
  EKS_FEES,
  INSTANCES,
  PCS_FEES,
  PRICES,
  SOURCES,
  requireFinite,
  requirePositive,
  requirePositiveInteger,
  requireUnitFraction,
  type InstanceId,
  type ModelShape,
  type MoeModelShape,
  type PcsControllerSize,
  type PricePath,
  type Source,
} from './presets';

/** none = 6N only; causal = 6 L (H Q) s; noDiscount = 12 L (H Q) s (01 W6). */
export type AttentionMode = 'none' | 'causal' | 'noDiscount';

/**
 * Which parameter count stands for N in 6N:
 * full = every parameter (section 29's tokens per second use it); matmul = the layers' linear
 * weights plus the head (01 W1, strictly the N of 6N); nonEmbedding = full minus the embedding
 * table, TorchTitan v0.4.0's count (wave2-observability W6-9); activated = an MoE model's
 * per-token active parameters (T01-26); custom = a number the caller supplies.
 */
export type ParameterBasis = 'full' | 'matmul' | 'nonEmbedding' | 'activated' | 'custom';

export interface FlopsPerTokenInput {
  /** N in 6N. */
  parameters: number;
  layers: number;
  /** H x Q, heads times head dimension; equals h for every Llama 3.1 size. */
  attentionWidth: number;
  sequenceLength: number;
  attention: AttentionMode;
}

export interface FlopsPerToken {
  dense: number;
  attention: number;
  total: number;
  /** attention / total. */
  attentionShare: number;
}

/** FLOPs per training token, forward plus backward. */
export function flopsPerToken(input: FlopsPerTokenInput): FlopsPerToken {
  requirePositive('parameters', input.parameters);
  requirePositiveInteger('layers', input.layers);
  requirePositiveInteger('attentionWidth', input.attentionWidth);
  requirePositiveInteger('sequenceLength', input.sequenceLength);
  requireAttentionMode(input.attention);
  // 6N: 2N forward and 4N backward (Kaplan 2001.08361v1 Eq. 2.1, PaLM 2204.02311v5 Appendix B; T01-14, T01-18).
  const dense = 6 * input.parameters;
  // 12LHQT per token without a causal discount (PaLM, T01-18; 01 W6); a causal kernel skips about half (C01-2).
  const noDiscount = 12 * input.layers * input.attentionWidth * input.sequenceLength;
  const attention = input.attention === 'none' ? 0 : input.attention === 'causal' ? noDiscount / 2 : noDiscount;
  const total = dense + attention;
  return { dense, attention, total, attentionShare: attention / total };
}

/** The pieces of a dense model Calculator A reads, with the chosen parameter count. */
export interface RuntimeModelInputs {
  parameters: number;
  parameterBasis: ParameterBasis;
  layers: number;
  attentionWidth: number;
}

/** Picks N for a dense model under the chosen basis (01 W1; wave2-step-maths W1-13; W6-9). */
export function denseRuntimeInputs(
  model: ModelShape,
  basis: Exclude<ParameterBasis, 'activated' | 'custom'>,
): RuntimeModelInputs {
  const parameters =
    basis === 'full'
      ? model.totalParameters
      : basis === 'matmul'
        ? model.matmulParameters
        : model.totalParameters - model.embeddingParameters;
  return { parameters, parameterBasis: basis, layers: model.layers, attentionWidth: model.heads * model.headDim };
}

/** For an MoE model, 6ND uses the activated parameters per token (T01-26). */
export function moeRuntimeInputs(model: MoeModelShape): RuntimeModelInputs {
  return {
    parameters: model.activatedParameters,
    parameterBasis: 'activated',
    layers: model.layers,
    attentionWidth: model.heads * model.headDim,
  };
}

export interface RuntimeInput extends RuntimeModelInputs {
  /** Training tokens D. */
  tokens: number;
  sequenceLength: number;
  attention: AttentionMode;
  /** Dense peak per accelerator at the training precision, TFLOPS (989.5 for H100 BF16). */
  peakTflopsPerAccelerator: number;
  accelerators: number;
  /** Model FLOPs utilization in (0, 1]; default 0.40, an assumption (DEFAULT_MFU). */
  mfu?: number;
}

export interface RuntimeResult {
  parameterBasis: ParameterBasis;
  attention: AttentionMode;
  mfu: number;
  mfuIsDefaultAssumption: boolean;
  flopsPerToken: FlopsPerToken;
  totalFlops: number;
  /** Accelerator-hours at the stated MFU. */
  acceleratorHours: number;
  wallClockSeconds: number;
  wallClockDays: number;
  tokensPerSecondPerAccelerator: number;
  label: string;
}

/** Calculator A: total FLOPs, accelerator-hours, wall-clock time and tokens per second per accelerator. */
export function estimateRun(input: RuntimeInput): RuntimeResult {
  requirePositive('tokens', input.tokens);
  requirePositive('peakTflopsPerAccelerator', input.peakTflopsPerAccelerator);
  requirePositiveInteger('accelerators', input.accelerators);
  const mfu = input.mfu ?? DEFAULT_MFU.value;
  requireUnitFraction('mfu', mfu);
  const perToken = flopsPerToken(input);
  const totalFlops = perToken.total * input.tokens;
  const achievedFlopsPerAccelerator = input.peakTflopsPerAccelerator * 1e12 * mfu;
  // time = D x FLOPs per token / (accelerators x peak x MFU) (T01-58).
  const acceleratorSeconds = totalFlops / achievedFlopsPerAccelerator;
  const wallClockSeconds = acceleratorSeconds / input.accelerators;
  return {
    parameterBasis: input.parameterBasis,
    attention: input.attention,
    mfu,
    mfuIsDefaultAssumption: input.mfu === undefined,
    flopsPerToken: perToken,
    totalFlops,
    acceleratorHours: acceleratorSeconds / 3_600,
    wallClockSeconds,
    wallClockDays: wallClockSeconds / 86_400,
    // tokens per second = MFU x peak / FLOPs per token (PaLM's MFU definition rearranged, T01-18).
    tokensPerSecondPerAccelerator: achievedFlopsPerAccelerator / perToken.total,
    label: 'estimate; confirm with a measured step',
  };
}

/** MFU implied by a measured throughput: tokens per second x FLOPs per token / peak (T01-18). */
export function mfuFromThroughput(input: {
  tokensPerSecondPerAccelerator: number;
  flopsPerToken: number;
  peakTflopsPerAccelerator: number;
}): number {
  requirePositive('tokensPerSecondPerAccelerator', input.tokensPerSecondPerAccelerator);
  requirePositive('flopsPerToken', input.flopsPerToken);
  requirePositive('peakTflopsPerAccelerator', input.peakTflopsPerAccelerator);
  return (input.tokensPerSecondPerAccelerator * input.flopsPerToken) / (input.peakTflopsPerAccelerator * 1e12);
}

/**
 * Sequence length at which attention reaches a given share of per-token FLOPs:
 * solve a s / (6N + a s) = share, with a = 12 L (H Q) (no discount) or 6 L (H Q) (causal) (01 W6).
 */
export function attentionCrossoverSequenceLength(input: {
  parameters: number;
  layers: number;
  attentionWidth: number;
  attention: Exclude<AttentionMode, 'none'>;
  share: number;
}): number {
  requirePositive('parameters', input.parameters);
  requirePositiveInteger('layers', input.layers);
  requirePositiveInteger('attentionWidth', input.attentionWidth);
  requireAttentionMode(input.attention);
  requireFinite('share', input.share);
  if (input.share <= 0 || input.share >= 1) throw new RangeError(`share must be in (0, 1) (got ${input.share})`);
  const a = (input.attention === 'causal' ? 6 : 12) * input.layers * input.attentionWidth;
  return (input.share * 6 * input.parameters) / (a * (1 - input.share));
}

function requireAttentionMode(mode: AttentionMode): void {
  if (mode !== 'none' && mode !== 'causal' && mode !== 'noDiscount') {
    throw new RangeError(`attention must be 'none', 'causal' or 'noDiscount' (got ${String(mode)})`);
  }
}

// ---------------------------------------------------------------------------------------------
// Cost panel (section 22)
// ---------------------------------------------------------------------------------------------

export interface CostInput {
  acceleratorHours: number;
  accelerators: number;
  instance: InstanceId;
  /**
   * SageMaker managed Spot training publishes no separate rate (U05-4), so the panel takes the
   * discount the user expects, in [0, 1), and applies it to the training-job rate.
   */
  managedSpotDiscount?: number;
  /** PCS controller size; default the smallest that holds the instance count (T06-35). */
  pcsControllerSize?: PcsControllerSize;
  /** EKS Kubernetes version support tier (T06-40). */
  eksSupport?: 'standard' | 'extended';
}

export interface CostLine {
  path: PricePath | 'sagemakerManagedSpot';
  unit: string;
  usdPerUnitHour: number;
  unitHours: number;
  usd: number;
  region: string;
  date: string;
  source: Source;
  note?: string;
}

export interface FeeLine {
  fee: 'pcs' | 'eks' | 'eksAutoMode';
  description: string;
  usd: number;
  region: string;
  sources: Source[];
}

export interface CostResult {
  instance: InstanceId;
  instances: number;
  wallClockHours: number;
  wallClockDays: number;
  lines: CostLine[];
  fees: FeeLine[];
  notes: string[];
}

/** Prices accelerator-hours across every purchase path the presets carry for an instance, plus path fees. */
export function priceRun(input: CostInput): CostResult {
  requirePositive('acceleratorHours', input.acceleratorHours);
  requirePositiveInteger('accelerators', input.accelerators);
  const preset = INSTANCES[input.instance];
  if (!preset) throw new RangeError(`instance: unknown instance ${String(input.instance)}`);
  const perInstance = preset.acceleratorsPerInstance.value;
  if (input.accelerators % perInstance !== 0) {
    throw new RangeError(`accelerators (${input.accelerators}) must be a multiple of ${perInstance} for ${input.instance}`);
  }
  const instances = input.accelerators / perInstance;
  const wallClockHours = input.acceleratorHours / input.accelerators;
  const instanceHours = input.acceleratorHours / perInstance;
  const notes: string[] = [];

  const lines: CostLine[] = PRICES.filter((row) => row.instance === input.instance).map((row) => {
    const unitHours = input.acceleratorHours / row.acceleratorsPerUnit.value;
    return {
      path: row.path,
      unit: row.unit,
      usdPerUnitHour: row.usdPerUnitHour.value,
      unitHours,
      usd: unitHours * row.usdPerUnitHour.value,
      region: row.region,
      date: row.date,
      source: row.usdPerUnitHour.source,
    };
  });

  if (input.managedSpotDiscount !== undefined) {
    requireFinite('managedSpotDiscount', input.managedSpotDiscount);
    if (input.managedSpotDiscount < 0 || input.managedSpotDiscount >= 1) {
      throw new RangeError(`managedSpotDiscount must be in [0, 1) (got ${input.managedSpotDiscount})`);
    }
    const training = lines.find((l) => l.path === 'sagemakerTraining');
    if (training) {
      const rate = training.usdPerUnitHour * (1 - input.managedSpotDiscount);
      lines.push({
        ...training,
        path: 'sagemakerManagedSpot',
        usdPerUnitHour: rate,
        usd: training.unitHours * rate,
        source: SOURCES.managedSpot,
        note: 'user-entered discount on the training-job rate; AWS publishes no managed Spot rate',
      });
    } else {
      notes.push(`no SageMaker training-job rate in the presets for ${input.instance}, so no managed Spot line`);
    }
  }
  if (lines.length === 0) notes.push(`no price rows in the presets for ${input.instance}`);

  const fees: FeeLine[] = [];
  // PCS: controller-hours plus the advanced node fee per P or Trn instance-hour (T06-36).
  const size = input.pcsControllerSize ?? smallestPcsSize(instances);
  if (size && instances <= PCS_FEES.maxInstances[size].value) {
    const controller = PCS_FEES.controllerUsdPerHour[size];
    const node = PCS_FEES.advancedNodeUsdPerInstanceHour;
    fees.push({
      fee: 'pcs',
      description: `AWS PCS ${size} controller plus advanced node management`,
      usd: controller.value * wallClockHours + node.value * instanceHours,
      region: 'US East (N. Virginia)',
      sources: [controller.source, node.source, PCS_FEES.maxInstances[size].source],
    });
  } else {
    notes.push(`${instances} instances exceed the PCS ${size ?? 'large'} limit; larger needs contact with AWS (T06-35)`);
  }
  // EKS: cluster-hour, plus extended support if chosen (T06-40).
  const clusterRate =
    EKS_FEES.clusterUsdPerHour.value + (input.eksSupport === 'extended' ? EKS_FEES.extendedSupportExtraUsdPerHour.value : 0);
  fees.push({
    fee: 'eks',
    description: `Amazon EKS cluster on ${input.eksSupport ?? 'standard'} support`,
    usd: clusterRate * wallClockHours,
    region: 'US East (N. Virginia)',
    sources: [EKS_FEES.clusterUsdPerHour.source],
  });
  // EKS Auto Mode: per-instance management fee plus the cluster fee (T06-41).
  const autoMode = EKS_FEES.autoModeUsdPerInstanceHour[input.instance];
  if (autoMode) {
    fees.push({
      fee: 'eksAutoMode',
      description: 'Amazon EKS Auto Mode management plus the cluster fee',
      usd: autoMode.value * instanceHours + clusterRate * wallClockHours,
      region: 'US East (N. Virginia)',
      sources: [autoMode.source],
    });
  }

  return { instance: input.instance, instances, wallClockHours, wallClockDays: wallClockHours / 24, lines, fees, notes };
}

function smallestPcsSize(instances: number): PcsControllerSize | undefined {
  const sizes: PcsControllerSize[] = ['small', 'medium', 'large'];
  return sizes.find((size) => instances <= PCS_FEES.maxInstances[size].value);
}
