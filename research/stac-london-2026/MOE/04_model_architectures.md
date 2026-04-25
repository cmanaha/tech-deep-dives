# MoE model architectures — Tier 1 research notes
Access date: 2026-04-24

Tier legend: **T1** = first-party arxiv / official author technical report / author HF model card / author GitHub. **T2** = author blog post (still first-party, less formal). **T3** = third-party (transformers source, llama.cpp loader). T4 ignored.

## Sources fetched

- **T1** DeepSeek-V3 arXiv abstract — https://arxiv.org/abs/2412.19437
- **T1** DeepSeek-V3 HF model card — https://huggingface.co/deepseek-ai/DeepSeek-V3
- **T1** DeepSeek-V3 raw config.json — https://huggingface.co/deepseek-ai/DeepSeek-V3/raw/main/config.json
- **T1** DeepSeek-V3 GitHub README — https://github.com/deepseek-ai/DeepSeek-V3
- **T1** DeepSeek-R1 HF model card — https://huggingface.co/deepseek-ai/DeepSeek-R1
- **T2** Mistral Mixtral-of-experts blog — https://mistral.ai/news/mixtral-of-experts/
- **T1** Mixtral-8x7B-Instruct HF model card — https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1
- **T1** Mixtral-8x7B-v0.1 config.json — https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/main/config.json
- **T1** Mixtral-8x22B-Instruct HF model card — https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1
- **T1** Mixtral-8x22B-v0.1 config.json — https://huggingface.co/mistralai/Mixtral-8x22B-v0.1/blob/main/config.json
- **T1** Qwen3-235B-A22B HF model card — https://huggingface.co/Qwen/Qwen3-235B-A22B
- **T1** Qwen3-235B-A22B raw config.json — https://huggingface.co/Qwen/Qwen3-235B-A22B/raw/main/config.json
- **T2** Meta Llama-4 announcement blog — https://ai.meta.com/blog/llama-4-multimodal-intelligence/
- **T2** Databricks "Introducing DBRX" blog — https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm
- **T2** Databricks Accelerated DBRX Inference blog — https://www.databricks.com/blog/accelerated-dbrx-inference-mosaic-ai-model-serving
- **T1** GPT-OSS-120B HF model card — https://huggingface.co/openai/gpt-oss-120b
- **T1** GPT-OSS-120B raw config.json — https://huggingface.co/openai/gpt-oss-120b/raw/main/config.json
- **T1** Kimi-K2-Instruct HF model card (Moonshot) — https://huggingface.co/moonshotai/Kimi-K2-Instruct
- **T1** Kimi-K2-Instruct raw config.json — https://huggingface.co/moonshotai/Kimi-K2-Instruct/raw/main/config.json
- **T1** xAI Grok-1 GitHub README — https://github.com/xai-org/grok-1

## Findings

### DeepSeek-V3 (T1: arxiv + HF card + raw config)
- **Total params:** 671B  *(arxiv abstract: "671B total parameters with 37B activated for each token")*
- **Active params/token:** 37B
- **Routed experts per layer:** 256
- **Shared experts per layer:** 1
- **Top-k routed:** 8 (`num_experts_per_tok`)
- **Hidden dim (d_model):** 7168
- **Layers:** 61
- **Attention:** Multi-head Latent Attention (MLA), 128 attention heads, `kv_lora_rank=512`, `q_lora_rank=1536`, `qk_rope_head_dim=64`, `qk_nope_head_dim=128`, `v_head_dim=128`
- **KV cache:** MLA compresses KV to a single latent of `kv_lora_rank=512` per token, plus `qk_rope_head_dim=64` decoupled RoPE key — i.e. **(512 + 64) = 576 floats per layer per token**. At 61 layers, BF16 ≈ 70 KB/token; FP8 ≈ 35 KB/token. *(Derived from T1 config; DeepSeek-V2 paper formalizes this. Marked **[SPECULATIVE]** for the per-token byte total since not stated verbatim by DeepSeek for V3.)*
- **MoE intermediate size:** 2048 per expert
- **Max position:** 163,840 (YaRN, factor 40, base 4096)
- **Quantization (T1, official):** FP8 native — `quant_method: "fp8"`, `fmt: "e4m3"`, `weight_block_size: [128,128]`, `activation_scheme: "dynamic"`. BF16 available via `fp8_cast_bf16.py` script. *Model card: "Since FP8 training is natively adopted in our framework, we only provide FP8 weights."*

### DeepSeek-R1 (T1: HF card)
- **Architecture:** Identical to V3. Card: *"DeepSeek-R1-Zero & DeepSeek-R1 are trained based on DeepSeek-V3-Base. For more details regarding the model architecture, please refer to DeepSeek-V3 repository."*
- **Total / active:** 671B / 37B
- **Context:** 128K
- **Quantization (T1):** Tensor types listed on card: `BF16`, `F8_E4M3`, `F32`.

