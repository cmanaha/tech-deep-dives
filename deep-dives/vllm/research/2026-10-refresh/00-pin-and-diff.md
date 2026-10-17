# 00 - Pin and diff: vLLM 15652a6b (2026-06-07) to v0.31.0 (2026-10-05)

Research date: 2026-10-16. Every count below is reproducible from the two source trees
downloaded with `curl -sL https://codeload.github.com/vllm-project/vllm/tar.gz/<sha> | tar xz`.

## The pins

| | Old pin | New pin |
| --- | --- | --- |
| Ref | commit `15652a6b703f059767d75e5a511c4a5accf969ad` | tag `v0.31.0` = commit `db9527a46873454610df6dbedf79a36d6bf1a7f6` |
| Commit date | 2026-06-07T07:34:07Z | 2026-10-02T22:18:12Z |
| Release published | (between v0.22.1 and v0.23.0, untagged main) | 2026-10-05T06:44:55Z |
| Local tree | `/tmp/vllm-old` | `/tmp/vllm-new` |

Selection evidence: `GET https://api.github.com/repos/vllm-project/vllm/releases` on 2026-10-16
[Tier 1: GitHub API]. v0.31.0 is the newest release with `prerelease: false` and `draft: false`.
`GET .../git/ref/tags/v0.31.0` returns object `db9527a46873454610df6dbedf79a36d6bf1a7f6`,
type `commit` (a lightweight tag, so the tag SHA is the commit SHA).

Compare API `15652a6b...db9527a4`: status `ahead`, **4,773 commits**, behind by 0. Releases
between the pins: v0.23.0, v0.24.0, v0.25.0, v0.25.1, v0.26.0, v0.27.0, v0.27.1, v0.28.0,
v0.29.0, v0.30.0, v0.31.0. Full release notes saved to `/tmp/vllm-release-notes/<tag>.md`.

Citation form for the revamp: `https://github.com/vllm-project/vllm/blob/v0.31.0/<path>#L<n>`
(release tag, accepted by `scripts/gates/pinned-refs.sh`). Docs: `https://docs.vllm.ai/en/v0.31.0/...`
where the versioned docs page exists, otherwise `/en/stable/` with accessed date 2026-10-16.

## Repo scale

| Metric | Old pin | v0.31.0 | Change |
| --- | --- | --- | --- |
| `vllm/**/*.py` files | 1,799 | 2,569 | +770 (+42.8%) |
| `vllm/**/*.py` lines | 674,655 | 1,009,607 | +334,952 (+49.6%) |
| `csrc/` files (`.cu .cuh .cpp .h .hpp`) | 283 | 310 | +27 |
| `rust/**/*.rs` files | 210 | 340 | +130 (+61.9%) |
| `rust/**/*.rs` lines | 63,183 | 126,169 | +62,986 (+99.7%) |
| Whole tree (`git diff --no-index --shortstat`) | | | 5,743 files changed, 1,046,950 insertions, 214,262 deletions |

Method: `find <tree>/vllm -name '*.py' | wc -l`; lines via `xargs cat | wc -l`. The csrc count
includes `.hpp` (P1 verification finding C3: 242 excluded the 41 `.hpp` headers).

## Diff stat per subsystem (`git diff --no-index --shortstat old/<p> new/<p>`)

