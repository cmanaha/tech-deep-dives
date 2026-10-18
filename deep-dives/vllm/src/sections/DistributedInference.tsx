import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';
const PARALLEL = 'vllm/config/parallel.py';
const ARGS = 'vllm/engine/arg_utils.py';
const VCFG = 'vllm/config/vllm.py';
const SCALING_MD = 'docs/serving/parallelism_scaling.md';
const SCALING = vllmDocsUrl('serving/parallelism_scaling/');
const DP_DOCS = vllmDocsUrl('serving/data_parallel_deployment/');
const EP_DOCS = vllmDocsUrl('serving/expert_parallel_deployment/');
const OPT_DOCS = vllmDocsUrl('configuration/optimization/');
const CP_DOCS = vllmDocsUrl('serving/context_parallel_deployment/');
const DBO_DOCS = vllmDocsUrl('design/dbo/');

interface AxisRow {
  axis: string;
  splits: string;
  flag: string;
  comms: string;
  reach: string;
}

const axisRows: AxisRow[] = [
  {
    axis: 'Tensor parallelism (TP)',
    splits: 'Each weight matrix is sharded across GPUs, so every GPU holds a slice of every layer.',
    flag: '--tensor-parallel-size, -tp',
    comms: 'All-reduce on every layer (twice per transformer block).',
    reach: 'Within one node, over the fast intra-node fabric.',
  },
  {
    axis: 'Pipeline parallelism (PP)',
    splits: 'Layers are split into contiguous stages; each GPU or node holds whole layers.',
    flag: '--pipeline-parallel-size, -pp',
    comms: 'Point-to-point activation hand-off between adjacent stages. Low volume, paid for in latency.',
    reach: 'Across nodes, where the inter-node link is the bottleneck.',
  },
  {
    axis: 'Data parallelism (DP)',
    splits: 'Full (or TP/PP-sharded) model replicas, each serving an independent slice of the request stream.',
    flag: '--data-parallel-size, -dp',
    comms: 'None for dense models; for MoE, DP ranks synchronize every forward pass.',
    reach: 'Anywhere. Replicas need no fast interconnect between them unless MoE couples them.',
  },
  {
    axis: 'Expert parallelism (EP)',
    splits: 'MoE experts are distributed across GPUs, so each rank owns a subset of the experts.',
    flag: '--enable-expert-parallel, -ep',
    comms: 'All-to-all dispatch and combine, routing each token to the GPU that owns its expert. The kernel is set by --all2all-backend.',
    reach: 'Within and across nodes; at scale the all-to-all is the cost dual-batch overlap exists to hide.',
  },
  {
    axis: 'Prefill context parallelism (PCP)',
    splits: 'One long prompt is cut into chunks, and each rank runs the prefill for its chunk.',
    flag: '--prefill-context-parallel-size, -pcp',
    comms: 'Key/value tensors gathered across ranks, or passed rank to rank for very long prompts.',
    reach: 'Adds GPUs: a grid axis between PP and TP. Model Runner V2 only.',
  },
  {
    axis: 'Decode context parallelism (DCP)',
    splits: 'The KV cache, along the token dimension, across ranks that TP already holds.',
    flag: '--decode-context-parallel-size, -dcp',
    comms: 'Partial attention results combined across the DCP ranks at every decode step.',
    reach: 'Adds no GPUs: it re-slices the TP ranks, so it lives wherever TP does.',
  },
];

interface ModeRow {
  mode: string;
  on: ReactNode;
  endpoints: ReactNode;
  when: ReactNode;
}

const dpModeRows: ModeRow[] = [
  {
    mode: 'Internal load balancing',
    on: (
      <>
        <code>--data-parallel-size</code> alone
      </>
    ),
    endpoints: 'One for the whole deployment. API server processes default to the DP size.',
    when: 'You want one endpoint and vLLM spreading requests across ranks.',
  },
  {
    mode: 'Hybrid load balancing',
    on: (
      <>
        <code>--data-parallel-hybrid-lb</code> (or <code>--data-parallel-start-rank</code>) with{' '}
        <code>--data-parallel-size-local</code>
      </>
    ),
    endpoints: 'One per node, queuing only to that node\'s ranks. API servers default to the local DP size.',
    when: 'Many nodes behind an upstream balancer; scheduling stays local to each node.',
  },
  {
    mode: 'External load balancing',
    on: (
      <>
        <code>--data-parallel-external-lb</code> or <code>--data-parallel-rank</code>, one{' '}
        <code>vllm serve</code> per rank
      </>
    ),
    endpoints: 'One per rank.',
    when: 'Your router balances using per-rank telemetry. MoE models only.',
  },
  {
    mode: 'Multi-port external load balancing',
    on: (
      <>
        <code>--data-parallel-multi-port-external-lb</code> with{' '}
        <code>--data-parallel-size-local</code> of 2 or more
      </>
    ),
    endpoints: (
      <>
        One per rank, on <code>--port</code> plus the local rank, and an aggregated{' '}
        <code>/health</code> on <code>--data-parallel-supervisor-port</code> (default 9256).
      </>
    ),
    when: 'External balancing with one vllm serve per node: a supervisor launches one external-mode server per local rank.',
  },
];

