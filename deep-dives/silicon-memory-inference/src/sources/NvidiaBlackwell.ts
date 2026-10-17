import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/NvidiaBlackwell.tsx and
 * src/components/BlackwellDieDiagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/02-nvidia.md (section 2 and the Sources list).
 * Records accessed 2026-10-17 were re-fetched during authoring.
 */
export const S = {
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  blackwellTuningGuide: {
    title: 'NVIDIA Blackwell Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  ptxIsa: {
    title: 'PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  computeCapabilities: {
    title: 'CUDA Programming Guide v13.4.2: Compute Capabilities',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  cudaGpus: {
    title: 'CUDA GPU compute capability list',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/cuda-gpus',
    tier: 1,
    accessed: '2026-10-16',
  },
  cutlassChangelog: {
    title: 'CUTLASS CHANGELOG at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  cutlassExample92: {
    title: 'CUTLASS example 92_blackwell_moe_gemm at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm',
    tier: 1,
    accessed: '2026-10-16',
  },
  nvidiaQ2Fy27: {
    title: 'NVIDIA Form 8-K exhibit 99.1, Q2 fiscal 2027 results (2026-08-26)',
    publisher: 'NVIDIA',
    url: 'https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27pr.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  p6Page: {
    title: 'Amazon EC2 P6 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/p6/',
    tier: 2,
    accessed: '2026-10-17',
  },
  p6eGb300Ga: {
    title: 'Amazon EC2 P6e-GB300 UltraServers (NVIDIA GB300 NVL72) generally available',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available',
    tier: 2,
    accessed: '2026-10-16',
  },
  gpuPriceCut: {
    title: 'Announcing up to 45% price reduction for Amazon EC2 NVIDIA GPU-accelerated instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/announcing-up-to-45-price-reduction-for-amazon-ec2-nvidia-gpu-accelerated-instances/',
    tier: 2,
    accessed: '2026-10-16',
  },
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  blackwellArchitecture: {
    title: 'NVIDIA Blackwell architecture',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/',
    tier: 2,
    accessed: '2026-10-16',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-17',
  },
  dgxB200: {
    title: 'NVIDIA DGX B200',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/dgx-b200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  hgxPage: {
    title: 'NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 2,
    accessed: '2026-10-17',
  },
  gb200Nvl72: {
    title: 'NVIDIA GB200 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/',
    tier: 2,
    accessed: '2026-10-16',
  },
  gb300Nvl72: {
    title: 'NVIDIA GB300 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb300-nvl72/',
    tier: 2,
    accessed: '2026-10-16',
  },
  veraRubinNvl72: {
    title: 'NVIDIA Vera Rubin NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  awsNvidia2026: {
    title: 'AWS and NVIDIA to Deliver 2 Million Additional GPUs (2026-08-26)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/aws-and-nvidia-to-deliver-2-million-additional-gpus-and-next-generation-infrastructure-for-agentic-and-physical-ai',
    tier: 2,
    accessed: '2026-10-16',
  },
  gtc2026: {
    title: 'GTC 2026 live updates (Feynman, Rosa, Kyber)',
    publisher: 'NVIDIA',
    url: 'https://blogs.nvidia.com/blog/gtc-2026-news/',
    tier: 2,
    accessed: '2026-10-16',
  },
  nvfp4Blog: {
    title: 'Introducing NVFP4 for Efficient and Accurate Low-Precision Inference',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/',
    tier: 2,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
