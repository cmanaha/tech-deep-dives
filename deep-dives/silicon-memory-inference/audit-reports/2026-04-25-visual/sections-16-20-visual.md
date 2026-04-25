# Sections 16-20 — Visual audit (2026-04-25)

Viewports: desktop 1440x900 (Cloudscape AppLayout main column ~1014px wide; SVG wrappers measured at 1014 once the side rail is scrolled past, 758 while it is visible — the latter is the fold) and mobile 390x844 (main column ~218px wide). Same cross-cutting pattern from Sections 1-15 audits is intact here: every inline SVG (Sec 16, 18, 19, 20) is a hard-coded `width=880` SVG inside a `<div style={{ width: '100%', overflowX: 'auto' }}>` wrapper, so it never grows past 880 on a wide screen and horizontally scrolls instead of scaling on mobile. Section 17 is a React Flow canvas with `fitView` set once at mount but no `FitViewOnResize` child — the cached transform from desktop is reused on mobile, leaving nodes stranded outside the viewport. The `FitViewOnResize` pattern only exists in `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx` today.

Diagram and full-page screenshots are saved in `screenshots/` alongside this report.

---

## Section 16 — AWS Trainium, Inferentia, Neuron silicon

### Layout audit (desktop, 1440x900)
- `TrainiumChipDiagram.tsx:7-8` — `width=880, height=380` hard-coded; same wrapper. SVG renders at 882×382. With the side rail visible the wrapper clientWidth measures 758, so the wrapper is in horizontal-scroll mode and ~124px of the right edge is hidden under the fold (the right HBM stack at `chipX + chipW + 10 = 780` plus its 70px width ends at x=850 — entirely beyond 758).
- `TrainiumChipDiagram.tsx:32` — left HBM stack is positioned at `x = chipX - 80 = 30` and right HBM stack at `x = 780`. Both stacks are 70px wide with their *labels* at x+35 (centered text-anchor). The right stack ends at x=850; even at the wider 1014 column 36px of empty padding sits to its right rather than scaling the diagram up.
- `TrainiumChipDiagram.tsx:84-86` — the NeuronLink-v3 footer caption is a single SVG `<text>` line: "NeuronLink-v3 — 1.28 TB/s per chip intra-node · 256 GB/s per chip inter-instance · Trn2 UltraServer = 64 chips in a 3D Torus". At fontSize 11 with text-anchor middle on width/2 the string is ~78 characters; rendered length is comfortably inside 880 but it is one long line — there is no wrap fallback if the font metrics shift.
- `TrainiumChipDiagram.tsx:35-39` — the HBM stack body has five short lines stacked at y=60/78/94/132/148 inside a 220px-tall rect. The 132 / 148 cluster ("2.9 TB/s" / "aggregate") is separated from the 60/78/94 cluster by a 38px visual gap with nothing in it; the rect feels half-empty and under-labelled relative to the dense NeuronCore tiles next to it.

### Layout audit (mobile, 390x844)
- Wrapper clientWidth = 218, SVG renders at 882. Only the leftmost ~218px is visible — that is just the left HBM stack and the first half of NeuronCore-v3 #1. Title "Trainium2 chip — schematic layout" is visible but the entire 8-core grid past column 1, the CC-Cores row, the right HBM stack, and the NeuronLink footer caption are off-screen until horizontal pan.

