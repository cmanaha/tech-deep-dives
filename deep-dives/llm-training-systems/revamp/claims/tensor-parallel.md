# Claims: section 9, Tensor & Sequence Parallelism

File: `src/sections/TensorParallel.tsx`. Re-opened on 2026-10-31 (raw files at the pinned tags, pages and PDFs via curl with no identifying headers): Megatron-LM at core_v0.20.0 (`megatron/core/tensor_parallel/mappings.py`, `megatron/core/tensor_parallel/layers.py`, `megatron/core/models/gpt/gpt_layer_specs.py`, `megatron/core/transformer/transformer_config.py`, `megatron/core/model_parallel_config.py`, `megatron/training/arguments.py`, `megatron/training/utils/common_utils.py`, `docs/user-guide/parallelism-guide.md`), TorchTitan at v0.4.0 (`torchtitan/config/parallelism.py`, `torchtitan/models/common/config_utils.py`, `torchtitan/models/common/decoder_sharding.py`, `torchtitan/models/llama3/flavors.py`), arXiv 1909.08053v4, 2104.04473v5 and 2205.05198v1 (PDF text searched after NFKC normalisation), the NVIDIA NVLink and H100 pages, the EC2 accelerated computing instance page and the Llama 3.1 70B Hugging Face metadata at its pinned revision. Llama 3 Herd of Models rows are cited from the register without re-opening and carry `accessed="2026-10-30"`. Derived figures were recomputed in Python and against Calculators B and C (`src/lib/memory.ts`, `src/lib/parallelism.ts`) run with Node on a copy of `src/lib`.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction (h1)

- h1 description: 70B over eight GPUs, 0.94 GB per GPU per layer per micro-batch, 2.1 ms on NVLink against 13.3 ms at an assumed 40% MFU | derived; inputs below | W2-17 [derived], build-log "The default MFU"
- Training adds a backward collective per block and SP divides the activations TP leaves whole | https://arxiv.org/abs/1909.08053v4 ; https://arxiv.org/abs/2205.05198v1 | T02-12, T02-16 (cited in the body)
- p5.48xlarge is an EC2 instance with eight NVIDIA H100 GPUs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68 (cited in the body)

## Column, then row: one collective per block in each direction

- MLP: first weight matrix split by columns (nonlinearity local), second by rows (partial sums), one all-reduce combines them | https://arxiv.org/abs/1909.08053v4 (Section 3) | T02-12
- Attention splits by heads: query, key and value projections by columns, output projection by rows | https://arxiv.org/abs/1909.08053v4 (Section 3, Figure 3) | T02-12
- f is copy forward and all-reduce backward; g is all-reduce forward and copy backward; two all-reduces forward and two backward per layer | https://arxiv.org/abs/1909.08053v4 (Figures 3 and 4: "4 total communication operations in the forward and backward pass") | T02-12
- A serving engine runs only the forward pass and pays g alone; training pays f too, doubling the count | our reading of the operator definitions | T02-12 [our reading]
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | T01-3
- 70B: 64 attention heads, 8 KV heads | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1, T02-67
- At TP 8 each GPU holds about 8.8 billion parameters, 8 query heads and 1 KV head | derived: 70,553,706,496 / 8 = 8.82e9; 64 / 8; 8 / 8 | T01-3, T02-67 [derived]
- Megatron Core f and g as autograd functions (forward returns input, backward all-reduces; and the reverse) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/mappings.py#L205-L241 | T02-12; code read 2026-10-31
- Wrapper docstrings "forward: copy, backward allreduce" and "forward: all reduce, backward copy" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/mappings.py#L496-L505 | T02-12; code read 2026-10-31
- Megatron GPT layer: linear_qkv column-parallel, linear_proj row-parallel | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/models/gpt/gpt_layer_specs.py#L423-L425 | code read 2026-10-31
- Megatron GPT layer: linear_fc1 column-parallel, linear_fc2 row-parallel | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/models/gpt/gpt_layer_specs.py#L525-L543 | code read 2026-10-31
- TorchTitan builds each Llama 3 layer from the shared make_gqa_config and make_ffn_config | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/flavors.py#L103-L119 | code read 2026-10-31
- TorchTitan wqkv is ColumnParallelLinear (colwise), wo is RowParallelLinear (rowwise) | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/config_utils.py#L265-L298 | code read 2026-10-31
- TorchTitan fused gate-and-up w13 is ColumnParallelLinear, w2 is RowParallelLinear | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/config_utils.py#L315-L330 | code read 2026-10-31
- Column-parallel backward: all-reduce of grad_input launched with async_op=True ahead of the weight-gradient computation | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L792-L796 | code read 2026-10-31
- allreduce_dgrad is on when TP world size above 1, SP off and grad reduce not disabled | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L1255-L1257 | code read 2026-10-31
- g's forward all-reduce returns the output the next operation reads, so the estimate assumes no overlap | our reading of mappings.py and layers.py | [our reading]

