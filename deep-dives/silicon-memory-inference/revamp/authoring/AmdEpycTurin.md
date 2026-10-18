# Change report: AmdEpycTurin (nav id `epyc-turin`)

Register: `research/2026-10-refresh/03-aws-cpus.md`, section 0 and section 4
(claims A1 to A45, N17 to N19, Recommended edits 1 to 9). 2026-08-01 audit:
`docs/verification/2026-08-01/P3-silicon-numbers.md` sections 7 (Turin latencies are Tier 3)
and 8 (no Turin item; nothing further to apply).

Files: `src/sections/AmdEpycTurin.tsx`, `src/components/EpycTurinTopology.tsx`,
`src/sources/AmdEpycTurin.ts` (new, 22 records).

Status: COMPLETE. All nine Recommended edits applied.

Shared records reused with identical URL, title, publisher and tier: `amdSdciWhitepaper`
and `chipsAndCheeseTurin` (CapitalMarketsLens.ts), `m8iPage` (HeterogeneityFact.ts),
`ec2GeneralPurposeSpecs`, `ec2ComputeOptimizedSpecs`, `ec2MemoryOptimizedSpecs`
(GravitonDeepDive.ts). Register tiers kept: T1-33, T1-34, T1-35, T1-36, T1-37, T1-38,
T1-39 are Tier 1; T2-11, T2-12, T2-14, T2-15 Tier 2; T3-2, T3-3, T3-4 Tier 3.

## Fetched during authoring (records carry 2026-10-17)

- AMD 5th Gen EPYC architecture white paper (T1-35, PDF text): "up to 16 of which can be
  configured", "Up to 12 of these CCDs", "In high-core-count processors, a single connection
  is used ... In some processor models, two connections can be used"; "In
  memory-speed-optimized EPYC 9005 Series processors two links connect to each CPU die";
  "BIOS settings can direct the processor to execute two 256-bit vectors in sequential clock
  cycles for AVX-512 instructions"; NPS4 quadrant "six DIMMs feed into three memory
  controllers, which are closely connected via Infinity Fabric (GMI) to a set of up to four
  'Zen 5', or up to three 'Zen 5c' CPU dies"; "most applications don't need to be concerned
  about using NUMA domains, and using the AMD EPYC processor as a single domain (NPS=1) gives
  excellent performance"; Figure 8 caption "four NUMA domains can give small performance
  improvements for some applications"; benchmark footnote "BIOS Options: SMT=Off NPS=4";
  "the 16-core EPYC 9175F uses 16 CPU dies, each with one core per die active"; and
  "SMART DATA CACHE INJECTION: This feature moves data directly from a PCIe endpoint into the
  L2 cache, avoiding an initial write into main memory ... maintains memory and cache
  coherency". This last quote is a reachable Tier 1 replacement for the gated #58725 PDF
  (A28) and independently confirms L2 (A29). It also states the GMI name: "Global Memory
  Interface [GMI]".
- AMD EPYC 9005 data sheet (T1-34, PDF text): rows for 9965, 9755, 9575F (64 cores, 3.30 /
  5.00 GHz, 256 MB), 9355P (1P), 9175F (16 cores, 5.00 GHz, 512 MB); "12/6TB"; "128 PCIe Gen
  5 I/O lanes (up to 160 in 2-socket servers)".
- AMD EPYC 9755 product page (T1-33): "Per Socket Mem BW 614 GB/s"; "System Memory Type
  DDR5"; "DDR5-6400 support requires OEM enablement and a BIOS update".
- AMD Solarflare X4 SDCI white paper (T2-14, PDF text): L2 of the core running the
  application; TPH steering tags; eflatency 55 ns (6.1%), Onload-TCP 67 ns (6.1%),
  Onload-UDP 76 ns (7.4%) at 0 to 648 B; EPYC 9575F; "Custom BIOS version 5.35
  (pre-release)"; SDCI REQUIREMENTS (CPU, TPH-capable Solarflare adapter, Linux driver, BIOS
  that enables SDCI); "finally pinning the application to the desired CPU core".
