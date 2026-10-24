# Verification: KV Cache and FlashAttention

Verified: 2026-10-23. Claims checked: 68 (sampled: 0; every new or changed claim was checked).
Confirmed 58, wrong 3, unsupported 5, mislabelled 2, unverifiable 0.

Every source was re-fetched on 2026-10-23 with curl's default User-Agent and no personal data in
any request. That covered the 8 pinned Hugging Face files (configs and the V4.1-Flash README via
`/resolve/<sha>/`), the Llama API record (unpinned and at `/revision/349b2dd...`), the public mirror
`unsloth/Meta-Llama-3.1-70B` config at `1b73066`, the llama-models MODEL_CARD at `v0.2.0`, the
FlashAttention READMEs at `v2.8.3.post2` and `fa4-v4.0.0.beta35`, the GitHub releases API, the
TensorRT-LLM `kvcache.md` and `quantization.md` at `v1.2.1`, the NKI attention CTE page (`latest`
and `v2.32.0`), the H200, HGX and Blackwell Ultra pages, vLLM `vllm/config/cache.py` at `v0.31.0`,
and the PDFs of Llama 3 (v3), DeepSeek-V3 (v2), FlashAttention (v2), FlashAttention-3 (v2),
FlashAttention-4 and vLLM (v1), all read with pdftotext. Every derived number was recomputed.

## Gate 3 score: 8/10

