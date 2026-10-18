# Sources: Silicon, Memory, and Modern Inference

Generated from `src/sources/*.ts` by `src/sources/markdown.ts`. Do not edit by hand:
edit the per-section source file and run the dive tests with `-u`.

Tiers: Tier 0 is our own experiment (logged under `research/`). Tier 1 is official
documentation, a specification, a filing or source code pinned to a commit or tag.
Tier 2 is a vendor press release, blog, product page or keynote; performance figures
from Tier 2 are vendor claims and the page labels them as such. Tier 3 is third-party
analysis, an academic paper or trade press.

Claim registers with the evidence behind each figure, including every UNKNOWN, are in
`research/2026-10-refresh/`.

Total distinct sources: 231.

## Tier 1: official documentation, specification, filing or pinned source code

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| AWS | [Amazon EC2 accelerated computing instance specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) | 2026-10-17 | CapitalMarketsLens, FlashCacheTier, GraceBlackwellUltraServer, HeterogeneityFact, NvidiaBlackwell, NvidiaHopper |
| AWS | [Amazon FSx for Lustre performance: throughput to individual client instances](https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html) | 2026-10-17 | FlashCacheTier |
| AWS | [Amazon FSx for Lustre: SSD storage performance](https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html) | 2026-10-17 | FlashCacheTier |
| AWS | [Amazon FSx for Lustre: working with EFA-enabled file systems](https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html) | 2026-10-17 | FlashCacheTier |
| AWS | [Amazon S3 Express One Zone: high performance with directory buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html) | 2026-10-17 | FlashCacheTier |
| AWS | [AWS Neuron 2.32.0: NxD Inference MoE architecture deep dive](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html) | 2026-10-16 | MoeAndSparseActivation |
| AWS | [AWS Neuron: Amazon EC2 Trn2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html) | 2026-10-16 | HeterogeneityFact, MoeAndSparseActivation |
| AWS | [AWS Neuron: Amazon EC2 Trn3 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html) | 2026-10-16 | MoeAndSparseActivation |
| AWS | [AWS Neuron: Data Types](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-features/data-types.html) | 2026-10-17 | QuantizationAndPrecision |
| AWS | [AWS Neuron: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/jax/api-reference-guide/neuron-envvars.html) | 2026-10-16 | CapitalMarketsLens |
| AWS | [AWS Neuron: Neuron Graph Compiler overview (neuronx-cc)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/compiler/index.html) | 2026-10-16 | KernelExecutionLifecycle |
| AWS | [AWS Neuron: Neuron Kernel Interface (NKI) overview, "How NKI works"](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/index.html) | 2026-10-16 | KernelExecutionLifecycle |
| AWS | [AWS Neuron: NeuronCore-v3 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html) | 2026-10-16 | HeterogeneityFact |
| AWS | [AWS Neuron: NKI Library release notes](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nki-lib.html) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| AWS | [AWS Neuron: NKI Trainium/Inferentia2 Architecture Guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium_inferentia2_arch.html) | 2026-10-17 | KernelExecutionLifecycle |
| AWS | [AWS Neuron: NKI Trainium2 Architecture Guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html) | 2026-10-17 | KernelExecutionLifecycle |
| AWS | [AWS Neuron: Trainium2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html) | 2026-10-17 | HeterogeneityFact, KernelExecutionLifecycle, MoeAndSparseActivation, RooflineAndArithmeticIntensity, ThesisAndFraming |
| AWS | [AWS Neuron: Trainium3 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html) | 2026-10-17 | HeterogeneityFact, QuantizationAndPrecision, RooflineAndArithmeticIntensity, ThesisAndFraming |
| AWS | [AWS Neuron: What's New in the AWS Neuron SDK (releases 2.27.0 to 2.32.0)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html) | 2026-10-17 | MoeAndSparseActivation |
| AWS | [aws-graviton-getting-started README at commit 8b322a4](https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md) | 2026-10-16 | CapitalMarketsLens, GraceBlackwellUltraServer, HeterogeneityFact |
| AWS | [Capacity Blocks for ML: supported instance types and Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 2026-10-17 | GraceBlackwellUltraServer, NvidiaHopper |
| AWS | [Data persistence for Amazon EC2 instance store volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html) | 2026-10-17 | FlashCacheTier |
| AWS | [Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2 (EFA limitations)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html) | 2026-10-17 | CapitalMarketsLens |
| AWS | [Instance store temporary block storage for EC2 instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) | 2026-10-17 | FlashCacheTier |
| AWS | [Nitro Isolation Engine whitepaper (June 2026)](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/whitepapers/compliance/nitro-isolation-engine-whitepaper.pdf) | 2026-10-16 | CapitalMarketsLens |
| AWS | [SageMaker HyperPod: managed tiered KV cache and routing](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ray-kv-cache.html) | 2026-10-17 | FlashCacheTier |
| Bank for International Settlements | [BCBS d457: Minimum capital requirements for market risk (January 2019)](https://www.bis.org/bcbs/publ/d457.htm) | 2026-10-16 | CapitalMarketsLens |
| Bank of England (PRA) | [PRA sets out adjustments to its market risk internal model approach under Basel 3.1 (19 June 2026)](https://www.bankofengland.co.uk/news/2026/june/pra-adjustments-market-risk-internal-model-approach-under-basel31) | 2026-10-17 | CapitalMarketsLens |
| Cerebras Systems (SEC EDGAR) | [Cerebras Systems, Form S-1 (filed 2026-04-17)](https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm) | 2026-10-16 | HeterogeneityFact, ThesisAndFraming |
| CXL Consortium | [CXL Consortium press release, CXL 3.0 specification (2022-08-02)](https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.0-Specification-Release_FINAL-1.pdf) | 2026-10-16 | HighBandwidthFlash |
| Dao-AILab | [FlashAttention README at tag v2.8.3.post2 (FlashAttention-3 beta)](https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md) | 2026-10-17 | NvidiaHopper, RooflineAndArithmeticIntensity |
| Dao-AILab | [FlashAttention release fa4-v4.0.0.beta35 (FlashAttention-4 beta, 2026-10-14)](https://github.com/Dao-AILab/flash-attention/releases/tag/fa4-v4.0.0.beta35) | 2026-10-16 | RooflineAndArithmeticIntensity |
| DeepSeek | [DeepSeek API docs: Context Caching](https://api-docs.deepseek.com/guides/kv_cache) | 2026-10-17 | FlashCacheTier |
| DeepSeek | [DeepSeek API docs: Models and Pricing](https://api-docs.deepseek.com/quick_start/pricing) | 2026-10-17 | FlashCacheTier |
| DeepSeek-AI | [DeepEP README at tag v1.2.1 (V1 kernel performance tables)](https://github.com/deepseek-ai/DeepEP/blob/v1.2.1/README.md) | 2026-10-17 | MoeAndSparseActivation |
| European Commission | [Commission Delegated Regulation C(2026) 3647 of 4 June 2026: temporary relief measures and multipliers for own funds requirements for market risk](https://finance.ec.europa.eu/document/download/d7962418-d7d8-4d03-a999-ec760637a67c_en?filename=crr-delegated-act-2026-3647_en.pdf) | 2026-10-17 | CapitalMarketsLens |
| Huge and Savine (GitHub) | [differential-machine-learning/appendices at commit 585675e](https://github.com/differential-machine-learning/appendices/tree/585675ef05debbb9bb727d43f26ffb29e32ff25f) | 2026-10-16 | CapitalMarketsLens |
| Huge and Savine (GitHub) | [differential-machine-learning/notebooks at commit 155055e](https://github.com/differential-machine-learning/notebooks/tree/155055eb891d151533530b70d039ad636ffeaf4b) | 2026-10-17 | CapitalMarketsLens |
| Hugging Face | [deepseek-ai/DeepSeek-V3 config.json at revision e815299](https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json) | 2026-10-17 | FlashCacheTier, HighBandwidthFlash, MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [deepseek-ai/DeepSeek-V3 README at revision e815299](https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/README.md) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [deepseek-ai/DeepSeek-V3.2 files at revision a7e62ac (689.5 GB of safetensors)](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/tree/a7e62ac04ecb2c0a54d736dc46601c5606cf10a6) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [deepseek-ai/DeepSeek-V4-Flash-0731 config.json at revision 7872f01](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/blob/7872f01b1d1fe23eabc4c98b48bffcef5a386062/config.json) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [deepseek-ai/DeepSeek-V4-Pro-0813 config.json at revision 72e1d32 (expert_dtype)](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/72e1d3230f6c080a530b0a1d46f8eb4602340597/config.json) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [deepseek-ai/DeepSeek-V4-Pro-0813 README at revision 72e1d32 (vLLM serve command)](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/72e1d3230f6c080a530b0a1d46f8eb4602340597/README.md) | 2026-10-17 | QuantizationAndPrecision |
| Hugging Face | [deepseek-ai/DeepSeek-V4.1-Flash README at revision 314113f (890 bytes per token)](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/314113f8a7dadb388215396ba5fbee2c610a04d6/README.md) | 2026-10-17 | FlashCacheTier, MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [meta-llama/Llama-3.1-70B model metadata at sha 349b2dd (70,553,706,496 parameters)](https://huggingface.co/api/models/meta-llama/Llama-3.1-70B) | 2026-10-16 | FlashCacheTier |
| Hugging Face | [MiniMaxAI/MiniMax-M3-MXFP8 config.json at revision c5454eb (mxfp8, weight_block_size [1, 32])](https://huggingface.co/MiniMaxAI/MiniMax-M3-MXFP8/blob/c5454eb03678d8710e54a4e0fc681b9f3b4a3dba/config.json) | 2026-10-17 | QuantizationAndPrecision |
| Hugging Face | [mistralai/Mixtral-8x7B-v0.1 config.json at revision fc7ac94](https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/fc7ac94680e38d7348cfa806e51218e6273104b0/config.json) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [moonshotai/Kimi-K2-Instruct config.json at revision fd1984e](https://huggingface.co/moonshotai/Kimi-K2-Instruct/blob/fd1984e2b7a3350dbf7305fe73a4ede25c14de50/config.json) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [moonshotai/Kimi-K2-Instruct README at revision fd1984e](https://huggingface.co/moonshotai/Kimi-K2-Instruct/blob/fd1984e2b7a3350dbf7305fe73a4ede25c14de50/README.md) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [moonshotai/Kimi-K2.5 README at revision 4d01dfe (native INT4 quantization)](https://huggingface.co/moonshotai/Kimi-K2.5/blob/4d01dfe0332d63057c186e0b262165819efb6611/README.md) | 2026-10-17 | QuantizationAndPrecision |
| Hugging Face | [moonshotai/Kimi-K3 README at revision f831ab6 (native MXFP4 quantization)](https://huggingface.co/moonshotai/Kimi-K3/blob/f831ab66814297da540d832a5235f8e904f29d06/README.md) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [nvidia/DeepSeek-V3.2-NVFP4 files at revision 7c0f62c (415.1 GB of safetensors)](https://huggingface.co/nvidia/DeepSeek-V3.2-NVFP4/tree/7c0f62c6da1da0c81c6e097010cc55854d206812) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [openai/gpt-oss-120b config.json at revision b5c939d (quantization_config)](https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/config.json) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| Hugging Face | [openai/gpt-oss-120b README at revision b5c939d](https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/README.md) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [Qwen/Qwen3-235B-A22B config.json at revision 8efa617](https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/8efa61729e24bd65b1d152b5ab5409052aa80e65/config.json) | 2026-10-16 | FlashCacheTier |
| Hugging Face | [Qwen/Qwen3-235B-A22B README at revision 8efa617 (22B activated)](https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/8efa61729e24bd65b1d152b5ab5409052aa80e65/README.md) | 2026-10-17 | FlashCacheTier, MoeAndSparseActivation |
| Hugging Face | [Qwen/Qwen3-Next-80B-A3B-Instruct README at revision 9c7f2fb](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct/blob/9c7f2fbe84465e40164a94cc16cd30b6999b0cc7/README.md) | 2026-10-17 | MoeAndSparseActivation |
| Hugging Face | [Qwen/Qwen3.8-2.4T-A95B README at revision 207bd68](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/207bd685a7e3696cfaff12ded7c6a7ea0f88c996/README.md) | 2026-10-17 | MoeAndSparseActivation |
| Intel | [Intel Xeon 6 Product Brief (PCIe 5.0 at 32 GT/s per lane)](https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html) | 2026-10-16 | CapitalMarketsLens, FlashCacheTier |
| ISDA | [ISDA Publishes ISDA SIMM Methodology, Version 2.8+2512 (12 June 2026)](https://www.isda.org/2026/06/12/isda-publishes-isda-simm-methodology-version-2-8-2512/) | 2026-10-16 | CapitalMarketsLens |
| ISDA | [ISDA SIMM Methodology, version 2.8+2512 (public PDF)](https://www.isda.org/a/hhkiE/ISDA-SIMM_v2.82512_PUBLIC.pdf) | 2026-10-16 | CapitalMarketsLens |
| JEDEC | [JEDEC and Industry Leaders Collaborate to Release JESD270-4 HBM4 Standard (2025-04-16)](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing) | 2026-10-16 | HighBandwidthFlash |
| Linux kernel | [Linux kernel Documentation/arch/x86/xstate.rst at tag v6.19 (AMX TILE_DATA, ARCH_REQ_XCOMP_PERM)](https://github.com/torvalds/linux/blob/v6.19/Documentation/arch/x86/xstate.rst) | 2026-10-17 | KernelExecutionLifecycle |
| llm-d | [llm-d tiered prefix cache guides and metrics docs at tag v0.10.0](https://github.com/llm-d/llm-d/blob/v0.10.0/guides/tiered-prefix-cache/README.md) | 2026-10-17 | FlashCacheTier |
| LLVM | [AArch64SchedNeoverseV2.td at tag llvmorg-19.1.0 (MispredictPenalty)](https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/AArch64/AArch64SchedNeoverseV2.td) | 2026-10-17 | HeterogeneityFact, ThesisAndFraming |
| LLVM | [Clang amxfp16intrin.h at tag llvmorg-23.1.3 (TDPFP16PS)](https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxfp16intrin.h) | 2026-10-17 | KernelExecutionLifecycle |
| LLVM | [Clang amxintrin.h at tag llvmorg-23.1.3 (tile size, LDTILECFG, TILELOADD, TDPBF16PS)](https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxintrin.h) | 2026-10-17 | KernelExecutionLifecycle, QuantizationAndPrecision, ThesisAndFraming |
| LLVM | [LLVM APFloat.cpp at tag llvmorg-23.1.3: fltSemantics (max exponent, precision, size) for IEEE, BF16, TF32, FP8 and FP4](https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Support/APFloat.cpp#L71-L105) | 2026-10-17 | QuantizationAndPrecision |
| LLVM | [LLVM X86.td at tag llvmorg-23.1.3 (per-generation feature lists: SPR, GNR, DMR)](https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86.td#L1243-L1310) | 2026-10-16 | KernelExecutionLifecycle |
| LLVM | [LLVM X86RegisterInfo.td at tag llvmorg-23.1.3 (tile registers TMM0 to TMM7)](https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86RegisterInfo.td) | 2026-10-17 | KernelExecutionLifecycle |
| LLVM | [X86SchedSapphireRapids.td at tag llvmorg-19.1.0 (MispredictPenalty)](https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86SchedSapphireRapids.td) | 2026-10-17 | HeterogeneityFact, ThesisAndFraming |
| LLVM | [X86ScheduleZnver4.td at tag llvmorg-19.1.0 (MispredictPenalty)](https://github.com/llvm/llvm-project/blob/llvmorg-19.1.0/llvm/lib/Target/X86/X86ScheduleZnver4.td) | 2026-10-17 | HeterogeneityFact, ThesisAndFraming |
| LMCache | [LMCache local storage backend docs at tag v0.5.6 (per-GPU disk paths, O_DIRECT, example chunk size)](https://github.com/LMCache/LMCache/blob/v0.5.6/docs/source/kv_cache/storage_backends/local_storage.rst) | 2026-10-17 | FlashCacheTier |
| Micron | [Micron 9650 NVMe SSD product brief (key specifications and test conditions)](https://www.micron.com/content/dam/micron/global/public/products/storage/ssds/data-center/9650/9650-nvme-ssd-product-brief.pdf) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [CUDA C++ Best Practices Guide (CUDA 13.4): Occupancy](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html) | 2026-10-17 | HeterogeneityFact, NvidiaHopper, ThesisAndFraming |
| NVIDIA | [CUDA GPU compute capability list](https://developer.nvidia.com/cuda-gpus) | 2026-10-16 | NvidiaBlackwell, NvidiaCompilersAndTooling, NvidiaHopper |
| NVIDIA | [CUDA Programming Guide v13.4.2: Advanced Kernel Programming (Hardware Multithreading)](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html) | 2026-10-17 | KernelExecutionLifecycle |
| NVIDIA | [CUDA Programming Guide v13.4.2: Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html) | 2026-10-17 | KernelExecutionLifecycle |
| NVIDIA | [CUDA Programming Guide v13.4.2: Compute Capabilities](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html) | 2026-10-17 | KernelExecutionLifecycle, NvidiaBlackwell, NvidiaCompilersAndTooling, NvidiaHopper, QuantizationAndPrecision |
| NVIDIA | [CUDA Programming Guide v13.4.2: CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html) | 2026-10-17 | KernelExecutionLifecycle |
| NVIDIA | [CUDA Programming Guide v13.4.2: Programmatic Dependent Launch and Synchronization](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/programmatic-dependent-launch.html) | 2026-10-17 | KernelExecutionLifecycle |
| NVIDIA | [CUDA Programming Guide v13.4.2: Programming Model (thread blocks, warps, on-chip memory)](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html) | 2026-10-17 | KernelExecutionLifecycle |
| NVIDIA | [CUDA Programming Guide v13.4.2: Writing Tile Kernels](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-tile-kernels.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [CuTe DSL: JIT compilation options (keep-ptx, ptxas-options)](https://docs.nvidia.com/cutlass/latest/media/docs/pythonDSL/cute_dsl_general/dsl_jit_compilation_options.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [cuTile Python quickstart and release notes (1.6.0, 2026-09-09)](https://docs.nvidia.com/cuda/cutile-python/quickstart.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [CUTLASS CHANGELOG at tag v4.8.0](https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md) | 2026-10-17 | NvidiaBlackwell, NvidiaCompilersAndTooling |
| NVIDIA | [CUTLASS example 92_blackwell_moe_gemm at tag v4.8.0](https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [CUTLASS README at tag v4.8.0](https://github.com/NVIDIA/cutlass/blob/v4.8.0/README.md) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [DeepSeek-V3.2-NVFP4 model card at revision 7c0f62c (post-training quantization, evaluation)](https://huggingface.co/nvidia/DeepSeek-V3.2-NVFP4/blob/7c0f62c6da1da0c81c6e097010cc55854d206812/README.md) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| NVIDIA | [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [NVIDIA Blackwell Tuning Guide (CUDA 13.4)](https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html) | 2026-10-17 | KernelExecutionLifecycle, NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [NVIDIA Dynamo README at tag v1.5.1](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md) | 2026-10-16 | MoeAndSparseActivation |
| NVIDIA | [NVIDIA Form 8-K exhibit 99.1, Q2 fiscal 2027 results (2026-08-26)](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27pr.htm) | 2026-10-16 | GraceBlackwellUltraServer, NvidiaBlackwell |
| NVIDIA | [NVIDIA GPUDirect Storage Overview Guide v1.19.1](https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [NVIDIA GPUDirect Storage Release Notes v1.19.1](https://docs.nvidia.com/gpudirect-storage/release-notes/index.html) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [NVIDIA Hopper Tuning Guide (CUDA 13.4)](https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html) | 2026-10-17 | KernelExecutionLifecycle, NvidiaHopper |
| NVIDIA | [NVIDIA Multi-Instance GPU User Guide: Concepts](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html) | 2026-10-16 | CapitalMarketsLens |
| NVIDIA | [NVIDIA/storage-lender README at commit 1630d17 (SCADA control path)](https://github.com/NVIDIA/storage-lender/blob/1630d17b50b7130dee27c1f71361ad5af4e434bb/README.md) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)](https://docs.nvidia.com/cuda/parallel-thread-execution/index.html) | 2026-10-17 | HeterogeneityFact, KernelExecutionLifecycle, NvidiaBlackwell, NvidiaHopper, QuantizationAndPrecision, ThesisAndFraming |
| NVIDIA | [TensorRT Quick Start Guide: What Is TensorRT?](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [TensorRT-LLM examples/wide_ep at tag v1.2.1](https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep) | 2026-10-16 | MoeAndSparseActivation, NvidiaCompilersAndTooling, QuantizationAndPrecision |
| NVIDIA | [TensorRT-LLM examples/wide_ep README at tag v1.2.1](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/examples/wide_ep/README.md) | 2026-10-17 | GraceBlackwellUltraServer, MoeAndSparseActivation, NvidiaCompilersAndTooling |
| NVIDIA | [TensorRT-LLM README at tag v1.2.1](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/README.md) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [TensorRT-LLM release v0.12.0 notes (2024-08-29)](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.12.0) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [TensorRT-LLM release v0.21.0 notes](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v0.21.0) | 2026-10-17 | GraceBlackwellUltraServer, MoeAndSparseActivation |
| NVIDIA | [TensorRT-LLM release v1.0.0 notes (2025-09-24)](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0) | 2026-10-17 | MoeAndSparseActivation, NvidiaCompilersAndTooling, QuantizationAndPrecision |
| NVIDIA | [TensorRT-LLM release v1.2.1 (2026-04-20)](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.2.1) | 2026-10-17 | NvidiaCompilersAndTooling |
| NVIDIA | [TensorRT-LLM tensorrt_llm/llmapi/llm_args.py at tag v1.2.1 (MoE parallel sizes)](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/llmapi/llm_args.py) | 2026-10-17 | MoeAndSparseActivation |
| NVIDIA | [TensorRT-LLM tensorrt_llm/mapping.py at tag v1.2.1 (MoE world size check)](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/mapping.py) | 2026-10-17 | MoeAndSparseActivation |
| NVIDIA Dynamo | [ai-dynamo/dynamo KVBM configuration and KV cache offloading docs at tag v1.5.1](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/reference/components/kvbm-configuration.mdx) | 2026-10-17 | FlashCacheTier |
| NVIDIA Dynamo | [ai-dynamo/dynamo lib/bindings/kvbm/src/block_manager.rs at tag v1.5.1 (disk offload filter, page_size)](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/lib/bindings/kvbm/src/block_manager.rs) | 2026-10-17 | FlashCacheTier |
| NVIDIA Dynamo | [ai-dynamo/dynamo lib/kv-router/src/scheduling/config.rs at tag v1.5.1 (cache hit weights)](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/lib/kv-router/src/scheduling/config.rs) | 2026-10-17 | FlashCacheTier |
| NVIDIA Dynamo | [ai-dynamo/nixl storage and network plugins at tag v1.5.0](https://github.com/ai-dynamo/nixl/tree/v1.5.0/src/plugins) | 2026-10-17 | FlashCacheTier |
| OCC | [News Release 2026-16: Agencies Request Comment on Proposals to Modernize the Regulatory Capital Framework (19 March 2026)](https://www.occ.gov/news-issuances/news-releases/2026/nr-ia-2026-16.html) | 2026-10-17 | CapitalMarketsLens |
| Open Compute Project | [High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)](https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf) | 2026-10-17 | FlashCacheTier, HighBandwidthFlash |
| Open Compute Project | [OCP Microscaling Formats (MX) Specification v1.0](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf) | 2026-10-17 | QuantizationAndPrecision |
| OpenFabrics Interfaces Working Group | [libfabric fi_efa(7) man page at commit 24fa1dc (EFA provider capabilities)](https://github.com/ofiwg/libfabric/blob/24fa1dcfaa5cd10fc3d5ca5ea94690e9925c6848/man/fi_efa.7.md) | 2026-10-16 | CapitalMarketsLens |
| PyTorch | [PyTorch v2.14.1 aten/src/ATen/cuda/CUDABlas.cpp: cublasGemmEx and cublasLtMatmul calls](https://github.com/pytorch/pytorch/blob/v2.14.1/aten/src/ATen/cuda/CUDABlas.cpp) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 aten/src/ATen/native/Linear.cpp: linear lowers to addmm](https://github.com/pytorch/pytorch/blob/v2.14.1/aten/src/ATen/native/Linear.cpp#L106-L129) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/__init__.py: torch.compile signature, backend="inductor"](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/__init__.py#L3019) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/__init__.py: list_mode_options, "max-autotune"](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/__init__.py#L384-L388) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/config.py: max_autotune_gemm_backends](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/config.py#L637-L649) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/kernel/bmm.py: tuned_bmm](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/bmm.py#L230) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/kernel/mm_common.py: _use_small_mm_pointwise](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm_common.py#L197-L215) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/kernel/mm_grouped.py: tuned_grouped_mm and the CuTe DSL template](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm_grouped.py#L519) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/kernel/mm.py: tuned_mm, tuned_addmm, tuned_int_mm, tuned_scaled_mm](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/kernel/mm.py) | 2026-10-17 | NvidiaCompilersAndTooling |
| PyTorch | [PyTorch v2.14.1 torch/_inductor/utils.py: use_triton_template, use_cutlass_template, use_aten_gemm_kernels](https://github.com/pytorch/pytorch/blob/v2.14.1/torch/_inductor/utils.py) | 2026-10-17 | NvidiaCompilersAndTooling |
| Sandisk | [Future FWD: Sandisk 2025 Investor Day presentation (2025-02-11)](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/corporate/Sandisk-Investor-Day_2025.pdf) | 2026-10-17 | HighBandwidthFlash |
| SGLang | [SGLang HiCache design and best practices at tag v0.5.21](https://github.com/sgl-project/sglang/blob/v0.5.21/docs/docs/advanced_features/hicache_design.mdx) | 2026-10-17 | FlashCacheTier |
| SGLang | [SGLang python/sglang/srt/arg_groups/fields/exec_.py at tag v0.5.21 (--moe-a2a-backend choices)](https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/exec_.py) | 2026-10-16 | MoeAndSparseActivation |
| Triton | [Introduction to Gluon tutorial at Triton tag v3.8.0](https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/gluon/01-intro.py) | 2026-10-17 | NvidiaCompilersAndTooling |
| Triton | [Triton 3.8.0 release notes (2026-08-28)](https://github.com/triton-lang/triton/releases/tag/v3.8.0) | 2026-10-17 | NvidiaCompilersAndTooling |
| Triton | [Triton tutorial: Matrix Multiplication (triton.autotune and triton.Config)](https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html) | 2026-10-17 | NvidiaCompilersAndTooling |
| UXL Foundation | [oneDNN src/cpu/x64/cpu_isa_traits.cpp at tag v3.13.4, lines 357-374 (AMX permission request)](https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/cpu/x64/cpu_isa_traits.cpp#L357-L374) | 2026-10-17 | KernelExecutionLifecycle |
| vLLM | [vLLM kv_offload metrics (offloading/metrics.py) at tag v0.31.0](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/offloading/metrics.py) | 2026-10-17 | FlashCacheTier |
| vLLM | [vLLM vllm/config/cache.py at tag v0.31.0 (DEFAULT_BLOCK_SIZE)](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py) | 2026-10-17 | FlashCacheTier |
| vLLM | [vLLM vllm/config/kernel.py at tag v0.31.0 (MoEBackend values)](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/kernel.py#L118-L141) | 2026-10-17 | MoeAndSparseActivation, QuantizationAndPrecision |
| vLLM | [vLLM vllm/engine/arg_utils.py at tag v0.31.0 (--enable-expert-parallel)](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/engine/arg_utils.py) | 2026-10-16 | MoeAndSparseActivation |
| vLLM project | [vLLM docs/features/batch_invariance.md at tag v0.31.0](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/batch_invariance.md) | 2026-10-16 | CapitalMarketsLens |

## Tier 2: vendor press release, blog, product page or keynote

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| AMD | [AMD Instinct MI355X GPU](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) | 2026-10-17 | QuantizationAndPrecision, RooflineAndArithmeticIntensity |
| AMD | [AMD Solarflare X4 Low Latency Using SDCI (white paper, October 2025, Rev 1)](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/x4-sdci-whitepaper.pdf) | 2026-10-17 | CapitalMarketsLens |
| AWS | [Amazon EC2 M8a instances](https://aws.amazon.com/ec2/instance-types/m8a/) | 2026-10-17 | HeterogeneityFact |
| AWS | [Amazon EC2 M8i instances](https://aws.amazon.com/ec2/instance-types/m8i/) | 2026-10-17 | HeterogeneityFact |
| AWS | [Amazon EC2 P5 instances](https://aws.amazon.com/ec2/instance-types/p5/) | 2026-10-17 | NvidiaHopper |
| AWS | [Amazon EC2 P6 instances](https://aws.amazon.com/ec2/instance-types/p6/) | 2026-10-17 | FlashCacheTier, GraceBlackwellUltraServer, NvidiaBlackwell |
| AWS | [Amazon EC2 P6e-GB300 UltraServers (NVIDIA GB300 NVL72) generally available](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available) | 2026-10-17 | GraceBlackwellUltraServer, NvidiaBlackwell |
| AWS | [Amazon EC2 Trn3 instances](https://aws.amazon.com/ec2/instance-types/trn3/) | 2026-10-17 | FlashCacheTier, HeterogeneityFact, MoeAndSparseActivation, QuantizationAndPrecision |
| AWS | [Announcing up to 45% price reduction for Amazon EC2 NVIDIA GPU-accelerated instances](https://aws.amazon.com/blogs/aws/announcing-up-to-45-price-reduction-for-amazon-ec2-nvidia-gpu-accelerated-instances/) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| AWS | [AWS Nitro Isolation Engine: Formally verifying the hypervisor in the AWS Nitro System (2026-06-11)](https://aws.amazon.com/blogs/compute/aws-nitro-isolation-engine-formally-verifying-the-hypervisor-in-the-aws-nitro-system/) | 2026-10-16 | CapitalMarketsLens |
| AWS | [Managed Tiered KV Cache and Intelligent Routing for Amazon SageMaker HyperPod (2025-11-26)](https://aws.amazon.com/blogs/machine-learning/managed-tiered-kv-cache-and-intelligent-routing-for-amazon-sagemaker-hyperpod/) | 2026-10-17 | FlashCacheTier |
| AWS | [SageMaker HyperPod now supports Managed tiered KV cache and intelligent routing (2025-11-26)](https://aws.amazon.com/about-aws/whats-new/2025/11/sagemaker-hyperpod-managed-tiered-kv-cache) | 2026-10-17 | FlashCacheTier |
| AWS | [What's New: Amazon EC2 M8azn instances generally available (2026-02-12)](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-m8azn-instances-generally-available/) | 2026-10-16 | CapitalMarketsLens |
| Cerebras | [Cerebras inference docs: Models overview](https://inference-docs.cerebras.ai/models/overview) | 2026-10-16 | MoeAndSparseActivation |
| Cerebras | [Cerebras Systems Unveils World's Fastest AI Chip with Whopping 4 Trillion Transistors (WSE-3, 2024-03-13)](https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine) | 2026-10-17 | HeterogeneityFact |
| Cerebras | [Introducing Cerebras Inference: AI at Instant Speed (2024-08-27)](https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed) | 2026-10-16 | HeterogeneityFact, MoeAndSparseActivation, ThesisAndFraming |
| Cerebras | [Supercharge your HPC Research with the Cerebras SDK](https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk) | 2026-10-16 | HeterogeneityFact, ThesisAndFraming |
| DeepSeek-AI | [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437) | 2026-10-17 | FlashCacheTier, HighBandwidthFlash, MoeAndSparseActivation, QuantizationAndPrecision, ThesisAndFraming |
| Groq | [Groq and Nvidia Enter Non-Exclusive Inference Technology Licensing Agreement (2025-12-24)](https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale) | 2026-10-16 | HeterogeneityFact, MoeAndSparseActivation, ThesisAndFraming |
| Groq | [GroqCloud docs: Models](https://console.groq.com/docs/models) | 2026-10-16 | MoeAndSparseActivation |
| Kioxia | [Kioxia Announces KIOXIA GP1 Series Super High IOPS SSDs for AI Applications (2026-08-03)](https://americas.kioxia.com/en-us/business/news/2026/ssd-20260803-1.html) | 2026-10-17 | FlashCacheTier |
| Kioxia | [KIOXIA Announces New SSD Model Optimized for AI GPU-Initiated Workloads (2026-03-16)](https://americas.kioxia.com/en-us/business/news/2026/ssd-20260316-1.html) | 2026-10-17 | FlashCacheTier |
| Meta | [The Llama 3 Herd of Models (arXiv:2407.21783), Table 3: layers, heads and key/value heads](https://arxiv.org/abs/2407.21783) | 2026-10-17 | FlashCacheTier |
| Meta | [The Llama 4 herd (Llama 4 Scout and Maverick announcement)](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) | 2026-10-16 | MoeAndSparseActivation |
| Micron | [Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin, PCIe Gen6 SSD and SOCAMM2 (2026-03-16)](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx) | 2026-10-16 | HighBandwidthFlash |
| Mistral AI | [Mixtral of experts](https://mistral.ai/news/mixtral-of-experts/) | 2026-10-17 | MoeAndSparseActivation |
| Nebius | [Nebius and WEKA benchmark shared KV cache for agentic inference on NVIDIA HGX B300 (2026-09-24)](https://nebius.com/blog/posts/nebius-weka-shared-kv-cache-benchmark-hgx-b300) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [As AI Increases Demands on Memory, Storage Steps Up (2026-08-04; Storage-Next, SCADA)](https://blogs.nvidia.com/blog/ai-storage-fms/) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [AWS and NVIDIA to Deliver 2 Million Additional GPUs (2026-08-26)](https://nvidianews.nvidia.com/news/aws-and-nvidia-to-deliver-2-million-additional-gpus-and-next-generation-infrastructure-for-agentic-and-physical-ai) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [Full-Stack Optimizations for Agentic Inference with Dynamo (in-repo blog at Dynamo tag v1.5.1)](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/blog/2026/agentic-inference-optimizations.mdx) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [GTC 2026 live updates (Feynman, Rosa, Kyber)](https://blogs.nvidia.com/blog/gtc-2026-news/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [How NVIDIA GB200 NVL72 and NVIDIA Dynamo Boost Inference Performance for MoE Models](https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/) | 2026-10-17 | GraceBlackwellUltraServer, MoeAndSparseActivation |
| NVIDIA | [Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/) | 2026-10-17 | GraceBlackwellUltraServer, KernelExecutionLifecycle, MoeAndSparseActivation, NvidiaBlackwell, NvidiaHopper, RooflineAndArithmeticIntensity |
| NVIDIA | [Inside NVIDIA Groq 3 LPX: The Low-Latency Inference Accelerator for the NVIDIA Vera Rubin Platform (2026-03-16)](https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/) | 2026-10-17 | HeterogeneityFact, MoeAndSparseActivation, RooflineAndArithmeticIntensity, ThesisAndFraming |
| NVIDIA | [Introducing NVFP4 for Efficient and Accurate Low-Precision Inference](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/) | 2026-10-17 | HeterogeneityFact, MoeAndSparseActivation, NvidiaBlackwell, QuantizationAndPrecision |
| NVIDIA | [Introducing NVIDIA BlueField-4-Powered Inference Context Memory Storage Platform (G1 to G4 tiers, G3.5)](https://developer.nvidia.com/blog/introducing-nvidia-bluefield-4-powered-inference-context-memory-storage-platform-for-the-next-frontier-of-ai/) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [NVIDIA Blackwell architecture](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/) | 2026-10-16 | CapitalMarketsLens, GraceBlackwellUltraServer, NvidiaBlackwell |
| NVIDIA | [NVIDIA BlueField data processing units (BlueField-4 800 Gb/s, BlueField-3 400 Gb/s)](https://www.nvidia.com/en-us/networking/products/data-processing-unit/) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [NVIDIA BlueField-4 Powers New Class of AI-Native Storage Infrastructure (CES, January 2026)](https://nvidianews.nvidia.com/_gallery/download_pdf/695c3d883d6332559a6a627d/) | 2026-10-17 | FlashCacheTier |
| NVIDIA | [NVIDIA DGX B200](https://www.nvidia.com/en-us/data-center/dgx-b200/) | 2026-10-16 | FlashCacheTier, MoeAndSparseActivation, NvidiaBlackwell, RooflineAndArithmeticIntensity |
| NVIDIA | [NVIDIA GB200 NVL72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) | 2026-10-17 | GraceBlackwellUltraServer, MoeAndSparseActivation, NvidiaBlackwell |
| NVIDIA | [NVIDIA GB300 NVL72](https://www.nvidia.com/en-us/data-center/gb300-nvl72/) | 2026-10-17 | GraceBlackwellUltraServer, MoeAndSparseActivation, NvidiaBlackwell, RooflineAndArithmeticIntensity, ThesisAndFraming |
| NVIDIA | [NVIDIA Grace CPU page (Vera CPU: SOCAMM LPDDR5X, 1.2 TB/s, 1.5 TB per CPU)](https://www.nvidia.com/en-us/data-center/grace-cpu/) | 2026-10-16 | HighBandwidthFlash |
| NVIDIA | [NVIDIA Grace CPU Superchip (Grace CPU C1 and Superchip specifications)](https://www.nvidia.com/en-us/data-center/grace-cpu-superchip/) | 2026-10-17 | GraceBlackwellUltraServer |
| NVIDIA | [NVIDIA Groq 3 LPX Now in Full Production With World-Class Speed for Agentic AI (2026-08-24)](https://nvidianews.nvidia.com/news/nvidia-groq-3-lpx-now-in-full-production-with-world-class-speed-for-agentic-ai) | 2026-10-17 | HeterogeneityFact, MoeAndSparseActivation, ThesisAndFraming |
| NVIDIA | [NVIDIA H100 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h100/) | 2026-10-16 | FlashCacheTier, KernelExecutionLifecycle, NvidiaHopper, RooflineAndArithmeticIntensity |
| NVIDIA | [NVIDIA H200 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h200/) | 2026-10-17 | FlashCacheTier, KernelExecutionLifecycle, MoeAndSparseActivation, NvidiaBlackwell, NvidiaHopper, QuantizationAndPrecision, RooflineAndArithmeticIntensity, ThesisAndFraming |
| NVIDIA | [NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)](https://www.nvidia.com/en-us/data-center/hgx/) | 2026-10-17 | HeterogeneityFact, HighBandwidthFlash, NvidiaBlackwell, QuantizationAndPrecision, RooflineAndArithmeticIntensity |
| NVIDIA | [NVIDIA Hopper Architecture In-Depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) | 2026-10-17 | KernelExecutionLifecycle, NvidiaHopper, RooflineAndArithmeticIntensity, ThesisAndFraming |
| NVIDIA | [NVIDIA Hopper in Full Production (2022-09-20)](https://nvidianews.nvidia.com/news/nvidia-hopper-in-full-production) | 2026-10-16 | NvidiaHopper |
| NVIDIA | [NVIDIA NVLink-C2C](https://www.nvidia.com/en-us/data-center/nvlink-c2c/) | 2026-10-17 | GraceBlackwellUltraServer |
| NVIDIA | [NVIDIA Supercharges Hopper, the World's Leading AI Computing Platform (2023-11-13)](https://nvidianews.nvidia.com/news/nvidia-supercharges-hopper-the-worlds-leading-ai-computing-platform) | 2026-10-16 | NvidiaHopper |
| NVIDIA | [NVIDIA Vera Rubin NVL72](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | 2026-10-17 | GraceBlackwellUltraServer, NvidiaBlackwell, RooflineAndArithmeticIntensity |
| SambaNova | [Introducing the SN50 RDU: Purpose-Built for Agentic Inference (2026-02-24)](https://sambanova.ai/blog/introducing-the-sn50-rdu-purpose-built-for-agentic-inference) | 2026-10-16 | MoeAndSparseActivation |
| Samsung | [Samsung Ships Industry-First Commercial HBM4 With Ultimate Performance for AI Computing (2026-02-12)](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4-with-ultimate-performance-for-ai-computing) | 2026-10-16 | HighBandwidthFlash |
| Sandisk | [HBF Fact Sheet (Tech Brief, July 2025)](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/collateral/company/Sandisk-HBF-Fact-Sheet.pdf) | 2026-10-17 | FlashCacheTier, HighBandwidthFlash |
| Sandisk | [Sandisk 2026 Investor Day (2026-08-13), transcript of company presentations published by Stock Analysis](https://stockanalysis.com/stocks/sndk/transcripts/708061-investor-day-2026/) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Sandisk and SK hynix Advance Global Standardization of High Bandwidth Flash with Release of First OCP Technical Specification (2026-08-03)](https://www.sandisk.com/company/newsroom/press-releases/2026/2026-08-03-Sandisk-and-sk-hynix-advance-global-standardization-of-hbf) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Sandisk to Collaborate with SK hynix to Drive Standardization of High-Bandwidth Flash Memory Technology (2025-08-06)](https://www.sandisk.com/company/newsroom/press-releases/2025/2025-08-06-sandisk-to-collaborate-with-sk-hynix-to-drive-standardization-of-high-bandwidth-flash-memory-technology) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | ["Memory-Centric Server Systems Are the Future": SK hynix Presents Its Next-Generation AI Infrastructure Vision at OCP Global Summit 2026 (2026-10-16)](https://news.skhynix.com/en/ocp-global-summit-2026/) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | [SK AI Summit 2025: SK hynix Unveils AI Memory Creator Vision (AI-N P, 2025-11-20)](https://news.skhynix.com/sk-hynix-redefines-its-vision-at-sk-ai-summit-2025-from-ai-memory-provider-to-creator/) | 2026-10-17 | FlashCacheTier |
| SK hynix | [SK hynix HBM4 product page](https://product.skhynix.com/products/dram/hbm/hbm4.go) | 2026-10-16 | HighBandwidthFlash |
| SK hynix | [SK hynix Presents Next Generation NAND Storage Product Strategy at OCP 2025 (2025-10-27)](https://news.skhynix.com/en/sk-hynix-presents-next-generation-nand-storage-product-strategy-at-ocp-2025/) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | [SK hynix Ships Samples of 12-Layer Next-Gen HBM4E (2026-06-18)](https://news.skhynix.com/en/sk-hynix-ships-samples-of-12-layer-next-gen-hbm4e-2/) | 2026-10-16 | HighBandwidthFlash |
| VAST Data | [NVIDIA Dynamo + VAST = Scalable, Optimized Inference (2025-12-16, with CoreWeave)](https://www.vastdata.com/blog/nvidia-dynamo-vast-scalable-optimized-inference) | 2026-10-17 | FlashCacheTier |

## Tier 3: third-party analysis, academic paper or trade press

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| ACM | [Roofline: An Insightful Visual Performance Model for Multicore Architectures (Williams, Waterman, Patterson, CACM 52(4), 2009), Crossref record](https://api.crossref.org/works/10.1145/1498765.1498785) | 2026-10-16 | RooflineAndArithmeticIntensity, ThesisAndFraming |
| arXiv | [Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (Luo et al., arXiv:2402.13499v1), Table IV](https://arxiv.org/pdf/2402.13499) | 2026-10-17 | KernelExecutionLifecycle, NvidiaHopper |
| arXiv | [Challenges and Research Directions for Large Language Model Inference Hardware (X. Ma and D. Patterson, Google; arXiv:2601.05047)](https://arxiv.org/abs/2601.05047) | 2026-10-17 | FlashCacheTier, HighBandwidthFlash |
| arXiv | [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving (arXiv:2401.09670)](https://arxiv.org/abs/2401.09670) | 2026-10-16 | RooflineAndArithmeticIntensity |
| arXiv | [FlashAccel: Leveraging High-Bandwidth Flash (HBF) for High-Throughput LLM Inference (arXiv:2607.10186v2)](https://arxiv.org/abs/2607.10186) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [FLINT: Efficiently Leveraging High Bandwidth Flash for Capacity-Scalable LLM Inference Acceleration (G. F. Oliveira et al.; arXiv:2608.25062v1)](https://arxiv.org/abs/2608.25062) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [GPU-Initiated On-Demand High-Throughput Storage Access in the BaM System Architecture (Qureshi et al., ASPLOS 2023, arXiv:2203.04910)](https://arxiv.org/abs/2203.04910) | 2026-10-17 | FlashCacheTier |
| arXiv | [HBF Sucks? A Full-Stack Characterization of High-Bandwidth Flash for KV-Centric LLM Serving (Z. Li et al.; arXiv:2608.11668v4)](https://arxiv.org/abs/2608.11668) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [HBFSim: Fast and Faithful Simulation of High-Bandwidth Flash Under Real GPU Execution (Y. Hu et al.; arXiv:2609.09800)](https://arxiv.org/abs/2609.09800) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [Huge and Savine, Differential Machine Learning (arXiv:2005.02347v4, 30 September 2020)](https://arxiv.org/abs/2005.02347v4) | 2026-10-16 | CapitalMarketsLens |
| arXiv | [Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving (arXiv:2407.00079v4)](https://arxiv.org/abs/2407.00079) | 2026-10-17 | FlashCacheTier |
| arXiv | [Performance Characterizations and Usage Guidelines of Samsung CXL Memory Module Hybrid Prototype (Zeng et al., arXiv:2503.22017)](https://arxiv.org/abs/2503.22017) | 2026-10-17 | FlashCacheTier |
| arXiv | [Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241), Figure 4](https://arxiv.org/abs/2203.00241) | 2026-10-17 | CapitalMarketsLens, HeterogeneityFact |
| arXiv | [Potential Applications of HBF in LLM Serving Systems (Y. Yin et al.; arXiv:2608.13127v2)](https://arxiv.org/abs/2608.13127) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [Pretraining Large Language Models with NVFP4 (arXiv:2509.25149)](https://arxiv.org/abs/2509.25149) | 2026-10-17 | QuantizationAndPrecision |
| arXiv | [SambaNova SN40L: Scaling the AI Memory Wall with Dataflow and Composition of Experts (arXiv:2405.07518, MICRO 2024)](https://arxiv.org/abs/2405.07518) | 2026-10-16 | MoeAndSparseActivation |
| arXiv | [SPLASH: Co-Designing Sparse Attention with High-Bandwidth Flash for Efficient Long-Context Inference (arXiv:2609.23816)](https://arxiv.org/abs/2609.23816) | 2026-10-17 | HighBandwidthFlash |
| Blocks & Files | [Kioxia eyes GPU memory stack with high-bandwidth flash push (2026-03-20)](https://www.blocksandfiles.com/flash/2026/03/20/kioxia-eyes-gpu-memory-stack-with-high-bandwidth-flash-push/5210520) | 2026-10-17 | HighBandwidthFlash |
| Chips and Cheese | [AMD's Turin: 5th Gen EPYC Launched (core-to-core latency on EPYC 9575F)](https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched) | 2026-10-16 | CapitalMarketsLens |
| DIGITIMES | [Samsung signals zHBF push as memory race moves beyond HBM (2026-08-27)](https://www.digitimes.com/news/a20260827VL229/samsung-hbm-bandwidth-capacity-2026.html) | 2026-10-17 | HighBandwidthFlash |
| Risk.net | [Giles and Glasserman, Smoking adjoints: fast Monte Carlo Greeks (Risk, January 2006)](https://www.risk.net/derivatives/interest-rate-derivatives/1500261/smoking-adjoints-fast-monte-carlo-greeks) | 2026-10-16 | CapitalMarketsLens |
| ServeTheHome | [Oxmiq Labs HBF in AI Compute at Hot Chips 2026 (2026-08-27)](https://www.servethehome.com/oxmiq-labs-hbf-in-ai-compute-at-hot-chips-2026/) | 2026-10-17 | HighBandwidthFlash |
| Tom's Hardware | [Hot Chips 2026: High Bandwidth Flash promises massive bandwidth and capacity, but its usability is extremely limited (2026-08-26)](https://www.tomshardware.com/pc-components/ssds/hot-chips-2026-high-bandwidth-flash-promises-massive-bandwidth-and-capacity-but-its-usability-is-extremely-limited-new-memory-format-strikes-a-balance-between-hbm-and-nand-flash) | 2026-10-17 | HighBandwidthFlash |
| TrendForce | [Sandisk Reportedly Tapes Out First HBF Product, Targets 2027 Samples and 2028 Production (2026-08-14)](https://www.trendforce.com/news/2026/08/14/news-sandisk-reportedly-tapes-out-first-hbf-product-targets-2027-samples-and-2028-production/) | 2026-10-17 | HighBandwidthFlash |
| USENIX | [Mooncake: Trading More Storage for Less Computation, a KVCache-centric Architecture for Serving LLM Chatbot (Qin et al., USENIX FAST 2025)](https://www.usenix.org/system/files/fast25-qin.pdf) | 2026-10-17 | FlashCacheTier |
