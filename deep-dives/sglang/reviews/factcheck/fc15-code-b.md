# fc15-code-b: section 27, Inside the Codebase (tabs 4 to 6)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, source at `/tmp/sglang-src`.
Fact check run 2026-10-24. Status: COMPLETE.
Paths below are relative to `python/sglang/srt/` unless they start with another top-level directory.

## codebase/CodebaseExecution.tsx (tab 4, Model Execution & Attention)

Claims checked: 71 (60 `Cite`s plus the unbadged default-table rows, the two log formats, the
vLLM priority-list line and the B200 derivation). CONFIRMED: 65.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| E1 | "pass `--speculative-num-steps` and `--speculative-eagle-topk 1` to keep `trtllm_mha`" | CodebaseExecution.tsx:180-182 | OVERREACH (Cross-section B200 condition, fc04 refinement) | utils/common.py#L4014-L4020: topk 1 counts only with page size unset or 1; an explicit `--page-size` above 1 drops B200 to `flashinfer` (model_override_base.py#L303-L310) | Added "and leave `--page-size` unset" |
| E2 | MLA generic table: `triton` "in the other cases" | CodebaseExecution.tsx:159-161 | WRONG (minor) | arg_groups/model_override_base.py#L338-L339 returns `torch_native` for MLA on MPS | Added "`torch_native` on Apple GPUs" |
| E3 | `fa3` "asserts SM80 for non-MLA models or SM90"; SM80 not expanded | CodebaseExecution.tsx:322-323 | WRONG (narrow) + acronym | layers/attention/attention_registry.py#L246-L251 asserts `major == 8` (any 8.x, incl. Ada 8.9) for non-MLA, or `major == 9` | "asserts compute capability 8.x (Ampere and Ada) for non-MLA models, or SM90" |
| E4 | "each paged backend replaces any value outside its accepted set with 64" | CodebaseExecution.tsx:196 | OVERREACH | The Intel XPU constraint replaces with 128 (arg_groups/overrides.py#L1287-L1300), outside the cited pass L1084-L1150 | "each backend in this pass" |
| E5 | Eager runner runs mixed as extend "except on NPU builds" | CodebaseExecution.tsx:493-495 | OVERREACH (missing condition) | model_executor/runner/eager_runner.py#L213-L218: also kept MIXED when a CP strategy is set | Added "and under context parallelism" |
| E6 | Base `forward`: decode to `forward_decode`, "the rest to `forward_extend`" | CodebaseExecution.tsx:461-463 | OVERREACH (minor) | layers/attention/base_attn_backend.py#L288-L297 sends a mixed batch on NPU to `forward_mixed` | Added the NPU `forward_mixed` branch |

Spot notes on CONFIRMED items: pipeline order L195-L204 platform hooks, L208 memory, L215 model
overrides, L232 attention handler, L246 page default, L294 speculative hook (arg_groups/pipeline.py);
`_attention_backend_default` logs at info and the `trtllm_mha` warning formats `{page_size}`, so an
unset page prints `None` (arg_groups/overrides.py#L1077-L1079, #L1133-L1136); handler order L119,
L183, L240 (arg_groups/attention_hook.py); twelve architectures at model_overrides/deepseek_v2.py#L38-L49;
25 backend names with `nsa` and `compressed` deprecated (arg_groups/choices.py#L69-L99); `is_sm100` is
major 10 with CUDA 12.8 or later (runtime_context.py#L1824, utils/common.py#L302-L306); FA4
forces 128 unless topk above 1 (DiffusionGemma gets 1, a rare case left out, overrides.py#L1251-L1255);
scheduler order weights, pools, backends, graphs (managers/scheduler.py#L1098-L1111); hybrid routing
(layers/attention/hybrid_attn_backend.py#L79-L88); FA page table and stride (flashattention_backend.py#L955-L957,
#L1269-L1282); `server_args=` prints `resolved_dict()` (entrypoints/engine.py#L170-L171, #L1179). Under the
default breakable prefill graph the custom op runs as `eager_on_graph(True)(unified_attention_with_output)`
(layers/radix_attention.py#L740-L742), so "goes through `unified_attention_with_output`" holds there too.
vLLM v0.31.0 `vllm/platforms/cuda.py#L154-L179` (priority list) and #L375-L451 (`validate_configuration` per
candidate) confirm the Against-vLLM line.

Build-log row settled: page-size warning text matches overrides.py#L1135; the section 8
`radix_attention.py` range is L294-L302 (the `get_attn_backend().forward` call), which this tab's
L159-L302 cite covers.

B200 consistency: the only `trtllm_mha` default claims (default table, speculation paragraph, the
check) now carry speculation off, or topk 1 with num-steps set and page size unset.

Score: **9/10**. Every stop is a pinned file and range that holds the evidence, the resolver order
is the mental model and the startup-log check is the reader's next action. Fixes were scope
narrowings; no diagram.

## codebase/CodebaseParallelPd.tsx (tab 5, Parallelism, MoE & PD)

Claims checked: 74 (61 `Cite`s, the two worked rank layouts, the title list, the registry query
and its JSON keys, the Against-vLLM line). CONFIRMED: 64.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| P1 | "One SGLang server spans `tp_size x pp_size` GPUs" | CodebaseParallelPd.tsx:64-66 | OVERREACH | runtime_context.py#L173-L178 is one replica's world; replica DP launches `num_dp_ranks` of them (managers/data_parallel_controller.py#L393-L399); the tab's own check says `--dp-size` multiplies | "One SGLang replica spans ...; `--dp-size` multiplies replicas, and every other parallel width carves the TP group" |
| P2 | runtime_context.py "in five small functions" | CodebaseParallelPd.tsx:167 | WRONG | The bullets name six: `derive_attn_tp_size`, `derive_attention_ranks`, `derive_spawn_ranks`, `derive_parallel_widths`, `launch_world_size_of`, `num_dp_ranks_of` (runtime_context.py#L73-L207) | "six" |
| P3 | "PPLX always takes MAX_LEN" | CodebaseParallelPd.tsx:280 | Prose rule (unexpanded acronym) | The backend value is `pplx` (layers/dp_attention.py#L159-L161) | "the `pplx` backend" |
| P4 | `--moe-a2a-backend none` gets the `StandardDispatcher` | CodebaseParallelPd.tsx:309-311 | OVERREACH (missing condition) | layers/moe/fused_moe_triton/layer.py#L167-L168 gives `AscendTPDispatcher` on NPU | Added "(on NPU, the Ascend TP dispatcher)" |
| P5 | Registry files each rank "under exactly those four keys" (attention DP, CP, TP, PP) | CodebaseParallelPd.tsx:415-416 | OVERREACH | disaggregation/common/conn.py#L2750-L2753: the DP key is `system_dp_rank` when `system_dp_size` is above 1 | Key list now says the DP rank is the attention DP rank, or the replica rank under `--dp-size` |
| P6 | Known item: registry expects `dp_size x attn_cp_size x attn_tp_size x pp_size` registrations; check section's JSON lists `dp_size` bare | CodebaseParallelPd.tsx:420-422, 621 | WRONG (ambiguous, fc07 D4) | conn.py#L2724-L2725 `dp_size = attn_dp_size if system_dp_size == 1 else system_dp_size`; #L2660 | "its DP rank count times `attn_cp_size x attn_tp_size x pp_size`", one sentence naming what the stored `dp_size` holds with the `--tp 8 --attn-dp-size 8` example and a conn.py L2724-L2725 cite; JSON key glossed "(the DP rank count)" |
| P7 | decode.py docstring stages "preallocation queue, transfer queue, a prebuilt batch, the running batch" | CodebaseParallelPd.tsx:467-468 | WRONG (minor) | disaggregation/decode.py#L1-L19: stage 3 is the WaitingQueue, which builds a PrebuiltExtendBatch | "waiting queue (which builds a prebuilt batch)" |
| P8 | Registry "binds the HTTP server's host, which is 127.0.0.1 unless `--host` changes it" with no cite | CodebaseParallelPd.tsx:551-552 | UNSUPPORTED (default without a cite) | managers/disagg_service.py#L45-L48; arg_groups/fields/serving.py#L65 | Both cites added |
| P9 | `ps -eo pid,args \| grep sglang::scheduler` gives "one line per GPU, eight here" | CodebaseParallelPd.tsx:601-602 | WRONG (practical) | The grep process's own argv contains the pattern, so the pipeline prints a ninth line | `grep '[s]glang::scheduler'` with a one-clause reason |
| P10 | "the same labels at the start of each scheduler's log lines" | CodebaseParallelPd.tsx:602-603 | WRONG (minor) | utils/common.py#L2584 `[%(asctime)s{ms}{prefix}]`; prefix is space-separated (managers/scheduler.py#L6045-L6057), the title replaces spaces with `_` (#L6060) | "space-separated, after the timestamp", cite added |

Spot notes on CONFIRMED items: field defaults and the `--ep` alias (arg_groups/fields/parallel.py#L45-L90,
#L269-L276), derived fields (#L304-L340); deprecated DP attention rewrite only when `attn_dp_size` is 1
(arg_groups/parallel_hook.py#L52-L58); both-above-1 rejection, x0.3 and chunk division with the quoted
log line (#L279-L324); `_A2A_EP_SPANNING_BACKENDS` and the info line (arg_groups/overrides.py#L1530-L1571),
run after `handle_data_parallelism` (arg_groups/moe_hook.py#L252, pipeline.py#L264); `_validate_parallel`
factorizations and message `(set by publish)` (runtime_context.py#L294-L350, #L1588); GPU formula at the
default `--gpu-id-step` 1 (entrypoints/engine.py#L930-L934); title order DP, PP, ATTN_CP, MOE_DP, TP, EP
(managers/scheduler.py#L6045-L6060); title list for `--tp 8 --attn-dp-size 4 --ep 8` re-derived from
runtime_context.py#L92 and #L128-L133; padding mode order (layers/dp_attention.py#L148-L184); min/max
agreement (managers/scheduler_components/dp_attn.py#L260-L261, applied to the batch at #L312); DeepEP
`auto` resolve (layers/moe/utils.py#L264-L271); EPLB generator (eplb/eplb_manager.py#L72-L94);
63-bit room (sgl-model-gateway/src/routers/http/pd_types.rs#L59-L63) and concurrent legs
(pd_router.rs#L701-L730); bootstrap start rule and 8998 default (managers/disagg_service.py#L28-L48,
arg_groups/fields/disagg.py#L78-L80); bare `web.Application()` (common/conn.py#L2618), routes
(#L2666-L2670), policy refusal (#L2710-L2714), 503 text and JSON fields (#L2789-L2821); five `KVPoll`
states (disaggregation/base/conn.py#L118-L123); `pop_bootstrapped` rule (disaggregation/prefill.py#L488-L526,
optimistic default 0 at arg_groups/fields/disagg.py#L122-L124); mooncake is the default backend
(arg_groups/fields/disagg.py#L65-L71); Mooncake `batch_transfer_sync_write` and NIXL `WRITE`
(mooncake_transfer_engine.py#L255, nixl/conn.py#L1914-L1916). vLLM v0.31.0:
`vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py#L339-L407` (`NixlPullConnector` READ,
`NixlPushConnector` WRITE, `NixlConnector` kept as the pull alias); the vLLM dive's codebase tab is
labelled "Distributed & KV Transfer" (deep-dives/vllm/src/sections/InsideCodebase.tsx#L73).

PD handshake timing: the tab says prefill starts a request only after decode's reservation, under
the default `early` policy, with `--optimistic-prefill-attempts` (default 0) and `prefill_complete`
named as the two exceptions. That matches the Cross-section block and fc07's scope note (every
real backend sets `WaitingForInput` only when decode's destinations arrive; a prefill server
refuses the fake backend).

Build-log row settled: 15 stops; the registry's missing key check stays labelled "by our reading of
the code, not run" (common/conn.py#L2615-L2624); the process-count check now prints only scheduler
lines.

Score: **9/10**. Rank arithmetic, launch placement and the PD rendezvous are each tied to pinned
lines, and the two checks (process titles, registry query) close the tab on the reader's next
action. Fixes were precision corrections; no diagram.

## codebase/CodebaseRust.tsx (tab 6, Gateway & Rust Frontend)

Claims checked: 58 (46 `Cite`s plus the six printed defaults, the public-route list, the route
lists per Rust module, the probe expectations and the Against-vLLM line). CONFIRMED: 53.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| G1 | Against vLLM: vLLM's Rust frontend replaces the API server "where SGLang's ... also takes over tokenization and detokenization" | CodebaseRust.tsx:423-429 | WRONG (implied contrast; fc01 R14, fc12 #26) | https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/text/src/lib.rs#L4-L8 (tokenizer loading, incremental detokenization); https://github.com/vllm-project/vllm/blob/v0.31.0/rust/README.md#L3 (talks to the engine over ZMQ) | "takes the place of its API server process, tokenization and detokenization included, and still reaches the engine over ZMQ; SGLang's runs inside the GPU process itself", two pinned vLLM cites |
| G2 | OpenAI-style routes "`/v1/models`, `/v1/completions` and `/v1/chat/completions`" | CodebaseRust.tsx:368-369 | OVERREACH (incomplete list; fc01 R11) | rust/sglang-server/src/api_server/http/openai/models.rs#L16-L17 also mounts `/v1/models/{model}` | Route added with the models.rs cite |
| G3 | "The Python launcher takes its defaults from the `RouterArgs` dataclass" | CodebaseRust.tsx:454-458 | OVERREACH (contradicts section 18 after fc09) | `sgl-model-gateway/bindings/python/src/sglang_router/router_args.py#L486-L490` parser default `--prometheus-host 0.0.0.0`; dataclass `prometheus_host = None` at #L85; the six routing defaults do come from the dataclass (#L283-L339) | Narrowed to "routing-policy defaults", parser cite L283-L339 added, and the `--prometheus-host` exception stated with both cites |
| G4 | Balance trigger "more than 64 requests and more than 1.5 times above the idlest" | CodebaseRust.tsx:58-59 | WRONG (ambiguous: "1.5 times above" reads as 2.5x) | sgl-model-gateway/src/policies/cache_aware.rs#L412-L413: `max - min > 64 && max > min x 1.5` | "has more than 64 requests over the idlest and more than 1.5 times its load" |
| G5 | Probe expectation "no Prometheus text from `/metrics`" while the probe prints status codes | CodebaseRust.tsx:483-484 | WRONG (practical, minor) | No `/metrics` route and no router fallback under `rust/` (grep for `"/metrics"` and `fallback` in `rust/sglang-server/src/api_server/http/`), so axum answers an unmatched path with 404; labelled our reading, not run | "404 from `/metrics`" |

Spot notes on CONFIRMED items: crate 0.3.2, lib `smg`, three binaries from `src/main.rs`
(sgl-model-gateway/Cargo.toml#L5-L34); binary binds 0.0.0.0:30000 with six policy names and 0.3 / 64 /
1.5 / 120 s / 67,108,864 (src/main.rs#L137-L171); Python `RouterArgs` 0.3 / 64 / 1.5 / 60 s / 2**26 and
eight names with the gap comment (bindings/python/src/sglang_router/router_args.py#L20-L63); route
layers and public group incl. both `get_` aliases (src/server.rs#L580-L605), control-plane or key
check on admin and worker routes (#L607-L655); `tokens: None`, 503 `no_available_workers`, load guard
only for `cache_aware` and `manual` (src/routers/http/router.rs#L171-L180, #L282-L302); `pool::model`
trees (src/policies/cache_aware.rs#L77-L101), min-load path still inserts (#L310-L382), match rate and
least-loaded fallback with random tie (#L436-L471), header comment says smallest tree (#L25-L33);
`evict_tenant_by_size` (src/policies/tree.rs#L718), atomic load and RAII guard (src/core/worker.rs#L784-L786,
#L1141-L1168); `select_pd_pair` per-role policies (src/routers/http/pd_router.rs#L1011-L1035); hinted
`CacheAwarePolicy::new()` and its 0.5 / 32 / 1.1 / 30 s / 10,000 defaults (src/policies/registry.rs#L186-L191,
src/policies/mod.rs#L106-L116); `SGLANG_RUST_SERVER = EnvBool(False)` (python/sglang/srt/environ.py#L1902);
engine returns before the detokenizer and TokenizerManager (entrypoints/engine.py#L1292-L1313);
`_hosts_rust_server` PP 0, attention TP 0, attention CP 0 and the ring drain (managers/scheduler.py#L2331-L2360,
scheduler_components/request_receiver.py#L117-L124); port plus local DP index, multimodal refusal
before bind, startup line with `(DP rank i/n)` (rust_server/server.py#L134-L216); crate boundary and
thread layout (rust/sglang-server/src/lib.rs#L1-L12, utils/runtime.rs#L1-L15); `Server::start` passes
`None` as the HTTP layer (lib.rs#L182-L199); three merged modules, TODO(auth) comment, registry
mounted on the API listener (api_server/http/app.rs#L77-L104); health 503 until warm-up (app.rs#L31-L55,
native_api.rs#L116-L145); no `/metrics`, `/ping` or `/invocations` under `rust/` (grep; `/embedder` at
utils/runtime.rs#L632 is inside `#[cfg(test)]`); Rust-mode bootstrap alias, refusal and log text
(arg_groups/pd_disaggregation_hook.py#L157-L158, #L251-L286), `prefill_complete` refusal (#L242-L248);
`vllm-project/router` README L339 at v0.1.16 calls itself a fork of the SGLang Model Gateway (fetched
with `gh api`); `VLLM_USE_RUST_FRONTEND` default 0 at vLLM v0.31.0 `vllm/envs.py#L1439-L1443`; section 19
keeps `SGLANG_RUST_SERVER` unset (AwsManagedPaths.tsx L535-L544).

Cross-section agreement: the tab says the gateway routes from its own tree and open-request count
and never asks a worker, which matches fc08 (the mesh does not share cache-aware trees; the tab makes
no mesh claim). Section 18's `launch_router` metrics bind (fc09, 0.0.0.0 by default) now agrees with
G3. Security readings keep their labels: the gateway's public group ("Read from code, not run.",
stop 3), the Rust frontend's missing auth layer ("Read from code, not run.", after stop 11), and the
per-model policy path ("Read from source, not run"). The bootstrap registry's missing key check is in
tab 5 and stays labelled there.

Build-log row settled: 6 gateway stops and 5 Rust stops; the `cache_aware.rs` header comment versus
code conflict holds and is cited as `doc-code-conflict` with the code side named; Rust-mode prefill
serves the registry on its API port (pd_disaggregation_hook.py#L251-L286, app.rs#L95-L104).

Score: **9/10**. The two-input routing model and the in-process Rust frontend are each a short,
pinned reading path, and both checks end on what to run. Fixes aligned the vLLM contrast and the
launcher defaults with sections 3, 18 and 23; no diagram.

## Checks

- `pnpm --filter @tech-deep-dives/sglang typecheck`: exit 0 (`tsc --noEmit`, no output).
- `pnpm --filter @tech-deep-dives/sglang lint`: exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no output).
- `bash scripts/gates/no-ai-tells.sh`: PASS. `bash scripts/gates/pinned-refs.sh`: PASS.
  `bash scripts/gates/svg-a11y.sh`: PASS.
- No diagram in any of the three files, so the harness was not run.

## Items for other owners (not edited)

- None new. fc07's item for this group (tab 5 registry count) is applied as P6.
