# Section 3 Audit — Roofline and Arithmetic Intensity

**Auditor:** automated audit agent
**Date:** 2026-04-24
**File audited:** `src/sections/RooflineAndArithmeticIntensity.tsx`
**Diagram component:** `src/components/RooflineChart.tsx`
**Benchmark:** EFA deep dive (`deep-dives/efa/src/sections/{Architecture,Overview}.tsx`)

---

## 1. Verdict

**Needs minor corrections.** The consolidation landed well: clean prose, no banned containers, SectionShell absent, a working diagram, correct ridge arithmetic, and a well-placed UNKNOWN flag for Blackwell. Residual gaps are narrow: several acronyms used without first-occurrence expansion, the Williams et al. paper citation lacks an access date, and two workload-class claims (GQA, speculative decoding, vLLM, etc.) ship without inline citations.

## 2. Depth vs EFA benchmark — 8/10

EFA Architecture.tsx sets the bar: layered prose, a diagram that reinforces the argument, two-column comparative framings ("Why not TCP?" / "Why not RDMA/RoCE?"), and ExpandableSection deep-dives with source citations down to specific files and verb names. Section 3 matches the shape — an opening definition, a diagram, a table with per-row sources, a prefill-vs-decode ColumnLayout, and a closing "what vendors compete on" frame. The prose density on lines 58-79 and the ridge-point consequence paragraph on lines 185-192 are the strongest parts and are comparable to EFA's SRD section.

Docked 2 points for: (a) no ExpandableSection-style deep dive analogue, where EFA pays off with mechanism details from source code — Section 3 could carry a similar payload for how NCCL/aws-ofi-nccl measure arithmetic intensity or how Nsight Compute reports roofline; (b) forward references to Sections 5, 14, 16, 20, 21 are used as escape valves for depth the reader might want right here.

## 3. Diagrams — RooflineChart SVG

Render: passes. Valid React SVG with explicit viewBox (`0 0 680 340`), aria-label (`RooflineChart.tsx:38`), and a visible border. No React Flow, no runtime data fetch — pure schematic.

Pedagogy: the two-line roofline (memory-bound slope + compute-bound ceiling) is the canonical shape and reinforces the prose exactly. Ridge-point is labeled. Workload markers at schematic x-positions 6, 20, 55, 78 (`RooflineChart.tsx:14-19`) are sensible — decode-batch-1 far left, dense GEMM hard right, prefill near the ridge.

Concern: the comment on `RooflineChart.tsx:28` says ridgeX=65 approximates H200 BF16 ~412 FLOPs/byte, but the x-axis is purely schematic (0-100 unitless) and there are no numeric tick marks. A technical-lead reader may want at least one anchored x-value (e.g., "~412 here") to tie the schematic to the table. Not a blocker.

Minor: the y-axis label reads "Achievable TFLOPS" but no TFLOPS values are plotted — the schematic uses the y-axis only to show the slope/ceiling shape. Label is defensible but could say "Achievable TFLOPS (schematic)".

## 4. Citations and sources

- **Tier 1 inline citations:** 3 vendor URLs inside the ridge-points table (`RooflineAndArithmeticIntensity.tsx:26, 33, 40`) — nvidia.com/en-us/data-center/h100 and /h200. All Tier 1 by the project's own tier definitions.
- **Access date:** one aggregate date on line 139: "All vendor-cited figures accessed 2026-04-23." Acceptable style and matches sources.md's sourcing policy date.
- **Williams/Waterman/Patterson paper citation** (`RooflineAndArithmeticIntensity.tsx:61-64`): linked to dl.acm.org DOI, but no access date. This is the only non-Tier-1 source in the section and should be labeled Tier 3 per sources.md §Tier definitions.
- **UNKNOWN flag** (`RooflineAndArithmeticIntensity.tsx:140-146`): correctly used for B200/B300 per-GPU HBM bandwidth. Specific, actionable, points at the resolution path (read the Blackwell datasheet). Matches the sources.md UNKNOWN register discipline.
- **Uncited claims** in the moving-along-x-axis section (lines 207-234): "vLLM, TensorRT-LLM, SGLang, Neuron-Distributed … spend so much code on continuous batching" (line 211), "FlashAttention … fuses the attention matmul, softmax, and second matmul" (line 221-223), "NVFP4 (E2M1) and MXFP8" (line 231) — all load-bearing technical claims with no inline citation, deferred to Sections 14/16/20/21. Per CLAUDE.md §Fact-Checking and §Anti-pattern, these need citations here, not just in the target sections.

## 5. Numeric accuracy

Verified by division:

- H100 SXM FP8 sparse: 3,958e12 / 3.35e12 = **1,181.49** → claim "≈ 1,181" correct.
- H200 SXM FP8 sparse: 3,958e12 / 4.8e12 = **824.58** → claim "≈ 825" correct.
- H200 SXM BF16: 1,979e12 / 4.8e12 = **412.29** → claim "≈ 412" correct.

All three ridge points are arithmetically sound. The "~2 FLOPs/byte" decode claim on line 179 matches the standard derivation (2 FLOPs per parameter per token × 1 byte per FP8 param, or scaled appropriately for FP16). The "three orders of magnitude under H200's BF16 ridge of ≈ 412" phrasing on line 180 is accurate (412/2 ≈ 206× = ~2.3 orders, so "three orders of magnitude" is slightly loose — **2+ orders** would be more precise).

