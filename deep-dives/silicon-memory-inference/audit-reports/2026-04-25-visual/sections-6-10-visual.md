# Visual Audit — Sections 6-10

Audit run 2026-04-25 against `http://localhost:4173/` (Vite preview).
Desktop: 1440x900 (effective 1152 CSS px, DPR 1.25, main column 1014 px).
Mobile: 390x844 (effective ~312 CSS px, main column 218 px).

Screenshots: `screenshots/sec{N}-{name}-{desktop|mobile}.png`.

**Cross-cutting finding (sections 6, 7, 9, 10).** All four inline-SVG diagrams repeat the same hard-coded-width pattern that was already fixed for sections 1-5: numeric `width` attribute on the `<svg>`, no `preserveAspectRatio`, parent `<div style={{ width: '100%', overflowX: 'auto' }}>`. At desktop the SVG fits inside the 1014 px column; at mobile the SVG keeps its 720-880 px width and the wrapper gets a horizontal scrollbar — first-paint mobile readers see only the leftmost ~25% of every diagram. RooflineChart already shows the canonical fix (`width="100%"`, `preserveAspectRatio="xMidYMid meet"`, viewBox kept). ChipletPathDiagram (Section 8) is React Flow, not SVG, but exhibits a different mobile failure (fitView positions the entry node off-screen) discussed in its section.

---

## Section 6 — HBM and the Bandwidth Wall

### Layout audit (desktop)
- Narrative cards and the "Per-GPU HBM on modern accelerators" table render cleanly.
- HbmStackDiagram is hard-clipped at the SVG right edge: TSV annotation reads "TSV..." and bus line reads "1,0..." even with column slack. Source: `src/components/HbmStackDiagram.tsx:7-8` (`width = 720`).

### Layout audit (mobile)
- Diagram parent is 218 px; SVG keeps `width=722`, so `overflow-x: auto` shows only the accelerator die. HBM stack, TSVs, and PHY annotation are off-screen right.

