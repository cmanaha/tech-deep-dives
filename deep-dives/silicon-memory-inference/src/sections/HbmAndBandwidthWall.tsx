import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function HbmAndBandwidthWall() {
  return (
    <SectionShell
      title="HBM and the Bandwidth Wall"
      subtitle="HBM3, HBM3e, HBM3e+, HBM4 and why decode throughput tracks HBM pin speed"
      tldr={[
        'HBM (High Bandwidth Memory) is stacked DRAM on a silicon interposer or bridge, directly adjacent to the accelerator die.',
        'Pin speed has climbed each generation: HBM3 6.4 Gb/s, HBM3e around 8–9.2 Gb/s, HBM3e+ pushing 9.6 Gb/s, HBM4 targeting 8+ Gb/s on a wider bus.',
        'Capacity per stack has grown: 16–24 GB on HBM3e, 36 GB announced for H200, 192 GB aggregate per GPU on B200, 288 GB on B300.',
        'For decode workloads, per-GPU throughput tracks HBM bandwidth almost linearly. That is the bandwidth wall in one sentence.',
      ]}
      scope={[
        'HBM generation timeline: HBM, HBM2, HBM2e, HBM3, HBM3e, HBM3e+, HBM4.',
        'Per-stack characteristics: channels, banks, pin speed, capacity, power.',
        'Which accelerator ships which generation: H100 (HBM3), H200 (HBM3e), B200 / B300 (HBM3e+ / HBM4 class), Trainium2 / Trainium3, MI300 / MI325.',
        'Bandwidth math: stacks per package × channels per stack × pin speed. Why aggregate numbers are per-package, not per-chip.',
        'The bandwidth wall for decode: tokens per second as a function of HBM BW per GPU, batch size, and KV cache layout.',
        'Where HBM does not help: compute-bound kernels, already-tiled workloads with high arithmetic intensity.',
      ]}
      panelistMap="Cerebras skips HBM entirely at WSE scale. HyperCIM attacks the bandwidth problem at the memory-array level. AWS speaks to HBM in the context of which EC2 GPU or Trainium instance matches which workload. This section sets up all three contrasts."
      evaluationLens={[
        'What is the HBM bandwidth per GPU on the target instance — and is that the bottleneck?',
        'Does the model fit in HBM on a single GPU, or does it spill across NVLink / NVSwitch?',
        'Is the workload actually HBM-bound, or SRAM-bound, or interconnect-bound at the target batch size?',
        'When the bandwidth wall binds, which lever moves — bigger HBM, fewer parameters, lower precision, or disaggregated serving?',
      ]}
    />
  );
}
