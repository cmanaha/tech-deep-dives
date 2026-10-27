# Authoring log: vLLM section 7, remote KV tiers on AWS

Written 2026-10-24. Every citation added carries `accessed="2026-10-24"`. vLLM links use `vllmUrl()` (tag v0.31.0). GitHub links are pinned to a tag or SHA. Row ids refer to the registers in this folder: `01-valkey-large-object.md` (V), `02-mooncake-remote-tiers.md` (M), `03-fsx-lustre-kv-tier.md` (F).

Files touched:

- NEW `deep-dives/vllm/src/sections/offload/RemoteKvTiersAws.tsx`, which exports `RemoteKvTiersAws()` (two h2 Containers plus the diagram `AwsRemoteKvPathsDiagram`).
- EDIT `deep-dives/vllm/src/sections/KVOffloadingLMCache.tsx`: the import and render, the intro Alert clause, M31 and M39.

Reader word count, measured from rendered HTML with citation chips removed:

| Part | Words |
|---|---|
| Container 1, including the table | 485 |
| Container 2 | 858 |
| Total | 1,343 |
| The comparison table | 283 of the total |
| The two ExpandableSections | 130 of the total |

Running prose outside the table and the expandables is about 930 words. The total is above the 1,100 target. The remaining overage sits in the required seven-column table and the required h3 blocks.

## 1. Claim diff

### KVOffloadingLMCache.tsx

| Change | Claim | Source | Row |
|---|---|---|---|
| Intro Alert | Section now covers remote tiers on AWS (Mooncake Store, Valkey large-object module, FSx for Lustre, S3) and how bytes reach the GPU | navigational, no citation | none |
| M31 | `kv_connector/factory.py` registration range is L153-L249 (was L153-L248), in the caption under the memory-hierarchy diagram | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/factory.py#L153-L249 | M31 |
| M39 | The multiprocess server reaches storage through its own L2 adapter layer behind a host-memory L1, with 21 adapters at v0.5.6, among them `valkey`, `mooncake_store`, `s3`, `sagemaker-hyperpod` | https://github.com/LMCache/LMCache/tree/v0.5.6/lmcache/v1/distributed/l2_adapters | M35, M39 |
| Render | `<RemoteKvTiersAws />` inserted after the break-even container and before "The first tier to enable" | none | none |

### Container 1: "Remote tiers on AWS: who moves the bytes, and where they land"

| Claim | Source | Row |
|---|---|---|
| vLLM secondary tiers land in host memory; only the CPU tier touches GPU memory | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/base.py#L130-L159 | M30, F42 |
| MooncakeStoreConnector registers the GPU KV cache | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/mooncake/store/worker.py#L1872-L1892 | M29 |
| Mooncake's EFA transport registers it as CUDA memory | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L534-L592 | M8 |
| GDS on FSx for Lustre moves file data straight to GPU memory | https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html | F73 |
| vLLM v0.31.0 reaches GDS through LMCache's GDS backend or Dynamo KVBM (no llm-d) | see Container 2, FSx | F46, F47, F54, F55, F80 |
| Caption: Valkey commands use a separate TCP connection | https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/crates/dma-libfabric/src/connection.rs#L43-L99 (cited in Container 2) | V9, V47 |

Table rows:

