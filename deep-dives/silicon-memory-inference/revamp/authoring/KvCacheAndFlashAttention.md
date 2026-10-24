# Change report: KvCacheAndFlashAttention (KV Cache and FlashAttention)

Status: DONE.

Files owned: `src/sections/KvCacheAndFlashAttention.tsx`, `src/components/KvCacheDiagram.tsx`,
`src/sources/KvCacheAndFlashAttention.ts` (new, 26 records, every one cited).

Register: `research/2026-10-refresh/01-memory.md` section 4 (rows K1 to K30, KD1 to KD3),
plus `docs/verification/2026-08-01/P3-silicon-numbers.md` section 2. Coordinator addendum
applied: every "Section N" cross-reference replaced by the italic section name; the "Why this
section." opener cut.

Re-read during authoring (2026-10-18): Mistral 7B, Mixtral 8x7B, Qwen3-235B-A22B, DeepSeek-V3,
Kimi K2, Qwen3-Next-80B-A3B and gpt-oss-120b `config.json` at the pinned revisions (curl);
FlashAttention README at `v2.8.3.post2` and `fa4-v4.0.0.beta35`; release page
`fa4-v4.0.0.beta35`; DeepSeek-V3 report (MLA cache contents, d_c 512, d_h^R 64, 61 layers);
DeepSeek-V4.1-Flash README (890 B is the global cache; SWA KV is separate); NVIDIA Blackwell
Ultra blog (SFU table, softmax bottleneck sentence); NKI attention CTE page (Trn2/Trn3,
10K/8K SBUF sentence).

## Claims changed

| Before | After | Source key | Tier | Kind |
| --- | --- | --- | --- | --- |
| K1 h1: levers "move decode arithmetic intensity right of the ridge" | Batching moves decode "toward the ridge"; h1 description now states the payoff | (cross-ref to Roofline and Arithmetic Intensity) | - | - |
| K7 Llama 3 70B "about 5 GB per request" | Llama 3.1 70B: 327,680 B per token, 2.68 GB per 8K request | llama3Herd | 2 | derived |
| K8 "At batch 32 that is 160 GB" | 85.9 GB for a batch of 32 | llama3Herd | 2 | derived |
| K9 "exceeding H200's 141 GB before the model weights even fit" | 141.1 GB of BF16 weights fill an H200 alone; FP8 weights 70.6 GB + 85.9 GB KV = 156.5 GB, more than one H200; FP8 KV 42.9 GB, total 113.5 GB fits | llama70bApi, h200Page, trtllmQuantization | 1, 2, 1 | derived |
| (absent) | 128,000-token request = 41.9 GB, within the 128K context | llama3Herd, llama31ModelCard | 2, 1 | derived, spec |
| K10 servers "spend most of their memory budget on KV cache" | Single GPU: weights dominate (vLLM paper, 13B on A100 40 GB, about 65% weights, close to 30% KV); eight H200s: 1,128 GB, 70.6 GB FP8 weights leave about 1,057 GB | vllmPaper, h200Page | 3, 2 | measured, derived |
| K13 Qwen3-235B-A22B 64 / 8 / 8:1 | 64 : 4 (16:1), 192,512 B per token | qwen3Config | 1 | spec, derived |
| K14 DeepSeek-V3 ratio "further reduced" | 70,272 B per token, one 512-wide latent shared by 128 query heads; 4.7x less than Llama 3.1 70B | deepseekV3Config, deepseekV3Report | 1, 2 | spec, derived |
| K15 blanket "Numbers from each model's author docs / HuggingFace model card" | Every table cell carries its own citation | per row | 1 or 2 | - |
| K16 GQA "typically 4:1 or 8:1"; "Almost every modern model uses GQA" | "In the table, GQA groups 4 to 16 query heads per KV head"; newer designs (MLA, sliding windows, hybrid linear attention, compressed sparse attention) in an ExpandableSection | mistral7bConfig, qwen3Config, kimiK2Config, gptOss120bConfig, qwen3NextConfig, deepseekV41Flash | 1 | spec, derived |
| K17 MQA trades quality | Kept, now cited: MQA can cost quality, GQA near-MHA quality at near-MQA speed | gqaPaper | 3 | spec |
| K20 FLOPs identical | "In the forward pass" added | flashAttentionPaper | 3 | spec |
| K21 "v1 (2022) targeted Volta and Ampere" | Removed (history fails the test); generations now stated per GPU: FA2 on Ampere, Ada, Hopper | flashAttentionReadme | 1 | spec |
| K22 "v2 added support for backward" | Removed with the history (see above) | - | - | - |
| K23 "v3 ... production version on H100 / H200" | FA3 "a beta built for Hopper (H100)", overlaps async data movement and wgmma with the softmax; "production version" dropped | flashAttentionReadme, flashAttention3Paper | 1, 3 | spec |
| K24 "Blackwell variants land on tcgen05.mma + TMEM" | FA4 in CuTe DSL for Hopper and Blackwell, `pip install flash-attn-4`, betas, latest fa4-v4.0.0.beta35 on 2026-10-14; TMEM use on Blackwell | fa4Readme, fa4Release, flashAttention4Paper | 1, 1, 3 | spec |
| K25 "FlashAttention equivalents ... ship as first-class kernels in the Neuron SDK" | NKI library attention CTE kernel, prefill, Trn2 and Trn3; for K/V over 10K tokens processes 8K-token sections to fit SBUF | nkiAttentionCte | 1 | spec |
| K26 PagedAttention near-zero waste | Kept, plus earlier systems used 20.4% to 38.2% of KV memory for token state | vllmPaper | 3 | measured |
| K27 PagedAttention in vLLM and TRT-LLM; FP8 KV in TRT-LLM | Kept; TRT-LLM block pool with prefix reuse; `KvCacheConfig(dtype='fp8')`; NVFP4 KV listed | vllmPaper, trtllmKvCache, trtllmQuantization | 3, 1, 1 | spec |
| K28 lever list "GQA, MLA, FP8 KV-cache, paging" | Adds sliding windows, linear-attention layers, NVFP4 KV, FP4 in DeepSeek-V4.1-Flash | trtllmQuantization, deepseekV41Flash | 1 | spec |
| K5 / KD2 formula | Formula now "for one request"; "latent and compressed attention follow their own" | (formula, derived) | - | - |
| K2 / coordinator: "Section 3, 5, 23, 25, 26" | Italic names: Roofline and Arithmetic Intensity, Disaggregated Serving and Speculative Decoding, Quantization and Precision, NVIDIA Compilers and Kernel Tooling, Flash as a Cache Tier for Inference | - | - | - |
| Llama 3 70B naming | Llama 3.1 70B throughout, to match the sibling sections | llama3Herd | 2 | - |

