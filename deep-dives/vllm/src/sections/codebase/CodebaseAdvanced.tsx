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

const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';
const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';

type Runner = 'v2' | 'v2only' | 'v1';

interface SpecRow {
  method: string;
  runner: Runner;
  cls: string;
  notes: string;
}

const specRows: SpecRow[] = [
  {
    method: 'eagle / eagle3',
    runner: 'v2',
    cls: 'EagleSpeculator (V1 runner: EagleProposer)',
    notes:
      "Draft head fed the target's hidden states; eagle3 adds auxiliary hidden-state outputs. Parallel drafting (P-EAGLE) falls back to the V1 runner.",
  },
  {
    method: 'mtp (27 model-type names)',
    runner: 'v2',
    cls: 'MTPSpeculator, MultiModuleMTPSpeculator, Gemma4Speculator',
    notes:
      'MTP heads shipped with the target. Per-model names such as deepseek_mtp are rewritten to mtp with a deprecation warning. With several MTP layers and k > 1, MultiModuleMTPSpeculator runs one layer per draft step; drafts of model type gemma4_mtp get Gemma4Speculator.',
  },
  {
    method: 'draft_model',
    runner: 'v2',
    cls: 'PlainDraftModelSpeculator (V1 runner: DraftModelProposer)',
    notes:
      'A separate small language model. Equal vocabulary size is enforced unless use_heterogeneous_vocab is set. Parallel drafting (PARD) falls back to the V1 runner.',
  },
  {
    method: 'dflash',
    runner: 'v2',
    cls: 'DFlashSpeculator, DFlash2Speculator, LiLiCorrSpeculator',
    notes:
      "Parallel drafting forced on. The draft checkpoint's architecture picks LiLiCorr, DFlash2 (candidate head) or plain DFlash.",
  },
  {
    method: 'dspark',
    runner: 'v2only',
    cls: 'DSparkSpeculator (a DFlashSpeculator)',
    notes: 'The method the docs pair with adaptive verification.',
  },
  {
    method: 'extract_hidden_states',
    runner: 'v2',
    cls: 'ExtractHiddenStatesSpeculator',
    notes: 'Saves target-layer activations, for training EAGLE-style drafters or offline analysis.',
  },
  {
    method: 'ngram',
    runner: 'v1',
    cls: 'NgramProposer',
    notes:
      'Prompt lookup, numba JIT (just-in-time) compiled on the CPU: copies the continuation of the last matching n-gram. No model, no draft probabilities.',
  },
  {
    method: 'ngram_gpu',
    runner: 'v1',
    cls: 'NgramProposerGPU',
    notes:
      'The same lookup on the GPU. NgramGPUKernel is an nn.Module under @support_torch_compile, so Inductor generates its Triton code.',
  },
  {
    method: 'suffix',
    runner: 'v1',
    cls: 'SuffixDecodingProposer',
    notes:
      'Arctic Inference suffix trees (arctic-inference==0.1.1) over the prompt and recent outputs; num_speculative_tokens defaults to the tree depth, 24.',
  },
  {
    method: 'medusa',
    runner: 'v1',
    cls: 'MedusaProposer',
    notes: 'Parallel prediction heads on the target propose several tokens in one pass.',
  },
  {
    method: 'mlp_speculator',
    runner: 'v1',
    cls: 'none in the V1 runner dispatch',
    notes:
      'Accepted by the config and sent to the V1 runner, whose dispatch has no mlp_speculator branch at v0.31.0. Not run during this research: test before relying on it.',
  },
  {
    method: 'custom_class',
    runner: 'v1',
    cls: 'create_custom_proposer(...)',
    notes: 'Loads a user proposer class by qualified name.',
  },
];

const runnerBadge: Record<Runner, ReactNode> = {
  v2: <Badge color="blue">Model Runner V2</Badge>,
  v2only: <Badge color="blue">Model Runner V2 only</Badge>,
  v1: <Badge color="grey">V1 runner (deprecated)</Badge>,
};

interface BackendRow {
  backend: string;
  library: string;
  selector: string;
  notes: string;
}

const backendRows: BackendRow[] = [
  {
    backend: 'xgrammar',
    library: 'xgrammar',
    selector: 'First under "auto"',
    notes:
      'JSON schema, regex, EBNF (Extended Backus-Naur Form) and Lark grammars. Honours disable_any_whitespace.',
  },
  {
    backend: 'guidance',
    library: 'llguidance',
    selector: 'Fallback under "auto"; first for Lark grammars on Tekken Mistral tokenizers',
    notes:
      'The only backend for disable_additional_properties; also honours disable_any_whitespace. Rejects non-Tekken Mistral tokenizers.',
  },
  {
    backend: 'outlines',
    library: 'outlines',
    selector: 'Fallback for non-Tekken Mistral tokenizers or schema features guidance lacks',
    notes: 'FSM (finite-state machine) based. Imported only when selected.',
  },
  {
    backend: 'lm-format-enforcer',
    library: 'lm-format-enforcer',
    selector: 'Only when named',
    notes: 'Token-filter enforcement. Rejects Mistral tokenizers. Imported only when selected.',
  },
];

interface LevelRow {
  level: string;
  compile: string;
  graphs: string;
  fusions: string;
}

const levelRows: LevelRow[] = [
  { level: '-O0', compile: 'None', graphs: 'NONE', fusions: 'All off' },
  {
    level: '-O1',
    compile: 'Dynamo + Inductor (VLLM_COMPILE)',
    graphs: 'PIECEWISE',
    fusions: 'Norm and activation quant fusions, where those custom ops are on',
  },
  {
    level: '-O2 (default)',
    compile: 'As -O1',
    graphs: 'FULL_AND_PIECEWISE',
    fusions: 'Adds all-reduce + RMSNorm and RoPE + KV-cache fusions, where their conditions hold',
  },
  { level: '-O3', compile: 'As -O2', graphs: 'FULL_AND_PIECEWISE', fusions: 'Identical to -O2' },
];

