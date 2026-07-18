import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { MemoryHierarchyTower } from '../components/MemoryHierarchyTower';

interface TierCompareRow {
  tier: string;
  hostExample: string;
  gpuExample: string;
  trainiumExample: string;
}

const compareRows: TierCompareRow[] = [
  {
    tier: '1. Register file',
    hostExample: 'Per-core register file',
    gpuExample: '256 KB register file per SM',
    trainiumExample: 'Tensor-engine operand registers',
  },
  {
    tier: '2. SRAM scratchpad',
    hostExample: '—',
    gpuExample: 'SMEM (Hopper ≈ 228 KB/SM); TMEM (Blackwell 256 KB/SM)',
    trainiumExample: 'SBUF (state buffer), PSUM (partial sum)',
  },
  {
    tier: '3. L1 cache',
    hostExample: 'Per-core L1D (typ. 48-64 KB)',
    gpuExample: 'L1 shares capacity with SMEM',
    trainiumExample: '— (compiler-managed; no conventional L1)',
  },
  {
    tier: '4. L2 cache',
    hostExample: 'Xeon 6: 2 MB per-core private L2',
    gpuExample: 'Device-wide L2 (H100: 50 MB; H200: 50 MB)',
    trainiumExample: '—',
  },
  {
    tier: '5. LLC / L3',
    hostExample: 'Shared LLC (dozens to hundreds of MB)',
    gpuExample: '(merged into L2 on current GPUs)',
    trainiumExample: '—',
  },
  {
    tier: '6. HBM or main DRAM',
    hostExample: 'DDR5, MRDIMM (DDR5-8800), LPDDR5X',
    gpuExample: 'HBM3 (H100), HBM3e (H200, B200, B300)',
    trainiumExample: 'HBM stacks on Trainium2 / Trainium3',
  },
  {
    tier: '7. Disaggregated / expansion',
    hostExample: 'CXL 2.0 pooling, CXL 3.0 sharing',
    gpuExample: 'NVLink-addressable remote HBM',
    trainiumExample: 'SBUF / HBM on neighboring NeuronCores via CC-Cores',
  },
];

