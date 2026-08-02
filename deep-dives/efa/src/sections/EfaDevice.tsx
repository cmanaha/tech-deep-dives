import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Table from '@cloudscape-design/components/table';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * The EFA device itself: how it attaches, how many of them an instance has,
 * what the host has to give it, and how you tell the generations apart.
 *
 * Sourcing rule for this file (deep-dives/efa/revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef. 'documented' means AWS states
 * it. 'code-derived' means it was read out of an implementation at a pinned
 * commit and AWS documents nothing. Nothing here is laundered between the two.
 */

const ACCESSED = '2026-08-01';
const READ = '2026-08-01';

/** amzn-drivers master HEAD at the time of reading: driver r3.3.0. */
const DRIVER_SHA = 'b99452b70756b1b394b1e7ff238d4efbdca44c5b';
const PLUGIN_TAG = 'v1.20.0';
const LIBFABRIC_TAG = 'v2.6.0';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';
const EKS_DOC = 'https://docs.aws.amazon.com/eks/latest/userguide/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

/** Pinned code reference builders. Ref is always a SHA or a release tag, never a branch. */
const drv = (path: string, lines?: string): CodeRef => ({
  repo: 'amzn/amzn-drivers',
  ref: DRIVER_SHA,
  path: `kernel/linux/efa/${path}`,
  lines,
  read: READ,
});
const plugin = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/aws-ofi-nccl',
  ref: PLUGIN_TAG,
  path,
  lines,
  read: READ,
});
const lfab = (path: string, lines?: string): CodeRef => ({
  repo: 'ofiwg/libfabric',
  ref: LIBFABRIC_TAG,
  path,
  lines,
  read: READ,
});

const docs = {
  efa: doc('EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads', `${EC2_DOC}efa.html`, 1),
  efaStart: doc('EC2 User Guide: Get started with EFA and MPI', `${EC2_DOC}efa-start.html`, 1),
  efaAcc: doc(
    'EC2 User Guide: Maximize network bandwidth on instances with multiple network cards',
    `${EC2_DOC}efa-acc-inst-types.html`,
    1
  ),
  changelog: doc('EC2 User Guide: Elastic Fabric Adapter release notes', `${EC2_DOC}efa-changelog.html`, 1),
  eksNode: doc('EKS User Guide: Machine learning training on Amazon EKS with EFA', `${EKS_DOC}node-efa.html`, 1),
  eksDevice: doc('EKS User Guide: EFA device management with Dynamic Resource Allocation', `${EKS_DOC}device-management-efa.html`, 1),
  efaOnlyNews: doc(
    "AWS What's New: EFA updates for scalability of AI/ML applications (Oct 24, 2024)",
    'https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/',
    2
  ),
};

const code = {
  pciIds: drv('src/efa_main.c', 'L27-L39'),
  msix: drv('src/efa_main.c', 'L757-L785'),
  vectorIdx: drv('src/efa.h', 'L25-L26'),
  eqClamp: drv('src/efa_main.c', 'L380-L392'),
  queryDevice: drv('src/efa_verbs.c', 'L350-L359'),
  registerMr: drv('src/efa_verbs.c', 'L2628-L2636'),
  inlinePbl: drv('src/efa_com_cmd.h', 'L183-L188'),
  dkms: drv('conf/dkms.conf'),
  releaseNotes: drv('RELEASENOTES.md'),
  railContract: plugin('include/nccl_ofi_platform.h', 'L82-L97'),
  sortRails: plugin('src/platform-aws.cpp', 'L961-L991'),
  guidByDeviceId: plugin('src/platform-aws.cpp', 'L939-L959'),
  subCq: lfab('prov/efa/src/efa_device.c', 'L520-L526'),
};

/**
 * Diagram 1. Three interface flavours and the device nodes each one creates.
 * Idiom A (class-name prefix "am-"). Self-contained on a painted light ground
 * so it survives Cloudscape dark mode.
 */
