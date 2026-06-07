import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';

interface BackendRow {
  backend: string;
  module: string;
  chosenWhen: string;
}

const backendRows: BackendRow[] = [
  {
    backend: 'FLASH_ATTN',
    module: 'backends/flash_attn.py',
    chosenWhen:
      'Default first choice for dense (non-MLA) models on most GPUs. validate_configuration requires compute capability >= 8.0 (Ampere+). FA3 picked automatically on Hopper.',
  },
  {
    backend: 'FLASHINFER',
    module: 'backends/flashinfer.py',
    chosenWhen:
      'First choice for dense models on Blackwell (device_capability.major == 10); second choice elsewhere, behind FLASH_ATTN.',
  },
  {
    backend: 'TRITON_ATTN',
    module: 'backends/triton_attn.py',
    chosenWhen:
      'Portable Triton fallback when neither FlashAttention nor FlashInfer validate for the configuration.',
  },
  {
    backend: 'FLEX_ATTENTION',
    module: 'backends/flex_attention.py',
    chosenWhen:
      'PyTorch FlexAttention path; near the bottom of the dense priority list, before TURBOQUANT.',
  },
  {
    backend: 'FLASH_ATTN_MLA',
    module: 'backends/mla/flashattn_mla.py',
    chosenWhen:
      'First MLA choice on pre-Blackwell GPUs (DeepSeek-style Multi-head Latent Attention models).',
  },
  {
    backend: 'FLASHMLA',
    module: 'backends/mla/flashmla.py',
    chosenWhen:
      'MLA path on Hopper/Blackwell (supports_compute_capability returns major in [9, 10]).',
  },
  {
    backend: 'FLASHINFER_MLA',
    module: 'backends/mla/flashinfer_mla.py',
    chosenWhen:
      'First MLA choice on Blackwell (major == 10); also leads the sparse-MLA list for FP8 KV cache.',
  },
  {
    backend: 'CUTLASS_MLA',
    module: 'backends/mla/cutlass_mla.py',
    chosenWhen:
      'Blackwell-only MLA (supports_compute_capability requires major == 10), forced block size 128.',
  },
  {
    backend: 'TRITON_MLA',
    module: 'backends/mla/triton_mla.py',
    chosenWhen:
      'Triton MLA fallback when no hardware-specific MLA kernel validates.',
  },
];

/**
 * Per-iteration forward-pass pipeline. SchedulerOutput enters the Worker,
 * the GPUModelRunner prepares inputs and attention metadata, the model runs
 * forward, and (in the second phase) the sampler produces tokens.
 */
function ForwardPipelineDiagram() {
  const stages = [
    { x: 10, label: 'SchedulerOutput', sub: 'tokens + block tables' },
    { x: 178, label: 'Worker.execute_model', sub: 'gpu_worker.py' },
    { x: 360, label: 'GPUModelRunner', sub: 'input prep + states' },
    { x: 528, label: 'attention metadata', sub: 'slot_mapping, varlen' },
    { x: 700, label: 'model forward', sub: 'PagedAttention kernels' },
    { x: 868, label: 'sampler', sub: 'sample_tokens()' },
  ];
  return (
    <svg
      viewBox="0 0 1000 150"
      role="img"
      width="100%"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <title>
        Per-iteration forward pass: SchedulerOutput to Worker.execute_model to
        GPUModelRunner input prep to attention metadata to model forward to sampler
      </title>
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect
            x={s.x}
            y={40}
            width={142}
            height={56}
            rx={6}
            fill={i === 4 ? '#0972d3' : '#f2f8fd'}
            stroke="#0972d3"
            strokeWidth={1.5}
          />
          <text
            x={s.x + 71}
            y={64}
            textAnchor="middle"
            fontSize={12.5}
            fontWeight="bold"
            fill={i === 4 ? '#ffffff' : '#0f1b2a'}
          >
            {s.label}
          </text>
          <text
            x={s.x + 71}
            y={82}
            textAnchor="middle"
            fontSize={10.5}
            fill={i === 4 ? '#e6f0fb' : '#5f6b7a'}
          >
            {s.sub}
          </text>
          {i < stages.length - 1 ? (
            <line
              x1={s.x + 142}
              y1={68}
              x2={s.x + 168}
              y2={68}
              stroke="#0972d3"
              strokeWidth={1.5}
              markerEnd="url(#arrowExec)"
            />
          ) : null}
        </g>
      ))}
      <defs>
        <marker
          id="arrowExec"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#0972d3" />
        </marker>
      </defs>
      <text x={10} y={124} fontSize={11} fill="#5f6b7a">
        {
          'Two-phase split: execute_model() runs through "model forward" and returns None; sample_tokens() then drains the stashed ExecuteModelState — enabling async scheduling to launch the next batch while this one samples.'
        }
      </text>
    </svg>
  );
}

