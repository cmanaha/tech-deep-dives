import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Nvl72Diagram } from '../components/Nvl72Diagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/GraceBlackwellUltraServer';

interface UltraServerRow {
  name: string;
  domain: React.ReactNode;
  efa: React.ReactNode;
  pick: React.ReactNode;
}

const ultraServerRows: UltraServerRow[] = [
  {
    name: 'u-p6e-gb200x72',
    domain: (
      <>
        72 B200 GPUs, 13,320 GB of GPU memory
        <Cite s={S.p6Page} />
      </>
    ),
    efa: (
      <>
        28,800 Gbps
        <Cite s={S.p6Page} />
      </>
    ),
    pick: <>Expert layouts over 36 GPUs, such as NVIDIA&apos;s 64-GPU DeepSeek-R1 layout</>,
  },
  {
    name: 'u-p6e-gb200x36',
    domain: (
      <>
        36 B200 GPUs, 6,660 GB of GPU memory
        <Cite s={S.p6Page} />
      </>
    ),
    efa: (
      <>
        14,400 Gbps
        <Cite s={S.p6Page} />
      </>
    ),
    pick: (
      <>Layouts of 36 GPUs or fewer; a 64-GPU layout splits across two domains and crosses EFA</>
    ),
  },
  {
    name: 'P6e-GB300',
    domain: (
      <>
        GB300 NVL72, close to 20 TB of GPU memory per UltraServer
        <Cite s={S.p6Page} />; the P6 page lists no sizes or per-GPU memory
      </>
    ),
    efa: <>No P6e-GB300 figure on the P6 page</>,
    pick: (
      <>
        1.5x the GPU memory and 1.5x the FP4 compute without sparsity of P6e-GB200.
        <Cite s={S.p6eGb300Ga} kind="vendor-claim" /> Ask your AWS sales representative
        <Cite s={S.p6eGb300Ga} />; it is absent from the EC2 instance specification and the
        UltraServer Capacity Blocks table.
        <Cite s={S.ec2AcceleratedSpecs} />
        <Cite s={S.capacityBlocks} />
      </>
    ),
  },
];

