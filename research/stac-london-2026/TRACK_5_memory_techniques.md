# Track 5 — Memory Techniques, KV Cache, and Megatrends

**STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"**
**Track:** Cross-cutting memory techniques and megatrend synthesis
**Audience:** Capital markets tech leads — tail latency, jitter, determinism, power envelope
**Researched:** 2026-04-21

---

## 1. The Memory-Wall Thesis (Evidence)

### 1.1 Roofline Model Ridge Points

The roofline ridge point (compute ceiling ÷ memory bandwidth) marks the arithmetic intensity at which a workload transitions from memory-bound to compute-bound. Any workload with lower AI is memory-bandwidth-bound.

- **H100 SXM:** 1,979 TFLOPS FP16 (w/sparsity) ÷ 3.35 TB/s HBM3 = **ridge point ~298 FLOPs/byte**
- **TPU v5e:** 1.97×10¹⁴ FLOPs/s ÷ 8.20×10¹¹ bytes/s = **ridge point 240 FLOPs/byte**

### 1.2 FLOPs vs Bandwidth Growth

| GPU | HBM | BW | FP16 Compute | Ridge Point |
|-----|-----|-----|--------------|-------------|
| A100 SXM | HBM2e | 2.0 TB/s | 312 TFLOPS | ~156 FLOPs/byte |
| H100 SXM | HBM3 | 3.35 TB/s | 1,979 TFLOPS (sparse) | ~298 FLOPs/byte |
| H200 SXM | HBM3e | 4.89 TB/s | 241 TFLOPS dense | ~49 FLOPs/byte |
| B300 (Blackwell Ultra) | HBM3e | 8.0 TB/s | 15 PFLOPS FP4 | — |
| Vera Rubin (2026) | HBM4 | 13 TB/s | 3.6 EFLOPS FP4 (rack) | — |

**Key megatrend:** FP4 compute on Blackwell is 2× FP8 throughput; HBM bandwidth H100→B300 grows only 2.4×. Compute-to-bandwidth ratio keeps widening. New silicon is compute-richer relative to bandwidth, making more workloads memory-bandwidth-bound at roofline level.

### 1.3 Decode Is Always Memory-Bandwidth-Bound

**Prefill phase** processes T tokens in parallel. Attention is matrix-matrix with AI ∝ T/2. For T > ~480 tokens on H100, prefill is **compute-bound** (behaves like training).

**Decode phase** generates one token at a time. Each step: load all model weights (tens to hundreds of GB), read entire KV cache, perform tiny matrix-vector multiply. **AI ≈ 1 FLOPs/byte** — far below any modern GPU ridge point. Decode is **always memory-bandwidth-bound regardless of GPU generation**.

From the JAX Scaling Book: "During decode with T=1, the arithmetic intensity approximates to 1, making it basically always memory bandwidth-bound. We cannot do anything to improve the arithmetic intensity of attention during generation."

Critical batch size below which model is memory-bandwidth-bound (Bcrit): approximately **280 tokens for H100 in BF16**. Formula: Bcrit = (bits_per_param / bits_per_activation) × (FLOPs/s ÷ bandwidth). With INT8 params and BF16 activations, Bcrit drops to 120.

Recent arXiv confirms: "memory bandwidth acts as a performance ceiling" during decode. Increasing operating frequency has no benefit once memory-bandwidth-bound (arXiv:2512.22066).

### 1.4 Amdahl's Law Applied to KV Cache

Single sequence LLaMA-2 13B at 8,192 context length KV cache: 2 × 2 bytes × 40 heads × 128 head_dim × 40 layers × 8192 = **6.7 GB per sequence**. Four concurrent sequences exceed the 26 GB parameter footprint.

Theoretical minimum step time during decode: (Batch × KV_Cache_Size + Parameter_Size) / Total_Memory_Bandwidth. Dominated by KV cache reads at large batch sizes.

**Panel takeaway:** Reduce KV cache 5× via GQA/quantization/compression → theoretical minimum step time drops from ~4.98 ms to ~4.17 ms at bs=1, and from infeasible to 17.04 ms at bs=64 on TPU v5e 8× slice → 4,529 t/s theoretical. **KV cache is the primary decode performance variable, not compute.**

---

## 2. KV Cache: The Central Memory Problem

### 2.1 PagedAttention (vLLM) — SOSP 2023

Kwon et al., arXiv:2309.06180. Prior to PagedAttention, LLM serving wasted **60–80%** of KV cache memory through fragmentation and pre-allocation. vLLM reduces waste to **under 4%**.

