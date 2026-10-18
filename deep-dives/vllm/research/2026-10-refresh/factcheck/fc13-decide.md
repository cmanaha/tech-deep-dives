# fc13-decide: fact-check of WhenNotVllm.tsx, OperationsFailureModes.tsx and DecisionGuide.tsx

Status: DONE (2026-10-18). Fixes applied; typecheck and lint clean; diagrams re-shot (fc13 harness,
ops + decision, 1440 and 390: 4 diagrams, 0 overlaps/clipping, 0 console errors; PNGs read).

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new
(`G/` below = `https://github.com/vllm-project/vllm/blob/v0.31.0/`). External pins re-read
2026-10-18: SGLang `v0.5.21`, TensorRT-LLM `v1.2.1` (latest stable; newer tags are rc),
TGI `b4adbf2f` (last commit 2026-03-21, repo archived, v3.3.7 published 2025-12-19),
Dynamo `v1.5.1`, llm-d-router `v1.0.0`, vLLM router `v0.1.16`, production-stack `vllm-stack-0.1.13`,
Ray `ray-2.59.0`, vllm-neuron `v0.24.0.1.1.0`, Karpenter `v1.15.0`. Sibling sections were used as
the reference for shared facts; no summary here contradicts its sibling after the fixes.

## DecisionGuide.tsx

38 claims checked: 35 CONFIRMED, 1 UNSUPPORTED, 2 OVERREACH (one claim appears in prose and in the
StartHereTree box). Confirmed include every StartHereTree branch (`vllm serve --nnodes` multi-node
on `mp` without Ray `G/vllm/config/parallel.py#L999-L1000`, `--node-rank` `G/vllm/engine/arg_utils.py#L1119-L1120`;
Ray Serve LLM puts vLLM on its Ray executor per RayServeLLM; P/D routing in production-stack
`parser.py#L229-L241` and llm-d EPP decode-first `llm-d-router@v1.0.0 docs/disaggregation.md#L84-L91`),
tiered defaults 16384/1024 (>=160 GiB), 8192/1024 (>=70 GiB, not A100), 2048/256 otherwise
(`G/vllm/engine/arg_utils.py#L2858-L2887`), preemption signals (`G/vllm/v1/metrics/loggers.py#L295-L297`,
`#L676-L680`), 503 admission (`G/vllm/config/scheduler.py#L93-L104`, `G/vllm/exceptions.py#L148-L175`).

| # | claim (short) | file:line | verdict | evidence | fix applied |
| --- | --- | --- | --- | --- | --- |
| D1 | vLLM Rust router ships a P/D-aware router, cited README L228-L238 | DecisionGuide.tsx:552 | UNSUPPORTED (citation) | L228-L238 is the load-balancing policy table; P/D disaggregation is `https://github.com/vllm-project/router/blob/v0.1.16/README.md#L108-L124` | Re-pointed the cite to L108-L124 |
| D2 | Bedrock is "a pay-per-token API ... limited to the catalog and to the architectures Custom Model Import accepts"; tree box "managed, pay-per-token" over the CMI lines | DecisionGuide.tsx:462-465, 103 | OVERREACH | Custom Model Import bills per running model copy x CMUs per minute over 5-minute windows (`https://docs.aws.amazon.com/bedrock/latest/userguide/import-model-calculate-cost.html`, read 2026-10-18) | Scoped pay-per-token to catalog models in prose and in the tree box ("catalog models, pay-per-token"); harness re-run |

Score: **9/10.** Every hard fact traces to a pinned line and agrees with its sibling section; the
tree and tables land on the reader's next action. Held below 10 by a few uncited guidance numbers
(for example "raise toward ~0.95").

## OperationsFailureModes.tsx

52 claims checked: 49 CONFIRMED, 2 OVERREACH, 1 WRONG. Confirmed include all five restart-ladder rungs
against `G/docs/features/preload.md`, `sleep_mode.md` and `initialized_snapshots.md` (daemon loads and
post-processes once, `ipc_cache` maps over CUDA IPC, PP rejected `G/vllm/model_executor/model_loader/weight_cache/daemon.py#L471-L477`,
CUDA/ROCm, same node and user, `zero_copy` vs sleep mode; snapshot create validation
`G/vllm/entrypoints/cli/snapshot.py#L19-L69`, restore wakes weights, reloads them, wakes KV
`G/vllm/snapshot/server.py#L97-L101`, canary check `G/vllm/snapshot/controller.py#L96-L120`),
`--kv-cache-memory-bytes` still runs the compiling profile run (`G/vllm/v1/worker/gpu_worker.py#L584-L608`),
startup plan, recompute-only preemption, 503 with no 429 and no rejection counter in `vllm/v1/metrics`,
client-abort accounting, LiteLLM advisory (1.82.7/1.82.8, ~40 minutes, 2026-03-24, Docker image
unaffected), nine minor releases v0.23.0 (2026-06-15) to v0.31.0 (2026-10-05).

