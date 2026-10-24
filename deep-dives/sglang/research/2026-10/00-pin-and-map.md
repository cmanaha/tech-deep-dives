# 00 - Pin and code map (SGLang v0.5.22)

Research date: 2026-10-24 (accessed date on every citation in this dive).

## Pin

| Item | Value | Evidence |
| --- | --- | --- |
| Latest stable release | `v0.5.22`, published 2026-10-19T02:55:19Z, not a prerelease | `gh api repos/sgl-project/sglang/releases/latest` returned `v0.5.22 2026-10-19T02:55:19Z` |
| Tag object | `35ce313293052f8362e0829e7512bc9bc3d336c9` (annotated tag, tagged 2026-10-15T23:39:11Z) | `gh api repos/sgl-project/sglang/git/ref/tags/v0.5.22` |
| Commit the tag points at | `baa9befa381511cd4d56f83980951e5a45fffc6d` (committed 2026-10-14T06:26:00Z on `release/v0.5.22`) | `gh api repos/sgl-project/sglang/git/tags/35ce3132...` and `.../commits/baa9befa...` |
| Previous releases | v0.5.21 (2026-10-02), v0.5.20 (2026-09-18), v0.5.19 (2026-09-05): a two-week cadence | `gh api repos/sgl-project/sglang/releases` |
| Gateway releases | Separate `gateway-vX` tags stopped at `gateway-v0.3.1` (2026-01-09). In-tree `sgl-model-gateway/Cargo.toml` says `version = "0.3.2"` at v0.5.22. The README ecosystem table points to `github.com/smg-project/smg` for SMG. | releases list; `sgl-model-gateway/Cargo.toml:7`; `README.md` ecosystem table |
| Python requirement | `requires-python = ">=3.11"` | `python/pyproject.toml:16`; release notes "SGLang now requires Python 3.11 or newer" |
| Install line in the release notes | `uv pip install --prerelease=allow sglang==0.5.22`; Docker `lmsysorg/sglang:v0.5.22` (CUDA 13), `-rocm10-mi35x`, `-rocm10-mi30x`, `-xpu`, `-xeon` | `/tmp/sglang-release-notes/v0.5.22.md` "To upgrade" |

Source tree at the tag: `/tmp/sglang-src` (from `gh api repos/sgl-project/sglang/tarball/v0.5.22`, not committed).
Release notes v0.5.16 to v0.5.22: `/tmp/sglang-release-notes/<tag>.md` (from `gh api .../releases/tags/<tag>`).

URL forms for citations:

- Code: `https://github.com/sgl-project/sglang/blob/v0.5.22/<path>#L<a>-L<b>` (tag-pinned).
  Directory: `https://github.com/sgl-project/sglang/tree/v0.5.22/<dir>`.
- Docs source at the tag: `https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/<section>/<page>.mdx`.
- Rendered docs: `https://docs.sglang.io/docs/<section>/<page>` (HTTP 200 checked for
  `advanced_features/hicache`, `advanced_features/pd_disaggregation`, `basic_usage/aws_sagemaker`).
  The rendered site is unversioned (it tracks the default branch), so a version-specific claim cites the
  tag-pinned `.mdx` source; the rendered page is a convenience link for the reader.

## Repo scale at v0.5.22

| Area | Size |
| --- | --- |
| `python/sglang/srt` (the runtime, "SGLang Runtime") | 2,028 `.py` files, 880,863 lines |
| `python/sglang/srt/models` | 247 model files |
| `python/sglang/multimodal_gen` (SGLang Diffusion) | 446,284 lines |
| `python/sglang/kernels` (in-tree kernel library: `aot`, `jit`, `ops`, `cake_kernels`, `kda_kernels`) | 1,477 files |
| `sgl-model-gateway/src` (Rust gateway) | 172 `.rs` files, 63,379 lines |
| `rust/` (Rust server crates: `sglang-server`, `sglang-grpc`, `sglang-processor`, `sglang-radix-tree`, ...) | 108,848 lines |
| `experimental/sgl-router` | slim KV-aware Rust router, "Serves a single model and routes across its workers" (README) |

## Code map (paths relative to `python/sglang/srt/` unless noted)

### Entrypoints and process layout

