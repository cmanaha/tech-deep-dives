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
import { Cite, vllmUrl, vllmDocsUrl } from '../../components/Cite';

const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';
const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
const REGISTRY_PY = 'vllm/model_executor/models/registry.py';
const KERNELS_PY = 'vllm/model_executor/kernels/linear/__init__.py';
const SCALED_MM = 'vllm/model_executor/kernels/linear/scaled_mm';

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
    meaning:
      'A plain mixin rather than a Protocol: finds the QuantizationConfig in the constructor args and attaches it for layer construction.',
  },
];

interface ArchErrorRow {
  message: string;
  meaning: string;
  action: string;
}

const archErrorRows: ArchErrorRow[] = [
  {
    message: 'Model architectures [...] failed to be inspected',
    meaning:
      'A listed name is registered, but importing or inspecting its class failed. The traceback is logged just before, as "Error in inspecting model architecture", with the child process stderr.',
    action: 'Read that traceback: usually a missing dependency or an import-time error.',
  },
  {
    message: 'Model architecture X was supported in vLLM until vY',
    meaning:
      'The architecture was removed. 50 names map to the last release that ran them, for example MPTForCausalLM until v0.28.0.',
    action: 'Pin that release, or serve a checkpoint with a supported architecture.',
  },
  {
    message: 'Model architecture X is not supported in-tree anymore',
    meaning:
      'The architecture moved to a plugin. BART, mBART and Florence-2 point to vllm-project/bart-plugin.',
    action: 'Install the plugin the message names.',
  },
  {
    message: 'Model architectures [...] are not supported for now',
    meaning: 'No listed name is registered, and the Transformers backend did not take the model.',
    action:
      'Run once with --model-impl transformers to see why the backend refused it, or register a class from a plugin (below).',
  },
];

const FP8_BLOCK_CUDA = [
  { label: 'FlashInfer + DeepGEMM', sub: 'switches by batch size' },
  { label: 'DeepGEMM', sub: 'Hopper and Blackwell only' },
  { label: 'Cutlass', sub: 'block-scaled kernel' },
  { label: 'B12x', sub: 'native B12X kernel' },
  { label: 'Marlin', sub: 'for GPUs without FP8' },
  { label: 'Humming', sub: 'if humming is installed' },
  { label: 'Triton', sub: 'portable' },
  { label: 'BlockWise Torch', sub: 'torch._scaled_mm' },
];

function RegistryDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 380"
        role="img"
        aria-labelledby="ml-registry-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="ml-registry-title">
          vLLM tries each name in config.architectures against about 390 registered
          architecture strings. Each entry is a lazy module-and-class pair, inspected in a child
          process behind a file-hash cache so the parent never initializes CUDA, then imported
          from one of two homes: vllm/model_executor/models or a hardware-isolated vllm/models
          package. When no listed name is registered and --model-impl is auto, or when it is
          transformers, the Transformers backend wraps the Hugging Face model instead. Both paths
          build the model from vLLM&apos;s parallel linear layers.
        </title>
        <style>{`
          .mlr-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .mlr-c { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .mlr-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .mlr-e { fill: #5f6b7a; font: 600 10px sans-serif; }
          .mlr-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#mlr-ah); }
        `}</style>
        <defs>
          <marker
            id="mlr-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={380} rx={8} fill="#ffffff" />

        <rect x={20} y={20} width={250} height={60} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={145} y={44} className="mlr-c">
          config.architectures
        </text>
        <text x={145} y={64} className="mlr-s">
          tried in order, first registered wins
        </text>

        <rect x={20} y={120} width={250} height={100} rx={6} fill="#f2f8fd" stroke="#0972d3" />
        <text x={145} y={144} className="mlr-t">
          ModelRegistry (registry.py)
        </text>
        <text x={145} y={164} className="mlr-s">
          ~390 architecture strings, each a
        </text>
        <text x={145} y={182} className="mlr-c">
          _LazyRegisteredModel
        </text>
        <text x={145} y={200} className="mlr-s">
          (module, class) stored as strings
        </text>

        <rect x={330} y={120} width={200} height={100} rx={6} fill="#fbf3d5" stroke="#8b6c00" />
        <text x={430} y={144} className="mlr-c">
          inspect_model_cls()
        </text>
        <text x={430} y={164} className="mlr-s">
          child process + file-hash
        </text>
        <text x={430} y={182} className="mlr-s">
          cache, so no CUDA init
        </text>
        <text x={430} y={200} className="mlr-s">
          returns _ModelInfo
        </text>

        <rect x={590} y={120} width={250} height={100} rx={6} fill="#f2f8fd" stroke="#0972d3" />
        <text x={715} y={144} className="mlr-c">
          LlamaForCausalLM
        </text>
        <text x={715} y={164} className="mlr-s">
          lazy import from one of two homes:
        </text>
        <text x={715} y={182} className="mlr-s">
          vllm.model_executor.models.llama
        </text>
        <text x={715} y={200} className="mlr-s">
          vllm.models.&lt;name&gt; (nvidia/ or amd/)
        </text>

        <rect x={20} y={270} width={250} height={92} rx={6} fill="#e6f4f2" stroke="#1f7a70" />
        <text x={145} y={294} className="mlr-t">
          Transformers backend
        </text>
        <text x={145} y={314} className="mlr-s">
          --model-impl transformers, or auto
        </text>
        <text x={145} y={332} className="mlr-s">
          when no listed name is registered
        </text>
        <text x={145} y={350} className="mlr-s">
          model_executor/models/transformers/
        </text>

        <rect x={590} y={270} width={250} height={92} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={715} y={294} className="mlr-t">
          vLLM layers (layers/linear.py)
        </text>
        <text x={715} y={314} className="mlr-s">
          QKVParallelLinear
        </text>
        <text x={715} y={332} className="mlr-s">
          MergedColumnParallelLinear
        </text>
        <text x={715} y={350} className="mlr-s">
          RowParallelLinear
        </text>

        <line x1={145} y1={80} x2={145} y2={116} className="mlr-arr" />
        <line x1={270} y1={170} x2={326} y2={170} className="mlr-arr" />
        <text x={300} y={160} className="mlr-e" textAnchor="middle">
          inspect
        </text>
        <line x1={530} y1={170} x2={586} y2={170} className="mlr-arr" />
        <text x={560} y={160} className="mlr-e" textAnchor="middle">
          load
        </text>
        <line x1={145} y1={220} x2={145} y2={266} className="mlr-arr" />
        <text x={155} y={248} className="mlr-e">
          fallback
        </text>
        <line x1={715} y1={220} x2={715} y2={266} className="mlr-arr" />
        <text x={725} y={248} className="mlr-e">
          composes
        </text>
        <line x1={270} y1={316} x2={586} y2={316} className="mlr-arr" />
        <text x={428} y={306} className="mlr-e" textAnchor="middle">
          swaps HF modules for the same layers
        </text>
      </svg>
    </div>
  );
}

