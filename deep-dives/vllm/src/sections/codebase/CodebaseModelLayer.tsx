import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

interface ProtocolRow {
  protocol: string;
  flag: string;
  meaning: string;
}

const protocolRows: ProtocolRow[] = [
  {
    protocol: 'SupportsMultiModal',
    flag: 'supports_multimodal',
    meaning: 'Accepts image/audio/video inputs alongside text; drives the multimodal input pipeline.',
  },
  {
    protocol: 'SupportsPP',
    flag: 'supports_pp = True',
    meaning: 'Can be sharded across pipeline-parallel stages; implements make_empty_intermediate_tensors.',
  },
  {
    protocol: 'SupportsLoRA',
    flag: 'supports_lora = True',
    meaning: 'LoRA adapters can be attached; declares packed_modules_mapping and embedding_modules.',
  },
  {
    protocol: 'SupportsQuant',
    flag: 'quant_config attached in __new__',
    meaning: 'Finds the QuantizationConfig from constructor args and attaches it for layer construction.',
  },
];

const FP8_BLOCK_CUDA = [
  { label: 'FlashInfer + DeepGEMM', sub: 'dynamic block-scaled' },
  { label: 'DeepGEMM', sub: 'block-scaled' },
  { label: 'Cutlass', sub: 'block-scaled' },
  { label: 'Marlin', sub: 'fallback' },
  { label: 'Triton', sub: 'portable fallback' },
];

function RegistryDiagram() {
  return (
    <svg
      viewBox="0 0 760 360"
      role="img"
      aria-labelledby="registry-diagram-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="registry-diagram-title">
        Model registry to layer-composition instantiation path
      </title>
      <defs>
        <marker id="reg-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
        </marker>
      </defs>

      <rect x="20" y="20" width="240" height="56" rx="6" fill="#f0f4f8" stroke="#7d8998" />
      <text x="140" y="44" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#16191f">
        config.architectures[0]
      </text>
      <text x="140" y="62" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        e.g. &quot;LlamaForCausalLM&quot;
      </text>

      <rect x="20" y="116" width="240" height="80" rx="6" fill="#e9f2fb" stroke="#0972d3" />
      <text x="140" y="140" textAnchor="middle" fontSize="13" fill="#16191f">
        ModelRegistry (registry.py)
      </text>
      <text x="140" y="158" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        ~376 arch strings to
      </text>
      <text x="140" y="174" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#5f6b7a">
        _LazyRegisteredModel
      </text>
      <text x="140" y="189" textAnchor="middle" fontSize="10" fill="#8a94a3">
        (module, class) as strings
      </text>

      <rect x="300" y="116" width="200" height="80" rx="6" fill="#fef6ec" stroke="#b87503" />
      <text x="400" y="140" textAnchor="middle" fontSize="12" fill="#16191f">
        inspect_model_cls()
      </text>
      <text x="400" y="158" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        subprocess + file-hash
      </text>
      <text x="400" y="174" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        cache (no CUDA init)
      </text>
      <text x="400" y="189" textAnchor="middle" fontSize="10" fill="#8a94a3">
        returns _ModelInfo
      </text>

      <rect x="540" y="116" width="200" height="80" rx="6" fill="#e9f2fb" stroke="#0972d3" />
      <text x="640" y="144" textAnchor="middle" fontSize="12" fill="#16191f">
        LlamaForCausalLM
      </text>
      <text x="640" y="162" textAnchor="middle" fontSize="11" fill="#5f6b7a">
        nn.Module subclass
      </text>
      <text x="640" y="180" textAnchor="middle" fontSize="10" fill="#8a94a3">
        imported lazily
      </text>

      <rect x="540" y="244" width="200" height="96" rx="6" fill="#f0f4f8" stroke="#7d8998" />
      <text x="640" y="266" textAnchor="middle" fontSize="11" fill="#16191f">
        composes layers/linear.py
      </text>
      <text x="640" y="286" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        QKVParallelLinear
      </text>
      <text x="640" y="302" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        MergedColumnParallelLinear
      </text>
      <text x="640" y="318" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        RowParallelLinear
      </text>

      <line x1="140" y1="76" x2="140" y2="112" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#reg-arrow)" />
      <line x1="260" y1="156" x2="296" y2="156" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#reg-arrow)" />
      <line x1="500" y1="156" x2="536" y2="156" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#reg-arrow)" />
      <line x1="640" y1="196" x2="640" y2="240" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#reg-arrow)" />

      <text x="278" y="148" textAnchor="middle" fontSize="9" fill="#8a94a3">
        capability
      </text>
      <text x="518" y="148" textAnchor="middle" fontSize="9" fill="#8a94a3">
        load
      </text>
    </svg>
  );
}

