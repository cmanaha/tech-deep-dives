# fc14-code-a: section 27, Inside the Codebase (the tab shell and tabs 1 to 3)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, source at `/tmp/sglang-src`.
Fact check run 2026-10-24. Paths below are relative to `python/sglang/srt/` unless they start
with `python/`, `docs/`, `rust/`, `sgl-model-gateway/` or `test/`. All verdicts are code readings,
not runs.

## InsideCodebase.tsx (tab shell and intro)

6 claims checked: the h1 provenance, the three trees, the tab labels, the tab ordering advice, the
"each tab ends on the check you can run" description. 5 CONFIRMED (`rust/Cargo.toml#L3-L13` lists
eight workspace crates and the excluded `sglang-radix-tree`; `rust/sglang-radix-tree/Cargo.toml#L5`
"Rust tree core for the Unified Radix Cache"; every tab's last h2 is a check).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| S1 | rust/ holds "the Rust server crates (the opt-in Rust frontend and the radix tree core)" | InsideCodebase.tsx:63 | OVERREACH | `rust/Cargo.toml#L3-L13`: ten crates (api-codegen, api-types, bench, grpc, mm, processor, renderer, server, plus radix-tree outside the workspace) | "the Rust crates, among them the opt-in Rust frontend and the radix tree core" |

**Score: 9/10.** Short shell that states the payoff and the provenance; one scope fix.

## codebase/CodebaseArchitecture.tsx (tab "Launch Path & Argument Resolution")

63 claims checked (54 `Cite`s after fixes, the size counts, the diagram text). 54 CONFIRMED, including: all
size counts recounted with `find`/`wc` (2,028 files and 880,863 lines under `srt/`; `layers/`
198,576; `models/` 186,498 and 247 top-level files; together 43.7%; gateway `src/` 172 `.rs` files
and 63,379 lines; `rust/` 108,848 lines); 21 namespace classes in 12 files of `arg_groups/fields/`
(`server_args.py#L508-L530`); `resolve_once()` at `python/sglang/launch_server.py#L29`; every
engine line (`entrypoints/engine.py#L1169`, `#L1179`, `#L1215`, `#L889-L987`, `#L1317`,
`#L1325-L1333`, `#L1338`; `Engine.__init__` reaches it at `#L331`); `run_scheduler_process` at
`managers/scheduler.py#L6076-L6157`; the `--chunked-prefill-size` walk (`arg_groups/memory_hook.py#L132-L140`
8192 for under 90 GiB, `arg_groups/pipeline.py#L208` before `#L264`,
`arg_groups/parallel_hook.py#L308-L324`, `managers/scheduler_components/new_token_ratio_tracker.py#L20-L32`
with `environ.py#L595` 0.7, so 0.21 and 1024 by arithmetic); the `server_args=` line prints
`resolved_dict()` (`entrypoints/engine.py#L170-L171`); all four docs-vs-code conflicts (docs 0.88 vs
`memory_hook.py#L326-L330` 0.95; seven docs choices vs nine at `arg_groups/fields/schedule.py#L82-L98`,
`priority` raises at `managers/schedule_policy.py#L336-L340`; docs 1.0 and three docs pages, none
with the 0.3 multiplier; docs "disables overlap" for NGRAM and DFLASH vs
`arg_groups/speculative_hook.py#L65-L77`, no other overlap-off declaration for either algorithm in
`arg_groups/`); the allow list holds 92 flags.

Build-log item settled: "81 named steps". `arg_groups/pipeline.py#L20-L353` makes 83 `run_hook`
calls over 81 distinct hooks (`handle_offload_compatibility` at L80 and L218,
`handle_kv_cache_sharding` at L272 and L347), and the overridable whitelist at
`arg_groups/resolution_hooks.py#L14-L97` names exactly those 81. A full run adds four
`run_post_process_pass` calls (L220, L246, L290, L298) and the direct call
`finalize_cuda_graph_prefill_max_context` (L342); the dummy-model path stops after 12 hooks and one
pass (L102-L106). Wording made exact in all four places and in the diagram.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| A1 | `resolve_once` runs "81 named steps" (stop 5, flag list item 2, closing line, diagram "81 resolution steps") | CodebaseArchitecture.tsx:61, :443, :640, :880 | WRONG (count wording) | `arg_groups/pipeline.py#L20-L353` (83 `run_hook` calls, 81 distinct, plus 4 passes and 1 finalize call); `arg_groups/resolution_hooks.py#L14-L97` | "81 named hooks in a fixed order, 83 calls in all because two run twice, with four post-process passes and one finalize step among them"; closing line and diagram "81 named hooks"; "any named step" became "any named hook" |
| A2 | `sglang serve` hands off to "one of two serving backends" | :366-367 | OVERREACH | `python/sglang/cli/serve_backends.py#L79-L110`: installed packages add backends through entry points | "one of its two built-in serving backends" |
| A3 | A startup traceback ending in `arg_groups/` "failed at stop 5" | :605-607 | OVERREACH | `entrypoints/engine.py#L1157` runs `check_server_args`, which is `arg_groups/validation_hook.py#L171-L186`, during stop 7 before any spawn | Added the validation pass with a cite to engine.py L1157: "failed at stop 5 or in that validation pass" |
| A4 | KV pool token count and default `--max-running-requests` computed in the scheduler, cite kv_cache_configurator.py L2800-L2853 | :666 | UNSUPPORTED (range) | L2800-L2853 is `resolve_max_num_reqs` only; the token count comes from `mem_cache/kv_cache_configurator.py#L2855-L2871` (`_profile_available_bytes`, `config_from_budget`) | Cite widened to L2800-L2871 |
| A5 | Config bags "which `publish` fills once in each process" | :674-675 | OVERREACH | `runtime_context.py#L1502-L1505`: re-publish is allowed, last publish wins | "fills in each process at startup" |
| A6 | The docs-coverage test "reads only the Argument column" | :726-729 | WRONG (partly) | `test/registered/unit/server_args/test_server_args_docs_coverage.py#L88` coverage reads cell 0, but `#L98` stale check reads every cell | "it fails when a live flag has no row or the page names a flag that no longer registers, and its coverage check reads only the Argument column" |
| A7 | `grep "chunked_prefill_size="` finds the GPU-memory, DP and model-specific steps | :846-851 | OVERREACH (incomplete list) | `arg_groups/attention_hook.py#L563-L569`: multi-item scoring also declares -1; `arg_groups/model_hook.py#L207-L221` holds the full model declaration | Added "and for multi-item scoring" with a cite to attention_hook.py L563-L569; model_hook cite widened from L215-L220 to L207-L221 |
| A8 | `max_running_requests=None` expected "when no speculative step set it to 48" | :869-873 | OVERREACH | `arg_groups/deepseek_v4_hook.py#L92-L97` declares 256 for DeepSeek V4 | "no resolution step declared it, as the speculative steps do with 48" |
| A9 | Diagram desc: side features "sit beside the path inside the scheduler process" | :186-188 | OVERREACH | `managers/tokenizer_manager.py#L786-L790` starts the PD bootstrap server in the main process | "sit beside the path, drawn in the scheduler process, where most of their code runs" |

Cross-section check: the processes (TokenizerManager in the main process, one scheduler per GPU,
one detokenizer, ZMQ between them) agree with section 3 as fact check fc01 left it; the 0.7 bet and
its attention-DP reduction agree with section 4. No contradiction with the cross-section
conditions block (this tab states no B200 page-size or PD-timing claim).

Diagram re-verified with the harness after A1 and A9 (see the harness block at the end).

**Score: 8/10.** Strong practical path (field, step, scheduler; three checks) with the flag walk
and the four docs conflicts all holding in code. Held at 8 by the long "How a flag gets its value"
container, which stacks many cites in two dense paragraphs.

## codebase/CodebaseScheduler.tsx (tab "Scheduler & Batching")

78 claims checked (62 `Cite`s after fixes, the inline line numbers in the stop table and the step
list, the log-field table). 70 CONFIRMED, including: `managers/scheduler.py` is 6,171 lines; the stop-1
lines (`#L6093-L6101`, `#L6128`, `#L6134`, `#L465-L468`, `#L1098-L1130`); the receiver
(`managers/scheduler_components/request_receiver.py#L112-L161` non-blocking drain at attention-TP
rank 0 of PP stage 0, `#L163-L212` broadcast); `handle_generate_request` builds `Req` (L2820) and
`_add_request_to_queue` appends (L3353-L3366); eleven loops in `_dispatch_event_loop_once`
(`#L5984-L6013`); both loop bodies and their order (`#L1939-L2048`); `is_disable_overlap_for_batch`
two cases with `SGLANG_DISABLE_CONSECUTIVE_PREFILL_OVERLAP` default False (`environ.py#L642`);
`FutureMap` docstring quoted verbatim and `output_tokens_buf` sized to the request pool
(`managers/overlap_utils.py#L255-L291`); the normal loop also relays through it (`#L4629-L4631`);
`_relay_forward_payload` and `stash` (`#L4830-L4852`, `overlap_utils.py#L627-L663`); the
gather in `resolve_forward_inputs` (`overlap_utils.py#L117-L118`); prefill first
(`#L3870-L3872`); LPM and HRRN fall back to FCFS above 128 waiting (`managers/schedule_policy.py#L133`,
`#L300-L311`); the charge (`#L1348-L1353` new request, `#L754-L763` running request, `ignore_eos`
at 1.0, clip comment `#L81-L84`); tracker 0.7, floor 0.14 times start, 600 steps, so 0.098
(`environ.py#L595-L599`); decay on a clean decode step (`#L4417-L4418`); retraction order key `(len(output_ids), -len(origin_input_ids))`
(`managers/schedule_batch.py#L3399-L3426`), `release_req` evicts `remaining x 20` tokens
(`#L2272-L2274`), the post-retraction estimate (`new_token_ratio_tracker.py#L40-L49`); the two log
lines, their fields and the rank-0 gate (`metrics_reporter.py#L730-L739`, `#L911`,
`observability/metrics_collector.py#L1329`, `arg_groups/fields/observability.py#L136-L139`
default 40); the prefill line prints at result time from counts captured at build
(`batch_result_processor.py#L509-L515`, `scheduler.py#L4239-L4248`).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| B1 | `dispatch_event_loop` picks the loop "from the PD mode, the PP size and the overlap flag" | CodebaseScheduler.tsx:93-95 | OVERREACH (incomplete) | `managers/scheduler.py#L5990-L5995`: `enable_pdmux` and `enable_overlap_mlx` branches select two of the eleven loops | Added "with PD multiplexing and Apple's MLX as two more opt-in branches" |
| B2 | Policy enums at L168-L182 | :160 | UNSUPPORTED (range, minor) | `ROUTING_KEY` is at `managers/schedule_policy.py#L183` | L168-L183 |
| B3 | "The copy of the result to the host runs on a separate copy stream" | :458-459 | OVERREACH | `managers/scheduler.py#L4599-L4605`: on HIP (AMD) the copy runs on the forward stream | "Except on AMD GPUs, the copy ..." |
| B4 | "The CPU waits on the GPU at one point: the decode result handler" | :479-483 | OVERREACH | `managers/scheduler_components/batch_result_processor.py#L267-L268` (prefill), `#L936`, `#L893` also synchronize on `copy_done` | "The CPU waits on the GPU when it processes a result: the decode and prefill handlers block on that batch's `copy_done`", cite L267-L268 added |
| B5 | Retraction "always keeps one" | :601-602 | OVERREACH | `managers/schedule_batch.py#L3355-L3377` aborts the last request when even it cannot fit | "keeps at least one, which it aborts if even that one cannot fit" |
| B6 | `token usage` is "the fraction of the KV pool in use", cite pool_stats_observer.py L104-L149 | :305-311 | UNSUPPORTED (range) | L104-L149 only formats the label; the value is `(total - available - evictable) / total` at `managers/scheduler_components/pool_stats_observer.py#L235-L245` | Cite moved to L235-L245; added "evictable radix-cache entries count as free" |
| B7 | Growing `#queue-req` with low `token usage` "is the charge holding requests back" | :690-692 | OVERREACH | The request pool is sized to `max_running_requests` (`mem_cache/kv_cache_configurator.py#L1487`, `#L1532`), and the adder gets the cap (`managers/scheduler.py#L4045`); with speculative decoding the cap defaults to 48 | Added the condition "with `#running-req` below the `max_running_requests` the scheduler printed at startup" |
| B8 | "an idle scheduler resets it to the start" | :585-588 | OVERREACH | `managers/scheduler.py#L5085-L5103`: `on_idle` returns before the reset unless `is_fully_idle()` (`#L5168-L5186`, nothing running, no result pending, empty waiting queue) | "a fully idle scheduler, with nothing running or queued, resets it", cite L5085-L5103 added |

Cross-section check against section 4 (fact check fc02): the 4096 cap, the 0.7 start, the 0.098
floor over 600 steps, the 128-request fallback and the relay all agree. Section 4's symptom table
reads the queue-and-usage signal from the tuning guide; B7 narrows only this tab's code reading.

**Score: 8/10.** The twelve-stop walk, the relay steps and the log-field table give a reader a
direct path from a log line to the code; the 4096 and 70% charges land twice. Held at 8 by the
dense step list in "One batch ahead, in code" (many inline line numbers in one container).

## codebase/CodebaseRadixMemory.tsx (tab "Radix Cache & Memory Pools")

71 claims checked (59 `Cite`s after fixes, the inline line numbers, the sample log line, the fallback
list). 66 CONFIRMED, including: `CacheInitParams` then `create_tree_cache`
(`mem_cache/kv_cache_builder.py#L331-L387`); the default chain order and the
`--radix-cache-backend` override (`mem_cache/registry.py#L83-L146`, `#L229-L244`); the log format
(`#L297-L306`) and the `Tree Core:` line (`mem_cache/unified_radix_cache.py#L321-L325`); the core
owns the tree state (comment at `#L218-L219`); the eight Rust fallback reasons and the 2.11 to 2.14
PyTorch range (`mem_cache/unified_cache/tree_core_registry.py#L44-L121`,
`rust_extensions/torch_build.py#L15-L16`, `environ.py#L688` default `rust`); `RadixKey` namespaces
and `extra_key` carrying the LoRA id (`managers/schedule_batch.py#L1133-L1138`); `TreeNode` fields
and root `lock_ref = 1`; `ComponentData` per component; `ReqToTokenPool` int32 with padding row 0
(`mem_cache/memory_pool.py#L398-L406`); MHA K/V per layer and MLA one latent buffer per layer; free
lists as GPU tensors; the pool size formula (`model_executor/pool_configurator.py#L614-L624`);
`match_kv_cache`, the Rust page rounding (`rust/sglang-radix-tree/src/unified_tree_core.rs#L1256`),
`_match_prefix_helper` and `_split_node`; the admission lock (`managers/schedule_policy.py#L1591`)
and lock walk; `write_cache_indices` row writes; the prompt-boundary split on every checkpoint
(`mem_cache/radix_cache.py#L485-L502`, called with `split_prompt=True` at `#L519-L521`); eviction
only on shortfall (`mem_cache/allocator/base.py#L155-L158`); the heap walks in Rust, Python and
`RadixCache.evict`; the same eight policies in Python and Rust
(`mem_cache/evict_policy.py#L10-L100`, `unified_lru_list.rs#L545-L563`); the HiCache demote path,
`BlockRemoved` per node (`mem_cache/events.py#L219-L220`) and the 10-token load-back floor
(`unified_radix_cache.py#L543`, `#L1790`); the PD decode default and its log line. The Against-vLLM
line agrees with vLLM v0.31.0 `vllm/v1/core/block_pool.py` (hash map L181, free queue L178,
`popleft_n` L684) and with section 5.

Build-log item settled: "disabled cache prints the same Tree cache line" holds for a dense model
(`mem_cache/registry.py#L91-L99`); an all-sliding-window model with the cache off builds a
`PureSWARadixCache` instead (C2).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| C1 | "The older `RadixCache`" | CodebaseRadixMemory.tsx:49-51 | UNSUPPORTED | Nothing at the pin dates the class; it still serves as the base of `PureSWARadixCache` and `FlexKVRadixCache` (`mem_cache/pure_swa_radix_cache.py#L14`) | Dropped "older": "The `RadixCache` class in `radix_cache.py`" |
| C2 | "A disabled cache is still a `UnifiedRadixCache`" | :96-97 | OVERREACH | `mem_cache/registry.py#L91-L98`: an all-sliding-window model with the cache off gets `PureSWARadixCache` | Added "except for an all-sliding-window model" |
| C3 | `match_prefix` applies returned actions "such as a node split" | :293-294 | WRONG (minor) | The split happens inside the walk; the returned action is `ReplaceWriteThroughOnNodeSplit` (`mem_cache/unified_radix_cache.py#L590-L592`, `#L1308`) | "such as moving a pending write-through after a node split" |
| C4 | "Page size 1 gets `TokenToKVPoolAllocator`, any other page size `PagedTokenToKVPoolAllocator`" | :239-240 | OVERREACH | `mem_cache/kv_cache_configurator.py#L2595-L2618`: page size 1 with DCP on takes the paged allocator | "unless DCP (decode context parallelism) is on" |
| C5 | Only a PD decode server named as the startup path that turns the cache off | :540-545 | OVERREACH (low; consistency with section 5, fc02 R1) | `arg_groups/attention_hook.py#L555-L561` (multi-item scoring) and others listed in fc02 R1 | "Startup also turns the cache off for some configurations, multi-item scoring among them", cite added; the PD decode sentence kept |

**Score: 8/10.** Fifteen stops that map the mental model (a hit is an index write, an eviction is a
leaf heap) to the serving classes, with a startup check that ends on an action. Held at 8 by density:
stops 4 and 7 each carry many conditions and cites in one list item.

## Harness and checks

Harness (`--sections codebase --tabs "Launch Path & Argument Resolution|Scheduler & Batching|Radix
Cache & Memory Pools"`, slug fc14, port 4484), run after the last edit: all three tabs "ok" at 1440
and 390, the module map 0 overlap and 0 clip. PNGs read: the 1440 diagram shows "fields, then 81
named hooks" inside its box; at 390 the map scrolls (min-width 720) as designed.

- `pnpm --filter @tech-deep-dives/sglang typecheck`: exit 0 (`tsc --noEmit`, no errors)
- `pnpm --filter @tech-deep-dives/sglang lint`: exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no output)
- `bash scripts/gates/no-ai-tells.sh`: PASS
- `bash scripts/gates/pinned-refs.sh`: PASS
- `bash scripts/gates/svg-a11y.sh`: PASS

## For the orchestrator (files this group does not own)

- None blocking. Section 4 (`Scheduler.tsx`) reads the queue-and-usage signal from the tuning guide;
  B7 adds the `max_running_requests` condition to this tab's code reading only. If section 4 should
  carry the same condition (the cap is 48 under speculative decoding), that is a section 4 change.
