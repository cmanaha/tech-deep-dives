# Fact check fc01-framing: sections 1 (Thesis & Framing), 2 (Getting Started) and 3 (The SGLang Runtime)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d (tag object 35ce3132 resolves
to it), read at `/tmp/sglang-src`. vLLM baseline v0.31.0, files read through
`gh api repos/vllm-project/vllm/contents/<path>?ref=v0.31.0` (`/tmp/vllm-new` is partial). Release
data from `gh api repos/sgl-project/sglang/releases`. Date 2026-10-24. Status: COMPLETE. No diagram
was touched, so the harness was not run. Line numbers below are in the files after the fixes.

## ThesisAndFraming.tsx (section 1)

70 claims checked (62 `Cite`s after fixes, the six diagram labels, the 13 "section N, Title"
references, the release cadence recomputed from the GitHub releases API). 62 CONFIRMED, including
the B200 condition (matches the build-log Cross-section block: off, or topk 1 with
`--speculative-num-steps`), the PD handshake wording ("done before prefill finishes"; default
`early` policy and `optimistic_prefill_attempts=0` at `disagg.py#L59-L64`, `#L122-L124`), the
13-to-17-day release gaps (v0.5.14 to v0.5.22 published 06-26, 07-10, 07-25, 08-08, 08-22, 09-05,
09-18, 10-02, 10-19; one patch v0.5.15.post1), a "Breaking Changes & Upgrade Notes" heading in each of
v0.5.16 to v0.5.22, and vLLM's 16-token default holding for a dense Llama on H100 and B200
(`vllm/platforms/interface.py#L666-L697` keeps 16 because FLASH_ATTN and FLASHINFER both accept it).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| T1 | "the name covers two things its repository ships" | ThesisAndFraming.tsx:206 | OVERREACH | `README.md#L21` also names SGLang Diffusion as part of SGLang | "and for language models the name covers two things its repository ships" |
| T2 | Runtime behind an OpenAI API "is how SGLang is used today" from the quickstart and docs layout | :216-219 | OVERREACH | Evidence shows how the tree presents usage, not usage; stronger evidence uncited: `python/sglang/README.md#L8` "Deprecated language frontend that is no longer actively maintained" (section 5 already says so) | "The v0.5.22 tree presents the runtime ... as the way to use SGLang", added "the package README marks the language frontend deprecated" with cite README.md L8 |
| T3 | vLLM async scheduling on by default, cite `vllm/config/vllm.py` L592-L602 | :292 | UNSUPPORTED | L592-L602 is `max_concurrent_batches`; the default is resolved at https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/vllm.py#L1576-L1635 (`async_scheduling is None` sets True unless an incompatible option) | Cite moved to L1576-L1635 |
| T4 | "FlashAttention built from a fork" on the SGLang side, cite pyproject only | :318-324 | UNSUPPORTED | pyproject L41-L88 shows no fork; `python/sglang/kernels/aot/CMakeLists.txt#L83-L89` fetches `sgl-project/sgl-attn` | Added that cite |
| T5 | Admin routes "with no `--admin-api-key` accept any client that can reach the port" | :482-485 | WRONG | `utils/auth.py#L133-L151`: ADMIN_OPTIONAL with `--api-key` alone requires the API key; `entrypoints/http_server.py#L1106-L1173`: the three HiCache storage routes return 400 without an admin key; section 12's key matrix agrees | "with neither `--api-key` nor `--admin-api-key` set they accept any client that can reach the port, the three HiCache storage routes excepted"; "every server" narrowed to "every Python HTTP server" (the Rust frontend mounts no admin route); added cite http_server.py L1106-L1173 |
| T6 | "vLLM registers its counterparts only under `VLLM_SERVER_DEV_MODE=1`" | :502-508 | OVERREACH | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/__init__.py#L43-L69 (dev mode: cache reset, RLHF weight updates, sleep); LoRA load sits behind `VLLM_ALLOW_RUNTIME_LORA_UPDATING` (`serve/lora/api_router.py#L30`), elastic-EP scaling is registered on every generate server (`launchers/api_server/routers.py#L46-L50`) | "vLLM registers its weight-update, cache-reset and sleep routes only under `VLLM_SERVER_DEV_MODE=1`", added cite serve/__init__.py L43-L69 |
| T7 | "section 12, APIs, LoRA ... and the Admin Plane" | :510-512 | WRONG (cross-ref) | App.tsx title "12. Talking to SGLang: APIs, LoRA & the Admin Plane" | "section 12, Talking to SGLang: APIs, LoRA (low-rank adaptation) and the Admin Plane" |

