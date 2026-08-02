# P1 — vLLM Deep Dive: Code Provenance Adversarial Verification

**Date:** 2026-08-01
**Target:** `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/codebase/` (8 tabs)
**Method:** Full source tree downloaded at the pinned commit and at current HEAD; every claim checked against literal file content. Docstrings and READMEs treated as orientation only — code is authority.

---

## 0. Commit provenance

**[AUTHORITATIVE — GitHub API `/repos/vllm-project/vllm/commits/15652a6b`]**

| Field | Value |
| --- | --- |
| Full SHA | `15652a6b703f059767d75e5a511c4a5accf969ad` |
| Author date | `2026-06-07T07:34:07Z` |
| Committer | GitHub (web-flow), verified PGP signature |
| Message (subject) | `[Doc] Fix multimodal torch.compile troubleshooting to not use removed VLLM_TORCH_COMPILE_LEVEL (#44378)` |
| Author | Daoyuan Li (`DaoyuanLi2816`), co-authored by Cyrus Leung |
| Parent | `51ef6888315ad242e137fa02fb6500bcf643924c` |

**VERDICT: CONFIRMED.** The commit exists, is a real merged commit on `main`, and its date (2026-06-07) matches the dive's stated access date exactly. The dive's provenance line — "File and line counts at vLLM commit 15652a6b, accessed 2026-06-07" (`CodebaseArchitecture.tsx:253`) — is accurate.

Verification trees used:
- Pin: `https://codeload.github.com/vllm-project/vllm/tar.gz/15652a6b703f059767d75e5a511c4a5accf969ad`
- HEAD: `0601850791155003afbe5a0d5d086350cada8deb` (2026-08-02T05:50:40Z)

---

## 1. Claim-by-claim verdicts

### C1 — "`vllm/engine/llm_engine.py` is now seven lines"

**Dive text** (`CodebaseArchitecture.tsx:256-263`):
> **V0 is gone.** `vllm/engine/llm_engine.py` is now seven lines: it imports `vllm.v1.engine.llm_engine.LLMEngine` and binds the public `LLMEngine` name to it.

**Actual** — `vllm/engine/llm_engine.py` @ 15652a6b, complete file (7 lines):
```python
1  # SPDX-License-Identifier: Apache-2.0
2  # SPDX-FileCopyrightText: Copyright contributors to the vLLM project
3
4  from vllm.v1.engine.llm_engine import LLMEngine as V1LLMEngine
5
6  LLMEngine = V1LLMEngine  # type: ignore
7  """The `LLMEngine` class is an alias of [vllm.v1.engine.llm_engine.LLMEngine][]."""
```

**VERDICT: CONFIRMED.** Exactly seven lines, exactly the described mechanism. This is the strongest-verified claim in the dive. Note `vllm/engine/async_llm_engine.py` is likewise a 7-line shim.

---

### C2 — Repo scale: "roughly 675,000 lines across about 1,799 files"

**Dive text** (`CodebaseArchitecture.tsx:244-247`):
> The Python package `vllm/` is roughly 675,000 lines across about 1,799 files

**Actual** @ 15652a6b:
- `find vllm -name '*.py' | wc -l` → **1,799**
- `find vllm -name '*.py' -exec cat {} + | wc -l` → **674,655**

