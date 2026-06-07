import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

const ACCESSED = 'accessed 2026-06-07';

// Documentation anchors verified against docs.vllm.ai on 2026-06-07.
const DOCS = {
  v1: 'https://docs.vllm.ai/en/stable/usage/v1_guide/',
  optimization: 'https://docs.vllm.ai/en/latest/configuration/optimization/',
  conserveMemory: 'https://docs.vllm.ai/en/latest/serving/conserving_memory.html',
  troubleshooting: 'https://docs.vllm.ai/en/latest/usage/troubleshooting.html',
  quantization: 'https://docs.vllm.ai/en/latest/features/quantization/',
};

type Grounding = 'doc' | 'pattern';

interface FailureRow {
  id: string;
  area: string;
  grounding: Grounding;
  symptom: string;
  cause: JSX.Element;
  detection: JSX.Element;
  fix: JSX.Element;
}

const ROWS: FailureRow[] = [
  {
    id: 'preemption',
    area: 'Throughput cliff under KV exhaustion',
    grounding: 'doc',
    symptom:
      'Throughput collapses under load; tail latency spikes; the server logs a "preempted by PreemptionMode.RECOMPUTE" warning.',
    cause: (
      <Box variant="p">
        Too little KV-cache space for the in-flight batch. The scheduler (
        <strong>section 4</strong>) evicts a running sequence&apos;s KV and recomputes it later &mdash;
        in V1 there is no GPU&rarr;CPU swap, preemption is pure <em>recompute</em>, so the evicted
        prefill is thrown away and redone. The exact log line is{' '}
        <code>
          &quot;Sequence group ... is preempted by PreemptionMode.RECOMPUTE mode because there is not
          enough KV cache space. This can affect the end-to-end performance.&quot;
        </code>
      </Box>
    ),
    detection: (
      <Box variant="p">
        <code>vllm:num_preemptions</code> rising and <code>vllm:kv_cache_usage_perc</code> pinned near
        1.0 (<strong>section 20</strong>). The warning is emitted in the server log on the first
        preemption.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Give the KV cache more room: raise <code>gpu_memory_utilization</code>, add GPUs via{' '}
        <code>tensor_parallel_size</code> (shards weights, freeing HBM for KV), shorten{' '}
        <code>max_model_len</code>, or lower <code>max_num_seqs</code> so fewer requests compete for
        blocks (<strong>section 5</strong>).
      </Box>
    ),
  },
  {
    id: 'chunked-prefill',
    area: 'Chunked prefill misread as a memory fix',
    grounding: 'doc',
    symptom:
      'You enabled chunked prefill expecting KV pressure to drop, but preemptions and OOM-at-capacity persist.',
    cause: (
      <Box variant="p">
        Chunked prefill splits a long prompt&apos;s <em>prefill compute</em> across steps so it
        interleaves with decode &mdash; it does <strong>not</strong> shrink KV memory. A long request
        still reserves KV blocks for its full sequence. It is a latency/throughput-shaping knob, not a
        capacity knob. (Enabled by default in V1.)
      </Box>
    ),
    detection: (
      <Box variant="p">
        KV usage and <code>num_preemptions</code> unchanged after toggling chunked prefill; only the
        TTFT/ITL balance moves. Tune via <code>max_num_batched_tokens</code>.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Treat KV capacity separately from chunked prefill. Use the preemption levers above (memory,
        TP, <code>max_model_len</code>, <code>max_num_seqs</code>) for capacity; tune{' '}
        <code>max_num_batched_tokens</code> only for the TTFT-vs-ITL trade-off.
      </Box>
    ),
  },
  {
    id: 'cold-start',
    area: 'Cold-start latency on boot / scale-up',
    grounding: 'doc',
    symptom:
      'First-ready time is minutes, not seconds. A new replica added to absorb a spike is not serving when you need it; autoscaling lags demand.',
    cause: (
      <Box variant="p">
        Startup work that runs before the server is ready: weight load from disk, <code>torch.compile</code>{' '}
        optimization, and CUDA graph capture across batch sizes. The docs note vLLM &quot;heavily depends
        on <code>torch.compile</code>&quot; and that CUDA graph capture takes more memory in V1 than V0.
      </Box>
    ),
    detection: (
      <Box variant="p">
        Long gap between process start and the first successful <code>/health</code> / first served
        token; startup logs dominated by graph-capture and compile phases.
      </Box>
    ),
    fix: (
      <Box variant="p">
        For fast iteration use <code>--enforce-eager</code> to skip graph capture (faster boot, slower
        steady-state). For production keep graphs but warm them, persist the compile cache across
        restarts, and bake weights into the image / pull from a fast local volume so disk load is not
        on the cold path. Size the autoscaler&apos;s scale-up lead time to the measured boot time.
      </Box>
    ),
  },
  {
    id: 'oom-load',
    area: 'OOM at model load / first capture',
    grounding: 'doc',
    symptom:
      'CUDA out-of-memory during startup &mdash; either while loading weights or right as CUDA graphs are captured, before the server accepts traffic.',
    cause: (
      <Box variant="p">
        The static footprint (weights + activations + CUDA graph pool) plus the KV pre-allocation does
        not fit. <code>gpu_memory_utilization</code> set too high leaves no slack for the graph pool;
        graph capture in V1 needs <em>more</em> memory than V0, so a config that booted on an older
        release can OOM after an upgrade.
      </Box>
    ),
    detection: (
      <Box variant="p">
        OOM stack trace at load or capture time (not under serving load). Crashes around{' '}
        <code>self.graph.replay()</code> point at a CUDAGraph problem, per the troubleshooting guide.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Lower <code>gpu_memory_utilization</code> to leave headroom for the graph pool; shrink the pool
        with <code>cudagraph_capture_sizes</code>; cut <code>max_model_len</code> /{' '}
        <code>max_num_seqs</code>; shard with <code>tensor_parallel_size</code>; or quantize. To isolate
        a pure load failure, boot with <code>--load-format dummy</code> to skip reading weights.
      </Box>
    ),
  },
  {
    id: 'quant-hw',
    area: 'Quantization scheme unsupported on the GPU',
    grounding: 'pattern',
    symptom:
      'A quantized model that runs on one GPU generation fails to load, refuses the kernel, or silently falls back on another.',
    cause: (
      <Box variant="p">
        Quantization support is gated by GPU compute capability, not just the method. The vLLM matrix
        maps each scheme to architectures by SM version (Volta 7.0 &hellip; Hopper 9.0) with an explicit
        per-method minimum compute capability (<strong>section 8</strong>). A scheme valid on Hopper may
        not be valid on a different architecture.
      </Box>
    ),
    detection: (
      <Box variant="p">
        Load-time error naming the quant method / kernel, or a compute-capability check failing at
        startup &mdash; reproducible per GPU type, independent of load.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Before deploying, check your exact GPU&apos;s compute capability against the support matrix and
        pick a scheme it supports (e.g. an FP8 path where an INT8 W8A8 path is not listed for that
        architecture). Pin the quant scheme per hardware tier rather than assuming portability across
        generations.
      </Box>
    ),
  },
  {
    id: 'lora-dynamic',
    area: 'Dynamic LoRA load/unload in production',
    grounding: 'doc',
    symptom:
      'Adapters added at runtime behave inconsistently across replicas; an untrusted runtime load path is a security exposure.',
    cause: (
      <Box variant="p">
        <code>POST /v1/load_lora_adapter</code> is gated behind{' '}
        <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING=True</code> and the docs warn it &quot;should not be used
        in production&quot; outside a trusted boundary. A runtime load lands only on the replica that
        served it &mdash; it does not propagate to siblings (<strong>section 13</strong>).
      </Box>
    ),
    detection: (
      <Box variant="p">
        Same adapter present on one replica, missing on another; intermittent &quot;adapter not
        found&quot; behind a load balancer; the env flag enabled on a user-facing endpoint.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Use <strong>static registration</strong> (<code>--lora-modules</code>) and treat the adapter
        set as part of the deployment artifact. Reserve <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code>{' '}
        for isolated, fully-trusted lanes &mdash; never expose <code>load_lora_adapter</code> to
        untrusted callers (<strong>section 13</strong>).
      </Box>
    ),
  },
  {
    id: 'client-disconnect',
    area: 'Client disconnect / cancellation',
    grounding: 'pattern',
    symptom:
      'GPU keeps generating for requests whose clients already hung up &mdash; wasted decode, inflated cost, KV blocks held by dead requests during a spike.',
    cause: (
      <Box variant="p">
        A streaming caller (browser tab closed, gateway timeout, cancelled agent step) drops the
        connection mid-generation. The OpenAI-compatible server (<strong>section 12</strong>) must
        observe the disconnect and abort the in-flight request so the scheduler frees its slot.
      </Box>
    ),
    detection: (
      <Box variant="p">
        Generation tokens billed/produced with no corresponding completed response; running-request
        count higher than active clients; KV pressure that does not subside after callers leave.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Set sane server- and gateway-side request timeouts so abandoned requests are bounded; cap{' '}
        <code>max_tokens</code> per request; and front the engine with a gateway (
        <strong>section 19</strong>) that enforces timeouts and rate limits rather than relying on every
        client to disconnect cleanly. <em>(General operational pattern &mdash; confirm cancellation
        behavior against the version you run.)</em>
      </Box>
    ),
  },
  {
    id: 'litellm-cve',
    area: 'Gateway-tier supply-chain risk (LiteLLM)',
    grounding: 'pattern',
    symptom:
      'A compromised gateway dependency in front of vLLM, not a fault in the engine itself &mdash; e.g. a malicious package version at the proxy tier.',
    cause: (
      <Box variant="p">
        <Badge color="grey">Tier-3</Badge> The gateway is its own attack surface. A reported LiteLLM
        PyPI supply-chain compromise (<strong>section 19</strong>) is a property of the gateway&apos;s
        dependency chain &mdash; infer nothing about vLLM&apos;s posture from it. The lesson is that
        everything you bolt in front of the engine widens the blast radius.
      </Box>
    ),
    detection: (
      <Box variant="p">
        Vendor / third-party security advisories for the gateway; unexpected egress from the proxy
        process; dependency versions outside your pinned, vetted set.
      </Box>
    ),
    fix: (
      <Box variant="p">
        Pin and verify gateway dependency versions, scan the proxy supply chain, isolate the gateway
        from secrets it does not need, and patch on advisory. Keep engine and gateway threat models
        separate (<strong>section 19</strong>).
      </Box>
    ),
  },
];

