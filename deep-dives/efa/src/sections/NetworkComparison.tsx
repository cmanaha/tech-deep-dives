import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';

interface ComparisonRow {
  feature: string;
  efa: string;
  tcp: string;
  rdma: string;
  nvlink: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Scope',
    efa: 'Inter-node (across instances)',
    tcp: 'Inter-node',
    rdma: 'Inter-node',
    nvlink: 'Intra-node (within instance)',
  },
  {
    feature: 'Protocol',
    efa: 'SRD (AWS proprietary)',
    tcp: 'TCP/IP',
    rdma: 'RoCE v2 / InfiniBand',
    nvlink: 'NVLink / NVSwitch',
  },
  {
    feature: 'OS Bypass',
    efa: 'Yes (data path)',
    tcp: 'No',
    rdma: 'Yes',
    nvlink: 'N/A (direct GPU-GPU)',
  },
  {
    feature: 'Bandwidth (max)',
    efa: '6,400 Gbps (P6-B300)',
    tcp: '200 Gbps (max ENI)',
    rdma: '400 Gbps (NDR)',
    nvlink: '900 GB/s (NVSwitch)',
  },
  {
    feature: 'Latency',
    efa: '~2-5 μs',
    tcp: '~25-50 μs',
    rdma: '~1-2 μs',
    nvlink: '~0.5 μs',
  },
  {
    feature: 'Multi-path',
    efa: 'Yes (SRD native)',
    tcp: 'ECMP (flow-level)',
    rdma: 'Limited',
    nvlink: 'N/A',
  },
  {
    feature: 'Congestion handling',
    efa: 'SRD packet spraying',
    tcp: 'CUBIC/BBR (WAN-optimized)',
    rdma: 'PFC (can deadlock)',
    nvlink: 'N/A',
  },
  {
    feature: 'Requires lossless fabric',
    efa: 'No',
    tcp: 'No',
    rdma: 'Yes',
    nvlink: 'N/A',
  },
  {
    feature: 'AWS availability',
    efa: 'Supported instances',
    tcp: 'All instances',
    rdma: 'Not available on AWS',
    nvlink: 'P4d, P5, P5e (intra-node)',
  },
  {
    feature: 'Cost',
    efa: 'Free (instance pricing only)',
    tcp: 'Free',
    rdma: 'N/A on AWS',
    nvlink: 'Included in instance',
  },
];

export function NetworkComparison() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="How EFA compares to TCP, RDMA, and NVLink">
            EFA vs Alternatives
          </Header>
        }
      >
        <Box variant="p">
          Understanding where EFA fits requires comparing it to the alternatives.
          The key insight: <strong>EFA is not RDMA</strong>. It uses a fundamentally different
          protocol (SRD) designed for cloud networks, not the lossless fabrics that RDMA requires.
        </Box>
      </Container>

      <Table
        header={<Header variant="h2">Feature Comparison</Header>}
        columnDefinitions={[
          { id: 'feature', header: 'Feature', cell: (item) => <strong>{item.feature}</strong> },
          { id: 'efa', header: 'EFA (SRD)', cell: (item) => item.efa },
          { id: 'tcp', header: 'TCP/IP', cell: (item) => item.tcp },
          { id: 'rdma', header: 'RDMA/RoCE', cell: (item) => item.rdma },
          { id: 'nvlink', header: 'NVLink', cell: (item) => item.nvlink },
        ]}
        items={comparisonData}
        sortingDisabled
        variant="embedded"
      />

      <Container header={<Header variant="h2">The SRD Advantage Over RDMA</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">RDMA&apos;s Problem at Scale</Box>
            <Box variant="p">
              RDMA (RoCE v2) requires a <strong>lossless network fabric</strong>. This means
              Priority Flow Control (PFC) must be enabled on every switch. PFC works by
              pausing traffic when buffers fill — but this creates <strong>head-of-line
              blocking</strong> that can cascade across the entire fabric. At datacenter scale,
              PFC-induced deadlocks are a real operational risk.
            </Box>
          </div>
          <div>
            <Box variant="h3">SRD&apos;s Solution</Box>
            <Box variant="p">
              SRD <strong>doesn&apos;t need a lossless fabric</strong>. It handles packet loss
              gracefully through selective retransmission. It avoids congestion through
              packet-level multi-path spraying (not flow-level ECMP). This means SRD works
              reliably at scale without the operational complexity of maintaining a lossless
              network.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">When to Use What</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">
              <StatusIndicator type="success">Use EFA when:</StatusIndicator>
            </Box>
            <ul>
              <li>Multi-node distributed training (DDP, FSDP, Megatron)</li>
              <li>Tightly-coupled HPC simulations (MPI)</li>
              <li>Multi-node inference for very large models</li>
              <li>Any workload where inter-node latency is the bottleneck</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">
              <StatusIndicator type="stopped">Don&apos;t bother with EFA when:</StatusIndicator>
            </Box>
            <ul>
              <li>Single-node training or inference (NVLink handles it)</li>
              <li>Loosely-coupled workloads (batch, map-reduce)</li>
              <li>Data transfer/streaming (S3, standard networking is fine)</li>
              <li>Web services, APIs, microservices</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
