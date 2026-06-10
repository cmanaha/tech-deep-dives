import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';

interface KnobRow {
  knob: string;
  config: string;
  meaning: string;
  dflt: string;
}

const knobRows: KnobRow[] = [
  {
    knob: 'block_size',
    config: 'CacheConfig',
    meaning: 'Tokens per KV block. The paging granularity for the whole pool.',
    dflt: '16',
  },
  {
    knob: 'gpu_memory_utilization',
    config: 'CacheConfig',
    meaning:
      'Fraction of GPU memory the executor may use. What is left after weights becomes the block pool, i.e. how many blocks exist.',
    dflt: '0.92',
  },
  {
    knob: 'enable_prefix_caching',
    config: 'CacheConfig',
    meaning: 'Turns on block-hash lookup and LRU reuse of finished blocks across requests.',
    dflt: 'True',
  },
  {
    knob: 'prefix_caching_hash_algo',
    config: 'CacheConfig',
    meaning:
      'Hash function for block hashing: "sha256" (Pickle), "sha256_cbor"/"xxhash_cbor" (reproducible cross-language), or "xxhash" (faster, non-cryptographic).',
    dflt: '"sha256"',
  },
  {
    knob: 'num_gpu_blocks_override',
    config: 'CacheConfig',
    meaning: 'Force the pool size instead of profiling it. Docstring says it exists "for testing preemption".',
    dflt: 'None',
  },
  {
    knob: 'max_num_batched_tokens',
    config: 'SchedulerConfig',
    meaning: 'The per-step token budget: the single number that bounds prefill + decode work in one iteration.',
    dflt: '2048 (testing default; set by EngineArgs in real use)',
  },
  {
    knob: 'max_num_seqs',
    config: 'SchedulerConfig',
    meaning: 'Maximum sequences processed in one iteration: the batch-width cap, separate from the token cap.',
    dflt: '128',
  },
  {
    knob: 'enable_chunked_prefill',
    config: 'SchedulerConfig',
    meaning: 'Allow a prompt to be split across steps so a long prefill cannot starve in-flight decodes.',
    dflt: 'True',
  },
];

function BlockPoolDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 760 340"
        width="100%"
        role="img"
        aria-labelledby="blockpool-title blockpool-desc"
        style={{ maxWidth: '760px', height: 'auto', fontFamily: 'monospace' }}
      >
        <title id="blockpool-title">
          BlockPool, intrusive free queue, block-hash map, and per-request block tables
        </title>
        <desc id="blockpool-desc">
          A single pool of fixed-size KV blocks. A doubly linked free queue orders eviction
          candidates LRU-first. A hash map indexes cached full blocks. Each request owns an
          append-only block table that maps logical positions to physical block ids, with a
          null block sentinel at id zero.
        </desc>

        {/* BlockPool row of physical blocks */}
        <text x="10" y="24" fontSize="13" fontWeight="bold" fill="#16191f">
          BlockPool: num_gpu_blocks fixed-size blocks
        </text>
        {[
          { id: '0', label: 'null', fill: '#fde2e4' },
          { id: '1', label: 'free', fill: '#e9f7ef' },
          { id: '2', label: 'req A', fill: '#e7f0fb' },
          { id: '3', label: 'req A', fill: '#e7f0fb' },
          { id: '4', label: 'req B', fill: '#fbf3e0' },
          { id: '5', label: 'free', fill: '#e9f7ef' },
          { id: '6', label: 'cached', fill: '#efe7fb' },
          { id: 'N', label: 'free', fill: '#e9f7ef' },
        ].map((b, i) => (
          <g key={b.id} transform={`translate(${10 + i * 93}, 36)`}>
            <rect width="84" height="46" rx="4" fill={b.fill} stroke="#879596" />
            <text x="42" y="20" fontSize="11" textAnchor="middle" fill="#16191f">
              #{b.id}
            </text>
            <text x="42" y="36" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              {b.label}
            </text>
          </g>
        ))}

        {/* FreeKVCacheBlockQueue */}
        <text x="10" y="120" fontSize="13" fontWeight="bold" fill="#16191f">
          FreeKVCacheBlockQueue: intrusive doubly linked list, O(1) ops
        </text>
        <g transform="translate(10, 132)">
          <rect width="60" height="40" rx="4" fill="#f4f4f4" stroke="#879596" />
          <text x="30" y="24" fontSize="10" textAnchor="middle" fill="#5f6b7a">
            head
          </text>
          {['#1', '#5', '#N'].map((id, i) => (
            <g key={id} transform={`translate(${90 + i * 110}, 0)`}>
              <rect width="80" height="40" rx="4" fill="#e9f7ef" stroke="#879596" />
              <text x="40" y="24" fontSize="11" textAnchor="middle" fill="#16191f">
                {id}
              </text>
            </g>
          ))}
          <g transform="translate(420, 0)">
            <rect width="60" height="40" rx="4" fill="#f4f4f4" stroke="#879596" />
            <text x="30" y="18" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              tail
            </text>
            <text x="30" y="32" fontSize="9" textAnchor="middle" fill="#5f6b7a">
              (LRU/evict)
            </text>
          </g>
          {[70, 180, 290, 400].map((x) => (
            <line key={x} x1={x} y1="20" x2={x + 20} y2="20" stroke="#5f6b7a" strokeWidth="1.5" />
          ))}
        </g>

        {/* Hash map */}
        <text x="10" y="216" fontSize="13" fontWeight="bold" fill="#16191f">
          cached_block_hash_to_block
        </text>
        <g transform="translate(10, 226)">
          <rect width="330" height="44" rx="4" fill="#efe7fb" stroke="#879596" />
          <text x="12" y="20" fontSize="10" fill="#16191f">
            hash((parent_hash, token_ids, extra_keys))
          </text>
          <text x="12" y="36" fontSize="10" fill="#5f6b7a">
            {'→'} KVCacheBlock #6 (full, ref_cnt may be 0)
          </text>
        </g>

        {/* req_to_blocks block tables */}
        <text x="380" y="216" fontSize="13" fontWeight="bold" fill="#16191f">
          req_to_blocks: append-only block tables
        </text>
        <g transform="translate(380, 226)">
          <text x="0" y="14" fontSize="10" fill="#5f6b7a">
            req A:
          </text>
          {['2', '3'].map((id, i) => (
            <g key={id} transform={`translate(${48 + i * 44}, 0)`}>
              <rect width="40" height="22" rx="3" fill="#e7f0fb" stroke="#879596" />
              <text x="20" y="15" fontSize="10" textAnchor="middle" fill="#16191f">
                #{id}
              </text>
            </g>
          ))}
          <text x="0" y="42" fontSize="10" fill="#5f6b7a">
            req B:
          </text>
          {['0', '4'].map((id, i) => (
            <g key={id} transform={`translate(${48 + i * 44}, 28)`}>
              <rect width="40" height="22" rx="3" fill={id === '0' ? '#fde2e4' : '#fbf3e0'} stroke="#879596" />
              <text x="20" y="15" fontSize="10" textAnchor="middle" fill="#16191f">
                #{id}
              </text>
            </g>
          ))}
          <text x="0" y="74" fontSize="9.5" fill="#5f6b7a">
            position-stable; #0 = null_block sentinel for skipped slots
          </text>
        </g>

        <text x="10" y="330" fontSize="9.5" fill="#879596">
          Control state is entirely CPU-side. The GPU only ever sees the resulting integer block ids.
        </text>
      </svg>
    </Box>
  );
}

function SchedulerStateDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 720 220"
        width="100%"
        role="img"
        aria-labelledby="schedstate-title schedstate-desc"
        style={{ maxWidth: '720px', height: 'auto', fontFamily: 'sans-serif' }}
      >
        <title id="schedstate-title">vLLM request lifecycle state machine</title>
        <desc id="schedstate-desc">
          A request moves from WAITING to RUNNING when the scheduler can allocate KV slots
          within the token budget. Under memory pressure a RUNNING request is preempted back
          to PREEMPTED, which re-enters the front of the waiting queue. RUNNING requests reach
          FINISHED on completion.
        </desc>

        {[
          { x: 40, y: 90, w: 130, label: 'WAITING', fill: '#f4f4f4' },
          { x: 300, y: 90, w: 130, label: 'RUNNING', fill: '#e9f7ef' },
          { x: 560, y: 20, w: 130, label: 'FINISHED', fill: '#e7f0fb' },
          { x: 300, y: 160, w: 130, label: 'PREEMPTED', fill: '#fde2e4' },
        ].map((s) => (
          <g key={s.label} transform={`translate(${s.x}, ${s.y})`}>
            <rect width={s.w} height="44" rx="8" fill={s.fill} stroke="#879596" strokeWidth="1.5" />
            <text x={s.w / 2} y="27" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#16191f">
              {s.label}
            </text>
          </g>
        ))}

        <defs>
          <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        {/* WAITING -> RUNNING */}
        <line x1="170" y1="112" x2="298" y2="112" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="234" y="104" fontSize="10.5" textAnchor="middle" fill="#5f6b7a">
          allocate_slots OK
        </text>

        {/* RUNNING -> FINISHED */}
        <line x1="430" y1="100" x2="558" y2="48" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="500" y="64" fontSize="10.5" textAnchor="middle" fill="#5f6b7a">
          EOS / max_tokens
        </text>

        {/* RUNNING -> PREEMPTED */}
        <line x1="365" y1="134" x2="365" y2="158" stroke="#d13212" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="372" y="151" fontSize="10.5" fill="#d13212">
          no free blocks
        </text>

        {/* PREEMPTED -> WAITING (recompute, prepend) */}
        <path
          d="M300,182 C180,182 105,150 105,136"
          fill="none"
          stroke="#d13212"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <text x="150" y="200" fontSize="10.5" textAnchor="middle" fill="#d13212">
          free() blocks, num_computed_tokens = 0, prepend to waiting
        </text>
      </svg>
    </Box>
  );
}

