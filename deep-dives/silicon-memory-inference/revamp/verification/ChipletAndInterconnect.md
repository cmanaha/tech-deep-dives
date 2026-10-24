# Verification: Chiplet and Interconnect

Verified: 2026-10-23. Claims checked: 49 (sampled: 0, every claim verified). Confirmed 45, wrong 1,
unsupported 3, mislabelled 0, unverifiable 0.

All 17 source records were re-read on 2026-10-23. One exception: the AMD EPYC 9755 page
(`epyc9755Page`) refused curl (connection reset) and WebFetch timed out twice. It was read from the
Wayback Machine capture of 2026-06-18 (`web.archive.org/web/20260618055756/...amd-epyc-9755.html`).
The capture from 2026-07-10 is itself an Akamai "Access Denied" page. No request carried personal data.

## Gate 3 score: 8/10

Every number the section leans on matches its source, and the strongest one (about 45 ns inside a
Turin CCD against about 150 ns across CCDs, Tier 3 measured) appears in the diagram, the hop-path
prose, the table and the closing list. The fixes were citation gaps and one loose "double", and none
of them was load-bearing. The score stays below 9 because the Graviton5 node facts are repeated three
times (boundary block, table, closing step 1) and the hop-path caption is a dense run of six
citations. Both are economy issues, not errors.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 45 of 49 confirmed. The one WRONG ("48 and 64 GT/s, double 32 GT/s") and the three UNSUPPORTED (NV-HBI name, uncited Blackwell cell, "CMN joins dies") are fixed. Nothing load-bearing was wrong. |
| Mental model or practical value | 9 | The h1 states the model (cost = sum of boundaries crossed, NUMA node as the handle). The boundary blocks predict where placement matters on each vendor. The table is a lookup, and the closing list gives commands and sizes. The open-standards block gives a mental model (read a package by its die-to-die interface). No block fails both tests. |
| Shape | 8 | Each block introduces its subject before the mechanism, and every h2 description states a payoff. The strongest number lands four times, and the section ends on `numactl` and binding steps. There is no ExpandableSection: the evidence sits in a small-print caption, which reads as dense. |
| Writing | 8 | The no-ai-tells gate passes. Attribution is in links except where it carries weight ("AMD's guidance", "by AWS's claim", the scoped silences). Concepts are defined by what they are. |
| Economy | 8 | The section grew 25% (1,012 to 1,269 words), most of it in the required open-standards block (+168). The Graviton5 "two nodes on 16xlarge and 48xlarge" fact is stated three times. |
| Diagrams | 9 | An inline SVG with role="img", aria-labelledby and a title. Re-shot at 1440 and 390: no overlap or clipping. At 390 it scrolls sideways at 640 px and the labels stay legible. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | h1: Turin built from several dies | amdTurinArchWhitepaper | CONFIRMED | "This core complex is fabricated onto a die (CCD), up to 16 of which can be configured into an EPYC 9005 processor" (p. 5) | - |
| 2 | h1: Xeon 6 built from several dies | chipsAndCheeseXeon6 | CONFIRMED | "The largest Xeon 6 SKUs incorporate three compute dies and two IO dies" | - |
| 3 | Blackwell: two reticle-limited dies, 10 TB/s (h1, boundary block, table) | blackwellArchitecture | CONFIRMED | "two reticle-limited dies connected by a 10 terabytes per second (TB/s) chip-to-chip interconnect" | - |
| 4 | The name "NV-HBI" (boundary block, table), cited only to the architecture page | blackwellArchitecture | UNSUPPORTED | Neither "NV-HBI" nor "High-Bandwidth Interface" appears on the architecture page. The Ultra blog does give it: "NVIDIA High-Bandwidth Interface (NV-HBI)... provides 10 TB/s of bandwidth" | Added a blackwellUltraBlog cite with NvidiaBlackwell's note, in both places |
| 5 | "AWS's processor table lists no die count for Graviton" | gravitonReadme | CONFIRMED | The README at 8b322a4 has rows for cores, L1, L2, LLC, NUMA nodes and DRAM, and no die row | - |
| 6 | 48 KB L1 data, 1 MB L2 per core, 32 MB L3 per CCD (prose, diagram, closing step 4) | amdTurinArchWhitepaper | CONFIRMED | "the 48 KB L1 data cache"; "a dedicated 1MB L2 cache per core and a shared 32MB L3 cache for up to eight cores per die" (p. 8) | - |
| 7 | GMI: one per CCD on high-core-count parts, two on memory-speed-optimized parts; diagram "1 or 2 per CCD" | amdTurinArchWhitepaper | CONFIRMED | "In high-core-count processors, a single connection is used to integrate each CPU die"; "In memory-speed-optimized EPYC 9005 Series processors two links connect to each CPU die" (pp. 7, 10) | - |
| 8 | IO die holds 12 DDR5 memory controllers, one per channel (prose, diagram) | amdTurinArchWhitepaper | CONFIRMED | "DDR5 MEMORY CONTROLLERS - Twelve in the EPYC 9005 Series"; 12 channels on the 9755 page | - |
| 9 | About 130 ns to DRAM in NPS1 on an EPYC 9355P (derived; prose, legend, title) | chipsAndCheeseNps0 | CONFIRMED | "DRAM latency rises to over 220 ns, giving a nearly 90 ns penalty over the EPYC 9355P running in NPS1 mode." 220 - 90 = 130 | - |
| 10 | L1 4 cycles, AMD's design figure (diagram, caption) | chipsAndCheeseZen5HotChips | CONFIRMED | "maintaining a 4-cycle load-to-use latency" (AMD's Hot Chips figure, not a C&C measurement) | - |
| 11 | 51.2 GB/s per channel at DDR5-6400; 12 channels give 614 GB/s (derived) | epyc9755Page | CONFIRMED | "Memory Channels 12"; "Up to 6400 MT/s"; "Per Socket Mem BW 614 GB/s". 6,400 x 8 B = 51.2 GB/s; x 12 = 614.4 | - |
| 12 | "DDR5-6400 needs OEM enablement and a BIOS update" | epyc9755Page | CONFIRMED | "DDR5-6400 support requires OEM enablement and a BIOS update from your server or motherboard manufacturer." (archive 2026-06-18) | - |
| 13 | Core to core about 45 / 150 / 260 ns, EPYC 9575F (table, prose, legend, closing step 3) | chipsAndCheeseTurin | CONFIRMED | "Intra-CCD latency: ~45ns"; "Inter-CCD latency: ~150ns"; "Socket to Socket latency: ~260ns", measured on the 9575F under test ("the 9575F has GMI3-W") | - |
| 14 | AMD guidance NPS1; NPS4 small gains for memory-affine applications | amdTurinArchWhitepaper | CONFIRMED | "using the AMD EPYC processor as a single domain (NPS=1) gives excellent performance"; "four NUMA domains can give small performance improvements for some applications" (p. 12) | - |
| 15 | NPS is a BIOS setting (closing step 1) | amdTurinArchWhitepaper | CONFIRMED | "BIOS Options: ... NPS=4" (benchmark configurations) | - |
| 16 | Up to 16 CCDs of 8 Zen 5 or 12 of 16 Zen 5c, around one IO die; diagram "CCD 1: up to 8 Zen 5 cores", "CCD 2 to CCD 16" | amdTurinArchWhitepaper | CONFIRMED | "up to 16 of which ... up to 128 cores"; "Zen 5c core complex includes up to 16 cores ... Up to 12 of these CCDs" (p. 5) | - |
| 17 | Xeon 6 slices its L3 across mesh stops | chipsAndCheeseXeon6 | CONFIRMED | "Cores share a mesh stop with a CHA ... which incorporates a L3 cache slice and a snoop filter" | - |
| 18 | MDF stops carry the mesh across EMIB, a silicon bridge | chipsAndCheeseXeon6 | CONFIRMED | "Modular Data Fabric (MDF) mesh stops sit at die edges where dies meet"; "physical signals ... run over Intel's EMIB technology, which uses an embedded silicon bridge between dies" | - |
| 19 | L3 and four memory controllers per compute tile | chipsAndCheeseXeon6 | CONFIRMED | "12 memory controllers, or four per compute die"; "backed by the DRAM controllers and L3 cache on their respective compute dies" | - |
| 20 | SNC3, one node per compute tile; three per r8i chip | chipsAndCheeseXeon6 | CONFIRMED | "SNC3 mode is what AWS chose, and is also Intel's default mode"; "divides the chip into three NUMA nodes" | - |
| 21 | r8i 6985P-C: 96 cores, 480 MB L3 | chipsAndCheeseXeon6 | CONFIRMED | "The Xeon 6 6985P-C has 96 Redwood Cove cores"; "providing 480 MB of total L3"; "AWS's r8i instance uses the Xeon 6 6985P-C" | - |
| 22 | r8i: three compute tiles, two IO dies | chipsAndCheeseXeon6 | CONFIRMED | The 6985P-C "falls into that category" of the largest SKUs, which have "three compute dies and two IO dies" | - |
| 23 | L3 hit about 33 ns locally, +24 ns one tile away, nearly 80 ns two away (T3 measured) | chipsAndCheeseXeon6 | CONFIRMED | "just over 33 ns"; "increases latency by about 24 ns"; "nearly 80 ns for a L3 hit" | - |
| 24 | 160 MB per r8i compute tile (closing step 4) | chipsAndCheeseXeon6 | CONFIRMED | "a huge 160 MB pool of L3 cache on its tile" | - |
| 25 | Graviton4: 96 cores per socket, one 36 MB LLC, CMN-700 (table, boundary block) | gravitonReadme | CONFIRMED | "96 per socket (192 for 2-socket 48xlarge)"; "LLC (shared) ... 36MB"; "Interconnect ... CMN-700" | The boundary-block sentence had no citation next to it (the nearest one was the Graviton5 announcement), so a gravitonReadme cite was added |
| 26 | Graviton4: one node, two on the two-socket 48xlarge | gravitonReadme | CONFIRMED | "Memory (NUMA) nodes ... 1 (2 for 48xlarge)" | - |
| 27 | Graviton4: core to core 30 to 60 ns, about 138 ns across sockets (T3 measured) | chipsAndCheeseGraviton4 | CONFIRMED | "a latency of 30-60 ns"; "Crossing socket boundaries brings latency to 138.6 ns on average" | - |
| 28 | Graviton5: 192 cores in one package | graviton5AboutAmazon | CONFIRMED | "192 cores in a single package" | - |
| 29 | Graviton5: CMN-S3 mesh | gravitonReadme | CONFIRMED | "Interconnect ... CMN-S3" | - |
| 30 | Graviton5 LLC 96 MB per node on 24xlarge and 48xlarge, 48 MB on smaller sizes | gravitonReadme | CONFIRMED | "48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)" | - |
| 31 | Graviton5: one node, two on 16xlarge and 48xlarge | gravitonReadme | CONFIRMED | "1 (2 for 16xlarge and 48xlarge)" | - |
| 32 | Graviton5: up to 33% lower inter-core latency, by AWS's claim (T2 vendor-claim) | graviton5AboutAmazon | CONFIRMED | "cutting inter-core communication latency by up to 33%" | - |
| 33 | Choose 24xlarge, or 12xlarge and smaller, for one node | gravitonReadme | CONFIRMED | Follows from row 31. The M9g size list (medium to 12xlarge, 16xlarge, 24xlarge, 48xlarge, metal-48xl) was checked on aws.amazon.com/ec2/instance-types/m9g | - |
| 34 | "No Graviton5 cross-node latency figure was located during this research" | (silence) | CONFIRMED | Neither the README nor the About Amazon post gives one. The hedge keeps its scope | - |
| 35 | Hopper GH100 is one 814 mm2 die | hopperArchBlog | CONFIRMED | "80 billion transistors, a die size of 814 mm2" | - |
| 36 | One CUDA device, L2 shared by both dies with fully coherent access | blackwellUltraBlog | CONFIRMED | "functioning as a single, NVIDIA CUDA-programmed accelerator"; "Shared L2 cache with fully coherent memory accesses" | - |
| 37 | NVLink 5: 1.8 TB/s bidirectional, 900 GB/s each way | blackwellUltraBlog | CONFIRMED | "1.8 TB/s bidirectional (18 links x 100 GB/s)". The halving is in the note, as in NvidiaBlackwell | - |
| 38 | Blackwell crossing cost: "No NV-HBI latency figure in the NVIDIA pages this research read" | none | UNSUPPORTED (the cell had no Cite) | The silence is true: neither the architecture page nor the Ultra blog gives a latency | Cited both pages with a note naming them as the scope of the silence |
| 39 | "Every link above is proprietary: GMI, MDF over EMIB, CMN and NV-HBI join dies that one vendor designed together" | (none) | UNSUPPORTED for CMN | No source says CMN joins Graviton dies. The section itself says the die count is unpublished, and CMN is Arm-licensed on-chip mesh IP | Now "Every die-to-die link above is proprietary: GMI, MDF over EMIB and NV-HBI join dies..." |
| 40 | UCIe is the open standard for the die-to-die physical layer, so one package can mix chiplets from a multi-vendor ecosystem | ucieSpecs | CONFIRMED | "an open industry standard ... covers the die-to-die I/O physical layer"; "mix and match chiplet components from a multi-vendor ecosystem" | - |
| 41 | "UCIe 3.0 runs at 48 and 64 GT/s, double UCIe 2.0's 32 GT/s" | ucieSpecs | WRONG (arithmetic): 48 GT/s is 1.5x | "Support for 48 GT/s and 64 GT/s data rates, doubling the bandwidth of UCIe 2.0 (32 GT/s)" | Now "...48 and 64 GT/s; the top rate doubles UCIe 2.0's 32 GT/s" |
| 42 | OCP HBF base die specifies 16 UCIe channels to its accelerator | ocpSpec | CONFIRMED | "has 16 UCIe channels, each with its own linear local address memory space"; "Support 16 host channels" (v0.7.0, 2026-08-03) | - |
| 43 | UALink Chiplet Specification 1.0, published April 2026, fully compliant with UCIe 3.0 (T1) | ualinkFourSpecs | CONFIRMED | "April 7, 2026"; "UALink Chiplet Specification 1.0 ... Fully compliant with the UCIe 3.0 Specification" | - |
| 44 | NVLink Fusion is a chiplet that hyperscalers drop into their own ASICs | nvlinkFusionTrainium4 | CONFIRMED | "At the core of NVLink Fusion is the NVLink Fusion chiplet"; "Hyperscalers can drop the chiplet into their custom ASIC designs" | - |
| 45 | AWS is designing Trainium4 to integrate with NVLink 6 (roadmap) | nvlinkFusionTrainium4 | CONFIRMED | "AWS is designing Trainium4 to integrate with NVLink 6" (2025-12-02) | - |
| 46 | Diagram legend: 45 / 150 / 130 ns | rows 9, 13 | CONFIRMED | as rows 9 and 13, cited in the caption | - |
| 47 | Diagram: 12 channels, 51.2 GB/s each at DDR5-6400 | rows 8, 11 | CONFIRMED | as rows 8 and 11 | - |
| 48 | Diagram: L1 48 KB 4 cycles, L2 1 MB per core, L3 32 MB | rows 6, 10 | CONFIRMED | as rows 6 and 10 | - |
| 49 | Every source URL carries the same tier as in other sections' files; GitHub URL pinned | all | CONFIRMED | All shared URLs match their tier in other files. The README is pinned to 8b322a4. ucieSpecs appears only here | - |

