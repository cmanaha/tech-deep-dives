# Fact check fc03-memory: sections 6 (KV Memory and the Defaults Your GPU Picks) and 7 (HiCache)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
vLLM baseline v0.31.0, files read through `gh api .../contents/<path>?ref=v0.31.0` (the local
`/tmp/vllm-new` checkout has no `.py` files). Qwen3-8B `config.json` and
`model.safetensors.index.json` fetched at Hugging Face revision
b968826d9c46dd6066d109eabc6255188de91218. EC2 accelerated-computing specs page fetched
2026-10-24. Date 2026-10-24. Status: COMPLETE. No diagram was touched in either file, so the
harness was not run.

## KvMemory.tsx

84 claims checked (73 `Cite`s after fixes, plus the worked-example arithmetic, the ten EC2 per-GPU
memory figures in the tier table, vLLM's 0.92 default, vLLM's 16-token blocks on H100 and B200,
vLLM counting the CUDA graph pool inside `--gpu-memory-utilization`, and the section titles it
names). 70 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| K1 | `trtllm_mha` and 64-token pages are the B200 default "without tree speculation" | KvMemory.tsx:450, 1028, 1193 (old) | WRONG (Cross-section conditions) | `arg_groups/model_override_base.py#L303-L315`: SM100 takes `trtllm_mha` only if `speculative_algorithm is None or speculative_eagle_topk is not None`, so speculation with topk unset leaves it; `arg_groups/speculative_hook.py#L1068-L1072`: topk set without `--speculative-num-steps` fails the assert | Page row: "with speculative decoding off, or on with --speculative-eagle-topk 1 and --speculative-num-steps set"; paragraph: same condition, cites speculative_hook.py L1068-L1072 and model_override_base.py L303-L315 for the topk-unset case; Against-vLLM line: "with speculative decoding off" |
| K2 | `fa4` is the SM100/SM103 default when K and V widths differ (no condition) | KvMemory.tsx:456 (old) | OVERREACH | Same branch, `model_override_base.py#L303-L313`: `fa4` is returned inside the speculation-gated `elif` | Added "under the same speculation condition" |
| K3 | "This is an inference from the default chain in code, not a documented statement" | KvMemory.tsx:1027 (old) | WRONG | `docs/docs/advanced_features/attention_backend.mdx#L552-L554` documents the fa3 (Hopper) and trtllm_mha (Blackwell) defaults; only the 64-token page that follows is code-read (docs L325 lists 16/32/64) | "by our reading of the default chain in code" |
| K4 | `--kv-cache-dtype auto` keeps the model dtype unless the checkpoint declares FP8 | KvMemory.tsx:682-688 (old) | OVERREACH | `arg_groups/overrides.py#L508-L513` (DeepSeek DSA on SM major 10 and up, no learnable sinks, auto to fp8_e4m3); `overrides.py#L878-L880` (DeepSeek V4 auto to fp8_e4m3) | Added one sentence with both cites |
| K5 | The memory size is missing only for an unknown device or an out-of-tree plugin with no size | KvMemory.tsx:840-846 (old) | WRONG (list incomplete) | `utils/common.py#L862-L865`: `get_cpu_memory_capacity` returns None when `SGLANG_CPU_OMP_THREADS_BIND` is set, which reaches the 0.95 fallback at `arg_groups/memory_hook.py#L326-L330` | Added the CPU case with cite common.py L862-L865 |
| K6 | The docstring "still describes an older reserve" | KvMemory.tsx:849-853 (old) | UNSUPPORTED, prose (page-history voice) | `memory_hook.py#L66-L67` gives `chunked_prefill_size * 1.5 + max_bs * 2` "in GB"; nothing at the pin shows it is older | "gives a two-term reserve ... in GB. The code after it works in MiB, adds more terms, and is what runs." |
| K7 | A small and a large dense text model at the same TP on the same GPU get the same fraction | KvMemory.tsx:784-787 (old) | OVERREACH | MLA backends reserve a flat 1.5 GiB instead of 8 MiB per prefill size (`memory_hook.py#L386-L391`); aiter on ROCm scales the fraction by 0.85 for context over 8192 (`arg_groups/attention_hook.py#L244-L268`) | Narrowed to "dense MHA or GQA text model ... on the same NVIDIA GPU" |
| K8 | "The table lists every backend that changes the page size" | KvMemory.tsx:1044 (old) | OVERREACH | Ascend NPUs default to 128 outside `overrides.py` (`hardware_backend/npu/utils.py#L96-L101`); model overrides set their own (e.g. `arg_groups/model_overrides/deepseek_v2.py#L172-L173`) | "the attention backends whose resolution rules change the page size on NVIDIA and Intel GPUs" |
| K9 | `trtllm_mha` turns "the default 1" into 64 | KvMemory.tsx:1119-1120 (old) | WRONG (minor) | The constraint runs at `pipeline.py#L232` with `page_size` still None; the default 1 is applied later by `_page_size_default` (`pipeline.py#L246`, `overrides.py#L1304-L1325`) | "including an explicit 1 or an unset page size" |
| K10 | Qwen3-8B "takes the generic defaults" | KvMemory.tsx:708-709 (old) | OVERREACH (minor) | `Qwen3ForCausalLM` has an architecture default for boundary reduction, `arg_groups/boundary_reduction.py#L14-L25`; none for memory or attention | "takes the generic memory and attention defaults" |
| K11 | One K and one V tensor per layer, cited to L2518-L2530 | KvMemory.tsx:656 | UNSUPPORTED at cited range | L2518-L2530 holds only the shapes; the per-layer lists are `mem_cache/memory_pool.py#L2573-L2582` | Range widened to L2518-L2582 |
| K12 | Keys cut to whole pages "before match and insert", cited to `page_aligned` only | KvMemory.tsx:997-1001 | UNSUPPORTED at cited range | Calls are `mem_cache/radix_cache.py#L406` (match_prefix) and `#L438` (insert) | Added cite radix_cache.py L406-L438 |
| K13 | Multimodal cut "sized to the vision tower", cited to L404-L416 | KvMemory.tsx:867-870 | UNSUPPORTED at cited range | L404-L416 is the DeepEP term; the ViT-sized cut is `memory_hook.py#L419-L464` | Range widened to L404-L464 |
| K14 | topk and page-size predicate cited to common.py L4012-L4017 (twice) | KvMemory.tsx:1030, 1107 (old) | UNSUPPORTED at cited range | `utils/common.py#L4014-L4020`; the topk-1 and page-size clause is L4018-L4019, outside the old range | Both cites moved to L4014-L4020 |

