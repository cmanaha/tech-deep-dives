import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const PAPER = 'https://arxiv.org/abs/2309.06180';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';

interface WasteRow {
  kind: string;
  cause: string;
  cost: string;
}

const wasteRows: WasteRow[] = [
  {
    kind: 'Internal fragmentation',
    cause:
      'A request is given a buffer sized to max_model_len, but most requests finish far short of it. The unused slots between the actual length and the reserved length sit idle for the whole lifetime of the request.',
    cost: 'Grows with the gap between the reserved maximum and the real length.',
  },
  {
    kind: 'Reservation',
    cause:
      'Slots for tokens the request will generate later are claimed at admission. They are eventually filled, but they sit empty for most of the request lifetime.',
    cost: 'Holds memory that other requests could use now, which caps batch size.',
  },
  {
    kind: 'External fragmentation',
    cause:
      'Requests of different sizes come and go, leaving non-contiguous free gaps. A new request needs one contiguous run; the free memory exists but not in one piece.',
    cost: 'Free memory that cannot be handed out, effectively stranded.',
  },
];

type PoolKind = 'null' | 'free' | 'shared' | 'a' | 'b';

interface PoolBlock {
  id: number;
  kind: PoolKind;
  tag: string;
  sub?: string;
}

const poolBlocks: PoolBlock[] = [
  { id: 0, kind: 'null', tag: 'null', sub: 'reserved' },
  { id: 1, kind: 'free', tag: 'free' },
  { id: 2, kind: 'shared', tag: 'A+B shared', sub: 'read-only' },
  { id: 3, kind: 'b', tag: 'B only' },
  { id: 4, kind: 'free', tag: 'free' },
  { id: 5, kind: 'shared', tag: 'A+B shared', sub: 'read-only' },
  { id: 6, kind: 'free', tag: 'free' },
  { id: 7, kind: 'a', tag: 'A only' },
];

/** Block tables as lists of physical block ids, indexed by logical block. */
const tableA = [5, 2, 7];
const tableB = [5, 2, 3];

const POOL_X0 = 140;
const POOL_STEP = 88;
const POOL_W = 78;
const POOL_Y = 170;
const POOL_H = 60;
const CELL_X = [140, 246, 352];
const CELL_W = 92;
const CELL_H = 40;
const A_Y = 34;
const B_Y = 320;

const poolCenter = (id: number) => POOL_X0 + id * POOL_STEP + POOL_W / 2;
const cellCenter = (i: number) => CELL_X[i] + CELL_W / 2;

function BlockTableMappingDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 380"
        role="img"
        aria-labelledby="paged-blocktable-title"
        aria-describedby="paged-blocktable-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="paged-blocktable-title">
          Two requests whose prompts share a two-block prefix point the first two entries of their
          block tables at the same physical blocks, at the same logical positions, and diverge
          into private blocks at the third entry. The physical blocks sit anywhere in one shared
          pool, in any order.
        </title>
        <desc id="paged-blocktable-desc">
          Request A&apos;s block table maps logical blocks L0, L1 and L2 to physical blocks 5, 2
          and 7. Request B&apos;s maps L0, L1 and L2 to blocks 5, 2 and 3. Blocks 5 and 2 are
          shared read-only by both requests; block 7 belongs to A only and block 3 to B only.
          Blocks 1, 4 and 6 are free, and block 0 is the reserved null block.
        </desc>
        <style>{`
          .pbt-row { fill: #16191f; font: 600 13px sans-serif; }
          .pbt-rowsub { fill: #5f6b7a; font: 11px sans-serif; }
          .pbt-cell { font: 600 12px sans-serif; fill: #16191f; text-anchor: middle; }
          .pbt-id { font: 600 13px sans-serif; fill: #16191f; text-anchor: middle; }
          .pbt-tag { font: 11px sans-serif; fill: #414d5c; text-anchor: middle; }
          .pbt-note { font: 11px sans-serif; fill: #414d5c; }
          .pbt-a { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pbt-b { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .pbt-shared { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 2; }
          .pbt-free { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 4 3; }
          .pbt-null { fill: #f2f3f3; stroke: #414d5c; stroke-width: 1.2; }
          .pbt-arr-a { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#pbt-ah-a); }
          .pbt-arr-b { stroke: #8b6c00; stroke-width: 1.5; fill: none; marker-end: url(#pbt-ah-b); }
        `}</style>
        <defs>
          <marker
            id="pbt-ah-a"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
          <marker
            id="pbt-ah-b"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect x="0" y="0" width="860" height="380" rx="8" fill="#ffffff" />

        {/* Request A block table */}
        <text className="pbt-row" x="20" y="50">
          Request A
        </text>
        <text className="pbt-rowsub" x="20" y="66">
          block table
        </text>
        {tableA.map((phys, i) => (
          <g key={`a-${i}`}>
            <rect className="pbt-a" x={CELL_X[i]} y={A_Y} width={CELL_W} height={CELL_H} rx="4" />
            <text className="pbt-cell" x={cellCenter(i)} y={A_Y + 25}>
              {`L${i}: #${phys}`}
            </text>
          </g>
        ))}
        <text className="pbt-note" x="470" y="50">
          L0 and L1 hold the shared prompt prefix: both
        </text>
        <text className="pbt-note" x="470" y="66">
          tables name the same blocks at the same positions.
        </text>

        {/* Physical pool */}
        <text className="pbt-row" x="20" y="194">
          KV block pool
        </text>
        <text className="pbt-rowsub" x="20" y="210">
          in GPU memory
        </text>
        {poolBlocks.map((b) => {
          const x = POOL_X0 + b.id * POOL_STEP;
          return (
            <g key={`p-${b.id}`}>
              <rect className={`pbt-${b.kind}`} x={x} y={POOL_Y} width={POOL_W} height={POOL_H} rx="4" />
              <text className="pbt-id" x={x + POOL_W / 2} y={POOL_Y + 20}>
                {`#${b.id}`}
              </text>
              <text className="pbt-tag" x={x + POOL_W / 2} y={POOL_Y + 37}>
                {b.tag}
              </text>
              {b.sub && (
                <text className="pbt-tag" x={x + POOL_W / 2} y={POOL_Y + 52}>
                  {b.sub}
                </text>
              )}
            </g>
          );
        })}

        {/* Request B block table */}
        <text className="pbt-row" x="20" y="336">
          Request B
        </text>
        <text className="pbt-rowsub" x="20" y="352">
          block table
        </text>
        {tableB.map((phys, i) => (
          <g key={`b-${i}`}>
            <rect className="pbt-b" x={CELL_X[i]} y={B_Y} width={CELL_W} height={CELL_H} rx="4" />
            <text className="pbt-cell" x={cellCenter(i)} y={B_Y + 25}>
              {`L${i}: #${phys}`}
            </text>
          </g>
        ))}
        <text className="pbt-note" x="470" y="336">
          L2 is where the prompts differ: each request
        </text>
        <text className="pbt-note" x="470" y="352">
          gets its own block and writes only that one.
        </text>

        {/* Mappings: A points down into the pool, B points up into it */}
        {tableA.map((phys, i) => (
          <line
            key={`am-${i}`}
            className="pbt-arr-a"
            x1={cellCenter(i)}
            y1={A_Y + CELL_H}
            x2={poolCenter(phys)}
            y2={POOL_Y - 2}
          />
        ))}
        {tableB.map((phys, i) => (
          <line
            key={`bm-${i}`}
            className="pbt-arr-b"
            x1={cellCenter(i)}
            y1={B_Y}
            x2={poolCenter(phys)}
            y2={POOL_Y + POOL_H + 2}
          />
        ))}
      </svg>
    </div>
  );
}

