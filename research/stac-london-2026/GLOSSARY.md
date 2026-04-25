# Glossary — STAC London 2026 Panel
## "Beyond Peak FLOPs: Memory and Modern Inference Silicon"

**Prepared:** 2026-04-23
**Scope:** Terms panelists and audience will encounter. Grouped thematically. First-occurrence explanations with verified definitions and inline source pointers where relevant.

---

## A. Memory Architecture Core Concepts

### Coherent memory

A memory region where multiple compute units (CPU cores, GPU SMs, accelerator chiplets) observe updates in a consistent order, with hardware enforcing cache consistency across all caches that have a copy of the data. When a CPU writes to address X, any GPU cache that holds X is automatically invalidated or updated — no explicit flush or DMA required. Enables CPU and GPU code to operate on the same data structures with the same semantics they would have inside a single multi-threaded process.

Opposite: **non-coherent** memory, where the programmer must explicitly `cudaMemcpy` or DMA to move data between the CPU and GPU memory spaces. Every CPU-GPU boundary in the PCIe world historically used non-coherent semantics.

Examples in the panel:
- NVLink-C2C (Grace-Blackwell Superchip) is hardware-coherent between CPU and GPU at 900 GB/s
- CXL 2.0/3.0 is coherent at PCIe speeds with ~70 ns controller overhead
- NVLink within an 8-GPU NVSwitch domain is coherent across all GPUs
- Traditional PCIe Gen5 is non-coherent (requires explicit cudaMemcpy)

### Memory pooling (CXL 2.0)

A hardware capability where one physical memory pool (DDR5 modules plugged into PCIe-form-factor CXL cards) is **shared across multiple CPU hosts**, with each host getting a dedicated slice. Reduces stranded memory: a server with 2 TB allocated but using 600 GB can lend the other 1.4 TB to a neighbor.

Not to be confused with memory **sharing** — in pooling, each host has its own partition of the pool; the hosts do not access the same addresses concurrently. CXL 2.0 is the pooling generation. CXL 3.0 adds true sharing (multiple hosts, same addresses, coherent).

Production status: Microsoft shipped the first CXL 2.0 pooled memory cloud instances November 2025. AWS has not yet surfaced CXL pooling in EC2 instances (silicon supports it on Graviton4/5, Turin, Xeon 6; exposure not yet there). CXL 3.0/3.1 commercial availability expected 2027.

### Memory sharing (CXL 3.0)

Multiple CPU hosts accessing the **same memory addresses at the same time**, with hardware-enforced cache coherence. Enables true distributed shared-memory computing across nodes. CXL 3.0 adds this on top of CXL 2.0 pooling. Target: rack-scale shared memory for large in-memory databases, distributed training, multi-host inference with shared KV caches.

### HBM — High Bandwidth Memory

Memory standard where DRAM dies are stacked vertically (8-high or 12-high) into a single package co-packaged next to the compute die on a silicon interposer. Each stack has a 1,024-bit wide interface — many times wider than the 64-bit interface of a DDR5 channel. That width is what gives HBM multi-TB/s bandwidth in a small footprint.

Generations relevant to the panel:

| Generation | Speed | Bandwidth per stack | Representative product |
|---|---|---|---|
| HBM3 | 6.4 Gb/s/pin | ~819 GB/s | H100 (5 stacks active, 80 GB total) |
| HBM3e | 8+ Gb/s/pin | ~1.2 TB/s | H200 (6 stacks, 141 GB), B200 (8 stacks, 192 GB) |
| HBM3e+ (12-Hi) | same signaling | same bandwidth | B300 (8 × 12-Hi stacks = 288 GB — taller stacks, same speed, more capacity) |
| HBM4 (2026-2027) | 11.7 Gb/s/pin | ~3.3 TB/s | Rubin (8 stacks) — 22 TB/s aggregate per GPU |

HBM pseudo-channel: each stack is split into 16 channels × 2 pseudo-channels. Each pseudo-channel operates semi-independently (shared command bus, independent data execution). Burst length = 8 beats = 32-byte minimum access granularity.

### DDR5

The mainstream DRAM standard for CPUs. 64-bit channel width. Ships at speeds from DDR5-4800 (2022 launch) to DDR5-8800 (2026 MRDIMM). Every CPU in the panel — Graviton4/5, EPYC Turin, Xeon 6 — uses 12 DDR5 channels per socket. Peak per-socket bandwidth scales with channel count × per-channel data rate: 614 GB/s at DDR5-6400, 691 GB/s at DDR5-7200, 844 GB/s at DDR5-8800.

### MRDIMM (Multiplexed Rank DIMM, also called MCR-DIMM)

A DDR5 module technology that accesses both ranks of a DIMM simultaneously via a multiplexer chip (MRCD), delivering 128 bytes per transfer instead of the standard 64 bytes. Effectively doubles per-module bandwidth. The underlying DRAM cells operate at half the signaling rate (DDR5-4400 effective device speed), which reduces power and latency at the device level while the controller-facing speed is DDR5-8800.

Intel Xeon 6900P supports MRDIMM DDR5-8800 natively. AMD EPYC Turin (9005) does NOT support MRDIMM — AMD is waiting for broader JEDEC standardization. AWS M8i uses **standard DDR5-7200 RDIMMs** (verified by chipsandcheese), not MCRDIMMs. The MRDIMM bandwidth story is bare-metal-only today.

### LPDDR5X

Low-Power DDR5, extension "X" = higher speed. Used in NVIDIA Grace CPU Superchip at ~500 GB/s per CPU in ~16 W — dramatically better energy-per-byte than DDR5 for memory subsystems. NVIDIA uses it; AWS Graviton5 uses standard DDR5 throughout (no LPDDR5X). Relevant because Grace's memory efficiency is part of why the GB200/GB300 architecture can justify NVLink-C2C: the Grace side is power-efficient enough that coherent access from the GPU is cheap.

