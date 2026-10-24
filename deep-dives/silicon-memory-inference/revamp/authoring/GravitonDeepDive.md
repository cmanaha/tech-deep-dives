# Change report: GravitonDeepDive (nav id `graviton`)

Status: COMPLETE (not committed).

Files: `src/sections/GravitonDeepDive.tsx`, `src/components/GravitonComparison.tsx`,
`src/sources/GravitonDeepDive.ts` (new, 18 records), this report.

Register: `research/2026-10-refresh/03-aws-cpus.md` section 0 and section 3 (G1 to
G38, N13 to N16, Recommended edits 1 to 8), plus the folded-in 2026-08-01 audit
findings (P3 sections 7, 8, 10). All eight recommended edits are applied.

Primary sources re-read during authoring (2026-10-17): the Graviton README processor
table at 8b322a4, `onnx.md` and `llama.cpp.md` at the same commit, LLVM
`AArch64InstrFormats.td` and `AArch64InstrInfo.td` at `llvmorg-23.1.3`, the M9g, C9g,
R9g, R8g preview and R8g GA posts, About Amazon's Graviton5 page, the EC2 gp/co/mo
specification pages, Chips and Cheese's Graviton4 article, Arm's Neoverse V3 page and
the ONNX Runtime v1.17.0 release (GitHub API, published 2024-02-03). Every quote the
page relies on was found verbatim.

## Length

