# fc02-memory: adversarial fact-check

Group: SchedulerBatching.tsx, PagedAttentionKV.tsx, PrefixCaching.tsx (section ids scheduler,
paged, prefix). Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read from
`/tmp/vllm-new` on 2026-10-17. `G/` below means
`https://github.com/vllm-project/vllm/blob/v0.31.0/`. Line numbers in the "file:line" column are
for the file before the fixes in this pass.

No diagram SVG was changed in this pass (the timeline correction is in the caption under the
SVG), so the harness was not run.

## SchedulerBatching.tsx

Claims checked: 58. CONFIRMED: 52. Non-CONFIRMED rows below.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| SB-1 | Timeline caption and "Requests leave" box: R1's EOS at t4 frees its blocks, R4 joins at t5 | :315-320, :332-333 | WRONG at the default config | Async scheduling is on unless an incompatible option is set `G/vllm/config/vllm.py#L1576-L1635`, which makes `max_concurrent_batches` 2 `#L592-L602`. `step_with_batch_queue` schedules the next batch before it calls `update_from_output` on the previous one `G/vllm/v1/engine/core.py#L686-L757`, and EOS is only seen in `update_from_output` (the async skip at `G/vllm/v1/core/sched/scheduler.py#L635-L649` covers `max_tokens` only). So t5 is planned before R1's EOS is known: R1 keeps its blocks one step longer and R4 can join at t6 | Caption gains one sentence: the timeline shows the synchronous schedule, and under default async scheduling R4 joins at t6. Cites vllm.py L592-L602 and core.py L686-L757. SVG unchanged (still labelled illustrative) |
| SB-2 | "Only requests blocked for another reason are set aside: remote KV, grammar, LoRA cap" given as the complete list | :359-366 | OVERREACH | Skip paths also cover streaming-input waits `G/vllm/v1/core/sched/scheduler.py#L3126-L3129` and in-flight stale output `#L904-L909` | "...so the scan can continue, such as remote KV..." |
| SB-3 | Decode asks for 1 token or 1 plus drafts; prefill takes what fits | :428-437 | UNSUPPORTED (line range) | Cited L582-L585 holds the budget, not the per-request ask; the ask is `G/vllm/v1/core/sched/scheduler.py#L674-L683` | Added cite L674-L683 |
| SB-4 | `vllm serve` uses the OPENAI_API_SERVER usage context, cited serve.py L188 | :491 | UNSUPPORTED (narrow cite) | serve.py L188 is the `--headless` path only. The default single-server path goes through `build_async_engine_client`, whose default is `UsageContext.OPENAI_API_SERVER` `G/vllm/entrypoints/launchers/api_server/entry.py#L36-L40` | Repointed the cite to entry.py L36-L40 |
| SB-5 | "The optimization guide still speaks of..." | :631 | prose (history voice) | n/a | Dropped "still" |
| SB-6 | "a search of `vllm/` at v0.31.0 for this section found no `PreemptionMode`" | :640-641 | prose (research voice) | `grep -rn PreemptionMode /tmp/vllm-new/vllm` returns nothing. The search covers the whole pinned tree, so the claim scoped to that tree holds | "the v0.31.0 tree under `vllm/` contains no `PreemptionMode`" |

Confirmed highlights: the GPU-tier defaults 16384/1024, 8192/1024 and 2048/256
(`G/vllm/engine/arg_utils.py#L2858-L2887`), the class fallbacks 2048/128 (`G/vllm/config/scheduler.py#L42-L44`),
throughput mode doubling (`arg_utils.py#L3064-L3069`), every SchedulerConfig docstring row
(L70-L120, L160-L212), the 503 exceptions (`G/vllm/exceptions.py#L148-L175`), FCFS head-of-queue
break (`scheduler.py#L885-L896`, `#L1209-L1230`), victim selection (`#L763-L803`), the preempt path
(`#L1538-L1581`), all four loggers.py ranges, and every optimization-guide and V1-guide quote (verbatim
at `docs/configuration/optimization.md#L29-L66` and `docs/usage/v1_guide.md#L39`, `#L160-L169`).
Cross-file facts (defaults, 503, recompute-only, preemption signals) are consistent.

**Section Shape.** Pre-revamp 538 lines, now about 790. One block fails both tests: the
sentence on waiting requests that already hold KV blocks being drained first (formerly :438-444).
It is an implementation ordering detail with no reader action, and it builds no model that predicts
anything a reader would see outside disaggregated serving. It was demoted into the "How the per-step
budget interleaves prefill and decode" ExpandableSection, citation kept. Every other block passes. The
timeline, the four reading boxes and chunked prefill build the mental model. The defaults, the
preemption signals, "How to avoid it" and the knobs table are practical. The two ExpandableSections
that restate the intro are already demoted. The payoff lands last ("Start here").

**Score: 8/10.** Accurate at the pin after the fixes, with dense Tier 1 citations. The length is
the knobs table restating rows the body already explains. That repetition serves lookup, so it was
left in place.

## PagedAttentionKV.tsx

