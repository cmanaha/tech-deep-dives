# Verification: AWS Compilers and Kernel Tooling (TorchNeuron update, Neuron SDK 2.33.0)

Status: COMPLETE

Verified: 2026-10-24. Scope: every claim added or changed in
`git diff 06fc267 e903e84 -- src/sections/AwsCompilersAndTooling.tsx src/sources/AwsCompilersAndTooling.ts src/components/AwsCompilerStack.tsx src/components/TorchNeuronStackDiagram.tsx`.
Claims checked: 93 (sampled: 0, every claim opened at its source). Confirmed 84, wrong 5,
unsupported 4, mislabelled 0, unverifiable 0.

Evidence handling: every Neuron page was fetched again on 2026-10-24 from `/en/v2.33.0/` with curl's
default User-Agent (22 pages, all HTTP 200), plus the PyTorch blog, the Hugging Face blog, the TRL v1.16.0
docs and the SemiAnalysis post. Two PyTorch-blog charts (images 5 and 6) were downloaded and read,
because the coverage figures appear only in the charts. Code was read with grep/sed at
`/tmp/tn-research/torch-neuronx` (commit b1b6c66, tag v2.33.0, confirmed by `git ls-remote` as
`refs/tags/v2.33.0`). Released-wheel defaults came from the RELEASE `_build_config.py` in the published
wheel, unpacked at `/tmp/tn-research/tnx-wheel/x`. torchtitan-neuron `release-2.33.0` (b7582e98) and
vllm-neuron `v0.29.0.1.2.0` (eb6cb360) are tags. vLLM `v0.29.0/pyproject.toml` L10 was read from
raw.githubusercontent. Register rows were used as leads only.

## Gate 3 score: 8/10

