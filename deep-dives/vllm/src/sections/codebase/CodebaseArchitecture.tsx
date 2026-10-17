import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl } from '../../components/Cite';

const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

interface ClientRow {
  client: string;
  mode: string;
  used: string;
  file: string;
}

const clientRows: ClientRow[] = [
  {
    client: 'InprocClient',
    mode: 'In-process, no ZMQ',
    used: 'Embedded / debugging: EngineCore runs in the caller thread (VLLM_ENABLE_V1_MULTIPROCESSING=0)',
    file: 'core_client.py',
  },
  {
    client: 'SyncMPClient',
    mode: 'ZMQ + background EngineCore proc',
    used: 'Synchronous LLM() offline batch API',
    file: 'core_client.py',
  },
  {
    client: 'AsyncMPClient',
    mode: 'ZMQ + background proc, asyncio',
    used: 'AsyncLLM, the OpenAI-compatible server',
    file: 'core_client.py',
  },
  {
    client: 'DPAsyncMPClient',
    mode: 'AsyncMP + DP coordination, one client per DP rank',
    used: 'DP behind an external load balancer (--data-parallel-external-lb)',
    file: 'core_client.py',
  },
  {
    client: 'DPLBAsyncMPClient',
    mode: 'DPAsync + internal load balancer',
    used: 'Data-parallel with vLLM-side request routing (every other DP > 1 setup)',
    file: 'core_client.py',
  },
];

interface ExecutorRow {
  executor: string;
  transport: string;
  notes: string;
}

const executorRows: ExecutorRow[] = [
  {
    executor: 'UniProcExecutor',
    transport: 'Direct calls (no IPC)',
    notes: 'Single worker in the EngineCore process (world size 1, no distribution)',
  },
  {
    executor: 'MultiprocExecutor',
    transport: 'Shared-memory MessageQueue broadcast',
    notes: 'Default on CUDA for multi-GPU runs, including multi-node with --nnodes; one WorkerProc per local rank',
  },
  {
    executor: 'RayExecutorV2',
    transport: 'MessageQueue (subclasses MultiprocExecutor)',
    notes: 'Default Ray backend: VLLM_USE_RAY_V2_EXECUTOR_BACKEND defaults to 1',
  },
  {
    executor: 'RayDistributedExecutor',
    transport: 'Ray compiled-DAG (ray.dag.CompiledDAG)',
    notes: 'Legacy Ray path, kept for compatibility',
  },
];

// ---------------------------------------------------------------------------
// Diagram 1, the repository map: three source trees, and which of them runs
// in vLLM's Python processes versus as its own process.
// ---------------------------------------------------------------------------

function RepoMapDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 820 326"
        role="img"
        aria-labelledby="repomap-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="repomap-title">
          The vLLM repository is three source trees. The vllm Python package
          (about 1.01 million lines in 2,569 files) holds the V1 engine under
          vllm/v1 and the EngineArgs surface under vllm/engine; csrc holds 310
          CUDA and C++ files compiled into the extension; rust holds 340 files
          that build vllm-rs, a separate frontend process that talks to the
          EngineCore over ZMQ.
        </title>
        <defs>
          <style>{`
            .rm-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .rm-box-alt { fill: #fbf8f2; stroke: #b25a00; stroke-width: 1.5; }
            .rm-box-rust { fill: #f7f2fb; stroke: #6f42c1; stroke-width: 1.5; }
            .rm-run { fill: #f2f3f3; stroke: #414d5c; stroke-width: 1.2; }
            .rm-run-rust { fill: #f7f2fb; stroke: #6f42c1; stroke-width: 1.2; stroke-dasharray: 5 4; }
            .rm-title { font: 600 14px sans-serif; fill: #16191f; }
            .rm-sub { font: 11px sans-serif; fill: #5f6b7a; }
            .rm-tag { font: 600 11px sans-serif; fill: #16191f; }
            .rm-run-t { font: 600 12px sans-serif; fill: #16191f; text-anchor: middle; }
            .rm-run-s { font: 11px sans-serif; fill: #414d5c; text-anchor: middle; }
            .rm-link { stroke: #879596; stroke-width: 1.2; stroke-dasharray: 3 3; fill: none; }
          `}</style>
        </defs>
        <rect x="0" y="0" width="820" height="326" rx="8" fill="#ffffff" />

        {/* vllm/ */}
        <rect x="12" y="12" width="260" height="222" rx="6" className="rm-box" />
        <text x="26" y="36" className="rm-title">vllm/ : Python package</text>
        <text x="26" y="56" className="rm-sub">~1.01M lines, 2,569 .py files</text>
        <text x="26" y="82" className="rm-tag">vllm/v1/ : the V1 engine</text>
        <text x="26" y="100" className="rm-sub">engine/ executor/ core/ worker/</text>
        <text x="26" y="116" className="rm-sub">attention/ sample/ spec_decode/</text>
        <text x="26" y="142" className="rm-tag">vllm/engine/ : EngineArgs + shims</text>
        <text x="26" y="160" className="rm-sub">arg_utils.py + two 7-line aliases</text>
        <text x="26" y="186" className="rm-tag">model_executor/ models/ renderers/</text>
        <text x="26" y="204" className="rm-sub">entrypoints/ config/ distributed/</text>
        <text x="26" y="220" className="rm-sub">compilation/ lora/ platforms/ &hellip;</text>

        {/* csrc/ */}
        <rect x="286" y="12" width="250" height="222" rx="6" className="rm-box-alt" />
        <text x="300" y="36" className="rm-title">csrc/ : CUDA / C++</text>
        <text x="300" y="56" className="rm-sub">310 .cu/.cuh/.cpp/.h/.hpp files</text>
        <text x="300" y="82" className="rm-tag">attention kernels</text>
        <text x="300" y="100" className="rm-sub">MLA, merge_attn_states</text>
        <text x="300" y="126" className="rm-tag">quantization</text>
        <text x="300" y="144" className="rm-sub">fp8, int8, awq, gptq, marlin</text>
        <text x="300" y="170" className="rm-tag">moe / activation / cache ops</text>
        <text x="300" y="188" className="rm-sub">custom_all_reduce, layernorm</text>
        <text x="300" y="214" className="rm-sub">compiled into the extension</text>

        {/* rust/ */}
        <rect x="550" y="12" width="258" height="222" rx="6" className="rm-box-rust" />
        <text x="564" y="36" className="rm-title">rust/ : Rust frontend</text>
        <text x="564" y="56" className="rm-sub">340 .rs files, ~126K lines</text>
        <text x="564" y="82" className="rm-tag">builds the vllm-rs binary</text>
        <text x="564" y="100" className="rm-sub">replaces the Python API server</text>
        <text x="564" y="116" className="rm-sub">process when switched on</text>
        <text x="564" y="142" className="rm-tag">speaks ZMQ to EngineCore</text>
        <text x="564" y="160" className="rm-sub">same sockets as the Python server</text>
        <text x="564" y="186" className="rm-tag">HTTP, chat render, tokenize</text>
        <text x="564" y="204" className="rm-sub">request parsing in Rust</text>
        <text x="564" y="220" className="rm-sub">+ one PyO3 tool parser in-process</text>

        {/* Where each tree runs */}
        <path d="M142 236 V256" className="rm-link" />
        <path d="M411 236 V256" className="rm-link" />
        <path d="M679 236 V256" className="rm-link" />
        <rect x="12" y="258" width="524" height="56" rx="6" className="rm-run" />
        <text x="274" y="281" className="rm-run-t">Runs as vLLM&apos;s Python processes</text>
        <text x="274" y="300" className="rm-run-s">frontend, EngineCore and workers (next section)</text>
        <rect x="550" y="258" width="258" height="56" rx="6" className="rm-run-rust" />
        <text x="679" y="281" className="rm-run-t">Runs as its own process</text>
        <text x="679" y="300" className="rm-run-s">VLLM_USE_RUST_FRONTEND=1</text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diagram 2, the process model: frontend, EngineCore, workers, and what
// crosses each boundary.
// ---------------------------------------------------------------------------

function ThreeProcessDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 28 820 328"
        role="img"
        aria-labelledby="threeproc-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="threeproc-title">
          The vLLM V1 engine runs as three kinds of process. A frontend renders and
          tokenizes requests and exchanges msgpack-encoded messages over ZMQ with a
          separate EngineCore process, which schedules each step and broadcasts it,
          pickled into a shared-memory message queue, to one worker process per
          parallel rank, each running Model Runner V2.
        </title>
        <defs>
          <style>{`
            .tp-proc { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .tp-core { fill: #effaf3; stroke: #037f51; stroke-width: 1.5; }
            .tp-worker { fill: #fbf8f2; stroke: #b25a00; stroke-width: 1.5; }
            .tp-h { font: 600 13px sans-serif; fill: #16191f; }
            .tp-s { font: 11px sans-serif; fill: #16191f; }
            .tp-sub { font: 10px sans-serif; fill: #5f6b7a; }
            .tp-edge { font: 600 11px sans-serif; fill: #0972d3; text-anchor: middle; }
            .tp-edge2 { font: 600 11px sans-serif; fill: #b25a00; text-anchor: middle; }
            .tp-rust { font: 10px sans-serif; fill: #6f42c1; }
            .tp-line { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          `}</style>
          <marker
            id="tp-arrow"
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="3"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="28" width="820" height="328" rx="8" fill="#ffffff" />

        {/* Frontend process */}
        <rect x="12" y="40" width="212" height="304" rx="6" className="tp-proc" />
        <text x="26" y="62" className="tp-h">Frontend process</text>
        <text x="26" y="80" className="tp-sub">AsyncLLM / LLMEngine</text>
        <rect x="26" y="92" width="184" height="40" rx="4" className="tp-proc" />
        <text x="36" y="110" className="tp-s">Renderer</text>
        <text x="36" y="125" className="tp-sub">chat template, tokenize</text>
        <rect x="26" y="140" width="184" height="40" rx="4" className="tp-proc" />
        <text x="36" y="158" className="tp-s">InputProcessor</text>
        <text x="36" y="173" className="tp-sub">prompt &rarr; EngineCoreRequest</text>
        <rect x="26" y="188" width="184" height="56" rx="4" className="tp-proc" />
        <text x="36" y="206" className="tp-s">EngineCoreClient</text>
        <text x="36" y="221" className="tp-sub">owns ZMQ ROUTER (in)</text>
        <text x="36" y="235" className="tp-sub">+ PULL (out) sockets</text>
        <rect x="26" y="252" width="184" height="40" rx="4" className="tp-proc" />
        <text x="36" y="270" className="tp-s">OutputProcessor</text>
        <text x="36" y="285" className="tp-sub">detokenize, stream out</text>
        <text x="26" y="314" className="tp-rust">vllm-rs can run in its place</text>
        <text x="26" y="328" className="tp-rust">(VLLM_USE_RUST_FRONTEND=1)</text>

        {/* EngineCore process */}
        <rect x="312" y="40" width="224" height="304" rx="6" className="tp-core" />
        <text x="326" y="62" className="tp-h">EngineCore process</text>
        <text x="326" y="80" className="tp-sub">EngineCoreProc</text>
        <rect x="326" y="92" width="196" height="34" rx="4" className="tp-core" />
        <text x="336" y="113" className="tp-s">input IO thread (daemon)</text>
        <rect x="326" y="134" width="196" height="56" rx="4" className="tp-core" />
        <text x="336" y="152" className="tp-s">run_busy_loop()</text>
        <text x="336" y="167" className="tp-sub">pure-Python; pops input_queue,</text>
        <text x="336" y="181" className="tp-sub">steps scheduler, pushes outputs</text>
        <rect x="326" y="198" width="196" height="34" rx="4" className="tp-core" />
        <text x="336" y="219" className="tp-s">output IO thread (daemon)</text>
        <rect x="326" y="240" width="196" height="52" rx="4" className="tp-core" />
        <text x="336" y="260" className="tp-s">Scheduler + KVCacheManager</text>
        <text x="336" y="278" className="tp-sub">gc.freeze() after model load</text>

        {/* Workers */}
        <rect x="620" y="40" width="188" height="304" rx="6" className="tp-worker" />
        <text x="634" y="62" className="tp-h">Worker processes</text>
        <text x="634" y="80" className="tp-sub">one per parallel rank</text>
        <rect x="634" y="92" width="160" height="42" rx="4" className="tp-worker" />
        <text x="644" y="112" className="tp-s">WorkerProc rank 0</text>
        <text x="644" y="126" className="tp-sub">GPUModelRunner (MRv2)</text>
        <rect x="634" y="142" width="160" height="42" rx="4" className="tp-worker" />
        <text x="644" y="162" className="tp-s">WorkerProc rank 1</text>
        <text x="644" y="176" className="tp-sub">GPUModelRunner (MRv2)</text>
        <rect x="634" y="192" width="160" height="42" rx="4" className="tp-worker" />
        <text x="644" y="212" className="tp-s">WorkerProc rank N</text>
        <text x="644" y="226" className="tp-sub">GPUModelRunner (MRv2)</text>
        <text x="634" y="260" className="tp-sub">Executor broadcasts the</text>
        <text x="634" y="274" className="tp-sub">SchedulerOutput each step</text>

        {/* Edges */}
        <line
          x1="228"
          y1="164"
          x2="308"
          y2="164"
          className="tp-line"
          markerStart="url(#tp-arrow)"
          markerEnd="url(#tp-arrow)"
        />
        <text x="268" y="152" className="tp-edge">ZMQ</text>
        <text x="268" y="183" className="tp-edge">msgpack</text>
        <line
          x1="540"
          y1="164"
          x2="616"
          y2="164"
          className="tp-line"
          markerStart="url(#tp-arrow)"
          markerEnd="url(#tp-arrow)"
        />
        <text x="578" y="152" className="tp-edge2">shm MQ</text>
        <text x="578" y="183" className="tp-edge2">(pickle)</text>
      </svg>
    </div>
  );
}

