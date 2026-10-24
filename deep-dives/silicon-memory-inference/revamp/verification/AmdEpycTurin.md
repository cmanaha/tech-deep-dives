# Verification: AMD EPYC Turin

Verified: 2026-10-23. Claims checked: 62 (sampled: 0, every claim in the list was checked).
Confirmed 58, wrong 2, unsupported 2, mislabelled 0, unverifiable 0.

Sources read, with capture dates where amd.com timed out:
- AMD "5th Gen AMD EPYC Processor Architecture" white paper, First Edition March 2025. Live PDF
  from docs.amd.com.
- EPYC 9005 data sheet, PID 242937604-G November 2025. Wayback capture 2026-07-11.
- EPYC 9755 product page. Wayback capture 2026-06-18.
- Solarflare X4 SDCI white paper, Rev 1. Wayback capture 2026-07-11.
- AMD blog on Venice, dated Jul 23, 2026. Wayback capture 2026-07-25.
- AMD Newsroom release of September 18, 2026. Wayback capture 2026-10-05.
- Linux at tags v6.12, v6.13, v6.18 and v6.19. Read from git.kernel.org `plain/?h=<tag>`, which
  holds the same tags as the GitHub links. raw.githubusercontent.com returned HTTP 429.
- EC2 instance spec pages (gp, co, mo, hpc), the "AWS and AMD" page, the M8a launch blog and the
  M8i page. All live on 2026-10-23.
- Four Chips and Cheese articles. Live.
- Intel Xeon 6 product brief and the Xeon 6980P ARK page. Live.

## Gate 3 score: 8/10