### Diagram audit
**Diagram name:** TrainiumChipDiagram (`src/components/TrainiumChipDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 SVG bordered card. Title at top-left ("Trainium2 chip — schematic layout") and grey sub-line ("8 NeuronCore-v3 · 16 CC-Cores · 96 GiB HBM at 2.9 TB/s · NeuronLink-v3 fabric"). Two narrow red-bordered HBM stack rectangles flank the die: left stack at x=30, y=90, w=70, h=220 (`#fce7e7` fill, `#d91515` stroke) labelled "HBM stack / 96 GiB total / across stacks / 2.9 TB/s / aggregate"; right stack identically at x=780. Between them the Trainium2 die: blue-bordered rounded rect at x=110, y=60, w=660, h=280 (`#f2f8fd` / `#0972d3`) with "Trainium2 die" header. Inside the die a 2×4 grid of NeuronCore-v3 tiles (130×80, 12px gap, green-bordered `#ecf7ec` / `#037f0c`) starting at x=126, y=100; each tile shows "NeuronCore-v3 #N / Systolic array / SBUF 28 MiB / PSUM 2 MiB". Below the grid a single full-width strip at y=284, h=42 (orange-bordered `#fdf3ec` / `#ec7211`) labelled "16 × CC-Cores — Collective Communication" plus a sub-line "Carries on-chip, on-host, and cross-host collectives — including future All-to-All-v for MoE". A grey footer caption sits at y=370 with the NeuronLink-v3 numbers.

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; entire right side of the chip (NeuronCore #2-#8, CC-Cores row, right HBM stack) requires horizontal pan.
- HIGH (desktop, side-rail visible): Right HBM stack is hidden behind the side-rail fold because wrapper clientWidth (758) is narrower than SVG (882). The diagram becomes asymmetric — left HBM visible, right HBM scrolled away.
- MEDIUM: Dead horizontal space inside the wrapper at the wider 1014 column (~132px) makes the diagram look stranded.
- LOW: HBM stack body has a 38px empty band between the "across stacks" line and "2.9 TB/s aggregate" line; either fill it (e.g. lane count, stack count) or tighten the rect height to ~160.
- LOW: NeuronLink footer caption is one long line. On a smaller responsive break it would clip silently — split into two lines or move out of the SVG into a Cloudscape `<Box>` underneath.

**Concrete fix recommendations:**
1. Make the SVG fluid: add `viewBox="0 0 880 380"` (already present), remove `width={width}` / `height={height}` attributes, set `style={{ width: '100%', height: 'auto', maxWidth: 880 }}` and drop the `overflowX: auto` wrapper. The viewBox plus `preserveAspectRatio` (default `xMidYMid meet`) handles down-scaling cleanly.
2. Move the NeuronLink footer caption out of the SVG and into the surrounding Cloudscape `SpaceBetween` so it can wrap responsively.
3. On mobile (≤640px) consider re-flowing: render the two HBM stacks above and below the die as horizontal bands rather than as left/right flanks, or stack the 2×4 NeuronCore grid as 4×2 to reduce horizontal extent.
4. Tighten the HBM stack body — either reduce its height or add a fifth line ("× N stacks") so the empty middle band disappears.

---

## Section 17 — AWS Compilers and Kernel Tooling

### Layout audit (desktop, 1440x900)
- `AwsCompilerStack.tsx:97` — outer container `width: 100%, height: 440px`. With the side rail collapsed the container measures 1014×440. React Flow runs `fitView` once at mount with `fitViewOptions={{ padding: 0.15 }}`; measured viewport transform `matrix(0.7946, 0, 0.7946, 66, 43.6)` — i.e. it scales nodes to ~80% and translates by (66, 43.6). All six nodes render between x=148 and x=1030. The NEFF node ends at x=1030 and the rf right edge is at x=1096 — only ~66px clearance.
- `AwsCompilerStack.tsx:24-79` — node positions are explicit (PyTorch x=0, frontend x=220, xla x=460, nki x=460, neuron-hlo x=690, neff x=940). The two parallel branches (xla at y=100, nki at y=300) merge into neuron-hlo at y=200; visually clean at desktop.
- Edge labels "graph capture" (f→x) and "custom kernels" (f→n) at `AwsCompilerStack.tsx:88-89` sit on top of the smoothstep edges. They read fine at desktop — no overlap.

### Layout audit (mobile, 390x844)
- Container measures 218×440. React Flow viewport transform on mobile is `matrix(0.5, 0, 0, 0.5, -168.5, 109)` — a translate of (-168.5, 109). PyTorch node renders at x=-127 (off-screen left), NEFF node at x=343..428 (off-screen right; rf right edge at 218+42=260).
- This is the FitViewOnResize bug confirmed for Section 17: `fitView` ran once at mount when the container was 1014 wide; on resize to 218 wide the cached transform is reused and nodes scatter outside the viewport. Same root cause as the Section 15 finding from prior audit.

### Diagram audit
**Diagram name:** AwsCompilerStack (`src/components/AwsCompilerStack.tsx`)

**Current visual structure (rebuild brief):**
A React Flow canvas inside a 100%-wide × 440px-tall card with grey dot-grid background. Six rounded nodes laid out left-to-right in three colour bands: blue front-end (`#f2f8fd` / `#0972d3`) — "PyTorch / JAX model" at (0,200) and "torch-neuronx / jax-neuron" at (220,200); green IR (`#ecf7ec` / `#037f0c`) — "XLA HLO" at (460,100) and "NKI Python kernel DSL" at (460,300); orange Neuron IR (`#fdf3ec` / `#ec7211`) — "Neuron HLO (operator fusion + SBUF tiling)" at (690,200); red binary (`#fce7e7` / `#d91515`) — "NEFF ahead-of-time binary" at (940,200). Six animated smoothstep edges with arrow heads connect them: pytorch→frontend (blue), frontend→xla (green, label "graph capture"), frontend→nki (green, label "custom kernels"), xla→neuron-hlo (orange), nki→neuron-hlo (orange), neuron-hlo→neff (thicker red, label "AOT compile"). Node interactions disabled (no drag, no zoom-on-scroll).

**Issues found (severity-ranked):**
- HIGH (mobile): Nodes scatter outside the 218×440 viewport because `fitView` only runs at mount. PyTorch box renders at x=-127, NEFF box at x=343 — neither visible. The diagram is effectively blank on mobile.
- MEDIUM (desktop): NEFF node clearance to right wall is ~66px, fine on a 1014 column but tight on smaller wide-screens (<900 effective column width); the diagram could clip.
- LOW: Edge label backgrounds (default React Flow: white) sit on top of the smoothstep paths but at small zoom levels the label text would overlap arrow corners.
- LOW: Two parallel branches (xla/nki) re-merge at neuron-hlo, but there is no visual hint that "graph capture" and "custom kernels" are alternative entry paths — the audience may read it as a sequential split-merge rather than two compilation modes.

**Concrete fix recommendations:**
1. Add a `FitViewOnResize` child component (same pattern as `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx`) that calls `fitView({ padding: 0.15 })` on container resize. This is the single ratchet that should be turned: every React Flow diagram in the deep dive should ship with FitViewOnResize.
2. On mobile (≤640px) consider switching to a vertical layout — re-run `fitView` after detecting viewport width and pass alternative node positions, or render a vertical SVG lowering-path diagram instead.
3. Add a thin horizontal divider band or label "two entry paths" between xla and nki to make the parallelism explicit.
4. Drop the white background on edge labels or paint a subtle outline so they remain legible if zoom changes.

---

## Section 18 — Cerebras WSE-3

### Layout audit (desktop, 1440x900)
- `CerebrasWaferDiagram.tsx:7-8` — `width=880, height=380`. SVG renders at 882×382 in a 1014 column → ~132px dead space on the right. With side-rail visible (758 column) the GPU comparison panel ending at x=850 is partially under the fold.
- `CerebrasWaferDiagram.tsx:31` — wafer circle: cx=230, cy=200, r=150 → wafer occupies x=80..380. 14×14 PE grid generated at `CerebrasWaferDiagram.tsx:34-55` with cell size 14px and 18px stride starting at (waferCx-120, waferCy-120) = (110, 80); the grid extends to x=110+13·18+14 = x=358, well within the wafer outline.
- `CerebrasWaferDiagram.tsx:64-66` — wafer caption "WSE-3 — 46,225 mm² silicon" at y=waferCy + waferR + 24 = 374. SVG height = 380, so the caption sits 6px from the bottom edge — visually tight but not clipped.
- `CerebrasWaferDiagram.tsx:69` — GPU package rect at x=500, y=70, w=350, h=240, ending at x=850. With four small HBM rects (50×28) flanking the GPU die at x=550 / x=740 and the die itself at x=620, w=100, the right column reads cleanly.
- `CerebrasWaferDiagram.tsx:100-105` — two italic blue caption lines at y=290 and y=306 sit *inside* the GPU package rect but below the HBM stacks. They read as an aside — fine.

### Layout audit (mobile, 390x844)
- Wrapper 218 wide, SVG 882. Visible region is roughly x=0..218 — that is just the left half of the wafer (PE grid and "900,000 PEs" centre label). The "For scale: a typical GPU package" comparison is entirely off-screen until horizontal pan. The whole point of the diagram (the size contrast) is invisible without scrolling.

### Diagram audit
**Diagram name:** CerebrasWaferDiagram (`src/components/CerebrasWaferDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 SVG bordered card. Title "Cerebras WSE-3 — the wafer is the chip" plus grey sub-line "900,000 cores · 44 GB on-wafer SRAM · 21 PB/s memory bandwidth · no HBM in the steady state". Left half: a large blue circle (cx=230, cy=200, r=150, `#f2f8fd` fill, `#0972d3` stroke) representing the wafer; inside it a 14×14 grid of small light-blue squares (14×14, 18px stride) clipped to the circle's interior radius — these are the PE tiles. Centre overlay: a solid blue rounded rect (140×28) labelled "900,000 PEs" in white. Bold blue caption underneath the circle: "WSE-3 — 46,225 mm² silicon". Right half (for scale): a white rounded rect at x=500, y=70, w=350, h=240 with grey border, header "For scale: a typical GPU package". Inside it a dark grey "GPU die (reticle-sized)" rect (100×70) flanked by four small red HBM rects (50×28) — two left, two right. Two grey body lines and two italic blue lines explain "GPU die: ~800 mm² ... Cerebras WSE-3 silicon area is ~57× a flagship GPU die, and there is no off-package memory to traverse."

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; the right-side GPU comparison panel (the entire point of the diagram — size contrast) is hidden until horizontal scroll.
- MEDIUM (desktop): Hard-coded 880 width leaves 132px dead space on a 1014 column; with the side-rail visible the right-most caption clips under the fold.
- LOW: PE grid is 14×14 = 196 cells circle-clipped; the diagram says "900,000 PEs" but the visual cell count is two orders of magnitude off — the schematic should signal "schematic, not to scale" in a footnote since otherwise it visually under-sells the density.
- LOW: Wafer caption "WSE-3 — 46,225 mm² silicon" sits 6px from SVG bottom; tighter than other inter-element gaps.

**Concrete fix recommendations:**
1. Make the SVG fluid (drop fixed width/height, keep viewBox, set `style={{ width: '100%', height: 'auto', maxWidth: 880 }}`).
2. On mobile, re-flow vertically: wafer top, GPU comparison underneath (controlled by CSS media query swapping between two `<g>` groups, or render two SVGs and pick one via `window.matchMedia`).
3. Add a small "schematic — cell count not to scale" caption inside the wafer circle to be transparent that 196 squares represents 900k cores.
4. Increase SVG height to 400 and bump the wafer caption y to 380 so it has 20px of clearance — matches the inter-element spacing in the rest of the diagram.

---

## Section 19 — Groq, SambaNova, Dataflow

### Layout audit (desktop, 1440x900)
- `DataflowSiliconDiagram.tsx:7-9` — `width=880, height=380`, `colW = (width-40)/2 = 420`. Same wrapper.
- `DataflowSiliconDiagram.tsx:26` — Groq panel: x=20, w=420 → ends at x=440. SambaNova panel `DataflowSiliconDiagram.tsx:73`: x = 20+colW+10 = 450, w = colW-10 = 410 → ends at x=860. Together they consume x=20..860 with a 10px gap at x=440..450. Geometry is internally consistent.
- `DataflowSiliconDiagram.tsx:42-50` — four functional-unit cells inside Groq tile at x=50+i·92, w=84 → ends at i=3: x=326, w=84 → x=410. The Groq panel ends at x=440 (left+w = 20+420). Inside the Groq tile rect (x=36, w=388 → ends at x=424), the cell at x=326 ends at x=410, fits with 14px clearance.
- `DataflowSiliconDiagram.tsx:82-99` — three SambaNova tiers each sized w=colW-42=378, starting at x=20+colW+26=466. Tier rects end at x=466+378=844. The text columns inside use absolute x-offsets at `20+colW+200=620` (cap) and `20+colW+320=740` (bw). The tier rect right edge is x=844; the bw column text starts at x=740 with text-anchor (default left). At fontSize 11 "TB/s class" / "GB/s class" (~10 chars) renders ~60-70px wide → ends at ~x=810, fits with ~34px clearance. Tight but not clipped at desktop.
- `DataflowSiliconDiagram.tsx:115` — "Samba-CoE" body line "150 experts, 1T parameters, 3.7× DGX H100 (8 sockets)" is a single 50-character text starting at `20+colW+26=466`. At fontSize 11 it renders ~280px → ends at x=746 inside the tier rect — fits.
- The panel headers and bullets are colour-coded blue (Groq) vs green (SambaNova) — readable and consistent with the rest of the deep dive.

### Layout audit (mobile, 390x844)
- Wrapper 218, SVG 882. Visible region is just the Groq panel left edge through the start of the "Streaming Processor (SP) tile" header. The four functional-unit cells, SambaNova panel, three tier rows, and bottom "Bet:" italics are all off-screen.

### Diagram audit
**Diagram name:** DataflowSiliconDiagram (`src/components/DataflowSiliconDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 SVG bordered card. Title "Two dataflow architectures, two different memory bets". Two side-by-side panels with a 10px vertical gap. Left panel (blue, `#f2f8fd` / `#0972d3`): x=20, y=50, w=420, h=310. Header "Groq LPU" plus grey sub-line "Deterministic dataflow · all weights in SRAM". Inside it a "Streaming Processor (SP) tile" rounded rect (388×110) holding four white cells in a row labelled VXM (vector), MXM (matmul), SXM (switch), MEM (230 MB SRAM). Below the tile: bold "Memory model" with two body lines ("230 MB SRAM per chip · 80 TB/s on-chip BW", "No HBM, no DRAM in the inference path"); bold "Production" with body ("INT8. Llama 4 Scout 460+ tokens/s reported."); italic blue "Bet: deterministic schedule + on-chip weights." Right panel (green, `#ecf7ec` / `#037f0c`): x=450, y=50, w=410, h=310. Header "SambaNova SN40L" plus grey sub-line "Three-tier memory · reconfigurable dataflow". Three horizontal tier rows (378×36 each, stacked at y=116/158/200): "On-chip SRAM | ~520 MB | TB/s class" (white), "HBM3 | 64 GB | ~3 TB/s" (green tint), "DDR-attached | up to 1.5 TB | GB/s class" (orange tint). Below: bold "Programming model" with body ("Reconfigurable dataflow units (RDUs); compiler maps the model graph to the RDU mesh."); bold "Samba-CoE" with body ("150 experts, 1T parameters, 3.7× DGX H100 (8 sockets)"); italic green "Bet: tier the memory, host more experts."

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; only Groq panel left edge visible. The whole point of the side-by-side comparison is invisible without horizontal scroll.
- MEDIUM (desktop): Hard-coded 880 width leaves dead space at 1014; with side-rail visible the SambaNova right column (the tier badges' bandwidth column) clips under the fold.
- LOW: SambaNova tier rows use three text columns laid out at fixed x-offsets (label / capacity / bandwidth). On a slightly narrower font the bandwidth column ("TB/s class") could overflow the tier rect — geometry is tight (34px clearance).
- LOW: The "Bet:" italic line at the bottom of each panel sits at y=342 and y=350; only 18-30px clearance to the panel border. Comfortable but not generous; if any line above gets a longer caption the bet will wrap into the border.

**Concrete fix recommendations:**
1. Make the SVG fluid (same as Sec 16/18 fixes).
2. On mobile, stack the two panels vertically instead of side-by-side. Easiest path: detect viewport via `useMedia` and swap to a `<svg viewBox="0 0 420 760">` variant with the panels stacked.
3. Tighten the SambaNova tier row text layout: replace the three fixed x columns with a `<g>` flex pattern (compute label width then position cap/bw), or shorten "TB/s class" to "TB/s" and "GB/s class" to "GB/s".
4. Bump the panel height from 310 to 330 (and SVG height to 400) to give the "Bet:" line ≥30px clearance from the bottom border.

---

## Section 20 — Compute-in-Memory (PIM, HyperCIM)

### Layout audit (desktop, 1440x900)
- `CimDiagram.tsx:7-9` — `width=880, height=380`, `colW = (width-60)/2 = 410`. Same wrapper.
- `CimDiagram.tsx:26` — Left panel: x=20, w=410 → ends at x=430. Right panel `CimDiagram.tsx:75`: x=40+colW=450, w=410 → ends at x=860.
- `CimDiagram.tsx:34-46` — Inside the LEFT panel: CPU/GPU rect at x=36, w=140 → ends at x=176. DDR/HBM bus rect at x=210, w=120 → ends at x=330. **DRAM array rect at x=364, w=140 → ends at x=504.** But the left panel ends at x=430. The DRAM array rect overshoots the left panel border by 74px and extends into the gap and into the right panel area — this is a real geometry bug and is visible in the desktop screenshot (`sec20-cim-desktop.png`) where the "DRAM array" text is partially clipped by the right-panel border.
- `CimDiagram.tsx:49-52` — the four arrow lines connecting CPU↔bus and bus↔DRAM run between x=176..363 / y=150..170. Two of those arrow tips (x=363, ending at the DRAM rect at x=364) actually land inside what is visually the right panel because of the DRAM rect overflow.
- `CimDiagram.tsx:84` — Right panel inner rect "DRAM bank (or SRAM array)" at x=56+colW=466, w=colW-32=378 → ends at x=844, inside the right panel's x=860 wall — clean.
- `CimDiagram.tsx:89-131` — four bank columns generated with `x = 70 + colW + i · (colW-60) / 4` and width `(colW-60)/4 - 4`. With colW=410 → cell stride = 87.5, cell width = 83.5; cells start at x=480, 567.5, 655, 742.5; last cell ends at x=826 — fits inside the inner rect.

### Layout audit (mobile, 390x844)
- Wrapper 218, SVG 882. Visible region is just the left "Conventional von Neumann" panel — and even there the DRAM array rect clips into nothing because of the desktop overflow bug. Right "Compute-in-Memory" panel (the actual story) is entirely off-screen.

### Diagram audit
**Diagram name:** CimDiagram (`src/components/CimDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 SVG bordered card. Title "Compute-in-Memory — moving compute to where the data lives". Two panels side-by-side, 10px gap. LEFT panel (red, `#fce7e7` / `#d91515`): x=20, y=50, w=410, h=310. Header "Conventional von Neumann" plus grey sub-line "Compute and memory are separated by the bus". Three rounded rects in a row at y=120..180 representing the von Neumann triangle: white "CPU / GPU" (140×60), orange "DDR / HBM bus" (120×28, vertically centered at y=138..166), white "DRAM array" (140×60). Four black arrows connect CPU↔bus and bus↔DRAM (top arrows right-pointing at y=150, bottom arrows left-pointing at y=170). Below the row: bold "Energy cost" with two lines about per-op cost dominated by transport, then bold "What we live with" about the bandwidth wall. RIGHT panel (green, `#ecf7ec` / `#037f0c`): x=450, y=50, w=410, h=310. Header "Compute-in-Memory" plus grey sub-line "Arithmetic units inside the memory array". Inside it a white "DRAM bank (or SRAM array)" rect (378×110) holding four cell columns; each column has a light-blue "cells" rect on top and a small orange "ALU" rect underneath — the visual story of compute embedded inside the memory bank. Below: bold "Production examples" with body ("Samsung HBM-PIM — Aquabolt-XL: GEMV 8.9× speedup", "HyperCIM — multi-database / data-fabric LPU"); bold "Trade-off" with body ("Constrained operator set; analog or digital cells"); italic green "Bet: eliminate the dominant cost (data movement)". Two `<defs>` arrowhead markers (arrowR1 / arrowL1) declared at the bottom of the SVG.

**Issues found (severity-ranked):**
- HIGH (desktop): The "DRAM array" rect on the LEFT panel overshoots the panel's right border by 74px, crossing the inter-panel gap and clipping into the RIGHT panel. The arrows that end at x=363 then visually disappear behind the right panel border. This is a real geometry bug in the diagram, not a wrapper issue.
- HIGH (mobile): SVG does not scale; only the left half of the von-Neumann panel is visible. The actual story (compute embedded in memory) is on the right and never seen without horizontal scroll.
- MEDIUM (desktop): Hard-coded 880 width leaves dead space at 1014; with side-rail visible the right "Compute-in-Memory" panel right column clips under the fold.
- LOW: `<defs>` block sits at the END of the SVG (`CimDiagram.tsx:153-160`) rather than the start. Browsers tolerate forward references but the canonical order is `<defs>` first; consistent with the same finding from Section 12 (`HopperSmDiagram`) — same bug class.

**Concrete fix recommendations:**
1. Fix the LEFT panel geometry: shrink the DRAM array rect or the bus rect so the entire von-Neumann triangle fits inside x=36..420. Suggested layout: CPU/GPU at x=36 w=110 → ends at 146; bus at x=170 w=80 → ends at 250; DRAM at x=274 w=110 → ends at 384. Adjust arrow endpoints accordingly.
2. Make the SVG fluid (same as Sec 16/18/19 fixes).
3. On mobile, stack the two panels vertically (von-Neumann top, CIM below); the contrast story still reads when stacked because the colours and headers do the work.
4. Move the `<defs>` block to the top of the SVG for canonical order; same fix already recommended in Section 12.

---

## Summary

| Sec | Diagram | Hard-coded SVG width | FitViewOnResize | Overflow at 1014 col | Mobile (218) usable | HIGH issues |
|----:|---------|:--------------------:|:---------------:|:--------------------:|:-------------------:|:-----------:|
| 16 | TrainiumChipDiagram | 880 | n/a (inline SVG) | clean inside SVG | no — half off-screen | 2 |
| 17 | AwsCompilerStack | n/a (React Flow 100% × 440) | **MISSING** | tight (66px clearance) | no — nodes scattered | 1 |
| 18 | CerebrasWaferDiagram | 880 | n/a | clean inside SVG | no — GPU panel off-screen | 1 |
| 19 | DataflowSiliconDiagram | 880 | n/a | tight (SambaNova bw col) | no — SambaNova off-screen | 1 |
| 20 | CimDiagram | 880 | n/a | DRAM rect overshoots panel | no — CIM panel off-screen | 2 |

Cross-cutting prescription identical to Sections 1-15: (a) make every inline SVG fluid via viewBox + `style={{ width: '100%', height: 'auto', maxWidth: 880 }}` and drop the `overflowX: auto` wrapper; (b) every React Flow diagram ships with `FitViewOnResize` (ratchet rule — turn this into a Tier 1 deterministic gate). Section 20 has its own diagram-internal geometry bug (DRAM array rect overshoots the von-Neumann panel) that is independent of the wrapper pattern and needs a coordinate fix.
