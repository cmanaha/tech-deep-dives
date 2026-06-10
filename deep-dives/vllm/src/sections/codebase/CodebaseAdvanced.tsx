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

interface SpecRow {
  method: string;
  proposer: string;
  base: string;
  notes: string;
}

const specRows: SpecRow[] = [
  {
    method: 'ngram',
    proposer: 'NgramProposer',
    base: 'standalone (numba JIT)',
    notes:
      'Prompt-lookup decoding. Matches the last n tokens against earlier context and copies the continuation. No model, no probabilities: the cheapest proposer.',
  },
  {
    method: 'ngram (GPU)',
    proposer: 'NgramProposerGPU',
    base: 'standalone (nn.Module + Triton)',
    notes:
      'GPU n-gram match kernel. Selected via use_ngram_gpu(); keeps the lookup on-device to avoid host round-trips at large batch.',
  },
  {
    method: 'eagle / eagle3',
    proposer: 'EagleProposer',
    base: 'SpecDecodeBaseProposer',
    notes:
      'Lightweight draft head fed the target model hidden states. eagle3 turns on auxiliary hidden-state outputs (eagle3_use_aux_hidden_state).',
  },
  {
    method: 'mtp (deepseek_mtp, glm4_moe_mtp, qwen3_next_mtp, ...)',
    proposer: 'EagleProposer / Gemma4Proposer / Step3p5MTPProposer',
    base: 'SpecDecodeBaseProposer / EagleProposer',
    notes:
      'Multi-Token Prediction heads shipped with the target model. Most MTP variants route through the EAGLE path; gemma4_mtp and step3p5_mtp have dedicated subclasses.',
  },
  {
    method: 'dflash',
    proposer: 'DFlashProposer',
    base: 'SpecDecodeBaseProposer',
    notes:
      'Parallel-drafting variant (parallel_drafting = True). Uses auxiliary hidden-state outputs from the target model.',
  },
  {
    method: 'medusa',
    proposer: 'MedusaProposer',
    base: 'standalone',
    notes:
      'Multiple parallel prediction heads attached to the target model that propose several future tokens in one pass.',
  },
  {
    method: 'draft_model',
    proposer: 'DraftModelProposer',
    base: 'SpecDecodeBaseProposer',
    notes:
      'Generic small draft model. Enforces equal vocab size with the target and asserts draft TP equals target TP.',
  },
  {
    method: 'suffix',
    proposer: 'SuffixDecodingProposer',
    base: 'standalone (Arctic Inference)',
    notes:
      'Per-prompt suffix trees from Arctic Inference; proposes from a cache of recent outputs rather than a model.',
  },
  {
    method: 'custom_class',
    proposer: 'create_custom_proposer(...)',
    base: 'user-supplied',
    notes:
      'Escape hatch: load a user proposer class by qualified name. Lets a deployment ship a proposer vLLM does not know about.',
  },
];

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
    selector: '"auto" usually resolves here',
    notes:
      'The default in practice. Compiles JSON-schema / regex / EBNF grammars to a fast token-level matcher; provides apply_token_bitmask_inplace for the logits step.',
  },
  {
    backend: 'guidance',
    library: 'llguidance',
    selector: '"guidance"',
    notes:
      'Microsoft llguidance matcher. Supports disable_any_whitespace and disable_additional_properties for tighter JSON behaviour.',
  },
  {
    backend: 'outlines',
    library: 'outlines',
    selector: '"outlines"',
    notes: 'FSM-based constrained decoding. Lazily imported only when selected.',
  },
  {
    backend: 'lm-format-enforcer',
    library: 'lm-format-enforcer',
    selector: '"lm-format-enforcer"',
    notes: 'Token-filter enforcement of a target format. Lazily imported only when selected.',
  },
];

function SpecDecodeLoopDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 780 300"
        width="100%"
        role="img"
        aria-labelledby="specloop-title specloop-desc"
        style={{ maxWidth: '780px', height: 'auto', fontFamily: 'monospace' }}
      >
        <title id="specloop-title">Speculative decoding propose then verify loop</title>
        <desc id="specloop-desc">
          A proposer drafts k candidate tokens, the target model scores all of them in one
          forward pass, and the rejection sampler accepts a prefix, recovers one token on the
          first mismatch, and appends a bonus token when every draft is accepted.
        </desc>

        {/* Propose stage */}
        <rect x="10" y="40" width="220" height="90" rx="6" fill="#e7f0fb" stroke="#879596" />
        <text x="120" y="64" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#16191f">
          1. Propose
        </text>
        <text x="120" y="86" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          drafter.propose(...)
        </text>
        <text x="120" y="102" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          k draft tokens (+ probs,
        </text>
        <text x="120" y="116" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          None for ngram)
        </text>

        {/* Verify stage */}
        <rect x="280" y="40" width="220" height="90" rx="6" fill="#fbf3e0" stroke="#879596" />
        <text x="390" y="64" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#16191f">
          2. Verify
        </text>
        <text x="390" y="86" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          target model, one pass
        </text>
        <text x="390" y="102" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          logits over k + bonus
        </text>
        <text x="390" y="116" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          positions
        </text>

        {/* Sample stage */}
        <rect x="550" y="40" width="220" height="90" rx="6" fill="#efe7fb" stroke="#879596" />
        <text x="660" y="64" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#16191f">
          3. RejectionSampler
        </text>
        <text x="660" y="86" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          accept / recover / bonus
        </text>
        <text x="660" y="102" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          Leviathan 2022
        </text>
        <text x="660" y="116" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          arXiv:2211.17192
        </text>

        {/* arrows left to right */}
        <line x1="230" y1="85" x2="278" y2="85" stroke="#5f6b7a" strokeWidth="1.5" />
        <polygon points="278,85 270,81 270,89" fill="#5f6b7a" />
        <line x1="500" y1="85" x2="548" y2="85" stroke="#5f6b7a" strokeWidth="1.5" />
        <polygon points="548,85 540,81 540,89" fill="#5f6b7a" />

        {/* outputs row */}
        <text x="10" y="176" fontSize="12" fontWeight="bold" fill="#16191f">
          output tokens = accepted + recovered + bonus
        </text>
        {[
          { label: 'accepted', sub: 'draft = target', fill: '#e9f7ef' },
          { label: 'recovered', sub: 'first mismatch', fill: '#fde2e4' },
          { label: 'bonus', sub: 'all accepted', fill: '#e7f0fb' },
        ].map((b, i) => (
          <g key={b.label} transform={`translate(${10 + i * 180}, 190)`}>
            <rect width="170" height="48" rx="4" fill={b.fill} stroke="#879596" />
            <text x="85" y="22" fontSize="11" textAnchor="middle" fill="#16191f">
              {b.label}
            </text>
            <text x="85" y="38" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              {b.sub}
            </text>
          </g>
        ))}

        {/* feedback loop */}
        <line x1="660" y1="130" x2="660" y2="262" stroke="#5f6b7a" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="660" y1="262" x2="120" y2="262" stroke="#5f6b7a" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="120" y1="262" x2="120" y2="132" stroke="#5f6b7a" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="120,132 116,140 124,140" fill="#5f6b7a" />
        <text x="390" y="278" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          accepted tokens become context for the next propose step
        </text>
      </svg>
    </Box>
  );
}

function GuidedDecodeDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 780 300"
        width="100%"
        role="img"
        aria-labelledby="guided-title guided-desc"
        style={{ maxWidth: '780px', height: 'auto', fontFamily: 'monospace' }}
      >
        <title id="guided-title">Guided decoding logit-mask path</title>
        <desc id="guided-desc">
          The grammar fills a packed token bitmask on the CPU, the bitmask is copied to the
          device, disallowed tokens have their logits set to negative infinity in place, and
          only then does sampling run.
        </desc>

        {[
          {
            x: 10,
            title: 'compile_grammar',
            sub1: 'backend.compile_grammar(',
            sub2: 'type, spec)',
            fill: '#efe7fb',
          },
          {
            x: 200,
            title: 'fill_bitmask (CPU)',
            sub1: 'grammar.fill_bitmask',
            sub2: 'packed int32 / 32 tokens',
            fill: '#e9f7ef',
          },
          {
            x: 390,
            title: 'copy to device',
            sub1: 'torch.from_numpy(...)',
            sub2: '.to(logits.device)',
            fill: '#fbf3e0',
          },
          {
            x: 580,
            title: 'apply to logits',
            sub1: 'apply_token_bitmask',
            sub2: '_inplace  -> -inf',
            fill: '#fde2e4',
          },
        ].map((b) => (
          <g key={b.title} transform={`translate(${b.x}, 50)`}>
            <rect width="180" height="92" rx="6" fill={b.fill} stroke="#879596" />
            <text x="90" y="26" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16191f">
              {b.title}
            </text>
            <text x="90" y="52" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              {b.sub1}
            </text>
            <text x="90" y="68" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              {b.sub2}
            </text>
          </g>
        ))}

        {[190, 380, 570].map((x) => (
          <g key={x}>
            <line x1={x} y1="96" x2={x + 10} y2="96" stroke="#5f6b7a" strokeWidth="1.5" />
            <polygon points={`${x + 10},96 ${x + 2},92 ${x + 2},100`} fill="#5f6b7a" />
          </g>
        ))}

        {/* sampler */}
        <rect x="290" y="190" width="200" height="64" rx="6" fill="#e7f0fb" stroke="#879596" />
        <text x="390" y="216" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16191f">
          Sampler.forward
        </text>
        <text x="390" y="238" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          runs AFTER the mask
        </text>
        <line x1="670" y1="142" x2="670" y2="222" stroke="#5f6b7a" strokeWidth="1.5" />
        <line x1="670" y1="222" x2="492" y2="222" stroke="#5f6b7a" strokeWidth="1.5" />
        <polygon points="492,222 500,218 500,226" fill="#5f6b7a" />

        <text x="10" y="282" fontSize="10" fill="#5f6b7a">
          grammar.rollback(n) reverts the matcher so spec-decode draft tokens can be un-applied
          when rejected.
        </text>
      </svg>
    </Box>
  );
}

function TorchCompilePipelineDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 780 360"
        width="100%"
        role="img"
        aria-labelledby="compile-title compile-desc"
        style={{ maxWidth: '780px', height: 'auto', fontFamily: 'monospace' }}
      >
        <title id="compile-title">torch.compile pipeline in vLLM</title>
        <desc id="compile-desc">
          The support_torch_compile decorator routes the model into VllmBackend, which splits
          the FX graph at attention splitting ops into piecewise sub-graphs, runs the
          post-grad pass manager with fusion, IR lowering, cleanup, and a final
          functionalization fix, then captures piecewise or full CUDA graphs.
        </desc>

        {/* top row */}
        <rect x="10" y="20" width="240" height="60" rx="6" fill="#efe7fb" stroke="#879596" />
        <text x="130" y="44" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16191f">
          @support_torch_compile
        </text>
        <text x="130" y="64" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          on the model class (133 models)
        </text>

        <rect x="290" y="20" width="240" height="60" rx="6" fill="#e7f0fb" stroke="#879596" />
        <text x="410" y="44" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16191f">
          VllmBackend
        </text>
        <text x="410" y="64" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          custom torch.compile backend
        </text>

        <rect x="570" y="20" width="200" height="60" rx="6" fill="#fbf3e0" stroke="#879596" />
        <text x="670" y="40" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16191f">
          split_graph
        </text>
        <text x="670" y="58" fontSize="10" textAnchor="middle" fill="#5f6b7a">
          split at splitting_ops
        </text>
        <text x="670" y="72" fontSize="9" textAnchor="middle" fill="#5f6b7a">
          (attention ops)
        </text>

        <line x1="250" y1="50" x2="288" y2="50" stroke="#5f6b7a" strokeWidth="1.5" />
        <polygon points="288,50 280,46 280,54" fill="#5f6b7a" />
        <line x1="530" y1="50" x2="568" y2="50" stroke="#5f6b7a" strokeWidth="1.5" />
        <polygon points="568,50 560,46 560,54" fill="#5f6b7a" />

        {/* piecewise sub-graphs */}
        <text x="10" y="112" fontSize="12" fontWeight="bold" fill="#16191f">
          PiecewiseBackend sub-graphs (attention left outside, compiled between)
        </text>
        {[
          { label: 'graph 0', sub: 'pre-attn', fill: '#e9f7ef' },
          { label: 'attn', sub: 'not compiled', fill: '#fde2e4' },
          { label: 'graph 1', sub: 'inter-block', fill: '#e9f7ef' },
          { label: 'attn', sub: 'not compiled', fill: '#fde2e4' },
          { label: 'graph 2', sub: 'post-attn', fill: '#e9f7ef' },
        ].map((b, i) => (
          <g key={`${b.label}-${i}`} transform={`translate(${10 + i * 152}, 122)`}>
            <rect width="142" height="44" rx="4" fill={b.fill} stroke="#879596" />
            <text x="71" y="20" fontSize="11" textAnchor="middle" fill="#16191f">
              {b.label}
            </text>
            <text x="71" y="36" fontSize="9" textAnchor="middle" fill="#5f6b7a">
              {b.sub}
            </text>
          </g>
        ))}

        {/* post grad pass manager */}
        <rect x="10" y="190" width="760" height="96" rx="6" fill="#f4f4f4" stroke="#879596" />
        <text x="20" y="212" fontSize="12" fontWeight="bold" fill="#16191f">
          PostGradPassManager (per sub-graph, on the functionalized graph)
        </text>
        {[
          { label: 'fusion passes', fill: '#e7f0fb' },
          { label: 'post_cleanup', fill: '#e9f7ef' },
          { label: 'VllmIRLoweringPass', fill: '#efe7fb' },
          { label: 'post_cleanup', fill: '#e9f7ef' },
          { label: 'FixFunctionalization (last)', fill: '#fde2e4' },
        ].map((b, i) => (
          <g key={b.label} transform={`translate(${20 + i * 150}, 226)`}>
            <rect width="140" height="44" rx="4" fill={b.fill} stroke="#879596" />
            <text x="70" y="27" fontSize="9.5" textAnchor="middle" fill="#16191f">
              {b.label}
            </text>
          </g>
        ))}
        {[160, 310, 460, 610].map((x) => (
          <g key={x}>
            <line x1={x} y1="248" x2={x + 10} y2="248" stroke="#5f6b7a" strokeWidth="1.5" />
            <polygon points={`${x + 10},248 ${x + 2},244 ${x + 2},252`} fill="#5f6b7a" />
          </g>
        ))}

        {/* cudagraph */}
        <rect x="200" y="306" width="380" height="44" rx="6" fill="#fbf3e0" stroke="#879596" />
        <text x="390" y="326" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#16191f">
          CUDA graph capture: PIECEWISE or FULL
        </text>
        <text x="390" y="342" fontSize="9" textAnchor="middle" fill="#5f6b7a">
          CUDAGraphMode in CompilationConfig
        </text>
      </svg>
    </Box>
  );
}

