# Track 3a — Graviton4 + Graviton5 Memory Architecture Deep Dive

**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Researched on:** 2026-04-21
**Audience:** Capital markets technology leads (tail latency, jitter, determinism, power envelope, data movement)

---

## 1. Cache and Memory Hierarchy

### 1.1 Neoverse V2 (Graviton4)

**L1:** 64 KB I + 64 KB D per core, 4-cycle L1D latency. L2 inclusive of L1i (acts as snoop filter, eliminates L1i probes on coherence events).

**L2:** 2 MB per core, 8-way set-associative, 4 banks. 11-cycle load-to-use latency. Single-core L2 bandwidth ~32 bytes/cycle on linear reads. Transaction queue 92-96 entries.

**L3 / SLC:** 36 MB total via CMN-700 mesh. 375 KB SLC per core. Single-core L3 read ~30 GB/s. L3 latency 68 cycles / ~25 ns at 16 MB.

The lean 36 MB SLC is partly an architectural tax: ARM's CMN-700 snoop filter must be ≥ 1.5× aggregate L2 capacity. For 96 cores × 2 MB L2 = 192 MB exclusive L2 → ~288 MB of snoop filter storage on-mesh, eating silicon budget that AMD reclaims via shadow tags.

**CMN-700 mesh:** 2D rectangular mesh with crosspoints, max 12×12 grid (144 XPs, 256 cores). 32 bytes/cycle bidirectional fabric. Cross-core cacheline bounce 30-60 ns.

**Physical design:** 7 chiplets at TSMC N4/N5 — 1 compute + 4 DDR controllers (3 channels each, 2 east + 2 west) + 2 PCIe controllers. ~73-100B transistors (sources vary).

