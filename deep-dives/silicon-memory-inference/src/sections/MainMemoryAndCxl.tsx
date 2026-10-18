import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { MemoryTechGrid } from '../components/MemoryTechGrid';
import { Cite, type Source } from '../components/Cite';
import { S } from '../sources/MainMemoryAndCxl';

const g5Note =
  '12 channels (Graviton README) x 8,800 MT/s x 8 bytes = 844.8 GB/s per socket; 12 x 6,400 x 8 = 614.4 GB/s.';
const veniceNote = '1,638 / 1,024 GB/s per socket = 1.6, MRDIMM at 12,800 MT/s against RDIMM at 8,000, both on 16 channels.';
const cxlLinkNote = 'CXL 2.0 at 32 GT/s per lane x 16 lanes / 8 bits = 64 GB/s per direction, before encoding overhead.';
const cxlDeltaNote = '254 - 144 = 110 ns, both idle, on Samsung\'s platform.';
const nvmeNote =
  '8 x 3,800 GB = 30.4 TB. 4.4 M IOPS x 4,096 B / 8 GPUs = 2.25 GB/s; EBS 12,500 MB/s on p5en and P6 / 8 = 1.56 GB/s.';

interface SpeedRow {
  grade: string;
  perChannel: string;
  perSocket: string;
  where: React.ReactNode;
  source: Source;
}

const speedRows: SpeedRow[] = [
  {
    grade: 'DDR5-4800',
    perChannel: '38.4 GB/s',
    perSocket: '460.8 GB/s (12 ch)',
    where: 'First DDR5 data rate in the JEDEC standard',
    source: S.jedecDdr5,
  },
  {
    grade: 'DDR5-5600',
    perChannel: '44.8 GB/s',
    perSocket: '537.6 GB/s (12 ch)',
    where: (
      <>
        Graviton4 (R8g)
        <Cite s={S.gravitonReadme} />
      </>
    ),
    source: S.r8gPage,
  },
  {
    grade: 'DDR5-6400',
    perChannel: '51.2 GB/s',
    perSocket: '614.4 GB/s (12 ch)',
    where: (
      <>
        EPYC 9005, with OEM enablement and a BIOS update
        <Cite s={S.epyc9755Page} />; Xeon 6 6900P
        <Cite s={S.xeon6980pArk} />; Graviton4 R8gn and R8gb
      </>
    ),
    source: S.r8gPage,
  },
  {
    grade: 'DDR5-7200',
    perChannel: '57.6 GB/s',
    perSocket: '691.2 GB/s (12 ch)',
    where: (
      <>
        AWS M8i
        <Cite s={S.m8iPage} /> and R8i (Xeon 6)
      </>
    ),
    source: S.r8iPage,
  },
  {
    grade: 'DDR5-8800 RDIMM',
    perChannel: '70.4 GB/s',
    perSocket: '844.8 GB/s (12 ch)',
    where: (
      <>
        Graviton5
        <Cite s={S.gravitonReadme} />
      </>
    ),
    source: S.c9gGa,
  },
  {
    grade: 'MRDIMM-8800',
    perChannel: '70.4 GB/s',
    perSocket: '844.8 GB/s (12 ch)',
    where: 'Xeon 6 6900P',
    source: S.xeon6980pArk,
  },
  {
    grade: 'MRDIMM-12800',
    perChannel: '102.4 GB/s',
    perSocket: '1,638 GB/s (16 ch)',
    where: (
      <>
        EPYC 9006, announced July 2026
        <Cite s={S.amdVeniceBlog} kind="roadmap" />
      </>
    ),
    source: S.epyc9996Page,
  },
];

