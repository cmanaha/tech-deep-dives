# MoE on NVIDIA — Tier 1 research notes
Access date: 2026-04-24

## Sources fetched

- https://nvidia.github.io/TensorRT-LLM/overview.html — T1 (official TRT-LLM docs, commit 61cef21, last updated 2026-04-16)
- https://nvidia.github.io/TensorRT-LLM/advanced/expert-parallelism.html — T1 (official TRT-LLM docs)
- https://nvidia.github.io/TensorRT-LLM/release-notes.html — T1 (official TRT-LLM release notes)
- https://github.com/NVIDIA/TensorRT-LLM — T1 (official GitHub)
- https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep — T1 (official GitHub)
- https://github.com/NVIDIA/TensorRT-LLM/pull/3504 — T1 (merged PR, official repo)
- https://docs.nvidia.com/nemo-framework/user-guide/24.09/nemotoolkit/features/moe.html — T1 (official NeMo docs, v24.09)
- https://docs.nvidia.com/nemo-framework/user-guide/latest/llms/deepseek_v3.html — T1 (official NeMo docs)
- https://www.nvidia.com/en-us/data-center/gb200-nvl72/ — T1 (official product page)
- https://www.nvidia.com/en-us/data-center/gb300-nvl72/ — T1 (official product page)
- https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/ — T2 (NVIDIA Technical Blog)
- https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/ — T2 (NVIDIA Technical Blog)
- https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/ — T2 (NVIDIA Technical Blog)
- https://github.com/NVIDIA/cutlass/tree/main/examples/92_blackwell_moe_gemm — T1 (official CUTLASS repo)
- https://docs.nvidia.com/cutlass/latest/CHANGELOG.html — T1 (official CUTLASS docs)

## Findings

### 1. TensorRT-LLM fused MoE kernel — existence, version, precision

