# Sections 26-30 — Visual audit (2026-04-25)

Final batch of the silicon-memory-inference deep-dive visual audit. Audited via Playwright MCP browser tools. Viewports tested:

- **Desktop**: the Playwright MCP harness clamps the browser viewport at 1152×720 even when `setViewportSize` requests 1440×900 — the Cloudscape AppLayout main column lands at ~1014px wide with the side rail collapsed, ~758px wide with the side rail open. The 1014 fold is what every screenshot in this batch captured for "desktop", consistent with the desktop fold used in the Sections 21-25 audit.
- **Mobile**: 390×844, AppLayout main column ~218px wide (Section 26-29) and ~260px (Section 30 — Glossary uses a wider Cloudscape Container and a horizontally-scrollable Table component, so the column metric differs).

The cross-cutting bug pattern from Sections 1-25 is intact for **every** Section 26-29 inline SVG: hard-coded `width=880` (Sec 26-28) or `width=920` (Sec 29) on the SVG element, no `preserveAspectRatio`, wrapped in a `<div style={{ width: '100%', overflowX: 'auto' }}>`. Result: at the 1014 desktop fold most diagrams just barely fit (CommunicationStack at 882 vs 1014 leaves 132px dead horizontal space; IsolationLayers/DeterminismDiagram do the same; TickToTradeDiagram at 922 leaves 92px), and at the narrower 758 fold every Section 26-29 diagram triggers a horizontal scrollbar. On mobile the entire batch triggers severe horizontal overflow (664-704 px of off-screen content per diagram).

Section 30 (Glossary and Sources) uses the shared `Glossary` and `SourcesAppendix` components with Cloudscape `Table` — these handle column overflow via Cloudscape's built-in horizontal scroll wrapper, so the bug class is different (Cloudscape default, not a per-component fix).

Diagram and full-page screenshots are saved in `screenshots/` alongside this report. The screenshot filenames follow the convention requested: `sec26-comm-desktop.png`, `sec26-comm-mobile.png`, `sec27-isolation-desktop.png`, etc.

---

## Section 26 — Communication and Scale-Out

### Layout audit (desktop, 1014 main-column fold)
- `CommunicationStack.tsx:18-23` — `width=880, rowH=56, rowGap=8, margin.top=50, layers.length=5` → SVG `height = 50 + 5·64 + 30 = 400`; renders at 882×402.
- Wrapper `<div style={{ width: '100%', overflowX: 'auto' }}>` measures 1014 wide → SVG fits without overflow at this fold (132px dead horizontal space on the right). At the side-rail-open 758 fold the SVG (882) overflows the wrapper (758) by 124px → horizontal scrollbar appears at the bottom of the diagram and the rightmost ~124px of every layer rectangle is clipped.
- The five layered rows are correctly stacked inside the SVG: Application (blue) at y=50, Collective library (green) at y=114, Transfer library NIXL (green) at y=178, Transport (orange) at y=242, Hardware (red) at y=306. Each row is a rounded rect at x=30..850 (width-margin.side*2 = 820), 56px tall.
- The "what it does" sub-line text inside each row sits at y+42 (e.g. "Issues collective operations (allreduce, allgather, all-to-all)"). Visible in the desktop screenshot — fits within the row width with comfortable padding.
- Section title at y=26 ("The communication stack — application to wire") is 13px bold and renders cleanly.

### Layout audit (mobile, 218 main-column fold)
- Wrapper cw=218, sw=882 → 664px overflow → horizontal scrollbar in the wrapper. Only the leftmost ~218px is visible without horizontal pan: roughly the row labels ("Application — PyTorch / JAX / Triton kernels", "Collective library — NCCL / Neuron CC-Cores / DeepEP", etc.) but the right edge of every row (where the row name continues for the multi-name rows like "Transport — EFA + SRD / NVLink / NeuronLink-v3") is cut off.
- The "what" sub-lines are equally cut off; only their first ~30 characters are visible.
- Mobile screenshot confirms: the user sees the layered structure (5 stacked rows in the correct colour sequence) but cannot read the full names without horizontal scroll.

### Diagram audit
**Diagram name:** CommunicationStack (`src/components/CommunicationStack.tsx`)

**Current visual structure (rebuild brief):**
A 880×400 bordered card on a white fill with `1px #e9ebed` border and 8px border-radius. Title at top-left at x=20, y=26: "The communication stack — application to wire" (13px bold, `#16191f`). Five horizontal rows stacked vertically starting at y=50, each 56px tall with an 8px gap between rows. Each row is a rounded `rect` (radius 6, 2px stroke, side margin x=30..850) with a tier-coloured fill + border:

1. **Application** (`#f2f8fd` / `#0972d3` blue) — "Application — PyTorch / JAX / Triton kernels" header at y+22, "Issues collective operations (allreduce, allgather, all-to-all)" sub-line at y+42.
2. **Collective library** (`#ecf7ec` / `#037f0c` green) — "Collective library — NCCL / Neuron CC-Cores / DeepEP" / "Implements the collective on top of the transport layer".
3. **Transfer library** (`#ecf7ec` / `#037f0c` green) — "Transfer library — NIXL" / "GPU-Direct RDMA without consuming SMs (used for KV cache handoff)".
4. **Transport** (`#fdf3ec` / `#ec7211` orange) — "Transport — EFA + SRD / NVLink / NeuronLink-v3" / "Reliable datagram delivery between GPUs / chips".
5. **Hardware** (`#fce7e7` / `#d91515` red) — "Hardware — Nitro v5 / NVSwitch / NeuronLink fabric" / "Physical layer, encryption, multi-path spraying".

