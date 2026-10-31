/**
 * Shared data for the four calculators of the LLM training systems dive.
 *
 * Every number here carries a `source` taken from the register row that supplies it
 * (research/2026-10/*.md), with the row's pinned URL: arXiv URLs carry their version and
 * GitHub URLs a tag or a 40-character SHA. Wave 2 verdict files override the registers where
 * they disagree. Memory figures keep the unit their source prints (GB = 1e9 bytes,
 * GiB = 2^30 bytes) and are converted explicitly by `memoryFigureBytes`.
 *
 * Plain data and small pure helpers only: no React, no I/O.
 */

// ---------------------------------------------------------------------------------------------
// Source records
// ---------------------------------------------------------------------------------------------

/** Source tier, as in the dive's research guide (0 = our experiments, 1 = code and first-party docs, 2 = first-party posts, 3 = papers). */
export type Tier = 0 | 1 | 2 | 3;

/**
 * How a number relates to its source when it is more than "the source prints it":
 * derived = our arithmetic over the cited inputs; assumption = a stated working assumption;
 * vendor-specification = a spec-sheet figure, not a measurement.
 */
export type SourceBasis = 'derived' | 'assumption' | 'vendor-specification';

export interface Source {
  label: string;
  url: string;
  tier: Tier;
  basis?: SourceBasis;
}

export interface Sourced<T = number> {
  value: T;
  source: Source;
}

export type MemoryUnit = 'GB' | 'GiB';

/** A memory capacity in the unit its source prints. */
export interface MemoryFigure {
  value: number;
  unit: MemoryUnit;
  source: Source;
}

/** Decimal gigabyte, the unit every register uses for derived byte totals. */
export const GB = 1e9;
/** Binary gibibyte, the unit AWS's instance pages use for accelerator memory. */
export const GiB = 2 ** 30;
export const MiB = 2 ** 20;
export const TiB = 2 ** 40;

/** Converts a memory figure to bytes, using the unit the source printed. */
export function memoryFigureBytes(figure: MemoryFigure): number {
  requirePositive('memoryFigure.value', figure.value);
  return figure.value * (figure.unit === 'GB' ? GB : GiB);
}

/** Date the price rows were read (registers 05 and 06; wave 2 re-read them on 2026-10-31). */
export const PRICES_READ_ON = '2026-10-30';

/** Commit of this repository that holds the research files (same pin as Cite.tsx DIVE_REPO_SHA). */
const DIVE_REPO_SHA = 'bd8184164fc3abbe0390183e11e4236c2940abe7';

function researchUrl(file: string): string {
  return `https://github.com/cmanaha/tech-deep-dives/blob/${DIVE_REPO_SHA}/deep-dives/llm-training-systems/research/2026-10/${file}`;
}

const LLAMA_MODELS_SHA = '5fdf83110cc9daa7435dfba6eb304892cc0041b8';
const MEGATRON_SHA = '685fb8bd970185e9ac3283fe32a5d6667bf4b268';
const NEURON_SDK_SHA = '10832bbcc6b6920b3046a7d7aa59b6b684f6b81a';
const S3_CONNECTOR_SHA = 'c4f482629523d8fd2ec6080f70bda5966f90d89a';
const EC2_OFFER = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634';
const SAGEMAKER_OFFER = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009';

