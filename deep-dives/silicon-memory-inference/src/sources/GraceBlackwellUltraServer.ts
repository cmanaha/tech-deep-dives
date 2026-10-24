import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/GraceBlackwellUltraServer.tsx and
 * src/components/Nvl72Diagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/02-nvidia.md (section 3 and the Sources list).
 * Records shared with NvidiaBlackwell.ts and NvidiaHopper.ts reuse their
 * URL, title, publisher and tier.
 * Records accessed 2026-10-17 were re-fetched during authoring.
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
  wideEpReadme: {
    title: 'TensorRT-LLM examples/wide_ep README at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/examples/wide_ep/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  trtllmV021: {
    title: 'TensorRT-LLM release v0.21.0 notes',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.21.0',
    tier: 1,
    accessed: '2026-10-17',
  },
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
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
    accessed: '2026-10-17',
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
  gb200Nvl72: {
    title: 'NVIDIA GB200 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  gb300Nvl72: {
    title: 'NVIDIA GB300 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb300-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  veraRubinNvl72: {
    title: 'NVIDIA Vera Rubin NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  nvlinkC2c: {
    title: 'NVIDIA NVLink-C2C',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/nvlink-c2c/',
    tier: 2,
    accessed: '2026-10-17',
  },
  graceSuperchipPage: {
    title: 'NVIDIA Grace CPU Superchip (Grace CPU C1 and Superchip specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/grace-cpu-superchip/',
    tier: 2,
    accessed: '2026-10-17',
  },
  moeBlog: {
    title: 'How NVIDIA GB200 NVL72 and NVIDIA Dynamo Boost Inference Performance for MoE Models',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/',
    tier: 2,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
