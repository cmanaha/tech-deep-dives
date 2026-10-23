import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Xeon6Topology } from '../components/Xeon6Topology';
import { Cite } from '../components/Cite';
import { S } from '../sources/IntelXeon6';

const perTileNote =
  'The chip totals (96 cores, 120 CHAs) divided by three compute tiles; Chips and Cheese gives the totals and the 160 MB of L3 per tile.';
const nodeBwNote =
  'Four memory controllers per compute tile x 7.2 GT/s x 8 bytes = 230.4 GB/s per SNC3 node, a theoretical peak.';
const weightsNote =
  '1B parameters x 2 bytes (FP16) = 2 GB; 7B x 2 bytes = 14 GB; both against the 160 MB of L3 per tile Chips and Cheese reports.';
const decodeNote =
  '14 GB of FP16 weights read once per token / 230.4 GB/s per node (four controllers per tile x DDR5-7200 x 8 bytes) = about 61 ms per token, about 16 tokens/s, before any compute. INT8 weights are 7 GB: about 33 tokens/s.';
const brief6900Note =
  'The brief gives Xeon 6 P-core maxima of 128 cores, 504 MB of L3 and 12 memory channels, and says the 6900 series has the highest core counts and the most memory channels in the family.';
const ecoreNote =
  'The brief states AVX-512 is supported only on P-core parts and lists AMX only under P-cores; the E-core column lists AVX2 with VNNI.';
const twoChipsNote =
  '192 cores on r8i.96xlarge / 96 cores per 6985P-C; 3,072 GiB on r8i.96xlarge against the 1.5 TB per socket Chips and Cheese reports for r8i.';
const ratioNote = '691.62 GB/s against 323.45 GB/s on Emerald Rapids, both by Chips and Cheese: 2.14x.';

interface PartRow {
  part: string;
  cores: React.ReactNode;
  memory: React.ReactNode;
  units: React.ReactNode;
}

const partRows: PartRow[] = [
  {
    part: 'Xeon 6900 series, P-cores',
    cores: (
      <>
        Up to 128 cores, up to 504 MB L3
        <Cite s={S.xeon6ProductBrief} note={brief6900Note} />
      </>
    ),
    memory: (
      <>
        Up to 12 channels; DDR5-6400, or MRDIMM up to 8,800 MT/s
        <Cite s={S.xeon6ProductBrief} note={brief6900Note} />
      </>
    ),
    units: (
      <>
        AVX-512; AMX with FP16
        <Cite s={S.xeon6ProductBrief} />
      </>
    ),
  },
  {
    part: 'Xeon 6700 and 6500 series, P-cores',
    cores: (
      <>
        Up to 86 cores, up to 336 MB L3
        <Cite s={S.xeon6700BriefPdf} />
      </>
    ),
    memory: (
      <>
        Up to 8 channels; DDR5-6400, or MRDIMM up to 8,000 MT/s
        <Cite s={S.xeon6700BriefPdf} />
      </>
    ),
    units: (
      <>
        AVX-512; AMX with FP16
        <Cite s={S.xeon6700BriefPdf} />
      </>
    ),
  },
  {
    part: 'Xeon 6, E-cores',
    cores: (
      <>
        Up to 288 cores, up to 216 MB L3
        <Cite s={S.xeon6ProductBrief} />
      </>
    ),
    memory: (
      <>
        Up to 12 channels; DDR5-6400
        <Cite s={S.xeon6ProductBrief} />
      </>
    ),
    units: (
      <>
        AVX2 with VNNI; no AVX-512, no AMX
        <Cite s={S.xeon6ProductBrief} note={ecoreNote} />
      </>
    ),
  },
  {
    part: 'Xeon 6 6985P-C, AWS r8i',
    cores: (
      <>
        96 cores, 480 MB L3
        <Cite s={S.chipsAndCheeseXeon6} />
      </>
    ),
    memory: (
      <>
        12 channels; DDR5-7200
        <Cite s={S.chipsAndCheeseXeon6} />
      </>
    ),
    units: (
      <>
        AVX-512; AMX
        <Cite s={S.chipsAndCheeseXeon6} /> with FP16
        <Cite s={S.r8iPage} />
      </>
    ),
  },
];

