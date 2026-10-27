# Fact check: vLLM section 7 (KV-Cache Offloading & Tiers), commit 45491d4 (remote KV tiers on AWS)

Date: 2026-10-24. Checker: independent adversarial pass. The only file written is this one. Nothing was committed.

Scope: `git show 45491d4 -- deep-dives/vllm/src`, which covers:

- NEW `src/sections/offload/RemoteKvTiersAws.tsx` (two h2 containers, the `AwsRemoteKvPathsDiagram` SVG and its `<title>`, and the remote-tier table)
- small edits in `KVOffloadingLMCache.tsx`
- one cross-link sentence in `AwsGpuEfaNixl.tsx`
- a line-range fix in `DisaggregatedServing.tsx`
- glossary rows in `GlossaryAndSources.tsx`
- the regenerated `sources.md`

Line numbers below refer to the files at 45491d4, which match the working tree. RK = `RemoteKvTiersAws.tsx`, KO = `KVOffloadingLMCache.tsx`.

## Method

- Every cited URL was re-fetched on 2026-10-24. AWS pages were fetched with curl and a generic browser User-Agent, with no contact header.
- GitHub files came from raw.githubusercontent.com at the pinned tag or SHA. Repository trees and tags came from unauthenticated api.github.com.
- PR, issue and comment metadata came from read-only `gh api` calls. No query, header or User-Agent carried personal data.
- PyPI data came from the JSON API.
- The glide-sync 2.6.0rc1 wheel was unzipped into its own directory and grepped. Nothing in it was executed.
- Registers 01 to 03 and the authoring log were used only to find rows, never as evidence.
- Downloads are in `/tmp/fc-vllm/` (not committed).

Gates run read-only on the working tree:

- `no-ai-tells`, `pinned-refs`, `svg-a11y` and `pre-overflow` all PASS.
- `node deep-dives/vllm/revamp/tools/gen-sources.mjs --check` reports "sources.md up to date (698 sources)".

Verdicts:

- HOLDS: the source supports the exact claim and its scope.
- PARTLY: the substance is right, but the scope, the citation or the wording is wrong.
- FAILS: the claim is wrong as rendered.

## Part 1: claim-by-claim verdicts

### A. Edits outside the new file

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| A1 | Intro Alert: "including the remote tiers on AWS (Mooncake Store, the Valkey large-object module, FSx for Lustre and S3) and how their bytes reach the GPU" | KO:425-427 | none (navigational) | HOLDS | The sub-section exists and covers these four. Wording depends on B1. |
| A2 | `kv_connector/factory.py L153-L249`; "the registry, which holds 17 at v0.31.0" | KO:468-476; DisaggregatedServing.tsx:644-650 | factory.py#L153-L249 at v0.31.0 | HOLDS | The file has 249 lines. There are 17 `KVConnectorFactory.register_connector(` calls, from L153 (`ExampleConnector`) to L245-L249 (`HF3FSKVConnector`, closing paren at L249). Note: these two re-ranged cites keep the default `accessed` of 2026-10-16. That is acceptable because the tag cannot change. |
| A3 | "the multiprocess server reaches storage through its own L2 adapter layer behind a host-memory L1, with 21 adapters at v0.5.6, among them `valkey`, `mooncake_store`, `s3` and `sagemaker-hyperpod`" | KO:822-832 | LMCache v0.5.6 `lmcache/v1/distributed/l2_adapters` (tree), kind code | PARTLY (cite) | **Count holds.** `register_l2_adapter_type(` registers exactly 21 type names at v0.5.6: aerospike, bigtable, dax, fault_inject, fs, fs_native, hf3fs, hfbucket, mock, mooncake_store, native_plugin, nixl_native, nixl_store, nixl_store_dynamic, p2p, plugin, raw_block, resp, s3, sagemaker-hyperpod, valkey. **Gap:** a directory listing cannot support "host-memory L1". That is `lmcache/v1/distributed/memory_manager/l1_memory_manager.py` L2 at v0.5.6: "CPU pinned-DRAM L1 memory manager." **Fix:** add that file `#L1-L2` at v0.5.6 as a second cite. Also note that the v0.5.6 `valkey` adapter is TCP only (no `rdma` string in the file), which matters for E6. |
| A4 | "KV that outlives one request and is shared across instances (Mooncake Store over EFA, FSx for Lustre, S3) is a cache tier rather than a transfer, and section 7 (KV-Cache Offloading & Tiers) covers its AWS options." | AwsGpuEfaNixl.tsx:260-262 | none (cross-link) | HOLDS | Section 7 now holds that content (App.tsx L113 title). This closes the sequencing gap that factcheck-silicon D11 found. |

### B. Container 1 prose, caption, diagram and SVG title

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| B1 | "A remote tier holds KV outside the instance that computed it ... AWS offers four: DRAM pooled by Mooncake Store over EFA (Elastic Fabric Adapter), a Valkey node running the large-object module, FSx for Lustre, and S3." | RK:386-389 | none | **FAILS** | **Two of the four are not AWS offerings.** They are open-source projects (kvcache-ai/Mooncake, valkey-io/valkey-large-object) that the reader runs on EC2. The same container says so ("run it self-managed on EC2", RK:578; "pre-release, self-managed", RK:332). **The one AWS-managed KV tier located is missing.** SageMaker HyperPod: "HyperPod now integrates tiered storage as an additional L2 backend option alongside Redis. With the inbuilt SageMaker managed tiered storage ... The integration maintains compatibility with existing vLLM model servers" (docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html, read 2026-10-24) [Tier 1]. The dive covers it in section 25 (AwsSageMakerBedrock.tsx:983-985), and this commit names its LMCache adapter `sagemaker-hyperpod` at KO:824. "Offers four" therefore misattributes two tiers to AWS and states a closed count the research does not support (rule 14). **Fix:** "Four are covered here: two you run on EC2, DRAM pooled by Mooncake Store over EFA (Elastic Fabric Adapter) and a Valkey node running the large-object module, and two managed services, FSx for Lustre and S3. SageMaker HyperPod's managed tiered KV cache, reached through LMCache, is in section 25." |
| B2 | "vLLM's own secondary tiers land in host memory, because only its CPU tier touches GPU memory" | RK:394-398 | tiering/base.py#L130-L159, kind code | HOLDS | L131-L136: "Secondary tiers cannot directly access GPU memory. All data transfers must go through the CPU (primary) tier: Store: GPU → CPU (primary) → secondary ... Load: secondary → CPU (primary) → GPU". |
| B3 | "`MooncakeStoreConnector` registers the GPU KV cache with Mooncake's EFA transport as CUDA memory" | RK:399-407 | mooncake/store/worker.py#L1872-L1892; efa_context.cpp#L534-L592 at v0.3.13.post1, kind code | HOLDS | worker.py: for each KV cache tensor's `untyped_storage()`, `self.store.register_buffer(base_addr, region_len)`. efa_context.cpp: under `USE_CUDA`, `cudaPointerGetAttributes` reports `cudaMemoryTypeDevice`, so `iface = FI_HMEM_CUDA` and `fi_mr_regattr`. The scope is CUDA builds, which the `-efa` and `-efa-cuda13` wheels are. |
| B4 | "GDS on FSx for Lustre moves file data straight to GPU memory, reached through LMCache's GDS backend or Dynamo KVBM (KV Block Manager)". The same KVBM path appears in the table "Lands in" cell, the diagram's green FSx arrow ("LMCache GDS backend or Dynamo KVBM") and the `<title>`. | RK:408-412; RK:168; RK:344-345; RK:253-255 | efa-file-systems.html; (KVBM: Container 2 cites) | PARTLY | **What holds.** The GDS sentence holds: "GDS support builds on EFA ... by enabling direct data transfer between the file system and the GPU memory, bypassing the CPU." LMCache's GDS backend holds (F6). KVBM does move disk blocks straight to device memory: offload.rs L24 at v1.6.0 says "The `DiskTransferManager` is responsible for transfers from host to disk and disk to device", and block/transfer/strategy.rs L30-L34 implements DiskStorage to DeviceStorage as a NIXL Read. **What fails.** The KVBM disk tier is one private file per worker, deleted at exit (F7, cited at RK:646-650). By the container's own definition (RK:386-387: another instance, or the same one after a restart, loads the prefix) that is not a remote tier. The backend serving the transfer was also not traced (RK:646). **Fix:** drop "or Dynamo KVBM" at RK:412, RK:168 and the `<title>`. Relabel RK:345 "LMCache GDS backend (in-process mode)". Container 2's KVBM sentence stays as the reason. |
| B5 | Caption: "Schematic, not to scale. Arrows show loads; stores reverse them. Valkey commands use a separate TCP connection, not drawn." | RK:415-418 | (E2 cites) | HOLDS | README L21-L25 lists the BLOB.* commands, which run on the client's normal Valkey connection. The bytes move over the fabric (E2). |
| B6 | Diagram FSx sub-label "EFA and GDS chosen at creation" | RK:327 | (efa-file-systems.html cited in prose) | PARTLY | **EFA is the create-time choice.** "You can choose to enable EFA when you create a new file system but you cannot enable or disable EFA on an existing file system." The create example sets only `"EfaEnabled": true`. **GDS is not a separate setting.** doc-history.html: "Enabling EFA also provides support for GPUDirect Storage (GDS)". The rest of GDS is client setup (P5/P6 client, GDS driver; configure-efa-clients.html "Install the GDS driver (optional)"). **Fix:** "EFA (and with it GDS) set at creation". |
| B7 | Diagram Valkey box: "Valkey BLOB node on EC2 / large-object module, DRAM + NVMe / pre-release, self-managed" | RK:330-332 | (table cites) | PARTLY (minor) | **NVMe is optional.** The default `operating-mode` is `Dram` (lib.rs L338 at 7510b94; README L9 "**Dram** (default) ... No NVMe"), and NVMe is used only in `Tiered` mode. The table row says this correctly ("optionally NVMe", RK:100). **BLOB is never expanded in the section** (acronym rule). **Fix:** "Valkey large-object node on EC2 / DRAM, optional NVMe". |
| B8 | Diagram Mooncake box: "DRAM lent by client nodes / a master tracks metadata only" | RK:320-322 | (none on the diagram) | HOLDS | mooncake-store.md at v0.3.13.post1: L28, the Master Service "is responsible for object space allocation and metadata maintenance"; L34, "Data transfer is actually from one `Client` to another, bypassing the `Master Service`". vLLM mooncake_store_connector_usage.md L57: "`global_segment_size`: CPU memory contributed to the distributed pool". "Only" reads as "no data path", which is what the source says. |
| B9 | Diagram arrow labels: Mooncake "MooncakeStoreConnector, protocol efa / client posts one-sided fi_write / fi_read"; fs tier "POSIX from the CPU tier / Lustre client over LNet on EFA"; Valkey "server posts fi_writemsg / fi_read / efa-direct; LMCache client unreleased"; S3 "vLLM obj tier (NIXL OBJ) over HTTP / LMCache s3 connector on the AWS CRT"; EFA strip ending above the S3 arrow; legend | RK:339-365 | (C1, C7, C13, C19 cites) | HOLDS | Each label matches the code rows below. "LMCache client unreleased": PR 5556 is open (API, 2026-10-24) and the glide-sync 2.6.0 it needs is not on PyPI (E6). The S3 arrow passing below the EFA strip is correct: S3 is HTTP over ENA. |