- AMD Venice blog (T2-15): Zen 6, TSMC 2 nm, 256 cores / 512 threads, 16 DDR5 channels,
  JEDEC-standard MRDIMM up to 12,800 MT/s, PCIe Gen 6. No ship date in the sentences
  extracted.
- Linux at tags: `resctrl.rst` v6.19 (io_alloc states, enable command, SDCIAE backing,
  highest-CLOSID cost; SDCIAE has no /proc/cpuinfo flag), absent at v6.18 (0 matches);
  `cpufeatures.h` v6.19 (`X86_FEATURE_SDCIAE`); `drivers/pci/tph.c` HTTP 200 at v6.13, 404 at
  v6.12; `kernel-parameters.txt` v6.13 lines 4689-4692 (`pci=notph`); `bnxt.c` v6.19
  (`pcie_enable_tph` at line 11698, `pcie_tph_set_st_entry`).
- EC2 spec pages gp/co/mo/hpc (T1-29, T1-38), parsed: m8a/c8a/r8a/hpc8a "AMD EPYC 9R45",
  m8azn/x8aedz "AMD EPYC 9R05", all "Nitro v6" in the Hypervisor column, 1 thread per core;
  m8a.48xlarge 192 vCPU / 192 cores; m8azn.24xlarge 96; x8aedz.24xlarge 3,072 GiB;
  hpc8a.96xlarge 192 cores, 768 GiB, 300 Gigabit, EFA yes.
- M8a launch blog (T2-11): "maximum frequency of 4.5GHz"; "Each vCPU on an M8a instance
  corresponds to a physical CPU core, meaning there is no simultaneous multithreading (SMT)";
  "45% more memory bandwidth compared to M7a"; no DDR5 speed (confirms A36).
- AWS and AMD page (T2-12): M8a, C8a, R8a at 4.5 GHz; M8azn and X8aedz 5 GHz; X8aedz "2 to
  96 vCPUs with 64 to 3,072 GiB", EDA and relational databases; Hpc8a 300 Gbps EFA.
- Chips and Cheese (T3-2, T3-3, T3-4, re-read): 45 / 150 / 260 ns on 9575F; 9575F "has
  GMI3-W ... 2 GMI links"; NPS0 test system "2 AMD EPYC 9575Fs", "over 220 ns ... nearly 90
  ns penalty over the EPYC 9355P running in NPS1", "bandwidth advantage from bringing twice
  as many memory controllers into play"; Hot Chips: L1D "50% capacity and associativity
  increase while maintaining a 4-cycle load-to-use latency", "L2 associativity has gone up",
  124 vs 24 outstanding misses.
- NEW Tier 3 record, Chips and Cheese "AMD's Strix Point: Zen 5 Hits Mobile": "increasing
  associativity from 8-way to 16-way". Added because T3-4 says only that L2 associativity
  "has gone up", which cannot carry the "doubled" wording in the orchestrator note. Labelled
  in the popover as the mobile Zen 5.
- Two web searches (2026-10-17) for SDCI or TPH on AWS, EC2 or Nitro: no AWS result. Backs
  the scoped hedge "No AWS documentation of SDCI or TPH on EC2 instances was located during
  this research".

## Word count

Counter `/tmp/epyc-tools/wc.mjs` (copy of `/tmp/kl-tools/wc.mjs`: rendered `main` at 1440,
all disclosures open, Cite badges, SVG text and code excluded): **1,096 before, 1,364 after
(+24%)**. A first full draft reached 1,604 and was cut back. Per block (after): intro 237,
Topology 118, Latency and NUMA modes 252, SKU lineup 147, EPYC Turin on AWS 163, Workload
fit 111, SDCI 345.

Reasons for growth above 20%, per added block:
- AWS card (+90): register NEW N18 (X8aedz, Hpc8a) and N19 (Nitro v6), plus edit 7's 4.5
  GHz and no-SMT sizing fact.
- Venice paragraph (+45): register NEW N17, edit 8.
- NPS paragraph (+50 over the old alert): edit 5 requires leading with AMD's NPS1 guidance
  and fixing the NPS0 definition; it now carries the NPS4 quadrant model and the NPS0 cost.