Worked example, recomputed from the pinned config and the v0.5.22 formula (our arithmetic, not run):

- Per token: 8 KV heads x (128 + 128) x 36 layers x 2 bytes = 147,456 bytes (`pool_configurator.py#L464-L471`). Weights 16,381,470,720 bytes = 15.256 GiB (index `total_size`).
- H100, 81,559 MiB assumed, TP 1: tier 60-90 GiB gives chunk 8192 and decode max batch 256 (`memory_hook.py#L89-L180`). Prefill CUDA graph is on by default on CUDA (`model_executor/cuda_graph_config.py#L119-L123`), max batch 8192, 58 capture sizes (`arg_groups/cuda_graph_hook.py#L442-L459`). Post-capture sizing is off (`environ.py#L589`). Reserve 512 + 8192 x 1.5 + 128 + 256 x 2 + 58 x 8 = 13,904 MiB, above the 10 GiB floor; fraction round(67,655 / 81,559, 3) = 0.830. Non-static 79.647 x 0.17 = 13.54 GiB; pool 79.647 - 15.256 - 13.54 = 50.85 GiB; 370,284 tokens. With the EC2 table's 81,920 MiB the fraction is also 0.830. At TP 8 (max batch 512, TP term 1,024): 15,312 MiB, 0.812.
- B200, 183,296 MiB assumed: tier 160 GiB and up gives chunk 16384, max batch 512, 74 capture sizes. Reserve 512 + 24,576 + 128 + 1,024 + 592 = 26,832 MiB; fraction 0.854; non-static 26.13 GiB; pool 137.61 GiB; 1,002,050 tokens (rounded down to 64-token pages).
- Ratios 183,296 / 81,559 = 2.25 and 1,002,050 / 370,284 = 2.71; FP8 halves the cell to 740,568 and 2,004,100 tokens; 0.92 in SGLang leaves 0.08 x 79.6 = 6.4 GiB against the 13.6 GiB reserve. All table and diagram figures match. None of the breakable-graph incompatibility rules (`cuda_graph_hook.py#L151-L198`) apply to Qwen3-8B.