(Sources: [Chips and Cheese Graviton 4](https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4); [Hot Chips 2023 V2](https://chipsandcheese.com/p/hot-chips-2023-arms-neoverse-v2); [WikiChip Graviton4](https://en.wikichip.org/wiki/annapurna_labs/graviton/graviton4); [NextPlatform G4](https://www.nextplatform.com/2023/11/28/aws-adopts-arm-v2-cores-for-expansive-graviton4-server-cpu/), accessed 2026-04-21)

### 1.2 Neoverse V3 (Graviton5)

**Architecture shift: SLC → distributed L3.** Graviton5 replaces the SLC model with 192 MB distributed L3 (AWS official; some press cited 180 MB as approximation). At 192 cores: exactly 1 MB L3 per core — 2.67× per core, 5.3× per chip vs Graviton4.

The move is not cosmetic. Doubling cores massively increases mesh traffic, hop distances, and contention on a unified cache. Distributed L3 enables better coherence scaling and predictable latency.

**L1:** [LIKELY] 64 KB I + 64 KB D per core (V3 product page spec, consistent with V2 trajectory).

**L2:** 2 MB per core (V3 supports 1/2/3 MB; AWS chose 2 MB).

**Mesh:** Arm CMN-S3 (successor to CMN-700). Optimized for ARMv9.2, multichip configs, CXL devices. AWS claims 33% lower inter-core latency vs Graviton4.

**Clock:** 3.1 GHz (single-socket, +11% vs G4's 2.8 GHz). TSMC 3nm. ~132B transistors (estimate).

(Sources: [The Register G5](https://www.theregister.com/2025/12/04/amazon_graviton_5/); [About Amazon G5](https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2); [NextPlatform G5](https://www.nextplatform.com/2025/12/04/aws-graviton5-strikes-a-different-balance-for-server-cpus/); [ARM CMN-S3](https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3); [Igor's Lab](https://www.igorslab.de/en/graviton5-amazon-shows-the-x86-world-where-the-hammer-hangs-192-arm-cores-against-amd-and-intel/), accessed 2026-04-21)

### 1.3 Comparison Table

| Feature | Graviton4 (V2) | Graviton5 (V3) |
|---|---|---|
| ISA | ARMv9.0-A | ARMv9.2-A |
| Process | TSMC N4/N5 | TSMC 3nm |
| Cores (single socket) | 96 | 192 |
| Clock | 2.8 GHz (1S) / 2.7 GHz (2S) | 3.1 GHz |
| L1 I/D per core | 64/64 KB | 64/64 KB [LIKELY] |
| L1D latency | 4 cycles | [UNKNOWN] |
| L2 per core | 2 MB / 8-way / 4 banks | 2 MB |
| L2 latency | 11 cycles | [UNKNOWN] |
| L3 total | 36 MB SLC (CMN-700) | **192 MB distributed (CMN-S3)** |
| L3 per core | 375 KB | **1 MB (2.67×)** |
| L3 latency | 68 cycles / ~25 ns | ~15% reduction claimed |
| Inter-core latency | 30-60 ns | ~20-40 ns [33% reduction] |
| Transistors | ~73-100B | ~132B |
| Chiplet design | 7 chiplets | [UNKNOWN] |
| NUMA | Dual socket (138 ns cross) | Single socket (NUMA eliminated) |

---

## 2. DRAM Subsystem

### 2.1 DDR5 Channel Organization

**Graviton4:** 12 × DDR5-5600. Four DDR controller chiplets (3 channels each, 2 east + 2 west). 64-bit channels = 768-bit aggregate bus. Max 768 GB DIMM (X8g reaches 3 TiB with high-density DIMMs). Theoretical peak: 12 × 44.8 GB/s = **537.6 GB/s**.

**Graviton5:** 12 DDR5 controllers (six per side). The Register confirms DDR5-7200 deployed for M9g, "with support for 8800 MT/s DIMMs in the works." Bandwidth table:

- DDR5-6400: 614.4 GB/s
- DDR5-7200: **691.2 GB/s** (deployed, +28.6% vs G4)
- DDR5-8400: 806.4 GB/s

(Sources: [The Register](https://www.theregister.com/2025/12/04/amazon_graviton_5/); [NextPlatform G5](https://www.nextplatform.com/2025/12/04/aws-graviton5-strikes-a-different-balance-for-server-cpus/), accessed 2026-04-21)

[UNKNOWN] Per-instance DRAM speed configurability. Whether R9g uses different speed than M9g.

[UNKNOWN] LPDDR5X usage — Graviton5 is DDR5 throughout, no LPDDR5X. (Comparator: NVIDIA Grace uses LPDDR5X at 500 GB/s in 16W — radically different design point.)

### 2.2 Bandwidth — Theoretical and Per-Core

| Chip | Total DRAM BW | Cores | **Per-core BW** |
|---|---|---|---|
| Graviton4 | 537.6 GB/s | 96 | **5.6 GB/s** |
| Graviton5 (DDR5-7200) | 691.2 GB/s | 192 | **3.6 GB/s** (-36% per core) |

**Critical tradeoff:** Graviton5 doubles cores but DRAM channels do not scale. Per-core DRAM bandwidth drops 36%. The 192 MB L3 is explicit compensation: working sets that fit in L3 (KV-cache, hot indices, in-memory tick stores) see >100 GB/s effective per-core bandwidth from L3, an order-of-magnitude shift from DRAM.

### 2.3 Latency

**Graviton4 (Chips and Cheese measured):**
- L1D: 4 cycles (~1.4 ns at 2.8 GHz)
- L2: 11 cycles (~3.9 ns)
- L3 / SLC: 68 cycles / ~25 ns
- **Local DRAM: 114.08 ns**
- **Cross-socket DRAM: >250 ns (+142.5 ns penalty)**
- Cross-socket cacheline bounce: 138.6 ns

**Graviton5:** [UNKNOWN] No independent microarchitecture analysis exists yet. AWS claims 33% lower inter-core latency. DDR5-7200 latency expected 85-100 ns range based on CL timings.

(Source: [Chips and Cheese Graviton 4](https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4), accessed 2026-04-21)

---

## 3. Interconnect and PCIe

### 3.1 Mesh

**Graviton4 / CMN-700:** 2D rectangular mesh, max 12×12 (144 XPs, 256 cores). HN-F nodes house SLC slices and snoop filter banks. 32 bytes/cycle bidirectional. Mesh+SLC clock plane runs at ~2/3 core frequency.

**Graviton5 / CMN-S3:** ARM positions as supporting "multichip configurations and CXL devices" with "die-to-die links" — silicon-proven via the CMN-S3AE automotive variant. Optimized for ARMv9.2.

[UNKNOWN] CMN-S3 grid dimensions, XP count, per-cycle bandwidth, snoop filter sizing — ARM's CMN-S3 page is marketing-only.

### 3.2 PCIe

**Graviton4:** 96 lanes PCIe 5.0. Per-lane 4 GB/s unidirectional. Total ~384 GB/s. Two PCIe controller chiplets.

**Graviton5:** **96 lanes PCIe 6.0** via 8 controllers. Per-lane 8 GB/s unidirectional (PAM4). Total ~768 GB/s unidirectional, ~2.84 TB/s full duplex. First AWS chip with PCIe 6 out of the box.

**Critical insight:** PCIe Gen6 at 768 GB/s **exceeds Graviton5's own DRAM bandwidth** (691 GB/s at DDR5-7200). For the first time the CPU-to-accelerator path is not the bottleneck — DRAM access patterns are. When Graviton5 hosts Trainium2/Inferentia2, the constraint is host CPU staging data into PCIe DMA, not the link.

### 3.3 NVLink Fusion + UALink (Graviton5)

[VERIFIED PROTOCOL ONLY] ARM (Nov 2025) announced Neoverse integration with NVIDIA NVLink Fusion via the **AMBA CHI C2C (Coherent Hub Interface Chip-to-Chip) protocol**. Provides "coherent, high-bandwidth connection between CPUs and accelerators." (Source: [ARM Newsroom NVLink](https://newsroom.arm.com/news/arm-neoverse-nvidia-nvlink), accessed 2026-04-21)

[SPECULATIVE] NextPlatform "envisions" Graviton5 variants with NVLink Fusion + UALink ports. AWS has made no official announcement of such variants.

[UNKNOWN] NVLink Fusion bandwidth Neoverse V3 ↔ NVIDIA GPU. UALink details in any Graviton context.

**Implication:** Current Graviton5 M9g instances have only PCIe Gen6 path to accelerators. No coherent CPU-GPU shared memory fabric on any announced Graviton5 instance.

---

## 4. Vector and Matrix Compute

### 4.1 SVE2 Implementation

**Neoverse V2 (Graviton4):** [VERIFIED] 4 × 128-bit SVE2/NEON vector pipes. Same total throughput as Graviton3's 2×256, but 4×128 layout handles NEON and SVE2 identically without mode-switching. Two dual-ported vector schedulers, 28 entries each. Three 128-bit loads/cycle.

For llama.cpp: the 4×128 layout requires architecture-specific quantization block layouts (Q4_0_8_8 or current Q4_0) for full MMLA utilization — yields ~70% improvement over naive Q4_0.

**Neoverse V3 (Graviton5):** [LIKELY] Same 4×128-bit SVE2 pipes. No public V3 TRM confirms width change. The 11% per-core uplift comes from microarchitecture (wider OoO window, prefetch, branch prediction), not vector width.

[UNKNOWN] Confirmed V3 SVE2 pipe count. No Hot Chips 2024/2025 paper on V3 found.

(Sources: [RealWorldTech V2 SVE2](https://www.realworldtech.com/forum/?threadid=208612&curpostid=208674); [ARM Neoverse V2 AI](https://developer.arm.com/community/arm-community-blogs/b/servers-and-cloud-computing-blog/posts/neoverse-v2-for-ai); [AWS llama.cpp Graviton](https://github.com/aws/aws-graviton-getting-started/blob/main/machinelearning/llama.cpp.md), accessed 2026-04-21)

### 4.2 SME / SME2 — Critical Unknown

**Graviton4:** [VERIFIED] No SME / SME2. ARMv9.0-A predates SME2 (introduced in Armv9.2-A). Has BFloat16 FMMLA and I8MM SMMLA via SVE2 — vector-register matrix ops, not the streaming matrix engine.

**Graviton5:** [LIKELY but NOT CONFIRMED] V3 implements ARMv9.2-A (the ISA introducing SME2). Evidence:
1. ARM: "Armv9.2-A introduces SME"
2. ARM Cobalt 200 announcement (CSS V3) discusses SME2 in Azure AI context
3. V3AE automotive implements Armv9 SME capabilities
4. ARM's KleidiAI library targets SME2 for matrix ops on Armv9.2+

**But:** ARM CSS V3 / Neoverse V3 announcements name SVE2 and CCA explicitly — they do NOT explicitly name SME2 as a V3 feature. **No AWS announcement has confirmed SME2 in Graviton5.**

**Why it matters:** SME2 introduces dedicated ZA matrix register file + streaming SVE mode. Matrix-matrix multiply at SVL² throughput vs sequential FMMLA. For 128-bit streaming vector → 4× better matrix multiply per cycle vs pure SVE2. ARM KleidiAI shows 6× faster LLM decode on SME2 hardware for small models. **Confirmed presence in Graviton5 would substantially shift the inference arithmetic intensity picture.**

**Action item for Carlos:** Verify on M9g via `/proc/cpuinfo` (look for `sme` and `sme2` flags) or AWS support confirmation before citing on panel.

### 4.3 Throughput per Core (computed from architecture)

**Graviton4 (4×128 pipes at 2.8 GHz):**
- FP32: 32 ops/cycle × 2.8 GHz = **89.6 GFLOPS/core**
- BF16 FMMLA: 64 ops/cycle = **179.2 GBFLOPS/core**
- INT8 SMMLA: 128 ops/cycle = **358.4 GOPS/core**

**Graviton5 (assumed same 4×128 at 3.1 GHz):**
- FP32: ~98.8 GFLOPS/core
- BF16: ~197.6 GFLOPS/core
- INT8: ~395.2 GOPS/core
- BF16 with SME2 (if confirmed): up to ~4× higher in streaming mode

### 4.4 Per-Socket Peak

**Graviton4 (96 cores):** 8.6 TFLOPS FP32 / 17.2 TFLOPS BF16 / 34.4 TOPS INT8

**Graviton5 (192 cores):** ~19.0 TFLOPS FP32 / ~37.9 TFLOPS BF16 / ~75.9 TOPS INT8

(Realistic utilization for inference: 30-60% of peak, memory-pressure dependent.)

---

## 5. Arithmetic Intensity / Roofline

### 5.1 Per-Core Ridge Points

Ridge point = Peak FLOPS/core ÷ Memory BW/core

| Chip | Precision | FLOPS/core | DRAM BW/core | **Ridge** |
|---|---|---|---|---|
| Graviton4 | BF16 | 179.2 G | 5.6 GB/s | **32.0** |
| Graviton4 | INT8 | 358.4 G | 5.6 GB/s | **64.0** |
| Graviton4 | FP32 | 89.6 G | 5.6 GB/s | **16.0** |
| Graviton5 | BF16 | 197.6 G | 3.6 GB/s | **54.9** |
| Graviton5 | INT8 | 395.2 G | 3.6 GB/s | **109.8** |
| Graviton5 | FP32 | 98.8 G | 3.6 GB/s | **27.4** |

**Ridge point increases significantly G4 → G5** because cores doubled but DRAM bandwidth grew only 28.6%. Workloads need higher arithmetic intensity to be compute-bound on G5. UNLESS the working set fits in the 192 MB L3 — then effective bandwidth jumps and ridge inverts.

### 5.2 vs GPU Ridge Points

| Chip | Precision | Peak FLOPS | Memory BW | Ridge |
|---|---|---|---|---|
| H100 SXM | BF16 dense | ~989 TFLOPS | 3.35 TB/s | **~295** |
| H100 SXM | BF16 sparsity | ~1979 TFLOPS | 3.35 TB/s | **~590** |
| Graviton4 | BF16 | 17.2 TFLOPS | 537.6 GB/s | **32.0** |
| Graviton5 | BF16 | ~37.9 TFLOPS | 691.2 GB/s | **~54.9** |

**Key insight:** H100 ridge point (~295) is 9× Graviton4 (32) and 5× Graviton5 (~55). LLM decode arithmetic intensity is ~0.5-2 FLOPS/byte — **far below every ridge point in the table**. Every chip is bandwidth-limited at batch=1 decode. Question: which gets more effective bandwidth per dollar.

(Source: [JAX Scaling Book](https://jax-ml.github.io/scaling-book/roofline/); [NVIDIA H100 specs](https://www.nvidia.com/en-us/data-center/h100/), accessed 2026-04-21)

### 5.3 LLM Decode Implications

LLM decode at batch=1 = memory bandwidth problem. AI for dot product BF16 converges to 0.5 FLOPs/byte — far below every ridge.

**Graviton4 measured (ClearML benchmarks 2024):**
- 7B Q4 (granite-7b-instruct): **14.41 t/s** (c8g.2xlarge, 8 vCPU)
- 8B Q4 (Llama 3 8B): 12.43 t/s
- 32B Q4 (QWEN 32B): 6.09 t/s (r8g.4xlarge)
- 70B Q4 (Llama 3 70B): 2.5 t/s (r8g.4xlarge)
- **4× better tokens-per-dollar vs equivalent c7i (Intel) and c7a (AMD)**

(Source: [ClearML Graviton benchmarks](https://clear.ml/blog/benchmarking-llama-cpp-on-arm-neoverse-based-aws-graviton-instances-with-clearml), accessed 2026-04-21)

**Graviton5:** [UNKNOWN] No independent inference benchmarks yet. AWS claims "up to 35% faster for ML workloads" vs M8g.

---

## 6. Power and Process

**Process:** Graviton4 TSMC N4/N5; Graviton5 TSMC 3nm. 3nm enables ~1.6-2× density. AWS notes 3nm enables "system-level optimizations such as bare-die cooling."

**TDP:** [UNKNOWN] AWS does not publish. NextPlatform estimates: Graviton4 ~130W; Graviton5 hypothetical ~180W at 1.75 GHz, ~650W at 3.1 GHz (the latter calculation is unrealistic — actual deployed TDP is almost certainly lower due to power gating and frequency management).

**Comparator:** NVIDIA Grace CPU (2 × Neoverse V2 + LPDDR5X): configurable 140-500W. Single Grace ~70-250W.

**Performance/watt:** Grace claims up to 2× perf/W vs x86. ARM claims V2 up to 3× perf/W on data analytics. AWS claims Graviton5 maintains "leading energy efficiency" at +25% performance.

---

## 7. AWS Instance Lineup

### 7.1 Graviton4

| Family | Purpose | Max vCPU | Max Mem | Max Net | Notable |
|---|---|---|---|---|---|
| C8g | Compute | 192 | 384 GiB | 50 Gbps | 3× vCPU vs C7g |
| M8g | General | 192 | 768 GiB | 50 Gbps | M8gd adds NVMe |
| R8g | Memory | 192 | 1,536 GiB | 50 Gbps | 3× vs R7g |
| X8g | High-Mem | 192 | 3,072 GiB | 50 Gbps | 16:1 mem:vCPU |
| I8g | Storage | 192 | — | 50 Gbps | NVMe-optimized |
| C8gn | Network | 192 | 384 GiB | **600 Gbps** | Highest in EC2; 6th-gen Nitro |

### 7.2 Graviton5

**M9g (preview, Dec 2025):**
- Graviton5 (192 cores, 3nm, 192 MB L3, DDR5-7200 deployed)
- PCIe Gen6 × 96 lanes
- 6th-gen Nitro Cards
- +15% network (avg) vs M8g; up to 2× on largest sizes
- +20% EBS bandwidth vs M8g
- +25% compute, +30% databases, +35% web/ML vs M8g
- Nitro Isolation Engine (formally verified)
- Limited region preview

**C9g, R9g:** Confirmed for 2026. No specs yet.

[UNKNOWN] M9g pricing, region availability, EFA support, I9g existence.

### 7.3 Nitro Isolation Engine (NIE)

[VERIFIED] Marquee security announcement. NIE is:
- Minimal formally-verified module written in **Rust**
- Sits beneath Nitro Hypervisor, enforcing VM isolation
- Verified using **Isabelle/HOL** (same toolchain as seL4 kernel)
- ~250,000 lines of Isabelle proof script — Graviton5 architecture spec, Rust hypercall code, security properties
- Proof checks in ~30 minutes on standard laptop
- "First formally verified cloud hypervisor"

**Capital markets implication:** Mathematical (not probabilistic) proof of customer isolation. Strongest available in any major hyperscaler. Directly relevant for trading systems, risk models, regulatory-sensitive workloads needing documented isolation evidence — MiFID II, DORA, SEC 17a-4, CFTC Part 1.31.

(Sources: [NW Quantum Isabelle/HOL](https://nwquantum.uw.edu/2026/04/17/isabelle-hol-the-proof-assistant-behind-the-nitro-isolation-engine/); [TYPES/announce NIE](http://www.mail-archive.com/types-announce@lists.seas.upenn.edu/msg11775.html); [AWS Graviton5](https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2), accessed 2026-04-21)

---

## 8. Capital Markets Talking Points

**1. Memory Hierarchy Inversion: L3 Now Does What DRAM Used to Do.** Graviton5's 192 MB L3 (5.3× G4's 36 MB) is not a cache; it's the primary working memory tier for inference and database workloads. KV-caches, hot indices, in-memory tick stores live in L3 at >100 GB/s effective per-core bandwidth — order of magnitude over DRAM's 3.6 GB/s/core. The chip's thesis: compute at L3 speeds, not DRAM speeds.

**2. Single-Socket NUMA Elimination Is Architecture, Not Marketing.** Graviton4 dual-socket: 142 ns additional cross-socket latency (138 ns avg cacheline) vs 114 ns local. Any latency-sensitive workload — order management, risk calc, market data — required NUMA-awareness. Graviton5 eliminates the topology entirely. In capital markets, 142 ns is not the same as 0 ns.

**3. The Ridge Point Reality Check.** Every chip on the panel — H100, Graviton4, Graviton5 — is memory-bandwidth-limited at batch=1 LLM decode. H100 ridge ~295 FLOPS/byte (BF16 dense). Graviton5 ridge ~55. Decode AI ~0.5-2. All sit in the same bandwidth-bound regime. H100 wins absolute throughput on 3.35 TB/s HBM. Graviton5 wins cost-per-token for sparse workloads where you're paying for idle GPU compute headroom. Know your ridge point before signing the hardware contract.

**4. PCIe Gen6 Inverts the Accelerator Feeding Bottleneck.** Graviton5 96-lane PCIe Gen6 = ~768 GB/s unidirectional, **exceeding G5's own DRAM bandwidth (691 GB/s)**. First time host-to-accelerator path isn't the bottleneck; DRAM and L3 miss rate become the constraint. When G5 hosts Trainium2 or Inferentia2, the constraint is CPU staging data into DMA, not the PCIe link.

**5. Graviton4 CPU Inference: Tokens-per-Dollar Wins, Not Tokens-per-Second.** Measured: 14 t/s for 7B Q4 (c8g.2xlarge); 2.5 t/s for 70B Q4 (r8g.4xlarge). 4× better tokens-per-dollar vs Intel Sapphire Rapids and AMD Genoa. If your compliance model runs batch=1 with 1-2s latency budget, c8g.xlarge may be the right economics. Streaming risk narrative at 500 t/s? You need GPU. Answer depends on AI and SLA, not peak TFLOPS.

**6. The Formally Verified Hypervisor Is a Regulatory Asset.** NIE verified via Isabelle/HOL — same class of verification as seL4 microkernel. Customer-inspectable. For regulated firms under MiFID II, DORA, SEC 17a-4, CFTC Part 1.31: documentation that isolation is mathematically proven (not just tested) is materially different compliance posture than "we run our own hardware." First such capability in any major hyperscaler.

**7. Graviton4 Per-Core Memory Bandwidth Beats AMD Milan-X, Matches Genoa.** 5.6 GB/s/core vs Milan-X 3.1 and Genoa 4.8. For memory-bandwidth-bound workloads at fixed core count, Graviton4 wins the DRAM race against most AMD/Intel alternatives. Catch: this advantage inverts on a per-socket basis at higher core counts.

**8. SME2 on Graviton5 Is the Critical Unknown.** Graviton5 implements ARMv9.2-A (the ISA that introduces SME2). KleidiAI ecosystem targets SME2 automatically. If SME2 ships in Graviton5, per-core matrix throughput could rise up to 4×, shifting the ridge point significantly. ARM has not explicitly confirmed SME2 in CSS V3 / V3 documentation. Verify via `/proc/cpuinfo` on M9g preview before citing on panel. This is the single most time-sensitive gap.

---

## 9. Sources

| # | Title | URL | Tier | Date |
|---|---|---|---|---|
| 1 | Chips and Cheese — Neoverse V2 in Graviton 4 | https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4 | 2 | Jul 2024 |
| 2 | Chips and Cheese — Hot Chips 2023 V2 | https://chipsandcheese.com/p/hot-chips-2023-arms-neoverse-v2 | 2 | Sep 2023 |
| 3 | NextPlatform — Graviton5 Different Balance | https://www.nextplatform.com/2025/12/04/aws-graviton5-strikes-a-different-balance-for-server-cpus/ | 2 | Dec 2025 |
| 4 | Tom's Hardware — 192-core Graviton5 | https://www.tomshardware.com/pc-components/cpus/amazon-unveils-192-core-graviton5-cpu-with-massive-180-mb-l3-cache-in-tow-ambitious-server-silicon-challenges-high-end-amd-epyc-and-intel-xeon-in-the-cloud | 3 | Dec 2025 |
| 5 | The Register — Graviton5 192-core | https://www.theregister.com/2025/12/04/amazon_graviton_5/ | 3 | Dec 2025 |
| 6 | About Amazon — Graviton5 announcement | https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2 | 1 | Dec 2025 |
| 7 | AWS — EC2 M9g | https://aws.amazon.com/ec2/instance-types/m9g/ | 1 | Dec 2025 |
| 8 | WikiChip — Graviton4 | https://en.wikichip.org/wiki/annapurna_labs/graviton/graviton4 | 2 | 2024 |
| 9 | ARM — Neoverse V3 product page | https://www.arm.com/products/silicon-ip-cpu/neoverse/neoverse-v3 | 1 | 2024 |
| 10 | ARM — CMN-S3 product page | https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3 | 1 | 2024 |
| 11 | AWS — EC2 C8g | https://aws.amazon.com/ec2/instance-types/c8g/ | 1 | 2024 |
| 12 | AWS — EC2 R8g | https://aws.amazon.com/ec2/instance-types/r8g/ | 1 | 2024 |
| 13 | AWS — EC2 M8g | https://aws.amazon.com/ec2/instance-types/m8g/ | 1 | 2024 |
| 14 | AWS — C8gn 600 Gbps blog | https://aws.amazon.com/blogs/aws/new-amazon-ec2-c8gn-instances-powered-by-aws-graviton4-offering-up-to-600gbps-network-bandwidth/ | 1 | 2024 |
| 15 | NW Quantum — NIE Isabelle/HOL | https://nwquantum.uw.edu/2026/04/17/isabelle-hol-the-proof-assistant-behind-the-nitro-isolation-engine/ | 3 | Apr 2026 |
| 16 | TYPES/announce — NIE formally verified | http://www.mail-archive.com/types-announce@lists.seas.upenn.edu/msg11775.html | 2 | 2025/2026 |
| 17 | ARM — NVLink Fusion Neoverse | https://newsroom.arm.com/news/arm-neoverse-nvidia-nvlink | 1 | Nov 2025 |
| 18 | ARM — Cobalt 200 CSS V3 | https://newsroom.arm.com/blog/microsoft-azure-cobalt-200-arm-neoverse-css-v3 | 1 | Nov 2025 |
| 19 | ARM — Scalable Matrix Extension | https://newsroom.arm.com/blog/scalable-matrix-extension | 1 | 2024 |
| 20 | ClearML — llama.cpp on Graviton | https://clear.ml/blog/benchmarking-llama-cpp-on-arm-neoverse-based-aws-graviton-instances-with-clearml | 2 | 2024 |
| 21 | ARM Developer — Llama 3 70B on Graviton4 | https://developer.arm.com/community/arm-community-blogs/b/servers-and-cloud-computing-blog/posts/running-llama-3-70b-on-aws-graviton4 | 1 | 2024 |
| 22 | JAX Scaling Book — Rooflines | https://jax-ml.github.io/scaling-book/roofline/ | 2 | 2024/2025 |
| 23 | NVIDIA — Grace CPU architecture | https://developer.nvidia.com/blog/nvidia-grace-cpu-superchip-architecture-in-depth/ | 1 | 2023 |
| 24 | NVIDIA — Grace perf/watt | https://developer.nvidia.com/blog/nvidia-grace-cpu-delivers-high-bandwidth-and-efficiency-for-modern-data-centers/ | 1 | 2023/24 |
| 25 | NextPlatform — Graviton4 announce | https://www.nextplatform.com/2023/11/28/aws-adopts-arm-v2-cores-for-expansive-graviton4-server-cpu/ | 2 | Nov 2023 |
| 26 | RealWorldTech — V2 SVE2 4x128 | https://www.realworldtech.com/forum/?threadid=208612&curpostid=208674 | 3 | 2023 |
| 27 | ARM Developer — Neoverse V2 for AI | https://developer.arm.com/community/arm-community-blogs/b/servers-and-cloud-computing-blog/posts/neoverse-v2-for-ai | 1 | 2023 |
| 28 | Igor's Lab — Graviton5 details | https://www.igorslab.de/en/graviton5-amazon-shows-the-x86-world-where-the-hammer-hangs-192-arm-cores-against-amd-and-intel/ | 3 | Dec 2025 |
| 29 | InfoQ — AWS Graviton5/M9g | https://www.infoq.com/news/2026/01/aws-graviton-m9g/ | 3 | Jan 2026 |
| 30 | Dev.Classmethod — M9g preview | https://dev.classmethod.jp/en/articles/ec2-m9g-instances-graviton5-processors-preview/ | 3 | Dec 2025 |
| 31 | NVIDIA — H100 specs | https://www.nvidia.com/en-us/data-center/h100/ | 1 | 2023/24 |
| 32 | Phoronix — Graviton4 benchmarks | https://www.phoronix.com/review/aws-graviton4-benchmarks | 3 | Jul 2024 |
| 33 | NextPlatform — Graviton4 memory boost | https://www.nextplatform.com/2024/09/19/aws-boosts-memory-capacity-on-graviton-4-compute/ | 2 | Sep 2024 |
| 34 | AWS — Graviton llama.cpp guide | https://github.com/aws/aws-graviton-getting-started/blob/main/machinelearning/llama.cpp.md | 1 | 2024 |

---

## 10. Known Gaps

**Memory Topology:**
- CMN-S3 topology (grid, max cores, BW, snoop filter sizing) — ARM page is marketing only
- Graviton5 die topology — single monolithic vs multi-die package not confirmed
- Graviton5 L1/L2/L3 measured latencies — no Chips and Cheese equivalent yet
- Per-instance DDR5 speed configurability for M9g and forthcoming R9g
- Graviton5 DRAM latency improvement claim (sub-100 ns) — no measured value

**Compute:**
- **SME2 status on Graviton5** — single most important unknown for inference discussion
- V3 SVE2 pipe count/width confirmation (LIKELY 4×128, not confirmed)
- V3 ROB / OoO / scheduler microarch details
- Graviton5 per-core or per-socket TDP

**Instance/Availability:**
- M9g instance type table (vCPU/memory/network per size)
- M9g pricing
- C9g/R9g specs
- EFA support on any Graviton5 family
- Region availability for M9g preview

**Interconnect:**
- NVLink Fusion bandwidth for V3 ↔ NVIDIA GPU (no shipping silicon)
- UALink in any AWS chip (no announcement)

**Benchmarks:**
- Measured STREAM Triad/Copy/Add for Graviton5
- Independent inference tokens/sec for Graviton5
- Phoronix or OpenBenchmarking.org benchmarks for M9g

---

## Freshness

Graviton5 announced Dec 2025, in preview as of April 2026. AWS official sources current but deliberately sparse. Chips and Cheese Graviton4 analysis (Jul 2024) is the most quantitatively detailed source for V2; **no equivalent exists for Graviton5/V3 yet**. NVIDIA Grace data 2023-2024 (current for H100 reference; potentially outdated vs B200/Blackwell). NVLink Fusion protocol announcement Nov 2025 — current but no shipping silicon. **Single most time-sensitive gap to close before STAC: SME2 status on Graviton5** — verifiable via `/proc/cpuinfo` on M9g preview or AWS support.
