# Change report: ComputeInMemory (nav id `compute-in-memory`, "Compute-in-Memory")

Register: `research/2026-10-refresh/01-memory.md` section 5 (CM1 to CM28, CMD1 to CMD3,
Recommended edits 1 to 8).

Files: `src/sections/ComputeInMemory.tsx` (rewritten), `src/components/CimDiagram.tsx`
(rebuilt), `src/sources/ComputeInMemory.ts` (new, 10 records; `samsungPimHc33` and
`deepseekV3Config` copy the HbmAndBandwidthWall and MoeAndSparseActivation records' key,
title, URL, publisher and tier exactly).

Status: COMPLETE. All checks run (see Checks).

Re-read on 2026-10-18 (those records carry that date): Hot Chips 35 slides (pdftotext plus
page renders of slides 3, 12 and 15), Hot Chips 33 slides (pdftotext; record keeps the HBM
section's 2026-10-16 date so the shared record stays identical), SK hynix CES 2026 release
(AiMX footnote, which expands AiMX as "Accelerator-in-Memory based Accelerator").

**Register error found (GPT-J, CM13).** The register gives GPT-J "speed-up 2.33x (64
output tokens) and 2.16x (256), energy efficiency 2.24x and 1.79x". Slide 12, read as a
rendered image, shows the reverse pairing: (32 in, 64 out) speed-up 2.16x, energy
efficiency 1.79x; (32 in, 256 out) speed-up 2.33x, energy efficiency 2.24x. The page uses
the slide. The GPT-J gain therefore grows with output length, the opposite of what the
register's pairing implied. The verification agent should check this against slide 12.

**Record key note.** The orchestrator prompt describes `samsungPimHc33` as the Hot Chips
2023 slides. In `src/sources/HbmAndBandwidthWall.ts` that key is the Hot Chips 33
(2021-08-13) Aquabolt-XL deck, [T2-30]. It is copied unchanged and backs the Aquabolt-XL
facts. The Hot Chips 35 (August 2023) deck, [T2-31], which carries the 200x figure and the
GPT-J and MoE results, is a new record, `samsungPimHc35`.

## Word count

Header strings plus JSX text, tags and `{...}` expressions stripped (`/tmp/cim-tools/wc.mjs`,
same method before and after; table cell strings defined outside the JSX are not counted,
about 25 words):
- Before: about 900 words.
- After: about 1,240 words (+38%).

