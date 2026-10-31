# Claims: section 8, Data Parallelism & Sharding: DDP, ZeRO, FSDP & HSDP

File: `src/sections/DataParallel.tsx`. Re-opened on 2026-10-31 (raw files at the pinned tags, fetched with no identifying headers): PyTorch v2.15.0 `torch/nn/parallel/distributed.py`, `torch/distributed/fsdp/_fully_shard/_fully_shard.py`, `_fsdp_param_group.py` and `_fsdp_api.py`; TorchTitan v0.4.0 `torchtitan/config/parallelism.py` and `torchtitan/training_engine.py`; E1 and E3 in this repository. ZeRO, the FSDP paper (with its LaTeX source), nccl-tests `doc/PERFORMANCE.md`, the Hugging Face metadata, the H100, NVLink and EC2 instance pages carry 2026-10-31 because wave 2 re-read them (W2-1, W2-7, W2-12 to W2-14) or section 7 re-opened them the same day. Rows cited from the register without re-opening carry `accessed="2026-10-30"`: the DDP paper, ZeRO++, McCandlish, Kaplan, Llama 3, the NeMo heuristics, the AWS Price List file, the Capacity Blocks page and the On-Demand quota page.

Cross-instance figures follow the orchestrator addendum in `research/2026-10/wave2-parallelism.md` (per instance over 400 GB/s), which replaces W2-15's per-GPU figures (373 vs 24.1 GB, factor 15.5). Every worked number was checked against the calculators in `src/lib/` run through vite-node: Calculator C (`evaluateLayout`, four p5.48xlarge, Llama 3.1 8B, 8,192 tokens, global batch 256, micro-batch 1) gives 289.09, 192.73, 120.45, 24.09 and 385.45 GB per instance per step, 337.27 GB of HSDP NVLink traffic per GPU, compute 7.98 s (9.04 s with causal attention), and memory 74.93 / 82.45 GB (HSDP deferred, no recomputation, fused / eager SwiGLU) and 41.71 / 41.95 GB (full recomputation). Other derived figures were recomputed in Python.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction (h1)

- Llama 3.1 8B has 8,030,261,248 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b | T01-3
- Mixed-precision Adam holds 16 bytes of model state per parameter | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9, T02-5
- 128.5 GB of model state is 1.6 times one H100's 80 GB (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T02-69 for 80 GB; 8.030e9 x 16 B [derived]
- h1 description: HSDP with deferred sync sends about 12 times fewer bytes between instances than flat FSDP at the defaults, and the sync mode is the larger lever | derived, 289 / 24.1 | orchestrator addendum on W2-15; Calculator C

## Data parallelism and DDP

- DP: every rank holds a replica; gradients summed by an all-reduce; synchronous, so the slowest rank sets the pace | https://arxiv.org/abs/2006.15704v1 (Section 2.2) | T02-1
- DDP buckets gradients in reverse parameter order and all-reduces each bucket as soon as it is ready, overlapping the backward pass | https://arxiv.org/abs/2006.15704v1 (Section 3.2.3) | T02-2
- Default bucket 25 MiB via `bucket_cap_mb` at v2.15.0 | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/nn/parallel/distributed.py#L712-L717 | W2-1, T02-3, U02-1 (closed)
- Smaller first bucket so the earliest gradients move sooner | same file #L105-L110 | W2-1
- Bucket size trades per-collective overhead against a later first all-reduce; the paper tells applications to measure it | https://arxiv.org/abs/2006.15704v1 (Section 4.2) | T02-3
- An all-reduce over n ranks sends 2(n-1)/n of the array from each rank | https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md#L52-L63 | T02-60, W2-12
- DP sends 2N(n-1)/n gradient elements per rank per step, about 2N | https://arxiv.org/abs/1910.02054v3 (Section 7.1) | T02-4, W2-12
- 16.06 GB of BF16 gradients: about 62 ms inside one p5.48xlarge; across four, at least 24.1 GB per instance, about 60 ms over 400 GB/s | none (points to section 7, Collectives & What They Cost) | orchestrator addendum on W2-9
- 16 bytes = 2 BF16 weights + 2 BF16 gradients + 12 optimizer (FP32 master and two Adam moments) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T02-5, T01-9

