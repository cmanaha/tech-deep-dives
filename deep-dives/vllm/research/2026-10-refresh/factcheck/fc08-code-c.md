# fc08-code-c: fact-check of the codebase Distributed, Advanced and Rust tabs

Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read from `/tmp/vllm-new`
on 2026-10-18. Release notes from `/tmp/vllm-release-notes/`. Every `Cite` line range in the three
files was opened and read.

Files: `codebase/CodebaseDistributed.tsx`, `codebase/CodebaseAdvanced.tsx`,
`codebase/CodebaseRust.tsx` (all under `deep-dives/vllm/src/sections/`).

Status: complete. No diagram was changed in any of the three files, so the screenshot harness was
not run. `pnpm --filter @tech-deep-dives/vllm typecheck` and `lint` both exit 0.

## CodebaseRust.tsx

About 115 claims checked: 106 CONFIRMED, 7 UNSUPPORTED, 1 OVERREACH (plus one citation added
for an uncited Rust-side claim).

Scope at v0.31.0, from code: `vllm-rs` (bin of crate `vllm-cmd`) replaces only the Python
API-server process. It is enabled by `VLLM_USE_RUST_FRONTEND=1` (default 0,
`vllm/envs.py#L1441-L1449`), with no `vllm serve` flag; `VLLM_RUST_FRONTEND_PATH=auto` finds the
packaged binary or raises `FileNotFoundError` (`vllm/envs.py#L577-L609`). `vllm serve` launches
it through `RustFrontendProcessManager` (`vllm/v1/utils.py#L338-L411`) with
`addresses.inputs[0]` / `outputs[0]` (`vllm/entrypoints/cli/serve.py#L344-L375`), forces
`api_server_count=1` (`serve.py#L129-L134`). Rust artifacts are optional builds unless
`VLLM_REQUIRE_RUST_FRONTEND` is set (`setup.py#L69-L71`, `#L1518-L1521`).

Confirmed items include: 16 workspace crates, edition 2024 (`rust/Cargo.toml#L1-L24`), toolchain
1.95, 340 `.rs` files and 126,169 lines (our count); every crate-graph edge is the transitive
reduction of the `[dependencies]` tables (15 edges recomputed), the caption's extra direct deps
and the build-info / tracing users; subcommands frontend, serve, bench serve, render
(`rust/src/cmd/src/cli.rs#L90-L108`); Tokio cap 32 and mimalloc (`main.rs#L17-L44`); 58
`Option<Unsupported>` and 9 `Option<Noop>` fields in `unsupported.rs` (every named flag in the
table checked against its field); 21 tool parsers and 32 patterns (`tool/mod.rs#L67-L126`); 20
Control RPCs (`rust/proto/control.proto#L7-L37`); no route for embeddings, responses, messages or
audio (they appear only in the load-tracking list `middleware/load.rs#L22-L31`); no OpenTelemetry
dependency in any manifest; CORS defaults `["*"]`; `VLLM_API_KEY` env fallback; auth guards
`/v1`, `/v2`, `/inference`; gRPC server adds no auth layer (`lib.rs#L255-L261`).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| R1 | Frontend and engine exchange the same messages, "and the engine cannot tell which frontend it is serving" | CodebaseRust.tsx:534-535 | OVERREACH | `ModelConfig._resolve_mm_device_do_normalize` reads `VLLM_USE_RUST_FRONTEND` and forces `mm_device_do_normalize=False`: `vllm/config/model.py#L1037-L1063` | Replaced with: engine code is the same either way; the one engine-side switch is that ModelConfig forces `mm_device_do_normalize` off when the variable is set; cite added |
| R2 | Rust client uses "the two-byte little-endian engine index as the routing identity" | CodebaseRust.tsx:580-586 | UNSUPPORTED | `transport.rs#L15-L29` is imports and the sentinel; the identity encoding is at `rust/src/engine-core-client/src/transport.rs#L54-L72` | Added cite L54-L72 |
| R3 | TLS row: "The gRPC port reuses the same TLS settings"; "--enable-ssl-refresh is a hard error" | CodebaseRust.tsx:319-320 | UNSUPPORTED | `ssl.rs#L14-L41` carries only the flags; reuse at `rust/src/server/src/lib.rs#L238-L244`; hard error at `rust/src/cmd/src/cli/unsupported.rs#L596-L602` | Added both cites |
| R4 | LoRA HTTP routes "need VLLM_ALLOW_RUNTIME_LORA_UPDATING=1" | CodebaseRust.tsx:351-353 | UNSUPPORTED | `routes.rs#L110-L114` shows only the boolean; the env check is `rust/src/server/src/routes.rs#L44-L48` | Added cite L44-L48 |
| R5 | Admin/RL routes "Registered only with VLLM_SERVER_DEV_MODE=1" | CodebaseRust.tsx:395-396 | UNSUPPORTED | env check at `rust/src/server/src/routes.rs#L37-L42` | Added cite L37-L42 |
| R6 | "Standalone vllm-rs serve rejects those three" DP flags | CodebaseRust.tsx:416-418 | UNSUPPORTED | cited `vllm/v1/utils.py#L384-L392` is the Python strip; the hard errors are `unsupported.rs#L261-L289` | Added cite L261-L289 |
| R7 | Renderer row "Hugging Face renderer by default (Auto)" and "Auto resolves by model type" | CodebaseRust.tsx:362-364, 693-699 | UNSUPPORTED | L14-L33 is the enum only; `resolve()` mapping model types to native renderers, else `Hf`, is `rust/src/chat/src/renderer/selection.rs#L47-L60` | Both ranges widened to L14-L60 |
| R8 | Wire client "recognizes the literal ENGINE_CORE_DEAD frame" | CodebaseRust.tsx:703-705 | UNSUPPORTED | `core.py#L1088` is the Python sender only; Rust sentinel at `rust/src/engine-core-client/src/transport.rs#L27-L29` | Added cite L27-L29 |

