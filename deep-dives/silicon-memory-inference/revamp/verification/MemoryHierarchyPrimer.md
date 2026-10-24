# Verification: Memory Hierarchy Primer

Verified: 2026-10-23. Claims checked: 58 (sampled: 0, every claim checked against a fresh fetch).
Confirmed 47, wrong 0, unsupported 10, mislabelled 1, unverifiable 0.

Sources fetched: NVIDIA H100, H200, HGX, Vera Rubin NVL72, GB200 NVL72 and Blackwell architecture
pages; the Blackwell Ultra blog; the Hopper and Blackwell tuning guides; PTX ISA 9.4 (full HTML);
the GDS overview; Intel Xeon 6 product brief, ARK 6980P and the ORM 050 change document; AMD EPYC
9005 datasheet (Wayback 2026-07-11 copy, because the live PDF timed out twice); EC2 ac.html; the
FSx for Lustre performance page; the Graviton README at 8b322a4; the R8g and M9g blogs; the Neuron
Trainium2, Trainium3 and NeuronCore-v3 pages and the NKI Trn2 and Trn3 guides; the CXL 3.0
release; the Samsung CMM-D white paper; Chips and Cheese on Xeon 6; Luo et al. (PDF; arXiv lists
v1 only); Pond, Ma and Patterson (v1 and v3), FLINT and HBFSim (PDFs); the OCP HBF spec v0.7.0;
the Sandisk HBF fact sheet; the Sandisk Investor Day transcript; Micron's HBM4 release. No request
carried personal data (curl default User-Agent, WebFetch).

## Gate 3 score: 8/10

No figure in the section was wrong. Ten claims rested on a source that did not state them, and
one derived number was labelled as a spec. All are fixed, and the 75x step, the tower's ten rows
and the direction labels now trace to the page that states each input. The section gives a usable
model (uneven steps, scratchpad against cache, bytes placed by read frequency) and ends on a
placement rule. The one soft spot is economy: the map caption carries about 110 words of
provenance in small text.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 47 of 58 confirmed as written, 0 wrong. Nothing load-bearing was wrong. The 75x arithmetic held, but its 64 GB/s input was cited to a Xeon 6 brief that prints 32 GT/s only for CXL, on a host that is Sapphire Rapids. Re-cited. |
| Mental model or practical value | 8 | Models: "Lower tiers mostly hold more and deliver less, in uneven steps", the cache-miss vs scratchpad-miss columns. Actions: divide socket bandwidth by busy cores; the placement rule. Every block passes one test. |
| Shape | 8 | "What the hierarchy is" comes before the mechanism. Each h2 description states a payoff. 75x lands twice (intro, bandwidth wall). The per-family table sits in an ExpandableSection. The section ends on the placement rule and the vLLM pointer. The opening paragraph carries 9 citations and the HBF caveat, which makes it heavy. |
| Writing | 8 | The no-ai-tells gate is clean. Attribution appears where it grades the source ("Sandisk claims", "in Pond's estimates", "Our reading of these figures"). "CXL adds capacity, not speed" is a contrast that carries content. One cross-reference name was truncated (fixed). |
| Economy | 7 | The author reports +16% visible (+40% with the table open). The block-by-block reasons hold, but the caption is a provenance dump that the table could absorb. |
| Diagrams | 8 | SVG with role="img", aria-labelledby and a title that states the assertion. At 1440 nothing overlaps or clips (probe "ok", PNG read). At 390 it scrolls at the 640 px minimum, which leaves labels at about 8 px effective. That is legible but small. |

