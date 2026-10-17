# Change report: HighBandwidthFlash (nav id `hbf`)

Status: done, not committed.

Register: `research/2026-10-refresh/hbf.md` (all sections, Author guidance,
UNKNOWN register), with `M:` rows resolved in `01-memory.md`.

Files:
- `src/sections/HighBandwidthFlash.tsx` (461 lines; replaces the stub, export `HighBandwidthFlash` kept)
- `src/sources/HighBandwidthFlash.ts` (30 records)
- `src/components/HbfStackDiagram.tsx`, `HbfSweepsChart.tsx`, `HbfPackageDiagram.tsx`, `HbfPlacementMap.tsx`

Before: a stub ("This section is being written."), with no claims. So no claims were
changed and none were removed from the page. Every claim below is NEW. Section
order follows the register's suggested h2 outline, with one adjustment: the
register's sixth h2 ("What exists today and the dates to watch", which names the
2026-10-29 earnings call) became "What exists and what to plan for", because the task
forbids dated references to upcoming events. The "ask a vendor for three numbers"
payoff moved from h2 4 to the ending, because the task asks the page to end on it.

## Claims (all NEW; before = stub)

Tiers are as graded in the register; `M:` records are copied verbatim from the
existing `src/sources/*.ts` entries. Kind `spec` is the Cite default.

