import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const OFFLOAD_DOCS = 'docs/features/kv_offloading_usage.md';
const LMCACHE_README = 'https://github.com/LMCache/LMCache/blob/v0.5.6/README.md';

interface TierRow {
  tier: ReactNode;
  reuse: ReactNode;
  enable: ReactNode;
  cost: ReactNode;
}

const tierRows: TierRow[] = [
  {
    tier: 'CPU primary tier',
    reuse: 'Across requests on this instance. The memory is released when the instance stops.',
    enable: (
      <>
        <code>--kv-offloading-size &lt;GiB&gt;</code> (total across tensor-parallel ranks), or{' '}
        <code>cpu_bytes_to_use</code> in bytes in the long form
      </>
    ),
    cost: (
      <>
        Host RAM, counted across all workers. On CUDA it is one shared region in{' '}
        <code>/dev/shm</code>, so the container&apos;s <code>/dev/shm</code> must hold it.
        Eviction is <code>lru</code> (least recently used, the default) or <code>arc</code>{' '}
        (adaptive replacement cache).
      </>
    ),
  },
  {
    tier: (
      <>
        <code>fs</code> (filesystem)
      </>
    ),
    reuse: (
      <>
        Across instances that share <code>root_dir</code>, and, by our reading of the code,
        across restarts: a lookup is a file-existence check under a directory named by the run
        configuration.
      </>
    ),
    enable: (
      <>
        <code>&quot;type&quot;: &quot;fs&quot;</code>, <code>root_dir</code>, optional{' '}
        <code>n_read_threads</code> / <code>n_write_threads</code> (16 each)
      </>
    ),
    cost: (
      <>
        Disk space. The tier takes no capacity key; directories left by older run
        configurations are orphaned and safe to delete.
      </>
    ),
  },
  {
    tier: (
      <>
        <code>obj</code> (object store)
      </>
    ),
    reuse:
      'Across instances that share a bucket, and, by the same reading, across restarts (the key scheme matches fs).',
    enable: (
      <>
        <code>&quot;type&quot;: &quot;obj&quot;</code> with <code>store_config.bucket</code> and{' '}
        <code>endpoint_override</code>; S3-compatible, through the NIXL OBJ backend
      </>
    ),
    cost: (
      <>
        Bucket storage with no capacity key. Empty credentials fall back to the AWS SDK default
        chain. Startup fails fast when the bucket is unreachable.
      </>
    ),
  },
  {
    tier: (
      <>
        <code>p2p</code> (peer instances)
      </>
    ),
    reuse:
      "Across live instances with no shared storage: a consumer pulls blocks a peer holds in its CPU tier, so they last only as long as that peer's process.",
    enable: (
      <>
        <code>&quot;type&quot;: &quot;p2p&quot;</code>, plus <code>VLLM_P2P_SIDE_CHANNEL_HOST</code>{' '}
        set to the node&apos;s routable IP (the default, <code>localhost</code>, binds loopback
        only)
      </>
    ),
    cost: (
      <>
        An orchestrator: the router picks the peer and sets <code>remote_kv_source</code> in each
        request&apos;s <code>kv_transfer_params</code>. Without it the tier acts as a local CPU
        cache.
      </>
    ),
  },
  {
    tier: (
      <>
        <code>kvcr</code> or your own
      </>
    ),
    reuse: 'Whatever the backing store provides.',
    enable: (
      <>
        <code>&quot;type&quot;: &quot;kvcr&quot;</code> (needs the external <code>kvcr</code>{' '}
        package), or a <code>SecondaryTierManager</code> class named by <code>type</code> and{' '}
        <code>module_path</code>
      </>
    ),
    cost: (
      <>
        The v0.31.0 docs have no page for <code>kvcr</code>; read the adapter before relying on
        it.
      </>
    ),
  },
];

interface UseCaseRow {
  pattern: string;
  reuse: string;
  tier: ReactNode;
}

const useCaseRows: UseCaseRow[] = [
  {
    pattern: 'Long-context reuse',
    reuse: 'The same large document or codebase prompted repeatedly with different questions',
    tier: (
      <>
        CPU tier; add <code>fs</code> when the documents outgrow host RAM
      </>
    ),
  },
  {
    pattern: 'Multi-turn chat',
    reuse: 'Conversation history re-sent every turn, idle between turns',
    tier: (
      <>
        CPU tier: earlier turns are already stored when HBM evicts them between turns. Tokens
        are not stored while they are generated (<code>offload_prompt_only</code> defaults to
        true); they become storable when the next turn sends them back as prompt.
      </>
    ),
  },
  {
    pattern: 'RAG',
    reuse: 'Retrieved chunks shared across many users and queries',
    tier: (
      <>
        Reusable only when the chunk sits after an identical prefix, because block hashes chain
        their parent. LMCache&apos;s CacheBlend reuses a chunk at any position and recomputes some
        tokens.
      </>
    ),
  },
  {
    pattern: 'Cross-replica and restarts',
    reuse: 'A prefix warmed on one replica served by another, or by the same replica after a restart',
    tier: (
      <>
        <code>fs</code> on a shared directory or <code>obj</code> on a shared bucket;{' '}
        <code>p2p</code> between live peers; or one LMCache server for several engines
      </>
    ),
  },
];

function KVMemoryHierarchyDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 432"
        role="img"
        aria-labelledby="kvoff-hier-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="kvoff-hier-title">
          vLLM stores each completed KV block from GPU memory into a CPU primary tier as it is
          produced, and loads blocks back to the GPU on a prefix hit. The CPU tier is the only
          tier with GPU access: secondary tiers (filesystem, S3-compatible object store, peer vLLM
          instances over NIXL, the kvcr adapter, or an out-of-tree class) sit behind it and are
          consulted in order. All of this is the OffloadingConnector, one of several connectors
          on the KV connector spine alongside SimpleCPUOffloadConnector, HiSparseConnector,
          NixlConnector, MultiConnector and the two LMCache connectors.
        </title>
        <style>
          {`
          .kvh-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .kvh-gpu { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .kvh-cpu { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .kvh-sec { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .kvh-own { fill: #ffffff; stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .kvh-panel { fill: #f7f8f9; stroke: #d1d5db; stroke-width: 1; }
          .kvh-row { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .kvh-main { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .kvh-lmc { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .kvh-h { fill: #16191f; font: 600 13px sans-serif; }
          .kvh-hc { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .kvh-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .kvh-sw { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .kvh-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .kvh-n { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .kvh-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .kvh-l { fill: #16191f; font: 600 12px sans-serif; }
          .kvh-ls { fill: #5f6b7a; font: 11px sans-serif; }
          .kvh-le { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .kvh-arr { stroke: #414d5c; stroke-width: 1.8; fill: none; marker-end: url(#kvh-ah); }
          .kvh-two { stroke: #8b6c00; stroke-width: 1.5; fill: none; marker-start: url(#kvh-ah2); marker-end: url(#kvh-ah2); }
          .kvh-line { stroke: #8b6c00; stroke-width: 1.5; fill: none; }
          .kvh-br { stroke: #0972d3; stroke-width: 1.5; fill: none; }
          .kvh-brarr { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#kvh-ah3); }
          .kvh-lmarr { stroke: #6f4cc4; stroke-width: 1.5; fill: none; marker-end: url(#kvh-ah4); }
        `}
        </style>
        <defs>
          <marker id="kvh-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#414d5c" />
          </marker>
          <marker id="kvh-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
          <marker id="kvh-ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
          <marker id="kvh-ah4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
        </defs>

        <rect className="kvh-bg" x={0} y={0} width={900} height={432} rx={8} />

        {/* Left: GPU and the native tiers */}
        <text className="kvh-h" x={24} y={32}>GPU and vLLM&apos;s native tiers (OffloadingConnector)</text>

        <rect className="kvh-gpu" x={24} y={48} width={552} height={56} rx={6} />
        <text className="kvh-tw" x={300} y={71}>GPU HBM: the paged KV cache</text>
        <text className="kvh-sw" x={300} y={90}>prefix-cache hits are served here first</text>

        <path className="kvh-arr" d="M180,106 L180,172" />
        <text className="kvh-l" x={192} y={134}>store on completion</text>
        <text className="kvh-ls" x={192} y={150}>as blocks fill, every step</text>

        <path className="kvh-arr" d="M400,172 L400,106" />
        <text className="kvh-l" x={412} y={134}>load on prefix hit</text>
        <text className="kvh-ls" x={412} y={150}>promoted back to GPU</text>

        <rect className="kvh-cpu" x={24} y={174} width={552} height={60} rx={6} />
        <text className="kvh-t" x={300} y={198}>CPU primary tier: pinned host memory</text>
        <text className="kvh-s" x={300} y={218}>the only tier with GPU access; lru (default) or arc eviction</text>

        <path className="kvh-line" d="M300,234 L300,266" />
        <path className="kvh-line" d="M76,266 L524,266" />
        <text className="kvh-ls" x={32} y={256}>staged through the CPU tier</text>
        <text className="kvh-le" x={568} y={256}>tier 0 is consulted first</text>

        {[76, 188, 300, 412, 524].map((cx) => (
          <path key={cx} className="kvh-two" d={`M${cx},270 L${cx},314`} />
        ))}

        <rect className="kvh-sec" x={24} y={318} width={104} height={62} rx={6} />
        <text className="kvh-t" x={76} y={339}>fs</text>
        <text className="kvh-s" x={76} y={356}>filesystem dir</text>
        <text className="kvh-s" x={76} y={371}>local or shared</text>

        <rect className="kvh-sec" x={136} y={318} width={104} height={62} rx={6} />
        <text className="kvh-t" x={188} y={339}>obj</text>
        <text className="kvh-s" x={188} y={356}>S3-compatible</text>
        <text className="kvh-s" x={188} y={371}>object store</text>

        <rect className="kvh-sec" x={248} y={318} width={104} height={62} rx={6} />
        <text className="kvh-t" x={300} y={339}>p2p</text>
        <text className="kvh-s" x={300} y={356}>peer vLLM</text>
        <text className="kvh-s" x={300} y={371}>over NIXL</text>

        <rect className="kvh-sec" x={360} y={318} width={104} height={62} rx={6} />
        <text className="kvh-t" x={412} y={339}>kvcr</text>
        <text className="kvh-s" x={412} y={356}>adapter for the</text>
        <text className="kvh-s" x={412} y={371}>kvcr package</text>

        <rect className="kvh-own" x={472} y={318} width={104} height={62} rx={6} />
        <text className="kvh-t" x={524} y={339}>module_path</text>
        <text className="kvh-s" x={524} y={356}>out-of-tree</text>
        <text className="kvh-s" x={524} y={371}>tier class</text>

        <text className="kvh-ls" x={24} y={406}>
          Back-pressure (opt-in, per tier) drops stores to a tier that falls behind.
        </text>

        {/* Bracket: the whole left stack is the OffloadingConnector */}
        <path className="kvh-br" d="M584,48 L594,48 L594,380 L584,380" />
        <path className="kvh-brarr" d="M630,76 L597,76" />

        {/* Right: the connector spine */}
        <rect className="kvh-panel" x={618} y={10} width={264} height={412} rx={8} />
        <text className="kvh-hc" x={750} y={32}>KV connector spine</text>
        <text className="kvh-s" x={750} y={48}>selected in --kv-transfer-config</text>

        <rect className="kvh-main" x={632} y={58} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={73}>OffloadingConnector</text>
        <text className="kvh-s" x={750} y={87}>native CPU and secondary tiers</text>

        <rect className="kvh-row" x={632} y={100} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={115}>SimpleCPUOffloadConnector</text>
        <text className="kvh-s" x={750} y={129}>alternative CPU or disk offloader</text>

        <rect className="kvh-row" x={632} y={142} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={157}>HiSparseConnector</text>
        <text className="kvh-s" x={750} y={171}>host tier for sparse-MLA decode</text>

        <rect className="kvh-row" x={632} y={184} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={199}>NixlConnector</text>
        <text className="kvh-s" x={750} y={213}>prefill to decode (section 10)</text>

        <rect className="kvh-row" x={632} y={226} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={241}>MultiConnector</text>
        <text className="kvh-s" x={750} y={255}>runs several connectors at once</text>

        <rect className="kvh-lmc" x={632} y={268} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={283}>LMCacheConnectorV1</text>
        <text className="kvh-s" x={750} y={297}>LMCache inside the engine</text>

        <rect className="kvh-lmc" x={632} y={310} width={236} height={36} rx={5} />
        <text className="kvh-n" x={750} y={325}>LMCacheMPConnector</text>
        <text className="kvh-s" x={750} y={339}>client of an LMCache server</text>

        <path className="kvh-lmarr" d="M750,346 L750,364" />
        <rect className="kvh-lmc" x={632} y={366} width={236} height={48} rx={5} />
        <text className="kvh-n" x={750} y={385}>LMCache server process</text>
        <text className="kvh-s" x={750} y={403}>its own CPU, disk, remote backends</text>
      </svg>
    </div>
  );
}

