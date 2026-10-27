import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const GW = 'sgl-model-gateway';
const CA = `${GW}/src/policies/cache_aware.rs`;
const TREE = `${GW}/src/policies/tree.rs`;
const POL = `${GW}/src/policies`;
const MAIN = `${GW}/src/main.rs`;
const RARGS = `${GW}/bindings/python/src/sglang_router/router_args.py`;
const WORKER = `${GW}/src/core/worker.rs`;
const HTTP_ROUTER = `${GW}/src/routers/http/router.rs`;
const PD_ROUTER = `${GW}/src/routers/http/pd_router.rs`;
const SERVER = `${GW}/src/server.rs`;
const MW = `${GW}/src/middleware.rs`;
const METRICS = `${GW}/src/observability/metrics.rs`;
const GW_DOC = 'advanced_features/sgl_model_gateway';
const DPA_DOC = 'advanced_features/dp_dpa_smg_guide';
const KV_EVENTS = 'python/sglang/srt/disaggregation/kv_events.py';
const EXP = 'experimental/sgl-router';

const VLLM_ROUTER_FORK = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md#L339';
const SMG_FIRST_COMMIT =
  'https://github.com/smg-project/smg/commit/e26a184ea081d9134f6f987e6cd28f17e092f3b8';
const SMG_V101 = 'https://github.com/smg-project/smg/releases/tag/v1.0.1';
const SMG_V1130 = 'https://github.com/smg-project/smg/releases/tag/v1.13.0';
const SMG_README_1130 = 'https://github.com/smg-project/smg/blob/v1.13.0/README.md';
const GW_COMMITS = 'https://github.com/sgl-project/sglang/commits/v0.5.22/sgl-model-gateway';
const LLMD_SGLANG =
  'https://github.com/llm-d/llm-d/blob/v1.0.0/docs/architecture/model-servers/sglang.md';
const DYNAMO_SGLANG_ROUTER =
  'https://github.com/ai-dynamo/dynamo/blob/v1.6.0/examples/backends/sglang/deploy/agg_router.yaml';
const PYPI_ROUTER = 'https://pypi.org/project/sglang-router/0.3.2/';
const DOCKER_GW = 'https://hub.docker.com/r/lmsysorg/sgl-model-gateway/tags';
const LMSYS_V04 = 'https://lmsys.org/blog/2024-12-04-sglang-v0-4/';

const VLLM_K8S_ROUTER_LINK = (
  <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
);
const VLLM_LLMD_LINK = (
  <Link href="../vllm/">vLLM dive, section 17: Kubernetes: llm-d, KServe &amp; Gateway API</Link>
);

const PD_LAUNCH = `python -m sglang_router.launch_router --pd-disaggregation \\
  --prefill http://prefill-0:30000 8998 \\
  --prefill http://prefill-1:30000 9000 \\
  --decode http://decode-0:30000 \\
  --decode http://decode-1:30000 \\
  --prefill-policy cache_aware --decode-policy power_of_two \\
  --api-key "$GATEWAY_KEY"`;

/* ------------------------------------------------------------------------ */
/* Diagram: the cache_aware decision                                         */
/* ------------------------------------------------------------------------ */