Inside each row the title sits at x=44, y+22 (12px bold, coloured to match the border) and the sub-line at x=44, y+42 (11px regular, `#16191f`). No vertical arrows, no separators between layers — the colour-band sequence is the only visual cue that the stack reads top-down.

**Issues found (severity-ranked):**
- **HIGH (mobile)**: 664px horizontal overflow. The right ~75% of every row (including the second-half of multi-name rows like "Transport — EFA + SRD / NVLink / NeuronLink-v3" and "Hardware — Nitro v5 / NVSwitch / NeuronLink fabric") is off-screen until the user pans horizontally. The diagram's primary teaching value (the five labelled tiers) is half-readable on a phone.
- **HIGH (desktop, side-rail visible at 758 fold)**: SVG (882) overflows wrapper (758) by 124px. The right edge of every layer name is clipped behind the side-rail fold. This is the same fold-collision pattern as Sections 21-25.
- **MEDIUM (desktop, 1014 fold)**: 132px dead horizontal space on the right. The diagram appears left-justified rather than centred; could fill the column.
- **LOW**: No vertical "arrow" or "passes-down-to" indicator between the five rows. The colour sequence (blue→green→green→orange→red) implies a stack but a small chevron / `→` between rows would make the "application sits on top of collective sits on top of transport" semantic explicit.
- **LOW**: The two adjacent green rows (Collective library and Transfer library — NIXL) are visually indistinguishable at first glance because they share the same fill+border palette. Consider a slightly different green tint for NIXL, or annotate that they are sibling abstractions on the same tier ("library layer — collective vs point-to-point").
- **LOW**: The hardware row's red `#fce7e7` / `#d91515` palette reads as "warning / error" by Cloudscape convention. Hardware is not a warning state — consider a neutral grey or a dark navy `#232f3e` to convey "physical / silicon" without the warning semantic.

**Concrete fix recommendations:**
1. **Apply the cross-cutting fluid-SVG fix** (same one-line change every other Section 1-25 inline SVG needs):
   ```tsx
   <div style={{ width: '100%' }}>  {/* drop overflowX: 'auto' */}
     <svg
       width="100%"                   {/* was: width={880} */}
       viewBox="0 0 880 400"
       preserveAspectRatio="xMidYMid meet"
       style={{ ...existing, maxWidth: 880, height: 'auto' }}
       ...
     >
   ```
   The viewBox preserves all internal coordinates; the SVG scales down on narrower wrappers and never exceeds 880px on wide screens.
2. Add small downward chevrons (`▼` or 10×6 `polygon`) between the five rows at x=440 (centre), y=row+rowH+1 to row+rowH+rowGap-1. Visualises the "application calls into collective library calls into transfer library calls into transport calls into hardware" stack relationship.
3. On mobile, optionally re-flow to a single-column stack with each row's title and sub-line on separate stacked lines (no SVG; render as Cloudscape `Box` cards). The SVG buys nothing on a 218px column. A media-query branch at ≤640px that swaps to a flexbox column of cards would give a much better mobile experience.
4. Differentiate the two green rows: change Transfer library — NIXL fill to `#e8f4ec` (slightly more saturated) and label the row palette as "library layer — point-to-point" vs "library layer — collective" in a small italic caption below each.
5. Replace the hardware row's red palette with `#f3f3f3` / `#414d5c` (neutral grey) to remove the warning-state suggestion. Or use a dark-navy `#232f3e` fill with white text for "the silicon underneath".

---

## Section 27 — Isolation — NIE and MIG

### Layout audit (desktop, 1014 main-column fold)
- `IsolationLayers.tsx:5-8` — `width=880, height=360, colW=(880-60)/3 = 273.33`. SVG renders at 882×362.
- Wrapper measures 1014 → SVG fits without overflow at this fold (132px dead horizontal space). At the 758 fold the SVG overflows by 124px → horizontal scrollbar appears.
- Three pillars stacked side-by-side at x=20, x=40+colW=313.33, x=60+colW·2=606.67; each pillar is a 273.33×290 rounded rect (radius 10, 2px stroke). Pillar 1 (NIE) blue, Pillar 2 (MIG) green, Pillar 3 (Trainium SBUF) orange.
- Each pillar has 4 stacked text sections: title (y=78, 13px bold coloured) + sub-line (y=96, 11px grey), then four labelled blocks ("Mechanism", "Verification" / "Per-instance isolation" / "What it gives you", "Where it ships" / "Confidential computing" / "Where it ships", italic tagline at y=310/326). Each labelled block is ~50px tall.
- Within each pillar the text is anchored at x=margin+16 (column inset). Right edge of text in Pillar 3 sits around x=820, leaving 30px of column padding — text fits without clipping.