### STREAM benchmark

Industry-standard memory bandwidth benchmark. Four tests: Copy (read + write), Scale (read + arithmetic + write), Add (two reads + write), Triad (two reads + multiply-add + write). Triad is the most commonly cited. Measures sustained bandwidth across the memory subsystem. Typical result: real-world STREAM Triad is 70-90% of theoretical peak DRAM bandwidth.

Panel-relevant measurements:
- AWS M8i (Xeon 6, DDR5-7200): **691.62 GB/s** STREAM Triad (chipsandcheese)
- 2P EPYC 9965 Turin Dense (DDR5-6400): 808-883 GB/s STREAM
- Xeon 6980P with MRDIMM DDR5-8800: ~906 GB/s estimated (1.31× DDR5-6400 multiplier)

---

## B. Chiplet and Interconnect Topology

### Chiplet

A small silicon die that performs part of the total functionality of a package. Modern server CPUs and GPUs are composed of multiple chiplets connected inside a single package rather than manufactured as one monolithic die. Enables using different process nodes for different dies (compute on advanced nodes, I/O on mature cheaper nodes), improves yield (smaller dies = fewer defects), and allows reuse of designs across product lines.

Chiplet examples from the research:
- AMD Turin: up to 16 Zen 5 CCDs on TSMC 4nm + 1 IO die on TSMC 6nm
- Intel Xeon 6 6900P: 3 compute tiles on Intel 3 + 2 I/O dies on Intel 7
- NVIDIA B200: 2 compute chiplets + 8 HBM stacks on a single interposer
- Graviton4: 7 chiplets (1 compute + 4 DDR + 2 PCIe) — all TSMC 4/5nm

### CCD (Core Complex Die)

AMD's compute chiplet. Contains 8 Zen 5 cores (Turin standard) or 16 Zen 5c cores (Turin Dense), their L1/L2/L3 cache, and one GMI link to the IO die. Multiple CCDs sit around a central IO die on the EPYC package.

### CCX (Core Complex)

A sub-unit of a CCD. Zen 5 CCD = 1 CCX of 8 cores. Zen 5c CCD = 1 CCX of 16 cores. All cores in a CCX share an L3 slice tightly coupled via a ring or small fabric. Cross-CCX access incurs a penalty (goes through the IO die).

### Compute tile / I/O tile (Intel)

Intel's chiplet terminology. A Xeon 6 6900P has 3 XCC compute tiles (Extreme Core Count, up to 44 Redwood Cove P-cores each, on Intel 3) and 2 I/O tiles (PCIe 5.0, UPI, CXL 2.0, accelerators, on Intel 7). The I/O tiles are the sole route to off-socket connectivity — a compute tile cannot talk to PCIe without going through an I/O tile.

### EMIB — Embedded Multi-die Interconnect Bridge

Intel's silicon bridge technology for connecting chiplets. A small piece of silicon embedded in the package substrate creates a high-density wire bridge between adjacent dies. Used in Xeon 6 to connect compute tiles and I/O tiles. Competes with TSMC CoWoS (used by NVIDIA and AMD for GPU/chiplet packaging).

### Infinity Fabric / GMI / xGMI (AMD)

AMD's interconnect family.
- **Infinity Fabric**: the overall protocol across CCDs and the IO die
- **GMI (Global Memory Interconnect)**: link between CCD and IO die. Turin uses GMI3-W (two GMI links per CCD, 64 bytes/cycle bidirectional per CCD)
- **xGMI**: inter-socket link in 2P systems. Turin offers 3 or 4 xGMI links × 16 lanes × 32 GT/s, delivering ~384 GB/s or ~512 GB/s between sockets

### UPI — UltraPath Interconnect (Intel)

Intel's inter-socket link. Xeon 6 6900P: up to 6 UPI 2.0 links at 24 GT/s per socket in 2-socket configurations. Successor to QPI.

### CMN-700 / CMN-S3 (Arm coherent mesh)

Arm's coherent mesh network — the interconnect fabric inside a Neoverse-based chip.
- **CMN-700** in Graviton4 (Neoverse V2): 2D mesh with crosspoints (XPs), maximum 12×12 grid (144 XPs, up to 256 cores). HN-F (Home Node Full) at each mesh stop handles coherency and L3/SLC access.
- **CMN-S3** in Graviton5 (Neoverse V3): successor, optimized for ARMv9.2, multichip configurations, CXL 2.0 devices. AWS claims 33% lower inter-core latency in Graviton5 vs Graviton4.

### MDF — Modular Data Fabric (Intel)

Mesh stops at Xeon 6 die edges that handle the logical mesh protocol across die boundaries. Run at 2.5 GHz. Physical signals cross the EMIB silicon bridge; MDF manages the protocol layer. Xeon 6 6985P-C has 80 MDF stops.

### CHA — Caching/Home Agent (Intel)

At each mesh stop in Xeon 6, a CHA node handles L3 cache slice access and snoop filter management. The 6985P-C has 120 CHA instances. Each CHA owns one L3 slice.

### NV-HBI — NVIDIA High Bandwidth Interface (Blackwell)

The chiplet-to-chiplet link on Blackwell B200/B300, connecting the two GB100 compute dies across the interposer. ~10 TB/s total bandwidth. Invisible to programmers — presents the dual-die chip as a single logical GPU.

### NVLink — NVIDIA's proprietary GPU-to-GPU and CPU-to-GPU link

