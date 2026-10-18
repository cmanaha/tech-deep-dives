# Change report: AwsCompilersAndTooling (nav id `aws-compilers`)

Status: COMPLETE

Register: `research/2026-10-refresh/03-aws-cpus.md` section 0 and section 2 (C1 to C26, N7 to N12,
Recommended edits 1 to 9).

Files: `src/sections/AwsCompilersAndTooling.tsx`, `src/components/AwsCompilerStack.tsx`,
`src/sources/AwsCompilersAndTooling.ts` (new), this report.

Fetched for this section on 2026-10-17 (those records carry that date): NKI overview, Neuron Graph
Compiler overview, Neuron Compiler CLI reference (not in the register; it backs `matmult` vs `all`
and `NEURON_CC_FLAGS`), Neuron Persistent Cache, Developer Tools release notes, neuron-top guide,
What's New, PyTorch component release notes, Native PyTorch (TorchNeuron), Release Notes index,
Intra-node Collective Communications. GitHub API on 2026-10-17: `aws-neuron/nki-library` tag `2.32`
exists (SHA 092a49d, Apache-2.0); `vllm-project/vllm-neuron` release `v0.24.0.1.1.0` published
2026-08-17; `aws-neuron/torch-neuronx` returns 404. Records shared with other sections reuse their
URL, title, publisher and tier exactly (nkiOverview, neuronCompiler, nkiTrn2Arch, ncMatmul,
trainium2Arch, trainium3Arch, intranodeCollectives, neuronWhatsNew, pytorchNative, gluonIntro).

## Section shape after the edit

1. h1: what the stack is, and "the NEFF is the schedule" (the one-sentence model, kept from the cut
   "Why this section" paragraph), qualified with dynamic shapes, control flow and runtime loops.
2. The default path, and where NKI enters: redrawn diagram, the four neuronx-cc stages, NKI entering at
   the back end, the PyTorch/XLA to TorchNeuron transition, and a versions table in an
   ExpandableSection.
3. Two settings to choose before the first compile: auto-cast default (N7) and the compile cache with
   S3, plus a two-line code block.
4. Which library to serve and train on: vLLM Neuron and TorchNeuron; NxD libraries in maintenance.
5. Profiling: the order is fixed, the timing is not; neuron-ls, neuron-top, Neuron Explorer; the order
   to open them.
6. Writing a kernel in NKI: what it is, when to reach for it (NKI Library first), develop on the CPU
   simulator and time the NEFF with nrtpy. Ends on the reader's next action.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| C1 | torch-neuronx "captures the graph as XLA HLO" | torch-neuronx captures a PyTorch model through PyTorch/XLA; PyTorch 2.9 is the last version on PyTorch/XLA; from PyTorch 2.10, in a future Neuron release, Neuron uses TorchNeuron and scripts need updating | neuronCompiler, pytorchNotes (T1, spec) |
