import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

/** Ray source pinned to the newest stable release, ray-2.59.0 (commit dd83c3a7). */
const RAY = 'https://github.com/ray-project/ray/blob/ray-2.59.0';
/** Ray Serve LLM docs for the same release. */
const RAY_DOCS = 'https://docs.ray.io/en/releases-2.59.0/serve/llm';
const RAY_OVERVIEW = `${RAY_DOCS}/index.html`;
const RAY_COMPAT = `${RAY_DOCS}/user-guides/vllm-compatibility.html`;
const RAY_LLM_CONFIG = `${RAY}/python/ray/llm/_internal/serve/core/configs/llm_config.py`;
const RAY_VLLM_MODELS = `${RAY}/python/ray/llm/_internal/serve/engines/vllm/vllm_models.py`;
const RAY_PD_SERVER = `${RAY}/python/ray/llm/_internal/serve/serving_patterns/prefill_decode/pd_server.py`;
const RAY_KV_BASE = `${RAY}/python/ray/llm/_internal/serve/engines/vllm/kv_transfer/base.py`;
const RAY_INIT = `${RAY}/python/ray/serve/llm/__init__.py`;
const PARALLEL = 'vllm/config/parallel.py';

interface DivisionRow {
  concern: string;
  vllm: string;
  rayServe: string;
}

const divisionRows: DivisionRow[] = [
  {
    concern: 'Running the model on a GPU',
    vllm: 'The engine itself: the paged KV (key-value) cache, continuous batching, the scheduler, the kernels. One process group, one model.',
    rayServe: 'It embeds the engine and leaves inference to it: vLLM by default, or SGLang through a different server class.',
  },
  {
    concern: 'OpenAI-compatible HTTP API',
    vllm: 'vllm serve exposes /v1/chat/completions, /v1/completions, etc. for one engine on one endpoint.',
    rayServe: 'Re-exposes the same OpenAI surface in front of many engines, behind one route. "An OpenAI-compatible API that aligns with vLLM\'s OpenAI-compatible server."',
  },
  {
    concern: 'Engine configuration',
    vllm: 'CLI flags / EngineArgs: --tensor-parallel-size, --max-model-len, quantization, and the rest.',
    rayServe: 'Passes them through. The same flags become engine_kwargs on an LLMConfig. "Most of the engine_kwargs that work with vllm serve work with Ray Serve LLM."',
  },
  {
    concern: 'Multi-node placement of one model',
    vllm: 'Two executors (Section 9): multiprocessing, the CUDA default, started on each node with --nnodes; or Ray, set with --distributed-executor-backend ray.',
    rayServe: 'Owns the cluster. Runs each GPU replica in a Ray placement group sized from accelerator_type or placement_group_config, and sets vLLM\'s executor to Ray.',
  },
  {
    concern: 'Running many models / replicas',
    vllm: 'Out of scope. One vllm serve = one model on one endpoint.',
    rayServe: 'Multiple LLMConfigs behind one OpenAI app; the client picks by model name. Multi-LoRA (Low-Rank Adaptation) adapters on a shared base model too.',
  },
  {
    concern: 'Autoscaling & replica choice',
    vllm: 'None. The engine serves whatever traffic it is given.',
    rayServe: 'Per-deployment autoscaling (min/max replicas) driven by load. Replica selection by load, or by prefix-cache and KV-cache overlap with the prefix-aware and KV-aware routers.',
  },
  {
    concern: 'Fault tolerance & health',
    vllm: 'A crashed engine process is a crashed endpoint.',
    rayServe: 'Supervises replicas: health checks, restart-on-failure, monitoring. A dead replica is replaced while the endpoint keeps serving.',
  },
  {
    concern: 'Kubernetes-native operation',
    vllm: 'Provides a container image; deployment is your problem.',
    rayServe: 'Runs as a RayService via KubeRay, with declarative CRDs (Custom Resource Definitions), autoscaling, blue/green upgrades (KubeRay, below).',
  },
];

interface BuilderRow {
  api: string;
  role: string;
}

