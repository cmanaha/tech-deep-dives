import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

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
      'Packs instances into one AZ on the same high-bisection-bandwidth segment; raises the single-flow TCP limit from 5 Gbps to 10 Gbps between members.',
    use: 'Default lever for any multi-node job where the nodes talk to each other constantly — TP/PP collectives, and (by inference) disaggregated KV transfer.',
  },
  {
    mechanism: 'ODCR inside a cluster placement group',
    kind: 'Control (capacity + placement)',
    effect:
      'Reserves the exact instance type/count in the AZ AND pins it to the packed network segment. Capacity assurance and proximity in one object.',
    use: 'You own a long-running fleet and must guarantee the nodes both exist and stay close. Created with the cr-cpg pattern.',
  },
  {
    mechanism: 'Capacity Blocks for ML',
    kind: 'Control (managed placement)',
    effect:
      'Reserves GPU capacity for a future window; instances are automatically placed close together inside an EC2 UltraCluster. No named placement group required.',
    use: 'Short-duration (days/weeks) GPU jobs where you want AWS to handle co-location and you only pay for the reserved window.',
  },
  {
    mechanism: 'Partition placement group',
    kind: 'Control (anti-affinity)',
    effect:
      'Spreads instances across distinct racks (each its own power/network) to bound correlated hardware failure. The opposite intent of cluster.',
    use: 'Replicated distributed stores (HDFS, Cassandra) — NOT latency-coupled inference. Wrong tool for KV locality.',
  },
  {
    mechanism: 'Spread placement group',
    kind: 'Control (anti-affinity)',
    effect:
      'Puts each instance on distinct hardware; max 7 running instances per AZ per group. Maximizes isolation, not proximity.',
    use: 'A handful of critical instances that must never share a rack. Never for a tightly-coupled GPU pool.',
  },
  {
    mechanism: 'DescribeInstanceTopology',
    kind: 'Observability (read-only, post-launch)',
    effect:
      'Returns the per-instance NetworkNodes hierarchy for RUNNING instances so you can compute relative proximity. It does NOT place anything.',
    use: 'After launch: assign ranks/pairs so cross-node traffic runs between the closest nodes. The diagnostic complement to the control levers above.',
  },
];