| # | Claim (after) | Source key | Tier | Kind |
| --- | --- | --- | --- | --- |
| 1 | HBF is NAND dies on a controller base die on the accelerator package beside HBM; a 16-high stack holds 512 GiB and reads at up to about 3 TB/s | ocpSpec | 1 | spec |
| 2 | Spec authors claim 8 to 16x HBM capacity at the same read bandwidth | ocpSpec | 1 | vendor-claim |
| 3 | "up to 8-16x the capacity of HBM at a similar cost"; no price published; the HBM stack the ratio uses is unnamed (512 GB = 8x 64 GB, 16x 32 GB) | sandiskSkHynixMou | 2 | vendor-claim |
| 4 | DeepSeek-V3 at FP8 = 671 GB, at least three Rubin GPUs at 288 GB | deepseekV3Report; hgxPage | 2; 2 | derived; spec |
| 5 | Gen 1 HBF stack about 3 sweeps a second, shipping HBM4 about 80 | sandiskFactSheet; micronHbm4 | 2; 2 | derived |
| 6 | HBF is roadmap: a spec and one taped-out die, no product on sale as of October 2026; device samples targeted for 2027 | sandiskInvestorDay2026 | 2 | roadmap |
| 7 | 16 NAND dies, TSVs, base die, 16 UCIe channels carrying AXI, in place of the JEDEC HBM interface | ocpSpec | 1 | spec |
| 8 | Adopting HBF takes new accelerator silicon (UCIe ports at every HBF site) | ocpSpec | 1 | derived |
| 9 | Base-die duties: ECC, NAND scheduling, bad-block and TSV repair, per-block read counter, optional SRAM scratchpad | ocpSpec | 1 | spec |
| 10 | No garbage collection; the host writes each block in consecutive 4 KiB pages; wear levelling by base die or host; 64 B reads, 4 KiB writes; HBF and HBM are separate non-coherent address spaces | ocpSpec | 1 | spec |
| 11 | (Expandable) UCIe-A x64 with 1-bit sideband, 45 µm bumps, reach under 2 mm; grades 1/2/3 at 0.384/1.536/3.072 TB/s; footprint about 10.975 x 16 mm x 775 µm, preliminary until v1.0 | ocpSpec | 1 | spec |
| 12 | (Diagram) Grade 3: 32 GT/s x 64 bits x 16 channels x 75% AXI efficiency = 3.072 TB/s | ocpSpec | 1 | spec |
| 13 | Gen 1: 1.6 TB/s over 512 GB = 3.1 sweeps a second | sandiskFactSheet | 2 | derived (inputs vendor-claim) |
| 14 | Shipping HBM4: 2.8 to 3.3 TB/s over 36 GB = 78 to 92 | samsungHbm4; micronHbm4 | 2 | derived |
| 15 | Per stack, HBF gives half to all of HBM4's bandwidth with 14x the data | as 13, 14 | 2 | derived |
| 16 | (Chart) HBF grades 1.4/2.8/5.6; HBM4 JEDEC bin 57; HBM4E samples 85; Vera LPDDR5X 0.8 | ocpSpec; jedecHbm4 + micronHbm4; skhynixHbm4e; graceCpuPage; skhynixHbm4 | 1; 1+2; 2; 2; 2 | derived; spec; roadmap; vendor-claim; vendor-claim |
| 17 | Dense 405B at FP8 on eight Gen 1 stacks: 31.6 ms per sweep, about 32 tokens a second per sequence (weights only) | sandiskFactSheet | 2 | derived |
| 18 | DeepSeek-V3 activates 37B of 671B; 2.9 ms per token on eight Gen 1 stacks against 1.7 ms on Rubin's 22 TB/s | deepseekV3Report; hgxPage | 2 | spec; derived |
| 19 | OXMIQ system model (Hot Chips 2026, via trade press): HBF cheaper at low batch with 85% "dead capacity", HBM cheaper per token at higher concurrency | tomsOxmiq; sthOxmiq | 3 | simulated |
| 20 | No HBF read latency published; Sandisk says only that it is higher than HBM's | sandiskFactSheet | 2 | vendor-claim |
| 21 | Studies assume 1 to 20 µs per page read; HBM 10 to 100 ns in Google's ballpark table | flint; hbfSim; maPatterson | 1 | simulated |
| 22 | Little's law: 6.4 MB in flight at 4 µs, 32 MB at 20 µs for a 1.6 TB/s stack | sandiskFactSheet | 2 | derived |
| 23 | Full bandwidth needs (4 KiB x N) across all channels at once (1 MiB at 16 banks, our arithmetic in the note) | ocpSpec | 1 | spec |
| 24 | Weights are the spec's first usage example: written at load, all channels interleaved, read every token | ocpSpec | 1 | spec |
| 25 | DeepSeek-V3 reads 5.5% of its weights per token | deepseekV3Report | 2 | derived |
| 26 | Qwen3-235B-A22B simulation: 8 to 32 resident experts cut average time per output token from 10.20 to 9.13 ms | potentialApps | 1 | simulated |
| 27 | FLINT: a static compiler-driven prefetcher wasted 86% to 96% of HBF traffic on MoE models | flint | 1 | simulated |
| 28 | Resident models switch with no load from storage | ocpSpec | 1 | spec |
| 29 | 27-model simulation: 4x capacity cut mean time to first token from 196.1 to 6.8 ms | potentialApps | 1 | simulated |
| 30 | Google researchers put slow-changing context (code or paper corpus) on HBF | maPatterson | 1 | spec |
| 31 | Google: HBF "infeasible for KV Cache data updated for every query or generation token" | maPatterson | 1 | spec (quote) |
| 32 | HBF Sucks?: KV writes outnumber reads on four production traces; average end-to-end latency 2 to 5.5x; TLC HBF tier wears out at 0.56x the SSD pool's life; verdict quote | hbfSucks | 1 | simulated |
| 33 | FlashAccel: SLC at about 100,000 P/E lets 1 TB absorb about 55 TB of writes a day; MLA 70 KB per token against GQA 502 KB | flashAccel | 1 | simulated |
| 34 | SPLASH: 3.5 to 11.4x baseline decode throughput per GPU at 100 ms per token | splash | 1 | simulated |
| 35 | Spec recommends separate channel groups for weights and KV; activations belong in HBM or base-die SRAM | ocpSpec | 1 | spec |
| 36 | Spec: 24 h retention at 85 C powered, host refresh typically every 24 to 48 h, no retention guaranteed without power, SSDs recommended for persistence | ocpSpec | 1 | spec |
| 37 | Sandisk's 2025 fact sheet calls HBF non-volatile with no refresh power needed (conflict with 36; page says plan on the spec) | sandiskFactSheet | 2 | vendor-claim |
| 38 | Retention refresh alone rewrites everything 0.5 to 1 times a day | ocpSpec | 1 | derived |
| 39 | Base die counts page reads per block; after a product-specific count the host rewrites the block | ocpSpec | 1 | spec |
| 40 | FLINT (SLC, 10^6 reads per block): a block read every step lasts 29 days at 10^5 P/E, 8 years at 10^7; naive burst refresh stalled a channel 26 s to 22 min | flint | 1 | simulated |
| 41 | Gen 1 read flat out at 1,024 pages per block: 3,200 page reads a second per block; refresh every 31 s at 10^5; 36 days at 10^5 P/E; 99 years at 10^6 reads and 10^7 cycles (lower bounds for those inputs) | sandiskFactSheet; flint | 2; 1 | derived; spec (inputs) |
| 42 | Sandisk designed its stack to HBM4's footprint, power profile and height | sandiskFactSheet | 2 | vendor-claim |
| 43 | One Gen 1 stack in place of a 36 GB HBM4 stack: +476 GB, -1.2 to 1.7 TB/s at that site | sandiskFactSheet; micronHbm4; samsungHbm4 | 2 | derived |
| 44 | Sandisk layouts 192 / 4,096 / 3,120 GB; its HBF examples fill all or most sites | sandiskInvestorDay2025 | 1 | vendor-claim |
| 45 | Spec layout: 2 HBF + 4 HBM, 1,168 GiB, managed as separate memories | ocpSpec | 1 | spec; derived (sum) |
| 46 | Eight Gen 1 stacks 12.8 TB/s against Rubin's 22 TB/s: about 40% of bandwidth traded for 14x capacity | hgxPage; sandiskFactSheet | 2 | derived |
| 47 | One Gen 1 stack reads 1.33x a whole Vera CPU's LPDDR5X (1.2 TB/s) | graceCpuPage | 2 | derived |
| 48 | One Gen 1 stack reads 25x a CXL 2.0 x16 link (64 GB/s per direction) | cxl3Spec | 1 | derived |
| 49 | (Expandable) DeepSeek-V3 fits the spec layout's 1,099.5 GB of HBF with 428 GB spare; 9.21 GB of KV per sequence at 128K; 16 sequences in the layout's 154.6 GB of HBM against 20 on three Rubin GPUs; 11.6 ms per token from two stacks (6.0 ms at grade 3) | ocpSpec; deepseekV3Config; hgxPage; sandiskFactSheet | 1; 1; 2; 2 | derived |
| 50 | Spec v0.7.0 published 3 August 2026 by Sandisk and SK hynix; Google and Tenstorrent joined; Sandisk later named Meta | ocpSpec; sandiskOcpRelease; sandiskInvestorDay2026 | 1; 2; 2 | spec |
| 51 | Sandisk taped out its first HBF memory die in August 2026 and targets device samples in 2027 ("early 2027" in the MoU release) | sandiskInvestorDay2026; sandiskSkHynixMou | 2 | vendor-claim; roadmap |
| 52 | Undated roadmap: Gen 2 above 2 TB/s, up to 1 TB; Gen 3 3.2 TB/s, up to 1.5 TB | sandiskFactSheet | 2 | roadmap |
| 53 | SK hynix calls its product AIN B; showed a structural model and internal simulations at the 2026 OCP Global Summit | skhynixOcp2025; skhynixOcp2026 | 2 | spec |
| 54 | Samsung and Kioxia concepts were located only in trade press | digitimesSamsung; blocksFilesKioxia | 3 | spec |
| 55 | Absence findings, scoped to this research in October 2026: no accelerator vendor HBF product, no vendor mass-production year, no measurement of HBF silicon, no HBF support in vLLM, SGLang or TensorRT-LLM | register absence rows | n/a | absence |
| 56 | Brokerage estimates of 2028 production, via trade press | trendforceTapeout | 3 | roadmap |
| 57 | The device reports rated and average P/E; the spec leaves the value to each product | ocpSpec | 1 | spec |

