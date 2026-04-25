# Track 3b — AMD EPYC Turin (Zen 5) Memory Architecture Deep Dive

**Researched on:** 2026-04-23
**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Audience:** Capital markets technology leads (tail latency, jitter, determinism, power envelope, data movement)

---

## 1. Cache and Memory Hierarchy

### 1.1 Per-Core L1 Cache

| Parameter | Zen 5 (Turin) | Zen 4 (Genoa) | Change |
|---|---|---|---|
| L1I size | 32 KB | 32 KB | Unchanged |
| L1I associativity | 8-way | 8-way | Unchanged |
| L1D size | **48 KB** | 32 KB | +50% |
| L1D associativity | **12-way** | 8-way | +50% |
| L1D load-to-use latency | **4 cycles** | 4 cycles | Maintained |
| L1D bandwidth | 2×512-bit loads + 1×512-bit store/cycle | 2×256-bit loads | 2× |
| L1D-to-L2 datapath | **512-bit** | 256-bit | 2× |
| Outstanding L1 misses tracked | **124** | 24 | 5.2× |

[VERIFIED] L1D is 48 KB / 12-way / 4 cycles. Outstanding L1 miss tracking jumped 24 → 124 (5.2× MLP). (Source: [Chips and Cheese — Zen 5 at Hot Chips 2024](https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024), accessed 2026-04-23)

### 1.2 Per-Core L2 Cache

| Parameter | Zen 5 (Turin) | Zen 4 (Genoa) |
|---|---|---|
| L2 size | 1 MB | 512 KB |
| L2 associativity | **16-way** | 8-way |
| L2 latency | ~14 cycles | ~12 cycles |
| L2 bandwidth | **64 B/cycle** | 32 B/cycle |

### 1.3 L3 Per CCD

| Parameter | Zen 5 CCD (Turin) | Zen 5c CCD (Turin Dense) |
|---|---|---|
| Cores per CCD | 8 | 16 |
| L3 per CCD | 32 MB | 32 MB |
| L3 per core | 4 MB | 2 MB |
| L3 associativity | 16-way | 16-way |
| L3 latency | ~46 cycles (−3.5 vs Zen 4) | ~46 cycles |
| CCD-to-IO link | GMI3-W (2 GMI links per CCD) | GMI3-W |
| Bandwidth per CCD to IOD | 64 B/cycle bidirectional | 64 B/cycle bidirectional |