Mechanism: OS virtual memory analogy. KV cache divided into fixed-size blocks (pages). Block table maps logical to non-contiguous physical pages. Copy-on-write for beam search. vLLM improves serving throughput **2–4×** at same latency vs FasterTransformer and Orca. Adopted into TensorRT-LLM and HuggingFace TGI.

**Why this matters for capital markets:** The pre-allocation waste that kills throughput also creates latency spikes when eviction occurs. PagedAttention's block allocator eliminates GC-like pauses of pre-allocated pools.

### 2.2 FlashAttention Family

**FlashAttention (arXiv:2205.14135, 2022):** Standard attention materializes N×N matrix in HBM (slow), reads back for softmax, again for output. FlashAttention uses **tiling** — blocks of Q, K, V in on-chip SRAM (A100: 192 KB/SM at ~19 TB/s vs 2 TB/s HBM). Never materializes full attention matrix in HBM. Achieves **10–20× memory savings** (linear vs quadratic) and **2–4× wall-clock speedup**.

**FlashAttention-2:** Only 35% H100 utilization because it doesn't exploit Hopper asynchronous capabilities.

**FlashAttention-3 (arXiv:2407.08608, 2024):** Three techniques for H100: (1) warp-specialization overlapping TMA data movement with Tensor Core compute, (2) interleaved block-wise matmul and softmax, (3) FP8 block quantization with incoherent processing. Results: **FP16 740 TFLOPs/s (75% utilization)**, FP8 close to **1.2 PFLOPs/s**. **1.5–2× speedup over FlashAttention-2**.

**Critical insight:** FlashAttention is NOT a compute optimization. It performs the same mathematical operations. The speedup is entirely from **reducing HBM reads and writes** — memory bandwidth savings are the value. Directly validates the memory-wall thesis.

### 2.3 KV Cache Quantization

**KIVI (arXiv:2402.02750, ICML 2024):** Asymmetric 2-bit KV cache — keys quantized per-channel (outliers concentrate in specific channels), values per-token. Tuning-free. Near-identical quality with **2.6× less peak memory**, **4× larger batches**, **2.35–3.47× throughput**.

**KVQuant (arXiv:2401.18079, NeurIPS 2024):** **<0.1 perplexity degradation at 3-bit** on LLaMA/Llama-2/3/Mistral. 2-bit variant enables **1M token context on single A100, 10M token on 8-GPU**. Per-channel key quant, pre-RoPE key quant, non-uniform datatypes per layer, per-vector dense-and-sparse for outliers, Q-Norm. Custom CUDA kernels: ~1.7× speedup over FP16. 14% better accuracy than KIVI at similar bit-width.

