import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * Overview. First section in reading order, so it owns the first expansion of
 * EFA, HPC, MPI and SRD. Sourcing rule (revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef, and no AWS source states a
 * per-message microsecond figure for EFA or for TCP, so none appears here. Do
 * not add one without a Tier 1 or Tier 2 citation that states it.
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
          <Header variant="h1" description="The link is fast. What decides whether the job is.">
            What is Elastic Fabric Adapter?
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            Every TCP message crosses the kernel network stack, and that cost is paid once per message.
            Workloads that exchange millions of small messages per second (gradient synchronization in
            distributed training, MPI (Message Passing Interface) collectives in HPC (High-Performance
            Computing)) spend their step time inside that per-message cost.
          </Box>
          <Box variant="p">
            <strong>EFA (Elastic Fabric Adapter)</strong> is a network interface for EC2 instances that
            enables applications to communicate at the{' '}
            <strong>scale and performance of on-premises HPC clusters</strong>, but in the cloud. It achieves
            this through <strong>OS-bypass</strong>: applications talk directly to the network hardware,
            skipping the kernel network stack entirely. AWS states the outcome: EFA provides lower and more
            consistent latency and higher throughput than the TCP transport traditionally used in cloud-based
            HPC systems <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>
          <Box variant="p">
            The one comparative latency figure AWS publishes is about the tail: relaxing
            in-order packet delivery dropped p99 tail latency by around a factor of ten{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. A collective finishes when its slowest
            member finishes, so the tail is what decides the step time. The SRD (Scalable Reliable Datagram)
            section carries that trade in full.
          </Box>
          <Box variant="p">
            Two questions get settled before any of the mechanism matters. Encryption: EFA traffic is{' '}
            <strong>encrypted in transit</strong> by the Nitro hardware, and AWS states that the encryption
            uses AEAD (Authenticated Encryption with Associated Data) algorithms with 256-bit encryption,
            that there is no impact on network performance, and that EFA traffic is automatically encrypted
            between cluster members <SourceRef provenance="documented" doc={docs.hpcLens} />. There is
            nothing to switch on for it. Cost: EFA is an optional EC2 networking feature you can enable on
            any supported instance at no additional cost{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. The instance type is the line item, and
            the Pricing section carries the rates.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three workloads where message rate sets the clock">
            Who this is for
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">AI/ML Training</Box>
            <Box variant="p">
              Multi-node distributed training synchronizes gradients through allreduce on every
              step, so the fabric sets the wall clock. EFA + NCCL (NVIDIA Collective Communications
              Library) runs on the full EFA fabric of the instance: AWS documents a P5 layout that
              provides <strong>up to 3,200 Gbps</strong> of EFA networking bandwidth{' '}
              <SourceRef provenance="documented" doc={docs.efaAcc} />.
            </Box>
            <StatusIndicator type="success">Critical for multi-node GPU training</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">HPC Simulations</Box>
            <Box variant="p">
              Weather modeling, CFD (Computational Fluid Dynamics), molecular dynamics: thousands
              of ranks exchange boundary conditions every timestep, and every rank waits for its
              neighbors, so the slowest exchange sets the timestep.
            </Box>
            <StatusIndicator type="success">Enables cloud HPC migration</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">AI/ML Inference</Box>
            <Box variant="p">
              A model too large for one instance is split across several, so every token crosses
              the fabric and pays that per-message cost on the way.
            </Box>
            <StatusIndicator type="info">Matters for multi-node inference and disaggregated serving</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three layers, and the section that takes each apart">
            The 30-second mental model
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">1. Hardware</Box>
            <Box variant="p">
              A network device you attach to a supported EC2 instance, chosen at launch time. It comes in two
              shapes: an EFA (EFA with ENA) interface, which creates both an EFA device and an ENA (Elastic
              Network Adapter) device, and an EFA-only interface, which creates just the EFA device and is
              always a secondary interface with no IP address{' '}
              <SourceRef provenance="documented" doc={docs.efa} />. Which shape you attach is decided at
              launch, and the EFA Device section covers that choice along with network cards and rails.
            </Box>
          </div>
          <div>
            <Box variant="h3">2. Protocol: SRD</Box>
            <Box variant="p">
              AWS&apos;s own transport protocol. SRD uses multi-path routing and out-of-order delivery to
              hold tail latency down under congestion, which is where that factor of ten comes from, and the
              SRD section sets it against InfiniBand and RoCE (RDMA over Converged Ethernet). RDMA (Remote
              Direct Memory Access) is a separate question from the transport: EFA supports RDMA read on all
              instances with Nitro version 4 and later, and RDMA write on most of them{' '}
              <SourceRef provenance="documented" doc={docs.efa} />, so it is an instance-type question, and
              the Data Path section has the capability bits the device reports for it.
            </Box>
          </div>
          <div>
            <Box variant="h3">3. Software: libfabric</Box>
            <Box variant="p">
              Applications use <code>libfabric</code> (the OpenFabrics Interfaces library) to talk to EFA.
              NCCL uses the <code>aws-ofi-nccl</code> plugin. MPI uses the EFA provider. Your app code stays
              as it is: the libraries handle it, and the libfabric section is where that handling stops being
              a black box.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
