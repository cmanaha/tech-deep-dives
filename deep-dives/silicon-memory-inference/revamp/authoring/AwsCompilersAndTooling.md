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

---

## 2026-10-24 TorchNeuron update (Neuron SDK 2.33.0)

Scope: bring the section current for Neuron 2.33.0, released 2026-10-19, with TorchNeuron in public
beta. Evidence comes from three registers: `research/2026-10-torchneuron/01-primary-sources.md` (P
rows), `02-code.md` (C rows, torch-neuronx tag v2.33.0) and `03-semianalysis.md` (SA rows). TRL comes
from `deep-dives/rl-agentic-loops/research/2026-10/06-aws-paths.md` F06-61, at the coordinator's
request. Before integration, each phrase below was re-read on 2026-10-24 at its `/en/v2.33.0/` page
or pinned tag.

### Section shape after the edit

1. h1: two front ends (TorchNeuron to StableHLO on Trn2/Trn3; XLA for JAX and for Trn1/Inf2), one NEFF
   and one runtime at the end.
2. The default path, and where NKI enters: AwsCompilerStack, with its labels changed to "StableHLO or
   XLA graph". The four-stage paragraph is kept, the "PyTorch path is moving" paragraph is removed, and
   the component table moves to 2.33.0.
3. TorchNeuron: Trainium as the PyTorch device neuron (new, mental model). It holds
   TorchNeuronStackDiagram and paragraphs on eager mode, torch.compile, NKI, c10d, and one package name
   for two products.
4. Getting a PyTorch model onto neuron and through torch.compile (new, practical). It covers porting,
   the eager-fallback conflict, the best-practices code block, compile rules, the support boundary,
   and a maturity ExpandableSection.
5. Two settings to choose before the first compile. The matmul precision paragraph is re-cited and
   now covers TorchNeuron. The XLA cache is scoped, and a TorchNeuron NEFF cache paragraph is added.
6. Which library to serve and train on. vLLM Neuron on libtorch-neuronx-lite, the AUTOLOAD pitfall,
   the 2.34 end dates, TorchTitan Neuron and TRL.
7. Profiling. torch.profiler with PrivateUse1, the 5 GB DEVICE reservation, per-engine device tracks,
   the Memory Viewer, and Neuron Observer.
8. Writing a kernel in NKI. NKI 0.7.0, and the section ends on "Then call it from PyTorch".

Prose grows from about 1,000 to about 3,000 words (rough count of rendered text, citations and code
excluded).

### Claim-set diff

Changed:
- "PyTorch 2.9 is the last version on PyTorch/XLA": re-cited from the 2.32.0 PyTorch notes (E1) to
  What's New 2.33.0 (P29).
- Component table: 2.32.0 to 2.33.0 values (P21). NxD Inference row: "no 2.33.0 release; last
  0.10.18399 in Neuron 2.31.0" (P36).
- "Training moves to TorchNeuron ... TorchTitan with minimal code changes" (E4) becomes TorchTitan
  Neuron 0.2.2+neuron.1, a beta fork, with its validated configurations and limits (P26, P51, P52, C24).
- Serving: NxD Inference "maintenance" becomes "ends on Trn2/Trn3 in Neuron 2.34", together with NxD
  Core inference APIs and PyTorch/XLA inference (P29, P32).
- Matmul precision: TorchNeuron's graph compiles pass `--auto-cast=none` themselves (C9). The documented
  BF16 route on TorchNeuron is the dtype or autocast (about page). NEURON_CC_FLAGS reaches neuronx-cc on
  TorchNeuron (P39).
- The XLA compile cache paragraph is scoped to the XLA path.
- neuron-explorer capture is re-cited to the 2.33.0 dev-tools page (P49).

Added (assertion: source row):
- PrivateUse1 device `neuron`, dispatcher routing: P1-P3 / torchNeuron233, whatsNew233, C1
  (tnxDeviceRegistration).
- Autoload through the torch.backends entry point: P74, C2 (tnxEntryPoints).
- Eager mode: per-op StableHLO, NEFF on first use, async enqueue: P4. -O1: C5 (tnxEagerOptLevel). "-O1
  minimizes compile time": compilerCli v2.33.0. Cache key of op, shapes, dtypes, strides: C5
  (tnxDispatchCacheKey). HBM intermediates: pytorchBlog. Concatenation is experimental and off: P7.