function QuantDispatchDiagram() {
  return (
    <svg
      viewBox="0 0 760 380"
      role="img"
      aria-labelledby="quant-diagram-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="quant-diagram-title">
        Quantization dispatch path from layer construction to kernel selection
      </title>
      <defs>
        <marker id="q-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
        </marker>
      </defs>

      <rect x="20" y="20" width="320" height="74" rx="6" fill="#e9f2fb" stroke="#0972d3" />
      <text x="180" y="44" textAnchor="middle" fontSize="12" fill="#16191f">
        LinearBase.__init__ (linear.py)
      </text>
      <text x="180" y="63" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        quant_config.get_quant_method(self, prefix)
      </text>
      <text x="180" y="80" textAnchor="middle" fontSize="10" fill="#8a94a3">
        stored as self.quant_method
      </text>

      <rect x="420" y="20" width="320" height="74" rx="6" fill="#fef6ec" stroke="#b87503" />
      <text x="580" y="40" textAnchor="middle" fontSize="11" fill="#16191f">
        QuantizeMethodBase (base_config.py)
      </text>
      <text x="580" y="58" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        create_weights()
      </text>
      <text x="580" y="72" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        process_weights_after_loading()
      </text>
      <text x="580" y="86" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        apply()
      </text>

      <rect x="20" y="140" width="320" height="56" rx="6" fill="#f0f4f8" stroke="#7d8998" />
      <text x="180" y="164" textAnchor="middle" fontSize="12" fill="#16191f">
        forward()
      </text>
      <text x="180" y="182" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5f6b7a">
        self.quant_method.apply(self, x, bias)
      </text>

      <rect x="420" y="140" width="320" height="56" rx="6" fill="#fef6ec" stroke="#b87503" />
      <text x="580" y="162" textAnchor="middle" fontSize="11" fill="#16191f">
        choose_scaled_mm_linear_kernel()
      </text>
      <text x="580" y="182" textAnchor="middle" fontSize="9" fill="#5f6b7a">
        walks priority list, first can_implement wins
      </text>

      <rect x="20" y="244" width="720" height="116" rx="6" fill="#f7f8fa" stroke="#7d8998" />
      <text x="380" y="266" textAnchor="middle" fontSize="11" fill="#16191f">
        kernels/linear/ — FP8-block CUDA priority order
      </text>
      {FP8_BLOCK_CUDA.map((k, i) => (
        <g key={k.label}>
          <rect
            x={36 + i * 142}
            y={284}
            width={132}
            height={58}
            rx="5"
            fill={i === 0 ? '#e9f2fb' : '#ffffff'}
            stroke={i === 0 ? '#0972d3' : '#aeb6c2'}
          />
          <text x={36 + i * 142 + 66} y={300} textAnchor="middle" fontSize="9" fill="#8a94a3">
            {`#${i + 1}`}
          </text>
          <text x={36 + i * 142 + 66} y={318} textAnchor="middle" fontSize="9" fill="#16191f">
            {k.label}
          </text>
          <text x={36 + i * 142 + 66} y={332} textAnchor="middle" fontSize="8" fill="#5f6b7a">
            {k.sub}
          </text>
        </g>
      ))}

      <line x1="340" y1="57" x2="416" y2="57" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#q-arrow)" />
      <line x1="180" y1="94" x2="180" y2="136" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#q-arrow)" />
      <line x1="340" y1="168" x2="416" y2="168" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#q-arrow)" />
      <line x1="580" y1="196" x2="580" y2="240" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#q-arrow)" />
    </svg>
  );
}

