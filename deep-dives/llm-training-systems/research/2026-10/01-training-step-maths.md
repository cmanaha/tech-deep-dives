# 01 The training step and its maths: research register

## 1. Header

- **Research date:** 2026-10-30. Every URL in this file was accessed 2026-10-30.
- **Area:** 01 of the "LLM training systems" dive. What one training step computes and what state persists between steps; FLOPs per token (6N, the attention term, the Megatron-LM formula, recomputation); MFU and HFU and the peak FLOPS to divide by; the per-GPU memory budget (weights, gradients, optimizer states, activations, buffers) with worked numbers for Llama 3.1 8B and 70B; mixed precision (FP16 with loss scaling, BF16, FP8, MXFP8, NVFP4); activation checkpointing; gradient accumulation, global batch and critical batch size; scaling-law intuition as far as it drives accelerator-hours; optimizers that change the memory budget.
- **Out of scope here (link, do not re-research):** parallelism mechanics and the "set my ranks" procedure (register 02, `02-parallelism.md`); what each parallelism puts on the wire and Trainium multi-node instances (`deep-dives/efa/src/sections/AIMLTraining.tsx`); HBM, roofline and inference precision formats (`deep-dives/silicon-memory-inference/src/sections/QuantizationAndPrecision.tsx`); MoE sparsity for inference (`deep-dives/silicon-memory-inference/src/sections/MoeAndSparseActivation.tsx`); Trainium chips (`deep-dives/silicon-memory-inference/src/sections/AwsCustomSilicon.tsx`); instance specifications and prices (register 05); checkpoint bytes and write bandwidth (register 04); MFU as an observed metric (register 07).
- **Reader:** ex-EC2/Compute Tech Lead, now WW SA Lead for Startups at AWS; strong on systems, networking, GPUs and inference; has not run large-scale distributed training.
- **Quote policy:** quotes are verbatim from the pinned version, fetched with `curl` or extracted from the arXiv PDF with `pdftotext`, with house-style normalisation: curly quotes become straight quotes, typographic dashes become " - ", inline maths is shown as plain text, ellipses mark omissions. Where a quote could only be seen through a WebFetch summary, the entry says "quote via WebFetch summary, not verified verbatim".
- **Verdicts:** NEW (recorded fresh from the primary source); CORRECT (a commonly repeated claim the primary source confirms); WRONG (a commonly repeated claim the primary source contradicts, with the true statement); STALE (true for an older version, with the boundary); UNKNOWN (unresolved, see section 6).
- **Arithmetic:** any number not printed in a source is labelled [derived] with its inputs and the entry IDs they come from. Section 3 shows every step.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-char SHA; official framework documentation; first-party NVIDIA and AWS documentation and spec sheets (a spec-sheet peak FLOPS figure is a vendor specification); first-party model cards and repository metadata |
| Tier 2 | First-party lab or vendor blog posts and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed; otherwise "preprint"), including first-party lab technical reports; third-party technical analysis |
| Tier 4 | Tutorials, summaries, press. Used only to locate primary sources |

Code over docs over blogs. Vendor and author performance numbers are claims, not measurements.

**Evidence kinds:** definition, formula, documentation of support, default value, benchmark claim (author or vendor reported), ablation, production report, code behaviour, vendor specification.

### Pinned sources

All accessed 2026-10-30.

**Papers (arXiv ID with version; venue as confirmed)**

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 2407.21783v3 | The Llama 3 Herd of Models | preprint, first-party lab technical report (no journal reference on the arXiv abstract page) | T01-1, T01-5, T01-6, T01-8, T01-55, T01-57, T01-62 |
| 1910.02054v3 | ZeRO: Memory Optimizations Toward Training Trillion Parameter Models | preprint (no venue on the arXiv abstract page) | T01-9 to T01-12; W2 |
| 2203.15556v1 | Training Compute-Optimal Large Language Models (Chinchilla) | preprint, first-party lab | T01-13, T01-16, T01-56 |
| 2001.08361v1 | Scaling Laws for Neural Language Models | preprint, first-party lab | T01-14, T01-15 |
| 2104.04473v5 | Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM | peer-reviewed, SC 2021 (arXiv comments "Accepted to SC 2021") | T01-17, T01-22, T01-23, T01-37, T01-52 |
| 2204.02311v5 | PaLM: Scaling Language Modeling with Pathways | preprint, first-party lab | T01-18 to T01-20 |
| 2205.05198v1 | Reducing Activation Recomputation in Large Transformer Models | preprint | T01-17, T01-21, T01-31 to T01-35, T01-62 |
| 2402.15627v1 | MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs | preprint (acknowledgements thank NSDI reviewers; venue not confirmed) | T01-24, T01-25 |
| 2412.19437v2 | DeepSeek-V3 Technical Report | preprint, first-party lab | T01-26, T01-46, T01-47 |
| 1604.06174v2 | Training Deep Nets with Sublinear Memory Cost | preprint | T01-36 |
| 2205.14135v2 | FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness | preprint (venue not confirmed on the arXiv page) | T01-38 |
| 1710.03740v3 | Mixed Precision Training | peer-reviewed, ICLR 2018 (arXiv comments) | T01-39, T01-40 |
| 1905.12322v3 | A Study of BFLOAT16 for Deep Learning Training | preprint | T01-41 |
| 2209.05433v2 | FP8 Formats for Deep Learning | preprint | T01-42, T01-43 |
| 2310.10537v3 | Microscaling Data Formats for Deep Learning | preprint | T01-48 |
| 2509.25149v2 | Pretraining Large Language Models with NVFP4 | preprint, first-party vendor (NVIDIA) | T01-49, T01-50 |
| 1812.06162v1 | An Empirical Model of Large-Batch Training | preprint, first-party lab | T01-53, T01-54 |
| 2110.02861v2 | 8-bit Optimizers via Block-wise Quantization | peer-reviewed, ICLR 2022 (arXiv comments "ICLR2022 spotlight version") | T01-59 |
| 1804.04235v1 | Adafactor: Adaptive Learning Rates with Sublinear Memory Cost | preprint | T01-60 |
| 2502.16982v1 | Muon is Scalable for LLM Training | preprint, first-party lab | T01-61 |

**Code and repository metadata (tag or revision, 40-char SHA)**

| Repository | Tag or revision | SHA | Files read | Entries |
|---|---|---|---|---|
| meta-llama/llama-models | v0.2.0 (annotated; peeled SHA) | 5fdf83110cc9daa7435dfba6eb304892cc0041b8 | `models/llama3_1/MODEL_CARD.md`, `models/llama3/args.py`, `models/llama3/model.py`, `models/llama3/tokenizer.py` | T01-2, T01-3, T01-4, T01-7, T01-35; W1 |
| Hugging Face meta-llama/Llama-3.1-8B (model API metadata; files gated) | revision | d04e592bb4f6aa9cfee91e2e20afa771667e1d4b | `https://huggingface.co/api/models/meta-llama/Llama-3.1-8B` (`safetensors.parameters`) | T01-3 |
| Hugging Face meta-llama/Llama-3.1-70B (model API metadata; files gated) | revision | 349b2ddb53ce8f2849a6c168a81980ab25258dac | `https://huggingface.co/api/models/meta-llama/Llama-3.1-70B` | T01-3 |
| Hugging Face meta-llama/Llama-3.1-405B (model API metadata; files gated) | revision | b906e4dc842aa489c962f9db26554dcfdde901fe | `https://huggingface.co/api/models/meta-llama/Llama-3.1-405B` | T01-3 |
| NVIDIA/TransformerEngine | v2.21.0 (annotated; peeled SHA) | 7457e47d26d9d02dfb783007335dfbe75e1b90a8 | `transformer_engine/common/recipe/__init__.py`, `transformer_engine/pytorch/quantization.py` | T01-44, T01-45 |
| pytorch/pytorch | v2.15.0 | 31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457 | `docs/source/notes/cuda.md` | T01-63 |

**Documentation (unversioned web pages)**

- https://www.nvidia.com/en-us/data-center/h100/ (T01-27) [vendor specification]
- https://www.nvidia.com/en-us/data-center/h200/ (T01-28) [vendor specification]
- https://www.nvidia.com/en-us/data-center/hgx/ (T01-29) [vendor specification]
- https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html, read while the site banner announced Neuron 2.33.0 (T01-30) [vendor specification]
- https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html, same release (T01-51) [vendor specification]

**Cross-file inputs (not re-researched):** register 02 (`02-parallelism.md`) owns ZeRO stage mechanics, TP/SP/PP/CP communication and the rank-setting procedure; register 04 owns Llama 3's interruption table and checkpoint bytes; register 05 owns instance specifications and prices; register 07 owns MFU and memory as monitored metrics.

---

## 2. Claim register

### A. The reference models: architecture, compute and published run figures

**T01-1. Llama 3 8B, 70B and 405B are dense Transformers with 32, 80 and 126 layers; model dimension 4,096, 8,192 and 16,384; FFN dimension 14,336, 28,672 and 53,248; 32, 64 and 128 attention heads; 8 key/value heads (GQA) in all three; SwiGLU; vocabulary listed as 128,000; RoPE base 500,000.**
- Location: 2407.21783v3, Sec 3.2, Table 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab technical report) | definition | Table 3 rows: "Layers 32 80 126", "Model Dimension 4,096 8192 16,384", "FFN Dimension 14,336 28,672 53,248", "Attention Heads 32 64 128", "Key/Value Heads 8 8 8", "Activation Function SwiGLU", "Vocabulary Size 128,000", "Positional Embeddings RoPE (θ = 500, 000)". Caption: "Overview of the key hyperparameters of Llama 3. We display settings for 8B, 70B, and 405B language models." Text: "We use grouped query attention (GQA; Ainslie et al. (2023)) with 8 key-value heads to improve inference speed and to reduce the size of key-value caches during decoding." (accessed 2026-10-30)
- Use in dive: the architecture inputs to every worked number in section 3 and to both calculators (memory budget, parallelism sizing). Practical to know. Head dimension is 128 for all three [derived: 4,096/32 = 8,192/64 = 16,384/128 = 128].

**T01-2. The vocabulary the code builds is 128,256 entries, not the 128,000 the paper's Table 3 prints: the tokenizer appends 256 special and reserved tokens to the base BPE ranks.**
- Location: meta-llama/llama-models v0.2.0, `models/llama3/tokenizer.py` lines 53 and 70 to 103; paper 2407.21783v3 Sec 3.2 (the 128K base vocabulary).
- Verdict: NEW
- Evidence: https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/tokenizer.py | Tier 1, code | code behaviour | `num_reserved_special_tokens = 256`; `num_base_tokens = len(mergeable_ranks)`; `self.n_words: int = num_base_tokens + len(special_tokens)`. Paper: "We use a vocabulary with 128K tokens. Our token vocabulary combines 100K tokens from the tiktoken3 tokenizer with 28K additional tokens to better support non-English languages." (accessed 2026-10-30)
- Use in dive: practical. The calculator must use V = 128,256 or its embedding and logit numbers drift. Confirmed independently by T01-3: the published parameter counts only reconcile with V = 128,256 [derived].

**T01-3. Meta's Hugging Face repositories report exact parameter counts of 8,030,261,248 (Llama 3.1 8B), 70,553,706,496 (70B) and 405,853,388,800 (405B), all stored as BF16. Table 3's shapes with V = 128,256 and an untied output head reproduce all three counts exactly [derived].**
- Location: Hugging Face model API, field `safetensors.parameters`, at the revisions in the pinned-source table; reconciliation in section 3, W1.
- Verdict: NEW
- Evidence: https://huggingface.co/api/models/meta-llama/Llama-3.1-8B (revision d04e592bb4f6aa9cfee91e2e20afa771667e1d4b), https://huggingface.co/api/models/meta-llama/Llama-3.1-70B (revision 349b2ddb53ce8f2849a6c168a81980ab25258dac), https://huggingface.co/api/models/meta-llama/Llama-3.1-405B (revision b906e4dc842aa489c962f9db26554dcfdde901fe) | Tier 1, first-party repository metadata | definition | `{'parameters': {'BF16': 8030261248}, 'total': 8030261248}`, `{'parameters': {'BF16': 70553706496}, 'total': 70553706496}`, `{'parameters': {'BF16': 405853388800}, 'total': 405853388800}`. The `config.json` files are gated ("Access to model meta-llama/Llama-3.1-8B is restricted. You must have access to it and be authenticated to access it.") and were not read. The output head is a separate weight in code: `self.output = ColumnParallelLinear(params.dim, params.vocab_size, ...)` (`models/llama3/model.py` line 271 at v0.2.0). (accessed 2026-10-30)
- Use in dive: the N in every 16N-bytes and 6N-FLOPs figure. Practical. Embedding plus output head is 1.05B of the 8B model's 8.03B (13.1%) and 2.10B of the 70B model's 70.55B (3.0%) [derived, section 3 W1]: the "8B" label hides a large embedding share, which matters for the 6N rule (T01-14, section 3 W1).

**T01-4. Llama 3's FFN width comes from a formula in code: hidden = multiple_of x ceil(ffn_dim_multiplier x int(2 x 4d / 3) / multiple_of), and the SwiGLU block has three weight matrices (w1, w2, w3), so the FFN holds 3 x d x ffn parameters, not the 2 x d x 4d of a GeLU MLP.**
- Location: meta-llama/llama-models v0.2.0, `models/llama3/model.py` lines 205 to 239.
- Verdict: NEW
- Evidence: https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/model.py | Tier 1, code | code behaviour | "hidden_dim = int(2 * hidden_dim / 3)", "if ffn_dim_multiplier is not None: hidden_dim = int(ffn_dim_multiplier * hidden_dim)", "hidden_dim = multiple_of * ((hidden_dim + multiple_of - 1) // multiple_of)", "self.w1 = ColumnParallelLinear(dim, hidden_dim, ...)", "self.w2 = RowParallelLinear(hidden_dim, dim, ...)", "self.w3 = ColumnParallelLinear(dim, hidden_dim, ...)", "return self.w2(F.silu(self.w1(x)) * self.w3(x))", called with "hidden_dim=4 * args.dim". The per-model `ffn_dim_multiplier` and `multiple_of` values are not in this repository at v0.2.0 (U01-1); Table 3 (T01-1) gives the resulting widths, which is all the calculators need. (accessed 2026-10-30)
- Use in dive: mental model for why the GPT-3-era formulas (Megatron's 24h^2 per layer, the 34sbh activation term) need adapting for Llama: the FFN is 3.5h wide with three matrices, attention uses GQA. Section 3 W1 (parameters) and W3 (activations) do the adaptation.

**T01-5. Llama 3 405B was sized for a 3.8 x 10^25 FLOPs pre-training budget and trained on 15.6T text tokens, on up to 16K H100 GPUs (700 W TDP, 80 GB HBM3), eight GPUs per server joined by NVLink.**
- Location: 2407.21783v3, Sec 1, Sec 3.2 and Sec 3.3.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab) | production report | "we pre-train a model with 405B parameters on 15.6T tokens"; "This leads to a model size that is approximately compute-optimal according to scaling laws on our data for our training budget of 3.8 × 10^25 FLOPs."; "Llama 3 405B is trained on up to 16K H100 GPUs, each running at 700W TDP with 80GB HBM3, using Meta's Grand Teton AI server platform ... Each server is equipped with eight GPUs and two CPUs. Within a server, the eight GPUs are connected via NVLink." Footnote: "Note that we use only up to 16K of these 24K GPUs for Llama 3 pre-training." (accessed 2026-10-30)
- Use in dive: the anchor for the 6ND check in section 3 W7. Mental model: 6 x 405.9B x 15.6T = 3.80 x 10^25 [derived], so the paper's budget is the 6ND rule to two significant figures.

**T01-6. Llama 3 405B's published parallel configurations and BF16 MFU: 8,192 GPUs at TP 8, CP 1, PP 16, DP 64, sequence 8,192, 430 TFLOPs/GPU, 43% MFU; 16,384 GPUs at DP 128, 400 TFLOPs/GPU, 41%; 16,384 GPUs at CP 16, DP 8, sequence 131,072, 380 TFLOPs/GPU, 38%. Tokens per batch is 16M in all three.**
- Location: 2407.21783v3, Sec 3.3.2, Table 4 and the "GPU utilization" paragraph.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab) | production report | Table 4 header "GPUs TP CP PP DP Seq. Len. Batch size/DP Tokens/Batch TFLOPs/GPU BF16 MFU", rows "8,192 8 1 16 64 8,192 32 16M 430 43%", "16,384 8 1 16 128 8,192 16 16M 400 41%", "16,384 8 16 16 8 131,072 16 16M 380 38%". "we achieve an overall BF16 Model FLOPs Utilization (MFU; Chowdhery et al. (2023)) of 38-43% for the configurations shown in Table 4. The slight drop in MFU to 41% on 16K GPUs with DP=128 compared to 43% on 8K GPUs with DP=64 is due to the lower batch size per DP group needed to keep the global tokens per batch constant during training." (accessed 2026-10-30)
- Use in dive: the reference MFU for a dense model on H100 at scale, and its conditions. Practical: 430/0.43 = 1,000 TFLOPs implies Meta divided by roughly the H100 SXM dense BF16 peak (T01-27) [derived]. Register 02 owns the parallel layout.