### Mixtral 8x7B (T1: HF card + T1 config + T2 blog)
- **Total params:** 46.7B  *(T2 Mistral blog verbatim: "Mixtral has 46.7B total parameters but only uses 12.9B parameters per token")*
- **Active params/token:** 12.9B
- **Experts:** 8 (`num_local_experts`)
- **Top-k:** 2 (`num_experts_per_tok`)
- **Hidden dim:** 4096
- **Layers:** 32
- **Attention:** GQA — 32 Q heads, 8 KV heads, head_dim 128
- **FFN intermediate:** 14,336
- **Context:** 32,768
- **KV cache/token:** 2 (K,V) × 8 KV heads × 128 head_dim × 32 layers = **131,072 elements/token** (≈ 256 KB BF16). *[SPECULATIVE: derivation from T1 config; not stated verbatim.]*
- **Quantization (T1):** Native BF16 (`torch_dtype: bfloat16`). Model card demonstrates `bitsandbytes` 8-bit and 4-bit (`load_in_4bit=True`) loading. No first-party FP8 release.

### Mixtral 8x22B (T1: HF card + T1 config)
- **Total params:** 141B (HF card states "47B" for 8x7B and "141B params" for this card)
- **Active params/token:** 39B  *[SPECULATIVE: standard 2-of-8 derivation; not in card text.]*
- **Experts / Top-k:** 8 / 2
- **Hidden dim:** 6144
- **Layers:** 56
- **Attention:** GQA — 48 Q heads, 8 KV heads, head_dim 128
- **FFN intermediate:** 16,384
- **Context:** 65,536 (`max_position_embeddings`)
- **Quantization (T1):** BF16 native; community quantizations exist but no first-party FP8.

### Qwen3-235B-A22B (T1: HF card + raw config)
- **Total params:** 235B (234B non-embedding)
- **Active params/token:** 22B
- **Experts:** 128 routed; **no shared expert** in config (`n_shared_experts` not present; pure routed MoE — different from Qwen2-MoE)
- **Top-k:** 8
- **Hidden dim:** 4096
- **Layers:** 94
- **Attention:** GQA — 64 Q heads, 4 KV heads, head_dim 128 (model card: "64 for Q / 4 for KV")
- **MoE intermediate:** 1536 per expert; dense `intermediate_size`: 12,288
- **Context:** 32,768 native, 131,072 with YaRN  *(card verbatim: "32,768 natively" and "131,072 tokens with YaRN")*
- **KV cache/token:** 2 × 4 × 128 × 94 = **96,256 elements/token** (~188 KB BF16). *[SPECULATIVE: derivation.]*
- **Quantization (T1):** `torch_dtype: bfloat16`. Qwen team also publishes official FP8 and AWQ/GPTQ variants as separate HF repos (e.g. `Qwen3-235B-A22B-FP8`); the base card itself only ships BF16.

### Llama 4 Maverick & Scout (T2: Meta blog only — official configs gated)
- **Maverick:** "17 billion active parameter model with 128 experts" / "400B total parameters" *(T2 verbatim).*
- **Scout:** "17 billion active parameter model with 16 experts" / "109 billion total parameters" *(T2).*
- **Routing:** "MoE layers use 128 routed experts and a shared expert. Each token is sent to the shared expert and also to one of the 128 routed experts." → **top-1 routed + 1 shared** for Maverick.
- **Layer pattern:** "alternating dense and mixture-of-experts (MoE) layers for inference efficiency"
- **Attention:** "iRoPE architecture, where 'i' stands for 'interleaved' attention layers" — *most layers have RoPE; some interleaved layers have no positional embedding (NoPE) for length generalization.*
- **Scout context:** 10M tokens (post-training); pre/post-trained at 256K
- **Quantization (T2):** "FP8 precision, without sacrificing quality" — used in training. Scout "fits in a single NVIDIA H100" with Int4. No first-party config json fetched (HF gated).
- **Hidden dim, exact head counts, KV heads, FP8 inference recipe:** UNKNOWN from T1/T2 sources accessed.

