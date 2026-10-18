import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../../components/Cite';

const CONFIG_TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/config';
const ARG_UTILS = 'vllm/engine/arg_utils.py';
const VLLM_PY = 'vllm/config/vllm.py';
const SCHED_PY = 'vllm/config/scheduler.py';
const CACHE_PY = 'vllm/config/cache.py';
const CLI_ARGS = 'vllm/entrypoints/launchers/cli_args.py';
const ENVS_PY = 'vllm/envs.py';

/** Shorthand for a tier-1 citation into the vLLM tree at the pinned tag. */
function Src({ path, lines, label }: { path: string; lines?: string; label?: string }) {
  const text = label ?? `${path.split('/').pop()}${lines ? ` ${lines}` : ''}`;
  return (
    <Cite tier={1} href={vllmUrl(path, lines)}>
      {text}
    </Cite>
  );
}

// ---------------------------------------------------------------------------
// Sub-config inventory
// ---------------------------------------------------------------------------

type Presence = 'always' | 'optional' | 'mixed';

interface SubConfigRow {
  name: string;
  path: string;
  lines: string;
  governs: ReactNode;
  presence: Presence;
}

const subConfigRows: SubConfigRow[] = [
  {
    name: 'ModelConfig',
    path: 'vllm/config/model.py',
    lines: 'L126-L232',
    governs:
      'Model identity and shape: Hugging Face (HF) model path, dtype, max_model_len, tokenizer, trust_remote_code, quantization, multimodal limits. The anchor: the other sub-configs validate against it.',
    presence: 'always',
  },
  {
    name: 'CacheConfig',
    path: CACHE_PY,
    lines: 'L71-L142',
    governs:
      'KV-cache (key-value cache) memory and paging: gpu_memory_utilization, block_size, cache_dtype, enable_prefix_caching, num_gpu_blocks_override.',
    presence: 'always',
  },
  {
    name: 'ParallelConfig',
    path: 'vllm/config/parallel.py',
    lines: 'L127-L260',
    governs:
      'Distributed execution layout: tensor_parallel_size, pipeline_parallel_size, data_parallel_size, enable_expert_parallel, distributed_executor_backend.',
    presence: 'always',
  },
  {
    name: 'SchedulerConfig',
    path: SCHED_PY,
    lines: 'L29-L206',
    governs:
      'Continuous-batching policy: max_num_batched_tokens, max_num_seqs, max_num_active_seqs, chunked prefill, scheduling policy (first-come first-served or priority), the KV watermark, and the API-server admission caps max_num_queued_reqs and max_num_queued_tokens.',
    presence: 'always',
  },
  {
    name: 'LoadConfig',
    path: 'vllm/config/load.py',
    lines: 'L30-L102',
    governs:
      'How weights get onto the device: load_format (auto, safetensors, sharded_state, runai_streamer, and ipc_cache, which maps weights a vllm preload daemon already holds on the GPU), download_dir, ignore_patterns.',
    presence: 'always',
  },
  {
    name: 'DeviceConfig',
    path: 'vllm/config/device.py',
    lines: 'L13',
    governs:
      'Target device type (auto, cuda, cpu, tpu, xpu). Resolved from the active platform before the rest of the config is built.',
    presence: 'always',
  },
  {
    name: 'CompilationConfig',
    path: 'vllm/config/compilation.py',
    lines: 'L37-L48',
    governs:
      'torch.compile and CUDA-graph capture: CompilationMode (NONE, STOCK_TORCH_COMPILE, DYNAMO_TRACE_ONCE, VLLM_COMPILE), cudagraph_capture_sizes, custom-op enable lists.',
    presence: 'always',
  },
  {
    name: 'StructuredOutputsConfig',
    path: 'vllm/config/structured_outputs.py',
    lines: 'L12-L14',
    governs:
      'Constrained (grammar) decoding: backend selection (auto, xgrammar, guidance, outlines, lm-format-enforcer) for JSON-schema and regex output.',
    presence: 'always',
  },
  {
    name: 'ObservabilityConfig',
    path: 'vllm/config/observability.py',
    lines: 'L21-L48',
    governs:
      'Metrics and tracing: OTLP (OpenTelemetry Protocol) trace endpoint, detailed per-request trace collection, hidden-metric version gating.',
    presence: 'always',
  },
  {
    name: 'LoRAConfig',
    path: 'vllm/config/lora.py',
    lines: 'L27-L47',
    governs:
      'Multi-LoRA (Low-Rank Adaptation) serving: max_lora_rank (16), max_loras (1), max_cpu_loras, adapter dtype. Present only when LoRA is enabled.',
    presence: 'optional',
  },
  {
    name: 'SpeculativeConfig',
    path: 'vllm/config/speculative.py',
    lines: 'L68-L86',
    governs:
      'Speculative decoding: draft method (n-gram, EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) and EAGLE-3, MTP (multi-token prediction), DFlash, DSpark, Medusa, draft model, suffix), num_speculative_tokens, rejection_sample_method (standard, synthetic, block). Present only when speculation is requested.',
    presence: 'optional',
  },
  {
    name: 'KVTransferConfig',
    path: 'vllm/config/kv_transfer.py',
    lines: 'L60-L103',
    governs:
      'Cross-instance KV movement: kv_connector and producer/consumer role for prefill/decode disaggregation. Present only for disaggregated serving.',
    presence: 'optional',
  },
  {
    name: 'KVEventsConfig',
    path: 'vllm/config/kv_events.py',
    lines: 'L14-L45',
    governs:
      'KV-cache event publishing (block-level create and evict events) for external cache-aware routers. Present only when enabled.',
    presence: 'optional',
  },
  {
    name: 'Seven smaller families',
    path: VLLM_PY,
    lines: 'L363-L455',
    governs:
      'LoggingConfig (log level, dictConfig file), AuxOutputConfig (return routed experts), EncoderCacheManagerConfig (custom encoder-cache manager class) and FaultToleranceConfig (engine recovery timeout, nested in ParallelConfig) are always built. WatermarkConfig (output watermarking), EngramConfig (n-gram embedding storage) and DiffusionConfig (diffusion LLM canvas and denoising steps) appear only when requested.',
    presence: 'mixed',
  },
];

