# fc01-framing: fact-check of ThesisAndFraming, InferenceWorkload, V1Architecture

Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read at `/tmp/vllm-new`
(`G/` = `https://github.com/vllm-project/vllm/blob/v0.31.0/`). Docs: `/tmp/vllm-new/docs`
(`D/` = `https://docs.vllm.ai/en/v0.31.0/`). Checked 2026-10-17. Line numbers in the
`file:line` column are pre-fix line numbers.

Forward-promise check: the h1 and first paragraph of sections 4 to 21 were read against what
these three sections promise (App.tsx order). Every promise is delivered: section 5 carries the
startup KV-capacity log line, section 7 covers CPU, disk and object-store tiers, section 8 covers
`--kv-cache-dtype`, sections 15 to 18 are Ray, Production-Stack, llm-d/KServe and Dynamo with the
same version pins, section 20 covers dashboards and load generators, section 21 is the Neuron
plugin, and the codebase tabs "Architecture & Module Map", "Execution & Attention" (runner
selection) and "The Rust Frontend" exist and cover what is cross-referenced.

## ThesisAndFraming.tsx

33 claims checked: 30 CONFIRMED, 1 WRONG, 1 OVERREACH, 1 UNSUPPORTED, plus 3 prose fixes.

CONFIRMED (30): pyproject description "high-throughput and memory-efficient inference and
serving engine" (`G/pyproject.toml#L22`); docs-home quotes "fast and easy-to-use", Sky Computing
Lab, "one of the most active", "over 2000 contributors" (`D/` = `docs/README.md#L26-L28`);
paged KV + continuous batching + chunked prefill + prefix caching + OpenAI server feature list
(`docs/README.md#L41-L61`); `VLLM_USE_RUST_FRONTEND` default 0 (`envs.py#L1441-L1443`); Rust
frontend launched with the same engine addresses (`serve.py#L344-L357`, binary name `vllm-rs`,
`envs.py#L578-L605`); `python -m vllm.entrypoints.openai.api_server` deprecated
(`api_server.py#L50-L56`); in-tree platforms cpu/cuda/rocm/xpu, TPU via `tpu_inference`
(`vllm/platforms/`, `tpu.py#L9-L20`); three endpoints (`chat_completion/api_router.py#L42`,
`completion/api_router.py#L36`, `pooling/embed/api_router.py#L29`); `AsyncLLMEngine = AsyncLLM`
(`async_llm_engine.py#L4-L7`); both runners named `GPUModelRunner`
(`gpu/model_runner.py#L184`, `gpu_model_runner.py#L479`); MRv2 fallback with warning
(`config/vllm.py#L700-L760`); MRv2 default and MRv1 removal targeted for v0.32
(`/tmp/vllm-release-notes/v0.29.0.md` L9, L18-L22); PagedAttention deleted
(`v0.25.0.md` L10, #47361); hash seed (`kv_cache_utils.py#L131-L144`, `cache.py#L144` sha256
default, #51875 in `v0.29.0.md` L15); `vllm --version` (`cli/main.py#L95-L97`); Dynamo 1.5.1
pins `vllm==0.28.0` (`ai-dynamo/dynamo@v1.5.1 pyproject.toml#L61-L64`); Ray 2.59.0 pins
`vllm[audio]==0.27.0` (`ray-2.59.0 llm-requirements.txt#L2`); llm-d v0.10.0 base image
`v0.30.0` (`gh release view v0.10.0 --repo llm-d/llm-d`); PyTorch Foundation release, "May 7,
2025", "An open and efficient inference engine for large language models", hosted project
(PR Newswire page, fetched 2026-10-17); V1-guide quotes and "To be added"
(`docs/usage/v1_guide.md#L5-L26`); nine minor releases v0.23.0 (2026-06-15) to v0.31.0
(2026-10-05) (`/tmp/vllm-releases.json`); section cross-refs 2, 3, 14, 15-18, 20, 21 (App.tsx).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| T-a | OpenAI server means client code points at vLLM "with only a base-URL change", cited to docs home | :70-75 | UNSUPPORTED | Docs home carries no such statement. Quickstart: "Modify OpenAI's API key and API base", and the call names the served model (`docs/getting_started/quickstart.md#L246-L263`) | Docs-home cite kept for the feature list; new clause "changing the base URL, the API key and the model name" cited to `D/getting_started/quickstart/` |
| T-b | "This deep dive quotes no single speedup multiplier" | :326 | WRONG (cross-file) | V1Architecture.tsx:292-298 quotes the launch post's "up to 1.7x" as a project claim | "The guide publishes no speedup multiplier: its performance benchmark is marked 'To be added'" |
| T-c | "like every code link in this dive, is pinned to the v0.31.0 release tag" | :333-336 | OVERREACH | `SpeculativeDecoding.tsx:443` links `blob/v0.27.0`, `AwsNeuron.tsx:36` links `blob/v0.24.0` (deliberate older-release citations) | "pinned to a release tag: v0.31.0 (commit db9527a4) unless the citation names an older release" |
| T-d | prose: "no longer needs from v0.29.0" (changelog voice) | :348 | prose | COMMON step 4 | "does not need from v0.29.0 on" |
| T-e | prose: "No per-token vendor pricing, no rate limits you do not set, no model deprecation" (definition by absence) | :179-180 | prose | Section Shape rule 4 | "You pay for accelerator time rather than per token, and you set the rate limits and the date a model retires." |
| T-f | prose: "GPU hours are the dominant cost of serving" (uncited universal) | :188 | prose (unsourced) | No source located; narrowed to what holds by construction | "A self-hosted endpoint pays by the accelerator hour." |

Score: **9/10**. Every quantitative and code claim now traces to a pinned line or a fetched
first-party page; StackDiagram (flex boxes) untouched. Holds at 9 rather than 10 because
"grew out of the PagedAttention research" rests on the docs home linking the paper rather than
a sentence saying so.

## InferenceWorkload.tsx

17 claims checked: 13 CONFIRMED, 3 WRONG, 1 OVERREACH.

CONFIRMED (13): prefill compute-bound / decode bandwidth-bound framing (conceptual, sibling dive
owns the roofline); V1-guide quote "a simple dictionary (e.g., `{request_id: num_tokens}`)"
(`docs/usage/v1_guide.md#L72-L77`); `vllm serve` budget 16384 / 8192 / 2048
(`arg_utils.py#L2858-L2887`, matches the cross-file facts block); chunked prefill rides on the
token budget (`docs/configuration/optimization.md#L49-L58`); four latency histograms
(`v1/metrics/loggers.py#L821-L859`); startup log line format (`kv_cache_utils.py#L2455-L2471`);
M = `max_model_len`, X = max concurrency (`kv_cache_utils.py#L2444-L2452`); scaling guide reads
those two numbers (`docs/serving/parallelism_scaling.md#L14-L20`); E2E formula; speculative
decoding exception (section 11); chain to sections 5, 7 (CPU, disk, object store), 8
(`--kv-cache-dtype`); disaggregation section 10; cross-refs 4, 5, 14, 20.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| W-a | SLO table: TTFT lever includes "Chunked prefill" | :27 | WRONG | Chunked prefill prioritises decodes and "improves inter-token latency (ITL)"; "Higher values [of max_num_batched_tokens] achieve better time to first token" (`docs/configuration/optimization.md#L57`, `#L64-L65`) | TTFT lever: "Prefix caching, a larger per-step token budget, more compute, shorter queue." |
| W-b | SLO table: ITL lever "larger batch (amortize weight reads)" | :34 | WRONG (internal) | Contradicts the section's own L263-265: "a bigger batch raises throughput but lengthens every participant's per-step latency"; docs: smaller budget gives better ITL (`optimization.md#L64`) | ITL lever: "Higher HBM bandwidth, chunked prefill with a smaller per-step token budget, speculative decoding."; one sentence under the table on the budget trade, cited to `D/configuration/optimization/#performance-tuning-with-chunked-prefill` |
| W-c | "The HBM not occupied by model weights and activations is the KV-cache budget" | :326-327 | OVERREACH | Budget = `total * gpu_memory_utilization` (default 0.92, `config/cache.py#L103`) minus non-KV memory (`v1/worker/utils.py#L539-L545`, `v1/worker/gpu_worker.py#L673-L677`) | "The share of HBM vLLM may use (`gpu_memory_utilization`), less the model weights and peak activations, is the KV-cache budget", with both code cites |
| W-d | PrefillDecodeTimeline: TTFT ends at the first token, yet the first decode bar is labelled "tok 1" | :509 | WRONG (diagram) | The prefill pass samples the first output token; the page's own E2E formula `TTFT + (output_len - 1) x ITL` assumes it | Decode bars relabelled "tok 2" to "tok 5". Harness: 0 overlaps / 0 clipping at 1440 and 390; both PNGs read |

Score: **8/10**. Corrected levers now agree with vLLM's tuning guide and with the section's own
latency-vs-throughput argument. Held at 8 by conceptual claims (roofline, "large fraction" of
memory lost to contiguous allocation) that defer to the sibling dive rather than carry a cite.

## V1Architecture.tsx

32 claims checked: 28 CONFIRMED, 2 WRONG, 2 OVERREACH, plus 2 prose fixes.

CONFIRMED (28): launch-post quotes, all re-read verbatim from the page HTML (CPU-overhead
sentence, "technical debt", "up to 1.7x higher throughput compared to V0 ( without multi-step
scheduling )", "comprehensive CPU overhead reductions", "focuses exclusively on the scheduler
and model executor", v0.6.0 ZeroMQ API server, "near-zero performance degradation", "less than
1% decrease"; `https://vllm.ai/blog/2025-01-27-v1-alpha-release`, dated January 27, 2025);
"We have fully deprecated V0." (`v1_guide.md#L5`); `LLMEngine` 7-line alias
(`engine/llm_engine.py#L1-L7`); `VLLM_USE_V1` absent (`grep -c` = 0 in `envs.py`); MRv2 default,
fallback, v0.32 removal (as Thesis); ZMQ (`docs/design/arch_overview.md#L71-L75`); msgpack
(`core_client.py#L705-L706`); API-server count default (`serve.py#L105-L128`); docs one worker
per GPU vs code `uni` on one GPU without DP (`config/parallel.py#L989-L1034`,
`uniproc_executor.py#L51-L75`); DP coordinator (`coordinator.py#L23-L57`,
`config/vllm.py#L868-L887`); six processes for `-tp=4` (`arch_overview.md#L103-L120`);
Rust frontend opt-in; client classes (`core_client.py#L95-L165`); chunked-prefill and CUDA-graph
quotes (`v1_guide.md#L39`, `#L43`); `enable_prefix_caching = True` (`cache.py#L142`); prompt
logprobs skip the cache (`v1_guide.md#L59-L62`, `sampling_params.py#L559-L566`,
`kv_cache_manager.py#L248-L262`; field settable from Python only, absent from
`vllm/entrypoints`); four Removed features (`v1_guide.md#L158-L190`); `best_of` ignored, DEBUG
log (`serve/engine/protocol.py#L37-L76`); `--logits-processors` (`arg_utils.py#L1019`); no
`swap_space` anywhere under `vllm/` (`grep -rln` empty); `auto` backend and fallback
(`structured_outputs.py#L12-L25`, `sampling_params.py#L1297-L1341`); `guided_*` warning text
(`protocol.py#L21-L71`); preemption frees blocks and zeroes computed tokens
(`scheduler.py#L1538-L1560`); "Preemptions:" log field and `vllm:num_preemptions`
(`loggers.py#L295-L297`, `#L676-L680`).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| V-a | V0 lane and prose: de-tokenizing and streaming ran in series with the GPU step; box "de-tokenize + stream / blocks next step" | :125-126, :186-192, :354-356 | WRONG (late V0) | v0.6.0 added asynchronous output processing that "overlaps the output processing with model execution" and moved the API server to its own process over ZMQ (`https://vllm.ai/blog/2024-09-05-perf-update`, Tier 2, fetched 2026-10-17); the section's own expandable cites the v0.6.0 ZMQ split | Prose: "scheduling and input preparation ran in series with each GPU step, and de-tokenization ran inside the engine process"; SVG title to match; lane title "CPU work on the engine's critical path"; box "de-tokenize / in the engine process". Harness: 0 overlaps / 0 clipping at 1440 and 390; both PNGs read |
| V-b | Quote "a simple dictionary, e.g. {request_id: num_tokens}" | :474-475 | WRONG (misquote) | Source text: "a simple dictionary (e.g., `{request_id: num_tokens}`)" (`v1_guide.md#L72-L77`) | Quote made verbatim |
| V-c | "A request that names a different backend is rejected with a validation error" | :97-100 | OVERREACH | HTTP request fields carry no backend: `_backend` is `field(default=None, init=False)` (`sampling_params.py#L88-L104`); the check at `#L1165-L1181` fires on a reused params object; a client sending `guided_decoding_backend` gets it ignored with the warning (`protocol.py#L24-L33`) | "The request fields carry no backend choice: the backend slot ... is internal [L88-L104], and the engine rejects one that differs from the server's [L1165-L1181]"; `guided_decoding_backend` added to the ignored-fields list |
| V-d | Re-admitted preempted request recovers its prefix only through a KV offloading connector | :610-614 | OVERREACH (by omission) | A request at 0 computed tokens gets a fresh local prefix-cache lookup (`scheduler.py#L929-L937`); freed hashed blocks stay in the LRU queue (`block_pool.py#L786-L800`); SchedulerBatching.tsx:737-743 already says so | Sentence now names the local prefix-cache hit first, then the offload tier; cite widened to `scheduler.py#L929-L952` |
| V-e | prose: "request fields the server no longer knows" (changelog voice) | :568 | prose | COMMON step 4 | "request fields the V1 server does not recognize" |
| V-f | prose: "the Rust Frontend tab covers it" (unnamed section) | :416 | prose | InsideCodebase.tsx:75 tab label "The Rust Frontend" | "Inside the Codebase -> The Rust Frontend covers it" (rendered with `&rarr;`) |

Score: **8/10**. Code claims are pinned and the doc-code conflict on process count is
labelled. Held at 8 because the V0 lane describes removed code, so its evidence can only be the
project's Tier 2 blogs, and the section is dense for an architecture overview.

## Checks

- `pnpm --filter @tech-deep-dives/vllm typecheck`: `tsc --noEmit`, exit 0, no output.
- `pnpm --filter @tech-deep-dives/vllm lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- Gates: `no-ai-tells` PASS, `pinned-refs` PASS, `svg-a11y` PASS.
- Harness: `node /tmp/vllm-shoot.mjs --dist /tmp/vllm-dist-fc01 --port 4871 --out /tmp/vllm-shots-fc01 --sections workload,v1-arch`
  gave "diagrams measured: 4 (both widths); with overlaps/clipping: 0; console errors: 0". At
  390 both SVGs sit in their existing `overflowX: auto` scroll containers (`minWidth: 640`), as
  before.