Growth by block, each register-driven: transformer and MoE results (CM13, edit 1: the false
Alert becomes a four-row table plus one paragraph) +110 net of the Alert it replaces; d-Matrix
Corsair and SK hynix AiMX (CM27, CM28, edit 2) +150, against about 230 words of HyperCIM cut;
JEDEC LPDDR6 PIM (CM26, edit 6) +100; speed-ups with their hosts and the read/write command
mechanism (CM8 to CM12, edit 4) +60; MoE ExpandableSection rewrite (CM25, edit 7) +90 over the
old one. Offsets: AWS position and ISCA/MICRO sentences cut (CM22, CM24), the two unsourced
cost bullets cut (CM20), two duplicate wins bullets and a diagram caption cut in the length
pass.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| CM1 | h1 description "eliminate the dominant cost of inference" | "Do the arithmetic where the bytes live and cut the energy spent moving them" | - |
| CM2 | title "Compute-in-Memory, PIM and HyperCIM" | "Compute-in-Memory: PIM and In-Memory Accelerators" | - |
| CM3 | "Most of the energy ... is spent moving bytes" | "fetching an operand from DRAM costs about 200 times the energy of the MAC that uses it, against 6 times from an on-chip buffer and 1 times from a register file"; repeated in the diagram and in the MoE ExpandableSection | samsungPimHc35 (T2, vendor-claim; note names Eyeriss ISCA 2016 as Samsung's source, not read) |
| CM4 | "Section 6", "Section 23" | by name: HBM and the Bandwidth Wall; Mixture of Experts and Sparse Activation; Roofline and Arithmetic Intensity; High Bandwidth Flash | - |
| CM5 | "HBM2 / HBM3 stacks" | HBM2 (Aquabolt HBM2 design modified) | samsungPimHc33 (T2, vendor-claim) |
| CM6 | "production directions", "commercial PIM line", "shipped commercial parts", diagram "Production examples" | "the first demonstrator vehicle of PIM" (quoted); diagram "Built examples ... demonstrator"; closing "This research located no production inference fleet built on CIM" | samsungPimHc33 (T2) |
| CM7 | "interface remains HBM-compatible" | keeps Aquabolt's form factor and timing; drop-in for JEDEC-compliant HBM2 (in note) | samsungPimHc33 (T2, vendor-claim) |
| CM8 | "issue PIM-specific commands" | "ordinary DRAM read and write commands step a small program stored in each unit, so an unmodified HBM controller drives it"; validated with a GPU and an FPGA; "a memory and software change, with no new memory controller" | samsungPimHc33 (T2, vendor-claim) |
| CM9, CM10, CM11 | "GEMV 8.9x, speech 3.5x, LSTM 2.54x" (one undifferentiated list) | 8.9x GEMV microkernel and 3.5x speech with a GPU host; 2.54x LSTM layer with a Xilinx Alveo U280 FPGA host; 11.2x slide figure and the "exceeds the 4x ratio, cause not stated" caveat in the note | aquaboltIeeeMicro (T3, measured; note: Samsung-authored), samsungPimHc33 (T2, vendor-claim) |
| CM12 | `<Link>` to Samsung tech blog index | Cite to IEEE Micro 2022 and Hot Chips 33 | - |
| CM13 | Alert "No published MoE benchmark" | "Transformer and MoE results": 96-GPU MI100-PIM cluster, 12 nodes, 200G InfiniBand; table GPT-J 2.16x/1.79x (64 out), 2.33x/2.24x (256 out), T5-MoE 2.71x/3.61x (32 GPUs), 2.06x/2.88x (64 GPUs); "the MoE gain shrinks from 2.71x to 2.06x as the cluster doubles"; only the expert feed-forward layers run in PIM; "no independent replication was located" | samsungPimHc35 (T2, vendor-claim) |
| CM14 | "would in principle benefit" | GEMV "60 to 80% of generation latency for GPT-J 6B on an A100" | samsungPimHc35 (T2, vendor-claim) |
| CM16 | "Energy per operation drops dramatically ... the move is gone" | "falls by more than half on GEMV-class kernels: Samsung measured over 60% less on its GPU system"; 2021 release "more than 70%" in note | aquaboltIeeeMicro (T3, measured), samsungHbmPimRelease (T2, vendor-claim) |
| CM17 | "in-bank parallelism is enormous" | 4.92 TB/s bank-level versus 1.23 TB/s host, 4x | samsungPimHc33 (T2, vendor-claim) |
| CM19 | "Bandwidth wall stops binding" | "the wall moves out by that ratio and does not disappear"; LPDDR-PIM concept "up to 8x" | samsungPimHc33, samsungPimHc35 (T2, vendor-claim) |
| CM20 | operator set; frameworks "do not yet target CIM natively" | operator set: FP16 multiply and add, everything else on the host; software: Samsung's PIM runtime library and compiler, d-Matrix Aviator, "This research located no upstream framework support" | samsungPimHc33, samsungPimHc35 (T2, vendor-claim), dmatrixProduct (T2) |
| CM21, CM23 | "not a deployed-at-scale answer"; "None of these have displaced ..." | "This research located no production inference fleet built on CIM", with the three status facts | samsungPimHc35, skhynixCes2026 (roadmap), dmatrixProduct (T2) |
| CM25 | ExpandableSection on capacity ("HBM has to be sized to hold all N experts") | "Why CIM suits MoE at small batch": CIM changes neither which bytes are read nor capacity; Samsung's run used one process per GPU (expert parallelism); the gain is cost per active-expert byte; 8 of 256 experts gives each expert about 1/32 of the batch, so its matmul is GEMV-shaped and the 200x fetch dominates; the advantage narrows as batch grows | deepseekV3Config (T1; derived 8/256), samsungPimHc35 (T2, vendor-claim) |
| CMD1 | "Moving a byte across the bus: dominant per-op cost" | energy bar chart to scale (1x, 6x, 200x) and "A DRAM fetch costs about 200x the MAC that uses it" | samsungPimHc35 (cited in text) |
| CMD3 | "Bet: eliminate the dominant cost" | "Bet: cut the dominant cost, data movement" | - |

CORRECT claims kept and re-cited: CM7, CM9, CM10, CM11, CM14, CM17, CM21, CMD2 ("DRAM bank"
kept in the diagram as the Aquabolt-XL stack; SRAM DIMC is carried by the Corsair paragraph).

## Claims removed

- CM15 HyperCIM, everywhere (h1, h2 container, its Alert, closing paragraph, diagram line):
  CUT. Domain lapsed; archived page shows no CIM product.
- CM18 "only the active expert needs to fire, reducing wasted reads": WRONG as a CIM win;
  cut from the wins list. The correct point (CIM changes how far active-expert bytes travel,
  not which are read) is in the MoE ExpandableSection.
- CM20 "analog CIM introduces noise, digital CIM costs area" and "fallback ... can be
  catastrophic": unsourced; cut.
- CM20 "Programming model: every workload needs to map onto in-array primitives": folded into
  the operator-set and vendor-software bullets.
- CM22 ISCA/MICRO sentence: CUT.
- CM24 AWS position sentence: CUT.
- Old thesis "every previous architectural fix has been some flavor of move bytes faster":
  replaced by the scoped "Wider HBM buses and more stacks move those bytes faster (see HBM and
  the Bandwidth Wall). CIM moves them a shorter distance."
