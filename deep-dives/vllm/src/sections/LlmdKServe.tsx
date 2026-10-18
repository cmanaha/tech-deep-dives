import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

/** llm-d at its newest stable release, v0.10.0 (2026-09-29). */
const LD = 'https://github.com/llm-d/llm-d/blob/v0.10.0';
const LD_RELEASE = 'https://github.com/llm-d/llm-d/releases/tag/v0.10.0';
/** llm-d Router (the repository older guides call llm-d-inference-scheduler), v1.0.0 (2026-10-16). */
const LR = 'https://github.com/llm-d/llm-d-router/blob/v1.0.0';
const LR_DISAGG = `${LR}/docs/disaggregation.md`;
const LR_ARCH = `${LR}/docs/architecture.md`;
const LR_PLUGINS = `${LR}/pkg/epp/framework/plugins`;
const LR_FACTORIES = `${LR_PLUGINS}/datalayer/extractor/metrics/factories.go`;
const LR_METRICS = `${LR}/pkg/epp/metrics/llm_d_router_metrics.go`;
/** Gateway API Inference Extension at v1.6.2 (2026-09-17). */
const GIE = 'https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.6.2';
const GIE_RELEASES = 'https://github.com/kubernetes-sigs/gateway-api-inference-extension/releases/tag';
/** KServe at v0.21.0 (commit d1482554, 2026-09-25). */
const KS = 'https://github.com/kserve/kserve/blob/v0.21.0';
const KS_TYPES = `${KS}/pkg/apis/serving/v1alpha2/llm_inference_service_types.go`;
const LLMD_BLOG = 'https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm';
const PS_STATS =
  'https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/stats/engine_stats.py';
const LOGGERS = 'vllm/v1/metrics/loggers.py';

interface ComponentRow {
  component: string;
  layer: string;
  role: string;
}

const componentRows: ComponentRow[] = [
  {
    component: 'vLLM',
    layer: 'Engine',
    role: 'The inference engine inside each pod: paged KV cache, continuous batching, prefix caching, LoRA, prefill/decode disaggregation. The engine features of sections 4-13 run here.',
  },
  {
    component: 'llm-d',
    layer: 'Distributed-inference layer',
    role: 'Kubernetes-native orchestration above the engine: prefix-cache- and load-aware routing, tiered KV-cache offload, prefill/decode disaggregation, wide expert parallelism, flow control and autoscaling driven by service-level objectives (SLOs). A CNCF (Cloud Native Computing Foundation) sandbox project. vLLM is its default engine; its release also lists SGLang and TensorRT-LLM images.',
  },
  {
    component: 'KServe',
    layer: 'Serving operator / control plane',
    role: 'The Kubernetes operator. Its LLMInferenceService resource (serving.kserve.io/v1alpha2) declares a model deployment; the controller reconciles it into the Deployments, Services, Gateway API routes, InferencePool and scheduler. Uses llm-d under the hood.',
  },
  {
    component: 'Gateway API Inference Extension (GIE)',
    layer: 'Inference-routing API',
    role: 'Turns a gateway that supports ext-proc and the Gateway API into an inference gateway. Defines the InferencePool resource (inference.networking.k8s.io/v1, GA since v1.0.0 in September 2025) and the Endpoint Picker protocol. Current release v1.6.2.',
  },
  {
    component: 'Endpoint Picker (EPP), in llm-d Router',
    layer: 'Scheduler / scorer',
    role: 'The routing engine the gateway calls per request over ext-proc: filters, then weighted scorers (prefix-cache hit, queue depth, session affinity, predicted latency, LoRA residency, KV-cache utilization and more), then a picker that returns one endpoint.',
  },
  {
    component: 'InferenceObjective, InferenceModelRewrite',
    layer: 'Request-management APIs',
    role: 'The objects a platform team writes beside the InferencePool. InferenceObjective sets the EPP\'s scheduling goals for requests (priority levels, performance targets); InferenceModelRewrite rewrites model names for A/B tests and canary rollouts. Both live in llm-d Router.',
  },
  {
    component: 'Envoy / Envoy AI Gateway',
    layer: 'Data-plane proxy',
    role: 'The HTTP proxy that forwards the request to the pod the EPP picked, after asking the EPP through ext-proc. In llm-d Router\'s standalone mode its Helm chart deploys the Envoy alongside the EPP.',
  },
];

function GatewayRoutingDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 456"
        role="img"
        aria-labelledby="llmd-routing-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="llmd-routing-title">
          Inference-aware routing on Kubernetes. A gateway (Envoy, in Gateway API mode or
          standalone) asks the Endpoint Picker in llm-d Router over ext-proc which pod should serve
          each request; the EPP's filters and weighted scorers rank the vLLM pods in the
          InferencePool on prefix-cache hits, queue depth, adapter residency and load. For
          aggregated serving the gateway forwards to the chosen pod. For prefill/decode
          disaggregation the EPP picks the decode pod first, the sidecar in that pod sends the
          prefill to a prefill pod, and the decoder reads the KV cache over NIXL. KServe and llm-d
          reconcile the fleet from an LLMInferenceService and stay out of the request path.
        </title>
        <style>
          {`
            .lrd-gw { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
            .lrd-epp { fill: #6f4cc4; stroke: #553a9e; stroke-width: 1.5; }
            .lrd-op { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
            .lrd-pod { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.5; }
            .lrd-hot { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
            .lrd-pd { fill: #ffffff; stroke: #037f0c; stroke-width: 1.5; }
            .lrd-side { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
            .lrd-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
            .lrd-sw { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
            .lrd-td { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .lrd-pt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
            .lrd-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
            .lrd-sl { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
            .lrd-se { fill: #414d5c; font: 11px sans-serif; text-anchor: end; }
            .lrd-lbl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
            .lrd-hd { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
            .lrd-chosen { fill: #0972d3; font: 600 11px sans-serif; text-anchor: middle; }
            .lrd-num { fill: #ffffff; font: 700 11px sans-serif; text-anchor: middle; }
            .lrd-a { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#lrd-ah); }
            .lrd-rec { stroke: #5f6b7a; stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; marker-end: url(#lrd-ah); }
            .lrd-fwd { stroke: #0972d3; stroke-width: 2.5; fill: none; marker-end: url(#lrd-ahb); }
            .lrd-ext { stroke: #6f4cc4; stroke-width: 2; stroke-dasharray: 5 4; fill: none; marker-end: url(#lrd-ahp); }
            .lrd-pdp { stroke: #037f0c; stroke-width: 2; fill: none; marker-end: url(#lrd-ahg); }
            .lrd-kv { stroke: #8b6c00; stroke-width: 2; stroke-dasharray: 6 3; fill: none; marker-end: url(#lrd-aha); }
          `}
        </style>
        <defs>
          <marker id="lrd-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="lrd-ahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
          <marker id="lrd-ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
          <marker id="lrd-ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#037f0c" />
          </marker>
          <marker id="lrd-aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect x={0} y={0} width={880} height={456} rx={8} fill="#ffffff" />

        {/* Endpoint Picker */}
        <rect className="lrd-epp" x={20} y={24} width={190} height={116} rx={8} />
        <text className="lrd-tw" x={115} y={50}>Endpoint Picker (EPP)</text>
        <text className="lrd-sw" x={115} y={70}>in llm-d Router</text>
        <text className="lrd-sw" x={115} y={92}>filters, weighted scorers,</text>
        <text className="lrd-sw" x={115} y={108}>then a picker</text>
        <text className="lrd-sw" x={115} y={124}>decode pod first for P/D</text>

        {/* ext-proc round trip */}
        <path className="lrd-ext" d="M92,202 L92,144" />
        <path className="lrd-ext" d="M138,142 L138,200" />
        <text className="lrd-se" x={84} y={176}>ext-proc</text>
        <text className="lrd-sl" x={146} y={176}>endpoint</text>

        {/* Gateway */}
        <rect className="lrd-gw" x={20} y={204} width={190} height={96} rx={8} />
        <text className="lrd-tw" x={115} y={234}>Gateway (Envoy)</text>
        <text className="lrd-sw" x={115} y={256}>Gateway API mode,</text>
        <text className="lrd-sw" x={115} y={274}>or standalone Envoy</text>

        {/* Client request */}
        <path className="lrd-a" d="M115,352 L115,304" />
        <text className="lrd-lbl" x={115} y={370}>Client request</text>
        <text className="lrd-s" x={115} y={386}>(OpenAI API)</text>

        {/* Control plane */}
        <rect className="lrd-op" x={240} y={24} width={250} height={116} rx={8} />
        <text className="lrd-td" x={365} y={50}>KServe + llm-d</text>
        <text className="lrd-s" x={365} y={72}>LLMInferenceService</text>
        <text className="lrd-s" x={365} y={90}>reconciles Deployments,</text>
        <text className="lrd-s" x={365} y={108}>InferencePool, EPP, routes</text>
        <text className="lrd-lbl" x={365} y={128}>control plane only</text>
        <path className="lrd-rec" d="M365,142 L365,192" />
        <text className="lrd-sl" x={374} y={172}>reconcile</text>

        {/* Legend */}
        <rect x={520} y={24} width={340} height={150} rx={6} fill="#ffffff" stroke="#d1d5db" strokeWidth={1} />
        <path className="lrd-ext" d="M536,44 L568,44" />
        <text className="lrd-sl" x={584} y={48}>ext-proc: gateway asks the EPP</text>
        <path className="lrd-fwd" d="M536,66 L568,66" />
        <text className="lrd-sl" x={584} y={70}>forward to the chosen pod</text>
        <path className="lrd-rec" d="M536,88 L568,88" />
        <text className="lrd-sl" x={584} y={92}>reconcile from the resource</text>
        <circle cx={552} cy={110} r={8} fill="#037f0c" />
        <text className="lrd-num" x={552} y={114}>1</text>
        <text className="lrd-sl" x={584} y={114}>EPP picks the decode pod first</text>
        <circle cx={552} cy={132} r={8} fill="#037f0c" />
        <text className="lrd-num" x={552} y={136}>2</text>
        <text className="lrd-sl" x={584} y={136}>sidecar sends the prefill</text>
        <circle cx={552} cy={154} r={8} fill="#8b6c00" />
        <text className="lrd-num" x={552} y={158}>3</text>
        <text className="lrd-sl" x={584} y={158}>decoder reads the KV over NIXL</text>

        {/* InferencePool */}
        <rect x={240} y={196} width={620} height={222} rx={8} fill="#fbfbfd" stroke="#b6bec9" strokeWidth={1.5} strokeDasharray="4 3" />
        <text className="lrd-hd" x={600} y={216}>InferencePool: vLLM pods (the engine of sections 4-13)</text>
        <text className="lrd-lbl" x={389} y={238}>aggregated: one pod, both phases</text>
        <text className="lrd-lbl" x={700} y={238}>P/D: decode pod picked first</text>
        <path d="M537,230 L537,372" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 4" fill="none" />

        {/* Aggregated pods */}
        <rect className="lrd-hot" x={252} y={250} width={126} height={112} rx={6} />
        <text className="lrd-pt" x={315} y={272}>vLLM pod</text>
        <text className="lrd-s" x={315} y={292}>prefix hit</text>
        <text className="lrd-s" x={315} y={308}>low queue</text>
        <text className="lrd-s" x={315} y={324}>adapter loaded</text>
        <text className="lrd-chosen" x={315} y={348}>chosen</text>

        <rect className="lrd-pod" x={398} y={250} width={126} height={112} rx={6} />
        <text className="lrd-pt" x={461} y={272}>vLLM pod</text>
        <text className="lrd-s" x={461} y={296}>cold KV</text>
        <text className="lrd-s" x={461} y={312}>deep queue</text>

        {/* P/D pods */}
        <rect className="lrd-pd" x={550} y={250} width={140} height={112} rx={6} />
        <text className="lrd-pt" x={620} y={272}>Decode pod</text>
        <text className="lrd-s" x={620} y={292}>vLLM: decode</text>
        <rect className="lrd-side" x={562} y={314} width={116} height={34} rx={4} />
        <text className="lrd-lbl" x={620} y={335}>sidecar</text>

        <rect className="lrd-pd" x={752} y={250} width={98} height={112} rx={6} />
        <text className="lrd-pt" x={801} y={272}>Prefill pod</text>
        <text className="lrd-s" x={801} y={292}>vLLM: prefill</text>

        {/* gateway -> chosen pod (aggregated) */}
        <path className="lrd-fwd" d="M210,232 C 232,232 230,300 248,300" />

        {/* step 1: gateway -> decode pod sidecar */}
        <path className="lrd-pdp" d="M210,292 L224,292 L224,388 L620,388 L620,352" />
        <circle cx={300} cy={404} r={8} fill="#037f0c" />
        <text className="lrd-num" x={300} y={408}>1</text>

        {/* step 2: sidecar -> prefill pod */}
        <path className="lrd-pdp" d="M678,331 L748,331" />
        <circle cx={721} cy={346} r={8} fill="#037f0c" />
        <text className="lrd-num" x={721} y={350}>2</text>

        {/* step 3: KV from prefill pod to decoder */}
        <path className="lrd-kv" d="M752,300 L694,300" />
        <circle cx={721} cy={285} r={8} fill="#8b6c00" />
        <text className="lrd-num" x={721} y={289}>3</text>

        <text className="lrd-s" x={550} y={440}>
          EPP reads vLLM /metrics from every pod, plus KV events (ZeroMQ) for precise prefix scoring
        </text>
      </svg>
    </div>
  );
}

