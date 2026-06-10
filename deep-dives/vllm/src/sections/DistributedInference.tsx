import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';

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
    flag: '--tensor-parallel-size',
    comms: 'All-reduce on every layer (twice per transformer block). Highest collective frequency of the four axes.',
    reach: 'Within one node, over the fast intra-node fabric.',
  },
  {
    axis: 'Pipeline parallelism (PP)',
    splits: 'Layers are split into contiguous stages; each GPU/node holds whole layers, not slices.',
    flag: '--pipeline-parallel-size',
    comms: 'Point-to-point activation hand-off between adjacent stages. Low volume, but introduces pipeline bubbles.',
    reach: 'Across nodes, where the inter-node link is the bottleneck.',
  },
  {
    axis: 'Data parallelism (DP)',
    splits: 'Full (or TP/PP-sharded) model replicas, each serving an independent slice of the request stream.',
    flag: '--data-parallel-size',
    comms: 'None for dense models; for MoE, DP ranks synchronize each forward pass (see below).',
    reach: 'Anywhere. Replicas need no fast interconnect between them unless MoE couples them.',
  },
  {
    axis: 'Expert parallelism (EP)',
    splits: 'MoE experts are distributed across GPUs, so each rank owns a subset of the experts.',
    flag: '--enable-expert-parallel',
    comms: 'All-to-all dispatch/combine to route tokens to the GPU that owns each chosen expert.',
    reach: 'Within and across nodes; the all-to-all is the dominant cost at scale.',
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
    why: 'The docs are explicit: "if the model fits on a single GPU, distributed inference is probably unnecessary." Adding parallelism only buys collective overhead.',
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
    reach: 'TP within each node + PP across nodes.',
    why: '"if the model is too large for a single node, combine tensor parallelism with pipeline parallelism." Set TP = GPUs per node, PP = number of nodes.',
  },
  {
    symptom: 'KV cache is the bottleneck (frequent preemption / low concurrency).',
    reach: 'Raise tensor-parallel-size (or pipeline-parallel-size) to free per-GPU memory.',
    why: 'Higher TP gives "each GPU ... more memory available for KV cache"; higher PP reduces per-GPU weight memory, "indirectly leaving more memory available for KV cache." Both trade memory for collective/latency overhead.',
  },
  {
    symptom: 'Engine is saturated but each replica fits; you need more QPS.',
    reach: 'Data parallelism (DP): add replicas.',
    why: 'DP multiplies throughput by running independent replicas behind one endpoint (internal load balancing) or behind your own balancer (external).',
  },
  {
    symptom: 'Large MoE model (DeepSeek-class) at scale.',
    reach: 'DP attention + EP (or TP) for the expert layers.',
    why: 'For MoE "it can be advantageous to use data parallel for the attention layers and expert or tensor parallel (EP or TP) for the expert layers." EP shards the experts so aggregate expert capacity grows with the cluster.',
  },
];