- SDCI checklist (net +15 over the old SDCI block): edit 6 and the orchestrator's
  instruction to end on the reader's next action. The old LWN/APM paragraph and the kernel
  alert were folded into it.
Cuts that paid for it: "What did not change" block, Venice-X, the "biggest Zen generation"
line, the process-node sentence, Genoa DDR5-4800, the "Where Turin wins" list (each item
was a duplicate of a fact stated elsewhere), the SDCIAE prose paragraph, the "kernel does
not move bytes" line.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| A1 | "12 CCDs around an IO die" (header, SVG) | "up to 16 Zen 5 CCDs of 8 cores, 128 in all, or up to 12 Zen 5c CCDs of 16, 192 in all"; SVG draws the 16-CCD form, header line notes the Zen 5c form | amdTurinArchWhitepaper (T1, spec) |
| A3 | "Native 512-bit AVX-512 datapath" | kept, plus the BIOS setting that splits AVX-512 into two 256-bit passes, and "check that setting before comparing AVX-512 results" | amdTurinArchWhitepaper (T1, spec) |
| A5 | "L1D doubled to 48 KB / 12-way" | "48 KB, 50% larger, still 4 cycles load to use" | chipsAndCheeseZen5HotChips (T3), amdTurinArchWhitepaper (T1) |
| A6 | "L2 doubled to 1 MB / 16-way" | "1 MB per core, 16-way instead of 8-way for a higher hit rate at the same size" | amdTurinArchWhitepaper (T1); chipsAndCheeseStrixPoint, chipsAndCheeseZen5HotChips (T3) |
| A7, A14 | "16 GMI ports (two per CCD via GMI3-Wide)"; "GMI3-Wide doubled CCD-to-IOD bandwidth"; "64 bytes/cycle bidirectional" | "16 GMI links: one per CCD on high-core-count parts, two per CCD on the memory-speed-optimized parts. That two-link form is GMI3-Wide, which the EPYC 9575F uses." No bandwidth figure | amdTurinArchWhitepaper (T1); chipsAndCheeseTurin (T3) |
| A8 | "max DDR5 speed jumped from 4800 to 6400" | "12 channels; at DDR5-6400 that is 614 GB/s per socket, and DDR5-6400 needs OEM enablement and a BIOS update" | epyc9755Page (T1, spec) |
| A9 | "24 to 124 (5.2x memory-level parallelism)" | "124 in flight per core, up from 24", Tier 3 badge, popover says C&C cites AMD's guide | chipsAndCheeseZen5HotChips (T3) |
| A12, A13, A45 | IO die "TSMC 6 nm", "12 UMC", "PCIe 5 / xGMI / CXL 2.0" | "IO die, 6 nm" (SVG); "12 DDR5 memory controllers, one per channel"; SERDES usable for PCIe, CXL 2.0 or the link to the other socket | amdTurinArchWhitepaper (T1) |
| A15 | "8 combo I/O links (16 lanes each at 32 GT/s ...)" | "eight 16-lane SERDES blocks give 128 PCIe 5 lanes per socket, 160 in a two-socket server" | amdTurinArchWhitepaper, epyc9005Datasheet (T1) |
| A18 | latency table L1D 4 cycles (~0.8 ns), L2 ~14 cycles, L3 ~46 cycles | L1D 4 cycles only, basis "AMD design figure"; L2/L3 rows and ns conversions dropped | chipsAndCheeseZen5HotChips (T3) |
| A19 | "DRAM (NPS1) ~130-140 ns" | "about 130 ns", basis "Derived, EPYC 9355P", popover shows the arithmetic | chipsAndCheeseNps0 (T3, derived) |
| A20 | "NPS0 (uniform interleave across all 12 channels with no NUMA partitioning) >220 ns ... about 90 ns over NPS1" | "NPS0 makes a two-socket server one node, spreading accesses over every channel on both sockets: more bandwidth, and DRAM latency over 220 ns on two EPYC 9575F, nearly 90 ns above an EPYC 9355P in NPS1" | chipsAndCheeseNps0 (T3, measured) |
| A21 | 45 / 150 / 260 ns, no tier marker | each row badged Tier 3 measured with SKU in a Basis column; footnote "Chips and Cheese measurements on the named SKUs, not AMD specifications" | chipsAndCheeseTurin (T3, measured) |
| A23 | "For latency-sensitive workloads NPS4 is the default choice; for general workloads NPS1 (default)" | leads with "AMD's guidance is that most applications run well with the socket as one domain, NPS1"; NPS4 "gives small gains for applications that tie their memory to the nearest cores"; NPS is a BIOS setting | amdTurinArchWhitepaper (T1) |
| A24, A26, A27 | SKU table 9755 / 9965 / 9355P with CCD layout and notes | table SKU / Cores / L3 / Max boost / L3 per core for 9965, 9755, 9575F, 9355P (one socket only), 9175F; no per-SKU CCD layout | epyc9005Datasheet (T1, spec; L3 per core derived) |
| A28 | quote from AMD White Paper #58725 (gated) | SDCI definition from the reachable architecture white paper | amdTurinArchWhitepaper (T1) |
| A29 | "placed directly into the L3 of the target CCX" | "moves data ... straight into the L2 cache"; "On Zen 5 the data lands in the L2 of the core running the application"; SDCIAE described as bounding the L3 share | amdTurinArchWhitepaper (T1); amdSdciWhitepaper (T2); linuxResctrl (T1) |
| A30 | "TPH plumbing landed in Linux 6.13 (late 2024)" | "Linux 6.13 or later, which adds PCIe TPH support", plus `CONFIG_PCIE_TPH` and `pci=notph` | linuxTph, linuxNotphParam (T1, code at tag) |
| A31 | "AMD64 APM Volume 2 §19.4.7" and the L3_MASK_n quote (LWN link) | SDCIAE named via the kernel's resctrl documentation at v6.19 | linuxResctrl (T1) |
| A32 | "kernel surface lands in Linux 6.19", io_alloc, io_alloc_cbm | kept as checklist step 5 with the read, enable and mask steps and the CLOSID cost | linuxResctrl (T1) |
| A33 | "initial driver consumer demonstrated by AMD is the Broadcom BNXT network driver" | "In mainline Linux at v6.19, the Broadcom bnxt driver enables TPH and programs steering tags" | linuxBnxtTph (T1, code at tag) |
| A34 | "a real wall-clock improvement at the tier where it matters" | "AMD measured 55 to 76 ns (6.1 to 7.4%) lower average latency ... EPYC 9575F with a Solarflare X4 ... eflatency, Onload TCP and Onload UDP at 0 to 648-byte payloads", vendor-claim badge, plus "The test system ran a pre-release BIOS" | amdSdciWhitepaper (T2, vendor-claim) |
| A35 | M8a / R8a / C8a "Built on Turin (Zen 5)" | "All three run the AMD EPYC 9R45 at up to 4.5 GHz. Each vCPU is a physical core with no SMT, so a 192-vCPU m8a.48xlarge has 192 cores"; "AWS cites 45% more memory bandwidth for M8a than M7a" | ec2*Specs (T1), ec2AmdPage (T2), m8aLaunchBlog (T2; 45% vendor-claim) |
| A38 | "M8azn ... 5 GHz boost" | "M8azn, X8aedz: both run the AMD EPYC 9R05 at up to 5 GHz"; M8azn up to 96 vCPUs | ec2GeneralPurposeSpecs, ec2MemoryOptimizedSpecs (T1), ec2AmdPage (T2) |
| A40 | generic EC2 instance-types link | per-family specification pages | ec2*Specs, ec2HpcSpecs (T1) |
| A42 | "up to 6 TB DRAM per socket" | moved to the intro: "up to 6 TB of DDR5 on 12 channels" | epyc9005Datasheet (T1) |
| A43 | "4 MB / core or 2 MB / core" | carried by the SKU table's L3-per-core column (4 MB on 9755, 2 MB on 9965) | epyc9005Datasheet (T1, derived) |
| A44 | "MRDIMM (use Xeon 6 6900P)", "AMX (Intel-only)" | "the EPYC 9005 pages list DDR5 as the memory type, while Xeon 6 6900P takes MRDIMM at up to 8,800 MT/s"; "AMX tiles, which Xeon 6 carries"; Venice paragraph directly after | epyc9755Page (T1), xeon6ProductBrief (T1), m8iPage (T2) |
| (cross-ref) | "Section 30 covers the tick-to-trade pipeline" | "the receive stage of the tick-to-trade path in Capital Markets Lens" | internal |

