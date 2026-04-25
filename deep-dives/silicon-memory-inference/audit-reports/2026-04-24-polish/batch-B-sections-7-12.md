# Batch B audit — Sections 7-12 (silicon-memory-inference)

Auditor: read-only polish-pass. Files audited:
- `src/sections/MainMemoryAndCxl.tsx`
- `src/sections/ChipletAndInterconnect.tsx`
- `src/sections/GravitonDeepDive.tsx`
- `src/sections/AmdEpycTurin.tsx`
- `src/sections/IntelXeon6.tsx`
- `src/sections/NvidiaHopper.tsx`

Quality bar reference: `deep-dives/efa/src/sections/Architecture.tsx`. Acronym rule: niche/domain acronyms must expand on first occurrence in the section. Citation rule: every load-bearing quantitative claim needs an inline Cloudscape `Link` to a Tier 1 source with an access date.

---

## Section 7 — DDR5, MRDIMM, LPDDR5X, and CXL
**Discipline:** all clear (no SectionShell, no TLDR Alert, no status badge, no Panelist map, no Evaluation lens).

**Acronyms missing expansion:**
- `DDR5` — first occurrence MainMemoryAndCxl.tsx:21 (table) and :37 (header). Never expanded.
- `LPDDR5X` — MainMemoryAndCxl.tsx:37 (header). Never expanded.
- `RDIMM` — MainMemoryAndCxl.tsx:24, :133. Never expanded.
- `MRCD` — MainMemoryAndCxl.tsx:163. Glossed only as "extra buffer chip"; no acronym expansion.
- `JEDEC` — MainMemoryAndCxl.tsx:25, :173. Never expanded.
- `MT/s` — MainMemoryAndCxl.tsx:165. Never expanded.
- `NUMA` — MainMemoryAndCxl.tsx:119. Never expanded.
- `DIMM` — MainMemoryAndCxl.tsx:162 (the `D` inside MRDIMM/RDIMM is implicit only).
- `OLAP` — MainMemoryAndCxl.tsx:247. Never expanded.
- `HFT` — MainMemoryAndCxl.tsx:252 (Alert header). Never expanded.
- `HBM` — MainMemoryAndCxl.tsx:43. Never expanded in this section (referenced Section 6 but per-section rule still requires it).
- `NVLink-C2C` — MainMemoryAndCxl.tsx:217. Never expanded.

**Citation gaps:**
- "STREAM triad usually lands at 60-90% of theoretical" — MainMemoryAndCxl.tsx:118-120. No citation.
- "200-400 ns" CXL link latency — MainMemoryAndCxl.tsx:249-250. No citation.
- "844.8 GB/s theoretical peak — about 37% over DDR5-6400" — MainMemoryAndCxl.tsx:184-186. The 844.8 value is in the table; the "37% over" derivation has no inline citation.
- LPDDR5X "480 GB ... ~500 GB/s ... 16 W envelope" — MainMemoryAndCxl.tsx:206-211. The Grace CPU page citation supports the 500 GB/s claim, but the "16 W envelope" specifically is not on that landing page; needs a more specific Tier 1 source (Grace Hopper Superchip whitepaper).
- "100s of nanoseconds over a direct DDR channel" — MainMemoryAndCxl.tsx:253-254. No citation.

**Other issues:**
- The `Box variant="small"` source line at MainMemoryAndCxl.tsx:74-98 batches four citations into a footer for the comparison grid — better than nothing but does not satisfy per-claim inline citation discipline for the figures rendered inside `MemoryTechGrid`.
- "modestly higher than DDR5 RDIMM" — MainMemoryAndCxl.tsx:214. Vague; either quantify or remove.

**Recommended corrections:**
1. Expand on first use: `DDR5 (Double Data Rate 5)`, `LPDDR5X (Low-Power DDR5X)`, `RDIMM (Registered DIMM)`, `MRCD (Multiplexed Registering Clock Driver)`, `JEDEC (Joint Electron Device Engineering Council)`, `NUMA (Non-Uniform Memory Access)`, `MT/s (mega-transfers per second)`, `OLAP (Online Analytical Processing)`, `HFT (high-frequency trading)`, `HBM (High Bandwidth Memory)`, `NVLink-C2C (chip-to-chip)` on each first occurrence.
2. Add inline citation for the "60-90% of theoretical" STREAM claim or remove it.
3. Add inline citation for "200-400 ns" CXL latency (CXL Consortium spec or Micron CXL whitepaper).
4. Replace "modestly higher than DDR5 RDIMM" with a specific number + source, or strike.
5. Move the four-source `Box variant="small"` block so each figure cited alongside the tile in `MemoryTechGrid` rather than batched at the bottom (component-level edit, may be out of scope).