## Claims
| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | H200: 141 GB of HBM at 4.8 TB/s | h200Page | CONFIRMED | H200 SXM: "141GB", "4.8TB/s" | - |
| 2 | p5en host DRAM 256 GiB per GPU (2,048 GiB / 8) | ec2AcceleratedSpecs | CONFIRMED | p5en.48xlarge: "2048.00" GiB, "8 x NVIDIA H200 GPU" | - |
| 3 | PCIe Gen5 x16, 64 GB/s per direction (intro, Host DRAM row) | xeon6Brief (derived) | UNSUPPORTED | Brief: "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane". Its PCIe 5.0 lanes have no rate. ac.html gives p5en's processor as "Intel Xeon Sapphire Rapids". H200 page: "PCIe Gen5: 128GB/s" | Re-cited to h200Page, note "128 GB/s per H200 across both directions = 64 GB/s per direction (line rate)", as in *Flash as a Cache Tier for Inference* |
| 4 | 75x less bandwidth for under 2x capacity | h200Page (derived) | CONFIRMED | 4,800 / 64 = 75.0. 256 GiB = 274.9 GB, and 274.9 / 141 = 1.95. It still holds on AWS's "1128 GiB (8 x 141 GiB)": 256 / 141 = 1.82 | - |
| 5 | HBF: 512 GiB stacks beside HBM on the package | ocpSpec | CONFIRMED | "Total Cube Size 512 GiB"; "The HBF sits very close to the GPU/TPU/xPU"; "HBF can augment HBM" | - |
| 6 | Sandisk claims 1.6 TB/s for its first (vendor-claim) | sandiskFactSheet | CONFIRMED | "The first-generation product delivers blazing-fast read bandwidth of 1.6 TB/s" | - |
| 7 | 25 times that PCIe link | sandiskFactSheet (derived) | CONFIRMED | 1,600 / 64 = 25 | - |
| 8 | No HBF product ships as of October 2026; note "taped out in August 2026; samples ... 2027" | sandiskInvestorDay2026 (roadmap) | UNSUPPORTED (note) | "we actually taped out our first HBF memory die"; "to deliver our first samples to our customers of inference devices with HBF next year" (2026-08-13). The transcript gives no tape-out month | Note: "Sandisk, 2026-08-13: its first HBF memory die has taped out; first samples ... next year (2027)" |
| 9 | SMEM ~29, L1 ~41, L2 ~263, HBM ~479 cycles, H800, measured | luoHopperBench (T3, measured) | CONFIRMED | Table IV, H800: "L1 Cache 40.7", "Shared 29.0", "L2 Cache 263.0", "Global 478.8". Table III: "H800 PCIe", "HBM2e", "1755 MHz". Same as *Anatomy of a Kernel Execution* and *NVIDIA Hopper: H100 and H200* | - |
| 10 | LLC ~33 ns, local hit, Xeon 6 on r8i | chipsAndCheeseXeon6 (T3, measured) | CONFIRMED | "the L3 cache, which has a latency of just over 33 ns (~130 cycles)"; "AWS's r8i instance uses the Xeon 6 6985P-C" (2025-09-26) | - |
| 11 | Local DRAM 144 ns, CMM-D 254 ns, idle, Samsung platform | samsungCmmD (T2, vendor-claim) | CONFIRMED | Table 2, "Intel MLC (v 3.10) Idle latency (ns)": RDIMM local 144, CMM-D local 254. The host is "Intel Emerald Rapids". Samsung measured its own product, so vendor-claim is right | - |
| 12 | HBF studies assume 1 to 20 µs reads | flint, hbfSim (simulated) | CONFIRMED | FLINT: "page-read latency tR of 1-2 µs in modern SLC NAND"; HBFSim (v3): "an HBF page read is estimated at ∼20 µs" | - |
| 13 | Rubin 22 TB/s (HGX page); NVL72 page 19.2 TB/s | hgxPage, veraRubinNvl72 | CONFIRMED | HGX: "288 GB HBM4 \| 22 TB/s"; NVL72: "288 GB HBM4 \| 19.2 TB/s". Both pages are named. Matches *HBM and the Bandwidth Wall* | - |
| 14 | CXL x16 64 GB/s per direction (caption, tower) | xeon6Brief (derived) | UNSUPPORTED (note) | The note derived it from a PCIe 5.0 lane rate that the brief does not print. The brief gives 32 GT/s for CXL 2.0 (row 3) | Note now reads "CXL 2.0 at up to 32 GT/s per lane x 16 / 8 = 64 GB/s per direction"; record title changed to match |
| 15 | Register file 256 KB per SM | hopperTuningGuide, blackwellTuningGuide (derived) | CONFIRMED | Both: "The register file size is 64K 32-bit registers per SM" | - |
| 16 | SMEM up to 228 KB per SM | hopperTuningGuide | CONFIRMED | "shared memory capacity per SM is 228 KB" | - |
| 17 | TMEM 256 KB per SM on Blackwell | ptxIsa (derived) | UNSUPPORTED (per SM) | PTX 9.7.18.1: "512 columns and 128 rows per CTA, with each cell being 32-bits" gives 256 KiB per CTA, not per SM | Added blackwellUltraBlog: "256 KB of Tensor Memory (TMEM) per SM" |
| 18 | SBUF 28 MiB (Trn2) / 32 MiB (Trn3); PSUM 2 MiB | nkiTrn2Arch, nkiTrn3Arch | CONFIRMED | "NeuronCore-v3 SBUF capacity is 28MiB"; "PSUM capacity remains the same at 2MiB"; "The NeuronCore-v4 SBUF capacity is 32 MiB" | - |
| 19 | L1D 48 KB (Golden Cove) to 64 KB (Graviton) | intelOrm, gravitonReadme | CONFIRMED | ORM Fig. 2-2: "48KB DCU"; README: "64kB inst / 64kB data" (G3, G4, G5) | - |
| 20 | GPU L1 shares 256 KB per SM with SMEM | hopperTuningGuide | CONFIRMED | "the combined L1 cache, texture cache, and shared memory to 256 KB" | - |
| 21 | Trainium L1: none documented; SBUF is software-managed | neuronCoreV3 | UNSUPPORTED (name) | NC-v3: "on-chip SRAM is software-managed", "28MB of on-chip SRAM". The page has no "SBUF", "PSUM" or "cache" | Note ties the 28 MB SRAM to SBUF; added nkiTrn2Arch |
| 22 | L2 2 MB per core (Xeon 6, Graviton4 and 5) | intelOrm, gravitonReadme | UNSUPPORTED (Xeon 6) | ORM, Golden Cove: "Mid-level cache size increased to 2MB on server parts". Redwood Cove: "increased to 2MBs for Client", with no server figure. README: "2MB" (G4, G5) | Added chipsAndCheeseXeon6: "96 Redwood Cove cores ... each have 2 MB of L2 cache" |
| 23 | GPU L2 50 MB (H100), 126 MB (GB200) | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | "to 50 MB in the H100 GPU"; "The NVIDIA GB200 GPU increases the L2 cache capacity to 126 MB" | - |
| 24 | LLC 36 MB (Graviton4) to 504 MB (Xeon 6980P) | gravitonReadme, xeon6980pArk | CONFIRMED | README LLC: "36MB" (G4); ARK: "Cache 504 MB" | - |
| 25 | GPU LLC: "None; L2 is the last level" | hopperTuningGuide | UNSUPPORTED | The guide names no L3 and does not call L2 the last level | "None documented above L2" |
| 26 | HBM 80 GB at 3.35 TB/s (H100) | h100Page | CONFIRMED | H100 SXM: "80GB", "3.35TB/s" | - |
| 27 | 288 GB of HBM4 at 22 TB/s (Rubin) | hgxPage | CONFIRMED | as row 13 | - |
| 28 | Trn2 96 GiB at 2.9 TB/s; Trn3 144 GiB at 4.9 TB/s | trainium2Arch, trainium3Arch | CONFIRMED | "96 GiB of device memory with 2.9 TB/sec of bandwidth"; "144 GiB of device memory, with 4.9 TB/sec of bandwidth" | - |
| 29 | Host DRAM 614-845 GB/s per socket, 12 channels | xeon6980pArk (derived) | CONFIRMED | ARK: "DDR5(6400MT/s)MRDIMM(8800MT/s)", "Max # of Memory Channels 12". 12 x 8 x 6,400 = 614.4 and 12 x 8 x 8,800 = 844.8. Same as *DDR5, MRDIMM, LPDDR5X and CXL* | - |
| 30 | Up to 6 TB per socket | epyc9005Datasheet | CONFIRMED | Per-SKU column "12/6TB" (Wayback copy, 2026-07-11) | - |
| 31 | NVLink-C2C 900 GB/s bidirectional (GB200) | blackwellArchitecture | CONFIRMED | "900 gigabytes per second (GB/s) of bidirectional bandwidth" (the Blackwell to Grace link) | - |
| 32 | CXL 2.0 pooling, CXL 3.0 sharing | cxl3Spec | CONFIRMED | "improved memory sharing and pooling", "Enhanced memory pooling", "fine-grained resource sharing across multiple compute domains" (2022-08-02) | - |
| 33 | 13.4 TB of HBM per GB200 NVL72 | gb200Nvl72 | CONFIRMED | "13.4 TB HBM3E \| 576 TB/s" | - |
| 34 | Other GPUs' HBM over NVLink, 900 GB/s each way | blackwellUltraBlog (spec) | MISLABELLED (kind) | "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)". 900 each way is our halving | kind="derived", note "1.8 TB/s bidirectional per GPU / 2" |
| 35 | NeuronLink pooling, up to 64 Trn2 chips | trainium2Arch | CONFIRMED | "memory pooling between Trainium2 chips"; memory pool "Up to 64 chips" | - |
| 36 | Bounce buffer unless GDS reads straight into GPU memory | gdsOverview | CONFIRMED | "enables a direct data path for direct memory access (DMA) transfers between GPU memory and storage, which avoids a bounce buffer through the CPU" (v1.19.1) | - |
| 37 | 8 x 3,800 GB instance store, 30.4 TB (P5, P5en, P6) | ec2AcceleratedSpecs | CONFIRMED | p5.48xlarge, p5en, p6-b200, p6-b300: "8 x 3800 GB NVMe SSD" | - |
| 38 | FSx for Lustre with GDS, 1,200 Gb/s | fsxPerformance | CONFIRMED | "EFA-enabled \| EFA with GDS \| 1200 Gbps" | - |
| 39 | trn2.48xlarge 4 x 1,900 GB | ec2AcceleratedSpecs | CONFIRMED | "4 x 1900 GB NVMe SSD" | - |
| 40 | SBUF about 126 times a Hopper SM's 228 KB of SMEM | nkiTrn2Arch (derived) | CONFIRMED | 28 x 1,024 / 228 = 125.8 | - |
| 41 | "with no cache in front of it" | neuronCoreV3 | UNSUPPORTED (hedge scope) | The page says nothing about caches. Silence is not absence | "with no cache documented in front of it" |
| 42 | TMEM holds the tiles tcgen05 instructions work on | ptxIsa | CONFIRMED | "the matrix multiply and accumulate operation is performed on the Tensor Memory of the executing thread's CTA" | - |
| 43 | 3.35 TB/s (H100) to 22 TB/s (Rubin) of HBM per GPU | h100Page, hgxPage | CONFIRMED | rows 13, 26 | - |
| 44 | Bandwidth wall: 75x, H200 on p5en reaches host DRAM at 64 GB/s per direction | h200Page (derived) | CONFIRMED | rows 3, 4 | - |
| 45 | Graviton5: 12 ch DDR5-8800 = 844.8 GB/s, +57%, 4.4 GB/s per core over 192, -21% | m9gGa (derived) | UNSUPPORTED (12 channels) | M9g blog: "192 cores", "DDR5-8800 memory", with no channel count. README: "12x DDR5" (G5). Arithmetic: 844.8 / 537.6 = 1.571; 844.8 / 192 = 4.40; 1 - 4.4 / 5.6 = 21.4% | Note names the README; added gravitonReadme cite |
| 46 | Graviton4 5.6 GB/s per core | r8gPreview (derived) | CONFIRMED | "96 Neoverse V2 cores, 2 MB of L2 cache per core, and 12 DDR5-5600 channels". 12 x 5.6 x 8 = 537.6, and 537.6 / 96 = 5.6 | - |
| 47 | Up to 64 CXL 2.0 lanes on Xeon 6 | xeon6Brief | CONFIRMED | "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane" | - |
| 48 | Pond: +70 to 90 ns at 8 to 16 sockets, over 180 ns at rack scale | pond (T3, simulated) | CONFIRMED | "analysis of CXL topologies lead us to estimate that CXL will add 70-90ns ... with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling" (an estimate, so simulated fits) | - |
| 49 | OCP: 512 GiB per 16-high stack, 0.384 to 3.072 TB/s across speed grades | ocpSpec | CONFIRMED | Table 4: grade 1 "0.384" (max stack height 8), grade 2 "1.536" (16), grade 3 "3.072" (16); "Supports 16 NAND die stack"; "Total Cube Size 512 GiB" | - |
| 50 | HBF Gen 1 read end to end about 3 times a second | sandiskFactSheet (derived) | CONFIRMED | "512GB total capacity per 16 die stack" (footnote: 1 GB = 10^9 bytes). 1.6 / 0.512 = 3.125 | - |
| 51 | Shipping HBM4 stack about 80 times a second; note "2.8 to 3.3 TB/s ... 78 to 92" | micronHbm4 (derived) | UNSUPPORTED (3.3 TB/s) | Micron: "a bandwidth greater than 2.8 TB/s", "HBM4 36GB 12H". 3.3 TB/s is Samsung's maximum, not Micron's | Note: "greater than 2.8 TB/s from a 36 GB 12-high stack = more than 78 per second". Prose "about 80" stands |
| 52 | No HBF read latency is published | sandiskFactSheet (vendor-claim) | CONFIRMED (scope) | Footnote 1: "with the higher latency and larger page size of HBF compared to HBM". OCP v0.7.0 gives no read latency. Register row 3.15 checked the spec, Sandisk and SK hynix | - (Backlog: carry that scope) |
| 53 | NVMe: at least 2.25 GB/s per GPU; EBS 1.56 | ec2AcceleratedSpecs (derived) | CONFIRMED | "4,400,000 / 2,200,000" IOPS, "aggregated IOPS performance with 4,096 byte block size at queue depth saturation". EBS "12500.00" MB/s (128 KiB I/O) on p5en and P6. 4.4 M x 4,096 / 8 = 2.25; 12,500 / 8 = 1,562.5 MB/s | - |
| 54 | FSx with GDS 18.75 GB/s per GPU | fsxPerformance (derived) | CONFIRMED | 1,200 / 8 / 8 = 18.75 | - |
| 55 | About 110 ns more per load on CXL | samsungCmmD (derived) | CONFIRMED | 254 - 144 = 110 | - |
| 56 | "infeasible for KV Cache data updated for every query or generation token" | maPatterson | CONFIRMED | "Limited write endurance makes HBF infeasible for KV Cache data updated for every query or generation token." (same in v1 and v3) | - |
| 57 | Tower title: 256 KB to 30.4 TB; up to 22 TB/s down to under 20 GB/s per GPU; tens of cycles to hundreds of ns | inputs above | CONFIRMED | rows 9, 11, 13, 15, 37, 54 | - |
| 58 | Tower "CXL and remote HBM: 64-900 GB/s, per direction, CXL to NVLink" | xeon6Brief, blackwellUltraBlog (derived) | CONFIRMED (after rows 14, 34) | Both ends are per direction: 32 GT/s x 16 / 8 = 64; 1.8 TB/s bidirectional / 2 = 900 | - |

