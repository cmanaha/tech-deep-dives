# fc10-eco: fact-check of NvidiaDynamo.tsx, GatewaysAppLayer.tsx and ObservabilityBench.tsx

Status: DONE. Fixes applied; typecheck, lint and the static gates pass; the one touched diagram
(`MetricsPipelineDiagram`) re-verified with the harness (0 overlaps/clipping at 1440 and 390,
both PNGs read).

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new.
External pins: Dynamo `v1.5.1` (tag commit 2093662a4d4e5fd318732935213dde08dc7be818, published
2026-10-07), inference-perf `v0.7.0` (2026-09-15), GuideLLM `v0.8.1` (2026-10-08), Ray
`ray-2.59.0`, llm-d `v0.10.0`, vLLM `v0.28.0` (to test what Dynamo's pin implies), LiteLLM
releases via the GitHub releases API and PyPI JSON. Read 2026-10-18.
Line numbers in the "file:line" column are post-fix.

## NvidiaDynamo.tsx

Claims checked: 58. CONFIRMED 55, WRONG 1, OVERREACH 2.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| D1 | "At v1.5.1 its core capabilities are" six named components | NvidiaDynamo.tsx:303 | WRONG (list stated as complete; README table has eight rows, adding AISimulate and Fault Tolerance) | https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md#L100-L107 | "are" -> "include" |
| D2 | "That is why the same components work over SGLang and TensorRT-LLM" | NvidiaDynamo.tsx:372 | OVERREACH (README feature matrix marks KVBM in progress for SGLang) | https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md#L64-L69 | Narrowed to "also run over SGLang and TensorRT-LLM, with KVBM still marked in progress for SGLang", cited README L64-L69 |
| D3 | "Hardware caveat: Dynamo is written for NVIDIA GPUs"; its value (NIXL transport, NVLink-class KV movement, GPU-capacity planning) is NVIDIA-only; look elsewhere "on non-NVIDIA accelerators" | NvidiaDynamo.tsx:671, 677 | OVERREACH (v1.5.1 ships Intel XPU vLLM templates: aggregated, disaggregated with NixlConnector, KV router, planner; container/context.yaml builds an XPU vLLM image) | https://github.com/ai-dynamo/dynamo/blob/v1.5.1/examples/backends/vllm/deploy/xpu/README.md#L6-L33 ; https://github.com/ai-dynamo/dynamo/blob/v1.5.1/container/context.yaml#L91-L99 | Header now "the default install targets NVIDIA GPUs"; body scoped to the pip install (`nixl[cu13]`), one sentence added on the XPU templates with citation; bullet now "an accelerator Dynamo does not target, such as AWS Neuron" |

Confirmed, summarised: README L36 quotes (three), Apache-2.0 (README badge L20, pyproject L12),
three LLM backends (README L64), GTC 2025 launch and all launch-blog quotes (Smart Router,
Distributed KV Cache Manager, Planner, disaggregation, NIXL definition; blog dated
2025-03-18), README L100-L105 component quotes, KV events over ZMQ (dynamo args.py L347-L354,
Dynamo KV routing overview L18), vLLM kv_events.py L10-L25 and L14 default false,
tiering/factory.py tiers, `DynamoConnector(KVConnectorBase_V1)` at kvbm dynamo_connector.py
L44, `ai-dynamo[vllm]` pins `nixl[cu13]==1.3.2` and `vllm[flashinfer,runai,otel]==0.28.0`
(pyproject L61-L64; the CUDA 13 container also uses `vllm/vllm-openai:v0.28.0-ubuntu2404`),
vLLM NIXL code (connector.py L407-L408 alias, factory.py L176-L192, pull READ L552-L559, push
WRITE L714-L721, UCX default base_worker.py L559-L561, kv_both warning L94-L100), llm-d blog
quotes (2025-05-21), vLLM llm-d doc L13, GAIE/EPP quote README L126 and flow L129, llm-d
v0.10.0 notes (llm-d-autoscaling rename, WVA guides deprecated, llm-d-kv-cache moved into
llm-d-router, vLLM v0.30.0 image, no mention of Dynamo), README L60 quote,
`--disaggregation-mode` (backend_args.py L120-L128), prefill `ValueError` without
`--kv-transfer-config` (args.py L249-L264), Dynamo assigns no kv_role (only error-message
strings carry `kv_both`), disagg.sh L32-L51 passes `kv_both`, #43874 in v0.23.0 notes, vLLM
config doc L56-L73 (events, `--no-router-kv-events`, `--load-aware`), args.py L465-L484,
three minor releases behind, #51875 in v0.29.0 notes and kv_cache_utils.py L131-L144,
Dynamo KV routing overview L117 (`PYTHONHASHSEED=0`), Ray `vllm[audio]==0.27.0` at
llm-requirements.txt L2, Dynamo EFA doc (P5 and P6 families). What the 0.28.0 pin implies was
checked at the v0.28.0 tag: `NixlPullConnector` / `NixlPushConnector` and the fs / p2p / obj
offload tiers already exist there, so the only post-0.28.0 behaviour the page relies on is the
deterministic sha256 seed, which the page already handles. No vendor performance number
appears on the page (the README's "2x faster TTFT" and "7x" figures are not quoted).

Score: 9/10. Every load-bearing claim now traces to a pinned Dynamo, vLLM, Ray or llm-d
source; the version-pin alert lands last as the reader's next action. One point off for a
dense capability table and the "(now the KV-Aware Router)" name mapping, which is kept on
purpose for readers of the 2025 launch material.

## GatewaysAppLayer.tsx

Claims checked: 36. CONFIRMED 32, WRONG 1, OVERREACH 1, UNSUPPORTED 2.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| G1 | "the entire OpenAI-ecosystem tooling stack snaps in front of it" | GatewaysAppLayer.tsx:150 | OVERREACH (universal claim; nothing on the page or in the vLLM docs covers every OpenAI tool) | docs/serving/openai_compatible_server.md (v0.31.0) | "OpenAI-ecosystem tooling snaps in front of it" |
| G2 | "Everything below bolts on through the OpenAI wire contract" | GatewaysAppLayer.tsx:170 | WRONG (the section's own Claude Code path uses Anthropic Messages, `/v1/messages`) | /tmp/vllm-new/docs/serving/integrations/claude_code.md#L13 ; vllm/entrypoints/anthropic/api_router.py#L51-L52 | "through a wire contract vLLM already serves (OpenAI's, or Anthropic Messages for Claude Code)" |
| G3 | Table: gateway adds "virtual API keys, request logging ... as LiteLLM describes its proxy" (no citation) | GatewaysAppLayer.tsx:211-221 | UNSUPPORTED (the cited vLLM litellm.md L3-L12 lists retries/fallbacks and budgets/rate limits only; attribution sat in the sentence with no link) | https://docs.litellm.ai/docs/simple_proxy (virtual keys, spend tracking, logging, retries/fallbacks, one endpoint for 100+ providers) | Sentence attribution removed; `LiteLLM docs: AI Gateway` citation added |
| G4 | "first clean release ... is v1.83.0 (March 30, 2026)" | GatewaysAppLayer.tsx:397 | UNSUPPORTED (the advisory gives no release date; it announces v1.83.0 in an "Update (March 30)" banner; PyPI shows the upload at 2026-03-31T05:08Z) | https://docs.litellm.ai/blog/security-update-march-2026 ; https://pypi.org/pypi/litellm/1.83.0/json | "v1.83.0, announced in the advisory's March 30 update" |

Confirmed, summarised: HTTP 503 past `--max-num-queued-reqs` (config/scheduler.py L93-L120),
vLLM litellm.md L3-L12, L41-L48 (quote), L63-L71 (`HOSTED_VLLM_API_BASE`), code sample matches
the doc, open-webui.md L19-L40, langchain.md L11-L27, llamaindex.md L11-L21, prefix caching on
by default (arg_utils.py L2926-L2962), Claude Code `ANTHROPIC_BASE_URL` and `/v1/messages`,
Codex `wire_api = "responses"` and `/v1/responses` (responses/api_router.py L48-L49), tool-call
flags in both agent docs, all six versioned docs.vllm.ai URLs return 200. LiteLLM incident,
checked against the advisory: 1.82.7 and 1.82.8, live from 10:39 UTC for about 40 minutes,
uploaded bypassing CI/CD, payload targets, non-LiteLLM exfiltration domain, Proxy Docker image
unaffected because it pins dependencies, 10:39 to 16:00 UTC exposure window, transitive
dependency via agent frameworks or MCP servers, `litellm_init.pth`, 1.82.6 or earlier
unaffected, "Rotate all secrets" first. Datadog: user systemd unit persistence, outbound
traffic and rebuild-from-known-good advice; tiers labelled (advisory tier 2, Datadog tier 3).
PyPI: no release between 1.82.6 and 1.83.0 other than the two bad ones. GitHub releases API:
v1.105.1 (2026-10-14) was the newest stable release on 2026-10-16 (v1.106.0 followed on
2026-10-18; the page dates its statement, so it is not stale).

Score: 8/10. Every quantitative claim is sourced, the security alert is tiered correctly and
ends on what to do. Held at 8 by the integration snippets for LangChain and LlamaIndex, which
the page itself labels illustrative and unverified against a framework version.

## ObservabilityBench.tsx

Claims checked: 57. CONFIRMED 53, WRONG 3, UNSUPPORTED 1.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| O1 | `/metrics` serves "every series prefixed `vllm:`" (text and diagram box) | ObservabilityBench.tsx:430, 86 | WRONG (the same registry carries prometheus-fastapi-instrumentator `http_*` series; the page itself later relies on `http_requests_total`) | vllm/entrypoints/serve/instrumentator/metrics.py#L64-L77 ; docs/design/metrics.md#L85-L95 | Text: "its own series, prefixed `vllm:`, next to the HTTP layer's `http_*` series"; diagram label "vllm: and http_* series" (harness re-run, 0 collisions) |
| O2 | h2 description "One /metrics endpoint feeds both the benchmark report and the live dashboard, which is why the two agree"; body "read from one source of truth"; SVG title "read the same numbers" | ObservabilityBench.tsx:421, 437, 32 | WRONG (`vllm bench serve` computes TTFT, ITL, TPOT and e2e from client timings; it reads `/metrics` only for spec-decode and diffusion counters; the page's own TPOT row says the two differ) | vllm/benchmarks/serve.py#L603-L633 ; vllm/benchmarks/lib/endpoint_request_func.py#L202-L261 ; vllm/benchmarks/serve.py#L1103-L1142 | Description now states the client-side report and server-side dashboard describe one run; body says bench serve computes its latency statistics from its own request timings (cited) and reads `/metrics` for spec-decode acceptance; SVG title matched |
| O3 | "A search of the v0.31.0 tree finds no ... `vllm:num_requests_swapped` or `vllm:cpu_cache_usage_perc`" | ObservabilityBench.tsx:480 | WRONG (wording: the tree's design doc lists both at L523-L524; no code emits any of the four) | docs/design/metrics.md#L520-L528 ; grep of vllm/ at the pin | "tree" -> "code" |
| O4 | inference-perf is "for cluster-scale benchmarking" and "the right tool when you benchmark a fleet behind a router" | ObservabilityBench.tsx:769, 777 | UNSUPPORTED (README L12 says "production-scale"; the fleet recommendation is our inference, not in the README) | https://github.com/kubernetes-sigs/inference-perf/blob/v0.7.0/README.md#L12 | "production-scale"; recommendation relabelled "Our reading: it fits a fleet behind a router better than a single replica." |

Confirmed, summarised: every Prometheus metric name exists at v0.31.0 with the stated type:
`vllm:time_to_first_token_seconds` L821, `inter_token_latency_seconds` L831,
`request_time_per_output_token_seconds` L841, `e2e_request_latency_seconds` L851,
`request_queue_time_seconds` L861, `num_requests_running` L508, `num_requests_waiting` L518,
`num_requests_waiting_by_reason` L528 (labels `capacity` / `deferred`, loggers.py L41-L42),
`kv_cache_usage_perc` L576, **`vllm:num_preemptions` L676-L680 (Counter, fed by
`num_preempted_reqs` at L1123)**, `request_num_preemptions` L901, `prefix_cache_queries/hits`
L599-L614 (tokens), `external_prefix_cache_queries/hits` L623-L642, `prompt_tokens` /
`generation_tokens` L685-L723 (prompt counter fed by total prompt tokens), all in
vllm/v1/metrics/loggers.py; `vllm:kv_offload_cpu_cache_usage_perc` (kv_offload/cpu/common.py
L10) and `vllm:kv_offload_tiering_backpressure_stores_dropped` (tiering/base.py L62),
`vllm:spec_decode_num_drafts/_num_accepted_tokens` (spec_decode/metrics.py L227-L231, formula
L177-L195), `vllm:tool_call_parser_invocations_total` (parser/metrics.py L15-L108, registered
only with `--tool-call-parser`, app_state.py L32-L37). TPOT formula and zero for one-token
requests (stats.py L560-L564, design/metrics.md L54, L68-L80); bench serve excludes them
(serve.py L624-L630); ITL one sample per output (stats.py L502-L504); `/metrics` mounted by
default (serve/__init__.py -> instrumentator/__init__.py); 503 for both admission errors
(exceptions.py L148-L175) and no `vllm:` rejection series anywhere in the tree; tracing span
attributes (tracing/utils.py L34-L44, set in output_processor.py L824-L835); OTLP off by
default and the `--collect-detailed-traces` warning (observability.py L36-L46, modules
`model|worker|all` L14); `--per-request-spec-decode-metrics` n = 1 and experimental (L48-L58);
example stack (prometheus.yaml L6-L10 targets :8000, grafana.json, dashboards/grafana and
/perses, opentelemetry dir). `vllm bench` subcommands at cli/benchmark/main.py L38-L46:
latency, mm-processor, serve, startup, sweep, throughput, help strings match. `vllm bench
sweep` modes at sweep/cli.py L19-L25: serve, serve_workload ("Explore the latency-throughput
tradeoff for different workload levels", default `--workload-var request_rate`), startup, plot,
plot_pareto; the page names serve_workload, plot and plot_pareto and does not claim the list is
complete. `vllm[bench]` extra (setup.py L1533) and pandas/matplotlib/seaborn imports;
benchmark_serving.py stub exits; `VLLM_USE_RUST_BENCH` exec and failure when the binary is
missing (main.py L23-L35, envs.py L580-L609); Rust README figures (about 7 ms startup, under
100 MB at 1400+ concurrency) are attributed as a project claim, not stated as fact. GuideLLM
v0.8.1: README L23, L29, L176 profile list, L131-L136 command, `guidellm run` registered in
src/guidellm/cli/__init__.py L53. inference-perf v0.7.0 README L29-L49. Cross-file facts: 503
admission control and recompute-only preemption match the REVAMP-PLAN block; production-stack
router legacy-name cross-reference matches ProductionStack.tsx.

Score: 9/10. Metric table, flags and tool commands are all verified at the pins, and the
telemetry section no longer promises agreement the code does not deliver. One point off for
the h1 description using "SLO" before the first paragraph expands it, and for a metrics table
long enough that the scale-out rows compete with the SLO rows for attention.

## Not resolved here

Nothing open in the three owned files. No problems found in orchestrator-owned files.
