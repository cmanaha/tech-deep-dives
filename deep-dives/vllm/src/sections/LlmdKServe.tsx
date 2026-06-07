import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface ComponentRow {
  component: string;
  layer: string;
  role: string;
}

const componentRows: ComponentRow[] = [
  {
    component: 'vLLM',
    layer: 'Engine',
    role: 'The inference engine inside each pod. PagedAttention, continuous batching, prefix caching, LoRA, disaggregated prefill/decode. Everything in sections 4-13 runs here unchanged.',
  },
  {
    component: 'llm-d',
    layer: 'Distributed-inference layer',
    role: 'Kubernetes-native orchestration above the engine: prefill/decode disaggregation, prefix-cache- and load-aware routing, tiered KV-cache offload, SLO-aware autoscaling. CNCF sandbox; runs vLLM (and SGLang) as the model server.',
  },
  {
    component: 'KServe',
    layer: 'Serving operator / control plane',
    role: 'The Kubernetes operator. Its LLMInferenceService CRD is the declarative spec for a model deployment; the operator reconciles it into the underlying Deployments, Services, and Gateway/InferencePool objects. Can drive llm-d under the hood.',
  },
  {
    component: 'Gateway API Inference Extension (GIE)',
    layer: 'Inference-aware routing',
    role: 'Extends a Gateway API gateway (Envoy) into an "inference gateway". Adds the InferencePool CRD and the Endpoint Picker so routing is metric-aware instead of round-robin. GA as of v1.5.0.',
  },
  {
    component: 'Endpoint Picker (EPP)',
    layer: 'Scheduler / scorer',
    role: 'The inference scheduler the gateway calls per request (via Envoy ext-proc). Scores candidate pods on KV-cache/prefix-hit, queue depth, session affinity, predicted latency, and LoRA-adapter residency, then returns the chosen endpoint.',
  },
  {
    component: 'Envoy / Envoy AI Gateway',
    layer: 'Data-plane proxy',
    role: 'The L7 proxy that actually forwards the request to the pod the EPP picked. Calls the EPP through Envoy External Processing (ext-proc) before forwarding.',
  },
];