## Traffic that follows the activations and fires in every layer

- TP traffic is 8bsh(t-1)/t elements per layer per GPU per micro-batch | https://arxiv.org/abs/2104.04473v5 (Section 3.2) | T02-13
- The 8 is four all-reduces of b x s x h, each 2(t-1)/t per GPU; h is the only model dimension in the formula | our reading of the formula; all-reduce cost from section 7 | T02-13 [our reading]
- 8 x 1 x 8,192 x 8,192 x 7/8 = 469.8 million elements, 0.9395 GB in BF16 | derived | W2-17 [derived]; Calculator C per-layer value 0.9395 GB
- 450 GB/s per GPU reads NVIDIA's 900 GB/s for fourth-generation NVLink (Hopper) as both directions | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70, W2-7 [vendor claim]
- 0.9395 GB / 450 GB/s = 2.09 ms, a link peak; achieved bus bandwidth not measured in this research | derived | W2-17 [derived]; A1 not yet run
- Layer weights 2 x 8,192^2 + 2 x 8,192 x 1,024 + 3 x 8,192 x 28,672 = 855,638,016 | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1 [derived]; matches `presets.ts` shape
- 6 FLOPs per weight per token (section 4) | section 4 (cross-reference) | T01-14 (via section 4)
- 6 x 855.6e6 x 8,192 / 8 = 5.26e12 FLOPs per GPU | derived | W2-17 [derived]
- H100 BF16 1,979 TFLOPS "with sparsity"; dense 989.5 is half | https://www.nvidia.com/en-us/data-center/h100/ | T02-69 [vendor claim]
- 40% MFU is the dive's assumption; 396 TFLOPS; 13.3 ms; attention FLOPs excluded | derived | W2-17 (the MFU stated next to 13.3 ms as W2-17 requires), build-log "The default MFU", U01-5
- Llama 3 reports 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6
- 2.09 / 13.3 = 15.7%, about 16% with no overlap | derived | W2-17 [derived]
- 320 all-reduces per micro-batch over 80 layers, about 75 GB per GPU (80 x 0.9395) | derived | T02-13 [derived]
- DP reduces gradients once per step, or once per micro-batch when sync is not deferred | section 8 (cross-reference) | build-log "FSDP2 collective counts" (via sections 7 and 8)
- Section 7's pricing method: bytes times frequency compared with compute | section 7 (cross-reference) | Collectives.tsx closing list
- Calculator C, TP 8 x DP 32, ZeRO-1, 32 p5.48xlarge, 512 sequences, 16 micro-batches: TP 1,202.6 GB per GPU per step, 2.672 s, 14.17% of 18.857 s compute (includes attention and output layer) | `src/lib/parallelism.ts` evaluateLayout | Calculator C (run 2026-10-31)
- Measurement that would replace link peaks: nccl-tests on one and two p5.48xlarge | section 7 A1 protocol | A1 (not yet run), RESEARCH-GUIDE section 5

