import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, vllmUrl } from '../../components/Cite';

// Every source below was read on 2026-10-24 and is pinned in
// research/2026-10-kv-tiers/01..03 (row ids in the authoring log).
const MC = 'https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/';
const MC_EFA_DOC = `${MC}docs/source/design/transfer-engine/efa_transport.md`;
const LM = 'https://github.com/LMCache/LMCache/blob/v0.5.6/';
const LM_PR = 'https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/';
const VLO = 'https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/';
const VDMA = 'https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/';
const GLIDE_PR = 'https://github.com/valkey-io/valkey-glide/blob/7644df8b12ee71c77a219254c98d7cd69282f79c/';
const LLMD_FS = 'https://github.com/llm-d/llm-d-kv-cache/blob/v1.0.0/kv_connectors/llmd_fs_backend/';
const DY = 'https://github.com/ai-dynamo/dynamo/blob/v1.6.0/';
const NX = 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/';
const FSX = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/';
const S3_DOCS = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/';
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const EC2_CO = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html';
const LMCACHE_PR = 'https://github.com/LMCache/LMCache/pull/5556';
const GLIDE_PR_PAGE = 'https://github.com/valkey-io/valkey-glide/pull/7412';
const TSC_COMMENT = 'https://github.com/valkey-io/valkey/issues/4743#issuecomment-5766728140';
const STORAGE_BLOG =
  'https://aws.amazon.com/blogs/storage/accelerate-inference-with-kv-cache-tiering-on-aws/';
const ML_GDS_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/accelerate-llm-model-loading-and-increase-context-windows-with-gpudirect-on-amazon-fsx-for-lustre-and-turboquant/';

interface RemoteTierRow {
  tier: ReactNode;
  mover: ReactNode;
  lands: ReactNode;
  reach: ReactNode;
  throughput: ReactNode;
  latency: ReactNode;
  maturity: ReactNode;
}