| # | claim (short) | file:line | verdict | evidence | fix applied |
| --- | --- | --- | --- | --- | --- |
| O1 | Every cold boot "must finish within VLLM_ENGINE_READY_TIMEOUT_S, 600 seconds by default, or startup fails"; repeated in the cold-start row, rung 1 and "To get it right" | OperationsFailureModes.tsx:420-433, 974-997, 1012-1013, 1159-1160 | OVERREACH | Single API server (default without DP, `G/vllm/entrypoints/cli/serve.py#L105-L154`): the client launches the engine itself (`G/vllm/v1/engine/core_client.py#L651-L688`) and blocks in `wait_for_engine_startup`, a poll loop with no deadline (`G/vllm/v1/engine/utils.py#L1267-L1326`); the engine sends its input-socket ready message before the handshake READY (`G/vllm/v1/engine/core.py#L1121`, `#L1800-L1808`), so the 600 s poll (`core_client.py#L727-L742`) only bites when engines start outside the API server process (more than one API server) | Scoped all four passages to "more than one API server process, the default under data parallelism"; added the no-deadline cites for the default single Python API server |
| O2 | "Under the Ray executor the startup log warns --device-ids has no effect" | OperationsFailureModes.tsx:666-668 | OVERREACH | The check reads the user-set `distributed_executor_backend == "ray"` (`G/vllm/engine/arg_utils.py#L2064-L2071`); an auto-selected Ray executor inside a placement group does not warn | Narrowed to "With --distributed-executor-backend ray" |
| O3 | RestartLadderDiagram title: snapshot "reloads only the model files" | OperationsFailureModes.tsx:131-132 | WRONG | "Restore reloads model files and KV cache before binding HTTP" (`G/docs/features/initialized_snapshots.md#L112-L115`; `G/vllm/snapshot/server.py#L97-L101`) | Title now says it reloads the model files and the KV cache before it binds HTTP; harness re-run |

Score: **9/10.** Rows trace to pinned code and the restart ladder matches the three feature pages;
payoff lands on "To get it right". Held below 10 by length: the cold-start scoping adds words to an
already dense table.

## WhenNotVllm.tsx

36 claims checked: 32 CONFIRMED, 2 OVERREACH, 1 UNSUPPORTED, 1 STALE. Confirmed include TGI archived
(GitHub API `archived: true`, last commit `b4adbf2f` 2026-03-21, v3.3.7 2025-12-19; README L1-L4,
L47-L77, L51 at that SHA), TensorRT-LLM `trtllm-serve --backend` default `pytorch`
(`NVIDIA/TensorRT-LLM@v1.2.1 tensorrt_llm/commands/serve.py#L296-L301`, `llmapi/llm.py#L1188`,
README L231-L235), SGLang README feature list L69-L71 and LLaDA 2.0 L38 at v0.5.21, SGLang docs
quotes, Dynamo backends and vLLM 0.28.0 pin, llm-d-router engine configs (no TGI), llama.cpp
v0.7.0 (2026-10-15) and Ollama v0.40.6 (2026-10-16), PyTorch Foundation post dated 2025-05-07,
vLLM hardware list (`G/docs/getting_started/installation/README.md`), diffusion config and scheduler,
watermarking, `ipc_cache` load format. No vendor performance number is stated as fact.

| # | claim (short) | file:line | verdict | evidence | fix applied |
| --- | --- | --- | --- | --- | --- |
| W1 | vLLM-Metal "keeps the laptop on the same engine and flags as the server" | WhenNotVllm.tsx:359 | OVERREACH | No source shows plugin flag parity; installation page only lists Apple Silicon via vLLM-Metal | Cut "and flags" |
| W2 | "RadixAttention keeps prior KV in a radix tree" | WhenNotVllm.tsx:366-368 | UNSUPPORTED (citation) | Neither the README nor the docs page describes the radix tree; the code does: `https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/mem_cache/radix_cache.py#L249-L280` | Added that code citation |
| W3 | SGLang docs link `https://docs.sglang.ai/` | WhenNotVllm.tsx:489 | STALE | 301 to `https://docs.sglang.io/` (fetched 2026-10-18); quotes confirmed there | Link updated |
| W4 | Head-to-head speed figures are "Tier-3 / third-party" | WhenNotVllm.tsx:595-596 | OVERREACH | Vendors publish them too, e.g. SGLang README L59 "up to 5x faster inference with RadixAttention" (v0.5.21) | Badge now "vendor or third-party" claims |

Score: **9/10.** Engine facts are pinned and current, the tree lands on "shortlist, then measure".
Held below 10 by the SGLang table row stating its mechanism without an inline cite (the evidence
block carries it).

## For the orchestrator (files I do not own)

- `sources.md` L70 still lists `https://docs.sglang.ai/` for WhenNotVllm; the page moved to `docs.sglang.io`.
- New citations to add to `sources.md`: `vllm/v1/engine/utils.py` and `vllm/entrypoints/cli/serve.py`
  (OperationsFailureModes), SGLang `v0.5.21 python/sglang/srt/mem_cache/radix_cache.py` (WhenNotVllm),
  vLLM router `v0.1.16 README.md` L108-L124 (DecisionGuide), Bedrock "Calculate the cost of running a
  custom model" (evidence only, not cited on the page).
- vLLM v0.32.0 was published 2026-10-18T06:50Z; the dive is pinned to v0.31.0 and says so.
