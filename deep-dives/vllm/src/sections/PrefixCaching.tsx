import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

function PrefixReuseDiagram() {
  const blue = '#0972d3';
  const green = '#1d8102';
  const secondary = '#5f6b7a';
  const text = '#16191f';
  const blueFill = '#f2f8fd';
  const greenFill = '#e8f5e9';
  const amberFill = '#fbf3e6';
  const border = '#879596';

  const bw = 160; // block width
  const bh = 56;  // block height
  const gap = 12;
  const startX = 40;

  const blockLabels = [
    ['block 0', '[system prompt]'],
    ['block 1', '[retrieved doc tokens]'],
    ['block 2', '[retrieved doc tokens]'],
  ];

  const reqABlock3 = ['block 3', '"...what is X?"'];
  const reqBBlock3 = ['block 3', '"...how many Y?"'];

  const rowA_Y = 50;
  const rowB_Y = 230;

  function renderBlocks(y: number, fills: string[], block3Label: string[]) {
    return Array.from({ length: 4 }, (_, i) => {
      const x = startX + i * (bw + gap);
      const labels = i < 3 ? blockLabels[i] : block3Label;
      return (
        <g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx={6} fill={fills[i]} stroke={border} strokeWidth={1.2} />
          <text x={x + bw / 2} y={y + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily="sans-serif">{labels[0]}</text>
          <text x={x + bw / 2} y={y + 40} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">{labels[1]}</text>
        </g>
      );
    });
  }

  return (
    <svg
      role="img"
      aria-labelledby="prefix-reuse-title"
      style={{ width: '100%', height: 'auto' }}
      viewBox="0 0 780 380"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="prefix-reuse-title">Diagram showing two requests sharing prefix blocks via automatic prefix caching</title>
      <defs>
        <marker id="arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill={blue} />
        </marker>
      </defs>

      {/* Request A label */}
      <text x={startX} y={rowA_Y - 14} fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Request A — full prefill (cold)</text>

      {/* Request A blocks */}
      {renderBlocks(rowA_Y, [blueFill, blueFill, blueFill, amberFill], reqABlock3)}

      {/* "computed" labels below each block */}
      {Array.from({ length: 4 }, (_, i) => (
        <text key={`comp-${i}`} x={startX + i * (bw + gap) + bw / 2} y={rowA_Y + bh + 16} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">computed</text>
      ))}

      {/* Arrows down from blocks 0-2 */}
      {Array.from({ length: 3 }, (_, i) => {
        const cx = startX + i * (bw + gap) + bw / 2;
        return <line key={`arr-${i}`} x1={cx} y1={rowA_Y + bh + 22} x2={cx} y2={rowA_Y + bh + 42} stroke={blue} strokeWidth={1.5} markerEnd="url(#arrow-down)" />;
      })}

      {/* Hash chain annotation */}
      <text x={startX} y={rowA_Y + bh + 62} fontSize={12} fill={blue} fontFamily="sans-serif" fontWeight="bold">hash chain: h0 → h1 → h2 (blocks stored, keyed by hash)</text>

      {/* Separator */}
      <line x1={startX} y1={rowB_Y - 24} x2={740} y2={rowB_Y - 24} stroke={border} strokeWidth={0.8} strokeDasharray="4 3" />

      {/* Request B label */}
      <text x={startX} y={rowB_Y - 6} fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Request B — shares prefix, different question</text>

      {/* Request B blocks */}
      {renderBlocks(rowB_Y + 8, [greenFill, greenFill, greenFill, amberFill], reqBBlock3)}

      {/* HIT labels below blocks 0-2 */}
      {['h0 HIT', 'h1 HIT', 'h2 HIT'].map((label, i) => (
        <text key={`hit-${i}`} x={startX + i * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 18} textAnchor="middle" fontSize={12} fontWeight="bold" fill={green} fontFamily="sans-serif">{label}</text>
      ))}

      {/* "reused, zero compute" annotation — centered below the three HIT labels */}
      <text x={startX + 1 * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 36} textAnchor="middle" fontSize={11} fill={green} fontFamily="sans-serif">↑ reused, zero compute</text>

      {/* Divergence annotation */}
      <text x={startX + 3 * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={secondary} fontFamily="sans-serif">DIVERGES</text>
      <text x={startX + 3 * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 36} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">→ compute only here</text>
    </svg>
  );
}

export function PrefixCaching() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Reuse already-computed KV blocks across requests that share a prefix — for free, by default, in V1."
          >
            6. Automatic Prefix Caching
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem it removes:</strong> Most production traffic re-sends the same tokens
            over and over. A long system prompt prepends every request. A RAG (Retrieval-Augmented
            Generation) pipeline stuffs the same retrieved document into hundreds of queries. An
            agent ships a fixed tool-definition preamble on every turn. A chat session re-feeds the
            entire history with each new user message. Without caching, the engine runs a full
            prefill over those identical tokens every single time — recomputing key/value tensors it
            already produced seconds ago and then threw away.
          </Box>
          <Box variant="p">
            <strong>What automatic prefix caching (APC) does:</strong> The KV (key/value) cache for a
            block of tokens depends only on that block&apos;s tokens and everything before it — never
            on what comes after. So if two requests start with the same tokens, the KV blocks for
            that shared prefix are <em>identical</em>. APC keeps those computed blocks around, keys
            them by a hash over the prefix tokens, and lets the next request that shares the prefix
            point straight at them. The prefill skips the cached portion entirely and starts
            computing only at the first token that differs.
          </Box>
          <Box variant="p">
            <strong>The headline change in V1:</strong> APC is now{' '}
            <strong>enabled by default</strong>. In V0 it was opt-in and{' '}
            <em>&quot;disabled by default&quot;</em> because, in the words of the V1 release post,
            &quot;enabling prefix caching sometimes causes significant CPU overhead, leading to
            rather decreased performance when the cache hit rate is low.&quot; V1 re-engineered the
            data structures so that overhead effectively vanishes —{' '}
            <em>&quot;V1&apos;s prefix caching causes less than 1% decrease in throughput even when
            the cache hit rate is 0%&quot;</em> — which is exactly why it could be flipped on for
            everyone (
            <Link
              external
              href="https://blog.vllm.ai/2025/01/27/v1-alpha-release.html"
            >
              vLLM Blog: vLLM V1 Alpha, accessed 2026-06-07
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Two requests, one shared prefix</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Both requests below open with the same system prompt and the same retrieved document, so
            they hash to the same prefix blocks. The second request reuses those blocks and only
            computes its own divergent tail. The cache is block-granular: reuse extends up to the
            last <em>fully shared</em> block, and computation begins at the first block where the
            token sequences differ.
          </Box>

          <PrefixReuseDiagram />

          <Alert type="info">
            <strong>Why block 3 is the divergence point:</strong> blocks 0&ndash;2 are byte-for-byte
            identical token sequences, so their hashes match and their KV is reused. Block 3 contains
            the user&apos;s differing question, so its hash misses and only that block (and anything
            after it) is recomputed. Reuse is a function of the <em>longest shared prefix</em>, not
            the total overlap.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How blocks become reusable: keying by prefix hash</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Each block is identified by a hash that chains over everything that precedes it: the
            parent block&apos;s hash, plus this block&apos;s own tokens, plus a few extra qualifiers
            (LoRA adapter ID, multimodal input hashes, and the optional cache salt described below).
            Because the parent hash is folded in, a block only matches when the <em>entire</em>{' '}
            prefix up to and including it is identical &mdash; two requests with the same block 2
            tokens but different block 1 tokens will <em>not</em> collide. That chaining is what makes
            &quot;shared prefix&quot; a precise, verifiable property rather than a fuzzy guess.
          </Box>
          <Alert type="info">
            The exact hash construction, the parent-hash chaining, the <code>BlockHash</code> data
            structures, and the constant-time eviction queue live in the implementation. This section
            stays conceptual on purpose &mdash; see the <strong>Inside the Codebase &rarr; Scheduler
            &amp; KV Cache</strong> tab for the block-hash walkthrough against the real source.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Multi-tenant safety: cache_salt</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Prefix sharing is purely a function of token equality, and it is{' '}
            <strong>indifferent to who sent the request</strong>. If two tenants happen to send the
            same opening tokens &mdash; the same boilerplate system prompt, say &mdash; they will
            share KV blocks. The KV cache holds no plaintext that one tenant can read from another,
            but the <em>timing</em> of a cache hit is observable: a sufficiently fast response can
            reveal that someone else already submitted that exact prefix. For workloads where that
            side channel matters, this is the control to reach for.
          </Box>
          <Box variant="p">
            <strong>cache_salt</strong> is a per-request value that gets injected into the hash of the
            first block, so &mdash; quoting the design doc &mdash;{' '}
            <em>&quot;only requests with the same salt can reuse cached KV blocks.&quot;</em> Give
            each tenant (or each trust boundary) a distinct salt and their prefixes become
            unshareable across the boundary while still being fully reusable <em>within</em> it. The
            cost is that you forgo cross-tenant reuse of genuinely identical prefixes &mdash; an
            intentional trade of efficiency for isolation (
            <Link external href="https://docs.vllm.ai/en/latest/design/prefix_caching/">
              vLLM Docs: Automatic Prefix Caching design, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Alert type="warning">
            <strong>Default is share-everything.</strong> If you serve multiple tenants from one vLLM
            instance and have not set <code>cache_salt</code>, identical prefixes <em>will</em> be
            shared across them. That is the correct default for single-tenant and cooperative
            multi-tenant deployments, and a hazard for hostile-multi-tenant ones. Decide the boundary
            explicitly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Capacity and eviction: LRU</Header>}>
        <Box variant="p">
          The KV cache is finite, shared with all the live requests doing actual decoding, and
          cached prefix blocks compete for the same space. When room is needed, vLLM evicts on an{' '}
          <strong>LRU (Least Recently Used)</strong> basis &mdash; the design doc describes evicting
          &quot;the head block (least recently used block) of the free queue.&quot; Cached blocks
          that nothing is currently using sit on a free queue and are reclaimed oldest-first, so a
          hot prefix that keeps getting hit stays resident while a one-off prefix ages out. The
          practical consequence: hit rate depends on working-set size versus cache capacity. A
          shared document that fits comfortably and is queried constantly stays cached; a long tail
          of unique prefixes churns through and rarely survives to be reused.
        </Box>
      </Container>

      <Container header={<Header variant="h2">Where it wins &mdash; and where it barely moves the needle</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            APC pays off in direct proportion to <strong>how much of each request is shared,
            recurring prefix</strong> versus unique tail. The more your traffic front-loads identical
            tokens, the more prefill you skip. Because the V1 overhead is under 1% even at a 0% hit
            rate, you essentially never pay to leave it on &mdash; the only question is how much you{' '}
            <em>gain</em>.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">When automatic prefix caching helps</Header>}
            columnDefinitions={[
              { id: 'workload', header: 'Workload', cell: (i) => i.workload },
              { id: 'impact', header: 'Impact', cell: (i) => i.impact },
              { id: 'why', header: 'Why', cell: (i) => i.why },
            ]}
            items={[
              {
                workload: 'Multi-turn chat',
                impact: 'A lot',
                why: 'Each turn re-sends the entire history; every turn but the first is almost all cached prefix, and only the new user message + reply are fresh.',
              },
              {
                workload: 'RAG over a shared document',
                impact: 'A lot',
                why: 'Many different questions against the same long document — the document tokens are a large fixed prefix reused across every query.',
              },
              {
                workload: 'Agents with a fixed tool preamble',
                impact: 'A lot',
                why: 'A long, identical system + tool-definition prompt prepends every step of every trajectory; the preamble is pure cache hit.',
              },
              {
                workload: 'Shared system prompt, varied user input',
                impact: 'Moderate',
                why: 'The system prompt is cached for all callers; the win scales with how large the prompt is relative to the per-request input.',
              },
              {
                workload: 'Few-shot prompting with fixed exemplars',
                impact: 'Moderate to a lot',
                why: 'The exemplar block is identical across calls and often dominates token count; it is reused while only the query varies.',
              },
              {
                workload: 'High-cardinality unique prompts',
                impact: 'A little',
                why: 'Little to no shared prefix and a long tail that evicts before reuse — hit rate stays near zero, but the <1% overhead means you lose nothing by leaving it on.',
              },
              {
                workload: 'Mostly-decode, short-prompt traffic',
                impact: 'A little',
                why: 'The expensive work is generation, not prefill; caching the tiny prompt saves little because prefill was never the bottleneck.',
              },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Operating notes</Header>}>
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">It is on unless you turn it off</Box>
              <Box variant="p">
                In V1 there is nothing to enable. If you specifically need it disabled (for
                deterministic latency measurement, or to isolate a benchmark from cache effects),
                disable it explicitly rather than assuming the V0 opt-in default. Treat a sudden
                latency change after a deploy as a possible hit-rate change, not always a code
                regression.
              </Box>
            </div>
            <div>
              <Box variant="h3">Hit rate is a metric, not a guarantee</Box>
              <Box variant="p">
                Reuse is opportunistic. Routing matters: if a load balancer scatters a single
                user&apos;s chat turns across replicas, each replica sees a cold prefix and the hit
                rate collapses. Prefix-aware or session-sticky routing keeps a conversation landing
                on the replica that already holds its history.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Reproducibility caveat: hashing and PYTHONHASHSEED">
            <SpaceBetween size="s">
              <Box variant="p">
                Block hashes are computed within the serving process. The design doc warns that with
                the default hashing algorithm, <em>&quot;Hashes may not be reproducible across
                different Python or vLLM versions&quot;</em> &mdash; and Python&apos;s built-in hash
                randomization means hash values can differ run-to-run unless{' '}
                <code>PYTHONHASHSEED</code> is pinned. This does not affect correctness or
                hit rates <em>within</em> a single running process: a process hashes consistently
                against itself, so prefixes still match and reuse still works.
              </Box>
              <Box variant="p">
                It matters when you need hashes to be <em>stable across processes or restarts</em>{' '}
                &mdash; for example, sharing or persisting a KV cache across instances, or
                reproducing an exact cache layout in a test. For those cases vLLM offers reproducible
                hashing algorithms (e.g. <code>sha256_cbor</code> / <code>xxhash_cbor</code>) instead
                of the default. Set <code>PYTHONHASHSEED</code> if you depend on cross-process hash
                stability (
                <Link external href="https://docs.vllm.ai/en/latest/design/prefix_caching/">
                  vLLM Docs: Automatic Prefix Caching design, accessed 2026-06-07
                </Link>
                ).
              </Box>
              <Box variant="p">
                The concrete hash construction, the algorithm selection, and where{' '}
                <code>PYTHONHASHSEED</code> bites in the call path are covered against the source in
                the <strong>Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong> tab.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