The section gives a usable model: anything outside a thread's CCD crosses the IO die. It hangs
practical choices on that model: thread placement against 45 vs 150 ns, NPS1 first, L3 per core
by SKU, which EC2 family to pick, and a six-step SDCI checklist that ends on a measurement. Two
load-bearing statements were wrong and are fixed. The first was Venice's status. The second was
the claim that every SERDES block can run PCIe, CXL or the socket link. Two more needed scoping:
the 6 TB / DDR5-6400 pairing and the SDCI payoff line. After the fixes no checked claim
contradicts its source. Economy (+24% words, justified per block by the author) and the 640 px
phone scroll on the diagram keep it at 8 rather than 9.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 58 of 62 confirmed as written. The 2 wrong and 2 unsupported are fixed. The Venice status was the one stale load-bearing item. |
| Mental model or practical value | 9 | Every block does one or the other: topology, latency ladder with placement rule, NPS guidance, SKU by L3 per core, EC2 family pick, workload routing, SDCI checklist. The Zen 5 core list is supporting detail and already sits in an ExpandableSection. |
| Shape | 8 | Intro before dissection; h2 descriptions state the payoff. The strongest number (150 vs 45 ns) lands in the h2, the table, the guidance line and the SVG legend. The section ends on "Measure receive latency with SDCI on and off". |
| Writing | 8 | Gates clean. Attribution stays in the sentence only where it carries weight: "AWS cites 45%" (vendor claim), "AMD measured" (vendor claim), "AMD's guidance" (advice), "AMD says ... on track to launch" (forward-looking). |
| Economy | 7 | 1,096 to 1,364 words (+24%), with the growth explained block by block in the author's report. My fixes add about 45 words of scope. |
| Diagrams | 8 | Inline SVG with `role="img"` and a `<title>` that states the claim; full-bleed background; 11 to 12 px fonts. It sits in an `overflowX` wrapper with `minWidth: 640`, the dive's phone convention. The author's 1440 and 390 shots were clean. I did not change the diagram, so I did not re-shoot it. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Up to 16 Zen 5 CCDs of 8 cores, 128 in all | amdTurinArchWhitepaper | CONFIRMED | "This core complex is fabricated onto a die (CCD), up to 16 of which can be configured into an EPYC 9005 processor"; "a shared 32MB L3 cache for up to eight cores per die" (p. 5, 8) | - |
| 2 | Up to 12 Zen 5c CCDs of 16, 192 in all | amdTurinArchWhitepaper | CONFIRMED | "Up to 12 of these CCDs can be combined with an I/O"; "brings the total core density to up to 192 cores" (p. 5 to 6) | - |
| 3 | Cores on a CCD share one 32 MB L3; every CCD connects to one IO die with the memory controllers and all I/O | amdTurinArchWhitepaper | CONFIRMED | "core complex (CCX) that includes a 32 MB shared L3 cache"; I/O die "interfacing the compute power of the 'Zen 5' cores to the outside world" (p. 5, 7) | - |
| 4 | Full 512-bit AVX-512 data path; BIOS can split it into two 256-bit passes when power matters | amdTurinArchWhitepaper | CONFIRMED | "vector ALUs have been equipped with a full, 512-bit data path"; "If power efficiency is a priority over performance, BIOS settings can direct the processor to execute two 256-bit vectors in sequential clock cycles for AVX-512 instructions." (p. 8, 9) | - |
| 5 | Up to 6 TB of DDR5 on 12 channels per socket | epyc9005Datasheet | CONFIRMED, scope added | Column "DDR5 CHANNELS/MAX MEM (2DPC)": "12/6TB"; column "UP TO MAX DDR5 MT/S (1DPC)": "6400" (p. 2) | Stated at two DIMMs per channel |
| 6 | DDR5-6400 gives 614 GB/s per socket; DDR5-6400 needs OEM enablement and a BIOS update | epyc9755Page | CONFIRMED, scope added | "5th Gen EPYC processors support up to DDR5-6400 MT/s for targeted customers and configurations. DDR5-6400 support requires OEM enablement and a BIOS update"; "Per Socket Mem BW 614 GB/s". 12 x 6,400 x 8 B = 614.4 GB/s | Scoped to one DIMM per channel; OEM expanded |
| 7 | L1D 48 KB, 50% larger, still 4 cycles load to use | amdTurinArchWhitepaper, chipsAndCheeseZen5HotChips | CONFIRMED | WP: "the 48 KB L1 data cache" (p. 8). C&C: "a 50% capacity and associativity increase while maintaining a 4-cycle load-to-use latency" | - |
| 8 | L2 1 MB per core | amdTurinArchWhitepaper | CONFIRMED | "The 'Zen 5' CCD has a dedicated 1MB L2 cache per core" (p. 8) | - |
| 9 | L2 16-way instead of 8-way, higher hit rate | chipsAndCheeseStrixPoint, chipsAndCheeseZen5HotChips | CONFIRMED | Strix Point: "increasing associativity from 8-way to 16-way". Hot Chips: "L2 associativity has gone up too, which should improve L2 hitrate". The mobile-part note is present | - |
| 10 | 124 outstanding L1 misses per core, up from 24 | chipsAndCheeseZen5HotChips | CONFIRMED | "AMD's optimization guide indicates the load/store unit can track up to 124 outstanding L1 misses ... Zen 4 and Zen 3 could track 24" | - |
| 11 | 12 DDR5 memory controllers, one per channel | amdTurinArchWhitepaper | CONFIRMED | "DDR5 MEMORY CONTROLLERS—Twelve in the EPYC 9005 Series"; "supports up to 12 DDR5-6400 memory controllers" (p. 7, 10) | - |
| 12 | 16 GMI links: one per CCD on high-core-count parts, two on memory-speed-optimized parts | amdTurinArchWhitepaper | CONFIRMED | "16 Infinity Fabric connections to CPU dies. In high-core-count processors, a single connection is used"; "In memory-speed-optimized EPYC 9005 Series processors two links connect to each CPU die" (p. 7, 10) | - |
| 13 | GMI = Global Memory Interface | amdTurinArchWhitepaper | CONFIRMED | "known internally as the Global Memory Interface [GMI]" (p. 10) | - |
| 14 | Two-link form is GMI3-Wide; the 9575F uses it | chipsAndCheeseTurin | CONFIRMED | "the 9575F has GMI3-W which means that it has 2 GMI links to the IO die" | - |
| 15 | Eight 16-lane SERDES give 128 PCIe 5 lanes per socket | amdTurinArchWhitepaper, epyc9005Datasheet | CONFIRMED | "eight 16-lane SERDES devices that provide up to 128 lanes"; "Single-socket server configurations have up to 128 PCIe Gen 5 lanes" (p. 10, 11) | - |
| 16 | 160 lanes in a two-socket server | epyc9005Datasheet, amdTurinArchWhitepaper | CONFIRMED | "128 PCIe Gen 5 I/O lanes (up to 160 in 2-socket servers)" (DS p. 1); "bringing the server I/O capacity to 160 lanes" (WP p. 12) | - |
| 17 | "each block usable for PCIe, CXL 2.0 or the link to the other socket" | amdTurinArchWhitepaper | WRONG | "Each SERDES has specific constraints, for example some are restricted to PCIe and Infinity Fabric connectivity, while others enable a richer set of functions"; "no single SERDES provides all of them"; "up to 64 lanes can be configured to support CXL 2.0"; Table 2 "CXL 2.0 ... 4 x16 links" (p. 11) | "The blocks carry PCIe, the link to the other socket or up to 64 lanes of CXL 2.0, and not every block supports every function." |
| 18 | CXL 2.0 on EPYC 9005 | epyc9005Datasheet | CONFIRMED | "CXL® 2.0 capabilities for memory-intensive tasks" (p. 1) | - |
| 19 | Table: L1D 4 cycles, AMD design figure | chipsAndCheeseZen5HotChips | CONFIRMED | As #7 | - |
| 20 | Core to core, same CCD, about 45 ns (9575F), measured | chipsAndCheeseTurin | CONFIRMED | "Intra-CCD latency: ~45ns" | - |
| 21 | Different CCDs about 150 ns | chipsAndCheeseTurin | CONFIRMED | "Inter-CCD latency: ~150ns" | - |
| 22 | Other socket about 260 ns, two 9575F | chipsAndCheeseTurin | CONFIRMED | "Socket to Socket latency: ~260ns"; test platform "between the two 9575Fs" | - |
| 23 | DRAM NPS1 about 130 ns, derived, 9355P | chipsAndCheeseNps0 | CONFIRMED (derived) | "over 220 ns, giving a nearly 90 ns penalty over the EPYC 9355P running in NPS1 mode"; 220 - 90 = 130 | - |
| 24 | DRAM NPS0 over 220 ns, two 9575F | chipsAndCheeseNps0 | CONFIRMED | "an instance with 2 AMD EPYC 9575Fs"; "DRAM latency rises to over 220 ns" | - |
| 25 | Cross-CCD exchange about three times the within-CCD cost | chipsAndCheeseTurin | CONFIRMED (derived) | 150 / 45 = 3.3 | - |
| 26 | Keep sharing threads on one CCD: 8 cores on Zen 5, 16 on Zen 5c | amdTurinArchWhitepaper | CONFIRMED | As #1, #2 | - |
| 27 | NPS is a BIOS setting | amdTurinArchWhitepaper | CONFIRMED | Benchmark endnotes: "BIOS Options: SMT=Off NPS=4" (p. 20) | - |
| 28 | AMD guidance: most applications run well as one domain, NPS1 | amdTurinArchWhitepaper | CONFIRMED | "most applications don't need to be concerned about using NUMA domains, and using the AMD EPYC processor as a single domain (NPS=1) gives excellent performance" (p. 13) | - |
| 29 | NPS4 quadrant: three memory controllers, up to four Zen 5 or three Zen 5c CCDs; small gains | amdTurinArchWhitepaper | CONFIRMED | "six DIMMs feed into three memory controllers ... a set of up to four 'Zen 5', or up to three 'Zen 5c' CPU dies"; Figure 8: "can give small performance improvements for some applications" (p. 12 to 13) | - |
| 30 | NPS0 makes a two-socket server one node over every channel; more bandwidth | chipsAndCheeseNps0 | CONFIRMED | "NPS0 exposes a dual socket system as a single monolithic entity. It evenly distributes memory accesses across all memory controller channels"; "a bandwidth advantage from bringing twice as many memory controllers into play" | - |
| 31 | NPS0 nearly 90 ns above a 9355P in NPS1 | chipsAndCheeseNps0 | CONFIRMED | As #23 | - |
| 32 | 9965: 192 Zen 5c, 384 MB, 3.7 GHz, 2 MB per core | epyc9005Datasheet | CONFIRMED | Row "9965 192 384 5c 2.25 3.70 500 384"; 384 / 192 = 2 | - |
| 33 | 9755: 128 Zen 5, 512 MB, 4.1 GHz, 4 MB | epyc9005Datasheet | CONFIRMED | Row "9755 128 256 5 2.70 4.10 500 512"; 512 / 128 = 4 | - |
| 34 | 9575F: 64 Zen 5, 256 MB, 5.0 GHz, 4 MB | epyc9005Datasheet | CONFIRMED | Row "9575F 64 128 5 3.30 5.00 400 256"; 256 / 64 = 4 | - |
| 35 | 9355P one socket only: 32 Zen 5, 256 MB, 4.4 GHz, 8 MB | epyc9005Datasheet | CONFIRMED | Row "9355P 32 64 5 3.55 4.40 280 256 ... 1P"; 256 / 32 = 8 | - |
| 36 | 9175F: 16 Zen 5, 512 MB, 5.0 GHz, 32 MB; 16 CCDs with one core each | epyc9005Datasheet, amdTurinArchWhitepaper | CONFIRMED | Row "9175F 16 32 5 4.20 5.00 320 512"; WP: "the 16-core EPYC 9175F uses 16 CPU dies, each with one core per die active" (p. 6) | - |
| 37 | Each CCD has 32 MB of L3 at any core count | amdTurinArchWhitepaper | CONFIRMED | "Total 32 MB L3 cache per die" (Figure, p. 5) | - |
| 38 | M8a, C8a, R8a run the AMD EPYC 9R45 | ec2*Specs | CONFIRMED | gp, co, mo rows "AMD EPYC 9R45" for every m8a, c8a, r8a size | - |
| 39 | at up to 4.5 GHz | ec2AmdPage | CONFIRMED | M8a, C8a, R8a: "with a maximum frequency of 4.5 GHz" | - |
| 40 | vCPU = physical core, no SMT; m8a.48xlarge 192 vCPUs, 192 cores | m8aLaunchBlog, ec2GeneralPurposeSpecs | CONFIRMED | "Each vCPU on an M8a instance corresponds to a physical CPU core, meaning there is no simultaneous multithreading (SMT)"; row "m8a.48xlarge 768.00 AMD EPYC 9R45 192 192 1". c8a.48xlarge and r8a.48xlarge also show 192 / 192 / 1 | - |
| 41 | 45% more memory bandwidth for M8a than M7a (vendor-claim) | m8aLaunchBlog | CONFIRMED | "They provide 45% more memory bandwidth compared to M7a instances" | - |
| 42 | M8azn and X8aedz run the AMD EPYC 9R05 | ec2GeneralPurposeSpecs, ec2MemoryOptimizedSpecs | CONFIRMED | Rows "m8azn.24xlarge 384.00 AMD EPYC 9R05 96 96 1", "x8aedz.24xlarge 3072.00 AMD EPYC 9R05 96 96 1" | - |
| 43 | at up to 5 GHz | ec2AmdPage | CONFIRMED | M8azn: "the highest maximum CPU frequency in the cloud at 5 GHz"; X8aedz: "5GHz" | - |
| 44 | M8azn up to 96 vCPUs | ec2GeneralPurposeSpecs | CONFIRMED | Largest rows m8azn.24xlarge and m8azn.metal-24xl, 96 vCPUs | - |
| 45 | X8aedz up to 96 vCPUs and 3,072 GiB, for EDA and large-memory databases | ec2AmdPage | CONFIRMED | "ranging from 2 to 96 vCPUs with 64 to 3,072 GiB of memory ... ideal for electronic design automation (EDA) workloads ... and relational databases that benefit from high single-threaded processor performance and large memory footprint" | - |
| 46 | Hpc8a: one size, hpc8a.96xlarge, 9R45, 192 cores, 768 GiB, 300 Gbps EFA | ec2HpcSpecs | CONFIRMED | Only size listed is hpc8a.96xlarge; row "768.00 AMD EPYC 9R45 192 192 1"; network "300 Gigabit", EFA "Yes" | - |
| 47 | All six families on Nitro v6 | ec2*Specs, ec2HpcSpecs | CONFIRMED | Hypervisor column "Nitro v6" for M8a, M8azn (gp), C8a (co), R8a, X8aedz (mo), Hpc8a (hpc) | - |
| 48 | EPYC 9005 pages list DDR5 as the memory type | epyc9755Page | CONFIRMED | "System Memory Type DDR5" | - |
| 49 | Xeon 6 6900P takes MRDIMM at up to 8,800 MT/s | xeon6ProductBrief | UNSUPPORTED (SKU level) | The brief ties MRDIMM to the whole P-core family, not to the 6900P: "MRDIMMs ... expected data transfer rate of up to 8,800 megatransfers per second (MT/s)", under "Intel Xeon 6 processors with Performance-cores". ARK 6980P (live): "Memory Types DDR5(6400MT/s) MRDIMM(8800MT/s)" | Added xeon6980pArk record (copied from MainMemoryAndCxl.ts; accessed 2026-10-23) and cite |
| 50 | Xeon 6 carries AMX | m8iPage | CONFIRMED | "Intel Xeon 6 processors offer enhanced built-in accelerators such as Advanced Matrix Extensions (AMX)" | - |
| 51 | Venice: Zen 6, TSMC 2 nm, 256 cores / 512 threads, 16 DDR5 channels, MRDIMM up to 12,800 MT/s, PCIe Gen 6 (roadmap) | amdVeniceBlog | CONFIRMED | "Built on the 'Zen 6' core architecture and TSMC's advanced 2 nm process technology ... up to 256 cores and 512 threads per socket, up to 16 channels of DDR5 memory, JEDEC-standard MRDIMM support up to 12,800 MT/s, and PCIe® Gen 6 connectivity" | - |
| 52 | "announced by AMD ... The announcement gives no ship date" | amdVeniceBlog | WRONG (stale) | Newsroom, September 18, 2026: ""Venice" is in production today. Major OEM platforms are on track to launch, and leading cloud providers will begin deploying them later this year." | Aligned to AMD's wording; added amdAgenticStack |
| 53 | SDCI moves PCIe data straight into L2, skips the memory write and read back, coherent | amdTurinArchWhitepaper | CONFIRMED | "moves data directly from a PCIe endpoint into the L2 cache, avoiding an initial write into main memory and then a read by the CPU into its cache ... maintains memory and cache coherency" (p. 10) | - |
| 54 | Lands in L2 of the application's core; NIC writes TPH steering tags | amdSdciWhitepaper | CONFIRMED | "route the ingress Ethernet traffic directly into the L2 cache of the CPU core that is executing the user application"; "the NIC will write TPH steering tags in PCIe TLPs so the CPU can steer ethernet data" (p. 1 to 2) | - |
| 55 | 55 to 76 ns (6.1 to 7.4%), 9575F, Solarflare X4, eflatency / Onload TCP / Onload UDP, 0 to 648 B (vendor-claim) | amdSdciWhitepaper | CONFIRMED | "Eflatency: 55ns (6.1%)", "Onload-TCP: 67ns (6.1%)", "Onload-UDP: 76ns (7.4%) average reduction in latency for 0 to 648B"; "CPU - AMD EPYC 9575F" (p. 2) | - |
| 56 | h2: "set up a server to get AMD's 55 to 76 ns" | amdSdciWhitepaper | UNSUPPORTED (as phrased) | The source gives a reduction ("average reduction in latency"). The h2 could be read as an absolute latency | Changed to "the 55 to 76 ns latency cut AMD measured" |
| 57 | Pre-release BIOS; CPU, BIOS, NIC and driver must all support it; pin the thread; measure with eflatency and sfnt-pingpong | amdSdciWhitepaper | CONFIRMED | "Custom BIOS version 5.35 (pre-release)"; SDCI REQUIREMENTS list; "finally pinning the application to the desired CPU core"; "Latency performance is measured with eflatency and sfnt-pingpong" (p. 1, 3) | - |
| 58 | Linux 6.13 adds PCIe TPH; `CONFIG_PCIE_TPH`; `pci=notph` turns it off system-wide | linuxTph, linuxNotphParam | CONFIRMED | tph.c present at v6.13 ("TPH (TLP Processing Hints) support"), HTTP 404 at v6.12. Kconfig v6.13 "config PCIE_TPH". kernel-parameters.txt v6.13 lines 4689 to 4692: "notph ... disable PCIe TLP Processing Hints support system-wide" | - |
| 59 | bnxt at v6.19 enables TPH and programs steering tags | linuxBnxtTph | CONFIRMED | bnxt.c v6.19 line 11698 "rc = pcie_enable_tph(bp->pdev, PCI_TPH_ST_IV_MODE);"; `pcie_tph_set_st_entry` at 11589, 11748 | - |
| 60 | io_alloc from Linux 6.19, backed by SDCIAE; states; `echo 1`; `io_alloc_cbm` per L3; takes the highest CLOSID | linuxResctrl | CONFIRMED | v6.19: ""disabled" ... "enabled" ... "not supported""; "# echo 1 > /sys/fs/resctrl/info/L3/io_alloc"; "On AMD systems, io_alloc feature is supported by the L3 Smart Data Cache Injection Allocation Enforcement (SDCIAE) ... the highest CLOSID is dedicated to io_alloc and no longer available for general (CPU) cache allocation". v6.18: 0 matches for io_alloc | - |
| 61 | "No AWS documentation of SDCI or TPH on EC2 instances was located during this research" | none (scoped hedge) | CONFIRMED (scope kept) | Re-searched 2026-10-23 on aws.amazon.com and docs.aws.amazon.com: no page names SDCI or TPH | - |
| 62 | SVG: 16 CCDs of 8 cores / 32 MB L3, one GMI link each, IO die 6 nm, four NPS4 quadrants of "3 memory controllers, 4 CCDs", four "3 x DDR5 channels", legend 45 / 150 / 260 ns on a 9575F | amdTurinArchWhitepaper, chipsAndCheeseTurin | CONFIRMED | As #1, #3, #11, #12, #20 to #22, #29; "the I/O die remains at 6nm" (p. 5) | - |