**T01-7. The Llama 3.1 model card reports 39.3M H100-80GB GPU-hours in total: 1.46M for 8B, 7.0M for 70B and 30.84M for 405B. The figure is "the total GPU time required for training each model", which the card does not split into pre-training and post-training.**
- Location: meta-llama/llama-models v0.2.0, `models/llama3_1/MODEL_CARD.md` lines 102 to 166 ("Hardware and Software", "Training Energy Use" table).
- Verdict: NEW
- Evidence: https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3_1/MODEL_CARD.md | Tier 1, first-party model card | production report | "Training utilized a cumulative of **39.3**M GPU hours of computation on H100-80GB (TDP of 700W) type hardware, per the table below. Training time is the total GPU time required for training each model and power consumption is the peak power capacity per GPU device used, adjusted for power usage efficiency." Table rows: "Llama 3.1 8B 1.46M 700", "Llama 3.1 70B 7.0M 700", "Llama 3.1 405B 30.84M 700", "Total 39.3M". "Llama 3.1 was pretrained on ~15 trillion tokens of data from publicly available sources." Token count column: "15T+". (accessed 2026-10-30)
- Use in dive: the GPU-hours side of the 6ND / (GPUs x peak x MFU) check (section 3 W7). The GPU-hours include everything the card counts as training, so the implied end-to-end utilisation comes out below Table 4's MFU; that gap is the lesson (goodput, restarts, long-context stages, post-training).

**T01-8. Llama 3 405B's batch schedule: 4M tokens at sequence length 4,096 to start, doubled to 8M tokens at 8,192 after 252M tokens, doubled again to 16M after 2.87T tokens; AdamW with peak learning rate 8 x 10^-5, 8,000 warm-up steps, cosine decay over 1,200,000 steps. Long-context extension used about 800B tokens in six stages from 8K to 128K.**
- Location: 2407.21783v3, Sec 3.4.1 and 3.4.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab) | production report | "We pre-train Llama 3 405B using AdamW with a peak learning rate of 8 × 10^-5, a linear warm up of 8,000 steps, and a cosine learning rate schedule decaying to 8 × 10^-7 over 1,200,000 steps. We use a lower batch size early in training to improve training stability, and increase it subsequently to improve efficiency. Specifically, we use an initial batch size of 4M tokens and sequences of length 4,096, and double these values to a batch size of 8M sequences of 8,192 tokens after pre-training 252M tokens. We double the batch size again to 16M after pre-training on 2.87T tokens." (The "8M sequences" is the paper's wording; with "double these values" from 4M tokens it reads as 8M tokens.) "We do not train on long sequences earlier because the compute in self-attention layers grows quadratically in the sequence length." "we increased context length gradually in six stages, starting from the original 8K context window and ending in the final 128K context window. This long-context pre-training stage was performed using approximately 800B training tokens." (accessed 2026-10-30)
- Use in dive: the batch-size section (global batch = micro-batch x accumulation x DP) and the attention-cost section. Mental model: a production run ramps batch size and context length rather than fixing them, and keeps long sequences to the end because attention FLOPs grow with s (T01-17, section 3 W6).

### B. What one step computes and what state persists

**T01-9. Mixed-precision Adam holds 16 bytes per parameter of model state: 2 for FP16 weights, 2 for FP16 gradients, and 12 for the optimizer (FP32 master weights, momentum and variance at 4 bytes each). The paper calls the optimizer multiplier K = 12.**
- Location: 1910.02054v3 (ZeRO), Sec 3.1 "Model States: Optimizer States, Gradients and Parameters".
- Verdict: CORRECT (the widely repeated "16 bytes per parameter" figure)
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint (no venue on the arXiv abstract page; the SC20 publication was not confirmed in this research) | formula | "Mixed precision training of a model with Ψ parameters using Adam requires enough memory to hold an fp16 copy of the parameters and the gradients, with memory requirements of 2Ψ and 2Ψ bytes respectively. In addition, it needs to hold the optimizer states: an fp32 copy of the parameters, momentum and variance, with memory requirements of 4Ψ, 4Ψ, and 4Ψ bytes, respectively. Let's use K to denote the memory multiplier of the optimizer states, i.e., the additional memory required to store them is KΨ bytes. Mixed-precision Adam has K = 12. In total, this results in 2Ψ + 2Ψ + KΨ = 16Ψ bytes of memory requirement. For a model such as GPT-2 with 1.5 Billion parameters, this leads to a memory requirement of at least 24 GB" (accessed 2026-10-30)
- Use in dive: the first line of the memory-budget calculator. Mental model: the optimizer, not the model, dominates (12 of 16 bytes). Section 3 W2 applies it: 128.5 GB for 8B and 1,128.9 GB for 70B before any sharding [derived]. Register 02 owns how ZeRO stages divide each term.

**T01-10. Mixed precision runs forward and backward in 16-bit weights and activations, while the optimizer keeps FP32 copies of the parameters and all other optimizer states to compute and apply the update.**
- Location: 1910.02054v3, Sec 3.1, "Mixed-Precision Training" paragraph.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | definition | "parameters and activations are stored as fp16, enabling the use of the high throughput tensor core units [24] on these GPUs. During mixed-precision training, both the forward and backward propagation are performed using fp16 weights and activations. However, to effectively compute and apply the updates at the end of the backward propagation, the mixed-precision optimizer keeps an fp32 copy of the parameters as well as an fp32 copy of all the other optimizer states." (accessed 2026-10-30)
- Use in dive: the "what persists between steps" diagram: weights (16-bit working copy plus FP32 master), gradients, optimizer moments persist; activations live only from the forward to the backward of the same micro-batch. Mental model.

**T01-11. Beyond model states, ZeRO names three "residual" consumers: activations, temporary buffers (fused flattened buffers for all-reduce or gradient-norm, possibly FP32: 6 GB for a 1.5B model), and fragmentation (out-of-memory "with over 30% of memory still available in some extreme cases").**
- Location: 1910.02054v3, Sec 3.2 "Residual Memory Consumption".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | production report (author observation) | "Operations such as gradient all-reduce, or gradient norm computation tend to fuse all the gradients into a single flattened buffer before applying the operation in an effort to improve throughput. ... While the gradient themselves are usually stored as fp16 tensors, the fused buffer can be an fp32 tensor depending on the operation. ... for a model with 1.5B parameters, a flattened fp32 buffer would required 6 GB of memory." "We observe significant memory fragmentation when training very large models, resulting in out of memory issue with over 30% of memory still available in some extreme cases." (accessed 2026-10-30)
- Use in dive: the memory calculator's "buffers and fragmentation" line. Practical: the calculator should carry a headroom term rather than fill HBM to 100%. The 30% is an extreme-case observation, not a planning constant.

**T01-12. ZeRO quotes activation checkpointing as cutting activation memory by about the square root of the total, at a 33% recomputation overhead: a 1.5B GPT-2 at sequence 1K and batch 32 needs about 60 GB of activations, about 8 GB with checkpointing.**
- Location: 1910.02054v3, Sec 3.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | benchmark claim (author reported) | "the 1.5B parameter GPT-2 model trained with sequence length of 1K and batch size of 32 requires about 60 GB of memory. Activation checkpointing (or activation recomputation) is a common approach to reduce the activation memory by approximately the square root of the total activations at the expense of 33% re-computation overhead [7]. This would reduce the activation memory consumption of this model to about 8 GB." (accessed 2026-10-30)
- Use in dive: shows activations can exceed model states (60 GB of activations against 24 GB of model states for the same 1.5B model). Mental model: model states scale with N, activations with batch x sequence x hidden x layers.

**T01-13. Chinchilla kept a higher-precision copy of the weights in the sharded optimizer state, and the paper reports that this, and AdamW over Adam, improved results.**
- Location: 2203.15556v1, Appendix G "Other differences between Chinchilla and Gopher", Figures A6 and A7.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2203.15556v1 | Tier 3, preprint (first-party lab; no venue on the arXiv abstract page) | ablation | "Gopher was trained with Adam (Kingma and Ba, 2014) whereas Chinchilla was trained with AdamW (Loshchilov and Hutter, 2019). Furthermore, as discussed in Lessons Learned in Rae et al. (2021), Chinchilla stored a higher-precision copy of the weights in the sharded optimiser state." "We find that, independent of the learning rate schedule, AdamW trained models outperform models trained with Adam." (accessed 2026-10-30)
- Use in dive: why the FP32 master copy survives the move from FP16 to BF16. Mental model: BF16 has FP32's range but only 7 stored mantissa bits (T01-41), so small updates to a BF16 weight round away; the FP32 master keeps them.

### C. FLOPs per token: 6N, the attention term, recomputation

**T01-14. Kaplan et al. define training compute as C ~= 6N FLOPs per token, with N the non-embedding parameter count: a forward pass costs about 2N + 2 n_layer n_ctx d_model, and the backward pass about twice the forward. They drop the context term because it is small when d_model > n_ctx / 12.**
- Location: 2001.08361v1, Sec 2.1, Eq. 2.1 and 2.2, Table 1.
- Verdict: CORRECT (the "6N" rule as commonly stated), with the conditions below
- Evidence: https://arxiv.org/abs/2001.08361v1 | Tier 3, preprint (first-party lab; arXiv comments "19 pages, 15 figures") | formula | "N ≈ 2 d_model n_layer (2 d_attn + d_ff) = 12 n_layer d_model^2 with the standard d_attn = d_ff/4 = d_model"; "Evaluating a forward pass of the Transformer involves roughly C_forward ≈ 2N + 2 n_layer n_ctx d_model add-multiply operations, where the factor of two comes from the multiply-accumulate operation used in matrix multiplication."; "For contexts and models with d_model > n_ctx/12, the context-dependent computational cost per token is a relatively small fraction of the total compute. Since we primarily study models where d_model ≫ n_ctx/12, we do not include context-dependent terms in our training compute estimate. Accounting for the backwards pass (approximately twice the compute as the forwards pass), we then define the estimated non-embedding compute as C ≈ 6N floating point operators per training token." (accessed 2026-10-30)
- Use in dive: the core FLOPs mental model: every parameter is touched by one multiply-add forward (2 FLOPs) and two backward (input gradient and weight gradient, 4 FLOPs). The condition d_model > n_ctx/12 breaks for Llama 3.1 8B above 49,152 tokens [derived: 12 x 4,096]; section 3 W6 gives the exact crossover with Llama's GQA shapes.

**T01-15. Kaplan's Table 1 counts the attention "mask" term as 2 n_layer n_ctx d_attn forward FLOPs per token and counts the de-embedding (output head) at 2 d_model n_vocab, but leaves both out of N and out of C ~= 6N.**
- Location: 2001.08361v1, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2001.08361v1 | Tier 3, preprint | formula | Table 1 rows: "Embed (n_vocab + n_ctx) d_model 4 d_model"; "Attention: QKV n_layer d_model 3 d_attn 2 n_layer d_model 3 d_attn"; "Attention: Mask - 2 n_layer n_ctx d_attn"; "Attention: Project n_layer d_attn d_model 2 n_layer d_attn d_embd"; "Feedforward n_layer 2 d_model d_ff 2 n_layer 2 d_model d_ff"; "De-embed - 2 d_model n_vocab"; "Total (Non-Embedding) N = 2 d_model n_layer (2 d_attn + d_ff) C_forward = 2N + 2 n_layer n_ctx d_attn". Caption: "Sub-leading terms such as nonlinearities, biases, and layer normalization are omitted." (accessed 2026-10-30)
- Use in dive: practical. For a model with an untied 128K-vocabulary head the de-embed term is not sub-leading (T01-3). Kaplan's mask term is half of what Megatron-LM and PaLM count (T01-17, T01-18); see section 5, C01-2.

**T01-16. Chinchilla counts all training FLOPs including the embedding matrices and the attention score and value products, and finds its fuller count within a few percent of 6ND at the sizes it studied (ratio 0.99 to 1.10 across 73M to 6.8B).**
- Location: 2203.15556v1, Appendix F "FLOPs computation", Table A4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2203.15556v1 | Tier 3, preprint (first-party lab) | formula | "We include all training FLOPs, including those contributed to by the embedding matrices, in our analysis. Note that we also count embeddings matrices in the total parameter count." Per layer: "Key, query and value projections: 2 × 3 × seq_len × d_model × (key_size × num_heads)", "Key @ Query logits: 2 × seq_len × seq_len × (key_size × num_heads)", "Softmax: 3 × num_heads × seq_len × seq_len", "Softmax @ query reductions: 2 × seq_len × seq_len × (key_size × num_heads)", "Final Linear: 2 × seq_len × (key_size × num_heads) × d_model", "Dense Block ... 2 × seq_len × (d_model × ffw_size + d_model × ffw_size)", "Final Logits 2 × seq_len × d_model × vocab_size". "As in Kaplan et al. (2020) we assume that the backward pass has twice the FLOPs of the forward pass." "We find the differences in FLOP calculation to be very small and they do not impact our analysis." Table A4 "FLOP Ratio (Ours/6ND)": 1.03, 1.10, 1.08, 1.04, 1.03, 0.99. (accessed 2026-10-30)
- Use in dive: shows 6ND is a good approximation at the paper's model sizes when N includes embeddings. The paper's text does not state its training sequence length (U01-2), so the context length behind the 0.99 to 1.10 ratios is not known from this source; W6 shows why that matters.

**T01-17. The Megatron-LM formula: with activation recomputation, one iteration costs 96 B s l h^2 (1 + s/6h + V/16lh) FLOPs. Without recomputation the forward-plus-backward cost is 72 B s l h^2 (1 + s/6h + V/12lh). Both assume a GPT-style layer (4h FFN, full multi-head attention).**
- Location: 2104.04473v5, Appendix "Floating-point operations" and Sec 5.1 (Eq. 3); 2205.05198v1, Appendix A (Eq. 7).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021, per arXiv comments "Accepted to SC 2021") | formula | "For the attention block, the main FLOP contributors are the key, query, and value transformation (6Bsh^2 operations), attention matrix computation (2Bs^2h operations), attention over values (2Bs^2h operations), and post-attention linear projection (2Bsh^2 operations). The feed-forward network increases the hidden size to 4h and then reduces it back to h; this requires 16Bsh^2 FLOPs. Summing these together, each transformer layer results in 24Bsh^2 + 4Bs^2h FLOPs for the forward pass. The backward pass requires double the number of FLOPs since we need to calculate the gradients with respect to both input and weight tensors. In addition, we are using activation recomputation, which requires an additional forward pass before the backward pass." Logit layer: "2BshV in the forward pass and 4BshV in the backward pass, resulting in 6BshV FLOPs in total." Sec 5.1: "We count a FLOP as a floating-point operation regardless of precision. We also note that equation (3) assumes activation recomputation and takes into account the floating-point operations associated with the extra forward pass." 2205.05198v1 Eq. 7: "model FLOPs per iteration = 72BLsh^2 (1 + s/6h + v/12hL)" (accessed 2026-10-30)
- Use in dive: the attention term is s/6h of the dense term under this accounting; for an 8K context at h = 4,096 that is 8,192/24,576 = 33% of the dense FLOPs [derived], but Llama's GQA and 3.5h three-matrix SwiGLU make the dense term larger than 24h^2 per layer, so the Llama-specific ratio is lower: 12.88/45.03 = 29% of dense, 22% of total per-token FLOPs (section 3 W6) [derived]. Practical: anyone quoting Megatron "TFLOP/s" numbers from 2104.04473 is quoting recomputation-inclusive FLOPs (T01-22).

**T01-18. PaLM defines MFU as observed tokens per second divided by the theoretical peak tokens per second, R = P / (6N + 12LHQT), where the attention matmuls add 12LHQT FLOPs per token (L layers, H heads, Q head dimension, T sequence length) and recomputation is excluded from the numerator.**
- Location: 2204.02311v5, Sec 4.1 and Appendix B.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2204.02311v5 | Tier 3, preprint (first-party lab; no venue on the arXiv abstract page) | definition, formula | "Excluding self-attention, an N-parameter decoder-only model requires 6N matmul FLOPs per token seen (2N for forward and 4N for backward), because each matmul performs one multiplication and one addition per pair of input values, and the backward pass includes two matmuls for each one in the forward pass (Kaplan et al., 2020). The matmuls in dense self-attention add 6LH(2QT) FLOPs per token (a much smaller value for large models, but included here for completeness) where L, H, Q, and T are the number of layers, the number of heads, the head dimension, and the sequence length respectively. If a given group of accelerators have a total theoretical peak matmul throughput of P FLOPs per second, the model FLOPs utilization is the ratio of the achieved throughput in tokens per second to the theoretical peak throughput R = P / (6N + 12LHQT)." (accessed 2026-10-30)
- Use in dive: the MFU formula the calculator implements. Practical: 12LHQT with HQ = d is the same attention term as Megatron's 12 s h per layer per token [derived: 4Bs^2h forward per layer / Bs tokens x 3]; it ignores causal masking (C01-2).

**T01-19. PaLM's case for MFU over HFU: hardware FLOPs depend on implementation choices such as rematerialization and on how they are counted, while MFU's numerator is observed tokens per second and its denominator depends only on the architecture and the published peak.**
- Location: 2204.02311v5, Sec 4.1 "Training Efficiency".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2204.02311v5 | Tier 3, preprint | definition | "the number of hardware FLOPs executed is system-dependent and implementation-dependent and design choices in the compiler can result in different number of operations. Rematerialization is a technique that is widely used to trade off memory usage with compute. ... the ultimate goal of a training system is to achieve a high throughput in tokens per second (and therefore a fast time to train), not to use as many hardware FLOPs as possible." "Given these problems, we recognize that HFU is not a consistent and meaningful metric for LLM training efficiency. We propose a new metric ... called model FLOPs utilization (MFU). ... Crucially, the 'theoretical maximum' throughput only accounts for the required operations to compute the forward+backward passes, and not rematerialization. MFU therefore allows fair comparisons between training runs on different systems, as the numerator is simply the observed tokens-per-second, and the denominator is only dependent on the model architecture and published maximum FLOPs for a given system." (accessed 2026-10-30)
- Use in dive: mental model for MFU versus HFU: MFU measures progress through the training budget; HFU measures how busy the tensor cores are, including work you chose to redo. Register 07 owns MFU as a monitored metric.

