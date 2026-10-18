# fc06-code-a: fact-check of the codebase Architecture, Config and Scheduler tabs

Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read from `/tmp/vllm-new`
on 2026-10-17. Release notes from `/tmp/vllm-release-notes/`. Every `Cite` line range in the four
files was opened and read. No diagram was changed, so the screenshot harness was not run.

Files: `codebase/CodebaseArchitecture.tsx`, `codebase/CodebaseConfig.tsx`,
`codebase/CodebaseScheduler.tsx`, `InsideCodebase.tsx` (all under `deep-dives/vllm/src/sections/`).

Cross-section check: the shared facts in V1Architecture (two processes on one GPU, msgpack over
ZMQ, the client classes, the Rust frontend switch) and SchedulerBatching (preemption is recompute
only, FCFS victim is the last running request, watermark, `max_num_active_seqs`, batch defaults
by GPU tier) agree with these tabs. The Cross-file facts block (MRv2 naming, `mp` multi-node
default, HTTP 503 admission, recompute-only preemption, sha256 seed since v0.29.0, scheduler
defaults) is respected in all three tabs.

## CodebaseArchitecture.tsx

64 claims checked: 59 CONFIRMED, 1 WRONG, 3 UNSUPPORTED, 1 OVERREACH.

Confirmed items include the repo counts (2,569 `.py` files and 1,009,607 lines under `vllm/`; 310
csrc files; 340 `.rs` files and 126,169 lines; `model_executor/`, `v1/` and `models/` as the three
largest packages; `arg_utils.py` at 3,158 lines; the two 7-line aliases), the executor backend
resolution, the client selection, the msgpack and aux-buffer threshold (256), the 16 MiB MQ
overflow, the `VLLM_USE_RAY_V2_EXECUTOR_BACKEND` default of 1, the `gc.freeze()` call sites, and
the DP wave all-reduce cadence (`dp_sync_interval` default 16).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| A1 | EngineCore owns the scheduler and KV-cache manager | CodebaseArchitecture.tsx:484 | UNSUPPORTED | Cited range shows the executor and KV-cache init only; the Scheduler is built at `vllm/v1/engine/core.py#L155-L176` | Range changed to `core.py L150-L176` |
| A2 | When a request arrives at a paused rank, "that rank notifies the coordinator" | CodebaseArchitecture.tsx:833-839 | WRONG | The frontend sends `FIRST_REQ` to the coordinator when engines are not running: `vllm/v1/engine/core_client.py#L1537-L1540`; the coordinator wakes the other ranks: `vllm/v1/engine/coordinator.py#L355-L375` | Sentence corrected to say the frontend notifies the coordinator, which wakes the other ranks; cites added for core_client.py L1537-L1540 and coordinator.py L355-L375, core.py range widened to L2207-L2220 |
| A3 | Coordinator collects per-rank queue lengths and publishes them | CodebaseArchitecture.tsx:840-844 | UNSUPPORTED | Cited `coordinator.py#L98-L132` is process spawn and address setup; stats are collected at `#L424-L427` and published at `#L279-L290` | Ranges replaced with L424-L427 and L279-L290 |
| A4 | `--dp-sync-interval` tunes it | CodebaseArchitecture.tsx:825-829 | UNSUPPORTED | `arg_utils.py#L556` is the dataclass field; the flag is registered at `vllm/engine/arg_utils.py#L1277-L1280` | Range changed to L1277-L1280 |
| A5 | Workers and executors: "neither opens a ZMQ socket" | CodebaseArchitecture.tsx:509-512 | OVERREACH | The MessageQueue they use sends over ZMQ on overflow and to remote readers: `vllm/distributed/device_communicators/shm_broadcast.py#L867-L891` (the same page says so in the executor section) | Narrowed: neither opens a socket to the frontend; their only ZMQ traffic is the message queue's overflow and cross-node path to the EngineCore |

Score: 9/10. Code claims are accurate and densely cited after the range fixes; Section Shape is
good (h2 descriptions state the payoff, supporting detail sits in ExpandableSections). Diagram
labels match the code.

## CodebaseConfig.tsx

72 claims checked: 71 CONFIRMED, 1 WRONG.