## ZeRO: shard the copies one class at a time

- Stage 1: 4 + 12/d bytes per parameter; stage 2: 2 + 14/d; stage 3: 16/d | https://arxiv.org/abs/1910.02054v3 (Sections 5.1 to 5.3) | T02-6, W2-13
- Table: 128.5 / 44.2 / 30.1 / 16.1 GB at d = 8 and 128.5 / 35.1 / 19.6 / 4.0 GB at d = 32 | derived from ZeRO's formulas and T01-3 | W2-13, 01 W2 [derived]
- Stages 1 and 2 send the same bytes as DP: reduce-scatter of gradients plus all-gather of updated weights, N + N | https://arxiv.org/abs/1910.02054v3 (Section 7.2.1) | T02-7, W2-13
- Stage 3 all-gathers weights before forward and again before backward: 3N, 1.5 times DP | https://arxiv.org/abs/1910.02054v3 (Section 7.2.2) | T02-7, W2-13
- "Sharding the optimizer state is free in communication; sharding the weights turns sharding into a bandwidth decision" | from the two rows above | T02-7 [our reading]

## FSDP and HSDP: how wide to shard

- FSDP generalises ZeRO-3 with sharding factor F: F = 1 is DDP, F = W shards fully, between is hybrid | https://arxiv.org/abs/2304.11277v2 (Section 3.2) | T02-8, W2-14
- FSDP2 `fully_shard` per unit: all-gather before forward, free, all-gather before backward, reduce-scatter gradients | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fully_shard.py#L115-L123 | T03-1
- Micro-batch and gradient accumulation gloss | none (definition) | T01-52
- At defaults FSDP2 issued two all-gathers and one reduce-scatter per unit per micro-batch, one all-gather fewer for the root unit | E3 (https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E3-spark-fsdp2-collectives.md) | E3 (Tier 0)
- HSDP: reduce-scatter inside each sharding group, then all-reduce of each shard across replication groups of same-local-rank accelerators on different hosts | https://arxiv.org/abs/2304.11277v2 (Section 3.2.2) | T02-9, W2-14
- FSDP2 HSDP is a 2D device mesh, replicate on dim 0 and shard on dim 1 | _fully_shard.py#L182-L188 (same file) | T03-1
- HSDP crossing 2M(W-G)/(GW) bytes per GPU per synchronisation | derived from the paper's definitions | C02-1, U02-13 (closed, G4), W2-14 [derived]
- Figure: bytes per parameter 16 (DDP), 4.75 (stage 1, d = 16), 1 (stage 3, d = 16), 2 (HSDP, 16/8); schematic | derived from ZeRO's formulas | W2-13 [derived]
- HSDP memory cost: 16.1 GB per GPU against 4.0 GB for flat FSDP over 32 | derived (table) | W2-13 [derived]
- The FSDP paper aims hybrid sharding at models too large for full replication and too small to need full sharding; reports smaller all-reduces run faster because of stragglers and network interference, no figure | https://arxiv.org/abs/2304.11277v2 (Section 3.2.2) | T02-10
- ZeRO++: cross-node volume 3M to 0.75M via INT8 forward all-gather, a secondary weight copy per node, INT4 gradients through an all-to-all reducing inside the node first; authors report up to 2.16 times throughput at 384 GPUs | https://arxiv.org/abs/2306.10209v1 (Section 1 and abstract) | T02-11
- Expandable: the paper defines F, then sets F = W/G and prints 2M(W-1)/(GW); the surrounding text matches F = G | https://arxiv.org/abs/2304.11277v2 (LaTeX source `text/design_sharding.tex` lines 4, 54, 73, via https://arxiv.org/e-print/2304.11277v2) | C02-1, W2-14
- Expandable: 3.01 GB per GPU per sync against 3.89 GB from the printed form; 8 x 3.01 = 24.1 GB per instance | derived (M = 16.06 GB, G = 8, W = 32) | W2-14, orchestrator addendum [derived]

## Price it: Llama 3.1 8B on four p5.48xlarge

