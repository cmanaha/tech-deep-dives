import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const BLOG = 'https://vllm.ai/blog/2025-01-27-v1-alpha-release';
const GUIDE = vllmDocsUrl('usage/v1_guide/');
const ARCH = vllmDocsUrl('design/arch_overview/');
const RELEASE_029 = 'https://github.com/vllm-project/vllm/releases/tag/v0.29.0';

interface RemovedRow {
  feature: string;
  v0: string;
  v1: ReactNode;
  impact: ReactNode;
}

const removedRows: RemovedRow[] = [
  {
    feature: 'best_of',
    v0: 'Sample N candidates per request, return the best by cumulative logprob.',
    v1: 'Removed entirely ("due to limited usage").',
    impact: (
      <>
        The field is ignored: the request returns HTTP 200 without best-of selection, and
        the server logs the unknown field only at DEBUG level{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/engine/protocol.py', 'L37-L76')}>
          protocol.py L37-L76
        </Cite>
        . Re-implement as N independent requests ranked in your gateway, or drop the
        feature.
      </>
    ),
  },
  {
    feature: 'Per-request logits processors',
    v0: 'Each request could carry its own Python logits-processor callable.',
    v1: (
      <>
        Removed. Logits processors are global, registered once at engine startup with{' '}
        <code>--logits-processors</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1019')}>
          arg_utils.py L1019
        </Cite>
        .
      </>
    ),
    impact:
      'Custom per-call logit shaping (for example a banned-token list per user) moves into a startup-registered processor, or into pre- and post-processing around the engine.',
  },
  {
    feature: 'GPU ↔ CPU KV-cache swapping',
    v0: "On preemption, a sequence's KV blocks were copied (swapped) to host RAM and back.",
    v1: (
      <>
        Removed. V1 &quot;no longer requires KV cache swapping to handle request
        preemptions&quot;. A preempted request is recomputed.{' '}
        <Cite tier={1} href={`${GUIDE}#kv-cache-features`}>
          vLLM docs: V1 user guide
        </Cite>
      </>
    ),
    impact: (
      <>
        Preemption costs a second prefill on the GPU instead of a host round-trip. A search
        of the v0.31.0 <code>vllm/</code> package finds no <code>swap_space</code> setting at
        all, so delete it from launch scripts and configs.
      </>
    ),
  },
  {
    feature: 'Request-level structured-output backend',
    v0: 'Each request could pick its own guided-decoding backend.',
    v1: (
      <>
        Removed. The server&apos;s <code>--structured-outputs-config.backend</code> decides.
        The default, <code>auto</code>, tries xgrammar for each request and falls back to
        guidance (or outlines) when xgrammar rejects the request{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L12-L25')}>
          structured_outputs.py L12-L25
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1297-L1341')}>
          sampling_params.py L1297-L1341
        </Cite>
        .
      </>
    ),
    impact: (
      <>
        The request fields carry no backend choice: the backend slot on the structured-output
        parameters is internal{' '}
        <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L88-L104')}>
          sampling_params.py L88-L104
        </Cite>
        , and the engine rejects one that differs from the server&apos;s with a validation
        error{' '}
        <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1165-L1181')}>
          sampling_params.py L1165-L1181
        </Cite>
        . The quiet case is older clients: the removed <code>guided_json</code>,{' '}
        <code>guided_regex</code>, <code>guided_choice</code>, <code>guided_grammar</code> and{' '}
        <code>guided_decoding_backend</code> fields are ignored, the request returns HTTP 200
        with unconstrained output, and the server logs a warning{' '}
        <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/engine/protocol.py', 'L21-L71')}>
          protocol.py L21-L71
        </Cite>
        . Move those clients to <code>structured_outputs</code> or{' '}
        <code>response_format</code>.
      </>
    ),
  },
];

function ProcessSplitDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 352"
        role="img"
        aria-labelledby="v1a-split-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="v1a-split-title">
          In the removed V0 engine, scheduling and input preparation ran before each GPU
          step, so the GPU waited on CPU work every step, and de-tokenization ran inside the
          engine process.
          The V1 engine moves HTTP, tokenization, multimodal input processing and
          de-tokenization into a frontend process that exchanges msgpack messages over ZMQ
          with a separate EngineCore process, which runs only the scheduler and the model
          executor, so frontend CPU work overlaps the GPU step. On one GPU the worker runs
          inside the EngineCore process; otherwise each GPU gets its own worker process, and
          the workers run Model Runner V2 by default.
        </title>
        <defs>
          <style>{`
            .v1a-lbl { font: 600 13px sans-serif; fill: #16191f; }
            .v1a-sub { font: 400 11px sans-serif; fill: #414d5c; }
            .v1a-ttl { font: 700 14px sans-serif; fill: #16191f; }
            .v1a-edge { font: 600 11px sans-serif; fill: #0972d3; text-anchor: middle; }
            .v1a-old { fill: #f2f3f3; stroke: #879596; stroke-width: 1.5; }
            .v1a-box { fill: #f2f8fd; stroke: #539fe5; stroke-width: 1.5; }
            .v1a-core { fill: #f0f7f0; stroke: #1d8102; stroke-width: 1.5; }
            .v1a-flow { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          `}</style>
          <marker
            id="v1a-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="760" height="352" rx="8" fill="#ffffff" />

        {/* V0 lane: removed code, drawn in neutral grey */}
        <text x="16" y="26" className="v1a-ttl">
          V0 (removed): CPU work on the engine&apos;s critical path
        </text>
        <rect x="16" y="40" width="150" height="46" rx="6" className="v1a-old" />
        <text x="91" y="59" textAnchor="middle" className="v1a-lbl">
          scheduler
        </text>
        <text x="91" y="76" textAnchor="middle" className="v1a-sub">
          prefill vs decode
        </text>
        <line x1="166" y1="63" x2="196" y2="63" className="v1a-flow" markerEnd="url(#v1a-arrow)" />
        <rect x="198" y="40" width="150" height="46" rx="6" className="v1a-old" />
        <text x="273" y="59" textAnchor="middle" className="v1a-lbl">
          prepare inputs
        </text>
        <text x="273" y="76" textAnchor="middle" className="v1a-sub">
          CPU, before the step
        </text>
        <line x1="348" y1="63" x2="378" y2="63" className="v1a-flow" markerEnd="url(#v1a-arrow)" />
        <rect x="380" y="40" width="150" height="46" rx="6" className="v1a-old" />
        <text x="455" y="59" textAnchor="middle" className="v1a-lbl">
          GPU step
        </text>
        <text x="455" y="76" textAnchor="middle" className="v1a-sub">
          waits on CPU
        </text>
        <line x1="530" y1="63" x2="560" y2="63" className="v1a-flow" markerEnd="url(#v1a-arrow)" />
        <rect x="562" y="40" width="182" height="46" rx="6" className="v1a-old" />
        <text x="653" y="59" textAnchor="middle" className="v1a-lbl">
          de-tokenize
        </text>
        <text x="653" y="76" textAnchor="middle" className="v1a-sub">
          in the engine process
        </text>

        <line x1="16" y1="108" x2="744" y2="108" stroke="#d1d5db" strokeDasharray="5 4" />

        {/* V1 lane */}
        <text x="16" y="136" className="v1a-ttl">
          V1: frontend and EngineCore processes overlap
        </text>

        {/* Frontend process */}
        <rect x="16" y="150" width="320" height="186" rx="8" className="v1a-box" />
        <text x="30" y="172" className="v1a-lbl">
          Frontend process
        </text>
        <rect x="30" y="184" width="140" height="40" rx="6" className="v1a-box" />
        <text x="100" y="208" textAnchor="middle" className="v1a-sub">
          HTTP + tokenize
        </text>
        <rect x="182" y="184" width="140" height="40" rx="6" className="v1a-box" />
        <text x="252" y="208" textAnchor="middle" className="v1a-sub">
          de-tokenize + stream
        </text>
        <rect x="30" y="238" width="292" height="84" rx="6" className="v1a-box" />
        <text x="176" y="275" textAnchor="middle" className="v1a-sub">
          multimodal input processing
        </text>
        <text x="176" y="292" textAnchor="middle" className="v1a-sub">
          (all of it overlaps the GPU step)
        </text>

        {/* Frontend to EngineCore link */}
        <line x1="338" y1="226" x2="420" y2="226" className="v1a-flow" markerEnd="url(#v1a-arrow)" />
        <line x1="422" y1="240" x2="340" y2="240" className="v1a-flow" markerEnd="url(#v1a-arrow)" />
        <text x="380" y="214" className="v1a-edge">
          ZMQ
        </text>
        <text x="380" y="258" className="v1a-edge">
          msgpack
        </text>

        {/* EngineCore process */}
        <rect x="424" y="150" width="320" height="186" rx="8" className="v1a-core" />
        <text x="438" y="172" className="v1a-lbl">
          EngineCore process
        </text>
        <rect x="438" y="184" width="292" height="40" rx="6" className="v1a-core" />
        <text x="584" y="208" textAnchor="middle" className="v1a-sub">
          unified scheduler (token budget)
        </text>
        <rect x="438" y="238" width="292" height="84" rx="6" className="v1a-core" />
        <text x="584" y="258" textAnchor="middle" className="v1a-sub">
          model executor → GPU worker(s)
        </text>
        <text x="584" y="274" textAnchor="middle" className="v1a-sub">
          worker in-process on 1 GPU;
        </text>
        <text x="584" y="290" textAnchor="middle" className="v1a-sub">
          one process per GPU otherwise
        </text>
        <text x="584" y="308" textAnchor="middle" className="v1a-sub">
          workers run Model Runner V2 by default
        </text>
      </svg>
    </div>
  );
}

