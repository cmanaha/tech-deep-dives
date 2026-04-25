# Track 2 — AWS Custom Silicon (Trainium, Inferentia, Neuron)
## STAC London 2026: Beyond Peak FLOPs — Memory and Modern Inference Silicon

**Researched:** 2026-04-21
**Panel thesis:** Memory bandwidth, locality, and data movement have replaced FLOPs as the inference bottleneck.
**Carlos's role:** AWS panelist — anchor track on memory-orchestration portfolio.

Evidence labels: [VERIFIED] — from an official AWS source fetched in this session. [LIKELY] — strong inference. [SPECULATIVE] — single unofficial source. [UNKNOWN] — gap explicitly reported.

---

## Fact Sheet Per Chip

### Trainium1 (trn1) — NeuronCore-v2

| Attribute | Value |
|---|---|
| NeuronCores per chip | 2 (NeuronCore-v2) |
| Compute — FP16/BF16/TF32 | 190 TFLOPS |
| Compute — INT8 | 380 TOPS |
| HBM capacity per chip | 32 GiB |
| HBM bandwidth per chip | 820 GiB/s |
| DMA bandwidth | 1 TB/s (inline compression) |
| SBUF per NeuronCore | 24 MiB (128 × 192 KiB) |
| PSUM per NeuronCore | 2 MiB (128 × 16 KiB) |
| DMA engines per core | 16 parallel, 27 GiB/s each |
| Interconnect | NeuronLink-v2, 2D Torus |

Trn1 instance family: trn1.2xlarge (1 chip), trn1.32xlarge (16 chips, 512 GiB HBM, 800 Gbps EFA), trn1n.32xlarge (1,600 Gbps EFA).

### Trainium2 (trn2) — NeuronCore-v3

| Attribute | Value |
|---|---|
| NeuronCores per chip | 8 (NeuronCore-v3) |
| Compute — FP8 dense | 1,299 TFLOPS (1.3 PFLOPs) |
| Compute — BF16/FP16/TF32 | 667 TFLOPS |
| Compute — FP8 sparse | 2,563 TFLOPS |
| HBM capacity per chip | 96 GiB HBM3 |
| HBM bandwidth per chip | 2.9 TB/s |
| DMA bandwidth | 3.5 TB/s |
| SBUF per NeuronCore | 28 MiB (128 × 224 KiB) |
| SBUF total per chip | 224 MiB (4.7× over Trn1) |
| PSUM per NeuronCore | 2 MiB |
| CC-Cores per chip | 16 |
| Interconnect | NeuronLink-v3, 1.28 TB/s per chip |
| Topology per server | 2D Torus |
| UltraServer topology | 3D Torus |

Trn2 instances: trn2.3xlarge (1 chip, 96GB HBM, 2.9 TB/s), trn2.48xlarge (16 chips, 1.5 TB HBM, 46 TB/s aggregate, 3.2 Tbps EFA), trn2u.48xlarge (UltraServer node).

Trn2 UltraServer: 64 chips, 6 TB HBM, 185 TB/s aggregate bandwidth, 12.8 Tbps EFAv3, 32 TB NVMe, 83.2 FP8 PFLOPs.

### Trainium3 (trn3) — NeuronCore-v4 (GA December 2025)

| Attribute | Value |
|---|---|
| NeuronCores per chip | 8 (NeuronCore-v4) |
| Compute — MXFP8/MXFP4 | 2,517 TFLOPS (2.52 PFLOPs) |
| Compute — BF16/FP16/TF32 | 671 TFLOPS |
| HBM capacity per chip | 144 GiB HBM3e (1.5× over Trn2) |
| HBM bandwidth per chip | 4.9 TB/s (1.7× over Trn2) |
| DMA bandwidth | 4.9 TB/s |
| SBUF per NeuronCore | 32 MiB |
| SBUF total per chip | 256 MiB |
| PSUM per NeuronCore | 2 MiB |
| CC-Cores per chip | 16 |
| Interconnect | NeuronLink-v4, 2.56 TB/s per chip (2× over Trn2) |
| Process node | TSMC 3nm (N3P) [LIKELY] |