The worked example holds to the printed digit: 327,680 B, 2.68 / 85.9 / 41.9 GB, 141.1 / 156.5 /
113.5 GB and the 368x spread all recompute, and the Llama 3.1 70B shape is confirmed by the Llama 3
paper's Table 3 and by a pinned public mirror config. The errors were about scope and freshness, and
none of them was load-bearing for the sizing: 890 B stated without "global cache" in two places, a
"latest" FA4 beta that was superseded on 2026-10-21, and a Mixtral sentence contradicted by Mistral
7B's `sliding_window`. Economy holds the score at 8, because the section is +46% in visible words.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 58 of 68 confirmed as shipped. Exact: 2 x 80 x 8 x 128 x 2 = 327,680; 70,553,706,496 at sha 349b2dd; 192,512; 70,272; 131,072; 368.2; 2,250 / 989.5 = 2.27. The three wrong claims are wording or staleness. The five unsupported claims drop a scope the source keeps, and all five are now scoped. |
| Mental model or practical value | 9 | Models: the formula and "read the table as the formula at work", "FlashAttention keeps the FLOPs and cuts the bytes", and the tensor-vs-SFU scaling gap. Practical: the config fields to read, which FA generation fits which GPU, `KvCacheConfig(dtype='fp8')` and `host_cache_size`. The weakest block is the "second lever" ExpandableSection, which mostly relists levers the page already covered. |
| Shape | 8 | The h1 introduces before the mechanism. Every h2 description names a payoff. The strongest number (more than 300x, 368x) lands in the intro, the table and "Read the table". MLA and frontier detail is demoted. The section ends on where the KV goes when HBM runs out, with a hand-off to a named section. The NVIDIA/Trainium column block reads as a mapping, not a next action. |
| Writing | 8 | `no-ai-tells` passes and there is no "Section N" reference. In-sentence attribution grades the source in "the vLLM authors measured" and "NVIDIA notes" (a vendor claim), so both stay. The FlashAttention opener puts SMEM, TMEM and SBUF in one sentence. |
| Economy | 7 | The author reports 880 to 1,289 visible words (+46%), well above the ~20% guideline. My fixes add about 15. Each added block is register-required according to the author's report. The "second lever" ExpandableSection repeats the page's levers. |
| Diagrams | 8 | One inline SVG with `role="img"`, `aria-labelledby` and a `<title>` stating the assertion. Probe: "1 SVG diagram(s), 0 React Flow, ok" at 1440 and at 390. At 1440 every label sits inside its box with clear gaps. At 390 it scrolls sideways inside the 640 px minimum and the labels are small (about 7 px) but readable. The MLA row omits the 64-wide RoPE key that the text counts. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Llama 3.1 70B: 80 layers, 8 KV heads | llama3Herd | CONFIRMED | Table 3, 70B column: "Layers 80 ... Attention Heads 64, Key/Value Heads 8". Mirror `unsloth/Meta-Llama-3.1-70B` config at 1b73066: num_hidden_layers 80, num_attention_heads 64, num_key_value_heads 8, hidden_size 8192 | |
| 2 | Head dimension 128 | llama3Herd | CONFIRMED (derived) | Table 3 gives "Model Dimension 8192" and 64 heads; 128 is not printed, it is 8,192 / 64 | Derivation added to `llamaKvNote` |
| 3 | 327,680 B per token in BF16 | llama3Herd (derived) | CONFIRMED | 2 x 80 x 8 x 128 x 2 = 327,680 | |
| 4 | 2.68 GB per 8K-token request | llama3Herd (derived) | CONFIRMED | 327,680 x 8,192 = 2.684e9 | |
| 5 | 85.9 GB for a batch of 32 | llama3Herd (derived) | CONFIRMED | 2.684e9 x 32 = 85.90e9 | |
| 6 | 128K context | llama31ModelCard | CONFIRMED | MODEL_CARD.md at v0.2.0, Llama 3.1 table: 70B "Context length 128k", "GQA Yes" | |
| 7 | 41.9 GB for a 128,000-token request | llama3Herd (derived) | CONFIRMED | 327,680 x 128,000 = 41.94e9 | |
| 8 | 70.55 billion parameters | llama70bApi | CONFIRMED | API at /revision/349b2ddb53ce8f2849a6c168a81980ab25258dac: `sha` 349b2ddb..., `safetensors.total` 70553706496 | |
| 9 | 141.1 GB of BF16 weights | llama70bApi (derived) | CONFIRMED | 70,553,706,496 x 2 = 141.11e9 | |
| 10 | H200 has 141 GB | h200Page | CONFIRMED | H200 specs: "GPU Memory 141GB" | |
| 11 | FP8 weights 70.6 GB | llama70bApi (derived) | CONFIRMED | 70.55e9 x 1 B | |
| 12 | 156.5 GB total, more than one H200 | llama70bApi (derived) | CONFIRMED | 70.554 + 85.899 = 156.45 | |
| 13 | FP8 KV halves to 42.9 GB | llama70bApi (derived) | CONFIRMED | 85,899,345,920 / 2 = 42,949,672,960 B, which is 42.9 at one decimal | |
| 14 | 113.5 GB fits | llama70bApi (derived) | CONFIRMED | 70.554 + 42.950 = 113.50 | |
| 15 | FP8 KV cache available in TensorRT-LLM | trtllmQuantization | CONFIRMED | quantization.md v1.2.1: "* FP8 KV Cache", "TensorRT LLM allows you to enable the FP8 KV cache manually" | |
| 16 | 13B on 40 GB A100: about 65% weights, close to 30% KV | vllmPaper (measured) | CONFIRMED | Sec. 1: "13B-parameter LLM on an NVIDIA A100 GPU with 40GB RAM. Approximately 65% of the memory is allocated for the model weights ... Close to 30% of the memory is used to store the dynamic states" | |
| 17 | 8 x 141 = 1,128 GB; about 1,057 GB left | h200Page (derived) | CONFIRMED | 1,128 - 70.6 = 1,057.4 | |
| 18 | Intro: "from 327,680 bytes ... to 890 for DeepSeek-V4.1-Flash" | deepseekV41Flash | UNSUPPORTED (scope) | README at 314113f: "reduce the global KV cache footprint to 890 bytes per token" | "890 bytes of global cache" |
| 19 | Mistral 7B 131,072 B (128 KiB) | mistral7bConfig (derived) | CONFIRMED | config at 27d67f1: num_hidden_layers 32, num_attention_heads 32, num_key_value_heads 8, hidden_size 4096 (head dim 128). The same config sets `sliding_window` 4096 | |
| 20 | Mistral 7B 32 : 8 (4:1) | mistral7bConfig | CONFIRMED | as above | |
| 21 | Mixtral 8x7B 131,072 B, 32 : 8 | mixtralConfig (derived) | CONFIRMED | config at fc7ac94: 32 layers, 32 heads, 8 KV heads, hidden 4096, `sliding_window` null | |
| 22 | Llama 3.1 70B 64 : 8 (8:1) | llama3Herd | CONFIRMED | Table 3 | |
| 23 | Qwen3-235B-A22B 192,512 B (188 KiB) | qwen3Config (derived) | CONFIRMED | config at 8efa617: num_hidden_layers 94, num_key_value_heads 4, head_dim 128; 2 x 94 x 4 x 128 x 2 = 192,512 | |
| 24 | Qwen3 64 : 4 (16:1) | qwen3Config | CONFIRMED | num_attention_heads 64, num_key_value_heads 4 | |
| 25 | DeepSeek-V3 70,272 B (69 KiB) | deepseekV3Report (derived) | CONFIRMED | Report Sec. 2.1.1: "only the blue-boxed vectors (i.e., c_t^KV and k_t^R) need to be cached during generation"; Sec. 4.2: "61 ... KV compression dimension d_c is set to 512 ... d_h^R to 64". Config at e815299: kv_lora_rank 512, qk_rope_head_dim 64, 61 layers. (512 + 64) x 61 x 2 = 70,272, BF16 assumed as the caption states | |
| 26 | DeepSeek-V3: one 512-wide latent shared by 128 query heads | deepseekV3Config | CONFIRMED | kv_lora_rank 512, num_attention_heads 128 | |
| 27 | V4.1-Flash 890 B, global cache | deepseekV41Flash | CONFIRMED | "global KV cache footprint to **890 bytes per token**" | |
| 28 | V4.1-Flash: compressed sparse attention, FP4 KV entries | deepseekV41Flash | UNSUPPORTED (scope) | "Compressed Sparse Attention 2 (CSA2) ... Combined with **FP4 main KV caching** (E2M1 format, one E4M3 scale per 16 channels)" | "FP4 ... main KV" |
| 29 | GQA groups 4 to 16 query heads per KV head in the table | configs | CONFIRMED | 4:1, 8:1, 16:1 | |
| 30 | MQA can cost quality; GQA near MHA quality at near-MQA speed | gqaPaper | CONFIRMED | Abstract: "MQA can lead to quality degradation ... uptrained GQA achieves quality close to multi-head attention with comparable speed to MQA" | |
| 31 | Mixtral: MoE with eight experts per layer | mixtralConfig | CONFIRMED | num_local_experts 8 | |
| 32 | Mixtral stores the same 128 KiB per token "because its attention shape is identical" | mixtralConfig | WRONG (in part) | The per-token bytes match, but Mistral 7B's config sets `sliding_window` 4096 and Mixtral's sets null, so their attention differs | "because its layers and KV heads have the same shape" |
| 33 | Qwen3 41% less per token than Llama 3.1 70B | qwen3Config (derived) | CONFIRMED | 192,512 / 327,680 = 0.5875 | |
| 34 | "the spread is more than 300x, so the same HBM holds 368 times as many tokens of context" | deepseekV41Flash (derived) | UNSUPPORTED (scope) | 890 B covers only the global cache. The README treats SWA KV separately ("SWA Bounded Replay reconstructs missing SWA KV states"), so the ratio does not cover all context | Scoped to "global cache" |
| 35 | 368x | deepseekV41Flash (derived) | CONFIRMED | 327,680 / 890 = 368.2 | |
| 36 | "MLA stores one vector per token per layer, a 512-wide latent plus a 64-wide RoPE key" | deepseekV3Config | WRONG (wording) | The report caches two vectors, c_t^KV and k_t^R, and the section's own `mlaNote` says "the two vectors" | "Per token and per layer, MLA stores a 512-wide latent plus a 64-wide ... key" |
| 37 | Only the latent and RoPE key are cached; 4.7x less than Llama | deepseekV3Report (derived) | CONFIRMED | Sec. 2.1.1 quote above; 327,680 / 70,272 = 4.66 | |
| 38 | Kimi K2 keeps the same 512-wide latent | kimiK2Config | CONFIRMED | config at fd1984e: kv_lora_rank 512, qk_rope_head_dim 64 | |
| 39 | gpt-oss-120b alternates full and 128-token-window layers, half fixed-size | gptOss120bConfig (derived) | CONFIRMED | config at b5c939d: `layer_types` alternates sliding_attention / full_attention, 18 of 36 sliding; sliding_window 128 | |
| 40 | Qwen3-Next: KV in 12 of 48 layers, linear attention in the rest | qwen3NextConfig (derived) | CONFIRMED | config at 9c7f2fb: num_hidden_layers 48, full_attention_interval 4, linear_* keys present | |
| 41 | V4.1-Flash: 890 B covers the global cache, a separate sliding-window cache sits outside | deepseekV41Flash | CONFIRMED | The README names the "global KV cache" (890 B) and "SWA KV" (reconstructed by Bounded Replay, not persisted) as separate | |
| 42 | `num_key_value_heads`, `head_dim`, `kv_lora_rank`, `layer_types`, `full_attention_interval` set the KV budget | configs | UNSUPPORTED (incomplete) | gpt-oss's window size and Mistral 7B's window are in `sliding_window`, which the list left out | `sliding_window` added |
| 43 | Unfused attention: QK^T, softmax, xV, score matrix written to HBM between them | flashAttentionPaper | CONFIRMED | Algorithm 0: "compute S = QK^T, write S to HBM. 2: Read S from HBM, compute P = softmax(S), write P to HBM" | |
| 44 | Tile in SMEM; also TMEM on Blackwell | flashAttention4Paper | CONFIRMED | Sec. 2: "Blackwell MMAs write their output directly to TMEM"; "we transfer P via tensor memory" | |
| 45 | Tile in SBUF on Trainium | nkiAttentionCte | CONFIRMED | "processes one section at a time to fit in SBUF memory" | |
| 46 | Same FLOPs in the forward pass | flashAttentionPaper | CONFIRMED | Sec. 3.2: "FlashAttention has higher FLOP count compared to standard attention (due to recomputation in the backward pass)"; Theorem 1: O(N^2 d) FLOPs | |
| 47 | FA2 supports Ampere, Ada, Hopper | flashAttentionReadme | CONFIRMED | README v2.8.3.post2: "FlashAttention-2 with CUDA currently supports: 1. Ampere, Ada, or Hopper GPUs" | |
| 48 | FA3 is a beta built for Hopper (H100) | flashAttentionReadme | CONFIRMED | "## FlashAttention-3 beta release / FlashAttention-3 is optimized for Hopper GPUs (e.g. H100)" | |
| 49 | FA3 overlaps async data movement and wgmma with the softmax | flashAttention3Paper | CONFIRMED | Abstract: "overlap overall computation and data movement via warp-specialization and (2) interleave block-wise matmul and softmax"; Sec. 1: "while softmax executes on one block of the scores matrix, WGMMA executes" | |
| 50 | FA4 in CuTe DSL, Hopper and Blackwell (H100, B200), `pip install flash-attn-4` | fa4Readme | CONFIRMED | README at fa4-v4.0.0.beta35: "FlashAttention-4 is written in CuTeDSL and optimized for Hopper and Blackwell GPUs (e.g. H100, B200)", "pip install flash-attn-4" | |
| 51 | "It ships as betas, the latest fa4-v4.0.0.beta35 on 2026-10-14" | fa4Release | WRONG (stale) | Releases API: beta35 `published_at` 2026-10-14T08:20:58Z, prerelease true; fa4-v4.0.0.beta36 published 2026-10-21T08:19:23Z | "It ships as betas; fa4-v4.0.0.beta35 came out on 2026-10-14." |
| 52 | Dense BF16 tensor throughput 2.3x, H200 to B200 | h200Page, hgxPage (derived) | CONFIRMED | H200: "BFLOAT16 Tensor Core² 1,979 TFLOPS", footnote "With sparsity". HGX B200: "FP16/BF16 Tensor Core² 36 PFLOPS", footnote 2 "Specification in Sparse. Dense is ½ sparse spec shown". 18,000 / 8 = 2,250; 2,250 / 989.5 = 2.27 | |
| 53 | SFU exponentials 4.5 to 5 TeraExponentials/s | blackwellUltraBlog | CONFIRMED | Table: "Attention acceleration (SFU EX2) 4.5 TeraExponentials/s [Hopper] 5 TeraExponentials/s [Blackwell] 10.7 TeraExponentials/s [Blackwell Ultra]" | |
| 54 | Softmax stage can become a latency bottleneck for long-context reasoning models | blackwellUltraBlog | CONFIRMED | "especially impactful for reasoning models with large context windows, where the softmax stage can become a latency bottleneck" | |
| 55 | Blackwell Ultra doubles SFU throughput for attention | blackwellUltraBlog | CONFIRMED | "SFU throughput has been doubled for key instructions used in attention" (10.7 / 5 = 2.14) | Tightened to "for the key instructions attention uses" |
| 56 | Lead-in: "Blackwell moved the bottleneck to the softmax" | blackwellUltraBlog, flashAttention4Paper | UNSUPPORTED | The blog does not say it. FA4 abstract: "tensor core throughput doubles while other functional units (shared memory bandwidth, exponential units) scale more slowly ... these shifting bottlenecks on Blackwell" | "Blackwell shifts the bottleneck toward the softmax" |
| 57 | FA4: software-emulated exponentials, conditional softmax rescaling | flashAttention4Paper | CONFIRMED | Abstract: "(2) software-emulated exponential and conditional softmax rescaling that reduces non-matmul operations" | |
| 58 | Earlier systems: 20.4% to 38.2% of KV memory held token state | vllmPaper (measured) | CONFIRMED | Sec. 1: "only 20.4% - 38.2% of the KV cache memory is used to store the actual token states in the existing systems" | |
| 59 | Contiguous buffer sized for maximum length | vllmPaper | CONFIRMED | Sec. 1: "they pre-allocate a contiguous chunk of memory with the request's maximum length" | |
| 60 | PagedAttention brings waste near zero | vllmPaper (measured) | CONFIRMED | Abstract: "near-zero waste in KV cache memory" | |
| 61 | TensorRT-LLM: pool of blocks, prefix reuse | trtllmKvCache | CONFIRMED | kvcache.md v1.2.1: "The KV cache is a pool of blocks ... allows later requests to reuse KV state if they have a matching prefix" | |
| 62 | vLLM and TensorRT-LLM both page the KV cache | vllmPaper, trtllmKvCache | CONFIRMED | As above. Current vLLM also checked: `vllm/config/cache.py` at v0.31.0 has `DEFAULT_BLOCK_SIZE: ClassVar[int] = 16` and `num_gpu_blocks` | |
| 63 | `KvCacheConfig(dtype='fp8')`; NVFP4 KV listed | trtllmQuantization | CONFIRMED | "kv_cache_config=KvCacheConfig(dtype='fp8')"; "* NVFP4 KV Cache" | |
| 64 | V4.1-Flash stores its main KV in FP4 | deepseekV41Flash | CONFIRMED | "FP4 main KV caching" | |
| 65 | NKI attention CTE kernel, prefill, Trn2 and Trn3; K/V over 10K processed in 8K sections to fit SBUF | nkiAttentionCte | CONFIRMED | v2.32.0 page (and latest, 2.33.0): "This document is relevant for: Trn2, Trn3", "optimized for Context Encoding (prefill)", "For K/V length > 10K tokens, divides into 8K-token sections and processes one section at a time to fit in SBUF memory" | |
| 66 | TensorRT-LLM copies an evicted block's KV state to secondary memory | trtllmKvCache | CONFIRMED (scope added) | Line 19 says it plainly. Line 69: "it can optionally be offloaded to host (CPU) memory ... controlled with property host_cache_size ... The default is 0" | "once `host_cache_size` (default 0) is set, ... to host memory" |
| 67 | Record llama70bApi: URL `api/models/meta-llama/Llama-3.1-70B` with "at sha 349b2dd" in the title | llama70bApi | MISLABELLED (unpinned) | The unpinned URL serves whatever is current. `/revision/349b2ddb...` returns the same sha and total | URL pinned to the revision |
| 68 | Record nkiAttentionCte: `/en/latest/` with "(Neuron 2.32.0)" in the title | nkiAttentionCte | MISLABELLED (unpinned) | `latest` now serves "Neuron 2.33.0 is released!". `/en/v2.32.0/` serves 2.32.0 with the same text | URL pinned to v2.32.0 |

