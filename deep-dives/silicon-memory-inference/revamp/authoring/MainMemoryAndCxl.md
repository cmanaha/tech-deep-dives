# Change report: MainMemoryAndCxl (nav id `main-memory-cxl`, "DDR5, MRDIMM, LPDDR5X and CXL")

Status: COMPLETE. Recommended edits 1 to 8 applied; the grid shows HBF and the NVMe flash tier
as the stream brief requires.

Register: `research/2026-10-refresh/01-memory.md` section 3 (C1 to C33, G1 to G10,
Recommended edits 1 to 8). Grid figures for HBF and NVMe flash copied from
`src/sources/MemoryHierarchyPrimer.ts` / `MemoryHierarchyTower.tsx`, `HighBandwidthFlash.tsx` and
`FlashCacheTier.tsx`, with identical numbers.

Files: `src/sections/MainMemoryAndCxl.tsx`, `src/components/MemoryTechGrid.tsx`,
`src/sources/MainMemoryAndCxl.ts` (new, 41 records).

Shared records reused with identical URL, title, publisher and tier: `jedecDdr5c`
(HbmAndBandwidthWall), `cxl3Spec`, `ocpSpec`, `sandiskFactSheet`, `sandiskInvestorDay2026`,
`flint`, `hbfSim`, `graceCpuPage`, `micronHbm4` (HighBandwidthFlash / MemoryHierarchyPrimer),
`xeon6980pArk`, `xeon6Brief`, `samsungCmmD`, `gdsOverview`, `gravitonReadme`
(MemoryHierarchyPrimer), `ec2AcceleratedSpecs`, `fsxPerformance` (FlashCacheTier),
`epyc9005Datasheet`, `epyc9755Page`, `amdVeniceBlog`, `m8iPage` (AmdEpycTurin), `c9gGa`
(GravitonDeepDive), `graceSuperchipPage`, `gb200Nvl72` (GraceBlackwellUltraServer), `pond`
(CapitalMarketsLens). No source fetched during authoring; new records carry the register date
2026-10-16.

## Word count

Rendered `main` innerText at 1440, all disclosures open, SVG text and citation badges removed
(Playwright; script at /tmp/mmcxl-tools/wc.mjs, copied from /tmp/hbm-tools/wc.mjs). Totals include
about 136 words of app shell that are the same before and after.

| | Before | After |
| --- | --- | --- |
| Total `main` | 1,192 | 1,587 |
| Section only (total minus shell) | about 1,056 | about 1,451 |

Growth is about 37%. Every added block is NEW content the register or the stream brief requires:
- Grid caption (117 words): sources for six cells, the two new tiers' figures, the one-line reason
  HBF is in a host grid, and acronym expansions (EBS, GDS, IOPS, OCP, NVMe). Required by the
  stream brief.
- SOCAMM2 paragraph (about 80 words): register C19, C21 and Recommended edit 4.
- CXL KV-cache offload paragraph (about 55 words): C31, edit 5.
- CXL "Where to run it" (about 60 words): C30, edit 5.
- CXL versions disclosure (about 90 words, demoted into an ExpandableSection): C9, C29, edit 5.
Cut to offset: the "Why this section" opener, the Chips and Cheese Alert, the unsourced AMD quote,
the "Pick DDR5 RDIMM when" column, the HFT Alert (folded into one sentence), C11 and C24.

## Claims changed

