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

/**
 * amzn/amzn-drivers at the commit the efa_linux_3.3.0 release tag points to:
 * driver r3.3.0. Verified against the tag rather than described as a branch
 * head, so the pin stays true after master advances.
 */
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
  queryDevice: drv('src/efa_verbs.c', 'L350-L359'),
  registerMr: drv('src/efa_verbs.c', 'L2628-L2636'),
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
 * Diagram 2. The counting model: four layers, four owners, one count each.
 * This carries the spine of the section, so it holds the owner, the worked
 * p5.48xlarge count and the read-it-yourself command for every layer. It
 * replaces the prose-plus-table pairing that used to say the same thing twice.
 * Idiom A (class-name prefix "cr-").
 */
function CountingLayersDiagram() {
  const layers = [
    {
      label: 'Network cards',
      owner: ['Owned by EC2.', 'Fixed by the instance type.'],
      count: '32',
      unit: 'p5.48xlarge',
      lines: [
        'Read it: MaximumNetworkCards in DescribeInstanceTypes.',
        'It is the slot count, and it bounds every layer below.',
      ],
      relation: 'bounds',
    },
    {
      label: 'Network interfaces',
      owner: ['Owned by you.', 'Decided in the launch request.'],
      count: '33',
      unit: 'AWS example',
      lines: [
        'Read it: the --network-interfaces list you pass to run-instances.',
        'Card 0 can carry two, which is how 32 cards took 33 interfaces.',
      ],
      relation: 'materialise',
    },
    {
      label: 'EFA devices',
      owner: ['Follows from the EFA', 'interfaces you attached.'],
      count: '32',
      unit: 'EFA devices',
      lines: [
        'Read it: fi_info entries, one per device per fabric.',
        'Size a Kubernetes resource claim from this layer, not the one above.',
      ],
      relation: 'grouped into',
    },
    {
      label: 'Rails',
      owner: ['Owned by the collectives', 'plugin, invented at runtime.'],
      count: 'index',
      unit: 'per group',
      lines: [
        'Read it: nowhere. No AWS API exposes it. It is plugin internal.',
        'The plugin sorts devices so index N here pairs with index N remotely.',
      ],
      relation: null,
    },
  ];

  return (
    <svg
      viewBox="0 0 900 490"
      role="img"
      aria-labelledby="efa-counting-layers-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-counting-layers-title">
        Counting EFA is four layers with four owners, and each layer is counted by a different
        party. EC2 fixes the network card count and it bounds everything below, read from
        MaximumNetworkCards. You decide the network interface count in the launch request, read
        from the network-interfaces list you pass to run-instances. The EFA device count follows
        from the EFA interfaces you attached and is what libfabric lists in fi_info, which is the
        layer a Kubernetes resource claim is sized from. Rails are an index the collectives plugin
        invents on top of the devices, exposed by no AWS API. On p5.48xlarge those counts are 32
        cards, 33 interfaces in the AWS example, 32 EFA devices, and a per-group rail index.
      </title>
      <style>
        {`
          .cr-lbl { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .cr-body { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .cr-cnt { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .cr-hd { fill: #5f6b7a; font: 600 11px sans-serif; }
          .cr-hdc { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
          .cr-lt { fill: #0f1b2a; font: 600 13px sans-serif; }
          .cr-ls { fill: #5f6b7a; font: 11px sans-serif; }
          .cr-num { fill: #0972d3; font: 600 22px sans-serif; text-anchor: middle; }
          .cr-unit { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .cr-txt { fill: #0f1b2a; font: 11px sans-serif; }
          .cr-rel { fill: #5f6b7a; font: italic 10px sans-serif; }
          .cr-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#cr-head); }
          .cr-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="cr-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="490" rx="8" fill="#ffffff" />

      <text className="cr-hd" x="46" y="34">
        Layer, and who owns the count
      </text>
      <text className="cr-hdc" x="342" y="34">
        p5.48xlarge
      </text>
      <text className="cr-hd" x="420" y="34">
        How you read it on any instance, and what to do with it
      </text>

      {layers.map((layer, index) => {
        const y = 48 + index * 102;
        return (
          <g key={layer.label}>
            <rect className="cr-lbl" x="30" y={y} width="250" height="76" rx="6" />
            <text className="cr-lt" x="46" y={y + 26}>
              {layer.label}
            </text>
            {layer.owner.map((ownerLine, ownerIndex) => (
              <text className="cr-ls" key={ownerLine} x="46" y={y + 46 + ownerIndex * 16}>
                {ownerLine}
              </text>
            ))}

            <rect className="cr-cnt" x="292" y={y} width="100" height="76" rx="6" />
            <text className="cr-num" x="342" y={y + 38}>
              {layer.count}
            </text>
            <text className="cr-unit" x="342" y={y + 58}>
              {layer.unit}
            </text>

            <rect className="cr-body" x="404" y={y} width="466" height="76" rx="6" />
            {layer.lines.map((line, lineIndex) => (
              <text className="cr-txt" key={line} x="420" y={y + 30 + lineIndex * 22}>
                {line}
              </text>
            ))}

            {layer.relation && (
              <>
                <path className="cr-arr" d={`M155,${y + 76} L155,${y + 96}`} />
                <text className="cr-rel" x="166" y={y + 92}>
                  {layer.relation}
                </text>
              </>
            )}
          </g>
        );
      })}

      <text className="cr-cap" x="450" y="472">
        Counts for p5.48xlarge. Rail behaviour is read from the aws-ofi-nccl plugin source, not from
        AWS documentation.
      </text>
    </svg>
  );
}

interface HostRequirement {
  id: string;
  item: string;
  what: string;
  fails: string;
}

const hostRequirements: HostRequirement[] = [
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
      'The device reports its own registration counts and sizes. The driver copies max_mr, max_pd, max_ah and page_size_cap out of the admin-queue device attributes, and computes max_mr_size as max_mr_pages multiplied by the host page size.',
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
            Four different numbers get called the same thing. Network cards, network interfaces,
            EFA (Elastic Fabric Adapter) devices and rails are counted differently, and a
            p5.48xlarge reports 32, 33, 32 and something else depending on which one you mean.{' '}
            <strong>What sorts them out:</strong> they are separate layers with separate owners.
            EC2 owns the card count, you own the interface count, libfabric sees the device count,
            and the collectives plugin invents the rail index on top of all three.
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
            description="What each attachment mode creates inside the instance, and which one to pass at launch"
          >
            Choosing between EFA-only and EFA with ENA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An attachment mode is the <code>InterfaceType</code> you pass to EC2 when you create a
            network interface, and it decides which device nodes appear inside the instance. The
            three values that matter here are <code>interface</code>, <code>efa</code> and{' '}
            <code>efa-only</code>. IP addressing, eligibility to be the primary interface, and
            access to the OS-bypass transport all turn on that one choice.
          </Box>

          <AttachmentModesDiagram />

          <Box variant="p">
            The EFA device is addressed at the MAC layer, which is why it holds no IP address. AWS
            gives the reason in the announcement that introduced EFA-only interfaces: the EFA
            device is not
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
            description="Four layers, four owners, one count each. Hold the layering and you can work out the counts on an instance type this page never mentions."
          >
            Network cards, EFA interfaces and rails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The 32, 33, 32 result on p5.48xlarge is worth less than the reason for it. Each count
            belongs to a different layer, and each layer has a different owner deciding it. Work
            down the layers in order and every instance type falls out the same way: ask EC2 for the
            card count, ask your own launch request for the interface count, ask libfabric for the
            device count, and accept that the rail index belongs to software that no AWS API
            reports.
          </Box>

          <CountingLayersDiagram />

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
            Now read the AWS launch example, where the naive arithmetic
            breaks. AWS introduces it as a request with 32 EFA devices and one ENA device, and the
            command attaches 33 interfaces across 32 cards: an ENA interface on network card index
            0 device index 0, an EFA-only interface on network card index 0 device index 1, and one
            EFA-only interface on each of network card index 1 through 31{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />. Card 0 carries two interfaces
            at different device indexes. That is how 32 cards and 33 interfaces produce 32 EFA
            devices, with somewhere left to put the IP stack. Size a Kubernetes resource claim from
            the device count, which is 32 here. A claim written from the interface count asks for
            33 of something the instance has 32 of.
          </Box>

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
                So a rail is an ordinal agreed between nodes. Two EFA
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
            header="AWS documents four EFA devices sharing a PCIe root with one GPU. The eight groups of four are our arithmetic."
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
                GPU plus four EFA devices, totalling 32. That multiplication is ours, and it carries
                no citation because there is nothing to cite: the two inputs are the documented 4:1
                ratio above and the documented 32-device count, and no AWS source enumerates the
                groups. It is consistent with both and very likely correct, but treat the grouping
                as inferred. If your placement decision depends on the exact grouping, read it off
                the running instance from the PCIe topology rather than from this page.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="Run the layers down a second instance type: P6-B300"
            headerDescription="17 cards, 16 EFA devices. The layering gives the answer, and the bandwidth arithmetic checks it."
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
                Network card index 0 is ENA-only. Size the fabric from the 16 EFA-capable cards and
                the headline arithmetic works: 16 times 400 Gbps is exactly the 6,400 Gbps figure.
                A sizing sheet quoting 17 EFA interfaces overstates the fabric by one card and
                breaks that multiplication, which is the fastest way to spot the error.
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
            description="Huge pages and registration limits are settled per instance, not by the instance type. Read both off the instance you have, because both fail late."
          >
            What the host owes the device
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The device draws two things from the host it attaches to: huge pages and a memory
            registration budget. Both are settled at attach time from what the device advertises and
            what the instance has, so the working numbers belong to the instance in front of you.
          </Box>

          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'item', header: 'Resource', cell: (item) => <strong>{item.item}</strong> },
              { id: 'what', header: 'What actually happens', cell: (item) => item.what },
              { id: 'fails', header: 'How it shows up when it is short', cell: (item) => item.fails },
            ]}
            items={hostRequirements}
          />

          <Box variant="h3">Huge pages</Box>
          <Box variant="p">
            AWS states that Amazon EC2 instances with the EFA driver installed pre-allocate 5128
            huge pages of 2 MiB each, which you can request as resources to consume in your job
            specifications{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />. That number is worth holding
            on to, because AWS's own p5 manifests on the same page request 5120Mi of hugepages-2Mi{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />, which is 2,560 pages, roughly
            half of what was pre-allocated. The two figures are easy to confuse.
          </Box>
          <Alert type="info" header="Huge pages are also a libfabric setting, and the two interact">
            The EFA provider uses huge page memory for its own internal buffers by default, and
            turns that off when fork safety is requested. The reader-facing consequence is in the
            libfabric section of this dive: setting FI_EFA_USE_HUGE_PAGE and FI_EFA_FORK_SAFE at the
            same time is an abort, not a warning.
          </Alert>

          <Box variant="h3">Memory registration limits</Box>
          <Box variant="p">
            Every buffer the device touches has to be registered first. The limits on that come
            from the device over the admin queue. The driver's query
            path copies max_mr, max_pd and max_ah straight out of the device attributes, takes
            page_size_cap as reported, and computes the maximum registration size as max_mr_pages
            multiplied by the host page size{' '}
            <SourceRef provenance="code-derived" code={code.queryDevice} />. Read them with
            ibv_devinfo on the instance you actually have.
          </Box>
          <Box variant="p">
            Registration itself picks the largest page size the device advertises that fits the
            region, and fails with a not-supported error when nothing in page_size_cap fits{' '}
            <SourceRef provenance="code-derived" code={code.registerMr} />. That is what ties this
            resource back to huge pages: a larger page size means fewer entries in the page list for
            the same buffer, so registration costs less. AWS does not state that as the reason huge
            pages are pre-allocated, so treat the causal link as our reading of the code.
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
            description="Two channels ship EFA software, two releases apart. Which one you installed decides which features you have."
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
            Installer 1.49.0 ships driver 3.1.0. The repository is at r3.3.0. Those are two
            different answers to the same question, and the gap is not cosmetic: the 0xefa4 device
            id landed in r3.3.0, so a host installed from 1.49.0 does not carry it. Name the channel
            before you quote a version. The userspace half skews the same way and by a wider margin,
            2.4.0amzn5.0 from the installer against upstream v2.6.0, which the libfabric section of
            this dive works through in full.
          </Alert>

          <Box variant="p">
            On a running host, compare what modinfo reports against the installer changelog entry.
            The repository version lives in the DKMS configuration and the installed release is
            what the changelog describes, so that comparison is what tells you which of the two you
            are on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four documented generations, five PCI device ids. Read the generation from the User Guide, and the behaviour from the device id."
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

          <Alert type="warning" header="Five PCI device ids against four EFA versions, and no AWS source maps one to the other">
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

          <Box variant="h3">Where the generation actually changes behaviour</Box>
          <Box variant="p">
            Device ids are a real runtime discriminator, and two independent code paths branch on
            them. First: libfabric's Data Path Direct feature, which moves work queue entry
            construction and completion parsing into libfabric itself, is disabled on 0xefa0 devices
            because those parts use a sub completion queue implementation{' '}
            <SourceRef provenance="code-derived" code={code.subCq} />. The oldest EFA hardware does
            not get the newest fast path, regardless of which libfabric you install.
          </Box>
          <Box variant="p">
            Second: the NCCL plugin's device identifier is what lets it recognise that two EFA
            devices sit on the same physical card. On 0xefa0, 0xefa1 and 0xefa2 it cannot use the
            per-card PCI domain and bus fields and falls back to a plain node and device index{' '}
            <SourceRef provenance="code-derived" code={code.guidByDeviceId} />. That is the same
            information rail sorting depends on, which is consistent with rail sorting being a
            P5-era concern.
          </Box>
          <Box variant="p">
            AWS documents neither branch, and both explain a performance difference between two
            instance families that otherwise look identical on paper. Both draw the same line: the
            first three ids on one side, everything later on the other. That is a two-way split in
            the software against a four-way split in the User Guide headings, which is why the two
            questions take two different sources. If you need to know which EFA generation an
            instance is, read the User Guide table heading for its instance type. If you need to
            know how the software will behave on it, read the device id.
          </Box>
        </SpaceBetween>
      </Container>
      <Container
        header={
          <Header
            variant="h2"
            description="One security group rule, one hard placement constraint, and one recommendation. Telling them apart decides how you build the cluster."
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
            <SourceRef provenance="documented" doc={docs.efaStart} />. All traffic, in both
            directions, with the group as both the target and the source.
          </Box>
          <Box variant="p">
            The reason follows from the device. EFA traffic is not IP traffic, so there are no TCP
            or UDP port numbers to write a narrower rule against, and the EFA device is not assigned
            an IP address at all because SRD operates over MAC addresses{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />. A rule scoped to a CIDR
            range and a port is not expressible for this traffic. Self-referencing the group is the
            only shape that matches what the device sends. A missing self-reference is the single
            most common reason a freshly built cluster launches cleanly and then hangs at the first
            collective.
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