const builderRows: BuilderRow[] = [
  {
    api: 'LLMConfig',
    role: 'Declares one model: model_loading_config (id + source), deployment_config (autoscaling min/max replicas, request router), accelerator_type or placement_group_config, engine_kwargs (the vLLM flags), and server_cls, the engine wrapper (LLMServer for vLLM, SGLangServer for SGLang). One LLMConfig per model you serve.',
  },
  {
    api: 'build_openai_app',
    role: 'The main entry point. Takes LLMServingArgs (a list of LLMConfigs plus ingress options) and returns a deployable Serve app with the OpenAI-compatible front door in front of them. The usual path.',
  },
  {
    api: 'OpenAiIngress',
    role: 'The front door itself, in ray.serve.llm.ingress: the OpenAI routes (/v1/chat/completions, /v1/completions, /v1/models, /v1/embeddings and others) that send each request to the deployment serving its model.',
  },
  {
    api: 'PrefixCacheAffinityRouter, KVAwareRouter',
    role: 'Request routers in ray.serve.llm.request_router, set through request_router_config in deployment_config. PrefixCacheAffinityRouter (stable) sends a prompt to the replica that served its prefix while load is balanced, and falls back to power-of-two-choices when it is not. KVAwareRouter (alpha) routes by KV-cache overlap through a KV router actor.',
  },
  {
    api: 'build_llm_deployment',
    role: 'Lower-level builder for a single LLM deployment when you are composing your own app rather than using the OpenAI front door.',
  },
  {
    api: 'LLMServer',
    role: 'The deployment class that wraps a vLLM engine as a Serve replica, the unit Ray Serve scales, places, and health-checks.',
  },
];

function RayServeTopologyDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 440"
        role="img"
        aria-labelledby="ray-serve-topology-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="ray-serve-topology-title">
          Clients send OpenAI-compatible requests to one Ray Serve LLM ingress, OpenAiIngress,
          which routes each request by model name and then picks a replica by load, prefix or
          KV-cache overlap. Each LLM server replica embeds one vLLM engine; a replica with tensor
          parallelism of 2 runs one vLLM worker per GPU. Ray Serve LLM places every replica in a
          Ray placement group and sets vLLM's executor to Ray, so those workers run on Ray.
        </title>
        <style>
          {`
            .rl-bg { fill: #ffffff; }
            .rl-lbl { font: 600 13px sans-serif; fill: #16191f; }
            .rl-sub { font: 400 11px sans-serif; fill: #414d5c; }
            .rl-title { font: 700 14px sans-serif; fill: #16191f; }
            .rl-node { fill: none; stroke: #7d8998; stroke-width: 1.5; stroke-dasharray: 5 4; }
            .rl-router { fill: #f2f8fd; stroke: #539fe5; stroke-width: 1.5; }
            .rl-rep { fill: #f2faf5; stroke: #1d8102; stroke-width: 1.5; }
            .rl-eng { fill: #fbf3ef; stroke: #bf4f1f; stroke-width: 1.5; }
            .rl-cli { fill: #f4f4f4; stroke: #7d8998; stroke-width: 1.5; }
            .rl-flow { stroke: #539fe5; stroke-width: 2; fill: none; }
          `}
        </style>
        <defs>
          <marker
            id="rlArrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#539fe5" />
          </marker>
        </defs>

        <rect x="0" y="0" width="760" height="440" rx="8" className="rl-bg" />

        <text x="16" y="26" className="rl-title">
          One endpoint, many engines: Ray Serve LLM in front of vLLM
        </text>

        {/* Clients */}
        <rect x="20" y="50" width="170" height="76" rx="8" className="rl-cli" />
        <text x="105" y="76" textAnchor="middle" className="rl-lbl">
          Clients
        </text>
        <text x="105" y="96" textAnchor="middle" className="rl-sub">
          OpenAI client / cURL
        </text>
        <text x="105" y="112" textAnchor="middle" className="rl-sub">
          POST /v1/chat/completions
        </text>

        {/* Ingress */}
        <rect x="250" y="44" width="300" height="90" rx="8" className="rl-router" />
        <text x="400" y="68" textAnchor="middle" className="rl-lbl">
          Ray Serve LLM ingress
        </text>
        <text x="400" y="88" textAnchor="middle" className="rl-sub">
          OpenAiIngress: OpenAI-compatible API
        </text>
        <text x="400" y="104" textAnchor="middle" className="rl-sub">
          routes by model name, then picks a replica:
        </text>
        <text x="400" y="120" textAnchor="middle" className="rl-sub">
          by load, prefix match or KV overlap
        </text>

        <line x1="190" y1="88" x2="248" y2="88" className="rl-flow" markerEnd="url(#rlArrow)" />

        {/* Node A */}
        <rect x="20" y="170" width="350" height="180" rx="10" className="rl-node" />
        <text x="36" y="190" className="rl-lbl">
          Node A
        </text>

        <rect x="40" y="204" width="310" height="130" rx="8" className="rl-rep" />
        <text x="195" y="226" textAnchor="middle" className="rl-lbl">
          LLM server replica (model X)
        </text>
        <text x="195" y="243" textAnchor="middle" className="rl-sub">
          one vLLM engine, TP=2, Ray executor
        </text>
        <rect x="58" y="254" width="130" height="68" rx="6" className="rl-eng" />
        <text x="123" y="276" textAnchor="middle" className="rl-sub">
          vLLM worker
        </text>
        <text x="123" y="292" textAnchor="middle" className="rl-sub">
          GPU 0 (TP rank 0)
        </text>
        <text x="123" y="308" textAnchor="middle" className="rl-sub">
          paged KV cache
        </text>
        <rect x="202" y="254" width="130" height="68" rx="6" className="rl-eng" />
        <text x="267" y="276" textAnchor="middle" className="rl-sub">
          vLLM worker
        </text>
        <text x="267" y="292" textAnchor="middle" className="rl-sub">
          GPU 1 (TP rank 1)
        </text>
        <text x="267" y="308" textAnchor="middle" className="rl-sub">
          paged KV cache
        </text>

        {/* Node B */}
        <rect x="400" y="170" width="330" height="180" rx="10" className="rl-node" />
        <text x="416" y="190" className="rl-lbl">
          Node B
        </text>

        <rect x="420" y="204" width="290" height="58" rx="8" className="rl-rep" />
        <text x="565" y="226" textAnchor="middle" className="rl-lbl">
          LLM server replica (model X) #2
        </text>
        <text x="565" y="246" textAnchor="middle" className="rl-sub">
          autoscaled copy of model X
        </text>

        <rect x="420" y="276" width="290" height="58" rx="8" className="rl-rep" />
        <text x="565" y="298" textAnchor="middle" className="rl-lbl">
          LLM server replica (model Y)
        </text>
        <text x="565" y="318" textAnchor="middle" className="rl-sub">
          different model, same endpoint
        </text>

        {/* ingress to replicas */}
        <line x1="330" y1="134" x2="200" y2="202" className="rl-flow" markerEnd="url(#rlArrow)" />
        <line x1="470" y1="134" x2="560" y2="202" className="rl-flow" markerEnd="url(#rlArrow)" />
        <path d="M550,104 H745 V305 H712" className="rl-flow" markerEnd="url(#rlArrow)" />

        <text x="380" y="380" textAnchor="middle" className="rl-sub">
          Ray Serve owns placement, autoscaling, health and routing across nodes.
        </text>
        <text x="380" y="400" textAnchor="middle" className="rl-sub">
          vLLM owns what happens inside each engine (Sections 3-9).
        </text>
        <text x="380" y="420" textAnchor="middle" className="rl-sub">
          Ray Serve LLM puts each replica in a Ray placement group and sets vLLM's Ray executor
          (Section 9).
        </text>
      </svg>
    </div>
  );
}

