# Claims: section 19, Resuming Correctly

File: `src/sections/Resuming.tsx`. Re-opened on 2026-10-31 with plain `curl` into a fresh `/tmp` directory and read as text (Cites carry the default accessed date): PyTorch v2.15.0 `torch/distributed/run.py` and `docs/source/notes/randomness.md` (at 31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457); TorchTitan v0.4.0 `torchtitan/distributed/utils.py`, `torchtitan/tools/garbage_collector.py`, `torchtitan/training_engine.py`, `torchtitan/trainer.py` (at 45e33cd413b64cb37a7840cfd3c9765d3c639ae1; the tag URLs return identical files); Megatron-LM core_v0.20.0 `megatron/core/datasets/gpt_dataset.py`, `megatron/training/datasets/data_samplers.py`, `megatron/training/config/training_config.py` (at 685fb8bd970185e9ac3283fe32a5d6667bf4b268); TorchFT v0.2.0 `README.md` and `torchft/manager.py` (at b8a096f9f23589ec93e988e2368a934cab01b890); torchdata v0.11.0 `torchdata/stateful_dataloader/README.md`; MosaicML Streaming v0.13.0 `README.md`; Slurm `sbatch.html`; HyperPod docs `sagemaker-eks-elastic-training.html`, `sagemaker-hyperpod-resiliency-slurm-auto-resume.html`, `sagemaker-eks-operator.html`; NCCL 2.32.3 `env.html` and the guide index; arXiv HTML 2505.05713v2. Not re-opened by this author: Llama 3 v3 Sec 3.3.4, MegaScale v1 Sec 6.3 and FALCON v1 abstract (re-fetched by wave 2 on 2026-10-31, W4-10, W4-32, W4-40, so dated 2026-10-31); the A1 protocol's DLAMI release notes, EC2 Price List and On-Demand quota page (register date, `accessed="2026-10-30"`).

No number on the page comes from a calculator in `src/lib/`. Section 18 (`checkpointing`) is referenced by name for what a checkpoint holds and the save interval; none of its numbers are restated. Section 22 is referenced for the reservation's termination edge without restating it.

Format: claim | source URL | register, wave 2 row or experiment. "NEW" marks a fact read at a fetched pinned source with no register row.

## Header and opening

- Stragglers wasted 10.4% of allocated GPU-hours in ByteDance's trace of 3,079 large jobs (h1 description, intro, h2 description, ByteDance paragraph, ending) | https://arxiv.org/abs/2505.05713v2 (Sec 3.1, 4.1) | T04-47, W4-11
- A rank is one training process, one per GPU (definition) | none needed; dive glossary term | section 32 glossary
- Llama 3 405B, on up to 16K GPUs, 419 unexpected interruptions in a 54-day window; one every 3.1 hours by our arithmetic (54 x 24 / 419 = 3.09 h) | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.4) | T04-4, W4-5; build-log condition "Llama 3 interruptions"
- 3,079 pre-training jobs on 128 GPUs or more | https://arxiv.org/abs/2505.05713v2 (Sec 3.1) | T04-47, W4-11

## Who restarts the job

- torchrun's recommended script structure: load_checkpoint, initialize, train | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/run.py#L393-L404 | T04-40, W4-24
- torchrun stops and restarts all workers when k <= n fail, up to max_restarts | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/run.py#L308-L309 | T04-40, W4-24
- `--max-restarts` defaults to 0, so default settings end the job on one failure | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/run.py#L563-L570 | T04-40, W4-24
- On failure or membership change all surviving workers are killed immediately; RANK is not stable across restarts; never hard-code rank assumptions | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/run.py#L379-L388 | T04-40, W4-24
- Slurm `--requeue`: eligible after node failure or preemption; batch script restarts from the beginning under the same job ID; JobRequeue sets the cluster default | https://slurm.schedmd.com/sbatch.html | T04-41, W4-25
- Slurm `--signal`: sent sig_time seconds before end, up to 60 s earlier; by default all job steps are signalled, not the batch shell; by default no signal | https://slurm.schedmd.com/sbatch.html | T04-41, W4-25 (step-versus-batch-shell detail NEW, same page)
- Megatron `exit_signal_handler` saves a checkpoint and shuts down on SIGTERM; default False; `exit_signal` default SIGTERM | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py#L79-L83 | NEW
- Set the time limit so the signal lands before the reservation starts terminating instances (our reading; section 22 owns the edge) | https://slurm.schedmd.com/sbatch.html | T04-41 use-in-dive [our reading]
- HyperPod node recovery defaults to Automatic, which reboots or replaces faulty nodes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-6, W5-37
- `srun --auto-resume=1` retries the step after hardware failure; nodes always replaced, not rebooted; restarts from the last saved checkpoint; jobs without auto-resume simply exit | same URL | T06-7, W5-37, W5-38, W5-61
- Keep setup in the single srun that auto-resume retries; do not trust `$SLURM_JOB_NODELIST` after a resume | same URL | T06-7, W5-38
- HyperPod training operator restarts failed processes in place instead of the whole job, detects hung jobs; documented support PyTorch 2.4.0 to 2.7.1 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | T06-9, W5-47

