# EFA Deep Dive — Diagram Plan

Goal: bring the EFA deep dive from 2 diagrams (both React Flow, neither accessible) up to the
vLLM deep dive's standard: hand-authored inline SVG, `role="img"` + `<title>` wired via
`aria-labelledby`, responsive, no fixed heights, no overlap.

Reference implementation: `deep-dives/vllm/src/sections/` — 44 `role="img"` SVG diagrams across
29 sections, zero React Flow (`@xyflow/react` is not even a dependency of the vLLM app).

Scope of this document: diagrams only. Section prose, sources, and the section list itself are
out of scope.

---

## 1. Diagram Authoring Contract

A mechanical checklist distilled from reading vLLM's `RepoMapDiagram`, `ThreeProcessDiagram`,
`ContinuousBatchingTimeline`, `NixlTransferFlowDiagram`, `KVMemoryHierarchyDiagram`,
`ControlVsObserveDiagram`, `NetworkNodesDiagram`, `DecisionTreeDiagram`, `StartHereTree`,
`PrefillDecodeTimeline`, and `EksRequestProvisioningDiagram`.

### 1.1 Where the component lives

- Diagram components live **inside the section file that uses them**, as a module-private
  `function XxxDiagram()` above the exported section component. vLLM has no
  `src/components/` directory at all.
- Exception: a diagram reused by two or more sections gets promoted to
  `deep-dives/efa/src/components/`.
- One diagram = one function. No shared "generic diagram" abstraction. These are hand-drawn,
  not data-driven.

### 1.2 Required SVG attributes (non-negotiable)

```tsx
function ThingDiagram() {
  return (
    <svg
      viewBox="0 0 860 420"
      role="img"
      aria-labelledby="thing-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="thing-title">
        One or two full sentences describing what the diagram asserts, not what shapes it
        contains. A screen-reader user should get the same takeaway as a sighted reader.
      </title>
      {/* ... */}
    </svg>
  );
}
```

Rules:

1. `viewBox` is **mandatory**. No `width`/`height` attributes on the `<svg>` element itself.
2. `style={{ width: '100%', height: 'auto' }}` is **mandatory**. Never a fixed pixel height,
   never a wrapper `<div style={{ height: '650px' }}>`.
3. `role="img"` is **mandatory**.
4. `aria-labelledby` pointing at a `<title id="...">` is the **required** pattern.
   - The `id` must be unique across the whole app. Convention: kebab-case diagram slug plus
     `-title`, e.g. `srd-spray-title`, `eks-devplugin-title`.
   - **Do NOT use `aria-label` on the `<svg>`.** `silicon-memory-inference` does this in all 24
     of its components. It is the inferior pattern: `aria-label` is not visible to a
     sighted-but-hovering user, does not survive text extraction, and cannot be extended with
     `<desc>`. vLLM uses `aria-labelledby` in 34 of 44 diagrams and it is the target.
   - Add `<desc id="...-desc">` and `aria-describedby` only when the title sentence cannot carry
     the full reading (used in 8 of 44 vLLM diagrams).
5. `<title>` text is prose, not a label list. Compare:
   - Bad: "EFA stack diagram with 4 boxes."
   - Good: "The EFA data path bypasses the kernel entirely: the application posts work requests
     straight to hardware queues mapped into its own address space, so no system call, no
     protocol processing, and no socket-buffer copy sits between the application and the wire."

### 1.3 Styling: two allowed idioms, pick one per diagram

**Idiom A — a `<style>` block with short class names** (most common in vLLM; see
`ThreeProcessDiagram`, `NetworkNodesDiagram`, `DecisionTreeDiagram`):

