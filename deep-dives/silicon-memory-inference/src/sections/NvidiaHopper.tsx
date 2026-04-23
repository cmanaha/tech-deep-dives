import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function NvidiaHopper() {
  return (
    <SectionShell
      title="NVIDIA Hopper — H100 and H200"
      subtitle="wgmma, SMEM, Transformer Engine, and the P5 / P5e / P5en family"
      tldr={[
        'Hopper (GH100) ships on H100 and H200. Same SM architecture, different HBM tier — HBM3 on H100, HBM3e on H200 with larger capacity and higher bandwidth.',
        'Fourth-generation Tensor Cores introduce the Transformer Engine with FP8 (E4M3 and E5M2), dramatically improving inference throughput for BF16-equivalent accuracy.',
        'wgmma (warp-group matrix multiply accumulate) is the asynchronous tensor-core instruction that unlocks Hopper throughput.',
        'On AWS: P5 ships H100, P5e ships H200, P5en adds higher EFA bandwidth for multi-node scale-out.',
      ]}
      scope={[
        'Hopper SM architecture: tensor cores, CUDA cores, SMEM (up to 228 KB per SM), L1 / L2 sizing.',
        'Transformer Engine: FP8 formats, per-tensor scaling, dynamic precision selection.',
        'wgmma and async copy: TMA (Tensor Memory Accelerator), cluster-level programming.',
        'HBM3 (H100) vs HBM3e (H200): capacity, bandwidth, bus width, stack count.',
        'NVLink 4 generation: per-GPU bandwidth, NVSwitch topology, up to 8-way coherent GPU memory inside a node.',
        'P5 / P5e / P5en on AWS: GPU count per instance, EFA bandwidth, Capacity Blocks availability.',
        'Workloads where Hopper still wins despite Blackwell shipping: FP8-mature pipelines, cost-per-inference optimization, and fleet availability.',
      ]}
      panelistMap="AWS plus the broader GPU conversation. Most inference in the wild still runs on Hopper — use this section to ground the 'what is actually serving tokens today' side of the panel."
      evaluationLens={[
        'Does the kernel actually emit wgmma and use async copy, or is it older mma code leaving throughput on the floor?',
        'Is FP8 training or inference mature enough for the workload, or is BF16 still the path?',
        'Does the model fit on H100 (80 GB) or require H200 (141 GB) — and does the larger KV cache justify the price?',
        'Is the workload multi-node? If yes, P5en with more EFA bandwidth matters more than single-GPU uplift.',
      ]}
    />
  );
}