---

## Section 8 — Chiplet and interconnect topology
**Discipline:** all clear.

**Acronyms missing expansion:**
- `CCD` — ChipletAndInterconnect.tsx:24. Never expanded.
- `CCX` — ChipletAndInterconnect.tsx:78, :168. Never expanded.
- `GMI` — ChipletAndInterconnect.tsx:24 ("GMI3-Wide"). Never expanded.
- `IOD` — implied throughout; "IO die" is fine but "IOD" never spelled out where used in row text.
- `UMC` — ChipletAndInterconnect.tsx:100. Never expanded.
- `MDF` — ChipletAndInterconnect.tsx:30. Never expanded in this section.
- `EMIB` — ChipletAndInterconnect.tsx:30 (table). Expanded only at :188-189 ("embedded silicon bridges in the substrate") — and not as the formal "Embedded Multi-die Interconnect Bridge".
- `CMN` — ChipletAndInterconnect.tsx:36 ("CMN-700"). Never expanded.
- `CHA` — ChipletAndInterconnect.tsx:30. Never expanded.
- `SLC` — ChipletAndInterconnect.tsx:36. Never expanded in this section.
- `NPS` — ChipletAndInterconnect.tsx:103 ("NPS1"), :169 ("NPS2 / NPS4"). Never expanded.
- `SNC` — ChipletAndInterconnect.tsx:227 ("SNC3"). Never expanded.
- `NV-HBI` — ChipletAndInterconnect.tsx:47. Loosely glossed at :198-200, no formal expansion.
- `NUMA` — ChipletAndInterconnect.tsx:169. Never expanded.

**Citation gaps:**
- "Turin ~261 GB/s per core measured aggregate" — ChipletAndInterconnect.tsx:167-168. No inline citation; the section's own footer (:142-145) defers to "Sections 9-13", which violates the per-claim inline-citation rule.
- "Per-core L3 bandwidth is ~30 GB/s" — ChipletAndInterconnect.tsx:178-181. No inline citation.
- "cross-die hop adds ~24 ns per boundary" — ChipletAndInterconnect.tsx:191. No citation.
- "10 TB/s aggregate stated by NVIDIA at announcement" — ChipletAndInterconnect.tsx:201. Attribution but no link.
- "208B transistor chip" — ChipletAndInterconnect.tsx:203. No citation.
- "Load latency under contention can be 1.5-2× the unloaded latency" — ChipletAndInterconnect.tsx:224-225. No citation.
- "Snoop filter ... ~288 MB of mesh storage" — ChipletAndInterconnect.tsx:241-244. No citation.
- Latency figures in the table (intra-CCD ~45 ns, inter-CCD ~150 ns, cross-socket ~260 ns; Local L3 ~33 ns / adjacent ~57 ns / two crossings ~80 ns; cross-core 30-60 ns / cross-socket 138 ns) — ChipletAndInterconnect.tsx:25-44. No inline citations in the table or table footer; the per-row claims are load-bearing.

**Other issues:**
- The footer "All measured numbers traceable to vendor docs or third-party measurement — see Sections 9-13 for direct citations per row" (ChipletAndInterconnect.tsx:142-145) is a load-bearing-claim laundering pattern. Per-section rule means citations must be inline here, not deferred.

**Recommended corrections:**
1. Expand on first use: `CCD (Core Complex Die)`, `CCX (Core Complex)`, `GMI (Global Memory Interconnect)`, `UMC (Unified Memory Controller)`, `MDF (Modular Data Fabric)`, `EMIB (Embedded Multi-die Interconnect Bridge)`, `CMN (Coherent Mesh Network)`, `CHA (Caching/Home Agent)`, `SLC (System Level Cache)`, `NPS (Nodes Per Socket)`, `SNC (Sub-NUMA Clustering)`, `NV-HBI (NVIDIA High-Bandwidth Interface)`, `NUMA (Non-Uniform Memory Access)`.
2. Add inline `Link` citations into the `archRows` table (Chips and Cheese for AMD/Intel rows, AWS announcement for Graviton rows, NVIDIA whitepaper for the GPU row), or add a per-row source column.
3. Add inline citation for the GMI/IO-die queuing claim (Chips and Cheese Turin or Hot Chips slide deck).
4. Cite the NV-HBI 10 TB/s and 208B-transistor numbers to the NVIDIA Blackwell architecture whitepaper.
5. Cite the snoop-filter 1.5× rule to ARM CMN-700 TRM.

