import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface PhaseRow {
  phase: string;
  bound: string;
  metric: string;
  scaling: string;
  tuning: string;
}

const phaseRows: PhaseRow[] = [
  {
    phase: 'Prefill',
    bound: 'Compute-bound (FLOPs)',
    metric: 'TTFT (time-to-first-token)',
    scaling: 'Scale with batch size / large prompts; one big parallel pass over the prompt',
    tuning: 'Favor tensor parallel + high compute density; tolerate larger batches',
  },
  {
    phase: 'Decode',
    bound: 'Memory-bandwidth-bound (HBM reads)',
    metric: 'ITL (inter-token latency)',
    scaling: 'Scale with concurrent sequences; one token per step per sequence',
    tuning: 'Favor more replicas / KV capacity; keep batches latency-tight',
  },
];

interface DecisionRow {
  signal: string;
  verdict: string;
  why: string;
}

const decisionRows: DecisionRow[] = [
  {
    signal: 'Strict, separately-negotiated TTFT and ITL SLOs',
    verdict: 'Use it',
    why: 'Physical isolation means a prefill burst cannot blow the decode ITL budget, and vice versa.',
  },
  {
    signal: 'Large prefill:decode imbalance (long prompts, short answers, or the reverse)',
    verdict: 'Use it',
    why: 'Each pool sizes to its own load instead of one engine sized for the worse of the two.',
  },
  {
    signal: 'You need each phase tuned with a different parallel strategy',
    verdict: 'Use it',
    why: 'Prefill and decode can run different TP/PP layouts because they are different processes.',
  },
  {
    signal: 'Goal is raw tokens/sec or cost-per-token',
    verdict: 'Do NOT use it',
    why: 'The docs are explicit: it does not improve throughput. You pay a KV-transfer tax for isolation.',
  },
  {
    signal: 'Single SLO, balanced prompt/response, one pool already meets it',
    verdict: 'Do NOT use it',
    why: 'Chunked prefill in a unified engine is simpler and avoids the cross-instance copy entirely.',
  },
  {
    signal: 'No fast RDMA fabric between the pools',
    verdict: 'Do NOT use it',
    why: 'KV transfer over a slow link can cost more than the prefill stall it was meant to avoid.',
  },
];

function DisaggDiagram() {
  return (
    <svg
      viewBox="0 0 820 380"
      role="img"
      aria-labelledby="disagg-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="disagg-title">
        Disaggregated prefill and decode: a prefiller pool computes the prompt KV cache, a KV
        connector transfers it over an RDMA fabric, and a decoder pool generates tokens from
        the received KV
      </title>
      <style>
        {`
          .pool { stroke-width: 1.5; }
          .prefill { fill: #0972d3; stroke: #065299; }
          .decode { fill: #2ea597; stroke: #1f7a70; }
          .xfer { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .xt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .xs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .lbl { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#ah); }
        `}
      </style>
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>

      {/* request in */}
      <text className="lbl" x={410} y={24}>Request: prompt in, tokens out</text>

      {/* Prefiller pool */}
      <rect className="pool prefill" x={30} y={70} width={220} height={130} rx={8} />
      <text className="tt" x={140} y={100}>Prefiller pool</text>
      <text className="ts" x={140} y={122}>compute-bound</text>
      <text className="ts" x={140} y={140}>owns TTFT</text>
      <text className="ts" x={140} y={166}>runs the one big prompt pass,</text>
      <text className="ts" x={140} y={182}>builds the KV cache</text>

      {/* KV transfer */}
      <rect className="xfer" x={300} y={78} width={220} height={114} rx={8} />
      <text className="xt" x={410} y={108}>KV connector</text>
      <text className="xs" x={410} y={130}>NixlConnector / LMCache /</text>
      <text className="xs" x={410} y={146}>Mooncake / P2pNccl</text>
      <text className="xs" x={410} y={170}>RDMA over NIXL / UCX /</text>
      <text className="xs" x={410} y={186}>libfabric (EFA on AWS)</text>

      {/* Decoder pool */}
      <rect className="pool decode" x={570} y={70} width={220} height={130} rx={8} />
      <text className="tt" x={680} y={100}>Decoder pool</text>
      <text className="ts" x={680} y={122}>memory-bandwidth-bound</text>
      <text className="ts" x={680} y={140}>owns ITL</text>
      <text className="ts" x={680} y={166}>streams tokens one step</text>
      <text className="ts" x={680} y={182}>at a time from the KV</text>

      {/* arrows */}
      <path className="arr" d="M250,135 L300,135" />
      <path className="arr" d="M520,135 L570,135" />
      <text className="sub" x={275} y={126}>KV out</text>
      <text className="sub" x={545} y={126}>KV in</text>

      {/* independent scaling note */}
      <rect className="pool prefill" x={30} y={150} width={220} height={0} rx={0} opacity={0} />
      <text className="sub" x={140} y={232}>scale prefill replicas for TTFT</text>
      <text className="sub" x={680} y={232}>scale decode replicas for ITL</text>
      <path className="arr" d="M140,244 L140,272" />
      <path className="arr" d="M680,244 L680,272" />
      <rect className="pool prefill" x={50} y={278} width={180} height={34} rx={6} opacity={0.85} />
      <rect className="pool prefill" x={64} y={290} width={180} height={34} rx={6} opacity={0.55} />
      <rect className="pool decode" x={590} y={278} width={180} height={34} rx={6} opacity={0.85} />
      <rect className="pool decode" x={604} y={290} width={180} height={34} rx={6} opacity={0.55} />
      <text className="ts" x={150} y={300}>+N prefillers</text>
      <text className="ts" x={690} y={300}>+M decoders</text>

      <text className="lbl" x={410} y={356}>
        Each pool scales and tunes independently; the connector is the only coupling
      </text>
    </svg>
  );
}

