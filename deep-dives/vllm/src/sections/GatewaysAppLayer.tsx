import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

function DataPathDiagram() {
  return (
    <svg
      viewBox="0 0 860 470"
      role="img"
      aria-labelledby="datapath-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="datapath-title">
        Request data path: web/chat, agent, and RAG applications all speak the OpenAI wire
        format to a single LiteLLM gateway, which applies control-plane policy and re-issues each
        call to one or more OpenAI-compatible vLLM endpoints.
      </title>
      <style>
        {`
          .app { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .gw { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
          .eng { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .engalt { fill: #f9f9fa; stroke: #879596; stroke-width: 1.5; }
          .at { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .as { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .gt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .gs { fill: #d6f2ee; font: 11px sans-serif; text-anchor: middle; }
          .et { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .es { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .tier { fill: #5f6b7a; font: 600 12px sans-serif; letter-spacing: 0.5px; }
          .tiersub { fill: #879596; font: 11px sans-serif; }
          .wire { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .note { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#dah); }
          .baseline { stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; }
        `}
      </style>
      <defs>
        <marker id="dah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>

      {/* Tier labels */}
      <text className="tier" x={30} y={26}>PRODUCT / CONTROL TIER</text>
      <text className="tiersub" x={30} y={42}>own auth, budgets, routing, UX</text>
      <text className="tier" x={830} y={26} textAnchor="end">ENGINE TIER</text>
      <text className="tiersub" x={830} y={42} textAnchor="end">own GPU, KV cache, scheduler</text>

      {/* App tier — three boxes */}
      <rect className="app" x={40} y={60} width={220} height={64} rx={8} />
      <text className="at" x={150} y={88}>Web / chat UI</text>
      <text className="as" x={150} y={108}>(Open WebUI)</text>

      <rect className="app" x={320} y={60} width={220} height={64} rx={8} />
      <text className="at" x={430} y={88}>Agents</text>
      <text className="as" x={430} y={108}>(LangChain)</text>

      <rect className="app" x={600} y={60} width={220} height={64} rx={8} />
      <text className="at" x={710} y={88}>RAG pipeline</text>
      <text className="as" x={710} y={108}>(LlamaIndex)</text>

      {/* Wire-format annotation */}
      <text className="wire" x={430} y={150}>
        all speak POST /v1/chat/completions (OpenAI wire format)
      </text>

      {/* Arrows from each app down to the gateway */}
      <path className="arr" d="M150,124 C150,170 380,170 425,185" />
      <path className="arr" d="M430,124 L430,185" />
      <path className="arr" d="M710,124 C710,170 480,170 435,185" />

      {/* Gateway tier */}
      <rect className="gw" x={250} y={190} width={360} height={92} rx={8} />
      <text className="gt" x={430} y={218}>LLM gateway / proxy (LiteLLM)</text>
      <text className="gs" x={430} y={240}>retries · fallbacks · budgets · rate limits</text>
      <text className="gs" x={430} y={258}>virtual keys · logging · multi-provider unification</text>
      <text className="gs" x={430} y={276}>model = hosted_vllm/...</text>

      {/* Re-issue annotation */}
      <text className="note" x={430} y={306}>re-issues OpenAI-format request to api_base</text>

      {/* Arrows fanning out to the three engine endpoints */}
      <path className="arr" d="M430,282 C430,310 170,316 150,330" />
      <path className="arr" d="M430,282 L430,330" />
      <path className="arr" d="M430,282 C430,310 690,316 710,330" />

      {/* Engine tier — vLLM endpoints + other compat/SaaS */}
      <rect className="eng" x={40} y={334} width={220} height={72} rx={8} />
      <text className="et" x={150} y={362}>vLLM endpoint</text>
      <text className="es" x={150} y={382}>/v1 (model A)</text>

      <rect className="eng" x={320} y={334} width={220} height={72} rx={8} />
      <text className="et" x={430} y={362}>vLLM endpoint</text>
      <text className="es" x={430} y={382}>/v1 (model B)</text>

      <rect className="engalt" x={600} y={334} width={220} height={72} rx={8} />
      <text className="et" x={710} y={362}>other OpenAI-</text>
      <text className="es" x={710} y={382}>compat / SaaS</text>

      {/* Shared baseline under the vLLM endpoints */}
      <path className="baseline" d="M150,422 L430,422" />
      <text className="note" x={290} y={440}>vllm serve · OpenAI-compatible (§12)</text>
    </svg>
  );
}

