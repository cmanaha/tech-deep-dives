# Authoring wave prompts (orchestrator working file)

Waves 3 to 12.

Every prompt starts with the COMMON block, then the file block. Slugs and ports are unique per
agent so parallel harness runs do not collide.

## COMMON

You are an authoring agent in a headless revamp of the vLLM deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm). Nobody will answer questions;
decide from the evidence. Background mode and subagents are allowed. Do not
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
(X8, X11). The fabric belongs to the EFA dive: link `../efa/`. Section 7 is titled "7. KV-Cache
Offloading & Tiers": update the cross-reference near line 314. Harness: slug `disagg`, port 4844,
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

## Wave 7

### LoRAServing (slug lora, port 4846)

You own exactly one file: deep-dives/vllm/src/sections/LoRAServing.tsx. Treatment: EDIT (medium).
Register: deep-dives/vllm/research/2026-10-refresh/06-core-features.md, the "LoRAServing.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: a defaults column and the `--max-loras 3` note on the diagram, since the default is 1 (L9); fix the docs quote verb (L6); route registration is gated, not a no-op (L12); runtime constraints, `load_inplace`, resolver plugins (L14, L15); the LoRA ID enters the prefix-cache block hash (L19); one MRv2 line (L20); kernel naming (L3); adapter size as the formula, or cut (L1 is UNKNOWN: no range ships); gateway protocol pinned to GIE v1.6.2; L16 (DP fan-out of runtime LoRA load) is untraced: do not claim it. Diagram: `MixedBatchDiagram` (show `--max-loras 3` in the picture and say the default is 1). Harness: slug `lora`, port 4846,
`--sections lora`.

### RayServeLLM (slug ray, port 4847)

You own exactly one file: deep-dives/vllm/src/sections/RayServeLLM.tsx. Treatment: EDIT (one conceptual fix).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "RayServeLLM.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: rewrite every "vLLM defaults to Ray for multi-node" passage (five places) to the code behaviour: the multi-node executor default is `mp` with `--nnodes`; Ray is used inside a Ray placement group or with `--distributed-executor-backend ray`; vLLM's docs say otherwise, so cite them with kind="doc-code-conflict" and the code as the authority. Replace the PDProxyServer paragraph with the decode-orchestrated PD flow; `build_openai_app(LLMServingArgs)`; `OpenAiIngress` replaces the LLMRouter story; add that `ray[llm]` 2.59.0 pins vLLM 0.27.0 (no orchestrator pins v0.31.0), the SGLang backend, prefix/KV-aware routers; re-pin docs to `releases-2.59.0`. Replace any "PagedAttention" capability phrase with paged KV wording (the legacy kernel was removed in v0.25.0). Diagram: the inline SVG (engine box; footer: Ray inside a placement group). Harness: slug `ray`, port 4847,
`--sections ray`.

### WhenNotVllm (slug alt, port 4848)

You own exactly one file: deep-dives/vllm/src/sections/WhenNotVllm.tsx. Treatment: EDIT (heavy on two engines).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "WhenNotVllm.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: TensorRT-LLM: the default backend is PyTorch (no compile step); rewrite its row, the "Pick TensorRT-LLM" box, the deep-dive note and the tree branch. TGI: the repository is archived (last release v3.3.7). Dynamo and llm-d wrap vLLM, SGLang and TensorRT-LLM, not TGI. Add Moore Threads MUSA (SGLang) and Apple Silicon via vLLM-Metal if the register sources it. One line each for vLLM's new counterweights (diffusion LLMs, watermarking, preload/snapshot) only where they change a choice. Consider a local-engine branch (llama.cpp, Ollama, MLX) only if the register sources it. Drop the comparative UNKNOWNs. Paged KV wording instead of "PagedAttention" as a capability. Diagram: `DecisionTreeDiagram` (TensorRT-LLM branch, TGI archived). Harness: slug `alt`, port 4848,
`--sections alternatives`.

## Wave 8

### ProductionStack (slug pstack, port 4849)