### C. The remote-tier table

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| C1 | Mooncake mover: "The client posts one-sided `fi_write` / `fi_read`" | RK:50-53 | efa_context.cpp#L1146-L1158, kind code | HOLDS | `fi_read(shared_ep_, ...)` for READ, else `fi_write(shared_ep_, ...)`. The Store client that issues Put/Get submits them (factcheck-efa row 16). |
| C2 | Mooncake lands: "GPU memory with MooncakeStoreConnector; host memory through LMCache" | RK:58-61 | LMCache v0.5.6 mooncakestore_connector.py#L438-L460, kind code | HOLDS | L436-L452: "# Register CPU buffer for zero-copy operations", then `_register_cpu_buffer`, which registers `allocator.pin_allocator.buffer`. The GPU half is B3. |
| C3 | Mooncake reach: `MooncakeStoreConnector`, `"protocol": "efa"` in the `MOONCAKE_CONFIG_PATH` file (default `rdma`) | RK:66-70 | vllm/distributed/mooncake_store.py#L21-L76, kind code | HOLDS | L57 `protocol=config.get("protocol", "rdma")`; L72 `os.getenv("MOONCAKE_CONFIG_PATH")`. worker.py L68 imports `MooncakeStoreConfig`, L1509 calls `load_from_config()`, and `setup_mooncake_store` passes `config.protocol` to `store.setup` (mooncake_store.py L133-L138). |
| C4 | Mooncake throughput: "Instance limit 3,200 Gbps on p5en.48xlarge; project benchmark 365.66 GB/s at 1 MB blocks (project claim)"; see also D7 | RK:75-83 | ac.html; Mooncake EFA guide#L186-L384 (Tier 2) | PARTLY | **The figures are right but misread.** ac.html lists "p5en.48xlarge ... 3200 Gigabit", and the guide L312 has "block=1MB, threads=16, batch=128 / **365.66 GB/s** / 284.22 GB/s". 365.66 is the *peak write* from Mooncake's `transfer_engine_bench`, GPU to GPU (Transfer Engine, not Store). **It conflicts with the prose.** RK:491 gives "352.59 GB/s at 1 MB on p5en", from the block-size sweep in the same guide (L340). A reader sees two different numbers for "1 MB on p5en". **Fix:** "project's Transfer Engine benchmark: up to 365.66 GB/s GPU-to-GPU write at 1 MB blocks", and in D7 say "in the same benchmark's block-size sweep". |
| C5 | Mooncake latency: "None first-party located" | RK:85 | none | PARTLY | **The cell contradicts Container 2.** For Mooncake the first party is the project, and its EFA guide gives "cold submit #0 (no warmup)" **26 ms** (L443) and same-host per-write latencies (L414-L420). Container 2 quotes the 26 ms (RK:498). **Fix:** "No AWS figure located", the Valkey row's wording. Rename the column header (RK:428) to "Latency (AWS documentation)", since the FSx and S3 cells are AWS docs. |
| C6 | Mooncake maturity: "Released, v0.3.13.post1; EFA only in `-efa` wheels" | RK:88-95 | release page; build_wheel.sh#L264-L291, kind code | HOLDS | Releases API: `v0.3.13.post1`, prerelease false, published 2026-08-31. build_wheel.sh L264-L291 renames the package to `-efa`, `-efa-cuda13` and `-efa-non-cuda` under `EFA_BUILD`, `EFA_CU13_BUILD` and `EFA_NON_CUDA_BUILD`. "Only" also needs the default build to lack EFA; see D2 for the right cite. |
| C7 | Valkey mover: "The server posts `fi_writemsg` / `fi_read` over `efa-direct`" | RK:103-108 | valkey-large-object session.rs#L36-L91 at 7510b94, kind code | PARTLY (cite) | **The substance holds.** session.rs L36-L66 shows the server-side `write` (`Direction::ToPeer`) and `read` (`Direction::FromPeer`) into client memory. **The cite does not name the calls or the provider.** session.rs names neither libfabric call nor the provider. The calls are in the pinned dependency, vdma `crates/dma-libfabric/src/connection.rs` L43-L99 at 72c3a08 (rev in Cargo.toml L17-L18). The provider is `src/transport/config.rs` L8-L19 (`FabricProvider::EfaDirect`; default `EfaDirect` at lib.rs L340). **Fix:** add vdma connection.rs#L43-L99 and src/transport/config.rs#L8-L19 to the cell. |
| C8 | Valkey lands: "Host memory (LMCache's L1)" | RK:110 | (E4) | HOLDS | See E4. |
| C9 | Valkey reach: `LMCacheMPConnector`, `valkey` L2 adapter, `"transport": "rdma"`; open pull request | RK:113-118 | valkey_l2_adapter.py#L80-L81 at 7e5987f, kind code | HOLDS | L80 `TRANSPORTS: tuple[str, ...] = ("tcp", "rdma")`, L81 `DEFAULT_RDMA_PROVIDER: str = "efa-direct"`. PR 5556: state open, head 7e5987f80ada (API, 2026-10-24). `LMCacheMPConnector` is registered at vLLM factory.py L174-L178. |
| C10 | Valkey throughput: "Pull-request author's claim: 197.8 to 198.6 Gbit/s, 16 MiB loads into host memory, two c8gn.16xlarge (200 Gbit/s each)"; see also E8 | RK:122-127 | PR 5556 comment 6304983743 (Tier 2) | PARTLY (minor scope) | The comment's Load table, 16 MiB rows: 1 worker 127.9, 4 workers 197.8, 8 workers 198.3, 16 workers 198.6. The range holds only from 4 workers up. **Fix:** "... 16 MiB loads into host memory with 4 to 16 workers ...". The Tier 2 label and "claim" wording are right. |
| C11 | Valkey latency: "No AWS figure located" | RK:129 | none (scoped absence) | HOLDS | No AWS figure was located in ElastiCache/MemoryDB docs or blogs (E7). The PR author's per-submit p50/p99 exist (Tier 2) and are a backlog item, not an error. |
| C12 | Valkey maturity: "Pre-release: no tags, crate 0.1.0, API experimental until 1.0, client pull requests open" | RK:132-150 | GitHub API tags; Cargo.toml#L1-L7; TSC comment (Tier 2); PR 5556, glide PR 7412 (Tier 2) | HOLDS | Tags API returns `[]`. Cargo.toml L3 has `version = "0.1.0"`. Comment 5766728140 (2026-09-21): "The API will initially be experimental/beta until the module is releasing an 1.0 version". PR 5556 and glide PR 7412 (head 7644df8b) are both open, not merged. |
| C13 | FSx mover: "The Lustre client over LNet (Lustre networking) on EFA or TCP; cuFile on the GDS path" | RK:158-165 | configure-efa-clients.html; LMCache gds_backend.py#L218-L236 | HOLDS | The setup script "Configures TCP and EFA interfaces", and `lnetctl net add --net efa --if device_name`. gds_backend.py L225-L226: "The GDS library to use is controlled by the `gds_backend` config field (default: ``"cufile"``)". |
| C14 | FSx lands: "Host memory with vLLM's fs tier; GPU memory through LMCache's GDS backend or Dynamo KVBM" | RK:168 | (B4) | (counted in B4) | KVBM half: see B4. |
| C15 | FSx reach: `OffloadingConnector`, `TieringOffloadingSpec`, secondary tier `{"type": "fs", "root_dir": "<FSx mount>"}` | RK:171-175 | tiering/factory.py#L150-L172, kind code | HOLDS | factory.py L152-L156 registers `"fs"` and `FileSystemTierManager`. `TieringOffloadingSpec` and `root_dir` are in kv_offloading_usage.md L72-L96. Optional: add that range. |
| C16 | FSx throughput: "100 Gbps over ENA (Elastic Network Adapter), 700 Gbps over EFA, 1,200 Gbps over EFA with GDS" | RK:180-185 | performance.html | PARTLY | **The numbers match, but they are maximums.** The table they come from is headed "Maximum throughput per client, Gbps". Under a column headed "Throughput per client" they read as delivered rates (factcheck-silicon P1, same issue). **The 100 Gbps rows carry a footnote.** "The traffic between an individual client instance and an individual FSx for Lustre object storage server is limited to 5 Gbps." **Fix:** "Up to 100 Gbps over ENA (5 Gbps per storage server), 700 Gbps over EFA, 1,200 Gbps over EFA with GDS". |
| C17 | FSx latency: "Consistent, sub-millisecond latencies for file operations" | RK:189-193 | ssd-storage.html | HOLDS | "Regardless of file system size, Amazon FSx for Lustre provides consistent, sub-millisecond latencies for file operations." |
| C18 | FSx maturity: "Generally available; EFA and GDS since November 27, 2024" | RK:197-201 | doc-history.html | HOLDS | "Support added for EFA ... Enabling EFA also provides support for GPUDirect Storage (GDS) and ENA Express ... November 27, 2024". |
| C19 | S3 mover: "An HTTP client: NIXL's OBJ plugin for vLLM's `obj` tier, the AWS CRT (Common Runtime) in LMCache" | RK:208-213 | LMCache s3_connector.py#L10-L12, kind code | HOLDS | L10 `from awscrt import auth, io, s3`. vLLM obj/manager.py `create_backend("OBJ", params)`. |
| C20 | S3 lands: "Host memory" | RK:215 | (G1) | HOLDS | See G1. |
| C21 | S3 reach: `{"type": "obj"}` with `bucket` and `endpoint_override` | RK:218-223 | tiering/obj/config.py#L8-L46, kind code | HOLDS | L18 `bucket: str` and L19 `endpoint_override: str` are the two required fields. |
| C22 | S3 throughput: "No per-client figure located" | RK:225 | none (scoped absence) | **FAILS** | The page this row already cites for latency (S3: Optimizing performance, RK:233) gives one: "These data lake applications achieve single-instance transfer rates that maximize the network interface use for their Amazon EC2 instance, which can be up to 100 Gb/s on a single instance." The scoped absence is false for the sources read. **Fix:** "Up to 100 Gb/s on a single instance" with the `optimizing-performance.html` cite. |
| C23 | S3 latency: Express One Zone "single-digit millisecond"; Standard "roughly 100-200 milliseconds" | RK:228-235 | directory-bucket-high-performance.html; optimizing-performance.html | HOLDS | "purpose-built to deliver consistent, single-digit millisecond data access"; "consistent small object latencies (and first-byte-out latencies for larger objects) of roughly 100–200 milliseconds". The page's en-dash became a hyphen, which the style rule allows. "Standard" is our label: the page names no storage class for the figure. |
| C24 | S3 maturity: "Generally available" | RK:238 | none | HOLDS | Undisputed; no cite needed (rule 6). |

