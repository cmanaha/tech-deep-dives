import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/DisaggregatedServingAndSpeculative.tsx and
 * src/components/DisaggregatedServingDiagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/05-workloads.md (section 26 and the Sources list),
 * 02-nvidia.md, 03-aws-cpus.md and 04-other-arch.md. Records shared with other
 * sections reuse their URL, title, publisher and tier. Papers are Tier 3 under
 * CLAUDE.md; their results are cited with kind `measured`. Records accessed
 * 2026-10-17 were fetched during authoring.
 */
export const S = {
  // Instances and links
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  p6Page: {
    title: 'Amazon EC2 P6 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/p6/',
    tier: 2,
    accessed: '2026-10-17',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-17',
  },
  h100Page: {
    title: 'NVIDIA H100 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    tier: 2,
    accessed: '2026-10-16',
  },

  // Heterogeneous silicon
  lpxBlog: {
    title:
      'Inside NVIDIA Groq 3 LPX: The Low-Latency Inference Accelerator for the NVIDIA Vera Rubin Platform (2026-03-16)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Model KV shapes
  llama3Herd: {
    title: 'The Llama 3 Herd of Models (arXiv:2407.21783), Table 3: layers, heads and key/value heads',
    publisher: 'Meta',
    url: 'https://arxiv.org/abs/2407.21783',
    tier: 2,
    accessed: '2026-10-17',
  },
  deepseekV41Flash: {
    title: 'deepseek-ai/DeepSeek-V4.1-Flash README at revision 314113f (890 bytes per token)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/314113f8a7dadb388215396ba5fbee2c610a04d6/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepseekV3Report: {
    title: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
    publisher: 'DeepSeek-AI',
    url: 'https://arxiv.org/abs/2412.19437',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Disaggregated serving: papers
  distServe: {
    title:
      'DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving (arXiv:2401.09670)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2401.09670',
    tier: 3,
    accessed: '2026-10-17',
  },
  mooncakeArxiv: {
    title: 'Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving (arXiv:2407.00079v4)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2407.00079',
    tier: 3,
    accessed: '2026-10-17',
  },

  // Disaggregated serving: NVIDIA Dynamo and NIXL
  dynamoReadme: {
    title: 'NVIDIA Dynamo README at tag v1.5.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  dynamoDisaggDoc: {
    title: 'Dynamo disaggregated serving architecture doc at tag v1.5.1 (NIXL VRAM-to-VRAM, non-blocking KV transfer)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/developer-guide/knowledge-base/concepts/system-architecture/disaggregated-serving.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  dynamoR1Recipe: {
    title: 'Dynamo recipe at tag v1.5.1: DeepSeek-R1, TensorRT-LLM disaggregated wide EP on GB200 (deploy.yaml)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/dynamo/tree/v1.5.1/recipes/deepseek-r1/trtllm/disagg/wide_ep/gb200',
    tier: 1,
    accessed: '2026-10-17',
  },
  dynamoGlm5EfaRecipe: {
    title:
      'Dynamo recipe at tag v1.5.1: GLM-5 NVFP4 disaggregated prefill/decode on GB200 over AWS EFA (README and deploy.yaml)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/dynamo/tree/v1.5.1/recipes/glm-5-nvfp4/sglang/disagg/efa',
    tier: 1,
    accessed: '2026-10-17',
  },
  nixl: {
    title: 'ai-dynamo/nixl storage and network plugins at tag v1.5.0',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/nixl/tree/v1.5.0/src/plugins',
    tier: 1,
    accessed: '2026-10-17',
  },
  nixlReadme: {
    title: 'ai-dynamo/nixl README at tag v1.5.0 (point-to-point transfers for inference frameworks)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Disaggregated serving: vLLM, SGLang, llm-d, Neuron
  vllmDisaggDoc: {
    title: 'vLLM docs/features/disagg_prefill.md at tag v0.31.0 (experimental; connector list)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/disagg_prefill.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  vllmNixlWorker: {
    title: 'vLLM NixlConnector nixl/base_worker.py at tag v0.31.0 (default NIXL backends ["UCX"])',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py#L559-L561',
    tier: 1,
    accessed: '2026-10-17',
  },
  sglangDisagg: {
    title: 'SGLang arg_groups/fields/disagg.py at tag v0.5.21 (disaggregation_mode; transfer backend default mooncake)',
    publisher: 'SGLang',
    url: 'https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/disagg.py#L55-L65',
    tier: 1,
    accessed: '2026-10-17',
  },
  sglangChoices: {
    title: 'SGLang arg_groups/choices.py at tag v0.5.21 (DISAGG_TRANSFER_BACKEND_CHOICES)',
    publisher: 'SGLang',
    url: 'https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/choices.py#L120-L127',
    tier: 1,
    accessed: '2026-10-17',
  },
  sglangEnviron: {
    title: 'SGLang srt/environ.py at tag v0.5.21 (SGLANG_DISAGGREGATION_NIXL_BACKEND default "UCX")',
    publisher: 'SGLang',
    url: 'https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/environ.py#L711',
    tier: 1,
    accessed: '2026-10-17',
  },
  llmdReadme: {
    title: 'llm-d README at tag v0.10.0',
    publisher: 'llm-d',
    url: 'https://github.com/llm-d/llm-d/blob/v0.10.0/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  awsLlmdBlog: {
    title: 'Introducing Disaggregated Inference on AWS powered by llm-d (2026-03-16)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/',
    tier: 2,
    accessed: '2026-10-17',
  },
  neuronDisagg: {
    title: 'NxD Inference: Disaggregated Inference [BETA] (Neuron 2.32.0)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/disaggregated-inference.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Speculative decoding
  leviathan: {
    title: 'Fast Inference from Transformers via Speculative Decoding (Leviathan, Kalman, Matias; arXiv:2211.17192)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2211.17192',
    tier: 3,
    accessed: '2026-10-17',
  },
  eagle3: {
    title: 'EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test (arXiv:2503.01840)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2503.01840',
    tier: 3,
    accessed: '2026-10-17',
  },
  medusa: {
    title: 'Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads (arXiv:2401.10774)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2401.10774',
    tier: 3,
    accessed: '2026-10-17',
  },
  dflash: {
    title: 'DFlash: Block Diffusion for Flash Speculative Decoding (arXiv:2602.06036)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2602.06036',
    tier: 3,
    accessed: '2026-10-17',
  },
  vllmSpecConfig: {
    title: 'vLLM vllm/config/speculative.py at tag v0.31.0 (SpeculativeMethod)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/speculative.py#L39-L84',
    tier: 1,
    accessed: '2026-10-17',
  },
  vllmSpecMetrics: {
    title: 'vLLM vllm/v1/spec_decode/metrics.py at tag v0.31.0 (acceptance rate and mean acceptance length)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/spec_decode/metrics.py#L177-L196',
    tier: 1,
    accessed: '2026-10-17',
  },
  sglangSpec: {
    title: 'SGLang arg_groups/fields/spec.py at tag v0.5.21 (speculative_algorithm builtins)',
    publisher: 'SGLang',
    url: 'https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/spec.py#L30-L33',
    tier: 1,
    accessed: '2026-10-17',
  },
  trtllmSpecDoc: {
    title: 'TensorRT-LLM docs/source/features/speculative-decoding.md at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/docs/source/features/speculative-decoding.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  neuronFeatureGuide: {
    title: 'NxD Inference feature guide (Neuron 2.32.0): speculative decoding',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/feature-guide.html',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
