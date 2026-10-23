# 02 - NVIDIA: freshness and fact verification

- **Area:** NVIDIA silicon (Hopper, Blackwell, Grace-Blackwell NVL72), NVIDIA compiler and kernel tooling, kernel execution lifecycle
- **Sections covered:** `NvidiaHopper.tsx` (+ `HopperSmDiagram.tsx`), `NvidiaBlackwell.tsx` (+ `BlackwellDieDiagram.tsx`), `GraceBlackwellUltraServer.tsx` (+ `Nvl72Diagram.tsx`), `NvidiaCompilersAndTooling.tsx` (+ `NvidiaCompilerStack.tsx`), `KernelExecutionLifecycle.tsx` (+ `KernelLifecycleDiagram.tsx`). All paths below are relative to `deep-dives/silicon-memory-inference/src/`.
- **Date:** 2026-10-16 (all sources accessed 2026-10-16)
- **Sources fetched:** 62 (33 Tier 1, 28 Tier 2, 1 Tier 3). Three further Tier 3 items were seen only as search snippets and are marked as such; none is used as a vendor spec.
- **Verdict counts (all claim registers):** CORRECT 72, STALE 10, WRONG 36, NEW 21, UNKNOWN 36 (175 rows, counted from the registers below)

Evidence cells cite source IDs (`[T1-n]`, `[T2-n]`, `[T3-n]`) that resolve to full URLs in the Sources section at the end. FLOPS figures are always marked sparse or dense; bandwidth figures are always marked per direction or bidirectional. Vendor performance multipliers are marked VENDOR CLAIM. Products not shipping are marked ROADMAP.

---

## 0. What changed in the world since the content was written (April 2026)

