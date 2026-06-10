import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface TierRow {
  tier: string;
  medium: string;
  latency: string;
  scope: string;
  whoOwns: string;
}

const tierRows: TierRow[] = [
  {
    tier: 'HBM (GPU)',
    medium: 'On-device block pool',
    latency: 'Zero (already resident)',
    scope: 'One GPU / one TP group',
    whoOwns: 'Block manager (section 5)',
  },
  {
    tier: 'CPU RAM (host)',
    medium: 'Pinned host memory',
    latency: 'PCIe / NVLink-C2C copy (microseconds to low ms)',
    scope: 'One node',
    whoOwns: 'OffloadingConnector / LMCache',
  },
  {
    tier: 'Local disk / NVMe',
    medium: 'mmap or block files',
    latency: 'Single-digit to tens of ms',
    scope: 'One node',
    whoOwns: 'LMCache local backend',
  },
  {
    tier: 'Remote store',
    medium: 'Redis / Valkey / S3 / Mooncake',
    latency: 'Network round-trip (ms+)',
    scope: 'Whole fleet / cross-replica',
    whoOwns: 'LMCache remote backend',
  },
];

interface UseCaseRow {
  pattern: string;
  reuse: string;
  tier: string;
}

const useCaseRows: UseCaseRow[] = [
  {
    pattern: 'Long-context reuse',
    reuse: 'Same large document or codebase prompted repeatedly with different questions',
    tier: 'CPU / disk, because the prefix is too big to keep pinned in HBM',
  },
  {
    pattern: 'Multi-turn chat',
    reuse: 'Conversation history re-sent every turn; idle between turns',
    tier: 'CPU RAM: evict on idle, reload on the next turn instead of recomputing',
  },
  {
    pattern: 'RAG',
    reuse: 'Hot retrieved chunks shared across many users and queries',
    tier: 'Remote store: chunk KV computed once, read by any replica',
  },
  {
    pattern: 'Cross-replica sharing',
    reuse: 'A prefix warmed on replica A served by replica B after load-balancer reroute',
    tier: 'Remote store. KV is fleet-global, not pinned to the engine that built it',
  },
];

