# Claims: section 5, The Memory Budget

File: `src/sections/MemoryBudget.tsx`. Papers were re-read on 2026-10-31 from arXiv PDFs via pdftotext (ZeRO, Korthikanti, FlashAttention, DeepSeek-V3, 8-bit optimizers, Muon, Adafactor, Chen, Megatron-LM PTD-P, Llama 3) and code and docs at the pinned tags, so those Cites carry the default accessed date. The NVIDIA H100 and H200 pages, the EC2 accelerated computing page, the Neuron Trainium2 and Trn2 architecture pages and the TorchTitan Neuron doc were not re-opened and carry `accessed="2026-10-30"`. Every byte figure the page prints is computed at render time by Calculator B (`src/lib/memory.ts`) or `modelStateBytes`; the values below were reproduced with an esbuild bundle of the same library.

Format: claim | source URL | register, wave 2 row or experiment

## Header and model state

- Mixed-precision Adam holds 16 bytes per parameter: 2 BF16 weights, 2 BF16 gradients, 12 optimizer (FP32 master, two moments at 4 bytes) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; W1-30
- Megatron-LM accumulates and all-reduces gradients in FP32 for --bf16 unless --grad-reduce-in-bf16 is set | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1121-L1134 | T03-17; W1-49
- Megatron's distributed optimizer table prices FP32 main gradients at 18 bytes per parameter | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | T03-17; W1-49
- Llama 3.1 8B has 8,030,261,248 parameters; 70B has 70,553,706,496 | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b ; https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | T01-3
- 8B at 16 bytes is 128.5 GB, 1.6 times one 80 GB H100 | derived (Calculator B); https://www.nvidia.com/en-us/data-center/h100/ | 01 W2; T01-27; build-log section 3 figure
- 70B needs 1,128.9 GB at 16 bytes and 1,270.0 GB at 18 | derived | W1-19
- Megatron Core's precision-aware optimizer is opt-in, can store the master as a 16-bit remainder beside the BF16 weight and the moments in BF16 or FP8 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/optimizer/optimizer_config.py#L188-L207 ; https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3606-L3624 | W1-50; wave2-step-maths G4
- The FP32 master in the alternative rows belongs to the framework; the optimizer libraries hold only their own state [our reading of the code] | bitsandbytes, PyTorch Muon and Adafactor code below | W1-50; U01-12
- Optimizer table: 16, 18, 14, 12, 10, about 8 bytes; 8B 128.5 / 144.5 / 112.4 / 96.4 / 80.3 / 64.2 GB; 70B 1,128.9 / 1,270.0 / 987.8 / 846.6 / 705.5 / 564.4 GB | derived (optimizerComponents x modelStateBytes) | W1-50
- DeepSeek-V3 keeps AdamW moments in BF16, master weights and gradients in FP32 (14 bytes, our count) | https://arxiv.org/abs/2412.19437v2 (Section 3.3.3) | T01-47; W1-50
- Muon keeps one momentum buffer where AdamW keeps two, for matrix parameters; AdamW handles RMSNorm, LM head and embedding | https://arxiv.org/abs/2502.16982v1 (Sections 2.2, 2.3) | T01-61; W1-50
- PyTorch v2.15.0 Muon allocates its buffer with zeros_like(p.grad), the gradient's dtype; FP32 when stepping an FP32 master [our reading] | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/optim/_muon.py#L160-L163 | wave2-step-maths G4; U01-12
- 8B embedding plus head: 2 x 128,256 x 4,096 = 1.05 billion parameters | derived | T01-2
- 8-bit Adam takes Adam's states from 8 bytes per parameter to 2; paper blocks of 2,048 | https://arxiv.org/abs/2110.02861v2 (Sections 1.1, 2) | T01-59
- bitsandbytes 0.50.2: uint8 states, one FP32 maximum per 256 values, FP32 states under min_8bit_size 4,096, in-place update without its own master | https://github.com/bitsandbytes-foundation/bitsandbytes/blob/0.50.2/bitsandbytes/optim/optimizer.py#L491-L530 | wave2-step-maths G4; U01-12
- Adafactor keeps row and column sums, can drop momentum, "very little auxiliary storage" | https://arxiv.org/abs/1804.04235v1 (Abstract) | T01-60
- PyTorch v2.15.0 Adafactor keeps two factors for matrices, full variance for 1D tensors | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/optim/_adafactor.py#L101-L114 | wave2-step-maths G4
- 8-bit Adam's results are at 1.5B parameters; Adafactor's on translation; no Llama-scale production report located in this research | https://arxiv.org/abs/2110.02861v2 (Abstract) ; https://arxiv.org/abs/1804.04235v1 (Abstract) | T01-59; T01-60; hedge scoped to this research

