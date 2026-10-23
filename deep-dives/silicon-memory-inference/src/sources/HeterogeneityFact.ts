import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/HeterogeneityFact.tsx.
 * Tiers and URLs follow research/2026-10-refresh/05-workloads.md (section 2 and the
 * Sources list), 03-aws-cpus.md (sections 0 and 1) for Trainium and 04-other-arch.md
 * (sections 0 to 2) for Cerebras and Groq. Records shared with other sections reuse
 * their URL, title, publisher and tier. Records accessed 2026-10-17 were fetched
 * during authoring.
 */
export const S = {
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trainium2Arch: {
    title: 'AWS Neuron 2.32.0: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  trainium3Arch: {
    title: 'AWS Neuron 2.32.0: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  neuronCoreV3: {
    title: 'AWS Neuron 2.32.0: NeuronCore-v3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/neuron-core-v3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiOverview: {
    title: 'AWS Neuron 2.32.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/index.html',
    tier: 1,
    accessed: '2026-10-18',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-18',
  },
  trn2Arch: {
    title: 'AWS Neuron 2.32.0: Amazon EC2 Trn2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trn2-arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
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
  cudaBestPractices: {
    title: 'CUDA C++ Best Practices Guide (CUDA 13.4): Occupancy',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  cerebrasS1: {
    title: 'Cerebras Systems, Form S-1 (filed 2026-04-17)',
    publisher: 'Cerebras Systems (SEC EDGAR)',
    url: 'https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  llvmNeoverseV2: {
    title: 'AArch64SchedNeoverseV2.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/AArch64/AArch64SchedNeoverseV2.td',
    tier: 1,
    accessed: '2026-10-16',
  },
  llvmSapphireRapids: {
    title: 'X86SchedSapphireRapids.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86SchedSapphireRapids.td',
    tier: 1,
    accessed: '2026-10-16',
  },
  llvmZnver4: {
    title: 'X86ScheduleZnver4.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86ScheduleZnver4.td',
    tier: 1,
    accessed: '2026-10-16',
  },
  m8iPage: {
    title: 'Amazon EC2 M8i instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/m8i/',
    tier: 2,
    accessed: '2026-10-17',
  },
  m8aPage: {
    title: 'Amazon EC2 M8a instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/m8a/',
    tier: 2,
    accessed: '2026-10-17',
  },
  trn3Page: {
    title: 'Amazon EC2 Trn3 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/trn3/',
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
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-18',
  },
  hgxPage: {
    title: 'NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 2,
    accessed: '2026-10-16',
  },
  cerebrasSdkBlog: {
    title: 'Supercharge your HPC Research with the Cerebras SDK',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk',
    tier: 2,
    accessed: '2026-10-16',
  },
  cerebrasSdkDocs: {
    title: 'Cerebras SDK docs: Wafer-Scale Engine Architecture',
    publisher: 'Cerebras',
    url: 'https://sdk.cerebras.ai/computing-with-cerebras',
    tier: 1,
    accessed: '2026-10-18',
  },
  cerebrasInferenceBlog: {
    title: 'Introducing Cerebras Inference: AI at Instant Speed (2024-08-27)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed',
    tier: 2,
    accessed: '2026-10-16',
  },
  wse3Press: {
    title:
      "Cerebras Systems Unveils World's Fastest AI Chip with Whopping 4 Trillion Transistors (WSE-3, 2024-03-13)",
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine',
    tier: 2,
    accessed: '2026-10-17',
  },
  groqNvidiaLicense: {
    title: 'Groq and Nvidia Enter Non-Exclusive Inference Technology Licensing Agreement (2025-12-24)',
    publisher: 'Groq',
    url: 'https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale',
    tier: 2,
    accessed: '2026-10-16',
  },
  lpxBlog: {
    title:
      'Inside NVIDIA Groq 3 LPX: The Low-Latency Inference Accelerator for the NVIDIA Vera Rubin Platform (2026-03-16)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/',
    tier: 2,
    accessed: '2026-10-17',
  },
  lpxProduction: {
    title: 'NVIDIA Groq 3 LPX Now in Full Production With World-Class Speed for Agentic AI (2026-08-24)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-groq-3-lpx-now-in-full-production-with-world-class-speed-for-agentic-ai',
    tier: 2,
    accessed: '2026-10-16',
  },
  pond: {
    title: 'Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241), Figure 4',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2203.00241',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
