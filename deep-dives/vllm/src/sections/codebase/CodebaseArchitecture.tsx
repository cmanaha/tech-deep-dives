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
    used: 'Embedded / debugging — EngineCore runs in the caller thread',
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
    used: 'AsyncLLM — the OpenAI-compatible server',
    file: 'core_client.py',
  },
  {
    client: 'DPAsyncMPClient',
    mode: 'AsyncMP + DP coordinator',
    used: 'Data-parallel: one EngineCore per DP rank',
    file: 'core_client.py',
  },
  {
    client: 'DPLBAsyncMPClient',
    mode: 'DPAsync + internal load balancer',
    used: 'Data-parallel with vLLM-side request routing',
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
    notes: 'Single worker in the EngineCore process — TP=1, no distribution',
  },
  {
    executor: 'MultiprocExecutor',
    transport: 'Shared-memory MessageQueue broadcast',
    notes: 'Default for single-node multi-GPU; spawns one WorkerProc per rank',
  },
  {
    executor: 'RayExecutorV2',
    transport: 'MessageQueue (subclasses MultiprocExecutor)',
    notes: 'Default Ray backend — VLLM_USE_RAY_V2_EXECUTOR_BACKEND defaults to 1',
  },
  {
    executor: 'RayDistributedExecutor',
    transport: 'Ray compiled-DAG (ray.dag.CompiledDAG)',
    notes: 'Legacy Ray path, kept for compatibility',
  },
];

function RepoMapDiagram() {
  return (
    <svg
      viewBox="0 0 720 250"
      role="img"
      style={{ width: '100%', height: 'auto' }}
      aria-labelledby="repomap-title"
    >
      <title id="repomap-title">
        Top-level layout of the vLLM repository: vllm Python package, csrc CUDA
        kernels, and rust frontend
      </title>
      <defs>
        <style>{`
          .rm-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .rm-box-alt { fill: #fbf8f2; stroke: #b25a00; stroke-width: 1.5; }
          .rm-box-rust { fill: #f7f2fb; stroke: #6f42c1; stroke-width: 1.5; }
          .rm-title { font: 600 14px sans-serif; fill: #16191f; }
          .rm-sub { font: 11px sans-serif; fill: #5f6b7a; }
          .rm-tag { font: 600 11px sans-serif; fill: #16191f; }
        `}</style>
      </defs>

      <rect x="10" y="10" width="230" height="230" rx="6" className="rm-box" />
      <text x="24" y="34" className="rm-title">vllm/ &mdash; Python package</text>
      <text x="24" y="54" className="rm-sub">~675K LOC across ~1,799 files</text>
      <text x="24" y="80" className="rm-tag">vllm/v1/ &mdash; the live engine</text>
      <text x="24" y="98" className="rm-sub">engine/ executor/ core/ worker/</text>
      <text x="24" y="114" className="rm-sub">attention/ sample/ spec_decode/</text>
      <text x="24" y="138" className="rm-tag">vllm/engine/ &mdash; legacy shim</text>
      <text x="24" y="156" className="rm-sub">llm_engine.py = 7-line alias</text>
      <text x="24" y="180" className="rm-tag">model_executor/ distributed/</text>
      <text x="24" y="198" className="rm-sub">entrypoints/ config/ compilation/</text>
      <text x="24" y="222" className="rm-sub">multimodal/ lora/ platforms/ &hellip;</text>

      <rect x="255" y="10" width="220" height="230" rx="6" className="rm-box-alt" />
      <text x="269" y="34" className="rm-title">csrc/ &mdash; CUDA / C++</text>
      <text x="269" y="54" className="rm-sub">242 .cu/.cuh/.cpp/.hpp files</text>
      <text x="269" y="80" className="rm-tag">attention kernels</text>
      <text x="269" y="98" className="rm-sub">paged attention, MLA, FA glue</text>
      <text x="269" y="122" className="rm-tag">quantization</text>
      <text x="269" y="140" className="rm-sub">fp8, int8, awq, gptq, marlin</text>
      <text x="269" y="164" className="rm-tag">moe / activation / cache ops</text>
      <text x="269" y="182" className="rm-sub">custom_all_reduce, layernorm</text>
      <text x="269" y="210" className="rm-sub">bound into the wheel at build</text>

      <rect x="490" y="10" width="220" height="230" rx="6" className="rm-box-rust" />
      <text x="504" y="34" className="rm-title">rust/ &mdash; Rust frontend</text>
      <text x="504" y="54" className="rm-sub">~210 .rs files</text>
      <text x="504" y="80" className="rm-tag">tokenization / request</text>
      <text x="504" y="98" className="rm-sub">parsing on the hot path</text>
      <text x="504" y="122" className="rm-tag">native extension</text>
      <text x="504" y="140" className="rm-sub">called from Python</text>
      <text x="504" y="164" className="rm-tag">newest of the three trees</text>
      <text x="504" y="182" className="rm-sub">moving latency-critical glue</text>
      <text x="504" y="200" className="rm-sub">out of interpreted Python</text>
    </svg>
  );
}

