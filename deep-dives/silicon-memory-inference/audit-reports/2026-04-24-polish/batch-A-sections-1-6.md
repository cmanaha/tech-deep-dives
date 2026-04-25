# Batch A — Sections 1-6 Polish Audit
Date: 2026-04-24
Files audited:
- Section 1: `src/sections/ThesisAndFraming.tsx`
- Section 2: `src/sections/HeterogeneityFact.tsx`
- Section 3: `src/sections/RooflineAndArithmeticIntensity.tsx`
- Section 4: `src/sections/MemoryHierarchyPrimer.tsx`
- Section 5: `src/sections/KernelExecutionLifecycle.tsx`
- Section 6: `src/sections/HbmAndBandwidthWall.tsx`

---

## Section 1 — Thesis and Framing (Beyond peak FLOPs)
**Discipline:** all clear (no SectionShell, no TLDR Alert, no status badge, no Panelist map, no Evaluation lens).
**Acronyms missing expansion:**
- `SXM` (NVIDIA SXM form factor) — ThesisAndFraming.tsx:36
- `HBM3e` (High Bandwidth Memory gen-3e) — ThesisAndFraming.tsx:36-38 (`HBM` itself never expanded on first use here)
- `AMX` (Advanced Matrix Extensions) — ThesisAndFraming.tsx:53 ("x86 CPUs with AMX tile registers")
- `LPU` (Language Processing Unit) — ThesisAndFraming.tsx:54 ("Groq LPU")
- `RDU` (Reconfigurable Dataflow Unit) — ThesisAndFraming.tsx:54 ("SambaNova RDU")
- `BTB` (Branch Target Buffer) — ThesisAndFraming.tsx:88
- `SM` (Streaming Multiprocessor) — ThesisAndFraming.tsx:88 ("GPU SMs")
- `NEFF` (Neuron Executable File Format) — ThesisAndFraming.tsx:90
- `SMEM` (Shared Memory) — ThesisAndFraming.tsx:99
- `TMEM` (Tensor Memory) — ThesisAndFraming.tsx:99
- `SBUF` (State Buffer) and `PSUM` (Partial Sum buffer) — ThesisAndFraming.tsx:99
- `tcgen05` (Blackwell tensor-core gen-05 instruction) — ThesisAndFraming.tsx:108
- `HFT` (High-Frequency Trading) — ThesisAndFraming.tsx:148
- `ROB` / `RAS` not used here (clear)
- `KV cache` — ThesisAndFraming.tsx:188 (no expansion of "Key/Value cache")

**Citation gaps:**
- "ridge point is roughly 825 FLOPs per byte" — ThesisAndFraming.tsx:43 (derivation from cited spec, acceptable, but the inline calculation is presented as a fact; mark as derived).
- "Decode with a modest batch size lives at 2-10 FLOPs per byte" — ThesisAndFraming.tsx:44 (load-bearing quantitative claim, no citation).
- "AMX tile registers on Intel Xeon 6 hold 16 rows of up to 64 bytes" — ThesisAndFraming.tsx:108 (load-bearing spec, no citation; Section 5 cites the AMX overview — pull link inline here).
- "A branch mispredict on an out-of-order core costs 15-20 cycles" — ThesisAndFraming.tsx:160 (load-bearing number, no citation).

**Other issues:**
- Section header "Beyond peak FLOPs" uses "FLOPs" (acronym for FLoating-point OPerations per second / FLOPS) — fine for technical-lead audience but not expanded anywhere in the deep dive front-matter; recommend a one-time expansion in the opening paragraph.
- Cross-reference at line 184 says "Section 5 digs into HBM" — Section 5 is `KernelExecutionLifecycle`; HBM is Section 6. Numbering drift.
- Cross-reference at line 257 of Section 3 also says HBM is "Section 5" — same drift, file ThesisAndFraming.tsx:184 is the originating offender.