CORRECT claims kept and re-cited: A2, A3, A12, A13, A15, A17 (8 or 16 cores plus 32 MB L3
per CCD, in the intro and on every SVG CCD), A21, A24, A26, A30, A32, A37 (M8a / C8a / R8a
as the AMD 8th generation; the "replacing M7a" framing survives only as the 45% vs M7a
claim), A38, A42, A45.

## Claims removed and why

- A4 "(Zen 4 had double-pumped 256-bit)": UNKNOWN, no Tier 1 source.
- A10 second half (AMD "waiting for full JEDEC standardization"): UNKNOWN. The first half
  survives as "the EPYC 9005 pages list DDR5 as the memory type".
- A11 Turin-X / "Venice-X (2026)": UNKNOWN; replaced by the Venice roadmap paragraph.
- A16 CCD process nodes (4 nm / 3 nm): CORRECT, cut for length; it changes no reader
  decision. The 6 nm IO die stays in the SVG.
- A18 L2 ~14 cycles and L3 ~46 cycles: UNKNOWN for Turin. The Strix Point article does give
  L2 14 cycles, but a mobile-part latency in a Turin table mixes products, so the rows went.
- A22 NPS2 and L3CAN: not in any fetched source; dropped.
- A25 "650 MB total cache": CUT candidate (edit 9).
- A27 9355P "8 CCDs x 4 Zen 5": CCD count per SKU is not published; dropped with the
  layout column.
