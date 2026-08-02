import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

const ACCESSED = '2026-08-02';
const READ = '2026-08-02';

const docs: Record<string, DocRef> = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: ACCESSED,
  },
  efaStart: {
    title: 'EC2 User Guide: Get started with EFA and MPI',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html',
    tier: 1,
    accessed: ACCESSED,
  },
  ac: {
    title: 'EC2 instance types: Accelerated computing',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hpc: {
    title: 'EC2 instance types: HPC optimized',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html',
    tier: 1,
    accessed: ACCESSED,
  },
  capacityBlocks: {
    title: 'EC2 User Guide: how Capacity Blocks for ML work',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hyperpodEks: {
    title: 'SageMaker Developer Guide: topology-aware scheduling in HyperPod task governance',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html',
    tier: 1,
    accessed: ACCESSED,
  },
  eksMlPools: {
    title: 'EKS User Guide: manage compute for AI/ML with EKS Auto Mode and Karpenter',
    url: 'https://docs.aws.amazon.com/eks/latest/userguide/ml-node-pools.html',
    tier: 1,
    accessed: ACCESSED,
  },
  eksNodeClass: {
    title: 'EKS User Guide: create a NodeClass, static network interface configuration',
    url: 'https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html',
    tier: 1,
    accessed: ACCESSED,
  },
  karpenterNodeClasses: {
    title: 'Karpenter documentation: EC2NodeClass',
    url: 'https://karpenter.sh/docs/concepts/nodeclasses/',
    tier: 1,
    accessed: ACCESSED,
  },
  karpenterDisruption: {
    title: 'Karpenter documentation: Disruption',
    url: 'https://karpenter.sh/docs/concepts/disruption/',
    tier: 1,
    accessed: ACCESSED,
  },
  smCapacity: {
    title: 'SageMaker Developer Guide: Get compute capacity for SageMaker Training Jobs',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html',
    tier: 1,
    accessed: ACCESSED,
  },
  smTrainEfa: {
    title: 'SageMaker Developer Guide: Run Training with EFA',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-training-efa.html',
    tier: 1,
    accessed: ACCESSED,
  },
  ddpSupport: {
    title: 'SageMaker Developer Guide: SMDDP supported frameworks, Regions and instance types',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html',
    tier: 1,
    accessed: ACCESSED,
  },
  ddpIntro: {
    title: 'SageMaker Developer Guide: Introduction to the SMDDP library',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html',
    tier: 1,
    accessed: ACCESSED,
  },
  ddpRelease: {
    title: 'SageMaker Developer Guide: SMDDP release notes',
    url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html',
    tier: 1,
    accessed: ACCESSED,
  },
  eksBestPractices: {
    title: 'EKS Best Practices Guide: AI/ML networking, Spot instance risks with EFA co-location',
    url: 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-networking.html',
    tier: 2,
    accessed: ACCESSED,
  },
  trn2: {
    title: 'AWS product page: Amazon EC2 Trn2 Instances',
    url: 'https://aws.amazon.com/ec2/instance-types/trn2/',
    tier: 2,
    accessed: ACCESSED,
  },
};

const code: Record<string, CodeRef> = {
  karpenterPlacementGroup: {
    repo: 'aws/karpenter-provider-aws',
    ref: 'v1.14.0',
    path: 'pkg/apis/v1/ec2nodeclass.go',
    lines: 'L56-L60',
    read: READ,
  },
  karpenterPkg: {
    repo: 'aws/karpenter-provider-aws',
    ref: 'v1.14.0',
    path: 'pkg',
    read: READ,
  },
  eksBpSpot: {
    repo: 'aws/aws-eks-best-practices',
    ref: '828f285d5888010993bd8948bc2b8305181e513d',
    path: 'latest/bpg/aiml/aiml_networking.adoc',
    lines: 'L35-L43',
    read: READ,
  },
};

interface DecisionRow {
  scenario: string;
  efaNeeded: string;
  reason: string;
  recommendation: string;
}

const decisions: DecisionRow[] = [
  {
    scenario: 'Fine-tuning 7B model on 1 node',
    efaNeeded: 'No',
    reason: 'Single node: NVLink handles GPU communication',
    recommendation: 'p5.48xlarge or trn1.32xlarge, no EFA needed',
  },
  {
    scenario: 'Pre-training 70B model on 8 nodes',
    efaNeeded: 'Yes',
    reason: 'Multi-node DDP/FSDP: allreduce is the bottleneck',
    recommendation: 'P5 with EFA, all 8 nodes in one Availability Zone. Cluster placement group recommended, not required',
  },
  {
    scenario: 'Pre-training 400B+ model on 100+ nodes',
    efaNeeded: 'Critical',
    reason: '3D parallelism requires sustained high-bandwidth inter-node communication',
    recommendation: 'P5/Trn2 with max EFA, topology-aware rank assignment',
  },
  {
    scenario: 'Serving Llama 3.1 70B',
    efaNeeded: 'No',
    reason: 'Fits on single P5 with 8x H100 (80GB each)',
    recommendation: 'Single P5 or trn1.32xlarge with TP=8',
  },
  {
    scenario: 'Serving Llama 3.1 405B (fp16)',
    efaNeeded: 'Yes',
    reason: '~810GB model: exceeds single P5 memory, needs multi-node TP',
    recommendation: '2x P5 with EFA, minimize TP across nodes',
  },
  {
    scenario: 'CFD simulation (1000 MPI ranks)',
    efaNeeded: 'Yes',
    reason: 'Tightly-coupled: halo exchange every timestep',
    recommendation: 'Hpc7a, every rank in one Availability Zone. Cluster placement group recommended, not required. Hpc7a is not Spot eligible',
  },
  {
    scenario: 'Batch embedding generation',
    efaNeeded: 'No',
    reason: 'Throughput-oriented, latency tolerant, usually single-node',
    recommendation: 'Inf2 or G5, standard networking',
  },
  {
    scenario: 'Mixture-of-Experts training (Mixtral-scale)',
    efaNeeded: 'Yes',
    reason: 'All-to-all communication for expert routing',
    recommendation: 'P5 with EFA: SRD handles asymmetric traffic patterns',
  },
];

export function DecisionGuide() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="EFA costs nothing to enable and quite a lot to operate. The decision is about the constraints, not the price.">
            Decision Guide
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EFA adds no charge of its own{' '}
            <SourceRef provenance="documented" doc={docs.efa} />, but it adds{' '}
            <strong>operational constraints</strong>: every instance in the job has to sit in one
            Availability Zone, plus capacity planning, security group configuration, and
            container/Kubernetes complexity. Use it when the performance benefit justifies these
            constraints.
          </Box>
          <Box variant="p">
            The single-AZ rule is the hard one. AWS states that EFA traffic cannot cross
            Availability Zones or VPCs (Virtual Private Clouds){' '}
            <SourceRef provenance="documented" doc={docs.efa} />. A cluster placement group is
            the recommended way to satisfy that rule and keep latency low, and AWS says in as
            many words that it is not an absolute requirement{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />. Skipping it is legal and
            usually a mistake.
          </Box>
        </SpaceBetween>
      </Container>

      <Table
        header={<Header variant="h2" description="Eight workloads, and the answer is No about as often as it is Yes.">Scenario-Based Recommendations</Header>}
        columnDefinitions={[
          { id: 'scenario', header: 'Scenario', cell: (item) => <strong>{item.scenario}</strong> },
          {
            id: 'efaNeeded',
            header: 'EFA?',
            cell: (item) => {
              const type = item.efaNeeded === 'Critical' ? 'success' : item.efaNeeded === 'Yes' ? 'info' : 'stopped';
              return <StatusIndicator type={type}>{item.efaNeeded}</StatusIndicator>;
            },
          },
          { id: 'reason', header: 'Why', cell: (item) => item.reason },
          { id: 'recommendation', header: 'Recommendation', cell: (item) => item.recommendation },
        ]}
        items={decisions}
        sortingDisabled
        variant="full-page"
        footer={
          <Box variant="small" color="text-body-secondary">
            Every recommendation above states the Availability Zone constraint rather than a
            placement group requirement, because that is what AWS documents{' '}
            <SourceRef provenance="documented" doc={docs.efa} />{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} label="doc: efa-start" />.
            Spot eligibility per family comes from the instance specification tables{' '}
            <SourceRef provenance="documented" doc={docs.ac} />{' '}
            <SourceRef provenance="documented" doc={docs.hpc} label="doc: hpc" />. Instance
            rates live in the Pricing Analysis section, which pins every figure to a price list
            version. No rate is restated here.
          </Box>
        }
      />

      <Container
        header={<Header variant="h2" description="Answer these in order. Two of them can end the conversation before EFA is ever configured.">The Three Questions</Header>}
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">1. Is this multi-node?</Box>
            <Box variant="p">
              If your workload runs on a single instance, stop here. EFA is irrelevant.
              NVLink handles all intra-node GPU communication.
            </Box>
            <Alert type="info">
              Most inference and fine-tuning workloads are single-node.
            </Alert>
          </div>
          <div>
            <Box variant="h3">2. Is it communication-bound?</Box>
            <Box variant="p">
              Even multi-node workloads may not benefit from EFA if communication is a
              small fraction of total time. Embarrassingly parallel workloads, large-batch
              training with infrequent syncs, and loosely-coupled HPC don&apos;t need it.
            </Box>
            <Alert type="info">
              Profile your workload. If &gt;10% of time is in NCCL/MPI, EFA will help.
            </Alert>
          </div>
          <div>
            <Box variant="h3">3. Can every node live in one Availability Zone?</Box>
            <Box variant="p">
              This is the gate, not the placement group. AWS states that EFA traffic cannot
              cross Availability Zones or VPCs{' '}
              <SourceRef provenance="documented" doc={docs.efa} />, so a job that has to span
              zones cannot use EFA at all. A cluster placement group is the recommended way to
              land inside one zone with low latency, and AWS states it is not an absolute
              requirement{' '}
              <SourceRef provenance="documented" doc={docs.efaStart} />. Design training and HPC
              jobs to checkpoint frequently and tolerate AZ-level failure.
            </Box>
            <Alert type="info">
              For training: always checkpoint. For inference: consider failover to another AZ cluster.
            </Alert>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={<Header variant="h2" description="Three layers know about topology and none of them talks to the other two. Assembling them is the opportunity.">Topology-Aware Rank Assignment</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why it matters:</strong> Getting rank-to-GPU-to-NIC mapping wrong causes
            2-3x performance degradation. NCCL needs to know which GPU is physically closest
            to which EFA interface to minimize PCIe (Peripheral Component Interconnect Express) hops.
          </Box>
          <Box variant="p">
            <strong>How it works:</strong> <code>NCCL_TOPO_FILE</code> tells NCCL the physical
            topology: which GPUs connect to which NVSwitch, which NIC connects via which
            PCIe root complex. The <code>aws-ofi-nccl</code> plugin auto-detects this for
            known platforms (P4d, P5, P5en) and sets the topology file automatically. For
            custom AMIs or new instance types, verify with <code>NCCL_DEBUG=INFO</code> that
            the correct topology is detected.
          </Box>
          <Box variant="p">
            <strong>The tuner plugin:</strong> Beyond topology detection, the aws-ofi-nccl
            tuner (<code>libnccl-ofi-tuner.so</code>) dynamically selects the optimal NCCL
            algorithm and protocol for your specific topology. This replaces manual tuning
            of <code>NCCL_ALGO</code> and <code>NCCL_PROTO</code>. Always prefer the tuner
            over manual env vars.
          </Box>
          <Box variant="p">
            <strong>Three independent layers:</strong> (1) <strong>NCCL topology graph:</strong>
            intra-node, from XML or sysfs auto-detect. (2) <strong>aws-ofi-nccl platform
            detection:</strong> instance-type matching, NIC reordering. (3) <strong>EC2{' '}
            <code>DescribeInstanceTopology</code></strong>: inter-node physical hierarchy
            (3-4 layers of hashed network node IDs). These layers don&apos;t communicate with
            each other. The optimization opportunity is assembling them: use{' '}
            <code>DescribeInstanceTopology</code> to group instances by physical proximity,
            assign NCCL ranks so that communicating pairs are on the same network node, and
            let the tuner handle algorithm selection.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What Karpenter provisions for EFA, and the one capability it does not have"
          >
            EFA and Karpenter
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="error" header="Karpenter cannot do network-node topology-aware scheduling">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states that topology-aware scheduling is not supported with Karpenter
                autoscaling, that it is on by default in HyperPod task governance, and that
                anyone using Karpenter for node provisioning has to disable it by setting
                TopologyAwareScheduling to false in the kueue-manager-config ConfigMap and
                restarting the Kueue controller{' '}
                <SourceRef provenance="documented" doc={docs.hyperpodEks} />.
              </Box>
              <Box variant="p">
                The source tree agrees. A search of the aws/karpenter-provider-aws v1.14.0
                release for network-node-layer returns zero occurrences, and so does a search
                for DescribeInstanceTopology{' '}
                <SourceRef provenance="code-derived" code={code.karpenterPkg} />. Karpenter
                never calls the topology API and never emits those labels. The EKS well-known
                label tables for Auto Mode and self-managed Karpenter list instance family,
                category, generation, GPU attributes, capacity type and zone, with no network
                node layer entry <SourceRef provenance="documented" doc={docs.eksMlPools} />.
                For the part Karpenter does not cover, see the EC2 Instance Topology API
                section: node labels come from HyperPod task governance or from a labeler
                DaemonSet you run yourself.
              </Box>
            </SpaceBetween>
          </Alert>
          <Box variant="p">
            What Karpenter does do for EFA is provision the nodes and constrain where they
            land:
          </Box>
          <ul>
            <li><strong>Zonal pinning:</strong> a NodePool requirement on{' '}
            <code>topology.kubernetes.io/zone</code> keeps every node in one Availability Zone,
            which is the constraint EFA actually has{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.</li>
            <li><strong>Placement group as first-class API:</strong> since v1.14 the
            EC2NodeClass carries <code>spec.placementGroupSelector</code>, which resolves a
            placement group by name or by id, the two being mutually exclusive{' '}
            <SourceRef
              provenance="code-confirmed"
              doc={docs.karpenterNodeClasses}
              code={code.karpenterPlacementGroup}
            />. No launch template edit is needed. EKS Auto Mode exposes the same field on its
            own NodeClass{' '}
            <SourceRef provenance="documented" doc={docs.eksNodeClass} />.</li>
            <li><strong>EFA interfaces per network card:</strong> the same EC2NodeClass
            declares <code>spec.networkInterfaces</code> with an{' '}
            <code>interfaceType</code> of <code>interface</code> or <code>efa-only</code> per
            network card index{' '}
            <SourceRef provenance="documented" doc={docs.karpenterNodeClasses} />.</li>
            <li><strong>Disruption settings for tightly coupled jobs:</strong> put{' '}
            <code>karpenter.sh/do-not-disrupt</code> on training pods, set{' '}
            <code>consolidationPolicy: WhenEmpty</code> on the NodePool, and set{' '}
            <code>expireAfter</code> longer than the longest job or disable it{' '}
            <SourceRef provenance="documented" doc={docs.karpenterDisruption} />. Without
            these, consolidation or node expiry can replace a node mid-run and take the whole
            collective down.</li>
          </ul>
          <Box variant="p">
            The split is worth stating plainly. Karpenter can put nodes in the right zone and
            the right placement group. It cannot rank them by network node, because it never
            reads the topology.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="Single-zone co-location is what makes EFA fast and what makes Spot interruptions arrive together instead of one at a time.">Spot and EFA: the cascading interruption risk</Header>}
      >
        <SpaceBetween size="m">
          <Alert type="warning">
            <SpaceBetween size="xs">
              <Box variant="p">
                <strong>Spot is risky for tightly-coupled EFA workloads, and the reason is the
                Availability Zone, not the placement group.</strong> If one node in a multi-node
                training job gets a Spot interruption, the entire job stops.
              </Box>
              <Box variant="p">
                AWS states it directly. EFA requires all communicating nodes to reside in the
                same Availability Zone, and that co-location introduces correlated interruption
                risk: instances share underlying physical infrastructure within the same AZ, and
                even more so within a placement group, so a single capacity reclamation event
                can affect multiple instances at once rather than a single node. Without EFA
                constraints, nodes spread across AZs and interruptions are statistically
                independent{' '}
                <SourceRef
                  provenance="documented"
                  doc={docs.eksBestPractices}
                  code={code.eksBpSpot}
                  label="tier 2: EKS best practices"
                />. AWS publishes no mapping from its topology layers to a named rack or spine,
                so this page does not name the shared hardware.
              </Box>
            </SpaceBetween>
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">When Spot + EFA works</Box>
              <ul>
                <li>Short training runs (&lt;2 hours) with frequent checkpointing</li>
                <li>Fault-tolerant frameworks (elastic training, auto-restart)</li>
                <li>Development/experimentation (acceptable to restart)</li>
                <li>P and Trn families only. Every HPC family is Spot-ineligible: hpc6a,
                hpc6id, hpc7a, hpc7g and hpc8a all show Spot support of No{' '}
                <SourceRef provenance="documented" doc={docs.hpc} />, as do
                p6e-gb200.36xlarge and trn2u.48xlarge{' '}
                <SourceRef provenance="documented" doc={docs.ac} />. Spot is not an option for
                loosely-coupled HPC on those types, whatever the coupling looks like.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">When to use On-Demand / Capacity Blocks</Box>
              <ul>
                <li>Multi-day training runs (any interruption is expensive)</li>
                <li>Tightly-coupled MPI (all ranks must be present)</li>
                <li>Production inference (SLA (Service Level Agreement) requirements)</li>
                <li><strong>Capacity Blocks:</strong> time-limited GPU reservations for
                training bursts (guaranteed capacity without long-term commitment)</li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Spot Placement Score API:</strong> Before launching Spot in a placement
            group, query the Spot Placement Score to estimate likelihood of getting and
            keeping your desired instance count. Low scores = high interruption risk.
          </Box>
          <Box variant="p">
            <strong>Do not expect a Spot savings percentage here.</strong> Spot rates
            are not published in the EC2 Price List bulk API or in any credential-free
            first-party AWS endpoint, so the Pricing Analysis section publishes eligibility and
            nothing else. Treat any fixed savings percentage you see for Spot on EFA instances
            as unsourced until someone shows you the endpoint it came from.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="Two guaranteed-capacity paths, not one. The choice is duration, and it is decided before the fleet exists.">Capacity planning: Blocks against ODCRs</Header>}
      >
        <SpaceBetween size="m">
          <Alert type="info" header="Both paths are documented for EFA fleets">
            Capacity Blocks are the better-known option and they are not the only one. AWS
            documents On-Demand Capacity Reservations against a cluster placement group in the EFA
            setup guide itself: to ensure that capacity is available as you scale your
            cluster&apos;s instances, you can create a Capacity Reservation for your cluster
            placement group <SourceRef provenance="documented" doc={docs.efaStart} />. Pick on
            duration, not on which one you have heard of.
          </Alert>
          <Box variant="p">
            <strong>Capacity Blocks:</strong> reserve a start time up to 8 weeks ahead, for 1 to
            14 days or multiples of 7 days up to 182 days. Up to 64 instances per block and up
            to 256 across multiple blocks. One UltraServer equals one Capacity Block, so you
            reserve the UltraServer rather than the instances inside it. Instances are
            terminated starting 30 minutes before the block ends for instance types, or 60
            minutes for UltraServer types, with an EventBridge event 10 minutes before
            termination begins{' '}
            <SourceRef provenance="documented" doc={docs.capacityBlocks} />.
          </Box>
          <Box variant="p">
            <strong>ODCRs:</strong> open-ended duration, and the documented way to hold capacity
            for a cluster placement group as a fleet grows{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />. The placement group is
            chosen when the reservation is created. Expanding an existing reservation raises
            insufficient-capacity risk.
          </Box>
          <Box variant="p">
            <strong>Decision rules:</strong>
          </Box>
          <ul>
            <li><strong>Defined training burst (days-weeks)</strong> → Capacity Blocks</li>
            <li><strong>Open-ended production inference</strong> → ODCR + Savings Plan</li>
            <li><strong>Cost-sensitive experimentation</strong> → Spot with checkpointing, on a
            Spot-eligible family only</li>
            <li><strong>1-3 year steady state</strong> → Savings Plans (no capacity guarantee)</li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="Four stages from one GPU to a hundred nodes. EFA is irrelevant for the first two, and the constraint that arrives with it is the Availability Zone.">Startup scaling playbook</Header>}
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Stage 1: Single GPU</Box>
              <Box variant="p">
                Fine-tuning 7B models, LoRA/QLoRA. One g5.xlarge, or p5.4xlarge if you want a
                single H100. There is no p5.xlarge{' '}
                <SourceRef provenance="documented" doc={docs.ac} />.
                <strong> No EFA needed.</strong> Focus on data pipeline, not networking.
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 2: Single Node, Multi-GPU</Box>
              <Box variant="p">
                Full fine-tuning up to 70B, or pre-training up to 13B. One p5.48xlarge
                (8x H100) or trn1.32xlarge. <strong>No EFA needed.</strong> NVLink handles
                all GPU communication. This is where most startups should stay as long as possible.
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 3: Multi-Node (EFA enters)</Box>
              <Box variant="p">
                Pre-training 70B+ or custom architectures exceeding single-node memory.
                2-8 nodes. <strong>EFA is now critical.</strong> P4d and Trn1n are the usual
                entry points, and their rates sit close enough together that the choice turns
                on EFA bandwidth per dollar rather than on the instance rate. The Pricing
                Analysis section carries both, pinned to a price list version.{' '}
                <strong>One Availability Zone is required. A cluster placement group is
                recommended, not required{' '}
                <SourceRef provenance="documented" doc={docs.efaStart} />.</strong>
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 4: Scale (10-100+ nodes)</Box>
              <Box variant="p">
                Frontier training. P5/Trn2 with full EFA. Topology-aware rank assignment,
                NCCL tuner plugin, Capacity Reservations. The Trn2 product page states that
                Trn2 instances offer 30-40% better price performance than GPU-based EC2 P5e and
                P5en instances{' '}
                <SourceRef provenance="documented" doc={docs.trn2} label="tier 2: product page" />,
                which is a first-party marketing figure rather than a benchmark you can
                reproduce. Worth testing at this scale, not worth planning around untested.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="SMDDP is P4-class only, and frozen. It does not apply to Stage 4.">
            <SpaceBetween size="xs">
              <Box variant="p">
                The SMDDP (SageMaker Distributed Data Parallel) library does not run on the
                instance types this stage is about. Its supported instance list is exactly
                ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge, and the optimized
                AllGather collective is available on P4 only{' '}
                <SourceRef provenance="documented" doc={docs.ddpSupport} />. No P5, P5e, P5en,
                P6 or Trn2 size is supported.
              </Box>
              <Box variant="p">
                The library is frozen rather than deprecated. AWS has not announced a
                deprecation, and the latest release is v2.5.0, dated October 17, 2024{' '}
                <SourceRef provenance="documented" doc={docs.ddpRelease} />.
              </Box>
              <Box variant="p">
                The underlying number holds inside that scope. P4d and P4de carry NVIDIA A100
                GPUs, NCCL takes up to 24 streaming multiprocessors to run collective
                operations, and SMDDP uses fewer than 9{' '}
                <SourceRef provenance="documented" doc={docs.ddpIntro} />. That is an A100
                measurement. Quote it with the instance family attached or do not quote it. The
                EFA on SageMaker and HyperPod section covers the rest.
              </Box>
            </SpaceBetween>
          </Alert>
          <Alert type="info" header="If Stage 3 lands you on SageMaker, less is automatic than you think">
            <SpaceBetween size="xs">
              <Box variant="p">
                SageMaker AI launches all instances for a given job within a single subnet, which is
                a single Availability Zone, to keep them physically close and minimize inter-node
                latency{' '}
                <SourceRef provenance="documented" doc={docs.smCapacity} />. That satisfies the one
                boundary EFA traffic cannot cross{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. No AWS source states that
                training jobs use EC2 cluster placement groups, so do not assume one is created for
                you, and remember AWS calls the placement group a recommendation rather than a
                requirement{' '}
                <SourceRef provenance="documented" doc={docs.efaStart} label="doc: efa-start" />.
              </Box>
              <Box variant="p">
                NCCL is not configured for you either. AWS states that your container must download
                and install the EFA software, and that tools like MPI and NCCL must be installed and
                managed inside the container{' '}
                <SourceRef provenance="documented" doc={docs.smTrainEfa} />. That is the work the
                platform name hides, and it is where a job silently ends up on TCP.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
