# Silicon, Memory, and Modern Inference

Interactive field manual for reasoning about heterogeneous silicon and memory hierarchy in the age of LLM inference.

## Thesis

Inference is memory-bound, not FLOP-bound. To land on peak FLOPs you need three things to arrive at the functional unit at the same time: the instruction, the data, and the right data shape. Silicon has never been more heterogeneous — Graviton, EPYC, Xeon, NVIDIA Hopper/Blackwell, Trainium, Cerebras, Groq, and compute-in-memory each optimize for a different subset of that triangle.

This deep dive walks through the memory hierarchy, chiplet topology, and workload patterns that determine where each architecture wins, where it stalls, and how to reason about real multi-tenant production inference.

## Audience

Technical leads, solution architects, and capital-markets engineers who need to make architecture calls across a heterogeneous silicon landscape without taking vendor marketing at face value.

## Status

Scaffold. Sections are placeholders awaiting research integration from `research/stac-london-2026/`.

## Layout

Twenty-five sections in left-side navigation across eight layers. See ADR-0001 for the rationale and revision history.

Framing (1-3): Thesis, Heterogeneity Fact, Roofline and Arithmetic Intensity.
Memory (4-6): Memory Hierarchy Primer, HBM and the Bandwidth Wall, DDR5 / MRDIMM / LPDDR5X / CXL.
Topology (7): Chiplet and Interconnect.
Host silicon (8-10): Graviton, AMD EPYC Turin, Intel Xeon 6 Granite Rapids.
NVIDIA silicon (11-13): Hopper, Blackwell, Grace-Blackwell and UltraServer.
AWS silicon (14): Trainium, Inferentia, Neuron.
Alternative paradigms (15-17): Cerebras WSE-3, Groq / SambaNova / Dataflow, Compute-in-Memory (PIM / HyperCIM).
Software memory techniques (18-20): KV Cache and FlashAttention, Quantization and Precision, Disaggregated Serving and Speculative Decoding.
Fabric (21): Communication and Scale-Out.
Operational (22-23): Isolation (NIE / MIG), Determinism (NEFF / GPU reproducibility).
Applied (24-25): Capital Markets Lens, Glossary and Sources.

Each section carries the same invariants: TLDR, cited claims (with access date), UNKNOWN flags for unverified numbers, panelist-map callout, and evaluation-lens callout.

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

See `sources.md` for the authoritative source list. Research notes and extracted data live in `research/` (staged in `research/stac-london-2026/` at the repo root for the panel prep phase).