Pinned refs: all four GitHub URLs are pinned to release tags (`v6.13`, `v6.19`). git.kernel.org
resolves both tags. The `#L4689-L4692` and `#L11698` anchors point at the cited lines. There are
no Hugging Face links. CONFIRMED.

Tiers: every record matches the tier the same URL has in other files, with one exception. The
M8i page is Tier 2 here and in MainMemoryAndCxl.ts but Tier 1 in HeterogeneityFact.ts and
IntelXeon6.ts (see "For the orchestrator"). Vendor performance figures (45%, 55 to 76 ns) carry
`vendor-claim`. Venice figures and status carry `roadmap`.

## ORCH-NOTES items

ORCH-NOTES.md has no AmdEpycTurin entry. The items from the dispatch prompt and the coordinator
message:

- **EPYC 9006 (Venice) status: WRONG (stale), fixed.** AMD Newsroom, 2026-09-18 (Wayback capture
  2026-10-05), reads: ""Venice" is in production today. Major OEM platforms are on track to
  launch, and leading cloud providers will begin deploying them later this year." "announced by
  AMD" and "The announcement gives no ship date" are now: "EPYC 9006 is in production; AMD says
  major OEM platforms are on track to launch and cloud providers will begin deploying it later in
  2026." This is the same wording as *DDR5, MRDIMM, LPDDR5X and CXL*. It cites `amdAgenticStack`,
  a record identical to the one in MainMemoryAndCxl.ts (same title, publisher, URL, tier 2,
  accessed 2026-10-23), with kind `roadmap`. The only date written is "later in 2026", AMD's
  "later this year" in a release dated 2026-09-18. The Venice spec figures keep `roadmap`.
