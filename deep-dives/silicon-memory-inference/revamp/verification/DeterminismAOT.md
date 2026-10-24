# Verification: Determinism: NEFF and GPU Reproducibility

Verified: 2026-10-23. Claims checked: 45 (sampled: 0, every claim checked). Confirmed 42,
wrong 0, unsupported 3, mislabelled 0, unverifiable 0. Four source records were also
repaired (one dead URL, one shared-record realignment, two version labels).

## Gate 3 score: 8/10

The section rests on one model the reader can carry to any accelerator: the batch, not the
chip, decides whether a served call repeats. It then gives what to type (the PyTorch and cuBLAS
settings, the vLLM and SGLang flags, the Neuron rounding variables and bucket config) and closes
on a replay checklist with a verification step. No load-bearing figure was wrong. Three claims
went beyond their sources: the "deterministic by default" framing for Trainium, "no warp
scheduler" cited to a page that never says it, and an HBM-latency claim wider than the page.
All three are softened to what the sources state. Holding it below 9: the regulatory table is the
heaviest block in a hardware section, and the "strongest number" (`Unique samples: 1` across 50
trials) is a documented pass criterion, not a measured result.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 42 of 45 confirmed on first check, 0 wrong. The 3 unsupported claims were scope overreach (h2 and diagram "deterministic by default", the warp-scheduler cite, the HBM-latency scope). All are fixed |
| Mental model or practical value | 9 | "The batch decides" is the model. The code block, the two engine flags, the rounding variables, the bucket names and the checklist are things to do. The isolation block is short but ends in a decision (own engine, or batch-invariant shared engine). Every block passes one of the two tests |
| Shape | 8 | Introduces before dissecting. h2 descriptions state the payoff. The SGLang 50-trial check lands twice (GPU block and closing checklist). Supporting evidence (bug fixes, throughput cost, CCCL) sits in two ExpandableSections. Ends on the reader's next action (replay, compare bit for bit, repeat after upgrades) |
| Writing | 8 | The no-ai-tells gate is clean for these files. "Our reading" labels carry real weight. "vLLM notes it may cost performance" is a vendor caveat, so the attribution stays. "so no warp scheduler makes those choices" defines by contrast, mildly, and matches the sibling sections |
| Economy | 8 | +24% closed and +26% open (author's count, 948 to 1,177 words). Growth goes to the server flags and the checklist. The four-row regulatory table is compact but is the least hardware-specific block |
| Diagrams | 9 | Inline SVG, `role="img"`, `aria-labelledby` and a `<title>` stating the assertion. The probe reports "ok" at 1440 and 390, with no overlap or clipping. At 390 it scrolls sideways at 640 px per the dive convention. The new taglines fit inside their boxes (PNG read) |

## Claims

Hedge scope: an AWS Neuron page that says "deterministic" or "reproducible" for one setting is
not taken as a guarantee for all settings.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Determinism lets a team debug a model or serving stack, regression-test an upgrade, keep log-probabilities consistent across RL rollouts | vllmBatchInvariance, sglangDeterministic | CONFIRMED | vLLM v0.31.0 Motivation: "Framework debugging", "Model debugging", "RL training often requires deterministic rollouts", "testing, validation". SGLang v0.5.21: "Ensures consistent logprobs across runs"; "Enables reproducible validation" | - |
| 2 | Even at temperature 0, batch size changes how kernels split reductions; FP addition not associative | sglangDeterministic | CONFIRMED | "Even with `temperature=0` ... The main source is **varying batch sizes**. Different batch sizes cause GPU kernels to split reduction operations differently ... floating-point non-associativity" | - |
| 3 | On Trainium the serving runtime chooses a pre-compiled NEFF per step from the live batch | vllmNeuronBucketing | CONFIRMED | "Bucket selection is per-forward-pass and adapts to the live batch. On every decode step the runtime inspects the requests currently in the batch ... dispatches the smallest configured bucket that covers it" | - |
| 4 | The Neuron compiler builds the NEFF ahead of time, fixing memory allocation and instruction order | nkiOverview | CONFIRMED (substance) | "How NKI works": the compiler "eventually generates a NEFF (Neuron Executable File Format) that is executable on NeuronDevices"; back-end stage: "memory allocation and instruction scheduling are done in this stage". "Ahead of time" is compile-then-load, as AwsCompilersAndTooling and KernelExecutionLifecycle verified | - |
| 5 | "A NeuronCore has no warp scheduler" | neuronCoreV3 | UNSUPPORTED | NeuronCore-v3 page has no "warp" anywhere. The NKI Trainium/Inferentia2 architecture guide has no "warp" either | Restated as a consequence of claim 4, cited to nkiOverview: "...fixing memory allocation and instruction order, so no warp scheduler makes those choices at run time". This matches AwsCompilersAndTooling and AwsCustomSilicon |
| 6 | On-chip SRAM is software-managed | neuronCoreV3 | CONFIRMED | "NeuronCore-v3 on-chip SRAM is software-managed to maximize data locality" | - |
| 7 | "intra-node collective latency depends on HBM load" | intranodeCollectives | UNSUPPORTED (scope widened) | "the per-hop latency of Ring/KangaRing is about 1-2 us (HBM load dependent)" | Narrowed: "the per-hop latency of intra-node ring collectives depends on HBM (High Bandwidth Memory) load" |
| 8 | PyTorch-Neuron turns stochastic rounding on when `XLA_USE_BF16=1` | neuronRoundingModes | CONFIRMED | "NOTE: Stochastic rounding mode is enabled by default in PyTorch-Neuron when XLA_USE_BF16=1." | - |
| 9 | `NEURON_RT_STOCHASTIC_ROUNDING_EN=0` selects round-to-nearest-even | neuronRoundingModes | CONFIRMED | "To use standard RNE rounding, use the environment variable NEURON_RT_STOCHASTIC_ROUNDING_EN=0." | - |
| 10 | Set `NEURON_RT_STOCHASTIC_ROUNDING_SEED` to a fixed value | neuronEnvVars | CONFIRMED (record repaired) | "Please set NEURON_RT_STOCHASTIC_ROUNDING_SEED to a fixed value to ensure reproducibility between runs." The page also says the seed defaults to 0 when unset. The `latest/frameworks/jax/...` URL returned 404 on two fetches: Neuron 2.33.0 (2026-10-19) moved it to `latest/jax/api-reference-guide/`. The v2.32.0 copy carries the same text | URL pinned to v2.32.0, title "AWS Neuron 2.32.0: ...", accessed 2026-10-23 |
| 11 | vLLM Neuron compiles one decode NEFF per batch-size bucket; with context-length buckets configured, picks per step the smallest that covers the batch | vllmNeuronBucketing | CONFIRMED | "one NEFF per batch-size bucket"; "Let the user opt in to a second bucketing dimension"; "dispatches the smallest configured bucket that covers it". Same text at v2.32.0 | - |
| 12 | Our reading: one batch-size bucket and no context-length buckets leave one decode NEFF | vllmNeuronBucketing (derived) | CONFIRMED | Compile-target count "No spec decode: \|num_seqs_buckets\| x (\|decode_context_length_buckets\| + 1)" = 1 x (0 + 1) = 1. Labelled as a reading | - |
| 13 | "No test of whether two buckets give identical bits for one request was located during this research" | none (hedge) | CONFIRMED (scope kept) | The hedge is scoped to this research. No Neuron page fetched states bucket-to-bucket bit equality. The bucketing page's "bit-identical to today" refers to the feature being off, not to two buckets | - |
| 14 | Neuron 2.27.0 changed `--auto-cast` default to `none` and turned on mixed-precision accumulation | neuronCompilerNotes | CONFIRMED | 2.27.0 (12/19/2025): "The --auto-cast flag now defaults to none (previously matmul), and --enable-mixed-precision-accumulation is now enabled by default." | Record realigned to the v2.32.0 URL used by AwsCompilersAndTooling `compilerNotes` |
| 15 | Neuron 2.31.0 fixed "incorrect tensor reordering in the simplifier that could produce non-deterministic optimization results" | neuronCompilerNotes | CONFIRMED | Verbatim under "Neuron Compiler (Neuron 2.31.0 Release)", 07/07/2026, at both latest and v2.32.0 | - |
| 16 | NKI Library fixed Attention TKG tensor alignment "to resolve non-determinism error" | nkiLibNotes | CONFIRMED | "Attention TKG: Fixed tensor 4-byte alignment to resolve non-determinism error." (NKI-Lib, Neuron 2.30.0, 05/21/2026) | - |
| 17 | h2 "Trainium: deterministic by default once you pin the NEFF, the rounding seed and the bucket"; diagram taglines "Deterministic by default once pinned" and "Deterministic once configured" | nkiOverview, neuronEnvVars, neuronCompilerNotes (implied) | UNSUPPORTED (scope widened) | No Neuron page fetched states that a NEFF gives bit-identical output from run to run. The only reproducibility sentence covers one setting, the rounding seed (claim 10). The release notes treat non-determinism as bugs (claims 15, 16), and 2.33.0 adds "Fixed non-deterministic results in multi-subgraph models with collective operations". On the GPU side, PyTorch says its switch "alone is not always enough to make an application reproducible" | h2 now "Trainium: pin the NEFF, the rounding seed and the bucket", description "...the three things to pin before a Trainium call can replay". Taglines now "The NEFF fixes the schedule; you pin the rest" and "Libraries repeat per configuration; you set the rest" |
| 18 | cuBLAS gives the same bits per toolkit version, architecture and SM count | cublasReproducibility | CONFIRMED | 2.1.4 (CUDA 13.4 docs, last updated Oct 12, 2026): "all cuBLAS API routines from a given toolkit version, generate the same bit-wise results at every run when executed on GPUs with the same architecture and the same number of SMs" | Title records CUDA 13.4 (archive/13.4.0 is 404, so the URL stays unversioned) |
| 19 | Several streams: own workspace per stream, or `CUBLAS_WORKSPACE_CONFIG=:4096:8`, about 24 MiB | cublasReproducibility | CONFIRMED | "provide a separate workspace for each used stream ... or set a debug environment variable CUBLAS_WORKSPACE_CONFIG to :16:8 (may limit overall performance) or :4096:8 (will increase library footprint in GPU memory by approximately 24MiB)" | - |
| 20 | Most cuDNN routines repeat on one architecture; exceptions use atomics; none across architectures | cudnnReproducibility | CONFIRMED | "most of cuDNN's routines from a given version generate the same bit-wise results across runs when executed on GPUs with the same architecture. There are some exceptions ... because they use atomic operations"; "Across different architectures, no cuDNN routines guarantee bitwise reproducibility." The same text is at the v9.27.0 URL | URL pinned to v9.27.0 (current), title updated |
| 21 | `torch.use_deterministic_algorithms(True)` selects deterministic implementations and raises an error for an op without one | pytorchReproducibility | CONFIRMED | randomness.md v2.14.1: "use deterministic algorithms instead of nondeterministic ones where available, and to throw an error if an operation is known to be nondeterministic (and without a deterministic alternative)" | - |
| 22 | `torch.backends.cudnn.benchmark = False` fixes cuDNN's algorithm choice | pytorchReproducibility | CONFIRMED | "causes cuDNN to deterministically select an algorithm, possibly at the cost of reduced performance" | - |
| 23 | `torch.manual_seed()` seeds every device | pytorchReproducibility | CONFIRMED | "seed the RNG for all devices (both CPU and CUDA)" | - |
| 24 | Code block: `CUBLAS_WORKSPACE_CONFIG` "only needed when several CUDA streams are active" | cublasReproducibility | CONFIRMED | cuBLAS limits the exception to multiple streams (claim 19). At v2.14.1 neither the `use_deterministic_algorithms` docstring (torch/__init__.py) nor aten/src/ATen/Context.cpp contains a CUBLAS_WORKSPACE_CONFIG check, so PyTorch does not demand it on its own | - |
| 25 | `VLLM_BATCH_INVARIANT=1 vllm serve <model>`: beta, compute capability 8.0+, custom all-reduce off in tensor-parallel mode | vllmBatchInvariance | CONFIRMED | "Batch invariance is currently in beta"; "NVIDIA GPUs with compute capability 8.0 or higher" (also Intel XPUs); "custom all-reduce operations in tensor parallel mode" disabled. Pinned v0.31.0, the dive's vLLM pin in all 13 uses | - |
| 26 | SGLang `--enable-deterministic-inference` with FlashInfer, FlashAttention 3 or Triton | sglangDeterministic | CONFIRMED | "only supported with the following three attention backends: **FlashInfer**, **FlashAttention 3 (FA3)**, and **Triton**". Pinned v0.5.21, the dive's SGLang pin in all 9 uses | - |
| 27 | Its test passes on `Unique samples: 1` across 50 trials | sglangDeterministic | CONFIRMED (documented pass criterion, not a measurement) | `--test-mode single --n-trials 50`; "Expected result: All tests should show `Unique samples: 1`" | - |
| 28 | Both take a per-request seed above temperature 0, leave the mode off by default; vLLM notes it may cost performance | vllmBatchInvariance, sglangDeterministic | CONFIRMED | vLLM: request example `temperature=0.7, seed=42`; "compared to the default non-deterministic mode"; "may impact performance". SGLang: `"sampling_seed": seed`; "flag; default: disabled" | - |
| 29 | Deterministic ops often slower; disabling cuDNN benchmarking gives up the fastest algorithm per shape | pytorchReproducibility | CONFIRMED | "Deterministic operations are often slower than nondeterministic operations"; benchmarking runs algorithms "to find the fastest one" per set of size parameters | - |
| 30 | CCCL 3.1 `cub::DeviceReduce` levels `not_guaranteed` (single pass, atomics, fastest), `run_to_run` (two passes, default), `gpu_to_gpu` | ccclV310 | CONFIRMED | Release v3.1.0 (published 2025-10-14, GitHub API): "new single-pass reduction using atomics"; "existing two-pass implementation" ("status quo"). The blog gives "run_to_run (default)" and "Not-guaranteed determinism ... provides the highest performance" | - |
| 31 | `gpu_to_gpu` returns identical results on different GPUs through a Reproducible Floating-point Accumulator | ccclDeterminismBlog (T2) | CONFIRMED | "gpu_to_gpu for identical results across different GPUs using a Reproducible Floating-point Accumulator" (blog, 2026-03-05) | - |
| 32 | The only NVIDIA primitive located that targets identical bits across GPU models; scope one reduction on one device | none (hedge) | CONFIRMED (scope kept) | Blog: "Determinism control is currently limited to reductions". The "located during this research" wording keeps the hedge scoped | - |
| 33 | SR 26-2, April 2026, superseding SR 11-7 | sr262Letter | CONFIRMED | "April 17, 2026"; "supersedes and replaces SR letter 11-7 ... and SR letter 21-8" | - |
| 34 | Statistical models and non-generative AI; generative and agentic AI out of scope; validation generally precedes first use | sr262Guidance | CONFIRMED | PDF p.3 footnote 3: "Generative AI and agentic AI models ... are not within the scope of this guidance ... apply to traditional statistical and quantitative models and non-generative, non-agentic AI models". p.8, section V: "Validation generally occurs prior to a model's first use." | - |
| 35 | RTS 6: test before deployment (Art. 5), validate yearly (Art. 9), HFT order records kept five years (Art. 28) | rts6 | CONFIRMED | Live EUR-Lex returned HTTP 202 with an empty body. Read the web.archive.org capture of 2025-09-11 (20250911032004). Art. 5(1) "Prior to the deployment ... shall establish clearly delineated methodologies to develop and test"; Art. 9(1) "shall annually perform a self-assessment and validation process"; Art. 28(3) "kept for five years" | - |
| 36 | SEC 17a-4(e)(8): keep 18 months or produce on request; changed system needs a record of changes or parameters | sec17a4 | CONFIRMED | The eCFR page served a CAPTCHA. Read the eCFR versioner API at 2026-10-21: "(8) All reports produced to review for unusual activity in customer accounts until eighteen months ... a record explaining each system change ... a record of the parameters that were used" | - |
| 37 | DORA Art. 17: identify, document, address root causes of ICT incidents | dora | CONFIRMED | Live EUR-Lex returned 202. Read the web.archive.org capture of 2024-04-13 (20240413072209). Art. 17(2) "to ensure that root causes are identified, documented and addressed" | - |
| 38 | "None of these texts requires identical output bits" | sr262Guidance, rts6, sec17a4, dora | CONFIRMED (scope: the four texts) | No match for "reproduc", "determinis" or "reconstruct" in the RTS 6 or DORA captures. No "reproduc" or "replicat" in the SR 26-2 attachment. 17a-4 uses "reproduced" for reports and allows a changed system with a record of changes, not bit identity | - |
| 39 | A MIG instance has its own share of the SMs | migConcepts | CONFIRMED | "A GPU SM slice is roughly one seventh of the total number of SMs available in the GPU when configured in MIG mode" | - |
| 40 | cuBLAS and PyTorch promise no match across versions | cublasReproducibility, pytorchReproducibility | CONFIRMED | cuBLAS: "bit-wise reproducibility is not guaranteed across toolkit versions"; PyTorch: "not guaranteed across PyTorch releases, individual commits, or different platforms" | - |
| 41 | Neuron compiler defaults have changed between releases | neuronCompilerNotes | CONFIRMED | See claim 14 | - |
| 42 | Checklist names `num_seqs_buckets`, `decode_context_length_buckets` | vllmNeuronBucketing | CONFIRMED | Both appear in the page's config examples | - |
| 43 | `python3 -m sglang.test.test_deterministic --test-mode single --n-trials 50`, expect `Unique samples: 1` | sglangDeterministic | CONFIRMED | Verbatim under "Verification" | - |
| 44 | Diagram bullets and band (instruction order, SRAM, archived NEFF, seed, bucket, SDK, cuBLAS/cuDNN scope, the four GPU settings, the two engine flags, fixed bucket configuration) | as claims 3-28 | CONFIRMED | Each restates a confirmed claim above. The one number drawn (`:4096:8`) is cited in the Libraries paragraph | Taglines only (claim 17) |
| 45 | CCCL record title date 2025-10-14 | ccclV310 | CONFIRMED | GitHub API `published_at: 2025-10-14T22:04:54Z` | - |

Tiers: all records are Tier 1 (official docs, regulator texts, release pages and docs pinned at a
tag), except the NVIDIA CCCL blog (Tier 2, vendor blog). This matches the brief, and the
one-URL-one-tier test passes. Every GitHub URL is pinned: vLLM v0.31.0, SGLang v0.5.21, PyTorch
v2.14.1, CCCL v3.1.0.

## ORCH-NOTES items

ORCH-NOTES has no item that names this section. Verdicts on the coordinator's items for this run:

- **NEFF ahead-of-time compilation:** CONFIRMED (claim 4).
- **What the NEFF fixes at compile time:** CONFIRMED for memory allocation and instruction
  scheduling (claim 4). The warp-scheduler point was UNSUPPORTED on its cited page and is now a
  consequence of claim 4 (claim 5).
- **Neuron compiler cache:** the section makes no compiler-cache claim, so there is nothing to
  verify. "Replay the archived NEFF rather than recompiling" is advice backed by claims 14 and 15.
- **NEFF bitwise-identical run to run:** no Neuron page fetched states it. The h2 and diagram
  framing went beyond the one-setting seed sentence and is softened (claim 17). The
  bucket-equality hedge is kept (claim 13).
- **PyTorch settings and `CUBLAS_WORKSPACE_CONFIG` values:** CONFIRMED at PyTorch v2.14.1 and in
  the cuBLAS 13.4 docs (claims 19, 21-24). The section omits `:16:8`, which is fine.
- **cuBLAS and cuDNN reproducibility statements:** CONFIRMED (claims 18, 20). The cuDNN record is
  now pinned to v9.27.0. The cuBLAS page cannot be pinned (archive/13.4.0 is 404), so its title
  names CUDA 13.4.
- **Atomics and split-K:** atomics CONFIRMED (cuDNN exceptions, CCCL `not_guaranteed`). Split-K is
  not named. "Kernels split their reductions" is SGLang's wording (claim 2).
- **Batch-invariant kernels:** CONFIRMED through the vLLM and SGLang docs (claims 25-28).
- **Measured nondeterminism figures:** the section has none. The only figure is SGLang's
  documented pass criterion, `Unique samples: 1` across 50 trials (claim 27). It is correctly
  worded as what the test passes on, not as a measurement.
- **vLLM and SGLang pins:** v0.31.0 and v0.5.21, the same tags every other section uses. No
  divergence.
- **Record tiers against other sections:** consistent (the test passes). Two shared records now
  differ in URL; see "For the orchestrator".
- **Related ORCH-NOTES item (NeuronCore-v3 page lacks SBUF and PSUM):** this section cites that
  page only for software-managed SRAM, which the page states.

## Fixes applied

- `src/sections/DeterminismAOT.tsx:134-137`, h2 and description.
  - Before: "Trainium: deterministic by default once you pin the NEFF, the rounding seed and the bucket" / "...the three things you pin so a Trainium call replays".
  - After: "Trainium: pin the NEFF, the rounding seed and the bucket" / "...the three things to pin before a Trainium call can replay".
- `src/sections/DeterminismAOT.tsx:143-150`.
  - Before: "...fixing memory allocation and instruction order.[nkiOverview] A NeuronCore has no warp scheduler, and its on-chip SRAM (static RAM) is software-managed.[neuronCoreV3] Timing still varies: intra-node collective latency depends on HBM (High Bandwidth Memory) load."
  - After: "...fixing memory allocation and instruction order, so no warp scheduler makes those choices at run time.[nkiOverview] A NeuronCore's on-chip SRAM (static RAM) is software-managed.[neuronCoreV3] Timing still varies: the per-hop latency of intra-node ring collectives depends on HBM (High Bandwidth Memory) load."
- `src/components/DeterminismDiagram.tsx:33`: tagline "Deterministic by default once pinned" now reads "The NEFF fixes the schedule; you pin the rest".
- `src/components/DeterminismDiagram.tsx:53`: tagline "Deterministic once configured" now reads "Libraries repeat per configuration; you set the rest".
- `src/sources/DeterminismAOT.ts:41-48`, `neuronEnvVars`: the URL changed from `en/latest/frameworks/jax/api-reference-guide/neuron-envvars.html` (404) to `en/v2.32.0/frameworks/jax/api-reference-guide/neuron-envvars.html`. The title is prefixed "AWS Neuron 2.32.0:" and accessed is now 2026-10-23.
- `src/sources/DeterminismAOT.ts:56-62`, `neuronCompilerNotes`: the URL is now `en/v2.32.0/release-notes/components/compiler.html` and the title "AWS Neuron 2.32.0: Component Release Notes for Neuron Graph Compiler", both matching AwsCompilersAndTooling `compilerNotes`. Accessed is now 2026-10-23.
- `src/sources/DeterminismAOT.ts:72-79`, `cublasReproducibility`: the title adds "(CUDA 13.4)" and accessed is now 2026-10-23.
- `src/sources/DeterminismAOT.ts:80-87`, `cudnnReproducibility`: the URL changed from `backend/latest/...` to `backend/v9.27.0/developer/misc.html`. The title adds "9.27.0" and accessed is now 2026-10-23.

## Checks

- `pnpm exec tsc --noEmit | grep -E "DeterminismAOT|DeterminismDiagram|sources/DeterminismAOT"`: "no type errors in my files".
- `pnpm exec eslint src/sections/DeterminismAOT.tsx src/sources/DeterminismAOT.ts src/components/DeterminismDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t DeterminismAOT`: exit 0 (1 passed, 34 skipped).
- `pnpm exec vitest run src/__tests__/sources.test.ts`: exit 1. 854 tests pass, including "gives one URL the same tier everywhere it is cited". The one failure is "keeps sources.md in sync with the registry", expected after four record edits. sources.md is the orchestrator's file.
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0. No hits in DeterminismAOT or DeterminismDiagram.
- `pnpm exec vite build --outDir /tmp/vf-DeterminismAOT-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections determinism --widths 1440,390 ...`: "determinism @1440: 1 SVG diagram(s), 0 React Flow, ok" and "determinism @390: 1 SVG diagram(s), 0 React Flow, ok".
- PNGs read: at 1440 both new taglines sit inside their boxes with clear margin, and no text crosses a line or arrow. At 390 the diagram scrolls sideways at 640 px as intended. The full page shows no overflow outside the table and code containers.

## For the orchestrator

- **Dead shared URL.** `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/jax/api-reference-guide/neuron-envvars.html` returns 404 (two fetches, 2026-10-23). Neuron 2.33.0 (released 2026-10-19) moved the JAX docs to `en/latest/jax/api-reference-guide/neuron-envvars.html`. `src/sources/AwsCustomSilicon.ts:110` and `src/sources/CapitalMarketsLens.ts:56` still carry the dead URL. Suggest they reuse this section's record: title "AWS Neuron 2.32.0: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)", URL `en/v2.32.0/frameworks/jax/api-reference-guide/neuron-envvars.html`, accessed 2026-10-23. The seed sentence is identical there.
- **sources.md** needs regenerating for the four record changes. `neuronCompilerNotes` now merges into the AwsCompilersAndTooling v2.32.0 entry.
- **Neuron 2.33.0 is out.** Every `en/latest/` Neuron URL in the dive now serves 2.33.0 pages. Content checked here was unchanged for the claims this section uses. The dive's other Neuron pins say 2.32.0.

## Backlog

- Neuron 2.33.0 compiler notes add "Fixed non-deterministic results in multi-subgraph models with
  collective operations caused by collective handshakes being skipped incorrectly". It is a third,
  results-level example for "Why the replay check stays on the list". It is new content, so it
  was not added.
- The CCCL blog gives a vendor-measured cost for `gpu_to_gpu`: "increasing execution time by 20%
  to 30% for large problem sizes on an NVIDIA H200 GPU" (Tier 2, would be marked `vendor-claim`).
  It would put a number on the throughput-cost expandable.
- The section has no measured divergence figure for batch-variant serving. A measured source,
  such as the Thinking Machines Lab batch-invariance work that SGLang builds on, would land the
  "batch decides" model with evidence. Fetch it before quoting any figure.
- SGLang's default `sampling_seed` is 42 even when the request sets none. That could join the
  per-request-seed sentence as a practical default.
