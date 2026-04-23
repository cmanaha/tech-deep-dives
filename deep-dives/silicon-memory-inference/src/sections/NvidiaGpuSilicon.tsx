import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function NvidiaGpuSilicon() {
  return (
    <SectionShell
      title="NVIDIA GPU Silicon"
      subtitle="Hopper, Blackwell, and the Grace-Blackwell Superchip on AWS"
      tldr={[
        'Hopper (H100, H200) powers P5 family instances; Blackwell (B200, B300) powers P6 family, and the Grace-Blackwell Superchip powers the P6e UltraServer.',
        'Blackwell fuses two reticle-limit dies with NV-HBI into one logical GPU and introduces TMEM — 256 KB of software-managed SRAM per SM.',
        'tcgen05 instructions unlock Blackwell tensor throughput for BF16, FP8, FP6, and FP4 including NVFP4 (E2M1) and MXFP4 / MXFP8.',
        'NVLink, NVSwitch, and NVLink-C2C form a coherent memory fabric at 900 GB/s that blurs the line between CPU and GPU memory.',
      ]}
      scope={[
        'Hopper microarchitecture: tensor cores, wgmma, SMEM, HBM3 (H100) vs HBM3e (H200).',
        'Blackwell microarchitecture: reticle-bridge dual die, TMEM, tcgen05.mma, NVFP4 native, MXFP4 and MXFP8 formats.',
        'Memory hierarchy: registers → SMEM → TMEM (Blackwell) → L2 → HBM3e → NVLink-accessible peer HBM → Grace LPDDR5X.',
        'P5, P5e, P5en instance layout — GPU count, NVSwitch topology, EFA bandwidth.',
        'P6-B200, P6-B300, P6e-GB200 UltraServer, P6e-GB300 UltraServer — GB200 and GB300 NVL72 racks on EC2.',
        'Capacity Blocks for ML and SageMaker HyperPod — how to land these instances reliably.',
      ]}
      panelistMap="AWS side of the GPU story. Cerebras and HyperCIM may contrast against NVIDIA, so owning the current NVIDIA silicon details keeps the comparison honest."
      evaluationLens={[
        'Is the model targeting FP8 or FP4 — and is the kernel actually emitting tcgen05 instructions?',
        'Does the workload benefit from NVLink-C2C coherence with Grace, or is it pure GPU-resident?',
        'Does multi-GPU scaling require NVSwitch bandwidth, or is EFA enough?',
        'Is the target a single P5, a multi-node P6, or an UltraServer rack? The fabric changes the answer.',
      ]}
    />
  );
}
