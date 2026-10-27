# fc07-par-pd: fact check of section 14 (Parallelism) and section 15 (PD Disaggregation)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d (`/tmp/sglang-src`). vLLM v0.31.0
(`/tmp/vllm-v0.31.0`). PR #40703 body and v0.5.22 release notes fetched with `gh api`. Checked 2026-10-24.
Paths below are relative to `python/sglang/srt/` unless they start with another top-level directory.

## Parallelism.tsx (section 14, Parallelism)

Claims checked: 72 (each count-table row counted once). CONFIRMED: 69.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| P1 | "network between the nodes: only the MoE exchange crosses it" (diagram label, svg title, prose "the MoE exchange is then the traffic that crosses the network") | Parallelism.tsx:112-118, 367, 713-716 | OVERREACH | Dense FFN layers with the default `moe_dense_tp_size` run on the full (gathered) layout and reduce over the whole TP group: layers/layer_boundary/factories.py#L120-L127, #L177-L187; parallel.py help "the FFN stays tensor parallel" arg_groups/fields/parallel.py#L81-L90. So in the 16-GPU, two-node layout dense FFN traffic also crosses nodes | Label and title now say the MoE exchange crosses the network and attention stays inside each node; prose drops the exclusive wording and adds that a dense feed-forward layer, tensor parallel over the whole TP group by default, crosses it too (cites parallel.py L81-L90). Harness re-run |
| P2 | SGLang prefill CP (`--attn-cp-size`) is "the counterpart" of vLLM PCP, with no note on GPU count | Parallelism.tsx:984-989 | OVERREACH | vLLM v0.31.0 `world_size = pp x tp x pcp`: https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py#L899-L903; SGLang attn CP carves the TP group: runtime_context.py#L73-L76, #L294-L299. A flag-name translation (`-tp 8 -pcp 2` to `--tp 8 --attn-cp-size 2`) halves the GPUs, against the section's own count-first rule | Added the GPU-count difference with the vLLM cite (`-tp 8 -pcp 2` is 16 GPUs, `--tp 8 --attn-cp-size 2` is 8) |
| P3 | vLLM MoE layers "sharded over TP x DP" | Parallelism.tsx:1085-1086 | WRONG (minor) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py#L134-L136 says "the product of the tensor, prefill-context, and data parallel sizes" | Now "TP x PCP x DP" |