| # | Before | After | Source key | Tier | Kind |
| --- | --- | --- | --- | --- | --- |
| C1 | DDR5-4800 "Original DDR5 launch (Genoa, Sapphire Rapids)" | "First DDR5 data rate in the JEDEC standard" (Sapphire Rapids has 8 channels, so the 12-channel peak never applied to it) | jedecDdr5 | 1 | spec / derived |
| C2 | DDR5-5600 Graviton4 | kept, re-cited | r8gPage, gravitonReadme | 2, 1 | spec |
| C3 | DDR5-6400 "Turin, Xeon 6 baseline" | EPYC 9005 with OEM enablement and a BIOS update (as AmdEpycTurin); Xeon 6 6900P; Graviton4 R8gn and R8gb | epyc9755Page, xeon6980pArk, r8gPage | 1, 1, 2 | spec |
| C4 | DDR5-7200 "Graviton5; M8i / R8i (Xeon 6, custom RDIMM)" | DDR5-7200: AWS M8i and R8i (Xeon 6); new row DDR5-8800 RDIMM: Graviton5, 70.4 / 844.8 GB/s | m8iPage, r8iPage, c9gGa, gravitonReadme | 2, 2, 2, 1 | spec / derived |
| C5 | "MRDIMM DDR5-8800 Xeon 6 6900P only" | MRDIMM-8800 row (Xeon 6 6900P) plus MRDIMM-12800 row: EPYC 9006, 16 channels, 102.4 / 1,638 GB/s | xeon6980pArk, epyc9996Page, amdVeniceBlog | 1, 2, 2 | spec / roadmap |
| C6 | "4800 -> 5600 -> 6400 -> 7200" | h1: 844.8 GB/s from 12 x DDR5-8800 RDIMM; 1,638 GB/s from 16 x MRDIMM-12800 | c9gGa, epyc9996Page | 2 | derived / spec |
| C8, C18, G6 | Grace "~500 GB/s", "480 GB", "roughly 16 W" | 480 GB per Grace; about 16 W at up to 500 GB/s; Grace CPU C1 384 GB/s for 480 GB, pointing to Grace-Blackwell and UltraServer for which to plan with | gb200Nvl72, graceSuperchipPage | 2 | spec |
| C9 | "CXL 2.0 (pooling) to 3.0 (sharing)" | shipping CPUs are CXL 2.0; spec ladder to 4.0 at 128 GT/s in a disclosure | xeon6Brief, epyc9005Datasheet, cxl3Spec, cxl31Spec, cxl32Spec, cxl4Spec | 1 | spec |
| C10 | four plain footer Links dated 2026-04-23 | replaced by Cite records dated 2026-10-16/17 | (all) | - | - |
| C13 | MRDIMM: one MRCD buffer | MRCD plus MDB, both JEDEC device standards; bus at twice the DRAM rate (8,800 over 4,400) | jedecJc40, jedecMrdimmPlans | 1 | spec / derived |
| C14 | "6900P only; 6700P/6500P DDR5-8000 MRDIMM" | 6900P at 8,800; 6700P ARK conflict (MRDIMM(8800) vs max 8,000) in a disclosure, sized at 8,000 | xeon6980pArk, xeon6787pArk | 1 | spec |
| C15 | "Turin does not support MRDIMM; AMD says waiting for JEDEC" | EPYC 9005 takes RDIMMs only; EPYC 9006 announced with JEDEC MRDIMM to 12,800; 1,638 vs 1,024 GB/s, 60% from the module type | epyc9005Datasheet, amdVeniceBlog, epyc9996Page | 1, 2, 2 | spec / roadmap / derived |
| C16 | "about 37% over DDR5-6400" | Intel's "more than 37%" as a vendor claim, matching 8,800 / 6,400 | xeon6Brief | 1 | vendor-claim |
| C19 | "cannot scale beyond what is soldered" | Grace solders; Vera uses field-replaceable SOCAMM modules, 1.2 TB/s, 1.5 TB (NVIDIA) vs 2 TB (Micron), stated as a disagreement | graceCpuPage, micronHbm4 | 2 | spec / vendor-claim |
| C22, C27, C28 | CXL pooling vs sharing, 3.0 at 64 GT/s | kept, re-cited | cxl3Spec | 1 | spec |
| C23 | "coherent expansion bus over a PCIe-class physical layer" | kept; 32 GT/s per lane, 64 GB/s per direction per x16 | xeon6Brief | 1 | spec / derived |
| C25, C26 | "200-400 ns"; "adds 100s of nanoseconds" | about 110 ns more per load (Samsung 254 vs 144 ns idle, vendor claim); Pond 70 to 90 ns in 8 to 16 socket pools, more than 180 ns at rack scale (as CapitalMarketsLens and MemoryHierarchyPrimer) | samsungCmmD, pond | 2, 3 | vendor-claim / derived / simulated |
| C32 | "Pick MRDIMM (Xeon 6 6900P)" | MRDIMM: Xeon 6 6900P or EPYC 9006 once it ships; price Graviton5 DDR5-8800 first | (body citations) | - | - |
| C33 | "Pick LPDDR5X when ... soldered limit" | Grace solders it, Vera uses SOCAMM2; size Vera at 1.5 TB | (body citations) | - | - |
| G1 | DDR5 "~50 GB/s per channel", "6 TB" | 614-845 GB/s per socket (12 ch, 6400 to 8800), up to 6 TB (EPYC 9005) | c9gGa, epyc9005Datasheet | 2, 1 | derived / spec |
| G2 | "~80-130 ns local" | ~144 ns idle, Samsung's test platform (same as the Primer tower) | samsungCmmD | 2 | vendor-claim |
| G3, G5 | MRDIMM "~70 GB/s", "Xeon 6 only" | 845-1,638 GB/s per socket; 3 TB (6900P); Xeon 6 6900P, EPYC 9006 announced | xeon6980pArk, epyc9996Page | 1, 2 | spec |
| G4 | MRDIMM "~80-110 ns" (lower than RDIMM) | "No figure located" | - | - | - |
| G7 | LPDDR5X "~150-200 ns" | "No figure located" | - | - | - |
| G8 | "CXL 2.0 / 3.0", "~64 GB/s per x16" | CXL memory, 64 GB/s per x16 per direction at CXL 2.0, 256 at CXL 4.0 | xeon6Brief, cxl4Spec | 1 | derived |
| G9 | "~200-400 ns over the link" | ~254 ns idle, +110 ns over local DRAM | samsungCmmD | 2 | vendor-claim / derived |

