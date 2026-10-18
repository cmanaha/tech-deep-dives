import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../../components/Cite';

const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

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
      'First choice for dense (non-MLA) attention, except causal attention on compute capability 10.x. Requires compute capability >= 8.0. Runs FA3 (FlashAttention 3) on Hopper and FA4 on 10.x when that version is available, FA2 otherwise.',
  },
  {
    backend: 'FLASHINFER',
    module: 'backends/flashinfer.py',
    chosenWhen:
      'First choice for causal dense attention on compute capability 10.x (data-centre Blackwell); second elsewhere. Non-causal attention on 10.x (DFlash drafts) takes the FLASH_ATTN-first list.',
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
      'First MLA choice on Hopper (supports_compute_capability requires major == 9). On Ampere the list falls through to TRITON_MLA.',
  },
  {
    backend: 'FLASHMLA',
    module: 'backends/mla/flashmla.py',
    chosenWhen:
      'MLA path on Hopper and Blackwell (supports_compute_capability returns major in [9, 10]).',
  },
  {
    backend: 'FLASHINFER_MLA',
    module: 'backends/mla/flashinfer_mla.py',
    chosenWhen: 'First MLA choice on compute capability 10.x (major == 10 only).',
  },
  {
    backend: 'FLASHINFER_MLA_SPARSE',
    module: 'backends/mla/flashinfer_mla_sparse.py',
    chosenWhen:
      'Sparse sibling of FLASHINFER_MLA. On 10.x it leads the sparse-MLA pair for FP8 KV cache, and for BF16 KV cache at 16 heads or fewer.',
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
      'Triton MLA fallback with no compute-capability gate; first on compute capability 12.x.',
  },
];

interface GraphModeRow {
  mode: string;
  captures: string;
  when: string;
}

const graphModeRows: GraphModeRow[] = [
  {
    mode: 'NONE',
    captures: 'Nothing; every forward runs eagerly.',
    when: 'Default at -O0. --enforce-eager forces it.',
  },
  {
    mode: 'PIECEWISE',
    captures:
      'The segments between attention ops. torch.compile splits the forward at those ops, and attention runs eagerly between graphs.',
    when: 'Default at -O1. Needs compilation mode VLLM_COMPILE with attention among the splitting ops.',
  },
  {
    mode: 'FULL',
    captures: 'One graph for the whole forward at each captured size, mixed prefill-and-decode batches included.',
    when: 'Reachable only when every attention backend in the model reports ALWAYS; otherwise downgraded at startup, or refused when a backend reports NEVER.',
  },
  {
    mode: 'FULL_DECODE_ONLY',
    captures: 'Full graphs for decode batches; mixed batches run eagerly.',
    when: 'Suggested by the field docstring for decode instances in a P/D (prefill/decode disaggregated) setup, to save memory.',
  },
  {
    mode: 'FULL_AND_PIECEWISE',
    captures: 'Full graphs for uniform decode batches, piecewise graphs for prefill and mixed batches.',
    when: 'Default at -O2 (the default level) and -O3. The field docstring calls it the most performant mode for most models.',
  },
];

const xrsFallback = [
  'stock torch.compile mode',
  'sequence parallelism with tensor parallel > 1',
  'pipeline parallel with the external_launcher executor',
  'spec decode: ngram, ngram_gpu, suffix,',
  ' medusa, mlp_speculator, custom_class',
  'EAGLE parallel drafting',
  'dual-batch overlap, unless VLLM_USE_V2_MODEL_RUNNER=1',
  'elastic expert parallelism',
  'mamba_cache_mode "all"',
];

const xrsNeedsV2 = [
  'prefill context parallel',
  'pipeline parallel with async scheduling',
  'DSpark, adaptive draft verification',
  'DFlash: mixed sliding/full drafts,',
  ' candidate-head drafts (DFlash2, LiLiCorr)',
  'diffusion models',
  'batch-sharded sampling',
];

/** One line of a RunnerSelectionDiagram feature panel; a leading-space line continues the item above. */
function XrsItem({ text, y, dot }: { text: string; y: number; dot: string }) {
  const cont = text.startsWith(' ');
  return (
    <>
      {cont ? null : <circle cx={488} cy={y - 4} r={2.5} fill={dot} />}
      <text x={cont ? 508 : 498} y={y} className="xrs-li">
        {text.trim()}
      </text>
    </>
  );
}

/**
 * How VllmConfig.use_v2_model_runner decides, top to bottom, with the two
 * feature lists the selector and the validators consult.
 */
