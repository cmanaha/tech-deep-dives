import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const DOCS_HOME = vllmDocsUrl('');
const V1_GUIDE = vllmDocsUrl('usage/v1_guide/');
const RELEASES = 'https://github.com/vllm-project/vllm/releases';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';
const PLATFORMS = 'https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/platforms';
const PYTORCH_FOUNDATION =
  'https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html';
const DYNAMO_PIN = 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1/pyproject.toml#L61-L64';
const RAY_PIN = 'https://github.com/ray-project/ray/blob/ray-2.59.0/python/requirements/llm/llm-requirements.txt#L2';
const LLMD_RELEASE = 'https://github.com/llm-d/llm-d/releases/tag/v0.10.0';

export function ThesisAndFraming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What vLLM is, why memory and batching decide how many users one accelerator serves, and where the engine sits between your checkpoint and your clients (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            1. Thesis &amp; Framing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-m">
            vLLM is a <strong>high-throughput, memory-efficient inference and serving engine</strong> for
            large language models (LLMs): the runtime that turns a static set of model weights into a
            production HTTP endpoint that many concurrent users and agents can call at once. The project
            describes it as &quot;a fast and easy-to-use library for LLM inference and serving&quot;{' '}
            <Cite tier={1} href={DOCS_HOME}>
              vLLM docs: home page
            </Cite>
            .
          </Box>
          <Box variant="p">
            The central thesis an architect needs to internalize:{' '}
            <strong>
              LLM serving performance is dominated by memory and KV-cache (key/value cache) management
              and by request batching, rather than by raw FLOPs (floating-point operations)
            </strong>
            . Autoregressive decoding generates one token at a time, and each new token must attend to
            every prior token&apos;s cached key/value tensors. The hardware spends most of its time moving
            the weights and that growing cache between HBM (high-bandwidth memory) and the compute units,
            so the engine that wins is the one that packs the most useful work into each memory
            round-trip. For the underlying hardware roofline (why decode is memory-bandwidth-bound, and
            what that means for chip selection), see the sibling{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference deep dive
            </Link>
            . This deep dive picks up where that one leaves off: what a serving engine does <em>given</em>{' '}
            that constraint.
          </Box>
          <Box variant="p">
            vLLM&apos;s answer is a stack of memory- and scheduling-centric techniques: a{' '}
            <strong>paged KV cache</strong> that allocates KV memory in fixed-size blocks so it does not
            fragment (the idea the 2023 PagedAttention paper introduced), continuous batching so new
            requests join the running batch at every step, prefix caching to reuse shared prompts, and
            chunked prefill, all fronted by an <strong>OpenAI-compatible API server</strong> so existing
            client code points at it with only a base-URL change{' '}
            <Cite tier={1} href={DOCS_HOME}>
              vLLM docs: home page
            </Cite>
            . Those mechanisms get their own sections; here we only frame why they matter.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What vLLM owns between your checkpoint and your clients, and the one process in front of the engine you can swap"
          >
            Where vLLM Sits in the Stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM is the layer between <strong>model weights</strong> (a checkpoint on disk or in a model
            hub) and the <strong>applications and agents</strong> that consume tokens. It loads the
            weights, owns the GPU memory and the KV cache, schedules and batches requests, runs the
            forward passes, and exposes a network API. Following the arrows:
          </Box>
          <StackDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured.
          </Box>
          <Box variant="p">
            The API server runs as its own process in front of the engine, so it can be swapped without
            touching the engine: <code>vllm serve</code> starts the Python server by default, and with{' '}
            <code>VLLM_USE_RUST_FRONTEND=1</code> it starts the opt-in Rust frontend,{' '}
            <code>vllm-rs</code>, in its place and hands it the same engine addresses{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1441-L1443')}>
              envs.py L1441-L1443
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L344-L357')}>
              serve.py L344-L357
            </Cite>
            . Launch either one with <code>vllm serve</code>; the{' '}
            <code>python -m vllm.entrypoints.openai.api_server</code> launch is deprecated{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/openai/api_server.py', 'L50-L56')}>
              api_server.py L50-L56
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What is below vLLM</Box>
              <Box variant="p">
                The accelerator, its memory and bandwidth, and the model checkpoint. vLLM runs in-tree on
                NVIDIA, AMD and Intel GPUs and on CPUs; AWS Trainium and Inferentia, and Google TPUs
                (Tensor Processing Units), run through hardware plugins{' '}
                <Cite tier={1} href={PLATFORMS}>
                  vllm/platforms
                </Cite>{' '}
                (Section 21 covers the Neuron plugin). vLLM treats these as the substrate it must extract
                throughput from. The economics of that substrate live in the{' '}
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
            behind each box are walked file by file in <strong>Section 14, Inside the Codebase</strong>:
            the <code>LLM</code> entrypoint, <code>AsyncLLM</code> (older code imports it under its alias{' '}
            <code>AsyncLLMEngine</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/async_llm_engine.py', 'L4-L7')}>
              async_llm_engine.py L4-L7
            </Cite>
            ), the API server, and the <code>Worker</code> with the <code>GPUModelRunner</code> it
            drives, which is Model Runner V2 (MRv2) by default. The
            hardware and memory-bandwidth roofline lives in the{' '}
            <strong>Silicon, Memory &amp; Inference</strong> sibling deep dive. We cross-link rather than
            duplicate.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What running your own engine buys you: control of data and models, a lower cost per token, and fleet tooling you can carry across vendors"
          >
            Why an Architect Cares
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">Self-hosting control</Box>
            <Box variant="p">
              Run any open-weight model in your own VPC (virtual private cloud), on your own accelerators,
              with your own data never leaving the boundary. No per-token vendor pricing, no rate limits you
              do not set, no model deprecation imposed on your schedule. The OpenAI-compatible surface means
              migrating <em>off</em> a hosted API is largely a base-URL change.
            </Box>
            <Badge color="green">Data residency &amp; sovereignty</Badge>
          </div>
          <div>
            <Box variant="h3">Throughput economics</Box>
            <Box variant="p">
              GPU hours are the dominant cost of serving. Continuous batching and the paged KV cache raise
              the number of concurrent requests a single accelerator can serve, which directly lowers cost
              per million tokens. The framing thesis (memory and batching, not FLOPs) is what makes this
              lever exist.
            </Box>
            <Badge color="blue">Cost per token</Badge>
          </div>
          <div>
            <Box variant="h3">Open ecosystem</Box>
            <Box variant="p">
              Kubernetes stacks (llm-d, KServe, Production-Stack), an orchestrator (Ray Serve LLM) and an
              inference framework (NVIDIA Dynamo) all run vLLM as a serving engine (Sections 15 to 18).
              Standardizing on it keeps the surrounding tooling portable instead of locked to one
              vendor&apos;s runtime. Each orchestrator installs its own vLLM release: Dynamo 1.5.1 installs
              0.28.0{' '}
              <Cite tier={1} href={DYNAMO_PIN}>
                dynamo pyproject.toml L61-L64
              </Cite>
              , Ray 2.59.0 installs 0.27.0{' '}
              <Cite tier={1} href={RAY_PIN}>
                ray llm-requirements.txt L2
              </Cite>{' '}
              and llm-d 0.10.0 ships the v0.30.0 image{' '}
              <Cite tier={1} href={LLMD_RELEASE}>
                llm-d v0.10.0 release notes
              </Cite>
              , so check a flag from this dive against the version yours installs.
            </Box>
            <Badge color="grey">Portable tooling</Badge>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where vLLM came from, and the governance signal to weigh before you build a platform on it"
          >
            Origin &amp; Governance
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Where it came from</Box>
            <Box variant="p">
              vLLM was &quot;originally developed in the Sky Computing Lab at UC Berkeley&quot; and grew
              out of the PagedAttention research. The project describes itself as &quot;one of the most
              active open-source AI projects&quot;, with &quot;over 2000 contributors&quot;{' '}
              <Cite tier={1} href={DOCS_HOME}>
                vLLM docs: home page
              </Cite>
              .
            </Box>
          </div>
          <div>
            <Box variant="h3">Who governs it</Box>
            <Box variant="p">
              In May 2025 the project moved under neutral, foundation-level governance: the PyTorch
              Foundation welcomed vLLM as a hosted project, describing it as &quot;an open and efficient
              inference engine for large language models&quot;{' '}
              <Cite tier={2} href={PYTORCH_FOUNDATION}>
                PyTorch Foundation press release (PR Newswire), May 7 2025
              </Cite>
              . For an architect, foundation governance is a durability signal: a neutral foundation holds
              the project, which keeps its direction independent of any single company&apos;s roadmap.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to tell whether a blog post, a tutorial or a model's answer still describes the vLLM you run"
          >
            The Generation Shifts: V0 &rarr; V1, Then Model Runner V2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first thing to know before reading anything else about vLLM internals is that the engine
            was <strong>re-architected from V0 to V1</strong>. V0 &quot;successfully supported a wide range
            of models and hardware, but as new features were developed independently, the system grew
            increasingly complex.&quot; V1 re-works the core systems (&quot;the scheduler, KV cache manager,
            worker, sampler, and API server&quot;) into one cohesive framework, and{' '}
            <strong>V0 is fully deprecated</strong>{' '}
            <Cite tier={1} href={V1_GUIDE}>
              vLLM docs: V1 user guide
            </Cite>
            .
          </Box>
          <Box variant="p">
            The second shift sits inside V1. <strong>Model Runner V2</strong>, the GPU execution layer in
            each worker, has been the default for every model since v0.29.0, and the older V1 model runner
            is deprecated, with removal targeted for v0.32{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            . A v0.31.0 GPU server therefore runs the V1 engine with MRv2, and falls back to the V1 model
            runner, with a startup warning, in a few cases, mainly when a configuration uses a feature
            MRv2 lacks{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L700-L760')}>
              vllm.py L700-L760
            </Cite>
            . Both runners are classes named <code>GPUModelRunner</code>. MRv2 lives in{' '}
            <code>vllm/v1/worker/gpu/model_runner.py</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L184')}>
              gpu/model_runner.py L184
            </Cite>
            , so material that walks <code>vllm/v1/worker/gpu_model_runner.py</code> as the runner
            describes the deprecated one{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_model_runner.py', 'L479')}>
              gpu_model_runner.py L479
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Why the engine generation is the right frame for this deep dive">
            <SpaceBetween size="s">
              <Box variant="p">
                vLLM moves quickly: a minor release lands about every two weeks, nine of them from v0.23.0
                on 2026-06-15 to v0.31.0 on 2026-10-05{' '}
                <Cite tier={1} href={RELEASES}>
                  vLLM releases on GitHub
                </Cite>
                , so feature flags and benchmark numbers age fast. The stable thing to anchor on is the{' '}
                <em>architectural generation</em> and the runner inside it. Knowing whether a claim is
                about V0 or V1, and about the V1 model runner or MRv2, tells you whether it still applies.
              </Box>
              <Box variant="p">
                The V1 guide reports &quot;significant performance improvements from upgrading to V1 core
                engine, in particular for long context scenarios&quot;{' '}
                <Cite tier={1} href={V1_GUIDE}>
                  vLLM docs: V1 user guide
                </Cite>
                . This deep dive quotes no single speedup multiplier: the guide&apos;s performance
                benchmark is marked &quot;To be added&quot;, and the gain depends heavily on workload shape
                (context length, batch size, prefix sharing). Treat throughput numbers as workload-specific
                and measure on your own traffic; benchmarking is covered in{' '}
                <strong>Section 20, Observability &amp; Benchmarking</strong>.
              </Box>
              <Box variant="p">
                Because the codebase changes often, the <strong>Inside the Codebase</strong> section, like
                every code link in this dive, is pinned to the v0.31.0 release tag (commit{' '}
                <code>db9527a4</code>), so the file-and-class walkthrough stays falsifiable against a known
                tree rather than drifting with <code>main</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Alert type="warning">
            <strong>Read for V1 with MRv2.</strong> Older blog posts, tutorials and an LLM&apos;s training
            data may describe designs this dive does not: the V0 scheduler and KV-cache manager, the V1
            model runner, the CUDA PagedAttention kernels deleted in v0.25.0{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.25.0`}>
              vLLM v0.25.0 release notes
            </Cite>
            , or pinning <code>PYTHONHASHSEED</code> so prefix-cache hashes match across instances, which
            the default <code>sha256</code> hash no longer needs from v0.29.0 (the <code>xxhash</code>{' '}
            variants still do){' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/pull/51875">
              vLLM PR #51875
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L131-L144')} kind="code">
              kv_cache_utils.py L131-L144
            </Cite>
            . This deep dive describes vLLM v0.31.0, so check what your deployment runs with{' '}
            <code>vllm --version</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/main.py', 'L95-L97')}>
              main.py L95-L97
            </Cite>{' '}
            before you apply a flag or default from it. Then continue with{' '}
            <strong>Section 2, The Inference Workload</strong>, which sets up the workload the engine
            optimizes for, and <strong>Section 3, The V1 Engine Architecture</strong>.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

function StackDiagram() {
  const arrow = (
    <div aria-hidden="true" className="tsd-arrow">
      &rarr;
    </div>
  );
  return (
    <div className="tsd-wrap">
      <style>{`
        .tsd-wrap { container-type: inline-size; }
        .tsd-flow { display: flex; align-items: stretch; gap: 8px; padding: 8px; border-radius: 8px; background: #ffffff; color: #16191f; }
        .tsd-box { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: center; border: 1px solid #b6bec9; border-radius: 8px; padding: 10px 12px; background: #f4f6f9; text-align: center; }
        .tsd-vllm { background: #e9f0fb; border-color: #7aa7e0; }
        .tsd-lbl { font-weight: 700; font-size: 13px; color: #16191f; }
        .tsd-sub { font-size: 11px; color: #5f6b7a; }
        .tsd-arrow { flex: none; align-self: center; font-size: 20px; line-height: 1; color: #5f6b7a; }
        @container (max-width: 700px) {
          .tsd-flow { flex-direction: column; }
          .tsd-box { flex: none; }
          .tsd-arrow { transform: rotate(90deg); }
        }
      `}</style>
      <div className="tsd-flow" role="img" aria-labelledby="thesis-stack-title">
        <span id="thesis-stack-title" hidden>
          The serving stack, in order: model weights load into the vLLM engine, which holds the paged
          KV cache, the scheduler, batching and the forward pass. A separate OpenAI-compatible API
          server process, the default Python server or the opt-in Rust frontend, fronts the engine,
          and apps and agents call that server.
        </span>
        <div className="tsd-box">
          <div className="tsd-lbl">Model weights</div>
          <div className="tsd-sub">checkpoint on disk / hub</div>
        </div>
        {arrow}
        <div className="tsd-box tsd-vllm">
          <div className="tsd-lbl">vLLM engine</div>
          <div className="tsd-sub">paged KV cache, scheduler, batching, forward pass</div>
        </div>
        {arrow}
        <div className="tsd-box tsd-vllm">
          <div className="tsd-lbl">OpenAI-compatible server</div>
          <div className="tsd-sub">/v1/chat/completions, /v1/completions</div>
          <div className="tsd-sub">Python or Rust frontend</div>
        </div>
        {arrow}
        <div className="tsd-box">
          <div className="tsd-lbl">Apps &amp; agents</div>
          <div className="tsd-sub">RAG, agent frameworks, gateways</div>
        </div>
      </div>
    </div>
  );
}
