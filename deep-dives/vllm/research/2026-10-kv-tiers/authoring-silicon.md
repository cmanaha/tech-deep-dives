# Authoring log: silicon-memory-inference FlashCacheTier, AWS remote KV tiers (2026-10-24)

Stream: kvtier, wave 1, agent B. Plan: `deep-dives/vllm/revamp/AWS-KV-TIERS-2026-10.md`, section
"silicon-memory-inference: FlashCacheTier". Every citation added or re-verified carries accessed 2026-10-24.

Files changed:
- `deep-dives/silicon-memory-inference/src/components/FlashTierLadder.tsx`
- `deep-dives/silicon-memory-inference/src/sections/FlashCacheTier.tsx`
- `deep-dives/silicon-memory-inference/src/sources/FlashCacheTier.ts`

Re-fetched on 2026-10-24 (no contact headers): FSx `performance.html`, `efa-file-systems.html`,
`ssd-storage.html`, `getting-started.html`; ElastiCache `engine-versions.html`; the AWS Storage Blog post;
raw files at the pinned tag or SHA for every code record below; GitHub API for valkey-large-object tags,
releases and HEAD (0 tags, 0 releases, HEAD still 7510b948) and for the issue 4743 comment.

## 1. Claim diff

Every assertion added or changed. Removed assertions are listed at the end.

### Ladder (`FlashTierLadder.tsx`)

| # | Assertion | Source URL | Register row |
| --- | --- | --- | --- |
| L1 | New row: FSx for Lustre, EFA without GDS, 700 Gb/s per client, drawn at 10.9 GB/s per GPU (derived) | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | F20 |
| L2 | New row: FSx for Lustre without EFA, 100 Gb/s per client, drawn at 1.56 GB/s per GPU (derived), below the 2.1 GB/s break-even, coloured like EBS | same | F20 |
| L3 | Peer DRAM row sub-label: "Mooncake Store; pre-release Valkey BLOB" | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/store/mooncake-store.md#L22-L50 ; https://github.com/valkey-io/valkey-large-object/tree/7510b9483d9837bf63b475d4a8e8fa612c65063f ; https://github.com/valkey-io/valkey/issues/4743#issuecomment-5766728140 | M17, M6; V1, V37 |
| L4 | `<title>`: FSx clears the 2.1 GB/s per GPU break-even only over EFA: 18.75 GB/s with GDS, 10.9 without GDS, 1.56 without EFA, level with EBS; peer DRAM over EFA at 50 GB/s | performance.html; existing ec2 `ac.html` record | F20 |
| L5 | Caption: FSx ceilings with EFA and GDS, over EFA alone and without EFA; "Mooncake Store and the Valkey BLOB (binary large object) module, drawn at the EFA line rate" | performance.html; mooncake-store.md; valkey-large-object tree | F20, M17, V1 |
| L6 | `tierRateNote` gains "FSx over EFA without GDS 700 Gb/s = 87.5 GB/s, 10.9 per GPU; FSx without EFA 100 Gb/s = 12.5 GB/s, 1.56 per GPU" | performance.html | F20 |

### "Sharing context across nodes" (`FlashCacheTier.tsx`)

The former "On AWS." paragraph is split into "Shared flash on AWS." and "Pooled DRAM on AWS."; the NIXL
sentence moved, unchanged, to the end of the second paragraph.

