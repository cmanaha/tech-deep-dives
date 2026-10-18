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
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const SPEC_DOCS = vllmDocsUrl('features/speculative_decoding/');
const DSD_DOCS = vllmDocsUrl('features/speculative_decoding/dynamic_speculative_decoding/');
const AV_DOCS = vllmDocsUrl('features/speculative_decoding/adaptive_verification/');
const METRICS_DOCS = vllmDocsUrl('features/speculative_decoding/acceptance_metrics/');
const LILICORR_DOCS = vllmDocsUrl('features/speculative_decoding/lilicorr/');
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

function ProposeVerifyAcceptDiagram() {
  return (
    <svg
      viewBox="0 0 760 588"
      role="img"
      aria-labelledby="spec-loop-title"
      aria-describedby="spec-loop-desc"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="spec-loop-title">
        One target step of speculative decoding with K = 4 drafts under standard verification: a
        cheap drafter proposes four tokens, the target model verifies all four in one forward
        pass, and a left-to-right rejection-sampling check keeps the longest accepted prefix and
        replaces the first mismatch with a token from the target
      </title>
      <desc id="spec-loop-desc">
        Step starts from context &quot;the quick brown&quot;. PROPOSE drafts [fox jumps over the].
        VERIFY scores all four candidates in one pass. ACCEPT/REJECT keeps fox and jumps, rejects
        over, discards the, and emits &quot;fox jumps lazy&quot;: three tokens from one target pass.
      </desc>
      <style>
        {`
          .spec-bg { fill: #ffffff; }
          .spec-stage { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .spec-verify { fill: #eef6f5; stroke: #2ea597; stroke-width: 1.5; }
          .spec-tok { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .spec-tok-ok { fill: #e8f5e9; stroke: #1d8102; stroke-width: 1.4; }
          .spec-tok-bad { fill: #fdecea; stroke: #d13212; stroke-width: 1.4; }
          .spec-tok-drop { fill: #f4f4f4; stroke: #b5bcc4; stroke-width: 1.2; }
          .spec-emit { fill: #e8f5e9; stroke: #1d8102; stroke-width: 1.5; }
          .spec-st { fill: #0f1b2a; font: 700 13px sans-serif; text-anchor: middle; }
          .spec-ss { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .spec-tk { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .spec-v-ok { fill: #1d8102; font: 700 11px sans-serif; text-anchor: middle; }
          .spec-v-bad { fill: #d13212; font: 700 11px sans-serif; text-anchor: middle; }
          .spec-v-drop { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .spec-ctx { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .spec-ann { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .spec-annb { fill: #0972d3; font: 700 12px sans-serif; text-anchor: middle; }
          .spec-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#spec-ah); }
        `}
      </style>
      <defs>
        <marker
          id="spec-ah"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>

      <rect className="spec-bg" x={0} y={0} width={760} height={588} rx={8} />

      {/* Step start / context */}
      <text className="spec-ctx" x={380} y={24}>
        step start: context = &quot;...the quick brown&quot;
      </text>
      <line className="spec-arr" x1={380} y1={32} x2={380} y2={54} />

      {/* 1. PROPOSE */}
      <rect className="spec-stage" x={70} y={56} width={620} height={90} rx={8} />
      <text className="spec-st" x={380} y={80}>
        1. PROPOSE
      </text>
      <text className="spec-ss" x={380} y={98}>
        cheap drafter, K = 4, drafts the next four tokens
      </text>
      {['fox', 'jumps', 'over', 'the'].map((t, i) => {
        const x = 150 + i * 120;
        return (
          <g key={`prop-${t}`}>
            <rect className="spec-tok" x={x} y={110} width={100} height={26} rx={5} />
            <text className="spec-tk" x={x + 50} y={127}>
              {t}
            </text>
          </g>
        );
      })}

      <text className="spec-ann" x={380} y={166}>
        send all K candidates at once
      </text>
      <line className="spec-arr" x1={380} y1={172} x2={380} y2={194} />

      {/* 2. VERIFY */}
      <rect className="spec-verify" x={70} y={196} width={620} height={92} rx={8} />
      <text className="spec-st" x={380} y={220}>
        2. VERIFY
      </text>
      <text className="spec-ss" x={380} y={238}>
        target model, ONE forward pass: scores every position in parallel
      </text>
      {['fox?', 'jumps?', 'over?', 'the?'].map((t, i) => {
        const x = 150 + i * 120;
        return (
          <g key={`ver-${t}`}>
            <rect className="spec-tok" x={x} y={252} width={100} height={26} rx={5} />
            <text className="spec-tk" x={x + 50} y={269}>
              {t}
            </text>
          </g>
        );
      })}

      <line className="spec-arr" x1={380} y1={290} x2={380} y2={314} />

      {/* 3. ACCEPT / REJECT */}
      <rect className="spec-stage" x={70} y={316} width={620} height={152} rx={8} />
      <text className="spec-st" x={380} y={340}>
        3. ACCEPT / REJECT
      </text>
      <text className="spec-ss" x={380} y={358}>
        rejection sampling, walked left to right
      </text>

      {/* per-token verdicts */}
      {[
        { t: 'fox', cls: 'spec-tok-ok', vc: 'spec-v-ok', v: '✓ accept' },
        { t: 'jumps', cls: 'spec-tok-ok', vc: 'spec-v-ok', v: '✓ accept' },
        { t: 'over', cls: 'spec-tok-bad', vc: 'spec-v-bad', v: '✗ REJECT' },
        { t: 'the', cls: 'spec-tok-drop', vc: 'spec-v-drop', v: 'discarded' },
      ].map((d, i) => {
        const x = 150 + i * 120;
        return (
          <g key={`acc-${d.t}`}>
            <rect className={d.cls} x={x} y={372} width={100} height={26} rx={5} />
            <text className="spec-tk" x={x + 50} y={389}>
              {d.t}
            </text>
            <text className={d.vc} x={x + 50} y={414}>
              {d.v}
            </text>
          </g>
        );
      })}

      {/* stop-here marker under the rejected token */}
      <text className="spec-ann" x={440} y={431}>
        stop at first reject
      </text>

      <text className="spec-annb" x={380} y={456}>
        emit accepted prefix + 1 corrected token from the target
      </text>

      <line className="spec-arr" x1={380} y1={470} x2={380} y2={492} />

      {/* emit result */}
      <rect className="spec-emit" x={170} y={494} width={420} height={40} rx={8} />
      <text className="spec-st" x={380} y={519}>
        &quot;fox jumps lazy&quot;: 3 tokens from ONE target pass
      </text>

      {/* outcome annotations */}
      <text className="spec-v-ok" x={380} y={558}>
        high acceptance: many tokens per pass, large speedup
      </text>
      <text className="spec-v-bad" x={380} y={576}>
        low acceptance: about 1 token per pass plus drafting overhead, slower
      </text>
    </svg>
  );
}

