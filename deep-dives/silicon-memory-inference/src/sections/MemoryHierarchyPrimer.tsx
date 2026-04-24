import React from 'react';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { SectionShell } from '../components/SectionShell';

interface TierRow {
  tier: string;
  hostExample: string;
  gpuExample: string;
  trainiumExample: string;
  bandwidth: string;
  capacity: string;
}

const tierRows: TierRow[] = [
  {
    tier: '1. Register file',
    hostExample: 'Core register file (~10s of KB per core)',
    gpuExample: 'SM register file (256 KB per SM)',
    trainiumExample: 'Tensor engine operand registers',
    bandwidth: 'Effectively free — one operand per clock per lane',
    capacity: 'KBs',
  },
  {
    tier: '2. On-chip SRAM / scratchpad',
    hostExample: '—',
    gpuExample: 'SMEM (Hopper, 228 KB/SM), TMEM (Blackwell, 256 KB/SM)',
    trainiumExample: 'SBUF state buffer, PSUM partial-sum buffer',
    bandwidth: '10s of TB/s per SM or engine',
    capacity: 'Hundreds of KB per SM / engine',
  },
  {
    tier: '3. L1 cache',
    hostExample: 'Per-core L1D (typically 48-64 KB)',
    gpuExample: 'L1 shares capacity with SMEM',
    trainiumExample: '(compiler-managed; no conventional L1)',
    bandwidth: '~100s GB/s per core or SM',
    capacity: '~48-64 KB per core',
  },
  {
    tier: '4. L2 cache',
    hostExample: 'Per-core private L2 (Xeon 6: 2 MB/core)',
    gpuExample: 'Device-wide L2 (H100: 50 MB, H200: 50 MB)',
    trainiumExample: '—',
    bandwidth: '~TB/s aggregate',
    capacity: 'MBs per core (CPU) or chip-wide (GPU)',
  },
  {
    tier: '5. LLC / L3',
    hostExample: 'Shared LLC (Graviton5, EPYC, Xeon — dozens to hundreds of MB)',
    gpuExample: '(merged into L2 on current GPUs)',
    trainiumExample: '—',
    bandwidth: 'Hundreds of GB/s',
    capacity: '100-500 MB',
  },
  {
    tier: '6. HBM or main DRAM',
    hostExample: 'DDR5, MRDIMM (DDR5-8800), LPDDR5X',
    gpuExample: 'HBM3 (H100) / HBM3e (H200, B200/B300)',
    trainiumExample: 'HBM stacks on Trainium2 / Trainium3',
    bandwidth: 'TB/s (HBM) or 100s GB/s per socket (DDR)',
    capacity: '10s GB (HBM) to TBs (DDR)',
  },
  {
    tier: '7. Disaggregated / expansion',
    hostExample: 'CXL 2.0 pooled memory, CXL 3.0 shared memory',
    gpuExample: 'NVLink-addressable remote HBM',
    trainiumExample: 'SBUF/HBM on neighboring NeuronCores via CC-Cores',
    bandwidth: '10s-100s GB/s',
    capacity: 'TBs (CXL) to GB-class per neighbor',
  },
];

