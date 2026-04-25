# Section 1 Audit — Thesis and Framing

File: `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/sections/ThesisAndFraming.tsx`
Diagram: `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/silicon-memory-inference/src/components/TriangleDiagram.tsx`
Auditor date: 2026-04-24

## 1. Verdict
**Needs minor corrections.** The rewrite is structurally sound: clean-copy discipline is clean, the triangle framing is strong, and the outcome-first narrative is the right shape. Blockers are narrow — a few quantitative claims lack inline citations, and a handful of niche acronyms are used before expansion.

## 2. Depth vs EFA benchmark — 7.5/10
Concrete comparison of structural signal:

| Signal | EFA Architecture.tsx | EFA Overview.tsx | Section 1 (Thesis) |
|---|---|---|---|
| Lines | 344 | 112 | 201 |
| Top-level `Container`s | 5 | 3 | 4 |
| `ColumnLayout` blocks | 4 (2-col, 3-col) | 2 (3-col) | 1 (3-col, line 81) |
| `Alert` callouts | 3 | 0 | 2 (lines 116, 155) |
| `ExpandableSection` deep-dives | 3 | 0 | 0 |
| Diagrams | 2 (EFADataPath, NetworkTopology) | 0 | 1 (TriangleDiagram, line 80) |
| Comparative tables ("Why not X") | Yes (TCP, RDMA/RoCE columns) | No | No |

Section 1 has the right number of containers (4) and matches Overview's density, but it is noticeably lighter than Architecture's. The gap is not accidental — Section 1 is a framing section, so a detailed comparative table ("here is how each architecture answers the triangle") would duplicate work that Sections 8-16 are scoped to do. That's defensible. What is missing relative to the bar is at least one `ExpandableSection` — the EFA sections treat expandables as the mechanism for "deep dive for those who want it without breaking prose flow." The roofline arithmetic on lines 36-48 (H200 3,958 TFLOPS / 4.8 TB/s → 825 FLOPs/byte ridge) is exactly the kind of load-bearing derivation that would live well in an expandable titled "Ridge point derivation" — it's currently inline and a reader skimming cannot get past it without engaging. Depth is good; organization could lift one notch.

## 3. Diagrams
**Present and on-thesis.** `TriangleDiagram` renders instruction / data / shape nodes feeding a central functional unit with three labeled edges ("decoded + issued", "resident in register tier", "native layout"). It directly reinforces the prose on lines 72-79 ("three things must arrive at the unit at the same clock"). The visual identity of the three edges matches the three-column breakdown on lines 81-115, so the diagram and the prose cross-reference cleanly.

Rendering concerns: fixed 440px height (line 110) and `fitView` should be fine; no animation budget issues (edges `animated: true` but only 3 edges); `zoomOnScroll`/`panOnScroll`/`panOnDrag` all disabled, which matches the read-only intent. One minor concern: the shape node has both `sourcePosition: Position.Top` and `targetPosition: Position.Top` (lines 48-49) — this works but is unusual and worth a look during a visual pass. No fabricated data in the diagram itself.

## 4. Citations and sources
- **Tier 1 inline citations: 1.** NVIDIA H200 product page at line 39 with access date 2026-04-23. Correctly formatted via Cloudscape `Link external`.
- **Access dates: present** on the one citation that exists.
- **UNKNOWN flags: none used.** Not appropriate here — none of the claims genuinely need an UNKNOWN marker; they need citations.
- **Load-bearing numbers without a citation:**
  1. "decode with a modest batch size lives at 2-10 FLOPs per byte" (line 44) — this is a quantitative claim driving the whole thesis. No citation. The EFA standard would require either a Tier 1 vendor roofline reference or an explicit forward reference to Section 3 where the number is derived.
  2. "a branch mispredict on an out-of-order core costs 15-20 cycles of drained pipeline" (line 156-157) — vendor-specific number stated as general fact. Needs citation (Intel/AMD optimization manual) or should be softened to "typically tens of cycles."
  3. "AMX tile registers on Intel Xeon 6 hold 16 rows of up to 64 bytes" (line 108-109) — correct, but uncited; belongs to Intel Intrinsics Guide / Xeon 6 optimization manual.
  4. "Blackwell tcgen05 reads TMEM tiles in specific shapes" (line 109-110) — vague by design, but if cited would point to NVIDIA PTX ISA docs for `tcgen05.*`.

## 5. Clean-copy discipline checklist
| Artifact | Must be absent | Present? |
|---|---|---|
| TLDR block | yes | **No** — not present |
| Status badge (`StatusIndicator`) | yes | **No** — not imported, not used |
| "Panelist map" container | yes | **No** — not present |
| "Evaluation lens" container | yes | **No** — not present |
| `SectionShell` wrapper | yes | **No** — uses bare `SpaceBetween` root, matching EFA pattern |

All five clean-copy checks pass.

## 6. Acronym expansion
First-occurrence expansion audit (in sequential reading order). Rule: niche/domain acronyms must expand; common acronyms (CPU, GPU, RAM) are exempt.