You own exactly one file: deep-dives/vllm/src/sections/ProductionStack.tsx. Treatment: EDIT (heavy).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "ProductionStack.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: rewrite the routing-strategies table and the "Two routers" alert around code: production-stack `vllm-stack-0.1.13` ships eight routing logics (roundrobin, session, prefixaware, kvaware, loadaware, priority, disaggregated_prefill, disaggregated_prefill_orchestrated); the bundled router is Python; the README "WIP" label is a docs-vs-code conflict. Split KV-aware (LMCache controller) from the Rust router's consistent hashing / cache_aware. Observability is opt-in. Note the optional Go operator. Fix the production-stack vs llm-d comparison rows. The router blog is Tier 2. Practical warning: its scraper reads the pre-rename `vllm:gpu_cache_usage_perc` and its bundled hit-rate panel queries `vllm:gpu_prefix_cache_*_total`, neither emitted by v0.31.0 (state this as inference from code, not run). Diagram: `DeploymentShapeDiagram` (relabel the eight routing logics). Harness: slug `pstack`, port 4849,
`--sections prod-stack`.

### LlmdKServe (slug llmd, port 4850)

You own exactly one file: deep-dives/vllm/src/sections/LlmdKServe.tsx. Treatment: EDIT (heavy).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "LlmdKServe.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: the EPP lives in llm-d Router v1.0.0 (renamed from llm-d-inference-scheduler; moved out of GIE at v1.6.0); GIE is GA since v1.0.0, current v1.6.2; EPP metric names `llm_d_epp_*`; the disaggregation flow is decode-first with a sidecar beside the decoder; `LLMInferenceServiceConfig` (not LLMInferenceConfig), API `serving.kserve.io/v1alpha2`; fix the production-stack vs EPP shared-metrics claim (row 21); refresh GIE quotes; drop "PagedAttention" as a capability; add standalone mode, InferenceObjective, new scorers, the KServe KV-offload spec; llm-d v0.10.0 ships the vLLM v0.30.0 image and runs upstream vLLM images. Diagram: `GatewayRoutingDiagram` (EPP in llm-d Router; decode-first sidecar). Harness: slug `llmd`, port 4850,
`--sections llm-d`.

### NvidiaDynamo (slug dynamo, port 4851)

You own exactly one file: deep-dives/vllm/src/sections/NvidiaDynamo.tsx. Treatment: EDIT (moderate).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "NvidiaDynamo.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: pin to v1.5.1; current component names (KV-Aware Router, SLA Planner, KVBM, ModelExpress, Grove); fix the kv_role claim (Dynamo does not assign roles; the phase comes from `--disaggregation-mode`, the role from the `--kv-transfer-config` you pass; its examples use `kv_both`, which vLLM v0.31.0 deprecates for NIXL); state that `ai-dynamo[vllm]` 1.5.1 installs vLLM 0.28.0; add the Dynamo GAIE EPP integration; KV row: vLLM's in-tree tiered OffloadingConnector or LMCache; date the May-2025 llm-d plans as planned and unverified; paged KV wording. Diagram: `DynamoDiagram` (current component names). Harness: slug `dynamo`, port 4851,
`--sections dynamo`.

## Wave 9

### OperationsFailureModes (slug ops, port 4852)

You own exactly one file: deep-dives/vllm/src/sections/OperationsFailureModes.tsx. Treatment: EDIT (heavy; cold-start block).
Register: deep-dives/vllm/research/2026-10-refresh/08-framing-ops-decision.md, the "OperationsFailureModes.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: replace the V0 preemption log line with the V1 signals (the "Preemptions:" stats log field and `vllm:num_preemptions`; preemption is recompute-only) (O1, O3); watermark and active-seqs levers (O4); a cold-start block with a NEW `RestartLadderDiagram`: cold boot, compile-cache reuse, `--kv-cache-memory-bytes`, `vllm preload` + `--load-format ipc_cache`, `vllm snapshot` (CRIU), the ready timeout, and what each rung skips (O8, O9, O20, O21); fix the `graph.replay()` path (O11); client disconnect is code-cited, detected via `finished_reason="abort"` (O16); LiteLLM incident tier (O17); rows for admission-control HTTP 503 (O22), `--device-ids` and the env cache frozen at engine start (O24, O25); reword the "The problem:" opener; fix the dead conserving-memory URL and re-pin every DOCS constant (O30). Diagram: NEW `RestartLadderDiagram` (inline SVG; every time or count on it must be cited in the prose; otherwise label it "Illustrative, not measured"). Harness: slug `ops`, port 4852,
`--sections ops`.