/** Named sources reused across the presets. */
export const SOURCES = {
  llama3Table3: {
    label: 'The Llama 3 Herd of Models (2407.21783v3), Table 3 (T01-1)',
    url: 'https://arxiv.org/abs/2407.21783v3',
    tier: 3,
  },
  llama3Table4: {
    label: 'The Llama 3 Herd of Models (2407.21783v3), Table 4: BF16 MFU 38% to 43% (T01-6)',
    url: 'https://arxiv.org/abs/2407.21783v3',
    tier: 3,
  },
  llamaTokenizer: {
    label: 'llama-models v0.2.0, models/llama3/tokenizer.py: 128,256 entries (T01-2)',
    url: `https://github.com/meta-llama/llama-models/blob/${LLAMA_MODELS_SHA}/models/llama3/tokenizer.py`,
    tier: 1,
  },
  llamaModelCode: {
    label: 'llama-models v0.2.0, models/llama3/model.py: three-matrix SwiGLU, untied head (T01-4); counts in 01 W1',
    url: `https://github.com/meta-llama/llama-models/blob/${LLAMA_MODELS_SHA}/models/llama3/model.py`,
    tier: 1,
    basis: 'derived',
  },
  hf8b: {
    label: 'Hugging Face API, meta-llama/Llama-3.1-8B at revision d04e592bb4f6aa9cfee91e2e20afa771667e1d4b, safetensors.parameters (T01-3)',
    url: 'https://huggingface.co/api/models/meta-llama/Llama-3.1-8B',
    tier: 1,
  },
  hf70b: {
    label: 'Hugging Face API, meta-llama/Llama-3.1-70B at revision 349b2ddb53ce8f2849a6c168a81980ab25258dac, safetensors.parameters (T01-3)',
    url: 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B',
    tier: 1,
  },
  hf405b: {
    label: 'Hugging Face API, meta-llama/Llama-3.1-405B at revision b906e4dc842aa489c962f9db26554dcfdde901fe, safetensors.parameters (T01-3)',
    url: 'https://huggingface.co/api/models/meta-llama/Llama-3.1-405B',
    tier: 1,
  },
  deepseekShapes: {
    label: 'DeepSeek-V3 Technical Report (2412.19437v2), Sec 4.2 Hyper-Parameters (T02-71)',
    url: 'https://arxiv.org/abs/2412.19437v2',
    tier: 3,
  },
  deepseekParams: {
    label: 'DeepSeek-V3 Technical Report (2412.19437v2): 671B total, 37B activated per token (T01-26)',
    url: 'https://arxiv.org/abs/2412.19437v2',
    tier: 3,
  },
  deepseekDispatch: {
    label: 'DeepSeek-V3 Technical Report (2412.19437v2), Sec 3.2.2 and 3.3.4: FP8 dispatch, BF16 combine (T02-39)',
    url: 'https://arxiv.org/abs/2412.19437v2',
    tier: 3,
  },
  ec2Specs: {
    label: 'Amazon EC2 instance types guide, accelerated computing (T05-1 to T05-6, T05-9)',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
  },
  h100: {
    label: 'NVIDIA H100 product page: BF16 1,979 and FP8 3,958 TFLOPS with sparsity, 80 GB (T01-27); dense is half',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    tier: 1,
    basis: 'vendor-specification',
  },
  h200: {
    label: 'NVIDIA H200 product page: H100 compute, 141 GB (T01-28)',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 1,
    basis: 'vendor-specification',
  },
  a100: {
    label: 'NVIDIA A100 product page: BF16 312 TFLOPS dense (T05-13)',
    url: 'https://www.nvidia.com/en-us/data-center/a100/',
    tier: 1,
    basis: 'vendor-specification',
  },
  hgx: {
    label: 'NVIDIA HGX page: B200 and B300 BF16 36 PFLOPS sparse per 8 GPUs, "Dense is half" (T01-29, T05-15)',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 1,
    basis: 'vendor-specification',
  },
  gb200: {
    label: 'NVIDIA GB200 NVL72 page: BF16 360 PFLOPS sparse per 72 GPUs (T05-16)',
    url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/',
    tier: 1,
    basis: 'vendor-specification',
  },
  nvlink: {
    label: 'NVIDIA NVLink page: per-GPU figure is bidirectional, so half per direction [our reading] (T02-70)',
    url: 'https://www.nvidia.com/en-us/data-center/nvlink/',
    tier: 1,
    basis: 'derived',
  },
  trainium: {
    label: 'AWS Neuron docs (Neuron 2.33.0), Trainium: 190 BF16 TFLOPS, 32 GiB (T05-19)',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html',
    tier: 1,
    basis: 'vendor-specification',
  },
  trainium2: {
    label: 'AWS Neuron docs (Neuron 2.33.0), Trainium2: 667 BF16 and 1,299 FP8 TFLOPS dense, 96 GiB, NeuronLink-v3 1.28 TB/s per chip (T01-30, T05-17)',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    basis: 'vendor-specification',
  },
  trainium3: {
    label: 'AWS Neuron docs (Neuron 2.33.0), Trainium3: 671 BF16 and 2,517 MXFP8 TFLOPS dense, 144 GiB (T05-18)',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    basis: 'vendor-specification',
  },
  trn2Arch: {
    label: 'AWS Neuron docs (Neuron 2.33.0), Trn2 architecture: 16 chips, 16 x 200 Gigabit EFA (T05-10)',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html',
    tier: 1,
  },
  trn3Arch: {
    label: 'AWS Neuron docs (Neuron 2.33.0), Trn3 architecture: Gen2 UltraServer, 144 chips, 28,800 Gbps EFA (T05-12)',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html',
    tier: 1,
  },
  torchtitanNeuron: {
    label: 'aws-neuron-sdk v2.33.0, training/torchtitan/about-torchtitan-neuron.rst: 64 ranks per trn2.48xlarge at LNC=2 (T03-38)',
    url: `https://github.com/aws-neuron/aws-neuron-sdk/blob/${NEURON_SDK_SHA}/training/torchtitan/about-torchtitan-neuron.rst`,
    tier: 1,
  },
  trn2RankHbm: {
    label: '03 W3: 96 GiB per Trainium2 / 4 logical cores = 24 GiB per rank (T05-10, T03-38)',
    url: researchUrl('03-frameworks.md'),
    tier: 1,
    basis: 'derived',
  },
  e1: {
    label: 'E1, activation memory per Llama 3.1 8B layer on one GB10 (PyTorch 2.15.0)',
    url: researchUrl('E1-spark-activation-memory.md'),
    tier: 0,
  },
  e3: {
    label: 'E3, FSDP2 collectives per optimizer step under gradient accumulation (PyTorch 2.15.0)',
    url: researchUrl('E3-spark-fsdp2-collectives.md'),
    tier: 0,
  },
  headroom: {
    label: 'Headroom target 75% of HBM: our reading; no source states a headroom figure (wave2-step-maths W1-24)',
    url: researchUrl('wave2-step-maths.md'),
    tier: 0,
    basis: 'assumption',
  },
  zero: {
    label: 'ZeRO (1910.02054v3), Sec 3.1: 2 + 2 + 12 bytes per parameter (T01-9)',
    url: 'https://arxiv.org/abs/1910.02054v3',
    tier: 3,
  },
  megatronDistOpt: {
    label: 'Megatron-LM core_v0.20.0, docs/user-guide/features/dist_optimizer.md: bf16 parameters, fp32 gradients 18 bytes, 6 + 12/d (T03-17)',
    url: `https://github.com/NVIDIA/Megatron-LM/blob/${MEGATRON_SHA}/docs/user-guide/features/dist_optimizer.md`,
    tier: 1,
  },
  deepseekOptimizer: {
    label: 'DeepSeek-V3 (2412.19437v2), Sec 3.3: BF16 AdamW moments, FP32 master and gradients (T01-47); total per wave2-step-maths W1-50',
    url: 'https://arxiv.org/abs/2412.19437v2',
    tier: 3,
    basis: 'derived',
  },
  adam8bit: {
    label: '8-bit Optimizers via Block-wise Quantization (2110.02861v2): Adam states 2 bytes (T01-59)',
    url: 'https://arxiv.org/abs/2110.02861v2',
    tier: 3,
    basis: 'derived',
  },
  muon: {
    label: 'Muon is Scalable for LLM Training (2502.16982v1): one momentum buffer (T01-61)',
    url: 'https://arxiv.org/abs/2502.16982v1',
    tier: 3,
    basis: 'derived',
  },
  adafactor: {
    label: 'Adafactor (1804.04235v1): factored second moment, no momentum (T01-60, W1-57)',
    url: 'https://arxiv.org/abs/1804.04235v1',
    tier: 3,
    basis: 'derived',
  },
  fineTuning: {
    label: '03 W4: LoRA about 2 bytes per frozen BF16 parameter, 4-bit QLoRA about 0.5 (T03-43 to T03-45)',
    url: researchUrl('03-frameworks.md'),
    tier: 1,
    basis: 'derived',
  },
  metaReliability: {
    label: 'Revisiting Reliability in Large-Scale ML Research Clusters (2410.21680v2), Sec III (T04-7, T04-8)',
    url: 'https://arxiv.org/abs/2410.21680v2',
    tier: 3,
  },
  fsxSsd: {
    label: 'FSx for Lustre user guide, SSD storage: disk throughput per TiB by tier (T04-29)',
    url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html',
    tier: 1,
  },
  fsxSizes: {
    label: 'FSx API reference, CreateFileSystem: 1200 GiB, 2400 GiB, and increments of 2400 GiB (wave2-reliability W4-21, G6)',
    url: 'https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystem.html',
    tier: 1,
  },
  fsxPrice: {
    label: 'AWS Price List, AmazonFSx us-east-1 offer 20260911124432: persistent SSD Lustre per GB-month (T00-1)',
    url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json',
    tier: 1,
  },
  s3Rate: {
    label: 'Amazon S3 user guide, optimizing performance: at least 3,500 PUT per second per partitioned prefix (T04-27)',
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html',
    tier: 1,
  },
  s3Connector: {
    label: 's3torchconnector v1.5.0, s3client_config.py: part_size 8 MiB by default (wave2-reliability W4-22)',
    url: `https://github.com/awslabs/s3-connector-for-pytorch/blob/${S3_CONNECTOR_SHA}/s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py`,
    tier: 1,
  },
  ec2PriceUse1: {
    label: 'AWS Price List, AmazonEC2 offer 20261029175634, us-east-1, Linux On-Demand (T05-20)',
    url: `${EC2_OFFER}/us-east-1/index.csv`,
    tier: 1,
  },
  ec2PriceUse2: {
    label: 'AWS Price List, AmazonEC2 offer 20261029175634, us-east-2 (T05-21)',
    url: `${EC2_OFFER}/us-east-2/index.csv`,
    tier: 1,
  },
  ec2PriceAllRegions: {
    label: 'AWS Price List, AmazonEC2 offer 20261029175634, all Regions: trn2.48xlarge On-Demand only in ap-south-2 (wave2-aws W5-7, U05-3)',
    url: `${EC2_OFFER}/index.csv`,
    tier: 1,
  },
  capacityBlocks: {
    label: 'EC2 Capacity Blocks pricing page, read 2026-10-30 (T05-22; wave2-aws W5-8, W5-19)',
    url: 'https://aws.amazon.com/ec2/capacityblocks/pricing/',
    tier: 1,
  },
  sagemakerUse1: {
    label: 'AWS Price List, AmazonSageMaker offer 20261029165009, us-east-1: Train, Cluster, TrainingPlanUpfrontFee (T05-23, T05-24)',
    url: `${SAGEMAKER_OFFER}/us-east-1/index.csv`,
    tier: 1,
  },
  sagemakerUse2: {
    label: 'AWS Price List, AmazonSageMaker offer 20261029165009, us-east-2 (T05-24)',
    url: `${SAGEMAKER_OFFER}/us-east-2/index.csv`,
    tier: 1,
  },
  instanceTable: {
    label: 'Register 05 section 3.1 calculator table (rates from T05-20 to T05-24)',
    url: researchUrl('05-aws-infrastructure.md'),
    tier: 1,
  },
  pcsPrice: {
    label: 'AWS Price List, AWSPCS offer 20261027150327, us-east-1 (T06-36; wave2-aws W5-2)',
    url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json',
    tier: 1,
  },
  pcsSizes: {
    label: 'AWS PCS user guide, cluster size: Small up to 32, Medium 512, Large 2,048 instances (T06-35)',
    url: 'https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html',
    tier: 1,
  },
  eksPrice: {
    label: 'AWS Price List, AmazonEKS offer 20261027191639, us-east-1: cluster-hour and Auto Mode management (T06-40, T06-41; wave2-aws W5-4)',
    url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json',
    tier: 1,
  },
  managedSpot: {
    label: 'SageMaker managed Spot training: billed in on-demand-equivalent seconds; no separate Spot rate in the offer (wave2-aws U05-4)',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html',
    tier: 1,
  },
  ncclTestsSample: {
    label:
      'AWS nccl-tests sample, 2 x p5.48xlarge all_reduce: 17,179,869,184 B in 66,132 us, busbw 487.09 GB/s (revamp/claims/collectives.md; Tier 2 vendor sample)',
    url: 'https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L206-L243',
    tier: 2,
  },
} as const satisfies Record<string, Source>;