type Runner = 'v2' | 'v2only' | 'v1';

const runnerBadge: Record<Runner, ReactNode> = {
  v2: <Badge color="blue">Model Runner V2</Badge>,
  v2only: <Badge color="blue">Model Runner V2 only</Badge>,
  v1: <Badge color="grey">V1 runner (deprecated)</Badge>,
};

interface MethodRow {
  method: string;
  values: string;
  drafter: string;
  runner: Runner;
  gain: string;
  notes: string;
}

const methodRows: MethodRow[] = [
  {
    method: 'EAGLE / EAGLE-3',
    values: 'eagle, eagle3',
    drafter: 'A small trained EAGLE head',
    runner: 'v2',
    gain: 'High / medium to high',
    notes: 'Strong general-purpose method. Parallel drafting (P-EAGLE) moves it to the V1 runner.',
  },
  {
    method: 'MTP',
    values: 'mtp',
    drafter: "The target model's own MTP head",
    runner: 'v2',
    gain: 'High / medium to high',
    notes: 'Best when the target ships native MTP; no separate draft model to host.',
  },
  {
    method: 'Draft model',
    values: 'draft_model',
    drafter: 'A separate, smaller language model',
    runner: 'v2',
    gain: 'High / medium',
    notes: 'The generic approach: a small compatible model drafts for a larger one.',
  },
  {
    method: 'PARD',
    values: 'draft_model + parallel_drafting',
    drafter: 'A parallel draft model',
    runner: 'v1',
    gain: 'High / medium to high',
    notes: 'Low draft-model latency. Parallel drafting outside DFlash and DSpark selects the V1 runner.',
  },
  {
    method: 'DFlash, DFlash2, LiLiCorr',
    values: 'dflash',
    drafter: 'A trained DFlash-family checkpoint',
    runner: 'v2',
    gain: 'Not rated in the docs table',
    notes:
      "Drafts the whole block in one pass from the target's hidden states. The checkpoint's architecture picks plain DFlash, DFlash2 (candidate head) or LiLiCorr (DFlash backbone plus a learned correlator); the last two need Model Runner V2.",
  },
  {
    method: 'DSpark',
    values: 'dspark',
    drafter: 'A DSpark checkpoint',
    runner: 'v2only',
    gain: 'Not rated in the docs table',
    notes: 'DFlash-derived; the one method the docs support for adaptive verification.',
  },
  {
    method: 'MLP speculator',
    values: 'mlp_speculator',
    drafter: 'A compatible MLP speculator',
    runner: 'v1',
    gain: 'Medium to high / medium',
    notes:
      'Expect startup to fail at v0.31.0: the model registry entry is commented out as temporarily disabled, and the V1 runner dispatch it lands on raises "Unknown speculative decoding method" (Codebase tab), although the docs page still shows a configuration example. Not run during this research.',
  },
  {
    method: 'N-gram (prompt lookup)',
    values: 'ngram, ngram_gpu',
    drafter: 'None',
    runner: 'v1',
    gain: 'Low to medium / medium',
    notes:
      'Lightweight: proposes the tokens that followed a matching n-gram in the prompt. ngram_gpu runs the lookup on the GPU.',
  },
  {
    method: 'Suffix decoding',
    values: 'suffix',
    drafter: 'None (needs the Arctic Inference package)',
    runner: 'v1',
    gain: 'Low to medium / medium',
    notes:
      'Suffix trees over the prompt and past responses, with per-request adaptive depth. The docs name code editing, agentic loops and RL (reinforcement learning) rollouts as its best case.',
  },
  {
    method: 'Custom proposer (experimental)',
    values: 'custom_class',
    drafter: 'Your class',
    runner: 'v1',
    gain: 'Varies',
    notes: 'model names a class that takes a VllmConfig and implements propose.',
  },
];