### Layout audit (mobile, 218 main-column fold)
- Wrapper cw=218, sw=882 → 664px overflow. Only Pillar 1 ("Pillar 1 — Host" / "Nitro Isolation Engine (NIE)") is partially visible without horizontal pan. Pillars 2 and 3 require horizontal scroll.
- The mobile screenshot shows Pillar 1's title "Pillar 1 — Nitro" plus the "Mechanism" / "Rust hypercall module beneath / the Nitro Hypervisor" lines, but the right ~80px of Pillar 1 is also clipped — including the italic blue tagline "First formally verified / cloud hypervisor" at y=310/326 which has its right half cut off.
- The whole "comparative side-by-side" message of the three-pillar diagram is lost on mobile.

### Diagram audit
**Diagram name:** IsolationLayers (`src/components/IsolationLayers.tsx`)

**Current visual structure (rebuild brief):**
An 880×360 bordered card. Title at x=20, y=26: "AWS three-pillar isolation story — host, accelerator, software". Three side-by-side pillar columns (each ~273×290 rounded rect, radius 10, 2px stroke, 20px gap between pillars):

- **Pillar 1 — Host** (blue `#f2f8fd` / `#0972d3`) — title "Pillar 1 — Host" (13px bold), sub-line "Nitro Isolation Engine (NIE)" (11px grey). Then four labelled sections: **Mechanism** ("Rust hypercall module beneath / the Nitro Hypervisor"), **Verification** ("Isabelle/HOL proof / ~250,000 lines · 30 min check"), **Where it ships** ("Graviton5 (M9g preview Dec 2025) / C9g, R9g — 2026"), italic tagline ("First formally verified / cloud hypervisor"). Section labels are 12px bold `#16191f`; section bodies are 11px regular `#16191f`.
- **Pillar 2 — Accelerator** (green `#ecf7ec` / `#037f0c`) — sub-line "MIG + TEE-I/O on NVIDIA". Sections: **Mechanism** ("Hardware partitioning of GPU / into up to 7 instances"), **Per-instance isolation** ("Dedicated SMs, L2 slice, / HBM region + bandwidth"), **Confidential computing** ("TEE-I/O on Blackwell / Encrypted GPU memory + NVLink"), italic tagline ("B300: up to 7 × ~34 GB / per MIG instance").
- **Pillar 3 — Software** (orange `#fdf3ec` / `#ec7211`) — sub-line "NEFF AOT on Trainium". Sections: **Mechanism** ("Compiler-managed SBUF / + ahead-of-time schedule"), **What it gives you** ("Per-call deterministic output / No cache contention possible"), **Where it ships** ("Trainium2, Inferentia2 / Trn2 UltraServer (64 chips)"), italic tagline ("Reproducibility as a / first-class property").

The three pillars are visually parallel: same dimensions, same y-coordinates for each labelled block, same italic tagline placement. The colour-coding (blue/green/orange) is the only differentiator. Section labels use the same vertical positions across all three pillars (y=124 / y=186 / y=248 / y=310-326).

**Issues found (severity-ranked):**
- **HIGH (mobile)**: 664px overflow. Pillars 2 and 3 are entirely off-screen and Pillar 1's right edge is also clipped. The user cannot see the comparative three-pillar structure without horizontally panning, which kills the diagram's primary teaching point.
- **HIGH (desktop, 758 fold)**: 124px overflow. Pillar 3's right ~80px (including the italic "Reproducibility as a / first-class property" tagline) is clipped behind the side-rail fold.
- **MEDIUM**: Pillar 2's section structure is **asymmetric** vs Pillars 1 and 3. Pillars 1 and 3 use the pattern "Mechanism / Verification or What-it-gives-you / Where it ships / italic tagline". Pillar 2 uses "Mechanism / Per-instance isolation / Confidential computing / italic tagline" — the third section is "Confidential computing" (a feature) rather than "Where it ships" (a deployment fact). This breaks the visual parallelism of the three-column layout. A reader scanning the third row across pillars sees deployment / deployment / NOT-deployment, which is jarring.
- **MEDIUM**: The third section of each pillar varies in semantic content even within the parallel layout: "Verification" (Pillar 1) vs "Per-instance isolation" (Pillar 2) vs "What it gives you" (Pillar 3). These are three different question types — "how do you trust it" vs "how is it carved up" vs "what's the user-facing benefit". A consistent question-type per row would make horizontal scanning cleaner.
- **LOW**: The italic taglines at y=310/326 are 11px italic and run very close to the bottom of the pillar rect (290px tall, rect ends at y=340, taglines at y=310/326 — only 14px of bottom padding). Visually tight.
- **LOW**: Pillar 2's "B300: up to 7 × ~34 GB / per MIG instance" is the only quantitative value in the entire diagram. Pillar 1's "~250,000 lines · 30 min check" and Pillar 3 has no number. This is a content-density mismatch — Pillar 2 reads as more concrete/measurable.
- **LOW**: 16px left-padding inside each pillar (x=margin+16) is generous for a 273-wide column. Could tighten to 12px and gain 8px of horizontal text room — useful for the longer single-line strings like "Nitro Isolation Engine (NIE)".