/**
 * Attention-backend selection tree. CUDA platform branches first on use_mla,
 * then on device capability, producing an ordered priority list that each
 * backend's validate_configuration() filters down to one winner.
 */
function BackendSelectionDiagram() {
  return (
    <svg
      viewBox="0 0 1000 360"
      role="img"
      width="100%"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <title>
        Attention backend selection tree: branch on use_mla, then device
        capability major, producing an ordered priority list filtered by
        validate_configuration
      </title>
      {/* root */}
      <rect x={400} y={10} width={200} height={44} rx={6} fill="#0972d3" />
      <text x={500} y={30} textAnchor="middle" fontSize={12.5} fontWeight="bold" fill="#fff">
        get_attn_backend_cls()
      </text>
      <text x={500} y={46} textAnchor="middle" fontSize={10.5} fill="#e6f0fb">
        platforms/cuda.py
      </text>
      {/* use_mla branch */}
      <line x1={500} y1={54} x2={260} y2={86} stroke="#5f6b7a" strokeWidth={1.5} />
      <line x1={500} y1={54} x2={740} y2={86} stroke="#5f6b7a" strokeWidth={1.5} />
      <rect x={150} y={86} width={220} height={40} rx={6} fill="#eef6ec" stroke="#037f51" />
      <text x={260} y={104} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#0f1b2a">
        use_mla = False (dense)
      </text>
      <text x={260} y={119} textAnchor="middle" fontSize={10} fill="#5f6b7a">
        MHA / GQA / MQA
      </text>
      <rect x={630} y={86} width={220} height={40} rx={6} fill="#fdf3e7" stroke="#8d6e1f" />
      <text x={740} y={104} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#0f1b2a">
        use_mla = True
      </text>
      <text x={740} y={119} textAnchor="middle" fontSize={10} fill="#5f6b7a">
        DeepSeek-style MLA
      </text>
      {/* capability branch left (dense) */}
      <line x1={260} y1={126} x2={150} y2={158} stroke="#5f6b7a" strokeWidth={1.5} />
      <line x1={260} y1={126} x2={370} y2={158} stroke="#5f6b7a" strokeWidth={1.5} />
      <rect x={40} y={158} width={220} height={120} rx={6} fill="#f7faf6" stroke="#037f51" />
      <text x={150} y={177} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#0f1b2a">
        major == 10 (Blackwell)
      </text>
      <text x={150} y={198} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        1. FLASHINFER
      </text>
      <text x={150} y={214} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        2. FLASH_ATTN
      </text>
      <text x={150} y={230} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        3. TRITON_ATTN
      </text>
      <text x={150} y={246} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        4. FLEX_ATTENTION
      </text>
      <text x={150} y={262} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        5. TURBOQUANT
      </text>
      <rect x={280} y={158} width={220} height={120} rx={6} fill="#f7faf6" stroke="#037f51" />
      <text x={390} y={177} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#0f1b2a">
        else (Ampere / Hopper)
      </text>
      <text x={390} y={198} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        1. FLASH_ATTN
      </text>
      <text x={390} y={214} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        2. FLASHINFER
      </text>
      <text x={390} y={230} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        3. TRITON_ATTN
      </text>
      <text x={390} y={246} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        4. FLEX_ATTENTION
      </text>
      <text x={390} y={262} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        5. TURBOQUANT
      </text>
      {/* capability branch right (MLA) */}
      <line x1={740} y1={126} x2={630} y2={158} stroke="#5f6b7a" strokeWidth={1.5} />
      <line x1={740} y1={126} x2={850} y2={158} stroke="#5f6b7a" strokeWidth={1.5} />
      <rect x={520} y={158} width={220} height={120} rx={6} fill="#fcf7ee" stroke="#8d6e1f" />
      <text x={630} y={177} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#0f1b2a">
        major == 10 (Blackwell)
      </text>
      <text x={630} y={198} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        1. FLASHINFER_MLA
      </text>
      <text x={630} y={214} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        2. TOKENSPEED_MLA
      </text>
      <text x={630} y={230} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        3. CUTLASS_MLA
      </text>
      <text x={630} y={246} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        4. FLASH_ATTN_MLA
      </text>
      <text x={630} y={262} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        5. FLASHMLA / TRITON_MLA / sparse
      </text>
      <rect x={760} y={158} width={220} height={120} rx={6} fill="#fcf7ee" stroke="#8d6e1f" />
      <text x={870} y={177} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#0f1b2a">
        else (Hopper)
      </text>
      <text x={870} y={198} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        1. FLASH_ATTN_MLA
      </text>
      <text x={870} y={214} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        2. FLASHMLA
      </text>
      <text x={870} y={230} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        3. FLASHINFER_MLA
      </text>
      <text x={870} y={246} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        4. TRITON_MLA
      </text>
      <text x={870} y={262} textAnchor="middle" fontSize={10.5} fill="#0f1b2a">
        5. FLASHMLA_SPARSE
      </text>
      {/* filter footer */}
      <rect x={250} y={306} width={500} height={42} rx={6} fill="#f2f8fd" stroke="#0972d3" />
      <text x={500} y={324} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#0f1b2a">
        first backend whose validate_configuration() returns no reasons wins
      </text>
      <text x={500} y={340} textAnchor="middle" fontSize={10.5} fill="#5f6b7a">
        head size, dtype, kv-cache dtype, block size, sink, sparse all checked
      </text>
      <line x1={150} y1={278} x2={460} y2={306} stroke="#5f6b7a" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={390} y1={278} x2={480} y2={306} stroke="#5f6b7a" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={630} y1={278} x2={520} y2={306} stroke="#5f6b7a" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={870} y1={278} x2={540} y2={306} stroke="#5f6b7a" strokeWidth={1} strokeDasharray="4 3" />
    </svg>
  );
}