### D. Container 2: Mooncake Store

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| D1 | "Use `MooncakeStoreConnector`, the cache tier; `MooncakeConnector` is prefill-to-decode transfer, with its own `mooncake_protocol` setting" | RK:451-463 | worker.py#L1022, #L1356; mooncake_connector.py#L968-L981, kind code | HOLDS | L1022 `self.store.batch_put_from_multi_buffers(`; L1356 `self.store.batch_get_into_multi_buffers(`; mooncake_connector.py L968-L970 `kv_connector_extra_config.get("mooncake_protocol", "rdma")`. |
| D2 | "vLLM's KV-connector extras install `mooncake-transfer-engine`, which lacks EFA" | RK:466-473 | requirements/kv_connectors.txt#L1-L8; Mooncake `.github/workflows/release.yaml#L67-L107`, kind code | PARTLY (cite) | **The claim holds.** kv_connectors.txt L8 has `mooncake-transfer-engine >= 0.3.12`. **The second cite points at lines that do not exist.** `release.yaml` at v0.3.13.post1 is 34 lines long. The default wheel is built by `.github/workflows/_build-wheel.yaml`, whose `cmake_args` (L67, L75, L83, L91, L99, L107) never pass `-DUSE_EFA=ON`. `mooncake-common/common.cmake` L100: `option(USE_EFA "option for using AWS EFA transport" OFF)`. Register 02 row M28 carries the same wrong file name. **Fix:** set the href to `${MC}.github/workflows/_build-wheel.yaml#L60-L107`, retitle it "Mooncake _build-wheel.yaml L60-L107", and add `${MC}mooncake-common/common.cmake#L100`. |
| D3 | "Install `mooncake-transfer-engine-efa`" | RK:474 | (none on this clause) | PARTLY (practical) | **This is the CUDA 12 wheel.** release-efa.yaml L8: "Publishes mooncake-transfer-engine-efa, the CUDA 12-aware AWS EFA wheel" (`cuda-version: '12.8.1'`). PyPI summary: "(AWS EFA, CUDA version)". **vLLM defaults to CUDA 13.** vLLM's mooncake_connector_usage.md L13-L15 at v0.31.0: "vLLM defaults to CUDA 13 ... the wrong one fails to import with `libcudart.so.<major>`". kv_connectors.txt L6-L7: the CUDA 13 image swaps to the `-cuda13` variant. **The CUDA 13 EFA wheel exists.** PyPI has `mooncake-transfer-engine-efa-cuda13` 0.3.13.post1 ("AWS EFA, CUDA 13 version"). On the default build the advice installs a wheel that does not import. **Fix:** "Install `mooncake-transfer-engine-efa-cuda13` (`-efa` on a CUDA 12 build)". |
| D4 | "keep the EFA installer's libfabric on the library path" | RK:474-478 | Mooncake EFA guide#L131 | HOLDS | L131: "`auditwheel repair` excludes `libfabric` and `libefa` from the wheel so they resolve to the system EFA installation (`/opt/amazon/efa/lib`) at runtime." |
| D5 | "set `"protocol": "efa"`, absent from vLLM's Mooncake docs" | RK:479-484 | mooncake_store_connector_usage.md#L56 | HOLDS | L56: "`protocol`: Use `"rdma"` for best performance. `"tcp"` works as a fallback." A case-insensitive grep for `efa` in mooncake_store_connector_usage.md and mooncake_connector_usage.md finds only "default". |
| D6 | "**Tune block size first:** one block is one EFA operation" | RK:487-490 | efa_transport.cpp#L990-L998, kind code | PARTLY | **The code says request, not block.** L991-L997: "EFA posts one WR per slice ... a request that stays inside one chunk on both sides still becomes exactly one slice ... a single fi_write/fi_read carries one lkey and one rkey". So one *transfer request* is one EFA operation unless it crosses an MR boundary. **"Block size" names no vLLM setting.** It is the benchmark's `--block_size` (guide L193, L241). Neither this check nor the authoring log traced which vLLM setting sizes `MooncakeStoreConnector`'s per-buffer transfers. **Fix:** "**Size transfers first:** Mooncake posts each transfer request as one EFA operation". Give the benchmark numbers as the benchmark's `--block_size`, and do not imply a vLLM knob. |
| D7 | "The project measured 97.11 GB/s at 64 KB against 352.59 GB/s at 1 MB on p5en (project claim)" | RK:491-495 | Mooncake EFA guide#L186-L384 (Tier 2) | PARTLY (wording) | Numbers hold: L336 "64 KB (default) / 97.11 GB/s", L340 "1 MB (recommended) / 352.59 GB/s". **"Measured" wording.** Both are the Write column of the GPU-to-GPU Transfer Engine sweep (threads=16, batch=128). "Measured" reads a Tier 2 project number as a measurement. It also conflicts with C4. **Fix:** "The project's Transfer Engine benchmark reports 97.11 GB/s GPU-to-GPU write at 64 KB against 352.59 GB/s at 1 MB on p5en". |
| D8 | "**Watch** the first transfer to each new peer, a 26 ms handshake in the project's p5en test; per the Mooncake docs, vLLM skips the warm-up that hides it" | RK:498-503 | Mooncake EFA guide#L435-L458 (Tier 2) | PARTLY (minor) | **The 26 ms is a whole first transfer.** L439-L443: "cold submit #0 (no warmup) / **26 ms**" for a 1 MB write. That is the first transfer *including* the lazy handshake, not the handshake alone. **The vLLM half is confirmed in code.** No `warmup_efa_segment` or `warmupSegment` call appears in any vLLM v0.31.0 Mooncake file (store/worker.py, store/connector.py, store/coordinator.py, store/scheduler.py, mooncake_connector.py, mooncake_utils.py, rdma_utils.py, mooncake_store.py). **Fix:** "a 26 ms first transfer, handshake included, in the project's p5en test; vLLM v0.31.0 never calls the warm-up that hides it". Cite store/worker.py as code and drop "per the Mooncake docs". |
| D9 | "Set `FI_EFA_ENABLE_SHM_TRANSFER=0` where processes on one host exchange GPU buffers" | RK:504-509 | Mooncake EFA guide#L388-L415, **Tier 1, no kind** | **FAILS** | This repeats the error that factcheck-efa row 21 already flagged. **The doc still gives the advice.** L410-L412: "Until libfabric#12328 is fixed, set `FI_EFA_ENABLE_SHM_TRANSFER=0` on such processes". **The code at the same tag carries the fix.** efa_context.cpp L75-L89 adds `\| FI_HMEM` to `hints_->caps` under `USE_CUDA \|\| USE_HIP`, with the comment "without FI_HMEM in caps the SHM sub-provider ... SIGSEGVs ... See https://github.com/ofiwg/libfabric/issues/12328" [Tier 1 code]. **The upstream record confirms it** [Tier 2: project PR and issue]. libfabric issue 12328 closed 2026-06-12. Mooncake PR 2448 "fix(efa): declare FI_HMEM in caps for GPU builds" merged 2026-06-16, before the 2026-08-31 tag, and says it "keeps the fast intra-node SHM path enabled, unlike the `FI_EFA_ENABLE_SHM_TRANSFER=0` workaround". Rendered as current Tier 1 advice, it gives up the same-host shm path for no benefit. **Fix (minimal):** delete the sentence and its cite. **Fix (keeps the value):** "The Mooncake EFA guide still has same-host GPU processes set `FI_EFA_ENABLE_SHM_TRANSFER=0`; at this tag CUDA builds declare `FI_HMEM`, the fix for that crash, so the setting only gives up the same-host shm path", with `kind="doc-code-conflict"` on `efa_context.cpp#L75-L89` next to the doc cite. |