function GatewayRoutingDiagram() {
  return (
    <svg
      viewBox="0 0 880 430"
      role="img"
      aria-labelledby="gie-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="gie-title">
        Inference-aware routing on Kubernetes: a Gateway API gateway (Envoy) calls the Endpoint
        Picker over ext-proc; the EPP scores vLLM pods on KV-cache/prefix-hit, queue depth,
        session affinity, predicted latency, and LoRA-adapter residency; KServe and llm-d
        reconcile the InferencePool of vLLM pods that the EPP scores over
      </title>
      <style>
        {`
          .box { stroke-width: 1.5; }
          .gw { fill: #0972d3; stroke: #065299; }
          .epp { fill: #8b5cf6; stroke: #6d28d9; }
          .op { fill: #2ea597; stroke: #1f7a70; }
          .pod { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.5; }
          .podhot { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .pt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .ps { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .lbl { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#gah); }
          .arrhot { stroke: #0972d3; stroke-width: 2.5; fill: none; marker-end: url(#gahb); }
          .arrep { stroke: #6d28d9; stroke-width: 2; stroke-dasharray: 5 4; fill: none; marker-end: url(#gahp); }
        `}
      </style>
      <defs>
        <marker id="gah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="gahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
        </marker>
        <marker id="gahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#6d28d9" />
        </marker>
      </defs>

      <text className="lbl" x={70} y={120}>Request</text>
      <text className="sub" x={70} y={138}>(OpenAI</text>
      <text className="sub" x={70} y={152}>API)</text>
      <path className="arr" d="M70,160 L70,196" />

      {/* Gateway / Envoy */}
      <rect className="box gw" x={20} y={200} width={170} height={92} rx={8} />
      <text className="tt" x={105} y={232}>Gateway (Envoy)</text>
      <text className="ts" x={105} y={252}>Gateway API + GIE</text>
      <text className="ts" x={105} y={270}>data-plane proxy</text>

      {/* EPP */}
      <rect className="box epp" x={20} y={40} width={170} height={100} rx={8} />
      <text className="tt" x={105} y={70}>Endpoint Picker</text>
      <text className="ts" x={105} y={90}>scores pods on</text>
      <text className="ts" x={105} y={106}>KV/prefix, queue,</text>
      <text className="ts" x={105} y={122}>affinity, latency, LoRA</text>

      {/* ext-proc call up + endpoint back down */}
      <path className="arrep" d="M86,200 L86,140" />
      <path className="arrep" d="M124,140 L124,200" />
      <text className="ps" x={105} y={176}>ext-proc</text>
      <text className="ps" x={150} y={176}>endpoint</text>

      {/* Operators reconcile */}
      <rect className="box op" x={250} y={30} width={210} height={120} rx={8} />
      <text className="tt" x={355} y={62}>KServe + llm-d</text>
      <text className="ts" x={355} y={84}>LLMInferenceService CRD</text>
      <text className="ts" x={355} y={102}>reconciles Deployments,</text>
      <text className="ts" x={355} y={118}>InferencePool, EPP,</text>
      <text className="ts" x={355} y={134}>autoscaling</text>
      <text className="sub" x={355} y={170}>control plane (declarative)</text>
      {/* dashed reconcile down to pool */}
      <path className="arr" d="M355,150 L355,205" strokeDasharray="5 4" />

      {/* InferencePool box around pods */}
      <rect x={250} y={210} width={600} height={188} rx={8} fill="#fbfbfd" stroke="#b6bec9" strokeWidth={1.5} strokeDasharray="4 3" />
      <text className="lbl" x={550} y={232}>InferencePool — vLLM pods (the engine: §4-13)</text>

      {/* gateway -> chosen pod (hot) */}
      <path className="arrhot" d="M190,250 C 240,250 250,300 296,300" />

      {/* pods */}
      <rect className="podhot" x={300} y={250} width={120} height={120} rx={6} />
      <text className="pt" x={360} y={278}>vLLM pod</text>
      <text className="ps" x={360} y={298}>prefix hit</text>
      <text className="ps" x={360} y={314}>low queue</text>
      <text className="ps" x={360} y={330}>adapter loaded</text>
      <text className="ps" x={360} y={356}>chosen</text>

      <rect className="pod" x={440} y={250} width={120} height={120} rx={6} />
      <text className="pt" x={500} y={278}>vLLM pod</text>
      <text className="ps" x={500} y={302}>cold KV</text>
      <text className="ps" x={500} y={318}>deep queue</text>

      <rect className="pod" x={580} y={250} width={120} height={120} rx={6} />
      <text className="pt" x={640} y={278}>vLLM pod</text>
      <text className="ps" x={640} y={302}>prefiller</text>
      <text className="ps" x={640} y={318}>(disagg §10)</text>

      <rect className="pod" x={720} y={250} width={110} height={120} rx={6} />
      <text className="pt" x={775} y={278}>vLLM pod</text>
      <text className="ps" x={775} y={302}>decoder</text>
      <text className="ps" x={775} y={318}>(disagg §10)</text>

      {/* metrics scrape arrows from pods up to EPP region */}
      <text className="ps" x={550} y={392}>EPP scrapes vLLM metrics from every pod</text>
    </svg>
  );
}

