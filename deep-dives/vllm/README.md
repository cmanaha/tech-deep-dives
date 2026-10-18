# vLLM Deep Dive

Interactive single-page app about vLLM as a production serving engine: how the engine
schedules work and manages KV-cache memory, which features change cost or latency, how
it runs across GPUs and nodes, and how it fits on AWS (EC2, EKS, SageMaker, Neuron).

The dive is written for a team that has to decide whether to run vLLM, how to size it,
and what it will do under load. It describes **vLLM v0.31.0** (tag `v0.31.0`, commit
`db9527a46873454610df6dbedf79a36d6bf1a7f6`). Documentation was accessed 2026-10-16.

## Audience

Technical leads and solution architects who already know what an LLM is and what a GPU
costs. The sections skip the basics and go to architecture decisions, defaults that
differ from what the docs say, trade-offs, and when-to-use guidance.

## Key takeaways

Each point is sourced in the section named in brackets.

- **Two separate axes describe the engine.** "V1" is the process architecture: an API
  server and a separate EngineCore process talking over ZMQ. Model Runner V2 is the GPU
  execution layer inside it, the default since v0.29.0. The older V1 model runner is
  deprecated, with removal planned for v0.32, and a few features still fall back to it.
  [3. The V1 Engine Architecture, 14. Inside the Codebase]
- **The paged KV memory model is unchanged; the PagedAttention kernels are gone.** vLLM
  deleted them in v0.25.0. FlashAttention, FlashInfer, Triton and MLA backends read the
  same block-table layout. [5. Paged KV Cache & Block Tables]
- **`vllm serve` sizes the batch from GPU memory.** With both limits unset it starts at
  16384 batched tokens and 1024 sequences on GPUs with at least 160 GiB, 8192 and 1024 on
  H100-class GPUs, and 2048 and 256 otherwise. The same flags can therefore behave
  differently on two instance types. [4. Scheduler & Continuous Batching]
- **Overload has two signals.** Admission control (`--max-num-queued-reqs`,
  `--max-num-queued-tokens`) rejects requests with HTTP 503. Preemption only recomputes,
  and shows up as `vllm:num_preemptions` and the "Preemptions:" stats log field.
  [4. Scheduler & Continuous Batching, 27. Operations & Failure Modes]
- **Prefix-cache hashes are reproducible with `sha256` since v0.29.0.** The `xxhash`
  variants draw a random seed per process, so cross-instance cache-aware routing needs
  the same `PYTHONHASHSEED` on every instance. [6. Automatic Prefix Caching]
- **Multi-node runs default to the `mp` executor with `--nnodes`.** Ray is used only
  inside a Ray placement group or with `--distributed-executor-backend ray`. The docs
  describe this differently; the section follows the code. [9. Distributed Inference]
- **Disaggregated KV transfer pulls by default.** `NixlConnector` is the pull connector:
  the decode instance issues the reads. `NixlPushConnector` (v0.24.0) has prefill write
  into decode. `kv_both` is deprecated and `P2pNcclConnector` was removed in v0.24.0.
  [10. Disaggregated Prefill / Decode, 22. vLLM on AWS GPUs, EFA & NIXL]
- **Orchestrators pin older vLLM releases.** Dynamo 1.5.1 installs vLLM 0.28.0, Ray
  2.59.0 pins 0.27.0, and llm-d 0.10.0 ships 0.30.0. A v0.31.0 feature is not available
  through those stacks until they move. [15. Ray, 17. llm-d, 18. NVIDIA Dynamo]

## Section map

29 sections in the left navigation.

- Framing (1-2): Thesis & Framing, The Inference Workload.
- Engine core (3-7): The V1 Engine Architecture, Scheduler & Continuous Batching, Paged
  KV Cache & Block Tables, Automatic Prefix Caching, KV-Cache Offloading & Tiers.
- Features (8-13): Quantization & Precision, Distributed Inference, Disaggregated
  Prefill / Decode, Speculative Decoding, The OpenAI-Compatible Server, LoRA &
  Multi-Adapter Serving.
- Code (14): Inside the Codebase, a tabbed walk through the source tree at the v0.31.0
  tag (architecture, config, scheduler, execution, model layer, distributed, advanced,
  Rust frontend).
- Ecosystem (15-20): Ray & Ray Serve LLM, Production-Stack & Router, llm-d, KServe &
  Gateway API, NVIDIA Dynamo, Gateways & Application Layer, Observability &
  Benchmarking.
- AWS (21-25): vLLM on AWS Neuron, vLLM on AWS GPUs, EFA & NIXL, EC2 Topology &
  Placement Groups, vLLM on Amazon EKS, vLLM on SageMaker & vs Bedrock.
- Decisions (26-28): When Not vLLM, Operations & Failure Modes, Decision Guide.
- Reference (29): Glossary & Sources.

Hardware memory tiers belong to the sibling **Silicon, Memory & Inference** dive, and
the network transport to the **EFA** dive. This dive links to both rather than
repeating them.

## Running it locally

```bash
pnpm install
pnpm --filter @tech-deep-dives/vllm dev
pnpm --filter @tech-deep-dives/vllm build
```

Run the deterministic quality gates from the repo root:

```bash
pnpm gates
```

`.gates.json` opts this dive into the no-ai-tells, svg-a11y, pinned-refs,
pinned-refs-research, required-files and pre-overflow gates.

## Sourcing standard

Code is the authority. Every code-level claim links to a file and line range at the
`v0.31.0` tag. Documentation links use the versioned `/en/v0.31.0/` docs. Where the
docs and the code disagree, the section says so and marks the citation as a
documentation-versus-code conflict.

Every quantitative claim carries an inline citation with its tier and access date:

- Tier 1: source code at a pinned ref, official documentation, release notes.
- Tier 2: vendor and project blogs, announcements, product pages.
- Tier 3: peer-reviewed papers and third-party analysis.
- Tier 4: tutorials, used for inspiration only and never cited as fact.

Vendor and project performance figures stay attributed to their source. None of them
was benchmarked for this dive.

`sources.md` is generated from the in-app citations and the Sources appendix:

```bash
node deep-dives/vllm/revamp/tools/gen-sources.mjs          # write sources.md
node deep-dives/vllm/revamp/tools/gen-sources.mjs --check  # exit 1 if it is stale
```

## Where the research lives

- `research/2026-10-refresh/00-pin-and-diff.md`: the pin and the diff from the previous
  build (commit `15652a6b`, 2026-06-07) to v0.31.0.
- `research/2026-10-refresh/01-*.md` to `08-*.md`: claim registers, one per group of
  sections. Each row gives the claim as shipped, the verdict, and the code or doc
  evidence.
- `research/2026-10-refresh/experiments/`: Tier 0 experiments with inputs and outputs.
  The one logged so far shows that `--kv-cache-memory` is accepted as a prefix of
  `--kv-cache-memory-bytes`.
- `revamp/REVAMP-PLAN.md`: the per-section plan for the v0.31.0 refresh.

## Known gaps

- No GPU experiments. Every performance figure traces to documentation, source code or
  a vendor publication. `iac/` does not exist because no cloud experiment has run.
- Claims the research could not settle are left out of the app and listed as UNKNOWN
  in the claim registers.

## Sources

See `sources.md` for every source, grouped by tier, with access dates and the sections
that cite it.
