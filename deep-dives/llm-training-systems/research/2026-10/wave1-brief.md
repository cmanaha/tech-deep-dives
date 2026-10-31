# Wave 1 brief: primary-source claim registers (shared by all research agents)

Date of this pass and accessed date for every source you fetch: **2026-10-30**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training`. Dive:
`deep-dives/llm-training-systems/` (new, scoped only, no app yet). You own exactly one output file,
named in your task, under `deep-dives/llm-training-systems/research/2026-10/`. Edit nothing else:
not this brief, not another agent's file, nothing in other dives. Run no git command that changes
state (no commit, add, stash, checkout, reset); the orchestrator commits. Run no experiment on any
machine and do not ssh anywhere.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address (SEC EDGAR, some APIs), use a
Wayback copy or skip the source. Do not start subagents.

## The dive these registers feed

A deep dive on how large language models are trained across many accelerators, and how to run that
training on AWS. One coherent dive blending: (1) theoretical intuition, the mental model and key
maths for each concept, enough to give "why it works"; (2) AWS self-managed training on EC2 and EKS;
(3) AWS managed: SageMaker AI training jobs and HyperPod (Slurm and EKS flavours), AWS Parallel
Computing Service (PCS), AWS Batch on EKS; (4) best practices across all paths; (5) observability
and telemetry for training runs; (6) the notable open-source training frameworks. It must answer
operational questions such as "help me set my ranks and parallelization for this model, cluster and
memory budget".

Reader: a technical lead (ex-EC2/Compute Tech Lead, now WW SA Lead for Startups at AWS), strong on
systems, networking, GPUs, inference and agents, who has not run large-scale distributed training.
The registers feed `SCOPE.md`, where every maths section carries worked numbers on a real model and
a real instance, and two calculators are planned (memory budget; parallelism sizing).

## Already covered elsewhere in this repo: link, do not re-research

Read the section headers named here only if your area touches them, and record a `Link:` line in
the entry that relies on them.

- `deep-dives/efa/src/sections/`: `AIMLTraining.tsx` (one row per parallelism strategy and what it
  puts on the wire; Trainium multi-node instances), `NcclOverEfa.tsx` (the aws-ofi-nccl plugin, which
  NCCL/libfabric variables to set and drop), `TopologyApi.tsx` (EC2 instance topology API, rank
  ordering, Slurm topology plugins), `InstanceSupport.tsx` (EFA bandwidth per instance),
  `SageMaker.tsx` and `EKSIntegration.tsx` (how EFA is enabled on SageMaker and EKS),
  `StorageDataPaths.tsx` (FSx for Lustre on EFA up to 700 Gbps, the S3 CRT client ceiling),
  `Pricing.tsx` (instance rates via a Price List version, Capacity Blocks pricing), `Operations.tsx`
  (EFA health checks and the five hardware counters).
- `deep-dives/silicon-memory-inference/src/sections/`: HBM and bandwidth, roofline, precision formats
  for inference (`QuantizationAndPrecision.tsx`), MoE sparsity (`MoeAndSparseActivation.tsx`),
  NVLink/EFA/Trainium collectives (`CommunicationAndScaleOut.tsx`), Trainium chips
  (`AwsCustomSilicon.tsx`), Neuron compiler, TorchNeuron and Neuron profiling
  (`AwsCompilersAndTooling.tsx`, Neuron 2.33), GB200 NVL72 (`GraceBlackwellUltraServer.tsx`).
- `deep-dives/vllm/`, `deep-dives/sglang/`: inference engines, rollout serving, weight sync.
- `deep-dives/rl-agentic-loops/`: RL algorithms and the RL step as a system (section 19,
  `RlStepAsSystem.tsx`; register `research/2026-10/05-rl-systems.md` has verl, OpenRLHF, TRL, slime,
  prime-rl at pinned tags) and RL on AWS (`RlOnAws.tsx`, register `06-aws-paths.md`). This dive covers
  the systems side of fine-tuning and RL runs and links there for algorithms.
- An unbuilt caching dive owns KV-cache spill to storage tiers; this dive owns training checkpoints
  and training data loading.

## Inputs to read first

1. `CLAUDE.md` at the repo root: "Fact-Checking & Sources Standard" and the tier ladder.
2. `deep-dives/efa/revamp/source-authority-standard.md` (code over docs over blogs; doc-code
   contradictions are findings).
3. The register model: `deep-dives/rl-agentic-loops/research/2026-10/05-rl-systems.md`. Read its
   section 1 (header, tiers, pinned-source tables) and the first three entries of section 2, and note
   its section headings 3 to 8. Copy that shape.

## Method

- **Primary sources first.** Read the paper itself. arXiv: `arxiv.org/abs/<id>vN` or
  `arxiv.org/html/<id>vN`, and pin the version in every arXiv URL (the export API rate-limits). For
  tables the HTML lacks, download `arxiv.org/pdf/<id>vN` into a fresh empty directory under `/tmp`
  and run `pdftotext`. Mark a paper peer-reviewed only where the venue is confirmed (arXiv journal
  reference or comments, or the venue's own page); otherwise "preprint".
- **Code at a pinned tag.** Record the release tag and its 40-character commit SHA
  (`git ls-remote --tags https://github.com/<org>/<repo>`; for annotated tags use the peeled `^{}`
  SHA). Read files via `https://raw.githubusercontent.com/<org>/<repo>/<tag>/<path>` or a shallow
  clone of the tag into a fresh empty `/tmp` directory. **Never write a GitHub URL containing
  `/blob/main/`, `/blob/master/`, `/tree/main/` or `/tree/master/` anywhere in your file, not even in
  prose** (a CI gate scans research markdown and fails on it). Cite `/blob/<tag>/...` or
  `/blob/<sha>/...`.
