import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

interface SubConfigRow {
  name: string;
  file: string;
  governs: string;
  optional: boolean;
}

const subConfigRows: SubConfigRow[] = [
  {
    name: 'ModelConfig',
    file: 'vllm/config/model.py',
    governs:
      'Model identity and shape — HF model path, dtype, max_model_len, tokenizer, trust_remote_code, quantization, multimodal limits. The largest dataclass; everything else validates against it.',
    optional: false,
  },
  {
    name: 'CacheConfig',
    file: 'vllm/config/cache.py',
    governs:
      'KV-cache memory and paging — gpu_memory_utilization, block_size, cache_dtype, enable_prefix_caching, num_gpu_blocks_override.',
    optional: false,
  },
  {
    name: 'ParallelConfig',
    file: 'vllm/config/parallel.py',
    governs:
      'Distributed execution layout — tensor_parallel_size, pipeline_parallel_size, data_parallel_size, enable_expert_parallel, distributed_executor_backend.',
    optional: false,
  },
  {
    name: 'SchedulerConfig',
    file: 'vllm/config/scheduler.py',
    governs:
      'Continuous-batching policy — max_num_batched_tokens, max_num_seqs, max_model_len, chunked prefill, preemption mode.',
    optional: false,
  },
  {
    name: 'LoadConfig',
    file: 'vllm/config/load.py',
    governs:
      'How weights get onto the device — load_format (auto, safetensors, sharded_state, runai_streamer), download_dir, ignore_patterns.',
    optional: false,
  },
  {
    name: 'DeviceConfig',
    file: 'vllm/config/device.py',
    governs:
      'Target device type (auto, cuda, cpu, tpu, xpu). Resolved from the active platform before the rest of the config is built.',
    optional: false,
  },
  {
    name: 'CompilationConfig',
    file: 'vllm/config/compilation.py',
    governs:
      'torch.compile and CUDA-graph capture — CompilationMode (NONE / STOCK_TORCH_COMPILE / DYNAMO_TRACE_ONCE / VLLM_COMPILE), cudagraph_capture_sizes, custom-op enable lists. The single largest config file.',
    optional: false,
  },
  {
    name: 'StructuredOutputsConfig',
    file: 'vllm/config/structured_outputs.py',
    governs:
      'Constrained / grammar decoding — backend selection (auto, xgrammar, guidance, outlines) for JSON-schema and regex output.',
    optional: false,
  },
  {
    name: 'ObservabilityConfig',
    file: 'vllm/config/observability.py',
    governs:
      'Metrics and tracing — OTLP trace endpoint, per-request timing collection, hidden-metric version gating.',
    optional: false,
  },
  {
    name: 'LoRAConfig',
    file: 'vllm/config/lora.py',
    governs:
      'Multi-LoRA serving — max_lora_rank (16), max_loras (1), max_cpu_loras, adapter dtype. Present only when LoRA is enabled.',
    optional: true,
  },
  {
    name: 'SpeculativeConfig',
    file: 'vllm/config/speculative.py',
    governs:
      'Speculative decoding — draft method (ngram, EAGLE, Medusa, draft model), num_speculative_tokens, acceptance method. Present only when speculation is requested.',
    optional: true,
  },
  {
    name: 'KVTransferConfig',
    file: 'vllm/config/kv_transfer.py',
    governs:
      'Cross-instance KV movement — kv_connector and producer/consumer role for prefill/decode disaggregation. Present only for disaggregated serving.',
    optional: true,
  },
  {
    name: 'KVEventsConfig',
    file: 'vllm/config/kv_events.py',
    governs:
      'KV-cache event publishing (block-level create/evict events) for external cache-aware routers. Present only when enabled.',
    optional: true,
  },
];

interface KnobRow {
  flag: string;
  field: string;
  config: string;
  def: string;
  effect: string;
}

