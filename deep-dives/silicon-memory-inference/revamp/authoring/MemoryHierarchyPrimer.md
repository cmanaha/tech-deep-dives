# Change report: MemoryHierarchyPrimer (nav id `memory-hierarchy`)

Register: `research/2026-10-refresh/01-memory.md` section 1 (claims P1-P33, T1a-T8; recommended
edits 1-8), plus `hbf.md` row 6.6 and `flash-cache-tier.md` table 6b for the two new tiers.
Files: `src/sections/MemoryHierarchyPrimer.tsx`, `src/components/MemoryHierarchyTower.tsx`,
`src/sources/MemoryHierarchyPrimer.ts` (new, 37 records).

## What the reader gets

One map from register file to NVMe flash, grouped by where each tier sits (on the chip, on the
accelerator package, off the package, storage), with capacity, bandwidth and latency per tier and
High Bandwidth Flash drawn dashed beside HBM. The opening replaces the "10x per tier" model with
the measured, uneven step: on p5en an H200 drops from 4.8 TB/s of HBM to 64 GB/s of host DRAM per
direction, 75 times less bandwidth for under twice the capacity (repeated in the bandwidth-wall
block), and HBF breaks the pattern by adding 512 GiB stacks on the package. The section ends on a
placement rule (bytes read every decode step: HBM, or HBF once it ships; KV read once per hit: host
DRAM then NVMe; latency-tolerant host data: CXL) and a pointer to the vLLM dive's KV Offloading and
LMCache section.

## Claims changed (before -> after; source key; tier; kind)

