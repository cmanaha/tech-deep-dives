import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import TextFilter from '@cloudscape-design/components/text-filter';
import Tabs from '@cloudscape-design/components/tabs';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';

interface InstanceInfo {
  family: string;
  type: string;
  accelerator: string;
  efaInterfaces: number;
  bandwidthGbps: number;
  efaVersion: string;
  nitroVersion: string;
  useCase: string;
  generation: string;
  category: 'gpu' | 'trainium' | 'hpc' | 'general';
}

const instances: InstanceInfo[] = [
  // P6 — Blackwell (newest)
  { family: 'P6-B300', type: 'p6-b300.48xlarge', accelerator: '8x B300 (268GB HBM3e)', efaInterfaces: 17, bandwidthGbps: 6400, efaVersion: 'EFAv3', nitroVersion: 'v6', useCase: 'Frontier training & inference', generation: 'Current', category: 'gpu' },
  { family: 'P6-B200', type: 'p6-b200.48xlarge', accelerator: '8x B200 (179GB HBM3e)', efaInterfaces: 8, bandwidthGbps: 3200, efaVersion: 'EFAv3', nitroVersion: 'v6', useCase: 'Large-scale training', generation: 'Current', category: 'gpu' },
  { family: 'P6e-GB200', type: 'p6e-gb200.36xlarge', accelerator: '4x B200 (GB200 NVL72)', efaInterfaces: 8, bandwidthGbps: 1600, efaVersion: 'EFAv4', nitroVersion: 'v6', useCase: 'UltraServer training (72-GPU NVLink domain)', generation: 'Current', category: 'gpu' },
  // P5 — Hopper
  { family: 'P5', type: 'p5.48xlarge', accelerator: '8x H100 SXM5 (80GB)', efaInterfaces: 32, bandwidthGbps: 3200, efaVersion: 'EFAv2', nitroVersion: 'v4', useCase: 'Large-scale training', generation: 'Current', category: 'gpu' },
  { family: 'P5e', type: 'p5e.48xlarge', accelerator: '8x H200 SXM5 (141GB)', efaInterfaces: 32, bandwidthGbps: 3200, efaVersion: 'EFAv2', nitroVersion: 'v4', useCase: 'Training (1.7x more GPU memory)', generation: 'Current', category: 'gpu' },
  { family: 'P5en', type: 'p5en.48xlarge', accelerator: '8x H200 SXM5 (141GB)', efaInterfaces: 16, bandwidthGbps: 3200, efaVersion: 'EFAv3', nitroVersion: 'v5', useCase: 'Training (35% lower latency, 4x CPU-GPU BW)', generation: 'Current', category: 'gpu' },
  // P4 — Ampere
  { family: 'P4d', type: 'p4d.24xlarge', accelerator: '8x A100 SXM4 (40GB)', efaInterfaces: 4, bandwidthGbps: 400, efaVersion: 'EFAv1', nitroVersion: 'v3', useCase: 'Training & inference', generation: 'Previous', category: 'gpu' },
  { family: 'P4de', type: 'p4de.24xlarge', accelerator: '8x A100 SXM4e (80GB)', efaInterfaces: 4, bandwidthGbps: 400, efaVersion: 'EFAv1', nitroVersion: 'v3', useCase: 'Training (extended memory)', generation: 'Previous', category: 'gpu' },
  // Trainium
  { family: 'Trn2', type: 'trn2.48xlarge', accelerator: '16x Trainium v2 (512GB HBM3)', efaInterfaces: 16, bandwidthGbps: 3200, efaVersion: 'EFAv3', nitroVersion: 'v5', useCase: 'Training (30-40% better price-perf vs P5e)', generation: 'Current', category: 'trainium' },
  { family: 'Trn2', type: 'trn2.3xlarge', accelerator: '1x Trainium v2', efaInterfaces: 1, bandwidthGbps: 200, efaVersion: 'EFAv3', nitroVersion: 'v5', useCase: 'Single-chip training/fine-tuning', generation: 'Current', category: 'trainium' },
  { family: 'Trn1n', type: 'trn1n.32xlarge', accelerator: '16x Trainium v1', efaInterfaces: 16, bandwidthGbps: 1600, efaVersion: 'EFAv1', nitroVersion: 'v4', useCase: 'Training (2x networking vs Trn1)', generation: 'Current', category: 'trainium' },
  { family: 'Trn1', type: 'trn1.32xlarge', accelerator: '16x Trainium v1', efaInterfaces: 8, bandwidthGbps: 800, efaVersion: 'EFAv1', nitroVersion: 'v4', useCase: 'Training (Neuron)', generation: 'Current', category: 'trainium' },
  { family: 'Inf1', type: 'inf1.24xlarge', accelerator: '16x Inferentia v1', efaInterfaces: 1, bandwidthGbps: 100, efaVersion: 'EFAv1', nitroVersion: 'v3', useCase: 'Inference (only Inf1 size with EFA)', generation: 'Previous', category: 'trainium' },
  // HPC instances
  { family: 'Hpc8a', type: 'hpc8a.96xlarge', accelerator: 'None (96 AMD EPYC 9005)', efaInterfaces: 2, bandwidthGbps: 300, efaVersion: 'EFAv3', nitroVersion: 'v6', useCase: 'CPU HPC (40% faster vs hpc7a)', generation: 'Current', category: 'hpc' },
  { family: 'Hpc7a', type: 'hpc7a.96xlarge', accelerator: 'None (96 AMD EPYC 9004)', efaInterfaces: 2, bandwidthGbps: 300, efaVersion: 'EFAv2', nitroVersion: 'v4', useCase: 'CPU HPC', generation: 'Current', category: 'hpc' },
  { family: 'Hpc7g', type: 'hpc7g.16xlarge', accelerator: 'None (64 Graviton3E)', efaInterfaces: 1, bandwidthGbps: 200, efaVersion: 'EFAv2', nitroVersion: 'v4', useCase: 'ARM HPC', generation: 'Current', category: 'hpc' },
  { family: 'Hpc6a', type: 'hpc6a.48xlarge', accelerator: 'None (96 AMD EPYC)', efaInterfaces: 2, bandwidthGbps: 200, efaVersion: 'EFAv1', nitroVersion: 'v4', useCase: 'CPU HPC', generation: 'Previous', category: 'hpc' },
  { family: 'Hpc6id', type: 'hpc6id.32xlarge', accelerator: 'None (64 Intel)', efaInterfaces: 2, bandwidthGbps: 200, efaVersion: 'EFAv1', nitroVersion: 'v4', useCase: 'CPU HPC + 15.2TB NVMe', generation: 'Current', category: 'hpc' },
  // General purpose with EFA (Nitro v6)
  { family: 'C8i', type: 'c8i.48xlarge', accelerator: 'None (Intel)', efaInterfaces: 2, bandwidthGbps: 200, efaVersion: 'EFAv3', nitroVersion: 'v6', useCase: 'Compute (full RDMA read+write)', generation: 'Current', category: 'general' },
  { family: 'M8i', type: 'm8i.48xlarge', accelerator: 'None (Intel)', efaInterfaces: 2, bandwidthGbps: 200, efaVersion: 'EFAv3', nitroVersion: 'v6', useCase: 'General purpose (full RDMA)', generation: 'Current', category: 'general' },
  { family: 'C6in', type: 'c6in.32xlarge', accelerator: 'None', efaInterfaces: 2, bandwidthGbps: 200, efaVersion: 'EFAv1', nitroVersion: 'v4', useCase: 'Network-intensive compute', generation: 'Current', category: 'general' },
  { family: 'C7gn', type: 'c7gn.16xlarge', accelerator: 'None (Graviton3)', efaInterfaces: 1, bandwidthGbps: 200, efaVersion: 'EFAv2', nitroVersion: 'v4', useCase: 'ARM network compute', generation: 'Current', category: 'general' },
  { family: 'C5n', type: 'c5n.18xlarge', accelerator: 'None', efaInterfaces: 1, bandwidthGbps: 100, efaVersion: 'EFAv1', nitroVersion: 'v3', useCase: 'Network-intensive compute', generation: 'Previous', category: 'general' },
];

