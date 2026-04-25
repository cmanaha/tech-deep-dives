# Polish Audit — Batch C, Sections 13-18

Audit date 2026-04-24. Read-only. All six sections pass discipline check (no SectionShell / TLDR Alert / status badge / Panelist map / Evaluation lens).

---

## Section 13 — NVIDIA Blackwell (B200 / B300)
**Discipline:** all clear.

**Acronyms missing expansion:**
- `NV-HBI` at NvidiaBlackwell.tsx:20, :82 — paraphrased but never expanded as "NVIDIA High-Bandwidth Interface".
- `tcgen05.mma` at :25, :114, :185, :194 — never expanded.
- `wgmma` at :117 — never expanded.
- `SMEM` at :52 — used before TMEM expansion at :112.
- `MoE` at :60 — first use, no expansion.
- `EP` at :143 — no expansion.
- `SM100`, `sm_90a`, `sm_100`, `cubins` at :118, :206 — niche, no expansion.

**Citation gaps:**
- "B300 288 GB vs H200 141 GB", "8 TB/s class", "14 PFLOPS / GPU on B300" at :58-61 — no inline citation.
- Spec-table rows at :19-30 (180 GB B200, 1.8 TB/s NVLink, 256 KB TMEM, 14 PFLOPS) — no per-row citation.
- "256 KB TMEM per SM" at :112 — no Tier 1 citation.
- "2× to 4× faster than Hopper's wgmma" at :117 — no citation.
- "3.5× over FP16 / 1.8× over FP8" at :131-132 — citation at :136-140 verifies only the 690→415 GB DeepSeek-V3.2 number, not the ratios.
- CUTLASS v4.0 / v4.3 / v4.4 dates and TRT-LLM v1.0 cubins at :206-211 — no release-notes Link.
- "10 TB/s NV-HBI aggregate" at :82-84 — author self-flags as unverified in the Alert below; acceptable but still uncited.

**Other issues:** Alert at :88-96 self-acknowledges uncited spec-table numbers; the table at :19-30 still presents them as flat fact.

**Recommended:** (1) Expand `NV-HBI`, `tcgen05.mma`, `wgmma`, `SMEM`, `MoE`, `EP` on first use. (2) Add Blackwell datasheet Links for :19-30, :58-61, :112. (3) Cite or strike the "2×-4× wgmma" claim at :117. (4) Cite CUTLASS / TRT-LLM release notes at :206-211.

---

## Section 14 — Grace-Blackwell and NVL72 UltraServer
**Discipline:** all clear.

**Acronyms missing expansion:**
- `NVLink-C2C` at GraceBlackwellUltraServer.tsx:31, :135 — no "Chip-to-Chip" expansion.
- `LPDDR5X` at :39, :127; `HBM3e` at :39; `KV-cache` at :32, :138 — no expansion.
- `EP` (=64) at :89; `MoE` at :70-110, :169, :184 — no expansion in this section.
- `HGX` at :108, :180; `Neoverse V2` at :144-146 — no expansion.
- `MNNVL` at :105 paraphrased ("Multi-Node NVLink") inline — OK.

**Citation gaps:**
- "900 GB/s coherent CPU↔GPU" at :32 — no citation.
- 1.8 TB/s / 130 TB/s / 13.4 TB / 17.3 TB at :37-39 — covered by GB200 NVL72 Link at :40-43. OK.
- GB300 20 TB / 1,440 PFLOPS at :44-49 — covered by GB300 Link. OK.
- "DeepSeek-R1 256 routed experts, EP=64 (4 experts/GPU)" at :88-89 — only the NVIDIA-blog quote is cited; DeepSeek-R1 model card / paper Link missing.
- "TRT-LLM v0.21.0 onward" at :108 — no citation.
- "480 GB LPDDR5X / ~500 GB/s / 72-core Neoverse V2" at :126-146 — no Grace datasheet Link.
- P6e UltraServer GB200 / GB300 instance composition at :164-176 — no AWS docs Link.

**Other issues:** Alert at :87-103 mixes a cited NVIDIA-blog quote with uncited DeepSeek-R1 facts (tier-mixing). Cross-references at :105 ("Section 15") and :130 ("Section 7") need verification.

**Recommended:** (1) Expand `NVLink-C2C`, `LPDDR5X`, `HBM3e`, `KV-cache`, `HGX`, `EP`, `MoE`, `Neoverse V2` on first use. (2) Add DeepSeek-R1 Link at :88-89. (3) Add Grace CPU datasheet Link for :126-146. (4) Add AWS P6e docs Link at :164-176. (5) Verify cross-refs at :105, :130.