**Score: 8/10.** One mental model (around the index, beside it) carried by a clean map, three edges
each sent to its owner, and the 64-token B200 figure landed twice with its condition. Held at 8 by
the density of side-by-side citations in the three-edges container, which makes the prose slow.

## GettingStarted.tsx (section 2)

63 claims checked (45 `Cite`s after fixes, the four routes and the eleven map edges against SCOPE.md
section 2, 21 "section N, Title" references, the 0.83 arithmetic, the nine table rows). 56 CONFIRMED.

The strongest number, recomputed from `arg_groups/memory_hook.py` at the tag for an 80 GB H100
(81,559 MiB from `nvidia-smi`, the figure section 6 assumes), TP 1, dense model, default flags:
`SGLANG_ENABLE_POST_CAPTURE_KV_SIZING` is False (`environ.py#L589`), so the regular path runs;
`chunked_prefill_size` 8192 and decode graph `max_bs` 256 (`memory_hook.py#L132-L142`, gpu_mem under
90 GiB, TP under 4); reserved = 512 + 8192 x 1.5 + 1 x 1 / 8 x 1024 + 256 x 2 (decode graph) + 58
prefill graph sizes x 8 (`breakable` is the CUDA default, `cuda_graph_config.py#L123`;
`cuda_graph_hook.py#L442-L459` gives 58 sizes up to 8192) = 13,904 MiB, above the 10 GiB floor;
`round((81559 - 13904) / 81559, 3)` = **0.830**. vLLM v0.31.0 `gpu_memory_utilization` default
0.92, a per-instance limit (`vllm/config/cache.py#L103-L111`). CONFIRMED, and consistent with
section 6 (13,904 MiB, 0.830).

Routes and map: the four route lists match SCOPE.md section 2 exactly; the feed edges 5 to 4, 8 to 5,
8 to 21, 12 to 13, 12 to 25, 6 to 15 and 15 to 16 match its "How the sections feed each other"
list; 1 to 2, 3 to 4, 5 to 7 and 15/16 to 22 are reading-path and EFA edges named in the caption.
CONFIRMED.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| G1 | `--enable-metrics` mounts `/metrics` "on the server's own port" | GettingStarted.tsx:541-542 | OVERREACH (ambiguous; fc02 corrected the same wording in section 4) | `entrypoints/http_server.py#L301-L304` adds the Prometheus middleware to the same FastAPI app | "on the server's HTTP port, beside the API" |
| G2 | vLLM 0.92 "for the whole instance", cite L103 only | :37, :566, :766 | UNSUPPORTED (range) | "per-instance limit" is in the docstring, https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L103-L111 | Cite widened to L103-L111 |
| G3 | B200 leaves `trtllm_mha` only "with the topk unset" | :648-656 | OVERREACH (incomplete against the Cross-section block) | `utils/common.py#L4014-L4020` and `arg_groups/model_override_base.py#L303-L322`: topk above 1 also fails the trtllm branch and lands on `flashinfer`, page 1 | "with the topk above 1 or unset"; cite widened from L303-L311 to L303-L322 to include the `flashinfer` fallback |
| G4 | Admin row: "with `--api-key` alone they accept the inference key too" | :706-708 | OVERREACH (reads as "any client, and the key too") | `utils/auth.py#L133-L143`: ADMIN_OPTIONAL with only the API key requires it | "with `--api-key` alone the inference key opens them" |
| G5 | `max_running_requests` "48 under EAGLE-family and NGRAM" with the EAGLE cite only | :1052-1066 | UNSUPPORTED / incomplete | `arg_groups/speculative_hook.py#L421-L429` (DFLASH), `#L777-L785` (DSPARK), `#L995-L1003` (EAGLE family), `#L1204-L1212` (NGRAM); section 11 lists all four | "EAGLE-family, NGRAM, DFLASH or DSPARK", added the three cites |
| G6 | Required or named tool call enforced with a grammar, cite L295-L327 | :1140 | UNSUPPORTED (range) | The structural-tag and JSON-schema returns for required/named are at `function_call/function_call_parser.py#L339-L380` | Cite widened to L295-L380 |
| G7 | HiCache used without expansion | :853-855 | prose (acronym) | Section 1 expands it; each file expands on first use | "HiCache (the hierarchical cache)" |

