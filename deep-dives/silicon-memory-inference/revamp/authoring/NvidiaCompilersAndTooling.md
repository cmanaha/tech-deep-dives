# Change report: NvidiaCompilersAndTooling (nav id `nvidia-compilers`)

Register: `research/2026-10-refresh/02-nvidia.md` section 4 (C1 to C34), plus section 0
(toolchain status rows) and section 6 (pinned wide_ep URL at v1.2.1).

Files: `src/sections/NvidiaCompilersAndTooling.tsx` (rewritten in place),
`src/components/NvidiaCompilerStack.tsx` (React Flow kept, nodes, edges and layout rebuilt),
`src/sources/NvidiaCompilersAndTooling.ts` (new, 29 records).

Re-fetched on 2026-10-17 (records carry that date): PyTorch v2.14.1 `torch/__init__.py`,
`torch/_inductor/{__init__,config,utils,choices,select_algorithm}.py`,
`torch/_inductor/kernel/{mm,bmm,mm_common,mm_grouped}.py`,
`aten/src/ATen/native/Linear.cpp`, `aten/src/ATen/cuda/CUDABlas.cpp`; CUTLASS README and
CHANGELOG at v4.8.0; CuTe DSL JIT compilation options page; Triton v3.8.0 release notes (API),
Gluon `01-intro.py` at v3.8.0, Triton NVIDIA backend `compiler.py` at v3.8.0 (ptxas stage, not
cited); Triton matmul tutorial; cuTile Python quickstart; CUDA Programming Guide v13.4.2 "Writing
Tile Kernels"; TensorRT-LLM README and wide_ep README at v1.2.1, release notes v1.0.0, v0.12.0,
v1.2.1 (API); TensorRT Quick Start Guide; Nsight Systems User Guide; Nsight Compute Profiling
Guide.

## Finding beyond the register (code, PyTorch v2.14.1)

The register's C3 says "by default every matmul goes to ATen regardless of size". The code
confirms that for `aten.mm` and `aten.addmm` (the operators a linear layer usually lowers to,
`Linear.cpp` L106-129), and confirms that CUTLASS needs max-autotune plus `CUTLASS` in the list.
It also shows two exceptions the register does not carry:

- `tuned_bmm` (`kernel/bmm.py` L230), `tuned_int_mm` (`kernel/mm.py` L611) and both
  `tuned_scaled_mm` variants (L1074, L1252) call `use_triton_template(..., check_max_autotune=False)`,
  so batched, INT8 and FP8 matmuls offer a Triton template without max-autotune, and the
  autotuner (`select_algorithm.py` L4062-4070: more than one choice means a benchmark unless
  `config.deterministic`) can pick it.
- `_use_small_mm_pointwise` (`kernel/mm_common.py` L197-215): with max-autotune off, a matmul with
  K and N both below 5 and M of at least 64 becomes a fused pointwise kernel.
- `CUTEDSL` in Inductor gates one kernel, a Blackwell grouped GEMM (`aten._grouped_mm`, BF16,
  datacenter Blackwell, max-autotune on: `utils.py` L2223-2275, `kernel/mm_grouped.py` L472).