export function InstanceSupport() {
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('gpu');

  const filtered = instances.filter((i) => {
    const matchesFilter =
      !filterText ||
      Object.values(i).some((v) => String(v).toLowerCase().includes(filterText.toLowerCase()));
    const matchesTab = activeTab === 'all' || i.category === activeTab;
    return matchesFilter && matchesTab;
  });

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Which instances support EFA and what bandwidth do they provide?">
            Instance Support Matrix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EFA bandwidth spans <strong>100 Gbps</strong> (C5n, single EFA) to
            <strong> 6,400 Gbps</strong> (P6-B300, 17 EFA interfaces). Four generations of EFA
            hardware exist, each on progressively faster Nitro versions.
          </Box>

          <Alert type="warning">
            <strong>Common misconception:</strong> Inf2 instances do NOT have EFA. Only
            inf1.24xlarge (the largest Inf1) has a single 100 Gbps EFA interface.
            Multi-node Inf2 inference uses standard ENA networking.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">EFA Generation Evolution</Header>}>
        <ColumnLayout columns={4} variant="text-grid">
          <div>
            <Box variant="h3">EFAv1</Box>
            <Box variant="p">
              First generation. P4d, Trn1, Hpc6a, C5n. Up to 400 Gbps aggregate.
              RDMA read only. Nitro v3-v4.
            </Box>
          </div>
          <div>
            <Box variant="h3">EFAv2</Box>
            <Box variant="p">
              P5, P5e, Hpc7a. Up to 3,200 Gbps (32 interfaces x 100 Gbps).
              RDMA read. 75% faster collectives vs EFAv1. Nitro v4.
            </Box>
          </div>
          <div>
            <Box variant="h3">EFAv3</Box>
            <Box variant="p">
              P5en, P6-B200, P6-B300, Trn2, Hpc8a, C8i/M8i. Up to 6,400 Gbps.
              <strong> 35% lower latency</strong> vs EFAv2. RDMA read+write on Nitro v6.
            </Box>
          </div>
          <div>
            <Box variant="h3">EFAv4</Box>
            <Box variant="p">
              P6e-GB200 UltraServers only. Up to 28.8 Tbps per UltraServer
              (72 Blackwell GPUs in one NVLink domain). Nitro v6.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          { id: 'gpu', label: 'GPU (NVIDIA)' },
          { id: 'trainium', label: 'Trainium / Inferentia' },
          { id: 'hpc', label: 'HPC Optimized' },
          { id: 'general', label: 'General Purpose' },
          { id: 'all', label: 'All' },
        ]}
      />

      <Table
        header={
          <Header counter={`(${filtered.length})`}>
            EFA-Enabled Instances
          </Header>
        }
        filter={
          <TextFilter
            filteringText={filterText}
            onChange={({ detail }) => setFilterText(detail.filteringText)}
            filteringPlaceholder="Filter instances..."
          />
        }
        columnDefinitions={[
          {
            id: 'type',
            header: 'Instance Type',
            cell: (item) => <strong>{item.type}</strong>,
            sortingField: 'type',
          },
          {
            id: 'accelerator',
            header: 'Accelerator',
            cell: (item) => item.accelerator,
          },
          {
            id: 'efaVersion',
            header: 'EFA Gen',
            cell: (item) => (
              <Badge color={
                item.efaVersion === 'EFAv4' ? 'green' :
                item.efaVersion === 'EFAv3' ? 'blue' :
                item.efaVersion === 'EFAv2' ? 'grey' : 'grey'
              }>
                {item.efaVersion}
              </Badge>
            ),
          },
          {
            id: 'efaInterfaces',
            header: 'EFA Interfaces',
            cell: (item) => (
              <Badge color={item.efaInterfaces >= 16 ? 'green' : item.efaInterfaces >= 4 ? 'blue' : 'grey'}>
                {item.efaInterfaces}
              </Badge>
            ),
            sortingField: 'efaInterfaces',
          },
          {
            id: 'bandwidth',
            header: 'Bandwidth',
            cell: (item) => `${item.bandwidthGbps.toLocaleString()} Gbps`,
            sortingField: 'bandwidthGbps',
          },
          {
            id: 'useCase',
            header: 'Primary Use Case',
            cell: (item) => item.useCase,
          },
          {
            id: 'generation',
            header: 'Status',
            cell: (item) => (
              <Badge color={item.generation === 'Current' ? 'green' : 'grey'}>
                {item.generation}
              </Badge>
            ),
          },
        ]}
        items={filtered}
        sortingDisabled
        variant="full-page"
      />

      <Container header={<Header variant="h2">CLI: Query EFA Instances in Any Region</Header>}>
        <Box variant="code">
{`aws ec2 describe-instance-types \\
  --region us-east-1 \\
  --filters Name=network-info.efa-supported,Values=true \\
  --query "InstanceTypes[*].[InstanceType]" \\
  --output text | sort`}
        </Box>
      </Container>
    </SpaceBetween>
  );
}
