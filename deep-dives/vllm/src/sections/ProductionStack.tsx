import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl } from '../components/Cite';

/** production-stack pinned to its newest stable release, vllm-stack-0.1.13 (commit e8cb4959). */
const PS = 'https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13';
const PS_TREE = 'https://github.com/vllm-project/production-stack/tree/vllm-stack-0.1.13';
const PS_README = `${PS}/README.md`;
const ROUTING = `${PS}/src/vllm_router/routers/routing_logic.py`;
const PARSER = `${PS}/src/vllm_router/parsers/parser.py`;
const ENGINE_STATS = `${PS}/src/vllm_router/stats/engine_stats.py`;
const ROUTER_METRICS = `${PS}/src/vllm_router/services/metrics_service/__init__.py`;
const REQUEST_SERVICE = `${PS}/src/vllm_router/services/request_service/request.py`;
const VALUES = `${PS}/helm/values.yaml`;
const SCHEMA = `${PS}/helm/values.schema.json`;
const CHART = `${PS}/helm/Chart.yaml`;
const ROUTER_TEMPLATE = `${PS}/helm/templates/deployment-router.yaml`;
const DASHBOARD = `${PS}/helm/dashboards/vllm-dashboard.json`;
/** The separate Rust router, pinned to v0.1.16. */
const RR_README = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md';
const ROUTER_BLOG = 'https://vllm-project.github.io/2025/12/13/vllm-router-release.html';
const LOGGERS = 'vllm/v1/metrics/loggers.py';

function DeploymentShapeDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 520"
        role="img"
        aria-labelledby="prodstack-shape-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="prodstack-shape-title">
          One Helm release in one Kubernetes namespace. A client sends OpenAI-compatible HTTP
          requests to the Python vLLM router, which picks an engine replica with one of eight
          routing logics: roundrobin, session, prefixaware, kvaware, loadaware, priority,
          disaggregated_prefill and disaggregated_prefill_orchestrated. For kvaware and loadaware,
          each engine's LMCache reports where its KV cache lives to a controller embedded in the
          router. Prometheus scrapes every replica's /metrics endpoint and feeds Grafana
          dashboards, but both are opt-in chart values that are off by default.
        </title>
        <style>
          {`
            .ps-bg { fill: #ffffff; }
            .ps-ns { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 6 4; }
            .ps-router { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
            .ps-replica { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
            .ps-obs { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 6 4; }
            .ps-client { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.5; }
            .ps-rt { fill: #ffffff; font: 600 15px sans-serif; text-anchor: middle; }
            .ps-rs { fill: #eaf3fb; font: 11px sans-serif; text-anchor: middle; }
            .ps-pt { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
            .ps-ps { fill: #e6f4f1; font: 11px sans-serif; text-anchor: middle; }
            .ps-ot { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .ps-os { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .ps-ct { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .ps-cs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .ps-nslbl { fill: #0972d3; font: 600 12px sans-serif; letter-spacing: 0.5px; }
            .ps-elbl { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .ps-elbl-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
            .ps-kvlbl { fill: #6f4cc4; font: 600 11px sans-serif; text-anchor: start; }
            .ps-cap { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; }
            .ps-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#ps-ah); }
            .ps-bus { stroke: #8b6c00; stroke-width: 2; fill: none; stroke-dasharray: 5 4; }
            .ps-scrape { stroke: #8b6c00; stroke-width: 2; fill: none; stroke-dasharray: 5 4; marker-end: url(#ps-ahg); }
            .ps-kv { stroke: #6f4cc4; stroke-width: 2; fill: none; stroke-dasharray: 4 3; marker-end: url(#ps-ahp); }
          `}
        </style>
        <defs>
          <marker id="ps-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="ps-ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
          <marker id="ps-ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
        </defs>

        <rect className="ps-bg" x={0} y={0} width={900} height={520} rx={8} />

        {/* Client (outside the namespace) */}
        <rect className="ps-client" x={16} y={91} width={136} height={70} rx={8} />
        <text className="ps-ct" x={84} y={119}>client</text>
        <text className="ps-cs" x={84} y={139}>OpenAI-compatible</text>

        {/* Kubernetes namespace boundary */}
        <rect className="ps-ns" x={234} y={30} width={650} height={440} rx={10} />
        <text className="ps-nslbl" x={254} y={54}>Kubernetes namespace (one Helm release)</text>

        {/* client -> router (drawn after the namespace so its fill does not hide the arrow) */}
        <path className="ps-arr" d="M152,126 L262,126" />
        <text className="ps-elbl" x={194} y={117}>HTTP</text>

        {/* vLLM Router */}
        <rect className="ps-router" x={264} y={70} width={460} height={112} rx={8} />
        <text className="ps-rt" x={494} y={96}>vLLM Router (Python vllm_router)</text>
        <text className="ps-rs" x={494} y={118}>--routing-logic: roundrobin | session | prefixaware</text>
        <text className="ps-rs" x={494} y={134}>kvaware | loadaware | priority | disaggregated_prefill</text>
        <text className="ps-rs" x={494} y={150}>disaggregated_prefill_orchestrated</text>
        <text className="ps-rs" x={494} y={170}>embeds the LMCache controller for kvaware, loadaware</text>

        {/* router -> replicas */}
        <path className="ps-arr" d="M414,182 L360,238" />
        <path className="ps-arr" d="M494,182 L494,238" />
        <path className="ps-arr" d="M574,182 L628,238" />

        {/* LMCache KV-location reports, replica -> router */}
        <path className="ps-kv" d="M684,240 L684,186" />
        <text className="ps-kvlbl" x={694} y={208}>KV locations</text>
        <text className="ps-kvlbl" x={694} y={224}>(LMCache)</text>

        {/* vLLM engine replicas */}
        <rect className="ps-replica" x={284} y={240} width={120} height={78} rx={8} />
        <text className="ps-pt" x={344} y={268}>vLLM</text>
        <text className="ps-ps" x={344} y={286}>engine</text>
        <text className="ps-ps" x={344} y={302}>replica</text>

        <rect className="ps-replica" x={434} y={240} width={120} height={78} rx={8} />
        <text className="ps-pt" x={494} y={268}>vLLM</text>
        <text className="ps-ps" x={494} y={286}>engine</text>
        <text className="ps-ps" x={494} y={302}>replica</text>

        <rect className="ps-replica" x={584} y={240} width={120} height={78} rx={8} />
        <text className="ps-pt" x={644} y={268}>vLLM</text>
        <text className="ps-ps" x={644} y={286}>engine</text>
        <text className="ps-ps" x={644} y={302}>replica</text>

        <text className="ps-elbl" x={790} y={284}>... +N replicas</text>

        {/* replicas -> Prometheus (scrape) */}
        <path className="ps-bus" d="M344,318 L344,352 L644,352 L644,318" />
        <path className="ps-bus" d="M494,318 L494,352" />
        <path className="ps-scrape" d="M469,352 L469,370" />
        <text className="ps-elbl-s" x={654} y={356}>/metrics (Prometheus scrape)</text>

        {/* Prometheus */}
        <rect className="ps-obs" x={384} y={372} width={170} height={74} rx={8} />
        <text className="ps-ot" x={469} y={396}>Prometheus</text>
        <text className="ps-os" x={469} y={414}>kube-prometheus-stack</text>
        <text className="ps-os" x={469} y={430}>off by default</text>

        {/* Prometheus -> Grafana */}
        <path className="ps-arr" d="M554,409 L602,409" />

        {/* Grafana */}
        <rect className="ps-obs" x={604} y={372} width={170} height={74} rx={8} />
        <text className="ps-ot" x={689} y={396}>Grafana</text>
        <text className="ps-os" x={689} y={414}>bundled dashboards</text>
        <text className="ps-os" x={689} y={430}>off by default</text>

        <text className="ps-cap" x={450} y={500}>
          One Helm chart. Solid boxes install by default; dashed boxes are opt-in chart values.
        </text>
      </svg>
    </div>
  );
}

interface RoutingRow {
  logic: string;
  picks: string;
  when: string;
  source: ReactNode;
}

