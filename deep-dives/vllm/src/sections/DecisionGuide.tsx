import type { ReactNode } from 'react';
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

// ---------------------------------------------------------------------------
// Section 28: Decision Guide.
// The capstone: synthesis of the whole deep dive into actionable decisions.
// Most claims here are architectural JUDGMENT (framed as guidance). The hard
// facts (defaults, version pins, the "no throughput" property of
// disaggregation) carry inline Tier-1 citations pinned to vLLM v0.31.0.
// Pure-CSS / SVG diagrams only, no React Flow.
// ---------------------------------------------------------------------------

const ARG_UTILS = 'vllm/engine/arg_utils.py';
const CACHE_CFG = 'vllm/config/cache.py';
const SCHED_CFG = 'vllm/config/scheduler.py';
const LOGGERS = 'vllm/v1/metrics/loggers.py';
const OPT_DOCS = vllmDocsUrl('configuration/optimization/');
const DISAGG_DOCS = vllmDocsUrl('features/disagg_prefill/');
const DP_DOCS = vllmDocsUrl('serving/data_parallel_deployment/');

/** Other projects, pinned to the tags the sections that cover them use. */
const RAY_LLM_REQS =
  'https://github.com/ray-project/ray/blob/ray-2.59.0/python/requirements/llm/llm-requirements.txt#L2';
const PS_ROUTING =
  'https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/routers/routing_logic.py';
const PS_PARSER =
  'https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/parsers/parser.py';
const RUST_ROUTER_README = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md';
const LLMD_DISAGG = 'https://github.com/llm-d/llm-d-router/blob/v1.0.0/docs/disaggregation.md';
const VN_README = 'https://github.com/vllm-project/vllm-neuron/blob/v0.24.0.1.1.0/README.md?plain=1';
const KARP_DOC =
  'https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/website/content/en/docs/concepts/nodeclasses.md?plain=1';
const KARP_1110 = 'https://github.com/aws/karpenter-provider-aws/releases/tag/v1.11.0';
const BEDROCK_CMI =
  'https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html';

// ---- "Start here" decision tree (pure SVG, no deps) -----------------------