interface DecisionRow {
  symptom: string;
  reach: string;
  why: string;
}

const decisionRows: DecisionRow[] = [
  {
    symptom: 'Model fits on one GPU.',
    reach: 'None; single GPU. Scale out with DP replicas only if you need more throughput.',
    why: 'The guide is explicit: "if the model fits on a single GPU, distributed inference is probably unnecessary." Adding parallelism only buys collective overhead.',
  },
  {
    symptom: 'Model too large for one GPU, fits in one node.',
    reach: 'Tensor parallelism (TP) up to the GPU count of the node.',
    why: '"if the model is too large for a single GPU but fits on a single node with multiple GPUs, use tensor parallelism." TP keeps the per-layer all-reduce on the fast intra-node fabric.',
  },
  {
    symptom: 'GPU count does not evenly divide the model.',
    reach: 'Pipeline parallelism (PP), alone or stacked on TP.',
    why: '"enable pipeline parallelism, which splits the model along layers and supports uneven splits." TP requires the shard dimension to divide evenly; PP does not.',
  },
  {
    symptom: 'Model too large for one node.',
    reach: 'TP within each node + PP across nodes, launched with --nnodes or on a Ray cluster with --distributed-executor-backend ray.',
    why: '"if the model is too large for a single node, combine tensor parallelism with pipeline parallelism." Set TP = GPUs per node, PP = number of nodes.',
  },
  {
    symptom: 'KV cache is the bottleneck (frequent preemption, low concurrency).',
    reach: 'Raise tensor-parallel-size (or pipeline-parallel-size) to free per-GPU memory.',
    why: 'Higher TP gives "each GPU ... more memory available for KV cache"; higher PP reduces per-GPU weight memory, "indirectly leaving more memory available for KV cache." Both trade memory for collective or latency overhead.',
  },
  {
    symptom: 'MLA or few-KV-head model at high TP, and KV capacity is short.',
    reach: 'Decode context parallelism (DCP): add -dcp, up to TP / KV heads.',
    why: 'TP past the KV-head count duplicates the KV cache: DeepSeek-R1 under MLA at -tp 8 holds 8x duplicated KV, and -dcp 8 removes it without adding GPUs.',
  },
  {
    symptom: 'Long prompts push time to first token past its target.',
    reach: 'Prefill context parallelism (PCP): add -pcp. Model Runner V2 only.',
    why: 'PCP gives each rank one chunk of the prefill to control time to first token. It adds GPUs, and the guide lists both of its strategies as under active development.',
  },
  {
    symptom: 'Engine is saturated but each replica fits; you need more queries per second.',
    reach: 'Data parallelism (DP): add replicas, and pick a deployment mode.',
    why: 'DP multiplies throughput by running independent replicas behind one endpoint, one per node, or one per rank behind your own balancer.',
  },
  {
    symptom: 'Large MoE model (DeepSeek-class) at scale.',
    reach: 'DP attention + EP (or TP) for the expert layers; --enable-eplb once expert load skews.',
    why: 'For MoE "it can be advantageous to use data parallel for the attention layers and expert or tensor parallel (EP or TP) for the expert layers." EP shards the experts so aggregate expert capacity grows with the cluster.',
  },
];

function TpPpLayoutDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 340"
        role="img"
        aria-labelledby="distinf-tppp-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="distinf-tppp-title">
          One data-parallel replica spread over two nodes of four GPUs: tensor parallelism shards
          every layer across the four GPUs inside a node and all-reduces over the fast intra-node
          fabric, pipeline parallelism gives each node half the layers and hands activations across
          the slower inter-node link, and data parallelism replicates the whole two-node unit for
          throughput.
        </title>
        <style>
          {`
            .dtp-title { font: 700 14px sans-serif; fill: #16191f; }
            .dtp-lbl { font: 600 13px sans-serif; fill: #16191f; }
            .dtp-sub { font: 400 11px sans-serif; fill: #414d5c; }
            .dtp-gpu { fill: #f2f8fd; stroke: #539fe5; stroke-width: 1.5; }
            .dtp-node { fill: none; stroke: #7d8998; stroke-width: 1.5; stroke-dasharray: 5 4; }
            .dtp-tp { stroke: #1d8102; stroke-width: 2; fill: none; }
            .dtp-pp { stroke: #bf4f1f; stroke-width: 2; fill: none; }
            .dtp-tag { font: 700 11px sans-serif; }
          `}
        </style>
        <defs>
          <marker id="dtp-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#bf4f1f" />
          </marker>
        </defs>
        <rect x={0} y={0} width={760} height={340} rx={8} fill="#ffffff" />

        <text x={12} y={24} className="dtp-title">
          One data-parallel replica: TP=4 within a node, PP=2 across nodes
        </text>

        {/* Node 0 (pipeline stage 0) */}
        <rect x={20} y={44} width={330} height={150} rx={10} className="dtp-node" />
        <text x={32} y={66} className="dtp-lbl">
          Node 0: PP stage 0 (layers 0 to N/2)
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={`n0-${i}`}>
            <rect x={36 + i * 76} y={84} width={70} height={56} rx={6} className="dtp-gpu" />
            <text x={71 + i * 76} y={108} textAnchor="middle" className="dtp-sub">
              GPU {i}
            </text>
            <text x={71 + i * 76} y={124} textAnchor="middle" className="dtp-sub">
              weight slice
            </text>
          </g>
        ))}
        <line x1={71} y1={158} x2={299} y2={158} className="dtp-tp" />
        <text x={185} y={180} textAnchor="middle" className="dtp-tag" fill="#1d8102">
          TP all-reduce every layer: intra-node fabric
        </text>

        {/* Node 1 (pipeline stage 1) */}
        <rect x={410} y={44} width={330} height={150} rx={10} className="dtp-node" />
        <text x={422} y={66} className="dtp-lbl">
          Node 1: PP stage 1 (layers N/2 to N)
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={`n1-${i}`}>
            <rect x={426 + i * 76} y={84} width={70} height={56} rx={6} className="dtp-gpu" />
            <text x={461 + i * 76} y={108} textAnchor="middle" className="dtp-sub">
              GPU {i}
            </text>
            <text x={461 + i * 76} y={124} textAnchor="middle" className="dtp-sub">
              weight slice
            </text>
          </g>
        ))}
        <line x1={461} y1={158} x2={689} y2={158} className="dtp-tp" />
        <text x={575} y={180} textAnchor="middle" className="dtp-tag" fill="#1d8102">
          TP all-reduce every layer: intra-node fabric
        </text>

        {/* PP activation hand-off across nodes */}
        <line x1={350} y1={112} x2={408} y2={112} className="dtp-pp" markerEnd="url(#dtp-ah)" />
        <text x={380} y={104} textAnchor="middle" className="dtp-tag" fill="#bf4f1f">
          PP
        </text>
        <text x={380} y={216} textAnchor="middle" className="dtp-sub">
          Pipeline hand-off: activations only, at the stage boundary, over the inter-node link
        </text>

        {/* DP replication */}
        <rect x={20} y={234} width={720} height={58} rx={10} className="dtp-node" />
        <text x={380} y={259} textAnchor="middle" className="dtp-lbl">
          Data parallelism: replicate this entire 2-node unit for throughput
        </text>
        <text x={380} y={278} textAnchor="middle" className="dtp-sub">
          Replica 1, Replica 2, ... Replica D, each serving an independent slice of the request stream
        </text>

        <text x={380} y={320} textAnchor="middle" className="dtp-sub">
          Fast link: TP all-reduce. Slow link: PP hand-offs and DP replicas.
        </text>
      </svg>
    </div>
  );
}

