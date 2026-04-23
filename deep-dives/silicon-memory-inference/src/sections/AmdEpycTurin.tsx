import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function AmdEpycTurin() {
  return (
    <SectionShell
      title="AMD EPYC Turin (Zen 5)"
      subtitle="12 CCDs, native 512-bit AVX-512, and the M8a / R8a / C8a family"
      tldr={[
        'Turin uses Zen 5 cores; Turin Dense uses Zen 5c with more cores at lower clock. Both share the chiplet topology: up to 12 CCDs plus an IO die over GMI3-Wide.',
        'Native 512-bit AVX-512 datapath — not the double-pumped 256-bit path of Zen 4. This is a real vector uplift for AI / HPC kernels.',
        'On AWS: M8a, R8a, C8a for general / memory / compute; M8azn for 5 GHz latency-sensitive workloads.',
        'No MRDIMM support. Memory bandwidth story relies on high DDR5 pin speed plus 12-channel configuration.',
      ]}
      scope={[
        'Zen 5 vs Zen 5c microarchitecture — shared ISA, different frequency and density trade-off.',
        'Chiplet topology: 12 CCDs plus IO die, GMI3-Wide link widths, CCX sizing, L3 per CCD.',
        'AVX-512 datapath: native 512-bit execution, impact on BF16 / INT8 kernels and matmul.',
        'Memory subsystem: 12 DDR5 channels, no MRDIMM, per-channel bandwidth envelope.',
        'Instance families on AWS: M8a, R8a, C8a, M8azn (5 GHz), availability and intended workloads.',
        'Where EPYC wins: AVX-512-dense HPC, raw core-count workloads, memory-capacity (2 TB class).',
        'Where EPYC struggles: workloads that would have benefited from MRDIMM or AMX.',
      ]}
      panelistMap="AWS territory. EPYC is the chiplet poster child — use it to ground the chiplet-and-interconnect section. Interesting contrast with Graviton: EPYC is monolithic-feeling at core level but chiplet-assembled at package level, while Graviton uses a mesh-native approach."
      evaluationLens={[
        'Does the workload actually emit 512-bit AVX-512, or is the kernel scalar or 256-bit?',
        'Is the working set sensitive to per-core L3, or is it streaming past the cache?',
        'Would MRDIMM have helped? If yes, Xeon 6 is the better target.',
        'How many CCDs does the thread land on, and does NUMA placement matter for this workload?',
      ]}
    />
  );
}
