import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

interface RemovedRow {
  feature: string;
  v0: string;
  v1: string;
  impact: string;
}

const removedRows: RemovedRow[] = [
  {
    feature: 'best_of',
    v0: 'Sample N candidates per request, return the best by cumulative logprob.',
    v1: 'Removed entirely ("due to limited usage").',
    impact:
      'Any client passing best_of breaks. Re-implement as N independent requests in your gateway, or drop the feature. There is no server-side equivalent.',
  },
  {
    feature: 'Per-request logits processors',
    v0: 'Each request could carry its own Python logits-processor callable.',
    v1: 'Removed. Logits processors are now global, configured once at engine startup.',
    impact:
      'Custom per-call logit shaping (e.g. dynamic banned-token lists per user) no longer works through the sampling params. Move the logic into a startup-registered processor, or pre/post-process around the engine.',
  },
  {
    feature: 'GPU ↔ CPU KV-cache swapping',
    v0: 'On preemption, a sequence’s KV blocks were copied (swapped) to host RAM and back.',
    v1: 'Removed. V1 "no longer requires KV cache swapping to handle request preemptions" — preempted requests are recomputed instead.',
    impact:
      'swap_space tuning is moot for this path. Preemption cost shifts from PCIe copy bandwidth to recompute FLOPs. Under heavy memory pressure you pay a prefill again, not a host round-trip — a different, usually cheaper, failure mode.',
  },
  {
    feature: 'Request-level structured-output backend',
    v0: 'Each request could pick its own guided-decoding backend.',
    v1: 'Removed. The structured-output backend is selected globally at startup.',
    impact:
      'You can no longer mix grammar backends per request. Pick one backend (e.g. xgrammar) for the whole server. Guided decoding itself remains functional.',
  },
];