Trn3 UltraServer: 144 chips, 20.7 TB HBM3e, 706 TB/s aggregate, NeuronSwitch-v1 (all-to-all), 362 FP8 PFLOPs. 4.4× perf, 3.9× memory BW, 4× perf/watt vs Trn2 UltraServer. On Amazon Bedrock: up to 3× faster than Trn2, over 5× higher output tokens per megawatt at similar latency.

### Inferentia2 (inf2) — NeuronCore-v2

| Attribute | Value |
|---|---|
| NeuronCores per chip | 2 |
| Compute — FP16/BF16/cFP8/TF32 | 190 TFLOPS |
| HBM capacity per chip | 32 GiB |
| HBM bandwidth per chip | 820 GiB/s |
| NeuronLink-v2 (multi-chip) | 192 GiB/s per chip |

Inf2 instance family: inf2.xlarge ($0.76/hr), inf2.8xlarge ($1.97/hr), inf2.24xlarge (6 chips, 192 GiB, $6.49/hr), inf2.48xlarge (12 chips, 384 GiB, $12.98/hr). Note: Inf2 uses only 2 NeuronCore-v2 per chip vs Trainium1's 2 NeuronCore-v2 per chip — same silicon generation.

Inferentia1 baseline: NeuronCore-v1, 4 cores/chip, 8 GiB DRAM (not HBM) at 50 GiB/s. HBM adoption in Neuron begins with NeuronCore-v2.

**Inferentia3:** [UNKNOWN] — No public announcement as of 2026-04-21. The trn2.3xlarge (single Trainium2 chip) appears to occupy the small-inference niche.

---

## NeuronCore Memory Hierarchy (On-Chip SRAM vs HBM)

Three-tier, entirely software-managed memory:

**PSUM (on-chip, per core):** 2 MiB. 128 partitions × 16 KiB. Dedicated Tensor Engine accumulator. Supports read-add-write in one operation (near-memory accumulation).

**SBUF (on-chip state buffer, per core):** 24/28/32 MiB for v2/v3/v4. 128 partitions. Accessible by all compute engines (Tensor, Vector, Scalar, GpSimd). Approximately 20× HBM bandwidth.

**HBM (off-chip):** 32 GiB/96 GiB/144 GiB for Trn1/Trn2/Trn3. 820 GiB/s / 2.9 TB/s / 4.9 TB/s.

Key architectural property: **no hardware cache**. "NeuronCore does not have a hardware cache system to perform any data movement across memories that is opaque to the program." The compiler or NKI programmer resolves all tensor placement at NEFF build time. There are no evictions, no speculative prefetches, no cache coherence overhead.

The 128-partition model: both SBUF and PSUM are 2D memories. In every clock cycle, each engine can read 128 elements across all 128 partitions simultaneously. Partition dimension (P) is parallel; free dimension (F) is sequential. 16 parallel DMA engines per NeuronCore-v2, each at 27 GiB/s peak, run concurrent with compute.

**Why no hardware cache is a capital markets feature:** GPU L1/shared memory share a hardware cache controller that can evict programmer-placed data opaquely. NeuronCore has zero cache eviction — for a given input shape, the instruction sequence and memory access pattern are identical on every execution.

---

## NeuronLink Interconnect and Collectives

### Generations

| Version | Silicon | BW per chip | Topology |
|---|---|---|---|
| NeuronLink-v2 | Trn1, Inf2 | 192 GiB/s (Inf2 documented) | 2D Torus |
| NeuronLink-v3 | Trn2 | 1.28 TB/s | 2D Torus; 3D Torus (UltraServer) |
| NeuronLink-v4 | Trn3 | 2.56 TB/s | All-to-all via NeuronSwitch-v1 |

### CC-Cores: Dedicated Collective Silicon

Trainium2 and Trainium3 each contain **16 CC-Cores (Collective Communication Cores) per chip** — dedicated hardware processors responsible for orchestrating AllReduce, AllGather, ReduceScatter, All-to-All, and Permute. They run independently of tensor compute engines.

This contrasts with NVIDIA GPU clusters where NCCL runs collectives on the same CUDA cores used for tensor operations — creating resource contention during communication phases. On Trainium, tensor parallelism collective phases are compute-transparent.