- A36 "DDR5-6400 host memory" on M8a/R8a/C8a: UNKNOWN, AWS states no speed (re-checked).
- A39 "FPGA-host": UNKNOWN.
- A41 "~261 GB/s per core": CUT candidate, unsourced (edit 9).
- Genoa DDR5-4800 comparison (A8 second half): CORRECT but history; cut for length.
- Unsourced framing: "the biggest Zen generation since Zen 2", "Density flagship", "High
  clock per core", "Infinity Fabric mesh", "The kernel does not move bytes, the hardware
  does", "HFT-scale workloads", the APM section number, the LWN link, "(late 2024)".
- "Where Turin wins" list: every item duplicated a fact already on the page (AVX-512 in the
  intro, 192 cores in the intro and table, 6 TB moved to the intro, L3 per core in the
  table, 5 GHz in the AWS card). The cross-CCD bullet's point lives in the latency guidance.

## UNKNOWNs and how the page handles them

- A4, A10 (JEDEC statement), A11, A18 (L2, L3 cycles), A22, A31 (APM text), A36, A39, A41:
  removed.
- A19: shown as derived ("about 130 ns", Basis "Derived, EPYC 9355P", arithmetic in the
  popover).
- A28: replaced by a reachable Tier 1 source with the same definition.
- A34: the adjective is replaced by AMD's vendor-claim figures.
- SDCI on EC2 (not in the register): scoped hedge, "No AWS documentation of SDCI or TPH on
  EC2 instances was located during this research", based on two searches on 2026-10-17.
- Venice ship date: "The announcement gives no ship date", scoped to the AMD blog.

## NEW content and its sources

- N17 Venice (EPYC 9006) roadmap paragraph: amdVeniceBlog (T2, roadmap).
- N18 X8aedz (EPYC 9R05, 5 GHz, up to 96 vCPUs and 3,072 GiB, EDA and large-memory
  databases) and Hpc8a (hpc8a.96xlarge, EPYC 9R45, 192 cores, 768 GiB, 300 Gbps EFA):
  ec2MemoryOptimizedSpecs, ec2HpcSpecs (T1), ec2AmdPage (T2).
