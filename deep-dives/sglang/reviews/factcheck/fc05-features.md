# Fact check fc05-features: sections 10 (Structured Output) and 11 (Speculative Decoding)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
vLLM baseline v0.31.0, files read through `gh api repos/vllm-project/vllm/contents/<path>?ref=v0.31.0`
(the local `/tmp/vllm-new` checkout is partial). XGrammar read at tag v0.2.7 for the bitmask format.
Date 2026-10-24. Status: COMPLETE. Section 11 was checked by a forked subagent working from the same brief; its rows were merged here and its key fixes spot-checked.

## StructuredOutput.tsx

97 claims checked (89 `Cite`s plus the diagram labels, the 50 s arithmetic, the vLLM request shape,
the section titles in cross-references and the XGrammar bitmask format). 88 CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| T1 | Compile failure on a streaming OpenAI call yields "a final chunk whose finish reason is an abort" | StructuredOutput.tsx:326-328 (old) | WRONG | `python/sglang/srt/entrypoints/openai/serving_chat.py#L2085-L2102`: an abort carrying an `HTTPStatus` emits `create_streaming_error_response` (an `{"error": ...}` object with `code` 400, `serving_base.py#L216-L230`) and breaks out of the stream | "streaming calls get one error event with code 400 and the same message, and the stream ends" + cite serving_chat.py L2085-L2102 |
| T2 | "XGrammar is the strict one" (only XGrammar gets a schema pre-check) | StructuredOutput.tsx:1025 (old) | WRONG | `constrained/json_schema_validation.py#L66-L92` defines an Outlines reject list of 21 keywords (a superset of XGrammar's 11, adding `minimum`, `maximum`, `allOf`, `oneOf` and more), called at `constrained/outlines_backend.py#L169-L182` | "XGrammar, the default, gets a pre-check"; added one sentence on the wider Outlines check with both cites |
| T3 | On timeout "the compile is cancelled" | StructuredOutput.tsx:941-942 (old) | OVERREACH | `constrained/grammar_manager.py#L316-L317` calls `Future.cancel()`, which cannot stop a call already running on the pool thread (https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Future.cancel) | Clause removed; the cached failure and the abort stay |
| T4 | Outlines with EBNF "or a structural tag" returns `Failed to compile ebnf grammar: Unknown grammar error` | StructuredOutput.tsx:355 (old) | WRONG (partial) | `constrained/grammar_manager.py#L308` builds the message from the key type, so a structural tag reads `Failed to compile structural_tag grammar: ...`; `base_grammar_backend.py#L190-L220` | Added "with `structural_tag` in place of `ebnf` for a structural tag" |
| T5 | "Every constrained token costs one decode step" | StructuredOutput.tsx:846 (old) | OVERREACH | With speculation on, a verify forward commits several grammar-checked tokens: `speculative/spec_utils.py#L520-L585`, `managers/scheduler_components/batch_result_processor.py#L852-L862` | "With speculative decoding off, every constrained token costs one decode step" |
| T6 | Without `--reasoning-parser` "a reasoning model cannot open its think block at all" | StructuredOutput.tsx:1115-1116 (old) | OVERREACH | Only the schema-binding is in code (`constrained/base_grammar_backend.py#L427-L443`); many chat templates open the think block in the prompt, so "cannot open" overstates the reading | "a reasoning model cannot write free-form reasoning before the schema-bound output" (still marked our reading) |
| T7 | llguidance accepted "from 1.7.6 up to 2.0" | StructuredOutput.tsx:1033 (old) | WRONG (precision) | `python/pyproject.toml#L48`: `llguidance>=1.7.6,<2.0.0`; `#L62` `outlines==0.1.11` is also exact | "from 1.7.6 to below 2.0"; "pins XGrammar 0.2.7 and Outlines 0.1.11 exactly" |
| T8 | vLLM `auto` per-request fallback, cited `vllm/sampling_params.py` L1281-L1320 | StructuredOutput.tsx:1212 (old) | UNSUPPORTED at cited range | At v0.31.0 the fallback to `guidance` / `outlines` and `_backend_was_auto` are at https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/sampling_params.py#L1297-L1341; L1281-L1296 is the Mistral Lark branch | Range moved to L1297-L1341 |
| T9 | "the grammar classes still carry the jump-forward interface" | StructuredOutput.tsx:858 (old) | prose (history voice) | Section Shape rule 1 | "still" removed |

Spot notes on CONFIRMED items that carry conditions: the delayed sample applies only with overlap on
and speculation off (`managers/tp_worker.py#L667-L689`); jump-forward has no caller outside
`constrained/` and no flag (grep over `python/` and `test/`); a cached failure is a cache hit because
`BaseGrammarObject` defines no `__bool__` and `copy()` returns `self`
(`constrained/base_grammar_backend.py#L108-L109`, `#L283-L292`); `/flush_cache` also counts the
grammar queue as busy (`managers/scheduler.py#L5203`), so it cannot flush while a slow compile is still
queued; the five registered grammar histograms and counters have no writer anywhere in `python/` or
`test/`; the 32-tokens-per-int32 format and the minus-infinity mask are XGrammar's
(https://github.com/mlc-ai/xgrammar/blob/v0.2.7/python/xgrammar/matcher.py#L15-L21); the LMSYS
compressed-FSM figures (up to 2x latency, 2.5x throughput, Llama-7B, one A10, vLLM v0.2.7) were
re-fetched from https://lmsys.org/blog/2024-02-05-compressed-fsm/ and the paper's Section 4 from
https://arxiv.org/html/2312.07104v2; vLLM v0.31.0 nests constraints under `structured_outputs`
(https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/chat_completion/protocol.py#L377).
No diagram was touched, so the harness was not run.

**Score: 8/10.** One bitmask per token is a clear mental model, the 10,000-poll and 50 s deadline
lands four times, and every number is cited at the pin after fixes. Held at 8 by a long tail of
code-only claims in the 400 table and a closing block that runs to the Against-vLLM line after the
next action.

## SpeculativeDecoding.tsx

113 claims checked (99 `Cite`s before fixes, plus the diagram labels and caption, the 2.4x arithmetic, "nine built-in names", the 8-ranks-run-6 split, UNO leaving the cap alone, the vLLM tree hedge, the cross-references and the B200 cross-section condition). 95 CONFIRMED; OVERREACH 11 (S1, S2, S3, S7, S8, S9, S11, S12, S13, S17, S18), UNSUPPORTED 5 (S4, S5, S6, S10, S14), prose 2 (S15, S16), WRONG 0, STALE 0. The EAGLE-3 conditions added in S9 to S11 were re-fetched by the parent from https://arxiv.org/html/2503.01840v3 (Appendix A names Hugging Face Transformers as the vanilla baseline; Table 4 caption: batch size 1 on H100, LLaMA-Instruct 3.1 8B, MT-bench; 1.38x at batch 64 with chain length 3, no tree).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| S1 | Hopper/B200 MHA under tree speculation "leave their defaults for flashinfer ... at page size 1" | SpeculativeDecoding.tsx:719-721 (old) | OVERREACH | `python/sglang/srt/utils/common.py#L4014-L4020`: the predicate includes the top-k-1 case with an explicit page size above 1, where the user's page size stays; section 8 (AttentionBackends.tsx L993-L995) writes "at page size 1 unless you set one" | "at page size 1 unless you set one" |
| S2 | To keep `trtllm_mha` under speculation on B200, set `--speculative-num-steps` and `--speculative-eagle-topk 1` | SpeculativeDecoding.tsx:736-738 (old) | OVERREACH (cross-section) | Same predicate: top-k 1 keeps `trtllm_mha` only with page size unset or 1 (`utils/common.py#L4017-L4020`, `arg_groups/model_override_base.py#L303-L315`); section 8 adds "leave `--page-size` unset" | Added "and leave `--page-size` unset" |
| S3 | "A Llama or Grok target gets a tree" (5/4/8) | SpeculativeDecoding.tsx:673 (old) | OVERREACH | `arg_groups/speculative_hook.py#L1349-L1369`: only architecture `LlamaForCausalLM` and `Grok1ForCausalLM`/`Grok1VForCausalLM`; other Llama architectures (Llama 4 is `Llama4ForConditionalGeneration`) take the 3/1/4 chain | "A `LlamaForCausalLM` or Grok-1 target gets a tree" |
| S4 | Sampled request "verified target-only by default ... accepted with the target's probability", cited eagle_utils.py L705-L760 (also walk row) | SpeculativeDecoding.tsx:762, 463 (old) | UNSUPPORTED at cited range | L705-L760 is `_verify_uses_greedy` and the `eagle_sample` header; greedy and target-only branches are at `speculative/eagle_utils.py#L858-L1004` (`verify_tree_greedy_func`, `tree_speculative_sampling_target_only`, `draft_probs` zeros) | Both cites moved to L858-L1004 |
| S5 | Tree build "best nodes up to the draft-token count form the tree", cited eagle_utils.py L145-L220 | SpeculativeDecoding.tsx:696 (old) | UNSUPPORTED at cited range | Node selection is `organize_draft_results` at `speculative/eagle_utils.py#L113-L142`; L145-L220 is mask setup | Range widened to L113-L220 |
| S6 | Docs-vs-code overlap item: "the worker carries tree-shape state for top-k above 1", cited eagle_worker_v2.py L1462-L1481 | SpeculativeDecoding.tsx:964-969 (old) | UNSUPPORTED at cited range | L1462-L1481 is the PP tail-draft relay (runs only with `pp_size > 1`); the general top-k>1 paths are `speculative/eagle_worker_v2.py#L1092-L1102` (draft-extend sized to tree width for topk > 1) and `#L1209-L1215` (top-k draft proposals) | Reworded to "the V2 worker that both loops run has code paths for top-k above 1"; cites moved to L1092-L1102 and L1209-L1215 |
| S7 | Unset cap "clamped to 2048 to 4096, and never above half the KV tokens" | SpeculativeDecoding.tsx:846-847 (old) | OVERREACH (omitted bound) | `mem_cache/kv_cache_configurator.py#L2815-L2831`: hybrid models are also capped by the Mamba state cache | Added "and on hybrid models never above what the Mamba state cache holds" |
| S8 | PD row: "Prefill runs the target prefill and the first draft step, then ships ... top-k candidates and the last hidden state" (stated for all algorithms) | SpeculativeDecoding.tsx:317-319 (old) | OVERREACH | `disaggregation/prefill.py#L992-L1003` attaches top-k and hidden state only when `spec_algorithm.is_eagle()`; DFlash and DSpark have their own `dflash_disaggregation.py`, `dspark_disaggregation.py` | "For the EAGLE family, prefill runs ..." |
| S9 | EAGLE-3 "up to 6.5x speedup at small batch" against the 1.38x inside SGLang | SpeculativeDecoding.tsx:870-871 (old) | OVERREACH (condition dropped) | https://arxiv.org/html/2503.01840v3 Sec. 4.1 and Appendix A: 6.5x is on HumanEval against vanilla Hugging Face Transformers decoding, not inside SGLang; the paper names no batch size for Table 1 (its intro puts the 1.4x over EAGLE-2 at batch size 1) | "up to 6.5x speedup against plain Hugging Face decoding" |
| S10 | Docs throughput 158/244/373 tokens/s: "The page gives no batch size or draft settings" | SpeculativeDecoding.tsx:1089-1091 (old) | UNSUPPORTED (condition available) | The docs page points to the EAGLE-3 paper (docs `speculative_decoding.mdx#L125-L126`), whose Table 4 gives the same three figures "at batch size = 1 on H100 ... conducted by the SGLang team" (https://arxiv.org/html/2503.01840v3 Sec. 4.3) | Kept the docs sentence; added "the EAGLE-3 paper prints the same three figures as batch size 1, measured by the SGLang team" + paper cite (Table 4) |
| S11 | Expandable: EAGLE-3 6.5x / 1.4x / 1.38x without conditions | SpeculativeDecoding.tsx:1098-1099 (old) | OVERREACH (conditions dropped) | Same paper: 6.5x vs vanilla HF; 1.4x over EAGLE-2 at batch size 1; 1.38x at batch 64 on one H100, Llama-Instruct 3.1 8B, chain length 3, no tree, MT-Bench (Sec. 4.3, Table 3) | Conditions added in the sentence |
| S12 | LMSYS Domino "3.34x to 5.72x" and DFlash "up to 4.31x" with no block size | SpeculativeDecoding.tsx:1106-1108 (old) | OVERREACH (condition dropped) | https://www.lmsys.org/blog/2026-08-04-specforge-v0-3: the 3.34x-5.72x range is the Domino-B16 column; "Block size 16 reaches higher still at concurrency 1, up to 4.31x on HumanEval" (Figure 4 bars are block size 8) | "at block size 16" added to both |
| S13 | "Every figure is a project or paper claim measured at low concurrency" | SpeculativeDecoding.tsx:1118-1119 (old) | OVERREACH | The list includes 1.38x at batch 64 and 1.37x-2.36x at concurrency 16 | "Every figure is a project or paper claim on the stated hardware, and the largest come from concurrency 1" |
| S14 | SpecForge has "exporters that write SGLang-loadable checkpoints" | SpeculativeDecoding.tsx:1070-1071 (old) | UNSUPPORTED (no cite carried it) | Neither the algorithms tree nor README L16-L60 shows exporters; https://github.com/sgl-project/SpecForge/tree/f586b1ee40b5e4bf3ef03954849024b57a5edb7a/specforge/export holds `to_sglang.py`, `to_hf.py`, `mtp.py` | Added cite to specforge/export at f586b1ee |
| S15 | "Greedy requests verify as before." | SpeculativeDecoding.tsx:805 (old) | prose (history voice) | Section Shape rule 1 | "Greedy requests keep the greedy check." |
| S16 | "(section 8)" bare cross-reference | SpeculativeDecoding.tsx:1016 (old) | prose (cross-reference convention) | authoring-brief: cross-references as "section N, Title" | "(section 8, Attention Backends and Kernels)" |
| S17 | Launch line "also keeps `trtllm_mha` on B200" | SpeculativeDecoding.tsx:1140 (old) | OVERREACH | `arg_groups/model_override_base.py#L303-L315`: only MHA targets reach `trtllm_mha` (asymmetric K/V get `fa4`, MLA gets `flashinfer`) | "keeps `trtllm_mha` on a B200 MHA target that would default to it" |
| S18 | Diagram caption "A Llama or Grok target gets a tree instead" | SpeculativeDecoding.tsx:578 (old) | OVERREACH (same as S3) | `python/sglang/srt/arg_groups/speculative_hook.py#L1349-L1369` | "A `LlamaForCausalLM` or Grok-1 target gets a tree instead" (caption text only; SVG untouched) |

Spot notes on CONFIRMED items that carry conditions:
- "Nine built-in names": the enum has eight members besides NONE (`speculative/spec_info.py#L32-L47`, FROZEN_KV_MTP among them) and `NEXTN` is a reserved alias (`speculative/spec_registry.py#L180-L183`); `from_string` accepts all nine. The field help at `arg_groups/fields/spec.py#L33` lists eight (no FROZEN_KV_MTP).
- 48 reset: present in the EAGLE-family (EAGLE, EAGLE3, NEXTN, STANDALONE), NGRAM, DFLASH, DSPARK and frozen-KV MTP hooks (`speculative_hook.py#L995-L1003`, `#L1204-L1212`, `#L421-L430`, `#L777-L786`, `#L914-L923`); no `max_running_requests` write in `_handle_uno` (`#L432-L596`). Unset cap formula at `mem_cache/kv_cache_configurator.py#L2804-L2813`.
- Attention-DP split: an explicit (or reset) value is divided by `attn_dp_size` (`kv_cache_configurator.py#L2807-L2810`); the unset estimate is per worker. 8 ranks x 6 = 48 is our reading, kept hedged.
- B200: `trtllm_mha` requires spec off or `--speculative-eagle-topk` set (`model_override_base.py#L303-L315`), backend resolved at `pipeline.py#L232` before `handle_speculative_decoding` at `#L292-L294`; topk 1 without `--speculative-num-steps` hits the assertion at `speculative_hook.py#L1068-L1072`. Section 11 now matches section 8 and the Cross-section conditions block.
- NGRAM/DFLASH overlap and topk>1 under overlap: no hook disables overlap on GPU (only `_disable_overlap_schedule_for_cpu`, `speculative_hook.py#L65-L77`, and MPS in `platform_hook.py#L41-L49`); hedges "read from code and not run" and "That test was read, not run" kept.
- Zero-step draft-extend runs by default; `SGLANG_SPEC_SKIP_ZERO_STEP_DRAFT_EXTEND` (default False, `environ.py#L1429`) can skip it.
- Grammar walk overlaps the target verify: mask built after the verify launch (`speculative/eagle_worker_common.py#L645-L689`); `batch_result_processor.py#L876-L886` says the same.
- Hybrid fix: PR 43029 merged 2026-10-10, listed in the v0.5.22 notes; its diff replaces `num_correct_drafts + 1` with the grammar-retained count.
- Block verification absent from `arg_groups/fields/spec.py` at v0.5.21, present at v0.5.22, so "available from v0.5.22" holds.
- SpecForge at f586b1ee: no tags or releases (API returns 0 each), commit dated 2026-10-22, `sglang==0.5.18` at pyproject L31; v0.5.19 to v0.5.22 are the four releases after it.
- vLLM v0.31.0: `speculative_config: SpeculativeConfig | None = None` (vllm/config/vllm.py L391); no token-tree field in `vllm/config/speculative.py`, no tree backend in `vllm/v1/attention/backends/` (listing at the tag); only a leftover FIXME in `vllm/v1/spec_decode/eagle.py`. Hedge "no token-tree option was found" holds at its scope.
- Docs figures 158.34 / 244.10 / 373.25 tokens/s, 1x H100, Llama-Instruct 3.1 8B, MT-Bench at docs `speculative_decoding.mdx#L123-L152`; attributed in the sentence and tier-labelled "project claim".

No diagram was touched (S18 is the caption `Box` below the SVG), so the harness was not run.

**Score: 8/10.** The draft-verify-keep round and the chain-or-tree shape give a clear mental model, the 48 cap lands three times with its scope, and every published figure now carries its conditions. Held at 8 by the volume of code-only claims and a long evidence tail in the combinations and figures blocks.

## Build-log open items

Section 10:
- 04 A6 narrowed (GLM-4.7 exception to the 400): CONFIRMED. `entrypoints/openai/protocol.py#L1199-L1209`
  skips the raise when the tool constraint is `full_assistant_ebnf`, produced only for the `glm47`
  parser (`entrypoints/openai/serving_chat.py#L1382-L1398`, `function_call/function_call_parser.py#L301-L327`).
- 04 A15 narrowed: CONFIRMED as shipped. The page does not repeat the row's "server refuses to start
  with outlines, llguidance or none", which holds only when the token filter is on
  (`constrained/reasoner_grammar_backend.py#L287-L299`).
- `/flush_cache` idle-only with `?timeout=N`, drops the radix cache: CONFIRMED
  (`managers/scheduler.py#L5348-L5377`, `entrypoints/http_server.py#L1009-L1024`,
  `managers/scheduler_components/flush_wrapper.py#L24-L65`).
- Rejection of string fields mixing two string-constraint kinds: CONFIRMED
  (`constrained/json_schema_validation.py#L147-L201`).
- Key order counts in the cache key: CONFIRMED (`python/sglang/utils.py#L104-L105`, `json.dumps`
  without `sort_keys`; key is `(type, string)` at `constrained/grammar_manager.py#L158-L171`).

Section 11:
- UNO leaves the 48 cap alone: CONFIRMED (no `max_running_requests` write in `_handle_uno`, `arg_groups/speculative_hook.py#L432-L596`), kept as our reading.
- With attention DP the 48 is split across ranks, 8 ranks run 6 each: CONFIRMED as a reading (`mem_cache/kv_cache_configurator.py#L2807-L2810` divides an explicit or reset value by `attn_dp_size`); hedge kept.
- NGRAM and DFLASH keep overlap on GPU, top-k above 1 runs under overlap: CONFIRMED as read from code, not run (only `_disable_overlap_schedule_for_cpu`, `arg_groups/speculative_hook.py#L65-L77`, turns overlap off); the top-k evidence cite moved off the pipeline-parallel-only lines (S6). Hedges kept.
- Documentation throughput 158 / 244 / 373 tokens/s with and without EAGLE: stays attributed as a project claim with its conditions, now including batch size 1 from the paper's Table 4 (S10).
- B200 condition against section 8 and the Cross-section conditions block: consistent. Speculation with `--speculative-eagle-topk` unset leaves `trtllm_mha` (`arg_groups/model_override_base.py#L303-L315`); keeping it needs `--speculative-num-steps` and `--speculative-eagle-topk 1` set and `--page-size` unset (`utils/common.py#L4014-L4020`, S2), which section 8 also states.