| Subsystem | Files old -> new | Diff |
| --- | --- | --- |
| `vllm/v1/core` | 15 -> 16 | 13 files, +5,992 / -1,650 |
| `vllm/v1/engine` | 14 -> 15 | 15 files, +2,225 / -822 |
| `vllm/v1/worker` | 88 -> 123 | 109 files, +21,819 / -5,392 |
| `vllm/v1/attention` | 67 -> 100 | 92 files, +32,629 / -4,624 |
| `vllm/v1/executor` | 9 -> 9 | 7 files, +429 / -269 |
| `vllm/v1/spec_decode` | 16 -> 19 | 15 files, +1,116 / -250 |
| `vllm/v1/structured_output` | 8 -> 8 | 8 files, +632 / -377 |
| `vllm/v1/sample` | 15 -> 15 | 11 files, +1,428 / -232 |
| `vllm/v1/kv_offload` | 31 -> 49 | 42 files, +10,539 / -1,386 |
| `vllm/v1/metrics` | 8 -> 9 | 7 files, +1,042 / -282 |
| `vllm/v1` (all) | 288 -> 406 | 357 files, +85,256 / -15,851 |
| `vllm/model_executor` | 1,235 -> 1,382 | 846 files, +121,469 / -64,183 |
| `vllm/models` (new top-level model packages) | 31 -> 326 | 322 files, +130,248 / -4,569 |
| `vllm/distributed` | 119 -> 184 | 162 files, +42,227 / -10,097 |
| `vllm/distributed/kv_transfer` | 68 -> 78 | 66 files, +20,423 / -7,910 |
| `vllm/entrypoints` | 175 -> 218 | 171 files, +15,646 / -8,072 |
| `vllm/config` | 29 -> 36 | 34 files, +5,268 / -906 |
| `vllm/compilation` | 43 -> 45 | 37 files, +2,577 / -490 |
| `vllm/lora` | 43 -> 44 | 35 files, +1,634 / -1,188 |
| `vllm/kernels` | 16 -> 34 | 31 files, +36,707 / -128 |
| `vllm/renderers` | 14 -> 19 | 16 files, +4,097 / -419 |
| `vllm/engine` | 5 -> 5 | 2 files, +751 / -143 |
| `vllm/platforms` | 8 -> 8 | 6 files, +1,620 / -399 |
| `rust/` | 287 -> 470 | 425 files, +81,264 / -14,913 |
| `csrc/` | 293 -> 320 | 275 files, +46,703 / -22,651 |
| `docs/` | 333 -> 350 | 177 files, +11,894 / -2,884 |

## Structural file moves that touch the dive

Added / removed `.py` files per subsystem (old -> new):

- `v1/core`: ADDED `sched/diffusion_scheduler.py`.
- `v1/engine`: ADDED `admission_control.py` (backs the v0.29 `--max-num-queued-reqs` /
  `--max-num-queued-tokens` flags).
- `v1/worker` (Model Runner V2 lives under `v1/worker/gpu/`): ADDED `gpu/pcp_manager.py`,
  `gpu/ubatch_utils.py`, `gpu/ec_connector.py`, `gpu/sample/{batch_shard,thinking_budget,watermark,trace_replay}.py`,
  `gpu/sample/logits_processor/*`, `gpu/spec_decode/{acceptance_estimator,adaptive_verification,extract_hidden_states}.py`,
  per-method speculators `gpu/spec_decode/{dflash,dflash2,draft_model,dspark,lilicorr,multi_module_mtp}/`,
  `mm_encoder_model_runner.py`, `sentinel/gpu_worker_sentinel.py`. REMOVED `tpu_input_batch.py`,
  `gpu/model_states/whisper.py`, `gpu/pool/late_interaction_runner.py`.
- `v1/spec_decode`: ADDED `dynamic/`, `vocab_mapping.py` (heterogeneous-vocabulary TLI).
- `v1/kv_offload`: ADDED `config.py`, `cpu/policies/factory.py`, and a whole `tiering/` stack:
  `async_lookup.py`, `backpressure.py`, `metrics.py`, `kvcr/`, `p2p/{control,data,session}/`,
  plus `fs/` and `obj/` tiers. REMOVED `worker/worker.py`.
- `distributed/kv_transfer/kv_connector/v1`: ADDED `hisparse/`, `nixl/{base,pull,push}_{scheduler,worker}.py`,
  `offloading/{canonical_mapping,config,events}.py`, `moriio/moriio_layout.py`.
  REMOVED the whole `p2p/` package (`p2p_nccl_connector.py`, `p2p_nccl_engine.py`, `tensor_memory_pool.py`).
