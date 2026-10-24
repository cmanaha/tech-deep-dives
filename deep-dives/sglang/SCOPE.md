# SGLang: Scope and Section Plan

**Title:** SGLang: The Serving Runtime Built Around a Shared Prefix Index
**Subtitle:** How SGLang v0.5.22 schedules, caches and scales LLM serving, where its design differs from vLLM and why, and how to run it on AWS
**Status:** Scoping v1 (2026-10-24). Research registers 00 to 09 complete; 10 (SGLang vs vLLM) in progress. Reviews pending.
**Pin:** SGLang `v0.5.22`, commit `baa9befa381511cd4d56f83980951e5a45fffc6d`, released 2026-10-19 (register 00). Accessed date 2026-10-24 on every citation.
**Sibling dive:** vLLM (pinned to v0.31.0). The reader knows it. Shared fundamentals (the inference workload, continuous batching, paged KV memory, the parallelism vocabulary) are defined there and linked, never repeated here.

**How to read the evidence markers.** IDs such as (01 C13) point to rows in `research/2026-10/NN-*.md`. Each row carries a tag-pinned code or docs URL, its tier and the fact to ship. `[project claim]` marks an SGLang/LMSYS performance figure; `[vendor claim]` an AWS or NVIDIA one; `[our reading]` a synthesis no single source states.

**How to read a section block.** Depth tag (overview, mechanism, practical), the payoff the h2 description carries, content in reading order, the mental model or practical value that earns the section its place, and the planned diagram.

---

## Thesis

