import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import { Cite, vllmUrl } from '../../components/Cite';

const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

interface KnobRow {
  knob: string;
  config: string;
  meaning: string;
  dflt: string;
  source: ReactNode;
}

const knobRows: KnobRow[] = [
  {
    knob: 'block_size',
    config: 'CacheConfig',
    meaning: 'Tokens per KV block: the paging granularity for the whole pool.',
    dflt:
      '--block-size when set; otherwise 16, or the size the selected attention backends prefer. Hybrid models re-align it.',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L683-L697')}>
        interface.py L683-L697
      </Cite>
    ),
  },
  {
    knob: 'prefix_match_unit',
    config: 'CacheConfig',
    meaning:
      'Finest token boundary a prefix-cache hit can land on. Hits inside a physical block happen only on hybrid models with a Mamba group in align mode.',
    dflt: 'None: the GCD of the KV cache group block sizes on multi-group models, the block size otherwise',
    source: (
      <>
        <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L750-L755')}>
          kv_cache_utils.py L750-L755
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L687-L704')}>
          kv_cache_coordinator.py L687-L704
        </Cite>
      </>
    ),
  },
  {
    knob: 'gpu_memory_utilization',
    config: 'CacheConfig',
    meaning:
      'Fraction of GPU memory the executor may use. What is left after weights becomes the block pool, i.e. how many blocks exist.',
    dflt: '0.92',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L103')}>
        cache.py L103
      </Cite>
    ),
  },
  {
    knob: 'enable_prefix_caching',
    config: 'CacheConfig',
    meaning: 'Turns on block-hash lookup and LRU reuse of finished blocks across requests.',
    dflt: 'True',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
        cache.py L142
      </Cite>
    ),
  },
  {
    knob: 'prefix_caching_hash_algo',
    config: 'CacheConfig',
    meaning:
      'Block hash function: "sha256" (Pickle), "sha256_cbor" (canonical CBOR, Concise Binary Object Representation, cross-language), "xxhash" or "xxhash_cbor" (faster, non-cryptographic). It also decides whether separate processes share the chain root.',
    dflt: '"sha256"',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L144-L160')}>
        cache.py L144-L160
      </Cite>
    ),
  },
  {
    knob: 'num_gpu_blocks_override',
    config: 'CacheConfig',
    meaning: 'Force the pool size instead of profiling it. The docstring says it exists "for testing preemption".',
    dflt: 'None',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L136-L138')}>
        cache.py L136-L138
      </Cite>
    ),
  },
  {
    knob: 'max_num_batched_tokens',
    config: 'SchedulerConfig',
    meaning: 'The per-step token budget: the single number that bounds prefill and decode work in one iteration.',
    dflt:
      'vllm serve: 16384 on GPUs with at least 160 GiB, 8192 on other GPUs with at least 70 GiB except A100, 2048 elsewhere. 2048 is the class fallback.',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2829-L2920')}>
        arg_utils.py L2829-L2920
      </Cite>
    ),
  },
  {
    knob: 'max_num_seqs',
    config: 'SchedulerConfig',
    meaning:
      'Batch-width cap. It also sizes the model runner: per-request buffers and CUDA graph capture.',
    dflt: 'vllm serve: 1024 on GPUs with at least 70 GiB except A100, 256 elsewhere. 128 is the class fallback.',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L2858-L2887')}>
        arg_utils.py L2858-L2887
      </Cite>
    ),
  },
  {
    knob: 'max_num_active_seqs',
    config: 'SchedulerConfig',
    meaning:
      'Caps admission into RUNNING without shrinking the runner buffers and graphs that max_num_seqs sizes. Must be at most max_num_seqs.',
    dflt: 'None (falls back to max_num_seqs)',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L70-L78')}>
        scheduler.py L70-L78
      </Cite>
    ),
  },
  {
    knob: 'long_prefill_token_threshold',
    config: 'SchedulerConfig',
    meaning:
      'Per-request chunk cap for one step, so a long prompt cannot take the whole budget. Dropped when only one request is eligible. With long_prefill_token_threshold_adaptive, floored at max_num_batched_tokens divided by the running plus waiting requests.',
    dflt: '0 (off); adaptive False',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L80-L91')}>
        scheduler.py L80-L91
      </Cite>
    ),
  },
  {
    knob: 'watermark',
    config: 'SchedulerConfig',
    meaning:
      'Fraction of all KV blocks kept free when admitting a WAITING or PREEMPTED request, applied only once another request is already scheduled that step.',
    dflt: '0.0 (off)',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L506-L514')}>
        kv_cache_manager.py L506-L514
      </Cite>
    ),
  },
  {
    knob: 'enable_chunked_prefill',
    config: 'SchedulerConfig',
    meaning: 'Allow a prompt to be split across steps so a long prefill cannot starve in-flight decodes.',
    dflt: 'True',
    source: (
      <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L135')}>
        scheduler.py L135
      </Cite>
    ),
  },
];

