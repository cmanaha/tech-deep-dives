import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

interface EngineRow {
  engine: string;
  strengths: string;
  weaknesses: string;
  bestWhen: string;
  hardware: string;
}

const engineRows: EngineRow[] = [
  {
    engine: 'vLLM',
    strengths:
      'Broadest hardware support; widest model coverage; PyTorch-Foundation governance and a large community; fast feature cadence (PagedAttention, prefix caching, speculative decoding, disaggregation, LoRA all in-tree).',
    weaknesses:
      'On a given NVIDIA GPU, a compiled engine can sometimes edge it on raw throughput; prefix-reuse on heavy shared-prefix workloads can trail SGLang depending on workload and version.',
    bestWhen:
      'You want one engine across mixed hardware, the longest model list, and the fastest path to new features. The safe default for most teams.',
    hardware:
      'NVIDIA CUDA, AMD ROCm, Intel XPU/CPU, ARM/IBM Z CPU in-tree; AWS Neuron, Google TPU, Intel Gaudi via plugins.',
  },
  {
    engine: 'SGLang',
    strengths:
      'RadixAttention (a radix-tree KV cache that automatically reuses shared prefixes across requests); cache-aware scheduling; strong structured-output and multi-turn handling.',
    weaknesses:
      'Smaller community and model catalog than vLLM; the prefix-reuse edge is workload-dependent (it shrinks when prefixes are not shared).',
    bestWhen:
      'Workloads dominated by shared prefixes: long system prompts, few-shot templates, agent/multi-turn chat, structured/constrained decoding.',
    hardware: 'NVIDIA, AMD, Intel Xeon, Google TPU, Ascend NPU.',
  },
  {
    engine: 'TensorRT-LLM',
    strengths:
      'Ahead-of-time compiled engines tuned per GPU architecture can deliver very high raw throughput and low time-to-first-token on NVIDIA hardware.',
    weaknesses:
      'NVIDIA-only; engines are compiled per model + GPU + parallelism config, so the build/setup step is heavier and re-builds are needed when any of those change. Less portable.',
    bestWhen:
      'You are NVIDIA-locked, the model set is stable, and squeezing maximum throughput out of fixed hardware justifies a compile step in your pipeline.',
    hardware: 'NVIDIA only (H100/H200, A100, B200/Blackwell, GB200).',
  },
  {
    engine: 'TGI (Hugging Face)',
    strengths:
      'Production-ready toolkit: OpenTelemetry tracing, Prometheus metrics, continuous batching, tensor parallelism, structured output (Guidance).',
    weaknesses:
      'Officially in maintenance mode as of the access date; HF now recommends vLLM and SGLang for new deployments. Bug fixes and docs continue, but not a destination for new feature work.',
    bestWhen:
      'You already run it and it meets requirements. For greenfield work, treat it as a fallback, not a default.',
    hardware: 'NVIDIA, AMD, and other accelerators via the TGI launcher.',
  },
];

