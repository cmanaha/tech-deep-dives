# Change report: HbmAndBandwidthWall (nav id `hbm`, "HBM and the Bandwidth Wall")

Register: `research/2026-10-refresh/01-memory.md` section 2 (H1 to H37, D1 to D5,
Recommended edits 1 to 7), NVIDIA per-GPU figures from `02-nvidia.md` section 0, and
section 5 rows CM6, CM8, CM15, CM17, CM19 for the compute-in-memory column.

Files: `src/sections/HbmAndBandwidthWall.tsx` (rewritten), `src/components/HbmStackDiagram.tsx`
(rebuilt), `src/sources/HbmAndBandwidthWall.ts` (new, 29 records; 21 share a URL with another section and reuse its record's
URL, title, publisher and tier exactly).

Re-fetched on 2026-10-17 (records carry that date): NVIDIA HGX page (Rubin "288 GB HBM4 |
22 TB/s"; no stack count or bus width for Rubin, B300 or B200), AWS Trainium3 architecture page
(144 GiB, 4.9 TB/s; no HBM generation or stack count), Google TPU7x page (192 GiB, 7,380 GBps;
no HBM generation), Samsung HBM4 release (11.7 Gb/s, "capable of up to 13Gbps", maximum 3.3 TB/s
per stack, 12-layer 24 to 36 GB, 16-layer to 48 GB later, HBM3E maximum 9.6 Gb/s), Micron HBM4
release (36GB 12H in volume from Q1 2026, "over 11 Gb/s", "greater than 2.8 TB/s", 48GB 16H
samples), SK hynix HBM4 product page ("over 2.8TB/s", 2K I/O) and SK hynix 2Q26 results (HBM4
mass shipments from Q2; "customer demand exceeds supply capabilities").

Rubin bandwidth: the table uses **22 TB/s** (HGX page, individual-GPU table), the same figure as
Roofline and Arithmetic Intensity. An ExpandableSection names the 19.2 TB/s (Vera Rubin NVL72
page) and 16.25 TB/s (HGX Rubin NVL8 board, 130 / 8) alternatives.

## Word count

Rendered text, all disclosures open, SVG text and citation badges excluded (Playwright
`innerText` of `main`, minus the 136-word page header common to both):
- Before: 954 words.
- After: 1,270 words (+33%).

Growth by block, each register-driven: per-chip table +129 (six NEW rows, H16, plus the
sweeps-per-second column and its two-sentence explanation, which is the section's model applied
to every chip); HBM4 block +90 (edit 3: standard, three makers' shipping parts, 16-high, HBM4E,
SPHBM4, all NEW); "two levers observed" +65 (H23/H24: batch sizes and the decomposition the
register asks for); h1 +48 (H1: the two-lever model replaces the one-sentence claim). Offsets:
"When bandwidth is not the limit" -61 (vision/tabular cut, two paragraphs merged), signal
integrity, power and thermals paragraphs cut. Detail was cut rather than demoted wherever it
carried no number and no action.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| H1 | h1 "decode tokens-per-second tracks HBM pin speed almost linearly" | "Bandwidth sets how long each decode step takes and capacity sets how many requests share it" | h200Page (T2, vendor-claim/derived) |
| H2 | "first-order variable ... how many terabytes per second" | "Every decode step reads the weights and the KV cache from it" + the two-lever model | reasoning; Roofline section by name |
| H3 | 2.5D, TSVs, base logic die, interposer | kept, cited; interposer need tied to SPHBM4's organic-substrate pitch | jedecHbm3 (T1), samsungHbm4 (T2), jedecSphbm4 (T1) |
| H4 | "first-order commercial variable for the entire accelerator market" | SK hynix: "customer demand exceeds supply capabilities" | skhynixQ2 (T2) |
| H5, H7 | HBM3 1,024 bits, 16 channels, 6.4 Gb/s | kept; 819 GB/s per stack added; 1,024 derived from JEDEC's 819 GB/s at 6.4 Gb/s | jedecHbm3 (T1, spec/derived) |
| H8 | HBM3e "8-9 Gb/s" | Samsung's HBM3E maximum 9.6 Gb/s; B300 runs about 7.8 Gb/s per pin | samsungHbm4 (T2, vendor-claim), blackwellUltraBlog (T2, derived) |
| H9 | "An off-package DDR DIMM ... cannot tolerate those speeds" | DDR5 channel is 64 data bits at up to 8,800 Mb/s per pin, so width is the difference: an HBM4 stack is 32 DDR5 channels wide | epyc9755Page + epyc9005Datasheet (T1, derived), jedecDdr5c (T1), jedecHbm4 (T1, derived) |
| H10 | "Tier 1 vendor-cited HBM specs" | description states the payoff; tiers shown per cell by badge | - |
| H13-H15 | B200/B300 "HBM3e / HBM3e+", UNKNOWN capacity and bandwidth | B200: HBM3e, up to 180 GB, 8 TB/s; B300: HBM3e in eight 12-high stacks, 288 GB, 8 TB/s | blackwellTuningGuide (T1), dgxB200 (T2, derived 64/8), blackwellUltraBlog (T2) |
| H17 | "All vendor-cited figures accessed 2026-04-23" | removed; each badge carries its access date | - |
| H20 | "FP8: 3,958 TFLOPS, BF16: 1,979" unlabelled | "FP8 Tensor Core peak, 1,979 TFLOPS dense"; sparse 3,958 in the popover note | h100Page, h200Page (T2), hopperArchBlog (T2, derived 1:2) |
| H21 | "NVLink 900 GB/s"; "Power envelope within SXM thermals" | "900 GB/s bidirectional"; "up to 700 W" | h100Page, h200Page, blackwellUltraBlog (T2) |
| H23 | "up to 1.9x ... 1.6x" | vendor claim with batch sizes 32 vs 8 (one GPU) and 128 vs 64 (eight), 2K in / 128 out on the Llama run | h200Page (T2, vendor-claim) |
| H24 | "inference throughput moved with the HBM bandwidth ... roofline prediction delivered verbatim" | fixed batch caps the gain at 1.43x; the rest is the batch the extra 61 GB holds (4x the sequences per weight read); compare chips at the batch each holds | h200Page (T2, derived) |
| H26 | "8-9 Gb/s ... stretch what interposers can deliver" | shipping HBM4: Samsung 11.7 Gb/s, up to 13, up to 3.3 TB/s per stack; Micron over 11 Gb/s and 2.8 TB/s; SK hynix over 2.8 TB/s | samsungHbm4, micronHbm4, skhynixHbm4 (T2, vendor-claim) |
| H28 | "the HBM4 standards work widens the bus to 2,048 bits" | JESD270-4: 2,048 bits, up to 8 Gb/s, 2 TB/s per stack, 32 channels, 4- to 16-high, up to 64 GB | jedecHbm4 (T1) |
| H29 | "betting that width scales more cleanly than frequency" | width doubled and shipping pins still beat the standard; SPHBM4 trades width back for signalling speed | jedecHbm4, jedecSphbm4, jedecJc422 (T1), vendor pages (T2) |
| H33 | prefill compute-bound | kept, merged with training into one paragraph | distServe (T3) |
| H34 | "scale-out fabric (NVLink, EFA, NIXL)" | "NVLink between GPUs, EFA between instances" | - |
| H36 | WSE-3 "No external DRAM in the steady state" | WSE-3 holds the weights in 44 GB of on-wafer SRAM at 21 PB/s; larger models split across wafers | cerebrasS1 (T1), cerebrasInferenceBlog (T2) (Cerebras section's records) |
| H37 / CM | "Samsung HBM-PIM and HyperCIM ... eliminating most bus traversal" | HBM2-PIM: FP16 units beside the banks, stepped by ordinary read and write commands, 4.92 vs 1.23 TB/s; a demonstrator; no commercial availability located; narrow operator set | samsungPimHc33 (T2, vendor-claim) |
| D1-D5 | diagram | see Diagram below | - |

CORRECT claims kept and re-cited: H3, H5, H7, H11, H12, H22, H28, H33.

## Claims removed

- H1 "almost linearly" and "pin speed" as the variable: WRONG.
- H18 Blackwell UNKNOWN Alert (with its NVLink aggregates and "Section 13" forward reference): STALE, CUT.
- H19 "Same GH100 die", "Same SM count": UNKNOWN; the same-compute point is carried by the FP8 dense peak.
- H25 "150 W or more", "4-8 stacks per package": UNKNOWN/STALE. Pin and stack counts now appear as B300's 8,192 data wires and MI455X's 12 stacks.
- H27 thermals paragraph and the signal-integrity paragraph (termination, equalization, impedance): CORRECT but qualitative and unsourced in detail; cut in the length pass (no number, no reader action). The Samsung power/thermal quote was drafted and then cut for length.
- H30 "Section 13 carries the verified numbers": STALE.
- H35 vision and tabular paragraph: UNKNOWN, no source; cut.
- "optimizer steps and weight updates frequently see diminishing returns from HBM above a threshold": unsourced; cut.
- H37 HyperCIM: CUT per CM15 (domain lapsed; archive shows no CIM product).
- All "Section N" cross-references: replaced by section names.
- Not used: H6's DDR5 sub-channel detail (UNKNOWN at Tier 1); JESD270-4A revision date (no reader action; record dropped).

## UNKNOWNs and how the page handles them

- MI455X shipping: chip cell carries a `roadmap` badge with "AMD lists a launch date of 7/23/2026. This research located no shipment confirmation." The derived MI455X comparisons repeat the note.
- Trainium3 and TPU7x HBM generation: cells read "Not on AWS's Trainium3 page" / "Not on Google's TPU7x page", scoped to the pages fetched 2026-10-17.
- Rubin HBM4 stack count: not on the HGX page (checked 2026-10-17). Not stated; no per-stack Rubin figure is derived.
- HBM4E standard: "As of October 2026, JEDEC's HBM committee lists no HBM4E standard among its published documents" (jedecJc422, accessed 2026-10-16).
- H36 Cerebras DRAM: the "no external DRAM" wording is gone; the page states only what the Cerebras section's sources state.

## Deviations from the orchestrator notes (and why)

- Shipping HBM4 pin rate "10 to 11.7 Gb/s (2.8 to 3.3 TB/s)": no fetched source gives 10 Gb/s, and 2,048 x 11.7 Gb/s is 3.0 TB/s, not 3.3. Samsung's 3.3 TB/s maximum goes with its "up to 13Gbps". The page says Samsung 11.7 and up to 13 Gb/s, up to 3.3 TB/s; Micron over 11 Gb/s and 2.8 TB/s; the diagram reads "2,048 bits x 11 to 13 Gb/s = 2.8 to 3.3 TB/s per stack, vendor claims". The per-stack 2.8 to 3.3 TB/s range matches High Bandwidth Flash's records.
- "36 GB 12-high in volume at all three makers": SK hynix's 2Q26 release confirms HBM4 mass shipments but gives no capacity or height. The page says all three ship HBM4 in volume and that Samsung and Micron ship 12-high stacks of up to 36 GB.
- Trainium2 row (register H16) not added; the orchestrator's row list names Trainium3 only.

## NEW content and its sources

- Two-lever model (capacity sets the batch, bandwidth sets the step time), with H200 as the example: h200Page (T2, vendor-claim and derived). Matches NVIDIA Hopper's "What 1.9x is made of".
- Table rows: Rubin (hgxPage), MI355X (amdMi355x), MI455X (amdMi455x, roadmap), Trainium3 (trainium3Arch), TPU7x (tpu7x).
- Sweeps per second column (bandwidth / capacity, the High Bandwidth Flash definition), with B300 vs B200 (28 vs 44) and MI455X vs Rubin (bandwidth within 6%, capacity 1.5x): derived.
- HBM4 volume shipping at three makers, pin rates, 12-high 36 GB, 16-high 48 GB sampling: samsungHbm4, micronHbm4, skhynixHbm4, skhynixQ2 (T2).
- B300 runs HBM3e at about 7.8 Gb/s; MI455X about 1.9 TB/s and 36 GB per stack, about 7.6 Gb/s: derived from blackwellUltraBlog and amdMi455x.
- SPHBM4 (JESD330-4, June 2026; 512 signals at 4:1): jedecJc422, jedecSphbm4 (T1).
- HBM4E samples (16 Gb/s, 48 GB, roadmap) and no JEDEC HBM4E standard: skhynixHbm4e (T2, roadmap), jedecJc422 (T1).
- WSE-3 about 480,000 sweeps a second against Rubin's 76: derived from cerebrasS1 and hgxPage.
- Link to High Bandwidth Flash as the capacity-first sibling (no number).

## Diagram

`HbmStackDiagram.tsx` rebuilt: `viewBox="0 0 880 466"`, `role="img"`,
`aria-labelledby="hbm-stack-title"` with an asserting `<title>`, no `aria-label`, full-bleed white
rect, Idiom A classes prefixed `hbm-`, fonts 10 to 13px sans-serif, no fixed height, wrapped in
`overflowX: auto` with `minWidth: 640`. Content: four cells for per-stack bandwidth by generation
(HBM3 1,024 x 6.4 = 819 GB/s, JEDEC; HBM3e 1,024 x up to 9.6 = 1.2 TB/s, vendor maximum; HBM4
2,048 x 8 = 2 TB/s, JEDEC; shipping HBM4 2,048 x 11 to 13 = 2.8 to 3.3 TB/s, vendor claims); a bar
chart of data width (DDR5 channel 64, HBM3/HBM3e 1,024, HBM4 2,048 bits); a 12-high stack (DRAM
die 1 and 12 labelled, TSVs, base logic die with the PHY), "HBM4 volume part: up to 36 GB"; the
accelerator die labelled "GPU, TPU or Trainium compute" (no die codenames); an interposer label
"a B300 routes 8,192 HBM data wires through it". Every figure is cited in the caption or prose.

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-hbm): before, 2 overlaps at both
widths (die labels against the PHY labels). After: "1 SVG diagram(s), 0 React Flow, ok" at 1440
and 390, no page-level horizontal overflow. PNGs read: at 1440 every label sits inside its box,
the PHY label sits in the gap above its line, the TSV and base-die callout lines end clear of
text, the bars' values sit inside the long bars and beside the short one. At 390 the diagram
scrolls sideways in its wrapper and the visible part is legible; the table scrolls inside the
Cloudscape table.

## Leverage pass: claim-set diff

Assertions in the after that were not in the before, each with its source:
1. Bandwidth sets step time, capacity sets batch, throughput is batch over step time: our reading, built on h200Page's footnote (derived).
2. H200: 1.43x bandwidth, 1.76x capacity, 4x batch, 1.9x rating: h200Page (vendor-claim, derived).
3. B300 has 8,192 HBM data wires: blackwellUltraBlog.
4. "customer demand exceeds supply capabilities": skhynixQ2.
5. FP8 1,979 TFLOPS dense on both; NVLink 900 GB/s bidirectional; up to 700 W: h100Page, h200Page, hopperArchBlog, blackwellUltraBlog.
6. Batch 32 vs 8 and 128 vs 64; 2K in / 128 out: h200Page.
7. Fixed batch caps the gain at 1.43x; extra 61 GB; 4x sequences per weight read: derived from h200Page.
8. Compare chips at the batch each holds: guidance from 6 and 7, no new fact.
9. Table rows (B200, B300, Rubin, MI355X, MI455X, Trainium3, TPU7x) and the two "not on the page" generation cells: sources as listed above.
10. Sweeps per second per chip; B300 1.6x B200 capacity; 28 vs 44; MI455X vs Rubin 6% and 1.5x: derived.
11. Rubin's three bandwidth figures: hgxPage, veraRubinNvl72.
12. HBM3 819 GB/s per stack and 1,024 bits derived from it: jedecHbm3.
13. HBM4 2,048 bits, 32 channels, 8 Gb/s, 2 TB/s, 4- to 16-high, 64 GB: jedecHbm4.
14. DDR5 channel 64 data bits (derived), up to 8,800 Mb/s, HBM4 stack 32 channels wide (derived): epyc9755Page, epyc9005Datasheet, jedecDdr5c, jedecHbm4.
15. Standard HBM4 needs silicon rather than organic substrate: jedecSphbm4 (inferred from SPHBM4's stated purpose).
16. Volume shipment timing, pin rates, per-stack bandwidth, stack heights and capacities: samsungHbm4, micronHbm4, skhynixHbm4, skhynixQ2.
17. B300 about 7.8 Gb/s per pin; Samsung HBM3E maximum 9.6 Gb/s; MI455X about 1.9 TB/s, 36 GB, 7.6 Gb/s per stack: blackwellUltraBlog, samsungHbm4, amdMi455x (derived).
18. SPHBM4: JESD330-4, June 2026, 512 signals, 4:1, organic substrates: jedecJc422, jedecSphbm4.
19. HBM4E samples June 2026, 16 Gb/s, 48 GB; no JEDEC HBM4E standard listed: skhynixHbm4e (roadmap), jedecJc422.
20. Prefill reuses each weight read across the prompt: distServe.
21. WSE-3 44 GB SRAM at 21 PB/s, about 480,000 sweeps a second; larger models split across wafers: cerebrasS1, cerebrasInferenceBlog (derived for the sweep rate).
22. Groq 3 LPX runs decode's FFN and MoE layers SRAM-first beside Rubin: lpxBlog.
23. HBM2-PIM mechanism, 4.92 vs 1.23 TB/s, "demonstrator": samsungPimHc33 (vendor-claim); "no commercial availability located": register CM6, scope kept.

No assertion without a source remains. Scope check: "located", "not on ... page" and "As of October 2026" hedges are kept as the register and fetches scoped them.

## For the orchestrator

- Glossary acronyms introduced: **TPU** (Tensor Processing Unit), **PIM** (processing-in-memory), **PHY** (physical layer interface, in the diagram), **SPHBM4** (Standard Package HBM4). The HBM entry could mention HBM4E as the sampling successor.
- `sources.md` needs regeneration: new records `amdMi455x`, `tpu7x`, `jedecHbm3`, `jedecJc422`, `jedecSphbm4`, `jedecDdr5c`, `skhynixQ2`, `samsungPimHc33`; `samsungHbm4`, `micronHbm4` and `skhynixHbm4` carry accessed 2026-10-17 here (2026-10-16 in HighBandwidthFlash.ts; the registry keeps the later date).
- `samsungPimHc33` uses the register's T2-30 title; the ComputeInMemory author should reuse it.
- `tpu7x` keeps the register's URL (`cloud.google.com/tpu/docs/tpu7x`), which now 301-redirects to `docs.cloud.google.com/tpu/docs/tpu7x`.
- Cross-section consistency: NvidiaHopper's "What 1.9x is made of" and this section use the same numbers and reading.