| # | Assertion | Source URL | Register row |
| --- | --- | --- | --- |
| S1 | EFA clients are Nitro v4 or later EFA instances outside the trn2 family | https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html (Prerequisites) | F18 |
| S2 | GDS clients are P5, P5e, P5en, P6-B200 and P6-B300 (scope fix: the list attaches to GDS, not to the 700 Gb/s EFA figure) | same | F18, F25 |
| S3 | EFA is set only when the file system is created ("you cannot enable or disable EFA on an existing file system") | same (Considerations) | F28 |
| S4 | That choice is up to 10.9 GB/s per GPU with EFA or 1.56 without, either side of the 2.1 GB/s break-even in the ladder (derived) | performance.html; existing `breakEvenNote` | F20 |
| S5 | An EFA file system at PERSISTENT-1000 grows in 4.8 TiB steps | https://docs.aws.amazon.com/fsx/latest/LustreGuide/getting-started.html | F29 |
| S6 | One GDS client at full rate needs 153.6 TiB when disk-bound (writes, uncached reads) or 62.4 TiB for reads from the servers' memory cache (derived) | ssd-storage.html (1,000 and 2,600 MBps/TiB); performance.html (which rate binds); getting-started.html (step) | F24, F21, F29 |
| S7 | An AWS Storage Blog post's four-tier framing (HBM, host DRAM, FSx for Lustre, S3) gives FSx 100 to 500 µs without a measurement; the FSx documentation says only "sub-millisecond". Attribution kept: two sources disagree and the blog is Tier 2 (cited `vendor-claim`) | https://aws.amazon.com/blogs/storage/accelerate-inference-with-kv-cache-tiering-on-aws/ ; ssd-storage.html | F1, F10, F31 |
| S8 | "A pool of peer DRAM rides EFA at 3,200 Gb/s per p5en or p6-b200, 6,400 on p6-b300" (wording only; "Mooncake-style" dropped because the pools are now named) | existing `ac.html` record, not re-fetched | (existing) |
| S9 | Mooncake Store pools DRAM that its clients contribute and moves KV between them with its Transfer Engine | mooncake-store.md#L22-L50; https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-store/src/transfer_task.cpp#L1091-L1110 | M17 |
| S10 | Its EFA transport registers GPU buffers as CUDA memory | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp#L534-L592 | M8 |
| S11 | The EFA transport ships in the separate `mooncake-transfer-engine-efa` wheels (cite note: USE_EFA defaults to OFF) | https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/mooncake-common/common.cmake#L100 ; https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/scripts/build_wheel.sh#L264-L291 | M6 |
| S12 | The Valkey BLOB module, `valkey-large-object`, is pre-release, with no tags and an API experimental until 1.0 | valkey-large-object tree at 7510b948 (note: GitHub API, 0 tags, 0 releases, crate 0.1.0); issue 4743 comment (cited `roadmap`, Tier 2) | V1, V37 |
| S13 | Its server initiates each RDMA (remote direct memory access) transfer | https://github.com/valkey-io/valkey-large-object/blob/7510b9483d9837bf63b475d4a8e8fa612c65063f/src/transport/session.rs#L36-L91 | V7 |
| S14 | The clients located in this research register host memory | https://github.com/LMCache/LMCache/blob/7e5987f80ada75380c31e92a186106841e999e94/lmcache/v1/storage_backend/valkey/rdma_worker_pool.py#L1-L23 ; https://github.com/valkey-io/valkey-glide/blob/7644df8b12ee71c77a219254c98d7cd69282f79c/glide-rdma/src/endpoint.rs#L756-L785 | V43, V49 |
| S15 | No ElastiCache offering of it was located in this research, which leaves self-managed Valkey on EC2 (hedge scope kept: "located in this research") | https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html | V58 |
| S16 | Cross-link: the vLLM dive's section 7, "KV-Cache Offloading & Tiers", traces each engine's path to these tiers (`../vllm/`) | `deep-dives/vllm/src/App.tsx` L113 (section title) | plan |

### Elsewhere in `FlashCacheTier.tsx`

