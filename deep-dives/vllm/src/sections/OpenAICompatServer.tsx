import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// Paths and docs pages cited more than once on this page (all pinned to v0.31.0 by Cite helpers).
const AUTH = 'vllm/entrypoints/serve/middleware/authenticate.py';
const CLI_ARGS = 'vllm/entrypoints/launchers/cli_args.py';
const ROUTERS = 'vllm/entrypoints/launchers/api_server/routers.py';
const README = 'docs/serving/online_serving/README.md';
const SECURITY_MD = 'docs/usage/security.md';
const TOOL_MD = 'docs/features/tool_calling.md';
const CHAT_PROTOCOL = 'vllm/entrypoints/openai/chat_completion/protocol.py';
const SO_DOCS = vllmDocsUrl('features/structured_outputs/');
const TOOL_DOCS = vllmDocsUrl('features/tool_calling/');
const MM_DOCS = vllmDocsUrl('features/multimodal_inputs/');

interface SurfaceLine {
  t: string;
  note?: string;
  kind?: 'route' | 'label' | 'empty';
}

interface SurfaceColumn {
  title: string;
  sub: string;
  optIn?: boolean;
  guarded: SurfaceLine[];
  open: SurfaceLine[];
}

const surfaceColumns: SurfaceColumn[] = [
  {
    title: 'OpenAI mirrors',
    sub: 'point any OpenAI SDK here',
    guarded: [
      { t: '/v1/chat/completions' },
      { t: '/v1/chat/completions/batch' },
      { t: '/v1/completions' },
      { t: '/v1/responses' },
      { t: '/v1/responses/{id}[/cancel]' },
      { t: '/v1/embeddings' },
      { t: '/v1/audio/transcriptions' },
      { t: '/v1/audio/translations' },
      { t: '/v1/realtime', note: 'WebSocket' },
      { t: '/v1/models' },
    ],
    open: [{ t: 'none: every route is under /v1', kind: 'empty' }],
  },
  {
    title: 'Cross-vendor mirrors',
    sub: "for other vendors' SDKs",
    guarded: [
      { t: '/v1/messages', note: 'Anthropic' },
      { t: '/v1/messages/count_tokens' },
      { t: '/v2/embed', note: 'Cohere' },
      { t: '/v1/rerank, /v2/rerank' },
    ],
    open: [
      { t: '/rerank', note: 'Jina, Cohere' },
      { t: '/invocations', note: 'SageMaker' },
      { t: '/ping', note: 'SageMaker' },
    ],
  },
  {
    title: 'vLLM-native and utility',
    sub: 'pooling, scoring, tokens, ops',
    guarded: [{ t: '/v1/score' }],
    open: [
      { t: '/pooling, /classify' },
      { t: '/score' },
      { t: '/generative_scoring' },
      { t: '/tokenize, /detokenize' },
      { t: '/health, /version, /load' },
      { t: '/metrics' },
      { t: '/scale_elastic_ep' },
    ],
  },
  {
    title: 'Opt-in',
    sub: 'off until a flag or env var',
    optIn: true,
    guarded: [
      { t: '--enable-scale-out', kind: 'label' },
      { t: '/v1/*/render' },
      { t: '/v1/*/derender' },
      { t: '/inference/v1/generate' },
      { t: 'VLLM_ENABLE_COHERE_API=1', kind: 'label' },
      { t: '/cohere/v2/chat' },
    ],
    open: [
      { t: 'VLLM_SERVER_DEV_MODE=1', kind: 'label' },
      { t: '/sleep, /wake_up' },
      { t: '/pause, /resume' },
      { t: '/collective_rpc' },
      { t: '/reset_*_cache' },
      { t: '/server_info' },
      { t: 'weight-transfer routes', kind: 'empty' },
    ],
  },
];