```tsx
<style>{`
  .nn-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
  .nn-t   { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
  .nn-s   { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
  .nn-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#nn-ah); }
`}</style>
```

Class-name prefixes must be diagram-unique (`nn-`, `srd-`, `eks-`) because SVG `<style>` inside
an inline SVG leaks to the whole document.

**Idiom B — hex constants plus explicit presentation attributes** (see
`EksRequestProvisioningDiagram`, `PrefillDecodeTimeline`): declare `const blue = '#0972d3'` at
the top of the function and pass `fill`, `stroke`, `fontSize`, `fontWeight`, `textAnchor`,
`fontFamily` on each element. Verbose but immune to class-name leakage. Prefer this for
diagrams with fewer than ~15 shapes.

Never mix A and B inside one diagram.

### 1.4 Color palette

vLLM declares `@cloudscape-design/design-tokens` as a dependency but **never imports it** — the
diagrams hardcode the hex values of the Cloudscape light palette. Follow the same practice for
consistency, and reuse exactly these values (frequency across the 44 vLLM diagrams in
parentheses):

| Role | Hex | Notes |
| --- | --- | --- |
| Secondary text / arrows | `#5f6b7a` (202) | The workhorse. All sub-labels and connectors. |
| Primary text on light fill | `#16191f` (77) / `#0f1b2a` (50) | Titles inside boxes. |
| Accent blue (stroke / solid fill) | `#0972d3` (69) | Primary subject. |
| Blue dark (stroke on solid blue) | `#065299` (15) | |
| Blue tint (box fill) | `#f2f8fd` (31) | |
| Neutral stroke | `#879596` (55) | Undecided / generic nodes. |
| White (text on solid fill) | `#ffffff` (46) | |
| Slate (grouping / de-emphasis) | `#414d5c` (24) | |
| Amber stroke / warn accent | `#8b6c00` (23), `#ec7211` | Fill `#fbf3d5` / `#fdf3ec`. |
| Green (success / fast path) | `#037f0c`, `#037f51`, `#1d8102` | Fill `#ecf7ec` / `#e9f7ef`. |
| Teal (observe / secondary system) | `#2ea597`, stroke `#1f7a70` | Fill `#e6f4f2`. |
| Purple (third system) | `#6f4cc4` | Fill `#efe7fb`. |
| Divider (dashed phase separator) | `#d1d5db` | `strokeDasharray="5 4"`. |

Semantic convention worth preserving for EFA: **blue = the thing under discussion, green = the
fast/bypass path, amber/orange = the slow or lossy path, teal = the read-only/observability
side, slate = network fabric / infrastructure.**

### 1.5 Dark mode

The app toggles Cloudscape dark mode via `shared/src/hooks/useTheme.ts` (`applyMode(Mode.Dark)`),
and it also follows `prefers-color-scheme`. **vLLM's diagrams do nothing about this** — they are
light-palette SVGs on a dark Cloudscape surface.

The contract, therefore:

- Every diagram must be **self-contained on a light ground**. Either every text glyph sits on an
  explicit light `<rect>` fill you drew, or you paint a full-bleed background rect first:
  `<rect x="0" y="0" width="{vbW}" height="{vbH}" rx="8" fill="#ffffff" />`.
- **Never rely on the page background for contrast.** A bare `<text fill="#16191f">` on no
  backing rect vanishes in dark mode. This is the single most common defect to avoid.
- Do not add per-diagram dark variants. Matching vLLM (one palette, self-contained ground) keeps
  the 30 diagrams consistent and is the cheapest correct answer.

### 1.6 Responsive sizing and legibility

- Target `viewBox` width: **760 to 900 units**. Observed vLLM range is 760-940; 860 is a good
  default.
- Target aspect ratio: **1.5:1 to 2.2:1** (widths 760-940, heights 150-560). Anything taller
  than 1:1 will be unreadably small on a phone, because `width: 100%` on a ~360 px viewport
  scales an 11-unit font down to ~4.5 px.
- **Hard rule: if a diagram needs more than ~500 viewBox units of height, split it into two
  diagrams.** The old `EFADataPathDiagram` is 650 px tall; that is the failure this rule
  prevents.
- If the content genuinely cannot compress (a wide matrix, a many-column timeline), use the
  **CSS-grid escape hatch** instead of SVG: a `<div style={{ overflowX: 'auto' }}>` wrapping a
  grid with `minWidth: '640px'`, as in `ContinuousBatchingTimeline`. That preserves legibility
  by scrolling rather than shrinking.
- `preserveAspectRatio` is only needed when you also set an explicit `height` (2 of 44 vLLM
  diagrams). With `height: auto` it is unnecessary.

### 1.7 Font sizes

Observed vLLM distribution: `11px` (132 uses), `10px` (86), `12px` (74), `13px` (65),
`14px` (14), `9px` (13), `8px` (1).

Contract:

- **Box titles: 13px, weight 600.** Occasionally 14px for the single most important node.
- **Sub-labels / body: 11px, weight normal.**
- **Edge labels, legends, phase headers: 10-11px, weight 600 when they must pop.**
- **Minimum: 10px. Never below 10.** The 9px and 8px uses in vLLM are defects to not copy.
- Font family: `sans-serif` explicitly (in the `font:` shorthand or via `fontFamily`). Do not
  inherit; SVG text in a downloaded or extracted SVG has no page CSS.

### 1.8 Text-overlap avoidance (the rule set that actually prevents the bug)

1. **Size every box to its longest label.** At 11px sans-serif, budget ~6.2 units of width per
   character; at 13px weight-600, ~7.5 units. A 28-character 13px title needs ~210 units of box
   width plus 28 units of padding.
2. **Never wrap text implicitly.** SVG `<text>` does not wrap. Every line is its own `<text>`
   element. Line spacing: 16-20 units at 13px, 14-16 units at 11px.
3. **Vertical text budget inside a box:** `boxHeight >= 22 + 18 * (numberOfLines - 1) + 14`.
   A 3-line box needs at least ~70 units.
4. **Minimum gap between sibling boxes: 20 units horizontally, 24 vertically.** Edge labels
   need 30+ units of clear corridor.
5. **Edge labels go beside the edge, never on it.** Offset the label 8-12 units perpendicular
   to the line, and place it on the segment's midpoint, not near an arrowhead.
6. **Arrowheads are `<marker>` definitions**, declared once per diagram in `<defs>` with a
   diagram-unique id (`eks-arr`, `nn-ah`, `cah`). `refX` ~9, `markerWidth`/`markerHeight` 7-9,
   `orient="auto-start-reverse"`.
7. **Reserve a caption band.** Any explanatory sentence that does not fit inside a shape goes in
   a Cloudscape `<Box variant="small" color="text-body-secondary">` immediately **below** the
   SVG, not crammed into the viewBox. vLLM does this for the illustrative-not-measured
   disclaimers.
8. **Verify against rendered output, not arithmetic.** After authoring, run the Playwright DOM
   gates (`pnpm audit --with-playwright`: `gate-content-overflow`,
   `gate-no-hydration-warnings`) and eyeball at 375 px and 1440 px widths. Hand-computed
   coordinates are not evidence.

### 1.9 Placement inside the section

Diagrams sit inside the section's `SpaceBetween`, after the "the problem / the answer" framing
prose and before the `ColumnLayout` or `Table` that details the parts. The house pattern is:

```
h2-rooted section
  → bold framing sentence (<strong>The problem:</strong> ... <strong>The answer:</strong> ...)
  → diagram
  → ColumnLayout / Table detail
  → ExpandableSection for depth
```

Every quantitative label inside a diagram (bandwidth, latency, port counts) must correspond to a
cited claim in the surrounding prose. If a number appears only in a diagram, it is an uncited
claim. Schematic diagrams carry an explicit "Illustrative, not measured" line in the caption Box.

---

## 2. Audit of the 2 Existing EFA Diagrams

### 2.1 `src/components/EFADataPathDiagram.tsx` — REPLACE with inline SVG

Used once, in `src/sections/Architecture.tsx:46`.

Defects:

| # | Defect | Detail |
| --- | --- | --- |
| 1 | **No accessibility affordance at all** | React Flow renders a `<div>` tree. There is no `role="img"`, no `<title>`, no `aria-label`, no text alternative anywhere. A screen reader gets an unlabeled pile of divs. This is a straight violation of the CLAUDE.md rule "every diagram carries `role="img"` plus a `<title>`". |
| 2 | **Fixed 650 px height** | `<div style={{ height: '650px' }}>` (line 84). Violates the responsive rule. On a phone this is a 650 px-tall box with `fitView` shrinking a 13-column-deep stack into illegible 6 px text. |
| 3 | **Wrong tool for the shape** | This is two static vertical stacks side by side with straight-down edges. There are no crossings, no auto-layout need, no branching. It is a box-and-arrow diagram, the exact case CLAUDE.md assigns to inline SVG. React Flow buys nothing here and costs a 650 px viewport, a CSS import, and the accessibility hole. |
| 4 | **`\n` in node labels does not render as a line break** | Lines 29-31, 39-44 all use `'System Call\n(context switch)'` etc. React Flow renders the label as a text node inside a div with default `white-space: normal`. The `\n` collapses to a single space. Every two-line label is silently rendering as one run-on line, which then wraps unpredictably against `minWidth: 140px` — a live overlap/overflow risk today. |
| 5 | **Interaction is disabled anyway** | `nodesDraggable={false}`, `nodesConnectable={false}`, `elementsSelectable={false}`, `panOnDrag={false}`, `zoomOnScroll={false}`. The only surviving interactions are pinch-zoom and the `<Controls>` widget. There is no interactivity justifying the dependency. |
| 6 | **Uncited numbers embedded in the graphic** | "~100μs+ (kernel overhead)" and "~15μs (MPI ping-pong)" (lines 49-50) live only in the diagram. They must move into cited prose or carry a source in the caption. |
| 7 | **Negative-coordinate label nodes** | The USER SPACE / KERNEL SPACE labels sit at `x: -60` (lines 51-52), outside the natural content box, relying on `fitView` padding to stay visible. Brittle. |

**Verdict: port to inline SVG, and split.** It becomes two diagrams:

- `efa-d01 OsBypassPathDiagram` — the two-column TCP vs EFA comparison, the headline visual.
- `efa-d03 KernelUserspaceSplitDiagram` — the kernel/userspace boundary and what the kernel
  driver still owns (control plane: QP creation, memory registration, address handles) versus
  what bypasses it (data plane: post-send, poll-CQ).

Splitting is what fixes the 650 px height: each half fits comfortably in an 860 x 400 viewBox.

### 2.2 `src/components/NetworkTopologyDiagram.tsx` — REPLACE with inline SVG

Used once, in `src/sections/Architecture.tsx:65`.

Defects:

| # | Defect | Detail |
| --- | --- | --- |
| 1 | **No accessibility affordance** | Same as above: no `role`, no title, no text alternative. |
| 2 | **Fixed 420 px height** | Line 211. |
| 3 | **Real overlap risk, not theoretical** | Two `type: 'group'` parents at `minHeight: 180px` contain 8 GPU children at `y: 40` plus 4 EFA children at `y: 130` (each with `padding: 6px 10px`, so ~28 px tall, ending at ~158) plus a transparent 280 px-wide label node at `y: 95` spanning the full width. The label node's box overlaps the GPU row's bottom and the EFA row's top. Additionally, the group node's own `data.label` ("Instance 1 (p5.48xlarge)") renders at the top of the group, in the same band as the GPU children at `y: 40`. Two independent collisions inside a 180 px parent. |
| 4 | **`\n` in the fabric-switch label** | Line 137, same non-rendering-line-break bug as 2.1. |
| 5 | **NVLink modelled as a chain, which is wrong** | Lines 167-183 draw 7 straight edges `G0→G1→G2...→G7`. NVSwitch is all-to-all, not a ring. The diagram teaches the wrong topology. This is a correctness bug, not just a rendering one. |
| 6 | **`panOnDrag={true}` with no visual affordance** | The user can drag the content out of frame with no way to know it, and no reset. |
| 7 | **28 nodes and 22 edges of hand-placed coordinates** | All the cost of React Flow, none of its benefit (no auto-layout, no interactivity). |

**Verdict: port to inline SVG, and split.** It becomes:

- `efa-d09 IntraNodeEfaTopologyDiagram` — inside one node: GPUs on an all-to-all NVSwitch,
  GPU-to-EFA-card PCIe/NUMA affinity, N EFA devices. Drawn correctly as a switch fabric, not a
  chain.
- `efa-d11 DatacenterFabricHierarchy` — nodes into the AWS fabric, spine/leaf, cluster placement
  group boundary, UltraCluster framing.

### 2.3 Does anything stay on React Flow?

**No.** After this revamp, `@xyflow/react` should be dropped from
`deep-dives/efa/package.json`. Rationale:

- CLAUDE.md keeps React Flow legitimate for "node-and-edge architecture/flow graphs, especially
  interactive ones (pan/zoom, auto-layout)... when there are many nodes/edges or interactivity
  helps."
- Neither existing diagram, and none of the 30 proposed, meets that bar: all are static, all
  have hand-authored layout, all disable interaction.
- vLLM — the standard being copied — reached 44 diagrams with no React Flow dependency at all.
- Removing it also removes the `@xyflow/react/dist/style.css` import, which is currently the
  only global CSS the EFA app pulls in outside Cloudscape.

If a future EFA section genuinely needs an explorable graph (for example, a live
`DescribeInstanceTopology` tree with hundreds of instances), reintroduce React Flow *for that
one component*, and give it a `role="img"` wrapper with a text alternative.

---

## 3. Proposed Diagram Inventory (30 diagrams)

Rendering tool for all 30 is **inline SVG** unless noted. Section numbers refer to the revamped
section list.

### S1 — EFA fundamentals & OS-bypass

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d01` | `OsBypassPathDiagram` | The kernel TCP path vs the EFA OS-bypass path, side by side, with the layers EFA deletes struck out | box-and-arrow | Two vertical columns on a shared ground: left amber column app → syscall → TCP stack → socket buffers → driver → ENA → wire; right green column app → libfabric → EFA device → wire, with the removed layers shown as a greyed dashed band the green path jumps over |
| `efa-d02` | `LatencyBudgetChart` | Where the microseconds go in a one-hop message: syscall + copy + protocol + driver vs bypass | chart (stacked horizontal bars) | Two stacked bars on a shared microsecond axis, segments labelled and colour-matched to `efa-d01`'s layers, so the reader sees which segment each deleted layer removes |

### S2 — Kernel vs userspace split

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d03` | `KernelUserspaceSplitDiagram` | What the `efa` kernel driver still owns (control plane) vs what runs entirely in userspace (data plane) | hierarchy (layer stack with a boundary line) | Horizontal dashed boundary across the width; above it userspace boxes (app, aws-ofi-nccl, libfabric efa provider, mapped QP/CQ rings); below it kernel boxes (efa driver, ib_uverbs) reached only by a thin "setup only" arrow, while a thick arrow from the mapped rings goes straight to the Nitro card past the boundary |
| `efa-d04` | `PostSendDoorbellSequence` | The mechanics of one send: WQE written to the SQ in mapped memory, MMIO doorbell, hardware DMA-reads the payload, CQE polled | sequence | Four numbered left-to-right steps between three lanes (application, mapped queue memory, EFA device), each step annotated with "no syscall" / "no copy" |

### S3 — SRD protocol

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d05` | `SrdVsRoceDiagram` | SRD's design choices against RoCEv2's: out-of-order delivery vs in-order, hardware reliability vs PFC-dependent lossless fabric, multipath vs single path | box-and-arrow (two-column compare) | Two panels split by a dashed divider, each with the same four labelled rows (ordering, loss recovery, path selection, fabric requirement), so the reader reads across |
| `efa-d06` | `MultipathSprayDiagram` | One logical message split across many ECMP paths through the fabric and reassembled at the receiver | box-and-arrow (fanout / fan-in) | Sender box on the left, receiver on the right, a wide bundle of thin paths through a stack of spine nodes between them, three highlighted to show different latencies, with a reorder-buffer box at the receiver |
| `efa-d07` | `SrdLossRecoveryTimeline` | A dropped packet recovered by the EFA device on a different path, with the application never blocked | timeline | Horizontal time axis, one lane per path; an X marks the drop, a retransmit arrow appears on a different lane, and a parallel "application" lane shows uninterrupted forward progress |

### S4 — Instance matrix

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d08` | `InstanceBandwidthLadderChart` | Aggregate EFA bandwidth per instance family, ordered, so the reader can place a candidate instance on the ladder | chart (horizontal bars) | One labelled bar per family (c7gn, hpc7a, p4d, p5/p5e/p5en, p6, trn1/trn2), value at the bar end, families grouped by colour (compute / HPC / GPU / Trainium) |
| `efa-d09` | `IntraNodeEfaTopologyDiagram` | Inside one node: GPUs on an all-to-all NVSwitch, and the PCIe/NUMA affinity between each GPU and its EFA cards | box-and-arrow | Node boundary rect; a row of GPU boxes all connected to a single wide NVSwitch bar (not a chain); below it a row of EFA device boxes each tied to its GPU group by a short affinity line; a footnote rect stating how many of N devices are drawn |

### S5 — EC2 Topology API & datacenter hierarchy

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d10` | `NetworkNodesHierarchyDiagram` | The `DescribeInstanceTopology` `NetworkNodes` list as a tree, and how shared bottom-layer nodes mean proximity | hierarchy (tree) | Three labelled layers (i / ii / iii) of nodes above a row of four instances, with a green dashed brace marking the two instances that share a bottom node as "closest" and an amber note on the one that only shares the top node |
| `efa-d11` | `DatacenterFabricHierarchy` | Where those network nodes physically live: AZ → datacenter → spine/leaf → rack → instance, and where the UltraCluster boundary sits | hierarchy (nested containment) | Nested rounded rects from AZ inward to a single instance, with the bisection-bandwidth annotation attached to the level it applies to, and the cluster placement group drawn as a dashed overlay crossing the rack level |

### S6 — Placement groups & Capacity Blocks

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d12` | `ControlVsObservePlacementDiagram` | The two phases: what you command at launch (cluster PG, ODCR-in-PG, Capacity Blocks) vs what you can only read after (`DescribeInstanceTopology`) | box-and-arrow (two-phase, dashed divider) | Left half "BEFORE / AT LAUNCH: YOU CONTROL" with three solid blue lever boxes converging on a "instances land on a high-bisection segment" box; right half "AFTER LAUNCH: YOU OBSERVE" with a teal API box feeding a NetworkNodes box feeding a "you assign ranks" box; footer line "the API never launches or moves anything" |
| `efa-d13` | `PlacementGroupTypesDiagram` | Cluster vs spread vs partition placement, and why only cluster is correct for EFA | box-and-arrow (3 panels) | Three equal panels, each showing the same 6 instances arranged against a rack grid per strategy, with a verdict chip under each (cluster: use this; spread: anti-affinity, wrong for EFA; partition: fault isolation, wrong for EFA) |
| `efa-d14` | `CapacityBlockTimeline` | The Capacity Block lifecycle: reserve ahead, start date, run window, hard auto-terminate | timeline | Single horizontal time axis with four labelled markers and a shaded run window, plus a callout on the auto-terminate edge |

### S7 — EFA on EKS

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d15` | `EksEfaProvisioningStack` | Everything that must line up for an EFA pod to schedule: AMI, node group in a cluster PG, device plugin daemonset, node resource, pod request | box-and-arrow (layered, bottom-up) | Five stacked bands from infrastructure up to pod, each band naming the artifact and the thing it must match (AMI ships the driver, node group carries the PG, daemonset advertises `vpc.amazonaws.com/efa`, pod requests it); a red "if this is missing" annotation beside each band feeds `efa-d29` |
| `efa-d16` | `DevicePluginAllocationSequence` | How the EFA device plugin registers with kubelet and how `/dev/infiniband` reaches the container | sequence | Three lanes (device plugin, kubelet, container runtime), four numbered arrows: Register → ListAndWatch → Allocate → device mounted, with the resource name and the device path called out |

### S8 — EFA on SageMaker

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d17` | `SageMakerEfaPathsDiagram` | The two SageMaker routes to EFA — managed training jobs vs HyperPod — and what you control on each | box-and-arrow (two-column compare) | Left column training-job path (you supply the container and instance type; SageMaker supplies the placement and EFA enablement); right column HyperPod path (you supply cluster config, orchestrator choice, lifecycle scripts); a shared bottom bar showing both landing on the same EFA fabric |
| `efa-d18` | `HyperPodResilienceTimeline` | How a long training run survives a bad node: health check fails, node drained and replaced, job resumes from checkpoint | timeline | Horizontal run timeline with a fault marker, a shaded replacement window, and a resume marker, with the checkpoint cadence drawn as tick marks underneath so the reader sees how much work is lost |

### S9 — NCCL / aws-ofi-nccl tuning

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d19` | `NcclOfiPluginStack` | The full collective stack: NCCL → aws-ofi-nccl → libfabric efa provider → EFA device, and where GPUDirect RDMA short-circuits the host | hierarchy (layer stack with a side path) | Vertical stack of four boxes; a separate green arrow from GPU HBM straight to the EFA device labelled GPUDirect RDMA, bypassing the host-memory box drawn to the side |
| `efa-d20` | `TuningKnobStackMap` | Which environment variable acts on which layer of that stack | box-and-arrow (annotated stack) | The `efa-d19` stack redrawn narrow on the left, with knob chips (`FI_EFA_USE_DEVICE_RDMA`, `NCCL_PROTO`, `NCCL_ALGO`, `NCCL_BUFFSIZE`, `NCCL_NET_GDR_LEVEL`) attached by short leader lines to the exact layer each one moves, and a one-line effect note per chip |

### S10 — AI/ML training

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d21` | `ParallelismTrafficMap` | Which parallelism axis generates intra-node NVLink traffic and which crosses the EFA fabric | box-and-arrow | Two nodes side by side, each with its GPU row; TP and EP arrows drawn thick inside a node, DP gradient-sync and PP activation arrows drawn crossing the fabric between nodes, each arrow labelled with what it carries and roughly how often |
| `efa-d22` | `ScalingEfficiencyChart` | Scaling efficiency against node count, with and without a high-performance fabric | chart (line) | Two curves on a nodes-vs-efficiency plot, an ideal 100% reference line, and a shaded gap labelled "the fabric's contribution"; caption marks it schematic unless real measurements land in `research/` |

### S11 — Inference

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d23` | `DisaggKvTransferDiagram` | Why inference reaches for EFA at all: KV-cache transfer between prefill and decode nodes, and MoE expert all-to-all | box-and-arrow | Prefill node on the left, decode node on the right, a thick green RDMA arrow between them labelled with what moves (KV blocks) and the transport (NIXL/libfabric over EFA); a second smaller inset shows the expert all-to-all pattern across four nodes |

### S12 — HPC / MPI

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d24` | `MpiOverOfiStack` | How MPI reaches EFA: Open MPI / Intel MPI → OFI/libfabric → efa provider, and where two-sided sends differ from one-sided RDMA | hierarchy (layer stack, two paths) | Vertical stack with the MPI layer forking into a two-sided lane and a one-sided RMA lane that rejoin at the libfabric layer, each lane labelled with the EFA capability it uses |
| `efa-d25` | `ParallelClusterTopologyDiagram` | The shape of an EFA HPC cluster: head node, compute fleet in a cluster PG, shared FSx for Lustre, scheduler | box-and-arrow | Head node box on the left, a compute fleet rect (dashed cluster-PG boundary) on the right with EFA links drawn between compute nodes, FSx drawn underneath connected to every node, scheduler arrows from head to fleet |

### S13 — EFA vs alternatives

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d26` | `FabricTierLadderChart` | The bandwidth ladder a message can travel: NVLink/NeuronLink intra-node, EFA inter-node, VPC/TCP for everything else | chart (log-scaled ladder) | Stacked bars on a log bandwidth axis, one per tier, each annotated with its scope (inside a node / between nodes in a PG / anywhere in the VPC) and its typical latency, making the order-of-magnitude gaps visible |

### S14 — Pricing

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d27` | `CostAttributionDiagram` | Where EFA money actually goes: no hourly EFA charge, cost lives in the instance hour, the idle time placement forces, and cross-AZ avoidance | box-and-arrow (flow to buckets) | A single "your cluster spend" bar splitting into labelled buckets, with the EFA bucket drawn at zero and annotated "no additional charge", and an arrow showing the real lever is utilisation of the reserved instance hours |

### S15 — Operations & failure modes

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d28` | `FailureModeStackMap` | Which layer each classic EFA failure lives in: security group self-reference, wrong AMI, missing device plugin, memlock ulimit, huge pages, MTU | box-and-arrow (annotated stack) | The `efa-d03` layer stack redrawn compactly, each layer carrying one or two amber failure chips with the symptom on the chip and the fix in a right-hand column aligned to the same row |
| `efa-d29` | `EfaTroubleshootingTree` | Symptom to root cause: job hangs / `fi_info` returns nothing / bandwidth far below spec / NCCL init times out | decision tree | Rooted tree starting at the observed symptom, two to three levels of yes/no checks (does `fi_info -p efa` list a device? is the security group self-referencing? is the device plugin advertising the resource?), leaves are named fixes colour-coded by which layer owns them |

### S16 — Decision guide

| id | component | shows | shape | visual |
| --- | --- | --- | --- | --- |
| `efa-d30` | `EfaStartHereTree` | The top-level decision: do you need EFA at all, then instance family, then orchestrator, then placement | decision tree | Start box "profile the job: how much of the step time is collectives?", branching to a no-EFA leaf for single-node or embarrassingly parallel work, and otherwise down through family → orchestrator (EKS / HyperPod / ParallelCluster / plain EC2) → placement, ending in a "size and place FIRST, tune NCCL only when a metric demands it" terminal box |

### Not proposed (backlog)

Considered and cut to keep the set at 30. Revisit only if a section reads thin after drafting:

- `EfaEniAnatomyDiagram` — EFA ENI as one interface with two personalities (ENA + EFA device).
  Folded into `efa-d01`.
- `EfaGenerationTimeline` — EFA v1 → v2 → v3 and the Nitro generation each rides on.
- `TopologyAwareRankAssignment` — the same 8 ranks assigned naively vs topology-aware.
  Folded as an annotation on `efa-d10`.
- `EksPodTopologyPlacementDiagram` — LeaderWorkerSet / MPIJob spanning nodes with topology
  spread constraints. Folded into `efa-d15`.
- `CollectiveAlgorithmDiagram` — ring vs tree all-reduce and the size threshold between them.
- `MoeAllToAllDiagram` — expert-parallel all-to-all in its own right. Currently an inset in
  `efa-d23`.
- `InterconnectTradeoffQuadrant` — EFA vs InfiniBand vs RoCEv2 vs TCP on latency against
  operational burden. Better served by a Cloudscape `ComparisonMatrix` than a chart.
- `ScalingCostBreakEvenChart` — dollars per training step against node count with and without
  EFA. Blocked on real measurements; do not fabricate the curve.

### Shape and tool distribution

| shape | count |
| --- | --- |
| box-and-arrow | 13 |
| hierarchy / layer stack | 5 |
| chart | 5 |
| timeline | 3 |
| sequence | 2 |
| decision tree | 2 |

All 30 render as **inline SVG**. Zero React Flow. Zero D3 (the five charts are schematic ladders
and bars with hand-placed coordinates, exactly as vLLM and `RooflineChart` do it, so no new
dependency). Comparison content that is a table rather than a graphic stays on the existing
Cloudscape `ComparisonMatrix` / `PricingTable` shared components and is not counted here.

---

## 4. Ranking

### Must-have (24) — the deep dive is incomplete without these

Ordered by build priority. The first six carry the core argument and should land first.

1. `efa-d01` OsBypassPathDiagram — the headline visual; nothing else lands without it
2. `efa-d03` KernelUserspaceSplitDiagram — the mechanism behind d01
3. `efa-d05` SrdVsRoceDiagram — the "why not just RoCE" answer, the differentiator
4. `efa-d06` MultipathSprayDiagram — SRD's actual trick
5. `efa-d30` EfaStartHereTree — the decision guide is the most-used section
6. `efa-d29` EfaTroubleshootingTree — the second most-used; readers arrive with a broken cluster
7. `efa-d02` LatencyBudgetChart
8. `efa-d08` InstanceBandwidthLadderChart
9. `efa-d09` IntraNodeEfaTopologyDiagram
10. `efa-d10` NetworkNodesHierarchyDiagram
11. `efa-d11` DatacenterFabricHierarchy
12. `efa-d12` ControlVsObservePlacementDiagram
13. `efa-d13` PlacementGroupTypesDiagram
14. `efa-d15` EksEfaProvisioningStack
15. `efa-d16` DevicePluginAllocationSequence
16. `efa-d17` SageMakerEfaPathsDiagram
17. `efa-d18` HyperPodResilienceTimeline
18. `efa-d19` NcclOfiPluginStack
19. `efa-d20` TuningKnobStackMap
20. `efa-d21` ParallelismTrafficMap
21. `efa-d23` DisaggKvTransferDiagram
22. `efa-d24` MpiOverOfiStack
23. `efa-d26` FabricTierLadderChart
24. `efa-d28` FailureModeStackMap

### Nice-to-have (6) — build if the section reads thin, cut without regret

| id | component | why it is optional |
| --- | --- | --- |
| `efa-d04` | PostSendDoorbellSequence | Depth on top of `efa-d03`; most readers stop at the layer split |
| `efa-d07` | SrdLossRecoveryTimeline | Reinforces `efa-d06`; the spray diagram already carries the idea |
| `efa-d14` | CapacityBlockTimeline | Genuinely useful but the content is a four-item list that a Cloudscape panel handles |
| `efa-d22` | ScalingEfficiencyChart | Schematic unless real measurements land in `research/`; a fabricated curve is worse than no curve |
| `efa-d25` | ParallelClusterTopologyDiagram | HPC is the smallest audience segment for this deep dive |
| `efa-d27` | CostAttributionDiagram | The pricing story is short ("no additional charge for EFA"); prose plus the existing `PricingTable` may be enough |

### Suggested build waves

Diagrams are independent, so waves are about review cadence, not dependencies. Run
`pnpm gates` between waves per the project's wave discipline.

- **Wave 1 (6):** `efa-d01`, `efa-d03`, `efa-d05`, `efa-d06`, `efa-d29`, `efa-d30`.
  Delete `EFADataPathDiagram.tsx` and `NetworkTopologyDiagram.tsx` in this wave, and drop
  `@xyflow/react` from `deep-dives/efa/package.json`.
- **Wave 2 (7):** `efa-d02`, `efa-d08`, `efa-d09`, `efa-d10`, `efa-d11`, `efa-d12`, `efa-d13`.
- **Wave 3 (6):** `efa-d15`, `efa-d16`, `efa-d17`, `efa-d18`, `efa-d19`, `efa-d20`.
- **Wave 4 (5):** `efa-d21`, `efa-d23`, `efa-d24`, `efa-d26`, `efa-d28`.
- **Wave 5 (6, optional):** the nice-to-have set.

After every wave, run `pnpm audit --with-playwright` and check `gate-content-overflow` at both
375 px and 1440 px viewport widths. Overlap defects found by the agent layer get encoded as
Tier 1 deterministic gates per the ratchet principle in the root CLAUDE.md.
