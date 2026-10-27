# Fact check fc02-sched-radix: sections 4 (The Scheduler) and 5 (RadixAttention and the Radix Cache)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
vLLM baseline v0.31.0, files read through `gh api .../contents/<path>?ref=v0.31.0` (the local
`/tmp/vllm-new` checkout is partial: `vllm/config/` is empty). Date 2026-10-24. Status: COMPLETE.
No diagram was touched, so the harness was not run.

## Scheduler.tsx

66 claims checked (62 `Cite`s after fixes, plus vLLM async-scheduling default, vLLM preemption
order, `vllm:num_preemptions`, the 0.91 / 0.21 / 1.43 arithmetic, the three log-line formats and the
section-27 `FutureMap` cross-reference). 59 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| S1 | Dashboard hit rate `rate(cached_tokens_total) / rate(prompt_tokens_total)` | Scheduler.tsx:605 (old) | WRONG | `observability/metrics_collector.py#L2040-L2069`: `prompt_tokens_total` carries `is_streaming`, `cached_tokens_total` carries `cache_source`; PromQL vector division without `sum` matches no series. Section 5 and register 01 E8 already use `sum(rate)/sum(rate)` | Query changed to `sum(rate(...)) / sum(rate(...))` with the label reason; added cite metrics_collector.py L2027-L2069 |
| S2 | With `--enable-metrics` the server serves `/metrics` "on its own port" | Scheduler.tsx:1070 (old) | WRONG | `entrypoints/http_server.py#L301-L304` calls `add_prometheus_middleware(app)`; `utils/common.py#L2797-L2807` mounts `/metrics` on the same FastAPI app | Reworded: "on the same HTTP port as its API" |
| S3 | `sglang:new_token_ratio` "drifts toward 0.098 while decode runs clean"; "every jump lines up with one retraction" | Scheduler.tsx:562-566 (old) | WRONG | Gauge value comes from prefill stats only: `managers/scheduler_components/metrics_reporter.py#L720-L722` (`stats.new_token_ratio = prefill_stats.new_token_ratio`), logged at `metrics_collector.py#L1682`. Full idle resets the ratio to its start value: `managers/scheduler.py#L5149` | Row rewritten: value at the most recent prefill batch; a jump without a retraction is the full-idle reset. Added cite metrics_reporter.py L720-L722 |
| S4 | `ignore_eos` request charged "its full remaining output" at ratio 1.0 | Scheduler.tsx:882-883 (old) | OVERREACH | `managers/schedule_policy.py#L754-L763`: `min(remaining, CLIP_MAX_NEW_TOKENS) * ratio`, ratio 1.0 only for `ignore_eos` | "its remaining output, still capped at 4096, at a ratio of 1.0" |
| S5 | Above about 1.43 the start caps at 1.0, "which charges running requests their whole remaining output" | Scheduler.tsx:913 (old) | OVERREACH | Same lines: the 4096 clip still applies | Added "up to the 4096 cap" |
| S6 | Retraction "always keeping at least one" | Scheduler.tsx:939-944 | UNSUPPORTED at cited range | Keep-one break is in `managers/schedule_batch.py#L3306-L3311`, not in scheduler.py L4335-L4416 | Added cite schedule_batch.py L3298-L3311 |
| S7 | EOS first appears unexpanded in the overlap diagram labels, expansion came only in the bullet after it | Scheduler.tsx:68,75 vs 716 (old) | prose (acronym order) | CLAUDE.md Acronym Standard | Expansion moved into the paragraph before the diagram ("finish checks (such as EOS, end of sequence)"); bullet now uses EOS |