## Changing the job's size

- Both tools scale only the data-parallel dimension because the TP/PP layout fixes each rank's slice (our reading) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html ; https://github.com/meta-pytorch/torchft/blob/v0.2.0/README.md | T06-13, T04-42 use-in-dive [our reading]
- HyperPod elastic training: EKS, training operator v1.2+, changes the number of data-parallel replicas through automatic checkpointing and resumption | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | T06-13, W4-26
- Supports DDP and FSDP (with DCP); replaces torchrun with hyperpodrun; not with checkpointless training, managed tiered checkpointing or Spot | same URL | T06-13
- Example: global batch 128 and learning rate 4e-4 at two and three nodes; at three, 16 DP groups at local batch 5, the rest 6 | same URL (scale_config) | T06-13, W4-26
- Checkpointless training gloss "recovery from peers' in-memory state" (as in section 17) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html (cite carried by the sentence); definition in T06-14 | T06-14, W5-49
- TorchFT v0.2.0: per-step fault tolerance without interrupting the job; lighthouse; per-step heartbeats; membership changes at step granularity; live recovery from a healthy peer | https://github.com/meta-pytorch/torchft/blob/v0.2.0/README.md#L24-L52 | T04-42, W4-26
- Fault-tolerant HSDP across the replicated dimension with any FSDP/TP mix inside | same URL | T04-42
- Default world_size_mode DYNAMIC: uses all available replicas and normalises the gradient by the world size; global batch shrinks while a replica is missing | https://github.com/meta-pytorch/torchft/blob/v0.2.0/torchft/manager.py#L123-L138 ; #L174 | W4-26, G4
- FIXED_WITH_SPARES: active replicas = min_replica_size, spares contribute zero gradients | https://github.com/meta-pytorch/torchft/blob/v0.2.0/torchft/manager.py#L132-L135 | W4-26, G4
- A step commits only when num_participants >= min_replica_size | https://github.com/meta-pytorch/torchft/blob/v0.2.0/torchft/manager.py#L901-L902 | NEW (code read 2026-10-31)
- A schedule tuned for a fixed batch sees a smaller batch while a replica is missing (our reading) | manager.py | G4 [our reading]
- `batches_committed` sums participating replicas over steps ("5 replicas participating in 2 steps is 10 batches") | https://github.com/meta-pytorch/torchft/blob/v0.2.0/torchft/manager.py#L990-L1001 | G4 (quote), NEW line range

## The same data, in the same order