| # | Assertion | Source URL | Register row |
| --- | --- | --- | --- |
| S17 | "Turning it into a KV tier": sibling section named by its current title, "Section 7, KV-Cache Offloading & Tiers" (was "KV-Cache Offloading & LMCache") | `deep-dives/vllm/src/App.tsx` L113 | plan |
| C1 | Step 3: on FSx the connector makes the tier shared: vLLM's `fs` tier with every instance on one `root_dir`, LMCache's GDS or `fs_native` backend, or llm-d's fs backend | https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/kv_offloading_usage.md#L73-L196 ; https://github.com/LMCache/LMCache/blob/v0.5.6/lmcache/v1/storage_backend/gds_backend.py#L218-L357 ; https://github.com/LMCache/LMCache/blob/v0.5.6/docs/source/mp/l2_storage/fs_native.rst#L1-L80 ; https://github.com/llm-d/llm-d-kv-cache/blob/v1.0.0/kv_connectors/llmd_fs_backend/README.md#L15-L35 | F40, F43, F46, F48, F59 |
| C2 | Step 3: KVBM's disk tier there is one private file per worker process, deleted on exit | https://github.com/ai-dynamo/dynamo/blob/v1.6.0/lib/llm/src/block_manager/storage/disk.rs#L398-L470 | F54 |

### Removed or narrowed

- "on P5, P5e, P5en, P6-B200 and P6-B300 clients; Trn2 is excluded as an EFA client" attached to all three
  FSx figures: replaced by S1 and S2 (F18 scope).
- "PERSISTENT-1000 provides 1,000 MB/s per TiB, so feeding one client at full rate takes about 150 TiB":
  replaced by S5 and S6 (F24). The 1,000 and 2,600 MBps/TiB inputs now sit in the derived cite note.
- "A Mooncake-style pool of peer DRAM": replaced by S8 and S9.

### Source records (`src/sources/FlashCacheTier.ts`)

Re-dated to 2026-10-24 after re-fetch: `fsxPerformance`, `fsxEfa`, `fsxSsd`. Not re-fetched, left as
they were: `ec2AcceleratedSpecs` and every other existing record.

New, Tier 1: `fsxGettingStarted`, `elasticacheVersions`, `dynamoKvbmDisk`, `vllmFsTierDoc`, `lmcacheGds`,
`lmcacheFsNative`, `llmdFsBackend`, `mooncakeStoreDesign`, `mooncakeTransferTask`, `mooncakeEfaMr`,
`mooncakeEfaBuild`, `mooncakeEfaWheel`, `valkeyLargeObject`, `valkeyLargeObjectSession`, `lmcacheValkeyPr`,
`glideRdma`. New, Tier 2: `awsStorageKvBlog`, `valkeyAcceptance`. All code URLs are pinned to a tag or a
full commit SHA; the two open-PR records are pinned to the PR head SHA named in the register pins.

## 2. Derived numbers and their inputs

| Number | Arithmetic | Inputs |
| --- | --- | --- |
| 10.9 GB/s per GPU | 700 Gb/s / 8 bits / 8 GPUs = 10.94 | F20 (700 Gbps, EFA) |
| 1.56 GB/s per GPU (FSx) | 100 Gb/s / 8 / 8 = 1.5625 | F20 (100 Gbps, non-EFA file system or ENA client) |
| 87.5 GB/s, 12.5 GB/s per instance | 700 / 8; 100 / 8 | F20 |
| 153.6 TiB | 150,000 MB/s / 1,000 MB/s per TiB = 150 TiB, rounded up to 32 x 4.8 TiB | F17 (1,200 Gbps = 150 GB/s), F21 (disk 1,000 MBps/TiB), F29 (4.8 TiB EFA step) |
| 62.4 TiB | 150,000 / 2,600 = 57.7 TiB, rounded up to 13 x 4.8 TiB | F21 (network 2,600 MBps/TiB), F29, performance page rule (cache-resident reads bound by network throughput) |
| 2.1 GB/s per GPU break-even | unchanged, existing `breakEvenNote` | silicon research M1 |

Both sizing figures assume the per-TiB rates add linearly and that one client reaches the 1,200 Gbps
ceiling; the cite note says no AWS measurement located in this research shows either. MB is read as
decimal, as elsewhere in the section (register 03 open item 4 records the MB versus MiB ambiguity).