interface AmxRow {
  format: string;
  generation: React.ReactNode;
  instruction: React.ReactNode;
}

const amxRows: AmxRow[] = [
  {
    format: 'BF16 (bfloat16)',
    generation: (
      <>
        Sapphire Rapids
        <Cite s={S.llvmX86Td} />
      </>
    ),
    instruction: (
      <>
        <code>TDPBF16PS</code>
        <Cite s={S.llvmAmxIntrin} />
      </>
    ),
  },
  {
    format: 'INT8',
    generation: (
      <>
        Sapphire Rapids
        <Cite s={S.llvmX86Td} />
      </>
    ),
    instruction: (
      <>
        <code>TDPBSSD</code>, <code>TDPBSUD</code>, <code>TDPBUSD</code>, <code>TDPBUUD</code>{' '}
        (signed and unsigned pairs)
        <Cite s={S.llvmAmxIntrin} />
      </>
    ),
  },
  {
    format: 'FP16',
    generation: (
      <>
        Granite Rapids
        <Cite s={S.llvmX86Td} />
      </>
    ),
    instruction: (
      <>
        <code>TDPFP16PS</code>
        <Cite s={S.llvmAmxFp16Intrin} />
      </>
    ),
  },
  {
    format: 'FP8',
    generation: (
      <>
        Diamond Rapids
        <Cite s={S.llvmX86Td} kind="roadmap" />
      </>
    ),
    instruction: (
      <>
        AMX-FP8 in LLVM&apos;s Diamond Rapids target
        <Cite s={S.llvmX86Td} kind="roadmap" />
      </>
    ),
  },
];