- **Turin figures: CONFIRMED (claims #1 to #18, #26 to #47).**
  - Core counts: 128 Zen 5 and 192 Zen 5c.
  - CCDs: 16 of 8 cores, or 12 of 16 cores; 32 MB L3 each.
  - Memory: 12 DDR5 channels; 614 GB/s per socket (12 x 6,400 MT/s x 8 B = 614.4 GB/s).
  - PCIe 5.0 lanes: 128 on one socket, 160 on two; CXL 2.0.
  - NPS modes: NPS1 guidance, NPS4 quadrants, NPS0 across two sockets.
  - AVX-512: full 512-bit data path, with the BIOS option to split it into two 256-bit passes.
  - EC2 families: M8a, C8a, R8a and Hpc8a run the EPYC 9R45; M8azn and X8aedz run the EPYC 9R05,
    all on Nitro v6. The figures for each family match the spec pages.
  - On DDR5-6000 vs 6400: the section never states DDR5-6000. The data sheet gives 6400 as the
    one-DIMM-per-channel maximum. The 9755 page makes 6400 depend on OEM enablement. Chips and
    Cheese measured its 9575F against a 576 GB/s ceiling, which is 12 x 6,000 x 8. The
    architecture white paper's Turin benchmark configs use "12x DDR5-6000".
  - One SERDES statement was WRONG (#17) and is fixed.
- **DDR5-6400 qualifier (coordinator): CONFIRMED, scoped further.** The section already carried
  the OEM-enablement wording from the EPYC 9755 page (Wayback capture 2026-06-18): "DDR5-6400
  support requires OEM enablement and a BIOS update". The page's other qualifier is "for
  targeted customers and configurations". The sentence put 6 TB right next to DDR5-6400, but
  6 TB is a two-DIMMs-per-channel figure and 6400 is a one-DIMM-per-channel speed (data sheet
  column heads). Each figure is now tied to its DIMM population, and OEM is expanded at its first
  use.
- **GitHub pins: CONFIRMED.** See "Pinned refs" above.

## Fixes applied

- `src/sections/AmdEpycTurin.tsx:138-145` (intro).
  - Before: "Each socket takes up to 6 TB of DDR5 on 12 channels [ds]; at DDR5-6400 that is 614
    GB/s per socket, and DDR5-6400 needs OEM enablement and a BIOS update."
  - After: "Each socket takes up to 6 TB of DDR5 on 12 channels at two DIMMs per channel [ds,
    note on the 2DPC / 1DPC columns]; at one DIMM per channel and DDR5-6400 that is 614 GB/s per
    socket, and DDR5-6400 needs OEM (original equipment manufacturer) enablement and a BIOS
    update."
- `src/sections/AmdEpycTurin.tsx:201-203` (Topology).
  - Before: "..., 160 in a two-socket server, each block usable for PCIe, CXL (Compute Express
    Link) 2.0 or the link to the other socket."
  - After: "..., 160 in a two-socket server. The blocks carry PCIe, the link to the other socket
    or up to 64 lanes of CXL (Compute Express Link) 2.0, and not every block supports every
    function."
