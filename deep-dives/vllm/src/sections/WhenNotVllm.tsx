import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// External engines pinned to the releases resolved on 2026-10-16
// (research/2026-10-refresh/05-ecosystem.md, external pins table).
const SG = 'https://github.com/sgl-project/sglang/blob/v0.5.21';
const TRT = 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1';
const TGI_SHA = 'b4adbf2f6e2e721280bd0ea5f91d70f7d033f5ed';
const TGI = `https://github.com/huggingface/text-generation-inference/blob/${TGI_SHA}`;
const DYNAMO = 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1';
const LLMD_ENGINES =
  'https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/datalayer/extractor/metrics/factories.go#L88-L94';

interface EngineRow {
  engine: string;
  builtAround: string;
  tradeOff: string;
  bestWhen: string;
  hardware: string;
}

const engineRows: EngineRow[] = [
  {
    engine: 'vLLM',
    builtAround:
      'One engine across mixed hardware, under PyTorch Foundation governance. Paged KV (key-value) cache, prefix caching, speculative decoding, disaggregated prefill/decode, LoRA (Low-Rank Adaptation) serving, diffusion LLMs, watermarking and fast-restart tooling are all in-tree.',
    tradeOff:
      'The vLLM an orchestrator installs trails the current release (Dynamo 1.5.1 pins 0.28.0). Validate flags against the version you actually run, and pin it.',
    bestWhen:
      'You want one engine across mixed or changing hardware, wrapped by whichever fleet layer you choose. The default for most teams.',
    hardware:
      'NVIDIA CUDA, AMD ROCm, Intel XPU; Apple Silicon via the vLLM-Metal plugin; x86, ARM, Apple silicon and IBM Z CPUs; AWS Neuron, Google TPU and Intel Gaudi via plugins.',
  },
  {
    engine: 'SGLang',
    builtAround:
      'RadixAttention, a radix tree of prior KV that reuses shared prefixes across requests automatically, plus a zero-overhead CPU scheduler. Also ships prefill/decode (P/D) disaggregation, speculative decoding, structured outputs and multi-LoRA batching.',
    tradeOff:
      'Its distinguishing mechanism pays off only when prefixes are actually shared. vLLM caches prefixes too, so the gap depends on your traffic.',
    bestWhen:
      'Traffic dominated by shared prefixes: long system prompts, few-shot templates, agent loops and multi-turn chat, structured or constrained decoding.',
    hardware: 'NVIDIA, AMD, Intel Xeon, Google TPU, Ascend NPU (neural processing unit), Moore Threads MUSA accelerators.',
  },
  {
    engine: 'TensorRT-LLM',
    builtAround:
      "NVIDIA's own engine: a PyTorch-native runtime with NVIDIA's custom attention kernels, in-flight batching, paged KV caching, FP8 / FP4 / INT4 quantization and speculative decoding.",
    tradeOff:
      'NVIDIA GPUs only. trtllm-serve defaults to the PyTorch backend, so serving needs no engine build; the TensorRT engine-build path is opt-in (--backend tensorrt).',
    bestWhen:
      "Your fleet is NVIDIA-only, you want NVIDIA's engine and kernels, and a benchmark on your model and traffic favors it.",
    hardware: 'NVIDIA GPUs only.',
  },
  {
    engine: 'TGI (Hugging Face)',
    builtAround:
      'OpenTelemetry tracing, Prometheus metrics, continuous batching, tensor parallelism and Guidance/JSON structured output.',
    tradeOff:
      'The repository is archived and read-only; the last release is v3.3.7. Its final README recommends vLLM and SGLang. Neither Dynamo nor llm-d lists it as a backend.',
    bestWhen: 'You already run it. Keep it only while you migrate; do not start new work on it.',
    hardware:
      'NVIDIA, AMD and Intel GPU; Inferentia, Gaudi and Google TPU through separate Hugging Face projects.',
  },
];

function DecisionTreeDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 552"
        role="img"
        aria-labelledby="wnv-tree-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="wnv-tree-title">
          A decision tree for choosing an inference engine, read top-down. One user on a laptop, a
          Mac or a CPU-only box points to a local engine such as llama.cpp, Ollama or MLX. Heavy
          shared prefixes across requests point to SGLang and its RadixAttention prefix reuse. An
          NVIDIA-only fleet that wants NVIDIA&apos;s own engine, with a benchmark that agrees,
          points to TensorRT-LLM, which runs a PyTorch backend on NVIDIA GPUs only. An existing
          Hugging Face TGI deployment stays only while you migrate, because the TGI repository is
          archived. Everything else defaults to vLLM. Dynamo and llm-d run vLLM, SGLang or
          TensorRT-LLM as workers, and neither lists TGI.
        </title>
        <style>
          {`
            .wnv-bg { fill: #ffffff; }
            .wnv-node { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
            .wnv-start { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
            .wnv-local { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
            .wnv-sg { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
            .wnv-trt { fill: #f2f8fd; stroke: #065299; stroke-width: 1.5; }
            .wnv-tgi { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
            .wnv-vllm { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
            .wnv-note { fill: #f7f7f7; stroke: #879596; stroke-width: 1.5; }
            .wnv-q { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .wnv-w { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
            .wnv-wsub { fill: #dce9f7; font: 11px sans-serif; text-anchor: middle; }
            .wnv-leaf { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .wnv-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .wnv-edge { stroke: #879596; stroke-width: 1.5; fill: none; }
            .wnv-lbl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          `}
        </style>
        <rect className="wnv-bg" x="0" y="0" width="880" height="552" rx="8" />

        {/* Start */}
        <rect className="wnv-start" x="330" y="14" width="220" height="46" rx="6" />
        <text className="wnv-w" x="440" y="34">
          Profile your workload
        </text>
        <text className="wnv-wsub" x="440" y="50">
          who calls? prefixes? hardware?
        </text>

        {/* Q0: local use */}
        <line className="wnv-edge" x1="440" y1="60" x2="440" y2="86" />
        <rect className="wnv-node" x="290" y="86" width="300" height="44" rx="6" />
        <text className="wnv-q" x="440" y="106">
          One user on a laptop, Mac or CPU box?
        </text>
        <text className="wnv-sub" x="440" y="122">
          local use, no shared endpoint
        </text>

        {/* Q0 -> local engine (yes) */}
        <path className="wnv-edge" d="M290 108 H150 V150" />
        <text className="wnv-lbl" x="220" y="100">
          yes
        </text>
        <rect className="wnv-local" x="40" y="150" width="220" height="58" rx="6" />
        <text className="wnv-leaf" x="150" y="175">
          Use a local engine
        </text>
        <text className="wnv-sub" x="150" y="194">
          llama.cpp, Ollama or MLX
        </text>

        {/* Q0 -> Q1 (no) */}
        <line className="wnv-edge" x1="440" y1="130" x2="440" y2="156" />
        <text className="wnv-lbl" x="458" y="147">
          no
        </text>
        <rect className="wnv-node" x="290" y="156" width="300" height="44" rx="6" />
        <text className="wnv-q" x="440" y="176">
          Heavy shared prefixes across requests?
        </text>
        <text className="wnv-sub" x="440" y="192">
          long system prompts / few-shot / multi-turn
        </text>

        {/* Q1 -> SGLang (yes) */}
        <path className="wnv-edge" d="M590 178 H730 V220" />
        <text className="wnv-lbl" x="660" y="170">
          yes
        </text>
        <rect className="wnv-sg" x="620" y="220" width="220" height="58" rx="6" />
        <text className="wnv-leaf" x="730" y="245">
          Consider SGLang
        </text>
        <text className="wnv-sub" x="730" y="264">
          RadixAttention prefix reuse
        </text>

        {/* Q1 -> Q2 (no) */}
        <line className="wnv-edge" x1="440" y1="200" x2="440" y2="226" />
        <text className="wnv-lbl" x="458" y="217">
          no
        </text>
        <rect className="wnv-node" x="290" y="226" width="300" height="44" rx="6" />
        <text className="wnv-q" x="440" y="246">
          NVIDIA-only fleet and NVIDIA&apos;s stack?
        </text>
        <text className="wnv-sub" x="440" y="262">
          NVIDIA kernels, and your benchmark agrees
        </text>

        {/* Q2 -> TensorRT-LLM (yes) */}
        <path className="wnv-edge" d="M290 248 H150 V290" />
        <text className="wnv-lbl" x="220" y="240">
          yes
        </text>
        <rect className="wnv-trt" x="40" y="290" width="220" height="58" rx="6" />
        <text className="wnv-leaf" x="150" y="315">
          Consider TensorRT-LLM
        </text>
        <text className="wnv-sub" x="150" y="334">
          NVIDIA only, PyTorch backend
        </text>

        {/* Q2 -> Q3 (no) */}
        <line className="wnv-edge" x1="440" y1="270" x2="440" y2="296" />
        <text className="wnv-lbl" x="458" y="287">
          no
        </text>
        <rect className="wnv-node" x="290" y="296" width="300" height="44" rx="6" />
        <text className="wnv-q" x="440" y="316">
          Already running Hugging Face TGI?
        </text>
        <text className="wnv-sub" x="440" y="332">
          repository archived, read-only
        </text>

        {/* Q3 -> TGI (yes) */}
        <path className="wnv-edge" d="M590 318 H730 V360" />
        <text className="wnv-lbl" x="660" y="310">
          yes
        </text>
        <rect className="wnv-tgi" x="620" y="360" width="220" height="58" rx="6" />
        <text className="wnv-leaf" x="730" y="385">
          Keep TGI while you migrate
        </text>
        <text className="wnv-sub" x="730" y="404">
          last release v3.3.7
        </text>

        {/* Q3 -> vLLM (no / default) */}
        <line className="wnv-edge" x1="440" y1="340" x2="440" y2="400" />
        <text className="wnv-lbl" x="458" y="374">
          no
        </text>
        <rect className="wnv-vllm" x="290" y="400" width="300" height="70" rx="6" />
        <text className="wnv-leaf" x="440" y="426">
          Default to vLLM
        </text>
        <text className="wnv-sub" x="440" y="446">
          one engine across mixed hardware,
        </text>
        <text className="wnv-sub" x="440" y="461">
          wrapped by Ray, llm-d and Dynamo
        </text>

        {/* Fleet-layer note */}
        <rect className="wnv-note" x="40" y="492" width="800" height="46" rx="6" />
        <text className="wnv-sub" x="440" y="511">
          Dynamo and llm-d run vLLM, SGLang or TensorRT-LLM as workers; neither lists TGI.
        </text>
        <text className="wnv-sub" x="440" y="528">
          The engine and the fleet layer are separate decisions (Sections 17 and 18).
        </text>
      </svg>
    </div>
  );
}