## ORCH-NOTES items

1. **Reference table: CONFIRMED after one fix.** Every cell now carries a Cite and a tier badge. The
   Blackwell "Crossing cost" cell had none and now cites both NVIDIA pages as the scope of its
   silence. Each row matches its dedicated section:
   - **AMD EPYC Turin:** the same 16 x 8 / 12 x 16 CCDs, 32 MB L3, one or two GMI links, NPS1 guidance
     and NPS4, and 45 / 150 / 260 ns as in *AMD EPYC Turin*.
   - **Intel Xeon 6:** the same 6985P-C, three compute tiles with two IO dies on EMIB, MDF, 96 cores,
     480 MB, SNC3 and 33 / +24 / ~80 ns as in *Intel Xeon 6*.
   - **Graviton4 and Graviton5:** the same wording as the *Graviton Deep Dive* rows: "1; 2 on the
     two-socket 48xlarge", "1; 2 on 16xlarge and 48xlarge", CMN-700 and CMN-S3, LLC 96 MB per node on
     24xlarge and 48xlarge and 48 MB on smaller sizes, and the 33% figure as a T2 vendor claim.
   - **NVIDIA Blackwell:** two dies, NV-HBI at 10 TB/s and one CUDA device, as in *NVIDIA Blackwell*.
     The NV-HBI name now cites the Ultra blog, as *NVIDIA Blackwell* does.