function s(value: number, source: Source): Sourced {
  return { value, source };
}

// ---------------------------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------------------------

/** A dense decoder shape the calculators read; custom shapes use the same fields. */
export interface ModelShape {
  name: string;
  layers: number;
  hidden: number;
  ffn: number;
  heads: number;
  kvHeads: number;
  headDim: number;
  vocab: number;
  /** Every parameter, embedding and norms included (memory always uses this count). */
  totalParameters: number;
  /** The layers' linear weights plus the output head (01 W1): the N that belongs in 6N. */
  matmulParameters: number;
  /** The input embedding table, V x h (01 W1). */
  embeddingParameters: number;
}

export interface DenseModelPreset {
  id: DenseModelId;
  name: string;
  layers: Sourced;
  hidden: Sourced;
  ffn: Sourced;
  heads: Sourced;
  kvHeads: Sourced;
  headDim: Sourced;
  vocab: Sourced;
  totalParameters: Sourced;
  matmulParameters: Sourced;
}

export type DenseModelId = 'llama-3.1-8b' | 'llama-3.1-70b' | 'llama-3.1-405b';

const HEAD_DIM: Source = { ...SOURCES.llama3Table3, label: 'Head dimension 128 = h / heads, derived from Table 3 (T01-1)', basis: 'derived' };

function llamaPreset(
  id: DenseModelId,
  name: string,
  shape: { layers: number; hidden: number; ffn: number; heads: number },
  totalParameters: Sourced,
  matmulParameters: number,
): DenseModelPreset {
  return {
    id,
    name,
    layers: s(shape.layers, SOURCES.llama3Table3),
    hidden: s(shape.hidden, SOURCES.llama3Table3),
    ffn: s(shape.ffn, SOURCES.llama3Table3),
    heads: s(shape.heads, SOURCES.llama3Table3),
    kvHeads: s(8, SOURCES.llama3Table3),
    headDim: s(128, HEAD_DIM),
    vocab: s(128_256, SOURCES.llamaTokenizer),
    totalParameters,
    matmulParameters: s(matmulParameters, SOURCES.llamaModelCode),
  };
}

export const DENSE_MODELS: Readonly<Record<DenseModelId, DenseModelPreset>> = {
  'llama-3.1-8b': llamaPreset(
    'llama-3.1-8b',
    'Llama 3.1 8B',
    { layers: 32, hidden: 4_096, ffn: 14_336, heads: 32 },
    s(8_030_261_248, SOURCES.hf8b),
    7_504_658_432,
  ),
  'llama-3.1-70b': llamaPreset(
    'llama-3.1-70b',
    'Llama 3.1 70B',
    { layers: 80, hidden: 8_192, ffn: 28_672, heads: 64 },
    s(70_553_706_496, SOURCES.hf70b),
    69_501_714_432,
  ),
  'llama-3.1-405b': llamaPreset(
    'llama-3.1-405b',
    'Llama 3.1 405B',
    { layers: 126, hidden: 16_384, ffn: 53_248, heads: 128 },
    s(405_853_388_800, SOURCES.hf405b),
    403_747_897_344,
  ),
};

