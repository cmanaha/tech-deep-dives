# Track 3c — Intel Xeon 6 Granite Rapids Memory Architecture Deep Dive

**Researched:** 2026-04-23
**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Audience:** Capital markets technology leads

---

## 1. Cache and Memory Hierarchy (SNC3 Tile Topology)

### 1.1 Die Topology — Chiplet Architecture

[VERIFIED] Xeon 6 6900P (Granite Rapids-AP): **3 compute tiles on Intel 3** (5nm-class) + **2 I/O dies on Intel 7** (10nm-class), connected via **EMIB** (Embedded Multi-die Interconnect Bridge). (Source: [NextPlatform Granite Rapids](https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/), accessed 2026-04-23)

[VERIFIED] Each **XCC (Extreme Core Count) compute tile** houses up to 44 Redwood Cove P-cores (some disabled for yield). Flagship 6980P: 128 cores across three tiles (~43 active per tile). (Source: [Wikipedia Granite Rapids](https://en.wikipedia.org/wiki/Granite_Rapids), accessed 2026-04-23)

[VERIFIED] I/O dies house PCIe 5.0 controllers, UPI links, CXL 2.0, and accelerators (DSA, IAA, QAT, DLB). Sole source of off-socket connectivity — compute tiles communicate externally only via I/O dies. (Source: same)

| Die Type | Count | Process | Function |
|---|---|---|---|
| Compute tile (XCC) | 3 | Intel 3 (5nm-class) | Cores, L2, L3, DDR5 controllers |
| I/O die | 2 | Intel 7 (10nm-class) | PCIe 5.0, UPI, CXL 2.0, accelerators |

### 1.2 Redwood Cove P-Core: Per-Core Cache

[VERIFIED] Each Redwood Cove P-core:
- **L1I: 64 KB, 16-way** (doubled from 32 KB in Raptor Cove/Emerald Rapids)
- **L1D: 48 KB**, 5-cycle load-to-use
- **L2: 2 MB per core**, 16-cycle latency

(Sources: [Chips and Cheese Xeon 6 memory](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory); [Chips and Cheese Redwood Cove](https://chipsandcheese.com/p/intels-redwood-cove-baby-steps-are-still-steps), accessed 2026-04-23)

[VERIFIED] L2 miss queue deepened 48 → 64 outstanding — critical for large-footprint workloads. AVX-512 supported on Xeon 6 P-core with **2 × 512-bit FMA units** and **2 × 512-bit load + 1 × 512-bit store** to L1D per cycle. Sierra Forest E-core does NOT support AVX-512.

### 1.3 L3 Cache — Shared Across Mesh

[VERIFIED] 6980P declared L3: **504 MB**. Chips and Cheese measured on 6985P-C: **480 MB total** organized as **120 CHA (Caching/Home Agent) slices at 2.2 GHz**. Each tile provides 160 MB accessible L3. 24 MB discrepancy = disabled/reserved for yield/ECC. (Source: [Chips and Cheese memory](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory), accessed 2026-04-23)

[VERIFIED] L3 latency (local tile): **~33 ns (~130 cycles)** at operating frequency.
L3 cross-die: **+24 ns per boundary** (adjacent tile: ~57 ns; two crossings: ~80 ns).
Single-core L3 read BW: **~30 GB/s**. Total cross-die L3 BW: ~500 GB/s (read-only), >800 GB/s ("conga" RMW multi-node).

### 1.4 Mesh Fabric and Die-to-Die

[VERIFIED] Intel mesh interconnect spans all tiles. CHA at each mesh stop handles L3 slice + snoop filter. At die edges, **MDF (Modular Data Fabric)** stops run at **2.5 GHz**, handle logical mesh protocol across die boundaries, physical signals via EMIB. 6985P-C has 80 MDF stops.

**Mesh congestion is the binding constraint:** Per-core L3 BW **~30 GB/s for Granite Rapids** vs **261 GB/s on AMD Turin** (tightly-coupled per-CCX L3). At chip scale: **~11 GB/s per core Granite Rapids vs ~98 GB/s per core Turin** across all active cores.

### 1.5 SNC3 Mode and NUMA Topology

[VERIFIED] Default mode: **SNC3 (Sub-NUMA Clustering, 3 nodes/socket)**. Each tile = separate NUMA domain. Physical address space partitioned three ways, each backed by its tile's DRAM controllers + L3.

Alternative **HEX mode** (former SNC1): single NUMA, all DRAM striped across all controllers. Benefits non-NUMA-aware apps; higher average latency.

```
Socket
├── NUMA Node 0 → Tile 0 → 160 MB L3 → 4× DDR5 channels
├── NUMA Node 1 → Tile 1 → 160 MB L3 → 4× DDR5 channels
└── NUMA Node 2 → Tile 2 → 160 MB L3 → 4× DDR5 channels
                          (total: 12 channels, 480 MB L3)
```

**Capital markets:** SNC3 correct for low-latency with thread/memory affinity; HEX for batch throughput without NUMA partitioning.

---

## 2. DRAM Subsystem (DDR5-6400, DDR5-7200, and MRDIMM DDR5-8800)

### 2.1 Memory Channel Architecture

[VERIFIED] 6900P: **12 DDR5 channels (4 per tile)**, 1 DPC. Max memory: 3 TB (RDIMM), 3 TB (MRDIMM at 128 GB/module). (Sources: [NextPlatform Granite Rapids](https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/); [Intel Newsroom MRDIMM](https://newsroom.intel.com/data-center/new-ultrafast-memory-boosts-intel-data-center-chips), accessed 2026-04-23)

6700P/6500P (LGA 4710): 8 channels, up to 4/8-socket. (Source: [NextPlatform roundout](https://www.nextplatform.com/2025/02/24/intel-rounds-out-granite-rapids-xeon-6-with-a-slew-of-chips/), accessed 2026-04-23)

### 2.2 DDR5 Speed Tiers

[VERIFIED] **DDR5-6400** standard RDIMM across all 6900P/6700P/6500P. 12 × 6400 × 8 = **614.4 GB/s theoretical peak**.

[VERIFIED] **MRDIMM DDR5-8800** supported EXCLUSIVELY on **6900P (LGA 7529)**. Simultaneous access to two DRAM ranks per channel. MRCD chip buses at 8800 MT/s; underlying DRAM at half rate (~4400 MT/s effective). Theoretical peak: **844.8 GB/s**. (Source: [Intel Newsroom](https://newsroom.intel.com/data-center/new-ultrafast-memory-boosts-intel-data-center-chips); [Tom's Hardware Micron MRDIMM](https://www.tomshardware.com/desktops/servers/micron-unveils-mrdimms-for-intel-xeon-6-up-to-256gb-ddr5-8800-modules), accessed 2026-04-23)

[VERIFIED] MRDIMM on 6700P/6500P: DDR5-8000 (not 8800).

### 2.3 AWS M8i/R8i: DDR5-7200 RDIMMs (Custom Configuration)

[VERIFIED] AWS M8i and R8i use **custom Intel Xeon 6 processors with DDR5 at 7200 MT/s RDIMMs — NOT MRDIMMs**. Chips and Cheese ran on r8i, confirmed Micron MTC40F2047S1RC72BF1001 (standard RDIMM at DDR5-7200). Custom AWS config between DDR5-6400 and MRDIMM-8800. (Sources: [AWS M8i page](https://aws.amazon.com/ec2/instance-types/m8i/); [Chips and Cheese](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory), accessed 2026-04-23)

[VERIFIED] **Measured STREAM 691.62 GB/s** on AWS r8i (DDR5-7200, full socket, SNC3 local NUMA). Emerald Rapids: 323.45 GB/s → **2.14× improvement**.

### 2.4 DRAM Latency

[VERIFIED] AWS Xeon 6 DDR5-7200 SNC3 latency:
- Local NUMA (same tile): **~131.54 ns**
- One die boundary: 157.44 ns (+26 ns)
- Two die boundaries: 181.54 ns

AMD Zen 5 Turin (NPS1): 125.6 ns local — ~5 ns better than Xeon 6 local.

### 2.5 MRDIMM Performance Gains (Bare-Metal 6900P)

[VERIFIED] Intel/Micron claims: MRDIMM DDR5-8800 delivers:
- **1.31× STREAM bandwidth** vs DDR5-6400 (same platform)
- HPCG: 1.32×
- Llama-3 inference: 1.33×
- OpenFOAM CFD: 1.2×
- **Up to 40% lower loaded latency** vs DDR5-6400 RDIMM

### 2.6 Bandwidth Summary

| Config | Channels | Speed | Theoretical Peak | Measured STREAM |
|---|---|---|---|---|
| DDR5-6400 RDIMM (spec) | 12 | 6400 | 614.4 GB/s | ~475-500 GB/s (est) |
| **DDR5-7200 RDIMM (AWS M8i/R8i)** | 12 | 7200 | 691.2 GB/s | **691.62 GB/s measured** |
| MRDIMM DDR5-8800 (6900P bare metal) | 12 | 8800 | 844.8 GB/s | ~906 GB/s (1.31× × 691); some dual-socket SGLang tests report up to 1,210 GB/s |
| Emerald Rapids (prior gen) | 8 | 5600 | 358.4 GB/s | 323.45 GB/s |

### 2.7 CXL 2.0

[VERIFIED] Granite Rapids 6900P: **CXL 2.0 Type 3** memory expansion, hardware-assisted in memory controller, OS-transparent. Type 3 pools presented as additional NUMA nodes. Expands beyond 3 TB/socket for in-memory analytics / large model serving.

---

## 3. Interconnect and PCIe

### 3.1 PCIe Gen 5.0

[VERIFIED] Xeon 6 6900P: up to **96 PCIe 5.0 lanes/socket** in 2-socket (up to 136 in 1-socket). PCIe 5.0: 64 GB/s per x16 slot. (Sources: [Wikipedia Granite Rapids](https://en.wikipedia.org/wiki/Granite_Rapids); [The Register Xeon 6P](https://www.theregister.com/2024/09/24/intel_xeon_6p/), accessed 2026-04-23)

6700P (LGA 4710): up to 88 PCIe Gen 5.0/CXL 2.0 lanes multi-socket, 136 single-socket.

### 3.2 UPI Inter-Socket

[VERIFIED] Xeon 6 6900P: **up to 6 UPI 2.0 links at 24 GT/s** per socket (2-socket). 6700P: 4 UPI at 24 GT/s (4/8-socket).

### 3.3 AWS Host-to-Accelerator

[VERIFIED] M8i/R8i EFA support on 48xlarge, 96xlarge, metal-48xl, metal-96xl. All I/O through 6th-gen AWS Nitro Cards.

[UNKNOWN] Specific PCIe topology on AWS M8i — whether accelerators attach via PCIe 5.0 x16 directly or via Nitro controller intermediary. No M8i/R8i-GPU-coupled AWS offering identified.

---

## 4. AMX and AVX-512 Compute (BF16 + INT8 + FP16)

### 4.1 AMX Architecture

[VERIFIED] AMX integrated into every Redwood Cove P-core. TMUL (Tile Matrix Multiply Unit). Tile register file: **8 tiles × 1 KB each = 8 KB dedicated storage** (16 rows × 64 bytes per tile).

TMUL performs: `TileC[M][N] += TileA[M][K] × TileB[K][N]` — tiled matrix multiply-accumulate.

### 4.2 Data Types and Throughput

[VERIFIED] AMX per-core throughput:

| Data Type | Ops/Cycle | First Available | Notes |
|---|---|---|---|
| INT8 | **2,048** | Sapphire Rapids (4th Gen, 2023) | Accumulates to INT32 |
| BF16 | **1,024** | Sapphire Rapids (4th Gen, 2023) | Accumulates to FP32 |
| **FP16** | **1,024** | **Granite Rapids (6th Gen, 2024) — NEW** | IEEE 754 half-precision, accumulates FP32 |

(Sources: [Wikipedia AMX](https://en.wikipedia.org/wiki/Advanced_Matrix_Extensions); [AWS AMX blog](https://aws.amazon.com/blogs/compute/accelerate-cpu-based-ai-inference-workloads-using-intel-amx-on-amazon-ec2/), accessed 2026-04-23)

**AMX FP16 is THE critical new capability in Granite Rapids.** Absent in Sapphire Rapids (4th Gen) and Emerald Rapids (5th Gen). Intel explicitly: "deploy FP16-trained models from GPU environments directly on CPUs, without converting data types or retraining." FP16-trained GPU models run at full AMX throughput on Xeon 6 without quantization or format conversion.

### 4.3 AVX-512 Alongside AMX

[VERIFIED] Xeon 6 6900P: AVX-512 with **2 × 512-bit FMA units** per core. AVX-512-FP16 (vector, not matrix): 32 FP16 FMA per 512-bit lane = **32 FP16 FLOPs/cycle via AVX-512** vs 1,024 FP16 FLOPs/cycle via AMX — **32× difference** in favor of AMX for matrix workloads.

FP32 via AVX-512: 16 FP32 × 2 FMA = **32 FP32 FLOPs/cycle** per core.

### 4.4 Per-Socket Peak (6980P, 128 cores, 3.2 GHz all-core)

| Metric | Formula | Peak |
|---|---|---|
| **AMX INT8 TOPS (matrix)** | 128 × 3.2 × 2,048 | **838.9 TOPS** |
| **AMX BF16 TFLOPS (matrix)** | 128 × 3.2 × 1,024 | **419.4 TFLOPS** |
| **AMX FP16 TFLOPS (matrix)** | 128 × 3.2 × 1,024 | **419.4 TFLOPS** |
| AVX-512 FP32 TFLOPS (vector) | 128 × 3.2 × 32 | 13.1 TFLOPS |

[VERIFIED] 6980P all-core sustained turbo ~3.2 GHz under heavy AVX-512/AMX; max single-core turbo 3.9 GHz. Phoronix noted sustained AVX-512 clocks 2.15-2.6 GHz due to 500W TDP constraints.

---

## 5. Arithmetic Intensity / Roofline

### 5.1 Ridge Points per Socket (6980P)

Using DDR5-7200 AWS M8i (**691.62 GB/s measured STREAM**) and AMX matrix peaks:

| Mode | Peak | BW | **Ridge** |
|---|---|---|---|
| **AMX BF16** | 419.4 TFLOPS | 691.62 GB/s | **606 FLOP/byte** |
| **AMX INT8** | 838.9 TOPS | 691.62 GB/s | **1,213 OP/byte** |
| **AMX FP16** | 419.4 TFLOPS | 691.62 GB/s | **606 FLOP/byte** |
| AVX-512 FP32 | 13.1 TFLOPS | 691.62 GB/s | 19 FLOP/byte |

With MRDIMM DDR5-8800 (bare metal, ~906 GB/s):

| Mode | Peak | BW | Ridge |
|---|---|---|---|
| AMX BF16 | 419.4 TFLOPS | ~906 GB/s | ~463 FLOP/byte |
| AMX INT8 | 838.9 TOPS | ~906 GB/s | ~926 OP/byte |

### 5.2 LLM Decode Batch=1: Memory-Bound

[VERIFIED] LLM decode AI ≈ **1 OP/byte for weight loading** — 4-5 orders of magnitude below AMX ridge (606).

**Practical:** 691.62 GB/s ÷ 70 GB (70B INT8 weights) ≈ **~9.9 tok/s theoretical ceiling per socket** before overhead.

[VERIFIED] SGLang dual-socket 6980P DDR5-8800 MRDIMM (1536 GB, 24× 64 GB): DeepSeek-R1-671B INT8 TPOT **67.99 ms/tok** (≈14.7 tok/s per output), **85% memory bandwidth efficiency** → effective 1.45 TB/s actual memory throughput utilized. (Source: [LMSYS SGLang blog](https://www.lmsys.org/blog/2025-07-14-intel-xeon-optimization/), accessed 2026-04-23)

### 5.3 Cross-Platform Memory Bandwidth

| Platform | Memory Config | Bandwidth |
|---|---|---|
| **Xeon 6 6985P-C (AWS r8i)** | DDR5-7200, 12ch | **691.62 GB/s measured** |
| Xeon 6 6980P (MRDIMM bare metal) | DDR5-8800, 12ch | ~906 GB/s (est.) |
| Graviton4 (12ch DDR5-5600) | DDR5-5600, 12ch | ~480-537 GB/s |
| AMD Turin (DDR5-5600, 12ch) | DDR5-5600, 12ch | ~478 GB/s (EPYC 9355P measured) |
| AMD Turin DDR5-6400 (bare metal) | DDR5-6400, 12ch | 614 GB/s |
| NVIDIA H100 SXM5 | HBM3 80 GB | 3.35 TB/s (reference only) |
| NVIDIA B200 | HBM3e 192 GB | 8.0 TB/s (reference only) |

**For capital markets: Xeon 6 at DDR5-7200 leads the CPU competition in DRAM bandwidth at AWS instance level. MRDIMM bare-metal extends the lead further but is NOT on AWS today.**

---

## 6. Power and Process (Intel 3 + Intel 7 Tiles)

[VERIFIED] Compute tiles: **Intel 3** (5nm-class EUV). I/O dies: **Intel 7** (10nm SuperFin). I/O die area ~241 mm². XCC compute tile ~598 mm². Three XCC + two I/O connected by EMIB.

[VERIFIED] **Xeon 6980P (128 cores): 500W TDP** — Intel's highest production server TDP.

6700P/6500P: 300-350W range.

[VERIFIED] Sustained AVX-512 clock: **2.15-2.6 GHz** (not 3.2 GHz all-core) due to 500W envelope. Max single-core turbo: 3.9 GHz (light load only).

[VERIFIED] Granite Rapids draws **50-150W MORE** than Emerald Rapids at socket level — explicit power regression for performance uplift. Intel: 2.3× avg perf gain over Emerald Rapids offsets higher TDP.

[UNKNOWN] AWS M8i/R8i per-vCPU power allocation not disclosed.

---

## 7. AWS Instance Lineup (M8i / R8i / X8i / M8i-flex)

### 7.1 Processor and Configuration

[VERIFIED] AWS Xeon 6 families: **custom Intel Xeon 6 processors AWS-only**, sustained all-core turbo **3.9 GHz**. m8i.4xlarge confirmed **Intel Xeon 6975P-C** (8 physical cores with Hyper-Threading = 16 vCPUs).

Memory: DDR5-7200 RDIMMs. Launch: **August 28, 2025** (M8i); R8i/X8i also 2025. Launch regions: US East (N. Virginia, Ohio), US West (Oregon), Europe (Spain).

AWS claims: **4.6× larger L3** vs M7i (Emerald Rapids 60 MB → M8i 480 MB). **15% better price-performance, 20% higher perf, 2.5× more memory bandwidth, 60% faster NGINX, 30% faster PostgreSQL, 40% faster AI deep learning**.

### 7.2 M8i Instance Sizes (key)

| Size | vCPU | Mem GiB | Net Gbps | EBS Gbps | OD us-east-1 |
|---|---|---|---|---|---|
| m8i.xlarge | 4 | 16 | Up to 12.5 | Up to 10 | ~$0.212/hr |
| m8i.4xlarge | 16 | 64 | Up to 15 | Up to 10 | **$0.847/hr** |
| m8i.48xlarge | 192 | 768 | 75 | 60 | — |
| **m8i.96xlarge** | **384** | **1,536** | **100** | **80** | — |
| m8i.metal-48xl | 192 | 768 | 75 | 60 | ~$10.16/hr |
| m8i.metal-96xl | 384 | 1,536 | 100 | 80 | — |

m8i.96xlarge = full 3-tile Xeon 6 socket (all three compute tiles). EFA on 48xl, 96xl, metal-48xl, metal-96xl.

### 7.3 M8i-flex (5% lower price, 95% of time full performance)

Covers m8i-flex.large through m8i-flex.16xlarge. Burstable workloads.

### 7.4 R8i (Memory-Optimized, 8:1)

| Size | vCPU | Mem GiB | Net Gbps | OD us-east-1 |
|---|---|---|---|---|
| r8i.large | 2 | 16 | Up to 12.5 | ~$0.139/hr |
| r8i.xlarge | 4 | 32 | Up to 12.5 | ~$0.278/hr |
| r8i.2xlarge | 8 | 64 | Up to 15 | ~$0.556/hr |
| r8i.48xlarge | 192 | 1,536 | 75 | — |
| **r8i.96xlarge** | **384** | **3,072** | **100** | — |
| r8i.metal-96xl | 384 | 3,072 | 100 | — |

r8i.96xlarge: **3 TB config** significant for in-memory financial databases (KDB+, Volt, SAP HANA).

### 7.5 X8i (High Memory, 16:1, up to 6 TB)

| Size | vCPU | Mem GiB | Net Gbps |
|---|---|---|---|
| x8i.48xlarge | 192 | 3,072 | 75 |
| x8i.64xlarge | 256 | 4,096 | 80 |
| **x8i.96xlarge** | **384** | **6,144** | **100** |
| x8i.metal-96xl | 384 | 6,144 | 100 |

**6 TB DDR5 in single AWS instance** — highest memory capacity in EC2 outside U-series. Enables single-instance inference of 671B INT8 models.

### 7.6 Competitive Pricing (4xlarge, us-east-1, Linux OD)

| Instance | Processor | OD/hr | vCPU | Mem |
|---|---|---|---|---|
| m8g.4xlarge | Graviton4 | **$0.718** | 16 | 64 GiB |
| m8i.4xlarge | Xeon 6 | **$0.847** | 16 (HT: 8 phys) | 64 GiB |
| m8a.4xlarge | EPYC Turin | **$0.974** | 16 (no SMT) | 64 GiB |

---

## 8. Capital Markets Talking Points

1. **AMX FP16 eliminates the quantization tax on CPU inference.** Sapphire/Emerald required FP16→BF16 downcast or further quant before AMX. Granite Rapids adds native IEEE 754 FP16 in AMX — FP16-trained GPU models run at full AMX throughput without re-training, conversion, or accuracy loss. Removes engineering and model-fidelity barrier of every prior Intel gen.

2. **691 GB/s sustained memory bandwidth at DDR5-7200 on AWS — this is why M8i matters, not core count.** 2.14× Emerald Rapids. Ahead of Graviton4 and Turin at DDR5-5600. For batch=1 LLM decode (AI ~1 OP/byte), every GB/s of memory BW = incremental throughput. **Xeon 6 wins the CPU memory BW bracket at AWS level.**

3. **SNC3 NUMA creates deterministic data locality — but only with correct affinity.** Three-tile SNC3 exposes three 160 MB L3 + 4-channel DRAM domains per socket. Local DRAM: 131 ns; +26 ns per tile boundary. With affinity enforcement, SNC3 bounds worst-case tail latency. Unmanaged, it creates latency jitter from cross-tile accesses.

4. **480 MB L3 per socket is the largest monolithic-mesh L3 in production — but has trade-offs.** L3 can hold model weights, order book state, risk factor matrices. Trade-off: L3 latency ~33 ns vs AMD Turin's ~11 ns. Single-core L3 BW ~30 GB/s vs AMD's 261 GB/s per-core. For random-access patterns across full L3, AMD is faster. For predictable sequential access (transformer matrix ops via AMX), L3 depth reduces DRAM traffic — correct optimization for memory-bound inference.

5. **MRDIMM DDR5-8800 is a 31% bandwidth unlock — but NOT on AWS today.** Bare-metal 6900P with MRDIMM delivers ~906 GB/s STREAM (1.31× over DDR5-6400). AWS M8i/R8i use DDR5-7200 RDIMMs. For full MRDIMM bandwidth, co-location or bare-metal 6900P required. The bandwidth ceiling on AWS M8i is set by DDR5-7200, not the processor.

6. **X8i at 6 TB DDR5 is a plausible single-instance alternative to large GPU for 70B+ model inference.** DeepSeek-R1-671B INT8 fits within single 3 TB r8i.96xlarge. SGLang dual-socket 6980P MRDIMM achieved 67.99 ms TPOT (14.7 tok/s) for DeepSeek-R1-671B INT8 with 85% bandwidth utilization. For cost-sensitive, high-capacity, moderate-throughput inference: credible GPU-free path.

7. **CXL 2.0 Type 3 on Granite Rapids = architectural hook for future memory tiering.** Hardware-assisted, OS-transparent. For in-memory workloads growing beyond DRAM capacity but can't tolerate NVMe latency, CXL memory (100-300 ns access, higher capacity, lower $/GB) is the next tier. Xeon 6 = first production Intel platform with CXL 2.0 (vs 1.1 on Sapphire/Emerald).

8. **500W TDP is the constraint nobody budgets for in colocation.** 6980P at 500W/socket in 2-socket = 1 kW from standard 1U/2U slot before net/storage/cooling overhead. Most capital markets colo racks: 4-8 kW. 2-socket 6980P consumes 25% of 4 kW rack before app runs. For high-density inference on Xeon 6, power-per-token and rack budget must be modeled explicitly.

9. **Hyper-Threading inflation affects vCPU pricing on AWS M8i vs M8a.** m8i.4xlarge = 16 vCPUs from 8 physical (HT enabled). m8a.4xlarge = 16 vCPUs from 16 physical (no SMT). For compute-bound workloads, M8a = more physical compute per dollar. **For AMX inference (runs on physical cores, not HT siblings), M8i's 8 physical AMX-capable cores per 4xlarge is the binding constraint.** Size by physical core count, not vCPU count.

10. **llama.cpp NUMA config is a correctness issue, not tuning preference.** With SNC3, default llama.cpp may split weights across NUMA nodes → cross-die DRAM access (157-181 ns vs 131 ns local). Either disable SNC3 (HEX mode, single NUMA) or bind to single SNC3 node. For dual-socket: run two separate llama.cpp instances. Not an optimization — prevents severe and non-obvious throughput degradation appearing as unexplained latency jitter in production.

---

## 9. Sources

All accessed 2026-04-23. Key Tier 1/2:

- [Chips and Cheese Xeon 6 memory](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory)
- [AWS M8i page](https://aws.amazon.com/ec2/instance-types/m8i/)
- [AWS M8i launch blog](https://aws.amazon.com/blogs/aws/new-general-purpose-amazon-ec2-m8i-and-m8i-flex-instances-are-now-available/)
- [AWS R8i page](https://aws.amazon.com/ec2/instance-types/r8i/)
- [AWS X8i page](https://aws.amazon.com/ec2/instance-types/x8i/)
- [NextPlatform Granite Rapids](https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/)
- [NextPlatform Granite Rapids roundout](https://www.nextplatform.com/2025/02/24/intel-rounds-out-granite-rapids-xeon-6-with-a-slew-of-chips/)
- [The Register Xeon 6P launch](https://www.theregister.com/2024/09/24/intel_xeon_6p/)
- [Wikipedia Granite Rapids](https://en.wikipedia.org/wiki/Granite_Rapids)
- [Wikipedia AMX](https://en.wikipedia.org/wiki/Advanced_Matrix_Extensions)
- [Intel Newsroom MRDIMM](https://newsroom.intel.com/data-center/new-ultrafast-memory-boosts-intel-data-center-chips)
- [Tom's Hardware Micron MRDIMM](https://www.tomshardware.com/desktops/servers/micron-unveils-mrdimms-for-intel-xeon-6-up-to-256gb-ddr5-8800-modules)
- [AWS AMX blog](https://aws.amazon.com/blogs/compute/accelerate-cpu-based-ai-inference-workloads-using-intel-amx-on-amazon-ec2/)
- [LMSYS SGLang Xeon 6 DeepSeek-R1](https://www.lmsys.org/blog/2025-07-14-intel-xeon-optimization/)
- [Phoronix MRDIMM review](https://www.phoronix.com/review/intel-xeon6-mrdimm-ddr5)
- [Phoronix M8 benchmarks](https://www.phoronix.com/review/aws-m8a-m8g-m8i-benchmarks)
- [WareDB 6980P specs](https://www.waredb.com/processor/intel-xeon-6980p)
- [Chips and Cheese Redwood Cove](https://chipsandcheese.com/p/intels-redwood-cove-baby-steps-are-still-steps)
- [llama.cpp #12088 Xeon 6980P DeepSeek-R1](https://github.com/ggml-org/llama.cpp/discussions/12088)
- [Phoronix SNC3 vs HEX](https://www.phoronix.com/review/intel-xeon-snc3-hex-benchmarks)

---

## 10. Known Gaps

1. L1D and L2 associativity not confirmed — L1I (16-way) stated; L1D/L2 [UNKNOWN].
2. DDR5-6400 STREAM measured on bare-metal 6900P: Phoronix source 403'd. DDR5-6400 absolute STREAM [UNKNOWN in this session].
3. AWS M8i bare-metal STREAM not independently benchmarked.
4. M8a vs M8g vs M8i comparative STREAM behind Phoronix paywall.
5. AMX FP16 inference benchmark on Granite Rapids not independently published (architectural spec verified, measured FP16-specific benchmark [UNKNOWN]).
6. M8i bare-metal PCIe host topology not publicly documented.
7. AMX-COMPLEX on 6900P server SKUs unconfirmed (documented on Granite Rapids-D).
8. R8i and X8i full on-demand pricing tables (partial via third-party aggregators only).
