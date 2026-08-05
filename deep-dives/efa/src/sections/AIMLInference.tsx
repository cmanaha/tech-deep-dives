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
      <Container header={<Header variant="h1" description="Whether inference needs the fabric turns on what crosses the network per request, and three serving patterns put request traffic there.">EFA for AI/ML Inference</Header>}>
        <Box variant="p">
          The usual test for whether inference needs EFA (Elastic Fabric Adapter) is whether the
          model fits in one instance. The test that decides your architecture is what crosses the
          network on the critical path of a request. Disaggregated prefill and decode, cross-node
          speculative decoding and KV-cache (Key-Value cache) migration each move bytes between
          instances while every node holds a full copy of the model. So the figure to work out for
          your own deployment is not the model size. It is how many bytes leave the instance per
          request, and how many times that happens per response.
        </Box>
      </Container>

      <Container header={<Header variant="h2" description="The model fits on every node and the KV-cache still crosses the wire on every request.">Disaggregated serving puts the KV-cache on the wire</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            In disaggregated prefill and decode, prefill runs on one set of nodes and decode on
            another, so throughput and latency scale independently. The model fits on each node, and
            the KV-cache computed during prefill still crosses the network to the decode nodes once
            per request. That transfer is why EFA matters here.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">NIXL (NVIDIA Inference Xfer Library)</Box>
              <Box variant="p">
                Purpose-built for disaggregated inference transfers. NIXL moves a buffer with{' '}
                <strong>zero SM (Streaming Multiprocessor) consumption</strong>: the transfer needs
                no GPU kernel launch, so the GPU keeps every SM on token generation. NCCL
                launches a GPU kernel for each point-to-point send and receive, and on an inference
                GPU that is already compute-bound, those SMs come straight out of throughput.
              </Box>
              <Box variant="p">
                NIXL uses EFA via the libfabric backend. AWS documents the pairing directly: EFA
                supports NIXL for AI and ML applications, and NIXL integrates with Libfabric 1.21.0
                and later <SourceRef provenance="documented" doc={docs.efa} />, with its own
                getting-started page <SourceRef provenance="documented" doc={docs.efaNixl} />.
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
              <Alert type="info" header="Size the NIXL advantage on your own transfer sizes">
                A percentage figure circulates for NIXL against NCCL at KV-cache transfer sizes. No
                benchmark that supports it was located during this research, and the repository
                usually cited for it is attributed to the wrong organization. Treat the gap as
                unquantified and measure it at the block sizes your serving stack actually moves.
              </Alert>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>vLLM integration:</strong> vLLM implements disaggregated serving through
            NixlConnector. The prefiller produces, the decoder consumes, and a proxy coordinates the
            KV-cache handoff over EFA with no GPU compute cycles spent on it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="Tensor parallelism pays the network cost once per token, so one added millisecond becomes a second per response.">Models that need more than one node</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            405B parameters at fp16 is about 810 GB, more than the 640 GB of total GPU memory in a
            P5 instance. Run that same comparison for your own weights against your own instance
            first, because it is what decides whether either of the next two strategies is in play
            at all. They split a model across nodes, and they load the fabric differently.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Multi-node tensor parallelism</Box>
              <Box variant="p">
                Every token generation step needs communication between all tensor-parallel ranks,
                and autoregressive generation repeats that <strong>per token</strong>. One extra
                millisecond of network latency across a 1,000-token response is a full second added
                to the answer, which makes this the latency-critical case for EFA. Multiply your own
                per-token network cost by your typical output length to get what it adds to one
                response.
              </Box>
              <StatusIndicator type="success">EFA critical</StatusIndicator>
            </div>
            <div>
              <Box variant="h3">Pipeline parallelism for throughput</Box>
              <Box variant="p">
                Model layers split across nodes, with communication happening at stage boundaries.
                That makes it more forgiving of latency than tensor parallelism, and it still wants
                high bandwidth for the activation tensors moving between stages.
              </Box>
              <StatusIndicator type="info">EFA beneficial</StatusIndicator>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="Both are point-to-point and bursty, which is why a collectives library is the wrong tool for them.">Speculative decoding and KV-cache migration</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Cross-node speculative decoding</Box>
            <Box variant="p">
              A draft model on one node generates candidate tokens and a verifier on another node
              accepts or rejects them. Each model fits on its own node, and the verification loop is
              latency-sensitive: every round-trip adds to time-to-first-token, which is what EFA
              shortens here.
            </Box>
            <StatusIndicator type="info">EFA beneficial</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">KV-cache migration for load balancing</Box>
            <Box variant="p">
              Autoscaling and rebalancing move a request to a less-loaded node, and its KV-cache has
              to follow. These are bursty, latency-sensitive point-to-point transfers, exactly the
              pattern NIXL is built for.
            </Box>
            <StatusIndicator type="info">EFA beneficial (NIXL)</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2" description="Two serving shapes where the intra-node links carry everything, and the single-zone constraint you sidestep by staying there.">Where NVLink already covers it</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Single-node, single-request serving</Box>
            <Box variant="p">
              One node holds the model, one node serves the request, and all GPU-to-GPU
              communication travels over NVLink and NVSwitch inside the instance. Roughly 300B
              parameters at fp16, or roughly 600B at fp8 and int8, fit on a single P5.
            </Box>
            <StatusIndicator type="stopped">EFA irrelevant</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Batch and offline inference</Box>
            <Box variant="p">
              With a loose latency budget (batch processing, embedding generation), multi-node
              inference runs acceptably on standard networking. EFA traffic stays inside one
              Availability Zone and one VPC{' '}
              <SourceRef provenance="documented" doc={docs.efa} />, so the throughput it buys costs
              you the freedom to spread nodes across zones.
            </Box>
            <StatusIndicator type="stopped">EFA optional</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2" description="Five questions in order. The first one you answer yes to decides the architecture.">Deciding it for your own deployment</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Does one node serve a whole request, prefill and decode together?</strong>{' '}
            Skip EFA. NVLink carries it, and most fine-tuning and inference workloads stop here.
          </Box>
          <Box variant="p">
            <strong>2. Is serving disaggregated, prefill split from decode?</strong> EFA is
            critical, and NIXL over EFA is the transfer library for it.
          </Box>
          <Box variant="p">
            <strong>3. Does the model need more than one node?</strong> EFA is critical. Tensor
            parallelism across nodes with NCCL over EFA. Put every node in one Availability Zone and
            one VPC, the boundary EFA traffic stays inside{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. AWS recommends a cluster placement
            group to satisfy that and keep latency low; it is a recommendation, and the hard
            boundary is the zone <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>
          <Box variant="p">
            <strong>4. Are you running speculative decoding across nodes?</strong> EFA is
            beneficial. The verification loop runs per token and lands in time-to-first-token.
          </Box>
          <Box variant="p">
            <strong>5. Do you need KV-cache migration for autoscaling or rebalancing?</strong> EFA
            is beneficial, and NIXL again.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
