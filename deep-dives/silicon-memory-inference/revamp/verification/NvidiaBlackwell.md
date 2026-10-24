# Verification: NVIDIA Blackwell: B200 and B300

Verified: 2026-10-23 (sources fetched 2026-10-18 with curl's default User-Agent; the SEC
8-K was read from its Wayback copy). Claims checked: 61 (sampled: 0). Confirmed 55, wrong 0,
unsupported 6, mislabelled 0, unverifiable 0. One source contradicts itself (row 5, B300 stack
count); the section now names the bullet it follows and states the conflict.

## Gate 3 score: 8/10

The section gives the reader two working models (one CUDA device built from two dies; the
accumulator moving from registers into TMEM) and a practical B200-or-B300 decision that rests on
HGX figures every one of which matched its page. Nothing load-bearing was wrong: the six
UNSUPPORTED items are citation gaps (the NV-HBI name, Rubin as 10.7, Rubin Ultra, the 72-GPU
domain) and two hedge scopes, all fixed, and the B300 stack-count conflict is now stated where the
figure appears. Economy holds it at 8 rather than 9: by my rough count the visible text roughly
doubled, and three facts are said two or three times.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 55 of 61 confirmed, 0 wrong, 6 unsupported (all fixed). Every per-GPU NVFP4 derivation, INT8/FP64/FP8 board figure, AWS instance figure and PTX semantic matched its source. The B300 stack count comes from a page that contradicts itself; the notes now say which line is followed. |
| Mental model or practical value | 8 | Models: two dies as one device, TMEM holding the accumulator, "dense FP4 rose, sparse stayed". Actions: rewrite wgmma kernels, keep INT8/FP64 on B200, target `compute_100f`, price Hopper first. The Vera Rubin partner list gives the reader nothing to do beyond "it ships". |
| Shape | 8 | "What Blackwell is" comes before the mechanism; every h2 description states a payoff; 288 GB and 1.5x each land more than once; the per-GPU NVFP4 derivation sits in an ExpandableSection; ends on the "Getting the move right" checklist. The NVFP4 format paragraph sits inside the TMEM section, where it reads as a detour. |
| Writing | 8 | no-ai-tells clean. Attribution stays only where it carries weight (vendor claims "AWS describes", "NVIDIA says"; silences "NVIDIA does not state", "lists no Rubin instance"). Some sentences carry three code identifiers and two citations, which slows the read on a phone. |
| Economy | 6 | Roughly 750 to 1,350 visible words (my approximate count from the TSX; the author's report gives none), about +80%. Most growth is register-required NEW content (the B200-to-B300 block, Vera Rubin, three spec rows). Repetition: "about 1.8x smaller than FP8" three times, "wgmma requires sm_90a" twice, the INT8-on-B200 advice twice. |
| Diagrams | 9 | role="img", aria-labelledby, an asserting title; probe "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390; at 1440 every label sits inside its box and the arrow labels clear their lines; at 390 the wrapper scrolls sideways and the 11-unit text stays legible. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | B200 construction: two reticle-limited dies joined by NV-HBI at 10 TB/s; 208B transistors, TSMC 4NP (table, intro, two-die prose) | blackwellArchitecture | CONFIRMED figures; UNSUPPORTED name | Architecture page: "208 billion transistors and are manufactured using a custom-built TSMC 4NP process. All NVIDIA Blackwell products feature two reticle-limited dies connected by a 10 terabytes per second (TB/s) chip-to-chip interconnect in a unified single GPU." The page never says "NV-HBI"; the Ultra blog does: "two reticle-sized dies connected using NVIDIA High-Bandwidth Interface (NV-HBI) ... 10 TB/s of bandwidth" | blackwellUltraBlog cite added for the name in the intro and the two-die prose |
| 2 | B300: same two-die design, up to 160 SMs; SM count and HBM vary by SKU | blackwellUltraBlog | CONFIRMED | "* Blackwell Ultra GPUs contain up to 160 SMs and 288GB HBM3E Memory. Available SM count and HBM capacity varies by SKU." | - |
| 3 | Compute capability 10.0 (`sm_100`) / 10.3 (`sm_103`) | cudaGpus | CONFIRMED | "10.3 NVIDIA GB300 NVIDIA B300 ... 10.0 NVIDIA GB200 NVIDIA B200" | - |
| 4 | B200 up to 180 GB HBM3e | blackwellTuningGuide, dgxB200 | CONFIRMED | Tuning guide 1.4.2.1: "The NVIDIA B200 GPU has support for HBM3 and HBM3e memory, with capacity up to 180 GB."; DGX B200: "8x NVIDIA Blackwell GPUs", "1,440 GB total" | - |
| 5 | B300 288 GB HBM3e in eight 12-high stacks (table, two-die prose, diagram) | blackwellUltraBlog | CONFIRMED against the bullet; source conflicts with itself | "HBM configuration: Eight 12-Hi stacks, 16 x 512-bit controllers (8,192-bit total width)"; "Max capacity: 288 GB". Footer: "This post was updated on 9/24/25 to correct Figure 1 and the HBM configuration section to show the proper 12 HBM stacks instead of 8." The bullet still reads eight, and 8,192 bits is eight 1,024-bit stacks. The section states no per-stack capacity; eight stacks of 288 GB is 36 GB each, which a 12-high stack of 24 Gb dies gives | Table cell and caption notes now name the bullet followed and state the conflict |
| 6 | 179 GiB per GPU on P6-B200, 268 GiB on P6-B300 | ec2AcceleratedSpecs | CONFIRMED | "p6-b200.48xlarge ... 8 x NVIDIA B200 GPU 1432 GiB (8 x 179 GiB)"; "p6-b300.48xlarge ... 8 x NVIDIA B300 GPU 2148 GiB (8 x 268 GiB)" | - |
| 7 | B200 8 TB/s (derived 64 / 8) | dgxB200 (derived) | CONFIRMED | "8x NVIDIA Blackwell GPUs"; "1,440 GB total, 64 TB/s HBM3e bandwidth"; 64 / 8 = 8 | - |
| 8 | B300 8 TB/s | blackwellUltraBlog | CONFIRMED | "Bandwidth: 8 TB/s per GPU, 2.4x improvement over H100 (3.35 TB/s)" | - |
| 9 | NVLink 5 1.8 TB/s bidirectional (900 GB/s each way), table and diagram | hgxPage, blackwellUltraBlog | CONFIRMED | Ultra blog: "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)"; Table 1 "(in BiDir GB/s)" Blackwell and Blackwell Ultra 1,800. HGX: "NVLink GPU-to-GPU Bandwidth 1.8 TB/s" with no direction label. 900 each way is the note's halving | - |
| 10 | 5th-generation Tensor Core, `tcgen05.mma` | ptxIsa | CONFIRMED | PTX ISA 9.4, 9.7.18 "TensorCore 5th Generation Family Instructions" | - |
| 11 | TMEM 256 KB per SM (B200 note: 512 columns x 128 rows of 32-bit cells) | ptxIsa, blackwellUltraBlog | CONFIRMED | PTX 9.7.18.1: "On architecture sm_100a / sm_100f, the 5th generation TensorCore's Tensor Memory has a two-dimensional structure of 512 columns and 128 rows per CTA, with each cell being 32-bits in size." 512 x 128 x 4 B = 256 KiB. Ultra blog: "256 KB of Tensor Memory (TMEM)" in each SM | - |
| 12 | NVFP4 B200: 9 / 18 PFLOPS (HGX B200), 10 / 20 (GB200 NVL72), dense / sparse | hgxPage, gb200Nvl72 (derived) | CONFIRMED | HGX: "FP4 Tensor Core(1) 144 PFLOPS \| 72 PFLOPS" (HGX B200), fn 1 "Specification in Sparse \| Dense"; 144 / 8 = 18, 72 / 8 = 9. GB200 NVL72: "NVFP4 Tensor Core 1,440 \| 720 PFLOPS", "1. Specification in sparse \| dense."; / 72 = 20 and 10. Ultra blog Table 2, Blackwell: "10 \| 20 PetaFLOPS" | - |
| 13 | NVFP4 B300: 13.5 / 18 (HGX B300), 15 / 20 (GB300 NVL72) | hgxPage, gb300Nvl72 (derived) | CONFIRMED | HGX B300: "144 PFLOPS \| 108 PFLOPS"; 108 / 8 = 13.5. GB300 NVL72: "FP4 Tensor Core 1440 \| 1080(2) PFLOPS", "1. All Tensor Core specifications are with sparsity unless otherwise noted. 2. Without sparsity."; / 72 = 20 and 15. Ultra blog Table 2: "15 \| 20 PetaFLOPS" | - |
| 14 | INT8 Tensor Core per 8-GPU HGX board, sparse: 72 POPS (B200), 3 POPS (B300); dense is half | hgxPage | CONFIRMED | "INT8 Tensor Core(2) 3 POPS \| 72 POPS"; fn 2 "Specification in Sparse. Dense is 1/2 sparse spec shown." | - |
| 15 | FP64 per 8-GPU HGX board: 296 TFLOPS (B200), 10 TFLOPS (B300) | hgxPage | CONFIRMED | "FP64/FP64 Tensor Core 10 TFLOPS \| 296 TFLOPS" (HGX B300 \| HGX B200) | - |
| 16 | AWS: P6-B200 and P6e-GB200 (B200); P6-B300 and P6e-GB300 (B300); P6e-GB300 absent from the spec page | ec2AcceleratedSpecs, p6eGb300Ga | CONFIRMED | Spec page lists p6-b200.48xlarge, p6-b300.48xlarge and "p6e-gb200.36xlarge ... 4 x NVIDIA B200 GPU 740 GiB (4 x 185 GiB)"; no P6e-GB300 row. What's New, "Posted on: Dec 2, 2025": "AWS announces the general availability of Amazon Elastic Compute Cloud (Amazon EC2) P6e-GB300 UltraServers" | - |
| 17 | TMEM holds the Tensor Core's running sum (intro) | ptxIsa | CONFIRMED | PTX 9.7.18.10: "the D matrix is of the shape MxN, in Tensor Memory" (D = A*B+D) | - |
| 18 | NVFP4 stores weights about 1.8x smaller than FP8 (intro, fit list) | nvfp4Blog | CONFIRMED | "The format cuts model memory footprint by approximately 3.5x relative to FP16 and 1.8x compared to FP8" | - |
| 19 | B300 288 GB vs H200 141 GB | blackwellUltraBlog, h200Page | CONFIRMED | H200: "141 gigabytes (GB) of HBM3e memory at 4.8 terabytes per second (TB/s)"; Ultra blog "288 GB of HBM3e per GPU" | - |
| 20 | 15 PFLOPS dense NVFP4 per GPU; note: HGX B300 108 dense, 13.5 per GPU | blackwellUltraBlog | CONFIRMED | "NVIDIA Blackwell Ultra GPU delivers 15 petaFLOPS of dense NVFP4 compute"; HGX row 13 | - |
| 21 | 1T params at FP8 is about 1 TB before KV cache; P5en 8 x 141 GiB, P6-B300 8 x 268 GiB; "one node vs two" | ec2AcceleratedSpecs (derived) | CONFIRMED (arithmetic); note incomplete | Spec page: "p5en.48xlarge ... 8 x NVIDIA H200 GPU 1128 GiB (8 x 141 GiB)". 1e12 x 1 B = 1 TB. 8 x 141 GiB = 1,211 GB, so the weights fit on P5en with about 0.2 TB left; the note did not say so, and a reader checking 1 TB against 1,128 GiB sees a fit and no reason for a second node | Note now gives 1,211 GB and 2,302 GB and the headroom each leaves |
| 22 | One CUDA device, L2 shared by both dies with fully coherent access, no NUMA split | blackwellUltraBlog | CONFIRMED | "functioning as a single, NVIDIA CUDA-programmed accelerator"; "Full coherence: Shared L2 cache with fully coherent memory accesses." ("one device ID, one address space" predates the revamp; out of scope) | - |
| 23 | NVIDIA does not state how the stacks split between the two dies (prose) | blackwellUltraBlog | CONFIRMED (hedge scoped to NVIDIA) | No per-die HBM figure in the Ultra blog, architecture page, HGX or GB300 pages (register B35 also checked) | - |
| 24 | Hopper: the running sum lives in the registers of the warps issuing `wgmma` | ptxIsa | CONFIRMED | 9.7.17.5: wgmma "accumulator register" and "input registers containing the fragments of matrix A"; syntax `wgmma.mma_async... d, a-desc, b-desc` | - |
| 25 | `tcgen05.mma` has single-thread semantics; `mma.sync` and `wgmma` are collective | ptxIsa | CONFIRMED | "The instruction tcgen05.mma has single thread semantics, unlike the collective instructions mma.sync or wgmma.mma_async. So, a single thread issuing the tcgen05.mma will result in the initiation of the whole matrix multiply and accumulate operation." | - |
| 26 | B always from SMEM; A from SMEM or TMEM | ptxIsa | CONFIRMED | Table: "A: Tensor Memory OR Shared Memory; B: Shared Memory; D: Tensor Memory"; syntax `[d-tmem], a-desc, b-desc` and `[d-tmem], [a-tmem], b-desc` | - |
| 27 | SMEM stays at Hopper's 228 KB per SM within the same 256 KB L1+SMEM | blackwellTuningGuide | CONFIRMED | "For devices of compute capability 10.0 shared memory capacity per SM is 228 KB."; "the same the maximum capacity of the combined L1 cache, texture cache, and shared memory of 256 KB as the previous NVIDIA Hopper architecture"; "Both the NVIDIA H100 GPU and the NVIDIA B200 GPU support shared memory capacities of ... 228 KB per SM". CC appendix also gives 228 KB for 10.3 | - |
| 28 | `wgmma` requires `sm_90a` (two places) | ptxIsa | CONFIRMED | wgmma.mma_async, Target ISA Notes: "Requires sm_90a." | - |
| 29 | CUTLASS example 92 adds Blackwell MoE GEMMs tuned for low-latency inference, from v4.2.0 | cutlassChangelog | CONFIRMED | Under "## [4.2.0] (2025-09-15)": "Add Blackwell SM100 kernels for MoEs (focusing on Low-Latency inference performance): example 92" | - |
| 30 | Example 92 link pinned to v4.8.0 | cutlassExample92 | CONFIRMED | GitHub contents API at ref v4.8.0 lists `92_blackwell_moe_gemm_regular.cu`, `..._grouped.cu`, `..._rcgrouped.cu`, `..._blockscaled_rcgrouped.cu`, `..._fp4_grouped.cu`, `..._fp4_regular.cu`; tree URL returns 200 | - |
| 31 | NVFP4: E2M1, E4M3 scale per 16 values, FP32 per tensor; 3.5x vs FP16, 1.8x vs FP8 | nvfp4Blog | CONFIRMED | "4 bits (1 sign, 2 exponent, 1 mantissa) plus 1 shared FP8 scale per 16 value block"; "a fine-grained E4M3 scaling factor to each 16-value micro-block ... a second-level FP32 scalar applied per tensor"; "approximately 3.5x relative to FP16 and 1.8x compared to FP8" | - |
| 32 | ExpandableSection: HGX B200 144 \| 72, HGX B300 144 \| 108, GB200 NVL72 1,440 \| 720, GB300 NVL72 1,440 \| 1,080 | hgxPage, gb200Nvl72, gb300Nvl72 | CONFIRMED | as rows 12 and 13 | - |
| 33 | Dense NVFP4 rises 1.5x (108 vs 72), both 144 sparse | hgxPage | CONFIRMED | as row 13; 108 / 72 = 1.5 | - |
| 34 | AWS: P6-B300 1.5x the FP4 compute of P6-B200 without sparsity, 1.5x GPU memory (vendor-claim) | p6Page | CONFIRMED | "P6-B300 instances deliver 2x networking bandwidth, 1.5x GPU memory size, and 1.5x GPU TFLOPS (at FP4, without sparsity) compared to P6-B200 instances." Marked vendor-claim, attributed in the sentence | - |
| 35 | INT8 72 to 3 POPS (sparse), FP64 296 to 10 TFLOPS per board | hgxPage | CONFIRMED | as rows 14 and 15 | - |
| 36 | `.kind::i8` listed for `sm_100a` and `sm_110a` only; `sm_103` not on the list | ptxIsa | CONFIRMED | tcgen05.mma Target ISA Notes: "supported on following family-specific architectures from PTX ISA version 8.8 except .kind::i8"; "Qualifier .kind::i8 is supported on following architectures: sm_100a, sm_101a (Renamed to sm_110a from PTX ISA version 9.0), sm_110a" | - |
| 37 | FP8 holds at 72 PFLOPS sparse on both boards | hgxPage | CONFIRMED | "FP8/FP6 Tensor Core(2) 72 PFLOPS \| 72 PFLOPS", fn 2 sparse | - |
| 38 | `compute_100f` runs on 10.0, 10.3 and 10.7 | computeCapabilities | CONFIRMED | "In this example, it is compatible with devices of Compute Capability 10.0, 10.3, and 10.7." | - |
| 39 | 10.7 is Rubin ("10.7 (Rubin)", "Rubin is compute capability 10.7") | computeCapabilities | UNSUPPORTED by the cited page | The CC appendix and cuda-gpus name no GPU for 10.7; PTX ISA 9.4 only "Adds support for sm_107 target architecture". CUTLASS CHANGELOG 4.8.0: "Added initial Rubin support (SM107)" | cutlassChangelog cite added in both places |
| 40 | B300 doubles SFU throughput for attention; "up to 2x faster attention-layer compute compared to Blackwell GPUs" (vendor-claim) | blackwellUltraBlog | CONFIRMED | "In Blackwell Ultra, SFU throughput has been doubled for key instructions used in attention, delivering up to 2x faster attention-layer compute compared to Blackwell GPUs." Table 2: SFU EX2 5 vs 10.7 TeraExponentials/s | - |
| 41 | P6-B300 6.4 Tbps EFA vs P6-B200 3.2 Tbps ("twice the network") | p6Page | CONFIRMED | "P6-B300 instances provide 8x NVIDIA Blackwell Ultra GPUs with 2.1 TB high bandwidth GPU memory, 6.4 Tbps EFA networking"; instance table 6.4 vs 3.2 Tbps; "2x networking bandwidth". Spec page agrees: "6400 Gigabit" vs "3200 Gigabit" | - |
| 42 | Vera Rubin ramping into full production, racks at CoreWeave, Google Cloud, Microsoft Azure, OCI, Nebius | nvidiaQ2Fy27 | CONFIRMED | 8-K exhibit 99.1 (SEC returned 403 to curl's default User-Agent; read via the Wayback copy of 2026-10-03): "Announced the NVIDIA Vera Rubin platform is ramping into full production with racks running at partners including CoreWeave, Google Cloud, Microsoft Azure, Oracle Cloud Infrastructure and Nebius." | - |
| 43 | Rubin GPU: 288 GB HBM4, 35 PFLOPS dense NVFP4 (50 sparse) | veraRubinNvl72 | CONFIRMED | 1 Rubin GPU column: "NVFP4 Inference(2) 50 PFLOPS", "NVFP4 Training(3) 35 PFLOPS", "288 GB HBM4 \| 19.2 TB/s"; "2. Sparse specification. 3. Dense specification." HGX individual-GPU table agrees on 50 / 35 / 288 GB | - |
| 44 | Rubin raises shared memory to 328 KB per SM | computeCapabilities | CONFIRMED | Max shared memory per SM: 228 KB (10.0, 10.3), 328 KB (10.7); footnote: "kernels that use the 328 KB shared-memory configuration must explicitly enable cudaSharedMemoryModeAllowOversizedSharedMemory" | - (opt-in to Backlog) |
| 45 | As of October 2026 the EC2 spec page lists no Rubin instance | ec2AcceleratedSpecs | CONFIRMED | No "Rubin" or "Vera" string on the page (2026-10-18) | - |
| 46 | "AWS plans to deploy Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028" (roadmap) | awsNvidia2026 | UNSUPPORTED (scope) | "AWS plans to deploy an additional 2 million NVIDIA Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028". Dropping "additional 2 million" makes Blackwell Ultra read as a 2027 arrival, while P6-B300 is already listed (row 6) | "plans to deploy 2 million additional ..." |
| 47 | Rubin Ultra and Feynman, the architecture NVIDIA names after Rubin, are roadmap parts | gtc2026 (roadmap) | CONFIRMED for Feynman; UNSUPPORTED for Rubin Ultra | GTC 2026 blog: "Looking beyond Vera Rubin, NVIDIA's next major architecture is Feynman." No "Rubin Ultra" string on the page. awsNvidia2026 (row 46) names Rubin Ultra only as a 2027-2028 plan | awsNvidia2026 cite (roadmap) added to the sentence |
| 48 | "The 72-GPU NVLink domain of the P6e UltraServers" | none | UNSUPPORTED (uncited, new) | P6 page: "customers can access up to 72 Blackwell GPUs within one NVLink domain" (P6e-GB200); GB300 NVL72 "72 NVIDIA Blackwell Ultra GPUs" | p6Page cite added |
| 49 | If the model fits in H200's 141 GB, price Hopper first: P5en On-Demand cut 25% from the May 31, 2025 baseline | h200Page, gpuPriceCut | CONFIRMED | "Here is a table of price reductions percentage (%) from May 31, 2025 baseline prices"; row "P5en \| H200 \| 25%" under On-Demand | - |
| 50 | Diagram: "208B transistors on TSMC 4NP across two dies; B300 has up to 160 SMs" | blackwellArchitecture, blackwellUltraBlog | CONFIRMED | rows 1 and 2 | - |
| 51 | Diagram: NV-HBI 10 TB/s die to die | blackwellArchitecture, blackwellUltraBlog | CONFIRMED | row 1 | caption cite now names the source of the NV-HBI name |
| 52 | Diagram: L2 shared by both dies, fully coherent | blackwellUltraBlog | CONFIRMED | row 22 | - |
| 53 | Diagram: "HBM3e: up to 180 GB (B200) or 288 GB in eight 12-high stacks (B300), 8 TB/s per GPU" | blackwellTuningGuide, blackwellUltraBlog, dgxB200 | CONFIRMED against the bullet; source conflict | rows 4, 5, 7, 8 | caption note states the conflict |
| 54 | Diagram: "How the stacks split between the two dies is not published" | blackwellUltraBlog | UNSUPPORTED (hedge scope) | The research checked NVIDIA's pages, not every publication; the prose already scopes it to NVIDIA | "NVIDIA does not state how the stacks split between the two dies" |
| 55 | Diagram: NVLink 5 1.8 TB/s per GPU bidirectional (900 GB/s each way) | blackwellUltraBlog | CONFIRMED | row 9 | - |
| 56 | Diagram: SMEM 228 KB per SM, as on Hopper | blackwellTuningGuide | CONFIRMED | row 27 | - |
| 57 | Diagram: Tensor Core, `tcgen05.mma`, issued by one thread | ptxIsa | CONFIRMED | row 25 | - |
| 58 | Diagram: TMEM 256 KB per SM, new, holds accumulator D | blackwellUltraBlog, ptxIsa | CONFIRMED | rows 11 and 17 | - |
| 59 | Diagram: A and B from SMEM, D accumulates into TMEM, A optionally from TMEM | ptxIsa | CONFIRMED | row 26 | - |
| 60 | Tiers: T1 for EC2 docs, CUDA/PTX docs, CUTLASS at a tag, 8-K; T2 for NVIDIA and AWS product pages, blogs, newsroom | all | CONFIRMED | Match the register's Sources list and the brief's tier rules | - |
| 61 | GitHub URLs pinned | cutlassChangelog, cutlassExample92 | CONFIRMED | Both at tag v4.8.0 | - |

Counts: UNSUPPORTED are rows 1 (the NV-HBI name), 39, 46, 47 (the Rubin Ultra half), 48 and
54; the other 55 are CONFIRMED. Row 21's derived note was incomplete rather than wrong and is
counted CONFIRMED; its note was completed.

## ORCH-NOTES items

1. **B300 HBM stack count: conflict now stated, page and line named.** The section says "eight
   12-high stacks" in the table, the two-die prose and the diagram, all from the Blackwell Ultra
   blog's bullet "HBM configuration: Eight 12-Hi stacks, 16 x 512-bit controllers (8,192-bit total
   width)". The same post's footer says "This post was updated on 9/24/25 to correct Figure 1 and
   the HBM configuration section to show the proper 12 HBM stacks instead of 8." The table cell,
   the prose cite and the diagram caption now carry a note naming the bullet and the update note
   (the same wording HBM and the Bandwidth Wall uses). The section states no per-stack capacity;
   eight stacks give 36 GB each, which matches 12-high stacks of 24 Gb dies and eight 1,024-bit
   interfaces. No other NVIDIA page fetched (HGX, GB300 NVL72, architecture page) gives a B300
   stack count.
2. **Dense and sparse labels, NVLink 5, NV-HBI: CONFIRMED.** NVFP4 is labelled dense / sparse in
   the table row, the ExpandableSection and the prose (HGX fn 1 "Sparse | Dense"; GB200 NVL72
   "sparse | dense"; GB300 NVL72 fn 2 "Without sparsity" on 1,080). FP8 "72 PFLOPS sparse" and
   INT8 "(sparse)" carry the HGX fn 2 label ("Dense is 1/2 sparse spec shown"). BF16 is not
   quoted (HGX: 36 PFLOPS sparse on both boards). NVLink 5 reads "1.8 TB/s bidirectional (900 GB/s
   each way)" in the table and the diagram; the label comes from the Ultra blog ("1.8 TB/s
   bidirectional (18 links x 100 GB/s)", Table 1 "in BiDir GB/s"), since the HGX row "1.8 TB/s"
   has none. NV-HBI 10 TB/s: the architecture page gives the figure ("two reticle-limited dies
   connected by a 10 terabytes per second (TB/s) chip-to-chip interconnect"), the Ultra blog the
   name; the name was uncited and now cites the blog. Neither page gives NV-HBI a direction.
3. **B200 to B300 differences: CONFIRMED against the Ultra blog and the HGX page.** FP64 296 to 10
   TFLOPS per 8-GPU board (HGX). Dense NVFP4 72 to 108 per board, 10 to 15 per GPU (HGX; Ultra
   blog "10 petaFLOPS ... Ultra pushes that to 15 petaFLOPS—a 1.5x increase"), sparse unchanged
   at 144 per board, 20 per GPU. HBM3e 288 GB in 12-high stacks (item 1). INT8 72 to 3 POPS
   sparse. TDP is not quoted (Ultra blog Table 2: "Up to 1,200W" Blackwell, "Up to 1,400W"
   Blackwell Ultra); see Backlog. The Ultra blog's Table 2 lists Blackwell at 192 GB, the tuning
   guide B200 at 180 GB; this section uses 180 GB for B200 and quotes no capacity ratio.
4. **AWS P6 figures: CONFIRMED; no per-GPU EFA figure is used.** 179 GiB and 268 GiB per GPU, and
   P5en 141 GiB, match the EC2 spec page. EFA: the section quotes instance totals only, 6.4 Tbps
   (P6-B300) and 3.2 Tbps (P6-B200), which match the P6 page's instance table ("6.4", "3.2") and
   the spec page ("6400 Gigabit", "3200 Gigabit"). The P6 page's prose "400 GB ps per GPU of
   EFAv4 networking ... 3.2 Tbps per P6-B200 instance" against 6.4 Tbps / 8 = 800 Gbps per GPU on
   P6-B300 does not reach this section.
5. **Rubin HBM4 bandwidth: not quoted.** The Vera Rubin paragraph gives 288 GB HBM4 and 35 dense /
   50 sparse NVFP4 from the Vera Rubin NVL72 page, which agrees with the HGX individual-GPU table on
   all three. No Rubin bandwidth figure appears, so no page needs naming.

## Fixes applied

All in `src/sections/NvidiaBlackwell.tsx` unless named. Line numbers are after the fix.

1. :23-27, new consts `stackNote` and `hbiNote` (shared cite notes).
2. :36, :258, :305, B200 construction cell, intro and two-die prose: added
   `<Cite s={S.blackwellUltraBlog} note={hbiNote} />` beside the architecture-page cite, so the
   NV-HBI name has a source (row 1).
3. :76, B300 HBM cell: `<Cite s={S.blackwellUltraBlog} />` became
   `<Cite s={S.blackwellUltraBlog} note={stackNote} />`, which names the bullet followed and the
   post's "12 HBM stacks instead of 8" update note (row 5).
4. :313, two-die prose cite note: appended `stackNote` to the SKU note (row 5).
5. :319-322, diagram caption: "Dies, NV-HBI, transistor count and process [arch]; B300 SMs, HBM
   stacks ..." became "Dies, die-to-die bandwidth, transistor count and process [arch]; the NV-HBI
   name, B300 SMs, HBM stacks ... [Ultra blog, stackNote]" (rows 1, 5, 51, 53).
6. :283, derived note: "Per-GPU memory as AWS lists it for p5en.48xlarge and p6-b300.48xlarge."
   became "AWS lists 8 x 141 GiB (about 1,211 GB) for p5en.48xlarge and 8 x 268 GiB (about 2,302
   GB) for p6-b300.48xlarge, which leaves about 0.2 TB and 1.3 TB beyond the weights for KV cache
   and activations." (row 21).