const remoteTierRows: RemoteTierRow[] = [
  {
    tier: 'Mooncake Store: DRAM pooled across nodes',
    mover: (
      <>
        The client posts one-sided <code>fi_write</code> / <code>fi_read</code>{' '}
        <Cite tier={1} href={`${MC}mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L1146-L1158`} kind="code" accessed="2026-10-24">
          efa_context.cpp L1146-L1158
        </Cite>
      </>
    ),
    lands: (
      <>
        GPU memory with MooncakeStoreConnector; host memory through LMCache{' '}
        <Cite tier={1} href={`${LM}lmcache/v1/storage_backend/connector/mooncakestore_connector.py#L438-L460`} kind="code" accessed="2026-10-24">
          LMCache mooncakestore_connector.py L438-L460
        </Cite>
      </>
    ),
    reach: (
      <>
        <code>MooncakeStoreConnector</code>, with <code>&quot;protocol&quot;: &quot;efa&quot;</code>{' '}
        in the <code>MOONCAKE_CONFIG_PATH</code> file (default <code>rdma</code>){' '}
        <Cite tier={1} href={vllmUrl('vllm/distributed/mooncake_store.py', 'L21-L76')} kind="code" accessed="2026-10-24">
          mooncake_store.py L21-L76
        </Cite>
      </>
    ),
    throughput: (
      <>
        Instance limit 3,200 Gbps on p5en.48xlarge{' '}
        <Cite tier={1} href={EC2_AC} accessed="2026-10-24">
          EC2 accelerated computing specifications
        </Cite>
        ; project&apos;s Transfer Engine benchmark: up to 365.66 GB/s GPU-to-GPU write at 1 MB
        blocks{' '}
        <Cite tier={2} href={`${MC_EFA_DOC}#L186-L384`} accessed="2026-10-24">
          Mooncake EFA guide L186-L384 (project claim)
        </Cite>
      </>
    ),
    latency: 'No AWS figure located',
    maturity: (
      <>
        Released, v0.3.13.post1{' '}
        <Cite tier={1} href="https://github.com/kvcache-ai/Mooncake/releases/tag/v0.3.13.post1" accessed="2026-10-24">
          Mooncake release v0.3.13.post1
        </Cite>
        ; EFA only in <code>-efa</code> wheels{' '}
        <Cite tier={1} href={`${MC}scripts/build_wheel.sh#L264-L291`} kind="code" accessed="2026-10-24">
          build_wheel.sh L264-L291
        </Cite>
      </>
    ),
  },
  {
    tier: "Valkey large-object module: one node's DRAM, optionally NVMe",
    mover: (
      <>
        The server posts <code>fi_writemsg</code> / <code>fi_read</code> over{' '}
        <code>efa-direct</code>{' '}
        <Cite tier={1} href={`${VLO}src/transport/session.rs#L36-L91`} kind="code" accessed="2026-10-24">
          session.rs L36-L91
        </Cite>{' '}
        <Cite tier={1} href={`${VDMA}crates/dma-libfabric/src/connection.rs#L43-L99`} kind="code" accessed="2026-10-24">
          dma-libfabric connection.rs L43-L99
        </Cite>{' '}
        <Cite tier={1} href={`${VLO}src/transport/config.rs#L8-L19`} kind="code" accessed="2026-10-24">
          transport/config.rs L8-L19
        </Cite>
      </>
    ),
    lands: "Host memory (LMCache's L1)",
    reach: (
      <>
        <code>LMCacheMPConnector</code>, <code>valkey</code> L2 adapter,{' '}
        <code>&quot;transport&quot;: &quot;rdma&quot;</code>; open pull request{' '}
        <Cite tier={1} href={`${LM_PR}lmcache/v1/distributed/l2_adapters/valkey_l2_adapter.py#L80-L81`} kind="code" accessed="2026-10-24">
          valkey_l2_adapter.py L80-L81 at PR head
        </Cite>
      </>
    ),
    throughput: (
      <>
        Pull-request author&apos;s claim: 197.8 to 198.6 Gbit/s, 16 MiB loads into host memory
        with 4 to 16 workers, two c8gn.16xlarge (200 Gbit/s each){' '}
        <Cite tier={2} href={`${LMCACHE_PR}#issuecomment-6304983743`} accessed="2026-10-24">
          LMCache PR 5556 comment (project claim)
        </Cite>
      </>
    ),
    latency: 'No AWS figure located',
    maturity: (
      <>
        Pre-release: no tags{' '}
        <Cite tier={1} href="https://api.github.com/repos/valkey-io/valkey-large-object/tags" accessed="2026-10-24">
          GitHub API: tags
        </Cite>
        , crate 0.1.0{' '}
        <Cite tier={1} href={`${VLO}Cargo.toml#L1-L7`} kind="code" accessed="2026-10-24">
          Cargo.toml L1-L7
        </Cite>
        , API experimental until 1.0{' '}
        <Cite tier={2} href={TSC_COMMENT} accessed="2026-10-24">
          Valkey core team decision
        </Cite>
        , client pull requests open{' '}
        <Cite tier={2} href={LMCACHE_PR} accessed="2026-10-24">
          LMCache PR 5556
        </Cite>{' '}
        <Cite tier={2} href={GLIDE_PR_PAGE} accessed="2026-10-24">
          valkey-glide PR 7412
        </Cite>
      </>
    ),
  },
  {
    tier: 'Amazon FSx for Lustre: a shared parallel file system',
    mover: (
      <>
        The Lustre client over LNet (Lustre networking) on EFA or TCP{' '}
        <Cite tier={1} href={`${FSX}configure-efa-clients.html`} accessed="2026-10-24">
          FSx: Configuring EFA clients
        </Cite>
        ; cuFile on the GDS path{' '}
        <Cite tier={1} href={`${LM}lmcache/v1/storage_backend/gds_backend.py#L218-L236`} kind="code" accessed="2026-10-24">
          LMCache gds_backend.py L218-L236
        </Cite>
      </>
    ),
    lands: "Host memory with vLLM's fs tier; GPU memory through LMCache's GDS backend",
    reach: (
      <>
        <code>OffloadingConnector</code>, <code>TieringOffloadingSpec</code>, secondary tier{' '}
        <code>{'{"type": "fs", "root_dir": "<FSx mount>"}'}</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/factory.py', 'L150-L172')} kind="code" accessed="2026-10-24">
          tiering/factory.py L150-L172
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('docs/features/kv_offloading_usage.md', 'L72-L96')} accessed="2026-10-24">
          Usage Guide L72-L96
        </Cite>
      </>
    ),
    throughput: (
      <>
        Up to 100 Gbps over ENA (Elastic Network Adapter) and 5 Gbps to any one object storage
        server, 700 Gbps over EFA, 1,200 Gbps over EFA with GDS{' '}
        <Cite tier={1} href={`${FSX}performance.html`} accessed="2026-10-24">
          FSx: Performance
        </Cite>
      </>
    ),
    latency: (
      <>
        &quot;Consistent, sub-millisecond latencies for file operations&quot;{' '}
        <Cite tier={1} href={`${FSX}ssd-storage.html`} accessed="2026-10-24">
          FSx: SSD storage performance
        </Cite>
      </>
    ),
    maturity: (
      <>
        Generally available; EFA and GDS since November 27, 2024{' '}
        <Cite tier={1} href={`${FSX}doc-history.html`} accessed="2026-10-24">
          FSx: Document history
        </Cite>
      </>
    ),
  },
  {
    tier: 'Amazon S3, including S3 Express One Zone',
    mover: (
      <>
        An HTTP client: NIXL&apos;s OBJ plugin for vLLM&apos;s <code>obj</code> tier, the AWS CRT
        (Common Runtime) in LMCache{' '}
        <Cite tier={1} href={`${LM}lmcache/v1/storage_backend/connector/s3_connector.py#L10-L12`} kind="code" accessed="2026-10-24">
          s3_connector.py L10-L12
        </Cite>
      </>
    ),
    lands: 'Host memory',
    reach: (
      <>
        <code>{'{"type": "obj"}'}</code> secondary tier with <code>bucket</code> and{' '}
        <code>endpoint_override</code>{' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/obj/config.py', 'L8-L46')} kind="code" accessed="2026-10-24">
          tiering/obj/config.py L8-L46
        </Cite>
      </>
    ),
    throughput: (
      <>
        &quot;Up to 100 Gb/s on a single instance&quot; for data lake applications that fill the
        instance&apos;s network interface{' '}
        <Cite tier={1} href={`${S3_DOCS}optimizing-performance.html`} accessed="2026-10-24">
          S3: Optimizing performance
        </Cite>
      </>
    ),
    latency: (
      <>
        Express One Zone &quot;single-digit millisecond&quot;{' '}
        <Cite tier={1} href={`${S3_DOCS}directory-bucket-high-performance.html`} accessed="2026-10-24">
          S3: High performance workloads
        </Cite>
        ; Standard &quot;roughly 100-200 milliseconds&quot;{' '}
        <Cite tier={1} href={`${S3_DOCS}optimizing-performance.html`} accessed="2026-10-24">
          S3: Optimizing performance
        </Cite>
      </>
    ),
    maturity: 'Generally available',
  },
];

function AwsRemoteKvPathsDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 458"
        role="img"
        aria-labelledby="rkv-paths-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="rkv-paths-title">
          Two questions place each remote KV tier on AWS: who moves the bytes, and where they land.
          Mooncake Store through MooncakeStoreConnector, with the client posting one-sided EFA writes
          and reads, and FSx for Lustre read with cuFile (GPUDirect Storage) through LMCache&apos;s GDS
          backend, land KV blocks directly in GPU memory. vLLM&apos;s fs tier on FSx for Lustre, the Valkey
          large-object module, whose server posts the EFA transfers, and S3 over HTTP land them in
          host memory, from where vLLM&apos;s CPU tier or LMCache&apos;s L1 copies them to the GPU.
        </title>
        <style>
          {`
          .rkv-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .rkv-inst { fill: #f7f8f9; stroke: #879596; stroke-width: 1.2; }
          .rkv-hbm { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .rkv-host { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .rkv-efa { fill: #eef0f2; stroke: #414d5c; stroke-width: 1.5; }
          .rkv-tier { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .rkv-h { fill: #16191f; font: 600 13px sans-serif; }
          .rkv-hc { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .rkv-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .rkv-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .rkv-et { fill: #414d5c; font: 600 13px sans-serif; text-anchor: middle; }
          .rkv-lg { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          .rkv-la { fill: #8b6c00; font: 600 11px sans-serif; text-anchor: middle; }
          .rkv-ls { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .rkv-cl { fill: #8b6c00; font: 11px sans-serif; }
          .rkv-leg { fill: #16191f; font: 11px sans-serif; }
          .rkv-g { stroke: #037f0c; stroke-width: 2.5; fill: none; marker-end: url(#rkv-ahg); }
          .rkv-a { stroke: #8b6c00; stroke-width: 2.5; fill: none; marker-end: url(#rkv-aha); }
          .rkv-c { stroke: #8b6c00; stroke-width: 1.8; fill: none; marker-end: url(#rkv-aha); }
          .rkv-lgl { stroke: #037f0c; stroke-width: 2.5; }
          .rkv-lal { stroke: #8b6c00; stroke-width: 2.5; }
        `}
        </style>
        <defs>
          <marker id="rkv-ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#037f0c" />
          </marker>
          <marker id="rkv-aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect className="rkv-bg" x={0} y={0} width={880} height={458} rx={8} />

        <text className="rkv-h" x={16} y={26}>GPU instance running vLLM</text>
        <text className="rkv-hc" x={452} y={26}>Who moves the bytes</text>
        <text className="rkv-hc" x={734} y={26}>Remote tier</text>

        {/* Left: one GPU instance */}
        <rect className="rkv-inst" x={12} y={36} width={296} height={392} rx={8} />

        <rect className="rkv-hbm" x={28} y={48} width={200} height={128} rx={6} />
        <text className="rkv-t" x={128} y={112}>GPU HBM</text>
        <text className="rkv-s" x={128} y={130}>paged KV cache</text>

        <path className="rkv-c" d="M118,211 L118,180" />
        <text className="rkv-cl" x={128} y={198}>copy to GPU</text>

        <rect className="rkv-host" x={28} y={212} width={200} height={204} rx={6} />
        <text className="rkv-t" x={128} y={306}>Host DRAM</text>
        <text className="rkv-s" x={128} y={324}>vLLM CPU tier,</text>
        <text className="rkv-s" x={128} y={340}>or LMCache L1</text>

        <rect className="rkv-efa" x={244} y={48} width={52} height={304} rx={5} />
        <text className="rkv-et" x={270} y={124}>EFA</text>
        <text className="rkv-s" x={270} y={140}>NICs</text>

        {/* Right: the four remote tiers */}
        <rect className="rkv-tier" x={600} y={48} width={268} height={72} rx={6} />
        <text className="rkv-t" x={734} y={72}>Mooncake Store pool</text>
        <text className="rkv-s" x={734} y={90}>DRAM lent by client nodes</text>
        <text className="rkv-s" x={734} y={106}>a master tracks metadata only</text>

        <rect className="rkv-tier" x={600} y={144} width={268} height={100} rx={6} />
        <text className="rkv-t" x={734} y={178}>Amazon FSx for Lustre</text>
        <text className="rkv-s" x={734} y={196}>shared POSIX file system</text>
        <text className="rkv-s" x={734} y={212}>EFA (and with it GDS) set at creation</text>

        <rect className="rkv-tier" x={600} y={268} width={268} height={72} rx={6} />
        <text className="rkv-t" x={734} y={292}>Valkey large-object node on EC2</text>
        <text className="rkv-s" x={734} y={310}>DRAM, optional NVMe</text>
        <text className="rkv-s" x={734} y={326}>pre-release, self-managed</text>

        <rect className="rkv-tier" x={600} y={360} width={268} height={56} rx={6} />
        <text className="rkv-t" x={734} y={384}>Amazon S3</text>
        <text className="rkv-s" x={734} y={402}>Standard or Express One Zone</text>

        {/* Load paths: green lands in GPU memory, amber lands in host memory */}
        <path className="rkv-g" d="M598,84 L231,84" />
        <text className="rkv-lg" x={452} y={58}>MooncakeStoreConnector, protocol efa</text>
        <text className="rkv-ls" x={452} y={72}>client posts one-sided fi_write / fi_read</text>

        <path className="rkv-g" d="M598,164 L231,164" />
        <text className="rkv-lg" x={452} y={138}>cuFile (GDS) over LNet on EFA</text>
        <text className="rkv-ls" x={452} y={152}>LMCache GDS backend (in-process mode)</text>

        <path className="rkv-a" d="M598,224 L231,224" />
        <text className="rkv-la" x={452} y={198}>vLLM fs tier: POSIX from the CPU tier</text>
        <text className="rkv-ls" x={452} y={212}>Lustre client over LNet on EFA</text>

        <path className="rkv-a" d="M598,304 L231,304" />
        <text className="rkv-la" x={452} y={278}>server posts fi_writemsg / fi_read</text>
        <text className="rkv-ls" x={452} y={292}>efa-direct; LMCache client unreleased</text>

        <path className="rkv-a" d="M598,388 L231,388" />
        <text className="rkv-la" x={452} y={362}>vLLM obj tier (NIXL OBJ) over HTTP</text>
        <text className="rkv-ls" x={452} y={376}>LMCache s3 connector on the AWS CRT</text>

        {/* Legend */}
        <line className="rkv-lgl" x1={24} y1={444} x2={52} y2={444} />
        <text className="rkv-leg" x={60} y={448}>lands in GPU memory, no host hop</text>
        <line className="rkv-lal" x1={290} y1={444} x2={318} y2={444} />
        <text className="rkv-leg" x={326} y={448}>lands in host memory first</text>
        <rect className="rkv-efa" x={520} y={437} width={16} height={14} rx={3} />
        <text className="rkv-leg" x={544} y={448}>EFA devices (the fabric)</text>
      </svg>
    </div>
  );
}

