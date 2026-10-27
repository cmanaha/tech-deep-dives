# AWS remote KV cache tiers: plan (stream kvtier, 2026-10-24)

Carlos asked for remote KV cache tiers on AWS: Valkey moving KV over RDMA, FSx for Lustre
as a shared KV tier with GPUDirect Storage, set next to Mooncake. This plan says where each
verified fact lands. Evidence lives in `research/2026-10-kv-tiers/01..03`; row ids below
(Vn, Mn, Fn) point into those registers. Accessed date on every new citation: 2026-10-24.

## Pins

| Thing | Pin |
| --- | --- |
| valkey-io/valkey-large-object | `7510b9483d9837bf63b475d4a8e8fa612c65063f` (no tags; crate 0.1.0) |
| LMCache PR 5556 (valkey_rdma L2 adapter, OPEN) | head `7e5987f80ada75380c31e92a186106841e999e94` |
| valkey-glide PR 7412 (OPEN) | head `7644df8b12ee71c77a219254c98d7cd69282f79c` |
| Valkey core | 9.1.2 |
| kvcache-ai/Mooncake | `v0.3.13.post1` = `719735896c86b56fabec6cf3e825fb2ea640597a` |
| vLLM | `v0.31.0` = `db9527a4` (the dive's pin; v0.32.0 exists, not adopted here) |
| LMCache | `v0.5.6` = `3e11e108` |
| SGLang | `v0.5.22` = `baa9befa` |
| NIXL | `v1.5.0` = `1683cf3b` |
| Dynamo | `v1.6.0` = `701da252` |
| llm-d / llm-d-kv-cache | `v1.0.0` |
| FSx for Lustre docs, S3 docs, AWS Storage Blog 2026-09-21, AWS ML blog 2026-06-01 | accessed 2026-10-24 |

## The mental model (one, used by all three dives)

A KV block that leaves one instance is moved by somebody, and lands somewhere. Two
questions place every remote tier:

1. **Who moves the bytes, and over what?** One-sided RDMA over EFA (Mooncake Transfer
   Engine `efa`: the client posts `fi_write`/`fi_read` (M9); Valkey BLOB module: the
   *server* posts `fi_writemsg`/`fi_read` (V7, V9)); the Lustre client over LNet on EFA,
   with cuFile/nvidia-fs when GDS is used (F25, F46); or an HTTP client to S3 (F65).
2. **Does it land in GPU memory or in host memory?** Only some paths reach HBM directly:
   vLLM `MooncakeStoreConnector` registers the GPU KV cache (M29) and Mooncake's EFA
   transport registers device pointers with `FI_HMEM_CUDA` (M8); LMCache's GDS backend and
   llm-d's fs backend call cuFile (F46, F59); Dynamo KVBM's disk tier can use GDS_MT but
   is private to one process (F54, F55). Everything else stages through host DRAM: vLLM's
   native `fs`/`obj`/`p2p` tiers (F42, M30), LMCache's remote connectors (M33, M34),
   SGLang HiCache `file` and `mooncake` (F61, M43), and every Valkey client located (V43, V49).

Corollary for readers: "remote tier over RDMA" does not imply "into GPU memory". The
README of the Valkey module promises GPU memory; the clients that exist register host
memory (V16 vs V43/V49). This is a documentation-versus-code finding and ships as one.

Tier ladder beyond the GPU on AWS (the order the pages use):

| Tier | What moves the bytes | Lands in | Per-client ceiling (first-party) | Latency (first-party) | Maturity (2026-10-24) |
| --- | --- | --- | --- | --- | --- |
| HBM | the GPU | | | | |
| Host DRAM (this instance) | GPU DMA | host | PCIe (silicon dive owns the number) | | GA in every engine |
| Local NVMe instance store | POSIX or GDS | host or GPU | silicon dive owns | | GA |
| Remote DRAM pool over EFA: Mooncake Store | Transfer Engine `efa`, client-posted one-sided RMA | GPU (vLLM MooncakeStoreConnector) or host (LMCache, SGLang) | EFA line rate of the instance (3,200 Gb/s p5en; ac.html) | numbers: register 02 "Latency and bandwidth" | released (v0.3.13.post1); EFA build is a separate wheel (M6, M28) |
| Remote DRAM pool over EFA: Valkey BLOB module | server-posted one-sided RMA over `efa-direct` | host (LMCache L1) today | PR-author claim only: ~198 Gb/s on c8gn.16xlarge (V65) | none from AWS | pre-release: no tags, API experimental until 1.0, clients unreleased (V1, V37, V41-V48); self-managed on EC2 only (V58) |
| Shared file system: FSx for Lustre | Lustre client over LNet on EFA; cuFile with GDS | host, or GPU with GDS | 100 Gbps ENA, 700 Gbps EFA, 1,200 Gbps EFA+GDS (F20) | "sub-millisecond" (F31); blog "100-500 μs" unsourced (F10) | GA; EFA and GDS are create-time and client-type gated (F18, F22, F25) |
| Object: S3 / S3 Express One Zone | HTTP clients (NIXL OBJ, AWS CRT) | host | not a per-client figure in docs | Express "single-digit millisecond" (F63); Standard (F64) | GA; KVBM G4 documented but not wired at v1.6.0 (M54) |

## Where each fact lands

### vLLM dive (primary home): section 7, KV-Cache Offloading & Tiers

Placement: a new sub-file `src/sections/offload/RemoteKvTiersAws.tsx`, exported component
`RemoteKvTiersAws`, rendered inside `KVOffloadingLMCache.tsx` after the "whether offloading
pays" container and before the closing "first tier to enable" container. Rationale: the
inequality container gives the bandwidth a tier needs; this container gives what each AWS
tier delivers and how its bytes move; the closing container then says what to enable.
A new numbered nav section was rejected: 300+ "section N" cross-references would renumber,
including in `AwsNeuron.tsx` (owned by the trainium stream).

Content (two h2 containers, target 300 to 400 TSX lines):

1. h2 "Remote tiers on AWS: who moves the bytes" (description states the payoff). Intro
   (2 to 3 sentences: what a remote tier buys: reuse across instances and restarts).
   Diagram `AwsRemoteKvPathsDiagram` (inline SVG, idiom A, prefix `rkv-`): instance on the
   left (GPU HBM, host DRAM); four remote tiers on the right (Mooncake Store pool, Valkey
   BLOB node, FSx for Lustre, S3); each arrow labelled with what moves the bytes and drawn
   to GPU or to host per the mental model. Then the tier table (rows above: what it is,
   what moves bytes, lands in, ceiling, latency, maturity, how vLLM v0.31.0 reaches it).
   Bandwidth-per-GPU ladder is NOT redrawn: link to the silicon dive's ladder.
2. h2 "Choosing a remote tier on AWS" with h3 blocks:
   - Pooled DRAM over EFA: Mooncake Store (M17, M29, M6, M8, M9, M11, M14, M26 to M28,
     M36, M51) and the Valkey BLOB module (V5, V7, V9, V15, V20 to V24, V37, V41 to V49,
     V52, V53, V58, V62, V65). Practical: install the `-efa` Mooncake wheel and set
     protocol `efa`; `FI_EFA_ENABLE_SHM_TRANSFER=0` for same-host cross-process GPU
     transfers; NIXL's MOONCAKE plugin cannot select EFA; Valkey module data does not
     survive a restart and does not replicate; no ElastiCache offering located.
   - Shared file system: FSx for Lustre (F20, F18, F22, F25, F40 to F43, F46 to F48,
     F54, F55, F59, F77, F24 sizing, F10/F31 latency conflict). Practical: vLLM's `fs`
     tier is POSIX from host memory and never evicts; GDS needs LMCache's GDS backend or
     llm-d's fs backend; KVBM G3 on FSx is private per worker; `"backends": ["UCX","GDS"]`
     on NixlConnector does not make FSx a KV tier.
   - Object: S3 (F44, F63 to F65, M54): host-memory path; Express One Zone only via
     LMCache's switch; DRA auto-export lands in S3 Standard.
   - Order to choose in (ends on the action).
   ExpandableSections hold supporting evidence (doc-vs-code conflicts, the AWS Storage
   Blog's four-tier framing with its unsourced latency figure, PR-author numbers).

Also in section 7 (same agent, small edits): M31 (stale factory.py range), M39 (LMCache
backend list incomplete: add the MP L2 adapter layer, which carries `valkey` and
`mooncake_store`, M35), a pointer in the intro Alert to the AWS sub-section.

Orchestrator (shared files): glossary entries (Mooncake Store / Transfer Engine, Valkey,
RESP, RMA, LNet, OSS, DRA, cuFile, S3 Express One Zone), regenerate `sources.md`, one
cross-link sentence in `AwsGpuEfaNixl.tsx` (section 22) pointing to section 7.

### silicon-memory-inference: FlashCacheTier (extend, do not redraw)

- `FlashTierLadder.tsx`: add two FSx rows so the create-time EFA choice is visible against
  the break-even line: FSx over EFA without GDS (700 Gb/s per client = 10.9 GB/s per GPU,
  derived) and FSx over ENA (100 Gb/s = 1.56 GB/s per GPU, derived, below the 2.1 GB/s
  break-even). Relabel "Peer DRAM over EFA" with the two pools that provide it on AWS
  (Mooncake Store, Valkey BLOB module). Keep height under ~500 units (tighten ROW_H).
- "Sharing context across nodes": fix F18 scope (the five-type list is the GDS list; EFA
  700 Gb/s applies to Nitro v4+ EFA instances excluding trn2); add the remote DRAM pools
  on AWS with maturity (Mooncake EFA transport released; Valkey module pre-release, host
  memory today); attribute the AWS Storage Blog's four-tier framing and contrast its
  "100-500 μs" with the docs' "sub-millisecond" (F10, F31); refine the 150 TiB sizing
  (F24: 153.6 TiB disk-bound, 62.4 TiB cache-resident, both derived).
- "Building the tier, in order" step 3: KVBM's G3 on FSx is private per worker (F54);
  name the connectors that make FSx shared (vLLM `fs`, LMCache, llm-d fs backend).
- Sources in `src/sources/FlashCacheTier.ts`; regenerate `sources.md` via tests `-u`.
- Cross-link to vLLM section 7.

### EFA dive: StorageDataPaths

New h2 container "KV cache over the fabric", placed before "Choosing a path" so that
section still ends on the reader's decision. Content:
- Two EFA paths for KV: FSx for Lustre with GDS (LNet over EFA, nvidia-fs 2.24.2+, GDS
  client list, which KV connectors issue cuFile vs POSIX from host) and pooled DRAM over
  libfabric (Mooncake `efa` transport: client-posted `fi_write`/`fi_read` on an RDM
  endpoint, `FI_HMEM_CUDA` registration, every NIC registered; Valkey BLOB: server-posted
  `fi_writemsg` with `FI_DELIVERY_COMPLETE` over `efa-direct`).
- The EFA mental model it teaches: EFA exposes SRD and UD, not RC, so RC-verbs RDMA stacks
  (core Valkey RDMA V52/V53, Mooncake's `rdma` transport M14) do not run on it; the
  libfabric port is what makes a KV store EFA-capable. (V53 is inference from code: label.)
- One small diagram `KvOverFabricDiagram` (prefix `kvf-`) if the leverage check asks for
  it; otherwise a table. SourceRef provenance: documented (FSx), code-derived (Mooncake,
  Valkey at pinned SHAs).
- Cross-link to vLLM section 7 and silicon FlashCacheTier.

### SGLang handoff

`research/2026-10-kv-tiers/sglang-handoff.md`: HiCache L3 backend list and byte paths at
v0.5.22 (M41 to M46, F61, F62), EFA settings for Mooncake (M43, M44), NIXL plugin order
pitfall (F62), what SGLang cannot reach (no Valkey/Redis backend, M42).

## Authoring waves (at most 3 agents)

Wave 1, one agent per file group, in parallel:
- A: vLLM `src/sections/offload/RemoteKvTiersAws.tsx` + small edits in `KVOffloadingLMCache.tsx`.
- B: silicon `FlashCacheTier.tsx`, `components/FlashTierLadder.tsx`, `sources/FlashCacheTier.ts`.
- C: EFA `StorageDataPaths.tsx`.
Orchestrator: glossary, sources.md regen, cross-link in section 22, sglang-handoff.md,
build, Playwright screenshots at 1440 and 390 for every new or changed diagram.

Then: adversarial fact check (one agent per changed file group), Gate 3 score per changed
section (no section below 7, average at least 8), corrections only, leverage pass,
`bash scripts/ci.sh` with its exit code, report, STREAM_DONE.

## Out of scope (recorded, not built)

- Re-pinning vLLM to v0.32.0 (separate iteration per the vLLM revamp memory).
- SageMaker HyperPod managed tiered KV cache is already covered in the silicon dive.
- Benchmarking any tier ourselves (no cloud resources in this stream).