**VERDICT: CONFIRMED.** 1,799 is exact. 674,655 rounds to 675,000. (For completeness: `vllm/` contains 2,365 files of all types totalling 786,525 lines — the dive's number is the `.py`-only figure, which matches its own framing "The Python package".)

---

### C3 — "`csrc/` holds 242 CUDA/C++ source and header files"

**Dive text** (`CodebaseArchitecture.tsx:247-250`).

**Actual** @ 15652a6b, `csrc/` extension breakdown:

| ext | count |
| --- | --- |
| `.cu` | 92 |
| `.cuh` | 77 |
| `.hpp` | 41 |
| `.h` | 41 |
| `.cpp` | 32 |
| `.py` | 5 |
| `.md` | 2 |
| `.gitignore` | 2 |
| `.inl` | 1 |
| **total files** | **293** |

`.cu + .cuh + .cpp + .h` = **242** exactly. Including `.hpp` and `.inl` → **283**.

**VERDICT: PARTLY-CORRECT.** 242 is reproducible under one specific extension set, but `.hpp` files (41 of them) are unambiguously "C++ headers" and are excluded. The stated category ("CUDA/C++ source and header files") maps more naturally to 283. The number is not wrong so much as under-specified — it needs the extension list stated, or the figure raised to 283.

---

### C4 — "`rust/` is ~210 `.rs` files"

**Actual** @ 15652a6b: `find rust -name '*.rs' | wc -l` → **210**.

**VERDICT: CONFIRMED** (exact, not approximate).

---

### C5 — "`EngineCoreProc` is a pure-Python busy loop plus two daemon IO threads"

**Dive text** (`CodebaseArchitecture.tsx:296-303`).

**Actual** — `vllm/v1/engine/core.py` @ 15652a6b:
- `class EngineCoreProc(EngineCore)` at line 860.
- Line 944: `input_thread = threading.Thread(target=self.process_input_sockets, ...)`, line 952: `daemon=True`.
- Line 956: `self.output_thread = threading.Thread(target=self.process_output_sockets, ...)`, line 963: `daemon=True`.
- `grep -c "daemon=True"` in the file → **2**. No other daemon threads.
- `def run_busy_loop(self)` at line 1223 (`EngineCoreProc`) and 1869 (`DPEngineCoreProc` override).
- In-code comment at lines 938-942 corroborates the mechanism verbatim: *"Background Threads and Queues for IO. These enable us to overlap ZMQ socket IO with GPU since they release the GIL... Threads handle Socket <-> Queues and core_busy_loop uses Queue."*

**VERDICT: CONFIRMED.** Exactly two, both daemon, and the queue-mediated design is as described.

---

### C6 — "Messages on the wire are `msgspec` Structs, not pickle"

**Dive text** (`CodebaseArchitecture.tsx:301`) and the diagram edge label "ZMQ + msgspec" (`CodebaseArchitecture.tsx:219-220`).

**Actual** @ 15652a6b:

*Supporting:* `vllm/v1/engine/__init__.py:83-86` — `class EngineCoreRequest(msgspec.Struct, array_like=True, omit_defaults=True, ...)`; same for `EngineCoreOutput` (line 170) and `EngineCoreOutputs` (line 215). `core_client.py:19` `import msgspec.msgpack`; encode/decode at lines 717, 1265, 1297, 1309, 1325, 1354, 1673, 1731. `grep pickle` over `core.py` and `core_client.py` → **zero hits**.

*Contradicting (two places):*

1. `vllm/v1/serial_utils.py` — the encoder that actually serializes those Structs — has a live pickle path:
```python
221        if not envs.VLLM_ALLOW_INSECURE_SERIALIZATION:
222            raise TypeError(
223                f"Object of type {type(obj)} is not serializable"
224                "Set VLLM_ALLOW_INSECURE_SERIALIZATION=1 to allow "
225                "fallback to pickle-based serialization."
226            )
...
231            return msgpack.Ext(CUSTOM_TYPE_CLOUDPICKLE, cloudpickle.dumps(obj))
233        return msgpack.Ext(
234            CUSTOM_TYPE_PICKLE, pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)
235        )
```
Also line 195: `# Fall back to pickle for object or void kind ndarrays.` (that one is **not** gated by the insecure-serialization env var).

2. The **worker hop**, which the dive's own diagram labels "shm MQ" (`CodebaseArchitecture.tsx:224-225`), is pickle-based: `vllm/distributed/device_communicators/shm_broadcast.py:743` `all_buffers[0] = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL, buffer_callback=oob_callback)` and line 790/805 `pickle.loads(...)`.

**VERDICT: PARTLY-CORRECT.** For the EngineCore ZMQ hop under default settings, the claim holds: the payload types are `msgspec.Struct`, the codec is msgpack, and a non-serializable object *raises* rather than silently pickling. But (a) an opt-in pickle/cloudpickle fallback exists behind `VLLM_ALLOW_INSECURE_SERIALIZATION=1`, (b) object-dtype ndarrays fall back to pickle ungated, and (c) the frontend→worker shared-memory hop uses `pickle.dumps` unconditionally. The flat phrasing "on the wire ... not pickle" over-reaches given the dive shows two wires in the same diagram.

---

### C7 — "`EngineCoreClient` owns the ZMQ ROUTER (input) and PULL (output) sockets"

**Actual** — `vllm/v1/engine/core_client.py` @ 15652a6b, lines 515-524:
```python
515                self.input_socket = self.resources.input_socket = make_zmq_socket(
516                    self.ctx,
517                    input_address,
518                    zmq.ROUTER,
519                    bind=True,
...
522                self.resources.output_socket = make_zmq_socket(
523                    self.ctx, output_address, zmq.PULL
524                )
```
Second occurrence at lines 553-559 (async path). Engines connect DEALER-side (comment at line 562).

**VERDICT: CONFIRMED.**

---

### C8 — "`gc.freeze()` after model load"

**Dive text** — diagram label at `CodebaseArchitecture.tsx:198`; file cited as `vllm/utils/gc_utils.py`.

**Actual** @ 15652a6b:
- `vllm/utils/gc_utils.py:96` `def freeze_gc_heap()`, line 108 `gc.freeze()` (preceded by generational `gc.collect(0/1/2)`).
- `vllm/v1/engine/core.py:228` `freeze_gc_heap()` inside `EngineCore.__init__`, with comment at 226-227: *"Mark the startup heap as static so that it's ignored by GC. Reduces pause times of oldest generation collections."*
- Ordering check: `self.model_executor = executor_class(vllm_config)` at line 122 and `self._initialize_kv_caches(...)` at line 132 both precede line 228. So "after model load" is literally correct.
- Symmetry: line 622 `gc.unfreeze()` on shutdown.

**VERDICT: CONFIRMED.**

---

### C9-C12 — Config defaults

**Dive text** (`CodebaseConfig.tsx` knob table lines 118-150 and the provenance note at 419-426, which itself asserts "All verified at commit `15652a6b`").

| Field | Dive says | Actual @ 15652a6b | Verdict |
| --- | --- | --- | --- |
| `gpu_memory_utilization` | `0.92`, `CacheConfig` | `config/cache.py:67` `gpu_memory_utilization: float = Field(default=0.92, gt=0, le=1)` | CONFIRMED |
| `block_size` | `16 (DEFAULT_BLOCK_SIZE)`, `CacheConfig` | `config/cache.py:46` `DEFAULT_BLOCK_SIZE: ClassVar[int] = 16`; applied at line 239 `self.block_size = self.DEFAULT_BLOCK_SIZE` when unset | CONFIRMED |
| `max_num_seqs` | `128`, `SchedulerConfig` | `config/scheduler.py:44` `DEFAULT_MAX_NUM_SEQS: ClassVar[int] = 128`; line 63 `max_num_seqs: int = Field(default=DEFAULT_MAX_NUM_SEQS, ge=1)` | CONFIRMED |
| `max_num_batched_tokens` | `2048`, `SchedulerConfig` | `config/scheduler.py:42` `DEFAULT_MAX_NUM_BATCHED_TOKENS: ClassVar[int] = 2048` | CONFIRMED |
| `optimization_level` | `OptimizationLevel.O2` in `config/vllm.py` | `config/vllm.py:366` `optimization_level: OptimizationLevel = OptimizationLevel.O2` | CONFIRMED |
| `LoRAConfig.max_lora_rank` | `16` | `config/lora.py:34` `max_lora_rank: MaxLoRARanks = 16` | CONFIRMED |
| `LoRAConfig.max_loras` | `1` | `config/lora.py:36` `max_loras: int = Field(default=1, ge=1)` | CONFIRMED |

**VERDICT: ALL CONFIRMED.** The config tab's defaults are clean. Note the dive's `block_size` caveat ("May be auto-resolved from KV-cache groups if left unset") is also correct — `cache.py:48` declares `block_size: int = Field(default=None, ...)` and `_apply_block_size_default()` (line 232) resolves it, with a `_block_size_resolved` guard at line 235.

---

### C13 — `CompilationConfig` is "The single largest config file"

**Dive text** (`CodebaseConfig.tsx:70-72`, `subConfigRows` entry for `CompilationConfig`):
> `torch.compile` and CUDA-graph capture ... **The single largest config file.**

**Actual** — `wc -l vllm/config/*.py` @ 15652a6b (top of the list):
```
1099 vllm/config/speculative.py
1525 vllm/config/compilation.py
2249 vllm/config/model.py
2264 vllm/config/vllm.py
```

**VERDICT: REFUTED.** `compilation.py` is **third** at 1,525 lines. `vllm/config/vllm.py` (2,264) and `vllm/config/model.py` (2,249) are both substantially larger.

Worse, the dive contradicts itself in the same table: the `ModelConfig` row (`CodebaseConfig.tsx:24`) says *"The largest dataclass; everything else validates against it."* Both statements cannot hold. `model.py` is the largest of the *sub-config* files; `vllm.py` (which holds the assembling `VllmConfig`) is the largest file in `vllm/config/` overall.

**Required correction:** change "The single largest config file" on the `CompilationConfig` row to something defensible, e.g. "the largest of the execution-tuning configs (1,525 lines) — behind `model.py` (2,249) and `vllm.py` (2,264)".

---

### C14 — File-size claims across Execution / Distributed / Config tabs

| Dive claim | Location | Actual @ 15652a6b | Verdict |
| --- | --- | --- | --- |
| "the 7,560-line model runner" (`gpu_model_runner.py`) | `CodebaseExecution.tsx:591` | **7,561** | CONFIRMED (±1) |
| V2 `gpu/model_runner.py` "about 1,560 lines" | `CodebaseExecution.tsx:339` | **1,558** | CONFIRMED |
| NixlConnector "~2,500-line `worker.py`" | `CodebaseDistributed.tsx:457` | **2,499** | CONFIRMED |
| `arg_utils.py` "~2,600 lines" | `CodebaseConfig.tsx:275` | **2,606** | CONFIRMED |

**VERDICT: ALL CONFIRMED.** These are precise, not hand-waved. The ±1 on 7,560 vs 7,561 is a newline-counting artifact, not an error.

---

### C15 — Free-block queue LRU orientation

**Dive text** (`CodebaseScheduler.tsx:347-352`):
> The free queue doubles as the **eviction order**. When prefix caching is on, a freed-but-still-cached block sits in the queue as an eviction candidate; **the tail is the least-recently-used.** Allocation pops from the head, and `_maybe_evict_cached_block()` drops that block's hash on reuse.

**Actual** @ 15652a6b — `vllm/v1/core/kv_cache_utils.py`:

Allocation pops from the **head**:
```python
215    def popleft(self) -> KVCacheBlock:
...
232        first_block: KVCacheBlock = self.fake_free_list_head.next_free_block
```
```python
252    def popleft_n(self, n: int) -> list[KVCacheBlock]:
...
266        curr_block = self.fake_free_list_head.next_free_block
267        # Pop n blocks from the head of the list
```

Freeing appends to the **tail**:
```python
307    def append(self, block: KVCacheBlock) -> None:
...
319        last_block: KVCacheBlock = self.fake_free_list_tail.prev_free_block
321        # Connect the new block after the last block.
322        last_block.next_free_block = block
```

Eviction runs on the head-popped blocks — `vllm/v1/core/block_pool.py`:
```python
347            ret: list[KVCacheBlock] = self.free_block_queue.popleft_n(num_blocks)
...
352                self._maybe_evict_cached_block(block)
```
and freeing goes to the tail at line 441 `self.free_block_queue.append_n(freed_blocks)`.

The class docstring agrees with the code (`kv_cache_utils.py:175-176`): *"1. The least recent used block is at the front (LRU)."*

**VERDICT: REFUTED.** The head/front is the least-recently-used and is the eviction frontier; the tail holds the most-recently-freed blocks. The dive states the opposite. The error is also **internally self-contradictory**: the very next clause says "Allocation pops from the head" and describes eviction happening there — which only makes sense if the head is LRU.

**Required correction:** `CodebaseScheduler.tsx:349` — change "the tail is the least-recently-used" to "the head is the least-recently-used" (or "the head is the eviction frontier; freed blocks are appended at the tail").

Note the neighbouring `FreeKVCacheBlockQueue` description (`CodebaseScheduler.tsx:337-343`) is **CONFIRMED**: `prev_free_block`/`next_free_block` exist at `kv_cache_utils.py:130-131`, `class FreeKVCacheBlockQueue` at 165, O(1) middle `remove()` at 285, and the docstring explicitly states the deque-avoidance and no-Python-object-allocation rationale (lines 166-172).

---

### C16 — Rust frontend unsupported-argument inventory: "63 hard-error arguments and 6 no-op arguments"

**Dive text** (`CodebaseRust.tsx:455-464`).

**Actual** @ 15652a6b — `rust/src/cmd/src/cli/unsupported.rs` (642 lines):
- `grep -cE ':\s*Option<Unsupported>'` → **63**
- `grep -cE ':\s*Option<Noop>'` → **6**

Supporting structure: line 18 `pub struct Unsupported(pub serde_json::Value);` with doc comment "recognizes but does not support yet"; line 40 `pub struct Noop;`; lines 101-103 "Check whether any unsupported arguments are set, and if so, return an error listing them. Also warn about any no-op arguments that are set but will be ignored."

**VERDICT: CONFIRMED, exactly.** This is the most impressively precise claim in the dive — two exact counts from a 642-line Rust file, both correct.

Related: `VLLM_USE_RUST_FRONTEND` default-off is CONFIRMED — `vllm/envs.py:142` `VLLM_USE_RUST_FRONTEND: bool = False`; line 553 `use_rust = bool(int(os.environ.get("VLLM_USE_RUST_FRONTEND", "0")))`.

---

### C17 — Speculative-decoding V1 constraints

**Dive text** (`CodebaseAdvanced.tsx:548-573`).

| Sub-claim | Actual @ 15652a6b | Verdict |
| --- | --- | --- |
| "Drafter lives on the last pipeline-parallel rank ... only constructs `self.drafter` when `get_pp_group().is_last_rank`" | `vllm/v1/worker/gpu_model_runner.py:545` `if self.speculative_config and get_pp_group().is_last_rank:` immediately preceding the `self.drafter` assignments at 546-590 | CONFIRMED |
| "`DraftModelProposer._raise_if_draft_tp_mismatch` raises if draft TP ≠ target TP" | `vllm/v1/spec_decode/draft_model.py:31` call site, `:36` `def _raise_if_draft_tp_mismatch(self)` | CONFIRMED |
| "`_verify_and_get_draft_tp` in the speculative config also rejects any draft TP that is not 1 or the target TP" | `vllm/config/speculative.py:893` `def _verify_and_get_draft_tp(`, called at `:789` | CONFIRMED |
| "`DraftModelProposer` calls `verify_equal_vocab_size_if_draft_model()` on construction" | `vllm/v1/spec_decode/draft_model.py:34` `self.speculative_config.verify_equal_vocab_size_if_draft_model()`; definition at `vllm/config/speculative.py:1021` | CONFIRMED |

**VERDICT: ALL CONFIRMED.** Function names, file paths and call-site semantics are exact.

---

### C18 — Prefix-cache root hash is process-local by default

**Dive text** (`CodebaseScheduler.tsx:390-398`).

**Actual** — `vllm/v1/core/kv_cache_utils.py:98-113`:
```python
 98 def init_none_hash(hash_fn: Callable[[Any], bytes]):
 99     global NONE_HASH
101     hash_seed = os.getenv("PYTHONHASHSEED")
102     if hash_seed is None and hash_fn in _CBOR_HASH_FUNCTIONS:
103         logger.warning(
104             "PYTHONHASHSEED is not set. This will lead to non-reproducible "
105             "block-hashes when using CBOR-based hash functions such as "
106             "sha256_cbor or xxhash_cbor. Consider setting PYTHONHASHSEED to a "
107             "fixed value for reproducibility."
108         )
110     if hash_seed is None:
111         NONE_HASH = BlockHash(os.urandom(32))
112     else:
113         NONE_HASH = BlockHash(hash_fn(hash_seed))
```

**VERDICT: CONFIRMED**, including the fine detail that the warning fires only for CBOR-based hash functions — which the dive states correctly ("The code logs a warning for CBOR-based hash functions").

---

### C19 — Preemption is recompute-only

**Dive text** (`CodebaseScheduler.tsx:437-444`).

**Actual** — `vllm/v1/core/sched/scheduler.py:986-995`:
```python
986        request.status = RequestStatus.PREEMPTED
987        request.num_computed_tokens = 0
...
992            request.record_event(EngineCoreEventType.PREEMPTED, timestamp)
995        self.waiting.prepend_request(request)
```

**VERDICT: CONFIRMED.** Status flip, `num_computed_tokens = 0`, and `prepend_request` to the front of the waiting queue all appear in that exact order. No CPU-swap path exists in `vllm/v1/core/sched/`.

---

### C20 — V2 model runner gating

**Dive text** (`CodebaseExecution.tsx:341-348`):
> `use_v2_model_runner` reads the `VLLM_USE_V2_MODEL_RUNNER` env var, and when unset falls back to a per-model default that also requires Triton and rejects unsupported features. V2 is opt-in and under active development. Its README simply says "under active development" and names a maintainer.

**Actual** — `vllm/config/vllm.py:519-542`:
```python
519    def use_v2_model_runner(self) -> bool:
520        use_v2_model_runner = envs.VLLM_USE_V2_MODEL_RUNNER
521        if use_v2_model_runner is not None:
522            return use_v2_model_runner
524        if not self._is_default_v2_model_runner_model():
525            return False
527        if not HAS_TRITON:
528            logger.warning_once(
529                "Model Runner V2 requires Triton; using the V1 model runner instead."
530            )
531            return False
533        unsupported = self._get_v2_model_runner_unsupported_features()
534        if unsupported:
...
540            return False
542        return True
```
`vllm/v1/worker/gpu/README.md` @ pin, verbatim:
```
# [Experimental] Model Runner V2

This directory contains the new model runner which is under active development.
Ping [Woosuk Kwon](https://github.com/WoosukKwon) for any changes.
```

**VERDICT: CONFIRMED**, with one imprecision: the dive says "The `Worker` picks between them at construction: `use_v2_model_runner` reads the env var". `use_v2_model_runner` is a **property on `VllmConfig`**, not on `Worker`; the worker reads it (`vllm/v1/worker/gpu_worker.py:161` `self.use_v2_model_runner = vllm_config.use_v2_model_runner`). Substance correct, attribution loose.

Also note that at the pin, `_is_default_v2_model_runner_model()` gates on `DEFAULT_V2_MODEL_RUNNER_ARCHITECTURES = frozenset({"LlamaForCausalLM", "MistralForCausalLM", "Qwen3ForCausalLM"})` (`vllm/config/vllm.py:69-75`) plus `not is_moe and not is_quantized`. The dive does not name these — see the drift section, because this set has been entirely replaced at HEAD.

---

## 2. Summary verdict table

| # | Claim | Tab | Verdict |
| --- | --- | --- | --- |
| C1 | `vllm/engine/llm_engine.py` is seven lines | Architecture | CONFIRMED |
| C2 | `vllm/` ~675,000 lines / ~1,799 files | Architecture | CONFIRMED (674,655 / 1,799) |
| C3 | `csrc/` = 242 CUDA/C++ source+header files | Architecture | PARTLY-CORRECT (242 excludes 41 `.hpp`) |
| C4 | `rust/` ~210 `.rs` files | Architecture | CONFIRMED (exactly 210) |
| C5 | `EngineCoreProc` = busy loop + two daemon IO threads | Architecture | CONFIRMED |
| C6 | Wire messages are msgspec Structs, "not pickle" | Architecture | PARTLY-CORRECT (gated pickle fallback; shm hop uses pickle) |
| C7 | `EngineCoreClient` owns ZMQ ROUTER in / PULL out | Architecture | CONFIRMED |
| C8 | `gc.freeze()` after model load | Architecture | CONFIRMED |
| C9 | `gpu_memory_utilization` default 0.92 | Config | CONFIRMED |
| C10 | `block_size` default 16 (`DEFAULT_BLOCK_SIZE`) | Config | CONFIRMED |
| C11 | `max_num_seqs` 128 / `max_num_batched_tokens` 2048 | Config | CONFIRMED |
| C12 | `optimization_level` default `O2`; LoRA 16/1 | Config | CONFIRMED |
| C13 | `CompilationConfig` = "single largest config file" | Config | **REFUTED** (1,525; `vllm.py` 2,264, `model.py` 2,249) |
| C14 | 7,560 / 1,560 / 2,500 / 2,600 line counts | Exec/Dist/Config | CONFIRMED (7,561 / 1,558 / 2,499 / 2,606) |
| C15 | Free-queue "the tail is the least-recently-used" | Scheduler | **REFUTED** (head is LRU) |
| C16 | Rust: 63 hard-error + 6 no-op args | Rust | CONFIRMED (exact) |
| C17 | Spec-decode constraints (PP rank, draft TP, vocab) | Advanced | CONFIRMED |
| C18 | `NONE_HASH = os.urandom(32)` when `PYTHONHASHSEED` unset | Scheduler | CONFIRMED |
| C19 | Preemption is recompute-only | Scheduler | CONFIRMED |
| C20 | V2 runner gating (env → per-model → Triton → features) | Execution | CONFIRMED (attribution loose) |

**Score: 16 CONFIRMED, 2 PARTLY-CORRECT, 2 REFUTED, 0 UNVERIFIABLE.**

---

## 3. Drift assessment: 15652a6b → HEAD

**[AUTHORITATIVE — GitHub compare API + full source trees at both SHAs]**

| Metric | Pin `15652a6b` (2026-06-07) | HEAD `06018507` (2026-08-02) | Δ |
| --- | --- | --- | --- |
| Commits between | — | — | **2,093** (56 days, ~37/day) |
| `vllm/` `.py` files | 1,799 | 2,159 | +360 (+20.0%) |
| `vllm/` `.py` lines | 674,655 | 808,401 | +133,746 (+19.8%) |
| `csrc/` (cu+cuh+cpp+h) | 242 | 240 | −2 |
| `rust/` `.rs` files | 210 | 303 | +93 (+44.3%) |

### 3a. What did NOT change (dive claims still true at HEAD)

- `vllm/engine/llm_engine.py` — **byte-identical 7-line shim**. C1 holds at HEAD.
- All config defaults: `DEFAULT_BLOCK_SIZE = 16` (`cache.py:47`), `gpu_memory_utilization = 0.92` (`cache.py:68`), `DEFAULT_MAX_NUM_BATCHED_TOKENS = 2048` (`scheduler.py:42`), `DEFAULT_MAX_NUM_SEQS = 128` (`scheduler.py:44`), `optimization_level = O2` (`vllm.py:409`), `max_lora_rank = 16` / `max_loras = 1` (`lora.py:35,37`). **C9-C12 all hold.**
- `CompilationMode` enum members `NONE=0 / STOCK_TORCH_COMPILE=1 / DYNAMO_TRACE_ONCE=2 / VLLM_COMPILE=3` unchanged (`compilation.py:41-48`).
- `EngineCoreProc` still exactly two `daemon=True` threads (`core.py`, `grep -c` → 2). **C5 holds.**
- `serial_utils.py` pickle gating unchanged (`CUSTOM_TYPE_PICKLE = 1` at line 41; `VLLM_ALLOW_INSECURE_SERIALIZATION` guards at 163/214/221). **C6's nuance holds.**
- V2 runner README verbatim identical.
- **Zero of the ~50 `.py` paths cited across the 8 tabs has been removed or renamed at HEAD.** No structural path breakage.
- `C13` remains REFUTED at HEAD (`compilation.py` 1,570 vs `vllm.py` 2,476, `model.py` 2,383) — the gap widened.
- `C15` remains REFUTED at HEAD.

### 3b. What DID change (dive claims now stale at HEAD, though true at the pin)

1. **`NixlConnector` worker was split apart — the "~2,500-line `worker.py`" no longer exists.** At HEAD `vllm/distributed/kv_transfer/kv_connector/v1/nixl/worker.py` is **13 lines**, a backward-compat re-export:
   ```python
   3  """Backward-compatible re-export of NixlPullConnectorWorker."""
   5  from vllm.distributed.kv_transfer.kv_connector.v1.nixl.pull_worker import (
   6      NixlPullConnectorWorker,
   7  )
   10 NixlConnectorWorker = NixlPullConnectorWorker
   ```
   The logic moved into a pull/push split: `base_worker.py` (2,598), `push_worker.py` (778), `pull_worker.py` (399), plus `base_scheduler.py` (505), `pull_scheduler.py` (280), `push_scheduler.py` (356), `tp_mapping.py`, `stats.py`, `metadata.py`. The directory went from a 3-file layout to 14 files / 6,112 lines. **The dive's sentence "split across `connector.py` ... `scheduler.py` ... and a ~2,500-line `worker.py`" and its "the decoder pulls KV from the prefiller; the prefiller never pushes" claim are both stale — a push path now exists in-tree** (`push_worker.py`, `push_scheduler.py`). This is the single largest structural drift affecting the dive.

2. **Rust unsupported-argument inventory changed: 63/6 → 49/7.** As the Rust frontend implements more flags, 14 moved out of `Unsupported`. The dive's "In the pinned commit the inventory carries 63 hard-error arguments and 6 no-op arguments" is correctly pin-scoped, so it stays honest — but it is no longer descriptive of current vLLM.

3. **`DEFAULT_V2_MODEL_RUNNER_ARCHITECTURES` was completely swapped out.** Pin: `{LlamaForCausalLM, MistralForCausalLM, Qwen3ForCausalLM}`. HEAD: `{DeepseekV2ForCausalLM, GraniteMoeForCausalLM, InklingForCausalLM, InklingForConditionalGeneration, KimiK3ForConditionalGeneration, LongcatFlashNgramForCausalLM, Qwen2MoeForCausalLM}` (`vllm/config/vllm.py:69-78`), plus a new `ROCM_EXCLUDED_V2_MODEL_RUNNER_ARCHITECTURES` and a platform-aware resolver `default_v2_model_runner_architectures()` (line 90). The gating property also grew four new force-V2 branches at HEAD (`prefill_context_parallel_size > 1`, `spec method == "dspark"`, `_dflash_needs_multi_kv_group()`, `model_config.is_diffusion`). The dive's characterization "V2 is opt-in" is weakening: at HEAD, several configurations force V2 regardless of the env var. The dive does not name the arch list, so nothing it printed is falsified — but the "opt-in" framing is drifting toward inaccuracy.

4. **Every quoted line count has moved.** `gpu_model_runner.py` 7,561 → 7,920 (+359); V2 `gpu/model_runner.py` 1,558 → 1,723 (+165); `arg_utils.py` 2,606 → 2,831 (+225); `core.py` 2,239 → 2,488; `sched/scheduler.py` 2,422 → 2,915 (+20%); `block_pool.py` 528 → 830 (+57%); `kv_cache_manager.py` 579 → 878 (+52%); `single_type_kv_cache_manager.py` 1,409 → 1,942 (+38%); `flash_attn.py` 1,223 → 1,690 (+38%); `speculative.py` 1,099 → 1,435 (+31%). All are correctly pin-labelled in the dive, so none is a factual error — but a reader checking against `main` today will find every number off by 5-57%.

5. **Repo-scale headline is stale.** "roughly 675,000 lines across about 1,799 files" is now 808,401 / 2,159 — the dive's figure understates current vLLM by ~20%. `rust/` grew 44% (210 → 303 `.rs`), so the tab's framing of Rust as "the newest tree" is if anything more true, but the count is well out of date.

### 3c. Drift verdict in three lines

1. **2,093 commits and 56 days separate the pin from HEAD; `vllm/` grew ~20% in both files and lines, and `rust/` grew 44%.** The pin is meaningfully aged but not obsolete.
2. **Nothing the dive asserts about architecture, process model, or config defaults has become false at HEAD** — the 7-line V0 shim, the two-daemon-thread EngineCore, msgspec-with-gated-pickle, and every documented default are all unchanged; no cited path was removed or renamed.
3. **Three claims are now stale as descriptions of current vLLM even though they were true at the pin**: the NixlConnector `worker.py` monolith (2,499 → 13 lines, split into pull/push workers, and a push path now exists contradicting "the prefiller never pushes"), the Rust unsupported-arg inventory (63/6 → 49/7), and every quoted line count (off 5-57%).

---

## 4. Inference presented as fact

These are not necessarily wrong — they are places where the dive states a synthesized conclusion in the same declarative register as a cited code fact, with no hedge and no traceable line. Per the source-authority rule, these should carry a `[SPECULATIVE]`-equivalent framing or a citation.

1. **"The old single-process, Python-object-passing architecture has been fully removed."** (`CodebaseArchitecture.tsx:261-263`) — INFERENCE. What is *verifiable* is that `llm_engine.py` and `async_llm_engine.py` are 7-line shims. "Fully removed" is a negative existential over the whole repo that no single file demonstrates.

2. **"the older `vllm/engine/` tree has been reduced to a compatibility shim"** (`CodebaseArchitecture.tsx:251-253`) — PARTLY WRONG AS STATED, and self-contradicted. At the pin `vllm/engine/` contains `arg_utils.py` (**2,606 lines**) and `protocol.py` (257 lines) alongside the two 7-line shims — 2,877 lines total, of which only 14 are shim. The Config tab itself cites `vllm/engine/arg_utils.py, ~2,600 lines` as the live user-facing flag surface. `vllm/engine/` is not a shim tree; it is a shim *plus the entire EngineArgs surface*. Recommend rewording to "the older `vllm/engine/` tree retains only `arg_utils.py` / `protocol.py` plus two 7-line compatibility shims."

3. **"Workers never talk to the frontend directly, only to the EngineCore via its executor."** (`CodebaseArchitecture.tsx:315-318`) — INFERENCE. Architecturally sound and consistent with the code read, but it is a universal negative asserted without a cited file or line.

4. **"That is the whole LRU mechanism, with no separate eviction thread."** (`CodebaseScheduler.tsx:352`) — INFERENCE (a negative existential). It happens to be correct — eviction is inline in `block_pool.py:352` on the allocation path — but "no separate eviction thread" is unproven by any quoted line. Compounded by the fact that the sentence it terminates contains the C15 error.

5. **"That is why the wire format is `msgspec` (zero-copy where possible)"** (`CodebaseArchitecture.tsx:322-325`) — INFERENCE with a causal claim ("that is why") plus a performance characterization ("zero-copy where possible") attributed to no source. msgspec/msgpack is not inherently zero-copy; vLLM achieves out-of-band buffers via `aux_buffers` in `serial_utils.py`, which is the real mechanism and is not cited.

6. **"It exists instead of a `deque` specifically to support `remove()` from the middle in O(1) and to allocate no Python objects on the hot path"** (`CodebaseScheduler.tsx:338-342`) — this is an *intent* claim, and it is traceable — but only to the class docstring (`kv_cache_utils.py:166-172`), not to code. Under the project's own methodology rule (docstrings are orientation, not authority) this should be attributed as "the class docstring states..." rather than asserted as design fact. In this instance the docstring and code agree, so the risk is procedural rather than substantive.

7. **"The `Worker` picks between them at construction: `use_v2_model_runner` reads the `VLLM_USE_V2_MODEL_RUNNER` env var"** (`CodebaseExecution.tsx:342-344`) — MISATTRIBUTION. `use_v2_model_runner` is a `VllmConfig` property (`vllm/config/vllm.py:519`); `Worker` merely consumes it (`gpu_worker.py:161`). Minor, but it points the reader at the wrong file.

---

## 5. Required corrections (blocking)

| Priority | File / line | Current text | Correct text |
| --- | --- | --- | --- |
| **P0** | `CodebaseScheduler.tsx:349` | "the tail is the least-recently-used" | "the **head** is the least-recently-used" — `popleft()`/`popleft_n()` take from `fake_free_list_head`, `append()`/`append_n()` add at `fake_free_list_tail`, and `_maybe_evict_cached_block()` runs on head-popped blocks (`block_pool.py:347-352`). Self-contradicts the next clause as written. |
| **P0** | `CodebaseConfig.tsx:72` | `CompilationConfig` — "The single largest config file." | Refuted: 1,525 lines vs `vllm/config/vllm.py` 2,264 and `vllm/config/model.py` 2,249. Also contradicts the `ModelConfig` row's "The largest dataclass" at line 24. Reword to a defensible superlative or drop it. |
| **P1** | `CodebaseArchitecture.tsx:251-253` | "the older `vllm/engine/` tree has been reduced to a compatibility shim" | `vllm/engine/` is 2,877 lines at the pin, of which 2,606 are the live `arg_utils.py` the Config tab itself relies on. Reword. |
| **P1** | `CodebaseArchitecture.tsx:301` | "Messages on the wire are `msgspec` Structs, not pickle." | Add scope: true for the EngineCore ZMQ hop by default; a pickle/cloudpickle fallback exists behind `VLLM_ALLOW_INSECURE_SERIALIZATION=1` (`serial_utils.py:221-235`), object-dtype ndarrays fall back ungated (`:195`), and the worker shared-memory hop uses `pickle.dumps` unconditionally (`shm_broadcast.py:743`). |
| **P2** | `CodebaseArchitecture.tsx:247-250` | "`csrc/` holds 242 CUDA/C++ source and header files" | 242 = `.cu`+`.cuh`+`.cpp`+`.h`; 283 including the 41 `.hpp` headers. State the extension set or use 283. |
| **P2** | `CodebaseExecution.tsx:342` | "The `Worker` picks between them at construction: `use_v2_model_runner` reads..." | `use_v2_model_runner` is a `VllmConfig` property (`config/vllm.py:519`); `Worker` reads it (`gpu_worker.py:161`). |
| **P3** | `CodebaseDistributed.tsx:455-458` | "a ~2,500-line `worker.py`" / "the prefiller never pushes" | True at the pin. Stale at HEAD: `worker.py` is now a 13-line re-export and a push path (`push_worker.py`, `push_scheduler.py`) exists. Consider a staleness note if the dive is refreshed. |

---

## 6. Method note

Both trees were downloaded in full (`codeload.github.com/.../tar.gz/<sha>`) rather than fetched file-by-file, so every count in this report is reproducible with a single `find`/`wc` against a local tree. No claim in this report rests on a README, docstring, or design doc; where a docstring was consulted (C15, the `FreeKVCacheBlockQueue` rationale) it is labelled as such and the underlying code was read independently — and in the one case where it mattered, code and docstring agreed *against* the dive.
