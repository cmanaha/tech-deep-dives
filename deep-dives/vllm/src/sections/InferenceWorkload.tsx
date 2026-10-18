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
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

interface SloRow {
  metric: string;
  bound: string;
  phase: string;
  meaning: string;
  lever: string;
}

const sloRows: SloRow[] = [
  {
    metric: 'TTFT: time to first token',
    bound: 'Prefill',
    phase: 'compute-bound',
    meaning: 'Time from request arrival until the first output token is streamed. Dominated by prompt length and queue wait.',
    lever: 'Chunked prefill, prefix caching, more compute, shorter queue.',
  },
  {
    metric: 'ITL / TPOT (inter-token latency, time per output token)',
    bound: 'Decode',
    phase: 'memory-bandwidth-bound',
    meaning: 'Steady-state gap between successive output tokens once generation has started. Sets the "typing speed" the user feels.',
    lever: 'Higher HBM bandwidth, larger batch (amortize weight reads), speculative decoding.',
  },
  {
    metric: 'E2E latency (end-to-end)',
    bound: 'Both',
    phase: 'TTFT + (output_len − 1) × ITL',
    meaning: 'Total wall-clock for the whole response. A long prompt inflates TTFT; a long answer inflates the ITL sum.',
    lever: 'Everything above, plus output-length control.',
  },
  {
    metric: 'Throughput: tokens/s',
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
            description="The mental model an architect needs before the engine internals: two phases, four SLOs (service-level objectives), and one first-order lever (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            2. The Inference Workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            Autoregressive LLM inference is{' '}
            <strong>two workloads with opposite hardware profiles</strong>, stitched together
            per request. A <strong>prefill</strong> phase ingests the entire prompt in one
            forward pass and is <strong>compute-bound</strong>. A <strong>decode</strong> phase
            then emits output one token at a time, each token a fresh forward pass, and is{' '}
            <strong>memory-bandwidth-bound</strong>. Almost every serving decision in the rest
            of this deep dive (batching, KV cache, disaggregation, speculation) exists to
            reconcile the tension between these two phases.
          </Box>
          <Box variant="p">
            This section builds the conceptual model. The hardware framing underneath it (the
            roofline, arithmetic intensity, and why "memory-bound" is a precise
            statement about FLOPs-per-byte rather than a vibe) lives in the sibling{' '}
            <Link
              external
              href="../silicon-memory-inference/"
            >
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive. The code paths that implement the model, namely the scheduler&apos;s token
            budget, the KV-cache block manager, and the model runner, live in{' '}
            <strong>14. Inside the Codebase</strong>. This section gives you the vocabulary to
            read both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which phase sets time to first token and which sets inter-token latency, and why each one wants different hardware"
          >
            The Two Phases of a Single Request
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Prefill processes the whole prompt at once.</strong> Every prompt token is
            available up front, so the engine runs them through the model in a single batched
            forward pass, computing and storing the per-token attention keys and values (the{' '}
            <strong>KV cache</strong>) for the entire prompt. Because hundreds or thousands of
            tokens flow through dense matrix multiplies simultaneously, the GPU&apos;s compute
            units stay busy: this phase is <strong>compute-bound</strong> and it is what sets{' '}
            <strong>TTFT</strong> (time to first token).
          </Box>
          <Box variant="p">
            <strong>Decode generates one token at a time.</strong> Each new token depends on
            the one before it, so generation is inherently sequential. For every single output
            token the engine must read the full model weights (and the growing KV cache) from
            high-bandwidth memory (HBM) to produce exactly one token of useful work. The matrix
            multiplies degenerate into skinny matrix-vector products with almost no data reuse,
            so the compute units sit mostly idle waiting on memory. This phase is{' '}
            <strong>memory-bandwidth-bound</strong> and it sets <strong>ITL</strong> (inter-token
            latency, also called TPOT, time per output token).
          </Box>

          <PrefillDecodeTimeline />

          <Alert type="info">
            <strong>Why decode is memory-bound, the one-sentence version.</strong> A single
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
                <li>High arithmetic intensity: big dense matmuls, lots of data reuse</li>
                <li>Cost scales with prompt length; long prompts dominate TTFT</li>
                <li>Writes the prompt&apos;s KV cache that decode will read</li>
                <li>Throughput here is gated by raw FLOPs</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Decode <Badge color="green">memory-bound</Badge></Box>
              <ul>
                <li>
                  One token per forward pass, strictly sequential (speculative decoding, section
                  11, verifies several drafted tokens in one pass)
                </li>
                <li>Low arithmetic intensity: matrix-vector, almost no reuse</li>
                <li>Cost scales with output length; sets ITL / TPOT</li>
                <li>Reads all weights + KV cache from HBM every step</li>
                <li>Throughput here is gated by memory bandwidth</li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>The vLLM V1 scheduler mixes both phases in one step.</strong> The two-phase
            model is the right way to <em>reason about the hardware</em>, but V1&apos;s scheduler
            treats prompt and output tokens uniformly: it allocates a fixed per-step{' '}
            <em>token budget</em> (<code>max_num_batched_tokens</code>) across requests,
            described in the docs as "a simple dictionary (e.g.,{' '}
            <code>{'{request_id: num_tokens}'}</code>)"{' '}
            <Cite tier={1} href={vllmDocsUrl('usage/v1_guide/')}>
              vLLM docs: V1 guide
            </Cite>
            , so a step can mix tokens from many requests in any phase. For{' '}
            <code>vllm serve</code> the budget defaults to 16384 tokens per step on GPUs with at
            least 160 GiB, 8192 on H100-class GPUs and 2048 elsewhere{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2858-L2887')}>
              arg_utils.py L2858-L2887
            </Cite>
            . That budget is exactly what makes <strong>chunked prefill</strong> (slicing a long
            prompt across steps so it doesn&apos;t stall everyone&apos;s decode) possible.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name the numbers your product is held to, the phase that drives each, and the metric vLLM exports for it"
          >
            The SLOs You Actually Serve Against
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Four numbers describe an inference deployment, and each maps cleanly to a phase.
            Pin down which ones your product is contracted on <em>before</em> you tune anything:
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
          <Box variant="p">
            vLLM exports the latency SLOs as Prometheus histograms:{' '}
            <code>vllm:time_to_first_token_seconds</code>,{' '}
            <code>vllm:inter_token_latency_seconds</code>,{' '}
            <code>vllm:request_time_per_output_token_seconds</code> (TPOT per request) and{' '}
            <code>vllm:e2e_request_latency_seconds</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L821-L859')}>
              loggers.py L821-L859
            </Cite>
            . Dashboards and load testing against them are in{' '}
            <strong>20. Observability &amp; Benchmarking</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why batch size is the dial between latency and cost per token, and what to size capacity against"
          >
            The Latency vs Throughput Tension
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>You cannot maximize both at once, and the reason is the batch.</strong>{' '}
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
            read produces a single token. With a batch of N, the same read produces N tokens:
            the per-token bandwidth cost is amortized across the whole batch. Until you saturate
            either memory bandwidth or KV-cache capacity, every request you add to the decode
            batch is nearly free throughput. That is why raising the effective batch size is the
            single highest-leverage thing a serving engine can do, and why{' '}
            <strong>continuous batching</strong> (admitting and retiring requests at every
            step instead of waiting for a fixed batch to drain) is vLLM&apos;s headline
            technique. The mechanics are in{' '}
            <strong>4. Scheduler &amp; Continuous Batching</strong>.
          </Box>
          <Alert type="info">
            <strong>Plan capacity on goodput.</strong> Raw tokens/s is a vanity number if
            half those tokens missed their latency SLO. <strong>Goodput</strong> is the rate of
            requests (or tokens) delivered <em>within</em> their TTFT and ITL targets. As you push
            the batch larger, raw throughput keeps climbing while goodput peaks and then falls:
            once per-step latency blows the ITL budget, the extra tokens don&apos;t count.
            Capacity planning and autoscaling should target goodput at your SLO.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read your real concurrency ceiling off one startup log line, and know which levers raise it"
          >
            What Bounds the Batch: the KV Cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            If batching is the lever, the obvious question is: how large can the batch get? The
            usual answer is <strong>KV-cache memory</strong>, ahead of compute or the configured
            maximum. Every request in flight holds its own KV cache, and
            that cache <em>grows by one token&apos;s worth of keys and values on every decode
            step</em>. The HBM not occupied by model weights and activations is the KV-cache
            budget, and that budget divided by the per-request cache footprint is the real
            ceiling on concurrency. vLLM prints that ceiling at startup:{' '}
            <code>
              GPU KV cache size: N tokens, Maximum concurrency for M tokens per request: X.XXx
            </code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L2455-L2471')}>
              kv_cache_utils.py L2455-L2471
            </Cite>
            . M is <code>max_model_len</code>, and X is how many requests at that full length fit
            in the cache at once.
          </Box>
          <Box variant="p">
            This is why two replicas of the same model on the same hardware can have wildly
            different achievable throughput: a workload with short prompts and short outputs fits
            many concurrent requests into the KV budget, while long-context requests each consume
            a large slice and starve the batch. Naive (contiguous) KV allocation also wastes a
            large fraction of memory to fragmentation and over-reservation. vLLM&apos;s{' '}
            <strong>paged KV cache</strong> (introduced as PagedAttention) solves this by
            allocating the cache in fixed-size blocks. The full treatment, including how to read
            and size the KV budget, is in <strong>5. Paged KV Cache &amp; Block Tables</strong>;
            the scaling guide walks through GPU KV-cache sizing and throughput estimation{' '}
            <Cite tier={1} href={vllmDocsUrl('serving/parallelism_scaling/')}>
              vLLM docs: Parallelism and scaling
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>The chain to keep in your head:</strong> memory bandwidth makes decode
            slow &rarr; batching amortizes the weight read and recovers throughput &rarr; KV-cache
            capacity caps how big the batch can be (the startup log&apos;s maximum concurrency)
            &rarr; paged blocks (section 5), KV quantization (section 8) and tiered offloading to
            CPU, disk or object store (section 7) stretch that cap. Hold this chain and the rest of
            the deep dive is filling in mechanism.
          </Alert>

          <ExpandableSection headerText="Worked intuition: why one decode step yields so little useful work">
            <SpaceBetween size="s">
              <Box variant="p">
                Picture a decode step for a batch of one. The engine reads every weight matrix in
                the model out of HBM (for a multi-billion-parameter model that is gigabytes of
                traffic), multiplies each against a single token&apos;s hidden vector, and emits
                one token. The arithmetic done per byte read is tiny, so the step time is
                essentially "bytes of weights &divide; memory bandwidth." The compute
                units are idle most of the step.
              </Box>
              <Box variant="p">
                Now batch 32 requests. The weight read is <em>the same size</em> (you read each
                matrix once), but now it feeds 32 token-vectors and produces 32 tokens. The
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
                budget per step. This asymmetry (decode loves batching, prefill is already busy)
                is the motivation for <strong>disaggregated prefill/decode</strong> serving, where
                the two phases run on separately tuned pools. See{' '}
                <strong>10. Disaggregated Prefill / Decode</strong>.
              </Box>
              <Box variant="small">
                The roofline that makes "amortizes" and "saturates"
                quantitative (the exact batch size where decode crosses from memory-bound to
                compute-bound for a given chip) is derived in the{' '}
                <Link external href="../silicon-memory-inference/">
                  Silicon, Memory &amp; Inference
                </Link>{' '}
                deep dive.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where to go next, by the link of the chain you need to tune"
          >
            Where This Goes Next
          </Header>
        }
      >
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
              The paged KV cache is how vLLM stops KV-cache fragmentation from capping the batch
              far below what the HBM could hold. <strong>5. Paged KV Cache &amp; Block Tables</strong>.
            </Box>
          </div>
          <div>
            <Box variant="h3">The hardware &rarr; sibling</Box>
            <Box variant="p">
              The roofline, arithmetic intensity, and memory-bandwidth-vs-FLOPs math behind every
              "memory-bound" claim here.{' '}
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
  // Layout constants for the inline SVG timeline (Idiom B: hex constants plus presentation attributes).
  const w = 680;
  const h = 192;
  const font = 'sans-serif';
  const blue = '#0972d3';
  const green = '#037f51';
  const grey = '#5f6b7a';
  const barTop = 78;
  const barH = 34;
  const barBottom = barTop + barH;
  const arrive = 40;
  const prefillEnd = 250; // also the TTFT marker and first-token time
  const decodeStep = 90;
  const decodeStarts = [prefillEnd, prefillEnd + decodeStep, prefillEnd + 2 * decodeStep, prefillEnd + 3 * decodeStep];
  const lastTokenX = decodeStarts[3] + decodeStep;
  const ttftY = 40; // TTFT bracket line
  const itlY = barBottom + 10; // ITL bracket line, clear of the decode bars
  const axisY = itlY + 36;

  return (
    <Box>
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-labelledby="pd-timeline-title"
          style={{ width: '100%', minWidth: 640, maxWidth: 760, height: 'auto' }}
        >
          <title id="pd-timeline-title">
            One request over time: a single compute-bound prefill pass over the whole prompt ends at
            the first token and sets TTFT, then memory-bound decode steps emit one token each, and
            the gap between consecutive tokens is the inter-token latency (ITL).
          </title>
          <rect x={0} y={0} width={w} height={h} rx={8} fill="#ffffff" stroke="#e9ebed" />

          {/* TTFT bracket */}
          <text x={(arrive + prefillEnd) / 2} y={ttftY - 14} fontSize="12" fill={blue} textAnchor="middle" fontWeight="bold" fontFamily={font}>
            TTFT (time to first token)
          </text>
          <line x1={arrive} y1={ttftY} x2={prefillEnd} y2={ttftY} stroke={blue} strokeWidth={1.5} />
          <line x1={arrive} y1={ttftY - 6} x2={arrive} y2={ttftY + 6} stroke={blue} strokeWidth={1.5} />
          <line x1={prefillEnd} y1={ttftY - 6} x2={prefillEnd} y2={ttftY + 6} stroke={blue} strokeWidth={1.5} />

          {/* labels above the bars */}
          <text x={(arrive + prefillEnd) / 2} y={barTop - 12} fontSize="11" fill={grey} textAnchor="middle" fontFamily={font}>
            whole prompt, one pass
          </text>
          <text x={decodeStarts[1]} y={barTop - 12} fontSize="11" fill={grey} fontFamily={font}>
            DECODE (memory-bound): one token per step
          </text>

          {/* prefill block */}
          <rect x={arrive} y={barTop} width={prefillEnd - arrive} height={barH} rx={4} fill={blue} />
          <text x={(arrive + prefillEnd) / 2} y={barTop + barH / 2 + 4} fontSize="13" fill="#ffffff" textAnchor="middle" fontWeight="bold" fontFamily={font}>
            PREFILL (compute-bound)
          </text>

          {/* decode steps */}
          {decodeStarts.map((x, i) => (
            <g key={i}>
              <rect x={x} y={barTop} width={decodeStep - 8} height={barH} rx={4} fill={green} />
              <text x={x + (decodeStep - 8) / 2} y={barTop + barH / 2 + 4} fontSize="12" fill="#ffffff" textAnchor="middle" fontFamily={font}>
                tok {i + 1}
              </text>
            </g>
          ))}

          {/* first-token marker */}
          <circle cx={prefillEnd} cy={barTop} r={4} fill={blue} />

          {/* ITL bracket between the starts of two decode steps, label below it */}
          <line x1={decodeStarts[1]} y1={itlY} x2={decodeStarts[2]} y2={itlY} stroke={green} strokeWidth={1.5} />
          <line x1={decodeStarts[1]} y1={itlY - 4} x2={decodeStarts[1]} y2={itlY + 4} stroke={green} strokeWidth={1.5} />
          <line x1={decodeStarts[2]} y1={itlY - 4} x2={decodeStarts[2]} y2={itlY + 4} stroke={green} strokeWidth={1.5} />
          <text x={(decodeStarts[1] + decodeStarts[2]) / 2} y={itlY + 20} fontSize="11" fill={green} textAnchor="middle" fontWeight="bold" fontFamily={font}>
            ITL
          </text>

          {/* time axis */}
          <line x1={arrive} y1={axisY} x2={lastTokenX + 30} y2={axisY} stroke={grey} strokeWidth={1.5} />
          <text x={arrive} y={axisY + 18} fontSize="12" fill={grey} fontFamily={font}>
            request arrives
          </text>
          <text x={lastTokenX + 30} y={axisY + 18} fontSize="12" fill={grey} textAnchor="end" fontFamily={font}>
            time &rarr;
          </text>
        </svg>
      </div>
      <Box variant="small">
        One request&apos;s lifecycle. A single compute-bound prefill block processes the entire
        prompt and ends at the first token, defining <strong>TTFT</strong>. Generation then
        proceeds as a chain of memory-bound decode steps, one output token each; the gap between
        consecutive tokens is the <strong>inter-token latency (ITL / TPOT)</strong>. Illustrative,
        not measured: block widths are not to scale.
      </Box>
    </Box>
  );
}
