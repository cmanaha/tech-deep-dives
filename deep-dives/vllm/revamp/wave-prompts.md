# Authoring wave prompts (orchestrator working file)

Every prompt starts with the COMMON block, then the file block. Slugs and ports are unique per
agent so parallel harness runs do not collide.

## COMMON

You are an authoring agent in a headless revamp of the vLLM deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm). Nobody will answer questions;
decide from the evidence. Never start a background Bash command. Do not spawn subagents. Do not
commit; the orchestrator commits. Write your first complete draft to disk early, then refine, so
progress survives an interruption.

Read and follow deep-dives/vllm/revamp/authoring-brief.md exactly (it lists the standards to read
first). Then read deep-dives/vllm/revamp/REVAMP-PLAN.md: the "Cross-file facts every author uses
the same way" block and the rows for your file.

## Wave 3

### CodebaseArchitecture (slug arch, port 4834)

You own exactly one file: deep-dives/vllm/src/sections/codebase/CodebaseArchitecture.tsx.
Treatment: EDIT (substantial; structure stays).

Register: deep-dives/vllm/research/2026-10-refresh/01-codebase-arch-config-rust.md, the
"CodebaseArchitecture.tsx" table (A1-A45) and its rows in sections 1-5, plus the errata section.
Verify in /tmp/vllm-new.

Must-dos: counts and provenance (A1-A3, A5, A25, A41); reword the `vllm/engine/` claim
(EngineArgs plus compatibility shims) and the "fully removed" claim (A4, A8); scope the
wire-format and zero-copy prose (A13, A18: msgpack on the ZMQ sockets, shared-memory pickle where
the register says so); fix the DP client table and the subclass sentence (A21, A23, A24); MRv2
label for the worker (A15) with the V1-engine vs Model-Runner-V2 naming hazard defused in one
sentence, linking the Execution tab for depth; GC section (A36, A37); add the renderer box and the
DP sync interval (A26, A39); drop "which is why" (A33, UNKNOWN). Rust is a separate process in
the map (A42-A45), linking the Rust tab rather than duplicating it.

Diagrams: `RepoMapDiagram` (relabel: counts, `models/`, `renderers/`, `vllm/engine/` = EngineArgs
+ shims, csrc contents, Rust as a separate process) and `ThreeProcessDiagram` (relabel: MRv2
worker, wire labels, add renderer). Harness: slug `arch`, port 4834,
`--sections codebase --tabs "Architecture & Module Map"`.

### CodebaseDistributed (slug dist, port 4835)

You own exactly one file: deep-dives/vllm/src/sections/codebase/CodebaseDistributed.tsx.
Treatment: EDIT (heavy).

Register: deep-dives/vllm/research/2026-10-refresh/03-codebase-distributed-advanced.md, section A
(D1-D53), section C (registered KV connector names), and sections 1-5 ("Recommended treatment",
CodebaseDistributed items 1-8). Verify in /tmp/vllm-new, especially
vllm/distributed/kv_transfer/kv_connector/factory.py, the nixl/ package, vllm/config/parallel.py
and vllm/distributed/device_communicators/.

Must-dos: re-pin all inline line citations (section 1 table). Rewrite the NIXL subsection around
pull (`NixlConnector`, an alias of `NixlPullConnector`) and push (`NixlPushConnector`) modes:
who registers memory, who initiates the transfer, what the proxy forwards (D30-D40). `kv_both`
is deprecated for NIXL: use `kv_producer` / `kv_consumer`. Connector zoo: delete
`P2pNcclConnector` (removed in v0.24.0), drop "Default for disaggregation", add
`NixlPushConnector` and `HiSparseConnector` (D24, D25, D29). All-reduce: replace the "four paths"
list and dispatch order (D13, D14), state the FlashInfer default and the two env vars (D15, D16),
and remove the "beats NCCL" claim unless the register gives a source (D17 is UNKNOWN: remove).
Parallel groups: drop "lazily" (D6), update the globals list (D7), fix the DCP-as-axis framing
(D11), `_EP` is MoE-only (D9). Executor: `mp` is the multi-node default with `--nnodes`; Ray is
used inside a Ray placement group or with `--distributed-executor-backend ray` (D48, cross-file
fact; code wins over the docs, mark that with kind="doc-code-conflict" where you cite the docs);
fix the Ray communicator framing (D12). EPLB / elastic EP: async default and constraints (D51,
D52). Do NOT ship D36 or D53 (UCX vs LIBFABRIC on AWS) as fact: say UCX is the default backend
and that other NIXL backends are selected through `kv_connector_extra_config.backends`, and link
the EFA dive (`../efa/`) for the fabric.

