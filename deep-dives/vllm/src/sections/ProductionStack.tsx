import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

export function ProductionStack() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The vLLM project's own reference Kubernetes deployment — serving replicas, a prefix- and session-aware router, and a bundled Prometheus + Grafana stack, all installed by one Helm chart."
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
            utilization) rather than generic HTTP latency. Wiring that yourself &mdash; Deployments,
            a Service, an ingress, a routing layer, scrape configs, Grafana panels &mdash; is the
            undifferentiated heavy lifting that every team re-invents.
          </Box>
          <Box variant="p">
            <strong>What production-stack is:</strong> the vLLM project&apos;s answer to that, shipped
            as a Helm chart under the vLLM org. The repository describes itself as{' '}
            <em>&quot;vLLM&apos;s reference system for K8S-native cluster-wide deployment with
            community-driven performance optimization&quot;</em> &mdash; i.e. the{' '}
            <strong>official, batteries-included reference deployment</strong>, not a vendor distro
            and not an operator you have to learn (
            <Link external href="https://github.com/vllm-project/production-stack">
              GitHub: vllm-project/production-stack (project Tier-1 README), accessed 2026-06-07
            </Link>
            ). It bundles three things: a fleet of vLLM serving-engine replicas, a request router
            that maximizes KV-cache reuse, and a Prometheus + Grafana observability stack &mdash; one{' '}
            <code>helm install</code> away.
          </Box>
          <Box variant="p">
            <strong>Where it sits in the K8s landscape:</strong> this is the path for teams that want
            production-grade vLLM on Kubernetes <em>without</em> adopting a full operator. If you do
            want the operator model &mdash; CRDs, an inference scheduler, the Gateway API
            inference extension &mdash; that is the <strong>llm-d</strong> path covered in{' '}
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

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`
                         ┌──────────────────────────────────────────────┐
                         │            Kubernetes namespace               │
                         │                                               │
   client ─── HTTP ───▶  │   ┌───────────────────────────────────┐      │
   (OpenAI-compatible)   │   │          vLLM Router              │      │
                         │   │  routing-logic: session | prefix |│      │
                         │   │  round-robin  (KV-cache-aware)    │      │
                         │   └───────────────────────────────────┘      │
                         │        │            │            │           │
                         │        ▼            ▼            ▼           │
                         │   ┌────────┐   ┌────────┐   ┌────────┐       │
                         │   │ vLLM   │   │ vLLM   │   │ vLLM   │  ...   │
                         │   │ engine │   │ engine │   │ engine │       │
                         │   │ replica│   │ replica│   │ replica│       │
                         │   └───┬────┘   └───┬────┘   └───┬────┘       │
                         │       │            │            │           │
                         │       └──── /metrics (Prometheus scrape) ───┐│
                         │                                            ▼ │
                         │   ┌──────────────┐        ┌──────────────┐  │
                         │   │  Prometheus  │ ─────▶ │   Grafana    │  │
                         │   │  (scrape +   │        │ (LLM-serving │  │
                         │   │   store)     │        │  dashboards) │  │
                         │   └──────────────┘        └──────────────┘  │
                         └──────────────────────────────────────────────┘
                                   all of the above: one Helm chart
`}</pre>
          </Box>

          <Alert type="info">
            <strong>The router is the load-bearing component.</strong> A plain Kubernetes Service
            (kube-proxy / round-robin at L4) scatters a single user&apos;s turns across replicas, so
            each replica sees a cold prefix and your <strong>section 6 (Automatic Prefix Caching)</strong>{' '}
            hit rate collapses. production-stack&apos;s router exists precisely to keep related
            requests on the replica that already holds their KV blocks.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Part 1 &mdash; The vLLM serving-engine replicas</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The bottom tier is just vLLM &mdash; the same OpenAI-compatible server from{' '}
            <strong>section 12</strong>, run as a Kubernetes Deployment and scaled to multiple pods.
            The Helm chart parameterizes the model, the engine arguments, GPU resource requests, and
            replica count through <code>values.yaml</code>; the <code>modelSpec</code> list lets one
            chart stand up several models, each as its own pod group. Every engine exposes vLLM&apos;s
            native Prometheus <code>/metrics</code> endpoint, which is what wires it into Part 3.
          </Box>
          <Box variant="p">
            Critically, these are stateful in one specific sense: each replica accumulates its own
            in-GPU KV cache as it serves. Two replicas serving the same model are <em>not</em>{' '}
            interchangeable at the cache level &mdash; replica A may hold a conversation&apos;s history
            while replica B is cold for it. That asymmetry is exactly why the routing tier above them
            cannot be a dumb round-robin if you care about latency.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Part 2 &mdash; The request router and why KV/prefix-aware routing pays</Header>}>
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
            <strong>The mechanism, concretely:</strong> a request&apos;s long prefix &mdash; a system
            prompt, a RAG document, a chat history &mdash; was turned into KV blocks on whichever
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
            header={<Header variant="h3">Routing strategies &mdash; and when to reach for each</Header>}
            columnDefinitions={[
              { id: 'strategy', header: 'Strategy', cell: (i) => i.strategy },
              { id: 'when', header: 'When to use it', cell: (i) => i.when },
              { id: 'status', header: 'Status / source', cell: (i) => i.status },
            ]}
            items={[
              {
                strategy: 'Round-robin (--routing-logic roundrobin)',
                when: 'Stateless, prefix-light traffic where every request is roughly independent — high-cardinality one-shot prompts, batch scoring. No cache locality to exploit, so even spread is the right default.',
                status: 'Shipping (production-stack README)',
              },
              {
                strategy: 'Session-based (--routing-logic session, --session-key <header>)',
                when: 'Conversational / multi-turn traffic carrying a stable session or user ID in a header. Pins a session to one replica so its growing chat history stays a warm prefix turn after turn. The pragmatic 80% of KV-reuse wins with zero prompt inspection.',
                status: 'Shipping (production-stack README)',
              },
              {
                strategy: 'Prefix-aware',
                when: 'Traffic where the natural sharing key is the prompt content itself, not a session ID — many users hitting the same long system prompt or shared document. Routes by the request prefix so identical prefixes converge on one replica even without a session header.',
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
            <strong>Two routers, same org &mdash; don&apos;t conflate them.</strong> The router{' '}
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
            production-stack is expected to converge on &mdash; not the Python router it ships with
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
                its own charts &mdash; treat as project-claimed, not independently reproduced here):
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

      <Container header={<Header variant="h2">Part 3 &mdash; The bundled observability stack</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The chart can install <strong>Prometheus + Grafana</strong> alongside the engines, with
            scrape configuration and serving-oriented dashboards pre-wired. Because every vLLM replica
            already exports the engine&apos;s native metrics on <code>/metrics</code>, the
            observability tier is largely a matter of pointing Prometheus at the pods and dropping in
            dashboards that plot the metrics that actually matter for inference &mdash; not CPU and
            request count, but TTFT, inter-token latency, running vs waiting request counts, and
            KV-cache utilization.
          </Box>
          <Alert type="info">
            <strong>This is the on-ramp, not the whole story.</strong> The bundled Prometheus +
            Grafana gets you dashboards on day one. The full vocabulary of vLLM&apos;s metrics &mdash;
            what each gauge means, which ones predict saturation, how to alert and autoscale on them
            &mdash; is the subject of <strong>section 20 (Observability &amp; Benchmarking)</strong>.
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
                routing-config change against the KV-utilization and TTFT panels directly &mdash;
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
            is a chart value. That is the entire pitch &mdash; the production concerns are{' '}
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
                ps: 'Helm chart — declarative values.yaml, no controller to operate',
                llmd: 'Operator + CRDs — programmable control plane you run',
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
            (section 6) and observability (section 20) properties &mdash; they differ in how much
            control plane you take on to get there.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
