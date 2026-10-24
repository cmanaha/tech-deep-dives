# Verification: High Bandwidth Flash

Verified: 2026-10-23. Claims checked: 62 (sampled: 0; every row below was checked against its
source, except row 55, a set of absence findings whose hedge scope was checked but whose searches
were not repeated). Of the 61 verdicts: confirmed 50, wrong 4, unsupported 5, mislabelled 2,
unverifiable 0.

Sources fetched 2026-10-23, with curl's default User-Agent or WebFetch. No request carried personal
data. The fetches: the OCP HBF specification v0.7.0 PDF (130 pp.), the Sandisk HBF fact sheet PDF,
the Sandisk 2025 Investor Day deck PDF, the Sandisk MoU release (2025-08-06), the Sandisk OCP release
(2026-08-03), the Stock Analysis transcript of Sandisk Investor Day 2026, and the SK hynix OCP 2025
and OCP 2026 newsroom pages. Also seven arXiv PDFs (2601.05047, 2608.11668v4, 2609.09800,
2607.10186v2, 2608.25062v1, 2609.23816, 2608.13127v2), Tom's Hardware, ServeTheHome, TrendForce,
Blocks & Files and DIGITIMES (lead only). For the HBM, CPU and CXL inputs: the Micron HBM4 release,
the SK hynix HBM4 page and HBM4E release, the NVIDIA HGX and Grace CPU pages (all WebFetch), the
JEDEC HBM4 and Samsung HBM4 releases (Wayback copies; the live Samsung page timed out twice), the
CXL 3.0 release PDF, the DeepSeek-V3 arXiv abstract, and the pinned config.json.

## Gate 3 score: 8/10

