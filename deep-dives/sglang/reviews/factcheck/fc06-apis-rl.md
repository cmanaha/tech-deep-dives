# Fact check fc06-apis-rl: sections 12 (Talking to SGLang: APIs, LoRA adapters and the admin plane) and 13 (SGLang as an RL Rollout Engine)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
vLLM baseline v0.31.0, read through `gh api repos/vllm-project/vllm/contents/<path>?ref=v0.31.0`.
AWS pages fetched 2026-10-24. Date 2026-10-24. Status: COMPLETE. No diagram was touched in either
file, so the harness was not run.

## Key matrix and security reading (owned by section 12), re-derived from code

Read from code, not run. Sections 17, 20 and 25 depend on this; every step holds at v0.5.22 and
section 12's matrix needed no correction.

1. **Levels.** `AuthLevel` has NORMAL, ADMIN_OPTIONAL and ADMIN_FORCE (`utils/auth.py#L20-L25`).
   A route without `@auth_level` resolves to NORMAL (`auth.py#L38-L59`). In `http_server.py`, 43
   handlers carry ADMIN_OPTIONAL (lines 882 to 1778); one of them, `/dumper/{method}`, is
   registered only with `DUMPER_SERVER_PORT=reuse` (`#L891-L894`). No route anywhere under
   `python/` uses ADMIN_FORCE (`elastic_ep.py#L16`, `#L77` are ADMIN_OPTIONAL too). The HiCache
   storage PUT, DELETE and GET routes simulate ADMIN_FORCE in the handler and return 400 when no
   admin key is set (`http_server.py#L1116-L1117`, `#L1148-L1149`, `#L1172-L1173`,
   `#L2180-L2199`, with a FIXME explaining why ADMIN_FORCE is not used).
2. **Policies** (`auth.py#L98-L151`). OPTIONS and paths starting `/health`, `/ready`, `/metrics`
   always pass (`#L98-L106`). ADMIN_FORCE: 403 without an admin key, else admin key only
   (`#L121-L126`). ADMIN_OPTIONAL: admin key if set, else API key if set, else open
   (`#L133-L143`). NORMAL: API key if set, else open, including the admin-key-only case
   (`#L148-L151`).

   | started with | NORMAL (inference, `/server_info`, `/ping`, `/invocations`) | ADMIN_OPTIONAL (43 admin routes) | ADMIN_FORCE (unused) |
   |---|---|---|---|
   | neither | open | open (HiCache storage routes 400 in handler) | 403 |
   | `--api-key` only | API key | API key (HiCache storage 400) | 403 |
   | `--admin-api-key` only | open | admin key | admin key |
   | both | API key (admin key refused) | admin key (API key gets 401) | admin key |

3. **Middleware install.** `add_api_key_middleware` runs only when `tokenizer_worker_num == 1`
   and some key is set (or an ADMIN_FORCE route exists, which none does)
   (`http_server.py#L2656-L2690`). Multi-tokenizer workers run uvicorn with the import string
   `sglang.srt.entrypoints.http_server:app` (`#L2838-L2848`) and never add it; each worker asserts
   `api_key is None` at start (`#L246-L249`). So in multi-tokenizer mode `--api-key` fails at
   start, `--admin-api-key` starts and is never checked, and the HiCache storage handlers pass
   their own check because a key is set: everything is open.
4. **`/server_info` leaks both keys.** `/get_server_info` (`#L837`) and `/server_info` (`#L847`)
   carry no `@auth_level` (NORMAL). The handler returns `redact_watermark_secrets({**build_server_info(...)})`
   (`#L847-L875`); `build_server_info` is `server_args.resolved_dict()` plus `launch_command`
   (`utils/common.py#L3640-L3650`); `resolved_dict` serializes every field of
   `record_fields(type(self))` through `resolution_result` with no exclusion
   (`server_args.py#L315-L330`, `arg_groups/arg_utils.py#L204-L210`,
   `arg_groups/overrides.py#L178-L192`); `Serving` is one of the collected namespaces
   (`server_args.py#L508-L549`) and holds `api_key` and `admin_api_key`
   (`arg_groups/fields/serving.py#L154-L161`); the redaction touches only `watermark_key`,
   `watermark_key_b` and `watermark_config` (`sampling/watermarking/core.py#L26-L104`).
   `launch_command` is redacted only for `--watermark-config` (`server_args.py#L701-L705`,
   `core.py#L106-L131`), so it also carries the key values. The docs say the admin key guards
   `/server_info` (`docs/docs/advanced_features/server_arguments.mdx#L1095`). Corroboration, not
   authority: the Rust frontend's `info.rs#L73-L77` comment states the raw scheduler state embeds
   both keys and allowlists its own `/server_info`.
