# Section 4 — Memory Hierarchy Primer — Audit

**Files audited:**
- `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/MemoryHierarchyPrimer.tsx`
- `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/components/MemoryHierarchyTower.tsx`

## 1. Verdict

**Needs minor corrections.** The section is structurally sound, follows the EFA pattern, and has mostly accurate numbers, but it has a citation-discipline gap: the tower diagram numbers and the per-tier SMEM/TMEM numbers in the prose rely on deferred citations ("Section 5 carries...", "Section 12 carries...") rather than carrying inline Tier 1 links at the point of claim. Two inline links exist but cover only a subset of the figures. EFA's pattern is to cite at the point of claim.

## 2. Depth vs EFA benchmark — 7.5/10

Concrete justification:
- EFA Architecture uses a problem-answer opener (lines 23-37 of `Architecture.tsx`), multi-column comparison grids, an expandable deep-dive, and explicit gotcha alerts. Section 4 mirrors this well: outcome-first opener (lines 79-94), tower diagram, 3-column scratchpad grid (lines 168-194), caches-vs-scratchpads 2-column grid (lines 216-238), bandwidth-wall alert (lines 261-269), and a generation-regression expandable (lines 283-303).
- Depth is slightly lighter than EFA. EFA's Architecture section carries source-of-truth links inline (e.g. `rxr_pkt_post_ctrl`, `efa_verbs.c`). Section 4 defers most specific per-silicon numbers to later sections rather than quoting Tier 1 at the point of mention. A primer can reasonably defer, but the EFA bar is heavier on inline evidence.
- Comparative framing across three architecture families is present and genuinely cross-cutting (table at lines 136-146, scratchpad triptych at lines 168-194).

## 3. Diagrams — MemoryHierarchyTower

- Renders as a pure SVG with explicit `width={720}`, `viewBox`, and `overflowX: 'auto'` wrapper (lines 74-85 of `MemoryHierarchyTower.tsx`) — will scroll horizontally on mobile rather than clip or distort.
- Pyramid effect achieved via `tierW = 660 - i * 60` (line 90); for 7 tiers the narrowest row is 240 px wide — still wide enough to render the three-field label.
- Accessibility: `role="img"` and a descriptive `aria-label` are present (lines 83-84).
- Reinforces prose: tier labels match the 7-tier framing in the opener and the comparison table. The color bands (blue → green → orange → red) correctly group register/scratchpad, caches, DRAM, and disaggregated.
- Mobile caption readability: font sizes are 13 (label) and 11 (metrics) at a fixed 720 px viewBox. At a 375 px viewport scaled to fit, 11 px renders as ~5-6 px — below comfortable reading. But horizontal scroll is enabled, so on mobile the user scrolls rather than zooms. Acceptable, not ideal.

## 4. Citations and sources

**Inline Tier 1 citations in the section: 2.**
1. NVIDIA H200 product page, access dated 2026-04-23 (lines 113-116).
2. Intel Xeon 6 product brief, access dated 2026-04-23 (lines 117-124).

**Cited numbers:** H100 / H200 L2 capacity (50 MB) and Xeon 6 per-core private L2 (2 MB) are covered by the above two links.

**Uncited load-bearing numbers in the prose:**
- Hopper SMEM ≈ 228 KB per SM (line 30, line 173) — should cite NVIDIA H100 whitepaper or CUDA C Programming Guide (compute capability 9.0 table).
- Blackwell TMEM = 256 KB per SM (line 30, line 180) — should cite NVIDIA Blackwell architecture whitepaper or PTX ISA `tcgen05` docs.
- Register file 256 KB per SM (line 24) — should cite CUDA C Programming Guide.
- "~4-8 TB/s of HBM bandwidth with thousands of TFLOPs" (lines 254-255) — generic range, defensible as primer framing, but EFA-grade would cite one concrete example.

**Uncited numbers in the tower diagram (`MemoryHierarchyTower.tsx`) that should have citations:**
- Line 22-27: scratchpad "10s of TB/s / engine, 100s of KB, ~a few ns"
- Line 30-35: L1 "~100s GB/s / core, ~48-64 KB, 4-5 cycles"
- Line 38-43: L2 "TB/s aggregate, MB/core or chip-wide, ~12-20 cycles"
- Line 46-51: LLC/L3 "100s GB/s, 100-500 MB, ~30-100 cycles"
- Line 54-59: HBM / main DRAM "3-5 TB/s (HBM) / 400 GB/s-class (DDR), ~200-400 cycles"
- Line 62-67: Disaggregated "10s-100s GB/s, TBs, ~1-3 μs"

These are representative generics, and the section caption (lines 110-125) explicitly deflects to later sections. The caption fix is defensible for the tower-wide ranges but not for the three specific per-silicon numbers quoted in the scratchpad column (SMEM 228 KB, TMEM 256 KB, register file 256 KB) — those should be cited inline.

**Sources appendix check:** `sources.md` is still a scaffold (lines 1-70) — does not yet contain the NVIDIA H100/Blackwell whitepapers or CUDA Programming Guide entries. Section 4's deferrals assume those appendix entries will materialize. Flag for the section consolidation owner.

## 5. Clean-copy discipline checklist

| Element | Present? |
|---|---|
| TLDR block | No |
| Status badge (`StatusIndicator`) | No |
| "Panelist map" container | No |
| "Evaluation lens" container | No |
| `SectionShell` wrapper | No |