---

## Section 9 — Graviton deep dive
**Discipline:** all clear.

**Acronyms missing expansion:**
- `SLC` — GravitonDeepDive.tsx:64. Expanded at :139 as "System Level Cache (SLC)" — actually this *is* expanded inline; ok.
- `CMN` — GravitonDeepDive.tsx:26, :115. Never expanded.
- `NUMA` — GravitonDeepDive.tsx:31, :188. Never expanded.
- `DDR5` — GravitonDeepDive.tsx:28. Never expanded.
- `ISA` — GravitonDeepDive.tsx:20, :54. Borderline common; safer to expand.
- `KV-cache` — GravitonDeepDive.tsx:56, :186. Domain term; consider parenthetical "key-value cache" first time.
- `BW` — GravitonDeepDive.tsx:29, :198. Should be "bandwidth" or expanded.
- `JVM` — GravitonDeepDive.tsx:195, :207. Common-ish; OK.
- `GC` — GravitonDeepDive.tsx:195. Should expand to "garbage collection".

**Citation gaps:**
- "~32 bytes/cycle bidirectional bandwidth per stop" — GravitonDeepDive.tsx:142-143. No citation.
- "snoop filter eats ~288 MB of on-mesh storage" — GravitonDeepDive.tsx:144-147. No citation (re-uses Section 8 unsourced claim).
- "AWS claims CMN-S3 delivers ~33% lower inter-core latency" — GravitonDeepDive.tsx:154-155. The footer cites the About Amazon page generically but no per-claim inline link.
- ">100 GB/s effective per-core bandwidth from cache" — GravitonDeepDive.tsx:163-166. No citation.
- "~138 ns cross-socket latency" — GravitonDeepDive.tsx:204-205. No inline citation in the ExpandableSection.

**Other issues:**
- Table row "Cores per socket — 192 (2×)" (line 22) — the "(2×)" annotation is ambiguous (2× cores? 2 sockets?). Clarify.
- "DDR5-7200 (8800 in works)" GravitonDeepDive.tsx:28 — speculative-sounding; either source or strike.
- "L1 I / D — 64 / 64 KB (likely)" GravitonDeepDive.tsx:24 — "(likely)" violates the falsifiability rule. Remove or cite.

**Recommended corrections:**
1. Expand on first use: `CMN (Coherent Mesh Network)`, `NUMA`, `DDR5`, `ISA (Instruction Set Architecture)`, `GC (garbage collection)`. Replace `BW` with `bandwidth`.
2. Cite "~32 bytes/cycle per stop" to ARM CMN-700 TRM.
3. Move the "33% lower inter-core latency" claim's link directly inline next to the claim, not buried in the table footer.
4. Strike "(8800 in works)" and "(likely)" — replace with a sourced number or remove the row.
5. Add citation for "138 ns cross-socket" (Chips and Cheese Neoverse V2 piece — already linked above; copy the link to the ExpandableSection paragraph).

---

## Section 10 — AMD EPYC Turin (Zen 5)
**Discipline:** all clear.

**Acronyms missing expansion:**
- `CCD` — AmdEpycTurin.tsx:22. Never expanded.
- `CCX` — AmdEpycTurin.tsx:108, :236. Never expanded.
- `AVX-512` — AmdEpycTurin.tsx:50, :235. Never expanded.
- `GMI` — AmdEpycTurin.tsx:67 ("GMI3-Wide"), :100. Never expanded; "GMI3-W" appears as an undefined shorthand at :100.
- `xGMI` — AmdEpycTurin.tsx:105. Never expanded.
- `UMC` — AmdEpycTurin.tsx:100, :115. Implicit "Unified Memory Controllers" at :102 — actually that *is* expanded inline; ok.
- `NPS` — AmdEpycTurin.tsx:37, :150. Never expanded.
- `L3CAN` — AmdEpycTurin.tsx:152. Niche; never expanded.
- `MRDIMM` — AmdEpycTurin.tsx:81. Per-section rule, this is its first appearance in this section. Never expanded.
- `JEDEC` — AmdEpycTurin.tsx:83. Never expanded.
- `AMX` — AmdEpycTurin.tsx:244. Never expanded.
- `NUMA` — AmdEpycTurin.tsx:38, :150. Never expanded.
- `FPGA` — AmdEpycTurin.tsx:209. Borderline; expand for safety.
- `MLP` (memory-level parallelism) — AmdEpycTurin.tsx:69 — actually written out, ok.