Tier and kind check: every URL carries the same tier as in the other source files. `sources.test.ts`
passes 839 of 839, which includes the tier-consistency and snapshot tests. Vendor figures (Sandisk
1.6 TB/s, Samsung 144 and 254 ns) are marked vendor-claim and attributed in the sentence. HBF
carries roadmap. The only GitHub URL is pinned to a commit.

## ORCH-NOTES items

- **NVLink figures without a direction label: fixed.** This section never shows 1.8 TB/s per GPU
  or 130 TB/s per NVL72. NVLink-C2C 900 GB/s is labelled bidirectional in both places (table and
  bandwidth wall). The Blackwell architecture page says "900 gigabytes per second (GB/s) of
  bidirectional bandwidth". The "900 GB/s each way" cell was cited as a spec to a blog that says
  "1.8 TB/s bidirectional", so it is now `kind="derived"` with the halving in the note.
- **Tower cell "CXL and remote HBM ... 64-900 GB/s per direction": right at both ends.** CXL x16 is
  64 GB/s per direction (CXL 2.0 at 32 GT/s per lane, from the Xeon 6 brief). NVLink is 900 GB/s
  per direction (half of 1.8 TB/s bidirectional). The CXL note used to derive 64 from a PCIe 5.0
  rate the brief does not print. It now derives from the brief's CXL figure.
