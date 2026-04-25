# Sections 21-25 — Visual audit (2026-04-25)

Viewports: desktop emulation (Cloudscape AppLayout main column ~1014px wide with side rail collapsed; ~758px wide with side rail open — the latter is the fold) and mobile 390x844 (main column ~218px wide). Same cross-cutting pattern from the Sections 1-20 audits is intact: every inline SVG (Sec 21, 22b, 23, 24) is a hard-coded `width=880` (or `width=760`) SVG inside a `<div style={{ width: '100%', overflowX: 'auto' }}>` wrapper, so it never grows past its hard width on a wide screen and horizontally scrolls instead of scaling on mobile. Sections 22a and 25 are React Flow canvases with `fitView` set once at mount but no `FitViewOnResize` child — the cached transform from desktop is reused on mobile, leaving every downstream node stranded outside the viewport. The `FitViewOnResize` pattern still only exists in `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx`.

In addition, **two new bug classes show up in this band that are unique to Sections 22 and 24** and have not appeared in earlier sections:

1. **Bar-label overflow on log-scale-magnitude data (`MoeParamsChart`).** Total parameter counts span 46.7B → 1000B, but the chart uses linear scaling with maxTotal=1000. Every smaller MoE (Mixtral 8x7B, Mixtral 8x22B, GPT-OSS 120B, DBRX) renders with a bar narrower than the data label printed inside it, so the right-anchored "46.7B total" / "141B total" / "117B total" / "132B total" labels physically extend LEFT of the bar's left edge and overlay the model-name column. The white "active" labels suffer the same: they are positioned just inside the bar's leading edge, but the bar itself is 4-15px wide while the label is ~50px wide → white text spills onto the white background, becoming invisible.
2. **In-bar text overflow on small-byte rows (`PrecisionLadder`).** The 4-bit rows (NVFP4 / MXFP4) render at a 45px-wide bar but the inside-bar texts ("0.5 bytes" + "~ -6 to 6" / "similar — block-32") are 60-90px wide. The right "notes" column (Blackwell — block-16, OCP standard) starts immediately after the bar at `bw + 12`, so it sits on top of the in-bar overflow text.

Diagram and full-page screenshots are saved in `screenshots/` alongside this report.

---

## Section 21 — KV Cache and FlashAttention

### Layout audit (desktop, 1140 body / 1014 column when side rail collapsed)
- `KvCacheDiagram.tsx:7-8` — `width=880, height=380` hard-coded; SVG renders at 882×382. With side rail open the wrapper measures cw=758, sw=882 → 124px overflow → horizontal-scroll mode → the entire right "Attention variants" panel is partially under the fold (specifically the rightmost ~80px of the green right-card). With side rail collapsed (cw=1014) the SVG fits with ~132px of dead horizontal space on the right.
- `KvCacheDiagram.tsx:9` — `colW = (width - 60) / 2 = 410`. Left column at x=20..430, right column at x=440..850. The 30px gutter between columns is visually balanced.
- Inside the right card, three attention variants stack vertically with 92px row spacing (130 / 222 / 310). Each variant has its own Q-row (8 cells of 24×20 at y=154/246/334) and KV-row (8 cells / 2 fused cells / 1 fused cell at y=178/270/354). The 8-cell row spans x=(56+colW) to x=(56+colW + 7·28 + 24) = (496) to (716) — within the 850-wide SVG.
- `KvCacheDiagram.tsx:73, 84, 93` — the "8 Q · 8 KV" / "8 Q · 2 KV" / "8 Q · 1 KV" right-side annotations are positioned at `56 + colW + 240 = 736` and the SVG ends at 880, so they have 144px clearance.

### Layout audit (mobile, 390x844, column 218)
- Wrapper cw=218, sw=882 → SVG overflows by 664px. Only the leftmost ~218px (just the left "KV cache per attention layer" panel showing Layer 1 and the start of K[seq, kv_heads, dim]) is visible without horizontal pan. The right attention-variants card is entirely off-screen until horizontal scroll. The diagram's primary teaching value (MHA → GQA → MQA progressive shrink) is invisible on a phone unless the user scrolls horizontally.

