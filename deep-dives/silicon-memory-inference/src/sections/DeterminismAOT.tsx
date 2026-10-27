import React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Table from "@cloudscape-design/components/table";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { DeterminismDiagram } from "../components/DeterminismDiagram";
import { Cite } from "../components/Cite";
import { S } from "../sources/DeterminismAOT";

interface RegRow {
  framework: React.ReactNode;
  sets: React.ReactNode;
  replay: string;
}

const regRows: RegRow[] = [
  {
    framework: (
      <>
        SR (Supervision and Regulation) letter 26-2, April 2026, superseding SR
        11-7
        <Cite s={S.sr262Letter} />
      </>
    ),
    sets: (
      <>
        Model risk management for statistical models and non-generative AI;
        generative and agentic AI are out of scope. Validation generally
        precedes first use.
        <Cite s={S.sr262Guidance} />
      </>
    ),
    replay:
      "Shows production runs the validated version; not for generative models.",
  },
  {
    framework: (
      <>
        MiFID II (Markets in Financial Instruments Directive) RTS 6 (Regulatory
        Technical Standard 6)
        <Cite s={S.rts6} />
      </>
    ),
    sets: (
      <>
        Test algorithms before deployment (Art. 5) and validate them every year
        (Art. 9); HFT (high-frequency trading) firms record each submitted order
        and keep it five years (Art. 28).
        <Cite s={S.rts6} />
      </>
    ),
    replay:
      "Makes the pre-deployment test and the yearly validation repeatable.",
  },
  {
    framework: (
      <>
        SEC (Securities and Exchange Commission) Rule 17a-4(e)(8)
        <Cite s={S.sec17a4} />
      </>
    ),
    sets: (
      <>
        Keep reports reviewing customer accounts for unusual activity 18 months,
        or produce them on request; a report a changed system cannot reproduce
        needs a record of the changes or the parameters used.
        <Cite s={S.sec17a4} />
      </>
    ),
    replay: "A replayable model can regenerate its reports.",
  },
  {
    framework: (
      <>
        DORA (Digital Operational Resilience Act)
        <Cite s={S.dora} />
      </>
    ),
    sets: (
      <>
        Identify, document and address the root causes of ICT (information and
        communication technology) incidents (Art. 17).
        <Cite s={S.dora} />
      </>
    ),
    replay: "Shows whether the model or its input caused an incident.",
  },
];

