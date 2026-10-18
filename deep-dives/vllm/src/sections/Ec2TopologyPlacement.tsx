import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl } from '../components/Cite';

// AWS documentation is unversioned; every page below was read on 2026-10-16.
const EC2_UG = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide';
const EC2_API = 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference';
const PLACEMENT = `${EC2_UG}/placement-strategies.html`;
const CR_CPG = `${EC2_UG}/cr-cpg.html`;
const CAP_BLOCKS = `${EC2_UG}/ec2-capacity-blocks.html`;
const TOPO_HOW = `${EC2_UG}/how-ec2-instance-topology-works.html`;
const TOPO_PREREQ = `${EC2_UG}/ec2-instance-topology-prerequisites.html`;
const API_DIT = `${EC2_API}/API_DescribeInstanceTopology.html`;
const API_DCRT = `${EC2_API}/API_DescribeCapacityReservationTopology.html`;
const API_IT = `${EC2_API}/API_InstanceTopology.html`;
const EFA_NCCL = `${EC2_UG}/efa-start-nccl.html`;
const EFA_NIXL = `${EC2_UG}/efa-start-nixl.html`;
const RUFUS_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/';

// cloud-provider-aws pinned to v1.37.0; llm-d Router and Karpenter pinned to their tags.
// Markdown pages use ?plain=1 so line anchors resolve.
const CPA = 'https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1';
const LR_PLUGINS = 'https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins';
const KARP_DOC =
  'https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/website/content/en/docs/concepts/nodeclasses.md?plain=1';
const KARP_1110 = 'https://github.com/aws/karpenter-provider-aws/releases/tag/v1.11.0';
const NIXL = 'vllm/distributed/kv_transfer/kv_connector/v1/nixl';

interface MechanismRow {
  mechanism: string;
  kind: string;
  effect: string;
  use: string;
}

const mechanismRows: MechanismRow[] = [
  {
    mechanism: 'Cluster placement group',
    kind: 'Control (placement directive)',
    effect:
      'Packs instances into one Availability Zone (AZ) on the same high-bisection-bandwidth segment; raises the single-flow TCP limit from 5 Gbps to 10 Gbps between members.',
    use: 'Default lever for any multi-node job where the nodes talk to each other constantly: TP/PP (tensor/pipeline parallel) collectives, and (by inference) disaggregated KV transfer.',
  },
  {
    mechanism: 'ODCR inside a cluster placement group',
    kind: 'Control (capacity + placement)',
    effect:
      'Reserves the exact instance type/count in the AZ AND pins it to the packed network segment. Capacity assurance and proximity in one object.',
    use: 'You own a long-running fleet and must guarantee the nodes both exist and stay close.',
  },
  {
    mechanism: 'Capacity Blocks for ML',
    kind: 'Control (managed placement)',
    effect:
      'Reserves GPU capacity for a future window; instances are automatically placed close together inside an EC2 UltraCluster. Capacity Blocks take no placement group.',
    use: 'Short-duration (days/weeks) GPU jobs where you want AWS to handle co-location and you only pay for the reserved window.',
  },
  {
    mechanism: 'Partition placement group',
    kind: 'Control (anti-affinity)',
    effect:
      'Spreads instances across distinct racks (each its own power/network) to bound correlated hardware failure. The opposite intent of cluster.',
    use: 'Replicated distributed stores (HDFS (Hadoop Distributed File System), Cassandra). Wrong tool for KV locality.',
  },
  {
    mechanism: 'Spread placement group',
    kind: 'Control (anti-affinity)',
    effect:
      'Puts each instance on distinct hardware; at most 7 running instances per AZ. Maximizes isolation at the cost of proximity.',
    use: 'A handful of critical instances that must never share a rack. Never for a tightly-coupled GPU pool.',
  },
  {
    mechanism: 'DescribeCapacityReservationTopology',
    kind: 'Observability (read-only, pre-launch)',
    effect:
      'Returns a partial NetworkNodes hierarchy for PENDING or ACTIVE Capacity Reservations, so you can see how close reserved capacity sits before anything runs. Places nothing.',
    use: 'Before launch: plan capacity around proximity, and merge, split or assign reservations accordingly.',
  },
  {
    mechanism: 'DescribeInstanceTopology',
    kind: 'Observability (read-only, post-launch)',
    effect:
      'Returns the full per-instance NetworkNodes hierarchy for RUNNING instances so you can compute relative proximity. Places nothing.',
    use: 'After launch: assign ranks/pairs so cross-node traffic runs between the closest nodes, or publish the hierarchy as Kubernetes node labels.',
  },
];

