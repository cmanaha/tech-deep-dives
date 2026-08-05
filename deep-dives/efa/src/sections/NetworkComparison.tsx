import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * EFA vs Alternatives.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing cell in the table carries a SourceRef, or it carries no number.
 *
 * Figures held out on purpose, so a later pass does not put them back:
 * per-column microsecond latencies (no citable source for these four
 * transports), "P99.9" and an "85% reduction" (wrong percentile, magnitude no
 * source gives), per-port InfiniBand rates and sub-microsecond fabric
 * latencies (no first-party page stating them was located), and an ENA Express
 * figure in the EFA single-flow cell (EFA has no 5-tuple flow to cap).
 * RDMA write support starts at Nitro v4.
 */

const ACCESSED = '2026-08-02';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';

const docs: Record<string, DocRef> = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: `${EC2_DOC}efa.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  efaAcc: {
    title: 'EC2 User Guide: Maximize network bandwidth on instances with multiple network cards',
    url: `${EC2_DOC}efa-acc-inst-types.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  bandwidth: {
    title: 'EC2 User Guide: Amazon EC2 instance network bandwidth',
    url: `${EC2_DOC}ec2-instance-network-bandwidth.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  enaExpress: {
    title: 'EC2 User Guide: Improve network performance with ENA Express',
    url: `${EC2_DOC}ena-express.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  hpcLens: {
    title: 'AWS Well-Architected HPC Lens: Data protection',
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/high-performance-computing-lens/data-protection.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hpcBlog: {
    title:
      'AWS HPC Blog: In the search for performance, there is more than one way to build a network',
    url: 'https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/',
    tier: 2,
    accessed: ACCESSED,
  },
  nvlink: {
    title: 'NVIDIA NVLink and NVLink Switch',
    url: 'https://www.nvidia.com/en-us/data-center/nvlink/',
    tier: 2,
    accessed: ACCESSED,
  },
  nvidiaIb: {
    title: 'NVIDIA InfiniBand Networking Solutions',
    url: 'https://www.nvidia.com/en-us/networking/products/infiniband/',
    tier: 2,
    accessed: ACCESSED,
  },
};

interface ComparisonRow {
  feature: string;
  efa: React.ReactNode;
  tcp: React.ReactNode;
  rdma: React.ReactNode;
  nvlink: React.ReactNode;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'What it assumes about the network',
    efa: (
      <>
        Loss happens. SRD retransmits selectively{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'Loss happens, and recovery is in order',
    rdma: 'RoCE v2 needs a lossless fabric held up by PFC. InfiniBand is lossless by design',
    nvlink: 'A switch inside the box',
  },
  {
    feature: 'Scope',
    efa: 'Inter-node (across instances)',
    tcp: 'Inter-node',
    rdma: 'Inter-node',
    nvlink: 'Intra-node (within instance)',
  },
  {
    feature: 'OS Bypass',
    efa: (
      <>
        Yes, on the data path <SourceRef provenance="documented" doc={docs.efa} />
      </>
    ),
    tcp: 'No',
    rdma: 'Yes',
    nvlink: 'N/A (direct GPU-GPU)',
  },
  {
    feature: 'Multi-path and congestion',
    efa: (
      <>
        SRD sprays over 64 paths at a time, under its own congestion control{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'ECMP hashed per flow, with CUBIC or BBR tuned for the WAN',
    rdma: (
      <>
        Adaptive routing switch-side, PFC on RoCE, credit-based on InfiniBand{' '}
        <SourceRef provenance="documented" doc={docs.nvidiaIb} />
      </>
    ),
    nvlink: 'N/A',
  },
  {
    feature: 'Tail latency',
    efa: (
      <>
        Dropping in-order delivery cut p99 by around a factor of ten{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'Baseline. Head-of-line blocking on any loss',
    rdma: 'Strong, and PFC pauses can cascade on RoCE',
    nvlink: 'N/A',
  },
  {
    feature: 'Latency',
    efa: (
      <>
        Lower and more consistent than TCP. AWS publishes no per-message figure{' '}
        <SourceRef provenance="documented" doc={docs.efa} />
      </>
    ),
    tcp: 'Baseline. Every message crosses the kernel stack',
    rdma: 'Lowest of the inter-node options. No first-party number cited here',
    nvlink: 'Lowest overall, and intra-node only',
  },
  {
    feature: 'Bandwidth (max)',
    efa: (
      <>
        Up to 6,400 Gbps per instance on P6-B300{' '}
        <SourceRef provenance="documented" doc={docs.efaAcc} />
      </>
    ),
    tcp: (
      <>
        Set by the instance allowance{' '}
        <SourceRef provenance="documented" doc={docs.bandwidth} />
      </>
    ),
    rdma: (
      <>
        Set by the adapter generation{' '}
        <SourceRef provenance="documented" doc={docs.nvidiaIb} />
      </>
    ),
    nvlink: (
      <>
        900 GB/s per GPU (4th gen), 1,800 GB/s (5th gen){' '}
        <SourceRef provenance="documented" doc={docs.nvlink} />
      </>
    ),
  },
  {
    feature: 'Single-flow ceiling',
    efa: 'SRD sprays per packet, so a single flow uses many paths at once',
    tcp: (
      <>
        5 Gbps, or 10 Gbps inside a cluster placement group{' '}
        <SourceRef provenance="documented" doc={docs.bandwidth} />. ENA Express raises it to up to 25
        Gbps <SourceRef provenance="documented" doc={docs.enaExpress} />
      </>
    ),
    rdma: 'N/A',
    nvlink: 'N/A',
  },
  {
    feature: 'RDMA support',
    efa: (
      <>
        Read on all instances with Nitro v4 and later, write on most of them, as device operations{' '}
        <SourceRef provenance="documented" doc={docs.efa} />
      </>
    ),
    tcp: 'No',
    rdma: 'Native, on a dedicated fabric',
    nvlink: 'N/A',
  },
  {
    feature: 'Encryption in transit',
    efa: (
      <>
        Automatic between cluster members. AEAD, 256-bit, no performance impact{' '}
        <SourceRef provenance="documented" doc={docs.hpcLens} />
      </>
    ),
    tcp: 'TLS, at CPU cost',
    rdma: 'Varies by fabric and vendor',
    nvlink: 'N/A (internal)',
  },
  {
    feature: 'Cost',
    efa: (
      <>
        No additional cost on any supported instance{' '}
        <SourceRef provenance="documented" doc={docs.efa} />
      </>
    ),
    tcp: 'No additional cost',
    rdma: 'N/A on EC2',
    nvlink: 'Included in the instance',
  },
];

export function NetworkComparison() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="What each transport assumes about the network underneath it, and which one those assumptions point you to.">
            EFA vs Alternatives
          </Header>
        }
      >
        <Box variant="p">
          <strong>Each of these four transports is built on an assumption about the network
          underneath it</strong>, and that assumption decides where it fits: a switch inside the box
          for NVLink, a fabric that never drops a packet for RoCE v2, a shared network with
          in-order recovery for TCP, and a wide, lossy, many-path fabric for SRD. On EC2 that leaves
          EFA or TCP, since EC2 offers no RoCE or InfiniBand fabric, and on-premises InfiniBand
          still wins on point-to-point latency.
        </Box>
      </Container>

      <Table
        header={
          <Header
            variant="h2"
            description="Read down a column for one transport, across a row for what changes when you switch."
          >
            The four transports, row by row
          </Header>
        }
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
        footer={
          <Box variant="small" color="text-body-secondary">
            Every comparative figure here comes from a first-party source. Per-column microsecond
            latencies stay out because no citable source giving them for these four transports was
            located, and per-port InfiniBand rates because no NVIDIA page stating them was located.
          </Box>
        }
      />

      <Container
        header={
          <Header
            variant="h2"
            description="The trade in both directions, including where a dedicated fabric is still ahead."
          >
            What SRD buys, and what it costs
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">What RoCE asks of the network</Box>
            <Box variant="p">
              RoCE v2 expects a <strong>lossless network fabric</strong>, which in practice means
              Priority Flow Control on every switch. PFC pauses traffic when buffers fill, and that
              pause creates head-of-line blocking that can cascade. SRD takes the other side of the
              trade: it absorbs loss with selective retransmission and sprays packets across many
              paths, where TCP hashes a whole flow onto one{' '}
              <SourceRef provenance="documented" doc={docs.hpcBlog} />. Path diversity then grows
              with the job, because a bigger job spans a bigger slice of the network{' '}
              <SourceRef provenance="documented" doc={docs.hpcBlog} />.
            </Box>
          </div>
          <div>
            <Box variant="h3">Where EFA loses</Box>
            <Box variant="p">
              Point-to-point latency. A dedicated InfiniBand fabric is lower, and nothing about SRD
              closes that gap. NVIDIA also offers in-network reduction through SHARP, which runs
              part of a collective in the switch, plus self-healing link recovery{' '}
              <SourceRef provenance="documented" doc={docs.nvidiaIb} />. EFA has no switch-side
              collective offload. SRD costs something in the quiet case too: AWS says median packet
              latency may rise slightly, by tens of microseconds, on the ENA Express path when the
              network is uncongested{' '}
              <SourceRef provenance="documented" doc={docs.enaExpress} />. SRD is tuned for the bad
              case, and you pay for that tuning in the good one.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four patterns that point at EFA, and four where standard networking clears the bar."
          >
            Where each one belongs
          </Header>
        }
      >
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
              <StatusIndicator type="info">Standard networking is enough when:</StatusIndicator>
            </Box>
            <ul>
              <li>Single-node training or inference, where NVLink carries it</li>
              <li>Loosely-coupled workloads (batch, map-reduce)</li>
              <li>Data transfer and streaming to S3</li>
              <li>Web services, APIs, microservices</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
