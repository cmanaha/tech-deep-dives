# Claims: section 11, Long Sequences: Context Parallelism

File: `src/sections/ContextParallel.tsx`. Re-opened on 2026-10-31, with no identifying headers: the three arXiv papers (Ring Attention 2310.01889v4, DeepSpeed Ulysses 2309.14509v2, Llama 3 2407.21783v3; PDFs and text extraction); at Megatron-LM `core_v0.20.0` the raw `docs/user-guide/features/context_parallel.md`, `docs/user-guide/parallelism-guide.md`, `megatron/core/transformer/moe/README.md`, `megatron/core/parallel_state.py` and `megatron/training/arguments.py`; at DeepSpeed `v0.19.9` the raw `deepspeed/sequence/layer.py`; the NVIDIA H100 and NVLink pages and the EC2 accelerated computing specifications. Every Cite therefore carries the default accessed date, 2026-10-31.

Line corrections against the pinned files: the CP weight-gradient docstring in `parallel_state.py` spans L713-L718 (W2-31 says 714 to 717); Ulysses' communication analysis is Section 3.2 of 2309.14509v2 (T02-22 says 3.1).

Calculator verification, through vite-node on `src/lib/`: Calculator B (`memoryBudget`), Llama 3.1 70B on 32 p5.48xlarge, first pipeline stage, micro-batch 1, ZeRO-1: TP 8 x PP 4 (v = 5) x DP 8 at 8,192 tokens, no recomputation, 37.98 GB; the same at 131,072 tokens 425.79 GB, and 41.32 GB with full recomputation; TP 8 x CP 8 x PP 4 (v = 1) x DP 1, no recomputation, 57.09 GB (63.83 GB with v = 5). Calculator C (`evaluateLayout`), 131,072-token sequences, 4,194,304 tokens per step, 40% MFU, causal attention FLOPs: compute 38.86 s (18.86 s for the same tokens at 8,192); full-recompute layout bubble 15%, step 59.58 to 62.62 s; CP 8 layout bubble 9.4%, step 42.50 to 46.87 s, CP traffic 601.295 GB per instance, 1.503 s, 3.87% of compute. Other derived figures were recomputed in Python.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction (h1)

- h1 description: for 70B at 131,072 tokens on p5.48xlarge, eight-way CP fits without recomputation and its K and V traffic is about 4% of compute even unhidden | derived | Calculator B (57.09 GB), Calculator C (1.503 s / 38.86 s = 3.87%)
- CP splits one training sequence across GPUs; each GPU holds a slice of the tokens and their activations | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25, W2-27
- Activation memory grows about linearly with sequence length | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L32 | T02-25
- 16 times the activations at 131,072 against 8,192 tokens, past an 80 GB H100 | https://www.nvidia.com/en-us/data-center/h100/ | T02-69 (80 GB, vendor specification); 131,072 / 8,192 = 16 [derived]
- Llama 3 trained its 128K-token stage with CP 16 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47, W2-32
- Each token's query must meet the keys and values of all tokens in its sequence, so a slice needs K and V from the others | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25

## What CP divides, and what it leaves whole

- CP partitions inputs and all activations along the sequence; SP splits only dropout and norm activations | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25, W2-27
- Linear layers and norms run unchanged on a slice (L19); each GPU's activation memory falls by the CP degree (L34) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19-L34 | T02-25 (fact check 2026-10-31: the no-inter-token-operations half is on L19)
- CP ranks join the data-parallel group for the weight-gradient all-reduce; CP saves no weight memory | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L713-L718 | T02-26, W2-31
- The distributed optimizer (ZeRO-1 form) shards optimizer state over DP and CP together | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md#L160-L166 | T02-53, W2-31 note (03 W2)
- 70B on 32 p5.48xlarge (256 H100): TP 8 x PP 4 (v = 5) x DP 8 with ZeRO-1 holds about 38 GB at 8,192 tokens and needs about 426 GB at 131,072 | none (section 5 calculator) | Calculator B; W2-10 (256 ranks, 32 instances)
- Memory table: 38.0, 426, 41.3 and 57.1 GB per GPU, with the caption's settings | none | Calculator B
- Recomputation costs about a third more arithmetic per step | none (points to section 5) | section 5 build-log condition; Calculator C factor 4/3
- CP 8 holds 16,384 tokens per GPU and takes its eight ranks from DP (8 to 1 on 256 GPUs) | derived | 131,072 / 8; 256 / (8 x 8 x 4)
- Llama 3: 8,192-token stage DP 128 on 16,384 GPUs, 131,072-token stage CP 16 x DP 8 on the same count, 16 sequences per DP group, 16M tokens per batch | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47, W2-32
- So each Llama 3 CP rank held 8,192 tokens | derived | 131,072 / 16 (our arithmetic)

