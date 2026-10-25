# Fact check fc04-kernels: sections 8 (Attention Backends and Kernels) and 9 (Quantization and KV Precision)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
vLLM baseline v0.31.0, files read through `gh api .../contents/<path>?ref=v0.31.0` (`/tmp/vllm-new`
has no `vllm/platforms/cuda.py` or `vllm/config/cache.py`). Date 2026-10-24. Status: COMPLETE.
No diagram was touched in either file, so the harness was not run.

## B200 backend and page-size condition (owned by section 8), re-derived from code

Order at startup (`python/sglang/srt/arg_groups/pipeline.py#L232`, then `#L246`, then `#L294`): the
default backend is chosen in `handle_attention_backend_compatibility` (`attention_hook.py#L119` runs
`overrides.py#L1067-L1081` `_attention_backend_default`, which calls
`model_override_base.py#L268-L341` `get_default_attn_backend`); page constraints and the page
default run next (`overrides.py#L1084-L1150`, `#L1303-L1326`); the speculative hook runs last
(`speculative_hook.py#L1068-L1090` fills the automatic draft shape, asserts, and rejects
`trtllm_mha` with topk above 1). `is_no_spec_infer_or_topk_one` (`utils/common.py#L4014-L4020`) is
True when topk is unset, or when topk is 1 and the page size is unset or 1. `is_sm100` is
compute-capability major 10 with CUDA 12.8 or later (`utils/common.py#L302-L306`), so it covers SM100
and SM103. `LlamaForCausalLM` registers no override module (only `llama4.py` exists for Llama 4).

Dense Llama-style model, EAGLE draft, no explicit backend:

| case | SM90 (H100, CUDA 12.3+) | SM100 / SM103 (B200) |
|---|---|---|
| speculation off | `fa3`, page 1 | `trtllm_mha`, page 64 (unset page is not in [16, 32, 64, 128], set to 64) |
| on, topk unset, num-steps unset | `fa3`, page 1; the automatic shape for Llama is steps 5, topk 4, draft 8 (`speculative_hook.py#L1349-L1350`), so fa3 runs topk 4 | `flashinfer`, page 1 (the SM100 branch needs topk set, `model_override_base.py#L303-L311`); automatic topk 4 afterwards |
| on, topk 1, num-steps set, page unset | `fa3`, page 1 | `trtllm_mha`, page 64 |
| on, topk 1, num-steps unset | startup fails: `assert speculative_eagle_topk is None and speculative_num_draft_tokens is None` (`speculative_hook.py#L1068-L1072`) | same assertion failure |
| on, topk 1, explicit `--page-size` 16/32/64/128 | `flashinfer` at that page size | `flashinfer` at that page size |
| on, topk 1, explicit `--page-size 1` | `fa3`, page 1 | `trtllm_mha`, page raised to 64 |
| on, topk above 1, page unset | `flashinfer`, page 1 | `flashinfer`, page 1 |
| on, topk unset, num-steps set | our reading: topk stays unset and `speculative_hook.py#L1184` compares `None > 1`, a TypeError at startup (not run) | same |

**Cross-section conditions block, verdict.** The `trtllm_mha` / page-64 statement holds for
speculation off and for topk unset or above 1. The "on with an explicit `--speculative-eagle-topk 1`"
case is incomplete in two ways: (1) it also needs `--page-size` left unset (or 1); an explicit
`--page-size` of 16, 32, 64 or 128 with topk 1 moves B200 to `flashinfer` at that page size;
(2) the section-21 addition is right that `--speculative-num-steps` must be set, but the consequence
without it is an assertion failure at startup, not a different backend. Section 8 now states both.

## AttentionBackends.tsx

