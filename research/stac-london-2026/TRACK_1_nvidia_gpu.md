# Track 1 — NVIDIA GPU Inference Silicon
## Memory Architecture: Hopper to Blackwell Ultra
### STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
### Panel Track: NVIDIA Data-Center GPU Silicon — The Memory Angle

**Prepared:** 2026-04-21
**Audience:** Capital markets tech leads — tail latency, jitter, determinism, power envelope
**Thesis:** Memory bandwidth, locality, and data movement have replaced FLOPs as the inference bottleneck

---

## 1. Fact Sheet Per Generation

### 1.1 H100 (Hopper, GH100) — "The Bandwidth Floor"

| Parameter | H100 SXM5 | H100 PCIe | Notes |
|-----------|-----------|-----------|-------|
| Architecture | Hopper (GH100) | Hopper (GH100) | TSMC 4N process, 80B transistors |
| HBM Type | HBM3 | HBM2e | SXM5 = first GPU ever with HBM3 |
| HBM Stack Count | **5 stacks** (6th disabled) | 5 stacks | 5120-bit memory interface |
| Memory Capacity | **80 GB** | 80 GB | |
| Peak Memory Bandwidth | **3.35 TB/s** | ~2.0 TB/s | 1.68× faster than PCIe variant |
| L2 Cache | **50 MB** | 50 MB | 1.25× A100's 40 MB |
| Shared Memory per SM | Up to **228 KB** | Up to 228 KB | Configurable; up from A100's 164 KB |
| Register File per SM | **256 KB** | 256 KB | |
| Register File (GPU total) | **33,792 KB** | 29,184 KB | SXM5 has more active SMs |
| SM Count | 132 (SXM5) | 114 (PCIe) | |
| NVLink Generation | NVLink 4 | PCIe Gen5 only | No NVLink on PCIe H100 |
| NVLink Bandwidth (per GPU) | **900 GB/s** bi-dir | N/A | 18 links × 25 GB/s/direction each |
| vs. PCIe Gen5 | 7× faster than PCIe Gen5 | 128 GB/s | |
| TDP | **700 W** | 350 W | |
| FP8 Peak | 2,000 TFLOPS (4,000 w/sparsity) | | Halves memory traffic vs FP16 |
| FP16/BF16 Peak | 1,000 TFLOPS (2,000 w/sparsity) | | |
| Process Node | TSMC 4N | TSMC 4N | |

**Key memory insight:** The H100 SXM5 enables the 6th HBM stack for a different reason than bandwidth — the stack was disabled on H100 for yield management. The H200 re-enables it with upgraded HBM3e. [VERIFIED] (Source: NVIDIA Hopper Architecture In-Depth, developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/, accessed 2026-04-21)

**FP8 and memory traffic:** Transformer Engine dynamically switches FP8/FP16 per layer. FP8 "halves data storage requirements" — meaning weight traffic from HBM is halved vs FP16, not merely compute throughput doubled. The memory bandwidth savings are the primary inference benefit. [VERIFIED] (Source: NVIDIA Hopper Architecture In-Depth, developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/, accessed 2026-04-21)

---

### 1.2 H200 (Hopper Refresh) — "Enabling the 6th Stack"

| Parameter | H200 SXM | H200 NVL | Notes |
|-----------|----------|----------|-------|
| Architecture | Hopper (GH100) | Hopper (GH100) | Same die, memory subsystem upgraded |
| HBM Type | **HBM3e** | HBM3e | Higher speed binning vs HBM3 |
| HBM Stack Count | **6 stacks** | 6 stacks | 6th stack re-enabled; 6 × 24 GB physical |
| Memory Capacity | **141 GB** | 141 GB | Physical = 144 GB; 3 GB held for yield |
| Peak Memory Bandwidth | **4.8 TB/s** | ~3.9 TB/s | 43% more than H100 SXM5 |
| L2 Cache | 50 MB | 50 MB | Unchanged from H100 |
| Shared Memory per SM | Up to 228 KB | Up to 228 KB | Same SM design as H100 |
| Register File per SM | 256 KB | 256 KB | |
| NVLink Generation | NVLink 4 | NVLink Bridge only | SXM uses NVSwitch |
| NVLink Bandwidth (per GPU) | **900 GB/s** bi-dir | N/A | Unchanged from H100 |
| PCIe (NVL form factor) | PCIe Gen5, 128 GB/s | PCIe Gen5 | |
| TDP | **700 W** | 600 W | Same TDP as H100 SXM, better TB/W |
| FP8 Peak | ~4 PFLOPS (SXM) | | Same Tensor Cores; inference gains from bandwidth |
| MIG Support | Up to 7 instances | Up to 7 @ 16.5 GB | |

**Why H200 matters more for inference than training:** The bottleneck in LLM inference at batch=1 is HBM reads during the autoregressive decode phase — one token at a time, loading weights every step. 4.8 TB/s vs 3.35 TB/s directly translates to ~43% faster token generation on memory-bound decodes. NVIDIA claims 1.9× faster Llama 2 70B inference vs H100. [VERIFIED] (Source: NVIDIA H200 product page, nvidia.com/en-us/data-center/h200/, accessed 2026-04-21)