export function GraceBlackwellUltraServer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="One 72-GPU NVLink domain: what it holds, why an MoE expert layout fits it, and which P6e UltraServer to ask for"
          >
            Grace-Blackwell and the NVL72 UltraServer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Grace-Blackwell is.</strong> A Grace-Blackwell superchip pairs one
            NVIDIA Grace CPU with two Blackwell GPUs on one compute module.
            <Cite s={S.gb200Nvl72} />
            <Cite s={S.p6Page} /> NVLink-C2C (chip-to-chip), the chip-level member of the NVLink
            family, joins them coherently
            <Cite s={S.nvlinkC2c} /> at 900 GB/s bidirectional.
            <Cite s={S.blackwellArchitecture} />
          </Box>
          <Box variant="p">
            <strong>What NVL72 is.</strong> GB200 NVL72 is a rack of 36 superchips: 72 Blackwell
            GPUs and 36 Grace CPUs in a single NVLink domain, with 13.4 TB of HBM3e (High
            Bandwidth Memory) and 17 TB of LPDDR5X (low-power DDR5X).
            <Cite s={S.gb200Nvl72} /> Every GPU reaches every other GPU through a non-blocking
            NVLink Switch fabric at 1.8 TB/s bidirectional, 900 GB/s each way
            <Cite s={S.blackwellUltraBlog} />; aggregate NVLink bandwidth is 130 TB/s.
            <Cite s={S.gb200Nvl72} />
          </Box>
          <Box variant="p">
            GB300 NVL72, built on Blackwell Ultra, raises GPU memory to 20 TB and dense NVFP4
            (NVIDIA&apos;s 4-bit floating point) from 720 to 1,080 PFLOPS; the sparse peak stays at
            1,440 PFLOPS on both racks.
            <Cite s={S.gb200Nvl72} note="GB200 NVL72 NVFP4: 1,440 | 720 PFLOPS, sparse | dense." />
            <Cite
              s={S.gb300Nvl72}
              note="GB300 NVL72 FP4: 1,440 | 1,080 PFLOPS; the second figure is marked without sparsity."
            />{' '}
            The successor, Vera Rubin NVL72, keeps 72 GPUs and 36 CPUs with 20.7 TB of HBM4
            <Cite s={S.veraRubinNvl72} /> and is in full production at partners
            <Cite s={S.nvidiaQ2Fy27} />; as of October 2026 the EC2 instance specification lists
            no Rubin instance.
            <Cite s={S.ec2AcceleratedSpecs} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every GPU reaches every other at the same 1.8 TB/s, so the boundary to plan around is the edge of the domain"
          >
            The rack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Nvl72Diagram />
          <Box variant="small" color="text-body-secondary">
            Rack and superchip configuration, memory totals, 130 TB/s, cores and 480 GB per Grace
            <Cite s={S.gb200Nvl72} />; 186 GB per GPU
            <Cite
              s={S.gb200Nvl72}
              kind="derived"
              note="372 GB of HBM3e per superchip, divided by its two GPUs."
            />
            ; non-blocking 1.8 TB/s per GPU
            <Cite s={S.blackwellUltraBlog} />; NVLink-C2C
            <Cite s={S.blackwellArchitecture} />; the DeepSeek-R1 layout
            <Cite s={S.moeBlog} />.
          </Box>
          <Box variant="p">
            The fabric is non-blocking, so each GPU&apos;s 1.8 TB/s reaches whichever peers it
            addresses.
            <Cite s={S.blackwellUltraBlog} /> That suits mixture-of-experts (MoE) all-to-all, in
            which every GPU sends tokens to experts held on other GPUs.
            <Cite s={S.moeBlog} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="NVIDIA's DeepSeek-R1 layout needs 64 GPUs, and one NVL72 domain holds it with 8 to spare"
          >
            Why 72 GPUs fits MoE
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="A 64-GPU expert layout in a 72-GPU domain">
            DeepSeek-R1 sends each token to eight of its 256 routed experts.
            <Cite s={S.moeBlog} /> NVIDIA&apos;s DeepSeek-R1 decode layout places about four
            routed experts per GPU, so 64 GPUs hold all 256
            <Cite s={S.moeBlog} />: expert parallelism (EP) of 64, inside one NVL72 domain with
            eight GPUs to spare. NVIDIA names the cost of leaving the domain: &quot;If the
            selected experts reside on GPUs that sit on different nodes, the all-to-all
            communication becomes bottlenecked by slower internode communication protocols, such
            as InfiniBand.&quot;
            <Cite s={S.moeBlog} /> On AWS the network beyond the domain is EFA (Elastic Fabric
            Adapter).
            <Cite s={S.p6Page} />
          </Alert>
          <Box variant="p">
            TensorRT-LLM&apos;s Wide-EP path carries that all-to-all over GB200 Multi-Node NVLink
            (MNNVL)
            <Cite s={S.wideEpReadme} />; large-scale EP shipped in TensorRT-LLM v0.21.0 (August
            2025).
            <Cite s={S.trtllmV021} note="Published 2025-08-04." /> Start from the{' '}
            <Link external href={S.wideEpReadme.url}>
              Wide-EP example at v1.2.1
            </Link>
            , whose configuration example is DeepSeek R1 at 32-way EP.
            <Cite s={S.wideEpReadme} /> <em>NVIDIA Compilers and Kernel Tooling</em> covers
            TensorRT-LLM itself.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="480 GB of coherent CPU memory per superchip, the bandwidth figure to plan with, and the NUMA setting to check"
          >
            The Grace half of the superchip
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">CPU memory: 480 GB LPDDR5X</Box>
            <Box variant="p">
              Each Grace carries up to 480 GB of LPDDR5X
              <Cite s={S.gb200Nvl72} />, soldered on the compute module it shares with its two
              GPUs.
              <Cite s={S.p6Page} /> The memory draws about 16 W at up to 500 GB/s.
              <Cite s={S.graceSuperchipPage} /> Two NVIDIA pages disagree on its bandwidth: up to
              512 GB/s per GB200 superchip
              <Cite s={S.gb200Nvl72} />, against up to 384 GB/s for a 480 GB Grace.
              <Cite s={S.graceSuperchipPage} note="Grace CPU C1 column: 'Up to 384 GB/s for 480GB'." />{' '}
              Plan offload bandwidth against the lower figure. <em>DDR5, MRDIMM, LPDDR5X and CXL</em>{' '}
              covers the memory type.
            </Box>
          </div>
          <div>
            <Box variant="h3">NVLink-C2C: 900 GB/s bidirectional</Box>
            <Box variant="p">
              NVLink-C2C joins the CPU to its GPUs at 900 GB/s bidirectional
              <Cite s={S.blackwellArchitecture} />, the figure Hopper&apos;s NVLink gives a whole
              GPU.
              <Cite
                s={S.blackwellUltraBlog}
                note="Table 1 lists NVLink-C2C and Hopper NVLink both at 900, in bidirectional GB/s."
              />{' '}
              The link is coherent
              <Cite s={S.nvlinkC2c} />, so a KV (key-value) cache offloaded to Grace memory returns
              over it; the <Link href="../vllm/">vLLM dive</Link>&apos;s KV Offloading and LMCache
              section covers the software.
            </Box>
            <Box variant="p">
              GPU memory on GB200 and GB300 NVL72 appears to the OS as NUMA (non-uniform memory
              access) nodes. Bind host memory to the CPU nodes (the Wide-EP guide uses{' '}
              <code>numactl -m 0,1</code>), or turn on Coherent Driver-Based Memory Management
              (CDMM, from the R580 driver), which keeps GPU memory out of the NUMA map; with CDMM
              on, Wide-EP&apos;s online load balancer needs GDRCopy.
              <Cite s={S.wideEpReadme} />
            </Box>
          </div>
          <div>
            <Box variant="h3">Host cores: 72 Arm Neoverse V2</Box>
            <Box variant="p">
              Each Grace has 72 Arm Neoverse V2 cores
              <Cite s={S.gb200Nvl72} />, the core Graviton4 uses.
              <Cite s={S.gravitonReadme} /> The P6e-GB200 host is arm64
              <Cite s={S.ec2AcceleratedSpecs} />, so host binaries and container images need arm64
              builds (see <em>Graviton Deep Dive</em>).
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which P6e UltraServer to ask for: a 72- or 36-GPU GB200 domain, or GB300 through AWS sales"
          >
            Grace-Blackwell on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            P6e-GB200 is AWS&apos;s GB200 NVL72.
            <Cite s={S.p6Page} /> It comes only as an UltraServer, the EC2 unit that joins
            instances over the accelerator interconnect
            <Cite s={S.capacityBlocks} />, of 72 or 36 GPUs
            <Cite s={S.p6Page} />, built from <code>p6e-gb200.36xlarge</code> instances of four
            B200 GPUs (4 x 185 GiB) on a Grace arm64 host.
            <Cite s={S.ec2AcceleratedSpecs} /> P6e-GB200 UltraServers can be reserved through
            Capacity Blocks for ML.
            <Cite s={S.capacityBlocks} /> The UltraServer size is the NVLink domain size, so
            match it to the expert layout.
          </Box>
          <ExpandableSection headerText="How far NVLink and EFA sit apart, per GPU">
            <Box variant="p">
              Inside the domain a GPU has 900 GB/s each way over NVLink.
              <Cite s={S.blackwellUltraBlog} /> Beyond it, AWS gives 400 Gbps of
              fourth-generation EFA per GPU
              <Cite s={S.p6Page} />: 50 GB/s, 18 times less.
              <Cite s={S.p6Page} kind="derived" note="400 Gbps / 8 = 50 GB/s; 900 / 50 = 18." />{' '}
              The instance specification&apos;s 3.2 Tbps per four-GPU{' '}
              <code>p6e-gb200.36xlarge</code>
              <Cite s={S.ec2AcceleratedSpecs} /> works out to 100 GB/s per GPU, 9 times less.
              <Cite
                s={S.ec2AcceleratedSpecs}
                kind="derived"
                note="3,200 Gbps / 4 GPUs = 800 Gbps = 100 GB/s; 900 / 100 = 9."
              />{' '}
              Neither EFA figure carries a direction label; both ratios read them as
              per-direction line rates. Nine 8-GPU P6-B200 nodes get the same 400 Gbps per GPU
              <Cite s={S.p6Page} /> in NVLink domains of eight, so a 64-GPU expert layout spans
              eight nodes and its all-to-all crosses EFA.
            </Box>
          </ExpandableSection>
          <Table
            items={ultraServerRows}
            columnDefinitions={[
              { id: 'name', header: 'UltraServer', cell: (r) => <code>{r.name}</code>, minWidth: 150 },
              { id: 'domain', header: 'NVLink domain', cell: (r) => r.domain, minWidth: 170 },
              { id: 'efa', header: 'EFA, aggregate', cell: (r) => r.efa, minWidth: 110 },
              { id: 'pick', header: 'Pick it for', cell: (r) => r.pick, minWidth: 240 },
            ]}
            variant="embedded"
            wrapLines
          />
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
