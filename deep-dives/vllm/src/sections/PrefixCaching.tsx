import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const BLOG = 'https://vllm.ai/blog/2025-01-27-v1-alpha-release';
const DESIGN = vllmDocsUrl('design/prefix_caching/');
const RELEASE_029 = 'https://github.com/vllm-project/vllm/releases/tag/v0.29.0';

function PrefixReuseDiagram() {
  const blue = '#0972d3';
  const green = '#1d8102';
  const secondary = '#5f6b7a';
  const text = '#16191f';
  const blueFill = '#f2f8fd';
  const greenFill = '#ecf7ec';
  const amberFill = '#fbf3e6';
  const border = '#879596';

  const bw = 160; // block width
  const bh = 56; // block height
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
  const block3X = startX + 3 * (bw + gap) + bw / 2;

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
    <div style={{ overflowX: 'auto' }}>
      <svg
        role="img"
        aria-labelledby="prefix-reuse-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
        viewBox="0 0 780 350"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="prefix-reuse-title">
          Request A computes all four blocks of its prompt and stores its three full prefix blocks
          under the chained hashes h0, h1 and h2. Request B sends the same system prompt and document
          with a different question: its first three block hashes hit, so those blocks are reused
          with no prefill compute, and only block 3, where the token sequences diverge, is computed.
        </title>
        <defs>
          <marker
            id="pfx-reuse-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={blue} />
          </marker>
        </defs>

        <rect x={0} y={0} width={780} height={350} rx={8} fill="#ffffff" />

        {/* Request A label */}
        <text x={startX} y={rowA_Y - 14} fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Request A: full prefill (cold)</text>

        {/* Request A blocks */}
        {renderBlocks(rowA_Y, [blueFill, blueFill, blueFill, amberFill], reqABlock3)}

        {/* "computed" labels below each block */}
        {Array.from({ length: 4 }, (_, i) => (
          <text key={`comp-${i}`} x={startX + i * (bw + gap) + bw / 2} y={rowA_Y + bh + 16} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">computed</text>
        ))}

        {/* Block 3 of request A is partial, so it is not hashed or cached */}
        <text x={block3X} y={rowA_Y + bh + 34} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">partial block: not cached</text>

        {/* Arrows down from blocks 0-2 to their hashes */}
        {Array.from({ length: 3 }, (_, i) => {
          const cx = startX + i * (bw + gap) + bw / 2;
          return <line key={`arr-${i}`} x1={cx} y1={rowA_Y + bh + 22} x2={cx} y2={rowA_Y + bh + 38} stroke={blue} strokeWidth={1.5} markerEnd="url(#pfx-reuse-ah)" />;
        })}

        {/* Hashes h0-h2, one per full block, chained left to right */}
        {['h0', 'h1', 'h2'].map((label, i) => (
          <text key={`hash-${i}`} x={startX + i * (bw + gap) + bw / 2} y={rowA_Y + bh + 54} textAnchor="middle" fontSize={12} fontWeight="bold" fill={blue} fontFamily="sans-serif">{label}</text>
        ))}
        {Array.from({ length: 2 }, (_, i) => {
          const from = startX + i * (bw + gap) + bw / 2 + 14;
          const to = startX + (i + 1) * (bw + gap) + bw / 2 - 14;
          return <line key={`chain-${i}`} x1={from} y1={rowA_Y + bh + 50} x2={to} y2={rowA_Y + bh + 50} stroke={blue} strokeWidth={1.2} markerEnd="url(#pfx-reuse-ah)" />;
        })}
        <text x={startX + 1 * (bw + gap) + bw / 2} y={rowA_Y + bh + 76} textAnchor="middle" fontSize={11} fill={blue} fontFamily="sans-serif">full blocks cached, each keyed by a hash that folds in its parent</text>

        {/* Separator */}
        <line x1={startX} y1={rowB_Y - 24} x2={740} y2={rowB_Y - 24} stroke={border} strokeWidth={0.8} strokeDasharray="4 3" />

        {/* Request B label */}
        <text x={startX} y={rowB_Y - 6} fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Request B: shares prefix, different question</text>

        {/* Request B blocks */}
        {renderBlocks(rowB_Y + 8, [greenFill, greenFill, greenFill, amberFill], reqBBlock3)}

        {/* HIT labels below blocks 0-2 */}
        {['h0 HIT', 'h1 HIT', 'h2 HIT'].map((label, i) => (
          <text key={`hit-${i}`} x={startX + i * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 18} textAnchor="middle" fontSize={12} fontWeight="bold" fill={green} fontFamily="sans-serif">{label}</text>
        ))}

        {/* "reused" annotation, centered below the three HIT labels */}
        <text x={startX + 1 * (bw + gap) + bw / 2} y={rowB_Y + 8 + bh + 36} textAnchor="middle" fontSize={11} fill={green} fontFamily="sans-serif">reused: no prefill compute</text>

        {/* Divergence annotation */}
        <text x={block3X} y={rowB_Y + 8 + bh + 18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={secondary} fontFamily="sans-serif">DIVERGES</text>
        <text x={block3X} y={rowB_Y + 8 + bh + 36} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">computed from here</text>
      </svg>
    </div>
  );
}

