import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';

interface WasteRow {
  kind: string;
  cause: string;
  cost: string;
}

const wasteRows: WasteRow[] = [
  {
    kind: 'Internal fragmentation',
    cause:
      'A request is given a buffer sized to max_model_len, but most requests finish far short of it. The unused slots between the actual length and the reserved length sit idle for the request’s whole lifetime.',
    cost: 'The dominant waste in naive serving — often the majority of the buffer.',
  },
  {
    kind: 'Reservation / over-allocation',
    cause:
      'Output length is unknown at admission, so a contiguous allocator must reserve for the worst case up front. You pay for tokens that may never be generated.',
    cost: 'Caps batch size to whatever the worst-case reservations allow.',
  },
  {
    kind: 'External fragmentation',
    cause:
      'Requests of different sizes come and go, leaving non-contiguous free gaps. A new request needs one contiguous run; the free memory exists but not in one piece.',
    cost: 'Free memory that cannot be handed out — effectively stranded.',
  },
];

function BlockTableMappingDiagram() {
  return (
    <Box>
      <svg
        viewBox="0 0 760 360"
        width="100%"
        role="img"
        aria-labelledby="patbl-title patbl-desc"
        style={{ maxWidth: '760px', height: 'auto', fontFamily: 'sans-serif' }}
      >
        <title id="patbl-title">
          Per-request logical block tables mapping to a shared pool of non-contiguous physical KV
          blocks
        </title>
        <desc id="patbl-desc">
          Two requests each hold a logical block table whose entries are contiguous logical
          positions. Each entry points to a physical block id in a shared pool. The physical
          blocks the two requests use are interleaved and non-contiguous, and one block is shared
          by both requests, illustrating that contiguity exists only in the logical view.
        </desc>

        <defs>
          <marker id="patArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        {/* Logical block table A */}
        <text x="10" y="22" fontSize="13" fontWeight="bold" fill="#16191f">
          Request A — logical block table
        </text>
        {['L0', 'L1', 'L2'].map((l, i) => (
          <g key={`a-${l}`} transform={`translate(${10 + i * 70}, 32)`}>
            <rect width="62" height="34" rx="4" fill="#e7f0fb" stroke="#879596" />
            <text x="31" y="21" fontSize="11" textAnchor="middle" fill="#16191f">
              {l}
            </text>
          </g>
        ))}

        {/* Logical block table B */}
        <text x="10" y="118" fontSize="13" fontWeight="bold" fill="#16191f">
          Request B — logical block table
        </text>
        {['L0', 'L1'].map((l, i) => (
          <g key={`b-${l}`} transform={`translate(${10 + i * 70}, 128)`}>
            <rect width="62" height="34" rx="4" fill="#fbf3e0" stroke="#879596" />
            <text x="31" y="21" fontSize="11" textAnchor="middle" fill="#16191f">
              {l}
            </text>
          </g>
        ))}

        {/* Physical pool */}
        <text x="10" y="232" fontSize="13" fontWeight="bold" fill="#16191f">
          Physical KV block pool (HBM) — fixed-size blocks, any order
        </text>
        {[
          { id: '0', fill: '#e9f7ef', tag: 'free' },
          { id: '1', fill: '#e7f0fb', tag: 'A' },
          { id: '2', fill: '#fbf3e0', tag: 'B' },
          { id: '3', fill: '#e7f0fb', tag: 'A' },
          { id: '4', fill: '#efe7fb', tag: 'A+B' },
          { id: '5', fill: '#e9f7ef', tag: 'free' },
          { id: '6', fill: '#fbf3e0', tag: 'B' },
          { id: '7', fill: '#e9f7ef', tag: 'free' },
        ].map((b, i) => (
          <g key={b.id} transform={`translate(${10 + i * 93}, 244)`}>
            <rect width="84" height="46" rx="4" fill={b.fill} stroke="#879596" />
            <text x="42" y="20" fontSize="11" textAnchor="middle" fill="#16191f">
              phys #{b.id}
            </text>
            <text x="42" y="37" fontSize="10" textAnchor="middle" fill="#5f6b7a">
              {b.tag}
            </text>
          </g>
        ))}

        {/* A mappings: L0->1, L1->3, L2->4 */}
        <line x1="41" y1="66" x2="56" y2="244" stroke="#5f6b7a" strokeWidth="1.4" markerEnd="url(#patArrow)" />
        <line x1="111" y1="66" x2="242" y2="244" stroke="#5f6b7a" strokeWidth="1.4" markerEnd="url(#patArrow)" />
        <line x1="181" y1="66" x2="335" y2="244" stroke="#5f6b7a" strokeWidth="1.4" markerEnd="url(#patArrow)" />

        {/* B mappings: L0->2, L1->4 (shared with A) */}
        <line x1="41" y1="162" x2="149" y2="244" stroke="#9a6a00" strokeWidth="1.4" markerEnd="url(#patArrow)" />
        <line x1="111" y1="162" x2="335" y2="244" stroke="#9a6a00" strokeWidth="1.4" markerEnd="url(#patArrow)" />

        <text x="430" y="118" fontSize="11" fill="#5f6b7a">
          #4 is shared (e.g. a common prompt prefix —
        </text>
        <text x="430" y="134" fontSize="11" fill="#5f6b7a">
          copy-on-write on divergence). See section 6.
        </text>
        <text x="10" y="350" fontSize="9.5" fill="#879596">
          Logical positions are contiguous; physical blocks are not. The block table is the
          translation layer — exactly like an OS page table.
        </text>
      </svg>
    </Box>
  );
}