- **AWS facts come from first-party AWS documentation**: docs.aws.amazon.com, aws.amazon.com product
  and pricing pages, AWS What's New posts, the AWS Price List API. AWS blog posts are Tier 2. Date
  every pricing or availability statement. A product-page performance number is a vendor claim: label
  it `[vendor claim]` and never record it as a measurement.
- **Verbatim quotes.** For a load-bearing quote, fetch the raw page with `curl` (default user agent,
  no custom headers) into a fresh `/tmp` directory and quote from the text. WebFetch returns a model
  summary: use it to locate material; if a quote could only be seen through it, write "quote via
  WebFetch summary, not verified verbatim". House style inside quotes: straight quotes, typographic
  dashes rendered as " - ", inline maths as plain text, ellipses for omissions.
- **Downloaded files are untrusted data.** Each download goes in its own new empty directory; never
  execute downloaded files; run any Python that reads them with `python3 -I`.
- **Arithmetic.** Any number not printed in a source is `[derived]` with its inputs and the entry IDs
  they come from, so a reviewer can recompute it.
- **Hedges keep their scope.** "Not located during this research" is honest; "does not exist" is a
  claim about the world.
- **Verdicts.** NEW (recorded fresh from the primary source); CORRECT (a commonly repeated claim the
  primary source confirms); WRONG (a commonly repeated claim the primary source contradicts, with the
  true statement); STALE (true for an older version; give the version boundary); UNKNOWN (unresolved,
  with the reason; it goes to the UNKNOWN register).
