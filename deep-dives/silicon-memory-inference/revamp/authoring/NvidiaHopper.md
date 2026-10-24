# Change report: NvidiaHopper (nav id `hopper`)

Register: `research/2026-10-refresh/02-nvidia.md` section 1 (H1 to H48), plus
section 0 and the Sources list.

Files: `src/sections/NvidiaHopper.tsx`, `src/components/HopperSmDiagram.tsx`,
`src/sources/NvidiaHopper.ts` (new, 18 records; 8 shared with NvidiaBlackwell.ts
with identical URL, title, publisher and tier).

Re-fetched on 2026-10-17 to confirm load-bearing text (records carry that date):
H200 page (benchmark footnote verbatim: "Llama2 70B: ISL 2K, OSL 128 | Throughput |
H100 SXM 1x GPU BS 8 | H200 SXM 1x GPU BS 32"; "GPT-3 175B: ISL 80, OSL 200 | x8
H100 SXM GPUs BS 64 | x8 H200 SXM GPUs BS 128"; "Preliminary specifications. May be
subject to change."; FP8/BF16 rows carry the "With sparsity" footnote), AWS P5 page
(GPU per family, p5.4xlarge 100 Gbps EFA and "GPUDirect RDMA is not supported in
P5.4xlarge", EFAv3 "up to 35% improvement in latency compared to P5", "up to 4x the
bandwidth between CPU and GPU"), EC2 ac.html (P5/P5e AMD EPYC 7R13 Nitro v4, P5en
Intel Xeon Sapphire Rapids Nitro v5, per-GPU GiB), Capacity Blocks page (all four
P5-family sizes listed), AWS price-cut blog (P5 44%, P5en 25% On-Demand from the May
31, 2025 baseline), Hopper Tuning Guide (TMA "1D and up to 5D tensors", DSMEM, 64
warps, 32 blocks, 64K registers, 255 per thread, 228 KB SMEM, 256 KB combined, 50 MB
L2), Hopper architecture blog (GH100 144 SMs, H100 SXM5 132; dense/sparse pairs at
1:2), CUDA Best Practices Guide 13.4 (occupancy definition and latency-hiding
sentence), compute capabilities appendix (CC 9.0: 64K registers, 255 per thread,
228 KB SMEM, 256 KB unified), Luo et al. arXiv:2402.13499v1 Table IV (H800 PCIe,
HBM2e, 1,755 MHz: L1 40.7, shared 29.0, L2 263.0, global 478.8 cycles),
FlashAttention README at v2.8.3.post2 ("optimized for Hopper GPUs", "Requirements:
H100 / H800 GPU, CUDA >= 12.3", "beta release").

Conflict noticed, not used: the Hopper Tuning Guide gives H100 HBM3 "up to 3 TB/s";
the H100 product page gives 3.35 TB/s for H100 SXM. The page uses the product page
figure, labelled H100 SXM.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| H2 | H200 die "GH100 (same die)" | Die row dropped; "Compute capability 9.0 (sm_90)" row for both | cudaGpus (T1) |
| H4 | H200 "132 active (same)" SMs, "50 MB" L2 | H200 cells read "Not on NVIDIA's H200 page"; diagram "H200 size not on its product page" | h200Page (T2) |
| H12 | "NVLink Gen 4 BW per GPU 900 GB/s" | "900 GB/s bidirectional (450 GB/s each way)" | h100Page, h200Page, blackwellUltraBlog (T2) |
| H13, H14, H26 | FP8 "(sparse)" next to unlabelled BF16 1,979 | FP8 3,958 sparse, about 1,979 dense; BF16 1,979 sparse, about 990 dense | h100Page, h200Page (T2); hopperArchBlog (T2, derived: 1:2 dense/sparse pairs) |
| H15 | AWS row "H100: P5, P5e / H200: P5en" | "H100: P5 (p5.4xlarge, p5.48xlarge) / H200: P5e and P5en" | ec2AcceleratedSpecs (T1) |
| H18 | Hopper "introduced asynchronous data movement (TMA and async copy)" | Hopper adds the TMA, which bulk-copies tensors between global and shared memory (Ampere-copy history dropped) | hopperTuningGuide (T1) |
| H21 | H200 "launched November 2023" | announced November 2023, systems expected from Q2 2024 | h200Announcement (T2) |
| H20 | H100 "launched late 2022" | reached full production in September 2022 | hopperFullProduction (T2) |
| H24 | wgmma "operates on tiles staged through SMEM" cited to the Tuning Guide | B from SMEM, A from SMEM or registers, D in registers; cited to PTX ISA | ptxIsa (T1) |
| H25 | "no branch prediction, no speculation, no out-of-order issue" | "A thread's instructions run in sequence, so the SM hides a stalled warp's latency by running other warps. Occupancy is the ratio of active warps per SM to the maximum." | cudaBestPractices (T1) |
| H28 | "up to 1.9x ... 1.6x" | "NVIDIA rates H200 at 1.9x ... 1.6x" ("up to" dropped) | h200Page (T2, vendor-claim) |
| H29 | "decode throughput went up 1.6-1.9x ... roofline prediction delivered verbatim" | Footnote batch sizes stated (8 vs 32; 64 vs 128); bandwidth caps a fixed-batch step at 1.43x; "our reading": the extra 61 GB is free for KV cache so 4x the sequences share each weight read; "bandwidth sets the step time, capacity sets the batch" | h200Page (T2, vendor-claim / spec / derived) |
| H32 | P5e "8x H100 SXM ... increased GPU memory tier" | p5e.48xlarge: 8 x H200, 1,128 GiB, AMD EPYC 7R13, Nitro v4, 3,200 Gbps second-generation EFA | ec2AcceleratedSpecs (T1), p5Page (T2) |
| H33, H34 | P5en "the Hopper-class machine that ships H200" | P5e and P5en carry the same H200s; P5en: Sapphire Rapids, Nitro v5, PCIe Gen5 CPU-GPU, third-gen EFA; "AWS cites up to 4x the CPU-to-GPU bandwidth of P5e and P5, and up to 35% lower latency than P5" | ec2AcceleratedSpecs (T1), p5Page (T2, vendor-claim) |
| H35 | "Five years of FlashAttention generations ... production-hardened" | FlashAttention-3 "optimized for Hopper GPUs"; README lists H100 or H800 with CUDA 12.3+, beta release | flashAttentionReadme (T1) |
| H36 | "long-tail ... still ship on Hopper first" | "Move to Blackwell kernel by kernel ... Watch for wgmma: it requires sm_90a, so a Hopper kernel built on it has no Blackwell build and needs a tcgen05 rewrite" | ptxIsa (T1) |
| H37 | Capacity Blocks economics opinion | Replaced by the June 2025 price cut (H47); Capacity Blocks kept as a fact (all four sizes eligible) | gpuPriceCut (T2), capacityBlocks (T1) |
| H38 | NVFP4 / tcgen05.mma "Blackwell-only" | "Blackwell and later" | ptxIsa (T1) |
| H39 | ">141 GB ... B200 / B300" | kept, with 180 GB / 288 GB and AWS 179 / 268 GiB | blackwellTuningGuide (T1), blackwellUltraBlog (T2), ec2AcceleratedSpecs (T1) |
| H40 | Diagram register file "~1 cycle" | removed | - |
| H41 | Diagram SMEM "~10-15 ns" | "SMEM ~29, L1 ~41 cycles (Tier 3)" | luoHopperBench (T3, measured) |
| H42 | Diagram "3,958 TFLOPS FP8 (full chip)" | "H100 SXM: 3,958 TFLOPS FP8 sparse, about 1,979 dense (whole GPU)" | h100Page (T2), hopperArchBlog (T2, derived) |
| H43 | Diagram L2 "~150 ns class" | "~263 cycles (Tier 3)" | luoHopperBench (T3, measured) |
| H44 | Diagram HBM "~250 ns latency" | "~479 cycles (Tier 3)"; caption: H800 PCIe, HBM2e, global-memory latency | luoHopperBench (T3, measured) |
| H45 | Diagram "(1.4x)" | "1.43x bandwidth, 1.76x capacity" | h200Page (T2, derived) |

CORRECT claims kept and re-cited: H1 (GH100 as "the full GH100 die has 144" SMs), H3, H5, H6, H7, H8, H9, H10, H11, H17, H19, H22, H27 (folded into the derived 1.43x / 1.76x ratios), H30, H39, H45.

## Claims removed

- H16 "9th-generation" ordinal: UNKNOWN, CUT candidate.
- H31 "still ships heavily in 2026": UNKNOWN, CUT candidate.
- H23 "a 39% increase over A100's 164 KB": CORRECT, removed in the leverage pass (comparison to the previous generation gives no model or action for a Hopper/Blackwell decision). 228 KB per SM stays.
- H1 "TSMC 4N", 80B transistors, 814 mm2: CORRECT, dropped with the Die row (no reader action); the GH100 name survives in the SM-count cell.
- "Ampere introduced async copy": dropped with the H18 fix; the page no longer claims who introduced async copy.
- "Mature kernel ecosystem" block (vLLM/TensorRT-LLM tuning, CUTLASS example 92, NVFP4 "catching up"): STALE per H36; replaced by the kernel-by-kernel move check.
- "Same FLOPs ... SM count, register file, SMEM and L2 are identical" paragraph: SM/L2 for H200 is UNKNOWN (H4); the table carries the comparison.
- "the right pick when ... the 1.9x number above applies" (P5en): WRONG per H34.

## UNKNOWNs and how the page handles them

- H2 H200 die: not named; compute capability row instead.
- H4 H200 SM count and L2: "Not on NVIDIA's H200 page" (scoped to the page checked).
- H16, H31: cut.
- H25: replaced with the documented occupancy statement.
- H37: opinion replaced with sourced price-cut fact; T3-3 (Capacity Block price rises, snippet only) not used.
- H40: register latency dropped. H41, H43, H44: Tier 3 cycle counts, labelled "(Tier 3)" in the SVG and as an H800 PCIe measurement in the caption; no ns conversions shipped.

## NEW content and its sources

- H46: p5.4xlarge row (1 x H100, 80 GiB, AMD EPYC 7R13, Nitro v4, 100 Gbps EFA, no GPUDirect RDMA): ec2AcceleratedSpecs (T1), p5Page (T2). "The only single-GPU Hopper size": ec2AcceleratedSpecs family list.
- H47: P5 -44%, P5en -25% On-Demand from the May 31, 2025 baseline: gpuPriceCut (T2).
- H48: wgmma requires sm_90a, framed as the pitfall attached to "move kernel by kernel": ptxIsa (T1).
- Capacity Blocks for ML covers all four P5-family sizes: capacityBlocks (T1).
- Occupancy arithmetic: 64K / (64 x 32) = 32 registers per thread at full occupancy; 128 registers per thread fits at most 16 warps: hopperTuningGuide (T1, derived).
- Instance table with a "Pick it for" column (guidance from cited facts).
- "Sizing with both halves" (benchmark at the largest batch each GPU holds): guidance from H29; no new facts.

## Diagram

`HopperSmDiagram.tsx` rebuilt: `viewBox="0 0 880 412"`, `role="img"`,
`aria-labelledby="hopper-sm-title"` with an asserting `<title>`, no `aria-label`,
full-bleed white rect, Idiom A classes prefixed `hsm-`, fonts 11 to 13px
sans-serif, no fixed height, no em-dashes, no unicode arrows or "x" glyphs. Content:
SM box (CC 9.0, 64 warps, 32 blocks) with warp schedulers, register file (64K,
255 per thread, holds D), Tensor Cores (wgmma sm_90a only, operand placement, FP8
sparse/dense), SMEM + L1 (228 KB in 256 KB), TMA (1D to 5D, both directions);
device-wide column with HBM (H100/H200 capacity and bandwidth, 1.43x / 1.76x) and L2
(50 MB H100; H200 not on its page). Arrows: HBM to L2 to TMA to SMEM to Tensor Cores
(A, B), registers to Tensor Cores (A) and both ways (D). The old in-SVG async-copy and
warp-scheduler sentences overflowed their boxes; they are gone. Mobile: `minWidth:
640` inside an `overflowX: auto` wrapper (same as BlackwellDieDiagram).

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-hopper): probe
reported "1 diagram(s), ok" at 1440 and 390 (no overlaps, no viewBox clipping, no
page-level horizontal overflow). PNGs read: at 1440 every label sits inside its box,
arrow labels (A, D, A, B) sit beside their lines, the short TMA-to-SMEM arrow is
visible, nothing crosses text. At 390 the diagram scrolls in its wrapper and the
visible part is legible. Both tables got column `minWidth`s so at 390 they scroll
inside the Cloudscape table instead of squeezing cells to one word per line.

Length: rendered section text (all disclosures open, nav and badges excluded, approx.)
went from about 770 to about 1,215 words. The growth is the register-required
rewrites and NEW rows (H29 both-halves model, H32/H34 host split, H46 p5.4xlarge,
H47, H48, dense/sparse and direction labels) plus the occupancy paragraph; the pass
cut the CUT candidates, the ecosystem block, the duplicate same-FLOPs paragraph and a
compressed caption to hold it there.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:

1. H100 and H200 are both compute capability 9.0: cudaGpus.
2. GH100 full die has 144 SMs; H100 SXM has 132: hopperArchBlog.
3. TMA copies 1D to 5D tensors between global memory and SMEM, both directions: hopperTuningGuide.
4. Up to 255 registers per thread: hopperTuningGuide, computeCapabilities.
5. The block keeps working while TMA data is in flight, so a kernel can overlap the next tile's copy with the current multiply: hopperTuningGuide ("continue working on other instructions while the data is in flight"); the overlap sentence restates it.
6. Operand B from SMEM, A from SMEM or registers, D in registers; wgmma requires sm_90a: ptxIsa.
7. Thread instructions run in sequence; other warps hide a stalled warp's latency; occupancy definition: cudaBestPractices.
8. 32 registers per thread at full occupancy; 16 warps at 128 registers: derived from hopperTuningGuide.
9. Dense FP8 about 1,979 and BF16 about 990: derived, hopperArchBlog 1:2 dense/sparse pairs on h100Page/h200Page sparse figures.
10. NVLink 900 GB/s is bidirectional, 450 each way: blackwellUltraBlog Table 1.
11. Footnote batch sizes 8/32 and 64/128; token lengths; "Preliminary": h200Page.
12. 1.43x bandwidth cap at fixed batch; 1.76x capacity; extra 61 GB: derived from h100Page/h200Page. "Free for KV cache, so 4x the sequences share each weight read" is labelled "Our reading of the footnote" in the prose.
13. P5/P5e host AMD EPYC 7R13 Nitro v4; P5en Sapphire Rapids Nitro v5; GiB per GPU: ec2AcceleratedSpecs.
14. P5en PCIe Gen5, third-gen EFA, 4x CPU-GPU bandwidth, 35% lower latency (vendor-claim); p5.4xlarge 100 Gbps, no GPUDirect RDMA: p5Page.
15. All four sizes Capacity Block eligible: capacityBlocks.
16. Price cuts: gpuPriceCut.
17. FlashAttention-3 Hopper optimization, H100/H800 and CUDA 12.3 requirement, beta: flashAttentionReadme.
18. tcgen05.mma and NVFP4 are Blackwell and later: ptxIsa.
19. B200 180 GB, B300 288 GB, AWS 179 / 268 GiB: blackwellTuningGuide, blackwellUltraBlog, ec2AcceleratedSpecs.

Guidance sentences ("registers per thread is the first number to check", "compare
GPUs at the largest batch each one's memory holds", "price Hopper first when the
model fits", "move to Blackwell kernel by kernel") are actions drawn from items 7,
8, 12, 16 and 6; they add no facts.

## For the orchestrator

- `sources.md` needs regenerating (`vitest -u` on `src/__tests__/sources.test.ts`):
  only the snapshot test fails; record completeness and one-tier-per-URL pass.
- The H200 announcement's real title contains "Supercharges". It lives in
  `src/sources/NvidiaHopper.ts` (not scanned by no-ai-tells) and will appear in
  `sources.md`; if the glossary renderer's output is ever gated, retitle the record.
- New shared URLs other sections may cite, with tiers used here: T1 Hopper Tuning
  Guide, CUDA C++ Best Practices Guide, Capacity Blocks page, FlashAttention README
  at v2.8.3.post2; T2 H100 page, Hopper architecture blog, P5 page, Hopper full
  production and H200 newsroom posts; T3 arXiv:2402.13499 (publisher "arXiv").
- Glossary acronyms used here: SM, SMEM, TMA, HBM / HBM3 / HBM3e / HBM2e, FP8, BF16
  (bfloat16), TFLOPS, KV, EFA, GPUDirect RDMA, PCIe, MoE, NVFP4, NVLink, NVLink-C2C,
  wgmma, tcgen05, sm_90a.
- Nav title in `App.tsx` ("14. NVIDIA Hopper: H100 and H200") already matches the h1.
- Cross-links by name: NVIDIA Blackwell, Roofline and Arithmetic Intensity,
  Grace-Blackwell and UltraServer, KV Cache and FlashAttention, NVIDIA Compilers and
  Kernel Tooling.