Diagrams: `NixlTransferFlowDiagram` (add a push-mode panel next to pull) and
`ParallelGroupTopologyDiagram` (keep; optional EP/DCP caption). Harness: slug `dist`, port 4835,
`--sections codebase --tabs "Distributed & KV Transfer"`.

### CodebaseModelLayer (slug model, port 4836)

You own exactly one file: deep-dives/vllm/src/sections/codebase/CodebaseModelLayer.tsx.
Treatment: EDIT.

Register: deep-dives/vllm/research/2026-10-refresh/02-codebase-scheduler-exec-model.md, the
"CodebaseModelLayer.tsx" table (M-rows) and sections 1-5 ("Recommended treatment",
CodebaseModelLayer row). Verify in /tmp/vllm-new, especially vllm/model_executor/models/registry.py,
vllm/models/, vllm/model_executor/layers/quantization/ and vllm/lora/.

Must-dos: registry: architecture loop (M7), the count of about 390 (M3), package-hash and
`find_spec` nuance (M10), scope sentence (M2), drop "seconds of startup" (M5 is UNKNOWN). Add one
block on the two homes for model code (`vllm/models/`, M30) and the Transformers backend with
`--model-impl` (M31), plus the removed and out-of-tree architecture errors (M32). Add-a-model box:
plugin entry point and the registration-doc conflict (M14, M33; use kind="doc-code-conflict").
Quantization: `resolve_quant_method` and online targets (M17), the chooser rule and
`--linear-backend` (M19), the eight-entry FP8-block list (M20), missing list names (M21). LoRA:
rewrite the shrink / all-gather / expand block as the fully-sharded path and describe the default
`add_lora_linear` path (M23). Optional footnotes only if they pass the section-shape test: custom
ops / pluggable layers (M34), vLLM IR (M35). Quantization formats and hardware tiers are covered
by section 8 (Quantization); link it rather than duplicating.

Diagrams: `RegistryDiagram` (counts, two homes for model code, `--model-impl`) and
`QuantDispatchDiagram` (check; targeted online quantization). Harness: slug `model`, port 4836,
`--sections codebase --tabs "Model Layer"` (the harness splits `--tabs` on commas, so pass the
prefix only).

## Wave 4

### V1Architecture (slug v1, port 4837)

You own exactly one file: deep-dives/vllm/src/sections/V1Architecture.tsx. Treatment: EDIT.
Register: deep-dives/vllm/research/2026-10-refresh/04-core-engine.md, the "V1Architecture.tsx"
table (V-rows) and sections 1-5. Must-dos: scope the 1.7x figure and label it as the project's
claim (V3); mark "near-zero" prefix-cache overhead as a project claim (V11); rewrite the
structured-output row (default `auto` with an xgrammar-to-guidance fallback; the real silent
behaviour is `guided_*` fields being ignored) (V17, V22); drop the `swap_space` advice (V16);
correct the one-worker-per-GPU claim for single GPU (V19); add the naming note that the "V1
engine" (process architecture) and Model Runner V2 (the default GPU execution layer since v0.29,
inside V1) are different axes, linking the codebase Execution tab (V20); one line on the DP
coordinator (V21); re-pin links and accessed lines. Diagram: the inline process-split SVG (check
labels; title/aria pattern). Harness: slug `v1`, port 4837, `--sections v1-arch`.

### SchedulerBatching (slug sb, port 4838)

You own exactly one file: deep-dives/vllm/src/sections/SchedulerBatching.tsx. Treatment: EDIT.
Register: 04-core-engine.md, the "SchedulerBatching.tsx" table (SB-rows) and sections 1-5.
Must-dos: fix the `ContinuousBatchingTimeline` FCFS order and R4 timing (SB2); replace the V0
preemption log line with the V1 signals, the "Preemptions:" stats log field and
`vllm:num_preemptions`; preemption is recompute-only (SB13, SB14, SB20, cross-file fact); reword
`gpu_memory_utilization` (SB16); the real `vllm serve` defaults tiered by GPU memory (SB-N1,
cross-file fact: 16384 / 1024 at 160 GiB or more, 8192 / 1024 on H100-class, 2048 / 256
otherwise, 2048 / 128 are class fallbacks); a knobs table (SB-N2, N3, N4, N6, N7:
`--max-num-active-seqs`, admission control `--max-num-queued-reqs` / `--max-num-queued-tokens`
returning HTTP 503, adaptive `--long-prefill-token-threshold`, KV watermark); one line on the
KV-holding waiting queue (SB-N5). Link the codebase Scheduler tab for code depth rather than
duplicating it. Harness: slug `sb`, port 4838, `--sections scheduler`.