Also checked without a verdict row: the diagram's numbers (8, 2 "4x smaller", 1; 327,680 B, 2.68 GB)
match rows 3 and 4. The `sfuNote` figures match row 53. Every URL in the source file has the
same tier in every other source file that cites it (script over `src/sources/*.ts`). Llama 3
Herd and the DeepSeek-V3 report are Tier 2 everywhere, as vendor technical reports.

## ORCH-NOTES items

- DeepSeek-V4.1-Flash 890 B is the "global KV cache footprint" (Quantization verification). The
  verdict is CONFIRMED in the table and the ExpandableSection. The intro and "Read the table"
  stated the figure without that scope (rows 18 and 34). Both are now scoped, so this section
  keeps the scope everywhere it uses 890. Flash as a Cache Tier and Disaggregated still need the
  consistency pass.
- Worked example (brief item): CONFIRMED in full, rows 1 to 14. The gated config was replaced by
  Table 3 plus the pinned mirror config. The parameter count was read from the API at the pinned
  revision, and the record now links that revision.
- KV-bytes table (brief item): CONFIRMED, rows 19 to 27 and 35. Every config revision resolves at
  its SHA. The DeepSeek-V3 figure assumes the cache holds the latent plus the RoPE key, and the
  report states exactly that. The 890 B scope is kept. The spread is 368x.