### E. Container 2: the Valkey large-object module

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| E1 | "The module keeps objects in DRAM, or on local NVMe behind a DRAM cache" | RK:516-519 | configs.rs#L21-L24, kind code | PARTLY (cite range) | L21-L24 holds only `pub enum OperatingMode { Dram = 0, Tiered = 1, }`. The meaning is in the doc comment at L16-L18: "Dram (default): all objects live exclusively in DRAMPool. No NVMe. Tiered: objects persist on NVMe, DRAMPool is a read cache with promotion." **Fix:** `#L15-L24`. |
| E2 | "RESP (Redis serialization protocol) commands over TCP carry keys and memory descriptors; the server's NIC moves the bytes, `fi_writemsg` for `BLOB.RDMA_GET`, `fi_read` for `BLOB.RDMA_SET`" | RK:520-526 | vdma connection.rs#L43-L99 at 72c3a08, kind code | HOLDS | L43: "Post an `fi_writemsg`, the `dma.get` direction"; L77: "Post an `fi_read`, the `dma.set` direction". README L22-L24: `BLOB.RDMA_SET key total_len [CRC crc32c] rkey1 addr1 len1 ...` and `BLOB.RDMA_GET key rkey1 addr1 len1 ...` (the descriptors). |
| E3 | "The README promises an "optional EFA RDMA transport to GPU memory"" | RK:529-533 | README#L1-L3, kind doc-code-conflict | HOLDS | L3, verbatim: "... and optional EFA RDMA transport to GPU memory." The conflict marker is correct, since the located clients register host memory (E4). |
| E4 | "and the server writes wherever a client registers, but both clients located register host memory: LMCache's pinned L1 arena, via a glide crate without libfabric's GPU-memory capability" | RK:534-546 | commands/mod.rs#L22-L84; rdma_worker_pool.py#L137-L159 at 7e5987f; glide-rdma endpoint.rs#L756-L785 at 7644df8, all kind code | PARTLY (cites) | **What holds.** mod.rs `parse_efa_addresses` takes client `(rkey, addr, len)` triples. rdma_worker_pool.py L156: `client.register_rdma_region(self._l1_memory)`. **Gap 1, the arena.** The cited range says neither "pinned" nor "host". That is `lmcache/v1/distributed/memory_manager/l1_memory_manager.py` L2 at 7e5987f: "CPU pinned-DRAM L1 memory manager." (the same gap as factcheck-silicon D9). **Gap 2, the glide cite.** L756-L785 shows a plain `fi_mr_reg` with no `iface`. Mooncake's efa_context.cpp L537-L538 notes that the EFA provider's `fi_mr_reg()` "hardcodes iface=FI_HMEM_SYSTEM". The missing *capability* is at L190-L195: `caps = FI_MSG \| FI_RMA \| FI_READ \| FI_WRITE \| FI_REMOTE_READ \| FI_REMOTE_WRITE`, with no `FI_HMEM`. **Gap 3, wording.** "Both clients" is one stack, LMCache over glide-rdma. **Fix:** add `l1_memory_manager.py#L1-L2` at 7e5987f. Extend the glide cite to `#L190-L195` plus `#L756-L785`. Say "the located client stack, LMCache over glide-rdma, registers host memory". |
| E5 | "**Treat a node as a cache you can lose:** no persistence, no replication, and the NVMe directory emptied on every start" | RK:549-557 | lib.rs#L144-L155; tests/test_largeobj_persistence.py#L128-L277, kind code | HOLDS | lib.rs L144-L149: "Reset disk-dir before use (Tiered mode only ...): reclaim any object files a previous run left behind". Two tests in the range: `test_restart_from_an_rdb_with_blobs_starts_and_drops_them` and `test_replica_full_sync_drops_blobs_and_keeps_the_primary`. The TSC comment agrees: "Replication and RDB persistence are open problems." |
| E6 | "vLLM would reach it through `LMCacheMPConnector` and the `valkey` L2 adapter, in open LMCache pull request 5556, which needs `valkey-glide-sync` 2.6.0, unreleased on PyPI on 2026-10-24" | RK:560-569 | rdma_worker_pool.py#L42-L46 at 7e5987f; PyPI JSON | HOLDS | L45-L46 sets `RDMA_MIN_GLIDE_VERSION: str = "2.6.0"`. On PyPI the latest release is 2.5.3 (uploaded 2026-09-25), and 2.6.0rc1 was uploaded 2026-10-16. The rc1 wheel (cp312 manylinux x86_64, unzipped) contains neither `rdma_available` nor `register_rdma_region`, so no published build passes the adapter's feature check (L273-L283). Wording note: the `valkey` adapter itself ships at v0.5.6, TCP only (A3). The PR adds its `rdma` transport. |
| E7 | "No ElastiCache or MemoryDB offering of the module, RDMA or EFA was located in their documentation or the What's New feed on 2026-10-24 ... so run it self-managed on EC2." | RK:570-578 | ElastiCache and MemoryDB engine-versions.html | HOLDS | On the ElastiCache page the only module named is valkey-search (8.2). The MemoryDB page names no module, RDMA or EFA. The hedge keeps its scope. The What's New part has no cite; register V58 lists the posts searched. |
| E8 | Expandable: "Measured by the pull request's author at adapter level, with no engine, between two c8gn.16xlarge in one placement group, each with 200 Gigabit and EFA: 16 MiB loads into host memory reached 197.8 to 198.6 Gbit/s over RDMA against 32.8 to 62.5 Gbit/s over TCP, and 256 KiB loads 63.3 against 40.5 Gbit/s." | RK:580-594 | PR 5556 comment (Tier 2); co.html | PARTLY (minor) | **What holds.** The comment (2026-10-21, author association NONE): "Measured adapter-level with `lmcache bench l2` (no engine, no MP server) between two c8gn.16xlarge in one placement group". co.html lists c8gn.16xlarge at "200 Gigabit" with EFA ✓. **The numbers hold only with worker counts.** 16 MiB RDMA is 197.8, 198.3 and 198.6 at 4, 8 and 16 workers; TCP is 32.8, 62.5 and 59.1. 256 KiB is 63.3 against 40.5 at 16 workers. Without worker counts the ranges overstate (1 worker: 127.9). **"Measured by" opens with a Tier 2 figure read as a measurement.** **Fix:** "Reported by the pull request's author ... with 4 to 16 workers ... and 256 KiB loads, at 16 workers, 63.3 against 40.5 Gbit/s." |

### F. Container 2: FSx for Lustre

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| F1 | "**Choose EFA at creation:** it needs Persistent 2 with a metadata configuration and cannot be added later" | RK:600-605 | efa-file-systems.html | HOLDS | "EFA is supported on Persistent 2 file systems with a metadata configuration specified"; "you cannot enable or disable EFA on an existing file system". |
| F2 | "**vLLM's fs tier takes the 700 Gbps path:** POSIX I/O from the CPU tier, one file per chunk" | RK:608-612 | tiering/fs/io.py#L90-L218, kind code | HOLDS | `_store_block` writes one `dest_path` file per block (`os.open` with `O_DIRECT` by default, then `os.replace`). That is EFA without GDS, whose documented ceiling is 700 Gbps. The next sentence states that no AWS measurement of that ceiling was located. |
| F3 | "Instances share files by content hash" | RK:613-616 | Usage Guide#L168-L196 | HOLDS | L188: "KV cache sharing between multiple vLLM instances using the same `root_dir` ... works by default: `NONE_HASH` ... is derived from a fixed default seed, so identical token content produces identical block filenames across instances." |
| F4 | "and nothing evicts them" | RK:617-620 | Usage Guide#L358 | PARTLY (cite) | **L358 is about something else.** It covers orphaned *run-configuration subdirectories*: "old ones are orphaned but harmless. Delete them to reclaim disk." It says nothing about evicting blocks. **The absence of eviction comes from code.** `tiering/fs/manager.py` has no evict, capacity or quota path (grep). Its constructor takes no capacity argument (fs/manager.py L109-L120, already cited at KO:543-550). `eviction_policy` is the "Primary tier policy" (Usage Guide L106). **Fix:** cite `tiering/fs/manager.py#L109-L120` (kind code) and Usage Guide L106 in place of L358. |
| F5 | "By our arithmetic ... one client fed from disk needs about 91.2 TiB of EFA PERSISTENT-1000 at 700 Gbps and 153.6 TiB at 1,200 Gbps (62.4 TiB when reads hit the servers' cache). No AWS measurement located shows one client at either ceiling." | RK:621-630 | ssd-storage.html; getting-started.html (derived) | PARTLY | **The arithmetic holds.** 700 Gbps = 87,500 MB/s, / 1,000 MBps/TiB = 87.5 TiB, ceil(87.5 / 4.8) = 19, x 4.8 = **91.2**. 150,000 / 1,000 = 150 TiB, 32 x 4.8 = **153.6**. 150,000 / 2,600 = 57.7 TiB, 13 x 4.8 = **62.4**. Inputs: PERSISTENT-1000 network 2600 and disk 1000 MBps/TiB; "increments of 4.8 TiB ... for 1000". **The deciding condition is missing.** The same table gives 27.3 GiB of RAM cache per TiB, so 62.4 TiB holds about 1,704 GiB (1.7 TiB) of cache. A larger hot set is read at "the lower of the network throughput and disk throughput" (performance.html). The silicon dive already carries this condition (factcheck-silicon P9, applied). **Fix:** "(62.4 TiB when reads hit the servers' cache, about 1.7 TiB of RAM at that size)". |
| F6 | "LMCache's GDS backend calls cuFile by default, in LMCache's deprecated in-process mode" | RK:633-641 | gds_backend.py#L218-L357, kind code; gds.rst#L1-L7 | HOLDS | Default `"cufile"` (L225-L226); L318-L325 `if self.gds_backend == "cufile": ... import cufile`. gds.rst L6: "This page documents the behavior of LMCache's in-process mode (deprecated)." |
| F7 | "Dynamo KVBM creates NIXL's GDS_MT backend for its disk tier (we did not trace which backend serves each transfer), but that tier is one private file per worker, deleted when the process exits" | RK:642-650 | Dynamo worker.rs#L94-L114; disk.rs#L398-L470 at v1.6.0, kind code | HOLDS | worker.rs L107-L110: `if use_gds { ... agent.create_backend("GDS_MT", &gds_params)?; }`. L145: `build_agent(worker_id, need_disk)`, so GDS_MT is created whenever a disk tier is configured. disk.rs: `mkostemp` on `dynamo-kvbm-disk-cache-XXXXXX`, and "when this process terminates, the file will be automatically deleted by the OS". The hedge is honest. |
| F8 | "Load nvidia-fs on every GDS client, or reads fall back silently to a CPU bounce buffer" | RK:651-655 | AWS ML Blog, 2026-06-01 (Tier 2) | HOLDS | "If nvidia_fs isn't loaded, GDS reads will silently fall back to the CPU bounce-buffer path." Byline "01 JUN 2026". |
| F9 | "llm-d's fs connector ended at vLLM 0.23, upstreamed as the fs tier without its GDS mode" | RK:656-660 | llmd_fs_backend README#L3-L13 at v1.0.0 | HOLDS | **Sibling error (a) is not repeated.** The connector appears as history, not as a current path. README L4-L8: "**This connector has moved into vLLM.** As of **llm-d v0.8 / vLLM v0.23**, **`llmd-fs-connector==0.23` is the final release** ... upstreamed into vLLM as the FS tier of the multi-tier offloading connector (`TieringOffloadingSpec`)". **"Without its GDS mode" rests on vLLM code, not the README range.** README L107 shows the standalone connector's `gds_mode`; no `gds`, `cufile` or `kvikio` appears in vLLM's tiering/fs/io.py or manager.py. Optional: cite io.py beside it. |
| F10 | "`NixlConnector`'s "GDS" backend only loads a plugin; by our reading the connector registers no files, so it does not make FSx a KV tier." | RK:661-669 | disagg_prefill.md#L24-L28; nixl/base_worker.py#L560-L562, kind code | HOLDS | Labelled as our reading. disagg_prefill.md L27 shows `"backends":["UCX", "GDS"]`. base_worker.py L560-L562 reads `backends` (default `["UCX"]`). L674 builds `nixl_agent_config(backends=self.nixl_backends, ...)`. Memory registration is VRAM or DRAM only (L750-L752, L1822-L1823). Optional: extend the cite to L674 and L1822-L1823, which carry "registers no files" better than L560-L562. |
| F11 | Expandable: AWS Storage Blog frames HBM, host DRAM, FSx for Lustre and S3 as four KV tiers, with no measurement; "100-500 μs" with no stated setup against "consistent, sub-millisecond latencies"; its vLLM "KV Block Manager" is Dynamo's | RK:671-690 | AWS Storage Blog 2026-09-21 (Tier 2); ssd-storage.html; tiering/factory.py#L150-L172 | HOLDS | Byline "21 SEP 2026". The tier table has T1 to T4, and T3 FSx is "100–500 μs", with no source or setup. The framework table reads "vLLM / KV Block Manager for file system offload". The post contains no measurement, only advice to measure (e.g. "Measure KV per token for your model"). The attribution is load-bearing: two sources disagree. |