- N19 Nitro v6 for all six families, with a cross-reference to Isolation: NIE and MIG:
  ec2*Specs, ec2HpcSpecs (T1).
- SKU rows 9575F (the SKU behind every measured latency) and 9175F (register A27 optional
  NEW, 16 CCDs with one core each): epyc9005Datasheet, amdTurinArchWhitepaper (T1).
- NPS4 quadrant model (three memory controllers, up to four Zen 5 or three Zen 5c CCDs), in
  the NPS paragraph and drawn in the SVG: amdTurinArchWhitepaper (T1).
- SDCI checklist: four requirements, pre-release BIOS caveat, pinning, measure with
  eflatency and sfnt-pingpong (amdSdciWhitepaper, T2); `CONFIG_PCIE_TPH` and `pci=notph`
  (linuxNotphParam, T1); bnxt TPH code (linuxBnxtTph, T1); io_alloc read and enable steps
  and the CLOSID cost (linuxResctrl, T1).
- AVX-512 BIOS 256-bit setting (register A3 replacement text): amdTurinArchWhitepaper (T1).

## Diagram changes and rendered check

`EpycTurinTopology.tsx` rewritten. Before: `aria-label` only, fixed `height` attribute,
title "up to 12 CCDs", 12 CCDs drawn, "16 GMI ports", em-dashes in SVG text, arrow glyphs,
a caption line inside the viewBox, and GMI lines that crossed CCD labels. The probe flagged
"12 UMC (DDR5) · 16 GMI ports · Infinity Fabric mesh" overflowing the IO-die box at both
widths.