## Activations and logits

- Korthikanti's method sums the bytes of every saved tensor; sbh(34 + 5as/h) per GPT layer | https://arxiv.org/abs/2205.05198v1 (Section 4.1) | T01-31
- FlashAttention never stores the s x s matrix; keeps output and softmax statistics | https://arxiv.org/abs/2205.14135v2 (Section 3.1) | T01-38
- Llama's layer is 34 sbh (8B) and 33.5 sbh (70B), our derivation | derived (activationCoefficient) | 01 W3; U01-11; W1-7
- Eager attention makes an 8B layer about ten times larger at 8,192 tokens (10.4) and 3.4 times at 2,048 | derived | W1-21
- E1: 34.03 sbh fused SwiGLU, 41.03 eager (21% more), 2.00 full recomputation; unchanged from 2,048 to 8,192 tokens, b = 1 and 2, three attention backends | https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md | E1; build-log "activation coefficient"
- TorchTitan v0.4.0's SwiGLU computes F.silu(gate) * up | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/activation.py#L166-L177 | E1 software notes
- torch.compile not tested for TorchTitan | E1 | E1 scope
- 8B, s = 8,192, b = 1: 36.5 GB across 32 layers at 34 sbh, about 44 GB at 41 sbh | derived (Calculator B: 36.51, 44.02); E1 44.06 | W1-22; E1
- E1 table: 1.142 / 1.377 / 0.067 GB per layer; extra 0.03 sbh is FP32 per-row statistics | E1 | E1
- Meta's reference code upcasts logits with .float() | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/model.py#L308 | W1-38; U01-6
- Megatron Core's default loss upcasts (cross_entropy_loss_fusion False by default) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/cross_entropy.py#L25 ; https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/model_parallel_config.py#L355-L363 | W1-38; wave2-step-maths G2
- Llama 3 vocabulary is 128,256 in code | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/tokenizer.py#L53-L103 | T01-2; C01-1
- FP32 logits 4.2 GB per 8,192-token sequence, 11.5% of the 36.5 GB in the layers | derived | W1-22; T01-35
- Korthikanti treat output-layer activations as negligible beside 5as/h and a 51,200 vocabulary; with a flash kernel and Llama's vocabulary that no longer holds [our reading] | https://arxiv.org/abs/2205.05198v1 (Sections 4.3, 6) | T01-35; C01-3
- Transformer Engine's cross-entropy accepts BF16 logits, saves a BF16 copy plus FP32 per-token statistics: 2.1 GB per sequence | https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/pytorch/cross_entropy.py#L115-L116 ; https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/pytorch/triton/cross_entropy.py#L45-L51 | wave2-step-maths G2; U01-6
- Megatron selects it with --cross-entropy-loss-fusion --cross-entropy-fusion-impl te on Transformer Engine 2.19.0 or later | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1659-L1666 | wave2-step-maths G2
- E1: upcasting head and loss saved 4.27 GB per 8,192-token sequence, peaked 8.5 GB forward and 11.6 GB backward, gradients excluded | E1 | E1; U02-8; build-log "activation coefficient"
- Calculator B budgets 6.3 GB (4.2 FP32 + 2.1 BF16); the rest of the peak is for the headroom [our reading] | derived | calculators-spec Calculator B

## Levers

