import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/QuantizationAndPrecision.tsx and
 * src/components/PrecisionLadder.tsx. Tiers and URLs follow
 * research/2026-10-refresh/05-workloads.md (section 25 and its Sources list),
 * 02-nvidia.md and 03-aws-cpus.md. Records shared with other sections reuse
 * their URL, title, publisher and tier. Records accessed 2026-10-17 were
 * fetched during authoring; Hugging Face links are pinned to a revision SHA.
 */
export const S = {
  // Format definitions.
  ocpMx: {
    title: 'OCP Microscaling Formats (MX) Specification v1.0',
    publisher: 'Open Compute Project',
    url: 'https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmApFloat: {
    title:
      'LLVM APFloat.cpp at tag llvmorg-23.1.3: fltSemantics (max exponent, precision, size) for IEEE, BF16, TF32, FP8 and FP4',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Support/APFloat.cpp#L71-L105',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronDataTypes: {
    title: 'AWS Neuron: Data Types',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-features/data-types.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ptxIsa: {
    title: 'PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  computeCapabilities: {
    title: 'CUDA Programming Guide v13.4.2: Compute Capabilities',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  cutlassChangelog: {
    title: 'CUTLASS CHANGELOG at tag v4.8.0',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  nvfp4Blog: {
    title: 'Introducing NVFP4 for Efficient and Accurate Low-Precision Inference',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Where each format runs.
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-17',
  },
  hgxPage: {
    title: 'NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 2,
    accessed: '2026-10-17',
  },
  mi355xPage: {
    title: 'AMD Instinct MI355X GPU',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html',
    tier: 2,
    accessed: '2026-10-17',
  },
  trainium3Arch: {
    title: 'AWS Neuron: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  trn3Page: {
    title: 'Amazon EC2 Trn3 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/trn3/',
    tier: 2,
    accessed: '2026-10-17',
  },
  clangAmxIntrin: {
    title: 'Clang amxintrin.h at tag llvmorg-23.1.3 (tile size, LDTILECFG, TILELOADD, TDPBF16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxintrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },

  // DeepSeek-V3.2 at FP8 and NVFP4.
  deepseekV32Files: {
    title: 'deepseek-ai/DeepSeek-V3.2 files at revision a7e62ac (689.5 GB of safetensors)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3.2/tree/a7e62ac04ecb2c0a54d736dc46601c5606cf10a6',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV32Nvfp4Files: {
    title: 'nvidia/DeepSeek-V3.2-NVFP4 files at revision 7c0f62c (415.1 GB of safetensors)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/nvidia/DeepSeek-V3.2-NVFP4/tree/7c0f62c6da1da0c81c6e097010cc55854d206812',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV32Nvfp4Card: {
    title: 'DeepSeek-V3.2-NVFP4 model card at revision 7c0f62c (post-training quantization, evaluation)',
    publisher: 'NVIDIA',
    url: 'https://huggingface.co/nvidia/DeepSeek-V3.2-NVFP4/blob/7c0f62c6da1da0c81c6e097010cc55854d206812/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Training and checkpoints.
  deepseekV3Report: {
    title: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
    publisher: 'DeepSeek-AI',
    url: 'https://arxiv.org/abs/2412.19437',
    tier: 2,
    accessed: '2026-10-17',
  },
  deepseekV3Config: {
    title: 'deepseek-ai/DeepSeek-V3 config.json at revision e815299',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },
  nvfp4Pretraining: {
    title: 'Pretraining Large Language Models with NVFP4 (arXiv:2509.25149)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2509.25149',
    tier: 3,
    accessed: '2026-10-17',
  },
  gptOssConfig: {
    title: 'openai/gpt-oss-120b config.json at revision b5c939d (quantization_config)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },
  kimiK25Readme: {
    title: 'moonshotai/Kimi-K2.5 README at revision 4d01dfe (native INT4 quantization)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/moonshotai/Kimi-K2.5/blob/4d01dfe0332d63057c186e0b262165819efb6611/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  kimiK3Readme: {
    title: 'moonshotai/Kimi-K3 README at revision f831ab6 (native MXFP4 quantization)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/moonshotai/Kimi-K3/blob/f831ab66814297da540d832a5235f8e904f29d06/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV4ProConfig: {
    title: 'deepseek-ai/DeepSeek-V4-Pro-0813 config.json at revision 72e1d32 (expert_dtype)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/72e1d3230f6c080a530b0a1d46f8eb4602340597/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV4ProReadme: {
    title: 'deepseek-ai/DeepSeek-V4-Pro-0813 README at revision 72e1d32 (vLLM serve command)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/72e1d3230f6c080a530b0a1d46f8eb4602340597/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV41Flash: {
    title: 'deepseek-ai/DeepSeek-V4.1-Flash README at revision 314113f (890 bytes per token)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/314113f8a7dadb388215396ba5fbee2c610a04d6/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  minimaxM3Mxfp8: {
    title: 'MiniMaxAI/MiniMax-M3-MXFP8 config.json at revision c5454eb (mxfp8, weight_block_size [1, 32])',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/MiniMaxAI/MiniMax-M3-MXFP8/blob/c5454eb03678d8710e54a4e0fc681b9f3b4a3dba/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Stacks that combine the levers.
  trtllmV100: {
    title: 'TensorRT-LLM release v1.0.0 notes (2025-09-24)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0',
    tier: 1,
    accessed: '2026-10-17',
  },
  wideEpExample: {
    title: 'TensorRT-LLM examples/wide_ep at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/tree/v1.2.1/examples/wide_ep',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiLibNotes: {
    title: 'AWS Neuron: NKI Library release notes',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nki-lib.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  vllmKernelConfig: {
    title: 'vLLM vllm/config/kernel.py at tag v0.31.0 (MoEBackend values)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/kernel.py#L118-L141',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
