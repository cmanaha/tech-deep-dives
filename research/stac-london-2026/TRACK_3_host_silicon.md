# Track 3 — Host Silicon (Graviton, EPYC, Xeon)

**Panel:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Track focus:** AWS Graviton lineage, AMD EPYC, Intel Xeon — from the memory-architecture angle
**Audience:** Capital markets tech leads (tail latency, jitter, determinism, power envelope)
**Researched:** 2026-04-21

---

## 1. Fact Sheet Per CPU

### 1.1 AWS Graviton Lineage

**Graviton3 (Neoverse V1) — baseline:**
- ARMv8.4-A, TSMC 5nm, 64 cores @ 2.6 GHz
- 8 × DDR5-4800, ~307 GB/s peak bandwidth
- 2 × 256-bit SVE + 4 × 128-bit NEON
- BF16 via SVE BF16, INT8 via NEON
- PCIe Gen 5.0
- AWS: C7g, M7g, R7g, Hpc7g, C7gn (single-socket only)
- First cloud CPU with SVE; first AWS gen with DDR5

**Graviton4 (Neoverse V2) — current production:**
- ARMv9.0-A, TSMC 5nm, 96 cores single socket @ 2.8 GHz (dual socket 2.7 GHz)
- L2: 2 MB/core (192 MB total); L3/SLC: 36 MB shared (sparse for core count)
- 12 × DDR5-5600, **537.6 GB/s per socket**
- Local DRAM latency ~114 ns; cross-socket ~138.6 ns avg, remote DRAM >250 ns
- Cross-socket bandwidth ~77 GB/s (vs AMD's 120+ GB/s) — weaker fabric
- 4 × 128-bit SVE2 + NEON; MMLA INT8 MatMul units; BF16 via SVE2 BF16
- AWS: C8g, M8g, R8g, X8g, C8gn, I8g (first Graviton with NUMA/dual-socket)
- Max memory dual socket: 1,536 GB DDR5

**Graviton5 (Neoverse V3) — M9g preview (Dec 2025):**
- ARMv9.2-A, TSMC 3nm, 192 cores single socket, ~132B transistors
- L2: 2 MB/core (384 MB total); L3: **180 MB** (5× Graviton4's 36 MB)
- 12 × DDR5 at DDR5-7200 (691.2 GB/s) or DDR5-8400 (**806.4 GB/s**) — 1.5× Graviton4
- PCIe Gen 6.0, 96 lanes, 2.84 TB/s full duplex
- Single socket replaces Graviton4 dual-socket (eliminates NUMA penalty)
- 33% lower inter-core latency vs Graviton4
- Planned variants: NVLink Fusion + UALink ports for GPU/XPU memory sharing
- Nitro Isolation Engine with formal verification
- [UNKNOWN] SVE2 vector length not publicly documented

### 1.2 AMD EPYC

**EPYC 9004 Genoa (Zen 4) — M7a/R7a:**
- TSMC N5 CCDs + 6nm IOD, up to 96c/192t
- L1 64 KB/core; L2 1 MB/core; L3 32 MB/CCD up to 384 MB/socket (Genoa-X: up to **1,152 MB** with 3D V-Cache)
- 12 × DDR5-4800, ~460 GB/s per socket
- AVX-512: 256-bit datapath (double-pumped) — 16 FP ops/clock/core
- BF16 + VNNI via AVX-512
- PCIe Gen 5.0, 128 lanes
- CXL 1.1+
- Genoa-X is the most cache-dense x86 processor available

**EPYC Bergamo (Zen 4c) — Cloud-native density:**
- 128c/256t, 2.25 GHz base / 3.1 GHz boost
- L3 reduced to 256 MB (16 MB/CCX vs 32 MB/CCX in Zen 4)
- Same ISA as Zen 4 including AVX-512
- TDP 360W (cTDP 320-400W)
- [UNKNOWN] No current-gen AWS Bergamo deployment

**EPYC 9005 Turin (Zen 5) — current:**
- TSMC 4nm (Zen 5 CCDs) + 3nm (Zen 5c Turin Dense CCDs)
- Turin: 128c/256t; Turin Dense: **192c/384t** (Zen 5c)
- Max boost 5.0 GHz (EPYC 9575F)
- 12 × DDR5-6400, **576 GB/s per socket** (theoretical); STREAM ~355 GB/s ADD
- **AVX-512 native 512-bit datapath** (Zen 5 doubles FP pipe width vs Zen 4's double-pumped)
- **32 FP ops/clock/core** (doubled from Zen 4's 16)
- BF16 + VNNI + native AVX-512 FP16 (Zen 5 matches Intel Sapphire Rapids FP16)
- IPC uplift vs Zen 4: +37% avg (24-workload HPC/AI geomean)
- PCIe Gen 5.0, 128 lanes
- CXL 2.0 [SPECULATIVE, platform generation]
- AWS: M8a (Oct 2025), R8a (Nov 2025), C8a (Dec 2025)

### 1.3 Intel Xeon

**Xeon 4th Gen Sapphire Rapids — AWS M7i (custom):**
- Golden Cove P-core; up to 60 cores (AWS custom up to 96 vCPU/metal)
- All-core turbo 3.2 GHz; max turbo 3.8 GHz
- 8 × DDR5-4800, ~307 GB/s
- L3 up to 112.5 MB
- **AMX — first generation** (BF16 + INT8 only; no FP16)
- AVX-512
- PCIe Gen 5.0
- AWS: M7i, M7i-flex, R7i, R7iz, C7i
- HBM variant (Xeon Max) exists — not in standard EC2
- R7iz sustained 3.9 GHz all-core = fastest Sapphire Rapids in any cloud

**Xeon 5th Gen Emerald Rapids:**
- Raptor Cove P-core, up to 64 cores
- 8 × DDR5-5200/5600
- L3 up to 320 MB (expanded from Sapphire's 112.5 MB)
- AMX improved frequency (~10% faster); still BF16+INT8, no FP16
- AI inference vs SR: 1.1–1.44× faster BF16
- [UNKNOWN] Limited AWS presence; AWS moved to Xeon 6 for M8i refresh

**Xeon 6 Granite Rapids (P-core) — AWS M8i:**
- Redwood Cove P-core; Intel 3 compute tiles + Intel 7 I/O tiles
- 128 P-cores (flagship 6980P); all-core turbo 3.2 GHz
- L1 112 KB/core; L2 2 MB/core; **L3 up to 504 MB per socket** (480 MB measured)
- L3 latency: ~33 ns local; ~24 ns penalty per die boundary; up to ~80 ns cross-die max
- DRAM latency: ~131 ns local; +26 ns per die boundary
- **12 memory channels** (4 per compute tile × 3 tiles) — finally matching AMD
- DDR5-6400 standard: ~614 GB/s
- **DDR5-8800 MRDIMM: ~844 GB/s** (Xeon 6900P); DDR5-8000 MRDIMM (6700P/6500P)
- Measured bandwidth 691.62 GB/s (DDR5-7200 config per chipsandcheese)
- MRDIMM bandwidth gain over DDR5-6400: 1.3–1.32× (STREAM); up to 1.39× per Micron
- MRDIMM latency advantage: ~40% lower under load vs RDIMM
- **AMX — BF16, INT8, and FP16 (NEW in Granite Rapids)**
- AMX throughput: 2,048 INT8 ops/cycle/core; 1,024 BF16 ops/cycle/core
- AVX-512 + AVX-512-FP16
- PCIe Gen 5.0; CXL 2.0
- AWS: M8i, M8i-flex, R8i
- Bandwidth vs Emerald Rapids: 2.3× with MRDIMM; 1.7× with DDR5-6400
- SNC3 mode: 3 NUMA nodes per socket (one per compute tile) — critical for inference placement
- AWS M8i uses standard DDR5-7200 RDIMMs, NOT MCRDIMMs (per chipsandcheese)

**Xeon 6 Sierra Forest (E-core) — not the inference play:**
- Crestmont E-cores, up to 288 cores
- NO AMX, NO AVX-512 (E-cores drop these)
- 8 × DDR5 (different platform)
- Cloud-native density, CDN, microservices
- Not suitable for latency-sensitive inference

---

## 2. DDR5 and MRDIMM Evolution

### DDR5 Channel Progression

| Platform | Year | Channels | Speed | Peak BW/Socket |
|----------|------|----------|-------|----------------|
| Graviton3, Sapphire Rapids | 2022–2023 | 8 | DDR5-4800 | ~307 GB/s |
| EPYC Genoa, Bergamo | 2022–2023 | 12 | DDR5-4800 | ~460 GB/s |
| Emerald Rapids | 2023 | 8 | DDR5-5600 | ~358 GB/s |
| Graviton4 | 2024 | 12 | DDR5-5600 | 537.6 GB/s |
| Xeon 6 Granite Rapids | 2024 | 12 | DDR5-6400 / MRDIMM-8800 | 614–844 GB/s |
| EPYC Turin | 2024 | 12 | DDR5-6400 | 576 GB/s |
| Graviton5 | 2025 | 12 | DDR5-7200/8400 | 691–806 GB/s |

**Panel observation:** Intel going from 8 → 12 DDR5 channels (Sapphire → Granite Rapids) is Intel's single biggest memory bandwidth gain in a decade. AMD has been at 12 channels since Genoa (2022).

### MRDIMM / MCR-DIMM

**What:** Multiplexed Combined Rank DIMM. Operates both ranks simultaneously to deliver 128 bytes per transfer (vs standard 64) — effectively doubling per-module bandwidth.

**Mechanism:** MRCD (Multiplexer Register Clock Driver) chip on DIMM + MDB (Multiplexed Data Buffer) chips. DRAM cells operate at half signaling rate (DDR5-4400 effective) while controller-facing speed is DDR5-8800. Reduces power and latency at device level.

**Status:**
- JEDEC JC-45 finalized DDR5 MRDIMM standard mid-2024
- Intel Granite Rapids uses proprietary MCRDIMM (compatibility distinctions from JEDEC spec)
- Gen1: 8,800 MT/s; Gen2 (roadmap): 12,800; Gen3 (roadmap): 17,600

**Real-world numbers (Xeon 6900P + MRDIMM):**
- Peak theoretical: ~844 GB/s
- STREAM COPY: 1.31× vs DDR5-6400 RDIMM
- Llama-3 inference: 1.33× vs DDR5-6400
- Latency under load: ~40% lower than RDIMM

**AMD:** Does NOT support MRDIMM on EPYC 9005 Turin. Expected in future generation.

**AWS:** M8i uses standard DDR5-7200 RDIMMs, not MCRDIMMs. MRDIMM is on-prem/bare-metal story for now.

### CXL 2.0 / CXL 3.0

- CXL 2.0: memory pooling (multiple hosts with distinct allocations)
- CXL 3.0: true shared memory with cache coherency, up to 256 GB/s bi-dir per port via PCIe 6.0
- Latency: CXL controllers add ~70 ns vs direct-attached DRAM; total 100–300 ns range
- Tail latency concern: CXL controller scheduling causes queuing spikes — high P99.9 reported
- Production deployment: Microsoft launched first CXL cloud instances Nov 2025
- CXL 3.0/3.1 commercial: expected 2027 (ABI Research)
- CXL 4.0 spec released Nov 2025 (doubles bandwidth to 128 GT/s)

**Capital markets relevance:** The 70+ ns added latency makes CXL unsuitable for hot-path inference but viable for cold feature stores or KV cache overflow. CXL tail latency is a known open problem — not yet production-safe for deterministic inference paths.

---

## 3. AMX / SVE2 / AVX-512 FP16 Inference Acceleration

### Intel AMX

**Hardware:** 8 × 1 KB tile registers (2D matrix in registers); TMUL (Tile Matrix Multiply Unit) per core.

| Generation | BF16 | INT8 | FP16 |
|------------|------|------|------|
| Sapphire Rapids | Yes | Yes | No |
| Emerald Rapids | Yes | Yes | No |
| **Granite Rapids (Xeon 6)** | **Yes** | **Yes** | **Yes (new)** |

**Throughput per core:** 2,048 INT8 ops/cycle; 1,024 BF16 ops/cycle; 1,024 FP16 ops/cycle.

**Real-world AWS data:**
- BF16 on M8i vs FP32 on M7i: up to 76% better performance
- BigBird-RoBERTa-large: 55–67% latency reduction
- Llama-3.2-3B-Instruct (BF16): 24–72% improvement
- DeepSeek-R1-Distill-Qwen-1.5B: 17–68% improvement
- M8i vs M7i average: 9–14% hardware advantage

**llama.cpp (community benchmarks):**
- LLaMA-3 3.2B INT8: ~57 t/s with AMX ON vs ~28 t/s with AMX OFF
- Generic prompts: ~100 t/s with AMX vs ~25 t/s
- RAG prompts: ~120 t/s with AMX vs ~35–40 t/s

**Critical:** AMX FP16 in Granite Rapids is the differentiator over Sapphire/Emerald. Models trained in FP16 (the default) can run on CPU at AMX speeds without quantization workflow.

### AMD AVX-512 Native (Zen 5)

| Feature | Zen 4 (Genoa) | Zen 5 (Turin) |
|---------|---------------|---------------|
| AVX-512 datapath | 256-bit (double-pumped) | **512-bit native** |
| FP ops/clock/core | 16 | **32** (doubled) |
| FP pipes | 3 | 4 |
| IPC uplift for HPC/AI | baseline | **+37% avg** |

**Why this matters:** Zen 4's AVX-512 was "half speed." Zen 5 executes native 512-bit in one clock. Real 2× throughput gain for AVX-512-tiled inference — not marketing.

**BF16/INT8/FP16:** Zen 5 supports AVX-512 BF16 (VCVTNEPS2BF16, VDPBF16PS), VNNI (INT8 dot product), and AVX-512 FP16 (EVEX-encoded, same as Intel Sapphire Rapids).

AMD claims 3.0–3.8× faster AI inference with 192-core EPYC 9965 vs comparable Xeon. [LIKELY] directionally correct given doubled AVX-512 throughput; independent verification at benchmark level not available in fetched sources.

### ARM SVE2 on Graviton4

- 4 × 128-bit SVE2 pipes (vs 2 × 256-bit SVE on Graviton3) — same theoretical width, different structure
- MMLA INT8 units; BF16 via SVE2 BF16
- SME2 (Scalable Matrix Extension 2) on Neoverse V3/V4 roadmap — NOT confirmed in Graviton4
- Graviton4 vector length: 128-bit (matches 4-pipe count)
- chipsandcheese: Graviton4 "3 × 128-bit loads" vs "2 × 256-bit" on Zen 4 — Graviton4 has load bandwidth constraint vs AMD for vector-heavy inference

**llama.cpp on Graviton:** Graviton4 (r8g) is officially documented llama.cpp target. Q4_0_8_8 re-quantization format optimized for SVE width. For interactive apps (>10 t/s), any 64 vCPU Graviton4 instance is adequate for small quantized models.

### Summary ISA Comparison

| Platform | Peak ISA Width | BF16 | INT8 | FP16 | Dedicated Matrix Unit |
|----------|----------------|------|------|------|----------------------|
| Graviton4 SVE2 | 4 × 128-bit | Yes | Yes (MMLA) | [UNKNOWN] | MMLA (limited) |
| Graviton5 SVE2+ | [UNKNOWN] | Yes | Yes | [UNKNOWN] | [UNKNOWN] |
| AMD Zen 4 AVX-512 | 256-bit effective | Yes | Yes | Yes | No |
| AMD Zen 5 AVX-512 | **512-bit native** | Yes | Yes | Yes | No |
| Intel Sapphire Rapids AMX | 512 + 1KB tiles | Yes | Yes | No | AMX (HW) |
| **Intel Granite Rapids AMX** | **512 + 1KB tiles** | **Yes** | **Yes** | **Yes** | **AMX (HW)** |

**Key insight for panel:** Intel AMX is the only hardware-dedicated matrix multiply unit. For batch inference, AMX amortizes overhead well. For single-request latency-optimal inference, AMD Zen 5's doubled AVX-512 at 5 GHz is competitive.

---

## 4. AWS Instance Mapping

### M8 Family Side-by-Side (2024–2025)

| Size | M8g (Graviton4) | M8a (EPYC Turin) | M8i (Xeon 6) |
|------|-----------------|------------------|--------------|
| metal-48xl | 192vCPU/768GiB | 192/768/75Gbps | — |
| 48xlarge | 192/768/50Gbps | 192/768/75 | 192/768/75 |
| 96xlarge | — | — | **384/1,536/100** |
| 24xlarge | 96/384/40 | 96/384/40 | 96/384/40 |

**M8i.96xlarge anomaly:** 384 vCPUs / 1,536 GiB — unique EC2 instance exceeding 192 vCPUs (non-metal). Likely 3-compute-tile Xeon 6 configuration.

### Memory-Bandwidth-Optimized Instances

| Instance | CPU | Memory Feature | Use Case |
|----------|-----|----------------|----------|
| R8g.metal-48xl | Graviton4 | 537 GB/s / 192 vCPU | Memory-intensive |
| X8g.metal-48xl | Graviton4 | 537 GB/s / 3 TiB RAM | Ultra-large datasets |
| R8a.metal-48xl | EPYC Turin | 576 GB/s / 768 GiB | Memory + high core |
| M8i.96xlarge | Xeon 6 | ~691 GB/s / 1,536 GiB | Large model inference + AMX |
| R7iz.metal-32xl | Sapphire Rapids | 307 GB/s at 3.9 GHz | Frequency-critical |

---

## 5. CPU vs Accelerator Inference Crossover

### When CPU Inference Wins

**PCIe tax on GPUs:** GPU inference needs host RAM → PCIe → GPU HBM → compute → PCIe → host. At 64 GB/s (PCIe 4) to 128 GB/s (PCIe 5), PCIe is the bottleneck for small-batch latency-sensitive inference. For models fitting in host DRAM (<~100 GB quantized), CPU inference eliminates this hop entirely.

**Small-model latency:** Models <~7B parameters (quantized INT8 or Q4) deliver >10 t/s single-request latency on a Graviton4 or EPYC Turin socket. 1B–3B models (classifiers, risk scorers, text routers) comfortably achieve <10ms per call.

**Determinism advantage:** GPUs have non-deterministic timing (SM scheduling, stream interleaving, thermal throttling, boost clock variation, PCIe contention). CPUs with isolcpus + IRQ steering + NUMA binding deliver substantially more deterministic μs-level latency. The jitter profile of a properly configured CPU is categorically different from a GPU submission pipeline.

### Model/Hardware Crossover Heuristic

| Model Size | Quantization | CPU (Graviton4/Turin) | GPU (A100) | CPU wins when |
|------------|--------------|----------------------|------------|---------------|
| 0.1B–1B | INT8/Q4 | Sub-ms possible | PCIe dominates at bs=1 | Always (bs=1) |
| 1B–7B | INT8 | 10–100 ms single req | 2–10 ms bs=1 after PCIe | Small batch, latency-critical |
| 7B–70B | Q4 | 100ms–1s | GPU wins clearly | Never (too slow) |
| >70B | Any | Not competitive | GPU wins | Never |

### Capital Markets Inference Taxonomy

| Use Case | Model Size | Latency | Recommended CPU |
|----------|-----------|---------|-----------------|
| Trade signal classifier | 100M–500M | <1 ms | Graviton4/Turin |
| Feature extraction | 100M–1B | <5 ms | Any M8 |
| Risk score per-trade | 500M–3B | <10 ms | M8i (AMX) or M8a |
| Market regime detector | 3B–7B | <50 ms | GPU preferred |
| LLM summarization | >7B | >100 ms | GPU required |

---

## 6. Capital Markets Angle

### NUMA Topology and Inference Latency

| Platform | Local DRAM | Cross-socket / Cross-die |
|----------|-----------|--------------------------|
| Graviton4 single socket | ~114 ns | ~139 ns avg dual socket |
| Graviton4 remote DRAM | 114 ns | >250 ns |
| Xeon 6 local die | ~131 ns | +26 ns per die boundary |
| Xeon 6 max remote SNC3 | ~131 ns | ~181 ns (2 die crossings) |
| EPYC Genoa NPS1 | ~114 ns | Similar to Graviton4 local |

**Rule for capital markets:** Pin the inference thread AND the model memory allocation to the same NUMA node. Use `numactl --membind=N --cpunodebind=N`. **Mandatory, not optional**, for deterministic sub-ms inference.

### CPU Isolation and IRQ Steering

```
isolcpus=4-7,12-15        # Remove from OS scheduler
systemctl disable irqbalance
echo 1 > /proc/irq/<NIC_IRQ>/smp_affinity   # Core 0 only
taskset -c 4-7 ./inference_server
numactl --cpunodebind=0 --membind=0 taskset -c 4-7 ./inference_server
```

MSI-X queue pinning: pin each NIC receive queue to the same core as the application thread that processes it. Eliminates cross-core cache-line bouncing.

### Huge Pages

- 2 MB huge pages reduce TLB miss rate ~512× vs 4 KB pages for large weight tensors
- 1 GB huge pages reduce it ~262,144× (for tensors > 1 GB)
- THP compaction can cause jitter spikes — capital markets typically sets THP to `never` and manages huge pages explicitly

### Why CPUs Are More Deterministic Than GPUs for Small Models

1. No CUDA kernel launch overhead (1–5 μs) that can exceed small-model computation time
2. No thermal boost variation (isolated cores at fixed frequency)
3. No PCIe latency variability
4. Deterministic L3 cache behavior once warmed
5. Mature OS-level isolation (isolcpus, nohz_full, rcu_nocbs, irqaffinity — 15+ years HFT-proven)

### Colocated Feature Extraction + Inference on Same NUMA Node

```
[Market Data Feed] → NIC → core 0-3 (NUMA 0)
                           ↓
[Feature Extraction] → core 4-7 (NUMA 0)
                           ↓
[Model Inference] → core 8-11 (NUMA 0, local weights)
                           ↓
[Signal Output] → core 0-3 (NUMA 0) → network
```

All intermediate data stays in L3 or NUMA-local DRAM. No cross-socket cache bouncing.

**Graviton4 anomaly:** With only 36 MB L3 across 96 cores, even 500M INT8 model exceeds cache. Performance comes from raw DRAM bandwidth (537 GB/s) and fast latency (114 ns), not cache-resident serving. Graviton5's 180 MB L3 changes this.

---

## 7. Key Talking Points for Carlos

1. **Memory channel gap 2022–2024:** Intel 8-channel DDR5 vs AMD 12-channel meant AMD had ~50% more bandwidth for two generations. Granite Rapids (2024) closed this.

2. **Graviton4's lean cache is a feature for throughput:** 36 MB L3 for 96 cores is sparse, but 537 GB/s at 114 ns means cache misses are cheap. Graviton5 then adds 180 MB L3.

3. **AMX FP16 in Xeon 6 eliminates the quantization tax:** Sapphire/Emerald required BF16 or INT8 for AMX. Granite Rapids runs FP16 at AMX speed — no quantization workflow for HuggingFace FP16 models.

4. **AMD Zen 5 native 512-bit AVX-512 doubles inference throughput vs Zen 4 with zero code changes.** llama.cpp, PyTorch, ONNX Runtime all use AVX-512 paths. M7a → M8a = 2× for GEMV/GEMM in attention.

5. **MRDIMM bandwidth is the most impactful no-software-change upgrade:** 12 × DDR5-6400 RDIMM → 12 × DDR5-8800 MRDIMM on Xeon 6900P: 1.33× better Llama-3 inference, 1.31× STREAM, ~40% lower latency under load.

6. **CPU determinism for capital markets is not consolation prize:** Properly isolated CPU (isolcpus + noirq + huge pages + NUMA bind) delivers bounded P99.9 latency. GPU at batch=1 adds kernel launch overhead, PCIe variability, thermal boost uncertainty.

7. **NUMA topology is the hidden inference tax on large instances:** m8i.96xlarge without NUMA pinning crosses die boundaries per weight fetch. Over millions of accesses, this can double tail latency. Fix is numactl — often skipped.

8. **CXL memory expansion is real but tail latency disqualifies it from the inference hot path.** Use for cold feature stores, not hot weight serving.

9. **Graviton5 is a single-socket answer to a dual-socket problem:** 192 V3 cores in one socket with 180 MB L3, 806 GB/s DRAM, PCIe 6. Eliminates Graviton4's cross-socket penalty.

10. **Host CPU feeds the accelerator — host memory path matters for GPU inference too.** Graviton4/Turin host with 537–576 GB/s bandwidth keeps multiple GPUs fed. An 8-channel Sapphire Rapids host (307 GB/s) starves a GPU cluster.

---

## 8. Gaps

1. "Graviton4 3-socket c8g" from the brief: [UNKNOWN] — no documentation. AWS's largest Graviton4 is 2-socket × 96 = 192 vCPU metal-48xl.
2. Graviton5 SVE2 vector length: not publicly documented.
3. AWS M8i with MRDIMM: M8i uses standard DDR5-7200 RDIMMs per chipsandcheese — not MCRDIMMs.
4. Graviton3E specific memory specs: not differentiated in public AWS docs.
5. EPYC Turin L3 total per socket (dominant SKU): [LIKELY ~512 MB for 16-CCD] not confirmed in fetched sources.

---

## Sources

All accessed 2026-04-21.

1. [AWS Graviton — Wikipedia](https://en.wikipedia.org/wiki/AWS_Graviton)
2. [Graviton 3 First Impressions — Chips and Cheese](https://chipsandcheese.com/p/graviton-3-first-impressions)
3. [AWS Graviton llama.cpp](https://github.com/aws/aws-graviton-getting-started/blob/main/machinelearning/llama.cpp.md)
4. [EC2 C8g M8g Launch](https://aws.amazon.com/about-aws/whats-new/2024/09/amazon-ec2-c8g-m8g-instances/)
5. [Neoverse V2 in Graviton 4 — Chips and Cheese](https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4)
6. [Graviton5 Balance — NextPlatform](https://www.nextplatform.com/compute/2025/12/05/aws-graviton5-strikes-a-different-balance-for-server-cpus/1695576)
7. [Graviton5 Announced — Phoronix](https://www.phoronix.com/news/AWS-Graviton5-Announced)
8. [Graviton5 192-core — Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/amazon-unveils-192-core-graviton5-cpu-with-massive-180-mb-l3-cache-in-tow-ambitious-server-silicon-challenges-high-end-amd-epyc-and-intel-xeon-in-the-cloud)
9. [EC2 M9g Preview](https://aws.amazon.com/about-aws/whats-new/2025/12/ec2-m9g-instances-graviton5-processors-preview/)
10. [AMD EPYC 9004 Genoa Launch — WCCFTech](https://wccftech.com/amd-4th-gen-epyc-genoa-zen-4-cpus-official-launch-96-cores-192-threads-worlds-fastest-server-chips/)
11. [EC2 R7a AWS Blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-r7a-instances-powered-by-4th-gen-amd-epyc-processors-for-memory-optimized-workloads/)
12. [AMD EPYC 9754 — Phoronix](https://www.phoronix.com/review/amd-epyc-9754-bergamo)
13. [AMD EPYC Turin 9005 — Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/amd-launches-epyc-turin-9005-series-our-benchmarks-of-fifth-gen-zen-5-chips-with-up-to-192-cores-500w-tdp)
14. [AMD 5th Gen EPYC Launch](https://www.amd.com/en/newsroom/press-releases/2024-10-10-amd-launches-5th-gen-amd-epyc-cpus-maintaining-le.html)
15. [AMD EPYC 9005 Series](https://www.amd.com/en/products/processors/server/epyc/9005-series.html)
16. [Zen 5 — Wikipedia](https://en.wikipedia.org/wiki/Zen_5)
17. [EC2 M8a AWS Blog](https://aws.amazon.com/blogs/aws/new-general-purpose-amazon-ec2-m8a-instances-are-now-available/)
18. [EC2 M7i](https://aws.amazon.com/ec2/instance-types/m7i/)
19. [Xeon 6 Memory Subsystem — Chips and Cheese](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory)
20. [AWS AMX Blog](https://aws.amazon.com/blogs/compute/accelerate-cpu-based-ai-inference-workloads-using-intel-amx-on-amazon-ec2/)
21. [Granite Rapids — Wikipedia](https://en.wikipedia.org/wiki/Granite_Rapids)
22. [Granite Rapids Xeon 6 — NextPlatform](https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/)
23. [Xeon 6 Memory — Chips and Cheese](https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory)
24. [MRDIMM — Micron](https://www.micron.com/products/memory/dram-modules/mrdimm)
25. [Xeon 6900P Launch — Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/intel-launches-granite-rapids-xeon-6900p-series-with-120-cores-matches-amd-epycs-core-counts-for-the-first-time-since-2017)
26. [EC2 M8i](https://aws.amazon.com/ec2/instance-types/m8i/)
27. [Sierra Forest Xeon 6 — Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/intel-launches-144-core-sierra-forrest-xeon-6-cpus-granite-rapids-follows-in-q3)
28. [CXL Memory Expansion — Introl](https://introl.com/blog/cxl-memory-expansion-pooling-disaggregated-memory-ai-data-center-2025)
29. [CPU ISAs for LLM Inference — Cortensor](https://docs.cortensor.network/technical-architecture/ai-inference/cpu-instruction-sets-for-llm-inference-avx-amx-sme-vs-gpus)
30. [EC2 X8g AWS Blog](https://aws.amazon.com/blogs/aws/now-available-graviton4-powered-memory-optimized-amazon-ec2-x8g-instances/)
31. [GPU vs CPU Inference — GMI Cloud](https://www.gmicloud.ai/en/blog/gpu-inference-vs-cpu-inference-speed-cost-and-scalability)
32. [Red Hat RHEL RT 9 — Isolating Interrupts](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_real_time/9/html/optimizing_rhel9_for_real_time_for_low_latency_operation/assembly_binding-interrupts-and-processes_optimizing-rhel9-for-real-time-for-low-latency-operation)
33. [NUMA Huge Pages](https://anshadameenza.com/blog/technology/2025-01-22-memory-management-numa-huge-pages-compaction/)