function CacheAwareDecisionDiagram() {
  const blue = '#0972d3';
  const blueFill = '#f2f8fd';
  const amber = '#8b6c00';
  const amberFill = '#fbf3d5';
  const green = '#037f0c';
  const greenFill = '#ecf7ec';
  const slate = '#414d5c';
  const neutralFill = '#f4f4f4';
  const teal = '#1f7a70';
  const tealFill = '#e6f4f2';
  const text = '#16191f';
  const secondary = '#5f6b7a';
  const font = 'sans-serif';

  const rowY = 52;
  const rowH = 80;
  const midY = rowY + rowH / 2;
  const rowBottom = rowY + rowH;

  const flowBox = (
    x: number,
    w: number,
    title: string,
    lines: string[],
    fill: string,
    stroke: string,
  ) => (
    <g>
      <rect x={x} y={rowY} width={w} height={rowH} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text
        x={x + w / 2}
        y={rowY + 26}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={text}
        fontFamily={font}
      >
        {title}
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + w / 2}
          y={rowY + 46 + i * 16}
          textAnchor="middle"
          fontSize={11}
          fill={secondary}
          fontFamily={font}
        >
          {line}
        </text>
      ))}
    </g>
  );

  const wideBox = (y: number, title: string, line: string, fill: string, stroke: string) => (
    <g>
      <rect x={174} y={y} width={512} height={60} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text
        x={430}
        y={y + 25}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={text}
        fontFamily={font}
      >
        {title}
      </text>
      <text x={430} y={y + 45} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        {line}
      </text>
    </g>
  );

  const edgeLabel = (x: number, y: number, label: string, anchor: 'start' | 'middle') => (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={11}
      fontWeight={600}
      fill={slate}
      fontFamily={font}
    >
      {label}
    </text>
  );

  const treeNode = (x: number, y: number, w: number, label: string) => (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={6} fill="#ffffff" stroke={teal} strokeWidth={1.2} />
      <text
        x={x + w / 2}
        y={y + 19}
        textAnchor="middle"
        fontSize={11}
        fill={text}
        fontFamily={font}
      >
        {label}
      </text>
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 488"
        role="img"
        aria-labelledby="gateway-decision-title"
        aria-describedby="gateway-decision-desc"
        style={{ width: '100%', minWidth: 660, height: 'auto' }}
      >
        <title id="gateway-decision-title">
          The gateway&apos;s cache_aware policy decides each request in three steps. If the busiest
          and idlest workers differ by more than 64 open requests and the busiest carries more than
          1.5 times the idlest, the request goes to the least-loaded worker. Otherwise the gateway
          matches the prompt against its own text tree; a match over 30% of the prompt&apos;s
          characters sends it to the worker that received that prefix, and a weaker match also goes
          to the least-loaded worker. The prompt is then recorded under the chosen worker.
        </title>
        <desc id="gateway-decision-desc">
          The bottom panel shows what the gateway remembers: one tree of prompt text per worker pool
          and model, each node tagged with the workers it was sent to, pruned to 67,108,864
          characters per worker every 120 seconds, or every 60 seconds through the Python launcher.
          The gateway never queries a worker&apos;s cache.
        </desc>
        <defs>
          <marker
            id="gateway-decision-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={secondary} />
          </marker>
          <marker
            id="gateway-decision-ah-green"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={green} />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={488} rx={8} fill="#ffffff" />

        <text x={24} y={30} fontSize={13} fontWeight={600} fill={text} fontFamily={font}>
          How cache_aware picks a worker for each request (v0.5.22 defaults)
        </text>

        {/* Row 1: the decision path */}
        {flowBox(24, 120, 'Request', ['prompt text of', 'every message'], blueFill, blue)}
        {flowBox(174, 164, '1. Load lopsided?', ['max - min > 64', 'and max > 1.5 x min'], amberFill, amber)}
        {flowBox(368, 148, '2. Match prefix', ["in this pool's", 'text tree'], blueFill, blue)}
        {flowBox(546, 140, '3. Over 30%?', ['matched characters', '/ prompt characters'], amberFill, amber)}
        {flowBox(716, 124, 'Prefix owner', ['worker tagged on', 'deepest match'], greenFill, green)}

        <line x1={144} y1={midY} x2={172} y2={midY} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        <line x1={338} y1={midY} x2={366} y2={midY} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        {edgeLabel(353, midY - 8, 'no', 'middle')}
        <line x1={516} y1={midY} x2={544} y2={midY} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        <line x1={686} y1={midY} x2={714} y2={midY} stroke={green} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah-green)" />
        {edgeLabel(701, midY - 8, 'yes', 'middle')}

        {/* Row 2: the load fallback, reached from both decisions */}
        <line x1={256} y1={rowBottom} x2={256} y2={178} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        {edgeLabel(264, 160, 'yes', 'start')}
        <line x1={616} y1={rowBottom} x2={616} y2={178} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        {edgeLabel(624, 160, 'no, 30% or less', 'start')}
        {wideBox(
          180,
          'Least-loaded worker',
          'fewest requests this gateway has open on it, random tie-break',
          neutralFill,
          slate,
        )}

        {/* Row 3: every path records the prompt */}
        <line x1={430} y1={240} x2={430} y2={282} stroke={secondary} strokeWidth={1.5} markerEnd="url(#gateway-decision-ah)" />
        <path
          d={`M 778 ${rowBottom} L 778 314 L 688 314`}
          fill="none"
          stroke={green}
          strokeWidth={1.5}
          markerEnd="url(#gateway-decision-ah-green)"
        />
        {wideBox(
          284,
          'Record the prompt under the chosen worker',
          'in-flight count +1 until the response finishes',
          blueFill,
          blue,
        )}

        {/* Row 4: what the gateway remembers */}
        <rect x={24} y={364} width={816} height={108} rx={8} fill={tealFill} stroke={teal} strokeWidth={1.2} />
        <text x={40} y={392} fontSize={13} fontWeight={600} fill={teal} fontFamily={font}>
          Gateway memory
        </text>
        <text x={40} y={412} fontSize={11} fill={secondary} fontFamily={font}>
          one text tree per pool
        </text>
        <text x={40} y={428} fontSize={11} fill={secondary} fontFamily={font}>
          and model; it never asks
        </text>
        <text x={40} y={444} fontSize={11} fill={secondary} fontFamily={font}>
          a worker what it cached
        </text>

        <line x1={424} y1={418} x2={460} y2={391} stroke={teal} strokeWidth={1.2} />
        <line x1={424} y1={418} x2={460} y2={447} stroke={teal} strokeWidth={1.2} />
        {treeNode(210, 403, 214, 'You are a support bot. (W1, W2)')}
        {treeNode(460, 376, 170, 'Reset my password (W1)')}
        {treeNode(460, 432, 170, 'Where is my order (W2)')}

        <line x1={648} y1={380} x2={648} y2={458} stroke="#d1d5db" strokeWidth={1} strokeDasharray="5 4" />
        <text x={664} y={396} fontSize={11} fill={secondary} fontFamily={font}>
          Pruned to 67,108,864
        </text>
        <text x={664} y={412} fontSize={11} fill={secondary} fontFamily={font}>
          characters per worker,
        </text>
        <text x={664} y={428} fontSize={11} fill={secondary} fontFamily={font}>
          every 120 s (60 s in
        </text>
        <text x={664} y={444} fontSize={11} fill={secondary} fontFamily={font}>
          the Python launcher)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                    */
/* ------------------------------------------------------------------------ */

interface PolicyRow {
  id: string;
  policy: ReactNode;
  routes: ReactNode;
  launcher: string;
}