**T01-20. PaLM 540B: 238.3K tokens/s on 6,144 TPU v4 chips at batch 2,048 sequences; MFU 45.7% without attention FLOPs, 46.2% with them; HFU 57.8% including rematerialization. Recomputation of 75% of non-attention forward FLOPs and all attention forward FLOPs raised per-token compute from 3.28 to 4.10 TFLOPs.**
- Location: 2204.02311v5, Sec 4.1 Table 3; Appendix B, Table 22.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2204.02311v5 | Tier 3, preprint | production report | "PaLM 540B achieves an average training throughput of 238.3K tokens/sec at the batch size of 2048. The training of PaLM 540B uses rematerialization because the feasible batch size with rematerialization enables higher training throughput. Without the rematerialization costs, the resulting model FLOPs utilization is 45.7% without self-attention ((238.3 × 6 × 540)/(275 × 6144)) or 46.2% with it. PaLM's analytically computed hardware FLOPs utilization, which includes rematerialization FLOPs, is 57.8%." "If we include the cost of re-materialization in the backward pass, 75% of non-attention forward pass FLOPs are recomputed while all attention forward pass FLOPs are recomputed." Table 22 row "540B 3.28 4.10 2.56 × 10^24 29600" (columns: TFLOPs per token non-attn+attn; TFLOPs per token non-attn+attn+remat; Train FLOPs; PetaFLOP/s-days), caption "Compute usage to train PaLM 8B and PaLM 540B to 780 billion tokens". Megatron-Turing NLG comparison: "312 peak matmul TFLOP/s ... 65.43K tokens/second (1920 × 2048/60.1) on 2240 GPUs ... resulting in MFU of 29.7% without attention ((65.43 × 6 × 530)/(312 × 2240)) or 30.2% with it." (accessed 2026-10-30)
- Use in dive: a worked MFU computation the reader can reproduce by hand, and the MFU-to-HFU gap that recomputation creates (4.10/3.28 = 1.25 [derived]). The peak used is the published 275 TFLOP/s per TPU v4 chip and 312 TFLOP/s per A100 (both vendor peaks).

**T01-21. Hardware FLOPs exceed model FLOPs whenever a run recomputes activations. With selective recomputation (attention core only) the hardware-to-model ratio is about 1 + s/6h, and at the paper's tested sizes MFU and HFU differ by at most 2.2 points (for example 56.3% MFU and 57.0% HFU at 1T parameters).**
- Location: 2205.05198v1, Sec 6.3, Table 5 and Appendix A (Eq. 7 to 9).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint (no venue on the arXiv abstract page) | formula, benchmark claim (author reported) | "Model FLOPs are the floating point operations required to perform a single forward and backward pass (single iteration) regardless of the implementations and hardware limitations. ... On the other hand, the hardware FLOPs represent the floating point operations that are actually performed on the hardware per iteration. Therefore, if an implementation requires activation recomputation (for example ours), then the hardware FLOPs are going to be larger than model FLOPs." "For our method, the hardware to model FLOPs ratio is approximately 1 + s/6h." Appendix A: "hardware FLOPs per iteration = 72BLsh^2 (1 + s/3h + v/12hL)" and Eq. 9 "hardware FLOPs / model FLOPs ≈ 1 + s/6h". Table 5 MFU / HFU: 22B 41.5% / 43.7%; 175B 51.4% / 52.8%; 530B 56.0% / 57.0%; 1T 56.3% / 57.0%. Footnote: "For NVIDIA A100 GPUs, the peak theoretical FLOPs per second is 312 teraFLOPs/sec." "the results in Table 5 do not use any data parallelism." (accessed 2026-10-30)
- Use in dive: practical. Selective recomputation costs a few percent of FLOPs where full recomputation costs about a third more (T01-34). For Llama 3.1 8B at s = 8,192 the GPT-style ratio would be 1 + 8,192/24,576 = 1.33 [derived], which is why the ratio is only "modest" for wide models at 2K context; with FlashAttention the attention core is recomputed in the backward pass anyway (T01-38), so the HFU/MFU gap from attention exists whether or not the framework calls it recomputation.

### D. MFU in published runs, and the peak to divide by

**T01-22. Megatron-LM's headline 52% of peak (163 TFLOP/s per A100, 502 PFLOP/s on 3,072 GPUs for a 1T-parameter model) is computed with the recomputation-inclusive 96 B s l h^2 formula and includes data loading, optimizer, communication and logging. By PaLM's definition it is closer to HFU than to MFU.**
- Location: 2104.04473v5, Abstract, Sec 5.1 and Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | benchmark claim (author reported) | "Our approach allows us to perform training iterations on a model with 1 trillion parameters at 502 petaFLOP/s on 3072 GPUs (per-GPU throughput of 52% of theoretical peak)." "We also note that equation (3) assumes activation recomputation and takes into account the floating-point operations associated with the extra forward pass." "Note that throughput is measured for end-to-end training, i.e., includes all operations including data loading, optimizer steps, communication, and logging. We achieve 52% of peak device throughput for the largest model, and 44% of peak device throughput for the smallest model." (accessed 2026-10-30)
- Use in dive: practical. When comparing an MFU figure across papers, check whether the numerator includes recomputation. Removing the extra forward pass would scale 52% by roughly 3/4 [derived: 72/96 on the dominant term], about 39% MFU in PaLM's sense; the paper does not state this figure.

**T01-23. Megatron-LM's training-time estimate: end-to-end time ~= 8TP / (nX) with recomputation (T tokens, P parameters, n GPUs, X achieved FLOP/s per GPU). Its GPT-3 example: 175B parameters, 300B tokens, 1,024 A100s at 140 TFLOP/s gives 34 days.**
- Location: 2104.04473v5, Sec 5.1, Eq. 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "We note that for the configurations in Table 1, we have 6h ≫ s, 16lh ≫ (V + s), and 12lh ≫ V. Combining these observations with equations (2) and (3), we arrive at End-to-end training time ≈ 8TP/(nX). (4) Let us consider the GPT-3 model with P = 175 billion parameters as an example. This model was trained on T = 300 billion tokens. On n = 1024 A100 GPUs using batch size 1536, we achieve X = 140 teraFLOP/s per GPU. As a result, the time required to train this model is 34 days." (accessed 2026-10-30)
- Use in dive: the "how long and how many GPUs" formula in its recomputation form. The 8 is 6 (forward and backward) plus 2 (the recomputed forward). With MFU defined on 6ND, the same estimate is 6TP / (n x peak x MFU) (section 3 W7). Check: 8 x 300e9 x 175e9 / (1,024 x 140e12) = 2.93e6 s = 33.9 days [derived].

