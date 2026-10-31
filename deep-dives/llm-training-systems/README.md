# LLM Training Systems

**Status: scoped, not built.** Research wave 1, the scope, the research guide and three adversarial reviews of the scope are done; there is no app yet (no `package.json`, no `src/`). The build waits on Gate 1 in `RESEARCH-GUIDE.md` section 7.

## Topic

How large language models are trained across many accelerators, and how to run that training on AWS. The dive gives the intuition and the key arithmetic for each part of a training run (what one step computes and keeps, how parallelism splits it, what keeps a run alive through failures), the open-source frameworks that implement it, the AWS paths that run it (self-managed EC2 and EKS, SageMaker AI training jobs, SageMaker HyperPod with Slurm or EKS, AWS Parallel Computing Service, AWS Batch on EKS, and Trainium), and how to measure a run. Written for a technical lead who knows systems, networking, GPUs and inference and has not run large-scale distributed training. It builds on the EFA, silicon, vLLM, SGLang and RL dives and links to them rather than repeating them.

The dive answers six questions: how much compute and time a run needs; whether a model fits and how to split it across accelerators ("help me set my ranks"); which software implements the split; how to keep a run alive; which AWS path to run it on and what it costs; and how to know the run is healthy.

## What the research found so far

Each point carries the claim-register IDs behind it (files in `research/2026-10/`). Every source was accessed 2026-10-30; every price is us-east-1 on that date.

- The 6ND rule holds against the largest published run. For Llama 3 405B, 6 x 405B parameters x 15.6T tokens is 3.8e25 FLOPs, Meta's stated budget, and at the run's measured throughput it accounts for 80% to 90% of the 30.84M H100-hours on the model card (T01-5 to T01-7; 01 W7).
- Mixed-precision Adam holds 16 bytes per parameter before any activation, so Llama 3.1 8B's model state alone is about 128.5 GB, 1.6 times one 80 GB H100 (T01-9; 01 W2).
- Placement follows bandwidth. On a p5.48xlarge, NVLink gives each GPU about 450 GB/s per direction and EFA about 50 GB/s, a ratio of 9 [derived from T02-68 and T02-70], which is why tensor parallelism stays inside the instance. For Llama 3.1 70B on 256 H100 at 8K tokens, two published layouts pass the procedure: TP 8 x PP 4 x DP 8 with a pipeline bubble near 1%, and TP 8 x FSDP 32 (T02-50; 02 section 3.2).
- Three defaults change a reader's numbers, each read in code: FSDP2 communicates on every gradient-accumulation micro-batch unless told to defer (T03-2, T03-3); PyTorch's `async_save` called without a stager stages synchronously into pageable memory (T04-21); Megatron's `--async-save` is silently off for distributed checkpoints unless `--use-persistent-ckpt-worker` is also set (T04-38).
- Failure is the steady state at scale. Llama 3 405B saw 419 unexpected interruptions in 54 days, one every 3.1 hours (T04-1, T04-4), and Meta's cluster study measured job mean time to failure falling inversely with job size (T04-7).
- AWS paths differ in who owns the cluster, and the bill shows it: SageMaker training jobs run at 1.15 times the EC2 rate, HyperPod at 1.20 times on P5 and P6, and training plans at 1.15 times the Capacity Block rate (T05-22 to T05-24); AWS PCS adds a controller fee and a per-instance fee for P and Trn instances (T06-36). AWS ParallelCluster is still maintained, and its user guide now recommends AWS PCS (T06-38).
- Hangs become crashes with evidence by default: at PyTorch v2.15.0 a stuck NCCL collective times out after 10 minutes and every rank dumps a flight-recorder trace of its last 2,000 collectives (T07-5 to T07-11). On AWS most training telemetry is opt-in, including the HyperPod observability add-on's training metrics (T07-31).

## Files

| Path | What it holds |
|---|---|
| `SCOPE.md` | Title, thesis, the 32-section plan in eight layers with a depth tag, payoff line and paragraph per section, the four calculators, depth distribution, key sources, connections to other dives, adversarial review notes |
| `RESEARCH-GUIDE.md` | Where the research stands, research waves 2 to 4, the reading path, the evidence bar per claim type, Tier 0 experiments (DGX Spark and small AWS runs with costs and teardown), the UNKNOWN register with proposed triage, Gate 1 checks and record, budget record |
| `research/2026-10/wave1-brief.md` | The shared method and register format the wave 1 agents followed |
| `research/2026-10/00-orchestrator-notes.md` | Facts fetched during synthesis (FSx for Lustre storage rates) |
| `research/2026-10/01-training-step-maths.md` | Claim register: the step, 6ND, MFU and dense peaks, the memory budget, precision from FP16 to NVFP4, recomputation, batch size |
| `research/2026-10/02-parallelism.md` | Claim register: data, ZeRO, FSDP, tensor, sequence, context, pipeline and expert parallelism, collective costs, the sizing procedure with worked examples |
| `research/2026-10/03-frameworks.md` | Claim register: PyTorch distributed, TorchTitan, TorchTitan Neuron, Megatron Core and Bridge, NeMo, DeepSpeed, Accelerate, fine-tuning and post-training as systems |
| `research/2026-10/04-reliability-checkpointing-data.md` | Claim register: failure statistics, MTTF and goodput, checkpointing in code, restart, stragglers, determinism, data loading |
| `research/2026-10/05-aws-infrastructure.md` | Claim register: training instances, capacity paths, dated rates, placement, storage, images |
| `research/2026-10/06-aws-orchestration.md` | Claim register: self-managed EC2 and EKS, SageMaker training jobs, HyperPod, PCS, Batch, the ownership matrix and fees |
| `research/2026-10/07-observability.md` | Claim register: what to measure, hang detection, DCGM and the Xid catalog, loss-spike handling, the AWS telemetry layer |
| `reviews/2026-10/` | The three adversarial reviews of the scope |
| `sources.md` | Every source used, grouped by tier, with access dates |

## Sources

See `sources.md`. Sources are tiered: Tier 0 our experiments (none run yet), Tier 1 pinned code, first-party documentation, specifications and pricing, Tier 2 first-party lab and vendor posts, Tier 3 papers (peer-reviewed or preprint marked) and third-party analysis, Tier 4 used only to locate sources.