- FlashAttention (brief item): FA3 on Hopper CONFIRMED at v2.8.3.post2. The FA4 beta on Blackwell
  is CONFIRMED at fa4-v4.0.0.beta35, but "the latest" was stale (row 51). The softmax lesson now
  says what the blog says: rows 53 to 55, with "for the key instructions attention uses". The
  lead-in rests on the FA4 paper's "shifting bottlenecks" (row 56). The 2.3x tensor figure is
  derived from the H200 and HGX pages, not taken from the blog.
- PagedAttention and Trainium (brief item): CONFIRMED against the vLLM paper and vLLM v0.31.0
  `cache.py` (block size 16), and against the NKI CTE page pinned to v2.32.0. The section names
  only the CTE (prefill) kernel. The NKI library also lists an Attention TKG kernel, which the
  section does not mention (see Backlog).

## Fixes applied

All fixes are in `src/sections/KvCacheAndFlashAttention.tsx` unless noted.

- `:16` `llamaKvNote`: "128 head dim" became "128 head dim (8,192 / 64 heads)".
- `:125` table cell: "FP4 (4-bit floating point) KV entries" became "FP4 (4-bit floating point)
  main KV".
- `:156` intro: "to 890 for DeepSeek-V4.1-Flash." became "to 890 bytes of global cache for
  DeepSeek-V4.1-Flash."