- Global batch 256 at 8,192 tokens for an 8B-class model on 80 GB GPUs | https://github.com/NVIDIA/NeMo/blob/v2.7.3/nemo/collections/llm/tools/auto_configurator/core/training_config.py#L364-L398 | T02-55
- 8 micro-batches of one per GPU (256 / 32) | derived | [derived]
- 6N FLOPs per parameter per token | https://arxiv.org/abs/2001.08361v1 (Section 2.1) | T01-14
- Llama 3 measured 38% to 43% MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6, T02-47
- H100 989.5 TFLOPS dense BF16 (half of 1,979 "with sparsity"), vendor specification | https://www.nvidia.com/en-us/data-center/h100/ | T02-69, T01-27
- Compute about 8 s per step at an assumed 40% MFU (7.98 s), about 9 s with causal attention (9.04 s) | derived | Calculator A and C; section 4 [derived]
- p5.48xlarge EFA 3,200 Gb/s = 400 GB/s per instance | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, T05-2
- Per-instance pricing: at least (M-1)/M x S per all-gather or reduce-scatter across M instances; flat ring (n-1)/n x S; 3/4 x 16.06 = 12.05 GB | none (points to section 7) | orchestrator addendum, build-log cross-section conditions [our reading]
- Flat FSDP over 32, defaults: 24 collectives per step, at least 289 GB per instance (373 GB flat ring), 0.72 s | derived from E3's counts | orchestrator addendum on W2-15, E3, 03 W1; Calculator C 289.09 GB
- HSDP shard 8 replicate 4, defaults: 8 x 24.09 = 193 GB, 0.48 s; factor about 1.5 | derived | orchestrator addendum on W2-15; Calculator C 192.73 GB
- Flat FSDP deferred: 9 all-gathers + 1 reduce-scatter per unit, at least 120 GB (156 GB), 0.30 s | derived from E3 | orchestrator addendum on W2-15, E3; Calculator C 120.45 GB
- HSDP deferred: 24.1 GB, about 60 ms; factor about 5 | derived | orchestrator addendum on W2-15; Calculator C 24.09 GB
- Levers: layout 1.5 at defaults; deferral 2.4 (flat) and 8 (HSDP); both together about 12; the sync mode is the larger lever | derived from the four rows above | orchestrator addendum on W2-15 [derived]
- In TorchTitan the sync mode is one setting, `fsdp_defer_gradient_reduction` | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L61-L62 | T03-3
- HSDP's in-instance gathers: about 337 GB per GPU per step at the defaults, about 0.75 s at 450 GB/s per direction (vendor specification); HSDP's time gain can be smaller than its byte gain | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70, W2-7; Calculator C 337.27 GB [our reading]
- With sync off, gradients accumulate on the unsharded parameters | _fully_shard.py#L606-L608 | T03-2
- Full unsharded BF16 gradient 16.06 GB per GPU; HSDP holds four times flat FSDP's model state | derived | [derived]
- Memory at micro-batch 1, HSDP deferred: about 75 GB with a fused SwiGLU and about 82 GB with TorchTitan v0.4.0's eager SwiGLU without recomputation; about 42 GB with full recomputation | derived | Calculator B through C (74.93, 82.45, 41.71, 41.95 GB); section 5 [derived]
- Activations 34 sbh (fused) and 41 sbh (eager) bytes per layer, measured on one GB10 | E1 (https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md) | E1 (Tier 0)
- Recommendation: HSDP with one instance per sharding group, deferred sync, full recomputation | from the rows above | [our reading]

### Expandable: the FSDP2 and TorchTitan defaults

