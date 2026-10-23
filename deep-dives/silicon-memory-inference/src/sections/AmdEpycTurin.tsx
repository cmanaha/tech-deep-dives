import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { S } from '../sources/AmdEpycTurin';
import { EpycTurinTopology } from '../components/EpycTurinTopology';

interface LatencyRow {
  point: string;
  value: React.ReactNode;
  basis: string;
}

const NPS1_NOTE =
  'Over 220 ns in NPS0 less the nearly 90 ns penalty Chips and Cheese reports against an EPYC 9355P in NPS1.';

const latencyRows: LatencyRow[] = [
  {
    point: 'L1 data cache, load to use',
    value: (
      <>
        4 cycles
        <Cite
          s={S.chipsAndCheeseZen5HotChips}
          note="AMD's design figure from Hot Chips 2024, as reported by Chips and Cheese."
        />
      </>
    ),
    basis: 'AMD design figure',
  },
  {
    point: 'Core to core, same CCD',
    value: (
      <>
        about 45 ns
        <Cite s={S.chipsAndCheeseTurin} kind="measured" />
      </>
    ),
    basis: 'Measured, EPYC 9575F',
  },
  {
    point: 'Core to core, different CCDs',
    value: (
      <>
        about 150 ns
        <Cite s={S.chipsAndCheeseTurin} kind="measured" />
      </>
    ),
    basis: 'Measured, EPYC 9575F',
  },
  {
    point: 'Core to core, other socket',
    value: (
      <>
        about 260 ns
        <Cite s={S.chipsAndCheeseTurin} kind="measured" />
      </>
    ),
    basis: 'Measured, two EPYC 9575F',
  },
  {
    point: 'DRAM, NPS1',
    value: (
      <>
        about 130 ns
        <Cite s={S.chipsAndCheeseNps0} kind="derived" note={NPS1_NOTE} />
      </>
    ),
    basis: 'Derived, EPYC 9355P',
  },
  {
    point: 'DRAM, NPS0',
    value: (
      <>
        over 220 ns
        <Cite s={S.chipsAndCheeseNps0} kind="measured" />
      </>
    ),
    basis: 'Measured, two EPYC 9575F',
  },
];

interface SkuRow {
  sku: string;
  cores: string;
  l3: string;
  boost: string;
  l3PerCore: string;
}

const skuRows: SkuRow[] = [
  { sku: 'EPYC 9965', cores: '192 Zen 5c', l3: '384 MB', boost: '3.7 GHz', l3PerCore: '2 MB' },
  { sku: 'EPYC 9755', cores: '128 Zen 5', l3: '512 MB', boost: '4.1 GHz', l3PerCore: '4 MB' },
  { sku: 'EPYC 9575F', cores: '64 Zen 5', l3: '256 MB', boost: '5.0 GHz', l3PerCore: '4 MB' },
  {
    sku: 'EPYC 9355P (one socket only)',
    cores: '32 Zen 5',
    l3: '256 MB',
    boost: '4.4 GHz',
    l3PerCore: '8 MB',
  },
  { sku: 'EPYC 9175F', cores: '16 Zen 5', l3: '512 MB', boost: '5.0 GHz', l3PerCore: '32 MB' },
];