export function DeterminismAOT() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What makes a served model answer the same request the same way twice, and what to archive so a call replays"
          >
            Determinism: NEFF and GPU Reproducibility
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A deterministic call returns the same bits for the same request on
            every run. It lets a team debug a model or its serving stack,
            regression-test an upgrade, and keep log-probabilities consistent
            across reinforcement learning (RL) rollouts.
            <Cite s={S.vllmBatchInvariance} />
            <Cite s={S.sglangDeterministic} />
          </Box>
          <Box variant="p">
            <strong>The batch decides.</strong> Even at temperature 0, a served
            model can answer the same request differently, mainly because batch
            size changes how kernels split their reductions, and floating-point
            addition is not associative.
            <Cite s={S.sglangDeterministic} /> On Trainium the batch also picks
            the program: the serving runtime chooses a pre-compiled NEFF (Neuron
            Executable File Format) for each step from the live batch.
            <Cite s={S.vllmNeuronBucketing} /> On any accelerator, then, rely on
            the same answer only when batch-invariant kernels are on or the
            batch shape is fixed.
          </Box>
          <DeterminismDiagram />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the compiler fixes, and the three things to pin before a Trainium call can replay"
          >
            Trainium: pin the NEFF, the rounding seed and the bucket
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Neuron compiler builds the NEFF ahead of time, fixing memory
            allocation and instruction order, so no warp scheduler makes those
            choices at run time.
            <Cite s={S.nkiOverview} /> A NeuronCore&apos;s on-chip SRAM (static
            RAM) is software-managed.
            <Cite s={S.neuronCoreV3} /> Timing still varies: the per-hop latency
            of intra-node ring collectives depends on HBM (High Bandwidth Memory)
            load.
            <Cite s={S.intranodeCollectives} />
          </Box>
          <Box variant="p">
            <strong>Rounding.</strong> Set{" "}
            <code>NEURON_RT_STOCHASTIC_ROUNDING_EN</code> on both PyTorch stacks,
            so the launch script records the mode. The XLA-based PyTorch-Neuron
            turns stochastic rounding on when <code>XLA_USE_BF16=1</code>;{" "}
            <code>NEURON_RT_STOCHASTIC_ROUNDING_EN=0</code> selects
            round-to-nearest-even.
            <Cite s={S.neuronRoundingModes} /> The torch-neuronx source at v2.33.0
            never sets <code>NEURON_RT_STOCHASTIC_ROUNDING_EN</code>
            <Cite
              s={S.torchNeuronxRepo}
              note="Searched the source tree at the tag for ROUNDING_EN and stochastic: no runtime setting, only RNG and decomposition code. Our search of the code, not an AWS statement."
            />, so on TorchNeuron the Neuron Runtime default applies: off, which is
            round-to-nearest-even.
            <Cite s={S.nrtEnvVarRef} /> To keep stochastic rounding, set{" "}
            <code>NEURON_RT_STOCHASTIC_ROUNDING_SEED</code> to a fixed value.
            <Cite s={S.neuronEnvVars} /> On TorchNeuron, keep the experimental
            eager-mode fusion (<code>TORCH_NEURONX_ENABLE_CONCATENATION=1</code>)
            off, its default, when runs must match, because fusion can change
            intermediate precision.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.torchNeuronNotes} />
          </Box>
          <Box variant="p">
            <strong>The bucket.</strong> vLLM Neuron compiles one decode NEFF
            per batch-size bucket and, with context-length buckets configured,
            picks on every step the smallest bucket that covers the batch.
            <Cite s={S.vllmNeuronBucketing} /> No test of whether two buckets
            give identical bits for one request was located during this
            research. Our reading: a single batch-size bucket and no
            context-length buckets leave one decode NEFF, at the cost of running
            every step at that shape.
          </Box>
          <Box variant="p">
            <strong>The NEFF file.</strong> Replay the archived NEFF rather than
            recompiling. Neuron 2.27.0 changed the <code>--auto-cast</code>{" "}
            default to <code>none</code> and turned on mixed-precision
            accumulation, so a newer compiler can give the same source different
            numerics.
            <Cite s={S.neuronCompilerNotes} />
          </Box>
          <ExpandableSection headerText="Why the replay check stays on the list">
            <Box variant="p">
              Neuron 2.31.0 fixed &quot;incorrect tensor reordering in the
              simplifier that could produce non-deterministic optimization
              results&quot;
              <Cite s={S.neuronCompilerNotes} />, and the NKI (Neuron Kernel
              Interface) Library fixed tensor alignment in its Attention TKG
              (token generation) kernel &quot;to resolve non-determinism
              error&quot;.
              <Cite s={S.nkiLibNotes} /> Both are fixed, and both are why the
              replay checklist at the end of this section closes with a
              verification step.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What makes one GPU process repeat itself, and the serving flag that frees a request from its batch"
          >
            NVIDIA GPUs: four settings for a process, batch invariance for a
            server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Libraries.</strong> cuBLAS gives the same bits on every run
            for one toolkit version on GPUs with the same architecture and
            number of SMs (streaming multiprocessors). With several CUDA streams
            active, give each stream its own workspace or set{" "}
            <code>CUBLAS_WORKSPACE_CONFIG=:4096:8</code>, which costs about 24
            MiB of GPU memory.
            <Cite s={S.cublasReproducibility} /> Most cuDNN routines repeat on
            one architecture; the exceptions use atomics, and none promises
            identical bits across architectures.
            <Cite s={S.cudnnReproducibility} />
          </Box>
          <Box variant="p">
            <strong>Framework.</strong> In PyTorch,{" "}
            <code>torch.use_deterministic_algorithms(True)</code> selects
            deterministic implementations and raises an error for an operation
            without one, <code>torch.backends.cudnn.benchmark = False</code>{" "}
            fixes cuDNN&apos;s algorithm choice, and{" "}
            <code>torch.manual_seed()</code> seeds every device.
            <Cite s={S.pytorchReproducibility} />
          </Box>
          <Box variant="code">
            <pre
              style={{ margin: 0, whiteSpace: "pre", overflowX: "auto" }}
            >{String.raw`# Shell: only needed when several CUDA streams are active
export CUBLAS_WORKSPACE_CONFIG=:4096:8

# Python, before the model runs
import torch
torch.manual_seed(0)
torch.use_deterministic_algorithms(True)
torch.backends.cudnn.benchmark = False`}</pre>
          </Box>
          <Box variant="p">
            <strong>Server.</strong> Those settings make a process repeat
            itself; a request in a shared server also needs batch invariance.
            vLLM turns it on with{" "}
            <code>VLLM_BATCH_INVARIANT=1 vllm serve &lt;model&gt;</code>: beta,
            compute capability 8.0 or higher, custom all-reduce off in
            tensor-parallel mode.
            <Cite s={S.vllmBatchInvariance} /> SGLang takes{" "}
            <code>--enable-deterministic-inference</code> with the FlashInfer,
            FlashAttention 3 or Triton attention backend, and its test passes on{" "}
            <code>Unique samples: 1</code> across 50 trials.
            <Cite s={S.sglangDeterministic} /> Both take a per-request seed for
            sampling above temperature 0 and leave the mode off by default; vLLM
            notes it may cost performance.
            <Cite s={S.vllmBatchInvariance} />
            <Cite s={S.sglangDeterministic} />
          </Box>
          <ExpandableSection headerText="The throughput cost, and reductions for custom kernels">
            <Box variant="p">
              Deterministic operations are often slower, and turning off cuDNN
              benchmarking gives up the fastest algorithm per input shape.
              <Cite s={S.pytorchReproducibility} /> For a custom kernel, CCCL
              (CUDA Core Compute Libraries) 3.1 gives{" "}
              <code>cub::DeviceReduce</code> three levels:{" "}
              <code>not_guaranteed</code> (single pass with atomics, the
              fastest), <code>run_to_run</code> (two passes, the default) and{" "}
              <code>gpu_to_gpu</code>.
              <Cite s={S.ccclV310} /> <code>gpu_to_gpu</code> returns identical
              results on different GPUs through a Reproducible Floating-point
              Accumulator.
              <Cite s={S.ccclDeterminismBlog} /> It is the only NVIDIA primitive
              located during this research that targets identical bits across
              GPU models, and its scope is one reduction on one device.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a workload that needs replay gets its own serving engine, even on isolated hardware"
          >
            Isolation and determinism are separate guarantees
          </Header>
        }
      >
        <Box variant="p">
          <em>Isolation: NIE and MIG</em> covers who can reach a tenant&apos;s
          state. Our reading: tenants that share a serving engine share its
          batches, so each one&apos;s traffic can change the others&apos;
          numbers. Give a workload that needs replay its own engine with a fixed
          batch shape, or run the shared engine batch-invariant.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which rules a replayable call helps you meet, next to what each text requires"
          >
            The regulatory map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            None of these texts requires identical output bits. The last column
            is our reading of where replay helps: a starting point for
            compliance, not legal guidance.
          </Box>
          <Table
            items={regRows}
            columnDefinitions={[
              {
                id: "fw",
                header: "Framework",
                cell: (r) => r.framework,
                minWidth: 180,
              },
              {
                id: "sets",
                header: "What the text sets",
                cell: (r) => r.sets,
                minWidth: 260,
              },
              {
                id: "replay",
                header: "Where replay helps",
                cell: (r) => r.replay,
                minWidth: 200,
              },
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
            description="What to archive with each deployment and each call, and the check that shows it is enough"
          >
            Before you rely on replay
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ul>
            <li>
              The input as the model saw it, after tokenization and padding,
              plus the sampling parameters and seed.
            </li>
            <li>The weights, at the precision served.</li>
            <li>
              Versions: the Neuron SDK, or the CUDA toolkit, cuDNN, PyTorch and
              serving engine. cuBLAS and PyTorch promise no match across
              versions
              <Cite s={S.cublasReproducibility} />
              <Cite s={S.pytorchReproducibility} />, and Neuron compiler
              defaults have changed between releases.
              <Cite s={S.neuronCompilerNotes} />
            </li>
            <li>
              Trainium: the NEFF file, both{" "}
              <code>NEURON_RT_STOCHASTIC_ROUNDING_*</code> variables, and{" "}
              <code>num_seqs_buckets</code> and{" "}
              <code>decode_context_length_buckets</code>.
              <Cite s={S.vllmNeuronBucketing} />
            </li>
            <li>
              GPUs: the batch-invariant setting, the attention backend, the
              architecture and the SM count. A MIG (Multi-Instance GPU) instance
              has its own share of the SMs
              <Cite s={S.migConcepts} />, so it is a different configuration
              from the whole GPU.
              <Cite s={S.cublasReproducibility} />
            </li>
            <li>The instance type.</li>
          </ul>
          <Box variant="p">
            Then replay a sample of archived calls on the same instance type and
            compare bit for bit. On SGLang, also run{" "}
            <code>
              python3 -m sglang.test.test_deterministic --test-mode single
              --n-trials 50
            </code>{" "}
            and expect <code>Unique samples: 1</code>.
            <Cite s={S.sglangDeterministic} /> Repeat both after every SDK,
            driver or engine upgrade.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
