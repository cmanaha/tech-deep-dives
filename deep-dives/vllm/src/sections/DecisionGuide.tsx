import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';

// ---------------------------------------------------------------------------
// Section 28: Decision Guide.
// The capstone: synthesis of the whole deep dive into actionable decisions.
// Most claims here are architectural JUDGMENT (framed as guidance). The few
// hard facts (defaults, the "no throughput" property of disaggregation) carry
// inline Tier-1 citations. Pure-CSS / SVG diagrams only, no React Flow.
// ---------------------------------------------------------------------------

// ---- "Start here" decision tree (pure SVG, no deps) -----------------------

function StartHereTree() {
  return (
    <svg
      viewBox="0 0 880 560"
      role="img"
      aria-labelledby="starthere-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="starthere-title">
        Top-level serving decision tree: first decide self-host vs managed Bedrock; then pick an
        orchestrator by team and scale; then size the engine and only then turn on advanced levers.
      </title>
      <style>
        {`
          .node { stroke-width: 1.5; rx: 8; }
          .q { fill: #f2f8fd; stroke: #0972d3; }
          .a { fill: #ecf7ec; stroke: #037f0c; }
          .stop { fill: #fdf3ec; stroke: #ec7211; }
          .nt { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .ns { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .edge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#dh); }
          .el { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="dh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>

      {/* Q1 */}
      <rect className="node q" x={300} y={16} width={280} height={56} rx={8} />
      <text className="nt" x={440} y={40}>Do you need control of the engine?</text>
      <text className="ns" x={440} y={58}>custom model / quant / kernels / on-prem data</text>

      {/* Q1 -> No (managed) */}
      <path className="edge" d="M300,44 L120,44 L120,96" />
      <text className="el" x={205} y={36}>No, just want an API</text>
      <rect className="node stop" x={20} y={96} width={200} height={56} rx={8} />
      <text className="nt" x={120} y={120}>Use Amazon Bedrock</text>
      <text className="ns" x={120} y={138}>managed, pay-per-token (§25)</text>

      {/* Q1 -> Yes -> Q2 */}
      <path className="edge" d="M440,72 L440,104" />
      <text className="el" x={520} y={92}>Yes, self-host vLLM</text>
      <rect className="node q" x={300} y={104} width={280} height={56} rx={8} />
      <text className="nt" x={440} y={128}>How does your team operate?</text>
      <text className="ns" x={440} y={146}>Python-native vs Kubernetes / operators</text>

      {/* Q2 -> single box / Ray */}
      <path className="edge" d="M300,132 L140,132 L140,196" />
      <text className="el" x={210} y={124}>Python, 1 node</text>
      <rect className="node a" x={40} y={196} width={200} height={64} rx={8} />
      <text className="nt" x={140} y={220}>bare vllm serve</text>
      <text className="ns" x={140} y={238}>one model, one box</text>
      <text className="ns" x={140} y={252}>→ Ray Serve LLM if scaling (§15)</text>

      {/* Q2 -> K8s -> Q3 */}
      <path className="edge" d="M440,160 L440,196" />
      <text className="el" x={530} y={184}>Kubernetes shop</text>
      <rect className="node q" x={300} y={196} width={280} height={56} rx={8} />
      <text className="nt" x={440} y={220}>One model, or a fleet + KV reuse?</text>
      <text className="ns" x={440} y={238}>fixed deploy vs autoscale / disagg</text>

      {/* Q3 -> production-stack */}
      <path className="edge" d="M440,252 L300,252 L300,300 L240,300" />
      <text className="el" x={300} y={278}>Helm, simple</text>
      <rect className="node a" x={40} y={272} width={200} height={64} rx={8} />
      <text className="nt" x={140} y={296}>production-stack (§16)</text>
      <text className="ns" x={140} y={314}>vLLM-native Helm +</text>
      <text className="ns" x={140} y={328}>prefix-aware router</text>

      {/* Q3 -> llm-d / Gateway */}
      <path className="edge" d="M580,224 L740,224 L740,272" />
      <text className="el" x={660} y={216}>fleet / disagg</text>
      <rect className="node a" x={640} y={272} width={200} height={64} rx={8} />
      <text className="nt" x={740} y={296}>llm-d / KServe (§17)</text>
      <text className="ns" x={740} y={314}>Gateway API Inference</text>
      <text className="ns" x={740} y={328}>Extension, disagg-aware</text>

      {/* Common downstream: size then levers */}
      <path className="edge" d="M140,336 L140,392 L440,392 L440,420" />
      <path className="edge" d="M140,260 L140,278" opacity={0} />
      <path className="edge" d="M740,336 L740,392 L440,392" />
      <rect className="node q" x={300} y={420} width={280} height={56} rx={8} />
      <text className="nt" x={440} y={444}>Size the engine FIRST</text>
      <text className="ns" x={440} y={462}>KV budget → TP/PP → mem knobs</text>

      <path className="edge" d="M440,476 L440,504" />
      <rect className="node a" x={250} y={504} width={380} height={48} rx={8} />
      <text className="nt" x={440} y={526}>THEN turn on levers only when a metric demands it</text>
      <text className="ns" x={440} y={544}>prefix cache &amp; chunked prefill are already on by default</text>
    </svg>
  );
}

// ---- Criteria tables -------------------------------------------------------

interface OrchRow {
  option: string;
  fit: string;
  team: string;
  scale: string;
  pick: string;
}

const orchRows: OrchRow[] = [
  {
    option: 'bare vllm serve',
    fit: 'One model on one node (or one multi-GPU box via TP).',
    team: 'Any: a single CLI command, no cluster.',
    scale: 'Single replica. No built-in autoscaling or fleet routing.',
    pick: 'Prototypes, one-model internal services, the inner loop of every other option.',
  },
  {
    option: 'Ray Serve LLM (§15)',
    fit: 'Multi-model / multi-replica serving driven from Python.',
    team: 'Python-native teams already on Ray, or wanting to avoid K8s operators.',
    scale: 'Autoscales replicas; handles multi-node TP/PP placement via Ray actors.',
    pick: 'Python shops scaling past one box without adopting a Kubernetes operator stack.',
  },
  {
    option: 'production-stack (§16)',
    fit: 'vLLM-native Helm chart + a prefix/KV-aware router on Kubernetes.',
    team: 'K8s teams that want the simplest vLLM-blessed path.',
    scale: 'Horizontal replica scaling with cache-aware routing; one model family per stack.',
    pick: 'Kubernetes shops serving one (or a few) models who want batteries-included routing.',
  },
  {
    option: 'llm-d / KServe / Gateway API (§17)',
    fit: 'Fleet-scale, multi-model, with the Gateway API Inference Extension and disagg support.',
    team: 'Platform teams running a shared inference platform on Kubernetes.',
    scale: 'Largest blast radius: many models, autoscaling, disaggregation-aware routing.',
    pick: 'Central platform serving many teams/models, or anyone needing disaggregation in K8s.',
  },
];

interface LeverRow {
  lever: string;
  state: string;
  turnOn: string;
  note: string;
}

const leverRows: LeverRow[] = [
  {
    lever: 'Automatic prefix caching (§6)',
    state: 'default ON',
    turnOn: 'Leave on. Wins on any shared-prefix traffic (system prompts, few-shot, multi-turn).',
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
    turnOn: 'Latency-bound, low-concurrency decode with a high draft acceptance rate.',
    note: 'Helps ITL when the GPU is under-utilized; can HURT under high batch (compute already saturated).',
  },
  {
    lever: 'Disaggregated prefill/decode (§10)',
    state: 'opt-in (experimental)',
    turnOn: 'ONLY for strict, separately-negotiated TTFT and ITL SLOs, or big prefill:decode imbalance.',
    note: 'Does NOT raise throughput; it is a latency-isolation play that adds a KV-transfer tax.',
  },
  {
    lever: 'KV offloading / LMCache (§7)',
    state: 'opt-in',
    turnOn: 'When you want cross-request / cross-replica KV reuse beyond GPU HBM capacity.',
    note: 'Extends the cache down the memory hierarchy (CPU/remote). Pays a transfer cost on hits.',
  },
];

interface ParallelRow {
  strategy: string;
  splits: string;
  use: string;
  cost: string;
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
    cost: 'All-to-all expert routing traffic; benefits from a high-bandwidth fabric (EFA).',
  },
  {
    strategy: 'DP (Data Parallel)',
    splits: 'Whole-model replicas, each serving a share of requests.',
    use: 'Scaling throughput once one replica already fits and meets latency.',
    cost: 'N× the weight memory; no per-step cross-GPU comms, the simplest horizontal scale.',
  },
];

interface HwRow {
  workload: string;
  path: string;
  why: string;
}

const hwRows: HwRow[] = [
  {
    workload: 'Cost-optimized single-model serving, vLLM-supported model',
    path: 'AWS Neuron (Inf2 / Trn) (§21)',
    why: 'Best price/token when the model is on the Neuron-supported path; no GPU premium.',
  },
  {
    workload: 'Newest / custom models, broad kernel & quant support',
    path: 'GPU instances + EFA (§22)',
    why: 'Widest model/feature coverage; EFA gives the RDMA fabric for multi-node + NIXL.',
  },
  {
    workload: 'Single-node multi-GPU (fits in one box)',
    path: 'One GPU instance, TP within the node',
    why: 'NVLink handles intra-node TP; no EFA needed for a single instance.',
  },
  {
    workload: 'Multi-node TP/PP or disaggregated prefill/decode',
    path: 'GPU + EFA, in a cluster placement group (§23)',
    why: 'Cross-node collectives and KV transfer ride EFA; placement keeps the pair close.',
  },
];

export function DecisionGuide() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The capstone: one page that answers 'how should I serve this model?' by tying the rest of the deep dive into ordered decisions. Most of this is synthesis; hard facts carry citations, everything else is framed as guidance."
          >
            28. Decision Guide
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Serving an LLM well is a sequence of decisions made in the <strong>right order</strong>.
            The expensive mistakes come from reaching for an advanced lever (disaggregation,
            speculative decoding, a fancy orchestrator) before answering the cheap questions first:
            do you even need to self-host, what does your team operate, does the model fit, and what
            latency/throughput target are you actually missing. This section walks that order top to
            bottom and gives criteria tables for each fork. Cross-references point at the section that
            justifies each choice in depth.
          </Box>
          <Alert type="info" header="How to read this section">
            Recommendations marked as <strong>guidance</strong> are architectural judgment
            synthesized from the rest of the deep dive. They are starting points, not vendor
            guarantees. The few hard facts (engine defaults, the property that disaggregation does
            not raise throughput) carry inline Tier-1 citations. Always validate against the docs at
            your pinned vLLM version and benchmark your own workload (§20).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start at the top. Each fork sends you to the section that justifies it."
          >
            Start here: the top-level decision tree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <StartHereTree />
          <Box variant="small" color="text-body-secondary">
            Guidance. The ordering (managed vs self-host, then orchestrator, then sizing, then
            levers) is the recommended sequence; the boxes name the section that covers each branch.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The first fork: do you actually need to run the engine yourself?"
          >
            1. Self-host vLLM vs managed (Amazon Bedrock)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Self-hosting vLLM buys you <strong>control</strong>: arbitrary open-weight models,
            custom quantization and kernels, full access to the engine knobs in this deep dive, and
            data that never leaves your account/VPC. The price is that you now own capacity planning,
            scaling, upgrades, and the failure modes in §27. Managed inference (Amazon Bedrock,
            covered in §25) inverts that: you trade engine control for a pay-per-token API with no
            servers to run, at the cost of being limited to the catalog and losing the low-level
            levers. Most teams that do <em>not</em> have a specific reason to control the engine are
            better served by managed; reach for self-hosted vLLM when one of the control reasons is
            real.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Self-host vLLM when…</Box>
              <ul>
                <li>You need a model (or quantization) not in a managed catalog.</li>
                <li>You want the engine levers: prefix caching, custom TP/PP, disagg, LoRA fleets.</li>
                <li>Cost per token at sustained high utilization beats per-token managed pricing.</li>
                <li>Data residency / VPC isolation requires the weights run in your account.</li>
                <li>You serve many fine-tunes / LoRA adapters off one base (§13).</li>
              </ul>
              <Box variant="small" color="text-body-secondary">Guidance. See §25 for the full comparison.</Box>
            </div>
            <div>
              <Box variant="h3">Use managed (Bedrock) when…</Box>
              <ul>
                <li>You want an API, not an inference platform to operate.</li>
                <li>Traffic is spiky or low, and you do not want idle GPUs billed by the hour.</li>
                <li>The model you need is already in the catalog.</li>
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
            description="If you self-host: which control plane runs vLLM? Decide by team model and scale, not by hype."
          >
            2. Which orchestrator
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every option below runs the <em>same</em> vLLM engine; the choice is the control plane
            around it. The two axes that actually decide it are <strong>how your team
            operates</strong> (Python-native vs Kubernetes/operator) and <strong>scale</strong> (one
            replica, one model, one node → a multi-model fleet that autoscales and may
            disaggregate). Start at the cheapest box that meets your need and move right only when a
            concrete requirement forces it.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'option', header: 'Option', cell: (r) => <strong>{r.option}</strong>, minWidth: 170 },
              { id: 'fit', header: 'What it is / fits', cell: (r) => r.fit, minWidth: 220 },
              { id: 'team', header: 'Team model', cell: (r) => r.team, minWidth: 180 },
              { id: 'scale', header: 'Scale / multi-node', cell: (r) => r.scale, minWidth: 200 },
              { id: 'pick', header: 'Pick it when', cell: (r) => r.pick, minWidth: 220 },
            ]}
            items={orchRows}
          />
          <Alert type="info">
            <strong>Decision rule (guidance).</strong> Python team, one box → <code>vllm serve</code>.
            Python team scaling past one box without adopting K8s operators → <strong>Ray Serve LLM
            (§15)</strong>. Kubernetes team, one/few models, want the blessed simple path →{' '}
            <strong>production-stack (§16)</strong>. Kubernetes platform team running a multi-model
            fleet, or you need disaggregation-aware routing → <strong>llm-d / KServe / Gateway API
            Inference Extension (§17)</strong>. Disaggregation (§10) in particular needs a
            disagg-aware router, which pushes you toward the llm-d/Gateway tier.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two of these are already on. The rest are opt-in: turn each on only when a metric, not a hunch, demands it."
          >
            3. When to turn on the advanced levers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The single most common over-engineering pattern in vLLM deployments is enabling advanced
            levers speculatively. <strong>Prefix caching (§6) and chunked prefill (§4) are on by
            default</strong>; leave them on. The rest cost complexity and only pay off against a
            specific bottleneck. The right trigger for each is a number you are missing, not a feature
            you read about.
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
                still reserves KV blocks for all 30K positions. If you are hitting OOM or preemption,
                chunking will not save you; the memory knobs in §5 and §4 will.
              </Box>
              <Box variant="p">
                <strong>Disaggregated prefill/decode does not raise throughput.</strong> The vLLM
                docs state it outright:{' '}
                <em>&quot;Disaggregated prefill DOES NOT improve throughput&quot;</em>{' '}
                <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
                  [Tier-1: vLLM disaggregated-prefilling docs, accessed 2026-06-07]
                </Link>
                . It is a latency-isolation tool for strict, separate TTFT/ITL SLOs and adds a
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
            description="Choose parallelism by what does not fit, then by node count, then by architecture (MoE)."
          >
            4. Which parallelism (§9)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Parallelism is driven by a single forcing question: <strong>what does not
            fit?</strong> If a model plus its KV cache fits on one GPU, do not shard it at all;
            replicate it (DP) for throughput. When it does not fit, add tensor parallelism within a
            node first (NVLink is the cheapest fabric for TP&apos;s per-step all-reduce), then reach
            across nodes with pipeline parallelism, and use expert parallelism only for
            Mixture-of-Experts models.
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
            all-reduce stays on NVLink. <strong>MoE</strong> model → add <strong>EP</strong> to
            distribute experts. Multi-node TP/PP/EP all want a fast inter-node fabric: on AWS that
            is EFA (§22) with the nodes placed close together (§23).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Neuron vs GPU+EFA, single-node vs multi-node, and keeping nodes physically close."
          >
            5. Hardware &amp; instance choice on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The AWS hardware fork is <strong>Neuron (§21) vs GPU + EFA (§22)</strong>. Neuron
            (Inf2/Trn) is the price/token play when your model is on the Neuron-supported path; GPU
            instances give the widest model, kernel, and quantization coverage and the EFA fabric
            that multi-node serving and NIXL KV transfer ride on. Orthogonal to that: as soon as you
            go <strong>multi-node</strong> (cross-node TP/PP/EP) or <strong>disaggregate</strong>,
            placement stops being free: the nodes must be physically close (§23).
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
            For a single instance, intra-node GPU communication is handled by NVLink and placement is
            irrelevant. The moment you span nodes (multi-node TP/PP/EP, or a prefiller pool feeding a
            decoder pool over a KV connector), the inter-node hops become the bottleneck. Put those
            nodes in a <strong>cluster placement group</strong> so they share the same low-latency
            spine (§23). A disaggregated pair on opposite ends of a data center pays a KV-transfer tax
            that can exceed the prefill stall it was meant to remove (§10).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the engine before you tune it. KV cache is the real ceiling; defaults are starting points."
          >
            6. Sizing &amp; capacity
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sizing comes <strong>before</strong> any advanced lever. The ceiling on concurrency is
            not a config value: it is <strong>KV-cache capacity</strong>. After the model weights
            and activation workspace are placed, whatever GPU memory is left becomes the block pool,
            and that pool divided by the per-request KV footprint is your real batch-size ceiling.
            The knobs below shape that, but the budget is physics.
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
                The cache is laid out in fixed blocks. vLLM&apos;s <code>block_size</code> (&quot;Size
                of a contiguous cache block in number of tokens&quot;) defaults to{' '}
                <strong>16</strong>{' '}
                <Link external href="https://docs.vllm.ai/en/latest/api/vllm/config/cache.html">
                  [Tier-1: vLLM CacheConfig API reference, accessed 2026-06-07]
                </Link>
                . Smaller blocks waste less on the trailing partial block; larger blocks cut
                bookkeeping. The default is a deliberate middle; leave it unless profiling says
                otherwise (§5).
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
                  { id: 'start', header: 'Starting point', cell: (r) => r.start, minWidth: 200 },
                  { id: 'move', header: 'How to move it', cell: (r) => r.move, minWidth: 300 },
                ]}
                items={[
                  {
                    knob: <code>gpu_memory_utilization</code>,
                    start: (
                      <span>
                        default <strong>0.92</strong>{' '}
                        <Link external href="https://docs.vllm.ai/en/latest/api/vllm/config/cache.html">
                          [Tier-1, accessed 2026-06-07]
                        </Link>
                      </span>
                    ),
                    move: 'Raise toward ~0.95 to give the KV pool more room (first remedy for preemption). Lower if you share the GPU or hit OOM at startup: the pool is pre-allocated, so too high leaves no slack for activation spikes (§5).',
                  },
                  {
                    knob: <code>max_num_batched_tokens</code>,
                    start: (
                      <span>
                        throughput-bound: docs recommend <code>&gt; 8192</code>{' '}
                        <Link external href="https://docs.vllm.ai/en/stable/configuration/optimization.html">
                          [Tier-1, accessed 2026-06-07]
                        </Link>
                      </span>
                    ),
                    move: 'Higher → better TTFT + throughput (more prefill per step). Lower (e.g. 2048) → better ITL (fewer prefills stalling decodes) and relieves KV pressure. This is the master latency dial (§4).',
                  },
                  {
                    knob: <code>max_num_seqs</code>,
                    start: <span>tune from your KV budget (guidance)</span>,
                    move: 'Raise when you have spare KV cache and want more concurrent decodes/throughput. Lower when you see preemption/OOM: fewer concurrent sequences need less KV space (§4).',
                  },
                ]}
              />
              <Alert type="info">
                <strong>Order of operations (guidance).</strong> If you see preemption warnings or
                OOM: (1) raise <code>gpu_memory_utilization</code>; (2) lower{' '}
                <code>max_num_seqs</code> / <code>max_num_batched_tokens</code>; (3) increase{' '}
                <code>tensor_parallel_size</code> (or <code>pipeline_parallel_size</code>) so weights
                leave more room per GPU for KV; (4) quantize (§8). These are the same memory levers
                §4 and §5 describe; chunked prefill is <em>not</em> on this list because it does not
                change the KV footprint.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Putting it together: the one-page answer</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            <Badge color="green">1</Badge>{' '}
            <strong>Need control of the engine?</strong> No → Bedrock (§25). Yes → self-host vLLM.
          </Box>
          <Box variant="p">
            <Badge color="green">2</Badge>{' '}
            <strong>Orchestrator by team + scale:</strong> Python/one box → <code>vllm serve</code>;
            Python/scaling → Ray Serve LLM (§15); K8s/simple → production-stack (§16); K8s
            fleet/disagg → llm-d / Gateway API (§17).
          </Box>
          <Box variant="p">
            <Badge color="green">3</Badge>{' '}
            <strong>Parallelism by what does not fit:</strong> fits → DP replicas; not on one GPU →
            TP in-node; not on one node → PP cross-node; MoE → add EP (§9).
          </Box>
          <Box variant="p">
            <Badge color="green">4</Badge>{' '}
            <strong>Hardware:</strong> price/token on a supported model → Neuron (§21); broadest
            coverage + multi-node fabric → GPU + EFA (§22); multi-node/disagg → cluster placement
            group (§23).
          </Box>
          <Box variant="p">
            <Badge color="green">5</Badge>{' '}
            <strong>Size first:</strong> compute the KV budget; set{' '}
            <code>gpu_memory_utilization</code> (0.92 default),{' '}
            <code>max_num_batched_tokens</code> (&gt;8192 for throughput),{' '}
            <code>max_num_seqs</code> from the budget (§4 to §6).
          </Box>
          <Box variant="p">
            <Badge color="blue">6</Badge>{' '}
            <strong>Then levers, only on a missed metric:</strong> prefix caching + chunked prefill
            already on; quantize for memory/cost (§8); spec-decode for latency-bound low-concurrency
            (§11); disaggregate only for strict separate TTFT/ITL SLOs, <em>not</em> for throughput
            (§10); KV offload for cross-request reuse (§7).
          </Box>
          <Box variant="p">
            <Badge color="grey">7</Badge>{' '}
            <strong>Verify on your own traffic:</strong> benchmark before and after every change
            (§20), and design for the failure modes in §27. Defaults and benchmarks beat intuition.
          </Box>
        </SpaceBetween>
      </Container>

      <Box variant="small">
        Sources. <strong>Tier-1 (vLLM official docs):</strong>{' '}
        <Link external href="https://docs.vllm.ai/en/latest/api/vllm/config/cache.html">
          CacheConfig API reference
        </Link>{' '}
        (<code>block_size</code> default 16, <code>gpu_memory_utilization</code> default 0.92),{' '}
        <Link external href="https://docs.vllm.ai/en/stable/configuration/optimization.html">
          optimization &amp; tuning guide
        </Link>{' '}
        (the <code>max_num_batched_tokens &gt; 8192</code> throughput recommendation, the
        preemption remedies), and{' '}
        <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
          disaggregated prefilling
        </Link>{' '}
        (the &quot;does not improve throughput&quot; statement), all accessed 2026-06-07. Everything
        else in this section is <strong>synthesis / architectural guidance</strong> drawn from the
        preceding sections (cross-referenced inline by number) and is presented as a recommended
        decision order, not as a vendor guarantee. Always benchmark your own workload (§20) and
        validate against the docs at your pinned vLLM version.
      </Box>
    </SpaceBetween>
  );
}