const presenceBadge: Record<Presence, ReactNode> = {
  always: <Badge color="blue">always</Badge>,
  optional: <Badge color="grey">optional</Badge>,
  mixed: <Badge color="severity-neutral">mixed</Badge>,
};

// ---------------------------------------------------------------------------
// Batch-limit defaults for `vllm serve`, from get_batch_defaults()
// ---------------------------------------------------------------------------

interface BatchTierRow {
  tier: string;
  tokens: string;
  seqs: string;
  examples: string;
}

const batchTierRows: BatchTierRow[] = [
  { tier: 'At least 160 GiB', tokens: '16384', seqs: '1024', examples: 'B200, B300' },
  { tier: 'At least 70 GiB, not an A100', tokens: '8192', seqs: '1024', examples: 'H100, H200' },
  { tier: 'Any other GPU', tokens: '2048', seqs: '256', examples: 'A100, at any memory size' },
];

// ---------------------------------------------------------------------------
// The knob table
// ---------------------------------------------------------------------------

interface KnobRow {
  flag: string;
  writes: string;
  def: string;
  effect: ReactNode;
  src: ReactNode;
}

const knobRows: KnobRow[] = [
  {
    flag: '--gpu-memory-utilization',
    writes: 'CacheConfig.gpu_memory_utilization',
    def: '0.92',
    effect:
      'Fraction of GPU memory the instance may claim; the residual after weights becomes KV-cache blocks.',
    src: <Src path={CACHE_PY} lines="L103" />,
  },
  {
    flag: '--max-num-batched-tokens',
    writes: 'SchedulerConfig.max_num_batched_tokens',
    def: 'auto: 16384, 8192 or 2048',
    effect:
      'Token budget per scheduler step, set by GPU memory when left unset. Larger favors prefill throughput; smaller favors decode latency.',
    src: <Src path={ARG_UTILS} lines="L2829-L2920" />,
  },
  {
    flag: '--max-num-seqs',
    writes: 'SchedulerConfig.max_num_seqs',
    def: 'auto: 1024 or 256',
    effect:
      'Most sequences in one step. It also sizes the model runner slots and the CUDA-graph capture range.',
    src: (
      <>
        <Src path={ARG_UTILS} lines="L2858-L2887" /> <Src path={VLLM_PY} lines="L2457-L2460" />
      </>
    ),
  },
  {
    flag: '--max-num-active-seqs',
    writes: 'SchedulerConfig.max_num_active_seqs',
    def: 'None (= max_num_seqs)',
    effect:
      'Caps how many requests may be RUNNING. Unlike max_num_seqs, it leaves runner slots and CUDA-graph capture sizes unchanged, so decode batches shrink without changing what is captured at startup. Must not exceed max_num_seqs.',
    src: (
      <>
        <Src path={SCHED_PY} lines="L337-L343" />{' '}
        <Src path="vllm/v1/core/sched/scheduler.py" lines="L124-L130" label="v1 scheduler.py L124-L130" />
      </>
    ),
  },
  {
    flag: '--max-num-queued-reqs, --max-num-queued-tokens',
    writes: 'SchedulerConfig.max_num_queued_reqs, max_num_queued_tokens',
    def: 'None (unbounded)',
    effect:
      'Admission control in the API server. Past the cap on in-flight requests, or on prompt tokens still in prefill, a new request gets HTTP 503 so a load balancer can retry it on another instance. The request count is shared across API-server processes.',
    src: (
      <>
        <Src path="vllm/v1/engine/async_llm.py" lines="L309-L364" />{' '}
        <Src path="vllm/v1/engine/admission_control.py" lines="L13-L18" />{' '}
        <Src path="vllm/exceptions.py" lines="L148-L174" />
      </>
    ),
  },
  {
    flag: '--watermark',
    writes: 'SchedulerConfig.watermark',
    def: '0.0',
    effect:
      'Fraction of KV-cache blocks kept free when admitting waiting or preempted requests, leaving headroom for running requests to grow.',
    src: (
      <>
        <Src path={SCHED_PY} lines="L197" />{' '}
        <Src path="vllm/v1/core/kv_cache_manager.py" lines="L506-L534" />
      </>
    ),
  },
  {
    flag: '--block-size',
    writes: 'CacheConfig.block_size',
    def: '16, unless the backend needs another',
    effect:
      'KV-cache block size in tokens. Left unset, vLLM picks the smallest size every selected attention backend supports (and aligns hybrid Mamba models), logging "Setting kv cache block size to N" when that differs from 16.',
    src: (
      <>
        <Src path={CACHE_PY} lines="L71-L73" />{' '}
        <Src path="vllm/platforms/interface.py" lines="L616-L695" />
      </>
    ),
  },
  {
    flag: '--kv-cache-dtype',
    writes: 'CacheConfig.cache_dtype',
    def: '"auto"',
    effect:
      '"auto" follows model dtype; fp8 / fp8_e5m2 roughly halve KV-cache bytes, raising the batch ceiling.',
    src: <Src path={CACHE_PY} lines="L39-L123" />,
  },
  {
    flag: '--tensor-parallel-size',
    writes: 'ParallelConfig.tensor_parallel_size',
    def: '1',
    effect:
      'Intra-layer shard count across GPUs. Cross-validated against pipeline size and head counts.',
    src: <Src path="vllm/config/parallel.py" lines="L129" />,
  },
  {
    flag: '--device-ids',
    writes: 'ParallelConfig.assigned_physical_gpu_ids',
    def: 'None (all visible GPUs)',
    effect:
      'Pins the engine to physical GPU IDs or UUIDs without setting CUDA_VISIBLE_DEVICES. Integer IDs index into CUDA_VISIBLE_DEVICES when it is set. The Ray executor ignores it, with a warning.',
    src: (
      <>
        <Src path={ARG_UTILS} lines="L2064-L2102" /> <Src path="vllm/config/parallel.py" lines="L325" />
      </>
    ),
  },
  {
    flag: '-O, --optimization-level',
    writes: 'VllmConfig.optimization_level',
    def: 'O2',
    effect:
      'Startup time against runtime. O0 skips compilation and CUDA graphs; O1 adds torch.compile with piecewise CUDA graphs; O2 adds full CUDA graphs; O3 applies exactly the O2 settings.',
    src: (
      <>
        <Src path={VLLM_PY} lines="L129-L141" /> <Src path={VLLM_PY} lines="L300-L345" />
      </>
    ),
  },
  {
    flag: '--performance-mode',
    writes: 'VllmConfig.performance_mode',
    def: 'balanced',
    effect:
      'throughput doubles any batch limit left unset; interactivity captures a CUDA graph for every batch size from 1 to 32. The --help text also describes kernel choices; a search of vllm/ at v0.31.0 found no other code that acts on the field.',
    src: (
      <>
        <Src path={ARG_UTILS} lines="L3064-L3069" /> <Src path={VLLM_PY} lines="L2563-L2567" />{' '}
        <Cite tier={1} href={vllmUrl(VLLM_PY, 'L448-L453')} kind="doc-code-conflict">
          --help text: vllm.py L448-L453
        </Cite>
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Where the effective config shows up on a running server
// ---------------------------------------------------------------------------

interface ReadRow {
  where: string;
  shows: string;
  src: ReactNode;
}

const readRows: ReadRow[] = [
  {
    where: 'Startup log: non-default args: {...}',
    shows:
      'Every flag, engine or server, that differs from its parser default, with secrets redacted. Values vLLM resolved for you do not appear.',
    src: <Src path="vllm/entrypoints/serve/utils/api_utils.py" lines="L208-L286" />,
  },
  {
    where: 'Startup log: Initializing a V1 LLM engine (v0.31.0) with config: ...',
    shows:
      'Model, dtype, max_seq_len, parallel sizes, kv_cache_dtype, prefix caching, chunked prefill and the full compilation config. It omits max_num_seqs, max_num_batched_tokens, gpu_memory_utilization and block_size.',
    src: (
      <>
        <Src path="vllm/v1/engine/core.py" lines="L128-L133" /> <Src path={VLLM_PY} lines="L2840-L2875" />
      </>
    ),
  },
  {
    where: '/metrics: vllm:cache_config_info',
    shows:
      'Every CacheConfig field as a label, including the block size and block count the engine reports back after the attention backend has chosen.',
    src: (
      <>
        <Src path="vllm/v1/metrics/loggers.py" lines="L1003-L1029" />{' '}
        <Src path="vllm/v1/engine/core_client.py" lines="L821-L852" />
      </>
    ),
  },
  {
    where: 'GET /server_info?config_format=json',
    shows:
      'The full VllmConfig, scheduler limits included, plus the VLLM_* values the API server sees. It exists only with VLLM_SERVER_DEV_MODE=1, which also mounts development endpoints and logs a security warning: keep it off production.',
    src: (
      <>
        <Src path="vllm/entrypoints/serve/dev/server_info/api_router.py" lines="L43-L59" />{' '}
        <Src path="vllm/entrypoints/launchers/api_server/routers.py" lines="L33-L37" />{' '}
        <Src path="vllm/entrypoints/serve/__init__.py" lines="L43-L47" label="serve/__init__.py L43-L47" />
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Diagram: one command line, two planes. Engine flags flow through EngineArgs
// and create_engine_config() into VllmConfig; server flags land in FrontendArgs
// and stay with the API server.
// ---------------------------------------------------------------------------

function ConfigFlowDiagram() {
  const W = 900;
  const H = 290;
  const font = 'sans-serif';
  const blue = '#0972d3';
  const blueDark = '#065299';
  const blueTint = '#f2f8fd';
  const ink = '#0f1b2a';
  const grey = '#5f6b7a';
  const teal = '#1f7a70';
  const tealTint = '#e6f4f2';
  const amber = '#8b6c00';
  const amberTint = '#fbf3d5';

  const rowY = 40;
  const boxH = 76;
  const engine = [
    { x: 16, w: 136, label: 'CLI flags', sub: ['vllm serve args', 'or --config YAML'] },
    { x: 176, w: 140, label: 'EngineArgs', sub: ['flat dataclass,', 'defaults live here'] },
    { x: 340, w: 182, label: 'create_engine_config()', sub: ['fills auto defaults,', 'builds sub-configs'] },
    { x: 546, w: 176, label: 'VllmConfig', sub: ['__post_init__ validates,', 'platform adjusts'] },
    { x: 746, w: 138, label: 'subsystems', sub: ['engine, workers,', 'custom ops'] },
  ];

  const row2Y = 198;
  const server = [
    {
      x: 16,
      w: 208,
      label: 'FrontendArgs',
      sub: ['server-only flags', 'launchers/cli_args.py'],
      stroke: teal,
      fill: tealTint,
      dash: undefined as string | undefined,
    },
    {
      x: 250,
      w: 300,
      label: 'API server process',
      sub: ['--api-key, CORS, TLS, --enable-scale-out', '--trust-request-mm-kwargs'],
      stroke: teal,
      fill: tealTint,
      dash: undefined as string | undefined,
    },
    {
      x: 576,
      w: 308,
      label: 'No VllmConfig field',
      sub: ['read from the argparse namespace,', 'so a config dump never shows them'],
      stroke: amber,
      fill: amberTint,
      dash: '5 4',
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="cfg-flow-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="cfg-flow-title">
          vllm serve parses one command line into two planes. Engine flags become EngineArgs, which
          create_engine_config turns into typed sub-configs while filling hardware-dependent defaults;
          VllmConfig validates them, lets the platform adjust them, and feeds every engine subsystem.
          Server flags land in FrontendArgs and are read only by the API server, so they never appear
          in VllmConfig.
        </title>
        <defs>
          <marker
            id="cfg-flow-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={grey} />
          </marker>
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={16} y={26} fontSize={12} fontWeight={700} fill={blueDark} fontFamily={font}>
          Engine plane: flags that become VllmConfig fields
        </text>

        {engine.map((s, i) => {
          const solid = i === 3;
          const cx = s.x + s.w / 2;
          return (
            <g key={s.label}>
              <rect
                x={s.x}
                y={rowY}
                width={s.w}
                height={boxH}
                rx={8}
                fill={solid ? blue : blueTint}
                stroke={solid ? blueDark : blue}
                strokeWidth={solid ? 2 : 1.2}
              />
              <text
                x={cx}
                y={rowY + 26}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={solid ? '#ffffff' : ink}
                fontFamily={font}
              >
                {s.label}
              </text>
              {s.sub.map((line, j) => (
                <text
                  key={line}
                  x={cx}
                  y={rowY + 46 + j * 16}
                  textAnchor="middle"
                  fontSize={12}
                  fill={solid ? '#ffffff' : grey}
                  fontFamily={font}
                >
                  {line}
                </text>
              ))}
              {i < engine.length - 1 && (
                <line
                  x1={s.x + s.w + 2}
                  y1={rowY + boxH / 2}
                  x2={engine[i + 1].x - 3}
                  y2={rowY + boxH / 2}
                  stroke={grey}
                  strokeWidth={1.5}
                  markerEnd="url(#cfg-flow-ah)"
                />
              )}
            </g>
          );
        })}

        <text x={349} y={138} textAnchor="middle" fontSize={12} fill={grey} fontFamily={font}>
          vllm/engine/arg_utils.py
        </text>
        <text x={634} y={138} textAnchor="middle" fontSize={12} fill={grey} fontFamily={font}>
          vllm/config/vllm.py
        </text>

        <line
          x1={120}
          y1={rowY + boxH + 2}
          x2={120}
          y2={row2Y - 3}
          stroke={teal}
          strokeWidth={1.5}
          markerEnd="url(#cfg-flow-ah)"
        />
        <text x={136} y={184} fontSize={12} fontWeight={700} fill={teal} fontFamily={font}>
          Server plane: flags only the API server reads
        </text>

        {server.map((s, i) => {
          const cx = s.x + s.w / 2;
          return (
            <g key={s.label}>
              <rect
                x={s.x}
                y={row2Y}
                width={s.w}
                height={boxH}
                rx={8}
                fill={s.fill}
                stroke={s.stroke}
                strokeWidth={1.2}
                strokeDasharray={s.dash}
              />
              <text
                x={cx}
                y={row2Y + 26}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={i === 2 ? amber : ink}
                fontFamily={font}
              >
                {s.label}
              </text>
              {s.sub.map((line, j) => (
                <text
                  key={line}
                  x={cx}
                  y={row2Y + 46 + j * 16}
                  textAnchor="middle"
                  fontSize={12}
                  fill={grey}
                  fontFamily={font}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        <line
          x1={226}
          y1={row2Y + boxH / 2}
          x2={247}
          y2={row2Y + boxH / 2}
          stroke={grey}
          strokeWidth={1.5}
          markerEnd="url(#cfg-flow-ah)"
        />
        <line
          x1={552}
          y1={row2Y + boxH / 2}
          x2={574}
          y2={row2Y + boxH / 2}
          stroke={amber}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
}

export function CodebaseConfig() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How one command line becomes the validated object every subsystem reads, and how to see the values a running server actually chose (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Configuration system
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              vLLM funnels every engine input (CLI flags, a <code>--config</code> YAML file, Python
              keyword arguments) into one validated object, <code>VllmConfig</code>, that the engine,
              the workers and the model code all read.
            </strong>{' '}
            Each sub-config is validated as it is built; <code>VllmConfig.__post_init__</code> then checks
            the rules that span them and lets the platform adjust the result{' '}
            <Src path={VLLM_PY} lines="L2030" />, so the object is validated once and stays mutable.
          </Box>
          <Box variant="p">
            The flat user-facing surface is <code>EngineArgs</code> / <code>AsyncEngineArgs</code> in{' '}
            <code>vllm/engine/arg_utils.py</code> (about 3,200 lines, our count over{' '}
            <Src path={ARG_UTILS} label="arg_utils.py" />).{' '}
            <code>create_engine_config()</code> translates it into the typed sub-configs and fills the
            defaults that depend on the hardware, the batch limits among them. The split lets flag names
            and defaults change in one place while every consumer keeps reading the same typed fields.
            Nothing in the engine reads raw argparse values; the API server does, for its own flags (
            <code>--api-key</code>, <code>--enable-scale-out</code> and the rest), which form a separate{' '}
            <code>FrontendArgs</code> plane that never enters <code>VllmConfig</code>.
          </Box>
          <Box variant="small" color="text-body-secondary">
            Verified against{' '}
            <Cite tier={1} href={CONFIG_TREE}>
              vllm-project/vllm vllm/config @ v0.31.0 (commit db9527a4)
            </Cite>
            : 36 files in <code>vllm/config/</code> (our count), plus <code>vllm/engine/arg_utils.py</code>,{' '}
            <code>vllm/envs.py</code> and <code>vllm/entrypoints/launchers/cli_args.py</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where each value gets decided, so you know which layer to check when the running value differs from the flag you typed"
          >
            From CLI flag to live config
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>vllm serve</code> registers <code>FrontendArgs</code> and <code>AsyncEngineArgs</code>{' '}
            on one argument parser <Src path={CLI_ARGS} lines="L451-L452" />, so a single command line
            splits into two planes. A <code>--config</code> YAML file is expanded into ordinary
            command-line arguments before parsing{' '}
            <Src path="vllm/utils/argparse_utils.py" lines="L329-L330" />. Every engine flag then
            travels the same path: there is one place the typed object is built (
            <code>create_engine_config()</code>) and one place cross-field consistency is enforced (<code>VllmConfig.__post_init__</code>){' '}
            <Src path={ARG_UTILS} lines="L2148-L2164" /> <Src path={VLLM_PY} lines="L1405" />.
          </Box>
          <ConfigFlowDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Labels come from the code cited on this page. Illustrative, not measured.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">EngineArgs (the surface)</Box>
              <Box variant="p">
                A flat standard-library dataclass <Src path={ARG_UTILS} lines="L463-L464" />; pydantic
                validation happens when the sub-configs are built from it. <code>add_cli_args()</code>{' '}
                registers every flag and <code>from_cli_args()</code> hydrates it from an argparse
                namespace <Src path={ARG_UTILS} lines="L919" /> <Src path={ARG_UTILS} lines="L1898" />.{' '}
                <code>AsyncEngineArgs</code> subclasses it for the server, adding{' '}
                <code>enable_log_requests</code> <Src path={ARG_UTILS} lines="L3124-L3128" />. Most fields
                default to the matching sub-config value; the batch limits default to <code>None</code>{' '}
                so they can be filled per GPU <Src path={ARG_UTILS} lines="L588-L599" />.
              </Box>
            </div>
            <div>
              <Box variant="h3">VllmConfig (the truth)</Box>
              <Box variant="p">
                <code>create_engine_config()</code> calls per-subsystem builders (
                <code>create_model_config()</code>, <code>create_load_config()</code>, ...), then passes
                the typed sub-configs into one <code>VllmConfig(...)</code> call{' '}
                <Src path={ARG_UTILS} lines="L2773" />. The object then travels to the engine, workers and
                model code, and no subsystem re-parses user input. The platform hook{' '}
                <code>check_and_update_config()</code> may still rewrite fields during{' '}
                <code>__post_init__</code>.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            The sub-config classes are pydantic dataclasses built by the shared <code>@config</code>{' '}
            decorator in <code>vllm/config/utils.py</code>, which sets{' '}
            <code>extra=&quot;forbid&quot;</code>{' '}
            <Src path="vllm/config/utils.py" lines="L71" label="config/utils.py L71" />. A
            typo&apos;d field is a validation error at construction, not a silently ignored keyword
            argument.
          </Alert>
          <ExpandableSection headerText="Deep dive: how create_engine_config() assembles VllmConfig">
            <SpaceBetween size="m">
              <Box variant="p">
                <code>create_engine_config()</code> runs in a fixed order, because later sub-configs
                depend on earlier ones:
              </Box>
              <ColumnLayout columns={1} borders="horizontal">
                <Box variant="p">
                  <strong>1. Configure logging.</strong> <code>create_logging_config()</code> builds{' '}
                  <code>LoggingConfig</code> from <code>--log-level</code> and{' '}
                  <code>--logging-config</code> and applies it first, so every later step logs at the
                  requested level <Src path={ARG_UTILS} lines="L2138-L2158" />.
                </Box>
                <Box variant="p">
                  <strong>2. Resolve the platform and device.</strong>{' '}
                  <code>current_platform.pre_register_and_update()</code> runs, then a{' '}
                  <code>DeviceConfig</code> is built from the detected device type{' '}
                  <Src path={ARG_UTILS} lines="L2160-L2162" />. This comes early because dtype defaults,
                  attention backends and parallelism all branch on the device.
                </Box>
                <Box variant="p">
                  <strong>3. Check environment variable names.</strong>{' '}
                  <code>current_platform.validate_environ()</code> flags every <code>VLLM_*</code> name the
                  release does not define, such as a typo or a removed variable: a warning by default, an
                  error with <code>--fail-on-environ-validation</code>. It checks names, not values{' '}
                  <Src path={ARG_UTILS} lines="L2164" />{' '}
                  <Src path="vllm/platforms/interface.py" lines="L1344-L1357" />.
                </Box>
                <Box variant="p">
                  <strong>4. Build ModelConfig.</strong> <code>create_model_config()</code> loads the
                  Hugging Face (HF) config, resolves dtype and <code>max_model_len</code>, and becomes the
                  anchor every other sub-config validates against. Speculator detection may rewrite the model path just
                  before this step <Src path={ARG_UTILS} lines="L2166-L2183" />.
                </Box>
                <Box variant="p">
                  <strong>5. Build the remaining sub-configs.</strong> Cache, parallel, scheduler, load,
                  compilation and the optional feature configs are constructed, with unspecified defaults
                  derived from <code>ModelConfig</code> and the hardware: chunked prefill and prefix
                  caching here <Src path={ARG_UTILS} lines="L2189" />, the batch limits by GPU memory here{' '}
                  <Src path={ARG_UTILS} lines="L2534" />.
                </Box>
                <Box variant="p">
                  <strong>6. Assemble VllmConfig.</strong> All sub-configs go into one{' '}
                  <code>VllmConfig(...)</code> constructor call, which triggers <code>__post_init__</code>.
                </Box>
              </ColumnLayout>
              <Box variant="p">
                <strong>Cross-field validation lives in one place.</strong>{' '}
                <code>VllmConfig.__post_init__</code> enforces rules that span sub-configs, for example{' '}
                <code>model_config.verify_with_parallel_config(parallel_config)</code>{' '}
                <Src path={VLLM_PY} lines="L1443" />, and feature incompatibilities such as{' '}
                <code>--enable-return-routed-experts</code> with pipeline parallelism (PP &gt; 1){' '}
                <Src path={VLLM_PY} lines="L1160-L1217" />. Single-field constraints (ranges, enums) are
                enforced by pydantic on each dataclass; relationships between fields are checked once the
                whole object exists. A malformed combination therefore fails at engine startup with a
                specific message rather than deep inside a worker.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which sub-config owns a setting, and which ones exist only when a feature asks for them"
          >
            The VllmConfig sub-config map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>VllmConfig</code> is a composition of focused sub-configs. Most are always built (with{' '}
            <code>default_factory</code>); the feature configs default to <code>None</code> and
            materialize only when the feature is requested. <code>vllm/config/vllm.py</code> declares them
            as one flat field list; they are grouped here by role.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Always built: model and memory</Box>
              <Box variant="p">
                <code>ModelConfig</code> · <code>CacheConfig</code> · <code>LoadConfig</code> ·{' '}
                <code>DeviceConfig</code>
              </Box>
            </div>
            <div>
              <Box variant="h3">Always built: execution and services</Box>
              <Box variant="p">
                <code>ParallelConfig</code> · <code>SchedulerConfig</code> ·{' '}
                <code>CompilationConfig</code> · <code>StructuredOutputsConfig</code> ·{' '}
                <code>ObservabilityConfig</code> · <code>LoggingConfig</code>
              </Box>
            </div>
            <div>
              <Box variant="h3">Built on request</Box>
              <Box variant="p">
                <code>LoRAConfig</code> · <code>SpeculativeConfig</code> · <code>KVTransferConfig</code>{' '}
                · <code>KVEventsConfig</code> · <code>WatermarkConfig</code> ·{' '}
                <code>EngramConfig</code> · <code>DiffusionConfig</code>
              </Box>
            </div>
          </ColumnLayout>
          <Table
            items={subConfigRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'name',
                header: 'Sub-config',
                cell: (r) => (r.name.endsWith('Config') ? <code>{r.name}</code> : r.name),
                minWidth: 170,
              },
              {
                id: 'file',
                header: 'Source',
                cell: (r) => <Src path={r.path} lines={r.lines} />,
                minWidth: 200,
              },
              { id: 'governs', header: 'What it governs', cell: (r) => r.governs },
              {
                id: 'req',
                header: 'Presence',
                cell: (r) => presenceBadge[r.presence],
                minWidth: 110,
              },
            ]}
          />
          <Box variant="small">
            <code>VllmConfig</code> carries 28 sub-config fields at v0.31.0{' '}
            <Src path={VLLM_PY} lines="L363-L455" />; fault tolerance sits inside{' '}
            <code>ParallelConfig</code> <Src path="vllm/config/parallel.py" lines="L441-L442" />. The
            table covers the operator-relevant ones. Also present: <code>attention_config</code>,{' '}
            <code>offload_config</code>, <code>mamba_config</code>, <code>kernel_config</code>,{' '}
            <code>profiler_config</code>, <code>reasoning_config</code>, <code>quant_config</code>,{' '}
            <code>ec_transfer_config</code>, <code>weight_transfer_config</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The batch limits vllm serve picks on your GPU, and the flags that size batches, cap admission and set startup cost"
          >
            The knobs operators actually turn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The two most-tuned limits depend on the GPU.</strong> <code>EngineArgs</code> leaves{' '}
            <code>max_num_batched_tokens</code> and <code>max_num_seqs</code> unset{' '}
            <Src path={ARG_UTILS} lines="L590-L596" />, and <code>get_batch_defaults()</code> fills them
            from the usage context and the memory of one device{' '}
            <Src path={ARG_UTILS} lines="L2829-L2920" />. <code>vllm serve</code> runs with the API-server
            usage context <Src path="vllm/entrypoints/cli/serve.py" lines="L188-L189" />, which gives:
          </Box>
          <Table
            items={batchTierRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'tier', header: 'GPU memory per device', cell: (r) => r.tier, minWidth: 190 },
              {
                id: 'tokens',
                header: 'max_num_batched_tokens',
                cell: (r) => <code>{r.tokens}</code>,
              },
              { id: 'seqs', header: 'max_num_seqs', cell: (r) => <code>{r.seqs}</code> },
              { id: 'ex', header: 'Examples named in the code', cell: (r) => r.examples },
            ]}
          />
          <Box variant="p">
            The <code>2048</code> and <code>128</code> declared on <code>SchedulerConfig</code> are class
            fallbacks: on this path they apply only when no usage context matches{' '}
            <Src path={SCHED_PY} lines="L42-L44" /> <Src path={ARG_UTILS} lines="L3047-L3062" />. On an
            H100 left on auto, <code>vllm serve</code> runs with <strong>8192 tokens and 1024 sequences</strong>
            , eight times the class constant&apos;s sequence count. The A100 sits in the last row because
            the check excludes it by device name, whatever its memory{' '}
            <Src path={ARG_UTILS} lines="L2868" />.
          </Box>
          <ExpandableSection headerText="Other platforms, offline use, and the clamps applied afterwards">
            <Box variant="p">
              The offline <code>LLM</code> class gets larger token budgets on the same GPUs: 16384, 16384
              and 8192 tokens by row, with the same sequence limits{' '}
              <Src path={ARG_UTILS} lines="L2858-L2887" />. CPU backends use 2048 tokens and 128 sequences
              per unit of tensor-parallel (TP) times pipeline-parallel (PP) world size, TPU chips set their
              own token budgets, and batched data-parallel MoE (mixture of experts) uses 256 tokens{' '}
              <Src path={ARG_UTILS} lines="L2889-L2918" /> <Src path={ARG_UTILS} lines="L3048-L3051" />.
              With <code>--performance-mode throughput</code>, any limit left unset is doubled{' '}
              <Src path={ARG_UTILS} lines="L3064-L3069" />. On auto, the token budget is then capped at{' '}
              <code>max_num_seqs x max_model_len</code>, and <code>max_num_seqs</code> at the token
              budget <Src path={ARG_UTILS} lines="L3100-L3116" />.
            </Box>
          </ExpandableSection>
          <Table
            items={knobRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'flag', header: 'CLI flag', cell: (r) => <code>{r.flag}</code>, minWidth: 190 },
              { id: 'writes', header: 'Writes', cell: (r) => <code>{r.writes}</code>, minWidth: 200 },
              {
                id: 'def',
                header: 'Default for vllm serve',
                cell: (r) => <code>{r.def}</code>,
                minWidth: 150,
              },
              { id: 'effect', header: 'Effect', cell: (r) => r.effect, minWidth: 260 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 180 },
            ]}
          />
          <ExpandableSection headerText="Deep dive: CompilationConfig and what -O sets underneath">
            <SpaceBetween size="m">
              <Box variant="p">
                <code>CompilationConfig</code> (<code>vllm/config/compilation.py</code>) has many tunables,
                because <code>torch.compile</code> integration and CUDA-graph capture expose many choices.
                Its central field is the compilation <strong>mode</strong> (<code>CompilationMode</code>){' '}
                <Src path="vllm/config/compilation.py" lines="L37-L48" />:
              </Box>
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="p">
                    <code>NONE = 0</code>: eager, no compilation.
                  </Box>
                  <Box variant="p">
                    <code>STOCK_TORCH_COMPILE = 1</code>: standard <code>torch.compile</code> pipeline.
                  </Box>
                </div>
                <div>
                  <Box variant="p">
                    <code>DYNAMO_TRACE_ONCE = 2</code>: single Dynamo trace through the model.
                  </Box>
                  <Box variant="p">
                    <code>VLLM_COMPILE = 3</code>: vLLM&apos;s custom Inductor backend with caching.
                  </Box>
                </div>
              </ColumnLayout>
              <Box variant="p">
                The top-level <code>optimization_level</code> sits above this. When no mode is set, any
                level above O0 selects <code>VLLM_COMPILE</code>, and each level then applies a settings
                dictionary (fusion passes, <code>cudagraph_mode</code>, FlashInfer autotuning) only to
                fields you left unset <Src path={VLLM_PY} lines="L1775-L1803" />{' '}
                <Src path={VLLM_PY} lines="L1018-L1062" />. The level never overwrites a value you set.
              </Box>
              <Box variant="p">
                For <code>-O</code>, the <code>--help</code> text is generated from field docstrings{' '}
                <Src path={ARG_UTILS} lines="L316-L320" /> and calls O3 the best-performing level{' '}
                <Cite tier={1} href={vllmUrl(VLLM_PY, 'L442-L446')} kind="doc-code-conflict">
                  --help text: vllm.py L442-L446
                </Cite>
                . The O3 settings dictionary is identical to O2&apos;s{' '}
                <Src path={VLLM_PY} lines="L300-L345" />, as the design docs state{' '}
                <Cite tier={1} href={vllmDocsUrl('design/optimization_levels.html')}>
                  vLLM docs: Optimization Levels
                </Cite>
                . At v0.31.0, <code>-O3</code> behaves exactly like the default.
              </Box>
              <Alert type="info">
                <code>-cc.mode=3</code> is equivalent to{' '}
                <code>-cc=&apos;&#123;&quot;mode&quot;:3&#125;&apos;</code>, and the full object can be
                passed as JSON <Src path={VLLM_PY} lines="L410-L418" />. The dotted form is generic: any flag
                that takes a JSON object accepts it, for example{' '}
                <code>--speculative-config.num_speculative_tokens 3</code> or{' '}
                <code>--logging-config.log_level DEBUG</code>{' '}
                <Src path="vllm/utils/argparse_utils.py" lines="L420-L446" />.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The two inputs a VllmConfig dump never shows, and when each one takes effect"
          >
            Outside VllmConfig: server flags and environment variables
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two inputs change behavior without passing through <code>VllmConfig</code>. Both are worth
            knowing before you treat a config dump as ground truth.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Server flags (FrontendArgs)</Box>
              <Box variant="p">
                <code>FrontendArgs</code> holds the flags only the API server reads: host and port,{' '}
                <code>--api-key</code>, CORS (Cross-Origin Resource Sharing) origins, TLS (Transport Layer
                Security) files, chat-template and tool-parser settings{' '}
                <Src path={CLI_ARGS} lines="L70-L343" />. The server reads them from the argparse
                namespace, for example <code>getattr(args, &quot;enable_scale_out&quot;, False)</code>{' '}
                <Src path="vllm/entrypoints/scale_out/factories.py" lines="L65-L80" />. Two are off by
                default and gate client-visible behavior: <code>--enable-scale-out</code> registers{' '}
                <code>/render</code>, <code>/derender</code> and <code>/inference/v1/generate</code> on{' '}
                <code>vllm serve</code> <Src path={CLI_ARGS} lines="L204-L210" />, and{' '}
                <code>--trust-request-mm-kwargs</code> lets requests carry <code>mm_processor_kwargs</code>{' '}
                and <code>media_io_kwargs</code>, which are otherwise rejected{' '}
                <Src path="vllm/entrypoints/generate/base/protocol.py" lines="L52-L74" />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Environment variables</Box>
              <Box variant="p">
                <code>vllm/envs.py</code> defines 293 <code>VLLM_*</code> variables (our count over the{' '}
                <code>environment_variables</code> table <Src path={ENVS_PY} lines="L612" />), each a lazy
                lambda over <code>os.environ</code> read at the call site that needs it{' '}
                <Src path={ENVS_PY} lines="L2232-L2240" />. Many change behavior the typed config does not
                capture. Once the engine core and its workers have started, each of those processes caches
                every value <Src path={ENVS_PY} lines="L2249-L2267" />{' '}
                <Src path="vllm/v1/engine/core.py" lines="L250-L252" />{' '}
                <Src path="vllm/v1/executor/multiproc_executor.py" lines="L704" />, so a later write to{' '}
                <code>os.environ</code> in that process has no effect.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>Three variables that change outcomes:</strong>{' '}
            <code>VLLM_ALLOW_LONG_MAX_MODEL_LEN=1</code> lets you set a sequence length beyond what the
            model&apos;s <code>config.json</code> declares, overriding a validation that would otherwise
            reject it <Src path="vllm/config/model.py" lines="L2615" />.{' '}
            <code>VLLM_PP_LAYER_PARTITION</code> overrides how transformer layers are split across
            pipeline stages <Src path="vllm/distributed/utils.py" lines="L144" label="distributed/utils.py L144" />.{' '}
            <code>VLLM_CPU_KVCACHE_SPACE</code> sets the CPU KV-cache size on the CPU backend{' '}
            <Src path="vllm/platforms/cpu.py" lines="L306-L310" />. The first two never appear in a{' '}
            <code>VllmConfig</code> dump; the CPU platform copies the third into{' '}
            <code>CacheConfig.kv_cache_memory_bytes</code>, so a dump shows its value under that field
            name rather than the variable&apos;s.
          </Alert>
          <Box variant="p">
            Names also change between releases. <code>VLLM_PREFIX_CACHE_RETENTION_INTERVAL</code> is not in
            the v0.31.0 table; the setting is <code>--prefix-cache-retention-interval</code>{' '}
            <Src path={CACHE_PY} lines="L160" />, and an exported copy only produces the startup warning
            &quot;Unknown vLLM environment variable detected&quot;{' '}
            <Src path="vllm/platforms/interface.py" lines="L1344-L1357" />. After an upgrade, that warning
            is the quickest check that an environment-based setting is still recognized.
          </Box>
          <ExpandableSection headerText="How custom ops read the config: the current-config global">
            <Box variant="p">
              Custom ops and <code>torch.compile</code> passes need the config at module or forward time,
              where it is not passed as an argument. vLLM exposes it through a process-global set by the{' '}
              <code>set_current_vllm_config()</code> context manager (a <code>@contextmanager</code> over a
              module-level <code>_current_vllm_config</code>), read via{' '}
              <code>get_current_vllm_config()</code>. Outside that context the getter raises rather than
              returning <code>None</code>, a crash-early contract;{' '}
              <code>get_current_vllm_config_or_none()</code> is the explicit non-raising variant{' '}
              <Src path={VLLM_PY} lines="L3518-L3596" />.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the effective values show up, so you can confirm what vLLM picked on this GPU"
          >
            Reading the config a running server chose
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The batch limits, the block size and several compilation settings are resolved at startup, so
            the flags you typed are only part of the answer. Four places show the rest:
          </Box>
          <Table
            items={readRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'where', header: 'Where', cell: (r) => <code>{r.where}</code>, minWidth: 220 },
              { id: 'shows', header: 'What it shows', cell: (r) => r.shows, minWidth: 280 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 180 },
            ]}
          />
          <Box variant="p">
            To see what auto picked without dev mode, start once with <code>--log-level DEBUG</code> and
            read the &quot;Defaulting max_num_seqs to N&quot; and &quot;Defaulting max_num_batched_tokens
            to N&quot; lines <Src path={ARG_UTILS} lines="L3107-L3121" />. Left on auto, the same command
            runs with <strong>8192 tokens and 1024 sequences on an H100</strong> and with 2048 and 256 on an
            A100 <Src path={ARG_UTILS} lines="L2858-L2887" />.
          </Box>
          <Box variant="p">
            <strong>For a production server, pass <code>--max-num-seqs</code> and{' '}
            <code>--max-num-batched-tokens</code> explicitly.</strong> The non-default-args line then
            records them, and the values stop depending on which GPU tier the server lands on.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