export function V1Architecture() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A ground-up rewrite of the serving core that an operator feels as fewer knobs, defaults that just work, and a new set of failure modes."
          >
            3. The V1 Engine Architecture
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem V1 solves:</strong> GPUs kept getting faster, so model
            execution time shrank — and the CPU work wrapped around each step (running the
            HTTP server, scheduling, building input tensors, de-tokenizing, streaming
            responses) became a first-order bottleneck. In V0 that work sat in the same
            process and largely the same critical path as the GPU step, so a fast GPU spent
            an increasing fraction of every iteration waiting on Python. The vLLM team also
            named the second motivation plainly: accumulated{' '}
            <strong>technical debt</strong> in the original design.{' '}
            <Link
              external
              href="https://vllm.ai/blog/2025-01-27-v1-alpha-release"
            >
              vLLM V1 alpha blog, 2025-01-27 (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> a re-architected core with two structural changes.
            First, a <strong>unified scheduler</strong> that stops distinguishing prompt
            (prefill) tokens from generated (decode) tokens — it just hands out a
            per-request token budget each step. Second, a <strong>multi-process design</strong>{' '}
            that isolates the engine loop (scheduler + model executor) from the API and
            tokenization frontend, so CPU-heavy work overlaps the GPU step instead of
            stalling it. The headline result the project reports is{' '}
            <strong>up to 1.7x higher throughput</strong> versus V0, driven by{' '}
            &ldquo;comprehensive CPU overhead reductions across the entire stack.&rdquo;{' '}
            <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
              vLLM V1 alpha blog (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            <strong>This is not a flag you turn on — it is the engine.</strong> V1 shipped
            as alpha in January 2025, became the default, and as of the current{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              V1 user guide (accessed 2026-06-07)
            </Link>{' '}
            the docs state &ldquo;We have fully deprecated V0.&rdquo; If you are running a
            recent vLLM, you are running V1. The operational question is no longer{' '}
            <em>whether</em> to adopt it but which V0 behaviors your deployment quietly
            depended on.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">V0 vs V1 at a glance</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The contrast below is conceptual — it shows <em>where the work lives</em>, not
            the class names. In V0 the API server, tokenization, scheduling, the GPU step,
            and de-tokenization were effectively serialized around one busy process. In V1
            the frontend (HTTP + tokenize + de-tokenize + stream) runs in its own process and
            talks to an isolated <code>EngineCore</code> loop, so frontend CPU work and the
            GPU step proceed concurrently.
          </Box>

          <Box textAlign="center">
            <svg
              viewBox="0 0 720 360"
              width="100%"
              style={{ maxWidth: 720, height: 'auto' }}
              role="img"
              aria-label="Conceptual contrast of vLLM V0 single-process pipeline versus V1 frontend and EngineCore split"
            >
              <style>
                {
                  '.lbl{font:600 13px sans-serif;fill:#16191f}.sub{font:400 11px sans-serif;fill:#414d5c}.box{fill:#f2f8fd;stroke:#539fe5;stroke-width:1.5}.corebox{fill:#f0f7f0;stroke:#1d8102;stroke-width:1.5}.title{font:700 14px sans-serif;fill:#16191f}.flow{stroke:#879596;stroke-width:1.5;fill:none}'
                }
              </style>
              <defs>
                <marker
                  id="v1arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#879596" />
                </marker>
              </defs>

              {/* V0 lane */}
              <text x="12" y="24" className="title">
                V0: one process, serialized
              </text>
              <rect x="12" y="36" width="120" height="44" rx="6" className="box" />
              <text x="72" y="56" textAnchor="middle" className="lbl">
                API + tokenize
              </text>
              <text x="72" y="71" textAnchor="middle" className="sub">
                same process
              </text>
              <line x1="132" y1="58" x2="160" y2="58" className="flow" markerEnd="url(#v1arrow)" />
              <rect x="160" y="36" width="120" height="44" rx="6" className="box" />
              <text x="220" y="56" textAnchor="middle" className="lbl">
                scheduler
              </text>
              <text x="220" y="71" textAnchor="middle" className="sub">
                prefill vs decode
              </text>
              <line x1="280" y1="58" x2="308" y2="58" className="flow" markerEnd="url(#v1arrow)" />
              <rect x="308" y="36" width="120" height="44" rx="6" className="box" />
              <text x="368" y="56" textAnchor="middle" className="lbl">
                GPU step
              </text>
              <text x="368" y="71" textAnchor="middle" className="sub">
                waits on CPU
              </text>
              <line x1="428" y1="58" x2="456" y2="58" className="flow" markerEnd="url(#v1arrow)" />
              <rect x="456" y="36" width="140" height="44" rx="6" className="box" />
              <text x="526" y="56" textAnchor="middle" className="lbl">
                de-tokenize + stream
              </text>
              <text x="526" y="71" textAnchor="middle" className="sub">
                blocks next step
              </text>

              {/* V1 lane */}
              <text x="12" y="150" className="title">
                V1: frontend process ∥ EngineCore process
              </text>

              {/* Frontend process box */}
              <rect x="12" y="166" width="320" height="150" rx="8" className="box" />
              <text x="24" y="186" className="lbl">
                Frontend process
              </text>
              <rect x="28" y="198" width="130" height="40" rx="6" className="box" />
              <text x="93" y="222" textAnchor="middle" className="sub">
                HTTP + tokenize
              </text>
              <rect x="180" y="198" width="130" height="40" rx="6" className="box" />
              <text x="245" y="222" textAnchor="middle" className="sub">
                de-tokenize + stream
              </text>
              <rect x="28" y="252" width="282" height="46" rx="6" className="box" />
              <text x="169" y="272" textAnchor="middle" className="sub">
                multimodal input processing
              </text>
              <text x="169" y="288" textAnchor="middle" className="sub">
                (all overlaps the GPU step)
              </text>

              {/* IPC link */}
              <line
                x1="332"
                y1="240"
                x2="392"
                y2="240"
                className="flow"
                markerEnd="url(#v1arrow)"
              />
              <line
                x1="392"
                y1="252"
                x2="332"
                y2="252"
                className="flow"
                markerEnd="url(#v1arrow)"
              />
              <text x="362" y="232" textAnchor="middle" className="sub">
                IPC
              </text>

              {/* EngineCore process box */}
              <rect x="392" y="166" width="316" height="150" rx="8" className="corebox" />
              <text x="404" y="186" className="lbl">
                EngineCore process
              </text>
              <rect x="408" y="198" width="284" height="40" rx="6" className="corebox" />
              <text x="550" y="222" textAnchor="middle" className="sub">
                unified scheduler (token budget)
              </text>
              <rect x="408" y="252" width="284" height="46" rx="6" className="corebox" />
              <text x="550" y="272" textAnchor="middle" className="sub">
                model executor → GPU worker(s)
              </text>
              <text x="550" y="288" textAnchor="middle" className="sub">
                tight, CPU-light loop
              </text>
            </svg>
          </Box>
          <Box variant="small" textAlign="center">
            Conceptual diagram. The isolated <code>EngineCore</code> loop &ldquo;focuses
            exclusively on the scheduler and model executor,&rdquo; allowing overlap of
            tokenization, multimodal processing, de-tokenization, and streaming with the
            core loop. Frontend↔core transport is ZeroMQ-based IPC, extending the
            multiprocessing API server introduced in v0.6.0.{' '}
            <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
              vLLM V1 alpha blog (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            The exact process/client classes (<code>InprocClient</code>,{' '}
            <code>SyncMPClient</code>, <code>AsyncMPClient</code>, the DP variants) and the
            ZMQ socket wiring are documented against the real source in the{' '}
            <strong>Inside the Codebase → Architecture &amp; Module Map</strong> tab. This
            section deliberately stays at the operational level; that tab has the call paths.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The unified scheduler</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What changed:</strong> V0 carried an explicit prefill-vs-decode split in
            the scheduler, with chunked prefill bolted on conditionally. V1 removes the
            distinction. A scheduling decision is now just &ldquo;a simple dictionary, e.g.{' '}
            <code>{'{request_id: num_tokens}'}</code>&rdquo; — the scheduler decides how
            many tokens to process for each active request this step, whether those tokens
            are prompt or freshly generated.{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              V1 user guide (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            <strong>Why it matters operationally:</strong> three features that were separate,
            sometimes mutually awkward code paths in V0 —{' '}
            <strong>chunked prefill</strong>, <strong>prefix caching</strong>, and{' '}
            <strong>speculative decoding</strong> — now compose naturally in one flow,
            because they are all just &ldquo;how many tokens does this request get this
            step.&rdquo; A long prompt can be chunked across steps while short decodes from
            other requests ride along in the same batch, and cached prefixes simply reduce
            the token count a request needs. The vLLM docs cite exactly these features as
            what the dictionary representation enables.{' '}
            <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
              vLLM V1 alpha blog (accessed 2026-06-07)
            </Link>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Fewer knobs to get wrong</Box>
              <Box variant="p">
                Chunked prefill is now &ldquo;enabled by default whenever possible, unlike in
                V0 where it was conditionally enabled based on model characteristics.&rdquo;
                You stop hand-tuning whether to enable it per model.{' '}
                <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
                  V1 user guide (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
            <div>
              <Box variant="h3">Prefix caching on by default</Box>
              <Box variant="p">
                V1 redesigned prefix caching for &ldquo;near-zero performance degradation,
                even when the cache hit rate is 0%,&rdquo; so it is now on by default. The old
                cost-benefit calculation — enable caching only if you expect hits — goes
                away.{' '}
                <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
                  vLLM V1 alpha blog (accessed 2026-06-07)
                </Link>
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>One sharp edge:</strong> the V1 guide notes that when prefix caching is
            combined with prompt-logprobs requests, &ldquo;the engine will ignore the prefix
            cache and recompute the prefill of full prompt.&rdquo; If you serve prompt
            logprobs at volume, that cache you assumed was helping is silently bypassed for
            those requests.{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              V1 user guide (accessed 2026-06-07)
            </Link>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Features removed or changed — the operator&apos;s checklist</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The V1 guide grades every feature into{' '}
            <Badge color="green">🟢 Functional</Badge>{' '}
            <Badge color="blue">🟡 In progress</Badge>{' '}
            <Badge color="red">🔴 Removed</Badge>. The Removed list is the one that
            silently breaks deployments on upgrade, because the API still accepts the request
            — the behavior just isn&apos;t there anymore. These are the four the guide
            lists under Removed Features.{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              V1 user guide (accessed 2026-06-07)
            </Link>
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
            <strong>The recompute-vs-swap change is the subtle one.</strong> V0 absorbed
            memory pressure by swapping KV blocks to host RAM; V1 &ldquo;no longer requires
            KV cache swapping to handle request preemptions.&rdquo; The new failure mode under
            pressure is a re-prefill (recompute), which consumes GPU compute rather than PCIe
            bandwidth. Practically: stop reasoning about <code>swap_space</code> for
            preemption, and watch for recompute spikes (latency bumps, not host-memory growth)
            when you over-subscribe KV cache.{' '}
            <Link external href="https://docs.vllm.ai/en/stable/usage/v1_guide/">
              V1 user guide (accessed 2026-06-07)
            </Link>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Net operational implications</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">Simpler tuning</Box>
            <Box variant="p">
              Chunked prefill and prefix caching are on by default and compose with the rest
              of the scheduler. Fewer per-model flags to get right; the defaults are the
              tuned path now.
            </Box>
          </div>
          <div>
            <Box variant="h3">Different failure modes</Box>
            <Box variant="p">
              Preemption costs compute (recompute), not host round-trips. CUDA graph capture
              &ldquo;takes up more memory in V1 than in V0,&rdquo; per the guide — budget GPU
              memory accordingly. Multi-process means a frontend↔core IPC link to monitor.
            </Box>
          </div>
          <div>
            <Box variant="h3">Quietly broken APIs</Box>
            <Box variant="p">
              Clients using <code>best_of</code>, per-request logits processors, or
              per-request structured-output backends need migration. The request is still
              accepted; the behavior is gone.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <ExpandableSection headerText="Why a multi-process design, and what the IPC buys you">
        <SpaceBetween size="s">
          <Box variant="p">
            The core insight from the V1 alpha post: as &ldquo;GPUs are getting faster and
            significantly reducing model execution times, the CPU overhead for tasks like
            running the API server, scheduling work, preparing inputs, de-tokenizing outputs,
            and streaming responses to users becomes increasingly pronounced.&rdquo; If that
            CPU work shares the engine&apos;s critical path, a faster GPU just spends a larger
            fraction of each step idle.{' '}
            <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
              vLLM V1 alpha blog (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            V1&apos;s answer is an &ldquo;isolated <code>EngineCore</code> execution loop that
            focuses exclusively on the scheduler and model executor,&rdquo; which &ldquo;allows
            for greater overlap of CPU-intensive tasks—such as tokenization, multimodal
            input processing, de-tokenization, and request streaming—with the core
            execution loop.&rdquo; The split builds on the v0.6.0 multiprocessing API server
            that already used ZeroMQ for IPC, pushing that model deeper into the async engine.{' '}
            <Link external href="https://vllm.ai/blog/2025-01-27-v1-alpha-release">
              vLLM V1 alpha blog (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            The architecture overview frames the same split as distinct process roles: an{' '}
            <strong>API server process</strong> that handles HTTP and input processing
            (tokenization, multimodal data loading), an <strong>EngineCore process</strong>{' '}
            that runs the scheduler, manages the KV cache, and coordinates execution, and one{' '}
            <strong>GPU worker process per GPU</strong>.{' '}
            <Link external href="https://docs.vllm.ai/en/latest/design/arch_overview/">
              vLLM architecture overview (accessed 2026-06-07)
            </Link>
          </Box>
          <Box variant="p">
            For the actual client tiers, the ZMQ sockets, and how a request crosses the
            process boundary in real source, see the{' '}
            <strong>Inside the Codebase → Architecture &amp; Module Map</strong> tab. This
            section stops at the &ldquo;why&rdquo; and the operational shape.
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