export function V1Architecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What the V1 engine changes for an operator: which process does what, which defaults to leave on, and which V0 request features to remove before an upgrade (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            3. The V1 Engine Architecture
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The challenge V1 meets:</strong> GPUs kept getting faster, so model
            execution time shrank, and the CPU work wrapped around each step (running the
            HTTP server, scheduling, preparing inputs, de-tokenizing, streaming responses)
            became a first-order bottleneck. In V0 most of that work sat on the same
            critical path as the GPU step, so a fast GPU spent a growing fraction of every
            iteration waiting on Python. The second motivation was accumulated{' '}
            <strong>technical debt</strong> in the original design.{' '}
            <Cite tier={2} href={BLOG}>
              vLLM blog: V1 alpha release, 2025-01-27
            </Cite>
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> a re-architected core with two structural changes.
            First, a <strong>unified scheduler</strong> that treats prompt (prefill) and
            generated (decode) tokens the same way and hands out a per-request token budget
            each step. Second, a <strong>multi-process design</strong> that isolates the
            engine loop (scheduler and model executor) from the API and tokenization
            frontend, so CPU-heavy work overlaps the GPU step instead of stalling it. The
            project&apos;s launch post reports <strong>up to 1.7x higher throughput</strong>{' '}
            than V0 running without multi-step scheduling, and attributes it to
            &quot;comprehensive CPU overhead reductions across the entire stack.&quot; The
            figure comes from the project&apos;s own benchmarks.{' '}
            <Cite tier={2} href={BLOG}>
              vLLM blog: V1 alpha release (project claim)
            </Cite>
          </Box>
          <Alert type="info">
            <strong>V1 is the engine every current vLLM runs.</strong> It shipped as alpha
            in January 2025 and became the default, and the V1 user guide states &quot;We
            have fully deprecated V0.&quot;{' '}
            <Cite tier={1} href={GUIDE}>
              vLLM docs: V1 user guide
            </Cite>{' '}
            The code goes further: <code>vllm.engine.LLMEngine</code> is a seven-line alias
            for the V1 engine{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/llm_engine.py', 'L1-L7')}>
              llm_engine.py L1-L7
            </Cite>
            , and a search of <code>vllm/envs.py</code> at v0.31.0 finds no{' '}
            <code>VLLM_USE_V1</code> switch. The operator&apos;s question is which V0
            behaviors a deployment still depends on.
          </Alert>
          <Box variant="p">
            <strong>Two version numbers, two axes.</strong> &quot;V1&quot; names the
            engine&apos;s architecture: the frontend and EngineCore process split and the
            unified scheduler. Model Runner V2 (MRv2) names the GPU execution layer inside
            each worker of that V1 engine, and it has been the default runner for every
            model since v0.29.0{' '}
            <Cite tier={1} href={RELEASE_029}>
              vLLM v0.29.0 release notes
            </Cite>
            . A v0.31.0 GPU server therefore runs the V1 engine with MRv2. It falls back to
            the older V1 model runner, logging a warning, in a few cases, mainly when the
            configuration uses a feature MRv2 lacks{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L700-L760')}>
              vllm.py L700-L760
            </Cite>
            ; that runner is deprecated, with removal targeted for v0.32{' '}
            <Cite tier={1} href={RELEASE_029}>
              vLLM v0.29.0 release notes
            </Cite>
            . Which features
            force the fallback is covered in{' '}
            <strong>Inside the Codebase &rarr; Execution &amp; Attention</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the CPU work lives, and how many processes a server runs, which is what you size CPU cores against"
          >
            V0 vs V1 at a glance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The contrast below shows where the work lives. In V0, scheduling and input
            preparation ran in series with each GPU step, and de-tokenization ran inside the
            engine process. In V1 the frontend (HTTP, tokenization, multimodal input processing,
            de-tokenization, streaming) runs in its own process and talks to an isolated{' '}
            <code>EngineCore</code> loop over ZeroMQ (ZMQ) sockets{' '}
            <Cite tier={1} href={`${ARCH}#api-server-process`}>
              vLLM docs: API server process
            </Cite>
            , in msgpack (MessagePack) messages{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L705-L706')}>
              core_client.py L705-L706
            </Cite>
            , so frontend CPU work and the GPU step proceed concurrently.
          </Box>

          <ProcessSplitDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured.
          </Box>

          <Box variant="p">
            <strong>How many processes a server runs.</strong> One API server process, which
            by default becomes one per data-parallel (DP) rank and can be set with{' '}
            <code>--api-server-count</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L105-L128')}>
              serve.py L105-L128
            </Cite>
            ; one EngineCore process per DP rank; and one worker process per GPU, as the
            architecture overview documents it{' '}
            <Cite tier={1} href={`${ARCH}#gpu-worker-processes`} kind="doc-code-conflict">
              vLLM docs: GPU worker processes
            </Cite>
            . The code departs from that rule on a single GPU with no data parallelism: the
            executor backend resolves to <code>uni</code> and the worker runs inside the
            EngineCore process, so the server is two processes{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/parallel.py', 'L989-L1034')} kind="code">
              parallel.py L989-L1034
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/executor/uniproc_executor.py', 'L51-L75')} kind="code">
              uniproc_executor.py L51-L75
            </Cite>
            . With DP above 1, a DP coordinator process manages load balancing across the
            DP ranks{' '}
            <Cite tier={1} href={`${ARCH}#dp-coordinator-process-conditional`}>
              vLLM docs: DP coordinator process
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/coordinator.py', 'L23-L57')}>
              coordinator.py L23-L57
            </Cite>
            . A tensor-parallel (TP) server on four GPUs (<code>vllm serve -tp=4</code>) runs
            six processes{' '}
            <Cite tier={1} href={`${ARCH}#process-count-summary`}>
              vLLM docs: process count summary
            </Cite>
            . An opt-in Rust binary can take the Python API server&apos;s place (
            <code>VLLM_USE_RUST_FRONTEND=1</code>, off by default){' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1441-L1443')}>
              envs.py L1441-L1443
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L344-L357')}>
              serve.py L344-L357
            </Cite>
            ; <strong>Inside the Codebase &rarr; The Rust Frontend</strong> covers it.
          </Box>

          <Alert type="info">
            The client classes the frontend picks between (<code>InprocClient</code>,{' '}
            <code>SyncMPClient</code>, <code>AsyncMPClient</code>, the DP variants){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L95-L165')}>
              core_client.py L95-L165
            </Cite>
            , the ZMQ socket wiring and the shared-memory broadcast to workers are walked
            through in{' '}
            <strong>Inside the Codebase &rarr; Architecture &amp; Module Map</strong>.
          </Alert>

          <ExpandableSection headerText="Why a multi-process design pays off">
            <SpaceBetween size="s">
              <Box variant="p">
                As &quot;GPUs are getting faster and significantly reducing model execution
                times, the CPU overhead for tasks like running the API server, scheduling
                work, preparing inputs, de-tokenizing outputs, and streaming responses to
                users becomes increasingly pronounced.&quot; If that CPU work shares the
                engine&apos;s critical path, a faster GPU just spends a larger fraction of
                each step idle.{' '}
                <Cite tier={2} href={BLOG}>
                  vLLM blog: V1 alpha release
                </Cite>
              </Box>
              <Box variant="p">
                V1 isolates an <code>EngineCore</code> execution loop that &quot;focuses
                exclusively on the scheduler and model executor,&quot; which lets
                tokenization, multimodal input processing, de-tokenization and request
                streaming overlap the core execution loop. The split builds on the
                multiprocessing API server that v0.6.0 introduced, which already used ZeroMQ
                between the API server and the engine, and carries that design deeper into
                the async engine.{' '}
                <Cite tier={2} href={BLOG}>
                  vLLM blog: V1 alpha release
                </Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why chunked prefill, prefix caching and speculative decoding compose in one flow, and the one request type that skips the prefix cache"
          >
            The unified scheduler
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>How it schedules:</strong> V0 carried an explicit prefill-vs-decode split
            in the scheduler, with chunked prefill bolted on conditionally. V1 treats both
            kinds of token the same way. A scheduling decision is &quot;a simple dictionary
            (e.g., <code>{'{request_id: num_tokens}'}</code>)&quot;: the scheduler decides how
            many tokens to process for each active request this step, whether those tokens
            are prompt or freshly generated.{' '}
            <Cite tier={1} href={`${GUIDE}#feature-support`}>
              vLLM docs: V1 user guide, feature support
            </Cite>
          </Box>
          <Box variant="p">
            <strong>Why it matters operationally:</strong> three features that were
            separate, sometimes mutually awkward code paths in V0 (
            <strong>chunked prefill</strong>, <strong>prefix caching</strong>, and{' '}
            <strong>speculative decoding</strong>) compose in one flow, because each is a
            question of how many tokens a request gets this step. A long prompt can be
            chunked across steps while short decodes from other requests ride along in the
            same batch, and cached prefixes simply reduce the token count a request needs.{' '}
            <Cite tier={1} href={`${GUIDE}#feature-support`}>
              vLLM docs: V1 user guide, feature support
            </Cite>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Fewer knobs to get wrong</Box>
              <Box variant="p">
                Chunked prefill is &quot;enabled by default whenever possible, unlike in V0
                where it was conditionally enabled based on model characteristics.&quot; You
                stop hand-tuning whether to enable it per model.{' '}
                <Cite tier={1} href={`${GUIDE}#chunked-prefill`}>
                  vLLM docs: V1 user guide, chunked prefill
                </Cite>
              </Box>
            </div>
            <div>
              <Box variant="h3">Prefix caching on by default</Box>
              <Box variant="p">
                <code>enable_prefix_caching</code> defaults to true{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
                  cache.py L142
                </Cite>
                . The project reports &quot;near-zero performance degradation, even when
                the cache hit rate is 0%&quot; for the V1 design, measured in its own
                experiments as a throughput loss under 1%{' '}
                <Cite tier={2} href={BLOG}>
                  vLLM blog: V1 alpha release (project claim)
                </Cite>
                . If that holds for your workload, the old cost-benefit calculation (enable
                caching only if you expect hits) goes away.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>One sharp edge:</strong> a request that asks for prompt logprobs skips
            the prefix-cache read and recomputes the prefill of the full prompt{' '}
            <Cite tier={1} href={`${GUIDE}#prompt-logprobs-with-prefix-caching`}>
              vLLM docs: V1 user guide, prompt logprobs
            </Cite>
            . In code, <code>skip_reading_prefix_cache</code> defaults to true whenever{' '}
            <code>prompt_logprobs</code> is set{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L559-L566')}>
              sampling_params.py L559-L566
            </Cite>
            , and the key-value (KV) cache manager then skips the lookup and leaves the
            request out of the prefix-cache statistics{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L248-L262')}>
              kv_cache_manager.py L248-L262
            </Cite>
            . Python API callers can also set the field per request{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L360')}>
              sampling_params.py L360
            </Cite>
            . If you serve prompt logprobs at volume, those requests get no cache benefit,
            and the hit-rate metrics say nothing about them.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The four V0 features V1 removed, how each one fails on upgrade, and what to change in clients and launch scripts"
          >
            Features removed or changed: the operator&apos;s checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The V1 guide grades every feature as <Badge color="green">Functional</Badge>{' '}
            <Badge color="blue">In progress</Badge> <Badge color="red">Removed</Badge>, and
            lists four under Removed Features{' '}
            <Cite tier={1} href={`${GUIDE}#removed-features`}>
              vLLM docs: V1 user guide, removed features
            </Cite>
            . The ones to hunt for before an upgrade are request fields the V1 server does not
            recognize: it accepts the request, ignores the field and returns HTTP 200 without the
            behavior. <code>best_of</code> and the legacy <code>guided_*</code> fields fail
            this way.
          </Box>
          <Table
            items={removedRows}
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'feature',
                header: 'Feature',
                cell: (r) => <code>{r.feature}</code>,
                minWidth: 160,
              },
              { id: 'v0', header: 'V0 behavior', cell: (r) => r.v0, minWidth: 220 },
              { id: 'v1', header: 'V1 status', cell: (r) => r.v1, minWidth: 220 },
              { id: 'impact', header: 'What you do about it', cell: (r) => r.impact, minWidth: 280 },
            ]}
          />
          <Alert type="warning">
            <strong>Preemption always recomputes.</strong> V1 &quot;no longer requires KV
            cache swapping to handle request preemptions&quot;{' '}
            <Cite tier={1} href={`${GUIDE}#kv-cache-features`}>
              vLLM docs: V1 user guide, KV cache features
            </Cite>
            : a preempted request frees its KV blocks and starts its prefill again when it
            is re-admitted{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1538-L1560')}>
              scheduler.py L1538-L1560
            </Cite>
            , which costs GPU compute rather than host-copy bandwidth. Watch the
            &quot;Preemptions:&quot; field of the stats log and the{' '}
            <code>vllm:num_preemptions</code> counter{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L295-L297')}>
              loggers.py L295-L297
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L676-L680')}>
              loggers.py L676-L680
            </Cite>
            : latency bumps, not host-memory growth, are the symptom of an over-subscribed
            KV cache. A re-admitted request gets a fresh prefix-cache lookup, so its blocks
            that were not evicted in the meantime count as hits, and with a KV offloading
            connector it can load its prefix back from the offload tier as an external cache
            hit{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L929-L952')}>
              scheduler.py L929-L952
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three checks that follow from the architecture: what to leave alone, what to budget, and what to search client traffic for"
          >
            Before you upgrade or size a node
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">Leave the defaults on</Box>
            <Box variant="p">
              Chunked prefill and prefix caching are on by default and compose in one
              scheduler, so there are fewer per-model flags to get right; the defaults are
              the tuned path.
            </Box>
          </div>
          <div>
            <Box variant="h3">Budget memory and CPU</Box>
            <Box variant="p">
              CUDA graph capture &quot;takes up more memory in V1 than in V0&quot;{' '}
              <Cite tier={1} href={`${GUIDE}#cuda-graphs`}>
                vLLM docs: V1 user guide, CUDA graphs
              </Cite>
              , so leave headroom when carrying a memory budget over from V0. Size CPU cores
              against the process count: two processes on one GPU, six for a{' '}
              <code>-tp=4</code> server.
            </Box>
          </div>
          <div>
            <Box variant="h3">Search client traffic</Box>
            <Box variant="p">
              Find clients that still send <code>best_of</code> or the{' '}
              <code>guided_*</code> fields, because both come back HTTP 200 without the
              behavior. On a running server, search the log for &quot;output will NOT be
              constrained&quot;, the warning the <code>guided_*</code> fields trigger.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