export function RemoteKvTiersAws() {
  return (
    <>
      <Container
        header={
          <Header
            variant="h2"
            description="Which remote tier puts a block straight back into GPU memory, which land it in host memory first, and what each delivers per client"
          >
            Remote tiers on AWS: who moves the bytes, and where they land
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A remote tier holds KV outside the instance that computed it, so another instance, or
            the same one after a restart, loads the prefix instead of recomputing it.{' '}
            <strong>
              Two questions place each tier: who moves the bytes, and whether they land in GPU
              memory or in host memory.
            </strong>{' '}
            Bytes that land in host memory reach the GPU through one more copy, by vLLM&apos;s CPU
            tier or LMCache&apos;s L1.
          </Box>
          <Box variant="p">
            Four tiers are covered here: two AWS services, FSx for Lustre and S3, and two stores you
            run self-managed on EC2, DRAM pooled by Mooncake Store over EFA (Elastic Fabric Adapter)
            and a Valkey node running the large-object module. SageMaker HyperPod&apos;s managed
            tiered KV cache is covered in the flash-tier section (section 9) of{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>
            .
          </Box>
          <Box variant="p">
            vLLM&apos;s own secondary tiers land in host memory, because only its CPU tier touches
            GPU memory{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/base.py', 'L130-L159')} kind="code" accessed="2026-10-24">
              tiering/base.py L130-L159
            </Cite>
            . Two paths skip the host. <code>MooncakeStoreConnector</code> registers the GPU KV
            cache{' '}
            <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/mooncake/store/worker.py', 'L1872-L1892')} kind="code" accessed="2026-10-24">
              mooncake/store/worker.py L1872-L1892
            </Cite>{' '}
            with Mooncake&apos;s EFA transport as CUDA memory{' '}
            <Cite tier={1} href={`${MC}mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L534-L592`} kind="code" accessed="2026-10-24">
              efa_context.cpp L534-L592
            </Cite>
            . GDS on FSx for Lustre moves file data straight to GPU memory{' '}
            <Cite tier={1} href={`${FSX}efa-file-systems.html`} accessed="2026-10-24">
              FSx: EFA-enabled file systems
            </Cite>
            , reached through LMCache&apos;s GDS backend.
          </Box>
          <AwsRemoteKvPathsDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not to scale. Arrows show loads; stores reverse them. Valkey commands use a
            separate TCP connection, not drawn. LNet is Lustre Networking; CRT is the AWS Common
            Runtime.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'tier', header: 'Remote tier', cell: (r) => <strong>{r.tier}</strong>, minWidth: 160 },
              { id: 'mover', header: 'Who moves the bytes', cell: (r) => r.mover, minWidth: 190 },
              { id: 'lands', header: 'Lands in', cell: (r) => r.lands, minWidth: 150 },
              { id: 'reach', header: 'How vLLM v0.31.0 reaches it', cell: (r) => r.reach, minWidth: 210 },
              { id: 'throughput', header: 'Throughput per client (maximum)', cell: (r) => r.throughput, minWidth: 210 },
              { id: 'latency', header: 'Latency (AWS documentation)', cell: (r) => r.latency, minWidth: 160 },
              { id: 'maturity', header: 'Maturity on 2026-10-24', cell: (r) => r.maturity, minWidth: 200 },
            ]}
            items={remoteTierRows}
            sortingDisabled
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What to install, set and watch for each tier, and the order to add them in"
          >
            Choosing a remote tier on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <div>
            <Box variant="h3">Mooncake Store</Box>
            <Box variant="p">
              Use <code>MooncakeStoreConnector</code>, the cache tier{' '}
              <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/mooncake/store/worker.py', 'L1022')} kind="code" accessed="2026-10-24">
                mooncake/store/worker.py L1022
              </Cite>{' '}
              <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/mooncake/store/worker.py', 'L1356')} kind="code" accessed="2026-10-24">
                L1356
              </Cite>
              ; <code>MooncakeConnector</code> is prefill-to-decode transfer, with its own{' '}
              <code>mooncake_protocol</code> setting{' '}
              <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/mooncake/mooncake_connector.py', 'L968-L981')} kind="code" accessed="2026-10-24">
                mooncake_connector.py L968-L981
              </Cite>
              .
            </Box>
            <Box variant="p">
              <strong>Install the EFA build.</strong> vLLM&apos;s KV-connector extras install{' '}
              <code>mooncake-transfer-engine</code>, which lacks EFA{' '}
              <Cite tier={1} href={vllmUrl('requirements/kv_connectors.txt', 'L1-L8')} kind="code" accessed="2026-10-24">
                requirements/kv_connectors.txt L1-L8
              </Cite>{' '}
              <Cite tier={1} href={`${MC}.github/workflows/_build-wheel.yaml#L60-L107`} kind="code" accessed="2026-10-24">
                Mooncake _build-wheel.yaml L60-L107
              </Cite>{' '}
              <Cite tier={1} href={`${MC}mooncake-common/common.cmake#L100`} kind="code" accessed="2026-10-24">
                Mooncake common.cmake L100
              </Cite>
              . Install <code>mooncake-transfer-engine-efa-cuda13</code>, or{' '}
              <code>mooncake-transfer-engine-efa</code> on a CUDA 12 build: vLLM defaults to CUDA 13,
              and a wheel for the other CUDA major fails to import{' '}
              <Cite tier={1} href={vllmUrl('docs/features/mooncake_connector_usage.md', 'L13-L15')} accessed="2026-10-24">
                mooncake_connector_usage.md L13-L15
              </Cite>{' '}
              <Cite tier={1} href="https://pypi.org/pypi/mooncake-transfer-engine-efa-cuda13/json" accessed="2026-10-24">
                PyPI: mooncake-transfer-engine-efa-cuda13
              </Cite>
              . Keep the EFA installer&apos;s libfabric on the library path{' '}
              <Cite tier={1} href={`${MC_EFA_DOC}#L131`} accessed="2026-10-24">
                Mooncake EFA guide L131
              </Cite>
              , and set <code>&quot;protocol&quot;: &quot;efa&quot;</code>, absent from vLLM&apos;s
              Mooncake docs{' '}
              <Cite tier={1} href={vllmUrl('docs/features/mooncake_store_connector_usage.md', 'L56')} accessed="2026-10-24">
                mooncake_store_connector_usage.md L56
              </Cite>
              .
            </Box>
            <Box variant="p">
              <strong>Size transfers first:</strong> Mooncake posts each transfer request as one EFA
              operation{' '}
              <Cite tier={1} href={`${MC}mooncake-transfer-engine/src/transport/efa_transport/efa_transport.cpp#L990-L998`} kind="code" accessed="2026-10-24">
                efa_transport.cpp L990-L998
              </Cite>
              . The project&apos;s Transfer Engine benchmark reports 97.11 GB/s GPU-to-GPU write at a{' '}
              <code>--block_size</code> of 64 KB against 352.59 GB/s at 1 MB on p5en, in its
              block-size sweep{' '}
              <Cite tier={2} href={`${MC_EFA_DOC}#L186-L384`} accessed="2026-10-24">
                Mooncake EFA guide L186-L384 (project claim)
              </Cite>
              . This research did not trace which vLLM setting sizes{' '}
              <code>MooncakeStoreConnector</code>&apos;s transfers.
            </Box>
            <Box variant="p">
              <strong>Watch</strong> the first transfer to each new peer: 26 ms, handshake included,
              in the project&apos;s p5en test{' '}
              <Cite tier={2} href={`${MC_EFA_DOC}#L435-L458`} accessed="2026-10-24">
                Mooncake EFA guide L435-L458 (project claim)
              </Cite>
              , and vLLM v0.31.0&apos;s Mooncake connector code calls no warm-up to pay it in
              advance{' '}
              <Cite tier={1} href="https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/mooncake" kind="code" accessed="2026-10-24">
                vLLM kv_connector/v1/mooncake
              </Cite>
              .
            </Box>
            <ExpandableSection headerText="Docs versus code: the guide's FI_EFA_ENABLE_SHM_TRANSFER=0 workaround is stale at v0.3.13.post1">
              <Box variant="p">
                The Mooncake EFA guide still has same-host processes that exchange GPU buffers set{' '}
                <code>FI_EFA_ENABLE_SHM_TRANSFER=0</code> to avoid a crash{' '}
                <Cite tier={1} href={`${MC_EFA_DOC}#L393-L412`} accessed="2026-10-24">
                  Mooncake EFA guide L393-L412
                </Cite>
                , but CUDA builds at this tag declare <code>FI_HMEM</code>, the fix for that crash{' '}
                <Cite tier={1} href={`${MC}mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L75-L89`} kind="doc-code-conflict" accessed="2026-10-24">
                  efa_context.cpp L75-L89
                </Cite>
                , so the setting only gives up libfabric&apos;s same-host shared-memory path.
              </Box>
            </ExpandableSection>
          </div>

          <div>
            <Box variant="h3">The Valkey large-object module</Box>
            <Box variant="p">
              vLLM would reach it through <code>LMCacheMPConnector</code> and the{' '}
              <code>valkey</code> L2 adapter&apos;s <code>rdma</code> transport, added in open LMCache
              pull request 5556, which needs{' '}
              <code>valkey-glide-sync</code> 2.6.0{' '}
              <Cite tier={1} href={`${LM_PR}lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L42-L46`} kind="code" accessed="2026-10-24">
                rdma_worker_pool.py L42-L46 at PR head
              </Cite>
              , unreleased on PyPI on 2026-10-24{' '}
              <Cite tier={1} href="https://pypi.org/pypi/valkey-glide-sync/json" accessed="2026-10-24">
                PyPI: valkey-glide-sync
              </Cite>
              . No ElastiCache or MemoryDB offering of the module, RDMA or EFA was located in their
              documentation or What&apos;s New on 2026-10-24{' '}
              <Cite tier={1} href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html" accessed="2026-10-24">
                ElastiCache: engine versions
              </Cite>{' '}
              <Cite tier={1} href="https://docs.aws.amazon.com/memorydb/latest/devguide/engine-versions.html" accessed="2026-10-24">
                MemoryDB: engine versions
              </Cite>
              .
            </Box>
            <Box variant="p">
              <strong>Plan for host memory:</strong> the located client stack, LMCache over
              glide-rdma, registers LMCache&apos;s pinned host-memory L1 arena{' '}
              <Cite tier={1} href={`${LM_PR}lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L137-L159`} kind="code" accessed="2026-10-24">
                rdma_worker_pool.py L137-L159 at PR head
              </Cite>{' '}
              <Cite tier={1} href={`${LM_PR}lmcache/v1/distributed/memory_manager/l1_memory_manager.py#L1-L2`} kind="code" accessed="2026-10-24">
                l1_memory_manager.py L1-L2 at PR head
              </Cite>
              .
            </Box>
            <Box variant="p">
              <strong>Treat a node as a cache you can lose:</strong> it keeps objects in DRAM, or on
              local NVMe behind a DRAM cache{' '}
              <Cite tier={1} href={`${VLO}src/configs.rs#L15-L24`} kind="code" accessed="2026-10-24">
                configs.rs L15-L24
              </Cite>
              , with no persistence, no replication, and the NVMe directory emptied on every start{' '}
              <Cite tier={1} href={`${VLO}src/lib.rs#L144-L155`} kind="code" accessed="2026-10-24">
                lib.rs L144-L155
              </Cite>{' '}
              <Cite tier={1} href={`${VLO}tests/test_largeobj_persistence.py#L128-L277`} kind="code" accessed="2026-10-24">
                test_largeobj_persistence.py L128-L277
              </Cite>
              .
            </Box>
            <ExpandableSection headerText="Evidence: the README's GPU-memory transport, and the module's only throughput figures">
              <Box variant="p">
                The module&apos;s README promises an &quot;optional EFA RDMA transport to GPU
                memory&quot;{' '}
                <Cite tier={1} href={`${VLO}README.md#L1-L3`} kind="doc-code-conflict" accessed="2026-10-24">
                  valkey-large-object README L1-L3
                </Cite>
                , and the server writes wherever a client registers{' '}
                <Cite tier={1} href={`${VLO}src/commands/mod.rs#L22-L84`} kind="code" accessed="2026-10-24">
                  commands/mod.rs L22-L84
                </Cite>
                , but the glide-rdma endpoint requests no <code>FI_HMEM</code>, libfabric&apos;s
                GPU-memory capability, and registers memory with a plain <code>fi_mr_reg</code>{' '}
                <Cite tier={1} href={`${GLIDE_PR}glide-rdma/src/endpoint.rs#L190-L196`} kind="code" accessed="2026-10-24">
                  glide-rdma endpoint.rs L190-L196 at PR head
                </Cite>{' '}
                <Cite tier={1} href={`${GLIDE_PR}glide-rdma/src/endpoint.rs#L756-L785`} kind="code" accessed="2026-10-24">
                  L756-L785
                </Cite>
                .
              </Box>
              <Box variant="p">
                Reported by the pull request&apos;s author at adapter level, with no engine, between
                two c8gn.16xlarge in one placement group{' '}
                <Cite tier={2} href={`${LMCACHE_PR}#issuecomment-6304983743`} accessed="2026-10-24">
                  LMCache PR 5556 comment (project claim)
                </Cite>
                , each with 200 Gigabit and EFA{' '}
                <Cite tier={1} href={EC2_CO} accessed="2026-10-24">
                  EC2 compute optimized specifications
                </Cite>
                : with 4 to 16 workers, 16 MiB loads into host memory reached 197.8 to 198.6 Gbit/s
                over RDMA against 32.8 to 62.5 Gbit/s over TCP, and 256 KiB loads, at 16 workers,
                63.3 against 40.5 Gbit/s.
              </Box>
            </ExpandableSection>
          </div>

          <div>
            <Box variant="h3">FSx for Lustre</Box>
            <Box variant="p">
              <strong>Choose EFA at creation:</strong> it needs Persistent 2 with a metadata
              configuration and cannot be added later{' '}
              <Cite tier={1} href={`${FSX}efa-file-systems.html`} accessed="2026-10-24">
                FSx: EFA-enabled file systems
              </Cite>
              . Client setup for FSx and EFA is in the Storage Data Paths section of the{' '}
              <Link external href="../efa/">
                EFA deep dive
              </Link>
              .
            </Box>
            <Box variant="p">
              <strong>vLLM&apos;s fs tier takes the 700 Gbps path:</strong> POSIX I/O from the CPU
              tier, one file per chunk{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/fs/io.py', 'L90-L218')} kind="code" accessed="2026-10-24">
                tiering/fs/io.py L90-L218
              </Cite>
              . Instances share files by content hash{' '}
              <Cite tier={1} href={vllmUrl('docs/features/kv_offloading_usage.md', 'L168-L196')} accessed="2026-10-24">
                Usage Guide L168-L196
              </Cite>{' '}
              and nothing evicts them{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/fs/manager.py', 'L109-L120')} kind="code" accessed="2026-10-24">
                tiering/fs/manager.py L109-L120
              </Cite>{' '}
              <Cite tier={1} href={vllmUrl('docs/features/kv_offloading_usage.md', 'L106')} accessed="2026-10-24">
                Usage Guide L106
              </Cite>
              .
            </Box>
            <ExpandableSection headerText="Sizing: how many TiB one client needs at 700 or 1,200 Gbps">
              <Box variant="p">
                By our arithmetic from the per-TiB rates and 4.8 TiB steps{' '}
                <Cite tier={1} href={`${FSX}ssd-storage.html`} accessed="2026-10-24">
                  FSx: SSD storage performance
                </Cite>{' '}
                <Cite tier={1} href={`${FSX}getting-started.html`} accessed="2026-10-24">
                  FSx: Getting started
                </Cite>
                , one client fed from disk needs about 91.2 TiB of EFA PERSISTENT-1000 at 700 Gbps
                and 153.6 TiB at 1,200 Gbps (62.4 TiB when reads hit the servers&apos; cache, about
                1.7 TiB of RAM at that size). No AWS measurement located shows one client at either
                ceiling.
              </Box>
            </ExpandableSection>
            <Box variant="p">
              <strong>The GDS paths sit outside vLLM&apos;s tree.</strong> LMCache&apos;s GDS backend
              calls cuFile by default{' '}
              <Cite tier={1} href={`${LM}lmcache/v1/storage_backend/gds_backend.py#L218-L357`} kind="code" accessed="2026-10-24">
                LMCache gds_backend.py L218-L357
              </Cite>
              , in LMCache&apos;s deprecated in-process mode{' '}
              <Cite tier={1} href={`${LM}docs/source/kv_cache/storage_backends/gds.rst#L1-L7`} accessed="2026-10-24">
                LMCache gds.rst L1-L7
              </Cite>
              . Load nvidia-fs on every GDS client, or reads fall back silently to a CPU bounce
              buffer{' '}
              <Cite tier={2} href={ML_GDS_BLOG} accessed="2026-10-24">
                AWS ML Blog, 2026-06-01
              </Cite>
              .
            </Box>
            <ExpandableSection headerText="Other FSx paths: per-worker, retired, or plugin-only">
              <Box variant="p">
                Dynamo KVBM (KV Block Manager) creates NIXL&apos;s GDS_MT backend for its disk tier{' '}
                <Cite tier={1} href={`${DY}lib/llm/src/block_manager/distributed/worker.rs#L94-L114`} kind="code" accessed="2026-10-24">
                  Dynamo worker.rs L94-L114
                </Cite>{' '}
                (we did not trace which backend serves each transfer), but that tier is one private
                file per worker, deleted when the process exits{' '}
                <Cite tier={1} href={`${DY}lib/llm/src/block_manager/storage/disk.rs#L398-L470`} kind="code" accessed="2026-10-24">
                  Dynamo disk.rs L398-L470
                </Cite>
                . llm-d&apos;s fs connector ended at vLLM 0.23, upstreamed as the fs tier without
                its GDS mode{' '}
                <Cite tier={1} href={`${LLMD_FS}README.md#L3-L13`} accessed="2026-10-24">
                  llmd_fs_backend README L3-L13
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/fs/io.py')} kind="code" accessed="2026-10-24">
                  tiering/fs/io.py
                </Cite>
                . <code>NixlConnector</code>&apos;s <code>&quot;GDS&quot;</code> backend{' '}
                <Cite tier={1} href={vllmUrl('docs/features/disagg_prefill.md', 'L24-L28')} accessed="2026-10-24">
                  disagg_prefill.md L24-L28
                </Cite>{' '}
                only loads a plugin{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py', 'L560-L562')} kind="code" accessed="2026-10-24">
                  nixl/base_worker.py L560-L562
                </Cite>
                ; by our reading it registers only GPU and host memory with NIXL{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py', 'L746-L754')} kind="code" accessed="2026-10-24">
                  nixl/base_worker.py L746-L754
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py', 'L1822-L1823')} kind="code" accessed="2026-10-24">
                  L1822-L1823
                </Cite>
                , so FSx files never enter it.
              </Box>
            </ExpandableSection>
            <ExpandableSection headerText="The AWS Storage Blog's four-tier framing, and where it conflicts">
              <Box variant="p">
                An AWS Storage Blog post frames HBM, host DRAM, FSx for Lustre and S3 as four KV
                tiers, with no measurement{' '}
                <Cite tier={2} href={STORAGE_BLOG} accessed="2026-10-24">
                  AWS Storage Blog, 2026-09-21
                </Cite>
                . Its FSx latency, &quot;100-500 μs&quot;, has no stated setup, against
                &quot;consistent, sub-millisecond latencies&quot; in the FSx documentation{' '}
                <Cite tier={1} href={`${FSX}ssd-storage.html`} accessed="2026-10-24">
                  FSx: SSD storage performance
                </Cite>
                . The &quot;KV Block Manager&quot; it names as vLLM&apos;s file offload is
                Dynamo&apos;s component; vLLM&apos;s is the <code>fs</code> tier{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/factory.py', 'L150-L172')} kind="code" accessed="2026-10-24">
                  tiering/factory.py L150-L172
                </Cite>
                .
              </Box>
            </ExpandableSection>
          </div>

          <div>
            <Box variant="h3">S3</Box>
            <Box variant="p">
              Every S3 path starts in host memory: vLLM&apos;s <code>obj</code> tier hands CPU-tier
              buffers to NIXL&apos;s OBJ plugin{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/obj/manager.py', 'L96-L162')} kind="code" accessed="2026-10-24">
                tiering/obj/manager.py L96-L162
              </Cite>
              , whose default S3 engine takes host memory only{' '}
              <Cite tier={1} href={`${NX}src/plugins/obj/s3/engine_impl.h#L20-L21`} kind="code" accessed="2026-10-24">
                NIXL obj/s3/engine_impl.h L20-L21
              </Cite>
              . Of the engines read at their pinned tags, only LMCache handles S3 Express One Zone
              explicitly, with <code>s3_enable_s3express</code>{' '}
              <Cite tier={1} href={`${LM}lmcache/v1/storage_backend/connector/s3_connector.py#L81-L138`} kind="code" accessed="2026-10-24">
                LMCache s3_connector.py L81-L138
              </Cite>
              .
            </Box>
          </div>

          <div>
            <Box variant="h3">The order to add them in</Box>
            <Box variant="p">
              Our guidance, once the next container&apos;s CPU tier and local <code>fs</code> are in
              place, with who moves the bytes, and where they land, in parentheses:
            </Box>
            <ol>
              <li>
                Several EFA GPU instances: Mooncake Store through{' '}
                <code>MooncakeStoreConnector</code> (client-side EFA, into GPU memory), while the
                shared working set fits in DRAM peers can lend.
              </li>
              <li>
                FSx for Lustre with <code>fs</code> (Lustre client, into host memory) once the set
                outgrows that DRAM or must outlive its processes; LMCache&apos;s GDS backend (cuFile,
                into GPU memory) only if the 700 Gbps host path is the measured limit.
              </li>
              <li>
                S3 through <code>obj</code> (HTTP, into host memory) for restarts and cold prefixes.
              </li>
              <li>
                The Valkey module (server-side EFA, into host memory) once its clients are
                released.
              </li>
            </ol>
            <Box variant="p">
              Then check the tier&apos;s bandwidth per GPU against recompute in the flash-tier
              ladder (section 9) of{' '}
              <Link external href="../silicon-memory-inference/">
                Silicon, Memory &amp; Inference
              </Link>
              .
            </Box>
          </div>
        </SpaceBetween>
      </Container>
    </>
  );
}
