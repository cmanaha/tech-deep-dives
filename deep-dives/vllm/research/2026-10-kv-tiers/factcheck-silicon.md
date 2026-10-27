# Fact check: silicon-memory-inference FlashCacheTier, commit 4f338a1 (AWS remote KV tier rows)

Date: 2026-10-24. Checker: independent adversarial pass, read-only on the repo except this file.

Scope: `git show 4f338a1 -- deep-dives/silicon-memory-inference/src` (FlashCacheTier.tsx, FlashTierLadder.tsx,
sources/FlashCacheTier.ts), against the claim diff in `authoring-silicon.md`. Line numbers below are for the
files at 4f338a1 (identical to the working tree for these three files).

Method: every cited URL re-fetched on 2026-10-24. AWS pages with curl and a generic browser User-Agent, no
contact header. GitHub files from raw.githubusercontent.com at the pinned tag or SHA; repository metadata from
unauthenticated api.github.com (no token, no account). PyPI JSON API for the Mooncake wheel names. Registers
01 to 03 were used only to locate rows, never as evidence. Downloads in `/tmp/fc-silicon/` (not committed).

Static gates run on the working tree: no-ai-tells, pinned-refs, svg-a11y, pre-overflow all PASS.

## Part 1: claim-by-claim verdicts

Verdicts: HOLDS (source supports the exact claim and scope), PARTLY (substance right, scope / citation /
wording wrong), FAILS (the claim is wrong as rendered).

