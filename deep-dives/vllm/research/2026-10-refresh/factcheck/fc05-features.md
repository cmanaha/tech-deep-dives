# fc05-features: fact-check of SpeculativeDecoding.tsx, OpenAICompatServer.tsx and LoRAServing.tsx

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new, docs at
/tmp/vllm-new/docs, release notes at /tmp/vllm-release-notes. Fetched at their tags from
raw.githubusercontent.com: vLLM v0.21.0, v0.22.1, v0.27.0 and v0.28.0
`docs/features/speculative_decoding/README.md`; v0.27.0 `vllm/config/speculative.py`; v0.27.0,
v0.28.0 and v0.29.0 `vllm/config/scheduler.py`; Gateway API Inference Extension v1.6.2
`docs/proposals/003-model-server-protocol/README.md`. Fetched live: the Inference Extension project
site. Read 2026-10-17.

Abbreviations: `V/` = `https://github.com/vllm-project/vllm/blob/v0.31.0/`,
`SD/` = `V/docs/features/speculative_decoding/`.

Harness: not run. No diagram was changed (the only edits near a diagram are the caption under
`EndpointSurfaceDiagram` and an Alert-to-ExpandableSection swap in LoRAServing).

## Checks the orchestrator asked for

**Admission control HTTP 503.** CONFIRMED end to end. `AsyncLLM.check_admission` raises
`QueueOverflowError` (`current + n > max_num_queued_reqs`) or `MaxQueuedTokensError`
(`current_tokens >= max_num_queued_tokens`) and logs both lines at INFO
(`V/vllm/v1/engine/async_llm.py#L309-L365`); both subclass `GracefulHTTPError` with
`HTTPStatus.SERVICE_UNAVAILABLE` (`V/vllm/exceptions.py#L148-L175`); `create_error_response` maps any
`GracefulHTTPError` to its own `http_status` (`V/vllm/entrypoints/serve/exception_handling/error_response.py#L37-L40`);
the serving path calls `check_admission(n)` (`V/vllm/entrypoints/generate/base/serving.py#L186`). Fields
absent at v0.27.0 and v0.28.0, present at v0.29.0 (scheduler.py at each tag). Rust frontend declares
both flags `Unsupported`, which fails argument parsing (`V/rust/src/cmd/src/cli/unsupported.rs#L21-L35`,
`#L366-L375`). Matches the Cross-file facts block and OperationsFailureModes / ObservabilityBench.

**Speculative methods: V1 runner versus MRv2.** CONFIRMED. With `VLLM_USE_V2_MODEL_RUNNER` unset,
`use_v2_model_runner` returns False when `_get_v2_model_runner_unsupported_features` is non-empty
(`V/vllm/config/vllm.py#L752-L761`). That list holds `ngram`, `ngram_gpu`, `suffix`, `medusa`,
`mlp_speculator`, `custom_class`, and `parallel_drafting` for any method other than `dflash` and
`dspark` (`#L3073-L3092`). V1-unsupported (so MRv2 only): `dspark`, adaptive verification,
mixed sliding/full DFlash drafts, DFlash candidate-head drafts (`DFlash2DraftModel`,
`LiLiCorrDraftModel`) (`#L3105-L3141`, `#L763-L788`). MRv2 `init_speculator` has speculators for
extract_hidden_states, dflash (LiLiCorr, DFlash2, plain), dspark, Gemma 4 MTP, multi-module MTP, MTP,
EAGLE family and plain draft model (`V/vllm/v1/worker/gpu/spec_decode/__init__.py#L8-L70`). Every
"Runs on" badge in the methods table matches.

**Speedup figures.** No numeric speedup figure appears in any of the three files. Two qualitative
performance claims were stated as fact and are now attributed (S1, O1); the one "likely faster"
claim in LoRAServing already carries "the project's guidance, not a measurement".

## SpeculativeDecoding.tsx

Claims checked: 71. CONFIRMED: 66. OVERREACH: 2. UNSUPPORTED: 2. Plus one prose fix.

