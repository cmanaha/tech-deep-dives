# Visual Audit — Sections 1-5

Audit run 2026-04-25 against `http://localhost:4173/` (Vite preview build).
Viewport pass 1: 1440x900 desktop (effective 1152 CSS px due to DPR 1.25).
Viewport pass 2: 390x844 mobile (effective 312 CSS px).

Screenshots: `screenshots/sec{N}-{name}-{desktop|mobile}.png`.

---

## Section 1 — Thesis and Framing

### Layout audit (desktop)
- Two narrative cards before the diagram render cleanly; no overflow.
- Three-column "Instruction delivery / Data delivery / Shape fit" grid below the diagram fits within the content column.

### Layout audit (mobile)
- The TriangleDiagram container (`TriangleDiagram.tsx:110`) is fixed at `height: 440px` and `width: 100%`. At parent width 218 px, React Flow nodes (each ~150 px wide) end up positioned outside the visible area — the **Instruction node renders at x = -32 px (clipped at the left edge)** and the **Data node renders at x = 248 with right = 333 px while the container ends at 260 px** (fully off-screen right). `fitView` is set but does not refit on container resize.
- Three-column grid ("Instruction delivery / Data delivery / Shape fit") collapses to a single column properly.

### Diagram audit
**Diagram name:** TriangleDiagram (React Flow) — `src/components/TriangleDiagram.tsx`

**Current visual structure (rebuild brief):**
A 757x440 React-Flow canvas inside a 1px-bordered card. Three colored nodes form a triangle around a dark central node:
- Instruction (top-left, blue border `#0972d3`, fill `#f2f8fd`).
- Data (top-right, green border `#037f0c`, fill `#ecf7ec`).
- Shape (bottom, orange border `#ec7211`, fill `#fdf3ec`).
- Functional Unit (center, dark fill `#232f3e`, white text).
Three dashed edges connect the source nodes to the central Functional Unit, each carrying a small label-on-rect: "decoded + issued" (blue), "resident in register tier" (green), "native layout" (orange). React Flow's `fitView` runs at mount with `padding: 0.2`. Edge type is the default elbow (`smoothstep`).