export function MainMemoryAndCxl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Size the host side of an inference server: the bandwidth and capacity each memory type buys, which platforms take it, and where bytes go once local DRAM runs out"
          >
            DDR5, MRDIMM, LPDDR5X and CXL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What host memory does.</strong> Host memory is the DRAM (dynamic RAM) on the
            CPU&apos;s own memory controllers. In an inference server the CPU rarely runs the model;
            it runs the scheduler, tokenizer and retrieval indexes, and can hold the KV (key-value)
            cache that outgrows the accelerator&apos;s HBM (High Bandwidth Memory). Four
            technologies supply it: DDR5 (Double Data Rate 5) RDIMMs (registered
            dual in-line memory modules), MRDIMMs (Multiplexed Rank DIMMs), LPDDR5X (Low-Power
            DDR5X) and CXL (Compute Express Link) memory.
          </Box>
          <Box variant="p">
            <strong>One formula sets the ceiling.</strong> Peak bandwidth per socket is channels x
            data rate x 8 bytes. Twelve channels of DDR5-8800, the RDIMMs in Graviton5, give{' '}
            <strong>844.8 GB/s</strong>
            <Cite s={S.c9gGa} kind="derived" note={g5Note} />; the same channels at 6,400 MT/s
            (megatransfers per second) give 614.4. MRDIMMs raise the data rate on the same DRAM:
            16 channels at 12,800 MT/s on AMD&apos;s announced EPYC 9006 give 1,638 GB/s per socket.
            <Cite s={S.epyc9996Page} /> CXL adds capacity instead, at about 110 ns more per load
            than local DRAM.
            <Cite s={S.samsungCmmD} kind="derived" note={cxlDeltaNote} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Compare bandwidth, capacity and latency across six places a byte can live outside HBM, and see which ones a host can buy today"
          >
            The options side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MemoryTechGrid />
          <Box variant="small" color="text-body-secondary">
            High Bandwidth Flash (HBF) is accelerator memory, beside HBM on the accelerator package,
            and no product ships. It is here because it competes for the same decision as the host
            tiers: which bytes to keep near compute. Sources: DDR5 RDIMM
            <Cite s={S.c9gGa} kind="derived" note={g5Note} />
            <Cite s={S.epyc9005Datasheet} note="EPYC 9005: 12 channels, up to 6 TB per socket." />
            <Cite s={S.samsungCmmD} kind="vendor-claim" note="Local DRAM measured at 144 ns idle on Samsung's test platform." />
            . MRDIMM
            <Cite s={S.xeon6980pArk} note="MRDIMM 8,800 MT/s, 12 channels, 3 TB maximum memory." />
            <Cite s={S.epyc9996Page} note="MRDIMM up to 12,800 MT/s, 1,638 GB/s per socket, 16 channels." />
            . LPDDR5X
            <Cite s={S.gb200Nvl72} note="480 GB of LPDDR5X per Grace (17 TB over 36 Grace CPUs)." />
            <Cite s={S.graceSuperchipPage} note="Up to 500 GB/s; Grace CPU C1: up to 384 GB/s for 480 GB." />
            <Cite s={S.graceCpuPage} note="Vera: up to 1.2 TB/s and 1.5 TB per CPU." />
            <Cite s={S.micronHbm4} kind="vendor-claim" note="Micron: up to 2 TB per CPU with SOCAMM2." />
            . CXL
            <Cite s={S.xeon6Brief} kind="derived" note={cxlLinkNote} />
            <Cite s={S.cxl4Spec} kind="derived" note="128 GT/s x 16 lanes / 8 bits = 256 GB/s per direction." />
            <Cite s={S.samsungCmmD} kind="vendor-claim" note="CMM-D at 254 ns idle locally against 144 ns for local DRAM." />
            . NVMe (Non-Volatile Memory Express) flash: EBS (Elastic Block Store), FSx for Lustre
            with GDS (GPUDirect Storage), instance-store IOPS (I/O operations per second)
            <Cite s={S.ec2AcceleratedSpecs} />
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={nvmeNote} />
            <Cite s={S.fsxPerformance} kind="derived" note="1,200 Gb/s per instance / 8 bits / 8 GPUs = 18.75 GB/s." />
            <Cite s={S.gdsOverview} />
            . HBF: OCP (Open Compute Project) grades
            <Cite s={S.ocpSpec} />, Sandisk Gen 1
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" note="1.6 TB/s read per stack; HBF latency is higher than HBM's, with no figure given." />
            , simulator latency inputs
            <Cite s={S.flint} kind="simulated" note="Simulator input: 1 to 2 µs, SLC flash." />
            <Cite s={S.hbfSim} kind="simulated" note="Simulator input: about 20 µs per page read." />
            {' '}and samples
            <Cite
              s={S.sandiskInvestorDay2026}
              kind="roadmap"
              note="Sandisk: first HBF memory die taped out in August 2026; samples of inference devices with HBF targeted for 2027."
            />
            . &quot;No figure located&quot;: none found in the sources read for this research.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out a socket's peak bandwidth from its channel count and DIMM speed, and see which grade each platform runs"
          >
            DDR5: channels times data rate
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DDR5 RDIMMs are the socketed DRAM on Graviton, EPYC and Xeon hosts. DDR5 launched at
            4,800 MT/s
            <Cite s={S.jedecDdr5} />, and JESD79-5C sets timings up to 8,800.
            <Cite s={S.jedecDdr5c} /> Each channel moves 8 bytes per transfer, so the table&apos;s
            peaks follow from the data rate; <em>Intel Xeon 6</em> gives a measured NUMA-local
            (non-uniform memory access) read on an r8i.
          </Box>
          <Table
            items={speedRows}
            columnDefinitions={[
              { id: 'grade', header: 'Grade', cell: (r) => r.grade, minWidth: 140 },
              { id: 'pc', header: 'Per channel', cell: (r) => r.perChannel, minWidth: 110 },
              {
                id: 'ps',
                header: 'Peak per socket',
                cell: (r) => (
                  <>
                    {r.perSocket}
                    <Cite s={r.source} kind="derived" note="Data rate x 8 bytes per channel, times the channel count." />
                  </>
                ),
                minWidth: 190,
              },
              {
                id: 'where',
                header: 'Where it runs',
                cell: (r) => (
                  <>
                    {r.where}
                    <Cite s={r.source} />
                  </>
                ),
                minWidth: 280,
              },
            ]}
            variant="embedded"
            wrapLines
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the extra buffer chips buy, which CPUs take MRDIMMs, and how much a socket gains by switching"
          >
            MRDIMM: two ranks on one bus
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> An MRDIMM is a registered DIMM with two more kinds of chip,
            a multiplexed-rank registering clock driver (MRCD) and multiplexed-rank data buffers
            (MDB), both JEDEC device standards.
            <Cite s={S.jedecJc40} /> They interleave two ranks onto one channel, so the bus runs at
            twice the DRAM&apos;s own rate: 8,800 MT/s on the bus over DRAM at 4,400.
            <Cite
              s={S.jedecMrdimmPlans}
              kind="derived"
              note="JEDEC: MRDIMM delivers up to twice the peak bandwidth of native DRAM; 8,800 / 2 = 4,400."
            />
          </Box>
          <Box variant="p">
            <strong>Where it runs.</strong> Xeon 6 6900P takes MRDIMMs at 8,800 MT/s on 12 channels
            <Cite s={S.xeon6980pArk} />; Intel puts the gain over standard DDR5 DIMMs at more than 37%
            <Cite s={S.xeon6Brief} kind="vendor-claim" />, which is 8,800 over 6,400. EPYC 9005
            takes RDIMMs only.
            <Cite s={S.epyc9005Datasheet} /> AMD has announced EPYC 9006 with JEDEC-standard MRDIMMs
            at up to 12,800 MT/s
            <Cite s={S.amdVeniceBlog} kind="roadmap" />: 1,638 GB/s per socket against 1,024 GB/s
            with RDIMMs at 8,000 MT/s on the same 16 channels.
            <Cite s={S.epyc9996Page} /> On that platform the module type alone is worth 60%.
            <Cite s={S.epyc9996Page} kind="derived" note={veniceNote} />
          </Box>
          <Box variant="p">
            <strong>The edge moves.</strong> Graviton5 reaches 8,800 MT/s with ordinary RDIMMs, so
            its 12 channels deliver the same 844.8 GB/s that MRDIMMs give a Xeon 6 6900P.
            <Cite s={S.c9gGa} kind="derived" note={g5Note} /> JEDEC&apos;s second-generation MRDIMM
            raw cards target 12,800 MT/s, and a third generation is in development.
            <Cite s={S.jedecMrdimmRoadmap} kind="roadmap" /> No vendor latency figure for MRDIMMs
            was located during this research.
          </Box>
          <ExpandableSection headerText="Xeon 6 6700P: two speeds on one ARK page">
            <Box variant="p">
              Intel ARK lists the Xeon 6787P&apos;s memory types as DDR5 at 6,400 and MRDIMM at
              8,800 MT/s, and its maximum memory speed as 8,000 MT/s, on 8 channels.
              <Cite s={S.xeon6787pArk} /> Size a 6700P host at 8,000, the lower figure.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why NVIDIA's CPUs use low-power memory, and what moving from soldered packages to SOCAMM2 modules changes for capacity and service"
          >
            LPDDR5X and SOCAMM2: bandwidth per watt, on modules
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> LPDDR5X is mobile-derived DRAM that gives up socketed
            capacity for bandwidth per watt. On Grace it is soldered to the compute module: up to
            480 GB per CPU
            <Cite s={S.gb200Nvl72} />, drawing about 16 W at up to 500 GB/s.
            <Cite s={S.graceSuperchipPage} /> NVIDIA&apos;s Grace CPU C1 figures give 384 GB/s for
            a 480 GB Grace
            <Cite s={S.graceSuperchipPage} note="Grace CPU C1 column: 'Up to 384 GB/s for 480GB'." />;{' '}
            <em>Grace-Blackwell and UltraServer</em> covers which figure to plan with.
          </Box>
          <Box variant="p">
            <strong>SOCAMM2 makes it replaceable.</strong> SOCAMM2 (Small Outline Compression
            Attached Memory Module 2) puts LPDDR5X on a module: JEDEC JESD328, published June 2026
            <Cite s={S.jedecJc45} />, at up to 9.6 Gb/s per pin where signal integrity allows.
            <Cite s={S.jedecSocamm2} /> Vera uses field-replaceable SOCAMM modules, with up to 1.2
            TB/s and 1.5 TB per CPU.
            <Cite s={S.graceCpuPage} /> Micron, whose 192 GB SOCAMM2 it reports in high-volume
            production for Vera Rubin, gives up to 2 TB per CPU.
            <Cite s={S.micronHbm4} kind="vendor-claim" /> The vendors disagree; size a Vera host
            at NVIDIA&apos;s 1.5 TB until a platform specification settles it. LPDDR6 is published (JESD209-6, July 2025)
            <Cite s={S.jedecLpddr6} />; no data-center LPDDR6 product was located during this
            research.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When a CXL tier pays for itself in an inference server, what each load costs, and where you can run one today"
          >
            CXL memory: capacity at about 110 ns a load
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> CXL is a cache-coherent protocol over the PCIe physical
            layer: a CPU addresses memory on an expansion card, or in a pool behind a CXL switch, as
            ordinary memory. CXL 2.0 adds switching and pooling across hosts; CXL 3.0 adds
            sharing.
            <Cite s={S.cxl3Spec} /> Shipping CPUs speak CXL 2.0: up to 64 lanes on Xeon 6 at 32 GT/s
            (gigatransfers per second), 64 GB/s per direction per x16 link
            <Cite s={S.xeon6Brief} />
            <Cite s={S.xeon6Brief} kind="derived" note={cxlLinkNote} />, and CXL 2.0 on EPYC 9005.
            <Cite s={S.epyc9005Datasheet} /> The AMD pages read for EPYC 9006 do not state its CXL
            version.
          </Box>
          <Box variant="p">
            <strong>What a load costs.</strong> Samsung measured 254 ns idle for its CMM-D module
            against 144 ns for local DRAM on its platform
            <Cite s={S.samsungCmmD} kind="vendor-claim" />, about{' '}
            <strong>110 ns more per load</strong>
            <Cite s={S.samsungCmmD} kind="derived" note={cxlDeltaNote} />. In Pond&apos;s
            estimates CXL adds 70 to 90 ns in pools of 8 to 16 sockets, and more than 180 ns at rack
            scale.
            <Cite
              s={S.pond}
              kind="simulated"
              note="CXL 'will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling.'"
            />{' '}
            Keep latency-bound data in local DRAM and put capacity-bound data on CXL;{' '}
            <em>Capital Markets Lens</em> applies this to trading systems.
          </Box>
          <Box variant="p">
            <strong>The inference case is KV-cache offload.</strong> Samsung ran vLLM with LMCache
            against a CXL 2.0 switch-based memory pool on eight RTX PRO 6000 GPUs, and reports
            performance comparable to DRAM at TP=1 (no tensor parallelism) and about 92% of
            DRAM&apos;s at TP=8 (tensor parallelism across eight GPUs).
            <Cite s={S.samsungKvCxl} kind="vendor-claim" /> Recommender embeddings and retrieval
            indexes are the other capacity-bound fits.
          </Box>
          <Box variant="p">
            <strong>Where to run it.</strong> Azure offers CXL memory on M-series VMs in private
            preview, announced in November 2025.
            <Cite s={S.azureCxl} /> No EC2 instance with CXL-attached memory was located during this
            research; X8i, the memory-optimized family launched in January 2026, offers up to 6 TB
            and mentions no CXL tier.
            <Cite s={S.x8iWhatsNew} /> On EC2 the tier below host DRAM is NVMe flash (
            <em>Flash as a Cache Tier for Inference</em>); the{' '}
            <Link href="../vllm/">vLLM dive</Link>&apos;s KV Offloading and LMCache section covers
            the software that moves KV between tiers.
          </Box>
          <ExpandableSection headerText="CXL versions, 2.0 to 4.0">
            <Box variant="p">
              CXL 3.0 (August 2022) doubled the rate to 64 GT/s with no added latency, and added
              fabrics, improved memory sharing and pooling, and peer-to-peer access.
              <Cite s={S.cxl3Spec} /> CXL 3.1 (November 2023) added fabric manageability and TSP
              (TEE Security Protocol, for trusted execution environments)
              <Cite s={S.cxl31Spec} />; CXL 3.2 (December 2024) added a Hot-Page Monitoring Unit
              (CHMU) for memory tiering.
              <Cite s={S.cxl32Spec} /> CXL 4.0 (November 2025) doubles the rate to 128 GT/s, adds
              bundled ports, and stays backward compatible to 1.0.
              <Cite s={S.cxl4Spec} /> An x16 link carries 128 GB/s per direction at 64 GT/s and 256
              GB/s at 128 GT/s.
              <Cite s={S.cxl4Spec} kind="derived" note="GT/s x 16 lanes / 8 bits, per direction, before encoding overhead." />{' '}
              No shipping CPU with CXL 3.x support was confirmed in a source read during this
              research.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the memory to the limit you hit: bandwidth per socket, bandwidth per watt, or capacity"
          >
            How to choose
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">MRDIMM, when bandwidth per socket is the limit</Box>
            <ul>
              <li>Xeon 6 6900P at 8,800 MT/s, or EPYC 9006 at 12,800 once it ships.</li>
              <li>Price an RDIMM platform at the same rate first: Graviton5 gets 844.8 GB/s from DDR5-8800.</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">LPDDR5X, when the CPU sits beside the GPU</Box>
            <ul>
              <li>Grace solders it; Vera puts it on SOCAMM2 modules.</li>
              <li>Size Vera at NVIDIA&apos;s 1.5 TB per CPU.</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">CXL memory, when capacity is the limit</Box>
            <ul>
              <li>
                The working set outgrows the DIMM slots and tolerates about 110 ns more per load: KV-cache
                offload, embeddings, retrieval indexes.
              </li>
              <li>Azure M-series has it in preview; none was found on EC2, where NVMe flash is the next tier.</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