After five scope corrections, the section is accurate. None of the errors was a fabricated figure. Each
one stated a scope too broadly: the XLA build on Trn2/Trn3, the FP8 gate, the dispatcher in the diagram,
the sort threshold. It gives the reader a working model of eager versus compiled execution, plus a
practical checklist backed by code-checked environment variables and doc-versus-code conflicts. Every
vendor figure carries its tier and attribution. Economy is the weakest criterion: prose roughly tripled
for two new h2s, and several sentences stack four or five citations.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy | 9 | 84/93 confirmed. The load-bearing error was the h1 claim that PyTorch on Trn2/Trn3 is TorchNeuron only; the 2.33.0 PyTorch notes put the XLA build on "Trn1, Inf2, Trn2, and Trn3". Fixed. Every coverage and speed figure matches its source exactly. |
| Mental model or practical value | 9 | The model is one NEFF per op versus one per graph, NKI as a custom call, and c10d. The practical part covers the porting steps, the `get_fallback_ops()` check, `dynamic=False` set by hand, the NEFF cache variables and `TORCH_DEVICE_BACKEND_AUTOLOAD=0`. Every block does one or the other. |
| Shape | 8 | Things are introduced before they are dissected, and the h2 descriptions state the payoff. The component table and maturity figures are demoted into ExpandableSections. The section ends on "Then call it from PyTorch". No single strongest number is repeated. |
| Writing | 8 | The no-ai-tells gate is clean. Attribution in sentences is limited to load-bearing cases: vendor grade ("AWS reports", "Hugging Face reports", "SemiAnalysis measured"), conflict ("AWS's pages disagree") and recommendation strength. "TorchInductor plays no part" is a negative definition, but it is practical. |
| Economy | 7 | The author's log puts growth at about 1,000 to 3,000 words. The plan required the new scope, but "One package name, two products" and "Training" are dense, and citation stacking is heavy. |
| Diagrams | 9 | TorchNeuronStackDiagram has `role="img"` and a `<title>`, and uses the 640 px min-width scroll wrapper. After the fixes the 1440 shot shows no overlap, and at 390 the labels are legible inside the scroll viewport. The React Flow labels are correct. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | h1: "PyTorch on Trn2 and Trn3 runs on TorchNeuron ... JAX, and PyTorch on Trn1 and Inf2, stay on XLA" | torchNeuron233, pytorchXlaNotes233 | WRONG (scope) | pytorch.html v2.33.0: "torch-neuronx 2.9.0.2.15.32035, the XLA-based PyTorch NeuronX build, on Trn1, Inf2, Trn2, and Trn3"; whats-new: "PyTorch/XLA inference - Support on Trn2 and Trn3 ends in Neuron 2.34" | Restated: PyTorch 2.13/2.14 on Trn2/Trn3 run on TorchNeuron; PyTorch 2.9 uses the XLA build, which runs on all four families and is the only PyTorch path on Trn1/Inf2. Added whatsNew233 cite. |
| 2 | JAX NeuronX compiles through XLA | whatIsNeuron233 | CONFIRMED | "JAX support includes XLA compilation targeting Inferentia and Trainium hardware" | |
| 3 | Deprecated XLA build of torch-neuronx 2.9 on Trn1/Inf2 | pytorchXlaNotes233 | CONFIRMED | "This page tracks the XLA-based PyTorch NeuronX build, which is deprecated" | |
| 4 | Both front ends: neuronx-cc to NEFF, Neuron Runtime loads and runs it | neuronCompiler, vllmTorchNeuronDesign | CONFIRMED | compiler/index: "compiled into a NEFF file ..., which is then loaded by the Neuron Runtime"; design page: "The Neuron Runtime runs the NEFFs" | |
| 5 | AwsCompilerStack: "TorchNeuron: StableHLO; JAX, torch-neuronx 2.9: an XLA graph", edge "StableHLO or XLA graph", caption | torchNeuron233, nkiOverview | CONFIRMED | about-pytorch-neuron: "lowers the FX graphs to StableHLO MLIR" | |
| 6 | Four stages "whichever front end produced the graph", back end allocates and schedules | nkiOverview | CONFIRMED | nki/index v2.33.0 "How NKI works": four stages; "memory allocation and instruction scheduling are done in this stage". The page does not split stages by front end. | |
| 7-18 | Component table: TorchNeuron 2.14.3.0/2.13.3.0; XLA build 2.9.0.2.15.32035; jax-neuronx 0.10.0.1.0.14198 (JAX 0.7.0 to 0.10.0); neuronx-cc 2.28.7631.0; NKI 0.7.0; Runtime 2.35.30.0; nrtpy 2.35.30; TorchTitan Neuron 0.2.2+neuron.1; vLLM Neuron 0.29.0.1.2.0; Dev Tools 2.33.38.0; Observer 0.2.0; NxDI "no 2.33.0 release; last 0.10.18399 in 2.31.0"; header "Neuron 2.33.0 (October 2026)" | releaseNotes233, torchNeuronNotes, pytorchXlaNotes233, nxdiArchive | CONFIRMED (12) | release-notes/index v2.33.0, the component table row by row; "On 10/19/2026, AWS released version 2.33.0"; no NxD row. nxd-inference archive: "the last release was 0.10.18399 in Neuron 2.31.0" (the same page's header reads 0.10.18398; the package line says 0.10.18399) | |
| 19 | Open source at aws-neuron/torch-neuronx, public beta from 2.33.0, Trn2 and Trn3 | torchNeuron233, torchNeuronxRepo | CONFIRMED | "TorchNeuron is in public beta for the Neuron 2.33 release. It is supported on Trainium 2 (trn2) and Trainium 3 (trn3)" | |
| 20 | PrivateUse1 device `neuron`; dispatcher routes ATen ops | torchNeuron233, whatsNew233, tnxDeviceRegistration | CONFIRMED | "PyTorch's dispatcher routes tensor operations to the Neuron backend"; `__init__.py` L271 `torch.utils.rename_privateuse1_backend("neuron")` | |
| 21 | `import torch` autoloads via `torch.backends` entry point | torchIndex233, tnxEntryPoints | CONFIRMED | torch/index: "PyTorch autoloads TorchNeuron on import torch through the torch.backends entry point"; pyproject L12-13 | |
| 22 | Eager: per-op StableHLO, NEFF on first use, async enqueue | torchNeuron233 | CONFIRMED | "lowers it to StableHLO, compiles it to a NEFF, and enqueues it for asynchronous execution" | |
| 23 | Eager at -O1; -O1 "minimizing compile time" | tnxEagerOptLevel, compilerCli | CONFIRMED | KernelExecution.cpp L105 `return "-O1";`; CLI: "1: enables the core performance optimizations ..., while also minimizing compile time" | |
| 24 | Cache key: shapes, dtypes, strides; hit skips Python and compiler | tnxDispatchCacheKey | CONFIRMED | CacheKeyGenerator.cpp L95-L118 (sizes, scalar type, strides); NeuronDispatcher.cpp L2900 "CACHE HIT (no GIL)" | |
| 25 | Eager intermediates travel through HBM | pytorchBlog | CONFIRMED | "each operation compiles its own ... NEFF ..., and moves its intermediates through HBM" | |
| 26 | Concatenation experimental, off; `TORCH_NEURONX_ENABLE_CONCATENATION=1` | torchNeuronNotes | CONFIRMED | "Experimental features: Operation concatenation ... It is disabled by default. Set TORCH_NEURONX_ENABLE_CONCATENATION=1" | |
| 27 | `backend="neuron"` via `torch_dynamo_backends` entry point | tnxEntryPoints | CONFIRMED | pyproject L15-16 | |
| 28 | Dynamo FX, AOTAutograd fwd+bwd, StableHLO, one NEFF per graph, no Inductor | torchNeuron233, tnxAotAutograd | CONFIRMED | "compiles each graph to a single NEFF"; "without using TorchInductor"; backend.py L1893-L1904 `aot_autograd(**aot_kwargs)` | |
| 29 | Graph compiles -O2 (compiler default) with `--model-type transformer --auto-cast=none` | tnxGraphCompileFlags, compilerCli | CONFIRMED | KernelExecution.cpp L176 and L189, used by `compile_graph` (NeuronBindings.cpp L2007), which `neuron_dynamo_backend/compile.py` L104 calls; CLI "2: [default]" | |
| 30 | A graph break gives segments with less context | torchNeuron233 | CONFIRMED | "graph breaks reduce optimization opportunities because the compiler has less context for each segment" | |
| 31 | Plain `@nki.jit` or `nki_op` (torch.library custom op); `nki_op` only for autograd or a named op | torchNeuronNotes, torchBestPractices, tnxNkiCustomOp, nkiTorchHook | CONFIRMED | best practices: "Wrap the call in @nki_op only when you need autograd or a named PyTorch operator"; nki_hop.py L1248 `custom_op(`; nki 0.7.0 wheel kernel.py L144-146 checks `arg.device.type == "neuron"` | |
| 32 | NKI under compile: `stablehlo.custom_call`, same NEFF, no graph break | tnxNkiCustomCall, torchBestPractices | CONFIRMED | fx_importer.py L1834 "Converts the NKI kernel wrapper HOP to a stablehlo.custom_call"; "A kernel call on Neuron tensors is integrated into the compiled graph instead of causing a break" | |
| 33 | c10d `neuron`: collectives, p2p, DDP, FSDP2, DTensor TP/SP, PP, experimental CP; collective cores in a node, EFA between | torchNeuronNotes, torchNeuron233, tnxC10dBackend | CONFIRMED | RN: list verbatim; "Collectives use Trainium collective cores within a node and EFA between nodes"; backend.py L47-49 | |
| 34 | TP takes a NeuronCore count; FSDP needs no change | torchIndex233, torchNeuron233 | CONFIRMED | "For some parallelism strategies like Tensor Parallelism, you need to specify how many NeuronCores ... For other strategies like FSDP, no configuration changes are needed" | |
| 35 | 2.13.3.0/2.14.3.0, Python 3.12 to 3.14, Ubuntu 24.04 or 26.04 | torchNeuronNotes | CONFIRMED | support matrix. The best-practices page says "Python 3.10-3.14"; the page follows the release-notes matrix. | |
| 36 | 2.9.0.2.15.32035 deprecated, kept by Trn1/Inf2; PyTorch 2.9 last on PyTorch/XLA | pytorchXlaNotes233, whatsNew233 | CONFIRMED | whats-new: "torch-neuronx for PyTorch 2.13 and 2.14 is TorchNeuron, and PyTorch 2.9 is the last version on PyTorch/XLA" | |
| 37 | Keep the pin, e.g. `torch==2.14.0` with `torch-neuronx==2.14.*`; earlier versions are the XLA product | torchNeuronNotes, torchNeuronxRepo | CONFIRMED | README L69: "Keep the version pins. Earlier torch-neuronx versions are the XLA-based product." | |
| 38 | "the source recognizes Trn1 and Inf2 ... does not refuse them, so nothing stops an install outside it" | tnxPlatforms | UNSUPPORTED (hedge overreach) | PlatformUtils.cpp L37-L69 maps trn1/inf2; only unknown families throw. A grep of `torch_neuronx/` (py, cpp, h) for trn1/inf2 with raise/throw/TORCH_CHECK/unsupported returns nothing. That supports "the package has no refusing check", not "nothing stops an install". | Narrowed to "the torch-neuronx source at v2.33.0 maps Trn1 and Inf2 ... has no check that refuses them, so the package itself will not stop a run outside the list" |
| 39 | Porting: `.to('neuron')`, `torch.accelerator` unchanged, autocast, `backend="neuron"` without CUDA modes | torchIndex233 | CONFIRMED | "What changes are needed?" list verbatim | |
| 40 | Off `torch_xla` / `xm.xla_device()` | torchNeuronNotes | CONFIRMED | "Breaking changes: ... uses the neuron device instead of torch_xla and xm.xla_device()" | |
| 41 | Eager CPU fallback, performance cost | torchNeuronNotes, torchBestPractices | CONFIRMED | "Unsupported ops fall back to CPU by default, which is convenient for bring-up but costs performance" | |
| 42 | Doc conflict: overview "emits a warning", best practices "silently" | torchNeuron233, torchBestPractices | CONFIRMED | overview: "runs on CPU and emits a warning"; best practices: "Unsupported ops fall back to CPU silently" | |
| 43 | Code: fallback log line dropped; the one warning comes from a failed lowering | tnxFallbackLogDropped, tnxLoweringFailWarn | CONFIRMED | NeuronLogging.h L60-63 returns for OPERATOR_FALLBACK; NeuronDispatcher.cpp L2987-2988 `TORCH_NEURONX_WARN(... " — falling back to CPU")` (GENERAL category, printed at the default WARNING level, L128) | Record title said `TORCH_WARN`; corrected to `TORCH_NEURONX_WARN` |
| 44 | `TORCH_NEURONX_FALLBACK_ONLY_FOR_UNIMPLEMENTED_OPS=1`: failed lowering errors, unimplemented still fall back | torchBestPractices, tnxFallbackOnlyUnimplemented | CONFIRMED | NeuronDispatcher.cpp L2306-2310 TORCH_CHECK; L2982 rethrow. Default is "0" in the RELEASE build (`_build_config.py` L10, wheel BUILD_TYPE="RELEASE"), so =1 is opt-in. | |
| 45 | Code block is best-practices Practice 1 plus `import torch_neuronx` | torchBestPractices, torchIndex233 | CONFIRMED | Practice 1 code lines match; torch/index: "Import torch_neuronx only to call its own APIs" | |
| 46 | `dynamic=False`; every new shape is a new compile and NEFF; pad or bucket | torchNeuronNotes, torchCompileRef | CONFIRMED | RN: "torch.compile requires dynamic=False ... Pad or bucket inputs"; ref: "each input shape produces a separate cache entry" | |
| 47 | Doc says the backend forces `dynamic=False`; in source the option goes to a dict nothing reads | torchCompileRef, tnxDynamicUnread | CONFIRMED | ref: "Because the backend forces dynamic=False"; backend.py L1862 `options.setdefault("dynamic", False)`; `grep -rn '"dynamic"'` over `torch_neuronx/` finds only that line | Named the tree searched ("torch-neuronx v2.33.0 source") |
| 48 | `fullgraph=True` recommended; break raises `torch._dynamo.exc.Unsupported` | torchCompileRef, torchNeuron233 | CONFIRMED | "True raises an error if graph breaks occur, and is recommended for the Neuron path"; "With fullgraph=True, the same operation raises torch._dynamo.exc.Unsupported" | |
| 49 | Non-default modes warn and run as default | torchCompileRef | CONFIRMED | "Other modes log a warning and fall back to default" | |
| 50 | Forced breaks: "torch.sort over more than 16,384 elements" | torchCompileRef | WRONG (scope) | "torch.sort, torch.argsort: When the sorted dimension has more than 16,384 elements" | Now "torch.sort and torch.argsort along a dimension of more than 16,384 elements". topk and grouped_mm rows confirmed. |
| 51 | "Grouped GEMMs carry the expert computation in MoE models, so ... an MoE model raises" | torchtitanAbout | UNSUPPORTED (over-general) | "torch._grouped_mm / grouped_mm, used by MoE grouped experts ... For MoE models, keep the expert computation out of the compiled region" | Now "MoE models with grouped experts, so ... such a model raises" |
| 52 | Graph lowering failure raises by default; `TORCH_NEURONX_DISABLE_FALLBACK_EXECUTION=0` runs op by op; best practices keep the default | torchCompileRef, tnxCompileRaises, torchBestPractices | CONFIRMED | ref default True, "Set to 0 to re-enable fallback"; `__init__.py` L78; "Leave this default in place, because a silent fallback can make a broken graph look like it works" | |
| 53 | Compile hot regions only | torchBestPractices | CONFIRMED | "torch.compile can wrap a single function or submodule ... while the rest of the application stays eager" | |
| 54 | Support boundary: sparse, func, nested, distributions; TorchAO; composite MXFP8; rfft on device, rest of fft on CPU | torchNeuronNotes | CONFIRMED | "Known issues and limitations", verbatim | |
| 55 | "FP8 requires Trn3, and the source disables the FP8 dtype mapping on Trn2" | torchNeuron233, tnxFp8Trn2 | WRONG (code scope) | Doc: "FP8 and MXFP8 require Trainium 3" (confirmed). Code: utils.py L542-L560 returns False on trn2 only for `float8_e4m3fn` and `float8_e8m0fnu`; `float8_e5m2` maps on any platform (L680-681, L767-768). | Now "in the torch-neuronx source float8_e4m3fn and float8_e8m0fnu report as unsupported on Trn2". Record title corrected. |
| 56 | AWS excludes forward-mode AD from the first release | pytorchBlog | CONFIRMED | "Features TorchNeuron explicitly chose not to support in the first release ...: forward-mode autograd (JVP)" | |
| 57 | Sept 2026 sweep, ~100,000 HF models, reduced config, 95.6% eager, 96.6% compiled; pass criterion undefined | pytorchBlog (T2, vendor-claim, "AWS reports") | CONFIRMED | Text: "We ran each model on Trainium in a reduced but representative configuration"; "as of September, 2026". Chart (image 5): "Passed 96,618 (95.6%) / 95,097 (96.6%)" of 101,076 / 98,420 executed. Recomputed: 95.59%, 96.62%. No pass definition in the post. | |
| 58 | 94.7% of enabled upstream ATen tests, Aug 2026; ~39,000 deliberate Neuron skips | pytorchBlog (T2, vendor-claim) | CONFIRMED | Chart (image 6): ATen 84,579 run, 80,101 passed, "94.7% pass" (recomputed 94.71%); text: "report the pass rate against the enabled tests"; "The remaining ~39K are deliberate Neuron skips" | |
| 59 | HF: 89% of top-100 text-generation architectures vs 46% with Optimum Neuron v0.4.5 | hfBlog (T2, publisher Hugging Face, vendor-claim, "Hugging Face reports") | CONFIRMED | "89% of the top 100 most-used text-generation model architectures are supported out of the box, compared to 46% with Optimum Neuron v0.4.5" | |
| 60 | SA: Qwen3-32B TorchTitan on 16 Trainium2; 11,099 vs 14,156 tok/s; ~1.28x; first step 184.6 s / 255.7 s | semiAnalysis (T3, measured, "SemiAnalysis measured") | CONFIRMED | "we trained a Qwen3-32B on 16 Trainium2 chips"; "11,099 tokens per second ... 14,156 tokens per second ..., a 1.28x throughput improvement"; "184.6 seconds for eager mode (255.7 seconds for compiled mode)". 14,156/11,099 = 1.275. The cite note's "not given in the public text" holds: no batch size, sequence length or TP/FSDP layout. | |
| 61 | First step compiles every graph, several minutes; NEFF cache saves later runs | torchtitanAbout | CONFIRMED | "The first training step compiles every graph and can take several minutes ... The persistent NEFF cache avoids paying this cost again on later runs" | |
| 62 | Disclosure: AWS post thanks SA for design feedback; SA tried Trainium3 racks for a couple of weeks | pytorchBlog, semiAnalysis | CONFIRMED | Blog: "Special thanks to ... SemiAnalysis ... for their feedback in shaping TorchNeuron's design"; SA: "has been trying out the Trainium3 racks for the past couple of weeks". Placed in the same paragraph as the SA figures. | |
| 63 | `--auto-cast=none` default since neuronx-cc 2.22.12471.0 (Neuron 2.27.0); FP32 matmuls can cut throughput and grow model size | neuronCompiler (re-pinned) | CONFIRMED | compiler/index v2.33.0, verbatim; CLI v2.33.0 "--auto-cast ... (Default: none)", which re-verifies the default for 2.28.7631.0 | |
| 64 | `--auto-cast=matmult --auto-cast-type=bf16`; `all` can lower accuracy; `NEURON_CC_FLAGS` | compilerCli (re-pinned) | CONFIRMED | "all: Cast all FP32 operations ... can potentially lower precision/accuracy"; "forward these options to the compiler using NEURON_CC_FLAGS" | |
| 65 | TorchNeuron passes `NEURON_CC_FLAGS` to neuronx-cc | torchCompileRef | CONFIRMED | "NEURON_CC_FLAGS ... Extra flags passed to the neuronx-cc invocation"; KernelExecution.cpp L179-181 | |
| 66 | Graph compiles pass `--auto-cast=none`; BF16 via dtype or autocast | tnxGraphCompileFlags, torchNeuron233 | CONFIRMED | L176; "Set precision with torch.dtype ... torch.autocast(device_type="neuron") is supported" | |
| 67 | XLA compile cache paragraph scoped to the XLA path | neuronCache | CONFIRMED | neuron-caching v2.32.0: "PyTorch Neuron (torch-neuronx) uses torch-xla ... enabled by default for Neuron's PyTorch/XLA flow" | |
| 68 | `TORCH_NEURONX_NEFF_CACHE_DIR` default `/tmp/neff_cache`; key = lowered graph + compiler config + compiler version; pin both | torchCompileRef, tnxNeffCacheDir, tnxNeffKeyCompilerVersion | CONFIRMED | ref table and "Pin the torch-neuronx and compiler versions in production"; PersistentCacheBackend.cpp L27; `__init__.py` L151-153 comment "so the persistent NEFF cache key includes it" | Record range widened from L154-L158 to L151-L158 so it shows the key statement |
| 69 | FSx shared mount; lock dir `TORCH_NEURONX_NEFF_LOCAL_CACHE_DIR` on local POSIX; NFS/Lustre unreliable | torchCompileRef | CONFIRMED | "Must stay on a local POSIX filesystem, NFS and Lustre lock semantics are unreliable" | |
| 70 | `TORCH_NEURONX_NEFF_DISABLE_CACHE=1` is read; `TORCH_NEURONX_DISABLE_NEFF_CACHE` documented at env doc L84, read only by an uncalled helper | tnxNeffCacheDisable, tnxEnvVarsDoc, tnxDisableNeffCacheHelper | CONFIRMED | PersistentCacheBackend.cpp L57 (C++ accepts exactly "1", L18); utils.py L377; `grep -rn is_neff_cache_disabled` over the whole repository finds only its definition | |
| 71 | vLLM Neuron 0.29.0.1.2.0: native torch.compile default | vllmNeuronNotes233 | CONFIRMED | "moves to native PyTorch torch.compile as the default compilation path" | |
| 72 | libtorch-neuronx-lite, its own copy of the lowering, PyTorch 2.13 | vllmTorchNeuronDesign, vllmNeuronCoreReq, vllmTorchPin | CONFIRMED | "compiles through the libtorch-neuronx-lite package, which includes its own copy of the TorchNeuron lowering"; core.txt L7, L14 `vllm==0.29.0`; vLLM v0.29.0 pyproject L10 `"torch == 2.13.0"` | |
| 73 | One package owns `neuron`; set `TORCH_DEVICE_BACKEND_AUTOLOAD=0` or startup fails with a PrivateUse1 error | vllmTorchNeuronDesign | CONFIRMED | "only one package can own the neuron device in a process. Without the variable, the vLLM Neuron server stops at startup with the error Tried to register multiple backend fallbacks for the same dispatch key PrivateUse1" | |
| 74 | NxDI, NxD Core inference, PyTorch/XLA inference end on Trn2/Trn3 in 2.34; migration targets | whatsNew233 | CONFIRMED | "Software lifecycle updates", verbatim | |
| 75 | PyTorch/XLA training unsupported from 2.30 | noXlaTraining | CONFIRMED | "Starting with Neuron Release 2.30.0, PyTorch/XLA is no longer supported for training workloads on Trainium" | |
| 76 | Train on TorchNeuron with FSDP2 and DTensor | torchNeuronNotes | CONFIRMED | parallelism list; "Training runs on one node or many nodes" | |
| 77 | TorchTitan Neuron 0.2.2+neuron.1 beta fork keeps model defs, parallelism, compile integration | torchtitanAbout, releaseNotes233 | CONFIRMED | "use TorchTitan's standard model definitions, parallelism strategies, and torch.compile integration without changing your model code"; "Neuron fork of upstream pytorch/torchtitan" | |
| 78 | Default backend `neuron` | torchtitanCompileBackend | CONFIRMED | compile_backend.py L34-35 `if "backend" not in kwargs: kwargs["backend"] = "neuron"` | |
| 79 | Validated configs and documented limits | torchtitanAbout | CONFIRMED | Supported-models table (Llama3-8B, Qwen3-32B, DeepSeek-V3, GPT-OSS); "Known limitations" (static shapes, mode="default", grouped_mm, built-in profiler lacks PrivateUse1) | |
| 80 | TRL: no code changes; 128-token padding by default; GRPO/RLOO generate with Transformers | trlTrainium | CONFIRMED | "TRL trainers run on it without code changes"; "pad_to_multiple_of defaults to 128"; "vLLM doesn't run on Neuron, so GRPO and RLOO generate with Transformers" | |
| 81 | `neuron-explorer capture` replaces `neuron-profile capture` in 2.32.0 | devTools233, neuronWhatsNew | CONFIRMED | dev-tools v2.33.0, 2.32.0 entry: "replaces the deprecated neuron-profile capture command" | |
| 82 | torch.profiler with PrivateUse1; default session; NeuronConfig | torchNeuronNotes, torchNeuron233, explorerCapture, tnxProfilerPlugin | CONFIRMED | RN: "A default Neuron session starts without additional configuration. Pass a NeuronConfig"; capture page: "ProfilerActivity.PrivateUse1 - Neuron runtime and device activity"; Registration.cpp L21-24 | |
| 83 | `ProfileMode.DEVICE` reserves ~5 GB HBM on Trn2 | explorerCapture | CONFIRMED | "ProfileMode.DEVICE reserves approximately 5 GB of HBM on Trn2 for storing hardware notifications" | |
| 84 | Per-engine instruction tracks coloured by PyTorch op; per-DMA-engine packet tracks | explorerDeviceTrace | CONFIRMED | "Each NeuronCore engine has its own instruction track"; "color-coded according to their associated PyTorch operator"; "one track per DMA engine ... each event is a single DMA packet" | |
| 85 | "In eager mode, the Memory Viewer attributes allocations to the Python source lines" | devTools233 | UNSUPPORTED (condition dropped) | "When a snapshot is included, allocations are attributed to the Python source lines that made them, to support out-of-memory debugging ... in eager mode" | Now "With a PyTorch memory snapshot in the profile, ... for out-of-memory debugging in eager mode" |
| 86 | Observer (beta): daemon, `nobs`, Prometheus `/metrics`, neuron-monitor supported | observerNotes | CONFIRMED | release notes, verbatim | |
| 87 | Neuron 2.33.0 ships NKI 0.7.0 | releaseNotes233 | CONFIRMED | component table | |
| 88 | Call NKI from PyTorch; `register_autograd` for backward | torchNeuronNotes, torchNeuron233 | CONFIRMED | "Add a backward pass with torch.library.register_autograd" | |
| 89 | Diagram XLA lane: "PyTorch 2.9 on Trn1 and Inf2, the deprecated XLA build" | pytorchXlaNotes233 | WRONG (scope) | as #1 | Lane now reads "PyTorch 2.9 on the deprecated XLA build of torch-neuronx, the only PyTorch path on Trn1, Inf2"; title updated to match |
| 90 | vLLM Neuron "in beta since July 2026" | neuronWhatsNew | CONFIRMED | "vLLM Neuron Beta now available, Posted on: July 20, 2026"; 2.33 What's New: "launched in July 2026" | |
| 91 | Diagram row 2: "PyTorch dispatcher routes ATen ops to the Neuron backend" feeding both eager and torch.compile | torchBestPractices, torchNeuron233 | WRONG | best practices: "Eager: ATen op -> NeuronDispatcher -> StableHLO -> neuronx-cc -> NEFF" vs "Compiled: Dynamo -> AOTAutograd -> FX passes -> StableHLO -> neuronx-cc"; overview: TorchDynamo captures bytecode into an FX graph | Row 2 now reads "Device "neuron", registered through PrivateUse1"; the eager box carries the dispatcher ("PyTorch dispatcher sends each ATen op to StableHLO, compiled on first use"); title rewritten to match |
| 92 | Other diagram labels: program row, NKI box, torch.compile box, -O1/-O2, neuronx-cc, "One NEFF per op, cached by op, shape, dtype", "One NEFF per graph, NKI kernels compile into it", Runtime, NeuronCores, c10d "collective cores in a node, EFA between nodes" | as #20-#33 | CONFIRMED | as cited rows above (the cache label omits strides, which is incomplete but not wrong) | |
| 93 | Diagram title: "NKI kernels enter both paths as custom ops and compile into the graph's NEFF" | torchBestPractices | UNSUPPORTED (eager has no graph) | the graph-NEFF statement applies under torch.compile only | Now "...as custom ops; under torch.compile they compile into the graph's NEFF" |

Tier and kind audit: every Neuron doc at `/en/v2.33.0/` is Tier 1. The torch-neuronx, vllm-neuron, vLLM and torchtitan-neuron
URLs are pinned to tags and are Tier 1. The nki wheel URL is a versioned first-party artifact, Tier 1. pytorchBlog is Tier 2, publisher AWS, and both of its
figures carry `kind="vendor-claim"` with "AWS reports" in the sentence. hfBlog is Tier 2, publisher Hugging Face, `vendor-claim`, with "Hugging
Face reports". trlTrainium is Tier 2. semiAnalysis is Tier 3, `measured`, with "SemiAnalysis measured", and the disclosure sits in the same
paragraph. No URL in this file carries a different tier in another section's source file (checked
KernelExecutionLifecycle, AwsCustomSilicon, CommunicationAndScaleOut and DeterminismAOT).

