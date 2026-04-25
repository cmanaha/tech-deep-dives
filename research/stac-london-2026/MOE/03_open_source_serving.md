# MoE in open-source serving stacks — Tier 1 research notes
Access date: 2026-04-24

## Sources fetched

- [T1] vLLM repository README — https://github.com/vllm-project/vllm
- [T1] vLLM supported models docs — https://docs.vllm.ai/en/latest/models/supported_models.html
- [T1] vLLM Data Parallel Deployment docs — https://docs.vllm.ai/en/latest/serving/data_parallel_deployment.html
- [T1] vLLM Parallelism & Scaling docs — https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html
- [T1] SGLang repository README — https://github.com/sgl-project/sglang
- [T1] SGLang docs index — https://docs.sglang.io/ (and llms.txt)
- [T1] SGLang Expert Parallelism page — https://docs.sglang.io/docs/advanced_features/expert_parallelism.md
- [T1] SGLang `server_args.py` — https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py
- [T2] LMSYS blog "Deploying DeepSeek with PD Disaggregation and Large-Scale Expert Parallelism" — https://lmsys.org/blog/2025-05-05-large-scale-ep/
- [T1] HF TGI repository README — https://github.com/huggingface/text-generation-inference
- [T1] HF TGI supported models docs — https://huggingface.co/docs/text-generation-inference/supported_models
- [T1] FlashInfer repository README — https://github.com/flashinfer-ai/flashinfer
- [T1] FlashInfer docs index — https://docs.flashinfer.ai/
- [T1] FlashInfer fused_moe API reference — https://docs.flashinfer.ai/api/fused_moe.html
- [T1] DeepEP repository README — https://github.com/deepseek-ai/DeepEP

## Findings

### vLLM