/** Strips the sources from a preset into the plain shape the calculators read. */
export function shapeOf(preset: DenseModelPreset): ModelShape {
  return {
    name: preset.name,
    layers: preset.layers.value,
    hidden: preset.hidden.value,
    ffn: preset.ffn.value,
    heads: preset.heads.value,
    kvHeads: preset.kvHeads.value,
    headDim: preset.headDim.value,
    vocab: preset.vocab.value,
    totalParameters: preset.totalParameters.value,
    matmulParameters: preset.matmulParameters.value,
    embeddingParameters: preset.vocab.value * preset.hidden.value,
  };
}

/**
 * Builds a custom Llama-shaped model (GQA, three-matrix SwiGLU, untied head, RMSNorm) and counts
 * its parameters with 01 W1's per-layer formulas: attention = h x qDim (Q) + 2 x h x kvDim (K, V)
 * + qDim x h (O); MLP = 3hF; norms 2h per layer plus a final h; embedding and head V x h each.
 */
export function customLlamaShape(shape: {
  name: string;
  layers: number;
  hidden: number;
  ffn: number;
  heads: number;
  kvHeads: number;
  headDim: number;
  vocab: number;
}): ModelShape {
  requirePositiveInteger('layers', shape.layers);
  requirePositiveInteger('hidden', shape.hidden);
  requirePositiveInteger('ffn', shape.ffn);
  requirePositiveInteger('heads', shape.heads);
  requirePositiveInteger('kvHeads', shape.kvHeads);
  requirePositiveInteger('headDim', shape.headDim);
  requirePositiveInteger('vocab', shape.vocab);
  if (shape.heads % shape.kvHeads !== 0) {
    throw new RangeError(`heads (${shape.heads}) must be a multiple of kvHeads (${shape.kvHeads})`);
  }
  const h = shape.hidden;
  const qDim = shape.heads * shape.headDim;
  const kvDim = shape.kvHeads * shape.headDim;
  const attention = 2 * h * qDim + 2 * h * kvDim; // 01 W1: Q and O, then K and V
  const mlp = 3 * h * shape.ffn; // 01 W1, T01-4: w1, w2, w3
  const norms = 2 * h; // 01 W1: two RMSNorm weights per layer
  const embedding = shape.vocab * h;
  const totalParameters = shape.layers * (attention + mlp + norms) + h + 2 * embedding; // + final norm, embedding, untied head
  const matmulParameters = shape.layers * (attention + mlp) + embedding; // 01 W1: layers' linear weights plus the head
  return { ...shape, totalParameters, matmulParameters, embeddingParameters: embedding };
}

/** A mixture-of-experts shape for Calculator C's MoE mode. */
export interface MoeModelShape {
  name: string;
  layers: number;
  denseLayers: number;
  hidden: number;
  heads: number;
  headDim: number;
  routedExperts: number;
  sharedExperts: number;
  expertFfn: number;
  topK: number;
  /** Node-limited routing: each token reaches at most this many nodes (DeepSeek-V3's M). */
  maxNodesPerToken: number;
  totalParameters: number;
  activatedParameters: number;
}

export interface MoeModelPreset {
  id: 'deepseek-v3';
  name: string;
  layers: Sourced;
  denseLayers: Sourced;
  hidden: Sourced;
  heads: Sourced;
  headDim: Sourced;
  routedExperts: Sourced;
  sharedExperts: Sourced;
  expertFfn: Sourced;
  topK: Sourced;
  maxNodesPerToken: Sourced;
  totalParameters: Sourced;
  activatedParameters: Sourced;
}

export const DEEPSEEK_V3: MoeModelPreset = {
  id: 'deepseek-v3',
  name: 'DeepSeek-V3',
  layers: s(61, SOURCES.deepseekShapes),
  denseLayers: s(3, SOURCES.deepseekShapes),
  hidden: s(7_168, SOURCES.deepseekShapes),
  heads: s(128, SOURCES.deepseekShapes),
  headDim: s(128, SOURCES.deepseekShapes),
  routedExperts: s(256, SOURCES.deepseekShapes),
  sharedExperts: s(1, SOURCES.deepseekShapes),
  expertFfn: s(2_048, SOURCES.deepseekShapes),
  topK: s(8, SOURCES.deepseekShapes),
  maxNodesPerToken: s(4, SOURCES.deepseekShapes),
  totalParameters: s(671e9, SOURCES.deepseekParams),
  activatedParameters: s(37e9, SOURCES.deepseekParams),
};

export function moeShapeOf(preset: MoeModelPreset): MoeModelShape {
  return {
    name: preset.name,
    layers: preset.layers.value,
    denseLayers: preset.denseLayers.value,
    hidden: preset.hidden.value,
    heads: preset.heads.value,
    headDim: preset.headDim.value,
    routedExperts: preset.routedExperts.value,
    sharedExperts: preset.sharedExperts.value,
    expertFfn: preset.expertFfn.value,
    topK: preset.topK.value,
    maxNodesPerToken: preset.maxNodesPerToken.value,
    totalParameters: preset.totalParameters.value,
    activatedParameters: preset.activatedParameters.value,
  };
}

// ---------------------------------------------------------------------------------------------
// Accelerators and instances (register 05 section 3.1, wave2-aws)
// ---------------------------------------------------------------------------------------------

export type InstanceId =
  | 'p4d.24xlarge'
  | 'p4de.24xlarge'
  | 'p5.48xlarge'
  | 'p5e.48xlarge'
  | 'p5en.48xlarge'
  | 'p6-b200.48xlarge'
  | 'p6-b300.48xlarge'
  | 'p6e-gb200.36xlarge'
  | 'trn1.32xlarge'
  | 'trn1n.32xlarge'
  | 'trn2.48xlarge'
  | 'trn3-gen2-ultraserver';

export interface ScaleUpLink extends Sourced {
  /** GB/s per accelerator. "one direction" when the source (or our reading of it) gives a per-direction figure. */
  direction: 'one direction' | 'not stated';
}

export interface InstancePreset {
  id: InstanceId;
  accelerator: string;
  acceleratorsPerInstance: Sourced;
  /** Training ranks per instance. Omitted where no register row states it. */
  ranksPerInstance?: Sourced;
  /** Every HBM figure the sources print for one accelerator, in the source's own unit. */
  hbmPerAccelerator: readonly MemoryFigure[];
  /** HBM per rank when a rank is a fraction of an accelerator (Trainium2 at LNC=2). */
  hbmPerRank?: readonly MemoryFigure[];
  /** Dense (no 2:4 sparsity) BF16 peak per accelerator, TFLOPS. */
  denseBf16TflopsPerAccelerator: Sourced;
  /** Dense FP8 peak per accelerator, TFLOPS (MXFP8 for Trainium3). */
  denseFp8TflopsPerAccelerator?: Sourced;
  /** Scale-up (NVLink or NeuronLink) bandwidth per accelerator, GB/s. */
  scaleUpPerAccelerator?: ScaleUpLink;
  /** EFA bandwidth per instance, Gbps. */
  efaGbpsPerInstance: Sourced;
}

