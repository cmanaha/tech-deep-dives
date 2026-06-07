import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

const ACCESSED = 'accessed 2026-06-07';

function MetricsPipelineDiagram() {
  const node: React.CSSProperties = {
    border: '1px solid #b4b4bb',
    borderRadius: '8px',
    padding: '10px 12px',
    background: '#ffffff',
    fontSize: '12px',
    lineHeight: 1.35,
    minWidth: '120px',
    textAlign: 'center',
  };
  const accent: React.CSSProperties = { ...node, background: '#f2f8fd', border: '1px solid #0972d3', color: '#033160' };
  const load: React.CSSProperties = { ...node, background: '#fdf3ec', border: '1px solid #ec7211', color: '#7c4516' };
  const arrow: React.CSSProperties = { fontSize: '18px', color: '#5f6b7a', alignSelf: 'center' };
  const label: React.CSSProperties = { fontSize: '11px', color: '#5f6b7a', textAlign: 'center', marginTop: '2px' };

  return (
    <div
      style={{
        border: '1px solid #e9ebed',
        borderRadius: '12px',
        padding: '16px',
        overflowX: 'auto',
        background: '#fafafa',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', minWidth: '720px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={load}>
            <div style={{ fontWeight: 700 }}>GuideLLM / inference-perf</div>
            <div>load generator</div>
          </div>
          <div style={label}>synthetic requests</div>
        </div>

        <div style={arrow}>&rarr;</div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={accent}>
            <div style={{ fontWeight: 700 }}>vLLM server</div>
            <div>EngineCore + API</div>
            <div style={{ marginTop: '4px' }}>
              <code>GET /metrics</code>
            </div>
          </div>
          <div style={label}>
            <code>vllm:</code> gauges, counters, histograms
          </div>
        </div>

        <div style={arrow}>&rarr;</div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={node}>
            <div style={{ fontWeight: 700 }}>Prometheus</div>
            <div>scrapes /metrics</div>
            <div>stores time series</div>
          </div>
          <div style={label}>periodic scrape</div>
        </div>

        <div style={arrow}>&rarr;</div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={node}>
            <div style={{ fontWeight: 700 }}>Grafana</div>
            <div>dashboards</div>
            <div>alerts on SLOs</div>
          </div>
          <div style={label}>operator view</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginTop: '14px',
          minWidth: '720px',
          fontSize: '11px',
          color: '#5f6b7a',
        }}
      >
        <div style={{ ...node, background: '#f3f0fb', border: '1px solid #6b4fbb', color: '#3b2a6b', minWidth: '180px' }}>
          <div style={{ fontWeight: 700 }}>OpenTelemetry (optional)</div>
          <div>
            <code>--otlp-traces-endpoint</code> &rarr; OTLP collector &rarr; Jaeger
          </div>
        </div>
        <div style={{ alignSelf: 'center' }}>
          per-request spans, off by default; <code>--collect-detailed-traces</code> adds module-level
          spans (perf cost)
        </div>
      </div>
    </div>
  );
}

interface MetricRow {
  metric: string;
  type: string;
  tells: string;
  action: string;
}