export function WhenNotVllm() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Four situations where another engine is the better pick, the reason each one wins, and the default for everything else (verified against vLLM v0.31.0, commit db9527a4, with SGLang v0.5.21, TensorRT-LLM v1.2.1 and TGI v3.3.7, 2026-10-16)"
          >
            26. When Not vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              Choosing an engine means matching three things: who sends the requests, how much of
              each prompt repeats, and what hardware the fleet runs on.
            </strong>{' '}
            vLLM is the default for most teams, because one engine covers mixed hardware and every
            fleet layer in this dive wraps it. Four situations give a concrete reason to look
            elsewhere: one user on local hardware, traffic dominated by shared prefixes, an
            NVIDIA-only fleet that wants NVIDIA&apos;s own engine, and an existing Hugging Face TGI
            (Text Generation Inference) deployment.
            The section ranks no engine on speed; the last block says how to settle that on your
            own traffic.
          </Box>
          <Alert type="info">
            <strong>Engine choice and fleet layer are separate decisions.</strong> Dynamo lists
            vLLM, SGLang and TensorRT-LLM as backends{' '}
            <Cite tier={1} href={`${DYNAMO}/README.md#L64-L69`}>
              Dynamo README L64-L69
            </Cite>
            , and llm-d Router ships built-in engine configs for vLLM, SGLang and trtllm-serve,
            among others{' '}
            <Cite tier={1} href={LLMD_ENGINES} kind="code">
              llm-d-router factories.go L88-L94
            </Cite>
            ; TGI is in neither list. The fleet layer also fixes which vLLM you run: Dynamo 1.5.1
            pins vLLM 0.28.0{' '}
            <Cite tier={1} href={`${DYNAMO}/pyproject.toml#L61-L64`}>
              dynamo pyproject.toml L61-L64
            </Cite>
            , and <strong>Section 15</strong> lists the Ray and llm-d pins. Dynamo itself is{' '}
            <strong>Section 18</strong>; the end-to-end chooser is{' '}
            <strong>Section 28, Decision Guide</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Table
        header={
          <Header
            variant="h2"
            description="What each engine is built around, what you give up by choosing it, and the hardware it runs on"
          >
            Engine comparison
          </Header>
        }
        columnDefinitions={[
          { id: 'engine', header: 'Engine', cell: (item) => <strong>{item.engine}</strong> },
          { id: 'builtAround', header: 'Built around', cell: (item) => item.builtAround },
          { id: 'tradeOff', header: 'Trade-off', cell: (item) => item.tradeOff },
          { id: 'bestWhen', header: 'Best when', cell: (item) => item.bestWhen },
          { id: 'hardware', header: 'Hardware', cell: (item) => item.hardware },
        ]}
        items={engineRows}
        sortingDisabled
        variant="embedded"
        wrapLines
      />

      <Container
        header={
          <Header
            variant="h2"
            description="Four questions in order: most teams reach the vLLM default, and each branch names the concrete reason to leave it"
          >
            Decision tree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DecisionTreeDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: the question order is this section&apos;s recommendation.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Pick a local engine if…</Box>
              <Box variant="p">
                One person runs the model on a laptop, a Mac or a CPU-only box, with no shared
                endpoint to serve. TGI&apos;s final README sends that user to &quot;local engines
                with inter-compatibility such as llama.cpp or MLX&quot;{' '}
                <Cite tier={1} href={`${TGI}/README.md#L1-L4`}>
                  TGI README L1-L4
                </Cite>
                , and llama.cpp and Ollama both shipped releases in October 2026{' '}
                <Cite tier={1} href="https://github.com/ggml-org/llama.cpp/releases/tag/v0.7.0">
                  llama.cpp v0.7.0
                </Cite>{' '}
                <Cite tier={1} href="https://github.com/ollama/ollama/releases/tag/v0.40.6">
                  Ollama v0.40.6
                </Cite>
                . vLLM runs there too, on CPUs in-tree and on Apple Silicon GPUs through vLLM-Metal,
                which keeps the laptop on the same engine as the server.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick SGLang if…</Box>
              <Box variant="p">
                Your traffic is dominated by <strong>shared prefixes</strong>: long fixed system
                prompts, few-shot templates reused across requests, agent loops, multi-turn chat,
                or structured decoding. RadixAttention keeps prior KV in a radix tree and reuses
                it automatically{' '}
                <Cite tier={1} href={`${SG}/python/sglang/srt/mem_cache/radix_cache.py#L249-L280`} kind="code">
                  SGLang radix_cache.py L249-L280
                </Cite>
                , so the shared prefill is paid once. SGLang also ships P/D
                disaggregation, speculative decoding and multi-LoRA batching, so the reason to pick
                it is the prefix cache and scheduler rather than feature count. vLLM caches
                prefixes too (<strong>Section 6</strong>): the edge is{' '}
                <strong>workload-dependent</strong>, so benchmark both on your traffic.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick TensorRT-LLM if…</Box>
              <Box variant="p">
                Your fleet is <strong>NVIDIA-only</strong> and you want NVIDIA&apos;s own engine and
                kernels. <code>trtllm-serve</code> defaults to the <strong>PyTorch backend</strong>,
                so a checkpoint serves with no engine build; the TensorRT engine-build path is
                opt-in with <code>--backend tensorrt</code>. The trade is portability: it runs on
                NVIDIA GPUs only. Shortlist it, then let a benchmark on your model decide.
              </Box>
            </div>
            <div>
              <Box variant="h3">Running TGI today?</Box>
              <Box variant="p">
                The repository is <strong>archived</strong> and read-only, and the last release is
                v3.3.7. Keep a working deployment while you migrate, and plan the move: its own
                README points to vLLM and SGLang, and neither Dynamo nor llm-d lists TGI as a
                backend. Clients on TGI&apos;s Messages API already speak the OpenAI Chat Completion
                format{' '}
                <Cite tier={1} href={`${TGI}/README.md#L51`}>
                  TGI README L51
                </Cite>
                , which vLLM (<strong>Section 12</strong>) and SGLang also serve, so the client side
                of the move is mostly an endpoint change.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why the default holds for most fleets, and three in-tree capabilities that remove a reason to switch"
          >
            vLLM&apos;s counterbalancing strengths
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Hardware breadth</Box>
            <Box variant="p">
              NVIDIA CUDA, AMD ROCm and Intel XPU GPUs, Apple Silicon GPUs through vLLM-Metal, and
              x86, ARM, Apple silicon and IBM Z CPUs, with AWS Neuron, Google TPU and Intel Gaudi
              through hardware plugins (<strong>Sections 21 and 22</strong> cover AWS). If the
              fleet is mixed, or may change accelerators, one engine spans it.
            </Box>
          </div>
          <div>
            <Box variant="h3">Governance and in-tree features</Box>
            <Box variant="p">
              vLLM is a PyTorch Foundation-hosted project, governed under the foundation&apos;s
              &quot;neutral and transparent governance model&quot;{' '}
              <Cite tier={1} href="https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/">
                PyTorch Foundation: welcomes vLLM (May 7, 2025)
              </Cite>
              . Paged KV cache, automatic prefix caching, disaggregated prefill/decode, speculative
              decoding and LoRA serving are in-tree (<strong>Sections 5, 6, 10, 11, 13</strong>).
            </Box>
          </div>
          <div>
            <Box variant="h3">Diffusion LLMs</Box>
            <Box variant="p">
              Diffusion language models (dLLMs), which denoise a fixed-length canvas instead of
              decoding left to right, have their own scheduler and <code>--diffusion-config</code>{' '}
              <Cite tier={1} href={vllmUrl('vllm/config/diffusion.py', 'L11-L24')} kind="code">
                diffusion.py L11-L24
              </Cite>
              . SGLang serves them too, so a dLLM is no reason to switch.
            </Box>
          </div>
          <div>
            <Box variant="h3">Output watermarking</Box>
            <Box variant="p">
              <code>--watermark-config</code> embeds a keyed statistical signal in token choices
              that a detector can test for without the model weights{' '}
              <Cite tier={1} href={vllmDocsUrl('features/watermarking/')}>
                vLLM docs: Text watermarking
              </Cite>
              . A team that needs output provenance gets it in the engine.
            </Box>
          </div>
          <div>
            <Box variant="h3">Restart time</Box>
            <Box variant="p">
              <code>vllm preload</code> keeps post-quantized weights resident in a per-GPU daemon,
              and <code>--load-format ipc_cache</code> maps them over CUDA IPC (inter-process
              communication) on restart instead of reloading from disk{' '}
              <Cite tier={1} href={vllmUrl('vllm/config/load.py', 'L41-L43')} kind="code">
                load.py L41-L43
              </Cite>
              . The experimental <code>vllm snapshot</code> restores a CRIU (Checkpoint/Restore In
              Userspace) checkpoint of an initialized single-GPU engine on the same host{' '}
              <Cite tier={1} href={vllmDocsUrl('features/initialized_snapshots/')}>
                vLLM docs: Initialized engine snapshots
              </Cite>
              . <strong>Section 27</strong> covers restart planning in operations.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <ExpandableSection headerText="Engine evidence: what each project's own source says">
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>SGLang: RadixAttention.</strong> SGLang is a serving framework &quot;designed
            for low-latency, high-throughput inference with RadixAttention, prefix caching, and
            multi-GPU parallelism,&quot; with hardware support &quot;including NVIDIA, AMD, Intel
            Xeon, Google TPU, Ascend NPU, and Moore Threads MUSA accelerators&quot;{' '}
            <Cite tier={1} href="https://docs.sglang.io/">
              SGLang docs
            </Cite>
            . Its README lists RadixAttention for prefix caching, a zero-overhead CPU scheduler,
            prefill-decode disaggregation, speculative decoding, structured outputs and multi-LoRA
            batching{' '}
            <Cite tier={1} href={`${SG}/README.md#L69-L71`}>
              SGLang README L69-L71
            </Cite>
            , and announces diffusion LLM support (LLaDA 2.0){' '}
            <Cite tier={1} href={`${SG}/README.md#L38`}>
              SGLang README L38
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>TensorRT-LLM: PyTorch backend by default, NVIDIA only.</strong> The{' '}
            <code>trtllm-serve --backend</code> choices are <code>pytorch</code>,{' '}
            <code>tensorrt</code> and <code>_autodeploy</code>, with <code>pytorch</code> the
            default{' '}
            <Cite tier={1} href={`${TRT}/tensorrt_llm/commands/serve.py#L296-L301`} kind="code">
              serve.py L296-L301
            </Cite>
            , and the offline <code>LLM</code> class is the PyTorch implementation{' '}
            <Cite tier={1} href={`${TRT}/tensorrt_llm/llmapi/llm.py#L1188`} kind="code">
              llm.py L1188
            </Cite>
            . The README describes the library as &quot;Architected on PyTorch&quot;, with custom
            attention kernels, in-flight batching, paged KV caching, FP8, FP4 and INT4 quantization
            and speculative decoding &quot;to perform inference efficiently on NVIDIA GPUs&quot;{' '}
            <Cite tier={1} href={`${TRT}/README.md#L231-L235`}>
              TensorRT-LLM README L231-L235
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>TGI: archived.</strong> The GitHub repository is archived; its last commit is
            from 2026-03-21{' '}
            <Cite tier={1} href="https://github.com/huggingface/text-generation-inference">
              GitHub: huggingface/text-generation-inference
            </Cite>{' '}
            and its last release is v3.3.7, published 2025-12-19{' '}
            <Cite
              tier={1}
              href="https://github.com/huggingface/text-generation-inference/releases/tag/v3.3.7"
            >
              TGI v3.3.7
            </Cite>
            . The frozen README opens with &quot;text-generation-inference is now in
            maintenance mode&quot; and recommends &quot;vllm, SGLang, as well as local engines with
            inter-compatibility such as llama.cpp or MLX&quot;{' '}
            <Cite tier={1} href={`${TGI}/README.md#L1-L4`}>
              TGI README L1-L4
            </Cite>
            . The feature list (OpenTelemetry tracing, Prometheus metrics, tensor parallelism,
            continuous batching, Guidance/JSON) and the hardware list (NVIDIA, AMD, Inferentia,
            Intel GPU, Gaudi, Google TPU) are in the same file{' '}
            <Cite tier={1} href={`${TGI}/README.md#L47-L77`}>
              TGI README L47-L77
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>vLLM: hardware breadth.</strong> The installation
            guide lists NVIDIA CUDA, AMD ROCm, Intel XPU and Apple Silicon (via vLLM-Metal) GPUs and
            x86, ARM AArch64, Apple silicon and IBM Z CPUs, and defers the plugin list to the
            vLLM website{' '}
            <Cite tier={1} href={vllmDocsUrl('getting_started/installation/')}>
              vLLM docs: Installation
            </Cite>
            . The plugins live in their own repositories:{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm-neuron">
              vllm-neuron
            </Cite>
            ,{' '}
            <Cite tier={1} href="https://github.com/vllm-project/tpu-inference">
              tpu-inference
            </Cite>{' '}
            (the in-tree TPU platform imports it{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/tpu.py', 'L10-L18')} kind="code">
              tpu.py L10-L18
            </Cite>
            ),{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm-gaudi">
              vllm-gaudi
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm-metal">
              vllm-metal
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Container
        header={
          <Header
            variant="h2"
            description="The step that settles the choice: run the finalists on your own traffic and hardware"
          >
            Shortlist, then measure
          </Header>
        }
      >
        <Box variant="p">
          Head-to-head &quot;engine X is N% faster than Y&quot; figures are{' '}
          <Badge color="red">vendor or third-party</Badge> claims and depend on hardware, model, sequence
          lengths, batch size and the exact versions compared, which is why this section ranks no
          engine on speed. Shortlist with the tree, drive every finalist with the same load
          generator at your real prompt and output lengths (<strong>Section 20</strong> covers the
          tools), and pin the engine versions you measured, since the fleet layer may install an
          older one.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
