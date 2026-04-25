# Polish-Pass Audit — Batch E (Sections 25-29)

**Auditor:** read-only review
**Date:** 2026-04-24
**Scope:** Sections 25-29 of silicon-memory-inference deep dive
**Quality bar reference:** efa/src/sections/Architecture.tsx

Prior-section expansion notes used to evaluate "first occurrence":
- NIXL first expanded in Section 24 (DisaggregatedServingAndSpeculative.tsx:74)
- SBUF, NEFF, NeuronLink, MoE, EP, MNNVL, KV cache, NVL72, EFA, RDMA, SM, HBM, NUMA, NIC all expanded in earlier sections
- NCCL expanded inline in Section 25 (line 84)
- NIE expanded inline in Section 26 (the section title and prose define it)
- MIG expanded inline in Section 26 (line 147 "Multi-Instance GPU")

---

## Section 25 — Communication and scale-out
**File:** /Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/CommunicationAndScaleOut.tsx

**Discipline:** all clear
- SectionShell wrapper used? no (plain SpaceBetween + Container)
- TLDR Alert present? no
- status badge? no
- "Panelist map" Container? no
- "Evaluation lens" Container? no

**Acronyms missing expansion:**
- `MoE` at line 38 — already expanded in Section 22 (MoeAndSparseActivation), passes.
- `SM` / `SMs` at line 90, 96, 98, 113 — already expanded in earlier NVIDIA sections, passes.
- `CC-Cores` at section header line 161 — expansion only as "Collective Communication Cores" appears in Section 16 (AwsCustomSilicon.tsx) per glossary — passes.
- `CX7` at line 204 — niche term (Mellanox ConnectX-7 NIC), not expanded anywhere in deep dive. file:line CommunicationAndScaleOut.tsx:204
- `H800` at line 204 — vendor SKU, generally recognized in this audience; not strictly an acronym. No expansion needed but flagging.
- `EP=64` at line 204 — EP first expanded in Section 22, passes.

**Citation gaps:**
- Line 147-150 "P5: up to 3,200 Gbps aggregate. P6e UltraServer (GB200): EFA v3 with higher bandwidth. Trn2 and Trn2 UltraServer ship EFA v3" — load-bearing per-instance bandwidth claim with no inline citation. Text says "the exact per-family numbers track the EC2 instance pages" but no Link is rendered. file:line CommunicationAndScaleOut.tsx:147-151
- Line 169-174 "Trainium2 there are 16 CC-Cores per chip ... NeuronLink-v3 is the chip-to-chip fabric: 1.28 TB/s per chip intra-node, 256 GB/s per chip inter-instance ... 64 chips into a 3D Torus" — multiple quantitative claims, no inline citation. file:line CommunicationAndScaleOut.tsx:165-175
- Line 178-184 "Trainium MoE NKI kernels shipped in Neuron 2.27.0 ... torch.all_to_all_vdev_2d ... documented as roadmap as of Neuron 2.29" — version-specific claims, no Link to Neuron release notes. file:line CommunicationAndScaleOut.tsx:176-184
- Line 132-134 "SRD sprays packets across up to 64 paths" — quantitative claim. The trailing AWS EFA page Link (line 140-143) is generic; the 64-path number itself is not on that page. Consider citing the SRD paper or AWS HPC blog. file:line CommunicationAndScaleOut.tsx:132-134

**Other issues:**
- `CX7` (ConnectX-7 NIC) used without expansion at line 204. file:line CommunicationAndScaleOut.tsx:204
- "InfiniBand" used at line 87 without expansion — borderline, generally recognized but technically niche. Glossary does not include it.
- Trn2 UltraServer "3D Torus topology" claim at line 173 — ensure Trainium2 docs are cited (they are, in Section 16, but not here).

