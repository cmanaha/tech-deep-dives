# Verification: NVIDIA Hopper: H100 and H200

Verified: 2026-10-18. Claims checked: 44 (sampled: 0). Confirmed 42, wrong 0,
unsupported 2, mislabelled 0, unverifiable 0.

## Gate 3 score: 8/10
Every load-bearing figure (HBM capacity and bandwidth, sparse and dense FLOPS, NVLink direction, SM counts, per-SM limits, the four P5-family rows, the 1.9x footnote and its arithmetic) matched its source; the two UNSUPPORTED items were a citation gap (H100 "HBM3" cited to pages that do not say it) and a SKU scope gap in the diagram, both fixed. The section gives a usable model (where wgmma finds its operands, what caps occupancy, bandwidth sets the step and capacity sets the batch) and a concrete pick-an-instance table. Economy is the weakest criterion (7): the length grew well past the brief, though the duplicate 1.9x decomposition is now cut to one paragraph that points to *HBM and the Bandwidth Wall*.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 42 of 44 confirmed on first check; the 2 UNSUPPORTED (H100 HBM3 citation, "132 SMs on H100" without SXM) were not wrong numbers and are fixed. No WRONG figure |
| Mental model or practical value | 8 | wgmma operand placement plus the occupancy arithmetic (32 registers per thread at full occupancy, 16 warps at 128) give a model and a check to run; the instance table's "Pick it for" column is direct practical value. The intro's two launch dates (full production 2022, H200 announced 2023) give little of either |
| Shape | 8 | Introduces Hopper before the SM; 1.9x lands in the h1 block, an h2 description, the body and the AWS section; the footnote detail sits in an ExpandableSection; ends on "move to Blackwell kernel by kernel". The "Inside one Hopper SM" description lists topics rather than a payoff |
| Writing | 8 | no-ai-tells gate clean; vendor figures attributed where load-bearing ("NVIDIA rates", "AWS cites"). "its README lists ... and calls it a beta release" keeps an attribution the link already carries |
| Economy | 7 | Author reports about 770 to 1,215 words (+58%); the shortened 1.9x block takes off about 100 (to about 1,110, +44%). The table rows that restate the intro's HBM figures stay, and that repetition is intentional |
| Diagrams | 9 | Inline SVG, role="img", aria-labelledby with an asserting title, light background, 11 to 13px sans-serif, 640px min-width scroll wrapper; probe "1 SVG diagram(s), ok" at 1440 and 390; PNGs show no collisions, and the longer "H100 SXM: 80 GB HBM3 at 3.35 TB/s" line fits its box |

## Claims

