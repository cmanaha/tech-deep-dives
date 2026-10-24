# Silicon, Memory, and Modern Inference

A field manual for predicting how an inference workload will run on a chip before you benchmark it, across CPUs, GPUs, AWS accelerators, wafer-scale and dataflow parts, and the memory tiers that feed them.

## Thesis

Every operation needs three deliveries at a functional unit: an instruction, its operands and their layout. Find the one a workload waits on, then read each chip for how it makes that delivery. For decode, the phase that generates each output token, the binding delivery is operand data, so memory bandwidth is the first number to read on a spec sheet and peak FLOPS the second. The Thesis section works this through for one chip (the ridge point of an H200 against the arithmetic intensity of batch-1 decode), with the figures cited in the app.

The rest of the dive applies that test tier by tier, from registers to NVMe flash, and chip by chip, from Graviton to Cerebras.

## Audience

Technical leads, solution architects and capital-markets engineers who make architecture calls across heterogeneous silicon and need to tell a specification from a vendor claim from a measurement.

## Layout

Thirty-three sections in the left navigation, in reading order:

- Framing (1-3): Thesis and Framing; The Heterogeneity Fact; Roofline and Arithmetic Intensity.
- Memory and execution (4-9): Memory Hierarchy Primer; Anatomy of a Kernel Execution; HBM and the Bandwidth Wall; DDR5, MRDIMM, LPDDR5X and CXL; High Bandwidth Flash; Flash as a Cache Tier for Inference.
- Topology (10): Chiplet and Interconnect.
- Host silicon (11-13): Graviton Deep Dive; AMD EPYC Turin; Intel Xeon 6.
- NVIDIA silicon (14-17): Hopper (H100 and H200); Blackwell (B200 and B300); Grace-Blackwell and UltraServer; Edge Shared-Memory Silicon (DGX Spark and Jetson).
- NVIDIA compiler stack (18): NVIDIA Compilers and Kernel Tooling.
- AWS silicon and compiler stack (19-20): AWS Trainium, Inferentia and Neuron; AWS Compilers and Kernel Tooling.
- Alternative architectures (21-23): Cerebras Wafer-Scale; Groq, SambaNova and Dataflow; Compute-in-Memory.
- Software memory techniques (24-28): KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Small Language Models; Quantization and Precision; Disaggregated Serving and Speculative Decoding.
- Fabric (29): Communication and Scale-Out.
- Operational (30-31): Isolation (NIE and MIG); Determinism (NEFF and GPU reproducibility).
- Applied and reference (32-33): Capital Markets Lens; Glossary and Sources.

Cross-references in the prose use section names, so the numbering can change without breaking them. See `docs/adr/0001-section-structure.md` for the structure and its revision history.

## Evidence

Every quantitative claim carries an inline citation with its source tier and access date, and a kind label where the number is not a plain specification: vendor claim, roadmap, measured, simulated or derived (our arithmetic, with the working shown in the citation note). GitHub citations are pinned to a tag or commit.

- Tier 0: our own captures. The Edge section renders an lstopo topology of a physical DGX Spark; the raw lscpu, lstopo and nvidia-smi captures are in `research/dgx-spark/`, with the lspci readings logged in its `NOTES.md`.
- Tier 1: specifications, official documentation, filings and pinned source code.
- Tier 2: vendor blogs, product pages, technical reports and conference talks.
- Tier 3: third-party measurements, academic papers and trade press.

The October 2026 refresh checked every section against sources accessed between 2026-10-16 and 2026-10-18. Its claim registers are in `research/2026-10-refresh/`, the per-section authoring reports in `revamp/authoring/`, and the adversarial fact checks in `revamp/verification/`.

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

`sources.md` lists every cited source by tier, with the sections that cite it. It is generated from the citation records in `src/sources/` by the test suite, so it always matches the app.
