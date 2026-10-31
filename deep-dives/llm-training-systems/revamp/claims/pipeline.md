# Claims: section 10, Pipeline Parallelism & the Bubble

File: `src/sections/PipelineParallel.tsx`. All sources were re-opened on 2026-10-31, the default accessed date, so no Cite carries an `accessed` override:
- Papers, as PDFs through pdftotext: GPipe 1811.06965v5, PTD-P 2104.04473v5, Korthikanti 2205.05198v1, Zero Bubble 2401.10241v1, DeepSeek-V3 2412.19437v2, Llama 3 2407.21783v3.
- Pinned source files: Megatron Core core_v0.20.0, TorchTitan v0.4.0, DeepSpeed v0.19.9, PyTorch v2.15.0.
- Vendor pages: AWS ac.html and the NVIDIA H100 page.

Every printed bubble, traffic, compute-time and memory figure that Calculator C (`src/lib/parallelism.ts`) also computes is produced at render time by `evaluateLayout`, together with `rankFacts` and `shapeOf` from `src/lib/presets.ts`. The schedule chart is simulated from each schedule's ordering rules. Its idle time matches `(p - 1)/(v x m)` exactly at every slider stop (scratch check, /tmp/pp-scratch/sim.mjs).

Format: claim | source URL | register, wave 2 row or experiment

## Introduction and h1

- PP splits a model by depth; stages pass one activation tensor per micro-batch to the neighbour | https://arxiv.org/abs/2104.04473v5 (Sec 2.2) | T02-28; T02-31
- 70B on four stages: bubble 4.7% of compute time, 0.94% with five interleaved chunks (h1, final h2, closing line) | Calculator C `evaluateLayout` | W2-25 [derived]

## Stages, micro-batches and the bubble

- m = B / (b x d) | https://arxiv.org/abs/2104.04473v5 (Sec 3.1) | T02-28; T02-44
- Bubble (p - 1)/m over ideal compute time | https://arxiv.org/abs/2104.04473v5 (Sec 2.2.1) | T02-28; W2-21
- GPipe bubble (p - 1)/(m + p - 1) over total time | https://arxiv.org/abs/1811.06965v5 (Sec 2.3) | T02-27; W2-21; C02-9
- p = 4, m = 8: 37.5% of ideal time against 27.3% of the step | our arithmetic | C02-9 [derived]
- Llama 3 removed one layer from the first and last stages; the first chunk holds only the embedding, the last only the output projection and loss | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-35; W2-6; G8 (wave2-parallelism)
- Llama 3 405B has 126 layers (Table 3) and ran PP 16 (Table 4) | https://arxiv.org/abs/2407.21783v3 | T02-35; T02-47
- 126 layers on PP 16 as 7 + 14 x 8 + 7 | our arithmetic, (126 + 2) / 16 = 8 | W2-6 [derived]
- DeepSeek-V3 has 61 layers (Sec 4.2) | https://arxiv.org/abs/2412.19437v2 | T02-71; W2-26
- DeepSeek-V3 ran PP 16 (Sec 3.2) | https://arxiv.org/abs/2412.19437v2 | T02-40; W2-26
- DualPipe places the shallowest and deepest layers on the same rank (Sec 3.2.3) | https://arxiv.org/abs/2412.19437v2 | G3 (wave2-parallelism)
- DeepSeek-V3's per-stage counts are not published | https://arxiv.org/abs/2412.19437v2 | W2-26; G3 (wave2-parallelism)
- All three frameworks support lighter first and last stages | the code rows below | W2-5; G2 (wave2-parallelism)
- Megatron Core checks that layers divide by p only when neither first nor last stage count is set | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L879-L891 | W2-5; G2 (wave2-parallelism)
- `--decoder-first/last-pipeline-num-layers` and `--pipeline-model-parallel-layout` | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3041-L3056 | G2 (wave2-parallelism)
- `--account-for-embedding/loss-in-pipeline-split` count each as one layer | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L151-L157 | G2 (wave2-parallelism)
- First and last counts of 7 leave 8 layers on each of 14 middle stages | our arithmetic | W2-6 [derived]
- TorchTitan's first and last stage are one layer lighter by default | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L95-L105 | G2 (wave2-parallelism)
- TorchTitan counts embedding and head as extra layers, then splits evenly | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/pipeline_parallel.py#L551-L612 | G2 (wave2-parallelism)
- TorchTitan's default gives 7 + 14 x 8 + 7 on 126 layers and 16 stages | our reading of the code | G2 (wave2-parallelism) [derived]
- DeepSpeed `partition_method` defaults to 'parameters' | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/module.py#L116-L133 | G2 (wave2-parallelism)
- DeepSpeed: 'uniform' gives equal layer counts; 'type:<regex>' balances on matching classes | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/module.py#L396-L417 | G2 (wave2-parallelism)

## Three schedules on four stages