**Citation gaps:**
- IO-die topology details ("12 UMCs, 16 GMI ports, 8 combo I/O links 16 lanes each at 32 GT/s") — AmdEpycTurin.tsx:102-108. No inline citation.
- "(~261 GB/s per core measured aggregate)" — AmdEpycTurin.tsx:236. No inline citation.
- "up to 6 TB DRAM per socket" — AmdEpycTurin.tsx:238. No citation.
- "5 GHz boost" M8azn — AmdEpycTurin.tsx:208. No citation.
- "outstanding L1 miss tracking went from 24 to 124 (5.2× memory-level parallelism)" — AmdEpycTurin.tsx:68-70. The Chips and Cheese link in the same paragraph supports it; ok.
- "DRAM (NPS0 uniform) — >220 ns" / "about 90 ns over NPS1" — AmdEpycTurin.tsx:37, :151-153. The Chips and Cheese UMA citation is in the same Container; acceptable but the Alert at :150 doesn't include the link directly.

**Other issues:**
- "NPS0 (uniform interleave across all 12 channels with no NUMA partitioning)" — `NPS0` is real but its semantics across vendors differ; double-check whether the "L3CAN" mode mentioned at :152 is current Turin terminology (vendor BIOS guides).
- M8azn "5 GHz boost" — verify; AWS instance pages typically don't state boost frequency. Source needed or strike.
- Section uses the phrase "5.2× memory-level parallelism" — strictly the MLP improvement is "5.2× outstanding L1 misses", not 5.2× MLP. Tighten wording.

**Recommended corrections:**
1. Expand: `CCD`, `CCX`, `AVX-512 (Advanced Vector Extensions, 512-bit)`, `GMI (Global Memory Interconnect)`, `xGMI (external GMI)`, `NPS (Nodes Per Socket)`, `MRDIMM`, `JEDEC`, `AMX (Advanced Matrix Extensions)`, `NUMA`, `FPGA (Field-Programmable Gate Array)`. Define `L3CAN` or strike.
2. Cite IO-die composition to AMD's Turin product brief or the Hot Chips 2024 deck.
3. Cite "~261 GB/s per core" to Chips and Cheese Turin launch (already linked elsewhere — copy inline).
4. Cite "6 TB DRAM per socket" to AMD EPYC 9005 product brief.
5. Cite "M8azn 5 GHz boost" to AWS announcement or strike the number.
6. Clarify "5.2× MLP" → "5.2× outstanding L1 miss tracking".

---

## Section 11 — Intel Xeon 6 (Granite Rapids)
**Discipline:** all clear.

**Acronyms missing expansion:**
- `MRDIMM` — IntelXeon6.tsx:21. Never expanded.
- `LGA` — IntelXeon6.tsx:21, :22. Never expanded.
- `SNC` — IntelXeon6.tsx:21. Never expanded ("SNC3"); :108 Alert references SNC3 / "HEX mode" without expansion.
- `AMX` — IntelXeon6.tsx:21, :45. Header reference at :45 without expansion; expanded properly at :131-134 but the first textual occurrence is earlier.
- `EMIB` — IntelXeon6.tsx:62. Expanded at :95-96 ("Embedded Multi-die Interconnect Bridge"); however first occurrence at :62 is unexpanded — fix order.
- `MDF` — IntelXeon6.tsx:96. Expanded inline as "Modular Data Fabric"; ok.
- `UPI` — IntelXeon6.tsx:93. Never expanded.
- `CXL` — IntelXeon6.tsx:64, :93. Never expanded in this section.
- `DSA`, `IAA`, `QAT`, `DLB` — IntelXeon6.tsx:93, :243. None expanded.
- `AVX-512` — IntelXeon6.tsx:23. Never expanded.
- `DDR5` — IntelXeon6.tsx:21. Never expanded.
- `BF16`, `INT8`, `FP16`, `FP8` — IntelXeon6.tsx:33-35. Number-format acronyms; expand once on first occurrence.
- `RDIMM` — IntelXeon6.tsx:178. Never expanded.

