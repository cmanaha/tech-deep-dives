# Change report: IntelXeon6 (nav id `xeon-6`)

Register: `research/2026-10-refresh/03-aws-cpus.md`, section 0 and section 5
(claims X1 to X40, N20 to N23, Recommended edits 1 to 10). 2026-08-01 audit:
`docs/verification/2026-08-01/P3-silicon-numbers.md` sections 7 and 10.

Files: `src/sections/IntelXeon6.tsx`, `src/components/Xeon6Topology.tsx`,
`src/sources/IntelXeon6.ts` (new).

Status: DONE.

## Shape of the section now

1. h1: what Xeon 6 is (P-cores with AVX-512 and AMX, E-cores with neither), then "the model to
   carry": an r8i is a 96-core 6985P-C in SNC3, three NUMA nodes of about 32 cores, each with
   160 MB of L3 and four memory channels; keep a job on one node; size CPU decode against DRAM.
2. Three compute tiles, two IO dies: redrawn diagram, caption with citations, short topology
   prose, SNC3 alert with the measured cross-tile latencies and the `numactl` binding.
3. Memory bandwidth and CPU decode: NUMA-local read 691.62 GB/s (Tier 3 measured), 230.4 GB/s
   per node (derived), and the rewritten SLM block (weights do not fit in L3; decode ceiling).
4. AMX: geometry, permission step, Intel's ops/cycle (vendor claim), precision table with an
   FP8 roadmap row, instruction sequence (expandable), oneDNN tier alert with the
   `ONEDNN_VERBOSE` check and the `ONEDNN_MAX_CPU_ISA` cap, IPEX expandable.
5. The Xeon 6 family: part table (6900 P-core, 6700/6500 P-core, E-core, AWS 6985P-C) and the
   roadmap note (Xeon 6+, Diamond Rapids).
6. Xeon 6 on AWS (NEW, N20).
7. Choosing Xeon 6 for a workload, ending on "Before you benchmark".

Strongest number, landed more than once: 160 MB of L3 per SNC3 node (h1 description, model
paragraph, diagram, decode block, fit list). 230.4 GB/s per node also lands twice (decode block
and the closing action).

## Word count

Counter `/tmp/xeon-tools/wc.mjs` (copy of `/tmp/kl-tools/wc.mjs`: rendered `main` at 1440, all
disclosures open; Cite badges, SVG text and code excluded).

- Before: 1,099
- After: 1,397 (+27%)

Growth above 20%, by added block (all NEW per the register or the leverage pass):
- Xeon 6 on AWS card (N20, required): about 100 words.
- Roadmap note on Xeon 6+ and Diamond Rapids (N21, N22, required): about 60 words.
- oneDNN `ONEDNN_VERBOSE` check and `ONEDNN_MAX_CPU_ISA` cap (leverage pass: the only way a
  reader can confirm AMX FP16 is in use, or A/B it): about 70 words.
- Measured cross-tile latencies in the SNC3 alert (gives the cost of not binding): about 35 words.
- Decode-ceiling arithmetic in the SLM rewrite (X30, required; replaces the wrong model).
Offsetting cuts: mesh-congestion alert, "what is new vs Emerald Rapids" paragraph, the HEX/SNC
mode advice, the GPU comparisons, the TensorFlow/OpenVINO line, duplicate fit-list items.
Without the NEW blocks the section is about 1,130 words (+3%).

## Claims changed (before, after, source key, tier, kind)

