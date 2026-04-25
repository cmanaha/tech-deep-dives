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
import { ChipletPathDiagram } from '../components/ChipletPathDiagram';

interface ArchRow {
  vendor: string;
  fabric: string;
  composition: string;
  crossLatency: string;
}

const archRows: ArchRow[] = [
  {
    vendor: 'AMD EPYC Turin (Zen 5)',
    fabric: 'Infinity Fabric · GMI3-Wide',
    composition: 'Up to 16 CCDs (8c each) or 12 CCDs (16c each, Turin Dense) + 1 IO die. Each CCD has its own L3 (32 MB).',
    crossLatency: 'Intra-CCD ~45 ns; inter-CCD ~150 ns; cross-socket ~260 ns',
  },
  {
    vendor: 'Intel Xeon 6 (Granite Rapids 6900P)',
    fabric: 'Mesh + MDF + EMIB',
    composition: '3 compute tiles (Intel 3) + 2 IO dies (Intel 7) joined by EMIB. Mesh stops via CHA; cross-die via MDF at 2.5 GHz.',
    crossLatency: 'Local L3 ~33 ns; adjacent tile ~57 ns; two crossings ~80 ns',
  },
  {
    vendor: 'AWS Graviton4 (Neoverse V2)',
    fabric: 'Arm CMN-700 mesh',
    composition: '7 chiplets (1 compute + 4 DDR + 2 PCIe) at TSMC N4/N5. 96 cores share 36 MB SLC.',
    crossLatency: 'Cross-core 30-60 ns; cross-socket 138 ns',
  },
  {
    vendor: 'AWS Graviton5 (Neoverse V3)',
    fabric: 'Arm CMN-S3',
    composition: '192 cores in single socket; 192 MB distributed L3 (1 MB / core). NUMA eliminated — single socket.',
    crossLatency: '~33% lower inter-core vs Graviton4 (AWS claim)',
  },
  {
    vendor: 'NVIDIA Hopper / Blackwell GPU',
    fabric: 'NV-HBI · NVLink',
    composition: 'GH100 monolithic; GB100 (Blackwell) two reticles joined by NV-HBI. NVLink for inter-GPU.',
    crossLatency: 'Intra-package ns class via NV-HBI; NVLink GPU-to-GPU 1.8 TB/s',
  },
];