const AWS_8: Sourced = s(8, SOURCES.ec2Specs);
const AWS_16: Sourced = s(16, SOURCES.ec2Specs);
const H100_BF16 = s(989.5, SOURCES.h100);
const H100_FP8 = s(1_979, SOURCES.h100);
const NVLINK_HOPPER: ScaleUpLink = { value: 450, source: SOURCES.nvlink, direction: 'one direction' };
const NVLINK_BLACKWELL: ScaleUpLink = {
  value: 900,
  source: { ...SOURCES.nvlink, label: 'NVLink 5, 1.8 TB/s per GPU (T05-4), halved per direction as T02-70 reads the NVLink page [our reading]' },
  direction: 'one direction',
};
const B200_BF16 = s(2_250, SOURCES.hgx);
const B200_FP8 = s(4_500, SOURCES.hgx);

function gib(value: number, source: Source = SOURCES.ec2Specs): MemoryFigure {
  return { value, unit: 'GiB', source };
}
function gb(value: number, source: Source): MemoryFigure {
  return { value, unit: 'GB', source };
}

export const INSTANCES: Readonly<Record<InstanceId, InstancePreset>> = {
  'p4d.24xlarge': {
    id: 'p4d.24xlarge',
    accelerator: 'NVIDIA A100 40 GB',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(40)],
    denseBf16TflopsPerAccelerator: s(312, SOURCES.a100),
    scaleUpPerAccelerator: {
      value: 300,
      source: { ...SOURCES.nvlink, label: 'NVSwitch 600 GB/s (T05-1), halved per direction as T02-70 reads NVIDIA [our reading]' },
      direction: 'one direction',
    },
    efaGbpsPerInstance: s(400, SOURCES.ec2Specs),
  },
  'p4de.24xlarge': {
    id: 'p4de.24xlarge',
    accelerator: 'NVIDIA A100 80 GB',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(80)],
    denseBf16TflopsPerAccelerator: s(312, SOURCES.a100),
    scaleUpPerAccelerator: {
      value: 300,
      source: { ...SOURCES.nvlink, label: 'NVSwitch 600 GB/s (T05-1), halved per direction as T02-70 reads NVIDIA [our reading]' },
      direction: 'one direction',
    },
    efaGbpsPerInstance: s(400, SOURCES.ec2Specs),
  },
  'p5.48xlarge': {
    id: 'p5.48xlarge',
    accelerator: 'NVIDIA H100',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(80), gb(80, SOURCES.h100)],
    denseBf16TflopsPerAccelerator: H100_BF16,
    denseFp8TflopsPerAccelerator: H100_FP8,
    scaleUpPerAccelerator: NVLINK_HOPPER,
    efaGbpsPerInstance: s(3_200, SOURCES.ec2Specs),
  },
  'p5e.48xlarge': {
    id: 'p5e.48xlarge',
    accelerator: 'NVIDIA H200',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(141), gb(141, SOURCES.h200)],
    denseBf16TflopsPerAccelerator: s(989.5, SOURCES.h200),
    denseFp8TflopsPerAccelerator: s(1_979, SOURCES.h200),
    scaleUpPerAccelerator: NVLINK_HOPPER,
    efaGbpsPerInstance: s(3_200, SOURCES.ec2Specs),
  },
  'p5en.48xlarge': {
    id: 'p5en.48xlarge',
    accelerator: 'NVIDIA H200',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(141), gb(141, SOURCES.h200)],
    denseBf16TflopsPerAccelerator: s(989.5, SOURCES.h200),
    denseFp8TflopsPerAccelerator: s(1_979, SOURCES.h200),
    scaleUpPerAccelerator: NVLINK_HOPPER,
    efaGbpsPerInstance: s(3_200, SOURCES.ec2Specs),
  },
  'p6-b200.48xlarge': {
    id: 'p6-b200.48xlarge',
    accelerator: 'NVIDIA B200',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(179)],
    denseBf16TflopsPerAccelerator: B200_BF16,
    denseFp8TflopsPerAccelerator: B200_FP8,
    scaleUpPerAccelerator: NVLINK_BLACKWELL,
    efaGbpsPerInstance: s(3_200, SOURCES.ec2Specs),
  },
  'p6-b300.48xlarge': {
    id: 'p6-b300.48xlarge',
    accelerator: 'NVIDIA B300',
    acceleratorsPerInstance: AWS_8,
    ranksPerInstance: AWS_8,
    hbmPerAccelerator: [gib(268)],
    denseBf16TflopsPerAccelerator: B200_BF16,
    denseFp8TflopsPerAccelerator: B200_FP8,
    scaleUpPerAccelerator: {
      ...NVLINK_BLACKWELL,
      source: { ...SOURCES.hgx, label: 'HGX B300 NVLink 1.8 TB/s per GPU (T05-15), halved per direction as T02-70 reads NVIDIA [our reading]', basis: 'derived' },
    },
    efaGbpsPerInstance: s(6_400, SOURCES.ec2Specs),
  },
  'p6e-gb200.36xlarge': {
    id: 'p6e-gb200.36xlarge',
    accelerator: 'NVIDIA B200 (GB200), sold inside 36- or 72-GPU UltraServers',
    acceleratorsPerInstance: s(4, SOURCES.ec2Specs),
    hbmPerAccelerator: [gib(185)],
    denseBf16TflopsPerAccelerator: s(2_500, SOURCES.gb200),
    denseFp8TflopsPerAccelerator: s(5_000, SOURCES.gb200),
    efaGbpsPerInstance: s(3_200, SOURCES.ec2Specs),
  },
  'trn1.32xlarge': {
    id: 'trn1.32xlarge',
    accelerator: 'AWS Trainium',
    acceleratorsPerInstance: AWS_16,
    hbmPerAccelerator: [gib(32, SOURCES.trainium)],
    denseBf16TflopsPerAccelerator: s(190, SOURCES.trainium),
    denseFp8TflopsPerAccelerator: s(190, SOURCES.trainium),
    efaGbpsPerInstance: s(800, SOURCES.ec2Specs),
  },
  'trn1n.32xlarge': {
    id: 'trn1n.32xlarge',
    accelerator: 'AWS Trainium',
    acceleratorsPerInstance: AWS_16,
    hbmPerAccelerator: [gib(32, SOURCES.trainium)],
    denseBf16TflopsPerAccelerator: s(190, SOURCES.trainium),
    denseFp8TflopsPerAccelerator: s(190, SOURCES.trainium),
    efaGbpsPerInstance: s(1_600, SOURCES.ec2Specs),
  },
  'trn2.48xlarge': {
    id: 'trn2.48xlarge',
    accelerator: 'AWS Trainium2',
    acceleratorsPerInstance: s(16, SOURCES.trn2Arch),
    ranksPerInstance: s(64, SOURCES.torchtitanNeuron),
    hbmPerAccelerator: [gib(96, SOURCES.trainium2)],
    hbmPerRank: [gib(24, SOURCES.trn2RankHbm)],
    denseBf16TflopsPerAccelerator: s(667, SOURCES.trainium2),
    denseFp8TflopsPerAccelerator: s(1_299, SOURCES.trainium2),
    scaleUpPerAccelerator: { value: 1_280, source: SOURCES.trainium2, direction: 'not stated' },
    efaGbpsPerInstance: s(3_200, SOURCES.trn2Arch),
  },
  'trn3-gen2-ultraserver': {
    id: 'trn3-gen2-ultraserver',
    accelerator: 'AWS Trainium3 (Gen2 UltraServer; no instance type name published)',
    acceleratorsPerInstance: s(144, SOURCES.trn3Arch),
    hbmPerAccelerator: [gib(144, SOURCES.trainium3)],
    denseBf16TflopsPerAccelerator: s(671, SOURCES.trainium3),
    denseFp8TflopsPerAccelerator: s(2_517, SOURCES.trainium3),
    efaGbpsPerInstance: s(28_800, SOURCES.trn3Arch),
  },
};