**Recommended corrections:**
1. Add `[CITE Neuron release notes 2.27 / 2.29]` Link to the all-to-all-v gap paragraph (lines 176-184).
2. Add inline citation Link to AWS Trn2 / NeuronLink page next to the "1.28 TB/s ... 256 GB/s ... 64 chips into a 3D Torus" claims (lines 169-174).
3. Either drop the per-instance bandwidth numbers in lines 147-150 or add a Link to the EC2 P5 / Trn2 instance type pages.
4. Expand `CX7` on first use: "EP=64 on H800 / CX7 (Mellanox ConnectX-7 NIC)".
5. Consider citing the AWS HPC SRD paper for the "64 paths" claim, or soften to "multiple paths".

---

## Section 26 — Isolation — NIE and MIG
**File:** /Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/IsolationNie.tsx

**Discipline:** all clear
- SectionShell wrapper used? no
- TLDR Alert present? no
- status badge? no
- "Panelist map" Container? no
- "Evaluation lens" Container? no

**Acronyms missing expansion:**
- `MiFID II` at line 47 — first appearance, no expansion. file:line IsolationNie.tsx:47
- `DORA` at line 47 — first appearance, no expansion. file:line IsolationNie.tsx:47
- `SEC Rule 17a-4` at line 47 — SEC not expanded anywhere; first appearance. file:line IsolationNie.tsx:47
- `CFTC` at line 47-48 — first appearance, no expansion. file:line IsolationNie.tsx:47-48
- `SOC 2` / `ISO 27001` at line 124 — niche compliance terms, not expanded. file:line IsolationNie.tsx:124
- `Isabelle/HOL` at line 104 — niche tool, no expansion (HOL = Higher-Order Logic). file:line IsolationNie.tsx:103-105
- `seL4` at line 105 — niche, but a proper noun reference. Acceptable.
- `TEE-I/O` at section header line 141 / line 179 — first occurrence is the section header; line 179 expands as "Trusted Execution Environment ... via TEE-I/O" which acceptably defines on first use.
- `PCI function` at line 151 — generally recognized. Pass.

**Citation gaps:**
- Line 102-109 "Roughly 250,000 lines of Isabelle proof script, checking in approximately 30 minutes on a standard laptop" — load-bearing quantitative claim with no inline citation. AWS Graviton5 Link is at lines 96-100 above but does not contain these specific numbers; verify that source actually carries them. file:line IsolationNie.tsx:102-108
- Line 19-25 (migRows table) — every B200/B300/H200/A100 MIG configuration with HBM capacity numbers is load-bearing. The NVIDIA MIG Link (line 153-156) is generic; does not break out per-SKU MIG slices. file:line IsolationNie.tsx:19-25
- Line 110-118 (Alert) — claims about formal proof properties ("for all possible execution traces ... cannot read or write another VM's memory") are sweeping. Need traceability to the AWS announcement or Isabelle artifact.
- Line 177-188 (TEE-I/O Alert) — "Encrypted GPU memory per MIG instance, inline-encrypted NVLink traffic between GPUs in the same confidential compute domain" — quantitative/feature claim with no inline citation. file:line IsolationNie.tsx:177-188

**Other issues:**
- Section refers to "Section 27" at line 55 for NEFF AOT — forward reference is fine but verify section numbering matches App.tsx.
- "first formally verified cloud hypervisor" claim at line 108 is competitive/marketing — should be attributed to AWS, not stated as fact.

**Recommended corrections:**
1. Expand acronyms on first use at line 47: "MiFID II (Markets in Financial Instruments Directive II), DORA (Digital Operational Resilience Act), SEC (Securities and Exchange Commission) Rule 17a-4, CFTC (Commodity Futures Trading Commission) Part 1.31".
2. Expand `Isabelle/HOL` on first use at line 104: "Isabelle/HOL (Higher-Order Logic interactive theorem prover)".
3. Add an inline Link near lines 102-108 to the AWS source that documents the "250,000 lines" / "30 minutes" claim, or remove if not citable.
4. Add inline Link to NVIDIA per-SKU MIG documentation for the Table at lines 19-25 (the existing MIG Link is too generic for per-GPU-SKU breakouts).
5. Soften "first formally verified cloud hypervisor" to "AWS positions NIE as the first formally verified cloud hypervisor" (already done at line 107-108) — leave as is.
6. Add Link for TEE-I/O claims (NVIDIA Confidential Computing page) at the Alert at lines 177-188.