132 claims checked (125 original `Cite`s, the diagram labels and grid values, the B200 derivation
cases, the vLLM v0.31.0 priority list and default block size). 116 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| K1 | First rank compiles every token count "from 1 to 16,384 at default chunk sizes" | AttentionBackends.tsx:1108-1116 | WRONG (B200) | `layers/deep_gemm_wrapper/compile_utils.py#L93-L102`: `m_max = chunked_prefill_size * 2` above 8,192; `arg_groups/memory_hook.py#L132-L167`: default chunk 8,192 on H100-class, 16,384 at 160 GB and above (B200) | Range stated by chunk size, then 1 to 16,384 on H100 and 1 to 32,768 on B200; cite memory_hook.py L130-L168 added, compile_utils range widened to L42-L113 (covers the `DG_JIT_CACHE_DIR` redirect at L51) |
| K2 | Topk above 1, or topk 1 with an explicit page above 1, drops to `flashinfer` "and page size 1" | AttentionBackends.tsx:993-995 | WRONG (sub-case) | `overrides.py#L1303-L1306` sets 1 only when the page is unset; an explicit page survives | "at page size 1 unless you set one" |
| K3 | To keep `trtllm_mha` under speculation on B200, set num-steps and topk 1 | AttentionBackends.tsx:1010-1016 | OVERREACH (missing condition) | `utils/common.py#L4014-L4020` (explicit page above 1 fails the topk-1 test); `speculative_hook.py#L1068-L1072` (assertion without num-steps) | Added "leave `--page-size` unset" and "Topk 1 without `--speculative-num-steps` fails an assertion at startup" |
| K4 | Docs-vs-code bullet: code leaves `trtllm_mha` when topk is unset | AttentionBackends.tsx:1392-1393 | OVERREACH (incomplete) | same as K3 | Added "or topk 1 with an explicit page size above 1" |
| K5 | Qwen3.5 / Qwen3-Next on SM100: `trtllm_mha` page 64 "otherwise" | AttentionBackends.tsx:899-903 | OVERREACH | `arg_groups/model_overrides/qwen3_5.py#L34-L48`: `trtllm_mha` only when `get_default_attn_backend` returns it; else `triton`, page 1 | "when the generic table would pick it, and stay on triton with page size 1 when it would not". Diagram leaf note "else trtllm_mha, page 64" left as a summary (diagram not touched) |
| K6 | GPT-OSS has a rule per platform "because the generic table avoids FlashInfer for models with attention sinks" | AttentionBackends.tsx:882-884 | UNSUPPORTED | `model_overrides/gpt_oss.py#L24-L44` states no reason; the generic table would give the same `fa3` / `trtllm_mha` on SM90 / SM100 | Causal clause replaced by what the rule sets: trtllm_mha SM100, fa3 SM90, aiter ROCm, intel_xpu Intel GPUs, triton other GPUs |
| K7 | "ROCm GPUs get aiter" (generic table, both attention types) | AttentionBackends.tsx:838 | OVERREACH | `model_override_base.py#L331-L337`: MLA gets `aiter` only at 16 or 128 KV heads per rank, else `triton` | Condition added (matches the diagram grid) |
| K8 | Hybrid models "with linear-attention or state-space layers" take `--linear-attn-backend` | AttentionBackends.tsx:891-892, 701 | OVERREACH | `arg_groups/fields/exec_.py#L480-L486` help: GDN/KDA linear attention; Mamba state-space layers use `--mamba-backend` (`exec_.py#L421-L427`) | Narrowed to linear-attention layers in prose and knob row |
| K9 | Support matrix still lists Dual Chunk FlashAttention, cited L325-L330 | AttentionBackends.tsx:1400-1406 | UNSUPPORTED at cited range | `docs/docs/advanced_features/attention_backend.mdx#L116` carries the Dual Chunk row; L325-L330 carry only Cutlass MLA | Second doc cite L116 added |
| K10 | `flashmla` with an FP4 KV cache "fails at startup" | AttentionBackends.tsx:1458-1459 | OVERREACH | `arg_groups/kv_cache_hook.py#L266-L305`: the MLA assert runs when prefill and decode share a backend; a split pair with a non-fa4 prefill only warns | "as the single backend" |
| K11 | `SGLANG_JIT_DEEPGEMM_FAST_WARMUP=1` compiles "about 3,000" token counts | AttentionBackends.tsx:721 | OVERREACH | `compile_utils.py#L66-L92`: 3,073 at a 16,384 chunk, 2,561 at 8,192 | "about 3,000 at a 16,384-token chunk" |
| K12 | DeepGEMM used "whenever the GPU is SM90 or newer" | AttentionBackends.tsx:1091-1093 | OVERREACH | `deep_gemm_wrapper/configurer.py#L44`: SM120/121 also require the SM120 DeepGEMM APIs | Parenthesis added |
| K13 | `dsa` page: 64 times the indexer pool on CUDA and ROCm | AttentionBackends.tsx:338 | OVERREACH | `model_overrides/deepseek_v2.py#L152-L161`: page 1 on ROCm when AITER's preshuffle path is unavailable | ROCm exception added |
| K14 | Ascend is "the largest non-CUDA backend in the tree" | AttentionBackends.tsx:616 | OVERREACH (scope) | Measured only `srt/hardware_backend/*` (npu 21,421 Python lines, mlx 7,187, xpu 1,600); ROCm code sits in `layers/` and was not measured | "The largest platform directory under hardware_backend/" |
| K15 | `sglang-kernel` "imported as sgl_kernel", cited aot/pyproject.toml L10-L11 | AttentionBackends.tsx:1054-1061 | UNSUPPORTED at cited range | `python/sglang/kernels/aot/pyproject.toml#L42` `wheel.packages = ["python/sgl_kernel"]` | Cite L42 added |
| K16 | "Importing sglang" redirects the third-party caches, cited environ.py only | AttentionBackends.tsx:1152-1157 | UNSUPPORTED at cited range | `python/sglang/__init__.py#L11-L14` calls `redirect_third_party_caches()` | Cite added |

