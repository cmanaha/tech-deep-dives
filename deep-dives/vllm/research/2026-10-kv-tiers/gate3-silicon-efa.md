# Gate 3 quality score: FlashCacheTier (silicon) and StorageDataPaths (EFA), 2026-10-24

Independent scorer, worktree `kvtier`, HEAD 3d9f2ce, clean tree. Scope:

- `deep-dives/silicon-memory-inference/src/sections/FlashCacheTier.tsx` (whole section) plus
  `src/components/FlashTierLadder.tsx` and its caption.
- `deep-dives/efa/src/sections/StorageDataPaths.tsx` (whole section), with the "KV cache over the
  fabric" container and `KvOverFabricDiagram` read most closely.

Standards applied: `deep-dives/efa/revamp/section-shape-standard.md`, `leverage-pass-standard.md`, repo
CLAUDE.md (writing style, acronyms, h2 payoff, last block is the reader's next action). Earlier reports were
read only to learn which corrections had landed, then set aside. No repo file other than this report was
edited; nothing was committed.

## Verdict

| Section | Score | Corrections | Accuracy problems in spot checks |
| --- | --- | --- | --- |
| FlashCacheTier (with FlashTierLadder) | 8/10 | 7 (all minor) | None |
| StorageDataPaths | 8/10 | 4 (all minor) | None. One rounding nit (21.84 for 21.85 MiB), listed as a correction |

Gate 3: no section below 7, average 8.0. **Passes**, with the corrections below to apply in the fix step.

Deterministic gates run from the worktree root on 2026-10-24: `no-ai-tells`, `svg-a11y`, `pinned-refs`,
`pre-overflow` all exit 0 across the efa, silicon-memory-inference and vllm dives. No Playwright render audit
was run; diagram geometry was checked by hand against the coordinates (below).

## 1. FlashCacheTier: 8/10

The section gives a reader two models they can carry to any system: a break-even bandwidth that sits at
about 17 GB/s per node for a dense 70B on Hopper, and a "memory clock" for how long each tier remembers.
Then it says exactly what to switch on, measure and monitor. The settings per stack, the build order and
the two vLLM counters all come with a test against that 17 GB/s.
What holds it at 8: "Sharing context across nodes" still runs six topics (FSx, S3/EFS, pooled DRAM,
HyperPod, CMX, vendor claims) as paragraphs, plus a few small scope and acronym slips listed below.

| Axis | Score | Reason |
| --- | --- | --- |
| Mental model | 5 | B* as a ratio, the fill-time clock, "layout sets the I/O size", "match the tier to the gap"; the ladder and three other diagrams carry them |
| Practical leverage | 5 | Per-stack settings, `fio`/`nvme id-ctrl`/`gdscheck -p` checks, FSx create-time EFA choice and sizing, build order, counters to watch |
| Rigor | 4 | Cite kinds (derived, measured, vendor-claim, roadmap) and "located in this research" hedges used consistently; small slips: one unscoped "only", one line rate phrased as a delivered rate, one narration attribution |
| Accuracy | 5 | Every number spot-checked holds; all arithmetic re-derived (below) |
| Economy | 4 | Dense but layered into disclosures; the Sharing container is the long one |

### Spot checks (fetched 2026-10-24)

| # | Claim on the page | Source fetched | Result |
| --- | --- | --- | --- |
| S1 | FSx per client: 100 Gb/s without EFA, 700 with EFA, 1,200 with EFA and GDS; sizing note: 2,600 MBps/TiB network and 27.3 GiB RAM per TiB at PERSISTENT-1000, 153.6 / 62.4 TiB, 1,704 GiB | AWS FSx `performance.html` (table "Maximum throughput per client, Gbps": 100* / 100* / 100 / 700 / 1200), `ssd-storage.html` (PERSISTENT-1000: 2600, 27.3, 1000) | HOLDS. Arithmetic: 150,000/1,000 = 150 -> 32 x 4.8 = 153.6; 150,000/2,600 = 57.7 -> 13 x 4.8 = 62.4; 62.4 x 27.3 = 1,704 |
| S2 | p5/p5e/p5en/p6-b200/p6-b300: 8 x 3,800 GB, 4.4 M IOPS; EBS 10,000 (p5, p5e) and 12,500 MB/s; p6e-gb200 3 x 7,500 GB, 2.55 M, 7,500 MB/s; trn2 4 x 1,900 GB, 1.72 M; p5en/P6-B200 2,048 GiB host memory; EFA 3,200 Gb/s, 6,400 on p6-b300 | AWS EC2 `instancetypes/ac.html` (instance store "4,400,000 / 2,200,000", EBS "12500.00", memory "2048.00", network "3200 Gigabit", "6400 Gigabit") | HOLDS. The 2,048 GiB claim is scoped to p5en and P6-B200; p6-b300 lists 4096.00, and the page does not claim otherwise |
| S3 | Dynamo router credits host at 0.75 and disk at 0.25 by default; KVBM disk filter writes on the second sighting, decays every 600 s | `ai-dynamo/dynamo` at v1.5.1: `lib/kv-router/src/scheduling/config.rs` L79-L84; `lib/bindings/kvbm/src/block_manager.rs` L69-L75 (`FrequencyFilter::new(2, Duration::from_secs(600), ...)`); `offload/filter.rs` L109-L117 (1, then doubled, offload at >= 2) | HOLDS |
| S4 | HyperPod: Llama-3.1-70B, seven p5.48xlarge replicas, 64K context, median TTFT down 94%, throughput up 38%; L2 backends `tieredstorage` (recommended) or `redis`; `kvCacheSpec.enableL2Cache`; docs "a pooled memory tier that spans cluster nodes"; What's New "automatic tiering from CPU memory to local SSD" | AWS ML blog (2025-11-26), SageMaker `sagemaker-hyperpod-ray-kv-cache.html` and its setup page, What's New 2025-11 | HOLDS. Neither the blog nor the two docs pages mention SSD, so "only the What's New post" holds for the pages read, but the sentence does not carry that scope (correction F5) |
| S5 | DeepSeek-V4.1-Flash: 890 B of global KV cache per token, 8B prefill-active parameters | Hugging Face README at revision 314113f ("reduce the global KV cache footprint to 890 bytes per token"; "activate only 8B parameters per token during prefill") | HOLDS |
| S6 | VAST and CoreWeave: 127,188-token prompt, 8x H100, 62 s vs 3 s TTFT, 2 x 100 Gb/s NFS, peak 198 Gb/s | VAST blog (2025-12-16) | HOLDS. The run used `Llama-3.1-405B-Instruct-AWQ-Int4` (INT4 weights; KV size unchanged, so the 65.6 GB FP16-KV derivation stands). Backlog B3 |
| S7 | Valkey module pre-release: no tags, no releases, crate 0.1.0; README "tiered DRAM + NVMe ... optional EFA RDMA transport to GPU memory" | GitHub API (unauthenticated): tags 0, releases 0, main = 7510b948 (2026-10-22); `Cargo.toml` and `README.md` at that SHA | HOLDS |

Arithmetic re-derived without the notes' help: B* = 327,680 B x 8 x 989.5 TFLOPS / 151.8 GFLOPs = 17.1 GB/s
per node (2.14 per GPU); 1K and 128K prefixes 18.2 and 8.3; B200 FP8 77.7, FP8 KV 38.8; memory clock 2.75 M
tokens / 26,000 tok/s = 105 s, 92.8 M / 26,000 = 3,570 s (page: 3,560, within rounding of "about an hour");
block 655,360 B / 80 = 8,192 B; 1 DWPD on 30.72 TB = 356 MB/s; VAST 516,096 B x 127,188 = 65.6 GB at 24.75
GB/s = 2.65 s. All hold.

FlashTierLadder geometry, by hand: log scale 270 + 100 x log10(GB/s). Bars end at 638 (HBM), 590 (HBF), 451,
440, 397, 374, 305, 289, 289; every in-bar label fits its bar (widest test: 10.9 GB/s, 79 units in a 104-unit
bar); outside labels start at max(bar end, break-even 302) + 10. Longest sub-label (39 chars at 11 px, about
242 units) ends before 270. The "10,000 GB/s" tick label (about 637 to 703) sits below the rows, clear of
the capacity column at 700. Footnote ends near 709 of 860. No collisions found. A Playwright run
(`gate-content-overflow`) would confirm this; not run here.

### Corrections (FlashCacheTier.tsx)

| # | Line | Issue | Minimal fix |
| --- | --- | --- | --- |
| F1 | 85-86 | Garden path in the opening paragraph: "is rated at a floor level with that bar" reads as "a floor level". A first-time reader stalls on the section's key comparison | "The NVMe instance store in every 8-GPU P5 and P6 instance has a rated read floor level with that bar, and what flash adds is time: ..." |
| F2 | 419 | Attribution as narration: "read from the code," adds nothing the `dynamoRouterCode` cite does not already say, and no docs claim is contrasted here (step 2's "Read from the code at v1.5.1 ... the docs say only" is a real conflict and stays) | Delete "read from the code, " so the clause reads "routers rank lower tiers lower: Dynamo credits a prefix block ..." |
| F3 | 442-444 | Dangling apposition: "or 62.4 TiB for reads from the servers' memory cache, about 1.7 TiB at that size" reads as if 62.4 TiB were about 1.7 TiB | "... or 62.4 TiB for reads served from the servers' memory cache, which holds about 1.7 TiB at that size." |
| F4 | 457, 464 | Acronym order: the lead "S3 and EFS." uses EFS before its expansion seven lines later; no earlier section (1 to 8) expands it | Lead "S3 and EFS (Elastic File System)." and change L464 to "on Amazon EFS and recommends Max I/O mode" |
| F5 | 496 | Hedge scope (rule 14): "only the What's New post mentions ..." is a claim about all AWS material; what was read is three pages | "...; of the AWS pages located in this research, only the What's New post mentions ..." |
| F6 | 471 | Line rate phrased as a delivered rate: "A pool of peer DRAM rides EFA at 3,200 Gb/s" (the same "delivers" to "allows up to" slip the fact check fixed for FSx; the caption correctly says "drawn at the EFA line rate") | "A pool of peer DRAM rides EFA, up to its line rate of 3,200 Gb/s per p5en or p6-b200 and 6,400 on p6-b300." |
| F7 | 500, 502 | Acronym order: the disclosure header "a flash tier behind a DPU" shows DPU before the body expands it; no earlier section expands it | Header "NVIDIA CMX: a flash tier behind a DPU (data processing unit)"; body "puts BlueField-4 DPUs (800 Gb/s) in front of ..." |

No correction touches FlashTierLadder.tsx or its caption. All three AI-tell scans (em-dash, en-dash ranges,
curly quotes, banned vocabulary) are clean, there is no changelog voice, every h2 description states a
payoff, and the section ends on its strongest number ("about 17 GB/s per node").

## 2. StorageDataPaths: 8/10

The section gives a reader a small set of decisions they cannot reverse (the FSx create call, security
groups written by group ID, the S3 part size) and one surprising model (the CRT throughput target is a
divisor). The KV container adds a check that works on any KV store: who posts the RDMA operation, where KV
lands, and whether there is a libfabric `efa` RDM endpoint. Code sourcing is exemplary.
What holds it at 8: the section is long for a page in an EFA dive (three containers on CRT internals). The
"boundary" h2 describes sourcing instead of a payoff, and one KV sentence states an inference from a code
comment as fact.

| Axis | Score | Reason |
| --- | --- | --- |
| Mental model | 5 | Four paths with four ceilings; create-time one-way doors; target as divisor; who posts the transfer and where KV lands, with RC verbs ruled out by the provider's QP checks |
| Practical leverage | 5 | `EfaEnabled` at create, SG rules by ID, interface names, prefix layout, cuFile connector for the 1,200 Gbps path, the `-efa` wheel, the RDM-endpoint check |
| Rigor | 4 | Pinned code on every load-bearing claim, `doc-code-conflict` badges, ProjectRef for project documents, hedges scoped. Two slips: the shm conclusion is unlabelled inference (E2), and one cite cannot bear "per EFA device" (E1) |
| Accuracy | 5 | Every spot check holds; one two-decimal rounding nit in a diagram row (E4) |
| Economy | 3 | Whole-section length; the CRT binding read-through and blog-claim table are deep for an EFA dive; the KV "GDS client requirements" disclosure repeats a scope-table row from the same section |

### Spot checks (fetched 2026-10-24)

| # | Claim on the page | Source fetched | Result |
| --- | --- | --- | --- |
| E-S1 | 100 Gbps ENA, 100 ENA Express, 700 EFA, 1,200 EFA with GDS per client; ENA rows limited to 5 Gbps per object storage server; AWS recommends EFA above 10 GBps | AWS FSx `performance.html` | HOLDS (footnote "*" sits on the two ENA rows, not on ENA Express, matching "The ENA rows") |
| E-S2 | Clients: Nitro v4 or later excluding trn2; AL2023, RHEL 9.5+, Ubuntu 22.04+ with kernel 6.8+; GDS on P5, P5e, P5en, P6-B200, P6-B300 with GDS driver 2.24.2+; 1,024 EFA connections per file system; `install-fsx-lustre-client.sh --install-lustre --install-efa`, `setup.sh --optimized-for-gds` | AWS FSx `configure-efa-clients.html`, `efa-file-systems.html` | HOLDS |
| E-S3 | EFA-enabled Persistent SSD in 4.8, 9.6, 19.2, 38.4 TiB steps for 1000, 500, 250, 125 MBps/TiB; Intelligent-Tiering EFA only at 4,000 MBps increments; same AZ and /16 CIDR; EFA cannot be enabled or disabled later; throughput tier cannot change | AWS FSx `getting-started.html`, `efa-file-systems.html` | HOLDS |
| E-S4 | Up to 6,400 Gbps of EFA bandwidth on p6-b300.48xlarge | AWS EC2 `ac.html` ("6400 Gigabit") | HOLDS |
| E-S5 | CRT: 100/250 = 0.4 Gbps per connection, "magic value" comment, ceil and clamp 10 to 10,000, set once; memory ladder 2/4/8/16/24 GiB; p5 comment "around 400 Gbps" and "two NICs per node" | `awslabs/aws-c-s3` at 469cbd0: `s3_client.c` L59-L77, L163-L169, L392-L402, L422-L423; `s3_platform_info.c` L65-L72; `s3_util.c` L854 (memory / connections / 3, 8 MiB floor) | HOLDS. The "1600 Gbps and 800 Gbps" comments at L126-L140 are the trn1n and trn1 entries; the page says "later entries", which is accurate (backlog B9). 16 GiB / 250 / 3 = 21.845 MiB rounds to 21.85, diagram says 21.84 (E4) |

KV container code, read at the pinned refs:

| Claim | Ref | Result |
| --- | --- | --- |
| EFA verbs: `efa_create_qp` and `efa_create_qp_ex` return EOPNOTSUPP unless UD; driver QP must be SRD | `linux-rdma/rdma-core` v65.0 `providers/efa/verbs.c` L2268-L2305, L2057-L2061 | HOLDS |
| Core Valkey RDMA sets `IBV_QPT_RC` before `rdma_create_qp`; Mooncake rdma endpoint sets RC | `valkey-io/valkey` 9.1.2 `src/rdma.c` L375; `kvcache-ai/Mooncake` v0.3.13.post1 `rdma_endpoint.cpp` L138 | HOLDS |
| Mooncake: `efa` protocol, `fi_read`/`fi_write` on `shared_ep_`, `FI_EP_RDM` on the `efa` provider with a per-device `-rdm` domain, GPU memory via `FI_HMEM_CUDA`, `USE_EFA` OFF by default, `mooncake-transfer-engine-efa` wheel names, NIC selection `all|local`, host memory excluded from local selection | Mooncake v0.3.13.post1: `multi_transport.cpp` L516-L520; `efa_context.cpp` L75-L103, L534-L592, L1146-L1158; `efa_transport.cpp` L306-L346, L1267-L1275; `config.cpp` L623-L634; `common.cmake` L100; `build_wheel.sh` L264-L291 | HOLDS |
| Mooncake guide: set `FI_EFA_ENABLE_SHM_TRANSFER=0` for same-host cross-process GPU transfers until libfabric 12328 is fixed; code comment: without `FI_HMEM` in caps the shm sub-provider copies in host mode, and CUDA builds declare it | `docs/source/design/transfer-engine/efa_transport.md` L388-L415; `efa_context.cpp` L75-L89 | Both HOLD as quoted. The page's conclusion that the setting "only gives up the same-host shm path" is inference from the comment (E2) |
| Valkey module: RESP command with `(rkey, addr, len)` triples; server `fi_writemsg` (GET) with `FI_DELIVERY_COMPLETE` and `fi_read` (SET); `efa-direct` fabric; RDM endpoint | `valkey-large-object` 7510b94 `src/commands/mod.rs` L22-L84, `src/transport/session.rs` L36-L91; `momentohq/vdma` 72c3a08 (the rev `Cargo.toml` pins) `connection.rs` L43-L99, `configuration.rs` L7-L48, `endpoint.rs` L95-L120 | HOLDS |
| Located clients register host memory | LMCache PR head 7e5987f `rdma_worker_pool.py` L156, `l1_memory_manager.py` L2 ("CPU pinned-DRAM L1 memory manager"); valkey-glide PR head 7644df8 `endpoint.rs` L756-L785 (plain `fi_mr_reg`). Both PRs still open at those heads (GitHub API) | HOLDS |
| cuFile connectors: LMCache GDS backend (`CuFile`), Dynamo KVBM `build_agent(.., use_gds)` creates GDS_MT, NIXL GDS_MT calls `cuFileRead`; vLLM `fs` tier and SGLang `file` do POSIX I/O from host memory | LMCache v0.5.6 `gds_backend.py` L1015-L1097; Dynamo v1.6.0 `distributed/worker.rs` L94-L145; NIXL v1.5.0 `gds_mt_engine.cpp` L44-L49; vLLM v0.31.0 `tiering/fs/io.py` (os.write, os.readv), `manager.py` L124 ("primary tier's CPU KV cache"); SGLang v0.5.22 `hicache_storage.py` (readinto into `.numpy()`) | HOLDS |

KvOverFabricDiagram geometry, by hand: three columns (24 to 264, 304 to 564, 604 to 836), arrows in the 40-unit
gutters, lanes end at y = 156, 256, 356, band 372 to 460 in a 476 viewBox. Widest box label "Valkey
large-object module" (26 chars, 600 13 px, about 203 units) ends at about 241 of 264; widest band line (88
chars, 600 12 px) ends near 706 of 836. No collisions found. Cross-links verified: vLLM section 7 is
"KV-Cache Offloading & Tiers", silicon section 9 is "Flash as a Cache Tier for Inference". KV, NIXL, RDM,
RDMA and LNet are expanded earlier in the EFA dive's reading order, and RESP, UD and RC at first use.

### Corrections (StorageDataPaths.tsx)

| # | Line | Issue | Minimal fix |
| --- | --- | --- | --- |
| E1 | 1709-1710 | The citation must be able to bear its claim: `mcRmaPost` (L1146-L1158) shows `fi_read`/`fi_write` on `shared_ep_`, not that there is one RDM endpoint per EFA device. `mcRdmEndpoint` (L75-L103: `FI_EP_RDM`, domain `<device>-rdm`) bears it and is already defined | Add `<SourceRef provenance="code-derived" code={code.mcRdmEndpoint} />` after `mcRmaPost` on that sentence |
| E2 | 1742-1746 | Reasoning from a code comment stated as fact. The code shows a CUDA build declares `FI_HMEM`; that this removes the crash is the comment's diagnosis, and "the setting only gives up the same-host shm path" is our conclusion. No test is cited | "... but a CUDA build declares `FI_HMEM`, which the code's own comment names as the fix for that crash, so by our reading the setting now only gives up the same-host shm path" |
| E3 | 1810 | h2 description restates sourcing, not the reader's payoff (rule 8), and it does not match the body, which covers what the CRT material leaves out and where to keep reading | "What this section leaves to a storage dive, and where in the pinned code to pick it up. The badge on each claim says whether it rests on AWS documentation, code or a project's own document." |
| E4 | 755 | Rounding: 16 GiB / 250 / 3 = 21.845 MiB (aws-c-s3 `s3_util.c` L854, `GB_TO_BYTES` is 1024^3), which rounds to 21.85; the other three rows are rounded, not truncated | `['100', '250', '21.85 MiB']` |

No em-dash, en-dash range, curly quote, banned word, changelog voice or key-takeaways box in reader text.
Negative constructions in reader text are limit statements with their reasons ("RC verbs stacks do not run on
EFA" with the QP-type checks), which rule 4 allows. The KV container ends on its check, and the section ends
on "The order to answer these in".

## Backlog (new scope or optional; not corrections)

FlashCacheTier

- B1. Pooled DRAM: say what host-memory registration by the located Valkey clients costs the reader (a host
  bounce before HBM on every hit). This needs a cited source or an "our reading" label, so it is new scope.
- B2. One visible comparison of the AWS shared tiers (FSx with EFA and GDS, peer DRAM over EFA, HyperPod
  managed tier, S3 Express) against the 2.1 GB/s per GPU break-even, in place of four paragraphs.
- B3. VAST paragraph: name the AWQ INT4 weights of the 405B run (`Llama-3.1-405B-Instruct-AWQ-Int4`), which is
  why it fits 8x H100.
- B4. FSx without EFA: the 5 Gb/s per object storage server cap (the earlier fact check's P1 option).
- B5. LMCache's GDS backend is the one connector that is both shared on FSx (silicon step 3) and on the
  cuFile path (EFA page). Saying so is a synthesis across two dives and needs an "our reading" label.
- B6. Playwright `gate-content-overflow` on FlashTierLadder at phone width.

StorageDataPaths

- B7. Economy: the KV disclosure "GDS client requirements" (L1697-L1702) repeats the scope-table row at
  L1036-L1038 of the same section; deleting it, or replacing it with a pointer to the table, would cut
  repetition.
- B8. The h1 description (L1141) names two storage services and the create call, and says nothing about the
  KV container that now sits in the section.
- B9. L1401 "The pattern repeats on later entries": naming trn1n.32xlarge and trn1.32xlarge would stop a
  reader from assuming the 1600 and 800 Gbps figures are P6 entries.
- B10. A monitoring hook for KV over EFA (libfabric or Mooncake counters); none is in the settled facts.
- B11. "Choosing a path" has no KV row.
- B12. Playwright render audit of KvOverFabricDiagram (open since the fact check).

## Sources used in this check, by tier

Tier 1, AWS documentation (fetched 2026-10-24): FSx for Lustre `performance.html`, `ssd-storage.html`,
`configure-efa-clients.html`, `efa-file-systems.html`, `getting-started.html`; EC2 `instancetypes/ac.html`;
SageMaker `sagemaker-hyperpod-ray-kv-cache.html` and `sagemaker-hyperpod-ray-kv-cache-setup.html`.

Tier 1, source code and project documents at the pinned ref (raw.githubusercontent.com): rdma-core v65.0;
valkey 9.1.2; Mooncake v0.3.13.post1 (efa_context.cpp, efa_transport.cpp, config.cpp, multi_transport.cpp,
rdma_endpoint.cpp, common.cmake, build_wheel.sh, efa_transport.md, mooncake-store.md); valkey-large-object
7510b94 (Cargo.toml, README.md, commands/mod.rs, transport/session.rs); vdma 72c3a08 (connection.rs,
configuration.rs, endpoint.rs); LMCache v0.5.6 (gds_backend.py) and PR head 7e5987f (rdma_worker_pool.py,
l1_memory_manager.py); valkey-glide PR head 7644df8 (glide-rdma/src/endpoint.rs); aws-c-s3 469cbd0
(s3_client.c, s3_platform_info.c, s3_util.c, private/s3_util.h); Dynamo v1.5.1 (kv-router config.rs, kvbm
block_manager.rs, offload/filter.rs) and v1.6.0 (distributed/worker.rs, storage/disk.rs); NIXL v1.5.0
(gds_mt_engine.cpp); vLLM v0.31.0 (tiering/fs/io.py, manager.py); SGLang v0.5.22 (hicache_storage.py). GitHub
REST API, unauthenticated: valkey-large-object tags, releases and main HEAD; LMCache PR 5556 and valkey-glide
PR 7412 state and head SHA.

Tier 1, model card: deepseek-ai/DeepSeek-V4.1-Flash README at revision 314113f.

Tier 2, vendor and AWS blog material: AWS ML blog "Managed Tiered KV Cache and Intelligent Routing for Amazon
SageMaker HyperPod" (2025-11-26); AWS What's New, SageMaker HyperPod managed tiered KV cache (2025-11); VAST
Data blog "NVIDIA Dynamo + VAST = Scalable, Optimized Inference" (2025-12-16).
