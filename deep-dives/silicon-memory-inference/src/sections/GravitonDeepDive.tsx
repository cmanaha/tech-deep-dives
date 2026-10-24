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
import { GravitonComparison } from '../components/GravitonComparison';
import { Cite } from '../components/Cite';
import { S } from '../sources/GravitonDeepDive';

interface SpecRow {
  spec: string;
  g4: React.ReactNode;
  g5: React.ReactNode;
}

const bwNote4 = '12 channels x 5.6 GT/s x 8 bytes = 537.6 GB/s; / 96 cores = 5.6 GB/s.';
const bwNote5 =
  '12 channels x 8.8 GT/s x 8 bytes = 844.8 GB/s; / 192 cores = 4.4 GB/s, 21% below 5.6 GB/s. No AWS aggregate figure was located during this research.';
const domainNote =
  '192 cores over the two NUMA nodes AWS lists for 48xlarge; 96 MB LLC / 96 cores = 1 MB per core.';

const specRows: SpecRow[] = [
  {
    spec: 'ISA (instruction set architecture)',
    g4: (
      <>
        Armv9.0-A
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        Armv9.2-A
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'Cores',
    g4: (
      <>
        96 per socket; the two-socket 48xlarge has 192
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        192 in one package
        <Cite s={S.graviton5AboutAmazon} />
      </>
    ),
  },
  {
    spec: 'Clock',
    g4: (
      <>
        2.8 GHz (2.7 GHz on 48xlarge), no turbo
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        3.3 GHz, no turbo
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'L1 instruction / data, per core',
    g4: (
      <>
        64 / 64 KB
        <Cite s={S.gravitonReadme} />; 4-cycle L1D
        <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />
      </>
    ),
    g5: (
      <>
        64 / 64 KB
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'L2 per core',
    g4: (
      <>
        2 MB
        <Cite s={S.gravitonReadme} />; 11 cycles
        <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />
      </>
    ),
    g5: (
      <>
        2 MB
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'L3 (last-level cache)',
    g4: (
      <>
        36 MB, one cache shared by all cores, on the CMN-700 mesh
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        2 x 96 MB, one per NUMA node, on the CMN-S3 mesh; sizes up to 16xlarge see 48 MB per node
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'L3 per core',
    g4: (
      <>
        0.375 MB
        <Cite s={S.gravitonReadme} kind="derived" note="36 MB / 96 cores = 0.375 MB." />
      </>
    ),
    g5: (
      <>
        1 MB within a node
        <Cite s={S.gravitonReadme} kind="derived" note={domainNote} />; AWS: 2.6x Graviton4
        <Cite s={S.graviton5AboutAmazon} />
      </>
    ),
  },
  {
    spec: 'Memory',
    g4: (
      <>
        12 x DDR5-5600
        <Cite s={S.r8gPreview} />; 24 channels on the two-socket 48xlarge
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        12 x DDR5-8800
        <Cite s={S.gravitonReadme} />
        <Cite s={S.m9gGa} />
      </>
    ),
  },
  {
    spec: 'Peak DRAM bandwidth',
    g4: (
      <>
        537.6 GB/s
        <Cite s={S.r8gPreview} kind="derived" note={bwNote4} />
      </>
    ),
    g5: (
      <>
        844.8 GB/s
        <Cite s={S.m9gGa} kind="derived" note={bwNote5} />
      </>
    ),
  },
  {
    spec: 'DRAM bandwidth per core, every core busy',
    g4: (
      <>
        5.6 GB/s
        <Cite s={S.r8gPreview} kind="derived" note={bwNote4} />
      </>
    ),
    g5: (
      <>
        4.4 GB/s (21% less)
        <Cite s={S.m9gGa} kind="derived" note={bwNote5} />
      </>
    ),
  },
  {
    spec: 'NUMA nodes',
    g4: (
      <>
        1; 2 on the two-socket 48xlarge
        <Cite s={S.gravitonReadme} />, 138.6 ns across sockets on average
        <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />
      </>
    ),
    g5: (
      <>
        1; 2 on 16xlarge and 48xlarge
        <Cite s={S.gravitonReadme} />
      </>
    ),
  },
  {
    spec: 'Core-to-core latency',
    g4: (
      <>
        30 to 60 ns across the mesh
        <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />
      </>
    ),
    g5: (
      <>
        Up to 33% lower than Graviton4, by AWS&apos;s claim
        <Cite s={S.graviton5AboutAmazon} kind="vendor-claim" />
      </>
    ),
  },
  {
    spec: 'Instances',
    g4: (
      <>
        C8g, M8g, R8g, X8g, I8g
        <Cite s={S.gravitonReadme} />
      </>
    ),
    g5: (
      <>
        M9g, M9gd, C9g, C9gd, R9g, R9gd, on Nitro v6
        <Cite s={S.ec2GeneralPurposeSpecs} />
        <Cite s={S.ec2ComputeOptimizedSpecs} />
        <Cite s={S.ec2MemoryOptimizedSpecs} />
      </>
    ),
  },
];

interface SizeRow {
  size: string;
  vcpus: string;
  nodes: string;
  llc: string;
}

const sizeRows: SizeRow[] = [
  { size: 'medium to 12xlarge', vcpus: '1 to 48', nodes: '1', llc: '48 MB' },
  { size: '16xlarge', vcpus: '64', nodes: '2', llc: '48 MB' },
  { size: '24xlarge', vcpus: '96', nodes: '1', llc: '96 MB' },
  { size: '48xlarge', vcpus: '192', nodes: '2', llc: '96 MB' },
];

export function GravitonDeepDive() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read Graviton5 as two 96-core NUMA domains in one package, then pick the instance size and thread placement that keep a job inside one of them"
          >
            Graviton Deep Dive
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Graviton is AWS&apos;s own line of Arm Neoverse server CPUs. Both current generations
            serve general server work and, increasingly, the host side of inference:
            orchestration, tokenization and KV-cache (key-value cache) management for a GPU or
            Trainium accelerator. Graviton4 (Neoverse V2) was announced at re:Invent 2023
            <Cite s={S.r8gPreview} /> and has been generally available since July 2024, starting
            with R8g
            <Cite s={S.r8gGa} />. Graviton5 (Neoverse V3
            <Cite s={S.gravitonReadme} />) was announced in December 2025
            <Cite s={S.graviton5AboutAmazon} />; M9g became generally available in June 2026
            <Cite s={S.m9gGa} />, C9g later that month
            <Cite s={S.c9gGa} /> and R9g in August 2026
            <Cite s={S.r9gGa} />. Graviton5 is the first CPU in the AWS fleet with PCIe Gen6 and
            DDR5-8800
            <Cite s={S.m9gGa} />, and M9g and M9gd introduced the Nitro Isolation Engine (NIE)
            <Cite s={S.m9gGa} /> (<em>Isolation: NIE and MIG</em>).
          </Box>
          <Box variant="p">
            <strong>The model to carry.</strong> Graviton5 puts 192 cores in a single package
            <Cite s={S.graviton5AboutAmazon} />, and that package runs as two NUMA (Non-Uniform
            Memory Access) nodes, each with its own 96 MB last-level cache (LLC)
            <Cite s={S.gravitonReadme} />: two domains of 96 cores
            <Cite s={S.gravitonReadme} kind="derived" note={domainNote} />. Package DRAM
            bandwidth rose 57% over Graviton4 while the share per core fell 21%
            <Cite s={S.m9gGa} kind="derived" note={bwNote5} />. Placement on Graviton5 follows
            from those two facts: size working sets against one domain&apos;s 96 MB, keep a job
            inside one domain where you can, and expect less DRAM bandwidth per busy core than
            on Graviton4.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The figures that size a move from Graviton4 to Graviton5, with AWS specifications, our arithmetic and third-party measurements marked apart"
          >
            Graviton4 and Graviton5 side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <GravitonComparison />
          <Box variant="small" color="text-body-secondary">
            Cores, clocks, caches, NUMA nodes and channel counts
            <Cite s={S.gravitonReadme} />; DDR5-5600
            <Cite s={S.r8gPreview} />; DDR5-8800
            <Cite s={S.m9gGa} />; bandwidth, per-core figures and the 96-core domains are our
            arithmetic on those
            <Cite s={S.gravitonReadme} kind="derived" note={`${bwNote4} ${bwNote5}`} />; 24xlarge
            has 96 vCPUs
            <Cite s={S.ec2GeneralPurposeSpecs} />.
          </Box>
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 130 },
              { id: 'g4', header: 'Graviton4 (Neoverse V2)', cell: (r) => r.g4, minWidth: 210 },
              { id: 'g5', header: 'Graviton5 (Neoverse V3)', cell: (r) => r.g5, minWidth: 210 },
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
            description="Why a 192-core Graviton5 behaves like two 96-core domains sharing a package, and what that does to cache and DRAM bandwidth per core"
          >
            Two NUMA domains, each with its own LLC
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A NUMA node is a group of cores with the cache and memory closest to them; a thread
            reaches its own node&apos;s cache and memory faster than another node&apos;s.
          </Box>
          <Box variant="p">
            <strong>Graviton4 is one node.</strong> All 96 cores share one 36 MB LLC on Arm&apos;s
            CMN-700 Coherent Mesh Network
            <Cite s={S.gravitonReadme} />, 0.375 MB per core
            <Cite s={S.gravitonReadme} kind="derived" note="36 MB / 96 cores = 0.375 MB." />. Only the
            two-socket 48xlarge adds a second node.
          </Box>
          <Box variant="p">
            <strong>Graviton5 is two nodes in one package.</strong> Each node has its own 96 MB
            LLC on the CMN-S3 mesh
            <Cite s={S.gravitonReadme} />, which gives each 96-core domain 1 MB of LLC per core
            <Cite s={S.gravitonReadme} kind="derived" note={domainNote} />. AWS counts this as a
            5x larger L3 than Graviton4
            <Cite s={S.m9gGa} /> and 2.6x more L3 per core
            <Cite s={S.graviton5AboutAmazon} />. The fast cache for a thread is its own
            node&apos;s 96 MB, so size working sets against 96 MB rather than the
            package&apos;s 192 MB. AWS credits the single package with up to 33% lower
            inter-core latency than Graviton4
            <Cite s={S.graviton5AboutAmazon} kind="vendor-claim" />.
          </Box>
          <Alert type="warning" header="DRAM bandwidth per core fell about 21%">
            Graviton4 runs 12 channels of DDR5-5600: 537.6 GB/s across 96 cores, or{' '}
            <strong>5.6 GB/s per core</strong> with every core busy
            <Cite s={S.r8gPreview} kind="derived" note={bwNote4} />. Graviton5 runs 12 channels of
            DDR5-8800: 844.8 GB/s across 192 cores, or <strong>4.4 GB/s per core</strong>
            <Cite s={S.m9gGa} kind="derived" note={bwNote5} />. The package gained 57% and each
            core&apos;s share lost 21%. The larger LLC is the compensation: a working set that
            fits in its node&apos;s 96 MB is served from cache, while a job that streams past the
            LLC on every core gets about a fifth less DRAM bandwidth per thread than on
            Graviton4.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which instructions do the matrix work, which software already uses them, and why Graviton5's inference gain comes from the memory system"
          >
            ML and SLM inference on Graviton5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The vendor figures.</strong> AWS claims Graviton5 runs machine learning (ML)
            inference up to 35% faster than Graviton4
            <Cite s={S.m9gGa} kind="vendor-claim" />. Arm claims Neoverse V3 brings
            &quot;double-digit performance improvements over Neoverse V2 on cloud and ML
            applications&quot;
            <Cite s={S.armNeoverseV3} kind="vendor-claim" />.
          </Box>
          <Box variant="p">
            <strong>The matrix instructions.</strong> FEAT_I8MM provides SMMLA (signed), UMMLA
            (unsigned) and USMMLA (mixed sign)
            <Cite s={S.llvmMatMulDefs} />, the int8 matrix multiply-accumulate (MMLA)
            instructions quantized small language model (SLM) inference runs on. Each one
            multiplies a 2x8 int8 matrix by an 8x2 int8 matrix into a 2x2 block of int32
            accumulators, inside one 128-bit vector register
            <Cite
              s={S.llvmMatMulFormat}
              note="LLVM encodes the instruction as $Rd.4s, $Rn.16b, $Rm.16b: two vectors of 16 int8 values accumulate into 4 int32 values."
            />
            <Cite
              s={S.qemuInt8Mmla}
              note="Each of the four int32 sums in a 16-byte segment adds an 8-element int8 dot product of one 8-byte row from each source."
            />
            . FEAT_BF16 adds BFMMLA, which multiplies a 2x4 BF16 (bfloat16) matrix by a 4x2 one
            into a 2x2 block of FP32 accumulators in the same 128-bit register
            <Cite s={S.llvmMatMulDefs} note="BFMMLA is defined under HasBF16." />
            <Cite
              s={S.qemuBfmmla}
              note="Each of the four FP32 sums adds two bfdotadd steps of two BF16 products each: four products per output."
            />
            .
          </Box>
          <Box variant="p">
            <strong>The same instructions on three generations.</strong> Graviton3 has the bf16
            and int8 features, Graviton4 adds SVE2 (Scalable Vector Extension 2) forms of both,
            and Graviton5&apos;s additions are afp and wfxt
            <Cite s={S.gravitonReadme} />; BF16 and MMLA are supported on Graviton3, Graviton4
            and Graviton5
            <Cite s={S.gravitonLlamaCpp} />. AWS&apos;s Graviton5 feature table lists no SME
            (Scalable Matrix Extension), and its SIMD row reads 4x Neon/SVE 128-bit vectors
            <Cite s={S.gravitonReadme} />, so matrix work stays on the Neon and SVE MMLA
            instructions.
          </Box>
          <Box variant="p">
            <strong>Software already uses them.</strong> ONNX (Open Neural Network Exchange)
            Runtime has shipped INT8 MMLA quantized GEMM (QGEMM) kernels and BF16-accelerated
            SGEMM kernels for Graviton3 since v1.17.0
            <Cite s={S.gravitonOnnx} />, released in February 2024
            <Cite s={S.onnxRuntime1170} />; Graviton4 and Graviton5 carry the same instructions.
            The MMLA kernels are on by default, and the BF16 path is opt-in through the session
            option <code>mlas.enable_gemm_fastmath_arm64_bfloat16</code>
            <Cite s={S.gravitonOnnx} />.
          </Box>
          <Alert type="info" header="Where the SLM gain comes from">
            SLM decode is bound by memory bandwidth (<em>Roofline and Arithmetic Intensity</em>,{' '}
            <em>Small Language Models</em>), so on Graviton5 the memory system is a larger lever
            than the instruction set. DDR5-8800 gives 57% more bandwidth per channel than
            Graviton4&apos;s DDR5-5600
            <Cite s={S.m9gGa} kind="derived" note="8,800 / 5,600 MT/s = 1.57." />, the L3 is 5x
            larger
            <Cite s={S.m9gGa} />, and AWS claims up to 33% lower inter-core latency
            <Cite s={S.graviton5AboutAmazon} kind="vendor-claim" />. The 57% is a package
            figure: spread across 192 busy cores it is 4.4 GB/s per core, 21% less than
            Graviton4
            <Cite s={S.m9gGa} kind="derived" note={bwNote5} />. The MMLA instructions do the
            same work they did on Graviton3 and Graviton4; the data reaches them faster.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the size and the thread placement that keep each job inside one 96-core, 96 MB domain"
          >
            What this means for workload placement
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Fits Graviton5 well</Box>
              <ul>
                <li>
                  Working sets that fit one node&apos;s LLC: 96 MB on 24xlarge and 48xlarge, 48 MB
                  on 16xlarge and smaller
                  <Cite s={S.gravitonReadme} />
                </li>
                <li>KV-cache management, tokenizer fleets, embedding servers</li>
                <li>Microservices with locality-friendly data structures</li>
                <li>Jobs that fit in one NUMA node, on 24xlarge or 12xlarge and smaller</li>
                <li>Workloads sensitive to inter-core latency</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Check before moving to Graviton5</Box>
              <ul>
                <li>Workloads streaming through datasets larger than the LLC</li>
                <li>JVM (Java Virtual Machine) garbage collection where heap traversal misses cache</li>
                <li>
                  Databases sensitive to bandwidth per thread: 4.4 GB/s per busy core against 5.6
                  on Graviton4
                  <Cite s={S.m9gGa} kind="derived" note={`${bwNote4} ${bwNote5}`} />
                </li>
                <li>Jobs on 16xlarge and 48xlarge, which span two NUMA nodes (below)</li>
              </ul>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="Which Graviton5 sizes span both NUMA nodes">
            <SpaceBetween size="s">
              <Table
                items={sizeRows}
                columnDefinitions={[
                  { id: 'size', header: 'Size', cell: (r) => r.size, minWidth: 130 },
                  { id: 'vcpus', header: 'vCPUs (one core each)', cell: (r) => r.vcpus, minWidth: 110 },
                  { id: 'nodes', header: 'NUMA nodes', cell: (r) => r.nodes, minWidth: 90 },
                  { id: 'llc', header: 'LLC per node', cell: (r) => r.llc, minWidth: 100 },
                ]}
                variant="embedded"
                wrapLines
              />
              <Box variant="small" color="text-body-secondary">
                NUMA nodes and LLC per size
                <Cite s={S.gravitonReadme} />; vCPUs, the same for M9g, C9g and R9g
                <Cite s={S.ec2GeneralPurposeSpecs} />
                <Cite s={S.ec2ComputeOptimizedSpecs} />
                <Cite s={S.ec2MemoryOptimizedSpecs} />. AWS&apos;s processor table does not list
                metal-48xl.
              </Box>
              <Box variant="p">
                The 16xlarge is smaller than the 24xlarge and still spans both nodes. To keep a
                job on one node, choose 24xlarge, or 12xlarge and smaller. On 16xlarge and
                48xlarge, confirm the layout with <code>numactl --hardware</code>, then bind
                threads and memory to one node, for example{' '}
                <code>numactl --cpunodebind=0 --membind=0 &lt;command&gt;</code>. On Graviton4
                only the two-socket 48xlarge needs this, where crossing sockets measured 138.6 ns
                on average
                <Cite s={S.chipsAndCheeseGraviton4} kind="measured" />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Before you benchmark a port.</strong> Build with{' '}
            <code style={{ whiteSpace: 'nowrap' }}>-mcpu=neoverse-512tvb</code>, the flag AWS recommends for Graviton3, Graviton4
            and Graviton5
            <Cite s={S.gravitonReadme} />, check the NUMA layout of the size you picked, and
            start from the{' '}
            <Link external href={S.gravitonGuideRepo.url}>
              AWS Graviton getting-started guide
            </Link>
            <Cite s={S.gravitonGuideRepo} />.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