5. **SageMaker row.** `/ping` (`#L2123-L2126`) and `/invocations` (`#L2129-L2137`) are NORMAL, so
   with only `--admin-api-key` they stay open and with `--api-key` both need a bearer token. AWS
   documents the health check as periodic `GET /ping` and names no way to attach a token, and
   states that SageMaker strips POST headers other than those `InvokeEndpoint` supports
   ([custom inference code](https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html)).
   `docker/serve#L4-L34` turns `SM_SGLANG_*` into flags. ContainerDefinition `Environment`:
   "Don't include any sensitive data in your environment variables"
   ([API reference](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ContainerDefinition.html)).
   The section carries the Environment note (build-log item from section 19 settled).
6. **Rust frontend.** `app.rs#L77-L90` merges `info`, `native_api` and `openai` routes with no auth
   layer; the only external layer hook (`HttpLayer`) is passed `None` from the Python launch path
   (`lib.rs#L170-L200` → `start_with_http_layer(..., None)`; `rust_server/server.py#L169-L173`).
   Routes: `/server_info`, `/get_model_info`, `/model_info`, `/generate`, `/health`,
   `/health_generate`, `/v1/completions`, `/v1/chat/completions`, `/v1/models`, plus the PD
   bootstrap registry when enabled. No admin route, no `/metrics`.

Observations for the orchestrator, not added to the page (each would be a new claim):
`docker/serve#L33` echoes the full launch command, key values included, to container stdout;
`/v1/responses` validates `model` against the served name and adapter names but builds its
requests with no `lora_path` (`serving_responses.py#L264-L290`, `#L521`, `#L2727-L2742`), so by
our reading a Responses request never runs an adapter; with `--api-key` on SageMaker,
`/invocations` would also fail, since the platform strips the `Authorization` header.

## ApiSurfaces.tsx (section 12)

