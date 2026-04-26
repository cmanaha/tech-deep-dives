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
import { NvidiaCompilerStack } from '../components/NvidiaCompilerStack';

interface ToolRow {
  layer: string;
  what: string;
  consumed: string;
}

const toolRows: ToolRow[] = [
  { layer: 'PyTorch eager / torch.compile', what: 'High-level model authoring; torch.compile runs Inductor by default', consumed: 'Application code' },
  { layer: 'Inductor', what: 'PyTorch native compiler — captures graph, emits Triton kernels by default', consumed: 'PyTorch graph' },
  { layer: 'Triton', what: 'Python DSL with auto-tiling; the compiler chooses tile sizes and SMEM staging', consumed: 'Triton @triton.jit kernels' },
  { layer: 'CUTLASS / CuTe', what: 'C++ template library for tile-based kernels; CuTe is the layout algebra (Hopper / Blackwell)', consumed: 'C++ template parameters' },
  { layer: 'cuBLAS / cuDNN / cuTENSOR', what: 'High-level libraries that vendor-tune the canonical kernels', consumed: 'Library API calls' },
  { layer: 'TensorRT / TensorRT-LLM', what: 'Inference compiler — graph optimization, kernel selection, FP8 / NVFP4 cubins, Wide-EP for MoE', consumed: 'ONNX / HuggingFace / custom IR' },
  { layer: 'Nsight Compute / Systems', what: 'Profiler — kernel-level (Compute) and system-level (Systems) tracing', consumed: 'Compiled binary at runtime' },
  { layer: 'PTX → SASS', what: 'PTX is the virtual ISA; ptxas lowers to SASS / cubin per architecture (sm_90a, sm_100)', consumed: 'PTX from any of the above' },
];