- `&ldquo;`/`&rdquo;` entities and all em-dashes in section and diagram; "landscape" at the old
  `:118`.

## UNKNOWNs

- CM3 whole-inference share of energy spent on data movement: not stated; the page gives the
  per-operand figure only.
- CM6 commercial availability of HBM2-PIM: page says "demonstrator" and "no production
  inference fleet" located; no claim of sale or non-sale.
- Why the GEMV microkernel gain (8.9x paper, 11.2x slides) exceeds the 4x bandwidth ratio:
  stated as not explained by the sources read, in the citation note.
- T5-MoE model size: not stated on the page (slide 14 names T5-large with DeepSpeed MoE; the
  expert count was not read).
- d-Matrix 3DIMC shipping status (T2-34): not mentioned.

## NEW content

- CM13 Hot Chips 35 GPT-J and T5-MoE results, table plus paragraph (samsungPimHc35).
- CM26 JEDEC LPDDR6 PIM standard "nearing completion" (jedecLpddr6Pim, T1, roadmap) and
  JC-42.6 listing JESD209-6 (July 2025) with no PIM standard yet (jedecJc426, T1). Placed last,
  ending on the reader's action: ask accelerator and SoC vendors whether their LPDDR6 parts
  implement it once published.
- CM27 SK hynix AiMX, accelerator card prototype on GDDR6-AiM, CES 2026 (skhynixCes2026, T2,
  roadmap).
- CM28 d-Matrix Corsair: PCIe Gen5 x16, 2,048 DIMC cores, 2 GB at 150 TB/s plus up to 256 GB at
  400 GB/s, 600 W (dmatrixCorsairBrief, T2, vendor-claim); 375x tier gap (derived); no
  deployment scale on the product page (dmatrixProduct). Cross-links High Bandwidth Flash by
  name for the fast-small plus slow-large split.

## Diagram

`CimDiagram.tsx` rebuilt: `role="img"`, `aria-labelledby="cim-diagram-title"` with a prose
`<title>`, `aria-label` removed, viewBox 880 x 440 only, full-bleed white rect, all text
`sans-serif` at 10 px or more, one diagram-unique marker (`cim-ah`), wide-diagram phone
convention (`overflowX: auto` wrapper, `minWidth: 640`). Left panel: CPU/GPU, bus, DRAM with
two-way arrows, an energy-per-MAC bar chart drawn to scale (1x, 6x, 200x) and "A DRAM fetch
costs about 200x the MAC that uses it". Right panel: host with unmodified HBM controller,
1.23 TB/s host link, HBM2-PIM stack with four bank and PIM-unit pairs, "Bank-level units see
4.92 TB/s, 4x the host link", built examples (Samsung demonstrator, Corsair two tiers, AiMX
prototype), "Bet: cut the dominant cost, data movement". HyperCIM removed. Every drawn number
is cited in the paragraph under the diagram or in the Corsair and AiMX paragraphs.

Rendered check (`scripts/shoot.mjs`, build in `/tmp/silicon-dist-compute-in-memory`, shots in
`/tmp/silicon-shots-compute-in-memory`): probe "ok" at 1440 and 390 (no overlaps, no clipping,
no page overflow), exit 0. PNGs read: at 1440 every label sits inside its box, arrows clear of
text, the 200x bar ends well short of the panel edge with its label beside it. At 390 the
diagram scrolls sideways at 640 px and stays legible (about 8 px text). The results table was
first four columns and hid the speed-up and energy columns at 390; it was cut to three
wrapping columns (run, speed-up, energy efficiency) and re-shot: all values visible at 390.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:
- 200x / 6x / 1x energy per MAC by operand source: samsungPimHc35 slide 3.
- GEMV 60 to 80% of generation latency, GPT-J 6B on A100: samsungPimHc35 slide 7.
- At batch 1 a GEMV uses each weight for one MAC: definition of GEMV at batch 1 (no source
  needed).