## Three ways to move keys and values

- Ring Attention: ring of hosts, compute on one K/V block while sending it on; no added time when compute outlasts the transfer, forward and backward | https://arxiv.org/abs/2310.01889v4 (Section 3) | T02-20
- Megatron Core gathers K and V as ring point-to-point transfers and reduce-scatters their gradients in backward | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25
- DeepSpeed-Ulysses: all-to-all before attention gives each GPU the whole sequence for a subset of heads; second all-to-all after | https://arxiv.org/abs/2309.14509v2 (Section 1) | T02-22
- Ulysses communication 4Nh/P per link per layer, constant when N and P grow together | https://arxiv.org/abs/2309.14509v2 (Section 3.2) | T02-22
- DeepSpeed v0.19.9 takes the head count from the key tensor so each query head lands with its KV head | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/sequence/layer.py#L544-L547 | W2-2, U02-2 (closed)
- It rejects a degree above the KV-head count | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/sequence/layer.py#L35-L37 | W2-2
- It splits a count that does not divide evenly unevenly | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/sequence/layer.py#L286-L288 | W2-2
- The file has no KV-head replication path | same file (whole file read) | W2-2 (our reading of the code)
- Every Llama 3.1 size has 8 KV heads, so Ulysses stops at 8 | https://arxiv.org/abs/2407.21783v3 (Table 3) | T02-67, W2-2
- TP splits the same heads: with TP 8 each GPU holds one KV head and Ulysses has nothing left to split | derived | our reading of the code (T02-15, W2-18 for TP's head split)
- Llama 3 all-gathers K and V, exposed; accepted for any-mask support and because GQA makes K and V small, attention O(S^2) against all-gather O(S) | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-24, W2-30
- The document mask had limited impact in standard pre-training and proved important in continued pre-training on very long sequences | https://arxiv.org/abs/2407.21783v3 (Section 3.2) | T02-24 context; re-read 2026-10-31
- 2 x CP chunks, rank i holds chunks i and 2 x CP - 1 - i | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-24, W2-30
- Under a causal mask every rank's pair adds up to 2 x CP + 1 chunks of work | derived | (i + 1) + (2CP - i) (our arithmetic)
- Figure and worked block: ring and all-gather 403 MB per GPU per layer forward (3 blocks of 134 MB); Ulysses 906 MB (503 + 403); full MHA ring 3.2 GB, Ulysses 1.6 GB | derived | inputs T02-67 (hidden 8,192, 8 KV heads x 128); 4cd per block from https://arxiv.org/abs/2310.01889v4 (Section 3)
- Ulysses moves (g + 1)/P of the all-gather's bytes; fewer only when P > g + 1; 70B (g = 8) moves more at every degree it can run; g = 1 gives 2/P | derived | our arithmetic from the two byte formulas
- Megatron Core --cp-comm-type accepts p2p (default), a2a, allgather, a2a+p2p | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3186-L3191 | T02-25

## When the ring hides its transfer

- Block of c tokens: 4dc^2 FLOPs against 4cd bytes; hides when c >= F/B | https://arxiv.org/abs/2310.01889v4 (Section 3) | T02-21, W2-28
- H100 dense BF16 989.5 TFLOPS, half the 1,979 listed with sparsity | https://www.nvidia.com/en-us/data-center/h100/ | T02-69, U02-7 (dense figure not printed; halving is our assumption, stated in the expandable)
- NVLink 450 GB/s per GPU per direction, our reading of 900 GB/s | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70, W2-7
- EFA 3,200 Gb/s per p5.48xlarge, 400 GB/s, 50 GB/s per GPU | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, W2-7; build-log cross-section condition (400 GB/s per instance)
- Thresholds about 2.2K over NVLink and 19.8K over EFA | derived | W2-29 (989.5e12 / 450e9 = 2,199; / 50e9 = 19,790)
- The EFA figure assumes one CP member per instance (TP 8 fills the p5); KV exchange runs between a GPU and its counterparts in other TP groups | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25; orchestrator note on W2-29; our reading
- 70B has 64 query heads and 8 KV heads, so K and V are an eighth of the width; thresholds fall to about 275 and 2.5K | https://arxiv.org/abs/2407.21783v3 (Table 3) | T02-67; 2,199 / 8, 19,790 / 8 [derived]
- At 40% MFU every threshold falls 2.5 times (about 880 and 7.9K full width, 110 and 990 with GQA) | derived | dive-wide 40% MFU assumption; W2-29
- Attention O(S^2) against O(S) for the gather over a whole sequence | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-24
- CP 8 at 131,072 leaves 16,384 tokens per GPU, about 6.6 times 2.5K; CP 4 at 8,192 leaves 2,048, below the threshold at peak, above at 40% | derived | 16,384 / 2,474; our reading
- Section 14's calculator: one all-gather forward (Llama 3's method; Llama 3 Sec 3.3.2 describes only the forward) and one reduce-scatter backward (Megatron's overview L19) per layer per instance; 601 GB per instance per step, 1.5 s at 400 GB/s against 38.9 s, about 4%, unhidden | none (section 14 calculator) | Calculator C
- Megatron Core re-gathers K and V in backward to save memory, about 6% | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-25; 3.87% x 1.5 [derived]
- Expandable: the paper's A100 values, about 1.0K over NVLink at 300 GB/s and 24.5K over InfiniBand at 12.5 GB/s | https://arxiv.org/abs/2310.01889v4 (Section 3, Table 2) | T02-21

## Add CP when the activations do not fit

- Megatron Core recommends CP for long sequences, 8K tokens and more | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L31 ; https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md#L218-L222 | T02-25, T02-42, W2-33
- Llama 3 trained 405B at 8,192 tokens with CP 1 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47, W2-33
- ... and without activation checkpointing | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-35, W2-24
- Megatron Core's own example runs Llama 3 70B at 8,192 tokens on 64 GPUs with CP 2 (TP 4 x PP 4 x CP 2 x DP 2) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L182-L196 | T02-52
- 131,072 tokens, 256 GPUs, 4,194,304 tokens per step: full recomputation about 60 to 63 s, CP 8 about 42 to 47 s, about a quarter less | none (section 14 calculator) | Calculator C
- Recomputation overhead about 30% in Megatron Core's overview | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L32 | T02-25 (lines 19 to 34)
- Bubble 9.4% (3 / 32) against 15% (3 / (5 x 4)) | derived | W2-21 formula (p - 1) / (v m); Calculator C
- NVIDIA reports TP with CP ahead of full recomputation for a 175B GPT (vendor claim) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L29-L34 | T02-25
- Expandable: the calculator charges full recomputation 4/3; E2 measured +14% to +16% step time on one GB10 (unified memory, 1B Llama shape, 2,048 tokens), now with a Tier 0 Cite to E2 (fact check 2026-10-31); at 1.15 the recomputed layout is about 51 to 54 s and the gap about 15% | none (sections 4 and 5) | build-log cross-section condition 'Recomputation price', E2; 38.86 x 1.15 x 1.15 = 51.4 s plus 3.04 s exposed [derived]
- Expandable: CP layout with five chunks 63.8 GB, above the 75% headroom; compute 38.9 s at 131,072 against 18.9 s at 8,192 | none | Calculator B, Calculator C
- Llama 3 orders dimensions TP, CP, PP, DP from innermost to outermost | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-46, W2-4
- With TP 8 on a p5.48xlarge, one GPU of each CP group per instance, each hop at 50 GB/s | derived | T02-68, W2-7; our reading
- Section 14's calculator tries CP degrees up to 8 from 8,192 tokens | none | `src/lib/parallelism.ts` (maxContextParallel default 8, sequence >= 8,192 and divisible by 2c)
