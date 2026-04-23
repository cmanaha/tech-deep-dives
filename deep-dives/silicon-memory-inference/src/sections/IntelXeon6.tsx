import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function IntelXeon6() {
  return (
    <SectionShell
      title="Intel Xeon 6 Granite Rapids"
      subtitle="Redwood Cove, AMX FP16, MRDIMM, and the M8i / R8i / X8i family"
      tldr={[
        'Granite Rapids uses the Redwood Cove P-core. The 6980P tops the performance tier at 128 cores.',
        'AMX (Advanced Matrix Extensions) adds BF16, INT8, and now FP16 as a new capability in this generation — the first Xeon to ship AMX FP16.',
        'MRDIMM DDR5-8800 is the memory bandwidth differentiator. Xeon 6 is the first AWS host platform to ship it.',
        'Tile architecture with MDF fabric plus per-tile CHA. SNC3 exposes the package as three sub-NUMA domains for latency-sensitive workloads.',
        'On AWS: M8i, R8i, and X8i — the last shipping up to 6 TB of memory per instance for extreme-capacity workloads.',
      ]}
      scope={[
        'Redwood Cove microarchitecture: front-end width, branch prediction, execution pipelines, L1 / L2.',
        'AMX: tile registers, TDP primitives, BF16 / INT8 / FP16 kernels, what runs on AMX vs what falls back.',
        'MDF mesh fabric and per-tile CHA home agents. EMIB connecting compute tiles.',
        'Sub-NUMA Clustering (SNC3): when to enable it, latency vs bandwidth trade-off.',
        'MRDIMM DDR5-8800 support: platform requirements, bandwidth uplift, cost.',
        'Instance families on AWS: M8i (general), R8i (memory-optimized), X8i (extreme memory, up to 6 TB).',
        'Workload fit: AMX-heavy small / medium model inference, memory-bandwidth-bound analytics, in-memory databases.',
      ]}
      panelistMap="AWS territory. Xeon 6 is where 'CPU can still do inference' stops being a joke, thanks to AMX FP16 and MRDIMM. Frame it against Graviton (energy) and EPYC (raw core count) so the host-silicon story is complete."
      evaluationLens={[
        'Does the inference workload emit AMX instructions at the target precision?',
        'Would MRDIMM bandwidth uplift materially change the throughput picture?',
        'Is SNC3 the right topology for the latency profile — or does the scheduler need one big NUMA domain?',
        'Is the workload capacity-bound to the point X8i beats all R-series alternatives?',
      ]}
    />
  );
}