export function DistributedInference() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Four ways to spread one model (or many copies of it) across GPUs and nodes, and how to pick the right combination."
          >
            9. Distributed Inference
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The decision you are actually making:</strong> distributed inference is
            not one switch. It is a choice among four orthogonal axes ({' '}
            <strong>tensor</strong>, <strong>pipeline</strong>, <strong>data</strong>, and{' '}
            <strong>expert</strong> parallelism), each answering a different question. Tensor
            and pipeline parallelism exist because a model is <em>too big to fit</em>; data
            parallelism exists because you need <em>more throughput</em>; expert parallelism
            exists because Mixture-of-Experts (MoE) models have a fundamentally different
            shape. You compose them, and the composition is dictated by where the network is
            fast and where it is slow.
          </Box>
          <Box variant="p">
            <strong>The first rule is restraint.</strong> The vLLM parallelism guide opens
            with it: "if the model fits on a single GPU, distributed inference is
            probably unnecessary." Every axis you add buys a collective operation you
            did not have before. The job is to reach for the minimum parallelism that makes
            the model fit and the throughput land, not the maximum the cluster allows.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            This section is the practitioner&apos;s map: what each axis is, when to reach for
            it, and which flag turns it on. The <em>code</em> behind it (vLLM&apos;s{' '}
            <code>parallel_state</code>, the <code>GroupCoordinator</code> that owns each
            process group, and the KV-transfer connectors) lives in the{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong> tab. The{' '}
            <em>physics</em> of the collectives, NVLink versus the inter-node fabric, why an
            all-reduce wants intra-node bandwidth and an all-to-all stresses scale-out, is
            owned by the sibling <strong>Silicon, Memory &amp; Inference</strong> deep dive.
            This section does not re-derive either; it tells you which knob to turn.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The four axes at a glance</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The axes differ along one dimension that matters more than any other:{' '}
            <strong>how often, and how loudly, they talk on the network.</strong> Tensor
            parallelism communicates on every layer; pipeline parallelism only at stage
            boundaries; data parallelism (for dense models) not at all; expert parallelism in
            a single all-to-all per MoE layer. That communication profile is what pins each
            axis to a part of the topology.
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
            Flags and the "too big &rarr; TP, too big for a node &rarr; TP+PP"
            reasoning are from the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
            ; the DP and EP flags and the MoE composition are from the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/"
            >
              data-parallel deployment guide (accessed 2026-06-07)
            </Link>{' '}
            and the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/"
            >
              expert-parallel deployment guide (accessed 2026-06-07)
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How the axes lay over the hardware</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The canonical multi-node layout: <strong>tensor parallelism inside each node</strong>{' '}
            (where the GPU-to-GPU fabric is fast enough for a per-layer all-reduce),{' '}
            <strong>pipeline parallelism across nodes</strong> (where the slower inter-node
            link only carries activations at stage boundaries), and{' '}
            <strong>data parallelism over the top</strong> when you replicate the whole thing
            for throughput. The diagram below shows one DP replica spanning two nodes:
            TP=4 within each node, PP=2 across them.
          </Box>

          <Box textAlign="center">
            <svg
              viewBox="0 0 760 380"
              width="100%"
              style={{ maxWidth: 760, height: 'auto' }}
              role="img"
              aria-label="Layout of tensor, pipeline, and data parallelism over GPUs: two nodes of four GPUs each, tensor-parallel within a node, pipeline-parallel across nodes, replicated by data parallelism"
            >
              <style>
                {
                  '.lbl{font:600 13px sans-serif;fill:#16191f}.sub{font:400 11px sans-serif;fill:#414d5c}.gpu{fill:#f2f8fd;stroke:#539fe5;stroke-width:1.5}.node{fill:none;stroke:#7d8998;stroke-width:1.5;stroke-dasharray:5 4}.title{font:700 14px sans-serif;fill:#16191f}.tp{stroke:#1d8102;stroke-width:2;fill:none}.pp{stroke:#bf4f1f;stroke-width:2;fill:none}.tag{font:700 11px sans-serif}'
                }
              </style>
              <defs>
                <marker id="diArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#bf4f1f" />
                </marker>
              </defs>

              <text x="12" y="22" className="title">
                One data-parallel replica: TP=4 within a node, PP=2 across nodes
              </text>

              {/* Node 0 (pipeline stage 0) */}
              <rect x="20" y="44" width="330" height="150" rx="10" className="node" />
              <text x="32" y="64" className="lbl">
                Node 0: pipeline stage 0 (layers 0 to N/2)
              </text>
              {[0, 1, 2, 3].map((i) => (
                <g key={`n0-${i}`}>
                  <rect x={36 + i * 76} y={84} width="64" height="56" rx="6" className="gpu" />
                  <text x={68 + i * 76} y={108} textAnchor="middle" className="sub">
                    GPU {i}
                  </text>
                  <text x={68 + i * 76} y={124} textAnchor="middle" className="sub">
                    weight slice
                  </text>
                </g>
              ))}
              {/* TP all-reduce link node 0 */}
              <line x1="68" y1="158" x2="296" y2="158" className="tp" />
              <text x="182" y="180" textAnchor="middle" className="tag" fill="#1d8102">
                TP all-reduce (every layer): fast intra-node fabric
              </text>

              {/* Node 1 (pipeline stage 1) */}
              <rect x="410" y="44" width="330" height="150" rx="10" className="node" />
              <text x="422" y="64" className="lbl">
                Node 1: pipeline stage 1 (layers N/2 to N)
              </text>
              {[0, 1, 2, 3].map((i) => (
                <g key={`n1-${i}`}>
                  <rect x={426 + i * 76} y={84} width="64" height="56" rx="6" className="gpu" />
                  <text x={458 + i * 76} y={108} textAnchor="middle" className="sub">
                    GPU {i}
                  </text>
                  <text x={458 + i * 76} y={124} textAnchor="middle" className="sub">
                    weight slice
                  </text>
                </g>
              ))}
              <line x1="458" y1="158" x2="686" y2="158" className="tp" />
              <text x="572" y="180" textAnchor="middle" className="tag" fill="#1d8102">
                TP all-reduce (every layer): fast intra-node fabric
              </text>

              {/* PP activation hand-off across nodes */}
              <line x1="350" y1="112" x2="410" y2="112" className="pp" markerEnd="url(#diArrow)" />
              <text x="380" y="104" textAnchor="middle" className="tag" fill="#bf4f1f">
                PP
              </text>
              <text x="380" y="220" textAnchor="middle" className="sub">
                Pipeline hand-off: activations only, at the stage boundary, inter-node link
              </text>

              {/* DP replication */}
              <rect x="20" y="250" width="720" height="58" rx="10" className="node" />
              <text x="380" y="276" textAnchor="middle" className="lbl">
                Data parallelism: replicate this entire 2-node unit for throughput
              </text>
              <text x="380" y="294" textAnchor="middle" className="sub">
                Replica 1 · Replica 2 · … · Replica D, each serving an independent slice of the request stream
              </text>

              <text x="380" y="336" textAnchor="middle" className="sub">
                Map fast collectives (TP all-reduce) to the fast link; map sparse hand-offs
                (PP) and replicas (DP) to the slow link.
              </text>
              <text x="380" y="356" textAnchor="middle" className="sub">
                Interconnect bandwidth and collective physics: see the Silicon, Memory &amp; Inference deep dive.
              </text>
            </svg>
          </Box>
          <Box variant="small" textAlign="center">
            Conceptual layout. The composition rule, "Set{' '}
            <code>tensor_parallel_size</code> to the number of GPUs per node and{' '}
            <code>pipeline_parallel_size</code> to the number of nodes," is from
            the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
            . Why the all-reduce wants the fast fabric and the hand-off tolerates the slow one
            is covered in the sibling silicon deep dive.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Tensor vs pipeline: too big, two ways</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Both TP and PP exist to make a model that does not fit on one GPU fit across
            several. They differ in <em>what</em> they cut and <em>what that costs you</em>.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Tensor parallelism (shard within a layer)</Box>
              <Box variant="p">
                Reach for TP first when "the model is too large to fit on a single
                GPU" and the GPUs sit in one node. Each weight matrix is split across
                GPUs, so every GPU does a fraction of every layer&apos;s math, then the ranks{' '}
                <strong>all-reduce on each layer</strong> to recombine. That collective is
                frequent and latency-sensitive, which is exactly why TP belongs on the fast
                intra-node fabric and why the docs warn that raising it "may cause
                excessive synchronization overhead." A useful side effect: higher TP
                gives "each GPU ... more memory available for KV cache," so TP is
                also a lever when KV cache, not weights, is your bottleneck.{' '}
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/configuration/optimization/"
                >
                  vLLM optimization guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">Pipeline parallelism (split the layers)</Box>
              <Box variant="p">
                Reach for PP "when you&apos;ve already maxed out efficient tensor
                parallelism but need to distribute," or "for very deep and narrow
                models where layer distribution is more efficient." PP assigns whole
                contiguous layers to each stage and only hands activations across stage
                boundaries (cheap traffic), which is why PP is the axis you stretch{' '}
                <strong>across nodes</strong>. Two practical edges: it "supports uneven
                splits" (use it when your GPU count doesn&apos;t evenly divide the model),
                and it introduces pipeline bubbles, so the docs flag "latency
                penalties." It also reduces per-GPU weight memory, "indirectly
                leaving more memory available for KV cache."{' '}
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/configuration/optimization/"
                >
                  vLLM optimization guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Data &amp; expert parallelism: throughput, and the MoE shape</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            TP and PP make a model fit; <strong>data parallelism</strong> makes it serve more.
            DP runs independent replicas of the model (each replica may itself be TP/PP-sharded)
            and spreads the request stream across them. Enable it with{' '}
            <code>--data-parallel-size</code>. The docs note it "can be configured
            by simply including e.g. <code>--data-parallel-size=4</code> in the{' '}
            <code>vllm serve</code> command line." vLLM can balance across replicas
            itself behind a single endpoint ("self-contained data parallel deployments
            that expose a single API endpoint") or defer to your own balancer, which
            "can make sense" for larger-scale deployments.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/"
            >
              vLLM data-parallel deployment guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            <strong>Expert parallelism is the MoE-specific axis.</strong> A Mixture-of-Experts
            layer has many experts but routes each token to only a few, so the experts are the
            place to shard: <code>--enable-expert-parallel</code> distributes the experts
            across GPUs, and tokens are routed by an all-to-all to whichever GPU owns their
            chosen expert. The shape that pairs with it is data-parallel attention: for MoE
            models "it can be advantageous to use data parallel for the attention layers
            and expert or tensor parallel (EP or TP) for the expert layers." The two are
            coupled by design ("EP is more efficient when used in conjunction with
            DP"), and EP size follows <code>EP_SIZE = TP_SIZE &times; DP_SIZE</code>.
            Because they run together, "expert layers across all ranks are required to
            synchronize during every forward pass."{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/"
            >
              vLLM expert-parallel deployment guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            <strong>Scaling MoE wide.</strong> At large EP counts, uneven token routing leaves
            some experts hot and others idle. vLLM ships an <strong>Expert Parallel Load
            Balancer (EPLB)</strong>, enabled with <code>--enable-eplb</code>, that
            "redistribute[s] expert mappings across EP ranks, evening the load across
            experts," and supports the <code>deepep_high_throughput</code> and{' '}
            <code>deepep_low_latency</code> DeepEP communication backends for the dispatch /
            combine all-to-all. These are the knobs behind "wide" MoE deployments
            spanning many GPUs.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/"
            >
              vLLM expert-parallel deployment guide (accessed 2026-06-07)
            </Link>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Decision table: symptom &rarr; which parallelism</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Start from what hurts, not from what the cluster can do. Read top to bottom; the
            first row that matches your symptom is usually the right reach.
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
            Symptom-to-axis reasoning drawn from the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              parallelism &amp; scaling guide
            </Link>
            , the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/configuration/optimization/"
            >
              optimization guide
            </Link>
            , and the{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/"
            >
              data-parallel deployment guide
            </Link>{' '}
            (all accessed 2026-06-07).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Who actually launches the workers</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Parallelism describes <em>how the model is split</em>; the{' '}
            <strong>executor backend</strong> decides <em>which runtime spawns and
            coordinates the worker processes</em>. vLLM picks a sensible default by topology:
            "The default distributed runtimes are Ray for multi-node inference and native
            Python <code>multiprocessing</code> for single-node inference," and you can
            force either with <code>--distributed-executor-backend</code> set to{' '}
            <code>ray</code> or <code>mp</code>.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Single node &rarr; multiprocessing (mp)</Box>
              <Box variant="p">
                One node, several GPUs, TP and/or PP within the box: vLLM uses native Python
                multiprocessing to fork a worker per GPU. No cluster scheduler, no extra
                moving parts. This is the path for the common single-instance deployment.
              </Box>
            </div>
            <div>
              <Box variant="h3">Multi node &rarr; Ray</Box>
              <Box variant="p">
                Once PP (or DP) spans nodes, vLLM defaults to Ray to place and supervise
                workers across the cluster. Ray owns process placement, health, and the
                cross-node wiring. The orchestration story (Ray and Ray Serve LLM)
                is its own section.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Two cross-links for the layers this section deliberately skips.</strong>{' '}
            The Ray runtime, cluster bring-up, and Ray Serve LLM are covered in{' '}
            <strong>Section 15, Orchestration: Ray &amp; Ray Serve LLM</strong>. The
            in-tree machinery that realizes every axis above (the process groups,{' '}
            <code>parallel_state</code>, the <code>GroupCoordinator</code>, and the KV-transfer
            connectors that move cache between workers) is in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Worked example: a 2-node, TP=8 + PP=2 launch">
        <SpaceBetween size="s">
          <Box variant="p">
            The guide&apos;s own multi-node example is the clearest illustration of the
            composition rule. Two nodes, eight GPUs each, a model too large for one node:
          </Box>
          <Box variant="p">
            Set <code>tensor_parallel_size=8</code> (the GPUs per node) and{' '}
            <code>pipeline_parallel_size=2</code> (the node count). TP keeps each
            layer&apos;s all-reduce inside a node on the fast fabric; PP cuts the model into
            two layer-stages, one per node, with only activation hand-offs crossing the slower
            inter-node link. This is the "TP per node, PP per node-count" rule made
            concrete.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling/"
            >
              vLLM parallelism &amp; scaling guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            Multi-node launches also surface the operational flags around the parallelism
            itself (<code>--nnodes</code>, <code>--node-rank</code>,{' '}
            <code>--master-addr</code>, and a <code>--headless</code> mode for worker-only
            nodes), plus the choice of <code>--distributed-executor-backend ray</code>{' '}
            for the cross-node case. The exact invocation and the helper script vLLM ships for
            this are in the parallelism &amp; scaling guide above.
          </Box>
          <Box variant="p">
            <strong>If the model itself is MoE</strong>, the composition flips toward DP+EP:
            replicate attention with <code>--data-parallel-size</code>, shard experts with{' '}
            <code>--enable-expert-parallel</code>, and let{' '}
            <code>EP_SIZE = TP_SIZE &times; DP_SIZE</code> fall out of the two. Reach for{' '}
            <code>--enable-eplb</code> once expert load skews. See the expert-parallel
            deployment guide for the full multi-node MoE recipe.{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/"
            >
              vLLM expert-parallel deployment guide (accessed 2026-06-07)
            </Link>
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
