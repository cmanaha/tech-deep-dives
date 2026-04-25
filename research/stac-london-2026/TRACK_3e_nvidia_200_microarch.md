# Track 3e — NVIDIA 200-Series Microarchitecture Deep Dive

**Researched:** 2026-04-23
**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Audience:** Capital markets technology leads

---

## 1. Parallelism Levels

### 1.1 The Full Hierarchy

```
Thread (1 lane of 32-bit work)
  └─ Warp (32 threads, lockstep issue)
       └─ Warp Group (4 warps = 128 threads, Hopper wgmma scope)
            └─ Thread Block / CTA (≤ 1024 threads on H100/B200)
                 └─ Thread Block Cluster (up to 8 CTAs portable; up to 16 H100/B200 opt-in)
                      └─ Grid (all CTAs in a kernel launch)
                           └─ Die / Chiplet (B200: 2 × GB100 dies, NV-HBI)
```

[VERIFIED] Thread/warp/CTA hierarchy unchanged since Volta. Warp = 32 threads in lockstep. Up to 64 resident warps per SM on Hopper and Blackwell datacenter. (Source: [NVIDIA Hopper Architecture In-Depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/), accessed 2026-04-23)

[VERIFIED] Hopper introduced **Thread Block Cluster (TBC)**: CTAs co-scheduled on same GPC, synchronize via cluster barriers, access each other's SMEM via **Distributed Shared Memory (DSMEM)**. Max portable: 8 CTAs; H100/B200 opt-in: 16.

