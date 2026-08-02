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
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SourceRef } from '@tech-deep-dives/shared';
import { docs, generations, instances } from '../data/instances';
import type { InstanceInfo } from '../data/instances';

/**
 * The pairing between Nitro version and EFA generation, drawn straight from
 * the four verbatim table headings in the EC2 User Guide. Horizontal
 * connectors only, so nothing crosses and nothing overlaps.
 */
function GenerationMappingDiagram() {
  const rows = [
    { nitro: 'Nitro v6', efa: 'EFA v4', peak: 'Up to 6,400 Gbps', example: 'p6-b300.48xlarge, 16 cards' },
    { nitro: 'Nitro v5', efa: 'EFA v3', peak: 'Up to 3,200 Gbps', example: 'p5en.48xlarge, trn2.48xlarge' },
    { nitro: 'Nitro v4', efa: 'EFA v2', peak: 'Up to 3,200 Gbps', example: 'p5.48xlarge, 32 cards' },
    { nitro: 'Nitro v3', efa: 'EFA v1', peak: 'Up to 400 Gbps', example: 'p4d.24xlarge, p4de.24xlarge' },
  ];

  return (
    <svg
      viewBox="0 0 900 320"
      role="img"
      aria-labelledby="efa-gen-map-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-gen-map-title">
        The EFA generation to Nitro version mapping. Nitro v6 pairs with EFA v4, Nitro v5 with
        EFA v3, Nitro v4 with EFA v2, and Nitro v3 with EFA v1. Peak per-instance EFA bandwidth
        is 6,400 Gbps on EFA v4, 3,200 Gbps on both EFA v3 and EFA v2, and 400 Gbps on EFA v1.
      </title>
      <style>
        {`
          .gm-nitro { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .gm-efa { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .gm-nt { fill: #0f1b2a; font: 600 15px sans-serif; text-anchor: middle; }
          .gm-et { fill: #ffffff; font: 600 15px sans-serif; text-anchor: middle; }
          .gm-hd { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; letter-spacing: 0.5px; }
          .gm-pk { fill: #0f1b2a; font: 600 12px sans-serif; }
          .gm-ex { fill: #5f6b7a; font: 11px sans-serif; }
          .gm-fn { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .gm-ar { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#gm-head); }
        `}
      </style>
      <defs>
        <marker id="gm-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>

      <text className="gm-hd" x="140" y="44">NITRO HYPERVISOR VERSION</text>
      <text className="gm-hd" x="480" y="44">EFA GENERATION</text>
      <text className="gm-hd" x="750" y="44">PEAK PER-INSTANCE EFA</text>

      {rows.map((row, index) => {
        const y = 62 + index * 58;
        return (
          <g key={row.nitro}>
            <rect className="gm-nitro" x="40" y={y} width="200" height="42" rx="6" />
            <text className="gm-nt" x="140" y={y + 27}>
              {row.nitro}
            </text>
            <path className="gm-ar" d={`M248,${y + 21} L372,${y + 21}`} />
            <rect className="gm-efa" x="380" y={y} width="200" height="42" rx="6" />
            <text className="gm-et" x="480" y={y + 27}>
              {row.efa}
            </text>
            <text className="gm-pk" x="620" y={y + 18}>
              {row.peak}
            </text>
            <text className="gm-ex" x="620" y={y + 34}>
              {row.example}
            </text>
          </g>
        );
      })}

      <text className="gm-fn" x="450" y="306">
        Source: the four table headings in the EC2 User Guide EFA supported-instance-types section.
      </text>
    </svg>
  );
}

const categoryTabs = [
  { id: 'gpu', label: 'GPU (NVIDIA)' },
  { id: 'trainium', label: 'Trainium / Inferentia' },
  { id: 'hpc', label: 'HPC Optimized' },
  { id: 'general', label: 'General Purpose' },
  { id: 'all', label: 'All' },
];

function efaBadgeColor(version: InstanceInfo['efaVersion']) {
  if (version === 'EFAv4') return 'green';
  if (version === 'EFAv3') return 'blue';
  return 'grey';
}

