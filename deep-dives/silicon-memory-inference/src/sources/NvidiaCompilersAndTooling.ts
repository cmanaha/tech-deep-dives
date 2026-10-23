import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/NvidiaCompilersAndTooling.tsx and
 * src/components/NvidiaCompilerStack.tsx. Tiers and URLs follow
 * research/2026-10-refresh/02-nvidia.md (sections 0, 4 and 6 and the Sources
 * list). Records shared with NvidiaBlackwell.ts and GraceBlackwellUltraServer.ts
 * reuse their URL, title, publisher and tier. Records accessed 2026-10-17 were
 * re-fetched during authoring; the PyTorch code records were read at tag
 * v2.14.1 (commit 5c4886908584029761b579af026dcfb627c84070).
 */
export const S = {
  // PyTorch source code at tag v2.14.1: the Inductor GEMM routing.
  torchCompileDefault: {
    title: 'PyTorch v2.14.1 torch/__init__.py: torch.compile signature, backend="inductor"',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/__init__.py#L3019',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorModes: {
    title: 'PyTorch v2.14.1 torch/_inductor/__init__.py: list_mode_options, "max-autotune"',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/__init__.py#L384-L388',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorConfig: {
    title: 'PyTorch v2.14.1 torch/_inductor/config.py: max_autotune_gemm_backends',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/config.py#L637-L649',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorCudaBackend: {
    title: 'PyTorch v2.14.1 torch/_inductor/config.py: cuda_backend = "triton" (CUDA codegen backend)',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/config.py#L2818-L2820',
    tier: 1,
    accessed: '2026-10-23',
  },
  inductorUtils: {
    title:
      'PyTorch v2.14.1 torch/_inductor/utils.py: use_triton_template, use_cutlass_template, use_aten_gemm_kernels',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/utils.py',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorMm: {
    title: 'PyTorch v2.14.1 torch/_inductor/kernel/mm.py: tuned_mm, tuned_addmm, tuned_int_mm, tuned_scaled_mm',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm.py',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorGroupedMm: {
    title: 'PyTorch v2.14.1 torch/_inductor/kernel/mm_grouped.py: tuned_grouped_mm and the CuTe DSL template',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm_grouped.py#L519',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorBmm: {
    title: 'PyTorch v2.14.1 torch/_inductor/kernel/bmm.py: tuned_bmm',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/bmm.py#L230',
    tier: 1,
    accessed: '2026-10-17',
  },
  inductorSmallMm: {
    title: 'PyTorch v2.14.1 torch/_inductor/kernel/mm_common.py: _use_small_mm_pointwise',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm_common.py#L197-L215',
    tier: 1,
    accessed: '2026-10-17',
  },
  atenLinear: {
    title: 'PyTorch v2.14.1 aten/src/ATen/native/Linear.cpp: linear lowers to addmm',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/aten/src/ATen/native/Linear.cpp#L106-L129',
    tier: 1,
    accessed: '2026-10-17',
  },
  atenCudaBlas: {
    title: 'PyTorch v2.14.1 aten/src/ATen/cuda/CUDABlas.cpp: cublasGemmEx and cublasLtMatmul calls',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/aten/src/ATen/cuda/CUDABlas.cpp',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Triton and Gluon.
  tritonMatmulTutorial: {
    title: 'Triton tutorial: Matrix Multiplication (triton.autotune and triton.Config)',
    publisher: 'Triton',
    url: 'https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  gluonIntro: {
    title: 'Introduction to Gluon tutorial at Triton tag v3.8.0',
    publisher: 'Triton',
    url: 'https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/gluon/01-intro.py',
    tier: 1,
    accessed: '2026-10-17',
  },
  tritonV380: {
    title: 'Triton 3.8.0 release notes (2026-08-28)',
    publisher: 'Triton',
    url: 'https://github.com/triton-lang/triton/releases/tag/v3.8.0',
    tier: 1,
    accessed: '2026-10-17',
  },

  // CUTLASS, CuTe and CuTe DSL.
  cutlassReadme: {
    title: 'CUTLASS README at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/blob/v4.8.0/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  cutlassChangelog: {
    title: 'CUTLASS CHANGELOG at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  cuteDslCompileOptions: {
    title: 'CuTe DSL: JIT compilation options (keep-ptx, ptxas-options)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cutlass/latest/media/docs/pythonDSL/cute_dsl_general/dsl_jit_compilation_options.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // CUDA Tile, PTX and compute capability.
  cudaTileGuide: {
    title: 'CUDA Programming Guide v13.4.2: Writing Tile Kernels',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-tile-kernels.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  cutileQuickstart: {
    title: 'cuTile Python quickstart and release notes (1.6.0, 2026-09-09)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cutile-python/quickstart.html',
    tier: 1,
    accessed: '2026-10-17',
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

  // TensorRT and TensorRT-LLM.
  tensorrtQuickStart: {
    title: 'TensorRT Quick Start Guide: What Is TensorRT?',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  trtllmReadme: {
    title: 'TensorRT-LLM README at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  trtllmV100: {
    title: 'TensorRT-LLM release v1.0.0 notes (2025-09-24)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0',
    tier: 1,
    accessed: '2026-10-17',
  },
  trtllmV0100: {
    title: 'TensorRT-LLM release v0.10.0 notes (2024-06-05): "Added FP8 quantization support for Mixtral"',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.10.0',
    tier: 1,
    accessed: '2026-10-23',
  },
  trtllmMoePluginV0100: {
    title: 'TensorRT-LLM v0.10.0 mixtureOfExpertsPlugin.cpp: FP8 CutlassMoeFCRunner',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v0.10.0/cpp/tensorrt_llm/plugins/mixtureOfExperts/mixtureOfExpertsPlugin.cpp#L201-L217',
    tier: 1,
    accessed: '2026-10-23',
  },
  trtllmV121: {
    title: 'TensorRT-LLM release v1.2.1 (2026-04-20)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.2.1',
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
  wideEpExample: {
    title: 'TensorRT-LLM examples/wide_ep at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Profilers.
  nsightSystemsGuide: {
    title: 'Nsight Systems User Guide',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/nsight-systems/UserGuide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  nsightComputeGuide: {
    title: 'Nsight Compute Profiling Guide',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