Claims checked: 104. CONFIRMED: 88. WRONG 2, UNSUPPORTED 10, OVERREACH 2, prose 2.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | Docs health-check cite | ApiSurfaces.tsx:1191 | UNSUPPORTED (range) | docs/docs/basic_usage/native_api.mdx#L108-L110 | L106-L108 → L108-L110 |
| 2 | Chat `max_completion_tokens or max_tokens` cite | :691 | UNSUPPORTED (off by one) | entrypoints/openai/protocol.py#L1150 | L1149 → L1150 |
| 3 | "The native API is the one SGLang's own router and RL integrations speak" | :744 | UNSUPPORTED (no cite; register 07 B1 gives no RL evidence) | lang/backend/runtime_endpoint.py#L184-L189; sgl-model-gateway/src/server.rs#L545 | Narrowed to "frontend language and gateway", both cited; RL expansion moved to the admin table |
| 4 | `/configure_logging` changes log levels | :432 | UNSUPPORTED (outside L1186-L1263) | http_server.py#L1676-L1684; tokenizer_manager.py#L2411-L2415 | Added L1676-L1684 cite |
| 5 | `--enable-auto-tool-choice` is not defined | :811 | UNSUPPORTED (L376-L384 cannot show absence) | `grep -rn auto.tool.choice python/` empty | Reworded as a search of the Python source, cite kept as kind="code" |
| 6 | `delta.reasoning_content`, `separate_reasoning` docs | :843 | UNSUPPORTED (range) | docs/docs/advanced_features/separate_reasoning.mdx#L125-L186 | L99-L125 → L99-L186 |
| 7 | `GET /v1/responses/{id}` needs `--enable-response-store` | :903 | UNSUPPORTED (outside L296-L306) | serving_responses.py#L1581-L1586 | Added cite |
| 8 | Anthropic: "use strict thinking for a hard cap" | :920 | WRONG | anthropic/serving.py#L565-L640 (budget logged, not passed; no custom_params path in `entrypoints/anthropic/`); thinking_budget.mdx#L62-L93 | Now: no Messages field reaches strict thinking's per-request budget, so a hard cap needs the chat or native route (our reading, kind="code") |
| 9 | Eviction "by LRU" | :970 | OVERREACH | arg_groups/fields/lora.py#L70-L76 (`--lora-eviction-policy` lru default, fifo) | "LRU by default" + lora.py cite |
| 10 | Draft runs without the adapter, cited to a docstring | :1065 | UNSUPPORTED (comment only) | model_executor/model_runner.py#L821-L822 (`enable_lora and not self.is_draft_worker`) | Added code cite |
| 11 | "The OpenAI handlers split model ... the handlers do not check the model name" | :1102 | OVERREACH | serving_base.py#L40-L71 used by chat and completions; serving_responses.py#L272-L290 validates names | Narrowed to the chat and completions handlers |
| 12 | Python frontend registers all 43 admin routes on every server | :1144 | WRONG (1 of 43 conditional) | http_server.py#L891-L894 | "registers 42 of them on every server; the 43rd ... only with DUMPER_SERVER_PORT=reuse", cited |
| 13 | vLLM dev routes "checks no key on them" | :1281 | UNSUPPORTED (routers.py shows only the gate) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/middleware/authenticate.py#L11-L62 (guards /v1, /v2, /inference, /cohere only; dev routes are root-level) | Added cite, kind="code" |
| 14 | SageMaker: "the platform sends no token" | :501 | UNSUPPORTED (no source) | https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html#your-algorithms-inference-algo-ping-requests | Now "AWS documents the health check as a periodic GET /ping and names no way to attach a token" with the AWS cite; the code-reading hedge kept |
| 15 | `KV` unexpanded (admin table, only use) | :391 | Prose | Acronym standard | "KV (key-value) cache" |
| 16 | `EKS` first met unexpanded in the DLC cite label | :1269 | Prose | Acronym standard | Expansion moved into the label; deploy row keeps EC2 expansion |

Also strengthened without a verdict change: "Both keys are fields of that record" now cites
serving.py#L154-L161 next to server_args.py#L508-L549.

Build-log row 12 items: section 3's multi-tokenizer and Rust-frontend findings hold (steps 3 and
6 above); the `/server_info` exposure holds (step 4) and is written as a code reading, not run,
with the route, level and redaction lines cited; docs side cited at L1094-L1095; C15 is not on
the page; B19 (`--preferred-sampling-params` merged under each request,
`tokenizer_manager.py#L1548-L1567`) is CONFIRMED as written.

**Score: 8/10.** Every number, default and key-state claim traces to a pinned line, the strongest
number (128 tokens on `/generate`) lands three times, and the section ends on the client-seat
check. The fixes were mostly citation ranges and two scope errors (Anthropic hard cap, adapter
addressing on Responses); the LoRA and admin blocks remain long for their payoff.

## RlRollout.tsx (section 13)

