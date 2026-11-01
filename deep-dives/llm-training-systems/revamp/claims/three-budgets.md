# Claims: section 1, A Training Run Is Three Budgets

File: `src/sections/ThreeBudgets.tsx`. A survey section: every figure repeats the figure and the citation of the section that owns it (named in the last column). Re-opened on 2026-10-31 with plain `curl` into a fresh `/tmp` directory, so every Cite carries the default accessed date: arXiv PDFs 2407.21783v3, 1910.02054v3, 2205.05198v1, 2001.08361v1, 2204.02311v5, 2104.04473v5 and 2410.21680v2 (pdftotext); the Hugging Face model metadata for Llama 3.1 405B and 8B at the pinned revisions; the NVIDIA H100 and NVLink pages; the EC2 accelerated computing and Capacity Blocks pages; PyTorch v2.15.0 `state_dict_saver.py`; Megatron-LM core_v0.20.0 `dist_optimizer.md`. Derived figures recomputed in Python from the inputs named.

Format: claim | source URL | register, wave 2 row or experiment (owning section)

## Opening

- The six questions, in order (compute and time; fit and split; software; keeping it running; AWS path and cost; health) | SCOPE.md section 1 block | scope (no figure)

## Three budgets, in plain words

- About 6 FLOPs per parameter per token | https://arxiv.org/abs/2001.08361v1 (Section 2.1) | T01-14; W1-37 (section 3)
- 2 FLOPs per parameter per token in the forward pass, 4 in the backward pass | https://arxiv.org/abs/2204.02311v5 (Appendix B; venue JMLR 2023, https://jmlr.org/papers/v24/22-1144.html) | T01-18; W1-37 (section 3)
- Llama 3.1 405B has 405,853,388,800 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe | T01-3; W1-1 (section 4)
- Llama 3 405B pre-trained on 15.6T tokens for a budget of 3.8e25 FLOPs | https://arxiv.org/abs/2407.21783v3 (Section 1) | T01-5; W1-1 (section 4)
- 6ND = 6 x 405,853,388,800 x 15.6e12 = 3.80e25, reproducing Meta's 3.8e25; the paper does not state its FLOP-counting rule | derived (3.7988e25) | W1-13; W1-31 (section 4, strongest number)
- 16 bytes per parameter for mixed-precision Adam: 2 weights, 2 gradients, 12 optimizer (FP32 master plus two moments) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9 (section 3, section 5)
- Llama 3.1 8B has 8,030,261,248 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b | W1-3 (sections 3, 5)
- 8B model state 128.5 GB, 1.6 times one 80 GB H100 (16 x 8,030,261,248 = 128.48 GB; / 80 = 1.61) | derived; https://www.nvidia.com/en-us/data-center/h100/ (80 GB, vendor specification) | 01 W2; T01-27 (sections 3 and 5, strongest number of section 1)
- With BF16 weights and FP32 main gradients the count is 18 bytes per parameter (the table's "bf16 parameters, fp32 gradients" row) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | T03-17; W1-49 (section 5)
- "a single GPU failure may require a restart of the entire job" (verbatim) | https://arxiv.org/abs/2407.21783v3 (Section 3.3.4) | T04-1 (section 17)
- Llama 3 405B on up to 16K GPUs: one unexpected interruption every 3.1 hours over a 54-day window; more than 90% of time training | https://arxiv.org/abs/2407.21783v3 (Sections 3.3.1 and 3.3.4) | T04-1; T04-4; W4-4; W4-5; build-log "Llama 3 interruptions" (section 17)
- 466 interruptions in 54 days, 47 planned, 419 unexpected; 54 x 24 / 419 = 3.09 h | https://arxiv.org/abs/2407.21783v3 (Section 3.3.4); derived | T04-4 (section 17)
- p5.48xlarge: eight H100s, 3,200 Gb/s of EFA | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68 (section 7)
- NVLink 900 GB/s per Hopper GPU; 450 GB/s per direction is our reading | https://www.nvidia.com/en-us/data-center/nvlink/ (vendor specification) | T02-70; W2-7 (section 7)
- 50 GB/s per GPU of EFA (3,200 / 8 / 8); per GPU NVLink is nine times EFA; neither page prints 450 or 50; AWS does not state whether 3,200 Gb/s is per direction | derived from the two pages | W2-7; build-log "Cross-instance pricing" (section 7)
- Splitting pays for the first two budgets in network traffic; a split that works keeps its most frequent traffic inside one instance | thesis, our reading | SCOPE thesis; sections 7 and 13
- The training step is the same on every AWS path; what differs is who runs the cluster, replaces a broken machine, restarts the job | section 20's opening, our reading of its sources | SCOPE thesis (section 20)
- Seven paths in three cluster shapes: cluster per job (SageMaker training jobs); long-lived Slurm (own Slurm on EC2, AWS PCS, HyperPod Slurm); long-lived Kubernetes (self-managed EKS, AWS Batch on EKS, HyperPod EKS) | section 20's sources (CreateTrainingJob, ParallelCluster, PCS custom AMIs, HyperPod Slurm and EKS, Batch EKS compute environments) | claims/aws-ownership.md "Introduction and the three shapes" (section 20)
- On every path the training script owns its checkpoints, a per-step log a hang detector reads, and a last save before the reservation ends | section 20's sources (HyperPod auto-resume, SageMaker repairs, Slurm sbatch, training operator usage) | T06-12; claims/aws-ownership.md (section 20)
- Capacity Block termination begins 11:00 UTC on the final day; blocks end 11:30 UTC, so 30 minutes before the end | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16; build-log "Capacity Block edges" (section 20)

## Diagram (every figure appears in the prose above)

- Bars to scale: 2 and 4 FLOPs per parameter per token; 8B model state 16.06 + 16.06 + 96.36 GB against 80 GB; one day with marks every 54 x 24 / 419 h | rows above | caption labels the even spacing of interruptions as illustrative, not measured

## Every technique trades one resource for another

- Full recomputation keeps 2 sbh per layer | https://arxiv.org/abs/2205.05198v1 (Table 2) | T01-32 (section 5)
- E1 on one GB10: 34.03 sbh (fused) and 41.03 sbh (eager) without recomputation, 2.00 sbh with full recomputation | https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md | E1; build-log "Activation coefficient" (sections 3, 5)
- Full recomputation costs one more forward pass, about 33% more FLOPs ("the expected 33%") | https://arxiv.org/abs/2205.05198v1 (Section 6.2) | T01-12; T01-34 (section 5)
- E2: +16.3% and +14.2% step time for full recomputation, Llama 3.2 1B shape, 2,048 tokens, two runs on one GB10 | https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E2-spark-step-time-recompute.md | E2; build-log "Recomputation price" (section 5)
- Full sharding (FSDP, ZeRO stage 3): 16/d bytes per parameter per rank | https://arxiv.org/abs/1910.02054v3 (Section 5) | T02-6 (sections 5, 8)
- 8B across 8 GPUs: 128.5 / 8 = 16.1 GB per GPU | derived | matches section 8's table (Stage 3, d = 8: 16.1)
- Stage 3 adds about 50% to data parallelism's communication volume when each step is one micro-batch | https://arxiv.org/abs/1910.02054v3 (Section 1: "a modest 50% increase in communication volume"; Section 7.2.2 counts one forward and backward per step) | T02-7 (section 5; section 8 scopes the stage comparisons to one micro-batch per step)
- async_save first stages the state dict to CPU memory, then saves in a separate thread | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py#L233-L234 | T04-20 (sections 15, 18)
- Training pauses only for the copy, so the run can save more often and lose less work per failure | our reading, as section 18 states it ("buys mainly a shorter interval and less work lost per failure") | 04 W3 (section 18)
- Tensor parallelism: two all-reduces in the forward pass and two in the backward per layer, every micro-batch | https://arxiv.org/abs/2104.04473v5 (Section 3.2: "twice each in the forward and backward pass for each layer ... per layer per device for each microbatch") | T02-13 (section 7 cites the same Sec 3.2)
- Data parallelism's all-reduce can run once per batch | https://arxiv.org/abs/2104.04473v5 (Section 3.3.2: "data parallelism only needs to perform expensive all-reduce communication once per batch") | T02-13 (section 7; FSDP2's per-micro-batch default is section 8's, so the page says "can")

## Put a number on each budget before you choose

- 40% MFU is a labelled assumption inside Llama 3 405B's 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2, Table 4) | T01-6; build-log "default MFU" (sections 3, 4)
- Job MTTF = 1 / (N_nodes x r_f) | https://arxiv.org/abs/2410.21680v2 (Section III: "MTTF = (Nnodes rf)^-1") | T04-7; W4-1 (section 17)
- Section pointers (Calculators A, B, D in sections 4, 5, 18; sections 2, 17, 20, 28) | App.tsx titles; authoring brief | none

## Acronyms expanded in this file

FLOPs, EFA, EC2, PCS, EKS, UTC, ZeRO, FSDP, MLP, MFU, BF16, MTTF. Products and names used unexpanded: H100, NVLink, GB10, DGX Spark, SageMaker, HyperPod, Slurm, Kubernetes, AWS Batch, Adam.