- **"75x less bandwidth than HBM for under twice the capacity" (H200 on p5en): CONFIRMED.**
  4,800 / 64 = 75.0. Capacity is 274.9 GB / 141 GB = 1.95, or 1.82 on AWS's 141 GiB. The 64 GB/s
  input was re-cited from the Xeon 6 brief (32 GT/s for CXL only; p5en's host is Sapphire Rapids)
  to the H200 page's "PCIe Gen5: 128GB/s". The note is the same as in *Flash as a Cache Tier for
  Inference*.
- **Ten-tier tower against the dedicated sections: consistent.** HBM 80-288 GB and 3.35-22 TB/s
  match *HBM and the Bandwidth Wall*, which uses the same HGX "22 TB/s" and names the NVL72 page's
  19.2. Host DRAM 614-845 GB/s at 12 channels and 6 TB per socket match *DDR5, MRDIMM, LPDDR5X and
  CXL* (614.4, 844.8, 6 TB). NVMe 30.4 TB and 1.56-18.75 GB/s per GPU match *Flash as a Cache Tier
  for Inference*. HBF 512 GiB and 0.384-3.072 TB/s match *High Bandwidth Flash* and the OCP Table 4.
  SMEM 29, L1 41, L2 263 and HBM 479 cycles (H800 PCIe, measured, Tier 3) match *Anatomy of a
  Kernel Execution* and *NVIDIA Hopper: H100 and H200*. Every cell was checked against its source
  (claims 9 to 58).
- **LLC 36-504 MB, r8i 33 ns, Samsung 144 and 254 ns: CONFIRMED.** The Graviton README gives
  "36MB" (G4) and ARK gives "504 MB" (6980P). Chips and Cheese gives "just over 33 ns" on r8i
  (6985P-C), Tier 3, measured. Samsung's Table 2 gives "Idle latency (ns) 144" for local RDIMM and
  254 for local CMM-D under Intel MLC, marked vendor-claim because Samsung measured its own module.
- **Rubin HBM4 across three NVIDIA pages: CONFIRMED.** The section names the HGX page (22) and the
  NVL72 page (19.2).
- **Xeon 6 brief gives 32 GT/s only for CXL: applied here.** See claims 3 and 14.

## Fixes applied

All in `src/sections/MemoryHierarchyPrimer.tsx` unless noted. Line numbers are after the edit.

- :15-19. `hostLinkNote` before: "PCIe 5.0 signals at 32 GT/s per lane: 32 x 16 lanes / 8 bits =
  64 GB/s per direction before encoding." After: "PCIe Gen5: 128 GB/s per H200 across both
  directions = 64 GB/s per direction (line rate)." Added `cxlLinkNote` ("CXL 2.0 at up to 32 GT/s
  per lane x 16 lanes / 8 bits = 64 GB/s per direction, before encoding.") and `nvlinkEachWayNote`
  ("NVLink 5: 1.8 TB/s bidirectional per GPU / 2 = 900 GB/s each way.").
- :241 (intro) and :161 (Host DRAM row): `<Cite s={S.xeon6Brief} kind="derived" note={hostLinkNote} />`
  became `<Cite s={S.h200Page} kind="derived" note={hostLinkNote} />`.
- :291 (caption, CXL x16): `note={hostLinkNote}` became `note={cxlLinkNote}`.
- :180 (remote HBM row): `<Cite s={S.blackwellUltraBlog} />` became `<Cite s={S.blackwellUltraBlog} kind="derived" note={nvlinkEachWayNote} />`.
- :59 (TMEM per SM): added `<Cite s={S.blackwellUltraBlog} />`.
- :89-90 (Trainium L1): the neuronCoreV3 cite gained the note "Each NeuronCore-v3 has 28 MB of
  on-chip SRAM, software-managed; the NKI guide names it SBUF." Added `<Cite s={S.nkiTrn2Arch} />`.
- :100 (L2 row): added `<Cite s={S.chipsAndCheeseXeon6} />` for Xeon 6.
- :124 (GPU LLC): "None; L2 is the last level" became "None documented above L2".
- :253 (HBF roadmap note): "first HBF memory die taped out in August 2026; samples of inference
  devices with HBF targeted for 2027." became "Sandisk, 2026-08-13: its first HBF memory die has
  taped out; first samples of inference devices with HBF to customers next year (2027)."
- :331: "with no cache in front of it" became "with no cache documented in front of it".
- :334: cross-reference `<em>NVIDIA Blackwell</em>` became `<em>NVIDIA Blackwell: B200 and B300</em>`,
  the name in `sectionTitles.ts`.
- :28 (`bwNote5`): "12 channels x 8.8 GT/s" became "12 channels (Graviton README) x 8.8 GT/s".
  :413 added `<Cite s={S.gravitonReadme} />`.
- :457 (micronHbm4 note): "2.8 to 3.3 TB/s over a 36 GB 12-high stack = 78 to 92 per second."
  became "Micron: greater than 2.8 TB/s from a 36 GB 12-high stack = more than 78 per second."
- `src/sources/MemoryHierarchyPrimer.ts:60`: the xeon6Brief title "Intel Xeon 6 Product Brief
  (PCIe 5.0 at 32 GT/s per lane)" became "Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at
  up to 32 GT/s per lane)".