---

## Section 27 — Determinism — NEFF AOT and GPU reproducibility
**File:** /Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/DeterminismAOT.tsx

**Discipline:** all clear
- SectionShell wrapper used? no
- TLDR Alert present? no
- status badge? no
- "Panelist map" Container? no
- "Evaluation lens" Container? no

**Acronyms missing expansion:**
- `CCCL` at lines 56, 143 — first occurrence in deep dive, no expansion. Glossary does not include it. file:line DeterminismAOT.tsx:56, 143
- `PRNG` at lines 57, 144, 237 — first occurrence, no expansion. Not in glossary. file:line DeterminismAOT.tsx:57, 144
- `SR 11-7` at line 20 (table) — first occurrence; the table self-expands "SR 11-7 (Federal Reserve)" but not the meaning. Glossary defines it as "Supervisory Letter 11-7" — should appear inline. file:line DeterminismAOT.tsx:20
- `RTS 6` at line 21 — niche EU rule, no expansion. file:line DeterminismAOT.tsx:21
- `HIPAA` at line 24 — common but not expanded. Borderline.
- `FINRA` at line 25 — first occurrence, no expansion (FINRA = Financial Industry Regulatory Authority per glossary). file:line DeterminismAOT.tsx:25
- `ICT` at line 23 — niche, no expansion (Information and Communication Technology). file:line DeterminismAOT.tsx:23
- `cuBLAS` / `cuDNN` at lines 56, 132, 141 — niche but generally recognized in this audience; not expanded. Borderline. Not in glossary.
- `CUDA deterministic mode` at line 140 — assumes CUDA recognized.

**Citation gaps:**
- Lines 130-138 "atomic reductions whose order depends on warp scheduling; cuBLAS / cuDNN kernel selection that may pick different kernels on different runs" — engineering claims about GPU non-determinism with no citation to NVIDIA's reproducibility documentation.
- Lines 140-148 "CCCL 3.1 collective determinism for multi-GPU runs" — version-specific claim with no Link to CCCL release notes / docs. file:line DeterminismAOT.tsx:143
- Lines 89-100 "schedule across the systolic array, where collective synchronization points fall ... no runtime kernel selection, no warp-scheduling decision, and no cache-eviction policy" — strong architectural claims; the AWS Neuron SDK Link at lines 109-113 is generic. Need a more specific link to NEFF / determinism documentation.
- Table rows 19-26 — regulatory framework claims are positioned as factual mappings; the disclaimer at line 190-194 helps but each row is still a load-bearing claim with no citation.

**Other issues:**
- The `regRows` table rows 19-26 mix tier-1 regulations (MiFID II, DORA, SEC Rule 17a-4) with derivative interpretation columns. Per project rules these should each be auditable to a regulator's primary document or a tier-1 legal/AWS compliance source.
- Line 107 says "no 'within tolerance' answer to give a regulator" — this is a defensible assertion but is editorial rather than a quantitative claim, so no citation strictly required.

**Recommended corrections:**
1. Expand `CCCL` on first use line 56: "CCCL (CUDA Core Compute Libraries) collective determinism".
2. Expand `PRNG` on first use line 57: "PRNG (Pseudo-Random Number Generator) seeding".
3. Add `CCCL` and `PRNG` to glossary in Section 29.
4. Expand `FINRA` and `ICT` on first appearance in the table (line 23, 25): "ICT (Information and Communication Technology)", "FINRA (Financial Industry Regulatory Authority) Rule 3110".
5. Expand `RTS 6` inline at line 21: "MiFID II / RTS 6 (Regulatory Technical Standard 6)".
6. Add a Link to NVIDIA's "Reproducibility" docs (https://docs.nvidia.com/deeplearning/cudnn/latest/reference/reproducibility.html or equivalent) near the GPU determinism Container at lines 129-148.
7. Add a more specific Neuron Link (NEFF / determinism page) at the Alert lines 102-114 rather than the generic readthedocs root.
8. Consider adding a footnote / Link per regulatory framework row, or add a single "Source: regulator filings; this is an architectural mapping not legal guidance" Link in the disclaimer at line 190-194 (already softened, sufficient if the disclaimer remains).

