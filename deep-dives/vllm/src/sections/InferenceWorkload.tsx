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

interface SloRow {
  metric: string;
  bound: string;
  phase: string;
  meaning: string;
  lever: string;
}

const sloRows: SloRow[] = [
  {
    metric: 'TTFT — time to first token',
    bound: 'Prefill',
    phase: 'compute-bound',
    meaning: 'Time from request arrival until the first output token is streamed. Dominated by prompt length and queue wait.',
    lever: 'Chunked prefill, prefix caching, more compute, shorter queue.',
  },
  {
    metric: 'ITL / TPOT — inter-token latency, time per output token',
    bound: 'Decode',
    phase: 'memory-bandwidth-bound',
    meaning: 'Steady-state gap between successive output tokens once generation has started. Sets the "typing speed" the user feels.',
    lever: 'Higher HBM bandwidth, larger batch (amortize weight reads), speculative decoding.',
  },
  {
    metric: 'E2E latency — end-to-end',
    bound: 'Both',
    phase: 'TTFT + (output_len − 1) × ITL',
    meaning: 'Total wall-clock for the whole response. A long prompt inflates TTFT; a long answer inflates the ITL sum.',
    lever: 'Everything above, plus output-length control.',
  },
  {
    metric: 'Throughput — tokens/s',
    bound: 'Aggregate',
    phase: 'system-level',
    meaning: 'Total output (and prompt) tokens the replica emits per second across all concurrent requests.',
    lever: 'Larger batch, continuous batching, more KV-cache headroom.',
  },
];