All 44 claims below were checked against a fresh fetch on 2026-10-18 (none sampled). Sources fetched: H100 and H200 product pages, Hopper architecture blog, Hopper and Blackwell Tuning Guides, compute capabilities appendix, CUDA GPUs list, CUDA C++ Best Practices Guide, PTX ISA 9.4, Blackwell Ultra blog, Hopper full-production and H200 newsroom posts, EC2 accelerated computing specs (ac.html), P5 page, Capacity Blocks page, AWS price-cut blog, FlashAttention README at v2.8.3.post2 (raw.githubusercontent.com), Luo et al. arXiv:2402.13499v1 PDF.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | H100 and H200 are compute capability 9.0 (`sm_90`) (intro, table) | cudaGpus | CONFIRMED | "9.0 NVIDIA GH200 NVIDIA H200 NVIDIA H100" | - |
| 2 | Hopper SMs add FP8 to the fourth-generation Tensor Cores | hopperArchBlog | CONFIRMED | "Fourth-generation Tensor Cores introduce FP8 precision" | - |
| 3 | TMA bulk-copies tensors between global and shared memory; cluster blocks read, write and run atomics on each other's shared memory (Distributed Shared Memory) | hopperTuningGuide | CONFIRMED | "TMA allows applications to transfer 1D and up to 5D tensors between global memory and shared memory, in both directions"; "A thread block can read from, write to, and perform atomics in shared memory of other thread blocks within its cluster. This is known as Distributed Shared Memory." (1.4.1.2, 1.4.1.3) | - |
| 4 | H100 (HBM3) | hopperFullProduction (intro); h100Page (table, "Why the pair matters"); h100Page in the diagram caption | UNSUPPORTED | Neither page says HBM3 for H100 SXM: the H100 page lists "GPU Memory 80GB" and uses "HBM3" only for H100 NVL ("188GB HBM3"); the full-production post has no HBM mention. The Hopper architecture blog states it: "80 GB HBM3, 5 HBM3 stacks, 10 512-bit memory controllers" (H100 SXM5 unit list) | hopperArchBlog cite added in the intro, "Why the pair matters", the table cell and the diagram caption |
| 5 | H100 reached full production in September 2022 | hopperFullProduction | CONFIRMED | "September 20, 2022 GTC— NVIDIA today announced that the NVIDIA H100 Tensor Core GPU is in full production" | - |
| 6 | H200 (HBM3e) announced November 2023, systems expected from Q2 2024 | h200Announcement | CONFIRMED | "November 13, 2023 SC23"; "expected to begin shipping in the second quarter of 2024"; "the NVIDIA H200 is the first GPU to offer HBM3e" | - |
| 7 | H200 141 GB HBM3e at 4.8 TB/s | h200Page | CONFIRMED | "141 gigabytes (GB) of HBM3e memory at 4.8 terabytes per second"; table "GPU Memory 141GB", "GPU Memory Bandwidth 4.8TB/s" | - |
| 8 | H100 80 GB at 3.35 TB/s (H100 SXM) | h100Page | CONFIRMED for H100 SXM | H100 SXM column "80GB", "3.35TB/s" (H100 NVL: "94GB", "3.9TB/s") | Diagram HBM row and SM note, and the intro, now say H100 SXM (see 22) |
| 9 | NVIDIA rates H200 1.9x faster on Llama 2 70B, run at 4x the batch (vendor-claim) | h200Page | CONFIRMED | "Llama2 70B Inference 1.9X Faster"; footnote "Llama2 70B: ISL 2K, OSL 128 \| Throughput \| H100 SXM 1x GPU BS 8 \| H200 SXM 1x GPU BS 32" | - |
| 10 | Up to 64 resident warps of 32 threads, up to 32 thread blocks per SM (diagram) | hopperTuningGuide | CONFIRMED | "The maximum number of concurrent warps per SM remains the same as in NVIDIA Ampere GPU architecture (that is, 64)"; "The maximum number of thread blocks per SM is 32 for devices of compute capability 9.0" (1.4.1.1) | - |
| 11 | Register file 64K x 32-bit; up to 255 registers per thread (diagram) | hopperTuningGuide, computeCapabilities | CONFIRMED | "The register file size is 64K 32-bit registers per SM. The maximum number of registers per thread is 255."; appendix "Maximum number of 32-bit registers per thread 255" | - |
| 12 | wgmma: B from SMEM, A from SMEM or registers, D in registers | ptxIsa | CONFIRMED | "The input matrix A ... can be either in registers or in the shared memory. The input matrix B ... must be in the shared memory." (9.7.17.5.1); "Register operand d represents the accumulator matrix as well as the destination matrix" | - |
| 13 | wgmma requires sm_90a (diagram "sm_90a only"; last block) | ptxIsa | CONFIRMED | wgmma.mma_async "Target ISA Notes Requires sm_90a ." | - |
| 14 | H100 SXM FP8 3,958 TFLOPS sparse (table, diagram) | h100Page | CONFIRMED | "FP8 Tensor Core* 3,958 teraFLOPS"; "* With sparsity" | - |
| 15 | H200 FP8 3,958 TFLOPS sparse | h200Page | CONFIRMED | "FP8 Tensor Core² 3,958 TFLOPS"; "2 With sparsity." | - |
| 16 | BF16 1,979 TFLOPS sparse, both GPUs | h100Page, h200Page | CONFIRMED | "BFLOAT16 Tensor Core* 1,979 teraFLOPS" (H100); "BFLOAT16 Tensor Core² 1,979 TFLOPS" (H200) | - |
| 17 | Dense is half: FP8 about 1,979, BF16 about 990 (derived) | hopperArchBlog | CONFIRMED | Table 1 "Peak FP8 Tensor Core 2000 TFLOPS \| 4000 TFLOPS", "Peak BF16 Tensor Core 1000 TFLOPS \| 2000 TFLOPS", "Effective TFLOPS / TOPS using the Sparsity feature". 3,958 / 2 = 1,979; 1,979 / 2 = 989.5, "about 990" | - |
| 18 | SMEM up to 228 KB per SM inside 256 KB of L1 + SMEM (diagram) | hopperTuningGuide, computeCapabilities | CONFIRMED | "shared memory capacity per SM is 228 KB"; "increases the maximum capacity of the combined L1 cache, texture cache, and shared memory to 256 KB" (1.4.2.4); appendix "9.0 256 0, 8, ... 196, 228" | - |
| 19 | SMEM ~29, L1 ~41, L2 ~263, global ~479 cycles; H800 PCIe, HBM2e, 1,755 MHz (diagram, caption) | luoHopperBench (T3, measured) | CONFIRMED | Table IV "L1 Cache ... H800 40.7; Shared 29.0; L2 Cache 263.0; Global 478.8"; Table III "H800 PCIe", "Max Clock rate 1755 MHz", "Mem. Type HBM2e" | - |
| 20 | TMA 1D to 5D, both directions (diagram) | hopperTuningGuide | CONFIRMED | see 3 | - |
| 21 | The block keeps working while TMA data is in flight | hopperTuningGuide | CONFIRMED | "The whole block can then continue working on other instructions while the data is in flight" | - |
| 22 | "Shared by all 132 SMs on H100" (diagram); H100 SXM 132 SMs, full GH100 144 (table) | hopperArchBlog | Table CONFIRMED; diagram UNSUPPORTED at its scope | "Figure 3 shows a full GH100 GPU with 144 SMs. The H100 SXM5 GPU has 132 SMs, and the PCIe version has 114 SMs." The diagram said "H100" without SXM | Diagram now reads "132 SMs on H100 SXM" and "H100 SXM: 80 GB HBM3 at 3.35 TB/s" |
| 23 | L2 50 MB on H100 | hopperTuningGuide | CONFIRMED | "increases the L2 cache capacity from 40 MB in the A100 GPU to 50 MB in the H100 GPU" (1.4.2.2) | - |
| 24 | H200 SM count and L2 "Not on NVIDIA's H200 page" | h200Page | CONFIRMED | Full-text search of the page: no SM count, no L2 figure. Hedge is scoped to the page | - |
| 25 | NVLink 900 GB/s bidirectional, 450 GB/s each way | h100Page, h200Page, blackwellUltraBlog | CONFIRMED | "NVIDIA NVLink™: 900GB/s" (both pages); Table 1 "NVLink (GPU-GPU) 900" for Hopper, caption "(in BiDir GB/s)"; Hopper blog "18 fourth-generation NVLink links to provide 900 GB/sec total bandwidth", each link "25 GB/sec effective bandwidth in each direction" | - |
| 26 | 1.43x bandwidth, 1.76x capacity (derived, table and diagram) | h200Page, h100Page | CONFIRMED | 4.8 / 3.35 = 1.433; 141 / 80 = 1.7625 | - |
| 27 | Every compute figure NVIDIA publishes matches for both (h2 description) | h100Page, h200Page | CONFIRMED | SXM columns identical: FP64 34, FP64 TC 67, FP32 67, TF32 989, BF16 1,979, FP16 1,979, FP8 3,958, INT8 3,958 | - |
| 28 | On AWS: H100 on P5 (p5.4xlarge, p5.48xlarge); H200 on P5e and P5en | ec2AcceleratedSpecs, p5Page | CONFIRMED | ac.html: "p5.4xlarge ... 1 x NVIDIA H100 GPU", "p5.48xlarge ... 8 x NVIDIA H100 GPU", "p5e.48xlarge ... 8 x NVIDIA H200 GPU", "p5en.48xlarge ... 8 x NVIDIA H200 GPU"; P5 page "P5e and P5en ... powered by NVIDIA H200 Tensor Core GPUs" | - |
| 29 | 1.9x on Llama 2 70B and 1.6x on GPT-3 175B (vendor-claim) | h200Page | CONFIRMED | "Llama2 70B Inference 1.9X Faster"; "GPT-3 175B Inference 1.6X Faster" | - |
| 30 | Batch 8 vs 32 (one GPU), 64 vs 128 (eight GPUs) | h200Page | CONFIRMED | "H100 SXM 1x GPU BS 8 \| H200 SXM 1x GPU BS 32"; "x8 H100 SXM GPUs BS 64 \| x8 H200 SXM GPUs BS 128" | - |
| 31 | 1.43x fixed-batch cap; extra 61 GB; 4x batch (derived) | h200Page | CONFIRMED | 4.8 / 3.35 = 1.43; 141 - 80 = 61; 32 / 8 = 4 | Block shortened (ORCH item) |
| 32 | GPT-3 175B: 2x the batch, 1.6x the throughput | h200Page | CONFIRMED | 128 / 64 = 2; "1.6X Faster" | Sentence removed with the shortened block |
| 33 | Llama 2 70B 2K in / 128 out, throughput mode; GPT-3 175B 80 in / 200 out; footnote "Preliminary specifications. May be subject to change." | h200Page | CONFIRMED | The benchmark footnote block opens "Preliminary specifications. May be subject to change." then "GPT-3 175B: ISL 80, OSL 200 ..." and "Llama2 70B: ISL 2K, OSL 128 \| Throughput ..." | - |
| 34 | All four sizes can be reserved through Capacity Blocks for ML | capacityBlocks | CONFIRMED | Supported-types table lists "p5.4xlarge", "p5.48xlarge", "p5e.48xlarge", "p5en.48xlarge" with Region ticks; "reserve GPU-based accelerated computing instances on a future date" | - |
| 35 | p5.4xlarge: 1 x H100, 80 GiB; AMD EPYC 7R13, Nitro v4; 100 Gbps EFA; no GPUDirect RDMA | ec2AcceleratedSpecs, p5Page | CONFIRMED | "p5.4xlarge \| 256.00 \| AMD EPYC 7R13 \| ... \| 1 x NVIDIA H100 GPU \| 80 GiB (1 x 80 GiB)"; "P5 \| Nitro v4"; "p5.4xlarge \| 100 Gigabit \| ✓ Yes" (EFA); P5 page "*GPUDirect RDMA is not supported in P5.4xlarge" | - |
| 36 | p5.48xlarge: 8 x H100, 640 GiB; 3,200 Gbps second-generation EFA | ec2AcceleratedSpecs, p5Page | CONFIRMED | "8 x NVIDIA H100 GPU \| 640 GiB (8 x 80 GiB)"; "3200 Gigabit"; "P5 and P5e instances support provide up to 3,200 Gbps of networking using second-generation Elastic Fabric Adapter (EFA)" | - |
| 37 | p5e.48xlarge: 8 x H200, 1,128 GiB; EPYC 7R13, Nitro v4; 3,200 Gbps second-generation EFA | ec2AcceleratedSpecs, p5Page | CONFIRMED | "p5e.48xlarge \| 2048.00 \| AMD EPYC 7R13 \| ... \| 8 x NVIDIA H200 GPU \| 1128 GiB (8 x 141 GiB)"; "P5e \| Nitro v4"; P5 page as 36 | - |
| 38 | p5en.48xlarge: 8 x H200, 1,128 GiB; Sapphire Rapids, Nitro v5, PCIe Gen5 CPU-GPU; 3,200 Gbps third-generation EFA | ec2AcceleratedSpecs, p5Page | CONFIRMED | "p5en.48xlarge \| 2048.00 \| Intel Xeon Sapphire Rapids \| ... \| 1128 GiB (8 x 141 GiB)"; "P5en \| Nitro v5"; "3200 Gigabit"; P5 page "enabling Gen5 PCIe between CPU and GPU", "P5en, with third generation of EFA using Nitro v5" | - |
| 39 | P5en: up to 4x CPU-to-GPU bandwidth of P5e and P5; up to 35% lower latency than P5 (vendor-claim) | p5Page | CONFIRMED | "P5en instances provide up to 4x the bandwidth between CPU and GPU and lower network latency compared to P5e and P5 instances"; "shows up to 35% improvement in latency compared to P5 that uses the previous generation of EFA and Nitro" | - |
| 40 | p5.4xlarge is the only single-GPU Hopper size | ec2AcceleratedSpecs | CONFIRMED | The only Hopper rows on ac.html: 1 x H100 (p5.4xlarge), 8 x H100, 8 x H200 (twice) | - |
| 41 | NVFP4 and tcgen05.mma target Blackwell and later | ptxIsa | CONFIRMED | tcgen05.mma "Supported on following architectures: sm_100a sm_101a (Renamed to sm_110a ...)" plus "sm_100f or higher in the same family"; ".kind::mxf4nvf4 ... supported on ... sm_100a ... sm_103a sm_107a sm_110a"; no sm_90 target | - |
| 42 | B200 180 GB, B300 288 GB; AWS 179 GiB and 268 GiB per GPU | blackwellTuningGuide, blackwellUltraBlog, ec2AcceleratedSpecs | CONFIRMED | "The NVIDIA B200 GPU has support for HBM3 and HBM3e memory, with capacity up to 180 GB"; "With 288 GB of HBM3e per GPU"; ac.html "1432 GiB (8 x 179 GiB)", "2148 GiB (8 x 268 GiB)" | - |
| 43 | AWS cut On-Demand prices 44% for P5 and 25% for P5en from the May 31, 2025 baseline | gpuPriceCut | CONFIRMED | "Here is a table of price reductions percentage (%) from May 31, 2025 baseline prices"; "P5 \| H100 \| 44%" and "P5en \| H200 \| 25%" in the On-Demand column (post dated 05 JUN 2025) | - |
| 44 | FlashAttention-3 optimized for Hopper; README lists H100 or H800 with CUDA 12.3+; beta | flashAttentionReadme (T1, pinned to tag v2.8.3.post2) | CONFIRMED | "## FlashAttention-3 beta release"; "FlashAttention-3 is optimized for Hopper GPUs (e.g. H100)."; "Requirements: H100 / H800 GPU, CUDA >= 12.3." The blob URL at the tag returns 200 | - |

