# Change report: DeterminismAOT (nav id `determinism`, "Determinism: NEFF and GPU Reproducibility")

Status: COMPLETE (not committed)

Files: `src/sections/DeterminismAOT.tsx`, `src/components/DeterminismDiagram.tsx`,
`src/sources/DeterminismAOT.ts` (new, 21 records, all cited), this report.

Register: `research/2026-10-refresh/04-other-arch.md` section 0 (Determinism row) and
section 5 (DA1 to DA33, Recommended edits 1 to 7). Cross-section notes in
`revamp/REVAMP-PLAN.md` followed: no NEFF determinism claimed beyond instruction order
(and memory allocation, as Isolation and Kernel Execution Lifecycle cite from the NKI
overview); timing varies with HBM load (the AWS Compilers `intranodeCollectives` record);
TEE-I/O is not described here at all (Isolation owns it); Groq is the only
"deterministic" vendor claim in the dive and this section makes none.

Shared records reuse URL, title, publisher and tier exactly: `nkiOverview`, `neuronCoreV3`,
`migConcepts` (IsolationNie.ts), `neuronEnvVars`, `vllmBatchInvariance`
(CapitalMarketsLens.ts), `intranodeCollectives`, `neuronCompilerNotes` (AwsCompilersAndTooling.ts,
key `neuronCompilerNotes` here), `nkiLibNotes` (QuantizationAndPrecision.ts /
MoeAndSparseActivation.ts). Tier-consistency test passes.

## Fetched during authoring (records carry 2026-10-17)

- vLLM `docs/features/batch_invariance.md` at v0.31.0: beta note; "deterministic and
  independent of the batch size or the order of requests in a batch"; hardware: NVIDIA
  compute capability 8.0 or higher, Intel XPUs; `VLLM_BATCH_INVARIANT=1 vllm serve ...`;
  per-request `seed`; disables custom all-reduce in tensor-parallel mode and sequence
  parallelism; "may impact performance".
- SGLang `deterministic_inference.mdx` at v0.5.21: "The main source is varying batch sizes";
  FlashInfer, FA3, Triton only; `--enable-deterministic-inference` "default: disabled";
  `sampling_seed`; `python3 -m sglang.test.test_deterministic --test-mode single --n-trials 50`,
  expected `Unique samples: 1`.
- vLLM Neuron design page, Decode Context-Length Bucketing: "one NEFF per batch-size bucket";
  context-length buckets are opt-in; "Bucket selection is per-forward-pass and adapts to the
  live batch".
- PyTorch reproducibility notes at v2.14.1. **The register URL (`randomness.rst`) returns 404
  at that tag; the file is `docs/source/notes/randomness.md`.** The record uses the `.md` path.
  Quotes used: not guaranteed across releases, commits or platforms; "Deterministic operations
  are often slower"; `torch.manual_seed()` seeds all devices; `cudnn.benchmark = False` makes
  cuDNN "deterministically select an algorithm"; `use_deterministic_algorithms` throws on ops
  without a deterministic implementation.
