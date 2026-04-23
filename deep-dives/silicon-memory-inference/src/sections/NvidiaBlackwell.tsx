import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function NvidiaBlackwell() {
  return (
    <SectionShell
      title="NVIDIA Blackwell — B200 and B300"
      subtitle="NV-HBI reticle bridge, TMEM, tcgen05, and NVFP4"
      tldr={[
        'Blackwell fuses two reticle-limit dies into one logical GPU via NV-HBI, a high-bandwidth silicon bridge. Software sees one accelerator; hardware is two.',
        'TMEM — Tensor Memory — introduces 256 KB per SM of software-managed SRAM dedicated to tensor-core data staging, above and beyond SMEM.',
        'tcgen05 is the Blackwell tensor-core instruction family. It unlocks BF16, FP8, FP6, and FP4 including NVFP4 (E2M1) and MXFP4 / MXFP8 with block scaling.',
        'B300 is the refresh with larger HBM capacity and higher pin speed. Both ship HBM3e-class memory.',
      ]}
      scope={[
        'NV-HBI reticle bridge: die-to-die bandwidth, coherence model, how it differs from NVLink or PCIe.',
        'SM architecture on Blackwell: tensor cores v5, TMEM, updated SMEM, L2, HBM interface.',
        'tcgen05.mma instruction family: operand formats, block scaling, software contract.',
        'New precision formats: NVFP4 (E2M1), MXFP4 and MXFP8 (OCP microscaling).',
        'HBM3e / HBM3e+ on B200 and B300: capacity per stack, aggregate per GPU.',
        'NVLink 5 generation: per-GPU bandwidth, NVSwitch topology, coherence with Grace.',
        'P6-B200 and P6-B300 on AWS: availability, EFA bandwidth, Capacity Blocks.',
      ]}
      panelistMap="AWS-adjacent but also the fulcrum of the FLOPs-vs-memory argument the panel is running. Blackwell pushed tensor density up hard; use this section to remind the audience that the ridge point also moved right, making more workloads memory-bound."
      evaluationLens={[
        'Is the kernel actually running tcgen05 with native FP4 / FP8, or emulating via BF16?',
        'Does the model benefit from NVFP4 block scaling, or is the accuracy floor too low?',
        'Is the workload sensitive to TMEM footprint — can the kernel keep enough tiles resident to avoid L2 traffic?',
        'At what batch size does Blackwell cross the ridge point for this model?',
      ]}
    />
  );
}
