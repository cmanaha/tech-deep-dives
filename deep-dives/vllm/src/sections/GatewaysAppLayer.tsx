import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const LITELLM_PAGE = 'docs/deployment/frameworks/litellm.md';
const LITELLM_ADVISORY = 'https://docs.litellm.ai/blog/security-update-march-2026';
const DATADOG_ANALYSIS =
  'https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/';

function DataPathDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 470"
        role="img"
        aria-labelledby="gw-datapath-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="gw-datapath-title">
          Request data path: web/chat, agent, and RAG applications all speak the OpenAI wire
          format to a single LiteLLM gateway, which applies control-plane policy and re-issues each
          call to one or more OpenAI-compatible vLLM endpoints.
        </title>
        <style>
          {`
            .gw-app { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
            .gw-gate { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
            .gw-eng { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .gw-engalt { fill: #f9f9fa; stroke: #879596; stroke-width: 1.5; }
            .gw-at { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
            .gw-as { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
            .gw-gt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
            .gw-gs { fill: #d6f2ee; font: 11px sans-serif; text-anchor: middle; }
            .gw-et { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .gw-es { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .gw-tier { fill: #5f6b7a; font: 600 12px sans-serif; letter-spacing: 0.5px; }
            .gw-tiersub { fill: #5f6b7a; font: 11px sans-serif; }
            .gw-wire { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
            .gw-note { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .gw-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#gw-ah); }
            .gw-base { stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; }
          `}
        </style>
        <defs>
          <marker
            id="gw-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={470} rx={8} fill="#ffffff" />

        {/* Tier labels */}
        <text className="gw-tier" x={30} y={26}>PRODUCT / CONTROL TIER</text>
        <text className="gw-tiersub" x={30} y={42}>own auth, budgets, routing, UX</text>
        <text className="gw-tier" x={830} y={26} textAnchor="end">ENGINE TIER</text>
        <text className="gw-tiersub" x={830} y={42} textAnchor="end">own GPU, KV cache, scheduler</text>

        {/* App tier: three boxes */}
        <rect className="gw-app" x={40} y={60} width={220} height={64} rx={8} />
        <text className="gw-at" x={150} y={88}>Web / chat UI</text>
        <text className="gw-as" x={150} y={108}>(Open WebUI)</text>

        <rect className="gw-app" x={320} y={60} width={220} height={64} rx={8} />
        <text className="gw-at" x={430} y={88}>Agents</text>
        <text className="gw-as" x={430} y={108}>(LangChain)</text>

        <rect className="gw-app" x={600} y={60} width={220} height={64} rx={8} />
        <text className="gw-at" x={710} y={88}>RAG pipeline</text>
        <text className="gw-as" x={710} y={108}>(LlamaIndex)</text>

        {/* Wire-format annotation */}
        <text className="gw-wire" x={430} y={150}>
          all speak POST /v1/chat/completions (OpenAI wire format)
        </text>

        {/* Arrows from each app down to the gateway */}
        <path className="gw-arr" d="M150,124 C150,170 380,170 425,185" />
        <path className="gw-arr" d="M430,124 L430,185" />
        <path className="gw-arr" d="M710,124 C710,170 480,170 435,185" />

        {/* Gateway tier */}
        <rect className="gw-gate" x={250} y={190} width={360} height={92} rx={8} />
        <text className="gw-gt" x={430} y={218}>LLM gateway / proxy (LiteLLM)</text>
        <text className="gw-gs" x={430} y={240}>retries · fallbacks · budgets · rate limits</text>
        <text className="gw-gs" x={430} y={258}>virtual keys · logging · multi-provider unification</text>
        <text className="gw-gs" x={430} y={276}>model = hosted_vllm/...</text>

        {/* Re-issue annotation, beside the gateway so the fan-out arrows stay clear of it */}
        <text className="gw-note" x={735} y={232}>re-issues OpenAI-format</text>
        <text className="gw-note" x={735} y={248}>request to api_base</text>

        {/* Arrows fanning out to the three engine endpoints */}
        <path className="gw-arr" d="M430,282 C430,310 170,316 150,330" />
        <path className="gw-arr" d="M430,282 L430,330" />
        <path className="gw-arr" d="M430,282 C430,310 690,316 710,330" />

        {/* Engine tier: vLLM endpoints + other compat/SaaS */}
        <rect className="gw-eng" x={40} y={334} width={220} height={72} rx={8} />
        <text className="gw-et" x={150} y={362}>vLLM endpoint</text>
        <text className="gw-es" x={150} y={382}>/v1 (model A)</text>

        <rect className="gw-eng" x={320} y={334} width={220} height={72} rx={8} />
        <text className="gw-et" x={430} y={362}>vLLM endpoint</text>
        <text className="gw-es" x={430} y={382}>/v1 (model B)</text>

        <rect className="gw-engalt" x={600} y={334} width={220} height={72} rx={8} />
        <text className="gw-et" x={710} y={362}>Other provider</text>
        <text className="gw-es" x={710} y={382}>OpenAI-compatible / SaaS</text>

        {/* Shared baseline under the vLLM endpoints */}
        <path className="gw-base" d="M150,422 L430,422" />
        <text className="gw-note" x={290} y={440}>vllm serve · OpenAI-compatible (§12)</text>
      </svg>
    </div>
  );
}