Claims checked: 47. CONFIRMED: 44. Non-CONFIRMED rows below.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| PA-1 | Waste table, "Reservation / over-allocation": "You pay for tokens that may never be generated" | :29-33 | WRONG (vs the cited paper) | Kwon et al. section 3.1: reserved slots are for future tokens and "the reserved memory is eventually used". Slots that are never used are internal fragmentation, which the row above already covers (https://arxiv.org/html/2309.06180) | Row renamed "Reservation". The cause now says the slots are claimed at admission and filled later; the cost says they hold memory other requests could use now |
| PA-2 | "vLLM's KV cache follows the paper's design: ... and hash-chained prefix blocks for reuse" | :271-273 | OVERREACH | The paper has no hash-based prefix caching ("hash" appears only in author names in the arXiv HTML). Hash chaining is vLLM's own design `G/vllm/v1/core/kv_cache_utils.py#L684-L714` | "keeps the paper's design, a pool ... and a block table per request, and adds hash-chained prefix blocks" |
| PA-3 | Offloading is "off until you set `--kv-offloading-size`" | :467-471 | OVERREACH | `--kv-offloading-size` is shorthand that writes `OffloadingConnector` or `LMCacheMPConnector` into `kv_transfer_config` `G/vllm/config/vllm.py#L1124-L1158`. Naming the connector in `--kv-transfer-config` also enables offloading (KVOffloadingLMCache.tsx describes the long form) | "...or name an offloading connector in `--kv-transfer-config`", plus the vllm.py L1124-L1158 cite |

Confirmed highlights: 2-4x vs FasterTransformer and Orca, gains larger for longer sequences, larger
models and complex decoding, "near-zero waste" and "flexible sharing" (arXiv abstract). The figures
20.4% to 38.2% and 96.3% were read off Figure 2, rendered from `memory_breakdown.svg` in the arXiv
HTML. Also confirmed: the v0.25.0 removal quote (`/tmp/vllm-release-notes/v0.25.0.md` L10) and the
PR #47361 title "Delete PagedAttention" (gh api); no `paged_attention_v1`/`v2` CUDA kernels remain in
`csrc/attention` (a ROCm `csrc/rocm/attention.cu` remains, which the "CUDA" qualifier already excludes);
the registry, `block_table`/`slot_mapping`, null block, the LRU free-queue head, hybrid groups and
the shared pool, the HMA turn-off rules and log text, the CoW path, block-size selection (16, 64, 128,
hybrid re-align), the `human_readable_int` suffixes, the gpu_worker suggestion log, the argparse
prefix (logged in `experiments/kv-cache-memory-abbrev.md`) and the capacity log line. The four
versioned docs URLs return 200.

**Score: 8/10.** Accurate after the fixes. The h2 descriptions state the payoff and the section ends
on reading the startup log line. "The KV cache, not the weights" repeats three times as a contrast.
That contrast carries the section's point, so it was left.

## PrefixCaching.tsx

Claims checked: 41. CONFIRMED: 39. Non-CONFIRMED rows below.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| PC-1 | "Prefix sharing is purely a function of token equality" | :321 | WRONG (contradicts the section's own extra keys) | LoRA name and path, mm identifiers, prompt-embeds hashes and `cache_salt` are part of the key `G/vllm/v1/core/kv_cache_utils.py#L614-L652` | "follows from the tokens and the extra keys above" |
| PC-2 | "A reset fails while any request holds blocks" | :496 | OVERREACH | True by default `G/vllm/v1/core/block_pool.py#L840-L847`. But `reset_running_requests=true` (on `LLM.reset_prefix_cache` and the dev route) preempts running requests first `G/vllm/v1/core/sched/scheduler.py#L2774-L2804`, `G/vllm/entrypoints/serve/dev/cache/api_router.py#L19-L44` | "By default a reset fails..." |

Confirmed highlights: the `enable_prefix_caching` default and the per-model-type support
(`G/vllm/config/model.py#L2178-L2230`), the V1 alpha blog quotes and the <1% at 0% hit-rate project
claim (fetched 2026-10-17, labelled Tier 2), the extra-key tags, Mamba `align` by default, the retention
interval quote, `prefix_match_unit`, the cache_salt validation (128 characters; `@ / \ NUL` forbidden),
the design-doc quotes (full blocks only, salt isolation, LRU head, sha256 reproducibility, sha256_cbor),
the deterministic seed `"vllm-none-hash"` and the xxhash random seed with its warning (consistent with
the cross-file fact and v0.29.0 #51875), the P2P "hash seed mismatch", the metrics and log strings, the
dev-mode route, and `skip_reading_prefix_cache`.

**Score: 8/10.** The mental model (chained hashes, longest shared prefix) and the practical value
(salt, metrics, reset, routing) are both strong, and the section ends on "Where to start". The
workload table carries uncited qualitative impact ratings. They are mental-model guidance and contain
no numbers.

## Checks

- `bash scripts/gates/no-ai-tells.sh`: PASS. `bash scripts/gates/pinned-refs.sh`: PASS.
- `pnpm --filter @tech-deep-dives/vllm typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/vllm lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0,
  no output.