- 4.92 versus 1.23 TB/s, 4x; wall moves out by the ratio: samsungPimHc33.
- Built by modifying Aquabolt HBM2; "first demonstrator vehicle"; 16-lane FP16 SIMD multiply
  and add units at each bank's I/O boundary; same form factor and timing; read/write commands
  step the PIM program; validated with unmodified HBM controller, GPU and FPGA:
  samsungPimHc33.
- "a memory and software change, with no new memory controller": [derived] from the previous
  item.
- Speed-ups with hosts: aquaboltIeeeMicro, samsungPimHc33.
- Energy over 60% less: aquaboltIeeeMicro; "more than 70%": samsungHbmPimRelease.
- 96 MI100-PIM GPUs, 12 nodes, 200G InfiniBand; four result rows; only expert feed-forward
  layers in PIM, one process per GPU: samsungPimHc35 slides 12 to 15.
- "GPT-J's gain grows as output lengthens ... what a decode-side speed-up predicts: more of
  the run is GEMV": [derived] from the 64 versus 256 output rows with fixed 32 input tokens.
- "the gain is capped by their share of each step": [derived], Amdahl's law applied to the
  slide 14 fact that only the expert layers run in PIM.
- 8 of 256 routed experts: deepseekV3Config; about 1/32 of the batch per expert: [derived].
- "As batch grows ... the advantage narrows": [derived] from arithmetic intensity, cross-linked
  to Roofline and Arithmetic Intensity.
- Corsair figures: dmatrixCorsairBrief; 375x: [derived]; no deployment scale, Aviator:
  dmatrixProduct.
- AiMX prototype on GDDR6-AiM, CES 2026: skhynixCes2026.
- Samsung PIM Runtime Library and PIM AI Compiler under PyTorch and TensorFlow: samsungPimHc35
  slide 16; LPDDR-PIM "up to 8x": samsungPimHc35 slide 20.
- JEDEC LPDDR6 PIM "nearing completion": jedecLpddr6Pim; JESD209-6 July 2025 and no PIM
  standard listed: jedecJc426.
- "a standard moves PIM from single-vendor parts toward one interface that several memory
  makers can build to": [SPECULATIVE], register CM26 wording; no number attached.

No new assertion is left without a source or a derived/speculative label.

## Checks

Run from the dive root on 2026-10-18 after the last edit:
- `pnpm exec tsc --noEmit | grep ComputeInMemory|CimDiagram`: no type errors in my files.
- `pnpm exec eslint` on the three files `--max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t ComputeInMemory`: 1 passed, exit 0.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 817 passed, 1 failed. The failure is
  the `sources.md` snapshot ("keeps sources.md in sync with the registry"), which every
  author's new records change (417 versus 454 distinct sources). Tier and URL consistency
  tests pass for my records. Regenerating `sources.md` is the orchestrator's.
- Gates (whole dive, filtered to my files): no-ai-tells exit 0, svg-a11y exit 0,
  pinned-refs exit 0, pre-overflow exit 0; no hits in my files.
- `pnpm exec vite build --outDir /tmp/silicon-dist-compute-in-memory`: exit 0.
- `node scripts/shoot.mjs --sections compute-in-memory --widths 1440,390`: ok at both widths,
  exit 0.

## For the orchestrator

- Glossary acronyms introduced or used in this section: CIM (compute-in-memory), PIM
  (processing-in-memory), MAC (multiply-accumulate), GEMV (general matrix-vector multiply),
  FP16 (16-bit floating point), SIMD (single instruction, multiple data), LSTM (long
  short-term memory), FPGA (field-programmable gate array), MoE (mixture of experts), DIMC
  (digital in-memory compute), PCIe (PCI Express), GDDR6 (sixth-generation graphics DDR),
  AiM (Accelerator-in-Memory), AiMX (Accelerator-in-Memory based Accelerator), JEDEC (Joint
  Electron Device Engineering Council), LPDDR6 (Low-Power DDR6), SoC (system on chip), LLM
  (large language model).
- `sources.md` needs regenerating (snapshot test above).
- Cross-section note: the GPT-J pairing in the register (CM13) is reversed against slide 12;
  any other section quoting the Hot Chips 35 GPT-J figures should use 2.16x/1.79x at 64 output
  tokens and 2.33x/2.24x at 256.
- The HBM and the Bandwidth Wall section's "Compute in the memory" box says "See
  Compute-in-Memory"; it stays consistent with this page (HBM2-PIM, read/write commands,
  4.92 versus 1.23 TB/s, demonstrator).