const routingRows: RoutingRow[] = [
  {
    logic: 'roundrobin (chart default)',
    picks: 'Cycles through the healthy engines in order.',
    when: 'Stateless, prefix-light traffic: one-shot prompts, batch scoring. Nothing to keep warm, so an even spread is right.',
    source: (
      <Cite tier={1} href={`${ROUTING}#L171-L228`} kind="code">
        routing_logic.py L171-L228
      </Cite>
    ),
  },
  {
    logic: 'session (--session-key <header>)',
    picks: 'Hashes the session key onto a consistent-hash ring, so a session sticks to one engine. Requests without the key go to the engine with the lowest QPS (queries per second).',
    when: 'Multi-turn chat that carries a stable session or user ID. The chat history stays a warm prefix turn after turn, with no prompt inspection.',
    source: (
      <Cite tier={1} href={`${ROUTING}#L230-L282`} kind="code">
        routing_logic.py L230-L282
      </Cite>
    ),
  },
  {
    logic: 'prefixaware',
    picks: 'Keeps its own trie of the prompts it has routed and sends a request to the engine that received the longest matching prefix. It remembers where it sent text; the code assumes no cache eviction.',
    when: 'Many users share a long system prompt or document but send no session ID.',
    source: (
      <Cite tier={1} href={`${ROUTING}#L759-L851`} kind="code">
        routing_logic.py L759-L851
      </Cite>
    ),
  },
  {
    logic: 'kvaware (needs LMCache)',
    picks: "Tokenizes the prompt and asks the LMCache controller embedded in the router which engine holds the longest cached prefix. A short match falls back to session hashing, then lowest QPS.",
    when: 'Engines run LMCache and you want placement by what is actually cached rather than by routing history.',
    source: (
      <Cite tier={1} href={`${ROUTING}#L284-L479`} kind="code">
        routing_logic.py L284-L479
      </Cite>
    ),
  },
  {
    logic: 'loadaware (needs LMCache)',
    picks: 'Scores each engine as its cached share of the prompt minus beta times its load relative to the fleet mean (beta defaults to 1.0), so a warm but saturated engine can lose to a cold idle one.',
    when: 'A hot shared prefix piles traffic onto one engine under kvaware.',
    source: (
      <>
        <Cite tier={1} href={`${ROUTING}#L481-L497`} kind="code">
          routing_logic.py L481-L497
        </Cite>{' '}
        <Cite tier={1} href={`${ROUTING}#L65-L69`} kind="code">
          L65-L69 (beta)
        </Cite>
      </>
    ),
  },
  {
    logic: 'priority',
    picks: 'Reads a priority from the x-request-priority header or the body (lower is more important). Requests below --priority-threshold go to the least-loaded engine; the rest round-robin across all engines.',
    when: 'Interactive and batch traffic share one fleet. Start the engines with --scheduling-policy priority (vLLM defaults to fcfs, first come first served) or the priority steers placement only; the router logs this reminder and cannot check it.',
    source: (
      <>
        <Cite tier={1} href={`${ROUTING}#L853-L866`} kind="code">
          routing_logic.py L853-L866
        </Cite>{' '}
        <Cite tier={1} href={`${ROUTING}#L942-L949`} kind="code">
          L942-L949
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L160-L166')} kind="code">
          vLLM scheduler.py L160-L166
        </Cite>{' '}
        <Cite tier={1} href={`${PARSER}#L474-L508`} kind="code">
          parser.py L474-L508
        </Cite>
      </>
    ),
  },
  {
    logic: 'disaggregated_prefill',
    picks: 'The client sends two requests: one with max_tokens 1 goes to a prefill-labelled engine, the follow-up to a decode-labelled engine. Each goes to the first engine in its group.',
    when: 'Split prefill and decode pools (section 10) behind a client or proxy that already issues the two legs itself.',
    source: (
      <Cite tier={1} href={`${ROUTING}#L967-L1007`} kind="code">
        routing_logic.py L967-L1007
      </Cite>
    ),
  },
  {
    logic: 'disaggregated_prefill_orchestrated',
    picks: 'One client request: the router sends it to a prefill engine with kv_transfer_params, passes the returned KV metadata to a decode engine and streams the decode back. Round-robin within each pool.',
    when: 'Split prefill and decode pools with clients that should not know about the split.',
    source: (
      <>
        <Cite tier={1} href={`${ROUTING}#L1010-L1023`} kind="code">
          routing_logic.py L1010-L1023
        </Cite>{' '}
        <Cite tier={1} href={`${REQUEST_SERVICE}#L805-L916`} kind="code">
          request.py L805-L916
        </Cite>
      </>
    ),
  },
];

