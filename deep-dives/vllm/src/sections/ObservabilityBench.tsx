import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const LOGGERS = 'vllm/v1/metrics/loggers.py';
const METRICS_DOC = 'docs/design/metrics.md';
const VLLM_TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
/** External benchmark tools, pinned to the releases resolved on 2026-10-16. */
const GUIDELLM_README = 'https://github.com/vllm-project/guidellm/blob/v0.8.1/README.md';
const INFERENCE_PERF_README = 'https://github.com/kubernetes-sigs/inference-perf/blob/v0.7.0/README.md';

function MetricsPipelineDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 336"
        role="img"
        aria-labelledby="obs-pipeline-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="obs-pipeline-title">
          A load generator (vllm bench serve, the Rust vllm-bench client, GuideLLM or
          inference-perf) sends requests to the vLLM server, whose GET /metrics endpoint exposes
          every vllm: series. Prometheus scrapes that endpoint and Grafana draws dashboards and
          fires alerts from it, so the dashboard shows the server side of the run the benchmark
          times at the client. vllm bench serve also reads /metrics itself to report
          speculative-decoding acceptance.
          Optionally, --otlp-traces-endpoint sends per-request OpenTelemetry spans to an OTLP
          collector and on to Jaeger or Tempo.
        </title>
        <style>
          {`
            .obs-bg { fill: #ffffff; }
            .obs-load { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
            .obs-srv { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
            .obs-obs { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
            .obs-otel { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
            .obs-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .obs-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
            .obs-code { fill: #0972d3; font: 600 12px sans-serif; text-anchor: middle; }
            .obs-el { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .obs-el-s { fill: #6f4cc4; font: 11px sans-serif; text-anchor: start; }
            .obs-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#obs-ah); }
            .obs-back { stroke: #ec7211; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#obs-aho); }
            .obs-tr { stroke: #6f4cc4; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#obs-ahp); }
          `}
        </style>
        <defs>
          <marker id="obs-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="obs-aho" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#ec7211" />
          </marker>
          <marker id="obs-ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
        </defs>

        <rect className="obs-bg" x={0} y={0} width={900} height={336} rx={8} />

        {/* Load generator */}
        <rect className="obs-load" x={16} y={40} width={196} height={124} rx={8} />
        <text className="obs-t" x={114} y={66}>Load generator</text>
        <text className="obs-s" x={114} y={90}>vllm bench serve</text>
        <text className="obs-s" x={114} y={108}>vllm-bench (Rust client)</text>
        <text className="obs-s" x={114} y={126}>GuideLLM</text>
        <text className="obs-s" x={114} y={144}>inference-perf</text>

        {/* requests */}
        <path className="obs-arr" d="M212,84 L290,84" />
        <text className="obs-el" x={251} y={74}>requests</text>

        {/* vLLM server */}
        <rect className="obs-srv" x={292} y={40} width={204} height={124} rx={8} />
        <text className="obs-t" x={394} y={66}>vLLM server</text>
        <text className="obs-s" x={394} y={90}>API server + EngineCore</text>
        <text className="obs-code" x={394} y={114}>GET /metrics</text>
        <text className="obs-s" x={394} y={136}>vllm: and http_* series</text>

        {/* scrape */}
        <path className="obs-arr" d="M496,84 L554,84" />
        <text className="obs-el" x={525} y={74}>scrape</text>

        {/* Prometheus */}
        <rect className="obs-obs" x={556} y={40} width={150} height={124} rx={8} />
        <text className="obs-t" x={631} y={66}>Prometheus</text>
        <text className="obs-s" x={631} y={90}>scrapes /metrics</text>
        <text className="obs-s" x={631} y={108}>on an interval</text>
        <text className="obs-s" x={631} y={126}>stores time series</text>

        <path className="obs-arr" d="M706,84 L734,84" />

        {/* Grafana */}
        <rect className="obs-obs" x={736} y={40} width={148} height={124} rx={8} />
        <text className="obs-t" x={810} y={66}>Grafana</text>
        <text className="obs-s" x={810} y={90}>dashboards</text>
        <text className="obs-s" x={810} y={108}>alerts on SLOs</text>

        {/* vllm bench serve reads /metrics back */}
        <path className="obs-back" d="M330,164 L330,196 L114,196 L114,166" />
        <text className="obs-el" x={222} y={216}>vllm bench serve reads /metrics</text>
        <text className="obs-el" x={222} y={232}>for spec-decode acceptance</text>

        {/* optional tracing path */}
        <path className="obs-tr" d="M450,164 L450,290 L554,290" />
        <text className="obs-el-s" x={462} y={214}>--otlp-traces-endpoint</text>
        <text className="obs-el-s" x={462} y={230}>per-request spans, opt-in</text>

        <rect className="obs-otel" x={556} y={262} width={150} height={56} rx={8} />
        <text className="obs-t" x={631} y={286}>OTLP collector</text>
        <text className="obs-s" x={631} y={304}>receives spans</text>

        <path className="obs-tr" d="M706,290 L734,290" />

        <rect className="obs-otel" x={736} y={262} width={148} height={56} rx={8} />
        <text className="obs-t" x={810} y={286}>Jaeger / Tempo</text>
        <text className="obs-s" x={810} y={304}>trace UI</text>
      </svg>
    </div>
  );
}