/** Per-rank figures Calculators B and C need, derived from an instance preset. */
export interface RankFacts {
  ranksPerInstance: number;
  ranksPerAccelerator: number;
  /** HBM figures per rank in the sources' own units. */
  hbmPerRank: readonly MemoryFigure[];
  /** The smallest of those figures in bytes (the conservative capacity, C02-7). */
  hbmPerRankBytes: number;
  denseBf16TflopsPerRank: number;
  /** Scale-up bandwidth per rank, bytes per second. */
  scaleUpBytesPerSecondPerRank: number;
  /** EFA bandwidth per rank, bytes per second: Gbps / 8 / ranks (T02-68: 3,200 / 8 / 8 = 50 GB/s on p5). */
  efaBytesPerSecondPerRank: number;
  /** EFA bandwidth per instance, bytes per second: Gbps / 8 (400 GB/s on p5); collectives that cross instances share it. */
  efaBytesPerSecondPerInstance: number;
}

export function rankFacts(instance: InstancePreset): RankFacts {
  if (!instance.ranksPerInstance) {
    throw new RangeError(`instance: no register row states the ranks per instance for ${instance.id}`);
  }
  if (!instance.scaleUpPerAccelerator) {
    throw new RangeError(`instance: no register row states a per-accelerator scale-up bandwidth for ${instance.id}`);
  }
  const ranksPerInstance = instance.ranksPerInstance.value;
  const ranksPerAccelerator = ranksPerInstance / instance.acceleratorsPerInstance.value;
  // Per-rank HBM: a stated per-rank figure if the preset has one (trn2), else the accelerator's.
  const hbmPerRank =
    instance.hbmPerRank ??
    instance.hbmPerAccelerator.map((f) => ({ ...f, value: f.value / ranksPerAccelerator }));
  return {
    ranksPerInstance,
    ranksPerAccelerator,
    hbmPerRank,
    hbmPerRankBytes: Math.min(...hbmPerRank.map(memoryFigureBytes)),
    denseBf16TflopsPerRank: instance.denseBf16TflopsPerAccelerator.value / ranksPerAccelerator,
    scaleUpBytesPerSecondPerRank: (instance.scaleUpPerAccelerator.value * GB) / ranksPerAccelerator,
    efaBytesPerSecondPerRank: (instance.efaGbpsPerInstance.value * 1e9) / 8 / ranksPerInstance,
    efaBytesPerSecondPerInstance: (instance.efaGbpsPerInstance.value * 1e9) / 8,
  };
}

// ---------------------------------------------------------------------------------------------
// Prices (register 05 section 3.2 inputs T05-20 to T05-24, wave2-aws), per unit-hour
// ---------------------------------------------------------------------------------------------

export type PricePath = 'ec2OnDemand' | 'capacityBlock' | 'sagemakerTraining' | 'hyperpod' | 'trainingPlan';

export interface PriceRow {
  instance: InstanceId;
  path: PricePath;
  /** What one billed unit-hour buys: an instance, or a whole UltraServer. */
  unit: string;
  acceleratorsPerUnit: Sourced;
  usdPerUnitHour: Sourced;
  region: string;
  date: string;
}

const NVA = 'US East (N. Virginia)';
const OHIO = 'US East (Ohio)';

function price(
  instance: InstanceId,
  path: PricePath,
  usd: number,
  source: Source,
  region: string = NVA,
  unit: string = instance,
  acceleratorsPerUnit: Sourced = INSTANCES[instance].acceleratorsPerInstance,
): PriceRow {
  return { instance, path, unit, acceleratorsPerUnit, usdPerUnitHour: s(usd, source), region, date: PRICES_READ_ON };
}