## Why tensor parallelism stops at the instance

- Per-GPU TP traffic barely moves with t while per-GPU compute falls as 1/t, so TP's share grows roughly with t | our arithmetic on 8bsh(t-1)/t | T02-13 [derived]
- TP 16: compute 6.64 ms, traffic 1.007 GB, 2.24 ms at NVLink speed, about 34% | derived | T02-13 [derived]; not priced across instances (see build-log cross-instance pricing)
- TP beyond one node "can be impractical" across slower inter-node links; Takeaway #1 "should generally be used up to degree g when using g-GPU servers", pipeline across servers | https://arxiv.org/abs/2104.04473v5 (Section 3.2) | T02-14
- Sub-optimal TP and PP combinations cost "up to 2x lower throughput, even with high-bandwidth network links between servers" (printed as up to half the throughput) | https://arxiv.org/abs/2104.04473v5 (Section 1) | T02-14 context; re-opened 2026-10-31
- NVIDIA lists 8-GPU NVLink domains for Hopper | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70 [vendor claim]
- p5.48xlarge has 8 H100 GPUs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68
- p5.48xlarge EFA 3,200 Gb/s = 400 GB/s per instance, 50 GB/s per GPU | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, build-log "Cross-instance pricing"
- TP group with one member per instance: 8 groups x 0.9395 GB / 400 GB/s per instance = 18.8 ms, the same as 0.9395 GB / 50 GB/s per GPU; longer than 13.3 ms compute | derived | build-log "Cross-instance pricing" (one member per instance gives the same answer as 50 GB/s per GPU) [derived]
- Section 7's start-up check: the eight ranks of every TP group report one hostname | section 7 (cross-reference) | Collectives.tsx ranks block
- Diagram "One Llama 3.1 70B layer at TP 8": 13.3, 2.1 and 18.8 ms | the three derived rows above | W2-17 [derived]

## Which degrees the attention heads allow

- Megatron Core rejects a config unless attention heads are a multiple of TP and query groups a multiple or divisor of TP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L1746-L1773 | T02-15, W2-18
- Llama 3.1: 32, 64 and 128 attention heads at 8B, 70B and 405B; 8 KV heads at every size | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1, T02-67
- TP 1, 2, 4, 8 and 16 pass both checks for all three; 3 and 6 fail the heads check | derived | T02-15 "use in dive" [derived]

## Sequence parallelism: the same bytes, and the 70B layout fits