const POLICY_ROWS: PolicyRow[] = [
  {
    id: 'cache_aware',
    policy: <code>cache_aware</code>,
    routes: (
      <>
        Default. Balance check, then prefix affinity above 30% of the prompt, as in the diagram{' '}
        <Cite tier={1} href={sglangUrl(CA, 'L405-L470')}>
          cache_aware.rs L405-L470
        </Cite>
      </>
    ),
    launcher: 'Both',
  },
  {
    id: 'p2c',
    policy: <code>power_of_two</code>,
    routes: (
      <>
        The lighter of two random workers, by token load polled from <code>/v1/loads</code> every
        30 s, so it compares stale counts between polls{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/power_of_two.rs`, 'L11-L125')} kind="code">
          power_of_two.rs L11-L125
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/app_context.rs`, 'L455-L466')} kind="code">
          app_context.rs L455-L466
        </Cite>
      </>
    ),
    launcher: 'Both',
  },
  {
    id: 'rr',
    policy: (
      <>
        <code>round_robin</code>, <code>random</code>
      </>
    ),
    routes: (
      <>
        Cycle over healthy workers, or pick one uniformly; neither reads the prompt or the load{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/round_robin.rs`, 'L36-L46')}>
          round_robin.rs L36-L46
        </Cite>
      </>
    ),
    launcher: 'Both',
  },
  {
    id: 'manual',
    policy: <code>manual</code>,
    routes: (
      <>
        Pins each <code>X-SMG-Routing-Key</code> to one worker until it turns unhealthy or the key
        idles 4 hours, for sessions whose KV must stay put{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/manual.rs`, 'L1-L14')}>
          manual.rs L1-L14
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L173-L179')}>
          main.rs L173-L179
        </Cite>
      </>
    ),
    launcher: 'Both',
  },
  {
    id: 'ch',
    policy: <code>consistent_hashing</code>,
    routes: (
      <>
        A hash ring keyed on <code>X-SMG-Routing-Key</code>, so scaling moves about 1/N of keys.
        Without that header it hashes the <code>Authorization</code>,{' '}
        <code>X-Forwarded-For</code> or <code>Cookie</code> header, and picks at random only when
        none is present, so clients sharing one gateway key land on one worker (our reading){' '}
        <Cite tier={1} href={sglangUrl(`${POL}/consistent_hashing.rs`, 'L110-L167')} kind="code">
          consistent_hashing.rs L110-L167
        </Cite>
      </>
    ),
    launcher: 'Python launcher only',
  },
  {
    id: 'bucket',
    policy: <code>bucket</code>,
    routes: (
      <>
        Gives each prefill worker a band of prompt lengths, checked every 5 s and re-cut to equal
        total characters when the share per worker has moved more than 2x; prefill only{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/bucket.rs`, 'L209-L280')}>
          bucket.rs L209-L280
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/bucket.rs`, 'L507-L560')}>
          bucket.rs L507-L560
        </Cite>
        . The documentation&apos;s &quot;load buckets&quot; leaves out that the key is prompt length{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L885-L887')} kind="doc-code-conflict">
          SGLang docs: policy table (v0.5.22 source)
        </Cite>
      </>
    ),
    launcher: 'Python launcher only',
  },
  {
    id: 'prefix_hash',
    policy: <code>prefix_hash</code>,
    routes: (
      <>
        The first 256 token ids on a hash ring, moving on above 1.25x average load; needs{' '}
        <code>grpc://</code> workers{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/prefix_hash.rs`, 'L1-L30')}>
          prefix_hash.rs L1-L30
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L181-L187')}>
          main.rs L181-L187
        </Cite>
      </>
    ),
    launcher: 'Both',
  },
];

interface KnobRow {
  id: string;
  flag: ReactNode;
  def: ReactNode;
  effect: ReactNode;
}

const KNOB_ROWS: KnobRow[] = [
  {
    id: 'threshold',
    flag: <code>--cache-threshold</code>,
    def: '0.3',
    effect: 'Match share above which affinity wins; lower it to group requests that share less.',
  },
  {
    id: 'balance',
    flag: (
      <>
        <code>--balance-abs-threshold</code>, <code>--balance-rel-threshold</code>
      </>
    ),
    def: '64, 1.5',
    effect: 'Both must be exceeded before load overrides affinity; lower values do so sooner.',
  },
  {
    id: 'evict',
    flag: (
      <>
        <code>--eviction-interval</code> (binary), <code>--eviction-interval-secs</code> (Python)
      </>
    ),
    def: '120 s binary, 60 s Python',
    effect: 'How often the tree is pruned to its budget.',
  },
  {
    id: 'size',
    flag: <code>--max-tree-size</code>,
    def: '67,108,864',
    effect: 'Prompt characters remembered per worker; least recently used leaves go first.',
  },
];

interface OpsRow {
  id: string;
  feature: string;
  behaviour: ReactNode;
}