### ObservabilityBench (slug obs, port 4853)

You own exactly one file: deep-dives/vllm/src/sections/ObservabilityBench.tsx. Treatment: EDIT (moderate).
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "ObservabilityBench.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: all ten metric names hold; fix the ITL-as-TPOT gloss (two places) using the v0.31.0 metrics design doc; replace the in-repo `benchmarks/` claim with `vllm bench serve|latency|throughput|sweep|startup`; update the GuideLLM command to `guidellm run --backend kind=openai_http,...` (v0.8.1); add rows for `num_requests_waiting_by_reason`, `request_num_preemptions`, `tool_call_parser_invocations_total`, KV-offload/tiering metrics, per-request spec-decode metrics, `vllm-bench`; re-pin the examples and bump `ACCESSED` to 2026-10-16. Diagram: `MetricsPipelineDiagram` (load-generator labels). Harness: slug `obs`, port 4853,
`--sections observability`.

### GatewaysAppLayer (slug gw, port 4854)

You own exactly one file: deep-dives/vllm/src/sections/GatewaysAppLayer.tsx. Treatment: KEEP + small EDIT.
Register: deep-dives/vllm/research/2026-10-refresh/05-ecosystem.md, the "GatewaysAppLayer.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: pin docs links to v0.31.0; tighten the LiteLLM incident box with first-party facts from the register (affected versions, window, Docker image unaffected, clean version) and fix its tier label; optional paragraph on `/v1/messages` and `/v1/responses`; name the LangChain / LlamaIndex vLLM wrappers only if the register sources the class names (otherwise leave them unnamed). Diagram: none expected; fix the title/aria pattern if any SVG exists. Harness: slug `gw`, port 4854,
`--sections gateways`.

## Wave 10

### AwsEks (slug eks, port 4855)

You own exactly one file: deep-dives/vllm/src/sections/AwsEks.tsx. Treatment: EDIT (heavy).
Register: deep-dives/vllm/research/2026-10-refresh/07-aws.md, the "AwsEks.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: (1) replace the "Karpenter cannot do placement groups" story everywhere with Karpenter `placementGroupSelector` (v1.11.0+) (E1-E6, D1); (2) EKS URL x5 to `ml-inference-load-serve-model.html` (E7); (3) "throughput gauges" become counters (E14); (4) `consolidateAfter` 60m (E16); (5) the llm-d benchmark hardware is `ml.p6-b200.48xlarge` only (E20); do not attribute DisaggregatedSet to the llm-d blog (E22); (6) DisaggregatedSet shipped in LWS v1.0.0 (E21); (7) Spot "up to 90%" as an AWS claim (E25) and `ipc_cache` / `vllm preload` for cold start (E26). EKS topology labels enablement is UNKNOWN: do not claim it. Diagram: `EksRequestProvisioningDiagram` (the Karpenter `placementGroupSelector` path replaces the managed-node-group-only branch). Harness: slug `eks`, port 4855,
`--sections eks`.

### AwsSageMakerBedrock (slug sm, port 4856)