- cuBLAS 2.1.4 "Results Reproducibility": same toolkit, architecture and SM count; not across
  toolkit versions; multi-stream fixes including `CUBLAS_WORKSPACE_CONFIG` `:4096:8` ("approximately
  24MiB").
- Neuron rounding-modes page and JAX env-var page: stochastic rounding default with
  `XLA_USE_BF16=1`; `NEURON_RT_STOCHASTIC_ROUNDING_EN=0` for RNE; seed "to a fixed value to
  ensure reproducibility between runs".
- SR 26-2 letter and attachment PDF: supersedes SR 11-7 and SR 21-8; footnote 3, generative
  and agentic AI out of scope, principles apply to "traditional statistical and quantitative
  models and non-generative, non-agentic AI models"; "Validation generally occurs prior to a
  model's first use". No "reproduc" or "replicat" in the attachment.
- RTS 6 (EUR-Lex): Art. 5 test before deployment, Art. 9 annual self-assessment and validation
  report, Art. 28 HFT order records "kept for five years". No "reproduc", "determinis" or
  "reconstruct".
- 17 CFR 240.17a-4(e)(8) (eCFR): unusual-activity reports kept 18 months or produced on
  request; a changed system that cannot reproduce a report needs a record of each system
  change, or of the parameters used.
- DORA, Regulation (EU) 2022/2554 (EUR-Lex): Art. 17(2) "ensure that root causes are
  identified, documented and addressed". No "reproduc" or "determinis".
- 17 CFR 1.31 (eCFR): retention and production of regulatory records. Read, then cut (below).

## Word count

Measured on the rendered page (`main`, 1440 px), SVG text, citation badges and `code`/`pre`
excluded, with a Playwright text-node walk (script in /tmp, outside the repo).

- Before: 948 words with expandables closed, 1,041 open.
- After: 1,177 closed (+24%), 1,315 open (+26%). The first draft was 1,539 closed; cut by
  compressing the regulatory table, dropping the NIE/MIG/TEE-I/O detail that Isolation owns,
  dropping the `:16:8` cuBLAS alternative and the duplicate PyTorch version caveat, and
  merging the legal-guidance hedge into the table lead.

Reasons for growth, per added block:
- "Before you rely on replay" checklist (DA7, DA31, Recommended edit 4; the prompt makes it
  the section's last block): about 140 words replacing a 60-word Alert.
- The server paragraph (DA32, NEW, Recommended edit 1): the batch-invariant flags a reader
  types, about 85 words. It is the section's spine on the GPU side.
- Regulatory "What the text sets" column (DA20, DA21, Recommended edit 5): the register
  requires stating what SR 26-2 and RTS 6 actually say instead of an unsourced hook.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| DA1 | Regulated workloads "increasingly treat per-call determinism as a first-class requirement" | Operational need: debug a model or serving stack, regression-test an upgrade, keep RL log-probabilities consistent | vllmBatchInvariance, sglangDeterministic (T1) |
| DA2 | "Section 28 covered..." (twice) | cross-reference by name, *Isolation: NIE and MIG* | none |
| DA3, DA8 | "determinism by construction", "free side effect", "most of these properties for free" | h2 "Trainium: deterministic by default once you pin the NEFF, the rounding seed and the bucket"; diagram "Deterministic by default once pinned" | nkiOverview, neuronRoundingModes, neuronEnvVars, vllmNeuronBucketing, neuronCompilerNotes (T1) |
| DA4 | compiler emits schedule incl. SBUF residency "at each clock", reduction order, collective sync points | NEFF fixes memory allocation and instruction order; timing still varies with HBM load | nkiOverview, intranodeCollectives (T1) |
| DA5 | "no runtime kernel selection, no warp-scheduling decision, no cache-eviction policy" | no warp scheduler, SRAM software-managed; the serving runtime picks a NEFF per step from the live batch (one decode NEFF per batch-size bucket; opt-in context-length buckets) | neuronCoreV3, vllmNeuronBucketing (T1) |
| DA6 | same NEFF + input + silicon gives same output | condition adds rounding mode and seed, the bucket, the archived NEFF, SDK version | neuronRoundingModes, neuronEnvVars, vllmNeuronBucketing, neuronCompilerNotes (T1) |
| DA7 | Alert: NEFF plus input sufficient, bit-exact, docs home page citation | checklist (input, weights, versions, Trainium NEFF + rounding vars + bucket config, GPU batch-invariant setting + backend + architecture + SM count, instance type) and a verification step; home-page citation removed | see checklist cites (T1) |
| DA8 | (also) no compiler-version effect | Neuron 2.27.0 changed `--auto-cast` default to `none` and enabled mixed-precision accumulation | neuronCompilerNotes (T1) |
| DA9 | GPU non-determinism list | batch size is the main cause (spine); cuBLAS reproducible per toolkit, architecture and SM count; cuDNN exceptions use atomics, none across architectures | sglangDeterministic, cublasReproducibility, cudnnReproducibility (T1) |
| DA10 | "CUDA deterministic mode" | `torch.use_deterministic_algorithms(True)` | pytorchReproducibility (T1) |
| DA11 | "cuBLAS deterministic algorithm flag / mode" | cuBLAS deterministic by design; several streams: own workspace or `CUBLAS_WORKSPACE_CONFIG=:4096:8` (about 24 MiB) | cublasReproducibility (T1) |
| DA12 | "cuDNN deterministic kernel selection" | `torch.backends.cudnn.benchmark = False` fixes the algorithm choice | pytorchReproducibility (T1) |
| DA13 | "CCCL 3.1 collective determinism for multi-GPU runs" | `cub::DeviceReduce` levels `not_guaranteed`, `run_to_run` (default), `gpu_to_gpu`; scope one reduction on one device (expandable) | ccclV310 (T1), ccclDeterminismBlog (T2) |
| DA14 | "explicit PRNG seeding at well-defined points" | `torch.manual_seed()` seeds every device; both engines take a per-request seed | pytorchReproducibility, vllmBatchInvariance, sglangDeterministic (T1) |
| DA15, DA16 | atomics cost throughput; locked kernel selection | deterministic ops often slower; no cuDNN benchmarking gives up fastest algorithm per shape; CCCL fastest level is single pass with atomics (expandable) | pytorchReproducibility, ccclV310 (T1) |
| DA18 | cost "is the reason it is not on by default" | both engines leave the mode off by default; vLLM notes it may cost performance | vllmBatchInvariance, sglangDeterministic (T1) |
| DA19 | "some explicitly require reproducibility" | "None of these texts requires identical output bits" (term search of each fetched text) | sr262Guidance, rts6, sec17a4, dora (T1) |
| DA20 | SR 11-7 row | SR 26-2 (April 2026, supersedes SR 11-7); statistical models and non-generative AI; generative and agentic AI out of scope; validation precedes first use | sr262Letter, sr262Guidance (T1) |
| DA21 | RTS 6 "order generation must be reconstructable" | test before deployment (Art. 5), validate yearly (Art. 9), HFT order records kept five years (Art. 28) | rts6 (T1) |
| DA22 | CFTC 1.31 / SEC 17a-4 "replayable inference enables compliant audit trails" | SEC 17a-4(e)(8) only, with its text; hook labelled our reading | sec17a4 (T1) |
| DA23 | DORA "benefits from deterministic runtime" | Art. 17 root causes identified, documented, addressed; hook labelled our reading | dora (T1) |
| DA26 | legal-guidance hedge | kept, merged into the table lead | none |
| DA30 | temporal isolation "regardless of ... what else is running" | batch rule (spine, diagram band); isolation block: tenants sharing an engine share its batches (our reading) | sglangDeterministic, vllmNeuronBucketing (T1) |
| DA31 | requirements list (weights, kernel, PRNG, hardware revision, input) | checklist adds software versions, SM count (a MIG instance has its own share of the SMs), batch-invariant setting and bucket config | cublasReproducibility, pytorchReproducibility, neuronCompilerNotes, migConcepts, vllmNeuronBucketing (T1) |
| (h1) | "Determinism — NEFF AOT and GPU reproducibility" | "Determinism: NEFF and GPU Reproducibility" (nav name) | none |

## Claims removed

- DA17 "Multi-GPU determinism requires ordering constraints on collectives" (UNKNOWN, CUT
  candidate).
- DA4 "at each clock" (UNKNOWN, CUT candidate).
- DA24 HIPAA row and DA25 FINRA 3110 row (CUT candidates, unsourced hooks).
- DA22 CFTC Part 1.31 (read on eCFR: a records retention and production rule; the hook added
  nothing the 17a-4 row does not carry, and the register allowed "label or cut").
- DA29 "cryptographic per-MIG-instance encryption" (UNKNOWN). With it, the NIE, MIG and
  TEE-I/O descriptions (DA27, DA28, CORRECT) left this section: *Isolation: NIE and MIG* owns
  and cites them, and here they repeated it without building the determinism model. The block
  keeps the cross-reference and the one point that is this section's: shared engines share
  batches.
- "Two architectural paths ... produce the same property" framing (Recommended edit 1).
- "Same hardware revision (some operations are FP-associative-equivalent across silicon
  revisions but not bit-exact)": replaced by the sourced conditions (architecture and SM count
  for cuBLAS, architecture for cuDNN).