export function PrefixCaching() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Requests that share a prefix reuse its KV (key-value) cache blocks instead of recomputing them: when that pays, how to keep tenants apart, and which metric shows it working (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            6. Automatic Prefix Caching
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The challenge:</strong> most production traffic re-sends the same tokens. A
            long system prompt prepends every request, a RAG (Retrieval-Augmented Generation)
            pipeline stuffs the same document into hundreds of queries, an agent ships a fixed
            tool preamble on every turn, and a chat session re-feeds its whole history with each
            message. Without caching, each of those requests runs a full prefill over tokens the
            engine processed seconds ago.
          </Box>
          <Box variant="p">
            <strong>What automatic prefix caching (APC) does:</strong> the KV cache for a block of
            tokens depends only on that block&apos;s tokens and everything before it, never on
            what comes after. Two requests that start with the same tokens therefore produce{' '}
            <em>identical</em> KV blocks for that prefix. APC keeps those blocks, keys them by a
            hash over the prefix tokens, and lets the next request with the same prefix point
            straight at them. Prefill skips the cached portion and starts at the first block that
            differs.
          </Box>
          <Box variant="p">
            <strong>On by default:</strong> <code>enable_prefix_caching</code> defaults to true{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
              cache.py L142
            </Cite>
            . The V0 engine shipped it off because &quot;enabling prefix caching sometimes causes
            significant CPU overhead, leading to rather decreased performance when the cache hit
            rate is low.&quot; V1 rebuilt the data structures for constant-time eviction, and the
            project reports that in its own experiments prefix caching cost less than 1% of
            throughput even at a 0% hit rate{' '}
            <Cite tier={2} href={BLOG}>
              vLLM blog: V1 alpha release, 2025 (project claim)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a second request starts computing, and why the longest shared prefix sets the saving"
          >
            Two requests, one shared prefix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both requests below open with the same system prompt and retrieved document, so they
            hash to the same prefix blocks and the second computes only its divergent tail. Only
            full blocks are cached{' '}
            <Cite tier={1} href={DESIGN}>
              vLLM docs: Automatic prefix caching design
            </Cite>
            : reuse extends to the last <em>fully shared</em> block, and computation starts at the
            first block that differs.
          </Box>

          <PrefixReuseDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Four blocks stand in for a prompt of any length.
          </Box>

          <Alert type="info">
            <strong>Why block 3 is the divergence point:</strong> blocks 0-2 hold identical tokens,
            so their hashes match and their KV is reused. Block 3 holds the differing question, so
            its hash misses and it is computed along with everything after it. Reuse follows the{' '}
            <em>longest shared prefix</em>, not the total overlap.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a block matches only when everything before it matches, what besides tokens goes into the key, and where hybrid models can hit"
          >
            How blocks become reusable: keying by prefix hash
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each block&apos;s hash chains over the parent block&apos;s hash, this block&apos;s
            tokens and a set of extra keys{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
              kv_cache_utils.py L684-L714
            </Cite>
            . Because the parent hash is folded in, a block matches only when the{' '}
            <em>entire</em> prefix up to and including it is identical: two requests with the
            same block 2 tokens but different block 1 tokens will <em>not</em> collide.
          </Box>
          <Box variant="p">
            The extra keys are the LoRA (low-rank adaptation) adapter&apos;s name and path,
            multimodal input identifiers, a per-block SHA-256 of any prompt embeddings, and the
            optional cache salt, each tagged with its source (<code>lora</code>,{' '}
            <code>mm</code>, <code>prompt_embeds</code>, <code>cache_salt</code>) so one can never
            pass for another{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L499-L652')}>
              kv_cache_utils.py L499-L652
            </Cite>
            . Because the adapter path is in the key, re-pointing a LoRA name at a different
            adapter starts a fresh chain instead of reusing KV computed with the old one.
          </Box>
          <Box variant="p">
            <strong>Hybrid models hit at saved checkpoints.</strong> Models that mix attention
            with Mamba layers get prefix caching by default too: vLLM switches the Mamba cache
            mode to <code>align</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/model_executor/models/config.py', 'L640-L648')}>
              config.py L640-L648
            </Cite>
            , which saves Mamba state only at block boundaries reached at the end of a scheduler
            step{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L190-L198')}>
              cache.py L190-L198
            </Cite>
            . <code>--prefix-cache-retention-interval</code> sets which checkpoints survive in
            sliding-window and Mamba groups: the default <code>0</code> keeps only &quot;semantic
            checkpoints, including the latest replay boundary and shared-prefix junctions&quot;,
            and a positive value (a multiple of the block size) also keeps one every that many
            tokens{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L160-L166')}>
              cache.py L160-L166
            </Cite>
            . Our reading: a Mamba layer carries its context as one running state, so a hit can
            resume only where a state was saved, and a positive interval adds hit points at the
            cost of cache space.
          </Box>
          <Box variant="p">
            These are also the only models where a hit can end inside a block. With a Mamba
            group in <code>align</code> mode, prefix keys are computed every{' '}
            <code>--prefix-match-unit</code> tokens, or at the greatest common divisor of the KV
            cache groups&apos; block sizes{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L783-L798')}>
              kv_cache_utils.py L783-L798
            </Cite>
            , and a hit that ends inside a physical block costs a copy of that one block{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L687-L704')}>
              kv_cache_coordinator.py L687-L704
            </Cite>
            . Full-attention models hit on whole blocks.
          </Box>
          <Alert type="info">
            The hash functions, the chain root, the block-copy path and the constant-time free
            queue are walked through against the source in the{' '}
            <strong>Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong> tab (Prefix-cache
            block hashing).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to keep one tenant's prefixes from being reused, or timed, by another"
          >
            Multi-tenant safety: cache_salt
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Prefix sharing is purely a function of token equality, and it is{' '}
            <strong>indifferent to who sent the request</strong>. Two tenants that send the same
            opening tokens (the same boilerplate system prompt, say) share KV blocks. The KV cache
            holds no plaintext one tenant can read from another, but the <em>timing</em> of a hit
            is observable: a fast response can reveal that someone already submitted that exact
            prefix.
          </Box>
          <Box variant="p">
            <strong>cache_salt</strong> is a per-request field injected into the first
            block&apos;s hash, so <em>&quot;only requests with the same salt can reuse cached KV
            blocks&quot;</em>{' '}
            <Cite tier={1} href={DESIGN}>
              vLLM docs: Automatic prefix caching design, cache isolation
            </Cite>
            . A distinct salt per tenant (or per trust boundary) makes prefixes unshareable across
            the boundary and fully reusable within it, at the price of cross-tenant reuse of
            genuinely identical prefixes. The server accepts a non-empty string of at most 128
            characters without <code>@</code>, <code>/</code>, <code>\</code> or NUL{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/generate/base/protocol.py', 'L29-L49')}>
              generate/base/protocol.py L29-L49
            </Cite>
            .
          </Box>
          <Alert type="warning">
            <strong>Default is share-everything.</strong> Without <code>cache_salt</code>,
            identical prefixes <em>will</em> be shared across tenants. With the default{' '}
            <code>sha256</code> every vLLM process derives the same block hashes{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L102-L143')}>
              kv_cache_utils.py L102-L143
            </Cite>
            , so where a KV tier is shared across instances, the rule spans instances too. That
            is the right default for single-tenant and cooperative multi-tenant deployments, and a
            hazard for hostile multi-tenant ones. Decide the boundary explicitly.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a hot prefix stays resident while a long tail of one-off prefixes ages out"
          >
            Capacity and eviction
          </Header>
        }
      >
        <Box variant="p">
          Cached prefix blocks compete for the same finite KV cache as the live requests. When room
          is needed, vLLM evicts on an <strong>LRU (Least Recently Used)</strong> basis, taking
          &quot;the head block (least recently used block) of the free queue&quot;{' '}
          <Cite tier={1} href={DESIGN}>
            vLLM docs: Automatic prefix caching design, eviction
          </Cite>
          . Cached blocks that nothing is using wait on that queue and are reclaimed oldest-first,
          so a hot prefix stays resident while a one-off prefix ages out. Hit rate therefore
          depends on working-set size versus cache capacity: a shared document that fits and is
          queried constantly stays cached, while a long tail of unique prefixes churns through
          before anything reuses it.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which workloads skip most of their prefill, and which gain little either way"
          >
            Where it wins, and where it barely moves the needle
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            APC pays off in direct proportion to <strong>how much of each request is shared,
            recurring prefix</strong> versus unique tail. The project measured less than 1%
            throughput loss at a 0% hit rate on the 2025 V1 alpha{' '}
            <Cite tier={2} href={BLOG}>
              vLLM blog: V1 alpha release (project claim)
            </Cite>
            ; if that holds for your workload, leaving it on costs little, and the only question
            is how much you <em>gain</em>.
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
                why: 'Many different questions against the same long document; the document tokens are a large fixed prefix reused across every query.',
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
                why: "Little to no shared prefix and a long tail that evicts before reuse. Hit rate stays near zero; the project's measured overhead of under 1% means leaving it on costs little.",
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

      <Container
        header={
          <Header
            variant="h2"
            description="How to turn it off, clear it for a benchmark, and read the hit rate that shows it working"
          >
            Operating notes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">It is on unless you turn it off</Box>
              <Box variant="p">
                Decoder-only and hybrid generative models get it with no flag; encoder-decoder,
                attention-free and some pooling models default to off{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/model.py', 'L2178-L2230')}>
                  model.py L2178-L2230
                </Cite>
                . Turn it off with <code>--no-enable-prefix-caching</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L377-L379')}>
                  arg_utils.py L377-L379
                </Cite>
                , or skip the cache read for one Python API request with{' '}
                <code>skip_reading_prefix_cache</code> in its <code>SamplingParams</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L360')}>
                  sampling_params.py L360
                </Cite>
                . To benchmark a cold cache with the feature on, clear it between runs:{' '}
                <code>LLM.reset_prefix_cache()</code> offline{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/llm.py', 'L802-L807')}>
                  llm.py L802-L807
                </Cite>
                , or <code>POST /reset_prefix_cache</code>, a development route that exists only
                when the server starts with <code>VLLM_SERVER_DEV_MODE=1</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}
                >
                  routers.py L34-L37
                </Cite>
                . A reset fails while any request holds blocks{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L840-L847')}>
                  block_pool.py L840-L847
                </Cite>
                , so run it with the server idle.
              </Box>
            </div>
            <div>
              <Box variant="h3">Hit rate is a metric, not a guarantee</Box>
              <Box variant="p">
                Track <code>vllm:prefix_cache_hits</code> over{' '}
                <code>vllm:prefix_cache_queries</code> (both in tokens), and the{' '}
                <code>vllm:external_prefix_cache_hits</code> over{' '}
                <code>vllm:external_prefix_cache_queries</code> pair when a KV connector serves
                hits{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L599-L640')}>
                  loggers.py L599-L640
                </Cite>
                ; the periodic stats log prints them as &quot;Prefix cache hit rate&quot; and
                &quot;External prefix cache hit rate&quot;{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L306-L315')}>
                  loggers.py L306-L315
                </Cite>
                . A latency shift after a deploy can be a hit-rate shift, so check these before
                suspecting a code regression. Routing matters: a load balancer that scatters one
                user&apos;s chat turns across replicas hands each replica a cold prefix.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Hash stability across processes, restarts and versions">
            <SpaceBetween size="s">
              <Box variant="p">
                Every block hash chains back to a root derived from a seed. With the default{' '}
                <code>sha256</code>, or <code>sha256_cbor</code>, that seed is the fixed string{' '}
                <code>&quot;vllm-none-hash&quot;</code>, so every vLLM process computes the same
                hashes for the same tokens, across restarts and instances, with no configuration{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L102-L143')}>
                  kv_cache_utils.py L102-L143
                </Cite>
                , the behaviour since v0.29.0{' '}
                <Cite tier={1} href={RELEASE_029}>
                  vLLM v0.29.0 release notes
                </Cite>
                .
              </Box>
              <Box variant="p">
                <code>xxhash</code> and <code>xxhash_cbor</code> are faster but not cryptographic,
                so vLLM keeps their seed secret: each process draws a random one and logs a
                warning{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L160-L172')}>
                  kv_cache_utils.py L160-L172
                </Cite>
                . To share their hashes across instances, set the same <code>PYTHONHASHSEED</code>{' '}
                on every instance. <code>PYTHONHASHSEED</code> overrides the seed for every
                algorithm, so wherever you set it, set one value everywhere.
              </Box>
              <Box variant="p">
                Across Python or vLLM versions, <code>sha256</code> pickles its input{' '}
                <Cite tier={1} href={vllmUrl('vllm/utils/hashing.py', 'L26-L60')}>
                  hashing.py L26-L60
                </Cite>
                , so its hashes <em>&quot;may not be reproducible across different Python or
                vLLM versions&quot;</em>. For a persisted or cross-language cache, the design doc
                recommends <code>sha256_cbor</code> (canonical CBOR, Concise Binary Object
                Representation) &quot;for deterministic caching across environments&quot;{' '}
                <Cite tier={1} href={DESIGN}>
                  vLLM docs: Automatic prefix caching design, hash algorithms
                </Cite>
                . Within one running process, hashing is always self-consistent.
              </Box>
              <Box variant="p">
                The peer-to-peer (P2P) offload tier depends on a shared seed: it compares seeds in
                its connect handshake and rejects a mismatched peer with a &quot;hash seed
                mismatch&quot; error{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/tiering/p2p/session/session.py', 'L458-L475')}
                >
                  p2p/session/session.py L458-L475
                </Cite>
                . The seed logic is walked through against the source in the{' '}
                <strong>Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong> tab.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="p">
            <strong>Where to start:</strong> compare <code>vllm:prefix_cache_hits</code> over{' '}
            <code>vllm:prefix_cache_queries</code> with what the workload table predicts. If a chat
            or RAG service reads low, look at routing first: prefix-aware or session-sticky routing
            keeps a conversation on the replica that holds its history. Then check capacity, since
            a working set larger than the KV cache churns before reuse, and set{' '}
            <code>cache_salt</code> wherever tenants must not share.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