- torch.compile: Dynamo FX, then AOTAutograd, then StableHLO, then one NEFF, no Inductor: P5, P6, C9
  (tnxAotAutograd). -O2 with `--model-type transformer --auto-cast=none`: C9 (tnxGraphCompileFlags).
  Graph breaks leave less context: about page.
- NKI: plain @nki.jit call or nki_op; use nki_op only for autograd or a named op: P9, best practices,
  C13, C32. custom_call inside the same NEFF, no graph break: C13 (tnxNkiCustomCall), best practices.
- c10d `neuron`: collectives, parallelism list, EFA: P16, P8, C14. Shard by NeuronCores; TP takes a
  NeuronCore count; FSDP needs no change: torch/index.html, about page.
- Package families, Python and Ubuntu: P13. XLA build 2.9.0.2.15.32035 deprecated: pytorchXlaNotes233.
  Keep the pin, because earlier versions are the XLA product: P57. The code does not refuse Trn1/Inf2:
  C18 (tnxPlatforms).
- Porting checklist: P74. Moving off torch_xla and xm.xla_device(): P19.
- Eager fallback doc conflict (warns versus silent): P18, P53. Code: the log line is dropped
  (tnxFallbackLogDropped), and one TORCH_WARN fires on a lowering that raises (tnxLoweringFailWarn), C8.
  FALLBACK_ONLY_FOR_UNIMPLEMENTED_OPS: best practices, C8 (tnxFallbackOnlyUnimplemented).
- Code block: best practices practice 1, plus `import torch_neuronx` (P74 says the import is needed
  only for its own APIs).
- Compile rules:
  - dynamic=False doc-code conflict: P41, C10 (tnxDynamicUnread);
  - fullgraph=True recommended; raises torch._dynamo.exc.Unsupported: P37, compile reference;
  - mode default only: P37, C9;
  - forced graph breaks, including ops with no Neuron lowering: P38, compile reference;
  - MoE experts outside the compiled region: P52;
  - compile failures raise by default, and the best practices advise keeping that: P39, C11
    (tnxCompileRaises), best practices;
  - compile the hot regions: best practices.
- Support boundary:
  - torch.sparse, func, nested, distributions; TorchAO and composite MXFP8; fft: P17;
  - FP8 requires Trainium 3: about page; the code disables the FP8 mapping on trn2 (C17, tnxFp8Trn2);
  - forward-mode AD out of the first release: P65.
- Maturity ExpandableSection:
  - 95.6% / 96.6% with the undefined pass criterion: P63 (vendor-claim);
  - ATen 94.7% of enabled tests and about 39K Neuron skips: P64 (vendor-claim);
  - Hugging Face 89% versus 46%: P71 (vendor-claim);
  - SemiAnalysis: 11,099 versus 14,156 tok/s, about 1.28x, and the 184.6 s / 255.7 s first step: SA21,
    SA27 (measured, Tier 3);
  - the first step is compilation, which the NEFF cache saves later: P52, SA27;
  - disclosure: SA4 plus the pytorchBlog thanks.
- NEFF cache:
  - /tmp/neff_cache, keyed on compiler version; pin versions: P41, C6;
  - FSx and the lock dir on local POSIX: compile reference;
  - TORCH_NEURONX_NEFF_DISABLE_CACHE in both code and compile reference, against
    TORCH_NEURONX_DISABLE_NEFF_CACHE in docs/environment_variables.md L84, read only by the uncalled
    utils.py helper (tnxEnvVarsDoc, tnxDisableNeffCacheHelper).
- vLLM Neuron:
  - torch.compile is the default path: P24;
  - libtorch-neuronx-lite on PyTorch 2.13: design page, C26 (vllmNeuronCoreReq, vllmTorchPin);
  - one package owns `neuron`, so set AUTOLOAD=0: design page;
  - migration targets: P29.
- Training:
  - XLA training unsupported from 2.30: P35;
  - TorchTitan Neuron: P26, P51, P52; its default backend is `neuron`: C24 (torchtitanCompileBackend);
  - TRL without code changes, 128-token padding, GRPO/RLOO generating with Transformers: F06-61
    (trlTrainium, Tier 2 here, quotes re-read at the v1.16.0 docs URL on 2026-10-24).
- Profiling:
  - torch.profiler PrivateUse1, default session, NeuronConfig: torchNeuronNotes, about page, C20
    (tnxProfilerPlugin);
  - DEVICE reserves about 5 GB HBM on Trn2: P49;
  - per-engine instruction tracks colored by PyTorch operator, per-DMA-engine packet tracks: Device
    Trace Viewer page;
  - Memory Viewer line attribution: P50;
  - Observer: P27.