interface MetricRow {
  metric: string;
  type: string;
  source: ReactNode;
  tells: string;
  action: string;
}

const METRIC_ROWS: MetricRow[] = [
  {
    metric: 'vllm:time_to_first_token_seconds',
    type: 'Histogram',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L821-L826')}>
        loggers.py L821-L826
      </Cite>
    ),
    tells: 'TTFT: prefill responsiveness. Spikes mean queueing or large, uncached prompts.',
    action:
      'Watch p99 against your section-2 TTFT SLO. If it is high while the GPU is idle, look upstream of the engine: check num_requests_waiting and admission.',
  },
  {
    metric: 'vllm:inter_token_latency_seconds',
    type: 'Histogram',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L831-L836')}>
        loggers.py L831-L836
      </Cite>
    ),
    tells:
      'ITL: the gap between consecutive streamed outputs, one sample per output. It approximates TPOT (time per output token) only when every output carries exactly one token.',
    action:
      'Rising ITL with a full batch means decode contention: trade max-num-seqs for tail latency, or scale out. With speculative decoding one output carries several tokens, so read TPOT from the next row.',
  },
  {
    metric: 'vllm:request_time_per_output_token_seconds',
    type: 'Histogram',
    source: (
      <>
        <Cite tier={1} href={vllmUrl(LOGGERS, 'L841-L846')}>
          loggers.py L841-L846
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl(METRICS_DOC, 'L68-L80')}>
          design/metrics.md L68-L80
        </Cite>
      </>
    ),
    tells:
      'TPOT, once per finished request: (e2e latency - TTFT) / (output tokens - 1). A request with at most one output token records zero.',
    action:
      'Put a TPOT SLO on this series. vllm bench serve leaves those one-token requests out of its TPOT statistics, so expect the histogram and a benchmark report to differ.',
  },
  {
    metric: 'vllm:e2e_request_latency_seconds',
    type: 'Histogram',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L851-L856')}>
        loggers.py L851-L856
      </Cite>
    ),
    tells: 'End-to-end latency = queue + prefill + decode. The number your callers actually feel.',
    action:
      'Decompose with request_queue_time_seconds: if queue dominates you are under-provisioned; if decode dominates you are output-bound.',
  },
  {
    metric: 'vllm:request_queue_time_seconds',
    type: 'Histogram',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L861-L866')}>
        loggers.py L861-L866
      </Cite>
    ),
    tells: 'Time a request spent in the WAITING phase before the scheduler ran it. A pure backlog signal.',
    action:
      'Non-trivial queue time means add replicas or raise throughput. This is the cleanest under-capacity indicator.',
  },
  {
    metric: 'vllm:num_requests_running',
    type: 'Gauge',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L508-L513')}>
        loggers.py L508-L513
      </Cite>
    ),
    tells: 'Requests in the running batch this step (the section-4 scheduler decision).',
    action:
      'Compare to max-num-seqs. Pinned at the cap with queue time growing means saturated; chronically low means wasted capacity.',
  },
  {
    metric: 'vllm:num_requests_waiting',
    type: 'Gauge',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L518-L523')}>
        loggers.py L518-L523
      </Cite>
    ),
    tells: 'Requests queued, not yet admitted. The depth of the section-4 waiting queue.',
    action:
      'Persistently above zero is the textbook scale-out trigger. Pair with TTFT to confirm queueing is hurting users, and split it with the next row.',
  },
  {
    metric: 'vllm:num_requests_waiting_by_reason',
    type: 'Gauge',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L528-L539')}>
        loggers.py L528-L539
      </Cite>
    ),
    tells:
      'The waiting count split by a reason label. capacity: waiting for scheduling capacity. deferred: held by a transient constraint such as the LoRA (low-rank adaptation) budget, a KV transfer or blocked status. The reasons sum to num_requests_waiting.',
    action:
      'Scale out on reason="capacity". A deferred backlog waits on an adapter slot, a KV transfer or a blocked request, so check those causes first.',
  },
  {
    metric: 'vllm:kv_cache_usage_perc',
    type: 'Gauge',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L576-L581')}>
        loggers.py L576-L581
      </Cite>
    ),
    tells: 'Fraction (0 to 1) of KV-cache blocks in use. The memory pressure that drives preemption.',
    action:
      'Sustained near 1.0 precedes preemptions and throughput collapse. Cut max-num-seqs, shorten max-model-len, or add GPUs.',
  },
  {
    metric: 'vllm:num_preemptions',
    type: 'Counter',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L676-L680')}>
        loggers.py L676-L680
      </Cite>
    ),
    tells:
      'Requests preempted because the KV cache ran out: their KV is freed and the prefill runs again later, the section-4 failure mode.',
    action:
      'Any sustained rate means the running batch outgrows the KV cache. Lower max-num-seqs, raise gpu-memory-utilization, or add GPUs (section 4 lists the levers). Every preemption repeats a prefill.',
  },
  {
    metric: 'vllm:request_num_preemptions',
    type: 'Histogram',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L901-L906')}>
        loggers.py L901-L906
      </Cite>
    ),
    tells:
      'How many times each finished request was preempted. Shows whether preemption hits many requests once or the same requests again and again.',
    action:
      'Requests in the high buckets paid for their prefill several times over, so expect them in the e2e latency tail.',
  },
  {
    metric: 'vllm:prefix_cache_queries / vllm:prefix_cache_hits',
    type: 'Counter',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L599-L614')}>
        loggers.py L599-L614
      </Cite>
    ),
    tells:
      'Automatic prefix-cache lookups and hits, both counted in tokens. hits / queries is the share of prompt tokens served from the GPU cache.',
    action:
      'Low hit rate on shared-system-prompt traffic is a routing problem: pin similar requests to the same replica to lift reuse (section 6).',
  },
  {
    metric: 'vllm:external_prefix_cache_queries / vllm:external_prefix_cache_hits',
    type: 'Counter',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L623-L642')}>
        loggers.py L623-L642
      </Cite>
    ),
    tells: 'The same pair for tokens a KV connector supplied, such as LMCache or the native offload tiers.',
    action:
      'Read it next to the GPU pair when offloading is on: a rising external hit rate should pull TTFT down on repeated prefixes (section 7).',
  },
  {
    metric: 'vllm:prompt_tokens / vllm:generation_tokens',
    type: 'Counter',
    source: (
      <Cite tier={1} href={vllmUrl(LOGGERS, 'L685-L723')}>
        loggers.py L685-L723
      </Cite>
    ),
    tells:
      'Cumulative prompt and generated tokens (Prometheus exposes them as *_total). rate() gives input and output throughput.',
    action:
      'Track output tokens/s as your throughput SLI (service level indicator); correlate it against ITL to find the throughput-vs-latency knee for capacity planning.',
  },
  {
    metric: 'vllm:kv_offload_cpu_cache_usage_perc / vllm:kv_offload_tiering_backpressure_stores_dropped',
    type: 'Gauge / Counter',
    source: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/cpu/spec.py', 'L52-L59')}>
          cpu/spec.py L52-L59
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/spec.py', 'L260-L267')}>
          tiering/spec.py L260-L267
        </Cite>
      </>
    ),
    tells:
      'Present only with KV offloading on. The share of the CPU tier pinned by in-flight transfers, and stores a secondary tier dropped under back-pressure (labelled by tier).',
    action:
      'Sustained high CPU-tier usage or a climbing drop count means the tier cannot keep up with the store rate. Section 7 covers the full offload series and how to size the tiers.',
  },
  {
    metric: 'vllm:spec_decode_num_accepted_tokens / vllm:spec_decode_num_drafts',
    type: 'Counter',
    source: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/v1/spec_decode/metrics.py', 'L177-L195')}>
          spec_decode/metrics.py L177-L195
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/observability.py', 'L48-L58')}>
          observability.py L48-L58
        </Cite>
      </>
    ),
    tells:
      'Present with speculative decoding on. Mean acceptance length across the server is 1 + rate(accepted tokens) / rate(drafts).',
    action:
      'For one request or one traffic class, --per-request-spec-decode-metrics summary adds metrics.speculative_decoding to each response body (experimental, n = 1 only). Section 11 reads both.',
  },
  {
    metric: 'vllm:tool_call_parser_invocations_total',
    type: 'Counter',
    source: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/parser/metrics.py', 'L15-L45')}>
          parser/metrics.py L15-L45
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/parser/metrics.py', 'L65-L108')}>
          L65-L108
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/app_state.py', 'L32-L37')}>
          app_state.py L32-L37
        </Cite>
      </>
    ),
    tells:
      'Registered only when --tool-call-parser is set. Counts parser calls by outcome (tool_call, no_tool_call), mode and request_type; non-streaming counts once per choice, streaming once per delta.',
    action:
      'Watch the tool_call share on mode="non_streaming" for traffic that sends tools. Parser failures count as no_tool_call, so a share that falls after a model or chat-template change can point at the parser setting.',
  },
];

