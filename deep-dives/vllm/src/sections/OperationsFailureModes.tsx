import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// Documentation pages, pinned to the v0.31.0 docs build.
const DOCS = {
  v1: vllmDocsUrl('usage/v1_guide/'),
  optimization: vllmDocsUrl('configuration/optimization/'),
  conserveMemory: vllmDocsUrl('configuration/conserving_memory/'),
  troubleshooting: vllmDocsUrl('usage/troubleshooting/'),
  quantization: vllmDocsUrl('features/quantization/'),
  preload: vllmDocsUrl('features/preload/'),
  snapshots: vllmDocsUrl('features/initialized_snapshots/'),
  sleepMode: vllmDocsUrl('features/sleep_mode/'),
};

const LOGGERS = 'vllm/v1/metrics/loggers.py';
const SCHED_CFG = 'vllm/config/scheduler.py';
const ARG_UTILS = 'vllm/engine/arg_utils.py';
const GPU_WORKER = 'vllm/v1/worker/gpu_worker.py';
const ASYNC_LLM = 'vllm/v1/engine/async_llm.py';
const OUT_PROC = 'vllm/v1/engine/output_processor.py';
const ENVS = 'vllm/envs.py';
const IPC_LOADER = 'vllm/model_executor/model_loader/weight_cache/ipc_loader.py';
const WC_DAEMON = 'vllm/model_executor/model_loader/weight_cache/daemon.py';
const RELEASE_029 = 'https://github.com/vllm-project/vllm/releases/tag/v0.29.0';
const LITELLM_ADVISORY = 'https://docs.litellm.ai/blog/security-update-march-2026';

// ---------------------------------------------------------------------------
// Restart ladder (inline SVG). Columns are the four startup phases a cold
// boot runs before it serves; rows are the restart paths vLLM v0.31.0 offers.
// Each cell says what that path does with that phase. Schematic: no timings.
// ---------------------------------------------------------------------------

type PhaseState = 'runs' | 'cached' | 'skipped';

interface LadderCell {
  state: PhaseState;
  lines: string[];
}

interface LadderRow {
  name: string;
  how: string;
  needs: string;
  cells: LadderCell[];
}

const RUNS: LadderCell = { state: 'runs', lines: ['runs'] };
const RESTORED: LadderCell = { state: 'skipped', lines: ['restored', 'from the image'] };

const LADDER: LadderRow[] = [
  {
    name: '1. Cold boot',
    how: 'vllm serve with nothing reused',
    needs: 'baseline: every phase runs',
    cells: [RUNS, RUNS, RUNS, RUNS],
  },
  {
    name: '2. Compile cache reused',
    how: 'persist VLLM_CACHE_ROOT across boots',
    needs: 'needs the same model, config and GPU',
    cells: [RUNS, { state: 'cached', lines: ['loads cached', 'artifacts'] }, RUNS, RUNS],
  },
  {
    name: '3. KV size passed back',
    how: '--kv-cache-memory-bytes from the log',
    needs: 'needs the same GPU and free memory',
    cells: [RUNS, RUNS, { state: 'skipped', lines: ['skipped'] }, RUNS],
  },
  {
    name: '4. Weight cache daemon',
    how: 'vllm preload + --load-format ipc_cache',
    needs: 'same node and user; CUDA or ROCm',
    cells: [{ state: 'skipped', lines: ['mapped over', 'CUDA IPC'] }, RUNS, RUNS, RUNS],
  },
  {
    name: '5. Initialized snapshot',
    how: 'vllm snapshot restore (CRIU)',
    needs: 'one GPU, root, same host; experimental',
    cells: [{ state: 'runs', lines: ['reloaded from', 'model files'] }, RESTORED, RESTORED, RESTORED],
  },
];

const PHASES: string[][] = [
  ['Load + process', 'weights'],
  ['Compile', '(torch.compile)'],
  ['Memory', 'profiling'],
  ['CUDA graph', 'capture'],
];

const CELL_STYLE: Record<PhaseState, { fill: string; stroke: string; text: string }> = {
  runs: { fill: '#fbf3d5', stroke: '#8b6c00', text: '#5c4700' },
  cached: { fill: '#e6f4f2', stroke: '#1f7a70', text: '#16554e' },
  skipped: { fill: '#ecf7ec', stroke: '#037f0c', text: '#025a08' },
};