export function CodebaseModelLayer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="vllm/model_executor/ — how an architecture string becomes a running model, where quantization is dispatched, and how LoRA adapters slot in (commit 15652a6b, accessed 2026-06-07)"
          >
            Model Layer, Quantization &amp; LoRA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> The model-executor layer is the
            seam between a Hugging Face checkpoint and a vLLM-runnable graph. It
            answers three questions in sequence: which class implements this
            architecture (the registry), how each linear layer turns weights into
            math (quantization dispatch), and how per-request adapters modify that
            math without reloading weights (LoRA). Everything here lives under{' '}
            <code>vllm/model_executor/</code> and is deliberately decoupled from the
            scheduler and the attention backend.
          </Box>
          <Box variant="p">
            <strong>The design tension.</strong> vLLM ships support for ~376
            architectures, dozens of quantization formats, and a stack of
            hardware-specific kernels. Importing all of that eagerly would pull CUDA
            into the parent process and forked workers, and would cost seconds of
            startup for code paths a given deployment never uses. The layer is built
            around lazy resolution and priority-based dispatch to avoid exactly that.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="registry.py maps architecture strings to classes, lazily and CUDA-safely"
          >
            The model registry
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mapping.</strong> <code>ModelRegistry</code> (a module-level{' '}
            <code>_ModelRegistry</code> instance in{' '}
            <code>vllm/model_executor/models/registry.py</code>) holds roughly 376
            architecture strings keyed across <code>_TEXT_GENERATION_MODELS</code>,{' '}
            <code>_EMBEDDING_MODELS</code>, <code>_MULTIMODAL_MODELS</code> and
            others, merged into <code>_VLLM_MODELS</code>. The architecture name is
            read from the checkpoint config (<code>config.architectures[0]</code>,
            e.g. <code>&quot;LlamaForCausalLM&quot;</code>) and looked up here.
          </Box>
          <Box variant="p">
            <strong>Why lazy.</strong> Each entry is a{' '}
            <code>_LazyRegisteredModel</code> that stores the module path and class
            name as <em>strings</em> rather than importing the class. The real import
            only happens in <code>load_model_cls()</code>, which calls{' '}
            <code>importlib.import_module(self.module_name)</code> and pulls the
            attribute. This keeps the registry import cheap and, critically, avoids
            initializing CUDA in the parent process — important because forked workers
            cannot re-initialize CUDA (the{' '}
            <code>RuntimeError: Cannot re-initialize CUDA in forked subprocess</code>{' '}
            failure the registry docstring explicitly calls out).
          </Box>
          <RegistryDiagram />
          <Box variant="p">
            <strong>Capability inspection in a subprocess.</strong> vLLM needs to know
            each model&apos;s capabilities (text-gen vs pooling, multimodal, PP,
            attention type) <em>before</em> deciding how to run it.{' '}
            <code>inspect_model_cls()</code> resolves the model&apos;s source file,
            hashes its bytes with <code>safe_hash</code> (md5, falling back to sha256
            in FIPS-constrained environments), and uses that hash as a cache key for a
            JSON <code>_ModelInfo</code> file under{' '}
            <code>VLLM_CACHE_ROOT/modelinfos</code>. On a cache miss it builds the{' '}
            <code>_ModelInfo</code> by importing and inspecting the class inside a{' '}
            <em>separate process</em> via <code>_run_in_subprocess</code> (cloudpickle
            plus a child <code>python</code> invocation) — &quot;Performed in another
            process to avoid initializing CUDA,&quot; as the inline comment states. The
            file-hash cache means this expensive step runs once per model file version,
            not once per launch.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">Stored as strings</Box>
              <Box variant="p">
                <code>module_name</code> and <code>class_name</code> only. No import
                until the model is actually selected.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Inspected in subprocess</Box>
              <Box variant="p">
                Capabilities computed in a child process so the parent never touches
                CUDA. Result is a plain-data <code>_ModelInfo</code>.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Cached by file hash</Box>
              <Box variant="p">
                JSON keyed on the source-file content hash. A stale hash triggers
                re-inspection; a matching hash is an instant load.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Capability protocols (interfaces.py)">
            <SpaceBetween size="m">
              <Box variant="p">
                The capabilities the registry inspects are declared as
                runtime-checkable protocols in{' '}
                <code>vllm/model_executor/models/interfaces.py</code>. Most are marker
                protocols: a model opts in by setting a <code>ClassVar</code> flag
                (e.g. <code>supports_lora = True</code>) and, where required,
                implementing a method. <code>isinstance</code> /{' '}
                <code>issubclass</code> checks against the protocol are how the rest of
                the engine discovers what a model can do.
              </Box>
              <Table
                items={protocolRows}
                variant="embedded"
                wrapLines
                columnDefinitions={[
                  {
                    id: 'protocol',
                    header: 'Protocol',
                    cell: (r) => <code>{r.protocol}</code>,
                    minWidth: 170,
                  },
                  {
                    id: 'flag',
                    header: 'Marker / mechanism',
                    cell: (r) => <code>{r.flag}</code>,
                    minWidth: 190,
                  },
                  { id: 'meaning', header: 'What it signals', cell: (r) => r.meaning },
                ]}
              />
              <Box variant="small">
                Other protocols in the same file include{' '}
                <code>SupportsTranscription</code>, <code>HasInnerState</code>,{' '}
                <code>IsHybrid</code>, <code>IsAttentionFree</code>,{' '}
                <code>SupportsEagle</code> / <code>SupportsEagle3</code>, and{' '}
                <code>SupportsMRoPE</code> — the same protocol pattern, one per
                capability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="The &quot;add a new model&quot; contract">
            <SpaceBetween size="s">
              <Box variant="p">
                Adding a model is a small, well-defined contract (documented in{' '}
                <code>docs/contributing/model/registration.md</code>). For an
                out-of-tree model you write an <code>nn.Module</code> subclass whose{' '}
                <code>forward</code> takes <code>input_ids</code> and{' '}
                <code>positions</code> and returns hidden states, compose it from the{' '}
                <code>layers/</code> primitives, and register it via{' '}
                <code>ModelRegistry.register_model(&quot;YourModelForCausalLM&quot;,
                &quot;your_code:YourModelForCausalLM&quot;)</code>.
              </Box>
              <Box variant="p">
                Passing the class as a <code>&quot;module:class&quot;</code> string
                (rather than the class object) is the recommended form precisely
                because it preserves the lazy-import / no-CUDA-in-parent property the
                built-in registry relies on. Opting into a capability is additive:
                inherit the protocol (or set its <code>ClassVar</code> flag) and the
                registry&apos;s next inspection picks it up.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a quantization format becomes a concrete kernel call"
          >
            Quantization dispatch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The dispatch point.</strong> Quantization is not woven through the
            model code — it is localized to the linear layers in{' '}
            <code>vllm/model_executor/layers/linear.py</code>. In{' '}
            <code>LinearBase.__init__</code>, if a <code>quant_config</code> is
            present, the layer calls{' '}
            <code>quant_config.get_quant_method(self, prefix=prefix)</code> and stores
            the result as <code>self.quant_method</code>. If there is no config it
            installs <code>UnquantizedLinearMethod</code>. From then on the layer
            never branches on quantization format again: <code>forward</code> simply
            calls <code>self.quant_method.apply(self, x, bias)</code>.
          </Box>
          <QuantDispatchDiagram />
          <Box variant="p">
            <strong>The interface.</strong> Every quantization scheme implements two
            ABCs in{' '}
            <code>vllm/model_executor/layers/quantization/base_config.py</code>:{' '}
            <code>QuantizationConfig</code> (parses the checkpoint&apos;s quant
            metadata, exposes <code>get_name</code>, <code>get_min_capability</code>,
            and <code>get_quant_method</code>) and <code>QuantizeMethodBase</code> (the
            per-layer method with <code>create_weights</code>, <code>apply</code>, and
            an optional <code>process_weights_after_loading</code>). The lifecycle is
            fixed: <code>create_weights</code> allocates parameters at construction,{' '}
            <code>process_weights_after_loading</code> runs once after the checkpoint
            is loaded (repacking, transposing, or quantizing in place), and{' '}
            <code>apply</code> runs on every forward.
          </Box>
          <Box variant="p">
            <strong>Kernel selection by priority.</strong> A single format (say
            block-scaled FP8) can map to several backends. The choice is made by the
            chooser functions in <code>vllm/model_executor/kernels/linear/</code>,
            which hold per-platform lists in <em>priority/performance order</em> and
            return the first kernel whose <code>can_implement</code> succeeds for the
            given layer shape and compute capability — skipping kernels disabled via{' '}
            <code>VLLM_DISABLED_KERNELS</code> or whose{' '}
            <code>get_min_capability()</code> exceeds the device. The CUDA FP8-block
            order is concrete and load-bearing:
          </Box>
          <ColumnLayout columns={5} variant="text-grid">
            {FP8_BLOCK_CUDA.map((k, i) => (
              <div key={k.label}>
                <Box variant="awsui-key-label">
                  <Badge color={i === 0 ? 'blue' : 'grey'}>{`#${i + 1}`}</Badge>
                </Box>
                <Box variant="p">
                  <strong>{k.label}</strong>
                  <br />
                  <Box variant="small">{k.sub}</Box>
                </Box>
              </div>
            ))}
          </ColumnLayout>
          <Alert type="info">
            This priority-first-match design is why the same checkpoint runs
            differently across GPUs without any change to model or config code: on a
            Hopper/Blackwell device DeepGEMM or Cutlass wins; on older silicon the list
            falls through to Marlin or the portable Triton kernel. Separate priority
            lists exist for INT8, per-tensor/per-channel FP8, MXFP8, MXFP4, and NVFP4
            formats.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Per-request adapters via stacked weights and Punica Triton kernels"
          >
            LoRA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape that makes batched LoRA work.</strong> vLLM serves many
            adapters concurrently, so adapter weights are not stored per-request — they
            are pre-allocated into stacked buffers shaped{' '}
            <code>[max_loras, 1, ...]</code> (see{' '}
            <code>vllm/lora/layers/base_linear.py</code>, where{' '}
            <code>lora_a_stacked</code> and <code>lora_b_stacked</code> are{' '}
            <code>torch.zeros(max_loras, 1, ...)</code>). A per-token index tensor then
            selects which adapter slice each token uses, so a single batched GEMM
            covers a batch spanning multiple adapters.
          </Box>
          <Box variant="p">
            <strong>The shrink, all-gather, expand path.</strong> A LoRA-wrapped linear
            layer does not modify the base weight; it adds a low-rank delta. For a
            column-parallel layer this is implemented in <code>_mcp_apply</code> (
            <code>vllm/lora/layers/column_parallel_linear.py</code>) as three steps:{' '}
            <code>punica_wrapper.add_shrink</code> projects the input down to LoRA rank
            (the <code>lora_a</code> GEMM),{' '}
            <code>tensor_model_parallel_all_gather</code> collects the rank-dim shards
            across tensor-parallel ranks, and <code>punica_wrapper.add_expand</code>{' '}
            projects back up and accumulates into the output (the <code>lora_b</code>{' '}
            GEMM). The shrink and expand GEMMs are fused multi-adapter Triton kernels.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">1 — Shrink</Box>
              <Box variant="p">
                <code>add_shrink</code>: input to LoRA rank via stacked{' '}
                <code>lora_a</code>. Output is a small{' '}
                <code>[slices, tokens, rank]</code> buffer.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">2 — All-gather</Box>
              <Box variant="p">
                <code>tensor_model_parallel_all_gather</code> over the rank dim, since{' '}
                <code>lora_a</code> is sharded but the expand needs the full rank.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">3 — Expand</Box>
              <Box variant="p">
                <code>add_expand</code>: rank back up to output via stacked{' '}
                <code>lora_b</code>, accumulated in place onto the base output.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            <strong>Punica wrapper.</strong> The shrink/expand kernels live behind{' '}
            <code>vllm/lora/punica_wrapper/</code>. <code>punica_base.py</code> defines
            the abstract surface (<code>add_shrink</code>, <code>add_expand</code>,{' '}
            <code>add_lora_linear</code>, <code>add_lora_logits</code>) and{' '}
            <code>punica_gpu.py</code> implements it with Triton; a selector (
            <code>punica_selector.py</code>) picks the GPU/CPU/XPU backend at runtime.
            Routing per-token to the right adapter slice is exactly what Punica-style
            batched LoRA is for.
          </Box>

          <Alert type="warning">
            <strong>Static vs dynamic.</strong> Adapters loaded at startup into the
            fixed <code>max_loras</code> slots are the stable path. Dynamic
            multi-tenant swapping — loading and evicting adapters at request time —
            shares those same slots and the same all-gather path, so it carries caveats
            around slot pressure and load/evict cost. Size <code>max_loras</code> for
            the concurrency you actually expect.
          </Alert>

          <ExpandableSection headerText="A real in-code TODO worth knowing">
            <SpaceBetween size="s">
              <Box variant="p">
                The abstract base methods in{' '}
                <code>vllm/lora/punica_wrapper/punica_base.py</code> carry an explicit
                marker that the reference path is the device-specific kernel, not a
                portable fallback. Both <code>add_lora_linear</code> and{' '}
                <code>add_lora_logits</code> on the base class end with{' '}
                <code>raise NotImplementedError</code>, each preceded by the comment{' '}
                <code># TODO: implement it based on torch ops</code>.
              </Box>
              <Box variant="p">
                In other words, as of this commit there is no pure-PyTorch reference
                implementation of the fused LoRA GEMMs on the base wrapper — every live
                backend must override these with its own kernels. It is a small thing,
                but it tells you where the real work lives and that hardware without a
                Punica backend has no graceful fallback here.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Key files</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Registry &amp; interfaces</Box>
            <Box variant="p">
              <code>vllm/model_executor/models/registry.py</code>
              <br />
              <code>vllm/model_executor/models/interfaces.py</code>
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Layers &amp; quantization</Box>
            <Box variant="p">
              <code>vllm/model_executor/layers/linear.py</code>
              <br />
              <code>vllm/model_executor/layers/quantization/base_config.py</code>
              <br />
              <code>vllm/model_executor/kernels/linear/</code>
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">LoRA</Box>
            <Box variant="p">
              <code>vllm/lora/layers/</code>
              <br />
              <code>vllm/lora/punica_wrapper/</code>
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Add-a-model contract</Box>
            <Box variant="p">
              <code>docs/contributing/model/registration.md</code>
              <br />
              <Link
                external
                href="https://github.com/vllm-project/vllm/tree/15652a6b/vllm/model_executor"
              >
                vllm/model_executor on GitHub (commit 15652a6b)
              </Link>
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