SGLang treats the KV cache as a shared index of token sequences. A radix tree over the KV pool decides what a cache hit costs (slot indices copied into the request's row, no KV bytes moved), what eviction removes (whole unlocked leaves, only when an allocation is short), what the gateway approximates (the prompt text it has already sent to each worker), and what the hierarchical cache tiers (tree nodes demoted to host memory, not deleted) (02 A3, B7, C6, E2; 06 B3). The rest of the runtime keeps the GPU busy around that index: one scheduler process per GPU that plans a batch ahead of the one running (01 A3, B4), an admission rule that bets running requests will stop early and retracts the losers when they do not (01 C13 to C17), and a parallel layout that carves one tensor-parallel group three ways for attention and again for experts (05 A1, A3).

Two consequences change what a reader does. First, several behaviours that look like settings are decided by the GPU and the model: the attention backend is chosen by model family then GPU generation, and it sets the page size, which sets how finely prefixes are reused, token-exact on H100 and 64-token steps on B200 for the same Llama deployment (03 A3, A4, B13; 02 B6). Second, the default scheduling policy is first-come-first-served; the cache-aware longest-prefix-match ordering the SGLang paper introduced is opt-in and falls back to FCFS above 128 queued requests (01 C5; 02 C9). SGLang's prefix advantage at v0.5.22 comes from the index and the router, not from reordering the queue by default.

For a reader who knows vLLM, the differences that matter are design choices with consequences, each backed by code on both sides (register 10): where the processes split, how admission and preemption work, a token-sequence tree against a hash-chained block table, PD disaggregation that pushes KV from prefill into pages decode reserved against vLLM's default pull (05 C8, C9, F1), a first-party cache-aware gateway against routing in separate projects (06 G1), and an admin plane for RL weight sync that is open unless a key is set (07 B12). Benchmark comparisons are dated project or third-party claims with stated conditions, and the dive never computes a winner.

---

## Section Plan

### Layer A. Framing and the reader's map

**1. Thesis & Framing: a runtime built around a shared prefix index**
Depth: overview
Payoff: What SGLang optimises for, what that predicts about its behaviour, and where this dive and the vLLM dive divide the work.

Opens with the workload SGLang is built for, stated from its own README: agentic workloads, large-scale serving and RL rollouts (00 README), and the observation that these share long prefixes across requests (system prompts, tool schemas, multi-turn history, few-shot examples, sampled branches of one prompt). Names the bet: index the KV cache by token sequence so a shared prefix is computed once and found by every later request. Places the components the dive covers on one map: the runtime (tokenizer, scheduler per GPU, detokenizer), the radix cache and HiCache, the kernel layer, request features (structured output, speculative decoding, LoRA), scale-out (DP attention, EP, PD), the gateway, and the deployment layers (Kubernetes orchestrators, AWS). States the two consequences from the thesis in plain words, each pointed to its section. Ends on the pin: v0.5.22, released 2026-10-19 on a two-week cadence, with Python 3.11 required (00). Mental model: the KV cache is a shared index, and every component either feeds it, reads it or approximates it. Diagram: the component map, with the radix tree at the centre and arrows labelled feeds / reads / approximates.

**2. Getting Started: your path into SGLang**
Depth: overview (prose-first)
Payoff: The four ideas to hold, the shortest route for why you are here, and the six SGLang facts that surprise a vLLM user.

*Who this is for.* A technical lead who has read or run vLLM, knows what prefill, decode and a KV cache are, has sized a GPU deployment, and wants to know whether SGLang behaves differently enough to matter. No SGLang experience assumed.

*Four prerequisite concepts, and where each is defined.*
(a) **Prefill, decode and the KV cache**: prompt processing is compute-bound, token generation is memory-bound, and the KV cache holds the attention state between them (vLLM dive, "2. The Inference Workload").
(b) **Continuous batching under a token budget**: the scheduler re-forms the batch every step (vLLM dive, "4. Scheduler & Continuous Batching").
(c) **Paged KV memory**: the cache is a pool of fixed-size slots addressed through a per-request table (vLLM dive, "5. Paged KV Cache & Block Tables"; this dive's section 6 for SGLang's pools).
(d) **Tensor, data and expert parallelism**: which axis splits heads, requests and experts (vLLM dive, "9. Distributed Inference"; this dive's section 16 for how SGLang counts them).

*The path, and why in this order.* The runtime first (3, 4), because every later behaviour is a scheduler decision. Then the index (5 to 7), the dive's central model, and the hardware layer that sets its page size (8, 9). Then request features that ride on the scheduler (10 to 15). Then scale-out (16 to 20), which reuses the index model at cluster scale: the gateway approximates it, PD moves it. The codebase walk (21) follows the concepts. AWS (22 to 24) applies all of it to instance choice and EFA. The comparison, ecosystem, operations and decision guide close the dive (25 to 28).

*If you know vLLM: six facts that change what you type.* A short table, each row linking its section: the default schedule policy is FCFS (4); one scheduler process per GPU, so `--tp 8` gives 10 processes (3); the backend sets the page size and so prefix-reuse granularity (6, 8); PD pushes KV into decode-reserved pages (18); `--tp 8 --attn-dp-size 8 --ep 8` is 8 GPUs (16); a bare LoRA adapter name runs the base model, use `base:adapter` (13) (01 A3, C5; 03 B13; 05 A4, C8; 07 C16).

*Three shorter routes.*
- "I serve agentic or multi-turn traffic": 1, 2, 3, 4, 5, 6, 7, 19, 27, 28.
- "I run large MoE models at scale": 1, 2, 3, 6, 8, 16, 17, 18, 19, 24, 28.
- "I deploy on AWS this quarter": 1, 2, 6, 8, 22, 23, 24, 27, 28.

Diagram: the reading map as a dependency graph with the three routes highlighted.

### Layer B. The runtime and the index

**3. The SGLang Runtime: processes and sockets**
Depth: overview, then mechanism
Payoff: What `ps` shows for a given launch, why, and how many CPU cores and ports a deployment needs.

Opens with what a `--tp 8` launch starts: one tokenizer process (the HTTP server), eight scheduler processes, one detokenizer, connected by ZeroMQ (ZMQ) sockets (01 A1 to A5). Rank 0 receives requests and broadcasts them so every rank builds the same batch (01 A3). `launch_server` against the in-process `Engine` (01 A6, A7). Data-parallel replicas add a `DataParallelController` with `round_robin` as the default balance method (01 A8, A9). The opt-in Rust frontend and the gRPC entrypoint as options (01 A12 to A16). Mental model: three process types on a one-way ZMQ ring, and every GPU process schedules for itself. Practical: process count is `1 + GPUs + 1`, plus a controller under DP; tokenizer and detokenizer CPU load never stalls the GPU loop. Diagram: the three-process pipeline with ZMQ edges and the rank-0 broadcast.

**4. The Scheduler: one step ahead, betting on early stops**
Depth: mechanism plus practical
Payoff: Predict when a request waits, when it is retracted, and which log field tells you.

Opens with the two ideas in the title. Overlap scheduling, on by default: batch N+1 is launched before batch N's tokens are known, and the FutureMap fills them in on the GPU; a request that stops on EOS decodes one extra step, and pipeline parallelism turns overlap off (01 B4 to B12). Admission: a new request is charged its uncached prompt plus up to 4096 output tokens, running requests a share of their remaining output that starts at 0.7 and decays to about 0.1 over 600 steps (01 C13 to C15). Retraction: when KV runs out, the requests with the fewest generated tokens are re-queued and recomputed, and the share jumps back (01 C16, C17). Prefill first: a prefill step and a decode step do not share a forward unless `--enable-mixed-chunk` is set (01 C3, C18, C19). Policies: `fcfs` default, `lpm` and the others opt-in, and lpm's fallback above 128 queued requests (01 C5 to C8). The strongest number, landed twice: requests are charged up to 4096 output tokens and running ones 70% of theirs at start. Ends on the instruments: the periodic log line (`#running-req`, `#queue-req`, `token usage`, `cache hit rate`), the retraction warning, `sglang:new_token_ratio`, and `--schedule-conservativeness` (01 E1 to E8). Mental models: the scheduler runs one batch ahead; admission is a bet on early stopping. Diagrams: an overlap timeline (CPU plans N+1 under GPU batch N); the admission-bet chart (reserved share decaying, retraction resetting it).

**5. RadixAttention and the Radix Cache**
Depth: mechanism
Payoff: Predict what a request reuses, what stays resident, and what gets evicted, from the shape of the tree.

Opens with the tree as an index of token runs over a pool that is always full of reusable KV (02 mental model 1). A hit copies slot indices into the request's `req_to_token` row; no KV bytes move, so hit cost does not grow with model size (02 D1, D2, B4). A running request locks every node from its match to the root; only unlocked leaves are evictable, and eviction runs only when an allocation is short and removes whole leaves (02 B10, C2, C5, C6). The policies (`--radix-eviction-policy`, LRU default) and the scheduler link: `fcfs` default, `lpm` opt-in (02 C1 to C9). The serving class is `UnifiedRadixCache` on a Rust core; "RadixAttention" names the attention layer every model calls (02 A11, A12, B2). The paper-era history and its 2024 speedups against vLLM v0.2.5 sit in an ExpandableSection, labelled as a dated paper claim (02 A1 to A5). The frontend language's `fork` as the clearest picture of the design intent: the program's fork tree becomes a branch point in the radix tree (07 A7 to A10; section 14 covers the language). Ends on the knobs and the metric to read first: `sglang:token_usage` excludes evictable cache, so a pool full of reusable prefixes shows low usage (02 C14). Diagrams: a radix tree with a shared system prompt and branching conversations, nodes annotated with lock counts and the unlocked leaf being evicted; a hit drawn as index copy into the request row.

**6. KV Memory and the Defaults Your GPU Picks**
Depth: practical
Payoff: How many tokens fit on your GPU, and which startup defaults move when you change instance type.

Opens with the sizing rule: free memory after weights and graphs, divided by bytes per token per layer (02 D1 to D5). `mem_fraction_static` is derived from the chunk size and decode-graph size, about 0.83 on an H100 at TP 1 by the code formula `[our reading]`, with the docs-versus-code conflict on the fallback (0.95 in code, 0.88 in docs) (01 D2, D3, D6, D10). The GPU-tier table: `chunked_prefill_size` and decode CUDA-graph batch sizes by GPU memory (01 C20 to C22, D1 to D15). The page size: `--page-size` defaults to 1 and the attention backend overrides it (02 B6, B13, B14; 03 B13, B14). KV cache dtype: `--kv-cache-dtype auto` becomes FP8 when the checkpoint declares an FP8 KV cache (03 D10). MLA pools for DeepSeek-class models (02 D6 to D8). Ends on the three knobs and one metric: `--mem-fraction-static`, `--kv-cache-dtype`, `--page-size` (rarely), and how to read `sglang:token_usage`. Mental model: defaults are computed from your GPU. Diagram: a GPU memory bar split into weights, activations and graphs, and the KV pool, with the page-size note per backend.

**7. HiCache: one tree across GPU, host and storage**
Depth: mechanism plus practical
Payoff: Turn on host and storage tiers, and know what a hit from each tier costs and when it is skipped.

Opens with the model: with HiCache on, GPU eviction demotes a backed-up node to host-only; it stays in the tree and returns layer by layer on the next hit (02 E2, E3). Tiers, write policies, prefetch policies and the storage backends (13 named plus `dynamic`), with the documented set marked (02 E1 to E13). Host hits under 10 tokens are not loaded back (02 E8). Two instances on one L3 backend find each other's pages, because L3 keys are chained SHA-256 page hashes plus a namespace (02 E9). The DOC-CODE conflicts: prefetch timeout (code: 1 s plus 0.25 s per 1K tokens, no cap; docs: 2 s plus 0.1 s, capped at 30 s) and `--hicache-ratio` (code warns, docs say it must exceed 1) (02 E6, E16). HiSparse and the session radix cache as short ExpandableSections (02 E20, E21). Ends on the bring-up flags with their defaults. Diagram: three tiers with the write-through and prefetch paths, and a node changing tier on eviction.

**8. Attention Backends and Kernels**
Depth: mechanism
Payoff: Predict which attention kernel your model gets on a given GPU, what page size that implies, and where the kernel comes from.

Opens with the selection order: platform hooks, then 33 per-architecture override modules, then the generic GPU table; to predict a new model's backend, look for its override module first (03 A3 to A8). The default table by GPU generation and attention type (MHA/GQA, MLA, DeepSeek sparse attention, hybrid linear) (03 A1 to A22). Each backend name is a route to an upstream kernel project with its own pin: FlashInfer 0.7.1 (which carries the TensorRT-LLM kernels), the `sglang-kernel` 0.4.9 wheel (FA3, FlashMLA), FA4 vendored in-tree, DeepGEMM from `sgl-deep-gemm` 0.2.2 (03 B1 to B9, C1, C2). Kernel warm-up as practical leverage: DeepGEMM compiles each new GEMM shape at first start, a duration SGLang's own log estimates at 10 to 20 minutes `[project claim]`; `python -m sglang.compile_deep_gemm` plus persistent `SGLANG_CACHE_DIR` and `SGLANG_JIT_CACHE_DIR` volumes moves it to build time (03 C4, C8 to C12). CUDA graphs: decode graphs and the breakable prefill backend (01 D9 to D14; 03 E2 to E4). The docs-drift rows in an ExpandableSection (03 A10, A13, A16, A17, A18, A22). Hardware coverage table (NVIDIA, AMD ROCm via aiter, Intel XPU and CPU, Ascend, TPU via SGL-JAX, Apple Silicon), with Trainium hedged to "listed as in progress; no Neuron plugin located at v0.5.22" (03 F1 to F7). Mental model: the backend picks the page size, and model family decides before GPU generation does. Diagram: the backend-selection decision tree (override module, then GPU arch by attention type, leaf = backend plus page size).

**9. Quantization and KV Precision**
Depth: practical
Payoff: Know which format your checkpoint will run as, on which GPU, before you launch.

Opens with: the checkpoint decides the format; `--quantization` is for online quantization or a declared compatible override (03 D2 to D5). Formats and their GPU minimums where code enforces them; FP8 on Ampere runs weight-only through Marlin; `--quantization gptq` has no CUDA loader at v0.5.22 (03 D1 to D9). KV precision options and the E4M3 maximum (448 on NVIDIA) (03 D10 to D15). Cross-link to the vLLM dive's "8. Quantization & Precision" for the format background. Ends on a pre-launch check list. Diagram: none needed; a format-by-GPU table carries it.

### Layer C. Request features

**10. Structured Output: one bitmask per token**
Depth: mechanism plus practical
Payoff: Know what a schema costs, what fails with a 400, and the timeout that caches a failure.

Opens with the model: a grammar is a CPU state machine that writes a vocabulary bitmask before every sample; compilation is a one-off cost per distinct schema string; under overlap only the sampling kernel waits for the CPU (04 A7 to A11). Default backend `xgrammar` (the docs table shows `None`), no per-request backend choice, and schemas with keywords XGrammar would ignore get a 400 (04 A1, B2, B6). Jump-forward decoding is dormant at v0.5.22 (04 A12, A13), stated once as what the code does. Reasoning models: the constraint applies after the think block (04 A14). The strongest number, landed twice: a schema still compiling after 10,000 polls (about 50 s) is cached as a failure until `/flush_cache` (04 B5). Ends on the two metrics that move and the whitespace knobs (04 B8, B9). Diagram: one constrained step, grammar state to bitmask to masked logits to sampled token to new state.

**11. Speculative Decoding: draft, verify, keep the agreed prefix**
Depth: mechanism plus practical
Payoff: Pick an algorithm by where the draft comes from, and know what speculation costs in concurrency.

Opens with the model: draft cheaply, verify once, keep the agreed prefix plus one bonus token (04 C14). Algorithms by draft source: a separate draft model (EAGLE, EAGLE3, STANDALONE), built-in heads (NEXTN/MTP), none (NGRAM), and the DFlash and DSpark families (04 C1 to C3). Auto parameters: Llama and Grok get a tree (5/4/8), other models a chain (3/1/4) (04 C4, C5, C6). Block verification opt-in (04 C7, C8); adaptive speculation turns drafting off from 64 concurrent requests by default (04 C9). The strongest number: turning speculation on resets `--max-running-requests` to 48 (04 C10). Interactions in production: overlap stays on for NGRAM and DFLASH on GPU (docs say otherwise), structured output masks every draft-tree node, the v0.5.22 fix for hybrid models under spec plus grammar, PD and DP attention (04 D1 to D11). SpecForge and SpecBundle as draft sources; acceptance and speedup figures only as project claims (04 E1 to E7). Ends on the reader's next action: measure `sglang:spec_accept_length` on your own traffic at your own concurrency. Diagram: a draft-then-verify step timeline (draft steps, one verify pass, accepted prefix, bonus token).

**12. Talking to SGLang: native, OpenAI, Anthropic and Ollama APIs**
Depth: practical
Payoff: Port a client without surprises in output length, sampling defaults or tool parsing, and lock the admin plane.

Opens with the model: one engine, many dialects, all ending in `TokenizerManager.generate_request` (07 B1, C17, C18, D2). The default output cap differs by endpoint: 128 tokens on `/generate`, 16 on `/v1/completions`, up to the context limit on chat; model sampling defaults reach only chat and Responses (07 B4, B5). Tool and reasoning parsers (07 C6 to C9), the v0.5.22 chat response changes (07 C11 to C13), Responses state (07 C14), Anthropic and Ollama surfaces (07 C17 to C19). Admin and control endpoints (07 B8 to B18). Ends on the admin key: with no key the admin routes are open, with only `--api-key` the inference key unlocks them, and only `--admin-api-key` separates operators from clients (07 B12 to B14). Strongest number: 128 tokens, the `/generate` default output cap. Diagram: the endpoint map (dialects into one generate path, admin plane beside it, with which key guards which routes).

**13. LoRA and Multi-Adapter Serving**
Depth: practical
Payoff: Serve many adapters on one base model, and address them the way SGLang expects.

Opens with the slot model and the per-batch cap: 8 adapters per batch by default, one slot shared with base-model requests (07 E4, E5). Backends, per-adapter cache namespaces, dynamic load and unload with drain, speculation limits (07 E1 to E9). The porting pitfall attached to the right call: select an adapter with `model: "base:adapter"`; a bare adapter name runs the base model with no error (07 C16, G9). Cross-link to the vLLM dive's "13. LoRA & Multi-Adapter Serving". Diagram: none; a table of flags and defaults.

**14. The Frontend Language: programs as cache hints**
Depth: overview plus mechanism (short)
Payoff: When a multi-call program against your own server saves prefills, and what `fork` and `select` actually send.

Opens with what the language is: `@sgl.function`, `gen`, `select`, `fork`, `join`, run as a client of `/generate` (07 A1 to A6). `fork` sends the shared prefix as a zero-token request so each branch becomes a leaf under that node (07 A7 to A10); `select` scores every choice in one batched zero-token request by mean logprob (07 A12, A13). Status at v0.5.22, scoped to the evidence: maintained, no longer the main way people use SGLang (07 A18 to A21). Ends on when it is still the right tool. Diagram: a program's fork/join tree mapped onto the radix tree branches it creates.

**15. SGLang as an RL Rollout Engine**
Depth: mechanism plus practical (serving side only)
Payoff: The launch flags and the call sequence an RL trainer needs to refit weights without serving stale KV.

Opens with the model: a refit is a bracket: pause, begin, buckets, end, continue; the radix cache is flushed so no request reuses old-policy KV (07 B9, B11, D4, D5). Since v0.5.21 tensor and distributed updates fail outside `begin_weight_update` / `end_weight_update` (07 D4). NCCL and IPC refit paths, per-token weight versions (07 D5, D6, D9). Memory release frees nothing unless the server started with `--enable-memory-saver` (07 D7, D8). Deterministic inference and its cost as an attributed 2025 project claim (07 D10 to D12). RL frameworks that use SGLang, from register 08 (first-party only). Ends on the launch flags: `--enable-memory-saver`, `--admin-api-key`, optionally `--enable-deterministic-inference`. Diagram: the refit sequence (trainer, gateway, workers) with the bracket calls.

### Layer D. Scale-out

**16. Parallelism: one TP group, carved for attention and experts**
Depth: mechanism
Payoff: Count the GPUs a launch uses, then map the flags onto what each axis splits.

Opens with the counting rule: a server is `tp_size x pp_size` GPUs; inside each TP group, attention is split by attention DP (requests), CP or DCP (tokens of one request) and attention TP (heads), and MoE layers reuse the same GPUs split by EP and MoE TP; `--dp-size` is the only flag that adds GPUs by copying the model (05 A1, A3, A4, B2, B3, F4). v0.5.22 deprecates `--enable-dp-attention` for `--attn-dp-size N` and rejects combining it with `--dp-size` above 1 (05 A3 to A5). Why DP attention suits MLA: the MLA KV size per token has no TP term, so plain TP stores a full copy per GPU (05 A9, A10). CP and DCP briefly (05 A13 to A16); multi-node launch flags (05 A12). Cross-link the vLLM dive's "9. Distributed Inference" for the shared vocabulary. Ends on the translation rule: count GPUs, then map flags. Diagram: the parallelism map (one TP group, the attention carving and the MoE carving over the same GPUs, and which traffic crosses nodes).

**17. Wide Expert Parallelism: DeepEP, EPLB and overlap**
Depth: mechanism plus practical
Payoff: Run a large MoE model across nodes with the right all-to-all mode on each role.

Opens with the model: the EP group moves in lockstep; one rank prefilling forces DeepEP normal mode and no decode CUDA graph on all ranks for that step (05 B6 to B8, B21). All-to-all backends and defaults; picking any of them forces `ep_size = tp_size` (05 B1 to B5). The DOC-CODE conflict: Mooncake EP and NIXL-EP handle low-latency only, so `auto` fails for them (05 B9). EPLB rebalances every 1000 forward passes, not every 1000 requests as the docs say (05 B14). Two-batch and single-batch overlap (05 B17 to B19), elastic EP (05 B16). The LMSYS 96-H100 deployment as a dated project claim in an ExpandableSection (05 B20). Ends on the recipe: DeepEP normal on prefill servers, low-latency on decode servers, which is why PD pays off with wide EP. Diagram: a DeepEP-mode timeline across DP ranks under mixed load, and the same timeline split by PD.

**18. PD Disaggregation: rendezvous, reserve, push**
Depth: mechanism plus practical
Payoff: Bring up prefill and decode pools, know which side throttles which, and read the queues that show it.

Opens with the model: PD is a rendezvous on a room id, then a push; the router stamps one random `bootstrap_room` on two simultaneous requests, decode looks up prefill's ranks in the bootstrap registry, reserves pages and publishes their addresses, and prefill writes KV into them chunk by chunk (05 C4, C6, C8, C9, C14). Transfer backends: the docs list two, the code ships six (05 C2). What moves, including state for hybrid models (05 C13). The destination reservation policy: under the default `early`, decode capacity throttles prefill admission (05 C10). The v0.5.22 release-note claim of up to 27% more throughput and half the p95 TTFT, with its conditions attached in the same sentence: opt-in `prefill_complete` policy, Rubin GPUs, decode KV deliberately capped, ITL p99 93% worse (05 C12) `[project claim]`. The `prefill_complete` with DP attention caution (05 C11). Failure handling and the queue gauges (05 C17, C23). EPD as a short closing block (05 E1 to E3). Cross-link the vLLM dive's "10. Disaggregated Prefill / Decode" for the pull model contrast. Ends on the queue-gauge checklist. Diagram: the PD request sequence (gateway, prefill, bootstrap registry, decode, KV push).

**19. The Model Gateway: routing in front of SGLang**
Depth: mechanism plus practical
Payoff: Choose a routing policy, set its thresholds, and install the gateway build that matches your engine.

Opens with the model: the gateway remembers where it sent text; it never asks a worker what it cached (06 B3, B5, B7). The default `cache_aware` rule: balance first (more than 64 requests apart and more than 1.5x), then prefix affinity above 30% of the prompt, else least-loaded (06 B3, B4, B8). The strongest number, landed twice: 30% of the prompt. Policy menu (06 B12 to B17), the knobs whose docs disagree with code (06 B9 to B11, B14). Reliability features one row each (06 D1 to D10). KV events: the engine publishes one block per page over ZMQ, and only when `"publisher": "zmq"` is set; the shipping gateway does not read them, the experimental `sgl-router`, llm-d and Dynamo do (02 F1 to F9; 06 E1 to E8). What ships where, in an ExpandableSection: the in-tree gateway 0.3.2, SMG (Shepherd Model Gateway) as its moved-out successor, `pip install sglang-router` giving a January 2026 build, and the v0.5.22 image building the in-tree copy (06 A1 to A8, A14). Ends on the install choice. Diagram: the cache-aware decision (per-worker approximate tree, balance check, threshold, fallback).

**20. Multi-Node and Kubernetes: LWS, RBG, llm-d, Dynamo and Ray**
Depth: overview plus practical
Payoff: Pick an orchestrator by where its cache signal comes from, then check the SGLang version it installs.

Opens with the version table: llm-d v1.0.0 installs v0.5.22 (its AWS EFA overlay uses 0.5.20), Dynamo v1.6.0 pins 0.5.21, Ray 2.59.0 pins nothing, KServe v0.21.0 ships no SGLang runtime (06 F13). PD behind the gateway: `--prefill URL PORT` and the null-port rule, dual dispatch and prefill-failure cancel, per-role policies, DP-aware routing (06 C1 to C10). Multi-node launch with HTTP on node 0 only; LWS and RBG layouts; service discovery and the port-80 pitfall (06 F1 to F5, D6, C11). One short block per orchestrator (06 F6 to F12). Cross-link the vLLM dive's "16", "17", "18" and "15" for the vLLM side. Ends on a deployment checklist: explicit bootstrap ports, `--service-discovery-port`, health interval, Prometheus port. Diagram: the deployment topology (gateway, prefill pool, decode pool across nodes, bootstrap and KV-push edges, Kubernetes grouping).

### Layer E. Inside the code

**21. Inside the Codebase**
Depth: mechanism (tabbed)
Payoff: Find the file and line behind any behaviour in this dive, pinned to v0.5.22.

Eight tabs, each an ordered reading path with pinned line ranges from the registers' codebase-walk material:
1. *Architecture & Module Map*: repo layout and scale (00), the launch path `launch_server` to `Engine` to subprocesses (01 walk).
2. *Server Arguments & Resolution Hooks*: `arg_groups/fields/*.py` and the `*_hook.py` resolution order, why docs lag hooks (01 D, 04 mental model 5).
3. *Scheduler & Batching*: the 12-stop walk in register 01.
4. *Radix Cache & Memory Pools*: register 02 walk (radix tree, unified cache, pools, allocators, cache controller).
5. *Model Execution & Attention*: `ModelRunner`, `ForwardBatch`, the `RadixAttention` layer, the backend registry, CUDA graph runners (register 03 walk).
6. *Structured Output & Speculative Decoding*: register 04 walk.
7. *Parallelism, MoE & PD*: register 05 walk.
8. *The Rust Side: gateway and Rust frontend*: register 06 walk plus `rust/`.
Diagram: the module map on tab 1 (directories sized by role, with the request path drawn through them).

### Layer F. SGLang on AWS

**22. SGLang on AWS: choosing the deployment path**
Depth: practical
Payoff: Pick SageMaker, HyperPod, EKS or EC2 for an SGLang workload, know what each path supplies, and avoid the three SageMaker launch failures.

Opens with the decision tree: Bedrock gives no engine choice (09 G1); SageMaker AI gives a managed endpoint SGLang already speaks; HyperPod and EKS give Kubernetes control; EC2 gives everything. The model: SGLang already speaks SageMaker, and what varies is the entrypoint. Every SGLang server registers `GET /ping` and `POST /invocations`; the images differ in how they turn environment variables into flags (09 A1, A9, A10). AWS publishes SGLang Deep Learning Containers in two lines: an Ubuntu line built from `lmsysorg/sglang:v0.5.22` that adds the EFA installer and the SageMaker entrypoint and tracks upstream within about a day, and an Amazon Linux 2023 "server" line that carries DeepEP V2 over EFA but runs SGLang 0.5.19, amd64 only (09 A13, A14, C9, C10, D6). The SageMaker specifics as how to get it right: `/ping` is a static 200 that exists only after the model loads and is not exempt from the API key, so do not set `--api-key` on SageMaker (09 A3 to A5); SGLang's own `docker/serve` script turns `SM_SGLANG_X=true` into `--x true`, which the parser rejects, while the AWS image handles booleans (09 A10); `/metrics` needs `--enable-metrics` (`SM_SGLANG_ENABLE_METRICS=true` on the AWS DLC), which no SageMaker entrypoint adds (09 A17); use the documented `gpu-4-1` AMI (09 A12). HyperPod: the inference operator lists SGLang as a runtime and the Inference Gateway accepts `engineType: sglang`, while HyperPod's native disaggregated prefill/decode is vLLM only (09 A19 to A21, F1, F2). EKS: SGLang named in the real-time inference overview, `/dev/shm` sizing, probes on `/health`, the EFA device plugin and hugepages, LWS for multi-node (09 B1 to B11; 06 F2). Trainium and Inferentia: no support in the v0.5.22 tree, listed as in progress, upstream work after v0.5.22 uses an unpublished out-of-tree Neuron plugin; the practical path on Trainium today is the vLLM dive's "21. vLLM on AWS Neuron" (09 E1 to E5). AWS-authored SGLang content as dated Tier 2 items (09 F1 to F12). Ends on the reader's next action: pick the image line for the instance family. Diagram: the deployment-path decision tree.

**23. EC2 Instances and GPU-Dependent Behaviour**
Depth: practical
Payoff: Map an EC2 instance family to the SGLang defaults, backends and features it changes, before you move a deployment between families.

Opens with the model: the GPU generation sets SGLang's defaults, and the EC2 family name is a proxy for compute capability and memory (09 C3). The instance map: P4d/P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, P6e-GB300, G6e and others with GPU, memory, count and EFA bandwidth (09 C1, C2). The strongest fact, landed twice: moving a Llama-style model from P5 to P6 changes attention from `fa3` to `trtllm_mha` and KV pages from 1 token to 64, with no flag change (09 C4, C5; 03 A4, B13). Memory tiers and chunk and graph sizes (09 C6; 01 C20). FP8 and FP4 by family: SM80/SM86 run FP8 weight-only (09 C7; 03 D6). Images: upstream release images are CUDA 13 for amd64 and arm64, the AWS DLC is amd64 only, so Grace hosts (P6e) need the upstream image (09 C8, C9). No EC2 instance offers an AMD Instinct GPU on the spec page read (09 C11). Ends on a pre-migration checklist. Diagram: the instance map (family, GPU, compute capability, memory, default backend and page size).

**24. PD and Wide EP over EFA**
Depth: mechanism plus practical
Payoff: Bring up KV transfer and expert all-to-all over EFA as two separate stacks, with the check that proves each layer.

Opens with the model: on EFA, moving KV between prefill and decode and the MoE all-to-all are two problems with two libraries. KV moves through libfabric, either Mooncake's EFA wheel with `MOONCAKE_PROTOCOL=efa` or NIXL with `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC`; expert all-to-all moves through NCCL GIN and aws-ofi-nccl (DeepEP V2 from AWS's fork) or NVSHMEM's libfabric transport (09 D1 to D12; 05 D1 to D10). NIXL reaches EFA for KV and not for EP, so an image can be ready for PD over EFA and still unable to run wide EP over EFA (09 D12). Mooncake over EFA: the x86_64 EFA wheel, CUDA VMM allocators rejected, no Mooncake EP, upstream images not EFA-ready (05 D1 to D5, D11). DeepEP V2 over EFA needs AWS's DeepEP fork and NCCL 2.31.2 or later while the upstream image ships 2.30.7, the strongest number (09 D6 to D10). GPU-initiated EFA (EFA-GDA) works on P5en, P6-B200 and P6-B300 only, with `NCCL_GIN_TYPE=5`; P5 and P5e fall back to a CPU proxy (09 D7). UCCL-EP as a third route under the `deepep` backend (09 D14). NCCL falls back to TCP sockets silently when the OFI plugin is not found, so check the NCCL init log (09 D16). EFA installer versions that matter (09 D17). Placement groups, the EC2 topology API and Capacity Blocks for PD pairs, linked to the EFA and vLLM dives (09 D18). AWS benchmark claims in an ExpandableSection with conditions (09 D15, F3). Ends on two bring-up orders, one per stack, each with its check: `fi_info -p efa -t FI_EP_RDM`, `engine.SUPPORT_EFA`, then `MOONCAKE_PROTOCOL=efa` on both roles; NCCL version, `NCCL_NET_PLUGIN=ofi`, `NCCL_GIN_TYPE=5`. Diagram: the two EFA stacks side by side, KV transfer and expert all-to-all, with one check per layer.

### Layer G. Compare, operate, decide

**25. SGLang and vLLM: design choices compared**
Depth: mechanism plus practical
Payoff: Know which differences change behaviour on your workload, and how to read the benchmark claims each project publishes.
Content from register 10 (pending): the design table, convergence, attributed benchmark claims with conditions. Diagram: a side-by-side request path through each engine.

**26. Ecosystem and Production Users**
Depth: overview, with one practical table
Payoff: Who builds SGLang, what grows around it, which production users say so themselves, and which SGLang version your framework actually runs.

Opens with the model: SGLang is one package plus a family of separately released projects, hosted by LMSYS with RadixArk as a commercial maintainer (08 A1 to A7, B1 to B12). The adoption evidence as a ladder of strengths: first-party engineering statements first, led by LinkedIn's ranking stack (multi-item scoring cut 50-item ranking latency 69%, LinkedIn's own measurement) and Cloudflare moving its Clef decision models to SGLang in October 2026 while keeping its own Infire engine for other models (08 C3, C4); then vendor platform statements (08 D1 to D5); then the README and sglang.io logo walls, attributed as project claims (08 C1, C2). DeepSeek recommends SGLang for its open weights while stating its own serving engine is based on an early fork of vLLM (08 C5). Unconfirmed candidates stay out of the prose (08 UNKNOWN rows). Ends on the reader's action: every downstream pins its own SGLang (verl 0.5.8, AReaL 0.5.10.post1, NVIDIA's container 0.5.19, Dynamo 0.5.21), so check the version your framework or container installs before relying on a v0.5.22 behaviour (08 B15). Diagrams: the ecosystem map (runtime, sgl-project projects, third-party integrations, each with the SGLang version it pins); the evidence ladder.