export function CodebaseArchitecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Where each kind of code lives, which tree runs as which process, and where the engine you actually run starts (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Repository at a glance &amp; the V1 process model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape:</strong> vLLM is three source trees pinned to one
            wheel. The Python package <code>vllm/</code> is about 1.01 million lines
            across 2,569 <code>.py</code> files and holds the orchestration,
            scheduling and model-definition logic; its three largest packages are{' '}
            <code>model_executor/</code>, <code>v1/</code> and <code>models/</code>,
            the per-model packages the model registry points at{' '}
            <Cite tier={1} href={vllmUrl('vllm/model_executor/models/registry.py', 'L93-L97')}>
              registry.py L93-L97
            </Cite>
            . <code>csrc/</code> holds 310 <code>.cu</code>, <code>.cuh</code>,{' '}
            <code>.cpp</code>, <code>.h</code> and <code>.hpp</code> files: the
            attention (including MLA, multi-head latent attention), quantization, MoE
            (mixture of experts) and collective kernels compiled into the extension.{' '}
            <code>rust/</code> (340 <code>.rs</code> files, about 126,000 lines)
            builds <code>vllm-rs</code>, a separate frontend process that{' '}
            <code>vllm serve</code> starts in place of the Python API server when{' '}
            <code>VLLM_USE_RUST_FRONTEND=1</code>, and hands it the same ZMQ (ZeroMQ)
            engine addresses{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L344-L357')}>
              serve.py L344-L357
            </Cite>
            ; it also builds one PyO3 (Rust bindings for Python) tool-parser module
            the Python server loads in process{' '}
            <Cite tier={1} href={vllmUrl('tools/build_rust.py', 'L48-L66')}>
              build_rust.py L48-L66
            </Cite>
            . The Rust Frontend tab covers both.
          </Box>
          <Box variant="p">
            The engine you run lives under <code>vllm/v1/</code>.{' '}
            <code>vllm/engine/</code> keeps <code>arg_utils.py</code>, the 3,158-line{' '}
            <code>EngineArgs</code> CLI surface{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L464')}>
              arg_utils.py L464
            </Cite>
            , <code>protocol.py</code> with the <code>EngineClient</code> interface,
            and two 7-line aliases, <code>llm_engine.py</code> and{' '}
            <code>async_llm_engine.py</code>.
          </Box>
          <RepoMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Counts are ours, from <code>find</code> and <code>wc -l</code> over{' '}
            <Cite tier={1} href={TREE}>
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>One engine.</strong> <code>vllm/engine/llm_engine.py</code> is
            seven lines: it imports <code>vllm.v1.engine.llm_engine.LLMEngine</code>{' '}
            and binds the public <code>LLMEngine</code> name to it{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/llm_engine.py', 'L1-L7')}>
              llm_engine.py L1-L7
            </Cite>
            , so code or a tutorial that imports <code>from vllm import LLMEngine</code>{' '}
            gets the V1 engine{' '}
            <Cite tier={1} href={vllmUrl('vllm/__init__.py', 'L20')}>
              __init__.py L20
            </Cite>
            . A single-process mode remains for embedded use and debugging: with{' '}
            <code>VLLM_ENABLE_V1_MULTIPROCESSING=0</code> (default <code>1</code>),{' '}
            <code>LLMEngine</code> uses <code>InprocClient</code>, which builds the
            EngineCore in the caller&apos;s process and calls it directly{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L343-L385')}>
              core_client.py L343-L385
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1429-L1431')}>
              envs.py L1429-L1431
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which process does what, what crosses each boundary, and why a slow prompt cannot stall the GPU loop"
          >
            The three-process model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The V1 engine splits serving across process boundaries, so the Python
            interpreter that talks to clients is never blocking the interpreter that
            drives the GPU. There are three tiers: a <strong>frontend process</strong>,
            a separate <strong>EngineCore process</strong>, and one or more{' '}
            <strong>worker processes</strong>. On one GPU with no data parallelism the
            executor backend resolves to <code>uni</code> and the worker runs inside
            the EngineCore process, so that server is two processes{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L989-L1034')}>
              parallel.py L989-L1034
            </Cite>
            . The &quot;V1&quot; in V1 engine names this process architecture, while
            Model Runner V2 (MRv2), the default GPU execution layer inside each worker
            since v0.29.0, is a separate axis that the Execution &amp; Attention tab
            covers{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            .
          </Box>
          <ThreeProcessDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Labels come from the sources cited on this page. Illustrative,
            not measured.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Frontend process</Box>
              <Box variant="p">
                Runs <code>AsyncLLM</code> (server) or <code>LLMEngine</code>{' '}
                (offline). <code>AsyncLLM</code> builds a renderer (
                <code>vllm/renderers/</code>), which applies the chat template and
                tokenizes, and hands it to the <code>InputProcessor</code> (prompt to{' '}
                <code>EngineCoreRequest</code>) and the client; the{' '}
                <code>OutputProcessor</code> detokenizes with the renderer&apos;s
                tokenizer and streams{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/async_llm.py', 'L154-L187')}>
                  async_llm.py L154-L187
                </Cite>
                . The <code>EngineCoreClient</code> owns the ZMQ ROUTER (input) and
                PULL (output) sockets{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L616-L625')}>
                  core_client.py L616-L625
                </Cite>
                . Admission control runs here too: with{' '}
                <code>--max-num-queued-reqs</code> or{' '}
                <code>--max-num-queued-tokens</code> set, a request over the cap is
                rejected with HTTP 503{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/async_llm.py', 'L309-L364')}>
                  async_llm.py L309-L364
                </Cite>
                . Files: <code>vllm/v1/engine/async_llm.py</code>,{' '}
                <code>llm_engine.py</code>, <code>input_processor.py</code>,{' '}
                <code>output_processor.py</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">EngineCore process</Box>
              <Box variant="p">
                <code>EngineCoreProc</code> (in <code>vllm/v1/engine/core.py</code>)
                is a pure-Python busy loop plus two daemon IO threads{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L1175-L1195')}>
                  core.py L1175-L1195
                </Cite>
                . The threads move bytes between ZMQ sockets and two in-process
                queues; <code>run_busy_loop()</code> pops the input queue, steps the
                scheduler, and pushes results to the output queue. Requests and
                outputs are <code>msgspec</code> Structs encoded with msgpack
                (MessagePack){' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/__init__.py', 'L109-L112')}>
                  __init__.py L109-L112
                </Cite>
                ; a type the encoder cannot handle raises unless{' '}
                <code>VLLM_ALLOW_INSECURE_SERIALIZATION=1</code> enables a pickle
                fallback{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/serial_utils.py', 'L220-L234')}>
                  serial_utils.py L220-L234
                </Cite>
                . This process owns the scheduler and KV-cache (key-value cache)
                manager{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L140-L151')}>
                  core.py L140-L151
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Worker processes</Box>
              <Box variant="p">
                One <code>WorkerProc</code> per parallel rank, each wrapping a GPU
                worker whose model runner is MRv2 (
                <code>vllm/v1/worker/gpu/model_runner.py</code>) by default; the V1
                runner (<code>gpu_model_runner.py</code>) remains as a fallback{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L507-L526')}>
                  gpu_worker.py L507-L526
                </Cite>
                . The executor broadcasts the per-step <code>SchedulerOutput</code>{' '}
                to every worker, pickled into a shared-memory ring, and collects each
                worker&apos;s <code>ModelRunnerOutput</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/distributed/device_communicators/shm_broadcast.py', 'L850-L866')}
                >
                  shm_broadcast.py L850-L866
                </Cite>
                . Workers reach the frontend only through the EngineCore, as far as
                our search of <code>vllm/v1/worker/</code> and{' '}
                <code>vllm/v1/executor/</code> at v0.31.0 shows: neither opens a ZMQ
                socket.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Why the split matters.</strong> With detokenization and HTTP
            handling on one interpreter and the scheduler and GPU step on another,
            tokenizing a very long prompt or formatting a streamed response cannot
            stall the decode loop. The cost is serialization on every hop, and each
            hop keeps it small its own way. Tensors and arrays of 256 bytes or more
            leave the msgpack body and travel as separate ZMQ frames (
            <code>aux_buffers</code>), so large payloads are not copied into the
            message{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/serial_utils.py', 'L236-L249')}>
              serial_utils.py L236-L249
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1684-L1688')}>
              envs.py L1684-L1688
            </Cite>
            . Within a node, the worker hop writes into a shared-memory ring instead
            of a socket.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which client your entry point gets, and the one flag that picks the data-parallel variant"
          >
            Client tiers (vllm/v1/engine/core_client.py)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The <code>EngineCoreClient</code> is what the frontend uses to reach the
            EngineCore. Which concrete client it instantiates depends on two booleans
            (<code>multiprocess_mode</code> and <code>asyncio_mode</code>), resolved
            in <code>EngineCoreClient.make_client()</code> /{' '}
            <code>make_async_mp_client()</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L95-L165')}>
              core_client.py L95-L165
            </Cite>
            . The in-process variant skips ZMQ entirely; the rest run the EngineCore
            in a background process, and two of them add data-parallel (DP)
            coordination.
          </Box>
          <Table
            items={clientRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'client', header: 'Client', cell: (r) => <code>{r.client}</code>, minWidth: 180 },
              { id: 'mode', header: 'Transport mode', cell: (r) => r.mode, minWidth: 200 },
              { id: 'used', header: 'Used for', cell: (r) => r.used, minWidth: 240 },
              { id: 'file', header: 'File', cell: (r) => <code>{r.file}</code> },
            ]}
          />
          <Box variant="small">
            With DP above 1, one flag picks the client:{' '}
            <code>data_parallel_external_lb</code> gives one{' '}
            <code>DPAsyncMPClient</code> per DP rank, and every other DP setup gets{' '}
            <code>DPLBAsyncMPClient</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L152-L164')}>
              core_client.py L152-L164
            </Cite>
            . <code>DPAsyncMPClient</code> subclasses <code>AsyncMPClient</code>;{' '}
            <code>DPLBAsyncMPClient</code> subclasses <code>DPAsyncMPClient</code>{' '}
            and adds the internal load balancer{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L1366')}>
              core_client.py L1366
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L1550')}>
              L1550
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How the EngineCore reaches its workers, and which backend you get without asking"
          >
            Executor backends (vllm/v1/executor/)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The executor is the EngineCore&apos;s arm into the workers. Every backend
            implements the same <code>Executor</code> contract from{' '}
            <code>abstract.py</code>; <code>Executor.get_class()</code> picks the
            concrete class from the configured{' '}
            <code>distributed_executor_backend</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/executor/abstract.py', 'L41-L92')}>
              abstract.py L41-L92
            </Cite>
            . Left unset on CUDA, that resolves to <code>mp</code> for any multi-GPU
            run, including multi-node with <code>--nnodes</code>, and to{' '}
            <code>ray</code> only inside a Ray placement group or with{' '}
            <code>data_parallel_backend=ray</code>; a single GPU gets{' '}
            <code>uni</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L989-L1034')}>
              parallel.py L989-L1034
            </Cite>
            . The interesting axis is the transport used to fan the per-step{' '}
            <code>SchedulerOutput</code> out to workers.
          </Box>
          <Table
            items={executorRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'executor',
                header: 'Executor',
                cell: (r) => <code>{r.executor}</code>,
                minWidth: 200,
              },
              { id: 'transport', header: 'Worker transport', cell: (r) => r.transport, minWidth: 240 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 260 },
            ]}
          />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                MessageQueue path <Badge color="green">default</Badge>
              </Box>
              <Box variant="p">
                <code>MultiprocExecutor</code> builds an <code>rpc_broadcast_mq</code>{' '}
                (a shared-memory <code>MessageQueue</code> from{' '}
                <code>vllm/distributed/device_communicators/shm_broadcast.py</code>)
                and broadcasts the scheduler output to all worker ranks through it,
                collecting responses on per-worker queues{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/multiproc_executor.py', 'L164-L169')}>
                  multiproc_executor.py L164-L169
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/multiproc_executor.py', 'L226-L249')}>
                  L226-L249
                </Cite>
                . Within a node there is no serialization over a socket on the hot
                path: the payload is pickled into the shared-memory ring. A message of
                16 MiB or more (<code>VLLM_MQ_MAX_CHUNK_BYTES_MB</code>) overflows to
                a local ZMQ socket, and readers on other nodes receive over ZMQ{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/distributed/device_communicators/shm_broadcast.py', 'L867-L891')}
                >
                  shm_broadcast.py L867-L891
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1810-L1814')}>
                  envs.py L1810-L1814
                </Cite>
                . <code>RayExecutorV2</code> subclasses <code>MultiprocExecutor</code>{' '}
                and reuses the same <code>MessageQueue</code> machinery{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/ray_executor_v2.py', 'L239')}>
                  ray_executor_v2.py L239
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/ray_executor_v2.py', 'L333')}>
                  L333
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Legacy compiled-DAG path</Box>
              <Box variant="p">
                <code>RayDistributedExecutor</code> builds a{' '}
                <code>ray.dag.CompiledDAG</code> (<code>self.forward_dag</code>) and
                executes it per step{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/ray_executor.py', 'L458')}>
                  ray_executor.py L458
                </Cite>
                . It predates <code>RayExecutorV2</code> and is selected only when{' '}
                <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND</code> is explicitly set to{' '}
                <code>0</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/abstract.py', 'L64-L72')}>
                  abstract.py L64-L72
                </Cite>
                . <code>UniProcExecutor</code> is the degenerate case: a single
                in-process worker with no IPC at all, used at world size 1{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/uniproc_executor.py', 'L51-L69')}>
                  uniproc_executor.py L51-L69
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Which Ray backend you get.</strong> With{' '}
            <code>distributed_executor_backend=&quot;ray&quot;</code>,{' '}
            <code>get_class()</code> branches on{' '}
            <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND</code>. The type annotation in{' '}
            <code>envs.py</code> reads <code>False</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L67')}>
              envs.py L67
            </Cite>
            , but the runtime resolver is{' '}
            <code>int(os.getenv(&quot;VLLM_USE_RAY_V2_EXECUTOR_BACKEND&quot;, &quot;1&quot;))</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L938-L939')}>
              envs.py L938-L939
            </Cite>
            , so an unset variable yields <code>RayExecutorV2</code>. That is the
            sense in which V2 is the default.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why garbage-collector pauses stay small in every process, and how long an idle data-parallel rank keeps stepping"
          >
            Two details worth knowing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ExpandableSection headerText="gc.freeze() in every tier: taming the GC pause">
            <SpaceBetween size="s">
              <Box variant="p">
                Python&apos;s cyclic garbage collector (GC) periodically scans every
                tracked object. After startup the heap is enormous and almost
                entirely static (weights, the KV-cache manager, config trees), so a
                generation-2 collection that walks all of it just to free nothing is
                pure latency added to a decode step.
              </Box>
              <Box variant="p">
                Each of the three tiers freezes its startup heap.{' '}
                <code>EngineCore.__init__</code> calls <code>freeze_gc_heap()</code>{' '}
                after the executor and KV caches are built{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L245-L247')}>
                  core.py L245-L247
                </Cite>
                ; the helper runs <code>gc.collect()</code> across all three
                generations to push survivors to the oldest, then{' '}
                <code>gc.freeze()</code> to mark them permanent{' '}
                <Cite tier={1} href={vllmUrl('vllm/utils/gc_utils.py', 'L120-L131')}>
                  gc_utils.py L120-L131
                </Cite>
                . The GPU worker calls it again once warmup is done{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L999-L1002')}>
                  gpu_worker.py L999-L1002
                </Cite>
                , and the API server calls it when its lifespan starts{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/entrypoints/launchers/utils/server_utils.py', 'L89-L91')}
                >
                  server_utils.py L89-L91
                </Cite>
                . During CUDA-graph capture both model runners freeze and disable the
                GC through <code>freeze_gc_for_cudagraph_capture()</code>; the
                helper&apos;s docstring gives the reason, that a collection during
                capture can invalidate the captured graph{' '}
                <Cite tier={1} href={vllmUrl('vllm/utils/gc_utils.py', 'L92-L117')}>
                  gc_utils.py L92-L117
                </Cite>
                . <code>VLLM_ENABLE_CUDAGRAPH_GC=1</code> opts out{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1867-L1870')}>
                  envs.py L1867-L1870
                </Cite>
                . The net effect: frozen objects are skipped by every later
                collection, so steady-state GC pauses in each process are bounded by
                the small set of objects created per request, not by the whole
                resident model.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Data-parallel waves: idle/wake and the DPCoordinator">
            <SpaceBetween size="s">
              <Box variant="p">
                In a data-parallel deployment (DP &gt; 1) there is one EngineCore per
                DP rank (<code>DPEngineCoreProc</code> in <code>core.py</code>) plus a{' '}
                <code>DPCoordinator</code> process (
                <code>vllm/v1/engine/coordinator.py</code>){' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L2066')}>
                  core.py L2066
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/coordinator.py', 'L23')}>
                  coordinator.py L23
                </Cite>
                . The ranks alternate together between a global{' '}
                <strong>running</strong> and <strong>paused</strong> state. A{' '}
                <strong>request wave</strong> is a count of how many times the ranks
                have collectively gone from running to paused; the transition is
                synchronized by an all-reduce in{' '}
                <code>DPEngineCoreProc._has_global_unfinished_reqs</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L2333-L2350')}>
                  core.py L2333-L2350
                </Cite>
                .
              </Box>
              <Box variant="p">
                While a wave runs, a rank with nothing scheduled executes a dummy
                batch{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L2276-L2291')}>
                  core.py L2276-L2291
                </Cite>
                . The all-reduce runs on the first step of a wave and then every{' '}
                <code>dp_sync_interval</code> steps, default 16{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L150-L151')}>
                  parallel.py L150-L151
                </Cite>
                , so after the last request finishes an idle rank can run up to one
                interval of dummy steps before the ranks agree to pause.{' '}
                <code>--dp-sync-interval</code> tunes it, and the value must match
                across ranks{' '}
                <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L556')}>
                  arg_utils.py L556
                </Cite>
                .
              </Box>
              <Box variant="p">
                Once paused, the ranks stop stepping. When a new request arrives at
                any rank, that rank notifies the coordinator, which broadcasts a{' '}
                <code>START_DP_WAVE</code> message to wake every rank back into the
                running state so they step in lockstep{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L2207-L2214')}>
                  core.py L2207-L2214
                </Cite>
                . The coordinator also collects per-rank queue lengths and publishes
                them to the frontends for load balancing{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/coordinator.py', 'L98-L132')}>
                  coordinator.py L98-L132
                </Cite>
                . The <code>request_wave</code> tag travels with each request so a
                rank can detect a request aimed at an already-completed wave and
                re-trigger the coordinator{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L2159-L2170')}>
                  core.py L2159-L2170
                </Cite>
                . This is the mechanism behind <code>current_wave</code> and{' '}
                <code>ignore_start_dp_wave</code> in <code>core.py</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Key files for this layer">
            <Box variant="p">
              Frontend and engine: <code>vllm/v1/engine/core.py</code> (EngineCore,
              EngineCoreProc, DPEngineCoreProc),{' '}
              <code>vllm/v1/engine/core_client.py</code> (the client tiers),{' '}
              <code>vllm/v1/engine/llm_engine.py</code> (sync frontend),{' '}
              <code>vllm/v1/engine/async_llm.py</code> (async frontend),{' '}
              <code>vllm/v1/engine/admission_control.py</code> (queue caps shared
              across API servers), <code>vllm/v1/engine/coordinator.py</code> (DP
              coordinator), <code>vllm/renderers/</code> (chat template and
              tokenization). Executors: everything under{' '}
              <code>vllm/v1/executor/</code>: <code>abstract.py</code>,{' '}
              <code>multiproc_executor.py</code>, <code>ray_executor_v2.py</code>,{' '}
              <code>ray_executor.py</code>, <code>uniproc_executor.py</code>. CLI
              surface: <code>vllm/engine/arg_utils.py</code>.{' '}
              <Link external href={`${TREE}/vllm/v1`}>
                Browse vllm/v1 at v0.31.0
              </Link>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