export function CodebaseAdvanced() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How vLLM drafts ahead, constrains output to a grammar, and compiles the model graph"
          >
            Spec decode, guided decoding & compilation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> The scheduler and KV-cache machinery decide which
            tokens get computed; the three subsystems here decide how those tokens are produced
            once a forward pass runs. Speculative decoding trades extra parallel compute for
            fewer sequential steps. Guided decoding constrains the output distribution to a
            grammar before a token is ever sampled. Compilation rewrites the model graph so the
            forward pass that both of them depend on is fast. All three live under{' '}
            <code>vllm/v1/</code> and <code>vllm/compilation/</code>, and all three are wired
            into the same <code>gpu_model_runner.py</code> hot loop.
          </Box>
          <Box variant="p">
            <strong>The through-line.</strong> Each subsystem is a family of interchangeable
            implementations behind one interface: proposers behind{' '}
            <code>SpecDecodeBaseProposer</code>, grammar backends behind{' '}
            <code>StructuredOutputBackend</code>, logit shapers behind{' '}
            <code>LogitsProcessor</code>, and kernels behind the <code>vllm_ir</code> op
            registry. That shape is the recurring design move in the V1 codebase: a narrow
            abstract contract with many concrete backends selected by config.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One proposer family, propose then verify, accept / recover / bonus"
          >
            Speculative decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The idea.</strong> Generating one token per forward pass leaves the GPU
            memory-bound and idle on math. Speculative decoding has a cheap{' '}
            <em>proposer</em> draft <code>k</code> tokens ahead, then verifies all{' '}
            <code>k</code> against the real target model in a single forward pass. If the draft
            agrees with the target, several tokens are emitted for the cost of one step; if it
            diverges, the work is discarded with no loss of output correctness.
          </Box>
          <SpecDecodeLoopDiagram />
          <Box variant="p">
            <strong>The proposer family.</strong> Most proposers extend{' '}
            <code>SpecDecodeBaseProposer</code> (<code>vllm/v1/spec_decode/llm_base_proposer.py</code>):
            <code>EagleProposer</code>, <code>DFlashProposer</code>,{' '}
            <code>DraftModelProposer</code>, and <code>Gemma4Proposer</code> all subclass it, and{' '}
            <code>Step3p5MTPProposer</code> subclasses <code>EagleProposer</code>. A handful are
            standalone classes that share the same <code>propose(...)</code> shape without the
            base:
            <code>NgramProposer</code> (numba JIT on CPU), <code>NgramProposerGPU</code>{' '}
            (Triton on device), <code>MedusaProposer</code>, and{' '}
            <code>SuffixDecodingProposer</code>. The runner picks one by{' '}
            <code>speculative_config.method</code> in <code>gpu_model_runner.py</code>.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={specRows}
            columnDefinitions={[
              { id: 'method', header: 'method', cell: (r) => <code>{r.method}</code>, minWidth: 160 },
              { id: 'prop', header: 'Proposer class', cell: (r) => r.proposer, minWidth: 180 },
              { id: 'base', header: 'Base', cell: (r) => r.base, minWidth: 150 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
          />
          <Box variant="small">
            Method-to-proposer wiring verified in{' '}
            <code>vllm/v1/worker/gpu_model_runner.py</code> and the proposer files under{' '}
            <code>vllm/v1/spec_decode/</code> (vLLM commit 15652a6b, accessed 2026-06-07).
          </Box>

          <Box variant="p">
            <strong>Verification: the RejectionSampler.</strong>{' '}
            <code>vllm/v1/sample/rejection_sampler.py</code> implements the Leviathan et al.
            2022 algorithm. Its own docstring states it &quot;strictly follows the algorithm
            described in <Link external href="https://arxiv.org/abs/2211.17192">arXiv:2211.17192</Link>&quot;
            and defines the three output classes precisely:
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Accepted</Box>
              <Box variant="p">
                Tokens accepted based on the relationship between the raw draft and target
                probabilities. The longest agreeing prefix is kept verbatim.
              </Box>
            </div>
            <div>
              <Box variant="h3">Recovered</Box>
              <Box variant="p">
                On the first rejection, one token is resampled from an adjusted distribution
                derived from both the draft and target probabilities, the &quot;recover&quot;
                step that keeps the output distribution exact.
              </Box>
            </div>
            <div>
              <Box variant="h3">Bonus</Box>
              <Box variant="p">
                If every proposed token is accepted, a bonus token sampled from the target is
                appended. Output = accepted + recovered + bonus.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            <code>draft_probs</code> can be <code>None</code>. That is the n-gram case, where
            there is no draft distribution, only copied tokens. The forward signature carries
            this explicitly: <code>logits</code> is shaped{' '}
            <code>[num_tokens + batch_size, vocab_size]</code> so the bonus position is scored
            in the same pass.
          </Box>

          <Alert type="warning" header="V1 constraints worth knowing before you enable it">
            <ul>
              <li>
                <strong>Drafter lives on the last pipeline-parallel rank.</strong> The runner
                only constructs <code>self.drafter</code> when{' '}
                <code>get_pp_group().is_last_rank</code> is true. The inline NOTE says the entire
                draft model is placed there and that this &quot;is not ideal if there are many
                layers in the draft model.&quot;
              </li>
              <li>
                <strong>Draft TP must equal target TP.</strong>{' '}
                <code>DraftModelProposer._raise_if_draft_tp_mismatch</code> raises if{' '}
                <code>draft_tensor_parallel_size != tensor_parallel_size</code>. The comment
                explains why: with target TP greater than 1 and draft TP equal to 1, all ranks
                compile the draft model on rank 0, &quot;the torch compile cache is overwritten
                and corrupted.&quot; <code>_verify_and_get_draft_tp</code> in the speculative
                config also rejects any draft TP that is not 1 or the target TP.
              </li>
              <li>
                <strong>Generic draft models must match vocab size.</strong>{' '}
                <code>DraftModelProposer</code> calls{' '}
                <code>verify_equal_vocab_size_if_draft_model()</code> on construction.
              </li>
            </ul>
          </Alert>

          <ExpandableSection headerText="MTP variants and how methods route to proposers">
            <SpaceBetween size="s">
              <Box variant="p">
                Multi-Token Prediction heads are shipped inside a growing list of model
                families. <code>vllm/config/speculative.py</code> enumerates the MTP model types
                (<code>deepseek_mtp</code>, <code>glm4_moe_mtp</code>,{' '}
                <code>qwen3_next_mtp</code>, <code>ernie_mtp</code>,{' '}
                <code>nemotron_h_mtp</code>, <code>step3p5_mtp</code>,{' '}
                <code>gemma4_mtp</code>, and more), and rewrites the draft{' '}
                <code>hf_config</code> so the right MTP module loads.
              </Box>
              <Box variant="p">
                Routing is a cascade of predicates in <code>gpu_model_runner.py</code>:{' '}
                <code>method == &quot;custom_class&quot;</code>, then{' '}
                <code>== &quot;ngram&quot;</code>, then{' '}
                <code>uses_draft_model()</code>, <code>use_ngram_gpu()</code>,{' '}
                <code>use_gemma4_mtp()</code>, <code>use_step3p5_mtp()</code>,{' '}
                <code>use_dflash()</code>, <code>method == &quot;suffix&quot;</code>,{' '}
                <code>use_eagle()</code>, and <code>method == &quot;medusa&quot;</code>. Most MTP
                variants fall through to the EAGLE branch; only{' '}
                <code>gemma4_mtp</code> and <code>step3p5_mtp</code> get dedicated subclasses.
              </Box>
              <Box variant="p">
                A guardrail in the config warns that enabling{' '}
                <code>num_speculative_tokens &gt; 1</code> on a single MTP layer &quot;will run
                multiple times of forward on same MTP layer, which may result in lower
                acceptance rate&quot;, and there is a related{' '}
                <code>FIXME(luccafong)</code> noting that CUDA graph with v32 MTP is not yet
                supported.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Constrain the output to a grammar by masking logits before sampling"
          >
            Guided / structured decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The contract.</strong> Structured output lives under{' '}
            <code>vllm/v1/structured_output/</code>. Two abstract classes in{' '}
            <code>backend_types.py</code> define everything:{' '}
            <code>StructuredOutputBackend</code> is the engine-level factory (it{' '}
            <code>compile_grammar(...)</code> and <code>allocate_token_bitmask(...)</code>), and{' '}
            <code>StructuredOutputGrammar</code> is the per-request matcher (<code>accept_tokens</code>,{' '}
            <code>validate_tokens</code>, <code>fill_bitmask</code>, <code>rollback</code>,{' '}
            <code>is_terminated</code>, <code>reset</code>). Every backend implements both.
          </Box>
          <GuidedDecodeDiagram />
          <Box variant="p">
            <strong>The mask path.</strong> The grammar produces a packed bitmask on the CPU
            (one bit per token, 32 tokens per <code>int32</code>) via{' '}
            <code>grammar.fill_bitmask(...)</code>; the all-allowed value is{' '}
            <code>-1</code> (every bit set). The compacted bitmask is reordered to match the
            runner&apos;s batch, copied to the device with a non-blocking transfer, and then{' '}
            <code>apply_grammar_bitmask</code> (in <code>structured_output/utils.py</code>)
            calls <code>xgr.apply_token_bitmask_inplace(logits, grammar_bitmask, ...)</code>,
            which sets the logits of every disallowed token to negative infinity. This happens{' '}
            <strong>before</strong> <code>Sampler.forward</code> runs, so the sampler never sees
            a token the grammar forbids.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={backendRows}
            columnDefinitions={[
              { id: 'backend', header: 'Backend', cell: (r) => <code>{r.backend}</code>, minWidth: 150 },
              { id: 'lib', header: 'Library', cell: (r) => r.library, minWidth: 150 },
              { id: 'sel', header: 'Selected by', cell: (r) => r.selector, minWidth: 170 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
          />
          <Box variant="small">
            Backend selection is in <code>structured_output/__init__.py</code>; the config
            default is <code>backend = &quot;auto&quot;</code> in{' '}
            <code>vllm/config/structured_outputs.py</code>, which &quot;will make opinionated
            choices based on request contents&quot;, in practice xgrammar. V1 supports a{' '}
            <strong>single</strong> backend per engine, not per-request: an inline NOTE states
            &quot;We only support a single backend. We do NOT support different backends on a
            per-request basis in V1.&quot;
          </Box>
          <Alert type="info" header="Grammar rollback is what makes structured spec-decode work">
            Because spec-decode advances the grammar by several draft tokens speculatively, the
            matcher needs to undo that advance when tokens are rejected. The{' '}
            <code>rollback(num_tokens)</code> method on every grammar does exactly this: both
            xgrammar (<code>matcher.rollback(...)</code>) and guidance
            (<code>ll_matcher.rollback(...)</code>) implement it, and{' '}
            <code>structured_output/__init__.py</code> sizes its bitmask to cover{' '}
            <code>num_speculative_tokens</code> extra positions plus the bonus token.
          </Alert>
          <Box variant="small">
            Real in-code TODO from <code>structured_output/__init__.py</code>: &quot;we still
            need to handle xgrammar compilation failures, though it should be unlikely as we
            test that up front as well.&quot; A grammar that the backend cannot compile is a
            known unhandled edge.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The Sampler pipeline and the pluggable LogitsProcessor contract"
          >
            Sampling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The pipeline.</strong> <code>vllm/v1/sample/sampler.py</code> defines{' '}
            <code>Sampler(nn.Module)</code>. <code>forward</code> casts logits to{' '}
            <code>float32</code>, captures raw logprobs first (so top-k logprobs reflect the
            pre-penalty distribution), runs <code>apply_logits_processors</code>, then{' '}
            <code>sample</code>. Inside, the order is: logits processors, penalties,{' '}
            temperature scaling, then top-k / top-p sampling, with a fast path that returns
            <code>greedy_sample</code> when the batch is all-greedy.
          </Box>
          <Box variant="p">
            <strong>The LogitsProcessor contract.</strong>{' '}
            <code>logits_processor/interface.py</code> defines the abstract{' '}
            <code>LogitsProcessor</code> with three required methods:{' '}
            <code>apply(logits)</code> (may modify in place and must return the tensor),{' '}
            <code>is_argmax_invariant()</code> (true if the processor cannot change a greedy
            argmax, which lets the sampler skip it on greedy requests), and{' '}
            <code>update_state(batch_update)</code> (called before each forward pass when the
            batch makeup changes). Built-ins include <code>MinPLogitsProcessor</code>,{' '}
            <code>LogitBiasLogitsProcessor</code>, and <code>MinTokensLogitsProcessor</code>;
            deployments can register custom ones by qualified name.
          </Box>
          <Box variant="small">
            The guided-decoding bitmask is applied outside this pipeline (directly to the
            model&apos;s output logits in the runner), so it composes with (rather than running
            inside) the logits-processor chain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="From the decorator to piecewise CUDA graphs, plus the portable IR op registry"
          >
            Compilation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The entry point.</strong> A model opts in with the{' '}
            <code>@support_torch_compile</code> decorator from{' '}
            <code>vllm/compilation/decorators.py</code>, applied to roughly 133 model classes,
            including <code>llama.py</code>. In <code>VLLM_COMPILE</code> mode the decorated
            forward is routed through <code>VllmBackend</code>{' '}
            (<code>vllm/compilation/backends.py</code>), vLLM&apos;s custom{' '}
            <code>torch.compile</code> backend.
          </Box>
          <TorchCompilePipelineDiagram />
          <Box variant="p">
            <strong>Splitting the graph.</strong> The backend&apos;s &quot;major work,&quot; per
            its own docstring, is to split the FX graph into piecewise graphs.{' '}
            <code>split_graph(graph, splitting_ops)</code> cuts the graph at the splitting ops,
            which default to the attention ops list (<code>_attention_ops</code>, e.g.{' '}
            <code>vllm::unified_attention_with_output</code>). Each compilable region between
            attention boundaries becomes a <code>PiecewiseBackend</code> sub-graph; attention
            itself stays outside the compiled regions because its kernels and CUDA-graph
            behaviour are handled separately.
          </Box>
          <Box variant="p">
            <strong>Post-grad passes.</strong> <code>VllmBackend</code> installs a{' '}
            <code>PostGradPassManager</code> into the Inductor config. Its{' '}
            <code>__call__</code> runs a fixed order on the functionalized graph: the configured{' '}
            fusion passes, then <code>post_cleanup</code>, then{' '}
            <code>VllmIRLoweringPass</code> (lowers <code>vllm_ir</code> ops to a concrete
            implementation), a clone-elimination pass, another <code>post_cleanup</code>, and{' '}
            <code>FixFunctionalizationPass</code> &quot;always run last&quot;, so every pass
            before it sees a functionalized graph.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Piecewise CUDA graphs</Box>
              <Box variant="p">
                <code>CUDAGraphMode.PIECEWISE</code> captures a CUDA graph per compiled
                sub-graph and leaves attention out, so dynamic-shape attention kernels run
                eagerly between captured regions. This is the mode that pairs naturally with the
                attention-boundary split.
              </Box>
            </div>
            <div>
              <Box variant="h3">Full CUDA graphs</Box>
              <Box variant="p">
                <code>CUDAGraphMode.FULL</code> captures the whole forward in one graph for the
                lowest launch overhead, with combinations like{' '}
                <code>FULL_DECODE_ONLY</code> and <code>FULL_AND_PIECEWISE</code> for mixed
                prefill / decode workloads. The mode is set in{' '}
                <code>CompilationConfig</code>.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="vllm/ir: a portable op registry that picks a kernel at compile time">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>vllm/ir/</code> is a small registry that lets one logical op carry several
                interchangeable kernel implementations.{' '}
                <code>register_op</code> (in <code>vllm/ir/op.py</code>) creates an{' '}
                <code>IrOp</code> registered into a real torch library named{' '}
                <code>vllm_ir</code>, so the op is reachable as{' '}
                <code>torch.ops.vllm_ir.*</code>. Each op starts with a{' '}
                <code>native</code> implementation, and{' '}
                <code>op.register_impl(provider, ...)</code> adds alternatives, each guarded by
                a <code>supported</code> flag and an optional{' '}
                <code>supports_args(...)</code> shape / dtype check.
              </Box>
              <Box variant="p">
                <strong>Selection is a compile-time decision.</strong>{' '}
                <code>VllmIRLoweringPass</code> (in the post-grad pass manager) &quot;lowers vLLM
                IR ops to their implementations [using] the priority list.&quot; For each IR node
                it calls <code>ir_op.dispatch(*fake_args)</code> to choose the provider, records
                it, and rewrites the node to that implementation via{' '}
                <code>match.replace_by_example</code>. The op the model graph contains is generic;
                the concrete kernel is bound during compilation. The current registry is
                deliberately tiny (the registered op set in <code>vllm/ir/ops/</code> is{' '}
                <code>layernorm</code>), which is the point: it is an extension mechanism, not a
                replacement for every kernel.
                {' '}<Badge color="grey">two in-code TODOs in lowering_pass.py</Badge>
              </Box>
              <Box variant="small">
                Real TODOs in <code>passes/ir/lowering_pass.py</code>:{' '}
                &quot;Cache the fx_replacement to avoid re-tracing the same impl&quot; and
                &quot;write self.selected_impls to depyf/tlparse dir&quot;: the selected-impl
                map is computed but not yet persisted for offline inspection.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
