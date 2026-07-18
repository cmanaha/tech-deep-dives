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
import { KernelLifecycleDiagram } from '../components/KernelLifecycleDiagram';

interface LatencyRow {
  tier: string;
  cycles: string;
  ns: string;
  who: string;
  notes: string;
}

const latencyRows: LatencyRow[] = [
  {
    tier: 'Register file',
    cycles: '1 cycle',
    ns: '~0.5 ns at 2 GHz',
    who: 'Warp / thread / tile register',
    notes: 'Effectively free; one operand per clock per lane',
  },
  {
    tier: 'L1 / SMEM (warp-local)',
    cycles: '~20-30 cycles',
    ns: '~10-15 ns',
    who: 'Async copy / TMA / cooperative groups',
    notes: 'On Hopper SMEM is up to 228 KB per SM, sharing 256 KB with L1',
  },
  {
    tier: 'TMEM (Blackwell)',
    cycles: 'Few cycles to tensor core',
    ns: '~ns class',
    who: 'tcgen05 operand staging',
    notes: '256 KB per SM; dedicated tensor-core operand storage',
  },
  {
    tier: 'L2 (device-wide)',
    cycles: '~150-300 cycles',
    ns: '~75-150 ns',
    who: 'L2 cache controller',
    notes: 'H100 L2 is 50 MB. Shared across all SMs',
  },
  {
    tier: 'HBM (tier 6)',
    cycles: '~300-600 cycles',
    ns: '~150-300 ns',
    who: 'HBM PHY across the interposer',
    notes: 'H200 reads at 4.8 TB/s aggregate; per-access latency stays in this band',
  },
  {
    tier: 'Host DRAM via PCIe',
    cycles: 'Thousands of cycles',
    ns: '~1-3 µs',
    who: 'PCIe Gen5 / NVLink-C2C',
    notes: 'Crossing PCIe is dominated by protocol setup, not raw bandwidth',
  },
  {
    tier: 'Cross-host (NCCL / NIXL / EFA)',
    cycles: 'Tens of thousands of cycles',
    ns: '~10-50 µs',
    who: 'NCCL kernel + EFA / NVLink fabric',
    notes: 'Tail-sensitive; SRD spraying and topology aware',
  },
];

interface SiliconLaneRow {
  silicon: string;
  hostStage: string;
  dispatchStage: string;
  unitStage: string;
  citationLabel: string;
  url: string;
}

const siliconLanes: SiliconLaneRow[] = [
  {
    silicon: 'NVIDIA Hopper / Blackwell SIMT GPU',
    hostStage: 'PyTorch → CUDA driver → cudaLaunchKernel; command queue submitted to device',
    dispatchStage: 'GPU front-end accepts grid; warp scheduler allocates blocks to SMs (max 32 blocks / SM, 64 concurrent warps / SM on Hopper)',
    unitStage: 'Async copy → SMEM → tensor core via wgmma (Hopper) or tcgen05.mma over TMEM (Blackwell)',
    citationLabel: 'NVIDIA Hopper Tuning Guide',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
  },
  {
    silicon: 'AWS Trainium2 / Inferentia2',
    hostStage: 'PyTorch → torch-neuronx → XLA HLO → Neuron compiler emits NEFF (ahead of time)',
    dispatchStage: 'Neuron runtime binds NEFF to NeuronCores; dispatch is descriptor-driven, not warp-scheduled',
    unitStage: 'SBUF / PSUM staged by compiler; systolic array consumes pre-tiled operands; CC-Cores carry collectives',
    citationLabel: 'AWS Neuron SDK documentation',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/',
  },
  {
    silicon: 'Intel Xeon 6 with AMX',
    hostStage: 'PyTorch → oneDNN → AMX kernel; in-process call (no PCIe boundary)',
    dispatchStage: 'OS / OpenMP scheduler places thread; AMX state managed by XSAVE/XRSTOR',
    unitStage: 'Tile registers loaded from L1; TDPBF16PS / TDPFP16PS executes 16×16 tile matmul',
    citationLabel: 'Intel AMX technical overview',
    url: 'https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html',
  },
];