---

## Section 15 — NVIDIA Compilers and Tooling
**Discipline:** all clear.

**Acronyms missing expansion:**
- `PTX` at NvidiaCompilersAndTooling.tsx:27, :38, :58; `SASS` at :27, :38, :58, :69 — no expansion.
- `CUTLASS` at :23, :58; `CuTe` at :23, :58, :167 — no expansion.
- `Inductor` at :21, :58; `Triton` (DSL) at :22 — no expansion.
- `cuBLAS`, `cuDNN`, `cuTENSOR` at :24 — no expansion.
- `MNNVL` at :207; `NCCL` at :208, :247 — no expansion in this section.
- `NVFP4`, `FP8`, `BF16` at :25, :83, :206-218 — no expansion.
- `OOTB` at :206; `cubin` / `cubins` at :25, :206, :218 — no expansion.
- `SM100`, `sm_90a`, `sm_100` at :27, :118, :218 — no expansion.

**Citation gaps:**
- TRT-LLM cadence "Mixtral 8x7B v0.9.0, FP8 MoE v0.12.0, Wide-EP/MNNVL v0.21.0, NVFP4 cubins v1.0" at :216-219 — no release-notes Link.
- "CUTLASS example 92 v4.0.0 (June 2025), simplified API v4.3.0 (Nov 2025)" at :218-220 — no Link.
- The "Authoritative sources" footnote at :109-135 lists tool homepages, not anchors for specific quantitative claims.

**Other issues:** Cross-reference "Section 5 ... seven stages" at :44 needs verification.

**Recommended:** (1) Expand `PTX`, `SASS`, `CUTLASS`, `CuTe`, `Inductor`, `Triton (DSL)`, `MNNVL`, `NCCL`, `OOTB`, `cubin` on first use. (2) Add TRT-LLM and CUTLASS release-notes Links at :216-220. (3) Verify Section 5 cross-ref at :44.

---

## Section 16 — AWS Custom Silicon (Trainium / Inferentia / Neuron)
**Discipline:** all clear.

**Acronyms missing expansion:**
- `SBUF` at AwsCustomSilicon.tsx:14, :25 (table); expansion at :112 lands AFTER first table use.
- `PSUM` at :15, :56; expansion at :123 lands after.
- `NEFF` at :60, :88, :198 — never expanded in this section.
- `NKI` at :128, :194, :223 — never expanded in this section.
- `MoE` at :136, :219, :281; `HBM` at :22, :86, :147 — no expansion.
- `CC-Cores` at :57 paraphrased ("Collective Communication cores"); `NeuronLink-v3` at :143 paraphrased. OK.

**Citation gaps:**
- Inferentia2 row "24 MiB SBUF / 32 GiB HBM at 0.8 TB/s" at :32-35 — no citation.
- "16 CC-Cores per chip" at :85, :132 — only loosely covered by Neuron-docs Link at :91-95.
- NeuronLink-v3 "1.28 TB/s intra-node, 256 GB/s inter-instance" at :144-145 — no datasheet Link.
- "Cross-server HBM-to-HBM latency 15 µs (vendor-cited)" at :147-148 — no Link.
- "228 KB SMEM" Hopper comparison at :116 — no NVIDIA citation.

**Other issues:** Verify `torch.all_to_all_vdev_2d` API name at :223. Cross-refs "Section 13 / Section 17" at :63-67 need verification.

**Recommended:** (1) Move `SBUF`, `PSUM` expansions before first use. (2) Expand `NEFF`, `NKI`, `MoE`, `HBM` in this section. (3) Add NeuronLink-v3 datasheet Link at :144-148. (4) Cite Hopper whitepaper for 228 KB SMEM at :116. (5) Verify API name at :223.

---

## Section 17 — AWS Compilers and Tooling
**Discipline:** all clear.

**Acronyms missing expansion:**
- `XLA` at AwsCompilersAndTooling.tsx:22, :70, :82; `HLO` at :22, :24, :70, :84 — no expansion.
- `SBUF`, `PSUM` at :23, :180, :247 — no expansion in this section.
- `CC-Cores` at :26, :247; `MoE` at :193; `ZeRO` at :217 — no expansion.
- `AOT` at :148 — paraphrased at :128-129 ("ahead-of-time compilation"). OK.
- `NKI` expanded at :23; `NEFF` expanded at :25. OK.