[AUTHORITATIVE] TensorRT-LLM officially documents "custom kernels for common inference operations (attention, GEMMs, MoE, ...)" on its overview page. The MoeConfig class appears in the API reference, confirming programmatic MoE configuration support.
(Source: https://nvidia.github.io/TensorRT-LLM/overview.html, T1, accessed 2026-04-24)

[AUTHORITATIVE] The fused MoE module shipped progressively across versions:
- v0.9.0: Mixtral 8x7B OOTB support added; router tensor parallelism removed to improve MoE performance.
- v0.12.0: Added support for FP8 OOTB MoE.
- v0.21.0: Added large-scale EP support; Refactored Fused MoE module; Added MNNVL MoE A2A support.
- v1.0: Add TRTLLM MoE nvfp4 cubins for mid-high concurrency; Integrated TRT-LLM Gen FP8 block scale MoE with Pytorch workflow kernel.
- v1.1: One-Sided AlltoAll over NVLink blog published.
(Source: https://nvidia.github.io/TensorRT-LLM/release-notes.html, T1, accessed 2026-04-24)

[AUTHORITATIVE] The PyTorch workflow supports "FP16/BF16/FP8/NVFP4 GEMM and fused Mixture-Of-Experts (MoE)" with "FP16/BF16/FP8 KVCache." An AutoTuner has been applied to both the Fused MoE and NVFP4 Linear operators.
(Source: https://github.com/NVIDIA/TensorRT-LLM, T1, accessed 2026-04-24)

### 2. Expert parallelism patterns in TensorRT-LLM

[AUTHORITATIVE] TensorRT-LLM supports three parallel patterns for MoE:
- Tensor Parallel (TP, default): evenly splits each expert's weight and distributes across GPUs.
- Expert Parallel (EP): distributes some experts' full weight to different GPUs.
- Hybrid TP+EP: balances workload more evenly across GPUs.

Configuration: set `--moe_tp_size` and `--moe_ep_size` when calling `convert_checkpoint.py`. Constraint: `moe_tp_size × moe_ep_size = tp_size`.
(Source: https://nvidia.github.io/TensorRT-LLM/advanced/expert-parallelism.html, T1, accessed 2026-04-24)

[AUTHORITATIVE] Wide Expert Parallelism (Wide-EP) is a named algorithmic runtime optimization targeting GB200 NVL72. It uses "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)" and includes MoE weight load/redistribution via the Grace CPU C2C connection. Supported hardware: GB200 NVL72, GB300 NVL72, H20, RTX 6000D. Requires CUDA Driver 575 or later. Documented MoE models: DeepSeek-V3/R1, Kimi K2 Thinking, LLaMA4, Qwen3.
(Source: https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep, T1, accessed 2026-04-24)

### 3. AlltoAll bandwidth path — NVLink vs InfiniBand

[AUTHORITATIVE] NVIDIA explicitly identifies NVLink as the required fabric for large-scale MoE EP. From the GB200 NVL72 / Dynamo blog: "If the selected experts reside on GPUs that sit on different nodes, the all-to-all communication becomes bottlenecked by slower internode communication protocols, such as InfiniBand." The GB200 NVL72 NVLink domain supports 1.8 TB/s per GPU (36x faster than 400 Gbps Ethernet).
(Source: https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/, T2, accessed 2026-04-24)

[AUTHORITATIVE] GB200 NVL72 aggregate NVLink bandwidth: 130 TB/s across 72 GPUs. Recommended fabric for EP=64 (the minimum to host all 256 DeepSeek R1 experts with 4 experts/GPU).
(Source: https://www.nvidia.com/en-us/data-center/gb200-nvl72/, T1, accessed 2026-04-24)

### 4. NVFP4 (Blackwell-specific precision for MoE)

[AUTHORITATIVE] NVFP4 is "a 4-bit floating point format introduced with the NVIDIA Blackwell GPU architecture" using E2M1 format (1 sign, 2 exponent, 1 mantissa bit), values approximately -6 to 6. Block size: 16 values (vs MXFP4's 32). Dual-level scaling: fine-grained E4M3 scaling factor per block + FP32 scalar per tensor. Memory reduction: ~3.5x vs FP16, ~1.8x vs FP8.
(Source: https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/, T2, accessed 2026-04-24)

[AUTHORITATIVE] TRT-LLM v1.0 added "TRTLLM MoE nvfp4 cubins for mid-high concurrency." NVFP4 support for MoE reaches Mixtral and DeepSeek-R1/V3. For DeepSeek-V3.2, NVFP4 "reduced the memory footprint of the model by 1.7× compared to the model's original FP8 format (415 GB vs. 690 GB)."
(Source: https://nvidia.github.io/TensorRT-LLM/release-notes.html, T1; https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/, T2, accessed 2026-04-24)

### 5. Blackwell CUTLASS MoE kernels (tcgen05 / TMEM)

[AUTHORITATIVE] CUTLASS example 92 (`92_blackwell_moe_gemm`) ships:
- 92_blackwell_moe_gemm_fp4_regular.cu
- 92_blackwell_moe_gemm_fp4_grouped.cu
- 92_blackwell_moe_gemm_blockscaled_rcgrouped.cu

This is the first official CUTLASS MoE GEMM kernel targeting Blackwell (SM100).
(Source: https://github.com/NVIDIA/cutlass/tree/main/examples/92_blackwell_moe_gemm, T1, accessed 2026-04-24)

[AUTHORITATIVE] CUTLASS changelog versioning for example 92:
- v4.0.0 (2025-06-03): Add Blackwell SM100 kernels for MoEs utilizing TMA and WGMMA.
- v4.2.0 (2025-09-15): Added SM100 MoE kernels for Low-Latency inference performance. Uses TMA (for weights) and CPASYNC (for tokens). Only one problem dimension can vary across groups/experts.
- v4.3.0 (2025-11-21): Support blockscaled variant of ragged contiguous grouped gemm with the new simplified MoE API in example 92...works for all microscaling types.
- v4.4.0 (2026-02-14): New `acc_scale` grouped mixed-input GEMM variant for decoding.
(Source: https://docs.nvidia.com/cutlass/latest/CHANGELOG.html, T1, accessed 2026-04-24)

### 6. MoE models officially benchmarked by NVIDIA

[AUTHORITATIVE] Models explicitly documented or benchmarked in T1/T2 NVIDIA sources:
- Mixtral 8x7B: first OOTB MoE model in TRT-LLM (v0.9.0). FP8 quantization added v0.16.0.
- DeepSeek-R1 (671B, 37B active): "world-record inference performance on Blackwell GPUs" claimed. GB200 NVL72 achieves "10,000 TPS/GPU" on 8K/1K benchmark at 50 TPS/user.
- DeepSeek-V3 / V3.2 (671B, 37B active): Blackwell optimization blog; NVFP4 reduces footprint to 415 GB vs 690 GB FP8.
- gpt-oss-120b (117B, 5.1B active): 60,000 TPS/GPU max throughput; 1,000 TPS/user max interactivity on Blackwell.
- Llama 4 Maverick: "broke the 1,000 TPS/user barrier" on Blackwell.
- Qwen3-MoE, Kimi K2 Thinking: documented in Wide-EP example README.

[AUTHORITATIVE] NeMo Framework documents DeepSeek-V3 training: 671B total / 37B active, EP=64 distributing 256 experts, recommended config "TP=2, PP=16, EP=64 (1024 GPUs, 128 nodes)." Precision: FP32 master weights with BF16 gradients.
(Source: https://docs.nvidia.com/nemo-framework/user-guide/latest/llms/deepseek_v3.html, T1, accessed 2026-04-24)

### 7. NeMo MoE training configuration

[AUTHORITATIVE] NeMo Framework MoE key parameters:
- `num_moe_experts`: total expert count
- `moe_router_topk`: active experts per token
- `moe_token_dispatcher_type`: 'allgather' or 'alltoall'
- `moe_router_load_balancing_type`: 'aux_loss' or 'sinkhorn'
- `moe_expert_capacity_factor`: max tokens per expert (None = no dropping)
- `moe_layer_recompute`: checkpoint MoE layer to save activation memory
- Expert parallelism enabled via `expert_model_parallel_size` in `MegatronStrategy`
(Source: https://docs.nvidia.com/nemo-framework/user-guide/24.09/nemotoolkit/features/moe.html, T1, accessed 2026-04-24)

### 8. Memory capacity — B200 vs B300 vs GB200 NVL72

[AUTHORITATIVE] Per-GPU HBM:
- B200: up to 180 GB HBM3/HBM3e
- B300 (Blackwell Ultra): 288 GB HBM3e+, 8 TB/s bandwidth, 14 PFLOPS FP4
- GB200 NVL72: 13.4 TB HBM3e total (72 GPUs), 576 TB/s aggregate memory bandwidth
- GB300 NVL72: 20 TB GPU memory, 576 TB/s bandwidth, 1,440 PFLOPS FP4

[AUTHORITATIVE] The GB200 NVL72 "10x greater performance for mixture-of-experts (MoE) architectures" claim appears on the official product page (no denominator stated — UNKNOWN whether vs H100 SXM5 or H200).
(Source: https://www.nvidia.com/en-us/data-center/gb200-nvl72/, T1, accessed 2026-04-24)

## UNKNOWN

1. tcgen05 for routing kernels specifically: No T1 source documents that tcgen05.mma is used for the MoE routing/gating computation vs purely for expert GEMMs.
2. TMEM usage in MoE routing: No T1 source explicitly maps TMEM to MoE routing operations.
3. "10x greater performance for MoE" denominator: GB200 NVL72 product page does not state baseline.
4. Explicit memory-capacity-vs-experts-resident tradeoff documentation: not directly framed in T1 sources.
5. NeMo FP8 training for MoE: NeMo's DeepSeek-V3 page specifies BF16 gradients, not FP8.
6. One-Sided AlltoAll blog (blog18): URL returned 404 at access time.

## Direct quotes worth using verbatim

> "If the selected experts reside on GPUs that sit on different nodes, the all-to-all communication becomes bottlenecked by slower internode communication protocols, such as InfiniBand."
— NVIDIA Technical Blog, GB200 NVL72 + Dynamo for MoE (T2)

> "NVIDIA B200 GPUs, when used with TensorRT LLM, enable seamless loading of model weights in the new FP4 format, allowing you to automatically leverage optimized FP4 kernels for efficient and accurate low-precision inference."
— TensorRT-LLM Overview, T1

> "The main motivation for introducing large-scale EP (EP > 8) is to reduce execution latency thanks to increased aggregated memory bandwidth to load the expert weights."
— TensorRT-LLM Wide-EP design blog (T1 GitHub source)

> "FP8 quantization...can double performance and halve memory consumption compared to 16-bit floating point, with minimal impact on model accuracy."
— TensorRT-LLM Overview, T1