## Plan items (TORCHNEURON-2026-10.md; ORCH-NOTES does not apply)

- Vendor coverage figures labelled and attributed: CONFIRMED (#57-#59).
- SemiAnalysis Tier 3, attributed, with the disclosure where it is cited: CONFIRMED (#60, #62).
- Environment variables against code at the tag: CONFIRMED (#44, #52, #68-#70, #73). Doc-code conflicts name both sides and take
  code as the authority (#42/#43, #47, #70).
- `--auto-cast=none` re-verified against neuronx-cc 2.28.7631.0: CONFIRMED (CLI v2.33.0 "Default: none").
- The 2.33.0 component table: CONFIRMED row by row (#7-#18).
- Diagram labels: three corrections (#89, #91, #93).
- Hedge scope: two corrections (#38, #47).
- "What stays out": no SA9, SA6, SA30, SA26, SA35, SA31, SA32, SA36/37/44 or P70 content on the page (grep for 80,000, 85%, MFU,
  FlexAttention, hiring, 89 out of 96: no hits).
- The plan's h1 framing ("PyTorch on Trn2 and Trn3 is TorchNeuron") overstates the 2.33.0 PyTorch notes. The page now follows the notes.

## Fixes applied

Section `src/sections/AwsCompilersAndTooling.tsx`:
- L168-L177 (h1). Before: "PyTorch on Trn2 and Trn3 runs on TorchNeuron ... JAX, and PyTorch on Trn1 and Inf2, stay on XLA ...: JAX NeuronX compiles through XLA, and PyTorch there uses the deprecated XLA build of torch-neuronx 2.9." After: "On Trn2 and Trn3, PyTorch 2.13 and 2.14 run on TorchNeuron ... [+whatsNew233] JAX stays on XLA (Accelerated Linear Algebra): JAX NeuronX compiles through XLA. So does PyTorch 2.9, through the deprecated XLA build of torch-neuronx, which runs on Trn1, Inf2, Trn2 and Trn3 and is the only PyTorch path on Trn1 and Inf2."
- L352-L354. Before: "the source recognizes Trn1 and Inf2 instance types and does not refuse them, so nothing stops an install outside it." After: "the torch-neuronx source at v2.33.0 maps Trn1 and Inf2 instance types and has no check that refuses them, so the package itself will not stop a run outside the list."
- L420. Before: "in the source that setting goes into an options dictionary nothing reads". After: "in the torch-neuronx v2.33.0 source that setting goes into an options dictionary nothing reads".
- L440-L441. Before: "at torch.sort over more than 16,384 elements". After: "at torch.sort and torch.argsort along a dimension of more than 16,384 elements".
- L445-L446. Before: "in MoE (mixture of experts) models, so under fullgraph=True an MoE model raises". After: "in MoE (mixture of experts) models with grouped experts, so under fullgraph=True such a model raises".
- L472-L474. Before: "and the source disables the FP8 dtype mapping on Trn2." After: "and in the torch-neuronx source float8_e4m3fn and float8_e8m0fnu report as unsupported on Trn2."
- L723-L725. Before: "In eager mode, the Memory Viewer attributes allocations to the Python source lines that made them." After: "With a PyTorch memory snapshot in the profile, the Memory Viewer attributes allocations to the Python source lines that made them, for out-of-memory debugging in eager mode."

Sources `src/sources/AwsCompilersAndTooling.ts`:
- L297 tnxLoweringFailWarn title: "TORCH_WARN when a Python lowering fails" became "TORCH_NEURONX_WARN when a Python lowering fails, then CPU fallback".
- L345-L348 tnxNeffKeyCompilerVersion: title "NEURONXCC_VERSION from the installed compiler" became "NEURONXCC_VERSION enters the persistent NEFF cache key"; URL `#L154-L158` became `#L151-L158`.
- L381 tnxFp8Trn2 title: "FP8 dtype mapping disabled on trn2" became "float8_e4m3fn and float8_e8m0fnu reported unsupported on trn2".

Diagram `src/components/TorchNeuronStackDiagram.tsx`:
- Header comment L3-L9 rewritten to match.
- Title L47-L58: dispatcher scoped to eager mode; NKI-into-graph scoped to torch.compile; XLA lane no longer limited to Trn1 and Inf2.
- L116 XLA lane lines: "PyTorch 2.9 on / Trn1 and Inf2, / the deprecated / XLA build of / torch-neuronx" became "PyTorch 2.9 on the / deprecated XLA build / of torch-neuronx, / the only PyTorch / path on Trn1, Inf2".
- L128 row 2: "PyTorch dispatcher routes ATen ops to the Neuron backend (PrivateUse1)" became "Device "neuron", registered through PrivateUse1".
- L139 eager box: "one ATen op at a time, / lowered to StableHLO, / compiled on first use" became "PyTorch dispatcher sends / each ATen op to StableHLO, / compiled on first use".

`src/components/AwsCompilerStack.tsx`: no change. No other section imports either component.

## Checks

Run from the dive root after the fixes:
- `pnpm exec tsc --noEmit | grep -E "AwsCompilersAndTooling|TorchNeuronStackDiagram|AwsCompilerStack|sources/AwsCompilersAndTooling"`: no type errors in my files.
- `pnpm exec eslint src/sections/AwsCompilersAndTooling.tsx src/sources/AwsCompilersAndTooling.ts src/components/TorchNeuronStackDiagram.tsx src/components/AwsCompilerStack.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t AwsCompilersAndTooling`: 1 passed, exit 0. The sources.md snapshot test was not run. It is expected to fail until sources.md is regenerated.
- Gates from the repo root: no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0, pre-overflow exit=0, with no hits for my files.
- `pnpm exec vite build --outDir /tmp/vf-AwsCompilersAndTooling-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections aws-compilers --widths 1440,390 ...`: "3 SVG diagram(s), 1 React Flow, ok" at both widths, exit 0.
- PNGs read: `aws-compilers-1440-svg2.png` shows no overlap or clipping, and the new XLA-lane and eager-box lines sit inside their boxes. `aws-compilers-390-svg2.png` scrolls sideways inside the 640 px wrapper with labels at full size. `aws-compilers-390-flow0.png` shows "StableHLO or XLA graph" clear of the nodes.

## For the orchestrator

- Regenerate `sources.md`. Three records changed (tnxLoweringFailWarn and tnxFp8Trn2 titles; tnxNeffKeyCompilerVersion title and URL range). The snapshot test fails until then.
- Glossary: the author's list in `revamp/authoring/AwsCompilersAndTooling.md` ("Orchestrator actions") stands. My fixes add no acronyms.
- Cross-dive consistency: anywhere the plan's framing "PyTorch on Trn2 and Trn3 is TorchNeuron; Trn1 and Inf2 stay on XLA" was copied, check it against `release-notes/components/pytorch.html` v2.33.0, which says the XLA build runs "on Trn1, Inf2, Trn2, and Trn3" (PyTorch/XLA inference on Trn2/Trn3 ends in 2.34). AwsCustomSilicon L371-L372 and KernelExecutionLifecycle L168 were checked and are consistent.

## Backlog

- No single strongest number is repeated. A candidate is the one-NEFF-per-op versus one-NEFF-per-graph contrast, or the 2.34 end date.
- Economy: prose went from about 1,000 to about 3,000 words. Candidates to demote into ExpandableSections are the "One package name, two products" detail and the TorchTitan limits list. Some sentences stack four or five citations.
- Unchanged claims still cite 2.32.0 pages: neuronWhatsNew, devToolsNotes, neuronTopGuide, intranodeCollectives, trainium2Arch/trainium3Arch, nkiTrn2Arch, nkiTrnInf2Arch, ncMatmul and neuronCache. The NKI Library link is the `2.32` tag, while Neuron 2.33.0 ships NKI Library 2.33.0. Re-pin in the next iteration.
- h1 "NKI 0.6.0 adds data-dependent loops" (unchanged) is still true, but 2.33.0 ships NKI 0.7.0 and tells users to move off `nl.dynamic_range`. Consider restating it against 0.7.0.
- Doc inconsistencies seen, none on the page:
  - The best-practices page lists Python 3.10-3.14, while the release notes list 3.12-3.14.
  - The NxD Inference archive heads 2.31.0 with 0.10.18398 but names package 0.10.18399.
  - The in-repo env-var doc gives `TORCH_NEURONX_LOG_LEVEL` a default of 0, while the code defaults to WARNING (1).
  - The compile reference says booleans accept 1/true/yes, but the C++ `TORCH_NEURONX_NEFF_DISABLE_CACHE` reader accepts only "1". The page tells readers to set "=1", which works.
- The TRL docs say "vLLM doesn't run on Neuron" (meaning TRL's vLLM integration). A reader may find that odd next to vLLM Neuron, so a clarifying clause could help.
