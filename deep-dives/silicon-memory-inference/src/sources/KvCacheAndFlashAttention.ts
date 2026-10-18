import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/KvCacheAndFlashAttention.tsx and
 * src/components/KvCacheDiagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/01-memory.md section 4 (rows K1 to K30, KD1 to KD3).
 * Records shared with another section file reuse its key, URL, title, publisher
 * and tier. The model configs, the FlashAttention READMEs, the DeepSeek-V3 report
 * and the Blackwell Ultra blog were re-read during authoring on 2026-10-18.
 */
export const S = {
  // Model configs and model cards at pinned revisions (Tier 1)
  mistral7bConfig: {
    title: 'mistralai/Mistral-7B-v0.1 config.json at revision 27d67f1',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/mistralai/Mistral-7B-v0.1/blob/27d67f1b5f57dc0953326b2601d68371d40ea8da/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  mixtralConfig: {
    title: 'mistralai/Mixtral-8x7B-v0.1 config.json at revision fc7ac94',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/fc7ac94680e38d7348cfa806e51218e6273104b0/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  qwen3Config: {
    title: 'Qwen/Qwen3-235B-A22B config.json at revision 8efa617',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/8efa61729e24bd65b1d152b5ab5409052aa80e65/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  deepseekV3Config: {
    title: 'deepseek-ai/DeepSeek-V3 config.json at revision e815299',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  deepseekV41Flash: {
    title: 'deepseek-ai/DeepSeek-V4.1-Flash README at revision 314113f (890 bytes per token)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/314113f8a7dadb388215396ba5fbee2c610a04d6/README.md',
    tier: 1,
    accessed: '2026-10-18',
  },
  kimiK2Config: {
    title: 'moonshotai/Kimi-K2-Instruct config.json at revision fd1984e',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/moonshotai/Kimi-K2-Instruct/blob/fd1984e2b7a3350dbf7305fe73a4ede25c14de50/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  qwen3NextConfig: {
    title: 'Qwen/Qwen3-Next-80B-A3B-Instruct config.json at revision 9c7f2fb (full_attention_interval 4)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct/blob/9c7f2fbe84465e40164a94cc16cd30b6999b0cc7/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  gptOss120bConfig: {
    title: 'openai/gpt-oss-120b config.json at revision b5c939d (quantization_config)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/config.json',
    tier: 1,
    accessed: '2026-10-18',
  },
  llama70bApi: {
    title: 'meta-llama/Llama-3.1-70B model metadata at sha 349b2dd (70,553,706,496 parameters)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B',
    tier: 1,
    accessed: '2026-10-16',
  },
  llama31ModelCard: {
    title: 'meta-llama/llama-models Llama 3.1 MODEL_CARD.md at tag v0.2.0 (GQA, 128k context)',
    publisher: 'Meta',
    url: 'https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Kernel and serving-engine source and docs (Tier 1)
  flashAttentionReadme: {
    title: 'FlashAttention README at tag v2.8.3.post2 (FlashAttention-3 beta)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md',
    tier: 1,
    accessed: '2026-10-18',
  },
  fa4Readme: {
    title: 'FlashAttention README at tag fa4-v4.0.0.beta35 (FlashAttention-4 in CuTeDSL for Hopper and Blackwell)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/blob/fa4-v4.0.0.beta35/README.md',
    tier: 1,
    accessed: '2026-10-18',
  },
  fa4Release: {
    title: 'FlashAttention release fa4-v4.0.0.beta35 (FlashAttention-4 beta, 2026-10-14)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/releases/tag/fa4-v4.0.0.beta35',
    tier: 1,
    accessed: '2026-10-18',
  },
  trtllmKvCache: {
    title: 'TensorRT-LLM docs/source/features/kvcache.md at tag v1.2.1 (block pool, reuse, secondary memory)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/features/kvcache.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  trtllmQuantization: {
    title: 'TensorRT-LLM docs/source/features/quantization.md at tag v1.2.1 (FP8 and NVFP4 KV cache)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/features/quantization.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiAttentionCte: {
    title: 'AWS Neuron NKI Library: Attention CTE Kernel API Reference (Neuron 2.32.0)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/library/api/attention-cte.html',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Vendor pages, blogs and vendor-authored reports (Tier 2)
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  hgxPage: {
    title: 'NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 2,
    accessed: '2026-10-17',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-18',
  },
  llama3Herd: {
    title: 'The Llama 3 Herd of Models (arXiv:2407.21783), Table 3: layers, heads and key/value heads',
    publisher: 'Meta',
    url: 'https://arxiv.org/abs/2407.21783',
    tier: 2,
    accessed: '2026-10-17',
  },
  deepseekV3Report: {
    title: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
    publisher: 'DeepSeek-AI',
    url: 'https://arxiv.org/abs/2412.19437',
    tier: 2,
    accessed: '2026-10-18',
  },

  // Academic papers (Tier 3)
  flashAttentionPaper: {
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al., arXiv:2205.14135)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2205.14135',
    tier: 3,
    accessed: '2026-10-16',
  },
  flashAttention3Paper: {
    title: 'FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision (Shah et al., arXiv:2407.08608)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2407.08608',
    tier: 3,
    accessed: '2026-10-16',
  },
  flashAttention4Paper: {
    title:
      'FlashAttention-4: Algorithm and Kernel Pipelining Co-Design for Asymmetric Hardware Scaling (Zadouri et al., arXiv:2603.05451)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2603.05451',
    tier: 3,
    accessed: '2026-10-16',
  },
  vllmPaper: {
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention (Kwon et al., SOSP 2023, arXiv:2309.06180)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2309.06180',
    tier: 3,
    accessed: '2026-10-16',
  },
  gqaPaper: {
    title: 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (Ainslie et al., arXiv:2305.13245)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2305.13245',
    tier: 3,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
