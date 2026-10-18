# Change report: ChipletAndInterconnect (nav id `chiplet-interconnect`)

Status: COMPLETE (not committed).

Register: `research/2026-10-refresh/04-other-arch.md`, section 0 and section 3 (CI1 to CI39,
Recommended edits 1 to 9). 2026-08-01 audit: `docs/verification/2026-08-01/P3-silicon-numbers.md`
sections 6, 7 and 8. Topology facts copied from the finished CPU and GPU sections
(GravitonDeepDive.md "Graviton5 NUMA facts", AmdEpycTurin.md and IntelXeon6.md topology facts,
NvidiaBlackwell.tsx, GraceBlackwellUltraServer.tsx), with their source records reused verbatim.

Files: `src/sections/ChipletAndInterconnect.tsx`, `src/components/ChipletPathDiagram.tsx`
(redrawn as inline SVG), `src/sources/ChipletAndInterconnect.ts` (new, 17 records).

All nine Recommended edits are applied.

## Shape of the section now

1. h1: what a chiplet processor is; Graviton's die count is unpublished, its NUMA layout is;
   "the model to carry": an access costs the sum of the boundaries it crosses, each boundary
   widens who it competes with, and a NUMA node is the handle software gets.
2. The hop-by-hop path on AMD Turin: prose (introduces CCD, GMI, NPS before the diagram), the
   redrawn SVG, caption with every figure cited, then "the GMI link is the boundary to watch"
   with the strongest number (45 ns vs 150 ns).
3. What changes when you cross a chiplet boundary: four model blocks (AMD L3 per die, Intel mesh
   across dies, Graviton one package with one or two nodes, NVIDIA hidden boundary). Acronyms
   for the table are expanded here first.
4. How the major architectures compose: the reference table, every cell cited, columns
   "Dies and die-to-die links", "What software sees", "Crossing cost".
5. Open die-to-die standards (NEW): UCIe, UALink Chiplet 1.0, NVLink Fusion; cross-link to
   *High Bandwidth Flash* by name.
6. Keep a job inside one NUMA node: the closing action list (`numactl --hardware`, bind, keep
   sharing threads on one CCD or tile, size working sets per node). This is the target of
   Capital Markets Lens's "Threads and memory pinned to one NUMA node (Chiplet and
   Interconnect, ...)".

Strongest number: about 45 ns core to core inside a Turin CCD against about 150 ns across CCDs
(Tier 3 measured). It lands in the diagram legend, the hop-path prose, the table and the
closing list.

## Word count

Counter `/tmp/chiplet-tools/wc.mjs` (copy of `/tmp/epyc-tools/wc.mjs`: rendered `main` at 1440,
all disclosures open; Cite badges, SVG text, code and, for the before build, the React Flow
labels excluded). **Before 1,012, after 1,269 (+25%).**

Per block (after; before in brackets where the block existed): h1 176 [174]; hop path 223
[113]; boundary blocks 263 [295]; table 278 [207]; Open die-to-die standards 168 [new];
closing 161 [223, as "Queuing at chiplet boundaries"].

Reasons for growth above 20%:
- Open die-to-die standards (+168): register NEW CI36, CI37, CI38 and edit 6, required by the
  orchestrator. Without it the section is 1,101 words (+9%).
