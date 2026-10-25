import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../../components/Cite';

const SRT = 'python/sglang/srt';
const MC = `${SRT}/mem_cache`;
const BUILDER = `${MC}/kv_cache_builder.py`;
const REGISTRY = `${MC}/registry.py`;
const URC = `${MC}/unified_radix_cache.py`;
const CORE_REG = `${MC}/unified_cache/tree_core_registry.py`;
const PY_CORE = `${MC}/unified_cache/unified_tree_core.py`;
const PY_FULL = `${MC}/unified_cache/components/full.py`;
const ADAPTER = `${MC}/rust_tree_core/adapter.py`;
const RC = `${MC}/radix_cache.py`;
const COMMON = `${MC}/common.py`;
const ALLOCATION = `${MC}/allocation.py`;
const POOL = `${MC}/memory_pool.py`;
const RUST = 'rust/sglang-radix-tree';
const RUST_CORE = `${RUST}/src/unified_tree_core.rs`;

export function CodebaseRadixMemory() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Follow one cached prefix through the code: the lookup that becomes a hit, and the allocation shortfall that becomes an eviction"
          >
            What a hit and an eviction do
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A hit is an index copy. The scheduler walks the radix tree with the request&apos;s
            tokens, and the KV (key-value) slot indices stored on the matched nodes are written
            into the first positions of the request&apos;s row in the request-to-token table; no K
            or V bytes move. An eviction is the reverse, and it happens only when an allocation
            finds too few free slots: the cache frees whole leaf nodes that no running request
            holds, in the order the eviction policy ranks them, until the shortfall is covered.
          </Box>
          <Box variant="p">
            For a standard model at v0.5.22 both operations run in <code>UnifiedRadixCache</code>,
            and the tree walks inside it run on a Rust tree core by default. The{' '}
            <code>RadixCache</code> class in <code>radix_cache.py</code> is the readable Python form of
            the same walks, so this path reads it alongside the code that serves. Section 5
            (RadixAttention and the Radix Cache) explains the behaviour, section 6 (KV Memory and
            the Defaults Your GPU Picks) sizes the pool, and section 7 (HiCache) adds the host and
            storage tiers. Paths below are relative to{' '}
            <Cite tier={1} href={sglangTreeUrl(SRT)}>
              python/sglang/srt/
            </Cite>{' '}
            unless they start with <code>rust/</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell from the code which cache class and which tree core your server builds, and the conditions that drop it to the Python core"
          >
            Stops 1 to 4: which tree cache a model gets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>
                <code>mem_cache/kv_cache_builder.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(BUILDER, 'L331-L387')}>
                kv_cache_builder.py L331-L387
              </Cite>
              . Owns the inputs. It packs the pools, the page size, the eviction policy and the
              KV event settings into one <code>CacheInitParams</code>, then calls{' '}
              <code>create_tree_cache</code>.
            </li>
            <li>
              <strong>
                <code>mem_cache/registry.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(REGISTRY, 'L83-L146')}>
                registry.py L83-L146
              </Cite>
              . Owns the choice of class. The default chain checks, in order,{' '}
              <code>--disable-radix-cache</code>, LMCache, an external cache linker, all-sliding-window
              models (<code>PureSWARadixCache</code>) and FlexKV, and every other model falls
              through to <code>create_unified_radix_cache</code>. A disabled cache is still a{' '}
              <code>UnifiedRadixCache</code>, built in disabled mode, except for an
              all-sliding-window model.{' '}
              <Cite tier={1} href={sglangUrl(REGISTRY, 'L149-L226')}>
                registry.py L149-L226
              </Cite>{' '}
              gives the tree a FULL component, adds SWA (sliding-window attention) and MAMBA
              components only for hybrid models, and attaches HiCache (hierarchical cache) with{' '}
              <code>init_hicache</code> when it is enabled. <code>--radix-cache-backend</code>{' '}
              replaces the whole chain with a registered factory{' '}
              <Cite tier={1} href={sglangUrl(REGISTRY, 'L229-L244')}>
                registry.py L229-L244
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>mem_cache/unified_radix_cache.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L175-L325')}>
                unified_radix_cache.py L175-L325
              </Cite>
              . Owns the split between Python and the tree core. The constructor builds one
              component object per component type, then asks for a tree core; the comment at L218
              states that the core owns the tree state (structure, LRU (least recently used) lists,
              sizes, evictable leaves). <code>UnifiedRadixCache</code> keeps the orchestration:
              applying the actions the core returns, freeing slots to the allocator, HiCache
              transfers and metrics.
            </li>
            <li>
              <strong>
                <code>mem_cache/unified_cache/tree_core_registry.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(CORE_REG, 'L44-L131')}>
                tree_core_registry.py L44-L131
              </Cite>
              . Owns Rust or Python. The default comes from{' '}
              <code>SGLANG_UNIFIED_RADIX_TREE_CORE_BACKEND</code>, set to <code>rust</code>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/environ.py`, 'L688')}>
                environ.py L688
              </Cite>
              , and the fallback list switches to the Python core for the session radix cache,
              custom or unsupported components, a non-Linux host, PyTorch outside 2.11 to 2.14, a
              device other than CPU or CUDA, or an install with neither the extension nor a usable
              Rust toolchain. Each fallback logs its reason. The Rust side lives in{' '}
              <Cite tier={1} href={sglangTreeUrl(RUST)}>
                rust/sglang-radix-tree/
              </Cite>
              ; its README lists what it implements (match and insert walks, the node arena, locks,
              eviction walks, HiCache backup and load-back, KV events) behind a PyO3 (Rust bindings
              for Python) binding{' '}
              <Cite tier={1} href={sglangUrl(`${RUST}/README.md`, 'L3-L19')}>
                sglang-radix-tree README.md L3-L19
              </Cite>
              , and <code>RustUnifiedTreeCore</code> is the Python adapter over it{' '}
              <Cite tier={1} href={sglangUrl(ADAPTER, 'L324-L345')}>
                rust_tree_core/adapter.py L324-L345
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            The serving path is therefore two layers: <code>UnifiedRadixCache</code> in Python
            decides when to match, insert and evict, and <code>RustUnifiedTreeCore</code> performs
            the walk. <code>SGLANG_UNIFIED_RADIX_TREE_CORE_BACKEND=python</code> swaps in the
            Python <code>UnifiedTreeCore</code> under the same interface, which is the version to
            read or step through in a debugger.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what a node stores and where the KV bytes live, so the index copy that is a hit makes sense before you trace it"
          >
            Stops 5 to 7: the key, the node and the two tables
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={5}>
            <li>
              <strong>
                <code>mem_cache/radix_cache.py</code>, the key
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L59-L82')}>
                radix_cache.py L59-L82
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L147-L151')}>
                L147-L151
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L222-L247')}>
                L222-L247
              </Cite>
              . A <code>RadixKey</code> is the token ids plus two namespaces,{' '}
              <code>extra_key</code> (which carries a LoRA (low-rank adaptation) adapter id) and{' '}
              <code>cache_salt</code>. <code>page_aligned</code> cuts the key to whole pages, and
              the child key that indexes a node&apos;s children is prefixed with the namespace, so
              two namespaces never share a node.
            </li>
            <li>
              <strong>
                <code>mem_cache/radix_cache.py</code>, the node
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L250-L278')}>
                radix_cache.py L250-L278
              </Cite>
              . A <code>TreeNode</code> holds a run of token ids, the matching run of slot indices
              as <code>value</code>, a <code>lock_ref</code> count, access time, hit count,
              priority and page hashes. The root is created with <code>lock_ref = 1</code> and is
              never evicted{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L343-L349')}>
                radix_cache.py L343-L349
              </Cite>
              . The serving tree&apos;s node, <code>UnifiedTreeNode</code>, keeps one record per
              component, each with its own device value, host value and lock count{' '}
              <Cite tier={1} href={sglangUrl(PY_CORE, 'L112-L176')}>
                unified_tree_core.py L112-L176
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/unified_cache/components/base.py`, 'L67-L75')}>
                components/base.py L67-L75
              </Cite>
              , so a hybrid model&apos;s full-attention KV and sliding-window KV share one tree.
            </li>
            <li>
              <strong>
                <code>mem_cache/memory_pool.py</code> and the allocators
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(POOL, 'L374-L410')}>
                memory_pool.py L374-L410
              </Cite>
              . <code>ReqToTokenPool</code> is a 2-D int32 tensor, one row per request slot and one
              column per position, each entry a KV slot index; row 0 is a padding row for CUDA
              graph dummy batches. The slot index addresses the per-layer buffers: one K and one V
              tensor per layer for MHA (multi-head attention) models{' '}
              <Cite tier={1} href={sglangUrl(POOL, 'L2518-L2583')}>
                memory_pool.py L2518-L2583
              </Cite>
              , one latent buffer per layer for MLA (multi-head latent attention) models{' '}
              <Cite tier={1} href={sglangUrl(POOL, 'L4728-L4743')}>
                memory_pool.py L4728-L4743
              </Cite>
              . Page size 1 gets <code>TokenToKVPoolAllocator</code> unless DCP (decode context
              parallelism) is on; any other page size gets{' '}
              <code>PagedTokenToKVPoolAllocator</code>{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/kv_cache_configurator.py`, 'L2595-L2618')}>
                kv_cache_configurator.py L2595-L2618
              </Cite>
              . Both keep their free list as a GPU tensor: the token allocator hands out any{' '}
              <em>n</em> slots{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/allocator/token.py`, 'L42-L75')}>
                allocator/token.py L42-L75
              </Cite>
              , the paged one whole pages expanded to slot indices{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/allocator/paged.py`, 'L181-L202')}>
                allocator/paged.py L181-L202
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            How many slots the pool has is section 6&apos;s subject: free memory after the weights
            load, minus the non-static share{' '}
            <Cite tier={1} href={sglangUrl(`${MC}/kv_cache_configurator.py`, 'L2671-L2741')}>
              kv_cache_configurator.py L2671-L2741
            </Cite>
            , divided by the bytes one token costs and rounded down to whole pages{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/model_executor/pool_configurator.py`, 'L614-L624')}>
              pool_configurator.py L614-L624
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace a request from the tree lookup to the row write that is its hit, and to the insert that publishes its KV for the next request"
          >
            Stops 8 to 11: a hit, the lock, and the insert
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={8}>
            <li>
              <strong>
                <code>mem_cache/common.py</code>, the match
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(COMMON, 'L203-L250')}>
                common.py L203-L250
              </Cite>
              . <code>match_kv_cache</code> is the scheduler&apos;s entry: it builds the key from
              the prompt and output ids, calls <code>match_prefix</code>, and records the matched
              length and the last matched node on the request.{' '}
              <code>UnifiedRadixCache.match_prefix</code> hands the walk to the tree core and
              applies any action it returns, such as moving a pending write-through after a node
              split{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L580-L599')}>
                unified_radix_cache.py L580-L599
              </Cite>
              . The Rust walk first rounds the key length down to whole pages{' '}
              <Cite tier={1} href={sglangUrl(RUST_CORE, 'L1254-L1282')}>
                unified_tree_core.rs L1254-L1282
              </Cite>
              . The readable form is <code>_match_prefix_helper</code> and{' '}
              <code>_split_node</code>: descend one child per step by the first page of the
              remaining key, compare the whole edge, and split the node when the match ends inside
              it{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L651-L700')}>
                radix_cache.py L651-L700
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>managers/schedule_policy.py</code>, the lock
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/managers/schedule_policy.py`, 'L1591')}>
                schedule_policy.py L1591
              </Cite>
              . Admission locks the matched node. Locking walks to the root and raises{' '}
              <code>lock_ref</code> on every node of the path; the first lock on a node moves its
              tokens from evictable to protected, which is why a running request&apos;s prefix
              can never be evicted{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L582-L616')}>
                radix_cache.py L582-L616
              </Cite>
              . In the serving class, <code>inc_lock_ref</code>, <code>dec_lock_ref</code> and the{' '}
              <code>lock</code> pair forward to the tree core{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L993-L1022')}>
                unified_radix_cache.py L993-L1022
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>mem_cache/allocation.py</code>, the hit itself
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(ALLOCATION, 'L56-L105')} kind="code">
                allocation.py L56-L105
              </Cite>
              . <code>write_cache_indices</code> writes the matched slot indices into positions{' '}
              <code>[0, prefix_len)</code> of the request&apos;s row and the newly allocated slots
              after them. This is the whole cost of a hit: one row write, the same size for a small
              model and a large one.
            </li>
            <li>
              <strong>
                <code>mem_cache/common.py</code> and <code>radix_cache.py</code>, the insert
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(COMMON, 'L253-L262')}>
                common.py L253-L262
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(COMMON, 'L378-L422')}>
                L378-L422
              </Cite>
              . KV enters the tree at two points: <code>checkpoint_kv_cache</code> after a prefill
              chunk, and <code>release_kv_cache</code> when the request finishes, which inserts,
              frees the row and drops the lock. <code>_insert_cache</code> inserts the page-aligned key,
              splits the leaf at the prompt boundary so the output can be evicted before the prompt
              (L485-L502), and frees the slots the request computed for tokens another request had
              already cached{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L450-L508')}>
                radix_cache.py L450-L508
              </Cite>
              . <code>_insert_helper</code> walks the shared path and adds one leaf for the new
              tail{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L705-L760')}>
                radix_cache.py L705-L760
              </Cite>
              ; the serving class drives the same walk as a resumable insert on the tree core{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L618-L639')}>
                unified_radix_cache.py L618-L639
              </Cite>
              .
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace what runs when an allocation is short: the shortfall, the heap of leaves no request holds, and the policy key that orders it"
          >
            Stops 12 to 15: an eviction
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={12}>
            <li>
              <strong>
                <code>mem_cache/allocation.py</code> and <code>allocator/base.py</code>, the trigger
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(ALLOCATION, 'L152-L194')}>
                allocation.py L152-L194
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/allocator/base.py`, 'L144-L158')}>
                allocator/base.py L144-L158
              </Cite>
              . Every extend and decode allocation first calls{' '}
              <code>evict_from_tree_cache</code>, and the allocator computes{' '}
              <code>shortfall = num_tokens - available_size()</code> and asks the cache to evict
              only that. Nothing evicts in the background.
            </li>
            <li>
              <strong>
                <code>mem_cache/unified_radix_cache.py</code>, the driver
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L646-L714')}>
                unified_radix_cache.py L646-L714
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L872-L974')}>
                L872-L974
              </Cite>
              . <code>evict_for_alloc</code> turns the shortfall into a target free size per
              component, and <code>_evict_components</code> loops: ask the core for the next victim,
              evict it, and stop at the first victim after which the target is met.
            </li>
            <li>
              <strong>
                <code>rust/sglang-radix-tree/src/components/full.rs</code>, the victim
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${RUST}/src/components/full.rs`, 'L139-L197')}>
                components/full.rs L139-L197
              </Cite>
              . The FULL component builds a heap over the evictable device leaves, keyed by the
              policy, pops the lowest, and re-admits that leaf&apos;s parent once the parent has
              become an evictable leaf itself. The Python core runs the same loop{' '}
              <Cite tier={1} href={sglangUrl(PY_FULL, 'L205-L243')}>
                components/full.py L205-L243
              </Cite>
              , and <code>RadixCache.evict</code> shows it whole in one function: pop, free the
              leaf&apos;s entire slot run, delete it, push the parent{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L552-L580')}>
                radix_cache.py L552-L580
              </Cite>
              . The leaf is freed in full, so one eviction can free more than the shortfall.
            </li>
            <li>
              <strong>
                <code>mem_cache/evict_policy.py</code>, the order
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${MC}/evict_policy.py`, 'L10-L100')}>
                evict_policy.py L10-L100
              </Cite>
              . Each policy is one small class whose <code>get_priority</code> returns a sort key;
              the lowest key goes first. The Rust core carries the same set behind one factory{' '}
              <Cite tier={1} href={sglangUrl(`${RUST}/src/unified_lru_list.rs`, 'L410-L563')}>
                unified_lru_list.rs L410-L563
              </Cite>
              . A policy only orders leaves that no request holds; locks, not policies, keep KV
              resident.
            </li>
          </ol>
          <ExpandableSection headerText="With HiCache on: the eviction step demotes instead of deleting">
            <Box variant="p">
              Each eviction step calls <code>evict_device_leaf</code>. A leaf with a host copy is
              demoted: its GPU slots are freed and the node stays in the tree as host-only, with a
              GPU <code>BlockRemoved</code> KV event. A leaf without one is deleted under
              write-through, or handed back for a host backup first under write-back{' '}
              <Cite tier={1} href={sglangUrl(PY_CORE, 'L1758-L1791')}>
                unified_tree_core.py L1758-L1791
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(PY_CORE, 'L2018-L2056')}>
                L2018-L2056
              </Cite>
              . Without HiCache no node has a host copy, so every victim is deleted.{' '}
              <code>init_hicache</code> sets up the controller, the write-through threshold and the
              10-token floor below which a host hit is not loaded back{' '}
              <Cite tier={1} href={sglangUrl(URC, 'L426-L559')}>
                unified_radix_cache.py L426-L559
              </Cite>
              , and the cache controller copies a host hit back one layer at a time{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/managers/cache_controller.py`, 'L968-L1009')}>
                cache_controller.py L968-L1009
              </Cite>
              . Section 7 (HiCache) covers the policies.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> vLLM&apos;s counterpart path is a block pool with a hash
            map and a free queue, where a hit reuses block ids and eviction pops single blocks
            from the head of the queue; SGLang&apos;s tree evicts whole leaves by a selectable
            policy (
            <Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>;{' '}
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm at startup which cache class and tree core you got, and that the cache is on, before you read any hit-rate metric"
          >
            The check: two startup lines and one flag
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>create_tree_cache</code> logs the class it built. For a dense full-attention
            model with HiCache off, the line reads:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            {`Tree cache initialized: source=default impl=UnifiedRadixCache hybrid_swa=False hybrid_ssm=False hicache_attached=False`}
          </pre>
          <Box variant="small" color="text-body-secondary">
            Format from{' '}
            <Cite tier={1} href={sglangUrl(REGISTRY, 'L297-L306')}>
              registry.py L297-L306
            </Cite>
            ; values filled in for a dense model at default flags, by our reading of the default
            chain, not copied from a running server.
          </Box>
          <Box variant="p">
            <code>source=registered(...)</code> means <code>--radix-cache-backend</code> chose the
            factory; another <code>impl</code>, such as <code>PureSWARadixCache</code>, means the
            model took a different branch of the chain; <code>hicache_attached=True</code> means
            the host tier is on. Just before it, the cache logs its tree core, ending{' '}
            <code>Tree Core: RustUnifiedTreeCore</code> on the default path{' '}
            <Cite tier={1} href={sglangUrl(URC, 'L321-L325')}>
              unified_radix_cache.py L321-L325
            </Cite>
            . <code>Tree Core: UnifiedTreeCore</code> means the Python core, and a fallback is
            announced by <code>Using the Python TreeCore:</code> followed by its reason{' '}
            <Cite tier={1} href={sglangUrl(CORE_REG, 'L109-L121')}>
              tree_core_registry.py L109-L121
            </Cite>
            .
          </Box>
          <Box variant="p">
            The line reads the same when the cache is off, because{' '}
            <code>--disable-radix-cache</code> builds a <code>UnifiedRadixCache</code> in disabled
            mode{' '}
            <Cite tier={1} href={sglangUrl(REGISTRY, 'L91-L99')}>
              registry.py L91-L99
            </Cite>
            . Startup also turns the cache off for some configurations, multi-item scoring among
            them{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/attention_hook.py`, 'L555-L561')} kind="code">
              attention_hook.py L555-L561
            </Cite>
            ; a PD (prefill/decode) decode server turns it off unless you pass{' '}
            <code>--disaggregation-decode-enable-radix-cache</code>, and logs{' '}
            <code>Radix cache is disabled for decode server</code>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/pd_disaggregation_hook.py`, 'L98-L134')}>
              pd_disaggregation_hook.py L98-L134
            </Cite>
            . So read <code>disable_radix_cache</code> on the <code>server_args=</code> line as well{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/entrypoints/engine.py`, 'L1179')} kind="code">
              engine.py L1179
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Run it:</strong> start the server, search the log for{' '}
            <code>Tree cache initialized</code> and <code>Tree Core:</code>, and confirm{' '}
            <code>impl=UnifiedRadixCache</code>, <code>RustUnifiedTreeCore</code> and{' '}
            <code>disable_radix_cache</code> set to false. Then open stop 13 and stop 14 for the
            eviction you are about to tune.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