Build-log open items for section 14, settled:
- 05 B2 (`ascend_tp`): CONFIRMED. `_A2A_EP_SPANNING_BACKENDS` lists every choice except `none` and `ascend_tp` (arg_groups/overrides.py#L1529-L1572 vs arg_groups/fields/exec_.py#L773-L806); `ascend_tp` is a non-all-to-all Ascend TP dispatcher (layers/moe/moe_runner/ascend.py#L171). The page's "DeepEP and the other all-to-all backends" and "with `none`, EP can be narrower" both hold.
- 05 A16 (docs say startup checks `tp % dcp`): CONFIRMED as written. The only `tp_size % dcp_size` check is `_check_xpu_dcp`, run only on Intel XPU (arg_groups/attention_hook.py#L63-L64, #L274-L275); no containment check exists; DCP groups are consecutive TP slices (distributed/parallel_state.py#L2711-L2720). The page states only the shared part.
- Rank arithmetic against codebase tab 5 and runtime_context.py: consistent. `--tp 8 --attn-dp-size 8 --ep 8` is 8 GPUs (runtime_context.py#L173-L178 world = offset + tp x pp; #L137-L157 attn_tp 1, moe_tp 1), 8 schedulers plus the DataParallelController because `num_dp_ranks = dp x attn_dp = 8 > 1` (entrypoints/engine.py#L904-L906, runtime_context.py#L202-L207), 11 processes by section 3's table. Rank layout DP outermost, TP fastest (runtime_context.py#L79-L92) matches tab 5's stop 3 and the diagram (groups of four consecutive ranks).
- `--tp`/`--dp` as argparse abbreviations: CONFIRMED. `argparse.ArgumentParser(prog="sglang serve")` keeps `allow_abbrev` (server_args.py#L665); `tp_size` and `dp_size` are the only fields starting with those prefixes; three `pp_*` fields make `--pp` ambiguous.

Score: **9/10**. Every number and default traces to a pinned line; the count table, map and translation rule agree with tab 5 and runtime_context.py. The diagram and prose now scope the cross-node claim to what the code shows; the payoff (count GPUs, then carve) lands first and last.

## PdDisaggregation.tsx (section 15, PD Disaggregation)

Claims checked: 84. CONFIRMED: 76.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| D1 | Intro: "Both servers get the request at once, so decode reserves pages and finishes its handshake before prefill has finished" with no policy condition | PdDisaggregation.tsx:403-405 | OVERREACH (Cross-section condition) | Under `prefill_complete` decode reserves and publishes destinations only after prefill signals completion: docs advanced_features/pd_disaggregation.mdx#L33-L35; disaggregation/common/conn.py#L799-L803; disaggregation/prefill.py#L1024-L1028 | Condition "under the default `early` policy" moved onto that sentence |
| D2 | Against vLLM: "both legs start at once, so the handshake is done before prefill finishes" with no policy condition | PdDisaggregation.tsx:997-998 | WRONG (contradicts Cross-section condition) | same as D1 | Now "so under the default `early` policy the handshake is done before prefill finishes" |
| D3 | Dense Llama-style model gets 1-token pages on H100 and 64-token pages on B200, no speculation condition | PdDisaggregation.tsx:677-683 | WRONG (Cross-section B200 page-size condition) | arg_groups/model_override_base.py#L303-L315 (trtllm_mha only when no spec or topk 1, and topk set); arg_groups/overrides.py#L1125-L1137 (trtllm_mha page 64); utils/common.py#L4014-L4020 | Added "when speculative decoding is off, or on with an explicit `--speculative-eagle-topk 1` and `--speculative-num-steps` set", plus the overrides.py L1125-L1137 cite |
| D4 | Registry answers 503 until `dp_size x attn_cp_size x attn_tp_size x pp_size` ranks are in | PdDisaggregation.tsx:462-463 | WRONG (ambiguous) | The registry's `dp_size` is the DP rank count, `attn_dp_size if system_dp_size == 1 else system_dp_size` (disaggregation/common/conn.py#L2724-L2725, #L2660). Read as `--dp-size`, the formula gives 1 rank for `--tp 8 --attn-dp-size 8` instead of 8 | Now "its DP rank count times `attn_cp_size x attn_tp_size x pp_size`" |
| D5 | DP routing on prefill is `bootstrap_room % dp_size` | PdDisaggregation.tsx:527-528 | WRONG (ambiguous) | `req.bootstrap_room % len(self.workers)` (managers/data_parallel_controller.py#L823-L832); workers = DP rank count, not `--dp-size` under attention DP | Now "`bootstrap_room` modulo the DP rank count" |
| D6 | PR #40703 benchmark conditions omit that optimistic prefill was 1 under both policies | PdDisaggregation.tsx:790-794 | OVERREACH (stated condition dropped) | https://github.com/sgl-project/sglang/pull/40703 "Only the allocation policy differed; optimistic prefill was 1 in both policies." The default is 0 (arg_groups/fields/disagg.py#L122-L124), so the `early` arm was not the default configuration | Condition added to the sentence |
| D7 | Heartbeat interval "floor 2" | PdDisaggregation.tsx:865 | UNSUPPORTED (by the cited lines) | Floor is at disaggregation/common/conn.py#L433-L439, outside environ.py L708-L709 and conn.py L1817-L1858 | Added the conn.py L433-L439 cite |
| D8 | First rendered use of NIXL (diagram caption) unexpanded; UCX unexpanded | PdDisaggregation.tsx:435, 313 | Prose rule (acronym) | CLAUDE.md Acronym Standard | NIXL expanded in the caption; "UCX (Unified Communication X)" |

Also improved (not a verdict change): the `mori` row cited only the MORI-EP docs row; added a code cite showing the PD backend imports `mori.io` (disaggregation/mori/conn.py#L17-L28).

Build-log open items for section 15, settled:
- PD handshake timing (05 F3 / 10 A14): re-derived, holds for `early` on every real backend (detail below).
- Page size and KV dtype must match: CONFIRMED, decode raises at disaggregation/common/conn.py#L1183-L1199. Allocation policy must match too (conn.py#L2213-L2229; registry rejects mixed prefill policies at #L2710-L2714).
- PR #40703 ran with DP attention, which v0.5.22's validator looks to reject: CONFIRMED by reading. `handle_deprecated_dp_attention` runs first (arg_groups/pipeline.py#L45) and declares `enable_dp_attention=False` (arg_groups/parallel_hook.py#L59-L61); `ResolvingConfig` returns declared values (arg_groups/model_override_base.py#L93-L113); the PD hook runs later (pipeline.py#L138) and computes `attn_dp_size = dp_size if enable_dp_attention else 1` = 1 (arg_groups/pd_disaggregation_hook.py#L214-L216), so any `--tp` above 1 adds "attention tensor parallelism greater than one". Not run.

PD handshake timing, re-derived at v0.5.22:
- Prefill side, all backends: a request leaves the bootstrap queue only when its sender polls `WaitingForInput`, unless it is an optimistic attempt (`prefill_attempt_count < optimistic_prefill_attempts`, default 0) or the policy is `prefill_complete` (disaggregation/prefill.py#L488-L526).
- Decode side: the receiver sends destination page indices only after preallocation (disaggregation/decode.py#L1417-L1452 then `_send_kv_metadata` #L1786-L1817).
- `mooncake` (and `mooncake_tcp`, rewritten to `mooncake` with `MC_FORCE_TCP=1`, arg_groups/pd_disaggregation_hook.py#L30-L41): `WaitingForInput` set when every decode rank's TransferInfo has arrived (disaggregation/mooncake/conn.py#L2943-L2962). Holds.
- `nixl`: same rule (disaggregation/nixl/conn.py#L3245-L3266); sender starts in `Bootstrapping` via `CommonKVSender.__init__` (common/conn.py#L1956). Holds.
- `mori`: same rule (disaggregation/mori/conn.py#L860-L896). Holds.
- `ascend`: `AscendKVSender(MooncakeKVSender)`, manager subclasses Mooncake's (disaggregation/ascend/conn.py#L95, #L518). Holds.
- `fake`: not applicable; a prefill server refuses it (pd_disaggregation_hook.py#L152-L155) and the fake sender reports an instant handshake (disaggregation/fake/conn.py#L61-L70).
- Exception under `early`: `--optimistic-prefill-attempts` above 0 lets prefill start, and possibly finish, before decode reserves; the request is parked (`pending_bootstrap`) until indices arrive (prefill.py#L1149-L1153).
- `prefill_complete` (Mooncake only): does not hold. Prefill computes without waiting, signals readiness after its final result (`mark_prefill_complete`, prefill.py#L1024-L1028, common/conn.py#L2003-L2012), decode gets `WaitingForInput` only from that signal (common/conn.py#L799-L803) and then reserves and publishes destinations. The handshake completes after prefill finishes.

Score: **9/10**. All quantitative claims cite pinned code, docs or the attributed PR, and project numbers keep their stated conditions. The handshake and page-size conditions now match the Cross-section block in both places they appear.

## Items for other owners (not edited)

- `codebase/CodebaseParallelPd.tsx` (tab 5, fc15) L421 writes the same registry count `dp_size x attn_cp_size x attn_tp_size x pp_size` as D4; the registry's `dp_size` is the DP rank count (common/conn.py#L2724-L2725), not `--dp-size`.
