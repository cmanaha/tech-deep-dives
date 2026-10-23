import React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Table from "@cloudscape-design/components/table";
import { Cite } from "../components/Cite";
import { ChipletPathDiagram } from "../components/ChipletPathDiagram";
import { S } from "../sources/ChipletAndInterconnect";

const NPS1_NOTE =
  "Over 220 ns in NPS0 on two EPYC 9575F, less the nearly 90 ns penalty Chips and Cheese reports against an EPYC 9355P in NPS1.";
const CHANNEL_NOTE =
  "6,400 MT/s x 8 bytes per transfer = 51.2 GB/s per channel; 12 channels give the 614 GB/s per socket AMD lists. DDR5-6400 requires OEM enablement and a BIOS update.";
const NVLINK_NOTE =
  "NVIDIA rates NVLink 5 at 1.8 TB/s per GPU bidirectional (18 links x 100 GB/s); 900 GB/s each way is half of that.";
const GRAVITON5_NODE_NOTE =
  'AWS processor table: "Memory (NUMA) nodes: 1 (2 for 16xlarge and 48xlarge)"; "LLC (shared): 48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)".';
const HBI_NOTE =
  "Names the die-to-die link NV-HBI. The architecture page gives the 10 TB/s figure for all Blackwell products without naming the link.";
const HBI_LATENCY_NOTE =
  "Neither the Blackwell architecture page nor the Blackwell Ultra post gives a latency figure for NV-HBI.";
const XEON_L3_NOTE =
  "L3 hit just over 33 ns on the local tile; about 24 ns more on an adjacent tile; nearly 80 ns two tiles away, measured on an r8i in SNC3.";

interface ArchRow {
  arch: string;
  dies: React.ReactNode;
  numa: React.ReactNode;
  cost: React.ReactNode;
}