function RunnerSelectionDiagram() {
  const rows = [
    {
      y: 40,
      q: ['HiSparse or watermarking', 'configured?'],
      out: ['V2', '(forced)'],
      kind: 'v2',
    },
    {
      y: 110,
      q: ['VLLM_USE_V2_MODEL_RUNNER', 'set to 0 or 1?'],
      out: ['its value', 'decides'],
      kind: 'env',
    },
    {
      y: 180,
      q: ['ROCm, with DeepSeek V3.2 / V4 or', 'GLM-MoE-DSA, and V1 can serve it?'],
      out: ['V1'],
      kind: 'v1',
    },
    { y: 250, q: ['Triton missing?'], out: ['V1', '+ warning'], kind: 'v1' },
    {
      y: 320,
      q: ['Uses a feature from', 'the amber list?'],
      out: ['V1', '+ warning'],
      kind: 'v1',
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 520"
        role="img"
        aria-labelledby="exec-runner-sel-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="exec-runner-sel-title">
          VllmConfig.use_v2_model_runner checks five things in order: HiSparse or watermarking
          force Model Runner V2; otherwise VLLM_USE_V2_MODEL_RUNNER decides if it is set; three
          ROCm architectures default to V1 when V1 can serve them; a missing Triton install or a
          feature from the amber list falls back to V1 with a warning; everything else runs V2.
          The amber panel lists the features V2 lacks, and the blue panel lists features only V2
          has, which raise at startup on V1.
        </title>
        <style>{`
          .xrs-h { fill: #16191f; font: 600 13px sans-serif; }
          .xrs-q { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .xrs-o { font: 600 12px sans-serif; text-anchor: middle; }
          .xrs-e { fill: #5f6b7a; font: 600 11px sans-serif; }
          .xrs-li { fill: #16191f; font: 11px sans-serif; }
          .xrs-ph { font: 600 12px sans-serif; }
          .xrs-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#xrs-ah); }
        `}</style>
        <defs>
          <marker
            id="xrs-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={880} height={520} rx={8} fill="#ffffff" />
        <text x={16} y={24} className="xrs-h">
          VllmConfig.use_v2_model_runner, checked top to bottom
        </text>

        {rows.map((r) => {
          const fill = r.kind === 'v2' ? '#f2f8fd' : r.kind === 'v1' ? '#fbf3d5' : '#f2f3f3';
          const stroke = r.kind === 'v2' ? '#0972d3' : r.kind === 'v1' ? '#8b6c00' : '#879596';
          const textFill = r.kind === 'v2' ? '#065299' : r.kind === 'v1' ? '#5c4700' : '#16191f';
          return (
            <g key={r.y}>
              <rect
                x={16}
                y={r.y}
                width={264}
                height={46}
                rx={6}
                fill="#ffffff"
                stroke="#414d5c"
                strokeWidth={1.5}
              />
              {r.q.length === 1 ? (
                <text x={148} y={r.y + 28} className="xrs-q">
                  {r.q[0]}
                </text>
              ) : (
                <>
                  <text x={148} y={r.y + 19} className="xrs-q">
                    {r.q[0]}
                  </text>
                  <text x={148} y={r.y + 36} className="xrs-q">
                    {r.q[1]}
                  </text>
                </>
              )}
              <line x1={280} y1={r.y + 23} x2={322} y2={r.y + 23} className="xrs-arr" />
              <text x={301} y={r.y + 16} className="xrs-e" textAnchor="middle">
                yes
              </text>
              <rect
                x={324}
                y={r.y}
                width={120}
                height={46}
                rx={8}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.5}
              />
              {r.out.length === 1 ? (
                <text x={384} y={r.y + 28} className="xrs-o" fill={textFill}>
                  {r.out[0]}
                </text>
              ) : (
                <>
                  <text x={384} y={r.y + 19} className="xrs-o" fill={textFill}>
                    {r.out[0]}
                  </text>
                  <text x={384} y={r.y + 36} className="xrs-o" fill={textFill}>
                    {r.out[1]}
                  </text>
                </>
              )}
              <line x1={148} y1={r.y + 46} x2={148} y2={r.y + 68} className="xrs-arr" />
              <text x={156} y={r.y + 61} className="xrs-e">
                no
              </text>
            </g>
          );
        })}

        <rect x={16} y={390} width={428} height={46} rx={8} fill="#0972d3" stroke="#065299" />
        <text x={230} y={418} className="xrs-o" fill="#ffffff">
          V2: Model Runner V2, the default
        </text>
        <line x1={230} y1={436} x2={230} y2={454} className="xrs-arr" />
        <rect x={16} y={456} width={428} height={48} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={230} y={476} className="xrs-li" textAnchor="middle">
          The chosen runner then validates the configuration:
        </text>
        <text x={230} y={494} className="xrs-li" textAnchor="middle">
          a feature it lacks is a startup error.
        </text>

        <rect x={468} y={40} width={396} height={212} rx={8} fill="#fbf3d5" stroke="#8b6c00" />
        <text x={484} y={62} className="xrs-ph" fill="#5c4700">
          V2 lacks these, so vLLM falls back to V1
        </text>
        {xrsFallback.map((t, i) => (
          <XrsItem key={t} text={t} y={86 + i * 19} dot="#8b6c00" />
        ))}

        <rect x={468} y={272} width={396} height={180} rx={8} fill="#f2f8fd" stroke="#0972d3" />
        <text x={484} y={294} className="xrs-ph" fill="#065299">
          V1 lacks these, so they need V2 (V1 raises)
        </text>
        {xrsNeedsV2.map((t, i) => (
          <XrsItem key={t} text={t} y={318 + i * 19} dot="#0972d3" />
        ))}
      </svg>
    </div>
  );
}

/**
 * One Model Runner V2 step as two calls from EngineCore: execute_model()
 * queues the GPU work and returns None, the CPU builds the grammar bitmask
 * meanwhile, and sample_tokens() consumes it.
 */
function ForwardPipelineDiagram() {
  const gpu = [
    { x: 20, t: 'update slots', s: ['add, finish, free', 'block-table diffs'] },
    { x: 186, t: 'prepare_inputs', s: ['Triton kernels build', 'positions, seq_lens'] },
    { x: 352, t: 'prepare_attn', s: ['block tables and', 'slot_mapping on GPU'] },
    { x: 518, t: 'forward', s: ['graph replay or eager', 'KV write, attention'] },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 262"
        role="img"
        aria-labelledby="exec-fwd-pipe-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="exec-fwd-pipe-title">
          One Model Runner V2 step. EngineCore schedules, then calls execute_model without
          blocking. On the GPU side the runner updates its fixed request slots, builds positions
          and sequence lengths with Triton kernels, gathers block tables and computes the
          slot_mapping, and runs the forward pass, which writes each layer&apos;s new keys and
          values before attention. Meanwhile the CPU builds the structured-output grammar bitmask.
          execute_model returns None; EngineCore then calls sample_tokens with the bitmask, and the
          runner computes logits, applies the bitmask with a Triton kernel and samples.
        </title>
        <style>{`
          .xfp-lane { fill: #414d5c; font: 600 11px sans-serif; }
          .xfp-div  { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
          .xfp-t    { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .xfp-tw   { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .xfp-s    { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .xfp-sw   { fill: #e6f0fb; font: 11px sans-serif; text-anchor: middle; }
          .xfp-e    { fill: #5f6b7a; font: 11px sans-serif; }
          .xfp-arr  { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#xfp-ah); }
        `}</style>
        <defs>
          <marker
            id="xfp-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#0972d3" />
          </marker>
        </defs>
        <rect x={0} y={0} width={900} height={262} rx={8} fill="#ffffff" />

        <text x={20} y={20} className="xfp-lane">
          EngineCore (CPU)
        </text>
        <text x={690} y={20} className="xfp-div">
          execute_model() returns None
        </text>

        <rect x={20} y={30} width={150} height={60} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={95} y={55} className="xfp-t">
          schedule()
        </text>
        <text x={95} y={74} className="xfp-s">
          builds SchedulerOutput
        </text>

        <rect x={186} y={30} width={482} height={60} rx={6} fill="#e6f4f2" stroke="#1f7a70" />
        <text x={427} y={55} className="xfp-t">
          get_grammar_bitmask()
        </text>
        <text x={427} y={74} className="xfp-s">
          structured-output bitmask, built on the CPU while the GPU works
        </text>

        <rect x={712} y={30} width={172} height={60} rx={6} fill="#f2f3f3" stroke="#879596" />
        <text x={798} y={55} className="xfp-t">
          sample_tokens()
        </text>
        <text x={798} y={74} className="xfp-s">
          then update_from_output()
        </text>

        <line x1={95} y1={90} x2={95} y2={154} className="xfp-arr" />
        <text x={103} y={126} className="xfp-e">
          execute_model(non_block=True)
        </text>
        <line x1={740} y1={90} x2={740} y2={154} className="xfp-arr" />
        <text x={748} y={126} className="xfp-e">
          passes the bitmask
        </text>

        <line
          x1={690}
          y1={28}
          x2={690}
          y2={232}
          stroke="#d1d5db"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {gpu.map((b, i) => {
          const solid = i === 3;
          return (
            <g key={b.t}>
              <rect
                x={b.x}
                y={156}
                width={150}
                height={70}
                rx={6}
                fill={solid ? '#0972d3' : '#f2f8fd'}
                stroke="#0972d3"
                strokeWidth={1.5}
              />
              <text x={b.x + 75} y={178} className={solid ? 'xfp-tw' : 'xfp-t'}>
                {b.t}
              </text>
              <text x={b.x + 75} y={197} className={solid ? 'xfp-sw' : 'xfp-s'}>
                {b.s[0]}
              </text>
              <text x={b.x + 75} y={213} className={solid ? 'xfp-sw' : 'xfp-s'}>
                {b.s[1]}
              </text>
              {i < 3 ? (
                <line x1={b.x + 150} y1={191} x2={b.x + 165} y2={191} className="xfp-arr" />
              ) : null}
            </g>
          );
        })}

        <rect x={712} y={156} width={172} height={70} rx={6} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.5} />
        <text x={798} y={178} className="xfp-t">
          sample
        </text>
        <text x={798} y={197} className="xfp-s">
          logits + bitmask (Triton)
        </text>
        <text x={798} y={213} className="xfp-s">
          sampler, draft tokens
        </text>

        <text x={20} y={250} className="xfp-lane">
          Worker: Model Runner V2 (GPU)
        </text>
        <text x={690} y={250} className="xfp-div">
          sample_tokens() drains the stash
        </text>
      </svg>
    </div>
  );
}

