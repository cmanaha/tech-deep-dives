import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SourceRef } from '@tech-deep-dives/shared';

import {
  AC_DOC,
  CAPACITY_BLOCK_DOC,
  CAPACITY_BLOCK_MONITOR_DOC,
  CAPACITY_BLOCK_PRICING_DOC,
  CAPACITY_BLOCK_UG_DOC,
  EFA_DOC,
  EFA_START_DOC,
  HPC_DOC,
  PRICE_LIST_ARCHIVE,
  PRICE_LIST_VIRGINIA,
  SAVINGS_PLANS_DOC,
  capacityBlockRates,
  costPerGbps,
  formatUsd,
  hpcCosts,
  instanceCosts,
  priceHistory,
} from '../data/pricing';

interface CostItem {
  component: string;
  cost: string;
  notes: string;
}

const costBreakdown: CostItem[] = [
  { component: 'EFA interface', cost: 'Free', notes: 'EFA can be enabled "on any supported instance at no additional cost".' },
  { component: 'Instance premium', cost: 'None', notes: 'The same SKU is billed whether or not you attach an EFA.' },
  { component: 'Cluster placement group', cost: 'Free', notes: 'A placement group is a scheduling constraint with no line item.' },
  { component: 'What you actually pay', cost: 'Instance rate', notes: 'You pay for the instances. EFA-capable types skew toward the largest size in each family.' },
];

// A grey badge, not a citation. The point is that this column is our division.
function DerivedBadge() {
  return <Badge color="grey">derived</Badge>;
}

