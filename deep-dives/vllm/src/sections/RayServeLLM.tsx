import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

interface DivisionRow {
  concern: string;
  vllm: string;
  rayServe: string;
}

const divisionRows: DivisionRow[] = [
  {
    concern: 'Running the model on a GPU',
    vllm: 'The engine itself: PagedAttention, continuous batching, the scheduler, the CUDA/HIP kernels. One process group, one model.',
    rayServe: 'Nothing. It does not replace the engine; it embeds it. vLLM stays the thing that does inference.',
  },
  {
    concern: 'OpenAI-compatible HTTP API',
    vllm: 'vllm serve exposes /v1/chat/completions, /v1/completions, etc. for one engine on one endpoint.',
    rayServe: 'Re-exposes the same OpenAI surface in front of many engines, behind one route. "An OpenAI-compatible API that aligns with vLLM’s."',
  },
  {
    concern: 'Engine configuration',
    vllm: 'CLI flags / EngineArgs: --tensor-parallel-size, --max-model-len, quantization, and the rest.',
    rayServe: 'Passes them through. The same flags become engine_kwargs on an LLMConfig. "Most of the engine_kwargs that work with vllm serve work with Ray Serve LLM."',
  },
  {
    concern: 'Multi-node placement of one model',
    vllm: 'Uses Ray as its distributed executor backend when TP/PP spans nodes (Section 9). Ray is already underneath.',
    rayServe: 'Owns the cluster Ray runs on. It places the engine’s workers across nodes via placement groups and accelerator types.',
  },
  {
    concern: 'Running many models / replicas',
    vllm: 'Out of scope. One vllm serve = one model on one endpoint.',
    rayServe: 'Multiple LLMConfigs behind one OpenAI app; the client picks by model name. Multi-LoRA over shared base models too.',
  },
  {
    concern: 'Autoscaling',
    vllm: 'None. The engine serves whatever traffic it is given.',
    rayServe: 'Per-deployment autoscaling (min/max replicas) driven by load, plus load balancing across replicas.',
  },
  {
    concern: 'Fault tolerance & health',
    vllm: 'A crashed engine process is a crashed endpoint.',
    rayServe: 'Supervises replicas: health checks, restart-on-failure, monitoring. A dead replica is replaced, not a dead endpoint.',
  },
  {
    concern: 'Kubernetes-native operation',
    vllm: 'Provides a container image; deployment is your problem.',
    rayServe: 'Runs as a RayService via KubeRay, with declarative CRDs, autoscaling, blue/green upgrades (Sections 16-17).',
  },
];

interface BuilderRow {
  api: string;
  role: string;
}

