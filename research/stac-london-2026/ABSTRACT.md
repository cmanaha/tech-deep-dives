# STAC London 2026 — Panel Brief

## Title
Beyond peak FLOPs: Memory and modern inference silicon

## Panelists
- Zigfrid Zvezdin — Solution Architect, Cerebras (wafer-scale SRAM, memory-wall bypass via on-die memory)
- Carlos Rueda Manzanedo — AWS (multi-silicon portfolio: GPU, Trainium, Inferentia, Graviton)
- Tanya Mangoma — HyperCIM (processing-in-memory / compute-in-memory architectures)

## Abstract
As AI models scale in parameter count, context length, and token throughput, inference performance is increasingly bound not by FLOPs, but by memory bandwidth, capacity locality, and data movement overheads. Memory architecture has therefore become a first-order determinant of latency, determinism, and energy efficiency in production inference systems.

Modern AI accelerators — spanning data-center GPUs, FPGAs, domain-specific ASICs, and emerging processing-in-memory (PIM) designs — are architected around deep, explicitly managed memory hierarchies.

The central architectural question is shifting from "Which chip has the most FLOPs?" to "How is memory orchestrated across the stack — from compiler to silicon — to control latency variance and cost per inference?"

For latency-sensitive capital markets workloads where microseconds matter, these design choices directly influence latency, jitter, power envelopes, and ultimately deployment feasibility.

## Audience Context
STAC = Securities Technology Analysis Center. The audience is capital markets tech leads — trading infra, risk, market data. They care disproportionately about:
- Tail latency / jitter (p99.9, p99.99 — not mean)
- Determinism (same input → same latency, every time)
- Power envelope (colocation cost, rack density)
- Cost per inference (not raw throughput)
- Operational maturity (can this run reliably for years?)

## Carlos's Angle
As the AWS panelist, differentiate from Cerebras (single-architecture purist) and HyperCIM (emerging PIM). Position AWS as the memory-orchestration portfolio: every memory architecture exists in the portfolio, the question is matching workload to silicon. Make this concrete with:
- Graviton4/5: host-side inference + vector DB serving, DDR5 bandwidth story
- Trainium2/3: on-chip SRAM + HBM, software-managed scratchpads, NeuronLink
- Inferentia2: latency-optimized, on-chip SRAM for small-model low-latency inference
- NVIDIA P5/P5e/P5en/P6: HBM3/HBM3e bandwidth evolution, NVLink memory fabric
- Cross-cutting: disaggregated prefill/decode, NIXL KV-cache streaming, EFA
