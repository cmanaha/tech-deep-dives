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
  CAPACITY_BLOCK_PRICING_DOC,
  EFA_DOC,
  EFA_START_DOC,
  HPC_DOC,
  PRICE_LIST_ARCHIVE,
  PRICE_LIST_VIRGINIA,
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
  { component: 'EFA interface', cost: 'Free', notes: 'AWS states EFA can be enabled "on any supported instance at no additional cost".' },
  { component: 'EFA data transfer', cost: 'Free', notes: 'No per-GB charge. EFA traffic cannot cross an Availability Zone, so there is no cross-AZ transfer charge to incur.' },
  { component: 'Instance premium', cost: 'None', notes: 'There is no EFA surcharge on the instance rate. The same SKU is billed whether or not you attach an EFA.' },
  { component: 'Cluster placement group', cost: 'Free', notes: 'Placement groups themselves are not billed.' },
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
            description="EFA is free. The instances are the cost, and the price list is the only citable source for what they cost."
          >
            Pricing Analysis
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="success" header="EFA (Elastic Fabric Adapter) carries no additional charge">
            <Box variant="p">
              The EC2 User Guide states it plainly: "EFA is available as an optional Amazon EC2
              networking feature that you can enable on any supported instance at no additional
              cost."{' '}
              <SourceRef
                provenance="documented"
                doc={EFA_DOC}
                label="doc: EFA pricing"
              />
            </Box>
          </Alert>
          <Box variant="p">
            Every On-Demand rate on this page was read out of the AWS Price List bulk API,
            publication version 20260728175247, under one strict filter: Linux, Shared tenancy,
            TermType=OnDemand, CapacityStatus=Used, MarketOption=OnDemand, no pre-installed
            software, no license. That last filter carries weight. The same SKU (stock keeping
            unit) also has a MarketOption=CapacityBlock row priced at zero, which quietly
            corrupts any naive search of the file.{' '}
            <SourceRef provenance="documented" doc={PRICE_LIST_VIRGINIA} label="doc: price list" />
          </Box>
        </SpaceBetween>
      </Container>

      <Table
        header={<Header variant="h2">What EFA itself costs</Header>}
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
            description="us-east-1, Linux, Shared tenancy, On-Demand. Price list version 20260728175247."
          >
            Instance cost against EFA bandwidth
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The useful question is not what EFA costs. It is what a Gbps of EFA bandwidth costs on
            each family, because that is the number that decides whether you scale out on cheap
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
          <Alert type="info" header="The cost-per-Gbps column is our arithmetic, not an AWS figure">
            <Box variant="p">
              AWS does not publish a cost-per-Gbps metric. This column is the On-Demand column
              divided by the max EFA bandwidth column, both of which carry their own citation, so
              you can redo the sum. It is a comparison aid, not a price. It also ignores
              everything an instance does besides move packets, which is why c8i.48xlarge looks
              terrible here and is still the right choice for a workload that is mostly compute.
            </Box>
          </Alert>
          <Alert type="warning" header="Rates move, and this page has been wrong before">
            <Box variant="p">
              A price list version is a snapshot. Re-pull the bulk API before you build a business
              case on any number here, and check the region: several EFA-capable families are not
              sold in us-east-1 at all.
            </Box>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The HPC (high performance computing) families are sold in Ohio, not N. Virginia."
          >
            HPC instances, and the region trap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            hpc8a, hpc7a, hpc6id and hpc6a have zero rows of any term type in the us-east-1 price
            list. Quoting an hpc7a rate under a us-east-1 heading is not a rounding error, it is a
            SKU that does not exist. hpc7g is the exception: it does carry a us-east-1 rate.{' '}
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
            description="Why a stale rate and a recent price cut look identical unless the version is cited"
          >
            Staleness, not a price move
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
              A price is a claim with an expiry date. Cite the price list version you read, not
              just the URL, so the next reader can tell staleness from a real change. Every rate on
              this page is pinned to version 20260728175247.
            </Box>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Eligibility is sourceable. Prices are not."
          >
            Spot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="This page publishes no Spot price">
            <Box variant="p">
              Spot rates do not appear in the EC2 Price List bulk API or in any credential-free
              first-party AWS endpoint. Any Spot number on a page like this one is either a stale
              observation from someone's account or an invented discount. A previous version of
              this section applied an identical "60 percent savings" to four different instance
              families, which is the shape of a number nobody measured. What is citable is Spot
              eligibility, which the instance specification tables carry as a plain column.
            </Box>
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Spot is not offered</Box>
              <Box variant="p">
                p6e-gb200.36xlarge and trn2u.48xlarge both show Spot support of No.{' '}
                <SourceRef provenance="documented" doc={AC_DOC} />
                {' '}Every HPC family is the same: hpc6a, hpc6id, hpc7a, hpc7g and hpc8a all show
                Spot support of No.{' '}
                <SourceRef provenance="documented" doc={HPC_DOC} />
              </Box>
              <Box variant="p">
                Both exclusions follow from how the capacity is sold. The UltraServer types are
                reserved as a unit through Capacity Blocks, and the HPC families are built around
                whole-cluster tenancy.
              </Box>
            </div>
            <div>
              <Box variant="h3">Spot is offered</Box>
              <Box variant="p">
                p4d, p4de, p5, p5e, p5en, p6-b200, p6-b300, trn1, trn1n, trn2, inf1, g6, g6e, g7
                and g7e all show Spot support of Yes.{' '}
                <SourceRef provenance="documented" doc={AC_DOC} />
              </Box>
              <Box variant="p">
                Eligibility is not availability. For a multi-node EFA job every instance has to
                land in one Availability Zone, and a single interruption takes the collective down
                with it. Treat Spot as viable for checkpointed training and unsuitable for
                latency-bound inference behind a placement constraint.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Placement, capacity and the constraints that actually bind</Header>}>
        <SpaceBetween size="m">
          <Alert type="error" header="A cluster placement group is recommended, not required">
            <Box variant="p">
              EFA does not require a cluster placement group. AWS says so in as many words: "It is
              not an absolute requirement to launch your EFA-enabled instances into a cluster
              placement group. However, we do recommend
              running your EFA-enabled instances in a cluster placement group as it launches the
              instances into a low-latency group in a single Availability Zone."{' '}
              <SourceRef provenance="documented" doc={EFA_START_DOC} label="doc: efa-start" />
            </Box>
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The hard constraint is one Availability Zone</Box>
              <Box variant="p">
                The EFA limitations section is unambiguous: "EFA traffic can't cross Availability
                Zones or VPCs."{' '}
                <SourceRef provenance="documented" doc={EFA_DOC} />
                {' '}That is the rule that removes cross-AZ redundancy from an EFA cluster, not the
                placement group. The same section adds that EFA is not supported on AWS Outposts,
                and that EFA traffic between P4d, P4de or DL1 instances and other instance types is
                not supported.
              </Box>
              <Box variant="p">
                The placement group is how you get low latency inside that zone. Skipping it is
                legal and usually a mistake.
              </Box>
            </div>
            <div>
              <Box variant="h3">Capacity paths</Box>
              <Box variant="p">
                Large accelerated fleets are capacity-constrained, and there is more than one way
                to secure them. AWS documents On-Demand Capacity Reservations against a cluster
                placement group directly in the EFA setup guide: "To ensure that capacity is
                available as you scale your cluster's instances, you can create a Capacity
                Reservation for your cluster placement group."{' '}
                <SourceRef provenance="documented" doc={EFA_START_DOC} />
              </Box>
              <Box variant="p">
                So Capacity Blocks are one option, not the only guaranteed path. Savings Plans and
                an account-team capacity commitment sit alongside them.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Fixed-window reserved capacity, and the mechanics that are actually documented"
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
                <li>Up to 64 instances per Capacity Block, up to 256 across multiple blocks.</li>
                <li>One UltraServer equals one Capacity Block. You reserve the UltraServer, not the instances inside it.</li>
                <li>
                  Instances are terminated starting 30 minutes before the block ends for instance
                  types, or 60 minutes for UltraServer types, with an EventBridge event 10 minutes
                  before termination begins.
                </li>
              </ul>
              <SourceRef provenance="documented" doc={CAPACITY_BLOCK_DOC} label="doc: capacity blocks" />
            </div>
            <div>
              <Box variant="h3">Claims removed from this page</Box>
              <Box variant="p">
                Three statements that used to sit here failed verification against first-party
                sources and have been deleted rather than reworded: that Capacity Block prices rose
                roughly 15 percent in January 2026, that block end times are fixed at a set clock
                time in UTC, and that blocks cannot be cancelled. None of the three appears in the
                Capacity Blocks documentation or on the pricing page.
              </Box>
              <Box variant="p">
                The first claim was also paired with the assertion that On-Demand prices fell at
                the same moment. The On-Demand cut landed in June 2025, so even the framing was
                off.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection
            headerText="Published Capacity Block rates (Tier 2, product pricing page)"
            variant="footer"
          >
            <SpaceBetween size="s">
              <Alert type="info">
                <Box variant="p">
                  These rates come from the Capacity Blocks product pricing page, which is a Tier 2
                  source, not from the Price List bulk API that backs every other number on this
                  page. They are kept in their own table for that reason. Do not mix them into a
                  comparison with the On-Demand rates above without saying which tier each figure
                  came from. The page states: "The current prices are scheduled to be updated next
                  in October, 2026."{' '}
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
    </SpaceBetween>
  );
}