- `src/sections/AmdEpycTurin.tsx:376-382` (Workload fit).
  - Added `<Cite s={S.xeon6980pArk} note="Xeon 6980P memory types: DDR5 6400 MT/s, MRDIMM 8800
    MT/s." />` after the product-brief cite for "Xeon 6 6900P takes MRDIMM at up to 8,800 MT/s".
- `src/sections/AmdEpycTurin.tsx:390-396` (Workload fit).
  - Before: "EPYC 9006 (Venice), announced by AMD, adds ... [venice, roadmap] The announcement
    gives no ship date."
  - After: "EPYC 9006 (Venice) adds ... [venice, roadmap] EPYC 9006 is in production; AMD says
    major OEM platforms are on track to launch and cloud providers will begin deploying it later
    in 2026. [amdAgenticStack, roadmap]"
- `src/sections/AmdEpycTurin.tsx:405` (SDCI h2 description).
  - Before: "... and set up a server to get AMD's 55 to 76 ns".
  - After: "... and set up a server to get the 55 to 76 ns latency cut AMD measured".
- `src/sources/AmdEpycTurin.ts`: two records added.
  - `amdAgenticStack`, identical to MainMemoryAndCxl.ts: tier 2, accessed 2026-10-23.
  - `xeon6980pArk`: same title, publisher, URL and tier 1 as MemoryHierarchyPrimer.ts and
    MainMemoryAndCxl.ts; accessed 2026-10-23, the date I fetched it.