export function NvidiaCompilersAndTooling() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The path from Python code to SASS instructions on a Blackwell SM"
          >
            NVIDIA compilers and kernel tooling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 5 said the kernel lifecycle has
            seven stages. Stages 4-6 (SM scheduling, operand staging, functional unit
            firing) are what the silicon does at runtime; stages 1-2 are what the
            compiler did before runtime. The compiler decides which tile size the
            tensor core sees, which precision the operand has, where the operand was
            staged from, and whether the kernel is fused or not. None of this is the
            silicon&apos;s decision — the silicon is the substrate. The compiler is
            the lever.
          </Box>
          <Box variant="p">
            <strong>What &ldquo;NVIDIA compiler stack&rdquo; means.</strong> Not one
            compiler — a stack of seven cooperating layers, each emitting into the
            next. PyTorch and torch.compile sit at the top; CUTLASS / CuTe / Triton
            sit in the middle; PTX → SASS sits at the bottom. TensorRT-LLM is the
            inference-specialized variant. Nsight Compute and Nsight Systems are the
            profilers that close the feedback loop.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The lowering path from Python to SASS"
          >
            The stack, visualized
          </Header>
        }
      >
        <SpaceBetween size="m">
          <NvidiaCompilerStack />
          <Box variant="p">
            Most production code paths reach the GPU through Inductor → Triton →
            PTX → SASS. Heavy matmul paths reach it through Inductor → CUTLASS / CuTe
            → PTX → SASS. Library-bound code paths reach it through cuBLAS / cuDNN —
            which themselves are compiled with CUTLASS internally. TensorRT-LLM at the
            top of the stack consumes the same lower layers but adds inference-specific
            graph optimizations and fused kernels (FP8 MoE, NVFP4 MoE, fused attention).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each layer, what it does, and what it consumes"
          >
            The seven layers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={toolRows}
            columnDefinitions={[
              { id: 'layer', header: 'Layer', cell: (r) => r.layer, minWidth: 220 },
              { id: 'what', header: 'What it does', cell: (r) => r.what },
              { id: 'cons', header: 'Consumes', cell: (r) => r.consumed },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Authoritative sources:{' '}
            <Link external href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/">
              CUDA Programming Guide
            </Link>
            ,{' '}
            <Link external href="https://triton-lang.org/main/index.html">
              Triton
            </Link>
            ,{' '}
            <Link external href="https://github.com/NVIDIA/cutlass">
              CUTLASS
            </Link>
            ,{' '}
            <Link external href="https://nvidia.github.io/TensorRT-LLM/">
              TensorRT-LLM
            </Link>
            ,{' '}
            <Link external href="https://pytorch.org/docs/stable/torch.compiler.html">
              torch.compile
            </Link>
            ,{' '}
            <Link external href="https://docs.nvidia.com/nsight-compute/">
              Nsight Compute
            </Link>
            . All access dates 2026-04-23.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The two open paths most production code goes through"
          >
            Triton vs CUTLASS
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Triton</Box>
            <Box variant="p">
              Python DSL. The author writes scalar Python that operates on
              <code> tl.arange</code>-shaped tiles; the compiler chooses tile sizes,
              SMEM staging, and the warp-level schedule. Default backend for
              torch.compile/Inductor on NVIDIA. The right tool for novel kernels and
              for non-matmul-dominated code.
            </Box>
            <Box variant="p">
              Strengths: fast iteration, autotuning across tile sizes, good error
              messages. Weakness: not always at peak for the most heavily-tuned
              matmuls.
            </Box>
          </div>
          <div>
            <Box variant="h3">CUTLASS / CuTe</Box>
            <Box variant="p">
              C++ template library. Author parameterizes a kernel template with tile
              shapes, threadblock layouts, and warp specializations. CuTe is the
              newer layout algebra that exposes TMEM as a first-class data locale
              for Blackwell. The right tool for matmul-class kernels at peak
              throughput.
            </Box>
            <Box variant="p">
              Strengths: peak performance, NVIDIA-tuned templates. Weakness:
              steep template-metaprogramming learning curve, slower iteration.
            </Box>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="When does NVIDIA pick which?">
          <Box variant="p">
            cuBLAS, cuDNN, cuTENSOR, and TensorRT-LLM internally use CUTLASS for the
            hottest paths. torch.compile / Inductor emits Triton by default, and
            falls back to CUTLASS / cuBLAS for matmul where the size is large enough
            to be peak-bound. Production code rarely picks one or the other — most
            inference servers compose both, with framework-level kernels in CUTLASS
            and per-model fused operators in Triton.
          </Box>
        </ExpandableSection>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The MoE-specific layer"
          >
            TensorRT-LLM and Wide-EP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TensorRT-LLM is NVIDIA&apos;s inference-specialized compiler. On top of
            the lower layers it ships fused MoE kernels, NVFP4 cubins, FP8 OOTB MoE
            (since v0.12.0), and Wide Expert Parallelism (Wide-EP) targeting GB200
            NVL72 specifically. Wide-EP uses MNNVL all-to-all over NVLink rather than
            falling back to NCCL all-gather over InfiniBand
            ({' '}
            <Link external href="https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep">
              TRT-LLM Wide-EP example
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Alert type="info" header="The MoE-specific kernels are recent">
            TRT-LLM&apos;s fused MoE module shipped in steps: Mixtral 8x7B in v0.9.0,
            FP8 MoE in v0.12.0, Wide-EP and MNNVL all-to-all in v0.21.0, NVFP4 MoE
            cubins in v1.0. CUTLASS example 92 (Blackwell SM100 MoE GEMM) shipped in
            v4.0.0 (June 2025) with simplified API in v4.3.0 (November 2025). For an
            MoE workload, the version of the toolchain matters as much as the silicon.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Closing the feedback loop"
          >
            Profiling — Nsight Compute and Nsight Systems
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Nsight Compute</strong> profiles individual kernels at the
            instruction level. It reports SM occupancy, warp stall reasons (long
            scoreboard, short scoreboard, no instructions), memory throughput per
            tier, achieved tensor-core utilization, and cycle counts per pipeline
            stage. This is the tool that tells you whether stage 5 of the kernel
            lifecycle (operand staging) is the bottleneck or whether the warp
            scheduler is starved.
          </Box>
          <Box variant="p">
            <strong>Nsight Systems</strong> profiles at the system level — kernel
            launches, NVLink and PCIe traffic, CUDA streams, NCCL collectives, host
            CPU activity. This is the tool that tells you whether the GPU is even
            being kept fed by the host stack, or whether there is a serialization
            point upstream that the kernel-level profile cannot see.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
