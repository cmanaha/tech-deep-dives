# Section 2 Audit — The Heterogeneity Fact

**File:** `deep-dives/silicon-memory-inference/src/sections/HeterogeneityFact.tsx` (213 lines)
**Auditor pass:** 2026-04-24
**Benchmark:** `deep-dives/efa/src/sections/Architecture.tsx` and `Overview.tsx`

## 1. Verdict

**Needs minor corrections.** The consolidation landed: no forbidden containers, clean prose, strong outcome-first framing, and a genuinely comparative 5-row architecture-bets table that differentiates this section from the EFA benchmark in a useful way. The primary gap is citation coverage — only one inline link exists for the whole section despite multiple load-bearing quantitative/technical claims. Acronym hygiene also has two first-use lapses.

## 2. Depth vs EFA benchmark — 7.5/10

Concrete measurements:

| Metric | Section 2 | EFA Architecture.tsx (first 250 lines) |
|---|---|---|
| Top-level Containers | 3 | 4 |
| `<Box variant="p">` paragraphs | 7 | 9 |
| Comparative tables | 1 (5 rows × 5 cols) | 0 (uses ColumnLayout-of-lists instead) |
| ColumnLayout text-grids | 1 (4 cells) | 3 |
| ExpandableSections | 1 | 2 |
| Diagrams embedded | 0 | 2 (EFADataPathDiagram, NetworkTopologyDiagram) |
| Inline external `<Link>` citations | 1 | 1 (in first 250 lines; more follow) |

Justification for 7.5: Section 2 matches EFA on prose density, container structure, and expandable depth; the 5-column architecture-bets table is denser and more load-bearing than anything in the EFA Architecture section. It falls short on (a) diagram presence and (b) inline citation density. EFA Overview.tsx front-loads headline numbers with citations on first contact (3,200 Gbps, 100μs, 15μs); Section 2 defers all citations to downstream vendor sections, which works structurally but leaves this section lighter on verifiable anchors than the benchmark.

## 3. Diagrams — real gap, modest severity

**Call: yes, one diagram is warranted — but not a repeat of TriangleDiagram.** Section 1 (`ThesisAndFraming.tsx:80`) already uses `TriangleDiagram`; repeating it here would be redundant and was correctly avoided.

What is missing: a **single visual that collapses the architecture-bets table into a 2D positioning matrix** — axes like "instruction binding time (runtime ↔ compile-time)" × "data locality (off-chip DRAM ↔ on-chip SRAM ↔ in-memory)". Five labeled points (host core, NVIDIA SM, Trainium NeuronCore, WSE-3, HBM-PIM) make the bet-comparison thesis visible at a glance. This is the EFA-quality move: the table gives the rows, the diagram gives the shape.

A stall-cost timeline is the weaker alternative — it illustrates one subordinate point (stall semantics) rather than the section's central claim (architectures bet differently on instruction/data/shape).

**Severity:** Not a blocker. The table + prose carries the argument. But the EFA benchmark has two diagrams in its Architecture section; zero here is a visible gap.

## 4. Citations and sources

- **Inline citations in section:** 1 (`HeterogeneityFact.tsx:120-123` — AWS Neuron SDK docs, access date 2026-04-23, Tier 1)
- **Access dates present:** Yes, on the one citation
- **UNKNOWN flags:** None used — none obviously required, since the section deliberately defers quantitative claims to sections 8-19 (stated explicitly at line 116-124)
- **Load-bearing claims without citation:**
  1. `HeterogeneityFact.tsx:85` — "Trn2 UltraServer (Trainium2 with 64-chip coherent domain)" — the "64-chip coherent domain" number is load-bearing and specific; needs Tier 1 AWS citation even if repeated later
  2. `HeterogeneityFact.tsx:24` — "SVE2 (Arm), AVX-512, AMX tiles (Xeon 6)" — architecture-identifying specifics, no citation
  3. `HeterogeneityFact.tsx:30` — "tcgen05 / wgmma" instruction names — Hopper/Blackwell-specific, uncited
  4. `HeterogeneityFact.tsx:154` — "~15-20 cycles to drain + re-steer the pipeline" — quantitative, uncited (this is a textbook number but still load-bearing under project rules)

The section's own disclaimer at lines 116-124 ("the per-vendor sections (8-19) carry the Tier 1 inline citations and verified numbers") is an acceptable pattern for the table specifically, but does not cover prose claims outside the table (items 1, 3, 4 above).

## 5. Clean-copy discipline checklist

| Item | Present? | Evidence |
|---|---|---|
| TLDR block | **No** | Grep for `TLDR\|TL;DR` returned zero matches |
| Status badge | **No** | No `StatusIndicator` import or usage |
| Panelist-map container | **No** | No such string/pattern in file |
| Evaluation-lens container | **No** | No such string/pattern in file |
| SectionShell usage | **No** | `SectionShell` exists at `src/components/SectionShell.tsx` but is not imported here — confirmed via import block lines 1-9 |

All five clean-copy rules pass.

## 6. Acronym expansion

First-occurrence violations:

