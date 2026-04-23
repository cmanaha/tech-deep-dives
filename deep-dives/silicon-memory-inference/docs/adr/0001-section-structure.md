# ADR-0001: Section Structure and Invariants

Date: 2026-04-23
Status: Accepted (revised from 12 to 25 sections — see Revision History)

## Context

The STAC London 2026 panel "Beyond peak FLOPs: Memory and modern inference silicon" needs a deep dive that doubles as (a) a field manual Carlos reads before the panel, and (b) a reference for ongoing customer conversations about heterogeneous silicon.

## Decision

The deep dive ships twenty-five top-level sections in left-side navigation, organized into eight layers. The first scaffold used twelve sections; review showed that three of them (Host Silicon, NVIDIA GPU Silicon, Alternative Paradigms) were each carrying multiple vendors' worth of content, which blocked sourcing and rendering at the level of rigor the project demands.

### Framing layer
1. Thesis and Framing — Beyond peak FLOPs
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

### AWS silicon
14. AWS Trainium, Inferentia, and the Neuron compiler

### Alternative paradigms (one section per panelist territory)
15. Cerebras WSE-3 (Zigfrid Zvezdin territory)
16. Groq, SambaNova, and Deterministic Dataflow
17. Compute-in-Memory — PIM and HyperCIM (Tanya Mangoma territory)

### Software memory techniques
18. KV Cache and FlashAttention
19. Quantization and Precision Formats
20. Disaggregated Serving and Speculative Decoding

### Fabric and runtime
21. Communication and Scale-Out — NCCL, NIXL, EFA, NVLink

### Operational properties
22. Isolation — Nitro Isolation Engine and MIG
23. Determinism — Trainium NEFF and GPU Reproducibility

### Applied lens and reference
24. Capital Markets Lens
25. Glossary and Sources

## Section invariants

Every section ships a `SectionShell` containing:

- TLDR (bulleted, one paragraph summary at the top)
- Scope (what lives in this section — bounds the content)
- Panelist map (which panelist this topic lands on hardest and why)
- Evaluation lens (three to five questions to ask when reasoning about architectures that touch this topic)
- Status badge (scaffold / draft / reviewed)

## Consequences

- No section carries more than one vendor's story at the deepest level. Each vendor page can be sourced, fact-checked, and diagrammed independently.
- Panel preparation is more direct: for each likely question, one section owns the ground truth.
- Left-rail navigation is longer but linear; mobile collapse groups the layers cleanly.
- The `SectionShell` component enforces the pattern mechanically so drift is visible.
- Status badges let the fact-check gate see at a glance which sections still need source integration.

## Revision History

- 2026-04-23 (initial): 12 sections.
- 2026-04-23 (revised): expanded to 25 sections. Host Silicon → Graviton / EPYC / Xeon (3). NVIDIA GPU Silicon → Hopper / Blackwell / Grace-Blackwell (3). Alternative Paradigms → Cerebras / Groq+SambaNova / Compute-in-Memory (3). Inference Memory Techniques → KV Cache / Quantization / Disaggregated (3). Isolation and Determinism → Isolation / Determinism (2). Memory primer expanded to add HBM and Main-Memory+CXL as siblings. Heterogeneity Fact and Roofline added to the framing layer.

## Alternatives considered

- Twelve sections (rejected — each compound section would have exceeded the page budget and conflated vendors).
- Twenty sections by merging Trainium+Inferentia, CXL into primer, Isolation+Determinism (rejected — merging Isolation and Determinism in particular loses the three-pillar AWS story; they are distinct properties with distinct silicon mechanisms).
- Free-form sections (rejected — EFA showed that consistency matters for navigation and re-reading).