const GOLDEN_SIGNALS = [
  {
    name: 'Request queue depth',
    metric: 'vllm:num_requests_waiting',
    rule: 'Sustained above zero with TTFT rising = under-capacity. The cleanest scale-out trigger.',
  },
  {
    name: 'KV-cache pressure',
    metric: 'vllm:kv_cache_usage_perc',
    rule: 'Sustained near 1.0 precedes preemption and the throughput cliff. Alarm before it pins.',
  },
  {
    name: 'Preemption rate',
    metric: 'rate(vllm:num_preemptions_total)',
    rule: 'Any sustained rate = you over-subscribed memory. Recompute is wasted work; page on a non-zero trend.',
  },
  {
    name: 'TTFT (p99)',
    metric: 'vllm:time_to_first_token_seconds',
    rule: 'Alarm on the p99 quantile against the section-2 SLO, never the mean.',
  },
  {
    name: 'ITL / TPOT (p99)',
    metric: 'vllm:inter_token_latency_seconds',
    rule: 'Rising with a full batch = decode contention. Trade batch size for tail latency or scale out.',
  },
  {
    name: 'Output throughput',
    metric: 'rate(vllm:generation_tokens_total)',
    rule: 'Your true throughput SLI. A drop while queue grows is the saturation knee from section 20.',
  },
];

