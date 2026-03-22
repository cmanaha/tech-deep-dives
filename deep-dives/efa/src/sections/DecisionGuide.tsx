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
              EFA requires a cluster placement group = single AZ. If your architecture
              requires multi-AZ for availability, you can&apos;t use EFA. Design your
              training/HPC jobs to checkpoint frequently and tolerate AZ-level failure.
            </Box>
            <Alert type="info">
              For training: always checkpoint. For inference: consider failover to another AZ cluster.
            </Alert>
          </div>
        </ColumnLayout>
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