**Citation gaps:**
- "MoE NKI kernels (Router Top-K, MoE CTE, MoE TKG, Blockwise Matmul) shipped in Neuron 2.27.0" at :193-196 — no in-section release-notes Link (cited only in Section 16).
- The nine-layer table at :19-29 has no per-row citation column.

**Other issues:** Cross-refs "Section 27 (Determinism)" at :140 and "Section 16" at :47 need verification.

**Recommended:** (1) Expand `XLA`, `HLO` at :22. (2) Re-expand `SBUF`, `PSUM`, `CC-Cores` in section. (3) Expand `MoE`, `ZeRO` on first use. (4) Add in-section release-notes Link at :193-196. (5) Verify cross-refs at :47, :140.

---

## Section 18 — Cerebras WSE-3
**Discipline:** clear on the five mechanical Container patterns. **Note:** prose at CerebrasWaferScale.tsx:75-77 names co-panelist Zigfrid Zvezdin inline — not a Panelist-map *Container* but borderline against the discipline-spirit.

**Acronyms missing expansion:**
- `SRAM` at :64-219; `HBM`, `HBM3e` at :64, :67, :100, :219 — no expansion.
- `BF16` at :155; `PHY` at :103 — no expansion.
- `MoE` at :81, :144, :201; `CS-3` at :222, :238; `TPS` at :39 — no expansion.

**Citation gaps:**
- "~46,225 mm², ~57× a flagship GPU die, ~900,000 cores, ~44 GB SRAM" at :62-66 — Link at :68-72 is the Cerebras *homepage*, too thin; needs WSE-3 product page or whitepaper.
- "tens of petabytes per second" / "three orders of magnitude over Blackwell HBM3e" at :66-68 — no specific citation.
- Llama 4 Maverick "2,522 vs 1,038 tokens/s" at :23-28 — Artificial Analysis homepage Link only, not the specific benchmark page; source is third-party (Tier 3) and should be labeled as such.
- GPT-OSS-120B "NVIDIA-cited 60,000 TPS/GPU" at :39 — Link points to Cerebras inference page, not the NVIDIA blog where the figure originated. Mismatched citation.
- Alert at :198-203 (2,522 / 1,038 / 794 / 549) — no anchor at the Alert itself.
- "44 GB / 288 GB B300 / 13.4 TB / 20 TB NVL72" at :219-223 — no in-section citations.

**Other issues:** Alert at :197 uses `type="success"` for a third-party benchmark — consider `type="info"`. Cross-refs "Section 6" at :126 and "Section 22" at :81 need verification.

**Recommended:** (1) Expand `SRAM`, `HBM`, `BF16`, `PHY`, `MoE`, `CS-3`, `TPS` on first use. (2) Replace homepage Link at :68-72 with WSE-3 product page / whitepaper. (3) Add NVIDIA-side citation at :39 for the "60,000 TPS/GPU" claim. (4) Update Artificial Analysis Link at :27 to the specific benchmark page; label as third-party. (5) Anchor the comparison numbers at :219-223. (6) Soften Alert type to `"info"` at :197. (7) Reconsider co-panelist prose at :75-77. (8) Verify cross-refs at :81, :126.

---

## Per-section summary

| Section | Discipline | Acronym fixes | Citation gaps | Severity |
|---|---|---|---|---|
| 13 NVIDIA Blackwell | clear | NV-HBI, tcgen05, wgmma, SMEM, MoE, EP | spec-table, TMEM, wgmma ratio, version cadence | medium |
| 14 NVL72 | clear | NVLink-C2C, LPDDR5X, HBM3e, KV-cache, MoE, EP, HGX | DeepSeek-R1, Grace datasheet, P6e | medium |
| 15 NVIDIA Compilers | clear | PTX, SASS, CUTLASS, CuTe, Inductor, NCCL, MNNVL, OOTB | TRT-LLM / CUTLASS release notes | medium |
| 16 AWS Silicon | clear | SBUF/PSUM ordering, NEFF, NKI, MoE, HBM | NeuronLink, 228 KB SMEM | medium |
| 17 AWS Compilers | clear | XLA, HLO, SBUF, PSUM, MoE, ZeRO | in-section MoE-NKI release notes | low |
| 18 Cerebras | clear (verify panelist prose) | SRAM, BF16, PHY, MoE, HBM, CS-3, TPS | thin homepage Links, mismatched NVIDIA cite | medium-high |
