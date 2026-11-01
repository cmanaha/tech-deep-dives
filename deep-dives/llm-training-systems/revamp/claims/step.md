# Claims: section 3, One Training Step: What It Computes and Keeps

File: `src/sections/TrainingStep.tsx`. Every source below was re-opened on 2026-10-31 (arXiv PDFs via pdftotext, pages and raw files at the pinned tags), so every Cite carries the default accessed date. Derived figures were recomputed in Python from the inputs named.

Format: claim | source URL | register, wave 2 row or experiment

## Two passes and one update

- Forward pass costs about 2 FLOPs per parameter per token (one multiply and one add per weight per token) | https://arxiv.org/abs/2204.02311v5 (Appendix B; venue JMLR 2023, https://jmlr.org/papers/v24/22-1144.html) | T01-18; W1-37
- Backward pass computes gradients with respect to both the layer's input and its weights | https://arxiv.org/abs/2104.04473v5 (Appendix: Floating-point operations) | T01-17
- Backward pass costs about 4 FLOPs per parameter per token; two matmuls for each forward matmul | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; W1-37
- A step costs about 6N FLOPs per token | https://arxiv.org/abs/2001.08361v1 (Section 2.1) | T01-14; W1-37
- Mixed-precision Adam's optimizer state is an FP32 master copy plus two moments (stated in the optimizer bullet; cited in the model-state bullet) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; T01-10; W1-30
- Llama 3.1 8B has N = 8,030,261,248 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b | T01-3
- One 8,192-token sequence of 8B: 2N x s = 1.32e14 forward, 4N x s = 2.63e14 backward, 6N x s = 3.95e14 total; 6N = 4.82e10 per token | derived | 02 section 3.3; W1-5; W6-9
- About 1.0 s of one H100 at 40% MFU (3.95e14 / (989.5e12 x 0.40) = 0.997 s) | derived | W1-6
- H100 BF16 is listed at 1,979 TFLOPS "with sparsity"; the dense peak used is half, 989.5 TFLOPS (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T01-27; T05-14; W1-16
- 40% MFU is an assumption inside Llama 3 405B's 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2, Table 4) | T01-6; build-log "default MFU"
- 430 TFLOPS per GPU at 43% MFU implies a denominator of about 1,000 TFLOPS | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6 (use in dive, derived)
- Attention matmuls add 12 x L x H x Q x T FLOPs per token (PaLM's count, full score matrix) | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; C01-2
- For 8B at 8,192 tokens the attention term is 1.29e10 per token; the sequence costs 5.00e14 (27% more) without a causal discount and 4.48e14 (13% more) with one | derived | W1-5

## What the step keeps, and for how long

- Mixed-precision Adam holds 16 bytes per parameter: 2 weights, 2 gradients, 12 optimizer (FP32 master and two moments, 4 bytes each) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; W1-30
- Llama 3.1 8B model state is 128.5 GB, 1.6 times one 80 GB H100 | derived; https://www.nvidia.com/en-us/data-center/h100/ (80 GB) | 01 W2; W1-3; T01-27
- Activations per layer are a multiple of s x b x h | https://arxiv.org/abs/2205.05198v1 (Section 4.1) | T01-31
- A FlashAttention-style kernel never stores the s x s attention matrix; it keeps the output and softmax statistics | https://arxiv.org/abs/2205.14135v2 (Section 3.1) | T01-38
- About 34 sbh bytes per layer for Llama's layer with a FlashAttention-style kernel and a fused SwiGLU, our derivation | derived | 01 W3; W1-7; U01-11
- Measured on one GB10 (one run, PyTorch 2.15.0): 34.03 sbh fused SwiGLU, 41.03 sbh eager SwiGLU, 2.00 sbh full recomputation; same at s = 2,048 to 8,192, b = 1 and 2, and across FlashAttention, cuDNN and memory-efficient backends; the 0.03 is FP32 per-row statistics | https://github.com/cmanaha/tech-deep-dives/blob/b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3/deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md | E1; build-log "activation coefficient"
- TorchTitan v0.4.0's SwiGLU computes F.silu(gate) * up | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/activation.py#L166-L177 | E1 software notes (code re-read 2026-10-31)
- TorchTitan v0.4.0's Llama 3 config wraps that function in a torch.compile region by default; whether the compiled region stores 34 or 41 sbh was not tested | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py#L87-L89 (`local_compile_regions` default includes "fused_binary_activation"; activation.py L34-L35 is that region) | fc02 finding; E1 L59 ("before any compilation"); section 5 words it the same
- 8B, 32 layers, s = 8,192, b = 1: 36.5 GB of activations at 34 sbh, 44.0 GB at 41 sbh (41 x 8,192 x 4,096 x 32 = 44.02e9 B) | derived; E1 URL above | 01 W4; E1 whole-model table (36.54 and 44.06 GB at the measured 34.03 and 41.03)
- 128.5 + 36.5 = about 165 GB, twice 80 GB; a p5.48xlarge has eight H100s | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68; derived
- A 1.5B GPT-2 at sequence 1K and batch 32 needs about 60 GB of activations against at least 24 GB of model state | https://arxiv.org/abs/1910.02054v3 (Sections 3.1 and 3.2) | T01-12; T01-9
- Temporary buffers and fragmentation consume memory beyond model state and activations | https://arxiv.org/abs/1910.02054v3 (Section 3.2) | T01-11
- Korthikanti: sbh(34 + 5as/h) for a GPT layer at 2 bytes per 16-bit element; 5as/h is the attention matrix and softmax | https://arxiv.org/abs/2205.05198v1 (Section 4.1) | T01-31; T01-33
- Llama layer derivation: attention 8sbh + 4,096sb; MLP 4sbh + 6sbF with F = 14,336; total 34 sbh (8B); eager adds 2sbF for 41; 33.5 sbh for 70B | derived | 01 W3
- Coefficients are byte counts set by model code and PyTorch version, so read as carrying to H100; peak memory also depends on allocator and workspaces (not measured) | E1 URL above | E1 "What the dive uses" (our reading, labelled)
- Output head at s = 8,192 with FP32 logits: 4.27 GB saved; transient peaks 8.5 GB forward and 11.6 GB backward, gradients excluded | E1 URL above | E1; build-log "activation coefficient"
- Diagram caption: with accumulation, forward and backward repeat per micro-batch before one update and the activation peak repeats | derived (our reading) | T01-52; 01 W4 ("one micro-batch in flight per layer")

## Micro-batch, accumulation and the global batch

- B = b x m x d (m = (1/b)(B/d)); the accelerators number p x t x d (the paper's n; the page does not use n for it, since the dive's n is the ranks in one collective) | https://arxiv.org/abs/2104.04473v5 (Section 3.1) | T01-52; W1-8
- Llama 3 405B 8,192-GPU stage: DP 64, 32 sequences per DP, 8,192 tokens: 16.8M tokens, Table 4's "16M" | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6; W1-8
- For a fixed B, a smaller b with a larger m holds fewer activations at once, at more and smaller passes per update | derived (our reading, labelled) | T01-52; T01-31

## Notation

- Llama 3.1 8B: L = 32, h = 4,096, a = 32 with 8 key-value heads | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1
- V = 128,256: the tokenizer adds 256 special and reserved tokens to the base vocabulary; the paper's Table 3 prints 128,000 | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/tokenizer.py#L53-L103 ; https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-2
- D = 15T+ for Llama 3.1 | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md | T01-7
- 18 bytes per parameter with BF16 weights and FP32 main gradients (Megatron Core's table; no default claimed); cited on the "Model state" line of "Your model's two bills", no longer a notation row, so the notation table lists the same 17 symbols as section 32 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | T03-17; W1-19
- Symbol list N, D, s, b, m, d, B, L, h, a, V, t, p, v, n, r_f, w_cp as defined | SCOPE.md section 3 block | R1 finding 4

## Why a 16-bit run keeps a 32-bit copy

- Mixed precision computes in 16 bits on a 16-bit copy and updates an FP32 master | https://arxiv.org/abs/1710.03740v3 (Section 3.1) | T01-39; W1-36
- FP16 has 10 mantissa bits; an update more than about 2,048 times smaller than its weight becomes zero when added | https://arxiv.org/abs/1710.03740v3 (Section 3.1) | T01-39; W1-36
- BF16 is 1, 8, 7 bits with FP32's range, trains without loss scaling, and updates an FP32 copy of the weights | https://arxiv.org/abs/1905.12322v3 (Section 3, Table 1) | T01-41
- BF16's threshold is about 256 by the same reasoning (2^8) | derived (our arithmetic, labelled) | T01-39 (use in dive)

## Your model's two bills

- Llama 3.1 70B: N = 70,553,706,496 | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | T01-3
- Llama 3.1 70B: L = 80, h = 8,192 | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1
- 70B: 6N = 4.23e11 per token; 3.47e15 per 8,192-token sequence; about 8.8 s at 40% MFU on 989.5 TFLOPS | derived | W6-9; 02 section 3.2 (11.68 s with recomputation x 3/4 = 8.76 s, W2-51)
- 70B model state 1,128.9 GB, 14.1 times one 80 GB H100 | derived | W1-19; W3-21 (80 GB decimal basis)
- 70B activations at s = 8,192, b = 1: 179.9 GB at 33.5 sbh, our derivation, not measured | derived | 01 W4; W2-51
- 16N bytes with 16-bit gradients, 18N with FP32 main gradients; 6N x B x s FLOPs per step; 34 sbh x L activations (41 eager) | as cited above | T01-9; T03-17; T01-14; E1

## Uncited by design (definitions and pointers)

- Adam's two moments are running averages of each gradient and of its square (definition) | none | R1 finding 11 gloss
- Section cross-references (4, 5, 6, 7, 8, 9, 10, 14, 17, 18, 32) and the link to the Silicon, Memory and Modern Inference dive, section 27: Quantization and Precision | navigation | authoring brief

## Acronyms expanded in this file

FLOPs, MFU, TFLOPS, BF16, FP32, ZeRO, MLP, RMSNorm (root mean square normalization), SiLU (sigmoid linear unit); FP16 glossed ("the older 16-bit format"); SwiGLU glossed as Llama's gated MLP. Provenance line names TorchTitan v0.4.0, Megatron Core core_v0.20.0 and llama-models v0.2.0.
