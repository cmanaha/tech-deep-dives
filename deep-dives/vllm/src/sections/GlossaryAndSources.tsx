import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';

// Source tiers (repo convention):
//  1 = official docs / API reference / source code
//  2 = vendor blogs, announcements, product pages
//  3 = third-party analysis, academic papers, benchmarks
//  4 = tutorials / unverified posts (never cited as fact)
// All access dates 2026-10-16. Codebase claims are pinned to the vLLM v0.31.0 release tag (commit db9527a4).

const sources: Source[] = [
  // vLLM: official docs (Tier 1)
  { id: 1, title: 'vLLM documentation (landing)', url: 'https://docs.vllm.ai/en/v0.31.0/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 2, title: 'vLLM: Architecture overview', url: 'https://docs.vllm.ai/en/v0.31.0/design/arch_overview/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 3, title: 'vLLM: V1 user guide', url: 'https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 4, title: 'vLLM: Automatic prefix caching (design)', url: 'https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 5, title: 'vLLM: Optimization & tuning', url: 'https://docs.vllm.ai/en/v0.31.0/configuration/optimization/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 6, title: 'vLLM: Conserving memory', url: 'https://docs.vllm.ai/en/v0.31.0/configuration/conserving_memory/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 7, title: 'vLLM: Troubleshooting', url: 'https://docs.vllm.ai/en/v0.31.0/usage/troubleshooting/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 8, title: 'vLLM: Parallelism & scaling', url: 'https://docs.vllm.ai/en/v0.31.0/serving/parallelism_scaling/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 9, title: 'vLLM: Data-parallel deployment', url: 'https://docs.vllm.ai/en/v0.31.0/serving/data_parallel_deployment/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 10, title: 'vLLM: Expert-parallel deployment', url: 'https://docs.vllm.ai/en/v0.31.0/serving/expert_parallel_deployment/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 11, title: 'vLLM: Disaggregated prefilling', url: 'https://docs.vllm.ai/en/v0.31.0/features/disagg_prefill/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 12, title: 'vLLM: NixlConnector usage', url: 'https://docs.vllm.ai/en/v0.31.0/features/nixl_connector_usage/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 13, title: 'vLLM: Speculative decoding', url: 'https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 14, title: 'vLLM: Quantization', url: 'https://docs.vllm.ai/en/v0.31.0/features/quantization/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 15, title: 'vLLM: FP8 quantization', url: 'https://docs.vllm.ai/en/v0.31.0/features/quantization/fp8/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 16, title: 'vLLM: Quantized KV cache', url: 'https://docs.vllm.ai/en/v0.31.0/features/quantization/quantized_kvcache/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 17, title: 'vLLM: LoRA adapters', url: 'https://docs.vllm.ai/en/v0.31.0/features/lora/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 18, title: 'vLLM: Structured outputs', url: 'https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 19, title: 'vLLM: Tool calling', url: 'https://docs.vllm.ai/en/v0.31.0/features/tool_calling/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 20, title: 'vLLM: Multimodal inputs', url: 'https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 21, title: 'vLLM: OpenAI-compatible server', url: 'https://docs.vllm.ai/en/v0.31.0/serving/openai_compatible_server/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 22, title: 'vLLM: Metrics (design)', url: 'https://docs.vllm.ai/en/v0.31.0/design/metrics/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 23, title: 'vLLM: CacheConfig API reference', url: 'https://docs.vllm.ai/en/v0.31.0/api/vllm/config/cache/', tier: 1, type: 'api-reference', accessDate: '2026-10-16' },
  { id: 24, title: 'vLLM: LoRAConfig API reference', url: 'https://docs.vllm.ai/en/v0.31.0/api/vllm/config/lora/', tier: 1, type: 'api-reference', accessDate: '2026-10-16' },
  { id: 25, title: 'vLLM: KubeRay integration', url: 'https://docs.vllm.ai/en/v0.31.0/deployment/integrations/kuberay/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 26, title: 'vLLM: KServe integration', url: 'https://docs.vllm.ai/en/v0.31.0/deployment/integrations/kserve/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 27, title: 'vLLM: LiteLLM integration', url: 'https://docs.vllm.ai/en/v0.31.0/deployment/frameworks/litellm/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 28, title: 'vLLM: Open WebUI integration', url: 'https://docs.vllm.ai/en/v0.31.0/deployment/frameworks/open-webui/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 29, title: 'vLLM: Installation (hardware plugins, including AWS Neuron)', url: 'https://docs.vllm.ai/en/v0.31.0/getting_started/installation/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 46, title: 'vLLM: Preloading weights (vllm preload)', url: 'https://docs.vllm.ai/en/v0.31.0/features/preload/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 47, title: 'vLLM: Initialized snapshots (vllm snapshot)', url: 'https://docs.vllm.ai/en/v0.31.0/features/initialized_snapshots/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 48, title: 'vLLM: Sleep mode', url: 'https://docs.vllm.ai/en/v0.31.0/features/sleep_mode/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 49, title: 'vLLM: KV offloading usage', url: 'https://docs.vllm.ai/en/v0.31.0/features/kv_offloading_usage/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },

  // vLLM: source code and release notes (Tier 1), pinned to the v0.31.0 release tag
  { id: 30, title: 'vLLM source: v0.31.0 release tag, commit db9527a4 (analysis baseline)', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 31, title: 'vLLM source: vllm/v1 (V1 engine)', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 32, title: 'vLLM source: vllm/config', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/config', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 33, title: 'vLLM source: vllm/model_executor', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/model_executor', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 34, title: 'vLLM source: benchmarks/', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/benchmarks', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 35, title: 'vLLM source: Prometheus + Grafana example', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/examples/observability/prometheus_grafana', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 36, title: 'vLLM source: OpenTelemetry example', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/examples/observability/opentelemetry', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 37, title: 'vllm-project/vllm-neuron (Neuron plugin, v0.24.0.1.1.0)', url: 'https://github.com/vllm-project/vllm-neuron/tree/v0.24.0.1.1.0', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 38, title: 'aws-neuron/upstreaming-to-vllm (AWS fork, repository archived)', url: 'https://github.com/aws-neuron/upstreaming-to-vllm', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 39, title: 'vllm-project/production-stack (vllm-stack-0.1.13)', url: 'https://github.com/vllm-project/production-stack/tree/vllm-stack-0.1.13', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 40, title: 'vllm-project/guidellm (benchmark tool, v0.8.1)', url: 'https://github.com/vllm-project/guidellm/tree/v0.8.1', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 41, title: 'Inferact/vllm-frontend-rs (Rust frontend origin, repository archived)', url: 'https://github.com/Inferact/vllm-frontend-rs', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 45, title: 'vLLM source: rust/ (in-tree Rust frontend)', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0/rust', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 153, title: 'vLLM v0.31.0 release notes', url: 'https://github.com/vllm-project/vllm/releases/tag/v0.31.0', tier: 1, type: 'announcement', accessDate: '2026-10-16' },

  // vLLM: blog / announcements (Tier 2)
  { id: 42, title: 'vLLM blog: V1 alpha release (Jan 2025)', url: 'https://vllm.ai/blog/2025-01-27-v1-alpha-release', tier: 2, type: 'announcement', accessDate: '2026-10-16' },
  { id: 43, title: 'vLLM blog: vLLM Router release (Dec 2025)', url: 'https://vllm-project.github.io/2025/12/13/vllm-router-release.html', tier: 2, type: 'announcement', accessDate: '2026-10-16' },
  { id: 44, title: 'PyTorch Foundation welcomes vLLM (press release)', url: 'https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html', tier: 2, type: 'announcement', accessDate: '2026-10-16' },

  // AWS: official docs (Tier 1)
  { id: 50, title: 'AWS EC2: Placement strategies', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 51, title: 'AWS EC2: How instance topology works', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 52, title: 'AWS EC2: Instance topology prerequisites', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 53, title: 'AWS EC2: DescribeInstanceTopology API', url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html', tier: 1, type: 'api-reference', accessDate: '2026-10-16' },
  { id: 54, title: 'AWS EC2: Capacity Blocks for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 55, title: 'AWS EC2: EFA + NIXL for inference', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 56, title: 'AWS EC2: EFA + NCCL for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 57, title: 'AWS EKS: Load and serve models on Amazon EKS (vLLM inference guide)', url: 'https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 58, title: 'AWS EKS: AI/ML compute best practices', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 59, title: 'AWS Deep Learning Containers: vLLM on SageMaker', url: 'https://aws.github.io/deep-learning-containers/vllm/deployment/sagemaker/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 60, title: 'AWS Neuron: What\'s New', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 61, title: 'AWS Neuron: NxD Inference vLLM guide', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 62, title: 'AWS Neuron: NxD Inference release notes', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nxd-inference.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 63, title: 'awslabs/ml-container-creator (SageMaker BYOC)', url: 'https://github.com/awslabs/ml-container-creator/tree/bb89cf9de839f0b6e027f011d2264f326138fb0c', tier: 1, type: 'aws-open-source', accessDate: '2026-10-16' },

  // AWS: blogs / announcements / product pages (Tier 2)
  { id: 70, title: 'AWS What\'s New: NIXL with EFA (Mar 2026)', url: 'https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/', tier: 2, type: 'announcement', accessDate: '2026-10-16' },
  { id: 71, title: 'AWS ML Blog: Deploy LLMs on EKS with vLLM DLCs', url: 'https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 72, title: 'AWS ML Blog: Disaggregated inference on AWS with llm-d', url: 'https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 73, title: 'AWS ML Blog: Scaling Rufus with Trainium + vLLM', url: 'https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 74, title: 'AWS ML Blog: Multi-LoRA / MoE vLLM on SageMaker + Bedrock', url: 'https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 75, title: 'AWS ML Blog: P-EAGLE parallel speculative decoding in vLLM', url: 'https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 76, title: 'Amazon Bedrock (product page)', url: 'https://aws.amazon.com/bedrock/', tier: 2, type: 'product-page', accessDate: '2026-10-16' },

  // Ecosystem: official docs / source (Tier 1)
  { id: 80, title: 'Ray Serve LLM: Serving LLMs (Ray 2.59.0)', url: 'https://docs.ray.io/en/releases-2.59.0/serve/llm/index.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 81, title: 'Ray Serve LLM: vLLM compatibility (Ray 2.59.0)', url: 'https://docs.ray.io/en/releases-2.59.0/serve/llm/user-guides/vllm-compatibility.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 82, title: 'llm-d (GitHub, v0.10.0)', url: 'https://github.com/llm-d/llm-d/tree/v0.10.0', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 83, title: 'llm-d Router, formerly llm-d-inference-scheduler (GitHub, v1.0.0)', url: 'https://github.com/llm-d/llm-d-router/tree/v1.0.0', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 84, title: 'Kubernetes Gateway API Inference Extension (GitHub, v1.6.2)', url: 'https://github.com/kubernetes-sigs/gateway-api-inference-extension/tree/v1.6.2', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 85, title: 'Gateway API Inference Extension (docs)', url: 'https://gateway-api-inference-extension.sigs.k8s.io/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 86, title: 'kubernetes-sigs/inference-perf (GitHub, v0.7.0)', url: 'https://github.com/kubernetes-sigs/inference-perf/tree/v0.7.0', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 87, title: 'NVIDIA Dynamo (GitHub: ai-dynamo/dynamo, v1.5.1)', url: 'https://github.com/ai-dynamo/dynamo/tree/v1.5.1', tier: 1, type: 'source-code', accessDate: '2026-10-16' },
  { id: 88, title: 'LMCache documentation', url: 'https://docs.lmcache.ai/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 89, title: 'DJL: LMI container (vLLM backend)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 90, title: 'DJL: LMI vLLM user guide', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 91, title: 'SGLang documentation', url: 'https://docs.sglang.io/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 92, title: 'TensorRT-LLM documentation', url: 'https://nvidia.github.io/TensorRT-LLM/', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 93, title: 'Hugging Face Text Generation Inference (TGI) docs (repository archived)', url: 'https://huggingface.co/docs/text-generation-inference/index', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },

  // Ecosystem / vendor: blogs (Tier 2)
  { id: 100, title: 'NVIDIA Technical Blog: Introducing NVIDIA Dynamo', url: 'https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/', tier: 2, type: 'blog', accessDate: '2026-10-16' },
  { id: 101, title: 'NVIDIA Technical Blog: Dynamo accelerates llm-d', url: 'https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/', tier: 2, type: 'blog', accessDate: '2026-10-16' },
  { id: 102, title: 'llm-d Blog: Production inference with KServe + llm-d + vLLM', url: 'https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm', tier: 2, type: 'blog', accessDate: '2026-10-16' },
  { id: 103, title: 'Anyscale Blog: Ray Serve LLM: Wide-EP & disaggregated serving with vLLM', url: 'https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm', tier: 2, type: 'blog', accessDate: '2026-10-16' },
  { id: 104, title: 'LiteLLM: Security update (Mar 2026 advisory)', url: 'https://docs.litellm.ai/blog/security-update-march-2026', tier: 2, type: 'announcement', accessDate: '2026-10-16' },

  // Academic papers (Tier 3)
  { id: 110, title: 'Kwon et al.: Efficient Memory Management for LLM Serving with PagedAttention (arXiv:2309.06180)', url: 'https://arxiv.org/abs/2309.06180', tier: 3, type: 'academic-paper', accessDate: '2026-10-16' },
  { id: 111, title: 'Leviathan et al.: Fast Inference via Speculative Decoding (arXiv:2211.17192)', url: 'https://arxiv.org/abs/2211.17192', tier: 3, type: 'academic-paper', accessDate: '2026-10-16' },

  // Third-party analysis (Tier 3)
  { id: 120, title: 'Datadog Security Labs: LiteLLM PyPI supply-chain campaign', url: 'https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/', tier: 3, type: 'third-party-analysis', accessDate: '2026-10-16' },

  // AWS SageMaker: deep integration (Section 25), Tier 1 docs / source
  { id: 130, title: 'DJL LMI: Container & model configurations (option.* / pass-through)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/configurations.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 131, title: 'DJL LMI: Release notes (LMI → vLLM version mapping)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/release_notes.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 132, title: 'DJL LMI: Deploying your model on a SageMaker endpoint', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/deploying-your-endpoint.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 133, title: 'DJL LMI: Chat input/output schema', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/chat_input_output_schema.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 134, title: 'AWS SageMaker: Model deploy feature matrix', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 135, title: 'AWS SageMaker: Inference deployment options', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 136, title: 'AWS SageMaker: Model hosting FAQs (limits / timeouts)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 137, title: 'AWS SageMaker: Large-model inference hosting parameters', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 138, title: 'AWS SageMaker: CloudWatch metrics', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 139, title: 'AWS SageMaker: Endpoint auto-scaling policy (Inference Components)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-policy.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 140, title: 'AWS SageMaker: Define an auto-scaling policy', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 141, title: 'AWS SageMaker HyperPod: Model deployment (vLLM container)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 142, title: 'AWS SageMaker HyperPod: Deploy a model with kubectl (S3/FSx/HF)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 143, title: 'AWS SageMaker HyperPod: Inference autoscaling (KEDA, JumpStartModel CRD)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 144, title: 'aws/model-hosting-container-standards (Python toolkit behind vLLM\'s SageMaker route; SM_VLLM_* notebooks, v0.1.16)', url: 'https://github.com/aws/model-hosting-container-standards/tree/v0.1.16', tier: 1, type: 'aws-open-source', accessDate: '2026-10-16' },
  { id: 145, title: 'vLLM source: SageMaker /ping and /invocations routes (stateful sessions, adapter injection)', url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/sagemaker/api_router.py', tier: 1, type: 'source-code', accessDate: '2026-10-16' },

  // AWS SageMaker: deep integration (Section 25), Tier 2 blogs / samples
  { id: 147, title: 'AWS ML Blog: Multi-tenant LoRA serving on Amazon SageMaker', url: 'https://aws.amazon.com/blogs/machine-learning/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 148, title: 'Amazon SageMaker AI: Scale an endpoint to zero instances', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-zero-instances.html', tier: 1, type: 'official-docs', accessDate: '2026-10-16' },
  { id: 149, title: 'AWS ML Blog: Faster autoscaling for generative AI (ConcurrentRequestsPerModel)', url: 'https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 150, title: 'AWS ML Blog: Enhanced metrics for SageMaker AI endpoints', url: 'https://aws.amazon.com/blogs/machine-learning/enhanced-metrics-for-amazon-sagemaker-ai-endpoints-deeper-visibility-for-better-performance/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 151, title: 'AWS ML Blog: Real-time voice with SageMaker AI + vLLM (streaming)', url: 'https://aws.amazon.com/blogs/machine-learning/build-real-time-voice-applications-with-amazon-sagemaker-ai-and-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-10-16' },
  { id: 152, title: 'aws-samples/load-test-llm-with-locust (sagemaker_vllm_loadtest.ipynb)', url: 'https://github.com/aws-samples/load-test-llm-with-locust', tier: 2, type: 'aws-open-source', accessDate: '2026-10-16' },
];

const glossary: GlossaryEntry[] = [
  // Engine core
  { acronym: 'vLLM', fullForm: 'vLLM (project name)', description: 'Open-source high-throughput, memory-efficient LLM inference and serving engine; hosted by the PyTorch Foundation.' },
  { acronym: 'V1', fullForm: 'vLLM V1 Engine', description: 'The 2025 re-architecture of vLLM\'s core: unified scheduler and a multi-process EngineCore. V0 is fully deprecated. The GPU execution layer inside it is Model Runner V2 (MRv2).' },
  { acronym: 'EngineCore', fullForm: 'Engine Core Process', description: 'The isolated V1 process running the scheduler + executor busy loop, separated from the API/tokenization frontend over ZMQ.' },
  { acronym: 'PagedAttention', fullForm: 'Paged Attention', description: 'The paged KV-cache design from the 2023 PagedAttention paper: fixed-size blocks mapped to non-contiguous physical memory through block tables (the OS virtual-memory analogy). vLLM removed its original PagedAttention kernels in v0.25; its attention backends (FlashAttention, FlashInfer, Triton, MLA) read the same paged layout.' },
  { acronym: 'KV cache', fullForm: 'Key-Value Cache', description: 'Per-layer per-head K and V tensors cached during decode to avoid recomputation; usually the dominant serving-memory consumer.' },
  { acronym: 'APC', fullForm: 'Automatic Prefix Caching', description: 'Reuse of already-computed KV blocks across requests sharing a prefix; enabled by default in V1 for every model that supports it.' },
  { acronym: 'TTFT', fullForm: 'Time To First Token', description: 'Latency from request arrival to the first output token; dominated by the compute-bound prefill phase.' },
  { acronym: 'ITL / TPOT', fullForm: 'Inter-Token Latency / Time Per Output Token', description: 'Average time between successive output tokens during the memory-bandwidth-bound decode phase.' },
  { acronym: 'ZMQ', fullForm: 'ZeroMQ', description: 'The message-passing sockets (ROUTER/PULL/DEALER/PUSH) carrying msgpack-encoded requests between the vLLM frontend and EngineCore.' },
  { acronym: 'MRv2', fullForm: 'Model Runner V2', description: 'The default GPU model runner since v0.29 (vllm/v1/worker/gpu/). The older V1 runner (gpu_model_runner.py) is deprecated, with removal planned for v0.32; a few features still fall back to it.' },
  { acronym: 'HMA', fullForm: 'Hybrid Memory Allocator (hybrid KV cache manager)', description: 'The KV cache manager for models that mix attention types (sliding window, Mamba, chunked local, full): each layer type gets its own slot allocation and prefix-cache rule. Turned off with --disable-hybrid-kv-cache-manager.' },
  { acronym: 'Admission control', fullForm: 'API-server request admission control', description: 'Queue caps (--max-num-queued-reqs, --max-num-queued-tokens) that reject overload with HTTP 503 instead of letting the queue grow.' },

  // Parallelism & distribution
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Sharding tensors within a layer across devices; needs a fast intra-node interconnect.' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Splitting model layers across pipeline stages on different devices/nodes.' },
  { acronym: 'EP', fullForm: 'Expert Parallelism', description: 'Sharding Mixture-of-Experts experts across devices; "Wide-EP" spreads experts across many nodes.' },
  { acronym: 'DP', fullForm: 'Data Parallelism', description: 'Replicating the model for throughput; for MoE, DP-attention composes with EP.' },
  { acronym: 'EPLB', fullForm: 'Expert-Parallel Load Balancing', description: 'Rebalancing MoE expert placement across devices to even out load.' },
  { acronym: 'DCP / PCP', fullForm: 'Decode / Prefill Context Parallelism', description: 'Splitting one long sequence\'s attention across GPUs during decode (DCP) or prefill (PCP).' },
  { acronym: 'DBO', fullForm: 'Dual-Batch Overlap', description: 'Splits each batch into two micro-batches so one computes while the other waits on the expert-parallel all-to-all (--enable-dbo).' },
  { acronym: 'MoonEP', fullForm: 'MoonEP all-to-all backend', description: 'An expert-parallel all-to-all backend with dynamic redundant experts over NVLink, selected with --all2all-backend moonep.' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'Sparse-activation architecture where the top-k of N experts fire per token.' },
  { acronym: 'GQA / MQA / MLA', fullForm: 'Grouped / Multi-Query / Multi-head Latent Attention', description: 'Attention variants that shrink the KV cache by reducing or compressing KV heads.' },

  // KV transfer & networking
  { acronym: 'P/D disaggregation', fullForm: 'Prefill / Decode Disaggregation', description: 'Running prefill and decode on separate instances to tune TTFT and ITL independently. A latency/SLO-isolation optimization. It does not raise throughput.' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'Point-to-point library for asynchronous KV-cache transfer over UCX / libfabric / RDMA; vLLM\'s NixlConnector wraps it.' },
  { acronym: 'NIXL pull / push', fullForm: 'NixlConnector (pull) / NixlPushConnector (push)', description: 'Pull, the default: the decode instance reads KV from the prefill instance. Push: the prefill instance writes KV into the decode instance.' },
  { acronym: 'LMCache', fullForm: 'LM Cache', description: 'External KV-cache layer (CPU/disk/Redis/S3) integrated via a vLLM KV connector; enables cross-instance KV reuse.' },
  { acronym: 'KV offload tiers', fullForm: 'vLLM native KV offloading', description: 'vLLM\'s built-in multi-tier KV offload: a CPU primary tier plus fs (filesystem), obj (object store) and p2p (peer instance) secondary tiers. The shared tiers give cross-instance KV reuse without an external cache layer.' },
  { acronym: 'HiSparse', fullForm: 'HiSparse host KV tier', description: 'A host-memory KV tier for DeepSeek Sparse Attention models (HiSparseConnector): KV lives in a host pool and the GPU keeps a hot buffer of the rows decode reads. Requires Model Runner V2.' },
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'AWS OS-bypass network interface for HPC/ML; the LIBFABRIC backend lets vLLM\'s NixlConnector move KV cache over EFA.' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'Network primitive that writes directly to remote memory without CPU involvement; GPUDirect RDMA sources directly from GPU HBM.' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'GPU collective library used for TP/PP/EP all-reduce / all-gather / all-to-all.' },

  // Precision & quantization
  { acronym: 'FP8 (E4M3 / E5M2)', fullForm: '8-bit Floating Point', description: 'Forward-pass / wider-range 8-bit float formats supported for weights, activations, and KV cache on Ada/Hopper+.' },
  { acronym: 'AWQ', fullForm: 'Activation-aware Weight Quantization', description: 'Weight-only quantization scheme supported via AutoAWQ checkpoints.' },
  { acronym: 'GPTQ', fullForm: 'Generative Pre-trained Transformer Quantization', description: 'Post-training weight-only quantization (often INT4) served via Marlin kernels.' },
  { acronym: 'NVFP4 / MXFP4', fullForm: 'NVIDIA FP4 / Microscaling FP4', description: '4-bit float formats with block scaling, targeted at Blackwell-class hardware.' },
  { acronym: 'W8A8', fullForm: 'Weight-8-bit Activation-8-bit', description: 'Quantization that quantizes both weights and activations (INT8 or FP8).' },

  // Decoding techniques
  { acronym: 'EAGLE', fullForm: 'Extrapolation Algorithm for Greater Language-model Efficiency', description: 'A speculative-decoding draft method (EAGLE / EAGLE-3) supported in vLLM.' },
  { acronym: 'MTP', fullForm: 'Multi-Token Prediction', description: 'Speculative-decoding method using a model\'s native multi-token-prediction heads.' },
  { acronym: 'DFlash / DFlash2', fullForm: 'DFlash block drafting', description: 'Speculative methods that draft a whole block in one pass from the target model\'s hidden states. DFlash2 adds a candidate head and needs Model Runner V2.' },
  { acronym: 'DSpark', fullForm: 'DSpark speculative decoding', description: 'A DFlash-derived speculative method; the one method the docs support for adaptive verification.' },
  { acronym: 'TLI', fullForm: 'Token-Level Intersection', description: 'Lets a draft model with a different tokenizer serve a target model by constraining draft logits to the tokens both vocabularies share (use_heterogeneous_vocab).' },
  { acronym: 'LoRA', fullForm: 'Low-Rank Adaptation', description: 'Cheap fine-tuning adapters served on a shared base model; vLLM batches many adapters via Punica-style kernels.' },
  { acronym: 'Punica', fullForm: 'Punica (multi-LoRA kernels)', description: 'The batched shrink/expand kernel scheme that lets many LoRA adapters run in one batch.' },

  // Compilation
  { acronym: 'CUDA graph', fullForm: 'CUDA Graph', description: 'A captured/replayed GPU execution graph that removes per-step launch overhead; vLLM uses piecewise and full modes.' },
  { acronym: 'vllm_ir', fullForm: 'vLLM Intermediate Representation', description: 'A portable op registry (torch.ops.vllm_ir.*) whose implementation is selected at compile time by a lowering pass.' },

  // Ecosystem
  { acronym: 'GAIE / EPP', fullForm: 'Gateway API Inference Extension / Endpoint Picker', description: 'Kubernetes inference-aware routing. GAIE defines the InferencePool API and the Endpoint Picker protocol; the production Endpoint Picker ships in the llm-d Router. The EPP scores endpoints on KV/prefix-hit, queue depth, session affinity, latency, and LoRA residency.' },
  { acronym: 'KServe', fullForm: 'Kubernetes Serving', description: 'The Kubernetes serving operator (LLMInferenceService CRD) used with llm-d to run vLLM at scale.' },
  { acronym: 'llm-d', fullForm: 'LLM Distributed', description: 'CNCF-sandbox Kubernetes-native distributed-inference layer running vLLM as its primary engine; SGLang and TensorRT-LLM images are also published.' },
  { acronym: 'KubeRay', fullForm: 'Kubernetes Ray', description: 'The Kubernetes operator that runs Ray clusters (RayService/RayCluster CRDs) for Ray Serve LLM + vLLM.' },
  { acronym: 'GuideLLM', fullForm: 'Guide LLM', description: 'The vLLM-project benchmarking tool that sweeps load to map the throughput/latency curve.' },
  { acronym: 'OTLP', fullForm: 'OpenTelemetry Protocol', description: 'Tracing export protocol vLLM supports via --otlp-traces-endpoint (carries a performance cost).' },
  { acronym: 'Weight cache daemon', fullForm: 'vllm preload weight cache daemon', description: 'One process per GPU that loads its weight shard once, runs quantization post-processing and holds the result in GPU memory, so an engine started with --load-format ipc_cache maps the weights over CUDA IPC instead of reloading them.' },
  { acronym: 'CRIU', fullForm: 'Checkpoint/Restore In Userspace', description: 'Linux process checkpoint tool. vllm snapshot uses it with its CUDA plugin to capture an initialized engine and restore it on the same host.' },

  // AWS
  { acronym: 'Trainium / Inferentia', fullForm: 'AWS Trainium / Inferentia', description: 'AWS custom AI accelerators; vLLM runs on them through the vllm-neuron hardware plugin.' },
  { acronym: 'Neuron / NxDI', fullForm: 'AWS Neuron SDK / NxD Inference', description: 'The AWS Neuron SDK, and NxD Inference (neuronx-distributed-inference), its inference library, which is in maintenance mode. The vllm-neuron 1.x plugin ships its own model code and does not depend on NxD Inference; the 0.5.x plugin line runs on it.' },
  { acronym: 'EKS', fullForm: 'Elastic Kubernetes Service', description: 'AWS managed Kubernetes; the canonical place to run vLLM with DLCs, Karpenter, and LeaderWorkerSet.' },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: 'AWS-published, pre-built vLLM container images on ECR Public.' },
  { acronym: 'LWS', fullForm: 'LeaderWorkerSet', description: 'A Kubernetes API for grouping a leader + worker pods together for multi-node serving.' },
  { acronym: 'LMI', fullForm: 'Large Model Inference', description: 'The SageMaker DJL-Serving container family that runs vLLM as its backend (async mode by default since LMI v17).' },
  { acronym: 'ODCR', fullForm: 'On-Demand Capacity Reservation', description: 'Reserved EC2 capacity; created inside a cluster placement group to control co-location.' },
  { acronym: 'Cluster placement group', fullForm: 'Cluster Placement Group', description: 'Packs instances into one AZ on a high-bisection-bandwidth segment (up to 10 Gbps single-flow) for low-latency multi-node work.' },
  { acronym: 'DescribeInstanceTopology', fullForm: 'DescribeInstanceTopology API', description: 'A diagnostic EC2 API returning a relative NetworkNodes proximity hierarchy for running instances, used to assign ranks, not to place instances.' },
  { acronym: 'UltraCluster', fullForm: 'EC2 UltraCluster', description: 'Co-located accelerated EC2 instances on a petabit-scale EFA network; Capacity Blocks auto-place inside one.' },
  { acronym: 'Bedrock', fullForm: 'Amazon Bedrock', description: 'AWS managed foundation-model API; the lower-ops alternative to self-hosting vLLM.' },

  // SageMaker integration (Section 25)
  { acronym: 'DJL-Serving', fullForm: 'Deep Java Library Serving', description: 'The model server inside the SageMaker LMI container; runs vLLM (or TensorRT-LLM) behind a unified config format.' },
  { acronym: 'async mode (LMI)', fullForm: 'LMI Asynchronous Mode', description: 'LMI default since v17; wires LMI straight to vLLM\'s AsyncLLM (aliased AsyncLLMEngine) via vLLM\'s OpenAI modules, replacing the legacy OPTION_ROLLING_BATCH path.' },
  { acronym: 'serving.properties', fullForm: 'LMI serving.properties', description: 'LMI config file using option.* keys (overriding the equivalent OPTION_* env vars); pass-through keys forward opaquely to vLLM EngineArgs.' },
  { acronym: 'Inference Component', fullForm: 'SageMaker Inference Component', description: 'A hosting object on a real-time endpoint reserving accelerators/memory with its own copy counts; the unit that enables scale-to-zero and multi-LoRA fan-out.' },
  { acronym: 'scale-to-zero', fullForm: 'Scale to Zero', description: 'Scaling a SageMaker endpoint to 0 instances when idle; available only with Inference Components (MinInstanceCount 0); scaling back out takes several minutes.' },
  { acronym: 'ConcurrentRequestsPerModel', fullForm: 'Concurrent Requests Per Model', description: 'A high-resolution, streaming-aware SageMaker autoscaling metric counting in-flight requests until the last streamed token; faster scale-out than InvocationsPerInstance.' },
  { acronym: 'HyperPod', fullForm: 'SageMaker HyperPod', description: 'EKS-only SageMaker surface running vLLM as a first-class container, with single- and multi-node inference, native prefill/decode disaggregation, an Inference Gateway (llm-d Endpoint Picker), and KEDA autoscaling.' },
  { acronym: 'JumpStart', fullForm: 'SageMaker JumpStart', description: 'One-click deploy of catalog models onto a SageMaker endpoint via JumpStartModel(...).deploy(), in the container JumpStart selects for each model.' },
  { acronym: 'SM_VLLM_*', fullForm: 'SageMaker vLLM entrypoint env vars', description: 'The env-var contract of vLLM\'s SageMaker entrypoint (examples/deployment/sagemaker-entrypoint.sh, Docker target vllm-sagemaker): it maps SM_VLLM_* variables to vllm serve flags and serves on SageMaker\'s required port 8080.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The reference appendix: acronyms and the complete tier-graded bibliography for this deep dive"
          >
            Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This deep dive describes vLLM <strong>v0.31.0</strong>. Documentation
            claims are dated <strong>accessed 2026-10-16</strong>, and every
            code-level claim links to the <code>v0.31.0</code> release tag (commit{' '}
            <code>db9527a4</code>), so each one can be checked against the exact
            source it describes. Source quality is graded by
            tier: Tier 1 (official documentation, API reference, source code) is
            ground truth; Tier 2 is vendor blogs, announcements, and product pages;
            Tier 3 is peer-reviewed papers and third-party analysis. Performance
            figures from vendor or project blogs are labeled in-section as
            project-claimed and were not independently benchmarked here.
          </Box>
          <Box variant="p">
            For the hardware and memory-bandwidth foundations behind these serving
            techniques, see the sibling <strong>Silicon, Memory &amp; Inference</strong>{' '}
            deep dive; for the network transport beneath disaggregated KV transfer,
            see the <strong>Elastic Fabric Adapter (EFA)</strong> deep dive.
          </Box>
        </SpaceBetween>
      </Container>

      <Glossary entries={glossary} title="Glossary" />

      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