function BlockPoolDiagram() {
  const blocks = [
    { id: '0', label: 'null', fill: '#fde2e4' },
    { id: '1', label: 'free', fill: '#e9f7ef' },
    { id: '2', label: 'req A', fill: '#e7f0fb' },
    { id: '3', label: 'req A', fill: '#e7f0fb' },
    { id: '4', label: 'req B', fill: '#fbf3e0' },
    { id: '5', label: 'cached', fill: '#efe7fb' },
    { id: '6', label: 'cached', fill: '#efe7fb' },
    { id: '7', label: 'req C', fill: '#e6f4f2' },
    { id: 'N', label: 'free', fill: '#e9f7ef' },
  ];
  const queue = [
    { id: '#1', sub: 'free', x: 186, fill: '#e9f7ef' },
    { id: '#N', sub: 'free', x: 280, fill: '#e9f7ef' },
    { id: '#5', sub: 'cached', x: 374, fill: '#efe7fb' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 400"
        role="img"
        aria-labelledby="sched-blockpool-title"
        aria-describedby="sched-blockpool-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="sched-blockpool-title">
          The KV block pool is CPU-side bookkeeping: a free queue whose head is the
          least-recently-used block and the next one allocated, a hash map of cached full
          blocks, and per-request block tables that grow at the end.
        </title>
        <desc id="sched-blockpool-desc">
          One pool of fixed-size KV blocks, with a null block at id zero. The free queue is a
          doubly linked list: allocation pops from the head, which holds the next eviction
          victim; freed blocks with a hash are appended at the tail; freed blocks without a
          hash are prepended at the head; a prefix hit unlinks a cached block from the middle.
          The hash map indexes cached full blocks by a chained hash. Each request owns a block
          table that is extended at the end, uses the null block for skipped slots, and after a
          sub-block prefix hit swaps the shared block in place for a private copy-on-write
          block.
        </desc>
        <defs>
          <marker
            id="sched-bp-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="760" height="400" rx="8" fill="#ffffff" />

        {/* BlockPool row of physical blocks */}
        <text x="16" y="26" fontSize="13" fontWeight="600" fontFamily="sans-serif" fill="#16191f">
          BlockPool: num_gpu_blocks fixed-size blocks
        </text>
        {blocks.map((b, i) => (
          <g key={b.id} transform={`translate(${16 + i * 81}, 38)`}>
            <rect width="73" height="46" rx="4" fill={b.fill} stroke="#879596" />
            <text
              x="36.5"
              y="20"
              fontSize="11"
              fontWeight="600"
              fontFamily="sans-serif"
              textAnchor="middle"
              fill="#16191f"
            >
              #{b.id}
            </text>
            <text x="36.5" y="36" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
              {b.label}
            </text>
          </g>
        ))}

        {/* FreeKVCacheBlockQueue */}
        <text x="16" y="122" fontSize="13" fontWeight="600" fontFamily="sans-serif" fill="#16191f">
          FreeKVCacheBlockQueue: intrusive doubly linked list, O(1) ops
        </text>
        <g transform="translate(0, 134)">
          <rect x="16" width="140" height="44" rx="4" fill="#fbf3d5" stroke="#8b6c00" />
          <text x="86" y="18" fontSize="11" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
            head
          </text>
          <text x="86" y="34" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
            oldest: popped first
          </text>
          {queue.map((q) => (
            <g key={q.id} transform={`translate(${q.x}, 0)`}>
              <rect width="64" height="44" rx="4" fill={q.fill} stroke="#879596" />
              <text x="32" y="18" fontSize="11" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
                {q.id}
              </text>
              <text x="32" y="34" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
                {q.sub}
              </text>
            </g>
          ))}
          <rect x="468" width="140" height="44" rx="4" fill="#f4f4f4" stroke="#879596" />
          <text x="538" y="18" fontSize="11" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
            tail
          </text>
          <text x="538" y="34" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
            most recently freed
          </text>
          {[156, 250, 344, 438].map((x) => (
            <line
              key={x}
              x1={x + 2}
              y1="22"
              x2={x + 28}
              y2="22"
              stroke="#5f6b7a"
              strokeWidth="1.5"
              markerStart="url(#sched-bp-ah)"
              markerEnd="url(#sched-bp-ah)"
            />
          ))}
          <text x="628" y="12" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            touch(): a hit unlinks
          </text>
          <text x="628" y="26" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            a cached block from
          </text>
          <text x="628" y="40" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            the middle in O(1)
          </text>
        </g>
        <text x="16" y="198" fontSize="10" fontFamily="sans-serif" fill="#8b6c00">
          allocate: popleft_n() from the head
        </text>
        <text x="16" y="212" fontSize="10" fontFamily="sans-serif" fill="#8b6c00">
          a popped cached block loses its hash
        </text>
        <text x="16" y="226" fontSize="10" fontFamily="sans-serif" fill="#8b6c00">
          free_blocks(): unhashed blocks prepend
        </text>
        <text x="468" y="198" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
          free_blocks(): hashed blocks append
        </text>
        <text x="468" y="212" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
          so cached blocks age toward the head
        </text>

        {/* Hash map */}
        <text x="16" y="262" fontSize="13" fontWeight="600" fontFamily="sans-serif" fill="#16191f">
          cached_block_hash_to_block
        </text>
        <g transform="translate(16, 274)">
          <rect width="340" height="54" rx="4" fill="#efe7fb" stroke="#879596" />
          <text x="12" y="22" fontSize="11" fontFamily="sans-serif" fill="#16191f">
            hash((parent_hash, token_ids, extra_keys))
          </text>
          <text x="12" y="40" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            {'→ #5, #6: full blocks; ref_cnt may be 0'}
          </text>
        </g>

        {/* req_to_blocks block tables */}
        <text x="390" y="262" fontSize="13" fontWeight="600" fontFamily="sans-serif" fill="#16191f">
          req_to_blocks: block tables grow at the end
        </text>
        <g transform="translate(390, 274)">
          <text x="0" y="15" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            req A
          </text>
          {['2', '3'].map((id, i) => (
            <g key={id} transform={`translate(${46 + i * 44}, 0)`}>
              <rect width="40" height="22" rx="3" fill="#e7f0fb" stroke="#879596" />
              <text x="20" y="15" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
                #{id}
              </text>
            </g>
          ))}
          <rect x="134" width="44" height="22" rx="3" fill="#ffffff" stroke="#879596" strokeDasharray="3 3" />
          <text x="156" y="15" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
            next
          </text>

          <text x="0" y="45" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            req B
          </text>
          {['0', '4'].map((id, i) => (
            <g key={id} transform={`translate(${46 + i * 44}, 30)`}>
              <rect width="40" height="22" rx="3" fill={id === '0' ? '#fde2e4' : '#fbf3e0'} stroke="#879596" />
              <text x="20" y="15" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
                #{id}
              </text>
            </g>
          ))}
          <text x="142" y="45" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            #0 = null_block for a skipped slot
          </text>

          <text x="0" y="75" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
            req C
          </text>
          <rect x="46" y="60" width="40" height="22" rx="3" fill="#efe7fb" stroke="#879596" strokeDasharray="3 3" />
          <text x="66" y="75" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
            #6
          </text>
          <line x1="88" y1="71" x2="106" y2="71" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#sched-bp-ah)" />
          <rect x="110" y="60" width="40" height="22" rx="3" fill="#e6f4f2" stroke="#1f7a70" />
          <text x="130" y="75" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
            #7
          </text>
          <text x="162" y="70" fontSize="10" fontFamily="sans-serif" fill="#1f7a70">
            sub-block hit: shared #6 swapped
          </text>
          <text x="162" y="84" fontSize="10" fontFamily="sans-serif" fill="#1f7a70">
            in place for copy-on-write #7
          </text>
        </g>

        <text x="16" y="384" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
          Control state is CPU-side. The GPU receives integer block ids, plus a (src, dst) id
          pair for each copy-on-write block.
        </text>
      </svg>
    </div>
  );
}

function SchedulerStateDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 290"
        role="img"
        aria-labelledby="sched-state-title"
        aria-describedby="sched-state-desc"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="sched-state-title">
          A request waits in one of two queues, is admitted to RUNNING while budget, the active
          cap and free KV blocks allow, and either finishes or is preempted back to the front of
          the waiting queue with its KV freed, to be recomputed.
        </title>
        <desc id="sched-state-desc">
          The WAITING side holds two queues scanned in order: kv_holding_waiting, for requests
          that already hold KV blocks, then waiting, in FCFS or priority order. Admission into
          RUNNING is bounded by the token budget, max_num_active_seqs, and free KV blocks plus
          the watermark. RUNNING requests reach FINISHED on EOS (end of sequence) or max_tokens. When
          allocate_slots finds no free blocks, a RUNNING request is preempted: its blocks are
          freed now or deferred, num_computed_tokens is reset to zero, and it is prepended to
          the waiting queue with status PREEMPTED.
        </desc>
        <defs>
          <marker
            id="sched-state-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="sched-state-ah-red"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L7,3 L0,6 Z" fill="#d13212" />
          </marker>
        </defs>
        <rect x="0" y="0" width="760" height="290" rx="8" fill="#ffffff" />

        {/* WAITING side: two queues */}
        <text x="16" y="24" fontSize="11" fontWeight="600" fontFamily="sans-serif" fill="#414d5c">
          WAITING: two queues, scanned in this order
        </text>
        <rect x="16" y="34" width="244" height="146" rx="10" fill="#fafafa" stroke="#d1d5db" strokeDasharray="5 4" />
        <rect x="30" y="46" width="216" height="56" rx="8" fill="#f4f4f4" stroke="#879596" strokeWidth="1.5" />
        <text x="138" y="68" fontSize="13" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
          1. kv_holding_waiting
        </text>
        <text x="138" y="88" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
          requests already holding KV blocks
        </text>
        <rect x="30" y="112" width="216" height="56" rx="8" fill="#f4f4f4" stroke="#879596" strokeWidth="1.5" />
        <text x="138" y="134" fontSize="13" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
          2. waiting
        </text>
        <text x="138" y="154" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
          FCFS or priority order
        </text>

        {/* States */}
        <rect x="420" y="84" width="150" height="48" rx="8" fill="#e9f7ef" stroke="#879596" strokeWidth="1.5" />
        <text x="495" y="113" fontSize="13" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
          RUNNING
        </text>
        <rect x="596" y="16" width="150" height="44" rx="8" fill="#e7f0fb" stroke="#879596" strokeWidth="1.5" />
        <text x="671" y="43" fontSize="13" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
          FINISHED
        </text>
        <rect x="420" y="200" width="150" height="48" rx="8" fill="#fde2e4" stroke="#879596" strokeWidth="1.5" />
        <text x="495" y="229" fontSize="13" fontWeight="600" fontFamily="sans-serif" textAnchor="middle" fill="#16191f">
          PREEMPTED
        </text>

        {/* WAITING -> RUNNING */}
        <line x1="262" y1="112" x2="416" y2="112" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#sched-state-ah)" />
        <text x="339" y="88" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
          token budget, active cap,
        </text>
        <text x="339" y="102" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="#5f6b7a">
          KV blocks + watermark
        </text>

        {/* RUNNING -> FINISHED */}
        <line x1="560" y1="84" x2="626" y2="64" stroke="#5f6b7a" strokeWidth="1.5" markerEnd="url(#sched-state-ah)" />
        <text x="650" y="82" fontSize="10" fontFamily="sans-serif" fill="#5f6b7a">
          EOS / max_tokens
        </text>

        {/* RUNNING -> PREEMPTED */}
        <line x1="495" y1="132" x2="495" y2="196" stroke="#d13212" strokeWidth="1.5" markerEnd="url(#sched-state-ah-red)" />
        <text x="505" y="168" fontSize="10" fontFamily="sans-serif" fill="#d13212">
          allocate_slots(): no free blocks
        </text>

        {/* PREEMPTED -> front of waiting (recompute) */}
        <path
          d="M418,224 C300,224 150,226 140,184"
          fill="none"
          stroke="#d13212"
          strokeWidth="1.5"
          markerEnd="url(#sched-state-ah-red)"
        />
        <text x="24" y="258" fontSize="10" fontFamily="sans-serif" fill="#d13212">
          blocks freed now or deferred, num_computed_tokens = 0,
        </text>
        <text x="24" y="272" fontSize="10" fontFamily="sans-serif" fill="#d13212">
          prepended to the front of waiting (status stays PREEMPTED)
        </text>
      </svg>
    </div>
  );
}