const METRIC_ROWS: MetricRow[] = [
  {
    metric: 'vllm:time_to_first_token_seconds',
    type: 'Histogram',
    tells: 'TTFT — prefill responsiveness. Spikes mean queueing or large/uncached prompts.',
    action:
      'Watch p99 against your section-2 TTFT SLO. If high while the GPU is idle, the queue is starving — check num_requests_waiting and admission.',
  },
  {
    metric: 'vllm:inter_token_latency_seconds',
    type: 'Histogram',
    tells: 'ITL, a.k.a. Time Per Output Token (TPOT) — decode smoothness as the user perceives it.',
    action:
      'Rising ITL with a full batch means decode contention. Trade batch size / max-num-seqs for tail latency, or scale out.',
  },
  {
    metric: 'vllm:e2e_request_latency_seconds',
    type: 'Histogram',
    tells: 'End-to-end latency = queue + prefill + decode. The number your callers actually feel.',
    action:
      'Decompose with request_queue_time_seconds: if queue dominates you are under-provisioned; if decode dominates you are output-bound.',
  },
  {
    metric: 'vllm:request_queue_time_seconds',
    type: 'Histogram',
    tells: 'Time a request waited before the scheduler admitted it. A pure backlog signal.',
    action:
      'Non-trivial queue time = add replicas or raise throughput. This is the cleanest under-capacity indicator.',
  },
  {
    metric: 'vllm:num_requests_running',
    type: 'Gauge',
    tells: 'Requests in the running batch this step (the section-4 scheduler decision).',
    action:
      'Compare to max-num-seqs. Pinned at the cap with queue time growing = saturated; chronically low = wasted capacity.',
  },
  {
    metric: 'vllm:num_requests_waiting',
    type: 'Gauge',
    tells: 'Requests queued, not yet admitted. The depth of the section-4 waiting queue.',
    action:
      'Persistently above zero is the textbook scale-out trigger. Pair with TTFT to confirm queueing is hurting users.',
  },
  {
    metric: 'vllm:kv_cache_usage_perc',
    type: 'Gauge',
    tells: 'Fraction (0–1) of KV-cache blocks in use. The memory pressure that drives preemption.',
    action:
      'Sustained near 1.0 precedes preemptions and throughput collapse. Cut max-num-seqs, shorten max-model-len, or add GPUs.',
  },
  {
    metric: 'vllm:num_preemptions',
    type: 'Counter',
    tells: 'Requests preempted (KV evicted, recomputed later) because the cache ran out — the section-4 failure mode.',
    action:
      'Any sustained rate means you over-subscribed memory. Lower concurrency or leave gpu-memory-utilization headroom. Recompute is wasted work.',
  },
  {
    metric: 'vllm:prefix_cache_queries / vllm:prefix_cache_hits',
    type: 'Counter',
    tells: 'Automatic prefix-cache lookups vs hits. The ratio is how much shared prefill you reuse.',
    action:
      'Low hit rate on shared-system-prompt traffic = a routing problem; pin similar requests to the same replica to lift reuse.',
  },
  {
    metric: 'vllm:prompt_tokens / vllm:generation_tokens',
    type: 'Counter',
    tells: 'Cumulative prompt and generated tokens (Prometheus exposes them as *_total). rate() gives input/output throughput.',
    action:
      'Track output-token/s as your true throughput SLI; correlate against ITL to find the throughput-vs-latency knee for capacity planning.',
  },
];