export function RayServeLLM() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What Ray adds on top of the vLLM engine, and the clean line between the two: vLLM does inference, Ray Serve LLM does orchestration (verified against vLLM v0.31.0, commit db9527a4, and Ray 2.59.0, 2026-10-16)"
          >
            15. Orchestration: Ray &amp; Ray Serve LLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The division of labor is the whole point.</strong> vLLM is an{' '}
            <em>inference engine</em>: it makes one model run fast on a set of GPUs.
            It deliberately leaves the operational work around a production endpoint to
            another layer: deploying across many nodes, scaling replicas up and down with
            load, restarting a crashed worker, serving several models behind one URL.{' '}
            <strong>Ray Serve LLM is the orchestration layer that adds exactly those
            things</strong> (its controller health-checks every replica and restarts one that
            fails{' '}
            <Cite
              tier={1}
              href="https://docs.ray.io/en/releases-2.59.0/serve/production-guide/fault-tolerance.html"
            >
              Ray Serve: fault tolerance, replica health-checking
            </Cite>
            ), and it does so without reimplementing inference: it embeds the
            engine and wraps it. The engine is pluggable, vLLM by default and SGLang as a
            second backend{' '}
            <Cite tier={1} href={RAY_OVERVIEW}>
              Ray Serve LLM overview, key features
            </Cite>{' '}
            <Cite tier={1} href={`${RAY_LLM_CONFIG}#L164-L228`} kind="code">
              llm_config.py L164-L228
            </Cite>
            , which makes Ray Serve LLM the same kind of layer as NVIDIA Dynamo (Section 18):
            an orchestrator over engines.
          </Box>
          <Box variant="p">
            If your team already lives in Ray, or wants multi-node serving, autoscaling, and
            an OpenAI endpoint without standing up a separate Kubernetes operator, Ray Serve
            LLM keeps everything in one Python framework. The OpenAI surface it exposes is
            deliberately the one vLLM exposes: "an OpenAI-compatible API that aligns with
            vLLM's OpenAI-compatible server," so the client code does not change when you
            move from a single <code>vllm serve</code> to an orchestrated fleet{' '}
            <Cite tier={1} href={RAY_COMPAT}>
              Ray Serve LLM: vLLM compatibility
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>Where Ray sits under vLLM.</strong> A plain <code>vllm serve</code> runs
            multi-node without Ray: on CUDA the default executor is multiprocessing, started on
            each node with <code>--nnodes</code>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L989-L1031')} kind="code">
              config/parallel.py L989-L1031
            </Cite>
            . Ray Serve LLM is what puts vLLM on its Ray executor: it runs every GPU replica in
            a Ray placement group and sets the executor to Ray (the two hats, below). Executor
            mechanics are in <strong>Section 9, Distributed Inference</strong>, and{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>{' '}
            (Executor backends). The Kubernetes-operator alternatives (Production-Stack and
            llm-d / KServe) are <strong>Sections 16</strong> and <strong>17</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which production concern each project owns, so you know exactly what adopting Ray Serve LLM adds"
          >
            What vLLM gives you vs what Ray Serve LLM adds
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read this table as the contract between the two projects. Every row is a
            production concern; the engine owns the left column, the orchestrator owns
            the right. The orchestrator stays out of the engine's job; it manages copies
            of it.
          </Box>
          <Table
            items={divisionRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'concern',
                header: 'Production concern',
                cell: (r) => <strong>{r.concern}</strong>,
                minWidth: 180,
              },
              {
                id: 'vllm',
                header: 'vLLM (the inference engine)',
                cell: (r) => r.vllm,
                minWidth: 280,
              },
              {
                id: 'rayServe',
                header: 'Ray Serve LLM (the orchestration layer)',
                cell: (r) => r.rayServe,
                minWidth: 300,
              },
            ]}
          />
          <Box variant="small">
            Feature list from the{' '}
            <Cite tier={1} href={RAY_OVERVIEW}>
              Ray Serve LLM overview
            </Cite>
            ; engine_kwargs pass-through and API alignment from the{' '}
            <Cite tier={1} href={RAY_COMPAT}>
              vLLM compatibility guide
            </Cite>
            ; the multi-node row from source{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L989-L1031')} kind="code">
              config/parallel.py L989-L1031
            </Cite>{' '}
            <Cite tier={1} href={`${RAY_VLLM_MODELS}#L147-L162`} kind="code">
              vllm_models.py L147-L162
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How a request finds its model and then a replica, and where vLLM's own parallelism sits inside that"
          >
            The shape of a deployment: clients &rarr; router &rarr; engines
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A Ray Serve LLM app has the same topology whether it serves one model or
            many: <strong>one OpenAI-compatible ingress</strong>, <code>OpenAiIngress</code>
            {' '}
            <Cite tier={1} href={`${RAY}/python/ray/serve/llm/ingress.py#L8-L20`} kind="code">
              ray/serve/llm/ingress.py L8-L20
            </Cite>{' '}
            <Cite
              tier={1}
              href={`${RAY}/python/ray/llm/_internal/serve/core/ingress/ingress.py#L120-L130`}
              kind="code"
            >
              core/ingress/ingress.py L120-L130
            </Cite>
            , that routes by model name to <strong>a pool of LLM server replicas</strong>.
            Within a model, the replica is picked by load, or by prefix-cache or KV-cache
            overlap when you configure <code>PrefixCacheAffinityRouter</code> or the alpha{' '}
            <code>KVAwareRouter</code>{' '}
            <Cite tier={1} href={`${RAY}/python/ray/serve/llm/request_router.py#L10-L52`} kind="code">
              request_router.py L10-L52
            </Cite>
            . Each replica is an embedded vLLM engine that may itself be tensor-parallel (TP)
            or pipeline-parallel (PP) across GPUs and nodes. The client speaks plain OpenAI;
            Ray decides which replica answers and on which node it runs.
          </Box>

          <RayServeTopologyDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The replica count, TP=2 and node layout are an
            example; the router and replica roles follow the{' '}
            <Cite tier={1} href={RAY_OVERVIEW}>
              Ray Serve LLM overview
            </Cite>{' '}
            and the Ray 2.59.0 classes cited above.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A plain vllm serve goes multi-node without Ray; Ray Serve LLM is what switches vLLM onto its Ray executor"
          >
            Two hats Ray wears: executor backend vs orchestration layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Ray touches vLLM at two altitudes, and they answer different questions: how one
            model's workers get spawned, and how a fleet of models gets served.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Ray as one of vLLM's executors (below)</Box>
              <Box variant="p">
                When one model's TP and PP span more than one node, vLLM needs an executor
                to spawn and supervise a worker process per GPU rank, laid out as{' '}
                <code>world_size = TP &times; PP</code>. It has two. Multiprocessing (
                <code>mp</code>) is the CUDA default: start <code>vllm serve</code> on every
                node with the same <code>--nnodes</code> and a distinct{' '}
                <code>--node-rank</code>. Ray runs the workers when you pass{' '}
                <code>--distributed-executor-backend ray</code>. Without the flag, vLLM
                selects Ray itself only when <code>data_parallel_backend</code> is{' '}
                <code>ray</code> or the process already sits in a Ray placement group, and
                only for a world that fits the node{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L989-L1031')} kind="code">
                  config/parallel.py L989-L1031
                </Cite>
                . A world larger than one node's GPUs with neither <code>--nnodes</code> nor
                the flag stops at startup, and the error names both fixes.
              </Box>
            </div>
            <div>
              <Box variant="h3">Ray Serve LLM as the orchestration layer (above)</Box>
              <Box variant="p">
                This is the serving framework: it wraps each engine as a Serve deployment,
                gives the fleet an OpenAI endpoint, autoscales replicas, health-checks them,
                and routes across them. It runs each GPU replica in a placement group sized
                from <code>accelerator_type</code> or <code>placement_group_config</code>,
                sets <code>distributed_executor_backend</code> to <code>"ray"</code> and
                rejects any other value{' '}
                <Cite tier={1} href={`${RAY_VLLM_MODELS}#L147-L162`} kind="code">
                  vllm_models.py L147-L162
                </Cite>
                , then hands vLLM the placement group{' '}
                <Cite
                  tier={1}
                  href={`${RAY}/python/ray/llm/_internal/serve/engines/vllm/vllm_engine.py#L634`}
                  kind="code"
                >
                  vllm_engine.py L634
                </Cite>
                . The mental model: the executor makes one model multi-node; Ray Serve LLM
                makes a whole <em>service</em> multi-node and elastic.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="vLLM's parallelism guide and its code disagree on the multi-node default">
            The guide says "the default distributed runtimes are Ray for multi-node inference
            and native Python multiprocessing for single-node inference"{' '}
            <Cite
              tier={1}
              href={vllmUrl('docs/serving/parallelism_scaling.md', 'L33')}
              kind="doc-code-conflict"
            >
              vLLM docs, Parallelism and Scaling: parallelism_scaling.md L33
            </Cite>
            . The selection code picks <code>mp</code> for a CUDA run with{' '}
            <code>--nnodes</code> greater than 1 and never auto-selects Ray for a world that
            outgrows one node{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L999-L1012')} kind="code">
              config/parallel.py L999-L1012
            </Cite>
            . The code is what runs: plan a multi-node <code>vllm serve</code> around{' '}
            <code>--nnodes</code>, and treat Ray as a choice you make, or one Ray Serve LLM
            makes for you.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Your vllm serve flags carry over as engine_kwargs; check them against vLLM 0.27.0, the version ray[llm] 2.59.0 installs"
          >
            The API surface: it really is just vLLM flags
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The reason adoption is cheap for a vLLM shop is that the configuration is
            almost a one-to-one mapping. Your <code>vllm serve</code> flags become{' '}
            <code>engine_kwargs</code> on an <code>LLMConfig</code>, and the compatibility
            guide states the relationship plainly: "Most of the{' '}
            <code>engine_kwargs</code> that work with <code>vllm serve</code> work with
            Ray Serve LLM." It also confirms you keep vLLM features such as multimodal,
            structured output, and reasoning models through the same path{' '}
            <Cite tier={1} href={RAY_COMPAT}>
              Ray Serve LLM: vLLM compatibility
            </Cite>
            .
          </Box>
          <Table
            items={builderRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'api',
                header: 'API',
                cell: (r) => <code>{r.api}</code>,
                minWidth: 170,
              },
              { id: 'role', header: 'What it is', cell: (r) => r.role, minWidth: 420 },
            ]}
          />
          <Box variant="small">
            Names and signatures read from Ray 2.59.0 source: the public{' '}
            <code>ray.serve.llm</code> exports and <code>build_openai_app</code>{' '}
            <Cite tier={1} href={`${RAY_INIT}#L149-L196`} kind="code">
              ray/serve/llm/__init__.py L149-L196
            </Cite>{' '}
            <Cite tier={1} href={`${RAY_INIT}#L397-L409`} kind="code">
              __init__.py L397-L409
            </Cite>
            , <code>LLMServingArgs</code>{' '}
            <Cite
              tier={1}
              href={`${RAY}/python/ray/llm/_internal/serve/core/ingress/builder.py#L146-L158`}
              kind="code"
            >
              builder.py L146-L158
            </Cite>
            , the <code>LLMConfig</code> fields{' '}
            <Cite tier={1} href={`${RAY_LLM_CONFIG}#L150-L228`} kind="code">
              llm_config.py L150-L228
            </Cite>
            , and the prefix router's load check and power-of-two fallback{' '}
            <Cite
              tier={1}
              href={`${RAY}/python/ray/llm/_internal/serve/routing_policies/prefix_aware/prefix_aware_router.py#L253-L258`}
              kind="code"
            >
              prefix_aware_router.py L253-L258
            </Cite>{' '}
            <Cite
              tier={1}
              href={`${RAY}/python/ray/llm/_internal/serve/routing_policies/prefix_aware/prefix_aware_router.py#L351-L356`}
              kind="code"
            >
              L351-L356
            </Cite>
            .
          </Box>
          <Alert type="warning">
            <strong>"Most," not "all," and against vLLM 0.27.0.</strong> The compatibility
            guide hedges deliberately: a flag that works under <code>vllm serve</code> is
            <em> very likely</em> to work as an <code>engine_kwarg</code>, but the two
            projects move fast and the surface is not guaranteed identical. Validate the
            specific flags your deployment depends on against the vLLM that Ray installs:{' '}
            <code>pip install "ray[llm]"</code> at Ray 2.59.0 pins{' '}
            <code>vllm[audio]==0.27.0</code>{' '}
            <Cite tier={1} href={`${RAY}/python/requirements/llm/llm-requirements.txt#L2`}>
              llm-requirements.txt L2
            </Cite>{' '}
            <Cite tier={1} href={`${RAY}/python/setup.py#L387`}>
              setup.py L387
            </Cite>
            , four minor releases behind the v0.31.0 this dive describes, so a flag or
            default that arrived after 0.27.0 is absent from that install. The other
            orchestrators lag too: Dynamo 1.5.1 pins vLLM 0.28.0{' '}
            <Cite tier={1} href="https://github.com/ai-dynamo/dynamo/blob/v1.5.1/pyproject.toml#L61-L64">
              dynamo pyproject.toml L61-L64
            </Cite>{' '}
            and llm-d 0.10.0 ships the v0.30.0 image{' '}
            <Cite tier={1} href="https://github.com/llm-d/llm-d/releases/tag/v0.10.0">
              llm-d v0.10.0 release notes
            </Cite>
            . None of the three pins v0.31.0.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the same app on Kubernetes as declarative RayCluster and RayService resources, with autoscaling and blue/green upgrades"
          >
            KubeRay: the Kubernetes-native way to run it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Ray Serve LLM is a Python framework, but you rarely run it bare in
            production. <strong>KubeRay</strong> is the operator that makes it
            Kubernetes-native: it "provides a Kubernetes-native way to run vLLM workloads on
            Ray clusters." You describe the cluster and the service as{' '}
            <strong>declarative CRDs</strong> (the docs reference <code>RayCluster</code> and{' '}
            <code>RayService</code>), then apply them like any other Kubernetes resource ("one
            command to create or update the whole cluster:{' '}
            <code>kubectl apply -f cluster.yaml</code>"){' '}
            <Cite tier={1} href={vllmDocsUrl('deployment/integrations/kuberay/')}>
              vLLM docs: KubeRay
            </Cite>
            .
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Declarative CRDs</Box>
              <Box variant="p">
                "Git-ops-friendly YAML CRDs (RayCluster/RayService)." The cluster and the
                served app are version-controlled config, not imperative scripts.
              </Box>
            </div>
            <div>
              <Box variant="h3">Autoscaling</Box>
              <Box variant="p">
                The operator "automatically patches CRDs for adjusting cluster size," so the
                Ray cluster grows and shrinks under load without hand-editing node counts.
              </Box>
            </div>
            <div>
              <Box variant="h3">Rolling upgrades</Box>
              <Box variant="p">
                "Blue/green deployment updates supported." A <code>RayService</code> can
                roll to a new version without dropping the live endpoint.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            All quotes from the{' '}
            <Cite tier={1} href={vllmDocsUrl('deployment/integrations/kuberay/')}>
              vLLM KubeRay integration page
            </Cite>
            .
          </Box>
          <Alert type="info">
            <strong>This is one of three Kubernetes paths in this deep dive.</strong>{' '}
            KubeRay keeps you inside the Ray ecosystem and is the natural choice when you
            are already using Ray Serve LLM. The operator-centric alternatives (the
            vLLM Production-Stack and router, <strong>Section 16</strong>, and llm-d /
            KServe / Gateway API, <strong>Section 17</strong>) trade Ray's Python-native
            model for closer alignment with Kubernetes-native and inference-gateway
            conventions. Pick KubeRay when the team is Python- and Ray-centric; reach for
            the operators when the org standard is a Kubernetes operator pattern.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        headerText="Evolving: prefill/decode disaggregation and Wide-EP (wide expert parallelism) for MoE (mixture-of-experts) models"
        headerActions={<Badge color="blue">moving target</Badge>}
      >
        <SpaceBetween size="s">
          <Alert type="warning">
            The patterns in this panel are <strong>recent and evolving</strong>. The case for
            them comes from <strong>Anyscale's blog (Tier 2)</strong>; the builder and class
            names are read from Ray 2.59.0 source. Verify both against your pinned Ray and
            vLLM versions before depending on them.
          </Alert>
          <Box variant="p">
            <strong>Why orchestration is getting harder.</strong> Anyscale's argument for
            putting these patterns in Ray Serve is that, in the sparse-MoE era, optimal serving
            couples engine replicas to each other. In their words:
            "Traditional Kubernetes primitives, designed for stateless microservices, are not
            optimized to express these tightly coupled, stateful serving patterns that
            require topology-aware placement and synchronized rank assignment." That
            coordination challenge is the case for a Ray-native orchestrator.
          </Box>
          <Box variant="p">
            <strong>Prefill/decode disaggregation, orchestrated by the decode server.</strong>{' '}
            This separates the compute-bound prefill phase from the memory-bound decode phase
            onto different deployments. <code>build_pd_openai_app</code>{' '}
            <Cite tier={1} href={`${RAY_INIT}#L254`} kind="code">
              __init__.py L254
            </Cite>{' '}
            wires a three-tier graph: ingress, then <code>PDDecodeServer</code>, then{' '}
            <code>PDPrefillServer</code>. The decode server owns a real engine and runs the
            request: it sends the prefill server a copy with <code>max_tokens=1</code> and{' '}
            <code>kv_transfer_params</code>, takes the <code>kv_transfer_params</code> that
            come back with the first prefill chunk, and decodes on its own engine{' '}
            <Cite tier={1} href={`${RAY_PD_SERVER}#L1-L4`} kind="code">
              pd_server.py L1-L4
            </Cite>{' '}
            <Cite tier={1} href={`${RAY_PD_SERVER}#L99-L106`} kind="code">
              pd_server.py L99-L106
            </Cite>{' '}
            <Cite tier={1} href={`${RAY_KV_BASE}#L213-L252`} kind="code">
              kv_transfer/base.py L213-L252
            </Cite>
            . The decode server plays the part of the proxy in{' '}
            <strong>Section 10, Disaggregated Prefill / Decode</strong>, whose NIXL (NVIDIA
            Inference Xfer Library) pull and push sequences show how the KV cache then moves
            between the two engines.
          </Box>
          <Box variant="p">
            <strong>Wide-EP for large MoE models.</strong> Expert parallelism distributes
            an MoE model's experts across GPUs alongside data-parallel attention
            (Section 9). Anyscale describes what "wide" adds: "Wide-EP adds expert load
            balancing, expert replication, and optimized communication kernels to further
            improve throughput and latency SLAs." The Ray Serve LLM piece for it is the
            data-parallel builder, <code>build_dp_openai_app</code> over{' '}
            <code>DPServer</code>{' '}
            <Cite tier={1} href={`${RAY_INIT}#L379`} kind="code">
              __init__.py L379
            </Cite>
            , which in Anyscale's account coordinates the engine replicas into one
            expert-parallel group and scales the ingress servers: orchestration that ordinary
            horizontal scaling cannot express.
          </Box>
          <Box variant="small">
            Anyscale quotes:{' '}
            <Cite
              tier={2}
              href="https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm"
            >
              "Ray Serve LLM on Anyscale: APIs for Wide-EP and Disaggregated Serving with
              vLLM" (Anyscale blog)
            </Cite>
            . Anyscale is the company behind Ray, so this is first-party commentary rather
            than reference documentation.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <ExpandableSection headerText="Cross-links: where the related layers live">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Section 9, Distributed Inference:</strong> the four parallelism
            axes and vLLM's two executors: multiprocessing by default, with{' '}
            <code>--nnodes</code> across nodes, and Ray when you or Ray Serve LLM select it.
            That is the runtime <em>beneath</em> Ray Serve LLM.
          </Box>
          <Box variant="p">
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer:</strong> the
            in-tree machinery (process groups, <code>parallel_state</code>, the{' '}
            <code>GroupCoordinator</code>, and the KV-transfer connectors), including how{' '}
            <code>distributed_executor_backend</code> resolves and the Ray executors that
            Ray Serve LLM's replicas run.
          </Box>
          <Box variant="p">
            <strong>Section 10, Disaggregated Prefill / Decode:</strong> the case for
            splitting prefill from decode and the NIXL pull and push transfers that the
            decode-orchestrated pattern above relies on.
          </Box>
          <Box variant="p">
            <strong>Sections 16 &amp; 17, the Kubernetes-operator alternatives:</strong>{' '}
            Production-Stack &amp; router (16) and llm-d / KServe / Gateway API (17) are
            the operator-centric counterparts to KubeRay for teams whose standard is a
            Kubernetes-native inference platform rather than a Ray-native one.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide on team and topology: when Ray Serve LLM pays for itself, and when a plain vllm serve or an operator fits better"
          >
            When to choose Ray Serve LLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Work backward from the team and the topology.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Reach for it when…</Box>
              <ul>
                <li>
                  You are a <strong>Python-native, multi-node team</strong> that wants
                  multi-node serving, autoscaling, and an OpenAI endpoint without
                  adopting a separate inference operator.
                </li>
                <li>
                  You already run <strong>Ray</strong> (data, training, batch) and want
                  serving in the same framework and cluster.
                </li>
                <li>
                  You need <strong>several models or many LoRA adapters</strong> behind
                  one endpoint, with per-model autoscaling and prefix-aware or KV-aware
                  replica selection.
                </li>
                <li>
                  You want to keep using <strong>vLLM's engine features</strong>{' '}
                  at the vLLM version Ray pins, since most engine_kwargs and the OpenAI API
                  carry straight over.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Look elsewhere when…</Box>
              <ul>
                <li>
                  A single <code>vllm serve</code> (multi-node with <code>--nnodes</code>,
                  or on the Ray executor, Section 9) already meets your needs, so the
                  orchestration layer is overhead you do not need.
                </li>
                <li>
                  You depend on a vLLM feature newer than <strong>0.27.0</strong>, the
                  version <code>ray[llm]</code> 2.59.0 pins, and do not want to run an
                  untested pairing.
                </li>
                <li>
                  Your org standardizes on a <strong>Kubernetes-operator</strong> and
                  inference-gateway model, where Production-Stack (Section 16) or llm-d /
                  KServe (Section 17) fit that mold better.
                </li>
                <li>
                  You want a fully managed endpoint and are willing to give up
                  framework control (SageMaker / Bedrock, Section 25).
                </li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
