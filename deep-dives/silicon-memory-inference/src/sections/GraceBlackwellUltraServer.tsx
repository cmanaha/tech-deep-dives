import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function GraceBlackwellUltraServer() {
  return (
    <SectionShell
      title="Grace-Blackwell and UltraServer"
      subtitle="NVLink-C2C coherent memory and the NVL72 rack as a single logical accelerator"
      tldr={[
        'Grace-Blackwell Superchip pairs Grace (Arm Neoverse V2, LPDDR5X) with Blackwell (HBM3e) over NVLink-C2C at 900 GB/s coherent.',
        'The C2C link is cache-coherent. Grace can address Blackwell HBM and Blackwell can address Grace LPDDR5X as if it were part of one memory space.',
        'GB200 NVL72 stitches 72 Blackwells into a single NVLink domain — an UltraServer that behaves like one giant accelerator with 13.5 TB of HBM.',
        'GB300 NVL72 is the refresh with B300 silicon and larger memory budget.',
        'On AWS: P6e-GB200 and P6e-GB300 UltraServer — the full rack as a single EC2 reservation through Capacity Blocks.',
      ]}
      scope={[
        'Grace CPU: Neoverse V2, 72 cores, LPDDR5X on package, memory controllers, cache hierarchy.',
        'NVLink-C2C: 900 GB/s coherent bandwidth, cache-line coherence semantics, page migration cost.',
        'GB200 Superchip: 1 Grace + 2 Blackwell, interconnect layout, thermals, power envelope.',
        'NVL72 rack architecture: 36 GB200 Superchips, NVSwitch fabric, water cooling, rack power budget.',
        'Aggregate memory: 13.5 TB HBM3e across the rack, plus LPDDR5X per Grace — how the programming model sees it.',
        'P6e-GB200 and P6e-GB300 UltraServer on AWS: how to reserve, NAP (NVSwitch) topology visible to customer, EFA bandwidth external to rack.',
        'Workloads that actually need this: frontier-model training, trillion-parameter inference at low per-token latency, RLHF rollouts.',
      ]}
      panelistMap="AWS showcase. This is where 'coherent memory' stops being an abstract phrase and becomes a concrete product. Counters the easy narrative that all GPU scale-out is EFA-only."
      evaluationLens={[
        'Does the workload actually benefit from CPU-GPU coherence, or is explicit copy good enough?',
        'Is the model large enough that NVL72 aggregate memory beats multi-node scaling?',
        'What is the tail latency of page migration over NVLink-C2C under contention?',
        'Is the customer ready for the operational envelope — rack power, cooling, reservation cadence?',
      ]}
    />
  );
}