function ControlVsObserveDiagram() {
  return (
    <svg
      viewBox="0 0 860 420"
      role="img"
      aria-labelledby="cvo-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="cvo-title">
        Two distinct phases: control levers (cluster placement group, ODCR in a cluster
        placement group, Capacity Blocks) decide where instances land at launch; the
        DescribeInstanceTopology API only observes the resulting network hierarchy after the
        instances are running and is used to assign ranks or pairs
      </title>
      <style>
        {`
          .ctl { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .obs { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
          .neu { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .ct { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .cs { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .bt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .bs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .ph { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; letter-spacing: 0.5px; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#cah); }
          .div { stroke: #d1d5db; stroke-width: 1.5; stroke-dasharray: 5 4; }
        `}
      </style>
      <defs>
        <marker id="cah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>

      <text className="ph" x={215} y={26}>BEFORE / AT LAUNCH — YOU CONTROL</text>
      <text className="ph" x={645} y={26}>AFTER LAUNCH — YOU OBSERVE</text>
      <line className="div" x1={430} y1={40} x2={430} y2={400} />

      {/* Control levers */}
      <rect className="ctl" x={30} y={50} width={170} height={70} rx={8} />
      <text className="ct" x={115} y={80}>Cluster PG</text>
      <text className="cs" x={115} y={100}>packs nodes, 1 AZ</text>

      <rect className="ctl" x={30} y={140} width={170} height={70} rx={8} />
      <text className="ct" x={115} y={166}>ODCR in cluster PG</text>
      <text className="cs" x={115} y={186}>capacity + proximity</text>

      <rect className="ctl" x={30} y={230} width={170} height={70} rx={8} />
      <text className="ct" x={115} y={256}>Capacity Blocks</text>
      <text className="cs" x={115} y={276}>auto UltraCluster</text>

      {/* Resulting placement */}
      <rect className="neu" x={240} y={140} width={160} height={120} rx={8} />
      <text className="bt" x={320} y={180}>Instances land</text>
      <text className="bs" x={320} y={202}>on a high-bisection</text>
      <text className="bs" x={320} y={220}>network segment</text>
      <text className="bs" x={320} y={244}>(physically close)</text>

      <path className="arr" d="M200,85 C218,85 222,170 238,180" />
      <path className="arr" d="M200,175 L238,190" />
      <path className="arr" d="M200,265 C218,265 222,220 238,210" />

      {/* Observer */}
      <rect className="obs" x={470} y={120} width={170} height={80} rx={8} />
      <text className="ct" x={555} y={150}>DescribeInstance</text>
      <text className="ct" x={555} y={170}>Topology</text>
      <text className="cs" x={555} y={190}>read-only, running only</text>

      <rect className="neu" x={680} y={120} width={150} height={80} rx={8} />
      <text className="bt" x={755} y={150}>NetworkNodes</text>
      <text className="bs" x={755} y={172}>hierarchy per</text>
      <text className="bs" x={755} y={190}>instance</text>

      <path className="arr" d="M400,200 C435,230 445,180 468,165" />
      <path className="arr" d="M640,160 L678,160" />

      <rect className="obs" x={555} y={260} width={170} height={80} rx={8} />
      <text className="ct" x={640} y={290}>You assign</text>
      <text className="ct" x={640} y={310}>ranks / pairs</text>
      <text className="cs" x={640} y={330}>place close work together</text>

      <path className="arr" d="M755,200 C755,225 700,245 670,262" />

      <text className="bs" x={640} y={372}>The API never launches or moves instances —</text>
      <text className="bs" x={640} y={390}>it tells you what the control levers already did.</text>
    </svg>
  );
}

