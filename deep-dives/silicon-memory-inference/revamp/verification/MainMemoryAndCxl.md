# Verification: DDR5, MRDIMM, LPDDR5X and CXL

Verified: 2026-10-23. Claims checked: 56 (sampled: 3, see the Claims table note). Confirmed 49,
wrong 0, unsupported 5, mislabelled 1, unverifiable 1.

## Gate 3 score: 8/10

No number in the section is wrong: every bandwidth, capacity, latency and date matched its source,
and the table arithmetic holds to the stated digits. Five qualifiers went past their sources, and
the fixes narrow them to what the sources say. The one that mattered was "ordinary RDIMMs" on
Graviton5, which carried the MRDIMM "edge moves" argument; AWS says only "DDR5 8800MT/s DIMMs".
The section builds a usable model (peak = channels x data rate x 8 bytes) and ends on a
choose-by-limit block. Economy is the weak criterion: length grew about 37%, the 117-word grid
caption reads as a citation list, and "110 ns" is stated five times.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 49 of 56 confirmed, 0 wrong; the load-bearing "RDIMM" label on Graviton5 was unsupported and is fixed; MRCD standard unverifiable (JEDEC 403, no archive after July) |
| Mental model or practical value | 9 | Formula plus table lets a reader size any socket; MRDIMM block gives "price Graviton5 first"; Vera sizing at 1.5 TB; CXL split by latency tolerance; Azure-only CXL, NVMe on EC2. No block does neither |
| Shape | 8 | Introduces host memory before the formula; h2 descriptions name the reader's moment; 844.8 GB/s lands four times; CXL versions and the 6700P conflict demoted; ends on How to choose |
| Writing | 8 | Gates clean; vendor attributions ("Samsung measured", "Intel puts", "AMD says") are vendor-claim or roadmap cases; one awkward clause ("Micron, whose 192 GB SOCAMM2 it reports in high-volume production") |
| Economy | 7 | +37% (author) plus about 45 words from my fixes; growth maps to required NEW register items, but the grid caption is a long run of citations and 110 ns repeats in h1, grid, CXL h2, CXL body and How to choose |
| Diagrams | 9 | MemoryTechGrid is inline SVG, role="img", aria-labelledby title; probe "ok" at 1440 and 390; 390 switches to one column, every label legible; no overlap |

## Claims