function AttachmentModesDiagram() {
  const panels = [
    {
      title: 'ENA interface',
      api: 'InterfaceType = interface',
      ena: true,
      efa: false,
      facts: ['IP networking: yes', 'Can be the primary interface: yes', 'OS-bypass transport: no'],
    },
    {
      title: 'EFA with ENA',
      api: 'InterfaceType = efa',
      ena: true,
      efa: true,
      facts: ['IP networking: yes', 'Can be the primary interface: yes', 'OS-bypass transport: yes'],
    },
    {
      title: 'EFA-only',
      api: 'InterfaceType = efa-only',
      ena: false,
      efa: true,
      facts: ['IP networking: no', 'Can be the primary interface: no', 'OS-bypass transport: yes'],
    },
  ];

  return (
    <svg
      viewBox="0 0 900 340"
      role="img"
      aria-labelledby="efa-attach-modes-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-attach-modes-title">
        An EFA-only interface creates an EFA device and no ENA device, which is why it cannot be
        the primary interface and cannot hold an IP address. An EFA with ENA interface creates both
        devices on the same interface, and a plain ENA interface creates only the ENA device.
      </title>
      <style>
        {`
          .am-panel { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .am-hd { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .am-api { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .am-on { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .am-off { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .am-ont { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .am-offt { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
          .am-fact { fill: #0f1b2a; font: 11px sans-serif; }
          .am-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="900" height="340" rx="8" fill="#ffffff" />

      {panels.map((panel, index) => {
        const x0 = 30 + index * 280;
        return (
          <g key={panel.title}>
            <rect className="am-panel" x={x0} y="40" width="260" height="252" rx="8" />
            <text className="am-hd" x={x0 + 130} y="68">
              {panel.title}
            </text>
            <text className="am-api" x={x0 + 130} y="88">
              {panel.api}
            </text>

            <rect className={panel.ena ? 'am-on' : 'am-off'} x={x0 + 20} y="102" width="220" height="40" rx="6" />
            <text className={panel.ena ? 'am-ont' : 'am-offt'} x={x0 + 130} y="127">
              {panel.ena ? 'ENA device present' : 'no ENA device'}
            </text>

            <rect className={panel.efa ? 'am-on' : 'am-off'} x={x0 + 20} y="152" width="220" height="40" rx="6" />
            <text className={panel.efa ? 'am-ont' : 'am-offt'} x={x0 + 130} y="177">
              {panel.efa ? 'EFA device present' : 'no EFA device'}
            </text>

            {panel.facts.map((fact, factIndex) => (
              <text className="am-fact" key={fact} x={x0 + 20} y={216 + factIndex * 20}>
                {fact}
              </text>
            ))}
          </g>
        );
      })}

      <text className="am-cap" x="450" y="318">
        Rows follow the ENA, EFA with ENA and EFA-only comparison table in the EC2 User Guide.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. The four counts readers conflate, walked down one instance type.
 * Idiom A (class-name prefix "cr-").
 */
function CardsInterfacesRailsDiagram() {
  const lanes = [
    {
      label: 'Network cards',
      sub: 'hardware slot',
      count: '32',
      unit: 'p5.48xlarge',
      lines: [
        'AWS states p5.48xlarge and p5e.48xlarge support 32 network cards, indexed',
        '0 through 31. DescribeInstanceTypes returns this as MaximumNetworkCards.',
        'It is a slot count, not an EFA count.',
      ],
    },
    {
      label: 'Network interfaces',
      sub: 'what you attach',
      count: '33',
      unit: 'AWS example',
      lines: [
        'The AWS launch example attaches 33 interfaces across those 32 cards: an ENA',
        'on card 0 device index 0, an EFA-only on card 0 device index 1, and one',
        'EFA-only on each of card 1 through card 31.',
      ],
    },
    {
      label: 'EFA devices',
      sub: 'what libfabric sees',
      count: '32',
      unit: 'EFA devices',
      lines: [
        'AWS calls that same example a request with 32 EFA devices and one ENA',
        'device. This is what fi_info lists, and what a collectives library',
        'divides its traffic across.',
      ],
    },
    {
      label: 'Rails',
      sub: 'software grouping',
      count: 'N',
      unit: 'per group',
      lines: [
        'A rail is an index, not a device. The NCCL plugin sorts the provider list',
        'so the Nth device here talks to the Nth device on remote nodes, then splits',
        'it into one group per accelerator. No AWS document defines the term.',
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 900 430"
      role="img"
      aria-labelledby="efa-cards-rails-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-cards-rails-title">
        Network cards, network interfaces, EFA devices and rails are four different counts. A
        p5.48xlarge has 32 network cards, AWS attaches 33 interfaces to them in its own maximum
        bandwidth example, that yields 32 EFA devices, and rails are a software index the NCCL
        plugin assigns on top of those devices rather than anything the hardware exposes.
      </title>
      <style>
        {`
          .cr-lbl { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .cr-body { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .cr-lt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: end; }
          .cr-ls { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .cr-num { fill: #0972d3; font: 600 22px sans-serif; text-anchor: middle; }
          .cr-unit { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .cr-txt { fill: #0f1b2a; font: 11px sans-serif; }
          .cr-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#cr-head); }
          .cr-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="cr-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="430" rx="8" fill="#ffffff" />

      {lanes.map((lane, index) => {
        const y = 50 + index * 95;
        return (
          <g key={lane.label}>
            <rect className="cr-lbl" x="30" y={y} width="180" height="72" rx="6" />
            <text className="cr-lt" x="196" y={y + 32}>
              {lane.label}
            </text>
            <text className="cr-ls" x="196" y={y + 50}>
              {lane.sub}
            </text>

            <rect className="cr-body" x="230" y={y} width="640" height="72" rx="6" />
            <text className="cr-num" x="290" y={y + 36}>
              {lane.count}
            </text>
            <text className="cr-unit" x="290" y={y + 54}>
              {lane.unit}
            </text>
            {lane.lines.map((line, lineIndex) => (
              <text className="cr-txt" key={line} x="352" y={y + 24 + lineIndex * 18}>
                {line}
              </text>
            ))}

            {index < lanes.length - 1 && <path className="cr-arr" d={`M550,${y + 72} L550,${y + 90}`} />}
          </g>
        );
      })}

      <text className="cr-cap" x="450" y="422">
        Counts for p5.48xlarge. Rail behaviour is read from the aws-ofi-nccl plugin source, not from
        AWS documentation.
      </text>
    </svg>
  );
}

interface CountRow {
  term: string;
  owner: string;
  p5: string;
  how: string;
}

/** The four counts that get conflated, and who decides each one. */
const countRows: CountRow[] = [
  {
    term: 'Network card',
    owner: 'EC2 instance type',
    p5: '32',
    how: 'MaximumNetworkCards in DescribeInstanceTypes',
  },
  {
    term: 'Network interface',
    owner: 'You, at launch',
    p5: '33 in the AWS example',
    how: 'The --network-interfaces list you pass to run-instances',
  },
  {
    term: 'EFA device',
    owner: 'How many EFA or EFA-only interfaces you attached',
    p5: '32',
    how: 'fi_info entries, one per device per fabric',
  },
  {
    term: 'Rail',
    owner: 'The collectives plugin at runtime',
    p5: 'a per-group index',
    how: 'Not exposed by any AWS API. Plugin internal.',
  },
];

interface HostRequirement {
  id: string;
  item: string;
  what: string;
  fails: string;
}

const hostRequirements: HostRequirement[] = [
  {
    id: 'msix',
    item: 'MSI-X interrupt vectors',
    what:
      'The driver asks for one vector plus one per online CPU, capped by what the device advertises. Vector 0 is the admin queue. Completion event queues start at vector 1, and the number of event queues is clamped to the vectors actually granted.',
    fails: 'Fewer vectors means fewer completion event queues. The device still works, the interrupt-driven paths just get narrower.',
  },
  {
    id: 'hugepages',
    item: 'Huge pages',
    what:
      'AWS states that EC2 instances with the EFA driver installed pre-allocate 5128 huge pages of 2 MiB each. On Kubernetes they are a schedulable resource a pod must request. Bottlerocket does not pre-allocate them.',
    fails: 'Pods that do not request hugepages-2Mi can be admitted and then fail at libfabric init. Fork-heavy Python data loaders can exhaust the pool.',
  },
  {
    id: 'mr',
    item: 'Memory registration budget',
    what:
      'Registration counts and sizes are device-reported, not constants. The driver copies max_mr, max_pd, max_ah and page_size_cap out of the admin-queue device attributes, and computes max_mr_size as max_mr_pages multiplied by the host page size.',
    fails: 'Registration fails with a not-supported error when no page size in page_size_cap fits the region being registered.',
  },
];

export function EfaDevice() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="I have an instance with EFA. What exactly did I attach, how many of them are there, and what does the host owe the device?"
          >
            The EFA Device: Attachment Modes, Network Cards and Rails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> four different numbers get called the same thing. Network
            cards, network interfaces, EFA (Elastic Fabric Adapter) devices and rails are counted
            differently, and a p5.48xlarge reports 32, 33, 32 and something else depending on which
            one you mean. <strong>The answer:</strong> they are separate layers with separate
            owners. EC2 owns the card count, you own the interface count, libfabric sees the device
            count, and the collectives plugin invents the rail index on top of all three.
          </Box>
          <Box variant="p">
            AWS states the top of that stack plainly: an EFA device attaches to an EC2 instance in
            two ways, using a traditional EFA interface, also called EFA with ENA (Elastic Network
            Adapter), which creates both an EFA device and an ENA device, or using an EFA-only
            interface, which creates just the EFA device{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="EFA-only removes the ENA device. That is the whole difference, and it decides everything else."
          >
            Choosing between EFA-only and EFA with ENA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <AttachmentModesDiagram />

          <Box variant="p">
            The EFA device does not have an IP address because it does not use IP. AWS gives the
            reason in the announcement that introduced EFA-only interfaces: the EFA device is not
            assigned an IP address because it uses the Scalable Reliable Datagram (SRD) protocol,
            which operates over MAC addresses, and EFA-only interfaces can only be configured as a
            secondary interface, with the primary interface being either EFA coupled with ENA or
            just ENA, since ENA is required for TCP/IP VPC (Virtual Private Cloud) routing{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                Pick EFA with ENA <Badge color="blue">default</Badge>
              </Box>
              <Box variant="p">
                You need the interface to do both jobs: carry SSH, control plane traffic, scheduler
                heartbeats and dataset reads over IP, and carry collectives over the EFA device.
                This is the only option for the primary interface, so every instance has at least
                one interface that is either plain ENA or EFA with ENA{' '}
                <SourceRef provenance="documented" doc={docs.efa} />.
              </Box>
              <Box variant="p">
                It is also the right answer on any single-card instance type. If the instance has
                one network card, the EFA device has to live on the primary interface, and the
                primary interface cannot be EFA-only.
              </Box>
            </div>
            <div>
              <Box variant="h3">Pick EFA-only for secondary cards</Box>
              <Box variant="p">
                Two reasons, both practical. The first is address pressure: an EFA-only interface
                takes no IPv4 or IPv6 address{' '}
                <SourceRef provenance="documented" doc={docs.efa} />, so a 32-card instance costs
                one private address instead of 32. On a large cluster in a fixed subnet that is the
                difference between fitting and not fitting.
              </Box>
              <Box variant="p">
                The second is the guest operating system. AWS names the failure modes it avoids:
                disallowed auto-assignment of public IP addresses, and IP routing challenges such as
                hostname to IP address mapping issues and source IP address mismatches, that can
                arise if an instance has multiple network interfaces{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. A host with 32 routable
                interfaces is a host with 32 chances for the wrong source address.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Both flavours still consume an ENI attachment slot">
            EFA-only interfaces count towards the ENI (Elastic Network Interface) attachment limit
            for the instance, exactly like ENA and EFA with ENA interfaces do{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. Dropping the ENA device saves IP
            addresses and guest routing complexity. It does not save attachment slots.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="32, 33, 32 and something that is not a count at all. Four numbers, four owners, worked on p5.48xlarge."
          >
            Network cards, EFA interfaces and rails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CardsInterfacesRailsDiagram />

          <Box variant="p">
            Start with what AWS states. The p5.48xlarge and p5e.48xlarge instances support 32
            network cards and have a total network bandwidth capacity of 3,200 Gbps, of which up to
            800 Gbps can be utilized for IP network traffic{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />. The rule that ties cards to
            interfaces is also stated: instance types that support multiple network cards can be
            configured with one EFA per network card, and all other supported instance types
            support only one EFA per instance{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>

          <Box variant="p">
            Now read the AWS launch example carefully, because it is where the naive arithmetic
            breaks. AWS introduces it as a request with 32 EFA devices and one ENA device, and the
            command attaches 33 interfaces across 32 cards: an ENA interface on network card index
            0 device index 0, an EFA-only interface on network card index 0 device index 1, and one
            EFA-only interface on each of network card index 1 through 31{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />. Card 0 carries two interfaces
            at different device indexes. That is how 32 cards and 33 interfaces produce 32 EFA
            devices, with somewhere left to put the IP stack. Count the interfaces instead of the
            devices and you ask a Kubernetes resource claim for 33 of something the instance has 32
            of.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The four counts, and who decides each one</Header>}
            columnDefinitions={[
              { id: 'term', header: 'Term', cell: (item) => <strong>{item.term}</strong> },
              { id: 'owner', header: 'Decided by', cell: (item) => item.owner },
              { id: 'p5', header: 'p5.48xlarge', cell: (item) => item.p5 },
              { id: 'how', header: 'How you read it', cell: (item) => item.how },
            ]}
            items={countRows}
          />

          <ExpandableSection
            headerText="What a rail actually is, read from the plugin source"
            headerDescription="No AWS document defines the term. The contract is written down in aws-ofi-nccl"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The aws-ofi-nccl platform interface states the contract in its own doc comment:
                implementations should sort the provided info list such that the Nth provider on
                this node will be assumed to talk to the Nth provider on remote nodes, that is,
                identify the rail id and sort by that. The same comment says the list will have
                num_rails providers and will later be split into num_groups groups based on the
                number of accelerators that are also behind the PCIe (Peripheral Component
                Interconnect Express) switch{' '}
                <SourceRef provenance="code-derived" code={code.railContract} />.
              </Box>
              <Box variant="p">
                So a rail is an ordinal agreed between nodes, not a piece of hardware. Two EFA
                devices are on the same rail when they hold the same index in their respective
                sorted lists. Every node has to compute the same order or the pairing collapses,
                which is exactly why the sort exists.
              </Box>
              <Box variant="p">
                The AWS implementation explains why the natural order is not good enough. Its
                comment reads: on P5 and P5e there are up to 32 EFA devices, each pair of EFA
                devices shares some Nitro card resources, and there is a marginal performance gain
                if the 0th device in the pair only talks to 0th devices in the remote and so on. It
                then says the hypervisor is not consistent in mapping bus, device and function
                numbers between the two devices that share resources, so the code reorders the
                provider list to make that pairing happen{' '}
                <SourceRef provenance="code-derived" code={code.sortRails} />.
              </Box>
              <Box variant="p">
                The same function short-circuits when there is at most one device per group, with
                the comment that on P4d or Trainium the topology ordering is assumed sufficient{' '}
                <SourceRef provenance="code-derived" code={code.sortRails} />. Rail sorting is a
                many-devices-per-accelerator problem. On instance types with one EFA device per
                accelerator it does nothing.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert
            type="warning"
            header="AWS documents four EFA devices sharing a PCIe root with one GPU. The eight groups of four are arithmetic, not documentation."
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states a local ratio and nothing more: for example, on p5.48xlarge instances
                there are four EFA devices that share the same PCIe root with one GPU{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />. That sentence exists to
                justify allocationMode All in a Kubernetes resource claim, so that you can ask for
                the aligned group without knowing its size.
              </Box>
              <Box variant="p">
                Multiply that ratio by the 8 GPUs on the instance and you get eight groups of one
                GPU plus four EFA devices, totalling 32. That multiplication is ours. It is
                consistent with the documented 32-device count and it is very likely correct, but no
                AWS source enumerates the groups, so treat the grouping as inferred{' '}
                <SourceRef
                  provenance="code-derived"
                  doc={docs.eksDevice}
                  code={code.railContract}
                  label="inference"
                />
                . If your placement decision depends on the exact grouping, read it off the running
                instance from the PCIe topology rather than from this page.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="P6-B300: 17 network cards, 16 of them EFA-capable"
            headerDescription="The headline card count includes one card that cannot carry EFA at all"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS states it directly: P6-B300 instances have a total network bandwidth capacity of
                up to 6400 Gbps for EFA traffic and up to 3870 Gbps for ENA traffic, they have 8
                GPUs and 17 network cards, where the primary network card supports only an ENA
                network interface with up to 350 Gbps of bandwidth, and the secondary network cards
                support up to 400 Gbps EFA and up to 220 Gbps of ENA bandwidth{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />.
              </Box>
              <Box variant="p">
                Network card index 0 is ENA-only. The EFA-capable count is 16, and 16 times 400 Gbps
                is exactly the 6,400 Gbps headline. Quoting 17 EFA interfaces both overstates the
                fabric by one card and makes the bandwidth arithmetic stop working, which is the
                fastest way to spot the error in someone else's sizing sheet.
              </Box>
              <Box variant="p">
                One more caution on the same page: since EFA and ENA traffic share the same
                underlying resources, bandwidth used by one will reduce the bandwidth that is
                available to the other{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. The 6,400 and 3,870 Gbps
                figures are not additive.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Interrupt vectors, huge pages and registration limits are negotiated per instance, not compiled in. Read them off the instance you have."
          >
            What the host owes the device
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'item', header: 'Resource', cell: (item) => <strong>{item.item}</strong> },
              { id: 'what', header: 'What actually happens', cell: (item) => item.what },
              { id: 'fails', header: 'How it shows up when it is short', cell: (item) => item.fails },
            ]}
            items={hostRequirements}
          />

          <Box variant="h3">MSI-X vectors</Box>
          <Box variant="p">
            The driver reserves the maximum vectors it might need, one of which is reserved for
            admin: it asks for the smaller of the device advertised vector count and the number of
            online CPUs plus one, then allocates them as MSI-X (Message Signaled Interrupts
            Extended){' '}
            <SourceRef provenance="code-derived" code={code.msix} />. The split is fixed in a
            header: the management vector index is 0 and the completion event queue vector base is 1{' '}
            <SourceRef provenance="code-derived" code={code.vectorIdx} />. The number of event
            queues the driver creates is then clamped to the vectors it actually received, minus the
            one spent on admin{' '}
            <SourceRef provenance="code-derived" code={code.eqClamp} />.
          </Box>
          <Box variant="p">
            AWS documents none of this. It matters because it is the one place where host CPU count
            feeds back into EFA resources, and because completion counters on the newer software
            path are described by libfabric as backed by MSI-X hardware counters on the EFA device.
          </Box>

          <Box variant="h3">Huge pages</Box>
          <Box variant="p">
            AWS states that Amazon EC2 instances with the EFA driver installed pre-allocate 5128
            huge pages of 2 MiB each, which you can request as resources to consume in your job
            specifications{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />. That number is worth holding
            on to, because AWS's own p5 manifests request 5120Mi of hugepages-2Mi, which is 2,560
            pages, roughly half of what was pre-allocated. The requested figure and the
            pre-allocated figure are not the same quantity and are easy to confuse.
          </Box>
          <Alert type="info" header="Huge pages are also a libfabric setting, and the two interact">
            The EFA provider uses huge page memory for its own internal buffers by default, and
            turns that off when fork safety is requested. The reader-facing consequence is in the
            libfabric section of this dive: setting FI_EFA_USE_HUGE_PAGE and FI_EFA_FORK_SAFE at the
            same time is an abort, not a warning.
          </Alert>

          <Box variant="h3">Memory registration limits</Box>
          <Box variant="p">
            Every buffer the device touches has to be registered first. The limits on that are
            reported by the device over the admin queue rather than compiled in. The driver's query
            path copies max_mr, max_pd and max_ah straight out of the device attributes, takes
            page_size_cap as reported, and computes the maximum registration size as max_mr_pages
            multiplied by the host page size{' '}
            <SourceRef provenance="code-derived" code={code.queryDevice} />. Read them with
            ibv_devinfo on the instance you actually have rather than assuming a constant.
          </Box>
          <Box variant="p">
            Registration itself picks the largest page size the device advertises that fits the
            region, and fails with a not-supported error when nothing in page_size_cap fits{' '}
            <SourceRef provenance="code-derived" code={code.registerMr} />. Small registrations get
            a fast path: if the page list fits in the four-entry inline array carried in the admin
            command, the driver sends it inline instead of building an indirect page list{' '}
            <SourceRef provenance="code-derived" code={code.inlinePbl} />.
          </Box>
          <Box variant="p">
            Reading those two together suggests why larger pages help registration cost, since a
            larger page size means fewer entries in the page list for the same buffer. AWS does not
            state that as the reason huge pages are pre-allocated, so treat the causal link as our
            reading of the code and not as a documented rationale.
          </Box>
          <Box variant="p">
            Driver r3.3.0 moved this ceiling: its release notes list adding driver support for
            memory region page sizes above 4 GB{' '}
            <SourceRef provenance="code-derived" code={code.releaseNotes} />. Whether you have that
            depends on which driver you installed, which is the next section.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="There is no single current EFA driver version. There are two channels and they are two releases apart."
          >
            Driver and installer versions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                What you get from the installer <Badge color="green">shipping</Badge>
              </Box>
              <Box variant="p">
                EFA installer 1.49.0, released June 27, 2026, upgrades to libfabric 2.4.0amzn5.0,
                EFA driver 3.1.0, rdma-core 63.0 and AWS OFI NCCL Plugin 1.20.0, and discontinues
                support for openSUSE Leap{' '}
                <SourceRef provenance="documented" doc={docs.changelog} />. This is what
                efa_installer.sh puts on a host today.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                What is in the repository <Badge color="grey">unreleased</Badge>
              </Box>
              <Box variant="p">
                The amzn-drivers tree carries driver r3.3.0, with the package version recorded in
                the DKMS (Dynamic Kernel Module Support) configuration{' '}
                <SourceRef provenance="code-derived" code={code.dkms} />. Its release notes add the
                0xefa4 device id, support for reporting 800 and 1600 Gbps link speed, completion
                counters, 64-bit work request ids, 128-byte send queue work queue entries, inline
                RDMA (Remote Direct Memory Access) write and memory region page sizes above 4 GB{' '}
                <SourceRef provenance="code-derived" code={code.releaseNotes} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="The current EFA driver version has two different right answers">
            <SpaceBetween size="xs">
              <Box variant="p">
                Installer 1.49.0 ships driver 3.1.0. The repository is at r3.3.0. Those are two
                different answers to the same question, and the gap is not cosmetic: the 0xefa4
                device id landed in r3.3.0, so a host installed from 1.49.0 does not carry it.
              </Box>
              <Box variant="p">
                The same rule applies to the userspace half. Installer 1.49.0 ships libfabric
                2.4.0amzn5.0, which is an AWS fork with backports, while upstream ofiwg has released
                v2.6.0. The version strings are not comparable across the two channels. Name the
                channel before you quote a version.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="p">
            The practical check on a running host is the installer's own verification path rather
            than a version table. The driver version in the repository is recorded in the DKMS
            configuration, and the installed release is what the changelog describes, so comparing
            what modinfo reports on the instance against the installer changelog entry is the only
            reliable way to tell which of the two you are on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four documented generations, five PCI device ids. They do not line up, so the mapping you have seen quoted cannot be right."
          >
            Which generation you are on, and what branches on it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The generation labels come from the EC2 User Guide, which organises its supported
            instance types under four table headings, read here verbatim: Nitro v6 (EFA v4), Nitro
            v5 (EFA v3), Nitro v4 (EFA v2) and Nitro v3 (EFA v1){' '}
            <SourceRef provenance="documented" doc={docs.efa} />. That is the mapping. It is a
            heading you read, not a pairing you derive, and the instance table elsewhere in this
            dive is keyed to it.
          </Box>

          <Alert type="warning" header="Five PCI device ids against four EFA versions: the mapping you have seen quoted does not exist">
            <SpaceBetween size="xs">
              <Box variant="p">
                The driver defines five PCI device ids, 0xefa0 through 0xefa4, and registers all
                five in its PCI device table{' '}
                <SourceRef provenance="code-derived" code={code.pciIds} />. AWS documents four EFA
                versions. Five ids against four versions cannot be a one to one mapping, and no AWS
                source and no line of driver source maps a device id to an EFA version number at
                all.
              </Box>
              <Box variant="p">
                So the widely repeated equivalence between 0xefa4 and EFA v4 is unsourced inference.
                What you can say is narrower and still useful: 0xefa4 was added in driver r3.3.0
                alongside 800 and 1600 Gbps link-speed reporting{' '}
                <SourceRef provenance="code-derived" code={code.releaseNotes} />, and r3.3.0 is not
                in the shipping installer.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="p">
            Device ids are still a real runtime discriminator, just not a generation label. Two
            independent code paths branch on them. libfabric turns off its direct data path on
            0xefa0 parts, using a helper whose entire body compares the vendor part id against
            0xefa0{' '}
            <SourceRef provenance="code-derived" code={code.subCq} />. The NCCL plugin computes
            device identifiers differently for 0xefa0, 0xefa1 and 0xefa2 than for newer parts,
            falling back to a node id and device index instead of the per-card PCI domain and bus{' '}
            <SourceRef provenance="code-derived" code={code.guidByDeviceId} />.
          </Box>
          <Box variant="p">
            Both of those group the first three ids together and treat later ones as one newer
            class. Neither draws a four-way generation boundary. If you need to know which EFA
            generation an instance is, read the User Guide table heading for its instance type. If
            you need to know how the software will behave on it, read the device id.
          </Box>

          <ExpandableSection
            headerText="Where the generation actually changes behaviour"
            headerDescription="Two concrete branches, both code-derived"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                First: libfabric's Data Path Direct feature, which moves work queue entry
                construction and completion parsing into libfabric itself, is disabled on 0xefa0
                devices because those parts use a sub completion queue implementation{' '}
                <SourceRef provenance="code-derived" code={code.subCq} />. The oldest EFA hardware
                therefore does not get the newest fast path, regardless of which libfabric you
                install.
              </Box>
              <Box variant="p">
                Second: the NCCL plugin's device identifier is what lets it recognise that two EFA
                devices sit on the same physical card. On 0xefa0, 0xefa1 and 0xefa2 it cannot use
                the per-card PCI domain and bus fields and falls back to a plain node and device
                index{' '}
                <SourceRef provenance="code-derived" code={code.guidByDeviceId} />. That is the same
                information rail sorting depends on, which is consistent with rail sorting being a
                P5-era concern.
              </Box>
              <Box variant="p">
                Neither of these is documented by AWS. Both are visible in one grep of the pinned
                sources, and both are the kind of thing that explains a performance difference
                between two instance families that otherwise look identical on paper.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
      <Container
        header={
          <Header
            variant="h2"
            description="One security group rule, one hard placement constraint, and one recommendation that is often misquoted as a requirement."
          >
            Security group, subnets and placement
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">The self-referencing security group rule</Box>
          <Box variant="p">
            AWS states the requirement in one sentence: an EFA requires a security group that allows
            all inbound and outbound traffic to and from the security group itself{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />. Not a port range. Not a
            protocol. All traffic, in both directions, with the group as both the target and the
            source.
          </Box>
          <Box variant="p">
            The reason follows from the device. EFA traffic is not IP traffic, so there are no TCP
            or UDP port numbers to write a narrower rule against, and the EFA device is not assigned
            an IP address at all because SRD operates over MAC addresses{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />. A rule scoped to a CIDR
            range and a port is not expressible for this traffic. Self-referencing the group is the
            only shape that matches what the device sends, and it is why this is the single most
            common reason a freshly built cluster hangs at the first collective instead of failing
            at launch.
          </Box>
          <Alert type="info" header="Scope the group, not the rule">
            Since the rule cannot be narrowed, the security boundary is membership. Put only the
            cluster's instances in that security group, and put SSH and any other administrative
            access in a separate group attached alongside. AWS's own walkthrough does exactly that
            and labels its combined example as intended for testing purposes only{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Alert>

          <Box variant="h3">Subnets and Availability Zones</Box>
          <Box variant="p">
            The documented boundary list is short. EFA traffic cannot cross Availability Zones or
            VPCs, EFA traffic is not routable, and EFA is not supported on AWS Outposts{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. The same page adds a distinction
            worth keeping: those limits apply to traffic through the EFA device, and do not apply to
            normal IP traffic from the ENA device of an EFA interface{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>
          <Box variant="p">
            Notice what is absent. No subnet restriction appears anywhere in that list, and AWS's
            own multi-card launch examples pass a SubnetId on every interface without requiring them
            to match{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />. Reading those two together, an
            EFA cluster spread across several subnets inside one Availability Zone is not prohibited
            by anything AWS publishes. That is an argument from the absence of a stated limit rather
            than a positive AWS statement, so treat it as our reading, and keep the Availability
            Zone boundary as the hard line.
          </Box>

          <Box variant="p">
            Two more documented placement limits that bite specific fleets: EFA traffic between P4d,
            P4de or DL1 instances and other instance types is not supported, and c7g.16xlarge,
            m7g.16xlarge and r7g.16xlarge Dedicated Instances and Dedicated Hosts are not supported
            when an EFA is attached <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>

          <Alert type="warning" header="A cluster placement group is recommended, not required">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS writes it verbatim: it is not an absolute requirement to launch your EFA-enabled
                instances into a cluster placement group. However, we do recommend running your
                EFA-enabled instances in a cluster placement group as it launches the instances into
                a low-latency group in a single Availability Zone{' '}
                <SourceRef provenance="documented" doc={docs.efaStart} />.
              </Box>
              <Box variant="p">
                The hard constraint is the Availability Zone. The placement group is the documented
                way to satisfy that constraint and to keep latency low, not a gate on EFA itself.
                Any page that says EFA requires a cluster placement group is stating a
                recommendation as a rule.
              </Box>
              <Box variant="p">
                The practical follow-on is capacity. AWS's answer for that is on the same page: to
                ensure that capacity is available as you scale your cluster's instances, you can
                create a Capacity Reservation for your cluster placement group{' '}
                <SourceRef provenance="documented" doc={docs.efaStart} />.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