export function DistributedInference() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Six parallelism axes for spreading one model, or many copies of it, across GPUs and nodes: which symptom calls for which, the flag that turns each on, and how a multi-node launch runs without Ray (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            9. Distributed Inference
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The decision you are making:</strong> distributed inference is a choice among
            four axes that split the model or the traffic, plus two that split a single long
            sequence. <strong>Tensor</strong> and <strong>pipeline</strong> parallelism exist
            because a model is <em>too big to fit</em>; <strong>data</strong> parallelism exists
            because you need <em>more throughput</em>; <strong>expert</strong> parallelism exists
            because Mixture-of-Experts (MoE) models have a different shape. The two
            context-parallel axes exist because <em>one sequence is too long</em>: prefill context
            parallelism (PCP) spreads a long prompt&apos;s prefill across GPUs, and decode context
            parallelism (DCP) spreads its key-value (KV) cache. You compose them, and where the
            network is fast or slow dictates the composition.
          </Box>
          <Box variant="p">
            <strong>The first rule is restraint.</strong> The vLLM parallelism guide opens with it:
            "if the model fits on a single GPU, distributed inference is probably unnecessary."
            Every axis you add buys a collective operation you did not have before. Reach for the
            minimum parallelism that makes the model fit and the throughput land.{' '}
            <Cite tier={1} href={SCALING}>
              vLLM docs: Parallelism and Scaling
            </Cite>
          </Box>
          <Alert type="info">
            This section is the sizing map: what each axis is, when to reach for it, and which flag
            turns it on. The code behind it (the rank grid, the <code>GroupCoordinator</code> that
            owns each process group, the all-reduce backend chain and the executor classes) is in
            the <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong> tab. How
            fast each link is, and why an all-reduce wants NVLink while an all-to-all stresses the
            scale-out network, belongs to the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive; how that scale-out network behaves on AWS belongs to the{' '}
            <Link external href="../efa/">
              EFA (Elastic Fabric Adapter)
            </Link>{' '}
            deep dive.
          </Alert>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href={TREE}>
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            : <code>vllm/config/parallel.py</code>, <code>vllm/engine/arg_utils.py</code>,{' '}
            <code>vllm/v1/executor/</code> and the parallelism, data-parallel, expert-parallel and
            context-parallel deployment guides.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each axis splits, the flag that turns it on, and how often it talks on the network, which decides where in the topology it can live"
          >
            The six axes at a glance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The axes differ along one dimension that matters more than any other:{' '}
            <strong>how often, and how loudly, they talk on the network.</strong> Tensor
            parallelism communicates on every layer; pipeline parallelism only at stage boundaries;
            data parallelism (for dense models) not at all; expert parallelism in an all-to-all per
            MoE layer. Decode context parallelism adds attention traffic on the tensor-parallel
            ranks it reuses. That communication profile is what pins each axis to a part of the
            topology.
          </Box>
          <Table
            items={axisRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'axis',
                header: 'Axis',
                cell: (r) => <strong>{r.axis}</strong>,
                minWidth: 170,
              },
              { id: 'splits', header: 'What it splits', cell: (r) => r.splits, minWidth: 240 },
              {
                id: 'flag',
                header: 'Flag',
                cell: (r) => <code>{r.flag}</code>,
                minWidth: 170,
              },
              { id: 'comms', header: 'Communication', cell: (r) => r.comms, minWidth: 260 },
              { id: 'reach', header: 'Where it lives', cell: (r) => r.reach, minWidth: 200 },
            ]}
          />
          <Box variant="small">
            Flags:{' '}
            <Cite tier={1} href={vllmUrl(ARGS, 'L1108-L1184')}>
              arg_utils.py L1108-L1184
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(ARGS, 'L1245-L1260')}>
              arg_utils.py L1245-L1260
            </Cite>
            . The TP and PP reasoning is from{' '}
            <Cite tier={1} href={SCALING}>
              vLLM docs: Parallelism and Scaling
            </Cite>
            , the DP and EP composition from{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={EP_DOCS}>
              vLLM docs: Expert Parallel Deployment
            </Cite>
            , and the PCP and DCP rows from{' '}
            <Cite tier={1} href={CP_DOCS}>
              vLLM docs: Context Parallel Deployment
            </Cite>
            . Both context-parallel sizes default to 1{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L131-L133')}>
              config/parallel.py L131
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L359-L362')}>
              L359
            </Cite>
            ; DCP communication{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L371-L379')}>
              config/parallel.py L371-L379
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which axis goes on the fast link and which on the slow one, drawn for one two-node replica"
          >
            How the axes lay over the hardware
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The canonical multi-node layout: <strong>tensor parallelism inside each node</strong>{' '}
            (where the GPU-to-GPU fabric is fast enough for a per-layer all-reduce),{' '}
            <strong>pipeline parallelism across nodes</strong> (where the slower inter-node link
            only carries activations at stage boundaries), and{' '}
            <strong>data parallelism over the top</strong> when you replicate the whole thing for
            throughput. The diagram shows one DP replica spanning two nodes: TP=4 within each
            node, PP=2 across them.
          </Box>
          <TpPpLayoutDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative layout, not measured. The composition rule, "Set{' '}
            <code>tensor_parallel_size</code> to the number of GPUs per node and{' '}
            <code>pipeline_parallel_size</code> to the number of nodes," is from{' '}
            <Cite tier={1} href={SCALING}>
              vLLM docs: Parallelism and Scaling
            </Cite>
            . In vLLM&apos;s rank grid the TP ranks are adjacent and PCP sits between PP and TP{' '}
            <Cite tier={1} href={vllmUrl('vllm/distributed/parallel_state.py', 'L2045-L2060')}>
              parallel_state.py L2045-L2060
            </Cite>
            ; DCP adds no ranks and re-slices the TP ranks drawn here. Why the all-reduce wants the
            fast fabric is covered in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which of the two fit-the-model axes to reach for, what each costs in synchronization or latency, and which TP options change the runner you get"
          >
            Tensor vs pipeline: too big, two ways
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both TP and PP exist to make a model that does not fit on one GPU fit across several.
            They differ in <em>what</em> they cut and <em>what that costs you</em>.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Tensor parallelism (shard within a layer)</Box>
              <Box variant="p">
                Reach for TP first when "the model is too large to fit on a single GPU" and the
                GPUs sit in one node. Each weight matrix is split across GPUs, so every GPU does a
                fraction of every layer&apos;s math, then the ranks{' '}
                <strong>all-reduce on each layer</strong> to recombine. That collective is frequent
                and latency-sensitive, which is why TP belongs on the fast intra-node fabric and
                why the docs warn that raising it "may cause excessive synchronization overhead."
                A useful side effect: higher TP gives "each GPU ... more memory available for KV
                cache," so TP is also a lever when KV cache, not weights, is your bottleneck.{' '}
                <Cite tier={1} href={OPT_DOCS}>
                  vLLM docs: Optimization and Tuning
                </Cite>
              </Box>
              <Box variant="p">
                On CUDA the TP all-reduce runs FlashInfer&apos;s kernel by default (
                <code>VLLM_ALLREDUCE_USE_FLASHINFER=1</code>), with vLLM&apos;s custom all-reduce,
                PyTorch symmetric memory and NCCL (NVIDIA Collective Communications Library) behind
                it for tensors FlashInfer declines{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1914-L1917')} kind="code">
                  envs.py L1914-L1917
                </Cite>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/distributed/device_communicators/cuda_communicator.py', 'L335-L408')}
                >
                  cuda_communicator.py L335-L408
                </Cite>
                . The startup line <code>Using [...] all-reduce backends</code> names the set your
                deployment runs.
              </Box>
              <Box variant="p">
                Sequence parallelism is an opt-in compile pass (<code>pass_config.enable_sp</code>{' '}
                in <code>--compilation-config</code>, off by default) that rewrites each all-reduce
                followed by RMSNorm (root mean square normalization) into a reduce-scatter, a local
                RMSNorm and an all-gather{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/compilation/passes/fusion/sequence_parallelism.py', 'L497-L507')}
                >
                  sequence_parallelism.py L497-L507
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L147-L153')} kind="code">
                  config/vllm.py L147-L153
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L254-L331')} kind="code">
                  L254-L331
                </Cite>
                . With TP &gt; 1 it is a feature Model Runner V2 lacks, so turning it on falls back
                to the deprecated V1 model runner{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L3059-L3063')} kind="code">
                  config/vllm.py L3059-L3063
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L752-L758')} kind="code">
                  L752-L758
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Pipeline parallelism (split the layers)</Box>
              <Box variant="p">
                Reach for PP "when you&apos;ve already maxed out efficient tensor parallelism but
                need to distribute the model further, or across nodes," or "for very deep and
                narrow models where layer distribution is more efficient than tensor sharding." PP
                assigns whole contiguous layers to each stage and only hands activations across
                stage boundaries (cheap traffic), which is why PP is the axis you stretch{' '}
                <strong>across nodes</strong>. Two practical edges: it "supports uneven splits"
                (use it when your GPU count does not evenly divide the model), and raising it "may
                cause latency penalties." It also reduces per-GPU weight memory, "indirectly
                leaving more memory available for KV cache."{' '}
                <Cite tier={1} href={OPT_DOCS}>
                  vLLM docs: Optimization and Tuning
                </Cite>{' '}
                <Cite tier={1} href={SCALING}>
                  vLLM docs: Parallelism and Scaling
                </Cite>{' '}
                vLLM keeps a batch in flight for every stage to fill the pipeline{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L592-L602')} kind="code">
                  config/vllm.py L592-L602
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When the sequence, not the model, is what outgrows a GPU: the flag that removes the KV copies high TP leaves on few-KV-head models, and the one that cuts a long prefill"
          >
            Context parallelism: one long sequence across several GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Context parallelism splits one request&apos;s tokens instead of the model&apos;s
            weights. Prefill and decode stress different resources, so vLLM splits them
            separately: a long prefill needs its compute spread to hold time to first token (TTFT)
            down, and a long decode needs KV cache space to keep the batch large.{' '}
            <Cite tier={1} href={CP_DOCS}>
              vLLM docs: Context Parallel Deployment
            </Cite>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">DCP (-dcp): remove duplicated KV cache</Box>
              <Box variant="p">
                TP shards the KV cache along its KV-head dimension, so once TP exceeds the
                model&apos;s KV-head count every extra rank holds a copy. DeepSeek-R1 under MLA
                (Multi-head Latent Attention) has one KV head, so the usual single-node{' '}
                <code>-tp 8</code> keeps <strong>8x duplicated KV cache</strong>; adding{' '}
                <code>-dcp 8</code> shards it along the token dimension instead, without launching
                more GPUs{' '}
                <Cite tier={1} href={CP_DOCS}>
                  vLLM docs: Context Parallel Deployment
                </Cite>
                . DCP size must divide TP{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L564-L570')}>
                  config/parallel.py L564-L570
                </Cite>
                , and for a grouped-query attention (GQA) model it needs TP above the KV-head count
                and caps at TP / KV heads{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L1523-L1543')}>
                  config/model.py L1523-L1543
                </Cite>
                . Larger DCP removes more duplication and costs more communication; the guide&apos;s
                order is to raise <code>-tp</code> until performance is acceptable, then add{' '}
                <code>-dcp</code>{' '}
                <Cite tier={1} href={CP_DOCS}>
                  vLLM docs: Context Parallel Deployment
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">PCP (-pcp): cut a long prefill</Box>
              <Box variant="p">
                PCP splits a long prompt into chunks and gives each rank one chunk of the prefill,
                which spreads the compute that sets TTFT. It adds GPUs: the world size is PP x TP x
                PCP{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L899-L903')}>
                  config/parallel.py L899-L903
                </Cite>
                . It runs only on Model Runner V2{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L3108-L3110')} kind="code">
                  config/vllm.py L3108-L3110
                </Cite>
                , combines with data parallelism from v0.31.0{' '}
                <Cite tier={1} href={`${RELEASE_NOTES}v0.31.0`}>
                  vLLM v0.31.0 release notes
                </Cite>
                , and the guide describes both of its strategies (gather the key/value tensors, or
                pass them rank to rank for very long prompts) as under active development{' '}
                <Cite tier={1} href={CP_DOCS}>
                  vLLM docs: Context Parallel Deployment
                </Cite>
                . With PCP on, DCP must be 1, equal to PCP, or span TP x PCP{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L571-L577')}>
                  config/parallel.py L571-L577
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to multiply throughput with replicas, and how MoE models pair data-parallel attention with sharded experts"
          >
            Data &amp; expert parallelism: throughput, and the MoE shape
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TP and PP make a model fit; <strong>data parallelism</strong> makes it serve more. DP
            runs independent replicas of the model (each replica may itself be TP/PP-sharded) and
            spreads the request stream across them. The docs note it "can be configured by simply
            including e.g. <code>--data-parallel-size=4</code> in the vllm serve command line
            arguments." How the replicas are fronted is a choice of four deployment modes, below.{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>
          </Box>
          <Box variant="p">
            <strong>Expert parallelism is the MoE-specific axis.</strong> A Mixture-of-Experts layer
            has many experts but routes each token to only a few, so the experts are the place to
            shard: <code>--enable-expert-parallel</code> distributes the experts across GPUs, and
            tokens are routed by an all-to-all to whichever GPU owns their chosen expert. Without
            it, the expert layers of a DP deployment form a tensor-parallel group of size DP x TP.
            The shape that pairs with EP is data-parallel attention: for MoE models "it can be
            advantageous to use data parallel for the attention layers and expert or tensor
            parallel (EP or TP) for the expert layers." The two are coupled by design ("EP is more
            efficient when used in conjunction with DP"), and EP size follows{' '}
            <code>EP_SIZE = TP_SIZE &times; DP_SIZE</code>, times PCP when prefill context
            parallelism is on{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L134-L136')}>
              config/parallel.py L134-L136
            </Cite>
            . Because they run together, "expert layers across all ranks are required to
            synchronize during every forward pass."{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>{' '}
            <Cite tier={1} href={EP_DOCS}>
              vLLM docs: Expert Parallel Deployment
            </Cite>
          </Box>
          <Alert type="info">
            <strong>Scaling MoE wide.</strong> At large EP counts, uneven token routing leaves some
            experts hot and others idle. The Expert Parallel Load Balancer (EPLB),{' '}
            <code>--enable-eplb</code>, exists to "redistribute expert mappings across EP ranks,
            evening the load across experts"; its redundant experts take GPU memory the KV cache
            could have used, about 2.4 GB per redundant expert per EP rank on DeepSeekV3{' '}
            <Cite tier={1} href={EP_DOCS}>
              vLLM docs: Expert Parallel Deployment
            </Cite>
            . EPLB is off by default and requires <code>--enable-expert-parallel</code> plus TP,
            PCP or DP &gt; 1{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L533-L555')}>
              config/parallel.py L533-L555
            </Cite>
            . The token all-to-all is a separate knob: <code>--all2all-backend</code>, default{' '}
            <code>allgather_reducescatter</code>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L202-L213')}>
              config/parallel.py L202-L213
            </Cite>
            . Rebalancing modes, weight-move communicators and elastic EP are in the Distributed
            &amp; KV Transfer tab.
          </Alert>
          <ExpandableSection headerText="EP communication: all-to-all backends and dual-batch overlap">
            <SpaceBetween size="s">
              <Box variant="p">
                The deployment guide&apos;s selection table covers five values:{' '}
                <code>allgather_reducescatter</code> for general use,{' '}
                <code>deepep_high_throughput</code> for prefill-dominated and{' '}
                <code>deepep_low_latency</code> for decode-dominated multi-node work, and two
                FlashInfer strategies for systems with NVLink across nodes. The DeepEP kernels are
                tuned for disaggregated serving and "may show poor performance for mixed
                workloads."{' '}
                <Cite tier={1} href={EP_DOCS}>
                  vLLM docs: Expert Parallel Deployment
                </Cite>
              </Box>
              <Box variant="p">
                The code accepts more: <code>deepep_v2</code> (needs NCCL 2.30.4 or later{' '}
                <Cite tier={1} href={EP_DOCS}>
                  vLLM docs: Expert Parallel Deployment
                </Cite>
                ),{' '}
                <code>mori_high_throughput</code> and <code>mori_low_latency</code> (the ROCm MoRI
                kernels),{' '}
                <code>moonep</code> and <code>nixl_ep</code>{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L44-L58')}>
                  config/parallel.py L44-L58
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/device_communicators/all2all.py', 'L917-L927')}>
                  all2all.py L917-L927
                </Cite>
                . Two names in the type map to the default: <code>naive</code> and{' '}
                <code>pplx</code> log a removal warning and run <code>allgather_reducescatter</code>{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L507-L513')} kind="code">
                  config/parallel.py L507-L513
                </Cite>
                .
              </Box>
              <Box variant="p">
                Dual-batch overlap (DBO, <code>--enable-dbo</code>) splits each batch into two
                micro-batches so one computes while the other waits on the all-to-all, and needs DP
                &gt; 1 with <code>--enable-expert-parallel</code>{' '}
                <Cite tier={1} href={DBO_DOCS}>
                  vLLM docs: Dual Batch Overlap
                </Cite>
                . Unless <code>VLLM_USE_V2_MODEL_RUNNER</code> is set, turning it on falls back to
                the deprecated V1 model runner{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L3094-L3095')} kind="code">
                  config/vllm.py L3094-L3095
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(VCFG, 'L3235-L3246')} kind="code">
                  L3235-L3246
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
            description="Whether your DP ranks sit behind one endpoint, one per node or one per rank, which modes a dense model can use, and which limits count per rank"
          >
            Data-parallel deployment modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            DP ranks can sit behind vLLM&apos;s own balancer or behind yours.{' '}
            <code>vllm serve</code> reads one of four modes from the flags and refuses to combine
            them{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L77-L127')} kind="code">
              cli/serve.py L77-L127
            </Cite>
            .
          </Box>
          <Table
            items={dpModeRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'mode', header: 'Mode', cell: (r) => <strong>{r.mode}</strong>, minWidth: 150 },
              { id: 'on', header: 'Turn it on with', cell: (r) => r.on, minWidth: 220 },
              { id: 'endpoints', header: 'Endpoints', cell: (r) => r.endpoints, minWidth: 220 },
              { id: 'when', header: 'Reach for it when', cell: (r) => r.when, minWidth: 220 },
            ]}
          />
          <Box variant="small">
            Modes:{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>
            ; the multi-port supervisor, its requirements and its port{' '}
            <Cite tier={1} href={vllmUrl(ARGS, 'L1236-L1244')}>
              arg_utils.py L1236-L1244
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/dp_supervisor.py', 'L52-L134')}>
              dp_supervisor.py L52-L134
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/cli_args.py', 'L284-L286')}>
              launchers/cli_args.py L284-L286
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Dense models use independent instances.</strong> A non-MoE model started with
            external DP flags is rejected at startup, and the error says to launch independent vLLM
            instances without <code>--data-parallel-*</code> flags{' '}
            <Cite tier={1} href={vllmUrl(ARGS, 'L2350-L2358')} kind="code">
              arg_utils.py L2350-L2358
            </Cite>
            . Each server of a dense model is already fully independent, so a balancer in front of
            plain instances is the external mode for a dense model{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Count the limits per rank or per server.</strong> <code>--max-num-seqs</code>{' '}
            applies per DP rank, while the admission-control limits{' '}
            <code>--max-num-queued-reqs</code> and <code>--max-num-queued-tokens</code> apply to
            the whole server. With <code>--data-parallel-size=4 --max-num-seqs=256
            --max-num-queued-reqs=256</code>, the deployment rejects new requests once 256 are in
            flight in total, even though the ranks could jointly run 1024{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>
            ; the rejection is an HTTP 503{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L93-L109')}>
              config/scheduler.py L93-L109
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Fault tolerance is an external-mode feature.</strong>{' '}
            <code>--enable-fault-tolerance</code> (off by default) targets DP+EP deployments with an
            external balancer{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.27.0`}>
              vLLM v0.27.0 release notes
            </Cite>
            : it requires external load-balancing mode (<code>--data-parallel-external-lb</code> or{' '}
            <code>--data-parallel-rank</code>) and a single API server process{' '}
            <Cite tier={1} href={vllmUrl(ARGS, 'L2344-L2349')} kind="code">
              arg_utils.py L2344-L2349
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L500-L505')} kind="code">
              config/parallel.py L500-L505
            </Cite>
            , adds <code>/fault_tolerance/apply</code> and <code>/fault_tolerance/status</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/fault_tolerance/api_router.py', 'L35-L93')}>
              fault_tolerance/api_router.py L35-L93
            </Cite>
            , and waits <code>engine_recovery_timeout_sec</code> (default 120 seconds) for recovery
            instructions before raising the original error{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/fault_tolerance.py', 'L12-L18')}>
              config/fault_tolerance.py L12-L18
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which runtime spawns the workers when a model spans nodes, and the flags that run a multi-node launch without Ray"
          >
            Who launches the workers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Parallelism describes <em>how the model is split</em>; the{' '}
            <strong>executor backend</strong> decides <em>which runtime spawns and coordinates
            the worker processes</em>. On CUDA, leave <code>--distributed-executor-backend</code>{' '}
            unset and vLLM picks <code>mp</code> (Python multiprocessing), including for a run that
            spans nodes with <code>--nnodes</code>. It switches to <code>ray</code> only when{' '}
            <code>--data-parallel-backend ray</code> is set or the process already runs inside a
            Ray placement group, and uses <code>uni</code> for a single GPU{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L989-L1034')} kind="code">
              config/parallel.py L989-L1034
            </Cite>
            . A world larger than the node&apos;s GPU count without <code>--nnodes</code> stops at
            startup, and the error names both fixes: <code>--nnodes</code> for <code>mp</code>, or{' '}
            <code>--distributed-executor-backend ray</code>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L1001-L1012')} kind="code">
              config/parallel.py L1001-L1012
            </Cite>
            .
          </Box>
          <Alert type="info" header="The parallelism guide and the code disagree on the multi-node default">
            The parallelism guide says "The default distributed runtimes are Ray for multi-node
            inference and native Python <code>multiprocessing</code> for single-node inference"{' '}
            <Cite tier={1} href={vllmUrl(SCALING_MD, 'L33')} kind="doc-code-conflict">
              vLLM docs, Parallelism and Scaling: parallelism_scaling.md L33
            </Cite>
            . The selection code picks <code>mp</code> for a CUDA run with <code>--nnodes</code>{' '}
            &gt; 1 and never auto-selects Ray for a world that outgrows one node{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L999-L1012')} kind="code">
              config/parallel.py L999-L1012
            </Cite>
            . The code is what runs: Ray is a choice you make explicitly.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Multiprocessing (mp): one node or many</Box>
              <Box variant="p">
                One worker process per local rank, with no cluster scheduler and no extra moving
                parts. On a single node there is nothing to add. Across nodes, run{' '}
                <code>vllm serve</code> on every node with the same <code>--nnodes</code> and{' '}
                <code>--master-addr</code>, a distinct <code>--node-rank</code>, and{' '}
                <code>--headless</code> on the non-head nodes{' '}
                <Cite tier={1} href={vllmUrl(SCALING_MD, 'L139-L160')}>
                  parallelism_scaling.md L139-L160
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Ray: when you ask for it</Box>
              <Box variant="p">
                Start a Ray cluster, then run one <code>vllm serve</code> with{' '}
                <code>--distributed-executor-backend ray</code> on one node: every GPU in the
                cluster is visible to it{' '}
                <Cite tier={1} href={vllmUrl(SCALING_MD, 'L120-L128')}>
                  parallelism_scaling.md L120-L128
                </Cite>
                . Cluster bring-up and Ray Serve LLM are section 15, Orchestration: Ray &amp; Ray
                Serve LLM; the executor classes are in the Distributed &amp; KV Transfer tab.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match what hurts to the axis and flag to try first, from a model that fits on one GPU to MoE at cluster scale"
          >
            Decision table: symptom &rarr; which parallelism
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start from what hurts. Read top to bottom; the first row that matches your symptom is
            usually the right reach.
          </Box>
          <Table
            items={decisionRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'symptom',
                header: 'Symptom',
                cell: (r) => <strong>{r.symptom}</strong>,
                minWidth: 220,
              },
              { id: 'reach', header: 'Reach for', cell: (r) => r.reach, minWidth: 240 },
              { id: 'why', header: 'Why / source', cell: (r) => r.why, minWidth: 300 },
            ]}
          />
          <Box variant="small">
            Symptom-to-axis reasoning:{' '}
            <Cite tier={1} href={SCALING}>
              vLLM docs: Parallelism and Scaling
            </Cite>{' '}
            <Cite tier={1} href={OPT_DOCS}>
              vLLM docs: Optimization and Tuning
            </Cite>{' '}
            <Cite tier={1} href={DP_DOCS}>
              vLLM docs: Data Parallel Deployment
            </Cite>{' '}
            <Cite tier={1} href={CP_DOCS}>
              vLLM docs: Context Parallel Deployment
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Worked example: a 2-node, TP=8 + PP=2 launch">
            <SpaceBetween size="s">
              <Box variant="p">
                The guide&apos;s own multi-node example is the clearest illustration of the
                composition rule: two nodes, eight GPUs each, a model too large for one node. Set{' '}
                <code>tensor_parallel_size=8</code> (the GPUs per node) and{' '}
                <code>pipeline_parallel_size=2</code> (the node count). TP keeps each layer&apos;s
                all-reduce inside a node on the fast fabric; PP cuts the model into two
                layer-stages, one per node, with only activation hand-offs crossing the slower
                inter-node link. With multiprocessing, the launch is one command per node{' '}
                <Cite tier={1} href={vllmUrl(SCALING_MD, 'L139-L160')}>
                  parallelism_scaling.md L139-L160
                </Cite>
                :
              </Box>
              <Box variant="code">
                <Box variant="small" color="text-status-info">
                  Adapted from the v0.31.0 parallelism guide
                </Box>
                <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# head node
vllm serve /path/to/the/model/in/the/container \
  --tensor-parallel-size 8 --pipeline-parallel-size 2 \
  --nnodes 2 --node-rank 0 \
  --master-addr <HEAD_NODE_IP>

# other node
vllm serve /path/to/the/model/in/the/container \
  --tensor-parallel-size 8 --pipeline-parallel-size 2 \
  --nnodes 2 --node-rank 1 \
  --master-addr <HEAD_NODE_IP> --headless`}</pre>
              </Box>
              <Box variant="p">
                On a running Ray cluster the same layout is a single command on one node with{' '}
                <code>--distributed-executor-backend ray</code> added{' '}
                <Cite tier={1} href={vllmUrl(SCALING_MD, 'L120-L128')}>
                  parallelism_scaling.md L120-L128
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>If the model itself is MoE</strong>, the composition flips toward DP+EP:
                replicate attention with <code>--data-parallel-size</code>, shard experts with{' '}
                <code>--enable-expert-parallel</code>, and let{' '}
                <code>EP_SIZE = TP_SIZE &times; DP_SIZE</code> fall out of the two. Reach for{' '}
                <code>--enable-eplb</code> once expert load skews, and see the expert-parallel
                deployment guide for the full multi-node MoE recipe.{' '}
                <Cite tier={1} href={EP_DOCS}>
                  vLLM docs: Expert Parallel Deployment
                </Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