function ControlVsObserveDiagram() {
  return (
    <svg
      viewBox="0 0 860 480"
      role="img"
      aria-labelledby="cvo-title"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="cvo-title">
        Placement on EC2 in two phases. Before launch, three control levers decide where
        instances land: a cluster placement group, an On-Demand Capacity Reservation in a
        cluster placement group, and Capacity Blocks; DescribeCapacityReservationTopology reads
        the reservations and places nothing. After launch, DescribeInstanceTopology reads the
        NetworkNodes hierarchy of running instances, which feeds rank and pair assignment and,
        through cloud-provider-aws node labels copied onto pod labels, the llm-d Endpoint
        Picker topology scorer. Neither API launches or moves instances.
      </title>
      <style>
        {`
          .cvo-ctl { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .cvo-obs { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .cvo-neu { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .cvo-use { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .cvo-ct { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .cvo-cs { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .cvo-bt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .cvo-bs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .cvo-ph { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; letter-spacing: 0.5px; }
          .cvo-lbl { fill: #5f6b7a; font: italic 11px sans-serif; }
          .cvo-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#cvo-ah); }
          .cvo-div { stroke: #d1d5db; stroke-width: 1.5; stroke-dasharray: 5 4; }
        `}
      </style>
      <defs>
        <marker id="cvo-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x={0} y={0} width={860} height={480} rx={8} fill="#ffffff" />

      <text className="cvo-ph" x={215} y={28}>BEFORE LAUNCH: CONTROL, READ RESERVATIONS</text>
      <text className="cvo-ph" x={645} y={28}>AFTER LAUNCH: OBSERVE, THEN USE</text>
      <line className="cvo-div" x1={430} y1={42} x2={430} y2={468} />

      {/* Control levers */}
      <rect className="cvo-ctl" x={24} y={48} width={190} height={62} rx={8} />
      <text className="cvo-ct" x={119} y={74}>Cluster PG</text>
      <text className="cvo-cs" x={119} y={96}>packs nodes, 1 AZ</text>

      <rect className="cvo-ctl" x={24} y={124} width={190} height={62} rx={8} />
      <text className="cvo-ct" x={119} y={150}>ODCR in cluster PG</text>
      <text className="cvo-cs" x={119} y={172}>capacity + proximity</text>

      <rect className="cvo-ctl" x={24} y={200} width={190} height={62} rx={8} />
      <text className="cvo-ct" x={119} y={226}>Capacity Blocks</text>
      <text className="cvo-cs" x={119} y={248}>auto UltraCluster, no PG</text>

      {/* Pre-launch observer of reservations */}
      <rect className="cvo-obs" x={24} y={306} width={190} height={96} rx={8} />
      <text className="cvo-bt" x={119} y={330}>DescribeCapacity</text>
      <text className="cvo-bt" x={119} y={348}>ReservationTopology</text>
      <text className="cvo-bs" x={119} y={370}>read-only: pending or</text>
      <text className="cvo-bs" x={119} y={386}>active reservations</text>

      <path className="cvo-arr" d="M119,262 L119,302" />
      <path className="cvo-arr" d="M24,155 L12,155 L12,354 L21,354" />
      <text className="cvo-lbl" x={128} y={288}>reads</text>

      {/* Resulting placement */}
      <rect className="cvo-neu" x={248} y={118} width={160} height={120} rx={8} />
      <text className="cvo-bt" x={328} y={158}>Instances land</text>
      <text className="cvo-bs" x={328} y={180}>on a high-bisection</text>
      <text className="cvo-bs" x={328} y={198}>network segment</text>
      <text className="cvo-bs" x={328} y={220}>(physically close)</text>

      <path className="cvo-arr" d="M214,79 C232,79 232,150 245,155" />
      <path className="cvo-arr" d="M214,155 L245,170" />
      <path className="cvo-arr" d="M214,231 C232,231 232,195 245,188" />

      {/* Post-launch observer */}
      <rect className="cvo-obs" x={452} y={48} width={180} height={80} rx={8} />
      <text className="cvo-bt" x={542} y={74}>DescribeInstance</text>
      <text className="cvo-bt" x={542} y={92}>Topology</text>
      <text className="cvo-bs" x={542} y={114}>read-only, running only</text>

      <rect className="cvo-neu" x={670} y={48} width={166} height={80} rx={8} />
      <text className="cvo-bt" x={753} y={78}>NetworkNodes</text>
      <text className="cvo-bs" x={753} y={98}>hierarchy per</text>
      <text className="cvo-bs" x={753} y={114}>instance</text>

      <path className="cvo-arr" d="M408,160 C432,160 430,92 449,90" />
      <path className="cvo-arr" d="M632,88 L667,88" />

      {/* Consumers */}
      <rect className="cvo-use" x={452} y={186} width={180} height={92} rx={8} />
      <text className="cvo-bt" x={542} y={214}>You assign</text>
      <text className="cvo-bt" x={542} y={232}>ranks / pairs</text>
      <text className="cvo-bs" x={542} y={256}>close work together</text>

      <rect className="cvo-use" x={670} y={186} width={166} height={92} rx={8} />
      <text className="cvo-bt" x={753} y={210}>Node labels</text>
      <text className="cvo-bs" x={753} y={230}>topology.k8s.aws/</text>
      <text className="cvo-bs" x={753} y={246}>{'network-node-layer-<n>'}</text>
      <text className="cvo-bs" x={753} y={264}>(cloud-provider-aws)</text>

      <rect className="cvo-use" x={670} y={322} width={166} height={80} rx={8} />
      <text className="cvo-bt" x={753} y={348}>llm-d EPP</text>
      <text className="cvo-bs" x={753} y={368}>topology-affinity scorer</text>
      <text className="cvo-bs" x={753} y={386}>prefill near decode</text>

      <path className="cvo-arr" d="M700,128 C700,160 560,150 548,182" />
      <path className="cvo-arr" d="M775,128 L775,182" />
      <path className="cvo-arr" d="M753,278 L753,318" />
      <text className="cvo-lbl" x={744} y={303} textAnchor="end">as pod labels</text>

      <text className="cvo-bs" x={645} y={440}>The APIs never launch or move instances.</text>
      <text className="cvo-bs" x={645} y={458}>They report what the control levers already did.</text>
    </svg>
  );
}