### Diagram audit
**Diagram name:** HbmStackDiagram (`src/components/HbmStackDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 720x380 cross-section. Bottom-up: dark-grey "Package substrate", lighter "Silicon interposer (2.5D packaging, >1000 signal wires)". Sitting on the interposer at left: dark "Accelerator die" (x=90, w=280, h=60) labeled "Accelerator die / (GPU SMs, Tensor Cores, or Trainium NeuronCores)". To the right (x=460, w=180): the HBM stack — a dark "Base logic die" at the bottom and 8 alternating light-blue "DRAM die N" rectangles stacked above it (8 at the bottom, 1 at the top), each 22 px tall. Ten red dashed vertical TSVs run through the stack. A red callout at y=150 points to "TSVs (through-silicon vias)" with sub-label "1,024-bit bus per stack". A green PHY line connects accelerator to HBM base logic die with green labels above it: "HBM PHY — ~6.4 / 8-9 Gb/s per pin" and "×1024 pins per stack → TB/s per stack". Two header captions: "Accelerator / (GH100 / GB100 / Trainium)" and "HBM stack / 8 DRAM dies + base logic".

**Issues found (severity-ranked):**
- **HIGH** — TSV annotation labels are placed at x=705 with bbox extending to x=848 / x=810; SVG `width=720` clips the last 90-128 px. Default SVG `overflow:hidden` makes this a hard clip. Source: `HbmStackDiagram.tsx:140-146`.
- **HIGH** — Hard-coded `width={720}` (`HbmStackDiagram.tsx:7`) prevents fluid scaling. Mobile shows ~30% of the diagram on first paint.
- **MEDIUM** — Green "HBM PHY" labels at y=240 sit on top of the dark "Accelerator die" rectangle (y=230-290). Green-on-dark is readable but ugly; the second sub-label crosses the white "Accelerator die" caption.
- **LOW** — Red TSV dashed lines are drawn over the DRAM die labels.

**Concrete fix recommendations:**
1. Replace SVG header with `width="100%"` + `preserveAspectRatio="xMidYMid meet"` (mirror `RooflineChart.tsx:33-37`).
2. Widen viewBox to `0 0 880 380` so the TSV/bus labels at x=705-848 stay inside the canvas.
3. Move PHY labels above the accelerator (y ≈ 218 / 232) into the negative-space band.
4. Drop the SVG element's hard-coded numeric `width` attribute.

---

## Section 7 — DDR5, MRDIMM, LPDDR5X, CXL

### Layout audit (desktop)
- "Spec" comparison table renders cleanly.
- MemoryTechGrid SVG (880 px) fits the 1014 px column with 134 px slack, but several text values flow past panel borders.

### Layout audit (mobile)
- SVG holds `width=880` inside a 218 px parent. First paint: only the DDR5 RDIMM panel visible. No scroll affordance (no gradient, no hint).

### Diagram audit
**Diagram name:** MemoryTechGrid (`src/components/MemoryTechGrid.tsx`)

**Current visual structure (rebuild brief):**
880x270 SVG with a section title and four equal-width side-by-side rounded panels: DDR5 RDIMM (blue `#0972d3`/`#f2f8fd`), MRDIMM DDR5-8800 (green `#037f0c`/`#ecf7ec`), LPDDR5X (orange `#ec7211`/`#fdf3ec`), CXL 2.0 / 3.0 (red `#d91515`/`#fce7e7`). Each panel: technology name (13 px bold), then four labeled fields ("Peak bandwidth", "Capacity", "Latency", "Use case") with values; "Use case" rendered in the panel's accent color.

**Issues found (severity-ranked):**
- **HIGH** — Hard-coded `width=880` (`MemoryTechGrid.tsx:53`). At mobile 218 px, only 25% visible on first paint.
- **MEDIUM** — Long value strings overflow panel borders at `colW=210`, inner ~190 px:
  - DDR5 "~50 GB/s per channel @ DDR5-6400" (~218 px).
  - MRDIMM "~70 GB/s per channel — 1.37× DDR5-6400" (~250 px).
  - LPDDR5X "~500 GB/s per package (NVIDIA Grace)" (~225 px).
  - CXL "TBs via pooled / shared memory" extends past the SVG right edge (clipped).
  SVG `<text>` does not wrap, so strings cross adjacent panel borders.
- **LOW** — Diagram uses "DDR5 RDIMM" all-caps while the surrounding narrative uses sentence case ("DDR5 — the workhorse").

**Concrete fix recommendations:**
1. Make the SVG fluid: `width="100%"` + `preserveAspectRatio="xMidYMid meet"`.
2. Wrap long values into two-line `<tspan dy="14" x={x+16}>` pairs, or widen viewBox to 1080 for ~250 px inner panel width.
3. Optionally reflow to 2x2 below 700 px viewport — requires HTML/CSS instead of SVG.

---

## Section 8 — Chiplet and Interconnect

### Layout audit (desktop)
- "How the major architectures compose" table renders cleanly.
- ChipletPathDiagram React Flow (1014x460) renders all 7 nodes with the L-shape. fitView transform: `translate(66, -10.7) scale(0.92)`; rightmost column ends at screen x ≈ 1029 with 50 px slack against the 1079 px right edge.

### Layout audit (mobile)
- React Flow is 218 px wide x 460 px tall (parent). fitView transforms to `translate(-131, 99) scale(0.5)` — Zen 5 core node ends at screen x ∈ [-89, -9], fully off-screen left. UMC and DDR5 (vertical leg) are off-screen below the visible card area.
- Net: mobile reader sees a fragment of the middle (L2/L3/GMI3-W); both endpoints are gone.

### Diagram audit
**Diagram name:** ChipletPathDiagram (React Flow, `src/components/ChipletPathDiagram.tsx`)

**Current visual structure (rebuild brief):**
Seven labeled rounded-rectangle nodes laid out in an "L": horizontal row of five at y=100 (Zen 5 core blue → L2 blue → L3 CCD-local green → GMI3-W link orange → IO die orange) then a vertical drop of two at x=800 (UMC orange at y=240, DDR5-6400 channel red at y=360). 160 px min-width nodes, 2 px borders, padding, contrasting fills. Edges are smoothstep with arrow markers, animated, with inter-node latency labels: "~1 ns", "~3 ns", "~10 ns", "~20-40 ns", "~80-130 ns total". Edge stroke colors track the source node accent. fitView at mount with `padding: 0.15`. Pan/zoom/drag disabled. 20 px grid background.

**Issues found (severity-ranked):**
- **HIGH** — Mobile: fitView positions the entry node (Zen 5 core) off-screen at scale 0.5; the path's start point is invisible.
- **MEDIUM** — Desktop: the L-bend has no labeled chiplet-boundary; reader has to infer "queuing on chiplet" from the orange→red color shift.
- **LOW** — Desktop: smoothstep edges between same-y nodes produce a horizontal-line-with-tiny-elbow that visually merges with node borders.

**Concrete fix recommendations:**
1. Wrap the React Flow container with a `ResizeObserver` and re-call `fitView({ padding: 0.15 })` on each resize. Alternative: set `min-width: 720px` on the wrapper and let the parent overflow.
2. Below 600 px width, switch to a vertical layout (all nodes at x=0, y stepping by 80) via a `useMediaQuery` hook.
3. Add a labeled vertical separator between the GMI3-W node and the IO die node ("CCD boundary →") so the chiplet-crossing is explicit.

---

## Section 9 — Graviton Deep Dive

### Layout audit (desktop)
- GravitonComparison SVG (880 px) fits inside 1014 px column with 134 px slack. Both panels render clean.
- Spec comparison table below renders cleanly.

### Layout audit (mobile)
- SVG holds `width=880` inside a 218 px parent. First paint: only Graviton4 panel; arrow and Graviton5 panel off-screen right.

### Diagram audit
**Diagram name:** GravitonComparison (`src/components/GravitonComparison.tsx`)

**Current visual structure (rebuild brief):**
880x360 SVG with section title and two equal-width rounded panels. Left (Graviton4, blue): "Graviton4 — Neoverse V2" / "ARMv9.0 · TSMC N4/N5 · 2.8 GHz", then four labeled blocks (Compute / Cache / DRAM / Inter-core latency) and an italic blue summary ("The SLC is unified and modest…"). Right (Graviton5, green): "Graviton5 — Neoverse V3" / "ARMv9.2 · TSMC 3 nm · 3.1 GHz" with the same four blocks; one bold-green callout ("1 MB L3 per core (2.67× G4)") and italic green summary ("L3 grows 5.3× to compensate…"). A small black arrow at y=195 points left-to-right between the two panels.

**Issues found (severity-ranked):**
- **HIGH** — Hard-coded `width=880` (`GravitonComparison.tsx:7`). Mobile shows only Graviton4 on first paint.
- **MEDIUM** — Long Graviton5 lines fit within 5 px of the right border ("L1: 64+64 KB · L2: 2 MB / core · L3: 192 MB distributed (CMN-S3)"; "12 × DDR5-7200 = 691.2 GB/s · 3.6 GB/s per core (-36%)"). No clipping today, but no breathing room for future text additions.
- **LOW** — The black arrow between panels is small (8 px triangle on a 12 px line); on mobile after horizontal scroll, the "evolution from G4 → G5" cue is weak.

**Concrete fix recommendations:**
1. Make the SVG fluid: `width="100%"` + `preserveAspectRatio="xMidYMid meet"`.
2. Increase viewBox to 940 (and `colW` accordingly) to give the long cache/DRAM lines breathing room.
3. Replace the bare arrow with a labeled one ("doubled cores · distributed L3 · -36% per-core BW") so the headline survives mobile scroll.

---

## Section 10 — AMD EPYC Turin

### Layout audit (desktop)
- "Memory hierarchy and latencies" and "SKU lineup" tables render cleanly.
- EpycTurinTopology SVG (880 px) fits inside 1014 px column. All 12 CCDs and IO die render inside the viewBox, but the GMI dashed lines pass through the IO die label text.

### Layout audit (mobile)
- SVG holds `width=880` inside a 218 px parent. First paint shows the title strip, "← 6 × DDR5", and CCD 1; everything else off-screen right.

### Diagram audit
**Diagram name:** EpycTurinTopology (`src/components/EpycTurinTopology.tsx`)

**Current visual structure (rebuild brief):**
880x460 SVG with section title at top. Center: orange-bordered IO die rectangle (220x100, centered on (440, 230)) labeled "IO die — TSMC 6 nm" / "12 UMC (DDR5) · 16 GMI ports · Infinity Fabric mesh" / "PCIe 5 / xGMI / CXL 2.0". Around it, 12 blue-bordered CCD rectangles (130x60 each, fill `#f2f8fd`): top row of 5 at y=50 (x ∈ {120, 265, 410, 555, 700}), bottom row of 5 at y=320 (same x's), and 2 mid-row CCDs flanking the IO die (CCD 6 at x=190, y=130; CCD 12 at x=640, y=130). Each CCD shows "CCD N", "8 Zen 5 cores", "32 MB L3". Twelve thin orange dashed lines run from each CCD center to (440, 230). Two red labels at y=222: "← 6 × DDR5" at x=20 and "6 × DDR5 →" at x=780. Grey footnote: "Up to 16 CCDs (Turin) or 12 CCDs (Turin Dense, 16 cores per CCD = 192 max). 12 × DDR5-6400 ≈ 614 GB/s peak."

**Issues found (severity-ranked):**
- **HIGH** — Hard-coded `width=880` (`EpycTurinTopology.tsx:7`). Mobile shows only one CCD on first paint.
- **HIGH** — All 12 GMI dashed lines terminate at the IO die *center* (440, 230), so they pass through the IOD rectangle and cross the IO die label text ("IO die — TSMC 6 nm" at y=216, "12 UMC (DDR5)…" at y=234). Visual noise inside the IOD reduces label legibility.
- **MEDIUM** — Mid-row CCD placement is asymmetric: CCD 6 right edge x=320 sits 10 px from IOD left edge (330); CCD 12 left edge x=640 sits 90 px from IOD right edge (550). Source: `EpycTurinTopology.tsx:14-27`.
- **MEDIUM** — DDR5 channel labels are bare text arrows; no rectangles or lines tie them to the IOD. The brief asked for "DDR5 channels at left and right edges" — currently those are unattached labels.
- **LOW** — CCD numbering is positionally non-obvious (CCD 6 is mid-left, CCD 12 mid-right; 1-5 top, 7-11 bottom). Needs a legend or a cleaner two-row-of-six layout.

**Concrete fix recommendations:**
1. Make the SVG fluid: `width="100%"` + `preserveAspectRatio="xMidYMid meet"`.
2. Terminate GMI lines at the IOD rectangle perimeter (compute line-rect intersection) instead of the center.
3. Re-balance mid-row CCDs symmetrically — CCD 6 at (170, 130), CCD 12 at (580, 130) — or drop the middle row and use a clean two-row-of-six.
4. Add explicit DDR5 channel rectangles attached to the IOD left/right edges, with the "6 × DDR5" labels as captions above them.

---

## Per-section summary table

| Section | Diagram | Desktop verdict | Mobile verdict | Hard-width bug? | Top fix |
|---------|---------|-----------------|----------------|-----------------|---------|
| 6 — HBM | HbmStackDiagram | TSV labels clipped 90-128 px past `width=720` | ~30% visible on first paint | YES — `width={720}` | Fluid SVG + viewBox 0 0 880 380 |
| 7 — DDR5/MRDIMM/LPDDR5X/CXL | MemoryTechGrid | Long values touch panel borders | Only DDR5 panel visible | YES — `width=880` | Fluid SVG + two-line `<tspan>` for long values |
| 8 — Chiplet | ChipletPathDiagram (React Flow) | Fits with 50 px slack | fitView centers Zen 5 off-screen left at scale 0.5 | NO (React Flow), but fitView fails | ResizeObserver + re-fitView, or vertical layout below 600 px |
| 9 — Graviton | GravitonComparison | Fits with 134 px slack | Only Graviton4 panel visible | YES — `width=880` | Fluid SVG + viewBox 940 |
| 10 — EPYC Turin | EpycTurinTopology | GMI lines cross IOD label text; mid-row CCDs asymmetric | Only one CCD visible | YES — `width=880` | Fluid SVG + terminate GMI at IOD edge + symmetric mid-row |

**Highest-leverage single change for sections 6-10:** apply the RooflineChart fluid-SVG pattern (`width="100%"` + `preserveAspectRatio="xMidYMid meet"` + drop hard-coded numeric `width`) to HbmStackDiagram, MemoryTechGrid, GravitonComparison, and EpycTurinTopology. That alone resolves the dominant mobile failure across four of the five sections and is a four-line edit per file. Section 8's React Flow needs a separate fitView-on-resize fix.