No diagram was changed and no record was added. Visible prose changed by a few words (rough count).

## Checks

- `pnpm exec tsc --noEmit | grep -E "MemoryHierarchyPrimer|MemoryHierarchyTower|sources/MemoryHierarchyPrimer"`: "no type errors in my files".
- `pnpm exec eslint src/sections/MemoryHierarchyPrimer.tsx src/sources/MemoryHierarchyPrimer.ts src/components/MemoryHierarchyTower.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t MemoryHierarchyPrimer`: exit 0, 1 passed, 34 skipped.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 839 passed, 0 failed (`sources.md` snapshot in sync).
- Gates from the repo root: `no-ai-tells` exit=0, `svg-a11y` exit=0, `pinned-refs` exit=0,
  `pre-overflow` exit=0, no hits in my files.
- The diagram did not change, but it was shot to score it. `pnpm exec vite build --outDir /tmp/vf-MemoryHierarchyPrimer-dist --emptyOutDir`: exit 0.
  `node scripts/shoot.mjs --sections memory-hierarchy --widths 1440,390`: "1 SVG diagram(s), 0 React Flow, ok"
  at both widths. PNGs read at both widths.

## For the orchestrator

- **High Bandwidth Flash, Micron HBM4 figure.** `HighBandwidthFlash.tsx:50` (note), `:125` (prose
  "2.8 to 3.3 TB/s over 36 GB, sweeps 78 to 92 times") and `:332` (note) cite micronHbm4 for
  "2.8 to 3.3 TB/s". Micron states only "a bandwidth greater than 2.8 TB/s". 3.3 TB/s is Samsung's
  maximum (samsungHbm4 in *HBM and the Bandwidth Wall*). Either add the Samsung record there or
  state "over 2.8 TB/s, over 78 sweeps".
