# SGLang: Scope and Section Plan

**Title:** SGLang: The Radix-Tree Serving Runtime, and Where It Differs from vLLM
**Subtitle:** How SGLang v0.5.22 schedules, caches and scales LLM serving, which of its defaults a vLLM user already knows, and how to run it on AWS
**Status:** Scoping v2 (2026-10-24). Research registers 00 to 10 complete. Factual, newcomer and outcome-fit reviews applied (see Review notes).
**Pin:** SGLang `v0.5.22`, commit `baa9befa381511cd4d56f83980951e5a45fffc6d`, released 2026-10-19 (register 00). Accessed date 2026-10-24 on every citation.
**Sibling dive:** vLLM (pinned to v0.31.0). The reader knows it. Shared fundamentals (the inference workload, continuous batching, paged KV memory, the parallelism vocabulary) are defined there and linked, never repeated here.

**How to read the evidence markers.** IDs such as (01 C13) point to rows in `research/2026-10/NN-*.md`. Each row carries a tag-pinned code or docs URL, its tier and the fact to ship. `[project claim]` marks an SGLang/LMSYS performance figure; `[vendor claim]` an AWS or NVIDIA one; `[our reading]` a synthesis no single source states.

**How to read a section block.** Depth tag, the payoff the h2 description carries, the strongest number where the section has one, content in reading order, the "Against vLLM" line in mechanism sections, what earns the section its place, and the planned diagram.

---

## Thesis

