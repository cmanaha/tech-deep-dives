import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { NvidiaCompilerStack } from '../components/NvidiaCompilerStack';
import { Cite } from '../components/Cite';
import { S } from '../sources/NvidiaCompilersAndTooling';

interface PathRow {
  path: string;
  what: React.ReactNode;
  check: React.ReactNode;
}

const pathRows: PathRow[] = [
  {
    path: 'CuTe DSL',
    what: (
      <>
        CuTe&apos;s layouts, tensors and hardware atoms from Python, with full control of the
        thread and data hierarchy
        <Cite s={S.cutlassReadme} />; it emits PTX
        <Cite s={S.cuteDslCompileOptions} />
      </>
    ),
    check: (
      <>
        First released with CUTLASS 4.0 and still public beta at v4.8.0
        <Cite s={S.cutlassReadme} />, which adds initial Rubin dense GEMMs
        <Cite s={S.cutlassChangelog} />. Inductor&apos;s CUTEDSL backend: Blackwell SM100 to SM109
        only.
        <Cite s={S.inductorConfig} />
      </>
    ),
  },
  {
    path: 'Gluon',
    what: (
      <>
        Triton&apos;s lower-level language on the same compiler stack: you manage the layouts,
        memory allocation, data movement and asynchrony Triton leaves to its compiler
        <Cite s={S.gluonIntro} />
      </>
    ),
    check: (
      <>
        Triton v3.8.0 (August 2026) adds Cluster Launch Control for Blackwell Gluon kernels and a
        Rubin-specific Gluon module
        <Cite s={S.tritonV380} />
      </>
    ),
  },
  {
    path: 'CUDA Tile (cuTile)',
    what: (
      <>
        Operations on whole tiles; the compiler handles the lowest level of parallelism and
        reaches the TMA (Tensor Memory Accelerator) and Tensor Cores. Python (cuda.tile) and C++
        (cuda::tiles) share one backend, CUDA Tile IR.
        <Cite s={S.cudaTileGuide} />
      </>
    ),
    check: (
      <>
        CUDA Tile C++ ships in the CUDA Toolkit from 13.3
        <Cite s={S.cudaTileGuide} />; cuTile Python 1.6.0 needs compute capability 8.x to 12.x and
        driver r580 or later, and its compiler, tileiras, needs ptxas and libnvvm.
        <Cite s={S.cutileQuickstart} />
      </>
    ),
  },
];