function SpecDecodeLoopDiagram() {
  const stages = [
    {
      x: 14,
      fill: '#f2f8fd',
      title: '1. Propose',
      lines: ['speculator.propose (V2)', 'drafter.propose (V1 runner)', 'k draft tokens per request'],
      tag: [] as string[],
    },
    {
      x: 282,
      fill: '#f4f4f4',
      title: '2. Verify',
      lines: ['target model, one forward pass', 'logits for k drafts + 1 bonus'],
      tag: ['adaptive verification (V2):', 'per-request verify budget'],
    },
    {
      x: 550,
      fill: '#efe7fb',
      title: '3. RejectionSampler',
      lines: [
        'accept / recover / bonus',
        'standard: Leviathan et al. 2022',
        'block: Sun et al. 2024',
        'synthetic: calibrated rates',
      ],
      tag: [] as string[],
    },
  ];
  const outputs = [
    { x: 214, label: 'accepted', sub: 'draft agrees with target', fill: '#ecf7ec' },
    { x: 411, label: 'recovered', sub: 'first rejected position', fill: '#fdf3ec' },
    { x: 608, label: 'bonus', sub: 'every draft accepted', fill: '#f2f8fd' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 392"
        role="img"
        aria-labelledby="sdl-title"
        aria-describedby="sdl-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="sdl-title">
          Speculative decoding runs one propose, verify and accept loop on whichever model runner
          owns the method: Model Runner V2 speculators for eagle, eagle3, mtp, draft_model, dflash,
          dspark and extract_hidden_states, and the deprecated V1 model runner for ngram,
          ngram_gpu, suffix, medusa, mlp_speculator, custom_class and parallel drafting with EAGLE
          or a draft model.
        </title>
        <desc id="sdl-desc">
          The drafter proposes k tokens per request. The target model scores them plus one bonus
          position in a single forward pass; on Model Runner V2, adaptive verification can trim how
          many drafts each request gets verified. The rejection sampler, using the standard, block
          or synthetic method, keeps the accepted prefix, recovers one token at the first
          rejection, or appends a bonus token when every draft is accepted. Accepted tokens become
          context for the next propose step.
        </desc>
        <style>{`
          .sdl-h { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .sdl-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .sdl-tag { fill: #065299; font: 600 11px sans-serif; text-anchor: middle; }
          .sdl-cap { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .sdl-ol { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .sdl-head { fill: #16191f; font: 600 12px sans-serif; }
          .sdl-foot { fill: #5f6b7a; font: 11px sans-serif; }
          .sdl-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#sdl-ah); }
          .sdl-br { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .sdl-loop { stroke: #5f6b7a; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#sdl-ah); }
        `}</style>
        <defs>
          <marker
            id="sdl-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="800" height="392" rx="8" fill="#ffffff" />

        {/* The two speculator families */}
        <rect x="14" y="14" width="376" height="96" rx="6" fill="#f2f8fd" stroke="#0972d3" strokeWidth="1.5" />
        <text className="sdl-h" x="202" y="38">
          Model Runner V2 speculators (default)
        </text>
        <text className="sdl-s" x="202" y="60">
          eagle, eagle3, mtp, draft_model, dflash,
        </text>
        <text className="sdl-s" x="202" y="78">
          dspark, extract_hidden_states
        </text>
        <text className="sdl-s" x="202" y="96">
          (dspark and adaptive verification need V2)
        </text>
        <rect x="410" y="14" width="376" height="96" rx="6" fill="#fbf3d5" stroke="#8b6c00" strokeWidth="1.5" />
        <text className="sdl-h" x="598" y="38">
          V1 model runner fallback (deprecated)
        </text>
        <text className="sdl-s" x="598" y="60">
          ngram, ngram_gpu, suffix, medusa,
        </text>
        <text className="sdl-s" x="598" y="78">
          mlp_speculator, custom_class,
        </text>
        <text className="sdl-s" x="598" y="96">
          parallel drafting with eagle or draft_model
        </text>
        <text className="sdl-cap" x="400" y="132">
          speculative_config.method picks the family, and that family&apos;s runner runs the loop
          below
        </text>

        {/* Propose, verify, sample */}
        {stages.map((s) => (
          <g key={s.title}>
            <rect x={s.x} y="148" width="236" height="112" rx="6" fill={s.fill} stroke="#879596" />
            <text className="sdl-h" x={s.x + 118} y="172">
              {s.title}
            </text>
            {s.lines.map((l, i) => (
              <text key={l} className="sdl-s" x={s.x + 118} y={194 + i * 16}>
                {l}
              </text>
            ))}
            {s.tag.map((l, i) => (
              <text key={l} className="sdl-tag" x={s.x + 118} y={228 + i * 16}>
                {l}
              </text>
            ))}
          </g>
        ))}
        <path className="sdl-arr" d="M250 204 H280" />
        <path className="sdl-arr" d="M518 204 H548" />

        {/* Outputs */}
        <text className="sdl-head" x="214" y="284">
          output tokens = accepted + recovered + bonus
        </text>
        <path className="sdl-br" d="M214 302 V296 H784 V302" />
        {outputs.map((o) => (
          <g key={o.label}>
            <rect x={o.x} y="304" width="176" height="50" rx="4" fill={o.fill} stroke="#879596" />
            <text className="sdl-ol" x={o.x + 88} y="325">
              {o.label}
            </text>
            <text className="sdl-s" x={o.x + 88} y="343">
              {o.sub}
            </text>
          </g>
        ))}
        <path className="sdl-arr" d="M668 260 V293" />

        {/* Feedback loop */}
        <path className="sdl-loop" d="M212 329 H132 V263" />
        <text className="sdl-foot" x="14" y="378">
          dashed: accepted tokens become context for the next propose step
        </text>
      </svg>
    </div>
  );
}

function GuidedDecodeDiagram() {
  const steps = [
    {
      x: 14,
      fill: '#efe7fb',
      title: 'compile_grammar',
      sub: ['per request, async', 'failure ends that', 'request only'],
    },
    {
      x: 214,
      fill: '#ecf7ec',
      title: 'fill_bitmask',
      sub: ['on the CPU, per grammar', 'int32 words,', '32 tokens per word'],
    },
    {
      x: 414,
      fill: '#fbf3d5',
      title: 'copy to GPU',
      sub: ['async H2D on a', 'side copy stream', '+ (req, pos) row map'],
    },
    {
      x: 614,
      fill: '#fdf3ec',
      title: 'Triton mask kernel',
      sub: ["vLLM's, adapted", "from xgrammar's", 'masked logits = -inf'],
    },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 300"
        role="img"
        aria-labelledby="gdd-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="gdd-title">
          Guided decoding masks logits before any token is sampled. Each request&apos;s grammar
          compiles asynchronously, and a compile failure ends only that request. Every step the
          grammar fills a packed bitmask on the CPU, one bit per token and 32 tokens per int32
          word; on Model Runner V2 the bitmask goes to the GPU on a side copy stream and vLLM&apos;s
          Triton kernel sets every disallowed logit to negative infinity, then the sampler or
          rejection sampler runs. Rolling the grammar back un-applies rejected draft tokens.
        </title>
        <style>{`
          .gdd-h { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .gdd-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .gdd-head { fill: #414d5c; font: 600 12px sans-serif; }
          .gdd-foot { fill: #5f6b7a; font: 11px sans-serif; }
          .gdd-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#gdd-ah); }
        `}</style>
        <defs>
          <marker
            id="gdd-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="800" height="300" rx="8" fill="#ffffff" />
        <text className="gdd-head" x="14" y="24">
          Compile once per request, then fill, copy and mask on every step
        </text>
        {steps.map((s) => (
          <g key={s.title}>
            <rect x={s.x} y="40" width="176" height="100" rx="6" fill={s.fill} stroke="#879596" />
            <text className="gdd-h" x={s.x + 88} y="66">
              {s.title}
            </text>
            {s.sub.map((l, i) => (
              <text key={l} className="gdd-s" x={s.x + 88} y={90 + i * 16}>
                {l}
              </text>
            ))}
          </g>
        ))}
        <path className="gdd-arr" d="M190 90 H212" />
        <path className="gdd-arr" d="M390 90 H412" />
        <path className="gdd-arr" d="M590 90 H612" />

        <rect x="280" y="186" width="240" height="60" rx="6" fill="#f2f8fd" stroke="#879596" />
        <text className="gdd-h" x="400" y="212">
          Sampler / RejectionSampler
        </text>
        <text className="gdd-s" x="400" y="232">
          runs after the mask
        </text>
        <path className="gdd-arr" d="M702 140 V216 H522" />

        <text className="gdd-foot" x="14" y="280">
          grammar.rollback(n) un-applies rejected draft tokens, so the grammar stays in step with
          spec decode
        </text>
      </svg>
    </div>
  );
}

function TorchCompilePipelineDiagram() {
  const top = [
    { x: 10, fill: '#efe7fb', title: '@support_torch_compile', sub: ['on the model class', '147 classes at v0.31.0'] },
    { x: 280, fill: '#f2f8fd', title: 'VllmBackend', sub: ['custom torch.compile backend', 'mode VLLM_COMPILE (-O1 and up)'] },
    { x: 550, fill: '#fbf3d5', title: 'split_graph', sub: ['cut at splitting_ops: attention,', 'Mamba, GDN, sparse indexers'] },
  ];
  const pieces = [
    { label: 'graph 0', sub: 'compiled, captured', fill: '#ecf7ec' },
    { label: 'attention', sub: 'runs eagerly', fill: '#fdf3ec' },
    { label: 'graph 1', sub: 'compiled, captured', fill: '#ecf7ec' },
    { label: 'attention', sub: 'runs eagerly', fill: '#fdf3ec' },
    { label: 'graph 2', sub: 'compiled, captured', fill: '#ecf7ec' },
  ];
  const passes = [
    { w: 100, a: 'fusion passes', b: 'per fuse_* flag', fill: '#f2f8fd' },
    { w: 84, a: 'cleanup', b: 'post_cleanup', fill: '#ecf7ec' },
    { w: 116, a: 'IR lowering', b: 'VllmIRLoweringPass', fill: '#efe7fb' },
    { w: 134, a: 'clone elimination', b: 'drops leftover clones', fill: '#fbf3d5' },
    { w: 84, a: 'cleanup', b: 'post_cleanup', fill: '#ecf7ec' },
    { w: 144, a: 'FixFunctionalization', b: 'always last', fill: '#fdf3ec' },
  ];
  const passX: number[] = [];
  passes.reduce((x, p) => {
    passX.push(x);
    return x + p.w + 20;
  }, 19);
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 800 400"
        role="img"
        aria-labelledby="tcp-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="tcp-title">
          The torch.compile path in vLLM: the @support_torch_compile decorator, on 147 model
          classes at v0.31.0, routes the forward through VllmBackend, which cuts the FX graph at the
          splitting ops (attention, Mamba, GDN and sparse-indexer ops) into piecewise sub-graphs.
          Each sub-graph runs the post-grad passes in a fixed order: fusion, cleanup, IR lowering,
          clone elimination, cleanup, and the functionalization fix last. CUDA graphs are captured
          in the default FULL_AND_PIECEWISE mode. Breakable CUDA graphs are the run-time
          alternative to the compile-time cut.
        </title>
        <style>{`
          .tcp-h { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .tcp-h12 { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .tcp-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .tcp-p { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .tcp-ps { fill: #414d5c; font: 10px sans-serif; text-anchor: middle; }
          .tcp-head { fill: #16191f; font: 600 12px sans-serif; }
          .tcp-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#tcp-ah); }
        `}</style>
        <defs>
          <marker
            id="tcp-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="800" height="400" rx="8" fill="#ffffff" />

        {top.map((b) => (
          <g key={b.title}>
            <rect x={b.x} y="14" width="240" height="70" rx="6" fill={b.fill} stroke="#879596" />
            <text className="tcp-h" x={b.x + 120} y="38">
              {b.title}
            </text>
            {b.sub.map((l, i) => (
              <text key={l} className="tcp-s" x={b.x + 120} y={58 + i * 16}>
                {l}
              </text>
            ))}
          </g>
        ))}
        <path className="tcp-arr" d="M250 49 H278" />
        <path className="tcp-arr" d="M520 49 H548" />

        <text className="tcp-head" x="10" y="110">
          PiecewiseBackend sub-graphs: split ops stay outside, compiled code between
        </text>
        {pieces.map((b, i) => (
          <g key={`${b.label}-${i}`}>
            <rect x={10 + i * 158} y="120" width="140" height="46" rx="4" fill={b.fill} stroke="#879596" />
            <text className="tcp-p" x={80 + i * 158} y="140">
              {b.label}
            </text>
            <text className="tcp-s" x={80 + i * 158} y="156">
              {b.sub}
            </text>
          </g>
        ))}

        <rect x="10" y="186" width="780" height="110" rx="6" fill="#f4f4f4" stroke="#879596" />
        <text className="tcp-head" x="22" y="208">
          PostGradPassManager: a fixed order on each sub-graph
        </text>
        {passes.map((p, i) => (
          <g key={`${p.a}-${i}`}>
            <rect x={passX[i]} y="222" width={p.w} height="56" rx="4" fill={p.fill} stroke="#879596" />
            <text className="tcp-p" x={passX[i] + p.w / 2} y="246">
              {p.a}
            </text>
            <text className="tcp-ps" x={passX[i] + p.w / 2} y="263">
              {p.b}
            </text>
          </g>
        ))}
        {passes.slice(0, -1).map((p, i) => (
          <path
            key={`arr-${i}`}
            className="tcp-arr"
            d={`M${passX[i] + p.w} 250 H${passX[i + 1] - 2}`}
          />
        ))}
        <path className="tcp-arr" d="M245 296 V314" />

        <rect x="10" y="316" width="470" height="70" rx="6" fill="#fbf3d5" stroke="#879596" />
        <text className="tcp-h12" x="245" y="338">
          CUDA graph capture: FULL_AND_PIECEWISE (-O2 default)
        </text>
        <text className="tcp-s" x="245" y="356">
          FULL graphs for decode batches, PIECEWISE for prefill and mixed
        </text>
        <text className="tcp-s" x="245" y="372">
          capture sizes up to 512, or 1024 on data-centre Blackwell
        </text>
        <rect
          x="500"
          y="316"
          width="290"
          height="70"
          rx="6"
          fill="#ffffff"
          stroke="#879596"
          strokeDasharray="5 4"
        />
        <text className="tcp-h12" x="645" y="338">
          Alternative: breakable CUDA graphs
        </text>
        <text className="tcp-s" x="645" y="356">
          one capture, cut at run time
        </text>
        <text className="tcp-s" x="645" y="372">
          around attention and KV-cache ops
        </text>
      </svg>
    </div>
  );
}

