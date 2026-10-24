# Change report: HeterogeneityFact (nav id `heterogeneity`)

Register: `research/2026-10-refresh/05-workloads.md`, "Section 2 - HeterogeneityFact"
(claims 2.1 to 2.18 and Recommended edits) and "Cross-section findings for the
integrator" (items 4 and 5). Trainium facts follow `03-aws-cpus.md` sections 0 and 1
(S12, S16, S22, S24); Cerebras and Groq facts follow `04-other-arch.md` sections 0 to 2
(CB1, CB4, CB11, CB13, GS3 to GS8, GS21).

Files: `src/sections/HeterogeneityFact.tsx` (imports no diagram component),
`src/sources/HeterogeneityFact.ts` (new, 24 records). Shared records reuse the URL,
title, publisher and tier already in use: `ec2AcceleratedSpecs`, `ptxIsa`,
`cudaBestPractices`, `hgxPage`, `nvfp4Blog` (NvidiaHopper.ts / NvidiaBlackwell.ts);
`trainium2Arch`, `trainium3Arch`, `cerebrasS1`, `cerebrasSdkBlog`,
`cerebrasInferenceBlog`, `groqNvidiaLicense`, `lpxBlog`, `lpxProduction`, the three
LLVM records (ThesisAndFraming.ts); `gravitonReadme` (GraceBlackwellUltraServer.ts);
`trn3Page` (FlashCacheTier.ts).

Fetched during authoring (records carry 2026-10-17):
- Neuron Trainium2 architecture: "Trainium2 supports dynamic shapes and control flow via
  NeuronCore-v3 ISA extensions." (see the note for the orchestrator below).
- NVIDIA LPX blog: "the compiler explicitly schedules computation, data movement, and
  synchronization", "Instead of relying on dynamic hardware schedulers at runtime",
  "500 MB of high-speed on-chip SRAM serves as the primary working storage for
  inference", tray table "DRAM via fabric expansion logic | Up to 512 GB", "Every tray
  integrates 16 LPU accelerators", "256 interconnected NVIDIA Groq 3 LPU accelerators",
  "plesiosynchronous, chip-to-chip protocol in hardware that cancels natural clock
  drift".
- Pond (arXiv 2203.00241, PDF text): Figure 4 "Local: 115ns, remote: 255ns" and "Local:
  78ns, remote: 142ns"; latency breakdown "Local DRAM (85ns)".
- M8i page: "Advanced Matrix Extensions (AMX) with FP16 support on M8i and M8i-flex
  instances", "custom Intel Xeon 6 processors". No AVX-512 mention.
- M8a page: "support expanded instruction sets including AVX-512, VNNI, and bfloat16";
  "5th Generation AMD EPYC processors (formerly code named "Turin")". This carries the
  AVX-512 claim the register (2.1) marked CORRECT but did not re-verify.
- Cerebras WSE-3 press release: headline "Cerebras Systems Unveils World's Fastest AI
  Chip with Whopping 4 Trillion Transistors", "44GB on-chip SRAM", "External memory:
  1.5TB, 12TB, or 1.2PB", "With a huge memory system of up to 1.2 petabytes, the CS-3 is
  designed to train next generation frontier models".