Claims changed: 24 rows above.

Figures are identical to `DisaggregatedServingAndSpeculative.tsx` and `FlashCacheTier.tsx`:
327,680 B per token, 2.68 GB at 8K, 41.9 GB at 128,000 tokens, 192,512 B for Qwen3, 70,272 B
for DeepSeek-V3, 890 B for DeepSeek-V4.1-Flash, 141 GB per H200, 70.55 B parameters. The
spread is 368x (`327,680 / 890`); Disaggregated Serving rounds the same ratio to "about 370".

## Claims removed

1. Llama 2 70B row: correct per P3, but the only Tier 1 evidence is a gated `config.json` with
   no pinned URL, and its shape duplicates Llama 3.1 70B. Fails "every claim citable" as a
   pinned record and adds nothing to the model.
2. FlashAttention v1 and v2 history (K21, K22, both WRONG): a version history gives neither a
   mental model nor an action; replaced by the per-GPU pick.
3. "Production version on H100 / H200" (K23 UNKNOWN): unsourced, dropped.
4. "Blackwell adds tcgen05 + TMEM staging" in the NVIDIA column: superseded by the FA4 text.
5. K30 "Triton and CuTeDSL host alternative implementations": CORRECT but passes neither test;
   cut. CuTe DSL survives as the language FA4 is written in.
6. "SBUF residency is an explicit compile-time decision, not a runtime cache outcome": no
   source in the register; replaced by the NKI page's own 10K/8K-section sentence.
7. "They are in every production inference stack worth mentioning" and the "panels and
   architecture reviews" sentence: unsourced opinion.
8. The "Why this section." opener (coordinator instruction).
9. The arXiv `Link` in the table caption (accessed 2026-04-23): replaced by Cite records.
10. Training recomputation sentence in the Alert: out of scope for an inference dive, cut for
    length after K20 was fixed.

## UNKNOWNs

- K23 "production" status of FA3: dropped, not hedged.
- Llama 3.1 70B `config.json` is gated: the shape is cited to the Llama 3 paper Table 3
  (`llama3Herd`, the record the sibling sections use) and the parameter count to the Hugging
  Face API metadata (`llama70bApi`).
- "Conditional softmax rescaling" and "software-emulated exponentials" are the FA4 paper's own
  terms (Tier 3, register quote); the page does not explain them further.

## NEW content and sources

- KV bytes per token column across six models, the 368x spread landed three times (intro,
  "Read the table", table row) with derived notes: mistral7bConfig, mixtralConfig, llama3Herd,
  qwen3Config, deepseekV3Report, deepseekV41Flash.