export function PagedAttentionKV() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why the KV (key-value) cache, not the weights, decides how many requests fit, how paging turns stranded memory back into batch slots, and the startup log line that tells you how many you got"
          >
            5. Paged KV Cache &amp; Block Tables
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The outcome this section is about.</strong> On a fixed HBM (high-bandwidth
            memory) budget, throughput is gated by how many requests you can keep in flight at
            once: the batch size. Batch size is gated by how much memory each request&apos;s KV
            cache consumes, and by how much of the allocated memory actually holds token state.
            The paged KV cache is the design that recovered the wasted fraction, and it is the
            reason vLLM exists. It comes from the 2023 PagedAttention paper, whose authors report
            a 2-4x throughput improvement over FasterTransformer and Orca at the same latency, with
            the gains larger for longer sequences, bigger models and more complex decoding{' '}
            <Cite tier={3} href={PAPER}>
              Kwon et al., Efficient Memory Management for Large Language Model Serving with
              PagedAttention, arXiv:2309.06180
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The paging lives in the memory manager.</strong> vLLM&apos;s KV cache keeps
            the paper&apos;s design, a pool of fixed-size KV blocks and a block table per request,
            and adds hash-chained prefix blocks for reuse. A reader who knows the paper will look for its
            kernel: the CUDA PagedAttention kernels were deleted in
            v0.25.0<sup>1</sup>. The attention backends (FlashAttention, FlashInfer, Triton and
            the backends for MLA, multi-head latent attention) read the paged KV cache through the
            block table{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/registry.py', 'L44-L151')}>
              registry.py L44-L151
            </Cite>
            .
          </Box>
          <Box variant="p">
            This section is the practitioner&apos;s view: the idea and what it does to capacity.
            The code paths are walked in <strong>14. Inside the Codebase &rarr; Scheduler &amp;
            KV Cache</strong> (block pool, free queue, block tables, prefix hashing) and{' '}
            <strong>&rarr; Execution &amp; Attention</strong> (how a step writes K and V into
            blocks and how attention reads them back). Where the KV cache physically lives in the
            memory hierarchy, the exact size formula, and the attention variants that shrink it
            are the subject of the sibling deep dive{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>
            .
          </Box>
          <Box variant="small" color="text-body-secondary">
            Code claims in this section were verified against vLLM v0.31.0 (commit{' '}
            <code>db9527a4</code>) on 2026-10-16.
          </Box>
          <Box variant="small" color="text-body-secondary">
            <sup>1</sup> The v0.25.0 release notes: &quot;PagedAttention has been removed (#47361).
            The legacy attention implementation is deleted now that V1/MRv2 backends are the
            standard path&quot; (MRv2 is Model Runner V2){' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.25.0`}>
              vLLM v0.25.0 release notes
            </Cite>{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/pull/47361">
              pull request #47361, Delete PagedAttention
            </Cite>
            . vLLM&apos;s design page on PagedAttention carries a warning that it is a historical
            document and no longer describes the code{' '}
            <Cite tier={1} href={vllmUrl('docs/design/paged_attention.md', 'L3-L5')}>
              paged_attention.md L3-L5
            </Cite>
            . In vLLM the name refers to the idea and the paper.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The three ways a worst-case reservation wastes memory, each of which caps the batch you can run"
          >
            Why a contiguous KV buffer strands memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The naive design.</strong> The obvious way to store a request&apos;s KV cache
            is one contiguous tensor, sized for the longest sequence the request might reach. It
            is simple, and attention kernels like contiguity. The challenge is that the KV cache{' '}
            <em>grows one token at a time</em> and its final length is unknown at admission, so a
            contiguous allocator reserves for the worst case, and that worst case almost never
            materializes. In the contiguous systems the paper profiled, only{' '}
            <strong>20.4% to 38.2%</strong> of the KV cache memory held actual token states{' '}
            <Cite tier={3} href={PAPER}>
              Kwon et al. 2023, section 1 and Figure 2
            </Cite>
            . The rest is the waste in this table.
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
            waste costs memory, and it directly caps throughput. Paging converts that stranded
            memory back into batch capacity.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The picture to carry into every later section: a request is a list of block ids, and requests with the same prefix point at the same blocks"
          >
            Page the KV cache: blocks, block tables and shared prefixes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The core move.</strong> Paging splits each request&apos;s KV cache into
            fixed-size <em>blocks</em>, each holding the K and V vectors for a constant number of
            tokens. Instead of one contiguous tensor, a request holds a{' '}
            <strong>block table</strong>: an ordered list mapping its contiguous{' '}
            <em>logical</em> positions to <em>physical</em> block ids that can sit anywhere in a
            shared pool, in any order. The paper frames this as &quot;an attention algorithm
            inspired by the classical virtual memory and paging techniques in operating
            systems&quot;{' '}
            <Cite tier={3} href={PAPER}>
              arXiv:2309.06180
            </Cite>
            : the block table is a page table, the pool is physical memory, and a request&apos;s
            token sequence is its virtual address space. In vLLM the indirection reaches the
            attention backend as two tensors in its metadata: the <code>block_table</code>, and a
            per-token <code>slot_mapping</code> that says where each new token&apos;s K and V are
            written{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L525-L526')}>
              flash_attn.py L525-L526
            </Cite>
            .
          </Box>
          <BlockTableMappingDiagram />
          <Box variant="small" color="text-body-secondary">
            Shared prefix blocks are read-only; the first block where the tokens differ gets its
            own physical block. Block ids are an example state, and block 0 is the reserved null
            block{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L184-L188')}>
              block_pool.py L184-L188
            </Cite>
            . Illustrative, not measured.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What paging removes</Box>
              <Box variant="p">
                Blocks are allocated on demand as the sequence grows, up to the tokens computed so
                far plus the tokens scheduled this step{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L538-L541')}>
                  kv_cache_manager.py L538-L541
                </Cite>
                , so there is no worst-case reservation. A block is either full or the single
                trailing partial block, so internal fragmentation is bounded to one block per
                request (one per KV cache group on a hybrid model, below). Any free block fits any
                request, so external fragmentation disappears. The paper&apos;s headline is{' '}
                <strong>near-zero waste</strong> in KV cache memory. One check still covers the
                whole prompt: by default the scheduler admits a request only when its full prompt
                fits in the KV cache, which prevents over-admission under chunked prefill{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L191-L195')}>
                  scheduler.py L191-L195
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">What paging enables</Box>
              <Box variant="p">
                Blocks are also the unit of sharing. Requests with an identical prompt prefix point
                their tables at the same physical blocks, read-only: the foundation of automatic
                prefix caching (section 6) and of the paper&apos;s &quot;flexible sharing of KV
                cache within and across requests&quot;. A block&apos;s prefix-cache hash chains
                its parent&apos;s hash{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
                  kv_cache_utils.py L684-L714
                </Cite>
                , so a cached block matches only at the same logical position, after an identical
                prefix, which is why the shared blocks in the diagram line up. Sharing saves memory
                and lets the server skip recomputing the shared prompt tokens.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The mechanics are walked against the source in{' '}
            <strong>14. Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong>: block
            tables that grow at the end with a null-block sentinel, a free queue that doubles as
            the LRU (least-recently-used) eviction order with the next victim at its head, a
            full-block prefix hit that reuses a block id with no copy, and a control path that is
            CPU-side bookkeeping while the GPU only sees integer block ids.
          </Box>
          <ExpandableSection headerText="Mental model: it really is virtual memory, in two senses">
            <SpaceBetween size="s">
              <Box variant="p">
                The operating-system analogy is exact in the part that matters and loose in the
                part that does not. <strong>Exact:</strong> a per-request block table translates
                contiguous logical positions to scattered physical blocks, allocation is
                on-demand, and read-only sharing of full prefix blocks is how identical prefixes
                coexist, all faithful to demand-paged virtual memory.
              </Box>
              <Box variant="p">
                <strong>Loose:</strong> there is no page fault to backing store on the hot path.
                vLLM&apos;s V1 engine recovers from memory pressure by <em>recomputing</em> a
                preempted request&apos;s KV cache, not by swapping it to host memory and faulting
                it back in. So the &quot;page table&quot; is real, but the &quot;swap&quot; is
                replaced by recompute. Offloading KV blocks to CPU or remote tiers is a separate,
                explicit feature, off until you set <code>--kv-offloading-size</code> or name an
                offloading connector in <code>--kv-transfer-config</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L256-L260')}>
                  cache.py L256-L260
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1124-L1158')}>
                  vllm.py L1124-L1158
                </Cite>{' '}
                (section 7, KV-Cache Offloading &amp; Tiers).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a model that mixes full attention with sliding-window or Mamba layers holds several block tables per request, and the startup warning that says the hybrid manager is off"
          >
            Hybrid models: one pool, one block table per KV cache group
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Many current models mix layer types: sliding-window plus full attention (gpt-oss,
            Gemma 2 and 3), Mamba plus full attention (Bamba, Jamba), chunked local plus full
            attention (Llama 4). A full-attention layer needs KV for every token; a sliding-window
            layer needs only the most recent window{' '}
            <Cite tier={1} href={vllmUrl('docs/design/hybrid_kv_cache_manager.md', 'L8-L20')}>
              hybrid_kv_cache_manager.md L8-L20
            </Cite>
            . vLLM describes each layer&apos;s cache with a KV cache spec (full attention, sliding
            window, chunked local attention, MLA, Mamba state, cross-attention and more){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_cache_interface.py', 'L156-L1234')}>
              kv_cache_interface.py L156-L1234
            </Cite>
            , groups the layers that share a spec, and gives each group its own block table{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_cache_interface.py', 'L1448-L1451')}>
              kv_cache_interface.py L1448-L1451
            </Cite>
            . Every group&apos;s manager draws from the same block pool{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L96-L139')}>
              kv_cache_coordinator.py L96-L139
            </Cite>
            , blocks share one page size, and each group takes as many blocks as its attention type
            needs{' '}
            <Cite tier={1} href={vllmUrl('docs/design/hybrid_kv_cache_manager.md', 'L47')}>
              hybrid_kv_cache_manager.md L47
            </Cite>
            . A sliding-window group frees the blocks that fall out of its window as the request
            runs{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_manager.py', 'L543-L556')}>
              kv_cache_manager.py L543-L556
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Watch for the hybrid manager turning off.</strong> vLLM enables it unless
            something rules it out: a platform without support, chunked local attention (off by
            default over a latency regression), or a connector in <code>--kv-transfer-config</code>{' '}
            that does not support it. The connector case logs{' '}
            <code>Turning off hybrid kv cache manager because ...</code> and names the impact:
            hybrid state-space models such as Jamba and Bamba fail at startup, and sliding-window
            models run with reduced performance{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L2217-L2288')}>
              vllm.py L2217-L2288
            </Cite>
            . <code>--disable-hybrid-kv-cache-manager</code> forces the same KV allocation for
            every attention layer{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L183-L189')}>
              scheduler.py L183-L189
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Where copy-on-write appears.</strong> Prefix-cache hits land on whole blocks,
            with one exception: on a hybrid model with a Mamba group in <code>align</code> mode, a
            hit can end inside a large physical block{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_coordinator.py', 'L687-L704')}>
              kv_cache_coordinator.py L687-L704
            </Cite>
            . The request then gets a private copy-on-write block in place of the shared one, and
            the worker copies that one block on the GPU before the forward pass reads it{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/single_type_kv_cache_manager.py', 'L387-L397')}>
              single_type_kv_cache_manager.py L387-L397
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/model_runner.py', 'L1226-L1233')}>
              model_runner.py L1226-L1233
            </Cite>
            . Full-attention-only models hit on whole blocks, with no copy.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Recovered memory becomes batch size, and batch size becomes throughput">
            The payoff: more batch on the same HBM
          </Header>
        }
      >
        <Box variant="p">
          <strong>The causal chain.</strong> Near-zero fragmentation means a far larger share of
          the HBM budget holds real token state: 96.3% under vLLM in the paper&apos;s profiling,
          against 20.4% to 38.2% for the contiguous systems{' '}
          <Cite tier={3} href={PAPER}>
            Kwon et al. 2023, Figure 2
          </Cite>
          . That share decides how many concurrent requests fit. More concurrent requests means a
          wider batch, and a wider batch is how a memory-bandwidth-bound decode workload amortizes
          each weight read across more tokens, raising hardware utilization and therefore tokens
          per second. Contiguous allocation pays for memory it never uses; paging pays only for
          memory it does use. Paging does not make any single request faster; it lets the GPU
          serve <em>many more requests at once</em> from the same memory, which is where the
          paper&apos;s 2-4x aggregate throughput comes from.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which terms of the KV formula you can move at runtime, and why one flag can double the tokens the pool holds"
          >
            Sizing: the KV cache, not the weights, fills the memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The shape of the cost.</strong> For standard and grouped-query attention,
            KV cache size scales with <code>num_layers</code> {'×'} <code>num_kv_heads</code>{' '}
            {'×'} <code>head_dim</code> {'×'} <code>seq_len</code> {'×'} bytes-per-element
            {' '}{'×'} batch size, with a factor of 2 for storing both K and V. The terms an
            operator moves at runtime are <code>seq_len</code> (longer contexts cost linearly
            more), batch size, and bytes per element. Unlike the model weights, a fixed cost paid
            once, the KV cache is a <em>per-request, per-token</em> cost that scales with load.
            Under any meaningful concurrency it is the KV cache, not the weights, that consumes
            most of the serving memory budget.
          </Box>
          <Box variant="p">
            <strong>Bytes per element is a flag.</strong> <code>--kv-cache-dtype</code> defaults
            to <code>auto</code>, the model&apos;s own dtype{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L123-L132')}>
              cache.py L123-L132
            </Cite>
            . The other values include <code>fp8</code> (E4M3) and <code>fp8_e5m2</code>,{' '}
            <code>nvfp4</code>, per-token-head <code>int8</code>, <code>int4</code> and{' '}
            <code>fp8</code> formats, and MLA-specific and TurboQuant variants{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L39-L58')}>
              cache.py L39-L58
            </Cite>
            . By the formula above, an 8-bit format holds twice the tokens of a 16-bit one in the
            same pool. Each attention backend declares the KV dtypes it accepts (FlashAttention:{' '}
            <code>auto</code>, <code>float16</code>, <code>bfloat16</code>, <code>fp8</code>,{' '}
            <code>fp8_e4m3</code>){' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/flash_attn.py', 'L288-L294')}>
              flash_attn.py L288-L294
            </Cite>
            , so the dtype also feeds backend selection (14. Inside the Codebase &rarr; Execution
            &amp; Attention). Accuracy and scaling are covered in 8. Quantization &amp; Precision.
          </Box>
          <Box variant="p">
            The exact byte formula is derived in the sibling deep dive{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>
            , together with the GQA (grouped-query attention) and MQA (multi-query attention)
            reductions that cut the <code>num_kv_heads</code> term and MLA, which compresses K and
            V into a smaller latent instead. Those reductions and paging are{' '}
            <em>complementary</em>: attention variants shrink the per-token cost, and paging removes
            the waste around whatever that cost is.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The three settings that decide how many KV blocks exist, and the startup log line that turns this section into a number for your deployment"
          >
            Size the pool, then read what you got
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">
                <code>block_size</code>
              </Box>
              <Box variant="p">
                Tokens per KV block, the paging granularity. Left unset, it starts at 16{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L71-L75')}>
                  cache.py L71-L75
                </Cite>{' '}
                and vLLM then picks a size every selected attention backend supports, such as 64
                for FlashMLA or 128 for CUTLASS MLA{' '}
                <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L683-L697')}>
                  interface.py L683-L697
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/mla/flashmla.py', 'L57-L59')}>
                  flashmla.py L57-L59
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/attention/backends/mla/cutlass_mla.py', 'L48-L50')}>
                  cutlass_mla.py L48-L50
                </Cite>
                . When it does, the startup log says{' '}
                <code>Setting kv cache block size to N for BACKEND backend(s).</code> Hybrid models
                re-align the size afterwards, even over an explicit <code>--block-size</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/platforms/interface.py', 'L699-L702')}>
                  interface.py L699-L702
                </Cite>
                . Smaller blocks tighten the trailing partial block; larger blocks cut per-block
                bookkeeping and indirection.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                <code>gpu_memory_utilization</code>
              </Box>
              <Box variant="p">
                The fraction of GPU memory this vLLM instance may claim: &quot;The fraction of GPU
                memory to be used for the model executor&quot;, default 0.92{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L103-L112')}>
                  cache.py L103-L112
                </Cite>
                . Whatever is left after the weights and activation workspace becomes the block
                pool, so this knob sets how many KV blocks exist, and with them the batch-size
                ceiling. The optimization guide notes vLLM &quot;pre-allocates GPU cache using this
                percentage of memory&quot; and lists raising it as a remedy for preemption{' '}
                <Cite tier={1} href={vllmUrl('docs/configuration/optimization.md', 'L40')}>
                  optimization.md L40
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">
                <code>kv_cache_memory_bytes</code>
              </Box>
              <Box variant="p">
                <code>--kv-cache-memory-bytes</code>{' '}
                <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1331-L1333')}>
                  arg_utils.py L1331-L1333
                </Cite>{' '}
                sizes the pool directly, per GPU, and ignores <code>gpu_memory_utilization</code>{' '}
                when set{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L247-L254')}>
                  cache.py L247-L254
                </Cite>
                . It takes bytes or a suffix: <code>40G</code> is 40 GiB, <code>40g</code> is
                40,000,000,000 bytes{' '}
                <Cite tier={1} href={vllmUrl('vllm/utils/argparse_utils.py', 'L29-L73')}>
                  argparse_utils.py L29-L73
                </Cite>
                . A profiled boot logs the measured split (weights, peak activation, CUDA graph
                memory) and suggests a value{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L901-L955')}>
                  gpu_worker.py L901-L955
                </Cite>
                ; passing it back on the next boot skips memory profiling, and the value holds only
                on the same GPU with the same free memory{' '}
                <Cite tier={1} href={vllmDocsUrl('configuration/optimization/')}>
                  vLLM docs: Optimization and Tuning
                </Cite>
                . The docs and that log line shorten the flag to <code>--kv-cache-memory</code>,
                which works because argparse accepts an unambiguous prefix of a long option{' '}
                <Cite tier={1} href="https://docs.python.org/3/library/argparse.html#allow-abbrev">
                  Python docs: argparse allow_abbrev
                </Cite>
                ; we confirmed it against the v0.31.0 parser.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning">
            <strong>Push it too high and you trade headroom for crashes.</strong> The pool is
            pre-allocated, so an over-aggressive <code>gpu_memory_utilization</code> leaves no
            slack for activation spikes or fragmentation in the allocator and risks out-of-memory
            errors under load. When KV memory genuinely runs out mid-run, vLLM preempts requests
            and recomputes them later rather than crashing; the periodic stats log then adds a{' '}
            <code>Preemptions</code> count{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L274-L307')}>
              loggers.py L274-L307
            </Cite>
            . The recompute-only path and its metrics are in{' '}
            <strong>14. Inside the Codebase &rarr; Scheduler &amp; KV Cache</strong>.
          </Alert>
          <Box variant="p">
            For the broader set of memory-conservation levers (tensor parallelism,
            quantization, capping context length and batch size, and reducing CUDA graphs),
            vLLM keeps a dedicated guide{' '}
            <Cite tier={1} href={vllmDocsUrl('configuration/conserving_memory/')}>
              vLLM docs: Conserving Memory
            </Cite>
            . These sit alongside paging rather than replacing it.
          </Box>
          <Box variant="p">
            <strong>Read the pool you got.</strong> At startup vLLM logs one line that turns this
            section into a number for your deployment:{' '}
            <code>GPU KV cache size: N tokens, Maximum concurrency for M tokens per request:
            X.XXx</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L2455-L2471')}>
              kv_cache_utils.py L2455-L2471
            </Cite>
            . M is <code>max_model_len</code>, and X is how many requests at that full length fit
            in the pool at once, counting the blocks every KV cache group needs{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L1090-L1101')}>
              kv_cache_utils.py L1090-L1101
            </Cite>
            . Shorter requests take fewer blocks, because allocation is on demand. If X sits below
            the concurrency you plan to run at full context, the levers are the ones above: a
            bigger pool (<code>gpu_memory_utilization</code> or{' '}
            <code>--kv-cache-memory-bytes</code>), a narrower <code>--kv-cache-dtype</code>, or a
            shorter <code>max_model_len</code>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