- **NVLink 4** (Hopper, H100/H200): 900 GB/s bidirectional per GPU, 18 links × 25 GB/s each direction
- **NVLink 5** (Blackwell, B200/B300): 1.8 TB/s bidirectional per GPU, 18 links × 50 GB/s each direction
- **NVSwitch**: the switch chips that build a non-blocking fabric across multiple GPUs. HGX B200 uses 2 NVSwitch chips per baseboard. GB200 NVL72 uses 9 NVSwitch trays across 18 compute trays.
- **NVLink-C2C**: chip-to-chip link inside the Grace-Blackwell Superchip between Grace CPU and Blackwell GPU. 900 GB/s bidirectional (450 GB/s per direction), hardware-coherent, ~7× PCIe Gen 5 bandwidth.

### PCIe generations

| Generation | Per-lane BW (unidir) | x16 slot BW | Relevance |
|---|---|---|---|
| Gen4 | 2 GB/s | 32 GB/s | Graviton3, P5/P5e CPU-GPU link |
| Gen5 | 4 GB/s | 64 GB/s | Graviton4, Turin, Xeon 6, P5en/P6-B200/P6-B300 |
| Gen6 | 8 GB/s | 128 GB/s | Graviton5 (96 lanes = 768 GB/s unidir), B300 silicon-capable |

PCIe Gen6 on Graviton5 (768 GB/s unidirectional) actually exceeds Graviton5's own DDR5-7200 bandwidth (691 GB/s) — first AWS chip where the CPU-to-accelerator data path is not the bottleneck.

### SRD — Scalable Reliable Datagram (AWS EFA)

AWS's networking protocol used inside EFA (Elastic Fabric Adapter). Unlike TCP (single path) or InfiniBand (single fastest path), SRD uses multi-path routing across all available network paths simultaneously. Guarantees reliable delivery without guaranteed packet ordering. Delivers 15 μs HBM-to-HBM cross-server packet latency on Trn2 UltraServer (EFAv3) — a published number AWS customers can write into their latency budgets.

### Queuing between chiplet and memory (the chiplet-memory latency story)

Carlos's specific request: the hop-by-hop path from a compute core to DRAM on a chiplet-based CPU is not one number. It's a chain of queuing stages, and each stage adds latency and potential for contention.

**AMD Turin path** (simplified):
```
Zen 5 core → L1D → L2 → L3 (same CCX) → GMI3-W link → IO die →
  Memory controller (UMC) → DDR5 DRAM (open page | closed page miss)
```

Per-stage latency contribution:
- L1D miss → L2: ~14 cycles / ~3 ns
- L2 miss → L3: ~46 cycles / ~10 ns
- L3 miss → IO die (over GMI3-W): tens of nanoseconds depending on CCX-to-UMC hop
- IO die → DDR5 open row: ~40-60 ns
- IO die → DDR5 row miss: ~100+ ns (must close current row and open new row)
- Total: ~130-140 ns local NUMA (NPS1), ~260 ns inter-socket (2P)

**Intel Xeon 6 path**:
```
Redwood Cove core → L1D → L2 → local tile L3 (via mesh/CHA) →
  MDF stop (at die edge) → adjacent tile MDF → remote tile L3 (+24 ns) →
  Memory controller → DDR5 DRAM
```

Per-stage latency contribution:
- L1D miss → L2: ~14 cycles
- L2 miss → local tile L3: ~33 ns (~130 cycles)
- Cross-tile L3: +24 ns per die boundary, up to ~80 ns for two crossings
- DRAM local: ~131 ns
- DRAM cross-tile: ~157-181 ns (+26 ns per boundary)

**The queuing insight**: every hop in a chiplet path has a transaction queue. Under heavy traffic (many cores hammering memory), these queues fill and add variable delay. This is why **loaded latency** (under stress) can be 2-3× **unloaded latency** (single-thread benchmark). MRDIMM's "40% lower latency under load" claim is specifically about queue depth reduction at the memory controller, not about idle latency.

For the panel: noisy-neighbor jitter on a chiplet-based CPU comes largely from queue contention at these inter-chiplet and memory-controller stages. It is different in character from cache contention (which is local). NUMA-awareness, SNC3 mode on Xeon 6, and per-tile affinity on Graviton5 are all ways to bound queue depth at specific stages.

---

## C. Cache Hierarchy and Memory Types

### L1 / L2 / L3 cache

The standard on-die cache hierarchy.
- **L1**: per-core, split into instruction (L1I) and data (L1D). Smallest, fastest (~1 ns / 4 cycles). Typical sizes: 32-64 KB per type.
- **L2**: per-core or per-CCX. Medium (~3-14 ns / 11-16 cycles). Typical sizes: 1-2 MB.
- **L3**: shared across cores. Largest cache (~25-30 ns / 46-130 cycles). Sizes range from 36 MB (Graviton4 SLC) to 504 MB (Xeon 6 6980P).

Ratios in the hierarchy: each tier is roughly 10× larger and 3-10× slower than the tier above.

### SLC — System Level Cache

Arm's terminology for what x86 usually calls L3. In Graviton4 (CMN-700 mesh), the SLC is 36 MB across 96 cores — roughly 375 KB per core. The lean allocation is partly a snoop filter tax: ARM's CMN-700 specification requires snoop filter capacity ≥ 1.5× aggregate exclusive L2, eating mesh silicon budget.

Graviton5 switches from SLC to **distributed L3 of 192 MB** (5.3× Graviton4) because doubling core count to 192 makes a unified SLC unworkable. Distributed L3 slices reduce mesh contention.

### Register file

The per-SM (or per-core) storage for live instruction operands. 256 KB per SM on H100/H200/B200/B300 — 64K × 32-bit registers. On Blackwell, the accumulator role moves out of RF into TMEM, freeing RF capacity for epilogue operations and dramatically reducing register pressure for tensor code.