| # | Before | After | Source key | Tier | Kind |
| --- | --- | --- | --- | --- | --- |
| X1 | 6900P "up to 128", "12", "DDR5-6400 / MRDIMM-8800" (uncited table) | 6900 series P-cores: up to 128 cores, 504 MB L3, 12 channels, DDR5-6400 or MRDIMM up to 8,800 MT/s; note explains the 6900-series mapping (brief gives P-core maxima and says 6900 has the most cores and channels) | `xeon6ProductBrief` | 1 | spec |
| X2 | "AMX FP16. SNC3." | AMX with FP16 in the family table; SNC3 as AWS's r8i mode and Intel's default | `xeon6ProductBrief`, `chipsAndCheeseXeon6` | 1, 3 | spec |
| X3 | 6700P/6500P "up to 86", "8", "MRDIMM-8000", "4 / 8-socket" (UNKNOWN) | Up to 86 cores, up to 336 MB L3, 8 channels, DDR5-6400 or MRDIMM up to 8,000 MT/s, AMX with FP16. Resolved by the Intel 6700/6500 product brief PDF, fetched via WebFetch on 2026-10-17 (curl gets 403). Socket count dropped for length | `xeon6700BriefPdf` | 1 | spec |
| X4 | 6900E "288 E-cores", "12", "DDR5-6400", "no AVX-512, no AMX" | Xeon 6 E-cores: up to 288 cores, 216 MB L3, 12 channels, DDR5-6400; AVX2 with VNNI, no AVX-512 (brief: P-core only), no AMX (brief lists AMX only under P-cores) | `xeon6ProductBrief` | 1 | spec |
| X5 | AMX BF16/INT8 "Sapphire Rapids (Xeon 4) onward", FP16 "Granite Rapids (Xeon 6) NEW" | Table: BF16 and INT8 from Sapphire Rapids, FP16 from Granite Rapids, FP8 Diamond Rapids (roadmap); "Xeon 4" and "NEW" labels dropped | `llvmX86Td`, `llvmAmxIntrin`, `llvmAmxFp16Intrin` | 1 | spec; FP8 roadmap |
| X6 | "Granite Rapids (P-cores, Redwood Cove) and Sierra Forest (E-cores, Crestmont)" | Redwood Cove kept (diagram, Tier 3); Sierra Forest and Crestmont codenames dropped (no fetched source ties them to Xeon 6 E-cores) | `chipsAndCheeseXeon6` | 3 | measured |
| X7 | "3 compute tiles + 2 I/O dies on EMIB" | Kept, scoped to AWS's 6985P-C in the diagram | `chipsAndCheeseXeon6` | 3 | measured |
| X9 | "CXL 2.0 directly from the I/O die" | CXL 2.0 (brief); IO dies hold the slower I/O and the accelerators (Tier 3). "Directly" dropped | `xeon6ProductBrief`, `chipsAndCheeseXeon6` | 1, 3 | spec |
| X10 | "504 MB declared (480 MB measured by third parties on the 6985P-C)" | "Intel's largest P-core parts reach 128 cores and 504 MB of L3"; the AWS 6985P-C has 96 cores and 480 MB (diagram, family table) | `xeon6ProductBrief`, `chipsAndCheeseXeon6` | 1, 3 | spec |
| X11 | "L2 ... 2 MB ... deeper 64-entry miss queue" | 2 MB L2 per core (diagram); miss queue dropped | `chipsAndCheeseXeon6` | 3 | measured |
| X12 | four DDR5 controllers per tile | Kept (diagram: "4 memory controllers", "4 channels of DDR5-7200") | `chipsAndCheeseXeon6` | 3 | measured |
| X13 | IO dies host PCIe 5.0, UPI, CXL 2.0, DSA, IAA, QAT, DLB; "no direct off-package path" | IO dies carry PCIe 5.0, UPI 2.0, CXL 2.0 and "Accelerators" (placement Tier 3, versions Tier 1); off-package claim dropped; QAT, DSA and IAA named in the fit list from the brief; DLB dropped | `chipsAndCheeseXeon6`, `xeon6ProductBrief` | 3, 1 | spec |
| X14 | MDF stops at 2.5 GHz | 80 MDF stops at 2.5 GHz (diagram footer) | `chipsAndCheeseXeon6` | 3 | measured |
| X15 | Diagram "~160 MB · 40 CHA · 2.5 GHz" | "160 MB L3 on this tile", "40 CHAs at 2.2 GHz"; chip total 120 CHAs at 2.2 GHz | `chipsAndCheeseXeon6` | 3 | measured; per-tile 40 derived |
| X16 | "Intel 3, ~43 Redwood Cove cores"; IO dies "Intel 7" | "~32 Redwood Cove cores", "Intel 3 process" (6985P-C); "Intel 7" dropped (not in any fetched source) | `chipsAndCheeseXeon6` | 3 | derived (96 / 3) |
| X18 | "SNC3 is the default"; "~160 MB of L3 and 4 DDR5 channels" per node | Kept; added that AWS runs r8i in SNC3 and that a node's memory is cached only in its own tile's L3 | `chipsAndCheeseXeon6` | 3 | spec |
| X19 | "HEX mode (former SNC1)" | "a unified one-node mode also exists" | `chipsAndCheeseXeon6` | 3 | spec |
| X20 | 8 tiles, 16 rows x 64 bytes | Kept, TMM0 to TMM7 named | `llvmAmxIntrin`, `llvmX86Registers` | 1 | spec |
| X21 | "managed by the OS via XSAVE / XRSTOR" | Tile data saved with the thread's extended state as XSTATE component 18; NEW: `arch_prctl(ARCH_REQ_XCOMP_PERM)` step, and oneDNN makes the request itself (same wording and sources as Anatomy of a Kernel Execution) | `linuxXstate`, `oneDnnAmxPermission` | 1 | spec |
| X24 | Instruction list | Kept in an expandable; `TILERELEASE` added (amxintrin.h) | `llvmAmxIntrin` | 1 | spec |
| X25 | AMX FP16 "close to the per-thread tensor density of an entry-level GPU" | "Intel rates AMX at up to 2,048 INT8, and 1,024 BF16 or FP16, operations per cycle per core" | `xeon6ProductBrief` | 1 | vendor-claim |
| X26 | oneDNN tiers mapped to generations; "PyTorch, TensorFlow, and OpenVINO use [oneDNN] under the hood" | Three tiers with their precisions; "the AVX10.1 names are oneDNN's labels"; "oneDNN, which PyTorch calls for AMX (Anatomy of a Kernel Execution)"; TensorFlow and OpenVINO dropped (unsourced) | `oneDnnIsaTraits` | 1 | spec |
| X27 | "next-generation Xeon, AMX-2 with extended capabilities" | "LLVM's Diamond Rapids target adds AVX10.2 and AMX-FP8" | `llvmX86Td` | 1 | roadmap |
| X28 | "archived as of March 30, 2026" | "its last commit, on 2026-03-30, adds the archive notice" (commit date and `archived: true` re-checked with the GitHub API on 2026-10-17) | `ipexReadme` | 1 | spec |
| X29 | "upstreamed into mainline PyTorch ... transparently via torch.compile" | "Most of its optimizations are upstream, and Intel recommends using PyTorch directly"; added "the README reports known security issues"; torch.compile clause dropped | `ipexReadme` | 1 | spec |
| X30 | "A 1-7B parameter SLM in FP16 fits comfortably in Xeon 6's 504 MB declared L3 plus DDR5-7200 / MRDIMM-8800 channels" | "A 1B-parameter FP16 model is about 2 GB of weights and a 7B model about 14 GB; neither fits in a node's 160 MB of L3, so every token reads all the weights from memory". Per-node ceiling 230.4 GB/s; 7B FP16 near 16 tokens/s on one node, INT8 doubles it; AMX pays off in prefill and batched decode. Cross-links Roofline and Arithmetic Intensity and Small Language Models | `chipsAndCheeseXeon6` | 3 | derived |
| X32 | r8i "custom Xeon 6 with DDR5-7200 RDIMMs" | r8i uses DDR5-7200 (Tier 3); M8i uses DDR5-7200 (AWS) | `chipsAndCheeseXeon6`, `m8iPage` | 3, 2 | spec |
| X33 | "STREAM triad at 691.62 GB/s per socket ... 2.14x ... essentially the 12-channel theoretical peak" | "With each thread reading its own node's memory, Chips and Cheese measured 691.62 GB/s on an r8i, about 2.1x their Emerald Rapids figure"; "per socket", "STREAM triad" and "theoretical peak" dropped | `chipsAndCheeseXeon6` | 3 | measured; ratio derived |
| X34 | "AWS chose DDR5-7200 RDIMMs rather than MRDIMM-8800 ... splitting the difference" | Facts kept (DDR5-7200 on AWS; Intel's figures DDR5-6400 or MRDIMM up to 8,800); motive dropped | `m8iPage`, `xeon6ProductBrief` | 2, 1 | spec |
| X35 | "Per-core L3 read bandwidth ... ~30 GB/s" (in the warning alert) | Fit list: "one core reads about 30 GB/s from L3, less than a Zen 5 core reads from DRAM" (both halves are Chips and Cheese's own statement) | `chipsAndCheeseXeon6` | 3 | measured |
| X38 | "each EMIB crossing adds ~24 ns" | Not drawn and not framed as an EMIB property. See "Register disagreement" below: the figure is in [T3-5] as a measurement of L3 hits on an adjacent tile, and the SNC3 alert carries it as that | `chipsAndCheeseXeon6` | 3 | measured |
| X39 | "Highest core-count workloads: Turin Dense ships 192 cores" (as a weakness) | "More than 128 cores per socket: only E-core parts, which have no AMX" | `xeon6ProductBrief` | 1 | spec |
| X40 | NextPlatform link for MDF/topology | Removed; topology cites Chips and Cheese, labelled Tier 3 | `chipsAndCheeseXeon6` | 3 | measured |

## Claims removed and why

- X8 "wider mesh": UNKNOWN, cut.
- X11 64-entry miss queue: not in any source.
- X16 "Intel 7" IO dies: not in any fetched source.
- X17 L1 sizes "64+48 KB": Chips and Cheese gives only the 64 KB L1I; dropped rather than half-sourced.
- X22 "tile registers source operands from L1D": UNKNOWN, cut.
- X23 "palette_id=1 is the only currently-defined palette": cut.
- X31 "competitive with entry-level GPU inference" and the multi-tenant "does not pencil out" line: unsourced.
- X36 Turin 261 GB/s, 11 vs 98 GB/s per core: unsourced, cut with the mesh-congestion alert (edit 10, CUT candidate).
- X37 "up to 6 TB / socket": unverified (ARK 403). Replaced by AWS instance memory (6,144 GiB on x8i.96xlarge, Tier 1).
- "Compute tiles communicate with external hosts only via the IO dies": unsourced.
- SNC3-versus-HEX workload advice: unsourced, and the mode is fixed on AWS.
- "The P-core family that competes with EPYC Turin in the inference-host space": unsourced framing.
- Workload-fit items that only repeated cut claims (mesh congestion, 24 ns per EMIB crossing, per-CCX L3 comparison, CXL pooled memory "direct from IO die").

CUT candidate kept: none. The mesh-congestion alert is gone; its one surviving number (about
30 GB/s per core) moved into the fit list with Chips and Cheese's own Zen 5 comparison.

## Register disagreement (please read)

X38 and the audit say "24 ns per crossing still has no source". A re-fetch of [T3-5] on
2026-10-17 (curl, text extracted locally) finds it verbatim: "Accessing the L3 on an adjacent die
increases latency by about 24 ns. Crossing two die boundaries adds a similar penalty, increasing
latency to nearly 80 ns for a L3 hit." and "Getting data from memory controllers across one die
boundary takes 157.44 ns, for about 26 ns extra over hitting a local one. Crossing two die
boundaries adds another 25 ns, bringing latency to 181.54 ns." The L3 latency on the local tile is
"just over 33 ns (~130 cycles)". Following the instruction, the diagram has no 24 ns and nothing
calls it a per-EMIB property. The SNC3 alert carries the figures as Tier 3 measurements of
node-to-node access on r8i, because they are the cost of not binding a job to one node. If the
orchestrator wants the register's cut applied literally, delete the second sentence of the
SNC3 alert; nothing else depends on it.

## UNKNOWNs and how the page handles each

- Cores per tile on the 6985P-C: Chips and Cheese gives the chip total (96) only and notes CHA
  count does not match core count. The page says "about 32", kind `derived` with the division
  in the note.
- CHAs per tile: 120 / 3 = 40, `derived`.
- Whether the 96xlarge is two chips: `derived` from 192 cores / 96 per 6985P-C and 3,072 GiB
  against 1.5 TB per socket. Labelled derived.
- NUMA layout per r8i size: the EC2 instance specification pages list none (checked gp, co, mo
  tables on 2026-10-17). The page states that silence, scoped to "the EC2 instance
  specifications", and tells the reader to run `numactl --hardware`.
- Which r8i size and socket count Chips and Cheese measured: unknown, so 691.62 GB/s carries no
  "per socket".
- Whether M8i, C8i and X8i use the 6985P-C and SNC3: unknown. The page scopes 6985P-C and SNC3
  to r8i; the other families are "Intel Xeon Granite Rapids" per AWS.
- Xeon 6+ matrix unit: the product page names no matrix extension (second WebFetch searched the
  page for AMX, Advanced Matrix, matrix, AVX: none). The page says exactly that, scoped to the
  product page. The Clearwater Forest codename is not used; no fetched Intel source ties it to
  Xeon 6+.
- Intel ARK fields (6980P maximum memory and others): ARK returns 403; nothing on the page rests
  on ARK.

## intel.com access notes

- Xeon 6 family product brief PDF (`cdrdv2-public.intel.com/845771`): fetched with curl and
  read with pdftotext on 2026-10-17. All Tier 1 Intel specs except the 6700/6500 row rest on it.
- Xeon 6700/6500 product brief PDF (`intel.com/.../2025-02/xeon-6-granite-rapids-product-brief.pdf`):
  curl 403; fetched via WebFetch, PDF saved and read with pdftotext on 2026-10-17.
- Hot Chips 2026 newsroom article and the Xeon 6+ product page: WebFetch on 2026-10-17 (the
  register's earlier read agreed). Diamond Rapids figures and the Xeon 6+ launch quarter rest on
  these two pages only.

## NEW content and its sources

- N20 Xeon 6 on AWS: families M8i, C8i, R8i (with -flex and d variants) and X8i list Intel Xeon
  Granite Rapids on Nitro v6; 96xlarge has 384 vCPUs on 192 cores; 1,536 / 3,072 / 6,144 GiB on
  M8i / R8i / X8i 96xlarge (`ec2GeneralPurposeSpecs`, `ec2ComputeOptimizedSpecs`,
  `ec2MemoryOptimizedSpecs`, Tier 1, re-fetched 2026-10-17). M8i 3.9 GHz sustained all-core
  turbo on DDR5-7200 (`m8iPage`, Tier 2); 2.5x memory throughput vs previous generation
  (`m8iPage`, vendor-claim). r8i chip is the 6985P-C in SNC3 (`chipsAndCheeseXeon6`, Tier 3).
- N21 Xeon 6+: Intel 18A, up to 288 E-cores, launched Q2 2026, no matrix extension named on the
  page (`intelXeon6Plus`, Tier 2).
- N22 Diamond Rapids (roadmap): Intel 18A-P, up to 256 cores, 1.28 GB LLC, 16 channels at
  12,800 MT/s, PCIe Gen6, CXL 3.0, enhanced AMX, no launch date (`intelHotChips2026`, Tier 2,
  roadmap); AMX-FP8 and AVX10.2 in LLVM's Diamond Rapids target (`llvmX86Td`, Tier 1, roadmap).
- N23 AMX ops/cycle: 2,048 INT8, 1,024 BF16/FP16 per cycle per core (`xeon6ProductBrief`,
  vendor-claim).
- oneDNN run-time checks (leverage pass): `ONEDNN_VERBOSE=1` prints `info,cpu,isa` with the
  highest usable tier, and v3.13.4's string for the Granite Rapids tier
  (`oneDnnVerbose`, `oneDnnMaxCpuIsa`); a lower tier means AMX not visible, permission failed,
  or a cap (`mayiuse(amx_tile)` requires CPUID AMX and `amx::is_available()`, in
  `cpu_isa_traits.hpp`/`.cpp`); `ONEDNN_MAX_CPU_ISA=AVX10_1_512_AMX` caps dispatch
  (`oneDnnMaxCpuIsa`, `oneDnnEnvPrefix` for the ONEDNN_/DNNL_ prefix and lowercasing,
  `oneDnnBuildOptions` for ENABLE_MAX_CPU_ISA defaulting to ON). All pinned to tag v3.13.4,
  Tier 1, read 2026-10-17.
- Cross-tile latencies (33 ns local L3, +24 ns one tile, nearly 80 ns two tiles; 157.44 ns DRAM
  one tile away, +26 ns) and "a node's memory is cached only in its own tile's L3"
  (`chipsAndCheeseXeon6`, Tier 3 measured).
- 6700/6500 336 MB L3 (`xeon6700BriefPdf`), E-core 216 MB L3 (`xeon6ProductBrief`), 6985P-C
  12 channels of DDR5-7200 (`chipsAndCheeseXeon6`).
- Per-node theoretical peak 230.4 GB/s = 4 x 7.2 GT/s x 8 B (`derived` on Chips and Cheese's
  four controllers per die and DDR5-7200).

## Diagram changes and the rendered check

`Xeon6Topology.tsx` redrawn as the AWS 6985P-C on r8i:
- `role="img"`, `aria-labelledby="xeon6-topology-title"`, `<title>` stating the assertion;
  `aria-label` removed. `viewBox="0 0 880 384"`, full-bleed white background rect, class prefix
  `x6-`, all fonts 10 to 13 px sans-serif.
- Phone convention: wrapped in `<div style={{ overflowX: 'auto' }}>`, svg
  `style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}` (the old svg had a
  fixed 420 px height and no wrapper, so at 390 it shrank).
- Tiles: "~32 Redwood Cove cores", "Intel 3 process", "2 MB L2 per core", "160 MB L3 on this
  tile", "40 CHAs at 2.2 GHz" (was 2.5 GHz), "4 memory controllers"; a memory strip under each
  tile, "4 channels of DDR5-7200", so memory visibly hangs off the compute tiles.
- IO dies: PCIe 5.0, UPI 2.0, CXL 2.0, Accelerators. "Intel 7" removed.
- EMIB bridges drawn at all four die boundaries (the old drawing showed only the outer two). No
  latency on any bridge.
- L1 sizes removed. Footer: chip totals (96 cores, 120 CHAs at 2.2 GHz, 480 MB L3, 80 MDF stops at
  2.5 GHz) and "Per-tile cores and CHAs are the chip totals divided by three. Measured by Chips
  and Cheese on r8i (Tier 3)." Every number is cited in the caption below the SVG.

Rendered check (`vite build` to `/tmp/silicon-dist-xeon-6`, `scripts/shoot.mjs --widths 1440,390`):
probe reports `1 SVG diagram(s), 0 React Flow, ok` at both widths (no overlap, box overflow,
viewBox clipping or page overflow). PNGs read: at 1440 every label sits inside its box with
clear spacing, the rotated EMIB labels sit inside the green bridges, and the footer clears the
memory strips. At 390 the diagram keeps its 640 px minimum and scrolls sideways with 11 px labels
legible; the page has no horizontal overflow. The AMX and family tables scroll inside their
Cloudscape containers at 390, as tables do elsewhere in the dive. `numactl --hardware` is kept
on one line with `whiteSpace: nowrap`.

## Leverage pass

- h1 model paragraph: builds the model (three nodes per chip; memory and L3 per node; decode is
  DRAM-bound). Leverage: choose instance size and binding; size CPU decode.
- Topology and SNC3 alert: model of where data lives; leverage: bind with `numactl`, and the
  measured cost of not binding. The diagram now carries "memory hangs off the compute tiles".
- Memory bandwidth and decode: leverage: compute a tokens-per-second ceiling from model bytes
  and node bandwidth, and pick quantization accordingly; tells the reader when AMX helps.
- AMX block: model of a matrix unit inside the thread; leverage (monitoring): confirm the tier
  with `ONEDNN_VERBOSE=1`, A/B FP16 with `ONEDNN_MAX_CPU_ISA`.
- IPEX: action: drop the import.
- Family table and roadmap: choose a part by matrix unit and memory.
- AWS card: choose a family and size by memory; check NUMA layout.
- Closing: the first benchmark run.

Claim-set diff (assertions in the after that were not in the before, each with its source):
- E-cores carry neither AVX-512 nor AMX (was in the table; now in prose): `xeon6ProductBrief`.
- AWS lists Granite Rapids for M8i, C8i, R8i, X8i and the -flex and d variants on Nitro v6;
  384 vCPUs on 192 cores at 96xlarge; 1,536 / 3,072 / 6,144 GiB: `ec2*Specs`.
- r8i chip is the 96-core 6985P-C; 480 MB L3; 12 channels DDR5-7200; Intel 3 compute tiles;
  120 CHAs; 80 MDF stops; CHA definition; memory controllers on compute tiles; IO dies carry
  slower I/O and accelerators; a node's memory cached only in its own tile's L3; unified mode;
  33 / +24 / ~80 ns L3 and 157.44 ns / +26 ns DRAM; 30 GB/s per core vs Zen 5 DRAM: all
  `chipsAndCheeseXeon6`.
- About 32 cores and 40 CHAs per tile; 230.4 GB/s per node; 2 GB and 14 GB of weights; 16 and
  about 33 tokens/s ceilings; 2.14x; two chips per r8i.96xlarge: `derived`, notes give the
  arithmetic.
- At batch 1 each weight read feeds one multiply-add; AMX pays off in prefill and batched
  decode: our reading, in prose, no citation attached, consistent with Roofline and Arithmetic
  Intensity's decode note.
- PCIe 5.0, UPI 2.0, CXL 2.0; QAT, DSA, IAA roles; 504 MB and 128 cores; 216 MB E-core L3;
  2,048 / 1,024 ops per cycle: `xeon6ProductBrief`.
- 86 cores, 336 MB, 8 channels, MRDIMM 8,000, AMX FP16 on 6700/6500: `xeon6700BriefPdf`.
- `arch_prctl(ARCH_REQ_XCOMP_PERM)` and oneDNN requesting it: `linuxXstate`, `oneDnnAmxPermission`.
- `TILERELEASE`; XSTATE component 18: `llvmAmxIntrin`, `linuxXstate`.
- FP8 in Diamond Rapids; AVX10.2 in Diamond Rapids: `llvmX86Td` (roadmap).
- oneDNN verbose line, its v3.13.4 string, the lower-tier causes, the MAX_CPU_ISA cap and its
  build default: `oneDnnVerbose`, `oneDnnMaxCpuIsa`, `oneDnnEnvPrefix`, `oneDnnBuildOptions`.
- IPEX README reports known security issues: `ipexReadme`.
- Xeon 6+ facts: `intelXeon6Plus`. Diamond Rapids facts: `intelHotChips2026`.
- M8i 3.9 GHz turbo, DDR5-7200, 2.5x claim: `m8iPage`.
- EC2 specifications give no NUMA layout per size: silence scoped to the spec pages
  (`ec2MemoryOptimizedSpecs`).

## Checks run

- `tsc --noEmit`: no errors in my files.
- `eslint` on the three files, `--max-warnings 0`: clean.
- `vitest run src/__tests__/sections.test.tsx -t IntelXeon6`: 1 passed.
- `vitest run src/__tests__/sources.test.ts`: tier and title consistency pass; the only failure
  is "keeps sources.md in sync with the registry", which needs the orchestrator to regenerate
  `sources.md`.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files.

## For the orchestrator (shared files and other sections)

Shared files:
- Regenerate `sources.md` (new records: `xeon6700BriefPdf`, `intelHotChips2026`,
  `intelXeon6Plus`, `chipsAndCheeseXeon6`, `ipexReadme`, `oneDnnIsaTraits`, `oneDnnMaxCpuIsa`,
  `oneDnnVerbose`, `oneDnnEnvPrefix`, `oneDnnBuildOptions`). Shared records reuse exact
  URL/title/publisher/tier: the Xeon 6 brief PDF matches AmdEpycTurin's `xeon6ProductBrief`;
  LLVM, Linux and oneDNN permission records match KernelExecutionLifecycle; EC2 spec records
  match GravitonDeepDive; `m8iPage` matches HeterogeneityFact.
- Glossary acronyms introduced and not yet in `GlossaryAndSources.tsx`: UPI (Ultra Path
  Interconnect), QAT (QuickAssist Technology), DSA (Data Streaming Accelerator), IAA (In-Memory
  Analytics Accelerator), VNNI (Vector Neural Network Instructions), IPEX (Intel Extension for
  PyTorch). Already present and used: AMX, AVX-512, NUMA, SNC, CHA, MDF, EMIB, MRDIMM, DIMM, CXL,
  LLC, BF16. The glossary's MDF entry is consistent with the page.
- Two sources for the Intel Xeon 6 brief exist in the bibliography: the PDF (this section,
  AmdEpycTurin) and the HTML page `intel.com/.../xeon-6-product-brief.html` (CapitalMarketsLens,
  FlashCacheTier). Consider pointing the latter two at the PDF, which is fetchable.

Topology facts for Chiplet and Interconnect (all Chips and Cheese on r8i, Tier 3 measured,
unless marked):
- AWS's r8i runs the Xeon 6 6985P-C: 96 Redwood Cove cores, three compute dies on Intel 3 plus
  two IO dies, joined by EMIB. The IO-die process node is not in any fetched source: do not
  write "Intel 7".
- 120 CHAs at 2.2 GHz, 480 MB of L3; 160 MB of L3 per tile; 80 MDF stops at 2.5 GHz. MDF is
  2.5 GHz, the CHAs are 2.2 GHz (the current Chiplet text says "CHA at 2.5 GHz": wrong).
- 12 memory controllers, four per compute die, DDR5-7200 (1.5 TB per socket on r8i).
- SNC3 is Intel's default and AWS's r8i setting; each node's memory is cached only in its own
  die's L3. A unified one-node mode exists; "HEX" is not a name any source uses.
- Latency: L3 just over 33 ns local; about 24 ns more on an adjacent die; nearly 80 ns two dies
  away. DRAM across one boundary 157.44 ns (about 26 ns over local), two boundaries 181.54 ns.
  These are measured node-to-node penalties in SNC3, not a property of EMIB. Core-to-core
  within a compute die 50 to 80 ns.
- One core reads about 30 GB/s from L3, less than a Zen 5 core reads from DRAM (Chips and
  Cheese's own comparison). No source carries "261 GB/s per core" or "mesh congestion is the
  dominant constraint".
- NUMA-local read bandwidth 691.62 GB/s on an r8i vs 323.45 GB/s on Emerald Rapids; not STREAM
  triad, not per socket.
- Intel (Tier 1): largest Xeon 6 P-core parts up to 128 cores and 504 MB of L3; up to 12
  channels; MRDIMM up to 8,800 MT/s; up to 64 lanes of CXL 2.0.

Other sections that contradict this one:
- `SmallLanguageModels.tsx` (~line 228), alert "The working set fits in cache": says a 1B INT8
  model (1 GB) is "well within the L3" of Graviton5, Turin and Xeon 6 and that "the bandwidth
  wall stops binding". This is the model the register flagged as wrong here (X30): 1 GB does not
  fit in 504 MB, nor in one r8i node's 160 MB. It also cites "Graviton5's 192 MB distributed L3",
  which the Graviton notes rule out.
- `MainMemoryAndCxl.tsx` (~line 133): still says "STREAM triad at 691.62 GB/s per socket" and
  that it matches the 12-channel theoretical peak. Per X33 it is a NUMA-local read test and is
  not a per-socket figure.