7. :469-470 and :509, "10.7 (Rubin)" and "Rubin is compute capability 10.7": added
   `<Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />` (row 39).
8. :513-514, "AWS plans to deploy Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028." became
   "AWS plans to deploy 2 million additional Blackwell Ultra, Rubin and Rubin Ultra GPUs in
   2027-2028." (row 46).
9. :517-518, Rubin Ultra and Feynman sentence: added an awsNvidia2026 roadmap cite for Rubin Ultra
   and a note on the gtc2026 cite saying it names Feynman (row 47).
10. :539-540, "The 72-GPU NVLink domain of the P6e UltraServers": added `<Cite s={S.p6Page} />`
    (row 48).
11. `src/components/BlackwellDieDiagram.tsx:123`, "How the stacks split between the two dies is not
    published" became "NVIDIA does not state how the stacks split between the two dies" (row 54).

No source records added; every fix reuses an existing record in `src/sources/NvidiaBlackwell.ts`.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "NvidiaBlackwell|BlackwellDieDiagram|sources/NvidiaBlackwell"`: no output, "no type errors in my files".
- `pnpm exec eslint src/sections/NvidiaBlackwell.tsx src/sources/NvidiaBlackwell.ts src/components/BlackwellDieDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t NvidiaBlackwell`: exit 0, 1 passed, 34 skipped.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: exit 0, 833 passed.
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits for NvidiaBlackwell or BlackwellDieDiagram in any output.
- `pnpm exec vite build --outDir /tmp/vf-NvidiaBlackwell-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections blackwell --widths 1440,390 ...`: exit 0, "blackwell @1440: 1 SVG diagram(s), 0 React Flow, ok", "blackwell @390: 1 SVG diagram(s), 0 React Flow, ok". PNGs read: the edited HBM sub-label fits its bar at 1440 with no collision; at 390 the diagram scrolls inside its wrapper.
- Prettier (not a gate, no config in the repo): both files already differed from Prettier's output at HEAD; not reformatted.

## For the orchestrator

- `src/sections/QuantizationAndPrecision.tsx:94` and `:292` say "10.7 (Rubin)" on the
  computeCapabilities record. That page names no GPU for 10.7; CUTLASS CHANGELOG 4.8.0 ("Added
  initial Rubin support (SM107)") does. Same gap fixed here (row 39).
- SEC EDGAR returns 403 to curl's default User-Agent for the NVIDIA 8-K; the Wayback copy
  (`https://web.archive.org/web/20261003053735/https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/q2fy27pr.htm`)
  carries the quoted line. Any verifier re-checking `nvidiaQ2Fy27` can use it without a contact
  header.
- The GTC 2026 live-updates page (`gtc2026`) does not mention Rubin Ultra; it supports Feynman
  only. Only this section cites it.

## Backlog

- Economy cuts (about 40 words, section-shape, not corrections): drop "which stores weights about
  1.8x smaller than FP8" from the "Gains on Blackwell" NVFP4 bullet (said in the intro and the
  NVFP4 paragraph), and drop "which requires `sm_90a`" from the checklist's wgmma bullet (said in
  the TMEM section). Apply if the Gate 3 average needs it.
- B300's power envelope (Ultra blog Table 2: up to 1,200 W Blackwell, up to 1,400 W Blackwell
  Ultra) for the capacity-plan reader.
- Rubin's 328 KB shared-memory configuration is opt-in: "kernels that use the 328 KB
  shared-memory configuration must explicitly enable cudaSharedMemoryModeAllowOversizedSharedMemory"
  (CC appendix footnote). A one-clause practical note.
- Consider moving the NVFP4 format paragraph out of the TMEM section, next to the B200-to-B300
  trade where the FP4 figures are argued.