export function MemoryHierarchyPrimer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The seven tiers you need to reason about before placing any workload"
          >
            Memory hierarchy primer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why a primer.</strong> Every architecture in this deep dive is, at one
            level, an opinionated answer to the question &ldquo;where do the operands live
            when the unit executes?&rdquo; Before you can compare answers you need a shared
            map of the tiers. The modern inference-capable system touches at least seven,
            and per-tier bandwidth, latency, and capacity differ by roughly an order of
            magnitude from the tier above.
          </Box>
          <Box variant="p">
            <strong>What is new about it.</strong> Two of the seven tiers — SRAM scratchpads
            and disaggregated / expansion memory — are the tiers most often missed in
            casual architecture conversations. They are also the two tiers where the 2026
            silicon landscape does the most interesting work. The scratchpad tier is where
            Trainium hides its memory story; the disaggregated tier is where CXL and
            NVLink-remote HBM change the capacity-vs-latency tradeoff.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The full hierarchy with representative numbers per tier"
          >
            The seven-tier map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MemoryHierarchyTower />
          <Box variant="small">
            Numbers on the diagram are representative; the per-silicon exact figures carry
            Tier 1 citations in Sections 6 (HBM), 7 (DDR/MRDIMM/CXL), 12-13 (NVIDIA), and
            15 (AWS Trainium). H100 / H200 capacities track the{' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
              NVIDIA H200 product page
            </Link>
            ; Xeon 6 per-core L2 tracks the{' '}
            <Link
              external
              href="https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html"
            >
              Intel Xeon 6 product brief
            </Link>
            {' '}(both accessed 2026-04-23).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Same tier numbering, one column per architecture class">
            How the three families use the hierarchy
          </Header>
        }
      >
        <Table
          items={compareRows}
          columnDefinitions={[
            { id: 'tier', header: 'Tier', cell: (r) => r.tier, minWidth: 160 },
            { id: 'host', header: 'Host CPU', cell: (r) => r.hostExample },
            { id: 'gpu', header: 'NVIDIA GPU', cell: (r) => r.gpuExample },
            { id: 'trn', header: 'AWS Trainium', cell: (r) => r.trainiumExample },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The tier that surprises people, and the ownership question underneath it"
          >
            Scratchpads — the tier most often forgotten
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Tier 2 — the on-chip SRAM scratchpad — is where modern accelerators do their
            real work, and it is the tier people forget exists. A scratchpad is not a
            cache: the compiler (or the programmer) explicitly decides what lives there
            and when. That responsibility is precisely what lets a Trainium systolic array
            run at near-peak without a cache coherence protocol, and what lets a Blackwell
            tensor core use TMEM as a staging buffer in front of tcgen05.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Hopper SMEM</Box>
              <Box variant="p">
                Shared memory per SM, roughly 228 KB, partially fused with L1. Used by
                CUTLASS and Triton to stage tensor-core tiles. Programmer-visible via CUDA
                cooperative-groups and async-copy intrinsics.
              </Box>
            </div>
            <div>
              <Box variant="h3">Blackwell TMEM</Box>
              <Box variant="p">
                256 KB per SM of tensor-memory dedicated to tcgen05 operand staging —
                distinct from SMEM. Introduced on Blackwell as the place where tensor-core
                tiles live across a matmul. Section 13 carries the verified datasheet
                numbers.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trainium SBUF + PSUM</Box>
              <Box variant="p">
                SBUF holds activations and weights the Neuron compiler has staged; PSUM
                holds partial sums from the systolic array before write-back. Section 17
                carries sizing and bandwidth numbers.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Who owns eviction decides what performance bugs look like"
          >
            Caches vs scratchpads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Caches (tiers 3-5) are hardware-managed. The CPU decides when to evict lines
            based on its replacement policy and the programmer just reads and writes memory.
            Scratchpads (tier 2) are software-managed. The compiler emits explicit copy-in
            and copy-out instructions and commits to which bytes are resident at which
            time. This is not a cosmetic distinction.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Cache miss</Box>
              <ul>
                <li>Invisible to the compiler</li>
                <li>Shows up as tail latency at runtime</li>
                <li>Mitigation is hardware prefetch, larger caches, NUMA locality</li>
                <li>Classic debugging is a profiler run after the fact</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Scratchpad miss</Box>
              <ul>
                <li>Cannot happen at runtime — the compiler already decided</li>
                <li>
                  Shows up as a schedule slip at compile time (Trainium) or a lower
                  occupancy kernel (GPU)
                </li>
                <li>Mitigation is re-tiling the operator at compile time</li>
                <li>Debugging happens in the compiler IR, not the profiler</li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where inference workloads actually spend their time"
          >
            The bandwidth wall lives at tier 6
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A modern inference accelerator pairs ~4-8 TB/s of HBM bandwidth with thousands
            of TFLOPs of tensor performance — ratios that put the ridge point out of reach
            of decode workloads (Section 3). Raising HBM bandwidth is expensive: HBM is
            2.5D-packaged with through-silicon vias and a silicon interposer, pin speed is
            limited by signal integrity over the stack, and every generation requires new
            packaging and yield work. Section 6 digs into HBM in depth.
          </Box>
          <Alert type="info" header="CXL sits at tier 7 — capacity lever, not latency lever">
            CXL 2.0 pooling and CXL 3.0 sharing attach TBs of memory to a single socket
            over a PCIe-class physical layer, extending capacity beyond what DDR DIMMs can
            hold. They do not reduce latency over a direct DDR channel — in fact they
            modestly increase it. For latency-sensitive workloads CXL is the wrong lever.
            For capacity-limited workloads (large recommender embeddings, in-memory
            analytics, sparse retrieval indexes) it is the right one. Section 7 walks DDR5,
            MRDIMM, LPDDR5X, and CXL in more detail.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A subtle generation-over-generation effect on the host side"
          >
            The per-core bandwidth regression
          </Header>
        }
      >
        <ExpandableSection
          headerText="Why adding cores can make a workload slower per-thread"
          defaultExpanded
        >
          <SpaceBetween size="s">
            <Box variant="p">
              Socket bandwidth rises each generation, but core count rises faster. Divide
              peak socket bandwidth by core count and per-core bandwidth generally drops.
              Workloads that are bandwidth-hungry per thread — databases, GC-heavy JVM
              services, some memory-intensive analytics — can land worse on the higher
              core count chip despite looking faster on the headline spec.
            </Box>
            <Box variant="p">
              Section 9 carries the measured Graviton4 → Graviton5 transition; the same
              effect shows up on EPYC Turin (Section 10) and Xeon 6 (Section 11). The
              practical implication: for workloads that stress tier 6 per thread,
              &ldquo;more cores&rdquo; is not obviously faster. Pay attention to bandwidth
              per vCPU, not socket bandwidth in aggregate.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