- Megatron builds document, sample and shuffle indices from RandomState(random_seed), caches and memory-maps them | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/gpt_dataset.py#L475-L494 ; #L590 ; #L400-L413 | T04-45, W4-27
- Pretraining sampler starts at consumed_samples and walks forward; each DP rank takes its slice of each block | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/datasets/data_samplers.py#L186-L198 | T04-45, W4-27
- Resuming needs one integer; global order independent of rank count (our reading of the sampler); keep the index cache reachable or it is rebuilt (our reading) | same | T04-45 use-in-dive [our reading]
- StatefulDataLoader v0.11.0: drop-in DataLoader replacement with state_dict/load_state_dict; default state is batches yielded, naive fast-forward; sampler/dataset state methods called if present; aggregates across workers, not across ranks | https://github.com/pytorch/data/blob/v0.11.0/torchdata/stateful_dataloader/README.md#L8-L15 | T04-44, W4-27
- Each rank's loader state goes into the checkpoint; fast-forward cost grows with position (our reading) | same | T04-44 use-in-dive [our reading]
- MosaicML Streaming: same sample order regardless of GPUs, nodes, CPU workers; resume "in seconds, not hours" (vendor claim, labelled) | https://github.com/mosaicml/streaming/blob/v0.13.0/README.md#L215-L226 | T04-46, W4-27
- TorchTitan seeding: one seed for all ranks, broadcast from rank 0 when none given; distinct seeds across named mesh axes such as pipeline stages | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/utils.py#L114-L124 ; #L196-L232 | T04-24
- A seed reproduces step-0 streams; the checkpoint-time streams return only if generator state was saved (our reading) | utils.py | T04-24 use-in-dive [our reading]
- Completely reproducible results not guaranteed across releases, commits, platforms; deterministic ops often slower | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/randomness.md#L5-L20 | T04-43, W4-28
- TorchTitan determinism switch: use_deterministic_algorithms, cudnn.deterministic True, cudnn.benchmark False, CUBLAS_WORKSPACE_CONFIG=":4096:8", flex attention compiled without max-autotune; logs "Deterministic algorithm enabled (expect perf degradation)"; reports no measured figure | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/utils.py#L137-L171 | T04-24, W4-28
- Neither PyTorch's reproducibility notes nor NCCL's 2.32.3 guide states whether collectives are bitwise identical run to run (hedge scoped to those documents) | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/randomness.md ; https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/index.html | U04-5 accept-as-hedge, G7
- NCCL_ALGO default unset: NCCL chooses algorithms from node topology and architecture | https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html | G7
- A different node set can change reduction order and the low bits (our reading); "same run" means same state, data order and random streams, not bitwise loss (our reading) | as above | U04-5 hedge text, T04-43 use-in-dive [our reading]
- A1 protocol (not yet run): ten repeats of one all-reduce compared bitwise; two p5.48xlarge, cluster placement group, DLAMI 20261027; prediction labelled our reading; about 2 hours, 2 x 2 x $55.04 = $220 On-Demand us-east-1 2026-10-30; quota raise first; one-stack teardown | research guide section 5; https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html ; https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | RESEARCH-GUIDE A1, T05-43, T05-20, T05-31 (figures match section 7's A1 block)

## Stragglers

- Llama 3: "even a single straggler can slow down thousands of other GPUs, often appearing as functioning but slow communications" | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.4) | T04-6, W4-40
- ByteDance trace: January to May 2024, 3,079 jobs >= 128 GPUs, about half the cluster's LLM GPU-hours; 42.5% straggle (>= 10% slower than simulated straggler-free); 10.4% of allocated GPU-hours wasted | https://arxiv.org/abs/2505.05713v2 (Sec 3.1, 4.1) | T04-47, W4-11
- Computation, not communication, caused most waste; no positive correlation with job size | same (Sec 4.3, 4.4) | T04-47
- 10.4% is the same order as the time Llama 3 and MegaScale lost to interruptions (each > 90% effective training time) (our reading across reports) | same; section 17 | T04-47 use-in-dive, T04-1, T04-13 [our reading]
- Diagram: schematic, captioned "Illustrative, not measured"; no numbers inside it | n/a | scope diagram for section 19
- Waiting shows up in collectives; rank by compute time, not collective time (our reading; scope mental model) | Llama 3 Sec 3.3.4; MegaScale Sec 6.3 | T04-6, T04-15 use-in-dive [our reading]
- Worker problems (hardware or software) explained > 50% of slowdown in only 1.7% of straggling jobs | https://arxiv.org/abs/2505.05713v2 (Sec 5.1) | T04-48, W4-12 (wording per W4-12)
- "traditional health metrics are unlikely to aid in detecting or preventing most stragglers" | same (Sec 5.6) | NEW quote, same source as T04-48
- Most prevalent causes: uneven pipeline stage partitioning, sequence-length imbalance across micro-batches, garbage-collector pauses; list not exhaustive | same (Sec 5.5, 5.6) | T04-48, W4-12
- Most steps of a straggling job slow similarly; sampling a few steps suffices to profile | same (Sec 4.2) | NEW
- GC can pause for hundreds of milliseconds, at different steps on different ranks | same (Sec 5.4) | T04-48
- Planned GC every 500 steps gave 12.6% on a 128-DP-rank job; interval needs per-job tuning (too large runs out of memory, too small costs performance) | same (Sec 5.4) | NEW
- TorchTitan v0.4.0 disables automatic GC and collects every gc_freq = 50 steps, built and run by default in the training engine | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/tools/garbage_collector.py#L21-L47 ; #L65-L66 ; https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/training_engine.py#L118-L119 ; #L622 | NEW (closes the register's "[our reading, not verified here]" note on T04-15)
- Megatron core_v0.20.0: manual_gc default False, manual_gc_interval default 0 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py#L91-L100 | NEW
- Sequence-redistribution prototype: 23.9% throughput on one representative 32K-max-sequence job; deployment at scale left to future work | https://arxiv.org/abs/2505.05713v2 (Sec 5.3) | T04-48 (prototype and future-work scope NEW)
- MegaScale: hosts about 10% slower on the same forward computation; removal +0.7% MFU; some ranks launched reduce-scatter late, "forcing a wait for the slowest rank to catch up" (expandable) | https://arxiv.org/abs/2402.15627v1 (Sec 6.3) | T04-15, W4-10
- Llama 3 ranked potentially problematic communications from selected process groups; a few top suspects usually sufficed (expandable) | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.4) | T04-6, W4-40
- Jobs with slowdown > 3 were all large jobs with < 3% of workers responsible; authors hypothesise server problems (expandable) | https://arxiv.org/abs/2505.05713v2 (Sec 4.1) | NEW
- FALCON: > 10,000-GPU shared production cluster; fail-slows from compute and cross-node networking lasting tens of seconds to nearly ten hours; practice treated them as fail-stops with checkpoint-and-restart (expandable) | https://arxiv.org/abs/2410.12588v1 (Abstract) | T04-49, W4-32

## Ending

- Six actions restate the claims above (max-restarts > 0 or orchestrator resume; --signal plus handler; data position per rank and generator state; global batch held by per-scale config or FIXED_WITH_SPARES; scheduled GC; per-rank compute time for section 29's check) | as above | scope ending for section 19
