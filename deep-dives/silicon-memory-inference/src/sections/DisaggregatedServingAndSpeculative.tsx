import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { DisaggregatedServingDiagram } from '../components/DisaggregatedServingDiagram';

export function DisaggregatedServingAndSpeculative() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Splitting prefill from decode and speculating ahead — two serving-stack levers"
          >
            Disaggregated serving and speculative decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Section 3 said prefill is
            compute-bound and decode is memory-bound. That is not a
            metaphor — it is two distinct workloads that happen to live in the
            same model and ideally want different silicon. Disaggregated
            serving is the architectural pattern that takes that observation
            seriously: build two clusters with two memory profiles, route
            requests through both, and move only the KV cache between them.
          </Box>
          <Box variant="p">
            <strong>The other lever.</strong> Speculative decoding generates
            multiple draft tokens with a small model and verifies them with
            the large one in a single batch. When the speculation hits, decode
            wall-clock drops because multiple tokens are emitted per
            big-model pass. When the speculation misses, you fall back. Both
            techniques compose with the precision and batching levers from
            Sections 25 and 22.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two clusters, one transport"
          >
            Disaggregated serving — the topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DisaggregatedServingDiagram />
          <Box variant="p">
            The router accepts a request and dispatches the prompt to the
            prefill cluster. Prefill runs the compute-heavy initial pass over
            the full prompt, building the KV cache. The KV cache is then
            transported to the decode cluster — over NVLink in a single
            UltraServer, or over EFA when the clusters are separated by
            network — and decode generates tokens against the
            transported cache. The architectural win is that each cluster can
            be sized for its own arithmetic-intensity profile rather than
            both being sized for the worse case.
          </Box>
          <Alert type="info" header="What KV cache transport actually costs">
            KV cache size for a long prompt can be hundreds of MB to several
            GB per request. Moving that over EFA at 3,200 Gbps on P5 takes
            milliseconds; over NVLink inside an UltraServer it takes
            sub-millisecond. NIXL (NVIDIA Inference Xfer Library) was designed
            specifically for this transport because NCCL launches kernels
            that consume SMs — NIXL does GPU-Direct RDMA without activating
            any SMs, which matters when the decode node is simultaneously
            running attention kernels.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the production stacks are landing"
          >
            Production state in 2026
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">NVIDIA Dynamo</Box>
            <Box variant="p">
              NVIDIA&apos;s production disaggregated serving framework. Pairs
              with TensorRT-LLM and runs over NVLink within an UltraServer or
              EFA between clusters. The reference deployment for DeepSeek-R1
              MoE on GB200 NVL72 uses Dynamo to coordinate the prefill /
              decode split.
            </Box>
          </div>
          <div>
            <Box variant="h3">vLLM</Box>
            <Box variant="p">
              Open-source. Supports prefill / decode disaggregation via
              experimental flags; pairs with NixlConnector for KV cache
              handoff over NIXL. The most flexible OSS path for AWS-resident
              deployments.
            </Box>
          </div>
          <div>
            <Box variant="h3">SGLang</Box>
            <Box variant="p">
              Open-source. Has the most explicit disaggregated-serving
              support, with first-class options for KV cache routing, MoE
              all-to-all backend selection, and continuous batching across
              clusters
              ({' '}
              <Link external href="https://docs.sglang.ai/">
                SGLang docs
              </Link>
              , accessed 2026-04-23).
            </Box>
          </div>
          <div>
            <Box variant="h3">Trainium / Neuron</Box>
            <Box variant="p">
              Disaggregation on Trainium is in early production. The Neuron
              runtime supports cross-chip transports via CC-Cores, and KV
              cache transport between Trn2 nodes works over EFA. Customer
              deployments are starting to ship; reference architectures from
              AWS are emerging.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Generating multiple tokens per big-model pass"
          >
            Speculative decoding
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mechanism.</strong> A small &ldquo;draft&rdquo; model
            generates k candidate tokens cheaply. The big model runs once on
            those k candidates as a batch — verifying which prefix the big
            model agrees with. The accepted prefix is emitted; if all k were
            accepted the speedup is roughly k×. If only j &lt; k were accepted
            the remainder is rolled back and a new draft starts.
          </Box>
          <Box variant="p">
            <strong>Why it works on memory-bound silicon.</strong> Decode is
            memory-bound, which means most of the time is spent reading the
            big model&apos;s weights — which the big model has to read anyway
            for one token. Reading them once and verifying k tokens against
            them is essentially free compared to reading them k separate
            times. When the draft model&apos;s acceptance rate is high
            (typically 60-90% on common tasks), the speedup compounds.
          </Box>
          <ExpandableSection headerText="Speculative decoding in production stacks">
            <Box variant="p">
              vLLM and SGLang both ship speculative decoding. NVIDIA TensorRT-
              LLM supports it. Trainium adds support via NKI-authored draft
              kernels. The draft model is usually a smaller variant of the
              same family (Llama 3.2 1B drafting Llama 3.3 70B, for example)
              or a distilled draft head. Tree-based speculation extends the
              technique by speculating on multiple candidate continuations in
              parallel.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why these techniques compose with the rest of the stack"
          >
            How these compose
          </Header>
        }
      >
        <Box variant="p">
          Disaggregated serving and speculative decoding are not alternatives —
          they compose. A production stack might run prefill on FLOP-rich
          GPUs, decode on bandwidth-rich GPUs, with NVFP4 quantization, with
          MoE expert parallelism, with FlashAttention, with continuous
          batching, and with speculative decoding on top. Each layer changes
          the arithmetic intensity, the memory pressure, or the per-token
          wall-clock. The 2026 inference economy is built on stacking these
          layers, not on picking one.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