function QuantDispatchDiagram() {
  const boxW = 186;
  const gap = 16;
  const x0 = 34;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 450"
        role="img"
        aria-labelledby="ml-quant-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="ml-quant-title">
          LinearBase.__init__ calls resolve_quant_method, which returns the checkpoint&apos;s
          quantization method or, for a layer the checkpoint left unquantized, the targeted online
          method. The method picks a kernel per layer through choose_scaled_mm_linear_kernel: the
          CUDA list for block-scaled FP8, narrowed first by any --linear-backend setting, is walked
          in order from FlashInfer plus DeepGEMM down to BlockWise Torch, and the first kernel that
          is enabled, supported on the device and able to implement the layer wins. forward then
          calls apply, which runs that kernel.
        </title>
        <style>{`
          .mlq-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .mlq-c { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .mlq-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .mlq-e { fill: #5f6b7a; font: 600 10px sans-serif; }
          .mlq-k { fill: #16191f; font: 600 12px sans-serif; }
          .mlq-ks { fill: #5f6b7a; font: 10px sans-serif; }
          .mlq-n { font: 600 10px sans-serif; text-anchor: middle; }
          .mlq-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#mlq-ah); }
        `}</style>
        <defs>
          <marker
            id="mlq-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={450} rx={8} fill="#ffffff" />

        <rect x={20} y={20} width={390} height={92} rx={6} fill="#f2f8fd" stroke="#0972d3" />
        <text x={215} y={44} className="mlq-t">
          LinearBase.__init__ (linear.py)
        </text>
        <text x={215} y={64} className="mlq-c">
          resolve_quant_method(quant_config, self, prefix)
        </text>
        <text x={215} y={82} className="mlq-s">
          checkpoint method, or the targeted online one
        </text>
        <text x={215} y={99} className="mlq-s">
          stored as self.quant_method
        </text>

        <rect x={450} y={20} width={390} height={92} rx={6} fill="#fbf3d5" stroke="#8b6c00" />
        <text x={645} y={44} className="mlq-t">
          QuantizeMethodBase (base_config.py)
        </text>
        <text x={645} y={64} className="mlq-s">
          create_weights(): allocate parameters
        </text>
        <text x={645} y={82} className="mlq-s">
          process_weights_after_loading(): repack once
        </text>
        <text x={645} y={99} className="mlq-s">
          apply(): runs on every forward
        </text>

        <rect x={20} y={150} width={390} height={74} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={215} y={174} className="mlq-t">
          forward()
        </text>
        <text x={215} y={194} className="mlq-c">
          self.quant_method.apply(self, x, bias)
        </text>
        <text x={215} y={212} className="mlq-s">
          runs the kernel picked when the layer was built
        </text>

        <rect x={450} y={150} width={390} height={74} rx={6} fill="#fbf3d5" stroke="#8b6c00" />
        <text x={645} y={172} className="mlq-c">
          choose_scaled_mm_linear_kernel()
        </text>
        <text x={645} y={192} className="mlq-s">
          --linear-backend filter, then the first kernel
        </text>
        <text x={645} y={210} className="mlq-s">
          enabled + is_supported() + can_implement()
        </text>

        <line x1={410} y1={66} x2={446} y2={66} className="mlq-arr" />
        <line x1={215} y1={112} x2={215} y2={146} className="mlq-arr" />
        <line x1={645} y1={112} x2={645} y2={146} className="mlq-arr" />
        <text x={655} y={134} className="mlq-e">
          picks a kernel per layer
        </text>
        <line x1={645} y1={224} x2={645} y2={258} className="mlq-arr" />

        <rect x={20} y={262} width={820} height={170} rx={6} fill="#f7f8fa" stroke="#879596" />
        <text x={430} y={286} className="mlq-t">
          kernels/linear/: CUDA list for block-scaled FP8, first match wins
        </text>
        {FP8_BLOCK_CUDA.map((k, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = x0 + col * (boxW + gap);
          const y = 302 + row * 66;
          const first = i === 0;
          return (
            <g key={k.label}>
              <rect
                x={x}
                y={y}
                width={boxW}
                height={56}
                rx={5}
                fill={first ? '#f2f8fd' : '#ffffff'}
                stroke={first ? '#0972d3' : '#879596'}
              />
              <circle cx={x + 17} cy={y + 28} r={10} fill={first ? '#0972d3' : '#5f6b7a'} />
              <text x={x + 17} y={y + 32} className="mlq-n" fill="#ffffff">
                {i + 1}
              </text>
              <text x={x + 34} y={y + 25} className="mlq-k">
                {k.label}
              </text>
              <text x={x + 34} y={y + 42} className="mlq-ks">
                {k.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function CodebaseModelLayer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which class runs your checkpoint, which kernel your quantized layers land on, and what a LoRA adapter adds to each linear layer (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Model Layer, Quantization &amp; LoRA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> The model layer is the seam between a
            Hugging Face (HF) checkpoint and a graph vLLM can run. It answers three questions in
            sequence: which class implements this architecture (the registry), how each linear
            layer turns weights into math (quantization dispatch), and how per-request adapters
            change that math without reloading weights (LoRA, low-rank adaptation). The code
            sits in three places: <code>vllm/model_executor/</code> for the registry, layers and
            kernels, <code>vllm/models/</code> for newer hardware-isolated model packages, and{' '}
            <code>vllm/lora/</code>. Most model files build attention through the generic{' '}
            <code>Attention</code> layer and never name a backend; a minority import
            attention-backend code directly (21 of the 285 Python files in{' '}
            <code>vllm/model_executor/models/</code>, MLA (multi-head latent attention) models
            and vision encoders among them){' '}
            <Cite tier={1} href={`${TREE}/vllm/model_executor/models`} kind="code">
              vllm/model_executor/models/
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The design tension.</strong> vLLM registers about 390 architectures, dozens
            of quantization methods and a stack of hardware-specific kernels. Importing all of
            that eagerly would pull CUDA into the parent process before the workers fork, for
            code a given deployment never uses, and a forked worker cannot re-initialize CUDA.
            The layer is built around lazy resolution and priority-based dispatch for that
            reason.
          </Box>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href={TREE}>
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            : <code>vllm/model_executor/models/</code> (<code>registry.py</code>,{' '}
            <code>interfaces.py</code>, <code>transformers/</code>), <code>vllm/models/</code>,{' '}
            <code>vllm/model_executor/layers/linear.py</code>,{' '}
            <code>vllm/model_executor/layers/quantization/base_config.py</code>,{' '}
            <code>vllm/model_executor/kernels/linear/</code>,{' '}
            <code>vllm/model_executor/custom_op.py</code>, <code>vllm/lora/</code>,{' '}
            <code>vllm/plugins/</code>, <code>docs/contributing/model/registration.md</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How vLLM picks the class for your checkpoint without touching CUDA, and what the error means when it finds none"
          >
            The model registry
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mapping.</strong> <code>ModelRegistry</code> (a module-level{' '}
            <code>_ModelRegistry</code> instance in{' '}
            <code>vllm/model_executor/models/registry.py</code>) holds about 390 architecture
            strings: 387 unique keys in <code>_VLLM_MODELS</code>, merged from{' '}
            <code>_TEXT_GENERATION_MODELS</code>, <code>_EMBEDDING_MODELS</code>,{' '}
            <code>_MULTIMODAL_MODELS</code> and seven more tables{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L773-L784')}>
              registry.py L773-L784
            </Cite>
            . The checkpoint&apos;s <code>config.architectures</code> supplies the names, and
            vLLM tries each one in order; the first registered name wins{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1401-L1405')}>
              registry.py L1401-L1405
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Why lazy.</strong> Each entry is a <code>_LazyRegisteredModel</code> that
            stores the module path and class name as <em>strings</em> rather than importing the
            class. The real import only happens in <code>load_model_cls()</code>, which calls{' '}
            <code>importlib.import_module(self.module_name)</code> and pulls the attribute{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L951-L955')}>
              registry.py L951-L955
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1082-L1084')}>
              L1082-L1084
            </Cite>
            . This keeps the registry import cheap and avoids initializing CUDA in the parent
            process. That matters because forked workers cannot re-initialize CUDA, the{' '}
            <code>RuntimeError: Cannot re-initialize CUDA in forked subprocess</code> failure
            the <code>register_model</code> docstring names{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1128-L1135')}>
              registry.py L1128-L1135
            </Cite>
            .
          </Box>
          <RegistryDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. Llama stands in for any registered class; the
            architecture count is cited above.
          </Box>
          <Box variant="p">
            <strong>Capability inspection in a child process.</strong> vLLM needs to know each
            model&apos;s capabilities (text generation or pooling, multimodal input,
            pipeline-parallel support, attention type) <em>before</em> deciding how to run it.{' '}
            <code>inspect_model_cls()</code> locates the model&apos;s source and hashes it with{' '}
            <code>safe_hash</code>, which uses md5 and falls back to sha256 where FIPS (Federal
            Information Processing Standards) mode rules md5 out. The hash is the cache key for a
            JSON <code>_ModelInfo</code> file under <code>VLLM_CACHE_ROOT/modelinfos</code>. When the
            module is a package <code>__init__.py</code>, the hash covers every{' '}
            <code>.py</code> file in the package, and modules outside{' '}
            <code>vllm/model_executor/models</code> are located with{' '}
            <code>importlib.util.find_spec</code>, so the <code>vllm.models</code> packages
            cache too{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L957-L982')}>
              registry.py L957-L982
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1034-L1080')}>
              L1034-L1080
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/utils/hashing.py', 'L106-L121')}>
              hashing.py L106-L121
            </Cite>
            . On a cache miss it imports and inspects the class in a separate process via{' '}
            <code>_run_in_subprocess</code> (cloudpickle plus a child <code>python</code>{' '}
            invocation); the inline comment reads &quot;Performed in another process to avoid
            initializing CUDA&quot;{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1531-L1555')}>
              registry.py L1531-L1555
            </Cite>
            . The cache means this step runs once per version of the model source, not once
            per launch.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">Stored as strings</Box>
              <Box variant="p">
                <code>module_name</code> and <code>class_name</code> only. No import until the
                model is actually selected.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Inspected in a child process</Box>
              <Box variant="p">
                Capabilities computed in a child process so the parent never touches CUDA.
                The result is a plain-data <code>_ModelInfo</code>.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Cached by content hash</Box>
              <Box variant="p">
                JSON keyed on the hash of the model file, or of every file in a model
                package. A changed hash triggers re-inspection; a match skips the child
                process.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            <strong>Two homes for model code.</strong>{' '}
            <code>vllm/model_executor/models/</code> holds the portable, flat single-file
            implementations. <code>vllm/models/&lt;name&gt;/</code> holds large frontier models
            as hardware-isolated packages (<code>deepseek_v4</code>, <code>kimi_k3</code>,{' '}
            <code>minimax_m3</code> and seven more, plus a shared <code>common/</code>{' '}
            <Cite tier={1} href={`${TREE}/vllm/models`}>
              vllm/models/
            </Cite>
            ), and each package&apos;s <code>__init__.py</code> imports the implementation for the
            current platform, from <code>nvidia/</code> or <code>amd/</code> in most packages{' '}
            <Cite tier={1} href={vllmUrl('vllm/models/kimi_k3/__init__.py', 'L3-L35')}>
              kimi_k3/__init__.py L3-L35
            </Cite>
            . A registry entry names its module relative to{' '}
            <code>vllm.model_executor.models</code> unless the path starts with{' '}
            <code>vllm.</code>, so both homes resolve the same way{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1509-L1515')}>
              registry.py L1509-L1515
            </Cite>
            ; 29 entries point into <code>vllm/models/</code>{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L71-L771')} kind="code">
              registry.py L71-L771
            </Cite>
            . To read the code behind a frontier model, start in <code>vllm/models/</code>.
          </Box>
          <Box variant="p">
            <strong>When vLLM has no class: the Transformers backend.</strong>{' '}
            <code>--model-impl</code> takes <code>auto</code> (the default),{' '}
            <code>vllm</code>, <code>transformers</code> or <code>terratorch</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L364-L370')}>
              model.py L364-L370
            </Cite>
            . Under <code>auto</code>, when no name in <code>config.architectures</code> is
            registered, vLLM wraps the Hugging Face Transformers implementation instead;{' '}
            <code>transformers</code> forces that path, and <code>vllm</code> turns the
            fallback off so an unregistered architecture fails at startup{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1366-L1418')}>
              registry.py L1366-L1418
            </Cite>
            . The backend sets the model&apos;s attention implementation to vLLM&apos;s and
            replaces <code>nn.Linear</code>, vocabulary embeddings and RMSNorm (root mean square
            normalization) modules with vLLM&apos;s tensor-parallel layers{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/model_executor/models/transformers/base.py', 'L199-L207')}
            >
              transformers/base.py L199-L207
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/model_executor/models/transformers/base.py', 'L458-L469')}
            >
              L458-L469
            </Cite>
            . The vLLM project&apos;s v0.25.0 release notes call it &quot;as fast as native
            vLLM&quot;, a project claim not measured here{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.25.0`}>
              vLLM v0.25.0 release notes
            </Cite>
            . Fourteen architectures, including the Olmo family, GPTBigCode, Starcoder2 and
            SmolLM3, are registered only against the Transformers backend{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L710-L736')}>
              registry.py L710-L736
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>When no class is found.</strong> The error names the reason, and each
            reason has its own fix{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1167-L1195')}>
              registry.py L1167-L1195
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L792-L853')}>
              L792-L853
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1101-L1110')}>
              L1101-L1110
            </Cite>
            :
          </Box>
          <Table
            items={archErrorRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'message',
                header: 'Message begins',
                cell: (r) => <code>{r.message}</code>,
                minWidth: 200,
              },
              { id: 'meaning', header: 'What it means', cell: (r) => r.meaning, minWidth: 240 },
              { id: 'action', header: 'What to do', cell: (r) => r.action, minWidth: 180 },
            ]}
          />

          <ExpandableSection headerText="Capability interfaces (interfaces.py)">
            <SpaceBetween size="m">
              <Box variant="p">
                The capabilities the registry inspects are declared as runtime-checkable
                protocols in <code>vllm/model_executor/models/interfaces.py</code>. Most are
                marker protocols: a model opts in by setting a <code>ClassVar</code> flag (e.g.{' '}
                <code>supports_lora = True</code>) and, where required, implementing a method.{' '}
                <code>isinstance</code> / <code>issubclass</code> checks against the protocol are
                how the rest of the engine discovers what a model can do{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/model_executor/models/interfaces.py', 'L168-L171')}
                >
                  interfaces.py L168-L171
                </Cite>
                .
              </Box>
              <Table
                items={protocolRows}
                variant="embedded"
                wrapLines
                columnDefinitions={[
                  {
                    id: 'protocol',
                    header: 'Interface',
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
                Other protocols in the same file include <code>SupportsTranscription</code>,{' '}
                <code>HasInnerState</code>, <code>IsHybrid</code>,{' '}
                <code>IsAttentionFree</code>, <code>SupportsEagle</code> /{' '}
                <code>SupportsEagle3</code>, and <code>SupportsMRoPE</code>. All follow the same
                pattern, one per capability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Adding a model: the plugin entry point and the class contract">
            <SpaceBetween size="s">
              <Box variant="p">
                An out-of-tree model is an <code>nn.Module</code> whose <code>forward</code>{' '}
                takes <code>input_ids</code> and <code>positions</code> and returns hidden
                states, composed from the <code>layers/</code> primitives{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/model_executor/models/interfaces_base.py', 'L56')}
                >
                  interfaces_base.py L56
                </Cite>
                . It is registered from a plugin: a function under the{' '}
                <code>vllm.general_plugins</code> entry-point group that calls{' '}
                <code>
                  ModelRegistry.register_model(&quot;YourModelForCausalLM&quot;,
                  &quot;your_code:YourModelForCausalLM&quot;)
                </code>{' '}
                <Cite tier={1} href={vllmDocsUrl('contributing/model/registration/')}>
                  vLLM docs: Registering a model
                </Cite>{' '}
                <Cite tier={1} href={vllmDocsUrl('design/plugin_system/')}>
                  vLLM docs: Plugin system
                </Cite>
                . vLLM loads general plugins in every process: the main process, the engine core
                and each worker{' '}
                <Cite tier={1} href={vllmUrl('vllm/plugins/__init__.py', 'L16-L18')}>
                  plugins/__init__.py L16-L18
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L123-L125')}>
                  core.py L123-L125
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/worker_base.py', 'L267-L269')}>
                  worker_base.py L267-L269
                </Cite>
                . Each process registers into its own <code>ModelRegistry</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1124-L1129')}>
                  model.py L1124-L1129
                </Cite>
                , so the registration function must be safe to run several times per
                deployment, as the loader&apos;s docstring warns.{' '}
                <code>VLLM_PLUGINS</code> limits which plugins load, by name{' '}
                <Cite tier={1} href={vllmUrl('vllm/plugins/__init__.py', 'L36-L91')}>
                  plugins/__init__.py L36-L91
                </Cite>
                .
              </Box>
              <Box variant="p">
                Passing the class as a <code>&quot;module:class&quot;</code> string keeps the
                lazy-import, no-CUDA-in-parent property the built-in registry relies on; the
                registration guide says to consider it when the model imports modules that
                initialize CUDA{' '}
                <Cite tier={1} href={vllmUrl('docs/contributing/model/registration.md', 'L36-L47')}>
                  registration.md L36-L47
                </Cite>
                . Opting into a capability is additive: inherit the protocol (or
                set its <code>ClassVar</code> flag) and the next inspection picks it up, because
                a changed source hash invalidates the cached <code>_ModelInfo</code>{' '}
                <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L998-L1004')}>
                  registry.py L998-L1004
                </Cite>
                .
              </Box>
              <Box variant="p">
                For a model added to vLLM itself, the registration guide says to put the file
                in <code>vllm/model_executor/models</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('docs/contributing/model/registration.md', 'L14')}
                  kind="doc-code-conflict"
                >
                  registration.md L14
                </Cite>
                . The registry disagrees for newer models: 29 entries point into{' '}
                <code>vllm/models/</code>{' '}
                <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L71-L771')} kind="code">
                  registry.py L71-L771
                </Cite>
                , and the contributor labelling guide notes that newer
                models live in <code>vllm/models/&lt;model&gt;/</code>{' '}
                <Cite tier={1} href={vllmUrl('docs/contributing/labels.md', 'L72-L74')}>
                  labels.md L72-L74
                </Cite>
                . Both locations load, because the registry accepts either path; the packages
                in <code>vllm/models/</code> are the pattern for a model with per-vendor
                implementations.
              </Box>
              <Box variant="p">
                Two shortcuts sit beside the plugin route.{' '}
                <code>--model-class-overrides</code> registers a{' '}
                <code>&quot;module:class&quot;</code> target for an architecture in every
                process, for development and debugging only{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L323-L329')}>
                  model.py L323-L329
                </Cite>
                . And a plugin can replace a layer without touching model code:{' '}
                <code>LinearBase</code> is a <code>PluggableLayer</code>, and a class registered
                with <code>register_oot</code> under an in-tree layer&apos;s class name is
                instantiated in its place{' '}
                <Cite tier={1} href={vllmUrl('vllm/model_executor/custom_op.py', 'L32-L95')}>
                  custom_op.py L32-L95
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/model_executor/layers/linear.py', 'L242')}>
                  linear.py L242
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which kernel a quantized layer runs on, why that differs by GPU, and the settings that change the choice"
          >
            Quantization dispatch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The dispatch point.</strong> Quantization, whether FP8 (8-bit floating
            point) or a 4-bit format, is localized to the linear layers in{' '}
            <code>vllm/model_executor/layers/linear.py</code>. <code>LinearBase.__init__</code>{' '}
            installs <code>UnquantizedLinearMethod</code> when there is no{' '}
            <code>quant_config</code>; otherwise it calls <code>resolve_quant_method()</code>{' '}
            and stores the result as <code>self.quant_method</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/model_executor/layers/linear.py', 'L286-L293')}>
              linear.py L286-L293
            </Cite>
            . That function asks the checkpoint&apos;s{' '}
            <code>QuantizationConfig.get_quant_method()</code> first. When online quantization
            is configured and targets this layer, and the checkpoint left the layer
            unquantized, it substitutes the online method; requesting online quantization for a
            layer the checkpoint already quantized raises a <code>ValueError</code>. Only{' '}
            <code>LinearBase</code> and routed-expert layers take part; embeddings and the LM
            (language model) head keep the checkpoint&apos;s method{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/model_executor/layers/quantization/base_config.py', 'L285-L325')}
            >
              base_config.py L285-L325
            </Cite>
            . From then on the layer never branches on format: <code>forward</code> calls{' '}
            <code>self.quant_method.apply(self, x, bias)</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/model_executor/layers/linear.py', 'L417')}>
              linear.py L417
            </Cite>
            .
          </Box>
          <QuantDispatchDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. The kernel order is the CUDA list cited below.
          </Box>
          <Box variant="p">
            <strong>The interface.</strong> Every quantization scheme implements two ABCs
            (abstract base classes) in{' '}
            <code>vllm/model_executor/layers/quantization/base_config.py</code>:{' '}
            <code>QuantizationConfig</code> (parses the checkpoint&apos;s quant metadata,
            exposes <code>get_name</code>, <code>get_min_capability</code>, and{' '}
            <code>get_quant_method</code>) and <code>QuantizeMethodBase</code> (the per-layer
            method with <code>create_weights</code>, <code>apply</code>, and an optional{' '}
            <code>process_weights_after_loading</code>){' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/model_executor/layers/quantization/base_config.py', 'L23-L208')}
            >
              base_config.py L23-L208
            </Cite>
            . The lifecycle is fixed: <code>create_weights</code> allocates parameters at
            construction, <code>process_weights_after_loading</code> runs once after the
            checkpoint is loaded (repacking, transposing, or quantizing in place), and{' '}
            <code>apply</code> runs on every forward.
          </Box>
          <Box variant="p">
            <strong>Kernel selection by priority.</strong> A single format (say block-scaled
            FP8) can map to several kernels. The quantization method picks
            one per layer while it builds the layer, as <code>Fp8LinearMethod</code> does in{' '}
            <code>create_weights</code>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/model_executor/layers/quantization/fp8.py', 'L347-L353')}
            >
              fp8.py L347-L353
            </Cite>
            , through the chooser functions in <code>vllm/model_executor/kernels/linear/</code>.
            Each chooser narrows the platform&apos;s priority list to the family named by{' '}
            <code>--linear-backend</code> (or a per-scheme entry in{' '}
            <code>linear_backend_per_quant</code>), then returns the first kernel that is not
            disabled by <code>VLLM_DISABLED_KERNELS</code>, reports <code>is_supported()</code>{' '}
            on this device and can implement this layer&apos;s configuration{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L606-L698')}>
              kernels/linear/__init__.py L606-L698
            </Cite>
            . The CUDA list for block-scaled FP8 has eight entries{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L455-L467')}>
              L455-L467
            </Cite>
            :
          </Box>
          <ColumnLayout columns={4} variant="text-grid">
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
          <Box variant="small" color="text-body-secondary">
            Descriptions come from each kernel class and its <code>is_supported()</code>{' '}
            check:{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/flashinfer.py`, 'L149-L157')}>
              flashinfer.py L149-L157
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/b12x.py`, 'L49-L50')}>
              b12x.py L49-L50
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/marlin.py`, 'L29-L32')}>
              marlin.py L29-L32
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/humming.py`, 'L26-L42')}>
              humming.py L26-L42
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/pytorch.py`, 'L269-L270')}>
              pytorch.py L269-L270
            </Cite>
            .
          </Box>
          <Alert type="info">
            Taking the first match is why the same checkpoint runs on different kernels across
            GPUs with no change to model or config code. DeepGEMM reports support only on Hopper and
            Blackwell{' '}
            <Cite
              tier={1}
              href={vllmUrl(`${SCALED_MM}/deep_gemm.py`, 'L47-L52')}
            >
              deep_gemm.py L47-L52
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L709-L715')}>
              cuda.py L709-L715
            </Cite>
            , so an older GPU walks on down the list. Marlin accepts every layer from compute
            capability 7.5 and runs FP8 weight-only, so that is where an Ampere or Turing GPU
            ends up{' '}
            <Cite tier={1} href={vllmUrl(`${SCALED_MM}/marlin.py`, 'L29-L49')}>
              marlin.py L29-L49
            </Cite>
            . Separate lists cover INT8 (8-bit integer), per-tensor and
            per-channel FP8, weight-only FP8 (W8A16: 8-bit weights, 16-bit activations), MXFP8, MXFP6 and MXFP4
            (microscaling formats), NVFP4 (NVIDIA 4-bit floating point) and mixed-precision
            weight-only formats{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L408-L598')}>
              kernels/linear/__init__.py L408-L598
            </Cite>
            .
          </Alert>
          <Box variant="p">
            <strong>Overriding the order.</strong> <code>--linear-backend</code> (for example{' '}
            <code>marlin</code>, <code>triton</code>, <code>deep_gemm</code> or{' '}
            <code>cutlass</code>) forces a kernel family, and{' '}
            <code>linear_backend_per_quant</code> in <code>--kernel-config</code> sets one per
            quantization scheme, such as <code>{'{"nvfp4_w4a16": "humming"}'}</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kernel.py', 'L293-L327')}>
              kernel.py L293-L327
            </Cite>
            . A family with no kernel for some layer type does not fail startup: vLLM logs
            &quot;--linear-backend=X was requested, but no X kernel exists for ... layers;
            falling back to normal kernel selection for this layer&quot; and walks the full
            list for those layers{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L374-L405')}>
              kernels/linear/__init__.py L374-L405
            </Cite>
            . For which formats exist and which GPU generation each needs, see section 8
            (Quantization &amp; Precision) and the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference dive
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How one batch serves many adapters, and what --fully-sharded-loras changes under tensor parallelism"
          >
            LoRA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape that makes batched LoRA work.</strong> vLLM serves many adapters
            concurrently, so adapter weights are not stored per request. They are pre-allocated
            into stacked buffers shaped <code>[max_loras, 1, ...]</code>:{' '}
            <code>lora_a_stacked</code> and <code>lora_b_stacked</code> are{' '}
            <code>torch.zeros(max_loras, 1, ...)</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/base_linear.py', 'L133-L151')}>
              base_linear.py L133-L151
            </Cite>
            . A per-token index tensor then selects which adapter slice each token uses, so a
            single batched GEMM (general matrix multiply) covers a batch spanning multiple
            adapters.
          </Box>
          <Box variant="p">
            <strong>The default path: one fused call per layer.</strong> A LoRA-wrapped linear
            layer leaves the base weight alone and adds a low-rank delta. It computes the base
            output, then <code>punica_wrapper.add_lora_linear()</code> runs the shrink GEMM
            through <code>lora_a</code> and the expand GEMM through <code>lora_b</code> and adds
            the delta to the output in place{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/base_linear.py', 'L198-L235')}>
              base_linear.py L198-L235
            </Cite>
            . On a column-parallel layer only <code>lora_b</code> is sharded, so each TP
            (tensor-parallel) rank computes the full shrink and its own slice of the expand{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/base_linear.py', 'L115-L121')}>
              L115-L121
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/lora/layers/column_parallel_linear.py', 'L99')}
            >
              column_parallel_linear.py L99
            </Cite>
            ; a row-parallel layer&apos;s delta rides the base layer&apos;s existing
            all-reduce{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/row_parallel_linear.py', 'L42-L77')}>
              row_parallel_linear.py L42-L77
            </Cite>
            . Neither adds a collective. The shrink and expand GEMMs are fused multi-adapter
            Triton kernels{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/punica_wrapper/punica_gpu.py', 'L18-L24')}>
              punica_gpu.py L18-L24
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The fully sharded path: shrink, all-gather, expand.</strong>{' '}
            <code>--fully-sharded-loras</code> shards <code>lora_a</code> across TP ranks as
            well, so no rank repeats the full shrink. The column-parallel layers then switch to
            the <code>*WithShardedLoRA</code> classes, whose <code>_mcp_apply</code> runs three
            steps{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/lora/layers/column_parallel_linear.py', 'L24-L73')}
            >
              column_parallel_linear.py L24-L73
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/lora/layers/column_parallel_linear.py', 'L519-L537')}
            >
              L519-L537
            </Cite>
            :
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">1: Shrink</Box>
              <Box variant="p">
                <code>add_shrink</code>: input to this rank&apos;s share of the LoRA rank via
                stacked <code>lora_a</code>. Output is a small{' '}
                <code>[slices, tokens, rank]</code> buffer.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">2: All-gather</Box>
              <Box variant="p">
                <code>tensor_model_parallel_all_gather</code> over the rank dim, since{' '}
                <code>lora_a</code> is sharded but the expand needs the full rank.
              </Box>
            </div>
            <div>
              <Box variant="awsui-key-label">3: Expand</Box>
              <Box variant="p">
                <code>add_expand</code>: rank back up to output via stacked{' '}
                <code>lora_b</code>, accumulated in place onto the base output.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            The row-parallel sharded layer all-reduces its shrunk buffer instead{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/lora/layers/row_parallel_linear.py', 'L118-L135')}
            >
              row_parallel_linear.py L118-L135
            </Cite>
            . The flag trades a collective for less repeated shrink work. Its help text says
            only half of the LoRA computation is sharded by default and calls the fully sharded
            layers &quot;likely faster&quot; at high sequence length, maximum rank or
            tensor-parallel size; that is the project&apos;s guidance, not a measured figure{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/lora.py', 'L39-L43')}>
              lora.py L39-L43
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>Punica wrapper.</strong> The shrink and expand kernels live behind{' '}
            <code>vllm/lora/punica_wrapper/</code>. <code>punica_base.py</code> defines the
            abstract surface (<code>add_shrink</code>, <code>add_expand</code>,{' '}
            <code>add_lora_linear</code>, <code>add_lora_logits</code>) and{' '}
            <code>punica_gpu.py</code> implements it with Triton. Each platform names its wrapper
            class, and the selector logs it at startup as &quot;Using PunicaWrapperGPU.&quot; on
            CUDA{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/lora/punica_wrapper/punica_selector.py', 'L13-L21')}
            >
              punica_selector.py L13-L21
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L595-L596')}>
              cuda.py L595-L596
            </Cite>
            . Routing each token to the right adapter slice is exactly what Punica-style
            batched LoRA is for.
          </Box>

          <Alert type="warning">
            <strong>Static vs dynamic.</strong> Adapters named at startup are the production
            path. Adapters loaded and unloaded at request time use the same fixed{' '}
            <code>max_loras</code> GPU slots and kernels, since any adapter is moved into a free
            slot when a batch needs it{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/model_manager.py', 'L352-L375')}>
              model_manager.py L352-L375
            </Cite>
            . Runtime loading stays off unless <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code> is
            set{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1199-L1203')}>
              envs.py L1199-L1203
            </Cite>
            , and the LoRA docs keep it to isolated, fully trusted environments because of its
            security risk{' '}
            <Cite tier={1} href={vllmUrl('docs/features/lora.md', 'L109-L113')}>
              lora.md L109-L113
            </Cite>
            . Size{' '}
            <code>max_loras</code> for the concurrency you actually expect; section 13 (LoRA
            &amp; Multi-Adapter Serving) covers sizing.
          </Alert>

          <ExpandableSection headerText="A real in-code TODO worth knowing">
            <SpaceBetween size="s">
              <Box variant="p">
                The abstract base methods in{' '}
                <code>vllm/lora/punica_wrapper/punica_base.py</code> carry an explicit marker
                that the only implementation is the device-specific kernel.
                Both <code>add_lora_linear</code> and <code>add_lora_logits</code> on the base
                class end with <code>raise NotImplementedError</code>, each preceded by the
                comment <code># TODO: implement it based on torch ops</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/lora/punica_wrapper/punica_base.py', 'L375-L439')}
                >
                  punica_base.py L375-L439
                </Cite>
                .
              </Box>
              <Box variant="p">
                In other words, the base wrapper carries no fallback for the fused LoRA GEMMs.
                Each platform names its own wrapper: Triton on CUDA and ROCm, PyTorch ops on CPU{' '}
                <Cite tier={1} href={vllmUrl('vllm/lora/punica_wrapper/punica_cpu.py', 'L9-L23')}>
                  punica_cpu.py L9-L23
                </Cite>
                , and a platform that names none raises <code>NotImplementedError</code> when
                LoRA starts{' '}
                <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L1088-L1090')}>
                  interface.py L1088-L1090
                </Cite>
                . It is a small thing, but it tells you where the real work lives.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The log lines and flags that confirm which class, kernel and LoRA path a deployment is on"
          >
            What to check on a running deployment
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Model class.</strong> Startup logs &quot;Resolved architecture: X&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L696-L699')}>
              model.py L696-L699
            </Cite>
            . A <code>Transformers...</code> class name there means the fallback is running{' '}
            <Cite tier={1} href={vllmUrl(REGISTRY_PY, 'L1335-L1345')}>
              registry.py L1335-L1345
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1082-L1110')}>
              model.py L1082-L1110
            </Cite>
            ; the fourteen architectures registered against the backend log their own name
            instead.
          </Box>
          <Box variant="p">
            <strong>Quantization kernel.</strong> &quot;Selected &lt;kernel&gt; for
            &lt;method&gt;&quot; logs the winner once per kernel and method pair, for example
            for <code>Fp8LinearMethod</code>{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L724-L730')}>
              kernels/linear/__init__.py L724-L730
            </Cite>
            . <code>VLLM_DISABLED_KERNELS</code> takes a comma-separated list of kernel class
            names to skip{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1215-L1219')}>
              envs.py L1215-L1219
            </Cite>
            . When nothing fits, startup fails with &quot;Failed to find a kernel that can implement the ScaledMM linear
            layer. Reasons:&quot; and one line per kernel tried{' '}
            <Cite tier={1} href={vllmUrl(KERNELS_PY, 'L695-L698')}>
              L695-L698
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>LoRA.</strong> &quot;Using PunicaWrapperGPU.&quot; confirms the Triton
            kernels on CUDA. Under TP with large ranks or long sequences, benchmark{' '}
            <code>--fully-sharded-loras</code> against the default path before keeping it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