export const PRICES: readonly PriceRow[] = [
  // EC2 On-Demand, Linux (T05-20, T05-21; wave2-aws W5-6, W5-7)
  price('p4d.24xlarge', 'ec2OnDemand', 21.957642, SOURCES.ec2PriceUse1),
  price('p4de.24xlarge', 'ec2OnDemand', 27.44705, SOURCES.ec2PriceUse1),
  price('p5.48xlarge', 'ec2OnDemand', 55.04, SOURCES.ec2PriceUse1),
  price('p5e.48xlarge', 'ec2OnDemand', 63.296, SOURCES.ec2PriceUse2, OHIO),
  price('p5en.48xlarge', 'ec2OnDemand', 63.296, SOURCES.ec2PriceUse1),
  price('p6-b200.48xlarge', 'ec2OnDemand', 113.9328, SOURCES.ec2PriceUse1),
  price('p6-b300.48xlarge', 'ec2OnDemand', 142.416, SOURCES.ec2PriceUse1),
  price('trn1.32xlarge', 'ec2OnDemand', 21.5, SOURCES.ec2PriceUse1),
  price('trn1n.32xlarge', 'ec2OnDemand', 24.78, SOURCES.ec2PriceUse1),
  price('trn2.48xlarge', 'ec2OnDemand', 103.157, SOURCES.ec2PriceAllRegions, 'Asia Pacific (Hyderabad)'),
  // Capacity Blocks (T05-22; wave2-aws W5-8, W5-19)
  price('p4d.24xlarge', 'capacityBlock', 13.57, SOURCES.capacityBlocks),
  price('p4de.24xlarge', 'capacityBlock', 20.369, SOURCES.capacityBlocks),
  price('p5.48xlarge', 'capacityBlock', 47.757, SOURCES.capacityBlocks),
  price('p5e.48xlarge', 'capacityBlock', 54.924, SOURCES.capacityBlocks, OHIO),
  price('p5en.48xlarge', 'capacityBlock', 63.158, SOURCES.capacityBlocks),
  price('p6-b200.48xlarge', 'capacityBlock', 113.666, SOURCES.capacityBlocks),
  price('p6-b300.48xlarge', 'capacityBlock', 129.168, SOURCES.capacityBlocks),
  price('trn1.32xlarge', 'capacityBlock', 9.532, SOURCES.capacityBlocks),
  price('trn2.48xlarge', 'capacityBlock', 35.7608, SOURCES.capacityBlocks, OHIO),
  price(
    'p6e-gb200.36xlarge',
    'capacityBlock',
    761.904,
    SOURCES.capacityBlocks,
    'US East (Dallas) Local Zone',
    'u-p6e-gb200x72 UltraServer',
    s(72, SOURCES.capacityBlocks),
  ),
  price(
    'p6e-gb200.36xlarge',
    'capacityBlock',
    380.952,
    SOURCES.capacityBlocks,
    'US East (Dallas) Local Zone',
    'u-p6e-gb200x36 UltraServer',
    s(36, SOURCES.capacityBlocks),
  ),
  // SageMaker training jobs, ml.* (T05-23, T05-24; wave2-aws W5-1)
  price('p4d.24xlarge', 'sagemakerTraining', 25.2512883, SOURCES.sagemakerUse1),
  price('p4de.24xlarge', 'sagemakerTraining', 31.5641075, SOURCES.instanceTable),
  price('p5.48xlarge', 'sagemakerTraining', 63.296, SOURCES.sagemakerUse1),
  price('p5en.48xlarge', 'sagemakerTraining', 72.795, SOURCES.sagemakerUse1),
  price('p6-b200.48xlarge', 'sagemakerTraining', 131.02272, SOURCES.sagemakerUse1),
  price('p6-b300.48xlarge', 'sagemakerTraining', 163.7784, SOURCES.sagemakerUse1),
  price('trn1.32xlarge', 'sagemakerTraining', 24.73, SOURCES.sagemakerUse1),
  price('trn1n.32xlarge', 'sagemakerTraining', 28.5, SOURCES.sagemakerUse1),
  price('trn2.48xlarge', 'sagemakerTraining', 97.52, SOURCES.sagemakerUse2, OHIO),
  // SageMaker HyperPod cluster nodes (T05-23, T05-24)
  price('p4d.24xlarge', 'hyperpod', 25.91001756, SOURCES.sagemakerUse1),
  price('p4de.24xlarge', 'hyperpod', 32.38752195, SOURCES.instanceTable),
  price('p5.48xlarge', 'hyperpod', 66.048, SOURCES.sagemakerUse1),
  price('p5en.48xlarge', 'hyperpod', 75.9552, SOURCES.sagemakerUse1),
  price('p6-b200.48xlarge', 'hyperpod', 136.719, SOURCES.sagemakerUse1),
  price('p6-b300.48xlarge', 'hyperpod', 170.8992, SOURCES.sagemakerUse1),
  price('trn1.32xlarge', 'hyperpod', 24.73, SOURCES.sagemakerUse1),
  price('trn1n.32xlarge', 'hyperpod', 28.5, SOURCES.instanceTable),
  price('trn2.48xlarge', 'hyperpod', 101.76, SOURCES.sagemakerUse2, OHIO),
  // SageMaker training plans, up-front hourly fee (T05-24; wave2-aws W5-10)
  price('p5.48xlarge', 'trainingPlan', 54.92078, SOURCES.sagemakerUse1),
  price('p5e.48xlarge', 'trainingPlan', 63.1626, SOURCES.sagemakerUse2, OHIO),
  price('p5en.48xlarge', 'trainingPlan', 72.6317, SOURCES.sagemakerUse1),
  price('p6-b200.48xlarge', 'trainingPlan', 130.7159, SOURCES.sagemakerUse1),
  price('p6-b300.48xlarge', 'trainingPlan', 148.5432, SOURCES.sagemakerUse1),
  price('trn2.48xlarge', 'trainingPlan', 41.12492, SOURCES.sagemakerUse2, OHIO),
];

export type PcsControllerSize = 'small' | 'medium' | 'large';

/** AWS PCS fees in us-east-1 (T06-35, T06-36; wave2-aws W5-2). */
export const PCS_FEES = {
  controllerUsdPerHour: {
    small: s(0.5825, SOURCES.pcsPrice),
    medium: s(3.2579, SOURCES.pcsPrice),
    large: s(6.5426, SOURCES.pcsPrice),
  },
  maxInstances: {
    small: s(32, SOURCES.pcsSizes),
    medium: s(512, SOURCES.pcsSizes),
    large: s(2_048, SOURCES.pcsSizes),
  },
  /** The "advanced" node management tier, which applies to the P and Trn families. */
  advancedNodeUsdPerInstanceHour: s(0.64, SOURCES.pcsPrice),
} as const;

/** Amazon EKS fees in us-east-1 (T06-40, T06-41; wave2-aws W5-4). */
export const EKS_FEES = {
  clusterUsdPerHour: s(0.1, SOURCES.eksPrice),
  extendedSupportExtraUsdPerHour: s(0.5, SOURCES.eksPrice),
  autoModeUsdPerInstanceHour: {
    'p5.48xlarge': s(2.64192, SOURCES.eksPrice),
    'p5en.48xlarge': s(3.03821, SOURCES.eksPrice),
    'p6-b200.48xlarge': s(5.46877, SOURCES.eksPrice),
    'p6-b300.48xlarge': s(6.83597, SOURCES.eksPrice),
  } as Partial<Record<InstanceId, Sourced>>,
} as const;

// ---------------------------------------------------------------------------------------------
// Optimizer byte rows (01 W2, wave2-step-maths W1-50, register 03 T03-17 and W4)
// ---------------------------------------------------------------------------------------------

export type OptimizerRowId =
  | 'adamMixed'
  | 'adamBf16MomentsFp32Grads'
  | 'adam8bit'
  | 'muon'
  | 'adafactorNoMomentum';

/** Bytes per parameter by component; the master copy is the framework's FP32 copy in every row. */
export interface OptimizerRow {
  id: OptimizerRowId;
  name: string;
  weightBytes: number;
  gradientBytes: number;
  masterBytes: number;
  stateBytes: number;
  source: Source;
}

