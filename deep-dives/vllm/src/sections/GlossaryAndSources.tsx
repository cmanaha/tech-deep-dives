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
// All access dates 2026-06-07. Codebase claims are pinned to vLLM commit 15652a6b.

const sources: Source[] = [
  // vLLM — official docs (Tier 1)
  { id: 1, title: 'vLLM documentation (landing)', url: 'https://docs.vllm.ai/en/latest/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 2, title: 'vLLM — Architecture overview', url: 'https://docs.vllm.ai/en/latest/design/arch_overview/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 3, title: 'vLLM — V1 user guide', url: 'https://docs.vllm.ai/en/stable/usage/v1_guide/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 4, title: 'vLLM — Automatic prefix caching (design)', url: 'https://docs.vllm.ai/en/latest/design/prefix_caching/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 5, title: 'vLLM — Optimization & tuning', url: 'https://docs.vllm.ai/en/stable/configuration/optimization.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 6, title: 'vLLM — Conserving memory', url: 'https://docs.vllm.ai/en/latest/serving/conserving_memory.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 7, title: 'vLLM — Troubleshooting', url: 'https://docs.vllm.ai/en/latest/usage/troubleshooting.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 8, title: 'vLLM — Parallelism & scaling', url: 'https://docs.vllm.ai/en/latest/serving/parallelism_scaling/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 9, title: 'vLLM — Data-parallel deployment', url: 'https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 10, title: 'vLLM — Expert-parallel deployment', url: 'https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 11, title: 'vLLM — Disaggregated prefilling', url: 'https://docs.vllm.ai/en/stable/features/disagg_prefill/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 12, title: 'vLLM — NixlConnector usage', url: 'https://docs.vllm.ai/en/stable/features/nixl_connector_usage/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 13, title: 'vLLM — Speculative decoding', url: 'https://docs.vllm.ai/en/latest/features/speculative_decoding/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 14, title: 'vLLM — Quantization', url: 'https://docs.vllm.ai/en/stable/features/quantization/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 15, title: 'vLLM — FP8 quantization', url: 'https://docs.vllm.ai/en/stable/features/quantization/fp8.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 16, title: 'vLLM — Quantized KV cache', url: 'https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 17, title: 'vLLM — LoRA adapters', url: 'https://docs.vllm.ai/en/latest/features/lora/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 18, title: 'vLLM — Structured outputs', url: 'https://docs.vllm.ai/en/latest/features/structured_outputs/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 19, title: 'vLLM — Tool calling', url: 'https://docs.vllm.ai/en/latest/features/tool_calling/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 20, title: 'vLLM — Multimodal inputs', url: 'https://docs.vllm.ai/en/latest/features/multimodal_inputs.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 21, title: 'vLLM — OpenAI-compatible server', url: 'https://docs.vllm.ai/en/latest/serving/openai_compatible_server/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 22, title: 'vLLM — Metrics (design)', url: 'https://docs.vllm.ai/en/latest/design/metrics/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 23, title: 'vLLM — CacheConfig API reference', url: 'https://docs.vllm.ai/en/latest/api/vllm/config/cache.html', tier: 1, type: 'api-reference', accessDate: '2026-06-07' },
  { id: 24, title: 'vLLM — LoRAConfig API reference', url: 'https://docs.vllm.ai/en/latest/api/vllm/config/lora.html', tier: 1, type: 'api-reference', accessDate: '2026-06-07' },
  { id: 25, title: 'vLLM — KubeRay integration', url: 'https://docs.vllm.ai/en/latest/deployment/integrations/kuberay/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 26, title: 'vLLM — KServe integration', url: 'https://docs.vllm.ai/en/latest/deployment/integrations/kserve/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 27, title: 'vLLM — LiteLLM integration', url: 'https://docs.vllm.ai/en/latest/deployment/frameworks/litellm/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 28, title: 'vLLM — Open WebUI integration', url: 'https://docs.vllm.ai/en/latest/deployment/frameworks/open-webui/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 29, title: 'vLLM — AWS Neuron installation (v0.10.1)', url: 'https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },

  // vLLM — source code (Tier 1), pinned to the analyzed commit
  { id: 30, title: 'vLLM source — commit 15652a6b (analysis baseline)', url: 'https://github.com/vllm-project/vllm/tree/15652a6b', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 31, title: 'vLLM source — vllm/v1 (V1 engine)', url: 'https://github.com/vllm-project/vllm/tree/15652a6b/vllm/v1', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 32, title: 'vLLM source — vllm/config', url: 'https://github.com/vllm-project/vllm/tree/main/vllm/config', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 33, title: 'vLLM source — vllm/model_executor', url: 'https://github.com/vllm-project/vllm/tree/15652a6b/vllm/model_executor', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 34, title: 'vLLM source — benchmarks/', url: 'https://github.com/vllm-project/vllm/tree/main/benchmarks', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 35, title: 'vLLM source — Prometheus + Grafana example', url: 'https://github.com/vllm-project/vllm/tree/main/examples/observability/prometheus_grafana', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 36, title: 'vLLM source — OpenTelemetry example', url: 'https://github.com/vllm-project/vllm/tree/main/examples/observability/opentelemetry', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 37, title: 'vllm-project/vllm-neuron (Neuron plugin)', url: 'https://github.com/vllm-project/vllm-neuron', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 38, title: 'aws-neuron/upstreaming-to-vllm (AWS fork)', url: 'https://github.com/aws-neuron/upstreaming-to-vllm', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 39, title: 'vllm-project/production-stack', url: 'https://github.com/vllm-project/production-stack', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 40, title: 'vllm-project/guidellm (benchmark tool)', url: 'https://github.com/vllm-project/guidellm', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 41, title: 'Inferact/vllm-frontend-rs (Rust frontend origin)', url: 'https://github.com/Inferact/vllm-frontend-rs', tier: 1, type: 'source-code', accessDate: '2026-06-07' },

  // vLLM — blog / announcements (Tier 2)
  { id: 42, title: 'vLLM blog — V1 alpha release (Jan 2025)', url: 'https://vllm.ai/blog/2025-01-27-v1-alpha-release', tier: 2, type: 'announcement', accessDate: '2026-06-07' },
  { id: 43, title: 'vLLM blog — vLLM Router release (Dec 2025)', url: 'https://vllm-project.github.io/2025/12/13/vllm-router-release.html', tier: 2, type: 'announcement', accessDate: '2026-06-07' },
  { id: 44, title: 'PyTorch Foundation welcomes vLLM (press release)', url: 'https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html', tier: 2, type: 'announcement', accessDate: '2026-06-07' },

  // AWS — official docs (Tier 1)
  { id: 50, title: 'AWS EC2 — Placement strategies', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 51, title: 'AWS EC2 — How instance topology works', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 52, title: 'AWS EC2 — Instance topology prerequisites', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 53, title: 'AWS EC2 — DescribeInstanceTopology API', url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html', tier: 1, type: 'api-reference', accessDate: '2026-06-07' },
  { id: 54, title: 'AWS EC2 — Capacity Blocks for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 55, title: 'AWS EC2 — EFA + NIXL for inference', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 56, title: 'AWS EC2 — EFA + NCCL for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 57, title: 'AWS EKS — vLLM high-throughput inference quickstart', url: 'https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 58, title: 'AWS EKS — AI/ML compute best practices', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 59, title: 'AWS — vLLM Deep Learning Container on SageMaker', url: 'https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/dlc-vllm-sagemaker.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 60, title: 'AWS Neuron — What’s New', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 61, title: 'AWS Neuron — NxD Inference vLLM guide', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 62, title: 'AWS Neuron — NxD Inference release notes', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nxd-inference.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 63, title: 'awslabs/ml-container-creator (SageMaker BYOC)', url: 'https://github.com/awslabs/ml-container-creator', tier: 1, type: 'aws-open-source', accessDate: '2026-06-07' },

  // AWS — blogs / announcements / product pages (Tier 2)
  { id: 70, title: 'AWS What’s New — NIXL with EFA (Mar 2026)', url: 'https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/', tier: 2, type: 'announcement', accessDate: '2026-06-07' },
  { id: 71, title: 'AWS ML Blog — Deploy LLMs on EKS with vLLM DLCs', url: 'https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 72, title: 'AWS ML Blog — Disaggregated inference on AWS with llm-d', url: 'https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 73, title: 'AWS ML Blog — Scaling Rufus with Trainium + vLLM', url: 'https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 74, title: 'AWS ML Blog — Multi-LoRA / MoE vLLM on SageMaker + Bedrock', url: 'https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 75, title: 'AWS ML Blog — P-EAGLE parallel speculative decoding in vLLM', url: 'https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 76, title: 'Amazon Bedrock (product page)', url: 'https://aws.amazon.com/bedrock/', tier: 2, type: 'product-page', accessDate: '2026-06-07' },

  // Ecosystem — official docs / source (Tier 1)
  { id: 80, title: 'Ray Serve LLM — Serving LLMs', url: 'https://docs.ray.io/en/latest/serve/llm/index.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 81, title: 'Ray Serve LLM — vLLM compatibility', url: 'https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 82, title: 'llm-d (GitHub)', url: 'https://github.com/llm-d/llm-d', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 83, title: 'llm-d-inference-scheduler (GitHub)', url: 'https://github.com/llm-d/llm-d-inference-scheduler', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 84, title: 'Kubernetes Gateway API Inference Extension (GitHub)', url: 'https://github.com/kubernetes-sigs/gateway-api-inference-extension', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 85, title: 'Gateway API Inference Extension (docs)', url: 'https://gateway-api-inference-extension.sigs.k8s.io/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 86, title: 'kubernetes-sigs/inference-perf (GitHub)', url: 'https://github.com/kubernetes-sigs/inference-perf', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 87, title: 'NVIDIA Dynamo (GitHub: ai-dynamo/dynamo)', url: 'https://github.com/ai-dynamo/dynamo', tier: 1, type: 'source-code', accessDate: '2026-06-07' },
  { id: 88, title: 'LMCache documentation', url: 'https://docs.lmcache.ai/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 89, title: 'DJL — LMI container (vLLM backend)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 90, title: 'DJL — LMI vLLM user guide', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 91, title: 'SGLang documentation', url: 'https://docs.sglang.ai/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 92, title: 'TensorRT-LLM documentation', url: 'https://nvidia.github.io/TensorRT-LLM/', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 93, title: 'Hugging Face Text Generation Inference (TGI) docs', url: 'https://huggingface.co/docs/text-generation-inference', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },

  // Ecosystem / vendor — blogs (Tier 2)
  { id: 100, title: 'NVIDIA Technical Blog — Introducing NVIDIA Dynamo', url: 'https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/', tier: 2, type: 'blog', accessDate: '2026-06-07' },
  { id: 101, title: 'NVIDIA Technical Blog — Dynamo accelerates llm-d', url: 'https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/', tier: 2, type: 'blog', accessDate: '2026-06-07' },
  { id: 102, title: 'llm-d Blog — Production inference with KServe + llm-d + vLLM', url: 'https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm', tier: 2, type: 'blog', accessDate: '2026-06-07' },
  { id: 103, title: 'Anyscale Blog — Ray Serve LLM: Wide-EP & disaggregated serving with vLLM', url: 'https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm', tier: 2, type: 'blog', accessDate: '2026-06-07' },
  { id: 104, title: 'LiteLLM — Security update (Mar 2026 advisory)', url: 'https://docs.litellm.ai/blog/security-update-march-2026', tier: 2, type: 'announcement', accessDate: '2026-06-07' },

  // Academic papers (Tier 3)
  { id: 110, title: 'Kwon et al. — Efficient Memory Management for LLM Serving with PagedAttention (arXiv:2309.06180)', url: 'https://arxiv.org/abs/2309.06180', tier: 3, type: 'academic-paper', accessDate: '2026-06-07' },
  { id: 111, title: 'Leviathan et al. — Fast Inference via Speculative Decoding (arXiv:2211.17192)', url: 'https://arxiv.org/abs/2211.17192', tier: 3, type: 'academic-paper', accessDate: '2026-06-07' },

  // Third-party analysis (Tier 3)
  { id: 120, title: 'Datadog Security Labs — LiteLLM PyPI supply-chain campaign', url: 'https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/', tier: 3, type: 'third-party-analysis', accessDate: '2026-06-07' },

  // AWS SageMaker — deep integration (Section 25), Tier 1 docs / source
  { id: 130, title: 'DJL LMI — Container & model configurations (option.* / pass-through)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/configurations.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 131, title: 'DJL LMI — Release notes (LMI → vLLM version mapping)', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/release_notes.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 132, title: 'DJL LMI — Deploying your model on a SageMaker endpoint', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/deploying-your-endpoint.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 133, title: 'DJL LMI — Chat input/output schema', url: 'https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/chat_input_output_schema.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 134, title: 'AWS SageMaker — Model deploy feature matrix', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 135, title: 'AWS SageMaker — Inference deployment options', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 136, title: 'AWS SageMaker — Model hosting FAQs (limits / timeouts)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 137, title: 'AWS SageMaker — Large-model inference hosting parameters', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 138, title: 'AWS SageMaker — CloudWatch metrics', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 139, title: 'AWS SageMaker — Endpoint auto-scaling policy (Inference Components)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-policy.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 140, title: 'AWS SageMaker — Define an auto-scaling policy', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 141, title: 'AWS SageMaker HyperPod — Model deployment (vLLM container)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 142, title: 'AWS SageMaker HyperPod — Deploy a model with kubectl (S3/FSx/HF)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 143, title: 'AWS SageMaker HyperPod — Inference autoscaling (KEDA / Karpenter, JumpStartModel CRD)', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html', tier: 1, type: 'official-docs', accessDate: '2026-06-07' },
  { id: 144, title: 'aws/model-hosting-container-standards (vLLM-on-SageMaker quickstart, SM_VLLM_*)', url: 'https://github.com/aws/model-hosting-container-standards', tier: 1, type: 'aws-open-source', accessDate: '2026-06-07' },
  { id: 145, title: 'vLLM RFC — SageMaker session affinity / X-Amzn-SageMaker-Session-Id (#28163)', url: 'https://github.com/vllm-project/vllm/issues/28163', tier: 1, type: 'source-code', accessDate: '2026-06-07' },

  // AWS SageMaker — deep integration (Section 25), Tier 2 blogs / samples
  { id: 146, title: 'AWS ML Blog — SageMaker LMI container v15 (async mode; JumpStart on LMI/vLLM)', url: 'https://aws.amazon.com/blogs/machine-learning/supercharge-your-llm-performance-with-amazon-sagemaker-large-model-inference-container-v15/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 147, title: 'AWS ML Blog — Multi-tenant LoRA serving on Amazon SageMaker', url: 'https://aws.amazon.com/blogs/machine-learning/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 148, title: 'AWS ML Blog — Scale down to zero in SageMaker Inference', url: 'https://aws.amazon.com/blogs/machine-learning/unlock-cost-savings-with-the-new-scale-down-to-zero-feature-in-amazon-sagemaker-inference/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 149, title: 'AWS ML Blog — Faster autoscaling for generative AI (ConcurrentRequestsPerModel)', url: 'https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 150, title: 'AWS ML Blog — Enhanced metrics for SageMaker AI endpoints', url: 'https://aws.amazon.com/blogs/machine-learning/enhanced-metrics-for-amazon-sagemaker-ai-endpoints-deeper-visibility-for-better-performance/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 151, title: 'AWS ML Blog — Real-time voice with SageMaker AI + vLLM (streaming)', url: 'https://aws.amazon.com/blogs/machine-learning/build-real-time-voice-applications-with-amazon-sagemaker-ai-and-vllm/', tier: 2, type: 'aws-blog', accessDate: '2026-06-07' },
  { id: 152, title: 'aws-samples/load-test-llm-with-locust (sagemaker_vllm_loadtest.ipynb)', url: 'https://github.com/aws-samples/load-test-llm-with-locust', tier: 2, type: 'aws-open-source', accessDate: '2026-06-07' },
];

const glossary: GlossaryEntry[] = [
  // Engine core
  { acronym: 'vLLM', fullForm: 'Virtual Large Language Model', description: 'Open-source high-throughput, memory-efficient LLM inference and serving engine; hosted by the PyTorch Foundation.' },
  { acronym: 'V1', fullForm: 'vLLM V1 Engine', description: 'The 2025 re-architecture of vLLM’s core: unified scheduler, multi-process EngineCore, near-zero CPU overhead. V0 is fully deprecated.' },
  { acronym: 'EngineCore', fullForm: 'Engine Core Process', description: 'The isolated V1 process running the scheduler + executor busy loop, separated from the API/tokenization frontend over ZMQ.' },
  { acronym: 'PagedAttention', fullForm: 'Paged Attention', description: 'Manages the KV cache in fixed-size blocks mapped to non-contiguous physical pages (OS virtual-memory analogy), eliminating fragmentation.' },
  { acronym: 'KV cache', fullForm: 'Key-Value Cache', description: 'Per-layer per-head K and V tensors cached during decode to avoid recomputation; usually the dominant serving-memory consumer.' },
  { acronym: 'APC', fullForm: 'Automatic Prefix Caching', description: 'Reuse of already-computed KV blocks across requests sharing a prefix; enabled by default in V1.' },
  { acronym: 'TTFT', fullForm: 'Time To First Token', description: 'Latency from request arrival to the first output token; dominated by the compute-bound prefill phase.' },
  { acronym: 'ITL / TPOT', fullForm: 'Inter-Token Latency / Time Per Output Token', description: 'Average time between successive output tokens during the memory-bandwidth-bound decode phase.' },
  { acronym: 'ZMQ', fullForm: 'ZeroMQ', description: 'The message-passing sockets (ROUTER/PULL/DEALER/PUSH) carrying msgpack-encoded requests between the vLLM frontend and EngineCore.' },

  // Parallelism & distribution
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Sharding tensors within a layer across devices; needs a fast intra-node interconnect.' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Splitting model layers across pipeline stages on different devices/nodes.' },
  { acronym: 'EP', fullForm: 'Expert Parallelism', description: 'Sharding Mixture-of-Experts experts across devices; “Wide-EP” spreads experts across many nodes.' },
  { acronym: 'DP', fullForm: 'Data Parallelism', description: 'Replicating the model for throughput; for MoE, DP-attention composes with EP.' },
  { acronym: 'EPLB', fullForm: 'Expert-Parallel Load Balancing', description: 'Rebalancing MoE expert placement across devices to even out load.' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'Sparse-activation architecture where the top-k of N experts fire per token.' },
  { acronym: 'GQA / MQA / MLA', fullForm: 'Grouped / Multi-Query / Multi-head Latent Attention', description: 'Attention variants that shrink the KV cache by reducing or compressing KV heads.' },

  // KV transfer & networking
  { acronym: 'P/D disaggregation', fullForm: 'Prefill / Decode Disaggregation', description: 'Running prefill and decode on separate instances to tune TTFT and ITL independently. A latency/SLO-isolation optimization — it does not raise throughput.' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'Point-to-point library for asynchronous KV-cache transfer over UCX / libfabric / RDMA; vLLM’s NixlConnector wraps it.' },
  { acronym: 'LMCache', fullForm: 'LM Cache', description: 'External KV-cache layer (CPU/disk/Redis/S3) integrated via a vLLM KV connector; enables cross-instance KV reuse.' },
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'AWS OS-bypass network interface for HPC/ML; the LIBFABRIC backend lets vLLM’s NixlConnector move KV cache over EFA.' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'Network primitive that writes directly to remote memory without CPU involvement; GPUDirect RDMA sources directly from GPU HBM.' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'GPU collective library used for TP/PP/EP all-reduce / all-gather / all-to-all.' },

  // Precision & quantization
  { acronym: 'FP8 (E4M3 / E5M2)', fullForm: 'Float Point 8-bit', description: 'Forward-pass / wider-range 8-bit float formats supported for weights, activations, and KV cache on Ada/Hopper+.' },
  { acronym: 'AWQ', fullForm: 'Activation-aware Weight Quantization', description: 'Weight-only quantization scheme supported via AutoAWQ checkpoints.' },
  { acronym: 'GPTQ', fullForm: 'Generative Pre-trained Transformer Quantization', description: 'Post-training weight-only quantization (often INT4) served via Marlin kernels.' },
  { acronym: 'NVFP4 / MXFP4', fullForm: 'NVIDIA FP4 / Microscaling FP4', description: '4-bit float formats with block scaling, targeted at Blackwell-class hardware.' },
  { acronym: 'W8A8', fullForm: 'Weight-8-bit Activation-8-bit', description: 'Quantization that quantizes both weights and activations (INT8 or FP8).' },

  // Decoding techniques
  { acronym: 'EAGLE', fullForm: 'Extrapolation Algorithm for Greater Language-model Efficiency', description: 'A speculative-decoding draft method (EAGLE / EAGLE-3) supported in vLLM.' },
  { acronym: 'MTP', fullForm: 'Multi-Token Prediction', description: 'Speculative-decoding method using a model’s native multi-token-prediction heads.' },
  { acronym: 'LoRA', fullForm: 'Low-Rank Adaptation', description: 'Cheap fine-tuning adapters served on a shared base model; vLLM batches many adapters via Punica-style kernels.' },
  { acronym: 'Punica', fullForm: 'Punica (multi-LoRA kernels)', description: 'The batched shrink/expand kernel scheme that lets many LoRA adapters run in one batch.' },

  // Compilation
  { acronym: 'CUDA graph', fullForm: 'CUDA Graph', description: 'A captured/replayed GPU execution graph that removes per-step launch overhead; vLLM uses piecewise and full modes.' },
  { acronym: 'vllm_ir', fullForm: 'vLLM Intermediate Representation', description: 'A portable op registry (torch.ops.vllm_ir.*) whose implementation is selected at compile time by a lowering pass.' },

  // Ecosystem
  { acronym: 'GAIE / EPP', fullForm: 'Gateway API Inference Extension / Endpoint Picker', description: 'Kubernetes inference-aware routing: the EPP scores endpoints on KV/prefix-hit, queue depth, session affinity, latency, and LoRA residency.' },
  { acronym: 'KServe', fullForm: 'Kubernetes Serving', description: 'The Kubernetes serving operator (LLMInferenceService CRD) used with llm-d to run vLLM at scale.' },
  { acronym: 'llm-d', fullForm: 'LLM Distributed', description: 'CNCF-sandbox Kubernetes-native distributed-inference layer running vLLM as the engine.' },
  { acronym: 'KubeRay', fullForm: 'Kubernetes Ray', description: 'The Kubernetes operator that runs Ray clusters (RayService/RayCluster CRDs) for Ray Serve LLM + vLLM.' },
  { acronym: 'GuideLLM', fullForm: 'Guide LLM', description: 'The vLLM-project benchmarking tool that sweeps load to map the throughput/latency curve.' },
  { acronym: 'OTLP', fullForm: 'OpenTelemetry Protocol', description: 'Tracing export protocol vLLM supports via --otlp-traces-endpoint (carries a performance cost).' },

  // AWS
  { acronym: 'Trainium / Inferentia', fullForm: 'AWS Trainium / Inferentia', description: 'AWS custom AI accelerators; vLLM runs on them via the vllm-neuron plugin on NxD Inference.' },
  { acronym: 'Neuron / NxDI', fullForm: 'AWS Neuron SDK / NxD Inference', description: 'The AWS software stack (neuronx-distributed-inference) under which vLLM executes on Trainium/Inferentia.' },
  { acronym: 'EKS', fullForm: 'Elastic Kubernetes Service', description: 'AWS managed Kubernetes; the canonical place to run vLLM with DLCs, Karpenter, and LeaderWorkerSet.' },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: 'AWS-published, pre-built vLLM container images on ECR Public.' },
  { acronym: 'LWS', fullForm: 'LeaderWorkerSet', description: 'A Kubernetes API for grouping a leader + worker pods together for multi-node serving.' },
  { acronym: 'LMI', fullForm: 'Large Model Inference', description: 'The SageMaker DJL-Serving container family that runs vLLM as its backend (async mode by default since LMI v17).' },
  { acronym: 'ODCR', fullForm: 'On-Demand Capacity Reservation', description: 'Reserved EC2 capacity; created inside a cluster placement group to control co-location.' },
  { acronym: 'Cluster placement group', fullForm: 'Cluster Placement Group', description: 'Packs instances into one AZ on a high-bisection-bandwidth segment (up to 10 Gbps single-flow) for low-latency multi-node work.' },
  { acronym: 'DescribeInstanceTopology', fullForm: 'DescribeInstanceTopology API', description: 'A diagnostic EC2 API returning a relative NetworkNodes proximity hierarchy for running instances — used to assign ranks, not to place instances.' },
  { acronym: 'UltraCluster', fullForm: 'EC2 UltraCluster', description: 'Co-located accelerated EC2 instances on a petabit-scale EFA network; Capacity Blocks auto-place inside one.' },
  { acronym: 'Bedrock', fullForm: 'Amazon Bedrock', description: 'AWS managed foundation-model API; the lower-ops alternative to self-hosting vLLM.' },

  // SageMaker integration (Section 25)
  { acronym: 'DJL-Serving', fullForm: 'Deep Java Library Serving', description: 'The model server inside the SageMaker LMI container; runs vLLM (or TensorRT-LLM) behind a unified config format.' },
  { acronym: 'async mode (LMI)', fullForm: 'LMI Asynchronous Mode', description: 'LMI default since v17; wires LMI straight to vLLM’s AsyncLLMEngine via vLLM’s OpenAI modules, replacing the legacy OPTION_ROLLING_BATCH path.' },
  { acronym: 'serving.properties', fullForm: 'LMI serving.properties', description: 'LMI config file using option.* keys (overriding the equivalent OPTION_* env vars); pass-through keys forward opaquely to vLLM EngineArgs.' },
  { acronym: 'Inference Component', fullForm: 'SageMaker Inference Component', description: 'A hosting object on a real-time endpoint reserving accelerators/memory with its own copy counts; the unit that enables scale-to-zero and multi-LoRA fan-out.' },
  { acronym: 'scale-to-zero', fullForm: 'Scale to Zero', description: 'Scaling a SageMaker endpoint to 0 instances when idle; available only with Inference Components (MinInstanceCount 0); ~5–6 min cold start.' },
  { acronym: 'ConcurrentRequestsPerModel', fullForm: 'Concurrent Requests Per Model', description: 'A high-resolution (10s), streaming-aware SageMaker autoscaling metric counting in-flight requests until the last streamed token — faster scale-out than InvocationsPerInstance.' },
  { acronym: 'HyperPod', fullForm: 'SageMaker HyperPod', description: 'EKS-only SageMaker surface running vLLM as a first-class container with multi-node EFA, tiered KV cache, cache-aware routing, and KEDA/Karpenter autoscaling.' },
  { acronym: 'JumpStart', fullForm: 'SageMaker JumpStart', description: 'One-click deploy of open-source models that run on the LMI container (vLLM backend) via JumpStartModel(...).deploy().' },
  { acronym: 'SM_VLLM_*', fullForm: 'SageMaker vLLM entrypoint env vars', description: 'The env-var contract in the official vLLM SageMaker entrypoint that maps vLLM’s port 8000 to SageMaker’s required 8080 and translates settings.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The reference appendix — acronyms and the complete tier-graded bibliography for this deep dive"
          >
            Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This deep dive is a moving target: vLLM ships roughly every two weeks.
            Documentation claims are dated <strong>accessed 2026-06-07</strong>, and
            every code-level claim is pinned to vLLM commit <code>15652a6b</code> so
            it stays falsifiable as the project evolves. Source quality is graded by
            tier — Tier 1 (official documentation, API reference, source code) is
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
