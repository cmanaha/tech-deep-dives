import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

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
            the cloud. It achieves this through <strong>OS-bypass</strong> — applications talk
            directly to the network hardware, skipping the kernel network stack entirely.
          </Box>
          <Box variant="p">
            The key insight: traditional TCP/IP adds ~100+ microseconds of kernel overhead per message.
            For workloads exchanging millions of small messages per second (gradient
            synchronization in distributed training, MPI (Message Passing Interface) collectives in HPC), this overhead
            dominates. EFA reduces it to ~15 microseconds (MPI ping-pong measured).
          </Box>
          <Box variant="p">
            All EFA traffic is <strong>encrypted in transit</strong> by the Nitro hardware
            with zero performance penalty — no TLS overhead, no CPU cycles spent on crypto.
            EFA is also <strong>free</strong>: no per-interface charge, no data transfer fee.
            The only cost is the EC2 instance itself.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Why EFA Matters — The Business Case</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">AI/ML Training</Box>
            <Box variant="p">
              Multi-node distributed training requires constant gradient synchronization via
              allreduce operations. EFA + NCCL (NVIDIA Collective Communications Library) can deliver <strong>up to 3,200 Gbps</strong> of
              aggregate bandwidth on P5 instances — the difference between training completing
              in hours vs. days.
            </Box>
            <StatusIndicator type="success">Critical for multi-node GPU training</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">HPC Simulations</Box>
            <Box variant="p">
              Weather modeling, CFD (Computational Fluid Dynamics), molecular dynamics — workloads that exchange boundary
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
            <StatusIndicator type="info">Matters for multi-node inference only</StatusIndicator>
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
                A special network interface card (NIC) on supported EC2 instances. Not a
                separate service — it&apos;s a capability of the instance&apos;s existing ENI (Elastic Network Interface).
                You enable it at launch time.
              </Box>
            </div>
            <div>
              <Box variant="h3">2. Protocol — SRD</Box>
              <Box variant="p">
                Scalable Reliable Datagram — AWS&apos;s custom transport protocol. Not TCP,
                not UDP, not RDMA (Remote Direct Memory Access)/RoCE (RDMA over Converged Ethernet). SRD uses multi-path routing and out-of-order delivery
                to achieve consistently low latency even under network congestion.
              </Box>
            </div>
            <div>
              <Box variant="h3">3. Software — libfabric</Box>
              <Box variant="p">
                Applications use <code>libfabric</code> (the OpenFabrics Interfaces library)
                to talk to EFA. NCCL uses the <code>aws-ofi-nccl</code> plugin. MPI uses
                the EFA provider. Your app code doesn&apos;t change — the libraries handle it.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