| C2 | "jax-neuron" | JAX NeuronX (jax-neuronx), 0.10.0, supports up to JAX 0.9.0 | neuronReleaseNotes (T1, spec) |
| C3 | "Neuron HLO: operator fusion, SBUF tiling, schedule construction" (table, prose, diagram) | four stages: graph-level optimization in the XLA front end incl. operator fusion; loop-level optimization (layout, tiling, loop fusion); intrinsics mapping to hardware instructions; back end (memory allocation, instruction scheduling) | nkiOverview (T1, spec) |
| C4 | NKI "lower[s] into the same Neuron HLO and join[s] the standard graph path"; diagram edge NKI to Neuron HLO | NKI skips the first three stages, compiles to an IR the back end consumes directly; direct allocation skips some back-end passes; diagram edge NKI to stage 4, dashed, "skips stages 1 to 3" | nkiOverview (T1, spec) |
| C5 | Python DSL, AWS counterpart to Triton | bare-metal language and compiler for Trainium and Inferentia, Python, syntax and tile-level semantics similar to Triton and NumPy | nkiOverview (T1, spec) |
| C6 | "unlike Triton on a GPU, where the compiler manages SMEM with cache-style heuristics" | "in Triton, the compiler manages memory allocation and data movement" | nkiTrn2Arch, ncMatmul (T1), gluonIntro (T1, shared with NVIDIA Compilers and Kernel Tooling) |
| C7 | NKI link `.../general/nki/` | `.../en/latest/nki/index.html` as a Cite | nkiOverview (T1) |
| C8 | MoE NKI kernels "shipped in Neuron 2.27.0" | MoE kernels, Router Top-K among them, shipped in Neuron 2.28.0 | neuronWhatsNew (T1, spec) |
| C9 | "graduating into first-class library code" | the NKI Library, open source under Apache 2.0, pinned at tag 2.32 | neuronWhatsNew, nkiLibraryRepo (T1) |
| C10 | "Most Trainium workloads do not need NKI" | "Check the NKI Library first" (h2 description and body); the unsourced "most workloads" generalisation dropped | nkiLibraryRepo, neuronWhatsNew (T1) |
| C11 | NEFF "fired ... that clock" | the back end allocates memory and fixes the instruction order before the run; Trainium2 and Trainium3 support dynamic shapes and control flow; NKI 0.6.0 adds data-dependent runtime loops | nkiOverview, trainium2Arch, trainium3Arch, neuronWhatsNew (T1, spec) |
| C15 | cache "keyed on the graph hash" | hash of compiler flags and XLA graph; new compiler version or changed graph recompiles; default `/var/tmp/neuron-compile-cache`; `NEURON_COMPILE_CACHE_URL` to an `s3://` read-write bucket | neuronCache (T1, spec) |
| C17 | "make NEFF builds reproducible across runners" | "machines such as CI runners reuse each other's compiled graphs" (register's replacement text) | neuronCache (T1) |
| C18 | Neuron Distributed: TP, PP, SP, EP, ZeRO | NeuronX Distributed Training and NxD Core training APIs in maintenance (security fixes only); training moves to TorchNeuron (FSDP, DTensor, TorchTitan); NxD Inference in maintenance from 2.32.0, AWS directs users to vLLM Neuron | neuronWhatsNew, pytorchNative (T1, spec) |
| C19 | dead Neuron Distributed link | removed | n/a |
| C21 | runtime "loads NEFF, dispatches to NeuronCores, manages CC-Cores" | runtime loads the NEFF and runs it (intro and diagram). CC-Core clause dropped: collective hardware belongs to AWS Trainium, Inferentia and Neuron | neuronCompiler (T1) |
| C22 | "neuron-profile, TensorBoard plugin" | Neuron Explorer replaces Neuron Profiler and Profiler 2.0; `neuron-explorer capture` replaces `neuron-profile capture` in 2.32.0; TensorBoard plugin out of support | devToolsNotes, neuronWhatsNew (T1, spec) |
| C23 | neuron-top shows "SBUF residency, memory pressure, CC-Core activity" | live NeuronCore and vCPU utilization and memory usage | neuronTopGuide (T1, spec) |
| C24 | neuron-ls "devices, NeuronCores, topology" | devices, NeuronCore IDs on each, CPU and NUMA node affinity | devToolsNotes (T1, spec) |
| C26 | NEFF = Neuron Executable File Format | kept | neuronCompiler (T1, spec) |

## Claims removed

- C12 determinism ("same NEFF, same input, same silicon, same output"): UNKNOWN, no AWS statement. Cut;
  the page points to *Determinism: NEFF and GPU Reproducibility* for what a fixed order means.
- C13 compile-time-visible misses: UNKNOWN. Cut; replaced by the sourced counterpoint below.
- C14 predictable wall-clock: UNKNOWN, contradicted by HBM-load-dependent collective latency. Cut.
- C16 partial recompilation of changed subgraphs: UNKNOWN, not in the cache or compiler pages. Cut.
- C20 Neuron Distributed composes with SageMaker HyperPod: UNKNOWN, low value. Cut.
- C25 identical traces across runs: UNKNOWN, likely wrong. Cut.
- Recommended edit 9 CUT candidate: "Why this section" navigation narration (and its stale "Section
  16/17/29" numbers). Kept the one sentence "the NEFF is the schedule" as the h1's second paragraph lead.
- "The nine layers" table: superseded by the diagram; the version-bearing parts live on in the
  "Components and versions in Neuron 2.32.0" ExpandableSection.
- The Neuron Distributed parallelism list (tensor, pipeline, sequence, expert, ZeRO): the library is in
  maintenance, so its feature list fails the practical test.
- "The compile-cost dial" Alert: its "first-class in Neuron docs" and partial-recompilation claims are
  unsourced; the usable part survives as "each distinct graph pays its own compile".
- "domain-specific accelerator" as a reason to write NKI (unsourced example); "custom attention" kept.

## UNKNOWNs and how the page handles them

- C12, C13, C14, C16, C20, C25: cut (above).
- C6 Triton half: resolved with the Gluon tutorial record the NVIDIA section already uses.
- N11 TorchNeuron open source vs closed beta: both AWS statements shown with attribution (two
  statements disagree, so the attribution is load-bearing), plus "that repository was not public when
  this research checked it in October 2026". GitHub API 404 on 2026-10-16 (register) and 2026-10-17
  (this pass). Scope kept to the check.
- N8 compiler version conflict: the table shows 2.27.5334.0 (Release Notes index) with a Cite note that
  the compiler's own release-notes page lists 2.27.4747.0 for the same release, and cites both.

## NEW content added

- N7 auto-cast default: `--auto-cast=none` by default since neuronx-cc 2.22.12471.0 (Neuron SDK
  2.27.0); earlier versions cast FP32 matmuls to BF16; an FP32 model without an explicit `--auto-cast`
  runs FP32 matmuls, which can reduce inference throughput and increase compiled model size; restore
  with `--auto-cast=matmult --auto-cast-type=bf16` (neuronCompiler). `all` casts every FP32 operation
  and can lower accuracy; framework flags go in `NEURON_CC_FLAGS` (compilerCli, fetched, not in the
  register). Code block shows both environment variables.
- N8 versions in Neuron 2.32.0, in an ExpandableSection table, not prose (neuronReleaseNotes,
  pytorchNotes, pytorchNative, compilerNotes).
- N9 NKI stable since NKI 0.3.0 (Neuron 2.29.0); experimental CPU simulator `NKI_SIMULATOR=1` or
  `nki.simulate(kernel)` (neuronWhatsNew).
- N10 vLLM Neuron as the serving path: beta since July 2026, no NxD Inference dependency, Trn2 and
  Trn3; pinned release tag (neuronWhatsNew, vllmNeuronRepo).
- N11 TorchNeuron (above): native backend, eager and torch.compile without Inductor (pytorchNative).
- N12 nrtpy: loads and runs the NEFF from Python without PyTorch or JAX (nkiOverview); beta 2.34.10
  (neuronReleaseNotes).
- Timing paragraph replacing C13, C14, C25: per-hop latency of the intra-node ring collectives about 1
  to 2 microseconds, HBM load dependent (intranodeCollectives); Tensor Engine throttling (dI/dt current
  throttling on Trn2) documented for Neuron Explorer (devToolsNotes).
- Cache caveat: graphs traced with frozen weights through `torch_neuronx.trace` are not cached
  (neuronCache).

## Diagram

`AwsCompilerStack.tsx` redrawn in React Flow (kept React Flow, no new dependency) to mirror
`NvidiaCompilerStack.tsx`: custom multi-line nodes, a hidden-span title behind `role="img"` plus
`aria-labelledby`, white full-bleed canvas, 14px titles and 13px lines in sans-serif, default path
solid blue, opt-in path dashed green, legend below. Layout: model node feeds "XLA graph" into a
labelled neuronx-cc panel with the four stages left to right; the NKI node drops a dashed edge
straight into stage 4 ("skips stages 1 to 3"), so the bypass is visible as a skip over three boxes;
stage 4 emits the NEFF ("instruction order fixed at compile time"), which the Neuron Runtime loads.
The old "Neuron HLO" node, the NKI-as-peer-input edge and "jax-neuron" are gone. Phone convention:
`overflowX: auto` wrapper with a 800px minimum canvas width.

Rendered check (`scripts/shoot.mjs`, 1440 and 390): probe "ok" at both widths. Read the flow PNGs:
at 1440 no label crosses a line other than its own edge, the two edge labels sit clear above the
panel border, the panel title sits between the two incoming edges, the 30-unit corridors carry
arrows only. Fixed after earlier shoots: a hooked smoothstep arrow between NEFF and Runtime (now a
straight edge with equal node heights) and the versions table crushing a middle column to one letter
per line at 390 (now two columns). At 390 the canvas scrolls sideways with labels near 11px, the
table fits, the code block scrolls, and the three profiling columns stack.

## Word count

Before: 999 visible prose words (rendered page at 1440, every disclosure open; nav, Cite badges, SVG,
React Flow labels, code excluded; `/tmp/aws-compilers-tools/wc.mjs`, a copy of the sibling tool that
also drops `.react-flow`). 1,019 with the old diagram's labels.

After: 1,264 (+26.5%). Growth by block, each required by the register: matmul precision paragraph
(N7, recommended edit 7, about 85 words); PyTorch/XLA to TorchNeuron paragraph (C1, N11, about 65);
NKI simulator and nrtpy paragraph (N9, N12, about 60); timing paragraph that replaces the cut
determinism claims with sourced evidence (C13, C14, C25 replacement, about 60); versions table (N8,
about 45, behind a disclosure). Offsetting cuts: "Why this section" (edit 9), the nine-layer table, the
properties and compile-cost Alerts, the Neuron Distributed feature list and HyperPod sentence, and a
trim pass that took a first draft of 1,427 down to 1,264.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:

1. neuronx-cc runs four stages (graph, loop, intrinsics, back end) with the listed duties: nkiOverview.
2. NKI kernels skip stages 1 to 3 and enter the back end; direct allocation skips some back-end
   passes: nkiOverview.
3. "That is the source of NKI's instruction-level control: the tiling and instruction choices of
   stages 2 and 3 are yours": the register's C4 replacement text, a reading of item 2.
4. PyTorch 2.9 last on PyTorch/XLA; TorchNeuron from PyTorch 2.10 in a future release; scripts need
   updating: pytorchNotes.
5. TorchNeuron runs eager and torch.compile without Inductor; described as open source and as closed
   beta: pytorchNative. Repository not public in October 2026: GitHub API check (register and this pass).
6. Trainium2 and Trainium3 ISA support dynamic shapes and control flow: trainium2Arch, trainium3Arch
   (same wording as Heterogeneity Fact and Thesis and Framing). NKI 0.6.0 data-dependent runtime
   loops: neuronWhatsNew.
7. "Most tuning therefore happens before the run: the compiler flags, the graph you hand the compiler,
   and the kernels you write in NKI": our framing, connecting the fixed instruction order (nkiOverview)
   to the three knobs the page then documents. No new fact.
8. Auto-cast default, history, consequence and the restoring flags: neuronCompiler. `all` and
   `NEURON_CC_FLAGS`: compilerCli.
9. Cache key, recompile triggers, default path, S3 URL, frozen-weight trace caveat: neuronCache.
   "changing `--auto-cast` recompiles" and "each distinct graph pays its own compile" follow directly
   from the key. "CI runners reuse each other's compiled graphs": register C17 replacement text.
10. vLLM Neuron beta, plugin-native models, Trn2 and Trn3; NxD Inference maintenance and migration;
    NxDT and NxD Core training APIs maintenance: neuronWhatsNew. Release tag: vllmNeuronRepo.
11. TorchNeuron supports FSDP and DTensor and runs TorchTitan with minimal code changes: pytorchNative.
12. Ring collective per-hop latency about 1 to 2 us, HBM load dependent: intranodeCollectives. Tensor
    Engine dI/dt throttling on Trn2: devToolsNotes. "Run time can therefore differ between runs of the
    same NEFF": our inference from those two facts, worded as "can".
13. neuron-ls, neuron-top, Neuron Explorer descriptions: devToolsNotes, neuronTopGuide, neuronWhatsNew.
    The closing order (neuron-ls, then neuron-top, then Neuron Explorer) connects those descriptions to
    an action; it asserts nothing new.
14. NKI stable from 0.3.0 (Neuron 2.29.0); CPU simulator: neuronWhatsNew. nrtpy: nkiOverview.
    "so you can time the kernel on its own": register N12's suggested use.

## Orchestrator actions

- Glossary: add NxD (NeuronX Distributed), FSDP (Fully Sharded Data Parallel), and CI (continuous
  integration) if the glossary lists it. NEFF, NKI, XLA, IR, ISA, SBUF, PSUM, NUMA, HBM, MoE, FP32 and
  BF16 already exist.
- Cross-section consistency, files I do not own:
  - `CommunicationAndScaleOut.tsx:177` still says "Trainium MoE NKI kernels shipped in Neuron 2.27.0";
    the release is 2.28.0 (register C8, S25).
  - `DeterminismAOT.tsx` (lines 53, 92-105) and `IsolationNie.tsx` (55, 234, 243) state determinism by
    construction for the NEFF. This section cut that claim (C12) because no AWS statement was located,
    and shows that collective latency depends on HBM load. The Determinism section should keep its
    claim scoped to instruction order, or source it.
  - `RooflineAndArithmeticIntensity.tsx:542` names "NxD Inference on Trainium" as a serving stack; NxD
    Inference is in maintenance mode and vLLM Neuron is the serving path.
- No change needed in `App.tsx`, `sources/index.ts` or `sectionTitles` (the section test passes).
