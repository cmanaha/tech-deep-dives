import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function MainMemoryAndCxl() {
  return (
    <SectionShell
      title="DDR5, MRDIMM, LPDDR5X, and CXL"
      subtitle="Main memory and expansion — capacity first, latency second"
      tldr={[
        'DDR5 is the commodity server DRAM substrate. Speeds have climbed from 4800 MT/s in early designs toward 6400 and 7200 MT/s as platforms mature.',
        'MRDIMM (Multiplexed-Rank DIMM) is a DDR5 overlay that multiplexes two ranks on the same bus at speeds approaching 8800 MT/s on Xeon 6 platforms.',
        'LPDDR5X sits on Grace, mobile SoCs, and edge accelerators — high bandwidth per pin at low voltage, on-package or soldered.',
        'CXL 2.0 enables memory pooling across hosts; CXL 3.0 enables memory sharing. Both add capacity, not speed. Latency is worse than local DRAM by a factor of 2–3x.',
      ]}
      scope={[
        'DDR5 fundamentals: banks, refresh, on-DIMM ECC, rank interleaving, JEDEC speed grades.',
        'MRDIMM architecture: rank multiplexing, buffer behavior, who supports it (Xeon 6 does; Turin does not).',
        'LPDDR5X: bandwidth per pin, package constraints, why it is attractive for Grace-class CPUs.',
        'CXL 2.0 memory pooling — capacity extension across a rack, who sees which region, coherence model.',
        'CXL 3.0 memory sharing — multi-host coherent memory, fabric attached memory.',
        'Latency cost of CXL vs local DRAM: typical added round-trip, why HFT path does not touch CXL.',
        'When CXL is the right answer: analytics, backtest, large in-memory caches, swap for LLM weights.',
      ]}
      panelistMap="AWS-friendly territory for capacity-bound workloads (X8i ships up to 6 TB local). CXL frames are where you correct the hype — call out that capacity does not imply latency. Cerebras and HyperCIM sidestep the problem by collapsing the hierarchy."
      evaluationLens={[
        'Does the workload need capacity or latency? Pick the memory tier accordingly.',
        'Is the proposed solution adding bytes where the bottleneck is actually bandwidth or latency?',
        'Does MRDIMM meaningfully help the target kernel, or is the workload already cache-resident?',
        'Is CXL being used for cold/warm data (good fit) or hot path (bad fit)?',
      ]}
    />
  );
}