**27. Operations: metrics, warm-up, admin security and failure signatures**
Depth: practical
Payoff: The first dashboards, the start-up costs, the keys to set, and the log lines that name a failure.
Collects the operating facts the earlier sections establish, each pointed back to its section: scheduler log fields and metrics (01 E), `token_usage` semantics (02 C14), kernel warm-up and caches (03 C), admin key (07 B12 to B14), gateway metrics and health (06 D), PD queue gauges (05 C23), structured-output failure cache (04 B5). Security posture as its own block, opening on the strongest number: nine CVEs published March to June 2026, five critical, all through Python deserialization or a file-upload path (08 E2). The defaults that protect (bind to `127.0.0.1` by default, custom logit processors off) and the ones that do not (no API key by default; `ADMIN_OPTIONAL` routes open without keys despite the release note's "Require admin auth") (08 E4 to E6; 07 B12). No security policy in the repo, so watch the GitHub Advisory Database (08 E1). Ends on: run v0.5.22 or later, keep `--host` private or behind the gateway, set `--api-key` and `--admin-api-key`. Diagram: none; a symptom-to-cause table.

**28. Decision Guide**
Depth: practical
Payoff: Decide whether SGLang fits a workload, and which features to turn on first.
From register 10 E plus the earlier sections: workload shapes, MoE scale, PD, AWS Neuron, orchestrator support, API needs. Diagram: a decision tree.

**29. Glossary & Sources**
Acronym glossary and the tier-grouped sources appendix (generated sources.md mirrors it).

---

## Diagram inventory (planned, inline SVG unless noted)

| Section | Diagram | Asserts |
| --- | --- | --- |
| 1 | Component map | Every component feeds, reads or approximates the prefix index |
| 2 | Reading map | Section dependencies and three routes |
| 3 | Three-process pipeline | ZMQ ring, rank-0 broadcast, process count |
| 4 | Overlap timeline | CPU plans N+1 under GPU batch N; EOS overshoot |
| 4 | Admission bet | Reserved output share decays, retraction resets |
| 5 | Radix tree with locks | Shared prefix resident while locked; unlocked leaf evicted |
| 5 | Hit as index copy | Slot indices copied, no KV bytes move |
| 6 | GPU memory bar | Weights, graphs, KV pool; page size per backend |
| 7 | HiCache tiers | Write-through, prefetch, demotion on eviction |
| 8 | Backend decision tree | Override module, then GPU arch by attention type |
| 10 | Constrained step | Grammar state to bitmask to logits to token |
| 11 | Draft-verify timeline | Draft steps, one verify pass, accepted prefix plus bonus |
| 12 | Endpoint map | Dialects into one path; admin plane and keys |
| 14 | Fork onto tree | Program fork tree becomes radix branches |
| 15 | Refit sequence | Pause, begin, buckets, end, continue; cache flush |
| 16 | Parallelism map | One TP group carved for attention and experts |
| 17 | DeepEP mode timeline | Lockstep EP group under mixed load vs PD |
| 18 | PD sequence | Rendezvous, reserve, push |
| 19 | Cache-aware decision | Balance check, then threshold, then fallback |
| 20 | Deployment topology | Gateway, pools, bootstrap and KV edges |
| 21 | Module map | Request path through the source tree |
| 22 | AWS path tree | SageMaker / HyperPod / EKS / EC2 |
| 23 | Instance map | Family to GPU to compute capability to default backend and page size |
| 24 | Two EFA stacks | KV transfer and expert all-to-all use different libraries; one check per layer |
| 25 | Side-by-side request path | Where the two engines split the same work |
| 26 | Ecosystem map | Runtime, sgl-project projects, third-party integrations |
| 28 | Decision tree | Workload to recommendation |

## Out of scope

- SGLang Diffusion (image and video generation) beyond one row in the ecosystem section: a separate engine with its own scheduler.
- Per-model cookbook recipes: the cookbook covers them and they age fastest.
- Re-explaining vLLM, EFA or GPU memory hierarchy: the sibling dives own them.
- Running our own benchmarks: no Tier 0 experiment is planned in this iteration; every performance figure is an attributed claim.