Before: 1,218 visible words. After: 1,365 (+12%). Measured on the rendered page at
1440 with every disclosure open, excluding nav, Cite badges, SVG text and code
(`/tmp/grav-tools/wc.mjs`, a copy of the KernelExecutionLifecycle counter). The growth
is the register-required material: GA dates and families (G21, G22), PCIe Gen6 and NIE
(N13, N14), the compiler flag (N15), the size-by-NUMA table that replaces the "NUMA
eliminated" expandable (G18, edit 4), the Instances row, and the ONNX Runtime BF16
opt-in (practical, from the already-cited `onnx.md`). Cuts that paid for it: "Why this
section", the 84% paragraph, the snoop-filter and 32 B/cycle sentences, the sources
small print, the GCC/Arm confirmation sentence and the SME UNKNOWN alert.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| G5 | Graviton5 clock 3.1 GHz | 3.3 GHz, no turbo | gravitonReadme (T1, spec) |
| G4 | Graviton4 2.8 / 2.7 GHz | kept, plus "no turbo" | gravitonReadme (T1, spec) |
| G6 | Graviton5 L1 UNKNOWN | 64 / 64 KB | gravitonReadme (T1, spec) |
| G7 | "4-cycle L1D" unlabelled | 4-cycle L1D, labelled measured | chipsAndCheeseGraviton4 (T3, measured) |
| G8 | L2 "2 MB · 8-way · 11 cycles" | 2 MB; 11 cycles (measured); 8-way dropped | gravitonReadme (T1); chipsAndCheeseGraviton4 (T3, measured) |
| G9 | "36 MB SLC (CMN-700)" | 36 MB, one cache shared by all cores, on the CMN-700 mesh | gravitonReadme (T1, spec) |
| G10 | "192 MB distributed (CMN-S3)" | 2 x 96 MB, one per NUMA node, on the CMN-S3 mesh; sizes up to 16xlarge see 48 MB per node | gravitonReadme (T1, spec) |
| G11 | L3 per core 1 MB (2.67x) | 1 MB within a node (derived); AWS: 2.6x Graviton4 | gravitonReadme (T1, derived); graviton5AboutAmazon (T2, spec) |
| G12 | "5.3x the per-chip L3" | "5x larger L3" (AWS's figure) | m9gGa (T2, spec) |
| G13 | DDR5-5600 (Graviton4) | kept, re-cited; 24 channels on the two-socket 48xlarge added | r8gPreview (T2); gravitonReadme (T1) |
| G14 | DDR5-7200 | DDR5-8800 | gravitonReadme (T1, 12x DDR5); m9gGa (T2) |
| G15 | 691.2 GB/s | 844.8 GB/s; 537.6 GB/s kept for Graviton4 | m9gGa / r8gPreview (T2, derived; note carries the arithmetic) |
| G16 | 3.6 GB/s per core (-36%); alert "dropped 36%" | 4.4 GB/s (-21%), labelled "every core busy"; alert "fell about 21%" | m9gGa (T2, derived) |
| G17 | "2-socket; 138 ns cross" | 1 node; 2 on the two-socket 48xlarge; about 138 ns across sockets (measured) | gravitonReadme (T1); chipsAndCheeseGraviton4 (T3, measured) |
| G18 | "Eliminated, single socket" (table, diagram, two bullets, expandable) | 1 node; 2 on 16xlarge and 48xlarge; expandable rewritten as a size table and pinning note | gravitonReadme (T1, spec) |
| G19 | 30-60 ns unlabelled | 30 to 60 ns across the mesh, measured | chipsAndCheeseGraviton4 (T3, measured) |
| G20 | "~33% lower (AWS claim)", credited to CMN-S3 | "up to 33% lower", AWS's claim, credited (as AWS does) to the single package | graviton5AboutAmazon (T2, vendor-claim) |
| G21 | "Graviton4 shipped at re:Invent 2023" | announced at re:Invent 2023, generally available since July 2024 starting with R8g | r8gPreview (T2); r8gGa (T2, fetched 2026-10-17) |
| G22 | "Graviton5 announced December 2025" | announced December 2025; M9g GA June 2026, C9g later that month, R9g August 2026 | graviton5AboutAmazon, m9gGa, c9gGa, r9gGa (T2) |
| G3 | 96 / "192 (2x)" | 96 per socket, two-socket 48xlarge has 192 / 192 in one package | gravitonReadme (T1); graviton5AboutAmazon (T2) |
| G1 | ARMv9.0-A / ARMv9.2-A | Armv9.0-A / Armv9.2-A (AWS's casing), re-cited | gravitonReadme (T1) |
| G29 | "up to 35% faster for ML workloads", preview page, "AWS's only first-party ML figure" | AWS claims ML inference up to 35% faster (GA post) | m9gGa (T2, vendor-claim) |
| G31 | SMMLA "4x4 8-bit submatrices into 32-bit accumulators" | 2x8 int8 by 8x2 int8 into a 2x2 int32 block, inside one 128-bit register | llvmMatMulFormat (T1, code) |
| G32 | I8MM/BF16 presence confirmed via Arm page and GCC | feature rows of AWS's processor table and the llama.cpp guide | gravitonReadme, gravitonLlamaCpp (T1) |
| G33 | Arm "double-digit" quote | kept verbatim, marked vendor claim | armNeoverseV3 (T2, vendor-claim) |
| G34 | "Graviton3 already exploited these in 2023 via ONNX Runtime" | since ONNX Runtime v1.17.0, released February 2024 | gravitonOnnx (T1); onnxRuntime1170 (T1, fetched 2026-10-17) |
| G35 | +28.6% per channel | +57% per channel | m9gGa (T2, derived) |
| G36 | SME UNKNOWN alert | "AWS's Graviton5 feature table lists no SME; its SIMD row reads 4x Neon/SVE 128-bit vectors" | gravitonReadme (T1) |
| G37 | unpinned repo root link | pinned to `tree/8b322a4160b827be202beedaf35ce21b4c635603` | gravitonGuideRepo (T1) |
| G38 | The Register, About Amazon and CMN-S3 links in small print | small print removed; every Graviton5 fact carries a Tier 1 or Tier 2 Cite | gravitonReadme, m9gGa, graviton5AboutAmazon |
| (none) | "FEAT_BF16 provides BFMMLA and SDOT / UDOT" | FEAT_BF16 adds BFMMLA (BF16 inputs, FP32 accumulators); SDOT/UDOT dropped because LLVM gates them on HasDotProd, not HasBF16 | llvmMatMulDefs (T1, code, fetched 2026-10-17) |
| (none) | placement bullets "hot working sets that fit in 1 MB/core L3", "benefited from 5.6 GB/s" | "fit one node's LLC: 96 MB on 24xlarge and 48xlarge, 48 MB on 16xlarge and smaller"; bandwidth bullet carries 4.4 vs 5.6 | gravitonReadme (T1); m9gGa (T2, derived) |

Changed: 33 claims.

## Claims removed

| Register | Claim | Why |
| --- | --- | --- |
| G2 | Process row: "TSMC N4 / N5", "TSMC 3 nm" (table and diagram) | No AWS source names a foundry or a Graviton4 node; AWS's "3 nm" alone changes no decision here, so the whole row went |
| G8 | L2 "8-way" | UNKNOWN, not in either source |
| G24 | "powers the largest fraction of EC2" (h1 description) | UNKNOWN; replaced with a payoff description |
| G25 | "~32 bytes/cycle bidirectional per stop" | UNKNOWN; CMN-700 TRM unreachable |
| G26 | snoop filter "1.5x aggregate L2 ... ~288 MB of on-mesh storage" | WRONG (coverage, not storage; audit item 12) and fails the test |
| G27 | "distributing L3 ... enables better coherence scaling and predictable latency" | UNKNOWN; replaced by the two-domain model |
| G28 | ">100 GB/s effective per-core bandwidth from cache" | UNKNOWN; Chips and Cheese measured ~30 GB/s single-core L3 on Graviton4 |
| G30 | the "up to 84% in AI data analytics" paragraph | CUT candidate; Arm's page does not carry it |
| G33 | "roughly 13% IPC" | UNKNOWN |
| (8) | "Why this section" paragraph, including "one of the most aggressive architectural shifts of any current host CPU" and "Section 4" | CUT candidate; the superlative was unsourced |
| (none) | "AWS's only first-party ML performance figure" | universal claim built from a local search |
| (none) | "Arm positions SME as a future Neoverse CSS deliverable, with SME2 shipping on client Lumex CSS" | no source in the register; the AWS feature table answers the reader's question |
| (none) | "Confirmed via the Arm product page and upstream GCC V3/V3AE definitions" | GCC unpinned; replaced by pinned Tier 1 sources |
| G18 | "no scheduler tuning to keep threads on the right half ... operational simplification" | WRONG under AWS's NUMA row |

Removed: 14.

## UNKNOWNs and how the page handles them

- Foundry and Graviton4 node (G2): row cut.
- 8-way L2, fleet share, 32 B/cycle, coherence-scaling claim, 100 GB/s, 13% IPC: cut.
- metal-48xl NUMA count: AWS's processor table does not list it. The page says so and
  tells the reader to confirm with `numactl --hardware`.
- How the 12 DDR5 channels divide between Graviton5's two nodes: the table gives the
  count per package only. The diagram draws DRAM per package and the page asserts no
  split.
- Graviton5 cross-node latency: no figure located; the page gives none.
- 844.8 GB/s: the derived note says "No AWS aggregate figure was located during this
  research" (register scope).
- N16 (Arm CCA on Graviton5): not added. AWS has not announced it in any source
  fetched, and the section does not discuss confidential computing.

## NEW content and sources

- N13 PCIe Gen6: intro sentence "Graviton5 is the first CPU in the AWS fleet with PCIe
  Gen6 and DDR5-8800" (m9gGa, T2, AWS wording).
- N14 Nitro v6 (Instances row, ec2GeneralPurposeSpecs / ec2ComputeOptimizedSpecs /
  ec2MemoryOptimizedSpecs, T1) and "M9g and M9gd introduced the NIE" (m9gGa, T2),
  cross-linked to *Isolation: NIE and MIG*.
- N15 `-mcpu=neoverse-512tvb`, "the flag AWS recommends for Graviton3, Graviton4 and
  Graviton5" (gravitonReadme, T1), in the closing action paragraph.
- Size table in the expandable: NUMA nodes and LLC per size (gravitonReadme, T1);
  vCPUs per size, identical for M9g, C9g and R9g (EC2 gp/co/mo pages, T1, re-read
  2026-10-17): medium to 12xlarge 1 to 48 vCPUs, 1 node, 48 MB; 16xlarge 64, 2 nodes,
  48 MB; 24xlarge 96, 1 node, 96 MB; 48xlarge 192, 2 nodes, 96 MB.
- ONNX Runtime: MMLA QGEMM kernels on by default; BF16 opt-in via
  `mlas.enable_gemm_fastmath_arm64_bfloat16` (gravitonOnnx, T1).
- Graviton4 Instances row: C8g, M8g, R8g, X8g, I8g (gravitonReadme, T1).
- `numactl --cpunodebind=0 --membind=0` and `numactl --hardware`: commands, not
  factual claims.

## Diagram changes and rendered check

`GravitonComparison.tsx` rebuilt to carry the new model: Graviton4 as one NUMA node
(96 cores, one 36 MB LLC, 12 x DDR5-5600, 537.6 GB/s, 5.6 GB/s per core, "only the
two-socket 48xlarge has a second NUMA node"); Graviton5 as one package with two dashed
NUMA-node boxes, each "96 cores, 2 MB L2 each" over its own "96 MB LLC, 1 MB per core",
on 12 x DDR5-8800 per package (844.8 GB/s, 4.4 GB/s per core, 21% less), with "16xlarge
and 48xlarge span both nodes; 24xlarge is one node: 96 cores and 96 MB of LLC".
Removed: "NUMA eliminated", "192 MB distributed", TSMC nodes, 3.1 GHz, DDR5-7200,
691.2 GB/s, -36%, "5.3x". Contract: `role="img"`, `aria-labelledby` with a sentence
title (`graviton-compare-title`), `aria-label` removed, viewBox only, full-bleed white
background rect, fonts 11 to 13 px sans-serif, class prefix `grv-`, phone convention
(`overflowX: 'auto'` wrapper, `minWidth: 640`). Every figure is cited in the caption
below it.

Rendered (`scripts/shoot.mjs`, build in `/tmp/silicon-dist-graviton`): the probe
reported "1 SVG diagram(s), 0 React Flow, ok" at 1440 and at 390 (no overlap, no text
outside its box, no viewBox clipping, no page overflow). PNGs read: at 1440 every
label sits inside its box with clear padding, the two node boxes and the DRAM bar line
up, nothing crosses text. At 390 the SVG scrolls sideways inside its wrapper and the
visible part is legible. The spec table and the size table got column `minWidth`s so at
390 they scroll inside the Cloudscape table instead of squeezing cells to one word per
line (seen on the first shoot, fixed and re-shot). `-mcpu=neoverse-512tvb` broke at
its leading hyphen at 390; it now carries `whiteSpace: 'nowrap'`.

## Checks

- `tsc --noEmit`: no errors in my files.
- `eslint` on my three files, `--max-warnings 0`: clean.
- `vitest run src/__tests__/sections.test.tsx -t GravitonDeepDive`: 1 passed.
- `no-ai-tells`, `svg-a11y`, `pinned-refs`: no hits in my files (the dive is opted in;
  other files still fail no-ai-tells).
- `src/__tests__/sources.test.ts`: only the sources.md snapshot differs (my new
  records); no tier or title conflict reported.

## Leverage pass

Blocks and what each is for:
- Intro: which generation and family is GA and when; one sentence of role.
- "The model to carry": the mental model and both strongest numbers (96 cores and 96 MB
  per domain; per-core bandwidth -21%), stated before any table. The diagram carries the
  same model.
- Side by side: reference for sizing a move, with tiers visible per cell.
- Two NUMA domains: model, ending on the -21% alert (the number lands in the intro,
  diagram, table, alert, SLM alert and placement bullet).
- ML and SLM: what to target (MMLA, no SME), what to configure (ONNX Runtime BF16
  opt-in), why the gain is memory-side.
- Placement: what to choose (24xlarge or 12xlarge and smaller for one node), what to
  type (`numactl`), and the closing action (`-mcpu`, NUMA check, the guide).

Claim-set diff, assertions in the after that were not in the before:

| New assertion | Source |
| --- | --- |
| Graviton4 GA July 2024 starting with R8g | r8gGa |
| M9g GA June 2026, C9g later that month, R9g August 2026 | m9gGa, c9gGa, r9gGa |
| Graviton5 first CPU in the AWS fleet with PCIe Gen6 and DDR5-8800 | m9gGa |
| M9g and M9gd introduced NIE | m9gGa |
| Graviton5 instances run on Nitro v6 | EC2 gp/co/mo pages |
| Graviton5 package runs as two NUMA nodes, each with its own 96 MB LLC | gravitonReadme |
| Two domains of 96 cores; 1 MB LLC per core within a node | gravitonReadme (derived, note) |
| Package bandwidth +57%, per-core share -21% | m9gGa, r8gPreview (derived, notes) |
| Size working sets against one node's 96 MB rather than 192 MB | our reading of gravitonReadme's per-NUMA LLC row |
| A NUMA node is the cores with their nearest cache and memory; local is faster than remote | definition, undisputed, uncited |
| Only the two-socket 48xlarge gives Graviton4 a second node | gravitonReadme |
| Sizes up to 16xlarge see 48 MB per node | gravitonReadme |
| Size table (vCPUs, nodes, LLC per size); 16xlarge spans both nodes while 24xlarge does not | gravitonReadme, EC2 gp/co/mo pages |
| metal-48xl is not listed in AWS's processor table | gravitonReadme (silence scoped to the table) |
| Graviton4 no turbo; 24 channels on two-socket 48xlarge; instance families C8g, M8g, R8g, X8g, I8g | gravitonReadme |
| BFMMLA is the BF16 form with FP32 accumulators | llvmMatMulDefs |
| Graviton5's feature additions are afp and wfxt | gravitonReadme |
| ONNX Runtime MMLA kernels on by default; BF16 opt-in session option | gravitonOnnx |
| -mcpu=neoverse-512tvb recommended for Graviton3, 4 and 5 | gravitonReadme |
| A job streaming past the LLC on every core gets about a fifth less DRAM bandwidth per thread | m9gGa, r8gPreview (derived) |

No unsourced assertion remains.

## Graviton5 NUMA facts for Chiplet and Interconnect (copy these)

- Graviton5 (Neoverse V3, CMN-S3 mesh) puts 192 cores in a single package
  (About Amazon, T2). It is not "NUMA eliminated" and its L3 is not one 192 MB cache.
- AWS processor table (README at 8b322a4, T1), verbatim: "Memory (NUMA) nodes: 1 (2 for
  16xlarge and 48xlarge)"; "LLC (shared): 48MB per NUMA (<= 16xlarge), or 96MB per NUMA
  (24xlarge and 48xlarge)"; "DRAM: 12x DDR5"; "Frequency: 3300MHz"; turbo "No".
- Model used on this page: one package, two NUMA domains, each 96 cores [derived: 192
  cores over the 2 nodes of 48xlarge; 24xlarge is 96 vCPUs on 1 node] with its own
  96 MB LLC.
- Per size: medium to 12xlarge, 1 node, 48 MB; 16xlarge (64 vCPUs), 2 nodes, 48 MB
  each; 24xlarge (96), 1 node, 96 MB; 48xlarge (192), 2 nodes, 96 MB each; metal-48xl
  not listed in the table.
- AWS's own ratios: "5x larger L3" (M9g post) and "2.6x more L3 cache" per core (About
  Amazon). "Up to 33% lower inter-core latency" is a vendor claim that AWS credits to
  the single package, not to CMN-S3.
- DDR5-8800 (M9g, C9g, R9g posts); 844.8 GB/s theoretical and 4.4 GB/s per core with
  every core busy are derived (-21% against Graviton4's 5.6 GB/s; +57% per channel).
- Graviton4: one NUMA node except the two-socket 48xlarge (2 nodes, 24 DDR5 channels).
  138.6 ns cross-socket and 30-60 ns cacheline bounce are Tier 3 measured (Chips and
  Cheese). The 288 MB snoop-filter figure is coverage, not storage (audit item 12).
- Not published in any source read: the channel split per Graviton5 node, and a
  Graviton5 cross-node latency.

## Orchestrator actions (shared files)

- Glossary acronyms introduced or used: NUMA (Non-Uniform Memory Access), LLC
  (last-level cache), ISA (instruction set architecture), CMN (Coherent Mesh Network),
  MMLA (matrix multiply-accumulate), I8MM (FEAT_I8MM, int8 matrix multiply), BF16
  (bfloat16), SVE2 (Scalable Vector Extension 2), SME (Scalable Matrix Extension), SLM
  (small language model), ONNX (Open Neural Network Exchange), GEMM / SGEMM / QGEMM
  (general, single-precision and quantized matrix multiply), JVM (Java Virtual
  Machine), NIE (Nitro Isolation Engine), KV (key-value).
- Regenerate `sources.md` (the snapshot test fails only on my new records).
- Title reuse for later authors: the EC2 gp/co/mo pages are titled "Amazon EC2 general
  purpose / compute optimized / memory optimized instance specifications" (T1), matching
  the existing accelerated-computing record. The About Amazon Graviton5 URL appears twice
  in the register ([T2-6] and [T2-20]); this file titles it "About Amazon: AWS Graviton5
  (2025-12-04, updated 2026-06-10 for GA)", and IsolationNie should reuse that title.
- Cross-link targets now exist: Capital Markets Lens's "Pin threads and their memory to
  one NUMA node (Graviton Deep Dive...)" lands on the expandable "Which Graviton5 sizes
  span both NUMA nodes"; its "96 MB of LLC per NUMA node on 24xlarge and 48xlarge, 48 MB
  on 16xlarge and smaller" matches this page. Heterogeneity Fact's SVE2 on Graviton4 and
  Graviton5 matches.
- Chiplet and Interconnect still carries "NUMA eliminated", "192 MB L3" and the snoop
  filter figure (audit items 11, 12); its author should use the facts above.
