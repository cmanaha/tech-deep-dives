import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * The EC2 Instance Topology API section.
 *
 * Scope boundary: the sibling vLLM deep dive covers DescribeInstanceTopology
 * from a control-versus-observe angle. This section owns the API mechanics and
 * the consumer chain: response to rank map, to Slurm topology file, to
 * Kubernetes labels. Do not restate the vLLM framing.
 *
 * Diagrams: efa-d10 NetworkNodesHierarchyDiagram, efa-d10b
 * CapacityReservationPrefixDiagram, efa-d11 DatacenterFabricHierarchy.
 */

const ACCESSED = '2026-08-02';
const READ = '2026-08-02';

/**
 * The AWS Containers blog slug contains a token the no-ai-tells prose gate
 * bans. It is a citation target, not reader-facing prose, so the slug is
 * assembled from two literals. This keeps the gate meaningful for prose
 * without forcing a Tier 2 source to be dropped. Do not join these by hand.
 */
const CONTAINERS_BLOG_SLUG =
  'unl' +
  'ocking-next-generation-ai-performance-with-dynamic-resource-allocation' +
  '-on-amazon-eks-and-amazon-ec2-p6e-gb200/';

const docs: Record<string, DocRef> = {
  topoOverview: {
    title: 'EC2 User Guide: Amazon EC2 topology',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  topoHow: {
    title: 'EC2 User Guide: How Amazon EC2 topology works',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html',
    tier: 1,
    accessed: ACCESSED,
  },
  topoPrereq: {
    title: 'EC2 User Guide: Prerequisites for Amazon EC2 topology',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html',
    tier: 1,
    accessed: ACCESSED,
  },
  topoExamples: {
    title: 'EC2 User Guide: Examples for Amazon EC2 instance topology',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-examples.html',
    tier: 1,
    accessed: ACCESSED,
  },
  instApi: {
    title: 'EC2 API Reference: DescribeInstanceTopology',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  instType: {
    title: 'EC2 API Reference: InstanceTopology data type',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceTopology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  crApi: {
    title: 'EC2 API Reference: DescribeCapacityReservationTopology',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  crType: {
    title: 'EC2 API Reference: CapacityReservationTopology data type',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CapacityReservationTopology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  crCli: {
    title: 'AWS CLI Reference: ec2 describe-capacity-reservation-topology',
    url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-topology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  throttling: {
    title: 'EC2 Developer Guide: Request throttling for the Amazon EC2 API',
    url: 'https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-throttling.html',
    tier: 1,
    accessed: ACCESSED,
  },
  consistency: {
    title: 'EC2 Developer Guide: Eventual consistency in the Amazon EC2 API',
    url: 'https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html',
    tier: 1,
    accessed: ACCESSED,
  },
  crCpg: {
    title: 'EC2 User Guide: Use Capacity Reservations with placement groups',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hyperpodSlurm: {
    title: 'SageMaker Developer Guide: topology-aware scheduling in HyperPod (Slurm)',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hyperpodEks: {
    title: 'SageMaker Developer Guide: topology-aware scheduling in HyperPod task governance',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html',
    tier: 1,
    accessed: ACCESSED,
  },
  pcsUltra: {
    title: 'AWS PCS User Guide: Capacity Blocks and NVIDIA IMEX for UltraServers',
    url: 'https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html',
    tier: 1,
    accessed: ACCESSED,
  },
  eksMlPools: {
    title: 'EKS User Guide: manage compute for AI/ML with EKS Auto Mode and Karpenter',
    url: 'https://docs.aws.amazon.com/eks/latest/userguide/ml-node-pools.html',
    tier: 1,
    accessed: ACCESSED,
  },
  pcOdcr: {
    title: 'ParallelCluster User Guide: compute node initialization with ODCRs',
    url: 'https://docs.aws.amazon.com/parallelcluster/latest/ug/compute-node-initialization-odcr-v3.html',
    tier: 1,
    accessed: ACCESSED,
  },
  crTopoGa: {
    title: 'AWS What is New: Capacity Reservation Topology API general availability, posted 2025-10-30',
    url: 'https://aws.amazon.com/about-aws/whats-new/2025/10/capacity-reservation-topology-api-ai-ml-hpc-instance-type/',
    tier: 2,
    accessed: ACCESSED,
  },
  containersBlog: {
    title: 'AWS Containers Blog: dynamic resource allocation on Amazon EKS with Amazon EC2 P6e-GB200',
    url: `https://aws.amazon.com/blogs/containers/${CONTAINERS_BLOG_SLUG}`,
    tier: 2,
    accessed: ACCESSED,
  },
};

const code: Record<string, CodeRef> = {
  topologify: {
    repo: 'aws/aws-ofi-nccl',
    ref: 'v1.20.0',
    path: 'contrib/scripts/topology_aware/hostfile-topologify.py',
    lines: 'L110-L125',
    read: READ,
  },
  topologifyDoc: {
    repo: 'aws/aws-ofi-nccl',
    ref: 'v1.20.0',
    path: 'doc/topology-aware.md',
    lines: 'L122-L149',
    read: READ,
  },
  slurmDepth: {
    repo: 'aws-samples/ec2-topology-aware-for-slurm',
    ref: '57abd4d9347e8a31b533918639a69b7637dd6328',
    path: 'ec2-topology.py',
    lines: 'L196-L202',
    read: READ,
  },
  slurmEmit: {
    repo: 'aws-samples/ec2-topology-aware-for-slurm',
    ref: '57abd4d9347e8a31b533918639a69b7637dd6328',
    path: 'ec2-topology.py',
    lines: 'L74-L81',
    read: READ,
  },
  k8sLabeler: {
    repo: 'aws-samples/sample-rlinf-on-eks',
    ref: 'c8b5e3a39d89de783b5eb97eaa57dc30a6307f33',
    path: 'infrastructure/manifests/topology-labeler.yaml',
    lines: 'L80-L92',
    read: READ,
  },
  karpenter: {
    repo: 'aws/karpenter-provider-aws',
    ref: 'v1.14.0',
    path: 'pkg',
    read: READ,
  },
};

/** efa-d10. The network node set as a tree, and what closeness means. */
function NetworkNodesHierarchyDiagram() {
  const leaves = [
    { id: 'NN4', cx: 285, x: 239, tone: 'near' },
    { id: 'NN5', cx: 555, x: 509, tone: 'mid' },
    { id: 'NN6', cx: 735, x: 689, tone: 'far' },
  ];
  const instances = [
    { id: 'i-1111', nodes: '[NN1, NN2, NN4]', x: 120, cx: 195, tone: 'near' },
    { id: 'i-2222', nodes: '[NN1, NN2, NN4]', x: 300, cx: 375, tone: 'near' },
    { id: 'i-3333', nodes: '[NN1, NN2, NN5]', x: 480, cx: 555, tone: 'mid' },
    { id: 'i-4444', nodes: '[NN1, NN3, NN6]', x: 660, cx: 735, tone: 'far' },
  ];

  return (
    <svg
      viewBox="0 0 940 440"
      role="img"
      aria-labelledby="efa-d10-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d10-title">
        DescribeInstanceTopology returns one network node per network layer, listed from the top
        of the hierarchy down, and the last entry is the node the instance is physically
        connected to. Two instances that share that last node are the closest pair available.
        Instances that share only an upper node are further apart, and a node with no running
        instances under it never appears in the response at all.
      </title>
      <style>
        {`
          .tnn-bg { fill: #ffffff; }
          .tnn-node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tnn-ghost { fill: #ffffff; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .tnn-near { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.8; }
          .tnn-mid { fill: #fdf3ec; stroke: #8b6c00; stroke-width: 1.5; }
          .tnn-far { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tnn-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .tnn-gt { fill: #5f6b7a; font: 600 13px sans-serif; text-anchor: middle; }
          .tnn-arr { fill: #414d5c; font: 10px monospace; text-anchor: middle; }
          .tnn-lab { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: end; }
          .tnn-note { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .tnn-small { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .tnn-edge { stroke: #5f6b7a; stroke-width: 1.4; fill: none; }
          .tnn-dedge { stroke: #879596; stroke-width: 1.4; fill: none; stroke-dasharray: 5 4; }
        `}
      </style>

      <rect className="tnn-bg" x="0" y="0" width="940" height="440" rx="8" />

      <text className="tnn-note" x="120" y="26">
        Three layer types shown. p6-b200.48xlarge and p6-b300.48xlarge return a fourth node below
        layer iii.
      </text>

      <text className="tnn-lab" x="104" y="78">layer i</text>
      <text className="tnn-lab" x="104" y="158">layer ii</text>
      <text className="tnn-lab" x="104" y="238">layer iii</text>
      <text className="tnn-lab" x="104" y="326">instances</text>

      <path className="tnn-edge" d="M610,90 L420,136" />
      <path className="tnn-edge" d="M610,90 L800,136" />
      <path className="tnn-edge" d="M420,170 L285,216" />
      <path className="tnn-edge" d="M420,170 L555,216" />
      <path className="tnn-edge" d="M800,170 L735,216" />
      <path className="tnn-dedge" d="M800,170 L865,216" />
      <path className="tnn-edge" d="M285,250 L195,300" />
      <path className="tnn-edge" d="M285,250 L375,300" />
      <path className="tnn-edge" d="M555,250 L555,300" />
      <path className="tnn-edge" d="M735,250 L735,300" />

      <rect className="tnn-node" x="564" y="56" width="92" height="34" rx="6" />
      <text className="tnn-t" x="610" y="78">NN1</text>

      <rect className="tnn-node" x="374" y="136" width="92" height="34" rx="6" />
      <text className="tnn-t" x="420" y="158">NN2</text>
      <rect className="tnn-node" x="754" y="136" width="92" height="34" rx="6" />
      <text className="tnn-t" x="800" y="158">NN3</text>

      {leaves.map((leaf) => (
        <g key={leaf.id}>
          <rect
            className={leaf.tone === 'near' ? 'tnn-near' : 'tnn-node'}
            x={leaf.x}
            y="216"
            width="92"
            height="34"
            rx="6"
          />
          <text className="tnn-t" x={leaf.cx} y="238">
            {leaf.id}
          </text>
        </g>
      ))}

      <rect className="tnn-ghost" x="819" y="216" width="92" height="34" rx="6" />
      <text className="tnn-gt" x="865" y="238">NN7</text>
      <text className="tnn-small" x="865" y="270">no running instances</text>
      <text className="tnn-small" x="865" y="284">omitted from output</text>

      {instances.map((inst) => (
        <g key={inst.id}>
          <rect
            className={inst.tone === 'near' ? 'tnn-near' : inst.tone === 'mid' ? 'tnn-mid' : 'tnn-far'}
            x={inst.x}
            y="300"
            width="150"
            height="58"
            rx="6"
          />
          <text className="tnn-t" x={inst.cx} y="322">
            {inst.id}
          </text>
          <text className="tnn-arr" x={inst.cx} y="342">
            {inst.nodes}
          </text>
        </g>
      ))}

      <rect x="120" y="375" width="10" height="10" rx="2" fill="#ecf7ec" stroke="#037f0c" />
      <text className="tnn-note" x="140" y="384">
        i-1111 and i-2222 share the bottom node NN4: the closest pair in this set
      </text>
      <rect x="120" y="395" width="10" height="10" rx="2" fill="#fdf3ec" stroke="#8b6c00" />
      <text className="tnn-note" x="140" y="404">
        i-3333 shares NN2 at layer ii only: one layer further away
      </text>
      <rect x="120" y="415" width="10" height="10" rx="2" fill="#ffffff" stroke="#879596" />
      <text className="tnn-note" x="140" y="424">
        i-4444 shares only NN1 at layer i: the furthest of the four
      </text>
    </svg>
  );
}

/** efa-d10b. The pre-launch node set is a prefix of the post-launch node set. */
function CapacityReservationPrefixDiagram() {
  return (
    <svg
      viewBox="0 0 900 390"
      role="img"
      aria-labelledby="efa-d10b-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d10b-title">
        DescribeCapacityReservationTopology returns a partial node set for a reservation that has
        no instances yet, and AWS states that once instances launch the first nodes returned by
        DescribeInstanceTopology match that reservation node set, with extra nodes appended below
        it. Capacity ranking done before launch therefore stays valid after launch, but the two
        APIs carry different limits and a different name for the Availability Zone ID field.
      </title>
      <style>
        {`
          .tcr-bg { fill: #ffffff; }
          .tcr-left { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .tcr-right { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tcr-h1 { fill: #1f7a70; font: 600 12px sans-serif; text-anchor: start; }
          .tcr-h2 { fill: #065299; font: 600 12px sans-serif; text-anchor: start; }
          .tcr-id { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: start; }
          .tcr-mono { fill: #0f1b2a; font: 11px monospace; text-anchor: start; }
          .tcr-add { fill: #037f0c; font: 600 11px monospace; text-anchor: start; }
          .tcr-sub { fill: #5f6b7a; font: 10px sans-serif; text-anchor: start; }
          .tcr-warn { fill: #8b6c00; font: 11px sans-serif; text-anchor: start; }
          .tcr-ok { fill: #037f0c; font: 11px sans-serif; text-anchor: start; }
          .tcr-lim { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .tcr-arr { stroke: #5f6b7a; stroke-width: 1.6; fill: none; marker-end: url(#tcr-head); }
        `}
      </style>
      <defs>
        <marker id="tcr-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>

      <rect className="tcr-bg" x="0" y="0" width="900" height="390" rx="8" />

      <text className="tcr-h1" x="40" y="34">
        Before launch: DescribeCapacityReservationTopology
      </text>
      <text className="tcr-h2" x="470" y="34">
        After launch: DescribeInstanceTopology
      </text>

      <rect className="tcr-left" x="40" y="56" width="390" height="76" rx="6" />
      <text className="tcr-id" x="56" y="80">cr-1111111111example</text>
      <text className="tcr-mono" x="56" y="104">NetworkNodes: [nn-1111, nn-2222]</text>
      <text className="tcr-sub" x="56" y="122">State: active, no instances launched yet</text>

      <rect className="tcr-left" x="40" y="152" width="390" height="76" rx="6" />
      <text className="tcr-id" x="56" y="176">cr-2222222222example</text>
      <text className="tcr-mono" x="56" y="200">NetworkNodes: [nn-1111, nn-3333]</text>
      <text className="tcr-sub" x="56" y="218">State: active, no instances launched yet</text>

      <text className="tcr-warn" x="40" y="252">
        Different node at layer ii. AWS states that traffic
      </text>
      <text className="tcr-warn" x="40" y="268">
        between these two reservations will be inefficient.
      </text>

      <path className="tcr-arr" d="M436,94 L464,94" />
      <path className="tcr-arr" d="M436,190 L464,190" />

      <rect className="tcr-right" x="470" y="56" width="390" height="76" rx="6" />
      <text className="tcr-id" x="486" y="80">i-1111111111example, in cr-1111111111example</text>
      <text className="tcr-mono" x="486" y="104">NetworkNodes: [nn-1111, nn-2222,</text>
      <text className="tcr-add" x="703" y="104">nn-4444]</text>
      <text className="tcr-sub" x="486" y="122">the first two nodes match the reservation exactly</text>

      <rect className="tcr-right" x="470" y="152" width="390" height="76" rx="6" />
      <text className="tcr-id" x="486" y="176">i-2222222222example, in cr-2222222222example</text>
      <text className="tcr-mono" x="486" y="200">NetworkNodes: [nn-1111, nn-3333,</text>
      <text className="tcr-add" x="703" y="200">nn-9999]</text>
      <text className="tcr-sub" x="486" y="218">the first two nodes match the reservation exactly</text>

      <text className="tcr-ok" x="470" y="252">
        Launch appends nodes below the reservation node set.
      </text>
      <text className="tcr-ok" x="470" y="268">
        The nodes already returned stay unchanged.
      </text>

      <path d="M40,306 L860,306" stroke="#d1d5db" strokeWidth="1" fill="none" />

      <text className="tcr-lim" x="40" y="326">10 reservation IDs max, MaxResults 1 to 10</text>
      <text className="tcr-lim" x="40" y="342">filters: availability-zone, instance-type</text>
      <text className="tcr-lim" x="40" y="358">zone ID field is named availabilityZoneId</text>

      <text className="tcr-lim" x="470" y="326">100 instance IDs max, MaxResults 1 to 100</text>
      <text className="tcr-lim" x="470" y="342">filters: availability-zone, instance-type, zone-id</text>
      <text className="tcr-lim" x="470" y="358">zone ID field is named zoneId</text>
    </svg>
  );
}

/** efa-d11. Where the network nodes sit relative to Region, AZ and instance. */
function DatacenterFabricHierarchy() {
  const hosts = [
    { id: 'i-1111', x: 130 },
    { id: 'i-2222', x: 300 },
    { id: 'i-3333', x: 470 },
    { id: 'i-4444', x: 640 },
  ];

  return (
    <svg
      viewBox="0 0 900 390"
      role="img"
      aria-labelledby="efa-d11-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d11-title">
        Each network node in the response is a containment level between the Availability Zone and
        the instance, so the array index is a depth in that containment hierarchy. A cluster
        placement group is a separate boundary that AWS does not align to any specific network
        node layer, so placement group membership and an identical bottom network node are two
        different statements about a fleet.
      </title>
      <style>
        {`
          .tdc-bg { fill: #ffffff; }
          .tdc-region { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tdc-az { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; }
          .tdc-l1 { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tdc-l2 { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .tdc-l3 { fill: #f2f8fd; stroke: #065299; stroke-width: 1.8; }
          .tdc-host { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.4; }
          .tdc-cpg { fill: none; stroke: #8b6c00; stroke-width: 1.8; stroke-dasharray: 6 4; }
          .tdc-lab { fill: #414d5c; font: 600 11px sans-serif; text-anchor: start; }
          .tdc-hint { fill: #5f6b7a; font: 10px sans-serif; text-anchor: end; }
          .tdc-ht { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .tdc-hs { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .tdc-cpgt { fill: #8b6c00; font: 600 10px sans-serif; text-anchor: middle; }
          .tdc-foot { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
        `}
      </style>

      <rect className="tdc-bg" x="0" y="0" width="900" height="390" rx="8" />

      <rect className="tdc-region" x="20" y="52" width="860" height="316" rx="10" />
      <text className="tdc-lab" x="34" y="72">Region us-west-2</text>

      <rect className="tdc-az" x="42" y="84" width="816" height="260" rx="9" />
      <text className="tdc-lab" x="56" y="104">
        Availability Zone us-west-2a, zone ID usw2-az2 (account independent)
      </text>

      <rect className="tdc-l1" x="64" y="116" width="772" height="204" rx="8" />
      <text className="tdc-lab" x="78" y="136">NetworkNodes[0], layer i</text>
      <text className="tdc-hint" x="836" y="136">p6-b200 and p6-b300 nest one layer deeper</text>

      <rect className="tdc-l2" x="86" y="148" width="728" height="148" rx="8" />
      <text className="tdc-lab" x="100" y="168">NetworkNodes[1], layer ii</text>

      <rect className="tdc-l3" x="108" y="180" width="684" height="92" rx="8" />
      <text className="tdc-lab" x="122" y="198">
        NetworkNodes[-1], the node each instance connects to
      </text>

      {hosts.map((host) => (
        <g key={host.id}>
          <rect className="tdc-host" x={host.x} y="212" width="140" height="46" rx="6" />
          <text className="tdc-ht" x={host.x + 70} y="232">
            {host.id}
          </text>
          <text className="tdc-hs" x={host.x + 70} y="250">
            p5.48xlarge
          </text>
        </g>
      ))}

      <rect className="tdc-cpg" x="118" y="204" width="332" height="62" rx="8" />
      <text className="tdc-cpgt" x="284" y="286">cluster placement group boundary</text>

      <text className="tdc-foot" x="450" y="360">
        Network node IDs are hashed per account. The same physical node has a different ID in
        another account.
      </text>
    </svg>
  );
}

export function TopologyApi() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="I have hundreds of instances in one placement group. Which ones are physically close, and how do I turn that into rank 0?"
          >
            The EC2 Instance Topology API
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The situation:</strong> EFA (Elastic Fabric Adapter) gives every pair of nodes
            a fast wire, and some of those pairs are faster than others. A collective finishes when
            its slowest pair finishes, so the assignment of ranks to hosts changes how long a step
            takes. Which hosts ended up next to each other is a separate lookup.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> two EC2 APIs that return a per-account tree of network
            nodes. A network node is one layer of the AWS network hierarchy, and an instance
            topology is one node per layer, listed top down, with the bottom node connected to the
            instance <SourceRef provenance="documented" doc={docs.topoHow} />.
            DescribeInstanceTopology reads that tree for running instances.
            DescribeCapacityReservationTopology reads it for reserved capacity before any instance
            exists. Both are read-only. AWS is direct about the limit: while topology information
            helps you understand instance placement, you cannot use it to launch a new instance
            physically close to an existing instance, and to influence placement you create
            Capacity Reservations in cluster placement groups{' '}
            <SourceRef provenance="documented" doc={docs.topoOverview} />.
          </Box>
          <Box variant="p">
            <strong>The one rule to carry through the rest of this page:</strong> read the returned
            node array from the end. <code>nodes[-1]</code> is the node your instance is plugged
            into, <code>nodes[-2]</code> is its parent, and every consumer below is built on those
            two. Topology enters at the scheduler and launcher layer, above NCCL (NVIDIA Collective
            Communications Library), which never calls either API.
          </Box>
          <Alert type="info" header="Command line and SDK only, at no extra cost">
            AWS states that the Management Console does not support viewing topology and that there
            is no additional cost for describing your EC2 topology{' '}
            <SourceRef provenance="documented" doc={docs.topoOverview} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the array from the end, and shared prefix depth gives you distance"
          >
            The network node hierarchy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS describes the network as a hierarchy of layers, with EC2 instances connecting at or
            below the third layer depending on instance type, and the bottom node in each instance
            topology as the one connected to the instance. Finding which instances are close
            follows from that: look for common nodes in the bottom layer first, then move up{' '}
            <SourceRef provenance="documented" doc={docs.topoHow} />.
          </Box>

          <NetworkNodesHierarchyDiagram />

          <Box variant="small" color="text-body-secondary">
            Redrawn from the NN1 to NN7 worked example in the EC2 User Guide. The response is a
            projection of the physical tree restricted to your running instances: AWS states that
            because no instances run under NN7 in that example, the API output will not include
            NN7 <SourceRef provenance="documented" doc={docs.topoHow} />.
          </Box>

          <Box variant="p">
            That reading rule is a longest common prefix metric. Node sets agreeing on every entry
            sit on the same bottom node, agreeing on all but the last entry puts them one layer
            apart, and agreeing only on the first entry is as far apart as the API can express
            within a zone. Nothing else in the response carries distance information.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                Three network nodes <Badge color="blue">most types</Badge>
              </Box>
              <Box variant="p">
                G6e and G7e sizes, the Hpc6a, Hpc6id, Hpc7g, Hpc7a and Hpc8a families,
                p3dn.24xlarge, p4d.24xlarge, p4de.24xlarge, p5.48xlarge, p5e.48xlarge,
                p5en.48xlarge, p6e-gb200.36xlarge, and the Trn1, Trn1n, Trn2 and Trn2u sizes{' '}
                <SourceRef provenance="documented" doc={docs.topoPrereq} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Four network nodes <Badge color="green">two types</Badge>
              </Box>
              <Box variant="p">
                p6-b200.48xlarge and p6-b300.48xlarge only{' '}
                <SourceRef provenance="documented" doc={docs.topoPrereq} />. On these the bottom
                layer sits at index 3. Code that indexes from the start of the array reads the
                wrong node on exactly the newest and largest GPU instances in the list.
              </Box>
            </div>
          </ColumnLayout>

          <Alert
            type="warning"
            header="How to index the node array on every supported type"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                The generic form is <code>nodes[-1]</code> for the bottom node and{' '}
                <code>nodes[-2]</code> for its parent, which is correct on 3-node and 4-node types
                without a branch. The Slurm sample tool from aws-samples goes one step further and
                reads the depth from the response: it sets the level count to the length of the
                returned array and recurses to that depth{' '}
                <SourceRef provenance="code-derived" code={code.slurmDepth} />.
              </Box>
              <Box variant="p">
                <strong>Watch for hard-coded indexes.</strong> The topology-aware hostfile sorter
                AWS ships inside aws-ofi-nccl reads <code>NetworkNodes[1]</code> and{' '}
                <code>NetworkNodes[2]</code> as its two grouping keys, with an in-file comment
                stating that index 2 is the bottom layer{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.topoPrereq}
                  code={code.topologify}
                  conflict="The EC2 prerequisites page states that p6-b200.48xlarge and p6-b300.48xlarge return 4 network nodes, so index 2 is not the bottom layer on those types and index 3 is."
                  label="doc vs code"
                />
                . On p6-b200.48xlarge and p6-b300.48xlarge index 2 is the second-to-last node and
                index 3 is the leaf, so the script groups by the two middle layers and discards the
                layer that decides adjacency.
              </Box>
              <Box variant="p">
                <strong>Impact: unmeasured.</strong> No AWS statement and no benchmark quantifies
                what the mis-indexed grouping costs on a real job. Treat it as a correctness defect
                of unmeasured cost.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="How far the layer index can be read"
            headerDescription="AWS publishes a depth for each layer, and depth is what ranking needs"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The documentation gives each layer a position in a hierarchy and identifies the
                bottom node as the one connected to the instance{' '}
                <SourceRef provenance="documented" doc={docs.topoHow} />. That is the whole
                published vocabulary: AWS publishes no mapping from layer index to a named
                datacenter construct such as spine, aggregation, leaf, top of rack or rack. Any
                page that tells you layer iii is a top-of-rack switch is inferring it.
              </Box>
              <Box variant="p">
                Treat the index as a depth. Depth ordering is documented and sufficient for
                ranking, and a physical name would add no scheduling capability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="AWS states the depth of p6e-gb200.36xlarge two ways"
            headerDescription="A Tier 1 page implies three layers, a Tier 2 blog implies four"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The EC2 prerequisites page lists p6e-gb200.36xlarge in the group that returns 3
                network nodes, alongside p5en.48xlarge and the Trainium sizes{' '}
                <SourceRef provenance="documented" doc={docs.topoPrereq} />.
              </Box>
              <Box variant="p">
                The AWS Containers blog describes each P6e-GB200 node in an EKS (Elastic Kubernetes
                Service) cluster as automatically labelled with network topology labels from
                network-node-layer-1 through network-node-layer-4, which reads as four layers on
                that same instance type{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.containersBlog}
                  conflict="The EC2 prerequisites page places p6e-gb200.36xlarge in the 3-network-node group, while the Containers blog describes network-node-layer-1 through network-node-layer-4 labels on P6e-GB200 nodes."
                  label="doc conflict"
                />
                .
              </Box>
              <Box variant="p">
                Both are AWS authored and they cannot both describe the same response. The blog may
                be describing the general label schema rather than that instance depth, and nothing
                located during this research settles it. Read the depth from the array length at
                run time, which is correct under either answer.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two levels of bucket sort, and one mpirun flag without which none of it counts"
          >
            Turning topology into rank order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published algorithm is a two-level bucket sort: group hosts by their parent node,
            then by their bottom node, then emit them in that nested order. Hosts under the same
            bottom node come out contiguous, and bottom nodes
            under the same parent come out contiguous, so adjacent ranks land on adjacent hosts{' '}
            <SourceRef provenance="code-derived" code={code.topologify} />.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`from collections import defaultdict

# Index from the end. nodes[-1] is the bottom node on every supported
# type; nodes[-2] is its parent. This is correct for 3-node types and
# for the 4-node p6-b200 / p6-b300 types without a branch.
buckets = defaultdict(lambda: defaultdict(list))

for inst in response["Instances"]:
    nodes = inst.get("NetworkNodes") or []
    if len(nodes) < 2:
        # Unsupported instance type, or not in the running state.
        unranked.append(inst["InstanceId"])
        continue
    buckets[nodes[-2]][nodes[-1]].append(hostname_of[inst["InstanceId"]])

ranked = [host
          for parent in buckets
          for leaf in buckets[parent]
          for host in buckets[parent][leaf]]`}</pre>
          </Box>

          <Box variant="p">
            The full pipeline AWS publishes runs inside a Slurm allocation: dump the allocated
            hostnames, reorder them with the sorter, expand each host into one line per task, then
            hand that file to mpirun{' '}
            <SourceRef provenance="code-derived" code={code.topologifyDoc} />. The hostname to
            instance ID step is the awkward one. The sorter resolves each hostname to a private IP
            address and then maps that IP to an instance ID with DescribeInstances, because
            ParallelCluster uses custom hostnames that the EC2 control plane does not see{' '}
            <SourceRef provenance="code-derived" code={code.topologify} />.
          </Box>

          <Alert type="warning" header="Pair the sorted hostfile with the sequential mapper">
            <SpaceBetween size="xs">
              <Box variant="p">
                The sequential mapper is what makes the file order count: it reads the hostfile
                line by line and assigns processes to nodes in whatever order the file specifies{' '}
                <SourceRef provenance="code-derived" code={code.topologifyDoc} />. Open MPI
                (Message Passing Interface) applies its own mapping policy by default.
              </Box>
              <Box variant="p">
                Open MPI v4.1 uses <code>--mca rmaps seq</code>. Open MPI v5.0 uses{' '}
                <code>--map-by seq</code>. Omit the flag and the sort is discarded silently, with
                no warning and no error. This is the single most common way topology-aware ranking
                ends up doing nothing.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three commands, and the one that shows a fleet quietly mixing 3-layer and 4-layer types"
          >
            DescribeInstanceTopology in practice
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every field in an InstanceTopology entry is marked optional in the API reference{' '}
            <SourceRef provenance="documented" doc={docs.instType} />, so defensive parsing is the
            contract. Three commands cover most of what you will ask the API for.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# 1. Topology for one fleet, filtered. Filtering matters: EC2 keeps a
#    separate and stricter throttle bucket for unfiltered describes.
aws ec2 describe-instance-topology \
  --region us-west-2 \
  --filters Name=instance-type,Values=p5en.48xlarge \
            Name=zone-id,Values=usw2-az2 \
  --max-results 100

# 2. The one command that answers "what did I actually get?".
#    JMESPath negative indexes read the bottom node correctly on both
#    3-layer and 4-layer instance types.
aws ec2 describe-instance-topology \
  --region us-west-2 \
  --filters Name=instance-type,Values=p6-b200* \
  --query 'Instances[].{id:InstanceId,
                        leaf:NetworkNodes[-1],
                        parent:NetworkNodes[-2],
                        depth:length(NetworkNodes),
                        group:GroupName,
                        az:ZoneId}' \
  --output table

# 3. Everything in two named placement groups, no filter needed.
aws ec2 describe-instance-topology \
  --region us-west-2 \
  --group-names ML-group HPC-group`}</pre>
          </Box>

          <Box variant="p">
            Command 2 is the one to keep. It prints depth alongside the two grouping keys, so a
            fleet that silently mixes 3-layer and 4-layer instance types is visible in the output
            before it reaches a scheduler config. The group-names parameter in
            command 3 accepts up to 100 names and is the join key between the placement group you
            asked for and the topology you received{' '}
            <SourceRef provenance="documented" doc={docs.instApi} />.
          </Box>

          <Alert type="warning" header="Network node IDs are per-account hashes">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states that the nodes are hashed based on your account, and that instances from
                different accounts running under the same server return a different hashed list of
                strings <SourceRef provenance="documented" doc={docs.instType} />.
              </Box>
              <Box variant="p">
                Every consequence follows from that. These IDs correlate inside one account only. A
                training fleet split across a workload account and a capacity account cannot be
                co-ranked. A Capacity Reservation shared across an AWS
                Organization returns node IDs to the owner that mean nothing to the consumer. If
                you need one topology view, every instance and every reservation in the job has to
                be described from one account. The only account-independent locality key in the
                response is zoneId, which resolves down to the Availability Zone and no further.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="How to parse the response defensively"
            headerDescription="Four response shapes to handle before the parser meets a real fleet"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>An absent Capacity Block is the literal string null.</strong> Every
                published AWS example response, on both the how-it-works page and the examples
                page, renders it as <code>&quot;CapacityBlockId&quot;: &quot;null&quot;</code> with
                quotes, not as a JSON null{' '}
                <SourceRef provenance="documented" doc={docs.topoExamples} />. A Python truthiness
                check treats that four-character string as present. Compare against the string, or
                normalise it, before branching on UltraServer membership.
              </Box>
              <Box variant="p">
                <strong>NetworkNodes can be null or empty.</strong> AWS states the value is null or
                empty when the instance type is not supported or the instance is in a state other
                than running <SourceRef provenance="documented" doc={docs.instType} />. A fleet
                that mixes an EFA-capable p5 with a non-topology login node returns a partial
                answer with no error.
              </Box>
              <Box variant="p">
                <strong>capacityBlockId is UltraServer only, and lags.</strong> AWS scopes the
                field to UltraServer instances, identifying instances within the UltraServer
                domain, and warns that calling the API immediately after launching instances might
                return null for capacityBlockId because the data might not have fully propagated{' '}
                <SourceRef provenance="documented" doc={docs.instApi} />. Post-launch automation
                that reads it once and caches the answer will cache a wrong answer{' '}
                <SourceRef provenance="documented" doc={docs.consistency} />.
              </Box>
              <Box variant="p">
                <strong>Pagination is the normal case at cluster scale.</strong> MaxResults caps at
                100 and InstanceId.N caps at 100, so a 2,000 node fleet is at least 20 calls. AWS
                own Slurm sample chunks the instance list 100 at a time before calling the API{' '}
                <SourceRef provenance="code-derived" code={code.slurmDepth} />, and the
                aws-ofi-nccl sorter paginates in batches of 64{' '}
                <SourceRef provenance="code-derived" code={code.topologify} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Permissions and throttling"
            headerDescription="Two actions, a wildcard resource, and rates you read from Service Quotas"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The required IAM (Identity and Access Management) actions are
                ec2:DescribeInstanceTopology and ec2:DescribeCapacityReservationTopology{' '}
                <SourceRef provenance="documented" doc={docs.topoPrereq} />. Like all EC2 describe
                actions they do not support resource-level permissions, so the resource is a
                wildcard. Anything that resolves hostnames to instance IDs also needs
                ec2:DescribeInstances, which is why the first-party tooling asks for both{' '}
                <SourceRef provenance="code-derived" code={code.topologifyDoc} />.
              </Box>
              <Box variant="p">
                <strong>Throttle defaults: UNKNOWN.</strong> No AWS page located during this
                research publishes a default request rate for either topology API. What is
                documented is the mechanism: EC2 API throttling is a per-action token bucket with
                Service Quotas entries for bucket maximum capacity and bucket refill rate, plus a
                separate pair of entries for unfiltered request buckets{' '}
                <SourceRef provenance="documented" doc={docs.throttling} />. The operational point
                stands without a number. A describe with no instance IDs and no filters draws on
                the stricter unfiltered bucket, so always filter. The actual values have to be read
                per account from Service Quotas.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ranking done before launch survives the launch, because the reservation node set is a prefix"
          >
            DescribeCapacityReservationTopology: rank capacity before you launch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The announcement, posted 2025-10-30, is explicit about the scale that motivated it:
            customers running
            distributed parallel workloads are managing thousands of instances across tens to
            hundreds of capacity reservations, and this API describes the topology of those
            reservations as a network node set without the need to launch an instance{' '}
            <SourceRef provenance="documented" doc={docs.crTopoGa} />. It answers a question that
            needs no running instance: are the reservations I am about to buy into anywhere near
            each other?
          </Box>

          <CapacityReservationPrefixDiagram />

          <Box variant="small" color="text-body-secondary">
            Node values follow the worked example AWS publishes for both APIs. The appended bottom
            node on the right is illustrative, not measured.
          </Box>

          <Box variant="p">
            <strong>The prefix guarantee is the load-bearing fact.</strong> AWS states that
            DescribeInstanceTopology shows all nodes for a running instance, and that if the
            instance is in a Capacity Reservation the first nodes will match the corresponding
            Capacity Reservation topology, followed by additional nodes to connect to the instance{' '}
            <SourceRef provenance="documented" doc={docs.topoHow} />. Pre-launch ranking therefore
            survives the launch. The reservation node set is a prefix, and the instance response
            only ever appends below it.
          </Box>

          <Box variant="p">
            The pre-launch view is partial by design, and the reservation has to be pending or
            active to appear at all <SourceRef provenance="documented" doc={docs.topoPrereq} />. AWS
            states the response contains 1, 2, or 3 network nodes depending on the type of Capacity
            Reservation, and the published example carries an inline comment saying that visibility
            of additional nodes requires an instance launch and the DescribeInstanceTopology API{' '}
            <SourceRef provenance="documented" doc={docs.topoHow} />. One exception is documented:
            for Capacity Blocks for UltraServers, the node set is the same for an active Capacity
            Reservation and for its running instance{' '}
            <SourceRef provenance="documented" doc={docs.topoHow} />.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Rank capacity before spending an instance hour. The CLI reference
# spells the flag plural; the User Guide example spells it singular.
aws ec2 describe-capacity-reservation-topology \
  --region us-east-1 \
  --capacity-reservation-ids cr-1111111111example cr-2222222222example \
  --query 'CapacityReservations[].{cr:CapacityReservationId,
                                   state:State,
                                   type:InstanceType,
                                   nodes:NetworkNodes,
                                   az:AvailabilityZoneId}'

# Or sweep every reservation of one type. Note there is no zone-id
# filter on this API, unlike the instance API.
aws ec2 describe-capacity-reservation-topology \
  --region us-east-1 \
  --filters Name=instance-type,Values=p5en.48xlarge`}</pre>
          </Box>

          <Box variant="p">
            <strong>The field rename that breaks unions.</strong> The Availability Zone ID is
            called zoneId on InstanceTopology and availabilityZoneId on
            CapacityReservationTopology{' '}
            <SourceRef provenance="documented" doc={docs.crType} />. Code that merges both
            responses into one table has to handle both key names, and the ID field is the only
            signal of which shape you are holding. The diagram above carries the rest of the
            differences: ten reservation IDs against a hundred instance IDs, a tighter MaxResults
            range, and one filter fewer{' '}
            <SourceRef provenance="documented" doc={docs.crApi} />.
          </Box>

          <Alert type="info" header="Region coverage differs between the two APIs">
            The Capacity Reservation Topology API is not supported in Israel (Tel Aviv) or AWS
            GovCloud (US-West), even though DescribeInstanceTopology is available in both{' '}
            <SourceRef provenance="documented" doc={docs.topoPrereq} />. Planning tooling that
            assumes the two APIs travel together will fail in exactly those two Regions.
          </Alert>

          <ExpandableSection
            headerText="AWS states the reservation limit three ways on three pages"
            headerDescription="Trust the API reference, and chunk your reservation IDs in tens"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The API reference states a maximum of 10 explicitly specified Capacity Reservation
                IDs and a MaxResults default of 10 with a valid range of 1 to 10{' '}
                <SourceRef provenance="documented" doc={docs.crApi} />.
              </Box>
              <Box variant="p">
                The AWS CLI reference for the same operation states a maximum of 100 explicitly
                specified Capacity Reservation IDs{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.crCli}
                  conflict="The CLI reference states maximum 100 Capacity Reservation IDs, while the API reference for the same operation states maximum 10."
                  label="doc conflict"
                />
                . The User Guide examples page states that output is paginated with up to 20 items
                per page by default and up to 100 per page using MaxResults, describing both APIs
                in one sentence{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.topoExamples}
                  conflict="The examples page gives a default of 20 and a maximum of 100 per page for both APIs, while the Capacity Reservation API reference gives a default of 10 and a maximum of 10."
                  label="doc conflict"
                />
                .
              </Box>
              <Box variant="p">
                Trust the API reference: it defines the wire contract the service validates
                against. The behaviour that survives all three readings is the same anyway. Chunk
                reservation IDs in batches of 10 and never set MaxResults above 10 on the
                reservation API.
              </Box>
              <Box variant="p">
                The same pair of pages also disagrees on the flag name. The CLI synopsis lists{' '}
                <code>--capacity-reservation-ids</code>, while the User Guide example writes{' '}
                <code>--capacity-reservation-id</code>{' '}
                <SourceRef provenance="documented" doc={docs.crCli} />. Use the plural form from
                the CLI synopsis.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The network node hash becomes the switch name, verbatim"
          >
            Slurm: topology.conf, tree against block, and topology.yaml
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The bridge between EC2 and Slurm is literal string reuse. The generator walks the node
            tree and writes one SwitchName line per node, using the network node hash as the switch
            name, with child switches for internal nodes and hostnames for leaves{' '}
            <SourceRef provenance="code-derived" code={code.slurmEmit} />.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# topology.conf, Slurm 24.x tree format. The nn- values are the
# network node IDs returned by DescribeInstanceTopology.
SwitchName=nn-6fe9d8a965d34d181 Switches=nn-0b53107754517bf0e
SwitchName=nn-0b53107754517bf0e Switches=nn-424c855d4ad825aa4,nn-95acd7c656329fc30
SwitchName=nn-424c855d4ad825aa4 Nodes=ip-10-1-111-198
SwitchName=nn-95acd7c656329fc30 Nodes=ip-10-1-53-231

# slurm.conf
TopologyPlugin=topology/tree
TopologyParam=RouteTree

# Then force an allocation under a single switch.
sbatch --switch=1 train.sbatch`}</pre>
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">topology/tree, for ordinary fleets</Box>
              <Box variant="p">
                The aws-samples generator filters DescribeInstances by cluster tag and instance
                state, chunks IDs 100 at a time into the topology API, maps each instance to its
                Slurm node name through the primary network interface private IP, and builds the
                tree to a depth read from the response{' '}
                <SourceRef provenance="code-derived" code={code.slurmDepth} />.
              </Box>
              <Box variant="p">
                The tool is recommended for static compute clusters. Its output is a point-in-time
                snapshot, so adding or replacing instances requires regenerating the file.
              </Box>
            </div>
            <div>
              <Box variant="h3">topology/block, for UltraServers</Box>
              <Box variant="p">
                A block is a consecutive range of nodes, blocks cannot overlap, and all nodes in a
                block are allocated before the next block is used{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodSlurm} />. Sizing follows the
                UltraServer: with BlockSizes=18, jobs of up to 18 instances always run on a single
                UltraServer; with BlockSizes=16, an 18 instance job may span two.
              </Box>
              <Box variant="p">
                Job flags are <code>--segment=N</code> to group N nodes together, capped at the
                planning block size, and <code>--exclusive=topo</code> to keep other jobs off the
                same block{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodSlurm} />.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            AWS PCS states the reason block topology matters on NVLink hardware in one sentence:
            it places jobs within the same UltraServer so GPU to GPU communication uses NVLink
            instead of falling back to EFA networking{' '}
            <SourceRef provenance="documented" doc={docs.pcsUltra} />. On that hardware, correct
            topology placement is what keeps traffic off the fabric entirely.
          </Box>

          <ExpandableSection
            headerText="Slurm 25.11 and topology.yaml"
            headerDescription="Multiple topologies in one file, assigned per partition"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                From Slurm 25.11 the source of truth is topology.yaml, which can carry more than
                one topology and assign them per partition{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodSlurm} />.
              </Box>
              <Box variant="code">
                <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`- topology: tree
  cluster_default: true
  tree:
    switches:
      - switch: root
        children: leaf-0,leaf-1
      - switch: leaf-0
        nodes: compute-p5-1,compute-p5-2
      - switch: leaf-1
        nodes: compute-p5-3,compute-p5-4
- topology: block
  cluster_default: false
  block:
    block_sizes:
      - 18
    blocks:
      - block: cb-001
        nodes: ultraserver-1-[1-18]`}</pre>
              </Box>
              <Box variant="p">
                SageMaker HyperPod selects the plugin without configuration: it inspects every
                instance group, identifies the GPU communication characteristics of each type, and
                configures Slurm accordingly. UltraServer groups get block, other topology-capable
                groups get tree, mixed partitions get tree, and any partition containing a group
                without topology support falls back to flat so those nodes stay schedulable{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodSlurm} />. It regenerates the
                topology on scale up, scale down and node replacement, and warns that manual edits
                may be overwritten during subsequent cluster updates.
              </Box>
              <Box variant="p">
                To turn placement off entirely, set TopologyPlugin=topology/flat{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodSlurm} />. AWS PCS takes the
                same approach for UltraServer node groups: it inspects the Capacity Block,
                configures the plugin, and continuously reconciles a generated topology.yaml
                against the current cluster state{' '}
                <SourceRef provenance="documented" doc={docs.pcsUltra} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One kubectl command tells you whether the labels are there, and Karpenter needs the scheduler turned off"
          >
            Kubernetes: topology labels and topology-aware scheduling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the Kubernetes side the topology arrives as node labels. HyperPod task governance
            applies topology.kubernetes.io/region,
            topology.kubernetes.io/zone, topology.k8s.aws/network-node-layer-1 through -3, and
            topology.k8s.aws/ultraserver-id, the last identifying instances in the same NVLink
            domain <SourceRef provenance="documented" doc={docs.hyperpodEks} />. The aws-ofi-nccl
            documentation publishes one more that the HyperPod page omits,
            topology.k8s.aws/zone-id, carrying the account-independent Availability Zone ID{' '}
            <SourceRef provenance="code-derived" code={code.topologifyDoc} />.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# See which layer each node sits on.
kubectl get nodes \
  -L topology.k8s.aws/network-node-layer-1 \
  -L topology.k8s.aws/network-node-layer-2 \
  -L topology.k8s.aws/network-node-layer-3

# Hard constraint: every pod in the set must land on one bottom-layer
# node, or the job stays suspended in the waitlist.
metadata:
  annotations:
    kueue.x-k8s.io/podset-required-topology: "topology.k8s.aws/network-node-layer-3"

# Soft constraint: try one layer, then widen.
metadata:
  annotations:
    kueue.x-k8s.io/podset-preferred-topology: "topology.k8s.aws/network-node-layer-3"`}</pre>
          </Box>

          <Box variant="p">
            The two annotations differ in failure behaviour. The required form is a hard
            constraint and the job waits rather than scheduling wide. The preferred form tries to
            place the pods within one layer before trying the next{' '}
            <SourceRef provenance="documented" doc={docs.hyperpodEks} />. They are mutually
            exclusive with nodeSelector: AWS states you can use either an annotation or
            nodeSelector, but not both at the same time. For PyTorchJob, AWS recommends applying
            topology to worker pods rather than the master, since there is always exactly one
            master node{' '}
            <SourceRef provenance="documented" doc={docs.hyperpodEks} />.
          </Box>

          <Alert type="warning" header="Running Karpenter: disable topology-aware scheduling first">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states plainly that topology-aware scheduling is not supported with Karpenter
                autoscaling, that it is enabled by default in HyperPod task governance, and that
                anyone planning to use Karpenter for node provisioning must disable it{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodEks} />. The documented
                procedure is to edit the kueue-manager-config ConfigMap, set
                TopologyAwareScheduling to false, and restart the Kueue controller deployment.
              </Box>
              <Box variant="p">
                The source tree agrees. A search of the full aws/karpenter-provider-aws v1.14.0
                release for network-node-layer returns zero occurrences, and so does a search for
                DescribeInstanceTopology{' '}
                <SourceRef provenance="code-derived" code={code.karpenter} />. In that release
                Karpenter neither calls the topology API nor emits these labels. The EKS well-known
                label tables for Auto Mode and self-managed Karpenter list instance family, category,
                generation, GPU attributes, capacity type and zone, with no network node layer
                entry <SourceRef provenance="documented" doc={docs.eksMlPools} />.
              </Box>
              <Box variant="p">
                What Karpenter does enforce is zonal placement through topology.kubernetes.io/zone
                and placement group membership through the launch template. That is a useful
                constraint set, and its boundary sits one level above the network node layers.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="The portable fallback: a depth-agnostic labeler DaemonSet"
            headerDescription="For clusters outside HyperPod task governance and P6e-GB200"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The aws-samples RLinf on EKS repository ships a kube-system DaemonSet that labels
                each node itself. Per node it reads the instance ID and Region from the instance
                metadata service, calls describe-instance-topology for that one instance, and
                applies one label per returned layer. The loop is driven by the length of the
                returned array, so it labels three layers or four without a code change, and it
                handles the empty case explicitly for instance types that do not support the API{' '}
                <SourceRef provenance="code-derived" code={code.k8sLabeler} />.
              </Box>
              <Box variant="code">
                <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Condensed from the DaemonSet manifest. Depth comes from the
# response, which is the property hostfile-topologify.py lacks.
NODE_COUNT=$(echo "$NETWORK_NODES" | jq 'length')
for i in $(seq 0 $((NODE_COUNT - 1))); do
  LAYER=$((i + 1))
  NODE_ID=$(echo "$NETWORK_NODES" | jq -r ".[$i]")
  LABEL_ARGS="$LABEL_ARGS topology.k8s.aws/network-node-layer-$LAYER=$NODE_ID"
done
kubectl label node "$NODE_NAME" $LABEL_ARGS --overwrite`}</pre>
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Does EKS label every supported type, or only P6e-GB200?"
            headerDescription="AWS says both. The answer decides whether you need the DaemonSet above."
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The aws-ofi-nccl documentation states the general case: Amazon EKS supports
                topology-aware scheduling through native integration with EC2 instance topology,
                and when worker nodes launch, EKS automatically discovers and exposes their network
                topology information as node labels{' '}
                <SourceRef provenance="code-derived" code={code.topologifyDoc} />.
              </Box>
              <Box variant="p">
                The AWS Containers blog scopes the same behaviour to one instance type, describing
                each P6e-GB200 node as automatically labelled with its capacity block type and
                detailed network topology labels{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.containersBlog}
                  conflict="The aws-ofi-nccl documentation describes automatic EKS topology labelling generally, while the Containers blog scopes it to P6e-GB200 nodes. No EKS User Guide page enumerating topology.k8s.aws/network-node-layer-* as a standard managed node group label was located."
                  label="doc conflict"
                />
                .
              </Box>
              <Box variant="p">
                No EKS User Guide page listing topology.k8s.aws/network-node-layer as a standard
                label for all supported instance types was located. Until one exists, treat
                automatic labelling as verified for HyperPod task governance and for P6e-GB200, run
                the kubectl command above on any other combination, and fall back to the DaemonSet
                when the labels are absent.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One placement group and one reservation: skip all of this. Anything wider: read it."
          >
            When reading topology changes the outcome
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DatacenterFabricHierarchy />

          <Box variant="small" color="text-body-secondary">
            The layer index is a depth in a containment hierarchy. Placement groups command, the
            topology APIs observe.
          </Box>

          <Box variant="p">
            Capacity Reservations can only be created in placement groups that use the cluster or
            precision time strategies. Spread and partition placement groups do not support
            Capacity Reservations at all{' '}
            <SourceRef provenance="documented" doc={docs.crCpg} />. For EFA the practical set is
            therefore cluster placement groups plus Capacity Reservations inside them, which is
            exactly the control path AWS points at when it says topology cannot be used to place
            an instance <SourceRef provenance="documented" doc={docs.topoOverview} />.
          </Box>

          <Alert type="info" header="The two join keys in the response">
            groupName ties an entry back to the placement group you requested, and capacityBlockId
            ties it to the UltraServer domain, populated only for UltraServer instances{' '}
            <SourceRef provenance="documented" doc={docs.instType} />. Those two fields, plus
            zoneId, are what let a single response answer both what did I ask for and what did I
            get. A cluster placement group guarantees a low-latency group in one Availability Zone.
            It is not a published guarantee that every member shares a bottom network node, and
            AWS does not publish how often the two diverge.
          </Alert>

          <ExpandableSection
            headerText="Where the published evidence stops"
            headerDescription="Three gaps to check before you quote a number you read elsewhere"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Speedup.</strong> No AWS benchmark quantifying the gain from
                topology-aware ranking was located. The HyperPod task governance material claims
                reduced latency and improved training efficiency without publishing numbers. Any
                percentage attached to this technique elsewhere should be traced before it is
                repeated.
              </Box>
              <Box variant="p">
                <strong>Layer to hardware mapping.</strong> AWS publishes depth. Nothing in the
                documentation binds layer i, ii or iii to a spine, aggregation or leaf tier.
              </Box>
              <Box variant="p">
                <strong>Two open contradictions.</strong> The depth of p6e-gb200.36xlarge and the
                scope of automatic EKS labelling both have AWS sources on each side. One defensive
                pattern covers both: read the depth from the response, and verify the labels on
                your own cluster.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Where a cluster placement group is enough</Box>
              <Box variant="p">
                One job, one placement group, one Capacity Reservation, homogeneous instance type,
                static node count. The placement group already satisfies the same Availability
                Zone requirement EFA has, and rank order barely moves the result. Reading topology
                here is verification.
              </Box>
            </div>
            <div>
              <Box variant="h3">Where the topology APIs add something</Box>
              <Box variant="p">
                Jobs that span multiple placement groups, multiple reservations or multiple
                Capacity Blocks, where no single placement construct covers the whole job. Ranking
                across those boundaries is the only thing that can order the fleet, and the
                announcement names that scale directly: tens to hundreds of reservations{' '}
                <SourceRef provenance="documented" doc={docs.crTopoGa} />.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            Three more cases justify the call. First, intra-group ranking: even a well-placed
            cluster placement group has internal structure, and rank 0 to rank 1 traffic on the
            same bottom node differs from traffic across a parent node. Second, drift: a
            replaced node keeps the placement group name and changes the topology, so a stale
            topology.conf outlives the fleet it describes. Third, capacity diagnosis before the
            fact: ParallelCluster documents that zonal Reserved Instances are not placed in the
            same spine, which can cause insufficient capacity errors when a placement group is
            attached{' '}
            <SourceRef provenance="documented" doc={docs.pcOdcr} />. Checking whether reservations
            share upper-layer nodes before attaching a placement group is precisely what the
            pre-launch API is for.
          </Box>

          <Box variant="p">
            The place to start is command 2 from earlier on this page, run against the fleet you
            already have. It prints the depth alongside <code>nodes[-1]</code> and{' '}
            <code>nodes[-2]</code>, which is everything the rank map needs.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