- GPipe runs all forwards and then all backwards, so it stashes all m micro-batches | https://arxiv.org/abs/2104.04473v5 (Sec 2.2.1) | T02-28; T02-29
- 1F1B keeps the same bubble and caps in-flight micro-batches at p | https://arxiv.org/abs/2104.04473v5 (Sec 2.2.1) | T02-29; W2-21
- Megatron Core's non-interleaved warm-up is p - 1 - rank micro-batches | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/schedules.py#L2307-L2310 | NEW, verified at tag 2026-10-31
- Megatron Core then runs 1F1B in steady state | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/schedules.py#L2415-L2416 | NEW, verified at tag 2026-10-31
- TorchTitan's `pipeline_parallel_schedule` defaults to 1F1B | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L114-L121 | NEW, verified at tag 2026-10-31
- Interleaved: v non-adjacent chunks per device (example: layers 1, 2, 9, 10 on the first device) | https://arxiv.org/abs/2104.04473v5 (Sec 2.2.2) | T02-30
- Interleaved: bubble (p - 1)/(v x m), v times the traffic, m a multiple of p | https://arxiv.org/abs/2104.04473v5 (Sec 2.2.2) | T02-30; W2-21
- Chart, v = 2: stage 1 holds layers 1-10 and 41-50 | our arithmetic (Megatron's chunk assignment) | [derived]
- Backward drawn at twice the forward, the ratio of their FLOPs | https://arxiv.org/abs/2104.04473v5 (Appendix) | T01 6N basis [derived]
- Chart readouts: bubble 3/(v x m) from the calculator; the same idle time over the whole step from the simulation; stage 1 at L layers' worth (1F1B) and 1.375 L (interleaved, v = 2, m >= 8) | Calculator C; simulation | W2-21; W2-23 [derived]
- Drag m to 64 and the 1F1B bubble is 4.7% | Calculator C | W2-25 [derived]
- Zero Bubble splits the backward into input gradient (B) and weight gradient (W); W can run any time after B on the same stage and is placed in the gaps | https://arxiv.org/abs/2401.10241v1 (Sec 2) | T02-33
- ZB-H1: about a third of 1F1B's bubble at the same peak memory; ZB-H2: zero bubble at 2p - 1 micro-batches | https://arxiv.org/abs/2401.10241v1 (Sec 2, Table 2) | T02-33
- Zero Bubble: up to 23% more throughput at similar memory, 31% relaxed (authors' runs) | https://arxiv.org/abs/2401.10241v1 (abstract) | T02-33
- DualPipe: two-ended feed, split backward, paired forward and backward chunks hiding the all-to-all and PP sends | https://arxiv.org/abs/2412.19437v2 (Sec 3.2.1) | T02-34
- DualPipe bubble (PP/2 - 1)(F&B + B - 3W) against 1F1B's (PP - 1)(F + B), 2x parameters, PP + 1 activations, even counts, no need for m to divide by stages | https://arxiv.org/abs/2412.19437v2 (Sec 3.2.1, Table 2) | T02-34
- DualPipe was built because computation and communication were about 1:1 | https://arxiv.org/abs/2412.19437v2 (Sec 3.2.1) | T02-34
- DualPipe is a communication-hiding schedule first | our reading | T02-34 [our reading]
- Llama 3: tunable N, interleaved bubble (PP - 1)/(V x M), asynchronous point-to-point | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-35
- Meta does not publish V and M for the 405B run | https://arxiv.org/abs/2407.21783v3 | U02-10 (hedge kept); G8 (wave2-parallelism)
- Megatron's equivalent of N is `--microbatch-group-size-per-virtual-pipeline-stage`, default p (our reading of the docstring) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/model_parallel_config.py#L466-L484 and #L603-L604 | NEW, verified at tag 2026-10-31 [our reading]
- Interleaved schedule errors when m mod N is between 1 and p - 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/schedules.py#L1161-L1181 | NEW, verified at tag 2026-10-31
- PyTorch pipelining accepts GPipe, 1F1B, Interleaved1F1B, LoopedBFS, InterleavedZeroBubble, ZBVZeroBubble and DualPipeV by name | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/pipelining/schedules.py#L5227-L5237 | NEW, verified at tag 2026-10-31
- TorchTitan schedules through PyTorch's `get_schedule_class` | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/pipeline_parallel.py#L436-L445 | NEW, verified at tag 2026-10-31
- No Zero Bubble or DualPipe schedule located in Megatron Core's arguments, schedules or MoE guide | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md | U03-6; G2 (wave2-frameworks)
- Megatron's MoE overlap co-schedules one micro-batch's forward with another's backward, which on our reading is DualPipe's overlap applied to expert traffic | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/combined_1f1b.py#L54-L61 | U03-6; G2 (wave2-frameworks) [our reading]
- `--overlap-moe-expert-parallel-comm` and `--delay-wgrad-compute` are off by default and need EP > 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md#L433-L438 and #L561-L564 | U03-6; G2 (wave2-frameworks)

## The split that crosses instances

- bsh per micro-batch per boundary per direction; scatter-gather sends bsh/t per GPU and all-gathers over NVLink | https://arxiv.org/abs/2104.04473v5 (Sec 4.1) | T02-31; W2-22
- 70B, TP 8, 8,192 tokens, micro-batch 1: 16.8 MB per GPU per micro-batch per direction | Calculator C (PP link bytes) | W2-22 [derived]
- p5.48xlarge: 3,200 Gbps EFA, 8 H100, so 50 GB/s per GPU and 0.34 ms | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | W2-22; build-log "Cross-instance pricing" [derived]
- About 134 MB per instance over 400 GB/s, the same 0.34 ms | our arithmetic | build-log "Cross-instance pricing" [derived]
- About 266 ms of compute for a stage's 20 layers at 40% MFU | our arithmetic | W2-22 [derived]
- Megatron's authors use TP within a server and PP across servers because point-to-point is cheaper | https://arxiv.org/abs/2104.04473v5 (Sec 3.2, Takeaway #1) | T02-43; T02-64
- At v = 5, five 16.8 MB slices, 84 MB, about 1.7 ms per micro-batch per direction | Calculator C | T02-30 [derived]
- 70B shapes: hidden 8,192, MLP 28,672, 64 heads, 8 KV heads of dimension 128 | https://arxiv.org/abs/2407.21783v3 (Table 3) | T02-47 (layouts); presets.ts
- 855.6M weights per layer; 5.26e12 FLOPs per GPU per layer per micro-batch; 13.3 ms at 396 TFLOPS | our arithmetic | [derived]
- H100 BF16 1,979 TFLOPS with sparsity, so 989.5 dense | https://www.nvidia.com/en-us/data-center/h100/ | build-log "default MFU"
- 40% MFU is an assumption inside Llama 3 405B's 38% to 43% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47; build-log "default MFU"
- Per step at m = 64: PP traffic 0.04 s (v = 1) and 0.21 s (v = 5) against 17.5 s compute; 17.0 s for the transformer layers alone | Calculator C | W2-43 [derived]

## What a pipeline divides, and what stays on stage 1

- Under 1F1B stage 1 holds L layers' worth whatever p is; interleaving gives L(1 + (p - 1)/(p v)) | https://arxiv.org/abs/2205.05198v1 (Sec 4.2.3) | T02-19; T01-62; W2-23
- Llama 3's first stage used more memory because of the embedding and warm-up micro-batches | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-35
- The last stage holds one micro-batch | our reading of the schedule | W2-54 (calculator) [our reading]
- Table: model state 38.6, 21.0, 12.1 GB per GPU at p = 1, 2, 4; stage 1 activations 22.8 GB throughout; last stage 22.8, 11.4, 5.7 GB | Calculator C (`memory`) | build-log "Activation coefficient" 34 sbh [derived]
- Stage 1 at v = 5: 26.2 GB | Calculator C | W2-23 [derived]
- Megatron (2021): recomputation "required to train reasonably large models with pipeline parallelism" | https://arxiv.org/abs/2104.04473v5 (Sec 3.5) | T02-32; C02-11; W2-24
- Llama 3 405B trained at PP 16 with 8,192-token sequences without activation checkpointing | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2, Table 4) | T02-35; C02-11; W2-24

## Size the bubble for your layout

- Order: smallest p that fits, then raise m or v | our reading | T02-43; W2-25 [our reading]
- Micro-batch size trades the bubble against throughput per GPU and memory | https://arxiv.org/abs/2104.04473v5 (Sec 3.4, Takeaway #3) | T02-44
- Worked: m = 512 / (1 x 8) = 64; 1F1B 4.7%, about 0.8 s of a 17.5 s step; v = 5, 0.94%, about 0.16 s | Calculator C | W2-25; W2-43 [derived]
- Megatron derives m from `--global-batch-size` / (`--micro-batch-size` x DP) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/num_microbatches_calculator.py#L381-L388 | NEW, verified at tag 2026-10-31
- Megatron sets v with `--num-layers-per-virtual-pipeline-stage` or `--num-virtual-stages-per-pipeline-rank` | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3060-L3063 | NEW, verified at tag 2026-10-31
- TorchTitan `num_pp_microbatches` defaults to 1 | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L130-L135 | NEW, verified at tag 2026-10-31
- TorchTitan runs each gradient-accumulation step as its own pipeline step | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/trainer.py#L185-L205 and #L334-L341 | NEW, verified at tag 2026-10-31
- TorchTitan logs a warning, and keeps running, when micro-batches are fewer than stages | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/pipeline_parallel.py#L436-L445 | NEW, verified at tag 2026-10-31
- At m = 1 on four stages the bubble is 3 times the compute, idle three quarters of the time | our arithmetic | [derived]
