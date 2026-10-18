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
import { Cite } from '../components/Cite';
import { S } from '../sources/MemoryHierarchyPrimer';

const hostLinkNote =
  'PCIe 5.0 signals at 32 GT/s per lane: 32 x 16 lanes / 8 bits = 64 GB/s per direction before encoding.';
const p5enStepNote =
  'H200: 141 GB at 4,800 GB/s. Host DRAM on p5en: 2,048 GiB / 8 GPUs = 256 GiB (274.9 GB) per GPU at 64 GB/s per direction. 4,800 / 64 = 75; 274.9 / 141 = 1.95.';
const rubinNote =
  'Individual GPU Specifications table: 288 GB HBM4 | 22 TB/s. The Vera Rubin NVL72 page gives 19.2 TB/s per GPU; this section uses the HGX figure.';
const dramRangeNote =
  '12 channels x 8 bytes x 6,400 MT/s (DDR5) = 614.4 GB/s; x 8,800 MT/s (MRDIMM) = 844.8 GB/s.';
const bwNote4 = '12 channels x 5.6 GT/s x 8 bytes = 537.6 GB/s; / 96 cores = 5.6 GB/s.';
const bwNote5 =
  '12 channels x 8.8 GT/s x 8 bytes = 844.8 GB/s; / 192 cores = 4.4 GB/s, 21% below 5.6 GB/s; 844.8 / 537.6 = 1.57.';
const nvmeNote =
  '8 x 3,800 GB = 30.4 TB. 4.4 M IOPS x 4,096 B / 8 GPUs = 2.25 GB/s; EBS 12,500 MB/s on p5en and P6 / 8 = 1.56 GB/s.';

interface TierCompareRow {
  tier: string;
  host: React.ReactNode;
  gpu: React.ReactNode;
  trainium: React.ReactNode;
}