const knobRows: KnobRow[] = [
  {
    flag: '--gpu-memory-utilization',
    field: 'gpu_memory_utilization',
    config: 'CacheConfig',
    def: '0.92',
    effect: 'Fraction of GPU memory the instance may claim; the residual after weights becomes KV-cache blocks.',
  },
  {
    flag: '--max-num-batched-tokens',
    field: 'max_num_batched_tokens',
    config: 'SchedulerConfig',
    def: '2048',
    effect: 'Token budget per scheduler step. Larger favors prefill throughput; smaller favors decode latency.',
  },
  {
    flag: '--max-num-seqs',
    field: 'max_num_seqs',
    config: 'SchedulerConfig',
    def: '128',
    effect: 'Max concurrent sequences in a batch. Caps the running set independently of the token budget.',
  },
  {
    flag: '--block-size',
    field: 'block_size',
    config: 'CacheConfig',
    def: '16 (DEFAULT_BLOCK_SIZE)',
    effect: 'PagedAttention page size in tokens. May be auto-resolved from KV-cache groups if left unset.',
  },
  {
    flag: '--kv-cache-dtype',
    field: 'cache_dtype',
    config: 'CacheConfig',
    def: '"auto"',
    effect: '"auto" follows model dtype; fp8 / fp8_e5m2 roughly halve KV-cache bytes, raising the batch ceiling.',
  },
  {
    flag: '--tensor-parallel-size',
    field: 'tensor_parallel_size',
    config: 'ParallelConfig',
    def: '1',
    effect: 'Intra-layer shard count across GPUs. Cross-validated against pipeline size and head counts.',
  },
  {
    flag: '-O / --optimization-level',
    field: 'optimization_level',
    config: 'VllmConfig (top level)',
    def: 'O2',
    effect: 'Startup-time vs runtime trade: O0 fastest start, O3 best steady-state. O2 is the default.',
  },
];

/** Config flow: CLI flags -> EngineArgs -> create_engine_config() -> VllmConfig -> subsystems. */
function ConfigFlowDiagram() {
  const stages = [
    { x: 8, label: 'CLI flags', sub: '--gpu-memory-utilization …' },
    { x: 196, label: 'EngineArgs', sub: 'flat argparse dataclass' },
    { x: 384, label: 'create_engine_config()', sub: 'builds typed sub-configs' },
    { x: 572, label: 'VllmConfig', sub: '__post_init__ validates' },
    { x: 760, label: 'subsystems', sub: 'engine · workers · ops' },
  ];
  return (
    <svg
      viewBox="0 0 940 150"
      role="img"
      aria-labelledby="cfgflow-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="cfgflow-title">
        Configuration flow: CLI flags become EngineArgs, which create_engine_config turns into typed
        sub-configs assembled into VllmConfig, which feeds every subsystem.
      </title>
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect
            x={s.x}
            y={36}
            width={156}
            height={62}
            rx={8}
            fill={i === 3 ? '#0972d3' : '#f2f8fd'}
            stroke={i === 3 ? '#033160' : '#7d8998'}
            strokeWidth={i === 3 ? 2 : 1}
          />
          <text
            x={s.x + 78}
            y={62}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            fill={i === 3 ? '#ffffff' : '#0f1b2a'}
          >
            {s.label}
          </text>
          <text
            x={s.x + 78}
            y={82}
            textAnchor="middle"
            fontSize={10}
            fill={i === 3 ? '#d1e8ff' : '#5f6b7a'}
          >
            {s.sub}
          </text>
          {i < stages.length - 1 && (
            <line
              x1={s.x + 156}
              y1={67}
              x2={s.x + 188}
              y2={67}
              stroke="#5f6b7a"
              strokeWidth={1.5}
              markerEnd="url(#cfgArrow)"
            />
          )}
        </g>
      ))}
      <text x={8} y={126} fontSize={10} fill="#5f6b7a">
        vllm/engine/arg_utils.py
      </text>
      <text x={500} y={126} fontSize={10} fill="#5f6b7a">
        vllm/config/vllm.py — cross-field validation, then read everywhere
      </text>
      <defs>
        <marker id="cfgArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
        </marker>
      </defs>
    </svg>
  );
}

