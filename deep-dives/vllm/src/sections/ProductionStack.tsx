import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

function DeploymentShapeDiagram() {
  return (
    <svg
      viewBox="0 0 860 470"
      role="img"
      aria-labelledby="prodstack-shape-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="prodstack-shape-title">
        A client sends OpenAI-compatible HTTP requests to a vLLM router, which routes each
        request to one of a fleet of vLLM engine replicas using session-, prefix-, or
        round-robin (KV-cache-aware) logic. Every replica exposes a /metrics endpoint scraped
        by Prometheus, which feeds Grafana LLM-serving dashboards. The router, replicas, and
        observability stack all live in one Kubernetes namespace installed by a single Helm
        chart.
      </title>
      <style>
        {`
          .ns { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .router { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .replica { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
          .obs { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .client { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.5; }
          .rt { fill: #ffffff; font: 600 15px sans-serif; text-anchor: middle; }
          .rs { fill: #eaf3fb; font: 11px sans-serif; text-anchor: middle; }
          .pt { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .ps { fill: #e6f4f1; font: 11px sans-serif; text-anchor: middle; }
          .ot { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .os { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .ct { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .cs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .nslbl { fill: #0972d3; font: 600 12px sans-serif; letter-spacing: 0.5px; }
          .elbl { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .cap { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#psah); }
          .scrape { stroke: #8b6c00; stroke-width: 2; fill: none; stroke-dasharray: 5 4; marker-end: url(#psahg); }
        `}
      </style>
      <defs>
        <marker id="psah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="psahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
        </marker>
      </defs>

      {/* Client (outside the namespace) */}
      <rect className="client" x={20} y={150} width={150} height={70} rx={8} />
      <text className="ct" x={95} y={180}>client</text>
      <text className="cs" x={95} y={200}>OpenAI-compatible</text>

      {/* client -> router arrow */}
      <path className="arr" d="M170,185 L230,185" />
      <text className="elbl" x={200} y={176}>HTTP</text>

      {/* Kubernetes namespace boundary */}
      <rect className="ns" x={230} y={40} width={610} height={400} rx={10} />
      <text className="nslbl" x={250} y={64}>Kubernetes namespace</text>

      {/* vLLM Router */}
      <rect className="router" x={290} y={90} width={250} height={84} rx={8} />
      <text className="rt" x={415} y={120}>vLLM Router</text>
      <text className="rs" x={415} y={142}>routing-logic: session | prefix |</text>
      <text className="rs" x={415} y={158}>round-robin (KV-cache-aware)</text>

      {/* router -> replicas arrows */}
      <path className="arr" d="M340,174 L320,224" />
      <path className="arr" d="M415,174 L415,224" />
      <path className="arr" d="M490,174 L510,224" />

      {/* vLLM engine replicas (fleet) */}
      <rect className="replica" x={260} y={228} width={120} height={78} rx={8} />
      <text className="pt" x={320} y={256}>vLLM</text>
      <text className="ps" x={320} y={274}>engine</text>
      <text className="ps" x={320} y={290}>replica</text>

      <rect className="replica" x={400} y={228} width={120} height={78} rx={8} />
      <text className="pt" x={460} y={256}>vLLM</text>
      <text className="ps" x={460} y={274}>engine</text>
      <text className="ps" x={460} y={290}>replica</text>

      <rect className="replica" x={540} y={228} width={120} height={78} rx={8} />
      <text className="pt" x={600} y={256}>vLLM</text>
      <text className="ps" x={600} y={274}>engine</text>
      <text className="ps" x={600} y={290}>replica</text>

      <text className="elbl" x={730} y={272}>... +N replicas</text>

      {/* replicas -> Prometheus (scrape) */}
      <path className="scrape" d="M320,306 L320,340 L470,340 L470,360" />
      <path className="scrape" d="M460,306 L470,335" />
      <path className="scrape" d="M600,306 L600,340 L490,340 L490,360" />
      <text className="elbl" x={470} y={332}>/metrics (Prometheus scrape)</text>

      {/* Prometheus */}
      <rect className="obs" x={370} y={362} width={150} height={64} rx={8} />
      <text className="ot" x={445} y={388}>Prometheus</text>
      <text className="os" x={445} y={408}>scrape + store</text>

      {/* Prometheus -> Grafana */}
      <path className="arr" d="M520,394 L580,394" />

      {/* Grafana */}
      <rect className="obs" x={580} y={362} width={160} height={64} rx={8} />
      <text className="ot" x={660} y={384}>Grafana</text>
      <text className="os" x={660} y={402}>LLM-serving</text>
      <text className="os" x={660} y={418}>dashboards</text>

      {/* one Helm chart caption */}
      <text className="cap" x={535} y={462}>all of the above: one Helm chart</text>
    </svg>
  );
}

