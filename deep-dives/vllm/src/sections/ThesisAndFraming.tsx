import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';

export function ThesisAndFraming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What vLLM is, the problem it solves, and where it sits in the serving stack"
          >
            1. Thesis &amp; Framing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            vLLM is a <strong>high-throughput, memory-efficient inference and serving engine</strong> for
            large language models: the runtime that turns a static set of model weights into a
            production HTTP endpoint that many concurrent users and agents can hit at once. Its own
            documentation describes it as{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/latest/"
            >
              &quot;a fast and easy-to-use library for LLM inference and serving&quot; (vLLM docs, accessed 2026-06-07)
            </Link>
            .
          </Box>
          <Box variant="p">
            The central thesis an architect needs to internalize:{' '}
            <strong>
              LLM serving performance is dominated by memory and KV-cache (key/value cache) management
              and request batching, not by raw FLOPs
            </strong>
            . Autoregressive decoding generates one token at a time, and each new token must attend to
            every prior token&apos;s cached key/value tensors. The hardware spends most of its time moving
            that growing cache between high-bandwidth memory and the compute units, so the engine that
            wins is the one that packs the most useful work into each memory round-trip, not the one with
            the most arithmetic throughput. For the underlying hardware roofline (why inference is
            memory-bandwidth-bound rather than compute-bound, and what that means for chip selection),
            see the sibling{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference deep dive
            </Link>
            . This deep dive picks up where that one leaves off: what a serving engine does <em>given</em>{' '}
            that constraint.
          </Box>
          <Box variant="p">
            vLLM&apos;s answer is a stack of memory- and scheduling-centric techniques. PagedAttention for
            non-fragmented KV-cache, continuous batching so the GPU never idles between requests, prefix
            caching to reuse shared prompts, and chunked prefill, all fronted by an{' '}
            <strong>OpenAI-compatible API server</strong> so existing client code points at it with only a
            base-URL change (
            <Link
              external
              href="https://docs.vllm.ai/en/latest/"
            >
              vLLM docs, accessed 2026-06-07
            </Link>
            ). Those mechanisms get their own sections; here we only frame why they matter.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2">Where vLLM Sits in the Stack</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM is the layer between <strong>model weights</strong> (a checkpoint on disk or in a model
            hub) and the <strong>applications and agents</strong> that consume tokens. It loads the
            weights, owns the GPU memory and the KV-cache, schedules and batches requests, runs the
            forward passes, and exposes a network API. Reading left to right:
          </Box>
          <StackDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What is below vLLM</Box>
              <Box variant="p">
                The accelerator (GPU, AWS Trainium/Inferentia, TPU), its memory and bandwidth, and the
                model checkpoint. vLLM treats these as the substrate it must extract throughput from. The
                economics of that substrate live in the{' '}
                <Link external href="../silicon-memory-inference/">
                  Silicon, Memory &amp; Inference
                </Link>{' '}
                deep dive.
              </Box>
            </div>
            <div>
              <Box variant="h3">What is above vLLM</Box>
              <Box variant="p">
                Application code, agent frameworks, RAG (retrieval-augmented generation) pipelines, and
                gateways, all speaking the OpenAI-compatible protocol (
                <code>/v1/chat/completions</code>, <code>/v1/completions</code>,{' '}
                <code>/v1/embeddings</code>). They neither know nor care how the cache is paged underneath.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <strong>Ownership boundary.</strong> This section is conceptual framing. The concrete classes
            that implement each box above (the <code>LLM</code> entrypoint, the{' '}
            <code>AsyncLLMEngine</code>, the OpenAI server entrypoint, the <code>Worker</code> and{' '}
            <code>ModelRunner</code> processes) are walked file-by-file in{' '}
            <strong>Section 14, Inside the Codebase</strong>. The hardware/memory-bandwidth roofline lives
            in the <strong>Silicon, Memory &amp; Inference</strong> sibling deep dive. We cross-link rather
            than duplicate.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Why an Architect Cares</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">Self-hosting control</Box>
            <Box variant="p">
              Run any open-weight model in your own VPC, on your own accelerators, with your own data
              never leaving the boundary. No per-token vendor pricing, no rate limits you do not set, no
              model deprecation imposed on your schedule. The OpenAI-compatible surface means migrating
              <em>off</em> a hosted API is largely a base-URL change.
            </Box>
            <Badge color="green">Data residency &amp; sovereignty</Badge>
          </div>
          <div>
            <Box variant="h3">Throughput economics</Box>
            <Box variant="p">
              GPU hours are the dominant cost of serving. Continuous batching and PagedAttention raise the
              number of concurrent requests a single accelerator can serve, which directly lowers cost per
              million tokens. The framing thesis (memory and batching, not FLOPs) is precisely what makes
              this lever exist.
            </Box>
            <Badge color="blue">Cost per token</Badge>
          </div>
          <div>
            <Box variant="h3">Open ecosystem</Box>
            <Box variant="p">
              vLLM is the de-facto serving substrate that Kubernetes operators (llm-d, KServe,
              Production-Stack), orchestrators (Ray Serve), and inference frameworks (NVIDIA Dynamo) build
              on. Standardizing on it keeps the surrounding tooling portable instead of locked to one
              vendor&apos;s runtime.
            </Box>
            <Badge color="grey">Portable tooling</Badge>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Origin &amp; Governance</Header>}>
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Where it came from</Box>
              <Box variant="p">
                vLLM was, in its own documentation&apos;s words,{' '}
                <Link external href="https://docs.vllm.ai/en/latest/">
                  &quot;originally developed in the Sky Computing Lab at UC Berkeley&quot; (vLLM docs,
                  accessed 2026-06-07)
                </Link>
                , growing out of the PagedAttention research before becoming one of the most active
                open-source AI projects.
              </Box>
            </div>
            <div>
              <Box variant="h3">Who governs it now</Box>
              <Box variant="p">
                In May 2025 the project moved under neutral, foundation-level governance: the{' '}
                <Link
                  external
                  href="https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html"
                >
                  PyTorch Foundation welcomed vLLM as a hosted project (PR Newswire, May 7 2025, accessed
                  2026-06-07)
                </Link>
                , describing it as &quot;an open and efficient inference engine for large language
                models.&quot; This matters to an architect: foundation governance is a durability signal.
                The project is not tied to a single company&apos;s roadmap.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Defining Recent Shift: V0 &rarr; V1</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The most important thing to know before reading anything else about vLLM internals is that the
            engine was <strong>re-architected from V0 to V1</strong>. Per the{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              official V1 guide (vLLM docs, accessed 2026-06-07)
            </Link>
            , V0 &quot;successfully supported a wide range of models and hardware, but as new features were
            developed independently, the system grew increasingly complex.&quot; V1 re-works the core
            systems (&quot;the scheduler, KV cache manager, worker, sampler, and API server&quot;) into a
            single cohesive framework, and{' '}
            <strong>V0 has been fully deprecated</strong> with V1 as the default engine.
          </Box>
          <Alert type="warning">
            <strong>Read V1, not V0.</strong> Any older blog post, tutorial, or LLM training cut-off that
            describes vLLM&apos;s scheduler or KV-cache manager may be describing the deprecated V0 design.
            This deep dive describes V1. The full re-architecture is covered in{' '}
            <strong>Section 3, The V1 Engine Architecture</strong>, and the inference workload it optimizes
            for is set up in <strong>Section 2, The Inference Workload</strong>.
          </Alert>
          <ExpandableSection headerText="Why the V0 → V1 split is the right framing for this deep dive">
            <SpaceBetween size="s">
              <Box variant="p">
                vLLM moves quickly: releases land on roughly a bi-weekly cadence, so specific feature
                flags and benchmark numbers age fast. The stable thing to anchor on is the{' '}
                <em>architectural generation</em>, not the point release. Knowing whether a claim is about
                V0 or V1 tells you whether it still applies.
              </Box>
              <Box variant="p">
                The V1 guide notes &quot;significant performance improvements from upgrading to V1 core
                engine, in particular for long context scenarios&quot; (
                <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
                  vLLM docs, accessed 2026-06-07
                </Link>
                ). We deliberately do not quote a single speedup multiplier here: the guide&apos;s own
                benchmark table is marked &quot;to be added,&quot; and the gain depends heavily on workload
                shape (context length, batch size, prefix-sharing). Treat throughput numbers as
                workload-specific and measure on your own traffic; benchmarking is covered in{' '}
                <strong>Section 20, Observability &amp; Benchmarking</strong>.
              </Box>
              <Box variant="p">
                Because the codebase changes often, the{' '}
                <strong>Inside the Codebase</strong> section is pinned to a specific commit so the
                file-and-class walkthrough stays falsifiable against a known tree, rather than drifting with
                <code>main</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

function StackDiagram() {
  const boxStyle: CSSProperties = {
    border: '1px solid #b6bec9',
    borderRadius: 8,
    padding: '10px 12px',
    background: '#f4f6f9',
    textAlign: 'center',
    minWidth: 0,
  };
  const labelStyle: CSSProperties = { fontWeight: 700, fontSize: 13 };
  const subStyle: CSSProperties = { fontSize: 11, color: '#5f6b7a' };
  const arrow = (
    <div aria-hidden="true" style={{ fontSize: 20, color: '#5f6b7a', lineHeight: 1, padding: '0 2px' }}>
      &rarr;
    </div>
  );
  return (
    <div
      role="img"
      aria-label="Stack: model weights flow into the vLLM engine, which exposes an OpenAI-compatible server consumed by apps and agents"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        flexWrap: 'wrap',
        padding: '4px 0',
      }}
    >
      <div style={boxStyle}>
        <div style={labelStyle}>Model weights</div>
        <div style={subStyle}>checkpoint on disk / hub</div>
      </div>
      {arrow}
      <div style={{ ...boxStyle, background: '#e9f0fb', borderColor: '#7aa7e0' }}>
        <div style={labelStyle}>vLLM engine</div>
        <div style={subStyle}>KV-cache, scheduler, batching, forward pass</div>
      </div>
      {arrow}
      <div style={{ ...boxStyle, background: '#e9f0fb', borderColor: '#7aa7e0' }}>
        <div style={labelStyle}>OpenAI-compatible server</div>
        <div style={subStyle}>/v1/chat/completions, /v1/completions</div>
      </div>
      {arrow}
      <div style={boxStyle}>
        <div style={labelStyle}>Apps &amp; agents</div>
        <div style={subStyle}>RAG, agent frameworks, gateways</div>
      </div>
    </div>
  );
}