The page states the default for mm/addmm, scopes the h2 to "linear-layer matmuls", and lists the
exceptions in the "Read from the code" disclosure. Suggest updating register C3 to match.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| C3 (text) | "Heavy matmul paths reach it through Inductor -> CUTLASS / CuTe"; Inductor "falls back to CUTLASS / cuBLAS for matmul where the size is large enough" | Default: Triton for fused pointwise/reduction ops; `aten.mm` / `aten.addmm` go to ATen, which calls cuBLAS or cuBLASLt; size does not send a matmul to CUTLASS. `mode="max-autotune"` sets `max_autotune` and benchmarks Triton GEMM templates against cuBLAS; CUTLASS joins only if listed in `max_autotune_gemm_backends` (default `ATEN,TRITON,CPP`); CUTLASS import failure logs a warning and skips the backend. Marked "read from the PyTorch v2.14.1 source code". Code snippet and line-level disclosure added | torchCompileDefault, inductorModes, inductorConfig, inductorUtils, inductorMm, inductorBmm, inductorSmallMm, inductorGroupedMm, atenLinear, atenCudaBlas (all T1 code at tag v2.14.1, spec) |
| C32 (diagram) | Inductor -> CUTLASS "matmul"; Inductor -> cuBLAS "opt-in" | Inductor -> cuBLAS / cuBLASLt "matmul (default)", solid; Inductor -> Triton / Gluon "fused ops (default)", solid; Inductor -> CUTLASS / CuTe DSL "opt-in", dashed, with a legend | same as C3 |
| C2 | "emits Triton kernels by default" | Triton for the operations it fuses; GEMMs go to cuBLAS | inductorUtils (T1) |
| C4 | Triton: "the compiler chooses tile sizes and SMEM staging" | the author picks block sizes, usually a short `triton.Config` list `@triton.autotune` benchmarks; the compiler manages layouts, memory allocation, data movement and asynchrony | tritonMatmulTutorial (T1), gluonIntro (T1) |
| C7 | TensorRT / TensorRT-LLM "Inference compiler ... Consumes ONNX / HuggingFace / custom IR" | TensorRT-LLM: PyTorch default backend since v1.0.0; v1.2.1 architected on PyTorch with a Python LLM API. TensorRT: separate product, compiles a model, usually an ONNX export, into an engine | trtllmV100 (T1), trtllmReadme (T1), tensorrtQuickStart (T1, fetched 2026-10-17; not in the register) |
| C9 | "sm_90a, sm_100" | `sm_100` (B200), `sm_103` (B300); a `compute_100f` build runs on B200, B300 and Rubin | cudaGpus (T1), computeCapabilities (T1) |
| C10 | "seven cooperating layers"; h2 "The seven layers" | no layer count; table removed (see below) | - |
| C11 | "Most production code paths reach the GPU through Inductor -> Triton" | the sourced default-path paragraph (C3) | - |
| C12 | cuBLAS / cuDNN "compiled with CUTLASS internally"; libraries "internally use CUTLASS for the hottest paths" | TensorRT-LLM ships CUTLASS and CuTe DSL MoE backends; "this research located no NVIDIA statement of what cuBLAS, cuDNN or cuTENSOR use internally" | wideEpReadme (T1: backends `WIDEEP`, `CUTLASS`, `TRTLLM`, `CUTEDSL`) |
| C13 | CUDA C++ Programming Guide link (2026-04-23) | stale link removed with the sources box; the v13.4.2 guide's "Writing Tile Kernels" page is cited | cudaTileGuide (T1) |
| C15 | "fused MoE kernels, NVFP4 cubins, FP8 OOTB MoE (since v0.12.0)" | custom attention kernels and FP8 and FP4 quantization (README v1.2.1); FP8 MoE support from v0.12.0. "NVFP4 cubins" re-expressed because the register's evidence covers only FP8 MoE | trtllmReadme (T1), trtllmV0120 (T1) |
| C16 | Wide-EP "targeting GB200 NVL72 specifically" | prerequisites name GB200 NVL72, GB300 NVL72, H20 or RTX 6000D | wideEpReadme (T1) |
| C17 | "MNNVL all-to-all over NVLink rather than falling back to NCCL all-gather over InfiniBand" | communication kernels for Multi-Node NVLink (MNNVL); contrast clause dropped | wideEpReadme (T1) |
| C18 | wide_ep link on `main` | `tree/v1.2.1/examples/wide_ep` | wideEpExample (T1) |
| C25 | (absent) | v1.2.1, the latest stable release (April 2026) | trtllmV121 (T1) |
| C33 | libraries -> PTX -> ptxas | cuBLAS / cuBLASLt drawn as prebuilt kernels with a direct edge to SASS | register reading (C33); no new assertion beyond "prebuilt" |
| (xref) | "Section 5 said the kernel lifecycle has seven stages. Stages 4-6..." | "operand staging and the functional unit, two of the stages *Anatomy of a Kernel Execution* follows" | - |