1. **[T1]** vLLM advertises first-class MoE support: "Mixture-of-Expert LLMs (e.g., Mixtral, DeepSeek-V3, Qwen-MoE, GPT-OSS)". (https://github.com/vllm-project/vllm)
2. **[T1]** vLLM lists MoE architectures supported via dedicated model classes: Mixtral 8x7B/8x22B, DeepSeek-V2/V3, Qwen1.5-MoE / Qwen2-MoE / Qwen3-MoE, Dbrx, Granite MoE / PowerMoE, Hunyuan-A13B, Ernie 4.5 MoE, Phi-3.5-MoE, OLMoE, Sarvam 2. (https://docs.vllm.ai/en/latest/models/supported_models.html)
3. **[T1]** vLLM README explicitly lists kernel backends: "Optimized GEMM/MoE kernels for various precisions using CUTLASS, TRTLLM-GEN, CuTeDSL" and "Optimized attention kernels including FlashAttention, FlashInfer, TRTLLM-GEN, FlashMLA, and Triton". (https://github.com/vllm-project/vllm)
4. **[T1]** vLLM lists parallelism dimensions including expert parallelism: "Tensor, pipeline, data, expert, and context parallelism for distributed inference". (https://github.com/vllm-project/vllm)
5. **[T1]** Expert parallelism is enabled with the `--enable-expert-parallel` CLI arg, applied on all nodes in the multi-node case. By default expert layers form a tensor-parallel group of size `DP × TP`; with EP enabled, that group is converted to expert parallelism. vLLM docs: "it can be advantageous to use data parallel for the attention layers and expert or tensor parallel (EP or TP) for the expert layers." (https://docs.vllm.ai/en/latest/serving/data_parallel_deployment.html)
6. **[T1]** vLLM Parallelism & Scaling page summarizes the canonical large-scale topology: "vLLM supports large-scale deployment combining Data Parallel attention with Expert or Tensor Parallel MoE layers." (https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html)
7. **[T1]** The vLLM README does not advertise DeepEP by name, but its EP topology and listing of CUTLASS/TRTLLM-GEN/CuTeDSL are explicit. (https://github.com/vllm-project/vllm)

### SGLang

8. **[T1]** SGLang README advertises "tensor/pipeline/expert/data parallelism" as part of its fast runtime, plus DeepSeek-V3/R1 day-one support and "Deploying DeepSeek on GB200 NVL72 with PD and Large Scale EP" coverage. (https://github.com/sgl-project/sglang)
9. **[T1]** SGLang's expert-parallel design decouples MoE forward into "dispatch → pre-permute → core runner → post-permute → combine," explicitly modular. (https://docs.sglang.io/docs/advanced_features/expert_parallelism.md)
10. **[T1]** SGLang integrates DeepEP directly: "DeepEP, a communication library for efficient token shuffling in MoE models" — exposing both normal (prefill) and low-latency (decode) dispatch modes. (https://docs.sglang.io/docs/advanced_features/expert_parallelism.md)
11. **[T1]** SGLang integrates DeepSeek's EPLB: "SGLang integrates the Expert Parallelism Load Balancer (EPLB) from DeepSeek to address routing imbalances in MoE models". (https://docs.sglang.io/docs/advanced_features/expert_parallelism.md)
12. **[T1]** SGLang server flags expose the production knobs: `--ep-size`, `--moe-a2a-backend` (choices: `none`, `deepep`, `mooncake`, `nixl`, `mori`, `ascend_fuseep`, `flashinfer`), `--moe-runner-backend`, `--moe-dp-size`, `--moe-dense-tp-size`, `--deepep-mode` (`auto`/`normal`/`low_latency`), `--eplb-algorithm`, `--init-expert-location`, `--flashinfer-mxfp4-moe-precision`. GEMM backends include `--fp8-gemm-runner-backend` (`deep_gemm`/`flashinfer_trtllm`/`cutlass`/`triton`) and `--fp4-gemm-runner-backend` (`auto`/`cutlass`/`flashinfer_cudnn`). (https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py)
13. **[T2]** LMSYS team reports for DeepSeek-V3 with large-scale EP: "52.3k input tokens per second and 22.3k output tokens per second per node" at 2K input, prefill peaks "57,674, 54,543, and 50,302 tokens per second for prompt lengths of 1K, 2K, and 4K," decode "22,282 tokens/sec per node for 2K inputs—representing a 5.2× speedup over the TP16 baseline." Cost: "$0.20/1M output tokens, which is about one-fifth the cost of the official DeepSeek Chat API." EPLB delivers "a significant speedup of 1.49x (prefill) and 2.54x (decode)". (https://lmsys.org/blog/2025-05-05-large-scale-ep/)

### Hugging Face TGI

14. **[T1]** TGI's supported-model list includes the MoE families DeepSeek-V2, DeepSeek-V3, Llama 4, Mixtral, Phi-3.5-MoE, and Dbrx. (https://huggingface.co/docs/text-generation-inference/supported_models)
15. **[T1]** TGI's main README advertises only "Tensor Parallelism for faster inference on multiple GPUs," "Flash Attention," and "Paged Attention." It does not mention expert parallelism, fused MoE kernels, FlashInfer, or DeepEP. (https://github.com/huggingface/text-generation-inference) — TGI exposes MoE *models* but does not advertise dedicated MoE *infrastructure* the way vLLM and SGLang do.

### FlashInfer

16. **[T1]** FlashInfer ships "Fused MoE Kernels" supporting "FP8 and FP4 expert weights with block-wise scaling," with "Multiple Routing Methods: DeepSeek-V3, Llama-4, and standard top-k routing." (https://github.com/flashinfer-ai/flashinfer)
17. **[T1]** GEMM dtypes documented: "BF16 GEMM ... for SM10.0+ GPUs," "FP8 GEMM: Per-tensor and groupwise scaling," "FP4 GEMM: NVFP4 and MXFP4 matrix multiplication for Blackwell GPUs." Backends: "FlashAttention-2/3, cuDNN, CUTLASS, and TensorRT-LLM." (https://github.com/flashinfer-ai/flashinfer)
18. **[T1]** The fused_moe API exposes a CUTLASS path (`cutlass_fused_moe`) and a TRT-LLM path with three named entry points: `trtllm_fp4_block_scale_moe`, `trtllm_fp8_block_scale_moe`, `trtllm_fp8_per_tensor_scale_moe`. Helpers include `reorder_rows_for_gated_act_gemm`, `interleave_moe_weights_for_sm90_mixed_gemm`, `interleave_moe_scales_for_sm90_mixed_gemm`. No Triton MoE backend is listed in this reference. (https://docs.flashinfer.ai/api/fused_moe.html)

### DeepEP

19. **[T1]** DeepEP self-description: "a communication library tailored for Mixture-of-Experts (MoE) and expert parallelism (EP)" providing "high-throughput and low-latency all-to-all GPU kernels, which are also known as MoE dispatch and combine." (https://github.com/deepseek-ai/DeepEP)
20. **[T1]** Feature list: high-throughput NVLink + RDMA kernels; low-latency pure-RDMA kernels for decode; FP8 dispatch with BF16 combine; "Asymmetric-domain bandwidth forwarding ... NVLink-to-RDMA"; "Hook-based communication-computation overlapping without SM resource consumption"; SM-count control for normal kernels. (https://github.com/deepseek-ai/DeepEP)
21. **[T1]** Architectures: "Ampere (SM80), Hopper (SM90) GPUs, or other architectures with SM90 PTX ISA support"; CUDA 11.0+ for Ampere, CUDA 12.3+ for Hopper. README does not list Blackwell as officially supported. (https://github.com/deepseek-ai/DeepEP)
22. **[T1]** Normal-kernel measured bandwidth on H800 + CX7 InfiniBand, 4096 tokens, FP8 dispatch / BF16 combine: 8-EP intranode 153 GB/s dispatch / 158 GB/s combine over NVLink; 16-EP internode 43/43 GB/s; 32-EP 58/57 GB/s; 64-EP 51/50 GB/s over RDMA. (https://github.com/deepseek-ai/DeepEP)
23. **[T1]** Low-latency-kernel measured on H800 + CX7, 128 tokens, FP8 dispatch / BF16 combine: 8 EP — 77 us dispatch / 114 us combine; 16 EP — 118 us / 195 us; 256 EP — 194 us / 360 us. (https://github.com/deepseek-ai/DeepEP)

### State of fused MoE kernels in 2026

24. **[T1]** Production fused MoE in vLLM and SGLang routes through CUTLASS, TRT-LLM-Gen, and CuTeDSL — explicitly named in vLLM's README and exposed by SGLang flags. Triton remains a runner option in SGLang for FP8 GEMM but is not the default for FP4 paths. (https://github.com/vllm-project/vllm; https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py)
25. **[T1]** Block-scaled FP4 (NVFP4 / MXFP4) is shipped via FlashInfer's `trtllm_fp4_block_scale_moe` and is wired into SGLang via `--fp4-gemm-runner-backend` (`cutlass` / `flashinfer_cudnn`) and `--flashinfer-mxfp4-moe-precision`. FP4 GEMM is documented as Blackwell-targeted. (https://docs.flashinfer.ai/api/fused_moe.html; https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py; https://github.com/flashinfer-ai/flashinfer)
26. **[T1]** FP8 block-scale and per-tensor scale MoE are exposed in FlashInfer's API and selectable in SGLang via `--fp8-gemm-runner-backend` (`deep_gemm`/`flashinfer_trtllm`/`cutlass`/`triton`). (https://docs.flashinfer.ai/api/fused_moe.html; https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py)
27. **[T1]** All-to-all is now a swappable backend in SGLang: `--moe-a2a-backend` accepts `deepep`, `mooncake`, `nixl`, `mori`, `ascend_fuseep`, `flashinfer`. DeepEP is Hopper/Ampere-only per its README; `flashinfer` is the routing-aware path on FlashInfer-supported hardware. (https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/server_args.py; https://github.com/deepseek-ai/DeepEP)

## UNKNOWN

- Whether DeepEP officially supports Blackwell (SM100). The README only lists Ampere/Hopper plus "other architectures with SM90 PTX ISA support." [Source did not state]
- Whether vLLM uses DeepEP under the hood for its `--enable-expert-parallel` path. README and parallelism docs do not name DeepEP. [Source did not state]
- Whether HF TGI has any MoE-specific kernel optimization (fused expert GEMM, EP). README and supported-models page do not state. [Source did not state]
- Exact FlashInfer routing-method coverage for non-DeepSeek/non-Llama-4 MoEs (e.g., Qwen3-MoE, GPT-OSS) beyond "standard top-k". [Source did not state]
- Whether SGLang's `--moe-a2a-backend=flashinfer` reaches parity with `deepep` on Hopper for low-latency decode. [Source did not state]

## Direct quotes worth using verbatim

> "Mixture-of-Expert LLMs (e.g., Mixtral, DeepSeek-V3, Qwen-MoE, GPT-OSS)"
> — vLLM README, https://github.com/vllm-project/vllm [T1]

> "Optimized GEMM/MoE kernels for various precisions using CUTLASS, TRTLLM-GEN, CuTeDSL"
> — vLLM README, https://github.com/vllm-project/vllm [T1]

> "Tensor, pipeline, data, expert, and context parallelism for distributed inference"
> — vLLM README, https://github.com/vllm-project/vllm [T1]

> "vLLM supports large-scale deployment combining Data Parallel attention with Expert or Tensor Parallel MoE layers."
> — vLLM Parallelism & Scaling docs, https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html [T1]

> "DeepEP, a communication library for efficient token shuffling in MoE models"
> — SGLang Expert Parallelism docs, https://docs.sglang.io/docs/advanced_features/expert_parallelism.md [T1]

> "SGLang integrates the Expert Parallelism Load Balancer (EPLB) from DeepSeek to address routing imbalances in MoE models"
> — SGLang Expert Parallelism docs, https://docs.sglang.io/docs/advanced_features/expert_parallelism.md [T1]

> "a communication library tailored for Mixture-of-Experts (MoE) and expert parallelism (EP) ... high-throughput and low-latency all-to-all GPU kernels, which are also known as MoE dispatch and combine."
> — DeepEP README, https://github.com/deepseek-ai/DeepEP [T1]

> "Fused MoE Kernels ... FP8 and FP4 expert weights with block-wise scaling ... Multiple Routing Methods: DeepSeek-V3, Llama-4, and standard top-k routing"
> — FlashInfer README, https://github.com/flashinfer-ai/flashinfer [T1]

> "52.3k input tokens per second and 22.3k output tokens per second per node ... $0.20/1M output tokens, which is about one-fifth the cost of the official DeepSeek Chat API"
> — LMSYS large-scale EP blog, https://lmsys.org/blog/2025-05-05-large-scale-ep/ [T2]