export const OPTIMIZER_ROWS: Readonly<Record<OptimizerRowId, OptimizerRow>> = {
  adamMixed: {
    id: 'adamMixed',
    name: 'AdamW mixed precision: BF16 weights and gradients, FP32 master and moments (16; 18 with FP32 main gradients)',
    weightBytes: 2,
    gradientBytes: 2,
    masterBytes: 4,
    stateBytes: 8,
    source: SOURCES.zero,
  },
  adamBf16MomentsFp32Grads: {
    id: 'adamBf16MomentsFp32Grads',
    name: 'AdamW with BF16 moments, FP32 master and FP32 gradients, DeepSeek-V3 style (14)',
    weightBytes: 2,
    gradientBytes: 4,
    masterBytes: 4,
    stateBytes: 4,
    source: SOURCES.deepseekOptimizer,
  },
  adam8bit: {
    id: 'adam8bit',
    name: '8-bit Adam with an FP32 master (10)',
    weightBytes: 2,
    gradientBytes: 2,
    masterBytes: 4,
    stateBytes: 2,
    source: SOURCES.adam8bit,
  },
  muon: {
    id: 'muon',
    name: 'Muon on matrix parameters, FP32 master and momentum (12)',
    weightBytes: 2,
    gradientBytes: 2,
    masterBytes: 4,
    stateBytes: 4,
    source: SOURCES.muon,
  },
  adafactorNoMomentum: {
    id: 'adafactorNoMomentum',
    name: 'Adafactor without momentum, factored second moment (about 8)',
    weightBytes: 2,
    gradientBytes: 2,
    masterBytes: 4,
    stateBytes: 0,
    source: SOURCES.adafactor,
  },
};

/** FP32 main gradients: 4 bytes in place of 2 (Megatron's 18-byte row, T03-17). */
export const FP32_GRADIENT_BYTES: Sourced = s(4, SOURCES.megatronDistOpt);

/** Frozen-base fine-tuning rows (03 W4): bytes per frozen parameter. */
export const FROZEN_BASE_BYTES = {
  lora: s(2, SOURCES.fineTuning),
  qlora4bit: s(0.5, SOURCES.fineTuning),
} as const;

// ---------------------------------------------------------------------------------------------
// Tier 0 coefficients and other single figures
// ---------------------------------------------------------------------------------------------

/** E1: saved activation bytes per layer per (s x b x h) for Llama 3.1 8B. */
export const E1_MEASURED_SBH = {
  fusedSwiglu: s(34.03, SOURCES.e1),
  eagerSwiglu: s(41.03, SOURCES.e1),
  fullRecompute: s(2.0, SOURCES.e1),
} as const;

/** E3: FSDP2 collectives per FSDP unit per micro-batch at PyTorch 2.15.0 defaults. */
export const E3_FSDP2_PER_UNIT = {
  allGathersPerMicroBatch: s(2, SOURCES.e3),
  reduceScattersPerMicroBatch: s(1, SOURCES.e3),
} as const;

/** MFU default for Calculators A and C: an assumption inside Llama 3's measured 38% to 43%. */
export const DEFAULT_MFU: Sourced = s(0.4, { ...SOURCES.llama3Table4, basis: 'assumption' });

/** Headroom target as a fraction of HBM (our reading, no source). */
export const DEFAULT_HEADROOM: Sourced = s(0.75, SOURCES.headroom);

/** Failure-rate presets, failures per thousand node-days (T04-7, T04-8). */
export const FAILURE_RATES = {
  rsc2: { name: 'Meta RSC-2', ...s(2.34, SOURCES.metaReliability) },
  rsc1: { name: 'Meta RSC-1', ...s(6.5, SOURCES.metaReliability) },
  rsc1WorstMonth: { name: "RSC-1's worst month", ...s(17.5, SOURCES.metaReliability) },
} as const;

export type FsxTier = 125 | 250 | 500 | 1000;

/** FSx for Lustre PERSISTENT SSD tiers: MBps per TiB (T04-29) and USD per GB-month in us-east-1 (T00-1). */
export const FSX_TIERS: Readonly<Record<FsxTier, { mbpsPerTib: Sourced; usdPerGbMonth: Sourced }>> = {
  125: { mbpsPerTib: s(125, SOURCES.fsxSsd), usdPerGbMonth: s(0.145, SOURCES.fsxPrice) },
  250: { mbpsPerTib: s(250, SOURCES.fsxSsd), usdPerGbMonth: s(0.21, SOURCES.fsxPrice) },
  500: { mbpsPerTib: s(500, SOURCES.fsxSsd), usdPerGbMonth: s(0.34, SOURCES.fsxPrice) },
  1000: { mbpsPerTib: s(1_000, SOURCES.fsxSsd), usdPerGbMonth: s(0.6, SOURCES.fsxPrice) },
};

/** FSx SSD capacity steps: 1,200 GiB, 2,400 GiB, then increments of 2,400 GiB (W4-21). */
export const FSX_CAPACITY_STEPS_GIB = {
  first: s(1_200, SOURCES.fsxSizes),
  second: s(2_400, SOURCES.fsxSizes),
  increment: s(2_400, SOURCES.fsxSizes),
} as const;

/** S3 Connector for PyTorch v1.5.0 default part size, bytes (8 MiB). */
export const S3_CONNECTOR_PART_BYTES: Sourced = s(8 * MiB, SOURCES.s3Connector);
/** S3 PUT requests per second per partitioned prefix (documented floor). */
export const S3_PUT_PER_SECOND_PER_PREFIX: Sourced = s(3_500, SOURCES.s3Rate);

// ---------------------------------------------------------------------------------------------
// Input checks shared by the calculators: each throws a RangeError that names the field.
// ---------------------------------------------------------------------------------------------

export function requireFinite(field: string, value: number): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RangeError(`${field} must be a finite number (got ${String(value)})`);
  }
}

export function requirePositive(field: string, value: number): void {
  requireFinite(field, value);
  if (value <= 0) throw new RangeError(`${field} must be greater than 0 (got ${value})`);
}

export function requireNonNegative(field: string, value: number): void {
  requireFinite(field, value);
  if (value < 0) throw new RangeError(`${field} must be 0 or more (got ${value})`);
}

export function requirePositiveInteger(field: string, value: number): void {
  requirePositive(field, value);
  if (!Number.isInteger(value)) throw new RangeError(`${field} must be a whole number (got ${value})`);
}

/** A fraction in (0, 1]. */
export function requireUnitFraction(field: string, value: number): void {
  requireFinite(field, value);
  if (value <= 0 || value > 1) throw new RangeError(`${field} must be in (0, 1] (got ${value})`);
}
