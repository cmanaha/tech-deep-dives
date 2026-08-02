import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * EFA vs Alternatives.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing cell in the table carries a SourceRef, or it carries no number.
 *
 * Corrections applied on 2026-08-02:
 *  - The latency row held four microsecond figures, none of them sourced. The
 *    only comparative latency figure AWS publishes is p99 falling by around a
 *    factor of ten, and it now appears once, in the tail-latency row.
 *  - The old "P99.9, 85% reduction" cell had the wrong percentile and a
 *    magnitude no source gives.
 *  - RDMA write is Nitro v4 and later, not Nitro v6.
 *  - The single-flow row put an ENA Express figure in the EFA column. EFA has
 *    no 5-tuple flow to cap.
 *  - Per-port InfiniBand rates and sub-microsecond fabric latencies were
 *    removed. We could not fetch a first-party page stating them.
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
    feature: 'Bandwidth (max)',
    efa: (
      <>
        Up to 6,400 Gbps per instance on P6-B300{' '}
        <SourceRef provenance="documented" doc={docs.efaAcc} />
      </>
    ),
    tcp: (
      <>
        Set by the instance, not the protocol{' '}
        <SourceRef provenance="documented" doc={docs.bandwidth} />
      </>
    ),
    rdma: (
      <>
        Set by the adapter generation. Not offered as a fabric on AWS{' '}
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
    feature: 'Multi-path',
    efa: (
      <>
        Yes. SRD sprays over 64 paths at a time{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'ECMP, hashed per flow',
    rdma: (
      <>
        Adaptive routing, switch-side{' '}
        <SourceRef provenance="documented" doc={docs.nvidiaIb} />
      </>
    ),
    nvlink: 'N/A',
  },
  {
    feature: 'Congestion handling',
    efa: (
      <>
        Packet-level spraying plus SRD congestion control{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'CUBIC / BBR, tuned for the WAN',
    rdma: 'PFC on RoCE, credit-based on InfiniBand',
    nvlink: 'N/A',
  },
  {
    feature: 'Requires lossless fabric',
    efa: (
      <>
        No. SRD handles loss with selective retransmission{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />
      </>
    ),
    tcp: 'No',
    rdma: 'Yes for RoCE v2 (PFC). InfiniBand is lossless by design',
    nvlink: 'N/A',
  },
  {
    feature: 'RDMA support',
    efa: (
      <>
        Read on all instances with Nitro v4 and later, write on most of them. Device operations, not
        emulation <SourceRef provenance="documented" doc={docs.efa} />
      </>
    ),
    tcp: 'No',
    rdma: 'Native, and not offered as a RoCE or InfiniBand fabric on EC2',
    nvlink: 'N/A',
  },
  {
    feature: 'Single-flow ceiling',
    efa: 'No 5-tuple flow to cap. SRD sprays per packet',
    tcp: (
      <>
        5 Gbps, or 10 Gbps inside a cluster placement group{' '}
        <SourceRef provenance="documented" doc={docs.bandwidth} />. ENA Express raises it to up to 25
        Gbps <SourceRef provenance="documented" doc={docs.enaExpress} />
      </>
    ),
    rdma: 'N/A on AWS',
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
    rdma: 'N/A as a standalone fabric on AWS',
    nvlink: 'Included in the instance',
  },
];

export function NetworkComparison() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Given my workload, which networking approach minimizes cost and maximizes throughput?">
            EFA vs Alternatives
          </Header>
        }
      >
        <Box variant="p">
          <strong>The question isn&apos;t &quot;which protocol is fastest&quot;</strong>.
          It&apos;s &quot;given my workload&apos;s communication pattern, node count, and
          budget, which networking approach gives the best outcome?&quot; NVLink wins
          intra-node. EFA is the inter-node option on AWS, and on AWS it is the only one:
          RoCE and InfiniBand are not offered as fabrics on EC2. A dedicated InfiniBand
          fabric on-premises still wins on point-to-point latency. TCP is fine when the
          network is not the bottleneck.
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

      <Alert type="info" header="Numbers this table does not carry">
        There is no latency row: no per-column microsecond figure for these four fabrics traces to a
        source that can be cited. The tail-latency figures p99.9 and 85% are not what AWS states;
        the AWS statement is p99 and around a factor of ten{' '}
        <SourceRef provenance="documented" doc={docs.hpcBlog} />. RDMA write did not arrive at Nitro
        v6; it is Nitro v4 and later <SourceRef provenance="documented" doc={docs.efa} />. Per-port
        InfiniBand rates are absent because no NVIDIA page stating them was located.
      </Alert>

      <Container header={<Header variant="h2">Where SRD Wins, and Where It Does Not</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">RoCE&apos;s problem at scale</Box>
            <Box variant="p">
              RoCE v2 expects a <strong>lossless network fabric</strong>, which in practice means
              Priority Flow Control enabled on every switch. PFC pauses traffic when buffers fill,
              and that pause creates head-of-line blocking that can cascade. SRD does not need a
              lossless fabric: it absorbs loss with selective retransmission and avoids congestion
              by spraying packets across many paths rather than hashing a flow onto one{' '}
              <SourceRef provenance="documented" doc={docs.hpcBlog} />. AWS also points out that
              path diversity grows with the job, because a bigger job spans a bigger slice of the
              network <SourceRef provenance="documented" doc={docs.hpcBlog} />.
            </Box>
          </div>
          <div>
            <Box variant="h3">Where EFA loses</Box>
            <Box variant="p">
              Point-to-point latency. A dedicated InfiniBand fabric is lower, and nothing about SRD
              closes that gap. NVIDIA also offers in-network reduction through SHARP, which runs
              part of a collective in the switch, and self-healing link recovery{' '}
              <SourceRef provenance="documented" doc={docs.nvidiaIb} />. EFA has no switch-side
              collective offload. There is a documented cost to SRD on the uncongested case too:
              AWS says median packet latency may rise slightly, by tens of microseconds, on the ENA
              Express path when the network is quiet{' '}
              <SourceRef provenance="documented" doc={docs.enaExpress} />. SRD is tuned for the bad
              case, and you pay for that tuning in the good one.
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