1. **`HeterogeneityFact.tsx:23`** — "L1 → L2 → L3" — cache-level acronyms, arguably common, but the project rule calls out niche/domain-specific expansion and the rest of the doc is strict; marginal.
2. **`HeterogeneityFact.tsx:24`** — "SVE2 (Arm), AVX-512, AMX tiles" — none of SVE2 (Scalable Vector Extension 2), AVX-512 (Advanced Vector Extensions 512-bit), or AMX (Advanced Matrix Extensions) are expanded. AMX and SVE2 are explicitly the kind of niche ISA acronyms the project rule requires expanding.
3. **`HeterogeneityFact.tsx:30`** — "SMEM / TMEM / L2 / HBM" — SMEM (Shared Memory), TMEM (Tensor Memory), HBM (High Bandwidth Memory) unexpanded on first use. HBM is critical throughout the deep dive.
4. **`HeterogeneityFact.tsx:30`** — "CUTLASS, Triton, or Inductor" — library names, not acronyms; no violation but CUTLASS is actually an acronym (CUDA Templates for Linear Algebra Subroutines) and the project rule is strict.
5. **`HeterogeneityFact.tsx:31`** — "FP4 - FP64" — floating-point precision shorthand, borderline. "CuTe layout" unexpanded.
6. **`HeterogeneityFact.tsx:36`** — "NEFF descriptor" — NEFF (Neuron Executable File Format) not expanded on first use; it recurs at lines 39, 119, 171, 173, 197.
7. **`HeterogeneityFact.tsx:42`** — "WSE-3 wafer" — WSE (Wafer-Scale Engine) not expanded.
8. **`HeterogeneityFact.tsx:49`** — "HBM-PIM / HyperCIM" — PIM (Processing-in-Memory), CIM (Compute-in-Memory) not expanded.
9. **`HeterogeneityFact.tsx:84`** — "P5 (Hopper), P6 (Blackwell)" — instance family codes fine; OK.
10. **`HeterogeneityFact.tsx:145`** — "CUDA" — exempt as common.
11. **`HeterogeneityFact.tsx:155`** — "ROB, RAS, BTB" — ROB (Reorder Buffer), RAS (Return Address Stack), BTB (Branch Target Buffer); niche microarchitecture, must expand.
12. **`HeterogeneityFact.tsx:169`** — "systolic array" — not an acronym. OK.
13. **`HeterogeneityFact.tsx:178`** — "WSE-3" second occurrence; tied to item 7.

Most consequential: NEFF, HBM, WSE, PIM, CIM, AMX, SVE2, ROB/RAS/BTB.

## 7. Content philosophy

- **Outcome-first:** Strong. The section opens with "the problem with 'chip' as a noun" and immediately pivots to "the question is not 'which FLOPs budget wins,' it is 'which bet about the triangle matches my workload'" (lines 87-90). That is textbook outcome-first framing.
- **Skips basics:** Yes. No introduction of what a GPU is or what inference is. Assumes the reader knows speculation, OoO, warps, SMEM, tensor cores, systolic arrays. Consistent with technical-lead audience.
- **Comparative framing:** Strong. The entire section is organized as a comparison; the table is explicitly framed as "a bet comparison, not a feature comparison" (line 99-100).

## 8. Issues found

1. **`HeterogeneityFact.tsx:36`** — NEFF used without expansion on first occurrence; recurs 4× in-section.
2. **`HeterogeneityFact.tsx:24`** — AMX and SVE2 unexpanded on first use; both are niche ISA extensions.
3. **`HeterogeneityFact.tsx:30`** — HBM unexpanded on first use (critical cross-section acronym).
4. **`HeterogeneityFact.tsx:42, 49`** — WSE, PIM, CIM unexpanded.
5. **`HeterogeneityFact.tsx:155`** — ROB, RAS, BTB unexpanded inside the stall-semantics ColumnLayout.
6. **`HeterogeneityFact.tsx:85`** — "64-chip coherent domain" is a specific, load-bearing number with no inline citation and no UNKNOWN flag.
7. **`HeterogeneityFact.tsx:154`** — "~15-20 cycles" mispredict cost presented as fact without citation.
8. **Section-level:** No diagram present. Section 1 uses TriangleDiagram; a 2D architecture-bets positioning plot would add EFA-grade visual anchoring without duplicating Section 1.
9. **`HeterogeneityFact.tsx:116-124`** — The "see sections 8-19" disclaimer covers the table but not the prose. Readers hitting the mispredict/cache-miss numbers in the ColumnLayout (lines 153-158) have no pointer.

## 9. Recommended corrections (minimal, not enhancements)

1. Expand acronyms on first occurrence in this section: NEFF (Neuron Executable File Format), HBM (High Bandwidth Memory), WSE (Wafer-Scale Engine), PIM (Processing-in-Memory), CIM (Compute-in-Memory), AMX (Advanced Matrix Extensions), SVE2 (Scalable Vector Extension 2), ROB/RAS/BTB. Pure in-place edits; no restructuring.
2. Add one inline Tier 1 citation for the "64-chip coherent domain" Trn2 claim at line 85 (AWS Trainium2 UltraServer product page or Neuron docs), with access date.
3. Add an inline citation or tier-graded source for the "~15-20 cycles" mispredict number at line 154 (Intel Optimization Reference Manual or AMD SOG), or flag it `[SECONDARY]` / soften to "tens of cycles" if no Tier 1 available.
4. Broaden the disclaimer at lines 116-124 to note that numeric claims in the stall-semantics grid (lines 149-186) also derive from per-vendor sections, OR add a single sentence citation line under the ColumnLayout.

Not recommended here (would be enhancements): adding the positioning-matrix diagram. Call it out in the consolidated report as a deferred enhancement, not a correction.

## 10. One-line summary

Clean structure, strong outcome-first framing, and a load-bearing architecture-bets table land the consolidation — but acronym expansion lapses (NEFF, HBM, WSE, PIM, CIM, AMX, SVE2, ROB/RAS/BTB) and two uncited quantitative claims (64-chip Trn2 domain, 15-20 cycle mispredict) need minor fixes before this section matches the EFA citation bar.
