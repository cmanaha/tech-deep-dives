import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import { Cite } from '../components/Cite';
import { S } from '../sources/HeterogeneityFact';

const mispredictNote =
  'MispredictPenalty in LLVM scheduling models at llvmorg-19.1.0: Neoverse V2 10 (commented "Copied from N2"), Zen 4 13, Sapphire Rapids 14. These are compiler cost estimates, not measurements.';

const dramNote =
  'Pond measured local DRAM latency of 78 ns and 115 ns on two server platforms (Figure 4). At 3 GHz that is about 230 to 350 cycles.';

interface ArchRow {
  architecture: string;
  instruction: React.ReactNode;
  data: React.ReactNode;
  shape: React.ReactNode;
  stall: React.ReactNode;
}

const rows: ArchRow[] = [
  {
    architecture: 'Graviton, Xeon or EPYC host core',
    instruction: 'Branch predictor, BTB (Branch Target Buffer), speculative out-of-order issue',
    data: 'L1 to L3 caches, hardware prefetch, TLB (translation lookaside buffer)',
    shape: (
      <>
        SIMD: SVE2 (Scalable Vector Extension 2) on Graviton4 and Graviton5
        <Cite s={S.gravitonReadme} />, AVX-512 on EPYC Turin
        <Cite s={S.m8aPage} />, AMX (Advanced Matrix Extensions) tiles on Xeon 6
        <Cite s={S.m8iPage} />
      </>
    ),
    stall: 'A mispredict refills the pipeline; a cache miss waits on DRAM',
  },
  {
    architecture: 'NVIDIA Hopper or Blackwell SM (Streaming Multiprocessor)',
    instruction: (
      <>
        Warp scheduler issues from ready warps
        <Cite s={S.cudaBestPractices} />; tensor-core work through <code>wgmma</code>{' '}
        (Hopper) and <code>tcgen05</code> (Blackwell)
        <Cite s={S.ptxIsa} />
      </>
    ),
    data: (
      <>
        Registers, SMEM (shared memory), TMEM (Tensor Memory, Blackwell), L2, HBM (High
        Bandwidth Memory)
        <Cite s={S.ptxIsa} />
      </>
    ),
    shape: (
      <>
        Tensor-core tiles, FP8 (8-bit floating point) to FP64 on Hopper, FP4 to FP64 on
        Blackwell
        <Cite s={S.nvfp4Blog} />; B300 cuts FP64 to 10 TFLOPS per 8-GPU board
        <Cite s={S.hgxPage} />
      </>
    ),
    stall: 'A bubble idles the tensor cores; lost FLOPs scale with their width',
  },
  {
    architecture: 'AWS Trainium2 or Trainium3 NeuronCore',
    instruction: (
      <>
        Neuron compiler fixes the schedule in a NEFF (Neuron Executable File Format); ISA
        (instruction set architecture) extensions add dynamic shapes and control flow
        <Cite s={S.trainium2Arch} />
        <Cite s={S.trainium3Arch} />
      </>
    ),
    data: (
      <>
        SBUF (State Buffer) and PSUM (Partial Sum buffer), software-managed on-chip SRAM
        <Cite s={S.neuronCoreV3} />
      </>
    ),
    shape: (
      <>
        Systolic-array tiles sized at compile time to fit SBUF
        <Cite s={S.neuronCoreV3} />
      </>
    ),
    stall: 'Most stalls show up in the compiled schedule',
  },
  {
    architecture: 'Cerebras WSE-3 (Wafer-Scale Engine 3)',
    instruction: (
      <>
        Each of 900,000 cores runs its own program and fires a task when its data arrives; no
        global scheduler
        <Cite s={S.cerebrasS1} />
        <Cite s={S.cerebrasSdkBlog} />
      </>
    ),
    data: (
      <>
        Inference: weights in 44 GB of on-wafer SRAM
        <Cite s={S.cerebrasS1} />, larger models split by layer across CS-3 systems
        <Cite s={S.cerebrasInferenceBlog} />. Training adds up to 1.2 PB of external memory
        <Cite s={S.wse3Press} />
      </>
    ),
    shape: (
      <>
        Row and column tiling over a two-dimensional mesh of cores
        <Cite s={S.cerebrasSdkBlog} />
      </>
    ),
    stall: (
      <>
        Routes are fixed at compile time; arriving data decides which task runs next
        <Cite s={S.cerebrasSdkBlog} />
      </>
    ),
  },
  {
    architecture: 'NVIDIA Groq 3 LPU, in the Groq 3 LPX rack',
    instruction: (
      <>
        Compiler schedules computation, data movement and synchronization; no runtime hardware
        scheduler
        <Cite s={S.lpxBlog} />
      </>
    ),
    data: (
      <>
        500 MB of on-chip SRAM per LPU as primary working storage; up to 512 GB of DRAM per
        16-LPU tray
        <Cite s={S.lpxBlog} />
      </>
    ),
    shape: (
      <>
        FP8 compute across 256 LPUs per rack
        <Cite s={S.lpxBlog} />
      </>
    ),
    stall: (
      <>
        The compiled schedule sets per-token time; a plesiosynchronous chip-to-chip protocol
        keeps the LPUs in step
        <Cite s={S.lpxBlog} />
      </>
    ),
  },
];