const compareRows: TierCompareRow[] = [
  {
    tier: 'Register file',
    host: 'Per core',
    gpu: (
      <>
        256 KB per SM
        <Cite s={S.hopperTuningGuide} kind="derived" note="64K 32-bit registers per SM x 4 bytes = 256 KB; the Blackwell guide gives the same count." />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    trainium: '-',
  },
  {
    tier: 'SRAM scratchpad',
    host: '-',
    gpu: (
      <>
        SMEM up to 228 KB per SM
        <Cite s={S.hopperTuningGuide} />; TMEM 256 KB per SM on Blackwell
        <Cite s={S.ptxIsa} kind="derived" note="512 columns x 128 lanes x 32 bits = 256 KB. PTX states the geometry per CTA." />
      </>
    ),
    trainium: (
      <>
        SBUF 28 MiB (Trn2) or 32 MiB (Trn3) per NeuronCore; PSUM 2 MiB
        <Cite s={S.nkiTrn2Arch} />
        <Cite s={S.nkiTrn3Arch} />
      </>
    ),
  },
  {
    tier: 'L1 cache',
    host: (
      <>
        48 KB (Golden Cove) to 64 KB (Graviton) of data per core
        <Cite s={S.intelOrm} />
        <Cite s={S.gravitonReadme} />
      </>
    ),
    gpu: (
      <>
        Shares 256 KB per SM with SMEM
        <Cite s={S.hopperTuningGuide} />
      </>
    ),
    trainium: (
      <>
        None documented; SBUF is software-managed
        <Cite s={S.neuronCoreV3} />
      </>
    ),
  },
  {
    tier: 'L2 cache',
    host: (
      <>
        2 MB per core (Xeon 6, Graviton4 and 5)
        <Cite s={S.intelOrm} />
        <Cite s={S.gravitonReadme} />
      </>
    ),
    gpu: (
      <>
        Chip-wide: 50 MB (H100), 126 MB (GB200)
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    trainium: '-',
  },
  {
    tier: 'LLC',
    host: (
      <>
        36 MB (Graviton4) to 504 MB (Xeon 6980P)
        <Cite s={S.gravitonReadme} />
        <Cite s={S.xeon6980pArk} />
      </>
    ),
    gpu: (
      <>
        None; L2 is the last level
        <Cite s={S.hopperTuningGuide} />
      </>
    ),
    trainium: '-',
  },
  {
    tier: 'HBM',
    host: '-',
    gpu: (
      <>
        80 GB at 3.35 TB/s (H100)
        <Cite s={S.h100Page} />; 141 GB at 4.8 TB/s (H200)
        <Cite s={S.h200Page} />; 288 GB of HBM4 at 22 TB/s (Rubin)
        <Cite s={S.hgxPage} note={rubinNote} />
      </>
    ),
    trainium: (
      <>
        96 GiB at 2.9 TB/s (Trn2)
        <Cite s={S.trainium2Arch} />; 144 GiB at 4.9 TB/s (Trn3)
        <Cite s={S.trainium3Arch} />
      </>
    ),
  },
  {
    tier: 'Host DRAM',
    host: (
      <>
        12 channels: 614 to 845 GB/s
        <Cite s={S.xeon6980pArk} kind="derived" note={dramRangeNote} /> and up to 6 TB per socket
        <Cite s={S.epyc9005Datasheet} />
      </>
    ),
    gpu: (
      <>
        PCIe Gen5 x16, 64 GB/s per direction
        <Cite s={S.xeon6Brief} kind="derived" note={hostLinkNote} />; NVLink-C2C, 900 GB/s
        bidirectional (GB200)
        <Cite s={S.blackwellArchitecture} />
      </>
    ),
    trainium: '-',
  },
  {
    tier: 'CXL and remote HBM',
    host: (
      <>
        CXL 2.0 pooling, CXL 3.0 sharing
        <Cite s={S.cxl3Spec} />
      </>
    ),
    gpu: (
      <>
        Other GPUs&apos; HBM over NVLink: 13.4 TB per GB200 NVL72
        <Cite s={S.gb200Nvl72} />, 900 GB/s each way
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    trainium: (
      <>
        Other chips&apos; HBM through NeuronLink pooling, up to 64 Trn2 chips
        <Cite s={S.trainium2Arch} />
      </>
    ),
  },
  {
    tier: 'NVMe flash',
    host: (
      <>
        Bounce buffer, unless GDS reads straight into GPU memory
        <Cite s={S.gdsOverview} />
      </>
    ),
    gpu: (
      <>
        8 x 3,800 GB of instance store (P5, P6)
        <Cite s={S.ec2AcceleratedSpecs} />; FSx for Lustre with GDS, 1,200 Gb/s
        <Cite s={S.fsxPerformance} />
      </>
    ),
    trainium: (
      <>
        4 x 1,900 GB of instance store (trn2.48xlarge)
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
  },
];

export function MemoryHierarchyPrimer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know which tier a working set lands in, and what each step down from registers to NVMe flash costs in bandwidth and latency"
          >
            Memory Hierarchy Primer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What the hierarchy is.</strong> Every architecture in this deep dive answers one
            question: where do the operands live when the unit executes? The memory hierarchy is the
            map for comparing the answers, from registers and on-chip SRAM (static RAM) down to NVMe
            (Non-Volatile Memory Express) flash.
          </Box>
          <Box variant="p">
            <strong>How it behaves.</strong> Lower tiers mostly hold more and deliver less, in
            uneven steps.
            On a p5en instance an H200 reads its 141 GB of HBM (High Bandwidth Memory) at 4.8 TB/s
            <Cite s={S.h200Page} />, and host DRAM (dynamic RAM), 256 GiB per GPU
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="2,048 GiB of host memory / 8 GPUs." />,
            over PCIe Gen5 x16 at 64 GB/s per direction
            <Cite s={S.xeon6Brief} kind="derived" note={hostLinkNote} />: 75 times less bandwidth
            for under twice the capacity.
            <Cite s={S.h200Page} kind="derived" note={p5enStepNote} /> High Bandwidth Flash (HBF)
            breaks the pattern: 512 GiB stacks of flash beside HBM on the accelerator package
            <Cite s={S.ocpSpec} />, and Sandisk claims 1.6 TB/s for its first, 25 times that PCIe
            link, with no trip through the CPU.
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" />
            <Cite s={S.sandiskFactSheet} kind="derived" note="1,600 GB/s / 64 GB/s = 25." /> No HBF
            product ships as of October 2026.
            <Cite
              s={S.sandiskInvestorDay2026}
              kind="roadmap"
              note="Sandisk: first HBF memory die taped out in August 2026; samples of inference devices with HBF targeted for 2027."
            />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read capacity, bandwidth and latency per tier off one chart, and see where High Bandwidth Flash and NVMe flash join it"
          >
            The map, from registers to flash
          </Header>
        }
      >
        <SpaceBetween size="m">
          <MemoryHierarchyTower />
          <Box variant="small" color="text-body-secondary">
            Scratchpads: SMEM (shared memory) and TMEM (Tensor Memory) in an NVIDIA SM (Streaming
            Multiprocessor), SBUF (State Buffer) and PSUM (Partial Sum buffer) in a Trainium
            NeuronCore. LLC is the last-level cache; CXL, Compute Express Link; EBS, Elastic Block
            Store; GDS, GPUDirect Storage. Latencies are
            measurements, not specifications: SMEM, L1, L2 and HBM in H800 cycles
            <Cite s={S.luoHopperBench} kind="measured" />, L3 on AWS r8i
            <Cite s={S.chipsAndCheeseXeon6} kind="measured" />, DRAM and CXL at idle on
            Samsung&apos;s platform
            <Cite
              s={S.samsungCmmD}
              kind="vendor-claim"
              note="Samsung measured local DRAM at 144 ns and its CMM-D CXL module at 254 ns, both idle."
            />
            ; HBF studies assume 1 to 20 µs reads
            <Cite s={S.flint} kind="simulated" note="Simulator input: 1 to 2 µs, SLC flash." />
            <Cite s={S.hbfSim} kind="simulated" note="Simulator input: about 20 µs per page read." />.
            Rubin&apos;s 22 TB/s is the per-GPU figure on NVIDIA&apos;s HGX page; the Vera Rubin
            NVL72 page gives 19.2 TB/s.
            <Cite s={S.veraRubinNvl72} /> A CXL x16 link carries 64 GB/s per direction
            <Cite s={S.xeon6Brief} kind="derived" note={hostLinkNote} />; the per-family table below
            and{' '}
            <em>Capacity beyond HBM and DRAM</em> cite the rest. A hyphen marks no sourced figure;
            HBF is dashed because no product ships.
          </Box>
          <ExpandableSection headerText="Each tier on a host CPU, an NVIDIA GPU and AWS Trainium">
            <Table
              items={compareRows}
              columnDefinitions={[
                { id: 'tier', header: 'Tier', cell: (r) => r.tier, minWidth: 130 },
                { id: 'host', header: 'Host CPU', cell: (r) => r.host, minWidth: 200 },
                { id: 'gpu', header: 'NVIDIA GPU', cell: (r) => r.gpu, minWidth: 240 },
                { id: 'trn', header: 'AWS Trainium', cell: (r) => r.trainium, minWidth: 200 },
              ]}
              variant="embedded"
              wrapLines
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Who owns placement decides where a performance bug shows up and where you fix it"
          >
            Scratchpads: on-chip memory the compiler owns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Caches (L1, L2 and the LLC) are hardware-managed: the hardware evicts lines by its
            replacement policy, and software only reads and writes memory. A scratchpad is
            software-managed SRAM: the compiler or kernel author emits copies in and out and commits
            to which bytes are resident at each point in the schedule. It is the tier most often
            missed, and the one accelerators build on. Trainium2&apos;s SBUF holds 28 MiB per
            NeuronCore, about 126 times a Hopper SM&apos;s 228 KB of SMEM
            <Cite s={S.nkiTrn2Arch} kind="derived" note="28 MiB / 228 KB, with 1 KB = 1,024 bytes: about 126." />
            <Cite s={S.hopperTuningGuide} />, with no cache in front of it
            <Cite s={S.neuronCoreV3} />; Blackwell&apos;s TMEM holds the tiles its tcgen05
            tensor-core instructions work on.
            <Cite s={S.ptxIsa} /> <em>NVIDIA Blackwell</em> and <em>AWS Trainium, Inferentia and
            Neuron</em> cover how kernels use each.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Cache miss</Box>
              <ul>
                <li>Invisible to the compiler</li>
                <li>Shows up as tail latency at run time</li>
                <li>
                  Mitigation is hardware prefetch, larger caches and NUMA (non-uniform memory
                  access) locality
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Scratchpad miss</Box>
              <ul>
                <li>Cannot happen at run time, because the compiler already placed every byte</li>
                <li>
                  Shows up as a schedule slip at compile time (Trainium) or a lower-occupancy
                  kernel (GPU)
                </li>
                <li>Mitigation is re-tiling the operator at compile time</li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why decode waits on HBM, and what spilling past it costs on a GPU instance"
          >
            The bandwidth wall sits at HBM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An inference accelerator pairs 3.35 TB/s (H100)
            <Cite s={S.h100Page} /> to 22 TB/s (Rubin)
            <Cite s={S.hgxPage} note={rubinNote} /> of HBM per GPU with enough tensor throughput
            that decode, which reads every weight for each token, sits below the ridge point (
            <em>Roofline and Arithmetic Intensity</em>). Raising HBM bandwidth is expensive: each
            stack is DRAM dies on a base logic die, joined by TSVs (through-silicon vias), beside
            the accelerator on its package, and each generation needs new packaging work (
            <em>HBM and the Bandwidth Wall</em>).
          </Box>
          <Box variant="p">
            Spilling past HBM costs 75 times the bandwidth for under twice the capacity: an H200 on
            p5en reaches host DRAM at 64 GB/s per direction.
            <Cite s={S.h200Page} kind="derived" note={p5enStepNote} /> GB200&apos;s NVLink-C2C
            raises that link to 900 GB/s bidirectional
            <Cite s={S.blackwellArchitecture} />, and <em>Grace-Blackwell and UltraServer</em>{' '}
            covers offloading KV (key-value) cache over it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Divide socket bandwidth by busy cores before moving a bandwidth-bound service to a bigger CPU"
          >
            Bandwidth per core can fall as cores rise
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Socket bandwidth rises each generation, and core count can rise faster. Graviton5&apos;s
            12 channels of DDR5-8800 give 844.8 GB/s, 57% more than Graviton4, but across 192 busy
            cores that is 4.4 GB/s per core, 21% less than Graviton4&apos;s 5.6.
            <Cite s={S.r8gPreview} kind="derived" note={bwNote4} />
            <Cite s={S.m9gGa} kind="derived" note={bwNote5} />
          </Box>
          <Box variant="p">
            Services that need bandwidth per thread, such as databases, JVM (Java Virtual Machine)
            services heavy on garbage collection and memory-bound analytics, can run slower on the
            chip with more cores. Compare bandwidth per busy vCPU, not per socket;{' '}
            <em>Graviton Deep Dive</em> has the Graviton numbers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose CXL for host memory capacity, High Bandwidth Flash for bytes read every step and NVMe for KV cache read once per hit"
          >
            Capacity beyond HBM and DRAM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="CXL adds capacity, not speed">
            CXL 2.0 attaches memory to a socket over PCIe 5.0 signalling (up to 64 lanes on Xeon 6
            <Cite s={S.xeon6Brief} />), and CXL 3.0 adds sharing between hosts.
            <Cite s={S.cxl3Spec} /> Each load costs more: 254 ns idle for Samsung&apos;s CMM-D module
            against 144 ns for local DRAM on Samsung&apos;s platform
            <Cite s={S.samsungCmmD} kind="vendor-claim" />, and in Pond&apos;s estimates 70 to 90 ns
            extra in pools of 8 to 16 sockets, over 180 ns at rack scale.
            <Cite
              s={S.pond}
              kind="simulated"
              note="CXL 'will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling.'"
            />{' '}
            Use it for capacity-bound data such as recommender embeddings and retrieval indexes (
            <em>DDR5, MRDIMM, LPDDR5X and CXL</em>).
          </Alert>
          <Box variant="p">
            <strong>High Bandwidth Flash attaches to the accelerator, beside HBM.</strong> The OCP
            (Open Compute Project) specification sets 512 GiB per 16-high stack and 0.384 to 3.072
            TB/s per stack across its speed grades.
            <Cite s={S.ocpSpec} /> A first-generation stack can be read end to end about 3 times a
            second, a shipping HBM4 stack about 80 times
            <Cite s={S.sandiskFactSheet} kind="derived" note="1.6 TB/s / 512 GB = 3.1 per second." />
            <Cite s={S.micronHbm4} kind="derived" note="2.8 to 3.3 TB/s over a 36 GB 12-high stack = 78 to 92 per second." />
            , and no read latency is published.
            <Cite
              s={S.sandiskFactSheet}
              kind="vendor-claim"
              note="Sandisk states that HBF latency is higher than HBM's and gives no figure."
            />{' '}
            That ratio decides what HBF can hold (<em>High Bandwidth Flash</em>).
          </Box>
          <Box variant="p">
            <strong>NVMe flash sits off the package, behind PCIe or the network,</strong> as the KV
            cache tier below host DRAM, and it ships today. An 8-GPU P5en or P6 carries 8 x 3,800 GB
            (30.4 TB) of instance store
            <Cite s={S.ec2AcceleratedSpecs} />, at no less than 2.25 GB/s per GPU; FSx for Lustre
            with GDS reaches 18.75 GB/s per GPU, EBS 1.56.
            <Cite s={S.ec2AcceleratedSpecs} kind="derived" note={nvmeNote} />
            <Cite s={S.fsxPerformance} kind="derived" note="1,200 Gb/s per instance / 8 bits / 8 GPUs = 18.75 GB/s." />{' '}
            <em>Flash as a Cache Tier for Inference</em> shows when reading KV beats recomputing it.
          </Box>
          <Box variant="p">
            <strong>Place each byte by how often it is read.</strong> Our reading of these figures:
            bytes read every decode step go in HBM, or HBF once it ships; KV prefixes read once per
            cache hit go to host DRAM, then NVMe; host data that tolerates about 110 ns more per load
            goes on CXL.
            <Cite s={S.samsungCmmD} kind="derived" note="254 - 144 = 110 ns, both idle on Samsung's platform." />{' '}
            Keep per-token KV off HBF: limited write endurance makes it &quot;infeasible for KV Cache
            data updated for every query or generation token&quot;.
            <Cite s={S.maPatterson} /> The <Link href="../vllm/">vLLM dive</Link>&apos;s KV
            Offloading and LMCache section covers the software that moves KV between these tiers.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