### G. Container 2: S3

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| G1 | "Every S3 path starts in host memory: vLLM's `obj` tier hands CPU-tier buffers to NIXL's OBJ plugin, whose default S3 engine takes host memory only" | RK:696-704 | tiering/obj/manager.py#L96-L162; NIXL obj/s3/engine_impl.h#L20-L21 at v1.5.0, kind code | HOLDS | manager.py L100: "Handles CPU DRAM <-> S3 transfers only." engine_impl.h L20-L21: `getSupportedMems() const override { return {DRAM_SEG, OBJ_SEG}; }`. The Dell `s3_accel` engine adds `VRAM_SEG` (s3_accel/dell/engine_impl.h L134-L136), but it targets Dell ObjectScale, not Amazon S3. |
| G2 | "Of the engines read at their pinned tags, only LMCache handles S3 Express One Zone explicitly, with `s3_enable_s3express`" | RK:705-709 | LMCache s3_connector.py#L81-L138, kind code | HOLDS | `s3_enable_s3express` selects `auth.AwsSigningAlgorithm.V4_S3EXPRESS`. In NIXL v1.5.0 `src/plugins/obj/` (26 files), "express" appears only in licence text; there is none in vLLM's tiering/obj. |
| G3 | "An FSx data repository association can export to S3 Standard, below vLLM and invisible to it." | RK:710-714 | export-changed-data-meta-dra.html | HOLDS | "All objects created by automatic export and export data repository tasks are written using the S3 Standard storage class." |

### H. Ordering guidance and cross-links

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| H1 | "Our guidance, from the paths above:" five-step order (CPU plus local `fs`; Mooncake Store; FSx with `fs`, GDS backend only if 700 Gbps is the measured limit; S3 `obj`; Valkey once clients ship) | RK:719-739 | (labelled inference) | HOLDS | Labelled as our guidance and built only from cited rows. "(next container)" matches "Start with the CPU tier, then measure", step 4 ("Start with `fs` on local disk ..."). The GDS backend's deprecated mode is stated at RK:638-641. |
| H2 | Flash-tier ladder in "section 9" of Silicon, Memory & Inference; "the Storage Data Paths section" of the EFA dive | RK:740-751 | links | HOLDS | silicon App.tsx L157: `'9. Flash as a Cache Tier for Inference'`; efa App.tsx L52: `'Storage Data Paths: FSx, S3 and the Common Runtime'`. |

### I. Glossary rows (GlossaryAndSources.tsx L207-L214, L267-L268)

| # | Entry | Verdict | Evidence |
| --- | --- | --- | --- |
| I1 | GDS_MT, "NIXL multi-threaded GPUDirect Storage plugin ... that Dynamo KVBM creates for its disk tier, next to POSIX" | HOLDS | NIXL v1.5.0 `src/plugins/cuda_gds/gds_mt_engine.h` (`thread_count_`, `defaultGdsMtThreadCount`); Dynamo worker.rs L107-L112 creates GDS_MT, then POSIX. |
| I2 | cuFile | HOLDS | F6. |
| I3 | HBM | HOLDS | Section 7 expands it at KO:368. |
| I4 | Mooncake Store | HOLDS | B8, C3. |
| I5 | Valkey large-object module | HOLDS | C12, E2, E4 ("located clients" keeps the hedge). |
| I6 | RESP, "Redis Serialization Protocol" | HOLDS | Name only. |
| I7 | LNet, "Lustre Networking" | HOLDS | Name only; C13. |
| I8 | CRT, "AWS Common Runtime" | HOLDS | C19. |
| I9 | FSx description extended ("and, mounted on every instance, a shared KV cache tier") | HOLDS | F3. |
| I10 | S3 Express One Zone, "built for single-digit millisecond access" | HOLDS | C23. |

### J. Pinning, tiers, dates, sources.md

| # | Check | Verdict | Evidence |
| --- | --- | --- | --- |
| J1 | Every new GitHub link is pinned to a tag or full SHA | HOLDS | The 14 new prefixes are all tags (v0.3.13.post1, v0.5.6, v1.0.0, v1.6.0, v1.5.0) or full SHAs (7e5987f..., 7510b94..., 72c3a08..., 7644df8...). valkey-large-object appears only as `blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/`. PR, issue and release pages are not file links. The pinned-refs gate passes. |
| J2 | `accessed="2026-10-24"` on new citations | HOLDS | 76 of 76 new `<Cite` elements carry it. Exception noted in A2 (re-ranged, not new). |
| J3 | Tier labels | HOLDS, except D9 | Project and PR-author numbers are Tier 2 with "(project claim)" (C4, C10, D7, D8, E8). AWS blogs are Tier 2. kind="code" is used for code reads, and kind="doc-code-conflict" for the README (E3). Exception: D9 uses a Tier 1 project doc, without the conflict marker, for advice the code at the tag contradicts. |
| J4 | sources.md regenerated and in sync | HOLDS | `gen-sources.mjs --check`: "sources.md up to date (698 sources)". |

### Tally

83 rows judged. C14 is counted inside B4, and the SVG `<title>` is counted with B4.

- **HOLDS: 61** (A 3, B 5, C 17, D 3, E 5, F 9, G 3, H 2, I 10, J 4)
- **PARTLY: 19**
  - Substance or practice (7): B4 KVBM listed as a remote GPU-landing path; B6 "GDS chosen at creation"; C4 365.66 vs 352.59 at 1 MB; C16 FSx maxima read as throughput; D3 wrong Mooncake wheel for vLLM's default CUDA 13; D6 "block size" names no vLLM knob; F5 62.4 TiB without the 1.7 TiB RAM-cache condition.
  - Wording or scope (6): B7 diagram "DRAM + NVMe" and BLOB; C5 Mooncake latency cell; C10 and E8 worker counts and "Measured by"; D7 "measured"; D8 "26 ms handshake".
  - Citation (6): A3, C7, D2 (dead release.yaml range), E1, E4, F4.
- **FAILS: 3**
  - B1: "AWS offers four", two self-run open-source projects counted as AWS offerings, and HyperPod's managed tier omitted.
  - C22: "No per-client figure located" for S3, when the cited page says up to 100 Gb/s per instance.
  - D9: `FI_EFA_ENABLE_SHM_TRANSFER=0` as current advice; stale at the tag (FI_HMEM fix).

## Part 2: shape, leverage, corrections, cuts, backlog

### Gate 3 score: section 7 (KV-Cache Offloading & Tiers), 6/10

