import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * Overview.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef. This page previously carried
 * per-message latency figures for EFA and for TCP that no AWS source states
 * (research/2026-08-refresh/01-efa-core.md, U-1 and U-3). They were removed
 * rather than re-hedged. Do not reintroduce a microsecond number here without
 * a Tier 1 or Tier 2 citation that states it.
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
};

export function Overview() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="OS-bypass networking for the most demanding distributed workloads"
          >
            What is Elastic Fabric Adapter?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            EFA (Elastic Fabric Adapter) is a network interface for EC2 instances that enables applications to communicate
            at the <strong>scale and performance of on-premises HPC (High-Performance Computing) clusters</strong>, but in
            the cloud. It achieves this through <strong>OS-bypass</strong>: applications talk
            directly to the network hardware, skipping the kernel network stack entirely.
          </Box>
          <Box variant="p">
            The cost EFA removes is per-message kernel work. Every TCP message crosses the kernel
            network stack. For workloads that exchange millions of small messages per second
            (gradient synchronization in distributed training, MPI (Message Passing Interface)
            collectives in HPC) that per-message cost dominates the step time. AWS states the
            outcome without publishing a number: EFA provides lower and more consistent latency and
            higher throughput than the TCP transport traditionally used in cloud-based HPC systems{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>
          <Alert type="info" header="Why there is no microsecond figure on this page">
            The one comparative latency figure AWS publishes is about the tail, not the median:
            relaxing in-order packet delivery dropped p99 tail latency by around a factor of ten{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. An earlier version of this
            page compared a TCP figure against an EFA figure in microseconds. No AWS source states
            either number, so both are gone rather than relabelled. The SRD section carries what is
            sourced.
          </Alert>
          <Box variant="p">
            EFA traffic is <strong>encrypted in transit</strong> by the Nitro hardware. AWS states
            that the encryption uses AEAD (Authenticated Encryption with Associated Data) algorithms
            with 256-bit encryption, that there is no impact on network performance, and that EFA
            traffic is automatically encrypted between cluster members{' '}
            <SourceRef provenance="documented" doc={docs.hpcLens} />. EFA itself carries no charge:
            it is an optional EC2 networking feature you can enable on any supported instance at no
            additional cost <SourceRef provenance="documented" doc={docs.efa} />. The instance is the
            cost, and the Pricing section carries the rates.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Why EFA Matters: The Business Case</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">AI/ML Training</Box>
            <Box variant="p">
              Multi-node distributed training requires constant gradient synchronization via
              allreduce operations. EFA + NCCL (NVIDIA Collective Communications Library) runs on
              the full EFA fabric of the instance: AWS documents a P5 layout that provides{' '}
              <strong>up to 3,200 Gbps</strong> of EFA networking bandwidth{' '}
              <SourceRef provenance="documented" doc={docs.efaAcc} />. That is the difference
              between a training run finishing in hours and one finishing in days.
            </Box>
            <StatusIndicator type="success">Critical for multi-node GPU training</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">HPC Simulations</Box>
            <Box variant="p">
              Weather modeling, CFD (Computational Fluid Dynamics), molecular dynamics: workloads that exchange boundary
              conditions across thousands of ranks every timestep. EFA&apos;s low latency
              enables tightly-coupled simulations that were previously cloud-impossible.
            </Box>
            <StatusIndicator type="success">Enables cloud HPC migration</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">AI/ML Inference</Box>
            <Box variant="p">
              Large model inference (100B+ parameters) that requires model parallelism across
              multiple instances. EFA reduces inter-node communication latency, directly
              improving token generation throughput and time-to-first-token.
            </Box>
            <StatusIndicator type="info">Matters for multi-node inference and disaggregated serving</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">The 30-Second Mental Model</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Think of EFA in three layers:
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">1. Hardware</Box>
              <Box variant="p">
                A network device you attach to a supported EC2 instance, not a separate service.
                It comes in two shapes: an EFA (EFA with ENA) interface, which creates both an EFA
                device and an ENA (Elastic Network Adapter) device, and an EFA-only interface,
                which creates just the EFA device and cannot hold an IP address or be the primary
                interface <SourceRef provenance="documented" doc={docs.efa} />. You choose at launch
                time.
              </Box>
            </div>
            <div>
              <Box variant="h3">2. Protocol: SRD</Box>
              <Box variant="p">
                Scalable Reliable Datagram, AWS&apos;s own transport protocol. Not TCP, not UDP,
                and not RoCE (RDMA over Converged Ethernet) or InfiniBand. SRD uses multi-path
                routing and out-of-order delivery to hold latency down under congestion. RDMA
                (Remote Direct Memory Access) is a separate question from the transport: EFA
                supports RDMA read on all instances with Nitro version 4 and later, and RDMA write
                on most of them <SourceRef provenance="documented" doc={docs.efa} />. Those are
                device operations, not a software emulation. The Data Path section has the evidence.
              </Box>
            </div>
            <div>
              <Box variant="h3">3. Software: libfabric</Box>
              <Box variant="p">
                Applications use <code>libfabric</code> (the OpenFabrics Interfaces library)
                to talk to EFA. NCCL uses the <code>aws-ofi-nccl</code> plugin. MPI uses
                the EFA provider. Your app code doesn&apos;t change. The libraries handle it.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