export function CodebaseScheduler() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="The continuous-batching loop and the CPU-side memory manager that feeds it (vllm/v1/core/, commit 15652a6b, accessed 2026-06-07)"
          >
            Scheduler and KV cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape of the loop.</strong> vLLM&apos;s V1 scheduler has no
            separate &quot;prefill phase&quot; and &quot;decode phase&quot;. As the comment
            at the top of <code>Scheduler.schedule()</code> states, every request only carries
            a <code>num_computed_tokens</code> counter and a target
            <code>num_tokens_with_spec</code>; each step the scheduler simply hands out tokens
            so that computed catches up to target. Prefill, decode, chunked prefill,
            speculative decode, and prefix-cache reuse all fall out of that one abstraction
            (<code>vllm/v1/core/sched/scheduler.py</code>).
          </Box>
          <Box variant="p">
            <strong>One budget governs the step.</strong> Each call seeds a single
            <code>token_budget = self.max_num_scheduled_tokens</code> (which defaults to
            <code>max_num_batched_tokens</code>). The loop first walks the RUNNING queue
            decrementing that budget per request, then admits WAITING requests against
            whatever budget remains. A long prompt does not have to fit in one step: with
            chunked prefill enabled, <code>num_new_tokens</code> is clamped to the remaining
            budget (<code>num_new_tokens = min(num_new_tokens, token_budget)</code>), so a
            partial chunk is scheduled now and the rest next step. This is what stops one big
            prefill from starving in-flight decodes.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The KV block pool is pure CPU bookkeeping</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The most important thing to internalize about vLLM&apos;s memory management is
            that <strong>the entire control path is CPU-side</strong>. The
            <code>BlockPool</code>, the free queue, the hash map, and the per-request block
            tables are all plain Python objects. None of these structures touch GPU memory;
            the GPU kernels only ever receive the resulting integer block ids. Paging here
            means &quot;which physical block id does logical position <em>p</em> of this
            request map to&quot;, computed on the host.
          </Box>
          <BlockPoolDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">BlockPool</Box>
              <Box variant="p">
                Owns <code>num_gpu_blocks</code> <code>KVCacheBlock</code> objects, the
                <code>free_block_queue</code>, and <code>cached_block_hash_to_block</code>.
                <code>get_new_blocks()</code> pops from the free queue and bumps
                <code>ref_cnt</code>; <code>free_blocks()</code> decrements and returns blocks
                whose count hit zero (<code>vllm/v1/core/block_pool.py</code>).
              </Box>
            </div>
            <div>
              <Box variant="h3">FreeKVCacheBlockQueue</Box>
              <Box variant="p">
                An <strong>intrusive doubly linked list</strong> built directly on the
                <code>prev_free_block</code> / <code>next_free_block</code> fields of each
                block. It exists instead of a <code>deque</code> specifically to support
                <code>remove()</code> from the middle in O(1) and to allocate no Python
                objects on the hot path (no GC pressure)
                (<code>vllm/v1/core/kv_cache_utils.py</code>, <code>KVCacheBlock</code>).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            The free queue doubles as the <strong>eviction order</strong>. When prefix
            caching is on, a freed-but-still-cached block sits in the queue as an eviction
            candidate; the tail is the least-recently-used. Allocation pops from the head, and
            <code>_maybe_evict_cached_block()</code> drops that block&apos;s hash on reuse.
            That is the whole LRU mechanism, with no separate eviction thread.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Block tables: append-only, with a null sentinel</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Each request&apos;s mapping lives in <code>req_to_blocks</code>, a
            <code>dict[str, list[KVCacheBlock]]</code> in
            <code>SingleTypeKVCacheManager</code>
            (<code>vllm/v1/core/single_type_kv_cache_manager.py</code>).
            <code>allocate_new_blocks()</code> only ever <em>extends</em> that list. vLLM
            deliberately does not de-duplicate identical cached blocks, and the comment in
            <code>BlockHashToBlockMap</code> spells out why: keeping allocated block ids
            stable is what makes <strong>block tables append-only</strong>, which keeps the
            GPU-side index arrays cheap to update.
          </Box>
          <Box variant="p">
            When positions must be skipped (e.g. tokens outside a sliding window),
            <code>remove_skipped_blocks()</code> overwrites the slot with
            <code>null_block</code> rather than shifting the list, preserving position
            stability. The null block is special: it is popped from the free queue at pool
            construction and gets <code>block_id == 0</code>, with <code>is_null = True</code>
            and a ref count that is intentionally not tracked
            (<code>vllm/v1/core/block_pool.py</code>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Prefix-cache block hashing</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            A block becomes reusable across requests once it is full and hashed. The hash is a
            chain: <code>hash_fn((parent_block_hash, token_ids, extra_keys))</code>, computed
            by <code>hash_block_tokens()</code>. Chaining the parent hash means a block&apos;s
            identity encodes its <em>entire</em> prefix, so two requests share a cached block
            only when every preceding token matches as well.
          </Box>
          <Alert type="warning" header="The root seed is process-local by default">
            The chain root, <code>NONE_HASH</code>, is initialized in
            <code>init_none_hash()</code>: when <code>PYTHONHASHSEED</code> is unset it is
            <code>os.urandom(32)</code>, a fresh random 32 bytes per process. So prefix-cache
            block hashes are <strong>not reproducible across processes by default</strong>,
            mirroring Python&apos;s own randomized <code>hash()</code>. The code logs a warning
            for CBOR-based hash functions and tells you to set <code>PYTHONHASHSEED</code> if
            you need cross-process reproducibility (<code>vllm/v1/core/kv_cache_utils.py</code>).
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">extra_keys isolate context</Box>
              <Box variant="p">
                <code>generate_block_hash_extra_keys()</code> folds in the LoRA name,
                multimodal feature identifiers, and the request&apos;s
                <code>cache_salt</code> into the hash. The salt is only attached to the first
                block (<code>start_token_idx == 0</code>), which is enough to fork the whole
                chain, so a salt cleanly <strong>isolates tenants</strong> that would
                otherwise share an identical text prefix.
              </Box>
            </div>
            <div>
              <Box variant="h3">Lookup is CPU-side too</Box>
              <Box variant="p">
                Hashes are precomputed on the <code>Request</code> as tokens arrive.
                <code>KVCacheManager.get_computed_blocks()</code> calls
                <code>find_longest_cache_hit()</code> over those hashes against the in-memory
                map, a host-side dictionary walk. A &quot;cache hit&quot; reuses an existing
                block id; no KV data is copied on the GPU
                (<code>vllm/v1/core/kv_cache_manager.py</code>).
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Preemption is recompute-only</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            When the running loop calls <code>allocate_slots()</code> and it returns
            <code>None</code> (not enough free blocks), the scheduler preempts. Under FCFS it
            pops the <em>last</em> running request; under the priority policy it preempts the
            lowest-priority one. Either way it then loops and retries the allocation, possibly
            preempting several requests until the current one fits, or until there is nothing
            left to preempt and it gives up on scheduling this request this step.
          </Box>
          <SchedulerStateDiagram />
          <Box variant="p">
            Crucially, <code>_preempt_request()</code> does <strong>not</strong> swap KV cache
            to host memory. It calls <code>kv_cache_manager.free(request)</code> (returning
            the blocks straight to the pool), sets <code>num_computed_tokens = 0</code>,
            flips status to <code>PREEMPTED</code>, and <code>prepend_request()</code>s the
            request to the <em>front</em> of the waiting queue. There is no CPU swap path in
            V1; recovery is <strong>recompute-only</strong>
            (<code>vllm/v1/core/sched/scheduler.py</code>).
          </Box>
          <Alert type="info">
            Recompute is <strong>best-effort cheap</strong>, not free. Because the freed blocks
            may still be cached and the request re-enters at the front of the queue, the prefix
            cache often lets it skip recomputing most of its prompt, but only if those blocks
            survived eviction in the meantime. There is no guarantee; the prefix cache is an
            optimization layered on top of the recompute fallback, not a swap substitute.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The knobs that govern all of this</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            These are the <code>CacheConfig</code> and <code>SchedulerConfig</code> fields that
            most directly shape the behavior above: block geometry, pool size, caching, and
            the per-step budget (<code>vllm/config/cache.py</code>,
            <code>vllm/config/scheduler.py</code>).
          </Box>
          <Table
            items={knobRows}
            columnDefinitions={[
              { id: 'knob', header: 'Knob', cell: (r) => <code>{r.knob}</code>, minWidth: 200 },
              { id: 'config', header: 'Config', cell: (r) => r.config },
              { id: 'meaning', header: 'What it controls', cell: (r) => r.meaning, minWidth: 280 },
              { id: 'dflt', header: 'Default', cell: (r) => r.dflt },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Defaults read from the field definitions at commit 15652a6b. The testing defaults
            for <code>max_num_batched_tokens</code> / <code>max_num_seqs</code> are overridden
            by <code>EngineArgs.create_engine_config</code> in real deployments, as the
            docstrings note.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Reference: KVCacheManager</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <code>KVCacheManager</code> is the seam between the scheduler and the block
            machinery. It hides the internal data structures behind a small surface:
            <code>get_computed_blocks()</code> (prefix-cache lookup),
            <code>allocate_slots()</code> (the allocate-or-fail call the loop relies on),
            <code>free()</code>, and <code>get_block_ids()</code>. It returns
            <code>KVCacheBlocks</code> rather than raw blocks so the scheduler never sees a
            <code>KVCacheBlock</code> directly (<code>vllm/v1/core/kv_cache_manager.py</code>).
          </Box>
          <ExpandableSection headerText="An honest rough edge (real in-code TODO)">
            <SpaceBetween size="s">
              <Box variant="p">
                In <code>_update_requests_with_invalid_blocks()</code>, the code that handles
                blocks invalidated by a failed KV transfer unpacks the block ids assuming a
                single KV cache group:
              </Box>
              <Box variant="code">
                {'# TODO (davidb): add support for hybrid memory allocator'}
                <br />
                {'(req_block_ids,) = self.kv_cache_manager.get_block_ids(req_id)'}
              </Box>
              <Box variant="p">
                The single-element tuple unpack will raise for hybrid models that produce more
                than one KV cache group (e.g. mixed full + sliding-window attention). It is a
                known, labeled gap in the connector error-recovery path, not a silent
                assumption (<code>vllm/v1/core/sched/scheduler.py</code>). A related
                <code>FIXME</code> sits on <code>KVCacheManager.prefix_cache_stats</code>,
                where stats collection is not yet made conditional on <code>log_stats</code>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="small">
            All file paths and symbols verified against the vLLM source at commit{' '}
            <Link external href="https://github.com/vllm-project/vllm/tree/15652a6b">
              15652a6b
            </Link>{' '}
            (accessed 2026-06-07).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
