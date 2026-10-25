# SGLang Deep Dive

Interactive single-page app about SGLang as a production serving runtime: how it schedules
work around a radix-tree index of the KV cache, which request features ride on that index,
how it scales across GPUs and nodes, where its design differs from vLLM and why, and how to
run it on AWS (SageMaker, HyperPod, EKS, EC2 and EFA).

The dive describes **SGLang v0.5.22** (tag `v0.5.22`, commit
`baa9befa381511cd4d56f83980951e5a45fffc6d`, released 2026-10-19). Every source was accessed
2026-10-24. Code citations are pinned to the tag.

## Audience

Technical leads and solution architects who have read the sibling vLLM dive
(`deep-dives/vllm`, pinned to vLLM v0.31.0). Shared fundamentals (the inference workload,
continuous batching, paged KV memory, the parallelism vocabulary) are defined there and
linked, not repeated.

## Key takeaways

- **Convergence first.** SGLang v0.5.22 and vLLM v0.31.0 both page the KV cache, cache
  prefixes by default, overlap CPU and GPU work by default, queue requests first-come-first-served
  and recompute on preemption. On NVIDIA they run the same kernel projects through their own forks.
- **The index is the first difference.** SGLang indexes the KV cache as a token tree (the radix
  cache) where vLLM chains fixed-size block hashes. A cache hit copies slot indices, eviction removes
  unheld leaves only when an allocation is short, and HiCache demotes tree nodes to host memory and
  storage rather than deleting them.
- **The GPU sets the reuse unit.** The attention backend is chosen by model family, then GPU
  generation, and it sets the page size: token-exact on H100, 64-token pages on B200 for the same
  dense Llama deployment, when speculation is off or set explicitly to a single-branch draft.
- **Admission is a bet on early stopping.** The scheduler charges each request a forecast of its
  output and, when memory runs out, retracts the requests with the fewest generated tokens. vLLM
  protects early arrivals; SGLang protects long generations.
- **More ships in the engine repository.** A cache-aware model gateway, a PD control plane that
  always pushes KV from prefill into pages decode reserved, and an admin plane for RL weight sync
  that any client able to reach the port can call unless a key is set.
- **No current head-to-head benchmark was located.** Published comparisons are dated project or
  third-party claims with stated conditions; the dive reports them with their conditions and does
  not compute a winner.

## Section map

28 sections in the left navigation.

- Framing (1-2): Thesis & Framing, Getting Started.
- Runtime and the index (3-9): the runtime's processes, the scheduler, RadixAttention and the
  radix cache, KV memory and the defaults your GPU picks, HiCache, attention backends and kernels,
  quantization and KV precision.
- Request features (10-13): structured output, speculative decoding, APIs with LoRA adapters and
  the admin plane, SGLang as an RL rollout engine.
- Scale-out (14-18): parallelism, PD disaggregation, wide expert parallelism, the model gateway,
  multi-node and Kubernetes orchestrators.
- SGLang on AWS (19-22): SageMaker AI and HyperPod, EKS and EC2, EC2 instances and GPU-dependent
  behaviour, PD and wide EP over EFA.
- Compare, operate, decide (23-26): SGLang and vLLM compared, ecosystem and production users,
  operations and failure signatures, decision guide.
- Inside the code (27): six tabbed reading paths through the source at the tag.
- Glossary & Sources (28).

## Layout

- `SCOPE.md`: thesis, section plan, diagram inventory and the scope review notes.
- `research/2026-10/`: the claim registers (00 pin and map to 10 SGLang versus vLLM). Every
  quantitative claim in the app traces to a row there.
- `reviews/`: the scope reviews and the per-section fact checks.
- `revamp/`: the authoring brief and the tools (`tools/shoot.mjs` renders sections and
  reports diagram overlaps; `tools/gen-sources.mjs` writes `sources.md`).
- `src/`: Vite + React + TypeScript + Cloudscape app.
- `sources.md`: generated from the inline citations, grouped by tier. Regenerate with
  `node deep-dives/sglang/revamp/tools/gen-sources.mjs`.

## Build

```bash
pnpm --filter @tech-deep-dives/sglang dev
pnpm --filter @tech-deep-dives/sglang build
bash scripts/ci.sh
```