---

## Section 28 — Capital markets lens
**File:** /Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/CapitalMarketsLens.tsx

**Discipline:** all clear
- SectionShell wrapper used? no
- TLDR Alert present? no
- status badge? no
- "Panelist map" Container? no
- "Evaluation lens" Container? no

**Acronyms missing expansion:**
- `HFT` at lines 19, 23, 65, 165 — first appearance line 19. Per glossary "High-Frequency Trading". Not expanded inline. file:line CapitalMarketsLens.tsx:19
- `NIC` at line 95 — listed in CLAUDE rules as niche; not expanded inline. NIC = Network Interface Card. file:line CapitalMarketsLens.tsx:95
- `OS-bypass` at line 95-96, 209 — defined in glossary but not expanded inline. file:line CapitalMarketsLens.tsx:95, 209
- `DPDK` at line 96 — niche (Data Plane Development Kit), not expanded, not in glossary. file:line CapitalMarketsLens.tsx:96
- `OLAP` at line 174 — niche (Online Analytical Processing), not expanded, not in glossary. file:line CapitalMarketsLens.tsx:174
- `RAG` at line 280 — niche (Retrieval-Augmented Generation), not expanded, not in glossary. file:line CapitalMarketsLens.tsx:280
- `colo` at line 274 — finance jargon for colocation; understood by audience but flagging.
- `Solarflare` at line 95 — vendor name, acceptable.
- `LLC` at line 187 — already in glossary, expanded earlier sections.
- `MRDIMM`, `DDR5`, `HBM`, `SRAM`, `NPS4`, `SNC3` — all expanded in earlier sections.

**Citation gaps:**
- Line 168-170 "The link adds 200-400 ns of latency" (CXL framing trap) — load-bearing nanosecond claim with no inline citation. file:line CapitalMarketsLens.tsx:168-170
- Line 38 "~150 ns over intra-CCD" (failure modes table) — quantitative claim, no citation. The fact may be cited in earlier Section 10, but in this table it stands alone. file:line CapitalMarketsLens.tsx:38
- Line 36 "Microsecond-class outliers" (hypervisor scheduling jitter cost) — qualitative, OK.
- Line 70-77 "1 µs every time vs 800 ns most of the time and 5 µs once in a thousand" — illustrative example, not a load-bearing claim, OK.
- Lines 207-238 (the four-quadrant ColumnLayout) — every bullet references a Section number, which is acceptable cross-referencing. No inline citations needed since each claim is sourced in the referenced section.

**Other issues:**
- Section has zero external Cloudscape `Link` components. Every quantitative claim in this section relies on cross-references to other sections. That is defensible for an applied-lens section, but the CXL "200-400 ns" number at line 168 should still cite (Section 7 covered CXL, but the latency number is not in any other section either — verify).
- Line 209 mentions "M8azn 5 GHz" — this is a Carlos-specific shorthand. Confirm it appears in Section 10 with citation.
- `SLA` at line 21 (table row) — common, no expansion needed.
- "p99.9 / p50 ratio" definition at line 23 — fine, audience knows.

**Recommended corrections:**
1. Expand `HFT` on first use line 19: "Largely irrelevant for HFT (High-Frequency Trading)" or move to opening paragraph.
2. Expand `NIC`, `DPDK` on first use line 95-96: "NIC (Network Interface Card) arrival and OS-bypass send/receive ... DPDK (Data Plane Development Kit)".
3. Expand `OLAP` and `RAG` on first use (lines 174, 280).
4. Add `DPDK`, `OLAP`, `RAG` to glossary in Section 29.
5. Add an inline citation Link for the CXL "200-400 ns" claim at line 168-170 — either to the CXL Consortium spec or to a tier-1 measurement source. Cross-reference to Section 7 is fine but the number itself needs a primary source.
6. Confirm `~150 ns over intra-CCD` (line 38) is sourced in Section 10; if not, add inline citation here.

