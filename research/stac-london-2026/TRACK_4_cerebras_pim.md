# Track 4 — Cerebras, SRAM-Heavy Chips, and Processing-in-Memory

**Panel:** Beyond peak FLOPs: Memory and modern inference silicon — STAC London, April 29 2026
**Audience:** Capital markets technology leads (latency, jitter, determinism, power envelope)
**Panel thesis:** Memory bandwidth, locality, and data movement have replaced FLOPs as the inference bottleneck
**Researched:** 2026-04-21
**Track focus:** Non-GPU memory-radical architectures

---

## Co-Panelist Profiles

### Zigfrid Zvezdin — Cerebras

[VERIFIED] GitHub profile (@ZiggerZZ) identifies Zigfrid Zvezdin as a graduate of MIPT (Moscow Institute of Physics and Technology) and Ecole Polytechnique with interests in NLP and deep learning. (Source: [ZiggerZZ GitHub](https://github.com/ZiggerZZ), accessed 2026-04-21)

[UNKNOWN] Specific job title and role at Cerebras — LinkedIn profile for Zvezdak in London exists but requires authentication to read. Could not verify "Solutions Architect" title. (Searched: "Zigfrid Zvezdin Cerebras solutions architect engineer profile". LinkedIn: [zvezdak](https://www.linkedin.com/in/zvezdak/), not readable without login, accessed 2026-04-21)

[UNKNOWN] STAC London 2026 agenda does not list specific speaker names per session in the publicly accessible version. The STAC Summit London event page (April 29, 2026, Convene, 200 Aldersgate) confirms the event exists and lists "inference performance and cost" as a topic but does not expose per-panel speaker assignments. (Source: [STAC Summit London](https://stacresearch.com/events/spring2026lon/), accessed 2026-04-21)

### Tanya Mangoma — HyperCIM

[VERIFIED] Dr. Tanyaradzwa N. Mangoma is CEO of HyperCIM Ltd, a London-based semiconductor startup incorporated December 29, 2023. (Source: [BritChips Podcast / Substack](https://anttheantidote.substack.com/p/britchips-podcast-tanya-mangoma-child), accessed 2026-04-21)

[VERIFIED] Academic background: Integrated Master's in Materials Science and Engineering, University of Manchester, 2017. PhD at the Centre for Doctoral Training in Ultra Precision Engineering, University of Cambridge, from October 2017. Research focus: piezoelectric materials characterization. (Source: [Cambridge CDT-UP profile](https://www.cdt-up.eng.cam.ac.uk/directory/tanya-mangoma), accessed 2026-04-21)

[SPECULATIVE] The pivot from piezoelectric materials / ultra-precision engineering to compute-in-memory silicon suggests HyperCIM's approach may lean on materials-level understanding of memory physics — a credible path to CIM innovation but not confirmed in public filings.

---

## Section 1 — Cerebras Wafer-Scale (Deep Dive)

### 1.1 The Wafer-Scale Principle

Conventional chip manufacturing dices a 300mm silicon wafer into ~500-600 individual die of ~300-500 mm² each, separated along streets. Cerebras discards this: the entire wafer becomes one processor. At ~46,225 mm², the WSE-3 is ~56x larger than an NVIDIA H100 die (~814 mm²).

The architectural consequence: instead of needing off-chip buses or HBM stacks to connect compute to memory, all SRAM sits adjacent to all compute cores, connected by an on-die mesh. The result is a memory bandwidth figure measured in petabytes per second — not the terabytes per second of GPU HBM.

Defect tolerance: individual cores occupy ~0.05 mm². Defective cores are disabled at test; the on-chip 2D mesh fabric routes around them. Redundant cores provide yield insurance.

### 1.2 WSE Generation Comparison

| Parameter | WSE-1 | WSE-2 | WSE-3 |
|-----------|-------|-------|-------|
| Process node | TSMC 16nm | TSMC 7nm | TSMC 5nm |
| Die area | 46,225 mm² | 46,225 mm² | 46,225 mm² |
| Transistors | 1.2 trillion | 2.6 trillion | 4 trillion |
| AI cores | 400,000 | 850,000 | 900,000 |
| On-chip SRAM | 18 GB | 40 GB | 44 GB |
| On-chip SRAM bandwidth | ~9 PB/s | 20 PB/s | 21 PB/s |
| Fabric bandwidth | 100 Pb/s | 220 Pb/s | [UNKNOWN — not published for WSE-3] |
| System | CS-1 | CS-2 | CS-3 |
| System power | ~15 kW | ~15 kW | ~23 kW |
| System form factor | 15U | 15U | 15U |
| Peak compute (FP16) | [not published] | [not published] | 125 PetaFLOPs |

**Architecture detail — core tile:** Each tile has 48 KB of private single-cycle-latency SRAM, a 5-port router (N/S/E/W/local), and an 8-wide FP16 SIMD math unit (WSE-3, up from 4-wide on WSE-1/2). Per-hop mesh latency: approximately 1 ns.

**WSE-3 vs NVIDIA B200:** Cerebras claims 19x more transistors and 28x more compute than the B200.

**WSE-4:** [UNKNOWN] No official announcement as of 2026-04-21.

### 1.3 CS-2 and CS-3 System Specifications

| Parameter | CS-2 | CS-3 |
|-----------|------|------|
| Processor | WSE-2 | WSE-3 |
| Form factor | 15U rack unit | 15U rack unit |
| Power | ~15 kW | ~23 kW |
| Cooling | Proprietary liquid (water) | Proprietary liquid (water) |
| I/O | 12 × 100 GbE (1.2 Tb/s) | Enhanced (30% more than CS-2) |
| Core count increase | — | +20% vs CS-2 |
| Max cluster nodes | 192 CS-2 systems | 2,048 CS-3 systems |
| Max cluster compute | [scales with node count] | 256 ExaFLOPs (2,048 nodes) |
| On-chip SRAM | 40 GB | 44 GB |
| External memory (MemoryX) | 4 TB – 2.4 PB | Enterprise: 24–36 TB; Hyperscaler: 120–1,200 TB |

### 1.4 MemoryX — External Weight Storage

MemoryX is Cerebras's off-chip weight repository. It is not "off-chip memory" in the GPU HBM sense — it is a separate external appliance.

- **Storage medium:** DDR5 DRAM and Flash (hybrid). Not HBM.
- **Capacity range:** 4 TB to 2.4 PB per system, configurable.
- **Enterprise configs:** 24 TB and 36 TB.
- **Hyperscaler configs:** 120 TB and 1,200 TB.
- **Model size support:** 200 billion to 120 trillion parameters.
- **Function:** Holds model weights. Streams weights layer-by-layer to the WSE during forward pass. On backward pass, gradients stream back for weight update in MemoryX.
- **Scheduling intelligence:** MemoryX contains scheduling logic to prevent weight dependency bottlenecks — it knows which layer the WSE is currently computing and pre-fetches the next layer's weights.
- **The on-chip SRAM role:** With MemoryX, the 44 GB of on-chip SRAM functions as a working buffer for current-layer activations and intermediate results, not the weight store. Weights live in MemoryX; activations live on-die.

**Capital markets implication:** MemoryX introduces an external data movement dependency for models that do not fit on-chip. Weight streaming means there IS off-chip traffic — Cerebras's bandwidth claim of "21 PB/s" refers to on-die SRAM bandwidth, not the bandwidth to MemoryX. Understand this distinction before the panel.

### 1.5 SwarmX — Multi-Node Cluster Fabric

- **Topology:** Tree (not a mesh like NVLink or a fat-tree like InfiniBand).
- **Function:** Broadcasts weights from MemoryX to all CS nodes in the cluster simultaneously; aggregates (sums) gradients in the reverse direction.
- **Scaling:** Near-linear — 10 CS-3 nodes perform ~10x faster than 1. CS-3 supports up to 2,048 nodes.
- **Abstraction:** The entire cluster programs as a single logical chip. No distributed training programming primitives (no data-parallel, no pipeline-parallel code) required.
- **Contrast with GPU clusters:** GPU clusters require NCCL or custom collective communication libraries. Cerebras makes this transparent.

**Adversarial note:** SwarmX and MemoryX solve the "model doesn't fit on WSE" problem. But they do it by reintroducing off-chip data movement — the very thing Cerebras markets against. Know this going in.

### 1.6 Programming Model — Weight Streaming vs. Fully-Local

**Weight Streaming mode:**
- Weights stored in MemoryX; streamed to WSE per-layer during inference/training.
- Enables models of any size (up to 120T parameters with MemoryX maxed).
- The on-die SRAM holds activations and intermediate results only.
- Introduces a bounded streaming bandwidth between MemoryX and WSE.
- Default mode for large models (GPT-3 scale and up).

**Fully-Local mode (Layer Pipelined):**
- All model weights must fit in the 44 GB of on-chip SRAM.
- Zero external memory traffic during inference.
- Achieves maximum determinism and minimum jitter — no external bus, no HBM, no PCIe.
- Models up to ~20B parameters (at FP16/BF16 precision) can fit fully on-chip.
- This is the mode that validates the "zero memory wall" marketing claim.

**For capital markets:** Fully-local mode on models <=20B parameters is where the determinism story is airtight. For larger models via weight streaming, the latency distribution widens slightly due to MemoryX read scheduling. Ask Zigfrid which mode Cerebras Inference uses for production deployments.

### 1.7 Cerebras Inference — The Cloud Product

- **Launched:** August 27, 2024.
- **API:** OpenAI-compatible (drop-in replacement).
- **Infrastructure:** Condor Galaxy supercomputer network (built with G42 partner). Condor Galaxy 1 (July 2023) and Condor Galaxy 2 (November 2023), ~$100M each. Six additional datacenters across North America and Europe announced in 2025, expanding capacity 20x.
- **AWS Marketplace:** Cerebras Inference Cloud available in AWS Marketplace (announced July 2025, RAISE Summit Paris).
- **Notable customers:** Mistral (Le Chat), Perplexity, AlphaSense (financial intelligence).
- **Reasoning speed:** Qwen3-32B reasoning in 1.2 seconds on Cerebras, vs. ~60-90 seconds on GPU-based competitors.

### 1.8 Inference Benchmarks — Llama 70B and 405B

| Model | Cerebras tokens/s | vs. GPU-cloud | Notes |
|-------|-------------------|---------------|-------|
| Llama 3.1 8B | 1,800+ at launch | ~20x faster | Aug 2024 |
| Llama 3.1 70B (launch) | 450 tokens/s | ~20x faster | Aug 2024 |
| Llama 3.1 70B (updated) | 2,100 tokens/s | Faster than GPU Llama 3B at 8x speed | Post-launch 3x improvement |
| DeepSeek-R1-Distill-Llama-70B | 1,500+ tokens/s | 57x faster than GPU | Jan 2025 |
| Llama 3.1 405B (1K prompt) | 969 tokens/s | 75x faster than AWS | World record at time |
| Llama 3.1 405B (100K prompt) | 539 tokens/s | 44x faster than AWS | 128K full context, 16-bit |
| GPT-OSS-120B | 3,000 tokens/s | — | Early 2026 |
| Llama 4 Scout | 2,000+ tokens/s | — | Early 2026 |
| Time-to-first-token (405B) | 240 ms | Nearly fastest worldwide | — |

Pricing: $6/M input tokens, $12/M output tokens for Llama 405B — claimed 20% lower than AWS, Azure, GCP.

**Third-party validation:** Artificial Analysis (independent benchmark firm) confirmed Cerebras up to 75x faster than GPU-based hyperscaler offerings on Llama 405B.

### 1.9 Determinism and Jitter Story

The determinism argument rests on two structural properties:

1. **No cache hierarchy:** Every core has single-cycle SRAM access. There are no L1/L2/L3 caches with variable hit/miss behavior. Latency to any weight or activation is a fixed 1-clock-cycle read from the adjacent SRAM bank — not a probabilistic cache lookup.

2. **No HBM contention:** GPU inference jitter often arises from HBM bus contention, DRAM refresh cycles (tREFI pauses), or multi-tenant memory pressure. The WSE has none of these. In fully-local mode, the latency profile is deterministic by construction.

[UNKNOWN] Cerebras has not published a formal tail-latency distribution or P99/P999 jitter specification for Cerebras Inference. The determinism claim is structural-architectural but no published percentile latency data was found.

**Capital markets implication:** For trading risk models running on WSE in fully-local mode, the jitter floor is bounded by the 2D mesh hop latency (~1 ns per hop) and the compute per core, not by memory bus variability. This is a genuinely differentiated claim worth pressure-testing on the panel.

---

## Section 2 — Other SRAM-Heavy Inference Silicon

### 2.1 Groq LPU (Language Processing Unit)

**Founding context:** Groq was founded in 2016 by ex-Google TPU engineers.

**NVIDIA licensing deal (Dec 2025):** NVIDIA paid $20 billion for a technology licensing deal with Groq (announced Christmas Eve 2025). This is a licensing deal, NOT an acquisition — Groq continues as an independent company with a new CEO. NVIDIA gained the right to use Groq's LPU architecture in future products. Groq's LPU technology is now being integrated into NVIDIA chips (debuted at GTC March 2026).

**Architecture — the SRAM-only design:**

| Parameter | GroqChip 1 (TSP) |
|-----------|------------------|
| Process node | GlobalFoundries 14nm |
| Die size | ~725 mm² |
| On-chip SRAM | **230 MB** |
| External DRAM | None |
| Peak compute (INT8) | 750 TOPS |
| Peak compute (FP16) | 188 TFLOPS |
| On-chip bandwidth | 80 TB/s |
| Execution model | Statically scheduled VLIW |
| Compiler | GroqFlow (MLIR-based) |
| Energy per bit (SRAM vs HBM) | 0.3 pJ/bit vs 6 pJ/bit (GPU HBM) — ~20x more efficient |
| Typical power | ~300W TDP |

**The determinism mechanism:** Groq's compiler resolves all scheduling at compile time. No branch predictors. No cache managers. The hardware executes the same number of clock cycles for every inference, regardless of load.

**Plesiosynchronous protocol:** Multi-chip communication protocol that cancels clock drift and aligns hundreds of LPUs to act as a single logical core. The compiler predicts exactly when data arrives between chips.

**Scaling architecture:** 230 MB per chip is insufficient for any useful LLM. Groq uses chip-to-chip tensor parallelism:
- **GroqNode:** 8 chips, ~1.76 GB global SRAM, 1.5 PetaFLOPs.
- **GroqRack:** 9 servers × 8 chips = 72 chips, ~14 GB global SRAM, 12 PetaFLOPs.
- Mixtral model: 576 chips required.

**Benchmark performance:**

| Model | Groq tokens/s | vs. GPU (H100) |
|-------|---------------|----------------|
| Llama 2 70B | 300 tokens/s | ~10x faster |
| Llama 3 8B | 1,300+ tokens/s | ~13x faster vs H100 |
| Llama 3 70B | ~800 tokens/s | ~14x faster vs A100 |

**TruePoint precision:** To maximize 230 MB of SRAM space, Groq stores weights in INT8/FP8 but accumulates in FP32 for sensitive operations (attention logits).

**Capital markets angle:** Groq explicitly targets financial services for deterministic inference. The TPU heritage (founders include ex-Google TPU lead) gives the architecture credibility. The NVIDIA licensing deal adds complexity to Groq's independence story, though Groq continues as an entity.

### 2.2 SambaNova SN40L — Three-Tier Memory Architecture

SambaNova's Reconfigurable Dataflow Unit (RDU) is architecturally distinct from both GPU and wafer-scale designs. It explicitly addresses the memory wall with a three-tier hierarchy:

| Memory Tier | Type | Capacity | Role |
|-------------|------|----------|------|
| Tier 1 | On-chip SRAM | 520 MB | High-bandwidth working memory; enables operator fusion |
| Tier 2 | HBM3 | 64 GB (co-packaged) | Active model cache; software-managed; >1 TB/s bandwidth |
| Tier 3 | DDR5 DRAM | Up to 1.5 TB | Model parameter reservoir; slower but high capacity |

**Chip specs:**
- Process: TSMC 5nm, dual-die (CoWoS-S), each die ~600 mm²
- Transistors: 102 billion total (dual die)
- Peak compute: 638-640 BF16 TFLOPs per socket
- Compute units: 1,040 Pattern Compute Units (PCUs) + 1,040 Pattern Memory Units (PMUs)
- On-chip SRAM bandwidth: hundreds of TB/s (distributed, per-PCU access)

**The Composition of Experts (CoE) trick:** SambaNova runs Samba-CoE — 150 × 7B expert models in a trillion-parameter system — by keeping the active expert in HBM tier 2 and using DDR5 tier 3 for the rest. This is fundamentally a software-managed memory hierarchy, not unlike Cerebras's MemoryX but integrated on a single package.

**Performance vs. GPU:** 8-socket RDU node achieves 3.7x speedup over DGX H100 and 6.6x over DGX A100 for CoE inference. Llama 3.1 70B at 461 tokens/s; Llama 3.1 405B at 132 tokens/s (both BF16, no quantization).

**Cerebras called it out explicitly:** Cerebras Inference marketing cites being "8x faster than SambaNova" on Llama 405B.

### 2.3 Tenstorrent Wormhole and Blackhole

**Architecture philosophy:** Open (RISC-V), Ethernet-based scale-out (no proprietary NVLink-equivalent), standalone AI computer design.

| Parameter | Grayskull (2021) | Wormhole (2022) | Blackhole (2024) |
|-----------|------------------|-----------------|------------------|
| Process | 12nm | 12nm | 6nm |
| Tensix cores | 120 | 80 | 140 |
| External memory | LPDDR4 (100 GB/s) | GDDR6 (336 GB/s) | GDDR6 (512 GB/s) |
| GDDR6 capacity | — | 24 GB | 32 GB |
| On-chip SRAM | — | ~104 MB (80×1.3 MB/core) | 210 MB (140×1.5 MB/core) |
| RISC-V cores | Baby only | Baby only | 16 big + 752 baby |
| Ethernet | — | 16×100 GbE | 10×400 GbE |
| Scale-out node | — | n300: 2 chips | Blackhole Galaxy: 32 chips |
| Peak compute (FP8) | 276 TOPS | 328 TOPS | 745 TOPS |

**The standalone design:** Blackhole's 16 SiFive Intelligence x280 RISC-V cores can boot Linux and run device drivers without an external host CPU. This is architecturally unique — Blackhole is a peer, not a PCIe peripheral.

**Memory approach:** Each Tensix core's 1.5 MB local SRAM operates as a software-managed scratchpad — no cache hierarchy. Kernels explicitly move data in and out via DMA primitives. Bandwidth: 512 GB/s total from GDDR6 (across 24 controllers) plus on-chip SRAM bandwidth.

**Blackhole Galaxy:** 32 Blackhole chips in a 4×8 mesh, ~23.8 PetaFLOPs FP8, 1 TB GDDR6 at 16 TB/s aggregate.

**Software maturity caveat:** As of late 2025, Blackhole ran models optimized for Wormhole kernels (forward-compatible but underperforming). Software stack improvements were shipping daily on GitHub.

### 2.4 Graphcore IPU — Colossus GC200

**Status note:** Graphcore was acquired by SoftBank in 2023. The IPU product line is relevant as a historical SRAM-radical design and reference point, though commercial momentum has slowed.

| Parameter | Colossus MK2 GC200 |
|-----------|---------------------|
| Process | TSMC 7nm |
| Die size | 823 mm² |
| Transistors | 59.4 billion |
| Tiles (cores) | 1,472 |
| SRAM per tile | 624 KB |
| Total in-processor SRAM | ~900 MB |
| On-chip SRAM bandwidth | 47.5 TB/s |
| On-chip fabric bandwidth | 2.8 Tb/s |
| Peak compute (FP16) | 250 TFLOPS |
| External DRAM | Via separate Streaming Memory |
| System (M2000) | 4× GC200, 1 PetaFLOP, 3.6 GB in-processor memory, 256 GB Streaming Memory |

**Memory model:** SRAM per tile owns its address space exclusively. Tiles cannot load/store from other tiles' memory directly — all inter-tile communication is via explicit message passing over the on-chip fabric. This is a bulk-synchronous parallel (BSP) execution model, not a shared-memory model. Requires rewriting ML frameworks.

**Key distinction from Cerebras:** GC200 has 900 MB SRAM vs. WSE-3's 44 GB — roughly 50x less. The wafer-scale approach gives Cerebras a decisive SRAM capacity advantage.

### 2.5 Mythic AMP — Analog Compute-in-Memory (Flash)

Mythic represents true analog compute-in-memory for edge inference (not data center). It is the industrial reference for CIM-A (compute-in-memory array) design.

**Mechanism:** Flash memory cells act as resistors. An input voltage applied to a row produces a current proportional to V × G (conductance ∝ stored weight). Currents are summed down a column = dot product. An ADC converts the analog result back to digital. This happens across thousands of cells in parallel, in a single clock cycle.

**Chips:**
- **M1076:** 76 AMP tiles, 25 TOPS, up to 80M weight parameters, no external DRAM/SRAM. 40nm process.
- **M1108:** 108 AMP tiles, 35 TOPS, ~4W power. Each tile: 1024×1024 flash array (1 MiB/tile), RISC-V nano-processor, SIMD vector engine, ADCs. PCIe card (16 chips): 400 TOPS at ~75W.

**Key limitation for capital markets data center inference:** Edge-only targeting, 40nm process, analog precision (~8-9 effective bits), no FP32 support. Not relevant for LLM inference at scale.

**Why it matters for the panel:** Mythic is the proof-of-concept that analog CIM works commercially. HyperCIM's LPU is architecturally adjacent to this class. Understanding Mythic's precision and power tradeoffs illuminates what HyperCIM likely faces.

---

## Section 3 — Processing-in-Memory (PIM) / Compute-in-Memory (CIM)

### 3.1 Taxonomy: Near-Memory vs. In-Memory Compute

This distinction is frequently confused in marketing materials. The research-grade definition:

| Term | Precise Definition | Examples |
|------|-------------------|----------|
| **Compute-Outside-Memory (COM)** | Von Neumann: computation in CPU/GPU cores, data fetched from separate memory | All CPUs, GPUs, TPUs |
| **Compute-Near-Memory (CNM) / Near-Memory Computing (NMC)** | Dedicated logic physically close to memory (e.g., same package or die), but compute and memory are separate circuits | UPMEM DPUs, Samsung HBM-PIM, HBM Logic Die |
| **Compute-In-Memory — Peripheral (CIM-P)** | Operations in memory peripheral circuitry (e.g., crossbar + ADC), not inside the memory array itself | Many analog CIM designs, Mythic (borderline) |
| **Compute-In-Memory — Array (CIM-A) / True CIM** | Computation using memory cell physics directly (bit lines, Ohm's law). Data is never "moved" — computation happens where it is stored | Memristor crossbars, SRAM-CIM research chips, Mythic flash arrays |
| **Processing-Using-Memory (PuM)** | Exploits DRAM electrical properties for bulk bitwise ops (AND, OR, copy) without ALUs | Ambit (DRAM bulk AND/OR), RowClone |

**The key insight for the panel:** "Processing-in-Memory" (PIM) as used by Samsung, SK hynix, and UPMEM is technically **near-memory computing** — compute units sit adjacent to memory arrays, but they do not compute inside the array. True analog CIM (Mythic, HyperCIM claims) computes inside the array. The performance and power profiles differ substantially.

### 3.2 The Memory Wall Problem PIM Solves

The fundamental physics: moving data from DRAM to a CPU/GPU compute core costs ~50-100x more energy than the arithmetic operation itself. For a matrix-vector multiply:
- The FLOP costs ~0.1 pJ
- The DRAM read costs ~20-100 pJ per access
- HBM bandwidth (H100): ~3.35 TB/s. Required bandwidth for 70B parameter model at FP16: 140 GB. At 3.35 TB/s, one pass through all weights takes ~42 ms.
- Cerebras on-die SRAM at 21 PB/s: same 140 GB = ~7 microseconds.

PIM's answer: instead of moving 140 GB of weights to the compute core, move the (tiny) input vector to where the weights already live, and compute there. Data movement drops from O(model size) to O(activation size).

### 3.3 Samsung HBM-PIM / Aquabolt-XL

Samsung introduced the first HBM-PIM in February 2021, integrated into the HBM2 Aquabolt stack.

**Architecture:** Each HBM2 bank contains a Programmable Computing Unit (PCU) — a bank-level SIMD unit with FP16 adder and multiplier. During PIM mode, all banks respond to a standard DRAM column command and execute a SIMD op in lock-step.

| Parameter | Aquabolt-XL (HBM2-PIM) |
|-----------|------------------------|
| Base memory | HBM2 Aquabolt |
| PIM bandwidth (off-chip) | 1.23 TB/s |
| PIM bandwidth (on-chip/internal) | 4.92 TB/s |
| FPU per bank | 16 SIMD FP16 units |
| Compatibility | Drop-in replacement for HBM2 |
| Software | TensorFlow/PyTorch — unmodified source code |
| Speedup (GEMV microkernel) | 8.9x |
| Speedup (speech recognition) | 3.5x |
| Energy reduction | >60% |

**Key limitation:** Memory bandwidth multiplier of ~4x over standard HBM2 off-chip bandwidth, but the PCU units are simple SIMD FP16 — no general-purpose compute, no activation functions beyond basic ops (without firmware extension). Not a general accelerator.

**Expanded PIM roadmap:** Samsung plans HBM3-PIM, LPDDR5-PIM (mobile), GDDR6-PIM, and DDR5-PIM variants. Samsung and SK hynix announced collaboration to standardize LPDDR6-PIM (December 2024).

### 3.4 SK hynix AiM — GDDR6-Based PIM

| Parameter | GDDR6-AiM |
|-----------|-----------|
| Base memory | GDDR6 (16 Gbps/pin) |
| Process | 1y nm |
| Capacity | 8 Gb per chip |
| Operating voltage | 1.25V (vs. 1.35V standard) |
| Peak compute | 1 TFLOPS (MAC ops) |
| Speedup vs. CPU | Up to 16x |
| Power reduction | ~80% |

**AiMX accelerator card:** Multiple GDDR6-AiM chips on a single PCIe card. 2023 prototype: 16 GB. 2024 prototype: 32 GB (doubled capacity). Positioning: "higher performance while consuming less power, and costing less than conventional GPUs."

**Architecture nuance:** GDDR6-AiM uses all-bank operation to fully utilize internal DRAM bandwidth. Its strength is memory-bound workloads (GEMV, embedding lookups) — same workload class as LLM inference.

### 3.5 UPMEM — DDR4 DIMM with Embedded DPU Cores

UPMEM is the only commercially available general-purpose PIM product in DDR4 DIMM form factor. This means it slots into a standard server DIMM slot — no PCIe riser, no exotic packaging.

**DPU specifications:**
| Parameter | UPMEM DPU |
|-----------|-----------|
| ISA | 32-bit RISC (custom) |
| Clock | 400 MHz |
| Pipeline | 14-stage, in-order |
| Hardware threads | Up to 24 tasklets/DPU |
| MRAM (DRAM bank) | 64 MB per DPU |
| WRAM (scratchpad SRAM) | 64 KB per DPU |
| IRAM (instruction) | 24 KB per DPU |
| DPUs per DIMM chip | 8 |
| DPUs per DIMM (dual-rank 8GB) | 128 |
| FP support | None (must be emulated) |
| INT32 multiply | Must be emulated |
| Inter-DPU communication | None (via host CPU only) |

**System configuration (typical research server):**
- Dual-socket Intel Xeon + 20 UPMEM DIMMs = 2,560 DPUs, 160 GB PIM DRAM + 256 GB standard DDR4.

**Performance:** Up to 259x speedup vs. Intel Xeon baseline for MLP batch inference. 3.9x average speedup for TPC-H database queries.

**Critical limitation for AI/ML:** No hardware FP support. All floating-point must be emulated in software. For LLM inference (which requires at minimum FP16 or BF16), UPMEM requires quantization to INT8 or lower, with software FP emulation overhead. This is the key weakness.

**Programming model:** C-based, CUDA-inspired co-processor model. LLVM-based compiler. Two binaries: host (CPU) and device (DPU). No inter-DPU links — collective reductions require CPU round-trips.

### 3.6 HyperCIM — Company Profile

**What is public:**

| Field | Public Information |
|-------|--------------------|
| Full name | HyperCIM Ltd |
| Incorporated | December 29, 2023 |
| Location | Ingatestone, United Kingdom (HQ) |
| CEO | Dr. Tanyaradzwa N. Mangoma |
| Stage | Early — ChipStart UK (SiliconCatalyst.UK accelerator) |
| Investors | Deep Science Ventures, Silicon Catalyst |
| Product name | LPU (Logic Processing Unit — different from Groq's LPU term) |
| Architecture claim | Compute-in-memory co-processor; processor-in-memory |
| Claimed throughput | 14.8 TB/s |
| Claimed latency | Sub-10ns deterministic (microsecond-class) |
| Target markets | Finance (FIX, KDB+), streaming (Kafka, RabbitMQ), SQL |
| Deployment interface | PCIe and Ethernet |
| Compatibility | "Zero disruption" — no code changes required |
| Status | Early adopter co-development program (no mass production) |
| Conference presence | SEMICON Taiwan 2025; Microelectronics UK 2026 (Sept 29-30, Excel London) |

**Tanya Mangoma's background:** Materials Science & Engineering (Manchester), PhD in Ultra Precision Engineering (Cambridge).

**What is NOT public (gaps):**
- [UNKNOWN] Specific silicon node, die area, transistor count — no datasheet or technical whitepaper publicly available.
- [UNKNOWN] Whether the 14.8 TB/s claim is measured or modeled.
- [UNKNOWN] Specific arithmetic precision supported (INT8? FP16? Analog?).
- [UNKNOWN] Fabrication partner (TSMC? GlobalFoundries? SMIC?).
- [UNKNOWN] Funding amount or round designation.
- [UNKNOWN] Whether "LPU" is SRAM-based digital CIM, analog CIM, or near-memory CNM architecture.

**Assessment:** HyperCIM is a pre-product chipstart with compelling marketing claims and a technically credible CEO. As of April 2026, no peer-reviewed paper, independent benchmark, or silicon tape-out confirmation is publicly available. The 14.8 TB/s throughput claim exceeds SK hynix AiMX on a PCIe card by ~14x, which would be extraordinary if measured on production silicon. Treat all performance claims as marketing until validated.

**Why they're targeting finance:** HyperCIM specifically names KDB+ (used by every major quant fund), FIX protocol (high-frequency trading), Kafka (streaming), and SQL as target workloads. These are exactly the data-preprocessing ETL bottlenecks before AI inference in trading systems — the "last mile" before the GPU gets clean data.

### 3.7 Analog and Near-Analog CIM for Inference

**Syntiant NDP (Neural Decision Processor):**
Edge-focused always-on inference chip using analog in-memory computing for voice wake-word detection. Sub-milliwatt operation. Not relevant for data center LLM inference but represents the proven edge of the CIM performance-power Pareto frontier.

**The precision problem with analog CIM:**
Analog CIM circuits are inherently noisy. The effective resolution of a flash cell as a weight is approximately 6-8 effective bits (analog SNR limits), versus INT8 digital. For LLM inference, FP16/BF16 is standard — this is a 2-4 bit shortfall that manifests as model accuracy degradation. Mitigations (error correction, calibration, multiple reads) add latency and area overhead.

### 3.8 Why PIM Has Not Taken Off Commercially (2024-2025 State)

Six structural barriers:

1. **Software/tooling immaturity:** No portable API standard. Each vendor (UPMEM, Samsung PIM, SK hynix AiM) has its own SDK. No unified compiler support. No virtual memory abstraction across host and PIM address spaces.

2. **Programming model mismatch:** The computing stack is built around processor-centric thinking (CUDA, PTX, OpenCL). PIM requires inverting this: data stays, compute moves. Existing ML frameworks (PyTorch, JAX, TensorFlow) assume they control where computation happens.

3. **Limited arithmetic precision:** Most PIM substrates support FP16 SIMD at best (Samsung HBM-PIM), INT32 emulation (UPMEM), or ~8-bit analog (Mythic). No current production PIM device natively supports BF16 or FP32 at scale.

4. **No inter-PIM communication:** UPMEM DPUs cannot talk directly to each other. Samsung PIM banks operate in lock-step (no independent routing). Collective reductions require CPU round-trips, adding ms-scale latency.

5. **Manufacturing cost and yield:** Integrating logic into DRAM arrays requires either mixed-process manufacturing (logic process for ALUs + DRAM process for arrays) or accepting sub-optimal logic density. Neither is cheap. Yield risk of combining two process targets on one die is non-trivial.

6. **JEDEC standardization gap:** As of October 2024, a new PIM interface standard was proposed. It does not yet exist as a ratified JEDEC standard, meaning hardware vendors cannot guarantee host-compatibility across generations.

**Market context:** PIM chip market estimated at $2 billion in 2024, ~10M units, projected 45% CAGR to $20 billion by 2028.

---

## Section 4 — Memory-Architecture Taxonomy

| Architecture | Platform Example | On-die Bandwidth | Off-chip Memory Bandwidth | Capacity (per node) | Capacity Flexibility | Precision | Programmability | Power per Node | Maturity |
|--------------|------------------|------------------|----------------------------|--------------------|---------------------|-----------|-----------------|---------------|----------|
| Conventional GPU | NVIDIA H100 | ~3.35 TB/s (HBM3) | 900 GB/s (NVLink 4.0) | 80 GB HBM (single), 640 GB (8×) | Low (fixed HBM) | FP64/FP32/BF16/FP8/INT8 | CUDA (dominant) | 700W/card, ~5.6 kW/node | Very high |
| Wafer-scale (Cerebras WSE-3) | CS-3 | 21 PB/s (on-die SRAM) | MemoryX: DDR5+Flash streaming (BW unspecified) | 44 GB on-die; up to 1.2 PB MemoryX | High via MemoryX | FP16/BF16 native, FP32 accumulate | Proprietary SDK (PyTorch front-end) | ~23 kW/CS-3 | Low-medium |
| All-SRAM chip (Groq) | GroqRack (576 chips) | 80 TB/s per chip | None (no external DRAM) | 230 MB/chip; ~14 GB/rack | Very low | INT8/FP8 storage, FP32 accumulate | GroqFlow (MLIR) | ~300W/chip; ~50 kW/rack | Low |
| Explicit-scratchpad (Trainium) | Trainium3 (Trn3) | ~4.9 TB/s (HBM3e) | NeuronLink multi-chip (TB/s class) | 144 GB HBM/chip; 20.7 TB/UltraServer | Medium | FP8/BF16/FP32 | Neuron SDK (PyTorch/JAX) | ~500W/chip; ~8-10 kW/server | Medium |
| PIM — near-bank CNM (UPMEM) | UPMEM server (2,560 DPUs) | 64 KB WRAM/DPU | DDR4-2400 standard | 160 GB PIM DRAM | High (standard DIMM) | INT8 native; FP emulated | C + LLVM (libdpu) | ~15-20W/DIMM | Very low |
| PIM — in-HBM (Samsung Aquabolt-XL) | GPU + HBM-PIM swap | 4.92 TB/s internal | 1.23 TB/s off-chip HBM | Same as HBM2 stack | Constrained | FP16 SIMD (limited) | TF/PyTorch auto-offload | Within GPU TDP | Low |
| PIM — GDDR6 (SK hynix AiM/AiMX) | AiMX PCIe card | Internal GDDR6 all-bank (>1 TB/s) | 16 Gbps/pin GDDR6 | 32 GB/AiMX card | Medium | FP16 SIMD (1 TFLOPS/chip) | Proprietary SDK | AiM card <75W | Very low |
| Analog CIM (Mythic AMP) | M1108 AiMX card | Array-internal (high) | None required | 108 MiB flash weights/chip (80M weights) | Very low | ~8-bit effective analog | ONNX front-end | ~4W single; 75W card | Low-medium (edge only) |
| Host CPU | AMD EPYC 9654 / Graviton4 | ~1.2 TB/s (DDR5) | N/A (local) | 6 TB/socket (max DDR5) | Very high | FP64/FP32/FP16/INT8 (AVX-512) | C/C++/Python | ~400W/socket | Very high |

**Reading guide for capital markets audience:**
- **Bandwidth** is the primary inference bottleneck for LLMs — favor PB/s (Cerebras) or TB/s (Groq, SambaNova) over GPU GB/s.
- **Capacity flexibility** matters for model sizing — fixed SRAM (Groq, Graphcore) limits deployable model size; MemoryX and DDR tiers restore flexibility at latency cost.
- **Programmability** determines time-to-production — CUDA ecosystem wins, Neuron SDK is growing, proprietary SDKs (GroqFlow, Cerebras SDK) add months of porting effort.
- **Maturity** determines supply chain and SLA guarantees — novel silicon is not the same as GPU-proven infrastructure.

---

## Section 5 — Capital Markets Suitability

### 5.1 The Capital Markets Inference Use Case

Before comparing silicon, understand the workload profile of capital markets AI inference:

1. **Latency regime:** Sub-millisecond for order routing decisions; 1-100ms for risk analytics; seconds acceptable for end-of-day model runs. Not all capital markets AI is nanosecond-class.
2. **Determinism / jitter:** A model that runs in 50ms ± 1ms is preferable to one that runs in 45ms ± 20ms for risk P99 budget calculations. **Tail latency matters more than median latency.**
3. **Throughput:** Risk analytics may need batch inference across millions of positions simultaneously — high aggregate throughput, not single-request throughput.
4. **Model sizes:** Risk models are often custom, smaller (1B-30B parameters, not frontier 400B), making fully-local SRAM execution feasible.
5. **Power envelope:** Data center power is a real constraint in London and NYC — co-location facilities have power caps.
6. **Auditability:** Regulatory requirements demand reproducibility. Deterministic silicon is not just a performance feature — it is a compliance feature.

### 5.2 Cerebras / Groq Determinism Advantage

| Source of GPU non-determinism | Cerebras mitigation | Groq mitigation |
|-------------------------------|---------------------|-----------------|
| HBM DRAM refresh (tREFI pauses) | No HBM — pure SRAM | No DRAM — pure SRAM |
| HBM bus contention (multi-tenant) | No HBM shared bus | No HBM shared bus |
| Cache hierarchy miss variability | No cache — single-cycle SRAM | No cache — single-cycle SRAM |
| CUDA kernel launch overhead | Eliminated by hardware scheduler | Eliminated by compiler scheduling |
| NVLink congestion | SwarmX tree | Plesiosynchronous |
| Thermal throttling | Water-cooled, stable clock | [UNKNOWN] |
| OS interrupt jitter | [UNKNOWN for CS-3] | Compiler-scheduled, not OS-visible |

**The governance argument:** Capital markets regulators (FCA in London, CFTC/SEC in the US) increasingly require firms to demonstrate that their AI models produce reproducible results. Stochastic jitter in GPU inference makes this harder to certify. SRAM-based deterministic execution has a compliance story that GPU vendors do not.

### 5.3 PIM Power Envelope Advantage

| Architecture | Energy per bit | System power | Joules/token estimate |
|--------------|----------------|--------------|----------------------|
| GPU (H100, HBM3) | ~6 pJ/bit | 700W/GPU | 10-30 J/token |
| Groq LPU (SRAM) | ~0.3 pJ/bit | ~300W/chip | 1-3 J/token |
| UPMEM PIM | DRAM-adjacent (~2 pJ/bit) | ~15-20W/DIMM | Low (but slow arithmetic) |
| Samsung HBM-PIM | Eliminates off-chip bandwidth; ~60% energy reduction | Within GPU TDP | Not independently published |
| Mythic AMP (analog) | Minimal — compute is in-cell | 4W (single chip) | Ultra-low (edge workloads) |
| HyperCIM LPU | [UNKNOWN] | [UNKNOWN] | Claimed "fraction of GPU" |

**The math that matters to capital markets:** London co-location space is typically priced per kW of allocated power. At £5,000-10,000/kW/year, a CS-3 at 23 kW costs £115,000-230,000/year in power allocation alone — comparable to a full 8-GPU node (~30-40 kW). The efficiency argument for PIM chips is in the direction of 10-20W PCIe cards vs. multiple GPU servers.

### 5.4 Programming Model Tax

| Vendor | SDK Maturity | PyTorch/TF support | Ecosystem size | Migration cost from GPU |
|--------|--------------|--------------------|-----------------|-------------------------|
| NVIDIA (CUDA) | Very mature (15+ years) | Native | Dominant | Baseline |
| AWS Neuron (Trainium) | Growing (3-4 years) | Full (Neuron SDK) | Medium (AWS) | Low-medium |
| Cerebras | Medium (2-3 years) | PyTorch front-end | Small | Medium |
| Groq (GroqFlow) | Medium | ONNX/PyTorch export | Small | Medium |
| SambaNova | Medium | PyTorch/ONNX | Small | Medium |
| Tenstorrent | Early (Metalium) | C++ kernels | Very small | High |
| UPMEM | Early | None (C-based) | Research | Very high |
| Samsung HBM-PIM | SDK available | TF/PyTorch auto | Small | Low (drop-in HBM) |

**The CUDA moat:** Capital markets quant teams have years of CUDA-optimized code. Migrating to Cerebras or Groq means recompiling, revalidating, and recertifying models — a multi-month process for a regulated firm.

### 5.5 Supply Chain Risk

| Architecture | Supply chain risk | Key dependency | Mitigation available? |
|--------------|-------------------|-----------------|----------------------|
| NVIDIA GPU | Low (H100/B200) | TSMC; NVIDIA | AWS, Azure, GCP |
| AWS Trainium | Low for AWS customers | TSMC; Amazon internal | Native AWS |
| Cerebras CS-3 | Medium | TSMC 5nm; Cerebras alone | Via AWS Marketplace |
| Groq (post-deal) | Medium-low | Post-NVIDIA deal | Groq Cloud still operational |
| SambaNova | Medium | TSMC 5nm CoWoS | Enterprise only |
| Tenstorrent | Medium-high | Samsung 6nm; small company | Early stage |
| UPMEM | High | Single vendor, niche | No alternative |
| HyperCIM | Very high | Pre-revenue startup | No production silicon confirmed |

---

## Section 6 — Adversarial Questions for Co-Panelists

### 6.1 Questions for Zigfrid Zvezdin (Cerebras)

**Q1 — Weight streaming vs. fully-local:** "For the Llama 405B benchmarks you publish — is that running in weight streaming mode through MemoryX, or does the 405B model actually fit on the 44 GB of on-chip SRAM? And for capital markets inference where tail-latency determinism is the requirement, which mode should a firm run, and what model size threshold is the crossover?"

*Why sharp:* 405B at FP16 = ~810 GB. It cannot fit in 44 GB. Therefore all 405B inference uses MemoryX. The determinism story weakens in weight streaming mode because MemoryX scheduling reintroduces external data movement latency variability.

**Q2 — SwarmX and KV cache:** "For long-context inference — a 128K-context legal document review, for example — the KV cache grows dynamically during generation. Where does the KV cache live on a CS-3 running a large model in weight streaming mode? Does it compete with activations for the 44 GB of on-chip SRAM, and how does that affect tail-latency as context grows?"

**Q3 — P99 latency data:** "You cite 969 tokens/sec as your peak throughput for Llama 405B. Do you have a published P99 tail latency distribution under multi-tenant load? The capital markets audience here needs P99, not median — what does the jitter envelope look like on Cerebras Inference under concurrent customer load?"

**Q4 — MemoryX as a new memory wall:** "Cerebras markets the end of the memory wall. But MemoryX is DDR5 + Flash — not SRAM. For models that need MemoryX, you've reintroduced off-chip data movement. What is the bandwidth of the MemoryX-to-WSE link, and how does it compare to the ~3.35 TB/s of a GPU's HBM? Is MemoryX the new memory wall, just at a different layer?"

**Q5 — WSE-4 and next-node risk:** "The WSE-3 is on TSMC 5nm. Scaling to a next-generation wafer-scale chip at 3nm or 2nm is complicated by the fact that the reticle size shrinks, which means the stitching approach changes. What is the WSE-4 roadmap, and how does Cerebras maintain the same die area advantage at advanced nodes where reticle-stitch count must increase?"

### 6.2 Questions for Tanya Mangoma (HyperCIM)

**Q6 — Precision and LLM activations:** "The 14.8 TB/s throughput figure — is that for weights or for activations, and at what arithmetic precision? Specifically: does HyperCIM's LPU natively support BF16 or FP16, or does it require quantization to INT8 or lower? For risk model inference, we need to quantify the accuracy-latency tradeoff of any quantization you require."

**Q7 — KV cache and dynamic memory:** "Compute-in-memory architectures excel at weight-stationary inference — the weights are fixed and the computation comes to them. But LLM inference has a dynamic KV cache that grows with sequence length. How does HyperCIM handle the KV cache — is it stored in the LPU memory fabric, and if so, does writing new KV entries during generation conflict with weight reads?"

**Q8 — Current silicon status:** "You're at the co-development stage with early adopters. Is that on production silicon, or on FPGA emulation or simulation? When is HyperCIM's first ASIC tape-out, and what foundry and process node?"

**Q9 — FIX protocol preprocessing vs. AI inference:** "Your positioning is that the LPU handles data preprocessing and protocol transformation before the GPU runs inference. Is HyperCIM primarily a data pipeline accelerator — KDB+, FIX ingestion, Kafka — rather than an inference engine itself? If so, how does it fit in the panel theme of 'inference silicon'?"

**Q10 — Shared question for both panelists:** "Both of your architectures eliminate or minimize off-chip DRAM. But large language models in production face multi-tenant inference, where different requests can have radically different sequence lengths — from 100 tokens to 100,000 tokens. How does your architecture handle memory allocation for dynamic-length KV caches from concurrent sessions without reintroducing the resource contention that creates jitter on GPU clusters?"

---

## Section 7 — Key Talking Points for Carlos (AWS Positioning)

1. **AWS's approach is pragmatic memory hierarchy, not dogmatic SRAM purism.** Trainium3 uses 144 GB of HBM3e per chip at 4.9 TB/s — not 21 PB/s SRAM — but that is a deliberate trade: capacity flexibility and programmability (PyTorch/JAX native) over raw bandwidth.

2. **Neuron SDK closes the gap on the programming model tax.** Cerebras and Groq require porting. Trainium runs PyTorch models with minor compilation changes via torch.compile. For regulated financial services firms that cannot afford 6-month model recertification cycles, this matters.

3. **AWS supply chain is the only non-NVIDIA option with hyperscaler backing.** When a capital markets CTO asks "what happens if the startup fails?" — Cerebras, Groq, Tenstorrent, and HyperCIM are all single-vendor risks. AWS Trainium is backed by Amazon's fabrication pipeline and roadmap.

4. **Determinism on Trainium is achievable via NeuronCore's scratchpad architecture.** Trainium's NeuronCore uses explicit SRAM buffers (SBUF for inputs, PSUM for accumulators) — not a cache. For a given compiled model, execution is deterministic within a single chip. The honest answer is that Trainium is more deterministic than GPU but less deterministic than fully-local Cerebras or Groq.

5. **The "wafer-scale" vs. "chiplet" debate is real.** Cerebras wins on intra-node bandwidth. AWS/NVIDIA win on composability — you can mix chip generations, run heterogeneous workloads, and upgrade incrementally.

6. **For capital markets specifically: Graviton is underrated for small model inference.** Graviton4 DDR5 bandwidth (~1.2 TB/s per socket) with 6 TB capacity is sufficient for models up to ~10B parameters at INT8. The tooling cost is zero (standard CPU code).

7. **The KV cache problem is platform-agnostic.** AWS's Neuron SDK has documented KV cache paging and PagedAttention-style management for Inf2 and Trn2. This is a real differentiator to press on.

8. **Cerebras Inference is now on AWS Marketplace.** This is actually an interesting competitive dynamic worth acknowledging on the panel: AWS is simultaneously a Cerebras competitor (Trainium) and a distribution partner (AWS Marketplace). Carlos can reference this directly as evidence that AWS bets on the best silicon for each workload.

9. **For HyperCIM: the FIX/KDB+ positioning is actually the right problem.** GPU utilization in trading systems is often 20-30% because CPUs are busy doing FIX protocol parsing, KDB+ query normalization, and stream joins before data ever reaches the GPU. If HyperCIM can push this preprocessing into memory at 14.8 TB/s, it frees GPU cycles for actual inference. This is complementary to AWS silicon, not competitive.

10. **The real frontier: memory-compute integration at packaging level (3D stacking).** Both the WSE approach and the PIM approach are trying to solve the same physics problem differently. The emerging mid-ground is 3D-stacked logic on memory — Intel Foveros, TSMC SoIC, chiplet-in-package. AWS's Trainium chiplet design (dual-die CoWoS) already moves in this direction. The panel thesis ("memory has replaced FLOPs as the bottleneck") is correct, but the solution space is not binary between "wafer-scale SRAM" and "compute in DRAM."

---

## Section 8 — Sources

All sources accessed 2026-04-21.

1. [Cerebras Chip Page](https://www.cerebras.ai/chip) — Tier 1
2. [WSE-3 Press Release](https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine) — Tier 1
3. [Cerebras CS-3 Blog](https://www.cerebras.ai/blog/cerebras-cs3) — Tier 1
4. [Cerebras Architecture Blog](https://www.cerebras.ai/blog/announcing-the-cerebras-architecture-for-extreme-scale-ai) — Tier 1
5. [Cerebras Wafer-Scale Cluster Docs](https://docs.cerebras.net/en/latest/wsc/Concepts/how-cerebras-works.html) — Tier 1
6. [Cerebras Llama 405B Blog](https://www.cerebras.ai/blog/llama-405b-inference) — Tier 1
7. [Cerebras 405B Press Release](https://www.cerebras.ai/press-release/cerebras-inference-llama-405b) — Tier 1
8. [Cerebras 3x Faster PR](https://www.cerebras.ai/press-release/cerebras-triples-its-industry-leading-inference-performance-setting-new-all-time-record) — Tier 1
9. [Cerebras Inference Launch PR](https://www.cerebras.ai/press-release/cerebras-launches-the-worlds-fastest-ai-inference) — Tier 1
10. [Cerebras Inference Page](https://www.cerebras.ai/inference) — Tier 1
11. [AWS Marketplace: Cerebras Inference](https://aws.amazon.com/marketplace/pp/prodview-ph4bdvplhhz3o) — Tier 1
12. [ServeTheHome WSE-3 Launch](https://www.servethehome.com/cerebras-wse-3-ai-chip-launched-56x-larger-than-nvidia-h100-vertiv-supermicro-hpe-qualcomm/) — Tier 2
13. [Introl WSE/CS-3 Guide 2025](https://introl.com/blog/cerebras-wafer-scale-engine-cs3-alternative-ai-architecture-guide-2025) — Tier 3
14. [Next Platform CS-3 Hyperscale](https://www.nextplatform.com/ai/2024/03/14/cerebras-goes-hyperscale-with-third-gen-waferscale-supercomputers/1642584) — Tier 2
15. [arXiv 2503.11698 — Cerebras vs GPU](https://arxiv.org/html/2503.11698v1) — Tier 2
16. [Groq LPU Architecture Page](https://groq.com/lpu-architecture) — Tier 1
17. [Groq Inside the LPU](https://groq.com/blog/inside-the-lpu-deconstructing-groq-speed) — Tier 1
18. [Bloomberg: NVIDIA-Groq Deal Dec 2025](https://www.bloomberg.com/news/articles/2025-12-24/nvidia-reaches-licensing-deal-with-chip-startup-groq) — Tier 1
19. [Bloomberg: Senators Query NVIDIA-Groq March 2026](https://www.bloomberg.com/news/articles/2026-03-20/nvidia-s-20-billion-groq-deal-queried-by-warren-blumenthal) — Tier 1
20. [arXiv 2405.07518 — SambaNova SN40L](https://arxiv.org/abs/2405.07518) — Tier 2
21. [SambaNova SN40L Blog](https://sambanova.ai/blog/sn40l-chip-best-inference-solution) — Tier 1
22. [The Register Tenstorrent Blackhole](https://www.theregister.com/2024/08/27/tenstorrent_ai_blackhole/) — Tier 2
23. [ServeTheHome Tenstorrent Blackhole](https://www.servethehome.com/tenstorrent-blackhole-and-metalium-for-standalone-ai-processing/) — Tier 2
24. [Graphcore IPU Products](https://www.graphcore.ai/products/ipu) — Tier 1
25. [Mythic M1108 Product Page](https://mythic.ai/products/m1076-analog-matrix-processor/) — Tier 1
26. [HyperCIM Website](https://www.hypercim.com/) — Tier 1
27. [SiliconCatalyst.UK — HyperCIM](https://www.siliconcatalyst.uk/sicuk-companies/hypercim) — Tier 1
28. [BritChips Podcast: Tanya Mangoma](https://anttheantidote.substack.com/p/britchips-podcast-tanya-mangoma-child) — Tier 3
29. [Cambridge CDT-UP: Tanya Mangoma](https://www.cdt-up.eng.cam.ac.uk/directory/tanya-mangoma) — Tier 1
30. [Samsung HBM-PIM Newsroom](https://news.samsung.com/global/samsung-brings-in-memory-processing-power-to-wider-range-of-applications) — Tier 1
31. [IEEE Xplore Aquabolt-XL](https://ieeexplore.ieee.org/document/9567191/) — Tier 2
32. [SK hynix AiM Development](https://news.skhynix.com/sk-hynix-develops-pim-next-generation-ai-accelerator/) — Tier 1
33. [SK hynix AiMX Card Launch](https://news.skhynix.com/sk-hynix-debuts-first-gddr6-aim-accelerator-card-aimx-for-generative-ai/) — Tier 1
34. [arXiv 2401.14428 Landscape of CNM and CIM](https://arxiv.org/html/2401.14428v1) — Tier 2
35. [arXiv 2012.03112 Modern Primer on PIM](https://arxiv.org/html/2012.03112v5) — Tier 2
36. [ETH Zurich PrIM Benchmark UPMEM](https://people.inf.ethz.ch/omutlu/pub/PrIM-UPMEM-Tutorial-Analysis-Benchmarking_arxiv21.pdf) — Tier 2
37. [SIGARCH PIM Retrospective](https://www.sigarch.org/processing-in-memory-tutorials-experiences-from-past-two-years-and-thoughts-looking-forward/) — Tier 2
38. [STAC Summit London 2026](https://stacresearch.com/events/spring2026lon/) — Tier 1
39. [SemiAnalysis Trainium2 Architecture](https://newsletter.semianalysis.com/p/amazons-ai-self-sufficiency-trainium2-architecture-networking) — Tier 2
40. [NextPlatform Trainium4](https://www.nextplatform.com/2025/12/03/with-trainium4-aws-will-crank-up-everything-but-the-clocks/) — Tier 2

---

## Freshness Assessment

Cerebras, Groq, Trainium specs are current as of early-to-mid 2025 based on official datasheets. The NVIDIA-Groq licensing deal (December 2025) is the most significant recent structural development and changes the competitive landscape. HyperCIM has minimal public presence — the company website and conference listings are current but the absence of a technical whitepaper or paper is a gap that will not be filled before the panel. The biggest knowledge risk for Carlos is the current state of MemoryX-to-WSE bandwidth (not published by Cerebras) and Cerebras Inference P99 tail latency (not published by Cerebras) — both of which are questions, not facts.