export function ChipletAndInterconnect() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The hop-by-hop path from a core to a memory controller is where 'queuing on chiplet' lives"
          >
            Chiplet and interconnect topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 4 said the working set lives in
            tiers; Section 5 said the tiers are touched in stages; this section says how
            the silicon physically connects those tiers. Modern server CPUs are not
            monolithic dies — they are assemblies of compute chiplets, IO dies, and
            interconnect fabrics. The path a memory load takes through that assembly
            determines a meaningful fraction of stage-5 latency in the kernel lifecycle.
          </Box>
          <Box variant="p">
            <strong>The recurring pattern.</strong> Every modern host architecture has
            three layers: a per-core or per-CCX local hierarchy (L1, L2, sometimes a
            slice of L3), a chip-wide fabric (mesh, ring, or ring-of-rings) that connects
            those local hierarchies, and a memory-controller boundary where the fabric
            hands off to DDR. The cost of a memory access is roughly the sum of the hops
            it takes through each layer. Architectures differ in how many hops they make,
            how those hops are routed, and what the silicon does when contention rises.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A worked example — Zen 5 core to DDR5 channel"
          >
            The hop-by-hop path on AMD Turin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ChipletPathDiagram />
          <Box variant="p">
            A load that misses L1 takes the full path: L1 → L2 → CCD-local L3 → GMI3-W
            link → IO die / Infinity Fabric mesh → UMC → DDR5. Each hop adds
            measurable latency. On Turin the measured numbers are L1D 4 cycles, L2 ~14
            cycles, L3 ~46 cycles (CCD-local), DRAM 130-140 ns NPS1
            {' ('}
            <Link
              external
              href="https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched"
            >
              Chips and Cheese — Turin launch
            </Link>
            , accessed 2026-04-23). The GMI3-W link is the chiplet-crossing point that
            most engineers miss when they reason about memory access. It is where
            &ldquo;queuing on chiplet&rdquo; happens — under heavy load, multiple CCDs
            contending for the IO die fabric and UMCs is the source of cross-CCD latency
            increases.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Five different answers to the same packaging problem"
          >
            How the major architectures compose
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={archRows}
            columnDefinitions={[
              { id: 'vendor', header: 'Architecture', cell: (r) => r.vendor, minWidth: 200 },
              { id: 'fabric', header: 'Fabric', cell: (r) => r.fabric },
              { id: 'comp', header: 'Composition', cell: (r) => r.composition },
              { id: 'lat', header: 'Cross-tile latency', cell: (r) => r.crossLatency },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            All measured numbers traceable to vendor docs or third-party measurement —
            see Sections 9-13 for direct citations per row.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The trade-offs each fabric makes"
          >
            What changes when you cross a chiplet boundary
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">CCD-private L3 (AMD)</Box>
              <Box variant="p">
                Each CCD owns 32 MB of L3 that is fast (~46 cycles) for any core inside
                that CCD. Crossing a CCD means traversing GMI3-W, traversing the IO
                die, and re-entering another CCD&apos;s L3 — adding ~100 ns. The
                payoff: per-CCX L3 bandwidth is high (Turin ~261 GB/s per core measured
                aggregate). The cost: cross-CCD core-to-core latency is ~150 ns. AMD
                NUMA-per-socket modes (NPS2 / NPS4) let the OS pin threads near the
                memory they touch.
              </Box>
            </div>
            <div>
              <Box variant="h3">Mesh-distributed L3 (Intel, ARM)</Box>
              <Box variant="p">
                L3 is sliced across a 2D mesh; the local stop&apos;s slice serves the
                core, and remote slices add a hop per stop. Intel Xeon 6&apos;s mesh
                runs CHA at 2.5 GHz with MDF at the die boundaries; per-core L3
                bandwidth is ~30 GB/s — far lower than per-CCX L3 on AMD, but the L3 is
                shared and uniform across cores. ARM CMN-700 / CMN-S3 follow the same
                pattern. The cost: mesh congestion is the dominant constraint at high
                core counts.
              </Box>
            </div>
            <div>
              <Box variant="h3">EMIB and silicon bridges (Intel)</Box>
              <Box variant="p">
                Intel Xeon 6 6900P joins three compute tiles and two IO dies through
                EMIB — embedded silicon bridges in the substrate. EMIB is cheaper than a
                full silicon interposer but supports high-density signals. The
                cross-die hop adds ~24 ns per boundary. The architectural choice was
                to put the L3 on the compute tiles (so cross-die means cross-L3) rather
                than on the IO dies.
              </Box>
            </div>
            <div>
              <Box variant="h3">NV-HBI and reticle stitching (NVIDIA)</Box>
              <Box variant="p">
                NVIDIA Blackwell joins two reticle-sized dies through NV-HBI to form
                GB100 — a single coherent &ldquo;GPU&rdquo; from the programmer&apos;s
                perspective. NV-HBI is bandwidth-class (10 TB/s aggregate stated by
                NVIDIA at announcement) and adds ns-class latency. The result: a 208B
                transistor chip presented as one unit, while individually each die fits
                under reticle limits.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The invisible cost most engineers miss"
          >
            Queuing at chiplet boundaries
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A subtle point that shows up in production tail latency profiles. When
            multiple cores on different CCDs / tiles all access memory through a shared
            IO die, the GMI links and the IO-die fabric become congestion points.
            Load latency under contention can be 1.5-2× the unloaded latency, and the
            distribution gets long-tailed. AMD&apos;s NPS modes and Intel&apos;s SNC3
            mode both exist to give the OS a way to keep work and memory on the same
            chiplet — eliminating the cross-chiplet hop and the queuing tax it carries.
          </Box>
          <Alert type="info">
            For capital-markets workloads where p99.9 tick-to-trade is the metric,
            chiplet topology is rarely the headline number but is often the binding
            constraint. NUMA-pinning threads, isolating the latency-sensitive process
            from neighbors, and choosing a sub-NUMA mode (NPS2 / NPS4 / SNC3) are the
            three levers that recover the worst-case tail.
          </Alert>
          <ExpandableSection headerText="Snoop filter cost on ARM CMN-700">
            <Box variant="p">
              ARM&apos;s CMN-700 snoop filter must be at least 1.5× the aggregate L2
              capacity. For Graviton4 with 96 cores × 2 MB L2 = 192 MB exclusive L2,
              the snoop filter eats ~288 MB of mesh storage — comparable in area to the
              36 MB SLC itself. AMD reclaims this budget with shadow tags. Graviton5
              moved to CMN-S3, which AWS says delivers ~33% lower inter-core latency,
              and to a 192 MB distributed L3 that doubles as effective coherence
              storage.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