export function MemoryHierarchyPrimer() {
  return (
    <SectionShell
      status="draft"
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
    >
      <SpaceBetween size="l">
        <Header variant="h2">The seven tiers</Header>
        <Box variant="p">
          The hierarchy below is the union of the tiers that any modern inference system
          touches. No single workload uses all seven, but the architect needs the full map to
          reason about where the working set lives and where it spills. Capacities and
          bandwidths are representative; per-silicon exact figures live in sections 5, 6, and
          8-16 with direct vendor citations.
        </Box>
        <Table
          items={tierRows}
          columnDefinitions={[
            { id: 'tier', header: 'Tier', cell: (r) => r.tier },
            { id: 'host', header: 'Host CPU', cell: (r) => r.hostExample },
            { id: 'gpu', header: 'NVIDIA GPU', cell: (r) => r.gpuExample },
            { id: 'trn', header: 'AWS Trainium', cell: (r) => r.trainiumExample },
            { id: 'bw', header: 'Representative bandwidth', cell: (r) => r.bandwidth },
            { id: 'cap', header: 'Representative capacity', cell: (r) => r.capacity },
          ]}
          variant="embedded"
          wrapLines
        />
        <Box variant="small">
          Vendor citations for per-tier figures are in the silicon sections. H100 / H200 L2
          capacity and HBM bandwidth figures track the{' '}
          <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
            NVIDIA H200 product page
          </Link>
          {' '}(accessed 2026-04-23). Intel Xeon 6 2 MB/core private L2 tracks the{' '}
          <Link
            external
            href="https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html"
          >
            Intel Xeon 6 product brief
          </Link>
          {' '}(accessed 2026-04-23).
        </Box>

        <Header variant="h2">The tier that surprises people: scratchpads</Header>
        <Box variant="p">
          Tier 2 is the tier most often missed in casual architecture conversations, and it is
          the tier that determines how much performance modern accelerators extract. Unlike a
          cache, a scratchpad is software-managed — the compiler (or the programmer) decides
          what lives there and when. That responsibility is what lets a Trainium systolic
          array run at near-peak without a cache coherence protocol, and what lets a Blackwell
          tensor core use TMEM as a staging buffer in front of tcgen05.
        </Box>
        <Box variant="p">
          On NVIDIA Hopper, SMEM sits at ~228 KB per SM and is shared with L1; on Blackwell
          there is an additional TMEM block of 256 KB per SM dedicated to tensor-core operand
          staging. On Trainium, SBUF and PSUM are the entire game — SBUF holds activations and
          weights the compiler has staged, PSUM holds partial sums from the systolic array
          before they are written back. Software that fails to exploit the scratchpad tier
          ends up doing &quot;unnecessary round trips to HBM&quot;, which is the polite phrase
          for performance collapse.
        </Box>

        <Header variant="h2">Caches vs scratchpads — who owns eviction</Header>
        <Box variant="p">
          Caches (tiers 3-5) are hardware-managed: the CPU decides when to evict lines based on
          replacement policy, and the programmer just reads and writes memory. Scratchpads
          (tier 2) are software-managed: the compiler emits explicit copy-in and copy-out
          instructions and commits to which bytes are resident at which time. This ownership
          distinction is not cosmetic — it changes what performance bugs look like. A cache
          miss is invisible to the compiler and shows up as tail latency. A scratchpad miss
          does not exist; instead, a compiler that misplans will emit a plan that simply does
          not reach peak throughput, and the slowdown is visible in the schedule before the
          kernel even runs.
        </Box>

        <Header variant="h2">The bandwidth wall lives at tier 6</Header>
        <Box variant="p">
          Tier 6 is where inference workloads spend most of their time, and tier 6 is where
          the &quot;bandwidth wall&quot; lives. A modern inference accelerator pairs ~4-8 TB/s
          of HBM bandwidth with thousands of TFLOPs of tensor performance — ratios that put
          the ridge point out of reach of decode workloads (see Section 3). Raising HBM
          bandwidth is expensive: HBM is 2.5D-packaged with TSVs and a silicon interposer,
          and the pin speed is limited by signal integrity over the stack. HBM3 runs at 6.4
          Gbps/pin; HBM3e pushes to 8-9 Gbps/pin; HBM4 raises both pin speed and channel
          count. Each generation requires new packaging and yield work, which is why HBM
          supply is a first-order commercial variable for the whole accelerator market.
        </Box>
        <Alert type="info" header="CXL is at tier 7 — it is the capacity lever, not the latency lever">
          CXL 2.0 pooling and CXL 3.0 sharing sit on top of tier 6. They extend capacity —
          you can attach TBs of memory to a single socket over a PCIe-class physical layer —
          but they add latency over a direct DDR channel. For latency-sensitive workloads CXL
          is the wrong lever; for capacity-limited workloads (large recommender embeddings,
          in-memory analytics) it is the right one. Section 6 digs into DDR5, MRDIMM, LPDDR5X,
          and CXL in more detail.
        </Alert>

        <Header variant="h2">The per-core-bandwidth regression</Header>
        <Box variant="p">
          A subtle point that changes architecture decisions on the host side: as core counts
          rise generation over generation, the peak socket bandwidth rises more slowly than
          the core count, so per-core bandwidth actually drops. A 96-core Graviton4 and a
          192-core Graviton5 divided by their respective socket bandwidths produce different
          per-core budgets, and workloads that are bandwidth-hungry per thread (databases,
          Java GC-heavy services) can land worse on the higher-core-count chip despite
          looking faster on paper. Section 8 covers the Graviton4 → Graviton5 transition
          with measured numbers; the same effect is present on EPYC Turin and Xeon 6.
        </Box>
      </SpaceBetween>
    </SectionShell>
  );
}