Build-log items settled: the Qwen3-8B example holds as above; register 01 D4 (0.95 fallback narrower, nvidia-smi failure falls back to `torch.cuda.mem_get_info`, `common.py#L748-L816`) CONFIRMED and now also carries the CPU case; register 02 D5 (default path `pool_configurator.py#L614-L624`) CONFIRMED.

Spot notes on CONFIRMED items that carry conditions: the 0.92 vLLM figure and its CUDA graph pool are inside the budget at v0.31.0 (`vllm/config/cache.py#L103`, `vllm/v1/worker/gpu_worker.py#L633-L676`); vLLM's 16-token block holds on both GPUs for a BF16 head-dim-128 model (`vllm/v1/attention/backends/flashinfer.py#L430-L449`, `flash_attn.py#L355-L375`, default 16 at `vllm/config/cache.py#L70`); `--max-running-requests` 2048 to 4096 is per DP worker (`kv_cache_configurator.py#L2800-L2813`); the explicit-`--max-running-requests` cap on the decode graph applies only when the graph maximum was left at its default (`memory_hook.py#L182-L188`).

**Score: 8/10.** The 0.83-against-0.92 and 1-token-against-64-token figures give a working mental model and land three times each; every number now traces to a v0.5.22 line, and the worked example recomputes exactly.
Held at 8 by length and by the density of code-only claims in the fraction and page-size containers.

## HiCache.tsx