- **Xeon 6 Product Brief title** in `src/sources/MainMemoryAndCxl.ts:123` and
  `src/sources/CapitalMarketsLens.ts:160` still reads "(PCIe 5.0 at 32 GT/s per lane)". The brief
  prints 32 GT/s only for CXL 2.0 lanes. `collectSources` keeps the first title it meets for a URL,
  so the Sources appendix shows the old title even though this file's record is corrected. Align
  all three.
- `src/sources/index.ts:34` says title consistency across files "is enforced by the tests", but
  `sources.test.ts` checks only tier. Either add the title check or fix the comment.
- No new URLs, records or acronyms from this pass. `sources.md` needs no regeneration for it.

## Backlog

- Economy: move the map caption's provenance sentences (about 80 of its 110 words) into the
  ExpandableSection with the per-family table, and keep the acronym expansions and the "a hyphen
  marks no sourced figure" key.
- Tower at 390 px: the 640 px minimum width renders 11 px labels at about 8 px. A larger font or a
  stacked phone layout would read better.
- "No HBF read latency is published" (here and in *High Bandwidth Flash*) could carry the scope the
  register checked: the specification, Sandisk and SK hynix.
- The HBM latency label "H800, measured" could read "H800 PCIe, HBM2e" as *Anatomy of a Kernel
  Execution* and *NVIDIA Hopper: H100 and H200* do.