## 6. Clean-copy discipline checklist

| Item | Present? |
|---|---|
| TLDR block | **No** (absent) |
| Status badge (StatusIndicator, etc.) | **No** (absent — note: EFA Overview.tsx uses StatusIndicator, but the rewrite spec forbids it here) |
| Panelist-map container | **No** (absent) |
| Evaluation-lens container | **No** (absent) |
| SectionShell wrapper | **No** (absent — uses `<SpaceBetween size="l">` + bare `<Container>` like EFA Architecture.tsx) |

All five banned patterns absent. Pass.

## 7. Acronym expansion

CLAUDE.md §Acronym Standard requires first-occurrence expansion for niche acronyms. Issues in reading order:

- **GEMM** (line 96) — General Matrix Multiply — not expanded on first use.
- **KV cache** (line 164, 179, 188, 214) — Key-Value cache — not expanded on first use.
- **TPS** (line 186) — tokens per second — not expanded; though it's contextually obvious, CLAUDE.md standard still applies.
- **GQA** (line 189) — abbreviated there as "grouped-query attention" which counts as expansion-in-place; fine.
- **SMEM / TMEM / SBUF** (line 220) — Shared Memory / Tensor Memory / State Buffer — not expanded.
- **HBM3 / HBM3e / HBM4** (line 253) — High-Bandwidth Memory — not expanded on first use. (HBM appears earlier on line 24 in the table also unexpanded.)
- **NVFP4 (E2M1) / MXFP8** (line 231) — parenthetical "(E2M1)" partially expands NVFP4; MXFP8 is unexpanded.
- **CUTLASS / CuTe / Triton / NKI** (lines 225-226) — NKI is expanded elsewhere in the project's sources.md but this section is a first occurrence for CUTLASS, CuTe, and NKI.

Roofline, FLOPs, FP8, FP16, BF16, FP4, DRAM, SXM — all acceptable as either common or sufficiently in-context.

## 8. Content philosophy

- **Outcome-first:** Strong. Section opens with the business-question framing ("is this workload compute-bound or memory-bound on this silicon") and the closing container reframes the ridge point as what vendors actually compete on. Matches the backward-from-outcomes principle.
- **Technical-lead depth:** Appropriate. The prefill-vs-decode split, the two-order-of-magnitude quantification, and the ridge-point math by precision are all at the level a WW SA technical lead would want.
- **Comparative:** Present. Prefill vs decode (two columns), H100 vs H200 vs H200-BF16 in the table, and the closing paragraph contrasts HBM-based silicon with Cerebras and compute-in-memory.

## 9. Issues found

1. **`RooflineAndArithmeticIntensity.tsx:61-64`** — Williams/Waterman/Patterson paper linked without an access date or tier label. Should carry "(Tier 3, accessed 2026-04-23)" or equivalent per sources.md.
2. **`RooflineAndArithmeticIntensity.tsx:180`** — "three orders of magnitude under H200's BF16 ridge of ≈ 412" is slightly loose; 412/2 ≈ 206× ≈ 2.3 orders. Say "more than two orders of magnitude" for arithmetic honesty.
3. **`RooflineAndArithmeticIntensity.tsx:211`** — vLLM/TensorRT-LLM/SGLang/Neuron-Distributed name-dropped without inline citation. Needs at minimum one Tier 1 link (vLLM GitHub, TensorRT-LLM docs) or defer the list until the cited Section 20.
4. **`RooflineAndArithmeticIntensity.tsx:221-226`** — FlashAttention fusion mechanism claim + CUTLASS/CuTe/Triton/NKI mentions without inline citations. Add the FlashAttention-2/3 paper or the CUTLASS repo link.
5. **`RooflineAndArithmeticIntensity.tsx:231`** — "NVFP4 (E2M1) and MXFP8" first occurrence, no citation. Should link to the NVIDIA Blackwell architecture whitepaper or OCP MX specification.
6. **Acronym expansions missing**: GEMM (line 96), KV cache (line 164), TPS (line 186), SMEM/TMEM/SBUF (line 220), HBM (first use, line 24 or earlier), CUTLASS/CuTe (line 225).
7. **`RooflineChart.tsx:28, 181`** — y-axis label "Achievable TFLOPS" implies plotted values that aren't there. Consider "(schematic)" suffix, or remove the y-axis entirely since only the shape matters.
8. **Depth gap vs EFA benchmark** — no ExpandableSection-style mechanism deep-dive. Optional but would close the last 2 points on the 10-scale.

## 10. Recommended corrections (minimal)

- Add access date + Tier 3 label to the Williams paper link (issue 1).
- Change "three orders of magnitude" to "more than two orders of magnitude" (issue 2).
- Add inline Tier 1 citations for the vLLM/TensorRT-LLM/FlashAttention/NVFP4 claims, or prune the list and defer cleanly to the target sections (issues 3, 4, 5).
- Expand the six identified acronyms on first occurrence (issue 6).
- Append "(schematic)" to the y-axis label (issue 7).

Issue 8 is an enhancement, not a correction — backlog per CLAUDE.md §Iteration Flywheel.

## 11. One-line summary

Section 3 is structurally clean, numerically correct, and near EFA-quality; needs acronym expansions, three missing citations in the "moving along the x-axis" container, and an access date on the Williams paper.