export function OperationsFailureModes() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The operational gotchas an SRE or architect hits running vLLM in production — and how to catch each one before it pages you."
          >
            27. Operations &amp; Failure Modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> a vLLM deployment fails in a small number of recurring,
            recognizable ways &mdash; and almost all of them trace back to the same root cause: the KV
            cache is a fixed budget (<strong>section 5</strong>) and the scheduler (
            <strong>section 4</strong>) is a queueing system rationing it. When demand outruns that
            budget you do not get a clean error; you get a throughput cliff, a tail-latency spike, or a
            cold replica that arrives too late to help. The job of this section is to turn those vague
            symptoms into a lookup table.
          </Box>
          <Box variant="p">
            <strong>The frame:</strong> every row below is{' '}
            <strong>SYMPTOM &rarr; CAUSE &rarr; DETECTION &rarr; FIX</strong>. Detection is always a
            metric from <strong>section 20</strong> or a specific log line &mdash; if you cannot detect
            it, you cannot alarm on it, and you will learn about it from a customer instead of a
            dashboard. Each row is tagged{' '}
            <Badge color="blue">doc-cited</Badge> when it maps to a documented limitation, or{' '}
            <Badge color="grey">pattern</Badge> when it is a general operational pattern rather than a
            single doc claim.
          </Box>
          <Alert type="info">
            vLLM iterates roughly bi-weekly: flag defaults, metric names, and the V1 engine&apos;s
            behavior move. Every doc-cited row here is pinned to docs.vllm.ai as accessed 2026-06-07;
            re-confirm against the version you actually run before treating any fix as gospel.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The centerpiece: each production failure mode as Symptom → Cause → Detection → Fix."
          >
            Failure-mode lookup table
          </Header>
        }
      >
        <Table
          variant="embedded"
          columnDefinitions={[
            {
              id: 'area',
              header: 'Failure mode',
              cell: (e: FailureRow) => (
                <SpaceBetween size="xs">
                  <strong>{e.area}</strong>
                  <Badge color={e.grounding === 'doc' ? 'blue' : 'grey'}>
                    {e.grounding === 'doc' ? 'doc-cited' : 'pattern'}
                  </Badge>
                </SpaceBetween>
              ),
              width: 180,
            },
            {
              id: 'symptom',
              header: 'Symptom',
              cell: (e: FailureRow) => e.symptom,
              width: 240,
            },
            {
              id: 'cause',
              header: 'Cause',
              cell: (e: FailureRow) => e.cause,
            },
            {
              id: 'detection',
              header: 'Detection',
              cell: (e: FailureRow) => e.detection,
              width: 220,
            },
            {
              id: 'fix',
              header: 'Fix',
              cell: (e: FailureRow) => e.fix,
            },
          ]}
          items={ROWS}
          sortingDisabled
          wrapLines
          ariaLabels={{
            tableLabel: 'vLLM production failure modes: symptom, cause, detection, and fix',
          }}
        />
      </Container>

      <Container header={<Header variant="h2">Where each row comes from</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The <Badge color="blue">doc-cited</Badge> rows map to specific vLLM documentation; the{' '}
            <Badge color="grey">pattern</Badge> rows are general SRE practice the engine does not
            promise in a single line.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Doc-cited</Box>
              <ul>
                <li>
                  <strong>Preemption cliff &amp; KV levers</strong> &mdash; the{' '}
                  <code>PreemptionMode.RECOMPUTE</code> warning and the{' '}
                  <code>gpu_memory_utilization</code> / <code>tensor_parallel_size</code> /{' '}
                  <code>max_num_seqs</code> guidance are in the{' '}
                  <Link
                    external
                    href={DOCS.optimization}
                    ariaLabel={`vLLM optimization and tuning guide, ${ACCESSED}`}
                  >
                    optimization &amp; tuning guide ({ACCESSED})
                  </Link>
                  .
                </li>
                <li>
                  <strong>Recompute-only preemption &amp; chunked prefill default</strong> &mdash; the V1
                  engine no longer swaps KV to CPU on preemption, and chunked prefill is on by default,
                  per the{' '}
                  <Link
                    external
                    href={DOCS.v1}
                    ariaLabel={`vLLM V1 guide, ${ACCESSED}`}
                  >
                    V1 guide ({ACCESSED})
                  </Link>
                  , which also notes CUDA graph capture uses more memory in V1 than V0.
                </li>
                <li>
                  <strong>Cold start &amp; OOM at load</strong> &mdash; the{' '}
                  <code>enforce_eager</code> / <code>self.graph.replay()</code> CUDAGraph note and the{' '}
                  <code>--load-format dummy</code> isolation tip are in the{' '}
                  <Link
                    external
                    href={DOCS.troubleshooting}
                    ariaLabel={`vLLM troubleshooting guide, ${ACCESSED}`}
                  >
                    troubleshooting guide ({ACCESSED})
                  </Link>
                  ; the memory levers (<code>enforce_eager</code>,{' '}
                  <code>cudagraph_capture_sizes</code>, <code>max_model_len</code>) are in{' '}
                  <Link
                    external
                    href={DOCS.conserveMemory}
                    ariaLabel={`vLLM conserving memory guide, ${ACCESSED}`}
                  >
                    conserving memory ({ACCESSED})
                  </Link>
                  .
                </li>
                <li>
                  <strong>Dynamic LoRA caveat</strong> &mdash; cross-linked to{' '}
                  <strong>section 13</strong>, which quotes the &quot;should not be used in
                  production&quot; warning and the per-replica propagation gap.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Pattern (general practice)</Box>
              <ul>
                <li>
                  <strong>Quantization-vs-architecture</strong> &mdash; the support matrix is real and{' '}
                  architecture-gated by compute capability (
                  <Link
                    external
                    href={DOCS.quantization}
                    ariaLabel={`vLLM quantization support, ${ACCESSED}`}
                  >
                    quantization docs ({ACCESSED})
                  </Link>
                  ), but the specific &quot;scheme X is invalid on GPU Y&quot; mapping changes per
                  release. The matrix as accessed maps schemes up to Hopper (SM 9.0); verify the exact
                  cell for your GPU rather than assuming a particular Blackwell INT8/FP8 result.
                </li>
                <li>
                  <strong>Client disconnect / cancellation</strong> &mdash; the failure mode is real,
                  but precise abort-on-disconnect behavior is version-dependent and not pinned here to a
                  single doc line. Treated as a pattern; cross-linked to <strong>section 12</strong>.
                </li>
                <li>
                  <strong>Gateway supply-chain risk</strong> &mdash;{' '}
                  <Badge color="grey">Tier-3</Badge> security reporting about the gateway tier, not
                  the engine. Full advisory citations live in <strong>section 19</strong>; nothing here
                  implies anything about vLLM&apos;s own security posture.
                </li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Golden signals to alarm on</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            These are the few <strong>section 20</strong> metrics worth a pager. They are leading
            indicators: the scheduler internals (<strong>section 4</strong>) move{' '}
            <em>before</em> the SLO histograms break, so a KV/queue alarm gives you runway the latency
            alarm does not.
          </Box>
          <Table
            variant="embedded"
            columnDefinitions={[
              {
                id: 'name',
                header: 'Signal',
                cell: (e: (typeof GOLDEN_SIGNALS)[number]) => <strong>{e.name}</strong>,
                width: 180,
              },
              {
                id: 'metric',
                header: 'Metric / query',
                cell: (e: (typeof GOLDEN_SIGNALS)[number]) => <code>{e.metric}</code>,
                width: 280,
              },
              {
                id: 'rule',
                header: 'Alarm rule',
                cell: (e: (typeof GOLDEN_SIGNALS)[number]) => e.rule,
              },
            ]}
            items={GOLDEN_SIGNALS}
            sortingDisabled
            wrapLines
            ariaLabels={{ tableLabel: 'Golden signals to alarm on for a vLLM deployment' }}
          />
          <Alert type="info">
            Order of escalation: KV pressure and queue depth are your <em>early warnings</em>; the p99
            latency histograms are the <em>SLO breach</em>; the preemption counter is the{' '}
            <em>confirmation</em> that you crossed the capacity line. Alarm on the first, page on the
            second, post-mortem on the third.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Capacity planning: budgeting the KV-cache memory that decides everything"
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Nearly every row in the table is the same scarce resource showing a different face. So plan
            it explicitly. After weights, activations, and the CUDA graph pool are subtracted from HBM,
            what remains is the KV-cache budget &mdash; and that budget, divided by the per-request KV
            cost, is your real concurrency ceiling. Capacity planning is making that arithmetic visible
            instead of discovering it as a 2&nbsp;a.m. preemption storm.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The budget, top-down</Box>
              <ul>
                <li>
                  <strong>Total HBM</strong> per GPU is the ceiling.{' '}
                  <code>gpu_memory_utilization</code> caps how much vLLM pre-allocates &mdash; the rest
                  is slack the OS, the graph pool, and fragmentation need.
                </li>
                <li>
                  <strong>Subtract the static footprint:</strong> model weights (shrinkable via
                  quantization or <code>tensor_parallel_size</code>) plus the CUDA graph pool (
                  <code>cudagraph_capture_sizes</code>, or zero it with <code>enforce_eager</code>).
                </li>
                <li>
                  <strong>What is left is the KV budget.</strong> Sharding with{' '}
                  <code>tensor_parallel_size</code> frees per-GPU HBM for KV &mdash; the docs call this
                  out as a memory lever, not just a throughput one.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">The per-request cost, bottom-up</Box>
              <ul>
                <li>
                  A request reserves KV blocks for its full sequence length, up to{' '}
                  <code>max_model_len</code> &mdash; longer contexts cost proportionally more KV
                  (<strong>section 5</strong>).
                </li>
                <li>
                  <strong>Concurrency ceiling</strong> &asymp; KV budget &divide; average per-request KV
                  cost. Push past it and the scheduler preempts &mdash; the first row of the table.
                </li>
                <li>
                  Levers that buy concurrency: lower <code>max_model_len</code>, cap{' '}
                  <code>max_num_seqs</code>, quantize the KV cache, or offload (
                  <strong>section 7</strong>). Each trades something &mdash; reach, batch size, quality,
                  or latency.
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            Leave headroom on purpose. Running <code>gpu_memory_utilization</code> at the edge to win a
            benchmark is exactly the config that OOMs at graph capture after a vLLM upgrade (V1 capture
            needs more memory than V0) or preempts under a real traffic spike. Validate the budget with
            a section-20 benchmark sweep, then set the operating point <em>below</em> the knee, not on
            it.
          </Alert>
          <Box variant="p">
            Sources for the levers in this budget:{' '}
            <Link
              external
              href={DOCS.optimization}
              ariaLabel={`vLLM optimization and tuning guide, ${ACCESSED}`}
            >
              optimization &amp; tuning ({ACCESSED})
            </Link>
            ,{' '}
            <Link
              external
              href={DOCS.conserveMemory}
              ariaLabel={`vLLM conserving memory guide, ${ACCESSED}`}
            >
              conserving memory ({ACCESSED})
            </Link>
            , and the{' '}
            <Link external href={DOCS.v1} ariaLabel={`vLLM V1 guide, ${ACCESSED}`}>
              V1 guide ({ACCESSED})
            </Link>{' '}
            on V1 capture memory.
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
