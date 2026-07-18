# ADR-0001: Section Structure and Invariants

Date: 2026-04-23
Status: Accepted (revised from 12 → 25 → 27 sections — see Revision History)

## Context

The "Silicon, Memory, and Modern Inference" deep dive is a field manual for the heterogeneous-silicon and memory-bandwidth-vs-FLOPs tradeoff conversation in capital-markets inference. It needs to work as both (a) a reference Carlos can read end-to-end to keep architectural reasoning current, and (b) a per-section anchor for ongoing customer conversations across the silicon landscape.

## Decision

The deep dive ships twenty-five top-level sections in left-side navigation, organized into eight layers. The first scaffold used twelve sections; review showed that three of them (Host Silicon, NVIDIA GPU Silicon, Alternative Paradigms) were each carrying multiple vendors' worth of content, which blocked sourcing and rendering at the level of rigor the project demands.

### Framing layer
1. Thesis and Framing — Memory bandwidth vs peak FLOPs
2. The Heterogeneity Fact — instruction, data, shape must land together
3. Roofline, Arithmetic Intensity, and the Ridge Point

### Memory layer
4. Memory Hierarchy Primer — the seven tiers
5. HBM and the Bandwidth Wall
6. DDR5, MRDIMM, LPDDR5X, and CXL

### Topology layer
7. Chiplet and Interconnect Topology

### Host silicon (one section per vendor)
8. Graviton Deep Dive
9. AMD EPYC Turin
10. Intel Xeon 6 Granite Rapids

### NVIDIA silicon (one section per generation)
11. NVIDIA Hopper — H100 and H200
12. NVIDIA Blackwell — B200 and B300
13. Grace-Blackwell Superchip and UltraServer

### NVIDIA compiler and kernel tooling stack
14. NVIDIA Compilers and Kernel Tooling — CUDA, CUTLASS, CuTe, Triton, cuDNN, Nsight

### AWS silicon
15. AWS Trainium, Inferentia, and the Neuron compiler

### AWS compiler and kernel tooling stack
16. AWS Compilers and Kernel Tooling — torch-neuronx, JAX on Neuron, NKI, Neuron profiler

### Alternative paradigms (one section per architecture)
17. Cerebras WSE-3
18. Groq, SambaNova, and Deterministic Dataflow
19. Compute-in-Memory — PIM and HyperCIM

### Software memory techniques
20. KV Cache and FlashAttention
21. Quantization and Precision Formats
22. Disaggregated Serving and Speculative Decoding

### Fabric and runtime
23. Communication and Scale-Out — NCCL, NIXL, EFA, NVLink

### Operational properties
24. Isolation — Nitro Isolation Engine and MIG
25. Determinism — Trainium NEFF and GPU Reproducibility

### Applied lens and reference
26. Capital Markets Lens
27. Glossary and Sources

## Section invariants

Every section ships:

- TLDR (bulleted, one paragraph summary at the top)
- Cited claims with inline links and access dates
- UNKNOWN flags for anything not yet traceable to a Tier 1 source
- Evaluation lens (three to five questions to ask when reasoning about architectures that touch this topic)

## Consequences

- No section carries more than one vendor's story at the deepest level. Each vendor page can be sourced, fact-checked, and diagrammed independently.
- For each customer-facing question about heterogeneous silicon, one section owns the ground truth.
- Left-rail navigation is longer but linear; mobile collapse groups the layers cleanly.
- The fact-check register in `sources.md` can grade each section by tier coverage at a glance.

## Revision History

- 2026-04-23 (initial): 12 sections.
- 2026-04-23 (revised): expanded to 25 sections. Host Silicon → Graviton / EPYC / Xeon (3). NVIDIA GPU Silicon → Hopper / Blackwell / Grace-Blackwell (3). Alternative Paradigms → Cerebras / Groq+SambaNova / Compute-in-Memory (3). Inference Memory Techniques → KV Cache / Quantization / Disaggregated (3). Isolation and Determinism → Isolation / Determinism (2). Memory primer expanded to add HBM and Main-Memory+CXL as siblings. Heterogeneity Fact and Roofline added to the framing layer.
- 2026-04-23 (revised again): expanded to 27 sections. Added NVIDIA Compilers and Kernel Tooling (14) — CUDA, CUTLASS, CuTe, Triton, cuDNN, Nsight — and AWS Compilers and Kernel Tooling (16) — torch-neuronx, JAX on Neuron, NKI (Neuron Kernel Interface), Neuron profiler. Rationale: the compiler and kernel-DSL layer is how silicon peak becomes realized throughput; omitting it would have forced those details to clutter the hardware sections. Sourcing policy in sources.md tightened to require Tier 1 vendor documentation for all compiler and tooling claims — academic papers demoted to context.
- Retroactive record (written 2026-07-18): between the 27-section revision and 2026-07 the app grew to 30 sections — Anatomy of a Kernel Execution (inserted at 5), Mixture of Experts and Sparse Activation, and Small Language Models (inserted into the software-techniques layer). These insertions were not recorded here at the time, and in-prose cross-references ("Section N") across many sections were not renumbered, leaving references stale by one or two positions depending on which era each section was written in.
- 2026-07-18: expanded to 31 sections. Added Edge Shared-Memory Silicon — DGX Spark and Jetson Orin Nano (inserted at 15, after Grace-Blackwell); sections 15-30 renumbered to 16-31. Rationale: DGX Spark (GB10) is the Grace-Blackwell NVLink-C2C unified-memory architecture at desk scale, and Jetson Orin Nano is the single-SoC shared-DRAM variant at edge scale; together they close the memory continuum (NVL72 rack, desk, edge) that the deep dive reasons over. The section carries Tier 0 evidence captured from a physical DGX Spark (lstopo topology SVG plus lscpu/nvidia-smi/lspci bundle in research/dgx-spark/). As part of the renumber, ALL in-prose cross-references were audited topic-by-topic and repaired, fixing both this insertion's shift and the pre-existing drift noted above.

## Alternatives considered

- Twelve sections (rejected — each compound section would have exceeded the page budget and conflated vendors).
- Twenty sections by merging Trainium+Inferentia, CXL into primer, Isolation+Determinism (rejected — merging Isolation and Determinism in particular loses the three-pillar AWS story; they are distinct properties with distinct silicon mechanisms).
- Free-form sections (rejected — EFA showed that consistency matters for navigation and re-reading).