- Hop path (+110): the caption now cites each figure in the diagram (five sources and two
  kinds, per the brief's SVG rule), and the prose introduces CCD, GMI and NPS before the
  diagram so the acronym standard holds in reading order.
- Table (+71): every cell carries a Cite and a tier label (edit 3), and a "What software sees"
  column replaces the snoop-filter block as the place the NUMA facts live.
Cuts that paid for it: the "Why this section" paragraph, the snoop-filter ExpandableSection,
the capital-markets alert, the sourcing small print, the four unsourced deltas, the EMIB cost
claim, and the numbers the boundary blocks repeated from the table.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| CI1 | Turin "Up to 16 CCDs (8c each) or 12 CCDs (16c each, Turin Dense) + 1 IO die ... 32 MB" | Same facts, cited (table, prose, diagram); "Turin Dense" label dropped | amdTurinArchWhitepaper (T1, spec) |
| CI2 | "Intra-CCD ~45 ns; inter-CCD ~150 ns; cross-socket ~260 ns", no tier marker | "Core to core about 45 ns in one CCD, 150 ns across CCDs, 260 ns across sockets (EPYC 9575F)", T3 badge | chipsAndCheeseTurin (T3, measured) |
| CI3 | Xeon 6 6900P "3 compute tiles (Intel 3) + 2 IO dies (Intel 7) joined by EMIB" | Scoped to AWS r8i (6985P-C): three compute tiles, each with L3 and four memory controllers, two IO dies on EMIB, 96 cores, 480 MB L3; "Intel 7" and the process nodes dropped | chipsAndCheeseXeon6 (T3, spec) |
| CI5 | "Local L3 ~33 ns; adjacent tile ~57 ns; two crossings ~80 ns" (uncited) | "L3 hit about 33 ns locally, about 24 ns more one tile away, nearly 80 ns two away" | chipsAndCheeseXeon6 (T3, measured) |
| CI6 | "The cross-die hop adds ~24 ns per boundary" as an EMIB property | Only in the table's Xeon row, as a measured L3-hit penalty on r8i, verbatim in the article (per the orchestrator and IntelXeon6.md); no sentence attributes it to EMIB | chipsAndCheeseXeon6 (T3, measured) |
| CI8 | Graviton4 "96 cores share 36 MB SLC" | "96 cores per socket, one 36 MB LLC" (AWS's own name, LLC) | gravitonReadme (T1, spec) |
| CI9 | Graviton4 "Cross-core 30-60 ns; cross-socket 138 ns" (uncited) | "Core to core 30 to 60 ns, about 138 ns across sockets" | chipsAndCheeseGraviton4 (T3, measured), as in Graviton Deep Dive |
| CI10 | Graviton5 "192 cores in single socket" | "192 cores in one package" | graviton5AboutAmazon (T2, spec) |
| CI11 | Graviton5 "192 MB distributed L3 (1 MB / core)" (table and snoop-filter block) | "LLC 96 MB per node on 24xlarge and 48xlarge, 48 MB per node on smaller sizes"; closing list "96 MB per Graviton5 node on 24xlarge and 48xlarge" | gravitonReadme (T1, spec; note quotes the table) |
| CI12 | Graviton5 "NUMA eliminated - single socket" | "One node; two on 16xlarge and 48xlarge" (table, block, closing step 1: "choose 24xlarge, or 12xlarge and smaller, for one node") | gravitonReadme (T1, spec) |
| CI13 | "~33% lower inter-core vs Graviton4 (AWS claim)" | "Up to 33% lower inter-core latency than Graviton4, by AWS's claim" | graviton5AboutAmazon (T2, vendor-claim) |
| CI14 | CMN-700, CMN-S3 | Kept; CMN expanded (Coherent Mesh Network) | gravitonReadme (T1, spec) |
| CI15 | "GH100 monolithic; GB100 (Blackwell) two reticles joined by NV-HBI" | "Hopper's GH100 is one 814 mm² die"; Blackwell "two reticle-limited dies"; "GB100" dropped | hopperArchBlog (T2, re-read 2026-10-17: "a die size of 814 mm2"); blackwellArchitecture (T2) |
| CI16 | "NVLink GPU-to-GPU 1.8 TB/s" | "1.8 TB/s bidirectional, 900 GB/s each way", note with 18 x 100 GB/s | blackwellUltraBlog (T2, spec), same note as NvidiaBlackwell |
| CI18 | NV-HBI "adds ns-class latency" | "No NV-HBI latency figure in the NVIDIA pages this research read" (scoped silence) | none (silence) |
| CI19 | "L1D 4 cycles, L2 ~14 cycles, L3 ~46 cycles (CCD-local), DRAM 130-140 ns NPS1" cited to a Chips and Cheese article that contains none of them | L1 4 cycles kept as AMD's design figure via Chips and Cheese (as AMD EPYC Turin does); L2 and L3 cycles deleted; DRAM "about 130 ns on an EPYC 9355P" derived; the misattributed link removed | chipsAndCheeseZen5HotChips (T3, spec with note); chipsAndCheeseNps0 (T3, derived, note shows the arithmetic) |
| CI20 | Diagram "L1D 48 KB, 4 cy", "L2 1 MB ~14 cycles", "L3 32 MB / CCD, ~46 cy" | "L1 data 48 KB, 4 cycles", "L2 1 MB per core", "L3 32 MB, shared by the CCD's cores" | amdTurinArchWhitepaper (T1); chipsAndCheeseZen5HotChips (T3) |
| CI21 | "GMI3-W link 2 x 36 Gb/s, 64 B/cy"; prose "GMI3-W" | "GMI (Global Memory Interface) link, one per CCD on high-core-count parts and two on memory-speed-optimized parts"; diagram "1 or 2 per CCD"; no bandwidth figure (as AMD EPYC Turin) | amdTurinArchWhitepaper (T1, spec) |
| CI22 | "DDR5-6400 channel 50 GB/s" | "51.2 GB/s each at DDR5-6400"; caption "DDR5-6400 needs OEM enablement and a BIOS update" | epyc9755Page (T1, derived; note gives 6,400 x 8 and the 614 GB/s per socket) |
| CI23 | Edge labels "~1 ns", "~3 ns", "~10 ns", "~20-40 ns", "~80-130 ns total" | All removed; one DRAM latency (about 130 ns, NPS1) used in both diagram and prose | chipsAndCheeseNps0 (T3, derived) |
| CI24 | "32 MB of L3 that is fast (~46 cycles)" | "Each CCD keeps its own L3"; 32 MB in the table, diagram and closing list; cycles gone | amdTurinArchWhitepaper (T1) |
| CI27 | "cross-CCD core-to-core latency is ~150 ns" | "about 150 ns across CCDs on an EPYC 9575F", T3 badge | chipsAndCheeseTurin (T3, measured) |
| CI28 | "NPS2 / NPS4", "NPS modes and Intel's SNC3" | NPS1 by AMD's guidance, NPS4 small gains, NPS is a BIOS setting; SNC3 one node per compute tile (Intel's default and AWS's r8i setting per the Intel section); NPS2 dropped (not in any source fetched, as AMD EPYC Turin notes) | amdTurinArchWhitepaper (T1); chipsAndCheeseXeon6 (T3) |
| (h1) | "Modern server CPUs are not monolithic dies" | "A chiplet processor is one package built from several dies"; Turin and Xeon 6 cited as built this way; Blackwell's two dies | amdTurinArchWhitepaper (T1), chipsAndCheeseXeon6 (T3), blackwellArchitecture (T2) |
| (closing) | `numactl` not mentioned; alert's "three levers" | Step list: `numactl --hardware`, bind with `--cpunodebind=0 --membind=0`, keep sharing threads on one CCD or tile, size working sets per node (32 / 160 / 96 MB) | gravitonReadme (T1), chipsAndCheeseXeon6 (T3), amdTurinArchWhitepaper (T1), chipsAndCheeseTurin (T3, measured) |

Changed: 24 claims (22 register rows plus the two framing rows).

CORRECT claims kept and re-cited: CI1, CI8, CI10, CI13, CI14, CI16, CI17 (NV-HBI 10 TB/s, in
the table), CI27.

## Claims removed and why

| Register | Claim | Why |
| --- | --- | --- |
| CI4 | "CHA at 2.5 GHz", "MDF at 2.5 GHz", "per-core L3 bandwidth ~30 GB/s" | CHA clock is wrong (2.2 GHz per the Intel section); MDF clock changes no decision here; 30 GB/s is sourced (T3) but its comparison partner (261 GB/s) is gone, and it lives in Intel Xeon 6 |
| CI7 | Graviton4 "7 chiplets (1 compute + 4 DDR + 2 PCIe) at TSMC N4/N5" | UNKNOWN, likely a Graviton3 fact; replaced by "AWS's table lists no die count" |
| CI17 (part) | "208B transistor chip" | CORRECT, cut for length; it changes no placement decision and NVIDIA Blackwell carries it |
| CI25 | "adding ~100 ns" | Derived delta, edit 5 |
| CI26 | "Turin ~261 GB/s per core measured aggregate" | Unsourced, incoherent unit, edit 5 |
| CI29 | "Load latency under contention can be 1.5-2x the unloaded latency" | Edit 5 (the register's 1.3x alternative was not added: the orchestrator listed this delta for deletion) |
| CI30 | "All measured numbers traceable ... see Sections 9-13" | Edit 3; every cell now carries its own Cite |
| CI31 to CI35 | Snoop-filter ExpandableSection (1.5x L2, 192 MB exclusive L2, 288 MB of storage, shadow tags, Graviton5 L3 as coherence storage) | CUT candidate, edit 8: central number refuted, the rest unsourced, repeats the refuted 192 MB |
| (none) | "Why this section" paragraph, "Section 4 ... Section 5", "a meaningful fraction of stage-5 latency" | Numbered cross-references and an unsourced fraction |
| (none) | Capital-markets alert: "rarely the headline number but is often the binding constraint", "three levers", NPS2 | Unsourced; its action (pin to one node) became the closing step list |
| (none) | "EMIB is cheaper than a full silicon interposer but supports high-density signals" | Unsourced |
| (none) | "mesh congestion is the dominant constraint at high core counts" | Unsourced (IntelXeon6.md: no source carries it) |
| (none) | "the distribution gets long-tailed", "shows up in production tail latency profiles" | Unsourced |
| (none) | "Intra-package ns class via NV-HBI" (table) | CI18, replaced by the scoped silence |
| (none) | "UMC", "Infinity Fabric mesh" diagram labels | Not AMD's wording in the sources used; the diagram says "12 DDR5 memory controllers, one per channel" |

Removed: 18 (11 register rows counting CI31 to CI35 separately, plus 7 unregistered).

CUT candidates kept: none. Edit 9 (the Xeon numeric row) is satisfied rather than cut: the
Intel section's Chips and Cheese record carries 33 ns, +24 ns and nearly 80 ns verbatim as
measurements, so the row stays with a T3 measured badge, as the orchestrator allowed.

## UNKNOWNs and how the page handles each

- CI3 Xeon 6900P composition at vendor tier: scoped to AWS's 6985P-C, Tier 3.
- CI4 clocks and 30 GB/s: removed (above).
- CI7 Graviton die count: stated as a scoped silence, "AWS's processor table lists no die count
  for Graviton" (re-checked in the README at 8b322a4 on 2026-10-17: the table has core, LLC,
  NUMA and DRAM rows, no die row).
- CI18 NV-HBI latency: "No NV-HBI latency figure in the NVIDIA pages this research read".
- CI19, CI20, CI24 L2 and L3 cycle counts: removed. The Zen 5 Software Optimization Guide was
  not fetched; AMD EPYC Turin also dropped these rows, so the two sections agree.
- CI23 edge latencies: removed.
- Graviton5 cross-node latency: "No Graviton5 cross-node latency figure was located during this
  research" (scope from GravitonDeepDive.md: "Not published in any source read").
- CI31, CI34, CI35: cut with the snoop-filter block.
- CI39 Venice: not added (register: only if the table gains a "next" column; AMD EPYC Turin
  carries the Venice roadmap).

## NEW content and its sources

- CI36 UCIe: open standard for the die-to-die physical layer; "mix and match chiplet
  components from a multi-vendor ecosystem"; UCIe 3.0 at 48 and 64 GT/s, double UCIe 2.0's 32
  GT/s. `ucieSpecs` (T1), re-read 2026-10-17. Not used: the register's "hybrid bonding down to
  1 micron or less"; the page read on 2026-10-17 says UCIe-3D is "optimized for hybrid bonding
  with a bump pitch functional for bump pitches as big as 10-25 microns", so no pitch figure is
  given. "UCIe 2.0 added 3D packaging" was cut for length.
- Cross-link: the OCP HBF base die specifies 16 UCIe channels to its accelerator, named as
  *High Bandwidth Flash*. `ocpSpec` (T1), record copied from HighBandwidthFlash.ts.
- CI38 UALink Chiplet Specification 1.0, published April 7, 2026, "Fully compliant with the
  UCIe 3.0 Specification". `ualinkFourSpecs` (T1, register tier), PDF text extracted
  2026-10-17.
- CI37 NVLink Fusion "chiplet" that hyperscalers "drop ... into their custom ASIC designs";
  "AWS is designing Trainium4 to integrate with NVLink 6". `nvlinkFusionTrainium4` (T2,
  roadmap), re-read 2026-10-17. The 72-ASIC and 3.6 TB/s figures were left out: the post does
  not say whether 3.6 TB/s is per direction or bidirectional.
- Graviton5 sizing step (24xlarge, or 12xlarge and smaller, for one node): from the AWS table
  row, matching Graviton Deep Dive's guidance.

## Diagram changes and rendered check

`ChipletPathDiagram.tsx` was a React Flow chain (seven nodes, animated edges, fixed 460 px
container, labels with em-dashes and `\n` that React Flow does not break, five unsourced edge
latencies, "GMI3-W 2 x 36 Gb/s, 64 B/cy", "DDR5-6400 50 GB/s"). The content change touched
every node, so it is redrawn as an inline SVG (the CLAUDE.md default for a small linear
diagram; React Flow's pan and zoom were disabled anyway). No dependency added or removed;
`@xyflow/react` is still used by other components.

New SVG: `role="img"`, `aria-labelledby="chiplet-path-title"` with a `<title>` that states the
assertion, no `aria-label`, `viewBox="0 0 900 280"` only, full-bleed white background rect,
Idiom A styles with the `cpd-` prefix, fonts 12 to 14 px sans-serif, and the phone convention
(`overflowX: 'auto'` wrapper, svg `width: 100%, minWidth: 640, height: auto, display: block`).
It draws three sharing bands ("Private to one core", "Shared by the CCD's cores", "Shared by
every CCD in the socket") over CCD 1 (core with L1 48 KB and 4 cycles, L2 1 MB per core, L3 32
MB), the orange GMI link ("1 or 2 per CCD") into the IO die ("12 DDR5 memory controllers, one
per channel"), DDR5 ("12 channels, 51.2 GB/s each at DDR5-6400"), "CCD 2 to CCD 16" feeding
the same IO die, and a latency legend (45, 150 and 130 ns). Every figure is cited in the
caption below it.

`shoot.mjs` (build in `/tmp/silicon-dist-chiplet-interconnect`): "1 SVG diagram(s), 0 React
Flow, ok" at 1440 and at 390, no overlap, box overflow, viewBox clipping or page overflow. PNGs
read: at 1440 every label sits inside its box with clear padding, the GMI labels sit above and
below the arrow, nothing crosses text, and the legend values do not touch their labels (an
earlier draft with "about 150 ns" in the legend would have collided; shortened before the first
shot). At 390 the diagram scrolls sideways at 640 px and the labels stay legible; the table
scrolls inside its container as elsewhere in the dive. The long `numactl --cpunodebind=0
--membind=0` command broke at its hyphens at 390; it now wraps only between its two
nowrap halves (re-shot).

## Leverage pass

| Block | What it means to the reader | Model, and whether a diagram carries it | How the reader uses it |
| --- | --- | --- | --- |
| h1 | What a chiplet processor is, and that the NUMA layout is the published handle | Cost = sum of boundaries crossed; each widens the competition | Frames every placement choice below |
| Hop path | Where on Turin a load leaves its die | Sharing bands in the SVG: core, CCD, socket | Recognise the GMI link as the point where other CCDs' traffic meets |
| Boundary blocks | How each vendor draws the boundary | L3 per die; mesh across dies; one package with nodes; hidden boundary | Predict which mistake costs most per platform: CCD placement on AMD, tile placement on Intel, node placement on Graviton5, none on Blackwell |
| Table | Side-by-side reference, tiers visible per cell | none needed | Look up nodes and crossing cost before sizing a deployment |
| Open standards | Why 2026 packages can mix vendors | Proprietary links vs UCIe; scale-up link as a chiplet | Read a multi-vendor design by its die-to-die interface |
| Keep a job inside one node | The action | none needed | `numactl --hardware`, bind, co-locate sharing threads, size working sets per node; pick Graviton5 24xlarge or 12xlarge and smaller for one node |

Claim-set diff (assertions in the after that were not in the before, each with its source):
1. Turin and Xeon 6 are multi-die; Blackwell joins two reticle-limited dies: amdTurinArchWhitepaper, chipsAndCheeseXeon6, blackwellArchitecture.
2. AWS's processor table lists no die count for Graviton: gravitonReadme (silence scoped to the table).
3. Where a boundary separates cores from their memory controllers, the group can be a NUMA node: our model statement, uncited, consistent with NPS4 quadrants (white paper) and SNC3 tiles (Chips and Cheese).
4. 12 DDR5 memory controllers, one per channel; one GMI link per CCD on high-core-count parts, two on memory-speed-optimized parts; GMI = Global Memory Interface: amdTurinArchWhitepaper.
5. About 130 ns to DRAM in NPS1 on an EPYC 9355P: chipsAndCheeseNps0 (derived).
6. 51.2 GB/s per channel at DDR5-6400; DDR5-6400 needs OEM enablement and a BIOS update: epyc9755Page (derived; spec).
7. Data between two CCDs crosses the IO die: amdTurinArchWhitepaper (CCDs attach only through GMI to the IO die), as in AMD EPYC Turin.
8. AMD's NPS1 guidance, NPS4 small gains, NPS is a BIOS setting: amdTurinArchWhitepaper.
9. Xeon 6 MDF stops carry the mesh across EMIB; L3 and memory controllers on compute tiles; SNC3 one node per tile; 96 cores, 480 MB, four memory controllers per tile; 160 MB per tile: chipsAndCheeseXeon6.
10. Graviton5 node counts and LLC per node per size; 24xlarge or 12xlarge and smaller for one node: gravitonReadme.
11. Graviton5 cross-node latency not located: GravitonDeepDive.md research scope.
12. GH100 is one 814 mm² die: hopperArchBlog.
13. Blackwell: one CUDA device, L2 shared by both dies with fully coherent access: blackwellUltraBlog.
14. NVLink 5 900 GB/s each way: blackwellUltraBlog (note).
15. UCIe facts: ucieSpecs. HBF base die 16 UCIe channels: ocpSpec. UALink Chiplet 1.0 and its UCIe 3.0 compliance: ualinkFourSpecs. NVLink Fusion chiplet and Trainium4 with NVLink 6: nvlinkFusionTrainium4 (roadmap).
16. "Read a multi-vendor package by its die-to-die interface": our reading, stated as guidance, built only on items in 15.
17. `numactl` commands: commands, not factual claims.

No unsourced factual assertion remains.

## Checks

- `tsc --noEmit`: no errors in my files.
- `eslint` on my three files, `--max-warnings 0`: clean.
- `vitest run src/__tests__/sections.test.tsx -t ChipletAndInterconnect`: 1 passed.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files (the gates ran and
  report other files).
- `src/__tests__/sources.test.ts` (run, not edited): tier and title consistency pass; only
  "keeps sources.md in sync with the registry" fails, on the new records.

## For the orchestrator (shared files)

- Regenerate `sources.md`. New URLs: `ucieSpecs`, `ualinkFourSpecs`, `nvlinkFusionTrainium4`.
  Every other record reuses an existing record's URL, title, publisher and tier.
- Glossary: CCD (Core Complex Die), GMI (Global Memory Interface; AmdEpycTurin.md already asks
  for this fix), NPS (NUMA nodes per socket), SNC (Sub-NUMA Clustering), EMIB (Embedded
  Multi-die Interconnect Bridge), MDF (Modular Data Fabric), CMN (Coherent Mesh Network), LLC
  (last-level cache), NV-HBI (NVIDIA High-Bandwidth Interface), UCIe (present), UALink (Ultra
  Accelerator Link), GT/s (gigatransfers per second), OCP (Open Compute Project), ASIC
  (application-specific integrated circuit), OEM (original equipment manufacturer).
- `App.tsx` nav title is "10. Chiplet and Interconnect"; the h1 now matches the section name
  "Chiplet and Interconnect" (was "Chiplet and interconnect topology").
- Cross-section note for REVAMP-PLAN: the UCIe 2.0 hybrid-bonding pitch in the register ("1
  micron or less") does not match the UCIe specifications page read on 2026-10-17 ("as big as
  10-25 microns"); any section quoting a UCIe-3D pitch should re-read the page. The NVLink
  Fusion post gives 3.6 TB/s per ASIC with no direction label.
- Capital Markets Lens's pointer "Threads and memory pinned to one NUMA node (Chiplet and
  Interconnect, ...)" now lands on "Keep a job inside one NUMA node".