export function CodebaseExecution() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="The execution layer — how one scheduler step becomes a GPU forward pass and a row of sampled tokens (vLLM commit 15652a6b, accessed 2026-06-07)"
          >
            Execution &amp; Attention
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> The scheduler decides{' '}
            <em>what</em> runs each step; the execution layer makes it actually
            happen on the GPU. Two classes carry the weight.{' '}
            <code>Worker</code> (<code>vllm/v1/worker/gpu_worker.py</code>) owns
            the physical device — it sets the CUDA device, loads weights,
            profiles available memory, and on multi-node deployments handles
            pipeline-parallel send/receive of intermediate tensors. The{' '}
            <code>GPUModelRunner</code> (
            <code>vllm/v1/worker/gpu_model_runner.py</code>, roughly 7,560
            lines) is the workhorse: it turns a <code>SchedulerOutput</code> into
            packed input tensors, builds attention metadata, runs the model
            forward, and samples. Almost every execution-time feature — CUDA
            graphs, speculative decoding, LoRA, structured output, KV transfer —
            threads through this one file.
          </Box>
          <Box variant="p">
            <strong>Two model-runner generations coexist.</strong> The
            production runner is V1, the monolith described above. A V2 rewrite
            lives under <code>vllm/v1/worker/gpu/</code> (its{' '}
            <code>model_runner.py</code> is about 1,560 lines, decomposed into
            sub-modules for input batching, sampling, spec-decode, and CUDA
            graphs). The <code>Worker</code> picks between them at construction:{' '}
            <code>use_v2_model_runner</code> reads the{' '}
            <code>VLLM_USE_V2_MODEL_RUNNER</code> env var, and when unset falls
            back to a per-model default that also requires Triton and rejects
            unsupported features. V2 is opt-in and under active development — its
            README simply says {'"under active development"'} and names a
            maintainer.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">The per-iteration forward pipeline</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            One scheduler step drives one pass through the pipeline below. The
            interesting structural detail is the{' '}
            <strong>two-phase split</strong>: <code>execute_model()</code> runs
            everything up to and including the model forward, stashes the result
            in an <code>ExecuteModelState</code> tuple, and returns{' '}
            <code>None</code>. A separate <code>sample_tokens()</code> call then
            drains that state and produces the actual tokens. This split is what
            lets async scheduling overlap the next batch&apos;s preparation with
            this batch&apos;s sampling.
          </Box>
          <ForwardPipelineDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Input preparation</Box>
              <Box variant="p">
                <code>_update_states()</code> reconciles the persistent batch
                with the scheduler&apos;s adds/removes, then{' '}
                <code>_prepare_inputs()</code> packs the scheduled tokens into
                flat tensors. It uses <code>np.repeat</code> /{' '}
                <code>cumsum</code> tricks to build per-token request indices and
                cumulative sequence-length offsets — the ragged layout that
                varlen attention kernels consume. Block tables are committed
                first so the host-to-device copy overlaps the CPU work.
              </Box>
            </div>
            <div>
              <Box variant="h3">Attention metadata</Box>
              <Box variant="p">
                <code>_build_attention_metadata()</code> produces, per KV-cache
                group, the per-backend metadata object — query start locations,
                max sequence lengths, the <code>slot_mapping</code> that maps
                each token to its physical KV-cache slot, and the block table.
                The forward then runs inside{' '}
                <code>set_forward_context(...)</code>, which makes this metadata
                visible to the attention layers without passing it explicitly
                through every module.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">How the attention backend is chosen</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM does not hardcode an attention kernel. The registry (
            <code>vllm/v1/attention/backends/registry.py</code>) enumerates 28
            named backends in <code>AttentionBackendEnum</code> — FlashAttention,
            FlashInfer, the FlashMLA / CUTLASS-MLA / Triton-MLA family, ROCm and
            XPU variants, plus placeholders like <code>TORCH_SDPA</code> (used
            only for vision encoders), <code>NO_ATTENTION</code>, and{' '}
            <code>CUSTOM</code> — and a separate{' '}
            <code>MambaAttentionBackendEnum</code> holds six linear-attention /
            state-space backends. Each enum value is a class path that{' '}
            <code>register_backend()</code> can override at runtime.
          </Box>
          <Box variant="p">
            Selection (<code>vllm/v1/attention/selector.py</code> calling into{' '}
            <code>vllm/platforms/cuda.py</code>) is a per-GPU-capability priority
            tree. <code>_get_backend_priorities()</code> branches first on{' '}
            <code>use_mla</code>, then on{' '}
            <code>device_capability.major</code>, and returns an ordered list.{' '}
            <code>get_attn_backend_cls()</code> walks that list and asks each
            backend&apos;s <code>validate_configuration()</code> whether it
            supports the current head size, dtype, KV-cache dtype, block size,
            and so on — the first that returns no objections wins. An explicit{' '}
            <code>--attention-backend</code> short-circuits the whole tree (and
            errors loudly if that backend is invalid).
          </Box>
          <BackendSelectionDiagram />
          <Table
            items={backendRows}
            columnDefinitions={[
              {
                id: 'backend',
                header: 'Backend',
                cell: (r) => <code>{r.backend}</code>,
                minWidth: 150,
              },
              {
                id: 'module',
                header: 'Module',
                cell: (r) => <code>{r.module}</code>,
                minWidth: 200,
              },
              {
                id: 'chosenWhen',
                header: 'Chosen when',
                cell: (r) => r.chosenWhen,
                minWidth: 320,
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Selection logic verified in <code>_get_backend_priorities()</code>{' '}
            and <code>get_attn_backend_cls()</code> (
            <code>vllm/platforms/cuda.py</code>); per-backend capability gates
            from each backend&apos;s <code>supports_compute_capability()</code>{' '}
            (e.g. CUTLASS-MLA requires <code>major == 10</code>, FlashMLA{' '}
            <code>major in [9, 10]</code>, FlashAttention{' '}
            <code>capability &gt;= 8.0</code>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">CUDA graphs: why FA3 unlocks more capture</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            CUDA graphs replay a recorded sequence of kernel launches with
            near-zero CPU launch overhead — decisive for small-batch decode where
            the GPU would otherwise idle waiting on Python. But a captured graph
            is shape-rigid, so each backend declares how much batch variety its
            graph can tolerate via the <code>AttentionCGSupport</code> enum (
            <code>vllm/v1/attention/backend.py</code>): <code>NEVER</code>,{' '}
            <code>UNIFORM_SINGLE_TOKEN_DECODE</code>, <code>UNIFORM_BATCH</code>,
            and the strongest, <code>ALWAYS</code>.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                FlashAttention 2 <Badge color="grey">UNIFORM_BATCH</Badge>
              </Box>
              <Box variant="p">
                FA2 captures graphs with <code>max_query_len=1</code>. Those
                graphs work for uniform decode (and, with spec-decode, uniform
                multi-token decode) but <strong>not</strong> for a batch that
                mixes prefill and decode — a quirk of FA2&apos;s packed-GQA
                handling for the single-token case. So FA2 drops down to a
                piecewise-plus-full capture strategy.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                FlashAttention 3 <Badge color="green">ALWAYS</Badge>
              </Box>
              <Box variant="p">
                FA3 (and XPU) report <code>ALWAYS</code>: a single captured graph
                can serve a mixed prefill-plus-decode batch. That removes the
                need to split or pad batches to fit the graph, which is exactly
                the kind of overhead continuous batching is trying to eliminate.
                The version is detected at import via{' '}
                <code>get_flash_attn_version()</code>.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            The branch that sets this is literally{' '}
            <code>
              AttentionCGSupport.ALWAYS if get_flash_attn_version() == 3 ... else
              AttentionCGSupport.UNIFORM_BATCH
            </code>{' '}
            in <code>backends/flash_attn.py</code>. The model runner later
            reduces over all attention layers to a single{' '}
            <code>min_cg_support</code> — the weakest backend in the model caps
            what graphs the whole model can use.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">PagedAttention at execution time</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            PagedAttention is the idea that the KV cache is a pool of fixed-size
            blocks rather than one contiguous per-request buffer. At execution
            time that abstraction shows up in two concrete kernel calls inside{' '}
            <code>FlashAttentionImpl.forward()</code> (
            <code>backends/flash_attn.py</code>).
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">1. Scatter the new K/V</Box>
              <Box variant="p">
                Each step&apos;s freshly computed keys and values are written
                into the paged cache by{' '}
                <code>reshape_and_cache_flash(...)</code>, a custom op that uses
                the per-token <code>slot_mapping</code> to scatter each token
                into its physical block slot. The code note is explicit that the
                op reads the slot_mapping shape to find the real token count, so
                padded K/V tensors need no slicing.
              </Box>
            </div>
            <div>
              <Box variant="h3">2. Varlen attention over blocks</Box>
              <Box variant="p">
                Attention then runs via{' '}
                <code>flash_attn_varlen_func(...)</code>, fed the cumulative
                query offsets (<code>cu_seqlens_q</code>), per-sequence KV
                lengths, and the <code>block_table</code>. The kernel gathers
                each sequence&apos;s scattered KV blocks on the fly — no
                contiguous copy — so the ragged, paged layout is consumed
                directly by the fused attention kernel.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The net effect: the executor never materializes a per-request
            contiguous KV buffer. Tokens are scattered into a shared block pool
            on write, and gathered by block table on read, which is what lets
            vLLM pack many variable-length sequences into one batch without
            fragmentation.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">Pipeline parallelism in the Worker</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            On a pipeline-parallel deployment the <code>Worker</code> owns the
            stage-to-stage hand-off. In <code>execute_model()</code>, a non-first
            stage issues a non-blocking <code>irecv_tensor_dict()</code> to pull
            the previous stage&apos;s intermediate activations, wrapped in{' '}
            <code>AsyncIntermediateTensors</code>; a non-last stage finishes by
            launching a non-blocking <code>isend_tensor_dict()</code> of its own
            output, and the next call first waits on any outstanding send
            handles. Only the last pipeline stage returns a real{' '}
            <code>ModelRunnerOutput</code>; earlier stages return{' '}
            <code>None</code> after kicking off the send.
          </Box>
          <Alert type="warning">
            <strong>Async scheduling with PP is still uneven.</strong> The config
            carries an explicit note that{' '}
            {'"V1 Model Runner does not fully support async scheduling with PP"'},
            and <code>max_concurrent_batches</code> returns different values for
            V1 vs V2 to compensate — one of several places the older runner shows
            its seams.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h3">Honest rough edges</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The execution layer is fast and battle-tested, but it is not tidy.
            The 7,560-line model runner is itself the strongest signal that the
            V2 rewrite exists for a reason. A few in-code markers, quoted as they
            appear:
          </Box>
          <ExpandableSection headerText="Real TODO / FIXME comments in the source">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>FA2 CUDA-graph handling is admittedly a kludge.</strong>{' '}
                Right above the <code>UNIFORM_BATCH</code> assignment in{' '}
                <code>backends/flash_attn.py</code>:{' '}
                {
                  '"There’s probably a better way to describe this using AttentionCGSupport but for now just set it to UNIFORM_BATCH ... TODO(luka, lucas): audit FA2"'
                }{' '}
                — with a linked tracking issue. The current value is a deliberate
                drop-down, not a clean classification.
              </Box>
              <Box variant="p">
                <strong>Host-to-device copies are not all optimized.</strong> In{' '}
                <code>gpu_model_runner.py</code>, spec-decode input preparation
                carries {'"# TODO: Optimize the CPU -> GPU copy."'} right before a{' '}
                <code>torch.from_numpy(...).to(self.device)</code>, and a parallel
                comment near the start of input prep flags the draft-token copy
                the same way.
              </Box>
              <Box variant="p">
                <strong>
                  Pipeline-parallel SP path is acknowledged as rough.
                </strong>{' '}
                In the Worker, the SP padding computation is prefaced with{' '}
                {
                  '"TODO(lucas): This is pretty gross; ideally we should only ever call _determine_batch_execution_and_padding once ... but this requires a larger refactor of PP."'
                }
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="small">
            All quotes verified against{' '}
            <Link external href="https://github.com/vllm-project/vllm/tree/15652a6b">
              vllm-project/vllm @ 15652a6b
            </Link>
            : <code>vllm/v1/worker/gpu_model_runner.py</code>,{' '}
            <code>vllm/v1/worker/gpu_worker.py</code>,{' '}
            <code>vllm/v1/attention/backends/flash_attn.py</code>,{' '}
            <code>vllm/v1/attention/backends/registry.py</code>,{' '}
            <code>vllm/v1/attention/selector.py</code>,{' '}
            <code>vllm/platforms/cuda.py</code> (accessed 2026-06-07).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
