import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

export function SpeculativeDecoding() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A cheap drafter guesses ahead; the expensive model checks the whole guess in one pass. When the guesses are good, you emit several tokens per target step — and the output distribution is provably preserved."
          >
            11. Speculative Decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem it attacks:</strong> autoregressive decoding is serial. To produce
            token <em>N</em> you must have produced token <em>N&minus;1</em>, so the model runs one
            full forward pass per output token. At low batch sizes that pass is{' '}
            <strong>memory-bandwidth bound</strong> &mdash; the GPU spends most of its time streaming
            the model weights and the KV (key/value) cache through memory, not doing math. The
            arithmetic units sit largely idle. You are paying for a forward pass and getting a single
            token out of it.
          </Box>
          <Box variant="p">
            <strong>The core idea:</strong> a small, cheap <em>drafter</em> proposes the next{' '}
            <em>K</em> tokens. The large <em>target</em> model then verifies all <em>K</em> proposed
            tokens <strong>in a single forward pass</strong> &mdash; the same pass it would have spent
            on one token now scores a whole candidate sequence, because checking K tokens is mostly
            extra arithmetic against weights and KV that were going to be read anyway. Tokens the
            target accepts are kept; the first rejected token is corrected and the rest discarded. When
            acceptance is high you emit several tokens per target step instead of one, turning idle
            arithmetic into throughput without buying a bigger model.
          </Box>
          <Box variant="p">
            <strong>It is lossless &mdash; not approximate.</strong> Verification uses{' '}
            rejection sampling so the accepted output matches the distribution the target model would
            have produced on its own. The vLLM docs state speculative decoding{' '}
            <em>&quot;aims to enhance inference efficiency while maintaining accuracy&quot;</em> and is{' '}
            <em>&quot;theoretically lossless up to the precision limits of hardware numerics&quot;</em>{' '}
            &mdash; with vLLM&apos;s implementation <em>&quot;algorithmically validated to be
            lossless&quot;</em> via rejection-sampler convergence and greedy-equality tests. The only
            deviations come from floating-point error, the same numerics caveat that applies to any
            two runs of the same model (
            <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
              vLLM Docs: Speculative Decoding, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Alert type="info">
            This section is the practitioner&apos;s view: the methods, when it pays off, how to turn it
            on, and the catches. The proposer classes and the verify/rejection-sample call path are
            walked against the real source in the{' '}
            <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong> tab.
            The hardware &quot;why&quot; &mdash; arithmetic intensity, the roofline, why a single pass
            can verify K tokens almost for free &mdash; is the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            sibling deep dive.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The propose &rarr; verify &rarr; accept/reject loop</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            One target step now does three things: the drafter proposes K candidate tokens, the target
            scores all of them in one pass, and a rejection-sampling check walks the candidates
            left-to-right &mdash; keeping the longest accepted prefix and correcting the first
            mismatch. The number of tokens you actually emit per step is{' '}
            <em>1 + (number accepted)</em>, so a high acceptance rate is the entire game.
          </Box>

          <Box variant="code">
            <Box variant="small" color="text-status-info">
              One target step with K = 4 proposed tokens
            </Box>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`
 step start: context = "...the quick brown"

 ┌─ 1. PROPOSE (cheap drafter, K=4) ───────────────────────────┐
 │   draft → [ fox  jumps  over  the ]                          │
 └─────────────────────────────────────────────────────────────┘
                    │  send all K candidates at once
                    ▼
 ┌─ 2. VERIFY (target model, ONE forward pass) ────────────────┐
 │   scores every candidate position in parallel:              │
 │     fox?   jumps?   over?   the?                             │
 │   one pass over weights + KV → distributions for all K      │
 └─────────────────────────────────────────────────────────────┘
                    │
                    ▼
 ┌─ 3. ACCEPT / REJECT (rejection sampling, left → right) ─────┐
 │     fox   ✓ accept                                          │
 │     jumps ✓ accept                                          │
 │     over  ✗ REJECT  ── stop here ──┐                        │
 │     the     (discarded)            │                        │
 │                                    ▼                         │
 │   emit accepted prefix + 1 corrected token from target:     │
 │     → "fox jumps lazy"   (3 tokens from ONE target pass)    │
 └─────────────────────────────────────────────────────────────┘

   high acceptance → many tokens per pass → big speedup
   low acceptance  → ~1 token per pass + drafting overhead → slower
`}</pre>
          </Box>

          <Alert type="info">
            <strong>Why the rejection step keeps it lossless:</strong> each candidate is accepted with
            a probability derived from the target and draft distributions; on the first rejection the
            position is re-sampled from a corrected distribution and the remaining candidates are
            thrown away. The math guarantees the emitted tokens are distributed exactly as if the
            target had sampled them directly &mdash; speculation changes the <em>speed</em>, not the{' '}
            <em>answer</em>. vLLM exposes the verification policy via{' '}
            <code>rejection_sample_method</code> (<code>strict</code>, <code>probabilistic</code>, or{' '}
            <code>synthetic</code>); <code>strict</code> is the default (
            <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
              vLLM Docs: Speculative Decoding, accessed 2026-06-07
            </Link>
            ).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The methods vLLM supports</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM ships several drafters that trade off setup cost against acceptance quality.{' '}
            Model-based proposers (EAGLE, MTP, draft models, PARD, MLP) give the strongest latency
            reduction; the lightweight string-matching methods (n-gram, suffix) need no extra model
            and give modest, safe speedups. The list below is pinned to the docs as accessed &mdash;{' '}
            vLLM moves quickly and the set changes; verify against the page before relying on it.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Speculation methods (as documented, accessed 2026-06-07)</Header>}
            columnDefinitions={[
              { id: 'method', header: 'Method', cell: (i) => i.method },
              { id: 'extra', header: 'Needs an extra model?', cell: (i) => i.extra },
              { id: 'best', header: 'Best for', cell: (i) => i.best },
            ]}
            items={[
              {
                method: 'EAGLE / EAGLE-3',
                extra: 'Yes — a small trained EAGLE head',
                best: 'Strong general-purpose model-based method. Listed as high gain at low QPS, medium-to-high at high QPS.',
              },
              {
                method: 'Multi-Token Prediction (MTP)',
                extra: 'Uses the target model’s native MTP head',
                best: 'Best when the target model has native MTP support — no separate draft model to host. High gain at low QPS.',
              },
              {
                method: 'Draft model',
                extra: 'Yes — a separate, smaller LLM',
                best: 'The generic approach: any small compatible model drafts for a larger one. High gain at low QPS, medium at high QPS.',
              },
              {
                method: 'Parallel Draft Model (PARD)',
                extra: 'Yes — a parallel draft model',
                best: 'Low draft-model latency; high gain at low QPS, medium-to-high at high QPS.',
              },
              {
                method: 'MLP speculator',
                extra: 'Yes — a compatible MLP speculator',
                best: 'Good when compatible MLP speculators are available. Medium-to-high gain at low QPS.',
              },
              {
                method: 'N-gram (prompt-lookup)',
                extra: 'No',
                best: 'Lightweight and easy to enable — drafts by matching recent context against the prompt. Strong for repetitive / quote-heavy output.',
              },
              {
                method: 'Suffix decoding',
                extra: 'No',
                best: 'No extra draft model; dynamic speculation depth via a suffix tree over past requests. Adapts depth to how predictable the continuation is.',
              },
              {
                method: 'Custom Proposer (experimental)',
                extra: 'Your call',
                best: 'Bring your own proposer class — set method to custom_class and point model at your module path. Gains vary.',
              },
            ]}
          />

          <Alert type="info">
            The docs also list <strong>Hidden State Extraction</strong> and a{' '}
            <strong>Multi-Layer Perceptron</strong> entry under &quot;vLLM Speculation Methods.&quot;
            The verified, dated authority for the exact supported set is the docs page itself &mdash;{' '}
            the method set is the part that drifts most between releases, so treat the table above as a
            snapshot, not a contract (
            <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
              vLLM Docs: Speculative Decoding &rarr; &quot;vLLM Speculation Methods&quot;, accessed 2026-06-07
            </Link>
            ).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">When it helps &mdash; and when it hurts</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Speculative decoding is a <strong>latency tool for memory-bound regimes</strong>. The vLLM
            docs frame it precisely: it is for reducing <em>&quot;inter-token latency under
            medium-to-low QPS (query per second), memory-bound workloads.&quot;</em> The economics are
            asymmetric &mdash; when the GPU is idle on arithmetic (low batch), verifying K tokens is
            nearly free and high acceptance is pure win; when the GPU is already saturated (high
            batch), there is no idle arithmetic to reclaim and the drafting + verification overhead is
            not amortized (
            <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
              vLLM Docs: Speculative Decoding, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">It helps when…</Box>
              <ul>
                <li>
                  <strong>You are latency-bound, not throughput-bound</strong> — interactive chat,
                  copilots, low concurrency. The GPU has idle arithmetic to fill.
                </li>
                <li>
                  <strong>Batch size is small.</strong> Few concurrent requests = memory-bound decode
                  = the regime speculation was built for.
                </li>
                <li>
                  <strong>Acceptance is high.</strong> Code, structured / JSON output, and repetitive
                  or templated text are highly predictable, so the drafter is right often and you cash
                  in multiple tokens per pass.
                </li>
                <li>
                  <strong>The drafter is well matched</strong> to the target — a same-family small
                  model, an EAGLE head trained on the target, or native MTP.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">It hurts when…</Box>
              <ul>
                <li>
                  <strong>Batch is large / throughput-saturated.</strong> The GPU is already
                  compute-bound; verifying K tokens competes for the arithmetic you needed anyway, so
                  the overhead is not amortized and throughput can <em>drop</em>.
                </li>
                <li>
                  <strong>Acceptance is low.</strong> Open-ended, high-entropy generation means most
                  drafts are rejected — you pay to draft and verify but emit ~1 token per pass, net
                  slower.
                </li>
                <li>
                  <strong>The drafter is mismatched or too expensive.</strong> A drafter that is
                  slow, or whose distribution diverges from the target, loses on both axes.
                </li>
                <li>
                  <strong>You hosted an extra model for nothing.</strong> Model-based methods consume
                  GPU memory and a serving slot that the win has to pay back.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>Speculation and high-throughput batching pull in opposite directions.</strong>{' '}
            Continuous batching wins by packing many requests into a compute-bound regime; speculation
            wins by exploiting the idle-arithmetic of a memory-bound one. On a busy multi-tenant
            endpoint, measure before assuming it helps &mdash; the right answer is workload-specific,
            and the docs point you at <code>spec_decode_offline.py</code> / the benchmark CLI for
            reproducible measurement in your environment.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How to enable it</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Everything is driven by one config object: <code>--speculative-config</code> on the CLI
            (a JSON object) or <code>speculative_config</code> when constructing{' '}
            <code>LLM(...)</code> in Python. You pick a <code>method</code>, point it at a drafter
            where the method needs one, and set <code>num_speculative_tokens</code> (the K above) for
            methods that do not infer it from model metadata.
          </Box>

          <Box variant="code">
            <Box variant="small" color="text-status-info">
              Generic draft model — verbatim from the docs (accessed 2026-06-07)
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
              N-gram / prompt-lookup (no extra model) — verbatim from the docs (accessed 2026-06-07)
            </Box>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve <target-model> \
  --speculative-config '{
    "method": "ngram",
    "num_speculative_tokens": 4,
    "prompt_lookup_min": 2,
    "prompt_lookup_max": 5
  }'`}</pre>
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Common keys</Box>
              <ul>
                <li>
                  <code>method</code> — the proposer. Documented values include{' '}
                  <code>draft_model</code>, <code>ngram</code>, <code>suffix</code>,{' '}
                  <code>mtp</code>, <code>eagle3</code>, and <code>dflash</code>; omitting it lets
                  vLLM infer the method from the rest of the config when possible.
                </li>
                <li>
                  <code>model</code> — draft model, EAGLE head, or auxiliary identifier. Often
                  omitted for <code>ngram</code>, <code>suffix</code>, and <code>mtp</code>.
                </li>
                <li>
                  <code>num_speculative_tokens</code> — K, the tokens proposed per step. Required for
                  methods that can&apos;t infer it.
                </li>
                <li>
                  <code>draft_tensor_parallel_size</code> — TP (tensor parallel) size for the draft
                  model.
                </li>
                <li>
                  <code>rejection_sample_method</code> — <code>strict</code> (default),{' '}
                  <code>probabilistic</code>, or <code>synthetic</code>.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">N-gram and suffix knobs</Box>
              <ul>
                <li>
                  <code>prompt_lookup_min</code> / <code>prompt_lookup_max</code> — the n-gram window
                  bounds for prompt-lookup drafting (each defaults to 5 when both are omitted).
                </li>
                <li>
                  <code>suffix_decoding_max_tree_depth</code> (default 24) — max combined prefix-match
                  + speculation tree depth.
                </li>
                <li>
                  <code>suffix_decoding_max_cached_requests</code> (default 10000) — size of the
                  global suffix tree; set 0 to disable the global cache.
                </li>
                <li>
                  <code>suffix_decoding_max_spec_factor</code> /{' '}
                  <code>suffix_decoding_min_token_prob</code> — cap speculation length and the minimum
                  token probability required to speculate.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="info">
            <code>--speculative-config</code> expects a JSON object on the CLI; in YAML config files
            it is a nested mapping. The exact field schema, defaults, and the proposer classes behind
            each <code>method</code> are walked against the source in the{' '}
            <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong> tab (
            <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
              vLLM Docs: Speculative Decoding &rarr; config schema, accessed 2026-06-07
            </Link>
            ).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Caveats and incompatibilities</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Speculation composes with most of the engine, but not all of it, and a few details bite in
            production. The docs call out specific incompatibilities tied to version &mdash; another
            reason to re-check against the page you are running, not a remembered one.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Documented incompatibilities</Box>
              <ul>
                <li>
                  <strong>Pipeline parallelism</strong> is <em>&quot;not composible with speculative
                  decoding as of vllm&lt;=0.15.0.&quot;</em> If you split the target across pipeline
                  stages, speculation is off the table in those versions.
                </li>
                <li>
                  <strong>Draft-model speculation</strong> is <em>&quot;not supported in
                  vllm&lt;=0.10.0.&quot;</em> The generic <code>draft_model</code> path landed after
                  that line.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Operational gotchas</Box>
              <ul>
                <li>
                  <strong>Draft TP must line up with the target.</strong> The draft model&apos;s
                  tensor-parallel size is configured via <code>draft_tensor_parallel_size</code>;
                  mismatched parallelism between drafter and target is a classic source of failure.
                </li>
                <li>
                  <strong>Native heads beat generic checkpoints</strong> where available — the docs
                  note, e.g., that Gemma assistant checkpoints are handled as MTP speculators, not as
                  generic draft models. Use the method the checkpoint was built for.
                </li>
                <li>
                  <strong>Logprobs aren&apos;t guaranteed stable.</strong> vLLM does not currently
                  guarantee stable token logprobs, so the same request can yield different outputs
                  across runs — independent of speculation, but relevant if you compare runs.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Lossless, restated for the skeptic">
            <SpaceBetween size="s">
              <Box variant="p">
                The fear with any &quot;draft then accept&quot; scheme is that you are trading quality
                for speed. The vLLM docs break the guarantee into three parts:{' '}
                <strong>theoretical losslessness</strong> (the rejection-sampling math is lossless up
                to hardware numerics), <strong>algorithmic losslessness</strong> (vLLM&apos;s
                implementation is validated by rejection-sampler convergence tests and by confirming
                greedy sampling with speculation matches greedy sampling without it), and a noted{' '}
                <strong>logprob-stability</strong> caveat (logprobs are not currently guaranteed
                stable across runs).
              </Box>
              <Box variant="p">
                The practical takeaway: the <em>tokens you get</em> are distributed as the target
                would have produced them; what speculation buys is fewer serial target passes to get
                there. Residual differences between a speculative and non-speculative run come from
                floating-point error, the same numerics caveat that makes any two GPU runs of the same
                model not bit-identical (
                <Link external href="https://docs.vllm.ai/en/latest/features/speculative_decoding/">
                  vLLM Docs: Speculative Decoding &rarr; &quot;Lossless guarantees&quot;, accessed 2026-06-07
                </Link>
                ).
              </Box>
              <Box variant="p">
                For the arithmetic-intensity reason this works at all &mdash; why a memory-bound
                decode pass has spare compute to verify K tokens, and where the roofline crossover to
                throughput-bound batching sits &mdash; see the{' '}
                <Link external href="../silicon-memory-inference/">
                  Silicon, Memory &amp; Inference
                </Link>{' '}
                deep dive. For the proposer classes and the verify/rejection-sample call path, see the{' '}
                <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong> tab.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