### SMEM — Shared Memory (NVIDIA)

Per-SM programmer-visible scratchpad. Up to 228 KB per SM on Hopper; 128 KB per SM on Blackwell SM100 base (reduced because TMEM is added). **No hardware eviction**: data placed in SMEM via `__shared__` or PTX declarations stays there until the thread block exits. Deterministic by design — the architectural reason GPU attention kernels can achieve bounded tail latency.

### TMEM — Tensor Memory (Blackwell SM100 only)

New memory tier on B200/B300. 256 KB per SM, organized as 2D array 512 cols × 128 lanes × 32-bit. Dedicated Tensor Core accumulator storage — separates accumulator data from register file and SMEM. Introduces the `tcgen05.mma` instruction (single-thread issue, no warp-group barrier). Read BW 16 TB/s per SM, write 8 TB/s, cache-miss latency 420 cycles (vs ~1000 cycles for Hopper global memory). Consumer Blackwell (RTX 5090 etc.) does NOT have TMEM.

### SBUF / PSUM (AWS Trainium)

NeuronCore's scratchpad memories — equivalent role to SMEM on GPU but entirely compiler-managed.
- **SBUF (State Buffer)**: per-core working memory. 24 MiB on NeuronCore-v2 (Trainium1, Inferentia2), 28 MiB on v3 (Trainium2), 32 MiB on v4 (Trainium3). 128 partitions. Accessible by all compute engines. ~20× HBM bandwidth.
- **PSUM (Partial Sum Buffer)**: per-core Tensor Engine accumulator. 2 MiB per NeuronCore, 128 partitions × 16 KiB.

No hardware cache exists on NeuronCore — no eviction, no prefetcher, no speculative behavior. Compiler places every tensor. This is the architectural foundation of Trainium's determinism story.

---

## D. NUMA and Memory Topology

### NUMA — Non-Uniform Memory Access

Any topology where access latency to memory depends on which compute unit is doing the access. On a multi-socket server, local-socket memory is fast, remote-socket memory is slow. On a chiplet-based single-socket server, local-tile memory may be faster than remote-tile memory even within one chip. Programs unaware of NUMA pay a jitter cost on every remote access.

### NPS — Nodes Per Socket (AMD)

AMD's NUMA mode configuration for EPYC.
- **NPS0**: monolithic, all 12 DDR5 channels striped as one domain. Worst latency (~220 ns), simplest for non-NUMA-aware apps.
- **NPS1** (default): one NUMA per socket, all 12 channels interleaved. ~130-140 ns local DRAM.
- **NPS2**: two NUMA per socket (per-hemisphere, 6 channels each).
- **NPS4**: four NUMA per socket (3 channels per quadrant). Best for HPC and NUMA-aware apps.
- **L3CAN**: scheduler locality hint per CCD, keeps NPS1 memory interleave but adds CCD-level scheduling preference.

### SNC — Sub-NUMA Clustering (Intel)

Intel's NUMA mode for chiplet Xeon. SNC3 on Xeon 6 6900P exposes three NUMA domains, one per compute tile. Each domain has ~160 MB L3 and 4 DDR5 channels. Local DRAM ~131 ns; crossing one die boundary adds ~26 ns, two crossings ~51 ns. The default mode for Xeon 6 6900P.

**HEX mode** (formerly SNC1): single NUMA domain per socket, all DRAM striped. Higher average latency but simpler for non-NUMA-aware apps.

### Snoop filter

Hardware structure that tracks which cores have cached copies of which lines. When a core writes to a line, the snoop filter says "cores X, Y, and Z have this line — invalidate their copies." Without a snoop filter, every write would require broadcasting to every core.

The snoop filter is a significant silicon cost. ARM's CMN-700 mesh requires snoop filter capacity ≥ 1.5× aggregate exclusive L2 — a notable tax on Graviton4 that partly explains its lean 36 MB L3.

---

## E. Compute and ML Architecture

### SM — Streaming Multiprocessor (NVIDIA)

NVIDIA's basic compute unit. Each SM contains its own register file, L1/SMEM, warp schedulers, CUDA cores, Tensor Cores, and (on Blackwell) TMEM. H100: 132 SMs. B200: 148 SMs. B300: 160 SMs.

### Warp / Warp Group / Thread Block / Thread Block Cluster / Grid

NVIDIA's parallelism hierarchy:
- **Thread**: one lane of 32-bit work
- **Warp**: 32 threads executing in lockstep. Unit of instruction dispatch.
- **Warp Group**: 4 warps = 128 threads. Hopper's wgmma MMA instruction scope.
- **Thread Block (CTA)**: up to 1024 threads. Unit of shared memory allocation.
- **Thread Block Cluster** (Hopper+): up to 8 (portable) / 16 (opt-in on H100/B200) CTAs co-scheduled on the same GPC. Share Distributed Shared Memory (DSMEM).
- **Grid**: all CTAs in a kernel launch.

### TPC — Texture/Processing Cluster

A group of 2 SMs in NVIDIA GPUs. Blackwell adds 2-SM cooperative MMA via `cta_group::2` — two SMs in a TPC cooperate on a single `tcgen05.mma` instruction.

### GPC — Graphics Processing Cluster

Larger grouping of TPCs with a shared scheduler. H100 SXM5 has 8 GPCs; B200 has 8 GPCs. Thread Block Clusters are guaranteed to co-schedule within one GPC.

### Tensor Core

NVIDIA's dedicated matrix-multiply units inside each SM. 4th-gen on Hopper (wgmma instruction, FP8 support). 5th-gen on Blackwell (tcgen05 instruction, FP4/FP6/FP8 support, TMEM-based accumulators).

### AMX — Advanced Matrix Extensions (Intel)