Confirmed items include the 28 VllmConfig sub-config fields (vllm.py L363-L455), 36 files in
`vllm/config/`, 293 `VLLM_*` variables in the `environment_variables` table, the batch-default
tiers (16384/1024, 8192/1024, 2048/256; LLM class 16384/16384/8192; CPU 2048 x world size and
128 x world size; batched DP MoE 256; class fallbacks 2048/128), the throughput-mode doubling and
the clamps, O3 settings identical to O2 (text compared), `performance_mode` read only at
vllm.py L1431 (log) and L2563 (capture sizes) plus arg_utils.py L3065, the HTTP 503 exceptions,
`extra="forbid"`, the dev-mode `/server_info` route, and the `VLLM_PREFIX_CACHE_RETENTION_INTERVAL`
removal (v0.30.0 release notes, #55353).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| C1 | `VLLM_CPU_KVCACHE_SPACE` (with the other two variables) "None of them appears in a VllmConfig dump" | CodebaseConfig.tsx:1056-1058 | WRONG | The CPU platform copies it into `cache_config.kv_cache_memory_bytes`: `vllm/platforms/cpu.py#L306-L310` | Corrected: the first two never appear; the third shows up as `CacheConfig.kv_cache_memory_bytes`. Cite range widened from L307 to L306-L310 |

Score: 9/10. Defaults and doc-code conflicts (`-O3`, `--performance-mode` help text) are
code-confirmed and labelled; the payoff (pass the batch limits explicitly) lands last.

## CodebaseScheduler.tsx

56 claims checked: 53 CONFIRMED, 3 UNSUPPORTED.

Confirmed items include the free-queue order (head = LRU, `popleft_n`, unhashed blocks prepended,
hashed appended, reverse-order free), `touch()` middle removal, no eviction thread and no `swap` in
`vllm/v1/core/` (both greps empty), the null block at id 0, CoW on sub-block hits and the MRv2
`copy_kv_cache_blocks_inplace` call, the `NONE_HASH` seed rules, the `cache_salt` first-block rule,
the preemption loop and both `_preempt_request` callers, the `kv_holding_waiting` drain order, the
stats line fields and the Prometheus metric names.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| S1 | `token_budget = self.max_num_scheduled_tokens`, which defaults to `max_num_batched_tokens` | CodebaseScheduler.tsx:552-558 | UNSUPPORTED | Cited L582-L585 shows the assignment, not the default; the default is `vllm/v1/core/sched/scheduler.py#L132-L136` | Cite for L132-L136 added before L582-L585 |
| S2 | KVCacheCoordinator fans out to one SingleTypeKVCacheManager per group | CodebaseScheduler.tsx:709-714 | UNSUPPORTED | Range L66-L1072 was the whole file; the per-group construction is `vllm/v1/core/kv_cache_coordinator.py#L134-L149` | Range narrowed to L134-L149 |
| S3 | Sub-block prefix keys use the GCD of group block sizes, or `--prefix-match-unit` | CodebaseScheduler.tsx:851-858 | UNSUPPORTED | Cited coordinator L687-L704 carries only the Mamba `align` requirement; the GCD and override rule is `vllm/v1/core/kv_cache_utils.py#L750-L755` | Cite for kv_cache_utils.py L750-L755 added |

Score: 9/10. Mechanism-level claims all hold at the pin; the KV-pool signals section ends on the
reader's next action. Residual minor items below.

## InsideCodebase.tsx

3 claims checked (pin, commit, tab set): 3 CONFIRMED. No fixes.

Score: 8/10. The h1 description names the topic rather than the reader's payoff; it is a tab
container with no load-bearing claims.

## Prose rules

No em-dash, en-dash range, curly quote, banned vocabulary or page-history voice in the four files.
Niche acronyms are expanded at first prose use (ZMQ, PyO3, MLA, MoE, GC, DP, MRv2, OTLP, CORS,
TLS, HF, LoRA, EAGLE, MTP, LRU, LIFO, FCFS, GCD, CBOR).

## Unresolved (diagram text, not changed)

- `SchedulerStateDiagram` uses "EOS" without expansion (diagram-only term).
- `BlockPoolDiagram` shows "LRU end" before the prose expansion of LRU (its SVG title spells out
  least-recently-used). Changing either label needs a harness re-run, which is outside a
  corrections-only pass on prose.

## Checks

- `pnpm --filter @tech-deep-dives/vllm typecheck`: `tsc --noEmit`, exit 0.
- `pnpm --filter @tech-deep-dives/vllm lint`: the first run reported "1 problem (1 error, 0
  warnings)"; its location was not captured, and other agents were editing other section files at
  the time. Two re-runs of `eslint src --ext .ts,.tsx --max-warnings 0` exited 0, and eslint on
  the four owned files exited 0.
