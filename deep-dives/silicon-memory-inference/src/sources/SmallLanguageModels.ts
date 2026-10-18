import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/SmallLanguageModels.tsx and src/components/SlmParamsChart.tsx.
 * Register: research/2026-10-refresh/04-other-arch.md, section 0 (SLM row) and section 7
 * (SL1 to SL32). Tiers follow the register. Records accessed 2026-10-17 were re-read during
 * authoring (model cards, configs and safetensors totals at the pinned revisions, the vLLM
 * speculative-decoding docs, the Hugging Face listings). Records shared with other sections
 * reuse their URL, title, publisher and tier exactly: AmdEpycTurin (EPYC data sheet, 9755
 * page), IntelXeon6 (Chips and Cheese r8i, LLVM X86.td),
 * GravitonDeepDive (README and llama.cpp guide), IsolationNie (MIG guide pages, Blackwell
 * Ultra blog), RooflineAndArithmeticIntensity (H200 page), QuantizationAndPrecision (NVFP4
 * blog), EdgeSharedMemorySilicon (DGX Spark hardware overview, Jetson Thor blog).
 */
export const S = {
  // Tier 1: model cards, configs and safetensors totals at pinned revisions
  qwen35_08b: {
    title: 'Qwen/Qwen3.5-0.8B README at revision 2fc0636 (language model 0.8B, hidden layout, 262,144-token context)',
    publisher: 'Qwen',
    url: 'https://huggingface.co/Qwen/Qwen3.5-0.8B/blob/2fc06364715b967f1860aea9cf38778875588b17/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  qwen35_2b: {
    title: 'Qwen/Qwen3.5-2B at revision 15852e8 (README, config.json, safetensors total)',
    publisher: 'Qwen',
    url: 'https://huggingface.co/Qwen/Qwen3.5-2B/tree/15852e8c16360a2fea060d615a32b45270f8a8fc',
    tier: 1,
    accessed: '2026-10-17',
  },
  qwen35_2bConfig: {
    title: 'Qwen/Qwen3.5-2B config.json at revision 15852e8 (layer_types, num_key_value_heads, head_dim, mtp_num_hidden_layers)',
    publisher: 'Qwen',
    url: 'https://huggingface.co/Qwen/Qwen3.5-2B/blob/15852e8c16360a2fea060d615a32b45270f8a8fc/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },
  qwen35_4b: {
    title: 'Qwen/Qwen3.5-4B README at revision 851bf6e (language model 4B, 262,144-token context)',
    publisher: 'Qwen',
    url: 'https://huggingface.co/Qwen/Qwen3.5-4B/blob/851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  qwen35_9b: {
    title: 'Qwen/Qwen3.5-9B at revision c202236 (README, config.json, safetensors total)',
    publisher: 'Qwen',
    url: 'https://huggingface.co/Qwen/Qwen3.5-9B/tree/c202236235762e1c871ad0ccb60c8ee5ba337b9a',
    tier: 1,
    accessed: '2026-10-17',
  },
  gemma4E2b: {
    title: 'google/gemma-4-E2B-it README at revision 3e22461 (effective parameters, Per-Layer Embeddings, sliding window, context, benchmarks)',
    publisher: 'Google',
    url: 'https://huggingface.co/google/gemma-4-E2B-it/blob/3e22461f65e89153144f8adb70e3b8c2cc9845a7/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  gemma4E4b: {
    title: 'google/gemma-4-E4B-it README at revision ee0ef60 (4.5B effective, 8B with embeddings, 128K context)',
    publisher: 'Google',
    url: 'https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  gemma4_12b: {
    title: 'google/gemma-4-12B-it at revision 707f0a3 (safetensors total)',
    publisher: 'Google',
    url: 'https://huggingface.co/google/gemma-4-12B-it/tree/707f0a3b8a3c7ad586ed01e27eafbad8a27dd0f7',
    tier: 1,
    accessed: '2026-10-17',
  },
  gemma4Qat: {
    title: 'google/gemma-4-E2B-it-qat-q4_0-gguf README at revision 675cff4 (QAT checkpoint formats per size, assistant compatibility)',
    publisher: 'Google',
    url: 'https://huggingface.co/google/gemma-4-E2B-it-qat-q4_0-gguf/blob/675cff42a74c774d6cb76f76d8eacb49b48c9b93/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  gemma4E2bAssistant: {
    title: 'google/gemma-4-E2B-it-assistant at revision 2d874ef (MTP drafter README; safetensors total 77,993,476 parameters)',
    publisher: 'Google',
    url: 'https://huggingface.co/google/gemma-4-E2B-it-assistant/tree/2d874ef7d29f9a30599a1e4b3c1cbc9595f005df',
    tier: 1,
    accessed: '2026-10-17',
  },
  ministral3_3b: {
    title: 'mistralai/Ministral-3-3B-Instruct-2512 README at revision b35d4df (3.4B language model, 0.4B vision encoder, 256k context, FP8)',
    publisher: 'Mistral AI',
    url: 'https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512/blob/b35d4dfe56c142746f54dbd64f579faab2744308/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  ministral3_8b: {
    title: 'mistralai/Ministral-3-8B-Instruct-2512 at revision 5b26027 (README, safetensors total)',
    publisher: 'Mistral AI',
    url: 'https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512/tree/5b26027e7b19eeb4b7352e1fed3926375dd2cb4d',
    tier: 1,
    accessed: '2026-10-17',
  },
  ministral3_14b: {
    title: 'mistralai/Ministral-3-14B-Instruct-2512 at revision 29439f8 (README, safetensors total)',
    publisher: 'Mistral AI',
    url: 'https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512/tree/29439f81c2be264d8d393273f99e7db9c0961120',
    tier: 1,
    accessed: '2026-10-17',
  },
  smollm3: {
    title: 'HuggingFaceTB/SmolLM3-3B README at revision a07cc9a (64k training context, 128k with YaRN)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/HuggingFaceTB/SmolLM3-3B/blob/a07cc9a04f16550a088caea529712d1d335b0ac1/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  phi4Mini: {
    title: 'microsoft/Phi-4-mini-instruct at revision cfbefac (config.json, safetensors total)',
    publisher: 'Microsoft',
    url: 'https://huggingface.co/microsoft/Phi-4-mini-instruct/tree/cfbefacb99257ffa30c83adab238a50856ac3083',
    tier: 1,
    accessed: '2026-10-17',
  },
  llama32Card: {
    title: 'Llama 3.2 MODEL_CARD.md at meta-llama/llama-models commit 0e0b8c5 (sizes, context, quantization scheme, quantized-model benchmarks and on-device speed)',
    publisher: 'Meta',
    url: 'https://github.com/meta-llama/llama-models/blob/0e0b8c519242d5833d8c11bffc1232b77ad7f301/models/llama3_2/MODEL_CARD.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  llama32_1b: {
    title: 'meta-llama/Llama-3.2-1B at revision 4e20de3 (safetensors total)',
    publisher: 'Meta',
    url: 'https://huggingface.co/meta-llama/Llama-3.2-1B/tree/4e20de362430cd3b72f300e6b0f18e50e7166e08',
    tier: 1,
    accessed: '2026-10-17',
  },
  llama32_3b: {
    title: 'meta-llama/Llama-3.2-3B at revision 13afe51 (safetensors total)',
    publisher: 'Meta',
    url: 'https://huggingface.co/meta-llama/Llama-3.2-3B/tree/13afe5124825b4f3751f836b40dafda64c1ed062',
    tier: 1,
    accessed: '2026-10-17',
  },
  llama32Qat: {
    title: 'meta-llama/Llama-3.2-1B-Instruct-QLORA_INT4_EO8 at revision 3fdf98b (Meta QAT plus LoRA checkpoint)',
    publisher: 'Meta',
    url: 'https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct-QLORA_INT4_EO8/tree/3fdf98b6bc1069f632a468b0676299a0a1b65071',
    tier: 1,
    accessed: '2026-10-17',
  },
  hfMetaListing: {
    title: 'Hugging Face Hub API: meta-llama models sorted by creation date (queried 2026-10-17)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/api/models?author=meta-llama&sort=createdAt&direction=-1&limit=60',
    tier: 1,
    accessed: '2026-10-17',
  },
  gptOss20b: {
    title: 'openai/gpt-oss-20b README at revision 6cee5e8 (21B parameters, 3.6B active, MXFP4, 16 GB)',
    publisher: 'OpenAI',
    url: 'https://huggingface.co/openai/gpt-oss-20b/blob/6cee5e81ee83917806bbde320786a8fb61efebee/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Tier 1: vLLM documentation pinned to a release tag
  vllmSpecReadme: {
    title: 'vLLM docs/features/speculative_decoding/README.md at tag v0.31.0 (method table, speculative-config keys, Gemma 4 assistant note)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/speculative_decoding/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  vllmDraftModel: {
    title: 'vLLM docs/features/speculative_decoding/draft_model.md at tag v0.31.0 (draft model method, heterogeneous vocabularies)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/speculative_decoding/draft_model.md',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Shared with AmdEpycTurin
  epyc9005Datasheet: {
    title: 'AMD EPYC 9005 Series Server CPUs data sheet (per-SKU cores, clocks, L3, memory)',
    publisher: 'AMD',
    url: 'https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/datasheets/amd-epyc-9005-series-processor-datasheet.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  epyc9755Page: {
    title: 'AMD EPYC 9755 product page (memory type, DDR5-6400 qualifier, per-socket memory bandwidth)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9755.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Shared with IntelXeon6
  chipsAndCheeseXeon6: {
    title: "A Look into Intel Xeon 6's Memory Subsystem (AWS r8i, Xeon 6 6985P-C)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory',
    tier: 3,
    accessed: '2026-10-17',
  },
  llvmX86Td: {
    title: 'LLVM X86.td at tag llvmorg-23.1.3 (per-generation feature lists: SPR, GNR, DMR)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86.td#L1243-L1310',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Shared with GravitonDeepDive
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  gravitonLlamaCpp: {
    title: 'aws-graviton-getting-started machinelearning/llama.cpp.md at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/machinelearning/llama.cpp.md',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Shared with IsolationNie
  migConcepts: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Concepts',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migSupportedGpus: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Supported GPUs',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-gpus.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migSupportedProfiles: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Supported MIG Profiles (updated 2026-10-13)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-mig-profiles.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Shared with RooflineAndArithmeticIntensity and QuantizationAndPrecision
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  nvfp4Blog: {
    title: 'Introducing NVFP4 for Efficient and Accurate Low-Precision Inference',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Shared with EdgeSharedMemorySilicon
  sparkHardware: {
    title: 'DGX Spark User Guide: Hardware Overview',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/dgx/dgx-spark/hardware.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  thorBlog: {
    title: 'Introducing NVIDIA Jetson Thor, the Ultimate Platform for Physical AI (2025-08-25)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/',
    tier: 2,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