function matchesFilter(item: InstanceInfo, needle: string) {
  if (!needle) return true;
  const lower = needle.toLowerCase();
  return [
    item.family,
    item.type,
    item.accelerator,
    item.efaVersion,
    item.nitroVersion,
    item.rdma,
    item.useCase,
    item.generation,
    String(item.bandwidthGbps),
    String(item.efaInterfaces),
  ].some((field) => field.toLowerCase().includes(lower));
}

export function InstanceSupport() {
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('gpu');

  const filtered = instances.filter(
    (item) => (activeTab === 'all' || item.category === activeTab) && matchesFilter(item, filterText)
  );

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="I need to pick an instance for my workload. Which ones have EFA, how much bandwidth, and can I check it myself?"
          >
            Instance Support Matrix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              EFA (Elastic Fabric Adapter) support is a property of the Nitro hypervisor
              generation, not of the accelerator.
            </strong>{' '}
            That single fact decides the EFA generation, the RDMA (Remote Direct Memory Access)
            capability and the bandwidth ceiling of every row below. EFA-capable types run from
            25 Gbps at the small end (g6.8xlarge, gr6.8xlarge, vt1.24xlarge) to 6,400 Gbps on
            p6-b300.48xlarge{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />, and the ceiling tracks the
            Nitro version in a straight line.
          </Box>

          <Alert type="info" header="Correction: this page had the generation mapping off by one">
            <SpaceBetween size="xs">
              <Box variant="p">
                An earlier version of this table treated Nitro v6 as EFA v3 and described EFA v4
                as P6e-GB200 only. AWS titles its four supported-instance-type tables verbatim as{' '}
                <em>Using Nitro v6 (EFA v4)</em>, <em>Using Nitro v5 (EFA v3)</em>,{' '}
                <em>Using Nitro v4 (EFA v2)</em> and <em>Using Nitro v3 (EFA v1)</em>{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. The shifted mapping
                corrupted nine instance rows and three of the four generation summaries. Both are
                corrected here.
              </Box>
              <Box variant="p">
                The practical cost of that error: it put P6-B200, P6-B300, Hpc8a, C8i and M8i one
                generation lower than they are, and it hid the fact that EFA v4 is a broad Nitro
                v6 family rather than a single UltraServer type.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Read the heading, do not infer the pairing">
            EFA generation to Nitro version
          </Header>
        }
      >
        <SpaceBetween size="m">
          <GenerationMappingDiagram />
          <Box variant="p">
            RDMA follows the same ladder. AWS states that EFA supports RDMA write on most
            supported instance types with Nitro version 4 and later, and RDMA read on all
            instances with Nitro version 4 and later{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. Five types break the write rule
            despite being Nitro v5: c7gn.16xlarge, c7gn.metal, hpc7g.4xlarge, hpc7g.8xlarge and
            hpc7g.16xlarge are read only. On Nitro v3 only p4d.24xlarge and p4de.24xlarge have
            RDMA read at all.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">What each generation covers</Header>}>
        <ColumnLayout columns={4} variant="text-grid">
          {generations.map((gen) => (
            <div key={gen.efaVersion}>
              <Box variant="h3">
                {gen.efaVersion} <Badge color={efaBadgeColor(gen.efaVersion)}>Nitro {gen.nitroVersion}</Badge>
              </Box>
              <Box variant="p">
                <strong>{gen.maxBandwidthGbps.toLocaleString()} Gbps peak</strong> on{' '}
                {gen.maxBandwidthType}.
              </Box>
              <Box variant="p">{gen.rdma}</Box>
              <Box variant="small" color="text-body-secondary">
                Families: {gen.examples}.
              </Box>
            </div>
          ))}
        </ColumnLayout>
      </Container>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={categoryTabs}
      />

      <Table
        header={
          <Header
            counter={`(${filtered.length})`}
            description="One EFA interface per network card. Bandwidth is the aggregate EFA ceiling, not per interface."
          >
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
            cell: (item) => (
              <SpaceBetween size="xxxs">
                <strong>{item.type}</strong>
                {item.note && (
                  <Box variant="small" color="text-body-secondary">
                    {item.note}
                  </Box>
                )}
              </SpaceBetween>
            ),
            sortingField: 'type',
          },
          {
            id: 'accelerator',
            header: 'Accelerator',
            cell: (item) => item.accelerator,
          },
          {
            id: 'efaVersion',
            header: 'EFA Gen / Nitro',
            cell: (item) => (
              <SpaceBetween size="xxxs" direction="horizontal">
                <Badge color={efaBadgeColor(item.efaVersion)}>{item.efaVersion}</Badge>
                <Badge color="grey">Nitro {item.nitroVersion}</Badge>
                <SourceRef
                  provenance={item.provenance}
                  doc={item.doc}
                  conflict={item.conflict}
                  label={item.provenance === 'doc-code-conflict' ? 'conflict' : undefined}
                />
              </SpaceBetween>
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
            header: 'Max EFA Bandwidth',
            cell: (item) => `${item.bandwidthGbps.toLocaleString()} Gbps`,
            sortingField: 'bandwidthGbps',
          },
          {
            id: 'rdma',
            header: 'RDMA',
            cell: (item) => (
              <Badge color={item.rdma === 'read + write' ? 'green' : item.rdma === 'read only' ? 'blue' : 'grey'}>
                {item.rdma}
              </Badge>
            ),
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
              <Badge color={item.generation === 'Current' ? 'green' : 'grey'}>{item.generation}</Badge>
            ),
          },
        ]}
        items={filtered}
        variant="full-page"
        empty={<Box variant="p">No instance types match that filter.</Box>}
      />

      <Container
        header={
          <Header
            variant="h2"
            description="Do not trust this table. Ask the API, in your own region, on the day you need the answer."
          >
            Check it yourself with the CLI
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EC2 exposes EFA support as a filterable attribute on DescribeInstanceTypes, so the
            authoritative list for any region is one AWS CLI (Command Line Interface) command
            away. Regional availability moves faster than any published table, this one included.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# 1. Every EFA-capable instance type in one region, alphabetically.
aws ec2 describe-instance-types \
  --region us-east-1 \
  --filters Name=network-info.efa-supported,Values=true \
  --query 'InstanceTypes[].InstanceType' \
  --output text | tr '\t' '\n' | sort

# 2. How many there are, so you can tell whether this page is stale.
aws ec2 describe-instance-types \
  --region us-east-1 \
  --filters Name=network-info.efa-supported,Values=true \
  --query 'length(InstanceTypes)'

# 3. The three numbers that matter for one type: network cards,
#    maximum EFA interfaces, and headline network performance.
aws ec2 describe-instance-types \
  --region us-east-1 \
  --instance-types c8i.48xlarge m8i.48xlarge hpc6a.48xlarge \
  --query 'InstanceTypes[].{type:InstanceType,
                            cards:NetworkInfo.MaximumNetworkCards,
                            efa:NetworkInfo.EfaInfo.MaximumEfaInterfaces,
                            perf:NetworkInfo.NetworkPerformance}' \
  --output table`}</pre>
          </Box>

          <Box variant="p">
            The <code>network-info.efa-supported</code> filter is the one AWS documents{' '}
            <SourceRef provenance="documented" doc={docs.efa} />, and the field names in command
            3 come from the DescribeInstanceTypes response shape{' '}
            <SourceRef provenance="documented" doc={docs.api} />. Command 3 is the fastest way to
            confirm the surprising rows: c8i.48xlarge and m8i.48xlarge report one network card
            and 75 Gbps, and hpc6a.48xlarge reports one card and 100 Gbps.
          </Box>

          <Alert type="info">
            EFA support in the API is a per-region answer. A type can be EFA-capable in
            us-east-1 and absent from another region entirely. Run the command against the region
            you are actually going to launch in.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Places where AWS disagrees with AWS, published rather than resolved">
            Contradictions and gaps
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ExpandableSection
            headerText="P6e-GB200: EFA v3 or EFA v4? AWS says both"
            headerDescription="Two Tier 1 technical docs against two first-party product pages"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The EC2 User Guide lists p6e-gb200.36xlarge in the table headed{' '}
                <em>Using Nitro v5 (EFA v3)</em>, and the accelerated computing instance-types
                page gives the P6e-GB200 family hypervisor as Nitro v5. Under the mapping above,
                that makes it EFA v3.
              </Box>
              <Box variant="p">
                The UltraServers product page states, in these words, that P6e-GB200 UltraServers
                deliver up to 28.8 terabits per second of Elastic Fabric Adapter (EFAv4)
                networking. The P6 product page says the same. Both sides are AWS-authored and
                they cannot both be right.
              </Box>
              <Box variant="p">
                This page publishes Nitro v5 because two independent Tier 1 technical documents
                agree on it, and keeps the EFA generation flagged as contested rather than
                silently picking a winner{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.efa}
                  conflict="The UltraServers and P6 product pages state EFAv4 for P6e-GB200. The EC2 User Guide table heading and the accelerated computing page both say Nitro v5, which pairs with EFA v3."
                  label="doc conflict"
                />
                . If you are sizing on this, ask your account team which one governs the hardware
                you will actually be assigned.
              </Box>
              <Alert type="warning" header="Second P6e-GB200 tension, on bandwidth">
                The accelerated computing page lists p6e-gb200.36xlarge at 3,200 Gbps with 17
                network cards. The multi-network-card guide caps EFA at 1,600 Gbps for the same
                type{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. These reconcile: 3,200
                Gbps is total physical card capacity, and the 1,600 Gbps EFA ceiling comes from
                the GPU sharing topology. Anyone spot-checking against the instance-types page
                alone will read 3,200 and think this table is wrong.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="P6-B300: 17 network cards, 16 of them EFA-capable"
            headerDescription="The headline card count includes one that cannot carry EFA"
          >
            <Box variant="p">
              AWS states that P6-B300 instances have 8 GPUs and 17 network cards, where the
              primary network card supports only an ENA interface with up to 350 Gbps, and the
              secondary cards support up to 400 Gbps EFA and up to 220 Gbps ENA each{' '}
              <SourceRef provenance="documented" doc={docs.efaAcc} />. So the EFA-capable count
              is 16, and 16 x 400 Gbps is exactly the 6,400 Gbps headline. Quoting 17 EFA
              interfaces overstates the fabric by one card and makes the arithmetic stop working.
            </Box>
          </ExpandableSection>

          <ExpandableSection
            headerText="Trn2 accelerator memory: an AWS-internal contradiction"
            headerDescription="512 GiB per chip in the docs, 1.5 TB total on the product page"
          >
            <Box variant="p">
              The accelerated computing page gives trn2.48xlarge as 16 AWS Trainium2 accelerators
              with 8,192 GiB, expressed as 16 x 512 GiB. The Trn2 product page gives 1.5 TB
              total for the same instance, which works out near 96 GB per chip. The two cannot
              both hold. This table leaves accelerator memory off the Trn2 rows rather than
              picking a side, and the same split applies to trn2.3xlarge (512 GiB against 96 GB).
              Every EFA-relevant field on those rows, 16 cards and 3,200 Gbps at EFA v3 on Nitro
              v5, is consistent across sources{' '}
              <SourceRef provenance="documented" doc={docs.efa} />.
            </Box>
          </ExpandableSection>

          <ExpandableSection
            headerText="Trn3 UltraServers: announced, not listed"
            headerDescription="Generally available since 2025-12-02, with no trn3 entry in the EFA table"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS announced general availability of Trn3 UltraServers on 2025-12-02, built on
                Trainium3: 2.52 petaflops of FP8 (8-bit floating point) compute per chip, 144 GB
                of HBM3e (High Bandwidth Memory) per chip, 4.9 TB/s of memory bandwidth per chip,
                up to 144 chips per UltraServer, and a NeuronSwitch-v1 all-to-all fabric{' '}
                <SourceRef provenance="documented" doc={docs.trn3} />.
              </Box>
              <Box variant="p">
                No trn3 instance type of any size appears in the EFA supported-instance-types
                tables, in the accelerated computing instance-types page, or in the us-east-1
                price list as of 2026-08-01. That is why there is no Trn3 row above. An EFA
                device count or per-instance EFA bandwidth for Trn3 cannot be stated from any
                Tier 1 source today.
              </Box>
              <Alert type="warning" header="Figure deliberately not published">
                A 28.8 Tbps aggregate scale-out bandwidth figure circulates for Trn3
                UltraServers. It does not appear in the AWS announcement, and 28.8 Tbps is also
                the published P6e-GB200 UltraServer EFA figure, which makes a transcription
                collision the likeliest explanation. It is left out until a direct citation
                exists.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Spot eligibility, where it is missing"
            headerDescription="Sourceable from the instance-types pages. Spot prices are not."
          >
            <Box variant="p">
              P6e-GB200 and Trn2u carry no Spot support, and neither does any HPC family: Hpc6a,
              Hpc6id, Hpc7a, Hpc7g and Hpc8a are all Spot-ineligible{' '}
              <SourceRef provenance="documented" doc={docs.hpc} />. P4d, P4de, P5, P5e, P5en,
              P6-B200, P6-B300, Trn1, Trn1n, Trn2, Inf1, G6, G6e, G7 and G7e do support Spot{' '}
              <SourceRef provenance="documented" doc={docs.ac} />. Spot prices themselves are
              not published in any credential-free AWS endpoint, so no Spot rate or savings
              percentage appears anywhere on this page.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Alert type="warning" header="A cluster placement group is not required for EFA">
        <SpaceBetween size="xs">
          <Box variant="p">
            AWS is explicit: it is not an absolute requirement to launch your EFA-enabled
            instances into a cluster placement group. AWS recommends one because it lands the
            instances in a low-latency group in a single Availability Zone{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>
          <Box variant="p">
            The hard constraint is the Availability Zone. EFA traffic cannot cross Availability
            Zones or VPCs (Virtual Private Clouds){' '}
            <SourceRef provenance="documented" doc={docs.efa} />. EFA is also unsupported on AWS
            Outposts, and EFA traffic between P4d, P4de or DL1 instances and other instance types
            is not supported. Treat the placement group as the recommended way to satisfy the
            same Availability Zone requirement and to keep latency low, not as a gate on EFA
            itself. If capacity is the worry, a Capacity Reservation for the cluster placement
            group is the documented answer.
          </Box>
        </SpaceBetween>
      </Alert>

      <Alert type="warning" header="P6e-GB200 network card index bandwidth sharing">
        Network card index pairs [1,2], [3,4], [5,6] and so on up to [15,16] share one underlying
        physical card capped at 400 Gbps, and a second set of pairs, [1,3], [5,7], [9,11] and
        [13,15], share a GPU that itself supports up to 400 Gbps of EFA{' '}
        <SourceRef provenance="documented" doc={docs.efaAcc} />. That is two independent sharing
        axes. Saturating one index reduces what its partner can reach on both. Neither axis is
        visible from the headline 1,600 Gbps figure, which is why AWS documents two valid layouts
        for it: 4 interfaces at 400 Gbps, or 8 interfaces at 200 Gbps.
      </Alert>

      <Alert type="warning" header="Common misconception: Inf2 has no EFA">
        No Inf2 size appears in any of the four EFA supported-instance-type tables{' '}
        <SourceRef provenance="documented" doc={docs.efa} />. Only inf1.24xlarge, the largest
        Inf1, has a single 100 Gbps EFA interface, and on Nitro v3 it has no RDMA at all.
        Multi-node Inf2 inference runs over standard ENA networking.
      </Alert>

      <Container header={<Header variant="h2">What this table does not cover</Header>}>
        <Box variant="p">
          Roughly 200 instance types are EFA-capable. The rows above are the ones a technical
          lead actually chooses between, so several sourced groups are represented by their
          largest size or left out on purpose: the R, X, I and U7i high-memory EFA v2 sets, the
          Graviton5 c9g and m9g at 100 Gbps on EFA v4, the c8gb and m8gb pair at 400 Gbps, the
          smaller Hpc7a and Hpc7g sizes, and the Nitro v3 legacy tail (m5n, r5n, i3en, x2iezn,
          g4dn, g5, p3dn, vt1, dl2q). That tail is slower than its reputation: g4dn.8xlarge
          through g4dn.16xlarge run at 50 Gbps, g5 sizes run 25 to 50 Gbps, and vt1.24xlarge runs
          at 25 Gbps{' '}
          <SourceRef provenance="documented" doc={docs.ac} />. Only g4dn.metal and g5.48xlarge
          reach 100 Gbps. Use the first CLI command above for the complete per-region list.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
