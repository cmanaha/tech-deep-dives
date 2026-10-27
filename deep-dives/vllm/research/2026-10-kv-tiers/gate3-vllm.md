# Gate 3 quality score: vLLM section 7, "KV-Cache Offloading & Tiers", 2026-10-24

Independent scorer, worktree `kvtier`, HEAD db00ab3 ("vllm: apply the KV-tier fact check corrections and the
leverage pass to section 7"), clean tree. Scope:

- `deep-dives/vllm/src/sections/KVOffloadingLMCache.tsx` (KO), the whole section, read in order as a
  technical lead meeting it for the first time.
- `deep-dives/vllm/src/sections/offload/RemoteKvTiersAws.tsx` (RK), rendered at KO:1085: the containers
  "Remote tiers on AWS: who moves the bytes, and where they land" (C1, with `AwsRemoteKvPathsDiagram` and
  the remote-tier table) and "Choosing a remote tier on AWS" (C2). These are read most closely.

Standards applied: `deep-dives/efa/revamp/section-shape-standard.md`, `leverage-pass-standard.md`, and the
repo CLAUDE.md (writing style, acronyms in reading order, h2 payoff, last block is the reader's next action,
attribution in the link, project numbers never flattened, hedge scope). `factcheck-vllm.md` ("## Applied")
and `leverage-vllm.md` were read only to learn what had changed. Every claim below was re-checked against
its source, not against those reports. No repo file other than this report was edited; nothing was
committed.

## Verdict

| Section | Score | Corrections | Accuracy problems in spot checks |
| --- | --- | --- | --- |
| 7. KV-Cache Offloading & Tiers | 8/10 | 12, all minor (9 in RK, 3 in KO, 1 of them optional) | No number failed. Two framing errors, both in C2 disclosures: a header that calls the PR author's tables "the module's only throughput figures" when the cited thread holds another claim (correction 6), and a blog latency range presented as conflicting with an FSx figure it agrees with (correction 8) |

**Gate 3: passes.** No section is below 7, and the stream averages (8 + 8 + 8) / 3 = 8.0, with
FlashCacheTier and StorageDataPaths at 8 from `gate3-silicon-efa.md`.

Deterministic gates were run read-only from the worktree root on 2026-10-24.

- `no-ai-tells`, `svg-a11y`, `pinned-refs` and `pre-overflow` all exit 0.
- `node deep-dives/vllm/revamp/tools/gen-sources.mjs --check` reports "sources.md up to date (703 sources)".
- A scan for non-ASCII characters in KO and RK finds one, the "μ" in a quoted unit. There are no em-dashes,
  no en-dashes and no curly quotes, and no banned vocabulary.
- The vLLM dive ships no `playwright/` directory or `playwright.config.ts`, so no browser DOM gate could run.
  The diagram geometry was checked by hand against the coordinates (see "Diagram geometry" below).

## Score: 8/10

The section gives a reader one model they can carry anywhere ("store on completion, load on hit", with a
CPU tier that must exceed the GPU KV cache to add hit rate), and the AWS containers add a second, "who moves
the bytes, and where they land", which places a tier this page never mentions. The green and amber diagram
makes it visible. The practical payload is strong.

- The exact settings for each tier: `"protocol": "efa"` in the `MOONCAKE_CONFIG_PATH` file, absent from
  vLLM's docs. The `-efa-cuda13` wheel on vLLM's CUDA 13 default. `root_dir` on the FSx mount, and EFA chosen
  at FSx creation. nvidia-fs on GDS clients, and `s3_enable_s3express`.
- The FSx sizing arithmetic.
- The metrics in the closing container.

Every spot-checked number holds at its pinned source, project figures carry "(project claim)" and Tier 2,
the two documentation-versus-code conflicts are demoted and marked, and the section ends on the reader's next
action.

What holds it at 8:

- **Small scope slips in the AWS containers.**
  - The h2 description reads per-client maxima as "what each delivers".
  - "Every S3 path" is wider than the paths that were read.
  - "each transfer request as one EFA operation" drops the code's registered-memory-boundary exception.
  - A disclosure header calls the pull-request tables "the module's only throughput figures".
- **One false conflict.** The Storage Blog's "100-500 μs" sits "against" the FSx documentation's
  "sub-millisecond", but the two agree.
- **One unactionable imperative.** "Size transfers first" is followed by "This research did not trace which
  vLLM setting sizes" those transfers.
- **Section length.** The section runs nine containers. One LMCache sentence is a garden path, and the "helps
  and hurts" checklist mostly restates the paragraph above it.

None of these changes what a reader would type or buy. Together they keep the section a notch below the
best containers in the sibling dives.

## Leverage axes, the two AWS containers (1 to 5)

| Axis | C1 Remote tiers on AWS | C2 Choosing a remote tier on AWS | Basis |
| --- | --- | --- | --- |
| Mental model | 5 | 4 | **C1:** two questions, both answers named in the second sentence. The cost of host landing ("one more copy") is stated, then drawn as green against amber, then repeated as table columns. A reader can predict where an unseen connector lands from what memory it registers. **C2** is mostly procedure, with real sub-models: one request is one EFA operation, so transfer size sets throughput. Lazy handshakes make the first transfer to each new peer slow. A Valkey node is a cache you can lose. vLLM's fs tier is one file per chunk, shared by content hash and never evicted. |
| Practical leverage | 4 | 4 | **C1:** the reach column gives copyable settings, and the maturity column gates choice. Throughput units are mixed (GB/s, Gbps, Gb/s, Gbit/s) in the column built for comparison. **C2:** the strongest practical block in the section (wheel name, protocol key, libfabric path, create-time EFA, nvidia-fs, Express flag, order list ending on the flash-tier ladder). Held back by three gaps. "Size transfers first" has no knob. "Watch the first transfer" names nothing to watch. "Only if the 700 Gbps host path is the measured limit" does not point to the load-bandwidth metrics two containers later. |
| Rigor | 4 | 4 | **Both:** all links are pinned, cites are dated 2026-10-24, and Tier 2 is labelled. Inference carries "Our guidance", "By our arithmetic" and "by our reading". Attribution is load-bearing everywhere it appears (silence, conflict, or grading a project claim). **Slips:** the h2 "delivers" (C1), and the three scope strengthenings listed above (C2). |
| Accuracy | 5 | 4 | **C1:** every checked number and status holds. **C2:** every number holds, but two framings would leave a reader believing something false. One says no other throughput figures exist for the module, when the cited thread holds one. The other says the blog's FSx latency conflicts with the docs, when it does not. |
| Economy | 4 | 4 | **C1:** prose, diagram and table restate the mover and the landing, but each serves a different read (argument, picture, lookup). **C2:** 616 visible words, with sizing, conflicts and side paths in disclosures whose headers carry the point. The Valkey block, for a tier gated on two unmerged pull requests, is the longest per unit of use. |

## Spot checks (fetched 2026-10-24)

AWS pages were fetched with curl and a generic browser User-Agent. GitHub files came from
raw.githubusercontent.com at the pinned tag or SHA. Tags, PR state and comments came from unauthenticated
api.github.com. Release data came from the PyPI JSON API. Downloads are in `/tmp/g3vllm-dl/` (not committed).

| # | Claim on the page | Source fetched | Result |
| --- | --- | --- | --- |
| S1 | S3 throughput: "'Up to 100 Gb/s on a single instance' for data lake applications that fill the instance's network interface" (RK:237-241) | S3 `optimizing-performance.html`: "These data lake applications achieve single-instance transfer rates that maximize the network interface use for their Amazon EC2 instance, which can be up to 100 Gb/s on a single instance." | HOLDS, verbatim, with the condition the source attaches |
| S2 | S3 latency: Express One Zone "single-digit millisecond"; Standard "roughly 100-200 milliseconds" (RK:244-254) | `directory-bucket-high-performance.html`: "purpose-built to deliver consistent, single-digit millisecond data access". `optimizing-performance.html`: "roughly 100–200 milliseconds" | HOLDS. The page's hyphen replaces the source's en-dash, as the style rule requires. "Standard" is our label; the page names no storage class for the figure |
| S3 | FSx per-client ceilings: "Up to 100 Gbps over ENA (Elastic Network Adapter) and 5 Gbps to any one object storage server, 700 Gbps over EFA, 1,200 Gbps over EFA with GDS"; header "Throughput per client (maximum)" (RK:190-195, RK:458) | FSx `performance.html`, table "Maximum throughput per client, Gbps": Non EFA-enabled 100*, EFA-enabled ENA 100*, ENA Express 100, EFA 700, EFA with GDS 1200. Footnote: "The traffic between an individual client instance and an individual FSx for Lustre object storage server is limited to 5 Gbps." | HOLDS. The ENA Express row carries no asterisk, so the 5 Gbps limit does not apply to it; the page does not mention ENA Express (backlog B6) |
| S4 | FSx latency "consistent, sub-millisecond latencies for file operations"; sizing 91.2, 153.6 and 62.4 TiB of PERSISTENT-1000, and about 1.7 TiB of RAM (RK:199-202, RK:695-705) | `ssd-storage.html`: the latency sentence, verbatim. PERSISTENT-1000 row: 2600 network, 27.3 GiB RAM, 1000 disk (MBps/TiB). `getting-started.html`: "increments of 4.8 TiB ... for 1000" | HOLDS. Re-derived: 700 Gbps = 87,500 MB/s / 1,000 = 87.5 TiB, giving 19 steps of 4.8 = 91.2. 150,000 / 1,000 = 150, giving 32 steps = 153.6. 150,000 / 2,600 = 57.7, giving 13 steps = 62.4. 62.4 x 27.3 = 1,704 GiB, about 1.7 TiB |
| S5 | "Choose EFA at creation: it needs Persistent 2 with a metadata configuration and cannot be added later"; "EFA and GDS since November 27, 2024" (RK:663-667, RK:207-210) | `efa-file-systems.html`: "EFA is supported on Persistent 2 file systems with a metadata configuration specified"; "you cannot enable or disable EFA on an existing file system". `doc-history.html`: "Enabling EFA also provides support for GPUDirect Storage (GDS) ... November 27, 2024" | HOLDS |
| S6 | Mooncake benchmark labelling: table "project's Transfer Engine benchmark: up to 365.66 GB/s GPU-to-GPU write at 1 MB blocks (project claim)"; prose "97.11 GB/s ... at a `--block_size` of 64 KB against 352.59 GB/s at 1 MB on p5en, in its block-size sweep (project claim)" (RK:79-84, RK:534-539) | Mooncake `efa_transport.md` at v0.3.13.post1. L188: "Use `transfer_engine_bench`". L312: p5en GPU-to-GPU "block=1MB, threads=16, batch=128 / **365.66 GB/s**". L332-L340: "**block_size sweep** (p5en GPU-to-GPU ...)": "64 KB (default) / 97.11 GB/s" and "1 MB (recommended) / 352.59 GB/s" | HOLDS. Both labels carry the tool, the GPU-to-GPU scope, Tier 2 and "(project claim)". The two 1 MB numbers are told apart by "in its block-size sweep". Not a correction: the same guide's p5en CPU-to-CPU runs are lower, 212.71 GB/s at the same threads and batch, and the guide calls them "DRAM-bound". The Store pool is host DRAM, so the GPU-to-GPU figure is an upper bound, which the "(maximum)" header allows (backlog B1) |
| S7 | "Mooncake posts each transfer request as one EFA operation" (RK:529-533) | `efa_transport.cpp` L991-L997 at v0.3.13.post1: "a request that stays inside one chunk on both sides still becomes exactly one slice ... The one thing that does force a split is an MR boundary" | PARTLY. The page drops the exception (correction 3) |
| S8 | First transfer to each new peer "26 ms, handshake included, in the project's p5en test"; "vLLM v0.31.0's Mooncake connector code calls no warm-up" (RK:544-554) | Guide L435-L443: "cold submit #0 (no warmup) / **26 ms**", p5en, 1 MB write; "`fi_av_insert()` and the metadata handshake fire on the first send". L456: "vLLM and SGLang do not currently call `warmupSegment`" | HOLDS. The guide's own L456 also supports the vLLM half (backlog B9) |
| S9 | Docs versus code: the guide's `FI_EFA_ENABLE_SHM_TRANSFER=0` workaround is stale at v0.3.13.post1 (RK:556-569) | Guide L393-L412: the `{warning}` block on the SHM SAR segfault with GPU buffers, ending "Until libfabric#12328 is fixed, set `FI_EFA_ENABLE_SHM_TRANSFER=0` on such processes". `efa_context.cpp` L75-L89: `\| FI_HMEM` added to `hints_->caps` under `USE_CUDA \|\| USE_HIP`, with the comment "without FI_HMEM in caps the SHM sub-provider ... SIGSEGVs ... See .../libfabric/issues/12328" | HOLDS. The conflict is real at the tag, and the code cite is marked `kind="doc-code-conflict"`. The body does not state the resulting action (correction 4) |
| S10 | Install `mooncake-transfer-engine-efa-cuda13`, or `-efa` on CUDA 12; the extras install `mooncake-transfer-engine`; vLLM defaults to CUDA 13 (RK:497-516) | vLLM v0.31.0 `requirements/kv_connectors.txt` L8: `mooncake-transfer-engine >= 0.3.12`. `mooncake_connector_usage.md` L15: "vLLM defaults to CUDA 13 ... the wrong one fails to import". PyPI `mooncake-transfer-engine-efa-cuda13` 0.3.13.post1: "(AWS EFA, CUDA 13 version)". `mooncake_store_connector_usage.md` L56: protocol "`rdma`" or "`tcp`", no `efa` | HOLDS |
| S11 | Valkey module status: pre-release, no tags, crate 0.1.0, API experimental until 1.0, client pull requests open; `valkey-glide-sync` 2.6.0 unreleased on PyPI (RK:139-157, RK:575-585) | Tags API `[]`, releases `[]`, `main` = 7510b948 (2026-10-22, the pinned SHA). `Cargo.toml` L3 `version = "0.1.0"`. Comment 5766728140: "The API will initially be experimental/beta until the module is releasing an 1.0 version". PR 5556: open, not merged, head 7e5987f80ada (the pin). glide PR 7412: open, head 7644df8b12ee (the pin). PyPI: latest 2.5.3, with only 2.6.0rc1 in the 2.6 line | HOLDS. PR 5556's description still says it "Adds a valkey_rdma L2 adapter". The head code registers only `"valkey"`, with `TRANSPORTS = ("tcp", "rdma")` (L80, L1253), so the page's "the `valkey` L2 adapter's `rdma` transport" follows the code, which is correct |
| S12 | Valkey figures: 16 MiB loads 197.8 to 198.6 Gbit/s over RDMA against 32.8 to 62.5 over TCP with 4 to 16 workers; 256 KiB at 16 workers 63.3 against 40.5; two c8gn.16xlarge, each 200 Gigabit with EFA (RK:129-134, RK:643-656) | Comment 6304983743 (2026-10-21, author association NONE), Load table: 16 MiB RDMA 197.8 / 198.3 / 198.6 and TCP 32.8 / 62.5 / 59.1 at 4 / 8 / 16 workers; 256 KiB at 16 workers 63.3 / 40.5. EC2 `co.html`: c8gn.16xlarge "200 Gigabit", EFA "Yes" | HOLDS. "Reported by" and "Pull-request author's claim" grade a figure the comment itself calls "Measured". The same thread holds an earlier throughput claim, comment 6224628935 (2026-10-16): "200 gigabits/s per server and even more throughput with biggers server". The cited comment opens on it: "The 200 GB/s number comes from others testing without LMCache". This bears on correction 6 |
| S13 | "vLLM's own secondary tiers land in host memory, because only its CPU tier touches GPU memory" (RK:424-428) | vLLM v0.31.0 `tiering/base.py` L131-L136: "Secondary tiers cannot directly access GPU memory. All data transfers must go through the CPU (primary) tier ... Load: secondary → CPU (primary) → GPU" | HOLDS |
| S14 | Storage Blog framing, "100-500 μs", vLLM "KV Block Manager"; nvidia-fs silent fallback (RK:718-722, RK:762-781) | AWS Storage Blog (byline 21 SEP 2026): "T3 Amazon FSx for Lustre ... 100–500 μs"; "vLLM / KV Block Manager for file system offload". AWS ML Blog (byline 01 JUN 2026): "If nvidia_fs isn't loaded, GDS reads will silently fall back to the CPU bounce-buffer path." | HOLDS as quoted. But 100-500 μs is inside "sub-millisecond", so the two figures agree, and the page frames them as a conflict (correction 8) |
| S15 | "Every S3 path starts in host memory ... NIXL's OBJ plugin, whose default S3 engine takes host memory only" (RK:787-795) | NIXL v1.5.0 `obj/s3/engine_impl.h` L20-L21: `{DRAM_SEG, OBJ_SEG}`. The same plugin's `s3_accel/dell/engine_impl.h` L134-L135: `{OBJ_SEG, DRAM_SEG, VRAM_SEG}`, the "S3 Dell ObjectScale Engine" | HOLDS for the default engine, which the sentence scopes. The lead "Every S3 path" is wider than that scope (correction 9) |
| S16 | LMCache's GDS backend runs "in LMCache's deprecated in-process mode" (RK:714-717) | LMCache v0.5.6 `gds.rst` L1-L7: "This page documents the behavior of LMCache's in-process mode (deprecated)." | HOLDS |

### Diagram geometry (by hand, `AwsRemoteKvPathsDiagram`, viewBox 880 x 458)

- **Arrow labels.** These are centred at x 452, in the 296 to 600 gap. The widest are about 41 characters at
  11 px, about 254 units (325 to 579), so they clear the EFA strip and the tier boxes.
- **Tier-box text.** The widest is "Valkey large-object node on EC2" at 13 px bold, about 233 units, inside
  the 268-unit box at 600 to 868.
- **Arrows.** Every arrow ends at x 231, against an HBM or host box whose right edge is at 228. The
  Mooncake, GDS, fs and Valkey arrows cross the EFA strip (y 48 to 352). The S3 arrow, at y 388, passes
  below it, which is correct, since S3 is HTTP over ENA.
- **Strip text.** "EFA" and "NICs" sit at y 124 and 140, between the arrows at 84 and 164.
- **Legend.** It ends at about x 693 inside the 880 width. "copy to GPU" ends at about x 196, inside the
  left panel.

No collisions were found. A Playwright `gate-content-overflow` run would confirm this, but the vLLM dive has
not opted in to Playwright.

## Corrections (fix now; no new scope)

Only items that are wrong, violate the standard, or break scope are listed. All are minor. Each fix is a
re-express, a reorder or a deletion of text already on the page, and none adds a claim the section does not
already source.

| # | File:line | Issue | Minimal fix |
| --- | --- | --- | --- |
| 1 | RK:396 | **h2 description: number agreement, and maxima read as delivered rates.** "Which remote tier puts a block ..., which land it ..., and what each delivers per client". The column is "Throughput per client (maximum)", and the FSx and S3 cells say "Up to". This is the same delivered-rate slip the fact check fixed in the cells (C16) | "Which remote tiers put a block straight back into GPU memory, which land it in host memory first, and the most each can move per client" |
| 2 | RK:379 | **Trailing negative clause in the legend (rule 4).** "lands in GPU memory, no host hop" says nothing that "lands in GPU memory" does not, beside the amber "lands in host memory first" | "lands directly in GPU memory" (29 characters, shorter than now, so x 60 to about 240 stays clear of the next legend item at 290) |
| 3 | RK:529-530 | **An imperative the reader cannot carry out, and a dropped exception.** "**Size transfers first:**" is followed, in the same paragraph, by "This research did not trace which vLLM setting sizes `MooncakeStoreConnector`'s transfers" (RK:540-541). The rule as written also drops the code's exception, since a request that crosses a registration boundary is split (efa_transport.cpp L991-L997, "The one thing that does force a split is an MR boundary"). Scope may weaken, never strengthen | "**Transfer size sets throughput:** Mooncake posts each transfer request as one EFA operation unless it crosses a registered-memory boundary". The cite is unchanged, and the "did not trace" sentence stays |
| 4 | RK:567 | **Guidance not framed as the action (rule 10).** The conflict body ends "so the setting only gives up libfabric's same-host shared-memory path", which leaves the reader to infer what to do. The guide states the default ("default `1`, on", L390) | "..., so on CUDA builds leave it at its default, on: setting it to 0 only gives up libfabric's same-host shared-memory path." Cites unchanged |
| 5 | RK:597-598 | **Dissected before it is introduced (rule 3).** The reader meets "LMCache over glide-rdma" with no word on what glide-rdma is. It is valkey-glide's RDMA client, in open PR 7412 ("feat(core): integrate glide-rdma into glide-core"), which the table already cites (RK:155-157), and the expandable cites its `endpoint.rs` at that PR's head | "the located client stack, LMCache over glide-rdma (valkey-glide's RDMA client, in open pull request 7412), registers ..." |
| 6 | RK:622 | **Hedge scope broken, and contradicted by the cited thread (rule 14).** The header "the module's only throughput figures" claims uniqueness. The same PR thread holds an earlier claim, comment 6224628935 ("200 gigabits/s per server"), and the cited comment opens by referring to "The 200 GB/s number" from "others testing without LMCache" | "Evidence: the README's GPU-memory transport, and the throughput tables located" |
| 7 | RK:702-704 | **Dangling condition in the sizing disclosure.** "(62.4 TiB when reads hit the servers' cache, about 1.7 TiB of RAM at that size)" leaves the deciding condition implicit: the 62.4 TiB only holds if the hot set fits the roughly 1.7 TiB cache. The sibling FlashCacheTier got the same fix (gate3-silicon-efa.md, F3) | "(62.4 TiB if the hot set fits the servers' RAM cache, which holds about 1.7 TiB at that size)" |
| 8 | RK:769-773 | **A false conflict.** "Its FSx latency, '100-500 μs', has no stated setup, against 'consistent, sub-millisecond latencies' in the FSx documentation". 100 to 500 μs is sub-millisecond, so the two agree. The disclosure's real conflict is the KV Block Manager attribution (RK:774-778), which stays | "Its FSx latency, '100-500 μs', has no stated setup and is narrower than the 'consistent, sub-millisecond latencies' in the FSx documentation [same cite]." The header can stay, since the KVBM conflict carries it |
| 9 | RK:787 | **Universal lead over a scoped finding (rule 14).** "Every S3 path starts in host memory" generalises from vLLM's `obj` tier, NIXL's *default* S3 engine and LMCache's connector. NIXL's own `s3_accel/dell` engine accepts `VRAM_SEG` (v1.5.0 engine_impl.h L134-L135), although it targets Dell ObjectScale rather than Amazon S3 | "Both S3 paths covered here start in host memory: ..." |
| 10 | RK:165, RK:218-219 | **Second, inconsistent acronym expansions.** The caption (RK:447) already expands "LNet is Lustre Networking" and "CRT is the AWS Common Runtime" before the table. The table repeats them as "LNet (Lustre networking)", in a different case from the caption and glossary row L212, and "the AWS CRT (Common Runtime)" | RK:165: "The Lustre client over LNet on EFA or TCP". RK:218-219: "the AWS CRT in LMCache" |
| 11 | KO:816-849 | **Garden-path sentence (outside the AWS containers, but touched this session by fact-check A3).** The parenthetical opened at "storage backends (" runs through a nested "(GPUDirect Storage)", a citation, a semicolon, the L2-adapter clause and two more citations, and closes at L843, ") and non-prefix reuse". A first-time reader loses the subject | Reorder only. Close the list after "NIXL and GDS (GPUDirect Storage)" and its README L73 cite. Continue with ") and non-prefix reuse: CacheBlend ... [README L75]." Then start a new sentence: "Its multiprocess server reaches storage through its own L2 adapter layer behind a host-memory L1 [l1_memory_manager.py cite], with 21 adapters at v0.5.6, among them `valkey`, `mooncake_store`, `s3` and `sagemaker-hyperpod` [l2_adapters cite]." No text or cite is added or lost |
| 12 (optional) | KO:971-996 | **A summary box in a disclosure (rules 10 and 12).** "Checklist: when offloading helps and when it hurts" restates the inequality paragraph (KO:955-959), the use-case table and the "Load failures, consistency, capacity and routing" disclosure, and its second half is a failure list. It is optional because it is pre-existing and already demoted; delete it only with Carlos's approval | Delete the ExpandableSection. Every item survives elsewhere: the inequality paragraph, the use-case table, the back-pressure paragraph (KO:662-702), and Consistency (KO:1012-1022) |

Not corrections, checked and kept:

- The caption's "not to scale" and "not drawn".
- The absence claims "which lacks EFA", "calls no warm-up", "requests no FI_HMEM", "nothing evicts them", "No
  AWS figure located" and "No AWS measurement located". Each is a stated limit or a load-bearing silence, and
  each sits next to the code or documentation that bounds it.
- KO:1136-1137, "not how full it is". The metric's name invites that misreading, so the clause is practical.
- The 2026-10-16 and 2026-10-24 verification stamp (KO:401-403). It is freshness metadata (ADR-002), not page
  history.

## Backlog (enhancements; not part of this fix)

- **B1. A DRAM-end figure for the Mooncake row.** The guide's p5en CPU-to-CPU run at the same threads and
  batch, 212.71 GB/s write, is "DRAM-bound" (efa_transport.md L319-L330, Tier 2). A Store transfer has
  one end in the host-DRAM pool, so that figure is the closer proxy. The table now shows only the GPU-to-GPU
  upper bound.
- **B2. One unit in the throughput column.** It mixes GB/s (Mooncake), Gbps (FSx, EC2), Gb/s (S3, quoted)
  and Gbit/s (Valkey). Adding "about 2,925 Gbps" after 365.66 GB/s would let the column do its comparing job.
- **B3. A monitoring hook for C2.**
  - Order step 2's "only if the 700 Gbps host path is the measured limit" could point to
    `vllm:kv_offload_load_bytes` / `_load_time` (KO:1126-1135).
  - Each tier could point to `vllm:kv_offload_tiering_chunk_hits` / `_chunk_queries` per `tier` label and to
    `_backpressure_stores_dropped` (KO:1145-1156). This was already in the fact check's backlog.
- **B4. Name what to watch for Mooncake's first transfer.** The page has "Watch the first transfer to each
  new peer" but no signal: a TTFT outlier on the first request routed to a new peer, or a startup or log line.
  This needs a source.
- **B5. `blocks_per_chunk` for FSx I/O size.** The Usage Guide (L56, L105) says larger chunks give "larger
  I/Os to the host and secondary tiers". That is the knob for vLLM's fs tier on FSx, where the page says "one
  file per chunk".
- **B6. ENA Express on an EFA-enabled FSx file system.** `performance.html` lists ENA Express at 100 Gbps
  with no 5 Gbps per-server footnote. For clients that do not run EFA, that is the documented way past the
  per-server limit.
- **B7. Valkey practicals from the PR 5556 description (Tier 2).**
  - "Run the MP server with --no-l1-use-lazy".
  - "num_workers × L1 size must fit the device's registered-memory cap".
  - "No TCP fallback for buffers outside the arena".

  These belong under "Plan for host memory" once the pull request merges. Its description still says "valkey_rdma
  L2 adapter" while the head code extends `valkey`, so re-read both at merge.
- **B8. S3 Express One Zone through vLLM's `obj` tier.** The page establishes that only LMCache handles it
  explicitly. Whether NIXL OBJ's default engine can sign Express requests, through a directory-bucket
  `endpoint_override`, is untraced, so a reader on the native path cannot tell whether it works.
- **B9. Make the warm-up absence checkable.** The guide's L456 ("vLLM and SGLang do not currently call
  `warmupSegment`", Tier 2) could sit beside the directory cite. Right now the claim rests on a Tier 0 grep
  the reader cannot see.
- **B10. Close the loop with the final container.** "Start with the CPU tier, then measure", step 4
  (KO:1157-1159), ends on `fs` and `obj` without pointing back to "The order to add them in" for the AWS
  remote tiers.
- **B11. What happens when the fs tier fills FSx.** Nothing evicts it. The failure mode when the file
  system is full, and the CloudWatch capacity metric to alarm on, are untraced.
- **Carried from `factcheck-vllm.md`, still open:**
  - The HyperPod managed tiered KV cache as a row.
  - The FSx 1,024 EFA-connection budget.
  - EFA contention between storage and GPU-to-GPU traffic.
  - The LMCache `mooncake_store` adapter with `efa`.
  - The NIXL MOONCAKE plugin's protocol.
  - `O_DIRECT` on Lustre.
  - The Dynamo v1.5.1 and v1.6.0 pins.

## Sources read on 2026-10-24, by tier

Project tiers (CLAUDE.md "Fact-Checking & Sources Standard") are mapped to the global labels.

**Tier 0 [AUTHORITATIVE: our own check]**

- The FSx sizing arithmetic in S4, and the Valkey range re-reads in S12.
- The hand geometry check of `AwsRemoteKvPathsDiagram`.
- The gate runs, and the non-ASCII and banned-word scans of KO and RK.

**Tier 1 [AUTHORITATIVE]: AWS documentation**

- Amazon S3 User Guide: `optimizing-performance.html`, `directory-bucket-high-performance.html`.
- FSx for Lustre User Guide: `performance.html`, `ssd-storage.html`, `efa-file-systems.html`,
  `getting-started.html`, `doc-history.html`.
- EC2 instance specifications: `ac.html` (p5en.48xlarge, 3200 Gigabit) and `co.html` (c8gn.16xlarge, 200
  Gigabit, EFA).

**Tier 1 [AUTHORITATIVE]: source code and project docs at pinned refs**

- vLLM v0.31.0:
  - `vllm/v1/kv_offload/tiering/base.py`, `tiering/fs/io.py`, `tiering/fs/manager.py`
  - `vllm/distributed/mooncake_store.py`, `requirements/kv_connectors.txt`
  - docs `mooncake_connector_usage.md`, `mooncake_store_connector_usage.md`, `kv_offloading_usage.md`
- Mooncake v0.3.13.post1: `efa_context.cpp`, `efa_transport.cpp`, and
  `docs/source/design/transfer-engine/efa_transport.md` (read for configuration and for the conflict; its
  performance tables are Tier 2).
- valkey-large-object 7510b948: `Cargo.toml`, `README.md`.
- LMCache:
  - PR head 7e5987f: `lmcache/v1/distributed/l2_adapters/valkey_l2_adapter.py`.
  - v0.5.6: `docs/source/kv_cache/storage_backends/gds.rst`.
- NIXL v1.5.0: `src/plugins/obj/s3/engine_impl.h`, `src/plugins/obj/s3_accel/dell/engine_impl.h`.
- Registry metadata:
  - GitHub API: valkey-large-object tags, releases and `main`; the state, head and file list of PR 5556 and
    valkey-glide PR 7412.
  - PyPI JSON: `valkey-glide-sync`, `mooncake-transfer-engine-efa-cuda13`.

**Tier 2 [AUTHORITATIVE company blogs, read as claims; UNOFFICIAL project and PR-author records]**

- AWS Storage Blog, 2026-09-21 ("100–500 μs", "vLLM / KV Block Manager").
- AWS Machine Learning Blog, 2026-06-01 (nvidia-fs fallback).
- Mooncake EFA guide performance and latency tables (365.66, 352.59, 97.11 and 212.71 GB/s; 26 ms).
- LMCache PR 5556: its description, comment 6304983743 (benchmark tables) and comment 6224628935 ("200
  gigabits/s per server").
- Valkey core team comment 5766728140 (2026-09-21).

**[SPECULATIVE]**

- The 8/10 score and the axis scores.
- The judgment that the GPU-to-GPU figure is an acceptable upper bound under a "(maximum)" header.
- Which corrections are minor.

## Privacy

No request, header, User-Agent or query string carried personal data. AWS pages were fetched with a generic
browser User-Agent. GitHub and PyPI were read unauthenticated.

## Applied

Applied by the stream orchestrator on 2026-10-24.

- Corrections 1 to 10 applied in `offload/RemoteKvTiersAws.tsx` as proposed, with two refinements.
  - Correction 4: the guide's default ("default `1`, on") is on L390, outside the old cite. That cite is now
    `efa_transport.md#L390-L412`, re-fetched at v0.3.13.post1.
  - Correction 5: V48 shows the `glide-rdma` crate merged to valkey-glide main on 2026-10-21. Only its
    integration into glide-core is in open PR 7412. The gloss reads "valkey-glide's RDMA client crate, which
    open pull request 7412 wires into glide-core".
- Correction 3: re-checked against `efa_transport.cpp` at the tag. The comment at L991-L997 ("The one thing
  that does force a split is an MR boundary") falls inside the existing L990-L998 cite.
- Correction 11 applied in `KVOffloadingLMCache.tsx`. It is a reorder only, and no text or cite was added or
  lost.
- Correction 12 (delete the pre-existing "Checklist: when offloading helps and when it hurts" disclosure) was
  not applied. It removes pre-existing content, which needs Carlos's approval. It is listed as an open item in
  the stream report.
- After the edits: `sources.md` was regenerated (703 sources, `--check` 0). The vLLM checks exited 0
  (typecheck, lint, test, build), as did the gates no-ai-tells, svg-a11y, pinned-refs, pre-overflow and
  required-files. The `rkv-paths-title` diagram was reshot at 1440 and 390 with no overlaps, and the new
  legend text "lands directly in GPU memory" clears the next legend item.