| File | Lines | What it is |
| --- | --- | --- |
| `entrypoints/http_server.py` | 2,961 | FastAPI server (`launch_server`), OpenAI, native `/generate`, admin routes |
| `entrypoints/engine.py` | 2,066 | `Engine`: in-process API, launches the scheduler/detokenizer subprocesses |
| `entrypoints/grpc_server.py`, `grpc_bridge.py` | | gRPC frontend (used by the Rust gateway's gRPC mode) |
| `entrypoints/openai/` | 37 files | OpenAI-compatible serving (chat, completions, embeddings, responses) |
| `entrypoints/anthropic/`, `entrypoints/ollama/` | | Anthropic Messages API and Ollama API compatibility |
| `managers/tokenizer_manager.py` | 4,102 | `TokenizerManager`: tokenizes, sends to scheduler over ZMQ, streams results |
| `managers/scheduler.py` | 6,171 | `Scheduler`; `event_loop_normal` (L1940), `event_loop_overlap` (L1975) |
| `managers/scheduler_pp_mixin.py` | | `event_loop_pp` (L101) and PP disaggregation loops |
| `managers/detokenizer_manager.py` | 563 | `DetokenizerManager` process |
| `managers/data_parallel_controller.py` | 936 | `DataParallelController`, `LoadBalanceMethod` for DP replicas |
| `managers/tp_worker.py` | 753 | `TpModelWorker` |
| `managers/overlap_utils.py` | 663 | `FutureMap` and overlap relay structures |
| `managers/scheduler_components/` | 24 files | split-out scheduler pieces (`batch_result_processor.py` 1,656 lines, `dp_attn.py`, `output_streamer.py`, `metrics_reporter.py`, `kv_events_publisher.py`, ...) |
| `managers/schedule_policy.py` | 1,680 | `CacheAwarePolicy`, `CacheAgnosticPolicy`, `SchedulePolicy`, `PrefillAdder` |
| `managers/schedule_batch.py` | 3,971 | `Req`, `ScheduleBatch`, finish reasons |
| `server_args.py` | 893 | `ServerArgs`, `PortArgs`; field definitions moved to `arg_groups/fields/*.py` (device, disagg, exec_, lora, memory, mm, model, observability, parallel, schedule, serving, spec) with resolution hooks in `arg_groups/*_hook.py` |
| `rust_server/`, `rust/sglang-server` (repo root) | | opt-in Rust HTTP frontend / tokenizer manager |

### Model execution

| File | Lines | What it is |
| --- | --- | --- |
| `model_executor/model_runner.py` | 2,553 | `ModelRunner` |
| `model_executor/forward_batch_info.py` | 2,294 | `ForwardMode`, `ForwardBatch` |
| `model_executor/runner*/`, `cuda_graph_config.py` | | CUDA graph runners (decode graphs, "breakable" prefill graphs) |
| `batch_overlap/` | 4 files | two-batch overlap (TBO) and related micro-batch overlap |
| `layers/radix_attention.py` | 824 | `RadixAttention` layer: the attention module every model calls |

### RadixAttention, KV memory, hierarchical cache

| File | Lines | What it is |
| --- | --- | --- |
| `mem_cache/radix_cache.py` | 832 | `RadixKey`, `TreeNode`, `RadixCache` |
| `mem_cache/unified_radix_cache.py` | 3,834 | `UnifiedRadixCache` (full, hybrid SWA, Mamba; also the disabled mode that replaced `ChunkCache` in v0.5.22) |
| `mem_cache/pure_swa_radix_cache.py` | | pure sliding-window models |
| `mem_cache/base_prefix_cache.py` | 707 | prefix-cache interface |
| `mem_cache/evict_policy.py` | 100 | `LRUStrategy`, `LFUStrategy`, `FIFOStrategy`, ... |
| `mem_cache/memory_pool.py` | 6,188 | `ReqToTokenPool`, token-to-KV pools (MHA, MLA, SWA, Mamba hybrids) |
| `mem_cache/allocator/` | | `TokenToKVPoolAllocator` (page size 1), `PagedTokenToKVPoolAllocator`, SWA and hybrid allocators |
| `managers/cache_controller.py` | 1,422 | HiCache controller: device to host to storage moves |
| `mem_cache/memory_pool_host.py`, `host_memory.py` | | host (CPU) KV pools |
| `mem_cache/hicache_storage.py`, `mem_cache/storage/` | | L3 storage backends: `aibrix_kvcache`, `eic`, `file`, `flexkv`, `hf3fs`, `lmcache`, `mmap`, `mooncake_store`, `nixl`, `npu_memcache`, `seaweedfs`, `shm`, `simm`, `tensorcast_store`, `umbp` |
| `mem_cache/sparsity/`, `hisparse_memory_pool.py`, `managers/hisparse_coordinator.py` | | HiSparse: sparse attention with KV in CPU memory |

### Attention backends (`layers/attention/`)

Registry `attention_registry.py` (579 lines). Backends include `flashinfer_backend.py` (2,582),
`flashattention_backend.py` (3,537), `triton_backend.py` (2,658), `trtllm_mha_backend.py` (1,964),
`trtllm_mla_backend.py`, `flashinfer_mla_backend.py`, `flashmla_backend.py` (681), `cutedsl_mla_backend.py`,
`aiter_backend.py` (AMD), `torch_native_backend.py`, `torch_flex_backend.py`, `intel_amx_backend.py`,
`xpu_backend.py`, `wave_backend.py`, `dsa_backend.py` / `nsa/` (DeepSeek sparse attention), `hybrid_attn_backend.py`,
`hybrid_linear_attn_backend.py`, `tbo_backend.py`. Docs: `docs/docs/advanced_features/attention_backend.mdx`.

### Structured output (`constrained/`)

`grammar_manager.py` (330), `xgrammar_backend.py` (459), `llguidance_backend.py` (325), `outlines_backend.py` (198),
`outlines_jump_forward.py`, `reasoner_grammar_backend.py`. Docs: `structured_outputs.mdx`,
`structured_outputs_for_reasoning_models.mdx`.

### Speculative decoding (`speculative/`)

EAGLE family (`eagle_worker_v2.py` 1,922, multi-layer EAGLE), n-gram (`ngram_worker.py` 581, `cpp_ngram/`),
DFlash (`dflash_worker_v2.py` 2,942), DSpark (`dspark_components/`), frozen-KV MTP, adaptive speculation
(`adaptive_spec_params.py`), PD-aware draft paths (`eagle_disaggregation.py`, `dflash_disaggregation.py`).
Docs: `speculative_decoding.mdx`, `adaptive_speculative_decoding.mdx`. Draft training: SpecForge (separate repo).

### Parallelism, MoE, expert parallelism

`distributed/parallel_state.py` (3,554), `layers/dp_attention.py` (1,266, DP attention), `layers/cp`, `layers/dcp`
(context parallel, decode context parallel), `layers/moe/` (fused MoE Triton, CUTLASS, FlashInfer, DeepEP),
`layers/moe/token_dispatcher/` (`deepep.py` 1,135, `deepep_v2.py`, `mooncake.py`, `moriep.py`, `nixl.py`, `pplx.py`,
`standard.py`, `flashinfer.py`), `eplb/` (expert-parallel load balancer: `eplb_manager.py`, `expert_location.py`),
`elastic_ep/`. Docs: `expert_parallelism.mdx`, `pipeline_parallelism.mdx`, `dp_dpa_smg_guide.mdx`, `dcp.mdx`,
`prefill_cp.mdx`. v0.5.22 breaking change: `--enable-dp-attention` deprecated in favour of `--attn-dp-size N`;
`--dp-size` counts model replicas only.

### PD disaggregation and KV transfer (`disaggregation/`)

`prefill.py` (1,734; `PrefillBootstrapQueue`, prefill event loops L662/L729), `decode.py` (3,354;
`DecodePreallocQueue`, decode loops L3018/L3060), `base/conn.py` (310; `KVArgs`, transfer interfaces),
`mooncake/conn.py` (3,426), `nixl/conn.py` (3,632), `mori/`, `ascend/`, `fake/`, `encoder/` (EPD: encoder
disaggregation), `role_switch.py`. EFA: `mooncake/utils.py` `_validate_efa_allocator_compatibility` (L40) rejects
CUDA VMM allocators when `MOONCAKE_PROTOCOL=efa`; docs `pd_disaggregation.mdx` L112-L132 "AWS EFA" install block
(`mooncake-transfer-engine-efa-cuda13==0.3.13.post1`, `MOONCAKE_PROTOCOL=efa`, x86_64 only).
Docs: `pd_disaggregation.mdx`, `epd_disaggregation.mdx`.

### Router and gateway

- `sgl-model-gateway/` (repo root, Rust, v0.3.2 in Cargo.toml): policies `cache_aware.rs`, `power_of_two.rs`,
  `consistent_hashing.rs`, `prefix_hash.rs`, `bucket.rs`, `round_robin.rs`, `random.rs`, `manual.rs`, `tree.rs`;
  routers `http`, `grpc`, `openai`, `mesh`; `service_discovery.rs` (Kubernetes). Docs `sgl_model_gateway.mdx`.
- `experimental/sgl-router/` (Rust): slim KV-aware router with `sgl-kv-indexer`, peer snapshot bootstrap, EndpointSlice
  discovery (v0.5.22 "Rust Server" notes).
- External: `github.com/smg-project/smg` listed as SMG in the README ecosystem table (to verify: relation to in-tree gateway).

### Frontend language and APIs

`python/sglang/lang/` (`api.py`, `interpreter.py`, `ir.py`, `tracer.py`, `backend/` with `runtime_endpoint.py`,
`openai.py`, `anthropic.py`, `litellm.py`, `vertexai.py`). Docs `docs/docs/references/frontend/*.mdx`.
Native API docs `basic_usage/native_api.mdx`, offline engine `offline_engine_api.mdx`, sampling params
`sampling_params.mdx`, OpenAI/Anthropic/Ollama compatibility pages.

### Hardware backends

`platforms/` (`cuda.py`, `rocm.py`, `npu.py`, `xpu.py`, `cpu.py`, `mps.py`, `musa.py`), `hardware_backend/`
(`cpu`, `gpu`, `mlx`, `mps`, `musa`, `npu`, `xpu`). Docs `hardware-platforms/` (amd_gpu, apple_metal,
ascend-npus, cpu_server, mthreads_gpu, nvidia_jetson, nvidia-gpus, tpu, xpu, plugin). README lists "Integrations in
progress: AWS Trainium, ..." (README.md L58). `grep -rliE "trainium|neuronx|inferentia"` over `.py/.md/.mdx/.rs/.toml`
in `/tmp/sglang-src` finds only `README.md` and one unrelated diffusion prompt file.

### AWS touchpoints in the tree

- `docs/docs/basic_usage/aws_sagemaker.mdx`, `examples/sagemaker/deploy_and_serve_endpoint.py`,
  `test/manual/test_sagemaker_server.py`; SageMaker routes in `entrypoints/http_server.py` (to verify).
- EFA: Mooncake EFA path (above); `docker/Dockerfile`, `docker/Dockerfile.cu134` mention EFA (to verify what they install).
- Kubernetes: `docs/docs/references/multi_node_deployment/` (`deploy_on_k8s.mdx`, `lws_pd/`, `rbg_pd/`),
  `advanced_features/llm-d.mdx`.

## Release-note digest relevant to the dive (v0.5.22, Tier 1 release notes; vendor claims stay claims)

- Highlights include "PD disaggregation gets up to 27% more throughput and half the p95 TTFT on long-prompt
  workloads (#40703)" and "Models load 10x faster with the new InstantTensor loader (#40453)": project claims.
- Breaking: Python 3.11+; `--enable-dp-attention` deprecated, `--attn-dp-size N`; `ChunkCache` removed
  (`--disable-radix-cache` runs `UnifiedRadixCache` in disabled mode); `tc_piecewise` prefill CUDA graph
  backend removed, `breakable` is the CUDA default; `--disaggregation-decode-host-receive-threshold` encoding flipped.
- New platform: Apple Silicon with the standard PyTorch backend alongside MLX (#36780).

## Questions handed to the research registers

1. Overlap scheduler: is `event_loop_overlap` the default, and what disables it (`--disable-overlap-schedule`)?
2. Radix cache: page size default, eviction policy default, interaction with `--disable-radix-cache`.
3. Default attention backend selection per GPU generation and model type.
4. Default grammar backend and how a request selects structured output.
5. Which speculative algorithms are user-facing at v0.5.22 and their flags.
6. DP attention semantics after the `--attn-dp-size` change; EP and EPLB flags; PD transfer backends and defaults.
7. Gateway: what ships in-tree versus `smg-project/smg`, and which one the docs tell users to install.
8. Frontend language: is it still maintained and documented at v0.5.22.
9. AWS: SageMaker integration specifics; EFA path for PD; EKS guidance; Trainium status.

## Errata from the scope review (2026-10-24)

- The code-map label "L3 storage backends" for the 15 `mem_cache/storage/` directories is too broad: the registered L3 backends are the 13 names plus `dynamic` in `storage/backend_factory.py:204-276` (register 02 E12); LMCache and FlexKV are alternative tree caches.
- README positioning row: `README.md:21` at v0.5.22 reads "optimized for agentic workloads, large-scale serving, and RL rollouts" (Tier 1, https://github.com/sgl-project/sglang/blob/v0.5.22/README.md#L21).