[VERIFIED] L3 latency reduced 3.5 cycles vs Zen 4. Turin uses GMI3-W (2 GMI links/CCD, 64 B/cycle bidi). Desktop Zen 5 gets only one GMI link. (Source: [Chips and Cheese — AMD's Turin 5th Gen EPYC](https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched), accessed 2026-04-23)

### 1.4 Per-Socket L3 Totals

| SKU Family | CCDs | L3/CCD | Total L3 | Core Type | Cores |
|---|---|---|---|---|---|
| Turin (standard) | up to 16 | 32 MB | **up to 512 MB** | Zen 5 | up to 128 |
| Turin Dense | up to 12 | 32 MB | **up to 384 MB** | Zen 5c | up to 192 |
| Turin-X (3D V-Cache) | N/A | N/A | **Never launched** | — | — |

[VERIFIED] EPYC 9755 (128c): 512 MB L3 + 128 MB L2 + ~10 MB L1 = **650 MB total cache**. Turin-X with 3D V-Cache was never launched for 9005 — AMD is skipping directly to Venice-X (2026). (Source: [StorageReview Turin review](https://www.storagereview.com/review/amd-epyc-turin-review-192-cores-of-zen-5); [Chips and Cheese CES 2026 Venice/MI400](https://chipsandcheese.com/p/ces-2026-taking-the-lids-off-amds), accessed 2026-04-23)

### 1.5 CCX Topology

| Variant | Cores/CCX | CCX/CCD | Cores/CCD |
|---|---|---|---|
| Zen 5 (Turin) | 8 | 1 | 8 |
| Zen 5c (Turin Dense) | 16 | 1 | 16 |

[VERIFIED] Turin: 1 CCX of 8 cores/CCD. Turin Dense: 1 CCX of 16 cores/CCD. 12 CCDs × 16 cores = 192 max. (Source: [NextPlatform — AMD Turns The Screws](https://www.nextplatform.com/2024/10/10/amd-turns-the-screws-with-turin-server-cpus/), accessed 2026-04-23)

### 1.6 Infinity Fabric and IO Die

IO die: TSMC 6nm. Contains 12 Unified Memory Controllers (UMCs), 16 GMI ports (one per CCD), 8 combo I/O links (G0-G3, P0-P3; each 16 lanes at 32 GT/s for PCIe or xGMI), Infinity Fabric mesh.

GMI links to CCDs: 16 links at 36 Gb/s, 2 per CCD (GMI-Wide), coherent data fabric from each CCD to central IO die.

(Source: [Thomas-Krenn EPYC 9005](https://www.thomas-krenn.com/en/wiki/AMD_EPYC_9005_Turin); [NASA HECC Turin](https://www.nas.nasa.gov/hecc/support/kb/amd-turin-processors_714.html), accessed 2026-04-23)

### 1.7 NUMA Modes (NPS)

| NPS Mode | NUMA Domains/Socket | Memory Interleave | Recommended |
|---|---|---|---|
| NPS0 | 1 (monolithic) | All 12 channels | Avoid; >220 ns DRAM latency |
| NPS1 | 1 | All 12 channels interleaved | Default, general workloads |
| NPS2 | 2 | 6 channels per hemisphere | Mixed/network workloads |
| NPS4 | 4 | 3 channels per quadrant | HPC, NUMA-aware |
| L3CAN | Per CCD | NPS1 interleave | Scheduler locality without remap |

[VERIFIED] NPS0 penalty: >220 ns DRAM latency (~90 ns over NPS1). Cross-NUMA in NPS2/NPS4: ≤140 ns unloaded, +20-30 ns boundary penalty. (Source: [Chips and Cheese UMA Turin](https://chipsandcheese.com/p/evaluating-uniform-memory-access); [Chips and Cheese 9355P](https://chipsandcheese.com/p/amds-epyc-9355p-inside-a-32-core), accessed 2026-04-23)

### 1.8 Measured Latencies

| Access Point | Latency |
|---|---|
| L1D | 4 cycles (~0.8 ns @5 GHz) |
| L2 | ~14 cycles (~3 ns @4.5 GHz) |
| L3 (local CCD) | ~46 cycles (~10 ns @4.5 GHz) |
| DRAM (local, NPS1) | ~130-140 ns |
| DRAM (NPS0 uniform) | >220 ns |
| Core-to-core (intra-CCD) | ~45 ns |
| Core-to-core (inter-CCD) | **~150 ns** |
| Socket-to-socket (2P) | **~260 ns** |

[VERIFIED] (Source: [Chips and Cheese Turin launch](https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched), accessed 2026-04-23)

---

## 2. DRAM Subsystem

### 2.1 Memory Configuration

| Parameter | Turin (9005) | Genoa (9004) |
|---|---|---|
| DDR channels | 12 | 12 |
| DDR generation | DDR5 | DDR5 |
| Max DDR5 speed | **DDR5-6400** | DDR5-4800 |
| Max capacity/socket | 6 TB | 6 TB |
| DIMMs per channel | 2 | 2 |
| MRDIMM support | **No** | No |

[VERIFIED] 12 × DDR5-6400. AMD explicitly does NOT support MRDIMM in 9005 — waiting for JEDEC standardization. (Source: [AMD EPYC 9005 Series](https://www.amd.com/en/products/processors/server/epyc/9005-series.html); [Kingston Turin memory](https://www.kingston.com/en/memory/server-memory/turin), accessed 2026-04-23)

### 2.2 Peak Bandwidth

| Calc | Value |
|---|---|
| DDR5-6400 × 8 bytes × 12 ch | **614.4 GB/s per socket** |
| AMD 9965 vendor cite | **614 GB/s** |
| 2P EPYC 9965 theoretical | ~1,228 GB/s |

### 2.3 STREAM Measured

| Config | STREAM Triad |
|---|---|
| 1P EPYC 9575F, 12ch DDR5-6000 | ~348 GB/s (raw) |
| 1P 9575F socket reads | ~570 GB/s (near-theoretical) |
| 2P EPYC 9965 | 808-883 GB/s |

[VERIFIED] (Source: [Phoronix 8 vs 12 ch DDR5-6000](https://www.phoronix.com/forums/forum/hardware/processors-memory/1507066-8-vs-12-channel-ddr5-6000-memory-performance-with-amd-5th-gen-epyc); [Chips and Cheese Turin launch](https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched); [StorageReview Turin](https://www.storagereview.com/review/amd-epyc-turin-review-192-cores-of-zen-5), accessed 2026-04-23)

### 2.4 Per-Core Bandwidth

| SKU | Cores | BW/socket | **BW per Core** |
|---|---|---|---|
| EPYC 9575F | 64 | 614 GB/s | **9.6 GB/s** |
| EPYC 9755 | 128 | 614 GB/s | **4.8 GB/s** |
| EPYC 9965 | 192 | 614 GB/s | **3.2 GB/s** |

**Critical for capital markets:** per-core bandwidth degrades sharply with core count. The 64-core 9575F is a fundamentally different machine from the 192-core 9965 for memory-bound workloads — 3× the per-core DRAM bandwidth.

### 2.5 MRDIMM Status April 2026

[VERIFIED] AMD EPYC 9005 does NOT support MRDIMM. AMD waiting for full JEDEC standardization. Intel Xeon 6 supports MRDIMM at DDR5-8800 (~500 GB/s/socket in some configs). For memory-bandwidth-dominated workloads this is a meaningful competitive gap — though Turin's 12 × DDR5-6400 = 614 GB/s still beats Granite Rapids standard DDR5-6400 and competes with MRDIMM. (Source: [ServeTheHome EPYC 9005 launch](https://www.servethehome.com/amd-epyc-9005-turin-turns-transcendent-performance-solidigm-broadcom/2/), accessed 2026-04-23)

### 2.6 CXL 2.0

[VERIFIED] EPYC 9005 supports CXL 2.0 Type 1/2/3. Type-3 memory expansion is AMD's focus. Shares PCIe Gen 5 lanes with PCIe devices. 128 PCIe 5.0 lanes split between devices and CXL-attached memory. (Source: [NextPlatform AMD Turin](https://www.nextplatform.com/2024/10/10/amd-turns-the-screws-with-turin-server-cpus/), accessed 2026-04-23)

---

## 3. Interconnect and PCIe

### 3.1 PCIe Configuration

| Parameter | Value |
|---|---|
| PCIe generation | Gen 5 |
| Lanes per socket (1P) | **128 lanes** |
| Lanes per socket (2P, 3 xGMI) | 80 lanes (160 total) |
| Lanes per socket (2P, 4 xGMI) | 64 lanes (128 total) |
| CXL version | CXL 2.0 |

### 3.2 xGMI Inter-Socket Links (2P)

| Mode | Links | Lanes/Link | Speed | BW |
|---|---|---|---|---|
| High-BW | 4 links | 16 | 32 GT/s | ~512 GB/s |
| High-IO | 3 links | 16 | 32 GT/s | ~384 GB/s |

[VERIFIED] 4-link mode delivers ~512 GB/s inter-socket — exceeds per-socket DDR5 bandwidth (614 GB/s), enabling near-full remote memory access. (Source: [Lenovo Press xGMI config](https://lenovopress.lenovo.com/lp1852-configuring-amd-xgmi-links-on-thinksystem-sr665-v3), accessed 2026-04-23)

### 3.3 AWS Host-to-Accelerator

[VERIFIED] M8a/R8a/C8a are standalone CPU-only. AWS does not pair Turin with GPUs. GPU instances (P5, Trn2, G6) use different host silicon. Turin's GPU-host value is realized on-premises — EPYC 9575F (5.0 GHz) improves 8× GPU rack TTFT by 13-28%. (Source: [AMD EPYC 9575F AI blog](https://www.amd.com/en/blogs/2025/maximizing-ai-performance-the-role-of-amd-epyc-9575f-cpus.html), accessed 2026-04-23)

---

## 4. Vector and Matrix Compute (AVX-512 Native 512-bit)

### 4.1 Datapath Architecture

| Feature | Zen 5 (Turin) | Zen 4 (Genoa) |
|---|---|---|
| AVX-512 datapath width | **Native 512-bit** | Double-pumped 256-bit |
| FP/vector pipes | **4 × 512-bit** | 3 × 256-bit (double-pumped) |
| AVX-512 throughput | **1 instr/cycle** | 1 instr / 2 cycles |
| Power mode option | BIOS 256-bit double-pump | Always double-pump |

### 4.2 Per-Core FP/SIMD Throughput

| Data Type | Elements/Reg | FMA/cycle | Pipes | **Ops/cycle/core** |
|---|---|---|---|---|
| FP64 | 8 | 2 | 2 | **32 FLOPS** |
| FP32 | 16 | 2 | 2 | **32 FLOPS** |
| FP16 (AVX-512 FP16) | 32 | 2 | 2 | **64 FLOPS** |
| BF16 (VDPBF16PS) | 32 | 2 | 2 | **64 FLOPS** |
| INT8 (VNNI) | 64 | 2 | 2 | **128 INT8 OPS** |

[VERIFIED] FP32 = 32 FLOPs/cycle with native 512-bit FMA. (Source: [AMD HPC Leadership blog](https://www.amd.com/en/blogs/2025/leadership-hpc-performance-with-5th-generation-amd.html); [NASA HECC Turin](https://www.nas.nasa.gov/hecc/support/kb/amd-turin-processors_714.html), accessed 2026-04-23)

### 4.3 Per-Socket Peak (sustained, base clock)

| SKU | Cores | Base | FP64 TFLOPS | FP32 TFLOPS | BF16 TFLOPS | INT8 TOPS |
|---|---|---|---|---|---|---|
| EPYC 9575F | 64 | 3.3 | 6.8 | 6.8 | 13.5 | 27.1 |
| EPYC 9755 | 128 | 2.7 | 11.1 | 11.1 | 22.1 | 44.2 |
| EPYC 9965 | 192 | 2.25 | 13.8 | 13.8 | 27.6 | 55.3 |

### 4.4 IPC Uplift vs Zen 4

| Metric | Uplift |
|---|---|
| Integer IPC | +17% |
| **FP IPC (HPC/AI 24-workload geomean)** | **+37%** |
| SPEC CPU2017 FP rate | +29.4% to +55.9% |

(Source: [NextPlatform AMD Turin](https://www.nextplatform.com/2024/10/10/amd-turns-the-screws-with-turin-server-cpus/), accessed 2026-04-23)

---

## 5. Arithmetic Intensity / Roofline

### 5.1 Ridge Points per Socket

| SKU | Precision | Peak Compute | Peak BW | **Ridge (ops/byte)** |
|---|---|---|---|---|
| EPYC 9575F | FP32 | 6.8 TFLOPS | 614 GB/s | **~11.1** |
| EPYC 9755 | FP32 | 11.1 TFLOPS | 614 GB/s | **~18.1** |
| EPYC 9965 | FP32 | 13.8 TFLOPS | 614 GB/s | **~22.5** |
| EPYC 9755 | BF16 | 22.1 TFLOPS | 614 GB/s | **~36.0** |
| EPYC 9965 | BF16 | 27.6 TFLOPS | 614 GB/s | **~45.0** |
| EPYC 9965 | INT8 | 55.3 TOPS | 614 GB/s | **~90** |

### 5.2 Cross-Chip Comparison (Panel Context)

| Chip | Peak BW | Peak BF16 | **Ridge BF16** |
|---|---|---|---|
| EPYC 9755 (Turin) | 614 GB/s | 22.1 TFLOPS | **36** |
| EPYC 9965 (Turin Dense) | 614 GB/s | 27.6 TFLOPS | **45** |
| Graviton5 (192c) | ~691 GB/s (DDR5-7200) | ~37.9 TFLOPS | **~55** |
| H100 SXM | 3.35 TB/s | ~989 TFLOPS dense | **~295** |
| H100 (sparsity) | 3.35 TB/s | ~1,979 TFLOPS | **~590** |
| B200 | 8.0 TB/s | ~4,500 TFLOPS | **~562** |

**Panel insight:** LLM decode AI is ~0.5-2 FLOPs/byte — sits deep in memory-bound region on every chip in this table. Turin 9965 sustains ~176 t/s for Llama 3.1 70B BF16; H100 ~512 t/s. 2.9× gap, far less than raw compute gap (~100×). Ridge point only matters when batch size and sequence length drive AI above ~18-22 FLOPs/byte (for Turin FP32). (Source: [AMD vLLM blog](https://www.amd.com/en/blogs/2025/unlocking-optimal-llm-performance-on-amd-epyc--cpus-with-vllm.html), accessed 2026-04-23)

### 5.3 Measured LLM Throughput

| Platform | Model | Config | Tokens/sec |
|---|---|---|---|
| 2P EPYC 9755 (PACE + PARD spec) | Llama3 series | Data parallel | **Up to 380 t/s** |
| 2P EPYC 9965 (vLLM, BF16) | Llama-3.1-70B | Decode | ~176 t/s |
| 2P EPYC 9575F (vLLM, 300ms TTFT) | Llama-3.3-70B | Goodput | 346 t/s |
| 2P Turin (llama.cpp) | Llama-3.1-70B f16 | 2P vs 1P | ~105% of 1P (poor scaling) |

[VERIFIED] 380 t/s with PARD + AMD PACE speculative decoding on 2P EPYC 9755. 2P scaling in llama.cpp is poor (~105% of 1P) because inter-socket xGMI becomes the bottleneck for weight streaming. (Sources: [AMD PARD + PACE](https://www.amd.com/en/developer/resources/technical-articles/2025/speculative-llm-inference-on-the-5th-gen-amd-epyc-processors-wit.html); [llama.cpp discussions #11733](https://github.com/ggml-org/llama.cpp/discussions/11733), accessed 2026-04-23)

---

## 6. Power and Process

### 6.1 Process Nodes

| Die | Process | Notes |
|---|---|---|
| Zen 5 CCD | TSMC N4 (4nm) | Standard Turin |
| Zen 5c CCD | TSMC N3E (3nm) | Turin Dense; 25% smaller/core |
| IO Die | TSMC 6nm | 12 UMCs, PCIe, fabric hub |

[VERIFIED] (Sources: [NextPlatform](https://www.nextplatform.com/2024/10/10/amd-turns-the-screws-with-turin-server-cpus/); [Tom's Hardware Zen 5c](https://www.tomshardware.com/pc-components/cpus/amd-dishes-more-zen-5-details-compact-core-is-25-smaller-than-the-normal-core-new-soc-architecture-disclosed), accessed 2026-04-23)

### 6.2 TDP Range

| SKU | Cores | TDP |
|---|---|---|
| EPYC 9015 | 8 | 125W |
| EPYC 9355P | 32 | 280W |
| EPYC 9655P | 96 | 400W |
| EPYC 9755 | 128 | 500W |
| EPYC 9575F | 64 | 400W (cTDP 320-400W) |
| EPYC 9965 | 192 | **500W** |

Platform range: **125W to 500W**.

### 6.3 Perf/Watt

| Metric | Result |
|---|---|
| EPYC 9965 vs Genoa | +17% net perf/W at +32% power |
| 2P EPYC 9755 vs 2P Xeon 6980P | AMD 40% faster throughput; Xeon 6980P peaks 547W |
| EPYC 9965 vs AmpereOne 192c ARM | 1.6× perf at 1.2× power = **~33% better perf/W** |
| 2P EPYC 9965 vs Grace Superchip | **3.34× better SPECpower_ssj2008** (44,168 vs 13,218 ops/W) |

[VERIFIED] (Source: [Phoronix EPYC 9965 vs AmpereOne](https://www.phoronix.com/review/amd-epyc-9965-ampereone/5); [AMD generation leadership blog](https://www.amd.com/en/blogs/2025/another-generation-of-leadership-amd-epyc-9005-vs-intel-xeon-6.html), accessed 2026-04-23)

---

## 7. AWS Instance Lineup

### 7.1 Family Overview

| Family | Class | Launch | CPU | Max Clock | SMT | Mem ratio |
|---|---|---|---|---|---|---|
| M8a | General | Oct 8 2025 | EPYC 9R45 | 4.5 GHz | No | 4 GiB/vCPU |
| M8azn | High-Freq | 2025 | EPYC 9005 binned | **5.0 GHz** | No | 4 GiB/vCPU |
| R8a | Memory | Nov 5 2025 | EPYC 9R45 | 4.5 GHz | No | 8 GiB/vCPU |
| C8a | Compute | Dec 2025 | EPYC 9R45 | 4.5 GHz | No | 2 GiB/vCPU |

All no-SMT (1 vCPU = 1 physical core). 6th-gen Nitro cards. AMD SME AES-256 always-on.

### 7.2 M8a Key Sizes

| Size | vCPU | Mem GiB | Net Gbps | EBS Gbps |
|---|---|---|---|---|
| m8a.2xlarge | 8 | 32 | Up to 15 | Up to 10 |
| m8a.24xlarge | 96 | 384 | 40 | 30 |
| m8a.48xlarge | 192 | 768 | 75 | 60 |
| **m8a.metal-48xl** | **192** | **768** | **75** | **60** |

### 7.3 R8a Key Sizes

| Size | vCPU | Mem GiB | Net Gbps | EBS Gbps |
|---|---|---|---|---|
| r8a.2xlarge | 8 | 64 | Up to 15 | Up to 10 |
| r8a.24xlarge | 96 | 768 | 40 | 30 |
| r8a.48xlarge | 192 | 1,536 | 75 | 60 |
| **r8a.metal-48xl** | **192** | **1,536** | **75** | **60** |

Sample on-demand pricing: r8a.large $0.15976/hr, r8a.xlarge $0.31952/hr US East. (Source: [Vantage r8a.large](https://instances.vantage.sh/aws/ec2/r8a.large?currency=USD), accessed 2026-04-23)

### 7.4 C8a Key Sizes

| Size | vCPU | Mem GiB | Net Gbps | EBS Gbps |
|---|---|---|---|---|
| c8a.2xlarge | 8 | 16 | Up to 15 | Up to 10 |
| c8a.24xlarge | 96 | 192 | 40 | 30 |
| c8a.48xlarge | 192 | 384 | 75 | 60 |
| **c8a.metal-48xl** | **192** | **384** | **75** | **60** |

### 7.5 Generation Uplifts

| Metric | M8a vs M7a | R8a vs R7a |
|---|---|---|
| Performance | +30% | +30% |
| Memory bandwidth | +45% | +45% |
| Network | +50% (up to 75 Gbps) | +50% |
| Price-performance | — | +19% |
| HammerDB MySQL | +55% | +55% (vs R7a); +74% vs R6a |

(Source: [AWS R8a performance blog](https://aws.amazon.com/blogs/compute/performance-benefits-of-new-amazon-ec2-r8a-memory-optimized-instances/), accessed 2026-04-23)

### 7.6 M8azn — 5 GHz Latency Play

| Size | vCPU | Mem GiB | Net Gbps | EBS Gbps |
|---|---|---|---|---|
| m8azn.24xlarge | 96 | 384 | **200** | 60 |
| m8azn.metal-24xl | 96 | 384 | 200 | 60 |

M8azn: "highest maximum CPU frequency in cloud at 5 GHz." 96 vCPU / 384 GiB max. Target for tick-to-trade cloud optimization. (Source: [Amazon EC2 M8a](https://aws.amazon.com/ec2/instance-types/m8a/), accessed 2026-04-23)

### 7.7 NUMA Topology per Virtualized Size

[UNKNOWN] AWS does not publicly document NPS mode per virtualized M8a/R8a/C8a instance size. On bare metal sizes (metal-24xl, metal-48xl) customer controls NPS via BIOS.

---

## 8. Capital Markets Talking Points

1. **Memory bandwidth is the binding constraint for LLM decode on Turin — but Turin leads CPUs.** 614 GB/s per socket at 12-channel DDR5-6400 — highest per-socket DDR5 bandwidth of any x86 server CPU today. Intel achieves parity only with MRDIMM (which AMD has not adopted). For memory-bound workloads including LLM decode and risk model inference, Turin's bandwidth headroom is real.

2. **AVX-512 doubling is a genuine compute uplift for quant workloads.** Zen 5's native 512-bit datapath doubles vector throughput per clock vs Zen 4: 32 FP32 FLOPs/cycle/core. For fixed-income analytics, VaR simulations, matrix ops in risk engines — this is a no-code 2× improvement via `-march=znver5` recompile.

3. **MRDIMM absence is deliberate, not an oversight.** Intel Granite Rapids supports DDR5-8800 MRDIMM (~500 GB/s). Turin's 12 × DDR5-6400 = 614 GB/s actually exceeds most Granite Rapids MRDIMM configs. Intel: high BW with fewer slots. AMD: more channels for bandwidth AND capacity (6 TB/socket). For capital markets firms with large in-memory datasets, AMD's capacity advantage matters.

4. **Per-core bandwidth degrades sharply with core count — choose the right SKU.** 192c 9965 has 3.2 GB/s/core; 64c 9575F has 9.6 GB/s/core. For latency-sensitive, memory-bound trading apps — OMS, execution engines, market data consumers — the 9575F at 5.0 GHz and 9.6 GB/s/core is a fundamentally different machine than the 9965. Wrong Turin SKU leaves both frequency and bandwidth on the table.

5. **Cross-CCD latency is 150 ns — NUMA-aware pinning is not optional.** Turin's chiplet architecture imposes ~150 ns inter-CCD, ~260 ns inter-socket latency. Workloads sharing data across CCDs/sockets suffer measurable jitter. NPS4 with L3CAN scheduling hints reduces this; NUMA-unaware deployments have non-deterministic tail latency. **Graviton5 (monolithic die) does not have this hazard.**

6. **Turin Dense's BF16 ridge point is 45 FLOPs/byte — batch=1 inference never crosses it.** Single-token decode on 70B model: AI ~0.5-2 FLOPs/byte — 20-90× below the BF16 ridge. Inference is entirely memory-bandwidth-bound. Buying compute (more cores, higher TFLOPS) does NOT improve decode latency; buying memory bandwidth does. This is the core thesis of the panel.

7. **M8azn at 5 GHz is the cloud-accessible latency play, not M8a/R8a.** Standard M8a/R8a top out at 4.5 GHz. M8azn metal-24xl (96 vCPU, 200 Gbps network) is the target for tick-to-trade optimization in cloud. Use M8azn where clock matters, not standard M8a.

8. **Turin beats Graviton on power efficiency vs 192-core ARM.** Against AmpereOne (192 ARM cores), EPYC 9965 delivers 1.6× performance at 1.2× power — net ~33% better perf/W. 3.34× SPECpower advantage over Grace Superchip. The ARM efficiency narrative is workload-specific and narrowing.

9. **Turin-X with 3D V-Cache was cancelled; Venice-X is H2 2026.** AMD skipped Turin-X for 9005. For firms planning HPC or cache-sensitive quant model refreshes, the next meaningful cache capacity upgrade is 12-18 months out via Venice-X. (Source: [Chips and Cheese CES 2026](https://chipsandcheese.com/p/ces-2026-taking-the-lids-off-amds), accessed 2026-04-23)

10. **CXL 2.0 is live on Turin, no AWS surface yet.** Turin supports CXL 2.0 Type-3 memory expansion. AWS does not currently offer CXL on M8a/R8a/C8a. On-prem Turin can expand beyond 6 TB/socket, relevant for in-memory analytics and real-time risk grids.

---

## 9. Sources

All sources current (Oct 2024 - Apr 2026), accessed 2026-04-23.

Tier 1 official: [AMD EPYC 9005](https://www.amd.com/en/products/processors/server/epyc/9005-series.html), [AWS M8a](https://aws.amazon.com/ec2/instance-types/m8a/), [AWS R8a](https://aws.amazon.com/ec2/instance-types/r8a/), [AWS C8a](https://aws.amazon.com/ec2/instance-types/c8a/), [AWS M8a blog](https://aws.amazon.com/blogs/aws/new-general-purpose-amazon-ec2-m8a-instances-are-now-available/), [AWS R8a performance](https://aws.amazon.com/blogs/compute/performance-benefits-of-new-amazon-ec2-r8a-memory-optimized-instances/), [AWS C8a What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/compute-optimized-amazon-ec2-c8a-instances/), [AMD HPC leadership](https://www.amd.com/en/blogs/2025/leadership-hpc-performance-with-5th-generation-amd.html), [AMD AVX-512 validation](https://www.amd.com/en/blogs/2026/understanding-avx-512---validating-usage-on-amd-epyc-.html), [AMD vLLM blog](https://www.amd.com/en/blogs/2025/unlocking-optimal-llm-performance-on-amd-epyc--cpus-with-vllm.html), [AMD PARD + PACE](https://www.amd.com/en/developer/resources/technical-articles/2025/speculative-llm-inference-on-the-5th-gen-amd-epyc-processors-wit.html), [AMD EPYC 9575F AI](https://www.amd.com/en/blogs/2025/maximizing-ai-performance-the-role-of-amd-epyc-9575f-cpus.html), [AMD 9005 AI inference](https://www.amd.com/en/products/processors/server/epyc/ai/9005-inference.html), [AMD gen leadership blog](https://www.amd.com/en/blogs/2025/another-generation-of-leadership-amd-epyc-9005-vs-intel-xeon-6.html), [NASA HECC Turin](https://www.nas.nasa.gov/hecc/support/kb/amd-turin-processors_714.html).

Tier 2 technical: [Wikipedia Zen 5](https://en.wikipedia.org/wiki/Zen_5), [Chips and Cheese Turin launch](https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched), [Chips and Cheese Zen 5 Hot Chips 2024](https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024), [Chips and Cheese 9355P](https://chipsandcheese.com/p/amds-epyc-9355p-inside-a-32-core), [Chips and Cheese UMA Turin](https://chipsandcheese.com/p/evaluating-uniform-memory-access), [Chips and Cheese CES 2026](https://chipsandcheese.com/p/ces-2026-taking-the-lids-off-amds), [NextPlatform Turin](https://www.nextplatform.com/2024/10/10/amd-turns-the-screws-with-turin-server-cpus/), [StorageReview Turin](https://www.storagereview.com/review/amd-epyc-turin-review-192-cores-of-zen-5), [ServeTheHome Turin launch](https://www.servethehome.com/amd-epyc-9005-turin-turns-transcendent-performance-solidigm-broadcom/2/), [Phoronix 9965 vs AmpereOne](https://www.phoronix.com/review/amd-epyc-9965-ampereone/5), [Phoronix 8 vs 12 ch DDR5](https://www.phoronix.com/forums/forum/hardware/processors-memory/1507066-8-vs-12-channel-ddr5-6000-memory-performance-with-amd-5th-gen-epyc), [Kingston Turin memory](https://www.kingston.com/en/memory/server-memory/turin), [Thomas-Krenn EPYC 9005](https://www.thomas-krenn.com/en/wiki/AMD_EPYC_9005_Turin), [Lenovo xGMI config](https://lenovopress.lenovo.com/lp1852-configuring-amd-xgmi-links-on-thinksystem-sr665-v3), [Tom's Hardware Zen 5c](https://www.tomshardware.com/pc-components/cpus/amd-dishes-more-zen-5-details-compact-core-is-25-smaller-than-the-normal-core-new-soc-architecture-disclosed), [Phoronix M8 AWS benchmarks](https://www.phoronix.com/review/aws-m8a-m8g-m8i-benchmarks).

Tier 3: [Vantage r8a pricing](https://instances.vantage.sh/aws/ec2/r8a.large?currency=USD), [Wccftech Turin launch](https://wccftech.com/amd-5th-gen-epyc-turin-cpus-launch-192-cores-500w-5-ghz-outperforming-xeon/), [llama.cpp 2P Turin scaling](https://github.com/ggml-org/llama.cpp/discussions/11733).

---

## 10. Known Gaps

- **L1/L2/L3 ns latencies on EPYC server silicon** (cycle counts verified; ns conversions [SPECULATIVE] at any specific clock).
- **NUMA topology per virtualized AWS instance size** — AWS does not publish NPS mode for virtualized M8a/R8a/C8a below metal.
- **Official BF16/INT8 per-core TFLOPS from AMD** — no concise table; values derived architecturally.
- **Measured CXL 2.0 latency/bandwidth on Turin** — no third-party benchmark found.
- **Turin-X cancellation official statement** — derived from Venice-X announcement, no AMD PR.
- **M8azn exact SKU** — AWS doesn't publish. Likely EPYC 9575F-class.
- **Graviton5 vs Turin STREAM head-to-head** — Graviton5 only entered preview Dec 2025, no measured comparison published.

**Freshness:** Turin launched Oct 10 2024, in production. AWS M8a/R8a/C8a GA Oct-Dec 2025. All primary sources Oct 2024 - Apr 2026. Technology 18 months old at panel. Venice is the next-gen, announced CES 2026 but not yet launched. Specs stable.