---

## Section 29 — Glossary and sources
**File:** /Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/GlossaryAndSources.tsx

**Discipline:** all clear (light check)
- Uses shared `Glossary` and `SourcesAppendix` components from `@tech-deep-dives/shared` — correct.
- Single `Container` with overview text + the two shared components. No SectionShell, TLDR, badge, panelist map, or evaluation lens.

**Light findings:**
- Glossary entries appear sensible and well-categorized (Memory architecture, Chiplet/topology, Compute/ML, Precision, LLM inference, Communication, Isolation/determinism, Capital markets, Compilers/tooling, Other).
- Sources are tier-graded (Tier 1, 2, 3) with grouping comments and access dates on every entry. Conforms to project standard.
- **Glossary gaps surfaced by other sections in this batch:**
  - `CCCL` — used in Section 27, missing from glossary.
  - `PRNG` — used in Section 27, missing from glossary.
  - `RTS 6` — used in Section 27 table, missing.
  - `ICT` — used in Section 27 table, missing.
  - `DPDK` — used in Section 28, missing.
  - `OLAP` — used in Section 28, missing.
  - `RAG` — used in Section 28, missing.
  - `CX7` — used in Section 25, missing.
  - `SEC` — Section 26 references "SEC Rule 17a-4", glossary has no SEC entry.
- `KV cache` entry uses `acronym: 'KV cache'` (not strictly an acronym) — cosmetic.
- All Tier 1 sources are NVIDIA / AWS / Intel / AMD / ARM / standards bodies — appropriate. No Tier 4 (excluded by policy as documented).
- Tier mixing rule: sources file groups by tier per comment markers — OK.

**Recommended corrections:**
1. Add the missing glossary entries listed above (`CCCL`, `PRNG`, `RTS 6`, `ICT`, `DPDK`, `OLAP`, `RAG`, `CX7`, `SEC`).
2. Optionally add: `InfiniBand`, `cuBLAS`, `cuDNN`, `Isabelle/HOL`, `seL4`, `SOC 2`, `ISO 27001`, `HIPAA`, `colo`, `SLA` if those appear unexpanded in other sections.
3. Consider adding tier-1 sources for: NVIDIA Confidential Computing / TEE-I/O page (referenced in Section 26 but no inline Link), CCCL release notes / docs (Section 27), AWS HPC SRD paper or blog (Section 25).

---

## Per-section summary

| Section | Discipline | Acronym fixes | Citation fixes | Other fixes |
|---|---|---|---|---|
| 25 Communication / scale-out | clear | 1 (CX7) | 4 (P5/Trn2 BW; CC-Cores/NeuronLink; Neuron versions; SRD 64-path) | InfiniBand expansion optional |
| 26 Isolation NIE/MIG | clear | 6 (MiFID II, DORA, SEC, CFTC, SOC 2/ISO 27001, Isabelle/HOL) | 4 (Isabelle proof size; per-SKU MIG; TEE-I/O features; sweeping NIE proof claims) | "first formally verified" attribution OK |
| 27 Determinism AOT | clear | 5 (CCCL, PRNG, FINRA, ICT, RTS 6) | 4 (GPU non-determinism sources; CCCL 3.1; NEFF specifics; regulatory rows) | Add CCCL/PRNG to glossary |
| 28 Capital markets lens | clear | 5 (HFT, NIC, DPDK, OLAP, RAG) | 2 (CXL 200-400 ns; ~150 ns intra-CCD if not in Sec 10) | No external Links at all in section |
| 29 Glossary and sources | clear (light) | n/a | n/a | Add 9 missing glossary entries; consider 3 missing tier-1 sources |