function DecisionTreeDiagram() {
  return (
    <svg
      viewBox="0 0 880 470"
      role="img"
      aria-labelledby="engine-tree-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="engine-tree-title">
        A decision tree for choosing an inference engine. Start at the workload. If it is dominated
        by shared prefixes such as long system prompts, few-shot templates, or multi-turn chat,
        consider SGLang for its RadixAttention prefix reuse. If you are locked to NVIDIA hardware
        with a stable model set and need maximum raw throughput, consider TensorRT-LLM and its
        compiled engines. If you already run Hugging Face TGI and it meets requirements, keep it,
        noting it is in maintenance mode. Otherwise default to vLLM for the broadest hardware and
        model coverage and the fastest feature cadence.
      </title>
      <style>
        {`
          .tnode { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tstart { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .tsg { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .ttrt { fill: #f2f8fd; stroke: #065299; stroke-width: 1.5; }
          .ttgi { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .tvllm { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .tq { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .tw { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .tleaf { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .tsub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .tedge { stroke: #879596; stroke-width: 1.5; fill: none; }
          .telbl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
        `}
      </style>

      {/* Start */}
      <rect className="tstart" x="350" y="14" width="180" height="46" rx="6" />
      <text className="tw" x="440" y="34">Profile your workload</text>
      <text className="tsub" x="440" y="50" style={{ fill: '#dce9f7' }}>
        prefix sharing? hardware? model churn?
      </text>

      {/* Q1 */}
      <line className="tedge" x1="440" y1="60" x2="440" y2="86" />
      <rect className="tnode" x="300" y="86" width="280" height="44" rx="6" />
      <text className="tq" x="440" y="106">Heavy shared prefixes across requests?</text>
      <text className="tsub" x="440" y="122">long system prompts / few-shot / multi-turn</text>

      {/* Q1 -> SGLang (yes) */}
      <path className="tedge" d="M300 108 H150 V170" />
      <text className="telbl" x="180" y="100">yes</text>
      <rect className="tsg" x="40" y="170" width="220" height="58" rx="6" />
      <text className="tleaf" x="150" y="195">Consider SGLang</text>
      <text className="tsub" x="150" y="214">RadixAttention prefix reuse</text>

      {/* Q1 -> Q2 (no) */}
      <line className="tedge" x1="440" y1="130" x2="440" y2="156" />
      <text className="telbl" x="458" y="146">no</text>
      <rect className="tnode" x="300" y="156" width="280" height="44" rx="6" />
      <text className="tq" x="440" y="176">NVIDIA-locked, stable models, max throughput?</text>
      <text className="tsub" x="440" y="192">willing to add a compile step</text>

      {/* Q2 -> TensorRT-LLM (yes) */}
      <path className="tedge" d="M580 178 H730 V236" />
      <text className="telbl" x="700" y="170">yes</text>
      <rect className="ttrt" x="620" y="236" width="220" height="58" rx="6" />
      <text className="tleaf" x="730" y="261">Consider TensorRT-LLM</text>
      <text className="tsub" x="730" y="280">compiled engines, NVIDIA only</text>

      {/* Q2 -> Q3 (no) */}
      <line className="tedge" x1="440" y1="200" x2="440" y2="226" />
      <text className="telbl" x="458" y="216">no</text>
      <rect className="tnode" x="300" y="226" width="280" height="44" rx="6" />
      <text className="tq" x="440" y="246">Already running Hugging Face TGI?</text>
      <text className="tsub" x="440" y="262">and it meets your requirements</text>

      {/* Q3 -> TGI (yes) */}
      <path className="tedge" d="M580 248 H730 V330" />
      <text className="telbl" x="700" y="240">yes</text>
      <rect className="ttgi" x="620" y="330" width="220" height="58" rx="6" />
      <text className="tleaf" x="730" y="355">Keep TGI</text>
      <text className="tsub" x="730" y="374">maintenance mode, not greenfield</text>

      {/* Q3 -> vLLM (no / default) */}
      <line className="tedge" x1="440" y1="270" x2="440" y2="330" />
      <text className="telbl" x="458" y="300">no</text>
      <rect className="tvllm" x="300" y="330" width="280" height="64" rx="6" />
      <text className="tleaf" x="440" y="356">Default to vLLM</text>
      <text className="tsub" x="440" y="375">broadest hardware + models,</text>
      <text className="tsub" x="440" y="389">fastest feature cadence</text>

      {/* Wrap note */}
      <rect className="tnode" x="40" y="416" width="800" height="40" rx="6" style={{ fill: '#f7f7f7' }} />
      <text className="tsub" x="440" y="441">
        Any of these can sit behind NVIDIA Dynamo (Section 18) as workers. The engine and the fleet
        orchestrator are separate decisions.
      </text>
    </svg>
  );
}