function ThreeProcessDiagram() {
  return (
    <svg
      viewBox="0 0 760 340"
      role="img"
      style={{ width: '100%', height: 'auto' }}
      aria-labelledby="threeproc-title"
    >
      <title id="threeproc-title">
        The vLLM V1 three-process model: a frontend process holding the
        EngineCoreClient talks over ZMQ to a separate EngineCore process, which
        drives one or more worker processes over a shared-memory MessageQueue.
      </title>
      <defs>
        <style>{`
          .tp-proc { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tp-core { fill: #effaf3; stroke: #037f51; stroke-width: 1.5; }
          .tp-worker { fill: #fbf8f2; stroke: #b25a00; stroke-width: 1.5; }
          .tp-h { font: 600 13px sans-serif; fill: #16191f; }
          .tp-s { font: 11px sans-serif; fill: #16191f; }
          .tp-sub { font: 10px sans-serif; fill: #5f6b7a; }
          .tp-edge { font: 600 10px sans-serif; fill: #0972d3; }
          .tp-edge2 { font: 600 10px sans-serif; fill: #b25a00; }
          .tp-line { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}</style>
        <marker id="tp-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
        </marker>
      </defs>

      {/* Frontend process */}
      <rect x="10" y="40" width="200" height="240" rx="6" className="tp-proc" />
      <text x="24" y="62" className="tp-h">Frontend process</text>
      <text x="24" y="80" className="tp-sub">AsyncLLM / LLMEngine</text>
      <rect x="24" y="92" width="172" height="40" rx="4" className="tp-proc" />
      <text x="34" y="110" className="tp-s">InputProcessor</text>
      <text x="34" y="125" className="tp-sub">prompt &rarr; EngineCoreRequest</text>
      <rect x="24" y="140" width="172" height="40" rx="4" className="tp-proc" />
      <text x="34" y="158" className="tp-s">OutputProcessor</text>
      <text x="34" y="173" className="tp-sub">detokenize, stream out</text>
      <rect x="24" y="188" width="172" height="58" rx="4" className="tp-proc" />
      <text x="34" y="206" className="tp-s">EngineCoreClient</text>
      <text x="34" y="221" className="tp-sub">owns ZMQ ROUTER (in)</text>
      <text x="34" y="235" className="tp-sub">+ PULL (out) sockets</text>

      {/* EngineCore process */}
      <rect x="280" y="40" width="220" height="240" rx="6" className="tp-core" />
      <text x="294" y="62" className="tp-h">EngineCore process</text>
      <text x="294" y="80" className="tp-sub">EngineCoreProc</text>
      <rect x="294" y="92" width="192" height="34" rx="4" className="tp-core" />
      <text x="304" y="113" className="tp-s">input IO thread (daemon)</text>
      <rect x="294" y="132" width="192" height="50" rx="4" className="tp-core" />
      <text x="304" y="150" className="tp-s">run_busy_loop()</text>
      <text x="304" y="165" className="tp-sub">pure-Python; pops input_queue,</text>
      <text x="304" y="177" className="tp-sub">steps scheduler, pushes outputs</text>
      <rect x="294" y="188" width="192" height="34" rx="4" className="tp-core" />
      <text x="304" y="209" className="tp-s">output IO thread (daemon)</text>
      <text x="294" y="244" className="tp-sub">Scheduler + KVCacheManager</text>
      <text x="294" y="262" className="tp-sub">gc.freeze() after model load</text>

      {/* Workers */}
      <rect x="570" y="40" width="180" height="240" rx="6" className="tp-worker" />
      <text x="584" y="62" className="tp-h">Worker processes</text>
      <text x="584" y="80" className="tp-sub">one per parallel rank</text>
      <rect x="584" y="92" width="152" height="42" rx="4" className="tp-worker" />
      <text x="594" y="112" className="tp-s">WorkerProc rank 0</text>
      <text x="594" y="126" className="tp-sub">GPUModelRunner</text>
      <rect x="584" y="142" width="152" height="42" rx="4" className="tp-worker" />
      <text x="594" y="162" className="tp-s">WorkerProc rank 1</text>
      <text x="594" y="176" className="tp-sub">GPUModelRunner</text>
      <rect x="584" y="192" width="152" height="42" rx="4" className="tp-worker" />
      <text x="594" y="212" className="tp-s">WorkerProc rank N</text>
      <text x="594" y="226" className="tp-sub">GPUModelRunner</text>
      <text x="584" y="256" className="tp-sub">Executor broadcasts the</text>
      <text x="584" y="270" className="tp-sub">SchedulerOutput each step</text>

      {/* Edges */}
      <line x1="210" y1="150" x2="280" y2="150" className="tp-line" markerEnd="url(#tp-arrow)" />
      <text x="216" y="142" className="tp-edge">ZMQ +</text>
      <text x="216" y="172" className="tp-edge">msgspec</text>
      <line x1="500" y1="150" x2="570" y2="150" className="tp-line" markerEnd="url(#tp-arrow)" />
      <text x="504" y="142" className="tp-edge2">shm</text>
      <text x="504" y="172" className="tp-edge2">MQ</text>
    </svg>
  );
}

export function CodebaseArchitecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="What the repository actually contains, and the process boundaries that the live engine is built on"
          >
            Repository at a glance &amp; the V1 process model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape:</strong> vLLM is three source trees pinned to one
            wheel. The Python package <code>vllm/</code> is roughly 675,000 lines
            across about 1,799 files and holds essentially all of the orchestration,
            scheduling, and model-definition logic. <code>csrc/</code> holds 242
            CUDA/C++ source and header files &mdash; the attention, quantization,
            MoE, and collective kernels that get compiled into the extension.{' '}
            <code>rust/</code> is the newest tree, ~210 <code>.rs</code> files
            implementing a native frontend for latency-critical glue. The engine you
            actually run lives almost entirely under <code>vllm/v1/</code>; the older{' '}
            <code>vllm/engine/</code> tree has been reduced to a compatibility shim.
            (File and line counts at vLLM commit 15652a6b, accessed 2026-06-07.)
          </Box>
          <RepoMapDiagram />
          <Alert type="info">
            <strong>V0 is gone.</strong> <code>vllm/engine/llm_engine.py</code> is
            now seven lines: it imports{' '}
            <code>vllm.v1.engine.llm_engine.LLMEngine</code> and binds the public{' '}
            <code>LLMEngine</code> name to it. Any code or tutorial that imports{' '}
            <code>from vllm import LLMEngine</code> transparently gets the V1 engine.
            The old single-process, Python-object-passing architecture has been
            fully removed.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The three-process model</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            V1 splits the work that V0 did in one process across a process boundary,
            so the Python interpreter that talks to clients is never blocking the
            interpreter that drives the GPU. There are three tiers: a{' '}
            <strong>frontend process</strong>, a separate{' '}
            <strong>EngineCore process</strong>, and one or more{' '}
            <strong>worker processes</strong>.
          </Box>
          <ThreeProcessDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Frontend process</Box>
              <Box variant="p">
                Runs <code>AsyncLLM</code> (server) or <code>LLMEngine</code>{' '}
                (offline). Holds the <code>InputProcessor</code> (prompt to{' '}
                <code>EngineCoreRequest</code>), the <code>OutputProcessor</code>{' '}
                (detokenize and stream), and the <code>EngineCoreClient</code>,
                which owns the ZMQ ROUTER (input) and PULL (output) sockets. Files:{' '}
                <code>vllm/v1/engine/async_llm.py</code>,{' '}
                <code>llm_engine.py</code>, <code>input_processor.py</code>,{' '}
                <code>output_processor.py</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">EngineCore process</Box>
              <Box variant="p">
                <code>EngineCoreProc</code> (in{' '}
                <code>vllm/v1/engine/core.py</code>) is a pure-Python busy loop plus
                two daemon IO threads. The threads move bytes between ZMQ sockets and
                two in-process queues; <code>run_busy_loop()</code> pops the input
                queue, steps the scheduler, and pushes results to the output queue.
                Messages on the wire are <code>msgspec</code> Structs, not pickle.
                This process owns the scheduler and KV-cache manager.
              </Box>
            </div>
            <div>
              <Box variant="h3">Worker processes</Box>
              <Box variant="p">
                One <code>WorkerProc</code> per parallel rank, each wrapping a{' '}
                <code>GPUModelRunner</code>. The executor broadcasts the per-step{' '}
                <code>SchedulerOutput</code> to every worker and collects each
                worker&apos;s <code>ModelRunnerOutput</code>. Workers never talk to
                the frontend directly &mdash; only to the EngineCore via its
                executor. Files under <code>vllm/v1/executor/</code> and{' '}
                <code>vllm/v1/worker/</code>.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Why the split matters.</strong> With detokenization and HTTP
            handling on one interpreter and the scheduler/GPU step on another,
            tokenizing a 100K-token prompt or formatting a streamed response cannot
            stall the decode loop. The cost is serialization on every hop &mdash;
            which is why the wire format is <code>msgspec</code> (zero-copy where
            possible) and the worker hop is shared memory, not ZMQ.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Client tiers (vllm/v1/engine/core_client.py)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The <code>EngineCoreClient</code> is what the frontend uses to reach the
            EngineCore. Which concrete client it instantiates depends on two
            booleans &mdash; <code>multiprocess_mode</code> and{' '}
            <code>asyncio_mode</code> &mdash; resolved in{' '}
            <code>EngineCoreClient.make_client()</code> /{' '}
            <code>make_async_mp_client()</code>. The in-process variant skips ZMQ
            entirely; the rest run the EngineCore in a background process.
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
            Tiers and their roles are documented in the{' '}
            <code>EngineCoreClient</code> class docstring at the top of{' '}
            <code>vllm/v1/engine/core_client.py</code>. The two DP variants
            (<code>DPAsyncMPClient</code>, <code>DPLBAsyncMPClient</code>) subclass{' '}
            <code>AsyncMPClient</code> and add data-parallel coordination; the
            second also runs an internal load balancer. (vLLM commit 15652a6b.)
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Executor backends (vllm/v1/executor/)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The executor is the EngineCore&apos;s arm into the workers. Every backend
            implements the same <code>Executor</code> contract from{' '}
            <code>abstract.py</code>; <code>Executor.get_class()</code> picks the
            concrete class from the configured{' '}
            <code>distributed_executor_backend</code>. The interesting axis is the
            transport used to fan the per-step <code>SchedulerOutput</code> out to
            workers.
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
                <code>MultiprocExecutor</code> builds an{' '}
                <code>rpc_broadcast_mq</code> &mdash; a shared-memory{' '}
                <code>MessageQueue</code> from{' '}
                <code>vllm/distributed/device_communicators/shm_broadcast.py</code>{' '}
                &mdash; and broadcasts the scheduler output to all worker ranks
                through it, collecting responses on per-worker queues. No
                serialization-over-socket on the hot path within a node.{' '}
                <code>RayExecutorV2</code> subclasses it and reuses the same{' '}
                <code>MessageQueue</code> machinery, which is why it is now the
                default Ray backend.
              </Box>
            </div>
            <div>
              <Box variant="h3">Legacy compiled-DAG path</Box>
              <Box variant="p">
                <code>RayDistributedExecutor</code> builds a{' '}
                <code>ray.dag.CompiledDAG</code> (<code>self.forward_dag</code>) and
                executes it per step. It predates <code>RayExecutorV2</code> and is
                selected only when <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND</code> is
                explicitly set to <code>0</code>. <code>UniProcExecutor</code> is the
                degenerate case &mdash; a single in-process worker with no IPC at
                all, used for TP=1.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Which Ray backend you get.</strong> With{' '}
            <code>distributed_executor_backend=&quot;ray&quot;</code>,{' '}
            <code>get_class()</code> branches on{' '}
            <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND</code>. The type annotation in{' '}
            <code>envs.py</code> reads <code>False</code>, but the runtime resolver
            is <code>int(os.getenv(&quot;VLLM_USE_RAY_V2_EXECUTOR_BACKEND&quot;,
            &quot;1&quot;))</code> &mdash; so an unset variable yields{' '}
            <code>RayExecutorV2</code>. That is the sense in which V2 is the default.
            (vLLM commit 15652a6b.)
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Two details worth knowing</Header>}>
        <SpaceBetween size="m">
          <ExpandableSection headerText="gc.freeze() after model load — taming the GC pause">
            <SpaceBetween size="s">
              <Box variant="p">
                Python&apos;s cyclic garbage collector periodically scans every
                tracked object. After a model is loaded, the heap is enormous and
                almost entirely static &mdash; weights, the KV-cache manager, config
                trees &mdash; so a generation-2 collection that walks all of it just
                to free nothing is pure latency added to a decode step.
              </Box>
              <Box variant="p">
                vLLM calls <code>gc.freeze()</code> to move those static objects out
                of the GC&apos;s view. <code>EngineCore.__init__</code> invokes{' '}
                <code>freeze_gc_heap()</code> (in <code>vllm/utils/gc_utils.py</code>),
                which runs <code>gc.collect()</code> across all three generations to
                push survivors to the oldest generation, then <code>gc.freeze()</code>{' '}
                to mark them permanent. On the worker side,{' '}
                <code>vllm/v1/worker/gpu_model_runner.py</code> wraps CUDA-graph
                capture in a <code>_freeze_gc()</code> context that does{' '}
                <code>gc.freeze()</code> / <code>gc.unfreeze()</code> around the
                capture (gated by <code>VLLM_ENABLE_CUDAGRAPH_GC</code>). The net
                effect: frozen objects are skipped by every subsequent collection,
                so steady-state GC pauses are bounded by the small set of objects
                created per request, not by the whole resident model.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Data-parallel waves — idle/wake and the DPCoordinator">
            <SpaceBetween size="s">
              <Box variant="p">
                In a data-parallel deployment (DP&gt;1) there is one EngineCore per
                DP rank (<code>DPEngineCoreProc</code> in <code>core.py</code>) plus a{' '}
                <code>DPCoordinator</code> process (<code>vllm/v1/engine/coordinator.py</code>).
                The ranks alternate together between a global{' '}
                <strong>running</strong> and <strong>paused</strong> state. A{' '}
                <strong>request wave</strong> is a count of how many times the ranks
                have collectively gone from running to paused; the transition is
                synchronized by an all-reduce in{' '}
                <code>DPEngineCoreProc._has_global_unfinished_reqs</code>.
              </Box>
              <Box variant="p">
                When all ranks have drained their queues they go idle (paused)
                instead of spinning &mdash; no wasted GPU steps on empty batches.
                When a new request arrives at any rank, that rank notifies the
                coordinator, which broadcasts a <code>START_DP_WAVE</code> message to
                wake every rank back into the running state so they step in lockstep.
                The coordinator also collects per-rank queue lengths and publishes
                them to the frontends for load-balancing. The <code>request_wave</code>{' '}
                tag travels with each request so a rank can detect a request aimed at
                an already-completed wave and re-trigger the coordinator. This is the
                mechanism behind <code>current_wave</code> and{' '}
                <code>ignore_start_dp_wave</code> in <code>core.py</code>.
              </Box>
              <Box variant="small">
                Mechanism described in the <code>DPCoordinator</code> docstring in{' '}
                <code>vllm/v1/engine/coordinator.py</code> (vLLM commit 15652a6b).
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Key files for this layer">
            <Box variant="p">
              Frontend and engine:{' '}
              <code>vllm/v1/engine/core.py</code> (EngineCore, EngineCoreProc,
              DPEngineCoreProc),{' '}
              <code>vllm/v1/engine/core_client.py</code> (the client tiers),{' '}
              <code>vllm/v1/engine/llm_engine.py</code> (sync frontend),{' '}
              <code>vllm/v1/engine/async_llm.py</code> (async frontend),{' '}
              <code>vllm/v1/engine/coordinator.py</code> (DP coordinator). Executors:
              everything under <code>vllm/v1/executor/</code> &mdash;{' '}
              <code>abstract.py</code>, <code>multiproc_executor.py</code>,{' '}
              <code>ray_executor_v2.py</code>, <code>ray_executor.py</code>,{' '}
              <code>uniproc_executor.py</code>. The legacy shim is{' '}
              <code>vllm/engine/llm_engine.py</code>.{' '}
              <Link
                external
                href="https://github.com/vllm-project/vllm/tree/15652a6b/vllm/v1"
              >
                Browse vllm/v1 at commit 15652a6b
              </Link>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