Sampled rather than re-fetched (taken from same-day sibling verifications that quote the source):
#15 JESD79-5C (HBM and the Bandwidth Wall verification), the FSx 1,200 Gb/s and OCP grade figures
inside #51 and #52 (Flash as a Cache Tier verification). Everything else was fetched today. JEDEC,
amd.com and the Azure blog refused or timed out on live requests; their rows quote Wayback copies
(capture date given).

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Peak per socket = channels x data rate x 8 bytes; 844.8 GB/s for Graviton5 (12 x 8 x 8,800) | c9gGa, gravitonReadme (derived) | CONFIRMED | C9g blog (30 JUN 2026): "DDR5 8800MT/s DIMMs"; README @8b322a4 DRAM row: Graviton5 "12x DDR5". 12 x 8,800 x 8 = 844,800 MB/s | - |
| 2 | Graviton5 uses RDIMMs ("the RDIMMs in Graviton5", "ordinary RDIMMs", row "DDR5-8800 RDIMM", How to choose "an RDIMM platform") | c9gGa | UNSUPPORTED | C9g blog: "DDR5 8800MT/s DIMMs"; Amazon Science Graviton5 post: "supports DDR5-8800 memory"; M9g page: no module type. No AWS page read names RDIMM or MRDIMM | "DIMMs"; row "DDR5-8800"; edge paragraph adds "The AWS pages read for this research do not name Graviton5's module type"; grid cell "DDR5 DIMM" |
| 3 | 614.4 GB/s at 6,400 MT/s on 12 channels | derived | CONFIRMED | 12 x 6,400 x 8 = 614,400 MB/s | - |
| 4 | 16 ch x 12,800 MT/s = 1,638 GB/s per socket on EPYC 9006 | epyc9996Page | CONFIRMED | EPYC 9996 (Wayback 2026-10-06): "Memory Channels 16", "Up to 8000 MT/s / Up to 12800 MT/s", "Per Socket Mem BW 1024 GB/s / 1638 GB/s" | - |
| 5 | EPYC 9006 status: "announced" (h1), "announced July 2026" (table), "EPYC 9006 announced" (grid), "once it ships" (How to choose) | amdVeniceBlog | CONFIRMED, incomplete | Blog (Jul 23, 2026) gives specs, no availability sentence. AMD Newsroom 2026-09-18: "“Venice” is in production today." "Major OEM platforms are on track to launch, and leading cloud providers will begin deploying them later this year." AAI 2026 newsroom (2026-07-23) and Helion (2026-10-12): no 9006 status sentence | Prose and grid now give AMD's status (new record amdAgenticStack, roadmap); see ORCH-NOTES |
| 6 | CXL adds about 110 ns per load | samsungCmmD (derived) | CONFIRMED | Table 2 (p. 5), Intel MLC v3.10 idle latency: RDIMM local 144, CMM-D local 254. 254 - 144 = 110 | - |
| 7 | DDR5-4800: 38.4 / 460.8 GB/s; "First DDR5 data rate in the JEDEC standard" | jedecDdr5 | CONFIRMED | JEDEC (Wayback 2026-10-09), July 14, 2020: "expected to be launched at 4.8 Gbps". 4,800 x 8 = 38.4; x 12 = 460.8 | - |
| 8 | DDR5-5600: 44.8 / 537.6 GB/s; Graviton4 (R8g) | r8gPage, gravitonReadme | CONFIRMED | r8g: "R8g instances include DDR5-5600 memory"; README: Graviton4 "12x DDR5 (24x for 48xlarge)" | - |
| 9 | DDR5-6400: 51.2 / 614.4; EPYC 9005 with OEM enablement and a BIOS update; Xeon 6 6900P; R8gn and R8gb | epyc9755Page, xeon6980pArk, r8gPage | CONFIRMED | EPYC 9755 (Wayback 2026-06-18): "DDR5-6400 support requires OEM enablement and a BIOS update", "614 GB/s"; ARK 6980P "DDR5(6400MT/s)"; r8g: "R8gn and R8gb instances include DDR5-6400 memory." | - |
| 10 | DDR5-7200: 57.6 / 691.2; AWS M8i and R8i (Xeon 6) | m8iPage, r8iPage | CONFIRMED | M8i: "use DDR5 7200MT/s DIMMs"; R8i: "R8i and R8i-flex instances use DDR5 7200MT/s DIMMs"; both "custom Intel Xeon 6" | - |
| 11 | DDR5-8800: 70.4 / 844.8 GB/s, Graviton5 | c9gGa, gravitonReadme | CONFIRMED | As #1 | Grade label per #2 |
| 12 | MRDIMM-8800: 70.4 / 844.8 GB/s, Xeon 6 6900P | xeon6980pArk | CONFIRMED | ARK: "MRDIMM(8800MT/s)", "Maximum Memory Speed 8800 MT/s", "Max # of Memory Channels 12" | - |
| 13 | MRDIMM-12800: 102.4 / 1,638 GB/s (16 ch) | epyc9996Page | CONFIRMED | As #4; 12,800 x 8 = 102.4; x 16 = 1,638.4 | Status per #5 |
| 14 | DDR5 launched at 4,800 MT/s | jedecDdr5 | CONFIRMED | As #7 | - |
| 15 | JESD79-5C sets timings up to 8,800 | jedecDdr5c | CONFIRMED (sampled) | HBM verification, same URL: "Expansion of timing parameters definition from 6800 Mbps to 8800 Mbps" | - |
| 16 | MRDIMM adds an MRCD and MDBs, "both JEDEC device standards" | jedecJc40 | CONFIRMED (MDB) / UNVERIFIABLE (MRCD) | JC-40 (Wayback 2026-07-18): "DDR5MDB02 Multiplexed Rank Data Buffer \| JESD82-552 \| Feb 2026"; no MRCD entry yet. JEDEC 2026-04-30: MRCD02 "is expected to be published in the near future". Live JC-40 returns 403 to WebFetch, curl and headless Chromium; no capture after 2026-07-18. A search-engine extract of JC-40 lists "DDR5MRCD02 ... JESD82-542 · Sep 2026", matching the register's 2026-10-16 read | Kept; re-check when JEDEC is reachable |
| 17 | Bus at twice the DRAM rate: 8,800 over 4,400 | jedecMrdimmPlans (derived) | CONFIRMED | JEDEC (2024-07-22, Wayback 2026-10-16): "set to deliver up to twice the peak bandwidth of native DRAM"; 8,800 / 2 = 4,400 | - |
| 18 | Xeon 6 6900P takes MRDIMMs at 8,800 MT/s on 12 channels | xeon6980pArk | CONFIRMED | As #12 | - |
| 19 | Intel: more than 37% over standard DDR5 DIMMs, which is 8,800 over 6,400 (vendor-claim) | xeon6Brief | CONFIRMED | Brief: "MRDIMMs deliver up to 8,800 MT/s and are capable of providing more than 37 percent additional memory bandwidth ... compared to standard DDR5 DIMMs"; footnote 3: "In comparison to DDR5 6,400 RDIMMs". 8,800 / 6,400 = 1.375 | - |
| 20 | "EPYC 9005 takes RDIMMs only" | epyc9005Datasheet | UNSUPPORTED | Data sheet (Wayback 2026-07-11): "up to 12 DDR5-6400 memory channels", columns "DDR5"; neither "RDIMM" nor "MRDIMM" appears. EPYC 9755 page: "System Memory Type DDR5" (the 9996 page, by contrast, lists "DDR5 RDIMM \| MRDIMM") | "AMD's EPYC 9005 data sheet lists no MRDIMM support." |
| 21 | EPYC 9006 takes JEDEC-standard MRDIMMs at up to 12,800 MT/s | amdVeniceBlog | CONFIRMED | Blog: "up to 16 channels of DDR5 memory, JEDEC-standard MRDIMM support up to 12,800 MT/s" | - |
| 22 | 1,638 vs 1,024 GB/s with RDIMMs at 8,000 on the same 16 channels | epyc9996Page | CONFIRMED | As #4 | - |
| 23 | Module type alone worth 60% | epyc9996Page (derived) | CONFIRMED | 1,638 / 1,024 = 1.600 | - |
| 24 | Graviton5's 12 channels deliver the same 844.8 GB/s that MRDIMMs give a 6900P | c9gGa (derived) | CONFIRMED | #1 and #12 | Module-type hedge per #2 |
| 25 | JEDEC Gen2 MRDIMM raw cards target 12,800 MT/s; Gen3 in development (roadmap) | jedecMrdimmRoadmap | CONFIRMED | JEDEC (2026-04-30, Wayback 2026-07-15): "Gen2 DDR5 MRDIMM raw card designs targeting 12,800 MT/s and MRDIMM Gen3 module standard development" | - |
| 26 | Xeon 6787P ARK: DDR5 6,400, MRDIMM 8,800, maximum 8,000 MT/s, 8 channels | xeon6787pArk | CONFIRMED | ARK: "DDR5(6400MT/s), MRDIMM(8800MT/s)", "Maximum Memory Speed 8000 MT/s", "Max # of Memory Channels 8" | - |
| 27 | Grace: up to 480 GB per CPU | gb200Nvl72 | CONFIRMED | GB200 superchip column: "Up to 480 GB LPDDR5X \| Up to 512 GB/s", "1 Grace CPU \| 2 Blackwell GPU" | Grid value "Grace: up to 480 GB" (Grace also ships 120 and 240 GB) |
| 28 | "On Grace it is soldered to the compute module"; How to choose "Grace solders it"; h2 "from soldered packages" | gb200Nvl72, graceSuperchipPage | UNSUPPORTED | Grace CPU Superchip page: "120GB, 240GB and 480GB on-module memory options available"; no page read says soldered (also found by the Grace-Blackwell verification) | "sits on the compute module"; "Grace carries it on the compute module"; h2 "from on-module memory to field-replaceable SOCAMM2 modules" |
| 29 | About 16 W at up to 500 GB/s | graceSuperchipPage | CONFIRMED | "It delivers up to 500 GB/s in only about 16W, approximately one fifth the power of conventional DDR5 memory." | - |
| 30 | Grace CPU C1: 384 GB/s for 480 GB | graceSuperchipPage | CONFIRMED | C1 column: "Up to 384 GB/s for 480GB", "Up to 512 GB/s for 120GB, 240GB" | - |
| 31 | SOCAMM2 is JESD328, published June 2026 | jedecJc45 | CONFIRMED | JC-45 (Wayback 2026-10-02): "LPDDR5/5X Small Outline Compression Attached Memory Module (SOCAMM2) Common Standard \| JESD328 \| Jun 2026" | - |
| 32 | Up to 9.6 Gb/s per pin where signal integrity allows | jedecSocamm2 | CONFIRMED | JEDEC (October 20, 2025, Wayback 2026-07-12): "forecast to support the full LPDDR5X data rate, including configurations up to 9.6 Gb/s per pin where platform signal integrity allows" | - |
| 33 | Vera: field-replaceable SOCAMM modules, up to 1.2 TB/s and 1.5 TB per CPU | graceCpuPage | CONFIRMED | "NVIDIA Vera combines LPDDR5X memory with field-replaceable SOCAMM modules"; "Delivering up to 1.2 TB/s of memory bandwidth and up to 1.5 TB of capacity per CPU" | - |
| 34 | Micron 192 GB SOCAMM2 in high-volume production for Vera Rubin; up to 2 TB per CPU (vendor-claim) | micronHbm4 | CONFIRMED | March 16, 2026: "192GB SOCAMM2 in high-volume production"; "Micron SOCAMM2 is designed for NVIDIA Vera Rubin NVL72 systems and standalone NVIDIA Vera CPU platforms ... enabling up to 2TB of memory and 1.2 TB/s of bandwidth per CPU." | - |
| 35 | LPDDR6 published, JESD209-6, July 2025 | jedecLpddr6 | CONFIRMED | JEDEC document page (Wayback 2025-11-13): "LPDDR6 Standard \| JESD209-6 \| Published: Jul 2025". The cited press-release URL returns 403 and has no capture | - |
| 36 | "CXL 2.0 adds switching and pooling across hosts" | cxl3Spec | UNSUPPORTED (by the cited source) | The CXL 3.0 release does not say what 2.0 introduced. CXL Consortium blog (December 2, 2020): "The CXL 2.0 specification adds switching support providing fan-out ...; memory pooling for increased memory utilization efficiency" | New record cxl2Blog (Tier 1, accessed 2026-10-23) cited on the sentence |
| 37 | CXL 3.0 adds sharing | cxl3Spec | CONFIRMED | "introduces fabric capabilities and management, improved memory sharing and pooling"; "With its expanded features for coherent memory sharing" | - |
| 38 | Xeon 6: up to 64 lanes of CXL 2.0 at 32 GT/s | xeon6Brief | CONFIRMED | "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane" | - |
| 39 | 64 GB/s per direction per x16 at CXL 2.0 | xeon6Brief (derived) | CONFIRMED | 32 x 16 / 8 = 64, per direction (GT/s is a per-lane, per-direction rate) | - |
| 40 | EPYC 9005 supports CXL 2.0 | epyc9005Datasheet | CONFIRMED | "CXL® 2.0 capabilities for memory-intensive tasks" | - |
| 41 | AMD pages read for EPYC 9006 do not state its CXL version | (hedge) | CONFIRMED | 0 hits for "CXL" in the 9996 page and the Venice blog; AAI 2026 newsroom "does not mention CXL" | - |
| 42 | Samsung measured 254 ns idle CMM-D vs 144 ns local DRAM (vendor-claim) | samsungCmmD | CONFIRMED | Table 2: "Idle latency (ns) 144 239 254 353"; "DRAM showed 144 ns locally ... CMM-D recorded 254 ns locally". Samsung's own measurement of its own module: vendor-claim with "Samsung measured" in the sentence, as in Memory Hierarchy Primer | - |
| 43 | Pond: 70 to 90 ns in 8- to 16-socket pools, more than 180 ns at rack scale (simulated) | pond | CONFIRMED | Abstract: "CXL will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling" | - |
| 44 | Samsung vLLM + LMCache on a CXL 2.0 switch pool, 8 RTX PRO 6000; comparable to DRAM at TP=1, about 92% at TP=8 (vendor-claim) | samsungKvCxl | CONFIRMED | June 2026, p. 2: "8× RTX PRO 6000 GPUs) with a CXL 2.0 switch–based memory pool"; "(TP=1) ... achieves performance comparable to DRAM"; "(TP=8) ... achieves approximately 92%" | - |
| 45 | Azure CXL on M-series in private preview, announced November 2025 | azureCxl | CONFIRMED | Wayback 2026-04-16, "Nov 18, 2025": "Microsoft is delighted to announce private preview of CXL technology on Azure M-series family of VMs" | - |
| 46 | No EC2 CXL instance located; X8i (January 2026) up to 6 TB, no CXL tier | x8iWhatsNew | CONFIRMED (scoped) | "Posted on: Jan 15, 2026"; "1.5x more memory capacity (up to 6TB)"; no CXL mention | - |
| 47 | CXL 3.0 (August 2022): 64 GT/s, no added latency, fabrics, sharing and pooling, peer-to-peer | cxl3Spec | CONFIRMED | "August 2, 2022"; "doubles the data rate to 64GTs with no added latency over CXL 2.0"; "fabric capabilities ... improved memory sharing and pooling, enhanced coherency, and peer-to-peer communication" | - |
| 48 | CXL 3.1 (November 2023): fabric manageability, TSP | cxl31Spec | CONFIRMED | "November 14, 2023"; "improved fabric manageability"; "Trusted-Execution-Environment Security Protocol (TSP)" | - |
| 49 | CXL 3.2 (December 2024): Hot-Page Monitoring Unit (CHMU) for memory tiering | cxl32Spec | CONFIRMED | "December 3, 2024"; "New CXL Hot-Page Monitoring Unit (CHMU) for memory tiering" | - |
| 50 | CXL 4.0 (November 2025): 128 GT/s, bundled ports, backward compatible to 1.0; x16 = 128 / 256 GB/s per direction | cxl4Spec (derived) | CONFIRMED | "Nov. 18, 2025"; "doubles bandwidth from 64GTs to 128GTs, adds support for bundled ports"; "Continued full backward compatibility with CXL 3.x, 2.0, 1.1, and 1.0". 64 x 16 / 8 = 128; 128 x 16 / 8 = 256 | - |
| 51 | Grid NVMe: 1.56 to 18.75 GB/s per GPU, store at least 2.25; 30.4 TB (8 x 3,800 GB) on an 8-GPU P5en or P6; 4.4 M IOPS at 4 KiB; on P5, P5e, P5en, P6-B200, P6-B300 | ec2AcceleratedSpecs, fsxPerformance (derived) | CONFIRMED | ac.html: five rows "8 x 3800 GB \| NVMe SSD \| 4,400,000 / 2,200,000"; "aggregated IOPS performance with 4,096 byte block size at queue depth saturation"; EBS "p5en.48xlarge 100000.00 12500.00", same for p6-b200 and p6-b300. 12,500 / 8 = 1.5625; 4.4 M x 4,096 / 8 = 2.25 GB/s. FSx 1,200 Gb/s sampled from the Flash as a Cache Tier verification. Identical to the Memory Hierarchy Primer tower and Flash as a Cache Tier | - |
| 52 | Grid HBF: 0.384 to 3.072 TB/s per stack (OCP grades); Sandisk Gen 1 1.6 TB/s; 512 GiB per 16-high stack; latency not published; studies assume 1 to 20 µs | ocpSpec, sandiskFactSheet, flint, hbfSim | CONFIRMED | Sandisk fact sheet: "read bandwidth of 1.6 TB/s ... 512GB total capacity per 16 die stack"; "the higher latency ... of HBF compared to HBM" (no figure). FLINT: "page-read latency tR of 1–2 µs in modern SLC NAND"; HBFSim: "an HBF page read is estimated at ∼20 µs". OCP grades sampled from the Flash as a Cache Tier verification (Table 3 "512 GiB", Table 4 "0.384 / 1.536 / 3.072"). Same figures as Memory Hierarchy Primer, High Bandwidth Flash and Flash as a Cache Tier | - |
| 53 | Grid HBF: "No product; samples targeted for 2027"; caption "first HBF memory die taped out in August 2026" | sandiskInvestorDay2026 | CONFIRMED (2027) / UNSUPPORTED (August) | Transcript (2026-08-13): "we actually taped out our first HBF memory die"; "deliver our first samples to our customers of inference devices with HBF next year". No tape-out month | "Sandisk said on 2026-08-13 that its first HBF memory die had taped out" (orchestrator item) |
| 54 | Grid DDR5: 614 to 845 GB/s per socket; up to 6 TB per socket (EPYC 9005, 12 ch); ~144 ns idle | c9gGa, epyc9005Datasheet, samsungCmmD | CONFIRMED | #1, #3; data sheet "12/6TB" on every SKU row; #42 | Cell renamed "DDR5 DIMM" (#2) |
| 55 | Grid MRDIMM: 845 to 1,638 GB/s; up to 3 TB per socket (6900P) | xeon6980pArk, epyc9996Page | CONFIRMED | ARK "Max Memory Size ... 3 TB"; #4 | Footer status per #5 |
| 56 | Intel Xeon 6 Product Brief record titled "PCIe 5.0 at 32 GT/s per lane" | xeon6Brief | MISLABELLED (record title) | The brief gives 32 GT/s only for CXL; its PCIe 5.0 lines carry no rate. No claim in this section cites it for a PCIe 5.0 rate (its three uses: CXL lanes and rate, the derived 64 GB/s, the 37% vendor claim) | Retitled to the Memory Hierarchy Primer title (orchestrator item) |