### Message-Size-Aware Algorithms

| Algorithm | Latency | Optimal Size |
|---|---|---|
| Mesh | O(1) | < 1 MB |
| Recursive Doubling-Halving (RDH) | O(log N) | 1–56 MB |
| KangaRing | O(N/2) | > 56 MB; 25–33% lower HBM pressure |
| Ring | O(N) | Fallback |

### Cross-Server Latency

HBM-to-HBM packet latency across servers via EFAv3 on Trn2: **15 µs**. EFA bandwidth per Trn2.48xlarge: 3.2 Tbps (device RDMA).

### Trainium3 SBUF-to-SBUF Collectives [LIKELY]

Trainium3 reportedly introduces auto-forwarding where collectives operate SBUF-to-SBUF — data does not round-trip to HBM before being forwarded. NVIDIA GPU collectives via NCCL require device memory (HBM) endpoints. If confirmed, this reduces collective latency and eliminates unnecessary HBM bandwidth consumption during inter-chip communication.

---

## Neuron Compiler (Explicit Memory Orchestration)

### NEFF and Ahead-of-Time (AOT) Compilation

The Neuron compiler (neuronx-cc) converts a PyTorch or JAX graph to a NEFF (Neuron Executable File Format) — a binary containing compiled device instructions, model parameters, and execution metadata.

**The determinism guarantee (most important architectural property for the panel):**
1. NEFF generated once before deployment — not at first inference
2. Runtime executes precompiled graph — no JIT recompilation, no Python tracing, no shape-triggered recompile
3. Compiled model consumes predictable, static, pre-known amount of device memory
4. NEFF is portable: compile on any EC2 instance, distribute to inference fleets via S3 or config management

"AOT-traced model will consume a predictable amount of Neuron device memory and will never require recompilation based on input changes." XLA Lazy Tensor (JIT) inference "can be more difficult to predict memory utilization and the compilations that may be required at inference time."

### Compiler vs CUDA Shared Memory

| Property | Neuron Compiler | CUDA Shared Memory (GPU) |
|---|---|---|
| L1 cache eviction | None — no hardware cache | Hardware-managed; opaque |
| Memory placement | Fully compiler-resolved at NEFF build | Programmer declares; hardware controls eviction |
| Runtime recompilation | Never (AOT NEFF) | Possible on shape mismatch |
| Memory footprint at inference | Predictable — locked at compile time | Variable — can change if JIT recompiles |
| Latency variance from memory management | None | L1 thrash, TLB miss, JIT compile spike |

### HBM Latency Hiding (Compiler-Managed)

Three mechanisms:
1. **Double-buffering**: DMA loads tile N+1 into second SBUF slot while compute engines work on tile N. NKI API: `ncc.sbuf.mod_alloc()` with `num_free_tiles=2`.
2. **Multi-buffering**: `num_free_tiles > 2` for deeper prefetch pipelines.
3. **Parallel DMA**: 16 DMA engines per NeuronCore-v2 operate concurrently with tensor/vector/scalar/GpSimd engines.

### NKI (Neuron Kernel Interface)

Python-based, NumPy/Triton-like, compiles to NeuronCore ISA. Provides explicit APIs for tensor placement in any memory tier, `par_dim` annotation for partition dimension, direct double/multi-buffering allocation. NKI Compiler is open-sourced under Apache 2.0, built on MLIR.

### Runtime Improvements (SDK 2.29.0, April 2026)

NEFF switch latency improved up to 95% in async mode. Intra-chip ReduceScatter on Trn2: up to 20% lower latency for small transfers, up to 60% for medium-large. Intra-chip AllGather: up to 60% improvement for medium messages.

### KV-Cache Treatment

NxD Inference supports KV cache quantization to FP8 (torch.float8_e4m3fn), automatic KV cache manager, explicit reset_kv_cache(), flash attention kernel (disabled by default, auto-enabled where efficient). SDK 2.29.0 added fused FP8 KV cache quantization and block-based KV cache layout in the QKV kernel; MLP kernel added MXFP4/MXFP8 quantization paths.