### Diagram audit
**Diagram name:** KvCacheDiagram (`src/components/KvCacheDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 880×380 bordered card. Title at top-left ("KV cache layout — and how attention variants shrink it") at y=24. Two equal-width inner cards: left blue card (`#f2f8fd` / `#0972d3`) at x=20, y=50, w=410, h=310 titled "KV cache per attention layer" with grey sub-line "K and V tensors grow with sequence length per request". Inside the left card a vertical stack of 4 layer-rows (`#e1f0fb` / `#0972d3` outline, 48px tall each, 8px gap) starting at y=116; each row holds a "Layer N" tag at left (x=48) and two white-filled / blue-bordered tile rectangles labelled "K [seq, kv_heads, dim]" (x=120..260) and "V [seq, kv_heads, dim]" (x=272..412). Italic grey caption at y=350: "Size = 2 · layers · seq_len · kv_heads · head_dim · bytes_per_value".

The right green card (`#ecf7ec` / `#037f0c`) at x=450, y=50, w=410, h=310 titled "Attention variants" with sub-line "Each row halves the KV cache by reducing kv_heads". Three stacked variant blocks: (a) MHA at y=130 — title + sub-line + a row of 8 orange Q-cells (24×20) at y=154 + a row of 8 blue KV-cells at y=178 + caption "8 Q · 8 KV" at right; (b) GQA at y=222 — same Q-row + a fused KV-row of 2 wide blue cells (108×20) at y=270 + "8 Q · 2 KV"; (c) MQA at y=310 — Q-row at y=334 + a single 224×16 wide blue KV-rect at y=354 + "8 Q · 1 KV".

**Issues found (severity-ranked):**
- **HIGH (mobile)**: SVG does not scale; the right "Attention variants" card — which carries the entire MHA→GQA→MQA teaching — requires horizontal pan. On a phone the user sees only the left card and a sliver of the right.
- **HIGH (desktop, side-rail visible)**: 124px of the right card sits under the side-rail fold because wrapper cw (758) is narrower than the SVG (882). The "8 Q · 8 KV" / "8 Q · 2 KV" / "8 Q · 1 KV" labels at x=736 are scrolled away.
- **MEDIUM (desktop, side-rail collapsed)**: ~132px of dead horizontal space on the right at the 1014 column. The diagram looks left-justified rather than centred.
- **LOW**: The MQA fused KV-rect is 224px wide (matching 8 Q-cells of 28-stride width) — visually correct. But the GQA fused KV-rects are 108×20 each and span only x=(56+colW) to x=(56+colW+220), which is exactly the width of 8 Q-cells — also correct. There is no perceptual cue (e.g. arc / brace) showing which 4 Q-heads share each KV-pair in GQA. A reader has to infer the 4:1 grouping from text.
- **LOW**: The "K [seq, kv_heads, dim]" labels in each layer row are tight at fontSize 10 inside a 140×36 box — at any zoom-out they would clip.

**Concrete fix recommendations:**
1. Make the SVG fluid: keep `viewBox="0 0 880 380"`, drop the explicit `width={width}` / `height={height}` attributes, set `style={{ width: '100%', height: 'auto', maxWidth: 880 }}`, and remove the `overflowX: auto` wrapper. The viewBox + default `preserveAspectRatio="xMidYMid meet"` handles down-scaling cleanly. This is the same one-line fix needed for every other inline SVG in the deep dive.
2. On mobile (≤640px) consider re-flowing: stack the two cards vertically (left card on top, right card underneath) instead of side-by-side. A simple media query or `useResponsiveLayout` hook on the wrapper can swap colW from `(width-60)/2` to `width-40` and stack y positions.
3. Add subtle braces or arrows above the GQA Q-row to show 4-head groups feeding each KV pair — the geometry is already correct, just needs an annotation layer.
4. Consider replacing `K [seq, kv_heads, dim]` shorthand with `K tensor` and moving the shape annotation outside the box (e.g. a small caption "shape: [seq, kv_heads, dim]" below the layer stack).

---

## Section 22 — Mixture of Experts and Sparse Activation

This section has TWO diagrams: (a) `MoeRoutingDiagram` (React Flow canvas) and (b) `MoeParamsChart` (inline SVG bar chart). They have very different bug profiles.

### Layout audit (desktop, 1014 column)
- **MoE routing (React Flow):** container 1014×560, fitView ran at mount with padding 0.15 → viewport transform `matrix(0.9208, 0, 0, 0.9208, 106.472, 36)`. All 11 nodes (token, router, 8 experts, combine) fit within the canvas. Token at x=188..326, router at x=391..529, experts column at x=612..750, combine at x=851..989; rf right edge at 1096 → ~107px clearance for the combine node.
- **MoE params chart:** SVG `width=760` (note: not 880 — narrower than other inline SVGs). At 1014 column there is 254px of dead horizontal space. With side rail open (cw=758) the wrapper would be just barely wide enough (760 vs 758, 2px overflow → tiny scroll-bar appears).

### Layout audit (mobile, 218 column)
- **MoE routing (React Flow):** container 218×560, but viewport transform unchanged from desktop (`matrix(0.9208, 0, 0, 0.9208, 106.472, 36)`). Result: token at x=148..286 (right half off-screen), router at x=351..489 (entirely off-screen), expert column at x=572..710 (entirely off-screen), combine at x=811..949 (entirely off-screen). The diagram is effectively blank — only the left half of the token node and the left edge of the dot grid background are visible. This is the FitViewOnResize bug, third confirmed instance after Sec 15 (NvidiaCompilerStack) and Sec 17 (AwsCompilerStack).
- **MoE params chart:** wrapper cw=218, sw=762 → 544px overflow. Only the leftmost ~218px is visible — that is roughly the model-name column (right-anchored at x=190) and the start of the bars. None of the data is legible without horizontal pan.

### Diagram audit (a)
**Diagram name:** MoeRoutingDiagram (`src/components/MoeRoutingDiagram.tsx`)

**Current visual structure (rebuild brief):**
A React Flow canvas inside a 100%-wide × 560px-tall card with grey dot-grid background. 11 rounded nodes laid out left-to-right in four columns: column 1 — blue "Input token activation" at (0, 200); column 2 — orange "Router (gate net) top-k softmax" at (220, 200); column 3 — vertical stack of 8 experts at x=460, y=0/70/140/210/280/350/420/490, with Expert 2 and Expert 4 styled active (green-bordered solid `#ecf7ec` background) and the other six styled idle (grey dashed border, grey background); column 4 — dark navy "Weighted combine output activation" at (720, 245). 11 smoothstep edges: 1 token→router (blue, 2px solid), 8 router→expert (6 grey dashed 1px to idle experts, 2 green solid 3px animated to Expert 2 and Expert 4 with "route" label), 2 expert→combine (green solid 3px animated from Expert 2 and Expert 4). Node interactions disabled. No FitViewOnResize child.

**Issues found (severity-ranked):**
- **HIGH (mobile)**: All 9 of the 11 nodes (router, 8 experts, combine) sit outside the 218-wide viewport because `fitView` only runs at mount. The diagram is nearly blank; the user has to pan horizontally to see anything beyond "Input token activation".
- **MEDIUM (desktop, 1014 column)**: The diagram is heavily left-padded — token starts at 35% across the canvas, leaving the leftmost ~190px of the canvas as dead grey-dot space. Visually the layout reads as "stranded right" rather than "centred". Cause: the layout's leftmost x-coordinate is 0 (token), the rightmost is 720+150=870 (combine right edge), so total content width is 870. fitView with padding 0.15 scales to fit horizontally → scale = (1014 × 0.85) / 870 = 0.99, but the actual reported scale is 0.9208. Likely the vertical extent (e8 at y=490 + node height ~37 = 527 vs canvas 560 → tight) is the binding dimension, so the horizontal fit is loose.
- **MEDIUM**: The "route" edge label appears only on edges r-2 and r-4 (the two active routes), but it sits very close to the router→expert edge midpoints. At any narrower zoom the labels would overlap the dashed-grey idle edges that pass through the same horizontal band.
- **LOW**: The dark navy combine node has white text on a `#232f3e` fill — high contrast, fine. But the contrast jump from the rest of the diagram (which is all pastel fills with coloured borders) makes the combine node feel like it's from a different design system. Consider matching the existing `#0972d3` blue palette for "Weighted combine".
- **LOW**: 8 expert nodes is more than the typical Mixtral 8x7B uses for a teaching diagram. The vertical stack reaches y=490+37=527, leaving only 33px of bottom canvas padding at desktop. Any subtle row-height increase pushes Expert 8 off-canvas.

**Concrete fix recommendations:**
1. Add a `FitViewOnResize` child component (same pattern as `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx`) that calls `fitView({ padding: 0.15 })` on container resize. Single ratchet — every React Flow canvas in the deep dive should ship with this.
2. On mobile (≤640px) re-flow to a vertical layout: token → router on top, then a 4×2 grid of experts (instead of 1×8), then combine on the bottom. Or simpler — collapse to 4 representative experts with a "+ 4 idle" marker.
3. Re-centre the desktop layout by shifting all node x-coordinates left by ~80 (e.g. token at x=-80 or token shrinking minWidth from 150 to 130) so the diagram fills more of the canvas width.
4. Move the "route" edge labels to the start of the edge (just past router) instead of midpoint — they currently float in dead space between router and expert column.
5. Consider a subtle background tint behind the active route (e.g. a faint green vertical band behind Expert 2 + Expert 4) to make the "selected experts" semantics visible at a glance without reading edge styles.

### Diagram audit (b)
**Diagram name:** MoeParamsChart (`src/components/MoeParamsChart.tsx`)

**Current visual structure (rebuild brief):**
A 760×434 bordered card. Two-line title at top-left at y=20 / y=36 (stage-direction grey sub-line "Active params drive HBM bandwidth in decode; total params drive memory capacity"). Top-right legend: a 14×14 light-blue swatch + "Total params" at x=540, then a 14×14 solid-blue swatch + "Active params per token" below. Eight horizontal rows starting at y=50 (= margin.top), each 38px tall with 6px gap. Each row has: (1) right-anchored model name at x=190 (= margin.left - 10), (2) a light-blue total-params bar from x=200, width = `plotW × totalB / 1000` (plotW = 320), (3) a solid-blue active-params bar overlaid from x=200, width = `plotW × activeB / 1000`, (4) a right-anchored "{N}B total" label inside the total bar at x=`200 + totalW - 6` (text-anchor=end), (5) a left-anchored "{N}B active" white label inside the active bar at x=208, (6) routing meta to the right of the bars at x=520+10 — top-k value at y+16, expert count at y+30. Models in plot order: Mixtral 8x7B (46.7 / 12.9), Mixtral 8x22B (141 / 39), GPT-OSS 120B (117 / 5.1), DBRX (132 / 36), Qwen3-235B-A22B (235 / 22), Llama 4 Maverick (400 / 17), DeepSeek-V3/R1 (671 / 37), Kimi K2 (1000 / 32).

**Issues found (severity-ranked):**
- **HIGH**: Bar-label overflow for small-total models. plotW=320, maxTotal=1000 → Mixtral 8x7B totalB=46.7 yields a 14.94px-wide bar (x=200..215). The "46.7B total" label is text-anchor=end at x=208.94. With label fontSize 11 the rendered string is ~50px wide, so its left edge is at x≈159 — that's 31px LEFT of margin.left (200), which puts the label on top of (or right next to) the model-name "Mixtral 8x7B" at x=190 (right-anchored). Same issue: Mixtral 8x22B (141 → 45px bar, "141B total" label overshoots), GPT-OSS 120B (117 → 37px), DBRX (132 → 42px). Rendered screenshot confirms the labels visually collide with the model names.
- **HIGH**: Active-bar white-text invisibility. activeB ranges from 5.1B (GPT-OSS 120B) to 39B (Mixtral 8x22B). At maxTotal=1000, that's a bar width of 1.6px (5.1B) to 14.9px wide — the white "{N}B active" label at x=208 (just inside bar) is ~50px wide, so 35-49px of the white text spills onto the white background of the chart and is illegible. This kills the chart's primary value (active vs total comparison) for every row except the largest models. Same root cause as the issue above — linear scale with a 1000B max compresses the small models.
- **MEDIUM**: Title line "Total parameters vs active parameters per token (billions)" runs from x=200 and is ~360px wide. The legend "Total params" rect+text starts at x=540. The two collide at the right edge of the title — the title runs into the legend swatch.
- **MEDIUM**: The "Active params drive HBM bandwidth in decode; total params drive memory capacity" sub-line at y=36 also runs from x=200 and is ~430px wide → it ends at x≈630, well into the legend area; the legend ends up below or partially under the sub-line.
- **MEDIUM (mobile)**: 760-wide SVG inside a 218 wrapper → 544px overflow → 71% of the chart off-screen until horizontal pan. Same family of bug as Sec 21.
- **LOW**: The right-side "top-k / N experts" meta is at x=`margin.left + plotW + 10 = 530`. SVG width is 760, right margin is 240 → meta column has 220px of space. "128 + 1 shared" / "256 + 1 shared" / "384 + 1 shared" all fit.

**Concrete fix recommendations:**
1. Move the "{N}B total" labels OUTSIDE the bar — change text-anchor to `start` and position at `x = margin.left + totalW + 6`. The label sits to the right of the total bar instead of inside it. This eliminates the overflow on small bars.
2. Move the "{N}B active" labels OUTSIDE the bar too — same pattern, position to the right of the *active* bar, but only when activeW < some threshold (e.g. 40px). When the bar is wide enough to hold the label, keep it inside white. Conditional rendering: `if (activeW < 40) { renderOutside } else { renderInside }`.
3. Switch to a log-scale x-axis for total params, since the data spans 46.7 → 1000 (1.3 orders of magnitude). At log scale the smaller models would render at proportionally larger bars and the labels would naturally fit. Trade-off: log scale obscures the 1000B/46.7B ratio at a glance — a linear scale was probably chosen on purpose to communicate "Kimi K2 is 20× the size of Mixtral 8x7B". Decide based on intent.
4. Move legend below the title or to the bottom-right corner of the plot. Avoid stacking title + legend in the same horizontal band when the title runs >300px.
5. Same fluid-SVG fix as Sec 21: drop hard width/height attributes, use `style={{ width: '100%', maxWidth: 760, height: 'auto' }}`.

---

## Section 23 — Small Language Models

### Layout audit (desktop, 1014 column)
- `SlmParamsChart.tsx:28-32` — `width=880, height=margin.top + 14 × (28+4) + 30 = 528`. SVG renders at 882×529. Wrapper cw=1014, sw=1014 → no overflow at the wider fold. With side rail open (cw=758) the SVG would overflow by 124px → horizontal scroll on that fold.
- `SlmParamsChart.tsx:31` — margins: top=50, left=170, right=220, bottom=30 → plotW = 880 - 170 - 220 = 490. maxParams=16 (chosen so the 14B Phi-4 bar is 14/16 = 87.5% of plotW = 429px wide). All bars scale proportionally.
- `SlmParamsChart.tsx:62` — "{N}B" label is at `margin.left + w + 6` (outside the bar, text-anchor=start). For SmolLM2 135M: w = 490 × 0.135 / 16 = 4.13px → label at x=170+4.13+6 = 180.13. Reads cleanly because the label is OUTSIDE the bar (this is the correct pattern that `MoeParamsChart` should adopt).
- `SlmParamsChart.tsx:65` — meta text "{context} · {vendor}" at x=margin.left+plotW+12 = 672. SVG is 880 wide, so meta has ~208px of right-margin space. "32K (sliding window) · Mistral" is ~200px wide — fits but tight.

### Layout audit (mobile, 218 column)
- Wrapper cw=218, sw=882 → SVG overflows by 664px. Mobile capture shows model names visible (right-anchored at x=170-10=160, fits in 218 wrapper) and the leading edge of bars, but bar lengths and the right-side context/vendor column are cut off. The chart conveys "models in size order" but not the exact values.

### Diagram audit
**Diagram name:** SlmParamsChart (`src/components/SlmParamsChart.tsx`)

**Current visual structure (rebuild brief):**
An 880×528 bordered card. Title "The SLM lineup — from 135M to 14B parameters" at x=170, y=20; sub-line "All figures from each model's Hugging Face card or vendor blog" at y=36. Fourteen horizontal rows starting at y=50, each 28px tall with 4px gap. Each row: (1) right-anchored model name at x=160, (2) a solid blue bar (`#0972d3` fill + 1px stroke) from x=170, width = `490 × paramsB / 16`, (3) blue right-anchored "{paramsB}B" label at `x = 170 + w + 6` (text-anchor=start, OUTSIDE the bar — the correct pattern), (4) grey "{context} · {vendor}" meta at x=672. Models in plot order, smallest to largest: SmolLM2 135M (0.135), SmolLM2 360M (0.36), Qwen 2.5 0.5B, Gemma 3 1B, Llama 3.2 1B (1.23), Qwen 2.5 1.5B, SmolLM2 1.7B, Gemma 2 2B, Llama 3.2 3B (3.21), Phi-3-mini 3.8B, Gemma 3 4B, Mistral 7B (7.3), Qwen 2.5 7B, Phi-4 14B.

**Issues found (severity-ranked):**
- **HIGH (mobile)**: Same hard-coded-width pattern as Sec 21/22b — 880 SVG inside 218 wrapper. Bars and right-side meta are off-screen until horizontal pan.
- **MEDIUM (desktop, side-rail visible)**: 124px right-side overflow at the 758 fold; the "{context} · {vendor}" meta column is partially hidden under the side-rail fold.
- **LOW**: At fontSize 10 the meta text "32K (sliding window) · Mistral" is ~200px and SVG right-margin is 220 — within tolerance. If a future row adds a longer vendor/context combo it would clip.
- **LOW**: Phi-4 14B label "{14}B" has a redundant trailing zero issue from the earlier paramsB="1.23" (Llama 3.2 1B is paramsB=1.23, label "1.23B" — fine). All vendor cards render as expected.
- **LOW**: 14 rows is dense; on a desktop with the side rail open the chart is 528px tall in a 758-wide column and the rows feel cramped. Increasing rowGap from 4 to 6 would help, at the cost of total height.

**Concrete fix recommendations:**
1. Same fluid-SVG fix: drop hard width/height, use `style={{ width: '100%', maxWidth: 880, height: 'auto' }}` on the SVG, remove the `overflowX: auto` wrapper.
2. On mobile (≤640px), drop the right-side meta column ("{context} · {vendor}") and inline it after the size label: "0.135B · 8K · Hugging Face" on a single row. Reduces required width from 880 to ~ 600 and lets the chart fit a phone.
3. The "B" suffix is part of the y-axis label; consider replacing the "{N}B" right-side label with just "{N}" and showing a single "billions" axis caption underneath — saves ~10-15px per row.

---

## Section 24 — Quantization and Precision

### Layout audit (desktop, 1014 column)
- `PrecisionLadder.tsx:26-31` — `width=880`, `rowH=40`, 9 rows × (40 + 6) gap → height = 40 + 9·46 + 30 = 484. SVG renders at 882×485. Wrapper cw=1014, sw=1014 → no overflow at the wider fold. With side-rail open (cw=758), 124px overflow.
- `PrecisionLadder.tsx:31` — plotW = 880 - 130 - 30 = 720. maxBytes=8 → FP64 row gets the full 720px-wide bar. Bytes-per-value scaling: FP64=720, FP32/TF32=360, BF16/FP16=180, FP8=90, FP4 (NVFP4 / MXFP4) = 45.
- `PrecisionLadder.tsx:55-64` — each bar holds TWO inside-bar text rows: a top-line "{bytes} bytes" at y+17 fontSize 11 (fontWeight 700) and a sub-line "{range}" at y+33 fontSize 10. Notes column "{notes}" at x=`margin.left + bw + 12` outside the bar.
- The 4-bit rows (NVFP4 E2M1, MXFP4) have bw=45. The "{range}" sub-line for NVFP4 is "~ -6 to 6" (8 chars at fontSize 10 ≈ 50px) and for MXFP4 it is "similar — block-32" (~95px). Both overflow the 45px bar by 5-50px. Even worse, the "notes" column starts at `45 + 12 = 57px` past the bar's left edge — directly over the overflowed sub-line text.
- The 1-byte rows (FP8 E4M3, FP8 E5M2) have bw=90. Sub-line for FP8 E4M3 is "~10^4 — forward" (~75px) — fits inside 90px bar. FP8 E5M2 "~10^15 — backward" is ~95px — overflows the 90px bar by 5px.

### Layout audit (mobile, 218 column)
- Wrapper cw=218, sw=882 → 664px overflow. Mobile screenshot shows: format-name column (right-anchored at x=120) visible on the left, the leading ~100px of each bar visible (so the "{bytes} bytes" line is readable but the "{range}" sub-line is partly clipped), and the right notes column entirely off-screen. The smaller-byte rows (FP8 / FP4) clip even the "{bytes} bytes" line.

### Diagram audit
**Diagram name:** PrecisionLadder (`src/components/PrecisionLadder.tsx`)

**Current visual structure (rebuild brief):**
An 880×484 bordered card. Title "Precision ladder — bytes per value drives bandwidth-per-token directly" at x=20, y=26. Nine horizontal rows from FP64 (top) to MXFP4 (bottom), each 40px tall with 6px gap. Each row: (1) right-anchored format name at x=120, (2) coloured rounded rect from x=130, width = `720 × bytes / 8` — colour scheme grades down by precision: FP64 red (`#fce7e7` / `#d91515`), FP32/TF32 orange (`#fdf3ec` / `#ec7211`), BF16/FP16 blue (`#f2f8fd` / `#0972d3`), FP8 E4M3 / E5M2 green (`#ecf7ec` / `#037f0c`), NVFP4 / MXFP4 light-blue (`#e1f0fb` / `#0972d3`); (3) inside-bar top-line "{bytes} bytes" in border-colour fontSize 11 fontWeight 700 at x+8, y+17; (4) inside-bar sub-line "{range}" in dark `#16191f` fontSize 10 at x+8, y+33; (5) outside-bar grey notes at x=`margin.left+bw+12`, y+24. Rows: FP64 (8 bytes / ~10^308 dynamic range / HPC, scientific), FP32 (4 / ~10^38 / Master weights), TF32 (4 / FP32 storage, FP19 mantissa / Ampere internal), BF16 (2 / FP32 dynamic range, 7-bit mantissa / Training default), FP16 (2 / ~10^4 / Inference legacy), FP8 E4M3 (1 / ~10^4 — forward / Forward pass), FP8 E5M2 (1 / ~10^15 — backward / Gradients), NVFP4 (0.5 / ~ -6 to 6 / Blackwell — block-16, dual-level scale), MXFP4 (0.5 / similar — block-32 / OCP standard).

**Issues found (severity-ranked):**
- **HIGH**: Inside-bar text overflow on the 4-bit rows. NVFP4 sub-line "~ -6 to 6" is ~50px; MXFP4 sub-line "similar — block-32" is ~95px; both inside a 45px bar. The text physically extends past the bar's right edge into the notes column space. Combined with the notes column starting at `45 + 12 = 57px` past the bar's left edge, the overflow text and the notes ("Blackwell — block-16, dual-level scale" / "OCP standard") collide directly.
- **MEDIUM**: FP8 E5M2 sub-line "~10^15 — backward" is ~95px in a 90px bar — slight overflow. FP8 E4M3 "~10^4 — forward" fits.
- **MEDIUM (mobile)**: Same fluid-SVG bug — 880 in a 218 wrapper. The teaching value of the ladder ("each row halves the bytes") is lost because half-width-per-row is not visible without horizontal pan.
- **LOW**: Grammatical: "1 bytes" / "0.5 bytes" — for bytes=1 it should read "1 byte" (singular). Cosmetic but jarring on a precision-focused diagram.
- **LOW**: TF32 sub-line "FP32 storage, FP19 mantissa" is 130px and the bar is 360px wide — fits with comfortable margin. BF16 sub-line "FP32 dynamic range, 7-bit mantissa" is 165px in a 180px bar — fits but tight.
- **LOW**: The notes column has no left-side guideline; on rows where the bar is short and the notes are long (NVFP4, MXFP4) the notes float in mid-canvas without alignment to anything else.

**Concrete fix recommendations:**
1. Move the "{range}" sub-line OUTSIDE the bar for short-bar rows (bw < 100 or so). Use the same conditional pattern recommended for `MoeParamsChart`: if the bar is shorter than the label, render the label to the right.
2. Drop the "{range}" sub-line from inside the bar entirely; promote it to the notes column instead. Restructure: (a) format name on the left, (b) coloured bar with ONLY the bytes count inside, (c) notes column = "{range} — {notes}" (e.g. "~ -6 to 6 — Blackwell, block-16 dual-level scale"). Single text element per row, no overflow possible.
3. Fix the singular "1 byte" / "0.5 bytes" grammar — pluralise to "byte" when bytes === 1, "bytes" otherwise (and "0.5 bytes" stays plural by convention).
4. Same fluid-SVG fix as Sec 21.
5. Consider adding a "bytes per value" axis tick at the top (e.g. ticks at 0, 1, 2, 4, 8 bytes) so readers can read the bar lengths quantitatively even when text is hidden. Currently the bar length is the data and the text is the data — redundant in a way that breaks when the text overflows.

---

## Section 25 — Disaggregated Serving and Speculative Decoding

### Layout audit (desktop, 1014 column)
- `DisaggregatedServingDiagram.tsx:94` — container `100% × 460px`. fitView with padding 0.15 ran at mount → viewport transform `matrix(0.7946, 0, 0, 0.7946, 66, 53.6)`. All six nodes fit: request at x=148..283, router at x=322..457, prefill at x=513..648 (top), kv at x=704..839 (top right), decode at x=704..839 (bottom right), response at x=895..1030; rf right edge 1096 → ~66px clearance for the response node.
- The diagram has a top branch (request → router → prefill → kv) and a bottom branch (kv → decode → response), with the `kv → decode` edge using `sourcePosition: Bottom` / `targetPosition: Top`. Visually clean, two-row layout.
- Edge labels "prompt" (router→prefill), "KV cache" (prefill→kv), "transport" (kv→decode), "tokens" (decode→response) sit on the smoothstep edges; readable at desktop scale.

### Layout audit (mobile, 218 column)
- Container 218×460. Viewport transform unchanged: `matrix(0.7946, 0, 0, 0.7946, 66, 53.6)`. Result: request at x=108..243 (right edge of request just touching rf right edge at 260), router at x=282..417 (entirely off-screen), prefill at x=473..608 (off-screen), kv at x=664..799 (off-screen), decode at x=664..799 (off-screen), response at x=855..990 (massively off-screen). Mobile screenshot confirms only the "Inference request" node and a sliver of the dashed edge to the right are visible. This is the FitViewOnResize bug, fourth confirmed instance after Sec 15, Sec 17, and Sec 22a.

### Diagram audit
**Diagram name:** DisaggregatedServingDiagram (`src/components/DisaggregatedServingDiagram.tsx`)

**Current visual structure (rebuild brief):**
A React Flow canvas inside a 100%-wide × 460px-tall card with grey dot-grid background. Six rounded nodes laid out as a top branch (left-to-right) flowing into a bottom branch (right-to-left return): blue (`#f2f8fd` / `#0972d3`) "Inference request" at (0, 200), blue "Request router" at (220, 200), orange (`#fdf3ec` / `#ec7211`) "Prefill cluster — FLOP-rich GPUs (compute-bound)" at (460, 80), green (`#ecf7ec` / `#037f0c`) "KV cache transport — NIXL / NCCL over NVLink / EFA" at (700, 80), red (`#fce7e7` / `#d91515`) "Decode cluster — bandwidth-rich GPUs (memory-bound)" at (700, 280), blue "Streaming response" at (940, 280). Five animated smoothstep edges with arrow heads: request→router (blue, 2px), router→prefill (orange, 2px, label "prompt"), prefill→kv (green, 2px, label "KV cache"), kv→decode (green, 3px, label "transport" — uses Bottom→Top handles), decode→response (red, 2px, label "tokens"). Node interactions disabled. No FitViewOnResize child.

**Issues found (severity-ranked):**
- **HIGH (mobile)**: Five of six nodes off-screen because `fitView` only runs at mount. Diagram is effectively blank on mobile — only "Inference request" visible. Same root cause as Sec 22a, Sec 17, Sec 15.
- **MEDIUM (desktop)**: Response node clearance is 66px to the rf right edge — fine on a 1014 column but tight on smaller wide-screens (<900 effective column width); the response node could clip if the column shrinks for any reason.
- **LOW**: The "kv → decode" edge using Bottom→Top handles makes the transport step feel disconnected from the prefill→kv flow above. A reader has to track the "transport" label vertically rather than horizontally. Consider adding a faint dashed alignment guide between the top and bottom rows, or labelling the vertical edge as "KV transport (NIXL)" instead of just "transport".
- **LOW**: Three nodes share the green colour (kv at top, two green edges with stroke width 3). The colour signals "KV cache transport path" but a reader may also expect the decode cluster to be green if green = the "memory" tier. The decode cluster is red (bandwidth-bound). Consider adding a small legend or colour key — orange = prefill / compute-bound, green = KV / transport, red = decode / memory-bound.
- **LOW**: Edge label "tokens" on decode→response is the only outbound-facing label that signals the actual product (tokens to user). Could be promoted to "tokens to client" or styled with a different background colour to distinguish "user-facing data" from "internal transport".

**Concrete fix recommendations:**
1. Add `FitViewOnResize` child component — same as Sec 22a, Sec 17, Sec 15. This is the single ratchet that should be turned for every React Flow canvas in the deep dive.
2. On mobile (≤640px) re-flow vertically: request → router → prefill → kv → decode → response in a single column. Drop the two-row top/bottom branch since vertical screens have plenty of vertical room.
3. Re-label the kv→decode edge to "KV transport (NIXL / NCCL)" so the vertical edge is self-documenting.
4. Add a small legend below the canvas — three colour swatches with "Compute-bound (prefill)" / "Transport (KV cache)" / "Memory-bound (decode)" — reinforcing the reason the architecture splits.
5. Consider widening the rf canvas to 100% and increasing nominal node x positions slightly (request 0→20, response 940→960) so the response node has more right-clearance.

---

## Summary table

| Section | Diagram | Component | Type | Desktop fold (1014) | Desktop fold (758, side rail) | Mobile (218) | Severity |
|---------|---------|-----------|------|---------------------|-------------------------------|--------------|----------|
| 21 | KV cache layout | `KvCacheDiagram` | Inline SVG 880×380 | 132px dead space | 124px overflow → scroll → right card hidden | 664px overflow — only left card visible | HIGH (mobile + 758 fold) |
| 22a | MoE routing | `MoeRoutingDiagram` | React Flow 1014×560 | Fits but heavily left-padded | Fits | 9 of 11 nodes off-screen — FitViewOnResize bug | HIGH (mobile) |
| 22b | MoE params chart | `MoeParamsChart` | Inline SVG 760×434 | 254px dead space, label/legend overlap | 2px overflow (negligible) | 544px overflow | HIGH (label overflow on small bars + white text invisibility — both folds) |
| 23 | SLM lineup | `SlmParamsChart` | Inline SVG 880×528 | Fits, ~130px dead space | 124px overflow | 664px overflow | MEDIUM (mobile + 758 fold) |
| 24 | Precision ladder | `PrecisionLadder` | Inline SVG 880×484 | Fits, but inside-bar text overflows on 4-bit rows | 124px overflow + text overflow | 664px overflow + text overflow | HIGH (text overflow on FP4 / FP8 E5M2 + mobile) |
| 25 | Disaggregated serving | `DisaggregatedServingDiagram` | React Flow ~1014×460 | Fits with 66px right clearance | Fits | 5 of 6 nodes off-screen — FitViewOnResize bug | HIGH (mobile) |

**Cross-cutting ratchets to encode as deterministic Tier 1 gates:**

1. **No hard-coded SVG width**: every inline `<svg>` should use `viewBox` + `style={{ width: '100%', maxWidth: N, height: 'auto' }}` — never `width={N}` + `overflowX: auto` wrapper. Matches the pattern Sec 1-5 / 11-15 / 16-20 audits already flagged. A scripts/audit.sh playwright invariant could check that no svg in the deep dive has both a `width` attribute and an `overflowX: auto` parent — both at the same time means the SVG never scales.
2. **Every React Flow canvas needs `FitViewOnResize`**: today only `ChipletPathDiagram.tsx` and `TriangleDiagram.tsx` ship it. Sections 15, 17, 22a, 25 are confirmed broken on mobile because of this single missing primitive. A scripts/audit.sh invariant could check that every component importing `ReactFlow` also renders a `FitViewOnResize`-equivalent child.
3. **No bar-chart label inside short bars**: when a label width exceeds the bar width, render outside. `MoeParamsChart` violates this; `SlmParamsChart` and `PrecisionLadder` (for the bytes count) don't. Could be encoded as a render-time invariant: `if (label.width > bar.width) console.warn`.
4. **Sub-line text inside bars must fit at the smallest bar size in the dataset**: `PrecisionLadder` violates this on 4-bit rows. The fix is structural — move the secondary text out.

These are the same families of bug Sec 1-20 audits flagged. The fact that Sections 21-25 reproduce them confirms the patterns are codebase-wide, not section-specific. The single Tier 1 invariant ("no hard SVG width + overflowX auto") would lock in the fix for every inline SVG diagram in one ratchet.