export function Pricing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="EFA is free. The instance rate is the cost, and a price list version is what makes any rate citable."
          >
            Pricing Analysis
          </Header>
        }
      >
        <Alert type="success" header="EFA (Elastic Fabric Adapter) carries no additional charge">
          <Box variant="p">
            EFA "is available as an optional Amazon EC2
            networking feature that you can enable on any supported instance at no additional
            cost."{' '}
            <SourceRef
              provenance="documented"
              doc={EFA_DOC}
              label="doc: EFA pricing"
            />
          </Box>
        </Alert>
      </Container>

      <Table
        header={
          <Header
            variant="h2"
            description="Everything EFA adds is free. The instance rate is the whole bill."
          >
            What EFA itself costs
          </Header>
        }
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
          {
            id: 'source',
            header: 'Source',
            cell: () => <SourceRef provenance="documented" doc={EFA_DOC} />,
          },
        ]}
        items={costBreakdown}
        sortingDisabled
        variant="embedded"
      />

      <Container
        header={
          <Header
            variant="h2"
            description="What a Gbps of EFA costs on each family, the number that decides between network-optimized instances and the accelerator premium"
          >
            Instance cost against EFA bandwidth
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The rates are us-east-1, Linux, Shared tenancy, On-Demand. What a Gbps of EFA bandwidth
            costs on each family is the number that decides whether you scale out on cheap
            network-optimized instances or pay the accelerator premium.
          </Box>
          <Table
            columnDefinitions={[
              { id: 'type', header: 'Instance', cell: (item) => <strong>{item.type}</strong> },
              {
                id: 'onDemand',
                header: 'On-Demand per hour',
                cell: (item) => (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>{formatUsd(item.onDemandUsd)}</span>
                    <SourceRef provenance="documented" doc={PRICE_LIST_VIRGINIA} />
                  </SpaceBetween>
                ),
              },
              {
                id: 'bandwidth',
                header: 'Max EFA bandwidth',
                cell: (item) => (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>{item.efaGbps.toLocaleString('en-US')} Gbps</span>
                    <SourceRef provenance="documented" doc={item.bandwidthDoc} />
                  </SpaceBetween>
                ),
              },
              {
                id: 'costPerGbps',
                header: (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>Cost per Gbps</span>
                    <DerivedBadge />
                  </SpaceBetween>
                ),
                cell: (item) => (
                  <Box color="text-body-secondary">{costPerGbps(item.onDemandUsd, item.efaGbps)}</Box>
                ),
              },
              { id: 'notes', header: 'Notes', cell: (item) => item.notes },
            ]}
            items={instanceCosts}
            sortingDisabled
            variant="embedded"
          />
          <Alert type="info" header="The cost-per-Gbps column is our arithmetic">
            <Box variant="p">
              AWS does not publish a cost-per-Gbps metric. This column is the On-Demand column
              divided by the max EFA bandwidth column, both of which carry their own citation, so
              you can redo the sum. It is a comparison aid. It also ignores
              everything an instance does besides move packets, which is why c8i.48xlarge looks
              terrible here and is still the right choice for a workload that is mostly compute.
            </Box>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Sold in Ohio. Check the region before you quote one of these rates."
          >
            HPC instances, and the region trap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            hpc8a, hpc7a, hpc6id and hpc6a have zero rows of any term type in the us-east-1 price
            list, so an hpc7a rate quoted under a us-east-1 heading is a SKU that does not exist.
            hpc7g is the exception: it does carry a us-east-1 rate.{' '}
            <SourceRef provenance="documented" doc={PRICE_LIST_VIRGINIA} label="doc: us-east-1 list" />
          </Box>
          <Table
            columnDefinitions={[
              { id: 'type', header: 'Instance', cell: (item) => <strong>{item.type}</strong> },
              { id: 'region', header: 'Region', cell: (item) => item.region },
              {
                id: 'onDemand',
                header: 'On-Demand per hour',
                cell: (item) => (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>{formatUsd(item.onDemandUsd)}</span>
                    <SourceRef provenance="documented" doc={item.regionDoc} />
                  </SpaceBetween>
                ),
              },
              {
                id: 'bandwidth',
                header: 'Max EFA bandwidth',
                cell: (item) => (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>{item.efaGbps.toLocaleString('en-US')} Gbps</span>
                    <SourceRef provenance="documented" doc={HPC_DOC} />
                  </SpaceBetween>
                ),
              },
              {
                id: 'costPerGbps',
                header: (
                  <SpaceBetween size="xxs" direction="horizontal">
                    <span>Cost per Gbps</span>
                    <DerivedBadge />
                  </SpaceBetween>
                ),
                cell: (item) => (
                  <Box color="text-body-secondary">{costPerGbps(item.onDemandUsd, item.efaGbps)}</Box>
                ),
              },
              { id: 'notes', header: 'Notes', cell: (item) => item.notes },
            ]}
            items={hpcCosts}
            sortingDisabled
            variant="embedded"
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to tell a citation that aged from a price cut that happened"
          >
            Why every rate here carries a price list version
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            $98.32 for p5.48xlarge and $32.77 for p4d.24xlarge were correct on-demand rates when
            the January and May 2025 price lists published them. AWS cut both in the June 2025
            price list, to $55.04 and $21.957642, and they have not moved since. Quoting the older
            pair today would read as a recent AWS price cut rather than as a citation that aged,
            which is why a rate needs the version it came from attached to it.{' '}
            <SourceRef provenance="documented" doc={PRICE_LIST_ARCHIVE} label="doc: archived versions" />
          </Box>
          <Table
            columnDefinitions={[
              { id: 'effective', header: 'Price list', cell: (item) => item.effective },
              { id: 'version', header: 'Version', cell: (item) => <Box variant="code">{item.version}</Box> },
              { id: 'p5', header: 'p5.48xlarge', cell: (item) => item.p5 },
              { id: 'p4d', header: 'p4d.24xlarge', cell: (item) => item.p4d },
            ]}
            items={priceHistory}
            sortingDisabled
            variant="embedded"
          />
          <Alert type="info" header="The practical rule">
            <Box variant="p">
              A price is a claim with an expiry date. Re-pull the bulk API before you build a
              business case on any rate here, and cite the version you read alongside the URL, so
              the next reader can tell staleness from a real change.
            </Box>
          </Alert>
          <Box variant="p">
            Every On-Demand rate on this page was read out of the AWS Price List bulk API,
            publication version 20261022231453, under one strict filter: Linux, Shared tenancy,
            TermType=OnDemand, CapacityStatus=Used, MarketOption=OnDemand, no pre-installed
            software, no license. The MarketOption filter carries weight: the same SKU (stock
            keeping unit) also has a MarketOption=CapacityBlock row priced at zero, which quietly
            corrupts any naive search of the file.{' '}
            <SourceRef provenance="documented" doc={PRICE_LIST_VIRGINIA} label="doc: price list" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which families support Spot, and where a real rate comes from"
          >
            Spot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Where a Spot number can legitimately come from">
            <Box variant="p">
              The instance specification tables carry Spot eligibility as a plain column, so
              eligibility is citable. The rate is a different matter: Spot rates do not appear in
              the EC2 Price List bulk API, and no credential-free first-party AWS endpoint carrying
              them was located during this research. So a Spot rate cannot be pinned to a price
              list version the way every On-Demand rate here is,
              and any Spot figure you carry into a business case has to arrive with its own
              provenance and its own date.
            </Box>
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Families with no Spot support</Box>
              <Box variant="p">
                p6e-gb200.36xlarge and trn2u.48xlarge both show Spot support of No.{' '}
                <SourceRef provenance="documented" doc={AC_DOC} />
                {' '}Every HPC family is the same: hpc6a, hpc6id, hpc7a, hpc7g and hpc8a all show
                Spot support of No.{' '}
                <SourceRef provenance="documented" doc={HPC_DOC} />
              </Box>
              <Box variant="p">
                Our reading of both exclusions: the UltraServer types are reserved as a unit through
                Capacity Blocks, and the HPC families are built around whole-cluster tenancy.
              </Box>
            </div>
            <div>
              <Box variant="h3">Families with Spot support</Box>
              <Box variant="p">
                p4d, p4de, p5, p5e, p5en, p6-b200, p6-b300, trn1, trn1n, trn2, inf1, g6, g6e, g7
                and g7e all show Spot support of Yes.{' '}
                <SourceRef provenance="documented" doc={AC_DOC} />
              </Box>
              <Box variant="p">
                For a multi-node EFA job every instance has to
                land in one Availability Zone, and a single interruption takes the collective down
                with it. Treat Spot as viable for checkpointed training and unsuitable for
                latency-bound inference behind a placement constraint.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The final-day clock a job has to fit, and what an hour costs against On-Demand"
          >
            Capacity Blocks for ML
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Documented mechanics</Box>
              <ul>
                <li>Reserve a start time up to 8 weeks in advance.</li>
                <li>Duration of 1 to 14 days, or multiples of 7 days up to 182 days.</li>
                <li>
                  Up to 64 instances per Capacity Block, and up to 256 across blocks, counted across
                  every account in the AWS Organization on any one date.
                </li>
                <li>One UltraServer equals one Capacity Block, reserved as a unit.</li>
                <li>A block cannot be cancelled, moved or split once reserved.</li>
              </ul>
              <SourceRef provenance="documented" doc={CAPACITY_BLOCK_DOC} label="doc: how blocks work" />{' '}
              <SourceRef provenance="documented" doc={CAPACITY_BLOCK_UG_DOC} label="doc: considerations" />
            </div>
            <div>
              <Box variant="h3">The final-day clock</Box>
              <Box variant="p">
                Every block ends at 11:30 UTC (Coordinated Universal Time) on its final day, and
                instance-type blocks start terminating at 11:00 UTC{' '}
                <SourceRef provenance="documented" doc={CAPACITY_BLOCK_UG_DOC} />. UltraServer
                blocks start terminating 60 minutes before the end, with an EventBridge event 10
                minutes before termination begins{' '}
                <SourceRef provenance="documented" doc={CAPACITY_BLOCK_DOC} />.
              </Box>
              <Box variant="p">
                On a P6e-GB200 UltraServer block, instances must be terminated at least 60 minutes
                before the end{' '}
                <SourceRef provenance="documented" doc={CAPACITY_BLOCK_UG_DOC} />, which is 10:30
                UTC <DerivedBadge />. The monitoring page times the warning at 40 minutes before
                the end, with no UltraServer case{' '}
                <SourceRef provenance="documented" doc={CAPACITY_BLOCK_MONITOR_DOC} />, so for
                UltraServers the two pages disagree. Schedule the checkpoint and drain to finish
                before 11:00 UTC on an instance-type block and before 10:30 UTC on an UltraServer
                block.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            Our arithmetic, Tier 2 block rate over Tier 1 us-east-1 On-Demand rate: a block hour
            costs 99.8% of On-Demand on p6-b200 and p5en, 90.7% on p6-b300 and 86.8% on p5{' '}
            <DerivedBadge />.
          </Box>

          <ExpandableSection
            headerText="Published Capacity Block rates (Tier 2, product pricing page)"
            variant="footer"
          >
            <SpaceBetween size="s">
              <Alert type="info">
                <Box variant="p">
                  The page states: "The current prices are scheduled to be updated next in January,
                  2027."{' '}
                  <SourceRef
                    provenance="documented"
                    doc={CAPACITY_BLOCK_PRICING_DOC}
                    label="tier 2: pricing page"
                  />
                </Box>
              </Alert>
              <Table
                columnDefinitions={[
                  { id: 'item', header: 'Reservation unit', cell: (item) => <strong>{item.item}</strong> },
                  { id: 'regions', header: 'Regions listed', cell: (item) => item.regions },
                  {
                    id: 'hourly',
                    header: 'Effective hourly rate',
                    cell: (item) => (
                      <SpaceBetween size="xxs" direction="horizontal">
                        <span>{item.hourly}</span>
                        <SourceRef provenance="documented" doc={CAPACITY_BLOCK_PRICING_DOC} label="tier 2" />
                      </SpaceBetween>
                    ),
                  },
                ]}
                items={capacityBlockRates}
                sortingDisabled
                variant="embedded"
              />
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The placement rule that binds, and the capacity paths worth pricing."
          >
            What to settle before you launch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">One Availability Zone is the rule</Box>
              <Box variant="p">
                EFA traffic cannot cross Availability Zones or VPCs (Virtual Private Clouds){' '}
                <SourceRef provenance="documented" doc={EFA_DOC} />. That is the rule that removes
                redundancy across Availability Zones from an EFA cluster. The EFA limitations
                section adds that EFA is not supported on AWS Outposts, and that EFA traffic between
                P4d, P4de or DL1 instances and other instance types is not supported.
              </Box>
              <Box variant="p">
                A cluster placement group is how you get low latency inside that zone, and AWS
                frames it as advice: "It is not an absolute requirement to launch your EFA-enabled
                instances into a cluster placement group. However, we do recommend running your
                EFA-enabled instances in a cluster placement group as it launches the instances into
                a low-latency group in a single Availability Zone."{' '}
                <SourceRef provenance="documented" doc={EFA_START_DOC} label="doc: efa-start" />
                {' '}Skipping it is legal and usually a mistake.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick the capacity path, then price it</Box>
              <Box variant="p">
                Large accelerated fleets are capacity-constrained, and there is more than one way
                to secure them. An On-Demand Capacity Reservation (ODCR) can be created for a
                cluster placement group: "To ensure that capacity is
                available as you scale your cluster's instances, you can create a Capacity
                Reservation for your cluster placement group."{' '}
                <SourceRef provenance="documented" doc={EFA_START_DOC} />
              </Box>
              <Box variant="p">
                A Capacity Block is the fixed-window path. It takes no placement group, and places
                its instances close together inside EC2 UltraClusters itself{' '}
                <SourceRef provenance="documented" doc={CAPACITY_BLOCK_UG_DOC} />. A Savings Plan
                lowers the rate and reserves no capacity, so pair one with an ODCR to get both{' '}
                <SourceRef provenance="documented" doc={SAVINGS_PLANS_DOC} />. Settle the path,
                then rebuild the cost-per-Gbps column against a version you cite.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