function KVMemoryHierarchyDiagram() {
  return (
    <svg
      viewBox="0 0 780 360"
      role="img"
      aria-labelledby="kv-hier-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="kv-hier-title">
        The KV-cache memory hierarchy: HBM to CPU RAM to disk to remote store, with the KV
        connector mediating every tier below HBM
      </title>
      <style>
        {`
          .tier { stroke: #0972d3; stroke-width: 1.5; }
          .hbm { fill: #0972d3; }
          .ram { fill: #2ea597; }
          .disk { fill: #8b6c00; }
          .remote { fill: #6f4cc4; }
          .conn { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .lbl { fill: #414d5c; font: 600 12px sans-serif; }
          .sub { fill: #5f6b7a; font: 11px sans-serif; }
          .connt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}
      </style>

      {/* axis labels */}
      <text className="lbl" x={20} y={28}>Scarce + fast</text>
      <text className="lbl" x={20} y={348}>Abundant + slow</text>

      {/* HBM tier */}
      <rect className="tier hbm" x={150} y={20} width={300} height={56} rx={6} />
      <text className="tt" x={300} y={44}>HBM (GPU)</text>
      <text className="ts" x={300} y={63}>resident KV blocks, the hot working set</text>

      {/* CPU RAM tier */}
      <rect className="tier ram" x={120} y={96} width={360} height={56} rx={6} />
      <text className="tt" x={300} y={120}>CPU RAM (host, pinned)</text>
      <text className="ts" x={300} y={139}>evicted blocks staged off-GPU, same node</text>

      {/* Disk tier */}
      <rect className="tier disk" x={90} y={172} width={420} height={56} rx={6} />
      <text className="tt" x={300} y={196}>Local disk / NVMe</text>
      <text className="ts" x={300} y={215}>spillover for prefixes too large for RAM</text>

      {/* Remote tier */}
      <rect className="tier remote" x={60} y={248} width={480} height={56} rx={6} />
      <text className="tt" x={300} y={272}>Remote store (Redis / Valkey / S3 / Mooncake)</text>
      <text className="ts" x={300} y={291}>fleet-global, cross-replica KV reuse</text>

      {/* KV connector spine on the right */}
      <rect className="conn" x={576} y={96} width={180} height={208} rx={8} />
      <text className="connt" x={666} y={170}>KV connector</text>
      <text className="connt" x={666} y={190}>framework</text>
      <text className="ts" x={666} y={214} fill="#5f6b7a">OffloadingConnector</text>
      <text className="ts" x={666} y={230} fill="#5f6b7a">LMCacheConnectorV1</text>
      <text className="ts" x={666} y={246} fill="#5f6b7a">MultiConnector</text>

      {/* connector mediates every tier below HBM */}
      <path className="arr" d="M480,124 L576,150" />
      <path className="arr" d="M510,200 L576,190" />
      <path className="arr" d="M540,276 L576,250" />

      {/* vertical promote/evict arrows between tiers */}
      <text className="sub" x={462} y={92} textAnchor="end">evict ↓ / load ↑</text>
    </svg>
  );
}

export function KVOffloadingLMCache() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="When KV cache outgrows HBM, you either recompute it or move it down a memory hierarchy. Offloading and LMCache build that hierarchy"
          >
            7. KV-Cache Offloading &amp; LMCache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> GPU HBM (High-Bandwidth Memory) is the scarce
            resource in LLM serving, and the KV (key-value) cache is what consumes it. Section
            5 showed how PagedAttention packs KV into fixed blocks; section 6 showed how
            automatic prefix caching reuses those blocks across requests. But the block pool
            is finite. When it fills, the scheduler must <em>evict</em> blocks, and an evicted
            prefix is gone. The next request that needs it pays the full prefill cost again:
            recompute every token&apos;s attention from scratch. For a 50K-token document
            re-asked ten times, that is ten full prefills of the same KV.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> stop treating HBM as the only place KV can live.
            Extend the cache into a <strong>memory hierarchy</strong> (CPU RAM, local disk,
            then a remote/distributed store) so an evicted prefix is <em>moved down</em>
            rather than discarded. On a later hit, vLLM loads it back instead of recomputing.
            The bet is simple: a copy down the hierarchy and back is cheaper than a recompute.
            vLLM realizes this through its <strong>KV connector framework</strong>; the most
            prominent external layer that plugs into it is <strong>LMCache</strong>.
          </Box>
          <Alert type="info">
            This section is the conceptual companion to the connector internals. The actual
            classes, call paths, and config fields live in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong> (the
            connector zoo, <code>KVConnectorBase_V1</code>, and <code>KVTransferConfig</code>).
            Cross-instance KV transfer for prefill/decode splitting is covered in{' '}
            <strong>section 10 (Disaggregated Prefill / Decode)</strong>. This section stays on
            the <em>why</em> and the <em>tradeoffs</em>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HBM is the top tier; everything below it is offload territory the connector mediates"
          >
            The KV memory hierarchy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Think of KV cache the way you think of a CPU cache hierarchy: a small, fast top
            tier backed by progressively larger and slower tiers. HBM is L1: fast and tiny.
            Below it, each tier trades latency for capacity and reach. The KV connector sits
            in the middle: it is the component that decides what gets staged down on eviction
            and pulled back up on a hit.
          </Box>
          <KVMemoryHierarchyDiagram />
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'tier', header: 'Tier', cell: (r) => <strong>{r.tier}</strong>, minWidth: 140 },
              { id: 'medium', header: 'Medium', cell: (r) => r.medium, minWidth: 160 },
              { id: 'latency', header: 'Access cost', cell: (r) => r.latency, minWidth: 200 },
              { id: 'scope', header: 'Reuse scope', cell: (r) => r.scope, minWidth: 150 },
              { id: 'whoOwns', header: 'Managed by', cell: (r) => r.whoOwns, minWidth: 180 },
            ]}
            items={tierRows}
          />
          <Box variant="small">
            Latency figures are qualitative orders of magnitude, not benchmarks. Actual
            numbers depend on hardware, block size, and network. The point is the ordering,
            not the constants.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One framework, several connectors: offloading is one connector among many, not a bolt-on"
          >
            vLLM&apos;s KV connector framework
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM does not hard-code where KV lives. It exposes a pluggable{' '}
            <strong>KV connector framework</strong>: a connector is selected by name through{' '}
            <code>--kv-transfer-config</code> and built per role (scheduler-side vs
            worker-side). The same framework powers three distinct jobs: CPU/host offload,
            external tiered caching (LMCache), and cross-instance prefill/decode transfer
            (NIXL). Offloading is not a special subsystem; it is a connector choice. The vLLM
            disaggregated-prefilling docs describe the host-offload option as one that will{' '}
            <em>&quot;enable offloading of KV data to CPU memory, customizing the CPU block
            size&quot;</em>{' '}
            <Link
              external
              href="https://docs.vllm.ai/en/stable/features/disagg_prefill/"
            >
              [Tier-1: vLLM disaggregated-prefilling docs, accessed 2026-06-07]
            </Link>
            .
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">In-tree CPU/host offload</Box>
              <Box variant="p">
                The <code>OffloadingConnector</code> stages evicted KV blocks into pinned host
                RAM and pulls them back on a hit, a single-node, zero-extra-dependency way to
                widen the cache beyond HBM. It is the simplest rung below HBM and ships with
                vLLM itself.
              </Box>
            </div>
            <div>
              <Box variant="h3">External tiered cache</Box>
              <Box variant="p">
                <code>LMCacheConnectorV1</code> delegates to LMCache, which manages the
                CPU/disk/remote tiers and cross-instance reuse. This is the rung that turns a
                per-engine cache into a fleet-global one.
              </Box>
            </div>
            <div>
              <Box variant="h3">Cross-instance transfer</Box>
              <Box variant="p">
                <code>NixlConnector</code> moves KV between separate prefill and decode
                engines over RDMA. That is disaggregation, not offload, and it is covered in
                section 10 and in the codebase tab. The framework is shared; the intent differs.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            <code>MultiConnector</code> composes several of these at once: for example an LMCache
            tier <em>and</em> a NIXL transfer path on the same engine. The mechanics of how
            roles, leases, and the factory wire this together are documented in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>; this
            section deliberately does not duplicate that table.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The most prominent external KV layer: multi-backend, cross-instance, integrated upstream via a connector"
          >
            LMCache: the external KV layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            LMCache is a dedicated KV-cache management system that, in its own words,{' '}
            <em>&quot;lets LLMs prefill each text only once&quot;</em> by storing and
            retrieving the KV of reusable text segments{' '}
            <Link external href="https://docs.lmcache.ai/">
              [Tier-1: LMCache project docs, accessed 2026-06-07]
            </Link>
            . Where vLLM&apos;s built-in prefix cache is per-engine and HBM-bound, LMCache adds
            two capabilities that the in-tree offload connector does not: a broad set of
            storage backends, and KV reuse <em>across</em> engine instances, so a prefix warmed
            on one replica can be read by another.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Backends (per LMCache docs)</Box>
              <Box variant="p">
                CPU RAM and local disk for the node-local tiers; Redis, Valkey, and the RESP
                protocol for distributed in-memory; AWS S3 for object storage; plus specialized
                paths (Mooncake, NIXL, 3FS, GDS, and others). One connector, many storage
                targets, and the deployment picks the tier mix.
              </Box>
            </div>
            <div>
              <Box variant="h3">Upstream integration</Box>
              <Box variant="p">
                LMCache plugs into vLLM through the connector framework as{' '}
                <code>LMCacheConnectorV1</code>, with no engine fork required. The integration is
                <em> through</em> the same <code>--kv-transfer-config</code> surface every
                other connector uses, which is why it composes under{' '}
                <code>MultiConnector</code>.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Performance claims are LMCache's own: project-claimed, not independently verified here">
            The LMCache documentation states that combining LMCache with vLLM{' '}
            <em>
              &quot;achieves 3-10x delay savings and GPU cycle reduction in many LLM use cases,
              including multi-round QA and RAG&quot;
            </em>
            , and that it reduces time-to-first-token (TTFT) while saving GPU cycles and memory{' '}
            <Link external href="https://docs.lmcache.ai/">
              [Tier-1 source, Tier-4 claim: LMCache project docs, accessed 2026-06-07]
            </Link>
            . These figures come from the LMCache project&apos;s own materials. They are
            workload- and configuration-dependent and have not been independently benchmarked
            in this deep dive. Treat them as best-case, vendor-reported numbers, not a
            guarantee for your traffic.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Offload pays off when reuse is real and the prefix is expensive, and hurts when neither holds"
          >
            When offloading helps, and when it hurts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The whole strategy rests on one inequality: <strong>transfer-back latency must be
            less than recompute cost</strong>. That holds when prefixes are long (recompute is
            expensive), reuse is frequent (the staged copy actually gets hit), and the tier you
            stage to is fast enough that the round-trip beats a forward pass. It fails when
            prefixes are short, hit rates are low, or the store is so slow that loading is
            slower than just recomputing.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'pattern', header: 'Use case', cell: (r) => <strong>{r.pattern}</strong>, minWidth: 170 },
              { id: 'reuse', header: 'What gets reused', cell: (r) => r.reuse, minWidth: 240 },
              { id: 'tier', header: 'Natural tier', cell: (r) => r.tier, minWidth: 240 },
            ]}
            items={useCaseRows}
          />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Offload helps when…</Box>
              <ul>
                <li>Prefixes are long and recomputing them is the bottleneck</li>
                <li>The same prefix is hit many times (high cache-hit rate)</li>
                <li>Reuse spans turns, sessions, or replicas, beyond a single request</li>
                <li>HBM pressure is forcing premature eviction of warm prefixes</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Offload hurts when…</Box>
              <ul>
                <li>Prefixes are short, so recompute is cheaper than a round-trip</li>
                <li>Hit rate is low: you pay to stage KV that is never read back</li>
                <li>The remote store is slow or congested, so load &gt; recompute</li>
                <li>Stored KV is stale or model/quantization changed (a consistency hazard)</li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Operational tradeoffs (deep dive)">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Transfer latency vs recompute.</strong> Every offloaded block is a bet
            that loading it later beats a forward pass. The break-even point moves with prefix
            length, the tier&apos;s bandwidth, and how busy the GPU is. A loaded GPU may
            actually prefer recompute (it has spare FLOPs) where an idle one prefers load.
            This is why <code>kv_load_failure_policy</code> exists with a{' '}
            <code>recompute</code> option (see the codebase tab): the safe fallback when a
            load fails is to compute the KV locally, not to error the request.
          </Box>
          <Box variant="p">
            <strong>Consistency.</strong> KV bytes are only valid for the exact model weights,
            quantization, and head layout that produced them. Reusing KV across a model
            version bump, a different quantization, or a mismatched tensor-parallel layout
            produces silently wrong output. A fleet-global cache makes this worse: a stale
            entry written by one replica can poison another. Cache keys must encode model
            identity along with the token prefix. This is a correctness requirement, not an
            optimization.
          </Box>
          <Box variant="p">
            <strong>Memory and capacity pressure moves, it does not vanish.</strong> Offload
            trades HBM pressure for host RAM, disk, or network pressure. Pinned host memory is
            itself a finite, contended resource; a too-aggressive CPU tier can starve the rest
            of the box. Each tier needs its own eviction policy, and the sum of tiers is what
            you are actually sizing.
          </Box>
          <Box variant="p">
            <strong>Cross-replica reuse needs cache-aware routing.</strong> A fleet-global KV
            store only pays off if requests that share a prefix are routed to where that prefix
            is warm, or to a store all replicas can read. Otherwise every replica recomputes
            independently and the remote tier is dead weight. This is the bridge to the
            ecosystem sections: routers (Production-Stack, llm-d, Dynamo) consume KV-cache
            events to route prefix-affine traffic, and disaggregated serving in{' '}
            <strong>section 10</strong> is the architecture where a dedicated prefill tier
            populates the cache that a decode tier reads.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Box variant="small">
        Sources. <strong>Tier-1 (vLLM official docs):</strong>{' '}
        <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
          NIXL connector usage
        </Link>
        ,{' '}
        <Link external href="https://docs.vllm.ai/en/stable/features/disagg_prefill/">
          disaggregated prefilling
        </Link>{' '}
        (both accessed 2026-06-07). <strong>Tier-1 source / project-claimed performance:</strong>{' '}
        <Link external href="https://docs.lmcache.ai/">
          LMCache documentation
        </Link>{' '}
        (accessed 2026-06-07). LMCache is the project authoring those numbers; its TTFT and
        throughput claims are reported by the project and are not independently verified here.
        Connector class internals: see <strong>Inside the Codebase &rarr; Distributed &amp; KV
        Transfer</strong> (vLLM repo pinned to commit <code>15652a6b</code>). vLLM&apos;s
        connector APIs are explicitly experimental and move roughly bi-weekly; field and class
        names may drift.
      </Box>
    </SpaceBetween>
  );
}