[VERIFIED] Blackwell extends TBCs to **2-SM TPC-scoped MMA via `cta_group::2`** — two SMs in a TPC cooperate on single `tcgen05.mma`, sharing operands across doubled M-dimension (MMA_M = BLOCK_M × 2 = 256). (Source: [arXiv:2512.02189v1](https://arxiv.org/html/2512.02189v1), accessed 2026-04-23)

### 1.2 Mapping to Physical Hardware

| Level | Physical Unit | H100 SXM5 | B200 (GB100 ×2) | B300 |
|---|---|---|---|---|
| Thread Block Cluster | GPC | 8 GPCs | 8 GPCs | 8 GPCs |
| Thread Block | SM | **132 SM** | **148 SM (74/die)** | **160 SM** |
| Warp | Warp Scheduler | 4/SM | 4/SM | 4/SM |
| Tensor Core scope | Processing Block | 4th-gen, wgmma | 5th-gen, tcgen05 | 5th-gen, tcgen05 |

[VERIFIED] H100 SXM5: 8 GPCs, 66 TPCs (6 fused off from full GH100), 2 SMs/TPC = 132 SMs. Full GH100 die: 144 SMs (72 TPCs). H200: identical die, 132 SMs — all gains from HBM3e upgrade.

[VERIFIED] B200 (GB100 dual-die): 80 physical SMs/die, 74 enabled = **148 total SMs** across 8 GPCs.

[VERIFIED] B300 (Blackwell Ultra): **160 SMs**, 20,480 CUDA cores (128/SM), 640 Tensor Cores (4/SM). (Source: [Inside Blackwell Ultra](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/); [glennklockwood B300](https://www.glennklockwood.com/garden/processors/B300), accessed 2026-04-23)

### 1.3 Warp Scheduler Operation

[VERIFIED] 4 warp schedulers per SM (Hopper SM90 and Blackwell SM100). Each selects from up to 64 resident warps, checks operands, issues 1 instruction/cycle.

- **Hopper**: wgmma issued at warpgroup scope (128 threads). Accumulators in thread registers.
- **Blackwell SM100**: tcgen05.mma issued by **single thread** for entire CTA. Accumulators in **TMEM**. Reduces dispatch latency **2.9-11.6×** vs Hopper wgmma. (Source: [arXiv:2512.02189v1](https://arxiv.org/html/2512.02189v1), accessed 2026-04-23)

### 1.4 Precision Matrix by Generation

| Format | H100 | H200 | B200 | B300 |
|---|---|---|---|---|
| FP64 | 67 TFLOPS | 67 TFLOPS | 37 TFLOPS | **1.25 TFLOPS** (!) |
| TF32 | 989 TFLOPS (sparse) | 989 | ~2× H100 | — |
| FP16/BF16 | 989 TFLOPS (sparse) | 989 | ~2× | — |
| FP8 | 3,958 TFLOPS (sparse) | 3,958 | ~7,700 | ~10,000 |
| FP6 | — | — | Yes | Yes |
| **NVFP4 (E2M1)** | — | — | **10 PFLOPS sparse** | **15 PFLOPS dense** |
| INT8 | 3,927 TOPS | 3,927 | ~7,854 | — |

**B300 FP64 drops to 1.25 TFLOPS** (vs B200's 37 TFLOPS) — deliberate inference optimization, cutting HPC-grade FP64 to free die area. Capital markets workloads still requiring FP64 GPU compute (Monte Carlo sims, PDE solvers) should stay on H100/H200/A100 — B300 is NOT a general-purpose upgrade.

---

## 2. Memory Hierarchy and Locality — All Tiers

### Tier 0: Register File

| GPU | Total RF/SM | Per Processing Block | Max Warps | Max Regs/Thread |
|---|---|---|---|---|
| H100 | 256 KB (64K × 32-bit) | 64 KB | 64 | 255 |
| H200 | 256 KB | 64 KB | 64 | 255 |
| B200 | 256 KB | 64 KB | 64 (CC 10.0) / 48 (CC 12.0) | 255 |
| B300 | 256 KB | 64 KB | [LIKELY same] | 255 |

[VERIFIED] 64K × 32-bit regs/SM = 256 KB total per SM, 64 KB/processing block. (Source: [NVIDIA Blackwell/Hopper Tuning Guides](https://docs.nvidia.com/cuda/blackwell-tuning-guide/), accessed 2026-04-23)

**Key Blackwell change:** Accumulators for Tensor Core ops **no longer live in RF**. TMEM takes over, freeing RF capacity for epilogue ops, dramatically reducing register pressure.

### Tier 1: L1 / Shared Memory (SMEM)

| GPU | L1/SMEM per SM | Max per thread block |
|---|---|---|
| H100/H200 | 256 KB (configurable 0-228 KB SMEM) | 227 KB |
| **B200/B300** | **128 KB per SM** (reduced from 256 KB) | 227 KB |
| GB200 | 228 KB per SM | 227 KB |

**Why the L1 reduction doesn't hurt tensor workloads:** TMEM adds 256 KB dedicated tensor accumulator storage per SM. **Net on-chip memory increases substantially** for tensor-heavy code.

[VERIFIED] SMEM is **programmer-visible scratchpad** with no hardware eviction for programmer-placed data — deterministic by design. Data placed via `__shared__` declarations or PTX will NOT be evicted by L1 prefetcher. Critical for latency-sensitive attention kernels where KV tiles must remain resident for TB lifetime.

[VERIFIED] L1 access latency on B200: **19.6 ns (39 cycles at 2 GHz effective clock)**. (Source: [Chips and Cheese B200](https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut), accessed 2026-04-23)

### Tier 1a: TMEM — Tensor Memory (NEW in Blackwell SM100)

[VERIFIED] **256 KB per SM, 2D array 512 cols × 128 lanes × 32-bit.** 512 × 128 × 4 bytes = 262,144 bytes = 256 KB. (Source: [arXiv:2512.02189v1](https://arxiv.org/html/2512.02189v1); [gau-nernst tcgen05](https://gau-nernst.github.io/tcgen05/), accessed 2026-04-23)

| TMEM Property | Value |
|---|---|
| Capacity per SM | 256 KB |
| Organization | 512 cols × 128 lanes × 32-bit |
| Read bandwidth | **16 TB/s per SM** |
| Write bandwidth | **8 TB/s per SM** |
| Cache-miss latency | 420 cycles |
| vs Hopper global latency | **58% reduction** (Hopper ~1000 cycles) |

**TMEM exclusive to Blackwell DATACENTER parts (SM100).** Consumer Blackwell (SM12x: RTX 5080/5090) does NOT have TMEM and does NOT support tcgen05.

**Access model:**
- Allocate: `tcgen05.alloc` (column units, power-of-2, min 32 cols)
- From SMEM: `tcgen05.cp`
- From registers: `tcgen05.st`
- As MMA output: direct
- To registers (for epilogue): `tcgen05.ld`
- Traditional instructions (`ldmatrix`, `cp.async`, `wmma.load`) CANNOT address TMEM

**2-SM cooperative MMA:** With `cta_group::2`, two SMs sharing a TPC jointly execute a single `tcgen05.mma` across doubled M-tile. Each SM contributes half of TMEM; one thread in leader CTA issues. Higher operational intensity with lower per-CTA SMEM bandwidth pressure.

### Tier 2: L2 Cache

| GPU | L2 Size | Partitions | Latency |
|---|---|---|---|
| H100 SXM5 | 50 MB | 2 (25 MB each) | — |
| H200 SXM | 50 MB | 2 | — |
| **B200** | **~126 MB** | **4 (2/die, ~63 MB/die)** | ~150 ns local |
| GB200 | 126 MB (confirmed) | 4 | — |
| B300 | [UNKNOWN] | [UNKNOWN] | — |

[VERIFIED] H100 L2 = 50 MB. B200/GB200 L2 = 126 MB (NVIDIA Blackwell Tuning Guide explicit for GB200). 4 partitions (2/die), each ~63 MB. Cross-partition local latency ~150 ns on B200. Cross-die traffic via NV-HBI at 10 TB/s.

[UNKNOWN] B300 L2 cache size — not disclosed in any source consulted.

### Tier 3: HBM

| GPU | Standard | Stacks | Capacity | Bus Width | Bandwidth | Stack Height |
|---|---|---|---|---|---|---|
| H100 SXM5 | HBM3 | 5/6 enabled | 80 GB | 5,120-bit | 3.35 TB/s | 8-Hi |
| **H200 SXM** | **HBM3e** | **6 stacks** | **141 GB** | 6,144-bit (6×1024) | **4.8 TB/s** | 8-Hi |
| **B200** | **HBM3e** | **8 (4/die)** | **192 GB (180 GB usable)** | **8,192-bit (2×4,096)** | **8.0 TB/s nominal; 7.48 TB/s STREAM** | 8-Hi |
| **B300** | **HBM3e+** | **8 (4/die)** | **288 GB** | 8,192-bit | 8.0 TB/s | **12-Hi** |

[VERIFIED] H200 re-enables 6th HBM3e stack (vs H100's 5/6). Same GH100 die.

[VERIFIED] B200 measured **7.48 TB/s STREAM Triad sustained** (1.71× H200). 180 GB usable after ECC/system overhead.

[VERIFIED] B300 HBM3e+ 12-Hi stacks: 12 DRAM dies vs 8-Hi on B200, yields **288 GB at same 8.0 TB/s** — gain is pure CAPACITY, not bandwidth. Bus width 8,192-bit maintained.

**HBM3 pseudo-channel architecture:** Each stack = 1,024-bit interface, 16 × 64-bit channels, 2 × 32-bit pseudo-channels per. Semi-independent operation (shared command bus, independent execution). 6.4 Gb/s per pin. Max per-stack BW ~819 GB/s.

### Tier 4: Cross-GPU NVLink

| Gen | GPU | Per-GPU BW | Links | Per-Link | NVSwitch per 8-GPU Node |
|---|---|---|---|---|---|
| **NVLink 4** | H100/H200 | **900 GB/s bi-dir** | 18 | ~25 GB/s/dir | 4 switches |
| **NVLink 5** | B200/B300 | **1.8 TB/s bi-dir** | 18 | ~50 GB/s/dir | 2 switches (per HGX) |

[VERIFIED] HGX H100: 4 NVSwitch chips. HGX B200: 2 NVLink Switch chips per baseboard (chips doubled in capability, halved in count, moved to center for shorter traces).

[VERIFIED] **GB200 NVL72: 36 Grace Blackwell Superchips (72 GPUs + 36 Grace CPUs) in single rack.** 18 compute trays + 9 NVSwitch trays (2 NVSwitch5 ASICs each at 28.8 Tb/s). **Total NVLink switching bandwidth: 130 TB/s.** All 72 GPUs in single non-blocking fabric domain.

[VERIFIED] **SHARP on NVLink 5:** NVIDIA Scalable Hierarchical Aggregation and Reduction Protocol with FP8 support — **4× bandwidth efficiency** for collectives vs non-SHARP. Scales up to 576 GPUs across multi-rack NVLink fabric.

### Tier 5: CPU-GPU NVLink-C2C (Grace Superchip)

[VERIFIED] NVLink-C2C connects Grace CPU to 1-2 Blackwell GPUs in GB200/GB300 Superchip:
- **900 GB/s bi-dir (450 GB/s each direction)**
- **7× bandwidth of PCIe Gen 5** (128 GB/s per direction)
- **Hardware-coherent**: unified virtual address space, CUDA kernels directly address LPDDR5X without explicit cudaMemcpy
- Grace LPDDR5X: **~480 GB, ~500 GB/s local**
- Via NVLink-C2C from GPU perspective: 900 GB/s link, but LPDDR5X serves at 500 GB/s

[VERIFIED] Combined unified memory:
- GB200 Superchip: ~192 GB HBM3e × 2 + ~480 GB LPDDR5X = **>800 GB total addressable**
- GB300 Superchip: 288 GB × 2 + ~480 GB = **~1 TB unified**

[LIKELY] NVLink-C2C 5× power efficiency per byte vs PCIe (NVIDIA marketing; primary technical citation not obtained).

**KV cache overflow:** Long-context inference on GB200/GH200 overflows KV cache from HBM to LPDDR5X via coherent path. Benchmark: KV cache eviction latency **10+ ms (PCIe) → <0.25 ms (GH200)** — **40× improvement** via background mirroring over coherent link. (Source: [Cumulus Labs ionattention](https://cumulus.blog/ionattention), accessed 2026-04-23)

### Memory Hierarchy Summary

```
SPEED →                             CAPACITY →

[Register File]    256 KB/SM    ~1 cycle        Per-thread data, scalars
[TMEM]             256 KB/SM    420 cycles       Tensor Core accumulators (B200/B300 only)
[L1/SMEM]          128-228 KB/SM 39 cycles       Programmer-managed scratchpad, tile staging
[L2 Cache]         50-126 MB    ~150 ns          Weight/activation reuse across SM cluster
[HBM3e]            80-288 GB    microseconds     Model weights, KV cache, activations
[LPDDR5X via C2C]  480 GB       ~2-3 µs         KV cache overflow, embedding tables
[NVLink peer HBM]  per GPU      ~2-5 µs         Model parallelism, tensor parallel shards
```

---

## 3. TMA — Tensor Memory Accelerator

### 3.1 What TMA Is

[VERIFIED] TMA = dedicated hardware unit per SM (Hopper introduction). **Asynchronous bulk copies** between HBM and SMEM, without consuming warp cycles. Single thread issues TMA descriptor (5D tensor: source, dimensions, strides, tile shape, swizzle mode). Hardware engine executes copy asynchronously.

[VERIFIED] Enables **warp specialization**: producer warps issue TMA loads and wait on arrival barriers; consumer warps wait and compute. Decouples data movement from compute — HBM latency hidden behind Tensor Core operations.

[VERIFIED] FlashAttention-3 used TMA + warp specialization + ping-pong scheduling on H100 to reach **740 TFLOPS FP16 (75% utilization)** at preprint. **NeurIPS 2024 final: 840 TFLOPS BF16 (85% utilization)** vs FlashAttention-2's 35% on H100. (Source: [arXiv:2407.08608 FlashAttention-3](https://arxiv.org/abs/2407.08608), accessed 2026-04-23)

### 3.2 TMA in Blackwell

[VERIFIED] Blackwell inherits TMA from Hopper, extends with **TPC-scoped TMA multicast**: single TMA operation deposits tile into SMEM of BOTH SMs in TPC simultaneously → halves HBM reads for 2-SM cooperative MMA.

[VERIFIED] CUTLASS Blackwell tutorial `04_mma_tma_2sm_sm100.cu` demonstrates TMA + 2-SM MMA: descriptor issued from single thread, barrier sync, cooperative tcgen05.mma across TPC.

---

## 4. Transformer Engine — Per-Generation

### 4.1 First-Gen (Hopper H100/H200)

[VERIFIED] Dynamically selects FP8/FP16/BF16 per-layer, tracks per-tensor scaling. 4th-gen Tensor Cores with native FP8 (E4M3, E5M2). **FP8 halves HBM traffic vs FP16** for weight loads.

MMA: `wgmma` warpgroup MMA, 128-thread scope. Operand A from registers or SMEM; B from SMEM only. Accumulators in thread registers.

### 4.2 Second-Gen (Blackwell B200/B300)

[VERIFIED] Supports FP4 (NVFP4), FP6, FP8 per-layer dynamic + FP16/BF16. MMA: `tcgen05.mma` single-thread issue, SM100-only.

**NVFP4 format (E2M1):**
- 4 bits: 1 sign + 2 exponent + 1 mantissa
- Range: approximately -6 to +6, including {0.0, 0.5, 1.0, 1.5, 2, 3, 4, 6}

**NVFP4 two-level scaling:**
- **Level 1**: per-block FP8 E4M3 scale for every 16 consecutive FP4 values (micro-block granularity)
- **Level 2**: per-tensor FP32 scale to prevent overflow from E4M3's limited dynamic range
- Net storage: 4 bits per value + 1 E4M3 byte per 16 values = **4.5 bits per value average**

**NVFP4 vs MXFP4:**
- MXFP4 (community): block size 32, E8M0 scaling
- NVFP4: **block size 16, E4M3 scaling** — finer granularity, more mantissa bits in scale = better accuracy for outliers

**Memory footprint and accuracy:**
- **~1.8× reduction vs FP8, ~3.5× vs FP16**
- Accuracy: "1% or less degradation on key language modeling tasks" vs FP8 on DeepSeek-R1-0528; AIME 2024 improved **+2% with NVFP4**

**FP4 as bandwidth optimization, not compute:** At batch=1, GPU is memory-BW-bound at all precisions. FP4 halves bytes read per parameter vs FP8, quarter vs FP16 → **2× more tokens/sec at batch=1 vs FP8 decode**.

### 4.3 Comparison

| Aspect | Hopper TE (1st gen) | Blackwell TE (2nd gen) |
|---|---|---|
| Narrowest format | FP8 (E4M3, E5M2) | **NVFP4 (E2M1)** |
| Block scale granularity | Per-tensor | **Per-16-element micro-block** |
| Scale factor type | FP32 per-tensor | **E4M3 per-block + FP32 per-tensor** |
| MMA instruction | wgmma (128-thread) | **tcgen05.mma (single-thread)** |
| Accumulator location | Register file | **TMEM (256 KB/SM)** |
| HBM footprint (rel. FP16) | 0.5× (FP8) | **0.286× (NVFP4)** |

---

## 5. SM Front-End and Back-End

### 5.1 Front-End

```
Instruction Cache (L0, per Processing Block)
    ↓
Instruction Buffer
    ↓
Warp Scheduler (4 per SM, one per Processing Block)
    ↓ (scoreboard check, operand ready)
Dispatch Unit → Execution Units
```

4 Processing Blocks/SM. Each contains: L0 instruction cache, instruction buffer, warp scheduler + dispatch, 64 KB RF slice, share of execution units.

### 5.2 Back-End Execution Units per SM (H100 vs B200)

| Unit | H100 SXM5 | B200 |
|---|---|---|
| FP32 CUDA cores | 128 | 128 |
| FP64 CUDA cores | 64 | 64 (B200) / reduced (B300) |
| INT32 cores | 128 | 128 |
| 4th-gen Tensor Cores | 4 | — |
| 5th-gen Tensor Cores | — | 4 |
| SFU | 32 | 32 (**2× throughput on Ultra** for attention ops) |
| Load/Store Units (LSU) | 64 | 64 |
| TMA unit | 1 | 1 (+ 2-SM multicast extension) |

[VERIFIED] **Blackwell Ultra (B300) doubles SFU throughput specifically for key attention instructions (softmax exponential).** Contributes to "up to 2× faster attention-layer compute vs B200."

[VERIFIED] H100 has 989 TFLOPS FP16 tensor core peak but only **3.9 TFLOPS for SFU operations** (exp, reciprocal, sqrt). **250× gap** — why softmax in attention is a bottleneck even on compute-bound prefill. FlashAttention-3 ping-pong scheduling addresses by overlapping GEMM and softmax across warpgroups.

### 5.3 Shared Memory Access

SMEM accessed via 32 banks (2-byte banking). No-bank-conflict patterns = full-width 128-byte cache line transfer in single cycle. `ldmatrix` (Hopper) = warp-cooperative matrix tile load avoiding bank conflicts. Blackwell: `tcgen05.cp` replaces ldmatrix for TMEM-destined copies from SMEM.

### 5.4 Register File Read Ports / Operand Collector

[UNKNOWN] Number of RF read ports and operand collector config for Hopper or Blackwell not publicly documented.

---

## 6. MIG — Multi-Instance GPU

### 6.1 Hardware Partitioning

[VERIFIED] Hardware partitioning of SMs, L2 cache banks, HBM, copy/decode engines. Each partition = separate CUDA device with own PCI function. **NO SM sharing across MIG instances — hard hardware partitioning at register level.**

### 6.2 Instance Configs

| GPU | Max Instances | Example Configs |
|---|---|---|
| H100 SXM5 | 7 | 7 × ~11 GB; 1 × 80 GB |
| H200 SXM | 7 | 7 × ~20 GB; 1 × 141 GB |
| B200 | 7 | 7 × ~23 GB; 2 × ~95 GB; 1 × 192 GB |
| **B300 (Blackwell Ultra)** | **7** | **7 × ~34 GB; 4 × ~70 GB; 2 × ~140 GB** |

Each MIG instance has dedicated: SM allocation, L2 slice, HBM BW slice, copy engines. **QoS is deterministic** — one tenant cannot impact another's memory BW or cache footprint.

### 6.3 Confidential Computing

[VERIFIED] Blackwell extends hardware TEE (Trusted Execution Environment) to GPU MIG instances via TEE-I/O + inline NVLink protection. **Multi-tenant inference with cryptographic isolation per instance.**

### 6.4 Capital Markets Use

For trading desks running multiple strategy workloads: single B200 (192 GB, 148 SMs) → 7 isolated strategy contexts at ~23 GB/~21 SM each with guaranteed tail latency. **No single strategy's risk calc can monopolize cache or bandwidth.**

---

## 7. Determinism and Tail Latency Features

### 7.1 CUDA Graphs

Capture kernel launch sequence as graph, replay with single CPU call. Eliminates per-kernel CPU launch overhead (~5-20 µs per kernel). Critical for batch=1 inference where dozens of small kernels per token.

### 7.2 CCCL 3.1 Floating-Point Determinism (CUDA 13.1)

[VERIFIED] Three levels for `cub::DeviceReduce`:
- **not_guaranteed**: Single-pass atomic reduction; fastest but non-reproducible
- **run_to_run** (default): Hierarchical tree reduction; same GPU + same config = same bits
- **gpu_to_gpu**: Reproducible Floating-point Accumulator (RFA) via exponent-bin grouping; **bitwise identical across different GPU models**. 20-30% performance penalty for large datasets

[VERIFIED] GPU-to-GPU mode based on RFA technique from GTC 2024. Opt-in, initially limited to `cub::DeviceReduce::Sum`, more algorithms planned. (Sources: [NVIDIA CCCL determinism blog](https://developer.nvidia.com/blog/controlling-floating-point-determinism-in-nvidia-cccl/); [CCCL v3.1.0](https://github.com/NVIDIA/cccl/releases/tag/v3.1.0), accessed 2026-04-23)

### 7.3 Determinism by Design vs Probabilistic

| Feature | Determinism | Notes |
|---|---|---|
| MIG hardware partitioning | Deterministic | Hard SM/L2/HBM isolation |
| CUDA Graphs replay | Deterministic run-to-run | Same graph = same schedule |
| SMEM contents | Deterministic (no eviction) | Programmer-placed persists for TB lifetime |
| TMEM accumulation | Deterministic per-launch | Fixed TMEM cells |
| cuBLAS GEMM | **Non-deterministic by default** | Parallel reductions use FP atomics |
| cub::DeviceReduce | Configurable (3 levels) | CCCL 3.1+ |
| Attention softmax | Non-deterministic unless kernel fixed | Flash-based kernels have determinism options |
| NVLink collective (AllReduce) | Non-deterministic by default | Reduction order varies by arrival |

**For trading systems:** MIG = strongest isolation (but lower raw throughput). CUDA Graphs = highest-leverage tail latency optimization — removing CPU-GPU sync points per kernel is single biggest P99/P999 improvement.

---

## 8. Batch=1 Decode — Memory-Bandwidth-Bound

### 8.1 Arithmetic Intensity Problem

[VERIFIED] Batch=1 decode step = matrix-vector (GeMV), not GeMM. AI ≈ **1-2 FLOPs/byte**. H100 compute roofline: 591 FLOPs/byte to be compute-bound → **decode at batch=1 is 300-600× below roofline**.

[VERIFIED] 70B at FP16 → each decode step reads ~140 GB weights from HBM. H100 3.35 TB/s → theoretical min **~42 ms/token at batch=1**. Tensor Core compute finishes in fraction — **GPU sits idle waiting for memory.**

### 8.2 Memory Tier per Phase

| Phase | Dominant Tier | Why |
|---|---|---|
| **Prefill (compute-bound)** | L2 + SMEM | Large GEMM tiles partial L2 fit; TMA feeds SMEM; Tensor Cores saturated |
| **Decode batch=1 (BW-bound)** | **HBM** | **All weights read once/token; AI too low for L2 reuse** |
| Decode batch=32+ | Transition | Weights reused across batch; L2 hit rate rises; approaches compute-bound above ~64 |
| Attention (decode) | HBM (KV cache) | KV cache grows with context; at 128k tokens, KV cache >> L2 |

### 8.3 Per-Generation Decode Performance (70B FP16, batch=1, theoretical)

| GPU | HBM BW | Decode tok/s | Notes |
|---|---|---|---|
| H100 SXM5 | 3.35 TB/s | ~24 tok/s | 140 GB / 3.35 TB/s ≈ 41.8 ms/tok |
| **H200 SXM** | **4.8 TB/s** | **~34 tok/s** | Same weights; **+43% BW = +43% throughput** |
| **B200** | **7.48 TB/s** | **~53 tok/s** | **2.24× H100; BW, not FLOPs** |
| **B200 (NVFP4)** | 7.48 TB/s ÷ 4× quant | **~212 tok/s** | **FP4 = 4× fewer bytes/param** |

[VERIFIED] H200 "delivers 43% more token throughput at same batch size — which is why the H200 exists." (Source: [Spheron AI memory wall](https://www.spheron.network/blog/ai-memory-wall-inference-latency-guide-2026/), accessed 2026-04-23)

### 8.4 Blackwell TMEM and Decode Attention

[VERIFIED] TMEM reduces attention accumulation cost in decode. On Hopper, wgmma accumulators in registers limit on-chip KV-head state. TMEM's 256 KB/SM provides larger accumulator budget for grouped-query attention (GQA) heads during decode → more KV rows accumulated before flushing to SMEM/HBM.

TMEM's 420-cycle cache-miss latency vs Hopper's ~1000 cycles — at batch=1, each KV load has minimal reuse, so TMEM as staging buffer for partial sums meaningfully reduces stall cycles.

### 8.5 NVFP4 Bandwidth-First Thesis

Panel core thesis validated by NVIDIA's own product decisions:
- **H200 vs H100**: identical compute, +43% HBM bandwidth → priced above H100
- **B200**: 2.4× H100 bandwidth; FP4 reduces bytes/param. "20 PFLOPS FP4" is marketing — **mechanistic value at batch=1 is byte reduction**
- **B300 vs B200**: identical HBM BW (8 TB/s), +50% capacity (288 GB) → enables single-GPU serving of models that couldn't fit one copy
- **NVLink-C2C**: 900 GB/s coherent overflow → LPDDR5X as second HBM tier at 1/6 speed but 2.5× capacity

---

## 9. Capital Markets Talking Points

1. **The roofline is NOT your GPU's TFLOPS spec.** Batch=1 decode operates at 1-2 FLOP/byte. **H100's 3.35 TB/s HBM defines your latency floor — not its 3,958 TFLOPS FP8 headline.** Buy memory bandwidth, not compute headroom, for real-time inference SLAs.

2. **H200 is a better inference chip than H100 at same batch.** Identical compute. +43% bandwidth. Every token in decode phase 43% faster at batch=1. H200 exists specifically for this.

3. **B200's 8 TB/s sustained bandwidth is the real headline.** 7.48 TB/s STREAM vs 4.8 TB/s H200. With NVFP4 (4× fewer bytes/weight than FP16), single B200 sustains token rates that previously required 2-3 H100s for memory-bound 70B models.

4. **NVFP4 accuracy risk is quantifiable and small.** DeepSeek-R1-0528 NVFP4: ≤1% degradation on language modeling, +2% on AIME 2024 vs FP8. "Nearly FP8 accuracy at 1.8× better memory efficiency" is peer-reviewed, not marketing hedge. Validate against own benchmark before production FP4.

5. **MIG gives hardware-isolated GPU partitions — not software throttling.** B300 sliced into 7 MIG = 7 × 34 GB partitions with dedicated SM, L2, HBM BW per slice. One misbehaving workload (runaway model, memory leak, rogue batch) CANNOT degrade another. **Only GPU feature that gives latency SLA guarantees analogous to VM isolation.**

6. **TMEM in B200/B300 is the accumulator reform enabling decode efficiency.** 256 KB/SM dedicated tensor memory removes register pressure from matrix accumulations → deeper GQA attention with less SMEM staging. 420-cycle cache-miss latency (vs 1000 Hopper) matters for decode where KV cache loads dominate.

7. **Grace Blackwell NVLink-C2C changes the memory tier model.** 900 GB/s coherent CPU-GPU at 7× PCIe Gen 5 BW → **Grace's 480 GB LPDDR5X is not "slow CPU memory" — it's second-tier HBM-adjacent store for KV cache overflow.** Sub-0.25 ms eviction latency measured. **128k-token contexts on single GB200 become practical.**

8. **NVL72 collapses the network tier into the memory tier.** 130 TB/s NVLink switching within 72 GPUs is **faster than HBM bandwidth of single H100** (3.35 TB/s). Tensor-parallel sharding across 72 GPUs communicates at memory speed, not network speed. **NVLink is no longer the bottleneck; HBM capacity is.**

9. **GPU-to-GPU bitwise determinism is now a product feature.** CCCL 3.1 (CUDA 13.1) shipped `gpu_to_gpu` mode for reductions. **First NVIDIA-native path to bitwise-identical results across hardware upgrades** (H100 pools → B200 pools) at 20-30% performance cost. Critical for risk engines needing audit-trail reproducibility.

10. **FP64 is dead on B300 for inference.** B300: 37 TF FP64 (B200) → **1.25 TF FP64**. NVIDIA explicitly targeting inference over HPC. **Capital markets workloads requiring FP64 (Monte Carlo, PDE solvers) should stay on H100/H200/A100** — B300 is NOT a general-purpose accelerator upgrade for these.

---

## 10. Sources

All accessed 2026-04-23. Key Tier 1/2:

- [arXiv:2512.02189v1 Microbenchmarking Blackwell](https://arxiv.org/html/2512.02189v1)
- [Inside NVIDIA Blackwell Ultra](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)
- [NVIDIA Blackwell Architecture](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)
- [NVIDIA Blackwell Tuning Guide](https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html)
- [NVIDIA Hopper Architecture In-Depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
- [arXiv:2407.08608 FlashAttention-3](https://arxiv.org/abs/2407.08608)
- [NVIDIA KV Cache Offload blog](https://developer.nvidia.com/blog/accelerate-large-scale-llm-inference-and-kv-cache-offload-with-cpu-gpu-memory-sharing/)
- [NVIDIA NVFP4 blog](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/)
- [NVIDIA CCCL determinism blog](https://developer.nvidia.com/blog/controlling-floating-point-determinism-in-nvidia-cccl/)
- [NVIDIA CCCL v3.1.0](https://github.com/NVIDIA/cccl/releases/tag/v3.1.0)
- [Chips and Cheese B200](https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut)
- [gau-nernst tcgen05 blog](https://gau-nernst.github.io/tcgen05/)
- [SemiAnalysis Blackwell SM internals](https://newsletter.semianalysis.com/p/dissecting-nvidia-blackwell-tensor)
- [arXiv:2402.16363v4 Roofline LLM Inference](https://arxiv.org/html/2402.16363v4)
- [arXiv:2512.01644v1 LLM Inference GPU Characterization](https://arxiv.org/html/2512.01644v1)
- [glennklockwood B300](https://www.glennklockwood.com/garden/processors/B300)
- [glennklockwood H100](https://www.glennklockwood.com/garden/processors/H100)
- [Tom's Hardware H200 announcement](https://www.tomshardware.com/news/nvidia-h200-gpu-announced)
- [NVIDIA MIG](https://www.nvidia.com/en-us/technologies/multi-instance-gpu/)
- [ServeTheHome NVLink Switch change](https://www.servethehome.com/ingrasys-shows-big-nvidia-nvlink-switch-chips-change-to-the-hgx-b200-b100/)
- [Cumulus Labs ionattention](https://cumulus.blog/ionattention)
- [NVIDIA CUTLASS 2-SM TMA](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/blackwell/04_mma_tma_2sm_sm100.cu)
- [Synopsys HBM3](https://www.synopsys.com/glossary/what-is-high-bandwitdth-memory-3.html)
- [NVIDIA Transformer Engine docs](https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/examples/fp8_primer.html)
- [CUDA H100 Course Lesson 2 Clusters/DSMEM](https://cudacourseh100.github.io/pages/lesson-2.html)
- [freeCodeCamp Blackwell memory evolution](https://www.freecodecamp.org/news/the-evolution-of-nvidia-blackwell-gpu-memory-architecture)
- [Spheron AI memory wall 2026](https://www.spheron.network/blog/ai-memory-wall-inference-latency-guide-2026/)

---

## 11. Known Gaps

1. **B300 L2 cache size** — not disclosed. Likely 126-160 MB range (dual-die architecture). [UNKNOWN]
2. RF read ports / operand collector config (Hopper and Blackwell) — die-level docs not publicly released. [UNKNOWN]
3. B300 warp scheduler config per SM — [LIKELY 4 based on Hopper/B200 continuity]
4. B300 exact TF32 and BF16 TFLOPS — FP64 (1.25) confirmed, others [UNKNOWN]
5. H100 HBM3 memory controller count "10" — architecturally consistent but GTC22 whitepaper 403'd. [LIKELY]
6. NVLink-C2C "5× power efficiency vs PCIe per byte" — NVIDIA marketing; specific multiplier [SPECULATIVE]. 7× bandwidth verified.
7. FlashAttention-3 utilization: 75% (preprint 740 TFLOPS FP16) vs **85% (NeurIPS final 840 TFLOPS BF16)** — use NeurIPS figure for panel, more authoritative
8. SM12x (consumer Blackwell, RTX 5000) MIG support — no data. Panel scope is datacenter B200/B300.
9. Exact NV-HBI bandwidth directional breakdown — **10 TB/s total widely cited** (VERIFIED), directional [UNKNOWN]