function StartHereTree() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 470"
        role="img"
        aria-labelledby="starthere-title"
        style={{ width: '100%', minWidth: 660, height: 'auto' }}
      >
        <title id="starthere-title">
          Serving decision tree. A named need (a model Bedrock cannot serve, an engine feature,
          cost at steady volume, or isolation) decides between Amazon Bedrock and self-hosted
          vLLM. A Python team then runs one model with vllm serve, which spans nodes with
          --nnodes, or many models with Ray Serve LLM. A Kubernetes team picks production-stack
          for one Helm chart or llm-d and KServe for a Gateway API platform, and both route
          disaggregated prefill and decode pools. Every path sizes the engine before turning on
          the advanced levers.
        </title>
        <style>
          {`
            .sht-q { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .sht-a { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
            .sht-stop { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
            .sht-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
            .sht-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .sht-edge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#sht-ah); }
            .sht-bus { stroke: #879596; stroke-width: 1.5; fill: none; }
            .sht-el { fill: #5f6b7a; font: 600 11px sans-serif; }
          `}
        </style>
        <defs>
          <marker
            id="sht-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
          </marker>
        </defs>
        <rect x={0} y={0} width={880} height={470} rx={8} fill="#ffffff" />

        {/* Q1: run the engine at all? */}
        <rect className="sht-q" x={280} y={14} width={320} height={56} rx={8} />
        <text className="sht-t" x={440} y={38}>Do you need to run the engine yourself?</text>
        <text className="sht-s" x={440} y={56}>model, engine feature, cost or isolation</text>

        {/* Q1 -> No -> Bedrock */}
        <path className="sht-edge" d="M600,42 L664,42" />
        <text className="sht-el" x={632} y={34} textAnchor="middle">No</text>
        <rect className="sht-stop" x={666} y={14} width={196} height={88} rx={8} />
        <text className="sht-t" x={764} y={38}>Use Amazon Bedrock</text>
        <text className="sht-s" x={764} y={56}>catalog models, pay-per-token</text>
        <text className="sht-s" x={764} y={72}>Custom Model Import for</text>
        <text className="sht-s" x={764} y={88}>your own weights (§25)</text>

        {/* Q1 -> Yes -> Q2 */}
        <path className="sht-edge" d="M440,70 L440,106" />
        <text className="sht-el" x={450} y={92} textAnchor="start">Yes</text>
        <rect className="sht-q" x={280} y={108} width={320} height={56} rx={8} />
        <text className="sht-t" x={440} y={132}>How does your team operate?</text>
        <text className="sht-s" x={440} y={150}>Python-native or Kubernetes operators</text>

        {/* Q2 -> Python -> one model or many */}
        <path className="sht-edge" d="M280,136 L224,136 L224,194" />
        <text className="sht-el" x={214} y={172} textAnchor="end">Python</text>
        <rect className="sht-q" x={79} y={196} width={290} height={56} rx={8} />
        <text className="sht-t" x={224} y={220}>One model, or a fleet of models?</text>
        <text className="sht-s" x={224} y={238}>vLLM alone, or Ray Serve LLM on top</text>

        {/* Q2 -> Kubernetes -> chart or platform */}
        <path className="sht-edge" d="M600,136 L656,136 L656,194" />
        <text className="sht-el" x={666} y={172} textAnchor="start">Kubernetes</text>
        <rect className="sht-q" x={511} y={196} width={290} height={56} rx={8} />
        <text className="sht-t" x={656} y={220}>One Helm chart, or a platform?</text>
        <text className="sht-s" x={656} y={238}>least surface, or Gateway API control</text>

        {/* Python leaves */}
        <path className="sht-edge" d="M116,252 L116,288" />
        <text className="sht-el" x={124} y={275} textAnchor="start">one model</text>
        <path className="sht-edge" d="M332,252 L332,288" />
        <text className="sht-el" x={324} y={275} textAnchor="end">many models</text>
        <rect className="sht-a" x={18} y={290} width={196} height={72} rx={8} />
        <text className="sht-t" x={116} y={314}>vllm serve (§9)</text>
        <text className="sht-s" x={116} y={332}>one model, one or more nodes</text>
        <text className="sht-s" x={116} y={348}>multi-node with --nnodes</text>
        <rect className="sht-a" x={234} y={290} width={196} height={72} rx={8} />
        <text className="sht-t" x={332} y={314}>Ray Serve LLM (§15)</text>
        <text className="sht-s" x={332} y={332}>many models and replicas</text>
        <text className="sht-s" x={332} y={348}>per-model autoscaling</text>

        {/* Kubernetes leaves */}
        <path className="sht-edge" d="M548,252 L548,288" />
        <text className="sht-el" x={556} y={275} textAnchor="start">one chart</text>
        <path className="sht-edge" d="M764,252 L764,288" />
        <text className="sht-el" x={756} y={275} textAnchor="end">platform</text>
        <rect className="sht-a" x={450} y={290} width={196} height={72} rx={8} />
        <text className="sht-t" x={548} y={314}>production-stack (§16)</text>
        <text className="sht-s" x={548} y={332}>one Helm chart + router</text>
        <text className="sht-s" x={548} y={348}>prefix, KV and P/D routing</text>
        <rect className="sht-a" x={666} y={290} width={196} height={72} rx={8} />
        <text className="sht-t" x={764} y={314}>llm-d / KServe (§17)</text>
        <text className="sht-s" x={764} y={332}>InferencePool + llm-d Router</text>
        <text className="sht-s" x={764} y={348}>multi-model, P/D-aware</text>

        {/* Every leaf converges on sizing, then levers */}
        <path className="sht-bus" d="M116,362 L116,382 M332,362 L332,382 M548,362 L548,382 M764,362 L764,382 M116,382 L764,382" />
        <path className="sht-edge" d="M220,382 L220,402" />
        <rect className="sht-q" x={40} y={404} width={360} height={52} rx={8} />
        <text className="sht-t" x={220} y={426}>Size the engine first</text>
        <text className="sht-s" x={220} y={444}>KV budget → parallelism → memory knobs → queue cap</text>
        <path className="sht-edge" d="M400,430 L438,430" />
        <rect className="sht-a" x={440} y={404} width={422} height={52} rx={8} />
        <text className="sht-t" x={651} y={426}>Then levers, only when a metric demands it</text>
        <text className="sht-s" x={651} y={444}>prefix caching and chunked prefill are on by default</text>
      </svg>
    </div>
  );
}

// ---- Criteria tables -------------------------------------------------------

interface OrchRow {
  option: string;
  fit: string;
  team: string;
  scale: ReactNode;
  pick: string;
}