Count: 57 claims added, 0 changed, 0 removed from the page.

## Register items left out, and why

- **HBM3E 12-high bar (34 sweeps a second), and the "6x to 66x" gap.** The chart keeps to the HBM generation that HBF would sit beside. That keeps one comparison (about 3 against about 80, "25 to 30 times fewer"). *HBM and the Bandwidth Wall* covers HBM3E.
- **Neighbours table: Optane, Kioxia XL-FLASH, Samsung CMM-H (rows 1.28 to 1.30).** Cut for length. None of them changes what an architect would do with HBF. *Flash as a Cache Tier for Inference* covers flash on the storage side.
- **256 Gb per die (rows 1.25, 3.4).** Neither a mental model nor practical.
- **Spec internal inconsistencies (row 3.7)**, where the per-module throughput sums give 1.504/3.008 TB/s against Table 4's 1.536/3.072. The page uses Table 4, the specification's headline figures. The discrepancy is under 3% and is not decision-relevant.
- **Sandisk's February 2025 interface pitch ("same electrical interface", rows 2.2 to 2.4).** The register says to write only the current fact (UCIe), so the superseded pitch is not mentioned.
- **February 2025 Gen 2 and Gen 3 multipliers (row 3.10; conflict 3.11).** The page uses the later July 2025 fact-sheet figures (1 TB and 1.5 TB).
- **KAIST TeraLab roadmap and "bookshelf vs library" framing (rows 2.26 to 2.28).** These are an academic roadmap and a forecast reported via Tier 3. The page states the absence finding instead.
- **KAIST "approximately 100,000 write cycles" (U3).** This is a Tier 3 report of a professor's figure. The page uses the papers' labelled assumptions instead.
- **Micron position (U19).** Only a secondhand mention exists. The page says nothing about Micron rather than report hearsay.
- **HAVEN RAG reranking (row 5.18) and embedding tables (U23).** HAVEN was cut for length; Google's "slow-changing context" carries the RAG case. No source was located for embedding tables.
- **Sandisk agentic-coding simulation, "8 GPUs vs 1" (row 4.6, U24).** The model is unresolved ("490 billion parameter Qwen 3"), so the result cannot be stated accurately.
- **2H 2026 memory-sample target (U13).** Neither met nor reported. The page gives the tape-out and the 2027 device-sample target.
- **The 2026-10-29 earnings call.** This is a dated upcoming event, which the task forbids.
- **The read-disturb sensitivity grid (section 8).** Reduced to its endpoints (31 s, 36 days, 99 years). The arithmetic is in the `disturbNote` Cite note.
- **Base-die SRAM latency "in the order of L3 cache" (U11), and the spec v1.0 timing (U15).** Not decision-relevant at this length.

