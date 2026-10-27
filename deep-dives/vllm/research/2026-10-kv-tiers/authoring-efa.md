# Authoring log: EFA dive, StorageDataPaths, "KV cache over the fabric" (2026-10-24)

File changed: `deep-dives/efa/src/sections/StorageDataPaths.tsx` (only file edited besides this log).
Every citation added or re-verified: accessed / read `2026-10-24` (new constant `KV_READ`).
Pinned trees used to re-check every quoted line range: `/tmp/kvtier-mooncake/mooncake`
(HEAD 719735896c86, tag v0.3.13.post1), `/tmp/kvtier-valkey/{vlo,vdma-src/vdma,lmcache-pr/lmc,glide-pr/g,valkey-core/valkey,rdma-core/rc}`
(HEADs 7510b948, 72c3a088, 7e5987f8, 7644df8b, tag 9.1.2, tag v65.0), `/tmp/kvtier-fsx/{vllm,lmcache,llm-d-kv-cache,dynamo,nixl,sglang}`
(tags v0.31.0, v0.5.6, v1.0.0, v1.6.0, v1.5.0, v0.5.22). Nothing was built or run against those trees.

## What changed, in reading order

1. New module-private diagram `KvOverFabricDiagram` (prefix `kvf-`, idiom A, viewBox 860 x 456).
2. New h2 container "KV cache over the fabric", placed after "The boundary of this section" and
   immediately before "Choosing a path", so the section still ends on the reader's decision.
3. F73 fix in `ThreeDataPathsDiagram` (FSx EFA lane): removed "The Lustre client kernel module
   still handles metadata". New lane text: "LNet runs over the EFA device. GPUDirect Storage moves
   / file data directly between the file system and GPU / memory on P5, P5e, P5en, P6-B200, P6-B300."
   Every clause is already stated and cited in the section (LNet over EFA: container "Putting FSx
   for Lustre on the fabric"; direct transfer between file system and GPU memory and the five-type
   list: "GDS is narrower than EFA", docs.fsxEfa). No new claim.