export function IntelXeon6() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read the Xeon 6 in an r8i as three NUMA nodes per chip, each with its own 160 MB of L3 and its own memory, and size CPU inference against DRAM bandwidth rather than AMX"
          >
            Intel Xeon 6 (Granite Rapids)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Xeon 6 is Intel&apos;s server CPU brand for two kinds of core: P-cores (performance
            cores) with AVX-512 (Advanced Vector Extensions 512) and AMX (Advanced Matrix
            Extensions), a matrix unit in every core, and E-cores (efficiency cores) with neither
            <Cite s={S.xeon6ProductBrief} note={ecoreNote} />. The P-core design, Granite Rapids, is
            the processor AWS lists for M8i, C8i, R8i and X8i
            <Cite s={S.ec2GeneralPurposeSpecs} />
            <Cite s={S.ec2ComputeOptimizedSpecs} />
            <Cite s={S.ec2MemoryOptimizedSpecs} />.
          </Box>
          <Box variant="p">
            <strong>The model to carry.</strong> An r8i runs a custom 96-core Xeon 6 6985P-C, three
            compute tiles and two IO dies, in SNC3 (Sub-NUMA Clustering into three nodes)
            <Cite s={S.chipsAndCheeseXeon6} />. Each tile is a NUMA (Non-Uniform Memory Access) node
            of about 32 cores
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={perTileNote} /> with its own{' '}
            <strong>160 MB of L3</strong> and four memory channels
            <Cite s={S.chipsAndCheeseXeon6} />. Keep a job on one node, because each die boundary it
            crosses adds latency
            <Cite s={S.chipsAndCheeseXeon6} kind="measured" />. Size CPU decode against DRAM
            bandwidth, because even a 1B-parameter model&apos;s weights do not fit in L3.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the cores, caches and memory controllers sit, so you can predict what a thread pays to reach its data"
          >
            Three compute tiles, two IO dies
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Xeon6Topology />
          <Box variant="small" color="text-body-secondary">
            Dies, EMIB, Intel 3, caches, CHA and MDF counts and clocks, memory controllers,
            DDR5-7200 and SNC3, measured on r8i
            <Cite s={S.chipsAndCheeseXeon6} kind="measured" />; per-tile cores and CHAs
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={perTileNote} />; PCIe 5.0, UPI 2.0
            and CXL 2.0
            <Cite s={S.xeon6ProductBrief} />.
          </Box>
          <Box variant="p">
            The compute tiles hold the cores, the L3 and the memory controllers, so memory hangs off
            the compute tiles; the IO dies hold the slower I/O and the accelerators
            <Cite s={S.chipsAndCheeseXeon6} />. The L3 is a set of CHAs (Caching and Home Agents),
            each an L3 slice and snoop filter on a core&apos;s mesh stop. MDF (Modular Data Fabric)
            stops carry the mesh across die boundaries over EMIB (Embedded Multi-die Interconnect
            Bridge), a silicon bridge between dies
            <Cite s={S.chipsAndCheeseXeon6} />. Intel&apos;s largest P-core parts reach 128 cores
            and 504 MB of L3
            <Cite s={S.xeon6ProductBrief} />.
          </Box>
          <Alert type="info" header="Keep each job inside one SNC3 node">
            SNC3, Intel&apos;s default and AWS&apos;s choice on r8i, backs each node with one
            tile&apos;s L3 and memory controllers and caches a node&apos;s memory only in that
            tile&apos;s L3; a unified one-node mode also exists
            <Cite s={S.chipsAndCheeseXeon6} />. On r8i an L3 hit takes just over 33 ns locally,
            about 24 ns more one tile away and nearly 80 ns two away; DRAM one tile away takes
            157.44 ns, about 26 ns over local
            <Cite s={S.chipsAndCheeseXeon6} kind="measured" />. List the nodes with{' '}
            <code style={{ whiteSpace: 'nowrap' }}>numactl --hardware</code> and bind each job to one:{' '}
            <code>numactl --cpunodebind=0 --membind=0 &lt;command&gt;</code>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The bandwidth an r8i delivers, and the per-node ceiling that sets the token rate of small-batch CPU decode"
          >
            Memory bandwidth and CPU decode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The r8i uses DDR5-7200
            <Cite s={S.chipsAndCheeseXeon6} />, as does M8i
            <Cite s={S.m8iPage} />; Intel&apos;s own figures are DDR5-6400, or MRDIMM (Multiplexed
            Rank DIMM) up to 8,800 MT/s on P-core parts
            <Cite s={S.xeon6ProductBrief} />. With each thread reading its own node&apos;s memory,
            Chips and Cheese measured 691.62 GB/s on an r8i
            <Cite s={S.chipsAndCheeseXeon6} kind="measured" />, about 2.1x their Emerald Rapids
            figure
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={ratioNote} />. One node&apos;s four
            channels peak at <strong>230.4 GB/s</strong>
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={nodeBwNote} />.
          </Box>
          <Box variant="p">
            <strong>CPU decode streams the weights from DRAM.</strong> A 1B-parameter FP16 model is
            about 2 GB of weights and a 7B model about 14 GB
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={weightsNote} />; neither fits in a
            node&apos;s 160 MB of L3, so every token reads all the weights from memory and batch-1
            speed is bandwidth divided by model size (<em>Roofline and Arithmetic Intensity</em>). A
            7B FP16 model on one node tops out near 16 tokens per second before compute, and INT8
            weights double that
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={decodeNote} />. AMX cannot lift
            the ceiling, since at batch 1 each weight read feeds one multiply-add. It pays off when
            one weight read serves many tokens, in prefill and batched decode (
            <em>Small Language Models</em>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What AMX computes, which precision each Xeon generation adds, and how to confirm your process is using it"
          >
            AMX: a matrix unit in every P-core
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AMX keeps operands in eight tile registers, TMM0 to TMM7, each up to 16 rows of 64 bytes
            <Cite s={S.llvmAmxIntrin} />
            <Cite s={S.llvmX86Registers} />, and one instruction multiplies two tiles into a third
            <Cite s={S.llvmAmxIntrin} />. It runs in the calling thread (
            <em>Anatomy of a Kernel Execution</em>). On Linux a process must first request
            permission with <code>arch_prctl(ARCH_REQ_XCOMP_PERM)</code>
            <Cite s={S.linuxXstate} />; oneDNN makes that request itself
            <Cite s={S.oneDnnAmxPermission} />. Intel rates AMX at up to 2,048 INT8, and 1,024 BF16
            or FP16, operations per cycle per core
            <Cite s={S.xeon6ProductBrief} kind="vendor-claim" />.
          </Box>
          <Table
            items={amxRows}
            columnDefinitions={[
              { id: 'fmt', header: 'Precision', cell: (r) => r.format, minWidth: 120 },
              { id: 'gen', header: 'First Xeon with it', cell: (r) => r.generation, minWidth: 150 },
              { id: 'ins', header: 'Tile dot-product instruction', cell: (r) => r.instruction },
            ]}
            variant="embedded"
            wrapLines
          />
          <ExpandableSection headerText="The rest of the AMX instruction sequence">
            <Box variant="p">
              <code>LDTILECFG</code> sets each tile&apos;s shape; <code>TILELOADD</code> and{' '}
              <code>TILELOADDT1</code> load tiles, <code>TILESTORED</code> stores one,{' '}
              <code>TILEZERO</code> clears one and <code>TILERELEASE</code> returns all tiles to
              their initial state
              <Cite s={S.llvmAmxIntrin} />. The kernel saves tile data with the thread&apos;s
              extended state, as XSTATE component 18
              <Cite s={S.linuxXstate} />.
            </Box>
          </ExpandableSection>
          <Alert type="info" header="oneDNN picks the AMX tier at run time and reports which one">
            oneDNN, which PyTorch calls for AMX (<em>Anatomy of a Kernel Execution</em>), has three
            AMX tiers: <code>AVX10_1_512_AMX</code> (BF16 and INT8),{' '}
            <code>AVX10_1_512_AMX_FP16</code> (adds FP16) and <code>AVX10_2_AMX_2</code> (AVX10.2
            with a second-generation AMX flag)
            <Cite s={S.oneDnnIsaTraits} />; the AVX10.1 names are oneDNN&apos;s labels. LLVM&apos;s
            Diamond Rapids target adds AVX10.2 and AMX-FP8
            <Cite s={S.llvmX86Td} kind="roadmap" />. <code>ONEDNN_VERBOSE=1</code> prints an{' '}
            <code>info,cpu,isa</code> line naming the highest tier the process will use; for Granite
            Rapids, v3.13.4 prints &quot;Intel AVX10.1 and Intel AMX with bfloat16, float16 and
            8-bit integer support&quot;. A lower tier means AMX is hidden from the process, the
            permission request failed, or a cap is set
            <Cite s={S.oneDnnVerbose} />
            <Cite s={S.oneDnnMaxCpuIsa} />. <code>ONEDNN_MAX_CPU_ISA=AVX10_1_512_AMX</code> sets
            that cap, which isolates what FP16 adds on the same instance
            <Cite s={S.oneDnnMaxCpuIsa} />
            <Cite s={S.oneDnnEnvPrefix} />
            <Cite
              s={S.oneDnnBuildOptions}
              note="The cap is compiled in when oneDNN is built with ENABLE_MAX_CPU_ISA, which defaults to ON."
            />
            .
          </Alert>
          <ExpandableSection headerText="IPEX is archived: use stock PyTorch">
            <Box variant="p">
              IPEX (Intel Extension for PyTorch) is archived: its last commit, on 2026-03-30, adds
              the archive notice, and the README reports known security issues. Most of its
              optimizations are upstream, and Intel recommends using PyTorch directly
              <Cite s={S.ipexReadme} />. Drop the <code>intel_extension_for_pytorch</code> import.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which Xeon 6 parts carry a matrix unit, how much memory each one feeds, and which part AWS runs"
          >
            The Xeon 6 family
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={partRows}
            columnDefinitions={[
              { id: 'part', header: 'Part', cell: (r) => r.part, minWidth: 150 },
              { id: 'cores', header: 'Cores and L3, per socket', cell: (r) => r.cores, minWidth: 170 },
              { id: 'mem', header: 'Memory', cell: (r) => r.memory, minWidth: 170 },
              { id: 'units', header: 'Vector and matrix units', cell: (r) => r.units, minWidth: 170 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>After Granite Rapids.</strong> Xeon 6+, Intel&apos;s first data-center
            processor on Intel 18A, launched in Q2 2026 with up to 288 E-cores; its product page
            names no matrix extension
            <Cite s={S.intelXeon6Plus} />. Diamond Rapids, the next-generation Xeon, is on the roadmap
            with no launch date: Intel 18A-P, up to 256 cores, 1.28 GB of LLC (last-level cache), 16
            memory channels at 12,800 MT/s, PCIe Gen6, CXL (Compute Express Link) 3.0 and enhanced
            AMX
            <Cite s={S.intelHotChips2026} kind="roadmap" />.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which instance families run Granite Rapids, how large they get, and what to check before placing a job"
          >
            Xeon 6 on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            M8i, C8i and R8i, with their -flex and d variants, and X8i all list Intel Xeon Granite
            Rapids on Nitro v6. A 96xlarge has 384 vCPUs on 192 cores, with 1,536 GiB on M8i, 3,072
            GiB on R8i or 6,144 GiB on X8i
            <Cite s={S.ec2GeneralPurposeSpecs} />
            <Cite s={S.ec2ComputeOptimizedSpecs} />
            <Cite s={S.ec2MemoryOptimizedSpecs} />. M8i sustains a 3.9 GHz all-core turbo on
            DDR5-7200
            <Cite s={S.m8iPage} />, and AWS claims 2.5x the previous generation&apos;s memory
            throughput
            <Cite s={S.m8iPage} kind="vendor-claim" />.
          </Box>
          <Box variant="p">
            <strong>Placement on r8i.</strong> The r8i chip is the 96-core 6985P-C
            <Cite s={S.chipsAndCheeseXeon6} />, so the 192-core r8i.96xlarge carries two
            <Cite s={S.ec2MemoryOptimizedSpecs} kind="derived" note={twoChipsNote} />. The EC2
            instance specifications give no NUMA layout per size
            <Cite s={S.ec2MemoryOptimizedSpecs} />, so read it with <code style={{ whiteSpace: 'nowrap' }}>numactl --hardware</code>{' '}
            on the size you launch.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Xeon 6 is the right host, what to check before committing a workload to it, and the first run to make"
          >
            Choosing Xeon 6 for a workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Fits Xeon 6 well</Box>
              <ul>
                <li>
                  BF16, FP16 and INT8 matrix work that reaches AMX through oneDNN, at batch sizes that
                  share weight reads
                </li>
                <li>
                  Jobs that fit one node: about 32 cores and 160 MB of L3
                  <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={perTileNote} />
                </li>
                <li>
                  Large-memory work, up to 6,144 GiB on x8i.96xlarge
                  <Cite s={S.ec2MemoryOptimizedSpecs} />
                </li>
                <li>
                  Offload to QAT (QuickAssist Technology) for crypto and compression, DSA (Data
                  Streaming Accelerator) for data movement, IAA (In-Memory Analytics Accelerator)
                  for compression and scans
                  <Cite s={S.xeon6ProductBrief} />
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Check first</Box>
              <ul>
                <li>
                  Single-thread streaming: one core reads about 30 GB/s from L3, less than a Zen 5
                  core reads from DRAM (<em>AMD EPYC Turin</em>)
                  <Cite s={S.chipsAndCheeseXeon6} kind="measured" />
                </li>
                <li>
                  More than 128 cores per socket: only E-core parts, which have no AMX
                  <Cite s={S.xeon6ProductBrief} note={ecoreNote} />
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Before you benchmark.</strong> Read the size&apos;s NUMA layout with{' '}
            <code style={{ whiteSpace: 'nowrap' }}>numactl --hardware</code>, bind the job to one node, and run once with{' '}
            <code>ONEDNN_VERBOSE=1</code> to confirm the <code>info,cpu,isa</code> line names AMX
            with float16
            <Cite s={S.oneDnnVerbose} />. Then compare tokens per second with the 230.4 GB/s
            per-node ceiling
            <Cite s={S.chipsAndCheeseXeon6} kind="derived" note={nodeBwNote} />.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