- "Temporal isolation means each call produces the same result regardless of when it runs,
  what else is running" (DA30 WRONG).
- "The output is bit-exact to what was produced in production" with the docs home-page link
  (DA7 WRONG).

## UNKNOWNs and how the page handles each

- Whether two Neuron buckets give identical bits for the same request (DA30, register
  SPECULATIVE): stated as "No test ... was located during this research", followed by a
  labelled reading (one batch-size bucket and no context-length buckets leave one decode NEFF).
- NCCL collective determinism (DA13): not verified; the page scopes CCCL `gpu_to_gpu` to "one
  reduction on one device" and says it is the only such primitive "located during this
  research".
- Regulatory hooks (DA21 to DA23): each row's third column is headed "Where replay helps" and
  the lead says it is our reading, not legal guidance.

## NEW content

- DA32 batch-invariant serving: vLLM `VLLM_BATCH_INVARIANT=1 vllm serve <model>` (beta,
  compute capability 8.0+, custom all-reduce off under tensor parallelism) and SGLang
  `--enable-deterministic-inference` (FlashInfer, FlashAttention 3, Triton), its 50-trial test
  and `Unique samples: 1`. Sources: vllmBatchInvariance, sglangDeterministic (T1, tags v0.31.0
  and v0.5.21).
- DA33 CCCL `gpu_to_gpu`: ccclV310 (T1), ccclDeterminismBlog (T2), in an ExpandableSection.
- Replay checklist (DA7): closes the section, with the SGLang test repeated (the section's
  strongest figure: 50 trials, one unique sample, landed in the GPU block and again here).