Score: 9/10. Scope, switch and flag inventory are code-confirmed and the payoff (check your flags,
then switch) lands last. No diagram changed (the diagram's "same engine code either way" stays
accurate after R1).

## CodebaseDistributed.tsx

About 95 claims checked: 89 CONFIRMED, 3 UNSUPPORTED, 2 WRONG, 1 OVERREACH.

Cross-file check: executor default (`mp`, multi-node with `--nnodes`, Ray only with
`data_parallel_backend=ray` or inside a placement group, `config/parallel.py#L989-L1034`) and the
doc-code conflict (`docs/serving/parallelism_scaling.md#L33`) match DistributedInference.tsx and
the Cross-file facts block. NIXL pull (`NixlConnector` = `NixlPullConnector`) and push
(`NixlPushConnector`, v0.24.0 release notes #35264), `kv_both` deprecated for NIXL
(`nixl/connector.py#L94-L100`), roles and proxy forwarding match DisaggregatedServing.tsx. The 17
registered connector names match `factory.py#L153-L248`, and the tab names no removed connector.
The tab makes no all2all-backend claim, so it cannot contradict DistributedInference.tsx there.

Confirmed items include the 5-D rank grid and its order, the docstring TP=2/PP=4 example, EP group
spans DP x PCP x TP within a PP stage (diagram caption's `{g0,g1,g4,g5}` recomputed), DCP
regrouping, world size PP x TP x PCP, the full all-reduce dispatch order and TP-only gating
(`cuda_communicator.py#L50-L77`, `#L335-L408`), every env default in the table, FlashInfer
`auto` -> `mnnvl` with single-node `trtllm` fallback, the startup log line, base.py roles and
method lists, the experimental warning text, KVTransferConfig fields and defaults, NIXL extra-config
defaults (UCX, 30, 64, 480, `push_registration_timeout` = TTL), heartbeat `// 6`, 5 s handshake
timeout, the expired-lease log and metric, compat hash includes `transfer_mode`, file sizes
(3,750 / 13 / 12 lines), `RayExecutorV2` default via `VLLM_USE_RAY_V2_EXECUTOR_BACKEND` "1", EPLB
validation and defaults, elastic EP validation and the API-server cap.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| D1 | Group globals list incl. `_WORLD`, `_INNER_DP_WORLD` | CodebaseDistributed.tsx:488-495 | UNSUPPORTED | `_WORLD` / `_INNER_DP_WORLD` are at `vllm/distributed/parallel_state.py#L1446-L1447`, outside the cited L1544-L1641 | Range widened to L1446-L1641 |
| D2 | Handshake reply "is a NixlHandshakePayload: agent metadata plus the compatibility hash" | CodebaseDistributed.tsx:882-887 | UNSUPPORTED | Payload decode and hash check are at `nixl/base_worker.py#L1079-L1100`; cited range ended at L1068 | Range widened to L1049-L1087 |
| D3 | MLA: "a single remote rank suffices, including when the remote side runs DCP > 1" | CodebaseDistributed.tsx:936-938 | WRONG | With remote DCP > 1, `dcp_source_ranks` returns every remote rank whose DCP slice overlaps the local one (all of them when local DCP is 1): `vllm/distributed/kv_transfer/kv_connector/utils.py#L534-L552`, used at `nixl/tp_mapping.py#L88-L92` | Corrected: single remote rank for duplicated MLA; with remote DCP > 1 the decoder reads from each overlapping remote rank; cite added |
| D4 | EPLB communicator left unset "is NIXL when installed, else torch_gloo (pynccl under elastic EP)" | CodebaseDistributed.tsx:1122-1124 | WRONG | On XPU the default is `torch_xccl`: `vllm/config/parallel.py#L1061-L1063` (the same paragraph lists XPU as supported) | Added the XPU case |
| D5 | Push-only: "A pipeline-parallel prefiller with a hybrid KV cache" | CodebaseDistributed.tsx:186 | OVERREACH | Push supports PP with hybrid attention layouts, but rejects Mamba/SSM hybrids under PP: `nixl/base_worker.py#L784-L805` | Narrowed to hybrid attention KV cache, Mamba/SSM excluded; cite added to the evidence list |
| D6 | Elastic EP "runs on the V1 model runner" | CodebaseDistributed.tsx:1156 | UNSUPPORTED | No cite; `_get_v2_model_runner_unsupported_features` lists elastic EP: `vllm/config/vllm.py#L3051-L3098`, fallback at `#L752-L759` | Added cite and the reason |

Score: 9/10. Dense, code-cited and consistent with sections 9 and 10; the next-action block lands
last. No diagram changed.

## CodebaseAdvanced.tsx

About 110 claims checked: 106 CONFIRMED, 1 WRONG, 3 OVERREACH.

Cross-file check against SpeculativeDecoding.tsx: same MRv2 method set (eagle, eagle3, mtp,
draft_model, dflash, dspark, extract_hidden_states, `vllm/v1/worker/gpu/spec_decode/__init__.py#L8-L70`),
same six V1-only methods plus P-EAGLE/PARD parallel drafting (`vllm/config/vllm.py#L3073-L3092`),
same V2-only set (dspark, adaptive verification, DFlash candidate-head and mixed sliding/full drafts,
`#L3126-L3141`), and the mlp_speculator row now matches.

Confirmed items include the 8,597-line MRv2 spec_decode package, both dispatch cascades
(`gpu_model_runner.py#L604-L676`, `spec_decode/__init__.py`), the class hierarchy, 27 MTP model
types, the deprecation rewrite to `mtp`, multi-module MTP rule, the single-layer warning and its two
exemptions, suffix depth 24 and `arctic-inference==0.1.1`, the fallback log text
(`vllm.py#L752-L759`), forced-V2 failure (`#L3315-L3331`), rejection sampler docstring and the V1
sampler's synthetic-only branch vs MRv2 `block`, draft TP rule, TLI rules, adaptive verification
constraints and the doc-code conflict (`speculator.py#L171-L255`, v0.30.0 notes #52228),
`--per-request-spec-decode-metrics`, the structured-output contract, `-1` full mask, auto
resolution order, Tekken Lark routing, single-backend quote, rollback and bitmask rows, compile
failure to `FINISHED_ERROR`, both sampler orders, both LogitsProcessor contracts (MRv2 custom
processors in v0.31.0 notes #56497), 147 decorated classes in 134 files, `VLLM_COMPILE` above
`-O0`, splitting ops, pass order, all-reduce + RMSNorm conditions, `IS_QUANTIZED`/`IS_DENSE`,
O2 == O3, 24 breakable-CUDA-graph architectures and the ROCm exception, capture-size formula and
ceilings, 1024-sequence serve default.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| A1 | `mlp_speculator` row: "Accepted by the config and sent to the V1 runner ... test before relying on it" | CodebaseAdvanced.tsx:94-99 | OVERREACH (understates) | Registry entry `MLPSpeculatorPreTrainedModel` commented out as "Temporarily disabled": `vllm/model_executor/models/registry.py#L705-L707`; V1 dispatch falls to `raise ValueError("Unknown speculative decoding method")`: `vllm/v1/worker/gpu_model_runner.py#L672-L676` | Row now says expect startup to fail at v0.31.0, cites both ranges, keeps "Not run during this research" (matches SpeculativeDecoding.tsx). `notes` typed `ReactNode` to hold the cites |
| A2 | `FixFunctionalizationPass`, quoted as "always run last" | CodebaseAdvanced.tsx:1297-1298 | WRONG (misquote) | The comment reads "always run fix_functionalization last": `vllm/compilation/passes/pass_manager.py#L135-L136` | Quote marks removed: "which always runs last" |
| A3 | `-O2` row: "Adds all-reduce + RMSNorm and RoPE + KV-cache fusions, where their conditions hold" | CodebaseAdvanced.tsx:169 | OVERREACH | RoPE + KV-cache fusions need Inductor graph partition or splitting ops without the KV-cache update (non-MLA one also needs ROCm AITER); the default split contains the update ops, so both are off by default: `vllm/config/vllm.py#L205-L226`, `vllm/config/compilation.py#L1280-L1292`, `#L1162-L1189` | Row narrowed; level-dict cite widened to L205-L346 and compilation.py L1280-L1292 added |
| A4 | `_attention_ops` enumerated as a closed list ending "DeepSeek V4 attention" | CodebaseAdvanced.tsx:1279-1282 | OVERREACH | The list also holds Qwen4Exp ops and `hpc_rope_norm_forward`: `vllm/config/compilation.py#L764-L782` | Added "and a few model-specific ops" |

Score: 9/10. Runner placement, verification and compilation defaults are code-confirmed and
consistent with section 11; each h2 states its payoff and the capture-size guidance lands last.