2. **Crossing-cost latencies: CONFIRMED.** Every figure is Tier 3 measured except two. The Graviton5
   figure is AWS's own (T2, `vendor-claim`, attributed in the sentence). The DRAM 130 ns is T3 derived
   from two C&C measurements. The SKUs are named and match the articles: EPYC 9575F (Turin core to
   core), EPYC 9355P (NPS1 DRAM), Xeon 6 6985P-C on r8i, Graviton4.
3. **Open die-to-die standards: CONFIRMED with one fix.**
   - **UCIe 3.0:** 48 and 64 GT/s. The "double 32 GT/s" now applies only to the top rate.
   - **UALink Chiplet 1.0:** April 7, 2026, fully UCIe 3.0 compliant.
   - **NVLink Fusion:** a chiplet dropped into custom ASICs; Trainium4 with NVLink 6, marked roadmap.
   - **Tiers:** UCIe Consortium and UALink Consortium are Tier 1 (standards bodies, matching the ruling
     and Communication's UALink record). The NVLink Fusion post is a vendor blog and stays Tier 2.
4. **DDR5-6400 "OEM enablement and a BIOS update": CONFIRMED verbatim** on the 9755 page (archive
   capture 2026-06-18): "DDR5-6400 support requires OEM enablement and a BIOS update from your server
   or motherboard manufacturer." The per-channel arithmetic is correct: 6,400 MT/s x 8 B = 51.2 GB/s,
   and x 12 = 614.4 GB/s, which matches AMD's "614 GB/s".

## Fixes applied

All fixes are in `src/sections/ChipletAndInterconnect.tsx`.
- :20-23: added `HBI_NOTE` (copied from NvidiaBlackwell) and `HBI_LATENCY_NOTE`.
- :131-132, table Blackwell "dies" cell. Before: `NV-HBI at 10 TB/s [blackwellArchitecture]`. After:
  adds `[blackwellUltraBlog, note HBI_NOTE]`.
- :143-149, table Blackwell "cost" cell. Before: the silence with no Cite. After: the same text plus
  `[blackwellArchitecture]` and `[blackwellUltraBlog]`, each carrying `HBI_LATENCY_NOTE`.
- :279-280, Graviton boundary block. Before: "...Arm's CMN-700 (Coherent Mesh Network). Graviton5
  puts 192". After: adds `[gravitonReadme]` after the CMN-700 sentence.
- :297-298, NVIDIA boundary block. Before: `NV-HBI (...) [blackwellArchitecture]`. After: adds
  `[blackwellUltraBlog, note HBI_NOTE]`.
- :362-363. Before: "Every link above is proprietary: GMI, MDF over EMIB, CMN and NV-HBI join dies that
  one vendor designed together." After: "Every die-to-die link above is proprietary: GMI, MDF over EMIB
  and NV-HBI join dies that one vendor designed together."
- :366-368. Before: "UCIe 3.0 runs at 48 and 64 GT/s (gigatransfers per second), double UCIe 2.0's 32
  GT/s." After: "UCIe 3.0 runs at 48 and 64 GT/s (gigatransfers per second); the top rate doubles UCIe
  2.0's 32 GT/s."

`src/sources/ChipletAndInterconnect.ts` and `src/components/ChipletPathDiagram.tsx` are unchanged. The
grep confirms that only this section imports the diagram.

## Checks

- `pnpm exec tsc --noEmit | grep ChipletAndInterconnect|ChipletPathDiagram`: no type errors in my files.
- `pnpm exec eslint` on the section, its sources and the diagram, `--max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t ChipletAndInterconnect`: exit 0, 1 passed.
- Gates `no-ai-tells`, `svg-a11y`, `pinned-refs`, `pre-overflow`: each exit 0, no hits in my files.
- `vite build --outDir /tmp/vf-ChipletAndInterconnect-dist`: exit 0.
- `shoot.mjs --sections chiplet-interconnect --widths 1440,390`: "1 SVG diagram(s), 0 React Flow, ok" at
  both widths. I read the PNGs: no label collisions, and the new badges wrap cleanly in the table at 1440.
  The diagram scrolls sideways at 390 with legible labels.

## For the orchestrator

- **The authoring report's UCIe-3D pitch note is wrong.** The UCIe specifications page says (re-read
  2026-10-23): "UCIe-3D is optimized for hybrid bonding with a bump pitch functional for bump pitches as
  big as 10-25 microns to as small as 1 micron or less". The register's "1 micron or less" is supported.
  Drop that line from the REVAMP-PLAN cross-section note. This section quotes no pitch, so no change here.
- `epyc9755Page` cannot be reached from this machine (curl reset, WebFetch timeout). It was verified
  from the 2026-06-18 Wayback capture, which also qualifies DDR5-6400 as "for targeted customers and
  configurations". The *AMD EPYC Turin* section cites the same claim without that qualifier. Optional
  consistency item; no record change.
- The glossary additions the author listed (CCD, GMI, NPS, SNC, EMIB, MDF, CMN, LLC, NV-HBI, UALink,
  GT/s, OCP, ASIC, OEM) are still for the shared glossary.

## Backlog

- The Graviton5 "two nodes on 16xlarge and 48xlarge" fact is stated in the boundary block, the table and
  closing step 1. A future pass could keep it in the table and closing step only.
- The hop-path caption carries six citations in one small-print run. An ExpandableSection ("Where each
  figure comes from") would read more cleanly.
- "NVIDIA sells NVLink Fusion as a chiplet" could read "offers". The post describes the chiplet as the
  core of the product, not its sale terms. Not a factual error.