export function WhenNotVllm() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="vLLM is the safe default, not the only answer. When does another engine win?"
          >
            26. When Not vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              The question is not &quot;which engine is fastest&quot;; it is &quot;given my
              workload, my hardware, and how often my model set changes, which engine gives the best
              outcome?&quot;
            </strong>{' '}
            vLLM is the right default for most teams: it has the broadest hardware support, the
            widest model coverage, PyTorch-Foundation governance behind a large community, and the
            fastest feature cadence. But three engines genuinely compete with it, and each wins a
            specific slice of the workload space. This section is the honest, vendor-neutral chooser.
          </Box>
          <Alert type="info">
            <strong>Engine choice and orchestration are separate decisions.</strong> Every engine
            below can run as a worker behind a fleet layer. See{' '}
            <strong>Section 18, NVIDIA Dynamo &amp; the Ecosystem</strong>, whose Smart Router and
            disaggregated serving can wrap vLLM, SGLang, or TensorRT-LLM workers. Picking an engine
            does not lock your orchestration, and picking Dynamo does not lock your engine. The
            consolidated end-to-end chooser lives in{' '}
            <strong>Section 28, Decision Guide</strong>.
          </Alert>
          <Alert type="warning">
            <strong>On benchmark numbers:</strong> any head-to-head &quot;engine X is N% faster
            than Y&quot; figure is{' '}
            <Badge color="red">Tier-3 / third-party</Badge> and heavily dependent on hardware,
            model, sequence lengths, batch size, and the exact versions compared. This section makes
            no definitive performance ranking. Treat all comparative throughput/latency claims as
            workload-dependent and re-measure on your own traffic before committing.
          </Alert>
        </SpaceBetween>
      </Container>

      <Table
        header={<Header variant="h2">Engine comparison</Header>}
        columnDefinitions={[
          { id: 'engine', header: 'Engine', cell: (item) => <strong>{item.engine}</strong> },
          { id: 'strengths', header: 'Strengths', cell: (item) => item.strengths },
          { id: 'weaknesses', header: 'Weaknesses', cell: (item) => item.weaknesses },
          { id: 'bestWhen', header: 'Best when', cell: (item) => item.bestWhen },
          { id: 'hardware', header: 'Hardware', cell: (item) => item.hardware },
        ]}
        items={engineRows}
        sortingDisabled
        variant="embedded"
        wrapLines
      />

      <Container header={<Header variant="h2">Decision tree</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Walk it top-down. Most teams fall through to the default; the branches exist for workloads
            with a clear, specific reason to deviate.
          </Box>
          <DecisionTreeDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Pick SGLang if…</Box>
              <Box variant="p">
                Your traffic is dominated by <strong>shared prefixes</strong>: long fixed system
                prompts, few-shot templates reused across requests, agent loops, multi-turn chat, or
                structured/constrained decoding. RadixAttention keeps prior KV in a radix tree and
                reuses it automatically, so the redundant prefill is paid once. The edge is{' '}
                <strong>workload-dependent</strong>: it narrows when prefixes are not actually shared.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick TensorRT-LLM if…</Box>
              <Box variant="p">
                You are <strong>NVIDIA-locked</strong>, your model set is <strong>stable</strong>,
                and you need to extract maximum raw throughput from fixed hardware. Compiled engines
                are tuned per GPU architecture and parallelism config, so you trade portability and a
                build step for top-end performance on NVIDIA. Re-compile when the model, GPU, or
                parallelism changes.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick vLLM if…</Box>
              <Box variant="p">
                You want one engine across <strong>mixed or uncertain hardware</strong>, the{' '}
                <strong>longest model list</strong>, and the <strong>fastest path to new
                features</strong> without a compile step. This is the default; choose another engine
                only when the branches above give a concrete reason to.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">vLLM&apos;s counterbalancing strengths</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Even-handedness cuts both ways. The competitors above win specific slices, but vLLM holds
            structural advantages that matter for most production fleets over time:
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Broadest hardware support</Box>
              <Box variant="p">
                NVIDIA CUDA, AMD ROCm, Intel XPU/CPU, and ARM / IBM Z CPU are supported in-tree, with
                AWS Neuron, Google TPU, and Intel Gaudi available via hardware plugins. If your fleet
                is heterogeneous (or you might switch accelerators), one engine spans it.
              </Box>
            </div>
            <div>
              <Box variant="h3">Widest model coverage</Box>
              <Box variant="p">
                vLLM tends to add support for new model architectures quickly and maintains a very
                large catalog. For teams chasing the newest open-weight releases, this is often the
                deciding factor.
              </Box>
            </div>
            <div>
              <Box variant="h3">Governance &amp; community</Box>
              <Box variant="p">
                vLLM is a PyTorch Foundation project with a large contributor base. That governance
                model reduces single-vendor risk and tends to keep the roadmap broad rather than tied
                to one hardware line.
              </Box>
            </div>
            <div>
              <Box variant="h3">Fastest feature cadence</Box>
              <Box variant="p">
                PagedAttention, automatic prefix caching, speculative decoding, disaggregated
                prefill/decode, and LoRA serving all landed in-tree (Sections 5, 6, 10, 11, 13).
                New techniques tend to show up here first.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Engine notes, status, and sources (deep dive)">
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>SGLang: RadixAttention.</strong> SGLang describes itself as a high-performance
            serving framework &quot;designed for low-latency, high-throughput inference with
            RadixAttention, prefix caching, and multi-GPU parallelism,&quot; with native support
            across NVIDIA, AMD, Intel Xeon, Google TPU, and Ascend NPU. RadixAttention retains the
            KV cache of prior prompts and generations in a radix tree, enabling prefix search,
            reuse, insertion, and eviction across requests. This is the mechanism behind its edge on
            shared system prompts, few-shot templates, and multi-turn / structured workloads.{' '}
            <Link
              external
              href="https://docs.sglang.ai/"
              ariaLabel="SGLang documentation (opens in a new tab)"
            >
              SGLang docs
            </Link>{' '}
            (Tier-1 for SGLang, accessed 2026-06-07).
          </Box>
          <Box variant="p">
            <strong>TensorRT-LLM: compiled engines, NVIDIA only.</strong> NVIDIA&apos;s inference
            optimization framework compiles models into optimized engines and serves them via{' '}
            <code>trtllm-serve</code> or the offline LLM API. It is NVIDIA-exclusive (H100/H200,
            A100, B200/Blackwell, GB200) and oriented toward high-throughput serving. The compile
            step is the trade-off: an engine is specific to its model, GPU, and parallelism config,
            so the build is heavier and must be re-run when those change.{' '}
            <Link
              external
              href="https://nvidia.github.io/TensorRT-LLM/"
              ariaLabel="TensorRT-LLM documentation (opens in a new tab)"
            >
              TensorRT-LLM docs
            </Link>{' '}
            (Tier-1 for TensorRT-LLM, accessed 2026-06-07).
          </Box>
          <Box variant="p">
            <strong>TGI: maintenance mode.</strong> Hugging Face Text Generation Inference is a
            production-ready toolkit (OpenTelemetry tracing, Prometheus metrics, continuous batching,
            tensor parallelism, structured-output Guidance). As of the access date its own docs carry
            an explicit caution: &quot;text-generation-inference is now in maintenance mode. Going
            forward, we will accept pull requests for minor bug fixes, documentation improvements and
            lightweight maintenance tasks,&quot; and the same notice recommends vLLM and SGLang going
            forward. Keep it if you already run it; do not pick it for greenfield work.{' '}
            <Link
              external
              href="https://huggingface.co/docs/text-generation-inference"
              ariaLabel="Hugging Face Text Generation Inference documentation (opens in a new tab)"
            >
              TGI docs
            </Link>{' '}
            (Tier-1 for TGI, accessed 2026-06-07).
          </Box>
          <Box variant="p">
            <strong>vLLM: hardware breadth.</strong> vLLM&apos;s installation docs list NVIDIA
            CUDA, AMD ROCm, Intel XPU, and CPU targets (x86, ARM AArch64, IBM Z) in-tree, with
            additional accelerators (AWS Neuron, Google TPU, Intel Gaudi) supported through hardware
            plugins. See also <strong>Section 21 (Neuron)</strong> and{' '}
            <strong>Section 22 (GPUs, EFA &amp; NIXL)</strong> in this deep dive.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/getting_started/installation.html"
              ariaLabel="vLLM installation documentation (opens in a new tab)"
            >
              vLLM installation docs
            </Link>{' '}
            (Tier-1 for vLLM, accessed 2026-06-07).
          </Box>
          <Alert type="info">
            <strong>What this section deliberately does not do:</strong> it does not crown a
            throughput winner. Published head-to-head numbers between these engines exist, but they
            are third-party and version-, hardware-, and workload-specific. The honest position is:
            shortlist by the decision tree, then benchmark the finalists on your own traffic and
            hardware before committing.
          </Alert>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
