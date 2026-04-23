import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function NvidiaCompilersAndTooling() {
  return (
    <SectionShell
      title="NVIDIA Compilers and Kernel Tooling"
      subtitle="CUDA, CUTLASS, CuTe, Triton, cuDNN, Nsight — how tiles land on silicon"
      tldr={[
        'CUDA is the programming model. PTX is the intermediate representation. nvcc is the compiler that lowers CUDA C++ through PTX to SASS for the target SM.',
        'CUTLASS is the NVIDIA C++ template library for tile-based GEMM and convolution. CuTe is the newer layout-algebra layer introduced to handle the Hopper and Blackwell tensor-core instruction families (wgmma, tcgen05).',
        'Triton is the Python DSL for GPU kernel authoring that autogenerates tile schedules. It is the default backend for torch.compile (Inductor) on NVIDIA and the lingua franca for custom fused kernels.',
        'cuBLAS, cuDNN, and cuTENSOR are the high-level libraries. cuDNN Frontend API exposes graph-level fusion with runtime plan selection.',
        'Nsight Compute profiles individual kernels down to SM utilization and memory stalls; Nsight Systems profiles the full execution across CPU, GPU, and CUDA streams. Both are required to close the roofline.',
        'The tiling choice is the bandwidth choice. Matching tile shape to SMEM, TMEM, and register-file budgets is how a kernel lands on the FLOP ceiling rather than the memory floor.',
      ]}
      scope={[
        'CUDA programming model — threads, warps, blocks, clusters (Hopper), grids. Execution hierarchy and the mapping to SM / warp scheduler / tensor core.',
        'nvcc pipeline: CUDA C++ → PTX → SASS. Why PTX is not the final word and SASS matters for Hopper/Blackwell.',
        'CUTLASS 3.x and CuTe: layout-algebra, swizzle primitives, hierarchical tiling for wgmma (Hopper) and tcgen05 (Blackwell).',
        'Triton: Python DSL, block-program model, autotuner, how the compiler picks tile shape and staging.',
        'cuBLAS, cuDNN, cuDNN Frontend, cuTENSOR — graph API, runtime plan selection, what the library picks vs what the user picks.',
        'torch.compile (Inductor) targeting Triton; TensorRT-LLM for inference; Torch-TRT for eager fallback.',
        'Nsight Compute — kernel profiler, stall analysis, memory workload analysis, roofline view. Nsight Systems — system-wide timeline, CUDA API trace.',
        'Compiler cache, kernel cache, fatbinary layout — how a deployed model ends up on disk and what cold-start costs look like.',
      ]}
      panelistMap="Shared technical ground. NVIDIA ecosystem maturity is part of the incumbent story; owning the vocabulary (CUTLASS, CuTe, Triton, Nsight) keeps the conversation grounded when Cerebras or Trainium differentiation comes up. The tiling argument sits here — it is how 'peak FLOPs' becomes realized FLOPs, and it is where the heterogeneity triangle gets resolved in software."
      evaluationLens={[
        'Is the kernel authored in CUTLASS, Triton, or a third-party library — and is the tile shape matched to the target SM?',
        'Does the model go through torch.compile with Triton, or is it eager with cuBLAS/cuDNN fallbacks? The performance gap can be 2x.',
        'Has the team actually profiled with Nsight Compute, or are they reading throughput numbers off a dashboard?',
        'For Blackwell, does the kernel emit tcgen05 and use TMEM — or is it still Hopper-era wgmma code leaving throughput on the floor?',
      ]}
    />
  );
}
