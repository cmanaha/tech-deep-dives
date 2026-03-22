import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';

export function Architecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="How EFA achieves OS-bypass networking">
            Architecture & SRD Protocol
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EFA&apos;s architecture has two key innovations: <strong>OS-bypass</strong> for the
            data path and <strong>SRD (Scalable Reliable Datagram)</strong> as the transport
            protocol. Together, they eliminate the two main bottlenecks of cloud networking:
            kernel overhead and congestion-induced tail latency.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">OS-Bypass: Skipping the Kernel</Header>}>
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Traditional Path (TCP/IP)</Box>
              <Box variant="p">
                Application → System Call → Kernel TCP Stack → Socket Buffers →
                NIC Driver → NIC Hardware → Wire
              </Box>
              <Box variant="p">
                Each hop adds latency. Context switches between user and kernel space.
                Memory copies between buffers. Protocol processing in software.
                <strong> ~10-30μs per message.</strong>
              </Box>
            </div>
            <div>
              <Box variant="h3">EFA Path (OS-Bypass)</Box>
              <Box variant="p">
                Application → libfabric → EFA Hardware → Wire
              </Box>
              <Box variant="p">
                The application maps the EFA device into its address space and communicates
                directly with the hardware. No kernel involvement for data transfer.
                No memory copies. No context switches.
                <strong> ~2-5μs per message.</strong>
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            OS-bypass only applies to the <strong>data path</strong>. Control operations
            (creating queue pairs, registering memory regions) still go through the kernel.
            This is the same model as RDMA — but EFA does NOT use RDMA protocols.
          </Alert>
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
              </ul>
            </div>
            <div>
              <Box variant="h3">Why not RDMA/RoCE?</Box>
              <ul>
                <li>RoCE v2 relies on Priority Flow Control (PFC) — creates head-of-line blocking at switch level</li>
                <li>PFC can cause deadlocks in large fabrics</li>
                <li>Doesn&apos;t handle multi-path well</li>
                <li>Requires lossless network fabric — expensive to maintain at scale</li>
              </ul>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="SRD Design Principles">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Multi-path routing:</strong> SRD sprays packets across all available
                network paths. Unlike ECMP with TCP (which pins flows to paths), SRD can
                use packet-level spraying because it handles out-of-order delivery natively.
                This means no single path becomes a bottleneck.
              </Box>
              <Box variant="p">
                <strong>Out-of-order delivery:</strong> SRD accepts packets in any order
                and reassembles at the receiver. This eliminates head-of-line blocking —
                a lost packet on one path doesn&apos;t stall packets arriving on other paths.
              </Box>
              <Box variant="p">
                <strong>Selective retransmission:</strong> Only retransmit lost packets,
                not everything after the loss (unlike TCP&apos;s Go-Back-N in some implementations).
              </Box>
              <Box variant="p">
                <strong>Hardware-based reliability:</strong> Reliability is implemented in
                the Nitro card hardware, not in software. This keeps the CPU free for
                application work.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Software Stack: libfabric</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <code>libfabric</code> is the user-space library that applications use to access
            EFA. It&apos;s part of the OpenFabrics Interfaces (OFI) project — a
            vendor-neutral API for high-performance networking.
          </Box>
          <Box variant="p">
            The key abstractions:
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">For NCCL (GPU training)</Box>
              <Box variant="p">
                NCCL → <code>aws-ofi-nccl</code> plugin → libfabric → EFA hardware.
                The plugin translates NCCL&apos;s communication primitives into libfabric calls.
                Applications using PyTorch DDP, FSDP, DeepSpeed, or Megatron-LM get EFA
                automatically if the plugin is installed.
              </Box>
            </div>
            <div>
              <Box variant="h3">For MPI (HPC)</Box>
              <Box variant="p">
                MPI application → Open MPI / Intel MPI → libfabric → EFA hardware.
                MPI&apos;s point-to-point and collective operations map directly to libfabric
                primitives. The EFA provider in libfabric handles the translation to SRD.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