CONFIRMED (summary): lossless quotes and three-part guarantee (`V/docs/features/speculative_decoding/README.md#L193-L224`);
V1 sampler docstring cites arXiv:2211.17192 and has no `block` branch (`V/vllm/v1/sample/rejection_sampler.py#L45-L96`);
arXiv 2211.17192 and 2403.10444 titles (arxiv.org); `rejection_sample_method` default and values,
`draft_sample_method` greedy default (`V/vllm/config/speculative.py#L85-L86`, `#L530-L536`, `#L601-L607`);
synthetic acceptance `u < rate` (`V/vllm/v1/worker/gpu/spec_decode/rejection_sampler_utils.py#L584-L588`);
v0.22.1 and v0.27.0 docs list `strict`, `probabilistic`, `synthetic` with `strict` default, v0.27.0 code
accepts `standard`, `synthetic`, `block` (tag fetches; v0.28.0 docs already list `standard`); method
literals (`#L39-L84`); every gain cell against the docs table (`SD/README.md#L30-L41`); DFlash parallel
drafting and aux hidden states (`#L1462-L1463`, `V/vllm/v1/worker/gpu/model_runner.py#L272-L283`);
LiLiCorr needs MRv2 and K = block size minus 1 (`SD/lilicorr.md#L3-L18`); DSpark subclasses
`DFlashSpeculator` (`V/vllm/v1/worker/gpu/spec_decode/dspark/speculator.py#L40`); MLP speculator lands on V1,
whose dispatch has no branch for it (`V/vllm/v1/worker/gpu_model_runner.py#L617-L676`); suffix docs
(`SD/suffix.md#L1-L9`); custom proposer (`SD/README.md#L47-L55`); MRv2 default and v0.32 removal target
(`/tmp/vllm-release-notes/v0.29.0.md` L9, L18-L22); runner selection (above); fallback log text
(`vllm.py#L752-L759`); DSD docs (`SD/dynamic_speculative_decoding.md#L5`, `#L14-L33`, `#L40`, `#L74-L76`),
schedule field and scheduler lookup (`speculative.py#L491-L497`, `V/vllm/v1/core/sched/scheduler.py#L292-L299`),
DP disable and V1 piecewise override (`vllm.py#L1064-L1100`); adaptive verification docs
(`SD/adaptive_verification.md#L3-L15`, `#L19`, `#L35-L39`), docstring (`speculative.py#L552-L554`),
estimator in `DraftModelSpeculator` (`V/vllm/v1/worker/gpu/spec_decode/speculator.py#L103`, `#L171-L255`),
v0.30.0 notes #52228; config keys, n-gram and suffix defaults (`speculative.py#L1189-L1208`, `#L506-L524`,
`SD/README.md#L83-L135`, `#L178-L185`); `tensor_parallel_size` rejected (`speculative.py#L1807-L1811`);
draft PP placement on both runners (`model_runner.py#L272-L274`, `gpu_model_runner.py#L601-L604`), v0.30.0
PP notes, docs `vllm<=0.15.0` note; draft TP rules (`speculative.py#L1706-L1737`,
`V/vllm/v1/spec_decode/draft_model.py#L63-L78`); TLI rules and V1-only wiring (`speculative.py#L1848-L1862`,
`draft_model.py#L37-L58`; no hit for `heterogeneous_vocab` or `VocabMapping` under `vllm/v1/worker`);
Gemma 4 assistant as MTP (`SD/mtp.md#L12-L27`); per-request metrics (`V/vllm/config/observability.py#L48-L58`,
`SD/acceptance_metrics.md#L9-L38`, `#L60-L90`); PromQL (`V/vllm/v1/spec_decode/metrics.py#L185-L190`);
`examples/features/speculative_decoding/spec_decode_offline.py` exists. Cross-file: MRv2 / V1 runner
naming matches.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| S1 | "Model-based methods ... give the largest latency reduction. N-gram and suffix ... give modest speedups" | SpeculativeDecoding.tsx:491-495 | OVERREACH (docs' qualitative rating stated as fact) | `SD/README.md#L9` ("provide the best latency reduction") | "The docs rate model-based methods ... as giving the best latency reduction, and n-gram and suffix decoding ... as giving modest speedups" |
| S2 | "rates every method's high-QPS gain medium or better" | :664-665 | OVERREACH | `SD/README.md#L39`: Custom Proposer is "Varies" | "rates no method's high-QPS gain below medium" |
| S3 | "Code, structured or JSON output, and repetitive or templated text are predictable" | :634-636 | UNSUPPORTED (no source) | `SD/suffix.md#L7` names code editing, agentic loops, RL rollouts as high-repetition | Narrowed to repetitive output, cites the suffix docs |
| S4 | Adaptive verification "needs MRv2, full CUDA graphs, no LoRA and PP 1" | :714-718 | UNSUPPORTED (cited L3151-L3178 does not carry the MRv2 requirement) | `vllm.py#L3130-L3131` | Cite range widened to L3127-L3178 |
| S5 | "K is a ceiling, not a constant" | :379 | Prose (negative-definition tic) | Section Shape rule 4 | "K is a ceiling:" |

Section Shape: no block fails both tests. The one block that only restates earlier text, "Lossless,
restated for the skeptic", is already an ExpandableSection. "Check configs copied from older docs"
passes on the practical axis (a v0.27.0-era config with `strict` fails validation at v0.31.0). The
"It helps when / It hurts when" columns half-restate the paragraph above but add drafter matching and
draft-model memory, so they stay.

Score: **8/10.** Every runner, default and flag matches the pin, and the qualitative performance
ratings now read as the docs' ratings. Held from 9 by length (about 1.4x the pre-revamp page) and the
adaptive-verification docs-versus-code chain, which sits inline where rule 7 would put it in a
disclosure.

## OpenAICompatServer.tsx

Claims checked: 81. CONFIRMED: 76. UNSUPPORTED: 3. WRONG: 1. OVERREACH: 1.

CONFIRMED (summary): docs opening line (`V/docs/serving/online_serving/openai_compatible_server.md#L3`);
deprecated launcher text "Please use `vllm server`" (`V/vllm/entrypoints/openai/api_server.py#L50-L59`),
`serve` subcommand (`V/vllm/entrypoints/cli/serve.py#L49`); task-gated registration and dev-mode gate
(`V/vllm/entrypoints/launchers/api_server/routers.py#L34-L67`); every route in the diagram and the 19-row
table against the decorators (grep of `@router.*` under `vllm/entrypoints`); batch limits
(`V/vllm/entrypoints/openai/chat_completion/protocol.py#L1029-L1043`, `#L1102-L1137`); Responses store
(`V/vllm/entrypoints/openai/responses/serving.py#L155-L166`, `#L337-L344`, `#L1119-L1149`); `/tokenizer_info`
gate (`V/vllm/entrypoints/serve/tokenize/api_router.py#L86-L90`); scale-out gating
(`V/vllm/entrypoints/scale_out/factories.py#L65-L94`, `V/vllm/entrypoints/launchers/cli_args.py#L199-L210`);
security guide versus code on pause/resume/weights (`V/docs/usage/security.md#L198-L209`,
`V/vllm/entrypoints/serve/__init__.py#L43-L69`); Cohere gate (`V/vllm/entrypoints/cohere/api_router.py#L295-L309`);
API key prefix test and 401 (`V/vllm/entrypoints/serve/middleware/authenticate.py#L11`, `#L47-L62`);
help-text quote (`cli_args.py#L317-L327`); Rust frontend switch, routes, key prefixes, unsupported and
no-op flags (`V/vllm/envs.py#L1441-L1443`, `V/rust/src/server/src/routes.rs#L83-L158`,
`V/rust/src/server/src/middleware/auth.rs#L16`, `unsupported.rs#L21-L82`, `#L366-L447`); structured
outputs (`V/docs/features/structured_outputs.md#L3-L40`, `#L64`, `#L88-L119`, `#L213-L216`, single backend
from the first request `V/vllm/v1/structured_output/__init__.py#L125-L165`); tool calling
(`V/docs/features/tool_calling.md#L86-L155`, `V/vllm/tool_parsers/__init__.py#L24-L189`,
`V/vllm/tool_parsers/structural_tag_registry.py#L124-L146`, `cli_args.py#L128-L134`, `envs.py#L1805-L1808`);
multimodal (`V/vllm/entrypoints/chat_utils.py#L1716-L1721`, `V/vllm/config/model.py#L199-L203`,
`V/vllm/entrypoints/generate/base/protocol.py#L52-L77`, security.md L292-L303); extra parameters and the
priority conflict (`protocol.py#L267-L275`, `#L330`, `#L381-L390`, `#L456-L488`; no priority check found
outside field descriptions; `V/vllm/v1/core/sched/request_queue.py#L75-L84`, `#L200-L207`;
`V/vllm/entrypoints/generate/base/serving.py#L47`, `#L277-L288`); generation-config and X-Request-Id
(`openai_compatible_server.md#L72-L75`, `V/vllm/entrypoints/serve/middleware/x_request_id.py#L30-L33`);
admission control (above) and its sizing docstrings (`V/vllm/config/scheduler.py#L93-L124`). Cross-file:
503 and no-429 wording matches the Cross-file facts block.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| O1 | OpenAI JS client, LangChain, LlamaIndex, LiteLLM "work without adapters"; "vLLM competes on throughput and cost per token" | OpenAICompatServer.tsx:483-487 | UNSUPPORTED (cited docs page names only the OpenAI Python client and makes no cost claim) | `openai_compatible_server.md#L166-L167`; `docs/serving/integrations/langchain.md` uses LangChain's own `VLLM` class | Narrowed to the official OpenAI Python client plus other `/v1/chat/completions` client code; cost claim removed; unused `SERVER_DOCS` removed |
| O2 | Diagram caption: profiler and LoRA routes are the ones left out | :547-556 | OVERREACH (fault-tolerance routes, `/kv_event_sources`, `/is_scaling_elastic_ep` also absent) | `routers.py#L69-L74`, `V/vllm/entrypoints/serve/instrumentator/basic.py#L59`, `V/vllm/entrypoints/serve/elastic_ep/api_router.py#L83` | Caption says "Main routes", adds fault-tolerance routes with a cite and names the two status routes |
| O3 | "A chat template is usually needed too" | :831-833 | WRONG | `tool_calling.md#L166-L170`: `--chat-template` is optional; Hermes, Mistral and Llama ship tool-compatible templates | "`--chat-template` is optional: pass one when the model's own template does not handle tool-role messages and earlier tool calls" |
| O4 | `required` "(as of vllm >= 0.8.3)" | :848 | UNSUPPORTED (cited L86-L101 does not carry it; it sits at L3) and no practical value at v0.31.0 | `tool_calling.md#L3` | Version parenthetical removed |
| O5 | Incompatibility table cites README L9-L14 for `image_url.detail` | :1144 | UNSUPPORTED (README carries `suffix` and `user` only) | `openai_compatible_server.md#L173` | Added that cite |

Score: **8/10.** Routes, auth scope, admission control and tool-calling rules all match the code. Held
from 9 by density: the route diagram and the 19-row route table cover the same inventory, and the
server-side multimodal control bullets carry no inline cites.

## LoRAServing.tsx

Claims checked: 60. CONFIRMED: 58. WRONG: 1. Plus one prose fix and one Section Shape move.

CONFIRMED (summary): A and B shapes and slot buffers (`V/vllm/lora/layers/base_linear.py#L111-L154`),
slot count is `max_loras` (`V/vllm/lora/model_manager.py#L340-L350`); scheduler `max_loras` skip
(`V/vllm/v1/core/sched/scheduler.py#L911-L922`); every default and help text (`V/vllm/config/lora.py#L27-L52`,
`#L119-L127`, `#L139-L142`; `V/vllm/engine/arg_utils.py#L1541-L1562`); Punica docstring and kernels
(`V/vllm/lora/punica_wrapper/punica_gpu.py#L1-L37`); no-LoRA index -1 and early exit
(`V/vllm/lora/punica_wrapper/utils.py#L35-L39`, `V/vllm/lora/ops/triton_ops/lora_kernel_metadata.py#L117-L123`);
adapter name and path in block hash (`V/vllm/v1/core/kv_cache_utils.py#L567-L584`, `#L635`); MRv2 LoRA
capture cases and LoRA absent from the V1-fallback list (`V/vllm/v1/worker/gpu/lora_utils.py#L20-L35`,
`vllm.py#L3051-L3103`); adaptive verification refused with LoRA (`vllm.py#L3151-L3161`); `/v1/models`
cards (`V/vllm/entrypoints/openai/models/serving.py#L149-L165`); rank and bias rejection
(`V/vllm/lora/peft_helper.py#L123-L136`); LRU paging (`V/vllm/lora/worker_manager.py#L291-L327`); runtime
env var parse, routes, warning text, api_server_count guard and default (`envs.py#L1199-L1203`,
`V/vllm/entrypoints/serve/lora/api_router.py#L23-L99`, `serve.py#L105-L127`, `#L304-L307`); load-request
checks and same-path warning (`models/serving.py#L215-L229`, `#L247-L275`); resolver dispatch and plugin
loading (`V/vllm/entrypoints/serve/engine/serving.py#L49-L71`, `V/vllm/plugins/__init__.py#L56-L64`,
`V/vllm/plugins/lora_resolvers/filesystem_resolver.py#L49-L61`, `hf_hub_resolver.py#L129-L145`,
`pyproject.toml` L47-L48); LoRA docs quotes (`V/docs/features/lora.md#L88-L90`, `#L109-L110`,
`#L163-L232`, `#L446-L475`); gauge definition, labels, same-key lists, DP warning
(`V/vllm/v1/metrics/loggers.py#L983-L1001`, `#L1099-L1111`, `V/vllm/v1/metrics/stats.py#L613-L645`);
Inference Extension v1.6.2 protocol L37-L57 and project-site quotes (fetched). Cross-references to
sections 6, 12, 17, 20 and the Codebase tab (`add_lora_linear`, `--fully-sharded-loras` present in
CodebaseModelLayer.tsx) resolve.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| L1 | `--lora-modules {name}={path}`, "repeated per adapter" | LoRAServing.tsx:430 | WRONG | `LoRAParserAction` builds a fresh list and `setattr`s it on every occurrence (`V/vllm/entrypoints/launchers/cli_args.py#L35-L66`); argparse replica: `--lora-modules a=/p/a --lora-modules b=/p/b` yields only `b` (/tmp/fc05-scripts/lora_args.py); docs form is one flag, many entries (`lora.md#L55`) | "one flag, then one entry per adapter, because a repeated `--lora-modules` replaces the list the earlier one built"; cites cli_args.py L35-L66 and lora.md L55 |
| L2 | "How a load then reaches each data-parallel rank was not traced for this page" | :693-694 | Prose (page-history voice) | COMMON rule 4 | "then confirm on your deployment that a runtime load reaches every data-parallel rank" |
| L3 | Alert "The kernels behind the mixed batch" | :354-365 | Section Shape: fails both tests (class and kernel names change nothing the reader does; its one model sentence repeats the paragraph above and the diagram) | Section Shape standard, governing test | Moved into an ExpandableSection, content unchanged |

Section Shape: L3 is the only block that fails both tests. The decision table's first three rows
restate earlier blocks, but the table as a whole is the fit decision and passes the practical test.

Score: **8/10.** Defaults, slot cost, scheduler gating, runtime-load rules and the gateway gauge all
match the pin. Held from 9 by length (about 1.4x the pre-revamp page) and the decision table's
restated rows.

## Open items for the orchestrator (not fixed: they would add new claims)

- LoRA runtime load under data parallelism: with one API server and internal load balancing,
  `DPLBAsyncMPClient.call_utility_async` sends `add_lora` to every engine and returns the first result
  (`V/vllm/v1/engine/core_client.py#L1642-L1651`, `V/vllm/v1/engine/async_llm.py#L1128-L1130`). The page
  could state that in place of the "confirm on your deployment" hedge.
- MLP speculator is likely unusable at the pin, beyond the page's "test before relying on it": the
  `MLPSpeculatorPreTrainedModel` registry entry is commented out as "Temporarily disabled"
  (`V/vllm/model_executor/models/registry.py#L705-L707`) and the V1 dispatch raises
  "Unknown speculative decoding method" (`V/vllm/v1/worker/gpu_model_runner.py#L672-L676`). Not run.
- Resolver docs versus code: the LoRA docs say to set `VLLM_PLUGINS` to include
  `lora_filesystem_resolver` (`lora.md#L166`); the code loads every installed plugin when `VLLM_PLUGINS`
  is unset. The page states the code behaviour without a `doc-code-conflict` marker.

## Checks

```
pnpm --filter @tech-deep-dives/vllm typecheck   -> tsc --noEmit, exit 0
pnpm --filter @tech-deep-dives/vllm lint        -> eslint src --ext .ts,.tsx --max-warnings 0, exit 0
bash scripts/gates/no-ai-tells.sh               -> [PASS] no AI tells in 2 opted-in deep dive(s)
bash scripts/gates/pinned-refs.sh               -> [PASS] all GitHub references pinned across 95 file(s)
```