function EndpointSurfaceDiagram() {
  const W = 940;
  const colW = 214;
  const gap = 12;
  const x0 = 24;
  const colX = (i: number) => x0 + i * (colW + gap);
  const colCx = (i: number) => colX(i) + colW / 2;
  const lineH = 15;

  const rootY = 14;
  const rootH = 36;
  const busY = 66;
  const headY = 80;
  const headH = 46;

  const maxGuarded = Math.max(...surfaceColumns.map((c) => c.guarded.length));
  const maxOpen = Math.max(...surfaceColumns.map((c) => c.open.length));

  const b1Y = headY + headH + 14;
  const b1First = b1Y + 38;
  const b1H = 38 + (maxGuarded - 1) * lineH + 16;
  const b2Y = b1Y + b1H + 14;
  const b2First = b2Y + 38;
  const b2H = 38 + (maxOpen - 1) * lineH + 16;
  const H = b2Y + b2H + 14;

  const renderLines = (lines: SurfaceLine[], i: number, firstY: number) =>
    lines.map((ln, j) => {
      const y = firstY + j * lineH;
      const x = colX(i) + 12;
      if (ln.kind === 'label') {
        return (
          <text key={ln.t} x={x} y={y} className="eps-lbl">
            {ln.t}
          </text>
        );
      }
      if (ln.kind === 'empty') {
        return (
          <text key={ln.t} x={x} y={y} className="eps-empty">
            {ln.t}
          </text>
        );
      }
      return (
        <text key={ln.t} x={x} y={y} className="eps-r">
          {ln.t}
          {ln.note && (
            <tspan className="eps-n" dx={8}>
              {ln.note}
            </tspan>
          )}
        </text>
      );
    });

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="endpoint-surface-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="endpoint-surface-title">
          vllm serve exposes OpenAI mirrors, cross-vendor mirrors, vLLM-native and utility routes,
          and an opt-in set for scale-out and development. The --api-key check is a path-prefix
          test, so it guards every route under /v1, /v2, /inference and /cohere and none of the
          others: /invocations, /rerank, /score, /pooling, /classify, /tokenize, /health, /metrics
          and every dev-mode route answer without a key.
        </title>
        <style>{`
          .eps-root { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .eps-rt   { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .eps-head { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .eps-headx { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .eps-ht   { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .eps-hs   { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .eps-b1   { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.4; }
          .eps-b2   { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.4; }
          .eps-bl1  { fill: #065299; font: 600 12px sans-serif; }
          .eps-bl2  { fill: #8a3f00; font: 600 12px sans-serif; }
          .eps-r    { fill: #16191f; font: 11px ui-monospace, Menlo, Consolas, monospace; }
          .eps-n    { fill: #5f6b7a; font: 11px sans-serif; }
          .eps-lbl  { fill: #414d5c; font: 600 11px ui-monospace, Menlo, Consolas, monospace; }
          .eps-empty { fill: #5f6b7a; font: italic 11px sans-serif; }
          .eps-sep  { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
          .eps-wire { stroke: #0972d3; stroke-width: 1.5; fill: none; }
        `}</style>
        <defs>
          <marker
            id="eps-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
        </defs>

        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        {/* Root: the one process every client talks to */}
        <rect x={W / 2 - 160} y={rootY} width={320} height={rootH} rx={6} className="eps-root" />
        <text x={W / 2} y={rootY + 23} className="eps-rt">
          vllm serve &#8594; http://host:8000
        </text>

        {/* Fan-out: root -> bus -> each family header */}
        <line x1={W / 2} y1={rootY + rootH} x2={W / 2} y2={busY} className="eps-wire" />
        <line x1={colCx(0)} y1={busY} x2={colCx(3)} y2={busY} className="eps-wire" />
        {surfaceColumns.map((c, i) => (
          <line
            key={`drop-${c.title}`}
            x1={colCx(i)}
            y1={busY}
            x2={colCx(i)}
            y2={headY - 2}
            className="eps-wire"
            markerEnd="url(#eps-ah)"
          />
        ))}

        {/* Family headers */}
        {surfaceColumns.map((c, i) => (
          <g key={`head-${c.title}`}>
            <rect
              x={colX(i)}
              y={headY}
              width={colW}
              height={headH}
              rx={6}
              className={c.optIn ? 'eps-headx' : 'eps-head'}
            />
            <text x={colCx(i)} y={headY + 19} className="eps-ht">
              {c.title}
            </text>
            <text x={colCx(i)} y={headY + 36} className="eps-hs">
              {c.sub}
            </text>
          </g>
        ))}

        {/* Band 1: paths the key check covers */}
        <rect x={12} y={b1Y} width={W - 24} height={b1H} rx={6} className="eps-b1" />
        <text x={x0 + 12} y={b1Y + 18} className="eps-bl1">
          Behind --api-key: every path under /v1, /v2, /inference or /cohere
        </text>

        {/* Band 2: paths the key check never sees */}
        <rect x={12} y={b2Y} width={W - 24} height={b2H} rx={6} className="eps-b2" />
        <text x={x0 + 12} y={b2Y + 18} className="eps-bl2">
          Open: no key is checked, even with --api-key set
        </text>

        {/* Column separators inside each band */}
        {[1, 2, 3].map((i) => (
          <g key={`sep-${i}`}>
            <line
              x1={colX(i) - gap / 2}
              y1={b1Y + 26}
              x2={colX(i) - gap / 2}
              y2={b1Y + b1H - 8}
              className="eps-sep"
            />
            <line
              x1={colX(i) - gap / 2}
              y1={b2Y + 26}
              x2={colX(i) - gap / 2}
              y2={b2Y + b2H - 8}
              className="eps-sep"
            />
          </g>
        ))}

        {surfaceColumns.map((c, i) => (
          <g key={`routes-${c.title}`}>
            {renderLines(c.guarded, i, b1First)}
            {renderLines(c.open, i, b2First)}
          </g>
        ))}
      </svg>
    </div>
  );
}

interface RouteRow {
  api: string;
  route: string;
  family: string;
  auth: string;
  applies: string;
}

