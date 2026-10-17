# 05 - Workloads refresh: framing, roofline, precision, MoE, disaggregation, capital markets

- **Area:** workload-side sections of the Silicon, Memory & Modern Inference dive (the October 2026 freshness revamp)
- **Sections covered:** 1 ThesisAndFraming (+ TriangleDiagram), 2 HeterogeneityFact, 3 RooflineAndArithmeticIntensity (+ RooflineChart), 25 QuantizationAndPrecision (+ PrecisionLadder), 23 MoeAndSparseActivation (+ MoeRoutingDiagram, MoeParamsChart), 26 DisaggregatedServingAndSpeculative (+ DisaggregatedServingDiagram), 30 CapitalMarketsLens (+ TickToTradeDiagram)
- **Date:** 2026-10-16 (accessed date on every citation below)
- **Sources fetched:** about 125 (about 65 fetched directly in this pass, about 60 by two helper passes that fetched and quoted primary sources; every URL below was actually retrieved, none is reconstructed from memory)
- **Verdict counts:** see the tally at the end of this header (computed from the registers below)
- **Prior audit folded in:** `docs/verification/2026-08-01/P3-silicon-numbers.md` sections 5, 7 and 8. Status of each P3 finding is stated in the row it touches (search "P3").

Verdict tally (rows in the claim registers): **CORRECT 78, STALE 33, WRONG 37, NEW 27, UNKNOWN 19** (194 rows).

Conventions used in this file:
- Tier 1 = official spec, official vendor docs, model config/README at a pinned Hugging Face revision, source code at a tag or SHA, arXiv paper for its own method (numbers are **author-measured**), SEC filing. Tier 2 = vendor product page, press release, vendor blog (vendor performance numbers are **VENDOR CLAIM**). Tier 3 = third-party.
- **[derived]** marks arithmetic done in this pass from cited inputs. It is not a source statement.
- **ROADMAP** marks a product that is not confirmed shipping.
- Dense vs sparse: NVIDIA's Blackwell pages state "Specification in Sparse. Dense is 1/2 sparse spec shown"; the same 2:4 convention is applied to Hopper figures below as **[derived]**.

---

## Ridge-point reference table (built in this pass, used by several sections)

All ridge points are peak FLOPS divided by peak HBM bandwidth, **dense** unless marked. Inputs are vendor specs (Tier 2 product pages are VENDOR CLAIM; AWS Neuron docs are Tier 1). Ridge values are **[derived]**.

| Chip | Precision | Peak (dense) | HBM BW per chip | Ridge (FLOP/byte) | Input sources |
| --- | --- | --- | --- | --- | --- |
| H100 SXM | FP8 | 1,979 TFLOPS (3,958 sparse) | 3.35 TB/s | 591 (1,181 sparse) | nvidia.com/h100 "FP8 Tensor Core* 3,958", "* With sparsity" |
| H100 SXM | BF16 | 989.5 TFLOPS (1,979 sparse) | 3.35 TB/s | 295 | same |
| H200 SXM | FP8 | 1,979 TFLOPS (3,958 sparse) | 4.8 TB/s | 412 (825 sparse) | nvidia.com/h200 "FP8 Tensor Core² 3,958", "2 With sparsity." |
| H200 SXM | BF16 | 989.5 TFLOPS (1,979 sparse) | 4.8 TB/s | 206 | same |
| B200 (DGX/HGX B200) | FP8 | 4.5 PFLOPS (72 PF sparse / 8 GPUs) | 8 TB/s (64 TB/s / 8) | 562 | DGX B200 page "1,440 GB total, 64 TB/s HBM3e", "FP8 Tensor Core: 72 PFLOPS**" |
| B200 | FP4 | 9 PFLOPS (72 PF dense / 8) | 8 TB/s | 1,125 | HGX page "144 PFLOPS \| 72 PFLOPS" (sparse \| dense) |
| B300 (HGX B300) | FP4 | 13.5 PFLOPS (108 / 8) | 8 TB/s [derived from GB300 NVL72 576 TB/s / 72] | 1,688 | HGX page "144 PFLOPS \| 108 PFLOPS" |
| B300 in GB300 NVL72 | FP4 | 15 PFLOPS (1,080 / 72) | 8 TB/s | 1,875 | GB300 NVL72 page "FP4 Tensor Core 1440 \| 1080", "20 TB \| Up to 576 TB/s" |
| Rubin (HGX Rubin NVL8) | NVFP4 | 35 PF dense training spec; 50 PF inference is a **sparse** spec | 22 TB/s HBM4 | 1,591 dense (2,273 sparse) | HGX page "NVFP4 Inference 50 PFLOPS", "NVFP4 Training 35 PFLOPS", "288 GB HBM4 \| 22 TB/s", "1. Sparse specification. 2. Dense specification." |
| Rubin | FP8 | 17.5 PFLOPS | 22 TB/s | 795 | same |
| Rubin | BF16 | 4 PFLOPS | 22 TB/s | 182 | same |
| AMD MI355X | FP8 (OCP) | 5 PFLOPS (10.1 with structured sparsity) | 8 TB/s | 625 | amd.com MI355X "Peak OCP-FP8 ... 5 PFLOPs", "Peak Memory Bandwidth 8 TB/s", 288 GB HBM3E |
| AMD MI355X | MXFP4 | 10.1 PFLOPS | 8 TB/s | 1,262 | same, "Peak MXFP4 Performance 10.1 PFLOPs" |
| AWS Trainium2 | FP8 | 1,299 TFLOPS | 2.9 TB/s | 448 | Neuron docs Trainium2: "1,299 FP8 TFLOPS", "96 GiB of device memory with 2.9 TB/sec" |
| AWS Trainium2 | BF16 | 667 TFLOPS | 2.9 TB/s | 230 | same |
| AWS Trainium3 | MXFP8 / MXFP4 | 2,517 TFLOPS | 4.9 TB/s | 514 | Neuron docs Trainium3: "2,517 MXFP8/MXFP4 TFLOPS", "144 GiB ... 4.9 TB/sec" |
| AWS Trainium3 | BF16 | 671 TFLOPS | 4.9 TB/s | 137 | same |