## ORCH-NOTES items

ORCH-NOTES.md has no item naming this section. The items in the orchestrator's dispatch:

- **844.8 GB/s and the table:** CONFIRMED. AWS: "DDR5 8800MT/s DIMMs" (C9g blog) and "12x DDR5"
  (README @8b322a4). Every row recomputes exactly (#7 to #13). Neither AWS source names the module
  type, so "RDIMM" on Graviton5 is unsupported and is removed (#2).
- **EPYC 9006 (Venice) status:** AMD's latest statement located (Newsroom, 2026-09-18): "“Venice” is
  in production today. Major OEM platforms are on track to launch, and leading cloud providers will
  begin deploying them later this year." The AMD #EPYC newsroom tag through 2026-10-13 has no
  later OEM-launch or cloud-instance item. Neither "launched" (register) nor "unshipped" (AMD EPYC
  Turin) is AMD's word: AMD calls it in production, with OEM platforms still to launch. Grid footer
  now reads "On Xeon 6 6900P; EPYC 9006 in production". The prose says "in production with OEM
  (original equipment manufacturer) platforms still to launch" (h1), adds AMD's sentence to the
  MRDIMM block, and "once its OEM platforms launch" (How to choose), cited to a new `amdAgenticStack`
  record, kind `roadmap`.
- **LPDDR5X and SOCAMM2:** Grace 384 to 500 GB/s and 480 GB CONFIRMED (#27, #29, #30). Vera 1.2 TB/s
  and 1.5 TB CONFIRMED (#33). Micron's 2 TB is CONFIRMED as Micron's claim, marked vendor-claim
  (#34). JESD328 June 2026 CONFIRMED (#31). JESD209-6 July 2025 CONFIRMED (#35). "Soldered" was
  unsupported and is fixed (#28).
- **CXL:** Shipping CPUs at CXL 2.0 CONFIRMED (#38, #40). 64 GB/s per direction per x16 and 256 at
  CXL 4.0 CONFIRMED (#39, #50). Samsung 144 and 254 ns idle CONFIRMED: Samsung measured them with
  Intel MLC v3.10, Table 2 (#42). They stay `vendor-claim` with "Samsung measured" in the sentence,
  because this is a vendor measuring its own module; the Primer labels it the same way. "None found
  on EC2" is scoped (#46). The CXL 3.0 to 4.0 dates are all CONFIRMED (#47 to #50).
- **Grid HBF and NVMe figures:** they match the Memory Hierarchy Primer tower (`MemoryHierarchyTower.tsx:107-145`),
  High Bandwidth Flash (`:34`, `:99-101`, `:174-177`) and Flash as a Cache Tier (`:39-40`, `:98-99`,
  `:242-243`) digit for digit (#51, #52).
- **Length (+37%):** scored 7 on economy. The growth maps to NEW register items (the SOCAMM2, CXL KV
  offload and where-to-run blocks, plus the demoted versions list). The grid caption and the
  repeated 110 ns are the padding (Backlog).
- **Mid-task items:** the Xeon 6 brief record is retitled (#56). Every claim cited to it is CXL or
  MRDIMM, and none is a PCIe 5.0 rate. The Sandisk tape-out note is reworded (#53). The Investor
  Day record was already Tier 2 here.

## Fixes applied

- `src/sources/MainMemoryAndCxl.ts:123`: xeon6Brief title "Intel Xeon 6 Product Brief (PCIe 5.0 at 32 GT/s per lane)" -> "Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)".
- `src/sources/MainMemoryAndCxl.ts`: new `cxl2Blog` (CXL Consortium, Tier 1, accessed 2026-10-23) and `amdAgenticStack` (AMD Newsroom 2026-09-18, Tier 2, accessed 2026-10-23).
- `src/sections/MainMemoryAndCxl.tsx:76`: grade "DDR5-8800 RDIMM" -> "DDR5-8800".
- `:100-101`: "EPYC 9006, announced July 2026 [amdVeniceBlog roadmap]" -> "EPYC 9006, in production, OEM platforms to come [amdAgenticStack roadmap]".
- `:133`: "the RDIMMs in Graviton5" -> "the DIMMs in Graviton5".
- `:137`: "on AMD's announced EPYC 9006 give" -> "on AMD's EPYC 9006, in production with OEM (original equipment manufacturer) platforms still to launch, give".
- `:160`: caption "Sources: DDR5 RDIMM" -> "DDR5 DIMM". `:167`: added an amdAgenticStack roadmap cite to the MRDIMM sources.
- `:192`: Sandisk note "first HBF memory die taped out in August 2026" -> "Sandisk said on 2026-08-13 that its first HBF memory die had taped out".
- `:212`: "DDR5 RDIMMs are the socketed DRAM on Graviton, EPYC and Xeon hosts" -> "Socketed DDR5 DIMMs are the DRAM on ...".
- `:279-292`: "EPYC 9005 takes RDIMMs only." -> "AMD's EPYC 9005 data sheet lists no MRDIMM support."; "AMD has announced EPYC 9006 with JEDEC-standard MRDIMMs" -> "EPYC 9006 takes JEDEC-standard MRDIMMs"; added "EPYC 9006 is in production; AMD says major OEM platforms are on track to launch and cloud providers will begin deploying it later in 2026. [amdAgenticStack roadmap]".
- `:294-298`: "Graviton5 reaches 8,800 MT/s with ordinary RDIMMs, so its 12 channels" -> "Graviton5 runs its DDR5 DIMMs at 8,800 MT/s, so its 12 channels"; added "The AWS pages read for this research do not name Graviton5's module type."
- `:315`: h2 description "from soldered packages to SOCAMM2 modules" -> "from on-module memory to field-replaceable SOCAMM2 modules".
- `:322`: "On Grace it is soldered to the compute module" -> "On Grace it sits on the compute module".
- `:363`: added a `cxl2Blog` cite after "CXL 2.0 adds switching and pooling across hosts; CXL 3.0 adds sharing."
- How to choose: "EPYC 9006 at 12,800 once it ships" -> "once its OEM platforms launch"; "Price an RDIMM platform at the same rate first: Graviton5 gets 844.8 GB/s from DDR5-8800." -> "Price Graviton5 first: its DDR5-8800 DIMMs give the same 844.8 GB/s."; "Grace solders it" -> "Grace carries it on the compute module".
- `src/components/MemoryTechGrid.tsx:41`: cell "DDR5 RDIMM" -> "DDR5 DIMM"; `:66` "On Xeon 6 6900P; EPYC 9006 announced" -> "On Xeon 6 6900P; EPYC 9006 in production"; `:78` "Grace: 480 GB" -> "Grace: up to 480 GB"; `:291` title "DDR5 RDIMMs at 614 to 845" -> "DDR5 DIMMs at 614 to 845".

Net visible prose added: about 45 words (about 3% on the author's 1,451).

## Checks

- `pnpm exec tsc --noEmit | grep -E "MainMemoryAndCxl|MemoryTechGrid|sources/MainMemoryAndCxl"`: no matches ("no type errors in my files").
- `pnpm exec eslint src/sections/MainMemoryAndCxl.tsx src/sources/MainMemoryAndCxl.ts src/components/MemoryTechGrid.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t MainMemoryAndCxl`: 1 passed, 34 skipped.
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; 0 hits for MainMemoryAndCxl or MemoryTechGrid in each output.
- `pnpm exec vite build --outDir /tmp/vf-MainMemoryAndCxl-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections main-memory-cxl --widths 1440,390 ...`: "1 SVG diagram(s), 0 React Flow, ok" at both widths. PNGs read: 3 x 2 grid at 1440 and one column at 390. "On Xeon 6 6900P; EPYC 9006 in production" fits its cell at both widths, with no text near a border and no overlap. The sticky breadcrumb crossing the MRDIMM cell in the 390 element shot is the page header captured mid-scroll, not part of the SVG. The last edit after the shoot (the OEM expansion in the h1) is prose only; tsc, eslint, vitest and the gates were re-run after it.

## For the orchestrator

- **AMD EPYC Turin (AmdEpycTurin.tsx and its sources):** it treats EPYC 9006 as unshipped with no
  date. AMD's own latest status (Newsroom, 2026-09-18,
  https://newsroom.amd.com/news/amd-epyc-cpus-deliver-every-layer-agentic-ai-stack/): "“Venice” is in
  production today. Major OEM platforms are on track to launch, and leading cloud providers will
  begin deploying them later this year." Align that section, reusing the `amdAgenticStack` record
  from `src/sources/MainMemoryAndCxl.ts`. The register's "launched 2026-07-23" is not AMD's wording:
  the AAI 2026 newsroom item has no launch or availability sentence.
- **Capital Markets Lens, `xeon6Brief`:** it still carries the old title "PCIe 5.0 at 32 GT/s per
  lane". This file and the Memory Hierarchy Primer now use "up to 64 lanes of CXL 2.0 at up to 32
  GT/s per lane".
- **sources.md:** regenerate for the two new records (`cxl2Blog`, `amdAgenticStack`) and the
  retitled `xeon6Brief`.
- **Glossary:** OEM is now expanded in this section's h1 and is already in the glossary. No new
  acronyms.
- **Other sections that say Graviton5 uses RDIMMs** (a grep of src/sections and src/components for
  Graviton5 near RDIMM found none outside this file): AWS states "DDR5 8800MT/s DIMMs" and no module type.
- **AMD page fetches:** live amd.com timed out for WebFetch and curl. The AMD product rows here
  rest on Wayback captures (9996: 2026-10-06; 9755: 2026-06-18; 9005 data sheet: 2026-07-11).

## Backlog

- Economy: compress the 117-word grid caption (it lists citations by tier name) and cut one or
  two of the five "110 ns" mentions (keep h1, the CXL h2 and the CXL body). This is about 40 to 60
  words and would lift economy to 8.
- HBF grades and stack height: OCP grade 1 (0.384 TB/s) is limited to an 8-high stack, so a 512 GiB
  16-high stack starts at 1.536 TB/s (Flash as a Cache Tier verification). The grid inherits the
  mixed-height wording from the Primer and should follow whatever High Bandwidth Flash settles on.
- The NVMe cell's 1.56 GB/s EBS floor is the P5en and P6 figure; P5 and P5e cap EBS at 10,000 MB/s
  (1.25 GB/s per GPU), while the cell lists all five families. This matches the Primer tower and
  is a scope refinement, not a correction.
- Re-check JEDEC JC-40 for JESD82-542 (DDR5MRCD02) once jedec.org serves the page or a newer
  capture appears.
- The `pond` record title says "Figure 4"; the quoted sentence is in the abstract (shared record,
  Capital Markets Lens).