The Chips and Cheese "STREAM triad per socket" Alert is gone; the DDR5 block points to Intel Xeon 6
for the measured NUMA-local read, which resolves the REVAMP-PLAN cross-section note.

## Claims removed

- C11 "STREAM triad usually lands at 60-90%": unsourced (UNKNOWN), CUT per edit 7.
- C12 Chips and Cheese Alert: wrong test name, wrong scope ("per socket"), and a figure above the
  12-channel peak; CUT. Intel Xeon 6 owns the measured figure.
- C15 "AMD says they are waiting for full JEDEC standardization": no source.
- C17 "MRDIMM roughly neutral ... small latency penalty", and the matching "small latency penalty"
  bullet: no vendor figure; replaced by "No vendor latency figure for MRDIMMs was located during
  this research".
- C20 "LPDDR5X latency modestly higher": UNKNOWN, dropped.
- C24 "(10s of TBs)" for recommender embeddings: unsourced, CUT; the use case stays.
- "Pick DDR5 RDIMM when" column: CUT per edit 7 (generic, changes no decision).
- "Apple silicon and numerous embedded platforms", "Grace-Blackwell-class ... NVLink-C2C coherent
  domain", "OLAP", "graph databases", "mixed-tenant SaaS": no register row; dropped to hold length.
- Tier numbers ("tier 6", "tier 7") and "Section 6": the Primer tower no longer numbers tiers, and
  cross-references use names.