**T01-24. MegaScale reports 55.2% MFU training a 175B model on 12,288 GPUs (Ampere generation, sequence 2,048, vocabulary 64,000, batch 6,144), 1.34x Megatron-LM's 41.2% in the same setting. MFU falls from 59.1% to 55.2% as GPUs grow from 3,072 to 12,288 at fixed batch.**
- Location: 2402.15627v1, Abstract, Sec 6.1, Tables 1 and 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2402.15627v1 | Tier 3, preprint (the acknowledgements thank "NSDI reviewers"; venue not confirmed on the arXiv abstract page) | benchmark claim (author reported) | "MegaScale achieves 55.2% Model FLOPs Utilization (MFU) when training a 175B LLM model on 12,288 GPUs, improving the MFU by 1.34× compared to Megatron-LM." "Sequence length is 2,048 and vocabulary size is 64,000 for all the cases." Table 2 rows (batch 6144): Megatron-LM "12288 8.57 1466.8k 2.37 41.2% 1579.5"; MegaScale "3072 23.66 531.9k 6.53 59.1%(1.21×) 566.5" and "12288 6.34 1984.0k 1.75 55.2%(1.34×) 2166.3". "With increasing GPUs, we observe the MFU of MegaScale decreases from 59.1% to 55.2%. This is expected since the batch size is fixed and the computation-to-communication ratio decreases with more GPUs." Model FLOPs utilization is defined as "the ratio of the observed throughput to the theoretical maximum throughput assuming 100% of peak FLOPs [7]". (accessed 2026-10-30)
- Use in dive: MFU above 50% is reachable at 10K-GPU scale with a short sequence and a tuned stack, but the 55.2% figure comes with algorithmic changes (parallel transformer block, sliding-window attention, LAMB) that T01-25 records. Mental model: at fixed global batch, more GPUs means less work per GPU per step and lower MFU (same cause as Llama 3's 43% to 41%, T01-6).

**T01-25. Part of MegaScale's MFU gain came from changing the model and optimizer, not only the system: parallel transformer block plus sliding-window attention added 5.6 points, LAMB with a 3x larger batch added 3.0 points, out of a 17.6-point total gain over a 47.7% baseline on 256 GPUs.**
- Location: 2402.15627v1, Sec 6.1, ablation paragraph and Figure 10.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2402.15627v1 | Tier 3, preprint | ablation | "The baseline is the original Megatron-LM and has 47.7% MFU. ... We first apply two algorithmic techniques, parallel transformer block and sliding window attention, to Megatron-LM, achieving 5.6% MFU improvement. Communication is the major bottleneck of large-scale LLM training, and the 3D parallel communication overlapping of MegaScale hides the overhead and accelerates training by 6.2% MFU. We further adopt efficient operators and obtain 1.7% acceleration. Other optimizations such as data pipeline optimizations and the problematic code elimination mentioned in 6.3 further achieves 1.1% performance gain. Finally, we scale the batch size from 256 to 768 with LAMB optimizer, which significantly extends the steady phase in interleaved pipeline parallelism and achieves 3.0% MFU improvement. To sum up, MegaScale outperforms the baseline by 17.6% in the MFU number with all these optimizations." (accessed 2026-10-30)
- Use in dive: practical caution for anyone benchmarking against a published MFU: check the architecture and batch it was measured on. Mental model: a larger batch shrinks the pipeline bubble, which raises MFU without any kernel change.

**T01-26. DeepSeek-V3 (671B total, 37B active parameters per token) reports 180K H800 GPU-hours per trillion pre-training tokens, 2,664K GPU-hours for 14.8T tokens of pre-training, 119K for context extension and 5K for post-training: 2.788M in total. The paper does not state an MFU.**
- Location: 2412.19437v2, Sec 1, Table 1; "MFU" does not appear in the extracted text of v2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint (first-party lab technical report) | production report | "During the pre-training stage, training DeepSeek-V3 on each trillion tokens requires only 180K H800 GPU hours, i.e., 3.7 days on our cluster with 2048 H800 GPUs. Consequently, our pre-training stage is completed in less than two months and costs 2664K GPU hours. Combined with 119K GPU hours for the context length extension and 5K GPU hours for post-training, DeepSeek-V3 costs only 2.788M GPU hours for its full training." "Note that the aforementioned costs include only the official training of DeepSeek-V3, excluding the costs associated with prior research and ablation experiments on architectures, algorithms, or data." (accessed 2026-10-30)
- Use in dive: the MoE example of "6ND uses active parameters". [derived] 6 x 37e9 x 14.8e12 = 3.29e24 FLOPs over 2.664e6 GPU-hours gives 343 TFLOP/s per GPU of model FLOPs (excluding attention); the share of peak depends on the H800 peak, which this research did not take from an NVIDIA source (U01-4). The "$5.576M" rental figure in the paper is the paper's own assumption of $2 per GPU-hour, not a market price.

**T01-27. NVIDIA's H100 SXM specification lists BF16 Tensor Core 1,979 teraFLOPS and FP8 3,958 teraFLOPS, both marked "With sparsity"; 80 GB HBM at 3.35 TB/s; NVLink 900 GB/s; up to 700 W. The dense figures are half: 989 (BF16) and 1,979 (FP8) [derived].**
- Location: nvidia.com H100 product page, "Product Specifications" table, H100 SXM column and the "* With sparsity" footnote.
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/h100/ | Tier 1, first-party vendor specification | vendor specification | "Product Specifications | H100 SXM | H100 NVL | ... TF32 Tensor Core* | 989 teraFLOPS | 835 teraFLOPs | BFLOAT16 Tensor Core* | 1,979 teraFLOPS | 1,671 teraFLOPS | FP16 Tensor Core* | 1,979 teraFLOPS | 1,671 teraFLOPS | FP8 Tensor Core* | 3,958 teraFLOPS | 3,341 teraFLOPS | ... GPU Memory | 80GB | 94GB | GPU Memory Bandwidth | 3.35TB/s | 3.9TB/s | ... Max Thermal Design Power (TDP) | Up to 700W (configurable) | ... Interconnect | NVIDIA NVLink: 900GB/s" and footnote "* With sparsity". The page does not print the dense figure; halving the 2:4 structured-sparsity figure is the convention the HGX page states for Blackwell (T01-29) and is applied here [derived]. (accessed 2026-10-30)
- Use in dive: practical. The MFU denominator for H100 BF16 is about 989 TFLOP/s, not 1,979. Dividing by the sparse figure halves every MFU. Training uses dense matmuls; T01-6's 430 TFLOPs at 43% implies a denominator of 1,000 [derived], consistent with the dense figure.

**T01-28. NVIDIA's H200 SXM specification lists the same compute as H100 SXM (BF16 1,979 and FP8 3,958 TFLOPS with sparsity) with 141 GB of memory at 4.8 TB/s.**
- Location: nvidia.com H200 product page, specification table, H200 SXM column, footnote "2 With sparsity".
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/h200/ | Tier 1, first-party vendor specification | vendor specification | "BFLOAT16 Tensor Core² | 1,979 TFLOPS | 1,671 TFLOPS | FP16 Tensor Core² | 1,979 TFLOPS | 1,671 TFLOPS | FP8 Tensor Core² | 3,958 TFLOPS | 3,341 TFLOPS | ... GPU Memory | 141GB | 141GB | GPU Memory Bandwidth | 4.8TB/s | 4.8TB/s | ... Max Thermal Design Power (TDP) | Up to 700W (configurable)" with footnotes "1 Preliminary specifications. May be subject to change." and "2 With sparsity." (accessed 2026-10-30)
- Use in dive: mental model for p5en (8x H200) against p5 (8x H100): same peak FLOPs, 1.76x the memory [derived: 141/80]. H200 buys room for a larger micro-batch, less recomputation or less parallelism, not raw compute. Register 05 owns the instance figures.

**T01-29. NVIDIA's HGX B200 specification (8 GPUs) lists FP16/BF16 Tensor Core 36 PFLOPS and FP8/FP6 72 PFLOPS as sparse figures, with the footnote "Dense is ½ sparse spec shown", and FP4 144 PFLOPS sparse / 72 PFLOPS dense. Per GPU that is 2.25 PFLOPS dense BF16, 4.5 dense FP8 and 9 dense FP4 [derived].**
- Location: nvidia.com HGX page, HGX B300 / HGX B200 specification table and footnotes 1 and 2.
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/hgx/ | Tier 1, first-party vendor specification | vendor specification | "HGX B300 | HGX B200 | Form Factor | 8x NVIDIA Blackwell Ultra SXM | 8x NVIDIA Blackwell SXM | FP4 Tensor Core^1 | 144 PFLOPS | 108 PFLOPS | 144 PFLOPS | 72 PFLOPS | FP8/FP6 Tensor Core^2 | 72 PFLOPS | 72 PFLOPS | ... FP16/BF16 Tensor Core^2 | 36 PFLOPS | 36 PFLOPS | TF32 Tensor Core^2 | 18 PFLOPS | 18 PFLOPS | ... Total Memory | 2.1 TB | 1.4 TB | ... NVLink GPU-to-GPU Bandwidth | 1.8 TB/s | 1.8 TB/s" with footnotes "1. Specification in Sparse | Dense" and "2. Specification in Sparse. Dense is ½ sparse spec shown." (accessed 2026-10-30)
- Use in dive: the MFU denominator for p6-b200: 2.25 PFLOPS per GPU for BF16 [derived: 36 / 8 / 2], 2.3x an H100 [derived: 2,250 / 989]. Practical: "72 PFLOPS FP8" on a B200 system page is the sparse figure for eight GPUs.

**T01-30. AWS's Neuron documentation gives the Trainium2 chip 667 BF16/FP16/TF32 TFLOPS and 1,299 FP8 TFLOPS dense, 2,563 sparse, with 96 GiB of HBM at 2.9 TB/s, eight NeuronCore-v3 per chip, and user-selectable stochastic rounding.**
- Location: AWS Neuron documentation (banner "Neuron 2.33.0 is released"), "Trainium2 Architecture", "Trainium2 chip components".
- Verdict: NEW
- Evidence: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html | Tier 1, first-party AWS documentation | vendor specification | "Every Trainium2 chip contains eight NeuronCore-V3 cores." "Eight NeuronCore-v3 that collectively deliver: 1,299 FP8 TFLOPS | 667 BF16/FP16/TF32 TFLOPS | 2,563 FP8/FP16/BF16/TF32 sparse TFLOPS | 181 FP32 TFLOPS | Device Memory | 96 GiB of device memory with 2.9 TB/sec of bandwidth." "Trainium2 also allows for user-programmable rounding mode (Round Nearest Even or Stochastic Rounding)". NeuronLink: "NeuronLink-v3 for chip-to-chip interconnect provides 1.28 TB/sec bandwidth per chip." (accessed 2026-10-30)
- Use in dive: the MFU denominator for trn2.48xlarge (16 chips): 667 TFLOPS BF16 per chip. Link: `deep-dives/silicon-memory-inference/src/sections/AwsCustomSilicon.tsx` owns the chip; this entry records only the training inputs. Note the units: 96 GiB is 103.1 GB [derived], which matters when comparing with the H100's 80 GB.

### E. Activation memory and activation checkpointing

**T01-31. Korthikanti et al. derive activation memory per Transformer layer as sbh(34 + 5as/h) bytes (s sequence length, b micro-batch, h hidden size, a attention heads), assuming 16-bit activations, 1-byte dropout masks and a GPT-style layer: attention 11sbh + 5as^2b, MLP 19sbh (4h GeLU MLP), two layer-norms 4sbh.**
- Location: 2205.05198v1, Sec 4.1, Eq. 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint (no venue on the arXiv abstract page) | formula | "We also assume that the network and the activations are stored in a 16-bit floating point format and therefore each element requires 2 bytes for storage. The only exceptions are the dropout masks which only require a single byte per element." "Query (Q), Key (K), and Value (V) matrix multiplies: We only need to store their shared input with size 2sbh. QK^T matrix multiply: It requires storage of both Q and K with total size 4sbh. Softmax: Softmax output with size 2as^2b is required for back-propagation. Softmax dropout: Only a mask with size as^2b is needed. Attention over Values (V): We need to store the dropout output (2as^2b) and the Values (2sbh) and therefore need 2as^2b + 2sbh of storage. Summing the above values, in total, the attention block requires 11sbh + 5as^2b bytes of storage. MLP: The two linear layers store their inputs with size 2sbh and 8sbh. The GeLU non-linearity also needs its input with size 8sbh for back-propagation. Finally, dropout stores its mask with size sbh. In total, MLP block requires 19sbh bytes of storage. Layer norm: Each layer norm stores its input with size 2sbh and therefore in total, we will need 4sbh of storage." "Activations memory per layer = sbh (34 + 5as/h)." (accessed 2026-10-30)
- Use in dive: the method for the activation line of the memory calculator: list every tensor the backward pass needs and add up bytes. The coefficients are specific to the GPT layer; section 3 W3 redoes the count for Llama (RMSNorm, no dropout, GQA, SwiGLU, FlashAttention) and lands on 34sbh for 8B and 33.5sbh for 70B [derived].

**T01-32. The same paper's Table 2 gives activation bytes per layer under each technique: no parallelism sbh(34 + 5as/h); tensor parallel sbh(10 + 24/t + 5as/ht); tensor plus sequence parallel sbh(34/t + 5as/ht); tensor parallel plus selective recomputation sbh(10 + 24/t); tensor plus sequence parallel plus selective recomputation sbh(34/t); full recomputation sbh(2).**
- Location: 2205.05198v1, Sec 5, Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | Table 2 "Activations memory, in bytes, per transformer layer for different techniques": "no parallelism sbh(34 + 5as/h)"; "tensor parallel (baseline) sbh(10 + 24/t + 5as/ht)"; "tensor + sequence parallel sbh(34/t + 5as/ht)"; "tensor parallel + selective activation recomputation sbh(10 + 24/t)"; "tensor parallel + sequence parallel + selective activation recomputation sbh(34/t)"; "full activation recomputation sbh(2)". (accessed 2026-10-30)
- Use in dive: the calculator's activation switches. Mental model: tensor parallelism alone leaves the 10sbh of layer-norm and dropout activations replicated on every rank; sequence parallelism shards them, so everything divides by t. Register 02 owns how sequence parallelism communicates.

**T01-33. Selective recomputation targets the 5as/h term (QK^T, softmax, softmax dropout, attention over V): large activations, few FLOPs. For GPT-3 (a = 96, s = 2,048, h = 12,288) 5as/h = 80, so selective recomputation saves 70% of activation memory for 2.7% extra FLOPs; for MT-NLG, 65% for 1.6%.**
- Location: 2205.05198v1, Sec 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula, benchmark claim | "we note that the term 5as/h in Equation 5 is due to the attention operations after the width of the network is increased by the linear layer calculating the Q, K, and V values; i.e., QK^T matrix multiply, softmax, softmax dropout, and attention over V as shown in Figure 3. These operations generally have large input sizes and thus large activations, however, the number of floating-point operations (FLOPs) per input element is very low." "For GPT-3, a = 96, s = 2048, and h = 12288 and as a result 5as/h = 80. For MT-NLG, a = 128, s = 2048, and h = 20480 so 5as/h = 64. ... by using selective activation recomputation we can save 70% and 65% of the required memory for activations for the GPT-3 and MT-NLG models, respectively. The recomputation of these activations introduces only 2.7% and 1.6% FLOPs overhead for these two models." (accessed 2026-10-30)
- Use in dive: the mental model behind "recompute the cheap, memory-heavy parts". For Llama 3.1 8B at s = 8,192 the same term would be 5 x 32 x 8,192 / 4,096 = 320, nearly ten times the 34 [derived]; this is the term FlashAttention removes (T01-38).

**T01-34. Measured cost: on one layer of the 22B model, selective recomputation added 7% to forward-plus-backward time against 39% for full-layer recomputation, and 4% when combined with sequence parallelism; at 530B and 1T the overhead was 2% against 36%. End to end, sequence parallelism plus selective recomputation raised throughput 29.0% to 32.1% over full recomputation.**
- Location: 2205.05198v1, Sec 6.2 (Table 4, Figure 8) and Sec 6.3 (Table 5).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | ablation | "The overhead of selective recomputation is 1.3ms, or 11% of the 11.9ms baseline, vs 7.6ms or 64% overhead for recomputing the full layer. For the combined forward and backward time, the overhead is 7% vs 39%. Note that the overhead of 39% for recomputing the full layer (as opposed to the expected 33%) is due to an optimization in the backward pass where we overlap all-reduce communication with the linear weight's gradient computation." "When the two techniques are used together, the overhead drops to just 4%." "For the 530B and 1T cases, the overhead is just 2%, compared to 36% overhead for full recompute." "the techniques presented in the paper provide between 29.0% and 32.1% improvement in the throughput over performing full recomputation without sequence parallelism." (accessed 2026-10-30)
- Use in dive: practical. Full recomputation costs about one extra forward pass (the "expected 33%" the paper names); the calculator should present it as roughly +33% step time, and selective as single-digit percent.

**T01-35. The paper treats the output layer's activations as negligible, but they include FP32 logits of 4sbv/t bytes. With Llama 3's 128,256-entry vocabulary this term is 4.2 GB per 8K-token sequence, about 11% of the activations of all 32 layers of Llama 3.1 8B [derived]. Meta's reference code upcasts the logits to FP32.**
- Location: 2205.05198v1, Sec 4.3 "Total Activations Memory"; meta-llama/llama-models v0.2.0 `models/llama3/model.py` line 308.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | "Finally, the cross entropy loss requires storing the logits which are calculated in 32-bit floating point and as a result will require 4sbv/t of storage." "We note that compared to term 34 + 5as/h from Equation 5, both p/L and 4/L(1 + v/h) are negligible. For example, for a model with 22B parameters, these extra terms account for less than 0.01% of the total activation memory requirements." Code: https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/model.py | Tier 1, code | `output = self.output(h).float()` (accessed 2026-10-30)
- Use in dive: practical. The "negligible" holds for GPT-era vocabularies near 50K at 2K context; at V = 128,256 and s = 8,192 the logits are 4 x 8,192 x 128,256 = 4.20 GB per micro-batch sequence against 36.5 GB for all 32 layers of 8B [derived, section 3 W4]. Fused or chunked cross-entropy kernels exist to avoid materialising it (not researched here; U01-6).

**T01-36. Chen et al.'s gradient checkpointing stores only segment boundaries and recomputes inside each segment during backward; with k = sqrt(n) segments the memory is O(sqrt(n)) for one extra forward pass. They measured about 30% extra runtime and cut a 1,000-layer ResNet from 48G to 7G.**
- Location: 1604.06174v2, Sec 4 (Eq. 1, Algorithm 1), Sec 5.4, Abstract.
- Verdict: CORRECT (the "sqrt(n) memory for one extra forward" description)
- Evidence: https://arxiv.org/abs/1604.06174v2 | Tier 3, preprint (no venue on the arXiv abstract page) | formula, benchmark claim | "The algorithm only remembers the output of each segment and drops all the intermediate results within each segment. The dropped results are recomputed at the segment level during back-propagation." "Given that the segment is equally divided, this translates into O(n/k) cost. The second part of equation is the cost to store the intermediate outputs between segments. Setting k = sqrt(n), we get the cost of O(2 sqrt(n)). This algorithm only requires an additional forward pass during training". "Because of the double forward cost in gradient calculation, the sublinear allocation strategy costs 30% additional runtime compared to the normal strategy." "we can reduce the memory cost of a 1,000-layer deep residual network from 48G to 7G on ImageNet problems." (accessed 2026-10-30)
- Use in dive: the original mental model of activation checkpointing as a memory-for-compute trade. In LLM frameworks the segment is usually one Transformer layer (T01-37), so "full recomputation" stores one 2sbh input per layer rather than sqrt(L) checkpoints.

**T01-37. Megatron-LM checkpoints at layer granularity: for a stage with l layers and c checkpoints, memory is c x A_input + (l/c) x A_intermediate, minimised at c = sqrt(l x A_intermediate / A_input); in practice "checkpointing every 1 or 2 transformer layers is optimal". On a 145B model, recomputation cut throughput by up to 33% at small batch, but enabled batches that ran up to 2x faster than the best batch without it.**
- Location: 2104.04473v5, Sec 3.5 and Sec 5.6 (Figure 17).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula, ablation | "If a model stage has l layers, and if c is the number of checkpoints, the total memory footprint is going to be c · A_input + l/c · A_intermediate. The minimum value of this function is obtained when c = sqrt(l · (A_intermediate / A_input)). In practice, we measure A_intermediate empirically. For most cases, checkpointing every 1 or 2 transformer layers is optimal." "For small batch sizes, activation recomputation leads to up to 33% lower throughput (in sequences per second) due to the extra forward pass that needs to be executed during the backward pass. However, activation recomputation is needed to support larger batch sizes. Throughput at large batch sizes with activation recomputation is up to 2× higher than the best throughput achieved without activation recomputation (for a smaller batch size) due to a smaller pipeline bubble." (accessed 2026-10-30)
- Use in dive: mental model that recomputation can raise throughput: memory freed buys a larger micro-batch or more micro-batches, which shrinks the pipeline bubble. Practical for the "should I turn on activation checkpointing" decision.

**T01-38. FlashAttention never stores the s x s attention matrices: it keeps the output and the softmax normalisation statistics and recomputes the attention blocks in SRAM during the backward pass, which the authors call "a form of selective gradient checkpointing" that is faster, not slower, because it saves HBM traffic. Its extra memory is linear in sequence length.**
- Location: 2205.14135v2, Sec 3.1 "Recomputation"; Sec 4.3 and the discussion of memory.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.14135v2 | Tier 3, preprint (no venue on the arXiv abstract page) | definition, benchmark claim | "One of our goals is to not store O(N^2) intermediate values for the backward pass. The backward pass typically requires the matrices S, P ∈ R^(N×N) to compute the gradients with respect to Q, K, V. However, by storing the output O and the softmax normalization statistics (m, ℓ), we can recompute the attention matrix S and P easily in the backward pass from blocks of Q, K, V in SRAM. This can be seen as a form of selective gradient checkpointing [10, 34]. While gradient checkpointing has been suggested to reduce the maximum amount of memory required [66], all implementations (that we know off) have to trade speed for memory. In contrast, even with more FLOPs, our recomputation speeds up the backward pass due to reduced HBM accesses (Fig. 2)." "requiring extra memory linear instead of quadratic in the sequence length". (accessed 2026-10-30)
- Use in dive: the reason the 5as/h term of T01-31 disappears for any modern Llama training stack, and why "selective recomputation" in Megatron terms is largely built into the attention kernel. Mental model. Practical: the activation calculator should drop the s^2 term when FlashAttention (or an equivalent fused attention) is on.

### F. Mixed precision: FP16, BF16, FP8, MXFP8, NVFP4

**T01-39. Mixed-precision training keeps an FP32 master copy of the weights because FP16 loses small updates two ways: values below 2^-24 become zero, and an update more than 2,048 times smaller than its weight vanishes when added, since FP16 has a 10-bit mantissa.**
- Location: 1710.03740v3, Sec 3.1 "FP32 master copy of weights".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1710.03740v3 | Tier 3, peer-reviewed (ICLR 2018, per arXiv comments "Published as a conference paper at ICLR 2018") | definition | "In mixed precision training, weights, activations and gradients are stored as FP16. In order to match the accuracy of the FP32 networks, an FP32 master copy of weights is maintained and updated with the weight gradient during the optimizer step. In each iteration an FP16 copy of the master weights is used in the forward and backward pass, halving the storage and bandwidth needed by FP32 training." "updates (weight gradients multiplied by the learning rate) become too small to be represented in FP16 - any value whose magnitude is smaller than 2^-24 becomes zero in FP16." "even though the weight update is representable in FP16, it could still become zero when addition operation right-shifts it to align the binary point with the weight. This can happen when the magnitude of a normalized weight value is at least 2048 times larger that of the weight update. Since FP16 has 10 bits of mantissa, the implicit bit must be right-shifted by 11 or more positions to potentially create a zero". (accessed 2026-10-30)
- Use in dive: the mental model for why the optimizer keeps 4-byte weights even when compute is 16-bit or 8-bit. BF16 has fewer mantissa bits than FP16 (7 against 10, T01-41), so the swamping effect starts at a ratio of 2^8 = 256 rather than 2,048 [derived, by the paper's same reasoning], which is why BF16 training still keeps FP32 master weights (T01-13, T01-47).

**T01-40. FP16 needs loss scaling: multiply the loss before backward so small gradients land in FP16's range, unscale before clipping or the update, and on overflow skip the step. Scales from 8 to 32K were used; a scale is safe as long as max gradient x scale stays below 65,504.**
- Location: 1710.03740v3, Sec 3.2 "Loss scaling".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1710.03740v3 | Tier 3, peer-reviewed (ICLR 2018) | definition | "One efficient way to shift the gradient values into FP16-representable range is to scale the loss value computed in the forward pass, prior to starting back-propagation. By chain rule back-propagation ensures that all the gradient values are scaled by the same amount." "Weight gradients must be unscaled before weight update to maintain the update magnitudes as in FP32 training. It is simplest to perform this unscaling right after the backward pass but before gradient clipping or any other gradient-related computations". "We trained a variety of networks with scaling factors ranging from 8 to 32K (many networks did not require a scaling factor)." "choosing a factor so that its product with the maximum absolute gradient value is below 65,504 (the maximum value representable in FP16)." "One option is to skip the weight update when an overflow is detected and simply move on to the next iteration." (accessed 2026-10-30)
- Use in dive: practical for anyone still on FP16 (V100, or older recipes). Mental model: loss scaling is a per-run exponent shift; FP8 later generalises it to per-tensor and per-block scales (T01-42, T01-44).

**T01-41. BF16 is 1 sign, 8 exponent and 7 mantissa bits, with FP32's dynamic range (max normal 3.38e38 against FP16's 6.55e4), so it trains without loss scaling; GEMMs take BF16 inputs and accumulate in FP32, and the weight update uses an FP32 copy of the weights.**
- Location: 1905.12322v3, Sec 3, Table 1 and Figure 1 description.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1905.12322v3 | Tier 3, preprint (no venue on the arXiv abstract page) | definition | Table 1 "FP32 1, 8, 23 3.40e38 1.17e−38 1.40e−45 float32"; "FP16 1, 5, 10 6.55e4 6.10e−5 5.96e−8 float32"; "BFLOAT16 1, 8, 7 3.38e38 1.17e−38 N/A float32". "The extended dynamic range can now represent smaller gradient values without applying complicated loss scaling methods". "The core compute kernels represented as GEMM operations accept inputs as BFLOAT16 tensors and accumulate the output to FP32 tensors. ... The weight update step (e.g., in SGD solver) uses the FP32 copy of the weights to maintain model accuracy." (accessed 2026-10-30)
- Use in dive: the default precision for the reference runs: Llama 3 405B reports BF16 MFU (T01-6). Mental model: BF16 trades FP16's precision for FP32's range, which removes loss scaling but not the FP32 master copy.

**T01-42. The FP8 proposal defines two encodings: E4M3 (bias 7, max 448, no infinities, one NaN pattern) for weights and activations, and E5M2 (bias 15, max 57,344, IEEE-style specials) for gradients. Tensors need per-tensor scaling factors, and FP16-style update skipping on overflow is "not a good choice" for FP8.**
- Location: 2209.05433v2, Sec 2 and Sec 3, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2209.05433v2 | Tier 3, preprint (no venue on the arXiv abstract page; authors from NVIDIA, Arm and Intel) | definition | "The recommended use of FP8 encodings is E4M3 for weight and activation tensors, and E5M2 for gradient tensors. While some networks can train with just the E4M3 or the E5M2 type, there are networks that require both types". Table 1: "Exponent bias 7 15"; "Infinities N/A S.11111.00"; "Max normal S.1111.110 = 1.75 * 2^8 = 448 S.11110.11 = 1.75 * 2^15 = 57,344"; "Min subnorm S.0000.001 = 2^-9 S.00000.01 = 2^-16". "some networks require per-tensor scaling factors as FP8 dynamic range is not sufficient to cover the union of all tensors' important values". "Weight update skipping (and reduction of the scaling factor) on overflows, as used by FP16 automatic mixed precision training [13], is not a good choice for FP8 as overflows are much more likely due to the narrower dynamic range, resulting in too many skipped updates." (accessed 2026-10-30)
- Use in dive: the definitions behind every FP8 recipe name. Mental model: FP8 halves the bytes per element again and so needs a scale factor per tensor (or per block) instead of one loss scale per run.

**T01-43. In the FP8 paper's own runs, FP8 training matched 16-bit within run-to-run noise up to GPT 175B: perplexity 6.65 (BF16 baseline) against 6.68 (FP8), with the 175B comparison taken at 75% of training because the baseline had not finished.**
- Location: 2209.05433v2, Sec 4, Table 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2209.05433v2 | Tier 3, preprint | benchmark claim (author reported) | Table 4 "NLP Models, Perplexity" columns "Baseline FP8": "GPT 1.3B 10.62 10.66", "GPT 22B 7.21 7.24", "GPT 175B 6.65 6.68". "training results of the FP8 sessions is within run-to-run noise of 16-bit training sessions. Note that 175B parameter model perplexity is reported at 75% training, as the bfloat16 baseline run has not yet completed." (accessed 2026-10-30)
- Use in dive: the vendor-side evidence that FP8 is a drop-in at scale, with its caveat. Pair with DeepSeek-V3's production report (T01-47) for a second, independent data point.

**T01-44. Transformer Engine v2.21.0 ships five scaling recipes: DelayedScaling (per-tensor scale from an amax history, default 1,024 steps, default format HYBRID = E4M3 forward and E5M2 backward), Float8CurrentScaling (per-tensor scale from the current tensor), MXFP8BlockScaling (32-value blocks, E8M0 power-of-two scales, default E4M3), Float8BlockScaling (configurable blocks, FP32 scales constrained to powers of 2 by default) and NVFP4BlockScaling (16-value blocks with E4M3 scales plus a per-tensor FP32 scale; 16x16 2D blocks for weights; stochastic rounding for gradients).**
- Location: NVIDIA/TransformerEngine v2.21.0, `transformer_engine/common/recipe/__init__.py` lines 29 to 52 (Format), 176 to 267 (DelayedScaling), 289 to 321 (Float8CurrentScaling), 345 to 384 (MXFP8BlockScaling), 400 to 430 (Float8BlockScaling), 502 to 530 (NVFP4BlockScaling).
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/TransformerEngine/blob/7457e47d26d9d02dfb783007335dfbe75e1b90a8/transformer_engine/common/recipe/__init__.py | Tier 1, code | code behaviour, default value | "HYBRID : FP8 tensors in the forward pass are in e4m3 format, FP8 tensors in the backward pass are in e5m2 format"; "E4M3 = _FormatHelper(max_fwd=448, max_bwd=448)", "E5M2 = _FormatHelper(max_fwd=57344, max_bwd=57344)"; DelayedScaling: "Use the delayed scaling factor strategy. Use scale factor from previous iteration and record amax history of `amax_history_len` steps." with "fp8_format: Format = Format.HYBRID" and "amax_history_len: int = 1024"; "new_scaling_factor = (FP8_MAX / amax) / (2 ^ margin)"; Float8CurrentScaling: "Use the per-tensor current scaling factor strategy."; MXFP8BlockScaling: "Each group of 32 consecutive values is scaled together using their own scaling factor. The type of the scaling factor is E8M0 (8 bits of exponent, 0 bits of mantissa), equivalent to scaling by a power of 2." with "fp8_format: Format = Format.E4M3"; Float8BlockScaling: "The scaling factors are float32 containers. They will by default be constrained to powers of 2."; NVFP4BlockScaling: "This is a 2-level block scaling strategy. In level 1, each group of 16 consecutive values is scaled together using their own scaling factor. The type of the scaling factor is E4M3 (4 bits of exponent, 3 bits of mantissa). In level 2, a global per tensor FP32 scaling factor is used to scale the entire tensor." "For weight tensors a variant of the NVFP4 quantization is used, where a single scaling factor is shared by a 2D block of 16x16 elements." "When quantizing gradients, stochastic rounding is applied". (accessed 2026-10-30)
- Use in dive: the recipe names a reader will see in Megatron-LM, NeMo and TorchTitan configs, with what each scales. Practical. Register 03 owns how each framework exposes them.

**T01-45. Transformer Engine gates the recipes by GPU generation: FP8 needs compute capability 8.9 or higher (Hopper is 9.0), FP8 block scaling needs 9.0 and CUDA 12.9 or later, MXFP8 and NVFP4 need 10.0 (Blackwell). With no recipe given, TE picks MXFP8BlockScaling on Blackwell and DelayedScaling on Hopper.**
- Location: NVIDIA/TransformerEngine v2.21.0, `transformer_engine/pytorch/quantization.py` lines 151 to 187 and 261 to 273.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/TransformerEngine/blob/7457e47d26d9d02dfb783007335dfbe75e1b90a8/transformer_engine/pytorch/quantization.py | Tier 1, code | code behaviour, default value | "if get_device_compute_capability() >= (9, 0):  # hopper and above return True"; "Device compute capability 8.9 or higher required for FP8 execution."; "if get_device_compute_capability() >= (10, 0):  # blackwell and above return True, ''" and "Device compute capability 10.0 or higher required for MXFP8 execution."; "Device compute capability 10.0 or higher required for NVFP4 execution."; "FP8 block scaled GEMM requires compute capability 9.0 or higher and CUDA >= 12.9."; `get_default_fp8_recipe`: "if check_mxfp8_support()[0]: return MXFP8BlockScaling()" ... "return DelayedScaling()". (accessed 2026-10-30)
- Use in dive: the per-instance precision table: p5 and p5en (H100, H200) run BF16 and FP8 with per-tensor or block scaling; p6-b200 (B200) adds MXFP8 and NVFP4 in Transformer Engine. Practical: the same config can silently change recipe when moved from Hopper to Blackwell if it relies on the default.

**T01-46. DeepSeek-V3 trains with FP8 GEMMs for all three matmuls of each linear layer (forward, activation gradient, weight gradient), E4M3 on all tensors, fine-grained scales (1x128 tiles for activations, 128x128 blocks for weights) computed online, and promotion of partial sums to FP32 every 128 elements because H800 FP8 accumulation keeps "around 14 bits".**
- Location: 2412.19437v2, Sec 3.3.1 and 3.3.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint (first-party lab) | production report | "all three GEMMs associated with the Linear operator, namely Fprop (forward pass), Dgrad (activation backward pass), and Wgrad (weight backward pass), are executed in FP8. This design theoretically doubles the computational speed compared with the original BF16 method." "(1) for activations, we group and scale elements on a 1x128 tile basis (i.e., per token per 128 channels); and (2) for weights, we group and scale elements on a 128x128 block basis (i.e., per 128 input channels per 128 output channels)." "we observe that the accumulation precision of FP8 GEMM on NVIDIA H800 GPUs is limited to retaining around 14 bits, which is significantly lower than FP32 accumulation precision." "Once an interval of N_C is reached, these partial results will be copied to FP32 registers on CUDA Cores, where full-precision FP32 accumulation is performed." "setting N_C = 128 elements, equivalent to 4 WGMMAs, represents the minimal accumulation interval that can significantly improve precision without introducing substantial overhead." "In contrast to the hybrid FP8 format adopted by prior work ..., which uses E4M3 (4-bit exponent and 3-bit mantissa) in Fprop and E5M2 (5-bit exponent and 2-bit mantissa) in Dgrad and Wgrad, we adopt the E4M3 format on all tensors for higher precision." "we calculate the maximum absolute value online for each 1x128 activation tile or 128x128 weight block." (accessed 2026-10-30)
- Use in dive: the fine-grained-scaling mental model that MXFP8 later standardised in hardware (32-element blocks, T01-48). Contrast with Transformer Engine's DelayedScaling default on Hopper (T01-45): per-tensor scale from history versus per-block scale from the current values.

**T01-47. DeepSeek-V3 keeps the embedding, output head, MoE gating, normalisation and attention in BF16 or FP32, keeps FP32 master weights and FP32 gradients for accumulation, stores AdamW moments in BF16, and reports a relative loss error against BF16 "consistently below 0.25%" in validation runs of about 1T tokens on two smaller models.**
- Location: 2412.19437v2, Sec 3.3 (introduction), 3.3.1, 3.3.3; Appendix B.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint (first-party lab) | ablation, production report | "we maintain the original precision (e.g., BF16 or FP32) for the following components: the embedding module, the output head, MoE gating modules, normalization operators, and attention operators." "we store the master weights, weight gradients, and optimizer states in higher precision." "We adopt the BF16 data format instead of FP32 to track the first and second moments in the AdamW (Loshchilov and Hutter, 2017) optimizer, without incurring observable performance degradation. However, the master weights (stored by the optimizer) and gradients (used for batch size accumulation) are still retained in FP32 to ensure numerical stability throughout training." "We validate the proposed FP8 mixed precision framework on two model scales similar to DeepSeek-V2-Lite and DeepSeek-V2, training for approximately 1 trillion tokens ... compared with the BF16 baseline, the relative loss error of our FP8-training model remains consistently below 0.25%, a level well within the acceptable range of training randomness." (accessed 2026-10-30)
- Use in dive: the memory calculator's alternative optimizer line: FP32 master (4) + BF16 m and v (2 + 2) = 8 bytes of optimizer state per parameter, against ZeRO's 12 (T01-9); with FP32 gradients (4) and a BF16 weight copy (2) that is 14 bytes per parameter [derived, our reading of which copies exist; the paper does not total it]. The accuracy cost is stated on proxy models, not on the 671B run itself.

**T01-48. Microscaling (MX) formats share one 8-bit power-of-two scale (E8M0) across a block of 32 elements: MXFP8 (E4M3 or E5M2 elements), MXFP6, MXFP4 (E2M1) and MXINT8. In the MX paper's training flow, matmuls run in MX, vector operations in BF16 or FP32, and an FP32 master copy of the weights is updated each step.**
- Location: 2310.10537v3, Sec 2, Table 1; Sec 4.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.10537v3 | Tier 3, preprint (multi-vendor: Microsoft, AMD, Intel, Meta, NVIDIA, Qualcomm) | definition | "A basic unit of data in an MX format represents a vector of k numbers and consists of a single shared scale X and k scalar elements". "All concrete MX formats use E8M0 (an 8-bit exponent) as the format for the shared scale." Table 1: "MXFP8 32 E8M0 8 FP8 (E4M3 / E5M2) 8", "MXFP6 32 E8M0 8 FP6 (E2M3 / E3M2) 6", "MXFP4 32 E8M0 8 FP4 (E2M1) 4", "MXINT8 32 E8M0 8 INT8 8". "Transposing a 2D matrix in an MX format changes the axis of the shared scale - i.e., conversion to MX format and transposing are not commutative operations." "Vector operations (e.g., layernorm, Softmax, GELU, and residual add) are performed in a scalar floating-point format like Bfloat16 or FP32. ... A master copy of the weights is kept in FP32, and this copy is updated in each training step." (accessed 2026-10-30)
- Use in dive: mental model for block scaling: an MXFP8 tensor costs 8.25 bits per element [derived: 8 + 8/32]. The transpose note explains why Transformer Engine quantises a tensor twice (row-wise and column-wise) for forward and backward (T01-44). The OCP MX specification v1.0 itself was not fetched (U01-7).

**T01-49. NVFP4 uses 16-element blocks with E4M3 block scales plus a per-tensor FP32 scale. NVIDIA lists Blackwell Tensor Core speed-ups over BF16 of 2x for MXFP8 and 4x (GB200) or 6x (GB300) for MXFP4 and NVFP4.**
- Location: 2509.25149v2, Sec 2, Table 1 "NVIDIA Blackwell Tensor Cores".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25149v2 | Tier 3, preprint (first-party vendor) | definition, vendor specification | "by reducing the block size from 32 to 16 elements, NVFP4 narrows the dynamic range within each block, better fitting values into the FP4 range. Second, block scale factors are stored in E4M3 rather than UE8M0, trading some exponent range for additional mantissa bits. Third, an FP32 scale is applied at the tensor level to retain the range of block scales." Table 1 rows: "MXFP8 E5M2/E4M3 UE8M0 32 2× 2×", "MXFP6 E3M2/E2M3 UE8M0 32 2× 2×", "MXFP4 E2M1 UE8M0 32 4× 6×", "NVFP4 E2M1 E4M3 16 4× 6×" (columns: Format, Element, Scale, Block, Speedup vs. BF16 GB200, GB300). "Tensor Cores deliver FP4 computations at 2× (on GB200 chips) and 3× (on GB300 chips) higher math throughput rates compared to FP8." (accessed 2026-10-30)
- Use in dive: the format ladder for p6-b200 and the GB200/GB300 UltraServers. The speed-ups are vendor-stated matmul rates, not end-to-end step times [vendor claim].

**T01-50. NVIDIA's NVFP4 pretraining run (a 12B hybrid Mamba-Transformer, 10T tokens) tracked its FP8 baseline within 1% relative loss in the stable phase, widening to slightly above 1.5% during learning-rate decay; MMLU-Pro 62.58% against 62.62%. It kept 16% of linear layers (first two and last eight blocks) in BF16 and used Random Hadamard transforms, 2D weight scaling and stochastic rounding of gradients.**
- Location: 2509.25149v2, Abstract, Sec 3 (Figure 2, Table 2), Sec 4 and Appendix.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25149v2 | Tier 3, preprint (first-party vendor) | ablation, benchmark claim (author reported) | "We validate our approach by training a 12-billion-parameter model on 10 trillion tokens". "the relative loss error of NVFP4 remains consistently below 1%, and widens to slightly above 1.5% as the learning rate is decayed towards the end of training." "the model attains an MMLU-pro accuracy of 62.58%, nearly matching the 62.62%" "We report training results for a 12B-parameter hybrid Mamba-Transformer model trained on 10T tokens". "keeping the first two blocks in addition to the final eight blocks (FFNs or Mamba-2, each has 2 linear layers) in BF16, representing 16% of the linear" layers. "changing precision from NVFP4 to BF16 (or potentially, MXFP8) during the decay phase mitigates the loss gap". (accessed 2026-10-30)
- Use in dive: where 4-bit training stood at the research date: one vendor-reported run on a hybrid architecture, compared against FP8 rather than BF16. Practical hedge for the dive: NVFP4 pretraining is demonstrated by its vendor, not established by independent production reports located in this research.

**T01-51. On Trainium2 the Tensor Engine takes cFP8, FP16, BF16, TF32 and FP32 inputs, supports adjustable exponent bias for cFP8 and hardware stochastic rounding. Per NeuronCore-v3 it delivers 158 cFP8 TFLOPS and 79 BF16 TFLOPS.**
- Location: AWS Neuron documentation, "NeuronCore-v3 Architecture", Tensor Engine section.
- Verdict: NEW
- Evidence: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html | Tier 1, first-party AWS documentation | documentation of support, vendor specification | "Tensor Engines support mixed-precision computations, including cFP8, FP16, BF16, TF32, and FP32 inputs and outputs. A NeuronCore-v3 Tensor Engine delivers 158 cFP8 TFLOPS, and 79 BF16/FP16/TF32 TFLOPS of tensor computations. Like NeuronCore-v2, NeuronCore-v3 supports control flow, dynamic shapes, and programmable rounding mode (RNE & Stochastic-rounding). NeuronCore-v3 also supports adjustable exponent biasing for the cFP8 data type." (accessed 2026-10-30)
- Use in dive: the Trainium2 row of the precision table. Eight cores x 79 = 632 BF16 TFLOPS per chip [derived], which does not equal the 667 on the Trainium2 page (T01-30); recorded as C01-4. Link: `deep-dives/silicon-memory-inference/src/sections/QuantizationAndPrecision.tsx` for inference formats.

### G. Micro-batch, gradient accumulation, global batch, critical batch size

**T01-52. Megatron-LM's notation fixes the batch identity: with pipeline, tensor and data-parallel sizes p, t, d over n = p x t x d GPUs, global batch B and micro-batch b, each pipeline runs m = (1/b) x (B/d) micro-batches per step, so B = b x m x d. Gradient accumulation is m: the optimizer steps once per B sequences.**
- Location: 2104.04473v5, Sec 3.1 "Notation"; Figure 3 caption.
- Verdict: CORRECT (the commonly stated "global batch = micro-batch x accumulation steps x data-parallel size")
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | definition | "(p, t, d): Parallelization dimensions. p for the pipeline-model-parallel size, t for the tensor-model-parallel size, and d for the data-parallel size. n: Number of GPUs. We require p · t · d = n. B: Global batch size (provided as input). b: Microbatch size. m = (1/b) · (B/d): Number of microbatches in a batch per pipeline." Figure 3 caption: "Each batch in this example consists of 8 microbatches ... The optimizer is stepped and weight parameters updated at" the end of each batch. (accessed 2026-10-30)
- Use in dive: the identity the parallelism calculator enforces. Worked check on Llama 3 405B (T01-6): 64 DP x 32 sequences per DP x 8,192 tokens = 16.8M tokens, the "16M" in Table 4 [derived]. Tensor and context parallelism do not appear in B; they split one micro-batch across GPUs.

**T01-53. McCandlish et al. define the critical batch size B_crit = E_min / S_min: below it, doubling the batch nearly halves the steps; above it, extra batch mostly wastes compute. At B = B_crit training takes twice the minimum steps and twice the minimum examples. The gradient noise scale predicts B_crit to an order of magnitude.**
- Location: 1812.06162v1, Sec 2.2 (Eq. 2.7 and 2.8), Sec 2.3 (Eq. 2.11 and 2.12), Figure 4 caption.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1812.06162v1 | Tier 3, preprint (first-party lab; no venue on the arXiv abstract page) | definition, formula | "when the batch size is much smaller than the noise scale, B ≪ B_noise, ... increasing the batch size B linearly increases the progress in loss. This is the small batch regime ... By contrast, when B ≫ B_noise, then the first term dominates, so that increasing B has almost no effect on the progress in loss. This is the large batch regime where increases in batch size do not speed up training and simply waste computation; the switch between the two occurs at B ≈ B_noise". Eq. 2.11, typeset as a display equation and rendered here in plain text: S/S_min − 1 = (E/E_min − 1)^−1. "We define the critical batch size by an empirical fit to the above equation, as B_crit = E_min/S_min." "When we choose B = B_crit, the two sides of Equation 2.11 are both 1, so that training takes twice as many passes through the training data as an optimally data-efficient (small-batch) run would take, and twice as many optimization steps as an optimally time-efficient (large-batch) run would take." Figure 4: "We define this 'critical batch size' to be the point at which compute efficiency drops below 50% optimal". (accessed 2026-10-30)
- Use in dive: the mental model for why data parallelism cannot grow without limit. DP size x micro-batch x accumulation = global batch, and the global batch has a useful ceiling, so past it more GPUs buy no speed unless they go to TP, PP or CP. Register 02 owns how that ceiling shapes the layout.

**T01-54. The critical batch size grows during training (as the gradient shrinks) and depends weakly on model size at fixed loss, which is the theoretical basis for ramping the batch.**
- Location: 1812.06162v1, Sec 2.4 bullets "Growth over training" and "Weak dependence on model size".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1812.06162v1 | Tier 3, preprint | definition (theoretical prediction) | "Growth over training: B will grow when the gradient decreases in magnitude, as long as the noise tr(Σ) stays roughly constant. Since |G| decreases as we approach the minimum of a smooth loss, we would expect B to increase during neural network training." "Weak dependence on model size: The number of model parameters in the neural network cancels in the noise scale, so we do not expect B to exhibit a strong dependence on model size (at fixed loss)." (accessed 2026-10-30)
- Use in dive: connects to Llama 3's 4M to 8M to 16M token schedule (T01-8), which Meta motivates by stability early and efficiency later, and to Chinchilla's own "1.5M → 3M" token batch, doubled "midway through training" (2203.15556v1 Table 4). Mental model: the batch a run can use productively rises as training progresses, so the GPU count a run can use productively rises too.

**T01-55. Llama 3 attributes its MFU drop from 43% (8,192 GPUs, DP 64) to 41% (16,384 GPUs, DP 128) to the smaller per-DP batch needed to hold the global batch constant: the global batch ceiling shows up directly as lost utilisation.**
- Location: 2407.21783v3, Sec 3.3.2 "GPU utilization"; Table 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab) | production report | "The slight drop in MFU to 41% on 16K GPUs with DP=128 compared to 43% on 8K GPUs with DP=64 is due to the lower batch size per DP group needed to keep the global tokens per batch constant during training." Table 4 "Batch size/DP": 32 at DP 64, 16 at DP 128. (accessed 2026-10-30)
- Use in dive: the production example for T01-53. With B fixed at 16M tokens, doubling GPUs halved the per-DP batch from 32 to 16 sequences, which means fewer micro-batches per pipeline and a larger relative pipeline bubble [our reading; the paper states only the batch cause].

