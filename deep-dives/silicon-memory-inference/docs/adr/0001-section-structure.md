# ADR-0001: Section Structure and Invariants

Date: 2026-04-23
Status: Accepted

## Context

The STAC London 2026 panel "Beyond peak FLOPs: Memory and modern inference silicon" needs a deep dive that doubles as (a) a field manual Carlos reads before the panel, and (b) a reference for ongoing customer conversations about heterogeneous silicon.

## Decision

The deep dive ships with twelve top-level sections, each carrying the same invariants:

1. Thesis and Framing — Beyond peak FLOPs
2. Memory Hierarchy Primer
3. Chiplet and Interconnect Topology
4. Host Silicon — Graviton, EPYC, Xeon
5. NVIDIA GPU Silicon
6. AWS Custom Silicon
7. Alternative Paradigms
8. Inference Memory Techniques
9. Communication and Scale-Out
10. Isolation and Determinism
11. Capital Markets Lens
12. Glossary and Sources

Every section ships a `SectionShell` containing:

- TLDR (bulleted, one paragraph summary at the top)
- Scope (what lives in this section — bounds the content)
- Panelist map (which panelist this topic lands on hardest and why)
- Evaluation lens (three to five questions to ask when reasoning about architectures that touch this topic)
- Status badge (scaffold / draft / reviewed)

## Consequences

- Contributors know exactly which invariants every section must carry before it graduates.
- Readers get a consistent experience — TLDR first, then detail, then "how do I use this in a customer conversation."
- The `SectionShell` component enforces the pattern mechanically so drift is visible.
- Status badges let the fact-check gate see at a glance which sections still need source integration.

## Alternatives considered

- Free-form sections (rejected — EFA showed that consistency matters for navigation and re-reading).
- Fewer sections with more subsections (rejected — left-rail navigation on mobile collapses poorly with deep nesting).