export function KVOffloadingLMCache() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Keep a copy of computed prefixes below GPU memory, so a repeated prompt loads its KV instead of paying prefill again: on this instance, on its neighbours, or after a restart"
          >
            7. KV-Cache Offloading &amp; Tiers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            GPU HBM (High-Bandwidth Memory) holds the paged KV (key-value) cache, and prefix
            caching (section 6) reuses its blocks only while they stay resident. When the block
            pool needs room, free prefix blocks are evicted, and the next request that needs that
            prefix pays the full prefill again. KV offloading extends the prefix cache into larger,
            slower tiers so that reuse outlives HBM residency.
          </Box>
          <Box variant="p">
            <strong>The model: store on completion, load on hit.</strong> With vLLM&apos;s
            default offloader, every scheduler step queues stores for the KV blocks that step completes, so a copy reaches host memory as
            the blocks are produced{' '}
            <Cite
              tier={1}
              href={vllmUrl(
                'vllm/distributed/kv_transfer/kv_connector/v1/offloading/scheduler.py',
                'L1501-L1530',
              )}
              kind="code"
            >
              offloading/scheduler.py L1501-L1530
            </Cite>
            . The lower tier already holds the block by the time HBM evicts it, and a later
            request whose prefix hits there loads it back to the GPU instead of recomputing it{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L3')}>
              KV Offloading Usage Guide L3
            </Cite>
            . Eviction from HBM costs nothing extra, and one sizing rule follows from it: a CPU
            tier no larger than the GPU KV cache only mirrors what the GPU already holds and adds
            no hit rate{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L352-L355')}>
              KV Offloading Usage Guide L352-L355
            </Cite>
            .
          </Box>
          <Box variant="small" color="text-body-secondary">
            Verified against vLLM v0.31.0 (commit <code>db9527a4</code>) and LMCache v0.5.6 on
            2026-10-16. The KV connector API logs that it is experimental and subject to change{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/base.py', 'L210-L211')}
              kind="code"
            >
              kv_connector/v1/base.py L210-L211
            </Cite>
            , and minor releases from v0.23.0 to v0.31.0 shipped 12 to 16 days apart{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/releases">
              vLLM releases
            </Cite>
            : re-check field names when you upgrade.
          </Box>
          <Alert type="info">
            The connector classes, call paths and config fields are covered in{' '}
            <strong>14. Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>, and
            prefill-to-decode KV transfer in <strong>10. Disaggregated Prefill / Decode</strong>.
            How HBM, host memory and flash behave as hardware is the subject of the sibling{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive. This section covers which tier to turn on, what each buys, what it costs,
            and how to watch it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a stored block can live, which path it takes back to the GPU, and which reuse each tier buys you"
          >
            The tier stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM&apos;s own offloader is the <code>OffloadingConnector</code>. Its default spec,{' '}
            <code>CPUOffloadingSpec</code>, keeps a single CPU tier in pinned host memory.{' '}
            <code>TieringOffloadingSpec</code> adds an ordered list of secondary tiers behind it: a
            filesystem directory (<code>fs</code>), an S3-compatible object store (<code>obj</code>
            ), peer vLLM instances (<code>p2p</code>) reached over NIXL (NVIDIA Inference Xfer
            Library), an adapter for the external <code>kvcr</code> package, or a class of your
            own{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/kv_offload/tiering/factory.py', 'L146-L174')}
              kind="code"
            >
              tiering/factory.py L146-L174
            </Cite>
            . Only the CPU tier reads and writes GPU memory, with asynchronous DMA (direct memory
            access) copies; every block bound for or coming from a secondary tier passes through
            it{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L10-L15')}>
              KV Offloading Usage Guide L10-L15
            </Cite>
            . LMCache is the other backend, reached through its own connectors on the same spine.
          </Box>
          <KVMemoryHierarchyDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Connector names come from the registry, which holds 17 at
            v0.31.0{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/factory.py', 'L153-L248')}
              kind="code"
            >
              kv_connector/factory.py L153-L248
            </Cite>
            ; the diagram shows the seven this section discusses.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'tier', header: 'Tier', cell: (r) => <strong>{r.tier}</strong>, minWidth: 130 },
              { id: 'reuse', header: 'Reuse it buys', cell: (r) => r.reuse, minWidth: 220 },
              { id: 'enable', header: 'Turn it on', cell: (r) => r.enable, minWidth: 220 },
              { id: 'cost', header: 'Cost and what to watch', cell: (r) => r.cost, minWidth: 240 },
            ]}
            items={tierRows}
          />
          <ExpandableSection headerText="Evidence for the tier table">
            <SpaceBetween size="xs">
              <Box variant="p">
                CPU tier: <code>cpu_bytes_to_use</code> is the total across all workers and{' '}
                <code>eviction_policy</code> is <code>lru</code> or <code>arc</code>{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L100-L113')}>
                  Usage Guide L100-L113
                </Cite>
                . On CUDA the buffer is a shared region at{' '}
                <code>/dev/shm/vllm_offload_&lt;engine_id&gt;.mmap</code>, unlinked once every
                worker maps it so the kernel reclaims it when the last worker exits{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/cpu/shared_offload_region.py', 'L183-L202')}
                  kind="code"
                >
                  shared_offload_region.py L183-L202
                </Cite>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/cpu/spec.py', 'L162-L165')}
                  kind="code"
                >
                  cpu/spec.py L162-L165
                </Cite>
                ; when <code>/dev/shm</code> is too small, startup fails with &quot;Insufficient
                space in /dev/shm&quot; and suggests <code>--shm-size</code> or{' '}
                <code>--ipc=host</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/distributed/device_communicators/shm_broadcast.py', 'L244-L253')}
                  kind="code"
                >
                  shm_broadcast.py L244-L253
                </Cite>
                .
              </Box>
              <Box variant="p">
                <code>fs</code> and <code>obj</code>: the run-configuration directory, file layout,
                cross-instance sharing (works by default with the sha256 prefix hash; the{' '}
                <code>xxhash</code> variants need the same <code>PYTHONHASHSEED</code> on every
                instance), credentials and fail-fast probe{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L153-L220')}>
                  Usage Guide L153-L220
                </Cite>
                . The <code>fs</code> lookup checks that the block file exists{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/tiering/fs/manager.py', 'L76-L83')}
                  kind="code"
                >
                  fs/manager.py L76-L83
                </Cite>
                , and its constructor takes no capacity argument{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/tiering/fs/manager.py', 'L109-L120')}
                  kind="code"
                >
                  fs/manager.py L109-L120
                </Cite>
                ; that a restarted instance finds earlier blocks is our reading of those two facts,
                not a tested result. Orphaned directories:{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L358')}>
                  Usage Guide L358
                </Cite>
                .
              </Box>
              <Box variant="p">
                <code>p2p</code>: RDMA (remote direct memory access) transfer over NIXL, the{' '}
                <code>VLLM_P2P_SIDE_CHANNEL_HOST</code> default, and the orchestration protocol in
                which the router chooses the peer{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L222-L273')}>
                  Usage Guide L222-L273
                </Cite>
                . <code>kvcr</code> imports the external package{' '}
                <Cite
                  tier={1}
                  href={vllmUrl('vllm/v1/kv_offload/tiering/kvcr/manager.py', 'L1-L34')}
                  kind="code"
                >
                  kvcr/manager.py L1-L34
                </Cite>
                ; out-of-tree tiers load through <code>module_path</code>{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L332-L350')}>
                  Usage Guide L332-L350
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The commands, from one flag for a CPU tier to a tiered stack with back-pressure and per-request limits"
          >
            Turning it on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One flag enables the CPU tier. <code>--kv-offloading-size</code> takes GiB, summed
            across tensor-parallel ranks{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L256-L265')} kind="code">
              config/cache.py L256-L265
            </Cite>
            , and vLLM turns it into a KV transfer config for you: <code>OffloadingConnector</code>{' '}
            with <code>cpu_bytes_to_use</code> set to the size times 2<sup>30</sup>, and{' '}
            <code>kv_role</code> set to <code>kv_both</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1124-L1158')} kind="code">
              config/vllm.py L1124-L1158
            </Cite>
            . With <code>--kv-offloading-backend lmcache</code> the same flag must still be present
            to switch offloading on, but its value is not passed along: the LMCache server owns the
            capacity. Setting <code>VLLM_USE_SIMPLE_KV_OFFLOAD=1</code> swaps in{' '}
            <code>SimpleCPUOffloadConnector</code>, an alternative native offloader with its own
            CPU and disk backends; the default is <code>0</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L2184-L2185')} kind="code">
              envs.py L2184-L2185
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl(
                'vllm/distributed/kv_transfer/kv_connector/v1/simple_cpu_offload_connector.py',
                'L55-L111',
              )}
              kind="code"
            >
              simple_cpu_offload_connector.py L55-L111
            </Cite>
            .
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# CPU tier (the native backend is the default)
vllm serve <model> --kv-offloading-size <GiB>

# LMCache backend: a client of a running lmcache server (tcp://localhost:5555 by default)
vllm serve <model> --kv-offloading-size <GiB> --kv-offloading-backend lmcache`}</pre>
          </Box>
          <Box variant="p">
            Secondary tiers need the long form. Set <code>spec_name</code> to{' '}
            <code>TieringOffloadingSpec</code> and list the tiers in the order they should be
            consulted{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L72-L96')}>
              Usage Guide L72-L96
            </Cite>
            . This example adds a filesystem tier with back-pressure:
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve <model> --kv-transfer-config '{
  "kv_connector": "OffloadingConnector",
  "kv_role": "kv_both",
  "kv_connector_extra_config": {
    "spec_name": "TieringOffloadingSpec",
    "cpu_bytes_to_use": <bytes, total across workers>,
    "secondary_tiers": [
      {
        "type": "fs",
        "root_dir": "/mnt/kv_cache",
        "backpressure": { "backpressure_cls": "EMABackpressureDetector" }
      }
    ]
  }
}'`}</pre>
          </Box>
          <Box variant="p">
            <strong>Back-pressure keeps a slow tier from backing up the CPU tier.</strong> Put a{' '}
            <code>backpressure</code> object on a tier, or at the top level of{' '}
            <code>kv_connector_extra_config</code> as the default for every tier, and name the
            detector. <code>EMABackpressureDetector</code> tracks an EMA (exponential moving
            average) of store latency per MiB and signals pressure above a high watermark; the
            default <code>ThrottledDropPolicy</code> then drops stores to that tier in proportion
            to the overshoot, and <code>&quot;policy_cls&quot;: &quot;DropStorePolicy&quot;</code>{' '}
            drops all of them until pressure clears. <code>obj</code> tiers, and any tier marked{' '}
            <code>&quot;locality&quot;: &quot;REMOTE&quot;</code>, get network watermarks by
            default; other tiers get local-storage ones{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/kv_offload/tiering/backpressure.py', 'L55-L117')}
              kind="code"
            >
              backpressure.py L55-L117
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/kv_offload/tiering/backpressure.py', 'L173-L245')}
              kind="code"
            >
              backpressure.py L173-L245
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/kv_offload/tiering/spec.py', 'L290-L314')}
              kind="code"
            >
              tiering/spec.py L290-L314
            </Cite>
            . The usage guide does not document back-pressure at v0.31.0, and a{' '}
            <code>backpressure</code> object without <code>backpressure_cls</code> is rejected{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/v1/kv_offload/tiering/factory.py', 'L73-L95')}
              kind="code"
            >
              tiering/factory.py L73-L95
            </Cite>
            , so the shape above is read from the code.
          </Box>
          <Box variant="p">
            <strong>Per-request controls</strong> ride in the request&apos;s{' '}
            <code>kv_transfer_params</code>. <code>max_offload_tokens</code> stores only the first
            N tokens, which caches a shared system prompt and skips the per-user tail (
            <code>0</code> disables storing). <code>max_load_tokens</code> caps how many tokens
            load from the tiers (<code>0</code> disables loading for that request); both caps are
            marked experimental. <code>kv_load_tiers</code> picks which secondary tiers to query;
            the CPU tier is always included{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L25-L52')}>
              Usage Guide L25-L52
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L360-L380')}>
              Usage Guide L360-L380
            </Cite>
            .
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`{
  "model": "<model>",
  "prompt": "...",
  "kv_transfer_params": { "max_offload_tokens": 1024 }
}`}</pre>
          </Box>
          <Box variant="small" color="text-body-secondary">
            Full reference:{' '}
            <Cite tier={1} href={vllmDocsUrl('features/kv_offloading_usage/')}>
              vLLM docs: KV Offloading Usage Guide
            </Cite>
            . The <code>OffloadingConnector</code> supports CUDA, ROCm and XPU only{' '}
            <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L5-L6')}>
              Usage Guide L5-L6
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick LMCache when you want a cache server that outlives engines, a wider set of storage backends, or reuse beyond the prefix"
          >
            LMCache: the external backend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            LMCache is a &quot;KV cache management layer for LLM inference&quot;{' '}
            <Cite tier={1} href={`${LMCACHE_README}#L53`}>
              LMCache README v0.5.6 L53
            </Cite>
            . It reaches vLLM through two registered connectors{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/factory.py', 'L165-L175')}
              kind="code"
            >
              kv_connector/factory.py L165-L175
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">LMCacheMPConnector</Box>
              <Box variant="p">
                What <code>--kv-offloading-backend lmcache</code> selects. vLLM talks to a
                standalone <code>lmcache server</code> that holds KV for one or more vLLM instances{' '}
                <Cite tier={1} href={vllmUrl('docs/features/disagg_prefill.md', 'L23')}>
                  disagg_prefill.md L23
                </Cite>
                , dialling <code>tcp://localhost:5555</code> unless <code>lmcache.mp.host</code>{' '}
                and <code>lmcache.mp.port</code> are set in <code>kv_connector_extra_config</code>{' '}
                <Cite
                  tier={1}
                  href={vllmUrl(
                    'vllm/distributed/kv_transfer/kv_connector/v1/lmcache_mp_connector.py',
                    'L481-L486',
                  )}
                  kind="code"
                >
                  lmcache_mp_connector.py L481-L486
                </Cite>
                . The server runs as its own process, so its cache survives an engine crash{' '}
                <Cite tier={1} href={`${LMCACHE_README}#L67`}>
                  LMCache README v0.5.6 L67
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">LMCacheConnectorV1</Box>
              <Box variant="p">
                LMCache inside the engine process, selected by name in{' '}
                <code>--kv-transfer-config</code>. It loads the adapter from the installed{' '}
                <code>lmcache</code> package; <code>&quot;use_native&quot;: true</code> uses the copy
                kept in the vLLM tree instead{' '}
                <Cite
                  tier={1}
                  href={vllmUrl(
                    'vllm/distributed/kv_transfer/kv_connector/v1/lmcache_connector.py',
                    'L88-L107',
                  )}
                  kind="code"
                >
                  lmcache_connector.py L88-L107
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Next to the native tiers, LMCache adds storage backends (CPU RAM, local disk,
            Redis/Valkey, Mooncake, InfiniStore, S3-compatible object storage, NIXL and GDS
            (GPUDirect Storage){' '}
            <Cite tier={1} href={`${LMCACHE_README}#L73`}>
              LMCache README v0.5.6 L73
            </Cite>
            ) and non-prefix reuse: CacheBlend reuses cached KV at any position in the prompt and
            recomputes some tokens to recover quality{' '}
            <Cite tier={1} href={`${LMCACHE_README}#L75`}>
              LMCache README v0.5.6 L75
            </Cite>
            . Sharing across instances is something the native <code>fs</code>, <code>obj</code>{' '}
            and <code>p2p</code> tiers also do, so it alone is no reason to add LMCache.{' '}
            <code>MultiConnector</code> runs an ordered list of connectors on one engine, for
            example a NIXL transfer path next to a storage connector{' '}
            <Cite tier={1} href={vllmUrl('docs/features/disagg_prefill.md', 'L32-L35')}>
              disagg_prefill.md L32-L35
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Pin the pair together.</strong> vLLM declares <code>lmcache &gt;= 0.3.9</code>{' '}
            <Cite tier={1} href={vllmUrl('requirements/kv_connectors.txt', 'L1')} kind="code">
              requirements/kv_connectors.txt L1
            </Cite>
            , and its CUDA 12 requirements pin <code>lmcache == 0.4.4</code> because LMCache 0.5.x
            uses CUDA 13 dependencies{' '}
            <Cite tier={1} href={vllmUrl('requirements/kv_connectors_cu12.txt', 'L1-L2')} kind="code">
              requirements/kv_connectors_cu12.txt L1-L2
            </Cite>
            . LMCache&apos;s latest release is v0.5.6, published 2026-10-14{' '}
            <Cite tier={1} href="https://github.com/LMCache/LMCache/releases/tag/v0.5.6">
              LMCache release v0.5.6
            </Cite>
            . Check the pairing before upgrading either side.
          </Box>
          <Alert type="warning" header="LMCache's performance claims are the project's own">
            The LMCache README says it reduces TTFT (time to first token) and improves throughput,
            especially for long-context agentic, multi-turn and RAG (retrieval-augmented
            generation) workloads{' '}
            <Cite tier={2} href={`${LMCACHE_README}#L53`}>
              LMCache README v0.5.6 L53 (project claim)
            </Cite>
            . It publishes no figure there, this dive has not benchmarked it, and the result
            depends on your workload and configuration.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Only for DeepSeek Sparse Attention models: KV lives in a host pool, and the GPU keeps a hot buffer of the rows decode reads"
          >
            HiSparse: a host tier for sparse-MLA decode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HiSparse is a separate host tier for one model family: DSA (DeepSeek Sparse Attention)
            models, whose MLA (Multi-head Latent Attention) layers select a top-k subset of tokens
            per layer{' '}
            <Cite tier={1} href={vllmUrl('docs/features/index_cache.md', 'L7')}>
              index_cache.md L7
            </Cite>
            . <code>HiSparseConnector</code> keeps KV rows in a pinned host
            pool sized by <code>host_pool_gib</code> (per data-parallel replica), and the GPU holds
            a per-request hot buffer that defaults to one top-k per decode query plus one top-k of
            slack{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/attention.py', 'L18-L33')} kind="code">
              config/attention.py L18-L33
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/hisparse/runtime.py', 'L116-L124')} kind="code">
              hisparse/runtime.py L116-L124
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('docs/design/hisparse.md', 'L28-L33')}>
              hisparse.md L28-L33
            </Cite>
            . Configuring the connector turns it on. It requires CUDA, Model Runner V2, a model
            config with <code>index_topk</code> and the default{' '}
            <code>--scheduler-reserve-full-isl</code>, and rejects pipeline and decode context
            parallelism{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1813-L1842')} kind="code">
              config/vllm.py L1813-L1842
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L702-L708')} kind="code">
              config/vllm.py L702-L708
            </Cite>
            . Its design document is marked experimental{' '}
            <Cite tier={1} href={vllmDocsUrl('design/hisparse/')}>
              vLLM docs: HiSparse
            </Cite>
            .
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve <dsa-model> --kv-transfer-config '{
  "kv_connector": "HiSparseConnector",
  "kv_role": "kv_both",
  "kv_connector_extra_config": { "host_pool_gib": <GiB per data-parallel replica> }
}'`}</pre>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The inequality that decides whether offloading pays, the workloads that pass it, and the costs that move to host memory, disk and network"
          >
            When offloading pays, and what it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The whole strategy rests on one inequality: <strong>loading a block back must cost
            less than recomputing it</strong>. That holds when prefixes are long (recompute is
            expensive), reuse is frequent (the stored copy actually gets hit), and the tier is fast
            enough that the load beats a forward pass. It fails when prefixes are short, hit rates
            are low, or the store is so slow that loading takes longer than recomputing.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'pattern', header: 'Use case', cell: (r) => <strong>{r.pattern}</strong>, minWidth: 150 },
              { id: 'reuse', header: 'What gets reused', cell: (r) => r.reuse, minWidth: 220 },
              { id: 'tier', header: 'Where to keep it', cell: (r) => r.tier, minWidth: 280 },
            ]}
            items={useCaseRows}
          />
          <ExpandableSection headerText="Checklist: when offloading helps and when it hurts">
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="h3">Offloading helps when</Box>
                <ul>
                  <li>Prefixes are long and recomputing them is the bottleneck</li>
                  <li>The same prefix is hit many times</li>
                  <li>Reuse spans turns, sessions, replicas or restarts</li>
                  <li>HBM pressure evicts warm prefixes early</li>
                </ul>
              </div>
              <div>
                <Box variant="h3">Offloading hurts when</Box>
                <ul>
                  <li>Prefixes are short, so recompute is cheaper than a load</li>
                  <li>Hit rate is low: you pay to store KV that is never read back</li>
                  <li>The store is slow or congested, so a load takes longer than a recompute</li>
                  <li>
                    Back-pressure drops stores to a slow tier: the GPU path stays fast and that
                    tier&apos;s hit rate falls
                  </li>
                  <li>Stored KV comes from different weights or quantization (a correctness hazard)</li>
                </ul>
              </div>
            </ColumnLayout>
          </ExpandableSection>
          <ExpandableSection headerText="Load failures, consistency, capacity and routing">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Load failures.</strong> The default <code>kv_load_failure_policy</code> is{' '}
                <code>fail</code>, which ends the request with an error. Add{' '}
                <code>&quot;kv_load_failure_policy&quot;: &quot;recompute&quot;</code> to{' '}
                <code>--kv-transfer-config</code> to reschedule the request and recompute the
                failed blocks locally{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L103-L106')} kind="code">
                  config/kv_transfer.py L103-L106
                </Cite>
                . The break-even between loading and recomputing moves with prefix length, tier
                bandwidth and how busy the GPU is.
              </Box>
              <Box variant="p">
                <strong>Consistency.</strong> KV bytes are valid only for the exact weights,
                quantization and layout that produced them, and a shared tier lets one
                replica&apos;s stale entry reach another. The <code>fs</code> and <code>obj</code>{' '}
                tiers key their directory by a SHA-256 digest of the model name, dtype, block
                geometry, parallel layout and KV cache groups{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/file_mapper.py', 'L100-L144')} kind="code">
                  file_mapper.py L100-L144
                </Cite>
                . That field list has no weight revision (our reading of the code, not tested), so
                when you update weights under the same model name, point the tier at a new{' '}
                <code>root_dir</code> or bucket <code>prefix</code>.
              </Box>
              <Box variant="p">
                <strong>Capacity moves down a tier.</strong> Offloading trades HBM pressure
                for host RAM, disk or network pressure, so leave host headroom beyond the CPU tier{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L354')}>
                  Usage Guide L354
                </Cite>
                . The CPU tier evicts on its own (<code>lru</code>, <code>arc</code> or a custom{' '}
                <code>CachePolicy</code>{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L115-L143')}>
                  Usage Guide L115-L143
                </Cite>
                ); the <code>fs</code> and <code>obj</code> tiers have no eviction setting, so disk
                and bucket space are yours to manage.
              </Box>
              <Box variant="p">
                <strong>Cross-replica reuse needs cache-aware routing.</strong> A shared tier pays
                off only when requests reach a replica or store that holds their prefix. On
                vLLM&apos;s side, with KV cache events enabled through{' '}
                <code>--kv-events-config</code>, the <code>fs</code> and <code>obj</code> tiers
                publish <code>BlockStored</code> events for the blocks they store once a tier sets{' '}
                <code>&quot;enable_kv_events&quot;: true</code>, and{' '}
                <code>self_describing_kv_events</code> gives external indexes the block metadata they
                need{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L112')}>
                  Usage Guide L112
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L149')}>
                  Usage Guide L149
                </Cite>
                . The <code>p2p</code> tier leaves the choice of peer to the router{' '}
                <Cite tier={1} href={vllmUrl(OFFLOAD_DOCS, 'L269')}>
                  Usage Guide L269
                </Cite>
                . On the router side, Dynamo&apos;s KV-aware router reads vLLM&apos;s KV events
                over ZeroMQ, and its vLLM worker publishes them only when you pass a{' '}
                <code>--kv-events-config</code> with <code>enable_kv_cache_events</code> true; it
                creates none by default{' '}
                <Cite
                  tier={1}
                  href="https://github.com/ai-dynamo/dynamo/blob/v1.5.1/components/src/dynamo/vllm/args.py#L465-L484"
                  kind="code"
                >
                  Dynamo v1.5.1 vllm/args.py L465-L484
                </Cite>
                . Production-stack&apos;s <code>kvaware</code> routing asks the LMCache
                controller where the longest cached prefix lives{' '}
                <Cite
                  tier={1}
                  href="https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/routers/routing_logic.py#L413-L415"
                  kind="code"
                >
                  production-stack 0.1.13 routing_logic.py L413-L415
                </Cite>
                . Disaggregated serving (section 10) is the case where a prefill tier fills the
                cache that a decode tier reads.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The first tier to enable, the metrics that tell you whether it pays, and when to add the next one"
          >
            Start with the CPU tier, then measure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. Size the CPU tier above the GPU KV cache.</strong> The startup log prints{' '}
            <code>Available KV cache memory: ... GiB</code> for each GPU{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu_worker.py', 'L692-L695')} kind="code">
              gpu_worker.py L692-L695
            </Cite>
            . Multiply by the GPU workers of one engine and set <code>--kv-offloading-size</code>{' '}
            above that total, because a CPU tier no larger than the GPU KV cache adds no hit rate.
            On CUDA, give the container a <code>/dev/shm</code> at least that large, and leave host
            RAM for everything else.
          </Box>
          <Box variant="p">
            <strong>2. Measure what the tier serves.</strong>{' '}
            <code>vllm:external_prefix_cache_hits</code> over{' '}
            <code>vllm:external_prefix_cache_queries</code> is the share of queried tokens the
            connector supplied, next to <code>vllm:prefix_cache_hits</code> over{' '}
            <code>vllm:prefix_cache_queries</code> for the GPU; the stats log prints the same
            figure as &quot;External prefix cache hit rate&quot;{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L622-L645')} kind="code">
              metrics/loggers.py L622-L645
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L312-L315')} kind="code">
              metrics/loggers.py L312-L315
            </Cite>
            . Judge it against TTFT: a rising external hit rate should pull TTFT down on repeated
            prefixes.
          </Box>
          <Box variant="p">
            <strong>3. Watch transfer health.</strong> <code>vllm:kv_offload_store_bytes</code> and{' '}
            <code>vllm:kv_offload_store_time</code>, with the matching <code>load</code> pair, give
            effective store and load bandwidth{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/offloading/metrics.py', 'L22-L37')}
              kind="code"
            >
              offloading/metrics.py L22-L37
            </Cite>
            . <code>vllm:kv_offload_cpu_cache_usage_perc</code> is the share of the CPU tier pinned
            by in-flight transfers, not how full it is; sustained high values mean stores or
            promotions may be dropped{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/cpu/spec.py', 'L52-L59')} kind="code">
              cpu/spec.py L52-L59
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>4. Add a secondary tier when the CPU tier stops being enough:</strong> the
            reusable working set outgrows host RAM, or reuse has to cross instances or restarts.
            Then track <code>vllm:kv_offload_tiering_chunk_hits</code> over{' '}
            <code>vllm:kv_offload_tiering_chunk_queries</code> per <code>tier</code> label, and{' '}
            <code>vllm:kv_offload_tiering_backpressure_stores_dropped</code>: a climbing drop count
            says that tier cannot keep up with your store rate{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/base.py', 'L38-L63')} kind="code">
              tiering/base.py L38-L63
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/spec.py', 'L192-L201')} kind="code">
              tiering/spec.py L192-L201
            </Cite>
            . Start with <code>fs</code> on local disk for capacity, move it to a shared directory
            or switch to <code>obj</code> when several replicas should share one cache, and keep
            the CPU tier larger than the GPU KV cache throughout.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