4. F76 fix in the comparison table, CPU cost row, FSx column: deleted the second sentence ("The
   Lustre client kernel module is otherwise in the path."). First sentence kept (F76: CORRECT).
5. "The boundary of this section" h2 description: "FSx for Lustre claims here come from documentation
   and S3 client claims from code" became "FSx for Lustre service claims here come from
   documentation, and S3 client and KV-tier claims from code ...". Needed because the new container
   adds code-derived FSx-connector claims; without the edit the description would be false.
6. File header comment: one paragraph on the KV container's sourcing split.
7. Accessed-date bumps on two existing doc refs, `docs.fsxPerf` (was ACCESSED 2026-08-01) and
   `docs.fsxClients` (was REFRESHED 2026-10-23), to `KV_READ`. Justification: register 03 re-read
   both pages on 2026-10-24 and re-verified every claim this file cites to them (fsxPerf: F20, F37,
   F71, F72; fsxClients: F19, F23, F25, F26, F27). `docs.fsxEfa` was NOT bumped: its placement
   claim (same AZ, same /16 CIDR) has no register-03 row, and the new container does not need it.
   The orchestrator should update the matching Sources.tsx accessDate for these two pages.
8. New `import Link from '@cloudscape-design/components/link'` for the sibling-dive links (same
   `<Link external href="../vllm/">` style the vLLM dive uses for sibling links; the EFA dive had no
   in-section sibling links before).

## (1) Claim diff: every assertion added or changed

Provenance shown is the SourceRef provenance used on the page. Code URLs are pinned.

### Intro, caption

| Assertion | Source | Row |
| --- | --- | --- |
| An engine can keep KV cache beyond its own instance so another instance reuses a prefix instead of recomputing it; two kinds of remote tier carry it over EFA: a shared file system and pooled DRAM | framing sentence, uncited (undisputed purpose; the two tier kinds are each cited below) | plan "mental model" |
| FSx for Lustre figures are AWS per-client maximums | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html ("Maximum throughput per client") | F20, F71 |
| Matching connectors to the FSx rows, and the core Valkey entry in the band, is our reading of code | label only (scopes the diagram) | F41, F46, V53 |

### FSx for Lustre

| Assertion | Source | Prov. | Row |
| --- | --- | --- | --- |
| LNet runs over the EFA device | https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html (`lnetctl net add --net efa`; setup script "Configures TCP and EFA interfaces") | documented | F26 |
| An EFA client gets up to 700 Gbps, or 1,200 Gbps with GDS | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | documented | F20 |
| GDS needs a P5, P5e, P5en, P6-B200 or P6-B300 client with NVIDIA GDS driver 2.24.2 or later | https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html ("Requirements: ...") | documented | F18, F25 |
| By our reading of the connector code, the 1,200 Gbps path needs cuFile I/O (labelled inference: AWS pages name no application API, F25) | the connector refs below | code-derived | F25, F46, F51 |
| LMCache's GDS backend issues cuFile I/O | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/gds_backend.py#L1015-L1097 (`CuFile(...).write(addr...)` / `.read(gpu_pointer...)`) | code-derived | F46 |
| llm-d's fs backend does with `gds_mode` set; default `disabled` | https://github.com/llm-d/llm-d-kv-cache/blob/v1.0.0/kv_connectors/llmd_fs_backend/llmd_fs_backend/worker.py#L442-L468 | code-derived | F59 |
| Dynamo's KV block manager disk tier: each worker's NIXL agent creates GDS_MT | https://github.com/ai-dynamo/dynamo/blob/v1.6.0/lib/llm/src/block_manager/distributed/worker.rs#L94-L114 and https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/cuda_gds/gds_mt_engine.cpp#L29-L54 (`cuFileRead` / `cuFileWrite`) | code-derived | F55, F51 |
| ... and its file is private to one worker | https://github.com/ai-dynamo/dynamo/blob/v1.6.0/lib/llm/src/block_manager/storage/disk.rs#L398-L470 (mkostemp per process, unlinked after NIXL registration) | code-derived | F54 |
| vLLM's fs tier does POSIX I/O from host memory | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/fs/io.py#L90-L218 and https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/fs/manager.py#L109-L128 (`primary_kv_view`: "Memoryview of the primary tier's CPU KV cache") | code-derived | F41, F42 |
| SGLang's file backend does POSIX I/O from host memory | https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/hicache_storage.py#L484-L547 (`.numpy().tofile`, `open(...).readinto`) | code-derived | F61 |

Scope kept from F55: the page says the agent "creates" GDS_MT; it does not say GDS_MT serves every
transfer (which NIXL backend serves a given transfer was not traced).

### Pooled DRAM: Mooncake

| Assertion | Source | Prov. | Row |
| --- | --- | --- | --- |
| Transfer Engine selects EFA with protocol `efa` | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/multi_transport.cpp#L516-L520 | code-derived | M6 |
| Posts one-sided `fi_write` / `fi_read` from the engine side on one RDM endpoint per EFA device | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L1146-L1158 (`shared_ep_`) | code-derived | M9, M17 |
| In a CUDA build, GPU buffers register with `FI_HMEM_CUDA`, so loaded KV can land in GPU memory | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L534-L592 | code-derived | M8 |
| Buffers go on every EFA device when the page-table budget allows | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_transport.cpp#L306-L315 | code-derived | M11 |
| ... or on the nearest ones with `MC_EFA_NIC_SELECTION=local` | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/config.cpp#L623-L634 and https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_transport.cpp#L1284-L1300 (local NIC map from the topology matrix) | code-derived | M11 |
| Install an EFA wheel such as `mooncake-transfer-engine-efa`; the default build omits the transport | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-common/common.cmake#L100 (`USE_EFA` OFF) and https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/scripts/build_wheel.sh#L264-L291 | code-derived | M6, M28 |
| Set `FI_EFA_ENABLE_SHM_TRANSFER=0` for same-host GPU transfers between processes, which libfabric's shm path can crash | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L388-L415 | documented (project doc) | M14 |

### Pooled DRAM: Valkey large-object module

| Assertion | Source | Prov. | Row |
| --- | --- | --- | --- |
| The client sends a RESP command over TCP naming its registered buffer | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/commands/mod.rs#L22-L84 (`(rkey, addr, len)` triples) | code-derived | V5, V6 |
| The server posts `fi_writemsg` with `FI_DELIVERY_COMPLETE` for a GET, so the reply cannot overtake the payload, or `fi_read` for a SET | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/transport/session.rs#L36-L91 and https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/crates/dma-libfabric/src/connection.rs#L43-L99 | code-derived | V7, V9 |
| ... over efa-direct | https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/crates/dma-libfabric/src/configuration.rs#L7-L48 | code-derived | V10 |
| Located clients register host memory, so KV lands there today | https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L137-L159, https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/distributed/memory_manager/l1_memory_manager.py#L2 ("CPU pinned-DRAM L1 memory manager."), and doc-vs-code badge: code https://github.com/valkey-io/valkey-glide/blob/7644df8b12ee71c77a219254c98d7cd69282f79c/glide-rdma/src/endpoint.rs#L756-L785 against README https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/README.md#L1-L3 | code-derived; doc-code-conflict | V43, V49 (vs V2, V16) |
| As of 2026-10-24 the module is unreleased | https://github.com/valkey-io/valkey-large-object/releases | documented | V1 |
| ... with an experimental API until 1.0 | https://github.com/valkey-io/valkey/issues/4743#issuecomment-5766728140 | documented (Tier 2 governance record) | V37 |
| ... and its client support is in open pull requests | https://github.com/LMCache/LMCache/pull/5556 , https://github.com/valkey-io/valkey-glide/pull/7412 | documented (Tier 2 project record) | V41, V47 |

### What makes a KV store EFA-capable

| Assertion | Source | Prov. | Row |
| --- | --- | --- | --- |
| The EFA verbs provider accepts UD queue pairs through standard verbs and SRD through its direct-verbs extension | https://github.com/linux-rdma/rdma-core/blob/v65.0/providers/efa/verbs.c#L2268-L2305 and https://github.com/linux-rdma/rdma-core/blob/v65.0/providers/efa/verbs.c#L2057-L2061 | code-derived | V53 |
| ... so stacks built on RC queue pairs stop at creation | same; consequence of EOPNOTSUPP for non-UD types | code-derived | V53, M14 |
| Mooncake's ibverbs `rdma` transport is one, and its `efa` transport replaces it on EFA | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L650-L654 (doc says RC QP create "fails (`EOPNOTSUPP`)"; code agrees: rdma_endpoint.cpp L138 sets `IBV_QPT_RC`) | documented (project doc), code in the disclosure | M14, M15 |
| Core Valkey RDMA creates RC queue pairs, so by our reading of both codebases it is another; no AWS or Valkey document stating so was located during this research | https://github.com/valkey-io/valkey/blob/9.1.2/src/rdma.c#L366-L381 plus the rdma-core refs | code-derived (labelled our reading; hedge scope kept) | V52, V53 |
| Both pools open a libfabric RDM endpoint on the efa provider | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L75-L103 and https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/crates/dma-libfabric/src/endpoint.rs#L95-L120 (with configuration.rs above for provider `efa`) | code-derived | M7, V10 |
| ... the userspace path of this section's EFA and SRD lane; that endpoint is the first thing to look for in a KV store's transport | tie to existing lane text ("Userspace libfabric writes work queue entries straight to the EFA device"); guidance sentence, scoped to "first thing to look for" (not "the only way": efadv direct verbs is another route in principle) | reasoning | n/a |

### Disclosure "The code behind the RC verdict"

`efa_create_qp` / `efa_create_qp_ex` return EOPNOTSUPP for any type but UD (verbs.c L2268-L2305);
a driver QP must be SRD (L2057-L2061); Valkey 9.1.2 sets `IBV_QPT_RC` before `rdma_create_qp`
(rdma.c L366-L381); Mooncake's rdma endpoint sets the same type
(https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/rdma_transport/rdma_endpoint.cpp#L138).

### Cross-links (no factual claim)

vLLM dive section 7 (KV-Cache Offloading & Tiers), `../vllm/`; Silicon, Memory & Inference dive
section 9 (Flash as a Cache Tier for Inference), `../silicon-memory-inference/`, tier ladder with the
recompute break-even. Sibling apps have no hash routing (shared DeepDiveLayout), so the links land on
the dive root and name the section in text, the convention the vLLM dive already uses.

### Diagram claims (all restated and cited in the prose above)

Mooncake lane: engine-side Transfer Engine, protocol efa, fi_write / fi_read, one RDM endpoint per
EFA device, to and from a peer's DRAM segment (M17), GPU or host memory, FI_HMEM_CUDA. Valkey lane:
server posts after a Valkey command over TCP, fi_writemsg / fi_read for GET / SET on efa-direct, into
the client's registered buffer, host memory today. FSx lane: Lustre client on the engine instance,
LNet over EFA, cuFile or POSIX I/O, 1,200 / 700 Gbps (F20), GPU through cuFile and GDS, host through
POSIX I/O. Band: RC verbs stacks stop at queue-pair creation (V52, V53, M14).

## (2) New sources for the EFA Sources appendix

Accessed 2026-10-24 for all. Tier per the EFA dive's 1-4 scale (source code = Tier 1).

| Title | URL | Tier | Provenance on page |
| --- | --- | --- | --- |
| Mooncake docs at v0.3.13.post1: EFA transport, "Why libfabric instead of ibverbs?" | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L650-L654 | 1 (project doc, orientation; code agrees) | documented |
| Mooncake docs at v0.3.13.post1: EFA transport, same-host GPU transfers and FI_EFA_ENABLE_SHM_TRANSFER | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L388-L415 | 1 (project doc) | documented |
| kvcache-ai/Mooncake source at v0.3.13.post1 (multi_transport.cpp, efa_context.cpp, efa_transport.cpp, config.cpp, rdma_endpoint.cpp, common.cmake, build_wheel.sh) | https://github.com/kvcache-ai/Mooncake/tree/v0.3.13.post1 | 1 | code-derived |
| valkey-io/valkey-large-object source at 7510b948 (commands/mod.rs, transport/session.rs) | https://github.com/valkey-io/valkey-large-object/tree/7510b9483d9837bf63b475d4a8e8fa612c65063f | 1 | code-derived |
| valkey-large-object README at 7510b948, lines 1 to 3 | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/README.md#L1-L3 | 1 (README, orientation) | doc-code-conflict |
| valkey-io/valkey-large-object releases (none as of 2026-10-24) | https://github.com/valkey-io/valkey-large-object/releases | 1 | documented |
| momentohq/vdma dma-libfabric at 72c3a088 (connection.rs, configuration.rs, endpoint.rs) | https://github.com/momentohq/vdma/tree/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18 | 1 | code-derived |
| valkey-io/valkey issue 4743, core-team comment of 2026-09-21 (API experimental until 1.0) | https://github.com/valkey-io/valkey/issues/4743#issuecomment-5766728140 | 2 | documented |
| valkey-io/valkey source at 9.1.2 (src/rdma.c) | https://github.com/valkey-io/valkey/blob/9.1.2/src/rdma.c#L366-L381 | 1 | code-derived |
| LMCache pull request 5556 (open as of 2026-10-24) | https://github.com/LMCache/LMCache/pull/5556 | 2 | documented |
| LMCache source at PR 5556 head 7e5987f8 (rdma_worker_pool.py, l1_memory_manager.py) | https://github.com/LMCache/LMCache/tree/7e5987f80ada75380c31e92a186106841e999e94 | 1 | code-derived |
| valkey-glide pull request 7412 (open as of 2026-10-24) | https://github.com/valkey-io/valkey-glide/pull/7412 | 2 | documented |
| valkey-glide source at PR 7412 head 7644df8b (glide-rdma/src/endpoint.rs) | https://github.com/valkey-io/valkey-glide/blob/7644df8b12ee71c77a219254c98d7cd69282f79c/glide-rdma/src/endpoint.rs#L756-L785 | 1 | doc-code-conflict |
| linux-rdma/rdma-core v65.0, providers/efa/verbs.c | https://github.com/linux-rdma/rdma-core/blob/v65.0/providers/efa/verbs.c | 1 | code-derived |
| LMCache v0.5.6, gds_backend.py | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/gds_backend.py#L1015-L1097 | 1 | code-derived |
| llm-d/llm-d-kv-cache v1.0.0, llmd_fs_backend worker.py | https://github.com/llm-d/llm-d-kv-cache/blob/v1.0.0/kv_connectors/llmd_fs_backend/llmd_fs_backend/worker.py#L442-L468 | 1 | code-derived |
| ai-dynamo/dynamo v1.6.0, KV block manager worker.rs and disk.rs | https://github.com/ai-dynamo/dynamo/tree/v1.6.0/lib/llm/src/block_manager | 1 | code-derived |
| ai-dynamo/nixl v1.5.0, cuda_gds/gds_mt_engine.cpp | https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/cuda_gds/gds_mt_engine.cpp#L29-L54 | 1 | code-derived |
| vllm-project/vllm v0.31.0, kv_offload/tiering/fs (io.py, manager.py) | https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1/kv_offload/tiering/fs | 1 | code-derived |
| sgl-project/sglang v0.5.22, mem_cache/hicache_storage.py | https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/hicache_storage.py#L484-L547 | 1 | code-derived |

Existing appendix entries to re-date (accessed 2026-10-24): FSx for Lustre User Guide
`performance.html` and `configure-efa-clients.html` (see item 7 above).

Glossary entries the orchestrator should add (new acronyms in this container, each expanded at first
use on the page): RC (Reliable Connected), UD (Unreliable Datagram), RESP (Redis Serialization
Protocol). Already in the glossary: KV, RDMA, RDM, SRD, GDS, NIXL, LNet, RMA.

## (3) Diagram coordinate rationale (`KvOverFabricDiagram`)

- viewBox 0 0 860 456, full-bleed white rect (dark-mode contract). Idiom A, classes `kvf-*`, marker
  id `kvf-head`, title id `kvf-tiers-title`.
- Title row y=30 (600 13px). Column headers y=58 (600 11px) at x=24, 304, 604.
- Three lanes at y0 = 70, 170, 270; each lane is three boxes of height 86: col 1 x=24 w=240,
  col 2 x=304 w=260, col 3 x=604 w=232 (40-unit gaps carry the arrows, which sit at y0+43 between
  boxes, so no label touches a line). Text in a box: bold 13px at y0+28, 11px at y0+50 and y0+68,
  x = box x + 14.
- Longest labels per column, with estimate (7.5 per char at 13px bold, 6.2 at 11px) against usable
  width (box width minus 28):
  col 1 "Valkey large-object module" 26 x 7.5 = 195 of 212; "posts the transfer, protocol efa" 32 x 6.2 = 198 of 212.
  col 2 "fi_writemsg / fi_read" 158 of 232; "into the client's registered buffer" 35 x 6.2 = 217 of 232.
  col 3 "GPU or host memory" 135 of 204; "GPU through cuFile and GDS" 27 x 6.2 = 167 of 204.
- Band x=24 y=372 w=812 h=68 (amber dashed, `kvf-band`), X glyph at 42-58 / 398-414, text at x=72:
  bold 12px y=394 "RC (Reliable Connected) verbs stacks stop at queue-pair creation on EFA"
  (71 x 7.0 = 497 of 744); 11px at y=413 and y=430.
- Rendered check: the same strings and coordinates measured with Chromium getBBox (scratch script
  `/tmp/kvtier-efa-geom/measure.mjs`, not in the repo): smallest right margin to a box edge 58 units
  ("Valkey large-object module"), no text-text overlaps (tolerance 2 units), every label inside its
  box vertically. The orchestrator's Playwright screenshots at 1440 and 390 remain the authority.
- Fonts: 11px minimum (13 / 12 / 11). At a 390 viewport the 11px labels paint at about 4px, the
  same advisory case as the section's other 860 to 920 wide diagrams.
- Numbers in the diagram: 1,200 Gbps and 700 Gbps only, both cited in the prose (F20).

## (4) Left out, and why

- Mooncake TENT engine, metadata backends, Store eviction defaults (M4, M5, M16, M19): per-engine
  depth, owned by the vLLM dive.
- vLLM's KV-connector extras installing the non-EFA Mooncake wheel (M28): per-engine; the EFA page
  says only "install an EFA wheel".
- Valkey PR-author throughput figures (V65, about 198 Gbit/s on c8gn.16xlarge): a project claim with
  no first-party number to set against it; the brief keeps this dive to what moves the bytes.
- ElastiCache having no module or RDMA support (V58): not in the brief for this dive.
- "Lustre client kernel module handles metadata" (F73) and "kernel module otherwise in the path"
  (F76): UNKNOWN on the AWS pages read; removed, not replaced.
- F71 style point ("reaches 700 Gbps" in the existing ThreeDataPathsDiagram title reads as a
  measurement): out of scope for this pass (only F73 and F76 were assigned); recorded here.
- Any claim that core Valkey RDMA "does not work on EFA" as an absolute: kept as our reading of two
  codebases, with "no AWS or Valkey document stating so was located during this research".
- "The libfabric port is what makes a KV store EFA-capable" as a universal: scoped on the page to
  "the first thing to look for", because EFA direct verbs (efadv SRD) is in principle another route
  and no store using it was examined.

## Open items for the orchestrator

- Word count: new reader-facing prose is about 570 words (target was under 450). The overshoot is
  the fact list the brief required; nothing in it passes neither test. A leverage pass could demote
  the Mooncake multi-NIC sentence or the Valkey maturity sentence into the disclosure.
- SourceRef's 'documented' popover says "AWS states this in its own documentation". Project docs
  (Mooncake guide, GitHub releases page, governance comment, PR pages) are cited with 'documented'
  per this dive's existing convention (gdrcopy README, vLLM docs). The sentences name the project
  where it matters, but the popover wording is inaccurate for non-AWS docs; a shared-component fix
  is outside this file.
- Sources.tsx: add the rows in section (2), re-date the two FSx pages, add RC, UD and RESP to the
  glossary.
- Build plus Playwright screenshots of `kvf-tiers-title` at 1440 and 390, and the svg-overlap gate.

## Gate results (run from the worktree root, 2026-10-24)

| Command | Exit |
| --- | --- |
| `pnpm --filter @tech-deep-dives/efa typecheck` | 0 |
| `pnpm --filter @tech-deep-dives/efa lint` | 0 |
| `pnpm --filter @tech-deep-dives/efa test` | 0 (12 tests) |
| `bash scripts/gates/no-ai-tells.sh` | 0 |
| `bash scripts/gates/svg-a11y.sh` | 0 |
| `bash scripts/gates/pinned-refs.sh` | 0 |
| `bash scripts/gates/pre-overflow.sh` | 0 |
| `bash scripts/audit/verify-citations.sh --dive efa --list` (offline extract only) | 0; all new CodeRefs parsed with repo, ref, path, lines |
