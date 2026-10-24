import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const MEM_FIELDS = 'python/sglang/srt/arg_groups/fields/memory.py';
const HICACHE_HOOK = 'python/sglang/srt/arg_groups/hicache_hook.py';
const KV_HOOK = 'python/sglang/srt/arg_groups/kv_cache_hook.py';
const HISPARSE_HOOK = 'python/sglang/srt/arg_groups/hisparse_hook.py';
const REGISTRY = 'python/sglang/srt/mem_cache/registry.py';
const URC = 'python/sglang/srt/mem_cache/unified_radix_cache.py';
const TREE_CORE = 'python/sglang/srt/mem_cache/unified_cache/unified_tree_core.py';
const TREE_CORE_REGISTRY = 'python/sglang/srt/mem_cache/unified_cache/tree_core_registry.py';
const STORAGE_ATTACH = 'python/sglang/srt/mem_cache/unified_cache/storage_attachment.py';
const FULL = 'python/sglang/srt/mem_cache/unified_cache/components/full.py';
const MATCH = 'python/sglang/srt/mem_cache/base_prefix_cache.py';
const CONTROLLER = 'python/sglang/srt/managers/cache_controller.py';
const MEM_POOL = 'python/sglang/srt/mem_cache/memory_pool.py';
const L2_TRANSFER = 'python/sglang/srt/mem_cache/l2_transfer.py';
const HOST_POOL = 'python/sglang/srt/mem_cache/pool_host/base.py';
const AUTO_SIZE = 'python/sglang/srt/mem_cache/hicache_auto_size.py';
const HYBRID_CTRL = 'python/sglang/srt/mem_cache/hybrid_cache/hybrid_cache_controller.py';
const BACKEND_FACTORY = 'python/sglang/srt/mem_cache/storage/backend_factory.py';
const HICACHE_STORAGE = 'python/sglang/srt/mem_cache/hicache_storage.py';
const NIXL_UTILS = 'python/sglang/srt/mem_cache/storage/nixl/nixl_utils.py';
const MEM_UTILS = 'python/sglang/srt/mem_cache/utils.py';
const HASH_CPP = 'python/sglang/srt/mem_cache/cpp_utils/hash_binding.cpp';
const SPARSITY_FACTORY = 'python/sglang/srt/mem_cache/sparsity/factory.py';
const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const HTTP_SERVER = 'python/sglang/srt/entrypoints/http_server.py';
const KV_EVENTS = 'python/sglang/srt/disaggregation/kv_events.py';
const COLLECTOR = 'python/sglang/srt/observability/metrics_collector.py';

const DESIGN = 'advanced_features/hicache_design';
const SERVER_ARGS = 'advanced_features/server_arguments';
const BEST_PRACTICES = 'advanced_features/hicache_best_practices';
const HISPARSE_DOC = 'advanced_features/hisparse_guide';
const SESSION_DOC = 'advanced_features/session_radix_cache';