- `:251` "because its attention shape is identical" became "because its layers and KV heads have
  the same shape".
- `:255` "the spread is more than 300x, so the same HBM holds 368 times as many tokens of context"
  became "From Llama 3.1 70B to DeepSeek-V4.1-Flash's global cache the spread is more than 300x:
  the same HBM holds 368 times as many tokens of global cache."
- `:262` "MLA stores one vector per token per layer, a 512-wide latent plus" became "Per token and
  per layer, MLA stores a 512-wide latent plus".
- `:286` the config-field list gained `sliding_window`.
- `:329` "It ships as betas, the latest fa4-v4.0.0.beta35 on 2026-10-14." became "It ships as
  betas; fa4-v4.0.0.beta35 came out on 2026-10-14."
- `:334` "Blackwell moved the bottleneck to the softmax." became "Blackwell shifts the bottleneck
  toward the softmax."
- `:341` "doubles SFU throughput for attention" became "doubles SFU throughput for the key
  instructions attention uses".
- `:426` "TensorRT-LLM copies an evicted block's KV state to secondary memory." became "once
  `host_cache_size` (default 0) is set, TensorRT-LLM copies an evicted block's KV state to host
  memory."
- `src/sources/KvCacheAndFlashAttention.ts:72` llama70bApi URL became
  `https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac`,
  accessed 2026-10-23.