const OPS_ROWS: OpsRow[] = [
  {
    id: 'retry',
    feature: 'Retries',
    behaviour: (
      <>
        Up to 5 attempts in all, the first included, on 408, 429, 500, 502, 503 and 504, backoff
        50 ms x1.5 to 30 s with 20% jitter, and the policy picks again on each attempt, which can
        return the same worker{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L357-L379')}>
          main.rs L357-L379
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/core/retry.rs`, 'L10-L20')}>
          retry.rs L10-L20
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/core/retry.rs`, 'L99-L113')} kind="code">
          retry.rs L99-L113
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L217-L222')} kind="code">
          router.rs L217-L222
        </Cite>
      </>
    ),
  },
  {
    id: 'cb',
    feature: 'Circuit breaker',
    behaviour: (
      <>
        Per worker: 10 failures in a row take it out of routing for 60 s; 3 successes close it
        again. Read from source: <code>--cb-window-duration-secs</code> is accepted, and the
        breaker does not read it{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/core/circuit_breaker.rs`, 'L104-L252')} kind="code">
          circuit_breaker.rs L104-L252
        </Cite>
      </>
    ),
  },
  {
    id: 'health',
    feature: 'Health checks',
    behaviour: (
      <>
        <code>/health</code> every 60 s, 5 s timeout, 3 failures out and 2 passes back, so a dead
        worker can take minutes to leave; the breaker reacts faster on live traffic{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L403-L425')}>
          main.rs L403-L425
        </Cite>
      </>
    ),
  },
  {
    id: 'limit',
    feature: 'Admission control',
    behaviour: (
      <>
        Off by default. <code>--max-concurrent-requests N</code> builds a token bucket of N per
        gateway process: a request takes a token and returns it when its response ends, and the
        bucket also refills at N tokens a second (<code>--rate-limit-tokens-per-second</code>,
        where 0 falls back to N), so it caps bursts and the admission rate rather than requests
        in flight (read from source, not run). Requests without a token queue (100 deep, 60 s, then
        408; 429 when full){' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/app_context.rs`, 'L375-L390')} kind="code">
          app_context.rs L375-L390
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/core/token_bucket.rs`, 'L38-L90')} kind="code">
          token_bucket.rs L38-L90
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MW, 'L420-L612')}>
          middleware.rs L420-L612
        </Cite>
      </>
    ),
  },
  {
    id: 'metrics',
    feature: 'Metrics',
    behaviour: (
      <>
        <code>smg_*</code> on port 29000: request latency, and per-worker active requests, health,
        breaker state and retries. TTFT (time to first token) and TPOT (time per output token) are
        recorded only on the gRPC routers, so HTTP workers leave them empty (read from source, not
        run). Engine metrics stay on each worker&apos;s <code>/metrics</code>{' '}
        <Cite tier={1} href={sglangUrl(METRICS, 'L151-L331')}>
          metrics.rs L151-L331
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(METRICS, 'L726-L763')} kind="code">
          metrics.rs L726-L763
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/routers/grpc/regular/streaming.rs`, 'L593')} kind="code">
          grpc/regular/streaming.rs L593
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L269-L275')}>
          main.rs L269-L275
        </Cite>
      </>
    ),
  },
  {
    id: 'discovery',
    feature: 'Kubernetes discovery',
    behaviour: (
      <>
        <code>--service-discovery --selector app=sglang</code> adds each Ready, Running pod. Set{' '}
        <code>--service-discovery-port 30000</code>: the default is 80. Section 18, Multi-Node and
        Kubernetes Orchestrators, covers layouts{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/service_discovery.rs`, 'L139-L220')}>
          service_discovery.rs L139-L220
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L222-L252')}>
          main.rs L222-L252
        </Cite>
      </>
    ),
  },
  {
    id: 'grpc',
    feature: 'gRPC workers',
    behaviour: (
      <>
        With <code>grpc://</code> workers (started with <code>--smg-grpc-mode</code>) the gateway
        templates, tokenizes and parses tool calls itself{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/routers/grpc/pipeline.rs`, 'L83-L93')}>
          grpc/pipeline.rs L83-L93
        </Cite>
      </>
    ),
  },
  {
    id: 'igw',
    feature: 'Several models',
    behaviour: (
      <>
        <code>--enable-igw</code> routes by model name across HTTP, gRPC and PD workers that join
        through <code>POST /workers</code>{' '}
        <Cite tier={1} href={sglangUrl(`${GW}/src/routers/router_manager.rs`, 'L52-L196')}>
          router_manager.rs L52-L196
        </Cite>
      </>
    ),
  },
  {
    id: 'history',
    feature: 'Conversation state',
    behaviour: (
      <>
        <code>/v1/responses</code> history lives in gateway memory, lost on restart and unshared;{' '}
        <code>--history-backend</code> moves it to Postgres, Redis or Oracle{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L474-L476')}>
          main.rs L474-L476
        </Cite>
      </>
    ),
  },
  {
    id: 'mesh',
    feature: 'Gateway replicas',
    behaviour: (
      <>
        Each replica learns its own tree and load. <code>--enable-mesh</code> (port 39527) links
        replicas, but by our reading of the code, not run, it does not share the cache-aware
        trees: the policy built from the command line never receives the mesh manager, and the
        path that would apply a peer&apos;s tree updates has no caller{' '}
        <Cite tier={1} href={sglangUrl(`${POL}/registry.rs`, 'L56-L59')} kind="code">
          registry.rs L56-L59
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SERVER, 'L959-L973')} kind="code">
          server.rs L959-L973
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(CA, 'L263-L298')} kind="code">
          cache_aware.rs L263-L298
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(MAIN, 'L617-L628')}>
          main.rs L617-L628
        </Cite>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