The section gives the reader one ratio, sweeps per second, that predicts where HBF fits. It adds a
two-question placement test, the case that reads still spend endurance, and three datasheet numbers
to ask a vendor for. Every load-bearing figure checks out against its source. The eleven failures were
a rounding error, an HBM4 figure credited to the wrong vendor, a tape-out month the source does not state, three hedges or wordings stronger than
the specification, two grades or kinds, a record date and two diagram captions, and all are fixed.
What keeps it at 8 is density: two blocks ("Reading wears flash too" and the worked example) stack
six or more derived figures into a paragraph each.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 50 of 61 confirmed. None of the failures was load-bearing: 428 shown for 428.5, a tape-out month the transcript does not give, "recommends" for the spec's "it is possible to choose", and similar. |
| Mental model or practical value | 9 | Models: sweeps per second, "two questions place any object", "refresh turns reads into writes". Practical: the vendor ask, the "Plan for" list, the reload path. Every block passes one of the two tests. The SK hynix, Samsung and Kioxia status sentence is the thinnest, but a buyer weighing second sources can use it. |
| Shape | 8 | Opens with "What HBF is" and "Why it matters" before the mechanism. Each h2 description names a payoff. "About 3 against about 80" lands in the h1, an h2 description, the chart callout and the closing list. The interface details and the worked example sit in ExpandableSections. It ends on "Plan for". The read-disturb range paragraph could be demoted. |
| Writing | 8 | no-ai-tells gate clean. Attribution stays only where it carries weight: the fact sheet against the spec (a conflict), Google's position, OXMIQ "reported by trade press" (the source grade), FlashAccel against HBF Sucks? (a conflict). Some sentences carry three or four figures. |
| Economy | 8 | About 2,600 visible words, four diagrams and six h2s for a new section. The author cut the neighbour table, the HBM3E bar and the superseded February 2025 pitch. |
| Diagrams | 8 | Four inline SVGs, each with role="img", aria-labelledby and a title, and no collisions at 1440. At 390 the 640 px scroll wrapper keeps labels near 8 px. Two label fixes are listed below. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | 16-high stack holds 512 GiB, reads at up to about 3 TB/s | ocpSpec | CONFIRMED | Table 3 "Total Cube Size 512 GiB"; Table 2 "Total Effective BW per Cube 3072 GB/s" (p. 16) | - |
| 2 | Spec authors: HBM's read bandwidth with 8 to 16x the capacity (vendor-claim) | ocpSpec | CONFIRMED | s3: "offers 8x to 16x of the capacity of HBM, while delivering the same read bandwidth" (p. 13) | - |
| 3 | Sandisk: "up to 8-16x ... at a similar cost"; 512 GB = 8x 64 GB, 16x 32 GB | sandiskSkHynixMou | CONFIRMED | "delivering up to 8-16x the capacity of HBM at a similar cost" | - |
| 4 | DeepSeek-V3 FP8 671 GB, at least three Rubin GPUs at 288 GB | deepseekV3Report, hgxPage | CONFIRMED | "671B total parameters with 37B activated for each token"; HGX "288 GB HBM4 \| 22 TB/s"; 671 / 288 = 2.33 | - |
| 5 | Gen 1 stack about 3 sweeps a second, shipping HBM4 about 80 (h1) | sandiskFactSheet, micronHbm4 | CONFIRMED | 1.6 / 0.512 = 3.125; 2.8 / 36 = 77.8, 3.3 / 36 = 91.7 | Note names the input as Sandisk's vendor claim (the h1 sentence did not) |
| 6 | Roadmap: spec plus one taped-out die, no product on sale as of Oct 2026, samples targeted 2027 | sandiskInvestorDay2026 | CONFIRMED | "we actually taped out our first HBF memory die"; "deliver our first samples to our customers of inference devices with HBF next year" (2026-08-13) | - |
| 7 | 16 NAND dies, TSVs, base die, 16 UCIe channels carrying AXI | ocpSpec | CONFIRMED | s4.3 "The Core die contains 16 NAND dies"; s4 "up to 16 host channels"; s4 "each host channel may have one or more AXI channels" | - |
| 8 | Adopting HBF takes new accelerator silicon (derived) | ocpSpec | CONFIRMED | follows from s5.1 (UCIe-A x64 per host channel) | - |
| 9 | Base-die duties: ECC, scheduling, bad-block and TSV repair, page-read counter, optional SRAM | ocpSpec | CONFIRMED | s4.4 "Provides ECC encoding and decoding", "Manages TSV redundancy mapping", "Manages Page Read Counter per block"; s4.1 "Internal management of NAND bad blocks", "optional scratchpad memory" | - |
| 10 | No GC; consecutive 4 KiB writes; wear levelling base die or host; 64 B reads, 4 KiB writes; separate non-coherent memories | ocpSpec | CONFIRMED | s11.4 "HBF does not support any GC"; s5.4.1 "The host shall write the 4KiB local address consecutively within the NAND block"; s4.1 "64B to 4KiB ... for read access"; s3 "non-coherent"; s11.1.2 "memory management shall be performed separately" | - |
| 11 | UCIe-A x64 + 1-bit sideband, 45 µm, under 2 mm; grades 0.384/1.536/3.072 (8 ch at 8 GT/s, 16 at 16, 16 at 32); footprint 10.975 x 16 mm x 775 µm, preliminary | ocpSpec | CONFIRMED | s4.5 "64-bit bus width on the main band and a 1-bit bus width on the sideband"; s10.1 "45um pitch in the UCIe region"; s5.1.1 "less than 2mm"; Table 4; s5.1.2.1 "Maximum number of UCIe Modules = 8"; s4.1 "Approximate footprint is 10.975mm x 16mm x 775um"; s10.3 "TBD will be completed in v1.0" | - |
| 12 | Diagram: 32 GT/s x 64 b = 256 GB/s; x16 = 4.096 raw; x75% = 3.072 | ocpSpec | CONFIRMED | Table 2 (p. 16) | - |
| 13 | Gen 1: 1.6 TB/s over 512 GB = 3.1 | sandiskFactSheet | CONFIRMED | "read bandwidth of 1.6 TB/s ... reaching 512GB total capacity per 16 die stack"; footnote 2 "1GB = 1,000,000,000 bytes" | - |
| 14 | Shipping HBM4 2.8 to 3.3 TB/s over 36 GB = 78 to 92 | samsungHbm4, micronHbm4 | CONFIRMED | Micron "greater than 2.8 TB/s", "HBM4 36GB 12H"; Samsung (Wayback) "to a maximum of 3.3 terabytes-per-second", "capacities ranging from 24 gigabytes (GB) to 36GB" | - |
| 15 | Per stack, half to all of HBM4's bandwidth, 14x the data | as 13, 14 | CONFIRMED | 1.6 / 3.3 = 0.48 (Gen 1) to 3.072 / 2.8 = 1.10 (grade 3); 512 / 36 = 14.2 | - |
| 16 | Chart: grades 1.4/2.8/5.6; JEDEC bin 57; HBM4E 85; Vera 0.8 | ocpSpec, jedecHbm4, skhynixHbm4e, graceCpuPage | CONFIRMED | 0.384 / 274.9 GB = 1.40, 1.536 / 549.8 = 2.79, 3.072 / 549.8 = 5.59; JEDEC (Wayback) "up to 8 Gb/s across a 2048-bit interface", 2.048 / 36 = 56.9; HBM4E "16Gbps per pin", "48GB capacity in a 12-layer stack", 4.096 / 48 = 85.3; Vera "up to 1.2 TB/s ... up to 1.5 TB of capacity per CPU" = 0.8 | - |
| 17 | Dense 405B FP8 on 8 Gen 1 stacks: 31.6 ms, about 32 tokens/s | sandiskFactSheet | CONFIRMED | 405 / 12.8 = 31.64 ms; 1 / 0.03164 = 31.6 | - |
| 18 | DeepSeek-V3 37B of 671B; 2.9 ms vs 1.7 ms on Rubin's 22 TB/s | deepseekV3Report, hgxPage | CONFIRMED | 37 / 12.8 = 2.89; 37 / 22 = 1.68 | Note names the HGX page's per-GPU figure (ORCH Rubin ruling) |
| 19 | OXMIQ (Hot Chips 2026 via trade press): HBF cheaper at low batch with 85% "dead capacity", HBM cheaper per token at higher concurrency | tomsOxmiq, sthOxmiq | CONFIRMED | STH: "HBF wins on cost at low batch, but with 85 percent 'dead capacity.'"; Tom's: "the HBM-based rack ... ultimately deliver lower cost per token, according to OXMIQ's model" | - |
| 20 | No HBF read latency published; Sandisk says only that it is higher | sandiskFactSheet | CONFIRMED | footnote 1: "with the higher latency and larger page size of HBF compared to HBM" | - |
| 21 | Studies assume 1 to 20 µs; HBM 10 to 100 ns in Google's ballpark table | flint, hbfSim, maPatterson | CONFIRMED | FLINT "tR of 1–2 µs in modern SLC NAND"; HBFSim "an HBF page read is estimated at ∼20 µs"; Ma and Patterson Table 3 HBM4 "10-100", caption "A ballpark comparison" | - |
| 22 | Little's law: 6.4 MB at 4 µs, 32 MB at 20 µs | sandiskFactSheet | CONFIRMED | 1.6 TB/s x 4 µs = 6.4 MB; x 20 µs = 32 MB | - |
| 23 | Full bandwidth needs (4 KiB x N) x all channels; 1 MiB at 16 banks | ocpSpec | CONFIRMED | s11.1.1 "transfer "(4KiB * N) * all UCIe channels in HBF" at once"; Table 3 "Banks per channel 16"; 4 KiB x 16 x 16 = 1 MiB | - |
| 24 | Weights are the first usage example: written interleaved, read every token | ocpSpec | CONFIRMED | s13.3.1 "various parameters need to be loaded at every token generation"; "the parameter is written parallel using channel interleaving" | - |
| 25 | DeepSeek-V3 reads 5.5% per token | deepseekV3Report | CONFIRMED | 37 / 671 = 0.0551 | - |
| 26 | Qwen3-235B-A22B: 8 to 32 resident experts, TPOT 10.20 to 9.13 ms; at 4 req/s; assumes no HBM-path bandwidth loss | potentialApps | CONFIRMED | "reduces average TPOT from 10.20 ms to 9.13 ms"; "fixed request rate of 4 req/s"; "HBF accesses do not reduce the effective bandwidth of the HBM-resident execution path" | - |
| 27 | Static compiler-driven prefetcher wasted 86% to 96% | flint | CONFIRMED | "The MoE models waste 86 % to 96 % of the traffic at every batch size"; H3 "relies on ... compiler-emitted layer-ahead prefetch hints" | - |
| 28 | Resident models switch with no load from storage | ocpSpec | CONFIRMED | s13.2.1 "the model load has already been completed and is accessed immediately by changing the model without any delay" | - |
| 29 | 27 models of 1B to 40B: mean TTFT 196.1 to 6.8 ms at 4x | potentialApps | CONFIRMED | "27 heterogeneous models (1B–40B parameters)"; "Mean TTFT decreases from 196.1 ms at 1× capacity to 6.8 ms at 4× capacity" | - |
| 30 | Google puts slow-changing context (code, paper corpus) on HBF | maPatterson | CONFIRMED | "it works for a slow-changing context"; "A code database"; "A paper corpus" | - |
| 31 | "infeasible for KV Cache data updated for every query or generation token" | maPatterson | CONFIRMED | verbatim | - |
| 32 | HBF Sucks?: writes outnumber reads on four traces, latency 2 to 5.5x, TLC tier 0.56x SSD life, verdict quote | hbfSucks | CONFIRMED | "Average end-to-end latency rises 2–5.5×"; "Writes outnumber reads on every trace"; "lasts a constant 0.56× the SSD pool's life across all four traces"; "The device is fine; the drop-in deployment is not." (v4) | - |
| 33 | FlashAccel: SLC about 100,000 P/E, 1 TB absorbs about 55 TB/day; MLA 70 KB vs GQA 502 KB (Table II) | flashAccel | CONFIRMED | "SLC Flash typically provides about 100K P/E cycles"; "a 1TB HBF device can sustain about 55TB of data writes per day"; Table II "MLA / DP @ 70KB/token", "GQA / TP @ 502KB/token" | - |
| 34 | SPLASH: 3.5 to 11.4x decode throughput per GPU at 100 ms per token | splash | CONFIRMED | "improves decode throughput per GPU by 3.5×–11.4× over the evaluated baselines under a 100 ms per-token latency objective" | - |
| 35 | Spec "recommends" separate channel groups because mixing "costs" endurance and capacity | ocpSpec | UNSUPPORTED (overstated) | s13.3.3 "If KV Cache and model weight ... are mixed in one zone, it may be disadvantageous to overall endurance and capacity utilization. Therefore, it is possible to choose how to partition" | "suggests"; "mixing them in one zone may cost" |
| 36 | Spec: 24 h at 85 C powered, refresh 24 to 48 h, "guarantees no retention without power", SSDs recommended | ocpSpec | UNSUPPORTED (one clause) | s9 "Power On data retention is guaranteed for 24 hours at 85 oC"; "In Power Off, HBF may not retain data after the specific duration"; "SSDs are recommended"; s11.5 "typically every 24–48 hours" | "does not guarantee retention without power" |
| 37 | Fact sheet: non-volatile, no refresh power needed | sandiskFactSheet | CONFIRMED | "Non-volatile, no refresh power needed" | - |
| 38 | Retention refresh rewrites everything 0.5 to 1 times a day | ocpSpec | CONFIRMED | 24 / 48 and 24 / 24 | - |
| 39 | Base die counts page reads; host rewrites after a product-specific count | ocpSpec | CONFIRMED | s11.5 "It is the host's responsibility to refresh the NAND block's data after reading NAND block data X (product-specific) times" | - |
| 40 | FLINT (SLC, 10^6 reads): 29 days at 10^5 P/E, 8 years at projected 10^7; burst refresh stalls 26 s to 22 min | flint | CONFIRMED | "SLC read-disturb threshold of Ndisturb = 10^6 page reads"; "29 days of continuous decode at 10^5 P/E cycles"; "8.0 years at a projected 10^7"; "stalls the HBF channel for 26 s to 22 min" | - |
| 41 | Range: 3,200 reads/s per block, 31 s, 36 days, 99 years; note 312 s, 16.4 / 1.6 GB/s | sandiskFactSheet, flint | MISLABELLED (flint cite kind spec for simulator inputs) | arithmetic confirmed: 3.125 x 1,024 = 3,200; 10^5 / 3,200 = 31.25 s; x 10^5 = 36.2 days; 10^6 / 3,200 = 312.5 s; x 10^7 = 99.0 years; 512 GB / 31.25 s = 16.4 GB/s; FLINT "1024 pages per block", "10^5 –10^6 reads" | flint cite kind simulated, note "Simulator inputs" |
| 42 | Sandisk designed to HBM4's footprint, power profile, height | sandiskFactSheet | CONFIRMED | "closely matching the physical footprint, power profile, and stack height of HBM4" | - |
| 43 | One Gen 1 stack for one 36 GB HBM4 stack: +476 GB, -1.2 to 1.7 TB/s | sandiskFactSheet, micronHbm4, samsungHbm4 | CONFIRMED | 512 - 36 = 476; 2.8 - 1.6 = 1.2; 3.3 - 1.6 = 1.7 | - |
| 44 | Sandisk layouts 192 / 4,096 / 3,120 GB; diagram 8 x 24 GB, 2 x 24 GB | sandiskInvestorDay2025 | MISLABELLED (Tier 1 for a vendor slide deck) | slides "HBM vs. HBF": "192GB Total Memory", "4,096GB Total Memory", "3,120GB Total Memory". The deck gives totals only, so 24 GB per stack is 192 / 8 | Tier 2; cite note states the 24 GB division |
| 45 | Spec layout 2 HBF + 4 HBM, 1,168 GiB, separate memories | ocpSpec | CONFIRMED | s11.1.2 "two 512GiB HBF units and four 36 GiB HBM units are used together"; 1,024 + 144 = 1,168 | - |
| 46 | Eight Gen 1 stacks 12.8 vs Rubin 22 TB/s; about 40% traded for 14x | hgxPage, sandiskFactSheet | CONFIRMED | 12.8 / 22 = 0.58; 4,096 / 288 = 14.2 | Note names the HGX per-GPU figures |
| 47 | One Gen 1 stack 1.33x Vera's 1.2 TB/s | graceCpuPage | CONFIRMED | "up to 1.2 TB/s of memory bandwidth" | - |
| 48 | 25x a CXL 2.0 x16 link (64 GB/s per direction) | cxl3Spec | CONFIRMED | "CXL 3.0 specification doubles the data rate to 64GTs with no added latency over CXL 2.0"; 32 x 16 / 8 = 64; 1,600 / 64 = 25 | - |
| 49 | Worked example: 1,099.5 GB, "428 GB to spare", 9.21 GB per sequence, 154.6 GB, 16 vs 20 sequences, 11.6 ms (6.0 at grade 3) | ocpSpec, deepseekV3Config, hgxPage, sandiskFactSheet | WRONG (one digit) | 1,099.51 - 671 = 428.5, which rounds to 429. The rest are confirmed: config "kv_lora_rank": 512, "qk_rope_head_dim": 64, "num_hidden_layers": 61, so 576 x 61 x 2 = 70,272 B; x 131,072 = 9.21 GB; 154.6 / 9.21 = 16.8; 193 / 9.21 = 20.96; 37 / 3.2 = 11.56; 37 / 6.144 = 6.02 | "429 GB"; note shows 428.5 |
| 50 | Spec v0.7.0 published 3 Aug 2026 by Sandisk and SK hynix; Google and Tenstorrent joined; Meta later | ocpSpec, sandiskOcpRelease, sandiskInvestorDay2026 | CONFIRMED | cover "VERSION 0.7.0 DATE: August 3, 2026"; release "Google and Tenstorrent joined as consortium members during this standardization process"; transcript (2026-08-13) "Already, we have Meta joining this consortium" | - |
| 51 | "Sandisk taped out its first HBF memory die in August 2026"; samples 2027, "early 2027" | sandiskInvestorDay2026, sandiskSkHynixMou | UNSUPPORTED (month) | transcript: "I am happy to share with you today that we actually taped out our first HBF memory die" (no tape-out month); MoU: "expects samples of the first AI-inference devices with HBF to be available in early 2027" | "announced in August 2026 that it had taped out" |
| 52 | Undated roadmap: Gen 2 above 2 TB/s, up to 1 TB; Gen 3 3.2 TB/s, up to 1.5 TB | sandiskFactSheet | CONFIRMED | "preliminary read bandwidths exceeding 2 TB/s and 3.2 TB/s, respectively, while stack capacities are set to reach up to 1 TB and 1.5 TB" | - |
| 53 | SK hynix product AIN B; OCP 2026: structural model and internal simulations | skhynixOcp2025, skhynixOcp2026 | CONFIRMED | "AIN B (Bandwidth) is SK hynix's solution leveraging HBF technology"; "A model showing the structure of HBF"; "performance graphs based on internal simulations" | - |
| 54 | Samsung and Kioxia concepts located only in trade press | digitimesSamsung, blocksFilesKioxia | CONFIRMED (scope) | DIGITIMES lead: "Samsung Electronics is signaling a push into high bandwidth flash (HBF)"; Blocks & Files: "The GPU is next to the HBM ... and then next to HBF" | - |
| 55 | Absence findings (no accelerator product, no vendor production year, no silicon measurement, no vLLM/SGLang/TensorRT-LLM support) | register | hedge only | Scoped "This research, in October 2026, located no ...", matching the register's UNKNOWN scope; the searches were not repeated | - |
| 56 | Brokerage estimates of 2028 production, via trade press (roadmap) | trendforceTapeout | CONFIRMED | "According to notes from Mizuho Securities and Goldman Sachs ... mass production expected to begin in 2028" | - |
| 57 | Device reports rated and average P/E; value product-specific | ocpSpec | CONFIRMED | Table 33 NOTE 2: "Offset 0x144 (MAXPEC) ... Offset 0x148 (AVGPEC) ... These values are product specific." | - |
| 58 | Stack diagram: "Silicon interposer or bridge: 45 µm bumps in the UCIe region, as with HBM" | ocpSpec | UNSUPPORTED (reads as an HBM bump pitch) | s10.1 "The HBF uses a 45um pitch in the UCIe region"; the spec gives no HBM bump pitch | "Interposer or bridge, as with HBM; HBF uses 45 µm bumps in its UCIe region" |
| 59 | Sweeps chart title: "HBF sits about 25 to 30 times below HBM4" | as 13, 14, 16 | UNSUPPORTED (scope) | 25 to 30 holds for Sandisk Gen 1 only (78 / 3.1 = 25, 92 / 3.1 = 29); the grades in the same sentence span 14x to 66x | "Sandisk's stack sits about 25 to 30 times below HBM4" |
| 60 | "a write bandwidth that neither the specification nor Sandisk nor SK hynix publishes" | ocpSpec | WRONG (as worded) | s5.1.2.1 to s5.1.2.3 give "System Read/Write Throughput Per UCIe Module = 48 / 94 / 188 GB/s" (interface); no NAND program rate in the spec | "a sustained NAND write rate that neither ..." |
| 61 | Record title date "SK hynix Presents ... at OCP 2025 (2025-10-27)" | skhynixOcp2025 | WRONG (record) | page dateline "October 26, 2025" | "(2025-10-26)" |
| 62 | h1: "2.8 to 3.3 TB/s over a 36 GB 12-high stack" cited to Micron alone | micronHbm4 | WRONG (attribution) | Micron (WebFetch 2026-10-23): "enabling a bandwidth greater than 2.8 TB/s", "HBM4 36GB 12H"; 3.3 TB/s is Samsung's "maximum of 3.3 terabytes-per-second" (Wayback). Flagged by the coordinator from the *Memory Hierarchy Primer* verification | Micron note limited to "greater than 2.8 TB/s"; Samsung cite added for 3.3 |