const VLLM_OFFLOAD_LINK = (
  <Link href="../vllm/">vLLM dive, section 7: KV-Cache Offloading &amp; Tiers</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: one tree, three tiers                                           */
/* ------------------------------------------------------------------------ */

function HiCacheTiersDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 456"
        role="img"
        aria-labelledby="hicache-tiers-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="hicache-tiers-title">
          SGLang HiCache keeps one radix tree whose nodes record where their KV lives: on the GPU
          (L1), in the instance&apos;s own host memory (L2), or both. Write-through copies a node to
          host memory when it is inserted, and once that copy lands the node is backed up to an
          optional storage backend (L3). Evicting a node from the GPU frees only its GPU copy, so
          the node stays in the tree as a host-only hit and returns to the GPU layer by layer; host
          hits under 10 tokens are recomputed. L3 sits outside the tree: SGLang queries it by
          chained SHA-256 page hash and prefetches into host memory when it holds 256 or more
          further tokens, waiting up to 1 s plus 0.25 s per 1,024 tokens with no cap.
        </title>
        <style>{`
          .hicache-tiers-h { fill: #16191f; font: 600 13px sans-serif; }
          .hicache-tiers-panel { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .hicache-tiers-node { fill: #ffffff; stroke: #414d5c; stroke-width: 1.3; }
          .hicache-tiers-nt { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .hicache-tiers-gpu { fill: #0972d3; stroke: #065299; stroke-width: 1; }
          .hicache-tiers-host { fill: #037f0c; stroke: #025a08; stroke-width: 1; }
          .hicache-tiers-off { fill: #ffffff; stroke: #879596; stroke-width: 1; stroke-dasharray: 3 2; }
          .hicache-tiers-ct { fill: #ffffff; font: 600 11px sans-serif; text-anchor: middle; }
          .hicache-tiers-ct-off { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
          .hicache-tiers-edge { stroke: #414d5c; stroke-width: 1.3; fill: none; }
          .hicache-tiers-s { fill: #414d5c; font: 11px sans-serif; }
          .hicache-tiers-l1 { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.3; }
          .hicache-tiers-l2 { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.3; }
          .hicache-tiers-l3 { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.3; }
          .hicache-tiers-bt { fill: #16191f; font: 600 13px sans-serif; }
          .hicache-tiers-bs { fill: #414d5c; font: 11px sans-serif; }
          .hicache-tiers-chip-off { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 3; }
          .hicache-tiers-chip-host { fill: #ffffff; stroke: #037f0c; stroke-width: 1.5; }
          .hicache-tiers-cs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .hicache-tiers-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#hicache-tiers-ah); }
          .hicache-tiers-dem { stroke: #0972d3; stroke-width: 1.8; fill: none; marker-end: url(#hicache-tiers-ah-dem); }
          .hicache-tiers-al { fill: #16191f; font: 11px sans-serif; }
          .hicache-tiers-al-dem { fill: #065299; font: 600 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="hicache-tiers-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="hicache-tiers-ah-dem"
            markerWidth="9"
            markerHeight="9"
            refX="9"
            refY="4.5"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#0972d3" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={456} rx={8} fill="#ffffff" />

        {/* Left panel: the index */}
        <text x={16} y={26} className="hicache-tiers-h">
          The index: one radix tree
        </text>
        <rect x={12} y={38} width={280} height={406} rx={6} className="hicache-tiers-panel" />

        <line x1={151} y1={78} x2={151} y2={104} className="hicache-tiers-edge" />
        <line x1={151} y1={154} x2={86} y2={196} className="hicache-tiers-edge" />
        <line x1={151} y1={154} x2={222} y2={196} className="hicache-tiers-edge" />

        <rect x={121} y={52} width={60} height={26} rx={13} className="hicache-tiers-node" />
        <text x={151} y={69} className="hicache-tiers-nt">
          root
        </text>

        <rect x={92} y={104} width={118} height={50} rx={5} className="hicache-tiers-node" />
        <text x={151} y={122} className="hicache-tiers-nt">
          system prompt
        </text>
        <rect x={100} y={130} width={48} height={18} rx={3} className="hicache-tiers-gpu" />
        <text x={124} y={143} className="hicache-tiers-ct">
          GPU
        </text>
        <rect x={154} y={130} width={48} height={18} rx={3} className="hicache-tiers-host" />
        <text x={178} y={143} className="hicache-tiers-ct">
          host
        </text>

        <rect x={22} y={196} width={128} height={50} rx={5} className="hicache-tiers-node" />
        <text x={86} y={214} className="hicache-tiers-nt">
          user A, turn 2
        </text>
        <rect x={34} y={222} width={48} height={18} rx={3} className="hicache-tiers-gpu" />
        <text x={58} y={235} className="hicache-tiers-ct">
          GPU
        </text>
        <rect x={90} y={222} width={48} height={18} rx={3} className="hicache-tiers-host" />
        <text x={114} y={235} className="hicache-tiers-ct">
          host
        </text>

        <rect x={158} y={196} width={128} height={50} rx={5} className="hicache-tiers-node" />
        <text x={222} y={214} className="hicache-tiers-nt">
          user B, turn 1
        </text>
        <rect x={170} y={222} width={48} height={18} rx={3} className="hicache-tiers-off" />
        <text x={194} y={235} className="hicache-tiers-ct-off">
          GPU
        </text>
        <rect x={226} y={222} width={48} height={18} rx={3} className="hicache-tiers-host" />
        <text x={250} y={235} className="hicache-tiers-ct">
          host
        </text>

        {/* Legend */}
        <rect x={26} y={266} width={40} height={16} rx={3} className="hicache-tiers-gpu" />
        <text x={74} y={278} className="hicache-tiers-s">
          KV held in L1 (GPU memory)
        </text>
        <rect x={26} y={290} width={40} height={16} rx={3} className="hicache-tiers-host" />
        <text x={74} y={302} className="hicache-tiers-s">
          KV held in L2 (host memory)
        </text>
        <rect x={26} y={314} width={40} height={16} rx={3} className="hicache-tiers-off" />
        <text x={74} y={326} className="hicache-tiers-s">
          copy freed by GPU eviction
        </text>

        <text x={26} y={360} className="hicache-tiers-s">
          A match walks the tree once and returns
        </text>
        <text x={26} y={376} className="hicache-tiers-s">
          a GPU part, then a host part. user B
        </text>
        <text x={26} y={392} className="hicache-tiers-s">
          left the GPU and is still a hit.
        </text>
        <text x={26} y={414} className="hicache-tiers-s">
          L3 sits outside the tree: SGLang asks
        </text>
        <text x={26} y={430} className="hicache-tiers-s">
          the backend by page hash.
        </text>

        {/* Right panel: where the KV bytes live */}
        <text x={310} y={26} className="hicache-tiers-h">
          Where the KV bytes live
        </text>

        {/* L1 */}
        <rect x={306} y={40} width={542} height={82} rx={6} className="hicache-tiers-l1" />
        <text x={320} y={66} className="hicache-tiers-bt">
          L1: GPU memory
        </text>
        <text x={320} y={86} className="hicache-tiers-bs">
          private to this instance
        </text>
        <rect x={676} y={52} width={160} height={58} rx={5} className="hicache-tiers-chip-off" />
        <text x={756} y={76} className="hicache-tiers-nt">
          user B, turn 1
        </text>
        <text x={756} y={96} className="hicache-tiers-cs">
          GPU copy freed
        </text>

        {/* Gap 1: L1 and L2 */}
        <line x1={330} y1={126} x2={330} y2={196} className="hicache-tiers-arr" />
        <text x={340} y={156} className="hicache-tiers-al">
          write-through: copy
        </text>
        <text x={340} y={172} className="hicache-tiers-al">
          on insert (default)
        </text>

        <line x1={484} y1={196} x2={484} y2={126} className="hicache-tiers-arr" />
        <text x={494} y={156} className="hicache-tiers-al">
          load back layer by layer;
        </text>
        <text x={494} y={172} className="hicache-tiers-al">
          under 10 tokens: recompute
        </text>

        <text x={710} y={156} className="hicache-tiers-al-dem">
          GPU eviction
        </text>
        <text x={710} y={172} className="hicache-tiers-al-dem">
          demotes it
        </text>

        {/* L2 */}
        <rect x={306} y={202} width={542} height={82} rx={6} className="hicache-tiers-l2" />
        <text x={320} y={228} className="hicache-tiers-bt">
          L2: host memory
        </text>
        <text x={320} y={248} className="hicache-tiers-bs">
          private to this instance
        </text>
        <text x={320} y={266} className="hicache-tiers-bs">
          2x the L1 tokens by default, shrunk to fit
        </text>
        <rect x={676} y={212} width={160} height={58} rx={5} className="hicache-tiers-chip-host" />
        <text x={756} y={236} className="hicache-tiers-nt">
          user B, turn 1
        </text>
        <text x={756} y={256} className="hicache-tiers-cs">
          host-only, still a hit
        </text>

        {/* Demotion arrow, painted after the L2 band so its head stays visible */}
        <line x1={700} y1={112} x2={700} y2={210} className="hicache-tiers-dem" />

        {/* Gap 2: L2 and L3 */}
        <line x1={330} y1={288} x2={330} y2={358} className="hicache-tiers-arr" />
        <text x={340} y={318} className="hicache-tiers-al">
          backup to L3 once
        </text>
        <text x={340} y={334} className="hicache-tiers-al">
          the host copy lands
        </text>

        <line x1={484} y1={358} x2={484} y2={288} className="hicache-tiers-arr" />
        <text x={494} y={310} className="hicache-tiers-al">
          prefetch into L2 when L3 holds
        </text>
        <text x={494} y={326} className="hicache-tiers-al">
          256 or more further tokens;
        </text>
        <text x={494} y={342} className="hicache-tiers-al">
          timeout 1 s + 0.25 s per 1,024 tokens, no cap
        </text>

        {/* L3 */}
        <rect x={306} y={364} width={542} height={82} rx={6} className="hicache-tiers-l3" />
        <text x={320} y={390} className="hicache-tiers-bt">
          L3: storage backend (optional)
        </text>
        <text x={320} y={410} className="hicache-tiers-bs">
          shared only when every instance points at the same backend
        </text>
        <text x={320} y={428} className="hicache-tiers-bs">
          keys: chained SHA-256 page hashes plus a namespace
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Bring-up flags                                                           */
/* ------------------------------------------------------------------------ */

interface FlagRow {
  id: string;
  flag: ReactNode;
  def: ReactNode;
  sets: ReactNode;
  src: ReactNode;
}

const FLAG_ROWS: FlagRow[] = [
  {
    id: 'enable',
    flag: <code>--enable-hierarchical-cache</code>,
    def: 'off',
    sets: 'Adds L2 and demotion on GPU eviction; needs the radix cache on',
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L98')}>
        memory.py L98
      </Cite>
    ),
  },
  {
    id: 'ratio',
    flag: <code>--hicache-ratio</code>,
    def: 'unset: 2.0, or 1.2 in buffer_only, outside a PD decode server; shrunk to fit host memory',
    sets: 'Host pool tokens per GPU pool token, per rank; an explicit value turns auto-sizing off',
    src: (
      <Cite tier={1} href={sglangUrl(HICACHE_HOOK, 'L81-L107')}>
        hicache_hook.py L81-L107
      </Cite>
    ),
  },
  {
    id: 'size',
    flag: <code>--hicache-size</code>,
    def: '0 (use the ratio)',
    sets: 'Host pool GB per rank; overrides the ratio',
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L110-L113')}>
        memory.py L110-L113
      </Cite>
    ),
  },
  {
    id: 'fraction',
    flag: <code>--hicache-host-memory-fraction</code>,
    def: '0.8',
    sets: 'Share of free host memory, after a 10 GiB reserve, that auto-sizing may give all ranks',
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L114-L117')}>
        memory.py L114-L117
      </Cite>
    ),
  },
  {
    id: 'mode',
    flag: <code>--hicache-host-memory-mode</code>,
    def: <code>cache</code>,
    sets: (
      <>
        <code>buffer_only</code> turns host memory into a staging buffer for L3 and needs a storage
        backend
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L99-L105')}>
        memory.py L99-L105
      </Cite>
    ),
  },
  {
    id: 'write',
    flag: <code>--hicache-write-policy</code>,
    def: <code>write_through</code>,
    sets: 'When a node gets its host copy',
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L118-L124')}>
        memory.py L118-L124
      </Cite>
    ),
  },
  {
    id: 'io',
    flag: <code>--hicache-io-backend</code>,
    def: <code>kernel</code>,
    sets: (
      <>
        GPU-assisted copy kernels, or <code>direct</code> copies
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L125-L131')}>
        memory.py L125-L131
      </Cite>
    ),
  },
  {
    id: 'layout',
    flag: <code>--hicache-mem-layout</code>,
    def: <code>page_first</code>,
    sets: 'Host buffer layout, five choices; some layout and IO pairs are rewritten at startup with a warning, so read the log for the pair you got',
    src: (
      <>
        <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L132-L144')}>
          memory.py L132-L144
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HICACHE_HOOK, 'L153-L203')} kind="code">
          hicache_hook.py L153-L203
        </Cite>
      </>
    ),
  },
  {
    id: 'backend',
    flag: <code>--hicache-storage-backend</code>,
    def: 'unset (no L3)',
    sets: (
      <>
        One of thirteen named L3 backends, or <code>dynamic</code>
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L145-L166')}>
        memory.py L145-L166
      </Cite>
    ),
  },
  {
    id: 'prefetch',
    flag: <code>--hicache-storage-prefetch-policy</code>,
    def: <code>timeout</code>,
    sets: 'When an L3 prefetch stops holding its request',
    src: (
      <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L167-L173')}>
        memory.py L167-L173
      </Cite>
    ),
  },
  {
    id: 'extra',
    flag: (
      <>
        <code>--hicache-storage-backend-extra-config</code> keys
      </>
    ),
    def: (
      <>
        <code>prefetch_threshold</code> 256, <code>prefetch_timeout_base</code> 1,{' '}
        <code>prefetch_timeout_per_ki_token</code> 0.25, no cap
      </>
    ),
    sets: 'The prefetch trigger and the wait: a 128K-token L3 hit may hold its request about 33 s',
    src: (
      <Cite tier={1} href={sglangUrl(HYBRID_CTRL, 'L392-L396')} kind="code">
        hybrid_cache_controller.py L392-L396
      </Cite>
    ),
  },
];

const TIMEOUT_FORMULAS = `# Documentation (hicache_design.mdx L105-L118)
timeout = min(prefetch_timeout_max,
              prefetch_timeout_base + prefetch_timeout_per_ki_token * num_token_to_fetch / 1024)
# documented defaults: base 2 s, 0.1 s per 1,024 tokens, max 30 s

# v0.5.22 code (hybrid_cache_controller.py, storage_attachment.py, unified_radix_cache.py)
timeout = prefetch_timeout_base + pages_to_fetch * (page_size / 1024) * prefetch_timeout_per_ki_token
# code defaults: base 1 s, 0.25 s per 1,024 tokens, no maximum`;

const BRING_UP = `# Step 1: L2 only, host pool auto-sized to fit the machine
sglang serve --model-path MODEL --enable-metrics --enable-hierarchical-cache

# Step 2: add a shared L3 and set the prefetch wait you can afford
sglang serve --model-path MODEL --enable-metrics --enable-hierarchical-cache \\
  --hicache-storage-backend BACKEND \\
  --hicache-storage-backend-extra-config \\
    '{"prefetch_timeout_base": BASE_S, "prefetch_timeout_per_ki_token": PER_1K_S}'`;

export function HiCache() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Turn on the host and storage tiers with the right flags, know which hits come back from each tier and which are skipped, and budget how long a storage hit can hold a request (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            7. HiCache: one tree across GPU, host and storage
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HiCache, SGLang&apos;s hierarchical cache, is for traffic whose reusable prefixes
            outgrow GPU memory. Agent loops, multi-turn chat and shared system prompts send the same
            long prefixes again and again, and once the radix cache (section 5, RadixAttention and
            the Radix Cache) evicts one from GPU memory, the next request that needs it pays for a
            full prefill. The challenge is to keep much more of that KV (key-value) cache within
            reach than the GPU holds, and to make a hit on it cheaper than computing it again.
          </Box>
          <Box variant="p">
            HiCache stretches the same radix tree over three tiers. L1 is GPU memory, L2 the
            instance&apos;s own host memory, and L3 an optional storage backend; L1 and L2 are
            private to one instance, and L3 is shared only when the backend spans instances{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L19-L65')}>
              hicache_design.mdx L19-L65
            </Cite>
            . It is opt-in: <code>--enable-hierarchical-cache</code> is off by default, and it
            needs the radix cache, so passing it together with <code>--disable-radix-cache</code>{' '}
            fails at startup{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L98')}>
              memory.py L98
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(KV_HOOK, 'L393-L397')} kind="code">
              kv_cache_hook.py L393-L397
            </Cite>
            .
          </Box>
          <Box variant="p">
            Most of what follows is about where a hit comes from. One number deserves a place in
            your latency budget first: a request whose prefix sits in L3 waits in the queue while
            that prefix is fetched, and in v0.5.22 a 128K-token fetch may hold it for about 33 s,
            where the documentation states a 30 s cap{' '}
            <Cite tier={1} href={sglangUrl(HYBRID_CTRL, 'L392-L396')} kind="code">
              hybrid_cache_controller.py L392-L396
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L105-L118')} kind="doc-code-conflict">
              hicache_design.mdx L105-L118
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict where a hit comes from: each node records which tier holds its KV, and a node pushed off the GPU is still a hit"
          >
            One tree, and eviction moves a node down a tier
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The tree is the default radix cache with host values attached: each node records a
            device value, a host value or both, and enabling HiCache adds a cache controller and
            host memory pools to the same <code>UnifiedRadixCache</code>{' '}
            <Cite tier={1} href={sglangUrl(REGISTRY, 'L191-L199')} kind="code">
              registry.py L191-L199
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L426-L559')} kind="code">
              unified_radix_cache.py L426-L559
            </Cite>
            . The documentation calls the structure HiRadixTree{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L67-L71')}>
              hicache_design.mdx L67-L71
            </Cite>
            ; in v0.5.22&apos;s code it is the tree class section 5 describes.
          </Box>
          <Box variant="p">
            A match walks that tree once and returns one continuous prefix in two parts: first the
            tokens whose KV is on the GPU, then the tokens whose KV is only in host memory{' '}
            <Cite tier={1} href={sglangUrl(MATCH, 'L269-L290')}>
              base_prefix_cache.py L269-L290
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L87')}>
              hicache_design.mdx L87
            </Cite>
            . The tree keeps exact addresses for L1 and L2 and no record of L3. For the rest of the
            prompt, the scheduler asks the storage backend, by page hash, how many further pages it
            holds as soon as the request arrives and its local match is done{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3215-L3260')} kind="code">
              scheduler.py L3215-L3260
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L1950-L1989')} kind="code">
              unified_radix_cache.py L1950-L1989
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L71')}>
              hicache_design.mdx L71
            </Cite>
            .
          </Box>
          <Box variant="p">
            Eviction is where the tiers show. Evicting a GPU leaf that already has a host copy frees
            the GPU copy and keeps the node in the tree, now host-only, so the next match still
            finds it. A leaf with no host copy yet is deleted under the write-through policies, or
            copied to host and then demoted under write-back{' '}
            <Cite tier={1} href={sglangUrl(TREE_CORE, 'L1758-L1791')} kind="code">
              unified_tree_core.py L1758-L1791
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TREE_CORE, 'L2018-L2056')} kind="code">
              unified_tree_core.py L2018-L2056
            </Cite>
            . When host memory fills, host-only leaves leave the tree by the same eviction policy{' '}
            <Cite tier={1} href={sglangUrl(FULL, 'L244-L272')} kind="code">
              full.py L244-L272
            </Cite>
            . The model to keep: one tree spans the tiers, and eviction moves a node down a tier.
          </Box>

          <HiCacheTiersDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The node names are an example; the thresholds and the
            timeout formula are the v0.5.22 code defaults cited in this section.
          </Box>

          <Box variant="p">
            A host hit returns to the GPU on its own CUDA stream, one layer at a time, and attention
            for layer i waits only for layer i&apos;s copy, so the transfer overlaps the forward pass{' '}
            <Cite tier={1} href={sglangUrl(CONTROLLER, 'L968-L1009')} kind="code">
              cache_controller.py L968-L1009
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MEM_POOL, 'L2786-L2791')} kind="code">
              memory_pool.py L2786-L2791
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(L2_TRANSFER, 'L51-L58')} kind="code">
              l2_transfer.py L51-L58
            </Cite>
            . Host hits under 10 tokens are not loaded back, and the request prefills those tokens
            again{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L543')} kind="code">
              unified_radix_cache.py L543
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L1785-L1795')} kind="code">
              unified_radix_cache.py L1785-L1795
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L3442-L3478')} kind="code">
              unified_radix_cache.py L3442-L3478
            </Cite>
            .
          </Box>
          <Box variant="p">
            KV events show a demotion to anything subscribed: the GPU eviction arrives as{' '}
            <code>BlockRemoved</code> with medium <code>GPU</code>, while the host copy was
            announced with medium <code>CPU_PINNED</code>, so a router can tell a page that is gone
            from one that moved down a tier{' '}
            <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L261-L267')} kind="code">
              kv_events.py L261-L267
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TREE_CORE, 'L2050')} kind="code">
              unified_tree_core.py L2050
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick a write policy and a prefetch policy knowing what each one costs, and budget the wait v0.5.22 applies to a storage hit"
          >
            When KV moves between tiers, and how long a storage hit waits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--hicache-write-policy</code> decides when a node gets its host copy{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L118-L124')}>
              memory.py L118-L124
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L525-L527')} kind="code">
              unified_radix_cache.py L525-L527
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(TREE_CORE, 'L1099-L1117')} kind="code">
              unified_tree_core.py L1099-L1117
            </Cite>
            :
          </Box>
          <ul>
            <li>
              <code>write_through</code>, the default, copies a node to host memory as it enters
              the tree, asynchronously, so a GPU eviction after that copy lands demotes the node.
            </li>
            <li>
              <code>write_through_selective</code> copies a node at its second hit, so only
              prefixes that recur spend copy bandwidth.
            </li>
            <li>
              <code>write_back</code> copies a node only when its GPU copy is about to be evicted.
            </li>
          </ul>
          <Box variant="p">
            With a storage backend attached, each node goes on to L3 as soon as its host copy lands{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L1714-L1729')} kind="code">
              unified_radix_cache.py L1714-L1729
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L1901-L1930')} kind="code">
              unified_radix_cache.py L1901-L1930
            </Cite>
            .
          </Box>
          <Box variant="p">
            Data comes up from L3 by prefetch into host memory. SGLang starts one only when L3
            holds at least 256 tokens beyond the local match, a threshold the{' '}
            <code>prefetch_threshold</code> key of <code>--hicache-storage-backend-extra-config</code>{' '}
            changes{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L3044-L3049')} kind="code">
              unified_radix_cache.py L3044-L3049
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HYBRID_CTRL, 'L392')} kind="code">
              hybrid_cache_controller.py L392
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L95-L96')}>
              hicache_design.mdx L95-L96
            </Cite>
            . While its prefetch runs, the request stays in the waiting queue and the scheduler
            moves on to the next one{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L4116-L4123')} kind="code">
              scheduler.py L4116-L4123
            </Cite>
            . <code>--hicache-storage-prefetch-policy</code> decides when the wait ends{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L167-L173')}>
              memory.py L167-L173
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L2174-L2193')} kind="code">
              unified_radix_cache.py L2174-L2193
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L98-L103')}>
              hicache_design.mdx L98-L103
            </Cite>
            :
          </Box>
          <ul>
            <li>
              <code>best_effort</code> lets the request run the first time the scheduler reaches
              it, with whatever has arrived.
            </li>
            <li>
              <code>wait_complete</code> waits for the whole prefetch.
            </li>
            <li>
              <code>timeout</code>, the default, waits for the whole prefetch or a time limit,
              whichever comes first, then prefills with what has arrived.
            </li>
          </ul>
          <Box variant="p">
            The time limit is 1 s plus 0.25 s per 1,024 tokens to fetch, with no upper bound{' '}
            <Cite tier={1} href={sglangUrl(HYBRID_CTRL, 'L392-L396')} kind="code">
              hybrid_cache_controller.py L392-L396
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(STORAGE_ATTACH, 'L278-L282')} kind="code">
              storage_attachment.py L278-L282
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L2167-L2172')} kind="code">
              unified_radix_cache.py L2167-L2172
            </Cite>
            . A 128K-token L3 hit may therefore wait about 33 s before its request runs. The
            documentation says the limit is 2 s plus 0.1 s per 1,024 tokens, capped at 30 s by a{' '}
            <code>prefetch_timeout_max</code> key{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L105-L118')} kind="doc-code-conflict">
              hicache_design.mdx L105-L118
            </Cite>
            ; v0.5.22&apos;s code uses the larger defaults, applies no cap and reads no such key, so
            budget TTFT (time to first token) for the code&apos;s formula, and set{' '}
            <code>prefetch_timeout_base</code> and <code>prefetch_timeout_per_ki_token</code>{' '}
            yourself when 33 s is too long.
          </Box>
          <ExpandableSection headerText="The timeout in the documentation and in the code">
            <SpaceBetween size="s">
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                {TIMEOUT_FORMULAS}
              </pre>
              <Box variant="p">
                By our arithmetic, a 128K-token (131,072-token) hit stops at 14.8 s under the
                documented formula and at 33 s under the code&apos;s, and the documented 30 s cap
                would first apply at 286,720 tokens. The parser takes{' '}
                <code>prefetch_threshold</code>, <code>prefetch_timeout_base</code>,{' '}
                <code>prefetch_timeout_per_ki_token</code> and{' '}
                <code>hicache_storage_pass_prefix_keys</code> out of the extra config and hands
                every other key to the backend, as a JSON string or as <code>@file</code> in JSON,
                TOML or YAML{' '}
                <Cite tier={1} href={sglangUrl(HYBRID_CTRL, 'L365-L426')} kind="code">
                  hybrid_cache_controller.py L365-L426
                </Cite>
                . A search for <code>timeout_max</code> across v0.5.22&apos;s{' '}
                <code>python/sglang/srt</code> finds nothing, so a <code>prefetch_timeout_max</code>{' '}
                you pass travels to the backend unused.
              </Box>
              <Box variant="p">
                To size the two keys, take the longest L3 hit you expect and the longest queue wait
                your TTFT budget allows for it, and solve{' '}
                <code>wait = base + per_ki_token * tokens / 1024</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose an L3 backend from the set v0.5.22 ships, and set it up so a second instance finds the pages the first one wrote"
          >
            Storage backends, and how two instances share one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--hicache-storage-backend</code> is unset by default, which keeps HiCache to L1
            and L2{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L145-L166')}>
              memory.py L145-L166
            </Cite>
            . v0.5.22 registers thirteen named backends plus <code>dynamic</code>, which loads a
            class you name in the extra config (<code>backend_name</code>,{' '}
            <code>module_path</code>, <code>class_name</code>){' '}
            <Cite tier={1} href={sglangUrl(BACKEND_FACTORY, 'L204-L276')} kind="code">
              backend_factory.py L204-L276
            </Cite>
            . The documentation covers fewer: the design page lists <code>file</code>,{' '}
            <code>mooncake</code>, <code>hf3fs</code>, <code>nixl</code>, <code>aibrix</code> and{' '}
            <code>dynamic</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L208')} kind="doc-code-conflict">
              hicache_design.mdx L208
            </Cite>
            , and the server-arguments table adds <code>eic</code> and <code>simm</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SERVER_ARGS, 'L2130-L2133')} kind="doc-code-conflict">
              server_arguments.mdx L2130-L2133
            </Cite>
            . The six registered names neither page lists are <code>sim</code>,{' '}
            <code>npu_memcache</code>, <code>mori</code>, <code>shm</code>, <code>tensorcast</code>{' '}
            and <code>seaweedfs</code>. LMCache and FlexKV plug in one level higher:{' '}
            <code>--enable-lmcache</code> and <code>--enable-flexkv</code> select a different tree
            cache with its own tiers{' '}
            <Cite tier={1} href={sglangUrl(REGISTRY, 'L101-L143')} kind="code">
              registry.py L101-L143
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L237-L255')}>
              memory.py L237-L255
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>file</code> is the demonstration backend. It writes to <code>/tmp/hicache</code>{' '}
            unless <code>SGLANG_HICACHE_FILE_BACKEND_STORAGE_DIR</code> or{' '}
            <code>--file-storage-path</code> names another directory, so it stays node-local unless
            that path is a shared mount{' '}
            <Cite tier={1} href={sglangUrl(HICACHE_STORAGE, 'L386-L394')} kind="code">
              hicache_storage.py L386-L394
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L65')}>
              hicache_design.mdx L65
            </Cite>
            .
          </Box>
          <Box variant="p">
            On AWS, the <code>nixl</code> backend&apos;s code reaches Amazon S3 (Simple Storage
            Service). NIXL (NVIDIA Inference Xfer Library) carries file plugins (DeepSeek&apos;s 3FS
            distributed file system, POSIX files, and GDS, GPUDirect Storage) and an{' '}
            <code>OBJ</code> plugin for S3-compatible object stores. Automatic selection tries the
            file plugins first and takes <code>OBJ</code> only when none is present, so name it,
            with <code>SGLANG_HICACHE_NIXL_BACKEND_PLUGIN=OBJ</code> or an active{' '}
            <code>[plugin.obj]</code> section in the NIXL config, and give it a bucket in that
            config or in <code>AWS_DEFAULT_BUCKET</code>; without a bucket the backend is not
            created{' '}
            <Cite tier={1} href={sglangUrl(NIXL_UTILS, 'L70-L84')} kind="code">
              nixl_utils.py L70-L84
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(NIXL_UTILS, 'L118-L185')} kind="code">
              nixl_utils.py L118-L185
            </Cite>
            . We read this path from source and did not run it, and no transfer rate for it was
            located during this research.
          </Box>
          <Box variant="p">
            Two instances that point at one L3 backend find each other&apos;s pages because the
            storage keys are a pure function of the tokens and the request namespace. Each
            page&apos;s key is SHA-256 over the previous page&apos;s digest and this page&apos;s
            token ids, so one key names the whole prefix up to that page{' '}
            <Cite tier={1} href={sglangUrl(MEM_UTILS, 'L142-L175')} kind="code">
              utils.py L142-L175
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HASH_CPP, 'L22-L73')} kind="code">
              hash_binding.cpp L22-L73
            </Cite>
            . A request for a LoRA (low-rank adaptation) adapter carries an <code>extra_key</code>,
            and a tenant can set a <code>cache_salt</code>; either one starts the chain from a seed
            derived from that namespace, so L3 never mixes adapters or tenants{' '}
            <Cite tier={1} href={sglangUrl(MEM_UTILS, 'L125-L152')} kind="code">
              utils.py L125-L152
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two conditions sit on top of that. The instances need the same page size, by our
            reading of the code, because a key covers one page of tokens. And a backend may scope
            its keys further: <code>file</code> appends the model name and, for models without MLA
            (multi-head latent attention), the TP (tensor parallelism) rank and size to every key{' '}
            <Cite tier={1} href={sglangUrl(HICACHE_STORAGE, 'L405-L416')} kind="code">
              hicache_storage.py L405-L416
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HICACHE_STORAGE, 'L464')} kind="code">
              hicache_storage.py L464
            </Cite>
            .
          </Box>
          <Box variant="p">
            A backend can also be attached, swapped or detached on a running server, and its
            contents cleared, through <code>PUT /hicache/storage-backend</code>,{' '}
            <code>DELETE /hicache/storage-backend</code> and{' '}
            <code>POST /hicache/storage-backend/clear</code>{' '}
            <Cite tier={1} href={sglangUrl(HTTP_SERVER, 'L1086-L1160')}>
              http_server.py L1086-L1160
            </Cite>
            . Attach and detach work only on a server started with <code>--admin-api-key</code>{' '}
            and only while the scheduler is idle, with nothing queued or running{' '}
            <Cite tier={1} href={sglangUrl(HTTP_SERVER, 'L1107-L1117')} kind="code">
              http_server.py L1107-L1117
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L5245-L5261')} kind="code">
              scheduler.py L5245-L5261
            </Cite>
            . Section 12, Talking to SGLang: APIs, LoRA adapters and the admin plane, covers the
            keys.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size L2 against the host memory the code checks, read the startup line that reports the size it chose, and keep engines that share a host from crowding each other"
          >
            Sizing the host pool
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            L2 is sized per rank, one GPU worker process each. Outside a PD (prefill/decode) decode
            server it holds twice as many tokens as the GPU pool by default:{' '}
            <code>--hicache-ratio</code> resolves to 2.0, or to 1.2 when{' '}
            <code>--hicache-host-memory-mode buffer_only</code> turns host memory into a staging
            buffer for L3{' '}
            <Cite tier={1} href={sglangUrl(HICACHE_HOOK, 'L81-L107')}>
              hicache_hook.py L81-L107
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L99-L109')}>
              memory.py L99-L109
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOST_POOL, 'L211-L219')} kind="code">
              pool_host/base.py L211-L219
            </Cite>
            . <code>--hicache-size N</code> sets N GB (10^9 bytes) per rank instead, so eight ranks
            at 30 GB take 240 GB of host memory{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L183')}>
              hicache_design.mdx L183
            </Cite>
            .
          </Box>
          <Box variant="p">
            Leave both flags unset and SGLang shrinks the 2.0 default until every rank&apos;s pool
            fits in 80% of the host memory left after a 10 GiB reserve, bounded by the cgroup
            limits it can see; set either flag and auto-sizing is off{' '}
            <Cite tier={1} href={sglangUrl(AUTO_SIZE, 'L82-L125')} kind="code">
              hicache_auto_size.py L82-L125
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOST_POOL, 'L84-L108')} kind="code">
              pool_host/base.py L84-L108
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HICACHE_HOOK, 'L104-L105')} kind="code">
              hicache_hook.py L104-L105
            </Cite>
            . The startup log reports the result on a line that begins{' '}
            <code>{'HiCache auto-sizing: ratio 2.000 ->'}</code>{' '}
            <Cite tier={1} href={sglangUrl(AUTO_SIZE, 'L114-L123')} kind="code">
              hicache_auto_size.py L114-L123
            </Cite>
            . Lower <code>--hicache-host-memory-fraction</code> when several engines share one
            memory cgroup{' '}
            <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L114-L117')}>
              memory.py L114-L117
            </Cite>
            . The flag example on the best-practices page passes both{' '}
            <code>--hicache-ratio 2</code> and <code>--hicache-size 100</code>, so a copy of it
            turns auto-sizing off{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(BEST_PRACTICES, 'L18-L26')}>
              hicache_best_practices.mdx L18-L26
            </Cite>
            .
          </Box>
          <Box variant="p">
            The documentation says <code>--hicache-ratio</code> must be greater than 1, because the
            host pool must be larger than the GPU pool{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DESIGN, 'L181-L183')} kind="doc-code-conflict">
              hicache_design.mdx L181-L183
            </Cite>
            ; v0.5.22&apos;s code starts with a smaller host pool and logs that L2 cache
            effectiveness is reduced{' '}
            <Cite tier={1} href={sglangUrl(HOST_POOL, 'L227-L236')} kind="code">
              pool_host/base.py L227-L236
            </Cite>
            . The limit the code enforces is memory: a pool larger than the free host memory left
            after the reserve, divided among the ranks on the machine, stops startup with{' '}
            <code>Not enough host memory available</code>{' '}
            <Cite tier={1} href={sglangUrl(HOST_POOL, 'L238-L247')} kind="code">
              pool_host/base.py L238-L247
            </Cite>
            . So size the host pool against free host memory, and read a ratio at or below 1 as a
            smaller L2, which the code accepts.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise the two modes that share HiCache's host memory or its eviction order, and when each one fits"
          >
            Two related modes: HiSparse and the session radix cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ExpandableSection headerText="HiSparse: host-resident KV for sparse-attention decode">
            <Box variant="p">
              <code>--enable-hisparse</code> keeps a small hot KV buffer per request on the GPU and
              the complete KV in pinned host memory, and at each decode step swaps in the top-k
              entries the model&apos;s own sparse attention selects{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(HISPARSE_DOC, 'L7-L30')}>
                hisparse_guide.mdx L7-L30
              </Cite>
              . Each request&apos;s GPU buffer defaults to 4,096 tokens, twice the default top-k
              of 2,048{' '}
              <Cite tier={1} href={sglangUrl(SPARSITY_FACTORY, 'L79-L81')} kind="code">
                factory.py L79-L81
              </Cite>
              . The flag accepts DSA (DeepSeek Sparse Attention) models such as DeepSeek V3.2 and
              GLM-5, DeepSeek V4 and MiniMax M3, and requires <code>--disable-radix-cache</code>{' '}
              <Cite tier={1} href={sglangUrl(HISPARSE_HOOK, 'L100-L111')} kind="code">
                hisparse_hook.py L100-L111
              </Cite>
              ; the documentation runs it with PD disaggregation, on the decode instance{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(HISPARSE_DOC, 'L9')}>
                hisparse_guide.mdx L9
              </Cite>
              . It gives up prefix reuse to raise decode concurrency on long contexts, which suits
              a decode server more than shared-prefix traffic; section 15, PD Disaggregation,
              covers that side.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Session radix cache: keeping a conversation ahead in eviction">
            <Box variant="p">
              <code>--enable-session-radix-cache</code>, off by default, ranks KV that an open{' '}
              <code>session_id</code> references behind unreferenced KV when choosing what to evict{' '}
              <Cite tier={1} href={sglangUrl(MEM_FIELDS, 'L86-L89')}>
                memory.py L86-L89
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(FULL, 'L201-L203')} kind="code">
                full.py L201-L203
              </Cite>
              . Pass the same top-level <code>session_id</code> on every turn and call{' '}
              <code>/close_session</code> when the conversation ends; referenced KV goes last but
              is never pinned{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(SESSION_DOC, 'L7-L57')}>
                session_radix_cache.mdx L7-L57
              </Cite>
              . Device and host eviction apply the same preference, so with HiCache on it also
              orders what leaves L2{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(SESSION_DOC, 'L49')}>
                session_radix_cache.mdx L49
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(FULL, 'L244-L256')} kind="code">
                full.py L244-L256
              </Cite>
              . It moves the tree to the Python core, and the startup log says so:{' '}
              <code>
                Using the Python TreeCore: session-aware caching requires the Python TreeCore
              </code>{' '}
              <Cite tier={1} href={sglangUrl(TREE_CORE_REGISTRY, 'L44-L46')} kind="code">
                tree_core_registry.py L44-L46
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(TREE_CORE_REGISTRY, 'L115-L120')} kind="code">
                tree_core_registry.py L115-L120
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start HiCache knowing the defaults you get, confirm from the metrics which tier served each hit, then add L3 with a prefetch wait you chose"
          >
            Bring-up: flags, defaults and the first metrics to read
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={FLAG_ROWS}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r) => r.flag, minWidth: 190 },
              { id: 'def', header: 'Default at v0.5.22', cell: (r) => r.def, minWidth: 170 },
              { id: 'sets', header: 'What it sets', cell: (r) => r.sets, minWidth: 220 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 170 },
            ]}
          />
          <Box variant="p">
            With <code>--enable-metrics</code>, four series show which tier served the hits:
          </Box>
          <ul>
            <li>
              <code>sglang:prefill_effective_tokens_total</code> splits prefill tokens by{' '}
              <code>mode</code> into <code>device_hit</code>, <code>host_hit</code>,{' '}
              <code>storage_hit</code> and <code>input</code>; one hit mode over the sum of all
              modes is that tier&apos;s hit rate{' '}
              <Cite tier={1} href={sglangUrl(COLLECTOR, 'L1008-L1021')} kind="code">
                metrics_collector.py L1008-L1021
              </Cite>
              .
            </li>
            <li>
              <code>sglang:hicache_host_used_tokens</code> against{' '}
              <code>sglang:hicache_host_total_tokens</code> shows how full L2 is{' '}
              <Cite tier={1} href={sglangUrl(COLLECTOR, 'L745-L760')} kind="code">
                metrics_collector.py L745-L760
              </Cite>
              .
            </li>
            <li>
              <code>sglang:prefetched_tokens_total</code> counts tokens fetched from L3 into host
              memory{' '}
              <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2147-L2152')} kind="code">
                metrics_collector.py L2147-L2152
              </Cite>
              .
            </li>
            <li>
              <code>sglang:storage_prefetch_unfulfilled_tokens_total</code> counts L3 hits that
              never became usable, by <code>reason</code>: <code>below_threshold</code> for hits
              under the 256-token trigger, and <code>storage_transfer</code> for prefetches that
              ended short of what they reserved, which is where a prefetch cut off by the timeout
              lands{' '}
              <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2167-L2193')} kind="code">
                metrics_collector.py L2167-L2193
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L2310-L2318')} kind="code">
                unified_radix_cache.py L2310-L2318
              </Cite>
              .
            </li>
          </ul>
          <Box variant="p">
            <strong>Where to start.</strong> Turn on L2 alone first:{' '}
            <code>--enable-hierarchical-cache</code> with <code>--enable-metrics</code>, ratio and
            size unset so auto-sizing picks a pool that fits, then watch the <code>host_hit</code>{' '}
            share of <code>sglang:prefill_effective_tokens_total</code>. By the tier model above,
            L3 earns its place when instances should share prefixes or the reusable set outgrows
            host memory. Then point every instance at the same backend, page size and namespace,
            and set the two timeout keys to the wait your TTFT budget allows, because the default
            lets a 128K-token hit wait about 33 s.
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{BRING_UP}</pre>
          <Box variant="p">
            <strong>Against vLLM:</strong> one tree match in SGLang returns a GPU part and a host
            part, where vLLM&apos;s KV connector answers for blocks its block pool no longer holds.
            Both are opt-in, both write through by default and both reach Mooncake, 3FS and NIXL
            storage; SGLang wires LMCache and FlexKV in as alternative tree caches (
            {VLLM_OFFLOAD_LINK}).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