- "Read the table as the formula at work": Mixtral equals Mistral 7B per token (mixtralConfig),
  Qwen3-235B 41% below Llama 3.1 70B (qwen3Config, derived).
- ExpandableSection on MLA, Kimi K2, gpt-oss-120b sliding windows (18 of 36 layers), Qwen3-Next
  (12 of 48 layers keep KV), V4.1-Flash scope (global cache only): deepseekV3Config,
  deepseekV3Report, kimiK2Config, gptOss120bConfig, qwen3NextConfig, deepseekV41Flash.
- Practical step: read `num_key_value_heads`, `head_dim`, `kv_lora_rank`, `layer_types`,
  `full_attention_interval` before sizing.
- FA4 softmax lesson. The FA4 README and release page do not state it, so it rests on a Tier 2
  source: NVIDIA's Blackwell Ultra blog (`blackwellUltraBlog`): SFU EX2 4.5 (Hopper), 5
  (Blackwell), 10.7 (Blackwell Ultra) TeraExponentials/s; "the softmax stage can become a
  latency bottleneck"; SFU throughput doubled for attention. Tensor-throughput ratio 2.3x is
  derived from h200Page (989.5 dense BF16) and hgxPage (2.25 PFLOPS dense per B200), the same
  inputs Roofline and Arithmetic Intensity uses. FA4's response cited to the FA4 paper (Tier 3).
- Hand-off to Flash as a Cache Tier for Inference and to the vLLM dive's KV Offloading and
  LMCache section, with TensorRT-LLM's secondary-memory eviction (trtllmKvCache).

Length: visible words 880 before, 1,289 after (+46%); ExpandableSection words 95 before, 206
after. Every added block is register-required: K7 to K10 worked example and deployment
statement, recommended edit 3 (KV bytes per token table and frontier paragraph, the frontier
part demoted), K24 FA4, K26 PagedAttention figure, K29 hand-off. To offset, the history,
opener, opinion lines and the duplicated FA advice in the NVIDIA column were cut, and the MLA
and frontier detail was demoted.

## Diagram (`KvCacheDiagram.tsx`)

- KD1: "Each row halves the KV cache" became "Each row cuts kv_heads: 8, then 2 (4x smaller),
  then 1".
