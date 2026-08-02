import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * EFA for AI/ML Inference.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef.
 *
 * Corrections applied on 2026-08-02:
 *  - A cluster placement group is not a requirement for EFA. The hard
 *    constraint is the Availability Zone. See the Instance Support section.
 *  - The "NIXL beats NCCL by 30 to 50%" figure rested on a benchmark
 *    repository that does not exist at the cited URL and was misattributed.
 *    It is removed rather than re-hedged (see sources.md, id 39).
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
  efaStart: {
    title: 'EC2 User Guide: Get started with EFA and MPI',
    url: `${EC2_DOC}efa-start.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  efaNixl: {
    title: 'EC2 User Guide: Get started with EFA and NIXL',
    url: `${EC2_DOC}efa-start-nixl.html`,
    tier: 1,
    accessed: ACCESSED,
  },
};

export function AIMLInference() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="When does EFA matter for inference, and when doesn't it?">
            EFA for AI/ML Inference
          </Header>
        }
      >
        <Alert type="info">
          <strong>Key insight:</strong> EFA matters for inference in three distinct scenarios, not
          just when the model doesn&apos;t fit on one node. Disaggregated serving architectures and
          KV-cache migration create EFA-critical transfer patterns even when every node has enough
          GPU memory for the full model.
        </Alert>
      </Container>

      <Container header={<Header variant="h2">A. Large Model Parallelism</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Multi-Node Tensor Parallelism</Box>
            <Box variant="p">
              Models too large for a single instance (e.g., 405B parameters at fp16 = ~810GB,
              exceeding even P5&apos;s 640GB total GPU memory). Tensor parallelism across
              nodes requires EFA for acceptable latency.
            </Box>
            <Box variant="p">
              Every token generation step requires communication between all TP ranks.
              For autoregressive generation, this happens <strong>per token</strong>.
              Even 1ms of extra network latency × 1000 tokens = 1 second added to response time.
            </Box>
            <StatusIndicator type="success">EFA critical</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Pipeline Parallelism for Throughput</Box>
            <Box variant="p">
              Splitting model layers across nodes for serving. Less latency-sensitive than TP
              (communication is between pipeline stages, not within every layer).
              But high bandwidth still matters for activation transfer.
            </Box>
            <StatusIndicator type="info">EFA beneficial</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">B. Disaggregated Serving Architectures</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            In disaggregated prefill/decode, prefill runs on one set of nodes and decode on another.
            The model fits on each node individually, but the architecture is deliberately multi-node
            to optimize throughput and latency independently. The KV-cache computed during prefill
            must transfer from prefill nodes to decode nodes via the network. This is where EFA
            becomes critical.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NIXL (NVIDIA Inference Xfer Library)</Box>
              <Box variant="p">
                Purpose-built for disaggregated inference transfers. Unlike NCCL, which always
                launches a GPU kernel even for point-to-point send/recv, NIXL performs transfers
                with <strong>zero SM (Streaming Multiprocessor) consumption</strong>: no GPU kernel
                launch required. This matters because inference GPUs are already compute-bound
                generating tokens; stealing SMs for communication directly reduces throughput.
              </Box>
              <Box variant="p">
                NIXL uses EFA via the libfabric backend. AWS documents the pairing directly: EFA
                supports NIXL for AI and ML applications, and NIXL integrates with Libfabric 1.21.0
                and later <SourceRef provenance="documented" doc={docs.efa} />, with its own
                getting-started page <SourceRef provenance="documented" doc={docs.efaNixl} />. NIXL
                stripes transfers across the available EFA devices and routes NUMA-aware to keep
                host-side latency down.
              </Box>
              <StatusIndicator type="success">EFA critical for NIXL</StatusIndicator>
            </div>
            <div>
              <Box variant="h3">NIXL vs NCCL: the shape of the difference</Box>
              <Box variant="p">
                NCCL is designed for steady-state collectives in training: allreduce, allgather,
                reduce-scatter, running every step at a predictable size. NIXL is designed for
                bursty point-to-point transfers in inference, where a KV-cache block moves once,
                between two specific nodes, at an unpredictable moment. Different patterns, so
                different libraries.
              </Box>
              <Alert type="info" header="The percentage that used to be here is gone">
                This panel previously claimed NIXL outperforms NCCL by 30 to 50% at KV-cache
                transfer sizes. That figure rested on a benchmark repository cited at a URL that
                does not exist and was attributed to the wrong organization. Rather than re-hedge
                it, we removed it. If you need the number, measure it on your own transfer sizes.
              </Alert>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>vLLM integration:</strong> vLLM implements disaggregated serving via
            NixlConnector: the prefiller acts as producer, the decoder as consumer, and a proxy
            coordinates the KV-cache handoff. The transfer happens over EFA without consuming
            any GPU compute cycles.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">C. Speculative Decoding &amp; KV-Cache Migration</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Cross-Node Speculative Decoding</Box>
            <Box variant="p">
              A draft model on one node generates candidate tokens; a verifier on another node
              accepts or rejects them. Both models may fit on their respective nodes individually,
              but the verification loop is latency-sensitive: every round-trip adds to
              time-to-first-token. EFA reduces this communication overhead.
            </Box>
            <StatusIndicator type="info">EFA beneficial</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">KV-Cache Migration for Load Balancing</Box>
            <Box variant="p">
              Moving hot KV-cache between serving instances during autoscaling or rebalancing.
              When a request is migrated to a less-loaded node, its KV-cache must follow.
              These are bursty, latency-sensitive point-to-point transfers, exactly the pattern
              NIXL is built for.
            </Box>
            <StatusIndicator type="info">EFA beneficial (NIXL)</StatusIndicator>
          </div>
        </ColumnLayout>
        <Box variant="p" padding={{ top: 'm' }}>
          These patterns are <strong>not collective operations</strong>. They are point-to-point
          and bursty. This is why NIXL exists alongside NCCL: different communication patterns
          need different libraries.
        </Box>
      </Container>

      <Container header={<Header variant="h2">When EFA Does NOT Matter for Inference</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Single-Node, Single-Request Serving</Box>
            <Box variant="p">
              Model fits on one node, no disaggregated architecture, no cross-node speculative
              decoding. All GPU-to-GPU communication uses NVLink/NVSwitch within the instance.
              EFA is not involved.
            </Box>
            <Box variant="p">
              Models up to ~300B parameters at fp16, or ~600B at fp8/int8, fit on a single P5.
              With quantization, even larger models fit.
            </Box>
            <StatusIndicator type="stopped">EFA irrelevant</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Batch Inference / Offline</Box>
            <Box variant="p">
              If latency isn&apos;t critical (batch processing, embedding generation),
              even multi-node inference can tolerate standard networking. The throughput
              improvement from EFA may not justify keeping every node in one Availability Zone,
              which is the constraint EFA actually imposes: EFA traffic cannot cross Availability
              Zones or VPCs <SourceRef provenance="documented" doc={docs.efa} />.
            </Box>
            <StatusIndicator type="stopped">EFA optional</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Inference Architecture Decision Tree</Header>}>
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-s">
            <strong>1. Is serving single-node, single-request (no disaggregation)?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> No EFA needed. Use NVLink intra-node.
          </Box>

          <Box variant="p" fontSize="heading-s">
            <strong>2. Is serving disaggregated (prefill/decode split)?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> EFA critical. KV-cache transfers between prefill and decode
            nodes require low-latency networking. Use NIXL over EFA.
          </Box>

          <Box variant="p" fontSize="heading-s">
            <strong>3. Is the model too large for one node?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> EFA critical. Tensor parallelism across nodes with NCCL
            over EFA. Put every node in the same Availability Zone, which EFA requires{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. A cluster placement group is the
            recommended way to satisfy that and keep latency low, not an absolute requirement{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>

          <Box variant="p" fontSize="heading-s">
            <strong>4. Using speculative decoding across nodes?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> EFA beneficial. Verification loop is latency-sensitive.
          </Box>

          <Box variant="p" fontSize="heading-s">
            <strong>5. Need KV-cache migration for autoscaling/rebalancing?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> EFA beneficial. NIXL for bursty point-to-point transfers.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
