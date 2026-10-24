# Verification: NVIDIA Compilers and Kernel Tooling

Verified: 2026-10-23. Claims checked: 51 (sampled: 0, every new or changed claim was opened at
its source). Confirmed 46, wrong 3, unsupported 2, mislabelled 0, unverifiable 0. One scoped
silence ("this research located no NVIDIA statement of what cuBLAS, cuDNN or cuTENSOR use
internally") is not counted: it keeps its scope and cannot be refuted by a fetch.

All PyTorch code was read at tag v2.14.1 (the GitHub API resolves the tag to commit
5c4886908584029761b579af026dcfb627c84070, matching the sources-file header), Triton at v3.8.0,
CUTLASS at v4.8.0, TensorRT-LLM at v1.2.1, v1.0.0, v0.12.0, v0.10.0 and v0.9.0. Requests used
curl's default User-Agent and the unauthenticated GitHub API; no personal data was sent. One
archived copy was read: web.archive.org capture 2026-08-01 01:19:55 of the cuTile quickstart.

## Gate 3 score: 8/10

The section's load-bearing claim, that linear-layer matmuls go to cuBLAS by default and that
max-autotune plus the backend list are the two settings that change it, holds line by line in
the PyTorch v2.14.1 source, and the section shows the reader the code, the setting and the log to
check. The three errors were peripheral (a TensorRT-LLM version date, one diagram node that
contradicted the page's own exception list, a cross-reference to a stage name that does not
exist) and are fixed. Economy holds it back from 9: the page grew 44% and the TensorRT-LLM
paragraph still carries version-history residue.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 46 of 51 confirmed; nothing load-bearing was wrong; the default-routing and max-autotune claims match utils.py, mm.py, config.py and select_algorithm.py at v2.14.1 to the line |
| Mental model or practical value | 8 | Every block gives a knob (backend list, mode), a choice (five authoring paths with a version to check) or an action (start from the wide_ep example, Nsight Systems then right-click into Nsight Compute); the "FP8 MoE support dates from" sentence gives neither |
| Shape | 8 | Introduces the stack before routing; h2 descriptions name the reader's result; the backend list ATEN,TRITON,CPP and the "two settings" land in the h2 description, prose and code; code detail demoted into "Read from the code"; ends on the Nsight Systems to Nsight Compute action |
| Writing | 8 | All gates clean; attribution sits in the links; the one in-sentence attribution is a load-bearing silence; minor acronym-order slips remain (GEMM and "CuTe DSL" appear in the diagram before the prose expands GEMM and DSL) |
| Economy | 7 | 773 to 1110 visible words (+44%, author's count); reasons given per block (register NEW content C28 to C30, the code-read disclosure); the three-path grid's "Check" cells are dense |
| Diagrams | 8 | React Flow with role="img" and an aria-labelledby description; at 390 the 760-wide canvas scrolls sideways at zoom 0.876 (smallest text about 10.5 px); node measurement found no overflowing or wrapped line, and the 1440 and scrolled 390 shots show no label collisions |

## Claims
| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | `sm_100` (B200), `sm_103` (B300) | cudaGpus | CONFIRMED | "10.3 NVIDIA GB300 NVIDIA B300 ... 10.0 NVIDIA GB200 NVIDIA B200" (CUDA GPUs list) | - |
| 2 | a `compute_100f` build runs on B200, B300 and Rubin | computeCapabilities | UNSUPPORTED (Rubin) | Table 28: "compute_100f 10.0 10.3 10.7"; the page never names Rubin | Added cutlassChangelog cite, note "4.8.0: Added initial Rubin support (SM107)." (CHANGELOG 4.8.0, C++ section), as NVIDIA Blackwell does |
| 3 | "operand staging and ... the functional unit, two of the stages *Anatomy of a Kernel Execution* follows" | (cross-ref) | WRONG | KernelLifecycleDiagram.tsx stages: "Warp scheduling", "Operand staging", "Tensor Core", "Write back"; no "functional unit" stage | "the Tensor Core" |
| 4 | torch.compile's default backend is TorchInductor | torchCompileDefault | CONFIRMED | torch/__init__.py L3019 `backend: str \| _Callable[..., _Any] = "inductor",`; L3095 `"inductor" is the default backend` | - |
| 5 | Inductor generates Triton for the pointwise and reduction operations it fuses | (none in sentence; author cited inductorUtils/inductorMm in the report) | UNSUPPORTED as cited | Neither utils.py nor mm.py states it. config.py L2818-2820: `# Backend to use for CUDA codegen either` / `# "triton", "halide" (experimental) or "pallas" (experimental)` / `cuda_backend: ... = "triton"` | Added record inductorCudaBackend (config.py#L2818-L2820, accessed 2026-10-23) and its Cite |
| 6 | `aten.mm` and `aten.addmm`, the operators a linear layer usually lowers to | atenLinear | CONFIRMED | Linear.cpp L106-108: `if (input_dim == 2 && bias->defined()) { // Fused op is marginally faster. return at::addmm(*bias, input, weight.t());`; L132 `at::matmul(input, weight.t())` | - |
| 7 | they go to ATen by default | inductorUtils, inductorMm | CONFIRMED | utils.py L2706-2709 `def use_aten_gemm_kernels() -> bool: return not (config.max_autotune or config.max_autotune_gemm) or _use_autotune_backend("ATEN")`; mm.py L429 `if use_aten_gemm_kernels(): templates_to_use.append(aten_handler)` | - |
| 8 | ATen calls cuBLAS or cuBLASLt | atenCudaBlas | CONFIRMED | CUDABlas.cpp L423 `cublasStatus = cublasLtMatmul(`; L1080 `TORCH_CUDABLAS_CHECK(cublasGemmEx(` | - |
| 9 | Matrix size does not send a matmul to CUTLASS; two settings do | inductorUtils | CONFIRMED | utils.py L2303-2307 `res = (_use_template_for_gpu(...) and (config.max_autotune or config.max_autotune_gemm) and _use_autotune_backend("CUTLASS")`; size only enters as a floor, `cutlass_backend_min_gemm_size: int = 1` (config.py L2605) | - |
| 10 | `mode="max-autotune"` turns on `max_autotune` | inductorModes | CONFIRMED | _inductor/__init__.py L384-388 `"max-autotune": { "max_autotune": True, "triton.cudagraphs": True, "coordinate_descent_tuning": True, }` | - |
| 11 | Inductor then benchmarks Triton GEMM templates against cuBLAS and keeps the fastest | inductorMm | CONFIRMED | mm.py L434-437 `and use_triton_template(layout, check_max_autotune=True)` adds `mm_template`; select_algorithm.py L4066-4075 (one choice returns, `config.deterministic` picks) then benchmarks; L4246 `best_choice = min(timings, key=timings.__getitem__)` | - |
| 12 | CUTLASS joins only when listed in `max_autotune_gemm_backends`, default `ATEN,TRITON,CPP` | inductorConfig, inductorUtils | CONFIRMED | config.py L647-649 `max_autotune_gemm_backends = os.environ.get("TORCHINDUCTOR_MAX_AUTOTUNE_GEMM_BACKENDS", "ATEN,TRITON,CPP").upper()` | - |
| 13 | `CUTEDSL` adds a CuTe DSL grouped GEMM (`torch._grouped_mm`) for BF16 on datacenter Blackwell | inductorGroupedMm | CONFIRMED | utils.py L2236-2240 docstring "1. CuTeDSL backend is enabled ... 3. We are on a blackwell arch 4. The dtype is bf16 5. Max autotune or max autotune gemm is enabled"; L2259 `if not is_datacenter_blackwell_arch():`; mm_grouped.py L262 `torch._grouped_mm`, L472 `if use_blackwell_cutedsl_grouped_mm(` | - |
| 14 | If Inductor cannot import CUTLASS, it logs a warning and skips it | inductorUtils | CONFIRMED | utils.py L2310-2317 `if not try_import_cutlass(): log.warning("Failed to import CUTLASS lib. ... Skipping CUTLASS backend for now." ...) return False` | - |
| 15 | Code comment: TORCHINDUCTOR_MAX_AUTOTUNE_GEMM_BACKENDS sets the same list | inductorConfig | CONFIRMED | config.py L647-648 (as row 12) | - |
| 16 | Disclosure line numbers: utils.py 2706-2709, kernel/mm.py 694-707 and 429-437, utils.py 2288-2318 | inductorUtils, inductorMm | CONFIRMED | utils.py L2288 `def use_cutlass_template(` to L2318 `return res`; mm.py L694-707 `if (not is_nonzero) or (not (inductor_config.max_autotune or inductor_config.max_autotune_gemm)): ... [aten_addmm] ... return node` | - |
| 17 | bmm, INT8 (`_int_mm`) and FP8 (`_scaled_mm`) offer a Triton template without max-autotune, so the autotuner can pick Triton | inductorBmm, inductorMm | CONFIRMED | bmm.py L230 `if use_triton_template(layout, check_max_autotune=False):`; mm.py L611-612 `use_triton_template(layout, enable_int32=True, check_max_autotune=False)`; L1074 and L1252 `use_triton_template(layout, enable_float8=True, check_max_autotune=False)`; the Triton mm config heuristics (heuristics/template/triton.py) are not gated on max_autotune | - |
| 18 | K and N both below 5 and M of at least 64 becomes a fused pointwise kernel | inductorSmallMm | CONFIRMED | mm_common.py L209-214 `if config.max_autotune or config.max_autotune_gemm: return False ... return skt(m >= 64) and skt(k < 5) and skt(n < 5)` | - |
| 19 | Diagram, Triton node: "fused ops; GEMM templates only under max-autotune" | inductorUtils, inductorMm | WRONG | Contradicted by row 17 (bmm, `_int_mm`, `_scaled_mm` templates without max-autotune), which the page's own disclosure lists | "fused ops; mm / addmm templates only under max-autotune"; the hidden description now says "linear-layer matrix multiplies" |
| 20 | Diagram edges: "matmul (default)" to cuBLAS, "fused ops (default)" to Triton, dashed "opt-in" to CUTLASS / CuTe DSL | inductorUtils, inductorMm | CONFIRMED | rows 7, 9, 12 (scoped to linear-layer matmuls by the h2) | - |
| 21 | CuTe DSL emits PTX | cuteDslCompileOptions | CONFIRMED | "keep-ptx Keep the generated PTX file. False bool" (JIT compilation options table) | - |
| 22 | tileiras needs ptxas and libnvvm | cutileQuickstart | CONFIRMED | "cuTile Python depends on CUDA TileIR compiler tileiras, which futher depends on ptxas and libnvvm from the CUDA Toolkit." | - |
| 23 | Triton: the author picks block sizes, a short `triton.Config` list `@triton.autotune` benchmarks | tritonMatmulTutorial | CONFIRMED | "`triton.jit`'ed functions can be auto-tuned by using the `triton.autotune` decorator, which consumes: - A list of `triton.Config` objects that define different configurations of meta-parameters (e.g., `BLOCK_SIZE_M`)"; same text at v3.8.0 python/tutorials/03-matrix-multiplication.py L223-228 | - |
| 24 | the compiler manages layouts, memory allocation, data movement and asynchrony | gluonIntro | CONFIRMED | 01-intro.py L18-20 "It defers to the compiler to manage tile layouts, memory allocation, data movement, and asynchronity." | - |
| 25 | when hand-tuned low-level code beats the compiler, Triton hides the details; Gluon exposes them | gluonIntro | CONFIRMED | L23-28 "it can be beaten by hand-tuned low-level code. When this happens, there is little the user can do ... since all the details are hidden. In Gluon, these details are exposed to the user." | - |
| 26 | CUTLASS kernels use Blackwell's Tensor Memory (TMEM) directly | cutlassChangelog | CONFIRMED | CHANGELOG L1009 "Exposure of Blackwell's new tensor memory (note: distinct from TMA) as `tmem` across CuTe as a first class data locale"; L1032 "Blackwell epilogue that supports loading accumulators from `tmem`" | - |
| 27 | CuTe DSL: same control, smoother learning curve, faster compiles | cutlassReadme | CONFIRMED | README L28 "CUTLASS DSLs ... without any performance compromises. This allows for a much smoother learning curve, orders of magnitude faster compile times" | - |
| 28 | TensorRT-LLM ships CUTLASS and CuTe DSL MoE backends | wideEpReadme | CONFIRMED | L62 "TensorRT LLM has multiple MoE backends that support wide EP, including `WIDEEP`, `CUTLASS`, `TRTLLM` and `CUTEDSL`" | MoE expansion moved here (first occurrence) |
| 29 | CuTe DSL: layouts, tensors and hardware atoms from Python, full control of the thread and data hierarchy | cutlassReadme | CONFIRMED | L30 "exposing core concepts such as layouts, tensors, hardware atoms, and full control over the hardware thread and data hierarchy" | - |
| 30 | first released with CUTLASS 4.0, still public beta at v4.8.0 | cutlassReadme | CONFIRMED | L30 "With the release of 4.0, we released the first of these in CuTe DSL"; L40 "CuTe DSL is currently in public beta" | - |
| 31 | v4.8.0 adds initial Rubin dense GEMMs | cutlassChangelog | CONFIRMED | L5 "4.8.0 (2026-09-17)"; L9 "Initial Rubin support to accelerate dense GEMMs" (CuTe DSL) | - |
| 32 | Inductor's CUTEDSL backend: Blackwell SM100 to SM109 only | inductorConfig | CONFIRMED | config.py L642 "CUTEDSL: CuteDSL templates for Blackwell GPUs (NVidia SM100-SM109 only)." | - |
| 33 | Gluon: lower-level language on the same compiler stack | gluonIntro | CONFIRMED | L5-7 "Gluon is a GPU programming language based on the same compiler stack as Triton. But unlike Triton, Gluon is a lower-level language" | - |
| 34 | Triton v3.8.0 (August 2026) | tritonV380 | CONFIRMED | GitHub release v3.8.0, published 2026-08-28, not a pre-release | - |
| 35 | adds Cluster Launch Control for Blackwell Gluon kernels and a Rubin-specific Gluon module | tritonV380 | CONFIRMED | "Blackwell Gluon kernels can use Cluster Launch Control (CLC) for dynamic work distribution in persistent kernels"; "Added initial NVIDIA Rubin (SM107) support, including ... a Rubin-specific Gluon module" | - |
| 36 | CUDA Tile: compiler handles the lowest level of parallelism, reaches TMA and Tensor Cores | cudaTileGuide | CONFIRMED | "leaves the lowest level of parallelism to the compiler and built-in operations. By doing so, tile provides a simpler way to access ... the tensor memory accelerator (TMA) unit and the tensor cores" (2.4 Writing Tile Kernels) | - |
| 37 | cuda.tile and cuda::tiles share one backend, CUDA Tile IR | cudaTileGuide | CONFIRMED | "CuTile Python (cuda.tile) and CUDA Tile C++ (cuda::tiles), which share a common compiler backend (CUDA Tile IR)" | - |
| 38 | CUDA Tile C++ ships in the CUDA Toolkit from 13.3 | cudaTileGuide | CONFIRMED | "CUDA Tile C++ is available in the CUDA Toolkit from version 13.3 onward." | - |
| 39 | CUDA Programming Guide v13.4.2 (record titles) | cudaTileGuide, computeCapabilities | CONFIRMED | page header "CUDA Programming Guide v13.4.2" on both pages | - |
| 40 | cuTile Python 1.6.0 needs compute capability 8.x to 12.x and driver r580 or later | cutileQuickstart | CONFIRMED | "A GPU with compute capability 8.x, 9.x, 10.x, 11.x or 12.x / NVIDIA Driver r580 or later"; same text in the 2026-08-01 archive capture (1.5.0 era) and today's page (1.7.0, 2026-10-19), so it holds for 1.6.0 (2026-09-09) | - |
| 41 | PyTorch has been TensorRT-LLM's default backend since v1.0.0 | trtllmV100 | CONFIRMED | v1.0.0 notes: "**BREAKING CHANGE** Promote PyTorch to be the default LLM backend" | - |
| 42 | v1.2.1, the latest stable release (April 2026) | trtllmV121 | CONFIRMED (2026-10-23) | `/releases/latest` redirects to tag v1.2.1, published 2026-04-20; every newer tag (v1.3.0rc12 to rc29, v1.4.0rc0, v1.4.0rc1 of 2026-10-22) is a pre-release | - (see For the orchestrator) |
| 43 | v1.2.1 is architected on PyTorch with a Python LLM API, custom attention kernels and FP8 and FP4 quantization | trtllmReadme | CONFIRMED | README L231 "custom attention kernels, inflight batching, paged KV caching, quantization (FP8, FP4, ...)"; L233 "Architected on PyTorch, TensorRT LLM provides a high-level Python LLM API" | - |
| 44 | FP8 MoE support dates from v0.12.0 | trtllmV0120 | WRONG | v0.10.0 notes (2024-06-05): "Added FP8 quantization support for Mixtral."; mixtureOfExpertsPlugin.cpp at v0.10.0 L201-207 `#ifdef ENABLE_FP8 else if (mType == DataType::kFP8 && mWeightType == DataType::kFP8) ... CutlassMoeFCRunner<__nv_fp8_e4m3, __nv_fp8_e4m3>`; the same file at v0.9.0 has no FP8 path. v0.12.0's "Supported FP8 OOTB MoE" covers the out-of-the-box path only | "FP8 MoE support dates from v0.10.0", cited to new records trtllmV0100 and trtllmMoePluginV0100; trtllmV0120 removed (no other file used it) |
| 45 | TensorRT compiles a trained model, usually an ONNX export, into a GPU-specific engine | tensorrtQuickStart | CONFIRMED | "A builder that compiles your model into a serialized, hardware-specific binary called an engine ... You typically start from a trained model exported to ONNX" | - |
| 46 | Wide-EP: communication kernels for MNNVL; prerequisites GB200 NVL72, GB300 NVL72, H20 or RTX 6000D | wideEpReadme | CONFIRMED | L15 "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)"; L24 "GPU: GB200 NVL72, GB300 NVL72, H20, or RTX 6000D." | - |
| 47 | Wide-EP example at v1.2.1 | wideEpExample | CONFIRMED | `tree/v1.2.1/examples/wide_ep` returns 200, pinned to the release tag | - |
| 48 | Nsight Systems: launches, streams, NCCL, CPU, and GPU metrics for PCIe, NVLink, memory throughput, SM utilization | nsightSystemsGuide | CONFIRMED | "IO throughputs: PCIe, NVLink, and GPU memory bandwidth / SM utilization: SMs activity, tensor core activity ..."; `--nccl-trace` options | - |
| 49 | long scoreboard = L1TEX wait; short scoreboard usually shared memory; no instructions typical of very short kernels under one full wave | nsightComputeGuide | CONFIRMED | "stalled waiting for a scoreboard dependency on a L1TEX (local, global, surface, texture) operation"; "MIO ... (not to L1TEX). The primary reason ... is typically memory operations to shared memory"; "A high number of warps not having an instruction fetched is typical for very short kernels with less than one full wave" | - |
| 50 | Nsight Compute locks SM clocks by default, so durations can differ from Nsight Systems' | nsightComputeGuide | CONFIRMED | "Clock control: Nsight Compute locks SM clocks by default. Nsight Systems does not lock clocks." | - |
| 51 | right-click the kernel on the timeline to open it in Nsight Compute | nsightSystemsGuide | CONFIRMED | "Launching NVIDIA Nsight Compute from a CUDA Kernel: After you have used CUDA trace in Nsight Systems to locate a potential problem kernel ... Right click on the kernel to bring up a menu." | - |

Record titles with dates were checked against the GitHub API: trtllmV100 2025-09-24, trtllmV121
2026-04-20, tritonV380 2026-08-28, cutileQuickstart 1.6.0 2026-09-09: all confirmed.

## ORCH-NOTES items

ORCH-NOTES names no item for this section. Related items:
- Glossary, CuTe has no expansion: this section never expands CuTe, and the CUTLASS README at
  v4.8.0 does not expand it either. Consistent; the glossary entry belongs to the orchestrator.
- Length growth: this section is not on the list but grew 44% (author's count). Judged under
  Economy (7).
- Rubin compute capability 10.7 cited to a page that never names Rubin (raised for
  Quantization): the same gap was here (row 2). Fixed the way NVIDIA Blackwell does it.

Items the caller asked for, with verdicts:
- PyTorch v2.14.1 Inductor claims: CONFIRMED. Fused pointwise and reduction ops go to Triton
  (config.py L2818-2820, now cited). `aten.mm` and `aten.addmm` go to ATen, which calls cuBLAS or
  cuBLASLt (utils.py L2706-2709, mm.py L429 and L694-707, CUDABlas.cpp L423 and L1080).
  max-autotune benchmarks the Triton templates against cuBLAS (mm.py L434-437, select_algorithm.py
  L4066-4075 and L4246). CUTLASS needs max-autotune and `CUTLASS` in the list, default
  `ATEN,TRITON,CPP` (utils.py L2303-2307, config.py L647-649). Quotes in rows 4 to 18.
- Triton v3.8.0 and Gluon: CONFIRMED. The author picks block sizes through a `triton.Config` list
  that `@triton.autotune` benchmarks (tutorial, also at v3.8.0 L223-228). The compiler manages
  tile layouts, memory allocation, data movement and asynchrony (Gluon 01-intro.py L18-20 at
  v3.8.0). Gluon hands those to the author.
- TensorRT-LLM: PyTorch default since v1.0.0 CONFIRMED. v1.2.1 is still the latest stable
  release on 2026-10-23 (`/releases/latest` points to v1.2.1; newer tags are all pre-releases), so
  the "latest" wording stays accurate and was not changed. FP8 MoE from v0.12.0 is WRONG: it dates
  from v0.10.0. Fixed (row 44). wide_ep pinned at v1.2.1 CONFIRMED.
- CUTLASS v4.8.0 and CuTe DSL: CONFIRMED (rows 26, 27, 29 to 32). cuTile and the CUDA
  Programming Guide v13.4.2 "Writing Tile Kernels" page: CONFIRMED (rows 22, 36 to 40).
- GitHub pinning: every GitHub URL (PyTorch, Triton, CUTLASS, TensorRT-LLM) is pinned to a release
  tag, and the three new records are too. pinned-refs gate exit 0. Tiers: no mismatch. Every URL
  shared with another sources file (gluonIntro, cutlassChangelog, computeCapabilities, cudaGpus,
  trtllmV100, wideEpReadme, wideEpExample) has the same tier and title in AwsCompilersAndTooling,
  QuantizationAndPrecision, NvidiaBlackwell, KernelExecutionLifecycle, NvidiaHopper,
  MoeAndSparseActivation, GraceBlackwellUltraServer and CommunicationAndScaleOut.

## Fixes applied

- src/sections/NvidiaCompilersAndTooling.tsx:102, added after the computeCapabilities cite:
  `<Cite s={S.cutlassChangelog} note="4.8.0: Added initial Rubin support (SM107)." />`
- src/sections/NvidiaCompilersAndTooling.tsx:106: "at operand staging and at the functional unit,
  two of the stages" became "at operand staging and at the Tensor Core, two of the stages".
- src/sections/NvidiaCompilersAndTooling.tsx:136-137: "reduction operations it fuses, and sends"
  became "reduction operations it fuses" + `<Cite s={S.inductorCudaBackend} />` + ", and sends".
- src/sections/NvidiaCompilersAndTooling.tsx:231-232: "CuTe DSL MoE backends" became "CuTe DSL MoE
  (mixture of experts) backends" (the first occurrence of MoE).
- src/sections/NvidiaCompilersAndTooling.tsx:270-272: "FP8 MoE (mixture of experts) support dates
  from v0.12.0. <Cite trtllmV0120/>" became "FP8 MoE support dates from v0.10.0. <Cite
  trtllmV0100/><Cite trtllmMoePluginV0100/>".
- src/components/NvidiaCompilerStack.tsx:145, Triton node: `'fused ops; GEMM'` became
  `'fused ops; mm / addmm'` (lines 2 and 3 unchanged: "templates only under", "max-autotune").
- src/components/NvidiaCompilerStack.tsx:278, hidden description: "sends matrix multiplies to
  cuBLAS" became "sends linear-layer matrix multiplies to cuBLAS".
- src/sources/NvidiaCompilersAndTooling.ts: added `inductorCudaBackend`
  (https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/config.py#L2818-L2820),
  `trtllmV0100` (https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.10.0) and
  `trtllmMoePluginV0100`
  (https://github.com/NVIDIA/TensorRT-LLM/blob/v0.10.0/cpp/tensorrt_llm/plugins/mixtureOfExperts/mixtureOfExpertsPlugin.cpp#L201-L217).
  All are Tier 1 and accessed 2026-10-23. Removed `trtllmV0120`.

## Checks

- `pnpm exec tsc --noEmit | grep -E "NvidiaCompilersAndTooling|NvidiaCompilerStack|sources/NvidiaCompilersAndTooling"`: no hits (grep exit 1).
- `pnpm exec eslint src/sections/NvidiaCompilersAndTooling.tsx src/sources/NvidiaCompilersAndTooling.ts src/components/NvidiaCompilerStack.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t NvidiaCompilersAndTooling`: exit 0 (1 passed, 34 skipped).
- Gates: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits for this section or its component.
- `pnpm exec vite build --outDir /tmp/vf-NvidiaCompilersAndTooling-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections nvidia-compilers --widths 1440,390 ...`: exit 0. "4 SVG diagram(s), 1 React Flow, ok" at both widths.
- Separate Playwright pass (script in /tmp/vf-nct-scripts): no node line overflows or wraps at 390 or 1440. Zoom is 0.876 at 390 and 0.932 at 1440, and the 390 wrapper scrolls 760 over 308 px. Read the PNGs at 1440 and at 390 (wrapper scrolled left, middle and right). The Triton node's three lines sit inside the box, and no label crosses a line other than its own edge.

## For the orchestrator

- Register `research/2026-10-refresh/02-nvidia.md` C15 and C20: "FP8 MoE since v0.12.0" holds only
  for the OOTB path ("Supported FP8 OOTB MoE"). FP8 MoE itself is in v0.10.0 (Mixtral FP8 in the
  notes, the FP8 CUTLASS MoE runner in the plugin). The register's C20 note already says "FP8
  quantization for Mixtral was v0.10.0".
- The author's report asks to keep the stage names "operand staging" and "functional unit". The
  Anatomy of a Kernel Execution diagram has no "functional unit" stage. This section now names
  "Operand staging" and "Tensor Core" (KernelLifecycleDiagram.tsx), so those are the names to keep.
- sources.md and the Glossary and Sources appendix need the three new records listed above.
  trtllmV0120 is gone; no other file used its URL.
- "v1.2.1, the latest stable release (April 2026)" is true on 2026-10-23 but will go stale the
  day v1.3.0 or v1.4.0 ships stable (v1.4.0rc1 came out 2026-10-22). The verification brief does
  not allow rewording it, so it is reported here. The same applies to the record title
  `cutileQuickstart` "(1.6.0, 2026-09-09)": the unversioned page now serves 1.7.0 (2026-10-19),
  with the same prerequisites.
- Rubin is SM107 in both the CUTLASS 4.8.0 CHANGELOG and the Triton v3.8.0 notes. Any section
  that states "Rubin is 10.7" should cite one of them alongside the Compute Capabilities page.

## Backlog

- Economy: the sentence "FP8 MoE support dates from v0.10.0" is version history with little
  practical value. Cutting it would leave "MoE kernels land release by release ... check the
  release" to carry the point. It was not cut, because the verification brief allows correction
  only.
- Pin the Triton matmul tutorial to `python/tutorials/03-matrix-multiplication.py` at v3.8.0
  (L223-228 holds the same text) instead of triton-lang.org/main. The CuTe DSL JIT options page
  is on docs "latest" and could be pinned to a version path if NVIDIA publishes one.
- The diagram's "prebuilt kernels" for cuBLAS and the cuBLAS-to-SASS edge are a register reading
  (C33) with no citation. They are qualitative.
- Acronym order: GEMM and "CuTe DSL" first appear in the diagram, before the prose expands GEMM
  and DSL. "SM100 to SM109" appears before the SM expansion in the profiling block. BF16 is
  never expanded.
- The three-path grid's "Check" cells carry several versions each. A shorter check per path would
  read faster on a phone.