CORRECT claims kept and re-cited: C1 (torchCompileDefault), C5 (cutlassReadme), C6 (TMEM in
CUTLASS kernels, cutlassChangelog), C8, C26 (Nsight Compute stall reasons, nsightComputeGuide),
C27 (Nsight Systems scope, nsightSystemsGuide).

## Claims removed and why

- TensorRT-LLM version-history Alert (C19, C20, C21, C22, C23, C24): CUT candidate. Kept one
  sentence: "MoE kernels land release by release in TensorRT-LLM and CUTLASS, so check the release
  your kernel path landed in before you pin a version." FP8 MoE since v0.12.0 survives in prose
  (C15). Example 92 from v4.2.0 is already in NVIDIA Blackwell.
- C14 "most inference servers compose both": CUT candidate, unsourced.
- The "Authoritative sources" box with plain Links and "All access dates 2026-04-23": replaced by
  inline `Cite`s.
- The eight-row layer table: every row is now carried by the diagram, the default-path prose, the
  authoring-path block or the TensorRT-LLM paragraph; it failed the leverage test as a duplicate,
  and cutting it paid for most of the NEW content.
- "None of this is the silicon's decision; the silicon is the substrate. The compiler is the
  lever.": rhetorical; the model survives as "Knowing which layer produced a kernel tells you
  which knob changes it."
- Triton "good error messages" and "not always at peak for the most heavily-tuned matmuls",
  CUTLASS "peak performance" strength and "slower iteration": unsourced. Replaced by the Gluon
  tutorial's limit ("when hand-tuned low-level code beats the compiler, Triton hides the
  details") and the CUTLASS README's case for CuTe DSL (smoother learning curve, faster
  compiles). "The right tool for ..." guidance kept in shortened form.
- "TensorRT-LLM ... adds inference-specific graph optimizations and fused kernels (FP8 MoE, NVFP4
  MoE, fused attention)": replaced by the README-sourced feature list.
- "Default backend for torch.compile/Inductor on NVIDIA" (Triton column): corrected to "Inductor
  generates Triton for the operations it fuses".

## UNKNOWNs