export function InferenceWorkload() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The mental model an architect needs before the engine internals: two phases, four SLOs, and one first-order lever"
          >
            2. The Inference Workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            Autoregressive LLM inference is not one workload — it is{' '}
            <strong>two workloads with opposite hardware profiles</strong>, stitched together
            per request. A <strong>prefill</strong> phase ingests the entire prompt in one
            forward pass and is <strong>compute-bound</strong>. A <strong>decode</strong> phase
            then emits output one token at a time, each token a fresh forward pass, and is{' '}
            <strong>memory-bandwidth-bound</strong>. Almost every serving decision in the rest
            of this deep dive — batching, KV cache, disaggregation, speculation — exists to
            reconcile the tension between these two phases.
          </Box>
          <Box variant="p">
            This section builds the conceptual model. The hardware framing underneath it — the
            roofline, arithmetic intensity, and why &ldquo;memory-bound&rdquo; is a precise
            statement about FLOPs-per-byte rather than a vibe — lives in the sibling{' '}
            <Link
              external
              href="../silicon-memory-inference/"
            >
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive. The code paths that implement the model — the scheduler&apos;s token
            budget, the KV-cache block manager, the model runner — live in{' '}
            <strong>14. Inside the Codebase</strong>. This section deliberately does neither:
            it gives you the vocabulary to read both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Two Phases of a Single Request</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Prefill processes the whole prompt at once.</strong> Every prompt token is
            available up front, so the engine runs them through the model in a single batched
            forward pass, computing and storing the per-token attention keys and values (the{' '}
            <strong>KV cache</strong>) for the entire prompt. Because hundreds or thousands of
            tokens flow through dense matrix multiplies simultaneously, the GPU&apos;s compute
            units stay busy — this phase is <strong>compute-bound</strong> and it is what sets{' '}
            <strong>TTFT</strong>.
          </Box>
          <Box variant="p">
            <strong>Decode generates one token at a time.</strong> Each new token depends on
            the one before it, so generation is inherently sequential. For every single output
            token the engine must read the full model weights (and the growing KV cache) from
            high-bandwidth memory (HBM) to produce exactly one token of useful work. The matrix
            multiplies degenerate into skinny matrix-vector products with almost no data reuse,
            so the compute units sit mostly idle waiting on memory. This phase is{' '}
            <strong>memory-bandwidth-bound</strong> and it sets <strong>ITL</strong> (inter-token
            latency, also called TPOT — time per output token).
          </Box>

          <PrefillDecodeTimeline />

          <Alert type="info">
            <strong>Why decode is memory-bound — the one-sentence version.</strong> A single
            decode step reads the entire weight matrix from HBM but does only enough arithmetic
            to advance one token, so the step time is governed by{' '}
            <em>how fast you can stream bytes out of memory</em>, not by how many FLOPs the chip
            can do. The precise FLOPs-per-byte (arithmetic-intensity / roofline) treatment is in
            the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            entry.
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Prefill <Badge color="blue">compute-bound</Badge></Box>
              <ul>
                <li>Processes the full prompt in one forward pass</li>
                <li>High arithmetic intensity — big dense matmuls, lots of data reuse</li>
                <li>Cost scales with prompt length; long prompts dominate TTFT</li>
                <li>Writes the prompt&apos;s KV cache that decode will read</li>
                <li>Throughput here is gated by raw FLOPs</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Decode <Badge color="green">memory-bound</Badge></Box>
              <ul>
                <li>One token per forward pass, strictly sequential</li>
                <li>Low arithmetic intensity — matrix-vector, almost no reuse</li>
                <li>Cost scales with output length; sets ITL / TPOT</li>
                <li>Reads all weights + KV cache from HBM every step</li>
                <li>Throughput here is gated by memory bandwidth</li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>vLLM V1 does not enforce a hard prefill/decode split.</strong> The two-phase
            model is the right way to <em>reason about the hardware</em>, but V1&apos;s scheduler
            treats prompt and output tokens uniformly: it allocates a fixed per-step{' '}
            <em>token budget</em> across requests &mdash; described in the docs as &ldquo;a simple
            dictionary (e.g., <code>{'{request_id: num_tokens}'}</code>)&rdquo; &mdash; so a
            step can mix tokens from many requests in any phase. That budget is exactly what makes{' '}
            <strong>chunked prefill</strong> (slicing a long prompt across steps so it doesn&apos;t
            stall everyone&apos;s decode) possible.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/usage/v1_guide/"
            >
              vLLM V1 guide (accessed 2026-06-07)
            </Link>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The SLOs You Actually Serve Against</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Four numbers describe an inference deployment, and each maps cleanly to a phase.
            Pin down which ones your product is contracted on <em>before</em> you tune anything —
            a chat UX lives and dies on TTFT and ITL, a batch summarization job only cares about
            tokens/s, and an agent loop is sensitive to end-to-end latency because it chains many
            calls.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={sloRows}
            columnDefinitions={[
              {
                id: 'metric',
                header: 'SLO',
                cell: (r) => <strong>{r.metric}</strong>,
                minWidth: 180,
              },
              { id: 'bound', header: 'Driven by', cell: (r) => r.bound, minWidth: 100 },
              {
                id: 'phase',
                header: 'Character',
                cell: (r) => <code>{r.phase}</code>,
                minWidth: 160,
              },
              { id: 'meaning', header: 'What it measures', cell: (r) => r.meaning, minWidth: 240 },
              { id: 'lever', header: 'Primary lever', cell: (r) => r.lever, minWidth: 200 },
            ]}
          />
          <Box variant="small">
            End-to-end latency is well approximated by{' '}
            <code>TTFT + (output_len &minus; 1) &times; ITL</code> for a streaming response:
            one prefill cost plus one ITL per subsequent token.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Latency vs Throughput Tension</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>You cannot maximize both at once — and the reason is the batch.</strong>{' '}
            Latency SLOs (TTFT, ITL) want each request handled in isolation, as fast as possible.
            Throughput (tokens/s, and therefore cost-per-token) wants many requests packed into
            the same forward pass so the hardware is never idle. Batching is the dial between
            them: a bigger batch raises throughput but lengthens every participant&apos;s per-step
            latency; a batch of one minimizes latency but wastes most of the GPU.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Latency-optimized</Box>
              <Box variant="p">
                Small batches, generous compute headroom per request. Interactive chat, agentic
                tool loops, anything a human is waiting on. You pay more per token to keep TTFT
                and ITL tight. Tail latency (p95/p99) matters more than the mean.
              </Box>
            </div>
            <div>
              <Box variant="h3">Throughput-optimized</Box>
              <Box variant="p">
                Large batches, GPU saturated. Offline scoring, document summarization,
                synthetic-data generation, evals. Per-request latency is irrelevant; the only
                metric that pays the bill is aggregate tokens/s and dollars-per-million-tokens.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Why batching is the first-order lever.</strong> In the memory-bound decode
            phase, the model weights are read from HBM <em>once per forward pass regardless of
            how many requests are in the batch</em>. With a batch of one, that expensive weight
            read produces a single token. With a batch of N, the same read produces N tokens —
            the per-token bandwidth cost is amortized across the whole batch. Until you saturate
            either memory bandwidth or KV-cache capacity, every request you add to the decode
            batch is nearly free throughput. That is why raising the effective batch size is the
            single highest-leverage thing a serving engine can do, and why{' '}
            <strong>continuous batching</strong> &mdash; admitting and retiring requests at every
            step instead of waiting for a fixed batch to drain &mdash; is vLLM&apos;s headline
            technique. The mechanics are in{' '}
            <strong>4. Scheduler &amp; Continuous Batching</strong>.
          </Box>
          <Alert type="info">
            <strong>Goodput, not raw throughput.</strong> Raw tokens/s is a vanity number if
            half those tokens missed their latency SLO. <strong>Goodput</strong> is the rate of
            requests (or tokens) delivered <em>within</em> their TTFT and ITL targets. As you push
            the batch larger, raw throughput keeps climbing while goodput peaks and then falls —
            once per-step latency blows the ITL budget, the extra tokens don&apos;t count.
            Capacity planning and autoscaling should target goodput at your SLO, not the
            throughput headline.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">What Bounds the Batch: the KV Cache</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            If batching is the lever, the obvious question is: how large can the batch get? The
            answer is rarely compute and rarely the configured maximum — it is{' '}
            <strong>KV-cache memory</strong>. Every request in flight holds its own KV cache, and
            that cache <em>grows by one token&apos;s worth of keys and values on every decode
            step</em>. The HBM not occupied by model weights and activations is the KV-cache
            budget, and that budget divided by the per-request cache footprint is the real
            ceiling on concurrency.
          </Box>
          <Box variant="p">
            This is why two replicas of the same model on the same hardware can have wildly
            different achievable throughput: a workload with short prompts and short outputs fits
            many concurrent requests into the KV budget, while long-context requests each consume
            a large slice and starve the batch. Naive (contiguous) KV allocation also wastes a
            large fraction of memory to fragmentation and over-reservation — the problem{' '}
            <strong>PagedAttention</strong> was built to solve by paging the cache into fixed-size
            blocks. The full treatment, including how to read and size the KV budget, is in{' '}
            <strong>5. PagedAttention &amp; KV-Cache</strong>; the docs also walk through GPU
            KV-cache sizing and throughput estimation in the scaling guide.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
            .
          </Box>
          <Alert type="info">
            <strong>The chain to keep in your head:</strong> memory bandwidth makes decode
            slow &rarr; batching amortizes the weight read and recovers throughput &rarr; KV-cache
            capacity caps how big the batch can be &rarr; PagedAttention and offloading stretch
            that cap. Hold this chain and the rest of the deep dive is filling in mechanism.
          </Alert>

          <ExpandableSection headerText="Worked intuition: why one decode step yields so little useful work">
            <SpaceBetween size="s">
              <Box variant="p">
                Picture a decode step for a batch of one. The engine reads every weight matrix in
                the model out of HBM — for a multi-billion-parameter model that is gigabytes of
                traffic — multiplies each against a single token&apos;s hidden vector, and emits
                one token. The arithmetic done per byte read is tiny, so the step time is
                essentially &ldquo;bytes of weights &divide; memory bandwidth.&rdquo; The compute
                units are idle most of the step.
              </Box>
              <Box variant="p">
                Now batch 32 requests. The weight read is <em>the same size</em> — you read each
                matrix once — but now it feeds 32 token-vectors and produces 32 tokens. The
                expensive part (the memory traffic) was amortized 32&times;; the cheap part (the
                extra arithmetic) grew but the chip had spare compute to absorb it. Throughput
                rises roughly linearly with batch size in this regime, which is the whole reason
                continuous batching wins. It stops winning when (a) you run out of KV-cache
                memory to admit more requests, or (b) the batch gets large enough that the
                arithmetic finally saturates compute and you re-enter a compute-bound regime.
              </Box>
              <Box variant="p">
                Prefill behaves oppositely: even a single long prompt already has high arithmetic
                intensity, so batching helps far less and the constraint is FLOPs and the token
                budget per step. This asymmetry — decode loves batching, prefill is already busy —
                is the motivation for <strong>disaggregated prefill/decode</strong> serving, where
                the two phases run on separately tuned pools. See{' '}
                <strong>10. Disaggregated Prefill / Decode</strong>.
              </Box>
              <Box variant="small">
                The roofline that makes &ldquo;amortizes&rdquo; and &ldquo;saturates&rdquo;
                quantitative — the exact batch size where decode crosses from memory-bound to
                compute-bound for a given chip — is derived in the{' '}
                <Link external href="../silicon-memory-inference/">
                  Silicon, Memory &amp; Inference
                </Link>{' '}
                deep dive.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Where This Goes Next</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">The lever &rarr; §4</Box>
            <Box variant="p">
              Continuous batching and the token-budget scheduler turn the batching intuition here
              into a per-step mechanism. <strong>4. Scheduler &amp; Continuous Batching</strong>.
            </Box>
          </div>
          <div>
            <Box variant="h3">The ceiling &rarr; §5</Box>
            <Box variant="p">
              PagedAttention is how vLLM stops KV-cache fragmentation from capping the batch far
              below what the HBM could hold. <strong>5. PagedAttention &amp; KV-Cache</strong>.
            </Box>
          </div>
          <div>
            <Box variant="h3">The hardware &rarr; sibling</Box>
            <Box variant="p">
              The roofline, arithmetic intensity, and memory-bandwidth-vs-FLOPs math behind every
              &ldquo;memory-bound&rdquo; claim here.{' '}
              <Link external href="../silicon-memory-inference/">
                Silicon, Memory &amp; Inference
              </Link>
              .
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}