export function GatewaysAppLayer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Put a gateway, a chat UI and an agent framework in front of vLLM by changing one base URL, and keep budgets and keys out of the engine (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
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
            stack snaps in front of it with no code changes: you swap a base URL and an API
            key, and the gateway, the chat UI, and the RAG (retrieval-augmented generation) or agent
            framework all believe they are talking to OpenAI. vLLM owns the <em>engine tier</em> (the
            GPU, the KV (key-value) cache, the scheduler); these tools own the{' '}
            <em>product / control tier</em> (auth, budgets, routing, UX, retrieval). The discipline
            that keeps a deployment maintainable is keeping those two tiers decoupled: the engine
            should not know about your billing plan, and your billing plan should not be pinned to
            one engine.
          </Box>
          <Box variant="p">
            <strong>Why this is its own tier:</strong> a raw <code>vllm serve</code> process is a
            single model on a single endpoint. It can cap its own queue (past{' '}
            <code>--max-num-queued-reqs</code> it answers HTTP 503){' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L93-L120')} kind="code">
              config/scheduler.py L93-L120
            </Cite>
            , but it has no concept of per-team rate limits, spend caps, multi-provider fallback, or
            a human-facing UI. In production you almost never expose that process directly. You
            front it with a gateway for control-plane concerns and point apps at the gateway.
            Everything below bolts on through the OpenAI wire contract, with no rewrite of your call
            sites.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where each tool sits on the request path, and the one setting that connects it to vLLM"
          >
            The layers in front of the engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read the diagram top-down as the request path. Applications and agents never address a
            GPU; they address an OpenAI-shaped URL. A gateway (here, LiteLLM) terminates that
            contract, applies control-plane policy, and re-issues the call to one or more vLLM
            endpoints, each of which is, again, just an OpenAI-compatible server.
          </Box>

          <DataPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured.
          </Box>

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
                adds: 'Retries & fallbacks, spend budgets, rate limits, virtual API keys, request logging, and multi-provider unification (one endpoint that fronts vLLM plus OpenAI/Bedrock/Anthropic/etc.), as LiteLLM describes its proxy.',
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
                adds: 'A human-facing chat interface, conversation history, user accounts, and model selection, with no application code required to talk to the model.',
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
                adds: 'Retrieval, chunking, tool/agent orchestration, prompt templating, and memory: the application logic around the model.',
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
            Integration details:{' '}
            <Cite tier={1} href={vllmDocsUrl('deployment/frameworks/litellm/')}>
              vLLM docs: LiteLLM
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={vllmDocsUrl('deployment/frameworks/open-webui/')}>
              vLLM docs: Open WebUI
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Retries, budgets and rate limits for a vLLM fleet from one model prefix and one URL, and the version pin that keeps the gateway itself safe"
          >
            The gateway tier (LiteLLM)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A gateway is the seam where control-plane concerns live. LiteLLM (in its own framing a
            unified interface to many providers) sits between your apps and the engines and adds
            what <code>vllm serve</code> leaves out: retry and fallback logic across deployments,
            budgets and rate limits per project, API key or model{' '}
            <Cite tier={1} href={vllmUrl(LITELLM_PAGE, 'L3-L12')}>
              litellm.md L3-L12
            </Cite>
            , and a single OpenAI-shaped URL that can fan out to vLLM <em>and</em> hosted providers
            behind one contract.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`import litellm

# Call your vLLM server through LiteLLM: note the hosted_vllm/ prefix
response = litellm.completion(
    model="hosted_vllm/qwen/Qwen1.5-0.5B-Chat",   # hosted_vllm is required
    messages=messages,
    api_base="http://{your-vllm-server-host}:{your-vllm-server-port}/v1",
    temperature=0.2,
    max_tokens=80,
)`}</pre>
          </Box>

          <Box variant="p">
            Two details matter. First, the <code>hosted_vllm/</code> prefix is required (&quot;
            <code>hosted_vllm</code> is prefix key word and necessary&quot;){' '}
            <Cite tier={1} href={vllmUrl(LITELLM_PAGE, 'L41-L48')}>
              litellm.md L41-L48
            </Cite>
            . It is what tells LiteLLM to route to a self-hosted OpenAI-compatible vLLM server (at
            your <code>api_base</code>) rather than to a hosted vendor. Second, the same call shape
            works for embeddings, and you can set <code>HOSTED_VLLM_API_BASE</code> as an environment
            variable instead of passing <code>api_base</code> per call{' '}
            <Cite tier={1} href={vllmUrl(LITELLM_PAGE, 'L63-L71')}>
              litellm.md L63-L71
            </Cite>
            .
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What the gateway is good at</Box>
              <ul>
                <li>
                  <strong>Reliability:</strong> retries and fallbacks. If one vLLM endpoint is
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
                  the seam, instead of scattered across apps.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">What stays in the engine</Box>
              <ul>
                <li>
                  <strong>Throughput:</strong> continuous batching, the scheduler, KV-cache
                  management, vLLM&apos;s reason to exist.
                </li>
                <li>
                  <strong>Model placement:</strong> which GPU, tensor/pipeline parallelism, quantization.
                </li>
                <li>
                  <strong>Decode features:</strong> structured outputs, tool-call parsing (
                  <code>--enable-auto-tool-choice</code> with the model&apos;s{' '}
                  <code>--tool-call-parser</code>) and prefix caching (on by default for models that
                  support it{' '}
                  <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2926-L2962')} kind="code">
                    arg_utils.py L2926-L2962
                  </Cite>
                  ) are set on <code>vllm serve</code> (§12); the gateway passes them through.
                </li>
                <li>
                  <strong>Don&apos;t leak tiers:</strong> keep budgets/keys in the gateway and engine
                  tuning in vLLM; mixing them couples your control plane to one engine.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Pin the gateway: the LiteLLM PyPI compromise of March 24, 2026">
            <SpaceBetween size="s">
              <Box variant="p">
                This concerns the <code>litellm</code> package, and says nothing about vLLM. On
                March 24, 2026, <code>litellm==1.82.7</code> and <code>litellm==1.82.8</code> were
                uploaded to PyPI outside LiteLLM&apos;s release pipeline and were live from 10:39 UTC
                for about 40 minutes before PyPI quarantined them. They appear to have carried a
                credential stealer that harvested environment variables, SSH keys, cloud credentials
                and Kubernetes tokens and sent them to a domain LiteLLM does not own. The official
                LiteLLM Proxy Docker image was not affected, because it pins its dependencies{' '}
                <Cite tier={2} href={LITELLM_ADVISORY}>
                  LiteLLM security update (vendor advisory)
                </Cite>
                . Datadog&apos;s analysis adds that the payload installed persistence as a user
                systemd service{' '}
                <Cite tier={3} href={DATADOG_ANALYSIS}>
                  Datadog Security Labs: LiteLLM and Telnyx compromised on PyPI
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Check your exposure:</strong> the advisory counts you as possibly affected
                if you installed or upgraded <code>litellm</code> with pip, or built an image that did,
                between 10:39 and 16:00 UTC that day, including as an unpinned transitive dependency
                of an agent framework or MCP (Model Context Protocol) server. Look for{' '}
                <code>litellm_init.pth</code> in site-packages. If you are on 1.82.6 or earlier and did
                not upgrade in that window, you are not affected. The first clean release after the
                incident is v1.83.0 (March 30, 2026){' '}
                <Cite tier={2} href={LITELLM_ADVISORY}>
                  LiteLLM security update
                </Cite>
                , and the latest on 2026-10-16 is{' '}
                <Cite tier={1} href="https://github.com/BerriAI/litellm/releases/tag/v1.105.1">
                  LiteLLM v1.105.1 release
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>To get it right in this tier:</strong> pin exact versions, transitive ones
                included, in lockfiles and audit before upgrading; do not auto-upgrade gateway
                dependencies in CI (continuous integration). If an affected version ran anywhere, the
                advisory&apos;s first action is &quot;Rotate all secrets&quot; that were present on that
                system. Removing the package is not a complete remediation: Datadog recommends checking
                the host for persistence and outbound traffic and rebuilding critical systems from a
                known-good state{' '}
                <Cite tier={3} href={DATADOG_ANALYSIS}>
                  Datadog Security Labs
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A chat interface for a self-hosted model from one environment variable"
          >
            The UI tier (Open WebUI)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When you want a chat interface in front of a self-hosted model, you point an existing
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
            model appears in the UI and is ready for chat{' '}
            <Cite tier={1} href={vllmUrl('docs/deployment/frameworks/open-webui.md', 'L19-L40')}>
              open-webui.md L19-L40
            </Cite>
            . In a production layout you would typically point the UI at the <em>gateway</em> URL
            instead of the engine directly, so the UI&apos;s traffic also picks up the gateway&apos;s
            auth, budgets, and logging.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which framework class to use against a served fleet, and how coding agents reach vLLM through Messages and Responses"
          >
            The RAG / agent tier (LangChain, LlamaIndex)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RAG and agent frameworks need a chat/completions endpoint and embeddings, both of
            which the vLLM server already speaks (§12). Against a served model the integration
            pattern is the same as everything else in this tier: use the framework&apos;s OpenAI
            client and override the base URL.
          </Box>
          <Alert type="info" header="Against a fleet, use the OpenAI client; the vLLM classes embed the engine">
            Both frameworks also ship a class named for vLLM: LangChain&apos;s <code>VLLM</code>{' '}
            (<code>from langchain_community.llms import VLLM</code>) and LlamaIndex&apos;s{' '}
            <code>Vllm</code> (<code>from llama_index.llms.vllm import Vllm</code>). Each is built
            from a model name and engine arguments such as <code>tensor_parallel_size</code>, with
            no server URL, and runs inference on GPUs from the framework&apos;s own process{' '}
            <Cite tier={1} href={vllmUrl('docs/serving/integrations/langchain.md', 'L11-L27')}>
              langchain.md L11-L27
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('docs/serving/integrations/llamaindex.md', 'L11-L21')}>
              llamaindex.md L11-L21
            </Cite>
            . That fits local, single-process use, and it puts the engine tier inside the
            application, past any gateway. For a served fleet, instantiate the
            framework&apos;s OpenAI-style client (chat model and/or embeddings) and set its base URL
            to the vLLM or gateway <code>/v1</code> path. That route depends only on the OpenAI
            wire contract, so it stays stable across framework versions.
          </Alert>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Pattern (illustrative): point the framework's OpenAI client at vLLM.