const routeRows: RouteRow[] = [
  {
    api: 'Chat Completions',
    route: '/v1/chat/completions',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies: 'Generative models with a chat template. user is ignored.',
  },
  {
    api: 'Chat Completions batch',
    route: '/v1/chat/completions/batch',
    family: 'OpenAI-style, vLLM addition',
    auth: 'Guarded',
    applies:
      'Several conversations in one request, one choice per conversation. No streaming, tools or beam search.',
  },
  {
    api: 'Completions',
    route: '/v1/completions',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies: 'Text-generation models. suffix not supported.',
  },
  {
    api: 'Responses',
    route: '/v1/responses, /v1/responses/{response_id}, /v1/responses/{response_id}/cancel',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies:
      'Text-generation models. Retrieve and cancel find only stored responses, and store is ignored unless VLLM_ENABLE_RESPONSES_API_STORE=1, which keeps every response in process memory with no eviction.',
  },
  {
    api: 'Embeddings',
    route: '/v1/embeddings',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies: 'Embedding models only.',
  },
  {
    api: 'Audio',
    route: '/v1/audio/transcriptions, /v1/audio/translations, /v1/realtime (WebSocket)',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies: 'ASR models only; /v1/realtime needs a model with realtime support.',
  },
  {
    api: 'Models',
    route: '/v1/models',
    family: 'OpenAI mirror',
    auth: 'Guarded',
    applies: 'Lists the models the server serves.',
  },
  {
    api: 'Anthropic Messages',
    route: '/v1/messages, /v1/messages/count_tokens',
    family: 'Cross-vendor',
    auth: 'Guarded',
    applies: 'For clients written against the Anthropic Messages API.',
  },
  {
    api: 'Cohere Embed',
    route: '/v2/embed',
    family: 'Cross-vendor',
    auth: 'Guarded',
    applies: "Compatible with Cohere's Embed API; any embedding model, multimodal ones included.",
  },
  {
    api: 'Rerank (Cohere / Jina)',
    route: '/v1/rerank, /v2/rerank, /rerank',
    family: 'Cross-vendor',
    auth: 'Guarded except /rerank',
    applies: 'Score models; implements Jina v1 and Cohere v1/v2 rerank.',
  },
  {
    api: 'Cohere Chat',
    route: '/cohere/v2/chat',
    family: 'Cross-vendor, opt-in',
    auth: 'Guarded',
    applies: 'Registered only with VLLM_ENABLE_COHERE_API=1 and the cohere SDK installed.',
  },
  {
    api: 'SageMaker',
    route: '/invocations, /ping',
    family: 'Cross-vendor',
    auth: 'Open',
    applies: '/invocations routes to the same inference functions as /v1.',
  },
  {
    api: 'Score',
    route: '/v1/score, /score',
    family: 'vLLM-native',
    auth: 'Guarded except /score',
    applies: 'Cross-encoder, bi-encoder and late-interaction score models.',
  },
  {
    api: 'Classification, pooling',
    route: '/classify, /pooling',
    family: 'vLLM-native',
    auth: 'Open',
    applies: 'Classification models; /pooling serves any pooling model.',
  },
  {
    api: 'Generative scoring',
    route: '/generative_scoring',
    family: 'vLLM-native',
    auth: 'Open',
    applies: 'Generative models: next-token probabilities for the label token IDs you pass.',
  },
  {
    api: 'Tokenizer',
    route: '/tokenize, /detokenize, /tokenizer_info',
    family: 'Utility',
    auth: 'Open',
    applies:
      '/tokenizer_info exists only with --enable-tokenizer-info-endpoint, and can expose the chat template.',
  },
  {
    api: 'Health and operations',
    route: '/health, /version, /load, /metrics, /scale_elastic_ep',
    family: 'Utility',
    auth: 'Open',
    applies: '/scale_elastic_ep is registered for every generative model.',
  },
  {
    api: 'Scale-out',
    route:
      '/v1/{chat/completions, completions, responses, messages}/render, /v1/{chat/completions, completions}/derender, /inference/v1/generate',
    family: 'Opt-in',
    auth: 'Guarded',
    applies: '--enable-scale-out on vllm serve; always on under vllm launch render and vllm serve --tokens-only.',
  },
  {
    api: 'Dev mode',
    route:
      '/sleep, /wake_up, /pause, /resume, /collective_rpc, /reset_prefix_cache, /server_info, weight-transfer routes',
    family: 'Opt-in',
    auth: 'Open',
    applies: 'Registered only with VLLM_SERVER_DEV_MODE=1.',
  },
];

export function OpenAICompatServer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The HTTP surface an integrator talks to: the routes vllm serve exposes, what the API key protects, and where the server departs from OpenAI's behavior (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            12. The OpenAI-Compatible Server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The drop-in proposition.</strong> vLLM ships an HTTP server that speaks
            OpenAI&apos;s wire protocol, so client code written against OpenAI keeps working when you
            point it at your own GPUs. One command, <code>vllm serve</code>, starts a server that
            &quot;implements OpenAI&apos;s Completions API, Chat API, and more&quot;{' '}
            <Cite tier={1} href={vllmUrl('docs/serving/online_serving/openai_compatible_server.md', 'L3')}>
              openai_compatible_server.md L3
            </Cite>
            . The integration cost is a base-URL swap and an API key:
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Start the server
vllm serve NousResearch/Meta-Llama-3-8B-Instruct \
  --dtype auto \
  --api-key token-abc123