Paged Attention and Chunked Prefill for vLLM on Neuron are in development, not yet released. Continuous batching supported since vLLM 0.3.3.

[UNKNOWN] Precise architectural documentation on how KV-cache tiles are placed between HBM and SBUF during long-context inference is not published.

---

## AWS Instance Mapping

| Instance | Silicon | Chips | NeuronCores | HBM Total | HBM BW | EFA | $/hr |
|---|---|---|---|---|---|---|---|
| inf2.xlarge | Inferentia2 | 1 | 2 | 32 GiB | 820 GB/s | 15 Gbps | $0.76 |
| inf2.8xlarge | Inferentia2 | 1 | 2 | 32 GiB | 820 GB/s | 25 Gbps | $1.97 |
| inf2.24xlarge | Inferentia2 | 6 | 12 | 192 GiB | 4.9 TB/s | 50 Gbps | $6.49 |
| inf2.48xlarge | Inferentia2 | 12 | 24 | 384 GiB | 9.8 TB/s | 100 Gbps | $12.98 |
| trn1.32xlarge | Trainium1 | 16 | 32 | 512 GiB | ~13 TB/s | 800 Gbps | Not listed |
| trn1n.32xlarge | Trainium1 | 16 | 32 | 512 GiB | ~13 TB/s | 1,600 Gbps | Not listed |
| trn2.3xlarge | Trainium2 | 1 | 8 | 96 GB | 2.9 TB/s | 0.2 Tbps | Not listed |
| trn2.48xlarge | Trainium2 | 16 | 128 | 1.5 TB | 46 TB/s | 3.2 Tbps | Capacity Blocks |
| Trn2 UltraServer | Trainium2 | 64 | 512 | 6 TB | 185 TB/s | 12.8 Tbps | Capacity Blocks |
| Trn3 UltraServer | Trainium3 | 144 | 1,152 | 20.7 TB | 706 TB/s | TBD | Capacity Blocks |

Pricing notes: Inf2 prices publicly listed. Trn2/Trn3 on-demand pricing not published; available via Amazon EC2 Capacity Blocks for ML. Trn2 claims 30–40% better price-performance than GPU-based P5e/P5en; Inf2 claims up to 40% better price-performance than comparable GPU instances.

---

## Capital Markets Angle

### Three Root Causes of GPU Inference Jitter — and Neuron's Answer

**Root cause 1: JIT recompilation spikes.** GPU inference frameworks can trigger CUDA kernel recompilation on shape mismatches — hundreds of milliseconds of P99.9 tail latency. The Neuron NEFF model eliminates this entirely. No JIT path on the Neuron runtime.

**Root cause 2: Hardware cache eviction randomness.** GPU shared memory and L1 are managed by hardware cache controllers. Other kernels (driver software, telemetry) can evict inference kernel data. On NeuronCore, there is no hardware cache controller. SBUF placement is static for the NEFF lifetime.

**Root cause 3: Collective operations competing with compute engines.** NCCL AllReduce consumes CUDA cores — the same cores needed for attention computation. During tensor-parallel inference, tensor engines stall waiting for NCCL. On Trainium2/3, 16 CC-Cores per chip handle all collectives independently.

### Measured Latency Data

- Speculative decoding on trn2.48xlarge (Qwen3-1.7B draft + Qwen3-32B target, fused mode, 7 speculative tokens): ~15 ms/token inter-token latency for structured prompts vs ~45 ms/token baseline.
- Cross-server HBM-to-HBM packet latency via EFAv3 on Trn2: 15 µs.
- Inf2 delivers up to 10× lower latency vs. Inferentia1.
- Customer NTT PC Communications: 25% lower inference latency vs. GPU alternatives on Inf2.

### Power Efficiency

- Inf2: up to 50% better performance/watt over comparable EC2 GPU instances.
- Trainium3 (Trn3 UltraServer): 4× better performance/watt vs Trn2 UltraServers. Over 5× higher output tokens per megawatt at similar latency on Bedrock.
- [UNKNOWN] Absolute TDP per Trainium2/Trainium3 chip is not published.

### Cold-Start Story

