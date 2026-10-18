# fc03-offload-quant: fact-check of KVOffloadingLMCache.tsx and Quantization.tsx

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new, docs at
/tmp/vllm-new/docs. Old tree /tmp/vllm-old (commit 15652a6b703f059767d75e5a511c4a5accf969ad,
2026-06-07). LMCache v0.5.6, Dynamo v1.5.1, production-stack vllm-stack-0.1.13, vllm-bnb-plugin
v0.0.3, vllm-gguf-plugin v0.0.5 fetched with `gh api` at those tags. Read 2026-10-17.

Abbreviations: `V/` = `https://github.com/vllm-project/vllm/blob/v0.31.0/`,
`UG` = `V/docs/features/kv_offloading_usage.md`, `Q/` = `V/vllm/model_executor/layers/quantization/`.

## KVOffloadingLMCache.tsx

Claims checked: 80. CONFIRMED: 72. WRONG: 2. UNSUPPORTED: 4. OVERREACH: 2. Plus one prose fix and
one Section Shape move.

CONFIRMED (summary): store-per-step and load-on-hit model (`V/vllm/distributed/kv_transfer/kv_connector/v1/offloading/scheduler.py#L1501-L1530`, UG#L3); the CPU-tier sizing rule (UG#L355); connector API experimental warning (`V/vllm/distributed/kv_transfer/kv_connector/v1/base.py#L209-L212`); minor-release spacing 12 to 16 days (release notes v0.23.0 to v0.31.0 headers); the five secondary tier types (`V/vllm/v1/kv_offload/tiering/factory.py#L146-L174`); CPU tier is the only tier with GPU access (UG#L10-L15); 17 registered connectors (`V/vllm/distributed/kv_transfer/kv_connector/factory.py#L153-L248`); `--kv-offloading-size` GiB summed across TP, size times 2^30, `kv_both`, LMCache backend ignores the size (`V/vllm/config/cache.py#L256-L265`, `V/vllm/config/vllm.py#L1124-L1158`); `VLLM_USE_SIMPLE_KV_OFFLOAD` default 0 and the cpu/disk backends (`V/vllm/envs.py#L2184-L2185`, `V/vllm/distributed/kv_transfer/kv_connector/v1/simple_cpu_offload_connector.py#L55-L111`); every back-pressure claim (EMA per MiB, high watermark, `ThrottledDropPolicy` default, `DropStorePolicy`, obj/REMOTE network watermarks, per-tier or top-level merge, missing `backpressure_cls` rejected; `V/vllm/v1/kv_offload/tiering/backpressure.py#L55-L245`, `V/vllm/v1/kv_offload/tiering/spec.py#L290-L314`, `V/vllm/v1/kv_offload/tiering/factory.py#L73-L95`); usage guide silent on back-pressure (grep); per-request caps and `kv_load_tiers` semantics (UG#L25-L52, UG#L360-L380); CUDA/ROCm/XPU only (UG#L5-L6); LMCache README L53/L67/L73/L75 at v0.5.6; both LMCache connectors, `tcp://localhost:5555`, `use_native` (`lmcache_mp_connector.py#L481-L486`, `lmcache_connector.py#L88-L107`); `lmcache >= 0.3.9` and the cu12 `== 0.4.4` pin; LMCache v0.5.6 published 2026-10-14T22:21:42Z and still latest on 2026-10-17 (GitHub API); all HiSparse requirements (`V/vllm/config/vllm.py#L1813-L1842`, `#L702-L708`, `scheduler_reserve_full_isl` default True at `V/vllm/config/scheduler.py#L191`); `kv_load_failure_policy` default `fail` (`V/vllm/config/kv_transfer.py#L103-L106`); digest fields with no weight revision, and `dtype` is the KV cache dtype (`V/vllm/v1/kv_offload/file_mapper.py#L20-L144`, `V/vllm/distributed/kv_transfer/kv_connector/v1/offloading/config.py#L261-L264`); fs/obj have no capacity or eviction key (fs and obj manager constructors); KV-event and `self_describing_kv_events` claims (UG#L112, UG#L149); every metric name (`V/vllm/v1/metrics/loggers.py#L312-L315`, `#L622-L645`, `offloading/metrics.py#L22-L37`, `V/vllm/v1/kv_offload/cpu/common.py#L10`, `V/vllm/v1/kv_offload/cpu/spec.py#L52-L59`, `V/vllm/v1/kv_offload/tiering/base.py#L38-L63`); `Available KV cache memory` log (`V/vllm/v1/worker/gpu_worker.py#L692-L695`); `/dev/shm` region on CUDA only and the "Insufficient space" message (`cpu/spec.py#L162-L165`, `shm_broadcast.py#L244-L253`, called from `shared_offload_region.py#L137-L140`); fs/obj/p2p/kvcr table cells (UG#L153-L273, `fs/manager.py#L76-L120`, `kvcr/manager.py#L1-L34`); no `kvcr` anywhere under `docs/` (grep); `offload_prompt_only` default true (`V/vllm/v1/kv_offload/base.py#L607-L608`); `kvaware` routing queries the LMCache controller (production-stack lookup code). Cross-file: KV offload model, prefix-hash seed and paged-KV naming match the Cross-file facts block.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| K1 | "the diagram shows the ones that store or move KV for reuse" | KVOffloadingLMCache.tsx:475 | OVERREACH | `V/vllm/distributed/kv_transfer/kv_connector/factory.py#L153-L248`: MooncakeStoreConnector, FlexKVConnectorV1, HF3FSKVConnector also store KV and are not drawn | "the diagram shows the seven this section discusses" |
| K2 | `/dev/shm` region unlinked once every worker maps it | :497-505 | UNSUPPORTED (cited lines are the class docstring, a comment) | code at `V/vllm/v1/kv_offload/cpu/shared_offload_region.py#L183-L202` (unlink after barrier); barrier passed at `cpu/spec.py#L179-L186` | Re-cited to L183-L202 |
| K3 | Per-request controls "are all marked experimental" | :702-703 | WRONG | UG#L46-L52 and `offloading/scheduler.py#L390`, `#L404` mark only `max_load_tokens` and `max_offload_tokens`; `kv_load_tiers` (`scheduler.py#L64`, `#L550`) carries no marker | "both caps are marked experimental" |
| K4 | MultiConnector example: "an LMCache tier and a NIXL transfer path" | :827-832 | UNSUPPORTED | `V/docs/features/disagg_prefill.md#L32-L35`: the example is NixlConnector plus ExampleConnector (shared storage), no LMCache | "runs an ordered list of connectors on one engine, for example a NIXL transfer path next to a storage connector" |
| K5 | "Dynamo's vLLM worker turns on vLLM's KV event publishing" | :1029-1037 | WRONG (also contradicts NvidiaDynamo.tsx "KV events: off until you enable them") | https://github.com/ai-dynamo/dynamo/blob/v1.5.1/components/src/dynamo/vllm/args.py#L465-L484: returns the user's `--kv-events-config` or None; warns when `enable_kv_cache_events` is false | Reworded: router reads the events; worker publishes only with a user `--kv-events-config` that enables them; cite moved to L465-L484 |
| K6 | production-stack `kvaware` asks the LMCache controller | :1042 | UNSUPPORTED (cited L282-L299 is the class docstring and constructor) | https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/routers/routing_logic.py#L413-L415 (`LookupMsg` sent to the controller manager) | Re-cited to L413-L415 |
| K7 | "Capacity moves, it does not vanish." | :997 | Prose (negative-definition tic) | CLAUDE.md Writing Style, Section Shape rule 4 | "Capacity moves down a tier." |
| K8 | "Reuse at any position needs LMCache's CacheBlend" | :168 | OVERREACH (universal "needs"; only LMCache's README was read) | LMCache README v0.5.6 L75 | "LMCache's CacheBlend reuses a chunk at any position and recomputes some tokens." |
| K9 | HiSparse hot-buffer default | :884-890 | UNSUPPORTED by authority (docstring only) | code `V/vllm/v1/hisparse/runtime.py#L116-L124`: `(max_query_len + 1) * model_top_k` | Added the runtime.py cite |
| K10 | "Offloading helps when / hurts when" columns | :945-968 | Section Shape: fails both tests | The first three bullets of each column restate the inequality paragraph above them; the rest restate the use-case table, the back-pressure paragraph and the Consistency note | Moved into an ExpandableSection "Checklist: when offloading helps and when it hurts", content unchanged |

Silicon-memory-inference boundary: no duplicated hardware-tier explanation found (no HBM, PCIe or
flash figures, no bandwidth arithmetic). The existing cross-link in the intro Alert stays.

Score: **8/10.** Facts now match the pin and every quantitative claim carries a pinned citation; the
diagram passes the harness with 0 overlaps at 1440 and 390. Held from 9 by length (about 1.8x the
pre-revamp page) and the HiSparse h2, which serves only DSA models and sits between the LMCache
block and the payoff sections.

## Quantization.tsx

Claims checked: 78. CONFIRMED: 66. WRONG: 4. UNSUPPORTED: 5. OVERREACH: 3. Plus two prose fixes and
one diagram-title consistency edit.

CONFIRMED (summary): the hardware matrix, every cell of the seven reproduced rows, the SM mapping,
the Turing Marlin MXFP4 caveat, the omitted Intel/CPU columns and DeepSpeedFP row (no code, no
method name: grep and `Q/__init__.py#L15-L49`) (`V/docs/features/quantization/README.md#L67-L83`);
GGUF is the only row supported on every listed NVIDIA generation and on AMD; AWQ aliases
(`Q/__init__.py#L156-L159`); GPTQ `desc_act` rejection and the `group_size=-1` no-op
(`Q/utils/gptq_utils.py#L23-L50`); FP8 compute needs CC 8.9 and Turing/Ampere fall back to W8A16
Marlin (`V/docs/features/quantization/llm_compressor/fp8.md#L4-L17`); minimum capability 75 and
the startup message (`Q/fp8.py#L145-L147`, `Q/online/base.py#L197-L200`, `V/vllm/config/vllm.py#L925-L931`);
the FP8 block kernel priority list (`V/vllm/model_executor/kernels/linear/__init__.py#L455-L467`)
and DeepGEMM Hopper/Blackwell only (`scaled_mm/deep_gemm.py#L47-L52`); the online shorthand table
and every row of the online table, including `fp8_per_channel` rejecting Marlin and
`nvfp4_per_token` SM100 only (`V/vllm/config/quantization.py#L110-L219`, `Q/online/fp8.py#L201-L209`,
`#L383-L391`, `Q/online/nvfp4.py#L95-L97`, `V/docs/features/quantization/online.md#L49-L54`);
online on top of a prequantized checkpoint (`V/vllm/model_executor/model_loader/weight_utils.py#L211-L221`,
online.md L102-L115); `fp8` redirect warning (`weight_utils.py#L342-L349`); checkpoint config read
(`weight_utils.py#L223-L231`); KV cache dtype list and skip layers (`V/vllm/config/cache.py#L39-L58`,
`#L167-L169`); KV scales 1.0 or calibrated, calibration recommended (quantized_kvcache.md L25-L33);
bitsandbytes and GGUF plugin docs and their `vllm.general_plugins` entry points
(https://github.com/vllm-project/vllm-bnb-plugin/blob/v0.0.3/vllm_bnb_plugin/__init__.py#L59-L68,
https://github.com/vllm-project/vllm-gguf-plugin/blob/v0.0.5/vllm_gguf_plugin/plugin.py#L109-L117,
both pyproject.toml files); `register_quantization_config` (`Q/__init__.py#L61-L109`); all six
release rows (#39612 v0.24.0, #43529 and #49389 v0.28.0, #54809 v0.30.0, #53585 and #58001 v0.31.0)
and their symptoms (`V/vllm/config/model.py#L1418-L1438`, no `calculate_kv_scales` argument left in
the tree, `kernels/linear/__init__.py#L500-L509`); FP8 docs 2x / 1.6x figure, labelled as a project
claim (fp8.md L6); the silicon-memory-inference cross-references (section 25 "Quantization and
Precision", section 13 "NVIDIA Blackwell - B200 / B300", from that dive's App.tsx).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| Q1 | AWQ "Dequantizes to FP16 for the matmul" | Quantization.tsx:44 | WRONG | `Q/auto_awq.py#L229-L230`: supported activation dtypes are half and bfloat16 | "Dequantizes to FP16 or BF16", cited |
| Q2a | GPTQ "with the widest checkpoint ecosystem on the Hub" | :60 | UNSUPPORTED | No source opened carries it | Removed |
| Q2b | "GPTQModel is the maintained successor to AutoGPTQ" | :61 | UNSUPPORTED | `V/docs/features/quantization/gptqmodel.md#L3` says only that GPTQModel creates 4-bit or 8-bit GPTQ models | "GPTQModel produces new 4-bit or 8-bit GPTQ checkpoints", cited |
| Q3 | "Marlin repacks the weights at load time" | :78-82 | UNSUPPORTED (the docs matrix row does not say it) | `V/vllm/model_executor/kernels/linear/mixed_precision/marlin.py#L74-L110` (`gptq_marlin_repack` in `process_weights_after_loading`) | Code cite added; docs cite kept for the dispatch claim |
| Q4a | FP8 "The default 8-bit serving path on Ada and Hopper" | :100 | OVERREACH (vLLM has no default quantization) | fp8.md L4 | "The 8-bit path with native FP8 compute on Ada, Hopper and Blackwell", cited |
| Q4b | FP8 weight and activation scale options cited to `fp8.py#L89` | :100-104 | UNSUPPORTED (L89 is only the activation-scheme list) | `Q/fp8.py#L89-L100` (activation schemes, `weight_block_size`); per-channel at `V/vllm/config/quantization.py#L197-L201` (already cited next) | Cite widened to L89-L100 |
| Q5 | "treat Blackwell support as additive to the Hopper column" | :825-827 | WRONG | `V/docs/features/quantization/llm_compressor/int8_w8a8.md#L11-L12`: INT8 is not supported on CC 10.0 or newer | Replaced: grid has no Blackwell column; Blackwell runs NVFP4/MXFP4/MXFP8 and FP8 W8A8; INT8 W8A8 does not run on CC 10.0+, cited |
| Q6 | Decision diagram title "Blackwell adds NVFP4, MXFP4 and MXFP8" | :529 | Consistency with Q5 (implies a superset of Hopper) | as Q5 | "Blackwell runs ..."; harness re-run, 0 overlaps, PNGs read |
| Q7 | Alert: FP8 fallback "with correct output", cited to `fp8.py#L247-L250` | :833-836 | UNSUPPORTED (code comment; "correct output" in no source) | fp8.md L5, L17 | Re-cited to the FP8 docs; "with correct output" removed |
| Q8 | `--kv-cache-dtype auto` "keeps the model's dtype" | :972 | WRONG at code (docs agree with the page: doc-code conflict) | `V/vllm/utils/torch_utils.py#L448-L521` and `V/vllm/engine/arg_utils.py#L2199-L2212`: `auto` adopts a ModelOpt checkpoint's KV cache scheme (fp8 or nvfp4); docs quantized_kvcache.md L39 say model dtype | Added the ModelOpt exception with a doc-code-conflict cite |
| Q9a | Prequantized checkpoints "carry scales chosen offline against calibration data, so they win on accuracy" | :989-990 | OVERREACH | fp8.md L79-L84: the FP8_DYNAMIC recipe uses no calibration data; no source states a general accuracy win | Narrowed to "against a calibration dataset when the recipe uses one ... FP8_DYNAMIC needs none", cited; advice reworded to "a calibrated prequantized checkpoint" |
| Q9b | Expandable: "Tools like llm-compressor and AutoAWQ run a calibration pass"; prequantized gives "the best accuracy the format allows" | :997-1012 | OVERREACH | as Q9a | "Calibrated recipes in llm-compressor and AutoAWQ ..."; "scales tuned against data" |
| Q10 | Upgrade h2 "Seven quantization changes between v0.24 and v0.31"; row label "Deprecated at v0.31.0" | :1046, :451-453 | WRONG | `fbgemm_fp8` and `fp_quant` are already in `DEPRECATED_QUANTIZATION_METHODS` at https://github.com/vllm-project/vllm/blob/15652a6b703f059767d75e5a511c4a5accf969ad/vllm/model_executor/layers/quantization/__init__.py#L48-L51 (2026-06-07), with the same startup error in that tree's `vllm/config/model.py` L1083-L1096; no v0.23.0 to v0.31.0 release note mentions them | h2 now "Six quantization changes between v0.24 and v0.31, and one older deprecation"; row label "Deprecated by June 2026 ... and still at v0.31.0" with both cites; footnote names the source tree |
| Q11a | "the docs note latency improvements are limited" | :905-906 | Prose (attribution in the sentence, not load-bearing) | Section Shape attribution rule | "with limited latency improvement in this mode", cite unchanged |
| Q11b | "The docs table still lists bitsandbytes and GGUF" | :819 | Prose (history voice) | Section Shape rule 1 | "still" removed |

Score: **8/10.** The upgrade table, hardware matrix and online-scheme table are exact at the pin and
every number is cited; the page ends on the reader's next action and lands the 1.6x figure twice.
Held from 9 by mild overlap between the "Start with hardware" column and the matrix it summarises.

## Checks

- `pnpm --filter @tech-deep-dives/vllm typecheck`: exit 0 (`tsc --noEmit`, no output).
- `pnpm --filter @tech-deep-dives/vllm lint`: exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no output).
- `scripts/gates/no-ai-tells.sh`, `pinned-refs.sh`, `svg-a11y.sh`, `pre-overflow.sh`: exit 0.
- Harness: `vite build` exit 0; `vllm-shoot.mjs --sections quant,offload`: "diagrams measured: 4 (both widths); with overlaps/clipping: 0; console errors: 0". PNGs read at 1440 and 390.

## For the orchestrator

- sources.md is generated from every citation: regenerate it. New citation targets: `Q/auto_awq.py#L229-L230`, gptqmodel docs page, `mixed_precision/marlin.py#L74-L110`, int8_w8a8 docs page, `torch_utils.py#L448-L521`, `arg_utils.py#L2199-L2212`, the 15652a6b `__init__.py#L48-L51` permalink, `hisparse/runtime.py#L116-L124`, Dynamo `args.py#L465-L484`, production-stack `routing_logic.py#L413-L415`, `shared_offload_region.py#L183-L202`.
- Register 04 row KO-N4 says all three per-request keys are experimental; code and docs mark only the two token caps.