## ORCH-NOTES items

0. **Coordinator item (Micron credited with 3.3 TB/s): CONFIRMED as a misattribution and fixed.**
   - The h1 cite note put "2.8 to 3.3 TB/s" on the Micron record alone. Micron's release says
     "greater than 2.8 TB/s", and the 3.3 TB/s is Samsung's.
   - The note now matches the *Memory Hierarchy Primer* record and wording ("Micron: greater than
     2.8 TB/s ..."), and a Samsung cite carries the 3.3 TB/s (row 62).
   - The other HBM4 cites in the section already pair the two vendors (sweeps paragraph, chart
     caption, site-trade paragraph).


1. **HBF is a roadmap product; kinds; match with the tower and the grid: CONFIRMED, two fixes.**
   - The spec figures (512 GiB per 16-high stack, 0.384 to 3.072 TB/s grades) carry kind `spec` on a
     Tier 1 OCP record. That is the right kind for a published specification. In the block that
     cites them, the roadmap status is stated in prose ("HBF is a roadmap technology", with a
     `roadmap` cite), as the tower (dashed, "roadmap") and the grid ("Roadmap" pill) do.
   - Sandisk Gen 1 1.6 TB/s is `vendor-claim` where it is cited directly (chart caption, latency,
     footprint) and attributed to Sandisk in the sentence elsewhere. The one gap was the h1
     derived note, which now names the input as a vendor claim.
   - Samples are targeted for 2027 (`roadmap`), and the 1 to 20 µs study inputs are `simulated`.
   - Tower (`MemoryHierarchyTower.tsx`: "512 GiB per 16-high stack", "0.384-3.072 TB/s, spec
     grades", "not published, studies assume 1-20 µs") and grid (`MemoryTechGrid.tsx`: the same
     plus "Sandisk Gen 1: 1.6 TB/s", "samples targeted for 2027") match the section figure for
     figure.
   - One shared wording issue is reported below: their roadmap notes say "taped out in August 2026".
2. **Sweeps per second: CONFIRMED, every derived figure recomputed (rows 5, 13 to 17).**
   - HBF: 1.40, 2.79, 3.125, 5.59, with GiB converted to GB consistently.
   - HBM: JEDEC 56.9, shipping 77.8 to 91.7, HBM4E 85.3. Vera: 0.8.
   - The HBM inputs match *HBM and the Bandwidth Wall*: Samsung up to 3.3 TB/s, Micron over
     2.8 TB/s, 36 GB 12-high, JEDEC 8 Gb/s x 2,048 bits, HBM4E 16 Gb/s and 48 GB.
   - Rubin is the HGX page's "288 GB HBM4 | 22 TB/s" (re-fetched today) everywhere in the section
     (2.9 vs 1.7 ms, 12.8 vs 22, the package footer). Two cite notes now name the HGX per-GPU figure,
     per the Rubin ruling.
3. **Tiers: CONFIRMED after one fix.**
   - All seven arXiv papers are Tier 3, and every result taken from one is `simulated` (the flint
     simulator-input cite was `spec` and is now `simulated`).
   - The OCP spec is Tier 1, and the JEDEC HBM4 release is Tier 1 under the standards-body ruling.
   - Sandisk and SK hynix releases are Tier 2.
   - The Sandisk 2025 Investor Day deck was Tier 1 (graded by the register as "official investor
     materials"). It is a vendor presentation rather than a filing, so it is now Tier 2, consistent
     with the 2026 Investor Day transcript (Tier 2). No other file cites that URL.
   - The DeepSeek-V3 report stays Tier 2 (vendor technical report), the same as in six other files.
4. **Partnership, OCP workstream and dates: CONFIRMED except the tape-out month (row 51, fixed).**
   - MoU 2025-08-06 and its "early 2027" device samples; spec v0.7.0 dated 3 August 2026; Google and
     Tenstorrent as consortium members; Meta announced 2026-08-13 (after the spec, so "later" holds).
   - The OCP release says the consortium "began work in February". The section does not state the
     workstream start, so there was nothing to check there.
   - The SK hynix OCP 2025 record date is corrected (row 61).
5. **Endurance and the write path: CONFIRMED, two hedges fixed (rows 35, 36, 60).**
   - P/E: MAXPEC and AVGPEC are product-specific in the spec, FlashAccel assumes about 100K for
     SLC, and FLINT sweeps 10^5 to a projected 10^7. The page states each as an assumption and the
     real rating as unpublished.
   - The read-mostly case for weights holds against all three sources: spec s13.3.1, Ma and
     Patterson ("HBF must hold infrequently-updated data, such as weights at inference time"), and
     spec s11.5 (read-disturb refresh). The section's point that frozen weights still spend
     endurance is the spec's own refresh rule.

## Fixes applied

- `src/sections/HighBandwidthFlash.tsx:49` note. Before: "1.6 TB/s / 512 GB = 3.1 per second." After: "Sandisk's vendor claim for its first-generation stack: 1.6 TB/s / 512 GB = 3.1 per second."
- `:50-51` (row 62). Before: one `micronHbm4` cite, note "2.8 to 3.3 TB/s over a 36 GB 12-high stack = 78 to 92 per second." After: `micronHbm4` note "Micron: greater than 2.8 TB/s from a 36 GB 12-high stack = more than 78 per second.", plus a new `samsungHbm4` cite, note "Samsung: up to 3.3 TB/s per stack, over 36 GB = 92 per second." The Micron wording matches the *Memory Hierarchy Primer* cite on the same record.
- `:159` note. Appended "22 TB/s is the HGX page's individual Rubin GPU figure."
- `:259`. Before: "the specification recommends separate channel groups for weights and KV because mixing them costs endurance and capacity." After: "the specification suggests separate channel groups for weights and KV because mixing them in one zone may cost endurance and capacity."
- `:282`. Before: "guarantees no retention without power". After: "does not guarantee retention without power".
- `:288`. Before: "a write bandwidth that neither the specification nor Sandisk nor SK hynix publishes". After: "a sustained NAND write rate that neither the specification nor Sandisk nor SK hynix publishes".
- `:310`. Before: `<Cite s={S.flint} note="Assumed block geometry, threshold range and P/E sweep." />`. After: `kind="simulated" note="Simulator inputs: block geometry, threshold range and P/E sweep."`
- `:343` cite note added: "The slides give totals only; 24 GB per HBM stack is our division, 192 GB / 8."
- `:353` note. Appended "22 TB/s and 288 GB are the HGX page's individual Rubin GPU figures."
- `:366`. Before: "with 428 GB to spare", note "2 x 512 GiB = 1,099.5 GB." After: "with 429 GB to spare", note "...; 1,099.5 - 671 = 428.5 GB."
- `:398`. Before: "Sandisk taped out its first HBF memory die in August 2026 and targets ...". After: "Sandisk announced in August 2026 that it had taped out its first HBF memory die, and targets ...".
- `src/sources/HighBandwidthFlash.ts:28` sandiskInvestorDay2025: tier 1 changed to 2. Header comment and group comment updated to match (the old comment said papers were Tier 1).
- `src/sources/HighBandwidthFlash.ts:64` skhynixOcp2025 title date: 2025-10-27 changed to 2025-10-26.
- `src/components/HbfStackDiagram.tsx:129`. Before: "Silicon interposer or bridge: 45 µm bumps in the UCIe region, as with HBM". After: "Interposer or bridge, as with HBM; HBF uses 45 µm bumps in its UCIe region".
- `src/components/HbfSweepsChart.tsx:69` title. Before: "HBF sits about 25 to 30 times below HBM4". After: "Sandisk's stack sits about 25 to 30 times below HBM4".
- All four Hbf components: `minWidth: 600` changed to `640`, the dive's phone convention (authoring brief s5; 29 other components use 640), with the comments updated.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "HighBandwidthFlash|HbfStackDiagram|HbfSweepsChart|HbfPlacementMap|HbfPackageDiagram|sources/HighBandwidthFlash"`: "no type errors in my files".
- `pnpm exec eslint` on the section, its sources file and the four components, with `--max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t HighBandwidthFlash`: exit 0, 1 passed, 34 skipped.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: exit 1. 838 of 839 passed, including the same-URL-same-tier checks. The one failure is the `sources.md` sync snapshot, which the orchestrator owns and which was already failing for the author.
- Gates, from the worktree root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0. None of them reported a hit in my files.
- `pnpm exec vite build --outDir /tmp/vf-HighBandwidthFlash-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections hbf --widths 1440,390 ...`: exit 0, "hbf @1440: 4 SVG diagram(s), 0 React Flow, ok", "hbf @390: 4 SVG diagram(s), 0 React Flow, ok". I read all ten PNGs, after the label and minWidth changes. At 1440 nothing collides and the new interposer label fits its bar. At 390 each diagram scrolls inside a 640 px wrapper with labels near 8 px, and the page does not overflow.

- After the row 62 edit, which touched no diagram, I re-ran tsc (no errors in my files), eslint on the section (exit 0), the section vitest (exit 0) and no-ai-tells (exit 0, no hits in my files).

## For the orchestrator

- **Tape-out month in shared notes.** `src/sections/MemoryHierarchyPrimer.tsx` (around line 247) and
  `src/sections/MainMemoryAndCxl.tsx` (around line 192) have the cite note "first HBF memory die
  taped out in August 2026". The source says Sandisk announced the tape-out on 2026-08-13; it gives
  no tape-out month. Suggested: "Sandisk announced in August 2026 that its first HBF memory die had
  taped out; ...".
- **Regenerate `sources.md`.** It needs to pick up the sandiskInvestorDay2025 tier change (1 to 2)
  and the skhynixOcp2025 title date.
- **Version pinning, optional.** The flint record (shared with *Memory Hierarchy Primer* and *DDR5,
  MRDIMM, LPDDR5X and CXL*) names v1 in its title, and hbfSucks (v4), flashAccel (v2) and
  potentialApps (v2) name versions, but all four use unversioned abs URLs. Today every unversioned
  URL serves the titled version, so the figures match. Pinning them as Mooncake was pinned would
  stop future drift. For flint it needs the same change in all three files.
- **Glossary.** The author's acronym list stands. LPDDR5X first appears in the sweeps chart label,
  before the caption that expands it, and DRAM appears in the package legend; both are in the
  dive glossary.

## Backlog

- "Reading wears flash too": demote the "How wide the range is" paragraph into an
  ExpandableSection, keeping its endpoints (36 days, 99 years) in the vendor ask. That would leave
  the h2 as two paragraphs.
- The worked example packs eight derived figures into four sentences. A small two-column table
  (spec layout against three Rubin GPUs) would read faster.
- If the spec's interface read/write throughput (188 GB/s per module at grade 3) matters for reload
  planning, it could join the "ask a vendor" paragraph as the interface ceiling the NAND write rate
  sits under.