export function SpeculativeDecoding() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A cheap drafter guesses ahead and the target model checks the whole guess in one pass: which method to pick, which runner it lands on, and how to tell whether it pays at your concurrency (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            11. Speculative Decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The challenge:</strong> autoregressive decoding is serial. To produce token{' '}
            <em>N</em> the model must already have produced token <em>N&minus;1</em>, so it runs one
            full forward pass per output token. At low batch sizes that pass is{' '}
            <strong>memory-bandwidth bound</strong>: the GPU spends most of its time streaming the
            model weights and the KV (key/value) cache through memory, and the arithmetic units sit
            largely idle. Each forward pass yields a single token.
          </Box>
          <Box variant="p">
            <strong>The core idea:</strong> a small, cheap <em>drafter</em> proposes the next{' '}
            <em>K</em> tokens. The large <em>target</em> model then verifies all <em>K</em> proposed
            tokens <strong>in a single forward pass</strong>. The pass it would have spent on one
            token now scores a whole candidate sequence, because checking K tokens is mostly extra
            arithmetic against weights and KV that were going to be read anyway. Tokens the target
            accepts are kept; the first rejected token is replaced and the rest discarded. When
            acceptance is high you emit several tokens per target step instead of one.
          </Box>
          <Box variant="p">
            <strong>It is lossless.</strong> The default verification uses rejection sampling, so
            the accepted output follows the distribution the target model would have produced on
            its own. Speculative decoding{' '}
            <em>&quot;aims to enhance inference efficiency while maintaining accuracy&quot;</em> and
            is{' '}
            <em>&quot;theoretically lossless up to the precision limits of hardware numerics&quot;</em>
            , and vLLM&apos;s implementation is{' '}
            <em>&quot;algorithmically validated to be lossless&quot;</em> through rejection-sampler
            convergence and greedy-equality tests{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: Speculative Decoding
            </Cite>
            . Residual differences come from floating-point precision and batch-size numerics, the
            same caveats that apply to any two runs of the same model.
          </Box>
          <Alert type="info">
            This is the practitioner&apos;s view. The speculator classes, both runners&apos; dispatch
            and the rejection samplers are walked against the source in the{' '}
            <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong> tab.
            Why one pass can verify K tokens almost for free (arithmetic intensity, the roofline)
            is in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            sibling deep dive.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each step emits 1 + the number of accepted drafts, which makes acceptance rate the number that decides the speedup"
          >
            The propose, verify, accept loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One target step does three things: the drafter proposes K candidate tokens, the target
            scores all of them in one pass, and a rejection-sampling check walks the candidates left
            to right, keeping the longest accepted prefix and replacing the first mismatch with a
            token from the target. The step emits <em>1 + (number accepted)</em> tokens, so a high
            acceptance rate is the entire game.
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <ProposeVerifyAcceptDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Shows the default <code>standard</code> verification. With
            adaptive verification on, K is a ceiling: each step verifies only the
            draft positions its budget admits, so a request can have fewer than K checked.
          </Box>

          <Alert type="info" header="Why the rejection step keeps it lossless">
            Each candidate is accepted with a probability derived from the target and draft
            distributions. At the first rejection the position is resampled from an adjusted
            distribution and the remaining candidates are dropped, so the emitted tokens are
            distributed as if the target had sampled them directly. This is the algorithm of
            Leviathan et al. 2022{' '}
            <Cite tier={3} href="https://arxiv.org/abs/2211.17192">
              arXiv:2211.17192
            </Cite>
            , which the V1 runner&apos;s sampler docstring says it &quot;strictly follows&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/rejection_sampler.py', 'L45-L64')}>
              rejection_sampler.py L45-L64
            </Cite>
            . Under standard verification, speculation changes how fast tokens arrive and leaves
            their distribution unchanged.
          </Alert>

          <Box variant="p">
            <strong>Three verification policies.</strong> <code>rejection_sample_method</code>{' '}
            takes <code>standard</code> (the default), <code>block</code> or{' '}
            <code>synthetic</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L530-L536')}>
              speculative.py L530-L536
            </Cite>
            . <code>standard</code> is the rejection sampling above. <code>block</code> verifies the
            drafts jointly as a block (Sun et al. 2024){' '}
            <Cite tier={3} href="https://arxiv.org/abs/2403.10444">
              arXiv:2403.10444
            </Cite>
            ; the V1 runner&apos;s sampler has no <code>block</code> branch{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/sample/rejection_sampler.py', 'L83-L96')}>
              rejection_sampler.py L83-L96
            </Cite>
            , so pair it with a Model Runner V2 method. <code>synthetic</code> accepts each draft with
            a configured probability whatever the target computes{' '}
            <Cite
              tier={1}
              kind="code"
              href={vllmUrl('vllm/v1/worker/gpu/spec_decode/rejection_sampler_utils.py', 'L584-L588')}
            >
              rejection_sampler_utils.py L584-L588
            </Cite>
            , so it gives up the lossless guarantee in exchange for a chosen acceptance rate.
          </Box>
          <Box variant="p">
            <strong>Check configs copied from older docs.</strong> Docs for v0.22.1 through v0.27.0
            list <code>strict</code>, <code>probabilistic</code> and{' '}
            <code>synthetic</code>, with <code>strict</code> as the default{' '}
            <Cite
              tier={1}
              kind="doc-code-conflict"
              href="https://docs.vllm.ai/en/v0.27.0/features/speculative_decoding/"
            >
              vLLM v0.27.0 docs: Speculative Decoding
            </Cite>
            , while the v0.27.0 code accepts <code>standard</code>, <code>synthetic</code> and{' '}
            <code>block</code>{' '}
            <Cite
              tier={1}
              kind="code"
              href="https://github.com/vllm-project/vllm/blob/v0.27.0/vllm/config/speculative.py#L78"
            >
              v0.27.0 speculative.py L78
            </Cite>
            , the same three the v0.31.0 code accepts{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L85-L86')}>
              speculative.py L85-L86
            </Cite>
            . Drop <code>strict</code> to get the default, <code>standard</code>;{' '}
            <code>probabilistic</code> belongs to a different key,{' '}
            <code>draft_sample_method</code> (<code>greedy</code> by default){' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L601-L607')}>
              speculative.py L601-L607
            </Cite>
            .
          </Box>

          <ExpandableSection headerText="Lossless, restated for the skeptic">
            <Box variant="p">
              The vLLM docs split the guarantee into three parts:{' '}
              <strong>theoretical losslessness</strong> (the rejection-sampling math is lossless up
              to hardware numerics), <strong>algorithmic losslessness</strong> (rejection-sampler
              convergence tests, and greedy sampling with speculation matching greedy sampling
              without it), and a <strong>logprob-stability</strong> caveat (token logprobs are not
              currently guaranteed stable across runs). Floating-point precision and batch-size
              numerics account for any residual difference between a speculative and a
              non-speculative run{' '}
              <Cite tier={1} href={SPEC_DOCS}>
                vLLM docs: Lossless guarantees of Speculative Decoding
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick a drafter by what you can host, then check whether it keeps you on Model Runner V2 or puts you on the runner whose removal is targeted for v0.32"
          >
            The methods vLLM supports, and the runner each lands on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The docs rate model-based methods, EAGLE (Extrapolation Algorithm for Greater
            Language-model Efficiency), MTP (Multi-Token Prediction), draft models, PARD (Parallel
            Draft Model) and MLP (Multi-Layer Perceptron) speculators, as giving the best latency
            reduction, and n-gram and suffix decoding, which need no extra model, as giving modest
            speedups <em>&quot;without increasing workload during peak traffic&quot;</em>{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: Speculation Methods
            </Cite>
            . The gain column is the docs&apos; qualitative rating at low / high QPS (queries per
            second); real gains depend on model family, traffic pattern, hardware and sampling
            settings.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Speculation methods at v0.31.0</Header>}
            items={methodRows}
            columnDefinitions={[
              { id: 'method', header: 'Method', cell: (r) => r.method, minWidth: 130 },
              { id: 'values', header: 'method value', cell: (r) => <code>{r.values}</code>, minWidth: 130 },
              { id: 'drafter', header: 'Drafter to host', cell: (r) => r.drafter, minWidth: 140 },
              { id: 'runner', header: 'Runs on', cell: (r) => runnerBadge[r.runner], minWidth: 150 },
              { id: 'gain', header: 'Docs gain (low / high QPS)', cell: (r) => r.gain, minWidth: 130 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 240 },
            ]}
          />
          <Box variant="small">
            Gain ratings and method notes:{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: Method Selection at a Glance
            </Cite>
            . Method values:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L39-L84')}>
              speculative.py L39-L84
            </Cite>
            . DFlash one-pass drafting from target hidden states:{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1462-L1463')}>
              speculative.py L1462-L1463
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L276-L283')}>
              gpu/model_runner.py L276-L283
            </Cite>
            . DFlash drafter choice:{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/spec_decode/__init__.py', 'L17-L40')}>
              spec_decode/__init__.py L17-L40
            </Cite>{' '}
            <Cite tier={1} href={LILICORR_DOCS}>
              vLLM docs: LiLiCorr
            </Cite>
            . Suffix decoding:{' '}
            <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/suffix/')}>
              vLLM docs: Suffix Decoding
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>The method picks the runner.</strong> Model Runner V2 (MRv2), the GPU execution
            layer inside each worker, is the default for every model; the V1 model runner is
            deprecated, with removal targeted for v0.32{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            . Six methods have no MRv2 speculator and move the whole engine onto the V1 runner:{' '}
            <code>ngram</code>, <code>ngram_gpu</code>, <code>suffix</code>, <code>medusa</code>,{' '}
            <code>mlp_speculator</code> and <code>custom_class</code>. Parallel drafting with EAGLE
            or a draft model (P-EAGLE, PARD) does the same{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3073-L3092')}>
              vllm.py L3073-L3092
            </Cite>
            . In the other direction, <code>dspark</code>, adaptive verification, DFlash
            candidate-head drafts and mixed sliding/full DFlash drafts run only on MRv2{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3105-L3141')}>
              vllm.py L3105-L3141
            </Cite>
            . Two accepted method values sit outside the table: <code>medusa</code> (V1 runner) and{' '}
            <code>extract_hidden_states</code> (MRv2), which saves target-layer activations for
            training EAGLE-style drafters or offline analysis rather than speeding up decode{' '}
            <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/extract_hidden_states/')}>
              vLLM docs: Hidden State Extraction
            </Cite>
            .
          </Box>
          <Box variant="p">
            A fallback shows in the startup log as{' '}
            <code>
              Model Runner V2 does not yet support speculative method &apos;ngram&apos;; using the
              V1 model runner instead.
            </code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L752-L759')}>
              vllm.py L752-L759
            </Cite>
            . If production depends on a V1-runner method, read the v0.32 release notes before
            upgrading.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Speculation pays while decode is memory-bound and costs throughput as the batch grows; two controls shrink it as load rises"
          >
            When it helps, and when it hurts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Speculative decoding is a <strong>latency tool for memory-bound regimes</strong>, for
            reducing{' '}
            <em>
              &quot;inter-token latency under medium-to-low QPS (queries per second), memory-bound
              workloads&quot;
            </em>{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: Speculative Decoding
            </Cite>
            . The economics are asymmetric. At low batch, verifying K extra tokens uses arithmetic
            that was idle. As the batch grows the target verifies batch size times K tokens per
            step, and past a critical batch size speculation raises TPOT (time per output token){' '}
            <Cite tier={1} href={DSD_DOCS}>
              vLLM docs: Dynamic Speculative Decoding
            </Cite>
            . Every rejected draft is then compute taken from real tokens, and{' '}
            <em>&quot;with enough of them, throughput drops&quot;</em>{' '}
            <Cite tier={1} href={AV_DOCS}>
              vLLM docs: Adaptive Verification
            </Cite>
            .
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">It helps when</Box>
              <ul>
                <li>
                  <strong>You are latency-bound:</strong> interactive chat, copilots, low
                  concurrency. The GPU has idle arithmetic to fill.
                </li>
                <li>
                  <strong>Acceptance is high.</strong> Repetitive output is predictable, so the
                  drafter is right often and each pass yields several tokens. The docs name code
                  editing, agentic loops and RL rollouts as high-repetition work{' '}
                  <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/suffix/')}>
                    vLLM docs: Suffix Decoding
                  </Cite>
                  .
                </li>
                <li>
                  <strong>The drafter is well matched</strong> to the target: a same-family small
                  model, an EAGLE head trained on the target, or native MTP.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">It hurts when</Box>
              <ul>
                <li>
                  <strong>The batch is large.</strong> Verification competes for arithmetic the
                  batch already needs, and throughput falls.
                </li>
                <li>
                  <strong>Acceptance is low.</strong> Open-ended, high-entropy generation rejects
                  most drafts: you pay to draft and verify and still emit about one token per pass.
                </li>
                <li>
                  <strong>The drafter is slow or diverges</strong> from the target, or a hosted
                  draft model takes GPU memory that the speedup has to pay back.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Box variant="p">
            The docs&apos; method table still rates no method&apos;s high-QPS gain below medium{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: Method Selection at a Glance
            </Cite>
            , so treat the crossover as something to measure. Two controls act on it.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Dynamic speculative decoding</Box>
              <Box variant="p">
                <code>num_speculative_tokens_per_batch_size</code> maps inclusive batch-size ranges
                to a K, and the scheduler applies the matching K each step; K = 0 turns drafting off{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L491-L497')}>
                  speculative.py L491-L497
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L292-L299')}>
                  scheduler.py L292-L299
                </Cite>
                . The docs&apos; example,{' '}
                <code>[[1, 64, 3], [65, 128, 1], [129, 512, 0]]</code>, drafts 3 tokens up to 64
                concurrent requests, 1 token from 65 to 128 and none from 129 to 512; it is tested with EAGLE,
                EAGLE-3 and DFlash{' '}
                <Cite tier={1} href={DSD_DOCS}>
                  vLLM docs: Dynamic Speculative Decoding
                </Cite>
                . With DP (data parallelism) above 1, vLLM disables the schedule and falls back to
                the static K with a warning{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1083-L1100')}>
                  vllm.py L1083-L1100
                </Cite>
                . On the V1 runner it also forces piecewise CUDA graphs{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1064-L1081')}>
                  vllm.py L1064-L1081
                </Cite>
                , so leave off the <code>VLLM_USE_V2_MODEL_RUNNER=0</code> prefix that the
                docs&apos; online examples carry.
              </Box>
            </div>
            <div>
              <Box variant="h3">Adaptive verification</Box>
              <Box variant="p">
                <code>enable_adaptive_verification</code> (off by default) scores every (request,
                position) draft slot by its survival probability and admits the best slots until a
                per-step budget, profiled at startup, is spent. A confident request keeps its whole
                draft while a doubtful one is trimmed after a token or two{' '}
                <Cite tier={1} href={AV_DOCS}>
                  vLLM docs: Adaptive Verification
                </Cite>
                . It needs MRv2, full CUDA graphs, no LoRA (low-rank adaptation) and a PP (pipeline
                parallelism) size of 1{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3127-L3178')}>
                  vllm.py L3127-L3178
                </Cite>
                . The field docstring supports it only for <code>dspark</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L552-L554')}>
                  speculative.py L552-L554
                </Cite>{' '}
                and the docs only for DSpark with a confidence head, while the MRv2 code builds an acceptance estimator into the shared draft-model
                speculator base{' '}
                <Cite
                  tier={1}
                  kind="doc-code-conflict"
                  href={vllmUrl('vllm/v1/worker/gpu/spec_decode/speculator.py', 'L171-L255')}
                >
                  speculator.py L171-L255
                </Cite>{' '}
                and the v0.30.0 notes describe it for every draft-model speculator{' '}
                <Cite tier={1} href={`${RELEASE_NOTES}v0.30.0`}>
                  vLLM v0.30.0 release notes
                </Cite>
                . Outside DSpark, treat it as untested.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One JSON object selects the method, the drafter and K; these are the keys that change behaviour"
          >
            How to enable it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One config object drives everything: <code>--speculative-config</code> on the CLI or{' '}
            <code>speculative_config</code> in <code>LLM(...)</code>. Pick a <code>method</code>,
            point it at a drafter where the method needs one, and set{' '}
            <code>num_speculative_tokens</code> (the K above) for methods that do not infer it from
            model metadata.
          </Box>

          <Box variant="code">
            <Box variant="small" color="text-status-info">
              Generic draft model, verbatim from the v0.31.0 docs
            </Box>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve <target-model> \
  --speculative-config '{
    "method": "draft_model",
    "model": "<draft-model>",
    "num_speculative_tokens": 5
  }'`}</pre>
          </Box>

          <Box variant="code">
            <Box variant="small" color="text-status-info">
              N-gram / prompt lookup (no extra model), verbatim from the v0.31.0 docs
            </Box>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve <target-model> \
  --speculative-config '{
    "method": "ngram",
    "num_speculative_tokens": 4,
    "prompt_lookup_min": 2,
    "prompt_lookup_max": 5
  }'`}</pre>
          </Box>
          <Box variant="small">
            Both examples and the key list below:{' '}
            <Cite tier={1} href={SPEC_DOCS}>
              vLLM docs: --speculative-config schema
            </Cite>
            .
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Common keys</Box>
              <ul>
                <li>
                  <code>method</code>: a value from the methods table. If omitted, vLLM infers it
                  from the rest of the config when possible.
                </li>
                <li>
                  <code>model</code>: draft model, EAGLE head or auxiliary model. Often omitted for{' '}
                  <code>ngram</code>, <code>ngram_gpu</code>, <code>suffix</code> and{' '}
                  <code>mtp</code>.
                </li>
                <li>
                  <code>num_speculative_tokens</code>: K, the tokens proposed per step. For LiLiCorr
                  the docs strongly recommend the checkpoint&apos;s trained block size minus 1 (15
                  for a block size of 16){' '}
                  <Cite tier={1} href={LILICORR_DOCS}>
                    vLLM docs: LiLiCorr
                  </Cite>
                  .
                </li>
                <li>
                  <code>draft_tensor_parallel_size</code>: TP (tensor parallel) size for the draft
                  model. <code>tensor_parallel_size</code> is not a valid key inside{' '}
                  <code>speculative_config</code>.
                </li>
                <li>
                  <code>rejection_sample_method</code>: <code>standard</code> (default),{' '}
                  <code>block</code> or <code>synthetic</code>. <code>draft_sample_method</code>:{' '}
                  <code>greedy</code> (default) or <code>probabilistic</code>.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">N-gram and suffix knobs</Box>
              <ul>
                <li>
                  <code>prompt_lookup_min</code> / <code>prompt_lookup_max</code>: the n-gram window
                  bounds. Each defaults to 5 when both are omitted; set one and the other mirrors it{' '}
                  <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1189-L1208')}>
                    speculative.py L1189-L1208
                  </Cite>
                  .
                </li>
                <li>
                  <code>suffix_decoding_max_tree_depth</code> (default 24): maximum combined
                  prefix-match and speculation depth.
                </li>
                <li>
                  <code>suffix_decoding_max_cached_requests</code> (default 10000): size of the
                  global suffix tree; 0 disables the global cache.
                </li>
                <li>
                  <code>suffix_decoding_max_spec_factor</code> (default 1.0) caps speculation length
                  as a multiple of the prefix-match length; <code>suffix_decoding_min_token_prob</code>{' '}
                  (default 0.1) is the minimum estimated probability to speculate a token{' '}
                  <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L506-L524')}>
                    speculative.py L506-L524
                  </Cite>
                  .
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="info">
            <code>--speculative-config</code> expects a JSON object on the CLI; in YAML config files
            it is a nested mapping.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The parallelism, vocabulary and checkpoint rules that decide whether a speculative configuration starts, and what it does once running"
          >
            What composes with speculation
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Parallelism</Box>
            <ul>
              <li>
                <strong>Pipeline parallelism composes.</strong> The drafter runs on the last
                pipeline-parallel rank on both runners{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L272-L274')}>
                  gpu/model_runner.py L272-L274
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_model_runner.py', 'L601-L604')}>
                  gpu_model_runner.py L601-L604
                </Cite>
                , and the v0.30.0 notes list MTP, EAGLE-3, DFlash and DSpark under pipeline
                parallelism on MRv2{' '}
                <Cite tier={1} href={`${RELEASE_NOTES}v0.30.0`}>
                  vLLM v0.30.0 release notes
                </Cite>
                . The docs&apos; incompatibility note covers <code>vllm&lt;=0.15.0</code> only{' '}
                <Cite tier={1} href={SPEC_DOCS}>
                  vLLM docs: Known Feature Incompatibility
                </Cite>
                . Adaptive verification is the exception: it rejects a PP size above 1.
              </li>
              <li>
                <strong>A draft&apos;s TP size is 1 or the target&apos;s.</strong> Anything else
                raises a <code>ValueError</code>; unset means the target&apos;s TP (1 for{' '}
                <code>mlp_speculator</code>){' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1706-L1737')}>
                  speculative.py L1706-L1737
                </Cite>
                . The V1 runner&apos;s draft-model proposer further requires the two to match, as the
                Codebase tab shows.
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Drafters and outputs</Box>
            <ul>
              <li>
                <strong>A draft model&apos;s vocabulary must match the target&apos;s</strong> unless{' '}
                <code>use_heterogeneous_vocab: true</code> turns on TLI (Token-Level Intersection),
                which constrains draft logits to the tokens both vocabularies share. TLI requires{' '}
                <code>method=&quot;draft_model&quot;</code> and greedy draft sampling{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L1848-L1862')}>
                  speculative.py L1848-L1862
                </Cite>
                . Its token mapping is wired into the V1 runner&apos;s proposer{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/draft_model.py', 'L37-L58')}>
                  draft_model.py L37-L58
                </Cite>
                ; a search of <code>vllm/v1/worker</code>, which holds the MRv2 code, found no
                reference to it during this research, and it was not run, so test cross-vocabulary
                drafts on MRv2 before relying on them.
              </li>
              <li>
                <strong>Gemma 4 assistant checkpoints run as MTP speculators:</strong> use{' '}
                <code>&quot;method&quot;: &quot;mtp&quot;</code> with the assistant checkpoint in{' '}
                <code>model</code>{' '}
                <Cite tier={1} href={vllmDocsUrl('features/speculative_decoding/mtp/')}>
                  vLLM docs: MTP
                </Cite>
                .
              </li>
              <li>
                <strong>Logprobs are not guaranteed stable.</strong> The same request can yield
                different outputs across runs, independent of speculation; keep it in mind when
                comparing a speculative run with a plain one{' '}
                <Cite tier={1} href={SPEC_DOCS}>
                  vLLM docs: Lossless guarantees
                </Cite>
                .
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read acceptance per request and across the server, then set K for the concurrency you actually run"
          >
            Measure whether it pays
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The number to watch is <strong>mean acceptance length</strong>: tokens emitted per
            verification step, the same <em>1 + (number accepted)</em> as the loop above. It runs
            from 1.0, nothing accepted, to K + 1{' '}
            <Cite tier={1} href={METRICS_DOCS}>
              vLLM docs: Per-Request Acceptance Metrics
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Per request</Box>
              <Box variant="p">
                <code>--per-request-spec-decode-metrics summary</code> adds{' '}
                <code>metrics.speculative_decoding</code> to each response: mean acceptance length,
                draft acceptance rate and a histogram of accepted draft lengths.{' '}
                <code>detailed</code> adds per-step arrays; the default, <code>none</code>, collects
                nothing{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/observability.py', 'L47-L58')}>
                  observability.py L47-L58
                </Cite>
                . The field is experimental, is <code>null</code> for <code>n &gt; 1</code>, and
                in streaming rides the final usage chunk, so set{' '}
                <code>stream_options.include_usage</code>{' '}
                <Cite tier={1} href={METRICS_DOCS}>
                  vLLM docs: Per-Request Acceptance Metrics
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Across the server</Box>
              <Box variant="p">
                The Prometheus counters give the same figure:{' '}
                <code>
                  1 + rate(vllm:spec_decode_num_accepted_tokens_total[$interval]) /
                  rate(vllm:spec_decode_num_drafts_total[$interval])
                </code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/metrics.py', 'L176-L195')}>
                  spec_decode/metrics.py L176-L195
                </Cite>
                . For a reproducible offline comparison, the docs point to{' '}
                <code>examples/features/speculative_decoding/spec_decode_offline.py</code> and the
                benchmark CLI{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('examples/features/speculative_decoding/spec_decode_offline.py')}
                >
                  spec_decode_offline.py
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>What to do next.</strong> Pick a method from the Model Runner V2 rows, confirm
            the startup log carries no V1 fallback warning, and run representative traffic with{' '}
            <code>summary</code> metrics on. Compare mean acceptance length and tokens per second at
            your real concurrency, with and without speculation. Where the gain fades as concurrency
            rises, write that crossover into a <code>num_speculative_tokens_per_batch_size</code>{' '}
            schedule so K drops before speculation starts costing throughput.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