function NetworkNodesDiagram() {
  return (
    <svg
      viewBox="0 0 820 400"
      role="img"
      aria-labelledby="nn-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="nn-title">
        The DescribeInstanceTopology NetworkNodes hierarchy. Each instance reports an ordered
        list of nodes from the top layer down to the bottom-layer node it connects to. Two
        instances that share the same bottom-layer node are the closest; instances that only
        share an upper-layer node are further apart.
      </title>
      <style>
        {`
          .top { fill: #5f6b7a; stroke: #414d5c; stroke-width: 1.5; }
          .mid { fill: #688ae8; stroke: #4a6cd4; stroke-width: 1.5; }
          .bot { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .inst { fill: #2ea597; stroke: #1f7a70; stroke-width: 1.5; }
          .nt { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .it { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .lyr { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: end; letter-spacing: 0.5px; }
          .edge { stroke: #aab7b8; stroke-width: 2; fill: none; }
          .close { stroke: #037f0c; stroke-width: 2.5; fill: none; stroke-dasharray: 6 4; }
          .ann { fill: #037f0c; font: 600 12px sans-serif; text-anchor: middle; }
          .annf { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
        `}
      </style>

      <text className="lyr" x={120} y={54}>LAYER i (top)</text>
      <text className="lyr" x={120} y={144}>LAYER ii</text>
      <text className="lyr" x={120} y={234}>LAYER iii (bottom)</text>
      <text className="lyr" x={120} y={324}>INSTANCES</text>

      {/* edges */}
      <path className="edge" d="M410,70 L250,130" />
      <path className="edge" d="M410,70 L590,130" />
      <path className="edge" d="M250,150 L210,210" />
      <path className="edge" d="M250,150 L370,210" />
      <path className="edge" d="M590,150 L590,210" />
      <path className="edge" d="M210,230 L180,290" />
      <path className="edge" d="M210,230 L300,290" />
      <path className="edge" d="M370,230 L420,290" />
      <path className="edge" d="M590,230 L600,290" />

      {/* top node */}
      <rect className="top" x={360} y={45} width={100} height={32} rx={6} />
      <text className="nt" x={410} y={66}>NN1</text>

      {/* mid nodes */}
      <rect className="mid" x={200} y={125} width={100} height={32} rx={6} />
      <text className="nt" x={250} y={146}>NN2</text>
      <rect className="mid" x={540} y={125} width={100} height={32} rx={6} />
      <text className="nt" x={590} y={146}>NN3</text>

      {/* bottom nodes */}
      <rect className="bot" x={160} y={205} width={100} height={32} rx={6} />
      <text className="nt" x={210} y={226}>NN4</text>
      <rect className="bot" x={320} y={205} width={100} height={32} rx={6} />
      <text className="nt" x={370} y={226}>NN5</text>
      <rect className="bot" x={540} y={205} width={100} height={32} rx={6} />
      <text className="nt" x={590} y={226}>NN6</text>

      {/* instances */}
      <rect className="inst" x={140} y={285} width={80} height={34} rx={6} />
      <text className="it" x={180} y={307}>i-1</text>
      <rect className="inst" x={260} y={285} width={80} height={34} rx={6} />
      <text className="it" x={300} y={307}>i-2</text>
      <rect className="inst" x={380} y={285} width={80} height={34} rx={6} />
      <text className="it" x={420} y={307}>i-3</text>
      <rect className="inst" x={560} y={285} width={80} height={34} rx={6} />
      <text className="it" x={600} y={307}>i-4</text>

      {/* closeness annotation: i-1 and i-2 share NN4 */}
      <path className="close" d="M165,325 C200,360 280,360 315,325" />
      <text className="ann" x={240} y={378}>i-1 + i-2 share NN4 (bottom) = closest</text>

      {/* far annotation */}
      <text className="annf" x={600} y={360}>i-4 only shares NN1 = furthest</text>
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
            description="Placement on AWS is two separate things — what you can command before launch, and what you can only read after. Confuse them and you will reach for the API to do a job only a capacity reservation can do."
          >
            {'23. EC2 Topology, Placement Groups & KV Locality'}
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mental model: control versus observability.</strong> Everything in this
            section divides cleanly into two buckets. One bucket holds the levers that{' '}
            <em>control</em> where instances physically land — cluster placement groups,
            On-Demand Capacity Reservations created inside them, and Capacity Blocks for ML.
            The other bucket holds exactly one tool that only lets you <em>observe</em> the
            placement you already got —{' '}
            <code>DescribeInstanceTopology</code>. The single most common mistake an SA sees
            is treating the observability tool as a control lever: asking the topology API to
            &quot;launch my instances close together.&quot; It cannot. It describes running
            instances and nothing else.
          </Box>
          <Box variant="p">
            <strong>Why a vLLM section cares about racks at all.</strong> Two of vLLM&apos;s
            multi-node paths are latency-sensitive to physical proximity. In disaggregated
            serving (<strong>section 10</strong>) the KV cache is read from the prefiller by
            the decoder over NIXL/EFA; in multi-node tensor- and pipeline-parallel serving the
            engine runs NCCL collectives every layer. Both ride the same OS-bypass fabric
            covered in <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong> and in the
            sibling{' '}
            <Link external href="../efa/">
              Elastic Fabric Adapter (EFA) deep dive
            </Link>
            . The fabric is fast, but its speed assumes the endpoints are close. This section
            is about how you make them close — and how you find out whether they are.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Six mechanisms, two jobs. Read the 'kind' column first — it tells you whether the thing decides placement or merely reports it."
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
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html">
              [Tier-1: EC2 placement strategies, accessed 2026-06-07]
            </Link>
            ,{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html">
              [Tier-1: Capacity Blocks for ML, accessed 2026-06-07]
            </Link>
            , and{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html">
              [Tier-1: DescribeInstanceTopology API reference, accessed 2026-06-07]
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The control levers and the observer, side by side. Left of the dashed line is decided before the instances exist; right of it can only be read once they are running."
          >
            Diagram 1 — control levers vs the post-launch observer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ControlVsObserveDiagram />
          <Box variant="p">
            The flow is one-directional. You choose a control lever; the instances land on a
            high-bisection network segment; <em>only then</em> can{' '}
            <code>DescribeInstanceTopology</code> tell you the shape of where they landed, which
            you feed into rank/pair assignment. There is no arrow back from the API to the
            placement — the API is a mirror, not a steering wheel.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A cluster placement group is the workhorse. Know exactly what it promises and what it merely makes likely."
          >
            CONTROL — cluster placement groups
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS defines a cluster placement group as{' '}
            <em>
              &quot;a logical grouping of instances within a single Availability Zone&quot;
            </em>{' '}
            whose members{' '}
            <em>
              &quot;enjoy a higher per-flow throughput limit for TCP/IP traffic and are placed
              in the same high-bisection bandwidth segment of the network&quot;
            </em>{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html">
              [Tier-1: EC2 placement strategies, accessed 2026-06-07]
            </Link>
            . The concrete number the docs commit to: instances inside a cluster placement
            group{' '}
            <em>&quot;can use up to 10 Gbps for single-flow traffic&quot;</em> while instances
            outside one are capped at <em>&quot;up to 5 Gbps for single-flow traffic&quot;</em>{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html">
              [Tier-1, same source]
            </Link>
            . That 2x single-flow headroom is the headline reason it is the default lever for
            tightly-coupled jobs.
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
                failure. Built for HDFS/HBase/Cassandra — anti-affinity, not proximity.
              </Box>
            </div>
            <div>
              <Box variant="h3">spread</Box>
              <Box variant="p">
                Each instance on distinct hardware, max seven running per AZ per group. Maximum
                isolation for a few critical nodes. The opposite of what KV locality wants.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Cluster PG is a request, not a guarantee — and it has sharp edges">
            <SpaceBetween size="s">
              <Box variant="p">
                The docs are explicit that scaling a cluster placement group risks an{' '}
                <em>insufficient capacity error</em>, and recommend a{' '}
                <em>single launch request</em> with a <em>single instance type</em> to reduce
                that risk{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html">
                  [Tier-1: EC2 placement strategies, accessed 2026-06-07]
                </Link>
                . A cluster placement group cannot span Availability Zones, and the per-pair
                throughput is{' '}
                <em>&quot;limited by the slower of the two instances&quot;</em> (same source).
              </Box>
              <Box variant="p">
                The mitigation AWS itself recommends is to{' '}
                <em>
                  &quot;reserve capacity explicitly in the cluster placement group by creating
                  an On-Demand Capacity Reservation in the cluster placement group&quot;
                </em>{' '}
                — and note you <em>cannot</em> reserve capacity with zonal Reserved Instances,
                which can&apos;t target a placement group (same source). That is the ODCR-in-PG
                pattern in the next panel.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two ways to pin capacity AND proximity together — one you wire by hand, one AWS wires for you."
          >
            CONTROL — pinning capacity: ODCR-in-PG vs Capacity Blocks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">ODCR inside a cluster placement group</Box>
              <Box variant="p">
                You create the cluster placement group, then create an On-Demand Capacity
                Reservation <em>in</em> it. The reservation now guarantees both that the
                capacity exists and that it lives on the packed segment. This is the explicit
                AWS recommendation for scaling a cluster placement group without hitting
                insufficient-capacity errors{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html">
                  [Tier-1: EC2 placement strategies, accessed 2026-06-07]
                </Link>
                . Manual, durable, and yours to keep — fits a long-running fleet.
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
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html">
                  [Tier-1: Capacity Blocks for ML, accessed 2026-06-07]
                </Link>
                . No named placement group to create. Up to 64 instances per block, up to 256
                across blocks, reservable up to 8 weeks out (same source).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="The key distinction for KV locality">
            Both give you proximity. The difference is who creates the placement object: with
            an ODCR-in-PG <em>you</em> name the cluster placement group and pin the reservation
            to it; with Capacity Blocks AWS auto-places into an UltraCluster and there is{' '}
            <em>no named placement group at all</em>. If your tooling assumes a placement-group
            name exists (some schedulers and IaC modules do), a Capacity Block will surprise it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="DescribeInstanceTopology is a diagnostic. It tells you how close your running nodes already are — it has no power to make them close."
          >
            OBSERVABILITY — DescribeInstanceTopology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The API{' '}
            <em>
              &quot;describes a tree-based hierarchy that represents the physical host placement
              of your EC2 instances within an Availability Zone or Local Zone&quot;
            </em>{' '}
            so you can{' '}
            <em>
              &quot;determine the relative proximity of your EC2 instances within the AWS
              network to support your tightly coupled workloads&quot;
            </em>{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html">
              [Tier-1: DescribeInstanceTopology API reference, accessed 2026-06-07]
            </Link>
            . It is firmly post-launch: the prerequisites require instances be in the{' '}
            <code>running</code> state — you{' '}
            <em>&quot;can&apos;t get topology information for instances ... in any other state&quot;</em>{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html">
              [Tier-1: EC2 topology prerequisites, accessed 2026-06-07]
            </Link>
            .
          </Box>
          <Box variant="p">
            Each instance reports a <code>NetworkNodes</code> list ordered top-down, where{' '}
            <em>&quot;the network node that is connected to the instance is the last network
            node in the list (the bottom layer)&quot;</em>{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html">
              [Tier-1: how EC2 topology works, accessed 2026-06-07]
            </Link>
            . The number of layers is instance-type dependent. The prerequisites page lists
            exactly which types return three nodes versus four:
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">3 network nodes (3 layers)</Box>
              <Box variant="p">
                P3dn, P4d, P4de, <strong>P5, P5e, P5en</strong>, P6e-GB200, Trn1, Trn1n,{' '}
                <strong>Trn2</strong>, Trn2u, plus the G6e/G7e and HPC families{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html">
                  [Tier-1: EC2 topology prerequisites, accessed 2026-06-07]
                </Link>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">4 network nodes (4 layers)</Box>
              <Box variant="p">
                Only <strong>p6-b200.48xlarge</strong> and{' '}
                <strong>p6-b300.48xlarge</strong> return four nodes{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html">
                  [Tier-1, same source]
                </Link>
                . The extra layer reflects how those instances connect deeper into the network
                hierarchy.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="error" header="You cannot launch close with this API — only read close">
            The API surface confirms it: <code>DescribeInstanceTopology</code> takes filters,
            instance IDs, and placement-group <em>names</em> as <em>read</em> inputs and returns
            a topology view{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html">
              [Tier-1: DescribeInstanceTopology API reference, accessed 2026-06-07]
            </Link>
            . There is no parameter that places, reserves, or moves anything. Proximity must
            come from the control levers above; this API only tells you what you got.
          </Alert>
          <ExpandableSection headerText="How to read the NetworkNodes output (the proximity rule)">
            <SpaceBetween size="s">
              <Box variant="p">
                AWS gives a precise rule:{' '}
                <em>
                  &quot;To work out which instances are close to each other, first find common
                  network nodes in the bottom layer. If there are no common network nodes in the
                  bottom layer, then find common network nodes in the upper layers&quot;
                </em>{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html">
                  [Tier-1: how EC2 topology works, accessed 2026-06-07]
                </Link>
                . And:{' '}
                <em>
                  &quot;the fewer the number of hops between network nodes, the closer the
                  instances are to each other&quot;
                </em>{' '}
                (same source). Two instances sharing the same <em>bottom-layer</em> node are the
                tightest pairing you can get — that is the basis of rank/pair assignment.
              </Box>
              <Box variant="p">
                There is also a pre-launch sibling,{' '}
                <code>DescribeCapacityReservationTopology</code>, which AWS frames as{' '}
                <em>planning and management mode</em> versus{' '}
                <code>DescribeInstanceTopology</code>&apos;s{' '}
                <em>post-launch execution mode</em>; the reservation variant shows a{' '}
                <em>partial</em> node set (1, 2, or 3 nodes) until instances actually launch{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html">
                  [Tier-1, same source]
                </Link>
                .
              </Box>
              <Box variant="p">
                <strong>[SPECULATIVE]</strong> Practitioners often describe the{' '}
                <code>nn-...</code> node identifiers as effectively account-scoped opaque
                handles — useful for relative comparison <em>within</em> your account, not as a
                stable, cross-account physical map. The AWS reference pages document the
                hierarchy and the comparison rule but do <em>not</em> state a hashing or
                per-account-uniqueness guarantee on this page, so treat the IDs as relative
                grouping keys, not absolute coordinates.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two instances under one bottom-layer node are the closest pairing. This is the picture rank/pair assignment is built on."
          >
            Diagram 2 — the NetworkNodes hierarchy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <NetworkNodesDiagram />
          <Box variant="p">
            Read each instance&apos;s path bottom-up. <strong>i-1</strong> and{' '}
            <strong>i-2</strong> both connect to <strong>NN4</strong> — they share a bottom-layer
            node, so they are the closest pair and the obvious candidates to pair as a
            prefiller/decoder cell or as adjacent TP ranks. <strong>i-3</strong> shares only{' '}
            <strong>NN2</strong> (an upper layer) with them, so it is further. <strong>i-4</strong>{' '}
            shares only <strong>NN1</strong>, the top — the furthest of the four. This mirrors
            the worked example in the AWS docs{' '}
            <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html">
              [Tier-1: how EC2 topology works, accessed 2026-06-07]
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The pattern isn't theoretical — Amazon's own production inference fleet uses the topology API to pair nodes."
          >
            Proof point — Amazon Rufus pairs nodes by topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon&apos;s Rufus shopping assistant runs multi-node inference on Trainium with
            vLLM, and AWS describes the exact control/observe split this section argues for. Per
            the engineering blog, the deployment system{' '}
            <em>
              &quot;gathers this information using the Amazon EC2 DescribeInstanceTopology API to
              pair nodes based on their underlying network topology&quot;
            </em>{' '}
            so that{' '}
            <em>
              &quot;cross-node operations can utilize the high-bandwidth, low-latency EFA network
              available to instances&quot;
            </em>{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/">
              [Tier-2: AWS ML blog — scaling Rufus on Trainium with vLLM, accessed 2026-06-07]
            </Link>
            . A vLLM <em>leader</em> node handles scheduling and orchestration while{' '}
            <em>follower</em> nodes run the distributed computation (same source) — and the
            leader/follower cell is composed by{' '}
            <em>&quot;pairing nodes based on their physical location and proximity&quot;</em>{' '}
            (same source). That is the topology API used precisely as a post-launch observer to
            assign which nodes work together — not to place them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The most important caveat in this section. Spell it out for any team about to assume the docs say more than they do."
          >
            Honest unknowns — what AWS does NOT publish
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="No per-layer latency numbers, no public spine/leaf map">
            AWS publishes the topology <em>hierarchy</em> and a relative proximity rule, but{' '}
            <strong>no per-network-layer latency figures</strong> and{' '}
            <strong>no public mapping from physical spine/leaf switches to NetworkNode IDs</strong>.
            You can rank pairs as closer or further; you cannot read a microsecond budget off a
            layer. Any &quot;layer iii is X μs faster than layer ii&quot; claim would be
            fabrication — the docs simply do not say it.
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
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html">
                  [Tier-1: EFA + NCCL guide, Step 12, accessed 2026-06-07]
                </Link>
                .
              </Box>
              <Box variant="p">
                The <strong>EFA + NIXL</strong> inference guide — which covers exactly the
                prefiller/decoder KV transfer vLLM uses — walks through launching EFA-enabled
                instances and even a vLLM disaggregated test, but{' '}
                <strong>never mentions cluster placement groups at all</strong>{' '}
                <Link external href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html">
                  [Tier-1: EFA + NIXL guide, accessed 2026-06-07]
                </Link>
                .
              </Box>
              <Box variant="p">
                <strong>[SPECULATIVE]</strong> The natural inference is that
                point-to-point KV transfer (one prefiller streaming to one decoder over NIXL/EFA)
                may be less placement-sensitive than dense collective AllReduce across many ranks,
                where the slowest path gates every step. But AWS does not state this. Until they
                do, the safe engineering call is to keep prefiller and decoder pools in the same
                proximity domain — a cluster placement group, ODCR-in-PG, or Capacity Block —
                because the cost of doing so is near zero and the cost of being wrong is paid on
                every token.
              </Box>
            </SpaceBetween>
          </Alert>
          <Alert type="info" header="Gotcha — Kubernetes inference schedulers do NOT score on physical network topology">
            <SpaceBetween size="s">
              <Box variant="p">
                If you serve vLLM on Kubernetes (<strong>section 17 — llm-d, KServe &amp; the
                Gateway API Inference Extension</strong>), be clear about what the smart
                scheduler does and does not do. The inference-aware schedulers — llm-d&apos;s
                Endpoint Picker (EPP) and the Gateway API Inference Extension — score endpoints on{' '}
                <strong>KV-cache state, prefix-cache hits, queue depth, and observed latency</strong>.
                They do <strong>not</strong> score on which physical network node a pod&apos;s host
                sits under.
              </Box>
              <Box variant="p">
                So on AWS the proximity guarantee cannot come from the request scheduler. It has
                to be established one layer down — at the <strong>node-group / placement-group</strong>{' '}
                level — by launching the node group into a cluster placement group, an ODCR-in-PG,
                or a Capacity Block before any pod is scheduled. The scheduler then makes good
                routing decisions <em>within</em> a pool that proximity has already made fast. Mix
                these up and you will tune EPP weights for hours chasing a latency cliff that is
                actually two pods three network hops apart.
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
            Putting it together — the SA playbook
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Establish proximity at launch, not at schedule time.</strong> Pick the
            control lever that matches ownership: a cluster placement group (often with an
            ODCR-in-PG) for a long-running fleet, or a Capacity Block for a short GPU window
            where AWS auto-places into an UltraCluster.
          </Box>
          <Box variant="p">
            <strong>2. Keep coupled pools in the same proximity domain.</strong> Put multi-node
            TP/PP ranks — and, conservatively, paired prefiller/decoder pools — inside the same
            cluster placement group or Capacity Block. The NCCL guide recommends it for
            collectives; for KV transfer it is the prudent default until AWS says otherwise.
          </Box>
          <Box variant="p">
            <strong>3. Observe after launch and assign accordingly.</strong> Call{' '}
            <code>DescribeInstanceTopology</code> on the running fleet, find instances sharing a
            bottom-layer node, and assign ranks or prefiller/decoder cells so the busiest
            cross-node traffic runs between the closest nodes — the Rufus pattern.
          </Box>
          <Box variant="p">
            <strong>4. Do not ask the API to place, and do not ask the scheduler to be
            topology-aware.</strong> The topology API only observes; the Kubernetes inference
            schedulers score on KV/prefix/queue/latency, not racks. Proximity is a launch-time
            decision, full stop.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