- Code block: the four PyTorch/cuBLAS settings.

## Diagram

`DeterminismDiagram.tsx` rebuilt to the SVG contract: `role="img"`,
`aria-labelledby="determinism-paths-title"` with a `<title>` stating the assertion (no
`aria-label`), `viewBox` only (860 x 404), full-bleed white background, sans-serif text at 11
to 15 px, monospace runs for flags, class prefix `det-`, marker id `det-ah`. Wide-diagram phone
convention applied: `overflowX: auto` wrapper, `minWidth: 640`, `display: block`.

- Trainium column: fixed at compile time (instruction order and memory allocation; no warp
  scheduler, software-managed SRAM); you pin (archived NEFF, `NEURON_RT_STOCHASTIC_ROUNDING_SEED`,
  the bucket chosen per step from the live batch, SDK version and instance type).
- GPU column: fixed by the libraries (cuBLAS per toolkit, architecture, SM count; cuDNN on one
  architecture); you pin (`torch.use_deterministic_algorithms(True)`,
  `torch.backends.cudnn.benchmark = False`, `CUBLAS_WORKSPACE_CONFIG=:4096:8` for several
  streams, seeds). "cuBLAS deterministic mode", "cuDNN deterministic kernel selection", "CCCL
  3.1 collective determinism", "Avoid atomic-add reductions", "No cache contention" removed.
- Shared band: "In serving, on both: the batch decides", with the two engine flags and "a
  fixed bucket configuration" for Trainium.
- The only number drawn (`:4096:8`) is cited in the Libraries paragraph.

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-determinism): probe reports
"ok" at 1440 and 390 (no text overlap, no viewBox clipping, no page-level horizontal overflow).
PNGs read: at 1440 the columns and band are clear, no text crosses a line or arrow, longest
monospace line (`torch.use_deterministic_algorithms(True)`) sits well inside its box. At 390 the
diagram scrolls sideways at 640 px as intended; the regulatory table scrolls inside its
container (Cloudscape) and the inline code wraps without page overflow.

## Leverage pass

- Intro and "The batch decides": the reader's question is "will my served model repeat
  itself"; model: the batch, not the chip, decides; leverage: decide whether to turn on batch
  invariance or fix the batch shape. The diagram carries the model visually.
- Trainium block: model: the NEFF fixes order, three things around it decide replay; leverage:
  the two environment variables, the bucket configuration, archive rather than recompile.
  Bug-fix evidence demoted to an ExpandableSection that points at the verification step.
- GPU block: model: libraries repeat on one configuration, servers need batch invariance;
  leverage: the code block and the two engine flags. CCCL and throughput cost demoted.
- Isolation block: model: isolation and determinism are separate guarantees; leverage: choose
  a dedicated engine or a batch-invariant shared one.
- Regulatory map: leverage: which duty a replay set helps meet, and that none requires
  identical bits.
- Checklist: the reader's next action, last on the page.

Claim-set diff (assertions in the after that were not in the before):

