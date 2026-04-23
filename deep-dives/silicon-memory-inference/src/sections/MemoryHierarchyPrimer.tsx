import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function MemoryHierarchyPrimer() {
  return (
    <SectionShell
      title="Memory Hierarchy Primer"
      subtitle="Seven tiers from register file to disaggregated memory"
      tldr={[
        'The modern memory hierarchy has at least seven tiers: registers, SRAM scratchpads, L1/L2, LLC, HBM, DDR5/MRDIMM/LPDDR5X, and disaggregated memory via CXL.',
        'Each tier differs in bandwidth, latency, capacity, and cost per bit by roughly an order of magnitude from the one above it.',
        'Inference workloads spend most of their time in the HBM or DDR tier — that is where the bandwidth wall lives.',
        'Compiler-managed scratchpads (SMEM, TMEM, SBUF, PSUM) are the most important tier people forget exists.',
      ]}
      scope={[
        'Register file sizing and bandwidth per core and per SM.',
        'SRAM scratchpads: SMEM (Hopper), TMEM (Blackwell, 256 KB per SM), SBUF / PSUM (Trainium).',
        'L1, L2, LLC per architecture with citations.',
        'HBM generations: HBM3, HBM3e, HBM3e+, HBM4, with capacity and pin speed per stack.',
        'DDR5, MRDIMM (DDR5-8800), LPDDR5X — why server DRAM is not one thing.',
        'CXL 2.0 pooling vs CXL 3.0 sharing — capacity extension, not latency reduction.',
        'STREAM benchmark, per-core bandwidth regressions as core counts scale.',
      ]}
      panelistMap="Sets the vocabulary everyone else is using. Cerebras leans on the register-and-SRAM tiers at wafer scale. HyperCIM collapses the hierarchy into a single compute-in-memory substrate. AWS instances sit across all seven tiers and force the architect to reason about which tier the working set fits in."
      evaluationLens={[
        'Which tier does the working set actually fit in — and what is the bandwidth at that tier?',
        'Is the scratchpad compiler-managed or hardware-managed? Who owns eviction?',
        'Does the claimed peak bandwidth survive at the per-core or per-SM level, or is it an aggregate that only a full-chip benchmark hits?',
        'When the workload spills, where does it spill to — and how much latency does that cost?',
      ]}
    />
  );
}