### H. Scaling laws as far as they drive accelerator-hours

**T01-56. Chinchilla's compute-optimal rule scales parameters and tokens equally with compute; its Table 3 projections work out to about 20 tokens per parameter (1B on 20.2B tokens, 10B on 205.1B, 67B on 1.5T).**
- Location: 2203.15556v1, Abstract, Table 2, Table 3.
- Verdict: CORRECT (the commonly quoted "20 tokens per parameter" is a reading of Table 3, not a sentence in the paper)
- Evidence: https://arxiv.org/abs/2203.15556v1 | Tier 3, preprint (first-party lab) | formula | "for compute-optimal training, the model size and the number of training tokens should be scaled equally: for every doubling of model size the number of training tokens should also be doubled." Table 2: "1. Minimum over training curves 0.50 ... 0.50", "Kaplan et al. (2020) 0.73 0.27". Table 3 rows: "1 Billion 1.21e+20 ... 20.2 Billion", "10 Billion 1.23e+22 ... 205.1 Billion", "67 Billion 5.76e+23 1 1.5 Trillion", "175 Billion 3.85e+24 6.7 3.7 Trillion". (accessed 2026-10-30)
- Use in dive: the compute-optimal anchor for "how many tokens". Practical arithmetic: C = 6ND with D = 20N gives C = 120N^2 [derived]; for 70B that is 5.9e23 FLOPs and 1.4T tokens [derived], which is Chinchilla's own 70B run (1.4T tokens).