function PrefillDecodeTimeline() {
  // Layout constants for the inline SVG timeline.
  const w = 760;
  const h = 240;
  const baselineY = 150;
  const barH = 34;
  const arrive = 40;
  const prefillEnd = 250; // also the TTFT marker and first-token time
  const decodeStep = 90;
  const decodeStartTops = [prefillEnd, prefillEnd + decodeStep, prefillEnd + 2 * decodeStep, prefillEnd + 3 * decodeStep];
  const lastTokenX = decodeStartTops[3] + decodeStep;

  return (
    <Box>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="Timeline of one request: a single compute-bound prefill block sets TTFT, followed by a sequence of memory-bound decode steps each separated by the inter-token latency ITL."
        style={{ maxWidth: '760px', fontFamily: 'inherit' }}
      >
        {/* axis */}
        <line x1={arrive} y1={baselineY + barH + 18} x2={lastTokenX + 30} y2={baselineY + barH + 18} stroke="#5f6b7a" strokeWidth={1.5} />
        <text x={arrive} y={baselineY + barH + 34} fontSize="12" fill="#5f6b7a">request arrives</text>
        <text x={lastTokenX - 20} y={baselineY + barH + 34} fontSize="12" fill="#5f6b7a">time &rarr;</text>

        {/* prefill block */}
        <rect x={arrive} y={baselineY} width={prefillEnd - arrive} height={barH} rx={4} fill="#0972d3" />
        <text x={(arrive + prefillEnd) / 2} y={baselineY + barH / 2 + 4} fontSize="13" fill="#ffffff" textAnchor="middle" fontWeight="bold">
          PREFILL (compute-bound)
        </text>
        <text x={(arrive + prefillEnd) / 2} y={baselineY - 10} fontSize="11" fill="#5f6b7a" textAnchor="middle">
          whole prompt, one pass
        </text>

        {/* TTFT bracket */}
        <line x1={arrive} y1={baselineY - 46} x2={prefillEnd} y2={baselineY - 46} stroke="#0972d3" strokeWidth={1.5} />
        <line x1={arrive} y1={baselineY - 52} x2={arrive} y2={baselineY - 40} stroke="#0972d3" strokeWidth={1.5} />
        <line x1={prefillEnd} y1={baselineY - 52} x2={prefillEnd} y2={baselineY - 40} stroke="#0972d3" strokeWidth={1.5} />
        <text x={(arrive + prefillEnd) / 2} y={baselineY - 54} fontSize="12" fill="#0972d3" textAnchor="middle" fontWeight="bold">
          TTFT (time to first token)
        </text>

        {/* decode steps */}
        {decodeStartTops.map((x, i) => (
          <g key={i}>
            <rect x={x} y={baselineY} width={decodeStep - 8} height={barH} rx={4} fill="#037f51" />
            <text x={x + (decodeStep - 8) / 2} y={baselineY + barH / 2 + 4} fontSize="12" fill="#ffffff" textAnchor="middle">
              tok {i + 1}
            </text>
          </g>
        ))}
        <text x={decodeStartTops[1]} y={baselineY - 10} fontSize="11" fill="#5f6b7a">
          DECODE (memory-bound): one token per step
        </text>

        {/* ITL bracket between two decode steps */}
        <line x1={decodeStartTops[1]} y1={baselineY + barH + 6} x2={decodeStartTops[2]} y2={baselineY + barH + 6} stroke="#037f51" strokeWidth={1.5} />
        <line x1={decodeStartTops[1]} y1={baselineY + barH + 2} x2={decodeStartTops[1]} y2={baselineY + barH + 10} stroke="#037f51" strokeWidth={1.5} />
        <line x1={decodeStartTops[2]} y1={baselineY + barH + 2} x2={decodeStartTops[2]} y2={baselineY + barH + 10} stroke="#037f51" strokeWidth={1.5} />
        <text x={(decodeStartTops[1] + decodeStartTops[2]) / 2} y={baselineY + barH + 4} fontSize="11" fill="#037f51" textAnchor="middle" fontWeight="bold">
          ITL
        </text>

        {/* first-token marker */}
        <circle cx={prefillEnd} cy={baselineY} r={4} fill="#0972d3" />
      </svg>
      <Box variant="small">
        One request&apos;s lifecycle. A single compute-bound prefill block processes the entire
        prompt and ends at the first token, defining <strong>TTFT</strong>. Generation then
        proceeds as a chain of memory-bound decode steps, one output token each; the gap between
        consecutive tokens is the <strong>inter-token latency (ITL / TPOT)</strong>. Block widths
        are illustrative, not to scale.
      </Box>
    </Box>
  );
}
