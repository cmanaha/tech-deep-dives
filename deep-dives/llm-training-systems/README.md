# Training at Scale: How Large Language Models Are Trained, and How to Run It on AWS

Interactive single-page app about training large language models across many accelerators and
running that training on AWS. It gives the intuition and the arithmetic for each part of a run
(what one step computes and keeps, how parallelism splits it, what keeps a run alive through
failures), the open-source frameworks that implement it, the AWS paths that run it, and how to
measure a run. Written for a technical lead who knows systems, networking, GPUs and inference and
has not run large-scale distributed training. It builds on the EFA, silicon, vLLM, SGLang and RL
dives and links to them rather than repeating them.

**Status: built.** 32 sections in eight layers, sources read 2026-10-30 and 2026-10-31. Code is
cited at pinned tags or commits: PyTorch v2.15.0, TorchTitan v0.4.0, TorchTitan Neuron
release-2.33.0, Megatron-LM core_v0.20.0, Megatron Bridge v0.7.0, NeMo v2.7.3 and v3.0.0, NeMo
AutoModel v0.7.0, NeMo RL v0.7.0, DeepSpeed v0.19.9, Accelerate v1.15.0, transformers v5.22.1,
Transformer Engine v2.21.0, nccl-tests v2.21.1, DCGM v4.7.0, dcgm-exporter 4.8.4, Holistic Trace
Analysis v0.6.1, the Amazon S3 Connector for PyTorch v1.5.0, Mountpoint for Amazon S3 1.24.0, the
SageMaker HyperPod recipes 2.0.11 and CLI v3.13.0, the SageMaker Python SDK v3.28.0, AWS
ParallelCluster v3.16.2, JobSet v0.13.0, and Kueue, Kubeflow Trainer, the Neuron SDK documentation,
the AWS Deep Learning Containers and aws-samples at commit SHAs. arXiv links carry their version.
Prices are AWS Price List offers at pinned versions, us-east-1 unless a section says otherwise.

## The six questions