| New assertion | Source |
| --- | --- |
| Determinism lets a team debug a model or serving stack, regression-test an upgrade, keep RL log-probabilities consistent | vllmBatchInvariance, sglangDeterministic |
| Batch size is the main cause of different answers at temperature 0; reductions split differently; FP addition not associative | sglangDeterministic |
| Trainium serving runtime picks a pre-compiled NEFF per step from the live batch; one decode NEFF per batch-size bucket; context-length buckets pick the smallest that covers the batch | vllmNeuronBucketing |
| Rely on the same answer only with batch-invariant kernels or a fixed batch shape | sglangDeterministic, vllmNeuronBucketing (the Trainium side is scoped by the UNKNOWN sentence) |
| NEFF fixes memory allocation and instruction order | nkiOverview |
| Intra-node collective latency depends on HBM load | intranodeCollectives |
| Stochastic rounding on by default with `XLA_USE_BF16=1`; `NEURON_RT_STOCHASTIC_ROUNDING_EN=0` selects RNE | neuronRoundingModes |
| Set `NEURON_RT_STOCHASTIC_ROUNDING_SEED` to a fixed value | neuronEnvVars |
| One batch-size bucket and no context-length buckets leave one decode NEFF | labelled "Our reading", derived from vllmNeuronBucketing |
| Neuron 2.27.0 `--auto-cast` default `none`, mixed-precision accumulation on | neuronCompilerNotes |
| Neuron 2.31.0 simplifier non-determinism fix; NKI Library Attention TKG fix | neuronCompilerNotes, nkiLibNotes |
| cuBLAS same bits per toolkit, architecture, SM count; multi-stream workspace; `:4096:8` about 24 MiB | cublasReproducibility |
| cuDNN most routines repeat; exceptions use atomics; none across architectures | cudnnReproducibility |
| PyTorch `use_deterministic_algorithms`, `cudnn.benchmark = False`, `manual_seed`; no guarantee across releases; deterministic ops often slower | pytorchReproducibility |
| vLLM flag, beta, compute capability 8.0+, custom all-reduce off, may cost performance, per-request seed | vllmBatchInvariance |
| SGLang flag, three backends, 50-trial test, `Unique samples: 1`, sampling seed, default disabled | sglangDeterministic |
| CCCL three levels; `gpu_to_gpu` via Reproducible Floating-point Accumulator; only such primitive located | ccclV310, ccclDeterminismBlog |
| Tenants sharing an engine share its batches, so traffic can change others' numbers | labelled "Our reading", from sglangDeterministic |
| SR 26-2 supersedes SR 11-7; scope; validation precedes first use | sr262Letter, sr262Guidance |
| RTS 6 Art. 5, 9, 28 and five-year retention | rts6 |
| SEC 17a-4(e)(8) 18 months, reproduce on request, record of changes or parameters | sec17a4 |
| DORA Art. 17 root causes | dora |
| None of these texts requires identical output bits | term search of the four fetched texts (scope: the four texts) |
| A MIG instance has its own share of the SMs | migConcepts |
| Verify on the same instance type; repeat after upgrades | register DA7 replacement text; derived from the version conditions above |

## For the orchestrator

- Glossary (`GlossaryAndSources.tsx`): replace `SR 11-7` with `SR 26-2` (Supervision and
  Regulation letter 26-2, "Revised Guidance on Model Risk Management", Federal Reserve, OCC and
  FDIC, April 2026; supersedes SR 11-7; generative and agentic AI out of scope). Remove `FINRA`,
  `CFTC` and `PRNG`: no section or component uses them any more (grep of src/sections and
  src/components). Add `RL` (reinforcement learning) and `TKG` (token generation, as in NKI
  "Attention TKG") if the glossary tracks them. `MIG`, `SM`, `NKI`, `SRAM`, `HBM`, `HFT`,
  `MiFID II`, `RTS 6`, `DORA`, `ICT`, `SEC`, `CCCL`, `NEFF` already exist.
- Research register `04-other-arch.md` [T1-40]: the PyTorch URL should be
  `docs/source/notes/randomness.md` at v2.14.1; the `.rst` path 404s at that tag.
- `sources.md` needs regenerating for the new records (the sources snapshot test will flag it).
- Capital Markets Lens already says "fix the batch shape or turn on batch-invariant serving
  ... on Trainium, also pin the NEFF and set a fixed rounding seed"; this section matches it.

## 2026-10-24 TorchNeuron update (stream trainium, orchestrator edit)

Evidence: v2.33.0 rounding-modes page (fetched 2026-10-24: the `XLA_USE_BF16` note sits beside `device='xla:1'` examples); TorchNeuron about, best-practices and env-vars pages at v2.33.0 searched for "stochastic" and "rounding" with no rounding default found; P7.

Claim-set diff:
- Scoped "PyTorch-Neuron turns stochastic rounding on when `XLA_USE_BF16=1`" to the XLA-based build.
- Added: the TorchNeuron pages read state no rounding default, so set `NEURON_RT_STOCHASTIC_ROUNDING_EN` explicitly (scoped silence claim); keep the experimental eager fusion (`TORCH_NEURONX_ENABLE_CONCATENATION=1`) off when runs must match, because fusion can change intermediate precision (P7, about page).