- ZeRO stage 1: 4 + 12/d; stage 2: 2 + 14/d; stage 3: 16/d bytes per parameter | https://arxiv.org/abs/1910.02054v3 (Section 5) | T02-6
- FSDP is ZeRO stage 3 | https://arxiv.org/abs/1910.02054v3 | T02-8
- Stage 3 adds about 50% to data parallelism's communication volume | https://arxiv.org/abs/1910.02054v3 (Section 1) | T02-7
- Without SP, 8 sbh of Llama's layer stays whole on every TP rank (our count from Table 2) | https://arxiv.org/abs/2205.05198v1 (Table 2) | T01-32; 01 W4
- Full recomputation stores 2 sbh per layer plus one layer's full set | https://arxiv.org/abs/2205.05198v1 (Table 2) ; E1 2.00 | T01-32; E1
- Full recomputation costs one more forward pass, about 33% more FLOPs | https://arxiv.org/abs/2205.05198v1 (Section 6.2) | T01-12; T01-34
- Selective recomputation in Megatron's form saves 70% of GPT-3's activations for 2.7% more FLOPs | https://arxiv.org/abs/2205.05198v1 (Section 5) | T01-33
- Selective added 7% to forward-plus-backward time on the paper's measured layer | https://arxiv.org/abs/2205.05198v1 (Section 6.2) | T01-34
- With a flash kernel the attention-only form saves nothing further; Calculator B counts it as none [our reading] | https://arxiv.org/abs/2205.14135v2 (Section 3.1) | T01-38; src/lib/memory.ts
- A smaller micro-batch divides activations and logits in proportion to b; B = b x m x d | derived | section 3
- CP splits the inputs and every activation along the sequence | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md#L19 | T02-26; W2-27
- CP: all-gather of K and V in forward and backward | pointer to section 11 | T02-24; T03-8
- Under 1F1B the first stage holds p micro-batches of L/p layers, L layers' worth; times 1 + (p - 1)/(p x v) interleaved | https://arxiv.org/abs/2205.05198v1 (Section 4.2.3) | T01-62; T02-19
- Recomputation can cost up to 33% throughput at small batches and raise it up to 2x over the best without it, through a larger batch and smaller bubble | https://arxiv.org/abs/2104.04473v5 (Section 5.6, re-read 2026-10-31) | T02-32; C02-11
- Llama 3: first stage uses more memory, because of the embedding and warm-up micro-batches | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | C02-11
- Diagram and prose totals (H100, s = 8,192, Adam with BF16 gradients, fused SwiGLU, FP32 logits): 8B unsharded 171.3 GB; FSDP 8 58.9; b = 2 101.7; b = 2 full 35.2; 70B TP 8 + SP ZeRO-1 DP 32 61.9; 70B FSDP 256 190.6 without recompute, 23.7 with | derived (Calculator B) | 01 W5; calculators-spec
- Reference lines: 60 GB target, 80 GB H100, 141 GB H200 | https://www.nvidia.com/en-us/data-center/h100/ ; https://www.nvidia.com/en-us/data-center/h200/ ; W1-24 | T01-27; T01-28; W1-24
- Same 70B layout with FP32 main gradients: 79.5 GB; 8B FSDP 8 with eager SwiGLU: 66.4 GB | derived (Calculator B) | T03-17; E1
- Papers report 30% to 40% more execution time for full recomputation | https://arxiv.org/abs/2205.05198v1 (Section 1: "30 - 40%") ; https://arxiv.org/abs/1604.06174v2 (Section 5.4: 30%) | T01-34; T01-36; see note below
- E2: none 2.181 / 2.235 s, 29.6 GB; full 2.536 / 2.552 s, 24.3 GB, +16.3% / +14.2%; selective 2.428 / 2.413 s, 26.0 GB, +11.3% / +8.0% | https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E2-spark-step-time-recompute.md | E2; build-log "recomputation price"
- E2 setup: Llama 3.2 1B shape, s = 2,048, b = 1, four micro-batches, AdamW over FP32 under BF16 autocast, 50 steps first 5 excluded, two runs | E2 | E2
- Reasons for the lower price (unrecomputed work, 28% to 30% of the GEMM ceiling) are our reading; H100 at 8,192 tokens pushes toward the FLOP cost [our reading] | E2 | E2 interpretation
- Selective bought back 68% of the memory saving for 56% to 69% of the time cost | derived from E2 (3.7 / 5.4 GB; 11.3 / 16.3, 8.0 / 14.2) | E2
- HFU counts recomputation, MFU does not | pointer to section 4 | W1-9; T01-21