export function ProductionStack() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What one Helm install of the vLLM project's reference stack gives you, which of its eight routing logics to pick, and which defaults to change before production (verified against vLLM v0.31.0, commit db9527a4, and production-stack vllm-stack-0.1.13, 2026-10-16)"
          >
            16. Kubernetes: Production-Stack &amp; Router
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Serving vLLM in production is a fleet challenge. One process is a fast engine; a
            service needs several replicas behind one endpoint, routing that keeps a conversation
            on the replica already holding its KV (key/value) cache, autoscaling on serving
            signals, and dashboards that speak in TTFT (time to first token), queue depth and
            KV-cache utilization rather than generic HTTP latency. Wiring that by hand
            (Deployments, a Service, a routing layer, scrape configs, Grafana panels) is work
            every team repeats.
          </Box>
          <Box variant="p">
            <strong>production-stack is the vLLM project&apos;s packaged answer</strong>: a Helm
            chart under the vLLM org that the project calls &quot;a reference implementation on
            how to build an inference stack on top of vLLM&quot;{' '}
            <Cite tier={1} href={`${PS_README}#L22`}>
              production-stack README L22
            </Cite>
            . One install brings up vLLM engine replicas for the models in your values file and a
            Python request router, both tiers enabled by default, and adds Prometheus and Grafana
            when you switch them on{' '}
            <Cite tier={1} href={`${VALUES}#L5-L7`} kind="code">
              values.yaml L5-L7
            </Cite>{' '}
            <Cite tier={1} href={`${VALUES}#L455-L457`} kind="code">
              L455-L457
            </Cite>{' '}
            <Cite tier={1} href={`${CHART}#L23-L31`} kind="code">
              Chart.yaml L23-L31
            </Cite>
            . The chart needs no operator. The repository also ships an optional Go operator whose
            four CRDs (custom resource definitions: <code>VLLMRuntime</code>,{' '}
            <code>VLLMRouter</code>, <code>CacheServer</code>, <code>LoraAdapter</code>) describe
            the same pieces as Kubernetes objects{' '}
            <Cite tier={1} href={`${PS_TREE}/operator/api/v1alpha1`} kind="code">
              operator/api/v1alpha1
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Where it sits among the Kubernetes options:</strong> production-stack brings
            its own router as the entry point. llm-d, covered in{' '}
            <strong>section 17 (Kubernetes: llm-d, KServe &amp; Gateway API)</strong>, builds on
            the Gateway API instead: a gateway asks llm-d Router&apos;s Endpoint Picker which pod
            serves each request. Both front plain vLLM engines, so they are alternatives for the
            same job. production-stack is the shorter, chart-shaped path; llm-d is the more
            programmable one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One entry point, a fleet behind it, and which pieces the chart turns on before you change a value"
          >
            The shape of the deployment
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The router is the single entry point in front of a horizontally scaled fleet of vLLM
            pods. It picks which replica serves each request, and that choice decides whether a
            shared prefix is answered from a warm cache or prefilled again on a cold replica.
          </Box>

          <DeploymentShapeDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured. The KV-location path exists only when engines
            run LMCache and the router uses kvaware or loadaware.
          </Box>

          <Alert type="info">
            <strong>The router is the load-bearing component.</strong> A plain Kubernetes Service
            (kube-proxy spreading connections at L4, the transport layer) scatters one
            user&apos;s turns across replicas, so each replica sees a cold prefix and the{' '}
            <strong>section 6 (Automatic Prefix Caching)</strong> hit rate collapses. The router
            exists to keep related requests on the replica that already holds their KV blocks.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each replica builds its own KV cache, which is what gives the router something to win"
          >
            Part 1: The vLLM serving-engine replicas
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The bottom tier is plain vLLM, the OpenAI-compatible server from{' '}
            <strong>section 12</strong>, run as a Kubernetes Deployment and scaled to several
            pods. <code>servingEngineSpec</code> in <code>values.yaml</code> sets the model,
            engine arguments, GPU requests and replica count; its <code>modelSpec</code> list
            stands up several models from one chart, each as its own pod group{' '}
            <Cite tier={1} href={`${VALUES}#L5-L57`} kind="code">
              values.yaml L5-L57
            </Cite>
            . Every engine serves vLLM&apos;s native Prometheus <code>/metrics</code> endpoint,
            which is what Part 3 scrapes.
          </Box>
          <Box variant="p">
            The replicas are stateful in one specific sense: each accumulates its own in-GPU KV
            cache as it serves. Replica A may hold a conversation&apos;s history while replica B
            is cold for it. That asymmetry is why the routing tier above them pays for itself
            whenever latency matters.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick one of eight routing logics by the key your traffic shares: nothing, a session ID, the prompt text, or the KV cache itself"
          >
            Part 2: The request router and why KV/prefix-aware routing pays
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mechanism:</strong> a long prefix (a system prompt, a RAG
            (retrieval-augmented generation) document, a chat history) becomes KV blocks on
            whichever replica first served it (<strong>section 6</strong>). Send the next request
            that shares the prefix to the same replica and the engine finds those blocks resident
            and skips their prefill. More hits mean less recomputation, lower TTFT and higher
            throughput. KV-aware routing is section 6&apos;s caching made to work across a fleet.
          </Box>
          <Box variant="p">
            The router is a Python reverse proxy that selects a backend per request{' '}
            <Cite tier={1} href={`${PS_TREE}/src/vllm_router`} kind="code">
              src/vllm_router
            </Cite>
            . Its <code>--routing-logic</code> flag accepts eight values, set in the chart as{' '}
            <code>routerSpec.routingLogic</code>{' '}
            <Cite tier={1} href={`${PARSER}#L229-L241`} kind="code">
              parser.py L229-L241
            </Cite>{' '}
            <Cite tier={1} href={`${VALUES}#L550`} kind="code">
              values.yaml L550
            </Cite>
            . They differ in what they key on, and the difference between the two cache-aware
            families is the useful mental model: <code>prefixaware</code> remembers where it sent
            text, while <code>kvaware</code> and <code>loadaware</code> ask LMCache where the KV
            cache actually is.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">The eight routing logics, and when to reach for each</Header>}
            columnDefinitions={[
              { id: 'logic', header: 'Routing logic', cell: (i) => <code>{i.logic}</code>, minWidth: 170 },
              { id: 'picks', header: 'How it picks a replica', cell: (i) => i.picks, minWidth: 260 },
              { id: 'when', header: 'Reach for it when', cell: (i) => i.when, minWidth: 220 },
              { id: 'source', header: 'Source', cell: (i) => i.source, minWidth: 170 },
            ]}
            items={routingRows}
          />

          <Alert type="warning" header="Trust the router's flag list over the README and the chart schema">
            Three files in the same release list different routing logics. The README&apos;s
            feature list names round-robin, session-ID and &quot;Prefix-aware routing
            (WIP)&quot; (work in progress){' '}
            <Cite tier={1} href={`${PS_README}#L119-L122`} kind="doc-code-conflict">
              README L119-L122
            </Cite>
            , and its roadmap still lists disaggregated prefill{' '}
            <Cite tier={1} href={`${PS_README}#L55`} kind="doc-code-conflict">
              README L55
            </Cite>
            . The router accepts all eight values above{' '}
            <Cite tier={1} href={`${PARSER}#L229-L241`} kind="code">
              parser.py L229-L241
            </Cite>
            . The chart&apos;s values schema enumerates six: <code>loadaware</code> and{' '}
            <code>priority</code> are missing{' '}
            <Cite tier={1} href={`${SCHEMA}#L885-L896`} kind="doc-code-conflict">
              values.schema.json L885-L896
            </Cite>
            , so setting either through <code>routerSpec.routingLogic</code> should fail
            Helm&apos;s schema validation. The router template appends{' '}
            <code>routerSpec.extraArgs</code> after its own <code>--routing-logic</code>{' '}
            <Cite tier={1} href={`${ROUTER_TEMPLATE}#L117-L140`} kind="code">
              deployment-router.yaml L117-L140
            </Cite>
            , which is the likely route to those two. Both points are inferences from the chart
            files, not from a run.
          </Alert>

          <Alert type="info" header="Two routers in the vLLM org">
            production-stack bundles its Python <code>vllm_router</code>; the chart&apos;s
            default image is <code>lmcache/lmstack-router</code>{' '}
            <Cite tier={1} href={`${VALUES}#L459-L461`} kind="code">
              values.yaml L459-L461
            </Cite>
            . Separately, <code>vllm-project/router</code> is a Rust router, announced in
            December 2025 as &quot;Built in Rust for minimal overhead&quot;{' '}
            <Cite tier={2} href={ROUTER_BLOG}>
              vLLM blog: vLLM Router release
            </Cite>
            , with policies <code>round_robin</code>, <code>random</code>,{' '}
            <code>consistent_hash</code>, <code>power_of_two</code> and <code>cache_aware</code>,
            plus prefill/decode (P/D) disaggregation{' '}
            <Cite tier={1} href={`${RR_README}#L8-L14`}>
              router v0.1.16 README L8-L14
            </Cite>{' '}
            <Cite tier={1} href={`${RR_README}#L228-L238`}>
              README L228-L238
            </Cite>
            . Both routers ship cache-aware and P/D routing, so choose on overhead and policy fit.
            The names do not map one to one: Rust <code>consistent_hash</code> is session
            stickiness, the same idea as production-stack&apos;s hash-ring <code>session</code>,
            and Rust <code>cache_aware</code> targets prefix-cache hits, the goal of{' '}
            <code>prefixaware</code> and <code>kvaware</code>.
          </Alert>

          <ExpandableSection headerText="The Rust router: consistent hashing, P/D disaggregation, and the project's benchmark claims">
            <SpaceBetween size="s">
              <Box variant="p">
                The Rust router is &quot;derived from a fork of the SGLang model gateway, modified
                and simplified to work with vLLM&quot;{' '}
                <Cite tier={2} href={ROUTER_BLOG}>
                  vLLM blog: vLLM Router release
                </Cite>{' '}
                <Cite tier={1} href={`${RR_README}#L339`}>
                  router v0.1.16 README L339
                </Cite>
                , a low-overhead load balancer between clients and a vLLM worker fleet. The blog
                calls consistent hashing &quot;the key policy for maximizing performance&quot;:
                requests with the same routing key, such as a session or user ID, are
                &quot;sticky&quot; and go to the same worker, &quot;maximizing KV cache
                reuse&quot;. The rationale is the prefix-locality argument above: &quot;For
                conversational workloads, routing subsequent requests from the same user to the
                same worker that holds their KV cache is critical for minimizing latency.&quot;
                It also manages prefill and decode worker groups separately for P/D
                disaggregation.
              </Box>
              <Box variant="p">
                <strong>Project-claimed benchmark figures</strong>, from the blog&apos;s own
                charts and not reproduced here{' '}
                <Cite tier={2} href={ROUTER_BLOG}>
                  vLLM blog: vLLM Router release
                </Cite>
                :
              </Box>
              <ul>
                <li>
                  <strong>Llama 3.1 8B, 8 prefill + 8 decode pods:</strong> the vLLM team reports
                  request throughput &quot;25% higher than llm-d and 100% higher than K8s-native
                  load balancer&quot; (K8s: Kubernetes), with TTFT &quot;1200 ms faster than
                  llm-d&quot;. [project-claimed]
                </li>
                <li>
                  <strong>DeepSeek V3, 1 prefill pod + 1 decode pod, each TP8 (tensor parallelism
                  across 8 GPUs):</strong> the vLLM team reports throughput &quot;100% higher than
                  K8s-native load balancer&quot; and close to llm-d, with TTFT &quot;2000 ms
                  faster than llm-d and K8s-native&quot;. [project-claimed]
                </li>
              </ul>
              <Box variant="p">
                Read the baselines before quoting these. The gap over the plain Kubernetes Service
                is the cleanest read of what KV-aware routing buys over L4 round-robin; the llm-d
                gap compares one routing layer with another and is the number to reproduce in
                your own environment first.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two chart values turn on dashboards; two panels need a check against vLLM v0.31.0 before you trust them"
          >
            Part 3: The bundled observability stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The chart can install Prometheus and Grafana beside the engines, and both are opt-in:{' '}
            <code>kube-prometheus-stack</code> and <code>prometheus-adapter</code> are chart
            dependencies gated on their own <code>enabled</code> values, and{' '}
            <code>kube-prometheus-stack.enabled</code> and <code>grafanaDashboards.enabled</code>{' '}
            both default to <code>false</code>{' '}
            <Cite tier={1} href={`${CHART}#L23-L31`} kind="code">
              Chart.yaml L23-L31
            </Cite>{' '}
            <Cite tier={1} href={`${VALUES}#L1029-L1053`} kind="code">
              values.yaml L1029-L1053
            </Cite>
            . Switched on, Prometheus selects the stack&apos;s ServiceMonitors by the{' '}
            <code>app.kubernetes.io/part-of: vllm-stack</code> label and the dashboards load as
            ConfigMaps. The vLLM dashboard plots TTFT, running and pending requests, and KV-cache
            usage from vLLM&apos;s native <code>/metrics</code>{' '}
            <Cite tier={1} href={`${DASHBOARD}#L442-L739`} kind="code">
              vllm-dashboard.json L442-L739
            </Cite>
            . What each metric means, and which ones predict saturation, is{' '}
            <strong>section 20 (Observability &amp; Benchmarking)</strong>.
          </Box>

          <Alert type="warning" header="Check two dashboard panels against vLLM v0.31.0">
            The router scrapes each engine for its own stats and matches the pre-rename names{' '}
            <code>vllm:gpu_cache_usage_perc</code> and <code>vllm:gpu_prefix_cache_hits_total</code>{' '}
            / <code>vllm:gpu_prefix_cache_queries_total</code>{' '}
            <Cite tier={1} href={`${ENGINE_STATS}#L62-L76`} kind="code">
              engine_stats.py L62-L76
            </Cite>
            , then republishes the prefix-cache pair under those same names{' '}
            <Cite tier={1} href={`${ROUTER_METRICS}#L16-L25`} kind="code">
              metrics_service L16-L25
            </Cite>
            . vLLM v0.31.0 emits <code>vllm:kv_cache_usage_perc</code> and the counters{' '}
            <code>vllm:prefix_cache_hits</code> / <code>vllm:prefix_cache_queries</code>, which a
            scrape reads as <code>vllm:prefix_cache_hits_total</code> /{' '}
            <code>vllm:prefix_cache_queries_total</code>{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L576-L615')} kind="code">
              loggers.py L576-L615
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('tests/v1/core/prefix_cache/test_hybrid_prefix_cache_hit_rate.py', 'L67')}
              kind="code"
            >
              test_hybrid_prefix_cache_hit_rate.py L67
            </Cite>
            . Inferred from the code, not from a run: against v0.31.0 engines the router&apos;s
            KV-usage and prefix-hit stats stay at zero, and the bundled &quot;GPU KV Cache Hit
            Rate&quot; panel, which divides the republished pair, has nothing to show{' '}
            <Cite tier={1} href={`${DASHBOARD}#L826-L835`} kind="code">
              vllm-dashboard.json L826
            </Cite>
            . Placement is unaffected, because the routing logics read the router&apos;s own
            request statistics{' '}
            <Cite tier={1} href={`${ROUTING}#L526-L533`} kind="code">
              routing_logic.py L526-L533
            </Cite>
            . The panel titled &quot;Average ITL&quot; (inter-token latency) averages vLLM&apos;s
            per-request TPOT (time per output token){' '}
            <Cite tier={1} href={`${DASHBOARD}#L372-L378`} kind="code">
              vllm-dashboard.json L372
            </Cite>
            . Build the hit rate from the rate of <code>vllm:prefix_cache_hits_total</code> over
            the rate of <code>vllm:prefix_cache_queries_total</code>; section 20 defines both
            counters, and ITL versus TPOT.
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Why co-deployed dashboards matter</Box>
              <Box variant="p">
                If the cache hit rate drops after a deploy, TTFT climbs and throughput falls with
                no code change. With the router and dashboards in one release, you can line a
                routing-config change up against the hit-rate, KV-usage and TTFT panels directly,
                rather than meeting the regression as a vague latency complaint.
              </Box>
            </div>
            <div>
              <Box variant="h3">Autoscaling signal</Box>
              <Box variant="p">
                The metrics on the dashboards are the ones to scale on. Queue depth (waiting
                requests) and KV-cache utilization track LLM serving load far better than CPU.
                The chart&apos;s optional <code>prometheus-adapter</code> dependency, off by
                default, is what exposes them to a custom-metric HPA (Horizontal Pod Autoscaler){' '}
                <Cite tier={1} href={`${VALUES}#L1052-L1056`} kind="code">
                  values.yaml L1052-L1056
                </Cite>
                . Section 20 covers which signal to pick.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The install is one helm install against a values file; the values you set decide routing, observability and the router version you run"
          >
            Deployment: one Helm chart
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One release carries all three parts. The README&apos;s quickstart clones the repository
            for its example values file, adds the chart repo and runs one <code>helm install</code>{' '}
            against that <code>values.yaml</code>{' '}
            <Cite tier={1} href={`${PS_README}#L70-L75`}>
              production-stack README L70-L75
            </Cite>
            :
          </Box>
          <pre style={{ overflowX: 'auto' }}>
            <code>{`git clone https://github.com/vllm-project/production-stack.git
cd production-stack/
helm repo add vllm https://vllm-project.github.io/production-stack
helm install vllm vllm/vllm-stack -f tutorials/assets/values-01-minimal-example.yaml`}</code>
          </pre>
          <Box variant="p">
            From there the production concerns are values. Scaling out is a replica count;
            routing is <code>routerSpec.routingLogic</code>; dashboards are{' '}
            <code>kube-prometheus-stack.enabled</code> plus <code>grafanaDashboards.enabled</code>.
            Pin both images as well. The router defaults to <code>lmcache/lmstack-router:latest</code>{' '}
            with <code>imagePullPolicy: Always</code>, and the chart&apos;s example model entry
            runs <code>lmcache/vllm-openai:latest</code>{' '}
            <Cite tier={1} href={`${VALUES}#L459-L463`} kind="code">
              values.yaml L459-L463
            </Cite>{' '}
            <Cite tier={1} href={`${VALUES}#L44-L47`} kind="code">
              L44-L47
            </Cite>
            , so with these defaults the chart version fixes neither the router build nor the vLLM
            build you run. Set{' '}
            <code>routerSpec.tag</code> and each model&apos;s <code>tag</code> to the builds you
            tested.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">production-stack vs. the llm-d path (section 17)</Header>}
            columnDefinitions={[
              { id: 'dim', header: 'Dimension', cell: (i) => i.dim },
              { id: 'ps', header: 'production-stack', cell: (i) => i.ps },
              { id: 'llmd', header: 'llm-d (section 17)', cell: (i) => i.llmd },
            ]}
            items={[
              {
                dim: 'Install model',
                ps: 'One Helm chart and a values.yaml; an optional Go operator with four CRDs',
                llmd: 'Helm guides plus the Gateway API inference CRDs (InferencePool)',
              },
              {
                dim: 'Mental model',
                ps: 'Batteries-included reference deployment',
                llmd: 'Composable, Kubernetes-native inference platform on the Gateway API',
              },
              {
                dim: 'Routing',
                ps: 'Python router: round-robin, session, prefix-aware, KV-aware (LMCache), load-aware, priority and two P/D modes',
                llmd: "llm-d Router's Endpoint Picker, called by a Gateway API gateway or by llm-d Router's standalone Envoy",
              },
              {
                dim: 'Best fit',
                ps: 'Teams that want production vLLM on Kubernetes fast, with one chart to operate',
                llmd: 'Teams that want a programmable platform and will run Gateway API resources',
              },
            ]}
          />

          <Alert type="info">
            <strong>Choosing between them:</strong> start from the outcome. If the outcome is
            &quot;serve vLLM well on Kubernetes with the least operational surface,&quot;
            production-stack is the shorter path: pick a routing logic from the table in Part 2,
            pin the router tag, switch on the two observability values, and rebuild the hit-rate
            panel on v0.31.0 metric names. If the outcome is &quot;build an inference platform we
            extend and program against the Gateway API,&quot; that is section 17&apos;s
            territory. Both drive the same vLLM engines and both want the same prefix locality
            (section 6) and observability (section 20).
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