- SP splits the norms (and dropout) along the sequence, 1/t of the tokens per GPU | https://arxiv.org/abs/2205.05198v1 (Section 4.2.2) | T02-16
- Reduce-scatter replaces the all-reduce after row-split layers, all-gather replaces the copy before column-split layers, swapped in backward | https://arxiv.org/abs/2205.05198v1 (Section 4.2.2) | T02-16
- Same bytes; "sequence parallelism does not introduce any communication overhead" | https://arxiv.org/abs/2205.05198v1 (Section 4.2.2) | T02-16, W2-19, C02-8
- The full saving adds one all-gather per block: each GPU stores only its slice of the input to the block's first projection and gathers it again in the backward pass, overlapped with the gradient computation | https://arxiv.org/abs/2205.05198v1 (Section 4.2.2, venue MLSys 2023, proceedings.mlsys.org, confirmed 2026-10-31); https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L768-L781 | T02-16, code read 2026-10-31 (fact-check fc03)
- Reduce-scatter plus all-gather measured slower than one all-reduce; 22B layer forward 7.7 ms to 7.2 ms, 6%, from norms and dropout on 1/t of the data | https://arxiv.org/abs/2205.05198v1 (Section 6.2, Table 4) | T02-17, W2-19, C02-8
- Memory is "the primary advantage of using sequence parallelism" | https://arxiv.org/abs/2205.05198v1 (Section 6.2) | T02-17
- 70B, TP 8, s 8,192, b 1, no recomputation: activations 60.06 GB without SP (0.751 GB per layer), 22.48 GB with SP (0.281 GB per layer) | `src/lib/memory.ts` memoryBudget; https://arxiv.org/abs/2205.05198v1 (Table 2) | T02-18, 01 W4, Calculator B (run 2026-10-31)
- About 8 sbh per layer stays replicated without SP for Llama's layer (two norm inputs plus the QKV and MLP inputs; the paper's GPT layer leaves 10 sbh with dropout masks) | https://arxiv.org/abs/2205.05198v1 (Table 2); `memory.ts` replicated = min(8, coefficient) | T02-18, 01 W4 [derived]
- Total per GPU with ZeRO-1 over 32: 99.434 GB without SP (does not fit 80 GB), 61.854 GB with SP (fits, above the 60 GB headroom target, confirmWithMeasuredStep true) | `src/lib/memory.ts` | Calculator B (run 2026-10-31), build-log "Activation coefficient"
- Megatron row-parallel output: reduce-scatter with SP, all-reduce otherwise | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L1698-L1703 | code read 2026-10-31
- Megatron column-parallel forward all-gathers the sequence-split input with SP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L724-L731 | code read 2026-10-31
- Megatron column-parallel backward reduce-scatters grad_input asynchronously with SP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L801-L812 | code read 2026-10-31
- TorchTitan residual stream between blocks is sequence-parallel when enable_sp | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/decoder_sharding.py#L214-L221 | code read 2026-10-31
- Megatron-LM training script disables SP with a warning when TP is 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1339-L1348 | code read 2026-10-31
- --tp-comm-overlap asserts SP is enabled | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1350-L1351 | code read 2026-10-31
- SP diagram: norms and adds at 1/4 of the tokens, all-gather in and reduce-scatter out, swapped in backward | https://arxiv.org/abs/2205.05198v1 (Section 4.2.2) | T02-16 (schematic)

## Set the tensor-parallel degree

- TP at most 8 on p5.48xlarge; 0.94 GB, 2.1 ms against 13.3 ms, about 16%; past the instance the share roughly doubles | rows above | W2-17, W2-20, T02-14
- Heads check restated for Llama 3.1: 1, 2, 4 and 8 pass | rows above | T02-15, W2-18
- TorchTitan v0.4.0: enable_sequence_parallel = True by default, tensor_parallel_degree = 1 | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L72-L76 | W2-20
- Megatron guide: "Always enable when using TP: --sequence-parallel" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L225-L233 | T02-52, W2-20
- Megatron Core config: sequence_parallel defaults to False | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/model_parallel_config.py#L123-L127 | code read 2026-10-31
- Flags --tensor-model-parallel-size and --sequence-parallel shown together in the guide, there with TP size 4 (the dive's 8 is its own layout) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L82-L89 | code read 2026-10-31
- Confirm one host per TP group with section 7's hostname check | section 7 (cross-reference) | Collectives.tsx
- Pre-Blackwell (arch below 10), TP or CP above 1 asserts CUDA_DEVICE_MAX_CONNECTIONS=1 unless Torch FSDP2 or Megatron FSDP or MoE expert-parallel comm overlap is on, which warn instead | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1376-L1405 | code read 2026-10-31
- get_device_arch_version returns the major compute capability (9 Hopper) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/utils/common_utils.py#L621-L623 | code read 2026-10-31
- Column-parallel backward relies on CUDA_DEVICE_MAX_CONNECTIONS=1 to schedule the all-reduce or reduce-scatter before the weight-gradient computation | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L794-L812 | code read 2026-10-31
- Closing pointers to sections 8, 10, 11 and 14 | cross-references | none
- Full recomputation re-runs each layer's forward inside backward, TP collectives included, so a fully recomputed layer moves 12bsh(t-1)/t | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/random.py#L718-L742 | code read 2026-10-31 (our reading)