- HFT Alert: reduced to one sentence ("Keep latency-bound data in local DRAM and put
  capacity-bound data on CXL") with a pointer to Capital Markets Lens; C26 said the conclusion
  stands.

## UNKNOWNs and how the page handles each

- MRDIMM, LPDDR5X latency (C17, C20, G4, G7): grid shows "No figure located"; the caption defines
  it as "none found in the sources read for this research".
- NVMe flash latency: "No figure located", with AWS's 4.4 M IOPS at 4 KiB rating as the note
  (Primer tower shows no latency for the same tier).
- HBF latency: "Not published" (Sandisk states it is higher than HBM's with no figure), simulator
  inputs 1 to 20 us labelled simulated; same as the Primer.
- EPYC 9006 CXL version: "The AMD pages read for EPYC 9006 do not state its CXL version."
- CXL 3.x CPU silicon (C29): "No shipping CPU with CXL 3.x support was confirmed in a source read
  during this research."
- AWS CXL (C30): "No EC2 instance with CXL-attached memory was located during this research" (same
  wording as Capital Markets Lens).
- EPYC 9006 availability: the register dates a 2026-07-23 launch, but "in production" is a search
  extract only, and AmdEpycTurin treats Venice as roadmap with no ship date. This page says
  "announced July 2026", cites the blog as `roadmap`, and says "once it ships" in the guidance.
- C18 "16 W": the register marked it UNKNOWN on the Grace CPU page, but GraceBlackwellUltraServer
  fetched it on the Grace CPU Superchip page (2026-10-17: "up to 500 GB/s in only about 16W"). Kept
  with that record.

## NEW content and its sources

- Grid row 2: CXL memory, NVMe flash as the KV-cache offload tier (30.4 TB per 8-GPU P5en or P6,
  1.56 to 18.75 GB/s per GPU, instance store at least 2.25) and HBF (512 GiB per 16-high stack,
  0.384 to 3.072 TB/s per stack, Sandisk Gen 1 1.6 TB/s, latency not published, samples targeted
  for 2027): ec2AcceleratedSpecs, fsxPerformance, gdsOverview, ocpSpec, sandiskFactSheet, flint,
  hbfSim, sandiskInvestorDay2026. Identical to the Primer tower.
- DDR5-8800 RDIMM and MRDIMM-12800 rows (C4, C5): c9gGa, gravitonReadme, epyc9996Page,
  amdVeniceBlog.
- MRDIMM device standards and Gen2/Gen3 roadmap (C13): jedecJc40, jedecMrdimmPlans,
  jedecMrdimmRoadmap.
- EPYC 9006 RDIMM 8,000 vs MRDIMM 12,800 on 16 channels, 1,024 vs 1,638 GB/s, 60% [derived]:
  epyc9996Page.
- SOCAMM2, Vera, LPDDR6 (C21): jedecJc45, jedecSocamm2, graceCpuPage, micronHbm4, jedecLpddr6.
- CXL 3.1, 3.2, 4.0 (C9, C29): cxl31Spec, cxl32Spec, cxl4Spec.
- Cloud availability (C30): azureCxl, x8iWhatsNew.
- KV-cache offload on a CXL 2.0 switch pool (C31): samsungKvCxl, vendor-claim.

## Diagram changes and rendered check

`MemoryTechGrid.tsx` rebuilt: six cells in two labelled rows ("Host memory, on the CPU's own
memory channels": DDR5 RDIMM, MRDIMM, LPDDR5X and SOCAMM2; "Beyond local DRAM": CXL memory, NVMe
flash (KV-cache tier), High Bandwidth Flash). Each cell has attach-point pills, bandwidth,
capacity and latency with a note line, and a "where to get it" line. HBF carries a solid purple
"Accelerator package" pill, an amber "Roadmap" pill, a dashed border and "No product; samples
targeted for 2027". `role="img"`, `aria-labelledby="memory-tech-grid-title"` with a `<title>`
stating the comparison, `aria-label` removed, `viewBox` only, full-bleed white rect, sans-serif,
fonts 10 to 13.5. Layout: 3 x 2 in a 900-unit viewBox at container widths of 560 px and up, inside
the dive's phone wrapper (`overflowX: 'auto'`, `minWidth: 640`); below 560 px a ResizeObserver
switches to one column in a 320-unit viewBox, so text renders at about its authored size on a phone.

Probe, before: six box-overflow findings and one overlap at both widths. After
(`scripts/shoot.mjs --sections main-memory-cxl --widths 1440,390`): `ok` at both widths, no page
overflow. PNGs read: at 1440 the 3 x 2 grid has even padding, no text near a border, pills sized
to their labels; at 390 the grid is one column, every label legible, HBF's pills and dashed
border visible. The sticky breadcrumb shows across one cell in the 390 element screenshot; that is
the page header captured during scrolling, not part of the SVG. The DDR5 table scrolls sideways at
390 with fixed column widths (badges no longer wrap inside cells).

## Leverage pass

- Opening: mental model "peak bandwidth = channels x data rate x 8 bytes", landed with 844.8 GB/s,
  614.4 and 1,638, and CXL's 110 ns; the reader can size any socket from a spec sheet.
- Grid: one view of where bytes can live and which you can buy; HBF's caption tells the reader why
  it is there and that a host cannot buy it.
- MRDIMM: the edge moves (RDIMM at 8,800 matches MRDIMM-8800); reader action: price Graviton5
  before paying for MRDIMM; 6700P sizing at 8,000.
- LPDDR5X: bandwidth per watt and serviceability; action: size Vera at 1.5 TB.
- CXL: action split by latency tolerance, KV offload as the inference case, and where it runs
  (Azure preview; on EC2 go to NVMe flash).
- Strongest number repeated: 844.8 GB/s (h1, table, MRDIMM block, How to choose); 110 ns (h1,
  grid, CXL h2 title and body, How to choose).

Claim-set diff, assertions in the after not in the before, each with its source:
1. Peak per socket = channels x data rate x 8 bytes, 844.8 / 614.4 GB/s: c9gGa, gravitonReadme [derived].
2. 1,638 GB/s per socket on EPYC 9006 at 12,800 MT/s, 16 channels; 1,024 GB/s with RDIMM-8000: epyc9996Page.
3. EPYC 9006 announced July 2026 with JEDEC-standard MRDIMM: amdVeniceBlog [roadmap].
4. 60% from module type on EPYC 9006: epyc9996Page [derived].
5. MRDIMM uses MRCD and MDB, both JEDEC device standards: jedecJc40.
6. Bus at twice the DRAM rate: jedecMrdimmPlans [derived].
7. Gen2 raw cards target 12,800; Gen3 in development: jedecMrdimmRoadmap [roadmap].
8. Graviton5 RDIMM matches 6900P MRDIMM at 844.8 GB/s: c9gGa [derived].
9. Xeon 6787P ARK lists MRDIMM(8800) and max 8,000 on 8 channels: xeon6787pArk.
10. EPYC 9005 RDIMM only: epyc9005Datasheet.
11. DDR5 launched at 4,800; JESD79-5C timings to 8,800: jedecDdr5, jedecDdr5c.
12. DDR5-6400 on EPYC 9005 needs OEM enablement and a BIOS update: epyc9755Page.
13. R8gn and R8gb at DDR5-6400: r8gPage.
14. M8i and R8i at DDR5-7200: m8iPage, r8iPage.
15. Up to 6 TB per socket on EPYC 9005: epyc9005Datasheet.
16. 3 TB per socket on Xeon 6 6900P: xeon6980pArk.
17. Grace 384 GB/s for 480 GB: graceSuperchipPage.
18. SOCAMM2 is JESD328, June 2026, up to 9.6 Gb/s per pin: jedecJc45, jedecSocamm2.
19. Vera field-replaceable SOCAMM, 1.2 TB/s, 1.5 TB: graceCpuPage.
20. Micron 192 GB SOCAMM2 in volume, up to 2 TB per CPU: micronHbm4 [vendor-claim].
21. LPDDR6 JESD209-6 July 2025; no data-center product located: jedecLpddr6 (scoped hedge).
22. Xeon 6 up to 64 lanes CXL 2.0 at 32 GT/s: xeon6Brief; EPYC 9005 CXL 2.0: epyc9005Datasheet.
23. EPYC 9006 CXL version not stated in the pages read: register (scoped hedge).
24. Samsung 254 vs 144 ns, 110 ns delta: samsungCmmD [vendor-claim, derived].
25. Pond 70 to 90 ns and over 180 ns: pond [simulated].
26. Samsung vLLM + LMCache on a CXL 2.0 switch pool, comparable at TP=1, about 92% at TP=8: samsungKvCxl [vendor-claim].
27. Azure M-series CXL private preview, November 2025: azureCxl.
28. No EC2 CXL instance located; X8i January 2026, up to 6 TB, no CXL tier mentioned: x8iWhatsNew (scoped hedge).
29. CXL 3.0, 3.1, 3.2, 4.0 features and dates; 128 and 256 GB/s per direction: cxl3Spec, cxl31Spec, cxl32Spec, cxl4Spec [derived].
30. Grid NVMe and HBF figures: as in NEW content above.
31. "Size a Vera host at NVIDIA's 1.5 TB until a platform specification settles it" and "Size a
    6700P host at 8,000": our guidance from the cited disagreement, phrased as advice.

## For the orchestrator

- Glossary acronyms introduced or used here: DDR5, RDIMM, DIMM, MRDIMM, MRCD, MDB, LPDDR5X, LPDDR6,
  SOCAMM2, CXL, CHMU, TSP, TEE, HBM, HBF, NVMe, EBS, FSx, GDS, IOPS, OCP, MT/s, GT/s, NUMA, TP, KV.
- Cross-links by name: Intel Xeon 6, Grace-Blackwell and UltraServer, Capital Markets Lens, Flash
  as a Cache Tier for Inference; `../vllm/` (KV Offloading and LMCache).
- REVAMP-PLAN cross-section note on Intel Xeon 6 ("DDR5, MRDIMM, LPDDR5X and CXL still says
  [STREAM triad per socket]") is resolved and can be struck.
- `micronHbm4` carries `accessed: 2026-10-17` in HbmAndBandwidthWall.ts and 2026-10-16 elsewhere
  (same URL, title and tier); this file uses 2026-10-16.
- EPYC 9006 status differs between the register ("launched 2026-07-23") and AmdEpycTurin
  (roadmap, no ship date). This page follows AmdEpycTurin; if a later pass confirms shipment, the
  `roadmap` kind on `amdVeniceBlog` and "once it ships" should change in both sections.
- No shared file needs an edit.
