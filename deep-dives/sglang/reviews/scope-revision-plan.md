# Scope revision plan (2026-10-24)

The orchestrator's ruling on every finding from the three scope reviews:
- `scope-review-outcome.md` (O1 to O29)
- `scope-review-newcomer.md` (N1 to N59)
- `scope-review-factual.md` follow-up (#75 to #81)

The reviser applies this plan to `SCOPE.md`. Register-side fixes #82 to #84 are already appended
to register 10's errata (commit 6a06bb5).

## 1. New section list (28 sections)

Old numbers are in brackets. Section ids are the ones `src/App.tsx` uses.

| New | Id | Title | Was |
| --- | --- | --- | --- |
| 1 | thesis | Thesis & Framing | 1 |
| 2 | getting-started | Getting Started | 2 |
| 3 | runtime | The SGLang Runtime: processes and sockets | 3 |
| 4 | scheduler | The Scheduler: one step ahead, betting on early stops | 4 |
| 5 | radix | RadixAttention and the Radix Cache | 5, with old 14 demoted into it |
| 6 | kv-memory | KV Memory and the Defaults Your GPU Picks | 6 |
| 7 | hicache | HiCache: one tree across GPU, host and storage | 7 |
| 8 | kernels | Attention Backends and Kernels | 8 |
| 9 | quant | Quantization and KV Precision | 9 |
| 10 | structured | Structured Output: one bitmask per token | 10 |
| 11 | spec-decode | Speculative Decoding: draft, verify, keep the agreed prefix | 11 |
| 12 | apis | Talking to SGLang: APIs, LoRA adapters and the admin plane | 12 and 13 |
| 13 | rl | SGLang as an RL Rollout Engine | 15 |
| 14 | parallelism | Parallelism: one TP group, carved for attention and experts | 16 |
| 15 | pd | PD Disaggregation: rendezvous, reserve, push | 18 |
| 16 | wide-ep | Wide Expert Parallelism: DeepEP, EPLB and overlap | 17 |
| 17 | gateway | The Model Gateway: routing in front of SGLang | 19 |
| 18 | multinode | Multi-Node and Kubernetes Orchestrators | 20 |
| 19 | aws-managed | SGLang on SageMaker AI and HyperPod | 22, managed half |
| 20 | aws-self-managed | SGLang on EKS and EC2 | 22, self-managed half |
| 21 | ec2 | EC2 Instances, Images and GPU-Dependent Behaviour | 23 |
| 22 | efa | PD and Wide EP over EFA | 24 |
| 23 | vs-vllm | SGLang and vLLM: what differs, what converged, and how to read the benchmarks | 25 |
| 24 | ecosystem | Ecosystem and Production Users | 26 |
| 25 | ops | Operations: metrics, warm-up, keys and failure signatures | 27 |
| 26 | decision | Decision Guide | 28 |
| 27 | codebase | Inside the Codebase (reference) | 21 |
| 28 | sources | Glossary & Sources | 29 |

Renumber every cross-reference in SCOPE.md, including the thesis, Getting Started and the diagram
inventory.

**Inside the Codebase: 6 tabs** (O22 applied with change, N21 applied). Each tab opens with the
behaviour it explains and ends on the check the reader runs:
1. Launch Path & Argument Resolution (old tabs 1 and 2).
2. Scheduler & Batching.
3. Radix Cache & Memory Pools.
4. Model Execution & Attention.
5. Parallelism, MoE & PD.
6. Gateway & Rust Frontend.

The structured-output and speculative-decoding code walks (register 04) move into a
"Where this lives in code" `ExpandableSection` at the end of sections 10 and 11.

## 2. Title, subtitle, thesis (O1, O2, O3, N9, N10, #75 to #77, #79)

- **Title:** "SGLang: The Radix-Tree Serving Runtime, and Where It Differs from vLLM".
- **Subtitle:** "How SGLang v0.5.22 schedules, caches and scales LLM serving, which of its defaults
  a vLLM user already knows, and how to run it on AWS".
- **Thesis paragraph 1** opens on convergence. Use the #75 wording: "...queue requests
  first-come-first-served, recompute on preemption (outside SGLang's PD decode mode) and, on NVIDIA,
  run the same kernel projects, each through its own forks (10 A2, A5, B1 to B4; 01 F6)".
- **Then three edges, in order:**
  - **(a) The index.** Its shape (a token tree with variable-length edges against a chain of block
    hashes), and a reuse unit that the GPU's backend sets. Use the #77 condition: "for a dense
    Llama-style model at defaults, reuses more finely on H100 and less finely on B200 (10 A6, A7,
    A10)". The radix-tree detail from the old paragraph 1 explains this edge.
  - **(b) Scheduler defaults.** Prefill-first steps, and an admission bet that protects long
    generations where vLLM protects early arrivals: retraction re-queues the requests with the
    fewest generated tokens (10 A3, A5; 01 F4 to F6).
  - **(c) What ships in the engine repository.** A first-party cache-aware gateway, the PD control
    plane that pushes KV into decode-reserved pages, and the admin plane with its bind and key
    conditions.
- Label the edge framing `[our reading]` (#76). Add the remaining default-level differences as one
  clause: "grammar fallback and draft shape (10 A11, A12)".
- **Scope of the index model (O2).** "the cache, admission, the gateway and HiCache are organised
  around the index; request features and kernels run beside it". The section 1 component map is
  drawn in two zones, around the index and beside it. Remove "every component either feeds it,
  reads it or approximates it".
- **Section 1 adds (N9):**
  - SGLang ships a frontend language and the SGLang Runtime (SRT).
  - Production use today is mostly the runtime behind an OpenAI-style API (07 A18 to A21).
  - The language is covered in an `ExpandableSection` at the end of section 5.
- **The benchmark hedge** gains #79's clause about the unreadable InferenceX dashboard (10 C15).
- **Section 1 payoff (N48):** "Predict how SGLang will treat your traffic from one idea, the KV
  cache as a shared prefix index, and see which of its behaviours you already know from vLLM."

## 3. Getting Started (N36 to N43, O4, O19, O20, O29, N14, N49)

- **Payoff (N49):** "Find your route through the dive in two minutes, and the settings a vLLM user
  gets wrong on day one."
- **Prerequisites.** Rewrite (c) and (d) as N36 gives them:
  - (c) adds the vLLM dive's "6. Automatic Prefix Caching" and MLA.
  - (d) adds data-parallel attention.
  - Section 24 (PD and wide EP over EFA) names the EFA dive's "libfabric and the EFA Provider" and
    "NCCL over EFA: the aws-ofi-nccl Plugin" as its prerequisite (N14).
- **The path:** five ordered mental models, each with one "because" (N37). Then four or five feed
  lines in prose (N38), renumbered to the new list.
- **Day-one table (O4, N42).** Retitle it "What a vLLM user types differently". Rows, each linking
  its section:
  - `--enable-metrics` (01 E5).
  - `--mem-fraction-static` against `--gpu-memory-utilization`, different quantities (01 F9).
  - FCFS default, `lpm` opt-in (01 C4).
  - Prefill-first steps, `--enable-mixed-chunk` as the vLLM-like setting (10 A3).
  - Retraction victims (10 A5); `sglang:num_retracted_requests_total` against
    `vllm:num_preemptions`.
  - The backend sets the page size (03 B13).
  - `--tp 8 --attn-dp-size 8 --ep 8` is 8 GPUs (05 A4).
  - LoRA `base:adapter` (07 C16).
  - `--admin-api-key` (07 B12).

  Drop the "10 processes" row (it stays in section 3) and the PD row. Link section 23's switching
  checklist as the long form.
- **First-launch block (O19).**
  - One launch line. The author verifies the CLI at the tag: `sglang serve` per 01 A15, otherwise
    `python -m sglang.launch_server`.
  - Flags: `--enable-metrics --admin-api-key`. Keep the default 127.0.0.1 bind unless the reader
    needs the network, and say so.
  - The startup log fields to read: the page-size override warning (03 A16), `max_total_num_tokens`
    (01 C22, 02 D5) and the computed `--max-running-requests`.
  - Then one repeated request and `meta_info.cached_tokens` (07 knobs).
- **Four routes, in new numbering:**
  - Agentic or multi-turn: 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 17, 23, 25, 26.
  - Large MoE at scale: 1, 2, 3, 4, 5, 6, 8, 11, 14, 15, 16, 17, 18, 23, 26; on AWS add 20, 21, 22.
  - AWS this quarter: 1, 2, 3, 5, 6, 8, 12, 19, 20, 21, 25, 26; for PD or wide EP add 14, 15, 16,
    18, 22.
  - Moving a vLLM deployment (O4): 1, 2, 4, 6, 9, 10, 12, 23, 25.

  Section 23 is on every route (O20 applied with change). The comparison stays at 23. Sections 1
  and 2 carry the converged-and-differs summary, and every mechanism section carries an "Against
  vLLM" line, so a forward reader meets the differences early.
- **Inside the Codebase** is introduced as reference material, read last or on demand.
- **Acronyms (N43).** Expand on first occurrence in sections 1 or 2: PD, MoE, LoRA, EFA, FCFS, TP,
  DP, EP.

## 4. Per-section changes, in new numbering

Every mechanism section (3, 4, 5, 7, 10, 11, 15, 16, 17) ends with one "Against vLLM" line drawn
from its register 10 A row. Each line names the vLLM dive section by its title (O5, N47):
- 3: A1.
- 4: A3, A5.
- 5: A6 to A8, 02 G4, G5.
- 7: A9, and vLLM "7. KV-Cache Offloading & Tiers".
- 10: A11, and vLLM "12. The OpenAI-Compatible Server" (where vLLM covers structured outputs).
- 11: A12, and vLLM "11. Speculative Decoding".
- 15: A14, with the #82 wording ("reference connector").
- 16: A13.
- 17: A15, 06 G2.

Sections 18, 19 to 22 and 25 link their vLLM counterparts by title. Section 18 links "15.
Orchestration: Ray & Ray Serve LLM", "16. Kubernetes: Production-Stack & Router", "17.
Kubernetes: llm-d, KServe & Gateway API" and "18. NVIDIA Dynamo & the Ecosystem".

The strongest number for each section (O28) goes into its block as "Strongest number: ...". Use
the figures O28 lists, renumbered. Section 5 uses the observation "a full pool with low
`sglang:token_usage`" (02 C14).

**3 Runtime.**
- Drop the bootstrap-room parenthetical (N4).
- Name the `SGLANG_RUST_SERVER` switch and the routes the Rust frontend serves, with a pointer to 19
  (N59).
- Add the 07 B14 caveat to the `--tokenizer-worker-num` sentence: it asserts with `--api-key` (O11).

**4 Scheduler.**
- Keep one policy sentence: "`fcfs` is the default; the cache-aware policies ride on the tree
  (section 5)". Move lpm, its 128 fallback and 02 C13 to section 5 (N2).
- Retraction is "SGLang's name for preemption; both recompute", with the vLLM link (N5).
- FutureMap is described by its role, a GPU-side placeholder for tokens not yet sampled, with the
  class name left to the codebase tab.
- Expand EOS.
- State `--enable-metrics` at the first metric, and say logs come from attention-TP rank 0 only
  (01 E3, E5) (N8).

**5 Radix cache.**
- Open on the two-level pool (`req_to_token` table, token-to-KV pool, page size as the reuse unit
  set by the backend, sections 6 and 8) (N1).
- Add the tree-versus-hash-chain trade block before the knobs (O7): lookup, eviction unit,
  de-duplication, and cross-instance naming via the SHA-256 page-hash chain (02 G1, G4, G5, G10;
  10 A6).
- The "hit copies slot indices" point comes after the trade, with the `[our reading]` note that any
  paged-KV hit is a table update (10 B2, 02 G8).
- Take lpm, the 128 fallback and 02 C13 from section 4. Add the O8 test advice: for shared-prefix
  traffic whose queue stays under 128, test `--schedule-policy lpm` and compare `#cached-token`
  with `#new-token` before and after. No measurement of its effect was located.
- Move `UnifiedRadixCache` and the Rust core to codebase tab 3 (N32).
- End with an `ExpandableSection`, "Design intent: programs as cache hints", carrying old 14's
  content and its fork-onto-tree diagram (O21).

**6 KV memory.**
- Open with the resolution-hook model in two sentences, plus the startup-log check (N22, 01 D1,
  C22).
- Add the `--mem-fraction-static` against `--gpu-memory-utilization` sentence (N7, 01 F9).
- KV dtype is named and linked to section 9 (N26).
- Drop "(rarely)" from `--page-size`. End the page-size block on the O9 action: on P6, set
  `--page-size 16` if shared prefixes are short or not page-aligned, and keep shared prefixes at
  page multiples. Hedge: accepted by the code at v0.5.22, throughput effect not measured.
- O15 worked example: optional. Ship it only if the author fetches the model's config (Tier 1) and
  labels it arithmetic on the code formula, not observed. Follow it with the two concurrency caps
  (4096 reserved output tokens, 48 under speculation).
- The 0.95 against 0.88 fallback conflict: state its trigger from 01 D3 and D4, or drop it (N58).
- Section 6 owns sizing; the instance section links back to it (N25).

**7 HiCache.**
- Name the tiers L1 GPU, L2 host, L3 storage backend.
- Define "backed-up" as "its KV is already written to host".
- Define HiSparse in one clause (02 E20), or cut it.
- Payoff (N50): "Turn on host and storage tiers with the right flags, and know which hits come back
  from each tier and which are skipped."
- Replace "The DOC-CODE conflicts" with "The documentation says X; v0.5.22's code does Y, so set Z"
  (N34).

**8 Kernels.**
- Owns the backend and page size.
- Defines tree speculation in one clause (`topk` above 1; section 11) (N3).
- Defines hybrid models in one clause (N16).
- Replace the hardware coverage table with three lines, and demote the full table to an
  `ExpandableSection` (O25). Trainium gets a one-row pointer to section 19 (N27).
- Link the warm-up block to SageMaker's start budget in 19 (O10).

**9 Quantization.**
- Stays standalone and owns KV precision (N26).
- Add the 03 G7 flag-name difference: online FP8 is `--quantization fp8` on SGLang, scheme names on
  vLLM (O23, partial).

**10 Structured output.**
- Jump-forward gets one clause on what it did and that v0.5.22 does not reach it (04 A12), or the
  row is cut (N19).
- "Where this lives in code" `ExpandableSection` (from old tab 6).

**11 Speculative decoding.**
- Algorithm menu as a table with a "draft comes from" column (N18). Use `DFLASH` in code font and
  DFlash in prose.
- State current behaviour, not version history (N33).
- "Where this lives in code" `ExpandableSection`.

**12 APIs, LoRA and the admin plane (old 12 and 13 merged; O23, N31).**
- LoRA becomes an "Addressing adapters" block. Keep the slot model: 8 adapters per batch, one slot
  shared with base requests (07 E1, E5). Keep the vLLM "13. LoRA & Multi-Adapter Serving" link.
- Section 12 owns the three-state admin-key model and the key matrix by deployment (O11, N41):
  - SageMaker real-time: `--admin-api-key` only. `/ping` and the normal routes stay unkeyed while
    `--api-key` is unset, `[our reading]` of 07 B12 with 09 A5. IAM on `InvokeEndpoint` guards
    inference.
  - EKS or EC2: both keys, with probes on `/health` (exempt; 09 A5, B5).
  - Multi-tokenizer servers: authenticate in the gateway (07 B14).
- State current behaviour, not "v0.5.22 chat response changes" (N33).
- Payoff: merge N51's wording with old 12's.

**13 RL rollouts.**
- Open with two sentences: the trainer samples completions through the server, then pushes new
  weights into it (a refit) (N13).
- Write "KV computed with the old weights", not "old-policy KV".
- State current behaviour (N33).
- O27, the RL dive cross-link, is not applied: `deep-dives/rl-agentic-loops` is not deployed by
  `deploy.yml`, so a link would 404. It goes into the final report as a proposal.

**14 Parallelism.**
- State the full GPU-count product once (N12).
- Terminology bridge: SGLang prefill CP (`--attn-cp-size`) against vLLM's PCP, written as
  "counterpart" unless the registers show they are the same (N6).
- End on the O26 choice rule: DP attention does little for GQA models; DCP grows the longest
  context, DP attention grows how many requests fit (05 mental model 2, F7).

**15 PD.**
- Open with the O6 trade in two sentences.
- With DP on a prefill server, the controller routes by room id (N4; 01 A10, 05 A11).
- Knob: `--disaggregation-decode-enable-radix-cache`, default False (05 C16) (O2).
- End on the O6 gauge reading, `[our reading]`.
- Link the gateway's PD mode block in 17.
- "Hybrid model" links back to section 8.

**16 Wide EP.**
- Terminology bridge: DeepEP "normal" is the counterpart of vLLM's high-throughput mode, and
  two-batch overlap (TBO) is the counterpart of vLLM's dual-batch overlap (DBO) (N6). Check each
  against 05 and 10, and write "counterpart" unless they are the same.
- "The DOC-CODE conflict" is reworded (N34).
- The closing recipe now follows PD, so it reads in order.

**17 Gateway.**
- Takes the "PD mode" block from old 20 (N23): `--prefill URL PORT`, dual dispatch,
  prefill-failure cancel, per-role policies, DP-aware routing (06 C1 to C10).
- Add the in-server `--dp-size` against gateway choice (N11).

**18 Multi-node and orchestrators.**
- Open with the cache-signal model: KV events, the gateway's approximate tree, or no signal, with
  one row per orchestrator (06 F6 to F12, 02 F1 to F9) (N24).
- Keeps the orchestrator version table. Section 24 keeps RL frameworks and vendor containers and
  links here (N28, O24).
- Expand LWS and RBG in the first body sentence (N45).

**19 SageMaker AI and HyperPod.**
- Opens with the four-path decision tree (Bedrock gives no engine choice; SageMaker AI; HyperPod
  and EKS; EC2). The tree is this section's diagram.
- Then SageMaker:
  - `/ping` and `/invocations` and the Rust-frontend rule.
  - The image lines (named, with the choice in section 21).
  - The `/ping` key rule, pointing to the key matrix in 12.
  - `docker/serve` booleans; `/metrics`; the `gpu-4-1` AMI.
  - The O10 "budget the start" item: `ContainerStartupHealthCheckTimeoutInSeconds`, and
    `python -m sglang.compile_deep_gemm` at image build for block-FP8 models on SM90 or newer
    (`[our reading]` for the combination; 09 A4; 03 C9, C10).
  - O12: `/invocations` takes OpenAI chat bodies only (09 A2), and the LMI containers ship vLLM and
    TensorRT-LLM (09 A18, scoped to the pages read).
- Then HyperPod, with the O17 wording ("documented with vLLM worker images only (09 A21); AWS
  documents no SGLang recipe for it").
- Then Trainium and Inferentia: the full statement lives here once (N27).
- AWS-authored SGLang content as dated Tier 2 items.
- Ends on "pick the path; section 21 picks the instance and image" (N57).

**20 EKS and EC2.**
- EKS: SGLang named in the real-time inference overview; `/dev/shm`; probes on `/health`; the EFA
  device plugin and hugepages with the 09 row's hedge; LWS expanded (N17).
- EC2: what the reader supplies.
- Link the vLLM dive's "24. vLLM on Amazon EKS".
- Ends on the next action for each path.

**21 EC2 instances and images.**
- Takes the image-line choice from old 22 (N57, O29).
- Cut the repeated GPU-tier table; link 6 and 8 (N25).
- Add a "choose" table: workload to the families that keep the needed feature, and the constraint
  each row trips (O14).
- Add G7e and G7 with the SM120 note, only if 09 C1 and C4 carry them. Otherwise state that the
  instance map lists the families register 09 covers.
- End on the O9 page-size action and the pre-migration checklist.

**22 PD and wide EP over EFA.**
- Open with the two-stack sentence and the two EFA dive links (N14).
- Apply the O16 wording on AWS's DeepEP fork.
- Expand GIN, NVSHMEM, CUDA VMM and `FI_EP_RDM` (N45). Take the EFA-GDA and UCCL-EP expansions from
  the AWS sources cited in 09 D7 and D14.

**23 SGLang and vLLM.**
- Opener uses the #75 wording.
- The granularity row uses the #77 wording. Its strongest fact is the convergence list, and the
  page-size flip is cited in one line from section 21 (N25).
- The benchmark list uses the #78 wording verbatim, and the hedge gains the #79 clause.
- Switching checklist uses the #80 wording:
  - "drop `--enable-auto-tool-choice` and map tool-call parser names (07 G5)", with "reasoning"
    dropped;
  - "set `--admin-api-key` unless the port is reachable only from the trainer's network (10 A19,
    E9)".
- Expand EBNF.

**24 Ecosystem.**
- Payoff (N52).
- RL frameworks and vendor containers table only; it links 18 for the orchestrators (N28).

**25 Operations.**
- Payoff (N53).
- The body is the symptom-to-cause table (symptom, cause, flag or fix, back-link) plus the security
  block (N29).
- The security block opens with the open admin plane, landed twice. The CVE count comes second,
  framed by its action: keep diffusion, EPD and `--enable-custom-logit-processor` off exposed hosts,
  and run v0.5.22 or later (O18).
- The key advice is replaced by a pointer to section 12's key matrix (O11, N30).
- Expand CVE and EPD.

**26 Decision guide.**
- The section 23 pointer comes before the first-week order (N55).
- The first-week order uses the #81 wording verbatim, with `[our reading]` and a citation per step.
  Add the `lpm` test step from O8.
- Add a "What it costs" block (O13). It lists five SGLang-specific cost levers as `[our reading]`,
  each pointing to its section, and links the vLLM dive's "24. vLLM on Amazon EKS" and "25. vLLM on
  SageMaker & vs Bedrock" for prices, Spot and reservations. No price figures.
- Trainium leaf links 19.

**27 Inside the Codebase.** Six tabs as in part 1.

**28 Glossary & Sources.** Payoff (N54).

## 5. Rules for every section block

- **Acronyms (N43 to N46).** Expand at first occurrence in reading order. Add the expansions N44
  lists to the authoring brief's list.
- **Flag defaults that look like settings.** Where the docs disagree with the code, say so in reader
  words (N34).
- **No release-history framing (N33).** Keep a version marker only where the reader may hold an
  older recipe.

## 6. Dispositions not applied, or applied with change

- **O20: applied with change.** The comparison section stays late (23). Sections 1 and 2 and the
  per-section "Against vLLM" lines carry the forward reading.
- **O22: applied with change.** 6 tabs, not 4. The structured-output and speculative-decoding
  walks move into sections 10 and 11.
- **O23: partially applied.** LoRA merged into APIs; Quantization kept, because it owns KV precision
  (N26) and mirrors the vLLM dive's section.
- **O24 and N28 agree on one owner per table.** The newcomer split is used: orchestrators in 18,
  frameworks and containers in 24.
- **O27: not applied.** The RL dive is not deployed. Proposal for the report.
- **O29 and N56: O29's split is used.** Two AWS path sections, with the decision tree in the first.
- **N13 (section 13 kept or merged): merged** (O23).
- **N42: first option** (replace the PD row).