- NKI 0.7.0 in 2.33.0: P21. Calling a kernel from PyTorch and register_autograd: P9.

Removed:
- The "The PyTorch path is moving" paragraph. Its content is replaced by the TorchNeuron h2s.
- "TorchNeuron closed beta" in the table (E3).
- The torch-neuronx 2.9 / PyTorch-XLA sentence inside the four-stage paragraph. The XLA front-end
  stage name stays, as the v2.33.0 NKI overview still describes it.

### Sources

Removed keys:
- compilerNotes
- neuronReleaseNotes (2.32)
- pytorchNotes (2.32)
- jaxNeuronx (2.32)
- pytorchNative (2.32)

Re-pinned to /en/v2.33.0/ after re-reading each claim there:
- neuronCompiler
- compilerCli
- nkiOverview

Accessed date updated: torchNeuron233 and torchNeuronxRepo. vllmNeuronRepo moves to release
v0.29.0.1.2.0.

Added, Tier 1 Neuron docs at v2.33.0:
- whatsNew233, releaseNotes233, whatIsNeuron233, pytorchXlaNotes233
- noXlaTraining, nxdiArchive
- torchIndex233, torchNeuronNotes, torchCompileRef, torchBestPractices
- torchtitanAbout
- vllmNeuronNotes233, vllmTorchNeuronDesign
- devTools233, explorerCapture, explorerDeviceTrace, observerNotes

Added, Tier 1 code:
- vllmNeuronCoreReq, vllmTorchPin
- 22 `tnx*` rows at `torch-neuronx/blob/v2.33.0`
- nkiTorchHook (the published nki 0.7.0 wheel)
- torchtitanCompileBackend (release-2.33.0)

Added, Tier 2:
- pytorchBlog (AWS)
- hfBlog (Hugging Face)
- trlTrainium (Hugging Face)

Added, Tier 3: semiAnalysis.

### Decisions

- Dropped the C7 and C16 counts (eager lowering library size and upstream skip-registry counts). They
  are our static counts. They give the reader no way to think about the backend and nothing to do.
- Omitted the P58 compatibility-table clause, where the repo table marks JVP as native, against the
  blog. The blog's "not in the first release" is the reader-facing fact.
- No claim on the override order of NEURON_CC_FLAGS against TorchNeuron's built-in
  `--auto-cast=none`. The code passes both, and the evidence does not settle which wins.
- c10d is drawn without a runtime arrow, because the registers do not show how the collectives path
  meets the Neuron Runtime.
- "/tmp is often cleared" was dropped. It was our inference (C6), with no doc behind it. The page
  instead uses the compile reference's own reason to move the cache: reuse across runs and instances.
- SemiAnalysis profiler superlatives (SA36, opinion) were not used.
- The int64 handling conflict (P52 note) was left out of this section. It is a data-type detail with no
  decision attached here.

### Diagram and render check

- TorchNeuronStackDiagram:
  - viewBox 900x476, prefix `tns-`, `role="img"` with a `<title>`;
  - house `overflowX: auto` wrapper with minWidth 640;
  - shows the XLA lane (dashed grey), the eager and compile lanes (solid blue), NKI entering both
    (dashed green), the neuronx-cc band, the NEFF boxes, the runtime, NeuronCores and c10d.
- `node scripts/shoot.mjs --sections aws-compilers --widths 1440,390`, run on a fresh vite build,
  reported 3 SVG and 1 React Flow, "ok" at both widths, exit 0.
- PNGs read at both widths: no overlap, clipping or page overflow.

### Orchestrator actions

- Glossary: add the following.
  - MLIR (Multi-Level Intermediate Representation)
  - StableHLO (the stable High Level Operations opset that TorchNeuron lowers to)
  - AOTAutograd (ahead-of-time autograd)
  - DDP (Distributed Data Parallel)
  - FSDP2 (Fully Sharded Data Parallel, version 2)
  - DTensor (Distributed Tensor)
  - c10d (PyTorch's distributed communication library)
  - MXFP8 (microscaling 8-bit floating point)
  - FP8 (8-bit floating point)
  - GEMM (general matrix multiply)
  - DMA (direct memory access)
  - EFA (Elastic Fabric Adapter)
  - TRL (Transformer Reinforcement Learning)
  - GRPO (Group Relative Policy Optimization)
  - RLOO (REINFORCE Leave-One-Out)
- sources.md must be regenerated. The sources snapshot test fails until it is.