const orchRows: OrchRow[] = [
  {
    option: 'vllm serve',
    fit: 'One model on one GPU, on one node with tensor parallelism (TP), or on several nodes with pipeline parallelism (PP) across them: one vllm serve per node with --nnodes and its own --node-rank.',
    team: 'Any: one CLI command per node, no cluster framework.',
    scale: (
      <>
        One engine. Across nodes it runs on the default multiprocessing executor, without Ray{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L999-L1000')} kind="code">
          config/parallel.py L999-L1000
        </Cite>
        . Scaling out means running more engines yourself; there is no autoscaling or fleet
        routing.
      </>
    ),
    pick: 'Prototypes, one-model services, and the engine inside every other option.',
  },
  {
    option: 'Ray Serve LLM (§15)',
    fit: 'Many models or replicas behind one OpenAI-compatible endpoint, driven from Python.',
    team: 'Python-native teams already on Ray, or avoiding a Kubernetes operator stack.',
    scale: (
      <>
        Autoscales replicas per model and runs each on vLLM&apos;s Ray executor.{' '}
        <code>ray[llm]</code> 2.59.0 installs vLLM 0.27.0, four minor releases behind v0.31.0{' '}
        <Cite tier={1} href={RAY_LLM_REQS}>
          Ray llm-requirements.txt L2
        </Cite>
        .
      </>
    ),
    pick: 'Python shops serving several models, or needing autoscaling, without a Kubernetes operator stack.',
  },
  {
    option: 'production-stack (§16)',
    fit: "The vLLM project's Helm chart: engine replicas behind a Python router.",
    team: 'Kubernetes teams that want the shortest path with one chart to operate.',
    scale: (
      <>
        Horizontal replica scaling with eight routing logics, including prefix-, KV- and
        load-aware routing and two for prefill/decode pools{' '}
        <Cite tier={1} href={`${PS_PARSER}#L229-L241`} kind="code">
          production-stack parser.py L229-L241
        </Cite>
        .
      </>
    ),
    pick: 'Kubernetes shops that want production vLLM fast, with batteries-included routing.',
  },
  {
    option: 'llm-d / KServe / Gateway API (§17)',
    fit: "A Gateway API platform: the InferencePool resource ties a gateway to the vLLM pods, and llm-d Router's Endpoint Picker (EPP) chooses the pod for each request.",
    team: 'Platform teams running a shared, programmable inference platform on Kubernetes.',
    scale: 'Many models, autoscaling, prefix- and adapter-aware routing; for disaggregated pools the EPP picks the decode pod first.',
    pick: 'A central platform serving many teams and models, extended through the Gateway API.',
  },
];

interface ParallelRow {
  strategy: string;
  splits: string;
  use: string;
  cost: ReactNode;
}

const parallelRows: ParallelRow[] = [
  {
    strategy: 'TP (Tensor Parallel)',
    splits: 'Each layer split across GPUs (intra-node).',
    use: 'First lever when a model + its KV will not fit on one GPU. Stay within a node (NVLink).',
    cost: 'Per-layer all-reduce every step; wants the fastest intra-node fabric.',
  },
  {
    strategy: 'PP (Pipeline Parallel)',
    splits: 'Layers grouped into stages across GPUs/nodes.',
    use: 'When the model exceeds one node and TP across nodes would be too chatty.',
    cost: 'Pipeline bubbles; cross-stage activation transfer. Cheaper cross-node link than TP.',
  },
  {
    strategy: 'EP (Expert Parallel)',
    splits: 'MoE experts distributed across GPUs.',
    use: 'Mixture-of-Experts models: route tokens to the GPUs holding their experts.',
    cost: 'All-to-all expert routing traffic; benefits from a high-bandwidth fabric such as EFA (Elastic Fabric Adapter).',
  },
  {
    strategy: 'DP (Data Parallel)',
    splits: 'Whole-model replicas, each serving a share of requests.',
    use: 'Scaling throughput once one replica already fits and meets latency.',
    cost: (
      <>
        N× the weight memory. Dense models need no per-step communication between replicas, which
        makes DP the simplest horizontal scale. For MoE with DP attention and EP, the ranks synchronize every
        forward pass{' '}
        <Cite tier={1} href={DP_DOCS}>
          vLLM docs: Data Parallel Deployment
        </Cite>
        .
      </>
    ),
  },
];

interface HwRow {
  workload: string;
  path: string;
  why: string;
}

const hwRows: HwRow[] = [
  {
    workload: "A model and feature set inside the Neuron plugin's tested matrix, on Trn2 or Trn3",
    path: 'AWS Trainium through vllm-neuron (§21)',
    why: 'Capability fit comes first: the plugin runs vLLM 0.24.0 with a narrower feature set. Cost per token depends on the model and the hardware generation, so benchmark it on your workload.',
  },
  {
    workload: 'Newest / custom models, broad kernel & quant support',
    path: 'GPU instances + EFA (§22)',
    why: 'Widest model/feature coverage; EFA gives the RDMA (remote direct memory access) fabric for multi-node + NIXL.',
  },
  {
    workload: 'Single-node multi-GPU (fits in one box)',
    path: 'One GPU instance, TP within the node',
    why: 'NVLink handles intra-node TP; no EFA needed for a single instance.',
  },
  {
    workload: 'Multi-node TP/PP or disaggregated prefill/decode',
    path: 'GPU + EFA, in a cluster placement group (§23, §24)',
    why: 'Cross-node collectives and KV transfer ride EFA; placement keeps the pair close.',
  },
];

interface LeverRow {
  lever: string;
  state: string;
  turnOn: ReactNode;
  note: ReactNode;
}

const leverRows: LeverRow[] = [
  {
    lever: 'Automatic prefix caching (§6)',
    state: 'default ON',
    turnOn: (
      <>
        Leave on. Wins on any shared-prefix traffic (system prompts, few-shot, multi-turn), and
        hybrid generative models get it by default too{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L2213-L2228')} kind="code">
          config/model.py L2213-L2228
        </Cite>
        .
      </>
    ),
    note: 'Free reuse of computed KV; cost is bookkeeping. No reason to disable for serving.',
  },
  {
    lever: 'Chunked prefill (§4)',
    state: 'default ON',
    turnOn: 'Leave on. Smooths ITL by stopping a long prefill from freezing the batch.',
    note: 'Scheduling technique; does NOT reduce KV memory. Not a fix for OOM/preemption.',
  },
  {
    lever: 'Quantization (§8)',
    state: 'opt-in',
    turnOn: 'When weights (or KV) do not fit, or to raise throughput/lower cost per token.',
    note: 'Trades a precision/accuracy budget for memory + speed. Validate quality on your evals.',
  },
  {
    lever: 'Speculative decoding (§11)',
    state: 'opt-in',
    turnOn: 'Latency-bound decode with a high draft acceptance rate.',
    note: (
      <>
        The gain shrinks as the batch grows and can turn negative. Dynamic speculative decoding (
        <code>num_speculative_tokens_per_batch_size</code>) lowers the draft length, or stops
        drafting, as the batch grows{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L491-L497')}>
          speculative.py L491-L497
        </Cite>
        .
      </>
    ),
  },
  {
    lever: 'Disaggregated prefill/decode (§10)',
    state: 'opt-in (experimental)',
    turnOn: 'ONLY for strict, separately negotiated TTFT and ITL service-level objectives (SLOs), or a large prefill:decode imbalance.',
    note: 'Does NOT raise throughput; it is a latency-isolation play that adds a KV-transfer tax. Start with NixlConnector, the NIXL pull mode.',
  },
  {
    lever: 'KV offloading (§7)',
    state: 'opt-in',
    turnOn: 'When the reusable prefix working set outgrows GPU HBM (high-bandwidth memory), or several replicas should share one cache.',
    note: (
      <>
        vLLM&apos;s native stack: a CPU tier (<code>--kv-offloading-size</code>), then
        filesystem, object-store and peer tiers; LMCache is the other backend (
        <code>--kv-offloading-backend lmcache</code>){' '}
        <Cite tier={1} href={vllmUrl(CACHE_CFG, 'L256-L265')}>
          cache.py L256-L265
        </Cite>
        . Size the CPU tier above the GPU KV cache; a smaller one adds no hit rate{' '}
        <Cite tier={1} href={vllmUrl('docs/features/kv_offloading_usage.md', 'L352-L355')}>
          KV Offloading Usage Guide L352-L355
        </Cite>
        .
      </>
    ),
  },
];

export function DecisionGuide() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Answer 'how should I serve this model?' as a short sequence of ordered decisions, each pointing at the section that justifies it (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            28. Decision Guide
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Serving an LLM well is a sequence of decisions made in the <strong>right order</strong>.
            The expensive mistakes come from reaching for an advanced lever, such as prefill/decode
            (P/D) disaggregation, speculative decoding or a heavier orchestrator, before answering
            the cheap questions first: do you even need to self-host, what does your team operate,
            do the model and its KV (key-value) cache fit, and what latency or throughput target are
            you actually missing. This section walks that order top to bottom and gives criteria
            tables for each fork. Cross-references point at the section that justifies each choice
            in depth.
          </Box>
          <Alert type="info" header="How to read this section">
            Recommendations marked as <strong>guidance</strong> are architectural judgment
            synthesized from the rest of the deep dive. They are starting points, not vendor
            guarantees. The hard facts (engine defaults, version pins, the property that
            disaggregation does not raise throughput) carry inline citations to the v0.31.0 code
            and docs. Validate against the docs for the vLLM version you run, and benchmark your own
            workload (§20).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow the forks from the top to the control plane you will run, then size the engine before you tune it"
          >
            Start here: the top-level decision tree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <StartHereTree />
          <Box variant="small" color="text-body-secondary">
            Guidance. The order (managed or self-hosted, then control plane, then sizing, then
            levers) is the recommended sequence, and each box names the section that covers it. Both
            Kubernetes leaves route disaggregated prefill and decode pools, so choose between them
            on operating model (§16, §17).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the engine yourself only for a need that Bedrock cannot meet"
          >
            1. Self-host vLLM vs managed (Amazon Bedrock)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Self-hosting vLLM buys you <strong>control</strong>: any architecture vLLM supports,
            custom quantization and kernels, full access to the engine knobs in this deep dive, and
            data that never leaves your account or VPC (virtual private cloud). The price is that you
            now own capacity planning, scaling, upgrades, and the failure modes in §27. Managed
            inference (Amazon Bedrock, covered in §25) inverts that: you trade engine control for an
            API with no servers to run, pay-per-token for catalog models, limited to the catalog and
            to the architectures Custom Model Import accepts for your own weights{' '}
            <Cite tier={1} href={BEDROCK_CMI}>
              Bedrock: Custom Model Import
            </Cite>
            . Most teams that do <em>not</em> have a specific reason to control the engine are
            better served by managed; reach for self-hosted vLLM when one of the control reasons is
            real.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Self-host vLLM when…</Box>
              <ul>
                <li>
                  Your model&apos;s architecture is outside what Custom Model Import supports, or you
                  need your own quantization or kernels.
                </li>
                <li>
                  You want the engine levers: prefix caching, custom tensor and pipeline parallelism,
                  disaggregation, LoRA (low-rank adaptation) fleets.
                </li>
                <li>Cost per token at sustained high utilization beats per-token managed pricing.</li>
                <li>Data residency or VPC isolation requires the weights to run in your account.</li>
                <li>You serve many fine-tunes / LoRA adapters off one base (§13).</li>
              </ul>
              <Box variant="small" color="text-body-secondary">Guidance. See §25 for the full comparison.</Box>
            </div>
            <div>
              <Box variant="h3">Use managed (Bedrock) when…</Box>
              <ul>
                <li>You want an API rather than an inference platform to operate.</li>
                <li>Traffic is spiky or low, and you do not want idle GPUs billed by the hour.</li>
                <li>
                  The model is in the catalog, or Custom Model Import supports its architecture.
                </li>
                <li>You lack the team to own GPU capacity, scaling, and upgrades.</li>
                <li>Time-to-first-call matters more than per-token cost at scale.</li>
              </ul>
              <Box variant="small" color="text-body-secondary">Guidance. See §25 (vLLM on SageMaker &amp; vs Bedrock).</Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the control plane by how your team operates and how many models you serve; disaggregation is available on every Kubernetes path"
          >
            2. Which orchestrator
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every option below runs the <em>same</em> vLLM engine; the choice is the control plane
            around it. The two axes that actually decide it are <strong>how your team
            operates</strong> (Python-native vs Kubernetes/operator) and <strong>scope</strong> (one
            model, on one node or several → a multi-model fleet that autoscales).{' '}
            <code>vllm serve</code> already spans nodes, so going multi-node alone keeps you on the
            first row. Start at the cheapest box that meets your need and move down the table only when a
            concrete requirement forces it.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'option', header: 'Option', cell: (r) => <strong>{r.option}</strong>, minWidth: 170 },
              { id: 'fit', header: 'What it is / fits', cell: (r) => r.fit, minWidth: 220 },
              { id: 'team', header: 'Team model', cell: (r) => r.team, minWidth: 180 },
              { id: 'scale', header: 'Scale / multi-node', cell: (r) => r.scale, minWidth: 220 },
              { id: 'pick', header: 'Pick it when', cell: (r) => r.pick, minWidth: 220 },
            ]}
            items={orchRows}
          />
          <Alert type="info">
            <strong>Decision rule (guidance).</strong> Python team, one model on one or more nodes →{' '}
            <code>vllm serve</code>, started on every node with <code>--nnodes</code> (§9). Python
            team serving several models, or needing autoscaling, without a Kubernetes operator →{' '}
            <strong>Ray Serve LLM (§15)</strong>. Kubernetes team that wants the least operational
            surface → <strong>production-stack (§16)</strong>. Kubernetes platform team building on
            the Gateway API → <strong>llm-d / KServe (§17)</strong>. Disaggregation (§10) needs a
            P/D-aware router, and production-stack&apos;s router{' '}
            <Cite tier={1} href={`${PS_ROUTING}#L1010-L1023`} kind="code">
              routing_logic.py L1010-L1023
            </Cite>
            , the vLLM Rust router{' '}
            <Cite tier={1} href={`${RUST_ROUTER_README}#L108-L124`}>
              router v0.1.16 README L108-L124
            </Cite>{' '}
            and llm-d Router{' '}
            <Cite tier={1} href={`${LLMD_DISAGG}#L84-L91`}>
              llm-d Router disaggregation.md L84-L91
            </Cite>{' '}
            each ship one. On Kubernetes, choose between production-stack and llm-d on operating
            model; both route disaggregated pools.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Shard only what does not fit: by GPU first, then by node, then by model architecture"
          >
            3. Which parallelism (§9)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Parallelism is driven by a single forcing question: <strong>what does not
            fit?</strong> If a model plus its KV cache fits on one GPU, do not shard it at all;
            replicate it with data parallelism (DP) for throughput. When it does not fit, add tensor
            parallelism within a node first (NVLink is the cheapest fabric for TP&apos;s per-step
            all-reduce), then reach across nodes with pipeline parallelism, and use expert
            parallelism (EP) only for Mixture-of-Experts (MoE) models.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'strategy', header: 'Strategy', cell: (r) => <strong>{r.strategy}</strong>, minWidth: 170 },
              { id: 'splits', header: 'What it splits', cell: (r) => r.splits, minWidth: 220 },
              { id: 'use', header: 'Use it when', cell: (r) => r.use, minWidth: 260 },
              { id: 'cost', header: 'Communication cost', cell: (r) => r.cost, minWidth: 240 },
            ]}
            items={parallelRows}
          />
          <Alert type="info">
            <strong>Decision rule (guidance).</strong> Fits on one GPU → no sharding; use{' '}
            <strong>DP</strong> replicas for throughput. Does not fit on one GPU, fits in one node →{' '}
            <strong>TP</strong> across that node&apos;s GPUs. Exceeds one node →{' '}
            <strong>PP</strong> across nodes (and TP within each node) so the chatty per-layer
            all-reduce stays on NVLink, launched as one <code>vllm serve</code> per node with{' '}
            <code>--nnodes</code>. <strong>MoE</strong> model → add <strong>EP</strong> to
            distribute experts. Long prompts that miss their TTFT target, or KV duplicated by TP
            beyond the model&apos;s KV-head count → context parallelism (§9). Multi-node TP/PP/EP
            all want a fast inter-node fabric: on AWS that is EFA (§22) with the nodes placed close
            together (§23).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick Trainium or GPU + EFA by capability, then keep multi-node and disaggregated pools physically close"
          >
            4. Hardware &amp; instance choice on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The AWS hardware fork is <strong>Trainium (§21) vs GPU + EFA (§22)</strong>. Trainium
            runs vLLM through the vllm-neuron plugin, whose current line runs on Trn2 and Trn3 and
            pins vLLM 0.24.0{' '}
            <Cite tier={1} href={`${VN_README}#L123-L131`}>
              vllm-neuron README L123-L131
            </Cite>
            ; it fits when your model and features sit inside the plugin&apos;s tested matrix. GPU
            instances give the widest model, kernel, and quantization coverage and the EFA fabric
            that multi-node serving and NIXL (NVIDIA Inference Xfer Library) KV transfer ride on.
            Orthogonal to that: as soon as you go <strong>multi-node</strong> (cross-node TP/PP/EP)
            or <strong>disaggregate</strong>, placement stops being free: the nodes must be
            physically close (§23).
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'workload', header: 'Your workload', cell: (r) => <strong>{r.workload}</strong>, minWidth: 240 },
              { id: 'path', header: 'Recommended path', cell: (r) => r.path, minWidth: 220 },
              { id: 'why', header: 'Why (guidance)', cell: (r) => r.why, minWidth: 260 },
            ]}
            items={hwRows}
          />
          <Alert type="warning" header="Placement is part of the hardware decision">
            For a single instance, NVLink carries intra-node GPU traffic and placement does not
            matter. The moment you span nodes (multi-node TP/PP/EP, or a prefiller pool feeding a
            decoder pool over a KV connector), the inter-node hops become the bottleneck. Put
            multi-node ranks in a <strong>cluster placement group</strong> so they share the same
            low-latency spine, and, conservatively, paired prefiller and decoder pools too (§23). On
            a slow link the KV-transfer tax can exceed the prefill stall it was meant to remove
            (§10). On Amazon EKS (Elastic Kubernetes Service), a Karpenter EC2NodeClass whose{' '}
            <code>placementGroupSelector</code> names a cluster placement group you created
            autoscales nodes into it{' '}
            <Cite tier={1} href={`${KARP_DOC}#L989-L1021`}>
              Karpenter v1.15.0 docs: placementGroupSelector
            </Cite>
            , available from Karpenter v1.11.0{' '}
            <Cite tier={1} href={KARP_1110}>
              Karpenter v1.11.0 release notes
            </Cite>
            , so the multi-node tier scales with demand (§24).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the KV-cache ceiling off the startup log, then set the limits that decide concurrency and preemption"
          >
            5. Sizing &amp; capacity
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sizing comes <strong>before</strong> any advanced lever. The real ceiling on concurrency
            is <strong>KV-cache capacity</strong>, whatever <code>max_num_seqs</code> says. After the
            model weights and activation workspace are placed, whatever GPU memory is left becomes
            the block pool, and that pool divided by the per-request KV footprint is your batch-size
            ceiling. vLLM prints that ceiling at startup as{' '}
            <code>GPU KV cache size: N tokens, Maximum concurrency for M tokens per request: X.XXx</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L2455-L2471')} kind="code">
              kv_cache_utils.py L2455-L2471
            </Cite>
            , so read it before you compute. The knobs below shape that number, but the budget is
            physics.
          </Box>

          <ExpandableSection
            headerText="KV-memory budget: the rule of thumb"
            defaultExpanded
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Rule of thumb (guidance):</strong>{' '}
                <code>KV pool ≈ (GPU memory × gpu_memory_utilization) − model weights − activation workspace</code>.
                Per-request KV grows linearly with sequence length, and per token it scales with the
                number of layers, the number of KV heads, the head dimension, and the bytes per
                element (2 for FP16/BF16; less if you quantize the KV cache). So the maximum number
                of concurrent full-length sequences ≈ KV pool ÷ (per-token KV × max sequence length).
                Long-context workloads burn the pool fastest, which is why context length is itself a
                capacity lever (§5).
              </Box>
              <Box variant="p">
                The cache is laid out in fixed blocks. Left unset, <code>block_size</code>{' '}
                (&quot;Size of a contiguous cache block in number of tokens&quot;) starts at{' '}
                <strong>16</strong>{' '}
                <Cite tier={1} href={vllmUrl(CACHE_CFG, 'L71-L75')}>
                  cache.py L71-L75
                </Cite>
                , unless the selected attention backends need another size or a hybrid model
                re-aligns it{' '}
                <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L683-L702')} kind="code">
                  interface.py L683-L702
                </Cite>
                . Smaller blocks waste less on the trailing partial block; larger blocks cut
                bookkeeping. Leave it unless profiling says otherwise (§5).
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Starting points: gpu_memory_utilization, max_num_batched_tokens, max_num_seqs">
            <SpaceBetween size="s">
              <Table
                variant="embedded"
                wrapLines
                columnDefinitions={[
                  { id: 'knob', header: 'Knob', cell: (r) => r.knob, minWidth: 200 },
                  { id: 'start', header: 'Starting point', cell: (r) => r.start, minWidth: 240 },
                  { id: 'move', header: 'How to move it', cell: (r) => r.move, minWidth: 300 },
                ]}
                items={[
                  {
                    knob: <code>gpu_memory_utilization</code>,
                    start: (
                      <span>
                        default <strong>0.92</strong>{' '}
                        <Cite tier={1} href={vllmUrl(CACHE_CFG, 'L103')}>
                          cache.py L103
                        </Cite>
                      </span>
                    ),
                    move: 'Raise toward ~0.95 to give the KV pool more room (first remedy for preemption). Lower if you share the GPU or run out of memory (OOM) at startup: the pool is pre-allocated, so too high leaves no slack for activation spikes (§5).',
                  },
                  {
                    knob: <code>max_num_batched_tokens</code>,
                    start: (
                      <span>
                        <code>vllm serve</code> default by GPU memory: <strong>16384</strong> at
                        160 GiB or more, <strong>8192</strong> at 70 GiB or more (H100 class, A100
                        excluded), <strong>2048</strong> elsewhere{' '}
                        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')} kind="code">
                          arg_utils.py L2858-L2887
                        </Cite>
                        . Throughput-bound: the docs recommend <code>&gt; 8192</code>{' '}
                        <Cite tier={1} href={OPT_DOCS}>
                          vLLM docs: Optimization and tuning
                        </Cite>
                      </span>
                    ),
                    move: 'Higher → better TTFT (time to first token) and throughput (more prefill per step). Lower (e.g. 2048) → better ITL (inter-token latency, fewer prefills stalling decodes) and relieves KV pressure. This is the master latency dial (§4).',
                  },
                  {
                    knob: <code>max_num_seqs</code>,
                    start: (
                      <span>
                        <code>vllm serve</code> default: <strong>1024</strong> at 70 GiB or more
                        (A100 excluded), <strong>256</strong> elsewhere{' '}
                        <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2858-L2887')} kind="code">
                          arg_utils.py L2858-L2887
                        </Cite>
                      </span>
                    ),
                    move: (
                      <span>
                        Raise when you have spare KV cache and want more concurrent decodes. Lower
                        it, or cap only the running batch with <code>--max-num-active-seqs</code>{' '}
                        <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L70-L78')}>
                          scheduler.py L70-L78
                        </Cite>
                        , when preemptions climb: fewer running sequences need less KV space (§4).
                      </span>
                    ),
                  },
                ]}
              />
              <Box variant="p">
                Pass both limits explicitly on a production server, so the values stop depending on
                which GPU tier the server lands on (§4).
              </Box>
              <Alert type="info">
                <strong>Order of operations (guidance).</strong> If <code>vllm:num_preemptions</code>{' '}
                rises, or the periodic stats log line shows <code>Preemptions: N</code>{' '}
                <Cite tier={1} href={vllmUrl(LOGGERS, 'L676-L680')} kind="code">
                  loggers.py L676-L680
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(LOGGERS, 'L295-L297')} kind="code">
                  L295-L297
                </Cite>
                : (1) raise <code>gpu_memory_utilization</code>, and set <code>--watermark</code>{' '}
                (0.05 keeps 5% of KV blocks free when admitting requests){' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L197-L202')}>
                  scheduler.py L197-L202
                </Cite>
                ; (2) lower <code>max_num_seqs</code> / <code>max_num_batched_tokens</code>, or set{' '}
                <code>--max-num-active-seqs</code>; (3) increase <code>tensor_parallel_size</code>{' '}
                (or <code>pipeline_parallel_size</code>) so weights leave more room per GPU for KV;
                (4) quantize (§8). The memory, batch-limit and parallelism remedies come from the
                optimization guide{' '}
                <Cite tier={1} href={OPT_DOCS}>
                  vLLM docs: Optimization and tuning
                </Cite>
                . Chunked prefill is <em>not</em> on this list because it does not change the KV
                footprint. Then bound the queue: <code>--max-num-queued-reqs</code> turns overload
                into HTTP 503 responses a load balancer can retry elsewhere{' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L93-L104')}>
                  scheduler.py L93-L104
                </Cite>{' '}
                (§27).
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two of these are already on. The rest are opt-in: turn each on only when a metric you track demands it"
          >
            6. When to turn on the advanced levers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A common over-engineering pattern in vLLM deployments is enabling advanced levers
            speculatively. <strong>Prefix caching (§6) and chunked prefill (§4) are on by
            default</strong> for every model that supports them{' '}
            <Cite tier={1} href={vllmUrl(ARG_UTILS, 'L2922-L2926')} kind="code">
              arg_utils.py L2922-L2926
            </Cite>
            ; leave them on. The rest cost complexity and only pay off against a specific
            bottleneck. The right trigger for each is a number you are missing, not a feature you
            read about.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'lever', header: 'Lever', cell: (r) => <strong>{r.lever}</strong>, minWidth: 200 },
              {
                id: 'state',
                header: 'State',
                cell: (r) => (
                  <Badge color={r.state.startsWith('default') ? 'green' : 'blue'}>{r.state}</Badge>
                ),
                minWidth: 120,
              },
              { id: 'turnOn', header: 'Turn on / leave on when', cell: (r) => r.turnOn, minWidth: 260 },
              { id: 'note', header: 'Watch out', cell: (r) => r.note, minWidth: 260 },
            ]}
            items={leverRows}
          />
          <Alert type="warning" header="The two facts people get wrong">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Chunked prefill does not reduce KV memory.</strong> It is a scheduling
                technique that spreads prefill compute over steps to protect ITL: a 30K-token prompt
                still needs KV blocks for all 30K positions, and the scheduler admits it only when
                the full input fits{' '}
                <Cite tier={1} href={vllmUrl(SCHED_CFG, 'L191-L195')}>
                  scheduler.py L191-L195
                </Cite>
                . If you are hitting OOM or preemption, chunking will not save you; the memory knobs
                in §5 and §4 will.
              </Box>
              <Box variant="p">
                <strong>Disaggregated prefill/decode does not raise throughput</strong> (
                <em>&quot;Disaggregated prefill DOES NOT improve throughput&quot;</em>{' '}
                <Cite tier={1} href={DISAGG_DOCS}>
                  vLLM docs: Disaggregated Prefilling
                </Cite>
                ). It is a latency-isolation tool for strict, separate TTFT/ITL SLOs and adds a
                KV-transfer tax. If your goal is tokens/sec or cost-per-token, reach for batching,
                quantization, or prefix caching instead (§10).
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The whole guide as seven steps to run in order on your own deployment"
          >
            Putting it together: the one-page answer
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <Badge color="green">1</Badge>{' '}
            <strong>Need to run the engine?</strong> No → Bedrock, with Custom Model Import for your
            own weights in a supported architecture (§25). Yes → self-host vLLM.
          </Box>
          <Box variant="p">
            <Badge color="green">2</Badge>{' '}
            <strong>Orchestrator by team + scope:</strong> Python, one model on one or more nodes →{' '}
            <code>vllm serve</code> with <code>--nnodes</code>; Python, many models or autoscaling →
            Ray Serve LLM (§15); Kubernetes, one chart → production-stack (§16); Kubernetes platform
            on the Gateway API → llm-d / KServe (§17). Both Kubernetes routers handle disaggregated
            pools.
          </Box>
          <Box variant="p">
            <Badge color="green">3</Badge>{' '}
            <strong>Parallelism by what does not fit:</strong> fits → DP replicas; not on one GPU →
            TP in-node; not on one node → PP cross-node; MoE → add EP (§9).
          </Box>
          <Box variant="p">
            <Badge color="green">4</Badge>{' '}
            <strong>Hardware:</strong> model and features inside the Neuron plugin&apos;s matrix →
            Trainium (§21), then benchmark the cost; broadest coverage + multi-node fabric → GPU +
            EFA (§22); multi-node/disagg → cluster placement group (§23), which Karpenter can
            autoscale into on EKS (§24).
          </Box>
          <Box variant="p">
            <Badge color="green">5</Badge>{' '}
            <strong>Size first:</strong> read the startup KV-capacity line; set{' '}
            <code>gpu_memory_utilization</code> (0.92 default); pin{' '}
            <code>max_num_batched_tokens</code> and <code>max_num_seqs</code> explicitly, since{' '}
            <code>vllm serve</code> picks 8192 and 1024 on an H100 but 2048 and 256 on an A100, and
            go above 8192 tokens for throughput; bound the queue with{' '}
            <code>--max-num-queued-reqs</code> (§4, §5, §27).
          </Box>
          <Box variant="p">
            <Badge color="blue">6</Badge>{' '}
            <strong>Then levers, only on a missed metric:</strong> prefix caching + chunked prefill
            already on; quantize for memory/cost (§8); spec-decode for latency-bound decode, with a
            per-batch-size draft schedule as load rises (§11); disaggregate only for strict separate
            TTFT/ITL SLOs, <em>not</em> for throughput (§10); KV offload when the prefix working set
            outgrows HBM (§7).
          </Box>
          <Box variant="p">
            <Badge color="grey">7</Badge>{' '}
            <strong>Verify on your own traffic:</strong> benchmark before and after every change
            (§20), and design for the failure modes in §27. Defaults and benchmarks beat intuition.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