After: `role="img"`, `aria-labelledby="epyc-turin-topology-title"` with a `<title>` that
states the claim (16 CCDs, shared L3, IO die with all 12 controllers, 45 vs 150 ns, NPS4
quadrants); viewBox 800 x 480; full-bleed white background; Idiom A styles with an `ept-`
prefix; fonts 11 to 12 px sans-serif; wrapped in `overflowX: 'auto'` with `minWidth: 640`
per the dive's phone convention. It draws 16 CCDs (8 cores, 32 MB L3 each) above and below
the IO die, one GMI link per CCD, the IO die split into four NPS4 quadrants ("3 memory
controllers, 4 CCDs"), four "3 x DDR5 channels" blocks, CCD 1 outlined green for the
within-CCD case, and an orange CCD 1 to CCD 2 path through the IO die. Legend: about 45 ns
same CCD, about 150 ns CCD to CCD, about 260 ns other socket, measured on an EPYC 9575F by
Chips and Cheese. Every number is cited in the caption below the SVG (amdTurinArchWhitepaper
for layout, chipsAndCheeseTurin measured for the latencies) and again in the latency table.

`shoot.mjs` at 1440 and 390: "1 SVG diagram(s), 0 React Flow, ok" at both widths. No
overlap, box overflow, viewBox clipping or page-level horizontal overflow. Visual read of the
PNGs: at 1440 no text crosses a line, the orange path runs above the quadrant labels, and
the pill label sits in a gap in the dashed dividers. At 390 the diagram scrolls sideways at
640 px, so labels stay at about 9 px instead of shrinking. Both tables scroll inside their
containers. Arrowheads were reduced after the first shot.

## Leverage pass

| Block | What it means to the reader | Model, and whether a diagram carries it | How the reader uses it |
| --- | --- | --- | --- |
| Intro | What Turin is and the one layout fact everything else depends on | "Anything outside a thread's own CCD sits across the IO die"; carried by the topology SVG | Frames every placement decision below; check the AVX-512 BIOS setting; size memory (6 TB, 614 GB/s) |
| Zen 5 core changes (disclosure) | Core deltas, kept behind a disclosure | Supporting evidence | Understanding only |
| Topology | Where memory, I/O and CCDs attach | SVG: dies, links, quadrants, the cross-CCD path | Count PCIe lanes per socket, know which parts get two GMI links |
| Latency and NUMA modes | What each hop costs, measured | 45 / 150 / 260 ns ladder (also in the SVG legend) | Keep sharing threads on one CCD; start at NPS1, use NPS4 only with memory affinity, keep latency work out of NPS0; check with `numactl --hardware` |
| SKU lineup | L3 per core is a SKU choice | 32 MB per CCD at any core count | Choose a SKU by L3 per core and clock |
| EPYC Turin on AWS | Which instance carries which part | none needed | Pick M8azn/X8aedz for clock-bound paths, M8a/C8a/R8a for throughput; a vCPU is a full core |
| Workload fit | What Turin lacks and where it is coming | none needed | Route MRDIMM and AMX work to Xeon 6; watch Venice |
| SDCI | Packets can land in the consuming core's L2 | Steering tag to L2, L3 share bounded by resctrl | Six-step checklist ending in a with/without measurement |

Strongest number: 150 ns across CCDs against 45 ns within one. It is landed in the latency
h2 description, the table, the guidance paragraph ("about three times as much, 150 ns
against 45") and the SVG legend.

Claim-set diff (assertions in the after that were not in the before, each with its source):
1. A BIOS setting can run AVX-512 as two 256-bit passes: amdTurinArchWhitepaper.
2. DDR5-6400 needs OEM enablement and a BIOS update; 614 GB/s per socket: epyc9755Page.
3. L1D 50% larger, still 4 cycles: chipsAndCheeseZen5HotChips.
4. L2 16-way instead of 8-way: chipsAndCheeseStrixPoint.
5. One GMI link per CCD on high-core-count parts, two on memory-speed-optimized parts:
   amdTurinArchWhitepaper; 9575F uses GMI3-Wide: chipsAndCheeseTurin.
6. 160 PCIe lanes in a two-socket server; SERDES blocks usable for PCIe, CXL 2.0 or the
   socket link: epyc9005Datasheet, amdTurinArchWhitepaper.
7. Data between any two CCDs crosses the IO die (SVG): amdTurinArchWhitepaper (CCDs attach
   only through GMI links to the IO die).
8. NPS is a BIOS setting; AMD's NPS1 guidance; NPS4 quadrant composition and small gains:
   amdTurinArchWhitepaper.
9. NPS0 spans both sockets and has a bandwidth advantage: chipsAndCheeseNps0.
10. Cross-CCD exchange about three times the within-CCD cost: chipsAndCheeseTurin (derived).
11. 9575F (64 Zen 5, 256 MB, 5.0 GHz), 9175F (16 Zen 5, 512 MB, 5.0 GHz), boost clocks for
    9965 / 9755 / 9355P, 9355P one socket only: epyc9005Datasheet; 9175F has 16 CCDs with
    one core each: amdTurinArchWhitepaper.
12. EPYC 9R45 / 9R05 per family, one thread per core, m8a.48xlarge 192 cores, M8azn up to 96
    vCPUs, Nitro v6 hypervisor: ec2GeneralPurposeSpecs, ec2ComputeOptimizedSpecs,
    ec2MemoryOptimizedSpecs, ec2HpcSpecs.
13. 4.5 GHz on M8a/C8a/R8a, X8aedz sizes and uses: ec2AmdPage; no SMT and 45% more memory
    bandwidth than M7a (vendor-claim): m8aLaunchBlog.
14. Hpc8a size, cores, memory, 300 Gbps EFA: ec2HpcSpecs.
15. Xeon 6 6900P MRDIMM up to 8,800 MT/s: xeon6ProductBrief.
16. Venice figures (roadmap) and no ship date in the announcement: amdVeniceBlog.
17. SDCI targets L2 and keeps coherency: amdTurinArchWhitepaper; L2 of the application's
    core, TPH steering tags, 55 to 76 ns (vendor-claim), pre-release BIOS, four
    requirements, pinning, eflatency and sfnt-pingpong: amdSdciWhitepaper.
18. `CONFIG_PCIE_TPH` and `pci=notph`: linuxNotphParam. bnxt enables TPH: linuxBnxtTph.
    io_alloc states, enable, mask, CLOSID cost: linuxResctrl.
19. No AWS documentation of SDCI or TPH on EC2 located: own searches, 2026-10-17 (scoped
    hedge, no citation possible).

## Topology facts for Intel Xeon 6 and Chiplet and Interconnect

Copy these as written, with the same source keys:
- Up to 16 Zen 5 CCDs (8 cores each, 128 cores) or up to 12 Zen 5c CCDs (16 cores each, 192
  cores) around one IO die; each CCD's cores share one 32 MB L3 (amdTurinArchWhitepaper, T1).
- IO die: 6 nm, 12 DDR5 memory controllers (one per channel), 16 GMI links. One link per
  CCD on high-core-count parts, two per CCD (GMI3-Wide) on memory-speed-optimized parts
  (T1). The EPYC 9575F is GMI3-Wide (chipsAndCheeseTurin, T3). No GMI bandwidth figure is
  used; "64 bytes/cycle" has no source.
- GMI stands for Global Memory Interface in AMD's white paper.
- Eight 16-lane SERDES: 128 PCIe 5 lanes per socket, 160 in two-socket servers, usable as
  PCIe, CXL 2.0 or socket-to-socket Infinity Fabric (T1).
- Zen 5 L1D 48 KB (+50%), 4 cycles (T3-4 and T1); L2 1 MB per core, 16-way from 8-way
  (chipsAndCheeseStrixPoint, T3); full 512-bit AVX-512 data path, BIOS can split it into two
  256-bit passes (T1).
- DDR5-6400 with OEM enablement and a BIOS update; 614 GB/s per socket (epyc9755Page, T1).
  Turin has no MRDIMM.
- NPS: BIOS setting; AMD recommends NPS1 for most applications; NPS4 quadrant = three memory
  controllers plus up to four Zen 5 or three Zen 5c CCDs (T1). NPS0 spans both sockets of a
  2P system (T3-3).
- Latencies are Chips and Cheese Tier 3 measurements, never AMD specifications: about 45 ns
  same CCD, about 150 ns across CCDs, about 260 ns across sockets (EPYC 9575F); DRAM over
  220 ns in NPS0 on two 9575F, nearly 90 ns above a 9355P in NPS1 (about 130 ns, derived).
- SDCI on Zen 5 targets the L2 of the consuming core (T1 architecture white paper and T2
  X4 white paper). Linux's io_alloc (SDCIAE on AMD) bounds the L3 share, from v6.19.

## For the orchestrator (shared files)

- Glossary, fix: `GMI` fullForm is "Global Memory Interconnect"; AMD's white paper says
  "Global Memory Interface". `NPS` description lists NPS1, NPS2, NPS4; this section uses
  NPS0, NPS1 and NPS4, and NPS2 was not found in the sources fetched.
- Glossary, add: SDCI (Smart Data Cache Injection), SDCIAE (Smart Data Cache Injection
  Allocation Enforcement), TPH (TLP Processing Hints), TLP (Transaction Layer Packet),
  SERDES (serializer-deserializer), CLOSID (class of service ID), SMT (simultaneous
  multithreading), EDA (electronic design automation), NIC (network interface card).
- `sources.md` needs regenerating: the sources test "keeps sources.md in sync with the
  registry" fails only on the new AmdEpycTurin records.
- Cross-section note for REVAMP-PLAN: Turin latencies are T3 on an EPYC 9575F; SDCI on Zen 5
  is L2, not L3; AMD recommends NPS1; Hpc8a and M8a/C8a/R8a are EPYC 9R45, M8azn and X8aedz
  are EPYC 9R05, all on Nitro v6.

## Checks

- `tsc --noEmit`: no errors in my files.
- `eslint` on the three files with `--max-warnings 0`: clean.
- `vitest run src/__tests__/sections.test.tsx -t AmdEpycTurin`: 1 passed.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files (the gates scan and
  report other files).
- Build to `/tmp/silicon-dist-epyc-turin` and `shoot.mjs` at 1440 and 390: ok.