This is scored against `deep-dives/efa/revamp/section-shape-standard.md` and `CLAUDE.md` "Section Shape". **Section 7 is below the Gate 3 floor of 7.** With corrections 1 to 18 below applied, the expected score is 8 [SPECULATIVE: checker's judgment]. The containers that predate 45491d4 were scored only for how they read. Their claims were outside this commit's scope and were not re-checked.

**What earns its place, and should stay**

- **Mental model.** The two questions, "who moves the bytes, and where they land", plus the green (to GPU) and amber (via host) diagram, let a reader place a tier this page never covers. Example: a new connector that registers GPU memory with an RDMA NIC is green, and one that stages through the CPU tier is amber.
- **Practical value.** Container 2 names the setting that matters for each tier: `"protocol": "efa"` and that vLLM's docs omit it, `root_dir` on the FSx mount, `s3_enable_s3express`, nvidia-fs on GDS clients, and EFA chosen at FSx creation.
- **Standard checks that pass.** The h2 descriptions state payoffs. Supporting evidence sits in ExpandableSections (the Valkey pull-request figures, the Storage Blog conflict). The section ends on the reader's next action ("Start with the CPU tier, then measure"). There is no key-takeaways box, and `no-ai-tells` passes.
- **Hedges.** Most keep their scope, for example "No ElastiCache or MemoryDB offering ... was located ... on 2026-10-24".

**What holds the section at 6**

1. **Accuracy fails where the reader acts.** The Mooncake "install, set, watch" block gives two instructions that hurt a reader who follows them:
   - D3: the CUDA 12 `-efa` wheel on vLLM's CUDA 13 default. It fails to import.
   - D9: the `FI_EFA_ENABLE_SHM_TRANSFER=0` workaround, already obsolete at the pinned tag. This is the sibling error that the EFA fact check (factcheck-efa row 21) had already caught.

   The leverage standard: "Losing accuracy fails the pass regardless of the other scores."
2. **Hedge scope breaks in both directions.** "AWS offers four" (B1) states a closed count the research cannot support. "No per-client figure located" (C22) is false for a page the same row cites.
3. **Project numbers are flattened into measurements.** "The project measured" (D7) and "Measured by the pull request's author" (E8) are Tier 2 claims, and the standard forbids reading them as measurements. The same p5en condition at 1 MB shows 365.66 GB/s in the table and 352.59 GB/s in the prose (C4).
4. **Attribution sits in the sentence instead of the link.** "per the Mooncake docs" (D8), where vLLM code carries the claim better.
5. **A definition by negation.** "so it does not make FSx a KV tier" (RK:669).
6. **Repetition without payoff.**
   - The mover and the landing are stated three times: in the prose, the diagram and the table.
   - "The order to add them in", step 1, repeats step 4 of the final container.
   - Section 7 runs to roughly 5,000 words, and this commit adds about 1,340 of them: 136 in Container 1 prose, about 217 in the table, diagram labels, and 813 in Container 2.

### Leverage axes, the two new containers (1 to 5)

The containers are Container 1, "Remote tiers on AWS: who moves the bytes, and where they land", and Container 2, "Choosing a remote tier on AWS".

| Axis | Container 1 | Container 2 | Basis |
| --- | --- | --- | --- |
| Mental model | 4 | 3 | **Container 1:** the two-question model and the diagram are strong, but listing KVBM as a GPU-landing remote path (B4) blurs the container's own definition of "remote". **Container 2** is mostly procedure. Its model is "plan for host memory" and "treat a node as a cache you can lose". |
| Practical leverage | 3 | 3 | **Container 1:** the reach column gives real settings, but the throughput cells read FSx maxima as delivered rates (C16), and S3 shows no figure where one exists (C22). **Container 2:** the right settings are named, but the wheel name (D3) and the SHM advice (D9) would break or slow a deployment, and "block size" names no vLLM setting (D6). Nothing points to the per-tier `vllm:kv_offload_tiering_*` metrics in the final container. |
| Rigor | 3 | 3 | **Both:** every link is pinned and all 76 new cites are dated 2026-10-24. Tier 2 labels are present on project and PR-author figures. **But** six cites do not carry their claim (A3, C7, D2's dead range, E1, E4, F4), and "measured" wording sits on Tier 2 numbers (D7, E8). |
| Accuracy | 3 | 2 | **Container 1:** B1 and C22 FAIL; B4 and C4 are PARTLY. **Container 2:** D9 FAILS and repeats a known error; D3 installs a wheel that does not import on vLLM's default build; D6 maps a benchmark flag to an unnamed vLLM setting. |
| Economy | 3 | 3 | **Container 1:** the mover and landing appear in prose, diagram and table. **Container 2:** 225 words on Valkey, a path the reader cannot use until two client PRs ship (LMCache PR 5556, "valkey L2 adapter RDMA transport", and valkey-glide PR 7412, the RDMA client crate), plus 70 words of FSx side notes on paths that are not remote tiers. |

### Corrections (fix now; no new scope)

Corrections 1 to 4 are required for Gate 3. The rest are needed for 8/10. RK = `deep-dives/vllm/src/sections/offload/RemoteKvTiersAws.tsx`, KO = `KVOffloadingLMCache.tsx`.

1. **D9 (RK:504-509), the shm workaround.** Delete the sentence and its cite. To keep the warning, use the doc-code-conflict form in D9: name the guide's advice, then say CUDA builds at the tag declare `FI_HMEM` (`efa_context.cpp#L75-L89`, `kind="doc-code-conflict"`), so the setting only gives up the same-host shm path.
2. **D3 (RK:474), the wheel.** Replace with "Install `mooncake-transfer-engine-efa-cuda13` (`mooncake-transfer-engine-efa` on a CUDA 12 build)". Cite vLLM `docs/features/mooncake_connector_usage.md#L13-L15` at v0.31.0, which explains why the CUDA major version matters.
3. **B1 (RK:386-389), the "AWS offers four" count.** Replace with: "Four are covered here: two you run on EC2, DRAM pooled by Mooncake Store over EFA (Elastic Fabric Adapter) and a Valkey node running the large-object module, and two managed services, FSx for Lustre and S3. SageMaker HyperPod's managed tiered KV cache, reached through LMCache, is in section 25 (vLLM on SageMaker & vs Bedrock)." Link it by that title (App.tsx L131, id `sagemaker`).
4. **C22 (RK:225), the S3 throughput cell.** Replace with "Up to 100 Gb/s on a single instance", citing `${S3_DOCS}optimizing-performance.html` (Tier 1).
5. **B4, the KVBM path.** Remove "or Dynamo KVBM (KV Block Manager)" from RK:412, RK:168 and the SVG `<title>` at RK:253-255. Relabel RK:345 as "LMCache GDS backend (in-process mode)". Container 2's KVBM sentence, RK:642-650, stays and is the only mention. It explains why KVBM's disk is per-worker. Move the "KVBM (KV Block Manager)" expansion there.
6. **C4 and D7, one benchmark and one wording.**
   - Table cell (RK:79-83): "project's Transfer Engine benchmark: up to 365.66 GB/s GPU-to-GPU write at 1 MB blocks (project claim)".
   - Prose (RK:491-495): "The project's Transfer Engine benchmark reports 97.11 GB/s GPU-to-GPU write at 64 KB against 352.59 GB/s at 1 MB on p5en in its block-size sweep (project claim)".
7. **C16 (RK:180-185), the FSx maximums.** Prefix "Up to" and add "(5 Gbps per storage server)" after the ENA figure. Rename the column header (RK:427) to "Throughput per client (maximum)".
8. **F5 (RK:629), the RAM-cache condition.** Change to "(62.4 TiB when reads hit the servers' cache, about 1.7 TiB of RAM at that size)". The inputs are 27.3 GiB/TiB x 62.4 TiB = 1,704 GiB, from the ssd-storage.html table that is already cited.
9. **D6 (RK:487-490), the block-size step.** Change to "**Size transfers first:** Mooncake posts each transfer request as one EFA operation". Present the 64 KB and 1 MB figures as the benchmark's `--block_size`. Do not imply a vLLM setting until one is traced.
10. **D8 (RK:498-503), the first transfer.** Change to "a 26 ms first transfer, handshake included, in the project's p5en test (project claim); vLLM v0.31.0 never calls the warm-up that hides it". Cite `mooncake/store/worker.py` at v0.31.0, `kind="code"`, and drop "per the Mooncake docs".
11. **C5 (RK:85, header RK:428), the latency column.** Set the Mooncake cell to "No AWS figure located". Rename the header from "Latency (first-party)" to "Latency (AWS documentation)".
12. **C10 (RK:122-127) and E8 (RK:582-593), the worker counts.** Add "with 4 to 16 workers" to the 197.8 to 198.6 and 32.8 to 62.5 ranges, and "at 16 workers" to 63.3 against 40.5. In E8, change "Measured by" to "Reported by".
13. **B6 and B7 (diagram RK:327, RK:330-331).** Use "EFA (and with it GDS) set at creation", and "Valkey large-object node on EC2 / DRAM, optional NVMe".
14. **Acronyms in reading order (RK:344, RK:349, RK:357).** LNet and CRT first appear unexpanded in the diagram, which a reader meets before the table expands them (RK:158, RK:208). Expand both in the caption at RK:415-418: "LNet is Lustre networking; CRT is the AWS Common Runtime." With correction 13, BLOB no longer appears.
15. **Cites that do not carry their claim.**
    - A3, KO:822-832: add `lmcache/v1/distributed/memory_manager/l1_memory_manager.py#L1-L2` at v0.5.6.
    - C7, RK:103-108: add vdma `connection.rs#L43-L99` and valkey-large-object `src/transport/config.rs#L8-L19`.
    - D2, RK:471-473: change the href to Mooncake `.github/workflows/_build-wheel.yaml#L60-L107`, and add `mooncake-common/common.cmake#L100`.
    - E1, RK:517: `configs.rs#L15-L24`.
    - E4, RK:538-545: add `l1_memory_manager.py#L1-L2` at 7e5987f. Extend glide `endpoint.rs` to include `#L190-L195`. Change "both clients located register" to "the located client stack, LMCache over glide-rdma, registers".
    - F4, RK:617-620: replace Usage Guide L358 with `tiering/fs/manager.py#L109-L120` (`kind="code"`) and Usage Guide L106.
    - Optional: C15 add `kv_offloading_usage.md#L72-L96`; F9 add `tiering/fs/io.py`; F10 extend to `base_worker.py#L674` and `#L1822-L1823`.
16. **E6 (RK:560-561), what PR 5556 adds.** LMCache PR 5556 adds the valkey L2 adapter's RDMA transport. Change "the `valkey` L2 adapter, in open LMCache pull request 5556" to "the `valkey` L2 adapter's `rdma` transport, added in open LMCache pull request 5556". The adapter itself ships TCP-only at v0.5.6.
17. **RK:669, a negative definition.** Replace "so it does not make FSx a KV tier" with "it registers only GPU and host memory with NIXL, so FSx files never enter it".
18. **KO:401-402, the stale verification date.** Append "; the remote tiers on AWS were verified on 2026-10-24" to the "Verified against ... on 2026-10-16" note.

### Cuts (to bring the ~1,340 words down)

Word counts come from stripping tags and cites out of the file, so they are approximate. "Main read" means the prose outside ExpandableSections.

| # | Cut | Location | Main-read words | Why it goes |
| --- | --- | --- | --- | --- |
| K1 | Delete "The mover is a client or a server posting RDMA (remote direct memory access), the Lustre client, or an HTTP client." | RK:392-394 | -20 | The table's "Who moves the bytes" column and the diagram arrows say the same thing. It also removes a second RDMA expansion (the first is at KO:559). |
| K2 | Delete the RESP sentence ("RESP ... commands over TCP carry keys and memory descriptors; the server's NIC moves the bytes, `fi_writemsg` for ..."). Move its vdma cite into the table's Valkey mover cell, which also closes C7. Delete the RESP glossary row (GlossaryAndSources.tsx:212); RK:520 is its only use. | RK:520-526 | -30 | This repeats the table cell (RK:103-108) and the diagram arrow (RK:351-353). Op names do not change what the reader sets. |
| K3 | Move the README-versus-clients conflict ("The README promises ... GPU-memory capability") into the existing Valkey evidence expandable. Keep the lead "**Plan for host memory.**" with a one-line reason: the located client stack registers host memory. | RK:528-546 | -35 (demoted) | This is evidence for a conflict. The standard demotes supporting evidence and keeps the argument. |
| K4 | Shrink the Valkey expandable to the 16 MiB RDMA-versus-TCP pair (with the worker counts from correction 12), and drop the 256 KiB pair. | RK:592-593 | -10 (expandable) | One comparison carries the point. |
| K5 | Move the KVBM, llm-d and NixlConnector notes into one ExpandableSection headed "Other FSx paths: per-worker, retired, or plugin-only". Keep the LMCache GDS backend and nvidia-fs sentences in the main read. | RK:642-650, RK:656-669 | -70 (demoted) | None of these is a path the reader should take. Each answers "what about X?", which is what an expandable is for. Correction 5 removes the remaining KVBM mentions from Container 1. |
| K6 | Delete "An FSx data repository association can export to S3 Standard, below vLLM and invisible to it." | RK:710-714 | -17 | It changes nothing the reader sets or sizes in vLLM. |
| K7 | Drop order step 1, and change the lead-in to "Our guidance, after the next container's first tier:". | RK:720-724 | -10 | It repeats step 4 of "Start with the CPU tier, then measure". Keeping "Our guidance" keeps the inference label. |
| K8 | Compress the managed-offering sentence to "No ElastiCache or MemoryDB offering was located in their documentation or What's New on 2026-10-24; run it on EC2." | RK:570-578 | -8 | The scope of the hedge is kept. "of the module, RDMA or EFA" and "self-managed" add nothing once B1 says "two you run on EC2". |

**Net effect [SPECULATIVE: estimate].**

- Taken out of the main read: about 85 words deleted (K1, K2, K6, K7, K8) and about 105 demoted (K3, K5), with 10 more off the expandable (K4).
- Added back by corrections 1, 3, 6, 7, 8, 10 and 12: about 55 words. This assumes the doc-code-conflict form of correction 1; deleting D9 instead saves about 25 more.
- The main read falls from roughly 1,340 to roughly 1,200 words, and the Valkey block from 225 to about 140.

Not cut: the FSx sizing arithmetic (F5), the Storage Blog expandable (F11), and the Mooncake connector disambiguation (D1). Each is either the section's practical payoff or a source conflict already demoted. The Valkey maturity cell keeps its two PR cites, because they are the only cites of those PR pages (RK:145, RK:148).

### Backlog (enhancements; not part of this fix)

- **HyperPod managed tiered KV storage as a row.** It is the one AWS-managed KV tier located. The SageMaker HyperPod model-deployment page reads: "inbuilt SageMaker managed tiered storage", an "additional L2 backend option alongside Redis". Correction 3 only points to section 25. A row would need its mover and landing traced through LMCache's `sagemaker-hyperpod` L2 adapter at v0.5.6.
- **FSx EFA connection budget.** "Each FSx for Lustre file system has a maximum limit of 1024 EFA connections across all client instances", and "Each configured EFA interface on a client instance counts as one connection" (fsx/configure-efa-clients.html, read 2026-10-24). This is a sizing constraint for a fleet mounting one file system: a p5en client with all its EFA interfaces configured uses many connections.
- **EFA shared by storage and GPU-to-GPU traffic.** The AWS Storage Blog post (2026-09-21) raises it. Worth a sentence once a first-party figure for the contention is found.
- **Per-tier monitoring hook in Container 2.** Link each tier to `vllm:kv_offload_tiering_chunk_hits` / `_chunk_queries` per `tier` label and `_backpressure_stores_dropped` (KO:1137-1139).
- **Mooncake same-host versus cross-host cost.** The Mooncake EFA guide L417-L424 reports ~340 ms for a cross-host `put_from` of ~1.2 GiB on p5.48xlarge with one NIC [Tier 2: project claim]. It also notes that same-host loopback through the NIC is slower than that. This could become a Tier 2 latency figure for the Mooncake row.
- **Valkey latency.** The PR author's per-submit p50/p99 figures, in LMCache PR 5556 ("valkey L2 adapter RDMA transport") comment 6304983743 [Tier 2], could fill the latency cell as a labelled claim.
- **LMCache `mooncake_store` L2 adapter registration (register 02, row M36).** The adapter pre-registers L1 only when `protocol` is `rdma`. Check what `efa` does before recommending the LMCache path over EFA.
- **NIXL MOONCAKE plugin (register 02, row M51).** The plugin passes no `protocol`. Check whether `obj` or NIXL-backed Mooncake can use EFA at all.
- **`O_DIRECT` default in vLLM's fs tier on Lustre.** `tiering/fs/io.py` opens with `O_DIRECT` by default. Whether that helps or hurts on an FSx client is untested, and would be a Tier 0 experiment.
- **Dynamo pin consistency.** The NvidiaDynamo section cites Dynamo v1.5.1, while this container cites v1.6.0. Re-pin both together at the next iteration.
- **Register hygiene.** Register 02 row M28 (Mooncake's default wheel lacks EFA) names `release.yaml`; it should be `.github/workflows/_build-wheel.yaml`. The EFA fact check's SHM finding (factcheck-efa row 21) should be in the vLLM authoring checklist, so that the sibling error (b) fact checks are read before drafting.

## Sources read on 2026-10-24, by tier

Project tiers (CLAUDE.md "Fact-Checking & Sources Standard") are mapped to the global labels.

**Tier 0 [AUTHORITATIVE: our own check]**

- The arithmetic in F5 (FSx sizing) and C10/E8 (the worker-count ranges re-read from the comment tables).
- The unzipped `valkey-glide-sync` 2.6.0rc1 wheel, grepped and not executed (E6).
- Grep and count checks on pinned source (A2, A3, D8, G2).

**Tier 1 [AUTHORITATIVE]: AWS documentation**

- FSx for Lustre User Guide: `efa-file-systems.html`, `performance.html`, `ssd-storage.html`, `doc-history.html`, `configure-efa-clients.html`, `getting-started.html`, `export-changed-data-meta-dra.html`.
- Amazon S3 User Guide: `optimizing-performance.html`, `directory-bucket-high-performance.html`.
- EC2 instance specifications: accelerated computing (`ac.html`) and compute optimized (`co.html`).
- ElastiCache and MemoryDB engine-versions pages.
- SageMaker HyperPod model deployment (`sagemaker-hyperpod-model-deployment.html`).

**Tier 1 [AUTHORITATIVE]: source code and project docs at pinned refs**

- **vLLM v0.31.0:**
  - `kv_connector/factory.py`, `kv_offload/tiering/base.py`, `tiering/factory.py`, `tiering/fs/io.py`, `tiering/fs/manager.py`, `tiering/obj/manager.py`, `tiering/obj/config.py`
  - `mooncake/store/worker.py`, `distributed/mooncake_store.py`, `mooncake_connector.py`, `nixl/base_worker.py`
  - `requirements/kv_connectors.txt`
  - docs `kv_offloading_usage.md`, `mooncake_store_connector_usage.md`, `mooncake_connector_usage.md`, `disagg_prefill.md`
- **Mooncake v0.3.13.post1:**
  - `efa_context.cpp`, `efa_transport.cpp`, `scripts/build_wheel.sh`
  - `.github/workflows/_build-wheel.yaml`, `release.yaml`, `release-efa.yaml`, `mooncake-common/common.cmake`
  - `docs/source/design/store/mooncake-store.md`
  - the EFA guide, used for configuration only
- **LMCache:**
  - v0.5.6: `l2_adapters/` (21 types), `l1_memory_manager.py`, `mooncakestore_connector.py`, `s3_connector.py`, `gds_backend.py`, `gds.rst`
  - PR head 7e5987f: `valkey_l2_adapter.py`, `rdma_worker_pool.py`, `l1_memory_manager.py`
- **valkey-large-object 7510b94:** README, `Cargo.toml`, `src/configs.rs`, `src/lib.rs`, `src/commands/mod.rs`, `src/transport/config.rs`, `src/session.rs`, `tests/test_largeobj_persistence.py`.
- **vdma 72c3a08:** `crates/dma-libfabric/src/connection.rs`.
- **valkey-glide 7644df8 (PR 7412 head):** `endpoint.rs`.
- **Dynamo v1.6.0:** `worker.rs`, `disk.rs`, `offload.rs`, `block/transfer/strategy.rs`.
- **NIXL v1.5.0:** `src/plugins/obj/` (26 files), `cuda_gds/gds_mt_engine.h`.
- **llm-d-kv-cache-manager v1.0.0:** `llmd_fs_backend` README.
- **Registry metadata:** GitHub API (Mooncake releases, valkey-large-object tags, PR and issue state); PyPI JSON for `valkey-glide-sync`, `mooncake-transfer-engine-efa` and `mooncake-transfer-engine-efa-cuda13`.

**Tier 2 [AUTHORITATIVE company blogs, read as claims; UNOFFICIAL project and PR-author records]**

- AWS Machine Learning Blog, 2026-06-01 (nvidia-fs fallback).
- AWS Storage Blog, 2026-09-21 (four KV tiers, "100–500 μs").
- Mooncake EFA guide performance tables (365.66, 352.59, 97.11 GB/s; 26 ms; ~340 ms).
- Mooncake PR 2448, "fix(efa): declare FI_HMEM in caps for GPU builds" (merged 2026-06-16).
- libfabric issue 12328, the EFA SHM sub-provider crash without `FI_HMEM` (closed 2026-06-12).
- LMCache PR 5556 (valkey L2 adapter RDMA transport) and its benchmark comment 6304983743 (2026-10-21).
- Valkey core team decision comment 5766728140 (2026-09-21).

**[SPECULATIVE]**

- The Gate 3 and leverage scores.
- The projected 8/10 after the fixes.
- The net word estimate.
- The "by our reading" interpretations already labelled in the page (F10, H1).

## Applied

Date: 2026-10-24. Corrections pass (phase 1), before the leverage pass. Line numbers are in the working tree at the end of phase 1; the leverage pass (`leverage-vllm.md`) moves them again. RK = `src/sections/offload/RemoteKvTiersAws.tsx`, KO = `src/sections/KVOffloadingLMCache.tsx`. Every changed or widened citation was re-read on 2026-10-24 at its pinned tag or SHA, through raw.githubusercontent.com and unauthenticated api.github.com, with a generic User-Agent and no personal data. Downloads are in `/tmp/rk-verify/` (not committed).

### Part 1 rows

- **A3**: added `l1_memory_manager.py#L1-L2` at v0.5.6 ("CPU pinned-DRAM L1 memory manager.") after "host-memory L1". KO:824-832.
- **B1** (FAILS): replaced "AWS offers four" with "Four are covered here: two AWS services, FSx for Lustre and S3, and two stores you run self-managed on EC2, DRAM pooled by Mooncake Store over EFA (Elastic Fabric Adapter) and a Valkey node running the large-object module." HyperPod is now a pointer only, per the orchestrator ruling: "SageMaker HyperPod's managed tiered KV cache is covered in the flash-tier section (section 9) of Silicon, Memory & Inference", linked to `../silicon-memory-inference/`. It adds no HyperPod fact. RK:405-414.
- **B4 / C14**: dropped "or Dynamo KVBM (KV Block Manager)" from the prose (RK:435), the FSx "Lands in" cell (RK:175) and the SVG `<title>` (RK:268-269). Relabelled the green FSx arrow to "LMCache GDS backend (in-process mode)" (RK:363). The KVBM expansion moved to the only remaining mention (RK:708).
- **B6**: changed the diagram label to "EFA (and with it GDS) set at creation". RK:345.
- **B7**: changed the diagram box to "Valkey large-object node on EC2" / "DRAM, optional NVMe". BLOB no longer appears. RK:348-349. Widths: 31 chars x 7.5 = 233 units at 13px bold, and 37 chars x 6.2 = 229 at 11px, both inside the 268-unit box. The 37-char arrow label spans x 337 to 567, inside the 296 to 600 gap.
- **C4**: changed the table cell to "project's Transfer Engine benchmark: up to 365.66 GB/s GPU-to-GPU write at 1 MB blocks" (Tier 2, project claim). RK:79-84.
- **C5**: changed the Mooncake latency cell to "No AWS figure located" (RK:86), and the column header to "Latency (AWS documentation)" (RK:452).
- **C7**: added vdma `connection.rs#L43-L99` at 72c3a08 and valkey-large-object `src/transport/config.rs#L8-L19` at 7510b94 to the Valkey mover cell. The latter reads "Use EFA hardware, the libfabric efa provider via efa-direct path". RK:106-115.
- **C10**: added "with 4 to 16 workers". RK:129-130.
- **C16**: changed the cell to "Up to 100 Gbps over ENA (Elastic Network Adapter) and 5 Gbps to any one object storage server, 700 Gbps over EFA, 1,200 Gbps over EFA with GDS", and the header to "Throughput per client (maximum)". Re-read performance.html: the table head is "Maximum throughput per client, Gbps", and the footnote is "limited to 5 Gbps". RK:190-191, RK:451.
- **C22** (FAILS): replaced the scoped absence with `"Up to 100 Gb/s on a single instance" for data lake applications that fill the instance's network interface`, citing `optimizing-performance.html` (Tier 1). The sentence was re-read verbatim on 2026-10-24: "These data lake applications achieve single-instance transfer rates that maximize the network interface use for their Amazon EC2 instance, which can be up to 100 Gb/s on a single instance." RK:234-242.
- **D2**: retargeted the dead `release.yaml#L67-L107` cite to `.github/workflows/_build-wheel.yaml#L60-L107`, and added `mooncake-common/common.cmake#L100`. Confirmed: no `USE_EFA` in `_build-wheel.yaml`, and L100 is `option(USE_EFA ... OFF)`. RK:495-500.
- **D3**: changed the install step to "Install `mooncake-transfer-engine-efa-cuda13` (`mooncake-transfer-engine-efa` on a CUDA 12 build), because vLLM defaults to CUDA 13 and a wheel for the other CUDA major fails to import". It cites vLLM `mooncake_connector_usage.md#L13-L15` at v0.31.0 (confirmed: "vLLM defaults to CUDA 13 ... the wrong one fails to import") and PyPI JSON (`mooncake-transfer-engine-efa-cuda13` 0.3.13.post1, "AWS EFA, CUDA 13 version"). RK:501-511.
- **D6**: changed the lead to "**Size transfers first:** Mooncake posts each transfer request as one EFA operation". The 64 KB and 1 MB figures are now the benchmark's `--block_size`. Added "This research did not trace which vLLM setting sizes `MooncakeStoreConnector`'s transfers", so the page implies no vLLM setting. RK:522-534.
- **D7**: changed "The project measured" to "The project's Transfer Engine benchmark reports 97.11 GB/s GPU-to-GPU write ... against 352.59 GB/s at 1 MB on p5en, in its block-size sweep". RK:528-532.
- **D8**: changed the text to "26 ms, handshake included, in the project's p5en test" (Tier 2). Dropped "per the Mooncake docs". The vLLM half is now "no call to the warm-up that pays it in advance appears in vLLM v0.31.0's Mooncake connector code", citing the pinned tree `vllm/tree/v0.31.0/.../kv_connector/v1/mooncake` (kind code). Tier 0 check: all 30 non-test Mooncake files in vLLM v0.31.0 were fetched, including `distributed/mooncake_store.py` and the ec_connector files, and none contains "warm". The cite is the directory rather than `store/worker.py` alone, because one file cannot bear a claim about the connector code. RK:536-546.
- **D9** (FAILS): applied the documentation-versus-code form, per the orchestrator ruling. The text now reads: "The Mooncake EFA guide still has same-host processes that exchange GPU buffers set `FI_EFA_ENABLE_SHM_TRANSFER=0` to avoid a crash [guide], but CUDA builds at this tag declare `FI_HMEM`, the fix for that crash [efa_context.cpp L75-L89, kind doc-code-conflict], so the setting only gives up libfabric's same-host shared-memory path." The doc cite is `#L393-L412`, not the ruling's L410-L411. L410-L411 carries only the advice, while the `{warning}` block from L393 names the segfault, which "to avoid a crash" needs. Evidence: register 02 row M74. RK:546-558.
- **E1**: changed the cite to `configs.rs#L15-L24`, which includes the doc comment "Dram (default) ... No NVMe. Tiered ...". RK:564-566.
- **E4**: in the main read, "the located client stack, LMCache over glide-rdma, registers LMCache's pinned host-memory L1 arena", which adds `l1_memory_manager.py#L1-L2` at 7e5987f (RK:570-579). The glide clause moved to the expandable (K3) as "the glide-rdma endpoint requests no `FI_HMEM`, libfabric's GPU-memory capability, and registers memory with a plain `fi_mr_reg`". It cites `endpoint.rs#L190-L196` (caps without FI_HMEM, plus the `(*hints).caps` assignment; 0 occurrences of FI_HMEM in the file) and `#L756-L785` (RK:614-631). The range is L190-L196, not the report's L190-L195, so that the assignment is included.
- **E6**: changed the text to "the `valkey` L2 adapter's `rdma` transport, added in open LMCache pull request 5556". RK:592-594.
- **E8**: changed "Measured by" to "Reported by". Added "with 4 to 16 workers" before the 16 MiB ranges and "at 16 workers" on the 256 KiB pair. RK:634-646.
- **F4**: replaced Usage Guide L358 with `tiering/fs/manager.py#L109-L120` (kind code) and Usage Guide L106. Tier 0 check: the four files in `tiering/fs/` at v0.31.0 contain no evict, capacity or quota path. Their only `os.remove` calls clean up a probe file, a failed temp write and a corrupt short read. RK:668-676.
- **F5**: added "about 1.7 TiB of RAM at that size" (27.3 GiB/TiB x 62.4 TiB = 1,704 GiB, ssd-storage.html re-read). RK:684-686.
- **F9** (optional): added a `tiering/fs/io.py` cite beside the llm-d README. Tier 0 grep: no gds, cufile or kvikio in `tiering/fs/`. RK:722-724.
- **F10** (optional) with correction 17: see 17 below.
- **C15** (optional): added Usage Guide `#L72-L96` (`TieringOffloadingSpec`, `"type": "fs"`, `root_dir`). RK:183-185.

### Part 2 corrections not covered above

- **14, acronyms in reading order**: the caption now reads "LNet is Lustre Networking; CRT is the AWS Common Runtime." RK:440-441.
- **17, negative definition**: replaced "so it does not make FSx a KV tier" with "by our reading it registers only GPU and host memory with NIXL [base_worker.py L746-L754, L1822-L1823], so FSx files never enter it". L746-L754 maps the KV buffer device to `VRAM` or `DRAM`, and L1822-L1823 is the `register_memory` call. RK:732-740.
- **18, stale verification note**: appended "; the remote tiers on AWS were verified on 2026-10-24". KO:402-404.

### Cuts

- **K1**: deleted "The mover is a client or a server posting RDMA ...". RDMA stays expanded at KO:559, earlier in reading order. RK:418-419.
- **K2**: deleted the RESP sentence. Its vdma cite moved into the table (C7). The RESP glossary row is now unused; see "For the orchestrator". RK:566.
- **K3**: demoted the README-versus-clients conflict into the Valkey expandable, renamed "Evidence: the README's GPU-memory transport, and the module's only throughput figures". The lead "Plan for host memory" keeps a one-line reason (E4). RK:570-579, RK:613-631.
- **K4**: DECLINED. Dropping the 256 KiB pair would delete a sourced number, which the orchestrator's phase 1 rules forbid ("Keep every sourced number"). The pair stays inside the expandable with "at 16 workers".
- **K5**: moved the KVBM, llm-d and NixlConnector notes into a new ExpandableSection, "Other FSx paths: per-worker, retired, or plugin-only". The LMCache GDS backend and nvidia-fs sentences stay in the main read. RK:689-742.
- **K6**: deleted the FSx data repository association sentence and its `export-changed-data-meta-dra.html` cite. RK:778-779.
- **K7**: dropped order step 1. The lead-in is now "Our guidance, once the next container's CPU tier and local `fs` are in place:", which keeps the inference label. RK:788-791.
- **K8**: PARTLY applied. Compressed "the What's New feed" to "What's New", and "self-managed on EC2" to "on EC2" (B1 now says self-managed). "of the module, RDMA or EFA" stays: it names what was searched for, and dropping it would change the hedge's scope. RK:604-611.

### Verification after phase 1

All exit 0: `pnpm --filter @tech-deep-dives/vllm typecheck`, `lint` and `test` (5 of 5), plus `no-ai-tells`, `svg-a11y`, `pinned-refs` and `pre-overflow`. The exception is `gen-sources.mjs --check`, which exits 1 ("sources.md is stale"), as expected after citation changes.

## For the orchestrator

- **Regenerate `sources.md`**: `node deep-dives/vllm/revamp/tools/gen-sources.mjs`. Rows leaving: `FSx: Exporting changes` (export-changed-data-meta-dra.html, K6) and `Mooncake .github/workflows/release.yaml` (D2). Rows arriving: Mooncake `_build-wheel.yaml` and `common.cmake`; vLLM `mooncake_connector_usage.md`, `tiering/fs/manager.py` and the `kv_connector/v1/mooncake` tree; PyPI `mooncake-transfer-engine-efa-cuda13`; valkey-large-object `src/transport/config.rs`; LMCache `l1_memory_manager.py` at v0.5.6 and at 7e5987f; Mooncake EFA guide (same file, new range).
- **GlossaryAndSources.tsx L212**: delete the RESP row (K2). RESP no longer appears anywhere in the dive.
- **Register hygiene (not mine to edit)**: register 02 row M28 still names `release.yaml#L67-L107`. The correct file is `.github/workflows/_build-wheel.yaml#L60-L107` plus `mooncake-common/common.cmake#L100`.