- `entrypoints`: ADDED `cli/preload.py`, `cli/snapshot.py`, `launchers/` (api_server, grpc_server,
  dp_supervisor, render, run_batch), `scale_out/`, `cohere/`, `generate/base/`. REMOVED the old
  top-level `api_server.py` and `launcher.py`, `openai/cli_args.py`, `openai/dp_supervisor.py`,
  `openai/engine/*`.
- `config`: ADDED `aux_output.py`, `diffusion.py`, `ec_manager_config.py`, `engram.py`,
  `fault_tolerance.py`, `logging.py`, `watermarking.py`.
- `compilation`: ADDED `passes/fusion/add_rms_fusion.py`, `passes/fusion/qk_norm_rope_kvcache_fusion.py`.
- `v1/attention/backends`: 18 new backend files including `composite.py`, `triton_flash_attn.py`,
  `triton_flashinfer.py`, `mla/sparse_indexer.py`, `mla/flashattn_mla_sparse.py`, CPU MLA paths.
- `rust/src`: crates `bench build-info chat cmd engine-core-client llm managed-engine metrics
  mock-engine parser server text tokenizer tracing`.

## Every source path the dive cites: still present, new line count

Extracted with `grep -rhoE "(vllm|csrc|rust|docs)/...\.(py|rs|...)" src`. **No cited file was
removed or renamed.** Line counts moved, most by double digits:

| Path | Old | v0.31.0 |
| --- | --- | --- |
| `vllm/engine/llm_engine.py` | 7 | 7 |
| `vllm/engine/arg_utils.py` | 2,606 | 3,158 |
| `vllm/config/vllm.py` | 2,264 | 3,623 |
| `vllm/config/model.py` | 2,249 | 2,622 |
| `vllm/config/compilation.py` | 1,525 | 1,588 |
| `vllm/config/speculative.py` | 1,099 | 1,995 |
| `vllm/config/parallel.py` | 977 | 1,139 |
| `vllm/config/scheduler.py` | 308 | 360 |
| `vllm/config/cache.py` | 276 | 379 |
| `vllm/config/lora.py` | 131 | 152 |
| `vllm/config/kv_transfer.py` | 122 | 163 |
| `vllm/envs.py` | 2,208 | 2,430 |
| `vllm/v1/core/sched/scheduler.py` | 2,422 | 3,359 |
| `vllm/v1/core/kv_cache_utils.py` | 2,174 | 2,947 |
| `vllm/v1/core/single_type_kv_cache_manager.py` | 1,409 | 2,728 |
| `vllm/v1/core/kv_cache_manager.py` | 579 | 962 |
| `vllm/v1/core/block_pool.py` | 528 | 904 |
| `vllm/v1/engine/core.py` | 2,239 | 2,640 |
| `vllm/v1/engine/core_client.py` | 1,743 | 2,013 |
| `vllm/v1/engine/async_llm.py` | 1,111 | 1,301 |
| `vllm/v1/engine/llm_engine.py` | 425 | 478 |
| `vllm/v1/engine/coordinator.py` | 459 | 483 |
| `vllm/v1/worker/gpu_model_runner.py` (V1 runner) | 7,561 | 7,531 |
| `vllm/v1/worker/gpu_worker.py` | 1,204 | 1,618 |
| `vllm/v1/attention/backends/flash_attn.py` | 1,223 | 2,126 |
| `vllm/v1/attention/backend.py` | 1,044 | 1,155 |
| `vllm/v1/attention/selector.py` | 166 | 247 |
| `vllm/v1/sample/rejection_sampler.py` | 932 | 1,130 |
| `vllm/v1/spec_decode/llm_base_proposer.py` | 1,730 | 1,873 |
| `vllm/distributed/parallel_state.py` | 2,283 | 2,659 |
| `vllm/distributed/device_communicators/shm_broadcast.py` | 941 | 1,068 |
| `vllm/model_executor/layers/linear.py` | 1,571 | 1,796 |
| `vllm/model_executor/models/registry.py` | 1,422 | 1,576 |
| `vllm/model_executor/models/interfaces.py` | 1,660 | 1,968 |
| `vllm/platforms/cuda.py` | 895 | 1,064 |
| `vllm/compilation/backends.py` | 1,331 | 1,336 |
| `vllm/entrypoints/openai/chat_completion/protocol.py` | 1,011 | 1,146 |