**Score: 8/10.** The page delivers its two payoffs (a route in two minutes, nine day-one settings)
and lands 0.83 against 0.92 three times. Held at 8 by length: the first-launch block carries the
cache-hit walkthrough, the metrics query and the capacity derivation at once.

## RuntimeProcesses.tsx (section 3)

78 claims checked (76 `Cite`s after fixes, the six process counts, the five process titles and their
conditions, the diagram text). 64 CONFIRMED, including all six counts (10, 11, 19, 14, 14, 9 from
`engine.py#L889-L987`, `#L1291-L1333`), `setproctitle` at `scheduler.py#L6060`,
`detokenizer_manager.py#L545`, `data_parallel_controller.py#L877`, `multi_tokenizer_mixin.py#L767`,
`#L791`, the gRPC refusals, the docs search for `SGLANG_RUST_SERVER` (no hit under `docs/docs`), the
`rust/` route search and the `total_tokens` docs-versus-code conflict.

Build-log code-read findings, settled (all read from code, not run; the labels stay):
1. Rust frontend has no auth layer and no `/metrics`: CONFIRMED. `rust/sglang-server/src/api_server/http/app.rs#L77-L92` (a TODO(auth) comment states a configured `api_key` does not protect the routes), `rust/sglang-server/src/lib.rs#L188-L198` passes no HTTP layer, no `/metrics` route under `rust/`.
2. Multi-tokenizer mode never installs the key middleware: CONFIRMED. `entrypoints/http_server.py#L2656-L2684` installs it only when `tokenizer_worker_num == 1`; `#L246-L249` asserts `api_key is None` in each worker; `admin_api_key` is not asserted.
3. Follower stub answers 200: CONFIRMED (`utils/common.py#L3678-L3702`), with two conditions now in the text (it starts after the node's schedulers are ready, `engine.py#L1230`; a node-local Rust listener replaces it, `#L1270-L1274`).
4. Idle busy-spin unless `--sleep-on-idle`: CONFIRMED for the Python frontend (`scheduler.py#L835-L850`, `device.py#L74` default False, `idle_sleeper.py#L36-L37` 1 s). Under `SGLANG_RUST_SERVER=1` rank 0 always gets a `RustServerIdleSleeper` (`scheduler.py#L2357-L2360`), so the claim is scoped to the Python frontend.
5. Attention-DP port map: CONFIRMED (`server_args.py#L803-L893`, base `--port` plus 233 from `ZMQ_TCP_PORT_DELTA` at `#L714`, six ports from base plus 1, one more per DP rank under Rust; `data_parallel_controller.py#L458-L491` handshake at plus 13; `#L586-L616` random per-rank ports bound on node 0).
6. Rust frontend core pinning: CONFIRMED (`rust_server/config.py#L132-L158`: under 4 cores pins nothing, reserve `min(2, n // 4)`; `rust_server/server.py#L109-L112` budget `max(8, mm_workers + 4)`).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| R1 | Detokenizer counted in the 10, cite engine.py L889-L987 only | RuntimeProcesses.tsx:450-459, :716-723 | UNSUPPORTED (range) | Detokenizer launch is `entrypoints/engine.py#L1315-L1321` | Added that cite in both places |
| R2 | "Only one scheduler reads the input socket" | :527 | OVERREACH | `managers/scheduler_components/request_receiver.py#L113-L114`: under attention DP each group's attention-TP rank 0 reads its own socket | "Without attention DP, only one scheduler reads the input socket" |
| R3 | "Each process sets a title" | :555 | WRONG | The main process sets none (the table's first row says so); `setproctitle` only in the child entry points listed above | "Every child process sets a title" |
| R4 | `--load-balance-method auto` resolves to `round_robin` | :640-641 | OVERREACH | `arg_groups/serving_hook.py#L215-L227`: `follow_bootstrap_room` on a PD prefill server | Added "(to `follow_bootstrap_room` on a PD prefill server)" |
| R5 | Load snapshot cite scheduler.py L815-L832 | :685 | UNSUPPORTED (range) | Rank-0 return and snapshot writer at `managers/scheduler.py#L817-L833` | Cite moved to L817-L833 |
| R6 | Follower nodes run "only its schedulers" | :750-756 | WRONG | `engine.py#L904-L906` computes `use_dp_controller` on every node; follower controllers take the client branch, `managers/data_parallel_controller.py#L617-L618` | Added "plus a DataParallelController when there is more than one DP rank" with both cites |
| R7 | Follower probe "reports that the stub is up, and says nothing about the model" | :757-769 | OVERREACH | `engine.py#L1230` waits for scheduler readiness before the stub; `#L1270-L1274` Rust listener replaces it | Scoped to the Python frontend; "waits for its schedulers to load, then serves"; "reports that the node finished loading, and after that says nothing about the model" |
| R8 | Idle sleeper "created only with `--sleep-on-idle`" | :772-775 | OVERREACH | `scheduler.py#L2357-L2360` sets a sleeper for the Rust frontend regardless | Prefixed "On the Python frontend," |
| R9 | "the TCP ports are the HTTP port and one rendezvous port" | :828 | OVERREACH (low confidence) | Holds for sockets SGLang binds; sockets NCCL or gloo open are outside SGLang code | "the TCP ports SGLang itself binds are" |
| R10 | Attention-DP port block cite server_args.py L802-L850 | :861 | UNSUPPORTED (range) | The tokenizer port at `port_base` is assigned at `server_args.py#L877` | Cite widened to L803-L893 |
| R11 | Rust HTTP router route list | :937-946 | OVERREACH (incomplete list) | `info.rs#L31` mounts `/model_info`; `openai/models.rs#L17` mounts `/v1/models/{model}` | Added both routes and a cite to openai/models.rs L16-L17 |
| R12 | No-auth cite app.rs L77-L89 | :968 | UNSUPPORTED (range, minor) | Optional HTTP layer hook at `app.rs#L90-L92` | Cite widened to L77-L92 |
| R13 | Rust pool budget cite rust_server/server.py L108-L111 | :992-994 | UNSUPPORTED (range) | `max(8, mm_workers + 4)` is at L112 | Cite moved to L109-L112 |
| R14 | vLLM Rust frontend replaces only the API server; "SGLang's also takes over tokenization and detokenization" | :995-1009 | WRONG | https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/text/src/lib.rs#L4-L8 (tokenizer loading, incremental detokenization); https://github.com/vllm-project/vllm/blob/v0.31.0/rust/README.md#L3 (talks to the engine over ZMQ) | "takes the place of its API server process, tokenization and detokenization included, and still reaches the engine over ZMQ; SGLang's runs inside the GPU process itself", two cites added |
| R15 | gRPC refusal list | :1014-1017 | OVERREACH (incomplete) | `arg_groups/serving_hook.py#L397-L401` also refuses `--encoder-only` | Added `--encoder-only` |
| R16 | Against vLLM: "SGLang never ships a per-step scheduling decision across a process boundary" | :1061-1062 | OVERREACH | With PP and a PD decode server, retract, prealloc and transfer ids go to the next stage (`managers/scheduler_pp_mixin.py#L521-L532`) | "within a TP group, SGLang ships only the new requests across the process boundary, and every GPU process makes the scheduling decision itself" |
| R17 | vLLM "schedules once per DP rank and sends the decision", cite parallel.py L989-L1034 | :1071-1078 | UNSUPPORTED | Those lines pick the executor backend. Evidence: https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/core.py#L640-L641 (`schedule()` then `execute_model(scheduler_output)`), https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/multiproc_executor.py#L340-L351 (`collective_rpc` to the workers) | Cites replaced |
| R18 | "Both keep HTTP and tokenization off the GPU-driving process" | :1079 | OVERREACH | Under `SGLANG_RUST_SERVER=1` both run as threads in the rank-0 scheduler (the section's own Rust paragraph) | "By default both keep ..." |

**Score: 8/10.** The 10-process figure lands three times, the count table and the port map are
practical, and every code-only reading is labelled. Held at 8 by the Rust and gRPC container, which
stacks many conditions in long sentences.

## Problems in files this group does not own (for the orchestrator)

- `SglangVsVllm.tsx:868` cites `vllm/config/vllm.py` L592-L602 for vLLM's async-scheduling default;
  the default is set at L1576-L1635 (same register error as 10 A4 and B3).
- The startup `server_args=` log line that section 2 tells readers to read prints `api_key` and
  `admin_api_key` in plain text, by our reading of the code, not run: `engine.py#L1179` logs
  `_server_args_for_logging`, which is `redact_watermark_secrets(server_args.resolved_dict())`
  (`engine.py#L170-L171`), and that redacts only watermark keys
  (`sampling/watermarking/core.py#L26-L102`). This settles the build log's "not verified" note on the
  log path (it is not `__repr__`). Section 2 was not changed, since a warning there would be a new
  claim; consider it for section 12 or 25 and for the advisory.
