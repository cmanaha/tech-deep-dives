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

## Section map

29 sections in the left navigation.

- Framing (1-2): Thesis & Framing, Getting Started.
- Runtime and the index (3-9): the runtime's processes, the scheduler, RadixAttention and
  the radix cache, KV memory and GPU-picked defaults, HiCache, attention backends and
  kernels, quantization and KV precision.
- Request features (10-15): structured output, speculative decoding, the API surfaces,
  LoRA, the frontend language, SGLang as an RL rollout engine.
- Scale-out (16-20): parallelism, wide expert parallelism, PD disaggregation, the model
  gateway, multi-node and Kubernetes.
- Inside the code (21): eight tabbed reading paths through the source at the tag.
- SGLang on AWS (22-24): deployment paths, EC2 instances and GPU-dependent behaviour, PD
  and wide EP over EFA.
- Compare, operate, decide (25-29): SGLang and vLLM compared, ecosystem and production
  users, operations, decision guide, glossary and sources.

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
