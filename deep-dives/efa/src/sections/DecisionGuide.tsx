import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';

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
    reason: 'Single node — NVLink handles GPU communication',
    recommendation: 'p5.48xlarge or trn1.32xlarge, no EFA needed',
  },
  {
    scenario: 'Pre-training 70B model on 8 nodes',
    efaNeeded: 'Yes',
    reason: 'Multi-node DDP/FSDP — allreduce is the bottleneck',
    recommendation: 'P5 with EFA in cluster placement group',
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
    reason: '~810GB model — exceeds single P5 memory, needs multi-node TP',
    recommendation: '2x P5 with EFA, minimize TP across nodes',
  },
  {
    scenario: 'CFD simulation (1000 MPI ranks)',
    efaNeeded: 'Yes',
    reason: 'Tightly-coupled — halo exchange every timestep',
    recommendation: 'Hpc7a in cluster placement group',
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
    recommendation: 'P5 with EFA — SRD handles asymmetric traffic patterns',
  },
];

export function DecisionGuide() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="When to use EFA, and when to save the complexity">
            Decision Guide
          </Header>
        }
      >
        <Box variant="p">
          EFA adds no cost, but it adds <strong>operational constraints</strong>: cluster
          placement groups (single AZ), capacity planning, security group configuration,
          and container/Kubernetes complexity. Use it when the performance benefit justifies
          these constraints.
        </Box>
      </Container>

      <Table
        header={<Header variant="h2">Scenario-Based Recommendations</Header>}
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
      />

      <Container header={<Header variant="h2">The Three Questions</Header>}>
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
            <Box variant="h3">3. Can you use a placement group?</Box>
            <Box variant="p">
              EFA strongly recommends a cluster placement group = single AZ (not strictly
              required, but performance degrades without it). Cross-subnet within the same
              AZ is supported since 2024. Design training/HPC jobs to checkpoint frequently
              and tolerate AZ-level failure.
            </Box>
            <Alert type="info">
              For training: always checkpoint. For inference: consider failover to another AZ cluster.
            </Alert>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Topology-Aware Rank Assignment</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why it matters:</strong> Getting rank-to-GPU-to-NIC mapping wrong causes
            2-3x performance degradation. NCCL needs to know which GPU is physically closest
            to which EFA interface to minimize PCIe (Peripheral Component Interconnect Express) hops.
          </Box>
          <Box variant="p">
            <strong>How it works:</strong> <code>NCCL_TOPO_FILE</code> tells NCCL the physical
            topology — which GPUs connect to which NVSwitch, which NIC connects via which
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
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">EFA + Karpenter: Topology-Aware Scheduling</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            On EKS, <strong>Karpenter</strong> can enforce topology constraints that EFA
            requires. Use <code>topology.kubernetes.io/zone</code> to pin nodes to a single
            AZ, and node affinity to target a specific cluster placement group.
          </Box>
          <Box variant="p">
            Key Karpenter patterns for EFA:
          </Box>
          <ul>
            <li><strong>NodePool with placement group:</strong> Configure the launch template
            to specify the cluster placement group. Karpenter provisions into it automatically.</li>
            <li><strong>Consolidation caution:</strong> Karpenter&apos;s consolidation may
            attempt to move EFA workloads between nodes. Use <code>do-not-disrupt</code>
            annotations on training pods to prevent mid-job disruption.</li>
            <li><strong>Capacity type:</strong> Use <code>on-demand</code> for long training
            runs in placement groups. Spot in placement groups has cascading interruption
            risk (see below).</li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Spot + EFA: The Cascading Interruption Risk</Header>}>
        <SpaceBetween size="m">
          <Alert type="warning">
            <strong>Spot in placement groups is risky for tightly-coupled workloads.</strong> If
            one node in a multi-node training job gets a Spot interruption, the entire job
            stops. In a cluster placement group, Spot capacity is correlated — an interruption
            often affects multiple instances simultaneously because they share the same
            physical rack/spine.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">When Spot + EFA works</Box>
              <ul>
                <li>Short training runs (&lt;2 hours) with frequent checkpointing</li>
                <li>Fault-tolerant frameworks (elastic training, auto-restart)</li>
                <li>Non-tightly-coupled HPC (embarrassingly parallel with EFA for fast reduce)</li>
                <li>Development/experimentation (acceptable to restart)</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">When to use On-Demand / Capacity Blocks</Box>
              <ul>
                <li>Multi-day training runs (any interruption is expensive)</li>
                <li>Tightly-coupled MPI (all ranks must be present)</li>
                <li>Production inference (SLA (Service Level Agreement) requirements)</li>
                <li><strong>Capacity Blocks:</strong> time-limited GPU reservations for
                training bursts — guaranteed capacity without long-term commitment</li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Spot Placement Score API:</strong> Before launching Spot in a placement
            group, query the Spot Placement Score to estimate likelihood of getting and
            keeping your desired instance count. Low scores = high interruption risk.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Startup Scaling Playbook</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The journey from single-GPU to multi-node training — when does EFA
            enter the picture?</strong>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Stage 1: Single GPU</Box>
              <Box variant="p">
                Fine-tuning 7B models, LoRA/QLoRA. One g5.xlarge or p5.xlarge.
                <strong> No EFA needed.</strong> Focus on data pipeline, not networking.
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 2: Single Node, Multi-GPU</Box>
              <Box variant="p">
                Full fine-tuning up to 70B, or pre-training up to 13B. One p5.48xlarge
                (8x H100) or trn1.32xlarge. <strong>No EFA needed</strong> — NVLink handles
                all GPU communication. This is where most startups should stay as long as possible.
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 3: Multi-Node (EFA enters)</Box>
              <Box variant="p">
                Pre-training 70B+ or custom architectures exceeding single-node memory.
                2-8 nodes. <strong>EFA is now critical.</strong> Start with P4d (cheapest
                multi-node) or Trn1n (best networking value). Cluster placement group required.
              </Box>
            </div>
            <div>
              <Box variant="h3">Stage 4: Scale (10-100+ nodes)</Box>
              <Box variant="p">
                Frontier training. P5/Trn2 with full EFA. Topology-aware rank assignment,
                NCCL tuner plugin, Capacity Reservations. Consider Trn2 for
                <strong> 30-40% better price-performance</strong> vs P5e — significant
                at this scale.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>For startups on SageMaker:</strong> SageMaker Training automatically
            configures EFA, placement groups, and NCCL when you select EFA-capable instances.
            The SMDDP (SageMaker Distributed Data Parallel) library optimizes AllGather with a mesh topology that reduces GPU SM
            usage from 24 to under 9 — freeing compute for your model.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Key Takeaways</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            <StatusIndicator type="success">
              EFA is free — the only cost is the instance. Enable it whenever available.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            <StatusIndicator type="success">
              EFA transforms multi-node training economics — 90%+ scaling efficiency vs 40-60% without.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            <StatusIndicator type="info">
              SRD is not RDMA — it&apos;s purpose-built for cloud networks and handles congestion better at scale.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            <StatusIndicator type="info">
              Single-node workloads get zero benefit from EFA — NVLink handles intra-node communication.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            <StatusIndicator type="warning">
              Cluster placement group = single AZ. Plan for capacity and availability accordingly.
            </StatusIndicator>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