- Each FSDP2 parameter group starts with `reduce_grads`, `all_reduce_grads` and `reshard_after_backward` True | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fsdp_param_group.py#L268-L276 | T03-2
- `set_requires_gradient_sync(False)` is FSDP2's `no_sync`; for HSDP it controls the reduce-scatter and the all-reduce together | _fully_shard.py#L597-L615 | T03-2
- `set_reshard_after_backward(False)` keeps weights unsharded between micro-batches | _fully_shard.py#L687-L694 | T03-2
- `set_requires_all_reduce(False)` (HSDP) keeps the reduce-scatter and skips the cross-replica all-reduce | _fully_shard.py#L634-L640 | T03-2
- E3 counts, five units, four micro-batches: 36/20 at defaults, 36/5 with sync off on the first three, 21/5 with resharding after backward also off; k + 1 all-gathers per unit | E3 | E3 (Tier 0)
- Sync off alone: 16 all-gathers + 1 reduce-scatter, at least 17 x 12.05 = 205 GB per instance | derived from E3's counts | E3 [derived; new figure, not in the register]
- TorchTitan v0.4.0 `fsdp_defer_gradient_reduction` defaults to False | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L61-L62 | T03-3
- When True the trainer enables gradient sync, resharding after backward and `set_is_last_backward` only on the last accumulation step | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/training_engine.py#L772-L776 | T03-3
- FSDP2 keeps sharded parameters in their own dtype, no separate master copy | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fsdp_api.py#L22-L26 | T03-4
- From 2.15, `reduce_dtype=None` reduces in the gradient dtype (FP32 for FP32 parameters), earlier in `param_dtype`; `reduce_dtype=torch.bfloat16` restores it; FSDP1 still uses `param_dtype` | _fsdp_api.py#L41-L59 | T03-4, C03-9
- FP32 reduce, flat FSDP at defaults: 16 x 12.05 + 8 x 24.09 = 385 GB per instance (498 GB flat ring), 0.96 s; deferred FP32 gradient 32.1 GB per GPU | derived | orchestrator addendum on W2-15; Calculator C 385.45 GB [derived]

### Expandable: A2 protocol (not yet run)

- A2 design: TorchTitan v0.4.0, Llama 3.1 8B, 8,192 tokens, 8 micro-batches; FSDP 8 on one p5.48xlarge, flat FSDP 16 and HSDP (shard 8, replicate 2) on two, with and without deferral; tokens/s, MFU, peak memory, EFA bytes | https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/RESEARCH-GUIDE.md (section 5, A2) | RESEARCH-GUIDE A2 (on hold)
- Prediction, two instances: flat FSDP 16 about 193 GB at defaults and 80 GB deferred, HSDP about 128 GB and 16.1 GB per instance per step | derived | Calculator C at two instances [our reading; new figures, not in the register]
- p5.48xlarge On-Demand $55.04 per hour, us-east-1, Price List version 20261029175634; 2 x 3 x $55.04 = $330 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | T05-20 [derived total]
- Running On-Demand P instances quota starts at 0 vCPUs | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31
- Shared 7-hour window: $771 On-Demand; Capacity Block $47.757 per instance-hour in US East (N. Virginia), 2 x 24 x $47.757 = $2,292, charged at the price quoted at purchase | https://aws.amazon.com/ec2/capacityblocks/pricing/ | T05-22, RESEARCH-GUIDE section 5 [derived totals]
- Teardown: one stack, deleted and verified by listing instances by its tag | RESEARCH-GUIDE section 5 | guide

## The ceiling on data parallelism is the batch

- Global batch = DP degree x micro-batch x micro-batches per step | none (identity) | T01-52
- Critical batch size: below it, doubling the batch nearly halves the steps; above it, extra batch mostly spends compute | https://arxiv.org/abs/1812.06162v1 (Sections 2.2 and 2.3) | T01-53
- The critical batch size grows during training as the gradient shrinks | https://arxiv.org/abs/1812.06162v1 (Section 2.4) | T01-54
- Llama 3 held global tokens per batch constant from 8,192 to 16,384 GPUs, halving the batch per DP group from 32 to 16 sequences; Meta attributes the MFU fall from 43% to 41% to it | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2 and Table 4) | T01-55, T02-47, W2-16
- Past that point, further GPUs go to tensor, pipeline and context parallelism (sections 9 to 11) | none (orientation) | [our reading]

## Set the data-parallel dimension

- ZeRO stage 1 takes Llama 3.1 8B from 128.5 GB to 44.2 GB per GPU on one instance with no extra bytes | derived (table) and ZeRO Section 7.2.1 | W2-13, T02-7 [derived]
- HSDP with deferral: 289 GB to 24.1 GB per instance per step, about 12 times less | derived | orchestrator addendum on W2-15 [derived]
- Set `reduce_dtype` explicitly and record the PyTorch version with any byte count | from T03-4 | C03-9 [our reading]
- Price the candidate layout with the sizing calculator in section 14, Set My Ranks | none (pointer) | Calculator C
