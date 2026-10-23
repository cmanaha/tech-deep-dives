import type { Source } from '../components/Cite';

/**
 * Sources for AWS Trainium, Inferentia and Neuron (AwsCustomSilicon.tsx and
 * TrainiumChipDiagram.tsx). Register: research/2026-10-refresh/03-aws-cpus.md
 * section 1. Records shared with other sections reuse their URL, title,
 * publisher and tier exactly; pages re-read for this section carry the date
 * they were fetched.
 */
export const S = {
  // AWS Neuron architecture pages (Tier 1)
  trainium2Arch: {
    title: 'AWS Neuron: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trainium3Arch: {
    title: 'AWS Neuron: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronCoreV3: {
    title: 'AWS Neuron: NeuronCore-v3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trn2Arch: {
    title: 'AWS Neuron: Amazon EC2 Trn2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  trn3Arch: {
    title: 'AWS Neuron: Amazon EC2 Trn3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  inferentia2Arch: {
    title: 'AWS Neuron: Inferentia2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/inferentia2.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // NKI architecture guides and API reference (Tier 1)
  nkiTrn2Arch: {
    title: 'AWS Neuron: NKI Trainium2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-18',
  },
  nkiTrn3Arch: {
    title: 'AWS Neuron: NKI Trainium3 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium3_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  ncMatmul: {
    title: 'AWS Neuron: NKI API reference, nki.isa.nc_matmul',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/api/generated/nki.isa.nc_matmul.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiOverview: {
    title: 'AWS Neuron: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Collectives and runtime (Tier 1)
  collectives: {
    title: 'AWS Neuron: What is Neuron Collective Communication?',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  intranodeCollectives: {
    title: 'AWS Neuron: Intra-node Collective Communications with AWS Neuron',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/explore/intranode-collective-comm.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronEnvVars: {
    title: 'AWS Neuron: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/jax/api-reference-guide/neuron-envvars.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Releases and software status (Tier 1)
  neuronWhatsNew: {
    title: "AWS Neuron: What's New in the AWS Neuron SDK (releases 2.27.0 to 2.32.0)",
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  pytorchNative: {
    title: 'AWS Neuron 2.32.0: Native PyTorch for AWS Trainium (TorchNeuron)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/frameworks/torch/pytorch-native-overview.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  torchNeuron233: {
    title: 'AWS Neuron 2.33.0: What is TorchNeuron? (public beta)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/torch/about-pytorch-neuron.html',
    tier: 1,
    accessed: '2026-10-23',
  },

  // EC2 instance specification (Tier 1)
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // GPU comparison points (Tier 1)
  hopperTuningGuide: {
    title: 'NVIDIA Hopper Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ncclV2283: {
    title: 'NVIDIA/nccl release v2.28.3-1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/nccl/releases/tag/v2.28.3-1',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Product announcements and pages (Tier 2)
  trn3WhatsNew: {
    title: 'Announcing Amazon EC2 Trn3 UltraServers (2025-12-02)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/',
    tier: 2,
    accessed: '2026-10-16',
  },
  trn3Page: {
    title: 'Amazon EC2 Trn3 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/trn3/',
    tier: 2,
    accessed: '2026-10-16',
  },
  trainium3AboutAmazon: {
    title: 'Trainium3 UltraServers now available (Trainium4 roadmap)',
    publisher: 'Amazon',
    url: 'https://www.aboutamazon.com/news/aws/trainium-3-ultraserver-faster-ai-training-lower-cost',
    tier: 2,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
