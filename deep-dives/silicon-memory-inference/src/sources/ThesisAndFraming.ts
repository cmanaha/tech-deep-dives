import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/ThesisAndFraming.tsx and src/components/TriangleDiagram.tsx.
 * Tiers and URLs follow research/2026-10-refresh/05-workloads.md (section 1, the
 * ridge-point table and the Sources list) and 04-other-arch.md for the Cerebras and
 * Groq records. Records shared with other sections reuse their URL, title, publisher
 * and tier. Records accessed 2026-10-17 were fetched during authoring.
 */
export const S = {
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-17',
  },
  gb300Nvl72: {
    title: 'NVIDIA GB300 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb300-nvl72/',
    tier: 2,
    accessed: '2026-10-16',
  },
  deepseekV3Report: {
    title: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
    publisher: 'DeepSeek-AI',
    url: 'https://arxiv.org/abs/2412.19437',
    tier: 2,
    accessed: '2026-10-16',
  },
  roofline: {
    title:
      'Roofline: An Insightful Visual Performance Model for Multicore Architectures (Williams, Waterman, Patterson, CACM 52(4), 2009), Crossref record',
    publisher: 'ACM',
    url: 'https://api.crossref.org/works/10.1145/1498765.1498785',
    tier: 3,
    accessed: '2026-10-16',
  },
  cudaBestPractices: {
    title: 'CUDA C++ Best Practices Guide (CUDA 13.4): Occupancy',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ptxIsa: {
    title: 'PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
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
    accessed: '2026-10-16',
  },
  cerebrasS1: {
    title: 'Cerebras Systems, Form S-1 (filed 2026-04-17)',
    publisher: 'Cerebras Systems (SEC EDGAR)',
    url: 'https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  cerebrasSdkBlog: {
    title: 'Supercharge your HPC Research with the Cerebras SDK',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk',
    tier: 2,
    accessed: '2026-10-16',
  },
  cerebrasInferenceBlog: {
    title: 'Introducing Cerebras Inference: AI at Instant Speed (2024-08-27)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed',
    tier: 2,
    accessed: '2026-10-16',
  },
  clangAmxIntrin: {
    title: 'Clang amxintrin.h at tag llvmorg-23.1.3 (tile size, LDTILECFG, TILELOADD, TDPBF16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxintrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmNeoverseV2: {
    title: 'AArch64SchedNeoverseV2.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/AArch64/AArch64SchedNeoverseV2.td',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmSapphireRapids: {
    title: 'X86SchedSapphireRapids.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86SchedSapphireRapids.td',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmZnver4: {
    title: 'X86ScheduleZnver4.td at tag llvmorg-19.1.0 (MispredictPenalty)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86ScheduleZnver4.td',
    tier: 1,
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
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