export function LlmdKServe() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="The enterprise Kubernetes-operator path: vLLM as the engine, llm-d/KServe as the operators, an inference-aware Gateway in front.">
            17. Kubernetes: llm-d, KServe &amp; Gateway API
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> A single vLLM replica is a process. Production is a
            fleet &mdash; dozens of replicas across nodes, some doing prefill and some decode
            (<strong>section 10</strong>), some holding a hot prefix cache, some with a given
            LoRA adapter already resident (<strong>section 13</strong>). A plain Kubernetes{' '}
            <code>Service</code> load-balances round-robin and is blind to all of that. It will
            send a request to a cold pod when a warm one is idle, scatter a multi-turn
            conversation across replicas (destroying its KV cache), and route to a pod that
            does not even have the requested adapter loaded.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> separate the three concerns. An <strong>engine</strong>{' '}
            (vLLM) runs the model. A pair of <strong>operators</strong> &mdash; KServe and llm-d
            &mdash; turn a declarative CRD into the underlying fleet and keep it reconciled. An{' '}
            <strong>inference-aware gateway</strong> (the Kubernetes Gateway API Inference
            Extension) routes each request to the <em>right</em> pod by scoring endpoints on
            KV-cache/prefix-hit, queue depth, session affinity, predicted latency, and LoRA
            residency. This is the enterprise-operator path; the lighter all-in-one alternative
            is the vLLM production-stack in <strong>section 16</strong>, and the AWS realization
            of this stack on managed Kubernetes is <strong>section 24 (vLLM on Amazon EKS)</strong>.
          </Box>
          <Alert type="info">
            Three projects, three layers, one request path. KServe is the{' '}
            <strong>serving operator</strong> (the <code>LLMInferenceService</code> CRD). llm-d
            is the <strong>distributed-inference layer</strong> that runs vLLM as the engine.
            The Gateway API Inference Extension is the <strong>routing layer</strong> that makes
            the load balancer aware of what each vLLM pod is actually doing.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Request path: Gateway &rarr; EPP &rarr; KServe/llm-d &rarr; vLLM pods</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The gateway (Envoy) does not pick the pod itself. On each request it calls the{' '}
            <strong>Endpoint Picker (EPP)</strong> over Envoy External Processing (ext-proc);
            the EPP scores the pods in the <code>InferencePool</code> using metrics it scrapes
            from every vLLM replica, returns one endpoint, and the gateway forwards there.
            KServe and llm-d sit on the <em>control plane</em> &mdash; they reconcile the CRD
            into the Deployments, the <code>InferencePool</code>, the EPP, and autoscaling. They
            are not in the per-request hot path.
          </Box>
          <GatewayRoutingDiagram />
          <Alert type="info">
            The dashed purple arrows are the per-request <code>ext-proc</code> round trip to the
            EPP; the solid blue arrow is the gateway forwarding to the pod the EPP chose. The
            teal box (KServe + llm-d) reconciles the dashed grey path &mdash; it shapes the
            fleet, it does not touch individual requests.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The components</Header>}>
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'component', header: 'Component', cell: (r: ComponentRow) => <strong>{r.component}</strong>, width: 220 },
              { id: 'layer', header: 'Layer', cell: (r: ComponentRow) => r.layer, width: 200 },
              { id: 'role', header: 'Role', cell: (r: ComponentRow) => r.role },
            ]}
            items={componentRows}
            sortingDisabled
            ariaLabels={{ tableLabel: 'Enterprise Kubernetes inference stack components' }}
          />
          <Box variant="small">
            Sources:{' '}
            <Link external href="https://github.com/llm-d/llm-d">
              llm-d (GitHub)
            </Link>
            ,{' '}
            <Link external href="https://github.com/kubernetes-sigs/gateway-api-inference-extension">
              Gateway API Inference Extension (GitHub)
            </Link>
            ,{' '}
            <Link external href="https://docs.vllm.ai/en/latest/deployment/integrations/kserve/">
              vLLM KServe integration
            </Link>
            . All accessed 2026-06-07.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">What the Endpoint Picker scores on</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The EPP is the brain. The Gateway API Inference Extension describes it as{' '}
            <em>
              &ldquo;an implementation of an Inference Scheduler with additional Routing, Flow,
              and Request Control layers to allow for sophisticated routing strategies&rdquo;
            </em>{' '}
            that is{' '}
            <em>&ldquo;kv-cache and request cost aware, avoiding evictions or queueing as load increases.&rdquo;</em>{' '}
            (
            <Link external href="https://github.com/kubernetes-sigs/gateway-api-inference-extension">
              GIE, GitHub, accessed 2026-06-07
            </Link>
            ) Concretely, the signals it composes are:
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">KV-cache / prefix-hit</Box>
              <Box variant="p">
                Prefer the pod whose KV cache already holds the request&apos;s prefix, so the
                shared prompt is not recomputed. This is exactly the automatic-prefix-cache win
                from <strong>section 6</strong>, lifted from one engine to the whole fleet.
                llm-d calls it <em>&ldquo;prefix-cache aware routing&rdquo;</em>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Queue depth</Box>
              <Box variant="p">
                Avoid pods with a deep waiting queue. The EPP exposes{' '}
                <code>inference_pool_average_queue_size</code> and{' '}
                <code>inference_pool_per_pod_queue_size</code>; a request sent to an idle pod
                gets a smaller TTFT than one queued behind a backlog.
              </Box>
            </div>
            <div>
              <Box variant="h3">Session affinity</Box>
              <Box variant="p">
                Pin a multi-turn conversation to the pod that already holds its KV cache.
                Without affinity, turn 2 lands on a cold pod and re-prefills the entire history
                &mdash; the single most expensive routing mistake for chat workloads.
              </Box>
            </div>
            <div>
              <Box variant="h3">Predicted latency</Box>
              <Box variant="p">
                Score endpoints on expected completion cost, not just current load &mdash; the
                &ldquo;request cost aware&rdquo; behaviour above. The goal is to honour TTFT/ITL
                SLOs, which is why llm-d ships <em>&ldquo;SLO-aware autoscaling&rdquo;</em> as a
                companion.
              </Box>
            </div>
            <div>
              <Box variant="h3">LoRA-adapter residency</Box>
              <Box variant="p">
                Route a request for adapter <code>X</code> to a pod that already has{' '}
                <code>X</code> loaded. The EPP reads this from the{' '}
                <code>vllm:lora_requests_info</code> metric &mdash; the same metric{' '}
                <strong>section 13</strong> covers for multi-adapter serving and{' '}
                <strong>section 20</strong> covers for observability.
              </Box>
            </div>
            <div>
              <Box variant="h3">KV-cache utilization</Box>
              <Box variant="p">
                Track per-pod cache pressure via{' '}
                <code>inference_pool_average_kv_cache_utilization</code> and steer away from
                pods near eviction. Routing toward a hot prefix is only a win if that pod is not
                about to evict it under memory pressure.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            The EPP source has <strong>moved</strong>. As of GIE v1.5.0 the inference scheduler
            lives in{' '}
            <Link external href="https://github.com/llm-d/llm-d-inference-scheduler">
              llm-d/llm-d-inference-scheduler
            </Link>
            , while the <code>InferencePool</code> API stays in the{' '}
            <Link external href="https://github.com/kubernetes-sigs/gateway-api-inference-extension">
              kubernetes-sigs
            </Link>{' '}
            repo. The two projects are co-developed; pin both versions together. (Accessed
            2026-06-07.)
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How disaggregation and prefix-cache routing compose here</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The two big engine-level optimizations from earlier sections do not disappear at the
            cluster layer &mdash; they become routing inputs. <strong>Disaggregated
            prefill/decode (section 10)</strong> turns one homogeneous pool into two: a prefiller
            pool that owns TTFT and a decoder pool that owns ITL. llm-d names this{' '}
            <em>&ldquo;prefill/decode disaggregation&rdquo;</em> and the EPP routes the prompt
            pass to a prefiller, then steers decode to a decoder, with the KV cache moving over
            the connector (<strong>section 10</strong>) between them.
          </Box>
          <Box variant="p">
            <strong>Prefix-cache-aware routing</strong> is the cluster-scale version of
            automatic prefix caching (<strong>section 6</strong>): instead of hoping a hot
            prefix is reused within one engine, the EPP actively sends the request to the pod
            that holds it. Combined with llm-d&apos;s <em>&ldquo;tiered offloading to CPU or
            disk&rdquo;</em> for KV cache (the LMCache pattern from <strong>section 7</strong>),
            a prefix that does not fit in HBM can still be a routing target.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Engine-level (sections 6, 7, 10)</Box>
              <Box variant="p">
                Prefix caching, KV offload, and disaggregation are <em>local</em> decisions
                inside one engine: reuse what is already in this pod&apos;s cache, spill to CPU,
                split this request&apos;s phases.
              </Box>
            </div>
            <div>
              <Box variant="h3">Cluster-level (this section)</Box>
              <Box variant="p">
                The EPP makes them <em>global</em>: which pod across the fleet should this
                request go to so that the local optimization fires. The engine wins are only
                realized if the router knows about them.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">vs production-stack (section 16): operator path vs all-in-one</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Both stacks solve the same problem &mdash; route inference traffic to vLLM replicas
            intelligently &mdash; at different weights. Pick by how much Kubernetes machinery you
            already run and how much CRD-driven control you need.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">llm-d / KServe + Gateway API</Box>
              <ul>
                <li>Enterprise operator path: CRDs (<code>LLMInferenceService</code>, <code>InferencePool</code>) reconciled by controllers</li>
                <li>Standard Gateway API gateway (Envoy) with the GA Inference Extension</li>
                <li>Pluggable, metric-aware EPP scoring; co-developed with vLLM</li>
                <li>Multi-vendor backing (Red Hat, Google, IBM, NVIDIA, CoreWeave); CNCF sandbox</li>
                <li>More moving parts &mdash; gateway, EPP, operator, pools &mdash; for full control</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">vLLM production-stack (section 16)</Box>
              <ul>
                <li>Lighter all-in-one: a router plus vLLM replicas, fewer CRDs</li>
                <li>Helm-installable reference deployment from the vLLM project</li>
                <li>Faster to stand up when you do not need the full Gateway API surface</li>
                <li>The starting point; graduate to llm-d/KServe when scale or governance demands it</li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Not mutually exclusive at the routing layer: the production-stack router and the
            llm-d EPP both consume the same vLLM Prometheus metrics (queue depth, KV-cache
            utilization, <code>vllm:lora_requests_info</code>). The difference is the
            operator/CRD surface around them, not the routing signals themselves.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Deep dives</Header>}>
        <SpaceBetween size="s">
          <ExpandableSection headerText="KServe's LLMInferenceService CRD — the declarative spec">
            <SpaceBetween size="s">
              <Box variant="p">
                vLLM&apos;s own docs describe two KServe paths: deployment{' '}
                <em>&ldquo;using KServe&apos;s Hugging Face serving runtime&rdquo;</em> for
                single-model serving, or{' '}
                <em>&ldquo;via LLMInferenceService that uses llm-d&rdquo;</em> for distributed
                serving &mdash; the page states vLLM{' '}
                <em>&ldquo;can be deployed with KServe on Kubernetes for highly scalable
                distributed model serving.&rdquo;</em> (
                <Link external href="https://docs.vllm.ai/en/latest/deployment/integrations/kserve/">
                  vLLM docs, accessed 2026-06-07
                </Link>
                )
              </Box>
              <Box variant="p">
                The production blog frames the CRD as exposing{' '}
                <em>
                  &ldquo;the standard Kubernetes API, allowing us to override the spec precisely
                  where needed&rdquo;
                </em>{' '}
                &mdash; the operator owns the boilerplate (Deployments, Services,
                InferencePool, autoscaling) while the <code>LLMInferenceService</code> and{' '}
                <code>LLMInferenceConfig</code> objects give granular overrides for specialized
                hardware. (
                <Link external href="https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm">
                  llm-d production blog
                </Link>
                , Tang et al., 2026 &mdash; <strong>Tier-2 vendor blog (Red Hat / Tesla authors)</strong>, accessed 2026-06-07.)
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="llm-d: what it is, who backs it, and what it claims">
            <SpaceBetween size="s">
              <Box variant="p">
                llm-d describes itself as{' '}
                <em>
                  &ldquo;a high-performance distributed inference serving stack optimized for
                  production deployments on Kubernetes&rdquo;
                </em>{' '}
                whose four core capabilities are{' '}
                <em>&ldquo;intelligent routing&rdquo;</em> (
                <em>&ldquo;prefix-cache and load-aware balancing&rdquo;</em>),{' '}
                <em>&ldquo;advanced KV-cache management&rdquo;</em> (
                <em>&ldquo;tiered offloading to CPU or disk&rdquo;</em>),{' '}
                <em>&ldquo;serving large models&rdquo;</em> via{' '}
                <em>&ldquo;prefill/decode disaggregation&rdquo;</em>, and{' '}
                <em>&ldquo;SLO-aware autoscaling.&rdquo;</em> (
                <Link external href="https://github.com/llm-d/llm-d">
                  llm-d, GitHub, accessed 2026-06-07
                </Link>
                )
              </Box>
              <Box variant="p">
                It is a <strong>CNCF sandbox project</strong>, per its own README{' '}
                <em>&ldquo;founded by Red Hat, Google Cloud, IBM Research, CoreWeave, and
                NVIDIA&rdquo;</em> with additional contributors including AMD, Cisco, Hugging
                Face, Intel, Lambda, and Mistral AI. Model servers (vLLM, SGLang){' '}
                <em>&ldquo;handle efficiently running large language models on accelerators&rdquo;</em>{' '}
                while llm-d provides{' '}
                <em>&ldquo;state-of-the-art orchestration and optimizations above model servers.&rdquo;</em>{' '}
                (
                <Link external href="https://github.com/llm-d/llm-d">
                  llm-d, GitHub, accessed 2026-06-07
                </Link>
                )
              </Box>
              <Alert type="warning">
                <strong>Project-claimed benchmark:</strong> the llm-d production blog reports{' '}
                <em>&ldquo;a 3x improvement in output tokens/s and a 2x reduction in time to
                first token (TTFT)&rdquo;</em> on Llama 3.1 70B across 4 AMD MI300X GPUs after
                enabling prefix-cache-aware routing. This is a vendor-authored, project-claimed
                figure on one model/hardware configuration &mdash; not an independent benchmark.
                Treat as directional. (
                <Link external href="https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm">
                  llm-d production blog, Tang et al.
                </Link>
                , Tier-2, accessed 2026-06-07.)
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Gateway API Inference Extension: status and the InferencePool model">
            <SpaceBetween size="s">
              <Box variant="p">
                The Gateway API Inference Extension is{' '}
                <em>
                  &ldquo;an official Kubernetes project that optimizes self-hosting Generative
                  Models on Kubernetes&rdquo;
                </em>
                , extending a Gateway API gateway through Envoy External Processing into an{' '}
                inference gateway. It is <strong>GA</strong>, with v1.5.0 the current release
                (April 2026). (
                <Link external href="https://github.com/kubernetes-sigs/gateway-api-inference-extension">
                  GIE, GitHub
                </Link>
                {' '}and{' '}
                <Link external href="https://gateway-api-inference-extension.sigs.k8s.io/">
                  GIE docs
                </Link>
                , accessed 2026-06-07.)
              </Box>
              <Box variant="p">
                The central CRD is the <code>InferencePool</code> &mdash; the set of model-server
                pods the EPP scores over. The gateway routes to the pool, the EPP picks the
                endpoint inside it. The docs cite{' '}
                <em>&ldquo;Prefix Cache status or LoRA Adapters availability&rdquo;</em> as
                examples of the model-server <em>&ldquo;Metrics and Capabilities&rdquo;</em> the
                scheduler consumes. (
                <Link external href="https://gateway-api-inference-extension.sigs.k8s.io/">
                  GIE docs, accessed 2026-06-07
                </Link>
                )
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="The AWS realization → section 24 (vLLM on Amazon EKS)">
            <Box variant="p">
              This entire stack &mdash; KServe/llm-d operators, an Envoy-based Gateway with the
              Inference Extension, the EPP, and <code>InferencePool</code>s of vLLM pods &mdash;
              is cloud-portable Kubernetes. <strong>Section 24 (vLLM on Amazon EKS)</strong> is
              the AWS realization: the same CRDs and gateway running on managed Kubernetes, with
              GPU/EFA-backed node groups (sections on EFA and NIXL) under the vLLM pods. Read
              this section for the <em>shape</em> of the operator path; read section 24 for the
              AWS-specific node, networking, and autoscaling wiring.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