**T01-57. Meta fit its own compute-optimal law (N*(C) = A C^alpha with alpha = 0.53, A = 0.29) and it predicted a 402B model on 16.55T tokens for 3.8 x 10^25 FLOPs; Meta chose 405B on 15.6T. It trained the 8B and 70B models "much longer than is compute-optimal" because they "perform better than compute-optimal models at the same inference budget".**
- Location: 2407.21783v3, Sec 1 and Sec 3.2.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint (first-party lab) | production report | "we assume a power-law relation between compute budget, C, and the optimal number of training tokens, N*(C): N*(C) = AC^α. We fit A and α using the data from Figure 2. We find that (α, A) = (0.53, 0.29) ... Extrapolation of the resulting scaling law to 3.8 × 10^25 FLOPs suggests training a 402B parameter model on 16.55T tokens." "While our scaling laws suggest our flagship model is an approximately compute-optimal size for our training budget, we also train our smaller models for much longer than is compute-optimal. The resulting models perform better than compute-optimal models at the same inference budget." (accessed 2026-10-30)
- Use in dive: over-training made concrete. 405B at 15.6T is 38 tokens per parameter; 8B at about 15T is about 1,870 tokens per parameter, roughly 90 times the Chinchilla ratio [derived from T01-3, T01-5, T01-7]. Mental model: a model trained once and served billions of times is sized for inference cost, and the training bill grows accordingly. Note N*(C) in Meta's notation is tokens, not parameters.

**T01-58. The training-time identity used throughout this register is time = 6ND / (accelerators x peak x MFU), with MFU defined on 6N(+attention) model FLOPs (T01-18). No single primary source located in this research prints it in that form; Megatron-LM prints the recomputation variant 8TP/(nX) (T01-23).**
- Location: assembled from 2204.02311v5 Appendix B (MFU definition) and 2104.04473v5 Eq. 4.
- Verdict: NEW [our reading]
- Evidence: https://arxiv.org/abs/2204.02311v5 and https://arxiv.org/abs/2104.04473v5 | Tier 3 | formula | PaLM: "the model FLOPs utilization is the ratio of the achieved throughput in tokens per second to the theoretical peak throughput R = P / (6N + 12LHQT)." Rearranged: tokens per second = MFU x P / (6N + 12LHQT), so time for D tokens = D x (6N + 12LHQT) / (MFU x P) [derived]. Megatron: "End-to-end training time ≈ 8TP/(nX)". (accessed 2026-10-30)
- Use in dive: the "how long and how many GPUs" calculator. Section 3 W7 checks it against Llama 3 405B and W8 applies it to the reference instances.

### I. Optimizers that change the memory budget

**T01-59. 8-bit optimizers quantise Adam's two states block-wise (blocks of 2,048) to 8 bits: Adam's states drop from 8 bytes per parameter to 2. The embedding layer keeps 32-bit states for stability; the authors report matching 32-bit results and up to 8.5 GB saved on a 1.5B model.**
- Location: 2110.02861v2, Sec 1 (introduction), Sec 1.1 "Stateful Optimizers", Sec 2.1 "Block-wise Quantization", Sec 2.3 "Stable Embedding Layer", Sec 3 (experimental setup) and Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2110.02861v2 | Tier 3, peer-reviewed (ICLR 2022, per arXiv comments "ICLR2022 spotlight version") | formula, ablation | "these optimizer states use 33-75% of the total memory footprint during training." "For 32-bit states, Momentum and Adam consume 4 and 8 bytes per parameter. That is 4 GB and 8 GB for a 1B parameter model. Our 8-bit non-linear quantization reduces these costs to 1 GB and 2 GB." "Block-wise dynamic quantization reduces this cost by chunking an input tensor into small blocks of size B = 2048". "we find that the stability of training improves significantly if we use 32-bit optimizer states for the embedding layers. This is the only layer that uses 32-bit optimizer states." Table 1 row: "8-bit Adam LM Multiple Transformer-1.5B 9.0 297 days 8.5 GB". (accessed 2026-10-30)
- Use in dive: an alternative optimizer row for the memory calculator. With 16-bit weights and gradients and an FP32 master copy, 8-bit Adam gives 2 + 2 + 4 + 2 = 10 bytes per parameter against 16 [derived; the paper does not total it and its experiments train in 16-bit "for most experiments"]. The evidence is at 1.5B scale, far below the reference models.

**T01-60. Adafactor replaces Adam's per-parameter second moment for an n x m weight matrix with per-row and per-column sums (n + m values instead of nm), and can drop momentum entirely, leaving "very little auxiliary storage in the optimizer".**
- Location: 1804.04235v1, Abstract, Sec 3 "Factored Second Moment Estimation", Algorithm 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1804.04235v1 | Tier 3, preprint (no venue on the arXiv abstract page) | formula | "Maintaining these per-parameter second-moment estimators requires memory equal to the number of parameters. For the case of neural network weight matrices, we propose maintaining only the per-row and per-column sums of these moving averages, and estimating the per-parameter second moments based on these sums." "Combining these methods and dropping momentum, we achieve comparable results to the published Adam regime in training the Transformer model on the WMT 2014 English-German machine translation task, while using very little auxiliary storage in the optimizer." Algorithm 2: "Adam for a matrix parameter X with factored second moments and first moment decay parameter β1 = 0." Sec 3: "space proportional to n + m rather than nm". (accessed 2026-10-30)
- Use in dive: the lower bound of the optimizer line. For a Llama 3.1 8B MLP matrix (4,096 x 14,336) the factored second moment is 18,432 values against 58.7M [derived]. Evidence is from translation models; this research located no Llama-scale production report using it.

**T01-61. Muon keeps one momentum buffer where AdamW keeps two, so its optimizer state is half of AdamW's under ZeRO-1; Moonshot reports about 2x compute efficiency against AdamW in its scaling-law runs, and Distributed Muon's communication is 1 to 1.25 times Distributed AdamW's.**
- Location: 2502.16982v1, Abstract, Sec 1 (contributions), Sec 3.1 "Analysis" bullets.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2502.16982v1 | Tier 3, preprint (first-party lab) | formula, benchmark claim (author reported) | "Memory Usage. Muon uses only one momentum buffer, while AdamW uses two momentum buffers. Therefore, the additional memory used by the Muon optimizer is half of Distributed AdamW." "Overall, the communication workload of Distributed Muon is (1, 1.25] of that of Distributed AdamW. The upper-bound is calculated as that the communication of Distributed Muon is 4 (fp32 G reduce-scatter) + 2 (bf16 Muon gather) + 4 (fp32 P all-gather), while Distributed AdamW is 4 + 4." "Muon achieves comparable performance to AdamW trained counterparts while requiring only approximately 52% of the training FLOPs." (accessed 2026-10-30)
- Use in dive: a newer optimizer with a primary-source memory statement, as the area spec requires. Memory row [derived]: FP32 master (4) + FP32 momentum (4) = 8 bytes of optimizer state against AdamW's 12, so 12 bytes per parameter in total with BF16 weights and gradients. Muon applies to matrix parameters only: "In practice, AdamW is used in couple with Muon to handle non-matrix based parameters, like RMSNorm, LM head, and embedding parameters", so for Llama 3.1 8B the 1.05B embedding and head parameters (T01-3) would stay on AdamW's 16 bytes. The 2x efficiency is an author claim about convergence, not a systems number.

### J. Memory budget details the calculator needs