All five: clean.

## 6. Acronym expansion

Niche acronyms used without first-occurrence expansion:
- **SMEM** (line 30, line 170) — never expanded. Should be "SMEM (shared memory)".
- **TMEM** (line 30, line 178) — never expanded. Should be "TMEM (tensor memory)".
- **SBUF** (line 32, line 187) — parenthetical "(state buffer)" appears in the table at line 32, but the scratchpad ColumnLayout at line 187 reuses SBUF without restating. Acceptable since the table precedes the columns in reading order, but it is borderline.
- **PSUM** (line 32, line 188) — same: "(partial sum)" is in the table but not restated in the h3 column. Acceptable.
- **LLC** (line 46 row label, line 47) — never expanded. Should be "LLC (last-level cache)".
- **TLB** — not used in this section. OK.
- **tcgen05** (line 166, line 181) — PTX instruction name, not an acronym per se, but a reader would benefit from a one-line gloss ("Blackwell's tensor-core generation-5 issue instruction").
- **TSV / 2.5D** (line 258: "through-silicon vias") — expanded in prose. Good.
- **MRDIMM, LPDDR5X, CXL, HBM3e, NVLink** — acceptable; CXL and HBM are expanded or used in context, and Section 5/6 carries the expansions.

## 7. Content philosophy

- **Outcome-first:** Yes. Lines 79-94 open with "why a primer" and "what is new about it" — frames the tier map before enumerating it. The bandwidth-wall section (lines 242-269) is also outcome-framed.
- **Technical-lead depth:** Yes. Caches-vs-scratchpads contrast (lines 208-238) is sharp: "cache miss invisible to compiler; scratchpad miss cannot happen at runtime — the compiler already decided." That is the kind of load-bearing distinction a senior reader needs and junior material omits.
- **Comparative across three families:** Yes, and this is the section's strongest attribute. The 7-row comparison table (lines 20-63) aligns host CPU, NVIDIA GPU, and AWS Trainium at each tier. The scratchpad triptych (lines 168-194) repeats the pattern.

## 8. Issues found

1. `MemoryHierarchyPrimer.tsx:30` — SMEM used without expansion on first occurrence. Add "(shared memory)".
2. `MemoryHierarchyPrimer.tsx:30` — TMEM used without expansion on first occurrence. Add "(tensor memory)".
3. `MemoryHierarchyPrimer.tsx:46-47` — LLC used without expansion. Add "(last-level cache)".
4. `MemoryHierarchyPrimer.tsx:173` — "Hopper SMEM ... roughly 228 KB" carries no inline Tier 1 citation. NVIDIA H100 whitepaper / CUDA C Programming Guide compute-capability table is the Tier 1 source.
5. `MemoryHierarchyPrimer.tsx:180` — "Blackwell TMEM ... 256 KB per SM" carries no inline Tier 1 citation. NVIDIA Blackwell architecture whitepaper / PTX ISA `tcgen05` docs.
6. `MemoryHierarchyPrimer.tsx:24` — "256 KB register file per SM" in the comparison table is uncited. CUDA C Programming Guide is the Tier 1 source.
7. `MemoryHierarchyPrimer.tsx:254-255` — "~4-8 TB/s of HBM bandwidth" is a range without a concrete anchor. At least one instance (e.g. H200 4.8 TB/s) with inline Tier 1 would match the EFA bar.
8. `MemoryHierarchyPrimer.tsx:112-113` — the caption deflects all tower numbers to later sections; acceptable for the tower's generic ranges but not for the three specific per-silicon numbers quoted elsewhere in the section.
9. `sources.md:1-70` — file is still scaffold. Section 4's deferrals ("Section 5 carries...", "Section 12 carries...") assume appendix entries that don't yet exist. Not a Section 4 bug per se, but tracking.
10. `MemoryHierarchyTower.tsx:107, 115` — mobile readability: 13/11 px fonts within a 720 px viewBox render small on phone viewports. Horizontal scroll mitigates but does not eliminate. Not a correction, a known trade-off.

Numeric sanity check: Hopper SMEM 228 KB/SM, Blackwell TMEM 256 KB/SM, Xeon 6 2 MB per-core L2, H100/H200 50 MB L2 — all four match public NVIDIA and Intel Tier 1 documentation. No fabricated numbers detected.

## 9. Recommended corrections (not enhancements)

1. Expand SMEM, TMEM, and LLC on first occurrence (issues 1-3).
2. Add inline Tier 1 citation links for the three specific per-silicon numbers cited in the scratchpad column and comparison table: Hopper SMEM 228 KB (CUDA C Programming Guide), Blackwell TMEM 256 KB (Blackwell whitepaper or PTX ISA), and the 256 KB register file per SM (CUDA C Programming Guide). Access dates 2026-04-23 to match existing pattern (issues 4-6).
3. Leave the tower diagram's generic ranges as-is under the current caption pattern (issue 8 partial). They are primer-level ranges and the caption already frames them as representative.

Do not add new content. Do not restructure. Do not touch the H100/H200 or Xeon 6 links that are already correct.

## 10. One-line summary

Structurally clean, numbers sanity-check, clean-copy discipline perfect; needs 3 acronym expansions and 3 inline Tier 1 citations to meet the EFA bar.