### FSx for Lustre (ladder rows, notes, "Shared flash on AWS.")

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| P1 | "FSx for Lustre delivers 100 Gb/s to one client without EFA, 700 Gb/s with EFA and 1,200 Gb/s (150 GB/s) with EFA and GDS." | FlashCacheTier.tsx:430-432 | fsxPerformance (performance.html) | PARTLY | Numbers match the table: "Non EFA-enabled / Any / 100 Gbps*", "EFA-enabled / ENA / 100 Gbps*", "EFA-enabled / EFA / 700 Gbps", "EFA-enabled / EFA with GDS / 1200 Gbps", column header "Maximum throughput per client, Gbps". The page gives no setup behind them, and the 100 Gbps rows carry "* The traffic between an individual client instance and an individual FSx for Lustre object storage server is limited to 5 Gbps." "Delivers" turns a documented maximum into a delivered rate (the section's own `fsxPerGpuNote` calls them "documented maximums"). Fix: "FSx for Lustre allows one client up to 100 Gb/s without EFA, 700 Gb/s with EFA and 1,200 Gb/s (150 GB/s) with EFA and GDS." Optionally append the 5 Gb/s per-server cap to `fsxPerGpuNote` (20 servers needed to reach 100 Gb/s without EFA). |
| P2 | 150 GB/s = 1,200 Gb/s / 8 | FlashCacheTier.tsx:431, L23 tierRateNote | derived | HOLDS | 1,200 / 8 = 150. Labelled derived in tierRateNote. |
| P3 | "EFA clients are Nitro v4 or later EFA instances outside the trn2 family" | FlashCacheTier.tsx:432 | fsxEfa (efa-file-systems.html) | HOLDS | Prerequisites: "To access your file system using Elastic Fabric Adapter (EFA): Use Nitro v4 (or higher) EC2 instances that support EFA, excluding the trn2 instance family." |
| P4 | "GDS clients are P5, P5e, P5en, P6-B200 and P6-B300" | FlashCacheTier.tsx:433 | fsxEfa | HOLDS | "To access your file system using GPUDirect Storage (GDS): Use an Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 client instance." The scope fix (list attached to GDS, not to 700 Gb/s) is correct. |
| P5 | "EFA is set only when the file system is created" | FlashCacheTier.tsx:433-434 | fsxEfa | HOLDS | Considerations: "You can choose to enable EFA when you create a new file system but you cannot enable or disable EFA on an existing file system." |
| P6 | "That choice is up to 10.9 GB/s per GPU with EFA or 1.56 without, either side of the 2.1 GB/s break-even in the ladder." | FlashCacheTier.tsx:435-437, note L24-25 | fsxPerformance, derived (fsxPerGpuNote) | PARTLY | Arithmetic holds: 700 / 8 / 8 = 10.94, 100 / 8 / 8 = 1.5625, break-even 327,680 x 8 x 989.5 TFLOPS / 151.8 GFLOPs = 17.09 GB/s per node, 2.14 per GPU. But "that choice" is the create-time EFA choice, and its ceiling is 18.75 GB/s per GPU with GDS on P5/P6, stated one sentence earlier; "up to 10.9 with EFA" understates it. Fix: "That choice sets the ceiling at 10.9 GB/s per GPU with EFA, 18.75 with EFA and GDS, or 1.56 without, either side of the 2.1 GB/s break-even in the ladder." |
| P7 | "an EFA file system at PERSISTENT-1000 grows in 4.8 TiB steps" | FlashCacheTier.tsx:437-439 | fsxGettingStarted (getting-started.html) | PARTLY (minor) | getting-started.html: "For an EFA-enabled, Persistent, SSD deployment type, set this value in increments of 4.8 TiB, 9.6 TiB, 19.2 TiB, and 38.4 TiB for 1000, 500, 250, and 125 MBps/TiB throughput tiers, respectively." That is the creation value. For growth, managing-storage-capacity.html says only "use the increments listed in the Increase storage capacity dialog box". The derivation uses the creation step, so the claim needs no more than that. Fix: "is created in 4.8 TiB steps". |
| P8 | "one GDS client at full rate needs 153.6 TiB when disk-bound (writes, uncached reads)" | FlashCacheTier.tsx:439-440, note L26-27 | fsxSsd, fsxPerformance, derived | HOLDS | ssd-storage.html PERSISTENT-1000: disk throughput baseline "1000" MBps/TiB, no burst. performance.html: "When you write data to your file system, or when you read data that isn't stored on the in-memory cache, file system performance is determined by the lower of the network throughput and disk throughput." 150,000 / 1,000 = 150 TiB; ceil(150 / 4.8) = 32; 32 x 4.8 = 153.6. The linearity and single-client hedge in the note is correctly scoped ("no AWS measurement located in this research"). |
| P9 | "or 62.4 TiB for reads from the servers' memory cache" | FlashCacheTier.tsx:440, note L26-27 | fsxSsd, fsxPerformance, derived | PARTLY | Arithmetic holds: 150,000 / 2,600 = 57.7 TiB; ceil(57.7 / 4.8) = 13; 13 x 4.8 = 62.4. Rule holds: "When you read data that is stored on the file server's in-memory or SSD cache, file system performance is determined by the network throughput." Missing condition that changes the sizing decision: the same table gives PERSISTENT-1000 "27.3" GiB of RAM cache per TiB, so a 62.4 TiB file system has about 62.4 x 27.3 = 1,704 GiB (1.7 TiB) of server memory cache in total. The network-bound size applies only to a hot KV set that fits in that; anything larger is read at the disk rate, 62.4 GB/s at that size. Fix: append to `fsxSizingNote`: "The 62.4 TiB case holds only while the hot set fits the servers' RAM cache, 27.3 GiB per TiB, about 1.7 TiB at that size." and in prose "for reads served from the servers' memory cache (about 1.7 TiB at that size)". |
| P10 | "An AWS Storage Blog post's four-tier framing (HBM, host DRAM, FSx for Lustre, S3) gives FSx 100 to 500 µs without a measurement" | FlashCacheTier.tsx:442-444 | awsStorageKvBlog, kind vendor-claim | HOLDS | Blog (21 SEP 2026) tier table: "T3 / Amazon FSx for Lustre / Petabytes / Hundreds of GBps (aggregate) / 100-500 μs / Fleet-shared KV, prefix cache, cross-node (nearline)", T1 HBM, T2 Host CPU DRAM, T4 Amazon S3. No source, setup or measurement is given for the range. Attribution is load-bearing here (two sources disagree, Tier 2) and the cite is labelled vendor-claim. |
| P11 | "the FSx documentation says only "sub-millisecond"" | FlashCacheTier.tsx:444-446 | fsxSsd | PARTLY | ssd-storage.html: "Regardless of file system size, Amazon FSx for Lustre provides consistent, sub-millisecond latencies for file operations." and "Data: sub-ms" in the P50 column; no microsecond figure on performance.html, efa-file-systems.html or getting-started.html either. But "the FSx documentation says only" is a claim about the whole doc set; register 03 (F31) searched four pages and scoped its own finding as "no Tier 1 counterpart located". Hedge scope strengthened (section-shape rule 14). Fix: "the FSx pages located in this research say only "sub-millisecond"". |
| P12 | Ladder row: FSx for Lustre, "EFA without GDS, 700 Gb/s per client", bar 700 / 64, label "10.9 GB/s" | FlashTierLadder.tsx:63 | caption: fsxPerformance; tierRateNote (derived) | HOLDS | 700 / 64 = 10.9375. Cited in caption ("over EFA alone") and in tierRateNote ("FSx over EFA without GDS 700 Gb/s = 87.5 GB/s, 10.9 per GPU"). |
| P13 | Ladder row: FSx for Lustre, "without EFA, 100 Gb/s per client", bar 100 / 64, label "1.56 GB/s", orange like EBS | FlashTierLadder.tsx:65 | caption: fsxPerformance; tierRateNote | HOLDS | 100 / 64 = 1.5625; EBS 12,500 MB/s / 8 = 1,562.5 MB/s, so "level with EBS" in the title holds for p5en/P6. Same 5 Gb/s per-server footnote as P1 applies (optional note). |
| P14 | Ladder title: "FSx for Lustre clears the 2.1 GB/s per GPU break-even ... only over EFA: 18.75 GB/s with GPUDirect Storage and 10.9 GB/s without it, against 1.56 GB/s without EFA, level with EBS." | FlashTierLadder.tsx:88-95 | (diagram text; caption carries cites) | HOLDS | Every number appears in the caption's cited sources and tierRateNote. Row order (18.75, 10.9, 2.25, 1.5625, 1.56) keeps the ladder monotone. |
| P15 | tierRateNote additions: "FSx over EFA without GDS 700 Gb/s = 87.5 GB/s, 10.9 per GPU; FSx without EFA 100 Gb/s = 12.5 GB/s, 1.56 per GPU" | FlashCacheTier.tsx:23 | derived on ec2AcceleratedSpecs | HOLDS | 700 / 8 = 87.5, / 8 = 10.94; 100 / 8 = 12.5, / 8 = 1.5625. The inputs come from fsxPerformance, which the caption cites beside it. |
| P16 | fsxPerGpuNote: "These are documented maximums; AWS gives no test setup behind them." | FlashCacheTier.tsx:24-25 | fsxPerformance | HOLDS | The table column is "Maximum throughput per client, Gbps"; no file size, I/O size, client count or setup appears on the page. "AWS gives no" is the silence-is-the-claim case for one page that was read in full; acceptable. |
| P17 | Caption: "FSx for Lustre with EFA and GDS (GPUDirect Storage), over EFA alone and without EFA" | FlashCacheTier.tsx:95-96 | fsxPerformance | HOLDS | Same table as P1. |

### Pooled DRAM over EFA (ladder row, caption, "Pooled DRAM on AWS.")

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| D1 | "A pool of peer DRAM rides EFA at 3,200 Gb/s per p5en or p6-b200, 6,400 on p6-b300." | FlashCacheTier.tsx:457-459 | ec2AcceleratedSpecs (ac.html) | HOLDS | Network table: "p5en.48xlarge ... 3200 Gigabit", "p6-b200.48xlarge ... 3200 Gigabit", "p6-b300.48xlarge ... 6400 Gigabit". 3,200 / 64 = 50 GB/s per GPU, the ladder bar. |
| D2 | Ladder row "Peer DRAM over EFA", sub-label "Mooncake Store; pre-release Valkey BLOB", 50 GB/s; caption "Mooncake Store and the Valkey BLOB (binary large object) module, drawn at the EFA line rate" | FlashTierLadder.tsx:61; FlashCacheTier.tsx:96-97 | mooncakeStoreDesign, valkeyLargeObject; rate from ec2AcceleratedSpecs | HOLDS | Bar is the instance line rate and the caption says so. Valkey's default `operating-mode` is `Dram` (register V17, code configs.rs at 7510b94), so "DRAM" fits the default; Cargo.toml describes the crate as "NVMe + EFA storage for KV cache tensors" because Tiered mode adds NVMe. No correction needed. |
| D3 | "Mooncake Store pools DRAM that its clients contribute and moves KV between them with its Transfer Engine" | FlashCacheTier.tsx:459-461 | mooncakeStoreDesign (store/mooncake-store.md#L22-L50 at v0.3.13.post1); mooncakeTransferTask (transfer_task.cpp#L1091-L1110) | HOLDS | Design L33-L34: "As a store server, it hosts a segment of contiguous memory that contributes to the distributed KV cache, making its memory available to other Clients. Data transfer is actually from one Client to another, bypassing the Master Service." transfer_task.cpp L1091 `engine_.openSegment(handle.transport_endpoint_)`, L1110 `submitTransfer(requests)`. Line ranges show what is claimed. |
| D4 | "whose EFA transport registers GPU buffers as CUDA memory" | FlashCacheTier.tsx:461-462 | mooncakeEfaMr (efa_context.cpp#L534-L592) | HOLDS | Under `#if defined(USE_CUDA)`, a pointer that `cudaPointerGetAttributes` reports as `cudaMemoryTypeDevice` gets `iface = FI_HMEM_CUDA` and `fi_mr_regattr`; host memory takes `fi_mr_reg`. Scope is "in CUDA builds", which the `-efa` (CUDA) wheel is. A located client does pass GPU memory: vLLM's MooncakeStoreConnector registers each KV cache tensor (register M29), so the contrast with Valkey's host-memory clients in D9 is like for like. |
| D5 | "ships in the separate `mooncake-transfer-engine-efa` wheels"; cite note "USE_EFA defaults to OFF." | FlashCacheTier.tsx:462-463 | mooncakeEfaBuild (common.cmake#L100); mooncakeEfaWheel (build_wheel.sh#L264-L291) | HOLDS | common.cmake L100: `option(USE_EFA "option for using AWS EFA transport" OFF)`. build_wheel.sh L264-L291 renames the package to `mooncake-transfer-engine-efa`, `-efa-cuda13`, `-efa-non-cuda`. PyPI JSON API on 2026-10-24: all three exist at 0.3.13.post1, so "ships" holds. |
| D6 | "The Valkey BLOB module, `valkey-large-object`, is pre-release, with no tags" | FlashCacheTier.tsx:464-466 | valkeyLargeObject (tree at 7510b94), note "GitHub API on 2026-10-24: no tags and no releases; crate version 0.1.0." | HOLDS | Unauthenticated API on 2026-10-24: `/tags` 0 entries, `/releases` 0 entries, `/commits/main` = 7510b9483d9837bf63b475d4a8e8fa612c65063f (2026-10-22T18:12:58Z). Cargo.toml at that SHA: `version = "0.1.0"`. |
| D7 | "and an API experimental until 1.0" | FlashCacheTier.tsx:465-467 | valkeyAcceptance (issue 4743 comment), Tier 2, kind roadmap | HOLDS | Comment 2026-09-21T20:03:16Z: "In the core team meeting today, we decided to accept it as a repo under the valkey-io organization. The API will initially be experimental/beta until the module is releasing an 1.0 version and commits to maintaining it." Labelled roadmap. |
| D8 | "Its server initiates each RDMA (remote direct memory access) transfer" | FlashCacheTier.tsx:467-468 | valkeyLargeObjectSession (session.rs#L36-L91 at 7510b94) | HOLDS | L36: "DMA write: push `len` bytes at `buf_ptr` into client memory at (rkey, remote_addr)" (`Direction::ToPeer`); L49: "DMA read: pull `len` bytes from client memory ... into `buf_ptr`" (`Direction::FromPeer`). Both are server-side calls into `fabric.transfer`. |
| D9 | "and the clients located in this research register host memory" | FlashCacheTier.tsx:468-469 | lmcacheValkeyPr (rdma_worker_pool.py#L1-L23 at 7e5987f); glideRdma (endpoint.rs#L756-L785 at 7644df8) | PARTLY (citation) | Substance holds. glide-rdma L756-L785 registers with plain `fi_mr_reg` and no HMEM attributes; Mooncake's own comment (efa_context.cpp L537-L538) confirms the EFA provider's `fi_mr_reg` "hardcodes iface=FI_HMEM_SYSTEM". But the LMCache range L1-L23 says only that each worker "registers the whole L1 arena once"; it never says the arena is host memory. That is in `lmcache/v1/distributed/memory_manager/l1_memory_manager.py` L2 at the same SHA: "CPU pinned-DRAM L1 memory manager." Fix: add that file's #L1-L3 at 7e5987f80ada75380c31e92a186106841e999e94 as a second LMCache cite (or extend the record), so the cite can bear "host". Hedge scope ("located in this research") is kept. |
| D10 | "No ElastiCache offering of it was located in this research, which leaves self-managed Valkey on EC2." | FlashCacheTier.tsx:469-471 | elasticacheVersions (engine-versions.html) | HOLDS | Page lists ElastiCache for Valkey 7.2, 7.2.6, 8.0, 8.1, 8.2, 9.0, 9.1; the only module named is valkey-search (8.2). No RDMA, EFA, large-object or customer-module text. Hedge keeps its scope. Source title "(Valkey 7.2.6 to 9.1)" matches. |
| D11 | "The vLLM Inference Engine dive's section 7, KV-Cache Offloading & Tiers, traces each engine's path to these tiers." | FlashCacheTier.tsx:474-476 | vllm App.tsx L113 (title only) | FAILS (at 4f338a1 and at HEAD 82aa4a4; sequencing) | The title holds: `{ id: 'offload', title: '7. KV-Cache Offloading & Tiers' }`. The content is not committed. In both commits section 7 (`KVOffloadingLMCache.tsx`) never mentions FSx or Lustre and names Mooncake and Valkey once, in a backend list (L815). During this check a parallel stream was adding `src/sections/offload/RemoteKvTiersAws.tsx` (untracked) and wiring it into `KVOffloadingLMCache.tsx` (uncommitted, L12 and L1075); its h3 blocks cover Mooncake Store, the Valkey module, FSx and S3. Once that lands, the sentence can be true; it was not verified against that uncommitted content. The sentence also repeats the section-7 pointer at L282-L283. Fix: delete it (minimal; L282 already sends the reader to section 7). Alternative: keep it only in a build that also contains the committed vLLM sub-section, and re-check the wording then. |
| D12 | NIXL sentence moved unchanged from the old "On AWS." paragraph to the end of "Pooled DRAM on AWS." | FlashCacheTier.tsx:471-474 | nixl | HOLDS (content) | Not re-checked: unchanged text. Placement is a Part 2 item: the sentence is about NIXL reaching storage, and it now sits under the pooled-DRAM lead. |

### Connectors on FSx ("Building the tier, in order", step 3) and the section-7 rename

| # | Claim (as rendered) | Location | Cited source | Verdict | Evidence, and minimal correction where needed |
| --- | --- | --- | --- | --- | --- |
| C1a | "On FSx the connector makes the tier shared: vLLM's `fs` tier with every instance on one `root_dir`" | FlashCacheTier.tsx:556-558 | vllmFsTierDoc (kv_offloading_usage.md#L73-L196 at v0.31.0) | HOLDS | Doc L186-L188, "Cross-Process Sharing": "KV cache sharing between multiple vLLM instances using the same `root_dir` (e.g., via a shared PVC) works by default". Scope note the page omits but that is not wrong: sharing needs the same run configuration (same `<model>_<digest>` subdirectory) and, for `xxhash` prefix hashing, the same `PYTHONHASHSEED`. |
| C1b | "LMCache's GDS ... backend" (makes the tier shared) | FlashCacheTier.tsx:558 | lmcacheGds (gds_backend.py#L218-L357 at v0.5.6) | PARTLY (citation range) | Substance holds in code: `contains()` falls back to `_try_to_read_metadata`, which checks `os.path.exists` on the metadata file under every `gds_path` (L531-L545), and an init-time scan loads existing metadata, so a second instance finds files the first wrote. The cited range shows only the class docstring ("GDS-supported remote filesystem") and cuFile driver setup, which cannot bear "shared". Fix: extend the record URL to `#L218-L357` plus `#L531-L560`, or change the range to cover `contains` / `_try_to_read_metadata`. |
| C1c | "or `fs_native` backend" (makes the tier shared) | FlashCacheTier.tsx:558 | lmcacheFsNative (docs mp/l2_storage/fs_native.rst#L1-L80 at v0.5.6) | PARTLY (citation) | The doc supports Lustre fit ("Many worker threads for a parallel filesystem (e.g. GPFS, Lustre)") but says nothing about cross-instance lookup. Code does: `csrc/storage_backends/fs/connector.cpp` L218-L221 at v0.5.6, `do_single_exists` returns `std::filesystem::exists(file_path)`. Fix: add that code range as the cite that bears "shared". |
| C1d | "or llm-d's fs backend." | FlashCacheTier.tsx:558-560 | llmdFsBackend (llm-d-kv-cache llmd_fs_backend/README.md#L15-L35 at v1.0.0) | FAILS | The same README at tag v1.0.0 (822e6dd), L3-L13, directly above the cited range: "This connector has moved into vLLM. As of llm-d v0.8 / vLLM v0.23, `llmd-fs-connector==0.23` is the final release of the standalone llm-d FS connector. The filesystem offloading logic is now upstreamed into vLLM as the FS tier of the multi-tier offloading connector (`TieringOffloadingSpec`) ... This repository remains available for the 0.23 release and earlier". System Requirements, L35: "vLLM version 0.23.x". So it is a frozen connector for vLLM 0.23, superseded by the vLLM `fs` tier that the same sentence already lists, and the dive pins vLLM v0.31.0. The cited range L15-L35 skips the banner, which is how the record came to read "shared-storage offloading spec for vLLM". Fix: delete "or llm-d's fs backend" and the `llmdFsBackend` cite (and its sources.md row, total 493 to 492). If the lineage is worth keeping: "vLLM's `fs` tier (llm-d's fs backend, upstreamed) with every instance on one `root_dir`". Register 03 row F59 should carry the banner too. |
| C2 | "KVBM's disk tier there is one private file per worker process, deleted on exit." | FlashCacheTier.tsx:561-562 | dynamoKvbmDisk (storage/disk.rs#L398-L470 at v1.6.0) | HOLDS | `DiskStorage::new` builds `<DYN_KVBM_DISK_CACHE_DIR>/dynamo-kvbm-disk-cache-XXXXXX` with `mkostemp` and `fallocate`s it; `unlink()` comment: "when this process terminates, the file will be automatically deleted by the OS ... we unlink the file only after we've registered it with NIXL." One file per worker follows from `distributed/worker.rs` L196-L202 at v1.6.0 (one `DiskAllocator`, one `allocate_layout` for G3) with the default `disk_layout_type` `FullyContiguous` (L444-L445). "Deleted on exit" is precise enough: the name is gone once registered, the space is freed when the process closes the fd. |
| R1 | "Section 7, KV-Cache Offloading & Tiers, in the vLLM Inference Engine dive covers how offload works inside the engine." (was "The section KV-Cache Offloading & LMCache") | FlashCacheTier.tsx:282-283 | vllm App.tsx L113 | HOLDS | `{ id: 'offload', title: '7. KV-Cache Offloading & Tiers' }`; the HEAD content of `KVOffloadingLMCache.tsx` does cover vLLM's OffloadingConnector, its tiers and LMCache, so "how offload works inside the engine" holds today. |

### Source records (`sources/FlashCacheTier.ts`) and pinning

| # | Record | Verdict | Evidence |
| --- | --- | --- | --- |
| Q1 | All 16 new code and doc records pinned to a tag (v1.6.0, v0.31.0, v0.5.6, v1.0.0, v0.3.13.post1) or a full SHA (7510b94..., 7e5987f..., 7644df8...) | HOLDS | Every raw fetch at the pinned ref returned 200; llm-d-kv-cache v1.0.0 resolves to 822e6dd9c459632f34f872b4a5094766fbce2663 and valkey-large-object HEAD is still 7510b948. The pinned-refs gate passes. |
| Q2 | Line ranges show what the record titles claim | PARTLY | Hold: mooncakeStoreDesign, mooncakeTransferTask, mooncakeEfaMr, mooncakeEfaBuild, mooncakeEfaWheel, valkeyLargeObjectSession, glideRdma, dynamoKvbmDisk, vllmFsTierDoc. Partial: lmcacheValkeyPr (title says "pinned host L1 arena", range never says host; D9), lmcacheGds and lmcacheFsNative (range cannot bear the "shared" use the prose puts on them; C1b, C1c). Wrong: llmdFsBackend (range skips the "moved into vLLM, final release 0.23" banner; C1d). |
| Q3 | Tier labels | HOLDS | AWS docs and pinned code Tier 1; AWS Storage Blog and the Valkey governance comment Tier 2, cited `vendor-claim` and `roadmap`. No vendor or project number reads as a measurement. Mooncake's p5en benchmark (Tier 2 project claim) was left out, so the 50 GB/s bar is never presented as achieved. |
| Q4 | `sources.md`: total 475 to 493 | HOLDS | 18 rows added, matching the 16 Tier 1 and 2 Tier 2 records. Becomes 492 if C1d's fix removes `llmdFsBackend`. |
| Q5 | Titles: `fsxGettingStarted` "(EFA-enabled Persistent SSD capacity in 4.8 TiB steps at 1,000 MBps/TiB)", `elasticacheVersions` "(Valkey 7.2.6 to 9.1)", `awsStorageKvBlog` "(AWS Storage Blog, 2026-09-21; tiers T1 to T4)", `valkeyAcceptance` "(API experimental until a 1.0 release)" | HOLDS | Each matches the fetched page (blog byline "21 SEP 2026"). |

### Tally

40 rows judged (P1-P17, D1-D12, C1a-C1d, C2, R1, Q1-Q5).

- HOLDS: 29
- PARTLY: 9 (P1 "delivers" for a ceiling; P6 "up to 10.9 with EFA" understates the EFA ceiling; P7 "grows in" for a creation step; P9 62.4 TiB missing the 1.7 TiB RAM-cache condition; P11 "the FSx documentation says only" strengthens a scoped hedge; D9 LMCache cite cannot bear "host"; C1b and C1c cites cannot bear "shared"; Q2 line ranges)
- FAILS: 2 (C1d llm-d's fs backend is a frozen, upstreamed connector for vLLM 0.23; D11 the vLLM section-7 pointer promises content that no commit contains yet)
- Row D12 is HOLDS on content; its placement is a Part 2 item.

## Part 2: Gate 3 quality score, whole FlashCacheTier section

Read against `deep-dives/efa/revamp/section-shape-standard.md`, `leverage-pass-standard.md` and the repo
CLAUDE.md writing rules, from the rendered prose in FlashCacheTier.tsx and the ladder at 4f338a1.

**Gate 3 score: 7 / 10.** At the Gate 3 floor (no section below 7), below the 8 average, so it does not pass
Gate 3 on its own. With corrections 1 to 8 applied I would score it 8.

What holds it up: every h2 description states a payoff ("tell you whether a tier is fast enough before you
buy it", "so you can match each tier to the gap"); the strongest number, about 17 GB/s per node for a dense
70B on Hopper, lands in the intro, an h2 description, the instance-store paragraph and the closing monitor
step; derivations sit in cite notes and supporting evidence in ExpandableSections; the page ends on what to
monitor. The new FSx rows put the create-time EFA choice on either side of the break-even line, a real gain
for the ladder's mental model. No em-dash, en-dash range, curly quote, banned word or changelog voice; the
no-ai-tells gate passes.

What holds it down: two claims that are wrong as rendered (C1d, D11), a sizing figure missing the condition
that decides it (P9), and density. The two AWS paragraphs under "Sharing context across nodes" run 26 and 21
source lines and carry about twenty distinct facts, and the commit added about 277 words against a 250 aim.

### Leverage axes (1 to 5)

| Axis | Score | Reason |
| --- | --- | --- |
| Mental model | 5 | B* as a ratio, the fill clock, "layout sets the I/O size", and a ladder whose dashed line makes every tier a pass or fail. The three FSx rows make the EFA choice visible. |
| Practical leverage | 4 | Per-stack settings, sizing arithmetic, the create-time EFA choice, the `-efa` wheel, KVBM G3 being private on FSx, the counters to watch. Lost a point: one recommended connector is a frozen release for vLLM 0.23 (C1d), and the Valkey internals end without saying what they change for the reader. |
| Rigor | 4 | Pinned refs, tier labels, scoped hedges, derived notes with inputs. Lost a point: three cites cannot bear the words they sit on (D9, C1b, C1c), the llm-d range skips the banner that contradicts the claim, and one hedge widens to "the FSx documentation" (P11). |
| Accuracy | 4 | Two FAILS (C1d, D11) and one decision-changing omission (P9). Returns to 5 with corrections 1 to 3. |
| Economy | 3 | The AWS block is the densest prose on the page; the vLLM section-7 pointer appears twice; a storage sentence (NIXL) sits under the pooled-DRAM lead; a latency conflict sits inline rather than in a disclosure. |

### Corrections (fix now; none adds scope)

Ordered by severity. Locations are FlashCacheTier.tsx unless named.

1. **L558-L560, step 3 (C1d).** Delete "or llm-d's fs backend" and `<Cite s={S.llmdFsBackend} />`; drop the
   record and its sources.md row (total 493 to 492). The README at the pinned tag says the connector moved
   into vLLM as the `fs` tier and its final release targets vLLM 0.23.
2. **L474-L476 (D11).** Delete "The vLLM Inference Engine dive's section 7, KV-Cache Offloading & Tiers,
   traces each engine's path to these tiers." Section 7 holds no such content in any commit yet (the vLLM
   AWS sub-section is uncommitted work in another stream), and L282-L283 already points there. If the
   sentence is kept instead, ship it only together with the committed vLLM sub-section.
3. **L440 and `fsxSizingNote` L26-L27 (P9).** Prose: "or 62.4 TiB for reads served from the servers' memory
   cache, about 1.7 TiB at that size." Note: append "The 62.4 TiB case holds only while the hot set fits the
   servers' RAM cache, 27.3 GiB per TiB of storage (ssd-storage.html)."
4. **L435-L436 (P6).** "That choice sets the ceiling at 10.9 GB/s per GPU with EFA, 18.75 with EFA and GDS,
   or 1.56 without, either side of the 2.1 GB/s break-even in the ladder."
5. **L430 (P1) and the h2 description at L410.** "FSx for Lustre allows one client up to 100 Gb/s without
   EFA, ..."; description: "which AWS service allows up to 150 GB/s into one GPU instance". Both are the
   page's "Maximum throughput per client", and `fsxPerGpuNote` already calls them documented maximums.
6. **L444-L446 (P11).** "the FSx pages located in this research say only "sub-millisecond"" (rule 14).
7. **L438 (P7).** "is created in 4.8 TiB steps" for "grows in 4.8 TiB steps".
8. **sources/FlashCacheTier.ts, cite ranges (D9, C1b, C1c).** `lmcacheValkeyPr`: add
   `lmcache/v1/distributed/memory_manager/l1_memory_manager.py#L1-L3` at 7e5987f ("CPU pinned-DRAM L1 memory
   manager"). `lmcacheGds`: cover `#L531-L560` (`contains` reads metadata from disk). `lmcacheFsNative`: add
   `csrc/storage_backends/fs/connector.cpp#L218-L221` at v0.5.6 (`std::filesystem::exists`).
9. **L464-L465, rule 3 (introduce before dissecting).** The Valkey module gets a status before an identity.
   Minimal: "The Valkey BLOB module, `valkey-large-object`, stores large values such as KV tensors in a Valkey
   server's DRAM, optionally backed by NVMe, with an optional EFA transport; it is pre-release, ..." The
   README at the pinned SHA, already cited as `valkeyLargeObject`, reads: "A Valkey module for storing large
   objects (KV cache tensors, embeddings, blobs) with a tiered DRAM + NVMe architecture, io_uring zero-copy
   I/O, and optional EFA RDMA transport to GPU memory." Its "to GPU memory" is not carried, since the
   located clients register host memory (D9).
10. **L467-L468, rule 2 and economy.** Cut "Its server initiates each RDMA (remote direct memory access)
    transfer, and"; keep "The clients located in this research register host memory." and its cites. The
    initiator detail changes nothing the reader does on this page. Drop `valkeyLargeObjectSession` from this
    sentence (record and sources.md row go if unused elsewhere).
11. **L471-L474, placement.** Move the NIXL sentence ("NIXL reaches storage through the same plugin
    architecture ... the Elastic Fabric Adapter dive covers EFA.") back into "Shared flash on AWS.", after
    the KVBM G4 / NIXL `obj` sentence at L447-L449. It is about storage, not pooled DRAM.
12. **L442-L446, rule 7.** Move the AWS Storage Blog versus FSx documentation latency conflict into an
    ExpandableSection after the paragraph (for example "What AWS says about FSx latency"); the paragraph
    keeps "the FSx pages located in this research say only "sub-millisecond"" if a latency word is wanted
    inline.
13. **L491-L517, rule 11 (pre-existing).** The h2 ends on the CMX disclosure, a roadmap product with no AWS
    offering. Move the CMX ExpandableSection above "Reading a vendor's claim." so the container closes on
    the vendor checklist paragraph.

## Backlog (new scope; not corrections)

- State that FSx over EFA and a peer DRAM pool share one instance's 3,200 Gb/s; the AWS Storage Blog says
  "EFA is shared between compute traffic and storage I/O, so you need to account for both" [Tier 2].
- Mooncake's p5en `transfer_engine_bench` (365.66 GB/s GPU-to-GPU write at 1 MB blocks, 97.11 GB/s at the
  64 KB default; register M62, Tier 2 project claim) to show the peer DRAM bar is reachable and block size
  matters.
- Valkey module limits a reader should plan around: no object survives a restart (V23); replication and RDB
  persistence are "open problems" (issue 4743 comment).
- vLLM's KV-connector extras install the non-EFA Mooncake wheel (M28).
- vLLM's `fs` tier never evicts, so capacity on FSx is an operator job (F43).
- The 5 Gb/s per object storage server cap on non-EFA clients (performance.html footnote) and AWS's
  recommendation to enable EFA above 10 GBps of throughput capacity.
- FSx's trn2 exclusion versus the blog's Trainium-over-EFA promotion path (register 03 open item 9).
- Deep-link `../vllm/` to section 7 once the vLLM AWS sub-section (`RemoteKvTiersAws.tsx`) is committed and
  rendered.
- Register hygiene: register 03 row F59 should quote the llm-d README banner (L3-L13).

## Sources fetched for this check (2026-10-24)

Tier 1, AWS documentation: FSx for Lustre performance.html, efa-file-systems.html, ssd-storage.html,
getting-started.html, managing-storage-capacity.html; ElastiCache engine-versions.html; EC2 accelerated
computing specifications ac.html.

Tier 1, source code and project docs at the pinned ref: Mooncake v0.3.13.post1 (store/mooncake-store.md,
transfer_task.cpp, efa_context.cpp, common.cmake, build_wheel.sh); valkey-large-object 7510b94 (Cargo.toml,
session.rs); LMCache PR head 7e5987f (rdma_worker_pool.py, l1_memory_manager.py); LMCache v0.5.6
(gds_backend.py, mp/l2_storage/fs_native.rst, csrc/storage_backends/fs/connector.cpp); valkey-glide PR head
7644df8 (glide-rdma/src/endpoint.rs); Dynamo v1.6.0 (storage/disk.rs, distributed/worker.rs); vLLM v0.31.0
(docs/features/kv_offloading_usage.md); llm-d-kv-cache v1.0.0 (llmd_fs_backend/README.md). GitHub API:
valkey-large-object tags, releases, HEAD; llm-d-kv-cache tag commit. PyPI JSON API: the three
`mooncake-transfer-engine-efa*` packages.

Tier 2: AWS Storage Blog, "Accelerate inference with KV cache tiering on AWS" (2026-09-21); valkey-io/valkey
issue 4743 comment 5766728140 (2026-09-21).

## Applied

Applied 2026-10-24 by the corrections pass. Line numbers are the working tree after the pass. FT = `deep-dives/silicon-memory-inference/src/sections/FlashCacheTier.tsx`, SRC = `.../src/sources/FlashCacheTier.ts`. Ranges re-fetched at the pinned ref on 2026-10-24 before they were attached.

- C1d (correction 1): deleted "or llm-d's fs backend" and its cite; step 3 now reads "vLLM's `fs` tier with every instance on one `root_dir`, or LMCache's GDS or `fs_native` backend." FT:560-563. Removed the `llmdFsBackend` record (SRC, formerly L222-L228).
- D11 (correction 2): deleted the second section-7 pointer at the end of "Pooled DRAM on AWS." The earlier pointer stays at FT:282-283.
- P9 (correction 3): prose "or 62.4 TiB for reads from the servers' memory cache, about 1.7 TiB at that size." FT:440-441. `fsxSizingNote` gains "The hot set must fit its RAM cache: 62.4 x 27.3 GiB per TiB = 1,704 GiB." FT:26-27 (27.3 GiB of RAM per TiB for PERSISTENT-1000 re-read on ssd-storage.html).
- P6 (correction 4): "That choice puts the per-GPU ceiling at 18.75 GB/s with EFA and GDS, 10.9 with EFA or 1.56 without, either side of the ladder's 2.1 GB/s break-even." FT:435-436. Added "1,200 Gb/s = 18.75 GB/s per GPU" to `fsxPerGpuNote` so the derived cite carries 18.75. FT:24-25.
- P1 (correction 5): "FSx for Lustre allows one client up to 100 Gb/s ..." FT:430; h2 description "which AWS service allows one GPU instance up to 150 GB/s" FT:410.
- P11 (correction 6): "the FSx pages located in this research say only "sub-millisecond"". FT:460-461.
- P7 (correction 7): "is created in 4.8 TiB steps". FT:438.
- D9 (correction 8): new record `lmcacheValkeyL1`, `l1_memory_manager.py#L1-L2` at 7e5987f ("CPU pinned-DRAM L1 memory manager"), cited beside `lmcacheValkeyPr` (SRC:278-284, FT:478). `lmcacheValkeyPr` title changed to what its range says, "each worker registers the whole L1 arena once" (SRC:271-277).
- C1b (correction 8): `lmcacheGds` range changed from L218-L357 to `#L531-L547` (`contains()` falls through to `_try_to_read_metadata`, which checks `os.path.exists` on the metadata file under every `gds_path`); title updated to match. SRC:208-214.
- C1c (correction 8): new record `lmcacheFsNativeExists`, `csrc/storage_backends/fs/connector.cpp#L218-L221` at v0.5.6 (`do_single_exists` returns `std::filesystem::exists`), cited after `lmcacheFsNative` (SRC:222-228, FT:563). `pybind.cpp` L9 at v0.5.6 binds `FSConnector` as `LMCacheFSClient`, the client the fs_native doc names.
- Q2: closed by the D9, C1b, C1c and C1d rows above.
- Correction 9: the Valkey module now gets an identity before its status: "keeps large values such as KV tensors in DRAM, optionally backed by NVMe, with optional EFA transport; it is pre-release, ..." (README L3 and L9-L10 at 7510b94, already cited as `valkeyLargeObject`; "to GPU memory" not carried). FT:473-475.
- Correction 10: cut "Its server initiates each RDMA (remote direct memory access) transfer, and"; the sentence is now "Its clients located in this research register host memory." FT:477. Removed the `valkeyLargeObjectSession` record (unused elsewhere). RDMA no longer appears in this section, so its expansion went with it.
- Correction 11 (D12): moved the NIXL sentence into "Shared flash on AWS." after the KVBM G4 / NIXL `obj` sentence. FT:446-449.
- Correction 12: the AWS Storage Blog versus FSx-pages latency conflict moved into an ExpandableSection "FSx latency figures" after the shared-flash paragraph, both cites and the vendor-claim label kept. FT:456-463.
- Correction 13: moved the CMX ExpandableSection above "Reading a vendor's claim.", so the h2 closes on the vendor checklist. FT:495-505, FT:506.

Declined or left alone:
- P1's optional 5 Gb/s per-server footnote: not applied. The backlog lists it as new scope.
- `FlashTierLadder.tsx`: unchanged. No correction targets it (P12 to P14 HOLD), so geometry and labels are as they were.
- `sources.md` not regenerated (orchestrator's job). The registry total stays at 493: `llmdFsBackend` and `valkeyLargeObjectSession` removed, `lmcacheValkeyL1` and `lmcacheFsNativeExists` added.

Word count (tags and cites stripped): body prose 3,188 before, 3,189 after. Cite notes grew by 16 words, all from the two derivation inputs that corrections 3 and 4 require.

Verification: typecheck 0, lint 0, test 1 (only "keeps sources.md in sync with the registry" fails, 908 of 909 pass), no-ai-tells 0, svg-a11y 0, pinned-refs 0.