function NetworkNodesDiagram() {
  return (
    <svg
      viewBox="0 0 820 400"
      role="img"
      aria-labelledby="nn-title"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="nn-title">
        The DescribeInstanceTopology NetworkNodes hierarchy. Each instance reports an ordered
        list of nodes from the top layer down to the bottom-layer node it connects to. Two
        instances that share the same bottom-layer node are the closest; instances that only
        share an upper-layer node are further apart.
      </title>
      <style>
        {`
          .nn-top { fill: #5f6b7a; stroke: #414d5c; stroke-width: 1.5; }
          .nn-mid { fill: #688ae8; stroke: #4a6cd4; stroke-width: 1.5; }
          .nn-bot { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .nn-inst { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
          .nn-nt { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .nn-it { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .nn-lyr { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: end; letter-spacing: 0.5px; }
          .nn-edge { stroke: #aab7b8; stroke-width: 2; fill: none; }
          .nn-close { stroke: #037f0c; stroke-width: 2.5; fill: none; stroke-dasharray: 6 4; }
          .nn-ann { fill: #037f0c; font: 600 12px sans-serif; text-anchor: middle; }
          .nn-annf { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x={0} y={0} width={820} height={400} rx={8} fill="#ffffff" />

      <text className="nn-lyr" x={140} y={66}>LAYER i (top)</text>
      <text className="nn-lyr" x={140} y={146}>LAYER ii</text>
      <text className="nn-lyr" x={140} y={226}>LAYER iii (bottom)</text>
      <text className="nn-lyr" x={130} y={307}>INSTANCES</text>

      {/* edges */}
      <path className="nn-edge" d="M410,77 L250,125" />
      <path className="nn-edge" d="M410,77 L590,125" />
      <path className="nn-edge" d="M250,157 L210,205" />
      <path className="nn-edge" d="M250,157 L370,205" />
      <path className="nn-edge" d="M590,157 L590,205" />
      <path className="nn-edge" d="M210,237 L180,285" />
      <path className="nn-edge" d="M210,237 L300,285" />
      <path className="nn-edge" d="M370,237 L420,285" />
      <path className="nn-edge" d="M590,237 L600,285" />

      {/* top node */}
      <rect className="nn-top" x={360} y={45} width={100} height={32} rx={6} />
      <text className="nn-nt" x={410} y={66}>NN1</text>

      {/* mid nodes */}
      <rect className="nn-mid" x={200} y={125} width={100} height={32} rx={6} />
      <text className="nn-nt" x={250} y={146}>NN2</text>
      <rect className="nn-mid" x={540} y={125} width={100} height={32} rx={6} />
      <text className="nn-nt" x={590} y={146}>NN3</text>

      {/* bottom nodes */}
      <rect className="nn-bot" x={160} y={205} width={100} height={32} rx={6} />
      <text className="nn-nt" x={210} y={226}>NN4</text>
      <rect className="nn-bot" x={320} y={205} width={100} height={32} rx={6} />
      <text className="nn-nt" x={370} y={226}>NN5</text>
      <rect className="nn-bot" x={540} y={205} width={100} height={32} rx={6} />
      <text className="nn-nt" x={590} y={226}>NN6</text>

      {/* instances */}
      <rect className="nn-inst" x={140} y={285} width={80} height={34} rx={6} />
      <text className="nn-it" x={180} y={307}>i-1</text>
      <rect className="nn-inst" x={260} y={285} width={80} height={34} rx={6} />
      <text className="nn-it" x={300} y={307}>i-2</text>
      <rect className="nn-inst" x={380} y={285} width={80} height={34} rx={6} />
      <text className="nn-it" x={420} y={307}>i-3</text>
      <rect className="nn-inst" x={560} y={285} width={80} height={34} rx={6} />
      <text className="nn-it" x={600} y={307}>i-4</text>

      {/* closeness annotation: i-1 and i-2 share NN4 */}
      <path className="nn-close" d="M165,325 C200,360 280,360 315,325" />
      <text className="nn-ann" x={240} y={378}>i-1 + i-2 share NN4 (bottom) = closest</text>

      {/* far annotation */}
      <text className="nn-annf" x={600} y={360}>i-4 only shares NN1 = furthest</text>
    </svg>
  );
}

export function Ec2TopologyPlacement() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Get the nodes of a multi-node vLLM replica physically close with a launch-time lever, then read where they landed with two read-only topology APIs and feed that to rank assignment and the Kubernetes scheduler (verified against vLLM v0.31.0, commit db9527a4, cloud-provider-aws v1.37.0, llm-d Router v1.0.0 and the AWS documentation, 2026-10-16)"
          >
            23. EC2 Topology &amp; Placement Groups
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mental model: control versus observability.</strong> One bucket holds
            the levers that <em>control</em> where instances physically land: cluster placement
            groups, On-Demand Capacity Reservations (ODCRs) created inside them, and Capacity
            Blocks for ML. The other holds two read-only APIs that <em>observe</em> placement:{' '}
            <code>DescribeCapacityReservationTopology</code> for pending or active reservations
            before launch, and <code>DescribeInstanceTopology</code> for running instances after
            it. A pre-launch read still places nothing. The most common mistake an SA (Solutions
            Architect) sees is asking a topology API to &quot;launch my instances close
            together.&quot; It cannot. It describes capacity that already exists.
          </Box>
          <Box variant="p">
            <strong>Why a vLLM section cares about racks at all.</strong> Two of vLLM&apos;s
            multi-node paths are latency-sensitive to physical proximity. In disaggregated
            serving (<strong>section 10</strong>) the decoder reads the KV (key-value) cache
            from the prefiller over NIXL (NVIDIA Inference Xfer Library) on EFA (Elastic Fabric
            Adapter): the default <code>NixlConnector</code> pulls{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L408')} kind="code">
              connector.py L408
            </Cite>{' '}
            and <code>NixlPushConnector</code> has the prefiller write instead{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L367-L368')} kind="code">
              connector.py L367-L368
            </Cite>
            . In multi-node tensor- and pipeline-parallel serving the engine runs NCCL (NVIDIA
            Collective Communications Library) collectives every layer. Both ride the same
            OS-bypass fabric covered in{' '}
            <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong> and in the sibling{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>
            . The fabric is fast, and its speed assumes the endpoints are close. This section
            is about how you make them close, and how you find out whether they are.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Seven mechanisms, two jobs. Read the 'kind' column first: it tells you whether the thing decides placement or only reports it."
          >
            The mechanisms at a glance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'mechanism', header: 'Mechanism', cell: (r) => <strong>{r.mechanism}</strong>, minWidth: 170 },
              { id: 'kind', header: 'Control or observe?', cell: (r) => r.kind, minWidth: 160 },
              { id: 'effect', header: 'What it actually does', cell: (r) => r.effect, minWidth: 280 },
              { id: 'use', header: 'When to reach for it', cell: (r) => r.use, minWidth: 260 },
            ]}
            items={mechanismRows}
          />
          <Box variant="small">
            Sources for this table:{' '}
            <Cite tier={1} href={PLACEMENT}>
              EC2 User Guide: Placement strategies
            </Cite>
            ,{' '}
            <Cite tier={1} href={CR_CPG}>
              EC2 User Guide: Capacity Reservations in cluster placement groups
            </Cite>
            ,{' '}
            <Cite tier={1} href={CAP_BLOCKS}>
              EC2 User Guide: Capacity Blocks for ML
            </Cite>
            ,{' '}
            <Cite tier={1} href={TOPO_HOW}>
              EC2 User Guide: How EC2 topology works
            </Cite>
            ,{' '}
            <Cite tier={1} href={API_DCRT}>
              EC2 API: DescribeCapacityReservationTopology
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={API_DIT}>
              EC2 API: DescribeInstanceTopology
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where each mechanism sits relative to launch, and where the topology you read ends up: rank assignment, Kubernetes node labels and the llm-d scheduler."
          >
            Diagram 1: control levers vs the read-only observers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <div style={{ overflowX: 'auto' }}>
            <ControlVsObserveDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured.
          </Box>
          <Box variant="p">
            The flow is one-directional. You choose a control lever; the instances land on a
            high-bisection network segment; <em>only then</em> can{' '}
            <code>DescribeInstanceTopology</code> show where they landed, for rank/pair
            assignment or, as node labels, for a topology-aware scheduler. The reservation API
            gives an earlier, partial read. No arrow runs back from either API to placement.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A cluster placement group is the workhorse. Know exactly what it promises and what it only makes likely."
          >
            CONTROL: cluster placement groups
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cluster placement group is{' '}
            <em>
              &quot;a logical grouping of instances within a single Availability Zone&quot;
            </em>{' '}
            whose members{' '}
            <em>
              &quot;enjoy a higher per-flow throughput limit for TCP/IP traffic and are placed
              in the same high-bisection bandwidth segment of the network&quot;
            </em>{' '}
            <Cite tier={1} href={PLACEMENT}>
              EC2 User Guide: Placement strategies
            </Cite>
            . Instances inside one{' '}
            <em>&quot;can use up to 10 Gbps for single-flow traffic&quot;</em> while instances
            outside one get <em>&quot;up to 5 Gbps for single-flow traffic&quot;</em> (same
            source). That 2x single-flow headroom is the headline reason it is the default lever
            for tightly-coupled jobs.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">cluster</Box>
              <Box variant="p">
                Packs into one AZ on a high-bisection segment. The proximity lever. This is the
                one you want for a coupled GPU pool.
              </Box>
            </div>
            <div>
              <Box variant="h3">partition</Box>
              <Box variant="p">
                Splits into up to seven rack-isolated partitions per AZ to bound correlated
                failure. Built for HDFS/HBase/Cassandra: anti-affinity, the opposite of
                proximity.
              </Box>
            </div>
            <div>
              <Box variant="h3">spread</Box>
              <Box variant="p">
                Each instance on distinct hardware, at most seven running instances per AZ.
                Maximum isolation for a few critical nodes. The opposite of what KV locality
                wants.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="A cluster placement group is a request, and it can run short at scale-up">
            <SpaceBetween size="s">
              <Box variant="p">
                Scaling a cluster placement group risks an <em>insufficient capacity error</em>;
                a <em>single launch request</em> with a <em>single instance type</em> reduces
                that risk{' '}
                <Cite tier={1} href={PLACEMENT}>
                  EC2 User Guide: Placement strategies
                </Cite>
                . A cluster placement group stays inside one Availability Zone, and the per-pair
                throughput is <em>&quot;limited by the slower of the two instances&quot;</em>{' '}
                (same source).
              </Box>
              <Box variant="p">
                The mitigation AWS recommends is to{' '}
                <em>
                  &quot;reserve capacity explicitly in the cluster placement group by creating
                  an On-Demand Capacity Reservation in the cluster placement group&quot;
                </em>
                . Zonal Reserved Instances cannot do this, because they can&apos;t reserve
                capacity in a placement group (same source). That is the ODCR-in-PG
                (placement group) pattern in the next panel.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two ways to pin capacity AND proximity together: one you wire by hand, one AWS wires for you."
          >
            CONTROL: pinning capacity, ODCR-in-PG vs Capacity Blocks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">ODCR inside a cluster placement group</Box>
              <Box variant="p">
                You create the cluster placement group, then create an On-Demand Capacity
                Reservation <em>in</em> it{' '}
                <Cite tier={1} href={CR_CPG}>
                  EC2 User Guide: Capacity Reservations in cluster placement groups
                </Cite>
                . The reservation now guarantees both that the capacity exists and that it lives
                on the packed segment. This is the AWS recommendation for scaling a cluster
                placement group without hitting insufficient-capacity errors{' '}
                <Cite tier={1} href={PLACEMENT}>
                  EC2 User Guide: Placement strategies
                </Cite>
                . Manual, durable, and yours to keep. Fits a long-running fleet.
              </Box>
            </div>
            <div>
              <Box variant="h3">Capacity Blocks for ML</Box>
              <Box variant="p">
                You reserve GPU instances for a future window. The placement is handled for you:{' '}
                <em>
                  &quot;Instances that run inside a Capacity Block are automatically placed
                  close together inside Amazon EC2 UltraClusters, for low-latency,
                  petabit-scale, non-blocking networking&quot;
                </em>{' '}
                <Cite tier={1} href={CAP_BLOCKS}>
                  EC2 User Guide: Capacity Blocks for ML
                </Cite>
                . No named placement group to create. Up to 64 instances per block, up to 256
                across blocks, reservable up to 8 weeks out (same source).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="The key distinction for KV locality">
            Both give you proximity. The difference is who creates the placement object: with
            an ODCR-in-PG <em>you</em> name the cluster placement group and pin the reservation
            to it; with Capacity Blocks AWS auto-places into an UltraCluster, and{' '}
            <em>&quot;Capacity Blocks do not support placement groups&quot;</em>{' '}
            <Cite tier={1} href={PLACEMENT}>
              EC2 User Guide: Placement strategies
            </Cite>
            . If your tooling assumes a placement-group name exists (some schedulers and IaC
            (infrastructure as code) modules do), a Capacity Block will surprise it. On Amazon
            EKS (Elastic Kubernetes Service), Karpenter reaches reserved capacity through{' '}
            <code>capacityReservationSelectorTerms</code>{' '}
            <Cite tier={1} href={`${KARP_DOC}#L912-L923`}>
              Karpenter v1.15.0 docs: capacityReservationSelectorTerms
            </Cite>
            ; an EC2NodeClass aimed at a Capacity Block carries no{' '}
            <code>placementGroupSelector</code>, since a launch into a Capacity Block cannot
            specify a placement group (Capacity Blocks page above).{' '}
            <strong>Section 24 (vLLM on Amazon EKS)</strong> has the wiring.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two read-only calls tell you how close capacity already is: one for reservations before launch, one for running instances after. Read the right list entry and compare IDs within one account."
          >
            OBSERVABILITY: the two topology APIs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>DescribeInstanceTopology</code>{' '}
            <em>
              &quot;describes a tree-based hierarchy that represents the physical host placement
              of your EC2 instances within an Availability Zone or Local Zone&quot;
            </em>{' '}
            so you can{' '}
            <em>
              &quot;determine the relative proximity of your EC2 instances within the AWS
              network to support your tightly coupled workloads&quot;
            </em>{' '}
            <Cite tier={1} href={API_DIT}>
              EC2 API: DescribeInstanceTopology
            </Cite>
            . Its pre-launch sibling, <code>DescribeCapacityReservationTopology</code>, describes
            the same tree for your pending or active Capacity Reservations, so you can judge the
            proximity of capacity <em>before it is launched</em>{' '}
            <Cite tier={1} href={API_DCRT}>
              EC2 API: DescribeCapacityReservationTopology
            </Cite>
            , as a partial node set of 1, 2 or 3 nodes{' '}
            <Cite tier={1} href={TOPO_HOW}>
              EC2 User Guide: How EC2 topology works
            </Cite>
            . Instances must be <code>running</code> and reservations pending or active: you{' '}
            <em>
              &quot;can&apos;t get topology information for instances or Capacity Reservations
              in any other state&quot;
            </em>{' '}
            <Cite tier={1} href={TOPO_PREREQ}>
              EC2 User Guide: Topology prerequisites
            </Cite>
            .
          </Box>
          <Box variant="p">
            Each instance reports a <code>NetworkNodes</code> list ordered top-down, where{' '}
            <em>&quot;the network node that is connected to the instance is the last network
            node in the list (the bottom layer)&quot;</em>{' '}
            <Cite tier={1} href={TOPO_HOW}>
              EC2 User Guide: How EC2 topology works
            </Cite>
            . The number of layers depends on the instance type:
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">3 network nodes (3 layers)</Box>
              <Box variant="p">
                P3dn, P4d, P4de, <strong>P5, P5e, P5en</strong>, P6e-GB200, Trn1, Trn1n,{' '}
                <strong>Trn2</strong>, Trn2u, plus the G6e/G7e and HPC families{' '}
                <Cite tier={1} href={TOPO_PREREQ}>
                  EC2 User Guide: Topology prerequisites
                </Cite>
                . P6e-GB300 does not appear on the list.
              </Box>
            </div>
            <div>
              <Box variant="h3">4 network nodes (4 layers)</Box>
              <Box variant="p">
                Only <strong>p6-b200.48xlarge</strong> and{' '}
                <strong>p6-b300.48xlarge</strong> return four nodes (same source). Take the
                instance&apos;s own node from the end of the list,{' '}
                <code>NetworkNodes[-1]</code>, on every type: here the third entry and the{' '}
                <code>network-node-layer-3</code> label sit one level above the instance, so
                code or affinity rules written for a P5 group these nodes one level too coarse.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Compare node IDs within one account.</strong>{' '}
            <em>
              &quot;The nodes are hashed based on your account. Instances from different
              accounts running under the same server will return a different hashed list of
              strings&quot;
            </em>{' '}
            <Cite tier={1} href={API_IT}>
              EC2 API: InstanceTopology
            </Cite>
            , so a multi-account fleet cannot be grouped by matching <code>nn-</code> IDs
            across accounts. On UltraServer Capacity Blocks (instances joined by one
            accelerator interconnect, offered for Trn2 and P6e-GB200{' '}
            <Cite tier={1} href={CAP_BLOCKS}>
              EC2 User Guide: Capacity Blocks for ML
            </Cite>
            ) a <code>capacityBlockId</code> identifies instances within the UltraServer domain
            (same InstanceTopology page) and can be null right after launch{' '}
            <Cite tier={1} href={API_DIT}>
              EC2 API: DescribeInstanceTopology
            </Cite>
            . The section &quot;The EC2 Instance Topology API&quot; in the{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>{' '}
            covers these fields in depth.
          </Box>
          <Alert type="error" header="You cannot launch close with these APIs: only read close">
            <code>DescribeInstanceTopology</code> takes filters, instance IDs and
            placement-group <em>names</em> as <em>read</em> inputs{' '}
            <Cite tier={1} href={API_DIT}>
              EC2 API: DescribeInstanceTopology
            </Cite>
            , and <code>DescribeCapacityReservationTopology</code> takes filters and reservation
            IDs{' '}
            <Cite tier={1} href={API_DCRT}>
              EC2 API: DescribeCapacityReservationTopology
            </Cite>
            . Neither has a parameter that places, reserves, or moves anything. Proximity must
            come from the control levers above; these APIs only tell you what you got.
          </Alert>
          <ExpandableSection headerText="How to read the NetworkNodes output (the proximity rule)">
            <Box variant="p">
              The rule:{' '}
              <em>
                &quot;To work out which instances are close to each other, first find common
                network nodes in the bottom layer. If there are no common network nodes in the
                bottom layer, then find common network nodes in the upper layers&quot;
              </em>{' '}
              <Cite tier={1} href={TOPO_HOW}>
                EC2 User Guide: How EC2 topology works
              </Cite>
              . And:{' '}
              <em>
                &quot;the fewer the number of hops between network nodes, the closer the
                instances are to each other&quot;
              </em>{' '}
              (same source). Two instances sharing the same <em>bottom-layer</em> node are the
              tightest pairing you can get. That is the basis of rank/pair assignment.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two instances under one bottom-layer node are the closest pairing. This is the picture rank/pair assignment is built on."
          >
            Diagram 2: the NetworkNodes hierarchy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <div style={{ overflowX: 'auto' }}>
            <NetworkNodesDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Illustrative, simplified from the documentation&apos;s three-layer example (NN1 to
            NN7){' '}
            <Cite tier={1} href={TOPO_HOW}>
              EC2 User Guide: How EC2 topology works
            </Cite>
            . P6-B200 and P6-B300 report four layers, so the instance hangs one level lower; on
            every type, the instance&apos;s own node is the last entry in its list.
          </Box>
          <Box variant="p">
            Read each instance&apos;s path bottom-up. <strong>i-1</strong> and{' '}
            <strong>i-2</strong> both connect to <strong>NN4</strong>: they share a bottom-layer
            node, so they are the closest pair and the obvious candidates to pair as a
            prefiller/decoder cell or as adjacent TP ranks. <strong>i-3</strong> shares only{' '}
            <strong>NN2</strong> (an upper layer) with them, so it is further. <strong>i-4</strong>{' '}
            shares only <strong>NN1</strong>, the top, making it the furthest of the four.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Amazon's own production inference fleet pairs nodes with the topology API: the pattern to copy for rank assignment."
          >
            Proof point: Amazon Rufus pairs nodes by topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon&apos;s Rufus shopping assistant runs multi-node inference on Trainium with
            vLLM. Its deployment system{' '}
            <em>
              &quot;gathers this information using the Amazon EC2 DescribeInstanceTopology API to
              pair nodes based on their underlying network topology&quot;
            </em>{' '}
            so that{' '}
            <em>
              &quot;cross-node operations can utilize the high-bandwidth, low-latency EFA network
              available to instances&quot;
            </em>{' '}
            <Cite tier={2} href={RUFUS_BLOG}>
              AWS ML Blog: Scaling Rufus with multi-node inference on Trainium and vLLM
            </Cite>
            . A vLLM <em>leader</em> node handles scheduling and orchestration while{' '}
            <em>follower</em> nodes run the distributed computation (same source). The
            leader/follower cell is composed by{' '}
            <em>&quot;pairing nodes based on their physical location and proximity&quot;</em>{' '}
            (same source). That is the topology API used as a post-launch observer to assign
            which nodes work together.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the documentation leaves open and what the scheduler can reach, with the safe engineering call for each."
          >
            Limits and unknowns to plan around
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="The topology pages publish no per-layer latency and no switch map">
            The topology pages publish the <em>hierarchy</em> and a relative proximity rule;
            none of them publishes <strong>per-network-layer latency figures</strong> or{' '}
            <strong>a mapping from physical spine/leaf switches to NetworkNode IDs</strong>{' '}
            <Cite tier={1} href={TOPO_HOW}>
              EC2 User Guide: How EC2 topology works
            </Cite>{' '}
            <Cite tier={1} href={TOPO_PREREQ}>
              EC2 User Guide: Topology prerequisites
            </Cite>
            . You can rank pairs as closer or further; you cannot read a microsecond budget off
            a layer, so measure before a latency budget depends on one.
          </Alert>
          <Alert type="warning" header="Is point-to-point KV transfer as placement-sensitive as collective AllReduce? Unstated.">
            <SpaceBetween size="s">
              <Box variant="p">
                There is a documented asymmetry between AWS&apos;s two EFA getting-started
                guides. The <strong>EFA + NCCL</strong> guide explicitly recommends a cluster
                placement group:{' '}
                <em>
                  &quot;we do recommend running your EFA-enabled instances in a cluster placement
                  group as it launches the instances into a low-latency group in a single
                  Availability Zone&quot;
                </em>{' '}
                <Cite tier={1} href={EFA_NCCL}>
                  EC2 User Guide: EFA and NCCL, Step 12
                </Cite>
                .
              </Box>
              <Box variant="p">
                The <strong>EFA + NIXL</strong> inference guide (which covers exactly the
                prefiller/decoder KV transfer vLLM uses) walks through launching EFA-enabled
                instances and even a vLLM disaggregated test, but{' '}
                <strong>never mentions cluster placement groups at all</strong>{' '}
                <Cite tier={1} href={EFA_NIXL}>
                  EC2 User Guide: EFA and NIXL
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>[SPECULATIVE]</strong> Point-to-point KV transfer (one prefiller
                streaming to one decoder over NIXL/EFA) may be less placement-sensitive than
                dense collective AllReduce across many ranks, where the slowest path gates every
                step. AWS does not state this. Until it does, keep prefiller and decoder pools in
                the same proximity domain (a cluster placement group, ODCR-in-PG, or Capacity
                Block): the cost of doing so is near zero and the cost of being wrong is paid on
                every token.
              </Box>
            </SpaceBetween>
          </Alert>
          <Alert type="info" header="Kubernetes schedulers can prefer close pods; proximity between nodes is set at launch">
            <SpaceBetween size="s">
              <Box variant="p">
                On Kubernetes, llm-d&apos;s Endpoint Picker (EPP) can prefer a prefill pod
                close to the chosen decode pod, by the tightest level they share: host, rack,
                zone or region{' '}
                <Cite tier={1} href={`${LR_PLUGINS}/scheduling/scorer/topologyaffinity/README.md?plain=1#L25-L35`}>
                  llm-d Router v1.0.0: topologyaffinity scorer README L25-L35
                </Cite>
                . Rack, zone and region come from pod labels you configure{' '}
                <Cite tier={1} href={`${LR_PLUGINS}/datalayer/attribute/topology/README.md?plain=1#L12-L19`}>
                  topology attribute README L12-L19
                </Cite>
                , and with no locality known the filter passes every candidate through{' '}
                <Cite tier={1} href={`${LR_PLUGINS}/scheduling/filter/topologyaffinity/README.md?plain=1#L27-L32`}>
                  topologyaffinity filter README L27-L32
                </Cite>
                , so a missing label switches the preference off without breaking routing.{' '}
                <strong>Section 17 (Kubernetes: llm-d, KServe &amp; Gateway API)</strong> covers
                it inside the prefill/decode flow.
              </Box>
              <Box variant="p">
                To make that preference EC2-aware, the AWS cloud provider for Kubernetes calls{' '}
                <code>DescribeInstanceTopology</code> and labels each node{' '}
                <code>{'topology.k8s.aws/network-node-layer-<n>'}</code>, numbered from 1 at the
                top{' '}
                <Cite tier={1} href={`${CPA}/well_known_labels.go#L23-L26`} kind="code">
                  cloud-provider-aws v1.37.0 well_known_labels.go L23-L26
                </Cite>{' '}
                <Cite tier={1} href={`${CPA}/instances_v2.go#L95-L118`} kind="code">
                  instances_v2.go L95-L118
                </Cite>
                . The EPP reads pod labels{' '}
                <Cite tier={1} href={`${LR_PLUGINS}/datalayer/extractor/topology/extractor.go#L20-L24`} kind="code">
                  extractor.go L20-L24
                </Cite>
                , so copy the bottom-layer value onto the vLLM pods as the label its{' '}
                <code>rack</code> parameter names{' '}
                <Cite tier={1} href={`${LR_PLUGINS}/datalayer/extractor/topology/extractor.go#L70-L72`} kind="code">
                  extractor.go L70-L72
                </Cite>
                . No EKS documentation located during this
                research says whether EKS writes these node labels; check with{' '}
                <code>kubectl get nodes -L topology.k8s.aws/network-node-layer-3</code>.
              </Box>
              <Box variant="p">
                The scheduler still only reorders pods that already exist. Proximity between
                nodes is set when they launch into a cluster placement group, an ODCR-in-PG, or a
                Capacity Block. Confirm the pool sits in one proximity domain before tuning EPP
                weights: a latency cliff between two pods three network hops apart is a
                placement fix.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The whole section as a recipe you can hand to a team."
          >
            Putting it together: the SA playbook
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Establish proximity at launch.</strong> Pick the control lever that
            matches ownership: a cluster placement group (often with an ODCR-in-PG) for a
            long-running fleet, or a Capacity Block for a short GPU window where AWS auto-places
            into an UltraCluster. On EKS, a Karpenter EC2NodeClass with{' '}
            <code>placementGroupSelector</code>{' '}
            <Cite tier={1} href={`${KARP_DOC}#L989-L1021`}>
              Karpenter v1.15.0 docs: placementGroupSelector
            </Cite>{' '}
            (Karpenter v1.11.0 and later{' '}
            <Cite tier={1} href={KARP_1110}>
              Karpenter v1.11.0 release notes
            </Cite>
            ) autoscales nodes into a cluster placement group you create; a managed node group
            with a placement group is the static option (section 24).
          </Box>
          <Box variant="p">
            <strong>2. Keep coupled pools in the same proximity domain.</strong> Put multi-node
            TP/PP ranks (and, conservatively, paired prefiller/decoder pools) inside the same
            cluster placement group or Capacity Block. The NCCL guide recommends it for
            collectives; for KV transfer it is the prudent default until AWS says otherwise.
          </Box>
          <Box variant="p">
            <strong>3. Observe after launch and assign accordingly.</strong> Call{' '}
            <code>DescribeInstanceTopology</code> on the running fleet (or{' '}
            <code>DescribeCapacityReservationTopology</code> on reservations before launch),
            find instances sharing a bottom-layer node, the last entry in each list, and assign
            ranks or prefiller/decoder cells so the busiest cross-node traffic runs between the
            closest nodes: the Rufus pattern.
          </Box>
          <Box variant="p">
            <strong>4. Let the scheduler prefer, and let launch decide.</strong> The topology
            APIs only observe. llm-d&apos;s EPP can prefer a close prefill pod once topology
            reaches the pods as labels, keyed on the bottom layer for your instance type, but it
            reorders pods that already exist. Proximity between nodes is a launch-time decision.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