| Register row | Before | After | Source key | Tier | Kind |
| --- | --- | --- | --- | --- | --- |
| P1 (edit 5) | "differ by roughly an order of magnitude from the tier above" | "Lower tiers mostly hold more and deliver less, in uneven steps"; p5en example: 4.8 TB/s, 141 GB HBM vs 64 GB/s, 256 GiB host DRAM per GPU = 75x less bandwidth for under 2x capacity | h200Page; ec2AcceleratedSpecs; xeon6Brief | 2; 1; 1 | spec; derived |
| P2 (edit 8) | "2026 silicon landscape" | paragraph removed (rewritten opening) | - | - | - |
| P3 (edit 1) | "Sections 6, 7, 12-13, 15" | section names (HBM and the Bandwidth Wall; DDR5, MRDIMM, LPDDR5X and CXL; NVIDIA Blackwell; AWS Trainium, Inferentia and Neuron) | - | - | - |
| P4 | H200 product page link | `Cite` h200Page; H100 80 GB, 3.35 TB/s added | h200Page, h100Page | 2 | spec |
| P5 (edit 1) | dead Xeon 6 brief link | Intel ORM for 48 KB L1D and 2 MB L2; ARK for 504 MB | intelOrm, xeon6980pArk | 1 | spec |
| P6 | "accessed 2026-04-23" | access dates live in the source records | - | - | - |
| P7 | 256 KB register file per SM | kept, cited | hopperTuningGuide, blackwellTuningGuide | 1 | derived (64K x 4 B) |
| P8 (edit 2) | Trainium "Tensor-engine operand registers" | "-" | - | - | - |
| P9 | SMEM 228 KB, TMEM 256 KB | kept, cited | hopperTuningGuide; ptxIsa | 1 | spec; derived |
| P10 | SBUF, PSUM | plus sizes: SBUF 28 MiB (Trn2) / 32 MiB (Trn3) per NeuronCore, PSUM 2 MiB | nkiTrn2Arch, nkiTrn3Arch | 1 | spec |
| P11 | L1D 48-64 KB | kept, cited | intelOrm, gravitonReadme | 1 | spec |
| P13 | Trainium "compiler-managed; no conventional L1" | "None documented; SBUF is software-managed" | neuronCoreV3 | 1 | spec |
| P14 | Xeon 6 2 MB L2 | "2 MB per core (Xeon 6, Graviton4 and 5)" | intelOrm, gravitonReadme | 1 | spec |
| P15 | H100 50 MB; H200 50 MB | H100 50 MB only (H200 figure unpublished) | hopperTuningGuide | 1 | spec |
| P16 (NEW) | - | GB200 L2 126 MB | blackwellTuningGuide | 1 | spec |
| P17 / T5a | LLC "dozens to hundreds of MB"; tower "100-500 MB" | 36 MB (Graviton4) to 504 MB (Xeon 6980P) | gravitonReadme, xeon6980pArk | 1 | spec |
| P18 | GPU LLC "(merged into L2)" | "None; L2 is the last level" | hopperTuningGuide | 1 | spec |
| P20/P21 (NEW) | HBM3 / HBM3e list | 80 GB at 3.35 TB/s (H100); 141 GB at 4.8 TB/s (H200); 288 GB of HBM4 at 22 TB/s (Rubin, HGX page figure; NVL72 page's 19.2 named in the caption) | h100Page, h200Page, hgxPage, veraRubinNvl72 | 2 | spec |
| P22 | "HBM stacks on Trainium2 / Trainium3" | 96 GiB at 2.9 TB/s (Trn2); 144 GiB at 4.9 TB/s (Trn3) | trainium2Arch, trainium3Arch | 1 | spec |
| P23 | CXL 2.0 pooling, CXL 3.0 sharing | kept, cited | cxl3Spec | 1 | spec |
| P24 | NVLink-addressable remote HBM | "Other GPUs' HBM over NVLink: 13.4 TB per GB200 NVL72, 900 GB/s each way" | gb200Nvl72, blackwellUltraBlog | 2 | spec |
| P25 (edit 2) | Trainium "SBUF / HBM on neighboring NeuronCores via CC-Cores" | "Other chips' HBM through NeuronLink pooling, up to 64 Trn2 chips" | trainium2Arch | 1 | spec |
| P27/P28 | "Section 13", "Section 17" | names | - | - | - |
| P29 / T6a (edit 3) | "~4-8 TB/s"; tower "3-5 TB/s" | 3.35 TB/s (H100) to 22 TB/s (Rubin, HGX page) | h100Page, hgxPage | 2 | spec |
| P30 | 2.5D, TSV, interposer | worded as the HBM section: DRAM dies on a base logic die, joined by TSVs, beside the accelerator on its package | - | - | - |
| P31 | CXL "modestly increase it" | 254 ns idle (CMM-D) vs 144 ns local DRAM on Samsung's platform; Pond's estimate +70-90 ns (8-16 sockets), over 180 ns rack scale | samsungCmmD; pond | 2; 3 | vendor-claim; simulated |
| P33 | "per-core bandwidth generally drops"; EPYC and Xeon "same effect" | Graviton4 5.6 to Graviton5 4.4 GB/s per busy core (-21%) while the socket gains 57%; EPYC/Xeon generalisation removed | r8gPreview, m9gGa | 2 | derived |
| T1a | register "KBs", "< 1 cycle", "effectively free" | "256 KB per GPU SM"; bandwidth and latency "-" | hopperTuningGuide | 1 | derived |
| T2a/T2b/T2c | scratchpad "10s of TB/s", "100s of KB", "~a few ns" | "228 KB to 32 MiB"; bandwidth "-"; "~29 cycles, SMEM, H800, measured" | hopperTuningGuide, nkiTrn3Arch; luoHopperBench | 1; 3 | spec; measured |
| T3a | L1 "~100s GB/s", "4-5 cycles" | "48-64 KB"; bandwidth "-"; "~41 cycles, GPU L1, H800" | intelOrm, gravitonReadme; luoHopperBench | 1; 3 | spec; measured |
| T4a | L2 "TB/s aggregate", "~12-20 cycles" | "2 MB per CPU core, 50-126 MB per GPU"; "-"; "~263 cycles, H800" | as P14-P16; luoHopperBench | 1; 3 | spec; measured |
| T5b | LLC "100s GB/s", "~30-100 cycles" | "-"; "~33 ns, local hit, Xeon 6 on r8i" | chipsAndCheeseXeon6 | 3 | measured |
| T6b (edit 3) | "400 GB/s-class (DDR)" | 614-845 GB/s per socket (12 channels, DDR5-6400 to MRDIMM-8800); up to 6 TB per socket | xeon6980pArk; epyc9005Datasheet | 1 | derived; spec |
| T6c | "10s of GB (HBM)" | 80-288 GB per GPU | h100Page, hgxPage | 2 | spec |
| T6d | "~200-400 cycles" | HBM "~479 cycles, H800, measured"; host DRAM "~144 ns idle, Samsung platform" | luoHopperBench; samsungCmmD | 3; 2 | measured; vendor-claim |
| T7a | "10s-100s GB/s" | 64 GB/s (CXL x16, per direction) to 900 GB/s (NVLink, each way) | xeon6Brief; blackwellUltraBlog | 1; 2 | derived; spec |
| T7b | "TBs" | 13.4 TB of HBM in one GB200 NVL72 | gb200Nvl72 | 2 | spec |
| T7c (edit 4) | "~1-3 μs" | "~254 ns idle, Samsung CXL module" | samsungCmmD | 2 | vendor-claim |

CORRECT rows kept and re-cited: P4, P7, P9-P12, P14, P17, P19 (folded into the DRAM range), P20,
P22-P24, P26-P28, P30-P32.

## The two new tiers (T8, edit 6)

| Tier | Capacity | Bandwidth | Latency | Status | Sources (identical records to HighBandwidthFlash.ts / FlashCacheTier.ts) |
| --- | --- | --- | --- | --- | --- |
| High Bandwidth Flash, beside HBM on the accelerator package | 512 GiB per 16-high stack (spec) | 0.384-3.072 TB/s per stack (spec grades); Sandisk Gen 1 claims 1.6 TB/s | not published; studies assume 1-20 µs | roadmap, drawn dashed and unfilled | ocpSpec (T1); sandiskFactSheet (T2, vendor-claim); sandiskInvestorDay2026 (T2, roadmap); flint, hbfSim (T3, simulated) |
| NVMe flash, off the package (instance store, FSx, EBS) | 30.4 TB per 8-GPU P5en or P6 (8 x 3,800 GB) | 1.56 (EBS) to 18.75 (FSx for Lustre with GDS) GB/s per GPU; instance store at least 2.25 | "-" (no sourced figure on this page) | shipping | ec2AcceleratedSpecs, fsxPerformance (T1, derived per GPU) |

Also from those sections, unchanged: HBF sweeps a stack about 3 times a second against about 80
for shipping HBM4 (sandiskFactSheet and micronHbm4, derived); HBF is "infeasible" for per-token KV
(maPatterson, T3). Host DRAM per GPU on p5en (256 GiB) and the PCIe Gen5 x16 64 GB/s figure match
FlashCacheTier's ladder.

## Claims removed and why

- P1 "order of magnitude per tier": wrong, replaced (above).
- "What is new about it" paragraph (P2 and its "seven tiers" framing): replaced by the opening.
- Edit 7 CUT: both debugging bullets ("Classic debugging is a profiler run...", "Debugging happens
  in the compiler IR...").
- "This is not a cosmetic distinction": defines by negation.
- "near-peak" Trainium claim and "the CPU decides when to evict": unsourced; eviction is now
  attributed to the hardware.
- Unsourced cycle and bandwidth figures in the tower (T1a, T2a, T3a bandwidth and latency, T4a CPU
  latency, T5b bandwidth): dropped and shown as "-".
- "Same effect on EPYC Turin and Xeon 6": register P33 shows it depends on DIMM speed; removed.
- H200 L2 50 MB (P15 UNKNOWN half).
- The word "seven" everywhere, including the Tower `aria-label` (replaced by `<title>`).
- "thousands of TFLOPs": unsourced; the ridge argument points to Roofline and Arithmetic Intensity.

## UNKNOWNs and how the page handles them

- On-chip bandwidth (registers, scratchpad, L1, L2, LLC) and register/CPU-L1 latency: no vendor
  figure; tower cells show "-", caption says a hyphen marks no sourced figure on this page.
- Latencies the page does show are third-party measurements on one part each (H800, r8i) or
  Samsung's own platform, labelled measured or vendor-claim; the caption says cycle counts do not
  convert to ns without the clock.
- HBF read latency: "not published", with the simulation assumptions (1-20 µs) cited as simulated.
- Trainium register file (P8) and caches: "-" or "None documented".

## Diagram changes and rendered check

`MemoryHierarchyTower` rebuilt: fixed-width rows (the shrinking pyramid overflowed at seven tiers;
the probe on the old build reported two `box-overflow` findings), ten rows in four placement groups
with left brackets, four columns (tier, capacity, bandwidth, latency), HBF row dashed with a white
fill. `role="img"`, `aria-labelledby` with a `<title>` stating the assertion, `viewBox` 900 x 521
only, full-bleed white background, fonts 11-13 px sans-serif, wrapped in `overflowX: auto` with
`minWidth: 640` (phone convention).

`shoot.mjs` at 1440 and 390: `ok` at both widths, no overlap, box overflow, clipping or page
overflow. PNGs read: at 1440 every label sits inside its row with clear gaps, the dashed HBF row
reads as distinct, no text crosses the bracket lines. At 390 the SVG scrolls sideways at 640 px and
stays legible. The 390 page also showed the per-family table crushed to letter-wide columns; fixed
by giving every column a `minWidth`, so the table scrolls inside its own wrapper.

## Word count

Rendered `main` at 1440, SVG text, Cite badges and code excluded (Playwright text walk,
`/tmp/mhp-tools/wc.mjs`).
- Before: 974.
- After: 1,134 with the disclosure closed (+16%); 1,367 with the per-family table expanded (+40%).
- Growth by block, each required by the register: new "Capacity beyond HBM and DRAM" block with the
  HBF and NVMe paragraphs and the placement rule (T8, edit 6, about 250 words new; the CXL Alert
  moved here from the bandwidth-wall block); map caption with acronym expansions and latency
  provenance (the brief requires every SVG number cited, about 110 words); the per-family table
  gained the HBM/host-DRAM split and an NVMe row plus the numbers P10, P16, P21, P22, P25 require. To
  pay for it: the scratchpad and cache containers merged (326 to 196 words), the debugging bullets
  cut (edit 7), the family table demoted into an `ExpandableSection` inside the map container, the
  three per-architecture scratchpad blurbs folded into one paragraph, the Xeon counterexample cut.

## Leverage pass: claim-set diff (assertions in the after that were not in the before)

- p5en step: H200 141 GB at 4.8 TB/s vs 256 GiB host DRAM per GPU at 64 GB/s per direction, 75x
  for under 2x (h200Page, ec2AcceleratedSpecs, xeon6Brief; derived).
- HBF 512 GiB per stack beside HBM (ocpSpec); Sandisk 1.6 TB/s, 25x the PCIe link
  (sandiskFactSheet, vendor-claim + derived); no HBF product ships as of October 2026
  (sandiskInvestorDay2026, roadmap).
- HBF spec grades 0.384-3.072 TB/s (ocpSpec); sweeps 3 vs about 80 per second (sandiskFactSheet,
  micronHbm4; derived); no read latency published (sandiskFactSheet); studies assume 1-20 µs
  (flint, hbfSim; simulated).
- NVMe: 8 x 3,800 GB per P5en/P6, at least 2.25 GB/s per GPU, EBS 1.56 (ec2AcceleratedSpecs,
  derived); FSx with GDS 18.75 GB/s per GPU (fsxPerformance, derived); GDS bypasses the CPU bounce
  buffer (gdsOverview); trn2.48xlarge 4 x 1,900 GB (ec2AcceleratedSpecs).
- Measured latencies: H800 SMEM 29, L1 41, L2 263, HBM 479 cycles (luoHopperBench); r8i L3 33 ns
  (chipsAndCheeseXeon6); DRAM 144 ns, CXL 254 ns (samsungCmmD); Pond +70-90 / 180 ns (pond).
- GB200 NVLink-C2C 900 GB/s bidirectional (blackwellArchitecture); NVLink 900 GB/s each way
  (blackwellUltraBlog); GB200 NVL72 13.4 TB HBM3e (gb200Nvl72).
- Host DRAM 614-845 GB/s (xeon6980pArk, derived) and 6 TB per socket (epyc9005Datasheet); CXL x16
  64 GB/s per direction (xeon6Brief, derived); Xeon 6 up to 64 CXL 2.0 lanes (xeon6Brief).
- Graviton4 5.6 vs Graviton5 4.4 GB/s per core, socket +57% (r8gPreview, m9gGa; derived).
- Placement rule: labelled "Our reading of these figures"; 110 ns = 254 - 144 (samsungCmmD,
  derived); per-token KV off HBF (maPatterson quote).

Every new assertion carries a source; none was left unsourced.

## For the orchestrator

- `sources.md` must be regenerated: the source-registry snapshot test fails only on sync, with the
  new `MemoryHierarchyPrimer.ts` records (tier-consistency test passes).
- New URLs entering the bibliography: Intel ORM 248966-050 change document (T1), Intel ARK Xeon
  6980P (T1), Samsung CMM-D IMDB white paper (T2).
- Glossary acronyms used here: SRAM, DRAM, HBM, HBF, NVMe, SM, SMEM, TMEM, SBUF, PSUM, LLC, CXL,
  EBS, GDS, NUMA, TSV, OCP, KV, JVM.
- Cross-links by name: Roofline and Arithmetic Intensity; HBM and the Bandwidth Wall; NVIDIA
  Blackwell; AWS Trainium, Inferentia and Neuron; Grace-Blackwell and UltraServer; Graviton Deep
  Dive; DDR5, MRDIMM, LPDDR5X and CXL; High Bandwidth Flash; Flash as a Cache Tier for Inference;
  `../vllm/` KV Offloading and LMCache.

## Checks

tsc (no errors in my files), eslint `--max-warnings 0` on the three files, vitest
`sections.test.tsx -t MemoryHierarchyPrimer` passes; no-ai-tells, svg-a11y and pinned-refs report no
hits in my files.