export function CodebaseScheduler() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="How one token budget, two waiting queues and a CPU-side pool of KV (key-value) cache blocks decide what runs each step, and which signals say the pool is your constraint (vllm/v1/core/, vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Scheduler and KV cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape of the loop.</strong> vLLM&apos;s V1 scheduler has no
            separate &quot;prefill phase&quot; and &quot;decode phase&quot;. Every request
            carries a <code>num_computed_tokens</code> counter and a target{' '}
            <code>num_tokens_with_spec</code>, and each step the scheduler hands out tokens
            so that computed catches up with target{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L674-L683')}>
              scheduler.py L674-L683
            </Cite>
            . Prefill, decode, chunked prefill, speculative decode and prefix-cache reuse
            all fall out of that one abstraction, as the comment at the top of{' '}
            <code>Scheduler.schedule()</code> puts it{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L564-L573')}>
              scheduler.py L564-L573
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>One budget governs the step.</strong> Each call seeds a single{' '}
            <code>token_budget = self.max_num_scheduled_tokens</code>, which defaults to{' '}
            <code>max_num_batched_tokens</code>; a second cap, <code>input_budget</code>,
            reserves room for draft tokens under speculative decoding{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L132-L136')}>
              scheduler.py L132-L136
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L582-L585')}>
              L582-L585
            </Cite>
            . The loop first walks RUNNING, decrementing the budget per request, then admits
            waiting requests against whatever remains. The waiting side is two queues:{' '}
            <code>kv_holding_waiting</code>, for requests that already hold KV blocks (one
            receiving its KV from a remote prefill instance, for example), is always drained
            before <code>waiting</code>, and admission stops once RUNNING reaches{' '}
            <code>max_num_active_seqs</code>, which defaults to <code>max_num_seqs</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L885-L894')}>
              scheduler.py L885-L894
            </Cite>
            . A long prompt does not have to fit in one step: with chunked prefill,{' '}
            <code>num_new_tokens = min(num_new_tokens, request_token_budget)</code> schedules
            a partial chunk now and the rest next step{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1113-L1123')}>
              scheduler.py L1113-L1123
            </Cite>
            , and <code>long_prefill_token_threshold</code> can cap each chunk further so one
            prompt cannot take the whole budget from in-flight decodes{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L611-L626')}>
              scheduler.py L611-L626
            </Cite>
            .
          </Box>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0">
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why paging costs no GPU work, and which end of the free queue gets evicted"
          >
            The KV block pool is pure CPU bookkeeping
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The whole control path of vLLM&apos;s memory management is{' '}
            <strong>CPU-side</strong>. The{' '}
            <code>BlockPool</code>, the free queue, the hash map and the per-request block
            tables are plain Python objects. The GPU receives the resulting integer block
            ids, plus a source and destination id pair for each copy-on-write block (below){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/output.py', 'L305')}>
              output.py L305
            </Cite>
            . Paging here means &quot;which physical block id does logical position{' '}
            <em>p</em> of this request map to&quot;, computed on the host.
          </Box>
          <BlockPoolDiagram />
          <Box variant="small" color="text-body-secondary">
            Block ids and queue contents are an example state. Structure read from{' '}
            <code>vllm/v1/core/</code> at v0.31.0. Illustrative, not measured.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">BlockPool</Box>
              <Box variant="p">
                Owns <code>num_gpu_blocks</code> <code>KVCacheBlock</code> objects, the{' '}
                <code>free_block_queue</code> and <code>cached_block_hash_to_block</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L167-L188')}>
                  block_pool.py L167-L188
                </Cite>
                . <code>get_new_blocks()</code> pops from the free queue and bumps{' '}
                <code>ref_cnt</code>. <code>free_blocks()</code> decrements it; a block
                that reaches zero with no hash (or with caching off) is prepended at the head
                for LIFO (last in, first out) reuse, and a block with a hash is appended at the
                tail so LRU (least recently used) order holds{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L777-L808')}>
                  block_pool.py L777-L808
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">FreeKVCacheBlockQueue</Box>
              <Box variant="p">
                An <strong>intrusive doubly linked list</strong> built on the{' '}
                <code>prev_free_block</code> / <code>next_free_block</code> fields of each
                block. Its class docstring gives the reason over a <code>deque</code>:{' '}
                <code>remove()</code> from the middle in O(1), with no Python objects
                allocated while relinking{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L246-L262')}>
                  kv_cache_utils.py L246-L262
                </Cite>
                . That middle removal is what a prefix hit needs: <code>touch()</code> unlinks
                an idle cached block from wherever it sits in the queue{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L755-L770')}>
                  block_pool.py L755-L770
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="The head is the least-recently-used end">
            The free queue doubles as the <strong>eviction order</strong>. With prefix
            caching on, a freed block that still has a hash waits in the queue as an
            eviction candidate. Allocation pops from the <strong>head</strong>{' '}
            (<code>popleft_n()</code>), which holds the least-recently-used block{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L337-L369')}>
              kv_cache_utils.py L337-L369
            </Cite>
            , and <code>_maybe_evict_cached_block()</code> drops that block&apos;s hash as it
            is reused{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L684-L692')}>
              block_pool.py L684-L692
            </Cite>
            . A finished request&apos;s blocks are freed in reverse order, so the end of its
            prefix chain sits nearer the head and is evicted before the start{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/single_type_kv_cache_manager.py', 'L581-L589')}>
              single_type_kv_cache_manager.py L581-L589
            </Cite>
            . Eviction runs inline in that allocation call; <code>vllm/v1/core/</code>{' '}
            contains no eviction thread (<code>grep -rn -E &quot;threading|Thread\(&quot;</code>{' '}
            over it returns nothing). A separate <code>evict_blocks()</code> path drops
            cached blocks whose KV load through a connector failed{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L3330-L3336')}>
              scheduler.py L3330-L3336
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The small surface the scheduler calls, so you know which call each later section refers to"
          >
            KVCacheManager: the seam between scheduler and blocks
          </Header>
        }
      >
        <Box variant="p">
          The scheduler&apos;s main calls into <code>KVCacheManager</code> are{' '}
          <code>get_computed_blocks()</code> (prefix-cache lookup),{' '}
          <code>allocate_slots()</code> (allocate or fail), <code>free()</code> and{' '}
          <code>get_block_ids()</code>. Results come back as <code>KVCacheBlocks</code>, a
          type whose docstring says it hides the manager&apos;s data structures from the
          scheduler{' '}
          <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L35-L38')}>
            kv_cache_manager.py L35-L38
          </Cite>
          . Underneath, a <code>KVCacheCoordinator</code> fans each call out to one{' '}
          <code>SingleTypeKVCacheManager</code> per KV cache group, so a hybrid model (full
          plus sliding-window attention, or Mamba layers) keeps one block table per group{' '}
          <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L134-L149')}>
            kv_cache_coordinator.py L134-L149
          </Cite>
          .
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why block ids stay put, and the two operations that rewrite a slot in place"
          >
            Block tables grow at the end, with a null sentinel
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each request&apos;s mapping lives in <code>req_to_blocks</code>, a{' '}
            <code>defaultdict[str, list[KVCacheBlock]]</code> in{' '}
            <code>SingleTypeKVCacheManager</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/single_type_kv_cache_manager.py', 'L128')}>
              single_type_kv_cache_manager.py L128
            </Cite>
            . <code>allocate_new_blocks()</code> extends that list. vLLM deliberately does
            not de-duplicate identical cached blocks; the note on{' '}
            <code>BlockHashToBlockMap</code> gives the reason as keeping allocated block ids
            stable so that block tables stay append-only{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L48-L52')}>
              block_pool.py L48-L52
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two operations rewrite a slot in place, and neither shifts the list. After a{' '}
            <strong>sub-block prefix hit</strong>, <code>allocate_new_blocks()</code> first
            replaces the shared tail block with a private copy-on-write block (
            <code>_apply_cow()</code>), so the request can write the rest of that block
            without touching the cached original{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/single_type_kv_cache_manager.py', 'L369-L405')}>
              single_type_kv_cache_manager.py L369-L405
            </Cite>
            ; the next section covers when such a hit happens. When positions must be skipped
            (tokens outside a sliding window, for example), <code>remove_skipped_blocks()</code>{' '}
            overwrites the slot with <code>null_block</code>, so every position keeps its
            index{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/single_type_kv_cache_manager.py', 'L665-L725')}>
              single_type_kv_cache_manager.py L665-L725
            </Cite>
            . The null block is popped from the free queue at pool construction, so it gets{' '}
            <code>block_id == 0</code>, with <code>is_null = True</code> and a ref count
            that is intentionally not tracked{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L184-L188')}>
              block_pool.py L184-L188
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When two requests, or two vLLM processes, share a cached block, and when a hit costs a block copy"
          >
            Prefix-cache block hashing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A block becomes reusable across requests once it is full and hashed. The hash is a
            chain: <code>hash_fn((parent_block_hash, token_ids, extra_keys))</code>, computed
            by <code>hash_block_tokens()</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
              kv_cache_utils.py L684-L714
            </Cite>
            . Chaining the parent hash means a block&apos;s identity encodes its{' '}
            <em>entire</em> prefix, so two requests share a cached block only when every
            preceding token matches as well.
          </Box>
          <Alert type="info" header="The chain root is shared across processes with sha256">
            The chain root, <code>NONE_HASH</code>, comes from <code>init_none_hash()</code>.
            With the default <code>sha256</code>, or <code>sha256_cbor</code>, it derives
            from the fixed seed <code>&quot;vllm-none-hash&quot;</code>, so separate vLLM
            processes compute identical block hashes and can share a prefix cache with no
            setup. With <code>xxhash</code> or <code>xxhash_cbor</code> the seed is a fresh{' '}
            <code>os.urandom(32)</code> per process, because a predictable seed would let an
            attacker precompute colliding blocks, and vLLM logs a warning. A set{' '}
            <code>PYTHONHASHSEED</code> overrides the seed for every algorithm{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L102-L172')}>
              kv_cache_utils.py L102-L172
            </Cite>
            . In practice, pinning <code>PYTHONHASHSEED</code> to a shared value is needed
            only for the xxhash variants; the sha256 root has been deterministic since
            v0.29.0{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.29.0`}>
              vLLM v0.29.0 release notes
            </Cite>
            . <code>cache_salt</code> stays the isolation mechanism.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">extra_keys isolate context</Box>
              <Box variant="p">
                <code>generate_block_hash_extra_keys()</code> folds into the hash the LoRA
                (low-rank adaptation) adapter name and path, multimodal feature identifiers,
                a per-block SHA-256 of prompt embeddings (when the request supplies
                embeddings) and the request&apos;s{' '}
                <code>cache_salt</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L567-L652')}>
                  kv_cache_utils.py L567-L652
                </Cite>
                . The salt is attached only to the first block (
                <code>start_token_idx == 0</code>), which is enough to fork the whole chain,
                so a salt cleanly <strong>isolates tenants</strong> that would otherwise share
                an identical text prefix.
              </Box>
            </div>
            <div>
              <Box variant="h3">Lookup is CPU-side too</Box>
              <Box variant="p">
                Hashes are precomputed on the <code>Request</code> as tokens arrive{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/request.py', 'L285-L290')}>
                  request.py L285-L290
                </Cite>
                . <code>KVCacheManager.get_computed_blocks()</code> calls{' '}
                <code>find_longest_cache_hit()</code> over those hashes against the in-memory
                map, a host-side dictionary walk{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L264-L300')}>
                  kv_cache_manager.py L264-L300
                </Cite>
                . A full-block hit reuses an existing block id, with no KV data copied.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>A sub-block hit costs a block copy.</strong> On a hybrid
            attention-plus-Mamba model (Mamba cache mode <code>align</code>), prefix keys are
            computed at a finer unit than the large physical block: the GCD (greatest common
            divisor) of the KV cache group block sizes, or <code>--prefix-match-unit</code>{' '}
            when set{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L750-L755')}>
              kv_cache_utils.py L750-L755
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L687-L704')}>
              kv_cache_coordinator.py L687-L704
            </Cite>
            . A hit can then end inside a block. The request gets a private copy-on-write block
            in place of the shared one, the scheduler ships the source and destination ids in{' '}
            <code>SchedulerOutput.kv_cache_block_copies</code>, and the worker copies that one
            block on the GPU before the forward pass reads it{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1226-L1233')}>
              model_runner.py L1226-L1233
            </Cite>
            . Prefix-cache granularity can be finer than paging granularity, at the price of
            copying the partly matched block.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What happens to a request when blocks run out, and why the cost is recomputation"
          >
            Preemption is recompute-only
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When the running loop calls <code>allocate_slots()</code> and it returns{' '}
            <code>None</code> (not enough free blocks), the scheduler preempts. Under FCFS
            (first come, first served) it pops the <em>last</em> running request; under the
            priority policy it preempts the lowest-priority one. It then retries the allocation, possibly preempting several
            requests until the current one fits, or until there is nothing left to preempt and
            the request waits for the next step. Two cases stop the loop without preempting: a
            connector with block frees still pending, and a victim whose blocks cannot be
            freed yet{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L745-L811')}>
              scheduler.py L745-L811
            </Cite>
            . A step that preempted anyone admits no waiting requests{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L873')}>
              scheduler.py L873
            </Cite>
            .
          </Box>
          <SchedulerStateDiagram />
          <Box variant="small" color="text-body-secondary">
            States and queues read from <code>vllm/v1/core/sched/scheduler.py</code> at
            v0.31.0. EOS is the end-of-sequence token. Illustrative, not measured.
          </Box>
          <Box variant="p">
            <code>_preempt_request()</code> calls <code>_free_request_blocks()</code>, which
            returns the blocks to the pool immediately, or defers the return when a KV-consumer
            connector runs with more than one batch in flight and a GPU step may still write
            them. It then sets <code>num_computed_tokens = 0</code>, flips status to{' '}
            <code>PREEMPTED</code>, and prepends the request to the <em>front</em> of{' '}
            <code>waiting</code>, which sits behind any KV-holding waiters{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1538-L1581')}>
              scheduler.py L1538-L1581
            </Cite>
            ,{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L2694-L2710')}>
              scheduler.py L2694-L2710
            </Cite>
            ,{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L176-L181')}>
              scheduler.py L176-L181
            </Cite>
            . Recovery is <strong>recompute-only</strong>: <code>grep -rn swap</code> over{' '}
            <code>vllm/v1/core/</code> returns nothing. With a KV offloading connector, the
            prefix lookup at re-admission can be served by the connector as an external hit,
            which is a load of stored blocks rather than a swap-in{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L928-L950')}>
              scheduler.py L928-L950
            </Cite>
            .
          </Box>
          <Alert type="info">
            Recompute is <strong>best-effort cheap</strong>. Because the freed blocks may still
            be cached and the request re-enters near the front of the queue, the prefix cache
            often lets it skip recomputing most of its prompt, but only if those blocks
            survived eviction in the meantime. There is no guarantee; the prefix cache is an
            optimization layered on top of the recompute fallback.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The fields to set when you size the pool, the batch and the queue, with the defaults vllm serve actually uses"
          >
            The knobs that govern all of this
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These <code>CacheConfig</code> and <code>SchedulerConfig</code> fields shape the
            behavior above: block geometry, pool size, caching, the per-step budget and
            admission. The class defaults of <code>max_num_batched_tokens</code> and{' '}
            <code>max_num_seqs</code> are fallbacks; <code>EngineArgs</code> fills both by
            usage context and GPU memory, so the values below are the ones{' '}
            <code>vllm serve</code> starts with.
          </Box>
          <Table
            items={knobRows}
            columnDefinitions={[
              { id: 'knob', header: 'Knob', cell: (r) => <code>{r.knob}</code>, minWidth: 200 },
              { id: 'config', header: 'Config', cell: (r) => r.config },
              { id: 'meaning', header: 'What it controls', cell: (r) => r.meaning, minWidth: 280 },
              { id: 'dflt', header: 'Default', cell: (r) => r.dflt, minWidth: 200 },
              { id: 'source', header: 'Source', cell: (r) => r.source, minWidth: 180 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>Admission control bounds the queue before the scheduler sees it.</strong>{' '}
            By default the waiting queue is unbounded. <code>--max-num-queued-reqs</code> caps
            in-flight requests (waiting plus running) and <code>--max-num-queued-tokens</code>{' '}
            caps the prompt tokens still in prefill; past either limit the API server rejects
            the request with <strong>HTTP 503</strong>, so a load balancer or client SDK can
            retry it on another instance{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/async_llm.py', 'L309-L365')}>
              async_llm.py L309-L365
            </Cite>
            . Both limits are enforced in the API server over every DP (data parallel) rank
            it routes to, and for the request cap several API server processes sum shared
            per-process counters{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/engine/admission_control.py', 'L13-L52')}>
              admission_control.py L13-L52
            </Cite>
            . The field docstring sizes the request cap at roughly{' '}
            <code>data_parallel_size * max_num_seqs</code> plus the queue depth you accept,
            and notes the token count is conservative: a partly prefilled request counts its
            full prompt{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L93-L120')}>
              scheduler.py L93-L120
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What to read in the logs and metrics when requests stall or recompute, and which knob each signal points to"
          >
            When the KV pool is the constraint
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>At startup</strong>, one log line states the pool you got:{' '}
            <code>GPU KV cache size: N tokens, Maximum concurrency for M tokens per request:
            X.XXx</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L2455-L2471')}>
              kv_cache_utils.py L2455-L2471
            </Cite>
            . The second figure is how many requests at the full context length fit in the
            pool at once{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L1090-L1101')}>
              kv_cache_utils.py L1090-L1101
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>While serving</strong>, the periodic stats line carries{' '}
            <code>Running</code>, <code>Waiting</code>, <code>Deferred</code> (when nonzero),{' '}
            <code>Preemptions</code> (when nonzero), <code>GPU KV cache usage</code> and{' '}
            <code>Prefix cache hit rate</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L274-L307')}>
              loggers.py L274-L307
            </Cite>
            . The Prometheus equivalents are <code>vllm:kv_cache_usage_perc</code>,{' '}
            <code>vllm:num_preemptions</code>, <code>vllm:num_requests_waiting</code> (split
            into <code>capacity</code> and <code>deferred</code> by{' '}
            <code>vllm:num_requests_waiting_by_reason</code>) and{' '}
            <code>vllm:prefix_cache_hits</code> over <code>vllm:prefix_cache_queries</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L505-L682')}>
              loggers.py L505-L682
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Reading the signals against the mechanism (our inference from the code)">
            <Box variant="p">
              Apart from an explicit prefix-cache reset, every preemption comes from the
              running loop failing <code>allocate_slots()</code>{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L2794-L2804')}>
                scheduler.py L2794-L2804
              </Cite>
              , and each preempted request restarts from <code>num_computed_tokens = 0</code>.
              Our reading: a rising <code>vllm:num_preemptions</code> with KV cache usage near
              100% is running requests outgrowing the pool, and the cost shows up as repeated
              prefill. Admission stops at the token budget, the active cap or a failed
              allocation, whichever comes first, so a waiting count that grows while KV usage
              stays low points at the budget or the cap rather than the pool.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>What to change.</strong> If preemptions climb, set the watermark:{' '}
            <code>--watermark 0.05</code> keeps 5% of all blocks free when admitting, headroom
            its docstring describes as avoiding repeated preemption when GPU memory is scarce{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L197-L202')}>
              scheduler.py L197-L202
            </Cite>
            . <code>--max-num-active-seqs</code> keeps the running batch smaller without
            shrinking the runner buffers and CUDA graphs that <code>max_num_seqs</code>{' '}
            sizes, <code>--gpu-memory-utilization</code> grows the pool, and{' '}
            <code>--max-num-queued-reqs</code> turns an unbounded queue into HTTP 503s your
            load balancer can send elsewhere.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