**Citation gaps:**
- "L3 grew to 504 MB declared (480 MB measured by third parties on the 6985P-C)" — IntelXeon6.tsx:64-66. The Chips and Cheese link is in the same paragraph; ok.
- "Per-core L3 read bandwidth on Granite Rapids is ~30 GB/s; on AMD Turin it is closer to 261 GB/s ... ~11 GB/s per core on Granite Rapids vs ~98 GB/s per core on Turin" — IntelXeon6.tsx:194-200. No inline citation in the Alert.
- "STREAM triad at 691.62 GB/s per socket — 2.14× their Emerald Rapids measurement of 323.45 GB/s" — IntelXeon6.tsx:178-181. The paragraph cites the AWS M8i page, but the *measurement* is Chips and Cheese; the Chips and Cheese link is in Section 7 only. Re-cite inline here.
- "AMX defines 8 tile registers, each holding 16 rows of up to 64 bytes (1 KB max per tile)" — IntelXeon6.tsx:132-135. Intel AMX overview link supports it; ok.
- "Capacity-heavy workloads up to 6 TB / socket" — IntelXeon6.tsx:241. No citation.
- "each EMIB crossing adds ~24 ns" — IntelXeon6.tsx:251. No citation.

**Other issues:**
- "the alternative 'HEX mode' (former SNC1)" — IntelXeon6.tsx:111. The "former SNC1" claim needs a source; Intel renamed modes between generations and this is easy to get wrong.
- "(a new precision in the AMX instruction set)" — IntelXeon6.tsx:62. Vague; the table at :32-36 already states the lineage. Consider striking the redundant gloss.

**Recommended corrections:**
1. Expand on first use: `MRDIMM`, `LGA`, `SNC (Sub-NUMA Clustering)`, `AMX (Advanced Matrix Extensions)`, `EMIB (Embedded Multi-die Interconnect Bridge)` — move the expansion from :95 to first use at :62, `UPI (Ultra Path Interconnect)`, `CXL (Compute Express Link)`, `DSA (Data Streaming Accelerator)`, `IAA (In-Memory Analytics Accelerator)`, `QAT (QuickAssist Technology)`, `DLB (Dynamic Load Balancer)`, `AVX-512`, `DDR5`, `RDIMM`, `BF16 (bfloat16)`, `INT8`, `FP16`, `FP8`.
2. Add inline Chips and Cheese citation next to the 691.62 GB/s STREAM number at :178-181.
3. Cite the per-core L3 ~30 GB/s vs ~261 GB/s comparison inline in the Alert.
4. Cite "6 TB / socket" to Intel Xeon 6 product brief.
5. Cite "EMIB crossing ~24 ns" to Intel Hot Chips 2024 disclosure or strike.
6. Source or strike the "former SNC1" historical claim.

---

## Section 12 — NVIDIA Hopper (H100 / H200)
**Discipline:** all clear.

