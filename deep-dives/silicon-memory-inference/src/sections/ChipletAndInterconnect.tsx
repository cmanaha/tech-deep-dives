import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function ChipletAndInterconnect() {
  return (
    <SectionShell
      title="Chiplet and Interconnect Topology"
      subtitle="The hop-by-hop path a load takes from core to memory"
      tldr={[
        'Monolithic dies are rare above the mid range. Modern server silicon is an assembly of chiplets over an interposer, package substrate, or silicon bridge.',
        'The path from a core to DRAM crosses several fabrics: intra-CCD mesh, inter-die link, IO die, and memory controller. Each adds latency.',
        'Which chiplet your thread lands on matters. NUMA is not dead — it just moved inside the package.',
        'Coherence, ordering, and queuing at the chiplet boundary are the hidden source of tail latency.',
      ]}
      scope={[
        'AMD EPYC Turin: 12 CCDs plus IO die, GMI3-Wide links, Zen 5 core → L1D → L2 → L3 → GMI → IOD → UMC → DDR5.',
        'Intel Xeon 6 Granite Rapids: compute tiles over EMIB, MDF fabric, CHA per tile, Redwood Cove core → L1D → L2 → local tile L3 via mesh → MDF → adjacent tile → memory controller → DDR5 or MRDIMM.',
        'AWS Graviton: Neoverse V2 on Graviton4 with CMN-700, Neoverse V3 on Graviton5 with CMN-S3, 192 MB distributed L3.',
        'NVIDIA Blackwell: NV-HBI reticle bridge fusing two dies into one logical GPU, TMEM on each SM, HBM3e stacks on package.',
        'NVIDIA Grace-Blackwell Superchip: NVLink-C2C at 900 GB/s coherent, LPDDR5X on Grace, HBM3e on Blackwell.',
        'NUMA vs NPS vs SNC — how each vendor exposes topology to the OS and to the scheduler.',
        'Coherence protocol snoop filters, home agents, and directory lookups as silent tail-latency contributors.',
      ]}
      panelistMap="AWS is the natural voice here — we ship the chiplet heterogeneity (Graviton, EPYC, Xeon) and we can name the per-hop cost. Cerebras sidesteps the problem entirely by putting compute and memory on one die. HyperCIM sidesteps it by making memory the compute substrate."
      evaluationLens={[
        'How many hops from core to memory, and what is the latency of each hop?',
        'Is the workload chiplet-aware — will the scheduler keep threads on the right die?',
        'Does the coherence protocol scale at the package level, or does snoop traffic dominate at high core count?',
        'When throughput spikes, where does the queue form — at the L3, at the fabric, at the memory controller?',
      ]}
    />
  );
}