- First compilation (model to NEFF): minutes (model-dependent). Pre-compile offline.
- Neuron Model Cache (Hugging Face Hub) eliminates redundant recompilation across fleets.
- NEFF load into HBM: seconds for large models. Local NVMe on trn2 (up to 32 TB on UltraServer) for caching.
- Inference after startup: deterministic NEFF execution — no runtime variability.

---

## When to Choose AWS Silicon vs NVIDIA GPU for Inference

| Criterion | Inferentia2 | Trainium2/3 | NVIDIA P5/P5e |
|---|---|---|---|
| Model architecture support | Well-supported Transformers | Same + MoE | Any — maximum flexibility |
| Model size | Up to 70B (384 GiB on inf2.48xlarge) | Frontier (6 TB Trn2 UltraServer, 20.7 TB Trn3) | Up to ~640 GiB per p5.48xlarge |
| Latency regime | Lowest jitter, AOT-deterministic P99 | Low jitter, high throughput | Best raw TTFT for interactive |
| Cost efficiency | 40% better vs comparable GPU | 30–40% better vs P5e/P5en | Highest cost; broadest flexibility |
| Determinism | Maximum — NEFF is static binary | Maximum — NEFF is static binary | Medium — JIT recompile possible |
| CUDA dependency | Incompatible — must port | Incompatible — must port | Native |
| Paged Attention | In development | In development | Supported (vLLM, TGI) |
| Power per inference | 50% better vs GPU | 4× better vs Trn2 | Reference baseline |
| Collective communication | Dedicated CC-Cores | Dedicated CC-Cores | NCCL on CUDA cores |
| Ops maturity | Production-ready (Bedrock-proven) | Production-ready (Bedrock-proven) | Deepest ecosystem |

### The CUDA Porting Cost

The primary adoption barrier. Capital markets teams with proprietary CUDA kernels (custom attention, GPU-accelerated pre/post-processing) must port to NKI or replace with Neuron-compatible libraries.

---

## Key Talking Points for Carlos

1. **AWS built its own silicon because the memory wall was the bottleneck, not FLOPs.** From Inferentia1 (50 GiB/s DRAM) to Trainium3 (4.9 TB/s HBM3e per chip), memory bandwidth grew 98× over four chip generations. FLOPs grew less proportionally. Transformer decode is memory-bandwidth-limited; AWS's silicon roadmap is a bet on memory, not compute.

2. **NeuronCore has no hardware cache — and that is a capital markets feature.** Every GPU has hardware cache controllers with eviction policies opaque to the programmer. On NeuronCore, the SBUF is compiler-managed: if the compiler places a tensor there, it stays there. No eviction surprise, no cache-miss tail latency, no speculative prefetch going wrong.

3. **A NEFF is a binary. It doesn't JIT. The same instruction sequence executes every time.** For a given input shape, inference latency is identical on every invocation — it is physically impossible for the Neuron runtime to recompile at inference time. The GPU world is working toward this with CUDA graphs; Neuron has been here since day one.

4. **Collectives run on dedicated silicon — the tensor engines never wait.** Trn2/Trn3 each have 16 CC-Cores per chip dedicated exclusively to collectives. NCCL on GPU runs on the same CUDA cores as attention. On Trainium, tensor parallelism collective phases are compute-transparent.

5. **NeuronLink-v3 at 1.28 TB/s per chip exceeds a Trainium1 chip's full HBM bandwidth.** Sharding a large model across 16 Trainium2 chips on trn2.48xlarge costs almost nothing in interconnect overhead. For large-model tensor parallelism, this is effectively free memory capacity expansion.

6. **50% better performance per watt on Inf2 is the colo power budget story.** Capital markets firms colocating in third-party data centers pay for power by the kilowatt. 50% better perf/watt = more capacity in same power envelope or half the OpEx at the same capacity.

7. **The Trn2 UltraServer's 6 TB memory fabric eliminates the multi-node requirement for frontier models.** A 670B BF16 model (~1.34 TB weights) fits with room for KV cache on a single logical node. Equivalent GPU capacity requires 3+ P5 nodes and NVLink/InfiniBand traversal on every attention layer.