export function NvidiaCompilersAndTooling() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which path a PyTorch matmul takes to the GPU and the two settings that change it, which kernel language to write in, and which profiler to open first"
          >
            NVIDIA Compilers and Kernel Tooling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What the stack is.</strong> A PyTorch model reaches an NVIDIA GPU through
            compilers and libraries, each emitting into the next. TorchInductor, the compiler behind
            torch.compile, sits on top; Triton, CUTLASS (CUDA Templates for Linear Algebra
            Subroutines), CUDA Tile and cuBLAS sit in the middle. At the bottom, ptxas assembles PTX
            (Parallel Thread Execution, NVIDIA&apos;s virtual instruction set) into SASS (Streaming
            Assembler) for one architecture, such as <code>sm_100</code> (B200) or{' '}
            <code>sm_103</code> (B300)
            <Cite s={S.cudaGpus} />; a <code>compute_100f</code> build runs on B200, B300 and Rubin.
            <Cite s={S.computeCapabilities} />
          </Box>
          <Box variant="p">
            <strong>Why it matters.</strong> Most of what happens at operand staging and at the
            functional unit, two of the stages <em>Anatomy of a Kernel Execution</em> follows, was
            fixed before launch by the layer that generated the kernel: tile size, operand
            precision, where operands are staged, and what was fused. Knowing which layer produced a
            kernel tells you which knob changes it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="With no options, linear-layer matmuls run cuBLAS kernels; two settings decide whether Triton or CUTLASS kernels compete with them"
          >
            The default path, and how to change it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <NvidiaCompilerStack />
          <Box variant="small" color="text-body-secondary">
            Routing per the PyTorch v2.14.1 source code
            <Cite s={S.inductorUtils} />
            <Cite s={S.inductorMm} />; CuTe DSL emits PTX
            <Cite s={S.cuteDslCompileOptions} />; tileiras needs ptxas and libnvvm
            <Cite s={S.cutileQuickstart} />.
          </Box>
          <Box variant="p">
            torch.compile hands the graph to TorchInductor, its default backend.
            <Cite s={S.torchCompileDefault} /> Inductor generates Triton for the pointwise and
            reduction operations it fuses, and sends <code>aten.mm</code> and{' '}
            <code>aten.addmm</code>, the operators a linear layer usually lowers to
            <Cite s={S.atenLinear} />, to ATen, PyTorch&apos;s operator library
            <Cite s={S.inductorUtils} />
            <Cite s={S.inductorMm} />, which calls cuBLAS or cuBLASLt.
            <Cite s={S.atenCudaBlas} /> Matrix size does not send a matmul to CUTLASS; two settings do. This
            routing is read from the PyTorch v2.14.1 source code.
          </Box>
          <Box variant="p">
            <code>mode=&quot;max-autotune&quot;</code> turns on <code>max_autotune</code>
            <Cite s={S.inductorModes} />, and Inductor then benchmarks Triton GEMM (general matrix
            multiply) templates against cuBLAS and keeps the fastest. CUTLASS joins only when it is
            listed in <code>max_autotune_gemm_backends</code>, default{' '}
            <code>ATEN,TRITON,CPP</code>
            <Cite s={S.inductorConfig} />
            <Cite s={S.inductorUtils} />; <code>CUTEDSL</code> adds a CuTe DSL grouped GEMM (
            <code>torch._grouped_mm</code>) for BF16 on datacenter Blackwell.
            <Cite s={S.inductorGroupedMm} /> If Inductor cannot import CUTLASS, it logs a warning
            and skips it
            <Cite s={S.inductorUtils} />, so check the compile log before calling a result a CUTLASS
            result.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`import torch
import torch._inductor.config as inductor_config

# Optional: let CUTLASS GEMM templates compete too. The environment
# variable TORCHINDUCTOR_MAX_AUTOTUNE_GEMM_BACKENDS sets the same list.
inductor_config.max_autotune_gemm_backends = "ATEN,TRITON,CUTLASS"

# max-autotune benchmarks the GEMM backends in the list and keeps the fastest.
compiled = torch.compile(model, mode="max-autotune")`}</pre>
          </Box>
          <ExpandableSection headerText="Read from the code: the exact conditions, and two exceptions">
            <SpaceBetween size="xs">
              <Box variant="p">
                <code>use_aten_gemm_kernels()</code> is true whenever max-autotune is off (utils.py
                lines 2706-2709); <code>tuned_addmm</code> then returns the ATen kernel without
                considering templates (kernel/mm.py lines 694-707), and <code>tuned_mm</code> adds
                Triton templates only under max-autotune (lines 429-437).{' '}
                <code>use_cutlass_template()</code> needs max-autotune and <code>CUTLASS</code> in
                the list (utils.py lines 2288-2318).
                <Cite s={S.inductorUtils} />
                <Cite s={S.inductorMm} />
              </Box>
              <Box variant="p">
                Exceptions: batched (<code>bmm</code>), INT8 (<code>_int_mm</code>) and FP8 (
                <code>_scaled_mm</code>) matmuls offer a Triton template without max-autotune, so the
                autotuner can pick Triton for them
                <Cite s={S.inductorBmm} />
                <Cite s={S.inductorMm} />; a matmul with K and N both below 5 and M of at least 64
                becomes a fused pointwise kernel.
                <Cite s={S.inductorSmallMm} />
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Five ways to write a kernel, what each makes you control, and the version to check before you commit"
          >
            Choosing a kernel authoring path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Triton</Box>
              <Box variant="p">
                A Python DSL (domain-specific language) for tile-based kernels. The author picks
                block sizes, usually a short list of <code>triton.Config</code> candidates that{' '}
                <code>@triton.autotune</code> benchmarks
                <Cite s={S.tritonMatmulTutorial} />; the compiler manages layouts, memory
                allocation, data movement and asynchrony.
                <Cite s={S.gluonIntro} /> Use it for novel and fused operators. Its limit: when
                hand-tuned low-level code beats the compiler, Triton hides the details you would
                need to change
                <Cite s={S.gluonIntro} />; Gluon exposes them.
              </Box>
            </div>
            <div>
              <Box variant="h3">CUTLASS / CuTe</Box>
              <Box variant="p">
                A C++ template library: the author parameterizes a kernel template with tile shapes,
                threadblock layouts and warp specializations, on CuTe&apos;s layout algebra. CUTLASS
                kernels use Blackwell&apos;s Tensor Memory (TMEM) directly.
                <Cite s={S.cutlassChangelog} /> Use it for matmul-class kernels at peak throughput.
                Its limit is C++ template metaprogramming; CuTe DSL gives the same control with a
                smoother learning curve and faster compiles.
                <Cite s={S.cutlassReadme} /> TensorRT-LLM ships CUTLASS and CuTe DSL MoE backends
                <Cite s={S.wideEpReadme} />; this research located no NVIDIA statement of what
                cuBLAS, cuDNN or cuTENSOR use internally.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="h3">Three newer paths</Box>
          <ColumnLayout columns={3} variant="text-grid">
            {pathRows.map((r) => (
              <div key={r.path}>
                <Box variant="h4">{r.path}</Box>
                <Box variant="p">{r.what}</Box>
                <Box variant="p">
                  <strong>Check:</strong> {r.check}
                </Box>
              </div>
            ))}
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="NVIDIA's PyTorch-native LLM runtime, and the example to start a Wide-EP deployment from"
          >
            TensorRT-LLM and Wide-EP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TensorRT-LLM is NVIDIA&apos;s LLM (large language model) inference runtime. PyTorch has
            been its default backend since v1.0.0
            <Cite s={S.trtllmV100} />, and v1.2.1, the latest stable release (April 2026)
            <Cite s={S.trtllmV121} />, is architected on PyTorch with a Python LLM API, custom
            attention kernels and FP8 and FP4 quantization.
            <Cite s={S.trtllmReadme} /> FP8 MoE (mixture of experts) support dates from v0.12.0.
            <Cite s={S.trtllmV0120} /> TensorRT is a separate product that compiles a trained model,
            usually an ONNX (Open Neural Network Exchange) export, into a GPU-specific engine.
            <Cite s={S.tensorrtQuickStart} />
          </Box>
          <Box variant="p">
            Wide Expert Parallelism (Wide-EP) spreads a large MoE model&apos;s experts across many
            GPUs, with communication kernels for Multi-Node NVLink (MNNVL); its prerequisites name
            GB200 NVL72, GB300 NVL72, H20 or RTX 6000D.
            <Cite s={S.wideEpReadme} /> Start from the{' '}
            <Link external href={S.wideEpExample.url}>
              Wide-EP example at v1.2.1
            </Link>
            <Cite s={S.wideEpExample} />; <em>Grace-Blackwell and UltraServer</em> covers how an
            expert layout fits an NVL72 domain. MoE kernels land release by release in TensorRT-LLM
            and CUTLASS, so check the release your kernel path landed in before you pin a version.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One profiler shows whether the GPU is kept fed, the other why a kernel is slow; open them in that order"
          >
            Profiling: Nsight Systems and Nsight Compute
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Nsight Systems</strong> profiles the whole system over time: kernel launches,
            CUDA streams, NCCL (NVIDIA Collective Communications Library) collectives, host CPU
            activity, and GPU metrics for PCIe, NVLink and memory throughput and SM (Streaming
            Multiprocessor) utilization.
            <Cite s={S.nsightSystemsGuide} /> It shows whether the GPU is kept fed, and finds
            serialization upstream that a kernel profile cannot see.
          </Box>
          <Box variant="p">
            <strong>Nsight Compute</strong> profiles one kernel at the instruction level:
            occupancy, warp stall reasons, memory throughput per tier, Tensor Core utilization and
            cycles per pipeline. Its stall reasons read as operand-staging diagnoses: long
            scoreboard is a wait on L1TEX (local or global memory), short scoreboard usually on
            shared memory, and no instructions is typical of very short kernels with less than one full wave of
            work. It locks SM clocks by default, so its kernel durations can differ from Nsight
            Systems&apos;.
            <Cite s={S.nsightComputeGuide} />
          </Box>
          <Box variant="p">
            Start in Nsight Systems to see where the time goes. When it points at a kernel,
            right-click that kernel on the timeline to open it in Nsight Compute.
            <Cite s={S.nsightSystemsGuide} />
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
