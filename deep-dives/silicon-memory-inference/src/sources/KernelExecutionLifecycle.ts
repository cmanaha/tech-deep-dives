import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/KernelExecutionLifecycle.tsx and
 * src/components/KernelLifecycleDiagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/02-nvidia.md (section 5) and 03-aws-cpus.md
 * (sections 1, 2 and 5). Records shared with NvidiaHopper.ts and
 * NvidiaBlackwell.ts reuse their URL, title, publisher and tier. Records
 * accessed 2026-10-17 were fetched or re-fetched during authoring.
 */
export const S = {
  // NVIDIA, Tier 1
  hopperTuningGuide: {
    title: 'NVIDIA Hopper Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  blackwellTuningGuide: {
    title: 'NVIDIA Blackwell Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html',
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
  computeCapabilities: {
    title: 'CUDA Programming Guide v13.4.2: Compute Capabilities',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  cudaProgrammingModel: {
    title: 'CUDA Programming Guide v13.4.2: Programming Model (thread blocks, warps, on-chip memory)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  cudaHardwareMultithreading: {
    title: 'CUDA Programming Guide v13.4.2: Advanced Kernel Programming (Hardware Multithreading)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  cudaAsyncCopies: {
    title: 'CUDA Programming Guide v13.4.2: Asynchronous Data Copies',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  cudaGraphs: {
    title: 'CUDA Programming Guide v13.4.2: CUDA Graphs',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  cutlassChangelog: {
    title: 'CUTLASS CHANGELOG at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  cudaPdl: {
    title: 'CUDA Programming Guide v13.4.2: Programmatic Dependent Launch and Synchronization',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/programmatic-dependent-launch.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // NVIDIA, Tier 2
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-17',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
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
    accessed: '2026-10-16',
  },

  // Third-party measurement, Tier 3
  luoHopperBench: {
    title: 'Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (Luo et al., arXiv:2402.13499v1), Table IV',
    publisher: 'arXiv',
    url: 'https://arxiv.org/pdf/2402.13499',
    tier: 3,
    accessed: '2026-10-16',
  },

  // AWS Neuron, Tier 1
  trn2Arch: {
    title: 'AWS Neuron 2.32.0: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrn2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium2_arch.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronCompiler: {
    title: 'AWS Neuron 2.32.0: Neuron Graph Compiler overview (neuronx-cc)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/compiler/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiOverview: {
    title: 'AWS Neuron 2.32.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Intel AMX on Linux, Tier 1 (source code pinned to a tag)
  llvmAmxIntrin: {
    title: 'Clang amxintrin.h at tag llvmorg-23.1.3 (tile size, LDTILECFG, TILELOADD, TDPBF16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxintrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmAmxFp16Intrin: {
    title: 'Clang amxfp16intrin.h at tag llvmorg-23.1.3 (TDPFP16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxfp16intrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmX86Registers: {
    title: 'LLVM X86RegisterInfo.td at tag llvmorg-23.1.3 (tile registers TMM0 to TMM7)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86RegisterInfo.td',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmX86Td: {
    title: 'LLVM X86.td at tag llvmorg-23.1.3 (per-generation feature lists: SPR, GNR, DMR)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86.td#L1243-L1310',
    tier: 1,
    accessed: '2026-10-16',
  },
  linuxXstate: {
    title: 'Linux kernel Documentation/arch/x86/xstate.rst at tag v6.19 (AMX TILE_DATA, ARCH_REQ_XCOMP_PERM)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.19/Documentation/arch/x86/xstate.rst',
    tier: 1,
    accessed: '2026-10-17',
  },
  oneDnnAmxPermission: {
    title: 'oneDNN src/cpu/x64/cpu_isa_traits.cpp at tag v3.13.4, lines 357-374 (AMX permission request)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/cpu/x64/cpu_isa_traits.cpp#L357-L374',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