export function AmdEpycTurin() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Up to 16 compute dies around one IO die: where threads, memory and inbound packets land decides what each access costs"
          >
            AMD EPYC Turin (Zen 5)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AMD EPYC 9005, code-named Turin, is AMD&apos;s fifth-generation server CPU. A socket
            holds up to 16 Zen 5 CCDs (Core Complex Dies) of 8 cores, 128 cores in all, or up to 12
            Zen 5c CCDs of 16 cores, 192 in all.
            <Cite s={S.amdTurinArchWhitepaper} /> The cores on a CCD share one 32 MB L3, and every
            CCD connects to a single IO die that holds the memory controllers and all I/O.
            <Cite s={S.amdTurinArchWhitepaper} /> Anything outside a thread&apos;s own CCD, whether
            another CCD, DRAM or a NIC (network interface card), sits across the IO die.
          </Box>
          <Box variant="p">
            Zen 5 runs AVX-512 (Advanced Vector Extensions 512) on a full 512-bit data path, and a
            BIOS setting can split each instruction into two 256-bit passes when power matters more
            than speed
            <Cite s={S.amdTurinArchWhitepaper} />, so check that setting before comparing AVX-512
            results across servers. Each socket takes up to 6 TB of DDR5 on 12 channels at two DIMMs
            per channel
            <Cite
              s={S.epyc9005Datasheet}
              note="Data sheet columns: 12/6TB at 2DPC (two DIMMs per channel); DDR5-6400 at 1DPC (one DIMM per channel)."
            />; at one DIMM per channel and DDR5-6400 that is 614 GB/s per socket, and DDR5-6400
            needs OEM (original equipment manufacturer) enablement and a BIOS update.
            <Cite s={S.epyc9755Page} />
          </Box>
          <ExpandableSection headerText="Zen 5 core changes from Zen 4 (Genoa)">
            <ul>
              <li>
                L1 data cache: 48 KB, 50% larger, still 4 cycles load to use
                <Cite s={S.chipsAndCheeseZen5HotChips} />
                <Cite s={S.amdTurinArchWhitepaper} />
              </li>
              <li>
                L2: 1 MB per core
                <Cite s={S.amdTurinArchWhitepaper} />, 16-way instead of 8-way for a higher hit rate
                at the same size
                <Cite
                  s={S.chipsAndCheeseStrixPoint}
                  note="Reported in Chips and Cheese's analysis of Strix Point, the mobile Zen 5."
                />
                <Cite s={S.chipsAndCheeseZen5HotChips} />
              </li>
              <li>
                Outstanding L1 misses: 124 in flight per core, up from 24
                <Cite
                  s={S.chipsAndCheeseZen5HotChips}
                  note="Chips and Cheese cites AMD's optimization guide for this figure."
                />
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a thread, its memory and its I/O sit on this layout decides how far each miss travels"
          >
            Topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <EpycTurinTopology />
          <Box variant="small" color="text-body-secondary">
            Layout, quadrants and link counts per AMD
            <Cite s={S.amdTurinArchWhitepaper} />; core-to-core latencies are Chips and Cheese
            measurements on an EPYC 9575F, not AMD specifications.
            <Cite s={S.chipsAndCheeseTurin} kind="measured" />
          </Box>
          <Box variant="p">
            The IO die holds 12 DDR5 memory controllers, one per channel, and 16 GMI (Global Memory
            Interface) links to the CCDs: one per CCD on high-core-count parts, two per CCD on the
            memory-speed-optimized parts.
            <Cite s={S.amdTurinArchWhitepaper} /> That two-link form is GMI3-Wide, which the EPYC
            9575F uses.
            <Cite s={S.chipsAndCheeseTurin} /> Its eight 16-lane SERDES (serializer-deserializer)
            blocks give 128 PCIe 5 lanes per socket, 160 in a two-socket server. The blocks carry
            PCIe, the link to the other socket or up to 64 lanes of CXL (Compute Express Link) 2.0,
            and not every block supports every function.
            <Cite s={S.amdTurinArchWhitepaper} />
            <Cite s={S.epyc9005Datasheet} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="About 45 ns inside a CCD, 150 ns between CCDs and 260 ns between sockets: plan thread placement around these three"
          >
            Latency and NUMA modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={latencyRows}
            columnDefinitions={[
              { id: 'pt', header: 'Access', cell: (r) => r.point, minWidth: 180 },
              { id: 'val', header: 'Latency', cell: (r) => r.value, minWidth: 150 },
              { id: 'basis', header: 'Basis', cell: (r) => r.basis },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Chips and Cheese measurements on the named SKUs, not AMD specifications; the L1 figure
            is AMD&apos;s.
          </Box>
          <Box variant="p">
            Keep threads that share data on one CCD: 8 cores on Zen 5, 16 on Zen 5c.
            <Cite s={S.amdTurinArchWhitepaper} /> Each exchange with a thread on another CCD costs
            about three times as much, 150 ns against 45.
            <Cite
              s={S.chipsAndCheeseTurin}
              kind="derived"
              note="About 150 ns divided by about 45 ns, both measured on an EPYC 9575F."
            />
          </Box>
          <Box variant="p">
            NPS, the number of NUMA (non-uniform memory access) nodes per socket, is a BIOS setting.
            <Cite
              s={S.amdTurinArchWhitepaper}
              note="AMD's benchmark configurations list NPS under BIOS options."
            />{' '}
            AMD&apos;s guidance is that most applications run well with the socket as one domain,
            NPS1.
            <Cite s={S.amdTurinArchWhitepaper} /> NPS4 makes each IO-die quadrant (three memory
            controllers, up to four Zen 5 or three Zen 5c CCDs) its own node and gives small gains
            for applications that tie their memory to the nearest cores.
            <Cite s={S.amdTurinArchWhitepaper} /> NPS0 makes a two-socket server one node, spreading
            accesses over every channel on both sockets
            <Cite s={S.chipsAndCheeseNps0} />: more bandwidth, and DRAM latency over 220 ns on two
            EPYC 9575F, nearly 90 ns above an EPYC 9355P in NPS1.
            <Cite s={S.chipsAndCheeseNps0} kind="measured" /> On an instance,{' '}
            <code>numactl --hardware</code> shows the NUMA layout you were given.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose by the L3 each core sees and by clock, as well as by core count"
          >
            SKU lineup
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each CCD has 32 MB of L3 at any core count, so L3 per core is a SKU choice; the EPYC
            9175F runs 16 CCDs with one core active on each.
            <Cite s={S.amdTurinArchWhitepaper} />
          </Box>
          <Table
            items={skuRows}
            columnDefinitions={[
              { id: 'sku', header: 'SKU', cell: (r) => r.sku, minWidth: 150 },
              { id: 'cores', header: 'Cores', cell: (r) => r.cores },
              { id: 'l3', header: 'L3', cell: (r) => r.l3 },
              { id: 'boost', header: 'Max boost', cell: (r) => r.boost },
              { id: 'l3pc', header: 'L3 per core', cell: (r) => r.l3PerCore },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Cores, L3, boost clocks and socket support from the EPYC 9005 data sheet
            <Cite s={S.epyc9005Datasheet} />; L3 per core is L3 divided by cores.
            <Cite s={S.epyc9005Datasheet} kind="derived" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which EC2 family to pick for clock, cores, memory or HPC networking, and what a vCPU is on each"
          >
            EPYC Turin on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">M8a, C8a, R8a</Box>
              <Box variant="p">
                All three run the AMD EPYC 9R45
                <Cite s={S.ec2GeneralPurposeSpecs} />
                <Cite s={S.ec2ComputeOptimizedSpecs} />
                <Cite s={S.ec2MemoryOptimizedSpecs} /> at up to 4.5 GHz.
                <Cite s={S.ec2AmdPage} /> Each vCPU is a physical core with no SMT (simultaneous
                multithreading), so a 192-vCPU m8a.48xlarge has 192 cores.
                <Cite s={S.m8aLaunchBlog} />
                <Cite s={S.ec2GeneralPurposeSpecs} note="m8a.48xlarge: 192 vCPUs, 192 CPU cores, 1 thread per core." /> AWS cites 45% more memory bandwidth for M8a than M7a.
                <Cite s={S.m8aLaunchBlog} kind="vendor-claim" />
              </Box>
            </div>
            <div>
              <Box variant="h3">M8azn, X8aedz: 5 GHz</Box>
              <Box variant="p">
                Both run the AMD EPYC 9R05
                <Cite s={S.ec2GeneralPurposeSpecs} />
                <Cite s={S.ec2MemoryOptimizedSpecs} /> at up to 5 GHz.
                <Cite s={S.ec2AmdPage} /> M8azn is general purpose with up to 96 vCPUs
                <Cite s={S.ec2GeneralPurposeSpecs} />; X8aedz pairs up to 96 vCPUs with up to 3,072
                GiB, for EDA (electronic design automation) and large-memory databases.
                <Cite s={S.ec2AmdPage} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Hpc8a</Box>
              <Box variant="p">
                One size, hpc8a.96xlarge: AMD EPYC 9R45, 192 cores, 768 GiB and 300 Gbps of EFA
                (Elastic Fabric Adapter) networking.
                <Cite s={S.ec2HpcSpecs} />
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            All six families run on the Nitro v6 hypervisor
            <Cite s={S.ec2GeneralPurposeSpecs} />
            <Cite s={S.ec2ComputeOptimizedSpecs} />
            <Cite s={S.ec2MemoryOptimizedSpecs} />
            <Cite s={S.ec2HpcSpecs} /> (<em>Isolation: NIE and MIG</em>). Pick M8azn or X8aedz when
            one thread&apos;s clock sets the latency, and M8a, C8a or R8a when the work spreads
            across cores.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When the job needs memory or matrix hardware Turin lacks, and what EPYC 9006 adds"
          >
            Workload fit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul>
            <li>
              Bandwidth from MRDIMMs (Multiplexed Rank DIMMs): the EPYC 9005 pages list DDR5 as the
              memory type
              <Cite s={S.epyc9755Page} />, while Xeon 6 6900P takes MRDIMM at up to 8,800 MT/s
              <Cite s={S.xeon6ProductBrief} />
              <Cite
                s={S.xeon6980pArk}
                note="Xeon 6980P memory types: DDR5 6400 MT/s, MRDIMM 8800 MT/s."
              />{' '}
              (<em>Intel Xeon 6</em>)
            </li>
            <li>
              Matrix math on AMX (Advanced Matrix Extensions) tiles, which Xeon 6 carries
              <Cite s={S.m8iPage} /> (<em>Intel Xeon 6</em>)
            </li>
          </ul>
          <Box variant="p">
            EPYC 9006 (Venice) adds the memory Turin lacks: Zen 6 cores on TSMC 2 nm, up to 256 cores
            and 512 threads per socket, up to 16 DDR5 channels, JEDEC-standard MRDIMM at up to 12,800
            MT/s, and PCIe Gen 6.
            <Cite s={S.amdVeniceBlog} kind="roadmap" /> EPYC 9006 is in production; AMD says major
            OEM platforms are on track to launch and cloud providers will begin deploying it later in
            2026.
            <Cite s={S.amdAgenticStack} kind="roadmap" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Land inbound packets in the consuming core's L2 instead of DRAM, and set up a server to get the 55 to 76 ns latency cut AMD measured"
          >
            Smart Data Cache Injection (SDCI)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SDCI moves data from a PCIe device straight into the L2 cache, skipping the write to main
            memory and the read back, while keeping memory coherent.
            <Cite s={S.amdTurinArchWhitepaper} /> On Zen 5 the data lands in the L2 of the core
            running the application. The NIC tags each inbound write with a steering tag carried by
            PCIe TPH (TLP Processing Hints, where a TLP is a Transaction Layer Packet), and the CPU
            uses the tag to pick the core.
            <Cite s={S.amdSdciWhitepaper} /> This shortens the receive stage of the tick-to-trade
            path in <em>Capital Markets Lens</em>.
          </Box>
          <Box variant="p">
            AMD measured 55 to 76 ns (6.1 to 7.4%) lower average latency with SDCI on an EPYC 9575F
            with a Solarflare X4 NIC, across eflatency (ef_vi), Onload TCP and Onload UDP at 0 to
            648-byte payloads.
            <Cite s={S.amdSdciWhitepaper} kind="vendor-claim" /> The test system ran a pre-release
            BIOS.
            <Cite s={S.amdSdciWhitepaper} />
          </Box>
          <Box variant="p">
            No AWS documentation of SDCI or TPH on EC2 instances was located during this research,
            so this checklist is for Turin servers you configure yourself. CPU, BIOS, NIC and driver
            must all support it.
            <Cite s={S.amdSdciWhitepaper} />
          </Box>
          <ol>
            <li>
              BIOS: an EPYC 9005 BIOS that enables SDCI.
              <Cite s={S.amdSdciWhitepaper} />
            </li>
            <li>
              NIC and driver: a TPH-capable NIC with a Linux driver that supports SDCI; AMD&apos;s
              figures used a Solarflare X4.
              <Cite s={S.amdSdciWhitepaper} /> In mainline Linux at v6.19, the Broadcom bnxt driver
              enables TPH and programs steering tags.
              <Cite s={S.linuxBnxtTph} />
            </li>
            <li>
              Kernel: Linux 6.13 or later, which adds PCIe TPH support
              <Cite s={S.linuxTph} />, built with <code>CONFIG_PCIE_TPH</code> and booted without{' '}
              <code>pci=notph</code>, which turns TPH off system-wide.
              <Cite s={S.linuxNotphParam} />
            </li>
            <li>
              Placement: pin the consuming thread to the core the NIC steers to, as AMD&apos;s recipe
              does.
              <Cite s={S.amdSdciWhitepaper} />
            </li>
            <li>
              L3 share, on Linux 6.19 or later: resctrl&apos;s <code>io_alloc</code>, backed on AMD
              by SDCIAE (L3 Smart Data Cache Injection Allocation Enforcement), bounds the L3 that
              injected I/O may occupy. Read <code>/sys/fs/resctrl/info/L3/io_alloc</code> (enabled,
              disabled or not supported), write <code>1</code> to it to enable, and set{' '}
              <code>io_alloc_cbm</code> per L3. Enabling it takes the highest CLOSID (class of
              service ID) away from CPU cache allocation.
              <Cite s={S.linuxResctrl} />
            </li>
            <li>
              Measure receive latency with SDCI on and off, as AMD did with eflatency and
              sfnt-pingpong.
              <Cite s={S.amdSdciWhitepaper} />
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
