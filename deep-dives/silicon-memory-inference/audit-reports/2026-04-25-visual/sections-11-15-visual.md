# Sections 11-15 — Visual audit (2026-04-25)

Viewports: desktop 1440x900 (Cloudscape AppLayout main column rendered at ~1014px wide); mobile 390x844 (main column ~218px wide). All five diagrams ship a hard-coded `width=880` SVG wrapped by `<div style={{ width: '100%', overflowX: 'auto' }}>`. Confirmed: this means every diagram (a) does not grow when the column is wider than 880px (so on a 1440 monitor a small but real layout band of empty space sits to the right inside the wrapper) and (b) horizontally scrolls instead of scaling on mobile. The cross-cutting bug from Sections 1-10 is present in 11, 12, 13, 14. Section 15 has its own variant: React Flow with `fitView` set once at mount but no `FitViewOnResize` child, so when the viewport shrinks the previously-computed transform leaves nodes stranded outside the container. The `FitViewOnResize` component pattern only exists in `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx` today.

Diagram-only and full-page screenshots are saved in `screenshots/` alongside this report.

---

## Section 11 — Intel Xeon 6 Granite Rapids

### Layout audit (desktop, 1440x900)
- `Xeon6Topology.tsx:7` — `width = 880` is hard-coded. The Cloudscape main column is ~1014px wide, so 132px of empty space sits to the right of the SVG inside the `overflowX: auto` wrapper. The diagram never scales up.
- `Xeon6Topology.tsx:84,116` — IO die A is placed at `x=5` and IO die B at `x=width - ioW - 5 = 775`. Compute tile 1 starts at `x=30` (`Xeon6Topology.tsx:13` `startX=30`). The 100px-wide IO die A therefore sits from x=5 to x=105 and the leftmost compute tile sits from x=30 to x=250 — they overlap by ~75px. Same issue on the right.
- `Xeon6Topology.tsx:142,145` — the EMIB labels are positioned at the midpoint between the IO die's outer edge and the compute tile's inner edge. Because of the IO/tile overlap the EMIB midpoint lands inside the IO die's body — the label sits *behind/on top of* the "CXL 2.0" / "DSA / IAA" text, producing a visible "CXL 2.0EMIB" smashed string.
- The PCIe / UPI / CXL list inside IO die A at `Xeon6Topology.tsx:99-113` is partially obscured because Compute tile 1's blue rect renders over it.

### Layout audit (mobile, 390x844)
- The main column collapses to ~218px wide. SVG keeps its 882px rendered width and the wrapper switches to horizontal scroll. Only IO die A and roughly half of Compute tile 1 are visible without scrolling. The "IO die A overlaps Compute tile 1" bug is now extremely prominent because the user lands directly on it (see `sec11-xeon6-mobile.png`).
- Three NUMA tile panels and IO die B are completely hidden until the user pans right.

### Diagram audit
**Diagram name:** Xeon6Topology (`src/components/Xeon6Topology.tsx`)

**Current visual structure (rebuild brief):**
A 880×420 SVG against a white card, single horizontal band at y≈70..290 holding five panels. Two narrow orange-bordered rectangles (`#fdf3ec` fill, `#ec7211` stroke) at the far left (x=5, w=100) and far right (x=775, w=100) labelled "IO die A" / "IO die B"; each lists Intel 7 underneath, then a vertical text stack of `PCIe 5 / UPI / CXL 2.0 / DSA-IAA / QAT-DLB`. Between them, three larger blue-bordered rectangles (`#f2f8fd` fill, `#0972d3` stroke, w=220, h=220, gap=20) labelled "Compute tile 1/2/3", each listing Intel 3 + ~43 Redwood Cove cores, a Per-core block (L1, L2), a Tile L3 block (~160 MB · 40 CHA slices · 2.5 GHz), a Tile DDR5 block (4 channels · DDR5-6400/MRDIMM-8800), and an italic "NUMA domain" tag in blue. Two green "EMIB" labels (`#037f0c`, fontWeight 700) sit between IO die A↔Compute tile 1 and Compute tile 3↔IO die B at the vertical mid-line. Title at top, footer caption at bottom: "504 MB declared L3 (480 MB measured) · MDF stops at 2.5 GHz · Mesh per-core L3 BW ~30 GB/s".