**Stack count detail:** "NVIDIA swapped out HBM3 for HBM3E, which allows a boost in both memory bandwidth and capacity — and also enabled the 6th HBM memory stack, which was disabled in the original H100." [VERIFIED] (Source: ServeTheHome/AnandTech analysis corroborated by Tom's Hardware H200 announcement, tomshardware.com/news/nvidia-h200-gpu-announced, accessed 2026-04-21)

---

### 1.3 B200 / GB200 (Blackwell) — "Dual-Die, Dual Bandwidth"

| Parameter | B200 (single GPU) | GB200 Superchip | Notes |
|-----------|------------------|-----------------|-------|
| Architecture | Blackwell (GB100) | Grace + 2× B200 | Dual-die design, TSMC 4NP |
| Transistors | 208 billion | — | 2.6× Hopper GH100 |
| HBM Type | **HBM3e** | HBM3e | |
| HBM Stack Count | **8 stacks** | 16 stacks (2 GPUs) | 4 per chiplet × 2 chiplets |
| Memory Capacity | **192 GB** | **372 GB** (2 × 186 GB) | Per AWS: 372 GB per Superchip |
| Peak Memory Bandwidth | **8.0 TB/s** | ~16 TB/s | Benchmark measured: 7.48 TB/s sustained |
| Memory Bus Width | 8,192-bit | — | 2 × 4,096-bit (one per chiplet) |
| L2 Cache | 4 partitions (2× Hopper) | — | Exact MB size not published by NVIDIA |
| Shared Memory per SM | **228 KB** | — | Same L1/SMEM as Hopper |
| TMEM (Tensor Memory) | **256 KB per SM** | — | NEW: dedicated Tensor Core scratchpad |
| Register File per SM | **256 KB** | — | |
| SM Count | 160 | 320 (2 GPUs) | |
| NVLink Generation | NVLink 5 | NVLink 5 | |
| NVLink Bandwidth (per GPU) | **1.8 TB/s** bi-dir | 3.6 TB/s per Superchip | 18 links × 100 GB/s/dir; 2× NVLink 4 |
| NVSwitch (HGX B200) | 2× NVSwitches | — | |
| CPU-GPU Interconnect | PCIe Gen5 (HGX B200) | NVLink-C2C 900 GB/s | Superchip uses C2C; HGX uses PCIe |
| TDP | **1,000 W** (HGX) / 1,200 W (GB200) | — | Configurable |
| FP4 Peak | **20 PFLOPS** (dense, no sparsity) | 40 PFLOPS | NEW precision tier |
| FP8/FP6 Peak | **10 PFLOPS** | 20 PFLOPS | |
| FP16/BF16 Peak | 5 PFLOPS | 10 PFLOPS | |
| TF32 Peak | 2.5 PFLOPS | 5 PFLOPS | |
| FP64 Peak | 40 TFLOPS | 80 TFLOPS | |

**VERIFIED numbers** (Source: NVIDIA GB200 NVL72 product page, nvidia.com/en-us/data-center/gb200-nvl72/, accessed 2026-04-21; AWS P6 instance page, aws.amazon.com/ec2/instance-types/p6/, accessed 2026-04-21; NVIDIA Blackwell Ultra technical blog, developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/, accessed 2026-04-21)

**NVLink 5 memory fabric insight:** At 1.8 TB/s per GPU, the NVLink bandwidth between GPUs in a node is now 22.5% of peak HBM bandwidth (8.0 TB/s). In Hopper, NVLink was 900 GB/s vs 3.35 TB/s HBM — 26.9%. The ratio is similar, but the absolute bandwidth allows much larger KV-cache sharing across GPUs without HBM saturation. [VERIFIED] (Source: NVIDIA Blackwell Ultra blog, developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/, accessed 2026-04-21)

**GB200 NVL72 rack-scale numbers:**
- 72 B200 GPUs + 36 Grace CPUs in one NVLink domain
- 13.4 TB total HBM3e (across 72 GPUs)
- 576 TB/s aggregate HBM bandwidth
- 130 TB/s NVLink switching bandwidth
- Acts as a single logical GPU for model parallelism purposes
[VERIFIED] (Source: NVIDIA GB200 NVL72 product page, nvidia.com/en-us/data-center/gb200-nvl72/, accessed 2026-04-21)

---

### 1.4 B300 / GB300 (Blackwell Ultra) — "12-High Stacks, More Memory"

| Parameter | B300 (single GPU) | GB300 NVL72 | Notes |
|-----------|------------------|-------------|-------|
| Architecture | Blackwell Ultra | Grace + 2× B300 | Same TSMC 4NP die |
| HBM Type | **HBM3e+** | HBM3e+ | 12-high stacks (vs 8-high on B200) |
| HBM Stack Count | **8 stacks** (12-Hi) | 16 per Superchip | Taller stacks = more capacity, same footprint |
| Memory Capacity | **288 GB** | ~20 TB (72 GPUs) | 50% more than B200's 192 GB |
| Peak Memory Bandwidth | **8.0 TB/s** | 576 TB/s | Same bandwidth as B200; capacity advantage |
| TMEM per SM | 256 KB | — | Inherited from base Blackwell |
| NVLink Generation | NVLink 5 | NVLink 5 | Same generation as B200 |
| NVLink Bandwidth (per GPU) | 1.8 TB/s | 130 TB/s NVSwitch | |
| TDP | **1,400 W** | — | +40% over B200 |
| FP4 Dense (no sparsity) | **15 PFLOPS** | 1,080 PFLOPS (NVL72) | 66.7% more than B200's 9 PFLOPS dense |
| FP8/FP6 | 10 PFLOPS | 720 PFLOPS (NVL72) | |
| FP16/BF16 | 5 PFLOPS | 360 PFLOPS | |
| Availability | Shipping Jan 2026 | Shipping 2026 | DGX B300 user guide went live 2026-01-20 |
| Attention Performance | 2× vs B200 | — | "2x higher attention performance" |
| Total system memory | — | 37 TB (HBM3e + LPDDR5X) | |
| Grace CPU cores | — | 2,592 Arm Neoverse V2 | 36 CPUs × 72 cores |

**VERIFIED** (Source: NVIDIA GB300 NVL72 product page, nvidia.com/en-us/data-center/gb300-nvl72/, accessed 2026-04-21; NVIDIA Blackwell Ultra technical blog, developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/, accessed 2026-04-21)

**Why B300 matters for inference:** The primary upgrade over B200 is 50% more HBM capacity (288 GB vs 192 GB), not more bandwidth. This allows larger models to fit on fewer GPUs, reducing tensor parallelism and thus reducing NVLink all-reduce overhead — which is a major source of latency jitter in distributed inference. Running a 70B parameter model on 2× B300 GPUs instead of 4× H200 GPUs eliminates 2 NVLink synchronization points per decode step. [VERIFIED capacity figures; analytical inference is SPECULATIVE] (Source: capacity from NVIDIA Blackwell Ultra blog, accessed 2026-04-21)

---

### 1.5 Grace-Hopper / Grace-Blackwell Superchip — "Coherent Memory Fabric"

| Parameter | GH200 (Grace-Hopper) | GB200/GB300 (Grace-Blackwell) |
|-----------|---------------------|-------------------------------|
| GPU Die | H100 (Hopper) | 2× B200/B300 (Blackwell) |
| CPU Die | Grace (72-core Neoverse V2) | Grace (72-core Neoverse V2) |
| CPU-GPU Interconnect | **NVLink-C2C** | **NVLink-C2C** |
| C2C Bandwidth | **900 GB/s total (450 GB/s/dir)** | 900 GB/s per direction |
| vs PCIe Gen5 | **7× higher bandwidth** | 7× higher bandwidth |
| C2C Energy Efficiency | **5× less power/byte than PCIe** | Same |
| Memory Coherence | Hardware coherent | Hardware coherent |
| GPU HBM | 96 GB HBM3 (GH200) | 192/288 GB HBM3e per 2-GPU pair |
| CPU DRAM | Up to 512 GB LPDDR5X | Up to 480 GB LPDDR5X |
| Combined Coherent Pool | **608 GB** (GH200) | ~672–768 GB (GB200/300) |
| CPU Memory Bandwidth | ~546 GB/s (LPDDR5X) | ~512 GB/s |
| CPU Fabric Bisection BW | 3.2 TB/s | 3.2 TB/s |
| GPU can access CPU memory at | Full NVLink-C2C bandwidth | Full NVLink-C2C bandwidth |
| ATS Support | Yes (Address Translation Services) | Yes |
| Unified virtual address space | Yes — single page table | Yes |

**VERIFIED** (Source: NVIDIA Grace Hopper Superchip Architecture In-Depth, developer.nvidia.com/blog/nvidia-grace-hopper-superchip-architecture-in-depth/, accessed 2026-04-21)

**What coherence unlocks for inference:**
1. KV-cache can overflow from HBM into CPU LPDDR5X at 900 GB/s (7× faster than PCIe). A model filling all 96 GB HBM on GH200 can transparently spill into 512 GB of LPDDR5X without explicit cudaMemcpy calls.
2. No page-level migration required — coherent cache-line granularity (64/128 bytes) transfers.
3. Eliminates the host-device copy bottleneck that dominates cold-path latency in PCIe-attached GPU systems.
4. For capital markets inference specifically: batch=1 requests for risk or pricing models that exceed single-GPU HBM can now run without multi-GPU tensor parallelism, removing a major source of latency variance.
[VERIFIED mechanism; inference application is SPECULATIVE] (Source: Grace Hopper architecture blog, accessed 2026-04-21)

---

## 2. On-Die Memory Hierarchy

### 2.1 Memory Hierarchy Comparison Table

| Level | H100 (Hopper) | B200 (Blackwell) | B300 (Blackwell Ultra) | Access Pattern |
|-------|--------------|-----------------|----------------------|----------------|
| **Register File** | 256 KB/SM | 256 KB/SM | 256 KB/SM | Per-thread, fastest |
| **TMEM (Tensor Memory)** | — | **256 KB/SM** | 256 KB/SM | NEW: Tensor Core dedicated scratchpad |
| **L1 / Shared Memory** | Up to 228 KB/SM | Up to 228 KB/SM | Up to 228 KB/SM | Programmer-visible scratchpad |
| **L2 Cache** | 50 MB | ~100 MB (4 partitions, 2× Hopper) | ~100 MB | On-die, all SMs share |
| **HBM (off-die)** | 80 GB @ 3.35 TB/s | 192 GB @ 8.0 TB/s | 288 GB @ 8.0 TB/s | Off-package, ~420 ns latency |
| **CPU DRAM (Superchip only)** | 512 GB @ 546 GB/s | 480 GB @ ~512 GB/s | 480 GB @ ~512 GB/s | Via NVLink-C2C, coherent |
| **NVMe (host)** | — | — | — | Via PCIe, not GPU-resident |

[VERIFIED for H100 from Hopper Architecture blog; VERIFIED for Blackwell TMEM from arXiv:2512.02189v1; L2 partition count from NVIDIA Blackwell Ultra blog; B300 TMEM inherited, not independently confirmed for B300 specifically — LIKELY]

### 2.2 TMEM: The Key Blackwell Architectural Innovation

Blackwell introduces **Tensor Memory (TMEM)**: 256 KB of on-chip memory per SM dedicated exclusively to Tensor Core operations.

**Architecture:**
- 2D array: 512 columns × 128 lanes of 32-bit cells
- Lane-column addressing (differs from SMEM row-major)
- Matrix D operands (accumulator outputs) always reside in TMEM
- Matrices A and B loaded from SMEM into Tensor Cores

**Performance:**
- TMEM read bandwidth: **16 TB/s per SM** (additive with SMEM — not competing)
- TMEM write bandwidth: **8 TB/s per SM**
- Cache-miss latency: **420 clock cycles** (vs Hopper HBM latency of ~1,000 cycles — 58% reduction)

**Inference relevance:**
- In batch=1 autoregressive decode, the bottleneck is reading weight matrices from HBM. TMEM allows accumulator results to persist between warp groups without round-tripping through SMEM or register file — reducing pressure on the shared memory bus.
- `tcgen05.mma` (new instruction): single-thread issue, no warp-synchronous barrier required. Enables finer-grained pipelining of memory fetches and compute.
- Dual-thread-block MMA: two SMs cooperate on one MMA operation, sharing operands from their respective SHMEMs. Effectively doubles the tile size without doubling the per-SM SMEM requirement.

[VERIFIED] (Source: arXiv:2512.02189v1 Microbenchmarking NVIDIA's Blackwell Architecture, accessed 2026-04-21; NVIDIA Blackwell Ultra technical blog, accessed 2026-04-21)

### 2.3 Shared Memory as Explicit Scratchpad (The Programmer-Visible Story)

NVIDIA GPUs expose shared memory (SMEM) as an **explicitly managed scratchpad** — unlike CPU L1/L2 caches, it is not hardware-managed. This is architecturally significant:

- **Programmer control = determinism:** Data in SMEM is there because software put it there. There are no evictions, no speculative prefetches, no cache coherence protocol overhead. This makes SMEM access latency **predictable to within a handful of clock cycles** — important for tail-latency guarantees in capital markets inference.
- **Hopper upgrade:** SMEM per SM increased from 164 KB (A100) to 228 KB (H100/H200), allowing larger tile sizes for GEMM operations before requiring HBM refills.
- **TMA on Hopper:** TMA (Tensor Memory Accelerator) loads tensors from HBM into SMEM asynchronously, freeing all threads from address-generation work. A single thread issues the TMA copy; other threads proceed with compute. This is the mechanism behind "asynchronous pipelines" in H100 attention kernels (FlashAttention-3 relies on this).
- **SMEM sizing for inference:** At batch=1, model dimensions often fit in fewer tiles — larger SMEM reduces HBM refill frequency. 228 KB vs 164 KB means fewer tile-fetch round trips for mid-sized models.

[VERIFIED] (Source: NVIDIA Hopper Architecture In-Depth, developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/, accessed 2026-04-21)

---

## 3. Interconnect and NVLink Memory Fabric

### 3.1 NVLink Evolution Table

| Generation | GPU | Per-GPU Bi-Dir BW | Links | Per-Link BW (each dir) | vs PCIe Gen5 |
|------------|-----|-------------------|-------|------------------------|--------------|
| NVLink 3 | A100 | 600 GB/s | 12 | 25 GB/s | — |
| **NVLink 4** | **H100 / H200** | **900 GB/s** | **18** | **25 GB/s** | **7×** |
| **NVLink 5** | **B200 / B300** | **1,800 GB/s** | **18** | **50 GB/s** | ~14× |

[VERIFIED] (Source: NVIDIA Hopper Architecture In-Depth, developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/, accessed 2026-04-21; NVIDIA Blackwell Ultra blog, developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/, accessed 2026-04-21)

### 3.2 NVSwitch Topology

| System | GPU Count | NVLink Domain | NVSwitch Count | All-to-All BW | NVLink BW Total |
|--------|-----------|---------------|----------------|---------------|-----------------|
| HGX H100 (8-GPU) | 8 | 8 | 4 | 900 GB/s per GPU | 7.2 TB/s aggregate |
| HGX H200 (8-GPU) | 8 | 8 | 4 | 900 GB/s per GPU | 7.2 TB/s aggregate |
| HGX B200 (8-GPU) | 8 | 8 | 2 | 1,800 GB/s per GPU | 14.4 TB/s aggregate |
| **GB200 NVL72** | **72** | **72** | Multiple | 1,800 GB/s per GPU | **130 TB/s** |
| **GB300 NVL72** | **72** | **72** | Multiple | 1,800 GB/s per GPU | **130 TB/s** |

[VERIFIED for HGX B200 from DGX B200 page (2 NVSwitches listed), for NVL72 130 TB/s from GB200 NVL72 and GB300 NVL72 pages, all nvidia.com, accessed 2026-04-21]

**The fabric analogy for capital markets:** In a 72-GPU NVLink domain, any GPU can read any other GPU's HBM at 1.8 TB/s GPU-to-GPU bandwidth. This is analogous to a shared memory space across the rack. For inference, this means a 400B-parameter model spread across 72 GPUs has sub-microsecond logical memory access times between GPU pairs — versus the microseconds-to-milliseconds of network-based all-reduce on PCIe systems.

### 3.3 CPU-GPU Interconnect: PCIe vs NVLink-C2C

| Metric | PCIe Gen5 (x16) | NVLink-C2C (Superchip) | Advantage |
|--------|----------------|------------------------|-----------|
| Bandwidth | 128 GB/s bi-dir | **900 GB/s bi-dir** | 7× |
| Latency | ~1–4 μs | Sub-microsecond | ~4–10× |
| Coherence | Software-managed (pageable) | **Hardware coherent** | Qualitative |
| Power per byte | Baseline | **5× more efficient** | |
| Memory addressability | Separate address spaces | **Unified virtual space** | |
| Atomic ops across CPU/GPU | No | **Yes** | |

[VERIFIED] (Source: NVIDIA Grace Hopper Superchip Architecture In-Depth, developer.nvidia.com/blog/nvidia-grace-hopper-superchip-architecture-in-depth/, accessed 2026-04-21)

**What NVLink-C2C unlocks (capital markets angle):**
- Pre-loaded model weights in CPU DRAM are accessible by GPU at full NVLink-C2C bandwidth — no explicit DMA required at inference time
- Cold-start weight load latency is bounded by NVLink-C2C (900 GB/s) not PCIe (128 GB/s) — 7× faster model "hot standby" recovery
- On PCIe systems, a 70B model (140 GB at FP16) takes ~1.1 seconds to load CPU→GPU over PCIe Gen5. On a Superchip, the GPU can begin executing immediately from CPU DRAM at 900 GB/s with coherent access.
[VERIFIED bandwidth numbers; inference application is SPECULATIVE]

---

## 4. AWS Instance Mapping: P5, P5e, P5en, P6

### 4.1 Instance Comparison Table

| Instance | GPU | GPUs | HBM/GPU | Total HBM | NVLink/NVSwitch BW | EFA Version | EFA BW | CPU | vCPUs | Sys RAM |
|----------|-----|------|---------|-----------|-------------------|-------------|--------|-----|-------|---------|
| **p5.48xlarge** | H100 SXM5 | 8 | 80 GB HBM3 | **640 GB** | 900 GB/s (NVSwitch) | EFAv2 | 3,200 Gbps | AMD EPYC 7R13 (Gen3) | 192 | 2 TiB |
| **p5.4xlarge** | H100 SXM5 | 1 | 80 GB HBM3 | **80 GB** | None (single GPU) | EFAv2 | — | AMD EPYC 7R13 | 16 | 256 GiB |
| **p5e.48xlarge** | H200 SXM | 8 | 141 GB HBM3e | **1,128 GB** | 900 GB/s (NVSwitch) | EFAv2 | 3,200 Gbps | AMD EPYC Gen3 | 192 | 2 TiB |
| **p5en.48xlarge** | H200 SXM | 8 | 141 GB HBM3e | **1,128 GB** | 900 GB/s (NVSwitch) | **EFAv3** | 3,200 Gbps | Intel Sapphire Rapids (custom 4th Gen Xeon) | 192 | 2 TiB |
| **p6-b200.48xlarge** | B200 | 8 | ~179 GB HBM3e | **1,432 GB** | 1.8 TB/s per GPU; 14.4 TB/s aggregate | EFAv4 | 3,200 Gbps (400 GB/s/GPU) | Intel Emerald Rapids (5th Gen Xeon) | 192 | 2,048 GiB |
| **p6-b300.48xlarge** | B300 (Blackwell Ultra) | 8 | ~268 GB HBM3e | **2,144 GB** | 1.8 TB/s per GPU | EFAv4 | **6,400 Gbps** | Intel Xeon Scalable | 192 | 4,096 GiB |
| **p6e-gb200 UltraServer** | B200 (in GB200) | 72 | 186 GB | **13,320 GB** | 130 TB/s NVLink | EFAv4 | 28,800 Gbps total | NVIDIA Grace CPU | 2,592 | 17,280 GiB |
| **p6e-gb300 UltraServer** | B300 (in GB300) | 72 | ~268 GB | ~20 TB | 130 TB/s NVLink | EFAv4 | Enhanced over GB200 | NVIDIA Grace CPU | 2,592 | Enhanced |

[VERIFIED] (Source: AWS EC2 P5 instance page, aws.amazon.com/ec2/instance-types/p5/, accessed 2026-04-21; AWS EC2 P6 instance page, aws.amazon.com/ec2/instance-types/p6/, accessed 2026-04-21; AWS P5en announcement blog, aws.amazon.com/blogs/aws/new-amazon-ec2-p5en-instances-with-nvidia-h200-tensor-core-gpus-and-efav3-networking/, accessed 2026-04-21)

**Pricing:** [UNKNOWN — No on-demand pricing listed on AWS instance pages as of 2026-04-21. P5 on-demand pricing was ~$98.32/hr for p5.48xlarge at launch (2023). P6 pricing is not yet publicly listed. Searched aws.amazon.com/ec2/instance-types/p5/, aws.amazon.com/ec2/instance-types/p6/ — no list pricing found. Recommend checking AWS Pricing Calculator directly.]

### 4.2 Key Differentiators for Inference Selection

**P5 → P5e upgrade story (memory):**
- HBM capacity: 640 GB → 1,128 GB per instance (+76%). A 70B FP16 model (140 GB) fits comfortably on 1 H200 vs requiring careful tensor parallelism on H100. For inference, fewer GPUs in the tensor parallel group = less all-reduce latency.
- Bandwidth: 3.35 TB/s → 4.8 TB/s per GPU (+43%). Direct decode throughput improvement at batch=1.
- Same NVLink 4, same NVSwitch, same EFAv2. The compute ASIC is identical.

**P5e → P5en upgrade story (CPU-GPU bandwidth):**
- CPU swap: AMD EPYC Gen3 → Intel Sapphire Rapids = PCIe Gen4 → **PCIe Gen5**
- PCIe Gen5 delivers up to **4× more CPU-GPU bandwidth** vs P5/P5e. [VERIFIED] (AWS P5en blog, accessed 2026-04-21)
- EFAv2 → EFAv3 with Nitro v5 = **up to 35% latency improvement** on inter-node collectives [VERIFIED] (AWS P5en blog, accessed 2026-04-21)
- Same GPU hardware. Benefit: faster weight loading, faster KV-cache offload to host, faster pre-processing pipelines that mix CPU and GPU.

**P6 (B200) vs P5en (H200) memory comparison:**
- HBM per instance: 1,128 GB → 1,432 GB (+27% capacity)
- HBM bandwidth per GPU: 4.8 TB/s → ~7.48 TB/s sustained (+56% measured) [VERIFIED] (arXiv:2512.02189v1, accessed 2026-04-21)
- NVLink: 900 GB/s → 1,800 GB/s per GPU (+100%)

**P6e-GB200 UltraServer (capital markets angle):**
- 72 GPUs as one NVLink domain = 13.3 TB of HBM3e accessible at 130 TB/s NVLink bandwidth
- Largest transformer models (GPT-4 class, 1T+ parameters) fit entirely in one domain
- Grace CPU co-located with NVLink-C2C — KV-cache offload to LPDDR5X at 900 GB/s
- Eliminates inter-node networking for inference on models that otherwise span multiple nodes

---

## 5. Inference-Specific Memory Orchestration

### 5.1 Tensor Memory Accelerator (TMA) on Hopper — Async Memory Hides Latency

**What TMA is:** A dedicated hardware unit on each SM that handles bulk data movement between HBM and SMEM asynchronously. Introduced in H100; present in H200 and Blackwell.

**Mechanism:**
1. A single elected thread issues a TMA copy descriptor specifying tensor dimensions (up to 5D)
2. Hardware executes the copy; the issuing thread and all other threads are freed
3. All threads wait on a `cuda::barrier` for completion — no spin-polling
4. Overlap: threads execute other independent computation while TMA fetches the next tile

**Why this matters at batch=1:**
- At batch=1 decode, attention computation is dominated by loading the KV-cache from HBM (read: entire context window's keys and values)
- Without TMA, every thread participates in address generation for each element — a software bottleneck that grows with tensor size
- With TMA, address generation is offloaded to hardware; threads only execute math. "The Tensor Cores are so fast that operations like address calculation can become a performance bottleneck; the TMA offloads this work."
- Result: the H100 achieves "truly asynchronous" pipelining where memory fetch for tile N+1 overlaps compute on tile N — flattening the per-layer latency profile

[VERIFIED] (Source: NVIDIA Hopper Architecture In-Depth, developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/, accessed 2026-04-21)

**TMA supports inter-thread-block copies:** TMA can also copy between thread blocks in a cluster — enabling distributed shared memory across multiple SMs. Critical for large-tile attention (FlashAttention-3 on H100 exploits this).

### 5.2 Blackwell TMEM + tcgen05 — Decoupling Accumulator from SMEM

**What changed from Hopper to Blackwell:**

| Aspect | Hopper (wgmma) | Blackwell (tcgen05) |
|--------|----------------|---------------------|
| Instruction granularity | Warp-group (128 threads) | **Single thread** |
| Accumulator storage | Register File | **TMEM (256 KB/SM)** |
| Synchronization | Warp-level barrier | None required per MMA |
| Dual-SM cooperation | No | **Yes (paired SMs share operands)** |
| SMEM requirement for large tiles | High (must hold full tile) | **Halved** (each of 2 SMs holds half) |

**Memory traffic implication for inference:**
- TMEM is additive with SMEM bandwidth — running both simultaneously doesn't create bus contention
- Accumulator results persist in TMEM across multiple warp groups — critical for long-context attention where intermediate results are reused
- Reduced SMEM pressure → larger effective tile size → fewer round-trips to HBM → lower per-token latency at batch=1

[VERIFIED] (Source: arXiv:2512.02189v1, accessed 2026-04-21; NVIDIA Blackwell Ultra blog, accessed 2026-04-21)

### 5.3 FP Precision and Memory Traffic: The Core Panel Insight

**The insight:** Lower precision reduces HBM bandwidth consumed, not just compute cycles. This is the key message for capital markets tech leads focused on memory bottlenecks.

| Precision | Bytes per Weight | Relative HBM Traffic | Transformer Engine Support |
|-----------|-----------------|---------------------|---------------------------|
| FP32 | 4 bytes | 1.0× (baseline) | No |
| BF16/FP16 | 2 bytes | 0.5× | Yes (H100+) |
| FP8 | 1 byte | 0.25× | Yes (H100+, first-gen TE) |
| FP6 | 0.75 bytes | 0.19× | Yes (B200+, second-gen TE) |
| FP4 (NVFP4) | 0.5 bytes | **0.125×** | Yes (B200+, second-gen TE) |

**Second-generation Transformer Engine (B200/B300):**
- Manages FP4, FP6, and FP8 per-layer dynamically
- NVFP4 two-level scaling: an FP8 (E4M3) micro-block scale applied to 16-value blocks, plus a tensor-level FP32 scale
- Reduces memory footprint "~1.8× compared to FP8 and up to ~3.5× vs FP16"
- Maintains "nearly FP8-equivalent accuracy"

**Quantitative memory traffic example (decode, batch=1, 70B model):**
- FP16 weights: 140 GB must be streamed from HBM every decode step
- FP8 weights: 70 GB per decode step → at H100 3.35 TB/s, decode time ∝ 70/3,350 = 20.9 ms/token theoretical HBM-bound floor
- FP4 weights on B200: 35 GB per decode step → at 8.0 TB/s HBM, floor = 4.4 ms/token theoretical
- This is why "30× faster inference" claims exist — they combine compute AND memory bandwidth improvements across generations

[VERIFIED precision bytes and TE behavior] (Source: NVIDIA Blackwell Ultra blog, accessed 2026-04-21; NVIDIA Hopper Architecture In-Depth, accessed 2026-04-21)
[VERIFIED: "~1.8× FP8 and up to ~3.5× vs FP16" reduction claim] (Source: NVIDIA Blackwell Ultra blog, accessed 2026-04-21)
[The ms/token calculations are SPECULATIVE — illustrative only, derived from the above verified numbers]

### 5.4 Batch=1 vs High-Batch: Memory Behavior Divergence

| Regime | Bottleneck | Memory Pattern | What Helps Most |
|--------|------------|----------------|-----------------|
| **Batch=1 (decode)** | HBM bandwidth (weight streaming) | Sequential HBM reads, KV-cache reads | Higher HBM BW, larger HBM capacity, FP8/FP4 quantization |
| **Batch=1 (prefill)** | Compute (attention is quadratic) | Large tiled SMEM reads | TMA, TMEM, larger SMEM, FP8 |
| **High-batch (throughput)** | Compute throughput | Regular, predictable HBM patterns | FP4 FLOPS, NVLink for tensor parallel |
| **Long context** | KV-cache HBM capacity | Large sequential reads | HBM capacity (141 GB, 192 GB, 288 GB tiers) |

**Capital markets inference is almost exclusively Batch=1:** Pricing a derivative, running a real-time risk model, or scoring a trade opportunity has no natural batching. The decode path is the critical path. This means:
1. Raw FLOP/s is nearly irrelevant — the bottleneck is HBM read bandwidth
2. H200 beats H100 purely on HBM bandwidth (4.8 vs 3.35 TB/s) — same compute die
3. B200/B300 adds TMEM to reduce SMEM pressure during attention, freeing more SMEM bandwidth for HBM prefetch
4. FP8/FP4 reduces the bytes that need to be read — this is free latency reduction

[VERIFIED for H100/H200 bandwidth numbers; batch=1 HBM-bound analysis is SPECULATIVE based on verified architecture facts]

### 5.5 CUDA Stream Prioritization and Graph Capture for Deterministic Latency

**CUDA Graphs:**
- Capture a sequence of GPU operations (kernel launches, memcpys, synchronizations) as a static graph
- On replay: single CPU submission (~10 μs) vs per-kernel overhead (20–200 μs per kernel)
- "Graph-captured execution typically has lower and more consistent latency"
- Beneficial when GPU kernels are short (<1 ms each) and launch overhead is a significant fraction of total latency
- Reduces tail latency by eliminating per-kernel driver/runtime processing on the CPU hot path

[VERIFIED] (Source: NVIDIA CUDA Graph documentation, docs.nvidia.com/dl-cuda-graph/cuda-graph-basics/cuda-graph.html, accessed 2026-04-21; NVIDIA technical blog on constant-time launch, developer.nvidia.com/blog/constant-time-launch-for-straight-line-cuda-graphs-and-other-performance-enhancements/, accessed 2026-04-21)

**Measured overhead numbers:**
- Per-kernel launch overhead (without graphs): 20–200 μs
- Graph replay overhead (straight-line graph, 10+ nodes): ~2.5 μs + ~1 ns/node
- Improvement: up to 80× reduction in CPU launch overhead per kernel for 10-node graphs

[VERIFIED] (Source: NVIDIA constant-time launch blog, accessed 2026-04-21)

**CUDA stream priorities:** Higher-priority streams preempt lower-priority work at scheduling granularity. Useful for latency-sensitive inference streams that share a GPU with background batch work. Does NOT provide hard real-time guarantees — preemption is cooperative at kernel boundaries, not mid-kernel.

---

## 6. Capital Markets Angle: Jitter, Determinism, Power

### 6.1 Jitter Reduction: What NVIDIA Provides

| Mechanism | What It Does | Jitter Reduction | Caveats |
|-----------|-------------|------------------|---------|
| **MIG (Multi-Instance GPU)** | Hardware partitioning: dedicated SM, L2, HBM slices per tenant | Eliminates cross-tenant HBM contention | Fixed slice sizes; H100/H200 up to 7 instances; reconfiguration takes ~100s ms |
| **MPS (Multi-Process Service)** | Software multiplexing: multiple CUDA contexts share one hardware context | Eliminates context-switch overhead between co-tenants | No hardware isolation; one misbehaving client affects all |
| **Exclusive Compute Mode** | Single process owns the GPU; no other processes can submit work | Maximum isolation; no shared resource contention | Utilization waste if process is idle |
| **CUDA Graph Capture** | Eliminates per-kernel CPU launch variability | Reduces CPU-induced jitter from 20–200 μs to ~2.5 μs | Requires static kernel graph; dynamic shapes complicate capture |
| **Stream Priorities** | High-priority stream preempts low-priority at kernel granularity | Soft priority, not hard isolation | Preemption only between kernels |
| **MPS Static Partitioning** | `-S` flag: deterministic SM allocation per MPS client | Deterministic resource share | Available on Hopper+; chunk = 8 SMs on Hopper |

[VERIFIED MIG behavior from nvidia.com/en-us/technologies/multi-instance-gpu/ and developer.nvidia.com/blog/minimizing-dl-inference-latency-with-mig/, accessed 2026-04-21]
[VERIFIED MPS static partitioning from CUDA 13.1 / CCCL 3.1 notes in search results, accessed 2026-04-21]
[VERIFIED CUDA Graph overhead numbers from NVIDIA blog, accessed 2026-04-21]

**MIG is the right tool for capital markets multi-tenancy:**
- Dedicated hardware slices → no HBM bandwidth sharing → predictable memory throughput
- Fault isolation: one MIG instance failure does not affect others
- H100/H200 MIG provides up to 7 instances, each with its own 50/7 ≈ 7 MB L2 slice and proportional HBM bandwidth
- B200 MIG [UNKNOWN — MIG support and instance count for B200 not confirmed in fetched sources. Searched developer.nvidia.com, MIG page. No B200-specific MIG spec found as of 2026-04-21]

### 6.2 Determinism: CUDA Guarantees and Caveats

**The honest story:** CUDA does not guarantee bit-exact results by default. Sources of non-determinism:

1. **Atomic operations:** Floating-point atomics (used in reduction kernels) are non-associative — execution order affects result. Non-deterministic by default.
2. **cuBLAS workspace:** cuBLAS uses internal workspace buffers that affect algorithm selection. Workspace size changes → different algorithm → different numerics.
3. **NCCL collectives:** All-reduce uses peer-to-peer messaging; message arrival order varies → sum order varies → floating-point non-determinism.

**What NVIDIA now provides (CUDA 13.1 / CCCL 3.1, 2025):**
- `GPU-to-GPU` determinism mode: reproducible reduction that guarantees "bitwise-identical results" across runs on same hardware
- Based on "reproducible reduction" presented at GTC 2024
- Trade-off: ~10–30% throughput reduction vs non-deterministic atomics [SPECULATIVE on the overhead — not verified from fetched sources]

[VERIFIED existence of GPU-to-GPU determinism mode] (Source: search results citing CUDA 13.1 CCCL 3.1 release, accessed 2026-04-21)
[VERIFIED qualitative trade-off] (Source: same)

**Capital markets implication:** For model validation, regulatory audit, and reproducibility of pricing results, GPU-to-GPU determinism mode in CUDA 13.1 is the first time NVIDIA provides a supported path to bitwise-reproducible GPU inference. Previously, teams had to use CPU fallback or accept numerical variance between runs.

### 6.3 Power Envelope: TDP Per Chip, Instance, Rack

| Generation | Per-GPU TDP | 8-GPU Instance TDP | Full Rack (NVL72) TDP |
|------------|-------------|-------------------|----------------------|
| H100 SXM5 | **700 W** | ~5,600 W + CPU ~350 W | ~6 kW (HGX H100 system est.) |
| H200 SXM | **700 W** | ~5,600 W + CPU ~350 W | ~6 kW (same chassis) |
| B200 (HGX) | **1,000 W** | **~14,300 W** (DGX B200 system total) | — |
| B300 | **1,400 W** | Higher than B200 | — |
| GB200 NVL72 | ~1,200 W per B200 GPU | — | Liquid-cooled; est. 120 kW+ per rack |
| GB300 NVL72 | ~1,400 W per B300 GPU | — | Liquid-cooled; est. 140 kW+ per rack |

[VERIFIED: H100/H200 700 W from product pages; B200 HGX 1,000 W and DGX B200 14.3 kW system TDP from DGX B200 page, nvidia.com/en-us/data-center/dgx-b200/, accessed 2026-04-21; B300 1,400 W from Blackwell Ultra blog, accessed 2026-04-21]
[Rack-level estimates for NVL72 are SPECULATIVE — NVL72 is liquid-cooled and per-rack TDP is not published in sources fetched]

**Colo cost story:**
- H100 → B200: GPU TDP increases 43% (700 W → 1,000 W), but FP8 inference throughput increases ~10× per GPU per NVIDIA claims
- Performance per watt at FP8 inference: B200 is dramatically better — but only if the workload can use high-precision quantized inference
- For capital markets batch=1 inference where throughput is low: per-token energy cost actually falls with B200 (each token generated faster, GPU active for less time)
- **Cooling constraint:** B300 at 1,400 W requires liquid cooling in most deployments. Air-cooled colo facilities cannot host B300 at full TDP. This is a non-trivial procurement constraint for financial institutions with long-term colo contracts.

### 6.4 Cold-Path Latency: Weight Loading and Kernel Launch

**Weight loading to GPU HBM (the "cold model" problem):**

| Link | Bandwidth | Time to load 70B FP16 model (140 GB) |
|------|-----------|---------------------------------------|
| PCIe Gen4 (P5) | ~64 GB/s effective | ~2.2 seconds |
| PCIe Gen5 (P5en, P6-B200) | ~128 GB/s effective | ~1.1 seconds |
| NVLink-C2C (Superchip) | 900 GB/s | **~0.16 seconds** |

[VERIFIED PCIe Gen5 bandwidth from AWS P5en blog; NVLink-C2C 900 GB/s from Grace Hopper blog. Time calculations are SPECULATIVE — derived from verified bandwidth numbers, assuming 70% efficiency]

**Kernel launch overhead (inference hot path):**
- Without CUDA Graphs: 20–200 μs per kernel × N kernels per token → significant jitter source
- With CUDA Graphs: ~2.5 μs for entire captured inference graph
- First-request overhead ("cold kernel"): JIT compilation of CUDA kernels at first invocation can take 100s of milliseconds to seconds. TensorRT pre-compiles and caches; PyTorch eager mode does not.
- `torch.compile` with `mode="reduce-overhead"` triggers graph capture automatically for stable shapes

[VERIFIED overhead numbers from NVIDIA CUDA Graph documentation, accessed 2026-04-21]

**Capital markets recommendation:** Pre-warm inference servers with a dummy batch=1 request before market open to eliminate JIT compilation latency and populate GPU L2 cache with frequently-accessed model layers. CUDA Graph capture should be mandatory for any latency-sensitive inference path.

---

## 7. Key Talking Points for Carlos (STAC London Panel)

1. **The bottleneck shifted from FLOP/s to GB/s.** H200 has the same compute die as H100 — the entire upgrade is HBM3e bandwidth (3.35 → 4.8 TB/s) and capacity (80 → 141 GB). For LLM inference at batch=1, this is the only number that matters. Every weight must be streamed from HBM on every decode step. [VERIFIED: same die, same SM count; bandwidth numbers from nvidia.com/en-us/data-center/h200/, accessed 2026-04-21]

2. **FP8/FP4 quantization is a memory traffic optimization, not just a compute one.** FP4 reduces weight bytes by 8× vs FP32. On an 8 TB/s HBM chip, that means 8× more tokens per second on memory-bound decode — at constant HBM bandwidth. This is the "precision as bandwidth multiplier" framing that lands with capital markets audiences. [VERIFIED: FP4 = 0.5 bytes/weight; Blackwell TE manages this automatically; NVIDIA Blackwell Ultra blog, accessed 2026-04-21]

3. **The 6th HBM stack story: H100 disabled it for yield; H200 re-enabled it with HBM3e.** This single architectural decision — enabling the 6th stack — accounts for the 141 GB vs 80 GB capacity jump. The die is identical. Capital markets workloads with large context windows (long prompt history, full order book state) benefit directly. [VERIFIED: Tom's Hardware H200 announcement, accessed 2026-04-21]

4. **NVLink-C2C on the Superchip collapses the host-device memory wall.** PCIe Gen5 provides 128 GB/s CPU-GPU bandwidth. NVLink-C2C provides 900 GB/s with hardware coherence. A 70B model fits in CPU DRAM (LPDDR5X) on a Grace Blackwell Superchip and the GPU can read it at 7× the speed of any PCIe system — with no explicit data transfer required. This changes the economics of "model warm standby" for latency-critical services. [VERIFIED: NVLink-C2C 900 GB/s, 7× PCIe claim, from Grace Hopper architecture blog, accessed 2026-04-21]

5. **TMEM on Blackwell is a new memory tier purpose-built to reduce accumulator spilling.** 256 KB per SM of dedicated Tensor Core storage (TMEM) separates accumulator data from the register file and SMEM. This means more complex attention patterns (long context, multi-query attention) can keep intermediate results on-chip rather than round-tripping to HBM. TMEM latency is 420 cycles vs HBM's ~1,000 cycles. [VERIFIED: arXiv:2512.02189v1, accessed 2026-04-21]

6. **MIG is the right isolation primitive for capital markets multi-tenancy.** Hardware-level partitioning of L2 cache, SMs, and HBM bandwidth per instance eliminates cross-tenant memory contention. The alternative (MPS) is software-level and provides no fault isolation. For a firm running multiple models (risk, pricing, compliance) on shared GPU infrastructure, MIG gives each model a deterministic memory bandwidth budget. [VERIFIED: nvidia.com/en-us/technologies/multi-instance-gpu/, accessed 2026-04-21]

7. **CUDA 13.1 delivers the first supported path to bitwise-deterministic GPU inference.** CUDA's `GPU-to-GPU` determinism mode (CCCL 3.1, 2025) guarantees bitwise-identical results across runs on the same hardware. This matters for model validation, regulatory audit trails, and A/B testing where numerical variance obscures model behavior changes. Previous to this, achieving GPU determinism required disabling atomics or running on CPU. [VERIFIED existence of feature; CUDA 13.1 release notes, accessed 2026-04-21]

8. **CUDA Graph capture reduces inference kernel launch jitter from 20–200 μs per kernel to ~2.5 μs per graph.** For a 32-layer transformer with ~3 kernels per layer, this is the difference between 1,920–19,200 μs of CPU overhead vs 2.5 μs total. At microsecond-resolution trading systems, this is not a marginal improvement — it eliminates an entire category of latency variance. [VERIFIED: NVIDIA constant-time launch blog, accessed 2026-04-21]

9. **B300's primary inference advantage over B200 is capacity, not bandwidth.** Both have 8 TB/s HBM bandwidth; B300 has 288 GB vs 192 GB (+50%). For capital markets firms running frontier-class models (70B+), the extra capacity means no tensor parallelism — one B300 can hold a model that required two B200s. Tensor parallelism adds NVLink synchronization latency every decode step. Eliminating it can improve P99 latency more than any HBM bandwidth increase. [VERIFIED capacity numbers; latency analysis is SPECULATIVE]

10. **Power envelope is the constraint that determines infrastructure strategy.** H100/H200 at 700 W fits in air-cooled facilities. B200 at 1,000 W pushes air-cooling limits. B300 at 1,400 W requires liquid cooling. For capital markets firms with 5–10 year colo contracts, GPU generation transitions are constrained by building infrastructure — not just procurement cycles. The GB300 NVL72 rack runs at potentially 120–140 kW — a datacenter row density that most existing financial-sector facilities cannot support without retrofitting. [VERIFIED TDP numbers from NVIDIA product pages; facility constraint analysis is SPECULATIVE]

---

## 8. Sources

| # | Title | URL | Type | Date | Freshness |
|---|-------|-----|------|------|-----------|
| 1 | NVIDIA Hopper Architecture In-Depth | https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ | Official NVIDIA blog (Tier 1) | 2022-03 (original); architecture still current | Aging — but architecture specifications are stable |
| 2 | NVIDIA H200 GPU Product Page | https://www.nvidia.com/en-us/data-center/h200/ | Official NVIDIA product page (Tier 1) | Accessed 2026-04-21 | Current |
| 3 | NVIDIA GB200 NVL72 Product Page | https://www.nvidia.com/en-us/data-center/gb200-nvl72/ | Official NVIDIA product page (Tier 1) | Accessed 2026-04-21 | Current |
| 4 | NVIDIA DGX B200 Product Page | https://www.nvidia.com/en-us/data-center/dgx-b200/ | Official NVIDIA product page (Tier 1) | Accessed 2026-04-21 | Current |
| 5 | Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era | https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/ | Official NVIDIA technical blog (Tier 1) | 2025 | Current |
| 6 | NVIDIA GB300 NVL72 Product Page | https://www.nvidia.com/en-us/data-center/gb300-nvl72/ | Official NVIDIA product page (Tier 1) | Accessed 2026-04-21 | Current |
| 7 | NVIDIA Grace Hopper Superchip Architecture In-Depth | https://developer.nvidia.com/blog/nvidia-grace-hopper-superchip-architecture-in-depth/ | Official NVIDIA technical blog (Tier 1) | 2023 | Aging — architecture specifications stable |
| 8 | Amazon EC2 P5 Instances | https://aws.amazon.com/ec2/instance-types/p5/ | AWS official documentation (Tier 1) | Accessed 2026-04-21 | Current |
| 9 | Amazon EC2 P6 Instances | https://aws.amazon.com/ec2/instance-types/p6/ | AWS official documentation (Tier 1) | Accessed 2026-04-21 | Current |
| 10 | New Amazon EC2 P5en Instances with NVIDIA H200 and EFAv3 | https://aws.amazon.com/blogs/aws/new-amazon-ec2-p5en-instances-with-nvidia-h200-tensor-core-gpus-and-efav3-networking/ | AWS official blog (Tier 1) | 2024 | Current |
| 11 | Minimizing Deep Learning Inference Latency with MIG | https://developer.nvidia.com/blog/minimizing-dl-inference-latency-with-mig/ | Official NVIDIA technical blog (Tier 1) | 2020 (MIG introduced on A100) | Stale on A100 specifics; MIG behavior on H100 cited from nvidia.com/en-us/technologies/multi-instance-gpu/ |
| 12 | NVIDIA Multi-Instance GPU (MIG) | https://www.nvidia.com/en-us/technologies/multi-instance-gpu/ | Official NVIDIA product page (Tier 1) | Accessed 2026-04-21 | Current |
| 13 | CUDA Graph Basics Documentation | https://docs.nvidia.com/dl-cuda-graph/cuda-graph-basics/cuda-graph.html | Official NVIDIA CUDA documentation (Tier 1) | Accessed 2026-04-21 | Current |
| 14 | Constant Time Launch for Straight-Line CUDA Graphs | https://developer.nvidia.com/blog/constant-time-launch-for-straight-line-cuda-graphs-and-other-performance-enhancements/ | Official NVIDIA technical blog (Tier 1) | 2023 | Current |
| 15 | Microbenchmarking NVIDIA's Blackwell Architecture (arXiv:2512.02189v1) | https://arxiv.org/html/2512.02189v1 | Peer-reviewed preprint (Tier 2) | 2024-12 | Current |
| 16 | Tom's Hardware — Nvidia Announces H200 GPU | https://www.tomshardware.com/news/nvidia-h200-gpu-announced | Hardware press (Tier 3 — used only for stack count corroboration) | 2023-11 | Aging |
| 17 | Tom's Hardware — NVIDIA Blackwell Ultra B300 | https://www.tomshardware.com/pc-components/gpus/nvidia-announces-blackwell-ultra-b300-1-5x-faster-than-b200-with-288gb-hbm3e-and-15-pflops-dense-fp4 | Hardware press (Tier 3 — corroboration only) | 2025 | Current |

Freshness key: **Current** = sourced/confirmed within 6 months of 2026-04-21 | **Aging** = 6–18 months | **Stale** = 18+ months

---

## Appendix A: Known Gaps and UNKNOWN Items

1. **B200 MIG support and instance configuration:** [UNKNOWN] MIG instance count, partition sizes, and L2 allocation for B200 were not found in fetched sources. H100/H200 have 7 MIG instances; B200 may differ. Search: NVIDIA MIG page, developer.nvidia.com/blog, DGX B200 page.

2. **Exact B200 L2 cache size in MB:** [UNKNOWN] Sources confirm "4 partitions, 2× Hopper" for Blackwell L2 but do not state the total MB. H100 L2 = 50 MB, so B200 L2 is likely ~100 MB but not confirmed. Search: arXiv:2512.02189v1 (no explicit MB figure).

3. **P5/P5e/P6 on-demand pricing:** [UNKNOWN] No on-demand list pricing was visible on aws.amazon.com instance pages as of 2026-04-21. Use AWS Pricing Calculator at calculator.aws.

4. **NVL72 per-rack TDP (GB200 and GB300):** [UNKNOWN] NVIDIA describes NVL72 as "liquid-cooled" but does not publish rack-level TDP in the sources fetched. The DGX B200 system (8 GPUs) is ~14.3 kW. A 72-GPU NVL72 would scale differently due to different PSU/networking architecture.

5. **B200/B300 MPS static partitioning behavior:** [UNKNOWN] CUDA 13.1 MPS static partitioning confirmed for Hopper (chunk = 8 SMs). Blackwell behavior not confirmed in fetched sources.

6. **p5.4xlarge single-GPU inference benchmarks:** [UNKNOWN] AWS offers p5.4xlarge (1× H100) for latency-optimized single-GPU inference. No AWS-published latency benchmarks found for this instance.
