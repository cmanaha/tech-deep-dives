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
import { MemoryTechGrid } from '../components/MemoryTechGrid';

interface SpeedRow {
  spec: string;
  perChannel: string;
  twelveCh: string;
  notes: string;
}

const speedRows: SpeedRow[] = [
  { spec: 'DDR5-4800', perChannel: '38.4 GB/s', twelveCh: '460.8 GB/s', notes: 'Original DDR5 launch (Genoa, Sapphire Rapids)' },
  { spec: 'DDR5-5600', perChannel: '44.8 GB/s', twelveCh: '537.6 GB/s', notes: 'Graviton4 (12 channels)' },
  { spec: 'DDR5-6400', perChannel: '51.2 GB/s', twelveCh: '614.4 GB/s', notes: 'Turin (9005), Xeon 6 baseline' },
  { spec: 'DDR5-7200', perChannel: '57.6 GB/s', twelveCh: '691.2 GB/s', notes: 'Graviton5; AWS M8i / R8i (Xeon 6, custom RDIMM)' },
  { spec: 'MRDIMM DDR5-8800', perChannel: '70.4 GB/s', twelveCh: '844.8 GB/s', notes: 'Xeon 6 6900P only — JEDEC MRDIMM' },
];

export function MainMemoryAndCxl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Tier 6 (DRAM) and tier 7 (CXL) for the host side of inference systems"
          >
            DDR5, MRDIMM, LPDDR5X, and CXL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 6 covered HBM — the tier
            accelerators live in. This section covers the tiers the host CPU lives in.
            The host side of an inference system rarely runs the model itself, but it
            almost always runs the request scheduler, the tokenizer, the KV-cache
            management, the embeddings store, the retrieval index, and the orchestration
            code. Bandwidth and capacity at tiers 6 and 7 determine how much per-request
            host work the system can absorb without the GPU stalling.
          </Box>
          <Box variant="p">
            <strong>What is moving in 2026.</strong> DDR5 pin speeds keep climbing
            (4800 → 5600 → 6400 → 7200), MRDIMM has shipped on Xeon 6 6900P at DDR5-8800,
            LPDDR5X is the high-bandwidth low-power option (NVIDIA Grace at ~500 GB/s
            per CPU), and CXL has progressed from 2.0 (pooling) to 3.0 (sharing). All
            four technologies coexist; none is the &ldquo;winner.&rdquo; The architectural
            question is which fits which workload.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Side by side — bandwidth, capacity, latency, and use case"
          >
            The four technologies, compared
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MemoryTechGrid />
          <Box variant="small">
            DDR5 / MRDIMM speed and capacity figures track the{' '}
            <Link
              external
              href="https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html"
            >
              Intel Xeon 6 product brief
            </Link>
            {' '}and{' '}
            <Link
              external
              href="https://www.amd.com/en/products/processors/server/epyc/9005-series.html"
            >
              AMD EPYC 9005 series page
            </Link>
            . LPDDR5X figures track the{' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/grace-cpu/">
              NVIDIA Grace CPU page
            </Link>
            . CXL figures track the{' '}
            <Link external href="https://computeexpresslink.org/">
              CXL Consortium specification
            </Link>
            . All access dates 2026-04-23.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="DDR5 speed grades that matter for current host silicon"
          >
            DDR5 — the workhorse
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DDR5 doubled DDR4&apos;s peak data rate at launch and has continued climbing
            with each tick. Per-channel bandwidth scales linearly with the data rate; a
            12-channel server CPU multiplies that by 12. The numbers below are theoretical
            peaks on the most common 12-channel configurations — measured STREAM
            triad usually lands at 60-90% of theoretical depending on access pattern,
            NUMA mode, and prefetch behavior.
          </Box>
          <Table
            items={speedRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 180 },
              { id: 'pc', header: 'Per channel', cell: (r) => r.perChannel },
              { id: '12', header: '12 channels theoretical', cell: (r) => r.twelveCh },
              { id: 'notes', header: 'Where it ships', cell: (r) => r.notes },
            ]}
            variant="embedded"
            wrapLines
          />
          <Alert type="info" header="A measured number to anchor on">
            On AWS r8i (Xeon 6 with custom DDR5-7200 RDIMMs), Chips and Cheese measured
            STREAM triad at <strong>691.62 GB/s</strong> per socket — 2.14× their
            Emerald Rapids measurement of 323.45 GB/s. The 12-channel theoretical peak
            (691.2 GB/s) and the measured number happen to match almost exactly, which
            is unusual and worth knowing
            {' ('}
            <Link
              external
              href="https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory"
            >
              Chips and Cheese — Xeon 6 memory
            </Link>
            , accessed 2026-04-23).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The Xeon 6 6900P-only technology that breaks the DDR5 ceiling"
          >
            MRDIMM — what it is and why it matters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What MRDIMM is.</strong> Multiplexed Rank DIMM — a registered DIMM
            with an extra buffer chip (the MRCD) that lets the host bus run at higher
            speeds (DDR5-8800) while the underlying DRAM dies still operate at half rate
            (~4400 MT/s effective). The MRCD multiplexes simultaneous access to two
            ranks on the same channel, presenting twice the bus bandwidth without
            requiring faster DRAM cells.
          </Box>
          <Box variant="p">
            <strong>Where it ships.</strong> Intel Xeon 6 6900P only at the time of
            writing. The 6700P / 6500P support DDR5-8000 MRDIMM but not the full 8800
            rate. AMD EPYC Turin (9005) explicitly does <em>not</em> support MRDIMM —
            AMD says they are waiting for full JEDEC standardization
            {' ('}
            <Link
              external
              href="https://www.amd.com/en/products/processors/server/epyc/9005-series.html"
            >
              AMD EPYC 9005 series
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>What it buys you.</strong> 12 channels of DDR5-8800 hits 844.8 GB/s
            theoretical peak — about 37% over DDR5-6400. For bandwidth-hungry server
            workloads (databases, recommender embeddings, in-memory analytics) that
            improvement is non-trivial. For latency-sensitive workloads MRDIMM is
            roughly neutral — the buffer adds a small latency penalty that is usually
            covered by the per-channel speed gain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Bandwidth without DDR5's pin-count cost — and the power story"
          >
            LPDDR5X — high bandwidth, low power
          </Header>
        }
      >
        <Box variant="p">
          LPDDR5X is the mobile-derived memory used in NVIDIA Grace, Apple silicon, and
          numerous embedded and edge platforms. NVIDIA Grace pairs 480 GB of LPDDR5X at
          ~500 GB/s per CPU into a roughly 16 W envelope — a fundamentally different
          design point from RDIMM-based servers
          {' ('}
          <Link external href="https://www.nvidia.com/en-us/data-center/grace-cpu/">
            NVIDIA Grace CPU
          </Link>
          , accessed 2026-04-23). LPDDR5X cannot match the capacity of socketed RDIMMs
          (you cannot scale beyond what is soldered to the package) and the latency is
          modestly higher than DDR5 RDIMM. The trade is bandwidth-per-watt and
          bandwidth-density — both decisive for Grace-Blackwell-class systems where the
          CPU sits next to the GPU and shares an NVLink-C2C coherent domain.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why CXL solves a capacity problem, not a latency one"
          >
            CXL 2.0 and 3.0 — the tier 7 lever
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What CXL is.</strong> A coherent expansion bus over a PCIe-class
            physical layer. CXL 2.0 supports memory pooling — multiple hosts share a
            CXL switch and a memory-pool device, with each host allocating from the
            pool on demand. CXL 3.0 supports memory sharing — multiple hosts addressing
            the same physical memory coherently. Both are tier 7 (disaggregated /
            expansion). The CXL Consortium publishes the spec
            {' ('}
            <Link external href="https://computeexpresslink.org/">
              CXL Consortium
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>Where CXL fits.</strong> Capacity-limited workloads — recommender
            embeddings (10s of TBs), in-memory OLAP, sparse retrieval indexes, large
            graph databases — fit well. The CXL pool can be sized independently of the
            host&apos;s socket count, and the host pays only the link latency (200-400
            ns) for the marginal bytes it consumes.
          </Box>
          <Alert type="warning" header="CXL solves the wrong problem for HFT">
            Latency-sensitive workloads do not benefit from CXL. The link adds 100s of
            nanoseconds over a direct DDR channel. Capital markets workloads that care
            about p99.9 tick-to-trade latency want fewer memory hops, not more. A
            common framing error is to treat CXL as a generic memory upgrade — it is a
            capacity lever, and the latency cost is real and visible.
          </Alert>
          <ExpandableSection headerText="CXL 2.0 vs CXL 3.0 — what changed">
            <Box variant="p">
              CXL 2.0 introduced switching and pooling: a host attaches to a pool device
              through a CXL switch, and multiple hosts share that pool with dynamic
              allocation. CXL 3.0 doubled the lane rate to 64 GT/s (PCIe 6.0 physical),
              added fabric topologies (multi-headed devices, peer-to-peer between
              accelerators), and supported memory sharing — multiple hosts addressing
              the same coherent memory. The shipping CXL silicon in 2025-2026 is mostly
              2.0; CXL 3.0 silicon is starting to appear but not yet broadly deployed in
              production servers.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="The decision matrix">How to choose</Header>}
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Pick DDR5 RDIMM when</Box>
            <ul>
              <li>You need balanced bandwidth and capacity across general workloads</li>
              <li>Cost per GB matters more than peak bandwidth</li>
              <li>You are running a mixed-tenant SaaS backend or microservices fleet</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Pick MRDIMM (Xeon 6 6900P) when</Box>
            <ul>
              <li>You are bandwidth-hungry per socket — databases, in-memory analytics</li>
              <li>You can constrain to Xeon 6 6900P silicon</li>
              <li>You have validated that the small latency penalty does not matter</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Pick LPDDR5X when</Box>
            <ul>
              <li>You are designing into a Grace-Blackwell-class platform</li>
              <li>Power envelope is a hard constraint</li>
              <li>You can live with the soldered-to-package capacity limit</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Pick CXL pooling when</Box>
            <ul>
              <li>The model or working set exceeds 12-channel DDR capacity</li>
              <li>You are willing to pay 100s of ns for marginal bytes</li>
              <li>The workload is bandwidth-tolerant on the CXL-attached portion</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