**Issues found (severity-ranked):**
- HIGH: IO dies overlap their adjacent compute tile by ~75px on both sides (`Xeon6Topology.tsx:13,16-20,84,116`). The diagram becomes unreadable on the left and right edges.
- HIGH: EMIB labels are rendered behind/on top of the IO die text content, producing collisions like "CXL 2.0EMIB".
- HIGH (mobile): SVG does not scale; entire right-half (Compute tiles 2/3, IO die B, EMIB-right) requires horizontal scroll.
- MEDIUM (desktop): Hard-coded 880px width leaves dead horizontal space at 1440 viewport — diagram looks stranded in a wide column.
- LOW: Three compute tiles plus two IO dies = five panels on one row; even with the overlap fixed the rightmost tile would land at x=720, leaving the IO die B at x=775 only 55px wide of clearance — the layout is fundamentally too wide for this fixed canvas.

**Concrete fix recommendations:**
1. Make the SVG fluid: `viewBox="0 0 880 420"` plus `preserveAspectRatio="xMidYMid meet"` and `style={{ width: '100%', height: 'auto', maxWidth: 880 }}`; drop the `width`/`height` attributes from the SVG and remove the `overflowX: auto` wrapper.
2. Re-layout horizontally so panels do not overlap. With 880px and 5 panels, spend the budget as: left margin 8 + IO die 100 + gap 20 + tile 220 + gap 20 + tile 220 + gap 20 + tile 220 + gap 20 + IO die 100 + right margin 12 = 960. That is too wide for 880; either (a) widen the canvas to 980 or (b) reduce tile width to ~200.
3. Reposition EMIB labels into the actual bridge gap (post-fix x-coordinates) and consider drawing a thin green vertical line as the EMIB "bridge" so the label has a clear anchor.
4. On mobile (≤640px) consider stacking: render the three compute tiles as a vertical column with a single IO die "I/O complex" panel below, controlled by a CSS media query swapping between two SVGs or two `<g>` groups.

---

## Section 12 — NVIDIA Hopper (H100 / H200)

### Layout audit (desktop, 1440x900)
- `HopperSmDiagram.tsx:6-7` — `width=880, height=360` hard-coded; same wrapper pattern. SVG renders at 882px in a 1014px column → 132px of dead space.
- `HopperSmDiagram.tsx:50-52` — the "Async copy + TMA + cooperative groups" body text reads "Software-pipelined operand staging from L2 / HBM into SMEM. The compiler (CUTLASS, Triton, Inductor) decides when bytes land." That is rendered as a single SVG `<text>` line with `x=46`. At 11px it overshoots the inner box right wall (x=584) — "decides" runs into the SM box border, producing a subtle but visible clip.
- `HopperSmDiagram.tsx:55-57` — same pattern in the Warp scheduler body text: "Picks ready warps per clock; no speculation. Stalled warps yield to ready ones — latency hiding via concurrency, not branch prediction." Last words clip the box edge.
- `HopperSmDiagram.tsx:75-76` — the two arrows from SM to L2 / HBM start at `x1=600` (SM box right edge) and end at `x2=620` (L2/HBM column left edge). They cross only the 20px inter-panel gap, but the bottom arrow ends at `y2=266` which is inside the HBM rectangle's top portion (rectangle starts at y=196 and the "HBM" header text sits at y=220). The arrow head visually overlaps the bold red "HBM" header.

### Layout audit (mobile, 390x844)
- SVG stays 882px in a 218px wrapper — only the SM box header and the leftmost "Register file" sub-card are visible. SMEM, Tensor Core, async-copy strip, warp scheduler and the entire L2/HBM right column are off-screen.

