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
 * load-bearing claim carries a SourceRef. Where a circulating figure could not
 * be traced to a fetchable source it is absent rather than softly hedged, and
 * the search that failed is described so a reader can repeat it.
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
      <Container header={<Header variant="h1" description="The model fitting on one node does not settle the question. Three serving patterns put request traffic on the fabric anyway.">EFA for AI/ML Inference</Header>}>
        <Box variant="p">
          <strong>The problem:</strong> the usual test for whether inference needs EFA (Elastic
          Fabric Adapter) is whether the model fits in one instance. That test misses the cases that
          cost the most. <strong>The answer:</strong> the question is not model size, it is whether
          anything crosses the network on the critical path of a request. Disaggregated prefill and
          decode, cross-node speculative decoding and KV-cache migration all move bytes between
          instances while every node holds a full copy of the model.
        </Box>
      </Container>

      <Container header={<Header variant="h2" description="The model fits on every node and the KV-cache still crosses the wire on every request.">Disaggregated serving is the case people miss</Header>}>
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
              <Alert type="info" header="Do not trust a NIXL versus NCCL percentage you find quoted">
                A figure in the 30 to 50% range circulates for NIXL against NCCL at KV-cache
                transfer sizes. No benchmark that supports it was located during this research, and
                the repository usually cited for it is attributed to the wrong organization. Treat
                the gap as unquantified and measure it on your own transfer sizes.
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

      <Container header={<Header variant="h2" description="Tensor parallelism pays the network cost once per token, so one added millisecond becomes a second per response.">When the model genuinely does not fit</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Multi-Node Tensor Parallelism</Box>
            <Box variant="p">
              Models too large for a single instance (for example 405B parameters at fp16 is about
              810GB, exceeding even P5&apos;s 640GB total GPU memory). Tensor parallelism across
              nodes requires EFA for acceptable latency.
            </Box>
            <Box variant="p">
              Every token generation step requires communication between all TP ranks. For
              autoregressive generation, this happens <strong>per token</strong>. One extra
              millisecond of network latency across a 1,000-token response is a full second added to
              the answer.
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

      <Container header={<Header variant="h2" description="Both are point-to-point and bursty, which is why a collectives library is the wrong tool for them.">Speculative decoding and KV-cache migration</Header>}>
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
          Neither of these is a collective operation. A library tuned for a predictable allreduce
          every step is the wrong tool for one block of cache moving between two named nodes at an
          unpredictable moment, which is the whole reason NIXL exists alongside NCCL.
        </Box>
      </Container>

      <Container header={<Header variant="h2" description="Two shapes where the fabric buys nothing and the single-zone constraint still costs you.">When EFA does not matter for inference</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Single-Node, Single-Request Serving</Box>
            <Box variant="p">
              Model fits on one node, no disaggregated architecture, no cross-node speculative
              decoding. All GPU-to-GPU communication uses NVLink/NVSwitch within the instance.
              EFA is not involved.
            </Box>
            <Box variant="p">
              Models up to roughly 300B parameters at fp16, or roughly 600B at fp8/int8, fit on a
              single P5. With quantization, even larger models fit.
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

      <Container header={<Header variant="h2" description="Five questions in order. The first one you answer yes to decides the architecture.">Deciding it for your own deployment</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Is serving single-node and single-request, with no disaggregation?</strong>{' '}
            Then no EFA. NVLink handles all intra-node GPU communication, and most fine-tuning and
            inference workloads stop here.
          </Box>
          <Box variant="p">
            <strong>2. Is serving disaggregated, prefill split from decode?</strong> EFA is
            critical. KV-cache transfers between prefill and decode nodes need low-latency
            networking. Use NIXL over EFA.
          </Box>
          <Box variant="p">
            <strong>3. Is the model too large for one node?</strong> EFA is critical. Tensor
            parallelism across nodes with NCCL over EFA. Put every node in the same Availability
            Zone, which is the boundary EFA traffic cannot cross{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. A cluster placement group is the
            recommended way to satisfy that and keep latency low, not an absolute requirement{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>
          <Box variant="p">
            <strong>4. Are you running speculative decoding across nodes?</strong> EFA is
            beneficial. The verification loop is latency-sensitive and it runs per token.
          </Box>
          <Box variant="p">
            <strong>5. Do you need KV-cache migration for autoscaling or rebalancing?</strong> EFA
            is beneficial. NIXL again, for the same bursty point-to-point reason.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