Tier and kind check: every URL carries the same tier here as in the other source files (checked by grep across src/sources). Vendor performance figures (1.9x, 1.6x, P5en 4x and 35%) are marked `vendor-claim` and attributed in the sentence. The Luo cycle counts are Tier 3, marked `measured`, and labelled "(Tier 3)" in the SVG. The only GitHub URL is pinned to a tag.

## ORCH-NOTES items

- **NVIDIA Hopper repeats the HBM section's 1.9x decomposition almost word for word (HBM verification).** CONFIRMED near-duplicate. Both sections read the same numbers: 1.9x (Llama 2 70B) and 1.6x (GPT-3 175B), batch 8 vs 32 and 64 vs 128, the 1.43x fixed-batch cap, the extra 61 GB, 4x the batch, 2K / 128 tokens, and "compare at the batch each holds". Every figure matches the H200 page (claims 26, 29 to 33). Fix: the two-column "Bandwidth sets the step time / Capacity sets the batch" block is cut to one sentence ("a fixed batch gains at most the 1.43x bandwidth ratio, and the rest is the larger batch that H200's extra 61 GB holds") plus "*HBM and the Bandwidth Wall* takes the two levers apart". The footnote ExpandableSection stays because only this section has it. The closing advice is narrowed to the H100-versus-H200 choice. The HBM section's line saying Hopper "takes the result apart further" is now false (see For the orchestrator).
- **Items the brief named:**
  - H100 and H200 SXM figures: CONFIRMED (claims 7, 8, 14 to 18, 22 to 27). FLOPS are labelled sparse, with dense derived at the 1:2 ratio from the architecture blog. NVLink 900 GB/s is labelled bidirectional (450 each way), backed by Blackwell Ultra blog Table 1 "(in BiDir GB/s)" and the Hopper blog's per-link "25 GB/sec ... in each direction" x 18 links. SMs: 132 (H100 SXM5) of 144 (full GH100). Shared memory: 228 KB per SM in 256 KB L1 + SMEM. The H100 page labels its HBM only "80GB", so "HBM3" is now cited to the Hopper architecture blog. The Hopper Tuning Guide gives "up to 3 TB/s" against the product page's 3.35 TB/s. The page uses the product page figure, labelled H100 SXM, as the author noted.
  - AWS families: CONFIRMED (claims 28, 34 to 40). p5.4xlarge (1 x H100, 80 GiB, 100 Gbps EFA, no GPUDirect RDMA), p5.48xlarge (8 x H100, 640 GiB), p5e.48xlarge and p5en.48xlarge (8 x H200, 1,128 GiB each), all 3,200 Gbps, against ac.html. ac.html gives no EFA generation, so the P5 page is the source for "second-generation" (P5, P5e) and "third generation" (P5en). ac.html lists no other Hopper instances.
  - FlashAttention-3: CONFIRMED against flashAttentionReadme, pinned to tag v2.8.3.post2 (claim 44). The record's URL is the tag blob, Tier 1, and matches the other source files.