Checked by a forked agent with the same procedure; parent re-read the lock code
(`tokenizer_control_mixin.py#L499-L591`: a paused server skips the writer lock, an unpaused one
waits on it) and the diff. Claims checked: 84. CONFIRMED: 66. WRONG 2, UNSUPPORTED 7, OVERREACH 8,
prose 1.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | "the pause is what lets that flush succeed" (intro, h2 description) | RlRollout.tsx:578, :590 | OVERREACH | tokenizer_control_mixin.py#L512-L520, #L575-L582: unpaused, the update takes the writer lock and waits for in-flight requests, so the flush can still succeed | "lets that flush succeed while requests are still queued" |
| 2 | Caption: without step 1 a queued request makes the flush fail with 400 | :600-602 | WRONG (our reading, not run) | tokenizer_manager.py#L942-L958 (reader lock per request); utils/aio_rwlock.py#L48-L71 (writer-preferring) | "each update call first waits for every in-flight request to finish (our reading of the lock code)" |
| 3 | Idle definition presented as complete | :663-665 | OVERREACH | managers/scheduler.py#L5168-L5215 | Added grammar queue, "among other checks"; cite L5168-L5215 |
| 4 | Writer lock for tensor and NCCL updates | :679 | UNSUPPORTED (range covered NCCL only) | tokenizer_control_mixin.py#L575-L582 | Cite L499-L529 → L499-L591 |
| 5 | checkpoint-engine transfer "over CUDA IPC" | :408 | UNSUPPORTED | checkpoint_engine_worker.py#L72-L90 (zmq handles only) | "handed over by IPC"; docs cite L24-L35 → L6-L35 |
| 6 | weight_sync gathers handles and sends via update_weights_from_tensor | :393, :761 | UNSUPPORTED (range) | weight_sync/utils.py#L67-L105 | Cites → L16-L105 |
| 7 | A raising bucket reports partial update | :811 | OVERREACH | model_runner_components/weight_updater.py#L330-L346 (distributed path only) | Prefixed "On the NCCL path" |
| 8 | `bmm` replaced | :997 | UNSUPPORTED (range) | batch_invariant_ops.py#L1026-L1029 | Cite → L1004-L1029 |
| 9 | Sampler forced to PyTorch | :1006 | OVERREACH | arg_groups/overrides.py#L989 (Ascend sampler kept) | Added "(an Ascend sampler is kept)" |
| 10 | Unset Blackwell backend is flashinfer (paragraph and expandable) | :1065, :1105 | OVERREACH | overrides.py#L1041-L1048 (DeepSeek family gets triton) | Narrowed to models outside the DeepSeek family |
| 11 | Every refit and memory route is an admin route | :1134 | UNSUPPORTED (range covered begin/end only) | http_server.py#L1265-L1553 | Cite widened |
| 12 | `--admin-api-key`: routes "accept only this key" | :459 | OVERREACH | http_server.py#L2656-L2690 (no middleware in multi-tokenizer mode) | "When set on a single-tokenizer server" |
| 13 | 34.35% in the flag table | :481 | UNSUPPORTED in the row | https://www.lmsys.org/blog/2025-09-22-sglang-deterministic/ | Added tier-2 LMSYS cite to the row |
| 14 | "only Miles tracks v0.5.22" | :1185 | OVERREACH | EcosystemUsers.tsx (Miles installs from its sglang-miles branch) | "only Miles starts from v0.5.22, and it then installs SGLang from its own branch" |
| 15 | Earlier-pinned frameworks must add the bracket | :1186 | OVERREACH | v0.5.21 release notes; scheduler_components/weight_updater.py#L138-L163 (disk needs no session) | "before it can refit a v0.5.22 server over tensors or NCCL" |
| 16 | vLLM routers.py L33-L36 | :1197 | WRONG (off by one) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/api_server/routers.py#L34-L37 | → L34-L37 |
| 17 | vLLM dev routes have no key check | :1194 | UNSUPPORTED | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/middleware/authenticate.py#L11-L62 | Added cite, kind="code" |
| 18 | `KV` unexpanded at first use (h1 description) | :554 | Prose | Acronym standard | Expansion moved to the h1 description |

Build-log row 13 items: 07 D12 confirmed (end-to-end latency; FlashInfer and FA3 rows average
34.35%; Qwen3-8B, TP 1, H200, three workloads of 256 requests, radix cache off, attributed as a
project claim); 07 D3 confirmed (Engine defines no pause or continue); FlashInfer turning the radix
cache off in deterministic mode confirmed (`attention_hook.py#L655-L663`, `choices.py#L247`), now
with the DeepSeek exception; `/update_weight_version` docs-vs-code conflict confirmed
(`io_struct.py#L2153`, `http_server.py#L1497-L1498`); the gateway has no weight-update route
(grep of `sgl-model-gateway/`).

**Score: 8/10.** Every figure is cited and pinned, the code-read hedges are kept, and the section
ends on next actions. The one real error was the caption's mental model (pause versus writer
lock), now corrected; the rest were citation ranges and scope.

## Checks

- `pnpm --filter @tech-deep-dives/sglang typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/sglang lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no errors.
- `scripts/gates/no-ai-tells.sh`, `pinned-refs.sh`, `svg-a11y.sh`: PASS.