# LangChain, ChatOpenAI with an overridden base URL:
#   ChatOpenAI(model="<served-model>",
#              base_url="http://localhost:8000/v1",
#              api_key="token-abc123")
#
# LlamaIndex, OpenAILike / OpenAI client with api_base set to the vLLM URL:
#   OpenAILike(model="<served-model>",
#              api_base="http://localhost:8000/v1",
#              api_key="token-abc123", is_chat_model=True)`}</pre>
          </Box>
          <Box variant="small">
            Confirm the exact client class and parameter names against your installed framework
            version; the load-bearing fact is that vLLM is addressed as an OpenAI provider{' '}
            <Cite tier={1} href={vllmDocsUrl('serving/openai_compatible_server/')}>
              vLLM docs: OpenAI-Compatible Server
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Coding agents use two more contracts.</strong> Claude Code speaks the Anthropic
            Messages API: set <code>ANTHROPIC_BASE_URL</code> to the vLLM server and its requests
            land on <code>/v1/messages</code>{' '}
            <Cite tier={1} href={vllmDocsUrl('serving/integrations/claude_code/')}>
              vLLM docs: Claude Code
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/anthropic/api_router.py', 'L51-L52')} kind="code">
              anthropic/api_router.py L51-L52
            </Cite>
            . Codex speaks the OpenAI Responses API: a provider entry with{' '}
            <code>wire_api = &quot;responses&quot;</code> and <code>base_url</code> at the vLLM{' '}
            <code>/v1</code> path sends it to <code>/v1/responses</code>{' '}
            <Cite tier={1} href={vllmDocsUrl('serving/integrations/codex/')}>
              vLLM docs: Codex
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/responses/api_router.py', 'L48-L49')} kind="code">
              responses/api_router.py L48-L49
            </Cite>
            . Both need a model served with tool calling on (<code>--enable-auto-tool-choice</code>{' '}
            plus the model&apos;s <code>--tool-call-parser</code>). If a gateway sits in that path,
            confirm it forwards the contract the agent speaks; <strong>12. The OpenAI-Compatible
            Server</strong> lists every route vLLM registers and which ones <code>--api-key</code>{' '}
            guards.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four placement rules that let you swap the engine or the gateway without touching the other"
          >
            Keeping the tiers decoupled
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The wire contract is the decoupling boundary. Keep control-plane logic in the gateway
            and engine tuning in vLLM, and you can swap either side independently.
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
                <strong>Throughput and decode features live in the engine.</strong> Batching, KV
                cache, structured outputs, tool-call parsing and prefix caching are{' '}
                <code>vllm serve</code> settings (§12); a gateway can only pass them through.
              </Box>
              <Box variant="p">
                <strong>The wire format is the contract.</strong> Everything in this section works
                because each layer speaks a contract vLLM serves: OpenAI&apos;s{' '}
                <code>/v1/chat/completions</code> and <code>/v1/embeddings</code> for UIs and
                frameworks, Responses and Anthropic Messages for coding agents. That is why a UI, a
                gateway, and a RAG framework written for OpenAI all run in front of your GPU with a
                base-URL swap.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