export function ObservabilityBench() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Measure the load your hardware sustains before you promise an SLO, then watch the series that move before latency breaks."
          >
            20. Observability &amp; Benchmarking
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An LLM server is a queueing system feeding a GPU. The service level objectives (SLOs)
            callers care about (TTFT, time to first token; ITL, inter-token latency; end-to-end
            latency; and throughput, all defined in <strong>section 2</strong>) emerge from
            scheduler decisions in <strong>section 4</strong>: how many requests run per step, how
            deep the waiting queue is, how full the KV (key-value) cache is, and how often requests
            get preempted. Holding an SLO means seeing those internals, and knowing before launch
            where the latency curve bends.
          </Box>
          <Box variant="p">
            <strong>Two disciplines meet that challenge.</strong> <strong>Observability</strong>{' '}
            watches a live deployment: vLLM exports Prometheus metrics natively, you scrape them,
            and you alert on the section-2 SLOs with the section-4 internals as leading indicators.{' '}
            <strong>Benchmarking</strong> establishes the curve before you commit to an SLO: drive
            synthetic load at increasing rates until latency breaks, and read off the
            throughput-at-acceptable-latency your hardware can actually sustain.
          </Box>
          <Box variant="small" color="text-body-secondary">
            Metric names, flags and line references are read from vLLM v0.31.0 (commit db9527a4)
            on 2026-10-16. External tools are pinned to GuideLLM v0.8.1 and inference-perf v0.7.0.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Point the load generator and Prometheus at the same server, so the client-side benchmark report and the server-side dashboard describe one run."
          >
            The telemetry pipeline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM serves Prometheus metrics at <code>/metrics</code> on the API server, mounted by
            default: its own series, prefixed <code>vllm:</code>, next to the HTTP layer&apos;s{' '}
            <code>http_*</code> series{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/instrumentator/metrics.py', 'L64-L77')}>
              instrumentator/metrics.py L64-L77
            </Cite>
            . Prometheus scrapes that endpoint on an interval; Grafana renders dashboards and fires
            alerts. During a benchmark the load generator drives the same server whose metrics you
            are watching, so the dashboard shows the server side of the run the benchmark times
            at the client. <code>vllm bench serve</code> computes its latency statistics from its
            own request timings{' '}
            <Cite tier={1} href={vllmUrl('vllm/benchmarks/serve.py', 'L603-L633')}>
              benchmarks/serve.py L603-L633
            </Cite>
            , and reads <code>/metrics</code> before and after a run to report
            speculative-decoding acceptance rate and length from the difference{' '}
            <Cite tier={1} href={vllmUrl('vllm/benchmarks/serve.py', 'L1103-L1142')}>
              benchmarks/serve.py L1103-L1142
            </Cite>
            .
          </Box>
          <MetricsPipelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. The OpenTelemetry path over OTLP (OpenTelemetry Protocol) is
            optional and off by default; tracing is covered below.
          </Box>
          <Box variant="p">
            vLLM ships a runnable copy of this stack: a <code>docker-compose.yaml</code>, a{' '}
            <code>prometheus.yaml</code> whose scrape job targets the vLLM server on port 8000, and
            a pre-built <code>grafana.json</code> dashboard{' '}
            <Cite
              tier={1}
              href={vllmUrl('examples/observability/prometheus_grafana/prometheus.yaml', 'L6-L10')}
            >
              prometheus_grafana/prometheus.yaml L6-L10
            </Cite>{' '}
            <Cite tier={1} href={`${VLLM_TREE}/examples/observability/prometheus_grafana`}>
              examples/observability/prometheus_grafana
            </Cite>
            . Ready-made Grafana and Perses dashboards sit beside it{' '}
            <Cite tier={1} href={`${VLLM_TREE}/examples/observability/dashboards`}>
              examples/observability/dashboards
            </Cite>
            .
          </Box>
          <Alert type="warning" header="Match dashboard queries to the release you run">
            vLLM v0.31.0 emits <code>vllm:kv_cache_usage_perc</code> and{' '}
            <code>vllm:prefix_cache_hits</code> / <code>vllm:prefix_cache_queries</code>{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L576-L614')}>
              loggers.py L576-L614
            </Cite>
            . A search of the v0.31.0 code finds no <code>vllm:gpu_cache_usage_perc</code>,{' '}
            <code>vllm:gpu_prefix_cache_*</code>, <code>vllm:num_requests_swapped</code> or{' '}
            <code>vllm:cpu_cache_usage_perc</code>; the design doc lists the last two as legacy
            metrics of a swap mode V1 does not have{' '}
            <Cite tier={1} href={vllmUrl(METRICS_DOC, 'L518-L527')}>
              design/metrics.md L518-L527
            </Cite>
            . Dashboards and scrapers built for older releases still query these names;
            production-stack&apos;s router is one (<strong>section 16</strong>). A PromQL (Prometheus Query Language) query
            on a series the server does not emit returns no data rather than an error, so the panel
            simply goes blank. Check names against the metrics design doc for the version you
            run{' '}
            <Cite tier={1} href={vllmDocsUrl('design/metrics/')}>
              vLLM docs: Metrics design
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each series as v0.31.0 defines it, what it tells you, and what to change when it moves."
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
                cell: (e: MetricRow) => (
                  <SpaceBetween size="xxs">
                    <code>{e.metric}</code>
                    <span>{e.source}</span>
                  </SpaceBetween>
                ),
                width: 300,
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
                <code>time_to_first_token_seconds</code>, <code>inter_token_latency_seconds</code>,{' '}
                <code>request_time_per_output_token_seconds</code> and{' '}
                <code>e2e_request_latency_seconds</code> are histograms: alert on quantiles
                (p95/p99), never the mean. ITL is sampled once per streamed output and TPOT once per
                finished request. ITL approximates TPOT only when every output carries one token,
                and the two diverge under speculative decoding, where one output bundles several.
                Set a TPOT SLO on <code>request_time_per_output_token_seconds</code> and an ITL SLO
                on{' '}
                <code>inter_token_latency_seconds</code>{' '}
                <Cite tier={1} href={vllmUrl(METRICS_DOC, 'L53-L80')}>
                  design/metrics.md L53-L80
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Scheduler internals (section 4)</Box>
              <Box variant="p">
                <code>num_requests_running</code>, <code>num_requests_waiting</code> (split by{' '}
                <code>num_requests_waiting_by_reason</code>), <code>kv_cache_usage_perc</code> and{' '}
                <code>num_preemptions</code> are the leading indicators. They move <em>before</em>{' '}
                the SLO histograms do: a rising capacity-waiting count or KV usage near 1.0 warns
                that latency is about to break. With admission control on (
                <code>--max-num-queued-reqs</code>, <code>--max-num-queued-tokens</code>), a
                saturated replica answers HTTP 503 instead of growing the queue{' '}
                <Cite tier={1} href={vllmUrl('vllm/exceptions.py', 'L148-L175')}>
                  exceptions.py L148-L175
                </Cite>{' '}
                (<strong>section 12</strong>), and a
                search of the v0.31.0 tree finds no <code>vllm:</code> series that counts those
                rejections. On our reading they land in the HTTP layer&apos;s{' '}
                <code>http_requests_total</code>, whose status label is grouped as in{' '}
                <code>status=&quot;2xx&quot;</code>{' '}
                <Cite tier={1} href={vllmUrl(METRICS_DOC, 'L89-L90')}>
                  design/metrics.md L89-L90
                </Cite>
                , so watch <code>status=&quot;5xx&quot;</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Throughput &amp; reuse</Box>
              <Box variant="p">
                <code>rate(vllm:generation_tokens_total)</code> is your real output-throughput SLI.{' '}
                <code>prefix_cache_hits / prefix_cache_queries</code> shows how much prefill
                automatic prefix caching (section 6) saves, a number routing decisions move
                directly.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            Counters gain a <code>_total</code> suffix at exposition time: the source declares{' '}
            <code>vllm:generation_tokens</code> and you query{' '}
            <code>vllm:generation_tokens_total</code> in PromQL.{' '}
            <code>vllm:tool_call_parser_invocations_total</code> already ends in{' '}
            <code>_total</code> and is queried as written. Always wrap counters in{' '}
            <code>rate()</code>: the raw counter only ever climbs.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find which request, and which phase of it, a bad tail percentile comes from."
          >
            Distributed tracing with OpenTelemetry
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Metrics tell you the aggregate is unhealthy; tracing tells you <em>which request</em> and{' '}
            <em>which phase</em>. vLLM can emit an OpenTelemetry span per request carrying queue
            time, TTFT, prefill and decode time{' '}
            <Cite tier={1} href={vllmUrl('vllm/tracing/utils.py', 'L34-L44')}>
              tracing/utils.py L34-L44
            </Cite>{' '}
            to an OTLP collector, with Jaeger or Tempo as the UI. It is off by default; you opt in by
            pointing the server at a collector{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/observability.py', 'L36-L37')}>
              observability.py L36-L37
            </Cite>
            :
          </Box>
          <Box variant="code">
            vllm serve MODEL --otlp-traces-endpoint=&quot;grpc://collector:4317&quot;
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">When to reach for it</Box>
              <Box variant="p">
                Use it to debug tail latency you cannot explain from histograms alone: a single
                request stuck in the queue, or an outlier prompt blowing up prefill. The per-request
                spans decompose e2e latency into the same buckets the section-4 scheduler reasons
                about.
              </Box>
            </div>
            <div>
              <Box variant="h3">The performance cost</Box>
              <Box variant="p">
                The module-level spans behind <code>--collect-detailed-traces=model|worker|all</code>{' '}
                are the expensive part: the flag&apos;s help warns of &quot;possibly costly and or
                blocking operations&quot; that &quot;might have a performance impact&quot;{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/observability.py', 'L39-L46')}>
                  observability.py L39-L46
                </Cite>
                . Keep detailed tracing off in steady state; enable it on one replica during an
                investigation, then turn it back off.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Full setup (Jaeger, the OTLP environment variables and the serve command) is in{' '}
            <Cite tier={1} href={`${VLLM_TREE}/examples/observability/opentelemetry`}>
              examples/observability/opentelemetry
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the throughput your hardware sustains at your latency target before you promise an SLO."
          >
            Benchmarking: finding the curve
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A single number (&quot;X tokens/sec&quot;) is meaningless without the latency it was
            achieved at. The job of a benchmark is to <strong>sweep the request rate</strong> and
            plot throughput against TTFT and ITL. The curve has a knee where adding load stops
            buying throughput and only adds latency. Your sustainable operating point sits just below
            that knee, and that is where your section-2 SLO numbers should come from.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">vllm bench, in the CLI</Box>
              <Box variant="p">
                Ships with vLLM. <code>vllm bench serve</code> drives a running server;{' '}
                <code>latency</code> times a single batch, <code>throughput</code> measures offline
                inference, <code>startup</code> times model start-up, and{' '}
                <code>mm-processor</code> times multimodal preprocessing{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/benchmark/main.py', 'L38-L46')}>
                  cli/benchmark/main.py L38-L46
                </Cite>
                . <code>vllm bench sweep</code> repeats a server benchmark across parameter
                combinations; its <code>serve_workload</code> mode explores the latency-throughput
                trade-off across load levels, and <code>plot</code> / <code>plot_pareto</code> draw
                the results{' '}
                <Cite tier={1} href={vllmUrl('vllm/benchmarks/sweep/cli.py', 'L19-L25')}>
                  sweep/cli.py L19-L25
                </Cite>
                . The <code>bench</code> extra (<code>vllm[bench]</code>) adds the pandas,
                matplotlib and seaborn that the sweep and plot code imports{' '}
                <Cite tier={1} href={vllmUrl('setup.py', 'L1533')}>
                  setup.py L1533
                </Cite>
                . The top-level <code>benchmarks/</code> directory keeps kernel and feature-specific
                scripts; its <code>benchmark_serving.py</code> only prints a pointer to{' '}
                <code>vllm bench serve</code> and exits{' '}
                <Cite tier={1} href={vllmUrl('benchmarks/benchmark_serving.py', 'L1-L17')}>
                  benchmark_serving.py L1-L17
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">vllm-bench (Rust)</Box>
              <Box variant="p">
                A Rust load generator in the vLLM tree that its README presents as a drop-in
                replacement for <code>vllm bench serve</code>, with matching JSON output and
                steady-state metrics that exclude ramp-up and drain. The README claims about 7 ms
                startup and under 100 MB of memory at 1400+ concurrency, a project claim we have
                not measured{' '}
                <Cite tier={2} href={vllmUrl('rust/src/bench/README.md', 'L3-L20')}>
                  rust/src/bench/README.md L3-L20 (project claim)
                </Cite>
                . <code>VLLM_USE_RUST_BENCH=1</code> makes <code>vllm bench serve</code> hand its
                arguments to the <code>vllm-rs</code> binary, and the command fails if that binary
                cannot be found{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/benchmark/main.py', 'L23-L35')}>
                  cli/benchmark/main.py L23-L35
                </Cite>
                . Our reading: reach for it when the Python client would be the bottleneck of a
                high-concurrency run.
              </Box>
            </div>
            <div>
              <Box variant="h3">GuideLLM</Box>
              <Box variant="p">
                A vllm-project benchmark platform for OpenAI-compatible and vLLM-native servers{' '}
                <Cite tier={1} href={`${GUIDELLM_README}#L23`}>
                  guidellm v0.8.1 README L23
                </Cite>
                . Its <code>sweep</code> profile explores request rates to trace the
                throughput/latency curve, next to <code>synchronous</code>,{' '}
                <code>concurrent</code>, <code>throughput</code>, <code>constant</code> and{' '}
                <code>poisson</code>, and it reports full TTFT, ITL and end-to-end distributions{' '}
                <Cite tier={1} href={`${GUIDELLM_README}#L29`}>
                  README L29
                </Cite>{' '}
                <Cite tier={1} href={`${GUIDELLM_README}#L176`}>
                  README L176
                </Cite>
                . In v0.8.1 the CLI entry point is <code>guidellm run</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">inference-perf</Box>
              <Box variant="p">
                A kubernetes-sigs tool for production-scale benchmarking. It lists verified support for
                vLLM, SGLang and TGI (Text Generation Inference) and extends to any
                OpenAI-compatible endpoint, runs multi-stage load (constant rate, Poisson arrival,
                concurrent users) to find saturation points, and measures goodput, the rate of
                requests meeting your SLO constraints{' '}
                <Cite tier={1} href={`${INFERENCE_PERF_README}#L29-L49`}>
                  inference-perf v0.7.0 README L29-L49
                </Cite>
                . Our reading: it fits a fleet behind a router better than a single replica.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="A minimal benchmarking how-to">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>1. Fix the workload.</strong> Benchmark with prompt and output token counts
                that match production. A 256-in / 128-out chat workload and a 4k-in / 512-out RAG
                (retrieval-augmented generation) workload produce completely different curves on the
                same hardware, because their prefill-to-decode balance differs (section 2).
              </Box>
              <Box variant="p">
                <strong>2. Sweep, do not point-test.</strong> Run a rate sweep so you see the whole
                curve, not one point. With GuideLLM v0.8.1{' '}
                <Cite tier={1} href={`${GUIDELLM_README}#L131-L136`}>
                  README L131-L136
                </Cite>
                :
              </Box>
              <Box variant="code">
                guidellm run --backend kind=openai_http,target=http://localhost:8000 --profile
                kind=sweep --constraint kind=max_duration,seconds=30 --data
                kind=synthetic_text,prompt_tokens=256,output_tokens=128
              </Box>
              <Box variant="p">
                In-tree, <code>vllm bench sweep serve_workload</code> covers the same step once the{' '}
                <code>bench</code> extra is installed.
              </Box>
              <Box variant="p">
                <strong>3. Read the knee.</strong> Plot output-token throughput against p99 TTFT and
                p99 ITL (or TPOT, if that is your SLO). The sustainable operating point is the
                highest rate that still meets your section-2 SLOs, not the peak throughput number.
              </Box>
              <Box variant="p">
                <strong>4. Cross-check with live metrics.</strong> During the run, watch{' '}
                <code>{'vllm:num_requests_waiting_by_reason{reason="capacity"}'}</code> and{' '}
                <code>vllm:kv_cache_usage_perc</code>. The rate at which the queue starts growing and
                KV usage approaches 1.0 is the same knee the benchmark finds: two views of one
                saturation point.
              </Box>
              <Box variant="p">
                <strong>5. Re-run on every change.</strong> A quantization change, a{' '}
                <code>max-num-seqs</code> tweak, or a vLLM upgrade can move the curve. Treat the
                benchmark as a regression gate, not a one-time exercise.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info">
            Close the loop: let the benchmark find the operating point offline, alert on the section-2
            histograms online, and treat the section-4 internals (
            <code>num_requests_waiting_by_reason</code> with <code>reason=&quot;capacity&quot;</code>,{' '}
            <code>kv_cache_usage_perc</code>, <code>num_preemptions</code>) as the signal that you
            are drifting off it.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