**Recommended corrections:**
1. ThesisAndFraming.tsx:36 — expand on first occurrence: "NVIDIA H200 SXM (Server PCI Express Module) ships 3,958 TFLOPS of FP8 tensor performance against 4.8 TB/s of HBM (High Bandwidth Memory) 3e bandwidth".
2. ThesisAndFraming.tsx:53-54 — expand AMX, LPU, RDU on first occurrence.
3. ThesisAndFraming.tsx:88-99 — expand BTB, SM, NEFF, SMEM, TMEM, SBUF, PSUM on first occurrence (this is the canonical first hit for several of these acronyms in the deep dive's reading order).
4. ThesisAndFraming.tsx:43-44 — add a derived-from-cite note at end of sentence ("derived from the H200 spec above") and add a Tier 1 link for the "2-10 FLOPs per byte" decode figure (NVIDIA inference performance docs or LLM inference whitepaper).
5. ThesisAndFraming.tsx:108 — inline-cite the AMX tile dimensions to the Intel AMX overview already linked in Section 5.
6. ThesisAndFraming.tsx:160 — inline-cite the 15-20-cycle mispredict figure (Intel optimization manual or AMD SoG).
7. ThesisAndFraming.tsx:184 — fix Section number ("Section 6 digs into HBM", not "Section 5").
8. Expand `KV cache` on first occurrence (ThesisAndFraming.tsx:188).

---

## Section 2 — The Heterogeneity Fact
**Discipline:** all clear.
**Acronyms missing expansion:**
- `BTB` — HeterogeneityFact.tsx:23 (table cell, first appearance for many readers).
- `OoO` (Out-of-Order) — HeterogeneityFact.tsx:23.
- `SVE2` (Scalable Vector Extension v2) — HeterogeneityFact.tsx:24.
- `AVX-512` (Advanced Vector Extensions 512-bit) — HeterogeneityFact.tsx:24.
- `AMX` — HeterogeneityFact.tsx:24 (still un-expanded if Section 1 isn't fixed).
- `wgmma` (warp-group matrix-multiply-accumulate) — HeterogeneityFact.tsx:29.
- `tcgen05` — HeterogeneityFact.tsx:29.
- `CuTe` (CUDA Tensor / CuTe layout DSL) — HeterogeneityFact.tsx:31.
- `SIMT` (Single-Instruction Multiple-Thread) — HeterogeneityFact.tsx:75 / 161.
- `PE` (Processing Element) — HeterogeneityFact.tsx:43 ("per-PE program").
- `WSE-3` (Wafer-Scale Engine 3) — HeterogeneityFact.tsx:42 / 178.
- `HBM-PIM` / `HyperCIM` — HeterogeneityFact.tsx:49 (PIM = Processing-in-Memory; CIM = Compute-in-Memory).
- `ROB` (Reorder Buffer) — HeterogeneityFact.tsx:155.
- `RAS` (Return Address Stack) — HeterogeneityFact.tsx:155.

**Citation gaps:**
- "Mispredict cost: ~15-20 cycles" — HeterogeneityFact.tsx:153 (no citation; same number as Section 1).
- "Cache miss cost: hundreds of cycles" — HeterogeneityFact.tsx:154 (load-bearing, uncited).
- The table rows (HeterogeneityFact.tsx:19-55) carry no inline citations; the small-text disclaimer at line 116-124 defers to "the per-vendor sections (8-19)". This is acceptable disclaimer pattern but should remain consistent.

**Other issues:**
- HeterogeneityFact.tsx:84-86 — "P5 (Hopper), P6 (Blackwell), Trn2 UltraServer (Trainium2 with 64-chip coherent domain)" — load-bearing claim ("64-chip coherent domain") with no inline citation; AWS Trn2 UltraServer page should be linked.
- HeterogeneityFact.tsx:120 — Neuron SDK link is the only cite in the section; access date present (good pattern).

**Recommended corrections:**
1. HeterogeneityFact.tsx:23-31 — expand BTB, OoO, SVE2, AVX-512, wgmma, tcgen05, CuTe, SIMT, PE on first table-row occurrence (table cells are part of the reading order).
2. HeterogeneityFact.tsx:42, 49 — expand WSE-3, HBM-PIM, HyperCIM (or note CIM = Compute-in-Memory once).
3. HeterogeneityFact.tsx:84-86 — add inline cite to AWS Trn2 UltraServer page for "64-chip coherent domain".
4. HeterogeneityFact.tsx:153-154 — inline-cite the cycle cost figures or move to "industry-typical" disclaimer (similar to Section 5's latency table caveat at line 251-260).
5. HeterogeneityFact.tsx:155 — expand ROB and RAS on first occurrence.

---

## Section 3 — Roofline and Arithmetic Intensity
**Discipline:** all clear.
**Acronyms missing expansion:**
- `GEMM` (General Matrix Multiply) — RooflineAndArithmeticIntensity.tsx:96.
- `KV cache` — RooflineAndArithmeticIntensity.tsx:166 / 213 (still unexpanded).
- `MoE` not used here. `RAG` not used here.
- `vLLM`, `TensorRT-LLM`, `SGLang`, `Neuron-Distributed` — product names, fine without expansion but worth noting.
- `NVFP4 (E2M1)` — RooflineAndArithmeticIntensity.tsx:232 (the parenthetical is the expansion; acceptable).
- `MXFP8` — RooflineAndArithmeticIntensity.tsx:232 (no expansion; OCP Microscaling Format FP8).
- `NKI` (Neuron Kernel Interface) — RooflineAndArithmeticIntensity.tsx:225.

**Citation gaps:**
- Roofline paper citation at line 60-65 is excellent (author, journal, date).
- Ridge points (RooflineAndArithmeticIntensity.tsx:20-42) carry per-row vendor URLs — good.
- "FLOPs" derivations in the prose for batch-1 decode (~2 FLOPs/byte) at lines 178-180 — derived from spec, acceptable.
- "1.8 TB/s GPU-to-GPU, 14.4 TB/s total NVLink" at RooflineAndArithmeticIntensity.tsx:142-145 — load-bearing numbers in the UNKNOWN warning, no inline citation.
- "H100: 3.35 TB/s HBM3" at row 1 (RooflineAndArithmeticIntensity.tsx:25) and "H200: 4.8 TB/s HBM3e" — vendor URLs supplied per row; good.
- Line 256 says "the bandwidth wall (Section 5)" — wrong section number; should be Section 6.

**Other issues:**
- RooflineAndArithmeticIntensity.tsx:185 — "Sections 8-16 take each silicon family in turn" — verify section ranges in IA; not a content issue but cross-ref hygiene to confirm.
- RooflineAndArithmeticIntensity.tsx:225-226 — "Sections 14 and 16 cover the compiler surfaces" — same cross-ref drift risk.
- RooflineAndArithmeticIntensity.tsx:232 — "FP4 and FP8 safe at model scale" — no cite for the precision-ladder claim; Section 21 reference is fine but inline cite preferred for "halves the byte count without halving the FLOP count" framing.

**Recommended corrections:**
1. RooflineAndArithmeticIntensity.tsx:96 — expand GEMM on first occurrence ("Dense GEMM (General Matrix Multiply)…").
2. RooflineAndArithmeticIntensity.tsx:142-145 — add inline cite to NVIDIA HGX page for the 1.8 / 14.4 TB/s figures.
3. RooflineAndArithmeticIntensity.tsx:166 — expand KV cache (Key/Value cache) on first occurrence within the section.
4. RooflineAndArithmeticIntensity.tsx:225 — expand NKI on first occurrence.
5. RooflineAndArithmeticIntensity.tsx:256 — fix "Section 5" → "Section 6" (HBM lives in Section 6 per audit batch).
6. RooflineAndArithmeticIntensity.tsx:232 — expand MXFP8 inline (Microscaling FP8) or footnote.

---

## Section 4 — Memory Hierarchy Primer
**Discipline:** all clear.
**Acronyms missing expansion:**
- `LLC` (Last-Level Cache) — MemoryHierarchyPrimer.tsx:46 ("LLC / L3").
- `DRAM` (Dynamic Random-Access Memory) — MemoryHierarchyPrimer.tsx:52, used heavily; never expanded.
- `MRDIMM` (Multiplexed Rank DIMM) — MemoryHierarchyPrimer.tsx:53.
- `LPDDR5X` (Low-Power DDR5X) — MemoryHierarchyPrimer.tsx:53.
- `DIMM` (Dual In-line Memory Module) — MemoryHierarchyPrimer.tsx:53 / 264.
- `CXL` (Compute Express Link) — MemoryHierarchyPrimer.tsx:58.
- `CC-Cores` (Collective-Communication cores on Trainium) — MemoryHierarchyPrimer.tsx:61.
- `TLB` (Translation Lookaside Buffer) — not present in this section (not an issue).
- `NUMA` (Non-Uniform Memory Access) — MemoryHierarchyPrimer.tsx:222.
- `IR` (Intermediate Representation) — MemoryHierarchyPrimer.tsx:235.
- `MoE` not used here.

**Citation gaps:**
- "256 KB register file per SM" — MemoryHierarchyPrimer.tsx:25 (load-bearing, no inline cite; vendor docs needed).
- "Hopper ≈ 228 KB/SM; TMEM (Blackwell 256 KB/SM)" — MemoryHierarchyPrimer.tsx:30 / 173 / 180 (load-bearing, no inline cite at first appearance; H200 product page link at line 113-117 doesn't directly substantiate SMEM/TMEM sizes).
- "Xeon 6: 2 MB per-core private L2" — MemoryHierarchyPrimer.tsx:42 (Intel Xeon 6 brief is linked at lines 117-123; good pattern, but the table row would benefit from a per-row cite).
- "H100: 50 MB; H200: 50 MB" L2 — MemoryHierarchyPrimer.tsx:42 (uncited inline; same H200 page link covers H200, but H100 number needs the H100 page).
- "~4-8 TB/s of HBM bandwidth" — MemoryHierarchyPrimer.tsx:254 (range claim; cited downstream in Section 6, fine).
- "Per-core L1D (typ. 48-64 KB)" — MemoryHierarchyPrimer.tsx:36 (typ. range, weak; cite Intel/AMD/Arm optimization guides).

**Other issues:**
- MemoryHierarchyPrimer.tsx:296-300 — "Graviton4 → Graviton5 transition" — claim is forward-referenced to Section 8; fine.
- The compare table (lines 19-63) has no per-cell sources; small-text disclaimer at lines 110-125 covers H200 and Xeon 6 but not Trainium SBUF / PSUM. Pull a Neuron SDK link inline.
- "Hopper SMEM is 228 KB" appears in this section AND Section 5's latency table; both should cite the Hopper Tuning Guide that Section 5 already links.

**Recommended corrections:**
1. MemoryHierarchyPrimer.tsx:25, 30 — inline-cite the H100 / Hopper register-file and SMEM sizes to the NVIDIA Hopper Tuning Guide (already linked in Section 5).
2. MemoryHierarchyPrimer.tsx:30 — inline-cite Blackwell TMEM 256 KB/SM to the NVIDIA Blackwell architecture brief or PTX ISA.
3. MemoryHierarchyPrimer.tsx:42 — inline-cite H100 L2 = 50 MB to NVIDIA H100 page.
4. MemoryHierarchyPrimer.tsx:46-58 — expand LLC, DRAM, MRDIMM, LPDDR5X, DIMM, CXL, CC-Cores on first table occurrence.
5. MemoryHierarchyPrimer.tsx:222 — expand NUMA.
6. MemoryHierarchyPrimer.tsx:235 — expand IR (Intermediate Representation).
7. MemoryHierarchyPrimer.tsx:36 — replace "typ. 48-64 KB" with vendor-specific cited numbers for at least one Arm and one x86 part.
8. Add a Neuron SDK inline cite for SBUF / PSUM row (line 31).

---

## Section 5 — Kernel Execution Lifecycle
**Discipline:** all clear.
**Acronyms missing expansion:**
- `TMA` (Tensor Memory Accelerator) — KernelExecutionLifecycle.tsx:31 / 202.
- `SMEM`, `TMEM`, `SBUF`, `PSUM` — repeated; first-use depends on whether earlier sections fix theirs. If Section 1 expansions land, fine.
- `cuBLAS` / `cuDNN` — product names, fine.
- `oneDNN` — product name, fine.
- `MoE` (Mixture of Experts) — KernelExecutionLifecycle.tsx:163 ("fused MoE").
- `XSAVE/XRSTOR` — Intel-specific, niche; brief expansion helpful (extended state save/restore).
- `TDPBF16PS` / `TDPFP16PS` — KernelExecutionLifecycle.tsx:104, 213 — AMX instruction mnemonics; not expanded (acceptable as opcodes, but a parenthetical "tile dot-product BF16 / FP16 producing single-precision" would help).
- `wgmma` / `tcgen05` — repeated.
- `IR` — KernelExecutionLifecycle.tsx:369.
- `AOT` (Ahead-of-Time) — KernelExecutionLifecycle.tsx:270 (heading) / 307. Used in the heading without expansion.
- `HLO` (High-Level Optimizer / XLA HLO) — KernelExecutionLifecycle.tsx:93.

**Citation gaps:**
- Latency table (KernelExecutionLifecycle.tsx:21-71) — "20-30 cycles", "150-300 cycles", "300-600 cycles" etc. — all uncited, but the alert at lines 251-260 explicitly disclaims them as "typical industry ranges", with verified Tier 1 numbers deferred to Sections 4 and 6. This is an acceptable disclaimer pattern.
- "max 32 blocks / SM, 64 concurrent warps / SM on Hopper" — KernelExecutionLifecycle.tsx:86 — Hopper Tuning Guide cited inline at line 187-190 (good).
- "H100 L2 is 50 MB" — KernelExecutionLifecycle.tsx:48 (table cell, uncited at this row; covered by Section 4 reference but per-cell cite preferred).
- "H200 reads at 4.8 TB/s aggregate" — KernelExecutionLifecycle.tsx:55 (cited at the H200 product page in other sections; pull link in).

**Other issues:**
- KernelExecutionLifecycle.tsx:339 — "FlashAttention is faster than the naïve attention chain" — the FlashAttention reference (Dao et al.) should be linked at first mention; Section 3 mentions FlashAttention without citation either.
- KernelExecutionLifecycle.tsx:393-396 — "Sections 12-13" and "Section 16" — verify cross-references; this audit cannot confirm IA without reading the section index.

**Recommended corrections:**
1. KernelExecutionLifecycle.tsx:31, 202 — expand TMA on first occurrence.
2. KernelExecutionLifecycle.tsx:93 — expand HLO ("XLA HLO (High-Level Optimizer)").
3. KernelExecutionLifecycle.tsx:163 — expand MoE.
4. KernelExecutionLifecycle.tsx:213 — add brief parenthetical for TDPBF16PS / TDPFP16PS.
5. KernelExecutionLifecycle.tsx:270 — expand AOT (Ahead-of-Time) in section heading or first paragraph under it.
6. KernelExecutionLifecycle.tsx:339 — link FlashAttention paper (Dao et al., NeurIPS 2022) on first mention.
7. KernelExecutionLifecycle.tsx:48, 55 — pull H100/H200 product page links inline at the table rows.

---

## Section 6 — HBM and the Bandwidth Wall
**Discipline:** all clear.
**Acronyms missing expansion:**
- `HBM` — HbmAndBandwidthWall.tsx:54 (heading + body) — first formal use of "HBM" as a standalone heading; expansion in body says "2.5D-packaged technology: DRAM dies stacked vertically with through-silicon vias", but never spells "High Bandwidth Memory". This is the single most load-bearing acronym in the section; must expand.
- `TSV` (Through-Silicon Via) — HbmAndBandwidthWall.tsx:94 ("vertical TSVs").
- `DDR5` (Double Data Rate gen-5) — HbmAndBandwidthWall.tsx:91 (not expanded; common enough to skip, judgment call).
- `PCB` (Printed Circuit Board) — HbmAndBandwidthWall.tsx:98.
- `Gb/s` (gigabits per second) — fine, common.
- `PHY` (Physical layer) — not used here (good).
- `HGX` (Hyperscale GPU eXchange) — HbmAndBandwidthWall.tsx:38 / 137 — NVIDIA platform brand; expansion helpful.
- `KV cache` — HbmAndBandwidthWall.tsx:299 (still unexpanded if Sections 1/3 don't fix).
- `NVL8` — HbmAndBandwidthWall.tsx:139 (NVLink-8) — niche, expand briefly.

**Citation gaps:**
- "1,024 bits of data per stack through sixteen 64-bit channels" — HbmAndBandwidthWall.tsx:91-92 (load-bearing, no citation; JEDEC HBM3 standard or vendor brief required).
- "HBM3 pin speeds in the 6.4 Gb/s range — and HBM3e pin speeds in the 8-9 Gb/s range" — HbmAndBandwidthWall.tsx:96-98 (load-bearing, no citation; SK hynix / Samsung / Micron product briefs).
- "the HBM tier can consume 150 W or more on a single accelerator" — HbmAndBandwidthWall.tsx:213-215 (load-bearing power figure, no citation).
- "HBM4 standards work widens the bus to 2,048 bits per stack" — HbmAndBandwidthWall.tsx:224-226 (load-bearing, no citation; JEDEC HBM4 spec or analyst report).
- "1.8 TB/s GPU-to-GPU, 14.4 TB/s total NVLink on HGX B200/B300" / "3.6 TB/s NVLink figure for the next generation" — HbmAndBandwidthWall.tsx:137-141 (load-bearing, no inline cite; HGX page linked in row 3 but not in the warning).
- "up to 1.9× faster Llama2 70B inference and 1.6× faster GPT-3 175B" — HbmAndBandwidthWall.tsx:178-184 (cited inline to NVIDIA H200 product page, with access date — exemplary pattern).
- "Same SM count" / "Same peak tensor FLOPs at every precision (FP8: 3,958 TFLOPS, BF16: 1,979 TFLOPS) / Same NVLink bandwidth (900 GB/s)" — HbmAndBandwidthWall.tsx:163-165 (per-row uncited; the NVIDIA H100/H200 pages cover these but should be linked at the row, not deferred).

**Other issues:**
- HbmAndBandwidthWall.tsx:21-43 — "B200 / B300" row's UNKNOWN values are honest; good pattern (don't fabricate). Keep.
- HbmAndBandwidthWall.tsx:213 — "HBM pin speed scales power roughly linearly per pin" — qualitative, OK without cite, but "150 W or more" needs cite.
- Cross-reference at line 226 says "Section 12 carries the verified numbers" — Blackwell section number drift risk.

**Recommended corrections:**
1. HbmAndBandwidthWall.tsx:54 (and earlier in Section 1) — explicitly expand HBM = High Bandwidth Memory on first occurrence.
2. HbmAndBandwidthWall.tsx:91 — inline-cite "1,024 bits per stack / sixteen 64-bit channels" to the JEDEC HBM3 specification or SK hynix HBM3 brief.
3. HbmAndBandwidthWall.tsx:94 — expand TSV (Through-Silicon Via).
4. HbmAndBandwidthWall.tsx:96-98 — inline-cite HBM3 6.4 Gb/s and HBM3e 8-9 Gb/s pin-speed figures (SK hynix / Micron product pages).
5. HbmAndBandwidthWall.tsx:38, 137 — expand HGX on first occurrence.
6. HbmAndBandwidthWall.tsx:139 — briefly expand NVL8.
7. HbmAndBandwidthWall.tsx:137-141 — pull the HGX page link inline into the warning's prose for the 1.8 / 14.4 / 3.6 TB/s figures.
8. HbmAndBandwidthWall.tsx:163-165 — add per-row inline cites to NVIDIA H100 and H200 product pages for the SM count, FLOPs, and NVLink figures.
9. HbmAndBandwidthWall.tsx:213-215 — inline-cite the "150 W or more" HBM power figure (SK hynix HBM3e brief or analyst report; flag `[SECONDARY]` if no Tier 1 available).
10. HbmAndBandwidthWall.tsx:224-226 — inline-cite the HBM4 2,048-bit-bus claim to JEDEC HBM4 announcement.
11. HbmAndBandwidthWall.tsx:299 — expand KV cache if not already fixed upstream.

---

## Per-Section Summary Table

| Sec | Discipline | Acronym fixes | Citation fixes | Cross-ref drift | Verdict |
|-----|------------|---------------|----------------|-----------------|---------|
| 1   | Clear      | 14            | 4              | Yes (HBM = Sec 6, not 5) | NEEDS FIX |
| 2   | Clear      | 13            | 3              | None            | NEEDS FIX |
| 3   | Clear      | 4             | 3              | Yes (HBM = Sec 6) | NEEDS FIX |
| 4   | Clear      | 7             | 5              | None            | NEEDS FIX |
| 5   | Clear      | 6             | 2              | Verify Secs 12-13, 16 | NEEDS FIX (mostly minor) |
| 6   | Clear      | 6             | 6              | Verify Sec 12   | NEEDS FIX (heaviest citation gap) |

Top three blockers across batch:
1. HBM never expanded as "High Bandwidth Memory" anywhere in Sections 1-6 despite being the load-bearing acronym for the deep dive.
2. Section 6 has the heaviest density of un-cited quantitative claims (HBM3 / HBM3e pin speeds, 1,024-bit bus, HBM power, HBM4 bus width).
3. Cross-section numbering: Sections 1 and 3 both forward-reference HBM as "Section 5"; HBM lives in Section 6 in this batch's IA.