## UNKNOWNs and how the page handles each

- **U1 (read latency):** says "No HBF read latency is published"; gives the studies' 1 to 20 µs as `simulated` inputs; first item in the vendor ask.
- **U2 (write bandwidth):** says neither the spec nor Sandisk nor SK hynix publishes it; tied to reload time; in the closing "ask as well".
- **U3 and U6 (P/E, cell type):** "The inputs that settle it, HBF's cell type and rated P/E cycles, are unpublished"; second vendor ask.
- **U4 and U5 (read-disturb threshold, pages per block):** the range uses FLINT's labelled assumptions and says HBF's actual threshold and rating are unpublished; third vendor ask.
- **U7 (power) and U8 (price):** power is covered only as Sandisk's "power profile" vendor claim; both are in "ask as well", with "no vendor figure ... located in this research".
- **U9 (8-16x baseline):** a Cite note gives both readings (8x a 64 GB stack, 16x a 32 GB stack).
- **U10 (power-off retention):** "guarantees no retention without power"; plan a reload path.
- **U12 (silicon at OCP 2026):** "showed a structural model and internal simulations".
- **U14 (production year):** no vendor year; brokerage estimate of 2028 via Tier 3, labelled `roadmap`.
- **U16 (Gen 2 and 3 dates):** "Its undated roadmap".
- **U17 (AIN B specification):** only the name is stated.
- **U18 (Samsung) and U19 (Micron):** "located only in trade press reports" for Samsung and Kioxia; Micron is omitted.
- **U20 (JEDEC):** not stated. The page says HBF uses UCIe in place of the JEDEC HBM interface.
- **U21 (accelerator adoption) and U22 (serving engines):** scoped absence findings ("This research, in October 2026, located no ...").
- **U25 (OXMIQ slides):** "reported by trade press", cited Tier 3 with kind `simulated`.
- **U26 (no measurement):** "no measurement of HBF silicon ... Every system-level performance result on this page is a simulation or a model."

## NEW content and its sources

The whole section is new. Sources live in `src/sources/HighBandwidthFlash.ts`.

**Register-native records (accessed 2026-10-17):**
- Tier 1: ocpSpec, sandiskInvestorDay2025.
- Tier 1 arXiv papers: maPatterson, hbfSucks, hbfSim, flashAccel, flint, splash, potentialApps.
- Tier 2: sandiskFactSheet, sandiskSkHynixMou, sandiskOcpRelease, sandiskInvestorDay2026, skhynixOcp2025, skhynixOcp2026.
- Tier 3: tomsOxmiq, sthOxmiq, trendforceTapeout, blocksFilesKioxia, digitimesSamsung.

**`M:` records, copied with the exact URL, title, publisher and tier from the existing source files:**
- jedecHbm4 (T1) and deepseekV3Config (T1, Hugging Face, pinned to SHA e815299b0bcbac849fa540c768ef21845365c9eb).
- samsungHbm4, micronHbm4, skhynixHbm4 and skhynixHbm4e (T2).
- hgxPage (T2, identical to the NvidiaBlackwell record) and graceCpuPage (T2).
- cxl3Spec (T1) and deepseekV3Report (T2).

`sources.test.ts`: the same-URL-same-tier checks pass. FlashCacheTier.ts reuses six of these records with matching fields. The sync test fails only because `sources.md` needs regenerating, which is the orchestrator's job.

## Diagrams

