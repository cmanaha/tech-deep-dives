# Silicon, Memory, and Modern Inference

Interactive field manual for reasoning about heterogeneous silicon and memory hierarchy in the age of LLM inference.

## Thesis

Inference is memory-bound, not FLOP-bound. To land on peak FLOPs you need three things to arrive at the functional unit at the same time: the instruction, the data, and the right data shape. Silicon has never been more heterogeneous — Graviton, EPYC, Xeon, NVIDIA Hopper/Blackwell, Trainium, Cerebras, Groq, and compute-in-memory each optimize for a different subset of that triangle.

This deep dive walks through the memory hierarchy, chiplet topology, and workload patterns that determine where each architecture wins, where it stalls, and how to reason about real multi-tenant production inference.

## Audience

Technical leads, solution architects, and capital-markets engineers who need to make architecture calls across a heterogeneous silicon landscape without taking vendor marketing at face value.

## Status

Drafted across 31 sections, with citations integrated and visual audits applied. Ongoing edits land on individual sections rather than the structure.

## Layout

Thirty-one sections in left-side navigation across eleven layers. See ADR-0001 for the rationale and revision history.

Framing (1-3): Thesis, Heterogeneity Fact, Roofline and Arithmetic Intensity.
Memory and execution (4-7): Memory Hierarchy Primer, Anatomy of a Kernel Execution, HBM and the Bandwidth Wall, DDR5 / MRDIMM / LPDDR5X / CXL.
Topology (8): Chiplet and Interconnect.
Host silicon (9-11): Graviton, AMD EPYC Turin, Intel Xeon 6 Granite Rapids.
NVIDIA silicon (12-15): Hopper, Blackwell, Grace-Blackwell and UltraServer, Edge Shared-Memory Silicon (DGX Spark and Jetson Orin Nano).
NVIDIA compiler stack (16): CUDA, CUTLASS, CuTe, Triton, cuDNN, Nsight.
AWS silicon (17): Trainium, Inferentia, Neuron.
AWS compiler stack (18): torch-neuronx, JAX on Neuron, NKI, Neuron profiler.
Alternative paradigms (19-21): Cerebras WSE-3, Groq / SambaNova / Dataflow, Compute-in-Memory (PIM / HyperCIM).
Software memory techniques (22-26): KV Cache and FlashAttention, Mixture of Experts, Small Language Models, Quantization and Precision, Disaggregated Serving and Speculative Decoding.
Fabric (27): Communication and Scale-Out.
Operational (28-29): Isolation (NIE / MIG), Determinism (NEFF / GPU reproducibility).
Applied (30-31): Capital Markets Lens, Glossary and Sources.

The edge section (15) carries Tier 0 evidence captured from a physical DGX Spark: the lstopo topology SVG rendered in-app, plus the raw lscpu / nvidia-smi / lspci bundle in `research/dgx-spark/`.

Each section carries the same invariants: TLDR, cited claims (with access date), and UNKNOWN flags for unverified numbers.

## Development

```
pnpm install
pnpm --filter @tech-deep-dives/silicon-memory-inference dev
pnpm --filter @tech-deep-dives/silicon-memory-inference build
```

Run the deterministic quality gates from the repo root:

```
pnpm gates
```

## Sources

See `sources.md` for the authoritative source list, organized by tier and section theme.