/**
 * Attention-backend selection tree on CUDA. Branch on use_mla, then on device
 * capability (and, for dense attention, causality), producing an ordered
 * priority list that each backend's validate_configuration() filters.
 */
function BackendSelectionDiagram() {
  const leaves = [
    {
      x: 20,
      w: 150,
      tone: 'dense',
      title: 'major == 10, causal',
      note: '',
      items: ['1. FLASHINFER', '2. FLASH_ATTN', '3. TRITON_ATTN', '4. FLEX_ATTENTION', '5. TURBOQUANT'],
    },
    {
      x: 182,
      w: 150,
      tone: 'dense',
      title: 'else, or non-causal',
      note: '',
      items: ['1. FLASH_ATTN', '2. FLASHINFER', '3. TRITON_ATTN', '4. FLEX_ATTENTION', '5. TURBOQUANT'],
    },
    {
      x: 356,
      w: 200,
      tone: 'mla',
      title: 'major == 10',
      note: '',
      items: [
        '1. FLASHINFER_MLA',
        '2. TOKENSPEED_MLA',
        '3. CUTLASS_MLA',
        '4. FLASH_ATTN_MLA',
        '5. FLASHMLA',
        '6. TRITON_MLA',
        '7-8. two sparse MLA backends',
      ],
    },
    {
      x: 568,
      w: 200,
      tone: 'mla',
      title: 'major == 12',
      note: '',
      items: ['1. TRITON_MLA', '2. FLASHINFER_MLA_SPARSE_SM120'],
    },
    {
      x: 780,
      w: 200,
      tone: 'mla',
      title: 'else (Hopper, Ampere)',
      note: 'Ampere ends at TRITON_MLA',
      items: [
        '1. FLASH_ATTN_MLA',
        '2. FLASHMLA',
        '3. FLASHINFER_MLA',
        '4. TRITON_MLA',
        '5-7. three sparse MLA backends',
      ],
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 1000 420"
        role="img"
        aria-labelledby="exec-backend-sel-title"
        style={{ width: '100%', minWidth: 780, height: 'auto' }}
      >
        <title id="exec-backend-sel-title">
          Attention backend selection on CUDA: get_attn_backend_cls branches on use_mla, then on
          the GPU&apos;s compute capability major version (and for dense attention on whether it is
          causal), producing an ordered priority list; the first backend whose
          validate_configuration returns no reasons wins.
        </title>
        <style>{`
          .xbs-rt  { fill: #ffffff; font: 600 12.5px sans-serif; text-anchor: middle; }
          .xbs-rs  { fill: #e6f0fb; font: 10.5px sans-serif; text-anchor: middle; }
          .xbs-nt  { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .xbs-ns  { fill: #5f6b7a; font: 10.5px sans-serif; text-anchor: middle; }
          .xbs-lt  { fill: #0f1b2a; font: 600 11.5px sans-serif; text-anchor: middle; }
          .xbs-li  { fill: #0f1b2a; font: 10.5px sans-serif; text-anchor: middle; }
          .xbs-ln  { fill: #5f6b7a; font: italic 10.5px sans-serif; text-anchor: middle; }
          .xbs-ft  { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .xbs-fs  { fill: #5f6b7a; font: 10.5px sans-serif; text-anchor: middle; }
          .xbs-edge { stroke: #5f6b7a; stroke-width: 1.5; }
          .xbs-dash { stroke: #5f6b7a; stroke-width: 1; stroke-dasharray: 4 3; }
        `}</style>
        <rect x={0} y={0} width={1000} height={420} rx={8} fill="#ffffff" />

        <rect x={400} y={10} width={200} height={44} rx={6} fill="#0972d3" />
        <text x={500} y={30} className="xbs-rt">
          get_attn_backend_cls()
        </text>
        <text x={500} y={46} className="xbs-rs">
          platforms/cuda.py
        </text>

        <line x1={500} y1={54} x2={176} y2={86} className="xbs-edge" />
        <line x1={500} y1={54} x2={668} y2={86} className="xbs-edge" />

        <rect x={76} y={86} width={200} height={40} rx={6} fill="#eef6ec" stroke="#037f51" />
        <text x={176} y={104} className="xbs-nt">
          use_mla = False (dense)
        </text>
        <text x={176} y={119} className="xbs-ns">
          MHA / GQA / MQA
        </text>
        <rect x={568} y={86} width={200} height={40} rx={6} fill="#fdf3e7" stroke="#8d6e1f" />
        <text x={668} y={104} className="xbs-nt">
          use_mla = True
        </text>
        <text x={668} y={119} className="xbs-ns">
          DeepSeek-style MLA
        </text>

        <line x1={176} y1={126} x2={95} y2={158} className="xbs-edge" />
        <line x1={176} y1={126} x2={257} y2={158} className="xbs-edge" />
        <line x1={668} y1={126} x2={456} y2={158} className="xbs-edge" />
        <line x1={668} y1={126} x2={668} y2={158} className="xbs-edge" />
        <line x1={668} y1={126} x2={880} y2={158} className="xbs-edge" />

        {leaves.map((l) => {
          const cx = l.x + l.w / 2;
          const first = l.note ? 214 : 198;
          return (
            <g key={l.title}>
              <rect
                x={l.x}
                y={158}
                width={l.w}
                height={164}
                rx={6}
                fill={l.tone === 'dense' ? '#f7faf6' : '#fcf7ee'}
                stroke={l.tone === 'dense' ? '#037f51' : '#8d6e1f'}
              />
              <text x={cx} y={177} className="xbs-lt">
                {l.title}
              </text>
              {l.note ? (
                <text x={cx} y={194} className="xbs-ln">
                  {l.note}
                </text>
              ) : null}
              {l.items.map((it, i) => (
                <text key={it} x={cx} y={first + i * 16} className="xbs-li">
                  {it}
                </text>
              ))}
              <line x1={cx} y1={322} x2={170 + ((cx - 20) / 960) * 660} y2={344} className="xbs-dash" />
            </g>
          );
        })}

        <rect x={170} y={344} width={660} height={66} rx={6} fill="#f2f8fd" stroke="#0972d3" />
        <text x={500} y={364} className="xbs-ft">
          first backend whose validate_configuration() returns no reasons wins
        </text>
        <text x={500} y={382} className="xbs-fs">
          checks head size, dtype, KV-cache dtype, block size, sinks and sparsity
        </text>
        <text x={500} y={398} className="xbs-fs">
          --attention-backend skips the walk; backend_per_kind overrides one KV-cache group
        </text>
      </svg>
    </div>
  );
}

export function CodebaseExecution() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Which model runner your deployment is on, how one scheduler step becomes a GPU forward pass, and which attention kernel and CUDA graph mode it ends up with (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Execution &amp; Attention
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> The scheduler decides{' '}
            <em>what</em> runs each step; the execution layer runs it on the GPU.
            Two objects carry the weight. The <code>Worker</code> (
            <code>vllm/v1/worker/gpu_worker.py</code>) owns the device: it picks and
            sets the GPU{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L397-L462')}>
              gpu_worker.py L397-L462
            </Cite>
            , loads weights{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L538-L561')}>
              L538-L561
            </Cite>
            , profiles free memory{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L571-L583')}>
              L571-L583
            </Cite>
            , and under PP (pipeline parallelism) sends and receives intermediate
            tensors between stages (below). The model runner it builds turns a <code>SchedulerOutput</code> into
            input tensors and attention metadata, runs the forward pass that writes new
            entries into the KV (key-value) cache, and samples tokens.
          </Box>
          <Box variant="p">
            <strong>Model Runner V2 is the runner.</strong> The default for every
            model since v0.29.0 is Model Runner V2 (MRv2), the{' '}
            <code>GPUModelRunner</code> class in{' '}
            <code>vllm/v1/worker/gpu/model_runner.py</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L507-L526')}>
              gpu_worker.py L507-L526
            </Cite>
            . That 2,410-line file orchestrates one module per concern in the same
            directory: input batching, block tables, attention metadata, CUDA graphs,
            sampling, speculative decoding, LoRA (low-rank adaptation) and structured
            output{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1/worker/gpu">
              vllm/v1/worker/gpu/
            </Cite>
            . The 7,531-line <code>vllm/v1/worker/gpu_model_runner.py</code> is the V1
            model runner: deprecated, with removal targeted for v0.32, and chosen only
            when a configuration needs something MRv2 lacks{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            .
          </Box>
          <Alert type="info" header="Two different things are called V1">
            The <strong>V1 engine</strong> is vLLM&apos;s process architecture: an
            API frontend, an <code>EngineCore</code> running the unified scheduler,
            and the workers, all under <code>vllm/v1/</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L111')}>
              core.py L111
            </Cite>
            . <strong>Model Runner V2</strong> is the GPU execution layer inside each
            of that engine&apos;s workers, and its code sits at{' '}
            <code>vllm/v1/worker/gpu/</code>, a path that itself contains{' '}
            <code>v1</code>. A v0.31.0 deployment runs the V1 engine with Model Runner
            V2. A log line about the &quot;V1 model runner&quot; refers to the
            fallback runner inside that same engine.
          </Alert>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0">
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            : <code>vllm/config/vllm.py</code>, <code>vllm/config/compilation.py</code>,{' '}
            <code>vllm/v1/engine/core.py</code>, <code>vllm/v1/worker/gpu_worker.py</code>,{' '}
            <code>vllm/v1/worker/gpu/model_runner.py</code>,{' '}
            <code>vllm/v1/worker/gpu_model_runner.py</code>,{' '}
            <code>vllm/v1/attention/backends/flash_attn.py</code>,{' '}
            <code>vllm/v1/attention/backends/registry.py</code>,{' '}
            <code>vllm/v1/attention/selector.py</code>,{' '}
            <code>vllm/platforms/cuda.py</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="The order of checks, the features that send you to each runner, and the configurations that cannot start on either"
          >
            Which model runner runs, and when V1 still does
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The choice is a property of the configuration,{' '}
            <code>VllmConfig.use_v2_model_runner</code> in{' '}
            <code>vllm/config/vllm.py</code>, settled before any worker exists{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L700-L761')}>
              vllm.py L700-L761
            </Cite>
            . The <code>Worker</code> reads the answer once in its constructor{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L227')}>
              gpu_worker.py L227
            </Cite>{' '}
            and builds the matching class in <code>init_device()</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L507-L526')}>
              L507-L526
            </Cite>
            .
          </Box>
          <RunnerSelectionDiagram />
          <Box variant="small" color="text-body-secondary">
            Decision order and both lists read from <code>vllm/config/vllm.py</code> at
            v0.31.0. Illustrative, not measured.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h4">The checks that set the default</Box>
              <Box variant="p">
                HiSparse forces V2 and raises if <code>VLLM_USE_V2_MODEL_RUNNER=0</code>;
                watermarking forces V2 and overrides the 0 with a log line. Otherwise
                the environment variable wins in either direction. On ROCm (AMD GPUs)
                three architectures default to V1 as a speed preference, and only when
                V1 can serve the configuration. Without Triton, or with a feature from
                the amber list, vLLM picks V1 and warns{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L73-L77')}>
                  vllm.py L73-L77
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3051-L3103')}>
                  vllm.py L3051-L3103
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h4">The check that can stop startup</Box>
              <Box variant="p">
                After the choice, the chosen runner validates the configuration
                against what it lacks{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L2051-L2054')}>
                  vllm.py L2051-L2054
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3105-L3149')}>
                  vllm.py L3105-L3149
                </Cite>
                . Forcing V2 with an amber-list feature raises; forcing V1 with a
                blue-list feature raises; a configuration that needs one feature from
                each list cannot start on either runner{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3315-L3331')}>
                  vllm.py L3315-L3331
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The two lists drive the automatic choice. A few features also check the
            runner on their own and raise instead of falling back: the AuxOutput
            connector, sampling-distribution replay and trace replay require MRv2{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1166-L1175')}>
              vllm.py L1166-L1175
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1262-L1292')}>
              vllm.py L1262-L1292
            </Cite>
            , and Triton ReplaySSM requires V1{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3502-L3506')}>
              vllm.py L3502-L3506
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What gpu_model_runner.py still does in the tree">
            <SpaceBetween size="s">
              <Box variant="p">
                Besides the GPU fallback, the V1 model runner is the base class of the CPU
                runner and of the V1 XPU (Intel GPU) runner, which sits next to an{' '}
                <code>XPUModelRunnerV2</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/cpu_model_runner.py', 'L18-L23')}>
                  cpu_model_runner.py L18-L23
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/xpu_model_runner.py', 'L13-L30')}>
                  xpu_model_runner.py L13-L30
                </Cite>
                . MRv2 also calls two V1 helpers, <code>reload_weights</code> and{' '}
                <code>update_config</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L538-L553')}>
                  model_runner.py L538-L553
                </Cite>
                . An instance that runs only a multimodal encoder gets a third class,{' '}
                <code>MMEncoderModelRunner</code>, on the V2 branch of the same{' '}
                <code>if</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L507-L515')}>
                  gpu_worker.py L507-L515
                </Cite>
                .
              </Box>
              <Box variant="p">
                The directory&apos;s README opens with &quot;[Experimental] Model
                Runner V2 ... under active development&quot;{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/worker/gpu/README.md', 'L1-L4')}
                  kind="doc-code-conflict"
                >
                  gpu/README.md L1-L4
                </Cite>
                . The selector above is what runs, and it makes V2 the default. The
                design document describes what MRv2 changed and why{' '}
                <Cite tier={1} href={vllmDocsUrl('design/model_runner_v2.html')}>
                  vLLM docs: Model Runner V2 design
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
            variant="h3"
            description="Where the CPU and GPU overlap inside one step, and which parts MRv2 builds on the GPU with Triton"
          >
            One step through Model Runner V2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One scheduler step is two calls from <code>EngineCore</code> into the
            worker. <code>execute_model()</code> updates request state, builds the
            inputs, runs the forward pass, stashes the result in an{' '}
            <code>ExecuteModelState</code> and returns <code>None</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L2027-L2046')}>
              model_runner.py L2027-L2046
            </Cite>
            . <code>sample_tokens(grammar_output)</code> drains that state, computes
            logits, applies the structured-output bitmask and samples{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L2050-L2098')}>
              model_runner.py L2050-L2098
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1556-L1600')}>
              L1556-L1600
            </Cite>
            . The split lets the CPU build that bitmask during the forward pass:{' '}
            <code>EngineCore</code> issues{' '}
            <code>execute_model(..., non_block=True)</code>, builds the grammar bitmask
            on the CPU while the GPU runs the forward, and then hands it to{' '}
            <code>sample_tokens()</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L640-L649')}>
              core.py L640-L649
            </Cite>
            .
          </Box>
          <ForwardPipelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic of one step; box widths do not represent time. Illustrative, not
            measured.
          </Box>
          <Box variant="p">
            <strong>Async scheduling is on by default.</strong> The scheduler and worker
            prepare step N+1 while the GPU runs step N{' '}
            <Cite tier={1} href={vllmDocsUrl('design/model_runner_v2.html')}>
              vLLM docs: Model Runner V2 design
            </Cite>
            , and under that batch queue sampling can wait a step when a
            structured-output token is still pending{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core.py', 'L699-L725')}>
              core.py L699-L725
            </Cite>
            . vLLM turns it on unless the model is a pooling model, the speculative
            method is outside the EAGLE/MTP (multi-token prediction), DFlash, DSpark,
            draft-model and <code>ngram_gpu</code> families,{' '}
            <code>disable_padded_drafter_batch</code> is set, the executor backend lacks
            support, ROCm DeepEP high-throughput DBO (dual-batch overlap) is in use, or
            PP is above 1 on the V1 runner. The flag{' '}
            <code>--no-async-scheduling</code> turns it off{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1575-L1635')}>
              vllm.py L1575-L1635
            </Cite>
            . MRv2 is built around this mode: its design treats the execution loop as a
            CUDA stream with no CPU synchronization points, onto which CPU entrypoints
            queue work.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Request slots, inputs built on the GPU</Box>
              <Box variant="p">
                MRv2 gives each request a fixed state row for its lifetime, and each
                step maps batch rows to those rows through <code>idx_mapping</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/states.py', 'L27-L29')}>
                  states.py L27-L29
                </Cite>
                . A request joining or leaving changes only its own row, and a preempted
                request comes back as fresh state{' '}
                <Cite tier={1} href={vllmDocsUrl('design/model_runner_v2.html')}>
                  vLLM docs: Model Runner V2 design
                </Cite>
                . Triton
                kernels build input IDs, positions and sequence lengths on the GPU{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/input_batch.py', 'L269-L400')}>
                  input_batch.py L269-L400
                </Cite>
                , and block-table changes travel as staged diffs that one kernel
                applies{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/buffer_utils.py', 'L132-L225')}>
                  buffer_utils.py L132-L225
                </Cite>
                . The CPU contributes small per-request arrays, such as{' '}
                <code>idx_mapping</code> and the query start offsets, copied
                asynchronously{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1333-L1430')}>
                  model_runner.py L1333-L1430
                </Cite>
                . Input preparation and most of the sampler are Triton kernels{' '}
                <Cite tier={1} href={vllmDocsUrl('design/model_runner_v2.html')}>
                  vLLM docs: Model Runner V2 design
                </Cite>
                , and the selector requires Triton before it picks MRv2{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L746-L750')}>
                  vllm.py L746-L750
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Attention metadata</Box>
              <Box variant="p">
                <code>prepare_attn()</code> gathers each KV-cache group&apos;s block
                table for the batch and computes the <code>slot_mapping</code>, the
                physical KV-cache slot for each new token, with Triton
                kernels{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1520-L1538')}>
                  model_runner.py L1520-L1538
                </Cite>
                . <code>build_attn_metadata()</code> turns them into one metadata
                object per attention group, built by that group&apos;s backend (a KV-cache
                group can hold several){' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/attn_utils.py', 'L429-L555')}>
                  attn_utils.py L429-L555
                </Cite>
                . A FULL CUDA graph replays with its inputs already in static buffers;
                piecewise and eager forwards run inside{' '}
                <code>set_forward_context(...)</code>, which makes the metadata and
                per-layer slot mappings visible to every attention layer without
                passing them through each module{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1960-L2005')}>
                  model_runner.py L1960-L2005
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="Which kernel your GPU and model get, and how to confirm or override it"
          >
            How the attention backend is chosen
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Attention kernels are pluggable. <code>AttentionBackendEnum</code> in{' '}
            <code>vllm/v1/attention/backends/registry.py</code> names 44 backends:
            FlashAttention and FlashInfer, the MLA (Multi-head Latent Attention) family
            used by DeepSeek-style models, sparse-MLA variants, ROCm, XPU and CPU
            variants, and placeholders such as <code>TORCH_SDPA</code> (vision encoders
            only), <code>NO_ATTENTION</code> and <code>CUSTOM</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/registry.py', 'L34-L155')}>
              registry.py L34-L155
            </Cite>
            . <code>MambaAttentionBackendEnum</code> holds six state-space and
            linear-attention backends, one of them a <code>CUSTOM</code> slot{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/registry.py', 'L203-L220')}>
              registry.py L203-L220
            </Cite>
            . Each value is a class path that <code>register_backend()</code> can
            override at runtime.
          </Box>
          <Box variant="p">
            Selection (<code>vllm/v1/attention/selector.py</code> calling into{' '}
            <code>vllm/platforms/cuda.py</code>) is a priority list per GPU generation.{' '}
            <code>_get_backend_priorities()</code> branches on <code>use_mla</code>, then
            on <code>device_capability.major</code>; dense attention (MHA, GQA and MQA:
            multi-head, grouped-query and multi-query attention) also branches on causal
            versus non-causal and on multimodal prefix masks{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L80-L179')}>
              cuda.py L80-L179
            </Cite>
            . <code>get_attn_backend_cls()</code> asks each candidate&apos;s{' '}
            <code>validate_configuration()</code> about head size, dtype, KV-cache
            dtype, block size and the rest, and the highest-priority candidate with no
            objections wins{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L375-L415')}>
              cuda.py L375-L415
            </Cite>
            . <code>--attention-backend</code> skips the walk and raises if that
            backend does not validate{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L448-L466')}>
              cuda.py L448-L466
            </Cite>
            . <code>attention_config.backend_per_kind</code> overrides the backend for
            one kind of KV-cache group, for models that mix, for example, full and
            sliding-window layers{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/attention.py', 'L46-L56')}>
              attention.py L46-L56
            </Cite>
            .
          </Box>
          <BackendSelectionDiagram />
          <Box variant="small" color="text-body-secondary">
            Priority lists as coded in <code>_get_backend_priorities()</code>. Multimodal
            prefix masks prepend <code>TRITON_FLASHINFER</code> on 10.x and{' '}
            <code>TRITON_FLASH_ATTN</code> on Hopper. The 10.x sparse pair is{' '}
            <code>FLASHINFER_MLA_SPARSE</code> and <code>FLASHMLA_SPARSE</code>; the
            Hopper sparse tail is <code>FLASH_ATTN_MLA_SPARSE</code>,{' '}
            <code>FLASHMLA_SPARSE</code> and <code>FLASHINFER_MLA_SPARSE_SM90</code>{' '}
            (moved to the front of the tail at head size 512). Illustrative, not
            measured.
          </Box>
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
            Capability gates from each backend&apos;s{' '}
            <code>supports_compute_capability()</code>: CUTLASS-MLA{' '}
            <code>major == 10</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/mla/cutlass_mla.py', 'L65-L66')}>
              cutlass_mla.py L65-L66
            </Cite>
            , FlashMLA <code>major in [9, 10]</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/mla/flashmla.py', 'L74-L75')}>
              flashmla.py L74-L75
            </Cite>
            , FlashAttention MLA <code>major == 9</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/mla/flashattn_mla.py', 'L72-L73')}>
              flashattn_mla.py L72-L73
            </Cite>
            , FlashAttention <code>capability &gt;= 8.0</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L451-L452')}>
              flash_attn.py L451-L452
            </Cite>
            . FlashAttention defaults to FA3 on Hopper and FA4 on 10.x when that
            version is supported, FA2 otherwise{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/fa_utils.py', 'L99-L107')}>
              fa_utils.py L99-L107
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="The graph mode you get by default, why one backend can downgrade it, and the knobs for capture memory and startup time"
          >
            CUDA graphs: modes, the default, and what caps them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A CUDA graph replays a recorded sequence of kernel launches without the
            per-launch CPU cost, which matters most for small decode batches where the
            GPU would otherwise wait on Python. A captured graph is shape-rigid, so
            vLLM captures a set of batch sizes, and the mode decides which batches get
            a full graph, a piecewise one, or none. The default optimization level, O2,
            selects <code>FULL_AND_PIECEWISE</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L300-L322')}>
              vllm.py L300-L322
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L442')}>
              vllm.py L442
            </Cite>
            .
          </Box>
          <Table
            items={graphModeRows}
            columnDefinitions={[
              {
                id: 'mode',
                header: 'CUDAGraphMode',
                cell: (r) => <code>{r.mode}</code>,
                minWidth: 170,
              },
              {
                id: 'captures',
                header: 'What is captured',
                cell: (r) => r.captures,
                minWidth: 260,
              },
              {
                id: 'when',
                header: 'When you get it',
                cell: (r) => r.when,
                minWidth: 260,
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Modes and their descriptions:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L53-L63')}>
              compilation.py L53-L63
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L606-L641')}>
              compilation.py L606-L641
            </Cite>
            ; per-level defaults{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L254-L346')}>
              vllm.py L254-L346
            </Cite>
            ; <code>--enforce-eager</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1694-L1696')}>
              vllm.py L1694-L1696
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The weakest backend caps the mode.</strong> Each backend grades its
            graphs with <code>AttentionCGSupport</code>: <code>NEVER</code>,{' '}
            <code>UNIFORM_SINGLE_TOKEN_DECODE</code>, <code>UNIFORM_BATCH</code> (equal
            query lengths, which covers speculative-decode verification) and{' '}
            <code>ALWAYS</code> (mixed prefill and decode){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backend.py', 'L562-L576')}>
              backend.py L562-L576
            </Cite>
            . MRv2 takes the lowest grade across the model&apos;s attention groups{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/attn_utils.py', 'L284-L307')}>
              attn_utils.py L284-L307
            </Cite>
            , and <code>resolve_cudagraph_mode_and_sizes()</code> downgrades the
            requested mode with a warning. FULL with a <code>UNIFORM_BATCH</code> or{' '}
            <code>UNIFORM_SINGLE_TOKEN_DECODE</code> backend becomes{' '}
            <code>FULL_AND_PIECEWISE</code> (or <code>FULL_DECODE_ONLY</code> when
            attention is not a splitting op); FULL with a <code>NEVER</code> backend is a
            startup error. <code>FULL_AND_PIECEWISE</code> or{' '}
            <code>FULL_DECODE_ONLY</code> with a <code>NEVER</code> backend becomes{' '}
            <code>PIECEWISE</code> (or <code>NONE</code> when attention is not compiled
            piecewise). Speculative decoding with a backend below{' '}
            <code>UNIFORM_BATCH</code> loses its full decode graphs the same way{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L1371-L1460')}>
              compilation.py L1371-L1460
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                FA2 and FA4 <Badge color="grey">UNIFORM_BATCH</Badge>
              </Box>
              <Box variant="p">
                FA2 captures graphs with <code>max_query_len=1</code>. Those graphs
                work for uniform decode (and, with spec decode, uniform multi-token
                decode) but break on a batch that mixes prefill and decode, because of
                FA2&apos;s packed-GQA handling for the single-token case. The backend
                reports <code>UNIFORM_BATCH</code> so that a request for FULL drops to{' '}
                <code>FULL_AND_PIECEWISE</code>. FA4 takes the same branch{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L605-L624')}>
                  flash_attn.py L605-L624
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">
                FA3 <Badge color="green">ALWAYS</Badge>
              </Box>
              <Box variant="p">
                FA3 reports <code>ALWAYS</code>: one captured graph can serve a mixed
                prefill-plus-decode batch, so a model whose attention runs entirely on
                FA3 keeps <code>cudagraph_mode=FULL</code>. Under the default{' '}
                <code>FULL_AND_PIECEWISE</code>, MRv2 captures the mixed-batch sizes as
                piecewise graphs on either grade, so the FA3 advantage shows when you
                request FULL{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/cudagraph_utils.py', 'L344-L362')}>
                  cudagraph_utils.py L344-L362
                </Cite>
                . The version is detected at import through{' '}
                <code>get_flash_attn_version()</code>.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="The FA2 branch and the comment above it">
            <Box variant="p">
              The branch is{' '}
              <code>
                AttentionCGSupport.ALWAYS if get_flash_attn_version() == 3 else
                AttentionCGSupport.UNIFORM_BATCH
              </code>
              , and the comment above it says the value is a deliberate drop-down:{' '}
              {
                '"There\'s probably a better way to describe this using AttentionCGSupport but for now just set it to UNIFORM_BATCH to get use to drop down to FULL_AND_PIECEWISE. TODO(luka, lucas): audit FA2"'
              }{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L615-L624')}>
                flash_attn.py L615-L624
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Capture sizes.</strong> When <code>max_cudagraph_capture_size</code>{' '}
            is unset, vLLM captures sizes 1, 2 and 4, every 8 below 256, then every 16
            from 256 up to the smaller of 2 x <code>max_num_seqs</code> x decode query length
            and 512, or 1024 on data-centre Blackwell (device-capability family 100){' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L2453-L2460')}>
              vllm.py L2453-L2460
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L691-L705')}>
              compilation.py L691-L705
            </Cite>
            . A batch larger than the largest captured size runs without a graph.
            The ceiling trades startup time and graph memory for coverage;{' '}
            <code>cudagraph_capture_sizes</code> or{' '}
            <code>max_cudagraph_capture_size</code> in <code>--compilation-config</code>{' '}
            sets it explicitly.
          </Box>
          <Box variant="p">
            <strong>Breakable CUDA graphs</strong> keep attention out of a graph a
            second way. Piecewise mode cuts the torch.fx graph at attention ops at
            compile time. A breakable graph runs one capture over the whole forward and,
            at run time, ends stream capture at each attention or KV-cache op, runs the
            op eagerly and resumes{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/breakable_cudagraph.py', 'L1-L20')}>
              breakable_cudagraph.py L1-L20
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/breakable_cudagraph.py', 'L198-L211')}>
              L198-L211
            </Cite>
            . vLLM turns it on for a fixed list of architectures (DeepSeek V3.2 and V4,
            Kimi K3, GLM-5 Next, MiniMax-M3 sparse, Qwen4Exp and others; on ROCm only
            DeepSeek V4.1), and while it is on the compilation mode is{' '}
            <code>NONE</code>, so those models run without torch.compile{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L79-L127')}>
              vllm.py L79-L127
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L837-L865')}>
              vllm.py L837-L865
            </Cite>
            . <code>VLLM_USE_BREAKABLE_CUDAGRAPH=0</code> opts out and <code>=1</code>{' '}
            forces it{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L771-L773')}>
              envs.py L771-L773
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The garbage collector stays out of capture and serving.</strong>{' '}
            Capture runs with Python&apos;s GC (garbage collector) frozen and disabled,
            because a GC cycle during stream capture can invalidate the captured graph;
            the helper&apos;s docstring names a finalized Triton kernel unloading its
            module as the example. After warmup the Worker freezes the heap so the
            collector stops scanning weights, KV caches and graphs during inference{' '}
            <Cite tier={1} href={vllmUrl('vllm/utils/gc_utils.py', 'L92-L131')}>
              gc_utils.py L92-L131
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L999-L1001')}>
              gpu_worker.py L999-L1001
            </Cite>
            . <code>VLLM_ENABLE_CUDAGRAPH_GC=1</code> opts out of the capture freeze{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1869-L1871')}>
              envs.py L1869-L1871
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="Where each step's keys and values are written, and how attention reads them back without a copy"
          >
            The paged KV cache at execution time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The paged KV cache is a pool of fixed-size blocks, and each request&apos;s
            block table lists the blocks it owns. The CUDA PagedAttention kernels were
            deleted in v0.25.0{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.25.0`}>
              vLLM v0.25.0 release notes
            </Cite>
            ; the attention backends (FlashAttention, FlashInfer, Triton and the MLA
            backends) read the paged KV cache through block tables. In the
            FlashAttention backend that shows up in two kernel calls.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">1. Write the new K/V</Box>
              <Box variant="p">
                <code>do_kv_cache_update()</code> scatters the step&apos;s keys and
                values into the cache with <code>reshape_and_cache_flash(...)</code>,
                using the per-token <code>slot_mapping</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L1507-L1540')}>
                  flash_attn.py L1507-L1540
                </Cite>
                . It runs from its own custom op, <code>unified_kv_cache_update</code>,
                whose dummy return value keeps the write ordered before attention under
                torch.compile{' '}
                <Cite tier={1} href={vllmUrl('vllm/model_executor/layers/attention/attention.py', 'L724-L746')}>
                  attention.py L724-L746
                </Cite>
                ; the backend declares{' '}
                <code>forward_includes_kv_cache_update = False</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L365')}>
                  flash_attn.py L365
                </Cite>
                . K and V share one cache tensor split on the last dimension, and the op
                reads the real token count from the <code>slot_mapping</code> shape, so
                padded K/V tensors need no slicing.
              </Box>
            </div>
            <div>
              <Box variant="h3">2. Attend over the blocks</Box>
              <Box variant="p">
                Attention then runs through <code>flash_attn_varlen_func(...)</code>{' '}
                (variable-length), fed the cumulative query offsets (
                <code>cu_seqlens_q</code>), per-sequence KV lengths and the{' '}
                <code>block_table</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L1450-L1475')}>
                  flash_attn.py L1450-L1475
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L113-L116')}>
                  L113-L116
                </Cite>
                . The kernel gathers each sequence&apos;s scattered KV blocks as it
                goes, with no contiguous copy, so the fused attention kernel consumes
                the ragged, paged layout directly.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The executor never materializes a per-request contiguous KV buffer. Tokens
            are scattered into a shared block pool on write and gathered by block table
            on read, which is what lets vLLM pack many variable-length sequences into
            one batch without fragmentation.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="How pipeline stages hand off activations, and what MRv2's microbatching needs before it turns on"
          >
            Pipeline parallelism and dual-batch overlap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On a pipeline-parallel deployment the <code>Worker</code> owns the
            stage-to-stage hand-off. In <code>execute_model()</code>, a non-first stage
            issues a non-blocking <code>irecv_tensor_dict()</code> for the previous
            stage&apos;s activations, wrapped in <code>AsyncIntermediateTensors</code>;
            a non-last stage finishes by launching a non-blocking{' '}
            <code>isend_tensor_dict()</code>, and the next call first waits on the
            outstanding send handles. Only the last stage returns a real{' '}
            <code>ModelRunnerOutput</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L1224-L1313')}>
              gpu_worker.py L1224-L1313
            </Cite>
            .
          </Box>
          <Alert type="info" header="PP with async scheduling needs MRv2">
            With PP above 1, the V1 runner cannot run async scheduling: vLLM leaves it
            off by default and refuses an explicit <code>--async-scheduling</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1626-L1633')}>
              vllm.py L1626-L1633
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3113-L3124')}>
              vllm.py L3113-L3124
            </Cite>
            . MRv2 runs PP with async scheduling and keeps <code>pp_size + 1</code>{' '}
            batches in flight{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L592-L602')}>
              vllm.py L592-L602
            </Cite>
            .
          </Alert>
          <Box variant="p">
            <strong>Dual-batch overlap</strong> splits a large step into two
            microbatches that hand the GPU to each other at communication points, so
            one microbatch&apos;s expert all-to-all overlaps the other&apos;s compute{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/ubatch_utils.py', 'L280-L287')}>
              ubatch_utils.py L280-L287
            </Cite>
            . It is off by default (<code>--enable-dbo</code>), microbatches a
            decode-only batch above 32 tokens or a batch with prefills above 512 tokens
            (both thresholds configurable), and needs more than one DP (data parallel)
            rank{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L228-L238')}>
              parallel.py L228-L238
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/ubatch_utils.py', 'L549-L564')}>
              ubatch_utils.py L549-L564
            </Cite>
            . MRv2&apos;s path is gated: unless <code>VLLM_USE_V2_MODEL_RUNNER=1</code>{' '}
            is set explicitly, DBO sends the deployment to V1. With it set, LoRA,
            speculative decoding, PP, context parallelism, multimodal, hybrid and
            encoder-only models and <code>PIECEWISE</code> graphs are rejected at
            startup{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3235-L3276')}>
              vllm.py L3235-L3276
            </Cite>
            .
          </Box>
          <Box variant="p">
            With <code>--enable-fault-tolerance</code> on a DP plus EP (expert
            parallel) MoE (mixture-of-experts) deployment, each Worker also carries a{' '}
            <code>WorkerSentinel</code> that the engine-side sentinel drives during
            recovery; it requires the <code>deepep_low_latency</code> or{' '}
            <code>nixl_ep</code> all-to-all backend{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/sentinel/gpu_worker_sentinel.py', 'L26-L45')}>
              gpu_worker_sentinel.py L26-L45
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The PP plus sequence-parallelism path runs only on V1">
            <Box variant="p">
              When PP is combined with SP (sequence parallelism), the Worker asserts it
              is on the V1 runner before computing SP padding, and the block opens with{' '}
              {
                '"TODO(lucas): This is pretty gross; ideally we should only ever call _determine_batch_execution_and_padding once ... but this requires a larger refactor of PP."'
              }{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L1238-L1251')}>
                gpu_worker.py L1238-L1251
              </Cite>
              . Sequence parallelism with TP (tensor parallelism) above 1 is on the
              amber list, which keeps such deployments on V1.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="The log lines and flags that tell you which runner, kernel and graph mode a deployment is actually on"
          >
            What to check on a running deployment
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Runner.</strong> The worker logs &quot;Using V2 Model Runner&quot;
            when MRv2 is active{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L478-L479')}>
              gpu_worker.py L478-L479
            </Cite>
            . A fallback logs &quot;Model Runner V2 does not yet support ...; using the
            V1 model runner instead.&quot; and names the feature responsible{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L752-L759')}>
              vllm.py L752-L759
            </Cite>
            . That feature is the one to plan around before V1&apos;s removal, targeted
            for v0.32.
          </Box>
          <Box variant="p">
            <strong>Forcing a runner.</strong> <code>VLLM_USE_V2_MODEL_RUNNER=1</code>{' '}
            turns an amber-list fallback into a startup error that lists what V2 lacks.{' '}
            <code>VLLM_USE_V2_MODEL_RUNNER=0</code> forces V1, and a blue-list feature
            then fails at startup.
          </Box>
          <Box variant="p">
            <strong>Attention backend.</strong> &quot;Using X attention backend out of
            potential backends: [...]&quot; names the winner and every backend that
            validated{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/cuda.py', 'L526-L534')}>
              cuda.py L526-L534
            </Cite>
            . Pin one with <code>--attention-backend</code>.
          </Box>
          <Box variant="p">
            <strong>CUDA graphs.</strong> A downgrade logs &quot;CUDAGraphMode.X is not
            supported with B backend&quot; followed by the mode it chose instead{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L1389-L1415')}>
              compilation.py L1389-L1415
            </Cite>
            .{' '}
            <code>--enforce-eager</code> or <code>-O0</code> removes graphs entirely
            when you need to rule them out.
          </Box>
          <Box variant="p">
            <strong>Async scheduling.</strong> It is on unless the model is a pooling
            model or a startup warning says otherwise; <code>--no-async-scheduling</code>{' '}
            turns it off.
          </Box>
          <Box variant="p">
            <strong>GPU selection.</strong> <code>--device-ids 2,3</code> picks physical
            GPUs by integer ID or UUID (no duplicates, no mixing of the two) without
            setting <code>CUDA_VISIBLE_DEVICES</code>, which keeps the full topology
            visible for GPU-to-NIC (network interface card) affinity. If{' '}
            <code>CUDA_VISIBLE_DEVICES</code> is already set, integer IDs index into it, and
            the Ray executor ignores the flag{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1136-L1148')}>
              arg_utils.py L1136-L1148
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2064-L2102')}>
              arg_utils.py L2064-L2102
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