| Acronym | First use | Expanded? | Notes |
|---|---|---|---|
| FLOPs | line 20 (header) | No | Borderline-common; left unexpanded is defensible but "floating-point operations" on first occurrence would be safer. |
| FP8 | line 26 | No | Niche. Should expand on first use. |
| TFLOPS | line 36 | No | Tera-FLOPS — if FLOPs is expanded, this is fine. |
| HBM3e | line 37 | No | Niche. First mention of HBM in the deep dive. Should expand to "High Bandwidth Memory 3e" or similar. |
| TB/s | line 37 | No | Common unit, exempt. |
| AMX | line 52 | No | Niche. Advanced Matrix Extensions. Must expand. |
| LPU | line 53 | No | Niche. Groq's Language Processing Unit. Must expand. |
| RDU | line 53 | No | Niche. SambaNova Reconfigurable Dataflow Unit. Must expand. |
| BTB | line 88 | No | Niche. Branch Target Buffer. Must expand. |
| SM | line 89 (host cores / SMs) | No | GPU Streaming Multiprocessor. Must expand. |
| NEFF | line 89-90 | No | Neuron Executable File Format. Must expand. |
| WSE-3 | line 90 | No | Wafer-Scale Engine 3. Must expand. |
| L1 / L2 / L3 | line 98, 139 | No | Cache levels; borderline-common for this audience — defensible. |
| SMEM / TMEM | line 99 | No | Niche. Shared Memory / Tensor Memory. Must expand. |
| SBUF / PSUM | line 99 | No | Niche. Trainium State Buffer / Partial Sum buffer. Must expand. |
| HBM | line 144 | No | High Bandwidth Memory. Must expand at first use (line 37 or 144). |
| HFT | line 149 | No | High-Frequency Trading. Must expand. |
| RAG | line 150 | **Yes** | Expanded inline as "Retrieval-Augmented Generation (RAG)". Good. |
| KV cache | line 188 | No | Key-Value cache. Niche. Must expand. |

Count: **13 niche acronyms used without first-occurrence expansion**, one correctly expanded (RAG).

## 7. Content philosophy
Outcome-first: **yes.** Lines 26-33 lead with "the first slide is almost always a FLOPs number... that number is nearly useless on its own" — thesis stated as a consequence, not as mechanism. The organizing question restated on lines 193-196 matches Carlos's outcome-first frame.

Skips basics: **yes.** Assumes the reader knows what a tensor core, a warp scheduler, and a systolic array are. Correct for the technical-lead audience.

Comparative framing: **yes, but shallow.** The three-column breakdown on lines 81-115 compares instruction delivery across host cores, GPU SMs, Trainium, and WSE-3 — concise and on-target. The shallow side: no side-by-side comparative table of the kind EFA Architecture uses for "Why not TCP / Why not RDMA-RoCE." Section 1 could support a two-column "traditional framing (peak FLOPs) / better framing (triangle alignment)" comparison, but absence is defensible for a framing section.

## 8. Issues found
1. **Missing citation, load-bearing.** `ThesisAndFraming.tsx:44` — "2-10 FLOPs per byte" has no Tier 1 citation and no forward reference to Section 3's derivation.
2. **Missing citation.** `ThesisAndFraming.tsx:156-157` — "15-20 cycles of drained pipeline" needs Intel/AMD optimization manual or explicit softening.
3. **Missing citation.** `ThesisAndFraming.tsx:108-109` — AMX tile register shape "16 rows of up to 64 bytes" needs Intel Xeon 6 documentation link.
4. **Acronym not expanded on first use.** `ThesisAndFraming.tsx:26` — FP8.
5. **Acronym not expanded on first use.** `ThesisAndFraming.tsx:37` — HBM3e (and HBM broadly).
6. **Acronym not expanded on first use.** `ThesisAndFraming.tsx:52` — AMX.
7. **Acronyms not expanded.** `ThesisAndFraming.tsx:53` — LPU, RDU.
8. **Acronyms not expanded.** `ThesisAndFraming.tsx:88-90` — BTB, SM, NEFF, WSE-3.
9. **Acronyms not expanded.** `ThesisAndFraming.tsx:99` — SMEM, TMEM, SBUF, PSUM.
10. **Acronym not expanded.** `ThesisAndFraming.tsx:149` — HFT.
11. **Acronym not expanded.** `ThesisAndFraming.tsx:188` — KV cache.
12. **Depth gap vs EFA Architecture.** No `ExpandableSection` used. The H200 ridge-point arithmetic on lines 36-48 is a strong candidate to move behind an expandable titled "Ridge point derivation" to match the EFA pattern of "prose stays light, expandables carry mechanism."
13. **Diagram node geometry.** `TriangleDiagram.tsx:48-49` — shape node has `sourcePosition` and `targetPosition` both set to `Position.Top`. Works but warrants a visual pass to confirm edge routing reads cleanly.

## 9. Recommended corrections (minimal fixes only)
- Add a Tier 1 citation (or explicit "derived in Section 3") for the "2-10 FLOPs per byte" claim.
- Add citation or soften "15-20 cycles of drained pipeline" and the AMX tile-register numbers.
- Expand the 13 flagged acronyms on first occurrence. These are one-token inline edits; no prose restructure needed.

The depth gap (issue 12) and the diagram geometry nit (issue 13) are **enhancements, not corrections** per the audit constraint. Flagging only.

## 10. One-line summary
Section 1 is structurally clean and on-thesis with a load-bearing diagram; gated on three uncited quantitative claims and thirteen missing first-occurrence acronym expansions.