**Acronyms missing expansion:**
- `SM` — NvidiaHopper.tsx:22, :71. Never expanded ("Streaming Multiprocessor" never written out).
- `SMEM` — NvidiaHopper.tsx:24, :81. Never expanded ("shared memory").
- `HBM` — NvidiaHopper.tsx:26-28. Never expanded in this section.
- `SXM` — NvidiaHopper.tsx:32, :116. Never expanded ("Server PCIe Module" / NVIDIA's mezzanine form factor).
- `TMA` — NvidiaHopper.tsx:52-53. The phrase "Tensor Memory Accelerator" appears but `TMA` itself is not introduced as the abbreviation.
- `wgmma` — NvidiaHopper.tsx:84. Never expanded; should at least reference it as "warp-group matrix-multiply-accumulate".
- `MoE` — NvidiaHopper.tsx:241. Never expanded ("Mixture of Experts").
- `MNNVL` — NvidiaHopper.tsx:242. Never expanded ("Multi-Node NVLink").
- `NVL72` — NvidiaHopper.tsx:242. Never expanded.
- `NVFP4` — NvidiaHopper.tsx:226, :240. Never expanded.
- `tcgen05` — NvidiaHopper.tsx:226, :240. Never expanded.
- `CUTLASS` — NvidiaHopper.tsx:222, :225. Never expanded ("CUDA Templates for Linear Algebra Subroutines").
- `NVLink-C2C` — NvidiaHopper.tsx:243. Never expanded.
- `vLLM`, `TensorRT-LLM`, `Triton` — NvidiaHopper.tsx:223. Tools; brief glosses welcome.
- `BF16`, `FP8`, `FP16` — NvidiaHopper.tsx:30-31, :149-151. Never expanded.
- `TFLOPS` — common; ok.
- `EFA` — NvidiaHopper.tsx:189, :194, :202. Probably expanded earlier in the deep dive but per-section rule should expand once.

**Citation gaps:**
- "39% increase over A100's 164 KB" — NvidiaHopper.tsx:81-83. No citation for the A100 baseline.
- "asynchronous data movement (Tensor Memory Accelerator and async copy)" — NvidiaHopper.tsx:52-53. The Hopper Tuning Guide link at :86-87 is in the next paragraph; arguably covers it, ok.
- "P5en — EFA v3 (built on Nitro v5)" — NvidiaHopper.tsx:202-203. No citation for the Nitro generation claim.
- "Distributed Shared Memory model" — NvidiaHopper.tsx:53. No citation.

**Other issues:**
- The H100/H200 spec table at :19-33 has all numbers cited via the NVIDIA H100/H200 product pages (footer at :122-133); the per-claim discipline is just barely satisfied because every number in the table is also on those two pages. However, "FP8 Tensor Core (sparse) — 3,958 TFLOPS" specifically refers to *sparse* — the dense number (1,979 TFLOPS) is the one usually quoted; double-check the "(sparse)" annotation matches the source.
- "NVLink Gen 4 BW per GPU — 900 GB/s" — both H100 and H200 are listed identically; correct, but worth noting H100 PCIe variant is different (this row implicitly assumes SXM, which the column header confirms).

**Recommended corrections:**
1. Expand on first use: `SM (Streaming Multiprocessor)`, `SMEM (shared memory)`, `HBM (High Bandwidth Memory)`, `SXM (NVIDIA's mezzanine GPU module)`, `TMA (Tensor Memory Accelerator)` — make the abbreviation explicit, `wgmma (warp-group MMA)`, `MoE (Mixture of Experts)`, `MNNVL (Multi-Node NVLink)`, `NVL72`, `NVFP4 (NVIDIA FP4)`, `tcgen05`, `CUTLASS`, `NVLink-C2C (chip-to-chip)`, `BF16`, `FP8`, `FP16`, `EFA (Elastic Fabric Adapter)`.
2. Cite the A100 SMEM 164 KB baseline to NVIDIA A100 architecture whitepaper.
3. Cite "EFA v3 / Nitro v5" claim to AWS P5en launch blog or strike the parenthetical.
4. Cite "Distributed Shared Memory" to Hopper architecture whitepaper.
5. Verify "FP8 Tensor Core (sparse) 3,958 TFLOPS" matches the cited NVIDIA datasheet; the parenthetical "(sparse)" needs to be explicit.

---

## Per-section summary

| Section | Discipline | Acronym fixes | Citation gaps | Verdict |
|---|---|---|---|---|
| 7 — MainMemoryAndCxl | clear | 12 | 5 | NEEDS FIX (acronyms + citations) |
| 8 — ChipletAndInterconnect | clear | 14 | 8 | NEEDS FIX (heaviest citation gap; defer-to-later-sections pattern) |
| 9 — GravitonDeepDive | clear | 6 | 5 | NEEDS FIX (acronyms + speculative "(likely)" / "(in works)" labels) |
| 10 — AmdEpycTurin | clear | 12 | 5 | NEEDS FIX (acronyms heavy; M8azn 5 GHz unsourced) |
| 11 — IntelXeon6 | clear | 16 | 5 | NEEDS FIX (acronyms heavy; STREAM number needs inline Chips and Cheese link) |
| 12 — NvidiaHopper | clear | 13 | 4 | NEEDS FIX (acronyms heavy; A100 baseline + EFA v3 / Nitro v5 unsourced) |

All six sections pass clean-copy discipline. The dominant cross-section issue is acronym hygiene — almost every niche acronym appears in tables before any prose introduces it, and the per-section first-occurrence rule means each section needs its own expansion even when an earlier section already defined it. The secondary issue is load-bearing quantitative claims missing inline citations, particularly in Section 8 where the "see Sections 9-13 for direct citations per row" pattern launders credibility across section boundaries.