| Row / column | Claim | Source | Row |
|---|---|---|---|
| Mooncake / mover | Client posts one-sided `fi_write` / `fi_read` | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L1146-L1158 | M9 |
| Mooncake / lands | GPU with MooncakeStoreConnector; host through LMCache | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/connector/mooncakestore_connector.py#L438-L460 | M29, M34 |
| Mooncake / reach | `"protocol": "efa"` in the `MOONCAKE_CONFIG_PATH` file, default `rdma` | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/mooncake_store.py#L21-L76 | M29, M43 |
| Mooncake / throughput | p5en.48xlarge instance limit 3,200 Gbps | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (not in the registers, see section 4) | F66 carries the same figure at Tier 2 |
| Mooncake / throughput | Project benchmark 365.66 GB/s at 1 MB blocks (Tier 2, labelled project claim) | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L186-L384 | M62 |
| Mooncake / latency | None first-party located | scoped absence: the Mooncake EFA guide reports throughput and the handshake only (M62, M63); no AWS latency figure in the sources read (M68) | M62, M63, M68 |
| Mooncake / maturity | Released v0.3.13.post1 | https://github.com/kvcache-ai/Mooncake/releases/tag/v0.3.13.post1 | M1 |
| Mooncake / maturity | EFA only in the `-efa` wheels | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/scripts/build_wheel.sh#L264-L291 | M6 |
| Valkey / mover | Server posts `fi_writemsg` / `fi_read` over `efa-direct` | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/transport/session.rs#L36-L91 | V7, V10 |
| Valkey / lands | Host memory (LMCache's L1) | cited in Container 2 | V43, V49 |
| Valkey / reach | LMCacheMPConnector, `valkey` L2 adapter, `"transport": "rdma"`, open PR | https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/distributed/l2_adapters/valkey_l2_adapter.py#L80-L81 | V42, V44, M35 |
| Valkey / throughput | 197.8 to 198.6 Gbit/s, 16 MiB loads into host memory, two c8gn.16xlarge at 200 Gbit/s (Tier 2, labelled) | https://github.com/LMCache/LMCache/pull/5556#issuecomment-6304983743 | V65 |
| Valkey / latency | No AWS figure located | scoped absence | V58, V65 |
| Valkey / maturity | No tags | https://api.github.com/repos/valkey-io/valkey-large-object/tags | V1 |
| Valkey / maturity | Crate 0.1.0 | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/Cargo.toml#L1-L7 | V1, V3 |
| Valkey / maturity | API experimental until 1.0 (Tier 2) | https://github.com/valkey-io/valkey/issues/4743#issuecomment-5766728140 | V35 to V40 |
| Valkey / maturity | Client pull requests open (Tier 2) | https://github.com/LMCache/LMCache/pull/5556 ; https://github.com/valkey-io/valkey-glide/pull/7412 | V44, V47, V48 |
| FSx / mover | Lustre client over LNet on EFA or TCP | https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html | F73, F19 |
| FSx / mover | cuFile on the GDS path | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/gds_backend.py#L218-L236 | F46 |
| FSx / lands | Host with vLLM's fs tier; GPU through LMCache's GDS backend or Dynamo KVBM | F41/F42 for fs; F46, F55 for GDS | F41, F42, F46, F55, F80 |
| FSx / reach | OffloadingConnector, TieringOffloadingSpec, `{"type": "fs", "root_dir": ...}` | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/factory.py#L150-L172 | F40 |
| FSx / throughput | 100 Gbps ENA, 700 Gbps EFA, 1,200 Gbps EFA with GDS, per client | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | F20 |
| FSx / latency | "Consistent, sub-millisecond latencies for file operations" | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | F31 |
| FSx / maturity | EFA and GDS since November 27, 2024 | https://docs.aws.amazon.com/fsx/latest/LustreGuide/doc-history.html | F38 |
| S3 / mover | HTTP client: NIXL OBJ for vLLM obj tier; AWS CRT in LMCache | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/connector/s3_connector.py#L10-L12 | F44, F50 |
| S3 / reach | `{"type": "obj"}` with `bucket` and `endpoint_override` | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/obj/config.py#L8-L46 | F44 |
| S3 / throughput | No per-client figure located | scoped absence | F53, M49 |
| S3 / latency | Express One Zone "single-digit millisecond" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html | F63 |
| S3 / latency | Standard "roughly 100-200 milliseconds" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html | F64 |

### Container 2: "Choosing a remote tier on AWS"

Mooncake Store:

| Claim | Source | Row |
|---|---|---|
| MooncakeStoreConnector is the cache tier (put/get) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/mooncake/store/worker.py#L1022 and #L1356 | M29 |
| MooncakeConnector is prefill-to-decode, with its own `mooncake_protocol` | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/mooncake/mooncake_connector.py#L968-L981 | M26 |
| KV-connector extras install `mooncake-transfer-engine`, which lacks EFA | https://github.com/vllm-project/vllm/blob/v0.31.0/requirements/kv_connectors.txt#L1-L8 ; https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/.github/workflows/release.yaml#L67-L107 | M28, M47 |
| Keep the EFA installer's libfabric on the library path | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L131 | M12 |
| `"protocol": "efa"` is absent from vLLM's Mooncake docs | https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/mooncake_store_connector_usage.md#L56 | M27 |
| One block is one EFA operation | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_transport.cpp#L990-L998 | M10 |
| 97.11 GB/s at 64 KB vs 352.59 GB/s at 1 MB on p5en (Tier 2, labelled project) | efa_transport.md#L186-L384 | M62 |
| 26 ms first-peer handshake; vLLM skips the warm-up (Tier 2, per the Mooncake docs) | efa_transport.md#L435-L458 | M63 |
| `FI_EFA_ENABLE_SHM_TRANSFER=0` for same-host GPU buffer exchange | efa_transport.md#L388-L415 | M14 |

Valkey large-object module:

| Claim | Source | Row |
|---|---|---|
| DRAM, or local NVMe behind a DRAM cache | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/configs.rs#L21-L24 | V15, V17 |
| RESP over TCP carries keys and descriptors; `fi_writemsg` for `BLOB.RDMA_GET`, `fi_read` for `BLOB.RDMA_SET` | https://github.com/momentohq/vdma/blob/72c3a088fcfd111f21d96cfa43c05ea5bd40ae18/crates/dma-libfabric/src/connection.rs#L43-L99 | V9, V47 |
| README promises "optional EFA RDMA transport to GPU memory" (marked docs vs code) | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/README.md#L1-L3 | V2 |
| Server writes wherever a client registers | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/commands/mod.rs#L22-L84 | V5, V6, V8 |
| LMCache registers its pinned L1 arena (host) | https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L137-L159 | V43 |
| Glide crate registers without libfabric's GPU-memory capability | https://github.com/valkey-io/valkey-glide/blob/7644df8b12ee71c77a219254c98d7cd69282f79c/glide-rdma/src/endpoint.rs#L756-L785 | V49 (code-derived inference; wording kept to what the code shows) |
| No persistence, no replication, NVMe emptied on start | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/lib.rs#L144-L155 ; .../tests/test_largeobj_persistence.py#L128-L277 | V23, V24, V25 |
| Needs `valkey-glide-sync` 2.6.0 | https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L42-L46 | V46 |
| 2.6.0 unreleased on PyPI on 2026-10-24 | https://pypi.org/pypi/valkey-glide-sync/json | V46 |
| Exact hedge: "No ElastiCache or MemoryDB offering of the module, RDMA or EFA was located in their documentation or the What's New feed on 2026-10-24", so run it self-managed on EC2 | https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html ; https://docs.aws.amazon.com/memorydb/latest/devguide/engine-versions.html | V58, V59 |
| Expandable: adapter-level test, no engine, two c8gn.16xlarge in one placement group (Tier 2) | https://github.com/LMCache/LMCache/pull/5556#issuecomment-6304983743 | V65 |
| Expandable: c8gn.16xlarge has 200 Gigabit and EFA | https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html | V65 |
| Expandable: 16 MiB 197.8 to 198.6 Gbit/s RDMA vs 32.8 to 62.5 TCP; 256 KiB 63.3 vs 40.5 (Tier 2) | PR 5556 comment | V65 |

FSx for Lustre:

| Claim | Source | Row |
|---|---|---|
| EFA needs Persistent 2 with a metadata configuration; cannot be added later | https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html | F22, F23 |
| fs tier: POSIX I/O from the CPU tier, one file per chunk (the 700 Gbps path) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/fs/io.py#L90-L218 | F41 |
| Instances share files by content hash; nothing evicts them | https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/kv_offloading_usage.md#L168-L196 and #L358 | F43 |
| Sizing, labelled "by our arithmetic": 91.2 TiB at 700 Gbps, 153.6 TiB at 1,200 Gbps, 62.4 TiB cache-resident at 1,200 Gbps | ssd-storage.html ; getting-started.html | F24, F29 (derived) |
| No AWS measurement located shows one client at either ceiling | scoped absence | F24 |
| LMCache GDS backend calls cuFile by default | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/gds_backend.py#L218-L357 | F46 |
| ...in LMCache's deprecated in-process mode | https://github.com/LMCache/LMCache/blob/v0.5.6/docs/source/kv_cache/storage_backends/gds.rst#L1-L7 | F47 |
| Dynamo KVBM creates NIXL's GDS_MT backend for its disk tier; backend per transfer not traced | https://github.com/ai-dynamo/dynamo/blob/v1.6.0/lib/llm/src/block_manager/distributed/worker.rs#L94-L114 | F55 |
| KVBM disk tier is one private file per worker, deleted at process exit | https://github.com/ai-dynamo/dynamo/blob/v1.6.0/lib/llm/src/block_manager/storage/disk.rs#L398-L470 | F54 |
| Load nvidia-fs on every GDS client, or reads fall back silently to a CPU bounce buffer (Tier 2) | AWS ML Blog 2026-06-01 (turboquant URL) | F66 |
| llm-d's fs connector ended at vLLM 0.23, upstreamed as the fs tier without its GDS mode | https://github.com/llm-d/llm-d-kv-cache/blob/v1.0.0/kv_connectors/llmd_fs_backend/README.md#L3-L13 | F80 (with F41 for "no GDS in the fs tier") |
| NixlConnector's "GDS" backend only loads a plugin; by our reading registers no files | https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/disagg_prefill.md#L24-L28 ; .../nixl/base_worker.py#L560-L562 | F77 |
| Expandable: AWS Storage Blog frames four tiers, no measurement (Tier 2) | https://aws.amazon.com/blogs/storage/accelerate-inference-with-kv-cache-tiering-on-aws/ | F1 |
| Expandable: blog "100-500 μs" has no setup; docs say "consistent, sub-millisecond latencies" | blog ; ssd-storage.html | F10, F31 |
| Expandable: blog's "KV Block Manager" for vLLM is Dynamo's; vLLM's is the fs tier | blog ; tiering/factory.py#L150-L172 | F3, F6, F40 |

S3:

| Claim | Source | Row |
|---|---|---|
| obj tier hands CPU-tier buffers to NIXL's OBJ plugin | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/obj/manager.py#L96-L162 | F42, F44 |
| NIXL's default S3 engine takes host memory only | https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/obj/s3/engine_impl.h#L20-L21 | F53, M48 |
| Only LMCache handles S3 Express One Zone explicitly (`s3_enable_s3express`), of the engines read at pinned tags | https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/connector/s3_connector.py#L81-L138 | F50 |
| FSx data repository association can export to S3, below vLLM | https://docs.aws.amazon.com/fsx/latest/LustreGuide/export-changed-data-meta-dra.html | F39 |

Order and cross-links: our guidance, built from the rows above (labelled "Our guidance"). Cross-links:

- `../silicon-memory-inference/`: section 9, "Flash as a Cache Tier for Inference", the flash-tier ladder.
- `../efa/`: the Storage Data Paths section, which already lists FSx EFA and GDS client instances, the GDS driver and the connection limit.

No second bandwidth ladder.

## 2. Glossary terms to add (GlossaryAndSources.tsx, orchestrator)

Already present: EFA, RDMA, ENA, GDS, KVBM, NIXL.

Missing:

| Acronym / term | Full form | One line | Register |
|---|---|---|---|
| LNet | Lustre networking | The Lustre network layer; on EFA clients it is configured with an `efa` network (`lnetctl net add --net efa`). | F73 (the expansion itself is not in the registers; standard Lustre name) |
| RESP | Redis serialization protocol | The text protocol Valkey and Redis clients speak over TCP; the large-object module's control commands use it. | M2, V9 (the expansion is not in the registers; flag) |
| CRT | AWS Common Runtime | AWS's native S3 client library; LMCache's S3 connector is built on it, and NIXL's OBJ plugin routes large objects to it. | F50, M49 (expansion not in the registers; flag) |
| GDS_MT | NIXL multi-threaded GDS plugin | NIXL backend that Dynamo KVBM creates for its disk tier. | F51, F55 |
| cuFile | (API name) | NVIDIA's GPUDirect Storage file API; LMCache's GDS backend calls it by default. | F46 |
| nvidia-fs | (kernel module) | Kernel module GDS needs on each client; without it GDS reads fall back to a CPU bounce buffer. | F66 |
| Mooncake Store | | Mooncake's distributed KV store that pools DRAM lent by client nodes, moved by its Transfer Engine. | M29 |
| Valkey large-object module | | Valkey module storing large binary objects in DRAM, optionally NVMe, moved by server-posted RDMA over EFA (`BLOB.*` commands); pre-release. | V1, V2 |
| S3 Express One Zone | | Single-zone S3 storage class with "single-digit millisecond" access. | F63 |
| Data repository association | | FSx for Lustre link to an S3 prefix for lazy import and export. | F39 |
| HBM | High-bandwidth memory | Already expanded in the dive text (DecisionGuide.tsx) but not in the glossary. Suggested addition. | none |

## 3. Diagram coordinate rationale (`AwsRemoteKvPathsDiagram`, prefix `rkv-`)

Canvas:

- viewBox `0 0 880 458`, `width: 100%`.
- `minWidth: 680` inside an `overflowX: auto` wrapper, so text stays at least 8.5px effective on a phone.
- Fonts are 11px (sub-labels) and 13px (titles and headers).
- `role="img"` with `<title id="rkv-paths-title">` written as full sentences.

Three columns, with column headers at y=26:

- Instance frame: x12 to 308.
  - HBM box: x28 y48, 200x128, green.
  - Host box: x28 y212, 200x204, amber.
  - "copy to GPU" arrow: x118, from y211 to 180, labelled at (128,198) inside the 36px gap between the boxes.
  - EFA strip: x244 y48, 52x304, slate. It ends at y352, so the S3 arrow at y388 passes below it (S3 is HTTP, not EFA). The Valkey arrow at y304 and the FSx fs-tier arrow at y224 cross it.
- Corridor: x296 to 600, labels centred at x452. Each label pair sits 26px and 12px above its arrow. The widest measured label spans x347 to 557, inside the 304px corridor.
- Tier boxes at x600, width 268. Each box's height is sized to its line count:

  | Box | y | Height |
  |---|---|---|
  | Mooncake | 48 | 72 |
  | FSx | 144 | 100 |
  | Valkey | 268 | 72 |
  | S3 | 360 | 56 |

  The gaps between boxes are 24, 24 and 20px.

Arrows run from x598 to 231 (2px short of each box edge, for marker clearance):

- green (lands in GPU) at y84 (Mooncake) and y164 (FSx GDS)
- amber (lands in host) at y224 (FSx fs tier), y304 (Valkey) and y388 (S3)

FSx has two arrows because it has two landing paths.

The legend sits at y444/448.

Correction applied this pass: the FSx GDS label now reads "LMCache GDS backend or Dynamo KVBM" (was "LMCache GDS backend, llm-d fs backend"). The `<title>` was changed the same way.

Verification (Playwright, headless Chromium, getBBox on the extracted SVG):

- 0 text/text overlaps
- 0 text/line overlaps
- 0 text partially inside a box
- 0 clipped by the viewBox

## 4. Left out, unsourced, or for the orchestrator

Correction from the orchestrator, applied (F80):

- llm-d-kv-cache's `llmd_fs_backend` and its `gds_mode` (F59) are not presented as a GDS path for vLLM v0.31.0. They appear in one clause: the connector ended at vLLM 0.23, upstreamed as the fs tier without its GDS mode. The cite is README L3-L13 at v1.0.0.
- The cites to F59's `worker.py#L442-L468`, `docs/gds.md` and the README range were removed.
- The GDS paths shown are LMCache's GDS backend (F46, deprecated in-process mode F47) and Dynamo KVBM (F55, per-worker and not shared, F54).
- The diagram no longer names llm-d.

Cut for length (sourced, not wrong):

- M36: LMCache `mooncake_store` L2 adapter preregisters L1 only when `protocol` is `rdma`. This is a pitfall for EFA users of that adapter.
- M51: NIXL's MOONCAKE plugin passes no protocol, so by our reading it cannot select EFA.
- M66: an AWS China blog's SGLang run that completed fewer than 25 of 128 requests with Mooncake TE and all 128 with NIXL. It is SGLang, and the instance and versions are unstated.
- M54: Dynamo KVBM object-tier settings are documented but never read in v1.6.0.
- M49: NIXL OBJ CRT throughput target.
- V63: the valkey-benchmark RDMA figure (an open valkey PR).
- F27/F68: FSx EFA 1,024-connection limit.
- F25: GDS client instance list and driver 2.24.2. These are covered by the EFA deep dive's Storage Data Paths, which the section links.
- F43: the `O_DIRECT` probe detail.

URLs not present verbatim in the registers:

- `https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html`, for the p5en.48xlarge 3,200 Gbps figure. This is an AWS doc (Tier 1), read directly on 2026-10-24. F66 carries the same 3,200 Gbps figure at Tier 2 from the AWS ML Blog.
- `https://api.github.com/repos/valkey-io/valkey-large-object/tags`: V1 records `GET .../tags` in abbreviated form.
- `https://github.com/kvcache-ai/Mooncake/releases/tag/v0.3.13.post1`: M1 records the release from the releases API.
- `https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/scripts/build_wheel.sh#L264-L291`: M6 cites "scripts/build_wheel.sh L264-L291" without a URL. Pinned to the same tag.

Unsourced expansions (names, not claims): RESP, LNet, CRT. None of the registers spells them out.

For the orchestrator:

- M31's register location is `DisaggregatedServing.tsx` L646-L649, which is outside my files. I fixed the same stale range in `KVOffloadingLMCache.tsx`, the caption under the memory-hierarchy diagram. The DisaggregatedServing site still needs the L153-L249 change.
- Regenerate `sources.md`. A dry run of the generator into /tmp resolved every cite, with 60 entries from the new file.
- Add the glossary rows in section 2.