**T01-62. Pipeline parallelism does not divide activation memory by p under 1F1B: the first stage must hold p micro-batches of L/p layers, so it stores L layers' worth of activations whatever p is (scaled by 1 + (p - 1)/(pm) for the interleaved schedule with m model chunks). Llama 3 names the same first-stage imbalance in production.**
- Location: 2205.05198v1, Sec 4.2.3 (Eq. 5); 2407.21783v3, Sec 3.3.2 "Pipeline parallelism improvements".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | "pipeline parallelism does not uniformly divide the total memory required for activations by p. This is due to the overlapping that pipeline parallel schedules introduce to reduce the pipeline bubble". "To keep the pipeline pressurized and avoid extra idle time, the first stage must store activations for p microbatches ... Each stage contains L/p layers so the first stage must store p × L/p = L layers worth of activations regardless of the pipeline parallel size p." "the interleaving schedule developed in Megatron-LM [13] requires storing activations for L(1 + (p−1)/(pm)) layers". Llama 3 (https://arxiv.org/abs/2407.21783v3): "Memory imbalance. Existing pipeline parallelism implementations lead to imbalanced resource consumption. The first stage consumes more memory due to the embedding and the warm-up micro-batches." (accessed 2026-10-30)
- Use in dive: practical, and counter-intuitive. In the memory calculator, PP divides weights, gradients and optimizer state by p but not the first stage's activations: per-GPU activations are sbhL x coefficient / t for one micro-batch in flight per stage [derived from Eq. 5]. Register 02 owns the schedules.

**T01-63. PyTorch's caching allocator holds freed memory for reuse, so `nvidia-smi` shows reserved rather than allocated memory; at v2.15.0 the allocator is configured through `PYTORCH_ALLOC_CONF` (with `PYTORCH_CUDA_ALLOC_CONF` kept "only for backward compatibility"), and `expandable_segments` (experimental, default False) grows one segment per stream to avoid the slivers that varying allocation sizes leave behind.**
- Location: pytorch/pytorch v2.15.0, `docs/source/notes/cuda.md`, "Memory management" and "Optimizing memory usage with PYTORCH_ALLOC_CONF" (lines 530 to 662).
- Verdict: STALE (for the commonly repeated advice to set `PYTORCH_CUDA_ALLOC_CONF`: still accepted, now documented as an alias; the release that introduced `PYTORCH_ALLOC_CONF` was not located, U01-8)
- Evidence: https://github.com/pytorch/pytorch/blob/31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457/docs/source/notes/cuda.md (tag v2.15.0) | Tier 1, official framework documentation in the source tree | documentation of support, default value | "PyTorch uses a caching memory allocator to speed up memory allocations. This allows fast memory deallocation without device synchronizations. However, the unused memory managed by the allocator will still show as if used in `nvidia-smi`." "The behavior of the caching allocator can be controlled via the environment variable `PYTORCH_ALLOC_CONF`. `PYTORCH_CUDA_ALLOC_CONF` is its alias and is provided only for backward compatibility." "`expandable_segments` (experimental, default: `False`) If set to `True`, this setting instructs the allocator to create CUDA allocations that can later be expanded to better handle cases where a job changing allocation sizes frequently". "With models 50+ layers deep, this pattern might repeat 50+ times creating many slivers." "`expandable_segments` allows the allocator to create a segment initially and then expand its size later when more memory is needed. Instead of making one segment per allocation, it tries to make one segment (per stream) that grows as necessary." (accessed 2026-10-30)
- Use in dive: the "fragmentation" line of the memory calculator gets a mechanism and a knob. Practical: measure with `max_memory_allocated` and `max_memory_reserved` (register 07 owns the tooling); the gap between them is the fragmentation the calculator's headroom term stands for (T01-11).

---

## 3. Worked numbers

Every output here is [derived]. Inputs cite entry IDs. GB means 10^9 bytes. Scripts used: plain Python arithmetic over the inputs listed; no downloaded file was executed.

### W1. Parameter counts, reconciled to Meta's published totals

Inputs: shapes from T01-1 (layers L, model dimension h, FFN F, heads a, KV heads 8, head dimension 128), V = 128,256 (T01-2), untied output head and SwiGLU with three matrices (T01-3, T01-4), RMSNorm with one weight vector of size h (two per layer plus a final one; `models/llama3/model.py` lines 242, 243, 270 at v0.2.0).

Per layer:
- Attention = Q (h x h) + K (h x 1,024) + V (h x 1,024) + O (h x h) = 2h^2 + 2,048h. 8B: 2 x 4,096^2 + 2,048 x 4,096 = 41,943,040. 70B: 2 x 8,192^2 + 2,048 x 8,192 = 150,994,944.
- MLP = 3 x h x F. 8B: 3 x 4,096 x 14,336 = 176,160,768. 70B: 3 x 8,192 x 28,672 = 704,643,072.
- Norms = 2h. 8B: 8,192. 70B: 16,384.
- Layer total. 8B: 218,112,000. 70B: 855,654,400.

Whole model:

| | 8B | 70B | 405B |
|---|---|---|---|
| L x layer | 6,979,584,000 | 68,452,352,000 | 401,650,679,808 |
| Final norm (h) | 4,096 | 8,192 | 16,384 |
| Embedding (V x h) | 525,336,576 | 1,050,673,152 | 2,101,346,304 |
| Output head (V x h) | 525,336,576 | 1,050,673,152 | 2,101,346,304 |
| **Total** | **8,030,261,248** | **70,553,706,496** | **405,853,388,800** |
| Published total (T01-3) | 8,030,261,248 | 70,553,706,496 | 405,853,388,800 |
| Embedding + head share | 13.1% | 3.0% | 1.0% |
| Matmul parameters N_mm (layers' linear weights + head, excluding the embedding lookup and norms) | 7,504,658,432 | 69,501,714,432 | 403,747,897,344 |

All three totals match exactly, which confirms V = 128,256 (not 128,000) and an untied head. N_mm is the N that belongs in 6N for FLOPs: the embedding is a table lookup with no multiply-adds (Kaplan's Table 1 gives it 4d_model FLOPs per token, T01-15). Using the full count overstates 8B FLOPs by 7.0% [8,030,261,248 / 7,504,658,432 = 1.070] and 70B by 1.5%. Memory always uses the full count.

### W2. Bytes per parameter by component, and the model-state total

Inputs: T01-9 (ZeRO's mixed-precision Adam), T01-10, T01-41 (BF16 in place of FP16, same 2 bytes), W1 totals.

| Component | Bytes per parameter | 8B (GB) | 70B (GB) |
|---|---|---|---|
| BF16 working weights | 2 | 16.06 | 141.11 |
| BF16 gradients | 2 | 16.06 | 141.11 |
| FP32 master weights | 4 | 32.12 | 282.21 |
| FP32 Adam first moment (m) | 4 | 32.12 | 282.21 |
| FP32 Adam second moment (v) | 4 | 32.12 | 282.21 |
| **Model states** | **16** | **128.48** | **1,128.86** |

Neither fits one 80 GB H100 (T01-27) or one 141 GB H200 (T01-28): the 8B model states alone are 1.6x an H100. Sharding is mandatory for full fine-tuning or pre-training of either model. How the 16 bytes divide across ranks under ZeRO stage 1, 2 or 3 (FSDP) for a data-parallel size d (formulae from 1910.02054v3 Sec 5, which register 02 owns; the per-GPU values follow by arithmetic):

| Sharding over d GPUs | Formula (bytes per parameter per GPU) | 8B, d = 8 | 8B, d = 32 | 70B, d = 32 | 70B, d = 256 |
|---|---|---|---|---|---|
| None (plain DDP) | 16 | 128.48 | 128.48 | 1,128.86 | 1,128.86 |
| Optimizer sharded (stage 1) | 4 + 12/d | 44.17 | 35.13 | 308.67 | 285.52 |
| + gradients sharded (stage 2) | 2 + 14/d | 30.11 | 19.57 | 171.97 | 144.97 |
| + weights sharded (stage 3, FSDP) | 16/d | 16.06 | 4.02 | 35.28 | 4.41 |

Alternative optimizer rows for the calculator (bytes per parameter, all [derived] from the cited entries, assuming BF16 weights and gradients unless stated):

| Optimizer setup | Weights | Grads | Master | States | Total | Source |
|---|---|---|---|---|---|---|
| AdamW, FP32 master and moments | 2 | 2 | 4 | 8 | 16 | T01-9 |
| AdamW, BF16 moments, FP32 master and FP32 gradients (DeepSeek-V3 style) | 2 | 4 | 4 | 4 | 14 | T01-47 |
| 8-bit Adam, FP32 master | 2 | 2 | 4 | 2 | 10 | T01-59 |
| Muon on matrix parameters, FP32 master and momentum | 2 | 2 | 4 | 4 | 12 | T01-61 |
| Adafactor without momentum, factored second moment | 2 | 2 | 4 | about 0 | about 8 | T01-60 |

The FP32 master copy is the floor that survives every row (T01-39, T01-41, T01-47, T01-48).

### W3. Activation memory per layer for Llama 3.1 (adapting 2205.05198 to Llama's layer)

Inputs: the method and byte conventions of T01-31 (2 bytes per 16-bit element, count every tensor the backward pass reads); Llama's layer from T01-4 and `models/llama3/model.py` (RMSNorm; no dropout module anywhere in that file; GQA with KV width 1,024, SwiGLU with three matrices); FlashAttention stores Q, K, V and the output plus O(s) softmax statistics, never the s x s matrices (T01-38). Assumptions [our reading]: a fused SwiGLU that saves its two inputs, not also the SiLU output; per-row softmax statistics ignored (a x s x b x 4 bytes: 1.6% of one 2sbh term for both models [4a / 2h], under 0.1% of the layer total); RoPE applied in place before the attention kernel.

Attention block, per layer:
- RMSNorm input: 2sbh
- Q/K/V projections' shared input (the norm output): 2sbh
- Q after RoPE: 2sbh
- K and V: 2 x 2sb x 1,024
- Attention output (read by the FlashAttention backward and by the output projection's weight gradient): 2sbh
- Sum: 8sbh + 4,096sb

MLP block, per layer:
- RMSNorm input: 2sbh
- w1 and w3 shared input (the norm output): 2sbh
- w1 output and w3 output (the SwiGLU inputs): 2 x 2sbF
- w2 input (the SwiGLU product): 2sbF
- Sum: 4sbh + 6sbF

Per layer total = sbh x (12 + 4,096/h + 6F/h):
- 8B: 12 + 1 + 6 x 3.5 = **34.0 sbh** bytes.
- 70B: 12 + 0.5 + 21 = **33.5 sbh** bytes.

The coefficient lands on Megatron's 34 by a different route: Llama drops the dropout masks (2sbh) and stores less for K and V, but its FFN is 3.5h wide with an extra matrix. An unfused SwiGLU that also saves the SiLU output adds 2sbF, giving 41.0 (8B) and 40.5 (70B).

The GPT formula with eager attention, sbh(34 + 5as/h), would give 5 x 32 x 8,192 / 4,096 = 320 extra for 8B at s = 8,192 (and 5 x 64 x 8,192 / 8,192 = 320 for 70B): 354 sbh per layer, ten times the FlashAttention figure.

### W4. Activation memory at micro-batch 1 and sequence 8,192

Inputs: W3 coefficients; sbh = 8,192 x 1 x 4,096 = 33,554,432 (8B) and 8,192 x 8,192 = 67,108,864 (70B); Table 2 structure from T01-32, re-derived for Llama: with tensor parallelism and no sequence parallelism, the two RMSNorm inputs and the two shared projection inputs (8sbh) stay replicated, the rest divides by t; with sequence parallelism everything divides by t; full recomputation stores the 2sbh layer input per layer (T01-32 "sbh(2)") plus one layer's working set during its backward. Logits: FP32 at 4sbV (T01-35), V = 128,256.

| Setting (per GPU, one micro-batch in flight per layer) | 8B per layer | 8B all 32 layers | 70B per layer | 70B all 80 layers |
|---|---|---|---|---|
| No parallelism, no recomputation | 1.141 GB | 36.51 GB | 2.248 GB | 179.85 GB |
| GPT formula with eager attention (for contrast) | 11.88 GB | 380.1 GB | 23.76 GB | 1,900.5 GB |
| TP 2, no SP | 0.705 GB | 22.55 GB | 1.393 GB | 111.40 GB |
| TP 2 + SP | 0.570 GB | 18.25 GB | 1.124 GB | 89.93 GB |
| TP 4 + SP | 0.285 GB | 9.13 GB | 0.562 GB | 44.96 GB |
| TP 8, no SP | 0.377 GB | 12.08 GB | 0.751 GB | 60.06 GB |
| TP 8 + SP | 0.143 GB | 4.56 GB | 0.281 GB | 22.48 GB |
| Full recomputation, no TP: stored inputs + one layer's working set | 0.067 GB stored | 2.15 + 1.14 = 3.29 GB | 0.134 GB stored | 10.74 + 2.25 = 12.99 GB |

Plus the FP32 logits, 4 x 8,192 x 128,256 = 4.20 GB per sequence (divided by t when the head is vocabulary-parallel), and their BF16 source, 2.10 GB, while both are live. For 8B the logits are 11.5% of the 36.51 GB layer total: not negligible, unlike the GPT-era case T01-35 quotes.

Under 1F1B pipeline parallelism the first stage still holds all L layers' worth of these activations (T01-62), so the "all layers" column is the per-GPU figure for the first stage whatever p is, multiplied by the micro-batch size b.

Recomputation cost to pair with each row: full recomputation adds one forward pass, about 33% more FLOPs (T01-34, T01-37); with FlashAttention the attention core is recomputed in every row anyway (T01-38).

### W5. Memory budget on a real instance (examples for the calculator)

Inputs: W2, W4; H100 80 GB (T01-27); headroom for buffers, all-gathered layers and fragmentation is left unallocated and named, not modelled (T01-11, T01-63). Choice of layout belongs to register 02; these rows only check fit.

**Llama 3.1 8B on one p5.48xlarge (8x H100 80 GB), FSDP (stage 3) over 8 GPUs, s = 8,192, b = 1:**
- Model states: 16.06 GB (W2)
- Activations, no recomputation: 36.51 GB (W4)
- Logits FP32 + BF16: 4.20 + 2.10 = 6.30 GB
- Sum: 58.9 GB, leaving 21.1 GB of the 80 GB for all-gathered BF16 layers (0.44 GB per 8B layer [218,112,000 x 2 bytes], two in flight with prefetch), communication buckets, allocator slack and CUDA context.
- At b = 2 the activations and logits double to 85.6 GB (101.7 GB with model states), which does not fit; full recomputation brings b = 2 back to 16.06 + 2 x (3.29 + 6.30) = 35.2 GB, at about 33% more compute.

**Llama 3.1 70B on 32 p5.48xlarge (256 H100), s = 8,192, b = 1, two candidate layouts:**
- TP 8 + SP inside each node, ZeRO stage 1 over DP 32: weights and gradients 4 x 70.55 / 8 = 35.28 GB; optimizer 12 x 70.55 / 256 = 3.31 GB; activations 22.48 GB (W4); logits / 8 = 0.79 GB (FP32 + BF16). Sum 61.9 GB: fits with 18 GB headroom, no recomputation.
- FSDP over all 256 GPUs, no TP: model states 4.41 GB; activations without recomputation 179.85 GB (does not fit); with full recomputation 12.99 GB + logits 6.30 GB, sum 23.7 GB: fits, at about 33% more compute and with every layer's weights all-gathered across 32 nodes each step.

The comparison is the trade the dive teaches: tensor parallelism buys activation memory with intra-node communication; recomputation buys it with FLOPs. Register 02 owns which wins on communication.

### W6. When attention FLOPs stop being small

Inputs: dense FLOPs per token = 6 x N_mm (W1, T01-14, T01-18); attention FLOPs per token = 12 x L x h x s for forward plus backward with no causal discount (PaLM's 12LHQT with H x Q = h, T01-18; equal to Megatron's 4Bs^2h forward per layer per Bs tokens, times 3, T01-17). A causal-aware kernel skips about half the score and value products; the "causal" columns halve the attention term (C01-2).

| s | 8B attention GF/token | 8B share (no causal discount) | 8B share (causal) | 70B attention GF/token | 70B share (no discount) | 70B share (causal) |
|---|---|---|---|---|---|---|
| 2,048 | 3.22 | 6.7% | 3.5% | 16.11 | 3.7% | 1.9% |
| 4,096 | 6.44 | 12.5% | 6.7% | 32.21 | 7.2% | 3.7% |
| 8,192 | 12.88 | 22.2% | 12.5% | 64.42 | 13.4% | 7.2% |
| 16,384 | 25.77 | 36.4% | 22.2% | 128.85 | 23.6% | 13.4% |
| 32,768 | 51.54 | 53.4% | 36.4% | 257.70 | 38.2% | 23.6% |
| 65,536 | 103.08 | 69.6% | 53.4% | 515.40 | 55.3% | 38.2% |
| 131,072 | 206.16 | 82.1% | 69.6% | 1,030.79 | 71.2% | 55.3% |

Dense FLOPs per token: 45.03 GF (8B), 417.01 GF (70B), 2,422.49 GF (405B).

Sequence length at which attention reaches a given share of per-token training FLOPs (solve 12Lhs / (6N_mm + 12Lhs) = share):

| Share | 8B (no discount) | 8B (causal) | 70B (no discount) | 70B (causal) | 405B (no discount) |
|---|---|---|---|---|---|
| 10% | 3,181 | 6,362 | 5,892 | 11,783 | 10,865 |
| 25% | 9,543 | 19,085 | 17,675 | 35,350 | 32,596 |
| 50% | 28,628 | 57,256 | 53,026 | 106,051 | 97,789 |

Reading: at Llama 3's 8K pre-training length, 6ND undercounts the 8B model's work by 14% (causal) to 29% (no discount) of the dense term and the 70B model's by 8% to 15% [12.88 / 45.03 and 64.42 / 417.01, halved for causal]; at the 128K long-context stage attention is the majority of the work for every size. The 50% crossover in closed form is s = N_mm / (2Lh) without the causal discount: it grows with N / (Lh), which is about 12h for a GPT-shaped layer, so wider models cross later. Llama 3 keeps long sequences to the last 800B tokens for this reason (T01-8).

### W7. The 6ND rule against Llama 3 405B's published run

Inputs: N = 405,853,388,800 (T01-3), D = 15.6 x 10^12 (T01-5), budget 3.8 x 10^25 (T01-5), MFU 38% to 43% and 380 to 430 TFLOPs per GPU (T01-6), 30.84M GPU-hours (T01-7), H100 dense BF16 peak 1,979 / 2 = 989.5 TFLOPS (T01-27).

1. 6ND = 6 x 405.85 x 10^9 x 15.6 x 10^12 = **3.80 x 10^25 FLOPs**, the paper's budget to the printed precision. The paper's budget is 6ND, not 6ND plus attention: at 8K the attention term would add 8.4% (no causal discount) or 4.2% (causal) [from W6, 202.94 / 2,422.49].
2. GPU-hours implied by Table 4's throughput: 3.80 x 10^25 / (430 x 10^12 FLOP/s) / 3,600 = **24.5M GPU-hours** at the best configuration; 26.4M at 400 TFLOPs; 27.8M at 380.
3. Same from MFU: time = 6ND / (GPUs x peak x MFU). At 41% MFU: 3.80 x 10^25 / (989.5 x 10^12 x 0.41) / 3,600 = **26.0M GPU-hours**, which is 66 days on 16,384 GPUs.
4. Published: **30.84M GPU-hours** (T01-7), 78 days if all of it ran on 16,384 GPUs.
5. Ratio: the 6ND estimate at Table 4 throughput accounts for 80% to 90% of the published GPU-hours (24.5 / 30.84 to 27.8 / 30.84). Implied end-to-end utilisation over the published hours: 3.80 x 10^25 / (30.84 x 10^6 x 3,600 x 989.5 x 10^12) = **34.6%**, against 38% to 43% MFU while running.
6. The 10% to 20% gap is consistent with what the published hours include beyond steady-state 8K pre-training: the long-context stage at lower MFU (38% at 131K, T01-6, with attention FLOPs that 6ND ignores), annealing and post-training, and lost work from 419 unexpected interruptions in a 54-day window (2407.21783v3 Sec 3.3.4, owned by register 04). The model card does not split the hours, so the attribution is [our reading] (U01-3).

Same arithmetic for the smaller models with D = 15T (the card's "15T+"): 8B, 6ND = 7.23 x 10^23, implied utilisation over 1.46M GPU-hours = 13.9%; 70B, 6.35 x 10^24 over 7.0M GPU-hours = 25.5%. Either the smaller models ran far below the 405B's MFU, or their published hours include substantially more than one 15T pass. The sources read do not say which (U01-3). For planning, the 405B ratio (actual hours about 1.1x to 1.3x the 6ND-at-running-MFU estimate) is the only one this research can anchor.

### W8. "How long and how many accelerators": the formula applied to the reference instances

Inputs: time = 6ND / (accelerators x peak x MFU) (T01-58); dense BF16 peaks per accelerator: H100 and H200 989.5 TFLOPS (T01-27, T01-28), B200 2,250 TFLOPS (T01-29), Trainium2 667 TFLOPS (T01-30); 8 accelerators per p5.48xlarge, p5en.48xlarge and p6-b200.48xlarge and 16 per trn2.48xlarge (instance counts are register 05's; used here as labels). **MFU = 40% is an assumption for illustration**, chosen inside Llama 3's measured 38% to 43% on H100 (T01-6); no MFU for B200 or Trainium2 at these model sizes was located in this research (U01-5). Results exclude attention FLOPs, restarts and every other overhead in W7 step 6.

| Run | Instance | Accelerator-hours | Instance-hours | Days on 32 instances |
|---|---|---|---|---|
| 8B, 1T tokens (C = 4.82 x 10^22) | p5.48xlarge or p5en.48xlarge | 33,800 | 4,230 | 5.5 |
| | p6-b200.48xlarge | 14,900 | 1,860 | 2.4 |
| | trn2.48xlarge | 50,200 | 3,140 | 4.1 |
| 70B, 1T tokens (C = 4.23 x 10^23) | p5.48xlarge or p5en.48xlarge | 297,000 | 37,100 | 48.4 |
| | p6-b200.48xlarge | 131,000 | 16,300 | 21.3 |
| | trn2.48xlarge | 441,000 | 27,500 | 35.9 |
| 70B, 15T tokens (C = 6.35 x 10^24) | p5.48xlarge or p5en.48xlarge | 4.46M | 557,000 | 725 |
| | p6-b200.48xlarge | 1.96M | 245,000 | 319 |

Read with W7: a published run took 1.1x to 1.3x this kind of estimate. The H100 and H200 rows are identical because the peak is identical (T01-28); H200's extra memory shows up as fewer recomputations or a simpler layout, which raises achieved MFU rather than peak. Converting instance-hours to cost belongs to register 05 (prices) and the EFA dive's Pricing section.

### W9. Cross-checks on published arithmetic

- Megatron-LM's GPT-3 estimate (T01-23): 8 x 300 x 10^9 x 175 x 10^9 / (1,024 x 140 x 10^12) = 2.93 x 10^6 s = 33.9 days; the paper prints 34 days.
- PaLM's MFU (T01-20): 238.3 x 10^3 x 6 x 540 x 10^9 / (275 x 10^12 x 6,144) = 45.7%; the paper prints 45.7%.
- Llama 3's Table 4 denominator: 430 / 0.43 = 400 / 0.41 (975.6) = 380 / 0.38 = about 1,000 TFLOPS, consistent with the H100's dense 989.5 after rounding of the published percentages.
- Llama 3's 16M-token batch: 64 x 32 x 8,192 = 16.78M; 128 x 16 x 8,192 = 16.78M; 8 x 16 x 131,072 = 16.78M (T01-6, T01-52).
- DeepSeek-V3 model FLOPs per GPU: 6 x 37 x 10^9 x 14.8 x 10^12 / (2.664 x 10^6 x 3,600) = 343 TFLOP/s per H800, excluding attention (T01-26).
- Chinchilla rule for 70B: D = 20N = 1.4T tokens, C = 120N^2 = 5.9 x 10^23 FLOPs (T01-56); the paper's Table 3 prints 5.76 x 10^23 for 67B.

---

## 4. Mental models worth teaching

1. **A training step is three passes over the weights and one update.** Forward costs 2 FLOPs per parameter per token, backward 4 (input gradient and weight gradient), so 6N; the update then reads gradients and optimizer state and writes new weights. What persists between steps is weights, gradients and optimizer state; activations live only from a micro-batch's forward to its backward. (T01-9, T01-10, T01-14, T01-18)
2. **The optimizer owns the memory, not the model.** Of the 16 bytes per parameter in mixed-precision Adam, 12 are optimizer state and the FP32 master copy. An 8B model needs 128 GB of model state before a single activation. (T01-9, W2)
3. **Two memory regimes, two kinds of remedy.** Model state scales with N and is cut by sharding (ZeRO, FSDP, TP, PP). Activations scale with tokens in flight (b x s) x h x L and are cut by recomputation, tensor plus sequence parallelism, or a smaller micro-batch. Pipeline parallelism does not cut the first stage's activations. (T01-12, T01-31, T01-32, T01-62, W4)
4. **Recomputation is a price list.** Full-layer recomputation costs about one extra forward pass (+33% FLOPs) and stores 2sbh per layer; selective recomputation costs single-digit percent; FlashAttention already recomputes the attention core, faster than storing it. That price is the gap between HFU and MFU. (T01-19, T01-21, T01-34, T01-36, T01-38)
5. **Attention FLOPs grow with sequence length; the rest does not.** Per token, dense work is fixed at 6N and attention adds 12Lhs. For Llama 3.1 8B attention is about a fifth of the work at 8K (an eighth with a causal kernel) and the majority past about 29K (no causal discount) or 57K (causal). (T01-17, T01-18, W6)
6. **MFU is tokens per second against a dense peak.** Divide by the dense figure for the precision you train in; vendor pages often print the 2:4 sparse figure, twice as large. Published dense-model MFU on H100 at scale sits around 40%. (T01-6, T01-19, T01-27, T01-29)
7. **Time to train is 6ND over accelerators x peak x MFU, and real runs take longer.** For Llama 3 405B, the published GPU-hours are 1.1x to 1.3x the estimate at the run's own measured throughput. (T01-58, W7)
8. **The global batch has a ceiling, and data parallelism hits it.** Global batch = micro-batch x accumulation x DP. Past the critical batch size more data-parallel GPUs waste compute, and at a fixed batch more GPUs lower MFU. (T01-24, T01-52, T01-53, T01-55)
9. **Lower precision is a story about scale granularity.** FP16 needs one loss scale per run; FP8 a scale per tensor; DeepSeek-V3 a scale per 1x128 tile; MXFP8 a power-of-two scale per 32 values; NVFP4 an FP8 scale per 16 values plus one per tensor. Each step down in bits moves the scale closer to the data. (T01-40, T01-42, T01-44, T01-46, T01-48, T01-49)
10. **The FP32 master copy survives every precision change.** FP16, BF16, FP8 and MX training all keep 4-byte master weights, because a 16-bit weight cannot absorb an update more than a few hundred to a few thousand times smaller than itself. (T01-13, T01-39, T01-41, T01-47, T01-48)
11. **Production models are over-trained on purpose.** Chinchilla-optimal is about 20 tokens per parameter; Llama 3.1 8B saw about 1,870, because the model is trained once and served many times. (T01-56, T01-57)

---

## 5. Contradictions

**C01-1. Llama 3 vocabulary: paper versus code.** The paper's Table 3 prints "Vocabulary Size 128,000" (T01-1). The tokenizer code at llama-models v0.2.0 adds 256 special and reserved tokens to the base ranks (T01-2), and only V = 128,256 reproduces Meta's published parameter counts exactly (T01-3, W1). Code is the authority: use 128,256. The paper's figure is the base vocabulary ("128K tokens").

**C01-2. The attention FLOPs term differs by a factor of two between sources.** Kaplan et al. count 2 n_layer n_ctx d_attn forward FLOPs per token (T01-15); Megatron-LM counts 4Bs^2h per layer forward (2Bs^2h for scores plus 2Bs^2h for values, T01-17) and PaLM 12LHQT for forward plus backward (T01-18), which per token is twice Kaplan's. Chinchilla counts both products and adds the softmax (T01-16). None of them states a causal-mask discount. A causal kernel skips about half of the score and value work, which is one reading of Kaplan's smaller term [our reading]. W6 reports both columns; the calculator should expose the choice.

**C01-3. "Output-layer activations are negligible" holds for GPT-era vocabularies, not for Llama's.** 2205.05198v1 states the embedding, final norm and output-layer activations are under 0.01% of the total for its 22B model (T01-35). For Llama 3.1 8B at s = 8,192 the FP32 logits alone are 4.20 GB against 36.51 GB for all layers, 11.5% [derived, W4]. Scope drift, not an error: the paper's statement is about its own configurations.

**C01-4. Trainium2 peak FLOPS: AWS documentation versus AWS documentation.** The Trainium2 page gives 667 BF16 and 1,299 FP8 TFLOPS per chip (T01-30); the NeuronCore-v3 page gives 79 BF16 and 158 cFP8 TFLOPS per core, and the Trainium2 page says each chip has eight cores, which totals 632 and 1,264 [derived] (T01-51), about 5% and 3% lower. No code settles a peak figure. Use the chip page's figure as the published chip peak and state the discrepancy; the two pages may assume different clocks (not stated on either, U01-13).

**C01-5. "52% of peak" (Megatron-LM) and "MFU" (PaLM and later) are different quantities.** Megatron-LM's throughput numbers count the recomputed forward pass (T01-22); PaLM's MFU excludes it by definition (T01-19). Comparing Megatron-LM's 52% with Llama 3's 38% to 43% MFU mixes HFU-like and MFU figures. 2205.05198v1 publishes both for the same runs (T01-21).

**C01-6. Llama 3's batch schedule wording.** "double these values to a batch size of 8M sequences of 8,192 tokens" (T01-8) follows "an initial batch size of 4M tokens", so doubling gives 8M tokens, not 8M sequences; Table 4's "Tokens/Batch 16M" (T01-6) is consistent with token units. Read as 8M tokens [our reading].

**C01-7. Which FP8 encoding for which tensor.** The FP8 proposal recommends E4M3 for weights and activations and E5M2 for gradients (T01-42), and Transformer Engine's DelayedScaling and Float8CurrentScaling default to that HYBRID split (T01-44). DeepSeek-V3 uses E4M3 for every tensor and credits its fine-grained scaling for making that safe (T01-46); Transformer Engine's MXFP8BlockScaling and Float8BlockScaling also default to E4M3 (T01-44). Not a contradiction once scaling granularity is in view: per-tensor scales need E5M2's range for gradients, per-block scales do not [our reading].

---

## 6. UNKNOWN register

**U01-1. Per-model `ffn_dim_multiplier` and `multiple_of` for Llama 3.1.** Tried: llama-models v0.2.0 (no SKU list at that tag; the v0.1.5 path `models/sku_list.py` returned 404); Hugging Face `config.json` and `params.json` are gated (401). Not needed for the calculators, which take Table 3's FFN widths directly. Close by: accept; hedge text "FFN widths are taken from the Llama 3 paper's Table 3."

**U01-2. Chinchilla's training sequence length.** Not stated in the extracted text of 2203.15556v1 (its Table 4 lists layers, heads, key/value size, d_model, learning rate and batch size "1.5M → 3M" tokens, with the note "we double the batch size midway through training", but no sequence length). Close by: wave 2 read of the Gopher paper (Rae et al. 2021), which Chinchilla follows, or accept the hedge "the context length behind Chinchilla's FLOP ratios is not stated in the paper".

**U01-3. What the Llama 3.1 model card's GPU-hours include.** The card says "the total GPU time required for training each model" (T01-7) without a split. W7 explains 80% to 90% of the 405B hours with 6ND at measured throughput, but 8B and 70B imply only 13.9% and 25.5% utilisation. Tried: the model card and the paper's Sec 3.3 and 3.4. Close by: wave 2 search of the paper's other sections and Meta's Llama 3.1 release material for per-stage hours; else hedge "Meta does not split the GPU-hours by stage."

**U01-4. H800 dense BF16 and FP8 peak from an NVIDIA source.** Needed to turn DeepSeek-V3's 343 TFLOP/s per GPU (T01-26) into an MFU. Not fetched. Close by: wave 2 fetch of an NVIDIA H800 specification, or hedge "DeepSeek-V3 reports no MFU".

**U01-5. Achieved MFU for dense Llama-class training on B200 and Trainium2.** W8 assumes 40% on every accelerator. Not searched in this register. Close by: wave 2 search of first-party NVIDIA and AWS training performance pages and MLPerf Training results (register 05 or 07), or a small Tier 0 measurement.

**U01-6. Fused or chunked cross-entropy that avoids materialising FP32 logits.** Transformer Engine v2.21.0 contains `transformer_engine/pytorch/cross_entropy.py` (seen in the repository tree, not read). Close by: read it and Megatron-Core's fused cross-entropy at a tag (register 03), then adjust W4's logits line.

**U01-7. OCP Microscaling Formats specification v1.0 itself.** Only the MX paper (2310.10537v3) was read; it defers details to the OCP specification (T01-48). Close by: wave 2 fetch of the OCP PDF from opencompute.org.

**U01-8. The PyTorch release that made `PYTORCH_ALLOC_CONF` primary and `PYTORCH_CUDA_ALLOC_CONF` an alias.** Only v2.15.0 was read (T01-63). Close by: wave 2 search of PyTorch release notes or `git log` on `docs/source/notes/cuda.md`.

**U01-9. MX formats on Trainium2.** The Neuron documentation navigation lists an NKI "MXFP8/4 Matrix Multiplication" page and `nki.isa.nc_matmul_mx`; whether these run on Trainium2 or only on later NeuronCores was not checked (the NeuronCore-v3 page lists cFP8, FP16, BF16, TF32, FP32, T01-51). Close by: wave 2 fetch of that NKI page; link the silicon dive.

**U01-10. Whether Llama 3's TFLOPs/GPU and MFU (T01-6) include attention FLOPs, and which peak Meta divided by.** 430 / 0.43 = 1,000 suggests a rounded denominator. Tried: Sec 3.3.2. Close by: accept; hedge text "Meta reports MFU without stating whether attention FLOPs are counted."

**U01-11. The Llama-specific activation coefficients (34.0 and 33.5 sbh, W3) are our derivation.** They assume a fused SwiGLU and a FlashAttention-style kernel and ignore allocator behaviour. Close by: a Tier 0 experiment measuring `torch.cuda.max_memory_allocated` for one Llama 3.1 8B layer at s = 8,192, b = 1 (fits on a DGX Spark or a single H100), with and without activation checkpointing.

**U01-12. Framework implementations of the alternative optimizer rows (W2).** 8-bit Adam, Adafactor and Muon rows assume an FP32 master copy; the libraries' actual state layouts at pinned tags were not read. Close by: register 03 (frameworks) or a wave 2 read of bitsandbytes and Megatron-Core optimizer code.

**U01-13. Why the two Trainium2 peak figures differ (C01-4).** Neither page states the clock. Close by: wave 2 search of the Neuron documentation for clock assumptions; else hedge with both figures.

---

## 7. Reading path for a newcomer

1. **Kaplan et al., 2001.08361v1, Sec 2.1 and Table 1.** Start with where 6N comes from: two pages that build the FLOPs-per-token model every later paper reuses.
2. **ZeRO, 1910.02054v3, Sec 3.** The 16-bytes-per-parameter accounting and the residual consumers (activations, buffers, fragmentation). Read before any parallelism paper so the memory problem is clear first.
3. **Micikevicius et al., 1710.03740v3, Sec 3; then Kalamkar et al., 1905.12322v3, Sec 3.** Why the FP32 master copy and loss scaling exist, then why BF16 removes loss scaling but not the master copy.
4. **Narayanan et al. (Megatron-LM), 2104.04473v5, Sec 3.1 notation and the FLOPs appendix.** The batch identity B = b x m x d and the 96Bslh^2 formula, including what recomputation adds.
5. **PaLM, 2204.02311v5, Sec 4.1 and Appendix B.** MFU defined against HFU, with a worked example that can be checked by hand.
6. **Korthikanti et al., 2205.05198v1, Sec 4 and 5.** The activation memory method, the Table 2 variants and selective recomputation; then **FlashAttention, 2205.14135v2, Sec 3.1** for why the s^2 term disappears.
7. **Llama 3, 2407.21783v3, Sec 3.2 to 3.4, with the Llama 3.1 model card.** A real run's architecture, compute budget, MFU, batch schedule and GPU-hours, against which every formula above can be checked (section 3 W7).
8. **Chinchilla, 2203.15556v1 (Table 3, Appendix F), and McCandlish et al., 1812.06162v1 (Sec 2).** How many tokens to train on, and how large a batch is useful: the two numbers that cap how many GPUs a run can use.
9. **FP8 Formats, 2209.05433v2; DeepSeek-V3, 2412.19437v2, Sec 3.3; MX, 2310.10537v3; NVFP4, 2509.25149v2; then Transformer Engine's `recipe/__init__.py` at v2.21.0.** The precision ladder from proposal to production to the recipe names a config file uses.
10. **8-bit optimizers, 2110.02861v2; Adafactor, 1804.04235v1; Muon, 2502.16982v1.** Only once the 16-byte budget is familiar: each changes the 12-byte optimizer term.

---

## 8. Source list by tier

**Tier 1: code at a pinned tag or SHA; official framework documentation; first-party vendor specifications and model metadata**
- meta-llama/llama-models v0.2.0 (5fdf83110cc9daa7435dfba6eb304892cc0041b8): `models/llama3_1/MODEL_CARD.md`, `models/llama3/model.py`, `models/llama3/tokenizer.py`, `models/llama3/args.py` (T01-2, T01-3, T01-4, T01-7, T01-35)
- Hugging Face model API metadata for meta-llama/Llama-3.1-8B, -70B, -405B at the revisions in section 1 (T01-3)
- NVIDIA/TransformerEngine v2.21.0 (7457e47d26d9d02dfb783007335dfbe75e1b90a8): `transformer_engine/common/recipe/__init__.py`, `transformer_engine/pytorch/quantization.py` (T01-44, T01-45)
- pytorch/pytorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457): `docs/source/notes/cuda.md` (T01-63)
- NVIDIA H100 product page https://www.nvidia.com/en-us/data-center/h100/ (T01-27) [vendor specification]
- NVIDIA H200 product page https://www.nvidia.com/en-us/data-center/h200/ (T01-28) [vendor specification]
- NVIDIA HGX page https://www.nvidia.com/en-us/data-center/hgx/ (T01-29) [vendor specification]
- AWS Neuron documentation, Trainium2 Architecture https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html (T01-30) [vendor specification]
- AWS Neuron documentation, NeuronCore-v3 Architecture https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html (T01-51) [vendor specification]

**Tier 2: first-party blogs and talks**
- None used.

**Tier 3: papers (peer-reviewed where the venue was confirmed on the arXiv page; otherwise preprint)**
- Peer-reviewed: 2104.04473v5 Megatron-LM (SC 2021); 1710.03740v3 Mixed Precision Training (ICLR 2018); 2110.02861v2 8-bit Optimizers (ICLR 2022)
- First-party lab technical reports (preprint): 2407.21783v3 Llama 3; 2412.19437v2 DeepSeek-V3; 2204.02311v5 PaLM; 2203.15556v1 Chinchilla; 2001.08361v1 Kaplan et al.; 1812.06162v1 McCandlish et al.; 2509.25149v2 NVFP4 (NVIDIA); 2502.16982v1 Muon (Moonshot AI)
- Other preprints (venue not confirmed on the arXiv page): 1910.02054v3 ZeRO; 2205.05198v1 Reducing Activation Recomputation; 2205.14135v2 FlashAttention; 2402.15627v1 MegaScale; 1604.06174v2 Training Deep Nets with Sublinear Memory Cost; 2209.05433v2 FP8 Formats for Deep Learning; 2310.10537v3 Microscaling Data Formats; 1905.12322v3 A Study of BFLOAT16; 1804.04235v1 Adafactor

**Tier 4: not used as evidence.**