export function GatewaysAppLayer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What teams put in front of vLLM — gateways, UIs, and RAG/agent frameworks — and why none of it requires touching the engine."
          >
            19. Gateways &amp; Application Layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The architectural point in one sentence:</strong> because vLLM exposes an
            OpenAI-compatible HTTP API (see{' '}
            <strong>12. The OpenAI-Compatible Server</strong>), the entire OpenAI-ecosystem tooling
            stack snaps in front of it with no code changes &mdash; you swap a base URL and an API
            key, and the gateway, the chat UI, and the RAG/agent framework all believe they are
            talking to OpenAI. vLLM owns the <em>engine tier</em> (the GPU, the KV cache, the
            scheduler); these tools own the <em>product / control tier</em> (auth, budgets, routing,
            UX, retrieval). The discipline that keeps a deployment maintainable is keeping those two
            tiers decoupled: the engine should not know about your billing plan, and your billing
            plan should not be pinned to one engine.
          </Box>
          <Box variant="p">
            <strong>Why this is a tier and not an afterthought:</strong> a raw <code>vllm serve</code>{' '}
            process is a single model on a single endpoint with no concept of per-team rate limits,
            spend caps, multi-provider fallback, or a human-facing UI. In production you almost never
            expose that process directly. You front it with a gateway for control-plane concerns and
            point apps at the gateway, not the engine. Everything below is something the OpenAI wire
            contract lets you bolt on for free &mdash; the cost vLLM deliberately avoided imposing on
            you was a rewrite of your call sites.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The layers in front of the engine</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Read the diagram top-down as the request path. Applications and agents never address a
            GPU; they address an OpenAI-shaped URL. A gateway (here, LiteLLM) terminates that
            contract, applies control-plane policy, and re-issues the call to one or more vLLM
            endpoints &mdash; each of which is, again, just an OpenAI-compatible server.
          </Box>

          <DataPathDiagram />

          <Table
            variant="embedded"
            header={<Header variant="h3">Layer → example tools → what it adds</Header>}
            columnDefinitions={[
              { id: 'layer', header: 'Layer', cell: (i) => <strong>{i.layer}</strong> },
              { id: 'tools', header: 'Example tools', cell: (i) => i.tools },
              { id: 'adds', header: 'What it adds in front of vLLM', cell: (i) => i.adds },
              { id: 'connects', header: 'How it connects', cell: (i) => i.connects },
            ]}
            items={[
              {
                layer: 'LLM gateway / proxy',
                tools: 'LiteLLM',
                adds: 'Retries & fallbacks, spend budgets, rate limits, virtual API keys, request logging, and multi-provider unification (one endpoint that fronts vLLM plus OpenAI/Bedrock/Anthropic/etc.).',
                connects: (
                  <span>
                    Calls vLLM with model <code>hosted_vllm/&lt;name&gt;</code> and{' '}
                    <code>api_base</code> pointed at the vLLM <code>/v1</code> URL.
                  </span>
                ),
              },
              {
                layer: 'Chat / web UI',
                tools: 'Open WebUI',
                adds: 'A human-facing chat interface, conversation history, user accounts, and model selection — no application code required to talk to the model.',
                connects: (
                  <span>
                    Set <code>OPENAI_API_BASE_URL</code> to the vLLM (or gateway) endpoint; the served
                    model appears in the UI.
                  </span>
                ),
              },
              {
                layer: 'RAG / agent framework',
                tools: 'LangChain, LlamaIndex',
                adds: 'Retrieval, chunking, tool/agent orchestration, prompt templating, and memory — the application logic around the model.',
                connects: (
                  <span>
                    Use the framework&apos;s OpenAI client class and set the base URL to the vLLM
                    endpoint; vLLM is treated as an OpenAI provider.
                  </span>
                ),
              },
            ]}
          />
          <Box variant="small">
            LiteLLM and Open WebUI integration details verified against vLLM&apos;s own deployment
            docs:{' '}
            <Link external href="https://docs.vllm.ai/en/latest/deployment/frameworks/litellm/">
              vLLM Docs: LiteLLM, accessed 2026-06-07
            </Link>{' '}
            and{' '}
            <Link external href="https://docs.vllm.ai/en/latest/deployment/frameworks/open-webui/">
              vLLM Docs: Open WebUI, accessed 2026-06-07
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The gateway tier (LiteLLM)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            A gateway is the seam where control-plane concerns live. LiteLLM &mdash; in its own
            framing a unified interface to many providers &mdash; sits between your apps and the
            engines and gives you the things <code>vllm serve</code> deliberately does not: retries
            and fallbacks across endpoints, per-key and per-team spend budgets, rate limits, and a
            single OpenAI-shaped URL that can fan out to vLLM <em>and</em> hosted providers behind one
            contract. The integration is the same base-URL-and-prefix move as the rest of this tier.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`import litellm

# Call your vLLM server through LiteLLM — note the hosted_vllm/ prefix
response = litellm.completion(
    model="hosted_vllm/qwen/Qwen1.5-0.5B-Chat",   # hosted_vllm is required
    messages=messages,
    api_base="http://{your-vllm-server-host}:{your-vllm-server-port}/v1",
    temperature=0.2,
    max_tokens=80,
)`}</pre>
          </Box>

          <Box variant="p">
            Two things to internalize. First, the <code>hosted_vllm/</code> prefix is{' '}
            <strong>not optional</strong> &mdash; the docs state plainly that{' '}
            &quot;<code>hosted_vllm</code> is prefix key word and necessary.&quot; It is what tells
            LiteLLM to route to a self-hosted OpenAI-compatible vLLM server (at your{' '}
            <code>api_base</code>) rather than to a hosted vendor. Second, the same call shape works
            for embeddings &mdash; you can set <code>HOSTED_VLLM_API_BASE</code> as an environment
            variable instead of passing <code>api_base</code> per call (
            <Link external href="https://docs.vllm.ai/en/latest/deployment/frameworks/litellm/">
              vLLM Docs: LiteLLM, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What the gateway is good at</Box>
              <ul>
                <li>
                  <strong>Reliability:</strong> retries and fallbacks &mdash; if one vLLM endpoint is
                  down or saturated, route to another (or to a hosted provider).
                </li>
                <li>
                  <strong>Cost control:</strong> per-key / per-team budgets and rate limits, so a
                  runaway agent cannot drain a GPU fleet.
                </li>
                <li>
                  <strong>Unification:</strong> one OpenAI-shaped URL in front of vLLM <em>and</em>{' '}
                  OpenAI/Bedrock/Anthropic, so apps stay provider-agnostic.
                </li>
                <li>
                  <strong>Observability:</strong> centralized request logging and spend tracking at
                  the seam, not scattered across apps.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">What stays in the engine</Box>
              <ul>
                <li>
                  <strong>Throughput:</strong> continuous batching, the scheduler, KV-cache
                  management &mdash; vLLM&apos;s reason to exist.
                </li>
                <li>
                  <strong>Model placement:</strong> which GPU, tensor/pipeline parallelism, quantization.
                </li>
                <li>
                  <strong>Decode features:</strong> structured outputs, tool-call parsing, prefix
                  caching &mdash; configured on <code>vllm serve</code> (§12), not the gateway.
                </li>
                <li>
                  <strong>Don&apos;t leak tiers:</strong> keep budgets/keys in the gateway and engine
                  tuning in vLLM; mixing them couples your control plane to one engine.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Operational caution — LiteLLM PyPI supply-chain compromise (March 2026)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>[Tier-3 / security reporting]</strong> &mdash; this is an operational
                caution about the <em>LiteLLM package</em>, not a statement about vLLM. In late March
                2026, malicious versions of the <code>litellm</code> package were published to PyPI
                outside the normal release process and quarantined after a short window. Multiple
                security vendors reported that the malicious versions attempted to harvest and
                exfiltrate credentials and establish persistence. Treat the specifics below as
                third-party reporting, confirm against LiteLLM&apos;s own advisory before acting, and
                do not infer anything about vLLM&apos;s security posture from it.
              </Box>
              <Box variant="p">
                <strong>Practical guardrails (apply to any third-party tool in this tier):</strong>{' '}
                pin exact versions in <code>requirements.txt</code> / lockfiles and audit before
                upgrading; do not auto-upgrade gateway dependencies in CI; per LiteLLM&apos;s advisory
                the last release flagged as known-good before the incident was <code>1.82.6</code>,
                and the official LiteLLM Proxy Docker image (which pins its dependencies) was reported
                as not impacted by the compromised PyPI wheels. If you may have installed an affected
                version, follow the vendor advisory&apos;s remediation (remove, purge caches, rotate
                credentials) rather than assuming removal alone is sufficient.
              </Box>
              <Box variant="small">
                Sources (third-party / vendor advisories):{' '}
                <Link external href="https://docs.litellm.ai/blog/security-update-march-2026">
                  LiteLLM Security Update (vendor advisory), accessed 2026-06-07
                </Link>
                ;{' '}
                <Link
                  external
                  href="https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/"
                >
                  Datadog Security Labs, accessed 2026-06-07
                </Link>
                .
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The UI tier (Open WebUI)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            When you want a chat interface in front of a self-hosted model &mdash; for an internal
            team, a demo, or a private deployment &mdash; you do not build one. You point an existing
            OpenAI-client UI at the vLLM endpoint. Open WebUI connects by treating vLLM as its OpenAI
            backend: start the server with a reachable host, then set one environment variable on the
            UI container.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# 1. Serve the model on a reachable interface
vllm serve <model> --host 0.0.0.0 --port 8000

# 2. Launch the UI pointed at the vLLM /v1 endpoint
#    (set on the Open WebUI container)
OPENAI_API_BASE_URL=http://0.0.0.0:8000/v1`}</pre>
          </Box>
          <Box variant="p">
            Once <code>OPENAI_API_BASE_URL</code> points at the vLLM <code>/v1</code> path, the served
            model appears in the UI and is ready for chat. In a production layout you would typically
            point the UI at the <em>gateway</em> URL instead of the engine directly, so the UI&apos;s
            traffic also picks up the gateway&apos;s auth, budgets, and logging (
            <Link external href="https://docs.vllm.ai/en/latest/deployment/frameworks/open-webui/">
              vLLM Docs: Open WebUI, accessed 2026-06-07
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The RAG / agent tier (LangChain, LlamaIndex)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            RAG and agent frameworks need a chat/completions endpoint and embeddings &mdash; both of
            which the vLLM server already speaks (§12). The integration pattern is the same as
            everything else in this tier: use the framework&apos;s OpenAI client and override the base
            URL.
          </Box>
          <Alert type="info" header="Integrate via the OpenAI-compatible API, not a dedicated connector">
            The robust, documented path is to treat vLLM as an <em>OpenAI endpoint</em> &mdash;
            instantiate the framework&apos;s OpenAI-style client (chat model and/or embeddings) and set
            its base URL to the vLLM <code>/v1</code> path. This works precisely because vLLM
            implements the OpenAI wire contract. Do not assume a first-party &quot;vLLM connector&quot;
            exists in a given framework version; the OpenAI-compatible route is what the compatibility
            guarantee from §12 actually buys you, and it does not depend on any framework shipping
            vLLM-specific code. (Some frameworks do offer local/self-hosted wrappers, but the
            base-URL-override path is the one that is stable across versions.)
          </Alert>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Pattern (illustrative): point the framework's OpenAI client at vLLM.
# LangChain — ChatOpenAI with an overridden base URL:
#   ChatOpenAI(model="<served-model>",
#              base_url="http://localhost:8000/v1",
#              api_key="token-abc123")
#
# LlamaIndex — OpenAILike / OpenAI client with api_base set to the vLLM URL:
#   OpenAILike(model="<served-model>",
#              api_base="http://localhost:8000/v1",
#              api_key="token-abc123", is_chat_model=True)`}</pre>
          </Box>
          <Box variant="small">
            The base-URL-override mechanism is the same swap shown in{' '}
            <strong>12. The OpenAI-Compatible Server</strong> &mdash;{' '}
            <code>base_url=&quot;http://localhost:8000/v1&quot;</code> on the OpenAI client. Confirm the
            exact client class and parameter names against your installed framework version; the
            load-bearing fact is that vLLM is addressed as an OpenAI provider, verified by vLLM&apos;s
            serving docs (
            <Link external href="https://docs.vllm.ai/en/latest/serving/openai_compatible_server/">
              vLLM Docs: OpenAI-Compatible Server, accessed 2026-06-07
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Keeping the tiers decoupled</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The recurring failure mode is letting control-plane logic leak into the engine, or pinning
            the control plane to one engine. The OpenAI contract is the decoupling boundary &mdash;
            respect it and you can swap either side independently.
          </Box>
          <ExpandableSection headerText="Decoupling rules of thumb">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Apps address the gateway, not the engine.</strong> If your application code
                hardcodes a vLLM host, you have coupled the product tier to one engine instance. Point
                apps at the gateway URL; let the gateway map to engines.
              </Box>
              <Box variant="p">
                <strong>Budgets, keys, and routing live in the gateway.</strong> They are
                control-plane concerns. Putting them in the engine would mean re-implementing them for
                every engine you ever run.
              </Box>
              <Box variant="p">
                <strong>Throughput and decode features live in the engine.</strong> Continuous
                batching, KV cache, structured outputs, tool-call parsing, prefix caching &mdash; these
                are <code>vllm serve</code> flags (§12). A gateway cannot add them; it can only pass
                them through.
              </Box>
              <Box variant="p">
                <strong>The wire format is the contract.</strong> Everything in this section works
                because each layer speaks OpenAI&apos;s <code>/v1/chat/completions</code> (and
                <code>/v1/embeddings</code>). That single fact is why a UI, a gateway, and a RAG
                framework written for OpenAI all run in front of your GPU with a base-URL swap.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