export function PagedAttentionKV() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why the KV cache, not the weights, decides how many requests fit — and how paging recovered the wasted memory"
          >
            5. PagedAttention & KV-Cache Management
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The outcome this section is about.</strong> On a fixed HBM (high-bandwidth
            memory) budget, throughput is gated by how many requests you can keep in flight at
            once — the batch size. Batch size is gated by how much memory each request&apos;s
            KV (key-value) cache consumes, and crucially by how much of the allocated memory is
            actually <em>used</em> versus wasted. PagedAttention is the idea that recovered the
            wasted fraction, and it is the reason vLLM exists. The original paper reports a
            2–4× throughput improvement over the prior state of the art at the same
            latency, with the gains larger for longer sequences and bigger models{' '}
            (
            <Link external href="https://arxiv.org/abs/2309.06180">
              Kwon et al., &quot;Efficient Memory Management for Large Language Model Serving with
              PagedAttention&quot;, arXiv:2309.06180
            </Link>
            , accessed 2026-06-07).
          </Box>
          <Box variant="p">
            This section is the practitioner&apos;s view: the idea and its operational
            consequences. For the actual data structures — <code>BlockPool</code>, the free
            queue, per-request block tables — see <strong>Inside the Codebase {'→'} Scheduler
            &amp; KV Cache</strong>, which walks the real source. For the hardware angle —
            where the KV cache physically lives in HBM, the precise size formula, and the
            attention variants (GQA / MQA / MLA) that shrink it — see the sibling
            deep dive{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>
            . This section deliberately does not re-derive either.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why a contiguous KV buffer wastes most of itself">
            The problem: contiguous allocation strands memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The naive design.</strong> The obvious way to store a request&apos;s KV cache
            is one contiguous tensor, sized for the maximum sequence length the request might
            reach. It is simple and the attention kernel loves contiguity. The trouble is that
            the KV cache <em>grows one token at a time</em> and its final length is unknown at
            admission. A contiguous allocator therefore has to reserve for the worst case, and
            that worst case almost never materializes. The paper measured that, in such systems,
            only a fraction of the reserved KV memory ever holds real token state — the rest
            is fragmentation and over-reservation{' '}
            (
            <Link external href="https://arxiv.org/abs/2309.06180">
              arXiv:2309.06180
            </Link>
            , accessed 2026-06-07).
          </Box>
          <Table
            items={wasteRows}
            columnDefinitions={[
              { id: 'kind', header: 'Waste type', cell: (r) => <strong>{r.kind}</strong>, minWidth: 200 },
              { id: 'cause', header: 'What causes it', cell: (r) => r.cause, minWidth: 320 },
              { id: 'cost', header: 'Operational cost', cell: (r) => r.cost, minWidth: 200 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Alert type="info">
            Every wasted byte is a byte that could have held another request&apos;s KV cache.
            Because batch size is the first-order throughput lever for memory-bound decode, this
            waste does not just cost memory — it directly caps throughput. The whole point of
            PagedAttention is to convert that stranded memory back into batch capacity.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Borrow virtual memory from the operating system">
            The idea: page the KV cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The core move.</strong> PagedAttention splits each request&apos;s KV cache
            into fixed-size <em>blocks</em> (a block holds the K and V vectors for a small,
            constant number of tokens). Instead of one contiguous tensor, a request holds a{' '}
            <strong>block table</strong>: an ordered list mapping its contiguous{' '}
            <em>logical</em> positions to <em>physical</em> block ids that can live anywhere in a
            shared pool, in any order. The attention kernel is taught to gather K and V through
            that indirection. The paper frames this as &quot;an attention algorithm inspired by
            the classical virtual memory and paging techniques in operating systems&quot;{' '}
            (
            <Link external href="https://arxiv.org/abs/2309.06180">
              arXiv:2309.06180
            </Link>
            , accessed 2026-06-07) — the block table is a page table, the pool is physical
            memory, and a request&apos;s logical sequence is its virtual address space.
          </Box>
          <BlockTableMappingDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What this kills</Box>
              <Box variant="p">
                Blocks are allocated on demand as the sequence grows, so there is no
                worst-case reservation — over-allocation is gone. A block is either fully
                used or is the single trailing partial block, so internal fragmentation is
                bounded to at most one block per request. And because any free block fits any
                request, external fragmentation disappears: free memory is always usable. The
                paper&apos;s headline is <strong>near-zero waste</strong> in KV-cache memory.
              </Box>
            </div>
            <div>
              <Box variant="h3">What this unlocks</Box>
              <Box variant="p">
                Once blocks are the unit of allocation, identical prefixes can <em>share</em> the
                same physical blocks across requests, with copy-on-write only where sequences
                diverge — the foundation of automatic prefix caching (section 6) and of the
                paper&apos;s &quot;flexible sharing of KV cache within and across requests&quot;.
                Sharing reduces memory further and lets the server skip recomputing shared
                prompt tokens.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Recovered memory becomes batch size becomes throughput">
            The payoff: more batch on the same HBM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The causal chain.</strong> Near-zero fragmentation means a far larger share
            of the HBM budget holds real, in-use KV state. That share is what determines how many
            concurrent requests fit. More concurrent requests means a wider batch, and a wider
            batch is precisely how a memory-bandwidth-bound decode workload amortizes each weight
            read across more tokens — raising hardware utilization and therefore tokens per
            second. PagedAttention does not make any single request faster; it makes the GPU
            serve <em>many more requests at once</em> from the same memory, which is where the
            2–4× aggregate throughput comes from.
          </Box>
          <Alert type="success">
            <strong>The one-line intuition.</strong> Contiguous allocation pays for memory it
            never uses; paging pays only for memory it does use. On a fixed HBM budget, that
            difference is extra batch slots, and extra batch slots are extra throughput.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why this dominates the memory budget at all">
            Sizing intuition: the KV cache, not the weights
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape of the cost.</strong> KV-cache size scales with{' '}
            <code>num_layers</code> {'×'} <code>num_kv_heads</code> {'×'}{' '}
            <code>head_dim</code> {'×'} <code>seq_len</code> {'×'} bytes-per-element
            {' '}{'×'} batch size (with a factor of 2 for storing both K and V). The two
            terms an operator actually moves at runtime are <code>seq_len</code> (longer contexts
            cost linearly more) and batch size. Unlike the model weights, which are a fixed cost
            paid once, the KV cache is a <em>per-request, per-token</em> cost that scales with
            load — so under any meaningful concurrency it is the KV cache, not the weights,
            that consumes most of the serving memory budget.
          </Box>
          <Box variant="p">
            The exact byte formula, the dtype choices, and the GQA / MQA / MLA reductions that
            cut the <code>num_kv_heads</code> term (often by 4{'–'}8{'×'}) are derived
            in the sibling deep dive{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>
            . The relevant point here: those reductions and PagedAttention are{' '}
            <em>complementary</em>. Attention variants shrink the per-token cost; paging removes
            the waste around whatever that cost is. They compose, and production stacks use both.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The two settings that shape the block pool">
            The operator knobs: block_size and gpu_memory_utilization
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                <code>block_size</code>
              </Box>
              <Box variant="p">
                The number of tokens per KV block — the paging granularity. vLLM&apos;s
                <code>CacheConfig</code> describes it as the &quot;Size of a contiguous cache
                block in number of tokens&quot; and defaults it to 16{' '}
                (
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/api/vllm/config/cache.html"
                >
                  vLLM CacheConfig API reference
                </Link>
                , accessed 2026-06-07). Smaller blocks tighten the bound on the trailing partial
                block (less internal fragmentation) but add per-block bookkeeping and indirection;
                larger blocks reduce overhead but waste more on the tail. The default is a
                deliberate middle.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                <code>gpu_memory_utilization</code>
              </Box>
              <Box variant="p">
                The fraction of GPU memory vLLM may claim — &quot;The fraction of GPU memory
                to be used for the model executor&quot;, default 0.92{' '}
                (
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/api/vllm/config/cache.html"
                >
                  vLLM CacheConfig API reference
                </Link>
                , accessed 2026-06-07). Whatever is left after the weights and activation
                workspace becomes the block pool, so this knob directly sets how many KV blocks
                exist — i.e. the batch-size ceiling. The optimization guide notes vLLM
                &quot;pre-allocates GPU cache using this percentage of memory&quot; and lists
                raising it as a remedy for preemption{' '}
                (
                <Link
                  external
                  href="https://docs.vllm.ai/en/latest/configuration/optimization/"
                >
                  vLLM optimization &amp; tuning guide
                </Link>
                , accessed 2026-06-07).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>Push it too high and you trade headroom for crashes.</strong> The pool is
            pre-allocated, so an over-aggressive <code>gpu_memory_utilization</code> leaves no
            slack for activation spikes or fragmentation in the allocator and risks
            out-of-memory under load. When KV memory genuinely runs out mid-run, vLLM preempts
            requests rather than crashing — see the recompute-only preemption path in{' '}
            <strong>Inside the Codebase {'→'} Scheduler &amp; KV Cache</strong>.
          </Alert>
          <Box variant="p">
            For the broader set of memory-conservation levers — tensor parallelism,
            quantization, capping context length and batch size, and reducing CUDA graphs —
            vLLM keeps a dedicated guide{' '}
            (
            <Link
              external
              href="https://docs.vllm.ai/en/latest/configuration/conserving_memory/"
            >
              vLLM conserving-memory guide
            </Link>
            , accessed 2026-06-07). These sit alongside paging rather than replacing it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Where to read the implementation">
            Pointer to the block manager internals
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Everything above is the concept. The mechanics — how block tables are stored
            append-only with a null-block sentinel, how the free queue doubles as the LRU
            (least-recently-used) eviction order, how a prefix-cache hit reuses a block id
            without copying any KV data, and how the entire control path is CPU-side bookkeeping
            while the GPU only ever sees integer block ids — are in{' '}
            <strong>Inside the Codebase {'→'} Scheduler &amp; KV Cache</strong>, walked
            against the real vLLM source.
          </Box>
          <ExpandableSection headerText="Mental model: it really is virtual memory, in two senses">
            <SpaceBetween size="s">
              <Box variant="p">
                The OS analogy is exact in the part that matters and loose in the part that
                doesn&apos;t. <strong>Exact:</strong> a per-request block table translates
                contiguous logical positions to scattered physical blocks, allocation is
                on-demand, and sharing-with-copy-on-write is how identical prefixes coexist —
                all faithful to demand-paged virtual memory.
              </Box>
              <Box variant="p">
                <strong>Loose:</strong> there is no page fault to backing store on the hot path.
                vLLM&apos;s V1 engine recovers from memory pressure by <em>recomputing</em> a
                preempted request&apos;s KV cache, not by swapping it to host memory and faulting
                it back in. So the &quot;page table&quot; is real, but the &quot;swap&quot; is
                replaced by recompute. The optional offloading of KV blocks to CPU or remote
                tiers is a separate, explicit feature — see section 7 (KV-Cache Offloading
                &amp; LMCache) — not the default paging behavior.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