Intel's CPU-side matrix-multiply acceleration. 8 tile registers × 1 KB each = 8 KB per core. TMUL (Tile Matrix Multiply Unit) performs `TileC += TileA × TileB`. On Granite Rapids (Xeon 6): 2,048 INT8 ops/cycle/core, 1,024 BF16 ops/cycle/core, **1,024 FP16 ops/cycle/core (NEW in Granite Rapids)**. The FP16 support is what eliminates the quantization tax for FP16-trained GPU models running on CPU.

### TMA — Tensor Memory Accelerator (NVIDIA Hopper+)

Dedicated hardware unit per SM for asynchronous bulk data transfer between HBM and SMEM. Single thread issues a TMA descriptor (up to 5D tensor: source, dimensions, strides, tile shape, swizzle mode). Hardware engine executes the copy. Frees warps from address generation. Enables warp specialization (producer warps issue TMA, consumer warps compute). FlashAttention-3 uses TMA to reach 75-85% H100 utilization.

### SVE2 / NEON / AVX-512

Vector ISA extensions:
- **NEON**: Arm's 128-bit SIMD.
- **SVE2**: Arm's vector-length-agnostic successor. Graviton3: 2 × 256-bit SVE. Graviton4 (Neoverse V2): 4 × 128-bit SVE2 — same total throughput but different pipe structure. Graviton5 (Neoverse V3): [LIKELY] same 4 × 128-bit.
- **AVX-512**: Intel's / AMD's 512-bit SIMD. Zen 4 executes 512-bit ops as two 256-bit ops (double-pumped). Zen 5 Turin runs them natively in one clock — doubling throughput. Intel Xeon 6 has 2 × 512-bit FMA units per core, plus AVX-512 FP16.

### SME / SME2 — Scalable Matrix Extension (Arm)

Arm's dedicated matrix-multiply engine, analogous to Intel AMX. Introduced in ARMv9.2-A. Potentially in Neoverse V3 (Graviton5) — ARM has not explicitly confirmed in CSS V3 documentation, and AWS has not confirmed in Graviton5 announcements. The single biggest open question about Graviton5 compute capability.

---

## F. Precision Formats

### IEEE and non-IEEE float formats

- **FP64**: double precision, 64 bits. 1 sign + 11 exponent + 52 mantissa. HPC default.
- **FP32**: single precision, 32 bits. 1 + 8 + 23.
- **TF32**: NVIDIA's 19-bit format inside Tensor Cores. 1 + 8 + 10. Transparent to FP32 APIs on Tensor Cores.
- **BF16**: brain float, 16 bits. 1 + 8 + 7. Same exponent range as FP32 → drop-in for FP32 weights at half size.
- **FP16**: IEEE half, 16 bits. 1 + 5 + 10. Narrower exponent range than BF16.
- **FP8**: 8 bits. Two flavors: E4M3 (4 exponent, 3 mantissa) for forward pass; E5M2 (5 exponent, 2 mantissa) for gradients. Native in Hopper+ Tensor Cores.
- **FP6**: 6 bits. Blackwell Tensor Cores support.
- **FP4 / NVFP4**: 4 bits. E2M1 format (1 sign + 2 exponent + 1 mantissa). NVIDIA-specific two-level scaling (micro-block E4M3 scale per 16 values + FP32 tensor-level scale). ~1.8× memory reduction vs FP8. ≤1% accuracy degradation on language modeling (DeepSeek-R1).

### MXFP4 / MXFP8 — Microscaling formats

Community / OCP standard. Block size 32, E8M0 scale factor. Coarser than NVFP4 (block size 16, E4M3 scale) but more portable. MLCommons-favored.

### INT8 / INT4

Integer precisions. INT8 widely supported for inference quantization (bytes per weight = 1). INT4 standard for aggressive quantization (bytes per weight = 0.5). Accuracy trade-off vs FP8/FP4 depends on quantization scheme (AWQ, GPTQ, SmoothQuant).

---

## G. LLM Inference Terms

### KV cache

The cached keys and values from earlier tokens in a transformer's attention. Grows linearly with context length and batch size. For a 70B model at 8192 context, KV cache is ~6.7 GB per sequence. At 128k context, it grows to the point where KV cache >> L2 cache. Memory dominates the decode phase.

### Prefill vs decode

Two phases of LLM inference.
- **Prefill**: process an input prompt of T tokens in parallel. GEMM operation, arithmetic intensity ∝ T/2. Compute-bound for T > ~480 on H100.
- **Decode**: generate one output token at a time. GeMV operation, arithmetic intensity ~1 FLOP/byte. **Always memory-bandwidth-bound at batch=1 on every current GPU or CPU.**

### Arithmetic intensity / roofline / ridge point

The ratio of FLOPs performed to bytes moved from memory. Determines whether a workload is compute-bound or memory-bound.
- **Roofline model**: plots achievable performance vs arithmetic intensity. Below the ridge point: memory-bound. Above: compute-bound.
- **Ridge point**: peak FLOP/s ÷ peak memory bandwidth. H100 BF16 dense: ~295 FLOPs/byte. Graviton4 BF16: 32 FLOPs/byte. LLM decode AI is 0.5-2 FLOPs/byte — far below every chip's ridge point.

### GQA / MQA / MHA — Grouped Query / Multi-Query / Multi-Head Attention

Attention architecture variants.
- **MHA**: H query heads, H K heads, H V heads. Full attention. Largest KV cache.
- **GQA**: H query heads, G K heads, G V heads (G < H). KV cache reduced by H/G. Used in Llama 3, Mistral.
- **MQA**: H query heads, 1 K head, 1 V head. Maximum KV cache reduction. Used in Llama 2 70B original and some smaller models.

### PagedAttention