export function KernelExecutionLifecycle() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="From host code to functional-unit retire — where the memory hierarchy plays in inference"
          >
            Anatomy of a kernel execution
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 4 laid out the memory hierarchy as a
            static map — seven tiers, capacities, bandwidths. That map is necessary but
            not sufficient. The interesting question is dynamic: when a Python program
            calls a kernel, which tier gets touched at which moment, and how many cycles
            does the silicon spend in each? That is what this section walks through. The
            same vocabulary applies later, in the vendor-specific chapters; here we
            establish the sequence so the bandwidth numbers in Sections 6-18 read against
            a clear flow.
          </Box>
          <Box variant="p">
            <strong>The high-level claim.</strong> A single kernel invocation is a
            seven-stage pipeline. Stages 1-2 happen on the host CPU, stages 3-7 happen on
            the device. The memory tier touched at each stage rises and falls — host DRAM
            for stage 1, on-device queue SRAM for stage 3, register file for stage 4,
            scratchpad SMEM/TMEM/SBUF for stage 5, register tier again at the unit, then
            on the way out a write-back path that may stop at SMEM, may flush to HBM, or
            may cross PCIe back to the host depending on where the result is consumed.
            The cycles the silicon spends in each stage span four orders of magnitude.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The seven stages — what happens in order"
          >
            The kernel lifecycle, visualized
          </Header>
        }
      >
        <SpaceBetween size="m">
          <KernelLifecycleDiagram />
          <Box variant="p">
            Stage 1 — host issue — is the framework stack. PyTorch resolves the operator,
            picks a kernel from cuBLAS / cuDNN / Triton (NVIDIA), torch-neuronx /
            NEFF cache (Trainium), or oneDNN / AMX (Xeon). The operator may already be
            fused (FlashAttention, fused MoE, fused activation+gemm) or may be a single
            primitive. The choice happens in microseconds and does not yet touch device
            memory.
          </Box>
          <Box variant="p">
            Stage 2 — driver submit — is where the host writes a launch descriptor into a
            command queue and signals the device. On NVIDIA this is the CUDA driver
            translating <code>cudaLaunchKernel</code> into a host-pinned command buffer
            and ringing a doorbell across PCIe (or NVLink-C2C on Grace-Blackwell). On
            Trainium the Neuron runtime places a NEFF dispatch descriptor onto a
            NeuronCore queue. On Xeon AMX the &ldquo;launch&rdquo; is a function call —
            the AMX instructions execute in the same thread as the rest of the program,
            so there is no host/device boundary at this stage.
          </Box>
          <Box variant="p">
            Stage 3 — device dispatch — is the device front-end accepting the launch.
            The GPU&apos;s grid scheduler partitions the kernel grid across SMs; the
            NeuronCore dispatcher matches the descriptor to the right NeuronCore. This
            stage lives in on-device SRAM queues; latency is tens of nanoseconds, mostly
            invisible at workload time scales.
          </Box>
          <Box variant="p">
            Stage 4 — SM / core scheduling — is the warp or wave allocator. On Hopper an
            SM holds up to 64 concurrent warps with 32 threads each
            {' ('}
            <Link external href="https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html">
              Hopper Tuning Guide
            </Link>
            , accessed 2026-04-24); the scheduler picks warps that are ready (operands
            staged, no outstanding stalls) and issues them to the functional units. On
            Trainium there is no warp scheduler — the NEFF descriptor already encodes
            the schedule, and the runtime simply walks it. This is the architecture
            choice that makes Trainium deterministic at runtime.
          </Box>
          <Box variant="p">
            Stage 5 — operand staging — is where the memory hierarchy earns its place.
            The functional unit reads operands from the register file at one cycle of
            latency; the register file in turn was filled from SMEM / TMEM / SBUF with
            10s of nanoseconds of latency; SMEM was filled from L2 with 100s of
            nanoseconds; L2 was filled from HBM with 100s of nanoseconds more. Async copy
            (Hopper), TMA (Hopper), tcgen05 (Blackwell), and SBUF DMA (Trainium) are the
            primitives that hide these tiers in software pipelines. When they fail to
            hide a tier — when the operand is not ready when the warp is — the warp
            stalls. The cost of that stall is what Section 2 called &ldquo;not portable
            between architecture classes.&rdquo;
          </Box>
          <Box variant="p">
            Stage 6 — functional unit fires — is the actual matmul. On Hopper this is
            wgmma operating on a tile staged through SMEM. On Blackwell it is
            tcgen05.mma operating on a tile resident in TMEM. On Trainium it is the
            systolic array consuming SBUF-resident operands and writing partial sums
            into PSUM. On Xeon 6 it is TDPBF16PS or TDPFP16PS executing on AMX tile
            registers loaded from L1. This is the only stage that produces FLOPs; every
            other stage is overhead.
          </Box>
          <Box variant="p">
            Stage 7 — retire and return — is the write-back path. Results land in the
            register tier, may write back to SMEM if a downstream kernel will consume
            them on the same SM, may flush to HBM if a different SM or device will read
            them, and may cross PCIe back to the host if the result is consumed by the
            framework. Each &ldquo;may&rdquo; is a tier-six or tier-seven traversal —
            another 100s of nanoseconds, often more than the matmul itself.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Cycles and nanoseconds per memory tier — the dynamic counterpart to the static hierarchy in Section 4"
          >
            Where the cycles go
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={latencyRows}
            columnDefinitions={[
              { id: 'tier', header: 'Memory tier', cell: (r) => r.tier, minWidth: 180 },
              { id: 'cycles', header: 'Approx cycles', cell: (r) => r.cycles },
              { id: 'ns', header: 'Approx nanoseconds', cell: (r) => r.ns },
              { id: 'who', header: 'Who reads from it', cell: (r) => r.who },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
            variant="embedded"
            wrapLines
          />
          <Alert type="info">
            Cycle and nanosecond figures above are typical industry ranges for modern
            accelerator and host-CPU silicon. They are intended as orientation, not
            vendor-specific receipts. Verified Tier 1 sourcing for the architectural
            facts (Hopper L2 = 50 MB, Hopper SMEM = 228 KB, H200 HBM = 4.8 TB/s, AMX
            tile registers = 16×64 bytes) lives in Section 4 (Memory Hierarchy Primer)
            and Section 6 (HBM and the Bandwidth Wall). Specific cycle counts per
            architecture remain UNKNOWN here pending the per-vendor sections, where
            tuning-guide citations land directly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The same seven stages, three different silicon classes"
          >
            Three lanes — NVIDIA SIMT, AWS Trainium AOT, Xeon AMX
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={siliconLanes}
            columnDefinitions={[
              { id: 'sil', header: 'Silicon class', cell: (r) => r.silicon, minWidth: 220 },
              { id: 'host', header: 'Stages 1-2 (host)', cell: (r) => r.hostStage },
              { id: 'disp', header: 'Stages 3-4 (dispatch)', cell: (r) => r.dispatchStage },
              { id: 'unit', header: 'Stages 5-6 (operand + unit)', cell: (r) => r.unitStage },
              {
                id: 'src',
                header: 'Source',
                cell: (r) => (
                  <Link external href={r.url}>
                    {r.citationLabel}
                  </Link>
                ),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">All vendor-cited rows accessed 2026-04-24.</Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">SIMT (NVIDIA)</Box>
              <Box variant="p">
                Lots of dynamic scheduling. Warps are picked at runtime, operand
                staging is software-managed (CUTLASS, Triton, Inductor) but eviction
                is hardware-cached. The cost of a missed schedule is a pipeline bubble
                visible only to the profiler.
              </Box>
            </div>
            <div>
              <Box variant="h3">AOT (AWS Trainium)</Box>
              <Box variant="p">
                No runtime scheduling. The Neuron compiler emits the entire schedule
                into the NEFF; the runtime walks it deterministically. The cost of a
                missed schedule is a slip visible at compile time, not at runtime.
                This is the property that makes Trainium reproducible per-call.
              </Box>
            </div>
            <div>
              <Box variant="h3">In-process (Xeon AMX)</Box>
              <Box variant="p">
                No host/device boundary. The launch is an instruction, not a kernel.
                AMX tile registers live in the same architectural state as the rest of
                the thread, so the lifecycle is shorter — but front-end mispredict and
                cache miss costs replace the GPU&apos;s warp stall as the dominant loss.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What changes when the kernel is fused vs unfused"
          >
            Fused kernels collapse stages
          </Header>
        }
      >
        <ExpandableSection
          headerText="Why FlashAttention is faster than the naïve attention chain"
          defaultExpanded
        >
          <SpaceBetween size="s">
            <Box variant="p">
              The naïve attention pipeline is three operators: a Q × K matmul, a
              softmax, and a softmax × V matmul. Three operators means three kernel
              invocations, three lifecycles, and — most importantly — three
              round-trips to HBM. The intermediate (the attention scores tensor)
              has to land in HBM after operator 1 and be re-read at operator 2,
              because the softmax kernel cannot assume the previous kernel&apos;s
              SMEM is still resident.
            </Box>
            <Box variant="p">
              FlashAttention fuses the three operators into a single kernel. The
              tile resident in SMEM (or TMEM on Blackwell) survives across the
              matmul, softmax, and second matmul. Stages 5 and 6 of the lifecycle
              run in a tight loop with no detour through HBM. Section 4&apos;s
              point about &ldquo;round trips to HBM&rdquo; being the cost of
              missing the scratchpad tier shows up here as the concrete payoff
              for kernel fusion. Section 22 covers FlashAttention-class techniques
              in detail; the lifecycle here is what fusion is actually changing.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
        <ExpandableSection headerText="Why operator fusion is a compiler problem, not a hardware problem">
          <Box variant="p">
            The hardware does not know that two operators belong together. The
            compiler — torch.compile / Inductor on the NVIDIA side, the Neuron
            compiler on the AWS side, oneDNN on the Xeon side — has to decide that
            two adjacent operators in the IR can be lowered into a single kernel
            with shared SMEM/SBUF residency. This is why Sections 14 (NVIDIA
            Compilers and Kernel Tooling) and 16 (AWS Compilers and Kernel Tooling)
            are first-class entries in this deep dive: they own the lever that
            controls how many lifecycles a model has to walk per token.
          </Box>
        </ExpandableSection>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What this section sets up for the rest of the deep dive"
          >
            Connecting threads
          </Header>
        }
      >
        <Box variant="p">
          The lifecycle is the through-line for the next twenty sections. The HBM
          tier (Section 6) is where stage 5 stalls when SMEM does not catch the load
          in time. Chiplet topology (Section 8) determines how many extra
          nanoseconds stage 5 has to absorb when the working set crosses a
          chiplet boundary. NVIDIA Hopper / Blackwell (Sections 12-13) and AWS
          Trainium (Section 17) implement stages 4-6 differently and the
          differences directly affect the cycle counts in this section&apos;s
          table. Communication and scale-out (Section 27) is what stage 7 looks
          like when the result has to leave the device. Every per-vendor number
          you see later in the deep dive is, ultimately, an answer to &ldquo;how
          many cycles does this stage cost on this silicon for this workload.&rdquo;
        </Box>
      </Container>
    </SpaceBetween>
  );
}