94 claims checked (103 `Cite`s after fixes, plus the 13-plus-`dynamic` backend count, the six names no doc page lists, the 33 s / 14.8 s / 286,720-token arithmetic, the `timeout_max` absence search, the `sglang serve` entry point, the vLLM v0.31.0 offloading store-per-step behaviour behind "both write through by default", and the section 5, 12 and 15 titles). 86 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| H1 | The scheduler asks L3 by page hash how many further pages it holds, cited to `query_storage_hit_length` | HiCache.tsx:590 (old) | UNSUPPORTED at cited range | `mem_cache/unified_radix_cache.py#L1950-L1989` is called only from `disaggregation/decode_hicache_mixin.py#L91` (PD decode). The default path is `prefetch_from_storage` (`unified_radix_cache.py#L1992-L2058`) feeding `managers/cache_controller.py#L1247-L1270` (`_storage_hit_query`: page hashes, `batch_exists`) | Cite replaced with cache_controller.py L1247-L1270 |
| H2 | "as soon as the request arrives" | HiCache.tsx:586 (old) | UNSUPPORTED at cited range | Arrival call is `managers/scheduler.py#L3361-L3366` (`_add_request_to_queue` calls `_prefetch_kvcache` before appending to the waiting queue); cited L3215-L3260 shows only the function body | Added cite scheduler.py L3361-L3366 |
| H3 | HiSparse: "the documentation runs it with PD disaggregation, on the decode instance" | HiCache.tsx:1055 (old) | WRONG (paraphrase weakens the source) | `docs/advanced_features/hisparse_guide.mdx#L9`: "HiSparse currently requires **PD disaggregation mode** and is enabled on the **decode instance** only" | Reworded: "the documentation says it currently requires PD disaggregation and is enabled on the decode instance only" |
| H4 | A `prefetch_timeout_max` you pass "travels to the backend unused" | HiCache.tsx:794-795 (old) | OVERREACH | `mem_cache/hybrid_cache/hybrid_cache_controller.py#L392-L426` hands unknown keys to the backend; whether a backend uses a key is backend-specific (NIXL flat form forwards every key as a plugin init param, `mem_cache/storage/nixl/nixl_utils.py#L105-L113`) | "goes to the backend with the other keys and caps nothing" |
| H5 | A LoRA request carries an `extra_key` | HiCache.tsx:896 | UNSUPPORTED at cited range | Cited `mem_cache/utils.py#L125-L152` shows the namespace seed only; the LoRA concatenation is `managers/schedule_batch.py#L1132-L1139` | Added cite schedule_batch.py L1132-L1139 (new const `SCHEDULE_BATCH`) |
| H6 | Attach and detach need `--admin-api-key` and an idle scheduler | HiCache.tsx:925-932 (old) | UNSUPPORTED at cited range (detach half) | Detach key check `entrypoints/http_server.py#L1148-L1149` and idle check `managers/scheduler.py#L5309-L5317` sat outside L1107-L1117 and L5245-L5261 | Ranges widened to http_server.py L1107-L1149 and scheduler.py L5245-L5317; route range L1086-L1160 to L1086-L1163 |
| H7 | `file` "is the demonstration backend" | HiCache.tsx:854 | UNSUPPORTED at cited range | Cited `hicache_design.mdx#L65` covers `/tmp/hicache` and node-local scope; "for demonstration purposes" is `hicache_design.mdx#L173` | Added cite hicache_design.mdx L173 |
| H8 | Line ranges off by one to three lines | registry.py, unified_radix_cache.py, hash_binding.cpp cites | UNSUPPORTED at cited range (range fix) | `registry.py#L101-L144` (FlexKV return at L144); `unified_radix_cache.py#L3045-L3053` (threshold check starts L3045, L3044 is the previous branch's `continue`); `unified_radix_cache.py#L3442-L3480` (the zero-token fallback return is L3480); `cpp_utils/hash_binding.cpp#L62-L75` (`hash_page`, the chained SHA-256) | Ranges shifted |

Build-log items settled:
- NIXL to S3 through the `OBJ` plugin reads as code reading: "We read this path from source and did not run it, and no transfer rate for it was located during this research." Plugin order `FILE_PLUGINS = ["3FS", "POSIX", "GDS_MT", "GDS"]` then `OBJ`, and the `AWS_DEFAULT_BUCKET` fallback, confirmed at `nixl_utils.py#L118-L185`. CONFIRMED.
- Runtime attach needs `--admin-api-key` and an idle scheduler: CONFIRMED for both attach and detach after H6; `POST /hicache/storage-backend/clear` carries no key check (`http_server.py#L1087-L1095`) and the page claims none.
- Backend count: the page says thirteen named plus `dynamic` (table and prose), matching `storage/backend_factory.py#L204-L276` and the 00 erratum. CONFIRMED; no "15" remains.

Spot notes on CONFIRMED items that carry conditions: the 256-token prefetch threshold is raised only in `buffer_only` mode with a sliding-window model (`unified_cache/storage_attachment.py#L293-L301`); the timeout counts the L3-hit pages, since `operation.hash_value` is truncated to the hit boundary (`cache_controller.py#L1301-L1303`), so "tokens to fetch" holds; the under-10-token load-back skip applies when no auxiliary component transfer is pending (`unified_radix_cache.py#L1790`), which is the dense-model case; the session-cache log line prints because the default tree core is `rust` (`environ.py#L688`); "both write through by default" in the Against-vLLM line holds for vLLM v0.31.0's offloading connector, which queues stores for the blocks each step completes (`vllm/distributed/kv_transfer/kv_connector/v1/offloading/scheduler.py#L1501-L1530` at v0.31.0). HiSparse's PD requirement is a documentation statement; no startup check enforcing it was found in `arg_groups/hisparse_hook.py` or `arg_groups/pd_disaggregation_hook.py` (not stated on the page).

**Score: 8/10.** Clear mental model (one tree spans the tiers, eviction moves a node down a tier) and a practical payoff (the 33 s storage-hit wait against the documented 30 s cap) that lands four times; after fixes every number traces to a v0.5.22 line range or doc line.
Held at 8 by its length and its density of code-only claims (most paragraphs carry three or more `kind="code"` cites), which make the middle containers heavy reading.

## Checks

- `pnpm --filter @tech-deep-dives/sglang typecheck`: exit 0, no errors.
- `pnpm --filter @tech-deep-dives/sglang lint`: exit 0, no warnings.
- `scripts/gates/no-ai-tells.sh`, `pinned-refs.sh`, `svg-a11y.sh`: PASS.