vLLM's KV cache management: logical KV blocks mapped to physical memory via a block allocator (analogous to OS virtual memory). Eliminates KV cache fragmentation — the source of 60-80% KV memory waste in pre-PagedAttention serving systems.

### FlashAttention-3

Tri Dao et al.'s attention kernel optimized for H100. Uses TMA + warp specialization + ping-pong scheduling to reach 75-85% H100 utilization vs ~35% for FlashAttention-2. Reduces HBM traffic (not compute) by keeping attention tiles in SMEM throughout.

### Operator fusion

Compiler optimization that merges multiple sequential operators (e.g., matmul + bias + softmax + dropout) into one kernel. Eliminates intermediate HBM writes/reads. Critical for memory-bound inference because every saved HBM round-trip is cheaper than every added FLOP.

### Quantization

Reducing the numerical precision of model weights or activations. FP32 → BF16 → FP8 → FP4 each halves bytes per parameter. In a memory-bound regime, quantization is a bandwidth optimization — not primarily a compute optimization. Halving bytes per parameter halves HBM traffic per decode step, which halves decode time.

Common quantization schemes: AWQ (activation-aware weight quant), GPTQ (gradient-based), SmoothQuant (activation smoothing), NVFP4 (NVIDIA's two-level FP4).

### Speculative decoding

Technique: a small "draft" model proposes N tokens quickly; a larger "verifier" model checks them in parallel and accepts/rejects. Increases effective tokens-per-second beyond the memory-bandwidth floor when the draft accuracy is high. EAGLE-3 reports up to 6.5× speedup.

**PARD + PACE**: AMD's speculative decoding implementation on EPYC Turin. Reported 380 tokens/sec on 2P EPYC 9755 for Llama 3 70B.

---

## H. Communication Libraries and Disaggregation

### NCCL — NVIDIA Collective Communications Library

The standard collective communications library for NVIDIA GPUs. Implements AllReduce, AllGather, ReduceScatter, All-to-All, Broadcast, Reduce. **Runs on CUDA SMs** — during tensor-parallel inference, NCCL's AllReduce consumes the same SMs that perform tensor ops, creating contention.

### NIXL — NVIDIA Inference Xfer Library

NVIDIA's newer point-to-point transfer library specifically for inference. Does NOT consume SMs — uses GPU-Direct RDMA engines. Supports multiple transports: InfiniBand, EFA (via libfabric), NVLink. **Available on AWS via EFA since March 2026.** Intelligently selects NVLink (intra-node) vs EFA (inter-node) for KV cache transfer. Integrated with Dynamo, SGLang, vLLM, TensorRT-LLM.

### CC-Cores — Collective Communication Cores (AWS Trainium)

Dedicated silicon on Trainium2 and Trainium3 for collective operations. 16 CC-Cores per chip. Run independently of tensor compute engines — tensor engines never wait for AllReduce. Contrast: NCCL on GPU stalls tensor cores during collectives.

### NEFF — Neuron Executable File Format

The binary artifact produced by the Neuron compiler (neuronx-cc). Contains compiled device instructions, model parameters, and execution metadata. Generated once, before deployment, ahead-of-time (AOT). Runtime does not JIT-recompile. Same NEFF = bitwise-identical execution. This is the foundation of Trainium's determinism property.

### Disaggregated serving

Inference architecture where prefill and decode run on separate node pools. Prefill is compute-bound (uses GPUs with high FLOP/s density). Decode is memory-bound (uses GPUs with high HBM bandwidth per dollar). KV cache transfers between prefill and decode nodes via RDMA (NIXL over EFA on AWS, NVLink or InfiniBand elsewhere). DistServe (OSDI 2024), Splitwise (ISCA 2024), Mooncake (Moonshot AI production) are prominent implementations.

---

## I. Isolation and Determinism

### MIG — Multi-Instance GPU (NVIDIA)

Hardware partitioning of an A100/H100/H200/B200/B300 into up to 7 independent GPU instances. Each instance gets dedicated SMs, L2 slice, HBM capacity, HBM bandwidth, copy engines. **No SM or memory sharing across instances** — hardware partition at register level. Each instance = separate CUDA device with its own PCI function.

### TEE / TEE-I/O — Trusted Execution Environment

Hardware-backed isolation + attestation for sensitive workloads. Encrypted memory, secure boot, remote attestation of code + state. Blackwell extends TEE to MIG instances via TEE-I/O and encrypted NVLink.

### Isabelle/HOL

An interactive theorem prover for higher-order logic. Used to prove properties of software and hardware formally — not by testing but by mathematical proof. Used to verify the seL4 microkernel and AWS's Nitro Isolation Engine. Proofs are machine-checkable, customer-inspectable, and bug-resistant within the covered interface.

### Formal verification

Proving mathematically that a program satisfies stated properties, for all possible executions — rather than testing it on some executions. Significant industrial uses: seL4 microkernel, compiler correctness (CompCert), cryptographic algorithms, and now NIE (Nitro Isolation Engine).

### seL4

The formally verified microkernel used as the reference point for provably-correct systems software. 10,000 lines of C code, proven correct in Isabelle/HOL. Used in defence systems, aerospace, medical devices. NIE is the first commercial cloud hypervisor built with seL4-class formal verification methods.

### AOT vs JIT compilation

- **AOT (Ahead-of-Time)**: code compiled before deployment. Output is a binary. Execution is deterministic — no runtime recompilation possible. Trainium's NEFF is AOT.
- **JIT (Just-in-Time)**: code compiled during execution, often triggered by shape changes or hot-path detection. Enables dynamic optimization but introduces latency spikes at compilation time. PyTorch eager mode + some GPU paths use JIT.

For capital markets: AOT is the determinism-preserving choice. JIT can cause unpredictable tail-latency excursions the first time a new shape appears.

### CUDA Graphs

NVIDIA API that captures a sequence of kernel launches and memory operations as a graph, replayed with a single CPU call. Eliminates per-kernel CPU launch overhead (5-20 µs per kernel). For decode at batch=1 with dozens of kernels per token, this is a large tail-latency reduction.

### CCCL 3.1 determinism modes (CUDA 13.1)

Three levels of FP determinism in `cub::DeviceReduce`:
- **not_guaranteed**: atomic reduction, fastest, non-reproducible
- **run_to_run**: hierarchical tree, same GPU + same config = same bits
- **gpu_to_gpu**: Reproducible Floating-point Accumulator (RFA) via exponent-bin grouping — bitwise identical across different GPU models. 20-30% performance cost

The `gpu_to_gpu` mode is the first NVIDIA-native path to audit-trail reproducibility across hardware upgrades (H100 pools → B200 pools).

### Nitro Isolation Engine (NIE)

AWS's formally-verified Rust module sitting beneath the Nitro Hypervisor on Graviton5. Isabelle/HOL proof, ~250,000 lines of proof script. Ships with M9g preview (Dec 2025). First formally verified cloud hypervisor at major-cloud scale.

---

## J. Capital Markets / HFT Vocabulary

### Jitter

Variance in latency. If mean latency is 5 ms but individual responses range from 3 ms to 20 ms, there is high jitter. For trading systems, jitter matters more than mean because the slowest responses determine trade outcomes (missed fills, stale quotes).

### Tail latency / p99 / p99.9 / p99.99

Percentile latencies. p99 = 99th percentile = 1% of responses are slower. p99.9 = 0.1% slower. p99.99 = 0.01% slower. Capital markets systems typically target p99.9 or p99.99 SLAs because those are the responses that lose money. A system with 100 μs mean latency and 50 ms p99.99 loses at 0.01% of requests — which in HFT might be hundreds of requests per day.

### Noisy neighbor

A tenant on shared infrastructure whose activity degrades other tenants' performance. On a shared GPU without MIG, one tenant's heavy HBM traffic can starve another's memory bandwidth. On a shared CPU, one tenant can pollute L3 cache or saturate memory controllers. MIG, NIE, Trainium's NEFF, and NUMA pinning are all noisy-neighbor defences.

### Tick-to-trade

The latency from receiving a market data tick to sending an order. The ultimate HFT metric. Sub-microsecond tick-to-trade pipelines exist; anything above 10 μs is considered slow for competitive HFT. Inference-in-trading adds latency to this path — which is why inference-at-edge (on the same machine as the matching engine) and inference-in-cache (working set fits in L1/L2/L3) matter disproportionately.

### Colocation (colo)

Hosting trading systems in the same physical data center as the exchange's matching engines, typically in cross-connect distance (single-digit microseconds round-trip). Capital markets firms pay premium for colo racks. Power density and cooling constraints on colo racks affect which silicon is actually deployable — e.g., GB200 NVL72 rack at 120-140 kW requires custom power delivery that most colo facilities cannot provide.

---

## K. AWS-Specific Vocabulary

### EC2 instance family prefixes

- **M**: general purpose (balanced compute/memory)
- **C**: compute-optimized
- **R**: memory-optimized (more memory per vCPU)
- **X**: memory-heavy (e.g., X8g, X8i — up to 6 TB DDR5)
- **I**: storage-optimized (local NVMe)
- **P**: accelerated (NVIDIA GPU)
- **Trn**: Trainium accelerators
- **Inf**: Inferentia accelerators
- **G**: mid-range graphics/AI GPU (G4, G5, G6)

Suffix indicates generation: M8g = 8th-gen generic on Graviton, M8a = on AMD, M8i = on Intel, M9g = 9th-gen on Graviton5 preview. `n` suffix = network-optimized (C8gn 600 Gbps). `d` = with local NVMe. `z` = high-frequency (M8azn at 5.0 GHz).

### Nitro Cards

AWS's offload accelerator cards that run virtualization, networking (EFA), storage (EBS) functions independently of the host CPU. Current gen: Nitro v6 on M8i, M9g, etc. Older gens: v3 (EFAv1), v4 (EFAv2), v5 (EFAv3).

### EFA generations

| EFA | Nitro | Per-Card BW | Representative instances |
|---|---|---|---|
| v1 | v3 | 100 Gbps | C5n, P3dn, P4d |
| v2 | v4 | 200 Gbps | Trn1, P5, P5e |
| v3 | v5 | [per-card not public] | P5en, Trn2 |
| v4 | v5+ | 400 Gbps/GPU (P6-B200), 800 Gbps/GPU (P6-B300) | P6-B200, P6-B300, P6e UltraServers |

### Capacity Blocks for ML

AWS reservation model for GPU and Trainium instances. Reserve specific duration (1-182 days) up to 8 weeks in advance. Charged fully upfront at purchase-time rate. No refund. No cancellation. Target workloads: short training runs, guaranteed capacity for regulatory stress tests. January 2026 price hike: 15%.

### UltraServer

AWS product class for multi-node NVLink-connected instances. P6e-GB200 UltraServer: 72 Blackwell GPUs in single NVLink domain, 13.3 TB HBM, 130 TB/s NVLink. Trn2 UltraServer: 64 Trainium2 chips in 3D Torus. Purchase: Capacity Blocks only.

### Bedrock / SageMaker / HyperPod

AWS managed AI services.
- **Bedrock**: fully managed foundation model API. Underlying GPU silicon not disclosed.
- **SageMaker**: managed ML platform with training, inference, HyperPod for large-scale training.
- **HyperPod**: managed clusters optimized for large-scale training. Supports P6e-GB200 UltraServers with automatic fault recovery within the NVLink domain.

---

## L. Vendor-Specific Products (Panel-Adjacent)

### Cerebras

- **WSE (Wafer Scale Engine)**: single-wafer compute chip. WSE-3 (CS-3 system): 4 trillion transistors, 44 GB on-die SRAM, 21 PB/s on-die bandwidth, 900,000 cores.
- **CS-3**: 15U rack system containing one WSE-3 plus networking. 23 kW power. Liquid-cooled.
- **MemoryX**: external DDR5 + Flash appliance for weight storage on large models (200B to 120T parameters). Streams weights to the WSE per-layer.
- **SwarmX**: multi-node cluster fabric. Tree topology. Broadcasts weights from MemoryX; aggregates gradients on backward pass.

### Groq

- **LPU (Language Processing Unit)**: 230 MB on-chip SRAM, no external DRAM, 80 TB/s on-die bandwidth, statically scheduled VLIW execution, deterministic by construction. Scaling: GroqRack (72 chips, ~14 GB global SRAM). NVIDIA's $20B licensing deal (Dec 2025) integrates Groq IP into future NVIDIA products.

### SambaNova

- **SN40L**: three-tier memory architecture (520 MB on-chip SRAM, 64 GB HBM3, 1.5 TB DDR5 per socket). Reconfigurable Dataflow Unit (RDU) architecture — compute pattern-matched to workload at compile time.

### HyperCIM

- **LPU (HyperCIM's, distinct from Groq's)**: compute-in-memory chip. London startup, Dr. Tanya Mangoma CEO. Claims 14.8 TB/s throughput, sub-10 ns deterministic latency. Target markets: KDB+, FIX, Kafka, SQL — ETL preprocessing for finance. No published independent benchmarks or tape-out confirmation.

### Samsung HBM-PIM (Aquabolt-XL)

Processing-in-memory integrated into HBM2 stacks. Each bank has a Programmable Computing Unit (16 FP16 SIMD per bank). 4.92 TB/s internal bandwidth, 1.23 TB/s external. 8.9× GEMV speedup. Drop-in replacement for HBM2.

### SK hynix AiM / AiMX

GDDR6-based PIM. 1 TFLOPS MAC per chip. AiMX card: PCIe accelerator with 32 GB GDDR6-AiM. 16× CPU speedup on memory-bound workloads, 80% power reduction.

### UPMEM

DDR4-based PIM. DDR4 DIMM form factor with 128 DPU cores per rank. Each DPU: 400 MHz 32-bit RISC, 64 MB MRAM (DRAM bank), 64 KB WRAM (scratchpad). No floating-point hardware. Research-scale production.

### Mythic AMP

Analog compute-in-memory for edge inference. Flash cells act as analog multipliers (V × G). 108 AMP tiles per M1108 chip. 35 TOPS at ~4W. Edge-only; no data center product.

---

## M. Computing Concepts

### Von Neumann architecture / bottleneck

The classical computer architecture: a single memory stores both instructions and data, connected to a processor by a shared bus. The "bottleneck" is that every operation requires fetching instruction + data across the bus — memory bandwidth limits compute throughput regardless of processor speed.

The panel's central tension: PIM/CIM attempts to bypass the Von Neumann bottleneck by moving compute into memory. Cerebras wafer-scale SRAM is another escape path (compute sits adjacent to all memory on a single die). HBM is intermediate (close but still off-die). DDR5 is classical Von Neumann. CXL is further from compute than DDR5 (more Von Neumann) but with capacity advantages.

### Roofline model

Analytical tool for categorizing workloads. X-axis: arithmetic intensity (FLOP/byte). Y-axis: achievable performance (FLOP/s). Diagonal ridge rises with memory bandwidth. Horizontal ceiling is peak compute. Any workload below the ridge is memory-bound; above it, compute-bound.

---

## N. Less Common Terms

### Ridge point

The AI (arithmetic intensity) at which roofline's diagonal ridge meets the horizontal compute ceiling. Below ridge = memory-bound; above = compute-bound. H100 BF16 dense ridge ~295 FLOPs/byte.

### STREAM Triad

Two reads + multiply-add + write. The standard memory bandwidth benchmark kernel. Equivalent to `a[i] = b[i] + scalar * c[i]`.

### Pseudo-channel (HBM)

Half-width sub-channel within an HBM channel. Each HBM channel has 2 pseudo-channels of 32 bits each. Semi-independent operation: shared command bus, independent data execution. Burst length 8 beats = 32-byte minimum access.

### Reproducible Floating-point Accumulator (RFA)

Technique for bitwise-deterministic floating-point reductions across different hardware. Groups values by exponent bin before summing, eliminating order-dependence. Basis for CCCL 3.1 `gpu_to_gpu` determinism mode.

### Processing-near-memory (PNM) vs Processing-in-memory (PIM)

Often used interchangeably but technically distinct.
- **PNM / near-memory compute**: compute units physically close to memory but still separate circuits. Samsung HBM-PIM (PCU adjacent to DRAM banks), UPMEM (DPUs adjacent to DRAM on DIMM), HBM logic base die (bottom layer of HBM stack). This is what most commercial "PIM" products actually do.
- **True PIM / compute-in-memory (CIM)**: compute using memory cell physics directly — bit lines, Ohm's law summation in analog. Mythic AMP, memristor crossbars. Data never moves; compute happens where data sits.

The industry conflates these. Be precise on the panel.

---

Appendix: sources for the panel-specific terms are in the individual tracks (TRACK_3a through TRACK_3e, DEEP_DIVE_isolation_determinism.md, ABSTRACT.md). Every quantitative claim in this glossary appears in at least one track with an inline URL citation.