**Concrete fix recommendations:**
1. **Cross-cutting fluid-SVG fix** (same as Section 26): drop the explicit `width={880}` attribute on the SVG, set `width="100%"`, add `preserveAspectRatio="xMidYMid meet"`, set `style={{ maxWidth: 880, height: 'auto' }}`, drop the `overflowX: 'auto'` wrapper.
2. **On mobile (≤640px) re-flow vertically**: stack the three pillars in a vertical column (each pillar at full mobile width, ~218px wide, ~280px tall — slight reduction since the labelled blocks no longer need to fit a 273-wide column). Same colour-coding, same labelled-block content. Either as an SVG variant or as three Cloudscape `Container` cards.
3. **Restructure Pillar 2's labelled blocks for visual parallelism**:
   - Pillar 1 (Host): Mechanism / Verification / Where it ships / tagline
   - Pillar 2 (Accelerator): Mechanism / **Per-instance isolation** / **Where it ships** ("B300, H200, A100") / tagline. Move "Confidential computing — TEE-I/O on Blackwell / Encrypted GPU memory + NVLink" into a fourth section or into the "Where it ships" body so the third row across pillars consistently answers "deployment".
   - Pillar 3 (Software): Mechanism / What it gives you / Where it ships / tagline.
   Or alternatively, change all three pillars to the question template "Mechanism / Property / Deployment / Tagline" and keep all content under those four labels.
4. Add a top-level subtitle row above the three pillars: "Host" / "Accelerator" / "Software" as 14px bold centered above each pillar (at y=40, before the pillar rect at y=50). This makes the three-pillar structure legible at a single glance, before reading any pillar content.
5. Tighten the bottom padding by reducing pillar height from 290 → 270 (rect ends at y=320), and pull the italic tagline up to y=290/306 so there's 14px of bottom padding.

---

## Section 28 — Determinism — NEFF AOT and GPU Reproducibility

### Layout audit (desktop, 1014 main-column fold)
- `DeterminismDiagram.tsx:5-8` — `width=880, height=360, colW=(880-60)/2=410`. SVG renders at 882×362.
- Wrapper cw=1014, sw=1014 → no overflow at this fold; 132px dead horizontal space. At the 758 fold, 124px overflow → horizontal scrollbar.
- Two side-by-side panels of equal width (410×290): left orange Trainium panel at x=20, right blue NVIDIA panel at x=40+colW=450. 30px gutter between panels.
- Inside each panel: title (13px bold coloured) at y=78, sub-line (11px grey) at y=96, two labelled blocks at y=124 and y=236 ("Why it is automatic" / "What you get" left; "What you turn on" / "What it costs" right), italic tagline at y=300/316.
- The left panel uses a bullet-style list ("• Schedule is fixed in the NEFF binary" etc., five lines starting at y=144). Right panel mirrors with five bullets starting at y=144.
- Right panel "What it costs" block is two lines ("Throughput drop (deterministic kernels / are not always the fastest)") at y=254/270. Left panel "What you get" is also two lines ("Same NEFF + same input + same silicon / → bit-exact same output, same order").

### Layout audit (mobile, 218 main-column fold)
- Wrapper cw=218, sw=882 → 664px overflow. Only the left panel ("Trainium — determinism by construction") is partially visible. Right NVIDIA panel entirely off-screen.
- Mobile screenshot confirms: the user sees the orange-bordered Trainium panel header and the first few bullets of "Why it is automatic" but nothing of the comparative NVIDIA panel.
- Without horizontal pan, the side-by-side comparative architecture is invisible — the diagram's entire teaching point ("two paths to the same property") is lost.

### Diagram audit
**Diagram name:** DeterminismDiagram (`src/components/DeterminismDiagram.tsx`)

**Current visual structure (rebuild brief):**
An 880×360 bordered card. Title at x=20, y=26: "Determinism — two architectural paths to the same property". Two side-by-side panels (each 410×290, radius 10, 2px stroke, 30px gutter):

- **Left panel — Trainium (orange `#fdf3ec` / `#ec7211`)** — title "Trainium — determinism by construction", sub-line "NEFF ahead-of-time compilation". Block 1 "Why it is automatic" (label at y=124) with 5 bullets at y=144/160/176/192/208: "• Schedule is fixed in the NEFF binary / • No runtime kernel selection / • No warp scheduler decisions / • No cache contention (compiler-managed) / • Reduction order baked into schedule". Block 2 "What you get" (label at y=236) with 2 lines at y=254/270: "Same NEFF + same input + same silicon / → bit-exact same output, same order". Italic tagline at y=300/316: "Audit reconstruction is replay, / not approximate reproduction."
- **Right panel — NVIDIA GPU (blue `#f2f8fd` / `#0972d3`)** — title "NVIDIA GPU — determinism opt-in", sub-line "CCCL + cuBLAS / cuDNN flags". Block 1 "What you turn on" (label at y=124) with 5 bullets at y=144/160/176/192/208: "• cuBLAS deterministic mode / • cuDNN deterministic kernel selection / • CCCL 3.1 collective determinism / • PRNG seeding + reduction order / • Avoid atomic-add reductions". Block 2 "What it costs" (label at y=236) with 2 lines at y=254/270: "Throughput drop (deterministic kernels / are not always the fastest)". Italic tagline at y=300/316: "Achievable, but you opt into it / and validate per-kernel."

Visually parallel: same panel dimensions, same y-coordinates for blocks, same bullet count (5+2) per panel. The colour-coding (orange = automatic, blue = opt-in) reinforces the title-line claim. Bullets use `•` U+2022 prefix at fontSize 11.

