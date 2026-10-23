# Verification: AWS Compilers and Kernel Tooling

Verified: 2026-10-23. Claims checked: 52 (sampled: 0, all verified). Confirmed 46, wrong 3,
unsupported 3, mislabelled 0, unverifiable 0. Separately, 13 confirmed claims were cited to `latest`
Neuron docs URLs that no longer state them. Those citations are now pinned to `/en/v2.32.0/`.

Docs version served today: `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/` serves
**Neuron 2.33.0**. The release notes index reads "Latest AWS Neuron SDK release: 2.33.0. On 10/19/2026,
AWS released version 2.33.0", "Last updated: October 19, 2026". The section was authored on 2026-10-17
against Neuron 2.32.0 (released 08/17/2026). It stays a Neuron 2.32.0 snapshot, which matches the dive's
other `/en/v2.32.0/` pins. The 2.33.0 changes are listed under "For the orchestrator".

Pages read: every cited Neuron page at both `/en/latest/` and `/en/v2.32.0/` (curl, default
User-Agent, no personal data). Also read: the v2.33.0 TorchNeuron and compiler pages, the v2.32.0 JAX
NeuronX page, the NxD Inference maintenance announcement, the Gluon tutorial at Triton v3.8.0 (raw), and
the GitHub API for aws-neuron/torch-neuronx, aws-neuron/nki-library and vllm-project/vllm-neuron
(unauthenticated).

## Gate 3 score: 8/10