**vLLM production FP8 KV cache:** Supported (E4M3 and E5M2) on CUDA 11.8+ and ROCm; FP8 compute requires compute capability >8.9 (Ada/Hopper). Per-attention-head quantization via Flash Attention backend. INT8 KV cache not yet supported (open issue #33480). Current FP8 provides memory savings (~50% vs FP16) but not yet fused dequantization — latency improvement in future release.

### 2.4 KV Cache Compression Beyond Quantization

**H2O — Heavy Hitter Oracle (arXiv:2306.14048, NeurIPS 2023):** Small subset of "Heavy Hitter" tokens contributes most attention value. Retains **20% of KV cache** (recent + Heavy Hitters). Improves throughput over DeepSpeed Zero-Inference and HuggingFace Accelerate by **up to 29×**, over FlexGen by **3×**. Latency reduction **1.9×**.

**StreamingLLM:** Retains initial "attention sink" tokens (disproportionately important — high attention even from future tokens) plus rolling window. Enables LLMs trained with finite context to generalize to **up to 4 million tokens** without fine-tuning.

### 2.5 GQA and MQA — Architectural KV Cache Reduction

**GQA paper (arXiv:2305.13245, EMNLP 2023):** MHA stores H KV heads. MQA uses 1 shared KV head (reduces KV cache factor H). GQA uses G groups (reduces factor H/G).

For 32 query heads + 8 KV groups (GQA-8): **KV cache reduced 4×** vs MHA while maintaining near-full quality. MQA reduces 32× but shows instability.

**Uptraining cost:** Convert existing MHA → GQA with **only 5% of original pretraining compute**. Llama-2, Llama-3, Mistral 7B, Qwen2 all adopted GQA.

**Quantitative impact:** Reducing KV cache 5× via GQA on TPU v5e 8× slice improves theoretical throughput from 200 t/s to **4,529 t/s** for LLaMA-13B — 22× improvement driven entirely by memory bandwidth released by smaller KV cache.

### 2.6 Speculative Decoding — EAGLE-3

**arXiv:2503.01840 (NeurIPS 2025):** Small "draft" model generates candidate tokens; larger "verifier" accepts/rejects in parallel. EAGLE-3 abandons feature prediction for **direct token prediction** with multi-layer feature fusion.

Speedup **up to 6.5×**, ~1.4× improvement over EAGLE-2. SGLang at bs=64: **1.38× throughput**. At bs=4: **2.3× speedup**.

**Speculative decoding benefit highest at small-to-medium batch (1–16)** — exactly the capital markets regime. At large batches (32+), target model GPU utilization already high and draft overhead erodes gain.

**Memory insight:** Amplifies decode throughput without increasing HBM traffic proportionally — draft tokens verified in a single forward pass of the large model.

---

## 3. Quantization as Memory Optimization

### 3.1 Core Insight

Industry framing of quantization as "losing precision to save compute" is backwards. Primary benefit is **reducing bytes transferred per inference step**, not reducing FLOPs. During memory-bandwidth-bound decode, halving bit-width halves bytes loaded from HBM per weight = directly halves memory wait time. Compute savings secondary.

From LLM Inference Roofline Survey: "For Transformer models whose decoding phase is memory bandwidth bound, arithmetic intensity is mostly improved by reducing both the number and size of data transfers via operation fusion and data (weight matrices, KV cache) quantization."

### 3.2 Weight Quantization

**AWQ (arXiv:2306.00978, MLSys 2024 Best Paper):** Protecting 1% salient weights (high-magnitude activation channels) greatly reduces quantization error. Per-channel scaling protects those weights before INT4 quantization. **>3× speedup over HuggingFace FP16** on desktop/mobile GPUs. Enables 70B Llama-2 on mobile GPUs. Integrated into TensorRT-LLM, AMD, Vertex AI, SageMaker, HuggingFace Transformers, vLLM, LMDeploy.

**SmoothQuant (arXiv:2211.10438, ICML 2023):** W8A8 INT8 by "smoothing" outlier-prone activation distributions — migrating quantization difficulty from activations to weights via per-channel scaling. Integrated into TensorRT-LLM, SageMaker, ONNX Runtime.

### 3.3 FP8 on Hopper, FP4 on Blackwell

FP8 (E4M3 and E5M2) native in Ada Lovelace / Hopper. FP8 with calibrated scales shows minimal perplexity degradation vs FP16. On H100 with FP8 and bs=16, TensorRT-LLM: **2.3× latency speedup vs FP16** when TTFT constrained to <500ms. Peak throughput: **>10,000 output t/s**.

NVIDIA recommended quantization priority: FP8 for Hopper/Blackwell → INT8 SmoothQuant for Ada → INT4 AWQ/GPTQ for max compression in memory-constrained scenarios.

### 3.4 MXFP8/MXFP4 — OCP Microscaling

OCP MX spec defines block-floating-point: groups of 32 elements share single E8M0 scale exponent. Formats: MXFP8 (E5M2, E4M3), MXFP6 (E3M2, E2M3), MXFP4 (E2M1), MXINT8.

NVIDIA Blackwell Tensor Cores: **native hardware support for MXFP4, MXFP6, MXFP8**. MXFP4 raw throughput is **double** MXFP8 — hardware path computes 2× elements per cycle. LLMs can be trained with MXFP4 weights + MXFP6 activations/gradients with minor loss penalty. DeepSeek R1 in FP4 is an early production example.

MX+ and AMXFP4 extensions address outlier-induced error in vanilla E2M1, achieving near-MXFP8 quality at **4.25 bits/element**.

**Panel synthesis:** FP4 → FP8 → BF16 is becoming the standard inference stack. FP4 MXFP4 on Blackwell for max throughput; FP8 on Hopper/Blackwell for general serving; BF16 for precision-critical. Each level = 2× bandwidth reduction = 2× decode throughput in memory-bandwidth-bound regime.

---

## 4. Compute-Hiding via Buffers

### 4.1 The Problem

In memory-bandwidth-bound decode, GPU tensor cores are idle waiting for weights and KV cache to stream from HBM. Time-waiting-for-memory to time-computing can exceed **10:1** at small batches. Engineering challenge: keep FLOPs busy during memory transfers.

### 4.2 TMA on Hopper

TMA (Tensor Memory Accelerator): dedicated hardware unit per SM for asynchronous bulk data transfer between HBM and SMEM. Single thread invokes; transfer proceeds independently of warp execution. Decouples data movement from compute for true overlap.

TMA advantages over prior cp_async: handles address/stride computation in hardware via descriptor, register-efficient, handles out-of-bounds predication, enables warp-specialized schedules where producer warps issue TMA loads while consumer warps execute MMA.

### 4.3 Ping-Pong / Double-Buffering GEMM

CUTLASS Ping-Pong GEMM (CUTLASS 3.x): producer warps TMA-load SMEM buffer A while consumer warps MMA on SMEM buffer B. When consumers finish B, buffers swap — consumers begin on freshly filled A while producers refill B. Eliminates stalls at cost of 2× SMEM.

Hopper tensor core throughput so high that earlier-generation latency-hiding (multiple thread blocks per SM) no longer sufficient. Deeper pipelines with persistent blocks across tiles required.

Blackwell introduces **Tensor Memory (TMEM)** — new hardware-managed memory hierarchy that complements TMA, reducing reliance on per-SM register files during matrix-intensive ops.

### 4.4 FlashAttention-3: TMA as Bandwidth Optimizer

FlashAttention-3 uses TMA for all Q, K, V tile loads with WGMMA (warp group MMA) in consumer mainloop. TMA async issues allow softmax pipelining with next tile's data load. Result: FP16 reaches **740 TFLOPs/s at 75% H100 utilization** vs FlashAttention-2's 35%.

### 4.5 CUDA Graphs — Kernel Launch Overhead Hiding

LLM decode dominated by CPU kernel launch overhead at small batches. Each transformer pass may launch hundreds of kernels. CPU launch overhead: ~**2.1 μs** on H100 per launch (GPU idle). CUDA Graphs record launch sequence and replay with **single CPU call**, reducing per-launch overhead to ~**1.3 μs** — ~38% per launch.

**Especially important for multi-GPU inference** — reduces jitter from inter-GPU synchronization. In multi-GPU, CUDA Graphs contribute **up to 10% latency reduction**.

Limitation: CUDA Graphs require static input shapes — cannot capture dynamic continuous batching decisions.

### 4.6 Megakernels — Beyond CUDA Graphs

vLLM and SGLang achieve at most **50% of available GPU bandwidth at bs=1** on H100 — not because hardware insufficient, but because each model forward pass breaks into ~100 separate kernels with setup/teardown periods where weights not loading. Persistent "megakernel" that executes end-to-end in a single CUDA kernel eliminates inter-kernel boundaries, reducing launch latency / GPU idle by up to **6.7×** (Hazy Research).

### 4.7 Compute Utilization vs Bandwidth Utilization Duality

GPU FLOP utilization and HBM bandwidth utilization are not the same and do not move together. 95% FLOP utilization with 40% HBM bandwidth (compute-bound) is possible. 20% FLOP utilization with 98% HBM bandwidth (memory-bound decode) is possible. Nsight exposes both independently.

During decode, goal is **maximizing HBM bandwidth utilization**, not FLOP utilization.

**Capital markets implication:** A vendor claiming "high GPU utilization" during inference benchmarks is probably measuring compute utilization during prefill — not the metric that matters for real-time decoding. Ask for HBM bandwidth utilization during decode at your target batch size.

---

## 5. Disaggregated Serving and KV-Cache Streaming

### 5.1 The Prefill/Decode Asymmetry

In monolithic serving, prefill and decode interfere: prefill is compute-intensive and blocks decode slots, causing tail latency spikes. Systems over-provision for prefill peak FLOP demand even when mostly decoding.

Core cost model: **prefill = compute-bound** (scales with FLOPs, tensor parallelism optimal); **decode = memory-bandwidth-bound** (scales with HBM bandwidth, pipeline parallelism or more memory-bandwidth chips optimal). Economic justification for using different silicon for each phase.

### 5.2 DistServe (arXiv:2401.09670, OSDI 2024)

Assigns prefill and decoding to different GPUs. Eliminates phase interference. Co-optimizes resource allocation and parallelism per phase (TP for prefill, PP for decode). Places phases per cluster bandwidth to minimize KV-cache transfer overhead.

**7.4× more requests served** at same latency constraints, or **12.6× tighter SLO adherence** vs monolithic, while keeping >90% requests within bounds.

### 5.3 Splitwise (ISCA 2024)

Disaggregation with **heterogeneous hardware** — H100 for compute-bound prefill, A100 for memory-bandwidth-bound decode. **1.4× higher throughput at 20% lower cost**, or **2.35× more throughput** with same cost/power.

### 5.4 Mooncake (Moonshot AI, 2024)

**KVCache-centric architecture** — KV cache as first-class systems resource. Global KVCache pool for cross-node and cross-request reuse, enabling prefix caching across requests. RDMA-based GPU-to-GPU transfer requiring NVIDIA Mellanox NICs. Production at Moonshot AI.

### 5.5 NIXL — NVIDIA Inference Transfer Library

**Open-sourced March 2025.** Vendor-agnostic, asynchronous point-to-point transfer library for KV cache in distributed inference. Abstracts transport layer: RDMA, GPU-initiated networking, GPU-Direct Storage, NVMe, cloud storage (S3 over RDMA, Azure Blob, EFA on AWS).

**Critical property for capital markets:** NIXL transfers KV cache **without burning SMs** — transfers through dedicated networking hardware and GPU engines for data movement, not compute SMs. A transfer mechanism consuming SMs would add inference latency during decode, creating jitter.

Non-blocking API: register buffer, initiate async transfer, poll completion. Allows inference kernels on SMs and KV cache transfers on network fabric to execute **concurrently without resource contention**.

Benchmark: NIXL P2P achieves best performance for KV cache sizes (256 KB–1 MB). NCCL/RCCL is **30–50% slower** than NIXL for these sizes — the difference between latency-acceptable and stalled decode pipeline.

Integrated into NVIDIA Dynamo, TensorRT-LLM, vLLM, SGLang, Anyscale Ray, LMCache. Native support for AWS EFA via libfabric plugin. Tools: NIXLBench (raw transfer bandwidth/latency), KVBench (LLM-aware profiling).

### 5.6 AWS Disaggregated Inference: EFA-Based Zero-Copy KV Transfer

AWS Neuron SDK NxD Inference supports disaggregated inference via vLLM (Beta). KV cache transfers **directly Neuron device-to-device via EFA** — not first copied to CPU memory. **True zero-copy transfer**. Signal plane uses ZMQ for handshaking; data plane uses Neuron Runtime API over EFA.

EFA transfer is asynchronous — while KV cache receive in progress, other decode requests continue. Once receive completes, scheduler adds new request to next decode batch. Continuous decode throughput during KV cache handoff.

Supported: Trn1 (800 Gbps EFAv2), Trn1n (1,600 Gbps EFAv2), Trn2 (3.2 Tbps EFAv3).

AWS also introduced disaggregated inference for GPU via llm-d and NIXL integration — RDMA over EFA for GPU-to-GPU KV cache transfer.

---

## 6. 2026 Megatrends Summary

**1. FP4 inference production-real on Blackwell.** MXFP4 (E2M1) native in Blackwell Tensor Cores with 2× MXFP8 throughput. DeepSeek R1 in FP4 is early production. NVIDIA Model Optimizer (NVFP4) publicly available as PyPI wheel.

**2. KV cache quantization moving research → production.** vLLM has FP8 in production. INT8 KV cache is open request. KIVI in HuggingFace Transformers. KVQuant with 1.7× production kernels.

**3. Disaggregated serving now default.** "The default playbook across nearly every major LLM serving stack" — NVIDIA Dynamo, llm-d, Ray Serve LLM, SGLang, vLLM, LMCache, Mooncake.

**4. CXL 3.0 for memory capacity extension (not hot path yet).** CXL 2.0 adds ~70 ns vs local DRAM. Most useful when models exceed 30B, KV cache exceeds VRAM, and latency tolerance is 200–500 ns. **4–5× cost reduction vs GPU VRAM**, **200–500× lower latency than SSD offloading**. CXL-enabled KV offload: **21.9× throughput**, 60× lower energy/token vs NVMe. Microsoft launched first CXL cloud instances Nov 2025. CXL 3.0/3.1 commercial 2027.

CXL near-term role: **capacity extension** (cold KV prefixes, very long contexts) not hot-path decode — 200–500 ns per access disqualifies from sub-ms inference.

**5. HBM4 bandwidth roadmap (2026–2027).** Doubles memory interface from 1,024-bit to 2,048-bit. Samsung 36 GB HBM4: 3.3 TB/s per stack. SK Hynix 16-Hi 48 GB HBM4: 11.7 Gbps/pin, mass production Q3 2026. 8-stack NVIDIA Rubin with HBM4: **~22 TB/s aggregate** — triple HBM3e.

NVIDIA Vera Rubin (H2 2026, TSMC 3nm): 288 GB HBM4 per GPU, 13 TB/s per-GPU, Rubin NVL144 rack delivers 3.6 EFLOPS FP4. Rubin Ultra (2027): 1 TB HBM4E, ~32 TB/s.

HBM4 introduces **logic base die** (TSMC 12nm / Samsung 4nm) as bottom stack layer → direct integration of custom compute → blurs memory/processor line → sets stage for PIM by 2027.

**6. Architecture trifecta.** (1) HBM-GPU (NVIDIA, AMD): H100 3.35 → B300 8 → Rubin 22 TB/s. Mainstream. (2) **Groq LPU on-chip SRAM**: 230 MB SRAM per chip at ~80 TB/s — ~10× HBM. Deterministic compiler-scheduled static execution. Llama 3 70B at >1,660 t/s with speculative decoding. Limited by capacity. (3) **Cerebras WSE-3 wafer-scale SRAM**: single 46,255 mm² wafer, 44 GB SRAM, ~220 TB/s, 900,000 cores. Entire model on-chip — no HBM round-trips. 3,000 t/s on 120B models.

---

## 7. Capital Markets Synthesis

### 7.1 Jitter Sources Ranked by Impact

Capital markets has a fundamentally different requirement: **determinism and tail latency** matter more than aggregate throughput.

**1. HBM contention / noisy-neighbor GPU sharing.** Co-located workloads (training, data loaders, I/O) contend for PCIe bandwidth and GPU compute, creating P99/P999 spikes. Without isolation, 1-in-100 inference events can be delayed **>2 ms** purely from OS scheduling. Worst case: **11 ms**.

**2. KV cache eviction events.** When PagedAttention block pool exhausted, synchronous evict/swap pauses decode pipeline. Analogous to GC pause.

**3. Thermal throttling.** Prefill is compute-intensive and triggers DVFS mid-inference. TAPAS study: thermal/power throttling events reduced **97–99%** with thermal-aware scheduling while maintaining P99.

**4. Kernel launch variance.** Hundreds of kernels per decode step × ~2.1 μs launch × CPU scheduler preemption jitter. CUDA Graphs reduce to ~1.3 μs but don't eliminate.

**5. CPU-GPU synchronization overhead.** In VMs, GPU completion interrupts trapped by hypervisor and injected into guest — μs of jitter per token. For 500-token response, accumulates perceptibly.

### 7.2 Techniques That Reduce Jitter

**Persistent CUDA kernels:** Kernel remains active across application lifetime, keeping weights in shared memory and registers across iterations. On GH200 (Grace Hopper Superchip): **LSTM inference 4.61–4.70 μs P99** (LSTM_A, 1–8 instances), **6.88–7.10 μs** (LSTM_B) — validated against STAC-ML Markets (Inference) Tacana benchmark.

**CUDA Green Contexts:** Partition GPU into independent execution contexts bound to specific SMs (min 2 SMs per context). Enables multiple model instances without complex signaling, eliminates cross-context interference.

**GDRCopy / pinned memory:** Low-latency CPU-GPU comm via GPUDirect RDMA, CPU mapping of GPU memory without copying through OS. **Up to 0.5 μs speedup on PCIe** for pinned host buffer access.

**Thread and core pinning (NUMA affinity):** Pinning inference threads to dedicated cores and isolating from OS scheduling reduces worst-case latency from **11 ms → tens of μs**. Best NUMA on Intel: exposing single NUMA node per socket with HBM explicitly configured.

**Disabling GPU power states:** HBM memory clock on HBM2 (e.g., A100) cannot be software-scaled. However DVFS can run at high frequency indefinitely wasting power. For constant-availability capital markets: lock GPU to fixed power state to eliminate DVFS frequency jitter.

**Model warm-up before trading sessions:** JIT compilation adds 10s–100s of ms on first use. Best practice: warm up (synthetic bs=1 requests) before market open to cache compiled kernels and populate L2.

**Bare metal over virtualized:** Hypervisor interrupt injection adds μs per token. For sub-ms targets, bare metal eliminates this entirely.

### 7.3 Latency-Budget Silicon Choice

| Budget | Approach | Key Technique | Example Silicon |
|--------|----------|---------------|-----------------|
| Sub-1 ms (HFT tick) | Persistent kernel on dedicated partition | Green Contexts, GDRCopy, pinned memory | GH200, H100 SXM, Groq LPU |
| 1–10 ms (real-time risk) | vLLM/TensorRT-LLM, FP8, CUDA Graphs | KV quant, speculative decoding | H100/H200, Trainium2 |
| 10–100 ms (compliance) | Full disaggregated serving, batching | Disagg prefill/decode, FP4 | H100 cluster, Trn2 cluster |

STAC-ML Tacana benchmark: **4.61 μs P99 LSTM on GH200** with persistent kernels + Green Contexts — validates sub-1 ms tier achievable with current hardware.

### 7.4 Power per Inference — Colo Cost Axis

LLM inference clusters show **~21% power headroom** at cluster level despite high per-server peak utilization (vs ~3% for training). Inference requests arrive stochastically, enabling power oversubscription strategies unavailable for training.

**Groq LPU: 4.7× energy efficiency advantage** over GPU-based inference for latency-sensitive workloads — eliminating HBM access and driving-DRAM-signals energy. On-chip SRAM is faster AND more energy-efficient per bit than HBM.

TAPAS thermal-aware scheduling: peak row power **reduced 23%** in inference clusters (maintaining P99 latency) → **up to 40% additional capacity** without additional power infrastructure.

**Quantization as power lever:** FP4 MXFP4 on Blackwell delivers 2× FP8 throughput at same TDP → same workload at half power envelope, or 2× throughput within same colo power budget.

---

## 8. Key Talking Points for Carlos

1. **The memory wall is measurable, not metaphorical.** Decode AI ≈ 1 FLOPs/byte; H100 ridge point ~298. Every decode step is 298× below the compute ceiling — permanently memory-bandwidth-bound. Adding FLOPs to a memory-bandwidth-bound workload does nothing. This is the thesis to walk away holding.

2. **Quantization is a memory optimization masquerading as compute.** When people say "INT4 gives 4× speedup," they mean 4× more weight loaded per second from HBM. FLOPs reduction is secondary. Fewer bytes × same bandwidth = more tokens.

3. **FlashAttention proves the thesis by example.** Same math, same FLOPs, 2–4× faster. Entire speedup from moving 10–20× fewer bytes through HBM by keeping attention in SRAM. Asking "why is FlashAttention faster" = asking why HBM is slower than SRAM.

4. **KV cache is the new GPU memory allocation problem.** Before PagedAttention, 60–80% waste — fragmentation, pre-allocation. Same problem that motivated OS virtual memory in 1960s. Same solution (paging, block allocation, copy-on-write). GQA reduces KV cache 4× at architecture level — free 4× memory upgrade at checkpoint time.

5. **Disaggregation is not optimization — it's physics acknowledgment.** Prefill and decode have incompatible optimal hardware. Splitwise: 1.4× throughput, 20% lower cost — just from H100 for prefill + A100 for decode. NIXL makes KV cache handoff cheap enough that network is no longer bottleneck.

6. **For capital markets: jitter is the adversary, not throughput.** A 2 ms P99 spike from OS preemption is indistinguishable from network fault in risk engine. Techniques that matter — persistent kernels, CUDA Green Contexts, NUMA affinity, pinned memory, warm-up — are latency-determinism techniques, not throughput. STAC-ML Tacana at 4.61 μs P99 on GH200 is the proof point.

7. **The 2026 stack is FP4 inference + FP8 KV cache + disaggregation.** These three stack multiplicatively. FP4 doubles decode throughput (bandwidth); FP8 KV cache halves cache read time; disaggregation eliminates prefill/decode interference. Blackwell + NIXL: multiplicative improvement over FP16 monolithic H100.

8. **HBM4 is a step, not a solution.** Rubin's 22 TB/s is 6.5× H100. FP4 compute is 4× FP8, 2× FP16. Compute-to-bandwidth ratio keeps widening. HBM4 buys time. Structural answer: quantize aggressively, compress KV cache, use on-chip SRAM where determinism matters (Groq/Cerebras for sub-ms). Memory wall worsens, not disappears.

9. **Power per inference is the new $/token.** Colo charges by kW. FP4 at same TDP as FP8 doubles capacity. Groq's 4.7× energy advantage over GPU matters at rack level. Firms with tightest power envelopes win on cost; most deterministic stacks win on latency SLOs. Both needed.

10. **NIXL's "no SM burn" property is not a footnote.** In capital markets inference, decode SM budget is latency budget. Any technique consuming SMs for data movement — including naive NCCL-based KV transfer — directly increases decode step time and adds jitter. NIXL routes through network fabric, leaving full SM allocation for inference kernels. This architectural separation of compute and data movement is the design principle for infrastructure choices.

---

## 9. Sources

All accessed 2026-04-21.

1. [JAX Scaling Book — All About Transformer Inference](https://jax-ml.github.io/scaling-book/inference/)
2. [arXiv:2512.22066 — Prefill vs Decode Bottlenecks](https://arxiv.org/html/2512.22066v1)
3. [arXiv:2512.01644 — Systematic Characterization of LLM Inference on GPUs](https://arxiv.org/html/2512.01644v1)
4. [arXiv:2402.16363 — LLM Inference Unveiled: Roofline Model](https://arxiv.org/html/2402.16363v4)
5. [arXiv:2309.06180 — PagedAttention (SOSP 2023)](https://arxiv.org/abs/2309.06180)
6. [vLLM PagedAttention Docs](https://docs.vllm.ai/en/stable/design/paged_attention/)
7. [arXiv:2205.14135 — FlashAttention](https://arxiv.org/abs/2205.14135)
8. [arXiv:2407.08608 — FlashAttention-3](https://arxiv.org/abs/2407.08608)
9. [arXiv:2402.02750 — KIVI (ICML 2024)](https://arxiv.org/abs/2402.02750)
10. [arXiv:2401.18079 — KVQuant (NeurIPS 2024)](https://arxiv.org/abs/2401.18079)
11. [vLLM Quantized KV Cache Docs](https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/)
12. [vLLM GitHub #33480 INT8 KV cache](https://github.com/vllm-project/vllm/issues/33480)
13. [arXiv:2306.14048 — H2O (NeurIPS 2023)](https://arxiv.org/abs/2306.14048)
14. [arXiv:2305.13245 — GQA (EMNLP 2023)](https://arxiv.org/abs/2305.13245)
15. [arXiv:2503.01840 — EAGLE-3 (NeurIPS 2025)](https://arxiv.org/abs/2503.01840)
16. [arXiv:2306.00978 — AWQ (MLSys 2024)](https://arxiv.org/abs/2306.00978)
17. [OCP Microscaling Formats MX v1.0](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)
18. [OCP MX Empirical Study — FP4 LLM training](https://aisystemcodesign.github.io/papers/FP4.pdf)
19. [NVIDIA TensorRT-LLM FP8 Quantization Guide](https://nvidia.github.io/TensorRT-LLM/blogs/quantization-in-TRT-LLM.html)
20. [NVIDIA Model Optimizer Announcement](https://developer.nvidia.com/blog/accelerate-generative-ai-inference-performance-with-nvidia-tensorrt-model-optimizer-now-publicly-available/)
21. [PyTorch CUTLASS Ping-Pong GEMM](https://pytorch.org/blog/cutlass-ping-pong-gemm-kernel/)
22. [CUTLASS TMA Tutorial — Colfax Research](https://research.colfax-intl.com/tutorial-hopper-tma/)
23. [arXiv:2512.02189 — Microbenchmarking Blackwell](https://arxiv.org/pdf/2512.02189)
24. [CUDA Graphs in LLM Inference Deep Dive](https://dev.to/sfahad/cuda-graphs-in-llm-inference-deep-dive-36pb)
25. [MLC Engine Optimization Blog](https://blog.mlc.ai/2024/10/10/optimizing-and-characterizing-high-throughput-low-latency-llm-inference)
26. [Hazy Research Megakernel Blog](https://hazyresearch.stanford.edu/blog/2025-05-27-no-bubbles)
27. [arXiv:2401.09670 — DistServe (OSDI 2024)](https://arxiv.org/abs/2401.09670)
28. [DistServe Retrospective — Hao AI Lab](https://haoailab.com/blogs/distserve-retro/)
29. [NVIDIA Technical Blog — NIXL](https://developer.nvidia.com/blog/enhancing-distributed-inference-performance-with-the-nvidia-inference-transfer-library/)
30. [UCCL/NIXL KV Transfer Benchmark](https://uccl-project.github.io/posts/kv-transfer-engine/)
31. [AWS Neuron Disaggregated Inference](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/disaggregated-inference.html)
32. [AWS ML Blog — Disaggregated Inference with llm-d](https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/)
33. [Astera Labs — CXL Inference Tokenomics](https://www.asteralabs.com/inference-tokenomics-how-cxl-memory-expansion-improves-ai-economics/)
34. [HBM4 CES 2026 Roundup — FinancialContent](https://www.financialcontent.com/article/tokenring-2026-1-13-the-hbm4-memory-war-sk-hynix-samsung-and-micron-battle-for-ai-supremacy-at-ces-2026)
35. [NVIDIA Capital Markets Single-Digit μs Inference](https://developer.nvidia.com/blog/achieving-single-digit-microsecond-latency-inference-for-capital-markets/)
36. [OS-Level Challenges in LLM Inference](https://eunomia.dev/blog/2025/02/18/os-level-challenges-in-llm-inference-and-optimizations/)
37. [arXiv:2501.02600 — TAPAS Thermal-Aware Scheduling](https://arxiv.org/html/2501.02600v1)
38. [Microsoft Research GPU Power ASPLOS 2024](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/03/GPU_Power_ASPLOS_24.pdf)
39. [Groq LPU Architecture Blog](https://groq.com/blog/inside-the-lpu-deconstructing-speed)
40. [Cerebras CS-3 vs Groq LPU Comparison](https://www.cerebras.ai/blog/cerebras-cs-3-vs-groq-lpu)