export function HeterogeneityFact() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read each chip by its execution model, so you compare silicon and port tuning results on the terms that chip pays"
          >
            The Heterogeneity Fact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Inference silicon in 2026 is a set of distinct execution models, each a different way
            of holding together the instruction-data-shape triangle from{' '}
            <em>Thesis and Framing</em>. Host cores speculate past branches, GPUs switch between
            warps, Trainium and the Groq LPU (Language Processing Unit) run schedules their
            compilers built, a Cerebras wafer fires tasks as data arrives, and compute-in-memory
            devices do arithmetic inside the memory array. Each pays a different price when a
            delivery is late.
          </Box>
          <Box variant="p">
            <strong>The shortlist a workload owner faces.</strong> One workload can be weighed
            across P5 (Hopper) and P6 (Blackwell) instances
            <Cite s={S.ec2AcceleratedSpecs} />, a Trn3 UltraServer of up to 144 Trainium3 chips
            <Cite s={S.trn3Page} />, a Trn2 UltraServer&apos;s 64-chip NeuronLink domain
            <Cite s={S.trn2Arch} />, a Cerebras CS-3, an NVIDIA Groq 3 LPX rack or GroqCloud
            <Cite s={S.lpxProduction} />
            <Cite s={S.groqNvidiaLicense} />, and an M8i fleet with AMX.
            <Cite s={S.m8iPage} /> Each has its own precision formats, memory hierarchy and
            compiler, so peak FLOPS cannot choose between them; the bet that matches the
            workload does.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four questions that place any chip you have not met before, answered for five shipping architectures"
          >
            How the live architectures place their bets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={rows}
            columnDefinitions={[
              { id: 'arch', header: 'Architecture', cell: (r) => r.architecture, minWidth: 160 },
              { id: 'inst', header: 'Instruction delivery', cell: (r) => r.instruction, minWidth: 200 },
              { id: 'data', header: 'Data delivery', cell: (r) => r.data, minWidth: 200 },
              { id: 'shape', header: 'Shape fit', cell: (r) => r.shape, minWidth: 200 },
              { id: 'stall', header: 'Cost of a late delivery', cell: (r) => r.stall, minWidth: 200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Each family has its own section, from <em>Graviton Deep Dive</em> through{' '}
            <em>Groq, SambaNova and Dataflow</em>; <em>Compute-in-Memory</em> covers the
            in-memory devices.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a tuning result or benchmark from one architecture class misleads on another, and how to compare them instead"
          >
            What a stall costs on each architecture
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cost of a stall is a property of the architecture, so tuning intuitions do not
            travel. Speculation depth and reorder buffer pressure have no counterpart on a
            compile-time scheduled systolic array; occupancy, warp divergence and shared-memory
            bank conflicts have none on a wafer whose cores each run their own program.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Out-of-order host core</Box>
              <ul>
                <li>
                  Mispredict: a pipeline refill, 10 to 14 cycles in LLVM&apos;s scheduling models
                  <Cite s={S.llvmNeoverseV2} note={mispredictNote} />
                  <Cite s={S.llvmZnver4} note={mispredictNote} />
                  <Cite s={S.llvmSapphireRapids} note={mispredictNote} />
                </li>
                <li>
                  Cache miss to DRAM: hundreds of cycles, partly hidden by out-of-order execution
                  <Cite s={S.pond} kind="derived" note={dramNote} />
                </li>
                <li>Recovery: hardware (reorder buffer, return address stack, BTB retraining)</li>
                <li>Where it shows: runtime profiling; the compiler only estimates it</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">NVIDIA SIMT (single instruction, multiple threads) GPU</Box>
              <ul>
                <li>Bubble cost: the tensor-core FLOPs that did not retire that cycle</li>
                <li>
                  Recovery: the scheduler issues from another resident warp
                  <Cite s={S.cudaBestPractices} />
                </li>
                <li>
                  Where it shows: partly at compile time, since occupancy and tile size set how
                  much latency can be hidden
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">AWS Trainium systolic array</Box>
              <ul>
                <li>Schedule: mostly fixed at compile time in the NEFF</li>
                <li>Mitigation: compiler retiling and operator fusion</li>
                <li>Where it shows: largely in the compiled schedule</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Wafer-scale dataflow (WSE-3)</Box>
              <ul>
                <li>
                  Mitigation: placement and routing at compile time
                  <Cite s={S.cerebrasSdkBlog} />
                </li>
                <li>Where it shows: routes at compile time, task order at runtime</li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Compare by placement, then port by mechanism.</strong> One kernel timed on
            two architectures is a valid measurement and a misleading comparison, because the
            time hides different costs: speculative work that never retires on a host core,
            warps waiting for operands on a GPU, stalls built into the compiled schedule on
            Trainium. Work out the workload&apos;s FLOP per byte and place it against each
            chip&apos;s ridge point. Port a tuning result only where the mechanism it tuned
            exists: a 10 to 14 cycle mispredict refill is worth chasing on a host core, and a
            systolic array has no speculation depth to tune.{' '}
            <em>Roofline and Arithmetic Intensity</em> computes the ridge points.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