export function DisaggregatedServing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Run prefill on one set of instances and decode on another, so each phase scales and tunes to its own bottleneck. This is a latency / SLO-isolation play, not a throughput one"
          >
            10. Disaggregated Prefill / Decode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Experimental feature: a moving target">
            Disaggregated prefilling is explicitly <strong>experimental</strong>. The vLLM
            docs state plainly that the feature is{' '}
            <em>&quot;experimental and subject to change&quot;</em>{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
              [Tier-1: vLLM disaggregated-prefilling docs, accessed 2026-06-07]
            </Link>
            . The connector framework underneath it moves roughly bi-weekly; the class names,
            config fields, and role flags below are accurate as of the access date and may
            drift. Treat this section as the shape of the design, not a frozen API contract.
          </Alert>
          <Box variant="p">
            <strong>The problem:</strong> a single inference engine serves two phases with
            opposite resource profiles. <strong>Prefill</strong> processes the whole prompt in
            one parallel pass, so it is <strong>compute-bound</strong> and it owns{' '}
            <strong>TTFT (time-to-first-token)</strong>. <strong>Decode</strong> then emits one
            token per step, reading the entire KV (key-value) cache every step, so it is{' '}
            <strong>memory-bandwidth-bound</strong> and it owns{' '}
            <strong>ITL (inter-token latency)</strong>. When both run in the same engine, a
            burst of expensive prefills stalls the decode loop and spikes tail ITL; conversely,
            a packed decode batch delays prefills and spikes TTFT. One engine, two SLOs, in
            permanent contention.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> physically split the two. Run prefill on one set of
            instances (the <strong>prefiller pool</strong>) and decode on another (the{' '}
            <strong>decoder pool</strong>). The prompt&apos;s KV cache, computed by a prefiller,
            is shipped to a decoder over a <strong>KV connector</strong>, and the decoder
            generates from it. Now each pool scales to its own load and tunes to its own
            bottleneck, and a prefill burst can no longer touch the decode latency budget.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A prefiller pool computes KV, a connector ships it over RDMA, a decoder pool streams tokens"
          >
            The data path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The whole architecture is three boxes and one wire. The prefiller does the
            compute-heavy prompt pass and produces a KV cache. A KV connector moves that cache
            across the network. The decoder receives it and runs the bandwidth-heavy token
            loop. The connector is the <em>only</em> coupling between the pools. Everything
            else about each side (replica count, parallel layout, hardware) is independent.
          </Box>
          <DisaggDiagram />
          <Alert type="info">
            The connector internals (<code>NixlConnector</code>&apos;s send/receive state
            machine, how KV blocks are registered for RDMA, the role/lease wiring, and the
            <code> KVConnectorBase_V1</code> contract) are documented in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>. This
            section stays at the architecture altitude and does not duplicate that call-path
            walk-through.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Prefill and decode have opposite resource profiles, and that asymmetry is the entire reason to split them"
          >
            Two phases, two bottlenecks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Disaggregation only makes sense once you see how differently the two phases behave.
            Prefill is a wide, one-shot matrix problem; decode is a narrow, repeated,
            memory-streaming problem. In a unified engine you pick one set of knobs and
            compromise both. Split apart, each phase gets the parallel strategy, batch policy,
            and replica count that fit it.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'phase', header: 'Phase', cell: (r) => <strong>{r.phase}</strong>, minWidth: 90 },
              { id: 'bound', header: 'Bottleneck', cell: (r) => r.bound, minWidth: 200 },
              { id: 'metric', header: 'Latency metric it owns', cell: (r) => r.metric, minWidth: 170 },
              { id: 'scaling', header: 'How it scales', cell: (r) => r.scaling, minWidth: 230 },
              { id: 'tuning', header: 'How you tune it', cell: (r) => r.tuning, minWidth: 230 },
            ]}
            items={phaseRows}
          />
          <Alert type="success" header="The honest, crucial point: this is NOT a throughput win">
            <SpaceBetween size="s">
              <Box variant="p">
                The most-misread thing about disaggregation: it does not make the system
                faster in aggregate. The vLLM docs say it outright:{' '}
                <strong><em>&quot;Disaggregated prefill DOES NOT improve throughput&quot;</em></strong>{' '}
                <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
                  [Tier-1: vLLM disaggregated-prefilling docs, accessed 2026-06-07]
                </Link>
                . You still run the same prefill FLOPs and the same decode steps; you have also
                added a KV-transfer cost that a unified engine never pays.
              </Box>
              <Box variant="p">
                What it buys is <strong>latency isolation and independent SLO tuning</strong>.
                The same docs give two reasons to want it: it lets you{' '}
                <em>tune TTFT and ITL separately</em> with different parallel strategies for
                each phase, and it <em>controls tail ITL</em> by keeping prefill work from
                inserting itself into the decode stream, which the docs frame as more reliable
                than chunked prefill for that purpose{' '}
                <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
                  [Tier-1, same source]
                </Link>
                . If your goal is tokens/sec or cost-per-token, this is the wrong lever; reach
                for batching, quantization, or prefix caching instead.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The KV connector is the only thing wiring the two pools together, so pick the one that matches your fabric"
          >
            Moving KV from prefiller to decoder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cache hand-off rides the same pluggable{' '}
            <strong>KV connector framework</strong> introduced in{' '}
            <strong>section 7 (KV-Cache Offloading &amp; LMCache)</strong>. There, the
            framework moves KV <em>down a memory hierarchy</em> within one engine; here it moves
            KV <em>across engines</em>. Same surface (<code>--kv-transfer-config</code>),
            different intent. The disaggregation docs list several connectors that implement the
            cross-instance path:{' '}
            <code>NixlConnector</code>, <code>LMCacheConnectorV1</code>,{' '}
            <code>P2pNcclConnector</code>, <code>MooncakeConnector</code>, and{' '}
            <code>MultiConnector</code> among them{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
              [Tier-1: vLLM disaggregated-prefilling docs, accessed 2026-06-07]
            </Link>
            .
          </Box>
          <Box variant="p">
            The reference implementation is <strong>NixlConnector</strong>, described as a{' '}
            <em>
              &quot;high-performance KV cache transfer connector for vLLM&apos;s disaggregated
              prefilling feature&quot;
            </em>{' '}
            that provides fully asynchronous send/receive over the NIXL library, with{' '}
            <strong>UCX (Unified Communication X)</strong> as the primary default transport and{' '}
            <strong>libfabric</strong> as an alternative backend{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
              [Tier-1: vLLM NixlConnector usage docs, accessed 2026-06-07]
            </Link>
            . The transfer itself is an RDMA read of the prefiller&apos;s KV blocks by the
            decoder. Roles are assigned through <code>kv_role</code>:{' '}
            <code>kv_producer</code> on prefillers, <code>kv_consumer</code> on decoders, or{' '}
            <code>kv_both</code> for a symmetric engine{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
              [Tier-1, same source]
            </Link>
            .
          </Box>
          <Alert type="info">
            <strong>The AWS realization.</strong> On AWS the libfabric backend is where this
            lands on real hardware: NIXL transfers KV over <strong>EFA (Elastic Fabric
            Adapter)</strong> via libfabric, the same OS-bypass RDMA path used for training
            collectives. That data path (GPUs, EFA, and the NIXL plugin) is the subject of{' '}
            <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong>, and the placement
            decisions that keep prefiller and decoder pools close enough for the transfer to be
            cheap are covered in{' '}
            <strong>section 23 (EC2 Topology, Placement Groups &amp; KV Locality)</strong>. The
            networking primitives themselves (SRD, packet spraying, the libfabric provider)
            and the broader question of where this sits in the memory/interconnect stack are
            framed in the sibling <strong>Silicon, Memory &amp; Inference</strong> deep dive.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When a KV transfer fails, you choose: error the request, or recompute it on the decoder and eat the latency"
          >
            Failure policy: fail vs recompute
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cross-instance transfer is a new failure surface a unified engine never has: the
            KV may not arrive. <code>kv_load_failure_policy</code> decides what happens when a
            load fails on the decode side, and the two options encode a real tradeoff{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
              [Tier-1: vLLM NixlConnector usage docs, accessed 2026-06-07]
            </Link>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3"><code>&quot;fail&quot;</code> (default)</Box>
              <Box variant="p">
                Per the docs,{' '}
                <em>
                  &quot;immediately fail the request with an error when KV load fails.&quot;
                </em>{' '}
                Clean and predictable: the failure is visible, the request errors, and you can
                retry it through the router. No silent latency cliff: the cost shows up as an
                error rate you can alarm on, not as a mystery ITL spike.
              </Box>
            </div>
            <div>
              <Box variant="h3"><code>&quot;recompute&quot;</code></Box>
              <Box variant="p">
                The docs describe it as{' '}
                <em>&quot;recompute failed blocks locally on the decode instance.&quot;</em>{' '}
                The request survives, but the decoder, a memory-bandwidth-bound machine sized
                for the token loop, now has to do prefill-shaped compute it was never tuned for.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Why recompute degrades decode">
            Recompute keeps the request alive at the cost of the very isolation disaggregation
            was built to provide. The decoder pool is provisioned for ITL, not for prompt
            FLOPs; making it recompute KV blocks injects exactly the kind of compute spike that
            splitting the phases was meant to keep off the decode path. The vLLM docs warn
            directly that using{' '}
            <code>kv_load_failure_policy=&quot;recompute&quot;</code>{' '}
            <em>&quot;can lead to performance degradation in production deployments&quot;</em>{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
              [Tier-1: vLLM NixlConnector usage docs, accessed 2026-06-07]
            </Link>
            . Treat recompute as a survivability fallback, not a steady-state policy. If your
            transfers fail often enough that recompute matters, the fabric, not the policy, is
            the bug.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Disaggregation is an SLO tool: use it for isolation and imbalance, not for throughput"
          >
            When to disaggregate, and when not to
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The decision reduces to one question: <strong>do you have separate, strict TTFT and
            ITL SLOs, or a large prefill:decode imbalance?</strong> If yes, the physical split
            buys isolation that no amount of in-engine scheduling can guarantee. If your goal is
            throughput or cost-per-token, or a single unified engine already meets a single SLO,
            disaggregation adds a transfer tax and operational surface for no win.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'signal', header: 'Signal in your workload', cell: (r) => <strong>{r.signal}</strong>, minWidth: 260 },
              {
                id: 'verdict',
                header: 'Verdict',
                cell: (r) => (
                  <Box
                    variant="span"
                    color={r.verdict === 'Use it' ? 'text-status-success' : 'text-status-error'}
                    fontWeight="bold"
                  >
                    {r.verdict}
                  </Box>
                ),
                minWidth: 110,
              },
              { id: 'why', header: 'Why', cell: (r) => r.why, minWidth: 280 },
            ]}
            items={decisionRows}
          />
          <Alert type="info">
            The honest framing from the throughput point above is the tie-breaker: if you cannot
            name a latency SLO that a unified engine is violating, you do not yet have a reason
            to disaggregate. Chunked prefill inside one engine is the simpler first move; reach
            for disaggregation when chunking can no longer hold the tail ITL line.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Operational notes (deep dive)">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>The transfer tax is real and fabric-dependent.</strong> Every disaggregated
            request pays a KV round-trip that a unified engine never does. On a fast RDMA
            fabric (EFA via libfabric, or NVLink-class intra-node links) that tax is small
            relative to the prefill it isolates; on a slow link it can exceed the prefill stall
            you were trying to avoid, which is precisely why &quot;no fast fabric&quot; is a
            do-not-use signal above. The KV cache moved per request scales with prompt length,
            layer count, and head dimension, so long-context workloads move the most bytes and
            are the most fabric-sensitive.
          </Box>
          <Box variant="p">
            <strong>Pool ratio is a tuning knob, not a constant.</strong> Because the pools are
            independent, the prefiller:decoder ratio is something you size to your actual
            prompt:response shape and re-tune as traffic shifts. A long-prompt / short-answer
            workload wants more prefillers; a chatty long-generation workload wants more
            decoders. Getting this ratio wrong leaves one pool idle while the other is the
            bottleneck, the imbalance disaggregation was supposed to fix, reintroduced at the
            fleet level.
          </Box>
          <Box variant="p">
            <strong>Routing has to be disaggregation-aware.</strong> A request now visits two
            pools in sequence, so the router must place prefill, carry the KV handle, and place
            decode, and ideally keep the pair on instances close enough that the transfer is
            cheap (the EC2 topology / placement concern in section 23). This is the same
            cache-aware-routing problem section 7 raised for cross-replica reuse, one step
            harder: here the route is part of the request&apos;s critical path, not an
            optimization.
          </Box>
          <Box variant="p">
            <strong>Heterogeneous KV layout is still experimental.</strong> The NixlConnector
            docs note experimental support for a prefiller and decoder running different KV
            memory layouts (e.g. <code>HND</code> on prefill, <code>NHD</code> on decode), and
            flag a correctness hazard for reasoning models whose KV covers thinking tokens{' '}
            <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
              [Tier-1: vLLM NixlConnector usage docs, accessed 2026-06-07]
            </Link>
            . As with everything here, validate against the docs at your pinned vLLM version
            before relying on it. The surface moves.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Box variant="small">
        Sources. <strong>Tier-1 (vLLM official docs):</strong>{' '}
        <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
          Disaggregated prefilling
        </Link>{' '}
        (the &quot;does not improve throughput&quot; statement, the TTFT/ITL and tail-latency
        motivations, the connector list, and the experimental warning) and{' '}
        <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
          NixlConnector usage
        </Link>{' '}
        (NIXL/UCX/libfabric transport, <code>kv_role</code>, and the{' '}
        <code>kv_load_failure_policy</code> fail-vs-recompute behavior and its degradation
        warning), both accessed 2026-06-07. Connector class internals: see{' '}
        <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>. AWS data
        path and placement: <strong>sections 22 and 23</strong>. Hardware framing: the sibling{' '}
        <strong>Silicon, Memory &amp; Inference</strong> deep dive. This feature is{' '}
        <strong>experimental</strong> and vLLM&apos;s connector APIs move roughly bi-weekly;
        names and fields may drift from what is shown here.
      </Box>
    </SpaceBetween>
  );
}