**Issues found (severity-ranked):**
- **HIGH (mobile)**: 664px overflow. The right NVIDIA panel is entirely off-screen. The diagram's whole comparative-architecture point is invisible without horizontal pan.
- **HIGH (desktop, 758 fold)**: 124px overflow. The right NVIDIA panel's right ~80px (including the italic tagline) is clipped behind the side-rail fold.
- **MEDIUM**: The bullet `•` characters at x=36 (left panel) / x=56+colW (right panel) are followed by text starting at the same x — meaning the bullet and the text are in a single text element. Readable but the bullet doesn't indent. Compare to a typical "  • Item" pattern with 2-space indent — current rendering looks slightly cramped.
- **MEDIUM**: Block 2 label "What you get" (left) vs "What it costs" (right) is asymmetric in question type — one is the benefit, the other is the cost. A reader scanning horizontally sees benefit-on-left, cost-on-right which implies "Trainium has a benefit, NVIDIA has a cost" rather than "both have trade-offs". The actual content is symmetric (both panels reach determinism with different cost profiles), but the label asymmetry biases the read. Consider renaming to "What you get" / "What you give up" or "Outcome" / "Trade-off" matched.
- **LOW**: Five bullets per panel is dense. The rightmost ends of "Reduction order baked into schedule" and "CCCL 3.1 collective determinism" are at roughly the same x ~340 (left panel) and ~770 (right panel). Plenty of right-padding inside each panel — text doesn't clip. But on a narrower fold (758) the right panel's bullets would be hidden behind scroll.
- **LOW**: The italic tagline in each panel is 11px italic and tightly packed at y=300/316. Same bottom-padding tightness as IsolationLayers — only 14px of bottom space in a 290px-tall panel.
- **LOW**: Left panel block 2 second line "→ bit-exact same output, same order" uses an arrow character `→` (U+2192). Right panel doesn't. The asymmetry is minor but reads as an inconsistency.