- C11: replaced by the sourced default path.
- C12: cuBLAS internals stated as a scoped silence ("this research located no NVIDIA
  statement"). The cuDNN frontend partial evidence (two bug-fix lines in the CUTLASS CHANGELOG)
  was too thin to carry a claim and is not used.
- C22: cut with the Alert.
- C33: drawn as the register recommends (prebuilt branch); the page makes no claim about how
  NVIDIA builds the libraries.

## NEW content and its sources

- C28 CuTe DSL: CuTe's layouts, tensors and hardware atoms from Python with full control of the
  thread and data hierarchy; first released with CUTLASS 4.0, still public beta at v4.8.0
  (cutlassReadme); emits PTX (cuteDslCompileOptions: `keep-ptx`); v4.8.0 adds initial Rubin dense
  GEMMs (cutlassChangelog); Inductor's CUTEDSL backend Blackwell SM100-SM109 only
  (inductorConfig). The README's "will graduate out of beta by end of summer 2026" forecast is
  not used.
- C29 Gluon: lower-level language on Triton's compiler stack, exposing layouts, memory
  allocation, data movement and asynchrony (gluonIntro, T1, fetched 2026-10-17, not in the
  register); Triton v3.8.0 (August 2026) adds Cluster Launch Control for Blackwell Gluon kernels
  and a Rubin-specific Gluon module (tritonV380).
- C30 CUDA Tile / cuTile: tile operations, the compiler handles the lowest level of parallelism
  and reaches TMA and Tensor Cores; cuda.tile and cuda::tiles share CUDA Tile IR; Tile C++ in the
  CUDA Toolkit from 13.3 (cudaTileGuide); cuTile Python 1.6.0 needs compute capability 8.x to
  12.x and driver r580 or later; tileiras needs ptxas and libnvvm (cutileQuickstart).
- C34: a cuTile / Tile C++ node in the diagram, edge to SASS (drawn without a PTX hop, because
  the quickstart says tileiras depends on ptxas, not that it emits PTX).
- C9 compute targets, C25 TRT-LLM stable version (see table above).
- Nsight Compute stall reasons mapped to operand staging (long scoreboard = L1TEX wait, short
  scoreboard usually shared memory, no instructions = very short kernels under one wave) and
  locked SM clocks by default (nsightComputeGuide); workflow "Systems first, then right-click the
  kernel to open Nsight Compute" (nsightSystemsGuide). Added for monitoring leverage and to end
  the section on the reader's next action.

## Diagram

`NvidiaCompilerStack.tsx` stays React Flow. Changes: a custom `stack` node type renders the
title and each sub-line as its own `<div>` (the old `\n` labels had collapsed to one line);
multiple handles per node (three Inductor source handles so the three routes do not share one
trunk; SASS takes edges on its top, left and right); 8 nodes in a top-down layout (PyTorch,
TorchInductor, cuBLAS / cuBLASLt, Triton / Gluon, CUTLASS / CuTe DSL, cuTile / Tile C++, PTX,
SASS in a cubin); edges per C32 and C33 with distinct step positions so the three edge labels
sit at different heights; animation removed so dashed means opt-in; a legend under the canvas
(Cloudscape `Box`, so it reads in dark mode); a white canvas; fonts 13 to 14px in nodes and 12px
on edge labels; a `role="img"` wrapper with `aria-labelledby` pointing at a visually hidden
sentence that states what the diagram asserts. Mobile: the canvas keeps `minWidth: 760` inside
an `overflowX: auto` wrapper (the sibling Nvl72Diagram pattern) instead of the old behaviour,
where fitView hit React Flow's 0.5 minimum zoom and clipped PyTorch and SASS off both sides at
390. Pan, zoom and scroll capture are off, and computed `touch-action` is `auto`, so a phone
can swipe the wrapper.

Rendered check (build in `/tmp/silicon-dist-nvidia-compilers`): `scripts/shoot.mjs` reported
"4 diagram(s), ok" at 1440 and 390 (it measures only the four edge-label SVGs React Flow
renders; no page-level horizontal overflow). Node HTML checked with a separate Playwright pass:
no node's text overflows (the SASS node's 3px scroll width comes from its side handles), zoom is
0.93 at 1440 and 0.88 at 390 (smallest rendered text about 10.5px). PNGs read at 1440 and at
390 (wrapper scrolled to left, middle and right): every label inside its box, the three Inductor
labels separate, no label crossing a line other than its own edge, arrows land on the right
handles. Fixed after earlier shoots: touching "matmul" and "fused ops" labels on a shared bus, a
mixed-colour trunk, a 2px desktop scroll from the canvas border, and the three-paths table
hiding its version column off-screen at 390 (now a ColumnLayout that stacks).

## Length

Rendered visible words (section text after the h1, excluding navigation, citation badges, the
diagram and the code block, with disclosures open): 773 before, 1110 after (+44%). Reasons per
added block: the three authoring paths (register NEW C28 to C30, about 170 words); the opt-in
paragraph and the "Read from the code" disclosure (the register's code-confirmed correction C3,
which the orchestrator asked to mark as code-read, about 200 words); the stall-reason mapping
and the closing workflow (monitoring leverage and the next action, about 70 words). Everything
else shrank: removing the layer table, the version Alert, the sources box and C14 took the
remaining prose to about 670 words.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:

1. torch.compile's default backend is Inductor: torchCompileDefault.
2. Inductor generates Triton for fused pointwise and reduction ops: inductorUtils / inductorMm (Triton is the codegen path; templates gated).
3. `aten.mm` / `aten.addmm` are what a linear layer usually lowers to: atenLinear.
4. They go to ATen by default: inductorUtils (`use_aten_gemm_kernels`), inductorMm (`tuned_addmm` early return, `tuned_mm` gating).
5. ATen calls cuBLAS or cuBLASLt: atenCudaBlas.
6. Size does not send a matmul to CUTLASS: inductorUtils (`use_cutlass_template`).
7. `mode="max-autotune"` sets `max_autotune`: inductorModes. Benchmarks and keeps the fastest: inductorMm / select_algorithm reading (autotune_select_algorithm picks the best timing).
8. CUTLASS needs the backend list; default `ATEN,TRITON,CPP`; env var: inductorConfig, inductorUtils.
9. CUTLASS import failure logs a warning and skips: inductorUtils L2309-2316.
10. CUTEDSL adds a BF16 grouped GEMM on datacenter Blackwell: inductorGroupedMm, inductorUtils L2223-2275.
11. bmm / INT8 / FP8 exceptions; small-K,N pointwise: inductorBmm, inductorMm, inductorSmallMm.
12. Triton block sizes and autotune: tritonMatmulTutorial. Compiler manages layouts, memory allocation, data movement and asynchrony; Triton's limit; Gluon exposes it: gluonIntro.
13. CUTLASS kernels use TMEM: cutlassChangelog. CuTe DSL: smoother learning curve, faster compiles: cutlassReadme.
14. TensorRT-LLM CUTLASS and CuTe DSL MoE backends: wideEpReadme. cuBLAS silence: scoped to this research.
15. Three paths (C28 to C30): cutlassReadme, cuteDslCompileOptions, cutlassChangelog, inductorConfig, gluonIntro, tritonV380, cudaTileGuide, cutileQuickstart.
16. TRT-LLM PyTorch default since v1.0.0; v1.2.1 latest stable April 2026; PyTorch-architected LLM API, attention kernels, FP8/FP4: trtllmV100, trtllmV121, trtllmReadme. FP8 MoE from v0.12.0: trtllmV0120. TensorRT engine from ONNX: tensorrtQuickStart.
17. Wide-EP MNNVL kernels and GPU prerequisites: wideEpReadme.
18. `sm_100` B200, `sm_103` B300: cudaGpus; `compute_100f` on B200, B300, Rubin: computeCapabilities.
19. Nsight Systems scope, "is the GPU kept fed", launching Nsight Compute from a kernel: nsightSystemsGuide. Stall-reason meanings and clock locking: nsightComputeGuide.

Our readings, labelled or framed as guidance: "Knowing which layer produced a kernel tells you
which knob changes it" (re-expression of the original "the compiler is the lever"); "check the
compile log before calling a result a CUTLASS result" (action drawn from 9); "the autotuner can
pick Triton for them" (from 11 plus select_algorithm benchmarking whenever there is more than
one choice); "stall reasons read as operand-staging diagnoses" (maps 19 onto Anatomy of a Kernel
Execution's stage names); "Use it for novel and fused operators" and "for matmul-class kernels at
peak throughput" (kept from the before, shortened).

## For the orchestrator

- `sources.md` needs regenerating for the 29 records here. URLs not in any other file yet: all
  PyTorch v2.14.1 code links, Triton matmul tutorial, Gluon intro at v3.8.0, Triton v3.8.0
  release, CUTLASS README v4.8.0, CuTe DSL JIT options page, CUDA guide Writing Tile Kernels,
  cuTile quickstart, TensorRT Quick Start Guide, TensorRT-LLM README v1.2.1 and releases v1.0.0,
  v0.12.0, v1.2.1, wide_ep tree at v1.2.1, Nsight Systems User Guide, Nsight Compute Profiling
  Guide.
- Glossary acronyms used here: PTX, SASS, SM, CUTLASS, CuTe, CuTe DSL, DSL, GEMM, ATen (name),
  cuBLASLt, TMA, TMEM, IR (in "CUDA Tile IR"), LLM, MoE, Wide-EP / EP, MNNVL, ONNX, NCCL, L1TEX,
  BF16, FP8, FP4, INT8, PCIe, NVLink, NVL72. The existing glossary PTX entry contains an em-dash
  and the CuTe entry expands it as "CUDA Tensors", which this pass did not verify.
- `GlossaryAndSources.tsx` may still list the wide_ep example on `main` (noted by the
  Grace-Blackwell report).
- The "Why it matters" paragraph names the stages "operand staging" and "functional unit" from
  Anatomy of a Kernel Execution; keep those stage names if that section is renamed.
- Register 02-nvidia.md C3 should carry the bmm / INT8 / FP8 / small-matmul exceptions and the
  grouped-GEMM scope of CUTEDSL found above.