### DBRX (T2: Databricks blog only — HF model card gated)
- **Total params:** 132B  *(T2 verbatim: "132B total parameters of which 36B parameters are active on any input")*
- **Active params/token:** 36B
- **Experts / Top-k:** 16 / 4  *(T2: "DBRX has 16 experts and chooses 4")*
- **Layers:** 40  *(T2: "DBRX has half the number of layers (40 vs 80)" vs Llama 2 70B)*
- **Attention:** GQA + RoPE + GLU  *(T2: "rotary position encodings (RoPE), gated linear units (GLU), and grouped query attention (GQA)")*
- **Context:** 32,768  *(T2)*
- **Hidden dim 6144, n_heads 48, kv_n_heads 8, ffn_hidden_size 10752:** **[T3 — HuggingFace transformers `configuration_dbrx.py` / llama.cpp PR #6515]**. Not quoted by Databricks in the blog text; flag as T3 if used.
- **Quantization (T2):** "8-bit quantization" available on Databricks Model Serving. No first-party FP8 release.

### GPT-OSS-120B (T1: HF card + raw config)
- **Total params:** 117B  *(card verbatim: "117B parameters with 5.1B active parameters")*
- **Active params/token:** 5.1B
- **Experts:** 128 (`num_local_experts`)
- **Top-k:** 4 (`num_experts_per_tok`)
- **Hidden dim:** 2880
- **Layers:** 36
- **Attention:** GQA — 64 Q heads, 8 KV heads, head_dim 64; `attention_bias: true`; sliding window 128
- **Context:** 131,072 (YaRN factor 32 from initial 4096)
- **Quantization (T1, official):** **MXFP4** — `quant_method: "mxfp4"`, applied to MoE expert weights; attention, router, embed, lm_head left in higher precision. Card verbatim: *"The models were post-trained with MXFP4 quantization of the MoE weights, making `gpt-oss-120b` run on a single 80GB GPU."* Tensor types: BF16, U8.

### Kimi K2 (T1: Moonshot HF card + raw config)
- **Total params:** 1T (1,000B)
- **Active params/token:** 32B
- **Experts:** 384 routed + 1 shared
- **Top-k routed:** 8
- **Hidden dim:** 7168 (attention); MoE intermediate 2048/expert
- **Layers:** 61 (1 dense, 60 MoE)
- **Attention:** MLA — 64 attention heads, `kv_lora_rank=512`, `q_lora_rank=1536`, `qk_rope_head_dim=64`, `qk_nope_head_dim=128`, `v_head_dim=128`. *(Same MLA shape as DeepSeek-V3.)*
- **Context:** 131,072 (YaRN factor 32 from 4096 base)
- **Vocab:** 163,840
- **Quantization (T1):** Block-FP8 — `quant_method: "fp8"`, `fmt: "e4m3"`, `weight_block_size: [128,128]`, `activation_scheme: "dynamic"`. Card: *"Our model checkpoints are stored in the block-fp8 format"*. Tensor types listed: F32, BF16, F8_E4M3.

### Grok-1 (T1: xAI GitHub README)
- **Total params:** 314B
- **Active params/token:** ~25%  *(README phrasing: "25% of the weights are active on a given token" — top-2 of 8 → matches.)*
- **Experts:** 8
- **Top-k:** 2
- **Hidden dim:** 6144
- **Layers:** 64
- **Attention:** 48 Q heads, 8 KV heads (GQA-style); RoPE
- **Context:** 8,192 max sequence
- **Quantization (T1):** "Supports activation sharding and 8-bit quantization." No FP8.

## UNKNOWN

- **Llama 4 Maverick / Scout:** hidden_size, num_hidden_layers, num_attention_heads, num_key_value_heads, head_dim, intermediate_size, exact context window for Maverick — config.json on HF is gated; Meta blog does not state these. Will need authenticated HF pull or the Llama 4 model paper to confirm at T1.
- **DBRX exact config (d_model, n_heads, kv_n_heads, ffn_hidden_size):** the Databricks blogs state only params/experts/top-k/layers/context. The widely circulated values (6144 / 48 / 8 / 10752) come from HF `transformers` and llama.cpp at T3 — usable but flag the tier explicitly when citing.
- **DeepSeek-V3 / Kimi K2 KV-cache bytes per token:** not stated verbatim by authors; derived from MLA shape. Mark [SPECULATIVE] when cited.
- **Mixtral 8x22B active params/token:** not stated verbatim on either Mistral source fetched; standard 2-of-8 derivation gives ~39B. Mark [SPECULATIVE].
- **GPT-OSS-20B:** not fetched in this pass.
- **Qwen3-235B-A22B official quantization variants:** confirmed BF16 on base card; FP8/AWQ/GPTQ Qwen-published variants not individually fetched here.

## Direct quotes worth using verbatim

> "DeepSeek-V3 adopts Multi-head Latent Attention (MLA) and DeepSeekMoE architectures, which were thoroughly validated in DeepSeek-V2."
> — DeepSeek-V3 HF model card (T1)

> "Since FP8 training is natively adopted in our framework, we only provide FP8 weights. If you require BF16 weights for experimentation, you can use the provided conversion script to perform the transformation."
> — DeepSeek-V3 HF model card (T1)

> "Mixtral has 46.7B total parameters but only uses 12.9B parameters per token. It therefore processes input and generates output at the same speed and for the same cost as a 12.9B model."
> — Mistral, "Mixtral of experts" blog (T2)

> "MoE layers use 128 routed experts and a shared expert. Each token is sent to the shared expert and also to one of the 128 routed experts."
> — Meta, Llama 4 announcement (T2)

> "We focus on efficient model training by using FP8 precision, without sacrificing quality."
> — Meta, Llama 4 announcement (T2)

> "DBRX has 16 experts and chooses 4, while Mixtral and Grok-1 have 8 experts and choose 2. This provides 65x more possible combinations of experts."
> — Databricks "Introducing DBRX" blog (T2)

> "The models were post-trained with MXFP4 quantization of the MoE weights, making `gpt-oss-120b` run on a single 80GB GPU."
> — OpenAI gpt-oss-120b HF model card (T1)

> "Our model checkpoints are stored in the block-fp8 format, you can find it on Huggingface."
> — Moonshot Kimi-K2-Instruct HF model card (T1)