**Concrete fix recommendations:**
1. **Cross-cutting fluid-SVG fix** (same as Sections 26-27).
2. **On mobile (≤640px) re-flow vertically**: stack the two panels (Trainium on top, NVIDIA below). Each panel at full mobile width.
3. **Match block 2 labels for visual parallelism**: rename to "Outcome" / "Outcome" (with the panels' content describing the determinism property each delivers) AND add a third block "Trade-off" to both panels — left would be "Trainium: schedule is fixed at compile time; less flexibility for new kernel autotuning"; right would be "NVIDIA: throughput drop, per-kernel validation". This makes the comparison balanced and the visual structure parallel.
4. Indent bullets — replace `• Schedule...` with `  • Schedule...` (2-space prefix) or split the `•` into a separate `<text>` at x+8 and the body at x+16.
5. Consider adding an outcome-shared band at the top: a thin grey strip across both panels labelled "Both paths deliver: same input + same silicon → bit-exact same output". Visually anchors the "two paths to the same property" thesis.

---

## Section 29 — Capital Markets Lens

This section has TWO authored sub-components: (a) the `TickToTradeDiagram` inline SVG and (b) the "Differential Machine Learning" container with NO inline diagram (rich text + Cloudscape Alerts only). Per the audit brief, only (a) needs the diagram audit; (b) gets a layout/text audit.

### Layout audit (desktop, 1014 main-column fold)
- `TickToTradeDiagram.tsx:27-30` — `width=920, height=360, margin.{top:50, left:30, right:30, bottom:30}, lane=(920-60)/7 = 122.86`. SVG renders at 922×362. **Note this is the only Section 26-30 diagram with width=920 rather than 880** — even tighter at the 758 fold.
- Wrapper cw=1014, sw=1014 → fits with 92px dead horizontal space. At the 758 fold the SVG (922) overflows by 164px → **the largest overflow of the batch at the narrower fold**.
- Seven stage boxes laid out left-to-right with `boxW = lane - 16 = 106.86`. Each box is 240px tall (yBox = 50+20=70 to y=310). Box positions: stage 1 x=38, stage 2 x=160.86, stage 3 x=283.71, stage 4 x=406.57, stage 5 x=529.43, stage 6 x=652.29, stage 7 x=775.14 (right edge x=882, well within 922 width).
- The screenshot shows boxes 1-7 are correctly drawn but at a 1014 wrapper viewport, box 7 is not clipped — fine. At the 758 fold, boxes 5-7 would be hidden behind the scroll.
- Each stage box has: numbered circle (radius 11) at top-left, stage name (11px bold) at right of circle, "What happens" label + detail (10px) at y+56/y+72, "Latency budget" label at y+130, latency value at y+148 (11px bold coloured).
- Arrows between stages: small 1.5px black lines from x=lane*i-laneInset to lane*i+laneInset at y=190 (yBox + boxH/2 = 70 + 120). 5px arrowheads.

### Layout audit (mobile, 218 main-column fold)
- Wrapper cw=218, sw=922 → 704px overflow (the largest overflow of the audited batch). Only stage 1 ("Tick arrives at NIC") is visible. Stages 2-7 require horizontal scroll.
- The diagram's primary teaching value (the seven-stage tick-to-trade pipeline with per-stage latency budgets) is invisible on mobile without horizontal scroll. The numbered circle and stage 1 label are visible; the latency-budget value below stage 1 is also visible. But the colour-banding pattern (blue→blue→orange→green→orange→blue→blue, signaling "transport / book-update / strategy / order-gen / send / wire" tiers) cannot be seen.

### Diagram audit (a)
**Diagram name:** TickToTradeDiagram (`src/components/TickToTradeDiagram.tsx`)

**Current visual structure (rebuild brief):**
A 920×360 bordered card. Title at x=30, y=20: "Tick-to-trade pipeline — where every nanosecond is fought for". Sub-line at y=36: "The full HFT round trip is in the low microseconds. Memory-architecture choices land squarely on stages 3 and 4." Below the title: a horizontal pipeline of 7 vertical-rectangular stage boxes, each ~107×240px, with arrows between them.

Each stage box has a coloured fill and 2px stroke matching the per-stage tier:

1. **Tick arrives at NIC** (blue `#f2f8fd` / `#0972d3`) — "Multicast UDP from exchange feed handler" / **~hundreds of ns**.
2. **OS-bypass receive** (blue) — "Solarflare / EFA / DPDK lifts directly to user space" / **~hundreds of ns**.
3. **Decode + book update** (orange `#fdf3ec` / `#ec7211`) — "Order book state updated; cache-resident" / **~µs**.
4. **Strategy / inference** (green `#ecf7ec` / `#037f0c`) — "Decision logic; may include AMX or accelerator inference" / **~µs to 10s of µs**.
5. **Order generation** (orange) — "Build outgoing message; risk check" / **~hundreds of ns**.
6. **OS-bypass send** (blue) — "Write directly to NIC TX ring" / **~hundreds of ns**.
7. **Order on the wire** (blue) — "Out to colo switch and exchange" / **~hundreds of ns**.

Inside each box: a numbered circle (11px radius, fill matches border) at top-left at (x+14, yBox+16) with white-bold-centered numeral; stage name (11px bold `#16191f`) at (x+32, yBox+20). "What happens" label (10px bold, x+8, yBox+56), detail body text (10px regular, x+8, yBox+72) — body is `tspan`-wrapped on `\n` but no source detail string contains `\n`, so it renders as a single wrapped line. "Latency budget" label (10px bold, x+8, yBox+130). Latency value (11px bold, coloured) at x+8, yBox+148. Bottom 92px of each box is empty.

Between adjacent stages: a 1.5px solid black horizontal line + a 5×8 filled triangle arrowhead at the receiving box's leading edge, both at y=190 (vertical midpoint of box).

**Issues found (severity-ranked):**
- **HIGH (mobile)**: 704px horizontal overflow (largest of the batch). Six of seven stages off-screen. The diagram becomes a single visible box on phones.
- **HIGH (desktop, 758 fold)**: 164px overflow (largest of the batch at this fold) because the SVG is 920 wide (not 880). Stages 5-7 partially or fully hidden behind the side-rail fold. The stages 3-4 callout in the sub-line ("Memory-architecture choices land squarely on stages 3 and 4") loses its visual punch when stages 5-7 are scrolled away.
- **MEDIUM**: Each box is 240px tall but the bottom ~92px is empty white space (latency budget value at y=148, box bottom at y=240). The information density of each stage is low — name + 1 detail + 1 budget = 3 data points in a 107×240 box.
- **MEDIUM**: The numbered circle (radius 11, diameter 22) overlaps the stage name when the stage name is short. For "Order generation" (stage 5), the name starts at x+32 and the circle's right edge is at x+25 — 7px gap, fine. For longer names like "Decode + book update" (stage 3, ~120px wide rendered) the name extends past the box's right padding (boxW=107, name at x+32, ~120px wide → ends at x+152, well past the 107px-wide box) — **the name string overflows the right edge of stage 3's box**. Same for stage 4 "Strategy / inference" (~96px wide, fits) and stage 6 "OS-bypass send" (~86px wide, fits) but stage 3 in particular has visible text-clipping at the box's right border. (Verifiable in the desktop screenshot: stage 3's "Decode + book up…" appears to clip; the desktop screenshot confirms a tight fit with no `text-overflow` handling.)
- **MEDIUM**: The arrow polygon `points={\`${x2},${y} ${x2 - 5},${y - 4} ${x2 - 5},${y + 4}\`}` at line 93 — `x2 = margin.left + (i + 1) * lane + laneInset`. The arrowhead points right (towards the receiving box). Geometry fine. But the arrows are very small (5×8 px) at this scale, easy to miss given the strong colour-banding of the boxes themselves.
- **LOW**: The detail text "Decision logic; may include AMX or accelerator inference" for stage 4 is the longest detail string (~62 characters). At fontSize 10 in a 107-wide box with x+8 padding, this string would extend ~115px from x+8 to x+123, which overflows by 24px. Similar issue for stage 1 ("Multicast UDP from exchange feed handler" ~38 chars, ~80px wide, fits) and stage 2 ("Solarflare / EFA / DPDK lifts directly to user space" ~52 chars, ~105px wide, marginal). Stage 3 ("Order book state updated; cache-resident" ~40 chars, ~84px wide, fits). Stage 4 is the worst offender. The `tspan` mapping at line 69-73 supports newline wrapping but no source detail contains `\n` so wrapping doesn't kick in.
- **LOW**: "Latency budget" label at y+130 vs latency value at y+148 — only 18px gap, value is 11px tall, label is 10px tall + descender. Tight but readable.
- **LOW**: Stage colour semantics ("blue = transport, orange = software CPU, green = compute") are encoded in the stage fills but never explained in the diagram. A small legend below the stages (e.g. "blue = transport-bound, orange = CPU-bound, green = compute-bound") would make the colour pattern legible.

**Concrete fix recommendations:**
1. **Cross-cutting fluid-SVG fix** (same as Sections 26-28). Note width here is 920 (not 880) — preserve the larger viewBox.
2. **On mobile (≤640px) re-flow vertically**: stack the seven stages as a vertical pipeline (each stage at full mobile width, ~50px tall, arrows pointing down between stages). Same colour-coding. Latency budget moves to a right-aligned annotation in each row.
3. **Wrap long stage details**: pre-split `s.detail` strings to insert `\n` at natural breakpoints and leverage the existing `tspan` wrapping at line 69-73. E.g. stage 4 detail becomes "Decision logic; may include\nAMX or accelerator inference" — two-line wrap fits within 107px box width at fontSize 10.
4. **Tighten box height**: reduce `boxH` from 240 → 160. Move "Latency budget" label and value up. The empty 80px is wasted vertical space and pushes the SVG taller than necessary.
5. **Add a colour legend**: small annotated band below the pipeline at y=320 (where the empty bottom space currently is, or in the freed space if box height is reduced) — three coloured swatches with labels "transport-bound / CPU-bound / compute-bound".
6. Make arrowheads larger (8×12 instead of 5×8) to be visible at any browser zoom-out.
7. Consider truncating stage 3 name "Decode + book update" to "Book update" (the "Decode" is implicit) — fits comfortably in the 107-wide box without clipping.

### Differential Machine Learning container (b)
This is NOT an inline SVG — it's a Cloudscape `Container` with `Header`, multiple `Box` children (paragraphs of rich text), and Cloudscape `Alert` components for callouts ("The headline result, vendor-cited", "The silicon implication", "Where the regulated workloads live").

**Layout audit (desktop, 1014 fold)**: Container fills the column width cleanly. Each `Box` paragraph wraps at the column edge. Citation links (BCBS d457, Huge & Savine 2020 paper, ISDA SIMM v2.4 Methodology) render as Cloudscape `Link` with `external` icon — all visible, none clipped. Alerts use the Cloudscape blue `info` / orange `warning` / green `success` palettes.

**Layout audit (mobile)**: Same container collapses to mobile width cleanly. All `Box` and `Alert` content reflows. No diagram → no overflow issue.

**Issues found:**
- **LOW (text-only)**: The paragraph "AAD — the foundation underneath everything..." is content-dense (~250 words) and runs as a single Cloudscape `Box`. Long paragraphs at narrow column widths fragment into many short lines. Consider splitting into two Boxes — one defining AAD, one explaining the silicon implication.
- **LOW (text-only)**: The italicised "Differential Machine Learning is a general extension..." quote is rendered with mixed Cloudscape inline styling — readability is fine but the mixed inline-style parsing can produce inconsistent line-heights across browsers. Verify in Safari.
- **LOW (citation density)**: Five external citations in this container (Huge & Savine 2020, BCBS d457, ISDA SIMM v2.4, the Bank of Italy paper, the Risk Magazine reference). All Tier 2-3 academic and regulatory sources. Layout-wise the inline `<Link external>` icons stack fine; semantically the density is appropriate for the content.

**Concrete fix recommendations:**
- Split the long AAD paragraph into 2-3 shorter ones for easier scanning at narrow column widths.
- Optionally add a small inline diagram showing the Differential ML data path (forward pass → backprop → loss with sensitivities) — would echo the diagram density of Sections 26-28. Currently this container is text-only in a section that is otherwise diagram-heavy.

---

## Section 30 — Glossary and Sources (light audit)

Per the audit brief: shared `Glossary` and `SourcesAppendix` components from the deep dive's shared library — light audit only for layout, search/filter functionality, source list rendering, and tier badges.

### Layout audit (desktop, 1014 fold)
- Page H1 "Glossary and sources" + sub-line "Vocabulary and authoritative source list for the deep dive" render at top.
- A description paragraph explains the tier grading: "Tier 1 (official vendor documentation, formal specifications, source code) is the first-class evidence; Tier 2 is vendor blog and announcement material; Tier 3 is peer-reviewed papers and third-party measurement; Tier 4 (random tutorials, unverified posts) is excluded by policy."
- **Glossary section**: H2 "Glossary (99)" — 99 acronym entries. A single Cloudscape `Input` with placeholder "Search acronyms..." and a search icon. Below: a Cloudscape `Table` with 3 columns (Acronym, Full Form, Description). Table renders 99 rows at full unfiltered state.
- **Search filter behaviour**: typing "EFA" in the search input filtered the table from 99 rows to 3 (EFA, SRD, Triton — the three glossary entries that contain "EFA" in their text). The H2 count dynamically updated from "Glossary (99)" to "Glossary (3)". **Filter works correctly.**
- **Sources section**: H2 "All Sources (51)" — 51 source entries in a Cloudscape `Table` with 5 columns (#, Title, Tier, Type, Date). Above the table: a "Sources & Fact-Check Register" sub-header and four tier-summary cards arranged in a 4-column grid, each card showing a coloured tier `Badge` (`Tier 1` green, `Tier 2` blue, `Tier 3` orange, `Tier 4` red) + tier description + source count ("33 sources" / "8 sources" / "10 sources" / "0 sources"). Tier counts add up to 51, matching the H2 count.
- **Tier badges in source rows**: each source row has a Tier column with a coloured `Badge` (Tier 1 green, Tier 2 blue, Tier 3 orange) — visually consistent with the summary cards.

### Layout audit (mobile, 260 main-column fold)
- The Glossary `Table` at mobile renders inside Cloudscape's standard table-overflow wrapper. Table width 1406px vs wrapper 260px → 1146px overflow with Cloudscape's built-in horizontal scroll. The Acronym column (~80px) is visible at the leading edge; users can horizontally scroll within the table to see Full Form and Description.
- The Sources `Table` similarly: 865×260 wrapper, 605px overflow. Cloudscape handles the scroll cleanly with a visible scrollbar.
- The four tier-summary cards stack into a single column on mobile (Cloudscape responsive grid behaviour). Each card visible without overflow.
- The search input and H2 counts render cleanly at mobile width.

### Issues found
- **LOW**: Mobile table horizontal scroll is functional but the Glossary's three columns at narrow widths force the user to scroll horizontally inside the table to see the Description column. Consider on mobile: collapse to a single-column card layout (each glossary entry as `Acronym — Full Form / Description body`) for a more native mobile reading experience. Same for the Sources table.
- **LOW**: The search input has placeholder "Search acronyms..." but actually searches all three columns (typing "EFA" matches Triton because the description text contains "EFA"). The placeholder should reflect the broader search scope: "Search glossary..." or "Filter glossary entries...".
- **LOW**: The "Tier 4 — 0 sources" tier-summary card is rendered identically to the others (with red `Tier 4` badge and "Blog posts, tutorials — inspiration only, never cited as fact" description) but with a count of 0. Consider rendering the count line differently when 0 (e.g. "**0 sources** (excluded by policy)") to make the policy stance explicit.
- **None**: search filter, source list, tier badges, and overall layout — all rendering correctly. No structural bugs.

### Confirmation against audit-brief checklist
- Shared component renders: yes — Glossary and SourcesAppendix both render and populate.
- Search filter works: yes — confirmed 99 → 3 glossary entries when typing "EFA", H2 count updates dynamically.
- Source list renders: yes — 51 sources in `All Sources (51)` table, 4 tier-summary cards above.
- Tier badges visible: yes — Tier 1 green, Tier 2 blue, Tier 3 orange, Tier 4 red, both in the summary cards and in each source row's Tier column.

---

## Per-section summary

| Section | Diagram(s) | Inline-SVG bug? | HIGH issues | Other notable issues | Mobile usable? |
|---|---|---|---|---|---|
| 26 Communication and Scale-Out | CommunicationStack (880×400) | Yes — width=880, no preserveAspectRatio, overflowX:auto wrapper | mobile 664px overflow; 758-fold 124px overflow | red palette on Hardware row reads as warning; 132px dead space on 1014 fold | No (rows clipped by 75%) |
| 27 Isolation — NIE and MIG | IsolationLayers (880×360, three pillars) | Yes — same pattern | mobile 664px overflow; 758-fold 124px overflow; Pillar 2 label asymmetry | LOW: tight bottom padding | No (Pillars 2 and 3 off-screen) |
| 28 Determinism — NEFF AOT vs GPU | DeterminismDiagram (880×360, two panels) | Yes — same pattern | mobile 664px overflow; 758-fold 124px overflow | block 2 label asymmetry ("get" vs "costs"); arrow `→` inconsistency | No (NVIDIA panel off-screen) |
| 29 Capital Markets Lens | TickToTradeDiagram (920×360, 7 stages) + Differential ML container (text-only) | Yes — width=920 (largest) | mobile 704px overflow (worst of batch); 758-fold 164px overflow (worst of batch); stage 3 name clips box right edge | wasted bottom 92px in each stage box; arrows too small; stage 4 detail text overflows | No (stages 2-7 off-screen) |
| 30 Glossary and Sources | None (shared Glossary + SourcesAppendix components) | N/A — Cloudscape Table with built-in horizontal scroll | none | placeholder text "Search acronyms..." understates scope (filter actually searches all columns); Tier 4 zero-count card could be styled distinctly | Acceptable (Cloudscape table scroll is native) |

### Cross-cutting recommendation (final)
Every Section 26-29 inline SVG needs the same three-line fix:
1. SVG `width` attribute: `880`/`920` → `"100%"`
2. Add `preserveAspectRatio="xMidYMid meet"` to each `<svg>`
3. Wrapper `<div>`: drop `overflowX: 'auto'`, optionally add `style={{ width: '100%', maxWidth: 880 }}` (or 920 for Sec 29)

This is the **same one-line per-component fix** flagged across Sections 1-25. With this batch finishing the audit, every authored inline SVG in the deep dive (Sections 1, 4, 5, 6 (×2), 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22b, 23, 24, 26, 27, 28, 29) needs the same fix. A targeted shared `<FluidSvg>` wrapper component or a codemod over `src/components/*.tsx` would close the entire bug class in a single change.

For mobile experience specifically, six diagrams in Sections 26-29 (every diagram in the batch) need vertical-stack mobile re-flows — the side-by-side comparative structures (3-pillar Sec 27, 2-panel Sec 28, 7-stage Sec 29) lose their teaching value at 218px column widths and benefit from a vertical-pipeline mobile variant.
