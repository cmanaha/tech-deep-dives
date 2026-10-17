import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/NvidiaHopper.tsx and src/components/HopperSmDiagram.tsx.
 * Tiers and URLs follow research/2026-10-refresh/02-nvidia.md (section 1 and the
 * Sources list). Records shared with NvidiaBlackwell.ts reuse its URL, title,
 * publisher and tier. Records accessed 2026-10-17 were re-fetched during authoring.
 */
export const S = {
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  capacityBlocks: {
    title: 'Capacity Blocks for ML: supported instance types and Regions',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  hopperTuningGuide: {
    title: 'NVIDIA Hopper Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
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
    accessed: '2026-10-17',
  },
  cudaGpus: {
    title: 'CUDA GPU compute capability list',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/cuda-gpus',
    tier: 1,
    accessed: '2026-10-16',
  },
  cudaBestPractices: {
    title: 'CUDA C++ Best Practices Guide (CUDA 13.4): Occupancy',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  flashAttentionReadme: {
    title: 'FlashAttention README at tag v2.8.3.post2 (FlashAttention-3 beta)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  h100Page: {
    title: 'NVIDIA H100 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    tier: 2,
    accessed: '2026-10-16',
  },
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-17',
  },
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-17',
  },
  hopperFullProduction: {
    title: 'NVIDIA Hopper in Full Production (2022-09-20)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-hopper-in-full-production',
    tier: 2,
    accessed: '2026-10-16',
  },
  h200Announcement: {
    title: 'NVIDIA Supercharges Hopper, the World\'s Leading AI Computing Platform (2023-11-13)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-supercharges-hopper-the-worlds-leading-ai-computing-platform',
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
  p5Page: {
    title: 'Amazon EC2 P5 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/p5/',
    tier: 2,
    accessed: '2026-10-17',
  },
  gpuPriceCut: {
    title: 'Announcing up to 45% price reduction for Amazon EC2 NVIDIA GPU-accelerated instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/announcing-up-to-45-price-reduction-for-amazon-ec2-nvidia-gpu-accelerated-instances/',
    tier: 2,
    accessed: '2026-10-17',
  },
  luoHopperBench: {
    title: 'Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (Luo et al., arXiv:2402.13499v1), Table IV',
    publisher: 'arXiv',
    url: 'https://arxiv.org/pdf/2402.13499',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