const builderRows: BuilderRow[] = [
  {
    api: 'LLMConfig',
    role: 'Declares one model: model_loading_config (id + source), deployment_config (autoscaling min/max replicas), accelerator_type, and engine_kwargs (the vLLM flags). One LLMConfig per model you serve.',
  },
  {
    api: 'build_openai_app',
    role: 'The main entry point. Takes a list of LLMConfigs and returns a deployable Serve app that exposes the OpenAI-compatible API in front of them. This is the 90% path.',
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

export function RayServeLLM() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What Ray adds on top of the vLLM engine, and the clean line between the two: vLLM does inference, Ray Serve LLM does orchestration."
          >
            15. Orchestration: Ray &amp; Ray Serve LLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The division of labor is the whole point.</strong> vLLM is an{' '}
            <em>inference engine</em>: it makes one model run fast on a set of GPUs.
            It deliberately does not solve the operational problems that surround a
            production endpoint: deploying across many nodes, scaling replicas up
            and down with load, restarting a crashed worker, serving several models
            behind one URL. <strong>Ray Serve LLM is the orchestration layer that
            adds exactly those things</strong>, and it does so without reimplementing
            inference: it embeds vLLM as the engine and wraps it.
          </Box>
          <Box variant="p">
            That makes this the most common Python-native multi-node pairing. If your
            team already lives in Ray (or just wants multi-node serving, autoscaling,
            and an OpenAI endpoint without standing up a separate Kubernetes operator),
            Ray Serve LLM is the path that keeps everything in one Python framework.
            The OpenAI surface it exposes is deliberately the same one vLLM exposes:{' '}
            &ldquo;an OpenAI-compatible API that aligns with vLLM&rsquo;s OpenAI-compatible
            server,&rdquo; so the client code does not change when you move from a single{' '}
            <code>vllm serve</code> to an orchestrated fleet.{' '}
            <Link external href="https://docs.ray.io/en/latest/serve/llm/index.html">
              Ray Serve LLM overview (accessed 2026-06-07)
            </Link>{' '}
            &middot;{' '}
            <Link
              external
              href="https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html"
            >
              Ray Serve LLM vLLM compatibility (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            <strong>Two cross-links anchor this section.</strong> The reason Ray shows
            up at all underneath vLLM is the executor backend: when tensor/pipeline
            parallelism spans nodes, vLLM defaults to Ray to place and supervise its
            workers, and that mechanism is covered in{' '}
            <strong>Section 9, Distributed Inference</strong> and realized in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>{' '}
            (vLLM&rsquo;s Ray executor backend). This section is the layer{' '}
            <em>above</em> that: what Ray Serve adds once the engine can already run
            multi-node. The Kubernetes-operator alternatives (Production-Stack and
            llm-d / KServe) are <strong>Sections 16</strong> and{' '}
            <strong>17</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">What vLLM gives you vs what Ray Serve LLM adds</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Read this table as the contract between the two projects. Every row is a
            production concern; the engine owns the left column, the orchestrator owns
            the right. The orchestrator never reaches into the engine&rsquo;s job;
            it manages copies of it.
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
            Feature list (multi-node serving, autoscaling, fault tolerance/monitoring,
            multi-LoRA, OpenAI-compatible API) from the{' '}
            <Link external href="https://docs.ray.io/en/latest/serve/llm/index.html">
              Ray Serve LLM overview
            </Link>
            ; the engine_kwargs pass-through and API alignment from the{' '}
            <Link
              external
              href="https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html"
            >
              vLLM compatibility guide
            </Link>{' '}
            (both accessed 2026-06-07). The Ray-as-executor-backend row is from the{' '}
            <Link external href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/">
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>{' '}
            and Section 9.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The shape of a deployment: clients &rarr; router &rarr; engines</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            A Ray Serve LLM app has the same topology whether it serves one model or
            many: <strong>one OpenAI-compatible ingress</strong> that load-balances
            across <strong>a pool of LLM server replicas</strong>, each replica an
            embedded vLLM engine that may itself be tensor/pipeline-parallel across
            GPUs and nodes. The client speaks plain OpenAI; Ray decides which replica
            answers and on which node it runs.
          </Box>

          <Box textAlign="center">
            <svg
              viewBox="0 0 760 420"
              width="100%"
              style={{ maxWidth: 760, height: 'auto' }}
              role="img"
              aria-label="Clients send OpenAI-compatible requests to a Ray Serve LLM ingress/router, which load-balances across LLM server replicas spread over multiple nodes; each replica embeds a vLLM engine that may span GPUs via tensor or pipeline parallelism"
            >
              <style>
                {
                  '.rl-lbl{font:600 13px sans-serif;fill:#16191f}.rl-sub{font:400 11px sans-serif;fill:#414d5c}.rl-title{font:700 14px sans-serif;fill:#16191f}.rl-node{fill:none;stroke:#7d8998;stroke-width:1.5;stroke-dasharray:5 4}.rl-router{fill:#f2f8fd;stroke:#539fe5;stroke-width:1.5}.rl-rep{fill:#f2faf5;stroke:#1d8102;stroke-width:1.5}.rl-eng{fill:#fbf3ef;stroke:#bf4f1f;stroke-width:1.5}.rl-cli{fill:#f4f4f4;stroke:#7d8998;stroke-width:1.5}.rl-flow{stroke:#539fe5;stroke-width:2;fill:none}.rl-tag{font:700 11px sans-serif}'
                }
              </style>
              <defs>
                <marker id="rlArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#539fe5" />
                </marker>
              </defs>

              <text x="12" y="22" className="rl-title">
                One endpoint, many engines: Ray Serve LLM in front of vLLM
              </text>

              {/* Clients */}
              <rect x="20" y="44" width="150" height="64" rx="8" className="rl-cli" />
              <text x="95" y="70" textAnchor="middle" className="rl-lbl">
                Clients
              </text>
              <text x="95" y="88" textAnchor="middle" className="rl-sub">
                OpenAI client / cURL
              </text>
              <text x="95" y="102" textAnchor="middle" className="rl-sub">
                POST /v1/chat/completions
              </text>

              {/* Router / ingress */}
              <rect x="270" y="40" width="220" height="72" rx="8" className="rl-router" />
              <text x="380" y="66" textAnchor="middle" className="rl-lbl">
                Ray Serve LLM ingress
              </text>
              <text x="380" y="84" textAnchor="middle" className="rl-sub">
                OpenAI-compatible API + router
              </text>
              <text x="380" y="100" textAnchor="middle" className="rl-sub">
                routes by model name &middot; load-balances
              </text>

              <line x1="170" y1="76" x2="270" y2="76" className="rl-flow" markerEnd="url(#rlArrow)" />

              {/* Node A */}
              <rect x="20" y="150" width="350" height="170" rx="10" className="rl-node" />
              <text x="36" y="170" className="rl-lbl">
                Node A
              </text>

              <rect x="40" y="184" width="310" height="120" rx="8" className="rl-rep" />
              <text x="195" y="206" textAnchor="middle" className="rl-lbl">
                LLM server replica (model X)
              </text>
              <rect x="58" y="220" width="130" height="68" rx="6" className="rl-eng" />
              <text x="123" y="244" textAnchor="middle" className="rl-sub">
                vLLM engine
              </text>
              <text x="123" y="260" textAnchor="middle" className="rl-sub">
                GPU 0 (TP rank 0)
              </text>
              <text x="123" y="276" textAnchor="middle" className="rl-sub">
                PagedAttention
              </text>
              <rect x="202" y="220" width="130" height="68" rx="6" className="rl-eng" />
              <text x="267" y="244" textAnchor="middle" className="rl-sub">
                vLLM engine
              </text>
              <text x="267" y="260" textAnchor="middle" className="rl-sub">
                GPU 1 (TP rank 1)
              </text>
              <text x="267" y="276" textAnchor="middle" className="rl-sub">
                same model, TP=2
              </text>

              {/* Node B */}
              <rect x="410" y="150" width="330" height="170" rx="10" className="rl-node" />
              <text x="426" y="170" className="rl-lbl">
                Node B
              </text>

              <rect x="430" y="184" width="290" height="54" rx="8" className="rl-rep" />
              <text x="575" y="206" textAnchor="middle" className="rl-lbl">
                LLM server replica (model X) #2
              </text>
              <text x="575" y="224" textAnchor="middle" className="rl-sub">
                autoscaled copy &middot; load-balanced
              </text>

              <rect x="430" y="250" width="290" height="54" rx="8" className="rl-rep" />
              <text x="575" y="272" textAnchor="middle" className="rl-lbl">
                LLM server replica (model Y)
              </text>
              <text x="575" y="290" textAnchor="middle" className="rl-sub">
                different model, same endpoint
              </text>

              {/* router to replicas */}
              <line x1="340" y1="112" x2="195" y2="184" className="rl-flow" markerEnd="url(#rlArrow)" />
              <line x1="420" y1="112" x2="560" y2="184" className="rl-flow" markerEnd="url(#rlArrow)" />
              <line x1="430" y1="112" x2="560" y2="250" className="rl-flow" markerEnd="url(#rlArrow)" />

              <text x="380" y="346" textAnchor="middle" className="rl-sub">
                Ray Serve owns placement, autoscaling, health, and routing across nodes.
              </text>
              <text x="380" y="366" textAnchor="middle" className="rl-sub">
                vLLM owns what happens inside each engine box (Sections 5-9).
              </text>
              <text x="380" y="386" textAnchor="middle" className="rl-sub">
                A replica that itself spans nodes uses Ray as vLLM&rsquo;s executor backend (Section 9).
              </text>
            </svg>
          </Box>
          <Box variant="small" textAlign="center">
            Conceptual topology. The router / replica model and the OpenAI-compatible
            front door are described in the{' '}
            <Link external href="https://docs.ray.io/en/latest/serve/llm/index.html">
              Ray Serve LLM overview (accessed 2026-06-07)
            </Link>
            . Note: in recent Ray, the old <code>LLMRouter</code> class is deprecated in
            favor of an OpenAI ingress class. The diagram shows the role, not a specific
            class name.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Two hats Ray wears: executor backend vs orchestration layer</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            It is easy to conflate the two ways Ray touches vLLM. They sit at different
            altitudes and the distinction is worth pinning down before reaching for
            either.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Ray as vLLM&rsquo;s distributed runtime (below)</Box>
              <Box variant="p">
                This is the executor backend from Section 9. When a single model&rsquo;s
                tensor/pipeline parallelism spans more than one node, vLLM uses Ray to
                spawn and supervise the worker processes (one per GPU rank) across
                the cluster. The model is laid out as{' '}
                <code>world_size = TP &times; PP</code> ranks, and Ray places those ranks.
                You get this whether or not you ever use Ray Serve; it is how{' '}
                <code>vllm serve</code> goes multi-node in the first place.{' '}
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
                >
                  vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">Ray Serve LLM as the orchestration layer (above)</Box>
              <Box variant="p">
                This is the serving framework: it wraps each engine as a Serve
                deployment, gives the fleet an OpenAI endpoint, autoscales replicas,
                health-checks them, and balances load. It <em>uses</em> the runtime
                below to place a replica that itself spans nodes, then manages many such
                replicas. The mental model: the executor backend makes one model
                multi-node; Ray Serve LLM makes a whole <em>service</em> multi-node and
                elastic.{' '}
                <Link external href="https://docs.ray.io/en/latest/serve/llm/index.html">
                  Ray Serve LLM overview (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The API surface: it really is just vLLM flags</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The reason adoption is cheap for a vLLM shop is that the configuration is
            almost a one-to-one mapping. Your <code>vllm serve</code> flags become{' '}
            <code>engine_kwargs</code> on an <code>LLMConfig</code>, and the compatibility
            guide states the relationship plainly: &ldquo;Most of the{' '}
            <code>engine_kwargs</code> that work with <code>vllm serve</code> work with
            Ray Serve LLM.&rdquo; It also confirms you keep vLLM&rsquo;s latest features
            (multimodal, structured output, reasoning models) through the same path.{' '}
            <Link
              external
              href="https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html"
            >
              Ray Serve LLM vLLM compatibility (accessed 2026-06-07)
            </Link>
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
            Builder / config names and the &ldquo;most engine_kwargs pass through&rdquo;
            quote from the{' '}
            <Link
              external
              href="https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html"
            >
              vLLM compatibility guide
            </Link>{' '}
            and the{' '}
            <Link external href="https://docs.ray.io/en/latest/serve/llm/index.html">
              Ray Serve LLM overview
            </Link>{' '}
            (both accessed 2026-06-07). The exact import surface evolves between Ray
            releases (for example, <code>LLMRouter</code> is being superseded by an OpenAI
            ingress class), so confirm names against the docs for your pinned Ray
            version.
          </Box>
          <Alert type="warning">
            <strong>&ldquo;Most,&rdquo; not &ldquo;all.&rdquo;</strong> The compatibility
            guide hedges deliberately: a flag that works under <code>vllm serve</code> is
            <em> very likely</em> to work as an <code>engine_kwarg</code>, but the two
            projects move fast and the surface is not guaranteed identical. Treat the
            pass-through as the default expectation, not a contract: validate the
            specific flags your deployment depends on against your pinned versions.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">KubeRay: the Kubernetes-native way to run it</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Ray Serve LLM is a Python framework, but you rarely run it bare in
            production. <strong>KubeRay</strong> is the operator that makes it
            Kubernetes-native: per the vLLM docs, it &ldquo;provides a Kubernetes-native
            way to run vLLM workloads on Ray clusters.&rdquo; You describe the cluster
            and the service as <strong>declarative CRDs</strong> (the docs reference{' '}
            <code>RayCluster</code> and <code>RayService</code>), then apply them like any
            other Kubernetes resource (&ldquo;one command to create or update the whole
            cluster: <code>kubectl apply -f cluster.yaml</code>&rdquo;).{' '}
            <Link external href="https://docs.vllm.ai/en/latest/deployment/integrations/kuberay/">
              vLLM KubeRay integration (accessed 2026-06-07)
            </Link>
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Declarative CRDs</Box>
              <Box variant="p">
                &ldquo;Git-ops-friendly YAML CRDs (RayCluster/RayService).&rdquo; The
                cluster and the served app are version-controlled config, not imperative
                scripts.
              </Box>
            </div>
            <div>
              <Box variant="h3">Autoscaling</Box>
              <Box variant="p">
                The operator &ldquo;automatically patches CRDs for adjusting cluster
                size,&rdquo; so the Ray cluster grows and shrinks under load without
                hand-editing node counts.
              </Box>
            </div>
            <div>
              <Box variant="h3">Rolling upgrades</Box>
              <Box variant="p">
                &ldquo;Blue/green deployment updates supported.&rdquo; A{' '}
                <code>RayService</code> can roll to a new version without dropping the
                live endpoint.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            All quotes from the{' '}
            <Link external href="https://docs.vllm.ai/en/latest/deployment/integrations/kuberay/">
              vLLM KubeRay integration page (accessed 2026-06-07)
            </Link>
            .
          </Box>
          <Alert type="info">
            <strong>This is one of three Kubernetes paths in this deep dive.</strong>{' '}
            KubeRay keeps you inside the Ray ecosystem and is the natural choice when you
            are already using Ray Serve LLM. The operator-centric alternatives (the
            vLLM Production-Stack and router, <strong>Section 16</strong>, and llm-d /
            KServe / Gateway API, <strong>Section 17</strong>) trade Ray&rsquo;s
            Python-native model for closer alignment with Kubernetes-native and
            inference-gateway conventions. Pick KubeRay when the team is Python- and
            Ray-centric; reach for the operators when the org standard is a Kubernetes
            operator pattern.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">When to choose Ray Serve LLM</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Work backward from the team and the topology, not from the framework.
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
                  one endpoint, with per-model autoscaling.
                </li>
                <li>
                  You want to keep using <strong>vLLM&rsquo;s engine features</strong>{' '}
                  unchanged, since the engine_kwargs and OpenAI API carry straight over.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Look elsewhere when…</Box>
              <ul>
                <li>
                  A single <code>vllm serve</code> (optionally multi-node via the Ray
                  executor backend, Section 9) already meets your needs, so the
                  orchestration layer is overhead you do not need.
                </li>
                <li>
                  Your org standardizes on a <strong>Kubernetes-operator</strong> and
                  inference-gateway model, where Production-Stack (Section 16) or llm-d /
                  KServe (Section 17) fit that mold better.
                </li>
                <li>
                  You want a fully managed endpoint and are willing to give up
                  framework control (SageMaker / Bedrock, later sections).
                </li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        headerText="Evolving: disaggregated prefill/decode and Wide-EP for MoE"
        headerActions={<Badge color="blue">Tier-2 / moving target</Badge>}
      >
        <SpaceBetween size="s">
          <Alert type="warning">
            The features in this panel are <strong>recent and evolving</strong>, and the
            detail below is sourced primarily from <strong>Anyscale&rsquo;s blog
            (Tier-2)</strong> rather than first-party reference docs. Treat names and
            APIs as a moving target; verify against the docs for your pinned Ray and
            vLLM versions before depending on them.
          </Alert>
          <Box variant="p">
            <strong>Why orchestration is getting harder.</strong> Anyscale&rsquo;s
            argument for putting these patterns in Ray Serve is that, in the sparse-MoE
            era, engine replicas are no longer independent: optimal serving couples them.
            They frame it directly. [Tier-2: Anyscale] &ldquo;Traditional Kubernetes
            primitives, designed for stateless microservices, are not optimized to express
            these tightly coupled, stateful serving patterns that require topology-aware
            placement and synchronized rank assignment.&rdquo; That coordination problem
            is the case for a Ray-native orchestrator.
          </Box>
          <Box variant="p">
            <strong>Disaggregated prefill/decode via a PDProxyServer.</strong> This
            separates the compute-bound prefill phase from the memory-bound decode phase
            onto different deployments (the conceptual rationale is{' '}
            <strong>Section 10, Disaggregated Prefill / Decode</strong>). Ray Serve
            LLM orchestrates it with a proxy: [Tier-2: Anyscale] &ldquo;The PDProxyServer
            routes inputs to the prefill deployment with <code>max_tokens=1</code> to fill
            the KV cache. The KV cache metadata is then passed to the decode
            deployment.&rdquo; A corresponding <code>build_pd_openai_app</code>-style
            builder wires the two deployments behind one OpenAI endpoint.
          </Box>
          <Box variant="p">
            <strong>Wide-EP for large MoE models.</strong> Expert parallelism distributes
            an MoE model&rsquo;s experts across GPUs alongside data-parallel attention
            (Section 9). &ldquo;Wide-EP&rdquo; pushes that wide: [Tier-2: Anyscale]
            &ldquo;Wide-EP adds expert load balancing, expert replication, and optimized
            communication kernels to further improve throughput and latency SLAs.&rdquo;
            Ray Serve LLM&rsquo;s data-parallel + expert-parallel builder coordinates the
            engine replicas into one expert-parallel group and scales the ingress
            servers, which is the orchestration that ordinary horizontal scaling cannot
            express.
          </Box>
          <Box variant="small">
            Source: [Tier-2: Anyscale]{' '}
            <Link
              external
              href="https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm"
            >
              &ldquo;Ray Serve LLM on Anyscale: APIs for Wide-EP and Disaggregated Serving
              with vLLM&rdquo; (Anyscale blog, accessed 2026-06-07)
            </Link>
            . Anyscale is the company behind Ray, so this is first-party <em>commentary</em>{' '}
            but not first-party reference documentation, graded Tier-2. The conceptual
            mechanics of PD disaggregation and EP live in Sections 10 and 9 respectively.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <ExpandableSection headerText="Cross-links: where the related layers live">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Section 9, Distributed Inference:</strong> the four parallelism
            axes and why vLLM defaults to Ray as the executor backend for multi-node
            TP/PP. That is the runtime <em>beneath</em> Ray Serve LLM.
          </Box>
          <Box variant="p">
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer:</strong> the
            in-tree machinery (process groups, <code>parallel_state</code>, the{' '}
            <code>GroupCoordinator</code>, and the KV-transfer connectors), including
            vLLM&rsquo;s Ray executor backend, the concrete code Ray Serve LLM places and
            supervises.
          </Box>
          <Box variant="p">
            <strong>Section 10, Disaggregated Prefill / Decode:</strong> the
            conceptual case for splitting prefill from decode, which the evolving
            PDProxyServer pattern above orchestrates.
          </Box>
          <Box variant="p">
            <strong>Sections 16 &amp; 17, the Kubernetes-operator alternatives:</strong>{' '}
            Production-Stack &amp; router (16) and llm-d / KServe / Gateway API (17) are
            the operator-centric counterparts to KubeRay for teams whose standard is a
            Kubernetes-native inference platform rather than a Ray-native one.
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