## 3. Diagram coordinates

- Rows: 9 (was 7). `ROW_H` 44 to 40, `ROW_TOP` 46, so rows end at 406; axis at 412, tick labels at 430,
  legend baseline at 452; `VB_H` 420 to 472 (contract: at or under about 500). Width 860, unchanged.
- In-row offsets for ROW_H 40: name baseline top+17 (13px bold), sub-label top+32 (11px), bar top+8 to
  top+32, bar label and capacity baselines top+25. Same relation to the bar as the old layout (name 9
  units below bar top, sub-label 0 to 1 unit below bar bottom).
- Left column budget: x 16 to BAR_X 270. Longest sub-label "Mooncake Store; pre-release Valkey BLOB",
  39 chars x 6.2 = 242 units, ends at 258 by budget; rendered in Chromium it ends at 225.4. Other new
  sub-labels: "EFA without GDS, 700 Gb/s per client" 36 chars (223 by budget), "without EFA, 100 Gb/s per
  client" 32 chars (198).
- Bar labels: rule changed from a fixed 110-unit threshold to `bar width > label chars x 7 + 16`, which
  keeps every existing row's inside/outside choice and puts "10.9 GB/s" inside its 103.9-unit bar.
  Outside labels start at `max(bar end, break-even x) + 10`, so no label can land on a bar.
- Break-even line at x 302.2; the "10.9 GB/s" label starts at about 311 in the rendered output.
- Rows keep descending bandwidth order (FSx GDS 18.75, FSx EFA 10.9, NVMe 2.25, FSx without EFA 1.56,
  EBS 1.56), so the ladder still reads as a ladder; the three FSx rows share a name and differ in the
  sub-label's first words.
- Colours: green for tiers at or above the break-even, orange for the two below it (FSx without EFA, EBS).
- Rendered check (Playwright Chromium 1.62.1, server-rendered SVG at 1440 and 390 px viewports, 640 px
  min width): no text outside the viewBox, no text-text overlap, inside labels contained in their bars,
  no outside label on a bar, nothing crossing the break-even line, minimum font 11px. Screenshots in
  `/tmp/kvt-silicon-render/` (not committed).

## 4. Left out

- Mooncake's project benchmark on p5en (365.66 GB/s GPU-to-GPU writes at 1 MB blocks, M62, Tier 2
  project claim) would show the peer DRAM bar is reachable, and its 64 KB default reaching 97 GB/s makes
  block size a tuning knob. Left out to hold word growth; the vLLM dive's AWS sub-section carries the
  pool detail. The caption marks the bar as the EFA line rate.
- Valkey PR-author throughput (about 198 Gb/s on c8gn.16xlarge, V65): left out; no measurement on a GPU
  instance was located (register 01 open items).
- Per-engine byte paths (vLLM `fs` staging through host memory, F42; which connectors call cuFile, F46,
  F59; LMCache and SGLang Mooncake connectors staging through host, M34, M43): not repeated here; the
  section cross-links the vLLM dive's section 7.
- llm-d fs backend README still names vLLM 0.23.x at v1.0.0 (F59): not carried, for the same reason.
- No measured KV-cache latency or throughput on FSx for Lustre was located (register 03 open item 1), so
  the blog's 100 to 500 µs stays attributed and contrasted, never stated as a fact.
- Trn2: the FSx EFA page excludes the trn2 family while the AWS Storage Blog describes a Trainium path
  over EFA (register 03 open item 9). The page states only the documented exclusion.

## Word growth

Body prose measured by stripping JSX tags and `<Cite>` elements from the section component:
+277 tokens against the pre-edit file, of which about 6 are inline code names (`fs`, `root_dir`,
`fs_native`, `valkey-large-object`, `mooncake-transfer-engine-efa`) and about 25 are the ladder caption.
About 25 words over the +250 aim.