### PagedAttentionKV (slug paged, port 4839)

You own exactly one file: deep-dives/vllm/src/sections/PagedAttentionKV.tsx. Treatment: EDIT.
Register: 04-core-engine.md, the "PagedAttentionKV.tsx" table (PA-rows) and sections 1-5.
Must-dos: retitle the h1 to "5. Paged KV Cache &amp; Block Tables" (the orchestrator renames the
nav to match) and frame the section around the paged KV memory model, which is unchanged; the
CUDA PagedAttention kernels were deleted in v0.25.0 (#47361), footnoted, and today's attention
backends read the paged layout (PA2, PA-N1). Redraw `BlockTableMappingDiagram` so shared blocks
sit at the same logical index (PA7). Scope copy-on-write (PA9, PA18). `block_size` is resolved by
the attention backend (PA13). Fix the PA17 clause. Add hybrid KV groups (PA-N2), KV dtype
(PA-N3), the startup max-concurrency log line (PA-N4) and the KV pool size flag (PA-N5: the
flag is `--kv-cache-memory-bytes`, arg_utils.py L1332, while docs/configuration/optimization.md
writes `--kv-cache-memory`; check whether vLLM's argument parser accepts the abbreviation and
mark the docs-vs-code difference).
Hardware memory tiers belong to the Silicon, Memory & Inference dive: link it, do not duplicate.
Harness: slug `paged`, port 4839, `--sections paged`.

## Wave 5

### PrefixCaching (slug prefix, port 4840)

You own exactly one file: deep-dives/vllm/src/sections/PrefixCaching.tsx. Treatment: EDIT.
Register: 04-core-engine.md, the "PrefixCaching.tsx" table (PC-rows) and sections 1-5. Must-dos:
source-tagged extra keys, including the LoRA path (PC6); rewrite the reproducibility expandable:
the NONE_HASH seed is deterministic for sha256 since v0.29.0 (#51875), xxhash variants still need
PYTHONHASHSEED (PC16-PC18, PC-N2, cross-file fact); label the project claims (PC2, PC12); name the
hit-rate metrics (PC15); hybrid-model checkpoints (PC-N1); `/reset_prefix_cache` (PC-N3); move
blog links to the new blog host. Diagram `PrefixReuseDiagram`: keep, fix the title/aria pattern if
needed. Harness: slug `prefix`, port 4840, `--sections prefix`.

### Quantization (slug quant, port 4841)

You own exactly one file: deep-dives/vllm/src/sections/Quantization.tsx. Treatment: EDIT.
Register: 04-core-engine.md, the "Quantization.tsx" table (Q-rows) and sections 1-5. Must-dos:
move the bitsandbytes and GGUF rows to "plugins" (Q8, Q9, Q15); GPTQ `desc_act` caveat (Q6);
`fp8_per_tensor` for online FP8 and the `fp8` deprecation (Q11, Q20, Q22); Volta has no FP8
(Q16); fix the AMD caption (Q17); `calculate_kv_scales` is removed (Q21); FP4/MX can run online
(Q13); fix `DecisionDiagram` leaves (Q24: Blackwell, Volta, plugins); fix the 1.6x link and its
project-claim label (Q23); add the online path (Q-N1), the upgrade-removals list (Q-N2),
deprecations (Q-N3) and plugins (Q-N4). Number formats and silicon belong to the Silicon, Memory
& Inference dive: link it. Harness: slug `quant`, port 4841, `--sections quant`.

### SpeculativeDecoding (slug spec, port 4842)

You own exactly one file: deep-dives/vllm/src/sections/SpeculativeDecoding.tsx. Treatment: EDIT
(heavy). Register: deep-dives/vllm/research/2026-10-refresh/06-core-features.md, the
"SpeculativeDecoding.tsx" table (S-rows) and the sections after it. Also read the CodebaseAdvanced
spec-decode block (already rewritten) so the two agree. Must-dos: `rejection_sample_method`
values `standard`, `synthetic`, `block` and the default (S2; the old docs enum conflicts: mark
kind="doc-code-conflict"); the methods table gains a "Runs on" column (MRv2 or the deprecated V1
runner; six methods, ngram, ngram_gpu, suffix, medusa, mlp_speculator, custom_class, run on the
V1 runner, removal targeted for v0.32) (S4, S16); add DFlash / DSpark / LiLiCorr (S17); reframe
the throughput warning around dynamic speculative decoding (S10); short adaptive-verification and
per-request-metrics blocks (S18, S19); PP composes with spec decode (S21); quote fixes (S8); drop
the n-gram strength claim (S5 is UNKNOWN); TLI on MRv2 is unverified (S20): do not claim it.
Diagram `ProposeVerifyAcceptDiagram`: keep (standard rejection sampling); caption notes that
adaptive verification makes K a ceiling. Harness: slug `spec`, port 4842, `--sections spec-decode`.

## Wave 6

### OpenAICompatServer (slug server, port 4843)

You own exactly one file: deep-dives/vllm/src/sections/OpenAICompatServer.tsx. Treatment: EDIT
(heavy). Register: 06-core-features.md, the "OpenAICompatServer.tsx" table (O-rows) and the
sections after it. Must-dos: delete the `strict` no-op warning and table row, add
`--tool-strict-level` (O21, O19); `--api-key` guards only `/v1`, `/v2`, `/inference` and
`/cohere` (O3); scale-out and dev endpoints (O10); admission control returns HTTP 503 (O33);
per-request `mm_processor_kwargs` need `--trust-request-mm-kwargs` (O27); `X-Vllm-Priority` and
drop "only" (O28 is docstring-only: say so, do not claim executed behaviour, O32); fix the Rust
frontend overclaim (O34; the Rust tab is already rewritten, read it so the two agree); attribution
fix (O13); route additions on `EndpointSurfaceDiagram` and the table (O7: Responses retrieve and
cancel, batch, scale-out routes); deprecated `api_server` module (O4); repoint links (O11, O30).
Harness: slug `server`, port 4843, `--sections server`.

### DisaggregatedServing (slug disagg, port 4844)

You own exactly one file: deep-dives/vllm/src/sections/DisaggregatedServing.tsx. Treatment: EDIT
(heavy; connector subsection rewrite). Register: 06-core-features.md, the
"DisaggregatedServing.tsx" table (X-rows) and the sections after it. Also read the
CodebaseDistributed NIXL block (already rewritten) so the two agree. Must-dos: rewrite the
connector subsection around NIXL pull (`NixlConnector` = `NixlPullConnector`, the decoder issues
RDMA reads) vs push (`NixlPushConnector`, v0.24.0) (X9) with a NEW `NixlPullPushDiagram`
sequence diagram (who registers memory, who initiates, what the proxy forwards; X9, X15, X17);
drop `P2pNcclConnector` from the list and `DisaggDiagram` (removed in v0.24.0; X5, X6); `kv_both`
is deprecated for NIXL: `kv_producer` / `kv_consumer` (X10; the disagg docs still show `kv_both`:
kind="doc-code-conflict"); layout names LBHNC / LBNHC (X13); move the reasoning hazard to
bidirectional transfer (X14, X18); compatibility matrix (X17; the v0.27 notes and the v0.31
matrix disagree on hybrid block sizes: state it); E/P/D pointer (X19); transport label scope
(X8, X11). The fabric belongs to the EFA dive: link `../efa/`. Harness: slug `disagg`, port 4844,
`--sections disagg`.

### DistributedInference (slug distinf, port 4845)

You own exactly one file: deep-dives/vllm/src/sections/DistributedInference.tsx. Treatment: EDIT.
Register: 06-core-features.md, the "DistributedInference.tsx" table (D- rows) and the sections
after it. Must-dos: "four axes" becomes four plus decode / prefill context parallelism (DCP / PCP)
(D-1, D-14); the multi-node executor default is `mp` with `--nnodes`; Ray is used only inside a
Ray placement group or with `--distributed-executor-backend ray` (D-17; the docs say otherwise:
kind="doc-code-conflict"); separate EPLB from `--all2all-backend` (D-16, D-6); DP deployment
modes (D-12); one-liners for the FlashInfer all-reduce, sequence parallelism (forces the V1 runner
with TP > 1), DBO and fault tolerance (D-3, D-20, D-22, D-21). Diagram: the inline TP x PP SVG
(keep; title/aria pattern). Harness: slug `distinf`, port 4845, `--sections distributed`.

## FOOTER (every prompt)

Use role="img" plus aria-labelledby with ONE title id. Verify rendered output with the harness
from the brief. Read the PNGs of every diagram you touched and fix any collision, clipping or
illegibility. Return only the report the brief asks for (at most 200 words).