export function CodebaseConfig() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How a flat list of CLI flags becomes one validated, typed object that every subsystem reads"
          >
            Configuration system
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              vLLM&apos;s configuration is a typed, pydantic-validated layer that funnels every input —
              CLI flags, API kwargs, environment — into a single immutable source of truth called{' '}
              <code>VllmConfig</code>.
            </strong>{' '}
            Nothing in the engine reads raw argparse values. A flat user-facing surface{' '}
            (<code>EngineArgs</code> / <code>AsyncEngineArgs</code> in{' '}
            <code>vllm/engine/arg_utils.py</code>, ~2,600 lines) is translated by{' '}
            <code>create_engine_config()</code> into a set of small typed sub-config dataclasses,
            which are then assembled into <code>VllmConfig</code> (<code>vllm/config/vllm.py</code>).
          </Box>
          <Box variant="p">
            The split matters: <code>EngineArgs</code> is the ergonomic, backwards-compatible flag
            surface; <code>VllmConfig</code> is the structured, validated object the rest of the
            codebase depends on. Keeping them separate lets vLLM evolve flag names and defaults
            without churning every consumer of the config.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">From CLI flag to live config</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Every flag travels the same path. There is exactly one place where the typed object is
            built (<code>create_engine_config()</code>) and exactly one place where cross-field
            consistency is enforced (<code>VllmConfig.__post_init__</code>).
          </Box>
          <ConfigFlowDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">EngineArgs (the surface)</Box>
              <Box variant="p">
                A flat pydantic dataclass whose <code>add_cli_args()</code> registers every flag and
                whose <code>from_cli_args()</code> hydrates it from an argparse namespace.{' '}
                <code>AsyncEngineArgs</code> subclasses it for the async server, adding fields like{' '}
                <code>enable_log_requests</code>. This is where defaults and deprecations live.
              </Box>
            </div>
            <div>
              <Box variant="h3">VllmConfig (the truth)</Box>
              <Box variant="p">
                <code>create_engine_config()</code> calls per-subsystem builders
                (<code>create_model_config()</code>, <code>create_load_config()</code>, …), then
                passes the typed sub-configs into the <code>VllmConfig(...)</code> constructor. Once
                built, it is passed by reference throughout the engine, workers, and model code — no
                subsystem re-parses user input.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Every config class is a <strong>pydantic dataclass</strong> created by the shared{' '}
            <code>@config</code> decorator in <code>vllm/config/utils.py</code>, which sets{' '}
            <code>extra=&quot;forbid&quot;</code>. A typo&apos;d field is a hard validation error at
            construction, not a silently ignored kwarg — the boundary is the contract.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The VllmConfig sub-config group map</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <code>VllmConfig</code> is a composition of focused sub-configs. The required ones are
            always present (built with <code>default_factory</code> where possible); the optional
            ones default to <code>None</code> and only materialize when the corresponding feature is
            requested. Below is the actual grouping in <code>vllm/config/vllm.py</code>.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Model &amp; memory</Box>
              <Box variant="p">
                <code>ModelConfig</code> · <code>CacheConfig</code> · <code>LoadConfig</code> ·{' '}
                <code>DeviceConfig</code>
              </Box>
            </div>
            <div>
              <Box variant="h3">Execution &amp; scheduling</Box>
              <Box variant="p">
                <code>ParallelConfig</code> · <code>SchedulerConfig</code> ·{' '}
                <code>CompilationConfig</code>
              </Box>
            </div>
            <div>
              <Box variant="h3">Feature add-ons (optional)</Box>
              <Box variant="p">
                <code>LoRAConfig</code> · <code>SpeculativeConfig</code> ·{' '}
                <code>KVTransferConfig</code> · <code>KVEventsConfig</code> ·{' '}
                <code>StructuredOutputsConfig</code> · <code>ObservabilityConfig</code>
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
                cell: (r) => <code>{r.name}</code>,
                minWidth: 170,
              },
              {
                id: 'file',
                header: 'File',
                cell: (r) => <code>{r.file}</code>,
                minWidth: 200,
              },
              { id: 'governs', header: 'What it governs', cell: (r) => r.governs },
              {
                id: 'req',
                header: 'Presence',
                cell: (r) =>
                  r.optional ? (
                    <Badge color="grey">optional</Badge>
                  ) : (
                    <Badge color="blue">always</Badge>
                  ),
                minWidth: 110,
              },
            ]}
          />
          <Box variant="small">
            List drawn from the <code>VllmConfig</code> field declarations and{' '}
            <code>vllm/config/__init__.py</code> exports at commit <code>15652a6b</code>. The full
            object carries additional fields beyond those shown (e.g.{' '}
            <code>quant_config</code>, <code>compilation</code> sub-objects,{' '}
            <code>profiler_config</code>, <code>kernel_config</code>); these are the operator-relevant
            ones.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The knobs operators actually turn</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            A handful of fields account for most real-world tuning. Defaults below are verified against
            the dataclass declarations; the CLI flag and the field it writes are listed so you can
            trace either direction.
          </Box>
          <Table
            items={knobRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'flag', header: 'CLI flag', cell: (r) => <code>{r.flag}</code>, minWidth: 200 },
              { id: 'field', header: 'Field', cell: (r) => <code>{r.field}</code>, minWidth: 180 },
              { id: 'config', header: 'In', cell: (r) => r.config, minWidth: 150 },
              { id: 'def', header: 'Default', cell: (r) => <code>{r.def}</code>, minWidth: 130 },
              { id: 'effect', header: 'Effect', cell: (r) => r.effect },
            ]}
          />
          <Box variant="small">
            Defaults: <code>gpu_memory_utilization=0.92</code> and <code>block_size</code> default 16
            (<code>CacheConfig.DEFAULT_BLOCK_SIZE</code>) in <code>vllm/config/cache.py</code>;{' '}
            <code>max_num_batched_tokens</code> default 2048, <code>max_num_seqs</code> default 128
            (<code>SchedulerConfig.DEFAULT_*</code> class vars) in{' '}
            <code>vllm/config/scheduler.py</code>; <code>optimization_level</code> defaults to{' '}
            <code>OptimizationLevel.O2</code> in <code>vllm/config/vllm.py</code>. All verified at
            commit <code>15652a6b</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Where the typed model leaks: globals and env</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Two mechanisms read or override the config <em>outside</em> the clean
            EngineArgs-to-VllmConfig path. Both are deliberate, and both are worth knowing before you
            trust a config dump as ground truth.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The current-config global</Box>
              <Box variant="p">
                Custom ops and <code>torch.compile</code> passes need the config at module/forward
                time, where it is not passed as an argument. vLLM exposes it through a process-global
                set by the <code>set_current_vllm_config()</code> context manager (a{' '}
                <code>@contextmanager</code> over a module-level <code>_current_vllm_config</code>),
                read via <code>get_current_vllm_config()</code>. Outside that context the getter
                raises rather than returning <code>None</code> — a crash-early contract.
              </Box>
            </div>
            <div>
              <Box variant="h3">Environment overrides</Box>
              <Box variant="p">
                <code>vllm/envs.py</code> defines 350+ <code>VLLM_*</code> variables, each a lazy
                lambda over <code>os.environ</code>. Many silently change behavior the typed config
                doesn&apos;t capture — they are read directly at the relevant call site, not folded
                into <code>VllmConfig</code>. A config object can look correct while an env var has
                already changed the outcome.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>Real examples (verified in <code>vllm/envs.py</code>):</strong>{' '}
            <code>VLLM_ALLOW_LONG_MAX_MODEL_LEN=1</code> lets you set a sequence length beyond what
            the model&apos;s <code>config.json</code> declares — overriding a validation that would
            otherwise reject it. <code>VLLM_PP_LAYER_PARTITION</code> overrides how transformer
            layers are split across pipeline stages. <code>VLLM_CPU_KVCACHE_SPACE</code> sets the CPU
            KV-cache size on the CPU backend. None of these appear as a flag in the config dump.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Deep dive: how create_engine_config assembles VllmConfig">
        <SpaceBetween size="m">
          <Box variant="p">
            <code>create_engine_config()</code> (<code>vllm/engine/arg_utils.py</code>) runs in a
            fixed order, because later sub-configs depend on earlier ones:
          </Box>
          <ColumnLayout columns={1} borders="horizontal">
            <Box variant="p">
              <strong>1. Resolve the platform and device.</strong>{' '}
              <code>current_platform.pre_register_and_update()</code> runs, then a{' '}
              <code>DeviceConfig</code> is built from the detected device type. This happens first
              because dtype defaults, attention backends, and parallelism all branch on the device.
            </Box>
            <Box variant="p">
              <strong>2. Validate the environment.</strong>{' '}
              <code>envs.validate_environ(...)</code> checks the <code>VLLM_*</code> variables before
              any heavy work — fail fast on a bad environment.
            </Box>
            <Box variant="p">
              <strong>3. Build ModelConfig.</strong> <code>create_model_config()</code> loads the HF
              config, resolves dtype and <code>max_model_len</code>, and is the anchor every other
              sub-config validates against (e.g. speculator detection may rewrite the model path
              before this step).
            </Box>
            <Box variant="p">
              <strong>4. Build the remaining sub-configs.</strong> Cache, parallel, scheduler, load,
              compilation, and the optional feature configs are constructed, with defaults filled
              from <code>ModelConfig</code> where they were left unspecified (chunked-prefill and
              prefix-caching defaults are derived here).
            </Box>
            <Box variant="p">
              <strong>5. Assemble VllmConfig.</strong> All sub-configs are passed into the{' '}
              <code>VllmConfig(...)</code> constructor in one call, which triggers{' '}
              <code>__post_init__</code>.
            </Box>
          </ColumnLayout>
          <Box variant="p">
            <strong>Cross-field validation lives in one place.</strong>{' '}
            <code>VllmConfig.__post_init__</code> is where rules that span sub-configs are enforced —
            for example <code>model_config.verify_with_parallel_config(parallel_config)</code>, and
            feature incompatibilities like &quot;return-routed-experts is incompatible with PP &gt; 1
            and with KV connectors.&quot; Single-field constraints (ranges, enums) are enforced
            by pydantic on each dataclass; relationships between fields are enforced here, after the
            whole object exists. That separation is why a malformed combination fails at engine
            startup with a specific message rather than deep inside a worker.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <ExpandableSection headerText="Deep dive: CompilationConfig and optimization levels">
        <SpaceBetween size="m">
          <Box variant="p">
            <code>CompilationConfig</code> (<code>vllm/config/compilation.py</code>) is the largest
            config file in the tree, because <code>torch.compile</code> integration and CUDA-graph
            capture have many tunables. Its central field is the compilation{' '}
            <strong>mode</strong> (<code>CompilationMode</code>):
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="p">
                <code>NONE = 0</code> — eager, no compilation.
              </Box>
              <Box variant="p">
                <code>STOCK_TORCH_COMPILE = 1</code> — standard <code>torch.compile</code> pipeline.
              </Box>
            </div>
            <div>
              <Box variant="p">
                <code>DYNAMO_TRACE_ONCE = 2</code> — single Dynamo trace through the model.
              </Box>
              <Box variant="p">
                <code>VLLM_COMPILE = 3</code> — vLLM&apos;s custom Inductor backend with caching.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Sitting above this is the top-level <code>optimization_level</code> on{' '}
            <code>VllmConfig</code> itself (<code>OptimizationLevel</code>, an{' '}
            <code>IntEnum</code> O0–O3, default <code>O2</code>). It is the operator-facing knob{' '}
            (<code>-O</code> / <code>--optimization-level</code>) that trades startup time for
            steady-state performance: O0 has the fastest startup, O3 the best runtime. It is a
            higher-level dial that influences compilation, CUDA-graph, and kernel choices rather than
            a single switch.
          </Box>
          <Alert type="info">
            The compilation config has a convenience shorthand:{' '}
            <code>-cc.mode=3</code> is equivalent to <code>-cc=&apos;&#123;&quot;mode&quot;:3&#125;&apos;</code>,
            and you can pass the full object as JSON. This is one of the few places where a single
            sub-config is exposed directly on the CLI rather than as flat flags.
          </Alert>
        </SpaceBetween>
      </ExpandableSection>

      <Box variant="small">
        Source: vLLM repository at commit <code>15652a6b</code> (accessed 2026-06-07). Key files:{' '}
        <code>vllm/config/vllm.py</code>, <code>vllm/config/*</code>,{' '}
        <code>vllm/engine/arg_utils.py</code>, <code>vllm/envs.py</code>.{' '}
        <Link external href="https://github.com/vllm-project/vllm/tree/main/vllm/config">
          vllm/config on GitHub
        </Link>
        .
      </Box>
    </SpaceBetween>
  );
}
