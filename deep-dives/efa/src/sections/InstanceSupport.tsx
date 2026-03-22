import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import TextFilter from '@cloudscape-design/components/text-filter';
import Tabs from '@cloudscape-design/components/tabs';

interface InstanceInfo {
  family: string;
  type: string;
  accelerator: string;
  efaInterfaces: number;
  bandwidthGbps: number;
  useCase: string;
  generation: string;
}

const instances: InstanceInfo[] = [
  // GPU instances
  { family: 'P5', type: 'p5.48xlarge', accelerator: '8x H100 (80GB)', efaInterfaces: 32, bandwidthGbps: 3200, useCase: 'Large-scale training', generation: 'Current' },
  { family: 'P5e', type: 'p5e.48xlarge', accelerator: '8x H200 (141GB)', efaInterfaces: 32, bandwidthGbps: 3200, useCase: 'Large-scale training (extended memory)', generation: 'Current' },
  { family: 'P5en', type: 'p5en.48xlarge', accelerator: '8x H200 (141GB)', efaInterfaces: 32, bandwidthGbps: 3200, useCase: 'Large-scale training (enhanced networking)', generation: 'Current' },
  { family: 'P4d', type: 'p4d.24xlarge', accelerator: '8x A100 (40GB)', efaInterfaces: 4, bandwidthGbps: 400, useCase: 'Training & inference', generation: 'Previous' },
  { family: 'P4de', type: 'p4de.24xlarge', accelerator: '8x A100 (80GB)', efaInterfaces: 4, bandwidthGbps: 400, useCase: 'Training (extended memory)', generation: 'Previous' },
  // Trainium/Inferentia
  { family: 'Trn1', type: 'trn1.32xlarge', accelerator: '16x Trainium v1', efaInterfaces: 8, bandwidthGbps: 800, useCase: 'Training (Neuron)', generation: 'Current' },
  { family: 'Trn1n', type: 'trn1n.32xlarge', accelerator: '16x Trainium v1', efaInterfaces: 16, bandwidthGbps: 1600, useCase: 'Training (enhanced networking)', generation: 'Current' },
  { family: 'Trn2', type: 'trn2.48xlarge', accelerator: '16x Trainium v2', efaInterfaces: 32, bandwidthGbps: 3200, useCase: 'Training (next-gen)', generation: 'Current' },
  { family: 'Inf2', type: 'inf2.48xlarge', accelerator: '12x Inferentia2', efaInterfaces: 4, bandwidthGbps: 400, useCase: 'Inference', generation: 'Current' },
  // HPC instances
  { family: 'Hpc6a', type: 'hpc6a.48xlarge', accelerator: 'None (96 AMD EPYC)', efaInterfaces: 2, bandwidthGbps: 100, useCase: 'CPU HPC', generation: 'Current' },
  { family: 'Hpc6id', type: 'hpc6id.32xlarge', accelerator: 'None (64 Intel)', efaInterfaces: 2, bandwidthGbps: 200, useCase: 'CPU HPC + NVMe', generation: 'Current' },
  { family: 'Hpc7a', type: 'hpc7a.96xlarge', accelerator: 'None (96 AMD EPYC)', efaInterfaces: 2, bandwidthGbps: 300, useCase: 'CPU HPC (latest)', generation: 'Current' },
  { family: 'Hpc7g', type: 'hpc7g.16xlarge', accelerator: 'None (64 Graviton3)', efaInterfaces: 1, bandwidthGbps: 200, useCase: 'ARM HPC', generation: 'Current' },
  // General purpose with EFA
  { family: 'C5n', type: 'c5n.18xlarge', accelerator: 'None', efaInterfaces: 1, bandwidthGbps: 100, useCase: 'Network-intensive compute', generation: 'Previous' },
  { family: 'C6in', type: 'c6in.32xlarge', accelerator: 'None', efaInterfaces: 2, bandwidthGbps: 200, useCase: 'Network-intensive compute', generation: 'Current' },
  { family: 'C7gn', type: 'c7gn.16xlarge', accelerator: 'None', efaInterfaces: 1, bandwidthGbps: 200, useCase: 'ARM network compute', generation: 'Current' },
  { family: 'R5n', type: 'r5n.24xlarge', accelerator: 'None', efaInterfaces: 1, bandwidthGbps: 100, useCase: 'Memory-intensive + networking', generation: 'Previous' },
  { family: 'M5n', type: 'm5n.24xlarge', accelerator: 'None', efaInterfaces: 1, bandwidthGbps: 100, useCase: 'General purpose + networking', generation: 'Previous' },
];

export function InstanceSupport() {
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('gpu');

  const filtered = instances.filter((i) => {
    const matchesFilter =
      !filterText ||
      Object.values(i).some((v) => String(v).toLowerCase().includes(filterText.toLowerCase()));
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'gpu' && ['P5', 'P5e', 'P5en', 'P4d', 'P4de'].includes(i.family)) ||
      (activeTab === 'trainium' && ['Trn1', 'Trn1n', 'Trn2', 'Inf2'].includes(i.family)) ||
      (activeTab === 'hpc' && i.family.startsWith('Hpc')) ||
      (activeTab === 'general' && !['P5', 'P5e', 'P5en', 'P4d', 'P4de', 'Trn1', 'Trn1n', 'Trn2', 'Inf2'].includes(i.family) && !i.family.startsWith('Hpc'));
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
        <Box variant="p">
          EFA support varies dramatically by instance family. The bandwidth range spans
          from <strong>100 Gbps</strong> (C5n, single EFA) to <strong>3,200 Gbps</strong> (P5/Trn2,
          32 EFA interfaces). The number of EFA interfaces per instance is the key
          multiplier — each interface provides a portion of the total bandwidth.
        </Box>
      </Container>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          { id: 'gpu', label: 'GPU (NVIDIA)', content: null },
          { id: 'trainium', label: 'Trainium / Inferentia', content: null },
          { id: 'hpc', label: 'HPC Optimized', content: null },
          { id: 'general', label: 'General Purpose', content: null },
          { id: 'all', label: 'All', content: null },
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
            cell: (item) => `${item.bandwidthGbps} Gbps`,
            sortingField: 'bandwidthGbps',
          },
          {
            id: 'useCase',
            header: 'Primary Use Case',
            cell: (item) => item.useCase,
          },
          {
            id: 'generation',
            header: 'Generation',
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
    </SpaceBetween>
  );
}