Build-log open items for section 8, settled:
- B200 leaves `trtllm_mha` with speculation on and topk unset: CONFIRMED (`model_override_base.py#L303-L311`, resolved at `pipeline.py#L232` before the speculative hook at `#L294`); see the derivation above for the two missing topk-1 conditions.
- MPS backend comes from the generic step, not a platform hook: CONFIRMED. `platform_hook.py#L41-L50` only turns overlap scheduling off (without MLX); `model_override_base.py#L318-L319` returns `torch_native` for MPS.
- 03 F5 "TPU via SGLang-JAX only" too strong: CONFIRMED as shipped. `README.md#L52` names SGL-torchtpu (link to an LMSYS blog); the tree has only a `PlatformEnum.TPU` value (`srt/platforms/device_mixin.py#L54`) and an out-of-tree plugin loader, no TPU platform code. sglang-jax releases are all prerelease, newest `v0.1.0rc0` (2026-08-29), via `gh api repos/sgl-project/sglang-jax/releases`.

Spot notes on CONFIRMED items: 33 override modules (`ls arg_groups/model_overrides`, minus `__init__.py`); 25 backend names with `nsa` and `compressed` deprecated (`choices.py#L69-L99`); sgl-attn redirects to `sgl-project/sgl-flash-attn`, a fork of Dao-AILab/flash-attention, and FlashMLA and DeepGEMM are forks of the deepseek-ai repos (`gh api repos/...`); fa4 imports the vendored `sglang.kernels.ops.attention.flash_attn.cute` unless `SGLANG_INKLING_FA4_USE_PIP=1` (`kernels/ops/attention/flash_attention_v4.py#L13-L21`); compute capabilities re-fetched from https://developer.nvidia.com/cuda/gpus (B300 10.3, RTX PRO 6000 and 4500 Blackwell 12.0, L4 and L40S 8.9); EC2 accelerated-computing spec page lists no AMD Instinct GPU (G4ad carries a Radeon Pro V520); vLLM v0.31.0 `vllm/platforms/cuda.py#L154-L179` puts FLASHINFER first on major 10 and FLASH_ATTN first otherwise, and `vllm/v1/attention/backends/flashinfer.py#L428-L449` supports 16, so the preferred block stays at `DEFAULT_BLOCK_SIZE` 16 (`vllm/config/cache.py#L71`, `#L333-L334`).

