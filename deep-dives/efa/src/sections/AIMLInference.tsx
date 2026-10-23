import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * EFA for AI/ML Inference.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef. Where a circulating figure could not
 * be traced to a fetchable source it is absent rather than softly hedged, and
 * the search that failed is described so a reader can repeat it.
 */

const ACCESSED = '2026-10-23';
const READ = '2026-10-23';
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
  ac: {
    title: 'EC2 instance types: Accelerated computing',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: ACCESSED,
  },
  vllmSpecDecodeDoc: {
    title: 'vLLM documentation (v0.32.0): Speculative Decoding',
    url: 'https://github.com/vllm-project/vllm/blob/v0.32.0/docs/features/speculative_decoding/README.md#L3',
    tier: 1,
    accessed: ACCESSED,
  },
};

const code: Record<string, CodeRef> = {
  nixlPostWrite: {
    repo: 'ai-dynamo/nixl',
    ref: 'v1.5.0',
    path: 'src/utils/libfabric/libfabric_rail.cpp',
    lines: 'L1366-L1415',
    read: READ,
  },
  ncclP2pKernel: {
    repo: 'NVIDIA/nccl',
    ref: 'v2.32.3-1',
    path: 'src/enqueue/enqueue.cc',
    lines: 'L1241-L1249',
    read: READ,
  },
  vllmKvConvert: {
    repo: 'vllm-project/vllm',
    ref: 'v0.32.0',
    path: 'vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py',
    lines: 'L2701-L2724',
    read: READ,
  },
  vllmKvConvertWhen: {
    repo: 'vllm-project/vllm',
    ref: 'v0.32.0',
    path: 'vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py',
    lines: 'L2944-L2950',
    read: READ,
  },
  vllmBackends: {
    repo: 'vllm-project/vllm',
    ref: 'v0.32.0',
    path: 'vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py',
    lines: 'L525-L527',
    read: READ,
  },
  vllmKvRole: {
    repo: 'vllm-project/vllm',
    ref: 'v0.32.0',
    path: 'vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py',
    lines: 'L97-L103',
    read: READ,
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
          your own deployment is how many bytes leave the instance per request, and how many times
          that happens per response.
        </Box>
      </Container>

      <Container header={<Header variant="h2" description="Which transfer library carries the KV-cache, and the two connector settings that put it on EFA.">Disaggregated serving puts the KV-cache on the wire</Header>}>
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
                Over EFA, NIXL posts each transfer from a host thread through libfabric, so the
                transfer itself launches no GPU kernel and takes{' '}
                <strong>no SM (Streaming Multiprocessor)</strong>{' '}
                <SourceRef provenance="code-derived" code={code.nixlPostWrite} />. NCCL runs its
                point-to-point sends and receives inside a GPU kernel{' '}
                <SourceRef provenance="code-derived" code={code.ncclP2pKernel} />, and on an
                inference GPU that is already compute-bound, those SMs come straight out of
                throughput.
              </Box>
              <StatusIndicator type="success">EFA critical for NIXL</StatusIndicator>
            </div>
            <div>
              <Box variant="h3">NIXL vs NCCL: the shape of the difference</Box>
              <Box variant="p">
                NCCL is designed for steady-state collectives in training: allreduce, allgather,
                reduce-scatter, running every step at a predictable size. NIXL is designed for
                bursty point-to-point transfers in inference, where a KV-cache block moves once,
                between two specific nodes, at an unpredictable moment.
              </Box>
              <Alert type="info" header="Size the NIXL advantage on your own transfer sizes">
                A percentage figure circulates for NIXL against NCCL at KV-cache transfer sizes. No
                benchmark that supports it was located during this research. Treat the gap as
                unquantified and measure it at the block sizes your serving stack actually moves.
              </Alert>
            </div>
          </ColumnLayout>
          <Box variant="p">
            NIXL reaches EFA through its libfabric backend and integrates with Libfabric 1.21.0 and
            later <SourceRef provenance="documented" doc={docs.efa} />, so check the Libfabric
            version in the serving image.
          </Box>
          <Box variant="p">
            <strong>vLLM integration:</strong> vLLM implements disaggregated serving through
            NixlConnector. LIBFABRIC is the backend that takes NIXL traffic over EFA{' '}
            <SourceRef provenance="documented" doc={docs.efaNixl} />, and the connector defaults to
            UCX (Unified Communication X){' '}
            <SourceRef provenance="code-derived" code={code.vllmBackends} />, so name it in{' '}
            <code>kv_connector_extra_config</code> with{' '}
            <code>{'"backends": ["LIBFABRIC"]'}</code>. Set <code>kv_role</code> to{' '}
            <code>kv_producer</code> on prefill instances and <code>kv_consumer</code> on decode
            instances. The AWS sample sets <code>kv_both</code> on both, a value the connector logs
            as deprecated{' '}
            <SourceRef
              provenance="doc-code-conflict"
              doc={docs.efaNixl}
              code={code.vllmKvRole}
              conflict="kv_role set to kv_both on both the prefill and the decode instance"
            />. When prefill and decode use different block sizes or KV layouts, vLLM runs a
            conversion on the decode GPU{' '}
            <SourceRef provenance="code-derived" code={code.vllmKvConvert} />
            <SourceRef provenance="code-derived" code={code.vllmKvConvertWhen} />, so compare both
            settings across the two fleets.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2" description="Tensor parallelism pays the network cost once per token, so one added millisecond becomes a second per response.">Models that need more than one node</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            405B parameters at fp16 is about 810 GB, more than the 640 GiB (about 687 GB) of total
            GPU memory in a P5 instance <SourceRef provenance="documented" doc={docs.ac} />. Run
            that same comparison for your own weights against your own instance first, because it is what decides whether either of the next two strategies is in play
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
              accepts or rejects them. Each model fits on its own node, and speculative decoding
              exists to cut inter-token latency in medium-to-low QPS (queries per second),
              memory-bound serving{' '}
              <SourceRef provenance="documented" doc={docs.vllmSpecDecodeDoc} />, so every
              draft-to-verifier round-trip lands there, and that round-trip is what EFA shortens.
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

      <Container header={<Header variant="h2" description="Two serving shapes that skip EFA: one node where NVLink carries everything, and batch work loose enough on latency to run on standard networking across zones.">Where NVLink already covers it</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Single-node, single-request serving</Box>
            <Box variant="p">
              One node holds the model, one node serves the request, and all GPU-to-GPU
              communication travels over NVLink and NVSwitch inside the instance. Roughly 300B
              parameters at fp16, or roughly 600B at fp8 and int8, fit on a single P5 by weight
              alone: about 600 GB against 640 GiB (about 687 GB) of GPU memory{' '}
              <SourceRef provenance="documented" doc={docs.ac} />, which leaves under 90 GB for the
              KV-cache and activations (our arithmetic).
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
            group to satisfy that and keep latency low; the hard boundary is the zone{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>
          <Box variant="p">
            <strong>4. Are you running speculative decoding across nodes?</strong> EFA is
            beneficial. The verification loop runs per token and lands in inter-token latency{' '}
            <SourceRef provenance="documented" doc={docs.vllmSpecDecodeDoc} />.
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
