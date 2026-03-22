import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

interface CostItem {
  component: string;
  cost: string;
  notes: string;
}

const costBreakdown: CostItem[] = [
  { component: 'EFA Interface', cost: 'Free', notes: 'No additional charge for enabling EFA on supported instances' },
  { component: 'EFA Data Transfer', cost: 'Free', notes: 'No per-GB charge for EFA traffic within placement group' },
  { component: 'Instance Premium', cost: 'None', notes: 'EFA is included in the instance price — no EFA-specific surcharge' },
  { component: 'Cluster Placement Group', cost: 'Free', notes: 'No charge for the placement group itself' },
  { component: 'Actual Cost', cost: 'Instance pricing', notes: 'You pay for the instances. EFA-capable instances tend to be the larger/more expensive sizes.' },
];

interface InstanceCost {
  type: string;
  onDemandHr: string;
  spotEstimate: string;
  efaBandwidth: string;
  costPerGbps: string;
}

const instanceCosts: InstanceCost[] = [
  { type: 'p5.48xlarge', onDemandHr: '$98.32', spotEstimate: '~$39 (60% savings)', efaBandwidth: '3,200 Gbps', costPerGbps: '$0.031/hr' },
  { type: 'p4d.24xlarge', onDemandHr: '$32.77', spotEstimate: '~$13 (60% savings)', efaBandwidth: '400 Gbps', costPerGbps: '$0.082/hr' },
  { type: 'trn1.32xlarge', onDemandHr: '$21.50', spotEstimate: '~$8.60 (60% savings)', efaBandwidth: '800 Gbps', costPerGbps: '$0.027/hr' },
  { type: 'trn1n.32xlarge', onDemandHr: '$24.78', spotEstimate: '~$9.90 (60% savings)', efaBandwidth: '1,600 Gbps', costPerGbps: '$0.015/hr' },
  { type: 'hpc7a.96xlarge', onDemandHr: '$3.60', spotEstimate: 'N/A (HPC)', efaBandwidth: '300 Gbps', costPerGbps: '$0.012/hr' },
];

export function Pricing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="EFA is free — the instances are the cost">
            Pricing Analysis
          </Header>
        }
      >
        <Alert type="success">
          <strong>EFA has no additional cost.</strong> There is no charge for the EFA interface,
          no per-GB data transfer charge for EFA traffic, and no placement group fee.
          The only cost is the instance itself.
        </Alert>
      </Container>

      <Table
        header={<Header variant="h2">EFA Cost Breakdown</Header>}
        columnDefinitions={[
          { id: 'component', header: 'Component', cell: (item) => item.component },
          {
            id: 'cost',
            header: 'Cost',
            cell: (item) => (
              <StatusIndicator type={item.cost === 'Free' || item.cost === 'None' ? 'success' : 'info'}>
                {item.cost}
              </StatusIndicator>
            ),
          },
          { id: 'notes', header: 'Notes', cell: (item) => item.notes },
        ]}
        items={costBreakdown}
        sortingDisabled
        variant="embedded"
      />

      <Container header={<Header variant="h2">Instance Cost Comparison (us-east-1)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The real question isn&apos;t &quot;how much does EFA cost?&quot; — it&apos;s &quot;what&apos;s the cost
            per Gbps of EFA bandwidth?&quot; This tells you which instances give the best
            networking value.
          </Box>
          <Table
            columnDefinitions={[
              { id: 'type', header: 'Instance', cell: (item) => <strong>{item.type}</strong> },
              { id: 'onDemand', header: 'On-Demand/hr', cell: (item) => item.onDemandHr },
              { id: 'spot', header: 'Spot Estimate', cell: (item) => item.spotEstimate },
              { id: 'bandwidth', header: 'EFA Bandwidth', cell: (item) => item.efaBandwidth },
              { id: 'costPerGbps', header: 'Cost per Gbps', cell: (item) => item.costPerGbps },
            ]}
            items={instanceCosts}
            sortingDisabled
            variant="embedded"
          />
          <Alert type="info">
            <strong>Note:</strong> Prices are approximate and vary by region. Spot pricing
            fluctuates. Always check current pricing. The cost-per-Gbps metric is useful
            for comparing networking value across instance families.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Hidden Costs & Constraints</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Cluster Placement Group Constraint</Box>
            <Box variant="p">
              EFA requires a cluster placement group = <strong>all instances in the same AZ</strong>.
              This means no cross-AZ redundancy for EFA workloads. If the AZ has an issue,
              your entire cluster is affected. For training jobs, this is usually acceptable
              (checkpointing handles recovery). For inference, plan accordingly.
            </Box>
          </div>
          <div>
            <Box variant="h3">Capacity Reservations</Box>
            <Box variant="p">
              Large GPU instances are capacity-constrained. Getting 100+ P5 instances in a
              single placement group requires planning. Options: On-Demand Capacity
              Reservations (ODCRs), Savings Plans, or working with your AWS account team
              for capacity commitments. Spot is available but volatile for GPU instances.
            </Box>
          </div>
        </ColumnLayout>
        <div>
          <Box variant="h3">Capacity Blocks for ML</Box>
          <Box variant="p">
            The only guaranteed capacity path for P5/P5e/Trn2 at scale.
            Fixed upfront pricing for a defined window (days to months, up to 6 months).
            Auto-placed into UltraClusters — no manual placement group needed.
            Prices increased ~15% in January 2026 while On-Demand prices decreased.
            No cancellation. End times fixed at 11:30 AM UTC.
            Book up to 8 weeks in advance. 1-64 instances per block.
          </Box>
        </div>
      </Container>
    </SpaceBetween>
  );
}
