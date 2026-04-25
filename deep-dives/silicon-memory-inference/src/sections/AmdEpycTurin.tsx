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
import { EpycTurinTopology } from '../components/EpycTurinTopology';

interface SkuRow {
  sku: string;
  ccd: string;
  cores: string;
  l3: string;
  notes: string;
}

const skuRows: SkuRow[] = [
  { sku: 'EPYC 9755 (Turin)', ccd: '16 CCDs × 8 Zen 5', cores: '128', l3: '512 MB', notes: 'Flagship. 650 MB total cache (L1+L2+L3).' },
  { sku: 'EPYC 9965 (Turin Dense)', ccd: '12 CCDs × 16 Zen 5c', cores: '192', l3: '384 MB', notes: 'Density flagship — most cores per socket on EPYC.' },
  { sku: 'EPYC 9355P (Turin)', ccd: '8 CCDs × 4 Zen 5', cores: '32', l3: '256 MB', notes: 'High clock per core; 8 MB L3 per core.' },
];

interface LatencyRow {
  point: string;
  value: string;
}

const latencyRows: LatencyRow[] = [
  { point: 'L1D', value: '4 cycles (~0.8 ns at 5 GHz)' },
  { point: 'L2', value: '~14 cycles (~3 ns at 4.5 GHz)' },
  { point: 'L3 (CCD-local)', value: '~46 cycles (~10 ns at 4.5 GHz)' },
  { point: 'DRAM (NPS1)', value: '~130-140 ns' },
  { point: 'DRAM (NPS0 uniform)', value: '>220 ns' },
  { point: 'Core-to-core (intra-CCD)', value: '~45 ns' },
  { point: 'Core-to-core (inter-CCD)', value: '~150 ns' },
  { point: 'Socket-to-socket (2P)', value: '~260 ns' },
];