const archRows: ArchRow[] = [
  {
    arch: "AMD EPYC Turin (EPYC 9005)",
    dies: (
      <>
        Up to 16 CCDs of 8 Zen 5 cores or 12 of 16 Zen 5c, 32 MB of L3 each,
        around one IO die; one or two GMI links per CCD
        <Cite s={S.amdTurinArchWhitepaper} />
      </>
    ),
    numa: (
      <>
        NPS1, one node per socket, by AMD&apos;s guidance; NPS4 gives four
        <Cite s={S.amdTurinArchWhitepaper} />
      </>
    ),
    cost: (
      <>
        Core to core about 45 ns in one CCD, 150 ns across CCDs, 260 ns across
        sockets (EPYC 9575F)
        <Cite s={S.chipsAndCheeseTurin} kind="measured" />
      </>
    ),
  },
  {
    arch: "Intel Xeon 6 on AWS r8i (6985P-C)",
    dies: (
      <>
        Three compute tiles, each with L3 and four memory controllers, and two
        IO dies on EMIB; 96 cores, 480 MB of L3
        <Cite s={S.chipsAndCheeseXeon6} />
      </>
    ),
    numa: (
      <>
        SNC3: one node per compute tile
        <Cite s={S.chipsAndCheeseXeon6} />
      </>
    ),
    cost: (
      <>
        L3 hit about 33 ns locally, about 24 ns more one tile away, nearly 80 ns
        two away
        <Cite s={S.chipsAndCheeseXeon6} kind="measured" note={XEON_L3_NOTE} />
      </>
    ),
  },
  {
    arch: "AWS Graviton4 (Neoverse V2)",
    dies: (
      <>
        96 cores per socket, one 36 MB LLC, CMN-700 mesh; AWS&apos;s table lists
        no die count
        <Cite s={S.gravitonReadme} />
      </>
    ),
    numa: (
      <>
        One node; two on the two-socket 48xlarge
        <Cite s={S.gravitonReadme} />
      </>
    ),
    cost: (
      <>
        Core to core 30 to 60 ns, about 139 ns across sockets
        <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />
      </>
    ),
  },
  {
    arch: "AWS Graviton5 (Neoverse V3)",
    dies: (
      <>
        192 cores in one package
        <Cite s={S.graviton5AboutAmazon} />
        <Cite s={S.gravitonReadme} note="Processor table: Graviton5 core is Neoverse V3." />, CMN-S3 mesh; LLC 96 MB per node on
        24xlarge and 48xlarge, 48 MB per node on smaller sizes
        <Cite s={S.gravitonReadme} note={GRAVITON5_NODE_NOTE} />
      </>
    ),
    numa: (
      <>
        One node; two on 16xlarge and 48xlarge
        <Cite s={S.gravitonReadme} note={GRAVITON5_NODE_NOTE} />
      </>
    ),
    cost: (
      <>
        Up to 33% lower inter-core latency than Graviton4, by AWS&apos;s claim
        <Cite s={S.graviton5AboutAmazon} kind="vendor-claim" />
      </>
    ),
  },
  {
    arch: "NVIDIA Blackwell (B200, B300)",
    dies: (
      <>
        Two reticle-limited dies on NV-HBI at 10 TB/s
        <Cite s={S.blackwellArchitecture} />
        <Cite s={S.blackwellUltraBlog} note={HBI_NOTE} />; NVLink 5 to other GPUs at 1.8 TB/s
        bidirectional, 900 GB/s each way
        <Cite s={S.blackwellUltraBlog} note={NVLINK_NOTE} />
      </>
    ),
    numa: (
      <>
        One CUDA device with one coherent L2
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    cost: (
      <>
        No NV-HBI latency figure in the NVIDIA pages this research read
        <Cite s={S.blackwellArchitecture} note={HBI_LATENCY_NOTE} />
        <Cite s={S.blackwellUltraBlog} note={HBI_LATENCY_NOTE} />
      </>
    ),
  },
];

export function ChipletAndInterconnect() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Where the die boundaries sit in each CPU and GPU, what a crossing costs, and how to keep a job from paying for one"
          >
            Chiplet and Interconnect
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A chiplet processor is one package built from several dies: compute
            dies that hold cores and cache, IO dies that hold the slower I/O,
            and die-to-die links between them. AMD EPYC Turin
            <Cite s={S.amdTurinArchWhitepaper} /> and Intel Xeon 6
            <Cite s={S.chipsAndCheeseXeon6} /> are built this way, and NVIDIA
            Blackwell joins two reticle-limited dies into one GPU.
            <Cite s={S.blackwellArchitecture} /> AWS&apos;s processor table
            lists no die count for Graviton; it lists the NUMA (Non-Uniform
            Memory Access) layout, which is what a placement decision needs.
            <Cite s={S.gravitonReadme} />
          </Box>
          <Box variant="p">
            <strong>The model to carry.</strong> A memory access costs roughly
            the sum of the boundaries it crosses: the core&apos;s private
            caches, the cache its die shares, the die-to-die link and the memory
            controller. Each boundary also widens the set of cores the access
            competes with. Where a boundary separates a group of cores from its
            own memory controllers, the processor can present that group as a
            NUMA node, the one handle software gets on the layout.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one load from a Zen 5 core to DRAM and find the point where it leaves its own die"
          >
            The hop-by-hop path on AMD Turin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A load that misses the core&apos;s 48 KB L1 data cache and 1 MB L2
            reaches the 32 MB L3 shared by its CCD (Core Complex Die). An L3
            miss leaves the die over the CCD&apos;s GMI (Global Memory
            Interface) link, one per CCD on high-core-count parts and two on
            memory-speed-optimized parts, into the IO die that holds all 12 DDR5
            memory controllers.
            <Cite s={S.amdTurinArchWhitepaper} /> In NPS1 (NUMA nodes per socket
            set to one) the trip to DRAM takes about 130 ns on an EPYC 9355P.
            <Cite s={S.chipsAndCheeseNps0} kind="derived" note={NPS1_NOTE} />
          </Box>
          <ChipletPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Layout, cache sizes and links per AMD
            <Cite s={S.amdTurinArchWhitepaper} />; L1 latency is AMD&apos;s
            design figure
            <Cite
              s={S.chipsAndCheeseZen5HotChips}
              note="AMD's design figure from Hot Chips 2024, as reported by Chips and Cheese."
            />
            ; 51.2 GB/s per channel is our arithmetic, and DDR5-6400 needs OEM
            (original equipment manufacturer) enablement and a BIOS update
            <Cite s={S.epyc9755Page} kind="derived" note={CHANNEL_NOTE} />;
            core-to-core latencies measured on an EPYC 9575F
            <Cite s={S.chipsAndCheeseTurin} kind="measured" />; DRAM latency
            derived for an EPYC 9355P
            <Cite s={S.chipsAndCheeseNps0} kind="derived" note={NPS1_NOTE} />.
          </Box>
          <Box variant="p">
            The GMI link is the boundary to watch. Before it, a core shares the
            path only with its own CCD; after it, with every CCD in the socket,
            so this is where traffic from many cores meets. Data moving between
            two CCDs crosses the IO die too: core to core takes about 45 ns
            inside one CCD and about 150 ns across CCDs on an EPYC 9575F.
            <Cite s={S.chipsAndCheeseTurin} kind="measured" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The trade each design makes, so you can predict where placement matters most on it"
          >
            What changes when you cross a chiplet boundary
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">An L3 per die (AMD)</Box>
            <Box variant="p">
              Each CCD keeps its own L3, so a line held on another CCD is
              reached through the IO die, and threads that share data belong on
              one CCD. AMD&apos;s guidance is that most applications run well
              with the socket as one node, NPS1; NPS4 gives small gains for
              applications that tie their memory to the nearest cores.
              <Cite s={S.amdTurinArchWhitepaper} />
            </Box>
          </div>
          <div>
            <Box variant="h3">One mesh across dies (Intel)</Box>
            <Box variant="p">
              Xeon 6 slices its L3 across a mesh of core stops, and MDF (Modular
              Data Fabric) stops carry the mesh across EMIB (Embedded Multi-die
              Interconnect Bridge), a silicon bridge between dies. The L3 and
              the memory controllers sit on the compute tiles, so a crossing
              reaches another tile&apos;s cache and memory, and SNC3 (Sub-NUMA
              Clustering into three nodes) makes each tile a node.
              <Cite s={S.chipsAndCheeseXeon6} />
            </Box>
          </div>
          <div>
            <Box variant="h3">One package, one or two nodes (Graviton)</Box>
            <Box variant="p">
              Graviton4&apos;s cores share one LLC (last-level cache) on
              Arm&apos;s CMN-700 (Coherent Mesh Network).
              <Cite s={S.gravitonReadme} /> Graviton5 puts 192
              cores in one package
              <Cite s={S.graviton5AboutAmazon} />, and that package runs as two
              NUMA nodes on 16xlarge and 48xlarge, each node with its own LLC.
              <Cite s={S.gravitonReadme} note={GRAVITON5_NODE_NOTE} /> Size a
              working set against one node&apos;s LLC. No Graviton5 cross-node
              latency figure was located during this research.
            </Box>
          </div>
          <div>
            <Box variant="h3">
              A boundary the programmer never sees (NVIDIA)
            </Box>
            <Box variant="p">
              Hopper&apos;s GH100 is one 814 mm² die.
              <Cite s={S.hopperArchBlog} /> Blackwell joins two reticle-limited
              dies with NV-HBI (NVIDIA High-Bandwidth Interface)
              <Cite s={S.blackwellArchitecture} />
              <Cite s={S.blackwellUltraBlog} note={HBI_NOTE} />, and CUDA sees one device
              whose L2 both dies share with fully coherent access, so there is
              no NUMA split to program around.
              <Cite s={S.blackwellUltraBlog} />
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Five ways to split a processor into dies, what each shows software, and what a crossing measures"
          >
            How the major architectures compose
          </Header>
        }
      >
        <Table
          items={archRows}
          columnDefinitions={[
            {
              id: "arch",
              header: "Architecture",
              cell: (r) => r.arch,
              minWidth: 170,
            },
            {
              id: "dies",
              header: "Dies and die-to-die links",
              cell: (r) => r.dies,
              minWidth: 260,
            },
            {
              id: "numa",
              header: "What software sees",
              cell: (r) => r.numa,
              minWidth: 180,
            },
            {
              id: "cost",
              header: "Crossing cost",
              cell: (r) => r.cost,
              minWidth: 220,
            },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a 2026 package can mix dies from different vendors, and which interface tells you how"
          >
            Open die-to-die standards
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every die-to-die link above is proprietary: GMI, MDF over EMIB and
            NV-HBI join dies that one vendor designed together. UCIe (Universal Chiplet
            Interconnect Express) is the open standard for the die-to-die
            physical layer, written so one package can mix chiplets from a
            multi-vendor ecosystem. UCIe 3.0 runs at 48 and 64 GT/s
            (gigatransfers per second); the top rate doubles UCIe
            2.0&apos;s 32 GT/s.
            <Cite s={S.ucieSpecs} /> The OCP (Open Compute Project) base die in{" "}
            <em>High Bandwidth Flash</em> specifies 16 UCIe channels to its
            accelerator.
            <Cite s={S.ocpSpec} />
          </Box>
          <Box variant="p">
            Scale-up links follow. The UALink (Ultra Accelerator Link) Chiplet
            Specification 1.0, published in April 2026, is fully compliant with
            UCIe 3.0
            <Cite s={S.ualinkFourSpecs} />, and NVIDIA sells NVLink Fusion as a
            chiplet that hyperscalers drop into their own ASICs
            (application-specific integrated circuits); AWS is designing
            Trainium4 to integrate with NVLink 6.
            <Cite s={S.nvlinkFusionTrainium4} kind="roadmap" /> Read a
            multi-vendor package by its die-to-die interface: UCIe between
            different vendors&apos; chiplets, a UALink or NVLink Fusion chiplet
            for the scale-up domain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every boundary is also a shared queue: pin threads and memory so a latency-critical job crosses none"
          >
            Keep a job inside one NUMA node
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A load that crosses a boundary waits behind traffic from cores on
            other dies at the shared links and memory controllers. NUMA modes
            keep a job and its memory on one side:
          </Box>
          <ol>
            <li>
              List the nodes with{" "}
              <code style={{ whiteSpace: "nowrap" }}>numactl --hardware</code>.
              Graviton5 has two on 16xlarge and 48xlarge, so choose 24xlarge, or
              12xlarge and smaller, for one node
              <Cite s={S.gravitonReadme} note={GRAVITON5_NODE_NOTE} />; an r8i
              has three per chip
              <Cite s={S.chipsAndCheeseXeon6} />; on Turin, NPS is a BIOS
              setting, so you see the layout you were given
              <Cite s={S.amdTurinArchWhitepaper} />.
            </li>
            <li>
              Bind a latency-critical job&apos;s threads and memory to one node:{" "}
              <code>
                <span style={{ whiteSpace: "nowrap" }}>
                  numactl --cpunodebind=0
                </span>{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  --membind=0 &lt;command&gt;
                </span>
              </code>
              .
            </li>
            <li>
              Keep threads that exchange data on one CCD or tile: about 45 ns
              core to core instead of 150 on Turin.
              <Cite s={S.chipsAndCheeseTurin} kind="measured" />
            </li>
            <li>
              Size hot working sets against the cache one group of cores shares:
              32 MB per Turin CCD
              <Cite s={S.amdTurinArchWhitepaper} />, 160 MB per r8i compute tile
              <Cite s={S.chipsAndCheeseXeon6} />, 96 MB per Graviton5 node on
              24xlarge and 48xlarge
              <Cite s={S.gravitonReadme} />.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
