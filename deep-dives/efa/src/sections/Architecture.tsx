import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import { EFADataPathDiagram } from '../components/EFADataPathDiagram';
import { NetworkTopologyDiagram } from '../components/NetworkTopologyDiagram';

export function Architecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Why can distributed training at scale only work with OS-bypass networking?">
            Architecture & SRD Protocol
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> At 64+ nodes of distributed training, network
            communication becomes 30-60% of total step time. Collective operations (allreduce,
            allgather) execute millions of times per training run. If each message adds
            ~100μs of kernel overhead (TCP path), training time doubles. The architecture
            question is: how do you move data between nodes fast enough that the network
            doesn&apos;t bottleneck the GPUs?
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> OS-bypass for the data path (skip the kernel entirely)
            and SRD (Scalable Reliable Datagram) as the transport protocol. Together, they
            reduce per-message latency to ~15μs and eliminate congestion-induced tail latency
            through 64-path packet spraying.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Data Path: TCP/IP vs EFA</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The fundamental difference: TCP/IP traverses 6 layers through the kernel.
            EFA bypasses the kernel entirely — application talks directly to hardware via libfabric.
          </Box>
          <EFADataPathDiagram />
          <Alert type="info">
            OS-bypass only applies to the <strong>data path</strong>. Control operations
            (creating queue pairs, registering memory regions) still go through the kernel.
            This is the same model as RDMA. Note: EFA does support RDMA read operations
            (Nitro v4+) and RDMA write (Nitro v6) over SRD — but it does NOT use
            traditional RoCE or InfiniBand protocols.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Network Topology: Intra-Node vs Inter-Node</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The critical architecture decision for distributed training: <strong>NVLink/NVSwitch
            handles intra-node</strong> (900 GB/s bisection bandwidth), while <strong>EFA handles
            inter-node</strong> (up to 6,400 Gbps). Topology-aware rank assignment maps tensor
            parallelism to NVLink and data/pipeline parallelism to EFA.
          </Box>
          <NetworkTopologyDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Intra-node (NVLink)</Box>
              <Box variant="p">
                GPU-to-GPU within one instance via NVSwitch. 900 GB/s per GPU pair (P5).
                Used for tensor parallelism — frequent small all-reduce per layer.
                <strong> No EFA involvement.</strong>
              </Box>
            </div>
            <div>
              <Box variant="h3">Inter-node (EFA)</Box>
              <Box variant="p">
                Instance-to-instance via EFA + SRD. Up to 6,400 Gbps (P6-B300).
                Used for data parallelism (gradient sync) and pipeline parallelism
                (activation transfer). Each EFA interface maps to one network card.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">SRD: Scalable Reliable Datagram</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            SRD is AWS&apos;s proprietary transport protocol, purpose-built for datacenter
            networks. It solves the fundamental tension between reliability and performance
            in large-scale networks.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Why not TCP?</Box>
              <ul>
                <li>Head-of-line blocking — one lost packet stalls the entire stream</li>
                <li>In-order delivery requirement adds latency</li>
                <li>Congestion control (CUBIC/BBR) optimized for WAN, not datacenter</li>
                <li>Connection-oriented — state per connection doesn&apos;t scale</li>
                <li>Max single-flow ~5 Gbps vs SRD&apos;s ~25 Gbps</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Why not RDMA/RoCE?</Box>
              <ul>
                <li>RoCE v2 relies on Priority Flow Control (PFC) — creates head-of-line blocking at switch level</li>
                <li>PFC can cause deadlocks in large fabrics</li>
                <li>Doesn&apos;t handle multi-path well</li>
                <li>Requires lossless network fabric — expensive to maintain at scale</li>
                <li>Not available on AWS infrastructure</li>
              </ul>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="SRD Design Principles (deep dive)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Multi-path routing (64 parallel paths):</strong> SRD sprays packets
                across up to 64 paths chosen from hundreds available in AWS datacenters.
                Unlike ECMP with TCP (which pins flows to paths via 5-tuple hash), SRD
                does packet-level spraying by manipulating UDP source ports in the
                encapsulation header. Continuously monitors RTT on each path at
                sub-millisecond resolution and dynamically avoids congested routes.
              </Box>
              <Box variant="p">
                <strong>Out-of-order delivery:</strong> SRD deliberately decouples
                reliability from ordering. Packets arrive in any order; reassembly
                happens at the receiver in libfabric. This eliminates head-of-line
                blocking — a lost packet on one path doesn&apos;t stall others.
              </Box>
              <Box variant="p">
                <strong>Proactive congestion management:</strong> SRD estimates available
                bandwidth and RTT continuously, reducing send rate <em>before</em> congestion
                occurs. This prevents queue buildup in switches — the root cause of
                tail latency in datacenter networks. Compare to TCP&apos;s reactive approach
                (detect loss, then back off).
              </Box>
              <Box variant="p">
                <strong>Hardware-based reliability:</strong> Reliability is implemented in
                the Nitro DPU hardware, providing ~100x faster retransmission than the
                RFC 6298 minimum of 200ms. This keeps the CPU free for application work.
              </Box>
              <Box variant="p">
                <strong>P99.9 tail latency:</strong> SRD achieves P99.9 latency of tens
                of microseconds — an 85% reduction versus TCP. This matters enormously
                for collective operations where the slowest participant determines
                overall completion time.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">EFA Attachment Modes</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">EFA with ENA (default)</Box>
            <Box variant="p">
              Creates both an EFA device and a traditional ENA device on the same
              interface. Supports both IP networking (SSH, data transfer) and
              OS-bypass (NCCL, MPI). Used on the primary network card.
            </Box>
          </div>
          <div>
            <Box variant="h3">EFA-only</Box>
            <Box variant="p">
              OS-bypass only — no IP address assigned. Cannot be used on the primary
              network card (card 0). Reduces overhead when you don&apos;t need IP
              networking on secondary interfaces. Requires VPC CNI v1.18.5+ on EKS.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Software Stack</Header>}>
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">For NCCL (GPU training)</Box>
              <Box variant="p">
                NCCL → <code>aws-ofi-nccl</code> plugin → libfabric → EFA hardware.
                The plugin translates NCCL&apos;s transport APIs to libfabric&apos;s
                connection-less reliable interface. Also supports AMD RCCL.
              </Box>
            </div>
            <div>
              <Box variant="h3">For NIXL (inference)</Box>
              <Box variant="p">
                NVIDIA Inference Xfer Library → libfabric → EFA hardware.
                New in 2025 — purpose-built for multi-node inference transfer patterns.
                Requires libfabric 1.21.0+.
              </Box>
            </div>
            <div>
              <Box variant="h3">For MPI (HPC)</Box>
              <Box variant="p">
                MPI application → Open MPI / Intel MPI → libfabric → EFA hardware.
                EFA installer puts Open MPI 4.1 + 5.0 at <code>/opt/amazon/openmpi</code>.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>Gotcha — lib vs lib64:</strong> libfabric installs to{' '}
            <code>/opt/amazon/efa/lib64</code> on Amazon Linux/RHEL and{' '}
            <code>/opt/amazon/efa/lib</code> on Ubuntu/Debian. This path inconsistency
            is a frequent source of runtime linker errors when using pre-built scripts
            across distros.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Operational Gotchas</Header>}>
        <SpaceBetween size="s">
          <Alert type="error">
            <strong>Security group rule is mandatory:</strong> All EFA instances must be in
            the same security group, with a self-referencing rule allowing ALL traffic
            (protocol -1) to/from itself. Without this, EFA traffic fails silently.
          </Alert>
          <Alert type="warning">
            <strong>No hot attach/detach:</strong> Unlike standard ENIs, EFA interfaces
            cannot be attached or detached from running instances. You must stop the instance.
          </Alert>
          <Alert type="warning">
            <strong>Cross-subnet supported (2024):</strong> EFA can now communicate across
            subnets within the same AZ. Security groups must allow traffic between the
            subnets&apos; security groups. Still cannot cross AZ or VPC boundaries.
          </Alert>
          <Alert type="info">
            <strong>One EFA per network card:</strong> Max EFA interfaces = number of
            network cards. P5 has 32 cards = 32 EFA. P5en has 16 cards = 16 EFA (but
            same 3,200 Gbps total via faster per-interface speed).
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