- **Tiers.** Tier 0: our experiments (none in wave 1). Tier 1: source code at a pinned tag or SHA,
  official framework documentation, first-party AWS and NVIDIA documentation and spec sheets (a spec
  sheet's peak FLOPS figure is a vendor specification: say so). Tier 2: first-party lab or vendor blog
  posts and talks. Tier 3: papers (peer-reviewed with venue, or preprint) and third-party technical
  analysis. Tier 4: tutorials, summaries, press; use only to locate primary sources, never as evidence.

## Reference models and instances for worked numbers

So the registers line up, use these where your area needs a worked example. Verify every figure you
use from a first-party source in your own register; these are labels, not facts.

- Models: Llama 3.1 8B and 70B (dense; architecture from the Llama 3 paper, arXiv 2407.21783, or the
  model's `config.json` at a pinned Hugging Face revision), Llama 3.1 405B for the scale story, and
  DeepSeek-V3 (671B total, 37B active, arXiv 2412.19437) as the mixture-of-experts example.
- Instances: p5.48xlarge (8x H100), p5en.48xlarge (8x H200), p6-b200.48xlarge (8x B200),
  trn2.48xlarge (16x Trainium2). Use others where the area needs them.

## Output file format

Write the header and pinned-source tables within your first few fetches, then append entries in
batches of five to ten. The session can stop at any moment and everything not on disk is lost.

```markdown
# NN <area title>: research register

## 1. Header
- Research date, area, out of scope (with the Link targets above), reader, quote policy, verdicts,
  arithmetic rule.
- Tiers table. Evidence kinds (definition, formula, documentation of support, default value,
  benchmark claim (author or vendor reported), ablation, production report, code behaviour, pricing).
- Pinned sources: papers (arXiv ID with version, title, venue or preprint, entries); code
  (repository, tag, 40-char SHA, files read, entries); documentation URLs (entries).

## 2. Claim register
Grouped A, B, C... by subtopic. Each entry:

**TNN-k. One-sentence claim.**
- Location: section, table, equation, file and line.
- Verdict: NEW | CORRECT | WRONG | STALE | UNKNOWN
- Evidence: <pinned URL> | Tier N, <peer-reviewed (venue) | preprint | first-party doc | code> |
  <evidence kind> | "<verbatim quote>" (accessed 2026-10-30)
- Use in dive: the section or calculator it feeds, and whether it builds a mental model or is
  practical to know.
- Link: (optional) existing dive and section that owns the fact.

## 3. Worked numbers
Step-by-step arithmetic on the reference models and instances, every input cited by entry ID, every
output labelled [derived]. Required for areas 01 and 02; elsewhere where it helps.

## 4. Mental models worth teaching
Each one sentence or two, with the entries it rests on.

## 5. Contradictions
Doc versus code, paper versus paper, version drift. Both sides cited; code is the authority.

## 6. UNKNOWN register
UNN-k: the question, what was tried, and what would close it (a wave 2 fetch, a Tier 0 experiment
on a DGX Spark, a small AWS experiment, or accept as a hedge with the hedge text).

## 7. Reading path for a newcomer
Ordered list of primary sources, and why each comes at that point.

## 8. Source list by tier
```

## Budget and return

At most about 80 fetches. Aim for 45 to 90 entries: fewer load-bearing entries with verbatim quotes
beat many thin ones. When done, return to the orchestrator at most 200 words: entry count; the three
to five findings most likely to shape the dive, with entry IDs; WRONG and STALE items in one line
each; the UNKNOWN count; any question about your area's boundary.

---

## Area specifications

### 01 The training step and its maths -> `01-training-step-maths.md` (IDs T01-k)

1. What one step computes and what state persists between steps: forward, backward, optimizer
   update; weights, gradients, optimizer states, activations. AdamW state; FP32 master weights in
   mixed precision; the 16 bytes per parameter figure for mixed-precision Adam (ZeRO, 1910.02054).
2. FLOPs per token: the 6N rule and its derivation (Kaplan et al. 2001.08361), the attention term,
   the Chinchilla accounting (2203.15556), the Megatron-LM formula (2104.04473) with recomputation,
   PaLM's MFU and HFU definitions (2204.02311). Where 6ND breaks: long context, MoE (active
   parameters), recomputation, embeddings. Give the sequence length at which attention FLOPs reach
   a stated share for Llama 3.1 8B and 70B [derived].
3. MFU: definition, published values with their conditions (PaLM, Llama 3 in 2407.21783, MegaScale
   2402.15627, DeepSeek-V3 if stated), the peak FLOPS to divide by (NVIDIA H100, H200, B200 spec
   sheets as vendor specifications; Trainium2 from AWS or Neuron docs), dense versus sparse peaks.
4. The memory budget with worked numbers for Llama 3.1 8B and 70B: weights, gradients, optimizer
   states, activations (the per-layer activation formula of 2205.05198, with and without sequence
   parallelism and selective recomputation), temporary buffers and fragmentation.
5. Mixed precision: FP16 with loss scaling (1710.03740), BF16, FP8 formats E4M3 and E5M2
   (2209.05433) and their scaling recipes (NVIDIA Transformer Engine docs at a pinned version),
   DeepSeek-V3's fine-grained FP8 training and its stated accuracy cost, MXFP8 (OCP Microscaling
   spec v1.0, 2310.10537), NVFP4 pretraining (NVIDIA's paper, find the arXiv ID). Which formats each
   reference accelerator runs in its matrix units for training. Link the silicon dive for inference
   formats.
6. Activation checkpointing: full (Chen et al. 1604.06174) and selective (2205.05198), the memory
   saved and compute added.
7. Gradient accumulation and global batch: global batch = micro-batch x accumulation steps x data
   parallel size; the critical batch size idea (McCandlish et al. 1812.06162) and why it bounds data
   parallel size; Llama 3's batch schedule.
8. Scaling-law intuition only as far as it drives hardware: Chinchilla's tokens per parameter,
   compute budget to accelerator-hours (training time = 6ND / (accelerators x peak x MFU)) with a
   worked example checked against a published run (Llama 3 405B: FLOPs, GPU count, GPU-hours from the
   paper or the model card), and over-training past Chinchilla for cheaper inference.
9. Optimizer choices that change the memory budget (8-bit optimizers 2110.02861, Adafactor, and any
   newer optimizer only with a primary source stating its memory).

### 02 Parallelism and the "set my ranks" procedure -> `02-parallelism.md` (IDs T02-k)

1. Data parallelism: DDP gradient all-reduce, bucketing and overlap (PyTorch DDP paper 2006.15704);
   bytes per step for a ring all-reduce.
2. ZeRO stages 1 to 3 (1910.02054): memory per GPU and communication volume per stage; PyTorch FSDP
   (2304.11277) and hybrid sharding (HSDP); ZeRO++ (2306.10209) for slower inter-node links.
3. Tensor parallelism (Megatron-LM 1909.08053): column and row splits, the all-reduces per layer in
   forward and backward, bytes per layer, why it stays inside the NVLink domain. Sequence parallelism
   (2205.05198): reduce-scatter plus all-gather in place of all-reduce, and the activation memory it
   saves.
4. Context parallelism: Ring Attention (2310.01889), DeepSpeed-Ulysses (2309.14509) and its head-count
   limit, Megatron-Core context parallelism, Llama 3's all-gather variant (2407.21783).
5. Pipeline parallelism: GPipe (1811.06965) bubble fraction, 1F1B (PipeDream-Flush, 2006.09503) and
   its memory, interleaved 1F1B (2104.04473), Zero Bubble (2401.10241), DualPipe (2412.19437), Llama 3's
   pipeline changes. Give the bubble formulas and a worked bubble for a real configuration.
6. Expert parallelism: GShard (2006.16668), Switch Transformer (2101.03961) capacity factor,
   all-to-all dispatch and combine bytes per layer, DeepSeek-V3's node-limited routing and its
   parallel layout, Megatron-Core MoE parallel folding (find the arXiv ID).
7. Combining them: the PTD-P takeaways of 2104.04473 (where TP, PP and DP go and in what order), Llama
   3's 4D order and its published configurations (2407.21783), TorchTitan's composition (2410.06511),
   DeepSeek-V3's layout (no TP, PP 16, EP 64, ZeRO-1 DP).
8. The "set my ranks" decision procedure: inputs (parameters, layers, heads, hidden size, sequence
   length, global batch, accelerators per node, HBM per accelerator, intra- and inter-node
   bandwidth), constraints (divisibility, TP inside the node, micro-batches against PP, the product of
   degrees equals world size), the memory check per rank, the communication check. Find every
   published procedure or tool (Megatron-LM paper, NeMo's auto-configurator docs, DeepSpeed
   autotuning, TorchTitan guidance, Hugging Face's Ultra-Scale Playbook as Tier 3, any academic
   performance model) and record what each prescribes. Then work two examples end to end: Llama 3.1
   70B on 32 p5.48xlarge (256 H100) at 8K sequence length, and Llama 3.1 8B on one and on four
   p5.48xlarge. Mark the procedure itself [our reading] where no single source states it.
9. Communication cost per collective: NCCL algorithm bandwidth versus bus bandwidth (nccl-tests
   `doc/PERFORMANCE.md` at a pinned tag), ring versus tree, which link each parallelism uses (NVLink
   in the node, EFA between nodes; link the EFA dive for the fabric). Trainium equivalents only as far
   as the Neuron docs state parallelism support (link the silicon dive).

### 03 Training frameworks at pinned tags -> `03-frameworks.md` (IDs T03-k)

For each framework: release tag and SHA; the parallelism it implements (DP, FSDP or ZeRO stage, TP,
SP, CP, PP and which schedules, EP); how a run is configured (config file, CLI flags, the example to
start from); precision support (BF16, FP8 via Transformer Engine, MXFP8); checkpoint format and
resharding; launcher (torchrun, Slurm, Kubernetes); maturity signals the project itself states
(experimental labels, release cadence, deprecations); AWS integration (HyperPod recipes, Deep
Learning Containers, Neuron).

1. PyTorch distributed at a pinned release: DeviceMesh, DTensor, FSDP2 (`fully_shard`), tensor
   parallel APIs, `torch.distributed.pipelining` and its schedules, context parallel, Distributed
   Checkpoint (DCP) with async save, torch.compile interplay.
2. TorchTitan (paper 2410.06511 and repo tag): 4D composition, Float8 and MXFP8, its config format,
   and the Trainium port (TorchTitan on TorchNeuron; link the silicon dive's Neuron 2.33 material).
3. Megatron-LM and Megatron-Core (tag): parallel state, distributed optimizer, MoE, distributed
   checkpointing, Megatron Bridge.
4. DeepSpeed (tag): ZeRO stages and offload (ZeRO-Infinity), Ulysses, pipeline engine, universal
   checkpointing.
5. NVIDIA NeMo Framework: its current state as of 2026-10 (what moved to Megatron Bridge and NeMo
   AutoModel, what remains), with dates.
6. AWS Neuron training: NxD Training (neuronx-distributed-training) and its status next to TorchNeuron
   and TorchTitan on Trainium in the current Neuron release; which parallelism each supports on Trn2.
7. Hugging Face Accelerate and the transformers Trainer as the on-ramp; Nanotron or others only if a
   primary source shows they matter at scale.
8. Fine-tuning and post-training frameworks as systems only (TRL, verl, OpenRLHF, NeMo RL, Axolotl,
   LLaMA-Factory, torchtune's current status): which distributed backend each reuses, LoRA's effect on
   the memory budget. Link the RL dive's register 05 for verl, OpenRLHF, TRL, slime, prime-rl rather
   than re-reading them.
9. A comparison table: framework, parallelism, precision, checkpoint, config style, best fit.

### 04 Reliability at scale, checkpoints and data -> `04-reliability-checkpointing-data.md` (IDs T04-k)

1. Failure rates and causes from first-party reports: Llama 3 (2407.21783, the interruption table),
   OPT-175B's logbook (metaseq repository at a SHA), MegaScale (2402.15627), Meta's reliability study
   of its research clusters (find the arXiv ID, 2024), and any AWS first-party statement (label vendor
   claims). Mean time between failures as a function of job size.
2. Goodput and effective training time; the optimal checkpoint interval (Young 1974, Daly 2006) with a
   worked example for a 70B run on 256 GPUs [derived].
3. Checkpoints: what one holds (weights, optimizer state, RNG, data-loader position, scheduler),
   bytes for Llama 3.1 8B and 70B [derived], sharded checkpoints (PyTorch DCP, Megatron distributed
   checkpointing), asynchronous checkpointing (DCP async save at a pinned PyTorch release), in-memory
   and multi-tier designs (Gemini, SOSP 2023; ByteCheckpoint, find the arXiv ID), the write bandwidth a
   target save time needs [derived].
4. Checkpoints on AWS: FSx for Lustre (link the EFA dive for the 700 Gbps EFA path), S3 through the
   Amazon S3 Connector for PyTorch (s3torchconnector at a tag, its DCP support), S3 Express One Zone,
   Mountpoint for Amazon S3, SageMaker HyperPod managed tiered checkpointing and any HyperPod
   checkpointless or elastic training feature (first-party docs, with launch dates).
5. Restart and elastic training: torchrun elastic agent, TorchFT (repo tag), HyperPod auto-resume
   (link area 06 for the service mechanics; here the training-side contract), Slurm requeue.
6. Deterministic resumption: RNG states, data order, stateful data loaders (torchdata
   `StatefulDataLoader`), Megatron's sample index; what PyTorch's determinism docs say about bitwise
   reproducibility and NCCL.
7. Stragglers: definition, measured impact and detection (MegaScale, any ByteDance or Alibaba
   straggler study with arXiv ID), how a slow node is found and replaced.
8. Data loading: tokenised pre-shuffled shards, memory-mapped indexed datasets (Megatron), streaming
   from S3 (Mosaic Streaming, WebDataset, s3torchconnector), and the arithmetic of how many bytes per
   second a text LLM run actually needs per GPU [derived], so the reader knows when storage is or is
   not the bottleneck.

### 05 AWS infrastructure: instances, network, capacity, storage -> `05-aws-infrastructure.md` (IDs T05-k)

1. EC2 accelerated instances for training, from the EC2 instance type specification pages and
   product pages: P4d/P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200 and P6e-GB300 UltraServers,
   Trn1/Trn1n, Trn2 and Trn2 UltraServers, Trn3 if launched. For each: accelerator count and model,
   accelerator memory, intra-node interconnect bandwidth, EFA bandwidth and network card count, local
   NVMe, vCPU and memory. Per-accelerator dense BF16 and FP8 peak (vendor specifications) so the
   memory and parallelism calculators have their inputs. Link the EFA dive for EFA itself.
2. Placement: cluster placement groups, what AWS documents about UltraClusters and UltraServers
   (label vendor claims), the instance topology API (link the EFA dive).
3. Capacity: Capacity Blocks for ML (durations, supported instance types, cluster sizes, start times,
   how to buy, how pricing works, dated), On-Demand Capacity Reservations, SageMaker training plans
   (flexible training plans for HyperPod and training jobs), Spot for training and its limits, quotas.
4. Pricing, dated 2026-10-30: On-Demand rates for the reference instances in us-east-1 from the AWS
   Price List API (record the offer version), Capacity Block rates; the SageMaker ML instance rates
   for the same accelerators. Link the EFA dive's Pricing section for method.
5. Storage for training: FSx for Lustre (deployment types, throughput tiers, EFA-enabled file
   systems and GPUDirect Storage, data repository associations with S3 and lazy loading), Amazon S3
   and S3 Express One Zone (documented throughput and latency), Mountpoint for Amazon S3, local NVMe
   instance store sizes. Link the EFA dive for the FSx-on-EFA mechanism.
6. Images: Deep Learning AMIs (GPU and Neuron) and Deep Learning Containers for PyTorch training,
   what they install (EFA installer, NCCL, aws-ofi-nccl versions), the EKS-optimized accelerated AMIs.
7. Trainium for training: Trn2 chip and instance figures (cores, HBM, bandwidth, BF16 and FP8 peak,
   NeuronLink, EFA), the Trn2 UltraServer, Trn3 status; link the silicon dive and record only the
   training-relevant figures.

### 06 AWS orchestration paths -> `06-aws-orchestration.md` (IDs T06-k)

1. Self-managed on EC2: plain EC2 with torchrun or Slurm; AWS ParallelCluster (record what AWS
   documents and decide whether it belongs in the dive next to PCS; say why); Deep Learning AMIs.
2. Self-managed on EKS: the EKS user guide and EKS best-practices guide for AI/ML training (EFA,
   NVIDIA and Neuron device plugins, accelerated AMIs, Capacity Blocks with managed node groups or
   Karpenter), Kubeflow Trainer or Training Operator (repo tag), MPI Operator, gang scheduling (Kueue,
   Volcano), the aws-samples `awsome-distributed-training` repository at a SHA (Tier 1 code, AWS
   samples).
3. SageMaker AI training jobs: distributed training configuration, SageMaker model parallelism
   library v2 (built on FSDP: hybrid sharding, tensor parallelism, activation offload, FP8) and the
   SageMaker distributed data parallelism library, each with its current support status; warm pools,
   managed Spot with checkpoints, heterogeneous clusters, the current SageMaker Python SDK.
4. SageMaker HyperPod, both orchestrators: cluster creation and lifecycle scripts, resiliency (health
   monitoring agent, deep health checks, automatic node recovery and replacement, Slurm auto-resume,
   the HyperPod training operator on EKS with its hang detection), task governance, HyperPod recipes
   (`aws/sagemaker-hyperpod-recipes` at a tag: which models, which frameworks underneath, Trainium
   recipes), training plans, the HyperPod CLI, any elastic or checkpointless training feature, and the
   pricing model (dated).
5. AWS Parallel Computing Service (PCS): what it manages, supported Slurm versions, compute node
   groups, EFA and accelerated instance support, Capacity Blocks, what the user still owns (AMI with
   the Slurm agent), pricing (dated), and when it fits against HyperPod Slurm.
6. AWS Batch on EKS and AWS Batch for ML training: multi-node parallel jobs on EKS, GPU scheduling,
   fair-share, the Batch queue for SageMaker training jobs if documented; where Batch fits.
7. A comparison matrix: who owns the scheduler, node health checks, job restart, capacity, images and
   the fabric setup on each path; costs beyond the instance (EKS control plane, PCS controller,
   HyperPod), with dates.
8. Trainium on each path (HyperPod, EKS with the Neuron device plugin, PCS, training jobs).

### 07 Observability and operations -> `07-observability.md` (IDs T07-k)

1. What to measure in a training run: throughput (tokens per second per accelerator), MFU (link area
   01), step-time breakdown (compute, exposed communication, data loading, optimizer, checkpoint
   stalls), communication and its overlap with compute, memory (peak allocated, reserved,
   fragmentation), loss and gradient health (loss spikes, gradient norm, NaN or Inf, with first-party
   reports of spikes and how they were handled: PaLM 2204.02311, OPT's logbook, Llama 3), hardware
   health (Xid errors, ECC and row remapping, thermal throttling, NVLink errors, EFA counters).
2. Tools at pinned versions where they are code: PyTorch profiler and Holistic Trace Analysis, the
   CUDA memory snapshot, the PyTorch NCCL flight recorder for hangs, Nsight Systems, NCCL's debug
   output, RAS subsystem and nccl-tests baselines, DCGM and dcgm-exporter (the profiling field IDs
   for tensor-core activity and NVLink), Neuron monitoring and profiling tools (link the silicon dive),
   CloudWatch Container Insights enhanced observability for EKS (GPU, EFA, Neuron metrics), SageMaker
   HyperPod observability (Amazon Managed Service for Prometheus and Managed Grafana), SageMaker
   training job metrics and the current status of SageMaker Debugger and Profiler, experiment
   tracking (TensorBoard, MLflow including SageMaker managed MLflow).
3. Hangs and timeouts: NCCL watchdog, `TORCH_NCCL_*` error handling variables at a pinned PyTorch
   release, the flight recorder analyser, HyperPod's hang detection.
4. Best practices that recur across first-party sources (baseline collectives before a run, a
   single-node smoke run, MFU tracking, gradient-norm alerting, step-time regression alerts), each
   with the sources that state it.