8. **Cross-server HBM-to-HBM latency via EFAv3 is 15 µs — a published, contractable number.** Build it into your latency budget model.

9. **Trainium3 delivers 5× more output tokens per megawatt than Trainium2 at similar latency on Bedrock.** If your power constraint is binding (which it is for any colo tenant), Trainium3 is a tokens-per-watt story, not a FLOPs story.

10. **SBUF grew 33% across three NeuronCore generations (24 → 28 → 32 MiB per core). On-chip tile size is a latency lever.** Larger SBUF means larger attention tiles on-chip without HBM round-trips. For 32K–128K context research assistants, this directly determines how often attention must pause and reload from HBM.

---

## Gaps in Documentation

1. **Inferentia3 does not publicly exist.** trn2.3xlarge appears to fill this niche. Possible consolidation into a single Trainium lineage with a small-instance option.
2. **TDP (watts) for Inferentia2 and Trainium2/3 chips is not published.** Only relative perf/watt improvements are given.
3. **NeuronLink-v2 per-chip bandwidth for Trainium1 is not published.** 192 GiB/s is the Inf2 figure.
4. **Paged Attention on Neuron is in development, not released.**
5. **KV-cache SBUF tiling strategy is not documented architecturally.**
6. **Trainium2 HBM generation (HBM3 vs HBM3e) is ambiguous.** AWS uses "high-bandwidth device memory"; SemiAnalysis describes HBM3-speed on HBM3e physical chips — not AWS-confirmed.
7. **Trn3 individual instance types not yet documented.** Only UltraServer documented.
8. **Pricing for Trainium2/Trainium3 on-demand is not publicly listed.** Capacity Blocks only.

---

## Sources

All sources accessed 2026-04-21.

1. [Trainium2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html)
2. [Trainium3 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html)
3. [Trainium Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html)
4. [Inferentia2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/inferentia2.html)
5. [Inferentia Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/inferentia.html)
6. [Amazon EC2 Inf2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/inf2-arch.html)
7. [Amazon EC2 Trn1/Trn1n Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trn1-arch.html)
8. [Trainium/Inferentia2 NKI Arch Guide](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.26.0/general/nki/arch/trainium_inferentia2_arch.html)
9. [Trainium2 NKI Arch Guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html)
10. [NKI Programming Model](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.25.0/general/nki/programming_model.html)
11. [Neuron Collective Communication](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html)
12. [Intra-node Collective Communications](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/explore/intranode-collective-comm.html)
13. [Traced vs XLA Lazy Tensor Inference](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/programming-guide/inference/trace-vs-xla-lazytensor.html)
14. [Neuron Compiler FAQ](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/compiler/neuronx-cc/faq.html)
15. [Inference with Neuron FAQ](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/faq/inference/neuron-faq.html)
16. [NxD Inference API Reference](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/api-guides/api-guide.html)
17. [What's New in AWS Neuron SDK (2.29.0)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html)
18. [Amazon EC2 Trn2 Instances](https://aws.amazon.com/ec2/instance-types/trn2/)
19. [Amazon EC2 Trn3 UltraServers](https://aws.amazon.com/ec2/instance-types/trn3/)
20. [Amazon EC2 Inf2 Instances](https://aws.amazon.com/ec2/instance-types/inf2/)
21. [AI Chip — Amazon Inferentia](https://aws.amazon.com/ai/machine-learning/inferentia/)
22. [Trn2 GA AWS News Blog](https://aws.amazon.com/blogs/aws/amazon-ec2-trn2-instances-and-trn2-ultraservers-for-aiml-training-and-inference-is-now-available/)
23. [Announcing Trn3 UltraServers](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)
24. [Speculative decoding on Trainium + vLLM](https://aws.amazon.com/blogs/machine-learning/accelerating-decode-heavy-llm-inference-with-speculative-decoding-on-aws-trainium-and-vllm/)
25. [vLLM Neuron Installation](https://docs.vllm.ai/en/v0.6.4/getting_started/neuron-installation.html)
26. [AWS Trainium3 — HPCwire](https://www.hpcwire.com/2025/12/02/aws-brings-the-trainium3-chip-to-market-with-new-ec2-ultraservers/)