You own exactly one file: deep-dives/vllm/src/sections/AwsSageMakerBedrock.tsx. Treatment: EDIT (heavy; two subsections rewritten).
Register: deep-dives/vllm/research/2026-10-refresh/07-aws.md, the "AwsSageMakerBedrock.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: follow the register's treatment list exactly: detailed observability scrapes vLLM metrics and LMI V30 serves `/metrics` (S36); LMI V30 = vLLM 0.31.0, rewrite the version table and the "lags upstream" claims (S12, S13, S41); async mode as the Path A default everywhere (S4, S5, S55); 25 MB payload (S18, S22); the in-tree SageMaker router with stateful sessions replaces the "open RFC" paragraph (S24, S25); `sagemaker-entrypoint.sh` lives in vLLM, and model-hosting-container-standards is the Python library its route imports (S42); HyperPod: no Karpenter, native `pdSpec` P/D, Inference Gateway (S30, S32, D7); Spot cell, drop the unsourced 15-40% premium (S37, S38); Custom Model Import in the decision tree (S46, D5); cite the AWS decision guide (S45); fused_moe_lora on H200 (S52); cross-ref "13, 10, 4" (S54); hedge or drop the Trainium-for-Amazon-models claim (S44); OpenAI-compatible path and prefix-aware routing (S47, S48); fix the DLC link (S7). The 10 s metric resolution (S28) and "multi-node requires EFA" (S30) are UNKNOWN: drop them. Diagram: `SageMakerPathsDiagram`, `BedrockVsSelfHostDiagram`, `SageMakerHostingSurfaceDiagram` per the diagram audit; `LmiConfigToEngineDiagram` keep. Harness: slug `sm`, port 4856,
`--sections sagemaker`.

### AwsGpuEfaNixl (slug gpuefa, port 4857)

You own exactly one file: deep-dives/vllm/src/sections/AwsGpuEfaNixl.tsx. Treatment: EDIT.
Register: deep-dives/vllm/research/2026-10-refresh/07-aws.md, the "AwsGpuEfaNixl.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: (1) "push" becomes decoder pull / RDMA READ by default; add `NixlPushConnector` (G9, G28, D2); read the already rewritten DisaggregatedServing and CodebaseDistributed NIXL blocks so the three agree; (2) `kv_both` is deprecated, use `kv_producer` / `kv_consumer` (G11); (3) the connector is a package (G13); (4) add AL2023 (G16); unpin the EFA installer version (G17, G29); (5) tier labels (G8) and the misquote (G24); (6) P5e, P6e-GB200, P6e-GB300 rows (G4), holding the P6e-GB200 EFA figure (UNKNOWN); (7) drop the "not re-verified" warning (G6). Do not ship UCX vs LIBFABRIC performance on AWS as fact (UNKNOWN). Fabric internals belong to the EFA dive: cross-link `../efa/` (G27). Diagram: `KvDataPathDiagram` (roles `kv_producer` / `kv_consumer`; pull by default, decoder issues RDMA READs). Harness: slug `gpuefa`, port 4857,
`--sections gpu-efa`.

## Wave 11

### AwsNeuron (slug neuron, port 4858)

You own exactly one file: deep-dives/vllm/src/sections/AwsNeuron.tsx. Treatment: REWRITE.
Register: deep-dives/vllm/research/2026-10-refresh/07-aws.md, the "AwsNeuron.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: rebuild around "vllm-neuron 1.x plugin (current) vs 0.5.x + NxD Inference (maintenance)": the 1.x plugin ships its own model code with no NxD Inference dependency, and NxDI is in maintenance mode (N1-N4, D3). The feature matrix flips: LoRA off; EAGLE3 on; MTP off; P/D, multimodal and the new quantization keys on (N14, N15, N17, N18, N20). Versions: Neuron 2.32.0; the plugin (tag v0.24.0.1.1.0) pins vLLM 0.24.0 (N7, N10). The legacy fork is archived and the v0.10.1 install page has no successor (N21, N22, N26). Keep the Rufus proof point (N23) and the instance guidance that holds (N11-N13, N16, N19). Resolve or drop N9 and N24. Silicon details belong to the Silicon, Memory & Inference dive: link it. Diagram: `NeuronStackDiagram` (delete the NxD Inference layer for the 1.x plugin; show the 0.5.x path as maintenance). Harness: slug `neuron`, port 4858,
`--sections neuron`.

### Ec2TopologyPlacement (slug topo, port 4859)