Word count (same counter both sides: JSX text, header descriptions, `headerText`, table
column headers and cell strings; tags, code, citation badges and popover notes
excluded; disclosures included): **865 before, 881 after (+1.8%)**. The NEW Groq 3 LPU
row replaces the cut compute-in-memory row; the expandable on benchmark transplants
was folded into the closing paragraph; the duplicated history ("Ten years ago... Five
years ago...") and the "A subtle point that changes the playbook" opener came out.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| 2.1 | Host shape "Scalar, SVE2 (Arm), AVX-512, AMX tiles (Xeon 6)" | "SIMD: SVE2 on Graviton4 and Graviton5, AVX-512 on EPYC Turin, AMX tiles on Xeon 6" | gravitonReadme (T1), m8aPage (T2), m8iPage (T2), spec |
| 2.2 | NVIDIA shape "Tensor-core tiles at FP4 - FP64; shape follows CuTe layout" | "FP8 to FP64 on Hopper, FP4 to FP64 on Blackwell; B300 cuts FP64 to 10 TFLOPS per 8-GPU board" (board figure matches NVIDIA Blackwell's "296 to 10 TFLOPS") | nvfp4Blog (T2), hgxPage (T2), spec |
| 2.3 | Trainium instruction "NEFF descriptor ..., no runtime scheduler" | "Neuron compiler fixes the schedule in a NEFF; ISA extensions add dynamic shapes and control flow" | trainium2Arch (T1), trainium3Arch (T1), spec |
| 2.3 | Trainium stall "Schedule slip visible in NEFF, not at runtime" | "Most stalls show up in the compiled schedule" | register wording (no number) |
| 2.4 | Cerebras instruction "Static dataflow, per-PE program, no global scheduler" (CORRECT) | "Each of 900,000 cores runs its own program and fires a task when its data arrives; no global scheduler" | cerebrasS1 (T1), cerebrasSdkBlog (T2), spec |
| 2.5 | Cerebras data "Entire model in on-wafer SRAM, no external DRAM in steady state" | "Inference: weights in 44 GB of on-wafer SRAM, larger models split by layer across CS-3 systems. Training adds up to 1.2 PB of external memory" | cerebrasS1 (T1), cerebrasInferenceBlog (T2), wse3Press (T2), spec |
| 2.7 | "Trn2 UltraServer (Trainium2 with 64-chip coherent domain)" | "a Trn2 UltraServer's 64-chip NeuronLink domain" | trn2Arch (T1), spec |
| 2.9 | "a Groq rack" | "an NVIDIA Groq 3 LPX rack or GroqCloud" (shipping, no roadmap label) | lpxProduction (T2), groqNvidiaLicense (T2), spec |
| 2.12 | "the per-vendor sections (8-19) carry the Tier 1 inline citations" | "Each family has its own section, from Graviton Deep Dive through Groq, SambaNova and Dataflow; Compute-in-Memory covers the in-memory devices" | internal |
| 2.13 | "Mispredict cost: ~15-20 cycles to drain + re-steer" | "a pipeline refill, 10 to 14 cycles in LLVM's scheduling models" (same figure, note and records as Thesis and Framing) | llvmNeoverseV2, llvmZnver4, llvmSapphireRapids (T1), spec |
| 2.14 | "Cache miss cost: hundreds of cycles of out-of-order shadow" (CORRECT, uncited) | "Cache miss to DRAM: hundreds of cycles, partly hidden by out-of-order execution"; note gives Pond's measured 78 and 115 ns and the 230 to 350 cycle arithmetic at 3 GHz | pond (T3, derived) |
| 2.15 | Trainium "Recovery: none at runtime, the NEFF is the schedule"; "Visible to compiler: entirely" | "Schedule: mostly fixed at compile time in the NEFF"; "Where it shows: largely in the compiled schedule" (dynamic control flow carried in the table row) | trainium2Arch, trainium3Arch (T1) in the row |
| 2.16 | WSE-3 "Visible to compiler: entirely, there is no dynamic arbitration" | table: "Routes are fixed at compile time; arriving data decides which task runs next"; column: "Where it shows: routes at compile time, task order at runtime" | cerebrasSdkBlog (T2), spec |
| 2.17 | "the wall-clock time equals the NEFF prediction with no runtime variance" | "stalls built into the compiled schedule on Trainium" (closing paragraph) | CUT candidate applied; no absolute remains |
| 2.18 | plain `<Link>` to the Neuron docs, "(accessed 2026-04-23)" | removed; every Neuron fact carries a `Cite` to the specific Neuron page | trainium2Arch, trainium3Arch, neuronCoreV3, trn2Arch (T1) |
| (1.11 applied) | NVIDIA instruction "Warp scheduler, no speculation"; column "concurrent warps, not speculation" | "Warp scheduler issues from ready warps"; "Recovery: the scheduler issues from another resident warp" | cudaBestPractices (T1), spec |
| (1.13 applied) | "a dataflow fabric that bakes the program into per-PE state" | "a wafer whose cores each run their own program" | cerebrasSdkBlog (T2) in the row |
| (1.20 applied) | WSE-3 "Recovery: either the plan avoided it or the model does not fit" | removed from the column; the table's data cell says larger models split by layer across CS-3 systems | cerebrasInferenceBlog (T2) |
| (S12, S24) | Trainium data "SBUF + PSUM scratchpads, compiler-managed"; shape "Tiles sized at compile time" | "SBUF and PSUM, software-managed on-chip SRAM"; "Systolic-array tiles sized at compile time to fit SBUF" | neuronCoreV3 (T1), spec |
| (cross-ref) | "compare placement on the roofline (Section 3)" | "Roofline and Arithmetic Intensity computes the ridge points" | internal |

CORRECT claims kept and re-cited: 2.1, 2.4, 2.8 (P5 Hopper, P6 Blackwell:
ec2AcceleratedSpecs), 2.10 (M8i with AMX: m8iPage), 2.14.

## Claims removed and why

- 2.6 compute-in-memory row ("HBM-PIM / HyperCIM", primitives inside the array,
  "Operator miss, fall back to host = catastrophic"): CUT candidate (HyperCIM) and the
  rest of the row is unsourced; no Samsung HBM-PIM source exists in the registers.
  Compute-in-memory stays as one uncited sentence in the opening list and a pointer to
  Compute-in-Memory.
- 2.17 "no runtime variance": CUT candidate.
- "Ten years ago the decision was GPU vs CPU. Five years ago it was GPU family vs GPU
  family": unsourced dates, cadence.
- "30% of the time may be spent in speculative shadow ... 30% ... warp scheduler
  blocking": hypothetical figures with no source; the closing paragraph keeps the
  mechanism without the number.
- "it does not count against the useful throughput": unsourced and unclear.
- "shape follows CuTe layout", "staged by CUTLASS, Triton, or Inductor", "wide fetch":
  cut for length; the row keeps the tiers and the tile point.
- "Engineers who spent a decade tuning out-of-order cores", "A subtle point that
  changes the playbook in every technical review": framing with no content.
- "Row entries are compiled from vendor documentation ...; the per-vendor sections ...
  carry the Tier 1 inline citations": a claim about other sections' sourcing.
- WSE-3 column "Fabric congestion: handled by static routing plan": merged into
  "Mitigation: placement and routing at compile time".

## UNKNOWNs and how the page handles them

- 2.6 HyperCIM: cut with the row.
- 2.17 Trainium runtime variance: cut; the page says only that stalls are largely
  visible in the compiled schedule (Thesis and Framing uses the same wording).
- GPU speculation (05 row 1.11, also in this section's row and column): replaced with
  the documented warp-switching behaviour; the page makes no statement on GPU
  speculation.

## NEW content and its sources

- Groq 3 LPU row (register 2.9, cross-section finding 4), replacing the cut row: lpxBlog
  (T2, fetched). DRAM behind the SRAM is stated, so the row says "primary working
  storage", never SRAM-only. No FLOPS figure is shown (NVIDIA does not label the FP8
  tray figure dense or sparse on the blog), only "FP8 compute".
- Trn3 UltraServer of up to 144 Trainium3 chips in the shortlist (2.11): trn3Page (T2).
  Rubin is not added to the shortlist: no Rubin instance is on the EC2 page, and NVIDIA
  Blackwell already carries that availability statement.
- AVX-512 on EPYC Turin: m8aPage (T2, fetched).
- Training external memory up to 1.2 PB: wse3Press (T2, fetched).

## Diagram changes and rendered check

The section owns no diagram. Table: every content column now has `minWidth: 200`
(architecture 160). Rendered with `scripts/shoot.mjs` at 1440 and 390: "0 SVG
diagram(s), 0 React Flow, ok", no page-level horizontal overflow. PNGs read at both
widths. At 1440 the five-column table fits with no horizontal scroll, badges sit
inline, and the stall grid is a clean 2x2. At 390 the first render squeezed the content
columns to about 90px, which made every row several hundred pixels tall; with the
minimum widths the table scrolls inside its container at readable column widths and
the page height fell from 4,432px to 3,515px. Prose, the 2x2 grid (stacked) and the
closing paragraph wrap cleanly.

## Leverage pass

| Block | What it means to the reader | Model | Leverage |
| --- | --- | --- | --- |
| Opening paragraph | Names the execution models before the table dissects them | Each chip family is a different answer to the instruction-data-shape triangle | Understanding; frames the table |
| Shortlist | The decision set a workload owner on AWS actually faces | Peak FLOPS cannot rank chips with different formats, hierarchies and compilers | Choose: weigh by the workload's binding delivery |
| Bet table | Four questions that place any chip | Instruction, data, shape, cost of a late delivery | Read a new chip's documentation through the same four questions |
| Stall grid | What a stall costs per class, and where it shows | Stall cost is architectural | Monitor: the old "Visible to compiler" lines became "Where it shows" (runtime profiling, compile-time occupancy, compiled schedule) |
| Closing paragraph | How to compare and port across classes | Wall-clock time hides different costs | Decide: place by FLOP per byte against each ridge; port a tuning result only where its mechanism exists |

A diagram could carry the bet table, but the table is the honest form for five rows of
cited text and the brief gives this section no diagram component; not commissioned.
Strongest number repeated: 10 to 14 cycles (stall grid and closing paragraph).

Claim-set diff (assertions in the after that were not in the before):
1. SVE2 on Graviton4 and Graviton5: gravitonReadme.
2. AVX-512 on EPYC Turin: m8aPage.
3. AMX on Xeon 6 (M8i): m8iPage.
4. Warp scheduler issues from ready warps / another resident warp: cudaBestPractices.
5. `wgmma` on Hopper, `tcgen05` on Blackwell: ptxIsa.
6. FP8 is Hopper's lowest tensor-core format, FP4 Blackwell's: nvfp4Blog.
7. B300 FP64 10 TFLOPS per 8-GPU board: hgxPage.
8. Trainium2 and Trainium3 ISA extensions for dynamic shapes and control flow: trainium2Arch, trainium3Arch.
9. SBUF and PSUM are software-managed on-chip SRAM; the tensor engine is a systolic array: neuronCoreV3.
10. 900,000 cores, each with its own program; tasks fire on data arrival: cerebrasS1, cerebrasSdkBlog.
11. 44 GB of SRAM per wafer: cerebrasS1.
12. Larger models split by layer across CS-3 systems: cerebrasInferenceBlog.
13. Training adds up to 1.2 PB of external memory: wse3Press.
14. Two-dimensional mesh of cores; routes fixed at compile time; arriving data decides task order: cerebrasSdkBlog.
15. Groq 3 LPU: compiler schedules computation, data movement and synchronization; no runtime hardware scheduler; 500 MB SRAM per LPU as primary working storage; up to 512 GB DRAM per 16-LPU tray; FP8 compute; 256 LPUs per rack; plesiosynchronous chip-to-chip protocol; compiled schedule sets per-token time: lpxBlog (04 GS7, GS21).
16. Trn3 UltraServer up to 144 Trainium3 chips: trn3Page.
17. Trn2 UltraServer 64-chip NeuronLink domain: trn2Arch.
18. NVIDIA Groq 3 LPX shipping; GroqCloud operating: lpxProduction, groqNvidiaLicense.
19. Mispredict 10 to 14 cycles in LLVM's scheduling models: llvm records.
20. DRAM miss is hundreds of cycles (Pond measured 78 and 115 ns): pond (derived).
21. "the compiler only estimates it" (mispredict): LLVM MispredictPenalty is a compiler cost estimate (the note says so).

Guidance sentences ("Compare by placement, then port by mechanism", "the bet that
matches the workload does") connect facts already on the page to an action and add none.

## For the orchestrator (shared files)

- **Conflict with Thesis and Framing.** `ThesisAndFraming.tsx` says "Trainium3 adds ISA
  (instruction set architecture) support for dynamic shapes and control flow". The
  Trainium2 architecture page (fetched 2026-10-17) says "Trainium2 supports dynamic
  shapes and control flow via NeuronCore-v3 ISA extensions" (also 03 register S22). "Adds"
  implies Trainium2 lacks it. This page says both generations have it; Thesis and
  Framing could read "Trainium2 and Trainium3 support ISA extensions for dynamic shapes
  and control flow".
- `sources.md` needs regenerating: the snapshot test fails only on rows the new source
  files add. The tier-consistency test and all 24 HeterogeneityFact record checks pass.
- Glossary acronyms used here: BTB (Branch Target Buffer), TLB (translation lookaside
  buffer), SIMD, SVE2 (Scalable Vector Extension 2), AVX-512, AMX (Advanced Matrix
  Extensions), SM (Streaming Multiprocessor), SIMT (single instruction, multiple
  threads), SMEM (shared memory), TMEM (Tensor Memory), HBM (High Bandwidth Memory),
  FP8/FP4/FP64 (8-, 4- and 64-bit floating point), NEFF (Neuron Executable File Format),
  ISA (instruction set architecture), SBUF (State Buffer), PSUM (Partial Sum buffer),
  WSE-3 (Wafer-Scale Engine 3), LPU (Language Processing Unit). LPX is a product name.
- Records other sections should reuse as written: `pond` (Tier 3 under the academic
  rule, `https://arxiv.org/abs/2203.00241`; DDR5, MRDIMM, LPDDR5X and CXL likely cites
  it), `m8iPage` (Intel Xeon 6), `m8aPage` (AMD EPYC Turin), `trn2Arch` and
  `neuronCoreV3` (AWS Trainium, Inferentia and Neuron), and `wse3Press`, whose title is
  the release's actual headline, not the URL slug (Cerebras Wafer-Scale).