## Beyond the formula

- ZeRO residual memory: fused flattened buffers, possibly FP32, 6 GB for a 1.5B model; fragmentation out-of-memory with over 30% free in extreme cases | https://arxiv.org/abs/1910.02054v3 (Section 3.2) | T01-11
- PyTorch's caching allocator keeps freed memory so nvidia-smi shows it as used | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/cuda.md#L534-L542 | T01-63
- PYTORCH_ALLOC_CONF primary, PYTORCH_CUDA_ALLOC_CONF an alias for backward compatibility | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/cuda.md#L557-L566 | T01-63; U01-8
- expandable_segments is experimental, off by default, one growing segment per stream to avoid slivers | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/cuda.md#L630-L662 | T01-63
- TorchTitan 70B: TP 8 x FSDP 32, 256 H100s with 96 GB, Float8, local batch 16, full recomputation, 67.6 to 71.9 GiB (72.6 to 77.2 GB); no sequence length stated | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L10-L53 | T02-50; W1-23; U02-8
- Calculator B gives 43.0 GB for that layout in BF16 at 8,192 tokens; gap is a reminder, not a correction factor | derived (Calculator B) | W1-23 (register's 39 GB counts FP32 logits only; Calculator B adds the BF16 source, 6sbV)
- Headroom target 75%, 60 GB of 80 GB; no source states one [our reading] | derived | W1-24
- A2 protocol (not yet run): TorchTitan v0.4.0, FSDP 8, flat FSDP 16, HSDP shard 8 replicate 2, with and without deferred reduction, 8 micro-batches at 8,192; tokens/s, MFU vs 989.5, peak memory, EFA bytes; about 3 hours | RESEARCH-GUIDE.md section 5 (GUIDE_URL) | A2; U02-8; U01-5
- A2 prediction: 58.9 GB fused, 66.4 GB eager; measured peak above [our reading, not a result] | derived (Calculator B) | A2
- A2 cost: 2 x 7 x $55.04 = $771 On-Demand us-east-1 2026-10-30; $2,292 one-day Capacity Block at $47.757 per instance-hour; charged at the price at purchase | RESEARCH-GUIDE section 5; https://aws.amazon.com/ec2/capacityblocks/pricing/ | T05-20; T05-22; build-log "AWS experiments"

## Calculator B

- Formulas: model state N/(t x p) x bytes with ZeRO division; activations coefficient x (s/c) x b x h with SP split; first stage L/p x min(p, m) x interleave; full recompute 2 sbh per layer plus one layer; logits (4 + 2) sbV/t or 2 sbV/t; fits and flag | src/lib/memory.ts | calculators-spec Calculator B; 01 W4; T01-62
- Model shapes from Llama 3 Table 3 | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1; T01-4
- Memory per rank: AWS in GiB, NVIDIA in GB, the smaller taken | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html ; https://www.nvidia.com/en-us/data-center/h200/ | C02-7; C05-2; T02-68; T05-2; T05-3; T05-5; T01-28
- Trainium2 96 GiB per chip, 16 chips per trn2.48xlarge, 64 ranks under TorchTitan, so 24 GiB per logical NeuronCore rank | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html ; https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html ; https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst | T01-30; T05-10; T03-38
- Next action: read max_memory_allocated against the total and max_memory_reserved for the allocator's slack | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/cuda/memory.py#L543-L606 | T07-3
- Section 14 runs the same check for every layout | pointer | build-log "activation coefficient"

## Open items for the fact check

- build-log "Recomputation price" says "the papers' 25% to 40% stays theirs". No paper read states 25%: Korthikanti's intro says "30 - 40%", Chen says 30%, ZeRO quotes 33%. The page prints 30% to 40%; the build-log line should read the same.
- U02-8 stays a hedge; A2 (not yet run) would close it for H100.
- U01-12: Megatron Core's Muon state layout lives in the external `emerging_optimizers` package and was not read; the Muon row rests on the paper and PyTorch v2.15.0.