- `src/sources/KvCacheAndFlashAttention.ts:123` nkiAttentionCte URL `/en/latest/` became `/en/v2.32.0/`,
  accessed 2026-10-23.

The diagram was not changed.

## Checks

| Command | Result |
| --- | --- |
| `pnpm exec tsc --noEmit` filtered to my files | "no type errors in my files" |
| `pnpm exec eslint` section, sources, diagram `--max-warnings 0` | exit 0 |
| `pnpm exec vitest run src/__tests__/sections.test.tsx -t KvCacheAndFlashAttention` | 1 passed, exit 0 |
| `scripts/gates/no-ai-tells.sh` | exit 0, no hits in my files |
| `scripts/gates/svg-a11y.sh` | exit 0, no hits in my files |
| `scripts/gates/pinned-refs.sh` | exit 0, no hits in my files |
| `scripts/gates/pre-overflow.sh` | exit 0, no hits in my files |
| `vite build --outDir /tmp/vf-KvCacheAndFlashAttention-dist` | exit 0 |
| `shoot.mjs --sections kv-cache --widths 1440,390` | "1 SVG diagram(s), 0 React Flow, ok" at both widths, exit 0. PNGs read: diagram clean at 1440, scrolls sideways at 390 |

## For the orchestrator

- `src/sources/FlashCacheTier.ts:259` llama70bApi uses the unpinned
  `https://huggingface.co/api/models/meta-llama/Llama-3.1-70B` with "at sha 349b2dd" in its
  title. Pin it to `/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac` as done here, so the shared
  record has one URL. The `pinned-refs` gate does not catch `api/models` URLs, so the gate could
  learn that pattern.
- `sources.md`: regenerate it. Two of my URLs changed (llama70bApi, nkiAttentionCte), on top of
  the drift the author reported.
- DeepSeek-V4.1-Flash "global KV cache" scope: Flash as a Cache Tier (:144) and Disaggregated
  (:175, :386) still state 890 B without the scope (ORCH-NOTES).
- FA4 is now at fa4-v4.0.0.beta36 (2026-10-21). Roofline cites beta35 without calling it the
  latest, so nothing there is wrong.

## Backlog

- Mistral 7B v0.1 sets `sliding_window` 4096, which bounds its per-request cache in an engine
  that honours the window. The table could say so in the Mistral 7B row.
- The NKI library also ships an Attention TKG (token generation) kernel. Naming it next to the CTE
  kernel would cover decode on Trainium.
- The MLA row in the diagram omits the 64-wide RoPE key that the text and table count.
- Economy: the "Why KV-cache management is the second lever after batching" ExpandableSection
  relists the page's levers and is a cut candidate if the Gate 3 average needs words back.
- The author's idea: a log-scale bar chart of KV bytes per token would carry the 368x spread
  better than the table.