export function ModelGateway() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Choose a routing policy, set its thresholds, and install the gateway build that matches your engine (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            17. The Model Gateway: routing in front of SGLang
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Several SGLang servers behind one endpoint each keep their own radix cache (section 5,
            RadixAttention and the Radix Cache), so a repeated prefix is cheap only on the server
            that already holds it. Sending each request to that server is the job of the SGLang Model
            Gateway, a Rust router that ships in the SGLang repository as the crate{' '}
            <code>sgl-model-gateway</code>, version 0.3.2 at v0.5.22{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L5-L34')}>
              Cargo.toml L5-L34
            </Cite>
            . Its default policy is <code>cache_aware</code>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L150-L151')}>
              main.rs L150-L151
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L54')}>
              router_args.py L54
            </Cite>
            , and it works from one idea: the gateway remembers where it sent text, and it never
            asks a worker what it cached{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L84-L101')}>
              cache_aware.rs L84-L101
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TREE, 'L531-L600')}>
              tree.rs L531-L600
            </Cite>
            .
          </Box>
          <Box variant="p">
            The figure to carry through this section is <strong>30% of the prompt</strong>. A
            request goes to the worker that served its prefix only when the match covers more than
            30% of the prompt&apos;s characters, and only while the workers&apos; loads are close;
            every other request goes to the least-loaded worker{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L405-L470')}>
              cache_aware.rs L405-L470
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L153-L171')}>
              main.rs L153-L171
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict which worker a request lands on, and why prefix affinity gives way during a burst"
          >
            Balance first, then a 30% match
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For each request the gateway first asks whether load is lopsided: the busiest and idlest
            workers more than 64 requests apart, and the busiest above 1.5 times the idlest. Both
            must hold. If they do, the request goes to the worker with the fewest open requests,
            ties broken at random. Otherwise the gateway matches the prompt in its prefix tree. A
            match over 30% of the prompt sends the request to the worker that received that prefix,
            and a weaker one goes to the least-loaded worker. Either way the prompt is then recorded
            under the chosen worker, so the next request with the same opening finds it{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L405-L470')}>
              cache_aware.rs L405-L470
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L310-L381')}>
              cache_aware.rs L310-L381
            </Cite>
            .
          </Box>

          <CacheAwareDecisionDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Thresholds and the tree budget are the v0.5.22 defaults; the
            prompts and workers W1 and W2 are an example.
          </Box>

          <Box variant="p">
            The tree is one radix tree per worker pool and model. It holds the raw characters of the
            request text and tags each node with the workers that received it{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L76-L101')}>
              cache_aware.rs L76-L101
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TREE, 'L531-L600')}>
              tree.rs L531-L600
            </Cite>
            . Characters need no tokenizer, so plain HTTP workers work. Load is the gateway&apos;s
            own count of the requests it has open on each worker, until the response finishes
            streaming{' '}
            <Cite tier={1} href={sglangUrl(WORKER, 'L1147-L1167')}>
              worker.rs L1147-L1167
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L300-L302')}>
              router.rs L300-L302
            </Cite>
            . It counts requests, not tokens or KV (key-value) cache usage, and it misses traffic
            that other gateway replicas or clients send straight to a worker.
          </Box>
          <Box variant="p">
            Our reading of the rule: in a burst the balance check fires first, so cache hits fall by
            design before any worker overloads, and a worker that evicted a prefix still owns it in
            the gateway&apos;s tree. To see which side of the rule a fleet is on, compare the gauge{' '}
            <code>smg_worker_requests_active</code>, which reports that open-request count per
            worker, against the 64-request gap and the 1.5x ratio{' '}
            <Cite tier={1} href={sglangUrl(WORKER, 'L700-L703')} kind="code">
              worker.rs L700-L703
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide whether replicas belong in one launch or behind the gateway, by whether their requests share prefixes"
          >
            One launch with --dp-size, or separate servers behind the gateway
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--dp-size N</code> runs N replicas inside one launch, and its
            DataParallelController hands them requests round-robin by default, except on a
            disaggregated prefill server (section 3, The SGLang Runtime){' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/entrypoints/engine.py', 'L904-L984')}>
              engine.py L904-L984
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/serving_hook.py', 'L210-L227')}
            >
              serving_hook.py L210-L227
            </Cite>
            . The trade, as we read it: a cache-blind balancer inside one launch, against a
            cache-aware one that runs as its own service across separate servers. The SGLang
            documentation recommends the gateway for production DP (data parallelism){' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L176-L184')}>
              SGLang docs: native DP versus the gateway (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Box variant="p">
            On one host, <code>python -m sglang_router.launch_server --dp-size N --tp-size T</code>{' '}
            builds the gateway version: N independent servers on consecutive GPU ranges, ports from
            31000, and the gateway in front{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${GW}/bindings/python/src/sglang_router/launch_server.py`, 'L86-L112')}
            >
              launch_server.py L86-L112
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${GW}/bindings/python/src/sglang_router/launch_server.py`, 'L169-L228')}
            >
              launch_server.py L169-L228
            </Cite>
            . For a server running attention DP inside its TP (tensor parallelism) group (section
            14, Parallelism), <code>--dp-aware</code> makes each DP rank its own routing target{' '}
            <Cite tier={1} href={sglangUrl(WORKER, 'L985-L1115')}>
              worker.rs L985-L1115
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L189-L191')}>
              main.rs L189-L191
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The published figure for cache-aware routing, a December 2024 project claim">
            <Box variant="p">
              LMSYS (Large Model Systems Organization) reports throughput rising from 82,665 to
              158,596 tokens per second and cache hit rate from 20% to 75% with the cache-aware
              router, on 8 A100 80GB GPUs with <code>--dp-size 8</code>, Llama-3.1-8B-Instruct and a
              generated workload of long shared-prefix groups{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L254-L286')}>
                SGLang docs: cache-aware routing performance (v0.5.22 source)
              </Cite>{' '}
              <Cite tier={2} href={LMSYS_V04}>
                LMSYS blog, 2024-12-04 (project claim)
              </Cite>
              . It measures SGLang v0.4, not v0.5.22, on a workload built to share prefixes.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the policy to your traffic and launcher, and set the knobs by the names and defaults the code has"
          >
            Pick a policy, then set its knobs from the code
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Eight policies exist, and <code>cache_aware</code> is the default in both launchers{' '}
            <Cite tier={1} href={sglangUrl(`${POL}/factory.rs`, 'L17-L75')}>
              factory.rs L17-L75
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L25-L54')}>
              router_args.py L25-L54
            </Cite>
            . The Python launcher, <code>python -m sglang_router.launch_router</code>, accepts all
            eight. The standalone <code>sgl-model-gateway</code> binary accepts six and rejects{' '}
            <code>bucket</code> and <code>consistent_hashing</code>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L150-L151')}>
              main.rs L150-L151
            </Cite>
            , although the documentation&apos;s policy table offers <code>--policy bucket</code>{' '}
            without naming a launcher{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L885-L887')} kind="doc-code-conflict">
              SGLang docs: policy table (v0.5.22 source)
            </Cite>
            . Run those two through the Python launcher.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">The eight policies</Header>}
            items={POLICY_ROWS}
            columnDefinitions={[
              { id: 'policy', header: 'Policy', cell: (r) => r.policy, minWidth: 130 },
              { id: 'routes', header: 'Routes by', cell: (r) => r.routes, minWidth: 320 },
              { id: 'launcher', header: 'Launcher', cell: (r) => r.launcher, minWidth: 110 },
            ]}
          />
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">The cache_aware knobs</Header>}
            items={KNOB_ROWS}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r) => r.flag, minWidth: 180 },
              { id: 'def', header: 'Default at v0.5.22', cell: (r) => r.def, minWidth: 110 },
              { id: 'effect', header: 'What it changes', cell: (r) => r.effect, minWidth: 260 },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Defaults:{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L153-L171')}>
              main.rs L153-L171
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L59-L63')}>
              router_args.py L59-L63
            </Cite>
            . Tree pruning:{' '}
            <Cite tier={1} href={sglangUrl(TREE, 'L718-L775')}>
              tree.rs L718-L775
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Where the documentation's knob table differs from the code">
            <Box variant="p">
              The documentation lists <code>--eviction-interval-secs</code> at 120{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L932-L934')} kind="doc-code-conflict">
                SGLang docs: eviction interval (v0.5.22 source)
              </Cite>
              ; 120 holds for the binary, whose flag is <code>--eviction-interval</code>{' '}
              <Cite tier={1} href={sglangUrl(MAIN, 'L165-L167')}>
                main.rs L165-L167
              </Cite>
              , while the Python launcher takes <code>--eviction-interval-secs</code> and defaults to
              60{' '}
              <Cite tier={1} href={sglangUrl(RARGS, 'L62')}>
                router_args.py L62
              </Cite>
              . It calls <code>--max-tree-size</code> a node count{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L937-L939')} kind="doc-code-conflict">
                SGLang docs: max tree size (v0.5.22 source)
              </Cite>
              ; the code counts characters per worker and prunes only at each interval{' '}
              <Cite tier={1} href={sglangUrl(TREE, 'L718-L775')}>
                tree.rs L718-L775
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">Two traps, read from source and not run:</Box>
          <ul>
            <li>
              A worker registered with its own policy name, the per-model path used in multi-model
              mode, gets a <code>cache_aware</code> policy built from hard-coded values: threshold
              0.5, balance 32 and 1.1, eviction every 30 s and 10,000 characters per worker. The
              command-line tuning flags never reach it{' '}
              <Cite tier={1} href={sglangUrl(`${POL}/registry.rs`, 'L168-L197')} kind="code">
                registry.rs L168-L197
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${POL}/mod.rs`, 'L107-L115')} kind="code">
                mod.rs L107-L115
              </Cite>
              .
            </li>
            <li>
              <code>prefix_hash</code> needs token ids, and the HTTP routers pass none, so with HTTP
              workers every request finds no worker and gets HTTP 503{' '}
              <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L170-L178')} kind="code">
                router.rs L170-L178
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${POL}/prefix_hash.rs`, 'L201-L221')} kind="code">
                prefix_hash.rs L201-L221
              </Cite>
              .
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Front prefill and decode pools with one gateway, and give each role the policy that suits it"
          >
            PD mode: one request, two legs, one room id
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            With PD (prefill/decode) disaggregation the gateway turns each request into a prefill
            call and a decode call, sent together. <code>--pd-disaggregation</code> turns it on, with
            one <code>--prefill URL [BOOTSTRAP_PORT]</code> per prefill server and one{' '}
            <code>--decode URL</code> per decode server{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L24-L52')}>
              main.rs L24-L52
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L197-L219')}>
              main.rs L197-L219
            </Cite>
            . The optional number is that server&apos;s <code>--disaggregation-bootstrap-port</code>,
            not its HTTP port. Left out, the decode server substitutes its own, which works only
            while every server uses the same port, 8998 unless changed{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L242-L300')} kind="code">
              pd_router.rs L242-L300
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/managers/scheduler.py', 'L2847-L2848')} kind="code">
              scheduler.py L2847-L2848
            </Cite>
            . When prefill servers use different ports, list each one:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{PD_LAUNCH}</pre>
          <Box variant="p">
            The gateway picks a prefill and a decode worker, stamps the request with the prefill
            server&apos;s bootstrap host and port and a fresh random room id, and sends it to both.
            The servers meet through the prefill bootstrap registry, and the KV never passes through
            the gateway{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L652-L720')}>
              pd_router.rs L652-L720
            </Cite>
            ; section 15, PD Disaggregation, covers the worker side. If prefill fails, the gateway
            closes the decode connection, so decode aborts instead of holding its reserved KV until
            a timeout, and only the prefill worker is charged with the failure{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L722-L760')}>
              pd_router.rs L722-L760
            </Cite>
            . The client gets the decode stream, with prompt logprobs spliced in from prefill{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L825-L890')}>
              pd_router.rs L825-L890
            </Cite>
            . A retry runs the pair selection again, which can return the same pair, with a new
            room{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L369-L430')}>
              pd_router.rs L369-L430
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>--prefill-policy</code> and <code>--decode-policy</code> choose each side
            separately and fall back to <code>--policy</code>{' '}
            <Cite tier={1} href={sglangUrl(`${POL}/registry.rs`, 'L228-L255')}>
              registry.rs L228-L255
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L976-L1055')}>
              pd_router.rs L976-L1055
            </Cite>
            . Prefix reuse happens on prefill, since a decode server runs with its radix cache off by
            default (section 15); the binary&apos;s own help pairs <code>cache_aware</code> on
            prefill with <code>power_of_two</code> on decode{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L106-L112')}>
              main.rs L106-L112
            </Cite>
            . <code>cache_aware</code> keeps a tree per pool, so decode choices never overwrite
            prefill ownership{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L76-L101')}>
              cache_aware.rs L76-L101
            </Cite>
            , and <code>bucket</code> is accepted for prefill and refused for decode{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/config/validation.rs`, 'L599-L604')}>
              validation.rs L599-L604
            </Cite>
            . Read from source, not run: with <code>grpc://</code> prefill and decode workers the
            gateway applies the main <code>--policy</code> to both roles{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${GW}/src/routers/grpc/common/stages/worker_selection.rs`, 'L194-L256')}
              kind="code"
            >
              worker_selection.rs L194-L256
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put the client-facing key on the gateway, keep the worker admin plane out of reach, and block the one route it passes through"
          >
            Authenticate at the gateway
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The gateway&apos;s own authentication has two layers, both off by default, so set a key
            before the port is reachable. Our reading of the code, not run: without one, every route
            is open, <code>POST /workers</code> included, which adds a worker URL to the routing
            set{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L633-L638')} kind="code">
              server.rs L633-L638
            </Cite>
            , and both launchers bind 0.0.0.0 by default{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L136-L138')}>
              main.rs L136-L138
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L41')}>
              router_args.py L41
            </Cite>
            , where an SGLang server binds 127.0.0.1{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/serving.py', 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>--api-key</code> sets one bearer key on the inference, admin, worker-management and
            mesh routes{' '}
            <Cite tier={1} href={sglangUrl(MW, 'L107-L147')}>
              middleware.rs L107-L147
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L583-L587')}>
              server.rs L583-L587
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L641-L674')}>
              server.rs L641-L674
            </Cite>
            , and the gateway sends the same key to the workers it registers from its command line
            or from discovery, so one key can guard both hops{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/core/job_queue.rs`, 'L496-L601')} kind="code">
              job_queue.rs L496-L601
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/service_discovery.rs`, 'L480-L489')} kind="code">
              service_discovery.rs L480-L489
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L550-L556')} kind="code">
              router.rs L550-L556
            </Cite>
            . On the admin and worker routes, <code>--control-plane-api-keys id:name:role:key</code>{' '}
            (role <code>admin</code> or <code>user</code>) or JWT (JSON Web Token) validation against
            an OIDC (OpenID Connect) issuer (<code>--jwt-issuer</code>, <code>--jwt-audience</code>)
            replaces that check once configured{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L563-L606')}>
              main.rs L563-L606
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L1124-L1131')}>
              main.rs L1124-L1131
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L641-L655')}>
              server.rs L641-L655
            </Cite>
            , through the external <code>smg-auth</code> 1.0.0 crate{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L86')}>
              Cargo.toml L86
            </Cite>
            . <code>--tls-cert-path</code> and <code>--tls-key-path</code> add TLS (Transport Layer
            Security){' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L537-L545')}>
              main.rs L537-L545
            </Cite>
            . A multi-tokenizer server, which cannot use its own keys (section 12, Talking to
            SGLang), authenticates here.
          </Box>
          <Box variant="p">
            The gateway serves a fixed list of paths and answers 404 to any other{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L544-L692')} kind="code">
              server.rs L544-L692
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L94-L96')} kind="code">
              server.rs L94-L96
            </Cite>
            . A worker&apos;s weight-update, memory and pause routes (section 12) are not on that
            list, and a search of the gateway&apos;s source found no call to them;
            it does fan the worker&apos;s <code>/flush_cache</code> out to every worker, behind its
            own key check{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L401-L405')}>
              server.rs L401-L405
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/core/worker_manager.rs`, 'L36-L67')}>
              worker_manager.rs L36-L67
            </Cite>
            .
          </Box>
          <Box variant="p">
            One route needs blocking in front of the gateway. Read from code, not run:{' '}
            <code>/server_info</code> and <code>/get_server_info</code> sit in the gateway&apos;s
            public route group, outside every gateway key check, and the HTTP routers answer them by
            proxying to the first worker{' '}
            <Cite tier={1} href={sglangUrl(SERVER, 'L593-L605')} kind="code">
              server.rs L593-L605
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L92-L131')} kind="code">
              router.rs L92-L131
            </Cite>
            . Section 12 reads a worker&apos;s <code>/server_info</code> as carrying both its keys
            in plain text, so by our reading a gateway client gets them on the same terms as calling
            the worker directly. Block both paths at the load balancer or ingress in front of the
            gateway.
          </Box>
          <ExpandableSection headerText="Which worker answers /server_info, and when it refuses">
            <Box variant="p">
              The regular router forwards the client&apos;s <code>Authorization</code> header{' '}
              <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L92-L131')} kind="code">
                router.rs L92-L131
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${GW}/src/routers/header_utils.rs`, 'L207-L219')}>
                header_utils.rs L207-L219
              </Cite>
              , so a worker with <code>--api-key</code> answers only clients holding that key. In PD
              mode the first prefill worker is asked with no headers{' '}
              <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L1541-L1545')} kind="code">
                pd_router.rs L1541-L1545
              </Cite>
              , so it answers only if its inference routes take no key. With{' '}
              <code>--enable-igw</code> the gateway returns its own summary{' '}
              <Cite tier={1} href={sglangUrl(`${GW}/src/routers/router_manager.rs`, 'L426-L437')} kind="code">
                router_manager.rs L426-L437
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
            description="Know the retry, breaker and health defaults before a worker dies, and where the gateway reports them"
          >
            Operating the gateway
          </Header>
        }
      >
        <Table
          variant="embedded"
          wrapLines
          trackBy="id"
          items={OPS_ROWS}
          columnDefinitions={[
            { id: 'feature', header: 'Feature', cell: (r) => r.feature, minWidth: 130 },
            { id: 'behaviour', header: 'Default behaviour at v0.5.22', cell: (r) => r.behaviour, minWidth: 380 },
          ]}
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick a router by where its cache signal comes from, and turn the engine's events on when it needs them"
          >
            Remembered text or KV events: two ways to know where a prefix lives
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every cache-aware router answers one question, which worker holds this prefix, in one of
            two ways:
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h4">Remember where text went</Box>
              <Box variant="p">
                The shipping gateway&apos;s <code>cache_aware</code>: nothing needed from the
                engine, and blind to evictions inside a worker and to other routers&apos; traffic.
                No KV-event consumer was found in the gateway&apos;s source at
                v0.5.22{' '}
                <Cite tier={1} href={sglangTreeUrl(`${GW}/src`)}>
                  sgl-model-gateway/src at v0.5.22
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h4">Subscribe to the engine&apos;s KV events</Box>
              <Box variant="p">
                The experimental <code>sgl-router</code> in the same repository, version 0.1.0,
                unpublished and built from source{' '}
                <Cite tier={1} href={sglangUrl(`${EXP}/Cargo.toml`, 'L1-L20')}>
                  experimental/sgl-router/Cargo.toml L1-L20
                </Cite>
                , hashes the prompt page by page as the worker does and looks the hashes up{' '}
                <Cite tier={1} href={sglangUrl(`${EXP}/src/state/kv_events/subscriber.rs`, 'L1-L25')}>
                  subscriber.rs L1-L25
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(`${EXP}/src/state/kv_events/hash.rs`, 'L57-L75')}>
                  hash.rs L57-L75
                </Cite>
                ; its default policy is <code>round_robin</code>, with <code>cache_aware</code>{' '}
                opt-in{' '}
                <Cite tier={1} href={sglangUrl(`${EXP}/src/config/cli.rs`, 'L224-L262')}>
                  cli.rs L224-L262
                </Cite>
                . llm-d, for its precise prefix routing{' '}
                <Cite tier={1} href={LLMD_SGLANG}>
                  llm-d v1.0.0: SGLang model server
                </Cite>
                , and NVIDIA Dynamo{' '}
                <Cite tier={1} href={DYNAMO_SGLANG_ROUTER}>
                  Dynamo v1.6.0: SGLang KV router example
                </Cite>{' '}
                read the same stream (section 18, Multi-Node and Kubernetes Orchestrators).
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <code>--kv-events-config</code> on every worker turns recording on{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/observability.py', 'L144-L147')}>
              observability.py L144-L147
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/managers/scheduler.py', 'L577-L582')}>
              scheduler.py L577-L582
            </Cite>
            , but the publisher defaults to <code>null</code>, so <code>{`'{}'`}</code> records
            events and publishes none; publish with{' '}
            <code>{`--kv-events-config '{"publisher":"zmq","endpoint":"tcp://*:5557"}'`}</code>{' '}
            <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L684-L732')}>
              kv_events.py L684-L732
            </Cite>
            . Events travel over ZMQ (ZeroMQ), one port per DP rank{' '}
            <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L388-L450')}>
              kv_events.py L388-L450
            </Cite>
            , one block per page, so at page size 1 a 4,000-token prompt yields 4,000 block
            hashes{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/events.py', 'L161-L217')}>
              mem_cache/events.py L161-L217
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> the SGLang gateway routes cache-aware out of the box, from
            remembered prompt text, where vLLM&apos;s common Kubernetes router routes round-robin
            until a cache-aware policy is chosen ({VLLM_K8S_ROUTER_LINK}). vLLM&apos;s Rust router,{' '}
            <code>vllm-project/router</code>, is a fork of the SGLang gateway{' '}
            <Cite tier={1} href={VLLM_ROUTER_FORK}>
              vllm-project/router v0.1.16 README L339
            </Cite>
            . In both ecosystems a router either remembers where it sent text or subscribes to the
            engine&apos;s KV events ({VLLM_LLMD_LINK}).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the gateway compiled from your engine's tag, and know which other builds carry the same name"
          >
            Install the gateway that matches v0.5.22
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Use the gateway inside <code>lmsysorg/sglang:v0.5.22</code>: the image builds the{' '}
            <code>sgl-model-gateway</code> binary onto <code>PATH</code> and installs the{' '}
            <code>sglang_router</code> package, both from the tag, so one image serves as worker and
            as gateway{' '}
            <Cite tier={1} href={sglangUrl('docker/Dockerfile', 'L351-L377')}>
              Dockerfile L351-L377
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('docker/Dockerfile', 'L623-L627')}>
              Dockerfile L623-L627
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('docker/Dockerfile', 'L741')}>
              Dockerfile L741
            </Cite>
            . Elsewhere, build <code>sgl-model-gateway/</code> from the v0.5.22 tag rather than{' '}
            <code>pip install sglang-router</code>, which gives the January 2026 build on PyPI
            (Python Package Index){' '}
            <Cite tier={1} href={PYPI_ROUTER}>
              PyPI: sglang-router 0.3.2
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What ships where, and why two gateways share one name">
            <SpaceBetween size="s">
              <Box variant="p">
                The crate builds one binary under three names, <code>sgl-model-gateway</code>,{' '}
                <code>smg</code> and <code>amg</code>{' '}
                <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L5-L34')}>
                  Cargo.toml L5-L34
                </Cite>
                , and the Python package <code>sglang-router</code> 0.3.2 wraps the same code{' '}
                <Cite tier={1} href={sglangUrl(`${GW}/bindings/python/pyproject.toml`, 'L5-L53')}>
                  bindings/python/pyproject.toml L5-L53
                </Cite>
                . Parsers, tokenizer, authentication and mesh come from pinned external crates such
                as <code>smg-auth</code> and <code>smg-mesh</code>; the SGLang tree holds the routing
                core{' '}
                <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L82-L114')}>
                  Cargo.toml L82-L114
                </Cite>
                .
              </Box>
              <Box variant="p">
                SMG (Shepherd Model Gateway) is the same codebase in its own repository, its history
                starting at the December 2024 SGLang commit that created <code>sgl-router</code>{' '}
                <Cite tier={1} href={SMG_FIRST_COMMIT}>
                  smg-project/smg commit e26a184e
                </Cite>
                , and since its 1.0 release in February 2026 it fronts several engines, vLLM among
                them{' '}
                <Cite tier={1} href={SMG_V101}>
                  SMG v1.0.1 release notes
                </Cite>{' '}
                <Cite tier={1} href={SMG_README_1130}>
                  SMG v1.13.0 README
                </Cite>
                . It is at v1.13.0 (2026-10-15), <code>pip install smg</code>{' '}
                <Cite tier={1} href={SMG_V1130}>
                  SMG v1.13.0 release
                </Cite>
                . New gateway features land there, while SGLang keeps fixing its 0.3.2 copy for its
                own features, such as DP-aware routing{' '}
                <Cite tier={1} href={GW_COMMITS}>
                  commit history of sgl-model-gateway at v0.5.22
                </Cite>
                . SGLang&apos;s docs expand SMG as SGLang Model Gateway{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L180')}>
                  SGLang docs: SMG naming (v0.5.22 source)
                </Cite>
                .
              </Box>
              <Box variant="p">
                The documented installs, <code>pip install sglang-router</code> and the image{' '}
                <code>lmsysorg/sgl-model-gateway:latest</code>{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L100-L138')}>
                  SGLang docs: Docker image (v0.5.22 source)
                </Cite>{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L1702-L1712')}>
                  SGLang docs: Python bindings (v0.5.22 source)
                </Cite>
                , both stopped at 0.3.2. The PyPI wheel dates from 2026-01-15
                and its <code>--policy</code> lacks <code>bucket</code>,{' '}
                <code>consistent_hashing</code> and <code>prefix_hash</code>{' '}
                <Cite tier={1} href={PYPI_ROUTER}>
                  PyPI: sglang-router 0.3.2
                </Cite>
                , and the image&apos;s <code>latest</code> and <code>v0.3.2</code> tags were
                last pushed on 2026-05-27{' '}
                <Cite tier={1} href={DOCKER_GW}>
                  Docker Hub: lmsysorg/sgl-model-gateway tags
                </Cite>
                . The documented <code>pip install &quot;sglang[all]&quot;</code>{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(DPA_DOC, 'L308-L314')} kind="doc-code-conflict">
                  SGLang docs: gateway quick start (v0.5.22 source)
                </Cite>{' '}
                does not include <code>sglang-router</code> at v0.5.22{' '}
                <Cite tier={1} href={sglangUrl('python/pyproject.toml', 'L198-L203')}>
                  pyproject.toml L198-L203
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Then start with <code>cache_aware</code>, set <code>--api-key</code>, and measure what
            share of a typical prompt&apos;s characters your requests have in common. Affinity
            applies only above <strong>30% of the prompt</strong>, so traffic whose only shared part
            is a shorter system prompt is balanced by load alone until <code>--cache-threshold</code>{' '}
            sits below that share.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