Full list: `/tmp/cited-paths-status.txt` (regenerate with the command above).

## Release notes, v0.23.0 to v0.31.0: what reaches this dive

Source for every bullet: the GitHub release body for that tag [Tier 1: vLLM release notes,
`https://github.com/vllm-project/vllm/releases/tag/<tag>`, accessed 2026-10-16]. Release notes
orient; each research agent confirms the behaviour in code at v0.31.0 before it ships.

### Engine core and execution
- v0.23.0: Model Runner V2 (MRv2) default for Llama and Mistral dense models (#43458).
  Workers freeze the garbage collector after model init (#44363). Pluggable `KVCacheSpec` (#37505).
- v0.24.0: MRv2 supports quantized models by default (#44446). KV-cache watermark to reduce
  preemptions (#44594). `device_ids` argument; vLLM no longer sets `CUDA_VISIBLE_DEVICES`
  internally (#45026).
- v0.25.0: **MRv2 default for all dense models** (#44443). **Legacy PagedAttention
  implementation removed** (#47361). Pluggable sleep-mode backend (#44074). Transformers modeling
  backend reported "as fast as native vLLM" (#47187).
- v0.26.0: attention backend selectable per KV-cache group (#48012). `head_dtype` for fp32 lm_head (#48390).
- v0.27.0: PyTorch 2.13.0 (#48155). MRv2 for encoder-only and pooling (#49331, #48791).
- v0.28.0: **`max_num_batched_tokens` default raised from 8192 to 16384** (#51726). Prefix caching
  on by default for Mamba models (#50991). bitsandbytes moved out of tree (#43529).
- v0.29.0: **MRv2 default for all models** (#53183); Model Runner V1 deprecated, removal targeted
  for v0.32; vLLM falls back to MRv1 for sequence parallelism, dual-batch overlap, elastic EP,
  custom logits processors and certain spec-decode methods. **Prefix-cache `NONE_HASH`
  deterministic by default** (#51875), so `PYTHONHASHSEED` pinning is no longer needed for
  distributed KV cache. New admission-control flags `--max-num-queued-reqs` /
  `--max-num-queued-tokens` (#49445). FlashInfer all-reduce on by default for TP CUDA groups
  (#52998). `python -m vllm.entrypoints.openai.api_server` deprecated in favour of `vllm serve` (#52131).
- v0.30.0: Fast Start weight-cache daemon, `--load-format ipc_cache` (#54921). MRv2 dual-batch
  overlap (#50945, #51700). Gumbel-max watermarking (#54053). `--enable-scale-out` replaces
  `VLLM_ENABLE_SCALE_OUT_ENDPOINTS` (#54579). `VLLM_PREFIX_CACHE_RETENTION_INTERVAL` env var removed (#55353).
- v0.31.0: `vllm preload` CLI for the weight-cache daemon (#56680); experimental
  `vllm snapshot create/restore` via CRIU. `--max-num-active-seqs` caps RUNNING admission
  independently of `max_num_seqs` (#56758). `--long-prefill-token-threshold` adapts to waiting
  prefills (#57951). Waiting queue schedules requests already holding KV blocks first (#58947).
  Draft-model spec decode and custom logits processors on MRv2 (#43091, #56497).
  `tokenizer_mode="slow"` removed (#58545). Per-request `mm_processor_kwargs` rejected unless
  `--trust-request-mm-kwargs` (#58830). LoRA path part of the block hash (#59335).

### Speculative decoding
- DFlash (v0.23+), DFlash2 (v0.28, #52816), DSpark (v0.25, #46995), dynamic SD (v0.24, #32374),
  universal spec decode for heterogeneous vocabularies TLI (v0.25, #38174), async scheduling
  auto-enabled for draft models (v0.28, #48341), per-request acceptance stats via
  `--per-request-spec-decode-metrics` (v0.29, #48915), adaptive verification via an online
  acceptance estimator (v0.30, #52228), LiLiCorr drafter (v0.31, #57934).

### KV cache, offloading, disaggregation
- Offloading tiers: object-store secondary tier (v0.23, #41968), HMA by default for capable
  connectors (#41847), per-request offloading policy (#43205); multi-tier async batched lookup
  (v0.24); disk offloading (v0.28, #49644), out-of-tree secondary tiers via `module_path` (#51007),
  canonical CPU layout for parallelism-agnostic offload (#48414); back-pressure detection (v0.31).
- HiSparse host-resident tier for sparse-MLA decode, `HiSparseConnector` (v0.30, #53781).
- **NIXL KV push from prefill to decode** (v0.24, #35264). NixlConnector `kv_both` role
  deprecation cycle (v0.23). Mooncake PP support (v0.24). NIXL P/D for hybrid MLA+SSM (v0.27).
- P2P NCCL connector package removed (file evidence above).

### Distributed and large-scale serving
- Async EPLB by default (v0.23, #43219). DeepEP v2 (v0.24, #41183). Sequence parallelism without
  DP (v0.25, #47070). Fault-tolerance framework for DP+EP (v0.27, #44428). MoonEP all2all
  backend (v0.31, #52101). Prefill context parallelism with DP (v0.31, #57075).

### Rust frontend
- v0.23: streaming generate, dynamic LoRA, `/version`, `/server_info`. v0.24: API-key auth, CORS,
  tokenize/detokenize, pause/resume, abort. v0.25: HTTPS/mTLS, DP supervisor via the Rust
  frontend (#47076). v0.26: multimodal video and audio, native `vllm-bench`. v0.27: **gRPC
  control plane** (health, abort, discovery, KV event source discovery). v0.28: standalone
  renderer, gRPC multimodal, DP rank routing, protobuf schemas on Buf. v0.30: watermark controls forwarded.

### Quantization
- Online FP8 PTPC (v0.24), GGUF moved to a plugin (v0.24), bitsandbytes out of tree (v0.28),
  `calculate_kv_scales` removed (v0.28), targeted online quantization `quantization_config.targets`
  (v0.30), GPTQ `g_idx` removed (v0.30), `quantization="fp8"` online path replaced by the
  `fp8_per_tensor` shorthand (v0.31), AllSpark backend removed (v0.31).

## Consequences for the dive, ranked

1. **Model Runner V2 is the default for every model.** Every passage that frames V2 as opt-in, or
   names `gpu_model_runner.py` as "the" runner, is stale. CodebaseExecution is the largest rewrite.
2. **PagedAttention, the kernel, is gone; paged KV block management remains.** The PagedAttentionKV
   section must say what "paged" means at v0.31.0 (block tables, block pool) and which attention
   backends read paged KV.
3. **`NONE_HASH` deterministic by default** flips the CodebaseScheduler / PrefixCaching claim that
   the root hash is process-local unless `PYTHONHASHSEED` is set.
4. **Scheduler knobs changed**: `max_num_batched_tokens` default, admission control, active-seq cap,
   waiting-queue order. SchedulerBatching and CodebaseConfig need a defaults re-read.
5. **NIXL push path exists**; the NixlConnector monolith is split; P2P NCCL removed.
   DisaggregatedServing and CodebaseDistributed.
6. **Tiered KV offload** (CPU, disk, object store, P2P, HiSparse) is a capability the
   KVOffloadingLMCache section does not cover.
7. **Rust frontend**: scale doubled, gRPC control plane, DP supervisor. CodebaseRust is a rewrite.
8. **Entrypoints restructured into `entrypoints/launchers/`**; `vllm serve` is the only supported
   launch path; `vllm preload` / `vllm snapshot` exist. OpenAICompatServer and OperationsFailureModes.
9. Every line count in the codebase tabs moves.