function RestartLadderDiagram() {
  const top = 86;
  const rowH = 64;
  const gap = 8;
  const labelX = 16;
  const labelW = 300;
  const cellX0 = 328;
  const cellW = 132;
  const cellGap = 10;
  const height = top + LADDER.length * (rowH + gap) + 10;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 900 ${height}`}
        role="img"
        aria-labelledby="ops-restart-ladder-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="ops-restart-ladder-title">
          A cold vLLM boot runs four startup phases before it serves: loading and processing the
          weights, torch.compile, memory profiling and CUDA graph capture. Reusing a persisted
          compile cache replaces compilation with a cache load. Passing back the KV cache size the
          previous boot logged skips memory profiling. The vllm preload weight cache daemon, with
          the ipc_cache load format, maps already processed weights over CUDA IPC instead of
          loading them from disk. An initialized snapshot restores the compiled, profiled and
          captured process from a CRIU image and reloads only the model files.
        </title>
        <style>{`
          .rl-h { fill: #16191f; font: 600 13px sans-serif; }
          .rl-ph { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .rl-ps { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .rl-n { fill: #065299; font: 600 13px sans-serif; }
          .rl-s { fill: #414d5c; font: 11px sans-serif; }
          .rl-c { font: 600 12px sans-serif; text-anchor: middle; }
          .rl-c2 { font: 11px sans-serif; text-anchor: middle; }
        `}</style>
        <rect x={0} y={0} width={900} height={height} rx={8} fill="#ffffff" />
        <text x={16} y={28} className="rl-h">
          What each restart path runs, replaces or skips before vLLM serves
        </text>
        <text x={labelX + 12} y={66} className="rl-ph" style={{ textAnchor: 'start' }}>
          Restart path, and what it needs
        </text>
        {PHASES.map((p, i) => {
          const cx = cellX0 + i * (cellW + cellGap) + cellW / 2;
          return (
            <g key={p[0]}>
              <text x={cx} y={58} className="rl-ph">
                {p[0]}
              </text>
              <text x={cx} y={74} className="rl-ps">
                {p[1]}
              </text>
            </g>
          );
        })}
        {LADDER.map((r, ri) => {
          const y = top + ri * (rowH + gap);
          return (
            <g key={r.name}>
              <rect
                x={labelX}
                y={y}
                width={labelW}
                height={rowH}
                rx={6}
                fill="#f2f8fd"
                stroke="#0972d3"
                strokeWidth={1.5}
              />
              <text x={labelX + 12} y={y + 22} className="rl-n">
                {r.name}
              </text>
              <text x={labelX + 12} y={y + 40} className="rl-s">
                {r.how}
              </text>
              <text x={labelX + 12} y={y + 55} className="rl-s">
                {r.needs}
              </text>
              {r.cells.map((c, ci) => {
                const x = cellX0 + ci * (cellW + cellGap);
                const s = CELL_STYLE[c.state];
                return (
                  <g key={`${r.name}-${ci}`}>
                    <rect
                      x={x}
                      y={y}
                      width={cellW}
                      height={rowH}
                      rx={6}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={1.2}
                    />
                    {c.lines.length === 1 ? (
                      <text x={x + cellW / 2} y={y + 37} className="rl-c" fill={s.text}>
                        {c.lines[0]}
                      </text>
                    ) : (
                      <>
                        <text x={x + cellW / 2} y={y + 29} className="rl-c" fill={s.text}>
                          {c.lines[0]}
                        </text>
                        <text x={x + cellW / 2} y={y + 46} className="rl-c2" fill={s.text}>
                          {c.lines[1]}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Failure-mode lookup table.
// ---------------------------------------------------------------------------

type Grounding = 'cited' | 'pattern';

interface FailureRow {
  id: string;
  area: ReactNode;
  grounding: Grounding;
  symptom: ReactNode;
  cause: ReactNode;
  detection: ReactNode;
  fix: ReactNode;
}

const ROWS: FailureRow[] = [
  {
    id: 'preemption',
    area: 'Throughput cliff under KV exhaustion',
    grounding: 'cited',
    symptom: (
      <>
        Throughput collapses under load, tail latency spikes, and the periodic stats log line starts
        showing <code>Preemptions: N</code>.
      </>
    ),
    cause: (
      <Box variant="p">
        Too little KV-cache space for the in-flight batch. The scheduler (<strong>Section 4</strong>)
        frees a running request&apos;s KV blocks and runs its prefill again later. V1 has no GPU-to-CPU
        swap, so preemption is recompute only and the evicted work is thrown away{' '}
        <Cite tier={1} href={DOCS.v1}>
          vLLM docs: V1 user guide
        </Cite>
        . The optimization guide&apos;s &quot;preempted by PreemptionMode.RECOMPUTE&quot; warning is
        a V0 message that V1 does not print{' '}
        <Cite
          tier={1}
          href={vllmUrl('docs/configuration/optimization.md', 'L29-L35')}
          kind="doc-code-conflict"
        >
          optimization.md L29-L35
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        <code>vllm:num_preemptions</code> rising{' '}
        <Cite tier={1} href={vllmUrl(LOGGERS, 'L676-L680')}>
          loggers.py L676-L680
        </Cite>{' '}
        with <code>vllm:kv_cache_usage_perc</code> near 1.0 (<strong>Section 20</strong>). The stats
        log line adds <code>Preemptions: N</code> for any interval with a preemption{' '}
        <Cite tier={1} href={vllmUrl(LOGGERS, 'L295-L297')}>
          loggers.py L295-L297
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Give the KV cache more room: raise <code>gpu_memory_utilization</code>, add GPUs via{' '}
        <code>tensor_parallel_size</code>, or lower <code>max_num_seqs</code>{' '}
        <Cite tier={1} href={DOCS.optimization}>
          vLLM docs: Optimization and tuning
        </Cite>
        , which <code>vllm serve</code> sets to 1024 on H100-class and larger GPUs and 256 otherwise{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
          arg_utils.py L2858-L2887
        </Cite>
        ; or shorten <code>max_model_len</code>{' '}
        <Cite tier={1} href={DOCS.conserveMemory}>
          vLLM docs: Conserving memory
        </Cite>
        . Two scheduler knobs act more directly: <code>--watermark 0.05</code> keeps 5% of KV blocks
        free when admitting requests{' '}
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L197-L202')}>
          scheduler.py L197-L202
        </Cite>
        , and <code>--max-num-active-seqs</code> caps the running batch below{' '}
        <code>max_num_seqs</code> without resizing CUDA graphs{' '}
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L70-L78')}>
          scheduler.py L70-L78
        </Cite>
        .
      </Box>
    ),
  },
  {
    id: 'chunked-prefill',
    area: 'Chunked prefill misread as a memory fix',
    grounding: 'cited',
    symptom:
      'You enabled chunked prefill expecting KV pressure to drop, but preemptions persist at the same load.',
    cause: (
      <Box variant="p">
        Chunked prefill splits a long prompt&apos;s <em>prefill compute</em> across steps so it
        interleaves with decode. KV memory stays the same: the scheduler admits a request only when
        its full prompt fits in the KV cache{' '}
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L191-L195')}>
          scheduler.py L191-L195
        </Cite>
        . It shapes latency and throughput, and it is on by default for every model that supports
        it{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2922-L2933')}>
          arg_utils.py L2922-L2933
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        KV usage and <code>num_preemptions</code> unchanged after toggling chunked prefill; only the
        balance between TTFT (time to first token) and ITL (inter-token latency) moves.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Treat KV capacity separately: use the preemption levers above. Tune{' '}
        <code>max_num_batched_tokens</code> only for the TTFT-versus-ITL trade-off; <code>vllm serve</code>{' '}
        starts it at 16384, 8192 or 2048 tokens by GPU tier{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
          arg_utils.py L2858-L2887
        </Cite>
        .
      </Box>
    ),
  },
  {
    id: 'queue-overflow',
    area: 'Unbounded queue under overload',
    grounding: 'cited',
    symptom:
      'TTFT climbs for every caller during a spike: the saturated replica keeps accepting requests it cannot start soon, and the load balancer keeps sending them.',
    cause: (
      <Box variant="p">
        The request queue has no bound by default{' '}
        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L93-L120')}>
          scheduler.py L93-L120
        </Cite>
        , so every new request waits behind the whole backlog instead of going to a replica with
        room.
      </Box>
    ),
    detection: (
      <Box variant="p">
        <code>vllm:num_requests_waiting</code> growing while output throughput stays flat (
        <strong>Section 20</strong>); a <code>Waiting</code> count in the stats log line that only
        grows{' '}
        <Cite tier={1} href={vllmUrl(LOGGERS, 'L274-L289')}>
          loggers.py L274-L289
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Set <code>--max-num-queued-reqs</code> near <code>data_parallel_size x max_num_seqs</code>{' '}
        plus the queue depth you accept. Past the cap the API server answers HTTP 503 rather than
        429, so that load balancers and client libraries retry on another instance{' '}
        <Cite tier={1} href={vllmUrl('vllm/exceptions.py', 'L148-L175')} kind="code">
          exceptions.py L148-L175
        </Cite>
        . A search of <code>vllm/v1/metrics</code> at v0.31.0 found no counter for these rejections:
        count 503s at the load balancer, or alert on the INFO line &quot;Request queue full -
        rejecting request&quot;{' '}
        <Cite tier={1} href={vllmUrl(ASYNC_LLM, 'L336-L365')} kind="code">
          async_llm.py L336-L365
        </Cite>{' '}
        (<strong>Section 12</strong>).
      </Box>
    ),
  },
  {
    id: 'cold-start',
    area: 'Cold start on boot or scale-up',
    grounding: 'cited',
    symptom:
      'First-ready time runs to minutes. A replica added to absorb a spike is not serving when you need it, and autoscaling lags demand.',
    cause: (
      <Box variant="p">
        Startup work that runs before the server accepts traffic: loading and processing weights,{' '}
        <code>torch.compile</code>, memory profiling and CUDA graph capture. vLLM &quot;heavily
        depends on <code>torch.compile</code>&quot;{' '}
        <Cite tier={1} href={vllmUrl('docs/usage/troubleshooting.md', 'L235')}>
          troubleshooting.md L235
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        A long gap between process start and the first <code>/health</code> 200. A start that exceeds{' '}
        <code>VLLM_ENGINE_READY_TIMEOUT_S</code> (default 600 seconds){' '}
        <Cite tier={1} href={vllmUrl(ENVS, 'L808-L812')}>
          envs.py L808-L812
        </Cite>{' '}
        fails with &quot;Timed out waiting for engine core processes to start&quot;{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L731-L742')}>
          core_client.py L731-L742
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Climb the restart ladder in the next block: reuse the compile cache, pass back the logged KV
        size, and on the same node map weights from a <code>vllm preload</code> daemon. Size the
        autoscaler&apos;s scale-up lead time to the boot time you measured.
      </Box>
    ),
  },
  {
    id: 'oom-load',
    area: 'Out of memory (OOM) at model load or first capture',
    grounding: 'cited',
    symptom:
      'CUDA out-of-memory during startup, while loading weights or as CUDA graphs are captured, before the server accepts traffic.',
    cause: (
      <Box variant="p">
        Weights, activations, the CUDA graph pool and the KV pre-allocation do not fit in the share
        of the GPU that <code>gpu_memory_utilization</code> claims (default 0.92{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L103')}>
          cache.py L103
        </Cite>
        ); set too high, it leaves no slack for activation spikes or allocator fragmentation. A KV
        size pinned with <code>--kv-cache-memory-bytes</code> also OOMs when the GPU starts with
        less free memory than the boot that logged it{' '}
        <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L586-L603')}>
          gpu_worker.py L586-L603
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        An OOM trace at load or capture, before any serving load. A profiled boot that gets through
        capture logs the measured split (weights, peak activation, CUDA graph memory) and a suggested{' '}
        <code>--kv-cache-memory=</code> value{' '}
        <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L933-L955')}>
          gpu_worker.py L933-L955
        </Cite>
        . A CUDA error whose trace ends in <code>entry.cudagraph.replay()</code> is inside a captured
        graph{' '}
        <Cite tier={1} href={vllmUrl('vllm/compilation/cuda_graph.py', 'L362')}>
          cuda_graph.py L362
        </Cite>
        ; the troubleshooting guide still names <code>self.graph.replay()</code> in{' '}
        <code>vllm/worker/model_runner.py</code>, a path the v0.31.0 tree does not have{' '}
        <Cite
          tier={1}
          href={vllmUrl('docs/usage/troubleshooting.md', 'L78-L81')}
          kind="doc-code-conflict"
        >
          troubleshooting.md L78-L81
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Lower <code>gpu_memory_utilization</code>; shrink the graph pool with{' '}
        <code>cudagraph_capture_sizes</code>; cut <code>max_model_len</code> or{' '}
        <code>max_num_seqs</code>; shard with <code>tensor_parallel_size</code>; or quantize{' '}
        <Cite tier={1} href={DOCS.conserveMemory}>
          vLLM docs: Conserving memory
        </Cite>
        . Rerun with <code>--enforce-eager</code> to find the failing op inside a graph, and boot
        with <code>--load-format dummy</code> to skip reading weights and isolate a load failure{' '}
        <Cite tier={1} href={DOCS.troubleshooting}>
          vLLM docs: Troubleshooting
        </Cite>
        .
      </Box>
    ),
  },
  {
    id: 'quant-hw',
    area: 'Quantization scheme unsupported on the GPU',
    grounding: 'pattern',
    symptom:
      'A quantized model that runs on one GPU generation fails to load, refuses the kernel, or falls back on another.',
    cause: (
      <Box variant="p">
        Quantization support depends on the GPU architecture as well as the method. The support
        matrix maps each scheme to architectures by SM (streaming multiprocessor) version, Volta 7.0
        through Hopper 9.0, and each method declares a minimum compute capability{' '}
        <Cite tier={1} href={DOCS.quantization}>
          vLLM docs: Quantization
        </Cite>{' '}
        (<strong>Section 8</strong>). The matrix at v0.31.0 stops at Hopper, so check the exact
        scheme on Blackwell yourself.
      </Box>
    ),
    detection: (
      <Box variant="p">
        A load-time error naming the quantization method or kernel, or a compute-capability check
        failing at startup, reproducible per GPU type and independent of load.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Before deploying, check your GPU&apos;s compute capability against the matrix and pick a
        scheme it supports (for example an FP8 path where INT8 W8A8 is not listed for that
        architecture). Pin the scheme per hardware tier rather than assuming portability across
        generations.
      </Box>
    ),
  },
  {
    id: 'lora-dynamic',
    area: 'Dynamic LoRA (low-rank adaptation) loading in production',
    grounding: 'cited',
    symptom:
      'Adapters added at runtime behave inconsistently across replicas, and an untrusted runtime load path is a security exposure.',
    cause: (
      <Box variant="p">
        <code>POST /v1/load_lora_adapter</code> exists only when{' '}
        <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code> is true (default off){' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/lora/api_router.py', 'L23-L36')}>
          lora/api_router.py L23-L36
        </Cite>
        , and the docs warn it &quot;should not be used in production unless it is an isolated,
        fully trusted environment&quot;{' '}
        <Cite tier={1} href={vllmUrl('docs/features/lora.md', 'L109-L110')}>
          lora.md L109-L110
        </Cite>
        . A runtime load lands only on the replica that served it (<strong>Section 13</strong>).
      </Box>
    ),
    detection: (
      <Box variant="p">
        The same adapter present on one replica and missing on another; intermittent &quot;adapter
        not found&quot; behind a load balancer. An enabled server logs &quot;LoRA dynamic loading
        &amp; unloading is enabled in the API server&quot; at startup: grep for it on user-facing
        replicas.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Register adapters statically with <code>--lora-modules</code> and treat the adapter set as
        part of the deployment artifact. Reserve <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code> for
        isolated, fully trusted lanes, and keep <code>load_lora_adapter</code> away from untrusted
        callers (<strong>Section 13</strong>).
      </Box>
    ),
  },
  {
    id: 'client-disconnect',
    area: 'Client disconnect and cancellation',
    grounding: 'cited',
    symptom:
      'The GPU keeps generating for callers that already left: wasted decode, inflated cost, and KV blocks held by abandoned requests during a spike.',
    cause: (
      <Box variant="p">
        vLLM aborts a request when its HTTP client disconnects: completion and chat routes race the
        handler against an <code>http.disconnect</code> listener{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/utils/api_utils.py', 'L36-L91')} kind="code">
          api_utils.py L36-L91
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/chat_completion/api_router.py', 'L41-L54')}>
          chat api_router.py L41-L54
        </Cite>
        , and a cancelled <code>generate()</code> aborts the engine request{' '}
        <Cite tier={1} href={vllmUrl(ASYNC_LLM, 'L744-L752')} kind="code">
          async_llm.py L744-L752
        </Cite>
        . Decode that continues after users leave therefore means the connection to vLLM is still
        open: a gateway, proxy or agent framework holds its upstream request after its own client
        left (<strong>Section 19</strong>).
      </Box>
    ),
    detection: (
      <Box variant="p">
        <code>vllm:num_requests_running</code> above the number of live clients, and KV pressure that
        stays up after callers leave. A direct disconnect drops both: vLLM&apos;s own test cancels
        requests and expects running, waiting and KV usage back at zero{' '}
        <Cite
          tier={1}
          href={vllmUrl('tests/entrypoints/serve/instrumentator/test_metrics.py', 'L309-L390')}
          kind="code"
        >
          test_metrics.py L309-L390
        </Cite>
        . Alarm on those gauges rather than on <code>vllm:request_success_total</code> with{' '}
        <code>finished_reason=&quot;abort&quot;</code>: a client abort drops the request&apos;s state
        before any finish is recorded, so it never increments that label{' '}
        <Cite tier={1} href={vllmUrl(OUT_PROC, 'L549-L579')} kind="code">
          output_processor.py L549-L579
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(OUT_PROC, 'L674-L679')}>
          L674-L679
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Give every hop in front of vLLM a client-side timeout that closes its upstream connection,
        cap <code>max_tokens</code> per request, and front the engine with a gateway that enforces
        timeouts and rate limits (<strong>Section 19</strong>).
      </Box>
    ),
  },
  {
    id: 'device-ids',
    area: 'GPU pinning with CUDA_VISIBLE_DEVICES',
    grounding: 'cited',
    symptom: (
      <>
        A replica restricted with <code>CUDA_VISIBLE_DEVICES</code> sees only its own GPUs, so
        GPU-to-NIC (network interface card) affinity loses the rest of the node; or{' '}
        <code>--device-ids</code> lands on different physical GPUs than its numbers suggest.
      </>
    ),
    cause: (
      <Box variant="p">
        <code>--device-ids</code> pins the engine to physical GPU IDs or UUIDs without setting{' '}
        <code>CUDA_VISIBLE_DEVICES</code>, keeping the full topology visible{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L1136-L1149')}>
          arg_utils.py L1136-L1149
        </Cite>
        . When <code>CUDA_VISIBLE_DEVICES</code> is also set, integer IDs index into it:{' '}
        <code>CUDA_VISIBLE_DEVICES=4,5,6,7</code> with <code>--device-ids 0,1</code> selects
        physical GPUs 4 and 5{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2083-L2102')}>
          arg_utils.py L2083-L2102
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        The GPUs <code>nvidia-smi</code> shows busy differ from the ones you meant. Under the Ray
        executor the startup log warns &quot;--device-ids has no effect when using the Ray
        executor&quot;{' '}
        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2064-L2071')}>
          arg_utils.py L2064-L2071
        </Cite>
        .
      </Box>
    ),
    fix: (
      <Box variant="p">
        Pin with <code>--device-ids</code> alone, by integer ID or by UUID (no duplicates, no mixing
        of the two), and select GPUs through Ray placement groups when Ray is the executor (
        <strong>14. Inside the Codebase &rarr; Execution &amp; Attention</strong>).
      </Box>
    ),
  },
  {
    id: 'env-cache',
    area: 'Environment variable changes that do nothing',
    grounding: 'cited',
    symptom: (
      <>
        A <code>VLLM_*</code> value written into the process environment after the engine started
        (by a plugin or your own code), or a variable carried over from an older release, changes
        nothing.
      </>
    ),
    cause: (
      <Box variant="p">
        Once the engine core and its workers start, each process caches every vLLM environment
        variable, so a later write to <code>os.environ</code> in that process has no effect{' '}
        <Cite tier={1} href={vllmUrl(ENVS, 'L2249-L2267')}>
          envs.py L2249-L2267
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L250-L252')}>
          core.py L250-L252
        </Cite>
        . A <code>VLLM_*</code> name the release does not define only produces the startup warning
        &quot;Unknown vLLM environment variable detected&quot;{' '}
        <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L1344-L1357')}>
          interface.py L1344-L1357
        </Cite>
        .
      </Box>
    ),
    detection: (
      <Box variant="p">
        That warning in the startup log after an upgrade; a running server that ignores a value set
        in-process after startup.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Set every variable before launch and restart to change one. Start with{' '}
        <code>--fail-on-environ-validation</code> to turn an unknown name into a startup error (
        <strong>14. Inside the Codebase &rarr; Configuration</strong>).
      </Box>
    ),
  },
  {
    id: 'litellm-supply-chain',
    area: 'Gateway-tier supply-chain risk (LiteLLM)',
    grounding: 'pattern',
    symptom:
      'A compromised dependency in the gateway in front of vLLM: the fault sits in the proxy tier, outside the engine.',
    cause: (
      <Box variant="p">
        The gateway is its own attack surface. The PyPI (Python Package Index) releases litellm
        1.82.7 and 1.82.8 were compromised and live for about 40 minutes on March 24, 2026; the
        official LiteLLM Proxy Docker image was not affected{' '}
        <Cite tier={1} href={LITELLM_ADVISORY}>
          LiteLLM security advisory (vendor)
        </Cite>{' '}
        (<strong>Section 19</strong>). That is a property of the gateway&apos;s dependency chain;
        infer nothing about vLLM&apos;s posture from it. Everything you put in front of the engine
        widens the blast radius.
      </Box>
    ),
    detection: (
      <Box variant="p">
        Vendor security advisories for the gateway; unexpected egress from the proxy process;
        dependency versions outside your pinned, vetted set.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Pin and verify gateway dependency versions, scan the proxy supply chain, isolate the gateway
        from secrets it does not need, and patch on advisory. Keep engine and gateway threat models
        separate (<strong>Section 19</strong>).
      </Box>
    ),
  },
];

interface SignalRow {
  name: string;
  metric: ReactNode;
  rule: ReactNode;
  src: ReactNode;
}

const GOLDEN_SIGNALS: SignalRow[] = [
  {
    name: 'Request queue depth',
    metric: <code>vllm:num_requests_waiting</code>,
    rule: (
      <>
        Sustained above zero with TTFT rising means under-capacity: the cleanest scale-out trigger.{' '}
        <code>vllm:num_requests_waiting_by_reason</code> with <code>reason=&quot;capacity&quot;</code>{' '}
        separates that from requests deferred by a LoRA budget or a KV transfer.
      </>
    ),
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L518-L548')}>
        loggers.py L518-L548
      </Cite>
    ),
  },
  {
    name: 'KV-cache pressure',
    metric: <code>vllm:kv_cache_usage_perc</code>,
    rule: 'Sustained near 1.0 precedes preemption and the throughput cliff. Alarm before it pins.',
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L576-L581')}>
        loggers.py L576-L581
      </Cite>
    ),
  },
  {
    name: 'Preemption rate',
    metric: <code>rate(vllm:num_preemptions_total)</code>,
    rule: 'Any sustained rate means memory is over-subscribed and the recompute is wasted work. A non-zero trend confirms the KV alarm; review it after the incident.',
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L676-L680')}>
        loggers.py L676-L680
      </Cite>
    ),
  },
  {
    name: 'TTFT (p99)',
    metric: <code>vllm:time_to_first_token_seconds</code>,
    rule: 'Alarm on the p99 quantile against the Section 2 SLO (service level objective), never the mean.',
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L821-L826')}>
        loggers.py L821-L826
      </Cite>
    ),
  },
  {
    name: 'ITL (p99)',
    metric: <code>vllm:inter_token_latency_seconds</code>,
    rule: 'Rising with a full batch means decode contention. Trade batch size for tail latency, or scale out.',
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L831-L836')}>
        loggers.py L831-L836
      </Cite>
    ),
  },
  {
    name: 'Output throughput',
    metric: <code>rate(vllm:generation_tokens_total)</code>,
    rule: 'Your true throughput SLI (service level indicator). A drop while the queue grows is the saturation knee from Section 20.',
    src: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L719-L723')}>
        loggers.py L719-L723
      </Cite>
    ),
  },
  {
    name: 'Admission rejections',
    metric: 'HTTP 503 rate at the load balancer',
    rule: (
      <>
        Admission control answers 503 once <code>--max-num-queued-reqs</code> or{' '}
        <code>--max-num-queued-tokens</code> is set and reached, and a search of{' '}
        <code>vllm/v1/metrics</code> found no counter for it. A sustained rate from healthy replicas
        means the fleet is short of replicas.
      </>
    ),
    src: (
      <Cite tier={1} href={vllmUrl('vllm/exceptions.py', 'L148-L175')} kind="code">
        exceptions.py L148-L175
      </Cite>
    ),
  },
];

export function OperationsFailureModes() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The few ways a vLLM deployment fails in production, the signal that catches each one, and the fastest way back after a restart (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            27. Operations &amp; Failure Modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Running vLLM in production comes down to a small number of recurring failure modes, and
            most of them trace to one fact: the KV (key-value) cache is a fixed budget (
            <strong>Section 5, Paged KV Cache &amp; Block Tables</strong>) that the scheduler (
            <strong>Section 4, Scheduler &amp; Continuous Batching</strong>) rations. When demand
            outruns that budget the engine degrades rather than erroring: throughput falls off a
            cliff, tail latency spikes, or a cold replica arrives too late to help. Each of those has
            a signal you can alarm on and a change that fixes it, and this section maps one to the
            other.
          </Box>
          <Box variant="p">
            Every row below reads <strong>SYMPTOM &rarr; CAUSE &rarr; DETECTION &rarr; FIX</strong>.
            Detection is a metric from <strong>Section 20</strong>, a specific log line or a startup
            error: if you cannot detect it, you cannot alarm on it. Rows tagged{' '}
            <Badge color="blue">cited</Badge> trace their cause and fix to vLLM source or
            documentation at v0.31.0, in the inline citations; rows tagged{' '}
            <Badge color="grey">pattern</Badge> are general operating practice that no single vLLM
            line promises.
          </Box>
          <Alert type="info">
            vLLM ships a minor release roughly every two weeks (nine between mid-June and early
            October 2026){' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/releases">
              vLLM releases
            </Cite>
            , and flag defaults, metric names and engine behavior move between them. The cited rows
            were checked against v0.31.0 (commit db9527a4) and its documentation on 2026-10-16;
            re-check them against the version you run.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the symptom you are seeing, then read the signal that confirms it and the change that fixes it"
          >
            Failure-mode lookup table
          </Header>
        }
      >
        <Table
          variant="embedded"
          columnDefinitions={[
            {
              id: 'area',
              header: 'Failure mode and symptom',
              cell: (e: FailureRow) => (
                <SpaceBetween size="xs">
                  <strong>{e.area}</strong>
                  <Badge color={e.grounding === 'cited' ? 'blue' : 'grey'}>{e.grounding}</Badge>
                  <div>{e.symptom}</div>
                </SpaceBetween>
              ),
              width: 240,
            },
            {
              id: 'cause',
              header: 'Cause',
              cell: (e: FailureRow) => e.cause,
              width: 330,
            },
            {
              id: 'detection',
              header: 'Detection',
              cell: (e: FailureRow) => e.detection,
              width: 330,
            },
            {
              id: 'fix',
              header: 'Fix',
              cell: (e: FailureRow) => e.fix,
              width: 320,
            },
          ]}
          items={ROWS}
          sortingDisabled
          wrapLines
          ariaLabels={{
            tableLabel: 'vLLM production failure modes: symptom, cause, detection, and fix',
          }}
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the fastest restart your deployment allows by knowing which startup phase each path removes and what it asks of the node"
          >
            Cold start and restart: what each path skips
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before it serves, a vLLM engine loads and processes the weights, compiles the model with{' '}
            <code>torch.compile</code> in a profiling run, measures memory to size the KV cache{' '}
            <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L538-L640')}>
              gpu_worker.py L538-L640
            </Cite>
            , and captures CUDA graphs{' '}
            <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L829-L883')}>
              L829-L883
            </Cite>
            . A cold boot pays for all four, and it must finish within{' '}
            <code>VLLM_ENGINE_READY_TIMEOUT_S</code>, 600 seconds by default{' '}
            <Cite tier={1} href={vllmUrl(ENVS, 'L808-L812')}>
              envs.py L808-L812
            </Cite>
            , or startup fails with
            an error that names slow weight loading as the usual cause{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L731-L742')}>
              core_client.py L731-L742
            </Cite>
            . vLLM offers four ways to skip part of that work on a restart, from a cache directory
            you keep to a daemon that holds weights over CUDA IPC (inter-process communication) and
            a process image captured with CRIU (Checkpoint/Restore In Userspace).
          </Box>
          <RestartLadderDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Each row changes only the cells it names relative to a cold boot; it shows
            which phase a path removes, not how long any phase takes. Illustrative, not measured.
          </Box>
          <Box variant="p">
            <strong>1. Cold boot.</strong> Keep weights on a local disk rather than a shared network
            filesystem, the troubleshooting guide&apos;s advice for a slow load{' '}
            <Cite tier={1} href={vllmUrl('docs/usage/troubleshooting.md', 'L13-L16')}>
              troubleshooting.md L13-L16
            </Cite>
            . A big model on slow storage can hit the 600-second ready timeout; raise{' '}
            <code>VLLM_ENGINE_READY_TIMEOUT_S</code> or move up a rung.
          </Box>
          <Box variant="p">
            <strong>2. Compile cache.</strong> vLLM writes compiled artifacts under{' '}
            <code>VLLM_CACHE_ROOT/torch_compile_cache</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/backends.py', 'L1063-L1065')}>
              backends.py L1063-L1065
            </Cite>
            , with <code>VLLM_CACHE_ROOT</code> defaulting to <code>~/.cache/vllm</code> unless{' '}
            <code>XDG_CACHE_HOME</code> is set{' '}
            <Cite tier={1} href={vllmUrl(ENVS, 'L707-L712')}>
              envs.py L707-L712
            </Cite>
            . Persist that directory on a volume or bake it into the image. A change to the model,
            config, relevant <code>VLLM_*</code> variables, torch build or GPU model invalidates it,
            and <code>VLLM_FORCE_AOT_LOAD=1</code> turns a silent recompile into a loud failure{' '}
            <Cite tier={1} href={vllmUrl('docs/configuration/optimization.md', 'L19-L25')}>
              optimization.md L19-L25
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>3. KV size passed back.</strong> A profiled boot logs the{' '}
            <code>--kv-cache-memory=</code> value that reproduces its allocation{' '}
            <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L933-L955')}>
              gpu_worker.py L933-L955
            </Cite>
            ; the log&apos;s spelling is an accepted prefix of <code>--kv-cache-memory-bytes</code> (
            <strong>Section 5</strong>). Passed back, it skips the memory measurement and the CUDA
            graph memory estimate, while a profiling run still executes because it compiles the
            model{' '}
            <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L584-L608')}>
              gpu_worker.py L584-L608
            </Cite>
            . The value holds only on the same GPU with the same free memory at start{' '}
            <Cite tier={1} href={DOCS.optimization}>
              vLLM docs: Optimization and tuning
            </Cite>
            . <code>VLLM_ENABLE_STARTUP_PLAN=1</code> automates the round trip: each worker saves the
            value under <code>VLLM_CACHE_ROOT/startup_plan/</code> and reapplies it only when the
            config and hardware fingerprint matches and free memory is at least the recorded
            baseline{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/startup_plan.py', 'L106-L191')}>
              startup_plan.py L106-L191
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>4. Weight cache daemon.</strong> <code>vllm preload</code> starts one daemon per
            GPU that loads its shard once, runs quantization post-processing, and holds the result in
            GPU memory{' '}
            <Cite tier={1} href={vllmUrl(WC_DAEMON, 'L253-L278')}>
              daemon.py L253-L278
            </Cite>
            . An engine started with <code>--load-format ipc_cache</code> builds the model without
            storage and maps the daemon&apos;s tensors over CUDA IPC, skipping the disk read and the
            quantization post-processing (only Python-side state is rebuilt){' '}
            <Cite tier={1} href={vllmUrl(IPC_LOADER, 'L184-L234')}>
              ipc_loader.py L184-L234
            </Cite>
            ; the daemon itself rejects pipeline parallelism{' '}
            <Cite tier={1} href={vllmUrl(WC_DAEMON, 'L471-L477')}>
              daemon.py L471-L477
            </Cite>
            . The preload docs claim this cuts restart time from minutes to seconds. They also set
            the terms: CUDA or ROCm only, daemon and engine on the same node as the same user, and the
            same vLLM version, model and parallel layout, or the engine falls back to a disk load. In
            the default <code>zero_copy</code> mode the engine shares the daemon&apos;s memory, so the
            daemon must outlive the engine, and the docs warn against combining it with sleep mode{' '}
            <Cite tier={1} href={DOCS.preload}>
              vLLM docs: Preload
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>5. Initialized snapshot.</strong> <code>vllm snapshot create</code> boots the
            engine, records a one-token canary, and has CRIU capture the initialized process tree and
            its CUDA state; <code>vllm snapshot restore</code> brings the tree back, reloads the model
            files and KV cache, and returns only after the canary matches{' '}
            <Cite tier={1} href={vllmUrl('vllm/snapshot/controller.py', 'L96-L120')}>
              snapshot/controller.py L96-L120
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/snapshot/server.py', 'L92-L101')}>
              server.py L92-L101
            </Cite>
            . <code>create</code> refuses anything but a remote model pinned to a 40-character
            revision, every parallel size at 1, one unauthenticated plaintext HTTP server, and Linux on
            x86-64{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/snapshot.py', 'L19-L69')}>
              snapshot.py L19-L69
            </Cite>
            . The docs add one NVIDIA GPU, root or passwordless sudo for CRIU, io_uring disabled, and
            restore on the same host with the same driver, kernel and vLLM install, and they mark the
            feature experimental{' '}
            <Cite tier={1} href={DOCS.snapshots}>
              vLLM docs: Initialized engine snapshots
            </Cite>
            . It reactivates one model on one machine; a replica on a new node needs one of the other
            rungs.
          </Box>
          <ExpandableSection headerText="Confirm the fast path ran, and the two adjacent tools">
            <SpaceBetween size="s">
              <Box variant="p">
                A restart can fall back silently. An <code>ipc_cache</code> engine logs &quot;Mapped N
                tensors from the weight cache daemon&quot; when the fast path ran, and &quot;Weight
                cache unusable (...); falling back to disk loading&quot; when the daemon was absent or
                its fingerprint did not match, which means the restart paid the full disk load{' '}
                <Cite tier={1} href={vllmUrl(IPC_LOADER, 'L159-L233')}>
                  ipc_loader.py L159-L233
                </Cite>
                . A startup plan logs &quot;Applying persisted startup plan&quot; when it skips
                profiling{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/startup_plan.py', 'L153-L164')}>
                  startup_plan.py L153-L164
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>For development loops,</strong> <code>--enforce-eager</code> sets compilation
                and CUDA graphs to none{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1694-L1696')}>
                  vllm.py L1694-L1696
                </Cite>
                , the fastest boot at a cost in steady-state decode speed, and a quick way to measure
                how much of a boot is compile and capture{' '}
                <Cite tier={1} href={vllmUrl('docs/configuration/optimization.md', 'L25')}>
                  optimization.md L25
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>To free a GPU without a restart,</strong> sleep mode offloads or discards the
                weights and KV cache inside a live process and wakes it later{' '}
                <Cite tier={1} href={DOCS.sleepMode}>
                  vLLM docs: Sleep mode
                </Cite>
                . It needs <code>--enable-sleep-mode</code>, and its HTTP endpoints exist only with{' '}
                <code>VLLM_SERVER_DEV_MODE=1</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}>
                  routers.py L34-L37
                </Cite>
                , which turns on development endpoints the docs say should not be exposed to users.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>To get it right:</strong> measure your cold boot first, against the 600-second
            ready timeout. On every production restart, persist <code>VLLM_CACHE_ROOT</code> and pass
            back the logged KV size; add <code>vllm preload</code> where engines restart on the same
            node; keep snapshots for single-GPU reactivation on one host. Probe readiness on{' '}
            <code>/health</code>, which answers 200 while the engine responds and 503 once the engine
            core has died{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/instrumentator/health.py', 'L22-L33')}>
              health.py L22-L33
            </Cite>
            , and set the autoscaler&apos;s scale-up lead time from the boot you measured.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Seven signals worth a pager, and which of them give you runway before latency targets break"
          >
            Golden signals to alarm on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These are the few <strong>Section 20</strong> metrics worth a pager. They are leading
            indicators: the scheduler internals (<strong>Section 4</strong>) move <em>before</em> the
            latency histograms break, so a KV or queue alarm gives you runway the latency alarm does
            not.
          </Box>
          <Table
            variant="embedded"
            columnDefinitions={[
              {
                id: 'name',
                header: 'Signal',
                cell: (e: SignalRow) => <strong>{e.name}</strong>,
                width: 170,
              },
              {
                id: 'metric',
                header: 'Metric / query',
                cell: (e: SignalRow) => e.metric,
                width: 260,
              },
              {
                id: 'rule',
                header: 'Alarm rule',
                cell: (e: SignalRow) => e.rule,
              },
              {
                id: 'src',
                header: 'Source',
                cell: (e: SignalRow) => e.src,
                width: 200,
              },
            ]}
            items={GOLDEN_SIGNALS}
            sortingDisabled
            wrapLines
            ariaLabels={{ tableLabel: 'Golden signals to alarm on for a vLLM deployment' }}
          />
          <Alert type="info">
            Order of escalation: KV pressure and queue depth are your <em>early warnings</em>; the p99
            latency histograms are the <em>SLO breach</em>; the preemption counter is the{' '}
            <em>confirmation</em> that you crossed the capacity line. Alarm on the first, page on the
            second, post-mortem on the third.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Capacity planning: budgeting the KV-cache memory that decides everything"
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Nearly every row in the table is the same scarce resource showing a different face, so
            plan it explicitly. After weights, activations and the CUDA graph pool are subtracted
            from HBM (high-bandwidth memory), what remains is the KV-cache budget, and that budget
            divided by the per-request KV cost is your real concurrency ceiling. vLLM prints that
            ceiling at startup:{' '}
            <code>
              GPU KV cache size: N tokens, Maximum concurrency for M tokens per request: X.XXx
            </code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L2455-L2471')}>
              kv_cache_utils.py L2455-L2471
            </Cite>
            , where M is <code>max_model_len</code> (<strong>Section 5</strong>).
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The budget, top-down</Box>
              <ul>
                <li>
                  <strong>Total HBM</strong> per GPU is the ceiling.{' '}
                  <code>gpu_memory_utilization</code> (default 0.92) is the share this instance
                  claims for weights, activations, the CUDA graph estimate and the KV cache together{' '}
                  <Cite tier={1} href={vllmUrl(GPU_WORKER, 'L667-L677')}>
                    gpu_worker.py L667-L677
                  </Cite>
                  ; the rest stays outside vLLM&apos;s budget.
                </li>
                <li>
                  <strong>Subtract the static footprint:</strong> model weights (shrinkable with
                  quantization or <code>tensor_parallel_size</code>) plus the CUDA graph pool (
                  <code>cudagraph_capture_sizes</code>, or zero it with <code>enforce_eager</code>){' '}
                  <Cite tier={1} href={DOCS.conserveMemory}>
                    vLLM docs: Conserving memory
                  </Cite>
                  . The startup log prints the measured split.
                </li>
                <li>
                  <strong>What is left is the KV budget.</strong> Sharding with{' '}
                  <code>tensor_parallel_size</code> frees per-GPU HBM for KV, which makes it a memory
                  lever as well as a throughput one.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">The per-request cost, bottom-up</Box>
              <ul>
                <li>
                  A request&apos;s KV cost grows with its sequence length, up to{' '}
                  <code>max_model_len</code>, and blocks are allocated as tokens arrive (
                  <strong>Section 5</strong>).
                </li>
                <li>
                  <strong>Concurrency ceiling</strong> &asymp; KV budget &divide; average per-request
                  KV cost. Push past it and the scheduler preempts: the first row of the table.
                </li>
                <li>
                  Levers that buy concurrency: lower <code>max_model_len</code>, cap{' '}
                  <code>max_num_seqs</code>, quantize the KV cache, or offload to the tiers in{' '}
                  <strong>Section 7</strong>. Each trades something: reach, batch size, quality or
                  latency.
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            Leave headroom on purpose. Running <code>gpu_memory_utilization</code> at the edge to win
            a benchmark is exactly the config that OOMs at startup after an upgrade changes the model
            runner or a GPU-tiered batch default (Model Runner V2 has been the default since v0.29.0{' '}
            <Cite tier={1} href={RELEASE_029}>
              vLLM v0.29.0 release notes
            </Cite>
            , and <code>vllm serve</code> picks its batch limits by GPU memory{' '}
            <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')}>
              arg_utils.py L2858-L2887
            </Cite>
            ), or that preempts under a real traffic spike. Validate the budget with a Section 20
            benchmark sweep, then set the operating point <em>below</em> the knee.
          </Alert>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