You own exactly one file: deep-dives/vllm/src/sections/Ec2TopologyPlacement.tsx. Treatment: EDIT (light).
Register: deep-dives/vllm/research/2026-10-refresh/07-aws.md, the "Ec2TopologyPlacement.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: (1) two read-only APIs: add `DescribeCapacityReservationTopology` to the table and the diagram (T1); (2) node IDs are per-account hashes (T22); (3) rework the Kubernetes scheduler gotcha: the llm-d EPP has topology affinity at host, rack and zone level from pod labels, while proximity between nodes is still a launch-time decision (T27); (4) the leaf-index and layer-label warning (T26, D9), the `topology.k8s.aws/network-node-layer-<n>` node labels (T28) and Karpenter `placementGroupSelector` in the playbook (T29); (5) one line on `capacityBlockId` / UltraServer Capacity Blocks, cross-linking the EFA dive's topology section (T30). Refresh the accessed dates. Diagram: `ControlVsObserveDiagram` (add the node-label / EPP topology-scorer consumer boxes); `NetworkNodesDiagram` caption (P6-B200 / P6-B300 report four layers). Harness: slug `topo`, port 4859,
`--sections topology`.

### DecisionGuide (slug decision, port 4860)

You own exactly one file: deep-dives/vllm/src/sections/DecisionGuide.tsx. Treatment: EDIT (tree branch fixes).
Register: deep-dives/vllm/research/2026-10-refresh/08-framing-ops-decision.md, the "DecisionGuide.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: read every section the guide summarises (all are rewritten by now) so the guide agrees with them. Fix the tree's Ray branch (`vllm serve --nnodes` runs multi-node without Ray) (D1) and disaggregation exclusivity (not llm-d-only) (D5, D6) plus two geometry defects; KV-offload row (vLLM's native tiers; LMCache is one backend) (D11); spec-decode row with dynamic speculative decoding (D9); DP dense-only qualifier (D12); label the Neuron price claim as a vendor claim or drop it (D15); Karpenter placement-group note (D17); tiered `vllm serve` defaults for batched tokens and sequences, block-size caveat (D18, D20, D21); preemption signal (D22); re-pin links. Diagram: `StartHereTree` (fix the Ray branch, the disaggregation branch and the two geometry defects). Harness: slug `decision`, port 4860,
`--sections decision`.

## Wave 12

### ThesisAndFraming (slug thesis, port 4861)

You own exactly one file: deep-dives/vllm/src/sections/ThesisAndFraming.tsx. Treatment: EDIT.
Register: deep-dives/vllm/research/2026-10-refresh/08-framing-ops-decision.md, the "ThesisAndFraming.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: read the finished dive first (App.tsx nav plus the h1 and first paragraph of every section) so the framing matches it. Paged KV wording (T2); class names `AsyncLLM` / MRv2 (T7); qualify "de-facto" or drop it (T8 is UNKNOWN); add the MRv2 shift beside V0 -> V1 (T14, T15); release-tag pin wording ("pinned to the v0.31.0 release tag") (T18); one sentence on the replaceable API server (Python or Rust frontend) (T22); re-pin links and dates (T21). The "Virtual Large Language Model" expansion is unsourced: do not use it. Diagram: `StackDiagram` (flex boxes; optional "Python or Rust frontend" sub-label). Harness: slug `thesis`, port 4861,
`--sections thesis`.

### InferenceWorkload (slug workload, port 4862)

You own exactly one file: deep-dives/vllm/src/sections/InferenceWorkload.tsx. Treatment: KEEP + small EDIT.
Register: deep-dives/vllm/research/2026-10-refresh/08-framing-ops-decision.md, the "InferenceWorkload.tsx" table and the sections after it (pin and link audit, diagram audit,
recommended treatment). Must-dos: paged KV wording (W6, W8); the startup KV-capacity log line (W5); optional token-budget default (W4, tiered per the cross-file fact); re-pin links; fix the ITL label overlap in `PrefillDecodeTimeline`. Cross-references to section 5 use its new title "Paged KV Cache & Block Tables". Diagram: `PrefillDecodeTimeline` (fix the ITL label collision). Harness: slug `workload`, port 4862,
`--sections workload`.

## FOOTER (every prompt)

Use role="img" plus aria-labelledby with ONE title id. Verify rendered output with the harness
from the brief. Read the PNGs of every diagram you touched and fix any collision, clipping or
illegibility. Return only the report the brief asks for (at most 200 words).