## Fixes applied

- src/sections/NvidiaHopper.tsx:284-285 (intro). Before: `H100 (HBM3, High Bandwidth Memory) reached full production ...` with only hopperFullProduction. After: `<Cite s={S.hopperArchBlog} />` added after "(HBM3, High Bandwidth Memory)".
- :292-296 ("Why the pair matters"). Before: `against H100's 80 GB of HBM3 at 3.35 TB/s` cited h200Page, h100Page. After: `against H100 SXM's 80 GB of HBM3 at 3.35 TB/s` with hopperArchBlog added.
- :130 (table, HBM row, H100 cell). Before: `80 GB of HBM3` + h100Page. After: + hopperArchBlog.
- :326 (diagram caption, HBM cites). Before: h100Page, h200Page, derived. After: hopperArchBlog added after h100Page.
- :399-421 ("What 1.9x is made of"). Before: "With the compute identical, both memory changes are at work in the result." followed by a two-column ColumnLayout ("Bandwidth sets the step time" / "Capacity sets the batch", with the 1.43x, 61 GB, 4x and GPT-3 2x / 1.6x arithmetic and a Roofline pointer) and "Sizing with both halves" (two sentences). After: one sentence, "With the compute identical, a fixed batch gains at most the 1.43x bandwidth ratio, and the rest is the larger batch that H200's extra 61 GB holds." (derived note: 4.8 / 3.35 = 1.43; 141 - 80 = 61; 32 / 8 = 4x), then "*HBM and the Bandwidth Wall* takes the two levers apart." The footnote ExpandableSection is unchanged. The closing paragraph becomes "Choosing between H100 and H200. For decode-heavy serving, benchmark each at the largest batch its memory holds after the weights; at one shared batch size the comparison tops out at the 1.43x bandwidth ratio."
- src/components/HopperSmDiagram.tsx:157. Before: `Shared by all 132 SMs on H100`. After: `Shared by all 132 SMs on H100 SXM` (H100 PCIe has 114).
- src/components/HopperSmDiagram.tsx:165. Before: `H100: 80 GB HBM3 at 3.35 TB/s`. After: `H100 SXM: 80 GB HBM3 at 3.35 TB/s` (H100 NVL is 94 GB at 3.9 TB/s).