export function AmdEpycTurin() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Zen 5 chiplet server CPU — 12 CCDs around an IO die, native AVX-512, no MRDIMM"
          >
            AMD EPYC Turin (Zen 5)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Turin is.</strong> The 5th generation EPYC server line, built
            on the Zen 5 microarchitecture. Two flavors: Turin proper (Zen 5 cores, 8
            cores per CCD, up to 128 cores per socket) and Turin Dense (Zen 5c cores,
            16 cores per CCD, up to 192 cores per socket). Both share the IO die and
            the Infinity Fabric topology; they differ in CCD core density and clock.
          </Box>
          <Box variant="p">
            <strong>What changed from Genoa (Zen 4).</strong> Native 512-bit AVX-512
            datapath (Zen 4 had double-pumped 256-bit), L1D doubled to 48 KB / 12-way,
            L2 doubled to 1 MB / 16-way, GMI3-Wide doubled CCD-to-IOD bandwidth, max
            DDR5 speed jumped from 4800 to 6400, and outstanding L1 miss tracking went
            from 24 to 124 (5.2× memory-level parallelism). This is the biggest Zen
            generation since Zen 2 in terms of microarchitectural depth
            ({' '}
            <Link
              external
              href="https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024"
            >
              Chips and Cheese — Zen 5 at Hot Chips 2024
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>What did not change.</strong> No MRDIMM support. AMD&apos;s product
            page explicitly omits MRDIMM and the company has stated they are waiting
            for full JEDEC standardization. Turin-X with 3D V-Cache was never launched
            for the 9005 generation — AMD is skipping straight to Venice-X (2026).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The chiplet layout — 12 CCDs orbiting one IO die"
          >
            Topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <EpycTurinTopology />
          <Box variant="p">
            The IO die (TSMC 6 nm) hosts 12 Unified Memory Controllers (one per DDR5
            channel), 16 GMI ports (two per CCD via GMI3-Wide), 8 combo I/O links
            (16 lanes each at 32 GT/s — used for PCIe 5 or xGMI socket-to-socket), and
            the Infinity Fabric mesh that ties everything together. Every CCD talks to
            the IOD over GMI3-W at 64 bytes/cycle bidirectional. The CCDs are
            individually built at TSMC N3 / N4 (varies by SKU) and contain 8 cores
            (Zen 5) or 16 cores (Zen 5c) plus 32 MB of L3 organized as a single CCX.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Per-core, per-tile, and cross-tile measurements that anchor expectations"
          >
            Memory hierarchy and latencies
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={latencyRows}
            columnDefinitions={[
              { id: 'pt', header: 'Access point', cell: (r) => r.point, minWidth: 200 },
              { id: 'val', header: 'Latency', cell: (r) => r.value },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            All measurements from{' '}
            <Link
              external
              href="https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched"
            >
              Chips and Cheese — Turin launch
            </Link>
            {' '}and{' '}
            <Link
              external
              href="https://chipsandcheese.com/p/evaluating-uniform-memory-access"
            >
              Chips and Cheese — UMA Turin
            </Link>
            , accessed 2026-04-23.
          </Box>
          <Alert type="info" header="NUMA modes (NPS) are the operational lever">
            Turin exposes NPS0 / NPS1 / NPS2 / NPS4 plus L3CAN. NPS0 (uniform interleave
            across all 12 channels with no NUMA partitioning) measures &gt;220 ns
            DRAM latency — about 90 ns over NPS1. NPS2 / NPS4 partition the socket into
            2 / 4 NUMA domains and recover most of the locality. For latency-sensitive
            workloads NPS4 is the default choice; for general workloads NPS1 (default).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three SKU shapes for three workload profiles"
          >
            SKU lineup
          </Header>
        }
      >
        <Table
          items={skuRows}
          columnDefinitions={[
            { id: 'sku', header: 'SKU', cell: (r) => r.sku, minWidth: 220 },
            { id: 'ccd', header: 'CCD layout', cell: (r) => r.ccd },
            { id: 'cores', header: 'Cores', cell: (r) => r.cores },
            { id: 'l3', header: 'Total L3', cell: (r) => r.l3 },
            { id: 'notes', header: 'Notes', cell: (r) => r.notes },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="On AWS: M8a, R8a, C8a, M8azn"
          >
            EPYC Turin on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">M8a / R8a / C8a</Box>
              <Box variant="p">
                General-purpose, memory-optimized, and compute-optimized variants
                respectively. Built on Turin (Zen 5). DDR5-6400 host memory. Standard
                AMD-platform EC2 lineup, replacing M7a / R7a / C7a.
              </Box>
            </div>
            <div>
              <Box variant="h3">M8azn — high frequency</Box>
              <Box variant="p">
                Variant tuned for clock-speed-sensitive workloads, 5 GHz boost. Targets
                the latency-bounded slice of capital-markets and FPGA-host workloads
                where wall-clock per request matters more than core count.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            Instance details from{' '}
            <Link external href="https://aws.amazon.com/ec2/instance-types/">
              AWS EC2 instance types
            </Link>
            , accessed 2026-04-23.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Turin wins, where it does not"
          >
            Workload fit
          </Header>
        }
      >
        <ExpandableSection headerText="Where Turin wins" defaultExpanded>
          <ul>
            <li>Native 512-bit AVX-512 — kernels that emit 512-bit are the obvious win</li>
            <li>HPC and memory-streaming workloads that benefit from per-CCX L3 (~261 GB/s per core measured aggregate)</li>
            <li>High core-count cloud-native workloads on Turin Dense (192 cores)</li>
            <li>Capacity-heavy databases (up to 6 TB DRAM per socket)</li>
            <li>Workloads that fit working set in 4 MB / core (Turin proper) or 2 MB / core (Turin Dense)</li>
          </ul>
        </ExpandableSection>
        <ExpandableSection headerText="Where Turin struggles">
          <ul>
            <li>Workloads that would benefit from MRDIMM (use Xeon 6 6900P)</li>
            <li>Workloads that need AMX (Intel-only)</li>
            <li>Cross-CCD-heavy workloads with tight latency budgets — the 150 ns inter-CCD penalty hurts</li>
            <li>Single-thread workloads pinned to throughput SKUs — use M8azn (5 GHz) instead</li>
          </ul>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