All four are inline SVG with no new dependency.
- **HbfStackDiagram** (860x452, 1.90:1): the stack cross-section, the grade 3 arithmetic, and who does which job (base die, serving software, SSD).
- **HbfSweepsChart** (860x424, 2.03:1): a log axis computed by hand, `x = X0 + W*log10(v/LO)/log10(HI/LO)`, with eight bars, a range bar for shipping HBM4, a dashed roadmap bar for HBM4E, and an "about 3 against about 80" callout.
- **HbfPackageDiagram** (860x392, 2.19:1): the three Sandisk layouts plus the OCP specification's layout.
- **HbfPlacementMap** (860x416, 2.07:1): reads per write against the share read per step, with eight data types in three regions.

Each diagram has `role="img"`, `aria-labelledby` pointing at a `<title>`, a full-bleed white rect, unique class prefixes (`hbfs-`, `hbfw-`, `hbfp-`, `hbfm-`), fonts of at least 10 px, and a `minWidth: 600` scroll wrapper.

**Rendered check:** `scripts/shoot.mjs --sections hbf --widths 1440,390` reported "4 diagram(s), ok" at both widths, and I read the PNGs.
- At 1440 there are no collisions.
- At 390 each SVG stays 600 px wide inside a horizontal scroll wrapper, with labels at about 8 px, and the page itself does not overflow.
- Fixed during authoring:
  - The placement map's y-axis label was shortened to "share read per step" so it no longer collides with the tick labels.
  - "TPU" was replaced by "a GPU or custom chip" to avoid an unexpanded acronym.

## Leverage pass: claim-set diff

The before set is empty, so every assertion in the after set is new, and the claims table above is the diff with a source on every row. No unsourced assertion remains.

Edits made during the pass, for accuracy and to keep each hedge's scope:
- Cost attributed only to Sandisk.
- "As of October 2026" added to the no-product statement.
- "Half to all of HBM4's bandwidth" (it was a single ratio).
- The OXMIQ "dead capacity" wording matched to ServeTheHome.
- "Written at load with every channel interleaved".
- "Average end-to-end latency".
- "Can fit" for sparse long-context KV.
- "Recommends separate channel groups".
- "Sandisk's HBF examples".
- "Comes close to three GPUs".
- "Located only in trade press reports".
- "Every system-level performance result".
- The Sandisk footprint claim moved from the interface expandable to the site-trade paragraph, where it supports the argument.

## Checks

- `tsc --noEmit`: no errors in my files.
- eslint on all six files with `--max-warnings 0`: clean.
- `vitest sections.test.tsx -t HighBandwidthFlash`: pass.
- `sources.test.ts`: 143 of 144 pass; the one failure is the `sources.md` snapshot sync, which the orchestrator owns.
- Gates (`no-ai-tells`, `svg-a11y`, `pinned-refs`, `pre-overflow`): no hits in my files. They still fail on other files.
- Section length: 461 lines, against a target of "about 450". The section has four diagrams and six h2s.

## For the orchestrator (shared files)

1. **Glossary acronyms expanded in this section:**
   - HBF (High Bandwidth Flash), NAND (NOT-AND), HBM (High Bandwidth Memory), OCP (Open Compute Project), FP8 (8-bit floating point), TSV (through-silicon via)
   - UCIe (Universal Chiplet Interconnect Express), AXI (Advanced eXtensible Interface), JEDEC (Joint Electron Device Engineering Council)
   - ECC (error-correcting code), SRAM (static RAM), SSD (solid-state drive), LPDDR5X (Low-Power Double Data Rate 5X)
   - MoE (mixture of experts), KV (key-value), TLC (triple-level cell), SLC (single-level cell), P/E (program/erase)
   - MLA (multi-head latent attention), GQA (grouped-query attention), CXL (Compute Express Link)

   Also used in diagrams: xPU (the specification's term for any accelerator) and GT/s (gigatransfers per second).
2. **Regenerate `sources.md`** for the 30 records in `src/sources/HighBandwidthFlash.ts`.
3. **Cross-links by name:** HBM and the Bandwidth Wall; DDR5, MRDIMM, LPDDR5X and CXL; Mixture of Experts and Sparse Activation; KV Cache and FlashAttention; Flash as a Cache Tier for Inference. All are plain text, with no anchors.
4. **Tier tension to decide.** The register grades arXiv papers Tier 1 "for their own results", and the records carry tier 1 with publisher "arXiv". The Cite.tsx Tier 1 tooltip reads "official documentation, specification, filing or pinned source code", which does not describe a preprint. Every arXiv citation on the page carries kind `simulated`, so the badge does not present them as measurements. You may want to align the tooltip or the grade across the dive.
