# SGLang deep dive: sources

Generated from the inline citations in `src/` by `revamp/tools/gen-sources.mjs`. Do not edit by hand;
change the citation in the section and regenerate.

Code citations are pinned to SGLang `v0.5.22` (commit `baa9befa381511cd4d56f83980951e5a45fffc6d`). Code links below are listed per file;
the sections link to exact line ranges. Tiers follow CLAUDE.md "Fact-Checking & Sources Standard".

## Tier 1: source code at a pinned ref, official documentation, API reference, release notes

88 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [SGLang documentation (rendered, tracks the default branch)](https://docs.sglang.io/) | 2026-10-24 | Sources appendix |
| [sgl-project/sglang @ v0.4.3: python/sglang/srt/server_args.py](https://github.com/sgl-project/sglang/blob/v0.4.3/python/sglang/srt/server_args.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.4.4: python/sglang/srt/server_args.py](https://github.com/sgl-project/sglang/blob/v0.4.4/python/sglang/srt/server_args.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: docs/docs.json](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs.json) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: docs/docs/advanced_features/hyperparameter_tuning.mdx](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/advanced_features/hyperparameter_tuning.mdx) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: docs/docs/advanced_features/radix_eviction_policy.mdx](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/advanced_features/radix_eviction_policy.mdx) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: docs/docs/advanced_features/server_arguments.mdx](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/advanced_features/server_arguments.mdx) | 2026-10-24 | RadixCache, RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: docs/docs/get-started/quickstart.mdx](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/get-started/quickstart.mdx) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: docs/docs/references/frontend/choices_methods.mdx](https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/references/frontend/choices_methods.mdx) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/api.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/api.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/backend/base_backend.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/backend/base_backend.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/backend/openai.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/backend/openai.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/backend/runtime_endpoint.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/backend/runtime_endpoint.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/choices.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/choices.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/lang/interpreter.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/lang/interpreter.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/launch_server.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/launch_server.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/choices.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/choices.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/device.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/device.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/memory.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/memory.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/observability.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/observability.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/parallel.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/parallel.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/schedule.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/schedule.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields/serving.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/fields/serving.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/memory_hook.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/memory_hook.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/model_override_base.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/model_override_base.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/model_overrides/qwen3_vl.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/model_overrides/qwen3_vl.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/overrides.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/overrides.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/serving_hook.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/serving_hook.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/speculative_hook.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/speculative_hook.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/validation_hook.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/arg_groups/validation_hook.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/distributed/bootstrap.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/distributed/bootstrap.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/entrypoints/engine.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/entrypoints/engine.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/entrypoints/http_server.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/entrypoints/http_server.py) | 2026-10-24 | RadixCache, RuntimeProcesses, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/environ.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/environ.py) | 2026-10-24 | RadixCache, RuntimeProcesses, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/layers/radix_attention.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/layers/radix_attention.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/data_parallel_controller.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/data_parallel_controller.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/detokenizer_manager.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/detokenizer_manager.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/load_snapshot.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/load_snapshot.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/multi_tokenizer_mixin.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/multi_tokenizer_mixin.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/overlap_utils.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/overlap_utils.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/schedule_batch.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/schedule_batch.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/schedule_policy.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/schedule_policy.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/batch_result_processor.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/batch_result_processor.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/idle_sleeper.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/idle_sleeper.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/ipc_channels.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/ipc_channels.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/metrics_reporter.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/metrics_reporter.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/pool_stats_observer.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/pool_stats_observer.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler_components/request_receiver.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler_components/request_receiver.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/scheduler.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/scheduler.py) | 2026-10-24 | RuntimeProcesses, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/managers/tp_worker.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/managers/tp_worker.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/allocation.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/allocation.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/allocator/base.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/allocator/base.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/common.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/common.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/evict_policy.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/evict_policy.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/memory_pool.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/memory_pool.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/prefill_budget.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/prefill_budget.py) | 2026-10-24 | Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/radix_cache.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/radix_cache.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/registry.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/registry.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/unified_cache/components/full.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/unified_cache/components/full.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/unified_radix_cache.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/unified_radix_cache.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/mem_cache/utils.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/mem_cache/utils.py) | 2026-10-24 | RadixCache |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/observability/metrics_collector.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/observability/metrics_collector.py) | 2026-10-24 | RadixCache, Scheduler |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/runtime_context.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/runtime_context.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/rust_server/config.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/rust_server/config.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/rust_server/server.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/rust_server/server.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/server_args.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/server_args.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/utils/common.py](https://github.com/sgl-project/sglang/blob/v0.5.22/python/sglang/srt/utils/common.py) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: README.md](https://github.com/sgl-project/sglang/blob/v0.5.22/README.md) | 2026-10-24 | Sources appendix |
| [sgl-project/sglang @ v0.5.22: rust/sglang-server/src/api_server/http/app.rs](https://github.com/sgl-project/sglang/blob/v0.5.22/rust/sglang-server/src/api_server/http/app.rs) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: rust/sglang-server/src/api_server/http/info.rs](https://github.com/sgl-project/sglang/blob/v0.5.22/rust/sglang-server/src/api_server/http/info.rs) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: rust/sglang-server/src/api_server/http/native_api.rs](https://github.com/sgl-project/sglang/blob/v0.5.22/rust/sglang-server/src/api_server/http/native_api.rs) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: rust/sglang-server/src/api_server/http/openai.rs](https://github.com/sgl-project/sglang/blob/v0.5.22/rust/sglang-server/src/api_server/http/openai.rs) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: rust/sglang-server/src/lib.rs](https://github.com/sgl-project/sglang/blob/v0.5.22/rust/sglang-server/src/lib.rs) | 2026-10-24 | RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: test/README.md](https://github.com/sgl-project/sglang/blob/v0.5.22/test/README.md) | 2026-10-24 | RadixCache |
| [commit history of python/sglang/lang at v0.5.22](https://github.com/sgl-project/sglang/commits/v0.5.22/python/sglang/lang) | 2026-10-24 | RadixCache |
| [SGLang v0.5.22 release notes](https://github.com/sgl-project/sglang/releases/tag/v0.5.22) | 2026-10-24 | RuntimeProcesses, Sources appendix |
| [SGLang repository at the v0.5.22 tag](https://github.com/sgl-project/sglang/tree/v0.5.22) | 2026-10-24 | Sources appendix |
| [sgl-project/sglang @ v0.5.22: docs/docs](https://github.com/sgl-project/sglang/tree/v0.5.22/docs/docs) | 2026-10-24 | Sources appendix |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt](https://github.com/sgl-project/sglang/tree/v0.5.22/python/sglang/srt) | 2026-10-24 | InsideCodebase |
| [sgl-project/sglang @ v0.5.22: python/sglang/srt/arg_groups/fields](https://github.com/sgl-project/sglang/tree/v0.5.22/python/sglang/srt/arg_groups/fields) | 2026-10-24 | Sources appendix |
| [sgl-project/sglang @ v0.5.22: rust](https://github.com/sgl-project/sglang/tree/v0.5.22/rust) | 2026-10-24 | InsideCodebase, RuntimeProcesses |
| [sgl-project/sglang @ v0.5.22: sgl-model-gateway](https://github.com/sgl-project/sglang/tree/v0.5.22/sgl-model-gateway) | 2026-10-24 | InsideCodebase, Sources appendix |
| [vllm-project/vllm @ v0.31.0: vllm/config/cache.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py) | 2026-10-24 | RadixCache |
| [vllm-project/vllm @ v0.31.0: vllm/config/parallel.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py) | 2026-10-24 | RuntimeProcesses |
| [vllm-project/vllm @ v0.31.0: vllm/envs.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/envs.py) | 2026-10-24 | RuntimeProcesses |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/block_pool.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/block_pool.py) | 2026-10-24 | RadixCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/kv_cache_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/kv_cache_utils.py) | 2026-10-24 | RadixCache |

## Tier 2: vendor and project blogs, talks, product pages (vendor figures are vendor claims)

1 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [LMSYS blog, 2024-01-17 (project claim)](https://lmsys.org/blog/2024-01-17-sglang/) | 2026-10-24 | RadixCache |

## Tier 3: third-party analysis, papers, press

2 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [arXiv 2312.07104v2](https://arxiv.org/abs/2312.07104v2) | 2026-10-24 | RadixCache |
| [arXiv 2312.07104v2, section 3](https://arxiv.org/html/2312.07104v2) | 2026-10-24 | RadixCache |