What the table teaches (mental model, **[derived]**): at a **fixed** precision the ridge does not march right every generation. BF16: H100 295, B200 281, Rubin 182. FP8: H100 591, B200 562, Rubin 795. FP4: B200 1,125, GB300 1,875, Rubin 1,591 (dense). HBM4 (Rubin 22 TB/s, 2.75x B300's 8 TB/s) pulls the BF16 and FP4 ridges back left. The large rightward moves come from **dropping a precision step** on the same chip (H200 BF16 206 to FP8 412; B200 FP8 562 to FP4 1,125).

---

## Section 1 - ThesisAndFraming.tsx (+ TriangleDiagram.tsx)

**What the section covers.** Argues that memory bandwidth, not peak FLOPS, governs inference; computes an H200 ridge point; introduces the instruction-data-shape triangle and the claim that each silicon family makes a different bet about delivering it.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence (URL, tier, what it says) | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 1.1 | "first slide is almost always a FLOPs number - FP8 peak, sparse peak" | ThesisAndFraming.tsx:26-28 | CORRECT | https://www.nvidia.com/en-us/data-center/gb300-nvl72/ (Tier 2): "All Tensor Core specifications are with sparsity unless otherwise noted." | Keep. |
| 1.2 | "decode ... reads the entire model's weights from memory once per generated token" | :29-31 | CORRECT | True for dense models [derived]. For MoE only active experts are read: DeepSeek-V3 report (arXiv 2412.19437, Tier 1) "the MoE part only needs to load the parameters of one expert" per GPU in decode. | Add "for a dense model (an MoE model reads only the experts each token selects)". |
| 1.3 | "SXM (Server PCIe Module form factor)" | :36-37 | UNKNOWN | NVIDIA does not expand SXM on the H200 or HGX pages fetched (Tier 2). No NVIDIA source for "Server PCIe Module" found. | Drop the expansion: "NVIDIA H200 SXM". |
| 1.4 | "H200 SXM ... ships 3,958 TFLOPS of FP8 tensor performance" | :36-37 | WRONG | https://www.nvidia.com/en-us/data-center/h200/ (Tier 2, VENDOR CLAIM): "FP8 Tensor Core² 3,958 TFLOPS", footnote "2 With sparsity." Unlabelled sparse figure (same defect P3 found in NvidiaBlackwell). | "1,979 TFLOPS of dense FP8 (3,958 with 2:4 sparsity)". |
| 1.5 | "4.8 TB/s of HBM3e" | :37-38 | CORRECT | H200 page (Tier 2): "GPU Memory Bandwidth 4.8TB/s", 141 GB. | Keep. |
| 1.6 | "the ridge point is roughly 825 FLOPs per byte" | :43 | WRONG | 825 = sparse FP8 / bandwidth [derived]. Dense FP8 ridge = 1,979 / 4.8 = 412 [derived]. | "roughly 412 FLOPs per byte at dense FP8 (825 if you count sparse peak)". |
| 1.7 | "Decode with a modest batch size lives at 2-10 FLOPs per byte" | :45 | CORRECT | [derived] 2 FLOPs per parameter per token; with 8-bit weights batch 1-5 gives 2-10, with BF16 weights batch 2-10. | Add the assumption: "with 8-bit weights at batch 1-5". |
| 1.8 | "two orders of magnitude below the ridge" | :45-46 | CORRECT | [derived] 2-10 vs 412 is 41x-206x (1.6-2.3 orders). | Keep once 1.6 is fixed. |
| 1.9 | "Doubling the peak FLOPs ... nothing for decode; doubling the HBM bandwidth would roughly double the tokens per second" | :46-48 | CORRECT | Roofline consequence in the memory-bound regime [derived]; Williams, Waterman, Patterson, CACM 52(4), April 2009 (Crossref, Tier 1). | Keep; add "until KV-cache reads or latency floors bind". |
| 1.10 | Heterogeneity list (Neoverse, AMX, Hopper/Blackwell, Trainium, Cerebras, Groq LPU, SambaNova RDU, CIM) | :51-59 | STALE | Groq LPU technology is now licensed to NVIDIA: https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale (Tier 2) "non-exclusive licensing agreement with Nvidia for Groq's inference technology". NVIDIA now ships "NVIDIA Groq 3 LPX" racks in the Vera Rubin platform (NVIDIA blog 2026-03-16, Tier 2). | "... Groq LPU (now also inside NVIDIA's Vera Rubin platform as the Groq 3 LPX rack), ..." |
| 1.11 | "GPU SMs ... do it with a warp scheduler and no speculation" | :89-91 | UNKNOWN | No NVIDIA statement on branch speculation in SMs located (tried PTX ISA 9.4 and product pages). | Keep as conventional description or soften to "with a warp scheduler that hides latency by switching warps". |
| 1.12 | "AWS Trainium does not do it at runtime at all - the Neuron compiler emits a NEFF ... and the runtime plays it back" | :91-93 | STALE | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html (Tier 1): "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4." | "On Trainium the Neuron compiler fixes most of the schedule ahead of time in a NEFF; Trainium3 adds ISA support for dynamic shapes and control flow." |
| 1.13 | "Cerebras WSE-3 bakes the program into per-PE state so there is no runtime front end" | :93-95 | WRONG | https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk (Tier 2): "Each PE has its own 48 kB of memory ... containing both instructions and data", "a chunk of executable code known as a task may be activated by its arrival ... a program's state is determined by the flow of data." | "Each of the 900,000 PEs runs its own small program from 48 kB of local SRAM; tasks fire when data arrives, so there is no global scheduler." |
| 1.14 | "GPU SM: ... SMEM and (on Blackwell) TMEM" | :101-104 | CORRECT | PTX ISA 9.4 (Tier 1) tcgen05 Tensor Memory sections; P3 confirmed TMEM geometry. | Keep. |
| 1.15 | "On Trainium: SBUF ... and PSUM" | :104 | CORRECT | Neuron docs Trainium2/3 pages reference SBUF (e.g. "SBUF-to-SBUF All-Gather", Tier 1). | Keep. |
| 1.16 | "AMX tile registers on Intel Xeon 6 hold 16 rows of up to 64 bytes" | :113-114 | CORRECT | Intel AMX intrinsics code sample (Tier 2, intel.com, seen via search result, not fetched): MAX_ROWS 16, MAX_COLS 64 (1 KB per tile, 8 tiles). | Keep. |
| 1.17 | "Blackwell tcgen05 reads TMEM tiles in specific shapes" | :114 | CORRECT | PTX ISA 9.4 (Tier 1) "Data Path Layout Organization ... Layout A (M = 256)". | Keep. |
| 1.18 | "A branch mispredict on an out-of-order core costs 15-20 cycles" | :161-162 | WRONG | LLVM scheduling models at tag llvmorg-19.1.0 (Tier 1 code, compiler cost estimates): Neoverse V2 `MispredictPenalty = 10`, Sapphire Rapids 14, Zen 4 13. AMD Zen 4 SOG reports 11-18 cycles, common case 13 (seen via search, not fetched). The stated range excludes the common cases. | "roughly 10-20 cycles depending on the core". |
| 1.19 | "A schedule slip on Trainium is compiler-visible ... a compile-time artifact rather than a runtime surprise" | :163-165 | UNKNOWN | No AWS statement found that Trainium has no runtime variance; collectives and DMA run at runtime, and Trainium3 adds dynamic control flow (1.12). | Soften: "most of the schedule is fixed at compile time, so stalls are largely visible in the compiled schedule". |
| 1.20 | "fabric congestion event on WSE-3 ... either the plan avoided it or the model does not fit" | :166-167 | WRONG | https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed (Tier 2): "When models exceed the memory capacity of a single wafer, we split them at layer boundaries and map them to multiple CS-3 systems." A model that does not fit on one wafer is pipelined across wafers. | "... handled by static routing chosen at compile time; models larger than one wafer are split at layer boundaries across several CS-3 systems." |
| 1.21 | "Sections 9-18 take each silicon family in turn" | :190-191 | WRONG | App.tsx:151-163: silicon families run 9 (Graviton) to 21 (Compute-in-Memory). | "Sections 9-21". |
| 1.22 | "Section 4 walks the seven-tier memory hierarchy", "Section 6 ... HBM", "Sections 22-26 ... software techniques" | :187-195 | CORRECT | App.tsx:146-168; MemoryHierarchyTower.tsx:14-62 has seven tiers. | Keep. |
| 1.23 | Triangle diagram labels (instruction / data / shape / functional unit) | TriangleDiagram.tsx:30-106 | CORRECT | Conceptual labels, no quantitative claims. | Keep. |

### Recommended edits (Section 1)
1. Replace "3,958 TFLOPS of FP8" and "825" with the dense pair (1,979 TFLOPS, 412 FLOPs/byte) and show the sparse number only as a labelled aside (1.4, 1.6).
2. Fix the Trainium and Cerebras front-end sentences (1.12, 1.13, 1.20) and the mispredict range (1.18).
3. "Sections 9-18" to "Sections 9-21" (1.21).
4. Name NVIDIA's Groq 3 LPX in the heterogeneity list (1.10): it is the strongest 2026 evidence for the section's own thesis, a GPU vendor shipping an SRAM-only bandwidth engine next to its GPUs.
- CUT candidate: the SXM expansion (1.3), unsourced and adds nothing.

---

## Section 2 - HeterogeneityFact.tsx

**What the section covers.** Frames 2026 inference silicon as different execution models (OoO cores, SIMT GPUs, compile-time systolic arrays, wafer-scale dataflow, CIM), with a bet-comparison table and per-architecture stall semantics.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Host core shape "SVE2 (Arm), AVX-512, AMX tiles (Xeon 6)" | HeterogeneityFact.tsx:24 | CORRECT | https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md (Tier 1): "Graviton4 and Graviton5 support SVE2 and SVE"; https://aws.amazon.com/ec2/instance-types/m8i/ (Tier 2): "Advanced Matrix Extensions (AMX) with FP16 support on M8i". AVX-512 not re-verified this pass. | Keep. |
| 2.2 | NVIDIA row "tcgen05 / wgmma", "Tensor-core tiles at FP4 - FP64" | :29-31 | CORRECT | PTX ISA 9.4 (Tier 1). Hopper's smallest format is FP8 (NVFP4 blog Figure 1, Tier 2); B300 cuts FP64 to "10 TFLOPS" per 8-GPU HGX vs 296 for HGX B200 (HGX page, Tier 2). | "FP8-FP64 (Hopper), FP4-FP64 (Blackwell; B300 FP64 is cut to 1.25 TFLOPS per GPU)". |
| 2.3 | Trainium row "no runtime scheduler", "Schedule slip visible in NEFF, not at runtime" | :36-39 | STALE | Trainium3 doc (Tier 1): "supports dynamic shapes and control flow, via ISA extensions". | "Compiler-built schedule (NEFF); Trainium3 adds dynamic control flow". |
| 2.4 | Cerebras row "Static dataflow, per-PE program, no global scheduler" | :43 | CORRECT | Cerebras SDK blog (Tier 2), see 1.13. | Keep. |
| 2.5 | Cerebras row "Entire model in on-wafer SRAM - no external DRAM in steady state" | :44 | WRONG | WSE-3 press release https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine (Tier 2): "44GB on-chip SRAM", "External memory: 1.5TB, 12TB, or 1.2PB" (training). Inference splits models across CS-3 systems (1.20). | "Inference: weights stay in on-wafer SRAM (44 GB per wafer), larger models pipeline across several wafers; training streams weights from external memory." |
| 2.6 | CIM row "HBM-PIM / HyperCIM" | :49-53 | UNKNOWN | No source attached in the section. HyperCIM is a seed-stage UK startup marketing a data-preprocessing "Latency Processing Unit" (company profiles, Tier 3; vendor site not fetched). | CUT HyperCIM (see edits). Keep HBM-PIM only with a specific Samsung source. |
| 2.7 | "Trn2 UltraServer (Trainium2 with 64-chip coherent domain)" | :84-85 | WRONG | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html (Tier 1): 64 chips, "connected together via the NeuronLink-v3 chip-to-chip interconnect"; no coherence is documented. | "64-chip NeuronLink domain". |
| 2.8 | "P5 (Hopper), P6 (Blackwell)" | :84 | CORRECT | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (Tier 1) lists p5, p5e, p5en, p6-b200, p6-b300, p6e-gb200. | Keep. |
| 2.9 | "a Groq rack" | :85 | STALE | Groq now operates GroqCloud as "the premier neocloud" and is an NVIDIA Cloud Partner bringing "NVIDIA Groq 3 LPX and Vera Rubin NVL72 to Market" (groq.com/newsroom, Tier 2). | "an NVIDIA Groq 3 LPX rack (or GroqCloud)". |
| 2.10 | "an M8i fleet with AMX" | :85-86 | CORRECT | M8i page (Tier 2), see 2.1. | Keep. |
| 2.11 | NEW: current comparison set | :84-86 | NEW | Trn3 UltraServers: https://aws.amazon.com/ec2/instance-types/trn3/ (Tier 2) "scale up to 144 Trainium3 chips"; Neuron Trn3 arch (Tier 1): Gen1 64 chips and Gen2 144 chips. Rubin: NVIDIA 10-Q for quarter ended 2026-07-26 (Tier 1): "Vera Rubin, began production shipments in the third quarter of fiscal year 2027". No Rubin or Trn3 instance appears in the EC2 accelerated-instance doc as of 2026-10-16. | Add Trn3 UltraServer and (as availability allows) Rubin to the list. |
| 2.12 | "per-vendor sections (8-19) carry the Tier 1 inline citations" | :117-119 | WRONG | App.tsx:151-163: vendor sections are 9-21. | "sections 9-21". |
| 2.13 | "Mispredict cost: ~15-20 cycles" | :153 | WRONG | Same as 1.18. | "~10-20 cycles". |
| 2.14 | "Cache miss cost: hundreds of cycles" | :154 | CORRECT | Pond (arXiv 2203.00241, Tier 1) models local DRAM at 85 ns; at 3-4 GHz that is 250-350 cycles [derived]. | Keep. |
| 2.15 | Trainium "Recovery: none at runtime - the NEFF is the schedule", "Visible to compiler: entirely" | :171-174 | STALE | Trainium3 dynamic control flow (2.3). | Qualify for Trainium3. |
| 2.16 | WSE-3 "Visible to compiler: entirely - there is no dynamic arbitration" | :183 | WRONG | Cerebras SDK blog (Tier 2): tasks are "activated by" data arrival, so execution order is decided at runtime by data flow; routes are fixed at compile time. | "routes are fixed at compile time; which task runs next is decided by arriving data". |
| 2.17 | "On Trainium, the schedule is static, so the wall-clock time equals the NEFF prediction with no runtime variance" | :196-198 | UNKNOWN | No AWS source states this. Collectives over NeuronLink/EFA run at runtime, and Trainium3 adds dynamic control flow (Tier 1). | Delete "with no runtime variance"; say "has far less runtime variance than a GPU, because the compiler fixed most of the schedule". |
| 2.18 | "Row entries compiled from vendor documentation ... Neuron ... (accessed 2026-04-23)" | :116-123 | STALE | Access date predates this refresh. | Re-date to 2026-10-16 after edits. |

### Recommended edits (Section 2)
1. Remove "coherent" (2.7), fix the Cerebras data row (2.5), the Trainium rows (2.3, 2.15), and the WSE-3 arbitration line (2.16).
2. Replace "a Groq rack" with the LPX rack and add Trn3 (2.9, 2.11).
3. Fix "8-19" to "9-21" and the mispredict range (2.12, 2.13).
- CUT candidate: the HyperCIM mention in the CIM row (2.6). It is a seed-stage startup with no shipping product a reader can compare or buy, so it fails both the mental-model and the practical test.
- CUT candidate: "no runtime variance" in the benchmark-transplant expandable (2.17), an absolute nobody publishes.

---

## Section 3 - RooflineAndArithmeticIntensity.tsx (+ RooflineChart.tsx)

**What the section covers.** Defines the roofline, tabulates H100/H200 ridge points, places decode, prefill and GEMM on the chart, and lists batching, fusion and precision as the levers that move a workload along the x-axis.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Williams, Waterman, Patterson, "Roofline...", CACM, April 2009 | RooflineAndArithmeticIntensity.tsx:59-65 | CORRECT | Crossref for doi 10.1145/1498765.1498785 (Tier 1): CACM vol 52 issue 4, 2009-04, authors Williams, Waterman, Patterson. | Keep. |
| 3.2 | "held up across fifteen years" | :67 | STALE | 2009 to 2026 is seventeen years [derived]. | "seventeen years". |
| 3.3 | H100 SXM FP8 (sparse) 3,958 TFLOPS, 3.35 TB/s, ridge 1,181 | :22-26 | CORRECT | https://www.nvidia.com/en-us/data-center/h100/ (Tier 2): "FP8 Tensor Core * 3,958 teraFLOPS", "3.35TB/s", "* With sparsity". | Keep the row; add a dense column: 1,979 TFLOPS, ridge 591. |
| 3.4 | H200 SXM FP8 (sparse) 3,958, 4.8 TB/s, ridge 825 | :29-33 | CORRECT | H200 page (Tier 2). | Keep; add dense 1,979, ridge 412. |
| 3.5 | "H200 SXM - BF16 tensor 1,979 TFLOPS ... ≈ 412" | :36-40 | WRONG | H200 page (Tier 2): "BFLOAT16 Tensor Core² 1,979 TFLOPS", "2 With sparsity." Dense BF16 = 989.5, ridge 206 [derived]. The 412 equals the dense FP8 ridge. | "H200 SXM - BF16 dense 989.5 TFLOPS, ridge ≈ 206 (412 is the dense FP8 ridge)". |
| 3.6 | "All vendor-cited figures accessed 2026-04-23" | :139 | STALE | Refresh. | 2026-10-16. |
| 3.7 | Alert "UNKNOWN - B200 and B300 ... Per-GPU HBM bandwidth ... not on the pages fetched" | :140-146 | STALE | Now resolvable. DGX B200 page (Tier 2): "1,440 GB total, 64 TB/s HBM3e bandwidth" (8 TB/s per GPU [derived]); GB300 NVL72 page (Tier 2): "20 TB \| Up to 576 TB/s" (8 TB/s per GPU [derived]). | Replace the alert with B200 and B300 rows from the ridge table at the top of this file. |
| 3.8 | "NVIDIA HGX B200/B300: 1.8 TB/s GPU-to-GPU, 14.4 TB/s total NVLink" | :143 | CORRECT | https://www.nvidia.com/en-us/data-center/hgx/ (Tier 2): "NVLink GPU-to-GPU Bandwidth 1.8 TB/s", "Total NVLink Bandwidth 14.4 TB/s". P3 §0.4: 1.8 TB/s is bidirectional (900 GB/s each way); still unlabelled. | Add "bidirectional". |
| 3.9 | NEW: Rubin, MI355X, Trainium2, Trainium3 ridge rows | :20-42 | NEW | See ridge table: Rubin HBM4 22 TB/s (HGX page, Tier 2) with production shipments since Q3 FY2027 (NVIDIA 10-Q, Tier 1); MI355X 8 TB/s (amd.com, Tier 2); Trainium2/3 (Neuron docs, Tier 1). | Add rows; label Rubin NVFP4 inference as sparse. |
| 3.10 | "Prefill on a long prompt sits near the ridge"; "Decode at batch 1 sits two orders of magnitude below the ridge" | :96-103 | CORRECT | [derived] see 3.11 and 3.13. | Keep "two orders"; prefill sits well above the ridge, see 3.24. |
| 3.11 | "on a 4k-token prompt at batch 16 the intensity easily clears the H200 ridge. Prefill is compute-bound" | :167-170 | CORRECT | [derived] linear-layer intensity is about 2 FLOPs per weight byte per token in the batch; 65,536 tokens per weight read is far above 412. | Keep. |
| 3.12 | "Intensity is roughly 2 FLOPs per parameter byte per token for a dense model. On an FP16 model at batch 1 that is ~2 FLOPs/byte" | :177-179 | WRONG | [derived] 2 FLOPs per **parameter**; FP16 stores 2 bytes per parameter, so batch-1 intensity is about 1 FLOP/byte. ~2 FLOPs/byte holds for 8-bit weights. | "about 2 FLOPs per parameter per token: ~1 FLOP/byte for FP16 weights, ~2 for FP8". |
| 3.13 | "three orders of magnitude under H200's BF16 ridge of ≈ 412 FLOPs/byte" | :179-180 | WRONG | [derived] H200 dense BF16 ridge is 206 (3.5); 1 vs 206 is about 2.3 orders. Contradicts :100 in the same section. | "about two orders of magnitude under H200's dense BF16 ridge of ≈ 206". |
| 3.14 | "a decode TPS estimate is computable from the spec sheet: HBM bandwidth divided by active parameter bytes per token" | :186-188 | CORRECT | [derived] memory-bound upper bound per sequence at batch 1. | Add "plus KV-cache bytes read per token". |
| 3.15 | "every successful technique for accelerating decode - GQA, KV-cache quantization, FlashAttention-class fusion, speculative decoding, disaggregated prefill/decode - works by changing arithmetic intensity" | :188-191 | WRONG | Disaggregation does not change a phase's intensity; DistServe (arXiv 2401.09670, Tier 1, author-measured) gets its "7.4x more requests or 12.6x tighter SLO" by assigning prefill and decode to different GPUs to remove interference. | "GQA, KV quantization, fusion and speculative decoding change bytes per useful FLOP; disaggregation removes prefill/decode interference and lets each phase be sized separately." |
| 3.16 | "Two concurrent decode streams double arithmetic intensity ... Sixty-four streams raise it 64x" | :208-210 | CORRECT | [derived] for the weight GEMMs. | Add the limit: attention does not batch this way, each sequence reads its own KV cache, so its intensity stays near constant as batch grows [derived]. |
| 3.17 | Servers "vLLM, TensorRT-LLM, SGLang, Neuron-Distributed" do continuous batching | :210-211 | CORRECT | Current releases: vLLM v0.31.0 (2026-10-05), TensorRT-LLM v1.2.1 (2026-04-20), SGLang v0.5.21 (2026-10-02), Neuron 2.32.0 (2026-08-17) (GitHub releases / Neuron release notes, Tier 1). | Keep; "Neuron-Distributed" is now "NxD Inference" in Neuron docs. |
| 3.18 | "The ceiling on batch size is KV cache capacity" | :212-214 | CORRECT | Qualitative; consistent with KV derivation in P3 §2.1. | Keep. |
| 3.19 | "Section 22 covers the current state (FlashAttention-3, paged variants)" | :224-225 | STALE | https://github.com/Dao-AILab/flash-attention/releases/tag/fa4-v4.0.0.beta35 (Tier 1, 2026-10-14): FlashAttention-4 (CuTe DSL, Blackwell) is in public beta. | "(FlashAttention-3 on Hopper, FlashAttention-4 beta on Blackwell, paged variants)". |
| 3.20 | "Sections 14 and 16 cover the compiler surfaces - CUTLASS / CuTe / Triton on NVIDIA, NKI on Trainium" | :225-226 | WRONG | App.tsx:158,160: NVIDIA compilers = 16, AWS compilers = 18. | "Sections 16 and 18". |
| 3.21 | "FP8 roughly doubles arithmetic intensity versus BF16" | :229-231 | CORRECT | [derived] halves weight bytes. | Keep. |
| 3.22 | "NVFP4 (E2M1) and MXFP8 push further" | :231 | WRONG | https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf (Tier 1, OCP MX v1.0, Sep 2023) Table 1: MXFP8 elements are 8 bits with an 8-bit E8M0 scale per 32, the same byte count as FP8 (+1/32). | "NVFP4 and MXFP4 push further". |
| 3.23 | "Section 21 covers the full precision ladder" | :232-233 | WRONG | App.tsx:163,167: 21 is Compute-in-Memory, 25 is Quantization. | "Section 25". |
| 3.24 | "Modern silicon generations raise FLOPs faster than bandwidth, so the ridge drifts right each generation" | :253-255 | STALE | Ridge table [derived from Tier 1/2 specs]: at fixed precision the ridge is flat or falls (BF16 H100 295, B200 281, Rubin 182; FP4 GB300 1,875, Rubin 1,591 dense). Rubin's HBM4 at 22 TB/s (HGX page) is 2.75x B300. | "Each step down in precision moves the ridge right on the same chip; HBM generations (HBM4 on Rubin) pull it back left. Which way your workload moves depends on whether you adopt the new precision." |
| 3.25 | "architectures that avoid the HBM tier altogether (Cerebras, compute-in-memory)" | :257-258 | NEW | NVIDIA Groq 3 LPX (Tier 2, NVIDIA blog 2026-03-16): "500 MB of high-speed on-chip SRAM serves as the primary working storage"; NVIDIA 10-Q (Tier 1) records a payment "related to the Groq, Inc. non-exclusive license agreement". | Add LPX as the mainstream SRAM-only example. |
| 3.26 | Chart point "Decode (batch 1) ~2 FLOPs/byte" | RooflineChart.tsx:15 | WRONG | Inconsistent with the section's FP16 framing (3.12): FP16 batch 1 = ~1. | Label "Decode (batch 1, FP8 weights) ~2". |
| 3.27 | Chart point "Decode (batch 64) ~128 FLOPs/byte" | RooflineChart.tsx:16 | CORRECT | [derived] 2 x 64 with 8-bit weights. | Label "FP8 weights". |
| 3.28 | Chart point "Prefill (long prompt) ... near ridge" drawn at x=55, left of ridgeX=65, on the memory-bound slope | RooflineChart.tsx:17,29,114-117 | WRONG | Contradicts :163 and 3.11 (long-prompt prefill is far above the ridge). | Move prefill to the compute ceiling (x > 65). |
| 3.29 | Comment "ridge ... for H200 BF16 ~412 FLOPs/byte" | RooflineChart.tsx:28 | WRONG | See 3.5. | "H200 dense FP8 ~412". |

### Recommended edits (Section 3)
1. Split every FLOPS cell into dense and sparse, fix the BF16 row (3.5), and replace the UNKNOWN alert with B200, B300, Rubin, MI355X, Trainium2 and Trainium3 rows (3.7, 3.9).
2. Fix the FP16 intensity arithmetic and the "three orders" sentence (3.12, 3.13), and align the chart labels and prefill placement (3.26, 3.28, 3.29).
3. Replace the "ridge drifts right each generation" paragraph with the precision-step mental model (3.24). This is the strongest new mental model the refresh produces: the reader's precision choice moves the ridge more than the chip generation does.
4. Fix section cross-references (3.20, 3.23) and "MXFP8" (3.22); soften 3.15.
5. Add one line on attention: batching raises weight-GEMM intensity but not attention intensity, because each sequence reads its own KV (3.16).

---

## Section 25 - QuantizationAndPrecision.tsx (+ PrecisionLadder.tsx)

**What the section covers.** Bytes per value as the decode lever; a precision ladder FP64 to FP4; a format table with silicon support; NVFP4 vs MXFP4; block scaling; composition with batching, fusion and MoE.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 25.1 | "Section 23 (MoE) showed NVFP4 cutting DeepSeek-V3.2 from 690 GB FP8 to 415 GB" | QuantizationAndPrecision.tsx:50-51 | CORRECT | Numbers reproduce from checkpoint sizes (Tier 1): deepseek-ai/DeepSeek-V3.2 at a7e62ac04ecb2c0a54d736dc46601c5606cf10a6 = 689.5 GB of safetensors; nvidia/DeepSeek-V3.2-NVFP4 at 7c0f62c6da1da0c81c6e097010cc55854d206812 = 415.1 GB. | Keep the numbers; fix the citation (25.17). |
| 25.2 | "Halve the bytes, roughly double the throughput - until something else binds" | :59-60 | CORRECT | [derived] memory-bound regime. | Keep. |
| 25.3 | "FP32 master weights, BF16 or FP8 tensors during training, FP8 / FP4 / INT8 weights at inference" | :82-83 | STALE | Low-bit weights now come out of training: Kimi K2 Thinking config (a51ccc05, Tier 1) INT4 group-32 weights; Kimi K2.5 card "adopts the same native int4 quantization"; Kimi K3 card (f831ab66, Tier 1): "quantization-aware training from the SFT stage onward, using MXFP4 weights with MXFP8 activations"; DeepSeek-V4-Pro config (72e1d323): `expert_dtype: fp4`, `scale_fmt: ue8m0`; NVFP4 pretraining demonstrated in arXiv 2509.25149 (Tier 1, author-measured). | "... and a growing set of models trained or post-trained to ship 4-bit weights natively (gpt-oss MXFP4, Kimi K2.5 INT4, Kimi K3 MXFP4, DeepSeek-V4 FP4 experts)." |
| 25.4 | FP64 "All GPUs (HPC paths only)" | :21 | STALE | HGX page (Tier 2): HGX B300 "FP64/FP64 Tensor Core 10 TFLOPS" vs HGX B200 296; Rubin GPU "FP64 33 TFLOPS". | "All GPUs; Blackwell Ultra (B300) cuts FP64 to about 1.25 TFLOPS per GPU". |
| 25.5 | FP32 "All silicon", 4 bytes | :22 | CORRECT | IEEE 754 binary32. | Keep. |
| 25.6 | TF32 "NVIDIA Ampere onward", "4 storage / 19 mantissa" | :23 | WRONG | PTX ISA 9.4 (Tier 1): tf32 has "the same range as .f32 and reduced precision (>=10 bits)". 19 bits total = 1 sign + 8 exponent + 10 mantissa. Trainium also supports TF32: Neuron data types page (Tier 1) lists "TensorFloat-32 (TF32)". | "4 bytes in memory; 8-bit exponent, 10-bit mantissa (19 significant bits). NVIDIA Ampere onward, Trainium." |
| 25.7 | BF16 "All modern training silicon", 2 bytes | :24 | CORRECT | Neuron data types (Tier 1); H200/B200/MI355X pages (Tier 2). | Keep. |
| 25.8 | FP8 E4M3 / E5M2 ship on "Hopper / Blackwell / Trainium" | :26-27 | CORRECT | Neuron data types (Tier 1) lists FP8_e4m3, FP8_e5m2, FP8_e3m4 (cFP8); AMD MI355X "OCP-FP8 ... (E5M2, E4M3)" (Tier 2). | Add AMD MI300/MI355X. |
| 25.9 | E4M3 "Forward pass tensors", E5M2 "Backward gradients" | :26-27 | STALE | DeepSeek-V3 report (arXiv 2412.19437, Tier 1): "we adopt the E4M3 format on all tensors for higher precision", enabled by tile- and block-wise scaling. Open checkpoints ship block-scaled FP8 E4M3 (DeepSeek-V3/V3.2, GLM-5.3, Kimi K2: `fmt e4m3`, `weight_block_size [128,128]` in config, Tier 1). | "E4M3 everywhere with fine-grained block scales is now the common recipe; E5M2 for gradients is the older Transformer Engine default." |
| 25.10 | NVFP4 "Blackwell only" | :28 | STALE | HGX page (Tier 2): Rubin "NVFP4 Inference 50 PFLOPS" (sparse), "NVFP4 Training 35 PFLOPS"; Rubin "began production shipments in the third quarter of fiscal year 2027" (NVIDIA 10-Q, Tier 1). | "NVIDIA Blackwell and Rubin". |
| 25.11 | MXFP4 "Multi-vendor (OCP)", block-32 | :29 | CORRECT | OCP MX v1.0 Table 1 (Tier 1): "MXFP4 FP4 (E2M1) 4 ... 32 E8M0 8". Vendors: NVIDIA Blackwell (NVFP4 blog Table 1, Tier 2), AMD MI355X "MXFP4 ... 10.1 PFLOPs" (Tier 2), Trainium3 "MXFP8/MXFP4" (Neuron docs, Tier 1). | Name the three vendors. |
| 25.12 | INT8 "All silicon (CPU, GPU, Trainium)" | :30 | WRONG | Neuron data types (Tier 1) list UINT8 but no signed INT8 compute type, and Trainium2/3 publish no INT8 TOPS. NVIDIA: HGX B300 "INT8 Tensor Core 3 POPS" vs B200 72 POPS; Rubin INT8 250 TOPS vs FP8 17.5 PFLOPS (HGX page, Tier 2). | "CPUs (AMX, SVE), Hopper, B200, AMD; de-emphasised on B300 and Rubin; not a published Trainium compute type". |
| 25.13 | NVFP4: E2M1, block 16, E4M3 scale per block + FP32 per tensor, "3.5x over FP16 and 1.8x over FP8" | :126-131 | CORRECT | https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/ (Tier 2): "fine-grained FP8 scale to each 16-value micro-block and a second-level FP32 scalar per tensor", "approximately 3.5x relative to FP16 and 1.8x compared to FP8". | Keep. |
| 25.14 | "Native Tensor Core support via tcgen05.mma" | :130-131 | CORRECT | PTX ISA 9.4 (Tier 1): `.kind::mxf4nvf4` for tcgen05; also `mma.sync ... kind::mxf4nvf4.block_scale ... .ue4m3` for warp-level MMA. | Optional: "via tcgen05.mma, and block-scaled mma.sync". |
| 25.15 | MXFP4: "block size 32, single E8M0 scaling factor" | :145-147 | CORRECT | OCP MX v1.0 (Tier 1). | Keep. |
| 25.16 | "GPT-OSS-120B uses MXFP4 on its MoE weights" | :149 | CORRECT | openai/gpt-oss-120b config at b5c939de8f754692c1647ca79fbf85e8c1e70f8a (Tier 1): `quant_method: mxfp4`, `modules_to_not_convert`: attention, router, embeddings, lm_head; README: "post-trained with MXFP4 quantization of the MoE weights". | Keep. |
| 25.17 | Alert: "NVIDIA reports DeepSeek-V3.2 at NVFP4 occupies 415 GB versus 690 GB at FP8 - a 1.7x reduction with negligible accuracy loss" cited to the InferenceMAX blog | :153-163 | WRONG | P3 §0/§10.9 still applies: https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/ (Tier 2) contains neither 415 nor 690 and discusses DeepSeek-R1. Correct source: nvidia/DeepSeek-V3.2-NVFP4 README at 7c0f62c6 (Tier 1, vendor-measured accuracy): "reducing the disk size and GPU memory requirements by approximately 1.66x"; MMLU Pro 0.802 to 0.799, GPQA Diamond 0.849 to 0.835, AIME 2025 0.934 to 0.923. | "DeepSeek-V3.2 drops from 690 GB (FP8) to 415 GB (NVFP4), about 1.66x, with benchmark scores within about 1.5 points of FP8 (NVIDIA-measured)." Cite the two Hugging Face repos at their SHAs. |
| 25.18 | "4 bits gives you 16 distinct values" | :183-185 | CORRECT | OCP MX v1.0: E2M1 is a 4-bit code (16 codes, ±0 share a value) [derived]. | Keep. |
| 25.19 | Block sizes "16 or 32 elements" | :187 | CORRECT | NVFP4 blog, OCP MX v1.0. | Keep. |
| 25.20 | "FP8 forward + FP8 backward training is now standard for many models" | :205-206 | CORRECT | DeepSeek-V3 FP8 training (arXiv 2412.19437, Tier 1). | Add FP4: NVFP4 pretraining (arXiv 2509.25149) and MXFP4 QAT (Kimi K3). |
| 25.21 | "KV-cache quantization (FP8 or INT8) is increasingly common" | :211-213 | STALE | DeepSeek-V4-Pro README (72e1d323, Tier 1) serves with `--kv-cache-dtype fp8`; DeepSeek-V4.1-Flash README (314113f8, Tier 1): "FP4 main KV caching (E2M1 format, one E4M3 scale per 16 channels)", "890 bytes per token". | "FP8 KV cache is now a default in serving recipes, and FP4 KV caches have appeared (DeepSeek-V4.1-Flash)." |
| 25.22 | "MoE selects only a fraction of weights per token - arithmetic intensity rises by the (k/N) ratio" | :234-235 | WRONG | [derived] MoE cuts FLOPs and bytes per token together, so batch-1 intensity is unchanged; at batch B each expert sees about B·k/N tokens, so expert-GEMM intensity **falls** by k/N against a dense layer at the same batch. DeepSeek-V3 report (Tier 1): "the batch size per expert is relatively small (usually within 256 tokens), and the bottleneck is memory access rather than computation." | "MoE cuts the bytes (and FLOPs) per token; it lowers per-expert arithmetic intensity, which is why MoE decode needs large batches and wide expert parallelism to stay efficient." |
| 25.23 | "All four levers are multiplicative ... an MoE model in NVFP4 ... can be compute-bound" | :236-238 | WRONG | Follows from 25.22: MoE pushes intensity the other way. | "Precision, batching and fusion raise intensity; MoE lowers bytes per token but also per-expert intensity, so it needs batching to pay off." |
| 25.24 | "NVIDIA Wide-EP with NVFP4 MoE on NVL72" | :241-242 | CORRECT | https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0 (Tier 1): "Add TRTLLM MoE nvfp4 cubins for mid-high concurrency"; wide_ep example at https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep. | Keep. |
| 25.25 | "AWS Neuron MoE NKI with FP8 on Trn2 UltraServer" | :242 | STALE | NKI Library release notes (Tier 1): MoE core kernels (Router Top-K, MoE CTE, MoE TKG) arrived in Neuron 2.28.0; "Existing kernels receive FP8 and MX quantization support"; Blockwise MM Forward MXFP8 in 2.32.0 (2026-08-17). | "Neuron NKI MoE kernels with FP8/MXFP8 on Trn2 and Trn3". |
| 25.26 | "vLLM with FlashInfer FP4 cubins" | :242-243 | CORRECT | vLLM v0.31.0 `MoEBackend` includes "flashinfer_trtllm", "flashinfer_cutlass", "flashinfer_cutedsl" (vllm/config/kernel.py at tag, Tier 1). | Keep. |
| 25.27 | Ladder FP64 "~10^308", FP32 "~10^38" | PrecisionLadder.tsx:14-15 | CORRECT | IEEE 754 max values (about 1.8e308, 3.4e38). | Relabel the column "max magnitude" (see 25.30). |
| 25.28 | Ladder TF32 "bits 19, FP32 storage, FP19 mantissa" | PrecisionLadder.tsx:16 | WRONG | PTX ISA 9.4 (Tier 1), see 25.6. | "19 significant bits: 8-bit exponent, 10-bit mantissa; stored as 4 bytes". |
| 25.29 | Ladder BF16 "FP32 dynamic range, 7-bit mantissa" | PrecisionLadder.tsx:17 | CORRECT | BF16 = 1/8/7 bits. | Keep. |
| 25.30 | Ladder FP16 "~10^4 dynamic range" | PrecisionLadder.tsx:18 | WRONG | FP16 max is 65,504 (about 6.5e4), but max/min-normal dynamic range is about 1e9 [derived from IEEE 754]. The label mixes "max value" and "dynamic range". | "max ≈ 6.5×10^4". |
| 25.31 | Ladder FP8 E4M3 "~10^4 - forward" | PrecisionLadder.tsx:19 | WRONG | OCP MX v1.0 (Tier 1): E4M3 "Max normal ... ± 448". | "max ±448". |
| 25.32 | Ladder FP8 E5M2 "~10^15 - backward" | PrecisionLadder.tsx:20 | WRONG | OCP MX v1.0 (Tier 1): E5M2 "± 57,344". | "max ±57,344". |
| 25.33 | Ladder NVFP4 "~ -6 to 6", "Blackwell - block-16, dual-level scale" | PrecisionLadder.tsx:21 | STALE | Range CORRECT (OCP MX v1.0: E2M1 "± 6.0"); "Blackwell" now also Rubin (25.10). | "Blackwell, Rubin - block-16, dual-level scale". |
| 25.34 | Ladder MXFP4 "similar - block-32", "OCP standard" | PrecisionLadder.tsx:22 | CORRECT | OCP MX v1.0. | Keep. |
| 25.35 | NEW: MXFP8 and MXFP6 as shipping formats | table :20-31 | NEW | OCP MX v1.0 defines MXFP8, MXFP6, MXFP4, MXINT8; Trainium3 is MXFP8/MXFP4-first ("Trainium3 supports FP32, BF16, MXFP8, and MXFP4 precision modes", AWS Trn3 page, Tier 2); AMD MI355X runs MXFP6 at the FP4 rate ("MXFP6 ... 10.1 PFLOPs", Tier 2); MiniMax-M3-MXFP8 checkpoint (c5454eb0, Tier 1) `quant_method: mxfp8`, `weight_block_size [1, 32]`. | Add an MXFP8 row (8 bits + E8M0 per 32; Blackwell, MI355X, Trainium3). |

### Recommended edits (Section 25)
1. Re-source the 415/690 GB number to the two Hugging Face checkpoints and the NVIDIA model card, change "1.7x" to "1.66x", and state the NVIDIA-measured accuracy deltas (25.17). This is the P3 must-fix #9, still open.
2. Fix TF32 (25.6, 25.28) and the FP16/FP8 range labels (25.30-25.32): relabel the column "max magnitude".
3. Update the "where it ships" column: NVFP4 on Rubin, INT8 de-emphasised on B300/Rubin and absent on Trainium, MXFP8 row (25.10, 25.12, 25.35).
4. Rewrite the composition paragraph so MoE is shown lowering per-expert intensity (25.22, 25.23). This is a mental-model error a reader would carry into capacity planning.
5. Add one short paragraph on natively 4-bit models (25.3): the practical consequence is that the precision decision increasingly comes with the checkpoint rather than being made at deployment.

---

## Section 23 - MoeAndSparseActivation.tsx (+ MoeRoutingDiagram.tsx, MoeParamsChart.tsx)

**What the section covers.** Routing math and per-token bytes, a lineup of MoE models (total vs active), per-silicon MoE support, the all-to-all tax, and where MoE breaks the dense playbook.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 23.1 | "The dominant frontier-model pattern in 2025-2026 is no longer dense transformers. It is MoE" | MoeAndSparseActivation.tsx:89-91 | CORRECT | Hugging Face API (Tier 1): every major open release since August 2026 is MoE: DeepSeek-V4-Pro-0813, DeepSeek-V4.1-Flash, Qwen3.8-2.4T-A95B, Kimi K3, GLM-5.3, MiniMax-M3, NVIDIA Nemotron 3.5 Super 120B-A12B. Counter-example: Mistral-Medium-3.5-128B config (22b2b868) has no expert fields (dense). | Keep. |
| 23.2 | "DeepSeek-V3 has 671B total parameters but activates only 37B" | :94-95 | CORRECT | deepseek-ai/DeepSeek-V3 README at e815299b0bcbac849fa540c768ef21845365c9eb (Tier 1): "671B total parameters with 37B activated for each token". | Keep. |
| 23.3 | "Kimi K2 has 1T total / 32B active" | :95 | CORRECT | Kimi-K2-Instruct config at fd1984e2b7a3350dbf7305fe73a4ede25c14de50 (Tier 1): 384 routed experts, top-8, 1 shared; safetensors total 1.026T; Kimi K2.5 card (4d01dfe0) "Total Parameters 1T, Activated Parameters 32B". | Keep. |
| 23.4 | "Mixtral 8x7B has 46.7B total / 12.9B active" | :95-96 | CORRECT | https://mistral.ai/news/mixtral-of-experts/ (Tier 2): "Mixtral has 46.7B total parameters but only uses 12.9B parameters per token"; HF safetensors 46.70B at fc7ac946 (Tier 1). | Keep. |
| 23.5 | "each token reads only the selected experts, so bytes-per-token drops by roughly the top-k / N ratio" | :102-104 | WRONG | [derived] DeepSeek-V3: top-k/N = 8/256 = 3.1%, but active/total = 37/671 = 5.5%, because attention, dense layers and the shared expert are always read. | "bytes per token drop to roughly active/total parameters". |
| 23.6 | "That single change moves decode workloads measurably to the right on the roofline" | :104-105 | WRONG | Same as 25.22: MoE lowers bytes and FLOPs per token together and lowers per-expert intensity (DeepSeek-V3 report, Tier 1, "bottleneck is memory access rather than computation"). | "MoE moves decode down the bandwidth axis (fewer bytes per token), not right; per-expert intensity falls unless batches are large." |
| 23.7 | "Cerebras gains because experts live in on-wafer SRAM" | :105-106 | CORRECT | Cerebras inference blog (Tier 2): weights on-chip; larger models split across CS-3 systems at layer boundaries (1.20). | Keep, add "per layer". |
| 23.8 | "AWS Trn2 UltraServer gains because the 64-chip coherent domain handles expert collectives over NeuronLink" | :106-107 | WRONG | No coherence documented (2.7). NxD Inference docs v2.32.0 (Tier 1): "Currently, Expert Parallelism uses All-Gather ... We are working on an optimized All-to-All-v primitive". | "Trn2 UltraServer puts 64 chips on NeuronLink; EP in NxD Inference still uses All-Gather." |
| 23.9 | "NVIDIA GB200 NVL72 was sized in part for MoE all-to-all" | :107-108 | CORRECT | NVIDIA blog (Tier 2, 2025-06-06): NVL72 an "ideal choice for serving MoE models with wide EP of 64 in disaggregated setup". | "NVIDIA positions NVL72 for wide-EP MoE". |
| 23.10 | Router "linear projection followed by a softmax and a top-k" | :133-134; MoeRoutingDiagram.tsx:83 ("top-k softmax") | STALE | DeepSeek-V3/V3.2/V4 and Kimi K2 configs (Tier 1): `scoring_func: sigmoid`, `topk_method: noaux_tc`; Kimi K3 `moe_router_activation_func: sigmoid`. Qwen3 and Mixtral use softmax. | "a softmax or sigmoid score and a top-k selection". Diagram: "top-k (softmax or sigmoid)". |
| 23.11 | "On a dense 70B model, decode reads ~70B parameter bytes per token" | :141-142 | CORRECT | [derived] at 8-bit weights; 140 GB at BF16. | Add "at 8-bit weights". |
| 23.12 | DeepSeek-V3 "top-8 of 256 + 1 shared" | :142-143 | CORRECT | Config at e815299b (Tier 1): `n_routed_experts 256`, `num_experts_per_tok 8`, `n_shared_experts 1`. | Keep. |
| 23.13 | "decode reads roughly 37B bytes per token ... about 18x less" | :143-145 | CORRECT | DeepSeek-V3 ships native FP8 E4M3 weights (config `quant_method fp8`, Tier 1), so 1 byte per parameter; 671/37 = 18.1 [derived]. | Keep. |
| 23.14 | Router "typically < 1% of layer FLOPs" | :149-150 | CORRECT | [derived from DeepSeek-V3 config] gate 7168 x 256 = 1.8M MACs vs 9 active experts x 3 x 7168 x 2048 = 396M MACs, about 0.5%. | Keep. |
| 23.15 | Lineup: Mixtral 8x22B 141B / 39B, top-2 of 8 | MoeParamsChart.tsx:13 | CORRECT | HF safetensors 140.6B at e1cd34ff1747406fb2277635ed25242803009bc2 (Tier 1). 39B active not re-fetched from Mistral. | Keep. |
| 23.16 | GPT-OSS 120B 117B / 5.1B, top-4 of 128 | MoeParamsChart.tsx:14 | CORRECT | README at b5c939de (Tier 1): "117B parameters with 5.1B active parameters"; config `num_local_experts 128`, `num_experts_per_tok 4`. | Keep. Optional: gpt-oss-20b 21B / 3.6B, 32 experts top-4 (6cee5e81). |
| 23.17 | DBRX 132B / 36B, top-4 of 16 | MoeParamsChart.tsx:15 | CORRECT | https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm (Tier 2): "132B total parameters of which 36B parameters are active", "16 experts and chooses 4". | Keep, or CUT as a 2024 model that no longer informs the reader. |
| 23.18 | Qwen3-235B-A22B 235B / 22B, top-8 of 128 | MoeParamsChart.tsx:16 | CORRECT | README at 8efa61729e24bd65b1d152b5ab5409052aa80e65 (Tier 1): "235B in total and 22B activated", "Number of Experts: 128", "Activated Experts: 8". | Keep. |
| 23.19 | Llama 4 Maverick 400B / 17B, top-1 of 128 + 1 shared | MoeParamsChart.tsx:17 | CORRECT | https://ai.meta.com/blog/llama-4-multimodal-intelligence/ (Tier 2): "17 billion active parameters, 128 experts, and 400 billion total", "Each token is sent to the shared expert and also to one of the 128 routed experts"; HF metadata at 73d14711 (gated, Tier 1 metadata): 401.6B. | Keep. |
| 23.20 | DeepSeek-V3 / R1 671B / 37B; Kimi K2 1000B / 32B, 384 + 1 shared, top-8 | MoeParamsChart.tsx:18-19 | CORRECT | See 23.2, 23.3. | Keep. |
| 23.21 | "Parameter counts ... All access dates 2026-04-24" | :170-195 | STALE | Refresh and pin. | Link each model's config.json at its SHA (listed in Sources). |
| 23.22 | "DeepSeek-V3 at 18:1 and Kimi K2 at 31:1 are the most aggressive" | :201-204 | WRONG | [derived from the chart's own rows] Llama 4 Maverick 400/17 = 23.5:1 and gpt-oss-120b 117/5.1 = 22.9:1 are sparser than DeepSeek-V3's 18:1. Newer models exceed Kimi K2: DeepSeek-V4-Pro 1.6T/49B = 33:1, DeepSeek-V4.1-Flash 552B/16B decode = 35:1 (Tier 1 cards). | "Kimi K2 (31:1) and DeepSeek-V4-Pro (33:1) are among the sparsest; DeepSeek-V3 is 18:1." |
| 23.23 | NEW lineup: DeepSeek-V4 family | MoeParamsChart.tsx:11-20 | NEW | DeepSeek-V4.1-Flash README at 314113f8a7dadb388215396ba5fbee2c610a04d6 (Tier 1) table: V4-Flash "284B" backbone / "13B" activated, V4-Pro "1.6T" / "49B", V4.1-Flash "552B" / "8B / 16B" (prefill / decode); configs: V4-Pro 384 routed + 1 shared, top-6, `expert_dtype fp4` (72e1d323); V4-Flash 256 + 1, top-6 (7872f01b). | Add DeepSeek-V4-Pro and V4-Flash rows. |
| 23.24 | NEW lineup: Qwen3-Next and Qwen3.8 | same | NEW | Qwen3-Next-80B-A3B-Instruct README at 9c7f2fbe (Tier 1): "80B in total and 3B activated", 512 experts, 10 activated + 1 shared. Qwen3.8-2.4T-A95B README at 207bd685 (Tier 1): "2.4T in total and 95B activated", 512 experts, "10 Routed + 1 Shared", hybrid Gated DeltaNet / gated attention. | Add Qwen3-Next (27:1) and Qwen3.8 (25:1). |
| 23.25 | NEW lineup: Kimi K3 | same | NEW | Kimi-K3 README / config at f831ab66 (Tier 1): "Total Parameters 2.8T", "Activated Parameters 104B", `num_experts 896`, `num_experts_per_token 16`, `num_shared_experts 2`, MXFP4 weights. | Add Kimi K3 (27:1). |
| 23.26 | NEW lineup: other 2025-2026 MoE | same | NEW | Mistral-Large-3-675B-Instruct-2512 README at 383ffea2 (Tier 1): "41B active parameters and 675B total"; MiniMax-M3 README at f0e1c1e0: "~428B parameters and ~23B activated", 128 experts top-4 + 1 shared; GLM-5.3 config at ba32f8c1: 256 routed + 1 shared, top-8, about 753B parameters by safetensors count (active count not published on the card: UNKNOWN). | Optional rows; keep the chart to about 10 models. |
| 23.27 | NVIDIA row: "Wide-EP (EP > 8) shipped in TensorRT-LLM v0.21.0" | :26 | CORRECT | https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.21.0 (Tier 1): "Added large-scale EP support"; EP > 8 definition in https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/blogs/tech_blog/blog4_Scaling_Expert_Parallelism_in_TensorRT-LLM.md: "large-scale EP (here means EP > 8)". | Keep. |
| 23.28 | NVIDIA row: "NVFP4 cubins for mid-high concurrency in v1.0" | :26 | CORRECT | v1.0.0 release notes (Tier 1): "Add TRTLLM MoE nvfp4 cubins for mid-high concurrency". P3 marked this UNSOURCEABLE; now sourced. | Keep with the release link. |
| 23.29 | NVIDIA row URL: the unpinned TensorRT-LLM `examples/wide_ep` link on the main branch | :30 | WRONG | Unpinned (CI gate `pinned-refs`). GitHub contents API (Tier 1): `examples/wide_ep` exists at tag v1.2.1 (latest stable, 2026-04-20) with README.md, ep_load_balancer, slurm_scripts; also at v1.0.0; absent at v0.21.0 (then `examples/ep_load_balancer`). | https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep |
| 23.30 | NVIDIA row fabric: "MNNVL at 1.8 TB/s per GPU; 130 TB/s aggregate across 72 GPUs" | :27 | CORRECT | GB300 NVL72 page (Tier 2): "NVLink Bandwidth 130 TB/s"; P3 §0.4: 1.8 TB/s is bidirectional. | Add "bidirectional (900 GB/s each way)". |
| 23.31 | NEW: NVIDIA's next MoE fabric | :25-31 | NEW | Vera Rubin POD blog (Tier 2): sixth-generation NVLink "delivers 3.6 TB/s of bandwidth per GPU and 260 TB/s of scale-up bandwidth per rack". LPX blog (Tier 2, 2026-03-16): "LPX accelerates the latency-sensitive portions of the decode loop, including FFN and MoE expert execution, while Rubin GPUs continue to handle prefill and decode attention." | Add a Vera Rubin NVL72 + LPX line. |
| 23.32 | Trainium row: "MoE NKI kernels (Router Top-K, MoE CTE, MoE TKG, Blockwise MM) shipped Neuron 2.27.0 (Dec 2025)" | :34 | WRONG | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nki-lib.html (Tier 1): 2.27.0 "introduces the NKI Library" with no MoE kernels; 2.28.0 "New core kernels include RoPE, Router Top-K, MoE CTE, MoE TKG, and Cumsum", plus experimental "Blockwise MM Backward for MoE training"; Blockwise MM Forward MXFP8 in 2.32.0 (2026-08-17). | "shipped in Neuron 2.28.0 (February 2026)". |
| 23.33 | Trainium row: "EP currently uses All-Gather; All-to-All-v is on the roadmap" | :34 | STALE | Doc-vs-release conflict (Tier 1 both): NxD Inference moe-arch-deep-dive at v2.32.0 still says All-Gather; NKI-Lib notes show `nki.collectives.all_to_all_v` in 2.29.0 and "RMSNorm Router Top-K A2AV ... feeding the all-to-all-v dispatch path" in 2.31.0 (2026-07-07). | "NxD Inference EP still documents All-Gather; an all-to-all-v primitive and A2AV kernels shipped in 2.29-2.31, mostly for training." |
| 23.34 | Trainium row fabric: "NeuronLink-v3: 1.28 TB/s per chip intra-node, 256 GB/s per chip inter-instance; 64-chip 3D Torus" | :35 | WRONG | Trainium2 page (Tier 1): "NeuronLink-v3 ... provides 1.28 TB/sec bandwidth per chip" (total). Trn2 arch (Tier 1): "Intra-instance NeuronLink-v3 bandwidth (GB/sec/chip) 1,024", "Inter-instance ... 256"; topology "4x4, 2D Torus" within an instance and a ring across the four instances. | "1,024 GB/s per chip within an instance plus 256 GB/s across instances (1.28 TB/s total); 4x4 2D torus per instance, rings across four instances." |
| 23.35 | NEW: Trainium3 fabric for MoE | :33-39 | NEW | Neuron Trn3 arch (Tier 1): "Trn3 UltraServers use a PCIe switch-based interconnect architecture for all chip-to-chip communication ... This replaces the point-to-point NeuronLink topology used in previous generations"; AWS Trn3 page (Tier 2): NeuronSwitch-v1 "all-to-all fabric", "reducing communication overhead for MoE". | Add a Trn3 UltraServer row. |
| 23.36 | Cerebras row: "Production MoE inference: Llama 4 Scout / Maverick, Qwen3-235B-A22B, GPT-OSS-120B, GLM-4.7" | :42 | STALE | https://inference-docs.cerebras.ai/models/overview (Tier 2): shared-inference catalog lists only "gpt-oss-120b" and "qwen-3.8-27b"; more models via Dedicated Inference. | "Shared inference serves gpt-oss-120b (vendor claim ~3,000 tokens/s); other MoE models via dedicated deployments." |
| 23.37 | Cerebras row: "Reported 2,522 tokens/s on Llama 4 Maverick (third-party benchmark)" | :42 | CORRECT | https://www.cerebras.ai/press-release/maverick (Tier 2, 2025-05-28) quotes Artificial Analysis (Tier 3): "2,522 tokens per second, compared to NVIDIA Blackwell's 1,038". Maverick no longer in the shared catalog. | Date it ("May 2025") or replace with the current gpt-oss-120b vendor claim. |
| 23.38 | Cerebras row fabric: "On-wafer SRAM, no HBM in steady state - expert switching is a wafer-internal routing event" | :43 | CORRECT | Correct per layer: models larger than one wafer are split "at layer boundaries" across CS-3 systems (Cerebras blog, Tier 2), so a layer's expert routing stays on one wafer while activations hop wafer to wafer. | Add "within a layer; layers pipeline across wafers". |
| 23.39 | Cerebras row precision "FP16 / BF16 published" | :44 | UNKNOWN | Not re-verified (current model pages not fetched). | Verify or drop. |
| 23.40 | Groq row: "Mixtral and Llama 4 Scout served on GroqCloud ... INT8 production" | :50-52 | STALE | https://console.groq.com/docs/models (Tier 2): production MoE models are openai/gpt-oss-120b and gpt-oss-20b; Mixtral and Llama 4 Scout are not listed. INT8 not re-verified (UNKNOWN). | "gpt-oss-120b and gpt-oss-20b on GroqCloud". |
| 23.41 | NEW: Groq / NVIDIA | :49-55 | NEW | Groq newsroom (Tier 2): non-exclusive license, "Jonathan Ross ... Sunny Madra ... will join Nvidia"; NVIDIA 10-Q (Tier 1): financing outflow "Groq, Inc. (2,944)" ($ millions) in H1 FY2027. NVIDIA Groq 3 LPX in the Vera Rubin platform runs MoE expert execution during decode (LPX blog, Tier 2). | Re-title the row "Groq LPU / NVIDIA Groq 3 LPX". |
| 23.42 | SambaNova row: "Samba-CoE ... 150 experts and 1T parameters; SN40L paper claims 3.7x DGX H100 on 8 sockets" | :58 | CORRECT | arXiv 2405.07518 abstract (Tier 1, author-measured): "Samba-CoE, a CoE system with 150 experts and a trillion total parameters", "overall speedup of 3.7x over a DGX H100". Note: CoE routes whole requests to whole models, not tokens to experts inside a layer. | Keep, add "Composition of Experts (request-level), not token-level MoE". |
| 23.43 | SambaNova row: "current product is SN50" | :58 | STALE | https://sambanova.ai/blog/introducing-the-sn50-rdu-purpose-built-for-agentic-inference (Tier 2, 2026-02-24): SN50 "will start shipping to customers in the second half of 2026". Shipping not confirmed by a source reached. | "SN50 announced February 2026, shipping H2 2026 (ROADMAP until confirmed)". |
| 23.44 | CIM row: "Samsung HBM-PIM ... no MoE benchmark ... HyperCIM publicly markets a multi-database / data-fabric LPU" | :65-71 | UNKNOWN | Cited link is the Samsung tech-blog index, which supports no specific claim. HyperCIM description matches company profiles (Tier 3) only. | CUT the row (see edits). |
| 23.45 | Quote "If the selected experts reside on GPUs that sit on different nodes ... such as InfiniBand." and "EP=64 (... 256 DeepSeek-R1 experts at 4 experts/GPU) ... at 1.8 TB/s per GPU" | :265-271 | CORRECT | https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/ (Tier 2, 2025-06-06): quote verbatim; "typically around four experts per GPU, which requires 64 GPUs"; "1.8 (TB/s)per GPU". The blog's speedup figures come from a simulator (VENDOR CLAIM). | Keep; add "bidirectional". |
| 23.46 | TensorRT-LLM "--moe_tp_size / --moe_ep_size with the constraint moe_tp_size x moe_ep_size = tp_size" | :286-288 | STALE | https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/legacy/advanced/expert-parallelism.md (Tier 1, legacy flow); current LLM API uses `moe_expert_parallel_size`, `moe_tensor_parallel_size`, `moe_cluster_parallel_size`; https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/mapping.py: "moe_tp_size * moe_ep_size * moe_cluster_size must equal to moe_world_size". | "`moe_expert_parallel_size` x `moe_tensor_parallel_size` x `moe_cluster_parallel_size` must equal the MoE world size". |
| 23.47 | DeepEP "153 GB/s NVLink intranode and 51 GB/s RDMA at 64-EP on H800/CX7" | :288-294 | STALE | Numbers CORRECT at https://github.com/deepseek-ai/DeepEP/blob/v1.2.1/README.md (Tier 1, author-measured): intranode EP8 dispatch 153 GB/s, internode EP64 dispatch 51 GB/s, H800 + CX7 400 Gb/s. The README at the latest commit b5a33eefda39485f438dc764695b71ba7b9249b6 (2026-10-15) dropped the V1 table ("Fully remove V1") and states "EP dispatch and combine require GPU SMs". | "153 GB/s (EP8, NVLink) and 51 GB/s (EP64, RDMA) for DeepEP V1 kernels on H800 + CX7"; link the v1.2.1 README. |
| 23.48 | Trainium: "uses All-Gather rather than All-to-All-v for EP; the All-to-All-v primitive (torch.all_to_all_vdev_2d) is documented as planned" | :300-302 | STALE | See 23.33. `torch.all_to_all_vdev_2d` not verified (UNKNOWN). | As 23.33. |
| 23.49 | "CC-Cores (16 per chip) carry collectives" | :302 | CORRECT | Trainium2 and Trainium3 pages (Tier 1): "16 CC-Cores orchestrate collective communication". | Keep. |
| 23.50 | Cerebras: "entire model resident in on-wafer SRAM ... there is no inter-node fabric to congest" | :311-313 | WRONG | Multi-wafer pipelining across CS-3 systems (Cerebras blog, Tier 2). | "Each layer's experts sit in one wafer's SRAM, so expert routing never leaves the wafer; activations hop between wafers once per layer group." |
| 23.51 | "Artificial Analysis: 2,522 tokens/s, May 2025 ... sits ahead of dense-equivalent GPU silicon" | :313-316 | CORRECT | Cerebras PR (Tier 2) citing Artificial Analysis (Tier 3); "ahead of" vs NVIDIA's 1,038. | Label "third-party, May 2025, model since retired from the catalog". |
| 23.52 | vLLM "--enable-expert-parallel with kernels drawn from CUTLASS / TRT-LLM-Gen / CuTeDSL" | :322-323 | CORRECT | vLLM v0.31.0 (Tier 1): flag in vllm/engine/arg_utils.py; `MoEBackend` includes "cutlass", "flashinfer_trtllm", "flashinfer_cutlass", "flashinfer_cutedsl". | Keep. |
| 23.53 | SGLang "--moe-a2a-backend is a swappable enum with deepep, flashinfer, mooncake, nixl, mori, ascend_fuseep" | :323-326 | STALE | https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/exec_.py (Tier 1): 12 choices "none","deepep","mooncake","nixl","mori","ascend_fuseep","flashinfer","megamoe","deepep_v2","pplx","ascend_tp","flashinfer_megamoe". | List as "deepep / deepep_v2, flashinfer, mooncake, nixl, mori, pplx and others (12 at v0.5.21)" and link the tag. |
| 23.54 | "NVIDIA reports that NVFP4 ... reduced the DeepSeek-V3.2 footprint to 415 GB versus 690 GB at FP8 - a 1.7x reduction" cited to the InferenceMAX blog | :356-364 | WRONG | Same as 25.17 (citation does not contain the numbers; P3 finding still open). | Same replacement as 25.17. |
| 23.55 | "NVIDIA's B300 (288 GB HBM3e+) versus B200 (180 GB)" | :374-375 | WRONG | No "HBM3e+" product term on NVIDIA pages. B200: DGX B200 "1,440 GB total" = 180 GB per GPU [derived]. B300: GB300 page "1.5x larger HBM3E memory" than Blackwell; HGX/DGX B300 list "2.1 TB" total (about 262-270 GB per GPU usable [derived]). 288 GB per GPU not stated on the pages fetched. | "B300 (about 1.5x B200's memory, 2.1 TB per 8-GPU HGX) versus B200 (180 GB)". |
| 23.56 | "GB300 NVL72's 20 TB aggregate GPU memory" | :375-376 | CORRECT | GB300 NVL72 page (Tier 2): "20 TB \| Up to 576 TB/s". | Keep. |
| 23.57 | "Trn2 UltraServer (six terabytes of aggregate HBM across 64 chips)" | :376-377 | CORRECT | Trn2 arch (Tier 1): "Device Memory (GiB) ... 6,144" for the UltraServer. | Keep; add Trn3 Gen2 "20TB of HBM" and Rubin "288 GB HBM4" per GPU. |
| 23.58 | "Several production stacks (NVIDIA Dynamo, SGLang, DeepSeek-V3 reference deployment) now disaggregate prefill and decode" | :385-388 | CORRECT | DeepSeek-V3 report §3.4 (Tier 1): "deployment strategy that separates the prefilling and decoding stages" (prefill unit 32 GPUs, decode unit 320 GPUs, EP320); Dynamo v1.5.1 README (Tier 1) disaggregation for SGLang, TRT-LLM, vLLM; SGLang `disaggregation_mode` prefill/decode (v0.5.21). | Keep. |
| 23.59 | NEW: attention-FFN disaggregation | :382-393 | NEW | LPX blog (Tier 2): "Dynamo orchestrates the AFD loop where GPUs run attention over the accumulated KV cache, intermediate activations are handed off to LPUs for FFN/MoE execution". DeepSeek-V4.1-Flash card (Tier 1): activates "8B parameters per token during prefill and 16B during decode". | Add one sentence: MoE now also splits inside decode (attention on GPUs, experts on LPUs). |
| 23.60 | "It does not help compute-bound prefill - every expert in the chosen top-k still does full-precision GEMMs on every prompt token" | :396-399 | WRONG | [derived] prefill FLOPs per token scale with active parameters (about 2 x 37B for DeepSeek-V3 vs 2 x 671B for a dense model of equal size); MoE cuts prefill compute by the same ratio. Each token visits only its top-k experts. | "MoE cuts prefill FLOPs by the active/total ratio too; what it does not cut is the memory needed to hold all experts." |
| 23.61 | "It does not help latency-sensitive workloads that cannot batch - at batch 1 the all-to-all overhead is unhidden" | :399-400 | WRONG | [derived] on one device, batch-1 MoE decode reads only active weights (37 GB vs 671 GB for DeepSeek-V3); all-to-all applies only when experts span devices. | "At batch 1 MoE still reads fewer bytes per token, but once experts span devices each token pays an unhidden all-to-all." |
| 23.62 | Capacity-constrained edge: total params must fit | :400-403 | CORRECT | [derived] capacity scales with total, not active, parameters. | Keep. |

### Recommended edits (Section 23)
1. Replace the unpinned TensorRT-LLM wide_ep link with https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep (verified via the contents API at that tag) (23.29).
2. Fix the roofline direction (23.6), the top-k/N ratio (23.5), the prefill claim (23.60) and the batch-1 claim (23.61). These four sentences currently teach the opposite of the mechanism.
3. Refresh the lineup: add DeepSeek-V4-Pro, DeepSeek-V4-Flash, Qwen3-Next-80B-A3B, Qwen3.8-2.4T-A95B, Kimi K3; drop DBRX if space is tight; fix the "most aggressive" sentence (23.22-23.25).
4. Silicon table: Neuron 2.28.0 (23.32), the Trn2 bandwidth split (23.34), a Trn3 row (23.35), Cerebras and Groq current catalogs (23.36, 23.40), Groq/NVIDIA LPX (23.41), SN50 as roadmap (23.43). Pin DeepEP to v1.2.1 and the SGLang enum to v0.5.21 (23.47, 23.53).
5. Re-source the 415/690 GB figure (23.54) and fix the B300 memory wording (23.55).
- CUT candidate: the Compute-in-memory row (23.44). It carries no MoE evidence and HyperCIM does not target LLM inference, so it fails both tests.
- CUT candidate: the SambaNova row as a token-level MoE peer. Keep it only if reframed as request-level Composition of Experts (23.42).

---

## Section 26 - DisaggregatedServingAndSpeculative.tsx (+ DisaggregatedServingDiagram.tsx)

**What the section covers.** Prefill/decode disaggregation (topology, KV transport cost, production stacks) and speculative decoding (mechanism, acceptance, production support).

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 26.1 | "two distinct workloads that ... ideally want different silicon" | DisaggregatedServingAndSpeculative.tsx:27-31 | CORRECT | LPX blog (Tier 2): "GPUs deliver high output for context-heavy prefill and execute decode attention, while LPUs accelerate latency-sensitive decode components such as FFN/MoE execution." | Keep; cite. |
| 26.2 | NEW: dedicated prefill silicon | :27-33 | NEW | NVIDIA announced Rubin CPX for "massive-context inference" with availability "at the end of 2026" (nvidianews, Sep 2025, Tier 2, via search). Trade reports say it was absent from the GTC 2026 roadmap and may return redesigned in 2027 (Tier 3: The Elec, TF International via Investing.com). NVIDIA has not confirmed either. | ROADMAP, status unconfirmed. Mention only as "announced, not shipping". |
| 26.3 | "move only the KV cache between them" | :33 | STALE | AFD moves per-token activations between GPU attention and LPU FFN/MoE (LPX blog, Tier 2). | "move the KV cache between them (and, in attention-FFN splits, activations every token)". |
| 26.4 | "Speculative decoding generates multiple draft tokens with a small model" | :36-38 | STALE | Drafters are now often heads or modules inside the checkpoint: DeepSeek-V3 MTP (`num_nextn_predict_layers: 1`, Tier 1), DeepSeek-V4.1-Flash `num_nextn_predict_layers: 3`, MiniMax-M3 `num_mtp_modules: 7`, DeepSeek-V4 "DSpark speculative decoding module attached" (cards, Tier 1); EAGLE-3 heads; DFlash block-diffusion drafter (arXiv 2602.06036, Tier 1). | "with a small draft model, draft heads (EAGLE, Medusa) or multi-token-prediction modules shipped inside the checkpoint". |
| 26.5 | "compose with the precision and batching levers from Sections 25 and 22" | :41-42 | CORRECT | App.tsx:164,167. | Keep. |
| 26.6 | "KV cache ... transported ... over NVLink in a single UltraServer, or over EFA" | :62-65 | CORRECT | Dynamo v1.5.1 disaggregated-serving doc (Tier 1): "Dynamo leverages NIXL to transfer KV cache directly from the VRAM of the prefill engine to the VRAM of the decode engine"; NIXL v1.5.0 ships a `libfabric` plugin (https://github.com/ai-dynamo/nixl/tree/v1.5.0/src/plugins, Tier 1); Neuron disaggregated inference uses EFA (26.15). | Keep. |
| 26.7 | "KV cache size for a long prompt can be hundreds of MB to several GB per request" | :71-72 | CORRECT | P3 §5: Llama 3 70B FP16 at 8K = 2.5 GiB [derived]. | Keep; add the architecture dependence (26.8). |
| 26.8 | NEW: KV per token now varies by orders of magnitude | :71-72 | NEW | DeepSeek-V4.1-Flash README (Tier 1): "global KV cache footprint to 890 bytes per token". Llama 3 70B FP16 is 327,680 bytes per token [derived from config: 2 x 80 layers x 8 KV heads x 128 x 2 bytes]. At 128K tokens: about 114 MB vs about 42 GB [derived]. | "Transport cost is set by the model's KV design: from about 0.9 KB per token (compressed sparse attention, FP4 KV) to over 300 KB per token (GQA, FP16)." |
| 26.9 | "EFA at 3,200 Gbps on P5" | :72-73 | CORRECT | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (Tier 1): p5.48xlarge "3200 Gigabit"; p6-b300.48xlarge "6400 Gigabit". P3 §5/§8: per instance across 8 GPUs (400 Gbps per GPU on P5); still unlabelled. | "3,200 Gbps per P5 instance (400 Gbps per GPU); 6,400 Gbps on P6-B300". |
| 26.10 | "takes milliseconds" | :73 | CORRECT | [derived] 1 GB at the full P5 instance rate (400 GB/s) = 2.5 ms; at one GPU's share (50 GB/s) = 20 ms; P6-B300 per-GPU share (100 GB/s) = 10 ms. P3 asked for a derivation label; still missing. | Show the derivation and label it. |
| 26.11 | "over NVLink inside an UltraServer it takes sub-millisecond" | :73-74 | WRONG | P3 §5 still applies: NVLink 5 1.8 TB/s is bidirectional, 900 GB/s one way, so 1 GB = 1.1 ms and "several GB" = several ms [derived]. NVLink 6 (Vera Rubin) "3.6 TB/s of bandwidth per GPU" (Tier 2) gives about 0.56 ms per GB one way [derived, assumes bidirectional per P3 §8]. | "about 1 ms per GB over NVLink 5 (0.5 ms on NVLink 6), against 2.5-20 ms over EFA". |
| 26.12 | "NIXL ... designed ... because NCCL launches kernels that consume SMs - NIXL does GPU-Direct RDMA without activating any SMs" | :74-78 | UNKNOWN | No NVIDIA primary statement found (NIXL README and docs at v1.5.0; NVIDIA NIXL blog 2026-03-09). Only Tier 3: UCCL blog "It does not consume GPU SM resources". The NCCL half is STALE: https://github.com/NVIDIA/nccl/releases/tag/v2.28.3-1 (Tier 1): "CE (Copy Engine) Collectives ... Reduce SM utilization for alltoall, scatter, gather, and allgather within a single (MN)NVL domain." | "NIXL moves KV point to point between engines over NVLink, RDMA (UCX, libfabric) or storage, without a collective." Drop the SM claim unless a primary source appears. |
| 26.13 | Dynamo "NVIDIA's production disaggregated serving framework. Pairs with TensorRT-LLM" | :96-98 | STALE | https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md (Tier 1, release 2026-10-07): disaggregated serving for SGLang, TensorRT-LLM and vLLM. | "Pairs with TensorRT-LLM, vLLM or SGLang (v1.5.1)". |
| 26.14 | "The reference deployment for DeepSeek-R1 MoE on GB200 NVL72 uses Dynamo to coordinate the prefill / decode split" | :99-101 | CORRECT | P3 marked UNSOURCEABLE; now sourced: https://github.com/ai-dynamo/dynamo/tree/v1.5.1/recipes/deepseek-r1/trtllm/disagg/wide_ep/gb200 (Tier 1): "36x GB200 \| TensorRT-LLM \| Disaggregated WideEP \| 8 decode + 1 prefill nodes"; deploy.yaml decode `moe_expert_parallel_size: 32`, prefill 4. | Cite the recipe; note EP32 decode. |
| 26.15 | vLLM "Supports prefill / decode disaggregation via experimental flags; pairs with NixlConnector" | :107-109 | CORRECT | vLLM v0.31.0 (Tier 1) docs/features/disagg_prefill.md: "This feature is experimental and subject to change."; NixlConnector at https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl. P3 UNSOURCEABLE, now sourced. | Keep with links. |
| 26.16 | vLLM "The most flexible OSS path for AWS-resident deployments" | :109-110 | UNKNOWN | Opinion; no source. | Drop or attribute. |
| 26.17 | SGLang "most explicit disaggregated-serving support, with ... KV cache routing, MoE all-to-all backend selection" | :116-119 | CORRECT | SGLang v0.5.21 (Tier 1): `disaggregation_mode` Literal["null","prefill","decode"]; transfer backends "mooncake","nixl","ascend","fake","mori","mooncake_tcp"; MoE a2a enum (23.53). | Keep facts; drop "most". |
| 26.18 | SGLang docs link https://docs.sglang.ai/ | :121 | STALE | Returns HTTP 301 to https://docs.sglang.io/ (fetched 2026-10-16). | Use docs.sglang.io or a pinned GitHub path. |
| 26.19 | Trainium "Disaggregation ... is in early production. The Neuron runtime supports cross-chip transports via CC-Cores, and KV cache transport between Trn2 nodes works over EFA" | :130-135 | STALE | https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/disaggregated-inference.html (Tier 1): "Disaggregated Inference [BETA] ... transfer the KV cache through EFA from Neuron device to Neuron device. This is a zero copy transfer"; Inf2, Trn1, Trn2; added 2.24.0. "via CC-Cores" and "customer deployments are starting to ship" not supported (UNKNOWN). | "NxD Inference supports disaggregated inference in Beta, moving KV cache over EFA zero-copy between Neuron devices." |
| 26.20 | "if all k were accepted the speedup is roughly kx" | :155-157 | WRONG | Leviathan et al. (arXiv 2211.17192, Tier 1) Eq. 1: expected tokens per target pass E = (1 - α^(γ+1)) / (1 - α), at most γ+1 tokens; wall-clock speedup is lower once draft cost is counted. P3 flagged this as unlabelled. | "Each big-model pass emits up to k+1 tokens; the speedup is that, minus the time spent drafting." |
| 26.21 | "Reading them once and verifying k tokens ... is essentially free compared to reading them k separate times" | :163-165 | CORRECT | [derived] memory-bound regime; Leviathan et al. (Tier 1). | Keep. |
| 26.22 | "acceptance rate is high (typically 60-90% on common tasks)" | :165-166 | WRONG | P3 UNSOURCEABLE. Leviathan §4 (Tier 1, author-measured): draft models "a couple of orders of magnitude smaller than the target model tend to produce α values between 0.5 and 0.9" (Table 3: 0.53-0.89). DeepSeek-V3 (Tier 1, author-measured): MTP second-token "acceptance rate ... between 85% and 90%", "1.8 times TPS". | "Acceptance runs about 0.5-0.9 for small draft models (Leviathan et al.) and 85-90% for DeepSeek-V3's built-in MTP head, which delivered 1.8x tokens per second." |
| 26.23 | "vLLM and SGLang both ship speculative decoding. NVIDIA TensorRT-LLM supports it." | :170-171 | CORRECT | vLLM v0.31.0 `SpeculativeMethod` (Tier 1): ngram, medusa, mlp_speculator, draft_model, suffix, eagle, eagle3, mtp, dflash, dspark, ngram_gpu; SGLang v0.5.21 (Tier 1): "EAGLE, EAGLE3, NEXTN, STANDALONE, NGRAM, DFLASH, DSPARK, UNO"; TensorRT-LLM v1.2.1 has docs/source/features/speculative-decoding.md (Tier 1, file exists). | Keep. |
| 26.24 | "Trainium adds support via NKI-authored draft kernels" | :171-172 | WRONG | NxD Inference feature guide v2.32.0 (Tier 1): draft-model, Medusa, EAGLE ("supports EAGLE v1 with a flat draft structure") and fused speculation; 2.28.0 notes "supports Eagle3 speculative decoding on Llama 3.1 8B". No "NKI-authored draft kernels". | "NxD Inference supports draft-model, Medusa, EAGLE and (on Llama 3.1 8B) EAGLE-3 speculation." |
| 26.25 | "Llama 3.2 1B drafting Llama 3.3 70B", "Tree-based speculation" | :172-176 | CORRECT | Illustrative pairing; Medusa paper (arXiv 2401.10774, Tier 1) uses tree attention. | Keep. |
| 26.26 | NEW: author-measured speedups the section can cite | :151-178 | NEW | EAGLE-3 (arXiv 2503.01840, Tier 1): "speedup ratio up to 6.5x, with about 1.4x improvement over EAGLE-2"; Medusa (arXiv 2401.10774): Medusa-1 "over 2.2x", Medusa-2 "2.3-3.6x"; DFlash (arXiv 2602.06036, Feb 2026): "over 6x lossless acceleration ... up to 2.5x higher speedup than ... EAGLE-3". All author-measured. | Add a compact "reported speedups (author-measured)" ExpandableSection. |
| 26.27 | NEW: heterogeneous speculative decoding | :168-178 | NEW | LPX blog (Tier 2): "LPX is well-suited to act as the draft-generation engine", "Rubin GPUs verify and finalize tokens". | One sentence: draft and verify can now run on different silicon. |
| 26.28 | "A production stack might run prefill on FLOP-rich GPUs, decode on bandwidth-rich GPUs" | :194-195 | CORRECT | Pattern supported by DistServe (arXiv 2401.09670, Tier 1, author-measured "7.4x more requests or 12.6x tighter SLO") and the Dynamo GB200 recipe (26.14). | Keep; add the Rubin + LPX example as the 2026 instance. |
| 26.29 | NEW: OSS serving systems the section omits | :93-137 | NEW | llm-d v0.10.0 (2026-09-29, Tier 1 release): "a high-performance distributed inference serving stack optimized for production deployments on Kubernetes" with "prefill/decode disaggregation and wide expert-parallelism"; Mooncake v0.3.13.post1 and its paper (arXiv 2407.00079, Tier 1): "KVCache-centric disaggregated architecture that separates the prefill and decoding clusters". | Add llm-d (Kubernetes) and Mooncake (KV store / transfer engine) in one line each. |
| 26.30 | Diagram: "Prefill cluster FLOP-rich GPUs (compute-bound)", "KV cache transport NIXL / NCCL over NVLink / EFA", "Decode cluster bandwidth-rich GPUs (memory-bound)" | DisaggregatedServingDiagram.tsx:47,56,65 | CORRECT | As 26.1, 26.6. | Keep; optional "NIXL (UCX / libfabric)". |

### Recommended edits (Section 26)
1. Fix the KV transport alert: per-instance vs per-GPU EFA, the NVLink one-way rate, and an explicit derivation label (26.9-26.11). P3 must-label #15, still open.
2. Replace the NIXL/SM sentence (26.12) and the "kx" and "60-90%" sentences (26.20, 26.22) with the Leviathan formula and the two author-measured acceptance figures.
3. Update Dynamo (multi-backend, cite the GB200 recipe), Trainium (Beta, EFA zero-copy), and add llm-d (26.13, 26.14, 26.19, 26.29).
4. Add the 2026 heterogeneity example in two sentences: Rubin GPUs run prefill and decode attention while Groq 3 LPX runs FFN/MoE and drafting (26.1, 26.3, 26.27). Mark Rubin CPX as announced-not-shipping if mentioned at all (26.2).
5. Add the KV-per-token range (26.8): it is the practical number that decides whether disaggregation pays.
- CUT candidate: "The most flexible OSS path for AWS-resident deployments" (26.16), unsourced opinion.

---

## Section 30 - CapitalMarketsLens.tsx (+ TickToTradeDiagram.tsx)

**What the section covers.** Reads the dive through capital-markets requirements: tail-latency vocabulary, failure modes mapped to architecture pillars, the CXL framing, Differential Machine Learning (AAD, twin networks) as an inference workload, and an AWS portfolio mapping.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| 30.1 | Metric vocabulary table (p50 ... tick-to-trade) | CapitalMarketsLens.tsx:19-26 | CORRECT | Definitional. | Keep. |
| 30.2 | "Noisy neighbor on shared HBM ... MIG hardware partitioning" | :35 | CORRECT | P3 §1: NVIDIA MIG concepts page (Tier 1) documents memory-bandwidth QoS per instance. | Keep. |
| 30.3 | "NUMA-cross memory access: Tens of ns over local DRAM" | :36 | UNKNOWN | No Tier 1 measurement located in this pass. | Cite Section 8's number or drop the cost cell. |
| 30.4 | "Hypervisor scheduling jitter ... NIE on Graviton5" | :37 | UNKNOWN | AWS presents NIE as formally verified isolation: https://www.amazon.science/blog/ec2s-formally-verified-isolation-engine-provides-mathematical-assurance-of-virtual-machine-isolation (Tier 2). No AWS source ties it to scheduling jitter. | Map NIE to "tenant isolation evidence", not jitter. |
| 30.5 | "Cross-CCD core-to-core hops ~150 ns over intra-CCD" | :39 | WRONG | P3 §7: the 45/150 ns figures are Tier 3 (Chips and Cheese) totals; 150 ns is the cross-CCD latency, not the increment (about 105 ns over intra-CCD [derived]). | "~150 ns cross-CCD vs ~45 ns within a CCD (third-party measurement)". |
| 30.6 | "NCCL kernel launch consuming SMs ... NIXL for KV-cache transport (Section 27)" | :40 | UNKNOWN | See 26.12 (no primary source; NCCL 2.28 CE collectives reduce SM use). Cross-ref: NIXL is covered in Section 26 as well. | Rephrase or drop the row. |
| 30.7 | "1 µs every time vs 800 ns most of the time and 5 µs once in a thousand" | :72-74 | CORRECT | Illustrative; no factual claim. | Keep. |
| 30.8 | "The full round trip is in the low microseconds" | :95 | UNKNOWN | No exchange, STAC or vendor primary source reached. | Label as illustrative or cite a STAC report. |
| 30.9 | OS-bypass receive via "Solarflare or AWS EFA, DPDK" | :96-98; TickToTradeDiagram.tsx:18 | WRONG | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html (Tier 1): "EFA traffic is not routable", "can't cross Availability Zones or VPCs"; https://github.com/ofiwg/libfabric/blob/24fa1dcfaa5cd10fc3d5ca5ea94690e9925c6848/man/fi_efa.7.md (Tier 1 code docs) lists RDM capabilities without FI_MULTICAST. Exchange feeds arrive as multicast UDP. | "Solarflare (now AMD) Onload / ef_vi or DPDK"; keep EFA for intra-cluster traffic only. |
| 30.10 | "CXL ... The link adds 200-400 ns of latency", "a 300 ns hop" | :169-171 | WRONG | Pond (ASPLOS 2023, arXiv 2203.00241, Tier 1, model estimates): CXL "will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling"; local DRAM 85 ns. | "adds roughly 70-90 ns for small pools and 180 ns or more for rack-scale pools (Pond)". |
| 30.11 | "MRDIMM where Xeon 6 6900P is acceptable" | :184 | CORRECT | Intel support article 000098737 (Tier 2): "up to 8800 MT/s for Xeon 6900P-series". | Keep. |
| 30.12 | "keep the working set in tier 5 or above ... never miss to tier 6" | :187-189 | CORRECT | MemoryHierarchyTower.tsx:46,54 (tier 5 LLC, tier 6 HBM/DRAM). | Keep. |
| 30.13 | Regulatory workload list (FRTB IMA, CCR, CVA/xVA, SIMM, RWA) | :207-212 | CORRECT | Definitional. | Keep. |
| 30.14 | Huge and Savine: "It takes the time of 2 to 5 evaluations in practice ..." (footnote 3, page 5) | :224-233 | CORRECT | arXiv 2005.02347 v4, 30 Sep 2020 (Tier 1): verbatim, footnote 3, p.5. | Keep; cite v4. |
| 30.15 | "AAD displaced bumping ... starting with Giles and Glasserman's 'Smoking Adjoints' in Risk Magazine, 2006" | :236-239 | CORRECT | https://www.risk.net/derivatives/interest-rate-derivatives/1500261/smoking-adjoints-fast-monte-carlo-greeks (Tier 1 for venue): published 01 Jan 2006. | Keep. |
| 30.16 | Abstract quote "Differential ML is a general extension of supervised learning ..." | :243-247 | CORRECT | arXiv 2005.02347 v4 abstract (Tier 1). | Keep. |
| 30.17 | Alert header "The headline result, vendor-cited" | :255 | WRONG | The source is an arXiv paper by Danske Bank authors, not a vendor. | "The headline result (authors' measurement)". |
| 30.18 | Danske benchmark: 8,192 vs 65,536 samples; "virtually perfect"; standard errors 12.85M vs 1.77M on a 200M range | :256-261 | CORRECT | arXiv 2005.02347 v4 §2.3 pp.12-13 (Tier 1, author-measured): "Standard errors are 12.85M with classical 64k and 1.77M with differential 8k, for a range of 200M for the 128 test examples." | Keep. |
| 30.19 | "Differential ML performs up to thousandfold better on small datasets" (p.10) | :263-264 | CORRECT | Same paper, p.10 (lowercase "differential"). | Keep. |
| 30.20 | "The twin network has the same degree of approximation as orders of magnitude slower nested Monte-Carlo" (§2.3 p.13) | :266-268 | CORRECT | Same paper, p.13. | Keep. |
| 30.21 | "Regulations like XVA, CCR, FRTB or SIMM-MVA ..." (page 2) | :272-278 | CORRECT | Same paper, p.2 (mid-sentence, lowercase "regulations"). | Keep. |
| 30.22 | "FRTB IMA is the BCBS d457 framework, January 2019, that defines expected-shortfall internal models" | :278-281 | CORRECT | https://www.bis.org/bcbs/publ/d457.htm (Tier 1): published 14 January 2019, "comes into effect on 1 January 2022". d457 covers both the standardised approach and IMA. | "BCBS d457 (January 2019) sets the market-risk framework, including the expected-shortfall internal models approach". |
| 30.23 | NEW: FRTB implementation dates | :278-285 | NEW | EU: Commission act of 12 June 2025 "postpones by one additional year - until 1 January 2027" (finance.ec.europa.eu, Tier 1). UK: PRA FRTB IMA from 1 January 2028 (bankofengland.co.uk, June 2026, Tier 1). US: OCC/Fed/FDIC proposal of 19 March 2026, no final rule found (occ.gov nr-ia-2026-16, Tier 1). | One line, practical for a capital-markets reader. |
| 30.24 | "ISDA SIMM Methodology v2.4 §A.2" | :288 | STALE | https://www.isda.org/2026/06/12/isda-publishes-isda-simm-methodology-version-2-8-2512/ (Tier 1): current v2.8+2512, effective 11 July 2026. Quote "SIMM uses sensitivities as inputs" still in §A para 2 of https://www.isda.org/a/hhkiE/ISDA-SIMM_v2.82512_PUBLIC.pdf. | "ISDA SIMM v2.8+2512 §A". |
| 30.25 | "Six risk classes, three sensitivity types (delta, vega, curvature)" | :288-290 | WRONG | SIMM v2.8+2512 (Tier 1): six risk classes CORRECT; margin is "the sum of the Delta Margin, the Vega Margin, the Curvature Margin and the Base Corr Margin (if applicable)"; curvature is computed from vega inputs. | "six risk classes; delta, vega and curvature margins (curvature derived from vega inputs) plus base correlation for credit qualifying". |
| 30.26 | "a few matrix by vector products in limited dimension ..." (page 2) | :296-298 | CORRECT | arXiv 2005.02347 v4 p.2 (Tier 1). | Keep. |
| 30.27 | "The silicon answer for risk-and-valuation workloads is no longer a 10,000-CPU grid; it is a fleet of inference accelerators" | :300-309 | UNKNOWN | No source; the paper claims faster approximation, not a hardware shift. | Label as the dive's inference or soften. |
| 30.28 | Savine books: AAD and Parallel Simulations (Wiley, 2018); Scripting for Derivatives and xVA (Wiley, 2022) | :315-318 | WRONG | Wiley (Tier 2): AAD book November 2018 CORRECT; Scripting book "ISBN: 978-1-119-54078-6 November 2021". | "(Wiley, 2021)". |
| 30.29 | Savine "Managing Director at Barclays Fixed Income Quant Analytics; previously Hudson River Trading, Danske Bank, BNP-Paribas", "IAQF Innovation Award in 2026" | :321-324 | CORRECT | https://antoinesavine.com/ (Tier 2, self-published): "managing director at Barclays ... since late 2025", HRT, BNP-Paribas, Danske Bank; "Antoine won IAQF's Innovation Award in 2026." | Keep (or cut, see edits). |
| 30.30 | Brian Huge "then at Danske Bank" | :320 | CORRECT | Paper title page (Tier 1): brian.huge@danskebank.dk. | Keep. |
| 30.31 | GitHub org links (notebooks, appendices) | :336-348 | CORRECT | Repos exist; last commits 2022-10-05 (Tier 1). Org/repo root links are not branch links, so the gate passes, but pinning is better: https://github.com/differential-machine-learning/notebooks/tree/155055eb891d151533530b70d039ad636ffeaf4b and https://github.com/differential-machine-learning/appendices/tree/585675ef05debbb9bb727d43f26ffb29e32ff25f | Pin. |
| 30.32 | Five notebooks named | :368-391 | CORRECT | notebooks @155055eb (Tier 1): DifferentialML, DifferentialMLTF2, DifferentialRegression, DifferentialPCA, Bermudan5F. | Keep. |
| 30.33 | Quote: described as "TF1 code in TF2" | :373-374 | WRONG | README @155055eb (Tier 1): "what we do is really run TensorFlow 1 code in TensorFlow 2". The quoted phrase is a paraphrase in quote marks. | Use the verbatim phrase or drop the quote marks. |
| 30.34 | Quotes "noticeable performance improvement", "massive performance improvement, without the need for additional regularization, or hyperparameter optimization" | :375, :379-381 | CORRECT | README @155055eb (Tier 1), verbatim. | Keep. |
| 30.35 | "DifferentialPCA ... 2021 follow-up article 'Axes that Matter: PCA with a Difference'" | :383-386 | UNKNOWN | Not verified in this pass. | Verify or drop the title. |
| 30.36 | "Appendices repo, four PDFs" App1-App4, README quotes | :393-411 | WRONG | appendices @585675ef (Tier 1): App1-App4 present and both README quotes verbatim, but the repo holds a fifth PDF (dixon.pdf). | "four appendices". |
| 30.37 | "host CPU with AMX ... or SVE2 BFMMLA" / "Graviton5 SVE2" | :306-307, :422-423 | CORRECT | Graviton README @8b322a41 (Tier 1): Graviton4 features "sve2, sve-int8, sve-bf16"; "Graviton4 and Graviton5 support SVE2". BFMMLA belongs to the BF16 extension [derived]. | Keep. |
| 30.38 | "TF1-graph-mode advantage matters for Trainium ... closer to a free port than to a research project" | :432-441 | UNKNOWN | No Neuron source on TensorFlow 1/2 graph-mode training on Trainium was checked; the "free port" claim is speculation. | CUT (see edits). |
| 30.39 | "Graviton5 with NIE for tenant isolation" | :462 | CORRECT | Amazon Science (Tier 2): NIE is "an always-on feature for Graviton5 users". | Keep. |
| 30.40 | "EPYC Turin M8azn 5 GHz" | :463 | CORRECT | https://aws.amazon.com/about-aws/whats-new/2026/02/aws-m8azn-instances-generally-available/ (Tier 2, 2026-02-12): "general availability ... offering the highest maximum CPU frequency, 5GHz in the cloud". | Keep. |
| 30.41 | "NPS4 / SNC3" | :464 | UNKNOWN | Not verified in this pass (belongs to sections 10, 11). | Check against those sections' refresh files. |
| 30.42 | "Trainium NEFF AOT for bit-exact reproducibility" / "eliminates kernel-selection variance entirely" | :471, :516-517 | UNKNOWN | No AWS statement on bit-exact reproducibility located. | Soften to "a fixed compiled artifact you can replay" unless Section 29's refresh finds a source. |
| 30.43 | "Graviton5 distributed L3 for cache-friendly working sets" | :482 | STALE | P3 §8: AWS publishes Graviton5 "LLC ... 48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)", 1-2 NUMA nodes. | "Graviton5's 96 MB LLC per NUMA node". |
| 30.44 | "NIE Isabelle/HOL proof for tenant isolation evidence"; "The Isabelle/HOL proof script for NIE is inspectable" | :489, :522-523 | WRONG | Isabelle/HOL CORRECT: Amazon Science 2026-06-10 (Tier 2): "Our Isabelle/HOL model and proof comprise 330,000 lines of machine-checked mathematics" (a 2026-04-17 post says "quarter of a million lines"). "Inspectable" not supported: AWS says it "will engage with customers to provide access to the Nitro Isolation Engine implementation so they can evaluate it and the resulting proofs" (aboutamazon.com, Tier 2). | "AWS offers selected customers access to the NIE implementation and its Isabelle/HOL proofs." |
| 30.45 | "TEE-I/O on Blackwell for cryptographic separation" | :491, :523 | CORRECT | https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/ (Tier 2): "NVIDIA Blackwell is the first TEE-I/O capable GPU in the industry". | Keep. |
| 30.46 | "NIE on Graviton5 plus MIG ... plus NUMA-pinned threads gets you the cleanest p99.9 story available on a public cloud" | :512-515 | UNKNOWN | No source; comparative superlative. | Soften to "a strong p99.9 story". |
| 30.47 | "dedicated colocation in an exchange building still wins on absolute wall-clock" | :529-533 | CORRECT | Follows from 30.9 (no multicast OS-bypass on EFA, non-routable) [derived]; no measurement cited. | Keep, label as reasoning. |
| 30.48 | Tick-to-trade stage budgets ("~hundreds of ns", "~µs", "~µs to 10s of µs") | TickToTradeDiagram.tsx:17-23 | UNKNOWN | No source for any budget. | Add an "illustrative" caption. |

### Recommended edits (Section 30)
1. Fix the EFA market-data claim in prose and diagram (30.9) and the CXL latency (30.10). Both are numbers a reader would act on.
2. Update SIMM to v2.8+2512 and the sensitivity description (30.24, 30.25); add FRTB dates (30.23).
3. Fix the NIE "inspectable" claim (30.44), the "vendor-cited" header (30.17), the 2021 book date (30.28), the paraphrased quote (30.33) and "four PDFs" (30.36).
4. Fix the cross-CCD increment (30.5) and Graviton5 LLC wording (30.43).
- CUT candidate: "The broader research arc" expandable (notebook and appendix inventory, :357-444). A file list fails both tests; keep one sentence pointing to the pinned repo.
- CUT candidate: "TF1-graph-mode advantage matters for Trainium" (30.38), speculation with no source.
- CUT candidate: the Savine biography expandable (:311-331). The reader needs the paper and the repo, not the author's career history.

---

## Cross-section findings for the integrator

1. **Sparse-vs-dense is still unlabelled in the dive's anchor number.** The thesis (1.4, 1.6) and the roofline table (3.5) both use sparse NVIDIA figures as if dense; the BF16 row is mislabelled outright. P3 found the same defect in NvidiaBlackwell.tsx; it recurs here.
2. **MoE intensity is described backwards in three places** (23.6, 25.22, 25.23) and MoE's effect on prefill is wrong (23.60). Treat these as one coordinated fix.
3. **The 415/690 GB DeepSeek-V3.2 figure is correct but mis-cited in two sections** (25.17, 23.54). Re-cite to the two Hugging Face repos at their SHAs. P3 must-fix #9 is still open.
4. **Heterogeneous decode is the 2026 headline the dive is missing.** NVIDIA's Vera Rubin + Groq 3 LPX (GPU attention, LPU FFN/MoE and drafting, orchestrated by Dynamo) is direct support for the dive's thesis and touches sections 1, 2, 3, 23 and 26.
5. **Cross-reference numbers are off by one family** in sections 1, 2 and 3 (1.21, 2.12, 3.20, 3.23).

---

## Sources (all accessed 2026-10-16)

### Tier 1 - specifications, official docs, pinned code and model cards, papers, filings
- OCP Microscaling Formats (MX) v1.0 spec, Sep 2023: https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf
- NVIDIA PTX ISA 9.4 (tf32, tcgen05, kind::mxf4nvf4): https://docs.nvidia.com/cuda/parallel-thread-execution/index.html
- NVIDIA Form 10-Q, quarter ended 2026-07-26 (Rubin shipments, Groq license payment): https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000075/nvda-20260726.htm
- AWS EC2 accelerated computing instance types: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html
- AWS EC2 general purpose instance types: https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html
- AWS EFA user guide: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html
- AWS Neuron Trainium2 architecture: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html
- AWS Neuron Trn2 architecture: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html
- AWS Neuron Trainium3 architecture: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html
- AWS Neuron Trn3 architecture: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html
- AWS Neuron data types: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-features/data-types.html
- AWS Neuron NKI Library release notes: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nki-lib.html
- AWS Neuron release notes index (2.32.0, 2026-08-17): https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/index.html
- NxD Inference MoE deep dive v2.32.0: https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html
- NxD Inference disaggregated inference v2.32.0: https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/disaggregated-inference.html
- NxD Inference feature guide v2.32.0: https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/feature-guide.html
- Crossref metadata, Roofline (CACM 52(4), 2009): https://api.crossref.org/works/10.1145/1498765.1498785
- DeepSeek-V3 technical report, arXiv 2412.19437v2: https://arxiv.org/abs/2412.19437
- SN40L / Samba-CoE, arXiv 2405.07518: https://arxiv.org/abs/2405.07518
- Pretraining LLMs with NVFP4, arXiv 2509.25149: https://arxiv.org/abs/2509.25149
- DFlash, arXiv 2602.06036: https://arxiv.org/abs/2602.06036
- EAGLE-3, arXiv 2503.01840: https://arxiv.org/abs/2503.01840
- Medusa, arXiv 2401.10774: https://arxiv.org/abs/2401.10774
- Leviathan et al., speculative decoding, arXiv 2211.17192: https://arxiv.org/abs/2211.17192
- DistServe, arXiv 2401.09670: https://arxiv.org/abs/2401.09670
- Mooncake, arXiv 2407.00079: https://arxiv.org/abs/2407.00079
- Pond (CXL pooling), arXiv 2203.00241: https://arxiv.org/abs/2203.00241
- Huge and Savine, Differential Machine Learning, arXiv 2005.02347 v4: https://arxiv.org/abs/2005.02347
- BCBS d457: https://www.bis.org/bcbs/publ/d457.htm
- ISDA SIMM v2.8+2512 announcement: https://www.isda.org/2026/06/12/isda-publishes-isda-simm-methodology-version-2-8-2512/
- ISDA SIMM v2.8+2512 methodology PDF: https://www.isda.org/a/hhkiE/ISDA-SIMM_v2.82512_PUBLIC.pdf
- EU FRTB postponement act (12 June 2025): finance.ec.europa.eu (via helper pass); Delegated Regulation (EU) 2026/1221: https://eur-lex.europa.eu/eli/reg_del/2026/1221/oj/eng
- PRA FRTB IMA date (June 2026): bankofengland.co.uk/news/2026/june (via helper pass)
- OCC/Fed/FDIC joint proposal, 19 March 2026: occ.gov nr-ia-2026-16 (via helper pass)
- Risk.net, Smoking Adjoints (2006): https://www.risk.net/derivatives/interest-rate-derivatives/1500261/smoking-adjoints-fast-monte-carlo-greeks
- Hugging Face model configs and cards at pinned revisions:
  - https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json
  - https://huggingface.co/deepseek-ai/DeepSeek-V3.1/blob/c0781d039fb7a1ba2abc4add0bdc293e92d2b8db/config.json
  - https://huggingface.co/deepseek-ai/DeepSeek-V3.2/blob/a7e62ac04ecb2c0a54d736dc46601c5606cf10a6/config.json
  - https://huggingface.co/nvidia/DeepSeek-V3.2-NVFP4/blob/7c0f62c6da1da0c81c6e097010cc55854d206812/README.md
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/72e1d3230f6c080a530b0a1d46f8eb4602340597/config.json
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/blob/7872f01b1d1fe23eabc4c98b48bffcef5a386062/config.json
  - https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/314113f8a7dadb388215396ba5fbee2c610a04d6/README.md
  - https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/8efa61729e24bd65b1d152b5ab5409052aa80e65/README.md
  - https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct/blob/9c7f2fbe84465e40164a94cc16cd30b6999b0cc7/README.md
  - https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/207bd685a7e3696cfaff12ded7c6a7ea0f88c996/README.md
  - https://huggingface.co/moonshotai/Kimi-K2-Instruct/blob/fd1984e2b7a3350dbf7305fe73a4ede25c14de50/config.json
  - https://huggingface.co/moonshotai/Kimi-K2-Thinking/blob/a51ccc050d73dab088bf7b0e2dd9b30ae85a4e55/config.json
  - https://huggingface.co/moonshotai/Kimi-K2.5/blob/4d01dfe0332d63057c186e0b262165819efb6611/README.md
  - https://huggingface.co/moonshotai/Kimi-K3/blob/f831ab66814297da540d832a5235f8e904f29d06/README.md
  - https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/config.json
  - https://huggingface.co/openai/gpt-oss-20b/blob/6cee5e81ee83917806bbde320786a8fb61efebee/README.md
  - https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct (API metadata at 73d14711bcc77c16df3470856949c3764056b617; gated, config not readable)
  - https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/fc7ac94680e38d7348cfa806e51218e6273104b0/config.json
  - https://huggingface.co/mistralai/Mixtral-8x22B-v0.1/blob/e1cd34ff1747406fb2277635ed25242803009bc2/config.json
  - https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512/blob/383ffea2c7d60dfd44ca960e8e691709d4fdb9cd/README.md
  - https://huggingface.co/mistralai/Mistral-Medium-3.5-128B/blob/22b2b868a15677cfa6061277ed2f653d1349a9ab/config.json
  - https://huggingface.co/zai-org/GLM-5.3/blob/ba32f8c19c8738e2c57c71798c601d477a7bf844/config.json
  - https://huggingface.co/MiniMaxAI/MiniMax-M3/blob/f0e1c1e04d40177e4673a22097036854f536e9c0/README.md
  - https://huggingface.co/MiniMaxAI/MiniMax-M3-MXFP8/blob/c5454eb03678d8710e54a4e0fc681b9f3b4a3dba/config.json
  - https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-NVFP4/blob/59b8721646c38111a242da18218859fb2b454322/config.json
- Source code and releases at tags or SHAs:
  - https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep
  - https://github.com/NVIDIA/TensorRT-LLM/tree/v1.0.0/examples/wide_ep
  - https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.21.0
  - https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0
  - https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/mapping.py
  - https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/legacy/advanced/expert-parallelism.md
  - https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/blogs/tech_blog/blog4_Scaling_Expert_Parallelism_in_TensorRT-LLM.md
  - https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/features/speculative-decoding.md
  - https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md
  - https://github.com/ai-dynamo/dynamo/tree/v1.5.1/recipes/deepseek-r1/trtllm/disagg/wide_ep/gb200
  - https://github.com/ai-dynamo/nixl/tree/v1.5.0/src/plugins
  - https://github.com/NVIDIA/nccl/releases/tag/v2.28.3-1
  - https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl
  - https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/exec_.py
  - https://github.com/llm-d/llm-d/releases/tag/v0.10.0
  - https://github.com/kvcache-ai/Mooncake/releases/tag/v0.3.13.post1
  - https://github.com/deepseek-ai/DeepEP/blob/v1.2.1/README.md
  - https://github.com/deepseek-ai/DeepEP/tree/b5a33eefda39485f438dc764695b71ba7b9249b6
  - https://github.com/Dao-AILab/flash-attention/releases/tag/fa4-v4.0.0.beta35
  - https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/AArch64/AArch64SchedNeoverseV2.td
  - https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86SchedSapphireRapids.td
  - https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86ScheduleZnver4.td
  - https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md
  - https://github.com/ofiwg/libfabric/blob/24fa1dcfaa5cd10fc3d5ca5ea94690e9925c6848/man/fi_efa.7.md
  - https://github.com/differential-machine-learning/notebooks/tree/155055eb891d151533530b70d039ad636ffeaf4b
  - https://github.com/differential-machine-learning/appendices/tree/585675ef05debbb9bb727d43f26ffb29e32ff25f

### Tier 2 - vendor product pages, press releases, vendor blogs (performance numbers are VENDOR CLAIMS)
- NVIDIA H100: https://www.nvidia.com/en-us/data-center/h100/
- NVIDIA H200: https://www.nvidia.com/en-us/data-center/h200/
- NVIDIA HGX (Rubin NVL8, B300, B200 tables): https://www.nvidia.com/en-us/data-center/hgx/
- NVIDIA DGX B200: https://www.nvidia.com/en-us/data-center/dgx-b200/
- NVIDIA DGX B300: https://www.nvidia.com/en-us/data-center/dgx-b300/
- NVIDIA GB300 NVL72: https://www.nvidia.com/en-us/data-center/gb300-nvl72/
- NVIDIA Blackwell architecture (TEE-I/O): https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
- NVIDIA blog, Introducing NVFP4: https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/
- NVIDIA blog, InferenceMAX (checked: does not contain 415/690): https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/
- NVIDIA blog, GB200 NVL72 + Dynamo for MoE: https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/
- NVIDIA blog, Vera Rubin POD: https://developer.nvidia.com/blog/nvidia-vera-rubin-pod-seven-chips-five-rack-scale-systems-one-ai-supercomputer/
- NVIDIA blog, Inside NVIDIA Groq 3 LPX (2026-03-16): https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/
- NVIDIA press release, Vera Rubin ramps into full production (2026-05-31): https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Vera-Rubin-Ramps-Into-Full-Production-to-Power-Agentic-AI-Factories-Worldwide/default.aspx
- NVIDIA press release, Rubin CPX (Sep 2025, ROADMAP): https://nvidianews.nvidia.com/news/nvidia-unveils-rubin-cpx-a-new-class-of-gpu-designed-for-massive-context-inference
- AMD Instinct MI355X: https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html
- AWS Trn3 UltraServers: https://aws.amazon.com/ec2/instance-types/trn3/
- AWS M8i: https://aws.amazon.com/ec2/instance-types/m8i/
- AWS What's New, M8azn GA (2026-02-12): https://aws.amazon.com/about-aws/whats-new/2026/02/aws-m8azn-instances-generally-available/
- Amazon Science, NIE formal verification (2026-06-10): https://www.amazon.science/blog/ec2s-formally-verified-isolation-engine-provides-mathematical-assurance-of-virtual-machine-isolation
- Amazon Science, Isabelle/HOL behind NIE (2026-04-17): https://www.amazon.science/blog/isabelle-hol-the-proof-assistant-behind-the-nitro-isolation-engine
- Intel support article 000098737 (MRDIMM 8800 on Xeon 6900P) (via helper pass)
- Intel AMX intrinsics code sample (seen via search result): https://www.intel.com/content/www/us/en/developer/articles/code-sample/advanced-matrix-extensions-intrinsics-functions.html
- Groq newsroom, NVIDIA licensing agreement: https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale
- Groq newsroom index: https://groq.com/newsroom
- GroqCloud models: https://console.groq.com/docs/models
- Cerebras inference launch blog: https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed
- Cerebras WSE-3 press release: https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine
- Cerebras SDK blog: https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk
- Cerebras Maverick press release (2025-05-28): https://www.cerebras.ai/press-release/maverick
- Cerebras inference model catalog: https://inference-docs.cerebras.ai/models/overview
- SambaNova SN50 blog (2026-02-24): https://sambanova.ai/blog/introducing-the-sn50-rdu-purpose-built-for-agentic-inference
- Meta, Llama 4 blog: https://ai.meta.com/blog/llama-4-multimodal-intelligence/
- Databricks, DBRX blog: https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm
- Mistral, Mixtral of experts: https://mistral.ai/news/mixtral-of-experts/
- Wiley, Modern Computational Finance (AAD book): https://www.wiley.com/en-us/Modern+Computational+Finance:+AAD+and+Parallel+Simulations-p-9781119539452
- Wiley, Modern Computational Finance (Scripting book): https://www.wiley.com/en-us/Modern+Computational+Finance:+Scripting+for+Derivatives+and+xVA-p-9781119540786
- Antoine Savine personal site (self-published): https://antoinesavine.com/
- SGLang docs (redirects to docs.sglang.io): https://docs.sglang.ai/

### Tier 3 - third-party (orientation only, never cited as a vendor fact)
- UCCL blog on KV transfer engines and SM use: https://uccl-project.github.io/posts/kv-transfer-engine/
- The Elec, Rubin CPX orders: https://www.thelec.net/news/articleView.html?idxno=10763
- Investing.com, TF International (Ming-Chi Kuo) on Rubin CPX revival: https://www.investing.com/news/stock-market-news/nvidia-revives-rubin-cpx-chip-program-with-2027-launch-planned-analyst-says-93CH-4882972
- Chips and Cheese Turin core-to-core latencies (as cited by P3 §7): https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched
- HyperCIM company profiles (PitchBook, Dealroom; seen via search only)
- Artificial Analysis Maverick benchmark (quoted inside the Cerebras press release)