export function ObservabilityBench() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="How to measure a vLLM deployment, and how to watch it once it is live.">
            20. Observability &amp; Benchmarking
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> an LLM server is a queueing system feeding a GPU. The SLOs
            that matter to callers &mdash; TTFT, ITL, end-to-end latency, and throughput (defined in{' '}
            <strong>section 2</strong>) &mdash; are emergent properties of scheduler decisions (
            <strong>section 4</strong>): how many requests run per step, how deep the waiting queue
            is, how full the KV cache is, and how often requests get preempted. You cannot tune what
            you cannot see, and you cannot promise an SLO you have never measured.
          </Box>
          <Box variant="p">
            <strong>The answer is two disciplines.</strong> <strong>Observability</strong> watches a
            live deployment: vLLM exports Prometheus metrics natively, you scrape them, and you alert
            on the section-2 SLOs using the section-4 internals as the leading indicators.{' '}
            <strong>Benchmarking</strong> establishes the curve before you commit to an SLO: drive
            synthetic load at increasing rates until latency breaks, and read off the
            throughput-at-acceptable-latency your hardware can actually sustain.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The telemetry pipeline</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes Prometheus metrics at <code>/metrics</code> on the API server, enabled by
            default, every series prefixed with <code>vllm:</code>. Prometheus scrapes that endpoint
            on an interval; Grafana renders dashboards and fires alerts. A load generator (GuideLLM
            or inference-perf) sits on the left during a benchmark, driving the same server whose
            metrics you are watching &mdash; so a benchmark run and the live dashboard read from one
            source of truth.
          </Box>
          <MetricsPipelineDiagram />
          <Box variant="p">
            vLLM ships a runnable example of exactly this stack &mdash; a{' '}
            <code>docker-compose.yaml</code>, a <code>prometheus.yaml</code> whose scrape job targets
            the vLLM server on port 8000, and a pre-built <code>grafana.json</code> dashboard &mdash;
            under{' '}
            <Link
              external
              href="https://github.com/vllm-project/vllm/tree/main/examples/observability/prometheus_grafana"
              ariaLabel={`vLLM Prometheus and Grafana example, ${ACCESSED}`}
            >
              examples/observability/prometheus_grafana ({ACCESSED})
            </Link>
            .
          </Box>
          <Alert type="info">
            Metric names move. vLLM iterates roughly bi-weekly and renamed several series in the V1
            engine (the legacy <code>vllm:num_requests_swapped</code> and the old CPU-cache gauges are
            gone). Every name in this section is pinned to the V1 metrics design doc and the engine
            source as accessed on 2026-06-07 &mdash; re-confirm against{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/design/metrics/"
              ariaLabel={`vLLM metrics design document, ${ACCESSED}`}
            >
              the metrics design doc ({ACCESSED})
            </Link>{' '}
            for the version you actually run.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Metric → what it tells you → what to do. Names verified against the V1 engine source."
          >
            The metrics an operator watches
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              {
                id: 'metric',
                header: 'Metric',
                cell: (e: MetricRow) => <code>{e.metric}</code>,
                width: 280,
              },
              {
                id: 'type',
                header: 'Type',
                cell: (e: MetricRow) => e.type,
                width: 110,
              },
              {
                id: 'tells',
                header: 'What it tells you',
                cell: (e: MetricRow) => e.tells,
              },
              {
                id: 'action',
                header: 'What to do',
                cell: (e: MetricRow) => e.action,
              },
            ]}
            items={METRIC_ROWS}
            sortingDisabled
            wrapLines
            ariaLabels={{
              tableLabel: 'vLLM Prometheus metrics, what each tells you, and how to act',
            }}
          />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">SLO metrics (section 2)</Box>
              <Box variant="p">
                <code>time_to_first_token_seconds</code>, <code>inter_token_latency_seconds</code>,
                and <code>e2e_request_latency_seconds</code> are histograms &mdash; alert on
                quantiles (p95/p99), never the mean. These map one-to-one onto the TTFT / ITL /
                latency SLOs from section 2. ITL is the same quantity the docs also call TPOT (Time
                Per Output Token); vLLM&apos;s canonical series is{' '}
                <code>inter_token_latency_seconds</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Scheduler internals (section 4)</Box>
              <Box variant="p">
                <code>num_requests_running</code>, <code>num_requests_waiting</code>,{' '}
                <code>kv_cache_usage_perc</code>, and <code>num_preemptions</code> are the leading
                indicators. They move <em>before</em> the SLO histograms do &mdash; a rising waiting
                queue or KV usage near 1.0 is your early warning that latency is about to break.
              </Box>
            </div>
            <div>
              <Box variant="h3">Throughput &amp; reuse</Box>
              <Box variant="p">
                <code>rate(vllm:generation_tokens_total)</code> is your real output-throughput SLI.{' '}
                <code>prefix_cache_hits / prefix_cache_queries</code> shows how much prefill you save
                via automatic prefix caching (section 6) &mdash; a number routing decisions directly
                move.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            Counters are exported with a <code>_total</code> suffix at exposition time: the source
            declares <code>vllm:generation_tokens</code> but you query{' '}
            <code>vllm:generation_tokens_total</code> in PromQL. Always wrap counters in{' '}
            <code>rate()</code> &mdash; the raw counter is monotonic and meaningless on its own.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Distributed tracing with OpenTelemetry</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Metrics tell you the aggregate is unhealthy; tracing tells you <em>which request</em> and{' '}
            <em>which phase</em>. vLLM can emit OpenTelemetry spans per request &mdash; queue time,
            prefill, decode &mdash; to an OTLP collector (then Jaeger/Tempo for the UI). It is off by
            default; you opt in by pointing the server at a collector:
          </Box>
          <Box variant="code">
            vllm serve MODEL --otlp-traces-endpoint=&quot;grpc://collector:4317&quot;
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">When to reach for it</Box>
              <Box variant="p">
                Use it to debug tail latency you cannot explain from histograms alone &mdash; a
                single request stuck in the queue, or an outlier prompt blowing up prefill. The
                per-request spans decompose e2e latency into the same buckets the section-4 scheduler
                reasons about.
              </Box>
            </div>
            <div>
              <Box variant="h3">The performance cost</Box>
              <Box variant="p">
                Basic request spans are cheap; the granular module-level spans behind{' '}
                <code>--collect-detailed-traces=model|worker|all</code> are not, and the flag&apos;s
                own help warns it can hurt performance. Keep detailed tracing off in steady state;
                enable it on one replica during an investigation, then turn it back off.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Full setup (Jaeger + OTLP environment variables + the serve command) is in{' '}
            <Link
              external
              href="https://github.com/vllm-project/vllm/tree/main/examples/observability/opentelemetry"
              ariaLabel={`vLLM OpenTelemetry example, ${ACCESSED}`}
            >
              examples/observability/opentelemetry ({ACCESSED})
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Establish the throughput-vs-latency curve before you promise an SLO.">
            Benchmarking: finding the curve
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A single number (&quot;X tokens/sec&quot;) is meaningless without the latency it was
            achieved at. The job of a benchmark is to <strong>sweep the request rate</strong> and
            plot throughput against TTFT and ITL &mdash; the curve has a knee where adding load stops
            buying throughput and only adds latency. Your sustainable operating point sits just below
            that knee, and that is where your section-2 SLO numbers should come from.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">GuideLLM</Box>
              <Box variant="p">
                The vLLM-project benchmark tool. It drives an OpenAI-compatible or vLLM-native
                endpoint, and its <code>sweep</code> profile automatically explores request rates to
                trace the throughput/latency curve, reporting TTFT, ITL, and throughput
                distributions.
              </Box>
              <Box variant="p">
                <Link
                  external
                  href="https://github.com/vllm-project/guidellm"
                  ariaLabel={`GuideLLM repository, ${ACCESSED}`}
                >
                  vllm-project/guidellm ({ACCESSED})
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">In-repo benchmarks</Box>
              <Box variant="p">
                vLLM ships benchmark scripts under <code>benchmarks/</code> in the repo &mdash;
                latency, throughput, and serving harnesses used by the project&apos;s own CI. The
                fastest way to sanity-check a config change on one box, with no extra install.
              </Box>
              <Box variant="p">
                <Link
                  external
                  href="https://github.com/vllm-project/vllm/tree/main/benchmarks"
                  ariaLabel={`vLLM in-repo benchmarks directory, ${ACCESSED}`}
                >
                  vllm/benchmarks ({ACCESSED})
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">inference-perf</Box>
              <Box variant="p">
                A kubernetes-sigs tool for cluster-scale benchmarking. It supports vLLM and any
                OpenAI-compatible endpoint, runs multi-stage load (constant, Poisson, concurrent
                users) to find saturation, and reports goodput against SLOs &mdash; the right tool
                when you benchmark a fleet behind a router, not one replica.
              </Box>
              <Box variant="p">
                <Link
                  external
                  href="https://github.com/kubernetes-sigs/inference-perf"
                  ariaLabel={`inference-perf repository, ${ACCESSED}`}
                >
                  kubernetes-sigs/inference-perf ({ACCESSED})
                </Link>
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="A minimal benchmarking how-to">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>1. Fix the workload.</strong> Benchmark with prompt/output token counts that
                match production. A 256-in / 128-out chat workload and a 4k-in / 512-out RAG workload
                produce completely different curves on the same hardware, because one is
                prefill-bound and the other decode-bound (section 2).
              </Box>
              <Box variant="p">
                <strong>2. Sweep, do not point-test.</strong> Run a rate sweep so you see the whole
                curve, not one point. With GuideLLM:
              </Box>
              <Box variant="code">
                guidellm benchmark --target http://localhost:8000 --profile kind=sweep --data
                &quot;kind=synthetic_text,prompt_tokens=256,output_tokens=128&quot;
              </Box>
              <Box variant="p">
                <strong>3. Read the knee.</strong> Plot output-token throughput against p99 TTFT and
                p99 ITL. The sustainable operating point is the highest rate that still meets your
                section-2 SLOs &mdash; not the peak throughput number.
              </Box>
              <Box variant="p">
                <strong>4. Cross-check with live metrics.</strong> During the run, watch{' '}
                <code>vllm:num_requests_waiting</code> and <code>vllm:kv_cache_usage_perc</code>. The
                rate at which the queue starts growing and KV usage approaches 1.0 is the same knee
                the benchmark finds &mdash; two views of one saturation point.
              </Box>
              <Box variant="p">
                <strong>5. Re-run on every change.</strong> A quantization change, a{' '}
                <code>max-num-seqs</code> tweak, or a vLLM upgrade can move the curve. Treat the
                benchmark as a regression gate, not a one-time exercise.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info">
            Benchmark and dashboard close the loop: the benchmark finds the operating point offline,
            the Prometheus metrics confirm you are holding it online, and the section-4 internals (
            <code>num_requests_waiting</code>, <code>kv_cache_usage_perc</code>,{' '}
            <code>num_preemptions</code>) tell you the moment you drift off it.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
