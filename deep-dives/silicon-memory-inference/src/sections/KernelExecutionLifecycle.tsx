import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import { KernelLifecycleDiagram } from '../components/KernelLifecycleDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/KernelExecutionLifecycle';

const gapNote = '478.8 cycles (global memory) / 29.0 cycles (shared memory) = 16.5, both from Table IV.';

interface LatencyRow {
  level: string;
  size: React.ReactNode;
  latency: React.ReactNode;
  fill: React.ReactNode;
}

const latencyRows: LatencyRow[] = [
  {
    level: 'Registers',
    size: (
      <>
        64K 32-bit registers per SM on Hopper and B200
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    latency: 'None located',
    fill: (
      <>
        Loads from SMEM; <code>wgmma</code> keeps its accumulator here
        <Cite s={S.ptxIsa} />
      </>
    ),
  },
  {
    level: 'TMEM (Blackwell)',
    size: (
      <>
        256 KB per SM
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    latency: 'None located',
    fill: (
      <>
        <code>tcgen05.mma</code> accumulates here; operand A may come from here
        <Cite s={S.ptxIsa} />
      </>
    ),
  },
  {
    level: 'Shared memory (SMEM)',
    size: (
      <>
        Up to 228 KB per SM on Hopper and B200
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />; up to 328 KB on Rubin
        <Cite
          s={S.computeCapabilities}
          note="Compute capability 10.7: 328 KB of shared memory per SM, with an explicit opt-in."
        />
        <Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />
      </>
    ),
    latency: (
      <>
        About 29 cycles
        <Cite s={S.luoHopperBench} kind="measured" />
      </>
    ),
    fill: (
      <>
        Async copy (compute capability 8.0 and later), TMA (9.0 and later)
        <Cite s={S.cudaAsyncCopies} />
      </>
    ),
  },
  {
    level: 'L1 cache',
    size: (
      <>
        Shares one 256 KB array per SM with SMEM on Hopper and B200
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    latency: (
      <>
        About 41 cycles
        <Cite s={S.luoHopperBench} kind="measured" />
      </>
    ),
    fill: 'Hardware-managed cache',
  },
  {
    level: 'L2 cache',
    size: (
      <>
        50 MB on H100, 126 MB on GB200
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    latency: (
      <>
        About 263 cycles
        <Cite s={S.luoHopperBench} kind="measured" />
      </>
    ),
    fill: 'Hardware-managed cache shared by every SM',
  },
  {
    level: 'HBM',
    size: (
      <>
        80 GB at 3.35 TB/s on H100 SXM, 141 GB at 4.8 TB/s on H200
        <Cite s={S.h100Page} />
        <Cite s={S.h200Page} />
      </>
    ),
    latency: (
      <>
        About 479 cycles (global memory; HBM2e on the H800)
        <Cite s={S.luoHopperBench} kind="measured" />
      </>
    ),
    fill: 'Loads, async copy or TMA, through L2',
  },
];

interface LaneRow {
  silicon: string;
  host: React.ReactNode;
  dispatch: React.ReactNode;
  unit: React.ReactNode;
}

const lanes: LaneRow[] = [
  {
    silicon: 'NVIDIA Hopper and Blackwell',
    host: 'PyTorch picks a cuBLAS, cuDNN or Triton kernel; the CUDA driver queues it across PCIe or NVLink-C2C.',
    dispatch: (
      <>
        The GigaThread engine places blocks on SMs; warp schedulers pick ready warps. Up to 32
        blocks and 64 warps per SM on Hopper and B200.
        <Cite s={S.blackwellUltraBlog} />
        <Cite s={S.cudaHardwareMultithreading} />
        <Cite s={S.hopperTuningGuide} />
        <Cite s={S.blackwellTuningGuide} />
      </>
    ),
    unit: (
      <>
        TMA or async copy fills SMEM; <code>wgmma</code> accumulates in registers (Hopper),{' '}
        <code>tcgen05.mma</code> in TMEM (Blackwell).
        <Cite s={S.cudaAsyncCopies} />
        <Cite s={S.ptxIsa} />
      </>
    ),
  },
  {
    silicon: 'AWS Trainium2',
    host: (
      <>
        TorchNeuron lowers each eager operator, or each torch.compile graph, to StableHLO;
        neuronx-cc compiles it into a NEFF on first use, which the Neuron Runtime loads.
        <Cite s={S.torchNeuron233} />
        <Cite s={S.neuronCompiler} />
      </>
    ),
    dispatch: (
      <>
        The compiler back end fixes memory allocation and instruction order inside the NEFF
        <Cite s={S.nkiOverview} />, so there is no warp scheduler to tune. NeuronCore-v3 still
        supports dynamic shapes and control flow.
        <Cite s={S.trn2Arch} />
      </>
    ),
    unit: (
      <>
        DMA (direct memory access) engines fill SBUF (State Buffer, 28 MiB per NeuronCore-v3)
        from HBM; the Tensor engine reads SBUF and writes PSUM (Partial Sum buffer, 2 MiB),
        which accumulates near memory.
        <Cite s={S.nkiTrn2Arch} />
        <Cite s={S.nkiTrnInf2Arch} />
      </>
    ),
  },
  {
    silicon: 'Intel Xeon 6 with AMX (Advanced Matrix Extensions)',
    host: 'PyTorch calls a oneDNN kernel in the same process. The launch is a function call: no device queue, no host link.',
    dispatch: (
      <>
        The OS schedules the calling thread. On Linux a process must request AMX permission
        with <code>arch_prctl(ARCH_REQ_XCOMP_PERM)</code> before using it
        <Cite s={S.linuxXstate} />; oneDNN makes that request itself.
        <Cite s={S.oneDnnAmxPermission} />
      </>
    ),
    unit: (
      <>
        <code>LDTILECFG</code> configures eight tile registers of up to 16 rows of 64 bytes
        (1 KB); <code>TILELOADD</code> fills them from memory
        <Cite s={S.llvmAmxIntrin} />
        <Cite s={S.llvmX86Registers} />; <code>TDPBF16PS</code> multiplies BF16 (bfloat16)
        tiles, and <code>TDPFP16PS</code> adds FP16 from Granite Rapids.
        <Cite s={S.llvmAmxFp16Intrin} />
        <Cite s={S.llvmX86Td} />
      </>
    ),
  },
];

export function KernelExecutionLifecycle() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Follow one kernel call from Python to the Tensor Core and back, and find which stage a fusion, a CUDA Graph or an occupancy change would shorten"
          >
            Anatomy of a Kernel Execution
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What a kernel is.</strong> A kernel is one function the host CPU launches to
            run on an accelerator. Every operator a model executes (a matrix multiply, a softmax,
            a fused attention block) reaches the silicon as one or more kernel launches. The{' '}
            <em>Memory Hierarchy Primer</em> maps the memory levels; this section follows a
            single kernel through them in seven stages, two on the host and five on the device,
            inside the GPU&apos;s streaming multiprocessors (SMs).
          </Box>
          <Box variant="p">
            <strong>Why the stages matter.</strong> On the device the challenge is distance. On a
            Hopper-class H800, a microbenchmark measured about 479 cycles to load from HBM (High
            Bandwidth Memory) and about 29 cycles from shared memory (SMEM)
            <Cite s={S.luoHopperBench} kind="measured" />, a gap of about 16.5 times.
            <Cite s={S.luoHopperBench} kind="derived" note={gapNote} /> Each device stage
            either hides that distance or avoids it, and the host stages add a cost to every
            launch. The last block names the lever for each.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What runs where between the Python call and the result, and why a GPU decides placement twice: once per grid, once per issue cycle"
          >
            Seven stages, two schedulers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <KernelLifecycleDiagram />
          <Box variant="small" color="text-body-secondary">
            Scheduler levels
            <Cite s={S.cudaProgrammingModel} />
            <Cite s={S.cudaHardwareMultithreading} />
            <Cite s={S.blackwellUltraBlog} />; SM count
            <Cite s={S.hopperArchBlog} />; host links
            <Cite s={S.hopperArchBlog} />
            <Cite s={S.blackwellUltraBlog} />; TMA (Tensor Memory Accelerator) and async copy
            <Cite s={S.cudaAsyncCopies} />; Tensor Core instructions
            <Cite s={S.ptxIsa} />. Latencies come from a third-party microbenchmark on an H800
            PCIe (Hopper with HBM2e).
            <Cite s={S.luoHopperBench} kind="measured" /> Stage 2 as drawn is our model of the
            driver path. Trainium and Xeon follow the same stages in the lanes below.
          </Box>
          <Box variant="p">
            <strong>Stages 1 and 2: the host.</strong> The framework resolves the operator and
            picks a kernel: cuBLAS, cuDNN or a Triton kernel on NVIDIA, a compiled NEFF (Neuron
            Executable File Format) on Trainium, a oneDNN primitive on Xeon. The driver then
            submits the launch. How the CUDA driver does this is our model, since no NVIDIA
            document checked for this page describes it: it writes the launch into a queue the
            GPU reads and signals the GPU across the host link. That link is PCIe Gen5 on H100
            <Cite s={S.hopperArchBlog} />, PCIe Gen6 on Blackwell Ultra, or NVLink-C2C to a
            Grace CPU.
            <Cite s={S.blackwellUltraBlog} />
          </Box>
          <Box variant="p">
            <strong>Stages 3 and 4: two schedulers at two levels.</strong> A GPU decides where
            work runs twice. First, the GigaThread engine, NVIDIA&apos;s GPU-wide work scheduler
            <Cite s={S.blackwellUltraBlog} />, spreads the grid&apos;s thread blocks across the
            SMs in no guaranteed order, and every thread of a block runs on the same SM.
            <Cite s={S.cudaProgrammingModel} /> Second, each SM splits its blocks into warps of
            32 threads, and at each instruction issue cycle a warp scheduler picks a warp whose
            threads are ready and issues its next instruction. Switching warps costs nothing, so
            the SM hides a warp waiting on memory by issuing from another.
            <Cite s={S.cudaHardwareMultithreading} />
          </Box>
          <Box variant="p">
            <strong>Getting both levels right.</strong> The first scheduler spreads whatever the
            launch hands it: the grid and block sizes. The second can only choose among warps
            resident on the SM, and residency is capped: up to 32 blocks and 64 warps per SM on
            Hopper and B200
            <Cite s={S.hopperTuningGuide} />
            <Cite s={S.blackwellTuningGuide} />, fewer when each block uses more registers or
            shared memory, and a kernel whose single block exceeds the SM&apos;s resources fails
            to launch.
            <Cite s={S.cudaHardwareMultithreading} /> When a kernel stalls on memory, check
            resident warps per SM first (occupancy, worked through in <em>NVIDIA Hopper</em>).
          </Box>
          <Box variant="p">
            <strong>Stage 5: operand staging.</strong> The Tensor Core reads its operands from
            SMEM, registers or, on Blackwell, Tensor Memory (TMEM), so a tile in HBM is about 479
            cycles from use. Async copy (compute capability 8.0 and later) and the TMA bulk
            tensor copy (9.0, Hopper, and later) let the issuing thread keep computing while the
            hardware moves the data.
            <Cite s={S.cudaAsyncCopies} /> Pipelined kernels copy the next tile while they
            multiply the current one, so the trip overlaps with math.
          </Box>
          <Box variant="p">
            <strong>Stage 6: the Tensor Core fires.</strong> This is the only stage that does the
            math. On Hopper, <code>wgmma</code> reads operand B from SMEM and A from SMEM or
            registers, and keeps the accumulator in registers. On Blackwell,{' '}
            <code>tcgen05.mma</code> reads B from SMEM and A from SMEM or TMEM, and accumulates
            into TMEM
            <Cite s={S.ptxIsa} />, 256 KB per SM.
            <Cite s={S.blackwellUltraBlog} />
          </Box>
          <Box variant="p">
            <strong>Stage 7: write back.</strong> The result leaves from where it accumulated: to
            SMEM if the same block uses it next, to HBM if another kernel will read it, across
            the host link if the CPU needs it. Shared memory is allocated per thread block, so a
            value handed from one kernel to the next goes through global memory, the HBM every
            SM can reach.
            <Cite s={S.cudaProgrammingModel} /> That round trip at every kernel boundary is what
            fusion removes.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How far each memory level sits from the Tensor Core in measured cycles: the distance every staging and fusion decision works against"
          >
            Where the cycles go
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={latencyRows}
            columnDefinitions={[
              { id: 'level', header: 'Level', cell: (r) => r.level, minWidth: 120 },
              { id: 'size', header: 'Size', cell: (r) => r.size, minWidth: 190 },
              {
                id: 'latency',
                header: 'Load latency, H800 PCIe',
                cell: (r) => r.latency,
                minWidth: 150,
              },
              { id: 'fill', header: 'How data gets there', cell: (r) => r.fill, minWidth: 190 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Latencies are microbenchmark measurements by Luo et al. on an H800 PCIe, not vendor
            specifications. NVIDIA&apos;s Hopper and Blackwell tuning guides give no per-level
            latency, and no figure for registers or TMEM was located for this page.
            <Cite s={S.luoHopperBench} kind="measured" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Who fixes the instruction order: the GPU's hardware at run time, the Neuron compiler before the run, or the calling CPU thread"
          >
            One lifecycle, three kinds of silicon
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={lanes}
            columnDefinitions={[
              { id: 'sil', header: 'Silicon', cell: (r) => r.silicon, minWidth: 140 },
              { id: 'host', header: 'Stages 1-2 (host)', cell: (r) => r.host, minWidth: 200 },
              {
                id: 'disp',
                header: 'Stages 3-4 (dispatch)',
                cell: (r) => r.dispatch,
                minWidth: 220,
              },
              {
                id: 'unit',
                header: 'Stages 5-6 (operands and math)',
                cell: (r) => r.unit,
                minWidth: 240,
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>Where the order is decided.</strong> A GPU decides at run time, in hardware,
            at both scheduler levels, with no guarantee about which SM runs which block.
            <Cite s={S.cudaProgrammingModel} /> Trainium fixes the instruction order at compile
            time in the NEFF
            <Cite s={S.nkiOverview} />, and still runs control flow and dynamic shapes.
            <Cite s={S.trn2Arch} /> A Xeon runs AMX
            inside the calling thread, so there is no device queue and no host link to cross.{' '}
            <em>Determinism: NEFF and GPU Reproducibility</em> covers what each model means for
            reproducible output.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Fusion removes the HBM round trip between kernels, CUDA Graphs and PDL (Programmatic Dependent Launch) remove the launch gap, and a profile tells you which one to reach for"
          >
            Shortening the lifecycle
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Fusion removes the round trip.</strong> Unfused attention is three kernels: Q
            times K transposed, a softmax, then a multiply by V. The score matrix between them is
            written to HBM and read back twice, because shared memory belongs to one thread
            block.
            <Cite s={S.cudaProgrammingModel} /> FlashAttention fuses the three into one kernel,
            so each tile stays in SMEM through stages 5 and 6 and only the output is written
            back. <em>KV Cache and FlashAttention</em> covers the technique.
          </Box>
          <Box variant="p">
            <strong>The compiler decides what fuses.</strong> The hardware cannot tell that two
            operators belong together. The graph compiler decides which adjacent operators
            become one kernel: torch.compile with Inductor on NVIDIA, and on Trainium the XLA
            (Accelerated Linear Algebra) front end of neuronx-cc, which performs operator fusion.
            <Cite s={S.nkiOverview} /> On Trainium the fusion needs a graph: by default,
            TorchNeuron&apos;s eager mode compiles each operator into its own NEFF and its
            intermediates go through HBM, while torch.compile hands neuronx-cc one graph per NEFF.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.pytorchTorchNeuronBlog} /> <em>NVIDIA Compilers and Kernel Tooling</em> and{' '}
            <em>AWS Compilers and Kernel Tooling</em> cover the compilers that set how many
            kernels a token costs.
          </Box>
          <Box variant="p">
            <strong>Graphs and PDL remove the launch gap.</strong> Kernels that cannot be fused
            still pay stages 1 to 3 each time. A CUDA Graph is defined once and launched
            repeatedly; much of the setup is paid once, at instantiation, so each launch costs
            the CPU less than it would through a stream.
            <Cite s={S.cudaGraphs} /> PDL, available from compute
            capability 9.0, lets a kernel launch before the kernel it depends on in the same
            stream has finished, hiding its launch latency behind the first kernel&apos;s
            execution.
            <Cite s={S.cudaPdl} />
          </Box>
          <Box variant="p">
            <strong>Which lever to pull.</strong> If a profile shows the GPU idle between short
            kernels, the cost sits in stages 1 to 3: capture the sequence in a CUDA Graph, or
            use PDL for dependent pairs. If it shows an intermediate written to HBM by one kernel
            and read back by the next, the cost sits in stage 7 and the next stage 5: fuse them.
            If a single kernel stalls inside the SM, check resident warps per SM before
            rewriting its staging.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