After the fixes, every figure matches a pinned or versioned AWS page. The one load-bearing error was
TorchNeuron's status: it went to public beta, with a public repository, in Neuron 2.33.0, two days after
authoring. It is now fixed. Each block gives the reader a mental model (four compiler stages, with NKI
entering at stage 4) or something to do (the auto-cast flag, the S3 cache, which library, which profiler,
when to write a kernel). Economy keeps the section from a 9: it runs about 24% over its pre-revamp
length, and the Backlog lists about 45 words of cut candidates.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 46 of 52 confirmed as shipped. Wrong: TorchNeuron "closed beta", "repository was not public", "in a future Neuron release". 2.33.0 overtook all three, and they are load-bearing for a reader choosing a training path. Unsupported: torch-neuronx/JAX capture cited to a compiler page that names neither, the NxD Inference "from Neuron 2.32.0" start version, and the SBUF/PSUM expansions. All fixed |
| Mental model or practical value | 9 | The stage diagram plus "NKI enters at the back end" builds the model. The auto-cast default, the cache key and S3 URL, the library choice, the profiler order and nrtpy timing are all actions. Weakest lines: "NKI is stable from NKI 0.3.0" and the TensorBoard plugin clause, which do little for a reader in 2026 |
| Shape | 9 | The h1 introduces the stack before dissecting it, and each h2 description names the payoff. The strongest fact (auto-cast default since Neuron 2.27.0) lands in the h1 description, the h2 description, the body and the code comment. The versions table sits in an ExpandableSection. The page ends on "time the kernel on its own before it goes into a model" |
| Writing | 8 | The no-ai-tells gate is clean. Things are defined by what they are. Attribution is load-bearing where it stays ("AWS directs its users", which is advice). "so no warp scheduler makes those choices at run time" defines by contrast with the GPU, which is mild |
| Economy | 7 | About 1,243 visible words, against the author's 1,264 less the 21 net words these fixes removed. That is about +24% over 999. Each added block is register-required, per the authoring report. About 45 words of cut candidates are in the Backlog |
| Diagrams | 8 | React Flow with `role="img"`, `aria-labelledby` and a hidden title. Clean at 1440: no label crosses another edge, and the panel title sits clear. At 390 the 800 px canvas scrolls sideways with legible labels (the dive's phone convention). Probe "ok" at both widths. Unchanged by this pass |

## Claims

Source quotes come from the `/en/v2.32.0/` copy unless marked "latest" or "v2.33.0".

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | `--auto-cast=none` default since neuronx-cc 2.22.12471.0 (Neuron SDK 2.27.0); earlier versions cast FP32 matmuls to BF16 (h1 desc, h2 desc, body, code) | neuronCompiler | CONFIRMED (latest = v2.33.0) | "By default, neuronx-cc compiles matrix multiplication operations in the model's own datatype (--auto-cast=none) ... These defaults changed in neuronx-cc 2.22.12471.0 (Neuron SDK 2.27.0); earlier versions cast FP32 matrix multiplication operations to BF16 by default." The v2.32.0 copy of this page still reads "By default, the compiler automatically casts FP32 matrix multiplication operations to BF16", which contradicts its own CLI reference ("(Default: none)"). The record therefore keeps the latest URL | - |
| 2 | An FP32 model without `--auto-cast` runs FP32 matmuls, which can reduce throughput and increase compiled size; `--auto-cast=matmult --auto-cast-type=bf16` restores BF16 | neuronCompiler | CONFIRMED | "Models compiled without an explicit --auto-cast value now run matrix multiplication operations in FP32 instead of BF16, which can reduce inference throughput and increase compiled model size. To keep the earlier behavior, set --auto-cast=matmult --auto-cast-type=bf16" | - |
| 3 | `all` casts every FP32 operation and can lower accuracy; framework options go in `NEURON_CC_FLAGS` | compilerCli | CONFIRMED (same in latest) | "all: Cast all FP32 operations to achieve highest performance. This option can potentially lower precision/accuracy."; "specify compiler options within the framework which will forward these options to the compiler using NEURON_CC_FLAGS" | - |
| 4 | The framework captures an XLA graph; neuronx-cc compiles it ahead of time into a NEFF (Neuron Executable File Format); the Runtime loads and runs it | neuronCompiler | CONFIRMED | "neuronx-cc: The newer XLA-based compiler"; "compiled into a NEFF file (Neuron Executable File Format), which is then loaded by the Neuron Runtime for execution on Neuron devices"; "Compile an XLA HLO graph into a NEFF file with neuronx-cc" | - |
| 5 | The back end allocates memory and fixes the instruction order before the run | nkiOverview | CONFIRMED (identical in latest) | Step 4: "memory allocation and instruction scheduling are done in this stage" | - |
| 6 | Trainium2 and Trainium3 support dynamic shapes and control flow in their ISA | trainium2Arch, trainium3Arch | CONFIRMED | "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions"; "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4" | - |
| 7 | NKI 0.6.0 adds data-dependent runtime loops | neuronWhatsNew | CONFIRMED | 2.32.0 post: "NKI 0.6.0 ... data-dependent runtime loops" | - |
| 8 | torch-neuronx captures through PyTorch/XLA; JAX NeuronX does the same for JAX | neuronCompiler | UNSUPPORTED | The compiler page names neither torch-neuronx nor JAX NeuronX. Persistent Cache page: "PyTorch Neuron (torch-neuronx) uses torch-xla". JAX page: "integrate AWS Trainium and Inferentia ... into JAX as pluggable devices using the PJRT (Plugin Runtime) mechanism"; "libneuronxla" | Re-cited to neuronCache and a new jaxNeuronx record (v2.32.0) |
| 9 | Four stages: graph level in the XLA front end with operator fusion; loop level (layout, tiling, loop fusion); intrinsics mapping; back end (allocation, scheduling) | nkiOverview | CONFIRMED | "Hardware-agnostic graph-level optimizations ... in the compiler front-end, using XLA, including ... operator fusion"; "layout, tiling and loop fusion optimizations"; "maps the architecture-agnostic loop nests ... into architecture-specific instructions"; "memory allocation and instruction scheduling" | - |
| 10 | NKI skips stages 1 to 3 into an IR the back end consumes; direct allocation skips some back-end passes (text and diagram edge) | nkiOverview | CONFIRMED | "NKI kernels bypass the first 3 steps, and are compiled into IRs ... that the compiler's back-end (Step 4 above) can directly consume. ... direct allocation, also allow programmers to bypass certain compiler passes in Step 4" | - |
| 11 | "the tiling and instruction choices of stages 2 and 3 are yours" | nkiOverview | CONFIRMED (reading) | "NKI developers can now have great control over NeuronDevices down to the instruction level" | - |
| 12 | "from PyTorch 2.10, in a future Neuron release, Neuron uses TorchNeuron"; PyTorch 2.9 is the last on PyTorch/XLA; scripts need updating | pytorchNotes | WRONG (today) | v2.32.0: "Starting with PyTorch 2.10 support (planned for a future Neuron release) ... PyTorch 2.9 is the last version using PyTorch/XLA. Users will need to update their scripts". v2.33.0 What's New: "torch-neuronx for PyTorch 2.13 and 2.14 is TorchNeuron, and PyTorch 2.9 is the last version on PyTorch/XLA". The future release has arrived | Dropped "in a future Neuron release"; the rest holds on both pages |
| 13 | TorchNeuron is a native backend that runs eager and torch.compile without Inductor | pytorchNative to torchNeuron233 | CONFIRMED | v2.32.0: "provides native torch.compile support without using Inductor". v2.33.0: "The Neuron backend provides native torch.compile support without using TorchInductor." | Cited to the v2.33.0 record |
| 14 | "AWS describes it both as open source at aws-neuron/torch-neuronx and as a closed beta" | pytorchNative | WRONG against the cited latest URL | Latest (redirects to torch/about-pytorch-neuron.html; same text as v2.33.0): "TorchNeuron is in public beta for the Neuron 2.33 release"; "open source under the Apache 2.0 license at aws-neuron/torch-neuronx". The v2.32.0 copy confirmed the old wording | Now "It is open source at aws-neuron/torch-neuronx and in public beta from Neuron 2.33.0 (October 2026)", citing torchNeuron233 and torchNeuronxRepo |
| 15 | "that repository was not public when this research checked it in October 2026" | (GitHub check) | WRONG (today) | GitHub API, 2026-10-23: `"private": false`, `"visibility": "public"`, license Apache-2.0, tag `v2.33.0` (release published 2026-10-17T17:41Z) | Clause removed; repo cited at tag v2.33.0 |
| 16 | Table: "Components and versions in Neuron 2.32.0 (August 2026)" | neuronReleaseNotes | CONFIRMED (v2.32.0); latest URL drifted | "Latest AWS Neuron SDK release: 2.32.0. On 08/17/2026 ..."; latest now reads 2.33.0 | URL pinned to /en/v2.32.0/ |
| 17 | torch-neuronx 2.9.0.2.15, released with Neuron 2.31.0 | pytorchNotes | CONFIRMED (v2.32.0); latest drifted | "Latest version (in 2.31.0): 2.9.0.2.15.32035". Latest: "(in 2.33.0)" | URL pinned |
| 18 | JAX NeuronX 0.10.0, supports up to JAX 0.9.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "0.10.0.* (supports up to JAX 0.9.0)". Latest: "0.10.0.1.0.14198 (supports JAX 0.7.0 to 0.10.0)" | URL pinned |
| 19 | neuronx-cc 2.27.5334.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "Neuron Compiler / 2.32.0 / 2.27.5334.0". Latest: 2.28.7631.0 | URL pinned |
| 20 | Cite note: "The compiler's own release-notes page lists 2.27.4747.0 for the same release." | compilerNotes | CONFIRMED but incomplete; latest drifted | v2.32.0 compiler notes: "Latest version (in 2.32.0): 2.27.4747.0", while the same page heads the entry "Neuron Compiler [2.27.5334.0] (Neuron 2.32.0 Release)". The latest page no longer carries 4747 | URL pinned; note reworded to state both readings on that page |
| 21 | NKI 0.6.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "Neuron Kernel Interface / 2.32.0 / 0.6.0". Latest: 0.7.0 | URL pinned |
| 22 | Neuron Runtime 2.34.10.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "Neuron Runtime Library / 2.32.0 / 2.34.10.0". Latest: 2.35.30.0 | URL pinned |
| 23 | nrtpy (beta) 2.34.10 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "nrtpy (Beta) / 2.32.0 / 2.34.10". Latest: 2.35.30 | URL pinned |
| 24 | vLLM Neuron (beta) 0.24.0.1.1.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "vLLM Neuron (Beta) / 2.32.0 / 0.24.0.1.1.0". Latest: 0.29.0.1.2.0 | URL pinned |
| 25 | NxD Inference (maintenance) 0.10.18399 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "NxD Inference / 2.32.0 / 0.10.18399". The latest index no longer lists NxD Inference | URL pinned |
| 26 | Neuron Developer Tools 2.32.28.0 | neuronReleaseNotes | CONFIRMED (v2.32.0) | "Neuron Developer Tools / 2.32.0 / 2.32.28.0". Latest: 2.33.38.0 | URL pinned |
| 27 | TorchNeuron: Closed beta (table row, under the 2.32.0 header) | pytorchNative | CONFIRMED (v2.32.0); latest URL redirects and drifted | "TorchNeuron is currently only available as part of a closed Beta program." | URL pinned to /en/v2.32.0/ |
| 28 | Cache key is a hash of the compiler flags and XLA graph; a new compiler version or changed graph recompiles; so changing `--auto-cast` recompiles | neuronCache | CONFIRMED (identical in latest) | "The cache uses hash of the Neuron compiler flags and XLA graph as the key. If the Neuron compiler version or XLA graph changes, you will see recompilation." The auto-cast clause follows from "flags" | - |
| 29 | Default `/var/tmp/neuron-compile-cache`; `NEURON_COMPILE_CACHE_URL` to a read-write `s3://` bucket | neuronCache | CONFIRMED | "The default cache path is the directory /var/tmp/neuron-compile-cache."; "If <cache_url> starts with s3://, it will use the AWS S3 URL ... provided that the corresponding S3 bucket exists and is both readable and writeable." | - |
| 30 | Graphs traced with frozen weights through `torch_neuronx.trace` are not cached | neuronCache | CONFIRMED | "traced graphs with frozen weights/parameters are not cached" | - |
| 31 | vLLM Neuron is in beta since July 2026, implements models in the plugin with no NxD Inference dependency, and runs on Trn2 and Trn3 | neuronWhatsNew | CONFIRMED | "Posted on: July 20, 2026 ... vLLM Neuron Beta ... for serving models on Trn2 and Trn3. vLLM Neuron implements models directly within the plugin with no dependency on NxD Inference." | - |
| 32 | "NxD Inference is in maintenance mode from Neuron 2.32.0", and AWS directs users to vLLM Neuron | neuronWhatsNew | UNSUPPORTED (start version) | 2.32.0 post: "NxD Inference (NxDI) — now in maintenance mode; no new feature releases are planned. Migrate to vLLM Neuron". Its linked announcement: "As announced in Neuron 2.30, NxD Inference and NxD Core Inference APIs are in maintenance mode." Maintenance predates 2.32.0 | "from Neuron 2.32.0" removed |
| 33 | Pin vLLM Neuron by release tag | vllmNeuronRepo | CONFIRMED | GitHub API: tag v0.24.0.1.1.0, "v0.24.0.1.1.0 (Beta)", published 2026-08-17, Apache-2.0. Pinned URL | - |
| 34 | NxD Training and NxD Core training APIs are in maintenance, security fixes only | neuronWhatsNew | CONFIRMED | 2.30.0 post: "NxDT and NxD Core training APIs — maintenance mode (security fixes only)" | - |
| 35 | TorchNeuron supports FSDP and DTensor and runs TorchTitan with minimal code changes | pytorchNative | CONFIRMED (v2.32.0) | "Fully Sharded Data Parallel (FSDP) / Distributed Tensor (DTensor)"; "Running TorchTitan on Trainium requires minimal code changes" | URL pinned (latest page reworded) |
| 36 | Per-hop latency of intra-node ring collectives is about 1 to 2 us, HBM load dependent | intranodeCollectives | CONFIRMED (both) | "the per-hop latency of Ring/KangaRing is about 1-2 us (HBM load dependent)" | - |
| 37 | On Trn2 the Tensor Engine can throttle under dI/dt current limits | devToolsNotes | CONFIRMED (both) | "Tensor Engine throttling (covering dI/dt current throttling on Trn2)" | - |
| 38 | neuron-ls lists devices, NeuronCore IDs, and CPU and NUMA affinity | devToolsNotes | CONFIRMED (both) | "neuron-ls now shows NeuronCore IDs associated with each Neuron device as well as CPU and NUMA node affinity" | - |
| 39 | neuron-top shows live NeuronCore and vCPU utilization and memory usage | neuronTopGuide | CONFIRMED (identical) | "neuron-top provides useful information about NeuronCore and vCPU utilization, memory usage" | - |
| 40 | Neuron Explorer replaces Neuron Profiler and Profiler 2.0; System Timeline shows device HBM usage | devToolsNotes | CONFIRMED (both) | "A unified profiling suite that replaces Neuron Profiler and Profiler 2.0"; "System Timeline now supports Neuron device HBM usage" | - |
| 41 | `neuron-explorer capture` replaces `neuron-profile capture` in Neuron 2.32.0; TensorBoard plugin out of support | neuronWhatsNew | CONFIRMED | 2.32.0 post: "The neuron-explorer capture CLI replaces neuron-profile capture"; "Announcing End of Support for TensorBoard Plugin for Neuron Profiler in Neuron 2.27" | - |
| 42 | NKI is a bare-metal language and compiler for Trainium and Inferentia, in Python, with syntax and tile-level semantics similar to Triton and NumPy | nkiOverview | CONFIRMED | "NKI is a bare-metal language and compiler for programming AWS Trainium and Inferentia NeuronDevices"; "Python-based programming environment, which has syntax and tile-level semantics that are similar to Triton and NumPy" | - |
| 43 | The author places tiles in SBUF (State Buffer) and PSUM (Partial Sum buffer) explicitly (text and diagram node) | nkiTrn2Arch, ncMatmul | UNSUPPORTED (expansions) | nkiTrn2Arch: "the two on-chip SRAMs, SBUF and PSUM" (no expansion). ncMatmul: "must read inputs from SBUF and write outputs to PSUM". nkiTrnInf2Arch: "state buffer (SBUF) and partial sum buffer (PSUM)"; "two software-managed on-chip SRAMs"; `buffer=nl.psum` | Added nkiTrnInf2Arch (same key, title, URL and tier as KernelExecutionLifecycle.ts) |
| 44 | In Triton the compiler manages memory allocation and data movement | gluonIntro | CONFIRMED | 01-intro.py at v3.8.0: "It defers to the compiler to manage tile layouts, memory allocation, data movement, and asynchronity." | - |
| 45 | NKI is stable from NKI 0.3.0 (Neuron 2.29.0) | neuronWhatsNew | CONFIRMED | "NKI 0.3.0 is now out of Beta and Stable" (2.29.0 post) | - |
| 46 | The NKI Library is an open-source (Apache 2.0) collection of optimized kernels | neuronWhatsNew | CONFIRMED | "open source collection of optimized, ready-to-use kernels"; "NKI Library, and more released under Apache 2.0" | - |
| 47 | NKI Library at its 2.32 tag | nkiLibraryRepo | CONFIRMED | GitHub API: refs/tags/2.32 resolves to 092a49dcdffb; license Apache-2.0 | - |
| 48 | MoE kernels, Router Top-K among them, shipped in Neuron 2.28.0 | neuronWhatsNew | CONFIRMED | 2.28.0 post: "New core kernels include RoPE ..., Router Top-K (expert selection for MoE), MoE CTE ..., MoE TKG" | - |
| 49 | Experimental CPU simulator: `NKI_SIMULATOR=1` or `nki.simulate(kernel)` | neuronWhatsNew | CONFIRMED | "NKI CPU Simulator (Experimental) ... Activate it with NKI_SIMULATOR=1 or use nki.simulate(kernel)." | - |
| 50 | nrtpy (beta) loads and runs the NEFF from Python without PyTorch or JAX, so you can time a kernel alone | nkiOverview | CONFIRMED | "loads and executes the NEFF files your NKI kernels compile to — directly from Python, without going through PyTorch or JAX. This is useful for benchmarking a compiled kernel" | - |
| 51 | Diagram: NEFF "instruction order fixed at compile time"; Runtime "loads the NEFF and runs it on NeuronCores" | nkiOverview, neuronCompiler | CONFIRMED | As claims 4 and 5 | - |
| 52 | Diagram stage labels: "XLA front end: operator fusion", "layout, tiling, loop fusion", "loop nests become hardware instructions", "memory allocation, instruction scheduling" | nkiOverview | CONFIRMED | As claim 9 | - |

## ORCH-NOTES items

- **SBUF and PSUM names and sizes.** The section states the names only, no sizes. It never cited the
  NeuronCore-v3 page. It cited `nkiTrn2Arch`, which names "SBUF and PSUM" without expanding them, plus
  `ncMatmul`. **FIXED**: added `nkiTrnInf2Arch`, reusing the KernelExecutionLifecycle.ts record (same key,
  title, URL, publisher and tier; accessed 2026-10-23). It reads "state buffer (SBUF) and partial sum
  buffer (PSUM)". PSUM already reads "Partial Sum buffer". The Trn2 NKI record (`nkiTrn2Arch`) stays as
  the NeuronCore-v3 cite. No v3 size is stated, so no size needed checking.
- **Trainium3 8-bit format.** Not applicable. The section and diagram name no 8-bit format (grep for
  FP8 finds nothing). For reference, the Trn3 page today gives "2,517 MXFP8/MXFP4 TFLOPS" and has an
  "FP8 (TFLOPS)" table row.
- **Neuron SDK version and the latest docs URL.** The section names Neuron 2.32.0 (table header,
  `neuron-explorer capture`), plus 2.27.0, 2.28.0 and 2.29.0 for dated features. Today `/en/latest/`
  serves **Neuron 2.33.0** (released 10/19/2026). **FIXED** by pinning the version-dependent records to
  `/en/v2.32.0/`: `neuronReleaseNotes`, `pytorchNotes`, `compilerNotes` and `pytorchNative`, plus the new
  `jaxNeuronx`. Every table value was confirmed on the v2.32.0 index. The TorchNeuron status sentence is
  the one place where 2.33.0 made the text wrong, and it now cites the v2.33.0 page.
  - Records left on `latest`: `nkiOverview`, `neuronTopGuide`, `neuronCache`, `nkiTrn2Arch` and
    `ncMatmul` (latest is identical to v2.32.0 for the quoted text), and `neuronWhatsNew` and
    `devToolsNotes` (cumulative pages that still carry every quoted 2.27.0 to 2.32.0 entry).
  - `neuronCompiler` stays on `latest` because the v2.32.0 copy of that page contradicts the auto-cast
    default.
- **NKI, neuronx-cc, NxD Inference and vLLM-on-Neuron claims against versioned pages.**
  - NKI (claims 5, 7, 9 to 11, 42, 45, 46, 49, 50): confirmed on v2.32.0. nkiOverview is identical on
    latest.
  - neuronx-cc (1 to 4, 19, 20): confirmed, with the compiler-overview caveat above.
  - NxD Inference (25, 32): the version is confirmed. "Maintenance from 2.32.0" was unsupported, because
    AWS dates maintenance to an announcement in Neuron 2.30. The start version is cut.
  - vLLM Neuron (24, 31, 33): confirmed on v2.32.0 and on the pinned GitHub release.
- **Length (+26%).** The fixes removed about 21 words net, leaving about +24%. Scored 7 on economy.
  Cut candidates are in the Backlog.

## Fixes applied

`src/sections/AwsCompilersAndTooling.tsx`:
- :44, compiler Cite note.
  - Before: "The compiler's own release-notes page lists 2.27.4747.0 for the same release."
  - After: "The compiler's release-notes page heads its Neuron 2.32.0 entry 2.27.5334.0, but its Latest
    version line reads 2.27.4747.0."
- :169-170, citation for "torch-neuronx captures ... and JAX NeuronX does the same for JAX".
  - Before: `<Cite neuronCompiler/>`.
  - After: `<Cite neuronCache/>` `<Cite jaxNeuronx/>`.
- :185-190, the PyTorch path paragraph.
  - Before: "from PyTorch 2.10, in a future Neuron release, Neuron uses TorchNeuron and scripts need
    updating. ... AWS describes it both as open source at aws-neuron/torch-neuronx and as a closed
    beta<Cite pytorchNative/>; that repository was not public when this research checked it in October
    2026."
  - After: "from PyTorch 2.10, Neuron uses TorchNeuron, and scripts need updating. ... It is open source
    at aws-neuron/torch-neuronx and in public beta from Neuron 2.33.0 (October 2026).<Cite
    torchNeuron233/><Cite torchNeuronxRepo/>"
- :267, the NxD Inference start version.
  - Before: "NxD Inference is in maintenance mode from Neuron 2.32.0, and AWS directs its users to vLLM
    Neuron."
  - After: "NxD Inference is in maintenance mode, and AWS directs its users to vLLM Neuron."
- :359, citations for the SBUF/PSUM names: added `<Cite nkiTrnInf2Arch/>` before `nkiTrn2Arch`.

`src/sources/AwsCompilersAndTooling.ts`:
- `compilerNotes`, `neuronReleaseNotes`, `pytorchNotes`, `pytorchNative`: URLs `/en/latest/` changed to
  `/en/v2.32.0/`, titles prefixed "AWS Neuron 2.32.0:" (the dive's convention), accessed 2026-10-23.
- New records:
  - `nkiTrnInf2Arch` (T1, reused).
  - `jaxNeuronx`: `/en/v2.32.0/frameworks/jax/index.html`, T1.
  - `torchNeuron233`: `/en/v2.33.0/torch/about-pytorch-neuron.html`, T1.
  - `torchNeuronxRepo`: `github.com/aws-neuron/torch-neuronx/tree/v2.33.0`, T1, source pinned to a
    release tag.

`src/components/AwsCompilerStack.tsx`: unchanged.

## Checks

- `pnpm exec tsc --noEmit | grep ...`: "no type errors in my files" (exit 0).
- `pnpm exec eslint` on the section, sources file and component, `--max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t AwsCompilersAndTooling`: 1 passed, 34
  skipped (exit 0).
- Gates, run from the repo root: no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0,
  pre-overflow exit=0. None of them has a hit in my files.
- `pnpm exec vite build --outDir /tmp/vf-AwsCompilersAndTooling-dist`: exit 0. `node scripts/shoot.mjs
  --sections aws-compilers --widths 1440,390`: "ok" at both widths (exit 0). Run for scoring; the
  diagram is unchanged. I read the flow PNGs:
  - 1440: clean.
  - 390: the canvas scrolls sideways with legible labels.

## For the orchestrator

- **Neuron 2.33.0 shipped on 2026-10-19, and `latest` docs now serve it.** Records that cite
  `/en/latest/frameworks/torch/pytorch-native-overview.html` now redirect to
  `torch/about-pytorch-neuron.html` (2.33.0 text). That page drops both "closed Beta" and the
  `torch.all_to_all_vdev_2d` future-release item. Two places are affected:
  - `AwsCustomSilicon.tsx:311-312`: "TorchNeuron, a closed beta, lists for future releases". This is
    stale against its own cited URL. Pin `pytorchNative` in AwsCustomSilicon.ts to `/en/v2.32.0/` (as
    this section now does) or update to 2.33.0's public beta.
  - `CommunicationAndScaleOut.ts:80`: same URL. Check what it backs.
- **aws-neuron/torch-neuronx is public** (GitHub API 2026-10-23, tag v2.33.0, Apache-2.0). Any section
  or README text saying the repository is not public is wrong today.
- **Bibliography entries.** These records now differ in URL from other sections' `latest` copies, so
  each appears twice in the bibliography: `pytorchNative`, `neuronReleaseNotes`, `pytorchNotes`,
  `compilerNotes`. Each entry is titled with its version.
- **neuronCompiler caveat.** The v2.32.0 copy of the compiler overview says the default casts FP32
  matmuls to BF16, contradicting the CLI reference and the current page. Anyone pinning `neuronCompiler`
  to v2.32.0 would cite a contradiction; keep it on latest or v2.33.0.
- **NxD Inference "maintenance from 2.32.0".** AWS's announcement dates it to "As announced in Neuron
  2.30". `MoeAndSparseActivation.tsx:421-422` ("now in maintenance mode") is fine as worded.
- **Next-iteration re-pin to Neuron 2.33.0.** The 2.33.0 index values, quoted from latest:
  - neuronx-cc 2.28.7631.0
  - NKI 0.7.0
  - Runtime 2.35.30.0
  - nrtpy 2.35.30
  - vLLM Neuron 0.29.0.1.2.0
  - Developer Tools 2.33.38.0
  - JAX NeuronX 0.10.0.1.0.14198, "supports JAX 0.7.0 to 0.10.0"
  - TorchNeuron (Beta) "2.14.3.0 and 2.13.3.0"
  - NKI Library 2.33.0

  The 2.33.0 lifecycle notes read: "NeuronX Distributed (NxD) Inference and NxD Core inference APIs
  – Support on Trn2 and Trn3 ends in Neuron 2.34" and "PyTorch/XLA inference – Support on Trn2 and Trn3
  ends in Neuron 2.34". vLLM Neuron "uses native PyTorch compilation by default". This matches the
  vLLM-revamp precedent: pin to the researched version, and re-pin in the next iteration.

## Backlog

- **Re-pin to Neuron 2.33.0** (new scope): versions table, nki-library tag 2.33.0, vllm-neuron tag
  v0.29.0.1.2.0. NxD Inference end of support in 2.34 is practical for a serving reader. TorchNeuron
  caches under `TORCH_NEURONX_HLO_CACHE_DIR` (latest TorchNeuron page), so the compile-cache paragraph
  covers the PyTorch/XLA flow only.
- **Cut candidates** (economy, not corrections), about 45 words:
  - h1 navigation sentence "This is the AWS counterpart to *NVIDIA Compilers and Kernel Tooling*; *AWS
    Trainium, Inferentia and Neuron* covers the NeuronCore it targets." (22 words)
  - "NKI is stable from NKI 0.3.0 (Neuron 2.29.0)." (8 words)
  - "the old profiler's TensorBoard plugin is out of support" (9 words; its end of support was 2.27)
  - "Pin vLLM Neuron by release tag." (6 words; generic advice, and its Cite can move to the version row)