- KD3: MLA row added (8 query heads over one purple "latent" bar, "One compressed latent per
  token; K and V rebuilt from it"), plus a legend (query head, KV head, compressed latent).
- KD2: formula reads "Size per request = 2 × layers × seq_len × kv_heads × head_dim ×
  bytes_per_value"; added "Llama 3.1 70B at 2 bytes per value: 327,680 B per token, 2.68 GB per
  8K-token request" (cited in the text directly below the diagram).
- Title without em-dash; `aria-label` replaced by `aria-labelledby` and a `<title>` stating
  what the diagram asserts; fixed `height` removed (viewBox 880 x 460, `height: auto`);
  full-bleed white background rect; fonts 10 to 14 px sans-serif; class prefix `kvd-`.
- Wide-diagram phone convention applied (`overflowX: auto` wrapper, `minWidth: 640`).
- Rendered check: `shoot.mjs --sections kv-cache --widths 1440,390` reported "ok" at both
  widths (no overlaps, no viewBox clipping, no page overflow), exit 0. PNGs read: at 1440 every
  label sits inside its box with clear gaps, block rows and count labels do not touch; at 390
  the diagram scrolls sideways with labels near 7 px, legible, nothing clipped. The page table
  was reworked from five to three columns (Model, KV bytes per token, Attention) after the
  first 390 shot showed the bytes column pushed off-screen; on the re-shoot all three columns
  fit and wrap cleanly.

## Leverage pass: claim-set diff (assertions in the after that were not in the before)

| New assertion | Source |
| --- | --- |
| 327,680 B per token, 2.68 GB at 8K, 85.9 GB at batch 32, 41.9 GB at 128,000 tokens | llama3Herd (derived) |
| Llama 3.1 70B has a 128K context | llama31ModelCard |
| 70.55 B parameters; 141.1 GB BF16, 70.6 GB FP8; 156.5 GB and 113.5 GB totals | llama70bApi (derived) |
| FP8 KV cache supported in TensorRT-LLM | trtllmQuantization |
| 65% weights and close to 30% KV for 13B on A100 40 GB | vllmPaper (measured) |
| 8 x 141 GB = 1,128 GB; about 1,057 GB left after FP8 weights | h200Page (derived) |
| Per-token bytes: 131,072 (Mistral 7B, Mixtral), 192,512 (Qwen3), 70,272 (DeepSeek-V3), 890 (V4.1-Flash) | configs (derived), deepseekV3Report (derived), deepseekV41Flash |
| More than 300x spread, 368x | deepseekV41Flash (derived) |
| Mixtral has eight experts per layer and the same attention shape as Mistral 7B | mixtralConfig |
| Qwen3 41% less than Llama; DeepSeek-V3 4.7x less | qwen3Config, deepseekV3Report (derived) |
| MLA caches a 512 latent plus 64 RoPE key, shared by 128 heads; only those are cached | deepseekV3Config, deepseekV3Report |
| Kimi K2 same 512 latent | kimiK2Config |
| gpt-oss-120b: half its layers use a 128-token window | gptOss120bConfig (derived) |
| Qwen3-Next: 12 of 48 layers keep KV, rest linear attention | qwen3NextConfig (derived) |
| V4.1-Flash 890 B is the global cache; SWA cache separate; FP4 main KV | deepseekV41Flash |
| GQA quality close to MHA at speed close to MQA | gqaPaper |
| TMEM used by FlashAttention on Blackwell | flashAttention4Paper |
| SBUF holds the tile on Trainium; 10K/8K sections; Trn2 and Trn3; CTE is prefill | nkiAttentionCte |
| FA2 supports Ampere, Ada, Hopper; FA3 beta for Hopper | flashAttentionReadme |
| FA3 overlaps async data movement and wgmma with softmax | flashAttention3Paper |
| FA4 in CuTe DSL, Hopper and Blackwell, `pip install flash-attn-4` | fa4Readme |
| FA4 betas, latest fa4-v4.0.0.beta35 on 2026-10-14 | fa4Release |
| Dense BF16 tensor throughput 2.3x from H200 to B200 | h200Page, hgxPage (derived) |
| SFU exponentials 4.5 to 5 TeraExponentials/s; softmax can become a latency bottleneck; Blackwell Ultra doubles SFU throughput for attention | blackwellUltraBlog |
| FA4 uses software-emulated exponentials and conditional softmax rescaling | flashAttention4Paper |
| Earlier systems used 20.4% to 38.2% of KV memory for token state | vllmPaper (measured) |
| TensorRT-LLM: block pool, prefix reuse, secondary-memory eviction | trtllmKvCache |
| NVFP4 KV listed in TensorRT-LLM; `KvCacheConfig(dtype='fp8')` | trtllmQuantization |

"A fused kernel runs at the pace of its slowest unit" re-expresses the FA4 paper's
asymmetric-scaling thesis and carries its citation.

## Orchestrator actions

- `sources.md` is out of sync: `vitest run src/__tests__/sources.test.ts` fails only on the
  "keeps sources.md in sync with the registry" snapshot (817 of 818 pass, tier consistency
  included). Regenerate `sources.md`.
- Glossary acronyms used in this section (add any that are missing): KV, HBM, BF16, FP8, FP4,
  NVFP4, MHA, GQA, MQA, MLA, RoPE, MoE, SMEM, TMEM, SBUF, wgmma, SFU, NKI, CTE, DSL (CuTe DSL).
- Cross-links in prose (no hash routing): Roofline and Arithmetic Intensity, Quantization and
  Precision, Disaggregated Serving and Speculative Decoding, NVIDIA Compilers and Kernel
  Tooling, Flash as a Cache Tier for Inference, and `../vllm/` (KV Offloading and LMCache).
- New records other sections may reuse: mistral7bConfig, qwen3NextConfig (config.json),
  llama31ModelCard, fa4Readme, trtllmKvCache, trtllmQuantization, nkiAttentionCte,
  flashAttentionPaper, flashAttention3Paper, flashAttention4Paper, vllmPaper, gqaPaper.
- Backlog idea (not built): a log-scale bar chart of KV bytes per token would carry the 368x
  spread better than the table.

## Checks (run 2026-10-18 from the dive root)

| Check | Result |
| --- | --- |
| `pnpm exec tsc --noEmit` filtered to my files | no type errors in my files |
| `pnpm exec eslint` on the section, sources and diagram, `--max-warnings 0` | exit 0 |
| `pnpm exec vitest run src/__tests__/sections.test.tsx -t KvCacheAndFlashAttention` | 1 passed, exit 0 |
| `scripts/gates/no-ai-tells.sh` | exit 0, 0 hits in my files |
| `scripts/gates/svg-a11y.sh` | exit 0, 0 hits in my files |
| `scripts/gates/pinned-refs.sh` | exit 0, 0 hits in my files |
| `scripts/gates/pre-overflow.sh` | exit 0, 0 hits in my files |
| `vite build --outDir /tmp/silicon-dist-kv-cache` + `shoot.mjs --sections kv-cache --widths 1440,390` | ok at both widths, exit 0 |