Spot notes on CONFIRMED items that carry conditions: requests reaching `max_new_tokens` are left out
of N+1 only in the overlap loop (`scheduler.py#L1977` sets `enable_skip_finishing_decode`), which is
the default; grammar-delayed sampling applies with speculative decoding off (`tp_worker.py#L669-L679`);
NGRAM forcing `--enable-mixed-chunk` off holds because the last declared resolution wins over raw
input (`arg_groups/overrides.py#L176-L189`); PD decode retraction keeps a host backup by default
(`mem_cache/kv_cache_builder.py#L167-L223` infers `host_pool` or `cpu_tensor`).

**Score: 8/10.** Two bets give a clear mental model and the 4096 and 70% charges land repeatedly;
after fixes every number is cited at the pin. Held at 8 by the volume of code-only claims and a long
evidence tail in the final container.

## RadixCache.tsx

91 claims checked (86 `Cite`s after fixes, plus the paper and blog figures re-fetched, vLLM v0.2.5
having no prefix cache, the commit-history survey, section titles and the Qwen3-VL override
conditions). 80 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| R1 | "The cache is on unless you pass `--disable-radix-cache`" | RadixCache.tsx:546 (old) | OVERREACH | Startup turns it off by itself: PD decode server `arg_groups/pd_disaggregation_hook.py#L128-L134`; also Whisper `attention_hook.py#L165-L177`, `--enable-mis` `#L555-L561`, deterministic inference on some backends `#L655-L660`, some embedding models `model_hook.py#L837-L845` (register 02 B12) | "on by default and `--disable-radix-cache` turns it off; startup also turns it off for some configurations, a PD (prefill/decode) decode server among them" + cite pd_disaggregation_hook.py L128-L134 |
| R2 | Llama-style model "without tree speculation" reuses in 64-token steps on B200 | RadixCache.tsx:596 (old) | WRONG (cross-section condition) | `arg_groups/model_override_base.py#L303-L315`: SM100 picks `trtllm_mha` only if spec is off or `--speculative-eagle-topk` is set; spec with topk unset leaves it. Build-log condition "B200 page-size flip" | "with speculative decoding off" |
| R3 | `lpm` the runtime default "through v0.4.3", `fcfs` "in v0.4.4" | RadixCache.tsx:1000-1008 (old) | WRONG | `schedule_policy: str = "lpm"` at v0.4.3.post2 server_args.py L70; `"fcfs"` at v0.4.3.post3 L71 (https://github.com/sgl-project/sglang/blob/v0.4.3.post2/python/sglang/srt/server_args.py#L70, https://github.com/sgl-project/sglang/blob/v0.4.3.post3/python/sglang/srt/server_args.py#L71) | Text and both cites moved to v0.4.3.post2 / v0.4.3.post3 |
| R4 | Startup log line "confirms which cache you got" | RadixCache.tsx:842-844 (old) | OVERREACH | `mem_cache/registry.py#L91-L99`: a disabled cache is still `UnifiedRadixCache`, so the line is identical | "confirms which cache class you got; a cache turned off with `--disable-radix-cache` is the same class and prints the same line" + cite registry.py L91-L99 |
| R5 | 15 recent `lang/` commits "are refactor, lint and docs sweeps plus one new hosted backend" | RadixCache.tsx:1232-1235 (old) | OVERREACH | `gh api repos/sgl-project/sglang/commits?sha=v0.5.22&path=python/sglang/lang`: the 15 also include a Gemma 4 chat template (#21952, chat_template.py +17/-8) and a streaming-logprobs change (#21583, interpreter.py +38/-1). October 2025 interpreter feature confirmed (#10635) | "mostly repository-wide refactor, lint and docs sweeps; the rest add one hosted backend, a Gemma 4 chat template and a streaming-logprobs change" |
| R6 | Tuning guide "recommends" `lpm` | RadixCache.tsx:881 (old) | OVERREACH | `docs/docs/advanced_features/hyperparameter_tuning.mdx#L82`: "try `--schedule-policy lpm`" | "suggests trying it" |
| R7 | `RadixAttention` dispatches to an attention backend | RadixCache.tsx:827-832 | UNSUPPORTED at cited range | L98-L101 is the class header only; dispatch at `layers/radix_attention.py#L294-L302` | Added cite radix_attention.py L294-L302 |
| R8 | `sglang:evicted_tokens_total` cite | RadixCache.tsx:1094 | UNSUPPORTED at cited range | Counter defined at `metrics_collector.py#L2467-L2474`; L2464-L2466 is the duration histogram | Range corrected to L2467-L2474 |
| R9 | Docs warn mean-logprob can favour a long, easy choice | RadixCache.tsx:1213 | UNSUPPORTED at cited range | `docs/docs/references/frontend/choices_methods.mdx#L31` (L30 is blank) | Range corrected to L31 |
| R10 | `--disable-radix-cache`: every match empty and every insert a no-op | RadixCache.tsx:516-519 | UNSUPPORTED at cited range | Match at `mem_cache/unified_radix_cache.py#L586-L588`, insert at `#L617-L620` | Range widened to L586-L620 |
| R11 | `tlru` startup fails unless `threshold` exceeds `next_prompt_estimate` | RadixCache.tsx:449-451 | UNSUPPORTED (no cite carried it) | `arg_groups/kv_cache_hook.py#L385-L391` | Added cite kv_cache_hook.py L385-L391 in the table cell |

Spot notes on CONFIRMED items: the paper figures (6.4x, 3.7x, G5/A10G, A100 80 GB, Guidance v0.1.8,
vLLM v0.2.5, LMQL v0.7.3, 50% to 99%, 52.4% and 74.1%, the vLLM-version footnote) and the LMSYS "up to
5 times" with A10G were re-fetched from https://arxiv.org/html/2312.07104v2 and
https://lmsys.org/blog/2024-01-17-sglang/; v2 is dated 6 Jun 2024 (https://arxiv.org/abs/2312.07104v2).
vLLM v0.2.5 has no prefix-cache code (`vllm/engine/arg_utils.py`, `vllm/core/block_manager.py` at the
tag carry no prefix or hash). The FCFS waiting-prefix refresh runs on the default
`UnifiedRadixCache` because no tree core overrides `supports_fast_match_prefix` (`schedule_policy.py#L278-L298`).
`python/sglang/README.md#L8` deprecation passage kept as instructed.

**Score: 8/10.** Strong mental model (two tables plus a tree; low `token_usage` on a full pool) with
actionable gauges; the history and condition errors are fixed. Held at 8 by length (about 3,200 words
by a rough count, above the 2,500 target) and a design-intent block that reads as an appendix.

## Build-log open items

- Section 4, code-read items without a register row: ratio reset on full idle
  (`scheduler.py#L5149`), `ignore_eos` charged at ratio 1.0 (`schedule_policy.py#L756`), the 4096
  cap limits only the charge (`schedule_policy.py#L81-L87`), evictable cache counts as free room
  (`mem_cache/prefill_budget.py#L91-L101`): all CONFIRMED.
- Section 5, 01 E8 hit-rate query: the two counters carry different labels, so
  `sum(rate)/sum(rate)` is right (CONFIRMED). Section 4's table did not follow it (S1, fixed).
- Section 5, 02 C14 `sglang:cache_hit_rate` holds only the last prefill batch's ratio
  (`metrics_reporter.py#L811-L842`, `metrics_collector.py#L1618`): CONFIRMED in both files.

## For the orchestrator (files this group does not own)

- `sources.md` L116-L117 list `v0.4.3` and `v0.4.4` server_args.py for RadixCache; they should be
  `v0.4.3.post2` and `v0.4.3.post3` (R3).
- `KvMemory.tsx` L450, L1028, L1193 say "without tree speculation" for the B200 default; the
  cross-section condition also excludes speculation with `--speculative-eagle-topk` unset (fc03).
- `bash scripts/gates/svg-a11y.sh` fails on `GettingStarted.tsx:470` (fc01's file, an `<svg>` with
  no accessible name).