### Diagram audit
**Diagram name:** HopperSmDiagram (`src/components/HopperSmDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×360 SVG. Left side: a large blue-bordered rounded rect (x=20, y=50, w=580, h=290) labelled "Streaming Multiprocessor (SM)" with sub-caption "64 concurrent warps · 32 threads / warp · max 32 thread blocks". Three side-by-side inner cards in a row at y=104..184: "Register file" (white/blue, 64K×32-bit, ≤255 reg/thread, ~1 cycle), "SMEM + L1" (green, 228 KB SMEM, 256 KB combined, ~10-15 ns), "4th-gen Tensor Core" (orange, FP8/BF16/FP16/TF32, wgmma, 3,958 TFLOPS FP8). Below them two full-width strips at y=200..256 and y=272..328: "Async copy + TMA + cooperative groups" and "Warp scheduler", each with a body sentence. Right side: a separate red-bordered column at x=620, two stacked panels — "L2 cache (device-wide), 50 MB H100/H200, ~150 ns class" (y=50..180) and "HBM, H100 80 GB HBM3 → 3.35 TB/s, H200 141 GB HBM3e → 4.8 TB/s (1.4×), ~250 ns latency" (y=196..340). Two black arrows from x=600 to x=620 connect the SM region to L2 (top arrow) and HBM (bottom arrow). Title at top.

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; right column (L2 + HBM) is entirely below the fold of horizontal scroll.
- MEDIUM: Async-copy and warp-scheduler body text overshoots the inner box right edge.
- MEDIUM: Bottom arrow tip lands inside the HBM panel header rather than at the panel's left edge.
- LOW (desktop): Hard-coded 880px width leaves dead space in the 1014px column.
- LOW: The arrow `markerEnd="url(#arrowL)"` is defined inline inside `<defs>` after the `<line>` references it. Browsers tolerate this but it is a reverse-order reference; better to put `<defs>` first.

**Concrete fix recommendations:**
1. Make SVG fluid (same pattern as Section 11 fix #1).
2. Wrap each long text line in `<foreignObject>` with HTML `<div>` so it word-wraps inside the inner box, or split into two SVG `<text>` lines manually.
3. Move arrow endpoints away from headers: target `y2` at the rectangle's mid-height instead of header text y.
4. Move `<defs>` block to top of `<svg>` for correctness.
5. On mobile, consider re-flowing the L2/HBM column underneath the SM box rather than to its right.

---

## Section 13 — NVIDIA Blackwell (B200 / B300)

### Layout audit (desktop, 1440x900)
- `BlackwellDieDiagram.tsx:7-8` — same `width=880, height=380` hard-code; same wrapper.
- `BlackwellDieDiagram.tsx:35-37` — Die A's bottom rows of memory text ("B300: 288 GB · 8 TB/s" at y=268, "UNKNOWN per-die HBM split" at y=290) sit inside the Die A rect (which spans y=50..300) but the italic UNKNOWN line is at y=290 — only 10px clearance to the bottom border. Visually tight but not clipped.
- `BlackwellDieDiagram.tsx:59-64` — the two paragraph footer captions sit *outside* the Die A and Die B rectangles at y=330 and y=350. They are inside the SVG viewBox (height=380) so they render, but they read like a single block of explanatory text rather than visually anchored to the diagram. No actual clipping.
- The diagram itself reads cleanly at desktop — Die A on the left, NV-HBI bridge in the middle, Die B on the right, no overlaps.

### Layout audit (mobile, 390x844)
- Same pattern: only Die A's left half is visible, NV-HBI and Die B require horizontal scroll. The footer captions at y=330/350 are below Die A but to read them the user must scroll back to x=20.

### Diagram audit
**Diagram name:** BlackwellDieDiagram (`src/components/BlackwellDieDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 SVG. Two equal blue-bordered rounded rects represent reticle-sized dies: Die A at x=20, y=50, w=350, h=250 and Die B at x=510, y=50, w=350, h=250 (`#f2f8fd` / `#0972d3`). Between them a smaller green-bordered rect at x=384, y=130, w=112, h=90 labelled "NV-HBI" with sub-text "High-Bandwidth Interface" and "~10 TB/s" in bold green. Die A contains a "Per-SM additions (Blackwell)" block (TMEM 256 KB, 5th-gen Tensor Core, tcgen05.mma, NVFP4 datapath) and a "Memory side" block (4 HBM3e stacks per die, B200 ~180 GB · 8 TB/s class, B300 288 GB · 8 TB/s) plus an italic blue "UNKNOWN per-die HBM split" footnote. Die B mirrors the layout and contains "Coherent presentation" (single CUDA device ID, unified address space, no NUMA, software-transparent NV-HBI) and "Memory side" (4 HBM3e stacks per die, aggregate HBM addressed as one). Below the dies: two grey caption lines about NVFP4 throughput and NVLink Gen 5 bandwidth. Title at top.

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; NV-HBI bridge and Die B are off-screen.
- LOW (desktop): Hard-coded 880px width; mild dead space in 1014px column.
- LOW: Footer caption rows at y=330 and y=350 visually float — consider boxing them or moving them into a Cloudscape `<Box variant="small">` outside the SVG, since they're not part of the die topology.
- LOW: "UNKNOWN per-die HBM split" italic at y=290 has only 10px clearance to the Die A bottom edge; tighter than other inter-text gaps in the same diagram.

**Concrete fix recommendations:**
1. Make SVG fluid (same as #1 above).
2. Move the two grey footer captions out of the SVG entirely and into the surrounding Cloudscape SpaceBetween — keeps the SVG strictly topological.
3. On mobile, re-flow Die A → NV-HBI → Die B vertically (top-to-bottom) rather than horizontally; NV-HBI then renders as a thin horizontal "bridge" between two stacked dies.

---

## Section 14 — Grace-Blackwell and UltraServer (NVL72)

### Layout audit (desktop, 1440x900)
- `Nvl72Diagram.tsx:7-8` — `width=880, height=360` hard-coded.
- `Nvl72Diagram.tsx:11-16` — grid is 9 cols × 8 rows, cells 38×22 with 6px gap. The grid spans roughly x=30..420, y=110..330. The right side panels (NVSwitch fabric, Grace CPUs, MoE callout) span x=420..840 — their left edge sits flush against the grid's right edge with no visual gap (`Nvl72Diagram.tsx:57,66,78` all use `x=420`).
- The grid label "72 × Blackwell B200 GPUs" (`Nvl72Diagram.tsx:52`) sits at y=102 above the grid. There's no equivalent grouping label for the right column of three panels.
- The MoE callout is the bottom-most element at y=272..340 — it just barely fits inside `height=360` with 20px clearance at the bottom.

### Layout audit (mobile, 390x844)
- Same `width=880` SVG / `overflowX: auto` wrapper. Mobile shows roughly the leftmost 4 columns of the GPU grid (~218px); the rest of the grid plus NVSwitch / Grace / MoE panels are hidden until horizontal scroll.

### Diagram audit
**Diagram name:** Nvl72Diagram (`src/components/Nvl72Diagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×360 SVG. Top-left: bold blue label "72 × Blackwell B200 GPUs" then a 9-column × 8-row grid of small rounded rects (38×22, blue-bordered) starting at x=30, y=110 with 6px gaps; each cell labelled "B200" centered. Right side: three vertically stacked panels at x=420, w=420 — (1) green-bordered "NVSwitch fabric — full bisection bandwidth" with "1.8 TB/s GPU↔GPU · 130 TB/s aggregate" sub-line, y=120..170; (2) orange-bordered "36 × Grace CPUs (LPDDR5X)" with NVLink-C2C 900 GB/s coherent + 480 GB LPDDR5X / CPU at ~500 GB/s + Total NVL72 RAM 13.4 TB HBM + 17.3 TB LPDDR5X, y=186..256; (3) red-bordered "The MoE-shaped fabric" with EP=64 (DeepSeek-R1: 256 experts / 4 per GPU) fits inside one NVLink domain + MNNVL all-to-all avoids the InfiniBand cliff for inter-node experts, y=272..340. Title at top reads "GB200 NVL72 — 72 GPUs in a single NVLink domain"; sub-caption summarises 1.8 TB/s + 130 TB/s + 13.4 TB.

**Issues found (severity-ranked):**
- HIGH (mobile): SVG does not scale; user only sees ~4 columns of the GPU grid, none of the right-column panels.
- MEDIUM: No visible connector lines between the GPU grid and the NVSwitch fabric. The diagram says "every GPU reaches every other GPU at 1.8 TB/s through NVSwitch" but there is no visual indication that the fabric panel *is* the connection. A reader sees four separate panels.
- LOW (desktop): Hard-coded 880px width — 132px dead space in 1014px column.
- LOW: The grid right-edge butts up against the right-column panels at x=420 with zero gap; a 12-16px gap would visually separate the two regions.

**Concrete fix recommendations:**
1. Make SVG fluid.
2. Draw a faint multi-line bundle from the grid's right edge to the NVSwitch panel's left edge to depict the all-to-all topology — even three or four diagonal lines would convey "fully meshed via switch".
3. Add a 16px gap between grid (ending at x≈408) and the right column (starting at x=424).
4. On mobile, stack: GPU grid on top (allowed to span full width, cell size scaled), NVSwitch / Grace / MoE panels stacked below it. This requires either two `<g>` groups switched by CSS or a re-render based on container width.

---

## Section 15 — NVIDIA Compilers and Kernel Tooling

### Layout audit (desktop, 1440x900)
- `NvidiaCompilerStack.tsx:107` — outer container `width: 100%, height: 460px`. `fitView` runs once at mount; on a 1014px-wide column the diagram fits (viewport transform `matrix(0.7946, ...)` scales the 940px-wide layout into the available width). Visually clean.
- `NvidiaCompilerStack.tsx:97` — the edge from `inductor → cutlass` carries the label `"matmul"`. React Flow renders edge labels at the midpoint of the edge path; with `smoothstep` routing the midpoint sits roughly on top of the arrowhead going into CUTLASS, so the label "matmul" visually collides with the arrow tip. The same pattern affects the "default" label on `inductor → triton` (mid-edge above the curve) and the "opt-in" label on `inductor → libs` (mid-edge below the curve), both of which read OK because the curves bend up/down. The `matmul` straight edge is the worst case.
- The "ptxas" label on the `ptx → sass` edge (`NvidiaCompilerStack.tsx:102`) sits cleanly mid-edge.

### Layout audit (mobile, 390x844)
- The React Flow container shrinks to ~218px wide but the viewport transform stays at the desktop-computed `matrix(0.7946, 0, 0, 0.7946, 66, 45.6541)`. Nodes render at their original layout positions (x=0 .. 940 in graph space, scaled by 0.7946 + offset). Result: only the leftmost "PyTorch model" node is visible — Inductor, Triton, CUTLASS, libs, PTX, and SASS are all off-screen to the right (see `sec15-nvidia-compilers-mobile.png`).
- `NvidiaCompilerStack.tsx:108-122` — the `<ReactFlow>` is *not* wrapped in a `<ReactFlowProvider>` and there is no `FitViewOnResize` child component using `useReactFlow().fitView()` inside a `ResizeObserver`. The codebase already has this fix in `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx` — Section 15 does not.

### Diagram audit
**Diagram name:** NvidiaCompilerStack (`src/components/NvidiaCompilerStack.tsx`)

**Current visual structure (rebuild brief):**
A React Flow canvas (460px tall, full container width, `fitView`) with seven nodes in three depth columns and one source/sink. Column 1 (blue, x=0): "PyTorch model (eager or torch.compile)". Column 2 (blue, x=220): "Inductor IR (graph capture)". Column 3 (green, x=460) is a vertical fan of three options: "Triton DSL (Python kernels)" at y=80, "CUTLASS / CuTe (C++ templates)" at y=200, "cuBLAS / cuDNN / cuTENSOR" at y=320. Column 4 (orange, x=700, y=200): "PTX (virtual ISA)". Column 5 (red, x=940, y=200): "SASS / cubin (Hopper / Blackwell)". Edges are smoothstep, animated, with arrow markers: PyTorch → Inductor (blue); Inductor → Triton (green, label "default"), Inductor → CUTLASS (green, label "matmul"), Inductor → libs (green, label "opt-in"); Triton/CUTLASS/libs all → PTX (green); PTX → SASS (orange, thicker, label "ptxas"). Background dots at gap=20.

**Issues found (severity-ranked):**
- HIGH (mobile): No `FitViewOnResize` — when the viewport shrinks the transform is stale and the graph effectively disappears off-screen. Same pattern as Sections 1 and 8 before their fix.
- MEDIUM: Edge label "matmul" on the straight Inductor → CUTLASS edge collides with the arrow tip going into CUTLASS.
- LOW (desktop): No `<ReactFlowProvider>` wrapper — required for `useReactFlow()` hook in any future `FitViewOnResize` child.
- LOW: All nodes have `draggable: false` but still render the default React Flow connection handles (small dots) on each side; could be cleaned up with `nodesConnectable={false}` (already set) plus CSS hiding `.react-flow__handle`.

**Concrete fix recommendations:**
1. Port the `FitViewOnResize` pattern from `ChipletPathDiagram.tsx`/`TriangleDiagram.tsx`:
   ```tsx
   import { ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react';
   function FitViewOnResize() {
     const { fitView } = useReactFlow();
     useEffect(() => {
       const el = document.querySelector('.react-flow');
       if (!el) return;
       const ro = new ResizeObserver(() => fitView({ padding: 0.15 }));
       ro.observe(el);
       return () => ro.disconnect();
     }, [fitView]);
     return null;
   }
   // wrap <ReactFlow> in <ReactFlowProvider> and render <FitViewOnResize /> as child
   ```
2. Move the "matmul" label to a labelBgPadding + labelBgBorderRadius + labelBgStyle background so it stays readable even on top of an arrowhead, or shift labelX/labelY off-edge by setting `labelStyle={{ transform: 'translateY(-12px)' }}`.
3. Hide React Flow handle dots with global CSS scoped to this diagram: `.react-flow__handle { opacity: 0; pointer-events: none; }`.

---

## Per-section summary table

| § | Diagram | Hard-coded SVG width | Wrapper `overflowX: auto` | Mobile scales | Internal layout collisions | React Flow `FitViewOnResize` | Severity |
|----|---------|---------------------|---------------------------|----------------|----------------------------|------------------------------|----------|
| 11 | Xeon6Topology | 880 | yes | no | YES — IO dies overlap compute tiles, EMIB labels collide | n/a | HIGH |
| 12 | HopperSmDiagram | 880 | yes | no | minor — body text clips inner box right edge; arrow tip lands on HBM header | n/a | MEDIUM |
| 13 | BlackwellDieDiagram | 880 | yes | no | none on desktop; everything off-screen on mobile except Die A | n/a | MEDIUM |
| 14 | Nvl72Diagram | 880 | yes | no | no overlap, but no connector lines from grid to NVSwitch | n/a | MEDIUM |
| 15 | NvidiaCompilerStack | n/a (React Flow) | n/a | NO — fitView stale on resize, only PyTorch node visible | edge label "matmul" collides with arrowhead | MISSING — needs port from Section 1/8 fix | HIGH |

**Cross-cutting fix to encode as a Tier 1 deterministic gate:** every inline-SVG diagram in this deep dive should drop hard-coded `width`/`height` SVG attributes and rely on `viewBox` + `preserveAspectRatio` + CSS `width: 100%`. A grep gate of the form "no `<svg ... width={number}` patterns under `src/components`" would lock this in. Section 11's tile/IO-die overlap is an authoring bug (not a wrapper bug) and is independent of the responsive fix — it should be fixed by re-spacing the SVG x coordinates or widening the canvas to ~960. Section 15 needs the `FitViewOnResize` + `ReactFlowProvider` port already proven in Sections 1 and 8.