1. How much compute and time does a run need? (sections 3, 4 and 22)
2. Does the model fit, and how do I split it across accelerators? (sections 5 to 14, ending in
   section 14's sizing procedure, "set my ranks")
3. Which software implements the split? (sections 15, 16 and 27)
4. How do I keep a run alive? (sections 17 to 19)
5. Which AWS path do I run it on, and what does it cost? (sections 20 to 28)
6. How do I know the run is healthy? (sections 29 to 31)

## Key takeaways

Each figure is the owning section's, with its citation on the page.

- A step has two bills fixed by the model's shape: about 6 floating-point operations per parameter
  per token, and 16 bytes per parameter of model state before the first activation. Llama 3.1 8B's
  model state alone is 128.5 GB, 1.6 times one 80 GB H100 (section 3).
- Run time is 6ND over accelerators times dense peak times MFU (model FLOPs utilization). Llama 3.1
  70B on 15T tokens at an assumed 40% MFU on 2,048 H100 takes about 91 days: $30.7M at EC2
  On-Demand, $26.6M on Capacity Blocks (section 22, on section 4's formula).
- Placement follows bandwidth. On a p5.48xlarge the two links are nine times apart per GPU, so
  tensor parallelism stays inside the instance: for 70B at TP 8 each layer moves 0.94 GB per GPU per
  micro-batch, 2.1 ms on NVLink against 13.3 ms of compute (sections 7 and 9).
- Collectives that cross instances are priced per instance. Sharding on the fast link and deferring
  gradient sync together send about 12 times fewer bytes between instances for Llama 3.1 8B on four
  p5.48xlarge (section 8).
- Sizing is a procedure, not a guess: for 70B on four p5en.48xlarge, eight-way tensor parallelism
  with four data-parallel replicas fits at 85 GB per GPU with no pipeline and no recomputation
  (section 14).
- Failure is the steady state at scale. For 70B on 256 H100 the checkpoint interval is about 2
  hours between 60 s saves, or 21.5 minutes between asynchronous saves that block 2 s; stragglers
  wasted 10.4% of GPU-hours in ByteDance's trace of 3,079 large jobs (sections 17 to 19).
- On AWS the paths differ in who runs the cluster, and the bill shows it: SageMaker training jobs
  at 1.15 times EC2 On-Demand, HyperPod 20.0% over EC2, AWS PCS 1.2% (sections 24 and 26). On every
  path your script owns a save that finishes before a Capacity Block starts terminating instances
  30 minutes before its end (section 20).
- A hang becomes a crash with evidence: at PyTorch v2.15.0 defaults a stalled collective ends the
  job about 11 minutes later with every rank's last 2,000 collectives dumped (section 30).

## Calculators

Four calculators, each a tested module in `src/lib/` (168 tests in `src/__tests__/`, validated
against the worked numbers in the research registers; see `revamp/calculators-spec.md` and
`revamp/build-log.md`):

- **A, run time and accelerator-hours** (`runtime.ts`; section 4, cost panel in section 22).
- **B, the memory budget** (`memory.ts`; section 5, reused in sections 14 and 16).
- **C, parallelism sizing** (`parallelism.ts`; section 14), with cross-instance collectives priced
  per instance and the TP and CP traffic that full recomputation repeats counted.
- **D, checkpoint interval and storage** (`checkpoint.ts`; section 18).

Section 10 adds an interactive pipeline schedule chart (GPipe, 1F1B, interleaved).

## Our own experiments (Tier 0)

Four experiments ran on one DGX Spark (one NVIDIA GB10) on 2026-10-31 with PyTorch 2.15.0. Logs,
scripts and raw results are in `research/2026-10/` (`E1` to `E4`, `spark-scripts/`, `spark-raw/`).

- **E1**, activation memory per Llama 3.1 8B layer: the formula held to within 0.1%, 34 bytes per
  s x b x h with a fused SwiGLU, 41 with an eager, uncompiled SwiGLU, 2 under full
  recomputation.
- **E2**, step time and recomputation: full recomputation cost 14% to 16% more step time, selective
  8% to 11%; MFU 28% to 29% against a measured 96 to 97 TFLOPS GEMM ceiling.
- **E3**, FSDP2 collectives under gradient accumulation: 36 all-gathers and 20 reduce-scatters per
  step at defaults, 21 and 5 with both deferral settings.
- **E4**, checkpoint staging: a bare `async_save` blocked training for 8.8 to 36 s, longer than
  `dcp.save`; with a pinned-memory stager it returned in about a millisecond.

The AWS experiments A0 to A5 are on hold until an AWS account is set up for them. No distributed
experiment ran. Each section that depends on one keeps its hedge and shows the protocol marked "not
yet run" (`RESEARCH-GUIDE.md` section 5).

## Section map

32 sections in the left navigation.

- Framing (1-2): A Training Run Is Three Budgets; Getting Started.
- One step (3-6): what a step computes and keeps; counting the arithmetic (6ND, MFU, run time); the
  memory budget; precision (BF16, FP8, microscaled formats).
- Parallelism (7-14): collectives and what they cost; data parallelism and sharding (DDP, ZeRO,
  FSDP, HSDP); tensor and sequence parallelism; pipeline parallelism and the bubble; context
  parallelism; expert parallelism; composing the dimensions; set my ranks.
- Software (15-16): the framework map; fine-tuning and post-training runs.
- Reliability (17-19): failure is the steady state; checkpointing; resuming correctly.
- AWS (20-28): who owns what on AWS; training hardware; capacity and cost; storage; the Slurm
  family; the Kubernetes family; SageMaker training jobs; Trainium and the Neuron path; choosing
  your path.
- Operating a run (29-31): what to measure; the telemetry stack on AWS; bring-up from one node to
  the full run.
- Reference (32): glossary and sources, with the Tier 0 results and the key reading list.

## Running it

```bash
pnpm install
pnpm --filter @tech-deep-dives/llm-training-systems dev
pnpm --filter @tech-deep-dives/llm-training-systems test
```

`bash scripts/ci.sh` at the repo root runs the deterministic gates (typecheck, lint, tests, build,
html-validate). `node revamp/tools/gen-sources.mjs` regenerates `sources.md` from the inline
citations; `--check` fails if it is stale. `node revamp/tools/shoot.mjs` renders sections at 1440
and 390 px and reports text overlap, clipping and overflow.

## Files

| Path | What it holds |
|---|---|
| `src/` | The app: `App.tsx`, one lazily loaded file per section in `src/sections/`, the `Cite` component and tables in `src/components/`, calculators in `src/lib/` with tests in `src/__tests__/` |
| `SCOPE.md` | Title, thesis, the 32-section plan with a payoff line per section, the calculators, key sources, connections to other dives, adversarial review notes |
| `RESEARCH-GUIDE.md` | Research waves, evidence bar, Tier 0 experiments and the AWS protocols A0 to A5, the UNKNOWN register and its triage, the Gate 1 record, budget record |
| `research/2026-10/` | Wave 1 claim registers (`01` to `07`), wave 2 refutation and gap-fill notes (`wave2-*`), Tier 0 logs `E1` to `E4` with scripts and raw output |
| `revamp/` | Build working files: the authoring brief, calculator spec, build log with per-section rows and cross-section conditions, per-section claim lists in `claims/`, fact-check prompts, tools |
| `reviews/` | Adversarial reviews of the scope; fact-check and leverage reports from the verify phase |
| `sources.md` | Every citation in the app, grouped by tier, with access dates and the sections that cite it (generated) |

## Sources

See `sources.md`. Tiers: Tier 0, our experiments; Tier 1, code at a pinned ref, framework
documentation, first-party AWS documentation and price files, and NVIDIA specification pages
(vendor figures); Tier 2, first-party lab and vendor posts and samples (their figures stay claims);
Tier 3, papers marked with their venue or as a preprint. Tier 4 sources are never cited.
