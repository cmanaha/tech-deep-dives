import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function CerebrasWaferScale() {
  return (
    <SectionShell
      title="Cerebras WSE-3"
      subtitle="Wafer-scale SRAM and the bandwidth-collapse architecture"
      tldr={[
        'WSE-3 is a single wafer-scale die with hundreds of thousands of cores and tens of GB of on-wafer SRAM distributed across the substrate.',
        'Models that fit on-wafer never cross an HBM boundary. The bandwidth wall disappears because the hierarchy collapses to one tier.',
        'The bet: trade capacity (you must fit) for bandwidth (every access is SRAM-speed).',
        'For models that do not fit, Cerebras offers sharded-wafer configurations that reintroduce an inter-wafer fabric.',
      ]}
      scope={[
        'WSE-3 die architecture: core count, SRAM per core, on-wafer mesh, power delivery, yield recovery.',
        'Programming model: SDK, kernel authoring, compiler flow, what runs natively vs what requires partitioning.',
        'Memory model: no HBM, no DRAM tier, register + SRAM + wafer-global memory addresses.',
        'Scale-out: MemoryX, SwarmX, wafer-to-wafer communication, and how the bandwidth collapse degrades at scale.',
        'Workload fit: LLM inference for models that fit the wafer, HPC simulations with fine-grained dataflow, scientific workloads.',
        'Workload misfit: trillion-parameter models that exceed wafer capacity, branchy dynamic workloads.',
      ]}
      panelistMap="Zigfrid Zvezdin's home turf. Carry the vocabulary so you can engage specifically — bandwidth collapse, wafer-to-wafer fabric, SwarmX. Use this section to demonstrate that you understand the bet and can steelman it."
      evaluationLens={[
        'Does the model fit on a single wafer at the target precision? If yes, this is the bandwidth-dominant architecture.',
        'Is the kernel authored in their SDK or ported from CUDA? The ecosystem cost is real.',
        'When you scale past one wafer, how does the bandwidth collapse degrade?',
        'What happens to jitter and tail latency at wafer scale — does the mesh introduce its own stall behavior?',
      ]}
    />
  );
}