**Issues found (severity-ranked):**
- **HIGH** — Mobile: nodes position outside the container (Instruction left = -32, Data right = 333 vs. container 260). The diagram is unusable below ~700 px container width because node sizes are fixed in flow units, and `fitView` is not re-fired on viewport resize.
- **MEDIUM** — Desktop: the green edge "resident in register tier" runs as an apparent horizontal line **between** the Instruction node and the Data node (because both sit on the same y-line and the elbow router's first segment is straight). A reader scanning the image reads it as Instruction → Data, when the edge is actually Data → Functional Unit. The label sits on the leftmost segment, reinforcing the wrong reading.
- **MEDIUM** — Desktop: "decoded + issued" label and its white background rect sit at y ≈ 957 directly under the Instruction node's bottom edge (y ≈ 938) and on top of the elbow. Visually it touches the node border.
- **LOW** — Desktop: "native layout" label rect has `–` characters on either side that look like edge fragments and read as decoration rather than text.

**Concrete fix recommendations:**
1. Wrap the diagram container with a `ResizeObserver` and call `reactFlowInstance.fitView({ padding: 0.2 })` on every container resize. Or set a min-width of ~720 px on the wrapper and allow horizontal scroll on smaller viewports (matches the pattern other diagrams use).
2. Replace the default elbow edge between Data and Functional Unit with a curved (`type: 'default'`) edge, OR offset Data downward by ~40 flow units so the first segment of the elbow is vertical instead of horizontal — eliminates the false "Instruction→Data" reading.
3. Move "decoded + issued" up by ~12 px (or set `labelBgPadding` larger and lower opacity) so the label no longer kisses the Instruction node bottom.
4. Drop the leading/trailing dash characters from the edge labels (they appear to be label-bg rendering artifacts).

---

## Section 2 — The Heterogeneity Fact

### Layout audit (desktop)
- Five-row, five-column comparison table renders cleanly; right-most column "Cost of being wrong" ends at x=1095 of 1152-viewport (28 px to spare). No clipping at the actual rendered viewport.
- The earlier full-page screenshot makes the table look clipped because Playwright's default screenshot rendered at scrollWidth=1140 and the right column needed to be horizontally scrolled in the view; the table itself is correctly inside the column.

### Layout audit (mobile)
- Table is 670 px wide inside a 218 px parent with `overflow-x: auto`. Horizontal scroll works, but on first paint **only the first column is visible**; there is no scroll-affordance hint (shadow, gradient, or scrollbar) to suggest more content.
- Two-column "Out-of-order host core / NVIDIA SIMT GPU / AWS Trainium systolic array / Wafer-scale dataflow" grid below the table collapses to one column — readable.

### Diagram audit
**Diagram name:** none — Section 2 is a pure table (no inline SVG/React-Flow component).

**Current visual structure (rebuild brief):**
Cloudscape `Table` component, 5 columns × 5 data rows. Columns: Architecture | Instruction delivery | Data delivery | Shape fit | Cost of being wrong. Rows: Graviton/Xeon/EPYC host core | NVIDIA Hopper/Blackwell SM | AWS Trainium NeuronCore | Cerebras WSE-3 wafer | Compute-in-Memory (HBM-PIM/HyperCIM). One footnote line below the table cites the AWS Neuron SDK documentation.

**Issues found (severity-ranked):**
- **MEDIUM** — Mobile: no visible scroll affordance on the overflowing table. A reader on mobile sees only "Architecture" and is unlikely to discover the other four columns.
- **LOW** — Mobile: the table's column widths are not breakpoint-tuned; first column gets full visual weight regardless of viewport.

**Concrete fix recommendations:**
1. Add a right-edge gradient (`linear-gradient(90deg, transparent, white)` or Cloudscape's built-in `stickyHeader` + visual scroll-shadow) to indicate horizontal scrollability on mobile.
2. Optionally add a one-line caption above the table on mobile only: "Scroll horizontally to compare —"

---

## Section 3 — Roofline and Arithmetic Intensity

### Layout audit (desktop)
- Section header card, RooflineChart card, Ridge-points table, Prefill/Decode two-column block, and the "Moving the workload along the x-axis" card all render cleanly.

### Layout audit (mobile)
- The RooflineChart SVG (`src/components/RooflineChart.tsx:34`) is hard-coded `width={680}` while parent is 218 px with `overflow-x: auto`. Diagram requires horizontal scroll on mobile and there is no scroll affordance.

### Diagram audit
**Diagram name:** RooflineChart — `src/components/RooflineChart.tsx`

**Current visual structure (rebuild brief):**
SVG 680x340 with a 70-px left margin, 50-px bottom margin, 20-px top/right margin. A red diagonal line (memory-bound slope, stroke `#d91515`) rises from the bottom-left of the plot to the ridge point. From the ridge, a blue horizontal line (compute-bound ceiling, stroke `#0972d3`) extends to the right edge. A dark-navy filled circle marks the ridge point at ~65 % of the x-axis. Four colored workload markers sit along the red slope and the blue ceiling: Decode batch 1 (red, x=6 %, "~2 FLOPs/byte"), Decode batch 64 (orange, x=20 %, "~128 FLOPs/byte"), Prefill long prompt (green, x=55 %, "near ridge"), Dense GEMM (blue, x=78 %, "compute-bound"). X-axis label "Arithmetic intensity (FLOPs per byte of DRAM traffic) →" runs along the bottom; Y-axis label "Achievable TFLOPS →" is rotated -90 ° at the left.

**Issues found (severity-ranked):**
- **HIGH** — Top-right label collision: at the upper ceiling, three labels stack with insufficient vertical spacing. "compute-bound ceiling = peak FLOPs" (line 98–107) sits at viewBox y=48 spanning x=420–639. "Dense GEMM (large tiles)" (workload label, line 120–128) sits at y=50, x=462–598. "Ridge point" (line 77–85) sits at y=65, x=466–534. Vertical row centers are 48, 50, 65 — text is 16 px tall. Result: the ceiling label and the Dense-GEMM label collide directly; the Ridge-point label sits one line below them and clips the others.
- **HIGH** — Mobile: SVG is fixed-width 680 with no responsive scaling. On a 390 px viewport, the ridge area (right side, where ceiling/ridge/Dense GEMM live) is in the worst overflow region — the most important annotations are most likely to be hidden.
- **MEDIUM** — The slope label "memory-bound slope = peak bandwidth × intensity" rotated -28 ° crosses the plot interior and visually intersects the Decode (batch 64) workload marker at viewBox (x≈210, y≈190).
- **LOW** — Y-axis label "Achievable TFLOPS →" uses a rotation transform with center `18,${-height / 2}` (line 179). The bbox shows post-rotation x=-239 — the math works in CSS-px but is fragile; any tweak to `height` shifts the rotation center and the label drifts off the axis.

**Concrete fix recommendations:**
1. Move "Ridge point" label down to y=plotH*0.2 + 20 (below the ridge dot) instead of +4 (line 79), and right of the dot. Move "compute-bound ceiling = peak FLOPs" down by 8 px (y=margin.top + plotH*0.18 instead of 0.15 — line 100). Move "Dense GEMM (large tiles)" down to sit ~14 px below the ceiling line (anchor under the marker, not above).
2. Move the slope label up and to the left so it sits in the empty triangle between the slope and the y-axis (e.g., x=plotW*0.12, y=plotH*0.40), away from the Decode (batch 64) marker.
3. Wrap the SVG in a responsive container: replace `width={680}` with `width="100%"` and rely solely on the existing `viewBox` for scaling. Set `preserveAspectRatio="xMidYMid meet"`. Drop the `overflowX: auto` wrapper — it's compensating for the wrong layout.
4. Compute the y-axis label rotation center as `${margin.left - 50},${margin.top + plotH/2}` and use `text-anchor="middle"` to make the placement self-correcting.

---

## Section 4 — Memory Hierarchy Primer

### Layout audit (desktop)
- Section text card + tower card + "How the three families use the hierarchy" table + scratchpads three-column block + cache vs scratchpad two-column block all render cleanly.

### Layout audit (mobile)
- The MemoryHierarchyTower SVG (`src/components/MemoryHierarchyTower.tsx:80`) is fixed-width 720 in a 218 px parent. Same overflow pattern as Section 3.
- Three-column "Hopper SMEM / Blackwell TMEM / Trainium SBUF + PSUM" block collapses to single column — fine.

### Diagram audit
**Diagram name:** MemoryHierarchyTower — `src/components/MemoryHierarchyTower.tsx`

**Current visual structure (rebuild brief):**
SVG 720x450 displaying a seven-tier "staircase" stacked downward. Each tier is a horizontal rounded rectangle, indented 30 px to the right of the tier above, color-coded by tier band (registers blue, SRAM green, L1/L2 progressively warmer, HBM orange, disaggregated red). Each tier shows a bold label ("1. Register file", "2. SRAM scratchpad (SMEM, TMEM, SBUF, PSUM)", through "7. Disaggregated (CXL, NVLink-remote, NeuronCore neighbor)") on the first line, and a representative numbers caption ("effectively free • KBs • < 1 cycle" through "10s-100s GB/s • TBs • ~1-3 µs") on the second. A title and a one-line subtitle sit above the tower.

**Issues found (severity-ranked):**
- **HIGH** — Mobile: SVG is fixed-width 720 in a 218 px parent. Same problem as RooflineChart.
- **LOW** — Desktop: the longest caption (tier 6, "3-5 TB/s (HBM) / 400 GB/s-class (DDR) • 10s of GB (HBM) - TBs (DDR) • ~200-400 cycles") ends at viewBox x=630 of a 720 viewBox — only 90 px of right margin. If the caption gets any longer in a future edit it will spill out.

**Concrete fix recommendations:**
1. Replace `width={720}` with `width="100%"` and rely on the `viewBox` for scaling; add `preserveAspectRatio="xMidYMid meet"`.
2. Reserve at least 110 px of right padding inside the viewBox (e.g., expand viewBox to 760 wide) so future caption growth has headroom.

---

## Section 5 — Anatomy of a Kernel Execution

### Layout audit (desktop)
- Section header + lifecycle card + "Where the cycles go" table + "Three lanes" table + four-column SIMT/AOT/In-process blocks all render cleanly.

### Layout audit (mobile)
- The KernelLifecycleDiagram SVG (`src/components/KernelLifecycleDiagram.tsx:95`) is fixed-width 920 in a 218 px parent. Worst overflow of all five sections — visible portion is about 24 % of the diagram on mobile.

### Diagram audit
**Diagram name:** KernelLifecycleDiagram — `src/components/KernelLifecycleDiagram.tsx`

**Current visual structure (rebuild brief):**
SVG 920x360. A title and subtitle run across the top. Below them, seven horizontal "stage" boxes are laid out left to right at equal pitch (lane width = 122.9 px, box width = 106.9 px after 8-px insets). Each box has a colored top-left circle with the stage number, a bold stage name to the right of the circle ("Host issue", "Driver submit", "Device dispatch", "SM / core scheduling", "Operand staging", "Functional unit fires", "Retire & return"), then three labeled groups inside the box — "Who:", "Memory tier:", "Scale:" — each followed by descriptive text. Stages are color-banded in three groups by border: blue (1, 2 — host), orange (3, 4 — dispatch/scheduling), green (5, 6 — staging/fire), red (7 — retire).

**Issues found (severity-ranked):**
- **HIGH** — The "Who:" sublines exceed the 107-px box width on multiple stages. Measured bbox widths vs box width 107 px:
  - Stage 3 "GPU front-end / NeuronCore dispatcher" — width 186 px (overflows by 79 px into Stage 4).
  - Stage 6 "Tensor core / systolic array / AMX" — width 155 px (overflows by 48 px into Stage 7).
  - Stage 5 "Async copy, TMA, DMA, SBUF load" — width 158 px (overflows by 51 px into Stage 6).
  - Stage 2 "CUDA / Neuron / oneDNN driver" — width 151 px (overflows by 44 px).
- **HIGH** — Stage 7 "Memory tier" text "SMEM → HBM → host (on demand)" — width 165 px starting at viewBox x=783, ending at x=948, but viewBox right edge is 920. **The last stage's tier caption falls outside the SVG viewBox** — the right edge of the text is clipped on every render, including desktop.
- **HIGH** — Mobile: hard-coded `width={920}` with overflow scroll only. ~76 % of the diagram is hidden on first paint at 312 px CSS width.
- **MEDIUM** — Stage circles use `cx = x + 14` and number text uses `x = x + 14` without `textAnchor="middle"` on the digits; for two-digit stage numbers (none here, but a future "10" would be misaligned).

**Concrete fix recommendations:**
1. Increase per-stage box width or break "Who:" / "Memory tier:" content onto two lines via SVG `<tspan>`. Easiest fix: keep the data structure, but render each multi-word value through a wrap helper that splits at ~14 chars and emits two `<tspan x={x + 12} dy="1.1em">` lines. Move the "Memory tier:" label down by `1.1em` whenever the "Who:" wraps.
2. Expand the SVG viewBox right margin from 30 px to 70 px so Stage 7's "SMEM → HBM → host (on demand)" fits inside the canvas. Concretely: change `width = 920` and `margin.right = 30` (lines 83, 85) to `width = 980` and `margin.right = 80`, OR shorten the caption to "SMEM → HBM → host".
3. Replace `width={920}` with `width="100%"` and `preserveAspectRatio="xMidYMid meet"` on the SVG element. Combined with the wrap helper above, this gives a usable mobile rendering without horizontal scroll.
4. Add `textAnchor="middle"` to the stage-number `<text>` (around line 124–130) so two-digit numbers stay centered if the structure is reused.

---

## Cross-cutting recommendation

All three SVG components in Sections 3-5 (RooflineChart, MemoryHierarchyTower, KernelLifecycleDiagram) hard-code an `svg width="…"` attribute alongside a `viewBox`. The fix is uniform: drop the literal width, set `width="100%"`, set `preserveAspectRatio="xMidYMid meet"`, and remove the `overflow-x: auto` wrapper. That single change makes all three diagrams responsive and removes the mobile scroll failure mode. The TriangleDiagram (React Flow, Section 1) needs a separate fix — a `ResizeObserver` that re-fires `fitView` — because React Flow's flow units are not viewBox-relative.