export function ProductionStack() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The vLLM project's own reference Kubernetes deployment: serving replicas, a prefix- and session-aware router, and a bundled Prometheus + Grafana stack, all installed by one Helm chart."
          >
            16. Kubernetes: Production-Stack &amp; Router
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem it solves:</strong> A single vLLM process is a great engine and a
            terrible cluster. To run vLLM in production you need more than one replica behind a load
            balancer, a way to keep a user&apos;s conversation landing on the replica that already
            holds its KV (key/value) cache, autoscaling on the right signals, and dashboards that
            speak the language of LLM serving (time-to-first-token, queue depth, KV-cache
            utilization) rather than generic HTTP latency. Wiring that yourself (Deployments,
            a Service, an ingress, a routing layer, scrape configs, Grafana panels) is the
            undifferentiated heavy lifting that every team re-invents.
          </Box>
          <Box variant="p">
            <strong>What production-stack is:</strong> the vLLM project&apos;s answer to that, shipped
            as a Helm chart under the vLLM org. The repository describes itself as{' '}
            <em>&quot;vLLM&apos;s reference system for K8S-native cluster-wide deployment with
            community-driven performance optimization&quot;</em>, i.e. the{' '}
            <strong>official, batteries-included reference deployment</strong>, not a vendor distro
            and not an operator you have to learn (
            <Link external href="https://github.com/vllm-project/production-stack">
              GitHub: vllm-project/production-stack (project Tier-1 README), accessed 2026-06-07
            </Link>
            ). It bundles three things: a fleet of vLLM serving-engine replicas, a request router
            that maximizes KV-cache reuse, and a Prometheus + Grafana observability stack, one{' '}
            <code>helm install</code> away.
          </Box>
          <Box variant="p">
            <strong>Where it sits among the K8s options:</strong> this is the path for teams that want
            production-grade vLLM on Kubernetes <em>without</em> adopting a full operator. If you do
            want the operator model (CRDs, an inference scheduler, the Gateway API
            inference extension), that is the <strong>llm-d</strong> path covered in{' '}
            <strong>section 17 (Kubernetes: llm-d, KServe &amp; Gateway API)</strong>. production-stack
            is the lighter, Helm-chart-shaped on-ramp; llm-d is the heavier, more programmable one.
            They are alternatives, not layers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The shape of the deployment</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            One ingress point (the router) fronts a horizontally scaled fleet of vLLM pods, and a
            sidecar observability stack scrapes both. The router is what turns N independent engines
            into a coherent service: it picks <em>which</em> replica each request goes to, and that
            choice is the difference between every replica re-running the same prefill and the right
            replica answering from a warm cache.
          </Box>

          <DeploymentShapeDiagram />

          <Alert type="info">
            <strong>The router is the load-bearing component.</strong> A plain Kubernetes Service
            (kube-proxy / round-robin at L4) scatters a single user&apos;s turns across replicas, so
            each replica sees a cold prefix and your <strong>section 6 (Automatic Prefix Caching)</strong>{' '}
            hit rate collapses. production-stack&apos;s router exists precisely to keep related
            requests on the replica that already holds their KV blocks.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Part 1: The vLLM serving-engine replicas</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The bottom tier is just vLLM, the same OpenAI-compatible server from{' '}
            <strong>section 12</strong>, run as a Kubernetes Deployment and scaled to multiple pods.
            The Helm chart parameterizes the model, the engine arguments, GPU resource requests, and
            replica count through <code>values.yaml</code>; the <code>modelSpec</code> list lets one
            chart stand up several models, each as its own pod group. Every engine exposes vLLM&apos;s
            native Prometheus <code>/metrics</code> endpoint, which is what wires it into Part 3.
          </Box>
          <Box variant="p">
            Critically, these are stateful in one specific sense: each replica accumulates its own
            in-GPU KV cache as it serves. Two replicas serving the same model are <em>not</em>{' '}
            interchangeable at the cache level. Replica A may hold a conversation&apos;s history
            while replica B is cold for it. That asymmetry is exactly why the routing tier above them
            cannot be a dumb round-robin if you care about latency.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Part 2: The request router and why KV/prefix-aware routing pays</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The router is a lightweight reverse proxy in front of the fleet that selects a backend per
            request. Its job is to <strong>turn the fleet&apos;s per-replica cache asymmetry into an
            advantage</strong> instead of a liability. The README frames it as directing{' '}
            <em>&quot;requests to backends based on routing keys or session IDs to maximize KV cache
            reuse&quot;</em> (
            <Link external href="https://github.com/vllm-project/production-stack">
              GitHub: vllm-project/production-stack (project Tier-1 README), accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Box variant="p">
            <strong>The mechanism, concretely:</strong> a request&apos;s long prefix (a system
            prompt, a RAG document, a chat history) was turned into KV blocks on whichever
            replica first served it (<strong>section 6</strong>). If the router sends the{' '}
            <em>next</em> request that shares that prefix to the <em>same</em> replica, the engine
            finds those blocks already resident and skips the prefill for them: a cache hit. Higher
            hit rate &rarr; less recomputation &rarr; lower TTFT (time-to-first-token) and higher
            throughput. Route it to a <em>different</em> replica and you pay full prefill again on a
            cold cache. KV/prefix-aware routing is, in one sentence,{' '}
            <strong>section 6&apos;s caching made to work across a fleet rather than within a single
            process.</strong>
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Routing strategies, and when to reach for each</Header>}
            columnDefinitions={[
              { id: 'strategy', header: 'Strategy', cell: (i) => i.strategy },
              { id: 'when', header: 'When to use it', cell: (i) => i.when },
              { id: 'status', header: 'Status / source', cell: (i) => i.status },
            ]}
            items={[
              {
                strategy: 'Round-robin (--routing-logic roundrobin)',
                when: 'Stateless, prefix-light traffic where every request is roughly independent: high-cardinality one-shot prompts, batch scoring. No cache locality to exploit, so even spread is the right default.',
                status: 'Shipping (production-stack README)',
              },
              {
                strategy: 'Session-based (--routing-logic session, --session-key <header>)',
                when: 'Conversational / multi-turn traffic carrying a stable session or user ID in a header. Pins a session to one replica so its growing chat history stays a warm prefix turn after turn. The pragmatic 80% of KV-reuse wins with zero prompt inspection.',
                status: 'Shipping (production-stack README)',
              },
              {
                strategy: 'Prefix-aware',
                when: 'Traffic where the natural sharing key is the prompt content itself, not a session ID: many users hitting the same long system prompt or shared document. Routes by the request prefix so identical prefixes converge on one replica even without a session header.',
                status: 'WIP / under development (production-stack README)',
              },
              {
                strategy: 'KV-cache-aware (consistent hashing)',
                when: 'Same conversational goal as session-based but you want sticky routing keyed by session/user ID with graceful rebalancing as replicas scale. The new Rust router calls this its "key policy for maximizing performance."',
                status: 'Shipping in the separate Rust router (vllm-project/router, Dec 2025 blog)',
              },
              {
                strategy: 'Disaggregated prefill / decode',
                when: 'When prefill and decode run as separate pod groups (section 10). The router fans a request through a prefill worker then a decode worker, treating the two pools as distinct fleets. Use when you have split P/D to independently scale the compute-bound and memory-bound phases.',
                status: 'Native in the Rust router (Dec 2025 blog); on the production-stack roadmap',
              },
            ]}
          />

          <Alert type="warning">
            <strong>Two routers, same org: don&apos;t conflate them.</strong> The router{' '}
            <em>bundled in</em> production-stack today is the Python/Go <code>vllm_router</code>, whose
            shipping strategies are <code>roundrobin</code> and <code>session</code>, with prefix-aware
            marked work-in-progress (
            <Link external href="https://github.com/vllm-project/production-stack">
              production-stack README, accessed 2026-06-07
            </Link>
            ). Separately, in December 2025 the vLLM project introduced a brand-new{' '}
            <strong>Rust</strong> router as its own repository (<code>vllm-project/router</code>),{' '}
            <em>&quot;Built in Rust for minimal overhead&quot;</em> and adding consistent-hashing,
            power-of-two, random, and native prefill/decode disaggregation (
            <Link external href="https://vllm-project.github.io/2025/12/13/vllm-router-release.html">
              vLLM Blog: vLLM Router release (project Tier-1), accessed 2026-06-07
            </Link>
            ). The KV-cache-aware and disaggregation rows above describe that newer component, which
            production-stack is expected to converge on, not the Python router it ships with
            as of this writing.
          </Alert>

          <ExpandableSection headerText="The Rust router (Dec 2025): consistent hashing, P/D disaggregation, and project-claimed numbers">
            <SpaceBetween size="s">
              <Box variant="p">
                The Rust router is <em>&quot;derived from a fork of the SGLang model gateway, modified
                and simplified to work with vLLM,&quot;</em> and is positioned as a low-overhead load
                balancer between clients and a vLLM worker fleet. Its headline routing policy is{' '}
                <strong>Consistent Hashing</strong>, described as{' '}
                <em>&quot;the key policy for maximizing performance&hellip; it ensures that requests
                with the same routing key (e.g., a session ID or user ID) are &apos;sticky&apos; and
                consistently routed to the same worker replica, maximizing KV cache reuse.&quot;</em>{' '}
                The rationale is the same prefix-locality argument as above:{' '}
                <em>&quot;For conversational workloads, routing subsequent requests from the same user
                to the same worker that holds their KV cache is critical for minimizing latency.&quot;</em>{' '}
                It also provides <em>&quot;Native Support for Prefill/Decode Disaggregation,&quot;</em>{' '}
                managing prefill and decode worker groups separately (
                <Link external href="https://vllm-project.github.io/2025/12/13/vllm-router-release.html">
                  vLLM Blog: vLLM Router release (project Tier-1), accessed 2026-06-07
                </Link>
                ).
              </Box>
              <Box variant="p">
                <strong>Project-claimed benchmark figures</strong> (the blog&apos;s own numbers, from
                its own charts; treat as project-claimed, not independently reproduced here):
              </Box>
              <ul>
                <li>
                  <strong>Llama 3.1 8B, 8 prefill + 8 decode pods:</strong> the blog states vLLM Router
                  request/s throughput is <em>&quot;25% higher than llm-d and 100% higher than
                  K8s-native load balancer,&quot;</em> with TTFT <em>&quot;1200 ms faster than
                  llm-d.&quot;</em> [project-claimed]
                </li>
                <li>
                  <strong>DeepSeek V3, 1 prefill pod (TP8) + 1 decode pod (TP8):</strong> throughput{' '}
                  <em>&quot;100% higher than K8s-native load balancer&quot;</em> (and close to llm-d),
                  with TTFT <em>&quot;2000 ms faster than llm-d and K8s-native.&quot;</em>{' '}
                  [project-claimed]
                </li>
              </ul>
              <Box variant="p">
                Note the comparison baseline: these pit the router against <strong>llm-d</strong>{' '}
                (section 17) and a plain Kubernetes Service. The throughput delta over the K8s-native
                load balancer is the cleanest read of what KV-aware routing buys versus dumb L4
                round-robin; the llm-d delta is a routing-layer-vs-routing-layer comparison and is the
                kind of number to verify in your own environment before quoting.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Part 3: The bundled observability stack</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The chart can install <strong>Prometheus + Grafana</strong> alongside the engines, with
            scrape configuration and serving-oriented dashboards pre-wired. Because every vLLM replica
            already exports the engine&apos;s native metrics on <code>/metrics</code>, the
            observability tier is largely a matter of pointing Prometheus at the pods and dropping in
            dashboards that plot the metrics that actually matter for inference: not CPU and
            request count, but TTFT, inter-token latency, running vs waiting request counts, and
            KV-cache utilization.
          </Box>
          <Alert type="info">
            <strong>This is the on-ramp, not the whole story.</strong> The bundled Prometheus +
            Grafana gets you dashboards on day one. The full vocabulary of vLLM&apos;s metrics
            (what each gauge means, which ones predict saturation, how to alert and autoscale on them)
            is the subject of <strong>section 20 (Observability &amp; Benchmarking)</strong>.
            production-stack&apos;s contribution here is that the wiring is done for you, not that it
            invents new telemetry.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Why the bundle matters operationally</Box>
              <Box variant="p">
                The single biggest reason to keep cache-aware routing healthy is observable here: if
                your cache hit rate quietly drops after a deploy, TTFT climbs and throughput falls
                with no code change. With the router and dashboards co-deployed, you can correlate a
                routing-config change against the KV-utilization and TTFT panels directly,
                rather than discovering the regression as a vague latency complaint.
              </Box>
            </div>
            <div>
              <Box variant="h3">Autoscaling signal</Box>
              <Box variant="p">
                The metrics that feed the dashboards are the same ones you scale on. Queue depth
                (waiting requests) and KV-cache utilization are far better autoscaling signals for LLM
                serving than CPU; having Prometheus already scraping them is what makes
                custom-metric HPA (Horizontal Pod Autoscaler) practical. The deeper treatment of
                which signal to pick is in section 20.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Deployment: one Helm chart</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            All three parts install together. The README&apos;s quickstart adds the chart repo and
            runs a single <code>helm install</code> against a <code>values.yaml</code> that declares
            the model(s), engine arguments, replica count, the router&apos;s routing logic, and
            whether to deploy the observability stack. Scaling out is changing a replica count;
            switching routing behavior is changing <code>routing-logic</code>; turning on dashboards
            is a chart value. That is the entire pitch: the production concerns are{' '}
            <em>configuration</em>, not bespoke YAML you author and maintain (
            <Link external href="https://github.com/vllm-project/production-stack">
              production-stack README, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">production-stack vs. the llm-d path (section 17)</Header>}
            columnDefinitions={[
              { id: 'dim', header: 'Dimension', cell: (i) => i.dim },
              { id: 'ps', header: 'production-stack', cell: (i) => i.ps },
              { id: 'llmd', header: 'llm-d (section 17)', cell: (i) => i.llmd },
            ]}
            items={[
              {
                dim: 'Install model',
                ps: 'Helm chart with a declarative values.yaml, no controller to operate',
                llmd: 'Operator plus CRDs: a programmable control plane you run',
              },
              {
                dim: 'Mental model',
                ps: 'Batteries-included reference deployment',
                llmd: 'Composable, K8s-native inference platform on the Gateway API',
              },
              {
                dim: 'Routing',
                ps: 'Router with session / round-robin (prefix-aware WIP); Rust router converging in',
                llmd: 'Inference scheduler + Gateway API inference extension',
              },
              {
                dim: 'Best fit',
                ps: 'Teams that want production vLLM on K8s fast, without adopting an operator',
                llmd: 'Teams that want a programmable platform and are willing to run CRDs',
              },
            ]}
          />

          <Alert type="info">
            <strong>Choosing between them:</strong> start from the outcome. If the outcome is
            &quot;serve vLLM well on Kubernetes with the least operational surface,&quot;
            production-stack is the shorter path. If the outcome is &quot;build an inference platform
            we extend and program against the Gateway API,&quot; that is section 17&apos;s territory.
            Both ultimately drive the same vLLM engines and both want the same prefix-locality
            (section 6) and observability (section 20) properties. They differ in how much
            control plane you take on to get there.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