# Same OpenAI SDK, different base_url
client = OpenAI(base_url="http://localhost:8000/v1",
                api_key="token-abc123")`}</pre>
          </Box>
          <Box variant="p">
            Because the contract is OpenAI&apos;s, the official OpenAI Python client talks to it
            unchanged{' '}
            <Cite tier={1} href={vllmUrl('docs/serving/online_serving/openai_compatible_server.md', 'L166-L167')}>
              openai_compatible_server.md L166-L167
            </Cite>
            , and so does other client code that already speaks <code>/v1/chat/completions</code>:
            your call sites stay as they are.
          </Box>
          <Box variant="p">
            <code>vllm serve</code> is the launch command to use. The older{' '}
            <code>python -m vllm.entrypoints.openai.api_server</code> still starts the same server
            after a <code>DeprecationWarning</code> whose text says <code>vllm server</code>; the
            subcommand is <code>vllm serve</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/api_server.py', 'L50-L59')} kind="code">
              api_server.py L50-L59
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L49')} kind="code">
              cli/serve.py L49
            </Cite>
            . The server code itself lives in{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/entrypoints/launchers">
              vllm/entrypoints/launchers/
            </Cite>
            .
          </Box>
          <Alert type="info">
            This section is the <strong>integrator&apos;s view</strong>: the routes, request fields
            and server flags you set from outside. Server flags such as <code>--api-key</code>,{' '}
            <code>--enable-scale-out</code> and <code>--tool-strict-level</code> form the{' '}
            <code>FrontendArgs</code> plane that only the API server reads, traced in{' '}
            <strong>14. Inside the Codebase &rarr; Configuration</strong>. The opt-in Rust frontend
            is mapped in <strong>14. Inside the Codebase &rarr; The Rust Frontend</strong>, and the
            guided-decoding internals in{' '}
            <strong>14. Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which routes your model gets, and which of them --api-key actually guards"
          >
            The endpoint surface
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Routes come in three families plus an opt-in set. <strong>OpenAI mirrors</strong> are
            drop-in compatible with the named OpenAI API. <strong>Cross-vendor mirrors</strong>{' '}
            (Anthropic Messages, Cohere Embed and Rerank, SageMaker) serve clients written against
            those SDKs (software development kits). <strong>vLLM-native and utility routes</strong>{' '}
            cover pooling, scoring, tokenization, health and metrics. The server registers routes by
            the tasks the loaded model supports: a generative model gets chat, completions and
            Responses, an embedding model gets <code>/v1/embeddings</code>, and an ASR (automatic
            speech recognition) model gets the audio routes{' '}
            <Cite tier={1} href={vllmUrl(ROUTERS, 'L39-L67')} kind="code">
              routers.py L39-L67
            </Cite>
            .
          </Box>

          <EndpointSurfaceDiagram />
          <Box variant="small" color="text-body-secondary">
            Main routes, read from the route decorators under <code>vllm/entrypoints</code> at
            v0.31.0. The profiler, runtime LoRA (low-rank adaptation) and fault-tolerance routes are
            left out; each registers only when enabled{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/profile/api_router.py', 'L37-L46')} kind="code">
              profile/api_router.py L37-L46
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/lora/api_router.py', 'L23-L32')} kind="code">
              lora/api_router.py L23-L32
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(ROUTERS, 'L69-L74')} kind="code">
              routers.py L69-L74
            </Cite>
            . Small status routes such as <code>/kv_event_sources</code> and{' '}
            <code>/is_scaling_elastic_ep</code> are left out too. Schematic. Illustrative, not
            measured.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Routes the server speaks</Header>}
            columnDefinitions={[
              { id: 'api', header: 'API', cell: (i) => i.api },
              { id: 'route', header: 'Route(s)', cell: (i) => <code>{i.route}</code> },
              { id: 'family', header: 'Family', cell: (i) => i.family },
              { id: 'auth', header: '--api-key', cell: (i) => i.auth },
              { id: 'applies', header: 'Applies to / notes', cell: (i) => i.applies },
            ]}
            items={routeRows}
          />
          <Box variant="small" color="text-body-secondary">
            Inventory read from the route decorators and{' '}
            <Cite tier={1} href={vllmUrl(README)}>docs/serving/online_serving/README.md</Cite>; the
            Responses store behavior from{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/responses/serving.py', 'L155-L166')} kind="code">
              responses/serving.py L155-L166
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/responses/serving.py', 'L337-L344')} kind="code">
              L337-L344
            </Cite>
            ; the batch limits from{' '}
            <Cite tier={1} href={vllmUrl(CHAT_PROTOCOL, 'L1029-L1041')} kind="code">
              protocol.py L1029-L1041
            </Cite>
            ; the <code>/tokenizer_info</code> gate from{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/tokenize/api_router.py', 'L86-L90')} kind="code">
              tokenize/api_router.py L86-L90
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={vllmUrl(SECURITY_MD, 'L220-L224')}>security.md L220-L224</Cite>. vLLM ships a minor release about every two weeks{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/releases">vLLM GitHub releases</Cite>
            , so check the version you deploy.
          </Box>

          <Box variant="p">
            <strong>Opt-in routes.</strong> <code>--enable-scale-out</code> (off by default)
            registers the render and derender routes and the token-in, token-out{' '}
            <code>/inference/v1/generate</code>; <code>vllm launch render</code> and{' '}
            <code>vllm serve --tokens-only</code> register them regardless{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/scale_out/factories.py', 'L65-L94')} kind="code">
              factories.py L65-L94
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(CLI_ARGS, 'L199-L210')} kind="code">
              cli_args.py L199-L210
            </Cite>
            . Render turns a request into prompt token IDs and sampling parameters without running
            inference, and generate takes token IDs in and returns token IDs{' '}
            <Cite tier={1} href={vllmUrl(README, 'L122-L154')}>README.md L122-L154</Cite>, so text
            handling can run on a different tier from the engine. <code>VLLM_SERVER_DEV_MODE=1</code>{' '}
            adds sleep and wake, pause and resume, RL (reinforcement learning) weight transfer, cache
            resets, <code>/server_info</code> and <code>/collective_rpc</code>, which executes
            arbitrary RPC (remote procedure call) methods on the engine{' '}
            <Cite tier={1} href={vllmUrl(ROUTERS, 'L34-L37')} kind="code">
              routers.py L34-L37
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(README, 'L167-L209')}>README.md L167-L209</Cite>. How an RL
            trainer uses the weight-transfer path, and what its step costs, is in the{' '}
            <Link href="../rl-agentic-loops/">
              RL and agentic learning loops dive, section 19: An RL Step Is an Inference Job Inside a
              Training Job
            </Link>
            . The security
            guide lists pause, resume and weight updates as present on every generative server; the
            code registers them only in dev mode{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/__init__.py', 'L43-L69')} kind="code">
              serve/__init__.py L43-L69
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(SECURITY_MD, 'L198-L209')} kind="doc-code-conflict">
              security.md L198-L209
            </Cite>
            . The Cohere chat route needs <code>VLLM_ENABLE_COHERE_API=1</code> and the{' '}
            <code>cohere</code> package{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cohere/api_router.py', 'L295-L309')} kind="code">
              cohere/api_router.py L295-L309
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>What <code>--api-key</code> protects.</strong> The key check is a path-prefix
            test. It demands the bearer token (answering HTTP 401 without it) only on paths that start
            with <code>/v1</code>, <code>/v2</code>, <code>/inference</code> or <code>/cohere</code>,
            and passes every other path through{' '}
            <Cite tier={1} href={vllmUrl(AUTH, 'L11')} kind="code">
              authenticate.py L11
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(AUTH, 'L47-L62')} kind="code">
              L47-L62
            </Cite>
            . <code>/invocations</code> therefore reaches the same inference functions as{' '}
            <code>/v1</code>{' '}
            <Cite tier={1} href={vllmUrl(README, 'L120')}>README.md L120</Cite> with no key, and <code>/rerank</code>, <code>/score</code>, <code>/pooling</code>,{' '}
            <code>/classify</code>, <code>/generative_scoring</code>, <code>/tokenize</code>,{' '}
            <code>/metrics</code>, <code>/scale_elastic_ep</code> (registered for every generative
            model{' '}
            <Cite tier={1} href={vllmUrl(ROUTERS, 'L46-L50')} kind="code">
              routers.py L46-L50
            </Cite>
            ) and every dev-mode route are open too. The flag&apos;s own help text says &quot;Do not
            rely on <code>--api-key</code> alone to secure vLLM&quot;{' '}
            <Cite tier={1} href={vllmUrl(CLI_ARGS, 'L317-L327')} kind="code">
              cli_args.py L317-L327
            </Cite>
            . To get it right, put the server behind a reverse proxy or gateway that allowlists the
            routes your clients use and blocks the rest, keep <code>VLLM_SERVER_DEV_MODE</code> unset
            on anything a client can reach, and treat the key as one layer{' '}
            <Cite tier={1} href={vllmUrl(SECURITY_MD, 'L146-L152')}>security.md L146-L152</Cite>{' '}
            <Cite tier={1} href={vllmUrl(SECURITY_MD, 'L272-L278')}>L272-L278</Cite>.
          </Box>

          <ExpandableSection headerText="The opt-in Rust frontend serves a subset of these routes">
            <Box variant="p">
              The Rust frontend, <code>vllm-rs</code>, is a separate process that replaces the
              Python API server when <code>vllm serve</code> runs with{' '}
              <code>VLLM_USE_RUST_FRONTEND=1</code>; the environment variable is the only switch{' '}
              <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1441-L1443')} kind="code">
                envs.py L1441-L1443
              </Cite>
              . It serves <code>/v1/chat/completions</code> and <code>/v1/completions</code> with
              streaming, <code>/v1/models</code>, <code>/tokenize</code>, <code>/detokenize</code>,{' '}
              <code>/health</code> and <code>/metrics</code>, adds <code>/inference/v1/generate</code>{' '}
              under <code>--enable-scale-out</code> and the admin routes under dev mode, and registers
              no route for embeddings, Responses, Anthropic Messages or audio{' '}
              <Cite tier={1} href={vllmUrl('rust/src/server/src/routes.rs', 'L83-L158')} kind="code">
                routes.rs L83-L158
              </Cite>
              . Its key check covers <code>/v1</code>, <code>/v2</code> and <code>/inference</code>{' '}
              <Cite tier={1} href={vllmUrl('rust/src/server/src/middleware/auth.rs', 'L16')} kind="code">
                auth.rs L16
              </Cite>
              . Some flags on this page stop it at startup (<code>--max-num-queued-reqs</code>,{' '}
              <code>--max-num-queued-tokens</code>, <code>--trust-request-mm-kwargs</code>) and others
              are accepted and ignored (<code>--enable-auto-tool-choice</code>,{' '}
              <code>--structured-outputs-config</code>){' '}
              <Cite tier={1} href={vllmUrl('rust/src/cmd/src/cli/unsupported.rs', 'L366-L447')} kind="code">
                unsupported.rs L366-L447
              </Cite>
              . It renders chat templates and tokenizes in Rust, so output parity with the Python
              server depends on its renderer and tokenizer matching Python&apos;s for your model; no
              parity test was run for this dive. Check your flag set against the capability table in{' '}
              <strong>14. Inside the Codebase &rarr; The Rust Frontend</strong> before you switch.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Force the output into a choice, regex, JSON schema or grammar, and know what that guarantee covers"
          >
            Structured outputs (guided decoding)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it guarantees:</strong> structured outputs constrain the decoder so the
            generated text conforms to a shape you specify: one of a fixed set of choices, a regex, a
            JSON schema, or a context-free grammar. The guarantee is about format, enforced token by
            token: the model cannot emit a token that breaks the constraint, and the content inside
            the shape can still be wrong. Structured outputs are on by default in the server; you
            opt into a shape per request{' '}
            <Cite tier={1} href={vllmUrl('docs/features/structured_outputs.md', 'L34-L40')}>
              structured_outputs.md L34-L40
            </Cite>
            .
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Constraint types (passed under structured_outputs)</Header>}
            columnDefinitions={[
              { id: 'field', header: 'Field', cell: (i) => <code>{i.field}</code> },
              { id: 'guarantee', header: 'What it forces', cell: (i) => i.guarantee },
            ]}
            items={[
              { field: 'choice', guarantee: 'Output is exactly one of the supplied choices.' },
              { field: 'regex', guarantee: 'Output matches the regex pattern.' },
              { field: 'json', guarantee: 'Output follows the supplied JSON schema.' },
              { field: 'grammar', guarantee: 'Output follows the context-free grammar.' },
              {
                field: 'structural_tag',
                guarantee: 'Output follows a JSON schema within a set of specified tags in the text.',
              },
            ]}
          />

          <Box variant="p">
            These ride in the request as extra parameters, for example{' '}
            <code>{'extra_body={"structured_outputs": {"choice": ["positive", "negative"]}}'}</code>.
            The OpenAI-standard <code>response_format</code> with a <code>json_schema</code> type is
            also honored for plain OpenAI-client compatibility{' '}
            <Cite tier={1} href={SO_DOCS}>vLLM docs: Structured Outputs</Cite>.
          </Box>

          <Alert type="warning">
            <strong>Porting older code: the <code>guided_*</code> fields were removed in v0.12.0.</strong>{' '}
            <code>guided_json</code>, <code>guided_regex</code>, <code>guided_choice</code>,{' '}
            <code>guided_grammar</code>, <code>guided_whitespace_pattern</code>, and the standalone{' '}
            <code>guided_decoding_backend</code> field all fold under a single{' '}
            <code>structured_outputs</code> object (e.g. <code>guided_json</code> &rarr;{' '}
            <code>{'{"structured_outputs": {"json": ...}}'}</code>), and the backend is a server flag
            rather than a per-request field{' '}
            <Cite tier={1} href={vllmUrl('docs/features/structured_outputs.md', 'L9-L18')}>
              structured_outputs.md L9-L18
            </Cite>
            .
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Backends &amp; how one gets chosen</Box>
              <Box variant="p">
                vLLM supports <strong>xgrammar</strong> and <strong>guidance</strong> as primary
                backends (with <strong>outlines</strong> and <strong>lm-format-enforcer</strong> also
                available). The default is <code>auto</code>, which &quot;will try to choose an
                appropriate backend based on the details of the request.&quot; You can pin one with{' '}
                <code>--structured-outputs-config.backend</code> on <code>vllm serve</code>. The
                engine builds one backend, from the first structured request it sees, and compiles
                every later grammar on it{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/structured_output/__init__.py', 'L125-L130')} kind="code">
                  structured_output/__init__.py L125-L130
                </Cite>
                . Backend choice has real consequences: regex syntax differs. Xgrammar, guidance, and
                outlines use Rust-style regex while lm-format-enforcer uses Python&apos;s{' '}
                <code>re</code> module{' '}
                <Cite tier={1} href={vllmUrl('docs/features/structured_outputs.md', 'L64')}>
                  structured_outputs.md L64
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Reasoning models</Box>
              <Box variant="p">
                Structured outputs compose with reasoning models, but the reasoning trace must be
                parsed out separately: you start the server with a reasoning parser, e.g.{' '}
                <code>--reasoning-parser deepseek_r1</code>. For some models (the docs cite Qwen3
                Coder, v0.11.2+) structured outputs can silently disable when reasoning content is not
                split into the <code>reasoning</code> field; to force both on together set{' '}
                <code>--structured-outputs-config.enable_in_reasoning=True</code>{' '}
                <Cite tier={1} href={vllmUrl('docs/features/structured_outputs.md', 'L213-L216')}>
                  structured_outputs.md L213-L216
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info">
            The finite-state-machine construction, grammar compilation, and the per-backend
            internals are walked against the real source in{' '}
            <strong>14. Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which flags turn model-driven tool calls on, and how to make the server constrain them when clients never ask"
          >
            Tool / function calling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The server speaks OpenAI&apos;s tools schema, and model-driven tool calls are configured
            per model. Automatic tool choice requires two launch flags together:{' '}
            <code>--enable-auto-tool-choice</code> plus a <code>--tool-call-parser</code> matched to
            the model family (the parser knows how that specific model emits tool-call syntax).{' '}
            <code>--chat-template</code> is optional: pass one when the model&apos;s own template
            does not handle tool-role messages and earlier tool calls{' '}
            <Cite tier={1} href={vllmUrl(TOOL_MD, 'L159-L170')}>tool_calling.md L159-L170</Cite>.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve meta-llama/Llama-3.1-8B-Instruct \
    --enable-auto-tool-choice \
    --tool-call-parser llama3_json \
    --chat-template examples/tool_chat_template_llama3.1_json.jinja`}</pre>
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">tool_choice modes</Box>
              <Box variant="p">
                vLLM supports named function calling plus <code>auto</code>,{' '}
                <code>required</code> and <code>none</code>. With{' '}
                <code>required</code>, &quot;the model is guaranteed to generate one or more tool
                calls&quot; from the supplied tool list. The docs phrase the limit bluntly: &quot;You
                are guaranteed a validly-parsable function call - not a high-quality one.&quot;{' '}
                <Cite tier={1} href={vllmUrl(TOOL_MD, 'L86-L101')}>tool_calling.md L86-L101</Cite>
              </Box>
            </div>
            <div>
              <Box variant="h3">Per-model parsers</Box>
              <Box variant="p">
                Parsers are named and model-specific, e.g. <code>hermes</code>,{' '}
                <code>mistral</code>, <code>llama3_json</code>, <code>llama4_pythonic</code>,{' '}
                <code>internlm</code>, <code>granite</code> / <code>granite4</code>,{' '}
                <code>deepseek_v3</code> / <code>deepseek_v31</code>, <code>qwen3_xml</code>,{' '}
                <code>kimi_k2</code>, <code>glm45</code>, and a generic <code>pythonic</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/tool_parsers/__init__.py', 'L24')} kind="code">
                  tool_parsers/__init__.py L24
                </Cite>
                . Picking the wrong parser for a model produces malformed or empty tool calls, so it
                must match the checkpoint you are serving.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            <strong>Two layers get constrained.</strong> The server constrains tool calls by building
            a structural tag (the <code>structural_tag</code> constraint above) from the
            request&apos;s tool list. When one applies, the decoder constrains the tool-call{' '}
            <em>envelope</em>: the markup and the function name. A
            tool&apos;s <em>argument schema</em> is pinned only when that tool sets{' '}
            <code>strict: true</code>, or when the server runs{' '}
            <code>--tool-strict-level parameter</code>; a tool without <code>strict</code> keeps
            free-form arguments, even next to a strict tool in the same request. <code>strict</code>{' '}
            works on Chat Completions, Responses and Anthropic Messages{' '}
            <Cite tier={1} href={vllmUrl(TOOL_MD, 'L110-L127')}>tool_calling.md L110-L127</Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/tool_parsers/structural_tag_registry.py', 'L124-L165')} kind="code">
              structural_tag_registry.py L124-L165
            </Cite>
            .
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">What each tool_choice constrains</Header>}
            columnDefinitions={[
              { id: 'choice', header: 'tool_choice', cell: (i) => <code>{i.choice}</code> },
              { id: 'envelope', header: 'Envelope (markup, function name)', cell: (i) => i.envelope },
              { id: 'args', header: 'Argument schema', cell: (i) => i.args },
            ]}
            items={[
              {
                choice: 'named function',
                envelope: 'Always constrained; the call must be the named function.',
                args: 'Pinned for tools with strict: true, or for every tool under --tool-strict-level parameter.',
              },
              {
                choice: 'required',
                envelope: 'Always constrained; at least one tool call.',
                args: 'Same rule as named.',
              },
              {
                choice: 'auto',
                envelope:
                  'Constrained when any tool sets strict: true, or when --tool-strict-level is function or parameter. A plain text answer stays valid.',
                args: 'Same rule as named.',
              },
              {
                choice: 'none',
                envelope: 'No tool calls are generated.',
                args: 'Not applicable.',
              },
            ]}
          />
          <Box variant="small" color="text-body-secondary">
            Parsers that use schema-derived JSON constraints keep enforcing the declared schema on
            required and named calls{' '}
            <Cite tier={1} href={vllmUrl(TOOL_MD, 'L123')}>tool_calling.md L123</Cite>.
          </Box>

          <Box variant="small">
            Note on parallel calls: setting <code>parallel_tool_calls=false</code> ensures vLLM
            returns zero or one tool call per request; the default <code>true</code> permits more
            than one, but there is no guarantee more than one is returned, as that is
            model-dependent{' '}
            <Cite tier={1} href={vllmUrl(README, 'L15')}>README.md L15</Cite>.
          </Box>

          <Box variant="p">
            <strong>Set the floor on the server.</strong> Most OpenAI-compatible clients and agent
            frameworks never set <code>strict</code>, in the docs&apos; assessment, so under{' '}
            <code>auto</code> the model writes tool calls with no grammar and malformed markup can
            reach the response{' '}
            <Cite tier={1} href={vllmUrl(TOOL_MD, 'L141-L155')}>tool_calling.md L141-L155</Cite>.{' '}
            <code>--tool-strict-level</code> raises the floor for every request that carries tools:{' '}
            <code>auto</code> (the default) follows the request, <code>function</code> constrains the
            envelope, and <code>parameter</code> also pins every argument schema, as if every tool
            were strict{' '}
            <Cite tier={1} href={vllmUrl(CLI_ARGS, 'L128-L134')} kind="code">
              cli_args.py L128-L134
            </Cite>
            . The floor never loosens a constraint the request already asked for.{' '}
            <code>VLLM_ENFORCE_STRICT_TOOL_CALLING=false</code> (default true) turns structural tags
            off entirely and overrides the flag; the schema-derived constraints of named and required
            calls stay{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1805-L1808')} kind="code">
              envs.py L1805-L1808
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(TOOL_MD, 'L135')}>tool_calling.md L135</Cite>. If your clients
            do not set <code>strict</code>, start with <code>--tool-strict-level function</code>, and
            move to <code>parameter</code> once every tool schema follows the strict style the docs
            describe (<code>additionalProperties: false</code>, every field required, optional fields
            nullable){' '}
            <Cite tier={1} href={TOOL_DOCS}>vLLM docs: Tool Calling</Cite>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Send images, audio and video the OpenAI way, and decide what the server may fetch and what clients may tune"
          >
            Multimodal inputs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the Chat Completions endpoint, vLLM accepts the OpenAI multimodal message format, so
            vision and audio requests look exactly like they would against OpenAI. Images go in via{' '}
            <code>image_url</code>: either a remote URL or a base64 <code>data:</code> URI;
            audio via <code>input_audio</code> (base64) or <code>audio_url</code>; video via{' '}
            <code>video_url</code>. Multiple media items per message are supported{' '}
            <Cite tier={1} href={MM_DOCS}>vLLM docs: Multimodal Inputs</Cite>.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What flows in</Box>
              <ul>
                <li>
                  Images via <code>image_url</code> (URL or base64 data URI), per the OpenAI Vision
                  API. Only the default <code>image_url.detail</code> of <code>auto</code> is
                  honored; any other value is logged and ignored{' '}
                  <Cite tier={1} href={vllmUrl('vllm/entrypoints/chat_utils.py', 'L1716-L1721')} kind="code">
                    chat_utils.py L1716-L1721
                  </Cite>
                  .
                </li>
                <li>
                  Audio via <code>input_audio</code> or <code>audio_url</code>, any format
                  readable by the underlying decoders.
                </li>
                <li>Video via <code>video_url</code>.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Server-side controls</Box>
              <ul>
                <li>
                  <code>--limit-mm-per-prompt</code> caps media items per request (e.g. image=2).
                </li>
                <li>
                  <code>--allowed-local-media-path</code> opts into reading local files; off by
                  default.
                </li>
                <li>
                  <code>--allowed-media-domains</code> restricts fetchable domains to mitigate SSRF
                  (server-side request forgery).
                </li>
                <li>
                  <code>--trust-request-mm-kwargs</code> (off by default) admits per-request{' '}
                  <code>mm_processor_kwargs</code> and <code>media_io_kwargs</code>. Without it the
                  server rejects them with a validation error, because they change preprocessing
                  cost{' '}
                  <Cite tier={1} href={vllmUrl('vllm/entrypoints/generate/base/protocol.py', 'L52-L77')} kind="code">
                    generate/base/protocol.py L52-L77
                  </Cite>
                  . Leave it off for untrusted clients{' '}
                  <Cite tier={1} href={vllmUrl(SECURITY_MD, 'L292-L303')}>security.md L292-L303</Cite>.
                </li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The sampling and serving levers OpenAI's schema lacks, and the OpenAI fields vLLM ignores"
          >
            vLLM-specific extra parameters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes sampling and serving controls that are not part of the OpenAI API. With the
            OpenAI SDK you pass them through <code>extra_body</code> (e.g.{' '}
            <code>{'extra_body={"top_k": 50}'}</code>); with a raw HTTP call you merge them straight
            into the JSON payload{' '}
            <Cite tier={1} href={vllmUrl('docs/serving/online_serving/openai_compatible_server.md', 'L68-L81')}>
              openai_compatible_server.md L68-L81
            </Cite>
            . These are the levers an integrator reaches for that OpenAI&apos;s schema never exposed.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Notable extra request parameters</Header>}
            columnDefinitions={[
              { id: 'param', header: 'Parameter', cell: (i) => <code>{i.param}</code> },
              { id: 'purpose', header: 'Purpose', cell: (i) => i.purpose },
            ]}
            items={[
              {
                param: 'top_k',
                purpose: 'Top-k sampling cutoff, not in the OpenAI API.',
              },
              {
                param: 'min_p',
                purpose: 'Minimum-probability sampling threshold.',
              },
              {
                param: 'repetition_penalty',
                purpose: 'Penalize already-seen tokens (distinct from frequency/presence penalties).',
              },
              {
                param: 'min_tokens',
                purpose: 'Force a minimum number of generated tokens before stop conditions apply.',
              },
              {
                param: 'add_special_tokens',
                purpose: 'Control whether special tokens are prepended to the prompt.',
              },
              {
                param: 'structured_outputs',
                purpose: 'The guided-decoding object (choice / regex / json / grammar / structural_tag).',
              },
              {
                param: 'priority',
                purpose:
                  'Request priority, lower runs earlier. Ordering applies under --scheduling-policy priority. An X-Vllm-Priority request header overrides the field.',
              },
              {
                param: 'cache_salt',
                purpose:
                  'Salt the prefix cache so other tenants cannot probe prompts via cache-hit timing.',
              },
              {
                param: 'mm_processor_kwargs',
                purpose:
                  'Per-request overrides for the multimodal processor, rejected unless the server runs --trust-request-mm-kwargs.',
              },
              {
                param: 'vllm_xargs',
                purpose: 'Free-form string/numeric params consumed by custom extensions.',
              },
            ]}
          />

          <Box variant="small" color="text-body-secondary">
            Parameter set read from the chat-completion request protocol,{' '}
            <Cite tier={1} href={vllmUrl(CHAT_PROTOCOL)}>
              vllm/entrypoints/openai/chat_completion/protocol.py
            </Cite>
            ; the completions endpoint exposes an analogous set. On <code>priority</code>: the
            field&apos;s description says a non-zero value raises an error unless the model uses
            priority scheduling{' '}
            <Cite tier={1} href={vllmUrl(CHAT_PROTOCOL, 'L381-L390')}>protocol.py L381-L390</Cite>,
            and no such check was located in the v0.31.0 tree during this research. In the code, the
            default <code>fcfs</code> (first-come, first-served) queue appends requests in arrival
            order and only the{' '}
            <code>priority</code> policy builds a priority queue{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/request_queue.py', 'L75-L84')} kind="code">
              request_queue.py L75-L84
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/request_queue.py', 'L200-L207')} kind="code">
              L200-L207
            </Cite>
            ; the header is read before the body field{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/generate/base/serving.py', 'L277-L288')} kind="code">
              generate/base/serving.py L277-L288
            </Cite>
            .
          </Box>

          <ExpandableSection headerText="Documented OpenAI incompatibilities (params not supported / ignored)">
            <SpaceBetween size="s">
              <Box variant="p">
                The docs name specific OpenAI parameters the server does not honor. Design around
                them rather than assuming OpenAI-identical behavior{' '}
                <Cite tier={1} href={vllmUrl(README, 'L9-L14')}>README.md L9-L14</Cite>{' '}
                <Cite tier={1} href={vllmUrl('docs/serving/online_serving/openai_compatible_server.md', 'L173')}>
                  openai_compatible_server.md L173
                </Cite>
                :
              </Box>
              <Table
                variant="embedded"
                columnDefinitions={[
                  { id: 'endpoint', header: 'Endpoint', cell: (i) => i.endpoint },
                  { id: 'param', header: 'Parameter', cell: (i) => <code>{i.param}</code> },
                  { id: 'behavior', header: 'Behavior in vLLM', cell: (i) => i.behavior },
                ]}
                items={[
                  {
                    endpoint: 'Completions',
                    param: 'suffix',
                    behavior: 'Not supported.',
                  },
                  {
                    endpoint: 'Chat Completions',
                    param: 'user',
                    behavior: 'Ignored.',
                  },
                  {
                    endpoint: 'Chat Completions',
                    param: 'image_url.detail',
                    behavior: 'Ignored unless auto; a warning is logged.',
                  },
                ]}
              />
              <Box variant="p">
                Two more behaviors worth knowing: by default the server applies{' '}
                <code>generation_config.json</code> from the model repo, so a model creator&apos;s
                recommended sampling defaults can override yours. Pass{' '}
                <code>--generation-config vllm</code> to disable that{' '}
                <Cite tier={1} href={vllmUrl('docs/serving/online_serving/openai_compatible_server.md', 'L72-L75')}>
                  openai_compatible_server.md L72-L75
                </Cite>
                . And <code>--enable-request-id-headers</code> adds an <code>X-Request-Id</code>{' '}
                header to every response, echoing the client&apos;s value or generating one{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/middleware/x_request_id.py', 'L30-L33')} kind="code">
                  x_request_id.py L30-L33
                </Cite>
                ; the server also reads the <code>X-Vllm-Priority</code> request header described
                above.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Cap the queue so a saturated replica answers HTTP 503 and your load balancer retries the request elsewhere"
          >
            Back-pressure: what a full server sends back
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            By default the request queue has no bound. Two scheduler flags, both available from
            v0.29.0, give the API server an admission valve; both default to no limit and both count
            across every DP (data parallel) rank the API server routes to{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L93-L120')}>
              config/scheduler.py L93-L120
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (i) => <code>{i.flag}</code> },
              { id: 'caps', header: 'What it caps', cell: (i) => i.caps },
              { id: 'size', header: 'How the docstring sizes it', cell: (i) => i.size },
            ]}
            items={[
              {
                flag: '--max-num-queued-reqs',
                caps: 'Requests in flight, waiting plus running.',
                size: 'About data_parallel_size x max_num_seqs, plus the queue depth you accept, so it binds after per-rank admission.',
              },
              {
                flag: '--max-num-queued-tokens',
                caps: 'Prompt tokens of requests still in prefill. A partly prefilled request counts its full prompt.',
                size: 'Target TTFT (time to first token) x aggregate prefill throughput.',
              },
            ]}
          />
          <Box variant="p">
            Past either cap the API server rejects the new request with HTTP 503 (Service
            Unavailable) rather than the rate-limit status 429, chosen &quot;so that load balancers
            and client SDKs retry the request on a different instance&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/exceptions.py', 'L148-L175')} kind="code">
              exceptions.py L148-L175
            </Cite>
            . Each rejection is logged at INFO as &quot;Request queue full - rejecting request&quot;
            or &quot;Max queued tokens reached - rejecting request&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/async_llm.py', 'L336-L365')} kind="code">
              async_llm.py L336-L365
            </Cite>
            , and the Rust frontend refuses to start with either flag.
          </Box>
          <Box variant="p">
            <strong>To get it right:</strong> set <code>--max-num-queued-reqs</code> on every
            replica behind a load balancer, make the load balancer or client retry a 503 on another
            replica, and alert on the rejection log line. How the cap meets the scheduler&apos;s own
            limits is covered in <strong>4. Scheduler &amp; Continuous Batching</strong>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