- `src/components/EpycTurinTopology.tsx`: unchanged. A grep confirms only AmdEpycTurin.tsx
  imports it.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "AmdEpycTurin|EpycTurinTopology|sources/AmdEpycTurin"`:
  no matches ("no type errors in my files").
- `pnpm exec eslint src/sections/AmdEpycTurin.tsx src/sources/AmdEpycTurin.ts src/components/EpycTurinTopology.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t AmdEpycTurin`: 1 passed, 34 skipped.
- `no-ai-tells.sh` exit 0, `svg-a11y.sh` exit 0, `pinned-refs.sh` exit 0, `pre-overflow.sh`
  exit 0. None of them reports a hit in my files.
- Full `vitest run src/__tests__`: 880 passed, 1 failed. The failure is `sources.test.ts > keeps
  sources.md in sync with the registry`. Its whole diff is the "used by" column gaining
  AmdEpycTurin on the two records added here (Xeon 6980P ARK and AMD Newsroom 2026-09-18).
  sources.md belongs to the orchestrator and needs regenerating.
- Diagram unchanged, so no rebuild or shoot. The prose edits sit in normal wrapped text boxes.

## For the orchestrator

- **Regenerate `sources.md`.** The sync test fails only because `xeon6980pArk` and
  `amdAgenticStack` now also list AmdEpycTurin.
- **Tier conflict on `https://aws.amazon.com/ec2/instance-types/m8i/`.** It is Tier 2 in
  AmdEpycTurin.ts and MainMemoryAndCxl.ts and Tier 1 in HeterogeneityFact.ts and IntelXeon6.ts.
  It is an instance product page, which the authoring brief grades Tier 2. Align HeterogeneityFact
  and IntelXeon6 to Tier 2.
- **For information, no change made:** the EPYC 9755 SKU page is Tier 1 in all five files that
  cite it. It is a product page, but its content is a specification table. Tier 1 is defensible
  and consistent, so I left it.
- **Glossary:** this section now expands OEM. The glossary already carries it if *DDR5, MRDIMM,
  LPDDR5X and CXL* added it; nothing new otherwise.

## Backlog

- Note the DDR5-6000 operating point that AMD's own Turin benchmark configs and the Chips and
  Cheese 9575F tests use, beside DDR5-6400 (enhancement, not a correction).
- The Hot Chips, Strix Point and NPS0 articles are Tier 3. An AMD Zen 5 optimization guide
  citation for the 124-miss and L2-associativity figures would raise them to Tier 1.