| Topic | Status on 2026-10-16 | Evidence |
| --- | --- | --- |
| Vera Rubin | Shipping. NVIDIA's Q2 FY27 8-K (2026-08-26): "Vera Rubin platform is ramping into full production with racks running at partners including CoreWeave, Google Cloud, Microsoft Azure, Oracle Cloud Infrastructure and Nebius". AWS is not in that list. | [T1-25], [T2-23] |
| Rubin naming | The rack is now "Vera Rubin NVL72" (72 Rubin GPUs, 36 Vera CPUs). NVIDIA's September 2025 material used "Vera Rubin NVL144 CPX". | [T2-21], [T2-26] |
| Rubin per-GPU spec | 288 GB HBM4; NVFP4 50 PFLOPS sparse (inference), 35 PFLOPS dense (training); FP8 17.5 PFLOPS dense. **Doc conflict between two NVIDIA pages:** Vera Rubin NVL72 page gives 19.2 TB/s HBM4 and 3 TB/s NVLink per GPU (216 TB/s per rack); the HGX page's per-GPU column gives 22 TB/s and 3.6 TB/s. The NVLink page also says 3,000 GB/s, 36 links per GPU, marked "Preliminary specifications". The 2026-08-01 audit recorded 3.6 TB/s from the NVLink page, so NVIDIA has revised that page since. | [T2-21], [T2-15], [T2-18] |
| Rubin compute capability | CC 10.7 (`sm_107`), added in PTX ISA 9.4; same family as B200 (10.0) and B300 (10.3), so `compute_100f` binaries run on all three. Rubin raises max shared memory per SM to 328 KB (Hopper/B200/B300: 228 KB). | [T1-5], [T1-6], [T1-7] |
| Rubin Ultra | ROADMAP. NVIDIA (2026-08-26): AWS "plans to deploy an additional 2 million NVIDIA Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028". No Tier 1/2 spec fetched. | [T2-24] |
| Feynman | ROADMAP. GTC 2026: "NVIDIA's next major architecture is Feynman", with a Rosa CPU, LP40 LPU, BlueField-5, CX10, "connected through NVIDIA Kyber". No GPU spec published. | [T2-25] |
| Rubin CPX | ROADMAP, status unclear. Announced 2025-09-09 for "end of 2026" (30 PFLOPS NVFP4, 128 GB GDDR7). Trade press reports it was dropped from the GTC 2026 roadmap and later revived; NVIDIA has published nothing newer that this pass located. | [T2-26], [T3-2] (snippet only) |
| GB300 NVL72 / B300 on AWS | P6-B300 GA November 2025 (8 x B300, 8 x 268 GiB, 6,400 Gbps EFA). P6e-GB300 UltraServers GA 2025-12-02 ("1.5x GPU memory and 1.5x FP4 compute (without sparsity)" vs P6e-GB200, "close to 20TB of GPU memory per UltraServer"). P6e-GB300 is **absent** from the EC2 instance-type spec page and from the UltraServer Capacity Blocks table; AWS routes access through sales. | [T1-1], [T1-2], [T2-1], [T2-3], [T2-4] |
| AWS Rubin instance | None as of 2026-10-16 (EC2 spec page lists no Rubin type). | [T1-1], [T2-24] |
| NVLink Fusion | AWS/NVIDIA (2026-08-26): "Extend NVIDIA NVLink Fusion with custom NVIDIA high-bandwidth memory (NVHBM)"; "all NVIDIA GPU-based and Trainium-based EC2 instances, including those leveraging NVLink Fusion, are built on the AWS Nitro System and interconnected through EFA". | [T2-24] |
| CUDA / PTX | CUDA Toolkit 13.4 Update 2 (docs updated 2026-10-12); PTX ISA 9.4. The CUDA C++ Programming Guide URL the dive links now redirects to the restructured "CUDA Programming Guide" v13.4.2, which includes CUDA Tile. | [T1-6], [T1-5], [T1-31] |
| CUDA Tile / cuTile | cuTile Python 1.6.0 (2026-09-09), requires CC 8.x to 12.x and driver r580+. "CUDA Tile C++ is available in the CUDA Toolkit from version 13.3 onward." | [T1-13], [T1-8], [T1-23] |
| CUTLASS / CuTe DSL | CUTLASS v4.8.0 (2026-09-22): initial Rubin (SM107) support. CuTe DSL still "in public beta" per the v4.8.0 README. Examples now run to `95_blackwell_gemm_green_context`; `90_sm103_fp4_ultra_grouped_gemm` targets B300. | [T1-15], [T1-16] |
| Triton / Gluon | Triton v3.8.0 (2026-08-28): Gluon (lower-level Triton dialect) gains Blackwell Cluster Launch Control, TMEM layout work on SM103+, and "initial NVIDIA Rubin (SM107) support ... and a Rubin-specific Gluon module". | [T1-21] |
| TensorRT-LLM | Latest stable v1.2.1 (2026-04-20); release candidates continue to v1.4.0rc0 (2026-10-14). Since v1.0.0: "Promote PyTorch to be the default LLM backend"; README: "Architected on PyTorch". B300/GB300 support added in v1.1.0. | [T1-18], [T1-20] |
| NVIDIA Dynamo | Latest stable v1.5.1 (2026-10-07). | [T1-22] |
| PyTorch Inductor | v2.14.1 (2026-09-30). GEMM autotune backends now include `CUTEDSL` ("Blackwell GPUs (NVidia SM100-SM109 only)") and `NVGEMM`; defaults remain `ATEN,TRITON,CPP`. | [T1-24] |
| MIG on Blackwell | MIG User Guide now publishes a GB300 table ("GB300 252 GB product", DGX Station): `1g.31gb` x7, `1g.63gb` x4, `2g.63gb` x3, `3g.126gb` ... NVIDIA's Blackwell Ultra blog gives "two instances with 140 GB ... four instances with 70 GB ... seven instances with 34 GB". This partly supersedes the 2026-08-01 audit's finding that no B300 MIG data existed (that row lives in `IsolationNie.tsx`, outside this file's scope). | [T1-10], [T2-12] |

---

## 1. `sections/NvidiaHopper.tsx` (+ `components/HopperSmDiagram.tsx`)

**What the section covers.** Hopper's SM (warps, registers, SMEM, wgmma), an H100 vs H200 spec table, the argument that H200's speedup over H100 is "the roofline prediction for decode delivered verbatim", the three AWS Hopper families (P5, P5e, P5en), and when Hopper still beats Blackwell.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| H1 | H100 die "GH100 (TSMC 4N)" | NvidiaHopper.tsx:20 | CORRECT | [T2-8] Tier 2: "full GH100 GPU ... fabricated using the TSMC 4N process customized for NVIDIA, with 80 billion transistors, a die size of 814 mm2" | - |
| H2 | H200 "GH100 (same die)" | :20 | UNKNOWN | No NVIDIA page fetched names the H200 die. Supporting but indirect: H100 and H200 are both CC 9.0 [T1-9]; identical per-precision TFLOPS [T2-6][T2-7]; HGX H200 "compatible with both the hardware and software of HGX H100 systems" [T2-9]. | Keep only if re-sourced; otherwise "same Hopper compute (CC 9.0, identical Tensor Core peaks)". |
| H3 | "132 active (144 physical)" SMs, H100 | :21 | CORRECT | [T2-8]: "full GH100 GPU with 144 SMs. The H100 SXM5 GPU has 132 SMs" | - |
| H4 | H200 "132 active (same)" SMs and "50 MB" L2 | :21, :25, HopperSmDiagram.tsx:63 | UNKNOWN | Hopper Tuning Guide gives 50 MB for H100 only [T1-3]; H200 product page lists neither SM count nor L2 [T2-7]. Tried docs.nvidia.com search: no H200 SM/L2 figure. | Mark H200 SM/L2 cells "not published" or drop the two rows' H200 values. |
| H5 | Register file "64K x 32-bit" / SM | :22, :81; diagram :32 | CORRECT | [T1-3]: "The register file size is 64K 32-bit registers per SM" | - |
| H6 | SMEM "up to 228 KB" / SM | :23, :82; diagram :39 | CORRECT | [T1-3]: "shared memory capacity per SM is 228 KB"; [T1-7] CC 9.0 = 228 KB | - |
| H7 | "L1 + SMEM combined 256 KB" | :24, :81; diagram :40 | CORRECT | [T1-3]: "increases the maximum capacity of the combined L1 cache, texture cache, and shared memory to 256 KB" | - |
| H8 | L2 "50 MB" (H100) | :25; diagram :63 | CORRECT | [T1-3]: "from 40 MB in the A100 GPU to 50 MB in the H100 GPU" | - |
| H9 | HBM3 (H100) / HBM3e (H200) | :26 | CORRECT | [T2-6], [T2-7] | - |
| H10 | 80 GB / 141 GB | :27, :154-155; diagram :69, :71 | CORRECT | [T2-6]: "GPU Memory 80GB"; [T2-7]: "141GB"; AWS: p5.48xlarge 8 x 80 GiB, p5e/p5en 8 x 141 GiB [T1-1] | - |
| H11 | 3.35 TB/s / 4.8 TB/s | :28, :154-155; diagram :70, :72 | CORRECT | [T2-6] "3.35TB/s"; [T2-7] "4.8TB/s" | - |
| H12 | "NVLink Gen 4 BW per GPU 900 GB/s" | :29, :150-151 | CORRECT | [T2-18] fourth generation "900 GB/s"; [T2-12] Table 1 lists Hopper NVLink 900 "in BiDir GB/s" | Label it: "900 GB/s bidirectional (450 GB/s per direction)". |
| H13 | "FP8 Tensor Core (sparse) 3,958 TFLOPS" | :30 | CORRECT | [T2-6] "FP8 Tensor Core* 3,958 teraFLOPS", footnote "* With sparsity" | - |
| H14 | "BF16 Tensor Core 1,979 TFLOPS" (no sparse label, next to a row labelled sparse) | :31, :149-150 | WRONG | [T2-6], [T2-7]: BF16 "1,979" carries the same "With sparsity" footnote. Unlabelled next to a labelled FP8 row, it reads as dense. | "BF16 Tensor Core (sparse) 1,979 TFLOPS" (dense is half, about 990). Same fix in prose :149-150: "FP8 3,958 and BF16 1,979 TFLOPS (both sparse)". |
| H15 | AWS family "H100: P5, P5e / H200: P5en" | :32 | WRONG | [T1-1]: "p5e.48xlarge ... 8 x NVIDIA H200 GPU 1128 GiB (8 x 141 GiB)"; [T2-2]: "P5e and P5en instances powered by NVIDIA H200" | "H100: P5 (p5.48xlarge, p5.4xlarge) / H200: P5e, P5en" |
| H16 | "NVIDIA's 9th-generation data-center GPU architecture" | :50 | UNKNOWN | No NVIDIA source fetched states a generation ordinal (same finding as the 2026-08-01 audit for Blackwell's "10th"). | Cut the ordinal. |
| H17 | Hopper "introduced 4th-generation Tensor Cores with FP8 support" | :51-52 | CORRECT | [T2-8]: "Fourth-generation Tensor Cores introduce FP8 precision and a transformer engine" | - |
| H18 | Hopper introduced "asynchronous data movement (Tensor Memory Accelerator and async copy)" | :52-53 | WRONG | [T1-3]: "The Hopper architecture builds on top of the asynchronous copies introduced by NVIDIA Ampere GPU architecture and provides a more sophisticated asynchronous copy engine: the Tensor Memory Accelerator (TMA)" | "...the Tensor Memory Accelerator (TMA), a bulk async-copy engine for 1D-5D tensors (async copy itself arrived with Ampere), thread block clusters, and Distributed Shared Memory." |
| H19 | "the Distributed Shared Memory model" | :53 | CORRECT | [T1-3]: "A thread block can read from, write to, and perform atomics in shared memory of other thread blocks within its cluster. This is known as Distributed Shared Memory." | - |
| H20 | H100 "launched late 2022" | :54 | CORRECT | [T2-10] (2022-09-20): "in full production, with global tech partners planning in October to roll out the first wave of products" | - |
| H21 | H200 "launched November 2023" | :55 | WRONG | [T2-9] (2023-11-13): H200 "introduction"; "H200-powered systems ... are expected to begin shipping in the second quarter of 2024" | "H200 (HBM3e) was announced in November 2023 and shipped from mid-2024." |
| H22 | SM holds "64 concurrent warps", "32 threads each", "up to 32 thread blocks" | :80-81; diagram :27 | CORRECT | [T1-3]: "maximum number of concurrent warps per SM ... 64"; "maximum number of thread blocks per SM is 32" | - |
| H23 | "228 KB per SM (a 39% increase over A100's 164 KB)" | :82-83 | CORRECT | [T1-3] verbatim: "228 KB, a 39% increase compared to A100's capacity of 164 KB" | - |
| H24 | Tensor Cores "dispatched via the wgmma instruction, which operates on tiles staged through SMEM (Hopper Tuning Guide)" | :83-89 | CORRECT | Fact holds in PTX ISA 9.4 [T1-5] (wgmma B operand always via shared-memory descriptor; A via descriptor or registers; accumulator D in registers; "Requires sm_90a"). **Citation mismatch:** the Hopper Tuning Guide [T1-3] never mentions wgmma. | Re-cite to the PTX ISA. Add the practical half: "wgmma requires `sm_90a`, so wgmma kernels do not run on Blackwell." |
| H25 | "There is no branch prediction, no speculation, and no out-of-order issue per warp" | :92-96; diagram :58 | UNKNOWN | Not found in the Hopper Tuning Guide [T1-3]; the CUDA C++ Programming Guide URL now redirects to a restructured guide [T1-31] and the SIMT pages searched did not contain the statement. | Keep the mental model but soften to what is documented: "Latency is hidden by switching among ready warps; occupancy is the variable." |
| H26 | H100 and H200 have "identical FP8 (3,958 TFLOPS), BF16 (1,979 TFLOPS), and FP16 peaks" | :149-150 | CORRECT | Identical rows on [T2-6] and [T2-7] | Add "(sparse)" (see H14). |
| H27 | NVIDIA calls H200 "nearly double the capacity" and "1.4x more memory bandwidth" | :155-157 | CORRECT | [T2-7]: "nearly double the capacity of the NVIDIA H100 GPU with 1.4X more memory bandwidth" | - |
| H28 | "up to 1.9x faster Llama2 70B inference" and "1.6x faster GPT-3 175B inference" | :160-161 | CORRECT | VENDOR CLAIM [T2-7]: "Llama2 70B Inference 1.9X Faster", "GPT-3 175B Inference 1.6X Faster" (the page does not say "up to") | Drop "up to"; label as NVIDIA's figure. |
| H29 | "Compute did not change, memory bandwidth went up 1.4x, decode throughput went up 1.6-1.9x. This is the roofline prediction for decode delivered verbatim" | :166-168 (also :58-62) | WRONG | [T2-7] footnote: "Llama2 70B: ISL 2K, OSL 128 \| Throughput \| H100 SXM 1x GPU BS 8 \| H200 SXM 1x GPU BS 32"; "GPT-3 175B: ... x8 H100 SXM GPUs BS 64 \| x8 H200 SXM GPUs BS 128". The batch size differs 4x and 2x. A bandwidth-only roofline caps the decode gain at 4.8/3.35 = 1.43x [SPECULATIVE: derivation]; the excess above 1.43x comes from the extra capacity allowing a larger batch. | "Compute did not change. Bandwidth rose 1.43x, and capacity rose 1.76x, which let NVIDIA run 4x the batch (BS 32 vs BS 8) on Llama 2 70B. The 1.9x result is both memory effects together: bandwidth sets the per-step time, capacity sets how many sequences share each weight read." This strengthens the section's thesis; it just needs both halves. |
| H30 | P5: "8x H100 SXM. EFA v2. Capacity Blocks for ML support" | :187 | CORRECT | [T2-2]: "P5 and P5e instances ... up to 3,200 Gbps of networking using second-generation Elastic Fabric Adapter"; [T1-2]: p5.48xlarge listed for Capacity Blocks | - |
| H31 | P5 "still ships heavily in 2026 for workloads tuned to it" | :188-189 | UNKNOWN | No AWS or NVIDIA source states shipment volumes. | Cut. |
| H32 | P5e: "8x H100 SXM with same compute and increased GPU memory tier. EFA v2" | :195 | WRONG | [T1-1]: p5e.48xlarge "8 x NVIDIA H200 GPU"; EFA v2 part correct [T2-2] | "P5e: 8x H200 (141 GB each) on the P5 host (AMD EPYC 7R13, Nitro v4), second-generation EFA at 3,200 Gbps." |
| H33 | P5en: "8x H200 SXM. EFA v3 (built on Nitro v5)" | :202 | CORRECT | [T2-2]: "P5en, with third generation of EFA using Nitro v5, shows up to 35% improvement in latency compared to P5"; [T1-1]: P5en Nitro v5, Intel Sapphire Rapids | - |
| H34 | P5en is "the Hopper-class machine that ships H200 silicon, the right pick when ... the H100 to H200 1.9x number above applies" | :202-204 | WRONG | P5e also ships H200 [T1-1]. P5en differs from P5e in host and fabric: [T2-2] "Intel Sapphire Rapids CPU, enabling Gen5 PCIe between CPU and GPU ... up to 4x the bandwidth between CPU and GPU and lower network latency compared to P5e and P5" | "P5e and P5en both carry H200. Pick P5en when host-to-GPU traffic or collective latency matters: PCIe Gen5 to the CPU (up to 4x CPU-GPU bandwidth) and EFAv3 (up to 35% lower latency than P5), both VENDOR CLAIMs." |
| H35 | "Five years of FlashAttention generations ... production-hardened on Hopper" | :222-224 | WRONG | Hopper shipped October 2022 [T2-10], four years ago. FlashAttention-3 is still labelled "beta release" and "optimized for Hopper GPUs" in the v2.8.3.post2 README; FA4 ships only as `fa4-v4.0.0.betaNN` tags (latest beta35, 2026-10-14) [T1-30]. | "Four years of kernel work on Hopper, including FlashAttention-3..." |
| H36 | "Blackwell is catching up fast ... the long-tail of operators and the most thoroughly tested fused paths still ship on Hopper first" | :224-226 | STALE | New kernel work now lands on Blackwell and Rubin first: CUTLASS examples added since v4.2 are Blackwell (92, 93, 95) and v4.8.0 adds Rubin [T1-15][T1-16]; Triton 3.8 adds Rubin and Blackwell Gluon features [T1-21]; Inductor's CUTEDSL backend is SM100-SM109 only [T1-24]; TRT-LLM added B300/GB300 in v1.1.0 [T1-18]. | Replace with the practical version: "Hopper kernels written with wgmma do not carry forward: wgmma is `sm_90a` only, so Blackwell needs tcgen05 rewrites. Check that your critical kernels have a Blackwell path before moving." |
| H37 | Capacity Blocks: "the economics often favor a Hopper Capacity Block over chasing Blackwell on on-demand pricing" | :231-235 | UNKNOWN | No pricing comparison located. The AWS-side fact that changed Hopper economics: June 2025 price cut, P5 On-Demand -44%, P5en -25% from the May 31, 2025 baseline [T2-5]. Trade press reports Capacity Block price rises in January and July 2026 [T3-3] (snippet only, not verified against AWS pricing). | Replace the opinion with the AWS price-cut fact, or cut. |
| H38 | "Workloads that need NVFP4 or tcgen05.mma, Blackwell-only" | :240 | STALE | tcgen05.mma targets `sm_100a`, `sm_110a`, and "sm_100f or higher in the same family" [T1-5], which covers CC 10.0, 10.3 and 10.7 (Rubin) [T1-7]. Rubin lists NVFP4 at 50 PFLOPS sparse [T2-21]. | "...NVFP4 or tcgen05.mma (Blackwell and later)" |
| H39 | "Models that exceed 141 GB and would otherwise fit in B200 / B300" | :242 | CORRECT | B200 "up to 180 GB" [T1-4]; B300 288 GB [T2-12]; AWS 179 GiB / 268 GiB per GPU [T1-1] | - |
| H40 | Diagram: register file "~1 cycle" | HopperSmDiagram.tsx:34 | UNKNOWN | NVIDIA publishes no register access latency; not in [T1-3]. | Drop the latency label or mark it [SPECULATIVE]. |
| H41 | Diagram: SMEM "~10-15 ns" | HopperSmDiagram.tsx:41 | UNKNOWN | No vendor figure. Tier 3 [T3-1] Table IV (H800 PCIe, a Hopper part with HBM2e): shared memory 29.0 cycles, L1 40.7 cycles, about 17 ns and 23 ns at the paper's 1,755 MHz [SPECULATIVE: conversion]. | "about 30 cycles (Tier 3 microbenchmark)" |
| H42 | Diagram: "3,958 TFLOPS FP8 (full chip)" | HopperSmDiagram.tsx:48 | WRONG | Sparse figure, unlabelled [T2-6] | "3,958 TFLOPS FP8 sparse (1,979 dense)" |
| H43 | Diagram: L2 "~150 ns class" | HopperSmDiagram.tsx:65 | UNKNOWN | No vendor figure. Tier 3 [T3-1]: L2 263.0 cycles on H800, about 150 ns at 1,755 MHz [SPECULATIVE: conversion]; consistent. | Label "(Tier 3 microbenchmark)". |
| H44 | Diagram: HBM "~250 ns latency" | HopperSmDiagram.tsx:73 | UNKNOWN | No vendor figure. Tier 3 [T3-1]: global memory 478.8 cycles on H800 PCIe (HBM2e), about 273 ns [SPECULATIVE: conversion]. | "about 480 cycles, roughly 270 ns (Tier 3, H800 PCIe)". |
| H45 | Diagram: HBM bandwidths and "(1.4x)" | HopperSmDiagram.tsx:69-72 | CORRECT | [T2-6], [T2-7]; 4.8 / 3.35 = 1.43 | - |
| H46 | p5.4xlarge: a single-H100 P5 size exists | (absent) | NEW | [T1-1]: "p5.4xlarge ... 1 x NVIDIA H100 GPU 80 GiB"; [T2-2]: "100 Gbps EFA", "GPUDirect RDMA is not supported in P5.4xlarge"; Capacity Blocks eligible [T1-2] | Practical: the cheapest way to get one Hopper GPU on AWS; no GPUDirect RDMA. |
| H47 | AWS Hopper price cut (June 2025) | (absent) | NEW | [T2-5]: price reductions "from May 31, 2025 baseline": P5 (H100) On-Demand 44%, P5en (H200) On-Demand 25% | Use in "Where Hopper still wins" in place of the unsourced Capacity Block opinion. |
| H48 | wgmma is Hopper-only (`sm_90a`) | (absent) | NEW | [T1-5] wgmma Target ISA Notes: "Requires sm_90a" | Practical for any Hopper-to-Blackwell migration. |

### Recommended edits

1. Spec table (`:20-32`): fix the AWS row (H15: P5 = H100; P5e and P5en = H200), label BF16 sparse (H14), label NVLink bidirectional (H12), and mark the H200 SM-count and L2 cells as not published (H4).
2. Replace the "roofline delivered verbatim" Alert (`:159-169`) with the both-halves version in H29. This is the section's strongest number (1.9x), and the batch-size footnote turns it into a sharper mental model: bandwidth sets the step time, capacity sets the batch. Repeat "4x the batch" once in the h2 description.
3. Hopper on AWS (`:184-206`): rewrite P5e and P5en per H32 and H34; add p5.4xlarge (H46).
4. Intro (`:50-55`): drop "9th-generation"; fix async copy (H18) and the H200 date (H21).
5. Re-cite wgmma (`:83-89`) to the PTX ISA and add "`sm_90a` only" (H24, H48).
6. "Where Hopper still wins": replace the Capacity Blocks opinion with the June 2025 price-cut fact (H37, H47); replace "ships on Hopper first" with the wgmma-does-not-carry-forward pitfall (H36); change "Blackwell-only" to "Blackwell and later" (H38).
7. Diagram: label the FP8 figure sparse (H42); replace the latency labels with Tier 3 cycle counts marked as such (H40-H44).
8. **CUT candidates:** "still ships heavily in 2026" (H31, no source and no reader action); the "9th-generation" ordinal (H16, no mental model, no action).

---

## 2. `sections/NvidiaBlackwell.tsx` (+ `components/BlackwellDieDiagram.tsx`)

**What the section covers.** Blackwell's two-die GPU and NV-HBI, TMEM and the tcgen05 Tensor Core path, NVFP4, a B200 vs B300 spec table with AWS families, workload fit, and why Blackwell software trailed the hardware (CUTLASS and TRT-LLM version history).

### Folded-in findings from the 2026-08-01 adversarial audit (`docs/verification/2026-08-01/P3-silicon-numbers.md`)

All of the audit's section-3 findings against this file are **still present in the code** on 2026-10-16: FP4 "14 PFLOPS" with no sparse/dense label (`:28`, `:60`, and also the diagram `:61`, which the audit missed); NVLink 1.8 TB/s unlabelled (`:24`, diagram `:64`); P6e-GB200 in the B300 column (`:29`); "seven new instructions" (`:115`); the unsourced "2x to 4x" (`:115-116`); example 92 as "first" SM100 example (`:117-118`) and as shipped in v4.0.0 (`:206`); the 690 GB to 415 GB DeepSeek-V3.2 figure (`:132-134`, diagram `:61`); "roughly halves" (`:53-54`); the "10th-generation" ordinal (`:47`). Re-verified below against current sources.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| B1 | B200 die "GB100 (two reticles + NV-HBI)" | NvidiaBlackwell.tsx:20 | UNKNOWN | Two dies and NV-HBI are CORRECT: "two reticle-limited dies connected by a 10 terabytes per second (TB/s) chip-to-chip interconnect in a unified single GPU" [T2-11]. The "GB100" codename appears in no fetched NVIDIA source (searched all fetched pages). | "Two reticle-limited dies, 208B transistors, TSMC 4NP, joined by NV-HBI at 10 TB/s" |
| B2 | B300 die "GB100-derived (Blackwell Ultra)" | :20 | UNKNOWN | No codename in NVIDIA sources. [T2-12]: two reticle-sized dies, NV-HBI 10 TB/s, 208B transistors, TSMC 4NP, "up to 160 SMs" | "Same two-die design; up to 160 SMs" |
| B3 | B300 HBM generation "HBM3e+" | :21 | WRONG | [T2-12]: "HBM3E memory capacity reaches 288 GB"; "HBM configuration: Eight 12-Hi stacks, 16 x 512-bit controllers (8,192-bit total width)" | "HBM3e (8 x 12-high stacks)" |
| B4 | HBM capacity "up to 180 GB" / "288 GB" | :22, :58; diagram :36-37 | CORRECT | [T1-4]: B200 "capacity up to 180 GB"; [T2-12]: B300 "288 GB of HBM3e per GPU" and "Available SM count and HBM capacity varies by SKU"; [T1-1]: p6-b200 8 x 179 GiB, p6-b300 8 x 268 GiB | Optional note: GB200 superchip GPUs carry 186 GB (372 GB per 2 GPUs) [T2-16]. |
| B5 | HBM bandwidth "~8 TB/s class" / "8 TB/s" | :23, :59; diagram :36-37 | CORRECT | DGX B200 "64 TB/s HBM3e bandwidth" / 8 [T2-13]; [T2-12]: "Bandwidth: 8 TB/s per GPU" | - |
| B6 | "NVLink Gen 5 per GPU 1.8 TB/s" | :24; diagram :64 | CORRECT | [T2-12]: "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)" | Label: "1.8 TB/s bidirectional (900 GB/s per direction)". The 2026-08-01 audit's finding still applies. |
| B7 | 5th-gen Tensor Core, tcgen05.mma | :25; diagram :31-32 | CORRECT | [T1-5] PTX ISA 9.4 section 9.7.18 "TensorCore 5th Generation Family Instructions" | - |
| B8 | "TMEM per SM 256 KB" | :26, :51, :112; diagram :30 | CORRECT | [T2-12]: "256 KB of Tensor Memory (TMEM) per SM"; [T1-5]: "512 columns and 128 rows per CTA, with each cell being 32-bits" on `sm_100a`/`sm_100f` (= 256 KiB) | - |
| B9 | NVFP4 "Yes, first generation" (B200) | :27 | CORRECT | [T2-28]: "NVIDIA Blackwell introduces NVFP4" | - |
| B10 | "FP4 PFLOPS per GPU: B200 -, B300 14 PFLOPS" | :28 | WRONG | Per GPU, NVIDIA's sparse \| dense pairs: HGX B200 144 \| 72 per 8 GPUs = 18 \| 9; GB200 NVL72 1,440 \| 720 per 72 = 20 \| 10; HGX B300 144 \| 108 = 18 \| 13.5; GB300 NVL72 1,440 \| 1,080 = 20 \| 15 [T2-15][T2-16][T2-17]. Blackwell Ultra blog: "15 PetaFLOPS dense NVFP4" [T2-12]. 14 matches none. | Row "NVFP4 dense / sparse per GPU": B200 "9 / 18 (HGX), 10 / 20 (GB200)"; B300 "13.5 / 18 (HGX), 15 / 20 (GB300)". |
| B11 | AWS family "B200: P6-B200 / B300: P6-B300, P6e UltraServer (GB200)" | :29 | WRONG | [T1-1]: "p6e-gb200.36xlarge ... 4 x NVIDIA B200 GPU, 740 GiB (4 x 185 GiB)"; P6e-GB300 GA 2025-12-02 [T2-3] | "B200: P6-B200, P6e-GB200 UltraServer / B300: P6-B300, P6e-GB300 UltraServer" |
| B12 | "NVIDIA's 10th-generation data-center GPU architecture" | :47 | UNKNOWN | No ordinal in any NVIDIA source fetched (unchanged from the 2026-08-01 audit). | Cut the ordinal. |
| B13 | Two dies "presented to the CUDA programmer as a single coherent GPU" | :48-50, :85-86; diagram :52-55 | CORRECT | [T2-12]: "functioning as a single, NVIDIA CUDA-programmed accelerator"; "Shared L2 cache with fully coherent memory accesses" | - |
| B14 | TMEM "sits between SMEM and the 5th-generation Tensor Core"; the Tensor Core "consumes operands from TMEM" | :51-52, :113-114 | WRONG | [T1-5] tcgen05.mma syntax: `[d-tmem], a-desc, b-desc` or `[d-tmem], [a-tmem], b-desc`. The accumulator D always lives in TMEM; A comes from SMEM or TMEM; B always from SMEM. Also: "tcgen05.mma has single thread semantics, unlike the collective instructions mma.sync or wgmma.mma_async". | "TMEM holds the accumulator. On Hopper the running sum of a matmul lived in the issuing warps' registers; on Blackwell it lives in a 256 KB per-SM Tensor Memory, and one thread can launch the whole MMA. B still streams from SMEM; A can come from SMEM or TMEM." This is the mental model the section is reaching for. |
| B15 | NVFP4 "roughly halves model footprint at FP8" | :53-54 | WRONG | [T2-28]: "approximately 3.5x relative to FP16, and approximately 1.8x compared to FP8" | "about 1.8x smaller than FP8" |
| B16 | "B300 ships 288 GB vs H200's 141 GB" | :58 | CORRECT | [T2-12], [T2-7] | - |
| B17 | "FP4 reaching 14 PFLOPS per GPU on B300" | :59-60 | WRONG | See B10. | "dense NVFP4 at 15 PFLOPS per GPU (NVIDIA's Blackwell Ultra figure; HGX B300 boards rate 13.5)" |
| B18 | For 671B-1T MoE, "the capacity move alone can be the difference between fitting in a single rack and not fitting at all" | :60-62 | WRONG | A GB200 NVL72 rack already holds 13.4 TB of HBM [T2-16], far above a 1T-parameter model. The capacity move matters at the 8-GPU node: 8 x 141 GB = 1,128 GB (P5e/P5en) vs 8 x 268 GiB = 2,144 GB (P6-B300) [T1-1]; a 1T-parameter model at FP8 is about 1 TB of weights before KV cache [SPECULATIVE: arithmetic]. | "...the difference between fitting in one 8-GPU node and sharding across two." |
| B19 | NV-HBI "roughly 10 TB/s aggregate (NVIDIA stated at announcement; verified per-link rate not currently in the public datasheet I fetched)" | :82-84; diagram :45 | CORRECT | [T2-11], [T2-12]: "10 TB/s" | Keep "10 TB/s"; cut the first-person parenthetical (page-history voice). |
| B20 | Alert "Per-die specifics not directly fetched ... will land in a future iteration" | :88-96 | STALE | Process meta-content. Some of it is now published: B300 uses "Eight 12-Hi stacks, 16 x 512-bit controllers" [T2-12]. | CUT the Alert. Put "NVIDIA does not publish the per-die HBM split" in one sentence if needed. |
| B21 | tcgen05.mma family: "seven new instructions for matmul" | :114-115 | WRONG | [T1-5] PTX ISA 9.4 section 9.7.18.10.10: four MMA instructions, `tcgen05.mma`, `tcgen05.mma.sp`, `tcgen05.mma.ws`, `tcgen05.mma.ws.sp`. Unchanged from the 2026-08-01 audit. | "four MMA instructions (dense, sparse, and warp-specialized variants of each)" |
| B22 | "that NVIDIA describes as 2x to 4x faster than Hopper's wgmma" | :115-116 | UNKNOWN | Not in Blackwell Tuning Guide [T1-4], PTX ISA [T1-5], Blackwell Ultra blog [T2-12] or Blackwell architecture page [T2-11]. | Cut; replace with the single-thread-issue fact from B14. |
| B23 | "example 92 (Blackwell MoE GEMM) was the first CUTLASS example to ship with the SM100 target" | :116-118 | WRONG | [T1-15]: `examples?ref=v4.1.0` has no `92_*`; v4.2.0 adds it; `70_blackwell_gemm` through `78_*` predate it (v3.8.0 per the 2026-08-01 audit). [T1-16] CHANGELOG 4.2.0: "Add Blackwell SM100 kernels for MoEs (focusing on Low-Latency inference performance): example 92". | "CUTLASS example 92 adds Blackwell MoE GEMMs tuned for low-latency inference (since v4.2.0)." |
| B24 | Link to CUTLASS example 92 on the `main` branch | :122 | STALE | Unpinned link (CI gate). Path verified via GitHub API at tag v4.8.0 (tag commit `098de2a652cf8f00fd70b2df54051c7eccbb855a`): contains `92_blackwell_moe_gemm_regular.cu`, `..._grouped.cu`, `..._rcgrouped.cu`, `..._blockscaled_rcgrouped.cu`, `..._fp4_grouped.cu`, `..._fp4_regular.cu` [T1-17]. First tag containing the path: v4.2.0. | `https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm` |
| B25 | NVFP4: 16-element blocks, E4M3 per-block scale, FP32 per-tensor scale, "3.5x over FP16 and 1.8x over FP8" | :129-132 | CORRECT | [T2-28]: "fine-grained E4M3 scaling factor to each 16-value micro-block ... second-level FP32 scalar applied per tensor"; "approximately 3.5x relative to FP16, and approximately 1.8x compared to FP8" | - |
| B26 | "NVFP4 reduced DeepSeek-V3.2's footprint from 690 GB FP8 to 415 GB" (cited to the NVFP4 blog) | :132-134; diagram :61 | WRONG | Re-fetched [T2-28]: no DeepSeek-V3.2 footprint; only DeepSeek-R1-0528 accuracy and a pointer to the `DeepSeek-R1-0528-FP4` checkpoint. 690/415 = 1.66x contradicts the 1.8x two sentences earlier. Unchanged from the 2026-08-01 audit. | Cut the sentence (and the diagram caption half). |
| B27 | Watch out: "Operators not yet on the Blackwell tcgen05 path, falls back to slower kernels" | :194 | WRONG | Hopper's tensor-core path does not fall back: wgmma "Requires sm_90a" [T1-5], so a wgmma kernel has no Blackwell binary at all. | "Hopper-specific kernels (wgmma) must be rewritten for tcgen05; check that your critical kernels have a Blackwell build." |
| B28 | "Workloads that already fit in 141 GB H200, Hopper economics may win" | :195 | CORRECT | Supported by AWS's June 2025 Hopper price cut (P5en On-Demand -25%) [T2-5] | Optionally cite the price cut. |
| B29 | "Tooling maturity: CUTLASS / Triton / Inductor catching up to Hopper coverage" | :197 | STALE | CUTLASS 4.8.0 adds Rubin on top of Blackwell [T1-16]; Triton 3.8.0 Blackwell Gluon features and Rubin [T1-21]; Inductor's CUTEDSL backend targets SM100-SM109 only [T1-24]; TRT-LLM supports B300/GB300 since v1.1.0 [T1-18]. | Cut, or replace with B27. |
| B30 | "CUTLASS example 92 first appeared in v4.0.0 (June 2025)" | :206 | WRONG | [T1-15]: not in v4.0.0 or v4.1.0; present in v4.2.0 (release published 2025-09-18; CHANGELOG dates 4.2.0 as 2025-09-15) | "v4.2.0 (September 2025)" |
| B31 | "simplified MoE API arrived in v4.3.0 (November 2025)" | :207 | CORRECT | [T1-16] CHANGELOG 4.3.0 (2025-11-21): "Simplification of API for MoE gemms"; `MoEProblemShape` introduced | - |
| B32 | "the per-decoding scale variant in v4.4.0 (February 2026)" | :207-208 | CORRECT | [T1-16] CHANGELOG 4.4.0 (2026-02-14), CuTe DSL: "New acc_scale grouped mixed input gemm kernel variant is introduced to deliver better performance for decoding cases" | Precise form: "a CuTe DSL acc_scale grouped GEMM for decode (v4.4.0)". |
| B33 | "TRT-LLM NVFP4 cubins for MoE shipped in v1.0" | :208 | UNKNOWN | TRT-LLM v1.0.0 release notes [T1-18] do not say this. NVFP4 GEMM support dates to v0.17.0 ("Added NVFP4 Gemm support for Llama and Mixtral models"); v1.0.0 lists "Support deepEP fp4 post quant all2all dispatch". | Cut, or "NVFP4 GEMMs since v0.17.0". |
| B34 | Diagram: "TSMC 4NP, ~104B transistors" per die | BlackwellDieDiagram.tsx:28 | UNKNOWN | 4NP and 208B total are CORRECT [T2-11]; NVIDIA states no per-die count; 104B is 208/2 [SPECULATIVE: derivation]. | "TSMC 4NP; 208B transistors across both dies" |
| B35 | Diagram: "4 HBM3e stacks per die" (both dies), next to "UNKNOWN per-die HBM split" | BlackwellDieDiagram.tsx:35, :38, :57 | UNKNOWN | B300: 8 stacks total [T2-12], so 4 per die is consistent but NVIDIA does not state the split. B200 stack count not found in Tier 1/2. The diagram asserts and disclaims the same thing. | "8 HBM3e stacks per GPU (B300); per-die split not published" |
| B36 | Diagram caption: "Total NVFP4 throughput (B300): 14 PFLOPS per GPU" | BlackwellDieDiagram.tsx:61 | WRONG | See B10 (the 2026-08-01 audit did not list this occurrence). | "B300: 15 PFLOPS dense NVFP4 per GPU (20 sparse, GB300 NVL72)" |
| B37 | B200 is CC 10.0 (`sm_100`), B300 is CC 10.3 (`sm_103`); `compute_100f` binaries run on 10.0, 10.3 and 10.7 (Rubin) | (absent) | NEW | [T1-9]: "10.3 NVIDIA GB300 NVIDIA B300 ... 10.0 NVIDIA GB200 NVIDIA B200"; [T1-7]: compute_100f "compatible with devices of Compute Capability 10.0, 10.3, and 10.7" | Practical: what `-arch` to build for. |
| B38 | B300 trades INT8 and FP64 for NVFP4 | (absent) | NEW | [T2-15] HGX B300 vs B200 (8 GPUs, sparse): INT8 "3 POPS" vs "72 POPS"; FP64 "10 TFLOPS" vs "296 TFLOPS". [T1-5]: tcgen05.mma `.kind::i8` is supported only on `sm_100a` and `sm_110a`, not the `sm_100f` family set. | Practical: INT8-quantized or FP64 workloads belong on B200, not B300. |
| B39 | B300's FP4 gain is dense-only | (absent) | NEW | Sparse FP4 is 144 PFLOPS on both HGX B300 and HGX B200; dense goes 72 to 108 [T2-15]. AWS frames it "1.5x GPU TFLOPS (at FP4, without sparsity)" [T2-1]. | Mental model: Blackwell Ultra made dense NVFP4 cheaper, not sparse. |
| B40 | Blackwell Ultra doubles attention SFU throughput | (absent) | NEW | VENDOR CLAIM [T2-12]: "Accelerated softmax execution doubles SFU throughput for attention-layer operations, delivering up to 2x faster attention compute compared to Blackwell GPUs"; [T2-15] "Attention Performance 2x" | Optional; ties to the KV-cache/attention sections. |
| B41 | Blackwell kept Hopper's SMEM and added TMEM; Rubin grows SMEM | (absent) | NEW | [T1-4]: CC 10.0 "shared memory capacity per SM is 228 KB", same 256 KB L1+SMEM "as the previous NVIDIA Hopper architecture"; "GB200 GPU increases the L2 cache capacity to 126 MB". [T1-7]: CC 10.7 max shared memory per SM 328 KB. | Mental model: Blackwell's new on-chip capacity went into TMEM, not SMEM. |
| B42 | Successor: Vera Rubin is shipping | (absent) | NEW | [T1-25], [T2-21], [T2-23]. Per GPU: 288 GB HBM4; NVFP4 50 PFLOPS sparse / 35 dense; NVLink 6 at 3 TB/s (NVL72 page) or 3.6 TB/s (HGX page), conflict noted in section 0. No AWS Rubin instance yet [T1-1]. Rubin Ultra and Feynman are ROADMAP [T2-24][T2-25]. | One short paragraph so B200 vs B300 is not read as the top of the roadmap. |

### Recommended edits

1. Spec table (`:19-30`): B3 (HBM3e, 8 x 12-high), B10 (sparse and dense per GPU, two rows), B11 (AWS families), B6 (bidirectional), B1/B2 (drop die codenames). Add a "Compute capability" row: 10.0 / 10.3 (B37).
2. Rewrite the TMEM paragraph (`:111-127`) around B14: TMEM holds the accumulator and tcgen05.mma is single-thread issue. Drop "seven instructions" (B21), "2x to 4x" (B22) and "first SM100 example" (B23). Pin the link (B24).
3. NVFP4 paragraph (`:129-144`): keep the 3.5x/1.8x facts; cut the DeepSeek-V3.2 figure (B26); fix "roughly halves" in the intro (B15).
4. Intro (`:46-63`): drop the ordinal (B12); 14 to 15 PFLOPS dense (B17); "single rack" to "single 8-GPU node" (B18).
5. Add one practical block: "What changes between B200 and B300" with B38 (INT8/FP64 cut), B39 (dense-only FP4 gain), B37 (`sm_103`). This is the strongest practical content the refresh found for this section.
6. Watch-out list: replace the fallback bullet with B27 (wgmma has no Blackwell build) and drop B29.
7. "Software trailed silicon" ExpandableSection (`:201-213`): fix v4.0.0 to v4.2.0 (B30); cut the TRT-LLM v1.0 claim (B33). Consider cutting the version list entirely (see CUT list).
8. Add a two-sentence successor note (B42), labelled with what is shipping and what is ROADMAP.
9. Diagram: fix the caption (B36, B26), "~104B" (B34), and make the stack count consistent (B35); label NVLink bidirectional (B6).
10. **CUT candidates:** the "Per-die specifics not directly fetched" Alert (B20, page-history voice, no mental model or action); the CUTLASS minor-version timeline in the ExpandableSection (version trivia; keep only "check the release your kernel landed in", which is the practical point); the "10th-generation" ordinal (B12).

---

## 3. `sections/GraceBlackwellUltraServer.tsx` (+ `components/Nvl72Diagram.tsx`)

**What the section covers.** The Grace-Blackwell superchip and NVLink-C2C, the GB200 NVL72 rack as one 72-GPU NVLink domain, the argument that NVL72 is sized for MoE expert parallelism (DeepSeek-R1 EP=64, TRT-LLM Wide-EP over MNNVL), the Grace CPU's memory, and AWS P6e-GB200 / P6e-GB300 UltraServers.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| G1 | Superchip pairs "an NVIDIA Grace CPU with one or more Blackwell GPUs over NVLink-C2C" | GraceBlackwellUltraServer.tsx:27-29 | CORRECT | [T2-16]: GB200 superchip "1 Grace CPU \| 2 Blackwell GPU"; [T2-1]: GB300 superchip "connects two NVIDIA Blackwell Ultra GPUs with one NVIDIA Grace CPU" | "one Grace CPU with two Blackwell GPUs" (both generations use two) |
| G2 | "NVLink-C2C delivers 900 GB/s of coherent bandwidth between CPU and GPU" | :31-32, :134-137; Nvl72Diagram.tsx:94 | CORRECT | [T2-11]: "900 gigabytes per second (GB/s) of bidirectional bandwidth"; [T2-12] Table 1 NVLink-C2C 900 "in BiDir GB/s" | Label "900 GB/s bidirectional". |
| G3 | NVLink-C2C is "the same protocol that connects GPUs to each other in the rack" | :32 | WRONG | [T2-19]: NVLink-C2C is "Extending NVLink to chip-level integration", built on its own SerDes and link design, at 900 GB/s vs NVLink 5's 1.8 TB/s per GPU [T2-12]. | "a chip-to-chip member of the NVLink family" |
| G4 | NVL72 places "72 Blackwell GPUs and 36 Grace CPUs into a single NVLink domain" | :35-37; Nvl72Diagram.tsx:26, :30, :91 | CORRECT | [T2-16]: "36 Grace CPU \| 72 Blackwell GPUs" | - |
| G5 | "Every GPU reaches every other GPU at 1.8 TB/s through the NVSwitch fabric"; "full bisection bandwidth ... no over-subscription" | :37, :67-68, :181; Nvl72Diagram.tsx:33, :82, :85 | CORRECT | [T2-12]: "1.8 TB/s bidirectional GPU-to-GPU bandwidth supporting up to 576 GPUs in non-blocking fabric"; [T2-18]: NVLink Switch provides "all-to-all GPU communication at full NVLink speed across the entire rack" | Label: "1.8 TB/s per GPU, bidirectional (900 GB/s each way)". |
| G6 | "aggregate NVLink bandwidth is 130 TB/s" | :38; Nvl72Diagram.tsx:33, :85 | CORRECT | [T2-16]: "NVLink Bandwidth 130 TB/s" | - |
| G7 | "Aggregate GPU memory is 13.4 TB HBM3e; aggregate CPU memory is 17.3 TB LPDDR5X" | :38-39; Nvl72Diagram.tsx:33, :97 | CORRECT | [T2-16]: "13.4 TB HBM3E \| 576 TB/s"; "17 TB LPDDR5X \| 14 TB/s"; 36 x 480 GB = 17.28 TB | - |
| G8 | "GB300 NVL72 raises GPU memory to 20 TB and FP4 PFLOPS to 1,440" | :44-45 | WRONG | GB200 NVL72 is already "NVFP4 Tensor Core 1,440 \| 720 PFLOPS" (sparse \| dense) [T2-16]; GB300 NVL72 is "1440 \| 1080 PFLOPS" [T2-17]. The gain is dense only. 20 TB is correct [T2-17]. | "GB300 NVL72 raises GPU memory to 20 TB and dense NVFP4 from 720 to 1,080 PFLOPS; the sparse peak stays at 1,440." |
| G9 | "DeepSeek-R1 has 256 routed experts" | :88 | CORRECT | [T2-27]: "each token is sent to eight experts out of the full pool of 256" | - |
| G10 | DeepSeek-R1 "recommends EP=64 (4 experts per GPU) for production deployment" | :88-89; Nvl72Diagram.tsx:106 | WRONG | The figure is NVIDIA's, not DeepSeek's: [T2-27] "For the DeepSeek R1 model, this is typically around four experts per GPU, which requires 64 GPUs to accommodate the full 256 routed experts during decoding". No DeepSeek source for an EP=64 recommendation was located in this pass. | "NVIDIA's DeepSeek-R1 decode layout places about four routed experts per GPU, so 64 GPUs hold all 256." |
| G11 | EP=64 "fits inside one NVL72 NVLink domain with eight GPUs of headroom" | :89-90 | CORRECT | 72 - 64 = 8 | - |
| G12 | NVIDIA quote "If the selected experts reside on GPUs that sit on different nodes, the all-to-all communication becomes bottlenecked by slower internode communication protocols, such as InfiniBand" | :90-93 | CORRECT | Verbatim in [T2-27] (2025-06-06) | - |
| G13 | Wide-EP "uses MNNVL, Multi-Node NVLink, to carry expert all-to-all over the NVL72 fabric" | :105-106 | CORRECT | [T1-19] wide_ep README at v1.2.1: "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)" | - |
| G14 | "EP > 8 was previously rare because the NVLink domain was 8 GPUs (HGX)" | :106-107 | UNKNOWN | No source located for how common EP > 8 was. | Cut, or reframe as the bandwidth step (G21). |
| G15 | "Wide-EP up to 64 ships in TRT-LLM v0.21.0 onward" | :108 | UNKNOWN | v0.21.0 (2025-08-04) notes: "Added large-scale EP support" [T1-18], so the version is right. "Up to 64" is not stated; the README's worked example is "DeepSeek R1, 32-way EP" [T1-19]. The `examples/wide_ep` path is absent at v0.21.0 (GitHub API "Not Found") and present from v1.0.0. | "Large-scale EP shipped in TensorRT-LLM v0.21.0 (August 2025)." |
| G16 | "The architectural choice was made specifically for MoE"; headers "Why NVL72 was sized for 72", "MoE-sized, by design" | :80-82, :108-109 | UNKNOWN | No NVIDIA source says the 72-GPU domain size was chosen for MoE. NVIDIA's MoE blog argues NVL72 suits MoE [T2-27]; it does not claim design intent. | Reframe as fit, not intent: "Why 72 GPUs fits MoE". |
| G17 | Grace "CPU memory, 480 GB LPDDR5X ... At ~500 GB/s per CPU" | :126-128; Nvl72Diagram.tsx:94 | CORRECT | [T2-16]: "Up to 480 GB LPDDR5X \| Up to 512 GB/s" per superchip. **Doc-vs-doc conflict:** NVIDIA's Grace CPU spec table lists "Up to 384 GB/s for 480GB" for a single Grace [T2-20]. | "480 GB LPDDR5X at up to 512 GB/s (NVIDIA's GB200 figure; the standalone Grace spec lists 384 GB/s for the 480 GB part)" |
| G18 | "Soldered, not socketed. Fits in a 16 W envelope." | :128 | CORRECT | [T2-20]: LPDDR5X "delivers up to 500 GB/s in only about 16W, approximately one fifth the power of conventional DDR5 memory"; "on-module memory" | Make clear the 16 W is the memory subsystem, not the CPU. Note Vera moves to "field-replaceable SOCAMM modules" [T2-20]. |
| G19 | Grace "Sits on the same package as the GPU" (also "on the same package" at :146-147) | :129, :146-147 | WRONG | AWS: "2 GPUs and 1 CPU are co-located within one compute module" [T2-1]; they are separate chips joined by NVLink-C2C [T2-16], which NVIDIA describes as spanning "PCB-level integration, multi-chip modules (MCM), and silicon interposer" [T2-19]. | "Sits on the same compute module (board) as its two GPUs" |
| G20 | "72-core Neoverse V2 host CPU (similar lineage to Graviton4)" | :145 | CORRECT | [T2-16]: "72 Arm Neoverse V2 cores" per superchip; [T1-29]: Graviton4 core column "Neoverse-V2" | - |
| G21 | Outside the domain "GPU-to-GPU goes over EFA / InfiniBand at much lower bandwidth" | :179-186 | CORRECT | On AWS the scale-out fabric is EFA: "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per P6e-GB200 UltraServer" [T2-1] (AWS's "GB ps" is a typo for Gbps; 28.8 Tbps / 72 = 400 Gbps). | Add the number: "400 Gbps of EFAv4 per GPU (50 GB/s each way) vs 900 GB/s each way over NVLink, about 18x [SPECULATIVE: derived ratio]". On AWS drop "InfiniBand". |
| G22 | P6e-GB200: "72-GPU NVLink domain, 36 Grace CPUs, NVLink-C2C coherent. Capacity Blocks for ML pricing applies" | :165-167 | CORRECT | [T2-1]: "up to 72 Blackwell GPUs within one NVLink domain"; [T1-2]: UltraServer Capacity Blocks table lists "P6e-GB200" | - |
| G23 | P6e-GB300: "288 GB / GPU, 20 TB aggregate, higher FP4 PFLOPS, same NVLink topology" | :172-175 | CORRECT | GA 2025-12-02 [T2-3]; AWS: "1.5x GPU memory and 1.5x GPU TFLOPS (FP4, without sparsity) compared to P6e-GB200", "close to 20TB of GPU memory per UltraServer" [T2-1]. AWS publishes no per-GPU figure; 288 GB is NVIDIA's Blackwell Ultra maximum [T2-12]. | "close to 20 TB per UltraServer (AWS); 1.5x dense FP4 and 1.5x memory vs P6e-GB200" |
| G24 | AWS sells half-rack UltraServers and lists per-instance shape | (absent) | NEW | [T2-1]: "u-p6e-gb200x72" (72 GPUs, 13,320 GB, 28,800 Gbps EFA) and "u-p6e-gb200x36" (36 GPUs, 14,400 Gbps); [T1-1]: each `p6e-gb200.36xlarge` = 4 x B200, 740 GiB, Nitro v5, Grace arm64 | Practical: the NVLink domain you buy can be 36 or 72 GPUs. |
| G25 | P6e-GB300 is not self-serve | (absent) | NEW | [T2-3]: contact "your AWS sales representative"; absent from the EC2 instance-type spec page [T1-1] and the UltraServer Capacity Blocks table (lists only Trn2 and P6e-GB200) [T1-2] | Practical for anyone planning capacity. |
| G26 | GB200/GB300 expose GPU memory to the OS as NUMA nodes unless CDMM is on | (absent) | NEW | [T1-19]: "Starting from R580 Driver, Coherent Driver-Based Memory Management (CDMM) for GB200 platforms is introduced. With CDMM, the driver manages GPU memory instead of the OS"; "GPU memory is also on NUMA nodes on GB200/GB300 NVL72 ... Bind memory to CPU nodes" | Practical: the coherent address space has an operational side (NUMA binding). |
| G27 | Successor rack: Vera Rubin NVL72 | (absent) | NEW | [T2-21]: 72 Rubin GPUs, 36 Vera CPUs (88 Olympus cores each), 20.7 TB HBM4, up to 54 TB LPDDR5X, NVLink 6 216 TB/s per rack, NVLink-C2C 1.8 TB/s per superchip; shipping per [T1-25]. Not on AWS yet [T1-1]. | One sentence after the GB300 mention. |

### Recommended edits

1. Intro (`:26-50`): label NVLink-C2C and NVLink bandwidths bidirectional (G2, G5); fix "same protocol" (G3); rewrite the GB300 sentence so the gain is dense FP4 (G8). This is the section's most consequential numeric error: as written, a reader concludes GB200 NVL72 has less sparse FP4 than it does.
2. MoE Alert (`:87-103`): attribute EP=64 to NVIDIA's example, not to DeepSeek (G10); keep the verbatim NVIDIA quote (G12).
3. Wide-EP paragraph (`:104-110`): "large-scale EP in v0.21.0" (G15); drop "EP > 8 was previously rare" (G14) and "made specifically for MoE" (G16). Rename the h2 to state fit, not intent.
4. Grace column (`:124-150`): "same compute module", not "same package" (G19); 512 GB/s with the 384 GB/s doc conflict (G17); scope the 16 W to memory (G18).
5. AWS block (`:163-189`): add the EFA vs NVLink per-GPU number to the ExpandableSection (G21); add the x36/x72 sizes (G24) and the sales-only note for P6e-GB300 (G25). End the section on that block, since it is the reader's next action.
6. Diagram: label bidirectional (G5, G2); change the EP=64 caption to "NVIDIA's DeepSeek-R1 layout" (G10).
7. Optional NEW: one sentence on CDMM/NUMA (G26) and one on Vera Rubin NVL72 (G27).
8. **CUT candidates:** "EP > 8 was previously rare" (G14, unsourced history, no action); the "eliminates an entire class of host-side bottlenecks" clause at `:146-147` (unsourced, no mental model beyond what NVLink-C2C already gives).

---

## 4. `sections/NvidiaCompilersAndTooling.tsx` (+ `components/NvidiaCompilerStack.tsx`)

**What the section covers.** The lowering path from PyTorch to SASS (Inductor, Triton, CUTLASS/CuTe, cuBLAS, PTX/ptxas), Triton vs CUTLASS, TensorRT-LLM and Wide-EP with a version history, and Nsight Compute vs Nsight Systems.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| C1 | "torch.compile runs Inductor by default" | NvidiaCompilersAndTooling.tsx:20 | CORRECT | [T1-24] `torch/__init__.py` at v2.14.1, line 3019: `backend: str \| _Callable[..., _Any] = "inductor"` | - |
| C2 | Inductor "emits Triton kernels by default" | :21, :155-156 | CORRECT | True for fused pointwise and reduction kernels. GEMMs are the exception, see C3. | Add "(GEMMs go to cuBLAS by default)". |
| C3 | "Heavy matmul paths reach it through Inductor -> CUTLASS / CuTe"; Inductor "falls back to CUTLASS / cuBLAS for matmul where the size is large enough to be peak-bound" | :79-80, :183-185 | WRONG | **Code is the authority** [T1-24], PyTorch v2.14.1: `max_autotune_gemm_backends` default `"ATEN,TRITON,CPP"` (config.py:647-649); `use_aten_gemm_kernels()` returns true whenever max-autotune is off (utils.py:2706-2709); `use_cutlass_template()` requires `config.max_autotune or config.max_autotune_gemm` **and** `"CUTLASS"` in the backend list (utils.py:2288-2305). So by default every matmul goes to ATen (cuBLAS/cuBLASLt) regardless of size; Triton GEMM templates only compete under max-autotune; CUTLASS, CuTe DSL (`CUTEDSL`, SM100-SM109 only) and `NVGEMM` are opt-in. | "By default Inductor sends matmuls to cuBLAS through ATen and generates Triton for everything it fuses around them. With `mode="max-autotune"` it also benchmarks Triton GEMM templates; CUTLASS, CuTe DSL and NVGEMM join only if you add them to `max_autotune_gemm_backends`." |
| C4 | Triton: "the compiler chooses tile sizes and SMEM staging" | :22, :153-157 | WRONG | [T1-14] Triton matmul tutorial: block sizes are "meta-parameters (e.g., `BLOCK_SIZE_M`)" supplied in `triton.Config` lists that `@triton.autotune` tries, with "compilation options (e.g., `num_warps`)". The author or autotuner picks tile sizes; the compiler handles layouts, SMEM allocation and software pipelining. | "The author picks block sizes (usually a small autotuned list); the compiler handles layouts, shared-memory staging and pipelining." |
| C5 | CUTLASS / CuTe: "C++ template library ... CuTe is the layout algebra" | :23, :168-172 | CORRECT | [T1-16] README v4.8.0 | Add NEW C20 (CuTe DSL). |
| C6 | CuTe "exposes TMEM as a first-class data locale for Blackwell" | :169-171 | CORRECT | [T1-16] CHANGELOG 4.5.0: "Add static load to tensor memory support, included in example 77" (TMEM handled in CUTLASS kernels) | - |
| C7 | TensorRT / TensorRT-LLM: "Inference compiler ... Consumes ONNX / HuggingFace / custom IR"; "NVIDIA's inference-specialized compiler" | :25, :204 | STALE | TRT-LLM v1.0.0 (2025-09-24): "BREAKING CHANGE Promote PyTorch to be the default LLM backend" [T1-18]; README at v1.2.1: "Architected on PyTorch, TensorRT LLM provides a high-level Python LLM API" [T1-20]. ONNX input is TensorRT's path, not TRT-LLM's. | Split the row: "TensorRT: ONNX -> engine compiler" and "TensorRT-LLM: PyTorch-native LLM runtime (HF checkpoints via the LLM API) with fused MoE, FP8/NVFP4 kernels and Wide-EP". |
| C8 | Nsight Compute / Systems roles | :26, :237-250 | CORRECT | See C26, C27 | - |
| C9 | "PTX is the virtual ISA; ptxas lowers to SASS / cubin per architecture (sm_90a, sm_100)" | :27 | CORRECT | [T1-5]. NEW detail: family targets (`sm_100f`), `sm_103` (B300), `sm_107` (Rubin, PTX ISA 9.4) | Add "`sm_100f` for one binary across B200, B300 and Rubin" (see B37). |
| C10 | "a stack of seven cooperating layers"; h2 "The seven layers" | :56, :94 | WRONG | The table directly below has eight rows (:19-28). | "eight layers", or merge cuBLAS into the CUTLASS row and keep seven. |
| C11 | "Most production code paths reach the GPU through Inductor -> Triton -> PTX -> SASS" | :78-79 | UNKNOWN | No usage data located. | "Generated code from torch.compile reaches the GPU through Triton." |
| C12 | cuBLAS / cuDNN "themselves are compiled with CUTLASS internally"; "cuBLAS, cuDNN, cuTENSOR ... internally use CUTLASS for the hottest paths" | :80-81, :182-183 | UNKNOWN | Closed-source libraries; no NVIDIA statement located (CUTLASS v4.8.0 README has none). Partial evidence: CUTLASS CHANGELOG mentions a "cuDNN Frontend SM100 ragged SDPA kernel" built on CuTe DSL [T1-16]. TensorRT-LLM's use of CUTLASS is CORRECT (e.g. v0.20.0 notes "cutlass MoE GEMM fallback") [T1-18]. | "TensorRT-LLM and the cuDNN frontend ship CUTLASS/CuTe kernels; NVIDIA does not document what cuBLAS uses internally." |
| C13 | Link to CUDA C++ Programming Guide | :111 | STALE | Redirects to the restructured "CUDA Programming Guide" v13.4.2 [T1-31] | `https://docs.nvidia.com/cuda/cuda-programming-guide/index.html` |
| C14 | "Production code rarely picks one or the other; most inference servers compose both" | :185-187 | UNKNOWN | No source; opinion. | Keep as framing or cut. |
| C15 | TRT-LLM ships "fused MoE kernels, NVFP4 cubins, FP8 OOTB MoE (since v0.12.0)" | :204-206 | CORRECT | v0.12.0 notes: "Supported FP8 OOTB MoE" [T1-18] | Verification 2026-10-23: FP8 MoE dates from v0.10.0 ("Added FP8 quantization support for Mixtral"; FP8 path in mixtureOfExpertsPlugin.cpp at v0.10.0); v0.12.0 adds the out-of-the-box path only |
| C16 | Wide-EP "targeting GB200 NVL72 specifically" | :206-207 | STALE | wide_ep README at v1.2.1: "GPU: GB200 NVL72, GB300 NVL72, H20, or RTX 6000D" [T1-19] | "targeting NVL72 racks (GB200 and GB300)" |
| C17 | "Wide-EP uses MNNVL all-to-all over NVLink rather than falling back to NCCL all-gather over InfiniBand" | :207-208 | CORRECT | MNNVL part: [T1-19] "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)". The NCCL/InfiniBand contrast is not in the README. | Drop the contrast clause or source it. |
| C18 | Link to TRT-LLM `examples/wide_ep` on the `main` branch | :210 | STALE | Unpinned (CI gate). Verified via GitHub API: path exists at tag v1.2.1 (commit `376f7e1bd8ed543f75014309e3fd4b237e9b0e73`) with `README.md`, `ep_load_balancer`, `slurm_scripts`; also at v1.0.0; **absent at v0.21.0** [T1-19]. | `https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep` |
| C19 | "Mixtral 8x7B in v0.9.0" | :216 | WRONG | v0.7.1 (2023-12-27) notes: "Mixtral-8x7B model", "Mixture of Experts support"; v0.9.0 adds "OOTB functionality support ... Mixtral 8x7B" [T1-18] | "MoE and Mixtral 8x7B in v0.7.1" |
| C20 | "FP8 MoE in v0.12.0" | :217 | CORRECT | v0.12.0: "Supported FP8 OOTB MoE" [T1-18] (FP8 quantization for Mixtral was v0.10.0) | Verification 2026-10-23: FP8 MoE dates from v0.10.0 ("Added FP8 quantization support for Mixtral"; FP8 path in mixtureOfExpertsPlugin.cpp at v0.10.0); v0.12.0 adds the out-of-the-box path only |
| C21 | "Wide-EP and MNNVL all-to-all in v0.21.0" | :217 | WRONG | v0.20.0 (2025-06-19): "Added MNNVL MoE A2A support"; v0.21.0 (2025-08-04): "Added large-scale EP support" [T1-18] | "MNNVL all-to-all in v0.20.0, large-scale EP in v0.21.0" |
| C22 | "NVFP4 MoE cubins in v1.0" | :217-218 | UNKNOWN | Not in v1.0.0 notes [T1-18]; see B33. | Cut. |
| C23 | "CUTLASS example 92 (Blackwell SM100 MoE GEMM) shipped in v4.0.0 (June 2025)" | :218-219 | WRONG | First in v4.2.0 (September 2025) [T1-15][T1-16] (the 2026-08-01 audit flagged the same error in NvidiaBlackwell.tsx but missed this occurrence) | "shipped in v4.2.0 (September 2025)" |
| C24 | "with simplified API in v4.3.0 (November 2025)" | :219 | CORRECT | [T1-16] | - |
| C25 | TRT-LLM current version | (absent) | NEW | Latest stable v1.2.1 (2026-04-20); RC line v1.4.0rc0 (2026-10-14) [T1-18] | If the section names versions at all, state "as of v1.2". |
| C26 | Nsight Compute reports "warp stall reasons (long scoreboard, short scoreboard, no instructions)" | :237-240 | CORRECT | [T1-11]: `smsp__pcsamp_warps_issue_stalled_long_scoreboard` "Warp was stalled waiting for a scoreboard dependency on a L1TEX (local, global, surface, texture) operation"; short scoreboard and no-instruction stall reasons also documented | - |
| C27 | Nsight Systems covers "kernel launches, NVLink and PCIe traffic, CUDA streams, NCCL collectives, host CPU activity" | :246-248 | CORRECT | [T1-12]: GPU metrics "IO throughputs: PCIe, NVLink, and GPU memory bandwidth"; NCCL trace options | - |
| C28 | CuTe DSL (Python) | (absent) | NEW | [T1-16] README v4.8.0: "With the release of 4.0, we released the first of these in CuTe DSL"; "CuTe DSL is currently in public beta". Inductor can use it as a GEMM backend (`CUTEDSL`) [T1-24]. | Add to the CUTLASS row: "CuTe DSL: the same abstractions from Python (beta)". |
| C29 | Triton Gluon | (absent) | NEW | [T1-21] Triton v3.8.0 (2026-08-28): "Gluon & Layout Improvements"; "Blackwell Gluon kernels can use Cluster Launch Control (CLC)"; "Rubin-specific Gluon module" | One line under Triton: "Gluon is Triton's lower-level dialect for when you need to control layouts, TMEM and warp specialization yourself." |
| C30 | CUDA Tile / cuTile | (absent) | NEW | [T1-8]: "CUDA Tile programming is available in Python through the cuTile Python package cuda.tile. CUDA Tile C++ is available in the CUDA Toolkit from version 13.3 onward." [T1-13]: cuTile Python requires CC 8.x-12.x, driver r580+, and compiles through `tileiras` ("depends on ptxas and libnvvm"). Version 1.6.0, 2026-09-09. | A fourth authoring path next to Triton and CUTLASS: tile-level kernels, NVIDIA-supported, in Python or C++. |
| C31 | Toolchain versions as of 2026-10-16 | (absent) | NEW | CUDA 13.4 Update 2 [T1-6]; PTX ISA 9.4 [T1-5]; CUTLASS v4.8.0 [T1-15]; Triton v3.8.0 [T1-21]; TRT-LLM v1.2.1 stable [T1-18]; Dynamo v1.5.1 [T1-22]; PyTorch v2.14.1 [T1-24]; cuTile Python 1.6.0 [T1-13] | Only if the section keeps a versions block; otherwise skip (version lists age fastest). |
| C32 | Diagram edges: Inductor -> CUTLASS labelled "matmul"; Inductor -> cuBLAS labelled "opt-in" | NvidiaCompilerStack.tsx:99-100 | WRONG | Inverted (see C3, code [T1-24]). | Inductor -> cuBLAS "matmul (default)"; Inductor -> CUTLASS / CuTe DSL "opt-in (max-autotune)". |
| C33 | Diagram edge: cuBLAS / cuDNN / cuTENSOR -> PTX -> ptxas | NvidiaCompilerStack.tsx:103 | UNKNOWN | NVIDIA does not document how these closed libraries are packaged; no Tier 1 source located. They are not lowered by the user's ptxas at build time. | Draw libraries as a prebuilt branch straight to "SASS / cubin (shipped prebuilt)". |
| C34 | Diagram has no Tile path | NvidiaCompilerStack.tsx:26-89 | NEW | [T1-8], [T1-13] | Optional node: "cuTile / CUDA Tile C++ -> Tile IR -> tileiras -> SASS". |

### Recommended edits

1. Fix the Inductor story everywhere it appears (C3 at `:79-80` and `:183-185`, C32 in the diagram). This is the section's most important correction, it is code-confirmed, and it changes what a reader types: `mode="max-autotune"` plus `max_autotune_gemm_backends` is how you get CUTLASS or CuTe DSL GEMMs.
2. Fix Triton's division of labour (C4) at `:22` and `:153-157`.
3. Fix the layer count (C10) and split TensorRT from TensorRT-LLM (C7).
4. Wide-EP block: pin the link (C18); "NVL72 (GB200 and GB300)" (C16).
5. Version Alert (`:215-221`): Mixtral v0.7.1 (C19), MNNVL v0.20.0 / large-scale EP v0.21.0 (C21), example 92 v4.2.0 (C23), drop NVFP4 v1.0 (C22). Or cut it (see CUT list).
6. Update the CUDA guide link (C13); make the cuBLAS/CUTLASS claim match what is documented (C12).
7. Add the three NEW authoring paths in one short block: CuTe DSL (C28), Gluon (C29), CUDA Tile / cuTile (C30). They pass the practical test: they are what a reader picks between in 2026.
8. **CUT candidates:** the TRT-LLM version-history Alert (`:215-221`; version trivia, and every number in it except two was wrong; keep a single "check the release your kernel path landed in" sentence); the "most inference servers compose both" claim (C14, opinion without a source).

---

## 5. `sections/KernelExecutionLifecycle.tsx` (+ `components/KernelLifecycleDiagram.tsx`)

**What the section covers.** A seven-stage model of one kernel invocation (host issue, driver submit, device dispatch, SM scheduling, operand staging, functional unit, retire), a latency table per memory tier, three silicon lanes (NVIDIA SIMT, Trainium, Xeon AMX), and why fusion (FlashAttention) collapses stages. Only the NVIDIA-relevant claims were verified in depth; the Trainium and AMX claims got a light Tier 1 check.

### Claim register

| # | Claim (short quote) | Location | Verdict | Evidence | Replacement text or fact |
| --- | --- | --- | --- | --- | --- |
| K1 | Register file "1 cycle", "~0.5 ns at 2 GHz" | KernelExecutionLifecycle.tsx:24-27 | UNKNOWN | NVIDIA publishes no register access latency (not in [T1-3], [T1-4]). | Mark [SPECULATIVE] or drop the cycle figure. |
| K2 | L1 / SMEM "~20-30 cycles", "~10-15 ns" | :31-33 | UNKNOWN | No vendor figure. Tier 3 [T3-1] Table IV (H800 PCIe): shared 29.0 cycles, L1 40.7 cycles; about 17 ns and 23 ns at 1,755 MHz [SPECULATIVE: conversion]. Cycles match for SMEM; the ns range is low. | "about 30 cycles SMEM, about 40 cycles L1 (Tier 3, H800)"; "about 15-25 ns". |
| K3 | "On Hopper SMEM is up to 228 KB per SM, sharing 256 KB with L1" | :34 | CORRECT | [T1-3]. Same on B200 (CC 10.0) [T1-4]. | "On Hopper and Blackwell..." |
| K4 | TMEM "few cycles to tensor core", "~ns class" | :38-39 | UNKNOWN | No latency published for TMEM in [T1-4], [T1-5], [T2-12]. | Drop the latency cells; keep "256 KB per SM; holds tcgen05 accumulators". |
| K5 | TMEM "256 KB per SM; dedicated tensor-core operand storage" | :41 | CORRECT | [T2-12]; [T1-5]. Refine "operand" to "accumulator (and optionally the A operand)". | - |
| K6 | L2 "~150-300 cycles", "~75-150 ns", "H100 L2 is 50 MB" | :45-48 | UNKNOWN | 50 MB CORRECT [T1-3]. Latency: no vendor figure; Tier 3 [T3-1]: 263.0 cycles on H800, about 150 ns [SPECULATIVE: conversion], top of the stated ns range. Note B200 (GB200 GPU) L2 is 126 MB [T1-4]. | "about 260 cycles, about 150 ns (Tier 3, H800)" |
| K7 | HBM "~300-600 cycles", "~150-300 ns"; "H200 reads at 4.8 TB/s aggregate" | :52-55 | UNKNOWN | 4.8 TB/s CORRECT [T2-7]. Latency: no vendor figure; Tier 3 [T3-1]: global memory 478.8 cycles on H800 PCIe (HBM2e), about 273 ns [SPECULATIVE: conversion], inside the stated range. | Label the row Tier 3. |
| K8 | Host DRAM via PCIe "~1-3 us", "PCIe Gen5 / NVLink-C2C" | :59-61 | UNKNOWN | No vendor latency. Link generation: Blackwell GPUs expose "x16 PCI-Express Gen 6" (256 GB/s bidirectional) [T2-12]; AWS attributes P6-B300's 2x EFA bandwidth to "PCIe Gen6" [T2-1]. | "PCIe Gen5 (Hopper) / Gen6 (Blackwell) / NVLink-C2C (Grace)"; mark the latency [SPECULATIVE]. |
| K9 | Cross-host "~10-50 us", "SRD spraying" | :66-69 | UNKNOWN | No AWS latency figure located in this pass. SRD multipath spraying belongs to the EFA research file. | Mark [SPECULATIVE]. |
| K10 | "warp scheduler allocates blocks to SMs (max 32 blocks / SM, 64 concurrent warps / SM on Hopper)" | :86 | WRONG | Numbers CORRECT [T1-3], and identical on B200 [T1-4]. Mechanism wrong: thread blocks are distributed to SMs by the GPU-level work distributor, which NVIDIA calls the GigaThread Engine ("work scheduler providing ... optimized workload distribution across all 160 SMs" [T2-12]); warp schedulers inside each SM then pick ready warps. | "The GigaThread engine assigns blocks to SMs (up to 32 blocks and 64 warps per SM on Hopper and Blackwell); each SM's warp schedulers pick ready warps." Same fix at `:177-179` ("grid scheduler") is fine as is. |
| K11 | NVIDIA lane: "Async copy -> SMEM -> tensor core via wgmma (Hopper) or tcgen05.mma over TMEM (Blackwell)" | :87 | CORRECT | [T1-5] | Optional precision per B14. |
| K12 | Trainium: "CC-Cores carry collectives" | :95 | CORRECT | [T1-26]: "16 CC-Cores orchestrate collective communication among Trainium2 chips" | - |
| K13 | Trainium: "No runtime scheduling ... the runtime walks it deterministically"; "makes Trainium deterministic at runtime" | :192-194, :309-313 | UNKNOWN | Overstated against [T1-26]: "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions". Defer the full check to the AWS-silicon research file. | Soften: "the schedule is mostly fixed at compile time". |
| K14 | Xeon AMX: "TDPBF16PS / TDPFP16PS executes 16x16 tile matmul"; tile registers "16x64 bytes" | :103, :213-214, :255-256 | CORRECT | [T1-27] clang `amxfp16intrin.h` at llvmorg-21.1.0: `TDPFP16PS`, tiles "Max size is 1024 Bytes" (16 rows x 64 bytes) | - |
| K15 | AMX "state managed by XSAVE/XRSTOR" | :102 | CORRECT | [T1-28] Linux v6.12 `xstate.rst`: "AMX TILE_DATA (XSTATE component 18)" is dynamically enabled; applications must call `arch_prctl(ARCH_REQ_XCOMP_PERM, ...)` first | Practical add: "On Linux a process must request AMX permission with `arch_prctl` before its first tile instruction." |
| K16 | Stage 2: driver writes "a host-pinned command buffer and ringing a doorbell across PCIe (or NVLink-C2C on Grace-Blackwell)" | :167-170 | UNKNOWN | The user-mode CUDA driver is closed; no NVIDIA document fetched describes the pushbuffer/doorbell path. The NVLink-C2C host link on Grace is CORRECT [T2-12]. | Keep as a model, label [SPECULATIVE], or cite open-gpu-kernel-modules if a later pass pins it. |
| K17 | Stage 3 latency "tens of nanoseconds" | :180-181; diagram :40 | UNKNOWN | No vendor figure. | Mark [SPECULATIVE]. |
| K18 | Stage 4: "On Hopper an SM holds up to 64 concurrent warps with 32 threads each (Hopper Tuning Guide)" | :184-190 | CORRECT | [T1-3] | Add "and on Blackwell" [T1-4]. |
| K19 | Stage 5: "Async copy (Hopper), TMA (Hopper), tcgen05 (Blackwell)" | :201-203 | WRONG | Async copy arrived with Ampere [T1-3]. | "Async copy (Ampere and later), TMA (Hopper and later), tcgen05 (Blackwell and later)" |
| K20 | Stage 6: "On Blackwell it is tcgen05.mma operating on a tile resident in TMEM" | :210-211 | WRONG | [T1-5]: D (accumulator) in TMEM; A from SMEM or TMEM; B from SMEM. | "...tcgen05.mma reading B from SMEM and accumulating into TMEM" |
| K21 | Alert: figures are "typical industry ranges"; "Specific cycle counts per architecture remain UNKNOWN here pending the per-vendor sections" | :251-259 | STALE | Process meta-text; a Tier 3 measured anchor now exists [T3-1]. | Replace with: "Latency figures are microbenchmark measurements (Luo et al., H800 PCIe), not vendor specs. NVIDIA publishes no per-tier latency." |
| K22 | Diagram stage scales ("~us", "~10s of ns", "~ns per op", "~10s of ns to us") | KernelLifecycleDiagram.tsx:22, :31, :40, :49, :58, :67, :76 | UNKNOWN | No vendor figures. | Label the scale row [SPECULATIVE] in the caption. |
| K23 | Per-SM limits carry from Hopper to Blackwell; Rubin raises SMEM | (absent) | NEW | [T1-4]: CC 10.0 64 warps, 32 blocks, 64K registers, 228 KB SMEM; [T1-7]: CC 10.7 (Rubin) 328 KB SMEM per SM | Practical for occupancy tuning across generations. |
| K24 | CUDA Graphs and Programmatic Dependent Launch shorten stages 1-3 across back-to-back kernels | (absent) | NEW | The CUDA Programming Guide v13.4.2 has dedicated chapters "CUDA Graphs" and "Programmatic Dependent Launch" [T1-31]; cuBLAS 13.x notes reference PDL ordering [T1-6]. Mechanism detail not verified in this pass. | One sentence in "Fused kernels collapse stages": fusion removes HBM round trips; graphs and PDL remove launch overhead between kernels that cannot be fused. |

### Recommended edits

1. Latency table (`:21-71`): replace the unsourced ns/cycle ranges with the Tier 3 measured values and label them (K2, K6, K7); drop TMEM latency (K4); fix the host link generations (K8); mark host and cross-host latencies [SPECULATIVE] (K8, K9).
2. Replace the Alert at `:251-259` with the one-line provenance note in K21.
3. NVIDIA lane (`:86`): GigaThread engine assigns blocks, warp schedulers pick warps (K10). This is a mental-model fix: two schedulers at two levels.
4. Stage 5 and 6 prose: async copy is Ampere (K19); TMEM holds the accumulator (K20).
5. Trainium lane: soften "deterministic" (K13); leave the full check to the AWS-silicon file.
6. Add K15's `arch_prctl` note to the AMX lane (practical) and K24's one sentence to the fusion block.
7. **CUT candidates:** the "Connecting threads" container (`:378-401`) is a list of forward references with section numbers; it fails both tests and the section numbers will drift. The Alert at `:251-259` in its current form (process meta).

---

## 6. Pinned replacement URLs (verified)

| Current link (unpinned) | File:line | Pinned replacement | Verification |
| --- | --- | --- | --- |
| CUTLASS `examples/92_blackwell_moe_gemm` on the `main` branch | NvidiaBlackwell.tsx:122 | `https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm` | GitHub API `contents/examples/92_blackwell_moe_gemm?ref=v4.8.0` lists 6 `.cu` files + `CMakeLists.txt`; tag v4.8.0 -> commit `098de2a652cf8f00fd70b2df54051c7eccbb855a`. Path first appears at v4.2.0 (absent at v4.1.0). |
| TensorRT-LLM `examples/wide_ep` on the `main` branch | NvidiaCompilersAndTooling.tsx:210 | `https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep` | GitHub API `contents/examples/wide_ep?ref=v1.2.1` lists `README.md`, `ep_load_balancer`, `slurm_scripts`; tag v1.2.1 (latest stable) -> commit `376f7e1bd8ed543f75014309e3fd4b237e9b0e73`. Present at v1.0.0; absent at v0.21.0. |
| CUDA C++ Programming Guide | NvidiaCompilersAndTooling.tsx:111 | `https://docs.nvidia.com/cuda/cuda-programming-guide/index.html` | Old URL redirects here (v13.4.2). |

---

## Sources

All accessed 2026-10-16.

### Tier 1 (official docs, API reference, source code at a tag or SHA, regulatory filing)

- [T1-1] AWS, Amazon EC2 accelerated computing instance specifications (Last-Modified 2026-10-17 01:17 GMT): https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html
- [T1-2] AWS, Capacity Blocks for ML (supported instance types, UltraServer table): https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
- [T1-3] NVIDIA, Hopper Tuning Guide v13.4 (updated 2026-10-12): https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html
- [T1-4] NVIDIA, Blackwell Tuning Guide v13.4 (updated 2026-10-12): https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html
- [T1-5] NVIDIA, PTX ISA 9.4 (updated 2026-10-12), sections 9.7.17 (wgmma) and 9.7.18 (tcgen05, Tensor Memory): https://docs.nvidia.com/cuda/parallel-thread-execution/index.html
- [T1-6] NVIDIA, CUDA Toolkit 13.4 Update 2 release notes (updated 2026-10-12): https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html
- [T1-7] NVIDIA, CUDA Programming Guide v13.4.2, Compute Capabilities appendix: https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html
- [T1-8] NVIDIA, CUDA Programming Guide v13.4.2, Writing Tile Kernels: https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-tile-kernels.html
- [T1-9] NVIDIA, CUDA GPU compute capability list: https://developer.nvidia.com/cuda-gpus
- [T1-10] NVIDIA, MIG User Guide, supported profiles (updated 2026-10-13): https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-mig-profiles.html
- [T1-11] NVIDIA, Nsight Compute Profiling Guide: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html
- [T1-12] NVIDIA, Nsight Systems User Guide: https://docs.nvidia.com/nsight-systems/UserGuide/index.html
- [T1-13] NVIDIA, cuTile Python quickstart and release notes (1.6.0, 2026-09-09): https://docs.nvidia.com/cuda/cutile-python/quickstart.html
- [T1-14] Triton, matrix multiplication tutorial: https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html
- [T1-15] GitHub API, NVIDIA/cutlass releases and `contents/examples` at v4.1.0, v4.2.0, v4.8.0: https://api.github.com/repos/NVIDIA/cutlass/releases ; https://api.github.com/repos/NVIDIA/cutlass/contents/examples?ref=v4.8.0
- [T1-16] CUTLASS CHANGELOG and README at tag v4.8.0: https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md ; https://github.com/NVIDIA/cutlass/blob/v4.8.0/README.md
- [T1-17] CUTLASS example 92 at tag v4.8.0 (commit 098de2a652cf8f00fd70b2df54051c7eccbb855a): https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm
- [T1-18] GitHub API, NVIDIA/TensorRT-LLM releases (release notes v0.7.1 through v1.2.1, RCs to v1.4.0rc0): https://api.github.com/repos/NVIDIA/TensorRT-LLM/releases
- [T1-19] TensorRT-LLM `examples/wide_ep` and its README at tag v1.2.1 (commit 376f7e1bd8ed543f75014309e3fd4b237e9b0e73); absence checked at v0.21.0: https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep ; https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/examples/wide_ep/README.md
- [T1-20] TensorRT-LLM README at tag v1.2.1: https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/README.md
- [T1-21] Triton v3.8.0 release notes (tag commit c01b6774b1865984607d89d89d3a10833de92037): https://github.com/triton-lang/triton/releases/tag/v3.8.0
- [T1-22] GitHub API, ai-dynamo/dynamo releases (v1.5.1, 2026-10-07): https://api.github.com/repos/ai-dynamo/dynamo/releases
- [T1-23] cuTile Python tag v1.6.0 (commit 068039e3a66c4523b111203b19fc744e8be01c77): https://github.com/NVIDIA/cutile-python/releases/tag/v1.6.0
- [T1-24] PyTorch v2.14.1 (tag commit 5c4886908584029761b579af026dcfb627c84070): `torch/_inductor/config.py` L637-649 https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/config.py#L637-L649 ; `torch/_inductor/utils.py` L1919-1945, L2288-2305, L2706-2709 https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/utils.py ; `torch/__init__.py` L3019 https://github.com/pytorch/pytorch/blob/v2.14.1/torch/__init__.py#L3019
- [T1-25] NVIDIA, Form 8-K exhibit 99.1, Q2 FY2027 results (2026-08-26): https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27pr.htm
- [T1-26] AWS Neuron documentation, Trainium2 architecture: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html
- [T1-27] LLVM clang `amxfp16intrin.h` at tag llvmorg-21.1.0: https://github.com/llvm/llvm-project/blob/llvmorg-21.1.0/clang/lib/Headers/amxfp16intrin.h
- [T1-28] Linux kernel `Documentation/arch/x86/xstate.rst` at tag v6.12: https://github.com/torvalds/linux/blob/v6.12/Documentation/arch/x86/xstate.rst
- [T1-29] aws-graviton-getting-started README at commit 8b322a4160b827be202beedaf35ce21b4c635603: https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md
- [T1-30] GitHub API, Dao-AILab/flash-attention releases (v2.8.3.post2; fa4-v4.0.0.beta35) and README at v2.8.3.post2: https://api.github.com/repos/Dao-AILab/flash-attention/releases ; https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md
- [T1-31] NVIDIA, CUDA Programming Guide v13.4.2 landing page (redirect target of the old CUDA C++ guide URL): https://docs.nvidia.com/cuda/cuda-programming-guide/index.html
- [T1-32] GitHub API, NVIDIA/cuda-python releases (v13.4.4, 2026-10-15; corroborates the 13.4 line): https://api.github.com/repos/NVIDIA/cuda-python/releases
- [T1-33] GitHub API, PyTorch releases (v2.14.1, 2026-09-30): https://api.github.com/repos/pytorch/pytorch/releases

### Tier 2 (vendor product pages, press releases, vendor blogs; performance multipliers are VENDOR CLAIMs)

- [T2-1] AWS, Amazon EC2 P6 instances product page: https://aws.amazon.com/ec2/instance-types/p6/
- [T2-2] AWS, Amazon EC2 P5 instances product page: https://aws.amazon.com/ec2/instance-types/p5/
- [T2-3] AWS What's New, P6e-GB300 UltraServers generally available (2025-12-02): https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available
- [T2-4] AWS What's New, P6-B300 instances available (November 2025): https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-ec2-p6-b300-instances-nvidia-blackwell-ultra-gpus-available/
- [T2-5] AWS News Blog, up to 45% price reduction for NVIDIA GPU instances (June 2025): https://aws.amazon.com/blogs/aws/announcing-up-to-45-price-reduction-for-amazon-ec2-nvidia-gpu-accelerated-instances/
- [T2-6] NVIDIA, H100 product page: https://www.nvidia.com/en-us/data-center/h100/
- [T2-7] NVIDIA, H200 product page (spec table and benchmark footnotes): https://www.nvidia.com/en-us/data-center/h200/
- [T2-8] NVIDIA Technical Blog, NVIDIA Hopper Architecture In-Depth: https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/
- [T2-9] NVIDIA Newsroom, NVIDIA Supercharges Hopper (H200 announcement, 2023-11-13): https://nvidianews.nvidia.com/news/nvidia-supercharges-hopper-the-worlds-leading-ai-computing-platform
- [T2-10] NVIDIA Newsroom, NVIDIA Hopper in Full Production (2022-09-20): https://nvidianews.nvidia.com/news/nvidia-hopper-in-full-production
- [T2-11] NVIDIA, Blackwell architecture page: https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
- [T2-12] NVIDIA Technical Blog, Inside NVIDIA Blackwell Ultra (2025-08-22): https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/
- [T2-13] NVIDIA, DGX B200 page: https://www.nvidia.com/en-us/data-center/dgx-b200/
- [T2-14] NVIDIA, DGX B300 page: https://www.nvidia.com/en-us/data-center/dgx-b300/
- [T2-15] NVIDIA, HGX page (HGX Rubin NVL8, HGX B300, HGX B200 spec tables): https://www.nvidia.com/en-us/data-center/hgx/
- [T2-16] NVIDIA, GB200 NVL72 page: https://www.nvidia.com/en-us/data-center/gb200-nvl72/
- [T2-17] NVIDIA, GB300 NVL72 page: https://www.nvidia.com/en-us/data-center/gb300-nvl72/
- [T2-18] NVIDIA, NVLink and NVLink Switch page (gen 4/5/6 table, "Preliminary specifications"): https://www.nvidia.com/en-us/data-center/nvlink/
- [T2-19] NVIDIA, NVLink-C2C page: https://www.nvidia.com/en-us/data-center/nvlink-c2c/
- [T2-20] NVIDIA, Grace CPU Superchip page and Grace CPU page: https://www.nvidia.com/en-us/data-center/grace-cpu-superchip/ ; https://www.nvidia.com/en-us/data-center/grace-cpu/
- [T2-21] NVIDIA, Vera Rubin NVL72 page (spec table): https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/
- [T2-22] NVIDIA Newsroom, Vera Rubin Opens Agentic AI Frontier (2026-03-16): https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform
- [T2-23] NVIDIA Newsroom, Vera Rubin Ramps Into Full Production (2026-05-31): https://nvidianews.nvidia.com/news/vera-rubin-full-production-agentic-ai-factory
- [T2-24] NVIDIA Newsroom, AWS and NVIDIA to Deliver 2 Million Additional GPUs (2026-08-26): https://nvidianews.nvidia.com/news/aws-and-nvidia-to-deliver-2-million-additional-gpus-and-next-generation-infrastructure-for-agentic-and-physical-ai
- [T2-25] NVIDIA Blog, GTC 2026 live updates (Feynman, Rosa, Kyber; AWS partnership): https://blogs.nvidia.com/blog/gtc-2026-news/
- [T2-26] NVIDIA Newsroom, NVIDIA Unveils Rubin CPX (2025-09-09): https://nvidianews.nvidia.com/news/nvidia-unveils-rubin-cpx-a-new-class-of-gpu-designed-for-massive-context-inference
- [T2-27] NVIDIA Technical Blog, How GB200 NVL72 and NVIDIA Dynamo Boost Inference Performance for MoE Models (2025-06-06): https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/
- [T2-28] NVIDIA Technical Blog, Introducing NVFP4 (2025-06-24): https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/

### Tier 3 (third-party; never used as a vendor spec)

- [T3-1] Luo et al., "Benchmarking and Dissecting the Nvidia Hopper GPU Architecture", arXiv:2402.13499, Table IV (H800 PCIe latency in cycles), fetched: https://arxiv.org/pdf/2402.13499
- [T3-2] Rubin CPX status reports (search snippets only, not fetched): The Elec https://www.thelec.net/news/articleView.html?idxno=10763 ; Benzinga (Ming-Chi Kuo) https://www.benzinga.com/markets/tech/26/09/61539040/nvidia-rubin-cpx-revived-ming-chi-kuo-major-redesign
- [T3-3] Network World, AWS Capacity Block price increases (search snippet only, not fetched; not verified against AWS pricing): https://www.networkworld.com/article/4113150/aws-hikes-prices-for-ec2-capacity-blocks-amid-soaring-gpu-demand.html