export function LlmdKServe() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Send each request to the vLLM pod that already holds its prefix, its adapter and spare capacity, and declare the whole fleet as one Kubernetes resource (verified against vLLM v0.31.0, commit db9527a4, with llm-d v0.10.0, llm-d Router v1.0.0, Gateway API Inference Extension v1.6.2 and KServe v0.21.0, 2026-10-16)"
          >
            17. Kubernetes: llm-d, KServe &amp; Gateway API
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A single vLLM replica is one process. Production is a fleet: dozens of replicas
            across nodes, some doing prefill and some decode (<strong>section 10</strong>), some
            holding a hot prefix cache (<strong>section 6</strong>), some with a given LoRA
            (Low-Rank Adaptation) adapter already resident (<strong>section 13</strong>). A plain
            Kubernetes <code>Service</code> balances load without seeing any of that. It will send
            a request to a cold pod while a warm one idles, scatter a multi-turn conversation
            across replicas so each turn rebuilds its KV (key-value) cache, and route to a pod that
            does not have the requested adapter loaded.
          </Box>
          <Box variant="p">
            Three layers meet that challenge. An <strong>engine</strong> (vLLM) runs the model in
            each pod. <strong>Operators</strong> (KServe and llm-d) turn a declarative custom
            resource into the fleet and keep it reconciled. An <strong>inference-aware
            router</strong> picks the pod for every request: the Endpoint Picker (EPP), which lives
            in llm-d Router and sits behind a Gateway API gateway or a standalone Envoy, scores
            each pod on prefix-cache hits, queue depth, session affinity, predicted latency and
            LoRA residency. The Gateway API Inference Extension (GIE) supplies the{' '}
            <code>InferencePool</code> resource that ties the gateway to the pods. This is the
            enterprise-operator path; the lighter all-in-one alternative is the vLLM
            production-stack in <strong>section 16</strong>, and <strong>section 24 (vLLM on Amazon
            EKS)</strong> runs this stack on AWS.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Who decides where a request lands, who only forwards it, and which components never see a request at all"
          >
            Request path: gateway, EPP, then the pod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The EPP chooses the pod and the gateway forwards. On each request Envoy calls the EPP
            over Envoy External Processing (ext-proc){' '}
            <Cite tier={1} href={`${LR}/README.md#L17`}>
              llm-d Router README L17
            </Cite>
            ; the EPP ranks the pods in the <code>InferencePool</code> using metrics it scrapes from
            every vLLM replica, returns one endpoint, and the gateway forwards there. KServe and
            llm-d sit on the <em>control plane</em>: they reconcile the custom resource into the
            Deployments, the <code>InferencePool</code>, the EPP and autoscaling, and stay out of
            the per-request path. One llm-d component does sit in that path: with prefill/decode
            (P/D) disaggregation, a sidecar in the decode pod receives the request and calls the
            prefill pod itself{' '}
            <Cite tier={1} href={`${LR}/README.md#L31`}>
              llm-d Router README L31
            </Cite>{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L84-L91`}>
              disaggregation.md L84-L91
            </Cite>
            .
          </Box>
          <Box variant="p">
            The gateway comes in two shapes. In <strong>Gateway mode</strong>, which llm-d
            recommends for production, the EPP backs an <code>InferencePool</code> referenced by an{' '}
            <code>HTTPRoute</code> on a shared <code>Gateway</code>, and Istio, AgentGateway or
            Google Cloud's Application Load Balancer can be that gateway. In{' '}
            <strong>standalone mode</strong> llm-d Router's Helm chart runs Envoy inside the EPP pod
            (the default, suited to testing) or as its own scalable Deployment, with no Gateway API
            objects{' '}
            <Cite tier={1} href={`${LR}/README.md#L15`}>
              llm-d Router README L15
            </Cite>{' '}
            <Cite tier={1} href={`${LR}/README.md#L37-L46`}>
              README L37-L46
            </Cite>
            .
          </Box>
          <GatewayRoutingDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The left pair of pods is aggregated serving, where one pod
            runs both phases. The right pair is disaggregated serving: the gateway forwards to the
            sidecar of the decode pod the EPP chose, that sidecar drives the prefill, and the
            decoder reads the KV cache over NIXL (NVIDIA Inference Xfer Library).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Seven pieces, each owning one decision: what runs the model, what declares the fleet, and what picks the pod"
          >
            The components
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
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
            <Cite tier={1} href={`${LD}/README.md#L18-L30`}>
              llm-d README L18-L30
            </Cite>
            ,{' '}
            <Cite tier={1} href={LD_RELEASE}>
              llm-d v0.10.0 release notes (engine images)
            </Cite>
            ,{' '}
            <Cite tier={1} href={`${LR}/README.md#L13-L31`}>
              llm-d Router README L13-L31
            </Cite>
            ,{' '}
            <Cite tier={1} href={`${GIE}/README.md#L8-L23`}>
              GIE README L8-L23
            </Cite>
            ,{' '}
            <Cite tier={1} href={`${GIE_RELEASES}/v1.0.0`}>
              GIE v1.0.0 release notes (InferencePool v1)
            </Cite>
            ,{' '}
            <Cite tier={1} href={`${KS_TYPES}#L85-L127`} kind="code">
              KServe llm_inference_service_types.go L85-L127
            </Cite>
            ,{' '}
            <Cite tier={1} href={vllmDocsUrl('deployment/integrations/kserve/')}>
              vLLM docs: KServe
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The signals that decide which pod gets a request, and the metric each one reads, so Prometheus can tell you why traffic went where it did"
          >
            What the Endpoint Picker scores on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            llm-d Router calls the EPP the "brain" of the router: it "evaluates incoming requests
            against the current state of the InferencePool, considering factors like KV-cache
            locality, current load, and priority"{' '}
            <Cite tier={1} href={`${LR}/README.md#L27`}>
              llm-d Router README L27
            </Cite>
            . The goal is a scheduler that is "kv-cache and request cost aware, avoiding evictions
            or queueing as load increases"{' '}
            <Cite tier={1} href={`${GIE}/README.md#L79`}>
              GIE README L79
            </Cite>
            . Mechanically, each scheduling profile runs filters that drop ineligible pods, then
            scorers whose results are summed by weight (1.0 unless configured), then a picker (by default, the
            highest score){' '}
            <Cite tier={1} href={`${LR}/pkg/epp/scheduling/scheduler_profile.go#L134-L146`} kind="code">
              scheduler_profile.go L134-L146
            </Cite>{' '}
            <Cite tier={1} href={`${LR}/pkg/epp/scheduling/scheduler_profile.go#L243-L258`} kind="code">
              L243-L258
            </Cite>{' '}
            <Cite tier={1} href={`${LR_ARCH}#L247-L258`}>
              architecture.md L247-L258
            </Cite>
            . The core signals:
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">KV-cache / prefix-hit</Box>
              <Box variant="p">
                Prefer the pod whose KV cache already holds the request&apos;s prefix, so the
                shared prompt is not recomputed. This is the automatic-prefix-cache win from{' '}
                <strong>section 6</strong>, lifted from one engine to the whole fleet. llm-d calls
                it "prefix-cache-aware routing"{' '}
                <Cite tier={1} href={`${LD}/README.md#L38`}>
                  llm-d README L38
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Queue depth</Box>
              <Box variant="p">
                Avoid pods with a deep waiting queue. The EPP reads{' '}
                <code>vllm:num_requests_waiting</code> per pod and exports the pool view as{' '}
                <code>llm_d_epp_average_queue_size</code> and{' '}
                <code>llm_d_epp_std_dev_queue_size</code>{' '}
                <Cite tier={1} href={`${LR_FACTORIES}#L94-L101`} kind="code">
                  factories.go L94-L101
                </Cite>{' '}
                <Cite tier={1} href={`${LR_METRICS}#L190-L224`} kind="code">
                  llm_d_router_metrics.go L190-L224
                </Cite>
                . A request sent to an idle pod gets a smaller TTFT (time to first token) than one
                queued behind a backlog.
              </Box>
            </div>
            <div>
              <Box variant="h3">Session affinity</Box>
              <Box variant="p">
                Pin a multi-turn conversation to the pod that already holds its KV cache. Without
                affinity, turn 2 lands on a cold pod and re-prefills the entire history, an
                expensive routing mistake for chat workloads.
              </Box>
            </div>
            <div>
              <Box variant="h3">Predicted latency</Box>
              <Box variant="p">
                Score endpoints on expected completion cost as well as current load: the "request
                cost aware" behaviour above. The aim is to hold TTFT and ITL (inter-token latency)
                targets, which is why llm-d pairs routing with "proactive, SLO-aware autoscaling"{' '}
                <Cite tier={1} href={`${LD}/README.md#L29`}>
                  llm-d README L29
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">LoRA-adapter residency</Box>
              <Box variant="p">
                Route a request for adapter <code>X</code> to a pod that already has <code>X</code>{' '}
                loaded. The EPP reads this from <code>vllm:lora_requests_info</code>{' '}
                <Cite tier={1} href={`${LR_FACTORIES}#L100`} kind="code">
                  factories.go L100
                </Cite>
                , which vLLM emits{' '}
                <Cite tier={1} href={vllmUrl(LOGGERS, 'L993')} kind="code">
                  loggers.py L993
                </Cite>
                ; <strong>section 13</strong> covers it for multi-adapter serving and{' '}
                <strong>section 20</strong> for observability.
              </Box>
            </div>
            <div>
              <Box variant="h3">KV-cache utilization</Box>
              <Box variant="p">
                Read each pod&apos;s <code>vllm:kv_cache_usage_perc</code>{' '}
                <Cite tier={1} href={`${LR_FACTORIES}#L99`} kind="code">
                  factories.go L99
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(LOGGERS, 'L577')} kind="code">
                  loggers.py L577
                </Cite>{' '}
                and steer away from pods near eviction; the pool view is{' '}
                <code>llm_d_epp_average_kv_cache_utilization</code> and{' '}
                <code>llm_d_epp_std_dev_kv_cache_utilization</code>{' '}
                <Cite tier={1} href={`${LR_METRICS}#L181-L215`} kind="code">
                  llm_d_router_metrics.go L181-L215
                </Cite>
                . Routing toward a hot prefix only pays if that pod is not about to evict it.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Prefix scoring is approximate by default.</strong> The default producer
            records which pods it sent each prefix to, so it tracks routing history rather than
            cache contents{' '}
            <Cite tier={1} href={`${LR_PLUGINS}/requestcontrol/dataproducer/approximateprefix/README.md#L7`}>
              approximateprefix README L7
            </Cite>{' '}
            <Cite tier={1} href={`${LR_ARCH}#L276-L278`}>
              architecture.md L276-L278
            </Cite>
            . The precise producer indexes the blocks each pod reports in its KV-cache events over
            ZeroMQ{' '}
            <Cite tier={1} href={`${LR_PLUGINS}/requestcontrol/dataproducer/preciseprefixcache/README.md#L1-L24`}>
              preciseprefixcache README L1-L24
            </Cite>
            , which vLLM publishes only when <code>--kv-events-config</code> enables them{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_events.py', 'L11-L52')} kind="code">
              config/kv_events.py L11-L52
            </Cite>
            .
          </Box>
          <Box variant="p">
            Past these six, llm-d Router v1.0.0 ships context-length, token-load, running-request
            and header-label scorers among others, and a multimodal scorer that prefers pods likely
            to hold the request&apos;s image or audio encodings{' '}
            <Cite tier={1} href="https://github.com/llm-d/llm-d-router/tree/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer">
              scorer/ directory
            </Cite>{' '}
            <Cite tier={1} href={`${LR_PLUGINS}/scheduling/scorer/mmcacheaffinity/README.md#L1-L26`}>
              mmcacheaffinity README
            </Cite>
            . Each is a plugin listed with a weight in the EPP&apos;s{' '}
            <code>EndpointPickerConfig</code>{' '}
            <Cite tier={1} href={`${LR_ARCH}#L205-L237`}>
              architecture.md L205-L237
            </Cite>
            .
          </Box>
          <Alert type="info" header="Where the EPP code lives">
            GIE releases up to v1.5.0 carry the EPP{' '}
            <Cite tier={1} href="https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.5.0/README.md#L31">
              GIE v1.5.0 README L31
            </Cite>
            . From v1.6.0 the EPP and the <code>InferenceObjective</code> and{' '}
            <code>InferenceModelRewrite</code> APIs live in <code>llm-d/llm-d-router</code>, which
            older guides call the inference scheduler (<code>llm-d-inference-scheduler</code>), and
            GIE keeps the <code>InferencePool</code> API, the EPP protocol, a lightweight EPP and
            the conformance tests{' '}
            <Cite tier={1} href={`${GIE}/README.md#L16-L23`}>
              GIE README L16-L23
            </Cite>{' '}
            <Cite tier={1} href={`${LR}/README.md#L10-L13`}>
              llm-d Router README L10-L13
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The engine optimizations of sections 6, 7 and 10 become routing inputs: what the EPP decides, what the decode-pod sidecar does, and where the KV moves"
          >
            How disaggregation and prefix-cache routing compose here
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The engine-level optimizations from earlier sections become routing inputs at the
            cluster layer. <strong>Disaggregated prefill/decode (section 10)</strong> turns one
            pool into two: prefill pods that own TTFT and decode pods that own ITL. In llm-d the
            EPP schedules the decode stage first and picks a decode pod; a decider then weighs the
            prompt length and the prefix-cache hit on that pod, and only when a separate prefill
            pays does the EPP pick a prefill pod and pass it in the{' '}
            <code>x-llm-d-prefiller-host-port</code> header{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L19`}>
              disaggregation.md L19
            </Cite>{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L84-L91`}>
              L84-L91
            </Cite>
            . The request lands on the decode pod&apos;s sidecar, which sends the prompt to the
            prefill pod with <code>max_tokens=1</code>, then hands the request to the local vLLM,
            which reads the KV cache from the prefiller and decodes{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L128-L148`}>
              disaggregation.md L128-L148
            </Cite>
            . Without the header the decode pod runs both phases itself.
          </Box>
          <Box variant="p">
            The KV moves through vLLM&apos;s own connectors: the sidecar&apos;s default{' '}
            <code>--kv-connector nixlv2</code> corresponds to vLLM&apos;s{' '}
            <code>NixlConnector</code>{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L604-L618`}>
              disaggregation.md L604-L618
            </Cite>
            , whose pull and push modes are in <strong>section 10 (Disaggregated Prefill /
            Decode)</strong>. For the prefill pick, a topology-affinity scorer can prefer
            candidates that share a host, rack, zone or region with the chosen decode pod, with
            scores shaped by the KV-transfer bandwidth at each level{' '}
            <Cite tier={1} href={`${LR_PLUGINS}/scheduling/scorer/topologyaffinity/README.md#L7-L29`}>
              topologyaffinity README L7-L29
            </Cite>{' '}
            <Cite tier={1} href={`${LR_PLUGINS}/scheduling/scorer/topologyaffinity/scorer.go#L37-L48`} kind="code">
              scorer.go L37-L48
            </Cite>
            . The same sidecar coordinates E/P/D (encode, prefill, decode), which moves multimodal
            encoding to its own workers and is marked a proof of concept{' '}
            <Cite tier={1} href={`${LR_DISAGG}#L5-L17`}>
              disaggregation.md L5-L17
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Prefix-cache-aware routing</strong> is the cluster-scale version of automatic
            prefix caching (<strong>section 6</strong>): the EPP sends the request to the pod that
            holds the prefix. llm-d&apos;s "tiered offloading to CPU or disk"{' '}
            <Cite tier={1} href={`${LD}/README.md#L27`}>
              llm-d README L27
            </Cite>{' '}
            runs on vLLM&apos;s in-tree <code>OffloadingConnector</code>, into which llm-d&apos;s own
            file-system connector "has been integrated upstream"{' '}
            <Cite tier={1} href={LD_RELEASE}>
              llm-d v0.10.0 release notes, Deprecations
            </Cite>
            ; <strong>section 7 (KV-Cache Offloading &amp; Tiers)</strong> covers those tiers. On
            KServe they are declarable: a workload&apos;s <code>kvCacheOffloading</code> field sets
            a CPU tier size, an eviction policy (<code>lru</code> or <code>arc</code>) and ordered
            file-system tiers on an <code>emptyDir</code> or a PVC (PersistentVolumeClaim), which
            the controller translates into <code>--kv-transfer-config</code>{' '}
            <Cite tier={1} href={`${KS_TYPES}#L182-L185`} kind="code">
              llm_inference_service_types.go L182-L185
            </Cite>{' '}
            <Cite tier={1} href={`${KS_TYPES}#L213-L290`} kind="code">
              L213-L290
            </Cite>
            .
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

      <Container
        header={
          <Header
            variant="h2"
            description="Pick by how much Kubernetes machinery you already run, and know which vLLM metrics each router actually reads"
          >
            vs production-stack (section 16): operator path vs all-in-one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both stacks route inference traffic to vLLM replicas by what the replicas report, at
            different weights. Pick by how much Kubernetes machinery you already run and how much
            resource-driven control you need.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">llm-d / KServe + Gateway API</Box>
              <ul>
                <li>Operator path: <code>LLMInferenceService</code>, <code>InferencePool</code> and <code>InferenceObjective</code> resources reconciled by controllers</li>
                <li>A Gateway API gateway with the GA <code>InferencePool</code> API, or llm-d Router&apos;s standalone Envoy when you want no Gateway API objects</li>
                <li>Pluggable EPP: filters and weighted scorers declared in one <code>EndpointPickerConfig</code></li>
                <li>Multi-vendor backing (founded by Red Hat, Google Cloud, IBM Research, CoreWeave and NVIDIA); CNCF sandbox</li>
                <li>More moving parts (gateway, EPP, operator, pools) for full control</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">vLLM production-stack (section 16)</Box>
              <ul>
                <li>Lighter all-in-one: a router plus vLLM replicas, fewer CRDs (custom resource definitions)</li>
                <li>Helm-installable reference deployment from the vLLM project</li>
                <li>Faster to stand up when you do not need the full Gateway API surface</li>
                <li>The starting point; graduate to llm-d/KServe when scale or governance demands it</li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="The two routers read different vLLM metric names">
            Both take queue depth from <code>vllm:num_requests_waiting</code>. For KV-cache
            utilization the llm-d EPP reads <code>vllm:kv_cache_usage_perc</code>, which vLLM
            v0.31.0 emits{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L577')} kind="code">
              loggers.py L577
            </Cite>
            ; the production-stack <code>vllm-stack-0.1.13</code> scraper matches{' '}
            <code>vllm:gpu_cache_usage_perc</code>, which v0.31.0 does not emit, so on our reading
            of the code (not run) that stat stays at its 0.0 default{' '}
            <Cite tier={1} href={`${PS_STATS}#L56-L76`} kind="code">
              production-stack engine_stats.py L56-L76
            </Cite>
            . Only the llm-d EPP reads <code>vllm:lora_requests_info</code>. Check which signals a
            router reads before you swap one for the other.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The resource you write, the project claims behind llm-d, and the API status of the routing layer, for when you need the detail"
          >
            Deep dives
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ExpandableSection headerText="KServe's LLMInferenceService: the declarative spec">
            <SpaceBetween size="s">
              <Box variant="p">
                vLLM&apos;s KServe page opens with vLLM "can be deployed with KServe on Kubernetes
                for highly scalable distributed model serving" and names two paths: "use vLLM with
                KServe&apos;s Hugging Face serving runtime" or "via LLMInferenceService that uses
                llm-d"{' '}
                <Cite tier={1} href={vllmDocsUrl('deployment/integrations/kserve/')}>
                  vLLM docs: KServe
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('docs/deployment/integrations/kserve.md', 'L3-L5')}>
                  kserve.md L3-L5
                </Cite>
                .
              </Box>
              <Box variant="p">
                <code>LLMInferenceService</code> (short name <code>llmisvc</code>) stores at{' '}
                <code>serving.kserve.io/v1alpha2</code>, with <code>v1alpha1</code> still served
                through conversion{' '}
                <Cite tier={1} href={`${KS_TYPES}#L45-L47`} kind="code">
                  llm_inference_service_types.go L45-L47
                </Cite>{' '}
                <Cite tier={1} href={`${KS}/pkg/apis/serving/v1alpha1/llm_inference_service_conversion.go`} kind="code">
                  v1alpha1 conversion
                </Cite>
                . One spec holds the decode workload, an optional <code>prefill</code> section that
                adds a separate prefill deployment "inspired by the llm-d architecture", a{' '}
                <code>router</code> section for the Gateway API objects and scheduler, and{' '}
                <code>baseRefs</code> that inherit from <code>LLMInferenceServiceConfig</code>{' '}
                objects, the service&apos;s own spec taking precedence{' '}
                <Cite tier={1} href={`${KS_TYPES}#L85-L127`} kind="code">
                  L85-L127
                </Cite>{' '}
                <Cite tier={1} href={`${KS_TYPES}#L383-L405`} kind="code">
                  L383-L405
                </Cite>{' '}
                <Cite tier={1} href={`${KS_TYPES}#L55-L64`} kind="code">
                  L55-L64
                </Cite>
                .
              </Box>
              <Box variant="p">
                Engineers from Red Hat and Tesla describe the payoff of that layering as exposing
                "the standard Kubernetes API, allowing us to override the spec precisely where
                needed": the operator owns the boilerplate (Deployments, Services, InferencePool,
                autoscaling) while <code>LLMInferenceService</code> and{' '}
                <code>LLMInferenceServiceConfig</code> carry granular overrides for specialized
                hardware{' '}
                <Cite tier={2} href={LLMD_BLOG}>
                  llm-d blog: Production-grade LLM inference at scale (Red Hat and Tesla authors,
                  April 2026)
                </Cite>
                . The blog writes the second kind as "LLMInferenceConfig"; the KServe kind is{' '}
                <code>LLMInferenceServiceConfig</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="llm-d: what it is, who backs it, and what it claims">
            <SpaceBetween size="s">
              <Box variant="p">
                llm-d describes itself as "a high-performance distributed inference serving stack
                optimized for production deployments on Kubernetes"{' '}
                <Cite tier={1} href={`${LD}/README.md#L18`}>
                  llm-d README L18
                </Cite>
                . Its README groups the offering into themes: "Intelligent Routing"
                ("prefix-cache and load-aware balancing"), "Advanced KV-Cache Management"
                ("tiered offloading to CPU or disk"), "Serving Large Models" ("prefill/decode
                disaggregation and wide expert-parallelism"), "Operational Excellence" ("intelligent
                flow control" and "proactive, SLO-aware autoscaling") and "Batch Processing"{' '}
                <Cite tier={1} href={`${LD}/README.md#L26-L30`}>
                  llm-d README L26-L30
                </Cite>
                .
              </Box>
              <Box variant="p">
                It is a <strong>CNCF sandbox project</strong>, "founded by Red Hat, Google Cloud,
                IBM Research, CoreWeave, and NVIDIA", with support from AMD, Cisco, Hugging Face,
                Intel, Lambda, Mistral AI, UC Berkeley and the University of Chicago{' '}
                <Cite tier={1} href={`${LD}/README.md#L20`}>
                  llm-d README L20
                </Cite>{' '}
                <Cite tier={1} href={`${LD}/README.md#L57`}>
                  L57
                </Cite>
                . Model servers (vLLM, SGLang) "handle efficiently running large language models
                on accelerators" while llm-d provides "state-of-the-art orchestration and
                optimizations above model servers"{' '}
                <Cite tier={1} href={`${LD}/README.md#L24`}>
                  llm-d README L24
                </Cite>
                . The EPP treats a pod without an engine label as vLLM and ships metric mappings
                for SGLang, TensorRT-LLM&apos;s <code>trtllm-serve</code>, Triton and others{' '}
                <Cite tier={1} href={`${LR_FACTORIES}#L84-L94`} kind="code">
                  factories.go L84-L94
                </Cite>
                .
              </Box>
              <Alert type="warning">
                <strong>Project-claimed benchmark:</strong> the llm-d production blog reports "a 3x
                improvement in output tokens/s and a 2x reduction in time to first token (TTFT)" on
                Llama 3.1 70B across 4 AMD MI300X GPUs (tensor parallel size 4) after enabling
                prefix-cache-aware routing{' '}
                <Cite tier={2} href={LLMD_BLOG}>
                  llm-d production blog (vendor claim)
                </Cite>
                , and the llm-d README frames the same result as against round-robin{' '}
                <Cite tier={1} href={`${LD}/README.md#L38`}>
                  llm-d README L38
                </Cite>
                . This is a vendor-authored figure from one model and hardware configuration. Treat
                it as directional.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Gateway API Inference Extension: status and the InferencePool model">
            <SpaceBetween size="s">
              <Box variant="p">
                "Gateway API Inference Extension optimizes self-hosting Generative Models on
                Kubernetes", by using Envoy&apos;s External Processing to extend a gateway that
                supports ext-proc and the Gateway API into an inference gateway{' '}
                <Cite tier={1} href={`${GIE}/README.md#L8-L9`}>
                  GIE README L8-L9
                </Cite>
                . It has been <strong>GA</strong> since v1.0.0 in September 2025, the release that
                "marks the v1 of Inference Gateway" and promotes <code>InferencePool</code> to v1{' '}
                <Cite tier={1} href={`${GIE_RELEASES}/v1.0.0`}>
                  GIE v1.0.0 release notes
                </Cite>
                ; v1.6.2 (September 2026) is the current release{' '}
                <Cite tier={1} href={`${GIE_RELEASES}/v1.6.2`}>
                  GIE v1.6.2 release
                </Cite>
                .
              </Box>
              <Box variant="p">
                The central resource is the <code>InferencePool</code> (
                <code>inference.networking.k8s.io/v1</code>){' '}
                <Cite tier={1} href={`${GIE}/config/crd/bases/inference.networking.k8s.io_inferencepools.yaml`}>
                  InferencePool CRD
                </Cite>
                , the set of model-server pods the EPP scores over. The gateway routes to the pool;
                the EPP picks the endpoint inside it. GIE names "Prefix Cache status or LoRA
                Adapters availability" as examples of the model-server "Metrics and Capabilities" a
                scheduler consumes{' '}
                <Cite tier={1} href={`${GIE}/README.md#L37-L44`}>
                  GIE README L37-L44
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The versions that ship together, the vLLM you actually get inside an llm-d pod, and where the AWS wiring lives"
          >
            Pin the set, then deploy it on EKS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            llm-d releases are tested sets: v0.10.0 pairs the EPP and disaggregation-sidecar images
            at v0.11.0 with GIE CRDs v1.5.0 and the upstream{' '}
            <code>docker.io/vllm/vllm-openai</code> image at <strong>v0.30.0</strong>{' '}
            <Cite tier={1} href={LD_RELEASE}>
              llm-d v0.10.0 release notes, component summary
            </Cite>
            . llm-d Router v1.0.0 and GIE v1.6.2 are newer than that set, so take the EPP, the
            sidecar and the <code>InferencePool</code> CRDs from one llm-d release.
          </Box>
          <Box variant="p">
            That makes the vLLM inside an llm-d v0.10.0 pod <strong>v0.30.0</strong>, one minor
            release behind this dive&apos;s v0.31.0: check any flag or default from sections 4-13
            against v0.30.0 before you rely on it. The release also deprecates llm-d&apos;s own
            CUDA and AWS (EFA, Elastic Fabric Adapter) images in favour of{' '}
            <code>docker.io/vllm/vllm-openai</code> and{' '}
            <code>public.ecr.aws/deep-learning-containers/vllm</code>, the AWS Deep Learning
            Containers build of vLLM{' '}
            <Cite tier={1} href={LD_RELEASE}>
              llm-d v0.10.0 release notes, Deprecations
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Section 24 (vLLM on Amazon EKS)</strong> runs this stack on AWS: the same
            resources and gateway on managed Kubernetes, with GPU and EFA node groups under the
            vLLM pods. <strong>Section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong> covers the
            fabric the KV transfer rides, and <strong>section 23 (EC2 Topology &amp; Placement
            Groups)</strong> how close instances can be placed. Read this section for the shape of
            the operator path, then go to section 24 for the node, networking and autoscaling
            wiring.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