Not fixed (diagram untouched): the selection diagram's warning box speaks of explicit topk above 1 only, and its Qwen3.5 leaf reads "else trtllm_mha, page 64"; both are correct summaries of the common case and the prose carries the full conditions.

**Score: 8/10.** The three-step resolution model and the H100-to-B200 page-size payoff are clear, cited at the pin and landed repeatedly; after fixes the speculation and DeepGEMM conditions match code. Held at 8 by length (a long docs-vs-code tail and three tables) and two diagram summaries that are narrower in prose than in the picture.

## Quantization.tsx

Checked by a forked sub-agent under the same COMMON rules (edits confined to Quantization.tsx);
spot-checked by the parent (Q1 against `overrides.py#L867-L889`, Q3 against the derivation above).

98 claims checked (every `Cite` in the file, the EC2-to-compute-capability map re-fetched from the
EC2 spec page and NVIDIA's CUDA GPUs page, the vLLM v0.31.0 `CacheDType` list and quantization
registry via `gh api ...?ref=v0.31.0`, the AWQ and GPTQ paper titles on arXiv). 86 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| Q1 | `--kv-cache-dtype bf16` keeps a BF16 pool (prose and check 4), right after the DeepSeek V4 rule | Quantization.tsx:746, 997 (old) | WRONG (DeepSeek V4) | `python/sglang/srt/arg_groups/overrides.py#L883-L886`: V4 asserts `kv_cache_dtype in ["fp8_e4m3", "bfloat16"]`; `bf16` fails (the DSA path normalises it at `#L515-L516`, V4 does not) | Both places say `bfloat16` on DeepSeek V4; cite overrides.py L878-L886 (code) |
| Q2 | `bf16`, `bfloat16` row: "Everywhere" | Quantization.tsx:335 (old) | OVERREACH | `overrides.py#L1164-L1167`: `trtllm_mla` (DeepSeek V3 default on B200) accepts `fp8_e4m3`, `bf16`, `auto` and rejects `bfloat16`; `#L883-L886` V4 accepts only `bfloat16` | Row narrowed to name both spelling limits; two code cites added |
| Q3 | Dense Llama defaults on EC2: `fa3` on P5, `trtllm_mha` on P6 (unconditioned) | Quantization.tsx:844 (old) | WRONG vs Cross-section conditions | `model_override_base.py#L293-L311`; derivation in fc04-kernels.md | "with speculative decoding off" added |
| Q4 | "One name on the menu has no loader on GPUs" (plain `gptq`) | Quantization.tsx:518 (old) | WRONG | `layers/quantization/__init__.py#L138-L144`: `mlx_q4`, `mlx_q8` also register only on MPS (the page's own expandable says so) | "Plain GPTQ is on the menu with no loader on GPUs" |
| Q5 | FP8 on SM80 to SM88 runs through Marlin (table row, prose, Against-vLLM line) | Quantization.tsx:86, 620, 949 (old) | OVERREACH | Marlin is wired only in `Fp8LinearMethod` (`layers/quantization/fp8.py#L506-L512`, `#L1208-L1231`); `Fp8MoEMethod` (from `#L1371`) has no FP8 Marlin path and `moe_hook.py` auto-selects none | Narrowed to the linear layers in all three places |
| Q6 | Docs mark MXFP8 unsupported on AMD; code floor "gfx95x on AMD" | Quantization.tsx:668 (old) | WRONG (narrow) | `fp8.py#L328-L331` returns 94 when `_mxfp8_to_block_fp8_required`; `utils/common.py#L4736-L4747` is true on gfx942 (weights converted to block FP8) | "natively on gfx95x and on gfx942 after converting the weights to block FP8"; cite utils/common.py L4736-L4747 added |
| Q7 | `--bf16-gemm-backend auto` on SM100/SM103 "selects SGLang's own JIT GEMM kernels" | Quantization.tsx:650 (old) | OVERREACH | `layers/quantization/unquant.py#L248-L254` picks `cutedsl`; `arg_groups/fields/exec_.py#L241-L248` help: dispatches between Split-K, CuTe DSL and cuBLAS (torch under deterministic inference) | "selects `cutedsl`, which routes each shape to SGLang's own JIT kernels or to cuBLAS" |
| Q8 | SGLang KV dtypes "add" MXFP8 and two FP4 recipes against vLLM | Quantization.tsx:952 (old) | OVERREACH | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L39-L58 lists `nvfp4`, `nvfp4_ds_mla` (vLLM has NVFP4 KV) | "offer ... where vLLM v0.31.0 lists NVFP4 and per-token-head INT8 and INT4"; vLLM cite added |
| Q9 | E5M2 "largest value 57,344" in the KV table | Quantization.tsx:308 | UNSUPPORTED at cited lines | `kv_cache_dtype.py#L49-L55` has no range; `docs/docs/advanced_features/quantized_kv_cache.mdx#L24` carries it | Docs cite L24 added to the row |
| Q10 | E4M3 "is the type SGLang stores an FP8 KV cache in on NVIDIA" | Quantization.tsx:427 | OVERREACH | `kv_cache_dtype.py#L49-L55`: explicit `fp8_e5m2` stores E5M2 | "unless you ask for E5M2" |
| Q11 | "as ModelOpt checkpoints do with `kv_cache_quant_algo: FP8`" | Quantization.tsx:731 | OVERREACH (minor) | `layers/quantization/modelopt_quant.py#L489-L498` reads the key, which a checkpoint may leave unset | "as a ModelOpt checkpoint does with ..." |
| Q12 | AWQ first use not expanded (build-log item) | Quantization.tsx:465 | prose (acronym) | arXiv 2306.00978 title "AWQ: Activation-aware Weight Quantization ..." | "AWQ (activation-aware weight quantization)". GPTQ left described by role: arXiv 2210.17323 names it without an expansion |

Build-log open items for section 9, settled:
- DSA and V4 switch `auto` KV to FP8: CONFIRMED with conditions. DSA (DeepSeek family archs): `fp8_e4m3` at compute capability 10.0 and above without learnable sinks, BF16 below, `bfloat16` on XPU, untouched on NPU (`overrides.py#L466-L523`). V4: `fp8_e4m3`, `bfloat16` on NPU (`#L867-L889`). New: V4 rejects the `bf16` spelling (Q1).
- `fp8_e5m2` moves attention off FA3: CONFIRMED, `overrides.py#L1225-L1233`, run at `attention_hook.py#L238` after the default fill at `#L119`; only when the base `attention_backend` is `fa3`.
- Scales JSON ignored under `auto`: CONFIRMED for the checkpoint route. `load_model_utils.py#L119-L141` reads the file only for `fp8_e4m3`; `model_runner.py#L1318-L1327` passes the resolved server arg before `configure_kv_cache_dtype` turns `auto` into FP8. (The DSA/V4 rules rewrite the server arg to `fp8_e4m3`, so the JSON is read there; the page claims only the checkpoint case.)
- PD requires the same KV dtype on both sides: CONFIRMED, `disaggregation/common/conn.py#L1191-L1199` (decode raises on string mismatch; page size checked just above at L1184-L1189).
- GPTQ/AWQ: AWQ expanded from its paper title; GPTQ has no published expansion and stays described ("weight-only formats computed offline from a calibration set").

B200 consistency: the only trtllm_mha statement (Q3) now carries the speculation-off condition. No page-size claim in this file.

Checks: `no-ai-tells` PASS, `pinned-refs` PASS, `svg-a11y` PASS; `pnpm --filter @tech-deep-dives/sglang typecheck` exit 0 (`tsc --noEmit`, no output); `lint` exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no output). No diagram in the file, harness not run.

**Score: 8/10.** Every number and default is cited at the pin and the 448 figure lands five times;
the corrections were scope narrowings (V4 spelling, Marlin linear-only, speculation condition). Held at 8 by length: two
long tables plus three expandables push the payoff checklist far down, and several conflicts read as evidence tail.