src/sources/NvidiaHopper.ts: no change (no new record needed; hopperArchBlog already present).

## Checks

- `pnpm exec tsc --noEmit`: exit 0, no output (so no hits in my files).
- `pnpm exec eslint src/sections/NvidiaHopper.tsx src/sources/NvidiaHopper.ts src/components/HopperSmDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t NvidiaHopper`: exit 0 (1 passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no NvidiaHopper or HopperSmDiagram hits in any output.
- `pnpm exec vite build --outDir /tmp/vf-NvidiaHopper-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections hopper --widths 1440,390 ...`: exit 0, "hopper @1440: 1 SVG diagram(s), 0 React Flow, ok" and the same at 390. PNGs read (/tmp/vf-NvidiaHopper-shots): at 1440 every label sits in its box, arrow labels clear of lines, the lengthened "H100 SXM" line fits; at 390 the diagram scrolls in its wrapper at legible size; the shortened 1.9x block renders as one paragraph, the expandable footnote and the closing advice.

## For the orchestrator

- src/sections/HbmAndBandwidthWall.tsx, "The two levers, observed" (about line 418): "*NVIDIA Hopper* takes the result apart further." is now untrue: Hopper's block is one sentence that points back to HBM. Suggest cutting the sentence, or "*NVIDIA Hopper* applies it to choosing between P5 and P5e." HBM now owns the decomposition.
- The h200Announcement record title contains "Supercharges" (NVIDIA's own headline, verbatim). If sources.md or the glossary output is ever scanned for banned words, it will hit; the title is accurate as is (the author flagged the same).
- sources.md snapshot: no records were added or changed here, so this pass adds nothing to regenerate. The author's earlier note (regenerate sources.md for the new NvidiaHopper.ts records) still applies.

## Backlog

- "Inside one Hopper SM" h2 description lists topics; a payoff phrasing (what the reader can check or tune) would lift Shape. This is a wording enhancement, so it was not made here.
- The intro's launch dates (full production September 2022, H200 announced November 2023) pass neither test strongly; consider cutting in a later iteration.
- The H200 SM count and L2 are stated as "Not on NVIDIA's H200 page". If NVIDIA's H200 datasheet PDF (linked from the page as "View Datasheet") states them, a later pass could fill the cells.