For a reader who knows vLLM, the first fact is convergence. Both engines page the KV cache, cache prefixes by default, overlap CPU and GPU work by default, queue requests first-come-first-served (FCFS), recompute on preemption (outside SGLang's PD decode mode) and, on NVIDIA, run the same kernel projects, each through its own forks (10 A2, A5, B1 to B4; 01 F6). What differs sits at three edges, in this order `[our reading]` (10 mental models 1 to 3).

**(a) The index.** SGLang indexes the KV cache as a token tree with variable-length edges, against vLLM's chain of fixed-size block hashes, with a reuse unit that the GPU's backend sets, which, for a dense Llama-style model at defaults, reuses more finely on H100 and less finely on B200 (10 A6, A7, A10). The tree decides what a cache hit costs (slot indices copied into the request's row, no KV bytes moved), what eviction removes (whole leaves no running request holds, only when an allocation is short), what the gateway approximates (the prompt text it has already sent to each worker), and what the hierarchical cache tiers (tree nodes demoted to host memory, not deleted) (02 D1, C5, C6, E3; 06 B3). The attention backend is chosen by model family then GPU generation, and it sets the page size: token-exact on H100 and 64-token steps on B200 for the same Llama deployment without tree speculation, by the default chain in code (03 A3, A4, B13; 02 B6, B14). The cache-aware queue orders that read the tree are opt-in: the longest-prefix-match ordering the SGLang paper introduced falls back to FCFS above 128 queued requests (01 C4, C7; 02 A5, C10, C11), and the default FCFS queue only protects waiting requests' cached prefixes from eviction (02 C13), it does not reorder by them `[our reading]`.

**(b) Scheduler defaults.** Steps are prefill-first, and admission is a bet that protects long generations where vLLM protects early arrivals: a request is charged a forecast of its output, and retraction re-queues the requests with the fewest generated tokens (10 A3, A5; 01 F4 to F6; 01 C13 to C17).

**(c) What ships in the engine repository.** A first-party cache-aware gateway, where vLLM's routers live in separate projects, one of them a fork of the SGLang gateway (06 G1; 10 A15, B6). The PD control plane, which always pushes KV from prefill into pages decode reserved, where vLLM's reference NIXL connector pulls and a push connector is an option (05 C8, C14, F1; 10 A14). The admin plane for RL weight sync, which any client able to reach the port can call unless a key is set, with a default bind of 127.0.0.1 that container deployments replace with 0.0.0.0 (07 B12; 08 E6; 09 A9, B8; 10 A19).

The remaining default-level differences are grammar fallback and draft shape (10 A11, A12). The index model has a scope: the cache, admission, the gateway and HiCache are organised around the index; request features and kernels run beside it. Structured output is a CPU bitmask per token (04 mental model 1), and a PD decode server runs with the radix cache off by default (05 C16). No benchmark located during this research compares SGLang v0.5.22 with vLLM v0.31.0; the InferenceX dashboard, which runs recent images of both engines, could not be read (10 C15). Published comparisons are dated project or third-party claims with stated conditions, and the dive never computes a winner (10 C1 to C17).

---

## Section Plan

### Layer A. Framing and the reader's map (sections 1 and 2)

**1. Thesis & Framing**
Depth: overview
Payoff: Predict how SGLang will treat your traffic from one idea, the KV cache as a shared prefix index, and see which of its behaviours you already know from vLLM.

Opens with what the name covers: SGLang ships a frontend language and the SGLang Runtime (SRT), and production use today is mostly the runtime behind an OpenAI-style API (07 A18 to A21), so this dive is about the runtime; the language appears in an ExpandableSection at the end of section 5. Then the workload SGLang is built for, stated from its own README: agentic workloads, large-scale serving and RL (reinforcement learning) rollouts (`README.md:21` at the tag; 07 A19), and the observation that these share long prefixes across requests (system prompts, tool schemas, multi-turn history, sampled branches). Names the bet: index the KV cache by token sequence so a shared prefix is computed once and found by every later request. Then "what you already know still holds", in two sentences: both engines page the KV cache, cache prefixes by default, overlap CPU and GPU work, queue requests first-come-first-served (FCFS) and recompute on preemption, and on NVIDIA they run the same kernel projects through their own forks; section 23 has the full list (10 A2, A5, B1 to B4; 01 F6). Names the three edges `[our reading]`, each pointed to its section: the index and its GPU-set reuse unit (5, 6, 8); scheduler defaults (4); what ships in the engine repository, namely the gateway (17), the prefill-decode (PD) disaggregation control plane (15) and the admin plane (12). Places the components on one map in two zones: around the index (radix cache, admission, the gateway, HiCache) and beside it (request features such as structured output and speculative decoding, and kernels) (04 mental model 1; 05 C16). Ends on the pin: v0.5.22, released 2026-10-19, Python 3.11 required (00); releases come roughly every two weeks, 13 to 17 days apart over the last ten (08 A8).

Mental model: the cache, admission, the gateway and HiCache are organised around the index; request features and kernels run beside it.
Diagram: the component map in two zones, around the index and beside it.

**2. Getting Started**
Depth: overview (prose-first)
Payoff: Find your route through the dive in two minutes, and the settings a vLLM user gets wrong on day one.

*Who this is for.* A technical lead who has run vLLM, sized a GPU deployment, and wants to know whether SGLang behaves differently enough to matter. No SGLang experience assumed.

*Four prerequisite concepts, and where each is defined.*
(a) **Prefill, decode and the KV cache**: prompt processing is compute-bound, token generation is memory-bound, and the KV cache holds the attention state between them (vLLM dive, "2. The Inference Workload").
(b) **Continuous batching under a token budget**: the scheduler re-forms the batch every step (vLLM dive, "4. Scheduler & Continuous Batching").
(c) **Paged KV memory and hash-based prefix caching**: the cache is a pool of fixed-size slots addressed through a per-request table, vLLM finds a cached prefix through a chain of block hashes, and MLA (Multi-head Latent Attention) shrinks the KV each token costs (vLLM dive, "5. Paged KV Cache & Block Tables" and "6. Automatic Prefix Caching"; section 5 here for SGLang's pools).
(d) **Tensor, data and expert parallelism (TP, DP, EP), and data-parallel attention for mixture-of-experts (MoE) models**: which axis splits heads, requests and experts (vLLM dive, "9. Distributed Inference"; section 14 here for how SGLang counts them).
Section 22 (PD and wide EP over EFA, the Elastic Fabric Adapter) has its own prerequisite: the EFA dive's "libfabric and the EFA Provider" and "NCCL over EFA: the aws-ofi-nccl Plugin".

*The path: five mental models, in order, each with its reason.*
1. Every GPU process schedules for itself, one batch ahead (3, 4), because every later behaviour is a scheduler decision.
2. Admission is a bet on early stopping (4), because that bet decides when a request waits and which request is retracted.
3. The KV cache is a shared prefix index (5, 7), because the cache, admission, the gateway and HiCache are organised around it.
4. The backend picks the page size, so the GPU sets reuse granularity (6, 8; 9 checks the format), because the page size is the tree's reuse unit and the GPU picks the backend.
5. At cluster scale the gateway approximates the index and PD moves it (14 to 18), because scale-out reuses the index model across servers.
Between models 4 and 5 sit the request features, each a choice made per deployment: constrained output and speculation change the step (10, 11); APIs, adapters and RL change how clients reach the engine (12, 13). The AWS layer (19 to 22) maps the models onto SageMaker, HyperPod, EKS, EC2 and EFA; comparison, operations and decisions (23 to 26) close the dive. Inside the Codebase (27) is reference material, read last or on demand.

*How the sections feed each other.*
- Section 4's admission charges the part of the prompt that section 5's tree did not cover.
- Section 8's page size is section 5's reuse unit, and section 21 maps it to EC2 families.
- Section 12's admin plane is what section 13's trainer calls and section 25 secures.
- PD's push (15) lands in pages that section 6 sized.
- Wide EP's DeepEP modes (16) split cleanly only under PD's roles (15).

*What a vLLM user types differently.* A short table, each row linking its section; section 23's switching checklist is the long form.
- `--enable-metrics`: `/metrics` is off by default (01 E5); section 4.
- `--mem-fraction-static` against `--gpu-memory-utilization`: different quantities, so the value does not copy across (01 F9); section 6.
- `--schedule-policy`: FCFS is the default and `lpm` is opt-in (01 C4); sections 4 and 5.
- Prefill-first steps: `--enable-mixed-chunk` is the vLLM-like setting (10 A3); section 4.
- Retraction victims are the requests with the fewest generated tokens (10 A5); watch `sglang:num_retracted_requests_total` against `vllm:num_preemptions`; section 4.
- The attention backend sets the page size (03 B13); sections 6 and 8.
- `--tp 8 --attn-dp-size 8 --ep 8` is 8 GPUs (05 A4); section 14.
- LoRA (low-rank adaptation) adapters are addressed as `base:adapter`; a bare adapter name runs the base model (07 C16); section 12.
- `--admin-api-key` separates operators from clients (07 B12); section 12.

*First launch.* One launch line: `sglang serve --model-path <model> --enable-metrics --admin-api-key <key>` (`sglang serve` is the entrypoint the Rust frontend and the CLI parser are built around, and `launch_server` warns that it is the recommended one: 01 A15; 09 A9). The line keeps the default 127.0.0.1 bind, and the block says so: add `--host 0.0.0.0` only when the reader needs the network, which also exposes the admin routes to it (08 E6; section 12). Then the startup log fields to read: the page-size override warning (03 A16), `max_total_num_tokens` (01 C22; 02 D5) and the computed `--max-running-requests` (01 C21, logged at startup). Then one request sent twice, reading `meta_info.cached_tokens` on the second answer (07 B2 and Practical knobs). This makes edge (a) of the thesis observable on a running server.

*Four routes.*
- "I serve agentic or multi-turn traffic": 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 17, 23, 25, 26.
- "I run large MoE models at scale": 1, 2, 3, 4, 5, 6, 8, 11, 14, 15, 16, 17, 18, 23, 26; on AWS add 20, 21, 22.
- "I deploy on AWS this quarter": 1, 2, 3, 5, 6, 8, 12, 19, 20, 21, 23, 25, 26; for PD or wide EP add 14, 15, 16, 18, 22.
- "I am moving a vLLM deployment": 1, 2, 4, 6, 9, 10, 12, 23, 25.
Section 23 is on every route. The comparison stays at 23; sections 1 and 2 carry the converged-and-differs summary, and every mechanism section ends on an "Against vLLM" line, so a forward reader meets the differences early.

Diagram: the reading map as a dependency graph with the four routes highlighted.

### Layer B. The runtime and the index (sections 3 to 9)

**3. The SGLang Runtime: processes and sockets**
Depth: overview, then mechanism
Payoff: What `ps` shows for a given launch, why, and how many CPU cores and ports a deployment needs.
Strongest number: `--tp 8` runs 10 processes, by the code, not counted on a running server (01 A12).

Opens with what a `--tp 8` launch starts: one tokenizer process (the HTTP server), eight scheduler processes, one detokenizer, connected by ZeroMQ (ZMQ) sockets (01 A1 to A5). Rank 0 receives requests and broadcasts them so every rank builds the same batch (01 A4). `launch_server` against the in-process `Engine` (01 A7); process titles in `ps` (01 A6). Data-parallel replicas add a `DataParallelController` whose default `--load-balance-method auto` resolves to `round_robin` (01 A8 to A10). The opt-in Rust frontend: `SGLANG_RUST_SERVER=1` (default off) moves the HTTP server, tokenization and detokenization into a Rust extension inside the rank-0 scheduler process (01 A14, A15); its native API serves `/generate`, `/health` and `/health_generate`, and no `/ping` or `/invocations` route exists under `rust/`, which is why section 19 keeps it off on SageMaker (09 A7). The gRPC entrypoints as options (01 A16). Practical: process count is `1 + GPUs + 1`, plus a controller under DP, by the code (01 A12); tokenization and detokenization run in other processes, so their CPU work does not run inside the GPU loop; when they saturate, scale them with `--tokenizer-worker-num` and `--detokenizer-worker-num` (01 A1, A13). A server with `--tokenizer-worker-num` above 1 asserts at start when `--api-key` is set, so authenticate in a gateway in front of it (07 B14).

Against vLLM: SGLang never ships a per-step scheduling decision across a process boundary; vLLM schedules once per DP rank and sends the decision to its workers; both keep HTTP and tokenization off the GPU-driving process (10 A1; vLLM dive "3. The V1 Engine Architecture").

Mental model: three process types on a one-way ZMQ ring, and every GPU process schedules for itself.
Diagram: the three-process pipeline with ZMQ edges and the rank-0 broadcast.

**4. The Scheduler: one step ahead, betting on early stops**
Depth: mechanism plus practical
Payoff: Predict when a request waits, when it is retracted, and which log field tells you.
Strongest number, landed twice: a new request is charged up to 4096 output tokens, and running ones 70% of their remaining output at start (01 C13, C14).

Overlap scheduling, on by default: batch N+1 is launched before batch N's tokens are known, and a GPU-side placeholder stands in for the tokens not yet sampled (its class is named in codebase tab 2); a request that stops on EOS (end of sequence) decodes one extra step, and pipeline parallelism turns overlap off (01 B1, B4 to B12). Admission: a new request is charged its uncached prompt plus up to 4096 output tokens, running requests a share of their remaining output that starts at 0.7 and decays to about 0.1 over 600 steps (01 C13 to C15). Retraction, SGLang's name for preemption (both engines recompute, as in the vLLM dive's "4. Scheduler & Continuous Batching"): when KV runs out, under the default `--retraction-policy length`, the requests with the fewest generated tokens are re-queued and later recomputed (on a PD decode server their KV goes to host memory instead), and the share is reset to the observed completion rate, up to 1.0 (01 C15 to C17). Prefill first: a prefill step and a decode step do not share a forward unless `--enable-mixed-chunk` is set (01 C3, C18, C19). Policy: `fcfs` is the default; the cache-aware policies ride on the tree (section 5) (01 C4). Ends on the instruments. Set `--enable-metrics` first, because `/metrics` is off by default (01 E5); log lines and scheduler stats come from attention-TP rank 0 only, one stream per DP group (01 E3). Then the periodic log lines (`#running-req`, `#queue-req`, `token usage`, and `#cached-token` against `#new-token` on prefill), the retraction warning, `sglang:new_token_ratio`, and `--schedule-conservativeness` (01 E1 to E8).

Against vLLM: SGLang's default pauses decode for a prefill step where vLLM shares one token budget per step, so ITL (inter-token latency) spikes look different, and `--enable-mixed-chunk` is the closer match; SGLang retracts the requests with the fewest generated tokens and so protects long generations, where vLLM preempts the most recently added request and protects early arrivals; watch `sglang:num_retracted_requests_total` against `vllm:num_preemptions` (10 A3, A5; vLLM dive "4. Scheduler & Continuous Batching").

Mental models: the scheduler runs one batch ahead; admission is a bet on early stopping.
Diagrams: an overlap timeline (CPU plans N+1 under GPU batch N); the admission-bet chart (reserved share decaying, retraction resetting it).

**5. RadixAttention and the Radix Cache**
Depth: mechanism
Payoff: Predict what a request reuses, what stays resident, and what gets evicted, from the shape of the tree.
Strongest number: an observation, landed twice: a pool full of reusable prefixes reads as low `sglang:token_usage`, because the gauge counts evictable cache as free (02 C14).

Opens on the two-level pool. A request-to-token table (`req_to_token`, one row per request) maps each position to a KV slot index, and the token-to-KV pool maps that index to the K and V of every layer; at page size 1 one slot holds one token, and the page size is the tree's reuse unit, set by the attention backend (sections 6 and 8) (02 D1, D2, B6, B13). The tree is an index of token runs over that pool, and on a busy server the pool stays nearly full of reusable KV, because nothing evicts until an allocation is short (02 C5). A running request locks every node from its match to the root; only leaves with no lock are evictable, and eviction runs only when an allocation is short and removes whole leaves (02 B10, C2, C5, C6). Then the trade against the structure a vLLM reader knows, before the knobs: lookup is one tree walk against one hash per full block (02 G1); the eviction unit is a whole leaf, which can be thousands of tokens, against single blocks in release order (02 G4); a prefix two requests compute at once is kept once in the tree, where vLLM keeps both copies (02 G5); and SGLang also keeps a chained SHA-256 page-hash chain for L3 keys and KV events, so the tree serves local lookups and the hashes name pages across instances (02 G10; 10 A6). After the trade, the hit: a hit copies slot indices into the request's `req_to_token` row and no KV bytes move, so the copy is the same size whatever the model's layer count or hidden size (02 D1, D2, B4); in any paged-KV engine a hit is a table update `[our reading]` (10 B2; 02 G8). "RadixAttention" names the attention layer every model calls; the prefix cache is a separate object (02 A11). The queue orders that read the tree: `fcfs` is the default, and under FCFS with LRU the scheduler refreshes the cached prefixes of up to 128 queued requests so they are not evicted while they wait, without reordering by them (02 C13); `lpm` (longest prefix match) is opt-in, SGLang's tuning doc recommends it for workloads with many shared prefixes (02 C10), and it falls back to FCFS above 128 queued requests (01 C4 to C8; 02 C11). For shared-prefix traffic whose queue stays under 128, test `--schedule-policy lpm` and compare `#cached-token` with `#new-token` before and after; no measurement of its effect was located during this research (01 E1 to E8). The eviction policies (`--radix-eviction-policy`, LRU default) (02 C1 to C11). The paper-era history and its 2024 speedups against vLLM v0.2.5 sit in an ExpandableSection, labelled as a dated paper claim (02 A1 to A10). Ends on the knobs and the metric to read first: `sglang:token_usage` excludes evictable cache, so a pool full of reusable prefixes shows low usage (02 C14). Closes with an ExpandableSection, "Design intent: programs as cache hints", carrying the frontend language: `@sgl.function`, `gen`, `select`, `fork`, `join`, run as a client of `/generate` (07 A1 to A6); `fork` sends the shared prefix as a zero-token request so each branch becomes a leaf under that node (07 A7 to A10), and with a page size above 1 (64 on B200) only whole pages of the shared prefix are reused (07 A9; 02 B14); `select` first caches the prompt with a zero-token request, then scores every choice in one batched zero-token request, by mean logprob per token by default (07 A12, A13); its status, scoped to the evidence: maintained, no longer the main way people use SGLang (07 A18 to A21); and when it is still the right tool.

Against vLLM: both engines identify a prefix by everything before it; SGLang's tree evicts whole leaves and frees duplicate KV on insert, where vLLM's hash chain evicts block by block in release order and keeps duplicates; for a dense Llama-style model at defaults SGLang reuses to the token on H100, where vLLM reuses to the last full 16-token block, and more coarsely than vLLM on B200; and SGLang's eviction policy is one flag, where the vLLM dive documents LRU only (10 A6 to A8; 02 G4, G5; vLLM dive "6. Automatic Prefix Caching").

Mental model: the KV cache is a shared index of token runs; a hit is an index copy, and eviction removes whole leaves.
Diagrams: a radix tree with a shared system prompt and branching conversations, nodes annotated with lock counts and a leaf with no lock being evicted; a hit drawn as index copy into the request row; inside the design-intent ExpandableSection, a program's fork/join tree mapped onto the radix-tree branches it creates.

**6. KV Memory and the Defaults Your GPU Picks**
Depth: practical
Payoff: How many tokens fit on your GPU, and which startup defaults move when you change instance type.
Strongest number: `mem_fraction_static` resolves to about 0.83 on an 80 GB H100, against vLLM's 0.92 default for `--gpu-memory-utilization`, and the two are different quantities (01 F9; 01 D3, our arithmetic).

Opens with the resolution-hook model in two sentences: many flags declare a default of `None`, and a resolution hook computes the real value at startup from the GPU, the model and the other flags; this is why the documentation lags the code so often in this dive (01 D1; 04 mental model 5). The check is the startup log, which prints the result, for example `max_total_num_tokens` (01 C22). Then the sizing rule: the memory free once weights are loaded, minus the non-static share `(1 - mem_fraction_static)` of what was free before loading, divided by the bytes one token costs across all layers (02 D4, D5). `mem_fraction_static` is derived from chunk size, decode-graph size and TP, about 0.83 on an 80 GB H100 at TP 1 by our arithmetic on the code formula with an assumed 81,559 MiB total, not observed on hardware `[our reading]` (01 D2, D3). `--mem-fraction-static` covers weights and the KV pool; vLLM's `--gpu-memory-utilization` covers the whole GPU; do not copy the value across (01 F9). When SGLang cannot read the GPU's memory, the fraction falls back to 0.95 in code while the server-arguments page says 0.88, so set it explicitly on platforms where `nvidia-smi` or the vendor query is unavailable (01 D4). Optional worked example: one model on two families (for example P5 and P6-B200), shipped only if the author fetches the model's config (Tier 1), and labelled arithmetic on the code formula, not observed. Then the two caps that hold usable concurrency below the token count: a new request is charged up to 4096 output tokens (01 C13, C14; section 4), and speculation resets an unset `--max-running-requests` to 48 (04 C10; 01 C21; section 11). The GPU-tier table: `chunked_prefill_size` and decode CUDA-graph batch sizes by GPU memory (01 C20 to C22, D1 to D15); this section owns sizing, and the instance section (21) links back to it. KV cache dtype: `--kv-cache-dtype` is named here and covered in section 9. MLA pools for DeepSeek-class models (02 D5, D10). The page size: `--page-size` defaults to 1 and the attention backend overrides it (02 B6, B13, B14; 03 B13, B14), and a prompt shorter than one page is never cached (03 B14). The page-size block ends on the action: on P6, set `--page-size 16` if shared prefixes are short or not page-aligned, and keep shared prefixes at page multiples; `trtllm_mha` accepts 16, 32, 64 or 128 in the code at v0.5.22, and the throughput effect of smaller pages was not measured in this research (03 A16, B13, B14; 02 B6, B14; 09 C5). Ends on the knobs and one metric: `--mem-fraction-static`, `--kv-cache-dtype` (section 9), `--page-size`, and how to read `sglang:token_usage`.

Mental model: defaults are computed from your GPU by resolution hooks, and the startup log reports what they chose.
Diagram: a GPU memory bar split into weights, the non-static share (activations and graphs) and the KV pool, with the page-size note per backend.

**7. HiCache: one tree across GPU, host and storage**
Depth: mechanism plus practical
Payoff: Turn on host and storage tiers with the right flags, and know which hits come back from each tier and which are skipped.
Strongest number: a 128K-token L3 prefetch may wait about 33 s, where the documentation states a 30 s cap (02 E16).

Opens with the tiers, named once: L1 is GPU memory, L2 the instance's own host memory, L3 an optional storage backend; L1 and L2 are private to one instance, and L3 is shared only when the backend spans instances (02 E1). Then the model: with HiCache on, GPU eviction demotes a backed-up node (one whose KV is already written to host) to host-only; it stays in the tree and returns layer by layer on the next hit (02 E2, E3, E9). Write policies, prefetch policies and the storage backends (13 named plus `dynamic`), with the documented set marked (02 E1 to E13). Host hits under 10 tokens are not loaded back (02 E9). Two instances on one L3 backend find each other's pages, because L3 keys are chained SHA-256 page hashes plus a namespace (02 E13, G10). Two settings where the documentation and the code differ, each with what to set. The documentation gives the prefetch timeout as 2 s plus 0.1 s per 1K tokens, capped at 30 s; v0.5.22's code uses 1 s plus 0.25 s per 1K tokens with no cap, so a 128K-token hit may wait about 33 s; budget for the code's formula, and do not rely on a `prefetch_timeout_max` key, which the parser does not read (02 E16). The documentation says `--hicache-ratio` must exceed 1; v0.5.22's code starts with a smaller host pool and logs that L2 effectiveness is reduced, so size the host pool against free host memory, which is the real limit (02 E6). HiSparse, a decode-side mode for models with native sparse attention that keeps a small hot KV buffer on GPU and the rest in pinned host memory, with the radix cache off (02 E20), and the session radix cache, as short ExpandableSections (02 E21). Ends on the bring-up flags with their defaults.

Against vLLM: one tree match in SGLang returns a GPU part and a host part, where vLLM's KV connector answers for blocks the pool no longer holds; both are opt-in and reach the same storage projects (10 A9; vLLM dive "7. KV-Cache Offloading & Tiers").

Mental model: one tree spans the tiers, and eviction moves a node down a tier instead of deleting it.
Diagram: three tiers with the write-through and prefetch paths, and a node changing tier on eviction.

**8. Attention Backends and Kernels**
Depth: mechanism
Payoff: Predict which attention kernel your model gets on a given GPU, what page size that implies, and where the kernel comes from.
Strongest number: SGLang's own log warning estimates a cold DeepGEMM compile at 10 to 20 minutes, with no hardware or model stated `[project claim]` (03 C10).

Opens with the selection order: platform hooks, then 33 per-architecture override modules, then the generic GPU table; to predict a new model's backend, look for its override module first (03 A3 to A8). This section owns the backend and the page size it implies. The default table by GPU generation, each SM code expanded at first use in the form "SM90 (compute capability 9.0, Hopper)", and by attention type: MHA and GQA (multi-head and grouped-query attention), MLA, DeepSeek sparse attention, and hybrid models, which mix full-attention layers with linear-attention or state-space layers and take a second backend for the linear layers (03 A1 to A22; 03 A12; 02 B1). On B200 a Llama-style model gets `trtllm_mha` and 64-token pages unless it runs tree speculation, where the draft proposes several candidate tokens per step (`topk` above 1; section 11) (03 A4, A5, B13; 02 B14). Each backend name is a route to an upstream kernel project with its own pin: FlashInfer 0.7.1 (which carries the TensorRT-LLM kernels), the `sglang-kernel` 0.4.9 wheel (FA3, FlashAttention 3, and FlashMLA in the in-tree build; the PyPI wheel was not inspected), FA4 (FlashAttention 4) vendored in-tree, DeepGEMM from `sgl-deep-gemm` 0.2.2 (03 B1 to B9, C1, C2, C6). Kernel warm-up as a practical lever: on SM90 or newer, DeepGEMM compiles each new FP8 GEMM shape at first start (for example a DeepSeek-style block-FP8 checkpoint), a duration SGLang's own log warning estimates at 10 to 20 minutes with no hardware or model stated `[project claim]` (03 C6 to C10); `python -m sglang.compile_deep_gemm` plus persistent `SGLANG_CACHE_DIR` and `SGLANG_JIT_CACHE_DIR` volumes moves it to build time (03 C4, C8 to C12), and section 19 joins it to SageMaker's startup budget. CUDA graphs: decode graphs and the breakable prefill backend (01 D9 to D14; 03 E2 to E4). The docs-drift rows in an ExpandableSection (03 A10, A13, A16, A17, A18, A22). Hardware coverage in three lines: NVIDIA GPUs are the path on EC2; no EC2 instance offers an AMD Instinct GPU on the spec page read (09 C11); Trainium is listed as in progress, with one row pointing to section 19 for the full statement (03 F7), and TPUs are served only by SGLang-JAX, a separate engine in the same organisation with prerelease tags only (`v0.1.0rc0`) (03 F5). The full coverage table (NVIDIA, AMD's ROCm stack and its aiter kernel library, Intel XPU and CPU, Ascend, Apple Silicon) moves to an ExpandableSection (03 F1 to F7).

Mental model: the backend picks the page size, and model family decides before GPU generation does.
Diagram: the backend-selection decision tree (override module, then GPU arch by attention type, leaf = backend plus page size).

**9. Quantization and KV Precision**
Depth: practical
Payoff: Know which format your checkpoint will run as, on which GPU, before you launch.
Strongest number: the FP8 E4M3 maximum on NVIDIA is 448, not the 240 the documentation gives, which is the limit of the FNUZ variant AMD's MI300 uses (03 D12).

Opens with: the checkpoint decides the format; `--quantization` is for online quantization or a declared compatible override (03 D2 to D5). Formats and their GPU minimums where code enforces them; FP8 on Ampere runs weight-only through Marlin (03 D1 to D9). For online FP8, SGLang keeps the plain `--quantization fp8` name, while vLLM v0.31.0 uses explicit scheme names such as `fp8_per_tensor`, so a command line copied between the engines needs that flag checked (03 G7). `--quantization gptq` has no loader on NVIDIA or AMD GPUs at v0.5.22, so it fails at model setup (read from code, not run); leave the flag off or use `gptq_marlin` (03 D3). This section owns KV precision: `--kv-cache-dtype auto` becomes FP8 when the checkpoint declares an FP8 KV cache (02 D8; 03 D10), and the KV precision options and FP8 E4M3 (4 exponent bits, 3 mantissa bits), whose maximum is 448 on NVIDIA (03 D10 to D15). Cross-link the vLLM dive's "8. Quantization & Precision". Ends on a pre-launch check list.

Mental model: the checkpoint decides the format, and the GPU decides how it runs.
Diagram: none needed; a format-by-GPU table carries it.

### Layer C. Request features (sections 10 to 13)

**10. Structured Output: one bitmask per token**
Depth: mechanism plus practical
Payoff: Know what a schema costs, what fails with a 400, and the timeout that caches a failure.
Strongest number, landed twice: a schema still compiling after 10,000 scheduler polls (at least 50 s, longer when forward passes are slow, by arithmetic on the code) is cached as a failure until `/flush_cache` or a restart (04 B5).

Opens with the model: a grammar is a CPU state machine that writes a vocabulary bitmask before every sample; compilation is a one-off cost per distinct schema string; under overlap only the sampling kernel waits for the CPU (04 A7 to A11). Default backend `xgrammar` (the docs table shows `None`), no per-request backend choice, and schemas with keywords XGrammar would ignore get a 400 (04 A1, B2, B6). Jump-forward decoding, which appended a whole forced string in one step wherever the grammar allowed only one continuation, is not reached by any code path at v0.5.22, so every constrained token is sampled one step at a time under a mask (04 A12, A13). Reasoning models: launched with `--reasoning-parser`, the constraint applies after the think block; without it, the schema binds from the first output token, inferred from the parser wrapper being the only path that defers the grammar `[our reading]` (04 A14). Ends on the two metrics that move and the whitespace knobs (04 B8, B9). A closing ExpandableSection, "Where this lives in code", carries the structured-output half of register 04's code walk.

Against vLLM: both engines mask with XGrammar first; an unusual schema can pass on vLLM, whose `auto` backend falls back per request, and fail on SGLang until it runs with `--grammar-backend llguidance`; client request shapes for regex and grammar constraints differ (10 A11; vLLM dive "12. The OpenAI-Compatible Server", where vLLM covers structured outputs).

Mental model: a grammar is a CPU state machine that writes one vocabulary bitmask per token.
Diagram: one constrained step, grammar state to bitmask to masked logits to sampled token to new state.

**11. Speculative Decoding: draft, verify, keep the agreed prefix**
Depth: mechanism plus practical
Payoff: Pick an algorithm by where the draft comes from, and know what speculation costs in concurrency.
Strongest number: with `--max-running-requests` unset, turning on EAGLE-family, NGRAM, `DFLASH` or `DSPARK` speculation resets it to 48, from 2048 to 4096 otherwise (04 C10; 01 C21).

Opens with the model: draft cheaply, verify once, keep the agreed prefix plus one bonus token (04 C14). The algorithm menu as a table with a "draft comes from" column (04 C1 to C3): a separate draft checkpoint (`EAGLE`, `EAGLE3`, `STANDALONE`, `DFLASH`); heads or drafts shipped with the target (`NEXTN` for built-in MTP (multi-token prediction) heads, `DSPARK` checkpoints that bundle their draft, `UNO`'s LoRA adapter on the target); or no model at all (`NGRAM`, which drafts from n-grams already seen). `FROZEN_KV_MTP` is chosen automatically for Gemma 4 assistant drafts (04 C2). Prose names the families DFlash and DSpark; code font carries the flag values. Auto parameters: Llama and Grok get a tree (5/4/8), other models a chain (3/1/4) (04 C4, C5, C6). Verification is target-only by default; block verification, opt-in, keeps the longest drafted prefix that passes (04 C7, C8). Opt-in adaptive speculation (`--speculative-adaptive`, EAGLE or EAGLE3 chains only) drops to zero draft steps for batches of 64 or more with its built-in table (04 C9). Interactions in production (04 D1 to D11): on GPU, no resolution hook turns overlap off for NGRAM or `DFLASH`, read from code and not run (the documentation says both disable it) (04 D2; 01 B13); structured output masks every draft-tree node (04 D4); a hybrid model (section 8) running speculation with a grammar checkpoints its recurrent state only for the tokens the grammar kept, so run v0.5.22 or later for that combination (04 D6); PD and DP attention (04 D9, D10). SpecForge, the SGLang team's draft-training framework, and SpecBundle, its catalogue of ready-made drafts, as draft sources; acceptance and speedup figures only as project claims (04 E1 to E7). Ends on the reader's next action: measure `sglang:spec_accept_length` on your own traffic at your own concurrency. A closing ExpandableSection, "Where this lives in code", carries the speculative-decoding half of register 04's code walk.

Against vLLM: neither engine speculates unless asked; SGLang's EAGLE drafts a tree for a Llama target by default, where vLLM drafts K-token chains, so compare at matched settings with `--speculative-eagle-topk 1` on SGLang (10 A12; vLLM dive "11. Speculative Decoding").

Mental model: draft cheaply, verify once, keep the agreed prefix.
Diagram: a draft-then-verify step timeline (draft steps, one verify pass, accepted prefix, bonus token).

**12. Talking to SGLang: APIs, LoRA adapters and the admin plane**
Depth: practical
Payoff: Port a client without surprises in output length, sampling defaults, tool parsing or adapter addressing (`base:adapter`, not the bare name), and set the admin key your deployment needs.
Strongest number: 128 tokens, the `/generate` default output cap.

Opens with the model: one engine, many dialects, all ending in `TokenizerManager.generate_request` (07 B1, C17, C18, D2). The default output cap differs by endpoint: 128 tokens on `/generate`, 16 on `/v1/completions`, up to the context limit on chat; model sampling defaults reach only chat and Responses (07 B4, B5). Tool and reasoning parsers (07 C6 to C9). Chat responses as they behave now: `tool_choice: "none"` hides the tool list from DeepSeek models as on the other chat-template paths, a response with no tool calls omits `tool_calls` instead of sending `null`, and every chunk of one streamed completion carries the same `created` timestamp (07 C11 to C13). Responses state (07 C14), Anthropic and Ollama surfaces (07 C17 to C19). *Addressing adapters.* The slot model and the per-batch cap: up to 8 adapters per batch by default, one slot shared with base-model requests; a ninth adapter waits for a free slot, which shows as queueing, not as an error (07 E1, E4, E5). Backends, per-adapter cache namespaces, dynamic load and unload with drain, speculation limits (07 E1 to E9), with a table of flags and defaults. The porting pitfall attached to the right call: select an adapter with `model: "base:adapter"`; a bare adapter name runs the base model with no error (07 C16, G9). Admin and control endpoints (07 B8 to B18). Cross-link the vLLM dive's "12. The OpenAI-Compatible Server" and "13. LoRA & Multi-Adapter Serving". Ends on the admin key, which this section owns. Three states: with no key the admin routes accept any client that can reach the port (localhost by default, the network once `--host 0.0.0.0` is set, as container deployments do); with only `--api-key` the inference key also opens them; only `--admin-api-key` separates operators from clients (07 B12 to B14; 08 E6; 09 B8). The key matrix by deployment:
- SageMaker real-time: `--admin-api-key` only. `/ping` and the normal routes stay unkeyed while `--api-key` is unset, `[our reading]` of 07 B12 with 09 A5; IAM on `InvokeEndpoint` guards inference.
- EKS or EC2: both keys, with probes on `/health`, which is exempt from the key (09 A5, B5).
- Multi-tokenizer servers: authenticate in the gateway, because `--api-key` asserts at start with `--tokenizer-worker-num` above 1 (07 B14).

Mental model: one engine, many dialects, and an admin plane beside them whose exposure depends on the key state you choose.
Diagram: the endpoint map (dialects into one generate path, admin plane beside it, with which key guards which routes).

**13. SGLang as an RL Rollout Engine**
Depth: mechanism plus practical (serving side only)
Payoff: The launch flags and the call sequence an RL trainer needs to refit weights without serving stale KV.

Opens with two sentences on the role: an RL trainer samples completions through the SGLang server, then pushes new weights into it, a step called a refit. The serving side's job is to stop any later request from reusing KV computed with the old weights. The model: a refit is a bracket: pause, begin, buckets, end, continue; the radix cache is flushed by default (`flush_cache: true` on each update), so no request reuses KV computed with the old weights; with requests still queued the flush fails and the update reports failure after the weights changed, so pause first (07 B9, B11, D3, D4). Tensor and distributed updates fail outside `begin_weight_update` / `end_weight_update` and leave the weights untouched; an integration written before v0.5.21 must add the bracket (07 D4). NCCL (NVIDIA Collective Communications Library) and IPC (inter-process communication) refit paths, per-token weight versions (07 D5, D6, D9). Memory release frees nothing unless the server started with `--enable-memory-saver` (07 D7, D8). Deterministic inference and its cost as an attributed 2025 project claim (07 D10 to D12). Which RL frameworks use SGLang for rollout, and the SGLang version each pins, is in section 24 (08 B9 to B15; 07 D14). Ends on the launch flags: `--enable-memory-saver`, `--admin-api-key`, optionally `--enable-deterministic-inference`.

Mental model: a refit is a bracket, and the cache flush inside it keeps old-weight KV out of later requests.
Diagram: the refit sequence (trainer, SGLang server: TokenizerManager and scheduler) with the bracket calls (07 diagram 3).

### Layer D. Scale-out (sections 14 to 18)

**14. Parallelism: one TP group, carved for attention and experts**
Depth: mechanism
Payoff: Count the GPUs a launch uses, then map the flags onto what each axis splits.
Strongest number: `--tp 8 --attn-dp-size 8 --ep 8` is 8 GPUs, not 64 (05 mental model 1).

Opens with the counting rule, stated once: one replica spans `tp_size x pp_size` GPUs; `--dp-size N` runs N replicas under one controller (section 3); everything else carves the replica's TP group (05 A1, A3, A4). Inside each TP group, attention is split by attention DP (requests), context parallelism (CP) or decode context parallelism (DCP) (tokens of one request) and attention TP (heads), and MoE layers reuse the same GPUs split by EP and MoE TP (05 A1, A3, A4, B2, B3, F4). v0.5.22 deprecates `--enable-dp-attention` for `--attn-dp-size N` and rejects combining it with `--dp-size` above 1 (05 A3 to A5). Why DP attention suits MLA: the MLA KV size per token has no TP term, so plain TP stores a full copy per GPU (05 A9, A10). CP and DCP briefly (05 A13 to A16), with the terminology bridge: SGLang's prefill CP (`--attn-cp-size`) is the counterpart of vLLM's prefill context parallelism (PCP), and DCP exists in both engines (`--dcp-size` here, `-dcp` in vLLM) (05 F7); registers 05 and 10 do not show the two prefill-CP mechanisms to be the same, so the page says counterpart. Multi-node launch flags (05 A12). Cross-link the vLLM dive's "9. Distributed Inference": the same 8-GPU layout is `--tp 8 --attn-dp-size 8 --ep 8` on SGLang and `-dp 8 -tp 1 --enable-expert-parallel` on vLLM (10 A13). Ends on two rules. The translation rule: count GPUs, then map flags. The choice rule: DP attention does little for GQA models, whose KV heads TP already splits; DCP grows the longest context one request can hold, while DP attention grows how many requests fit (05 mental model 2, F7).

Mental model: one TP group, carved three ways for attention and again for experts.
Diagram: the parallelism map (one TP group, the attention carving and the MoE carving over the same GPUs, and which traffic crosses nodes).

**15. PD Disaggregation: rendezvous, reserve, push**
Depth: mechanism plus practical
Payoff: Bring up prefill and decode pools, know which side throttles which, and read the queues that show it.
Strongest number, with its conditions in the same sentence: the v0.5.22 release-note claim of up to 27% more throughput and half the p95 TTFT (time to first token) holds for the opt-in `prefill_complete` policy on Rubin GPUs with decode KV deliberately capped, and ITL p99 was 93% worse (05 C12) `[project claim]`.

Opens with the trade in two sentences: decode reserves pages and handshakes while prefill is still computing, so the KV transfer overlaps the prefill chunks (05 F3, C9). The price is that decode capacity gates prefill admission under the default `early` policy, which is also the pool-sizing rule (05 C10; 05 mental model 4). Then the mechanism: PD is a rendezvous on a room id, then a push; the router stamps one random `bootstrap_room` on two simultaneous requests, decode looks up prefill's ranks in the bootstrap registry, reserves pages and publishes their addresses, and prefill writes KV into them chunk by chunk (05 C4, C6, C8, C9, C14). With DP on a prefill server, the controller routes by room id (`bootstrap_room % dp_size`), so decode can find the rank that holds the KV (01 A10; 05 A11). Transfer backends: the docs list two, the code ships six (05 C2). What moves, including the per-model state of hybrid models (section 8) (05 C13). The decode-side knob: a decode server runs with the radix cache off unless `--disaggregation-decode-enable-radix-cache` is set (default False, experimental), so prefix reuse happens on the prefill side (05 C16). The destination reservation policy: under the default `early`, decode capacity throttles prefill admission (05 C8, C10). The `prefill_complete` with DP attention caution (05 C11). Failure handling and the queue gauges (05 C17, C23). The gateway's PD mode, which sends both legs, is configured in section 17. EPD (encoder-prefill-decode disaggregation) as a short closing block (05 E1 to E3). Ends on the gauge reading `[our reading]`: a growing prefill bootstrap queue while prefill GPUs sit idle points at decode capacity; a growing decode transfer queue points at the fabric (05 C23).

Against vLLM: SGLang always pushes KV into pages decode preallocated, with the handshake running while prefill computes; the reference `NixlConnector` pulls, vLLM's reference pull proxy runs prefill first, and `NixlPushConnector` pushes; the bootstrap-server idea and its port 8998 are shared (10 A14; vLLM dive "10. Disaggregated Prefill / Decode").

Mental model: PD is a rendezvous on a room id, then a push.
Diagram: the PD request sequence (gateway, prefill, bootstrap registry, decode, KV push).

**16. Wide Expert Parallelism: DeepEP, EPLB and overlap**
Depth: mechanism plus practical
Payoff: Run a large MoE model across nodes with the right all-to-all mode on each role.
Strongest number: EPLB (Expert Parallelism Load Balancer) rebalances every 1000 forward passes, not every 1000 requests as the documentation says (05 B14).

Opens with the model: the EP group moves in lockstep; under DP attention with `--deepep-mode auto`, one rank prefilling forces DeepEP normal mode and no decode CUDA graph on all ranks for that step (05 B6 to B8, B21). The terminology bridge: DeepEP's "normal" mode is the counterpart of vLLM's high-throughput mode, and two-batch overlap (TBO) is the counterpart of vLLM's dual-batch overlap (DBO); registers 05 and 10 do not show either pair to be the same mechanism, so the page says counterpart, and the glossary carries both rows. All-to-all backends and defaults; picking any of them forces `ep_size = tp_size` (05 B1 to B5). Mooncake EP and NIXL-EP: the documentation says Mooncake supports both DeepEP modes and recommends `--deepep-mode auto`; v0.5.22's code runs Mooncake EP and NIXL-EP in low-latency mode only, so `auto` fails at dispatcher construction; set `--deepep-mode low_latency` for them (05 B9). EPLB cadence: the documentation says every 1000 requests; the code counts forward passes, so at a few hundred decode steps per second it rebalances every few seconds; raise `--eplb-rebalance-num-iterations` or chunk the move with `--eplb-rebalance-layers-per-chunk` if rebalancing stalls show up (05 B14). Two-batch and single-batch overlap (05 B17 to B19), elastic EP (05 B16). The LMSYS (Large Model Systems Organization) 96-H100 deployment as a dated project claim in an ExpandableSection (05 B20). Ends on the recipe, which now follows PD (section 15) in reading order: DeepEP normal on prefill servers, low-latency on decode servers, which is why PD and wide EP are deployed together: each side stays in its own DeepEP mode (05 B7, B21) `[our reading]`.

Against vLLM: attention DP is a width inside SGLang's TP group and EP spans that group, while vLLM's DP attention is `--data-parallel-size` replicas plus `--enable-expert-parallel`, with EP = TP x DP; translate configs by GPU count, not flag name (10 A13; vLLM dive "9. Distributed Inference").

Mental model: the EP group moves in lockstep.
Diagram: a DeepEP-mode timeline across DP ranks under mixed load, and the same timeline split by PD.

**17. The Model Gateway: routing in front of SGLang**
Depth: mechanism plus practical
Payoff: Choose a routing policy, set its thresholds, and install the gateway build that matches your engine.
Strongest number, landed twice: 30% of the prompt, the prefix match above which `cache_aware` routes for affinity (06 B3).

Opens with the model: the gateway remembers where it sent text; it never asks a worker what it cached (06 B3, B5, B7). The default `cache_aware` rule: balance first (more than 64 requests apart and more than 1.5x), then prefix affinity above 30% of the prompt, else least-loaded (06 B3, B4, B8). In-server DP against the gateway: `--dp-size` balances round-robin inside one launch (01 A8 to A10; section 3), while the gateway balances separate servers with prefix affinity (06 B3); the trade is a cache-blind balancer inside one launch against a cache-aware one that runs as its own service `[our reading]` (sections 3 and 14). Policy menu (06 B12 to B17), the knobs whose docs disagree with code (06 B1, B9, B10, B15), and two code-only traps, read from source and not run: per-model policies ignore the CLI tuning flags, and `prefix_hash` returns 503 over HTTP (06 B11, B14). *PD mode.* `--prefill URL PORT` and the null-port rule, dual dispatch and prefill-failure cancel, per-role policies, DP-aware routing (06 C1 to C10); section 15 links here. Reliability features one row each (06 D1 to D10). KV events: the engine publishes one block per page over ZMQ, and only when `"publisher": "zmq"` is set; no KV-event consumer was found in the shipping gateway's source at v0.5.22 (06 E4), while the experimental `sgl-router`, llm-d and Dynamo read them (02 F1 to F9; 06 E1 to E8). What ships where, in an ExpandableSection: SMG (Shepherd Model Gateway), the same codebase moved to its own repo, where new gateway features land while SGLang keeps maintaining its in-tree 0.3.2 copy (06 A3 to A5); `pip install sglang-router` giving a January 2026 build; and the v0.5.22 image building the in-tree copy (06 A1 to A8, A14). Ends on the install choice.

Against vLLM: SGLang's default install routes cache-aware from remembered prompt text, where vLLM's common Kubernetes default routes round-robin until a cache-aware policy is chosen, and `vllm-project/router` is a fork of the SGLang gateway; in both ecosystems a router either remembers where it sent text or subscribes to the engine's KV events (10 A15; 06 G2; vLLM dive "16. Kubernetes: Production-Stack & Router" and "17. Kubernetes: llm-d, KServe & Gateway API").

Mental model: the gateway remembers where it sent text.
Diagram: the cache-aware decision (per-worker approximate tree, balance check, threshold, fallback).

**18. Multi-Node and Kubernetes Orchestrators**
Depth: overview plus practical
Payoff: Pick an orchestrator by where its cache signal comes from, then check the SGLang version it installs.
Strongest number: llm-d is the one orchestrator in the table that installs v0.5.22 (06 F13).

Opens with the cache-signal model: on Kubernetes SGLang runs as LeaderWorkerSet (LWS) groups or as a RoleBasedGroup (RBG), and each orchestrator gets its cache signal one of three ways: it reads the engine's KV events, relies on the SGLang gateway's approximate tree, or routes with no cache signal (06 F2, F4; 06 G2). One row per orchestrator (06 F6 to F12; 02 F1 to F9): the documented LWS PD recipe and RBG put the SGLang gateway in front, so the signal is its approximate tree (06 F3, F4); llm-d's endpoint picker reads SGLang's Prometheus gauges and, for precise prefix routing, its KV events, enabled with `--kv-events-config` alone (06 F6, F8); Dynamo replaces the SGLang gateway and routes from the same KV-event stream (06 F10); the registers record no cache signal for Ray Serve LLM's SGLang integration, and KServe's released version ships no SGLang runtime (06 F11, F12). Then the version table: llm-d v1.0.0 installs v0.5.22 (its AWS EFA overlay uses 0.5.20), Dynamo v1.6.0 pins 0.5.21, Ray 2.59.0 pins no SGLang version, KServe v0.21.0 ships no SGLang runtime (06 F11, F13); section 24 carries the RL frameworks and vendor containers and links here. Multi-node launch with HTTP on node 0 only; LWS and RBG layouts; service discovery and the port-80 pitfall (06 F1 to F5, D6, C11). One short block per orchestrator (06 F6 to F12). Cross-link the vLLM dive's "15. Orchestration: Ray & Ray Serve LLM", "16. Kubernetes: Production-Stack & Router", "17. Kubernetes: llm-d, KServe & Gateway API" and "18. NVIDIA Dynamo & the Ecosystem". Ends on a deployment checklist: explicit bootstrap ports, `--service-discovery-port`, health interval, Prometheus port.

Mental model: an orchestrator is chosen by where its cache signal comes from.
Diagram: the deployment topology (gateway, prefill pool, decode pool across nodes, bootstrap and KV-push edges, Kubernetes grouping).

### Layer E. SGLang on AWS (sections 19 to 22)

**19. SGLang on SageMaker AI and HyperPod**
Depth: practical
Payoff: Pick SageMaker, HyperPod, EKS or EC2 for an SGLang workload, and get a SageMaker endpoint through its first health check with metrics on.
Strongest number: SageMaker fails an instance launch that does not pass `/ping` within 8 minutes of startup (09 A4).

Opens with the four-path decision tree, which is this section's diagram: Bedrock gives no engine choice (09 G1); SageMaker AI gives a managed endpoint; HyperPod and EKS give Kubernetes control; EC2 gives everything. Section 20 covers EKS and EC2. *SageMaker AI.* The model: SGLang already speaks SageMaker, and what varies is the entrypoint. Every SGLang server on the default Python HTTP frontend registers `GET /ping` and `POST /invocations`; keep `SGLANG_RUST_SERVER` unset on SageMaker, because the Rust frontend (section 3) has neither (09 A1, A7). `/invocations` takes OpenAI chat bodies only: no native `/generate` body, no `/v1/completions` prompt, no embeddings (09 A2). SGLang on SageMaker means the SGLang DLC (Deep Learning Container) or your own container; the LMI (Large Model Inference) containers ship vLLM and TensorRT-LLM, on the pages read (09 A18). The images: AWS publishes SGLang DLCs in two lines, an Ubuntu line built from `lmsysorg/sglang:v0.5.22` and an Amazon Linux 2023 "server" line on SGLang 0.5.19, and the images differ in how they turn environment variables into flags (09 A9, A10, A13); section 21 picks between the lines. `/ping` is a static 200 that exists only after the model loads, and it is not on the API-key bypass list (`/health`, `/ready`, `/metrics` only), so a server with `--api-key` set is expected to fail SageMaker's health check; section 12's key matrix gives the keys to set (09 A3 to A5, read from code, not run). SGLang's own `docker/serve` script turns `SM_SGLANG_X=true` into `--x true`, which argparse is expected to reject (09 A10, read from code, not run), while the AWS image handles booleans. `/metrics` needs `--enable-metrics` (`SM_SGLANG_ENABLE_METRICS=true` on the AWS DLC), which no SageMaker entrypoint adds (09 A17); use the documented `gpu-4-1` AMI (09 A12). Budget the start: SageMaker fails an instance launch that does not pass `/ping` within 8 minutes, and SGLang answers `/ping` only after weights load and CUDA graphs are captured, so set `ContainerStartupHealthCheckTimeoutInSeconds` for download plus load plus graph capture (09 A4). For block-FP8 models on SM90 or newer, run `python -m sglang.compile_deep_gemm` with the serving flags while building the image, since an uncompiled DeepGEMM start can exceed the default window (`[our reading]` for the combination; 09 A4; 03 C9, C10; section 8). *HyperPod.* The inference operator lists SGLang as a runtime and the Inference Gateway accepts `engineType: sglang` (09 A19, A20, F1, F2), while HyperPod's native disaggregated prefill/decode is documented with vLLM worker images only (09 A21); AWS documents no SGLang recipe for it. *Trainium and Inferentia*, stated once, here: no support in the v0.5.22 tree, listed as in progress; upstream work after v0.5.22 targets an out-of-tree Neuron platform plugin, and no public repository for it was found during this research (09 E2, E3; 03 F7); the practical path on Trainium today is the vLLM dive's "21. vLLM on AWS Neuron" (09 E1 to E5). AWS-authored SGLang content as dated Tier 2 items (09 F1 to F12). Cross-link the vLLM dive's "25. vLLM on SageMaker & vs Bedrock". Ends on the reader's next action: pick the path; section 21 picks the instance and image.

Mental model: SGLang already speaks SageMaker; what varies is the entrypoint, the keys and the start budget.
Diagram: the AWS path tree (Bedrock, SageMaker AI, HyperPod and EKS, EC2), the spine of the section.

**20. SGLang on EKS and EC2**
Depth: practical
Payoff: Run SGLang on EKS or EC2 with the probes, devices and image each path needs, and know what you supply yourself.

*EKS.* SGLang is named in the real-time inference overview; `/dev/shm` sizing; probes on `/health`, a real engine check by default and exempt from the API key (09 A5, B5); the EFA device plugin and hugepages (the EKS EFA page requires 2 MiB hugepages; AWS's SGLang PD sample requests none, not tested which is needed); LeaderWorkerSet (LWS), the Kubernetes API that starts a leader pod and its workers as one unit, for multi-node, with device-plugin EFA in place of host networking (untested here) (09 B1 to B11; 06 F2; section 18). *EC2.* What the reader supplies: the image (the upstream image or the AWS DLC's `-ec2` tag; section 21), an NVIDIA driver from the 580 branch or later for the CUDA 13 images, and the EFA installer for PD or wide EP (09 A13, C8, D17; section 22); process supervision and health checking are the reader's own `[our reading]`. Cross-link the vLLM dive's "24. vLLM on Amazon EKS". Ends on the next action for each path: on EKS, set the probes and the EFA device requests, then pick the instance in section 21; on EC2, pick the image and instance in section 21 and, for PD or wide EP, bring up EFA in section 22.

Mental model: EKS supplies scheduling and health probes, EC2 supplies the machine; the image and the EFA stack are the reader's choice on both.
Diagram: none; the path tree in section 19 carries the choice.

**21. EC2 Instances, Images and GPU-Dependent Behaviour**
Depth: practical
Payoff: Map an EC2 instance family to the SGLang defaults, backends, features and image it changes, before you move a deployment between families.
Strongest fact, landed twice: moving a Llama-style model from P5 to P6 changes attention from `fa3` to `trtllm_mha` and KV pages from 1 token to 64, with no flag change, when speculative decoding is off or uses a chain (topk 1, where tree speculation would have the draft propose several candidate tokens per step; section 11), by the default chain in code (09 C4, C5; 03 A4, A5, B13; 02 B14).

Opens with the model: the GPU generation sets SGLang's defaults, and the EC2 family name is a proxy for compute capability and memory (09 C3); sections 6 and 8 own the sizing and backend rules, and this section translates them to families. The instance map: P4d/P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, G7e, G7, G6e and others with GPU, memory, count and EFA bandwidth (09 C1); P6e-GB300 with compute capability only (SM103, 09 C3), its specs not in the EC2 spec tables as of 2026-10-24 (09 C2); G5 as A10G at SM86 by equivalence with the A10, since NVIDIA lists no A10G `[our reading]` (09 C3). G7e and G7 carry SM120 GPUs (RTX PRO 6000 and RTX PRO 4500 Blackwell Server) and get none of SGLang's Blackwell defaults, which mean SM100 and SM103 only; they fall to `flashinfer` (09 C1, C3, C4). FP8 and FP4 by family: SM80 and SM86 (G5's SM86 by equivalence) run FP8 weight-only (09 C7; 03 D6). Images: upstream release images are CUDA 13 for amd64 and arm64 (09 C8). AWS publishes SGLang DLCs in two lines: an Ubuntu line built from `lmsysorg/sglang:v0.5.22` that adds the EFA installer and the SageMaker entrypoint and tracks upstream within about a day, and an Amazon Linux 2023 "server" line that carries DeepEP V2 over EFA but runs SGLang 0.5.19 and builds its FlashMLA and DeepEP kernels for SM90, SM100 and SM103 only. Both lines are amd64 only, so Grace hosts (P6e) need the upstream multi-arch image (09 A13, A14, C9, C10, D6). No EC2 instance offers an AMD Instinct GPU on the spec page read (09 C11). A "choose" table, workload to the families that keep the needed feature, with the constraint each row trips (09 C4, C7, C9, C10, D4, D7):
- Single-node dense: the P5 family keeps `fa3` and token-exact pages; P4d, P4de and G5 run FP8 weight-only; G7e and G7 fall to `flashinfer`.
- Shared-prefix agentic: the P5 family reuses to the token by default; on P6 the 64-token pages need the page-size action below.
- PD: any family with EFA; P6e needs the upstream image, which ships without the EFA installer or the Mooncake EFA wheel.
- Wide-EP MoE: P5en, P6-B200 and P6-B300 support GPU-initiated EFA traffic (section 22), while P5 and P5e use the CPU proxy; the AL2023 DLC's kernels target SM90, SM100 and SM103 only.
Cross-link the vLLM dive's "22. vLLM on AWS GPUs, EFA & NIXL". Ends on the page-size action, then the pre-migration checklist: on P6, set `--page-size 16` if shared prefixes are short or not page-aligned, and keep shared prefixes at page multiples; accepted by the code at v0.5.22, throughput effect not measured (03 A16, B14; 09 C5).

Mental model: the EC2 family name is a proxy for compute capability, and compute capability sets the defaults.
Diagram: the instance map (family, GPU, compute capability with G5's SM86 marked `[our reading]`, memory, default backend and page size), with G7e and G7 rows.

**22. PD and Wide EP over EFA**
Depth: mechanism plus practical
Payoff: Bring up KV transfer and expert all-to-all over EFA as two separate stacks, with the check that proves each layer.
Strongest number: DeepEP V2 over EFA needs NCCL 2.31.2 or later, while the upstream image and the AWS Ubuntu DLC built on it ship 2.30.7 (09 D10).

Opens with the two-stack sentence and its prerequisites: on EFA, moving KV between prefill and decode and the MoE all-to-all are two problems with two libraries, and the EFA dive's "libfabric and the EFA Provider" and "NCCL over EFA: the aws-ofi-nccl Plugin" define the layers underneath. KV moves through libfabric, either Mooncake's EFA wheel with `MOONCAKE_PROTOCOL=efa` or NIXL with `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC`; expert all-to-all moves through NCCL GIN (GPU-Initiated Networking) and aws-ofi-nccl (DeepEP V2 from AWS's fork) or the libfabric transport of NVSHMEM (NVIDIA's OpenSHMEM library) (09 D1 to D12; 05 D1 to D10). NIXL reaches EFA for KV transfer, not for MoE all-to-all (09 D12, read from code). So one image can be ready for PD over EFA and not for wide EP: the AWS Ubuntu DLC has the EFA installer NIXL needs but an NCCL below the DeepEP V2 floor (09 D4, D10) `[our reading]`. Mooncake over EFA: the x86_64 EFA wheel, CUDA VMM (virtual memory management) allocators rejected, no Mooncake EP, upstream images not EFA-ready (05 D1 to D5, D11). On P5en and P6 (EFA-GDA), DeepEP V2 needs AWS's fork; on P5 and P5e, which use the CPU proxy, the stock wheel was not tested (09 D7, D8). DeepEP V2 over EFA needs NCCL 2.31.2 or later, while the upstream image and the AWS Ubuntu DLC built on it ship 2.30.7; upgrade `nvidia-nccl-cu13` or use the AL2023 DLC (on SGLang 0.5.19) (09 D6 to D10). EFA-GDA, the GPU-initiated GIN backend on EFA (NCCL GIN type 5), needs P5en, P6-B200 or P6-B300 with EFA installer 1.50.0+, NCCL 2.31.2+, aws-ofi-nccl 1.21.0+ and the driver's `PeerMappingOverride`, plus `NCCL_GIN_TYPE=5` and `NCCL_SYM_GIN_KERNELS_ENABLE=0`, which SGLang does not set; P5 and P5e use the CPU proxy (09 D7). UCCL-EP, a DeepEP-compatible expert-parallel library run through UCCL's `deep_ep_wrapper`, as a third route under the `deepep` backend, from an AWS sample (Tier 2): set `--deepep-mode` explicitly, since the sample reports that `auto` segfaults UCCL's prefill path (09 D14); the author takes the UCCL expansion from that sample at drafting time, since register 09 does not carry it. When the EFA installer ships only `libnccl-net-ofi.so`, NCCL can miss the plugin and fall back to sockets without an error; set `NCCL_NET_PLUGIN=ofi` and check the `NCCL_DEBUG=INFO` log (09 D16, AWS sample). EFA installer versions that matter (09 D17). Placement groups, the EC2 topology API and Capacity Blocks for PD pairs, linked to the EFA dive and the vLLM dive's "23. EC2 Topology & Placement Groups" (09 D18). AWS benchmark claims in an ExpandableSection with conditions (09 D15, F3). Cross-link the vLLM dive's "22. vLLM on AWS GPUs, EFA & NIXL". Ends on two bring-up orders, one per stack, each with its check: `fi_info -p efa -t FI_EP_RDM` (`FI_EP_RDM` is libfabric's reliable-datagram endpoint type), `engine.SUPPORT_EFA`, then `MOONCAKE_PROTOCOL=efa` on both roles (05 D1, D2, D3; 05 section recommendation 4); NCCL version, aws-ofi-nccl version, `NCCL_NET_PLUGIN=ofi`, `NCCL_GIN_TYPE=5` and `NCCL_SYM_GIN_KERNELS_ENABLE=0` (09 D7, D10, D16).

Mental model: on EFA, KV transfer and expert all-to-all are two stacks with two libraries.
Diagram: the two EFA stacks side by side, KV transfer and expert all-to-all, with one check per layer.

### Layer F. Compare, operate, decide (sections 23 to 26)

**23. SGLang and vLLM: what differs, what converged, and how to read the benchmarks**
Depth: practical
Payoff: Know which differences change behaviour on your workload, which ones are gone, and why no published benchmark answers the question for your versions.
Strongest fact, landed twice: the convergence list (10 A2, A5, B1 to B4; 01 F6).

Opens with the fact a vLLM reader does not expect: both engines page the KV cache, cache prefixes by default, overlap CPU and GPU work by default, queue requests first-come-first-served, recompute on preemption (outside SGLang's PD decode mode) and, on NVIDIA, run the same kernel projects, each through its own forks (10 A2, A5, B1 to B4; 01 F6), so "SGLang LPM against vLLM FCFS" compares a non-default SGLang mode (10 A2). The design table, trimmed to the rows that change a decision, each row naming the vLLM dive section that covers the vLLM side: step composition and admission (10 A3, A5); reuse granularity by GPU, where, for a dense Llama-style model at defaults and without tree speculation, SGLang reuses to the exact token on H100 (FA3) and in 64-token pages on B200 (`trtllm_mha`), while vLLM uses 16-token blocks on both; FlashMLA models use 64-token pages on SGLang (10 A7, A10; 02 B14), with section 21's P5-to-P6 fact cited in one line; structured output (10 A11); speculative defaults (10 A12); DP attention and EP (10 A13); PD direction and control plane (10 A14); router (10 A15); API surfaces (10 A16); metrics: SGLang serves `/metrics` only with `--enable-metrics`, vLLM always (10 A17); LoRA addressing (10 A18); RL routes (10 A19); AWS Neuron, linking section 19 for the full statement (10 A20). Convergence as an ExpandableSection (10 B5 to B17), including the shared lineage of the Rust routers and the shared bootstrap-server idea (10 B6, B7). Benchmarks as an ExpandableSection with tier badges, each with its date, versions, hardware and stated conditions: the 2024 SGLang paper (Tier 3, the authors' own numbers) and LMSYS posts from 2024 to 2026 (Tier 2), the 2024 vLLM post (Tier 2), SemiAnalysis InferenceMAX (2025, one engine picked per model) and InferenceX v2 and v3 (2026, hardware comparisons; the repository pairs both engines in agentic scenarios, results not readable) (Tier 3), and two preprints, InferenceBench and Bench360 (Tier 3), the first the best-matched method found, concluding that the better engine depends on the scenario (10 C1 to C17). The hedge preserved: no benchmark located during this research compares v0.5.22 with v0.31.0; the InferenceX dashboard, which runs recent images of both engines, could not be read (10 C15). Ends on the switching checklist: add `--enable-metrics`; do not copy `--gpu-memory-utilization` into `--mem-fraction-static` (different quantities; section 6); send LoRA requests as `model="<base>:<adapter>"`; drop `--enable-auto-tool-choice` and map tool-call parser names (07 G5); move regex and EBNF (Extended Backus-Naur Form) constraints to SGLang's fields; match the speculative shape; set `--admin-api-key` unless the port is reachable only from the trainer's network (10 A19, E9); then benchmark both on your own traffic at matched settings (10 E9).

Mental model: same engine class, different defaults at the edges, and more of the fleet in one repository `[our reading]` (10 mental models 1 to 3).
Diagram: a side-by-side request path through each engine, marking where they split the same work and which pieces ship in the engine repository.

**24. Ecosystem and Production Users**
Depth: overview, with one practical table
Payoff: Weigh an SGLang adoption claim by who made it, and check which SGLang version your framework or container really runs before relying on a v0.5.22 behaviour.
Strongest number: LinkedIn's 69% latency cut for ranking 50 items with multi-item scoring against single-item scoring with prefix caching, LinkedIn's own measurement (08 C3, as corrected in register 08's authoring errata).

Opens with the model: one package plus separately released projects, hosted by LMSYS with RadixArk as a commercial maintainer (08 A1 to A7, B1 to B12). The adoption evidence as a ladder of strengths: first-party engineering statements first, led by LinkedIn's ranking stack, a prefill-only scoring workload (multi-item scoring cut latency for ranking 50 items by 69% against single-item scoring with prefix caching, LinkedIn's own measurement) (08 C3), and Cloudflare moving its Clef decision models to SGLang in October 2026 while keeping its own Infire engine for other models (08 C4); then vendors offering SGLang as a product option (08 C8, C9, C11, D2 to D8; register 09); then the README and sglang.io logo walls, attributed as project claims (08 C1, C2). DeepSeek recommends SGLang for its open weights while stating its own serving engine is based on an early fork of vLLM (08 C13). Unconfirmed candidates stay out of the prose (08 UNKNOWN rows). Ends on the reader's action, with the section's one table, RL frameworks and vendor containers only: each freezes its own SGLang (verl 0.5.8, AReaL 0.5.10.post1, NVIDIA's October 2026 container 0.5.19), and only Miles tracks v0.5.22 (08 B10, B11, B13, B15, D2); section 18 carries the orchestrators. Check the version your framework or container installs before relying on a v0.5.22 behaviour.

Mental model: an adoption claim is worth what its source can know.
Diagrams: the ecosystem map (runtime, sgl-project projects, third-party integrations, each with the SGLang version it pins, if any); the evidence ladder.

**25. Operations: metrics, warm-up, keys and failure signatures**
Depth: practical
Payoff: Know what to watch in week one, how to move a slow first start to build time, which keys to set where, and which log line names which failure.
Strongest fact, landed twice: with no key set, the admin routes accept any client that can reach the port (07 B12; 08 E6).

The body is a symptom-to-cause table with four columns (symptom, cause, flag or fix, back-link), drawn from the earlier sections: no `/metrics` endpoint (`--enable-metrics` off by default; 01 E5; section 4); retraction warnings and a rising `sglang:new_token_ratio` (the admission bet; 01 C15 to C17, E1 to E8; section 4); low `sglang:token_usage` on a full pool (evictable cache counts as free; 02 C14; section 5); a slow first start or a failed SageMaker launch (the DeepGEMM compile and the `/ping` window; 03 C10; 09 A4; sections 8 and 19); a schema that keeps failing after one slow compile (the failure cache; 04 B5; section 10); an adapter request that answers like the base model (a bare adapter name; 07 C16; section 12); a growing PD bootstrap or transfer queue (05 C23; section 15); gateway health and metrics (06 D; section 17); NCCL falling back to sockets over EFA (09 D16; section 22). The security block opens on the open admin plane: the unkeyed admin routes are local-only until `--host 0.0.0.0`, which container deployments set, and the `ADMIN_OPTIONAL` routes stay open without keys despite the release note's "Require admin auth" (08 E4 to E6; 07 B12; 09 A9, B8). The defaults that protect: bind to `127.0.0.1`, custom logit processors off. The CVE (Common Vulnerabilities and Exposures) count comes second, framed by its action: nine CVEs published March to June 2026, five of them critical; every critical one is code execution or file write through Python deserialization or an upload filename, in the diffusion runtime (three), behind the opt-in `--enable-custom-logit-processor` flag (one) or in EPD (encoder-prefill-decode disaggregation; one); six of the nine advisories list no patched version (08 E2). So keep diffusion, EPD and `--enable-custom-logit-processor` off exposed hosts, and run v0.5.22 or later. No security policy in the repo, so watch the GitHub Advisory Database (08 E1). The keys themselves are in section 12's key matrix. Cross-link the vLLM dive's "20. Observability & Benchmarking" and "27. Operations & Failure Modes". Ends on: run v0.5.22 or later, keep `--host` private or behind the gateway, because with no key the admin routes answer anyone who reaches the port, and set the keys section 12's matrix gives for your deployment.

Mental model: most failures have one log line or gauge that names them, and the admin plane is open until a key or the network closes it.
Diagram: none; the symptom-to-cause table carries it.

**26. Decision Guide**
Depth: practical
Payoff: Decide whether SGLang fits a workload, which deployment path to take, and which features to turn on first.

A decision tree driven by register 10's criteria, each leaf pointing to the section that carries the evidence: shared-prefix traffic (system prompts, few-shot templates, multi-turn chat, agent loops) and whether the GPU's page size helps or hurts it (10 E1; sections 5, 6, 21); structured output (10 E2; section 10); wide-EP MoE (10 E3; sections 14, 16, 22); PD at scale (10 E4; sections 15, 22); AWS Trainium or Inferentia, where the answer today is the vLLM dive's Neuron path (10 E5; section 19); an orchestrator already chosen and the SGLang version it installs (10 E6; section 18); API needs (10 E7; sections 12, 13); the hardware fleet (10 E8; section 8). Framed as guidance with hedges preserved, never as a verdict. *What it costs* `[our reading]`: five SGLang-specific cost levers, each pointed to its section:
- Speculation resets `--max-running-requests` to 48 (04 C10; section 11).
- PD bills two pools, and decode capacity gates prefill (05 C10; section 15).
- P6's 64-token pages can drop reuse on short prefixes, raising prefill compute (03 B14; sections 6 and 21).
- A cold kernel compile is paid on every scale-out unless prebuilt (03 C10; sections 8 and 19).
- HiCache spends host memory to avoid recompute (02 E2, E3; section 7).
Prices, Spot and reservations are engine-neutral and live in the vLLM dive's "24. vLLM on Amazon EKS" and "25. vLLM on SageMaker & vs Bedrock"; this dive ships no price figures. Then the pointer for a team that already runs vLLM: section 23's switching checklist. Ends on the first-week feature order: `[our reading]`, an order built from the rows below: `--enable-metrics` (09 A17) and `--admin-api-key` (07 B12) first; the gateway, `cache_aware` by default, in front of more than one worker (10 A15); for shared-prefix traffic whose queue stays under 128, a test of `--schedule-policy lpm`, comparing `#cached-token` with `#new-token` before and after (01 C4 to C8, E1 to E8; 02 C10, C11); HiCache when reusable prefixes outgrow GPU KV (02 E1) `[our reading]`; speculative decoding after measuring acceptance at your concurrency, since it caps running requests at 48 (04 C9, C10); PD and wide EP last, as the steps with the most moving parts `[our reading]`.

Mental model: the workload's shape picks the features, and the features are turned on in order of moving parts.
Diagram: the decision tree.

### Layer G. Reference (sections 27 and 28)

**27. Inside the Codebase (reference)**
Depth: mechanism (tabbed)
Payoff: Find the file and line behind any behaviour in this dive, pinned to v0.5.22.

Reference material, read last or on demand. Six tabs, each an ordered reading path with pinned line ranges that opens with the behaviour it explains and ends on the check the reader runs:
1. *Launch Path & Argument Resolution*: repo layout and scale (00), the launch path `launch_server` to `Engine` to subprocesses (01 walk), then `arg_groups/fields/*.py` and the `*_hook.py` resolution order. Explains why the documentation lags the code (01 D1; 04 mental model 5). Check: read a flag's field and the hooks that resolve it, then the startup log line that prints the result (01 C22, D1).
2. *Scheduler & Batching*: the 12-stop walk in register 01, including the class behind section 4's GPU-side placeholder. Explains the one-batch-ahead loop and the admission bet. Check: the periodic log fields (01 E1, E2).
3. *Radix Cache & Memory Pools*: register 02 walk (radix tree, unified cache, pools, allocators, cache controller); the serving class is `UnifiedRadixCache` on a Rust tree core (02 A12, B2). Explains what a hit and an eviction do. Check: the startup line `Tree cache initialized: source=default impl=UnifiedRadixCache` (02 B1).
4. *Model Execution & Attention*: `ModelRunner`, `ForwardBatch`, the `RadixAttention` layer, the backend registry, CUDA graph runners (register 03 walk). Explains which backend and page size a model gets. Check: the page-size override warning at startup (03 A16).
5. *Parallelism, MoE & PD*: register 05 walk. Explains how the flags carve one TP group and how the PD rendezvous works. Check: the rank layout in `runtime_context.py` against the GPU count (05 walk stop 2; 05 mental model 1).
6. *Gateway & Rust Frontend*: register 06 walk plus `rust/`. Explains the cache-aware decision and what the Rust frontend serves. Check: the gateway's policy defaults against 06 B3, and the routes in the Rust frontend's native API (09 A7).
The structured-output and speculative-decoding walks live in sections 10 and 11. Cross-link the vLLM dive's "14. Inside the Codebase".

Mental model: every behaviour in the dive has a field, a hook or a walk stop behind it.
Diagram: the module map on tab 1 (directories sized by role, with the request path drawn through them).

**28. Glossary & Sources**
Payoff: Look up any acronym, and check the source and tier behind any figure in this dive.

Acronym glossary, including the vLLM term mappings (TBO and vLLM's DBO, DeepEP normal and vLLM's high-throughput mode, prefill CP and vLLM's PCP), and the tier-grouped sources appendix (generated sources.md mirrors it).

---

## Diagram inventory (planned, inline SVG unless noted)

| Section | Diagram | Asserts |
| --- | --- | --- |
| 1 | Component map | Two zones: the cache, admission, the gateway and HiCache around the index; request features and kernels beside it |
| 2 | Reading map | Section dependencies and four routes |
| 3 | Three-process pipeline | ZMQ ring, rank-0 broadcast, process count |
| 4 | Overlap timeline | CPU plans N+1 under GPU batch N; EOS overshoot |
| 4 | Admission bet | Reserved output share decays, retraction resets |
| 5 | Radix tree with locks | Shared prefix resident while locked; leaf with no lock evicted |
| 5 | Hit as index copy | Slot indices copied, no KV bytes move |
| 5 | Fork onto tree (in the design-intent ExpandableSection) | Program fork tree becomes radix branches |
| 6 | GPU memory bar | Weights, non-static share, KV pool; page size per backend |
| 7 | HiCache tiers | Write-through, prefetch, demotion on eviction |
| 8 | Backend decision tree | Override module, then GPU arch by attention type |
| 10 | Constrained step | Grammar state to bitmask to logits to token |
| 11 | Draft-verify timeline | Draft steps, one verify pass, accepted prefix plus bonus |
| 12 | Endpoint map | Dialects into one path; admin plane and keys |
| 13 | Refit sequence | Trainer and server lanes; pause, begin, buckets, end, continue; cache flush |
| 14 | Parallelism map | One TP group carved for attention and experts |
| 15 | PD sequence | Rendezvous, reserve, push |
| 16 | DeepEP mode timeline | Lockstep EP group under mixed load vs PD |
| 17 | Cache-aware decision | Balance check, then threshold, then fallback |
| 18 | Deployment topology | Gateway, pools, bootstrap and KV edges |
| 19 | AWS path tree | Bedrock / SageMaker AI / HyperPod and EKS / EC2 |
| 21 | Instance map | Family to GPU to compute capability to default backend and page size, G7e and G7 included |
| 22 | Two EFA stacks | KV transfer and expert all-to-all use different libraries; one check per layer |
| 23 | Side-by-side request path | Where the two engines split the same work, and which pieces ship in the engine repository |
| 24 | Ecosystem map | Runtime, sgl-project projects, third-party integrations |
| 26 | Decision tree | Workload to recommendation |
| 27 | Module map | Request path through the source tree |

## Out of scope

- SGLang Diffusion (image and video generation) beyond one row in the ecosystem section: a separate engine with its own scheduler.
- Per-model cookbook recipes: the cookbook covers them and they age fastest.
- Re-explaining vLLM, EFA or GPU memory hierarchy: the sibling dives own them.
- Running our own benchmarks: no Tier 0 experiment is planned in this iteration; every performance figure is an attributed claim.

## Review notes

### Factual grounding review (2026-10-24)

Source: `reviews/scope-review-factual.md`. Register-side fixes the review names are outside this file and still open: 00 storage label (#27), 02 section recommendation (#21), 07 G3 and mental model 4 (#51), 08 mental model 2 (#61), 09 E3 claim header (#66), and a README row in 00 or 07 A19 (#48). Section numbers below are v1 numbers; they match v2 except where a note says otherwise.

- #1, #3, #4, #6, #10, #11, #13, #14, #19, #20, #22-#26, #42, #52, #58: row IDs corrected as given (#4: first option, process titles cited separately). Same error also fixed in section 4's policy range (01 C5 to C8 now C4 to C8; in v2 that range sits in section 5).
- #2: applied, with the optional "by the code, not counted on a running server"; section 3's process count also cites 01 A12.
- #5, #7, #8, #12, #15-#18, #28-#33, #35, #36, #38, #40, #41, #43, #45-#47, #49, #53-#56, #59, #60, #62-#65, #72-#74: applied as given.
- #9: applied; the scope does not name `sglang:cache_hit_rate`, so the gauge note was not needed.
- #21: applied; the section 6 memory bar and its inventory row show the non-static share, not a separate graph slice (02 D4).
- #27: not applied: no scope change asked; the fix is to register 00's label.
- #34: applied with change: 04 A14 marks the "without `--reasoning-parser`" half [SPECULATIVE], so it carries `[our reading]` and its basis.
- #37: applied; section 2 has no 48 figure, so nothing changed there.
- #39: applied with change: also weakened the thesis's "each backed by code on both sides" to "each to be backed ... in register 10 (in progress)", since F1's vLLM side was not re-read in vLLM code.
- #44: applied with change: the two code-only traps carry "read from source and not run" (06 B11, B14).
- #48: applied: cites `README.md:21` at the tag plus 07 A19; no register row added.
- #50: applied with change: "every container" softened to "container deployments set it"; 09 A9, B8 cited for the 0.0.0.0 bind.
- #51: not applied: register fix to 07 G3 and mental model 4; the scope does not quote G3.
- #57: applied, first option: trainer and SGLang server lanes, no gateway lane.
- #61: applied with change: "Ray and KServe pin none" written as "Ray pins none and KServe v0.21.0 ships no SGLang runtime" (06 F13 wording).
- #66: applied; 09 E3 header fix is register-side.
- #67: applied with change: kept 09 B1 to B11 (it also covers the overview, `/dev/shm` and probe items) and the row's "not tested which is needed".
- #68: applied, second option: P6e-GB300 with compute capability only (SM103) and "specs not in the EC2 spec tables as of 2026-10-24"; a row with the launch figures needs new research.
- #69: applied in the instance map, the FP8 sentence and the diagram.
- #70: applied with change: `[our reading]` placed after the cited combination (the file's convention), and the 2.30.7 figure stated once, in the NCCL sentence that follows.
- #71: applied; kept the 09 D6 to D10 range.

### Factual follow-up (#75 to #84)

Source: `reviews/scope-review-factual.md`, follow-up table. Ruling: `reviews/scope-revision-plan.md`.

- #75: applied, in the thesis and the section 23 opener.
- #76: applied with change: the edge framing carries `[our reading]`; step composition and admission are now edge (b), so the remaining-defaults clause names grammar fallback and draft shape (10 A11, A12).
- #77: applied, in thesis edge (a) and the section 23 granularity row.
- #78: applied verbatim in section 23.
- #79: applied, in the thesis and the section 23 hedge.
- #80: applied in section 23's switching checklist; "reasoning" dropped.
- #81: applied verbatim in section 26, with the `lpm` test step from O8 added between the gateway and HiCache steps.
- #82, #83, #84: applied in register 10's errata (commit 6a06bb5); section 15's "Against vLLM" line uses the #82 "reference connector" wording.

### Newcomer review

Source: `reviews/scope-review-newcomer.md`. Ruling: `reviews/scope-revision-plan.md`.

- N1 to N5, N7, N8, N10 to N20, N22 to N29, N32, N33, N34, N36, N37, N38, N43, N46 to N55, N57, N59: applied.
- N6: applied with change: written as "counterpart" in sections 14 and 16, because registers 05 and 10 do not show the paired terms to be the same mechanism; glossary rows in section 28.
- N9: applied with change: the language goes into the design-intent ExpandableSection at the end of section 5, since old section 14 was demoted (O21).
- N21: applied: Inside the Codebase is section 27, introduced in section 2 as reference.
- N30: applied with change: section 25 points to section 12's key matrix (O11) instead of scoping its action to non-SageMaker hosts.
- N31: applied: LoRA merged into section 12 as "Addressing adapters" (the plan's part 6 lists this as "N13").
- N35: applied with change: the N37 path rewrite replaces the sentence; request features are now explained by what each changes.
- N39, N40, N41: applied with change: the plan's four routes in v2 numbering, with section 23 on every route (O20); the frontend language now sits inside section 5.
- N42: applied, first option: the PD row replaced, the memory-flag row added, section 23's checklist linked as the long form.
- N44: applied with change: expansions placed at first occurrence in the section blocks; adding them to the authoring brief's list is outside this revision, which edits only SCOPE.md.
- N45: applied with change: LWS, RBG, GIN, NVSHMEM, CUDA VMM, `FI_EP_RDM` and EFA-GDA expanded (EFA-GDA from 09 D7); UCCL-EP described by role, because register 09 D14 carries no expansion, and the author takes it from that AWS sample when drafting.
- N56: not applied: O29's split (two AWS path sections) is used instead of one section with an ExpandableSection per path.
- N58: applied: the fallback's trigger is stated (01 D4: GPU memory cannot be read).

### Outcome-fit review

Source: `reviews/scope-review-outcome.md`. Ruling: `reviews/scope-revision-plan.md`.

- O2, O3, O5, O6, O7, O9 to O12, O14, O16, O17, O18, O21, O25, O26: applied. O14's G7e and G7 rows ship because 09 C1, C3 and C4 carry them.
- O1: applied with change: the title names the radix tree and the vLLM difference ("SGLang: The Radix-Tree Serving Runtime, and Where It Differs from vLLM") in place of the review's example title; the thesis opens on convergence, then the three edges.
- O4: applied with change: fourth route added; the day-one table takes the plan's rows, and parser names, regex and EBNF fields and speculative shape stay in section 23's checklist, linked as the long form.
- O8: applied with change: the `lpm` test sits in sections 5 and 26, not 4, because the policy material moved to section 5 (N2).
- O13: applied: "What it costs" in section 26, five levers as `[our reading]`, no price figures.
- O15: applied with change: the worked example is optional and ships only if the author fetches the model's config (Tier 1); the two concurrency caps ship regardless.
- O19: applied with change: the launch line keeps the default 127.0.0.1 bind instead of `--host 0.0.0.0`, and says when to change it; `sglang serve` per 01 A15 and 09 A9.
- O20: applied with change: the comparison stays at section 23; sections 1 and 2 and the per-section "Against vLLM" lines carry the forward reading.
- O22: applied with change: six codebase tabs, not four; the structured-output and speculative-decoding walks move into sections 10 and 11.
- O23: partially applied: LoRA merged into section 12; Quantization kept as section 9, because it owns KV precision (N26) and mirrors the vLLM dive's section.
- O24: applied with change: one owner per table, using the newcomer split (orchestrators in 18, frameworks and containers in 24).
- O27: not applied: `deep-dives/rl-agentic-loops` is not deployed by `deploy.yml`, so a link would 404; carried to the final report as a proposal.
- O28: applied in v2 numbering; section 5 uses the `sglang:token_usage` observation; section 12 keeps 128 tokens as its figure, and old section 13's 8-adapter cap stays in the adapters block; sections 21, 23 and 25 carry a strongest fact.
- O29: applied with change: sections 19 and 20, with the image-line choice in 21; the AWS route includes section 12, and PD (15) sits on the route's PD and wide-EP extension.