export function CodebaseAdvanced() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which runner your speculative method lands on, what masks a structured-output request, and what -O2 compiles by default (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Spec decode, guided decoding & compilation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> The scheduler and the KV (key-value) cache decide
            which tokens get computed; these three subsystems decide how a forward pass becomes tokens. Speculative decoding
            trades parallel compute for fewer sequential steps, guided decoding masks the output to
            a grammar, and compilation makes the forward pass both depend on fast. All three plug
            into the model runner. Model Runner V2 (MRv2, <code>vllm/v1/worker/gpu/</code>) is the
            default for every model; the V1 model runner (
            <code>vllm/v1/worker/gpu_model_runner.py</code>) is deprecated, with removal targeted
            for v0.32, and runs only when a configuration needs something MRv2 lacks{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            . Each subsystem is a family of backends behind a narrow contract (
            <code>BaseSpeculator</code> or <code>SpecDecodeBaseProposer</code>,{' '}
            <code>StructuredOutputBackend</code>, <code>LogitsProcessor</code>, the{' '}
            <code>vllm_ir</code> registry), and config picks the backend. The Execution &amp;
            Attention tab covers how the runner itself is chosen.
          </Box>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href={TREE}>
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            : <code>vllm/config/</code>, <code>vllm/sampling_params.py</code>,{' '}
            <code>vllm/v1/worker/gpu/</code>, <code>vllm/v1/worker/gpu_model_runner.py</code>,{' '}
            <code>vllm/v1/spec_decode/</code>, <code>vllm/v1/structured_output/</code>,{' '}
            <code>vllm/v1/sample/</code>, <code>vllm/compilation/</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which runner your method lands on, how drafts are verified, and the constraints that stop a configuration at startup"
          >
            Speculative decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The idea.</strong> One token per forward pass leaves the GPU memory-bound and
            idle on math. A cheap drafter proposes <code>k</code> tokens, the target model scores
            all of them in one forward pass, and the accepted prefix comes out of a single step.
            Under the default verification method that costs no output correctness.
          </Box>
          <Box variant="p">
            <strong>The method decides the runner.</strong> MRv2 has its own speculator family in{' '}
            <Cite tier={1} href={`${TREE}/vllm/v1/worker/gpu/spec_decode`}>
              vllm/v1/worker/gpu/spec_decode/
            </Cite>{' '}
            (8,597 lines), covering <code>eagle</code>, <code>eagle3</code>, <code>mtp</code>{' '}
            (Multi-Token Prediction), <code>draft_model</code>, <code>dflash</code>,{' '}
            <code>dspark</code> and <code>extract_hidden_states</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/spec_decode/__init__.py', 'L8-L70')}>
              spec_decode/__init__.py L8-L70
            </Cite>
            . Six methods have no MRv2 speculator: <code>ngram</code>, <code>ngram_gpu</code>,{' '}
            <code>suffix</code>, <code>medusa</code>, <code>mlp_speculator</code> and{' '}
            <code>custom_class</code> put the deployment on the deprecated V1 model runner, as does
            parallel drafting with EAGLE (Extrapolation Algorithm for Greater Language-model
            Efficiency) or a draft model{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3072-L3092')}>
              vllm.py L3072-L3092
            </Cite>
            . The reverse also holds: <code>dspark</code>, adaptive verification and DFlash
            candidate-head or mixed sliding/full drafts exist only on MRv2, and the V1 model runner
            refuses them{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3125-L3141')}>
              vllm.py L3125-L3141
            </Cite>
            .
          </Box>
          <SpecDecodeLoopDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. Method families read from{' '}
            <code>vllm/config/vllm.py</code> and{' '}
            <code>vllm/v1/worker/gpu/spec_decode/__init__.py</code> at v0.31.0.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={specRows}
            columnDefinitions={[
              { id: 'method', header: 'method', cell: (r) => <code>{r.method}</code>, minWidth: 150 },
              { id: 'runner', header: 'Runs on', cell: (r) => runnerBadge[r.runner], minWidth: 150 },
              { id: 'cls', header: 'Class', cell: (r) => r.cls, minWidth: 180 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
          />
          <Box variant="small">
            Runner column:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3051-L3141')}>
              vllm.py L3051-L3141
            </Cite>
            . Classes:{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_model_runner.py', 'L604-L676')}>
              gpu_model_runner.py L604-L676
            </Cite>
            . MTP names, rewrite and multi-module rule:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L39-L67')}>
              speculative.py L39-L67
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1135-L1139')}>
              L1135-L1139
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1973-L1979')}>
              L1973-L1979
            </Cite>
            . DFlash and DSpark parallel drafting:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1462-L1463')}>
              L1462-L1463
            </Cite>
            . Suffix defaults:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1590-L1600')}>
              L1590-L1600
            </Cite>
            . Hidden-state extraction:{' '}
            <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/extract_hidden_states/')}>
              vLLM docs
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Check which runner you got.</strong> A fallback logs{' '}
            <code>
              Model Runner V2 does not yet support speculative method &apos;ngram&apos;; using the
              V1 model runner instead.
            </code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L752-L759')}>
              vllm.py L752-L759
            </Cite>
            ; forcing <code>VLLM_USE_V2_MODEL_RUNNER=1</code> with such a method fails startup{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3315-L3331')}>
              vllm.py L3315-L3331
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Verification.</strong> Each runner has its own <code>RejectionSampler</code>.
            The V1 model runner&apos;s docstring says it &quot;strictly follows the algorithm
            described in&quot; Leviathan et al. 2022{' '}
            <Cite tier={3} href="https://arxiv.org/abs/2211.17192">
              arXiv:2211.17192
            </Cite>{' '}
            and defines the three outputs in the diagram{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/rejection_sampler.py', 'L45-L64')}>
              rejection_sampler.py L45-L64
            </Cite>
            : accepted tokens, where draft and target agree; one recovered token at the first
            rejection, resampled from an adjusted distribution that keeps the output distribution
            exact; and a bonus token from the target when every draft is accepted. MRv2&apos;s
            sampler reads <code>rejection_sample_method</code>: <code>standard</code> (default) is
            probabilistic rejection sampling, <code>block</code> verifies the drafts jointly as a
            block (Sun et al. 2024){' '}
            <Cite tier={3} href="https://arxiv.org/abs/2403.10444">
              arXiv:2403.10444
            </Cite>
            , and <code>synthetic</code> accepts drafts with a decaying probability calibrated to
            configured rates{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L530-L536')}>
              speculative.py L530-L536
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/worker/gpu/spec_decode/rejection_sampler.py', 'L147-L175')}
            >
              gpu/spec_decode/rejection_sampler.py L147-L175
            </Cite>
            . The V1 sampler branches only on <code>synthetic</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/rejection_sampler.py', 'L83-L96')}>
              rejection_sampler.py L83-L96
            </Cite>
            , so pair <code>block</code> with a method that runs on MRv2.
          </Box>

          <Alert type="warning" header="Constraints that decide whether a speculative configuration starts">
            <ul>
              <li>
                <strong>The drafter runs on the last pipeline-parallel (PP) rank</strong> on both
                runners{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L272-L274')}>
                  gpu/model_runner.py L272-L274
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_model_runner.py', 'L601-L604')}>
                  gpu_model_runner.py L601-L604
                </Cite>
                . The V1 runner&apos;s NOTE: placing the whole draft model there &quot;is not
                ideal if there are many layers in the draft model.&quot;
              </li>
              <li>
                <strong>A draft&apos;s tensor-parallel (TP) size is 1 or the target&apos;s.</strong>{' '}
                Anything else raises, and unset means the target&apos;s TP (1 for{' '}
                <code>mlp_speculator</code>){' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1706-L1737')}>
                  speculative.py L1706-L1737
                </Cite>
                . The V1 runner&apos;s <code>DraftModelProposer</code> also requires them equal,
                because with target TP above 1 and draft TP of 1 &quot;the torch compile cache is
                overwritten and corrupted&quot;{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/draft_model.py', 'L63-L80')}>
                  draft_model.py L63-L80
                </Cite>
                . MRv2&apos;s <code>PlainDraftModelSpeculator</code> has no equality check:{' '}
                <code>grep -rn tensor_parallel_size vllm/v1/worker/gpu/spec_decode</code> matches
                only <code>dspark/utils.py</code>{' '}
                <Cite
                  tier={1}
                  kind="code"
                  href={vllmUrl('vllm/v1/worker/gpu/spec_decode/draft_model/speculator.py', 'L29-L116')}
                >
                  draft_model/speculator.py L29-L116
                </Cite>
                .
              </li>
              <li>
                <strong>A draft model&apos;s vocabulary size must match the target&apos;s</strong> at
                config validation, unless <code>use_heterogeneous_vocab=True</code> (TLI, token-level
                intersection: <code>draft_model</code> only, greedy draft sampling){' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1848-L1862')}>
                  speculative.py L1848-L1862
                </Cite>
                . The TLI token mapping is wired into the V1 runner&apos;s proposer{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/draft_model.py', 'L37-L58')}>
                  draft_model.py L37-L58
                </Cite>
                ; a search of <code>vllm/v1/worker</code>, which holds the MRv2 code, found no
                reference to it during this research, and it was not run, so test cross-vocabulary
                drafts on MRv2 first.
              </li>
              <li>
                <strong>Adaptive verification</strong> needs MRv2, full CUDA graphs, no LoRA
                (low-rank adaptation) and a PP size of 1{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3151-L3178')}>
                  vllm.py L3151-L3178
                </Cite>
                .
              </li>
            </ul>
          </Alert>

          <ExpandableSection headerText="How each runner dispatches a method, and the MTP variants">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>MRv2.</strong> <code>init_speculator()</code> checks, in order,{' '}
                <code>extract_hidden_states</code>, <code>dflash</code> (then the draft
                architecture), <code>dspark</code>, <code>use_gemma4_mtp()</code>,{' '}
                <code>use_multi_module_mtp()</code>, <code>mtp</code>, <code>use_eagle()</code> and{' '}
                <code>uses_draft_model()</code>, and raises <code>NotImplementedError</code> for
                anything else. Every class descends from <code>BaseSpeculator</code> (abstract{' '}
                <code>init_cudagraph_manager</code>, <code>capture</code>, <code>propose</code>)
                through <code>DraftModelSpeculator</code>; <code>AutoRegressiveSpeculator</code>{' '}
                sits above the EAGLE, MTP and Gemma 4 speculators, and{' '}
                <code>DFlashSpeculator</code> above DFlash2, LiLiCorr (through DFlash2) and DSpark{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/spec_decode/speculator.py', 'L59-L103')}>
                  speculator.py L59-L103
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>The V1 model runner.</strong> A cascade checks <code>custom_class</code>,{' '}
                <code>ngram</code>, <code>uses_draft_model()</code>, <code>use_ngram_gpu()</code>,{' '}
                <code>use_gemma4_mtp()</code>, <code>use_step3p5_mtp()</code>,{' '}
                <code>use_dflash()</code>, <code>suffix</code>, <code>use_eagle()</code>,{' '}
                <code>medusa</code> and <code>extract_hidden_states</code>, then raises{' '}
                <code>ValueError</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_model_runner.py', 'L604-L676')}>
                  gpu_model_runner.py L604-L676
                </Cite>
                . <code>EagleProposer</code>, <code>DFlashProposer</code>,{' '}
                <code>DraftModelProposer</code> and <code>Gemma4Proposer</code> extend{' '}
                <code>SpecDecodeBaseProposer</code>, <code>Step3p5MTPProposer</code> extends{' '}
                <code>EagleProposer</code>, and the CPU and GPU n-gram, Medusa, suffix and
                hidden-state proposers are standalone classes with the same <code>propose(...)</code> shape{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/llm_base_proposer.py', 'L72')}>
                  llm_base_proposer.py L72
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>MTP variants.</strong> <code>speculative.py</code> lists 27 MTP model types,
                from <code>deepseek_mtp</code> to <code>glm5_next_mtp</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L39-L67')}>
                  speculative.py L39-L67
                </Cite>
                . With <code>num_speculative_tokens &gt; 1</code> on a single MTP layer the config
                warns that it &quot;will run multiple times of forward on same MTP layer, which may
                result in lower acceptance rate&quot;, except for <code>step3p5_mtp</code> and{' '}
                <code>inkling_mtp</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1370-L1379')}>
                  L1370-L1379
                </Cite>
                . A checkpoint with several MTP layers avoids that on MRv2, where{' '}
                <code>MultiModuleMTPSpeculator</code> runs each layer once.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="p">
            <strong>Turning speculation down under load.</strong> Verification cost grows with batch
            size times <code>k</code>, and past a critical batch size speculation slows decode{' '}
            <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/dynamic_speculative_decoding/')}>
              vLLM docs: Dynamic Speculative Decoding
            </Cite>
            . Two controls respond to that.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Dynamic speculative decoding</Box>
              <Box variant="p">
                <code>num_speculative_tokens_per_batch_size</code> takes{' '}
                <code>[start, end, K]</code> entries over inclusive batch-size ranges, and the
                scheduler applies the matching <code>K</code> each step; <code>K = 0</code> turns
                drafting off{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L491-L497')}>
                  speculative.py L491-L497
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L292-L298')}>
                  scheduler.py L292-L298
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Adaptive verification</Box>
              <Box variant="p">
                <code>enable_adaptive_verification</code> admits (request, position) draft slots by
                survival probability under a cost budget profiled at startup{' '}
                <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/adaptive_verification/')}>
                  vLLM docs: Adaptive Verification
                </Cite>
                . The docs and the field docstring support it only for DSpark with a confidence head{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L552-L554')}>
                  speculative.py L552-L554
                </Cite>
                . The code reaches further: the shared <code>DraftModelSpeculator</code> base builds
                an online acceptance estimator for drafters without one{' '}
                <Cite
                  tier={1}
                  kind="doc-code-conflict"
                  href={vllmUrl('vllm/v1/worker/gpu/spec_decode/speculator.py', 'L171-L255')}
                >
                  speculator.py L171-L255
                </Cite>
                , and the v0.30.0 notes describe it for every draft-model speculator{' '}
                <Cite tier={1} href={`${RELEASE_NOTES}v0.30.0`}>
                  vLLM v0.30.0 release notes
                </Cite>
                . Outside DSpark, treat it as untested.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>What to do with this.</strong> Pick a method from the Model Runner V2 rows and
            confirm the startup log carries no V1 fallback warning. Then measure:{' '}
            <code>--per-request-spec-decode-metrics summary</code> adds mean acceptance length,
            draft acceptance rate and a histogram to each response under{' '}
            <code>metrics.speculative_decoding</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/observability.py', 'L48-L56')}>
              observability.py L48-L56
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1626-L1627')}>
              arg_utils.py L1626-L1627
            </Cite>
            . If concurrency varies, add a dynamic schedule that drops <code>K</code> as the batch
            grows.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which backend compiles your grammar, where the mask meets the logits, and why a bad grammar costs one request"
          >
            Guided / structured decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The contract.</strong> <code>vllm/v1/structured_output/backend_types.py</code>{' '}
            defines two abstract classes: <code>StructuredOutputBackend</code>, the engine-level
            factory (<code>compile_grammar</code>, <code>allocate_token_bitmask</code>,{' '}
            <code>destroy</code>), and <code>StructuredOutputGrammar</code>, the per-request
            matcher (<code>accept_tokens</code>, <code>validate_tokens</code>,{' '}
            <code>fill_bitmask</code>, <code>rollback</code>, <code>is_terminated</code>,{' '}
            <code>reset</code>){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/backend_types.py', 'L31-L138')}>
              backend_types.py L31-L138
            </Cite>
            .
          </Box>
          <GuidedDecodeDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. The copy and kernel boxes show Model Runner V2.
            H2D: host to device.
          </Box>
          <Box variant="p">
            <strong>The mask path.</strong> The grammar fills a packed bitmask on the CPU, 32 tokens
            per <code>int32</code> word, with <code>-1</code> meaning all allowed{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L59')}>
              structured_output/__init__.py L59
            </Cite>
            . On MRv2 the bitmask goes to the GPU on a side copy stream together with a (request,
            position) to logit-row map, which lets adaptive verification resolve offsets on the
            device, and vLLM&apos;s Triton kernel <code>_apply_grammar_bitmask_kernel</code>,
            adapted from xgrammar&apos;s, writes negative infinity into each disallowed logit{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/structured_outputs.py', 'L58-L162')}>
              gpu/structured_outputs.py L58-L162
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1582-L1591')}>
              gpu/model_runner.py L1582-L1591
            </Cite>
            . The V1 runner calls <code>xgr.apply_token_bitmask_inplace</code> instead{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/utils.py', 'L101-L191')}>
              utils.py L101-L191
            </Cite>
            . Either way the mask lands before the sampler or rejection sampler runs.
          </Box>
          <Box variant="p">
            <strong>How &quot;auto&quot; picks a backend.</strong> The default{' '}
            <code>backend = &quot;auto&quot;</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L21-L25')}>
              structured_outputs.py L21-L25
            </Cite>{' '}
            resolves per request during <code>SamplingParams</code> validation: xgrammar first; if
            xgrammar rejects the request, guidance, or outlines for non-Tekken Mistral tokenizers
            and for JSON-schema features guidance lacks. Lark grammars on Tekken Mistral tokenizers
            go straight to guidance, because the xgrammar backend declares no Mistral special tokens
            and a regex could match <code>[TOOL_CALLS]</code> as text{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1282-L1342')}>
              sampling_params.py L1282-L1342
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={backendRows}
            columnDefinitions={[
              { id: 'backend', header: 'Backend', cell: (r) => <code>{r.backend}</code>, minWidth: 150 },
              { id: 'lib', header: 'Library', cell: (r) => r.library, minWidth: 130 },
              { id: 'sel', header: 'Selected', cell: (r) => r.selector, minWidth: 200 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
          />
          <Box variant="small">
            Backend set:{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L115-L164')}>
              structured_output/__init__.py L115-L164
            </Cite>
            . Option and tokenizer rules:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L61-L73')}>
              structured_outputs.py L61-L73
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1250-L1280')}>
              sampling_params.py L1250-L1280
            </Cite>
            . Native Lark:{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/backend_xgrammar.py', 'L93-L94')}>
              backend_xgrammar.py L93-L94
            </Cite>
            .
          </Box>
          <Alert type="info" header="Grammar rollback is what makes structured spec decode work">
            Spec decode advances the grammar by draft tokens before they are verified, so every
            grammar implements <code>rollback(num_tokens)</code> to undo rejected ones;
            xgrammar&apos;s matcher is built with{' '}
            <code>max_rollback_tokens = num_speculative_tokens</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/backend_xgrammar.py', 'L129')}>
              backend_xgrammar.py L129
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/backend_guidance.py', 'L206-L210')}>
              backend_guidance.py L206-L210
            </Cite>
            . The manager allocates one bitmask row per speculative position plus the bonus token{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L324-L336')}>
              structured_output/__init__.py L324-L336
            </Cite>
            .
          </Alert>
          <Box variant="p">
            <strong>A grammar that fails to compile fails one request.</strong> The failure is
            logged as <code>Failed to compile grammar for request &lt;id&gt;</code>, carried to the
            scheduler in the grammar&apos;s <code>Future</code>, and only that request finishes, as{' '}
            <code>FINISHED_ERROR</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L178-L200')}>
              structured_output/__init__.py L178-L200
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L3115-L3121')}>
              scheduler.py L3115-L3121
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L2243-L2256')}>
              L2243-L2256
            </Cite>
            . That log line is the signal when one client&apos;s structured requests fail while the
            rest of the traffic flows.
          </Box>
          <Alert
            type="warning"
            header={'Under "auto", the first structured request picks the engine\'s backend'}
          >
            The engine builds one backend, from the first structured request&apos;s resolution,
            and compiles every later grammar on it: &quot;We only support a single backend. We do
            NOT support different backends on a per-request basis in V1 (for now,
            anyway...)&quot;{' '}
            <Cite
              tier={1}
              kind="code"
              href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L125-L130')}
            >
              structured_output/__init__.py L125-L130
            </Cite>
            . When traffic mixes grammar types, pin it, for example{' '}
            <code>
              --structured-outputs-config &apos;{'{'}&quot;backend&quot;: &quot;guidance&quot;
              {'}'}&apos;
            </code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1830')}>
              arg_utils.py L1830
            </Cite>
            ; a pinned backend validates each request on arrival, with no fallback{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1250-L1252')}>
              sampling_params.py L1250-L1252
            </Cite>
            . <code>disable_any_whitespace</code> and <code>disable_additional_properties</code>{' '}
            need a pinned backend too, since the validator rejects them under &quot;auto&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L61-L73')}>
              structured_outputs.py L61-L73
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The order logits are shaped in on each runner, and why a custom V1 logits processor needs rewriting for Model Runner V2"
          >
            Sampling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>On MRv2</strong> (<code>vllm/v1/worker/gpu/sample/sampler.py</code>), logits
            arrive already grammar-masked{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1582-L1591')}>
              gpu/model_runner.py L1582-L1591
            </Cite>
            . When any request in the batch needs logit processing,{' '}
            <code>apply_sampling_params</code> copies them to <code>float32</code> and runs logit
            bias, penalties, bad words, any custom processors, thinking-budget forcing, temperature,{' '}
            <code>min_p</code> and top-k / top-p, in that order{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/sample/sampler.py', 'L66-L76')}>
              gpu/sample/sampler.py L66-L76
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/sample/sampler.py', 'L223-L272')}>
              L223-L272
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>On the V1 model runner</strong> (<code>vllm/v1/sample/sampler.py</code>), raw
            logprobs are captured first, so top-k logprobs reflect the pre-penalty distribution;
            then come the <code>float32</code> cast, the allowed-token mask, bad words, the
            processors that can change a greedy argmax (min tokens, logit bias) and penalties. An
            all-greedy batch returns early; otherwise temperature, the argmax-invariant processors
            such as <code>min_p</code>, then top-k / top-p{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/sampler.py', 'L71-L110')}>
              sampler.py L71-L110
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/sampler.py', 'L244-L300')}>
              L244-L300
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/sampler.py', 'L372-L412')}>
              L372-L412
            </Cite>
            . On both runners <code>min_p</code> follows temperature.
          </Box>
          <Box variant="p">
            <strong>Two LogitsProcessor contracts.</strong> The V1 contract centres on{' '}
            <code>apply(logits)</code>, <code>is_argmax_invariant()</code> (true if the processor
            cannot change a greedy argmax, so greedy requests skip it) and{' '}
            <code>update_state(batch_update)</code>; built-ins are <code>MinPLogitsProcessor</code>
            , <code>LogitBiasLogitsProcessor</code> and <code>MinTokensLogitsProcessor</code>, and
            custom ones register by qualified name{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/logits_processor/interface.py', 'L60-L100')}>
              interface.py L60-L100
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/logits_processor/builtin.py', 'L23-L165')}>
              builtin.py L23-L165
            </Cite>
            . MRv2 accepts custom processors from v0.31.0{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.31.0`}>
              vLLM v0.31.0 release notes
            </Cite>{' '}
            through a different abstract class: <code>validate_params</code>,{' '}
            <code>add_request(req_idx, sampling_params)</code>, <code>apply_staged_writes()</code>{' '}
            and an abstract <code>apply(logits, ctx)</code>, with no{' '}
            <code>is_argmax_invariant</code> or <code>update_state</code>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/worker/gpu/sample/logits_processor/interface.py', 'L92-L145')}
            >
              gpu/sample/logits_processor/interface.py L92-L145
            </Cite>
            . Rewrite a V1 processor against that interface before running it on the default
            runner.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What -O2 compiles and captures by default, how capture sizes are chosen, and the two ways vLLM keeps attention out of a CUDA graph"
          >
            Compilation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The entry point.</strong> A model opts in with{' '}
            <code>@support_torch_compile</code> (<code>vllm/compilation/decorators.py</code>).{' '}
            <code>
              grep -rn &apos;^@support_torch_compile&apos; vllm/model_executor/models vllm/models |
              wc -l
            </code>{' '}
            counts 147 decorated classes in 134 files at v0.31.0, <code>llama.py</code> among them{' '}
            <Cite tier={1} href={vllmUrl('vllm/model_executor/models/llama.py', 'L337')}>
              llama.py L337
            </Cite>
            . Above <code>-O0</code> the mode defaults to <code>VLLM_COMPILE</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1775-L1779')}>
              vllm.py L1775-L1779
            </Cite>
            , which routes the forward through <code>VllmBackend</code>, vLLM&apos;s custom{' '}
            <code>torch.compile</code> backend; <code>STOCK_TORCH_COMPILE</code> falls back to the
            V1 model runner{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3056-L3057')}>
              vllm.py L3056-L3057
            </Cite>
            .
          </Box>
          <TorchCompilePipelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. The decorator count, splitting ops, pass order
            and capture ceilings are read from v0.31.0 source and cited in the text. GDN: Gated
            DeltaNet. IR: intermediate representation.
          </Box>
          <Box variant="p">
            <strong>Splitting the graph.</strong> The backend&apos;s &quot;major work,&quot; per
            its docstring, is splitting the FX graph into piecewise graphs{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/backends.py', 'L801-L812')}>
              backends.py L801-L812
            </Cite>
            . <code>split_graph</code> cuts at the splitting ops{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/backends.py', 'L549-L552')}>
              backends.py L549-L552
            </Cite>
            , by default the <code>_attention_ops</code> list: standard and MLA (multi-head latent
            attention) attention, Mamba mixers, short convolutions, linear attention, GDN attention,
            sparse attention indexers and DeepSeek V4 attention, plus the KV-cache
            update ops when Inductor graph partition is off{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L762-L782')}>
              compilation.py L762-L782
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L1143-L1190')}>
              L1143-L1190
            </Cite>
            . The regions between cuts become <code>PiecewiseBackend</code> sub-graphs, and the
            split ops run eagerly between them.
          </Box>
          <Box variant="p">
            <strong>Post-grad passes.</strong> <code>PostGradPassManager</code> runs a fixed order
            on each sub-graph: the enabled fusions, <code>post_cleanup</code>,{' '}
            <code>VllmIRLoweringPass</code> (binds <code>vllm_ir</code> ops to kernels),{' '}
            <code>UnsafeCloneEliminationPass</code> (removes clones left after lowering),{' '}
            <code>post_cleanup</code> again, and <code>FixFunctionalizationPass</code>, &quot;always
            run last&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/passes/pass_manager.py', 'L108-L139')}>
              pass_manager.py L108-L139
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/passes/ir/clone_elimination.py', 'L72-L81')}>
              clone_elimination.py L72-L81
            </Cite>
            . Fusion defaults come from the optimization level. On CUDA at <code>-O2</code>, the
            all-reduce plus RMSNorm (root mean square normalization) fusion turns on only with TP
            above 1, compute capability 9.0 or 10.x and FlashInfer installed, and never under{' '}
            <code>VLLM_BATCH_INVARIANT</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L178-L201')}>
              vllm.py L178-L201
            </Cite>
            ; the attention-quant, sequence-parallel and GEMM (general matrix multiply)
            communication fusions stay off because <code>IS_QUANTIZED</code> and{' '}
            <code>IS_DENSE</code> are hard-coded <code>False</code> (issue #25689){' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L145-L152')}>
              vllm.py L145-L152
            </Cite>
            .
          </Box>

          <ExpandableSection headerText="vllm/ir: a portable op registry that picks a kernel at compile time">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>vllm/ir/</code> lets one logical op carry several interchangeable kernels.{' '}
                <code>register_op</code> (<code>vllm/ir/op.py</code>) creates an <code>IrOp</code>{' '}
                in a torch library named <code>vllm_ir</code>, reachable as{' '}
                <code>torch.ops.vllm_ir.*</code>. Each op starts with a <code>native</code>{' '}
                implementation; <code>op.register_impl(provider, ...)</code> adds alternatives, each
                guarded by a <code>supported</code> flag and an optional{' '}
                <code>supports_args(...)</code> check{' '}
                <Cite tier={1} href={vllmUrl('vllm/ir/op.py', 'L79-L153')}>
                  op.py L79-L153
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/ir/op.py', 'L240-L290')}>
                  L240-L290
                </Cite>
                . Priority lists live in <code>KernelConfig.ir_op_priority</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/kernel.py', 'L20-L37')}>
                  kernel.py L20-L37
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Selection is a compile-time decision.</strong>{' '}
                <code>VllmIRLoweringPass</code> &quot;lowers vLLM IR ops to their implementations
                [using] the priority list&quot;: for each IR node it calls{' '}
                <code>ir_op.dispatch(*fake_args)</code>, records the provider and rewrites the node
                via <code>match.replace_by_example</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/compilation/passes/ir/lowering_pass.py', 'L26-L77')}>
                  lowering_pass.py L26-L77
                </Cite>
                . The registry is deliberately small, three ops in two files:{' '}
                <code>rms_norm</code> and <code>fused_add_rms_norm</code> in{' '}
                <code>layernorm.py</code>, <code>gelu_and_mul_sparse</code> in{' '}
                <code>activation.py</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/ir/ops/layernorm.py', 'L9-L44')}>
                  layernorm.py L9-L44
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/ir/ops/activation.py', 'L11-L12')}>
                  activation.py L11-L12
                </Cite>
                . It is an extension mechanism sized for a handful of ops.{' '}
                <Badge color="grey">in-code TODOs in lowering_pass.py</Badge>
              </Box>
              <Box variant="small">
                TODOs in <code>lowering_pass.py</code> include &quot;Cache the fx_replacement to
                avoid re-tracing the same impl&quot; and &quot;write self.selected_impls to
                depyf/tlparse dir&quot;: the selected-impl map is computed but not persisted for
                offline inspection{' '}
                <Cite tier={1} href={vllmUrl('vllm/compilation/passes/ir/lowering_pass.py', 'L58-L77')}>
                  lowering_pass.py L58-L77
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="p">
            <strong>Optimization levels.</strong> One flag sets the compilation mode, the CUDA graph
            mode and the fusion defaults together. The default is <code>-O2</code>, and{' '}
            <code>-O3</code> is currently the same: the two level dictionaries differ only in name{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L442')}>
              vllm.py L442
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L254-L346')}>
              L254-L346
            </Cite>
            . The Configuration tab covers the flag itself. RoPE: rotary position embedding.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={levelRows}
            columnDefinitions={[
              { id: 'level', header: 'Level', cell: (r) => <code>{r.level}</code>, minWidth: 110 },
              { id: 'compile', header: 'Compilation', cell: (r) => r.compile, minWidth: 170 },
              { id: 'graphs', header: 'CUDA graphs', cell: (r) => <code>{r.graphs}</code>, minWidth: 170 },
              { id: 'fusions', header: 'Fusion defaults', cell: (r) => r.fusions },
            ]}
          />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Piecewise CUDA graphs</Box>
              <Box variant="p">
                <code>PIECEWISE</code> captures a graph per compiled sub-graph and leaves the split
                ops out, so dynamic-shape attention kernels run eagerly between captured regions.
                It needs <code>VLLM_COMPILE</code> with non-empty splitting ops.
              </Box>
            </div>
            <div>
              <Box variant="h3">Full CUDA graphs</Box>
              <Box variant="p">
                <code>FULL</code> captures the whole forward. <code>FULL_DECODE_ONLY</code> captures
                decode batches only, which the docstring suggests for decode instances in a P/D
                (prefill/decode) split to save memory. The default{' '}
                <code>FULL_AND_PIECEWISE</code> captures full graphs for decode batches and
                piecewise graphs for prefill and mixed ones, &quot;the most performant mode for most
                models&quot; in the field docstring{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L606-L641')}>
                  compilation.py L606-L641
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Breakable CUDA graphs: the run-time cut.</strong> Piecewise splitting cuts the
            graph at compile time. Breakable CUDA graphs cut it at run time: one capture context
            drives the whole forward, ends stream capture at each attention or KV-cache op, runs it
            eagerly and resumes{' '}
            <Cite tier={1} href={vllmUrl('vllm/compilation/breakable_cudagraph.py', 'L1-L20')}>
              breakable_cudagraph.py L1-L20
            </Cite>
            . It is on by default for 24 architecture classes, among them DeepSeek V3.2, V4 and
            V4.1, Kimi K3, GLM-5 Next, MiniMax-M3 sparse and Qwen4Exp with their MTP heads; on ROCm
            (AMD&apos;s GPU stack) only <code>DeepseekV41ForCausalLM</code> gets it by default{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L79-L127')}>
              vllm.py L79-L127
            </Cite>
            . Startup then logs{' '}
            <code>
              Auto-enabling VLLM_USE_BREAKABLE_CUDAGRAPH=1. Set VLLM_USE_BREAKABLE_CUDAGRAPH=0 to
              opt out.
            </code>
            ; setting the variable to 1 forces it for any model{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L837-L846')}>
              vllm.py L837-L846
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L771-L773')}>
              envs.py L771-L773
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Capture sizes, and what to set.</strong> When{' '}
            <code>max_cudagraph_capture_size</code> is unset, vLLM uses{' '}
            <code>min(max_num_seqs * uniform_decode_query_len * 2, ceiling)</code>, with a ceiling
            of 1024 on data-centre Blackwell (device-capability family 100) and 512 elsewhere, and{' '}
            <code>uniform_decode_query_len</code> equal to one plus the number of draft tokens{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L2450-L2460')}>
              vllm.py L2450-L2460
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L680-L687')}>
              L680-L687
            </Cite>
            . Sizes run 1, 2, 4, then multiples of 8 to 256, then multiples of 16 to that maximum{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/compilation.py', 'L691-L705')}>
              compilation.py L691-L705
            </Cite>
            , and a batch above the largest size runs without a CUDA graph{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L2388-L2436')}>
              vllm.py L2388-L2436
            </Cite>
            . With the <code>vllm serve</code> default of 1024 sequences on H100-class and larger
            GPUs{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2858-L2918')}>
              arg_utils.py L2858-L2918
            </Cite>{' '}
            the product is at least 2048, so the ceiling decides: 512 on Hopper, 1024 on
            data-centre Blackwell. Start from <code>-O2</code>, since <code>-O3</code> adds nothing
            at v0.31.0, and drop to <code>-O0</code> when startup time matters more than steady
            state. If capture time or graph memory is the constraint, set{' '}
            <code>max_cudagraph_capture_size</code> or an explicit{' '}
            <code>cudagraph_capture_sizes</code> list in <code>--compilation-config</code>; on a P/D
            decode instance, try <code>FULL_DECODE_ONLY</code>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
