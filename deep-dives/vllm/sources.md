# vLLM deep dive: sources

Generated from the inline citations in `src/` by `revamp/tools/gen-sources.mjs`. Do not edit by hand;
change the citation in the section and regenerate.

Code citations are pinned to vLLM `v0.31.0` (commit `db9527a46873454610df6dbedf79a36d6bf1a7f6`). Code links below are listed per file;
the sections link to exact line ranges. Tiers follow CLAUDE.md "Fact-Checking & Sources Standard".

## Tier 1: source code at a pinned ref, official documentation, API reference, release notes

631 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [What's New: SageMaker AI bidirectional streaming](https://aws.amazon.com/about-aws/whats-new/2025/11/sagemaker-ai-inference-bidirectional-streaming/) | 2026-10-16 | AwsSageMakerBedrock |
| [AWS What's New: P6e-GB300 UltraServers, Dec 2, 2025](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/) | 2026-10-16 | AwsGpuEfaNixl |
| [AWS What's New: NIXL with EFA](https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/) | 2026-10-16 | AwsGpuEfaNixl |
| [SageMaker AI pricing (HyperPod Spot)](https://aws.amazon.com/sagemaker/ai/pricing/) | 2026-10-16 | AwsSageMakerBedrock |
| [AWS DLC docs: vLLM on SageMaker](https://aws.github.io/deep-learning-containers/vllm/deployment/sagemaker/) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [Neuron docs: NxD Inference end-of-support announcement](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-eos-nxdi-nxd-core-inference.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: Torch/XLA path in vLLM Neuron, end of support](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-eos-vllm-neuron-torch-xla.html) | 2026-10-24 | AwsNeuron |
| [AWS Neuron: What's New](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/whats-new.html) | 2026-10-24 | AwsNeuron, Sources appendix |
| [AWS Neuron: vLLM User Guide for NxD Inference](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/inference-legacy/nxd-inference/developer_guides/vllm-user-guide-v1.html) | 2026-10-24 | AwsNeuron, Sources appendix |
| [AWS Neuron: NxD Inference release notes](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/release-notes/archive/nxd-inference.html) | 2026-10-24 | AwsNeuron, Sources appendix |
| [Neuron docs: Containers release notes](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/release-notes/components/containers.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: DLAMI release notes](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/release-notes/components/dlamis.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: How vLLM is integrated with TorchNeuron](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/design/compilation/how_vllm_is_integrated_with_torchneuron.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: How to choose a compilation route](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/guides/how-to-choose-compilation-route.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: How to use the Precompile Cache](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/guides/how-to-precompile-cache.html) | 2026-10-24 | AwsNeuron |
| [Neuron docs: vLLM Neuron](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/index.html) | 2026-10-24 | AwsNeuron |
| [EC2 API: DescribeCapacityReservationTopology](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html) | 2026-10-16 | Ec2TopologyPlacement |
| [EC2 API: DescribeInstanceTopology](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [EC2 API: InstanceTopology](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceTopology.html) | 2026-10-16 | Ec2TopologyPlacement |
| [EC2 User Guide: Capacity Reservations in cluster placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html) | 2026-10-16 | Ec2TopologyPlacement |
| [AWS EC2: Capacity Blocks for ML](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [EC2 User Guide: Topology prerequisites](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [EFA installer changelog](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html) | 2026-10-16 | AwsGpuEfaNixl |
| [AWS EC2: EFA + NCCL for ML](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [EC2 User Guide: EFA and NIXL](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html) | 2026-10-16 | AwsGpuEfaNixl, Ec2TopologyPlacement, Sources appendix |
| [AWS EC2 User Guide: EFA supported instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html) | 2026-10-16 | AwsGpuEfaNixl |
| [AWS EC2: How instance topology works](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [AWS EC2: Placement strategies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html) | 2026-10-16 | Ec2TopologyPlacement, Sources appendix |
| [Bedrock: Custom Model Import](https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html) | 2026-10-16 | AwsSageMakerBedrock, DecisionGuide |
| [AWS Decision Guide](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/bedrock-or-sagemaker.html) | 2026-10-16 | AwsSageMakerBedrock |
| [EC2 accelerated computing instance specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) | 2026-10-16 | AwsGpuEfaNixl |
| [EKS Best Practices: AI/ML Compute](https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html) | 2026-10-16 | AwsEks, AwsSageMakerBedrock, Sources appendix |
| [EKS User Guide: Create a Node Class](https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html) | 2026-10-18 | AwsEks |
| [EKS User Guide: Load & Serve Models on Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html) | 2026-10-16 | AwsEks, Sources appendix |
| [Amazon EKS User Guide: EFA](https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html) | 2026-10-16 | AwsGpuEfaNixl |
| [SageMaker API: InvokeEndpoint](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpoint.html) | 2026-10-18 | AwsSageMakerBedrock |
| [SageMaker API: InvokeEndpointWithResponseStream](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpointWithResponseStream.html) | 2026-10-18 | AwsSageMakerBedrock |
| [AWS SageMaker: Inference deployment options](https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html) | 2026-10-16 | Sources appendix |
| [SageMaker: define an auto-scaling policy](https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html) | 2026-10-16, 2026-10-17 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker endpoint auto-scaling policy](https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-policy.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker: scale an endpoint to zero instances](https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-zero-instances.html) | 2026-10-16, 2026-10-18 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker hosting FAQs](https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker large-model inference hosting](https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker deploy feature matrix](https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html) | 2026-10-16, 2026-10-18 | AwsSageMakerBedrock, Sources appendix |
| [SageMaker detailed observability](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch-detailed-observability.html) | 2026-10-16 | AwsSageMakerBedrock |
| [SageMaker enhanced metrics](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch-enhanced-metrics.html) | 2026-10-16 | AwsSageMakerBedrock |
| [SageMaker CloudWatch metrics](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [Getting started with detailed observability](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-detailed-observability-getting-started.html) | 2026-10-16 | AwsSageMakerBedrock |
| [SageMaker docs: OpenAI-compatible APIs](https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-openai-compatible.html) | 2026-10-16 | AwsSageMakerBedrock |
| [HyperPod inference autoscaling](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [HyperPod: deploy a foundation model](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [HyperPod: disaggregated prefill and decode](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-dpd.html) | 2026-10-16 | AwsSageMakerBedrock |
| [HyperPod Inference Gateway](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-inference-gateway.html) | 2026-10-16 | AwsSageMakerBedrock |
| [HyperPod: set up inference](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-setup.html) | 2026-10-18 | AwsSageMakerBedrock |
| [HyperPod model deployment](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [DJL LMI: Container & model configurations (option.* / pass-through)](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/configurations.html) | 2026-10-16 | Sources appendix |
| [DJL LMI: Deploying your model on a SageMaker endpoint](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/deploying-your-endpoint.html) | 2026-10-16 | Sources appendix |
| [DJL docs: LMI container overview](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [DJL docs: LMI release notes](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/release_notes.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [DJL LMI: Chat input/output schema](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/chat_input_output_schema.html) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [DJL: LMI vLLM user guide](https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html) | 2026-10-16 | Sources appendix |
| [LiteLLM security advisory (vendor)](https://docs.litellm.ai/blog/security-update-march-2026) | 2026-10-16 | OperationsFailureModes |
| [LiteLLM docs: AI Gateway](https://docs.litellm.ai/docs/simple_proxy) | 2026-10-16 | GatewaysAppLayer |
| [LMCache documentation](https://docs.lmcache.ai/) | 2026-10-16 | Sources appendix |
| [Python docs: argparse allow_abbrev](https://docs.python.org/3/library/argparse.html#allow-abbrev) | 2026-10-16 | PagedAttentionKV |
| [Ray Serve LLM overview](https://docs.ray.io/en/releases-2.59.0/serve/llm/index.html) | 2026-10-16 | RayServeLLM, Sources appendix |
| [vLLM compatibility guide](https://docs.ray.io/en/releases-2.59.0/serve/llm/user-guides/vllm-compatibility.html) | 2026-10-16 | RayServeLLM, Sources appendix |
| [Ray Serve: fault tolerance, replica health-checking](https://docs.ray.io/en/releases-2.59.0/serve/production-guide/fault-tolerance.html) | 2026-10-16 | RayServeLLM |
| [SGLang docs](https://docs.sglang.io/) | 2026-10-16 | Sources appendix, WhenNotVllm |
| [vLLM v0.10.1 docs: AWS Neuron installation](https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html) | 2026-10-24 | AwsNeuron |
| [vLLM v0.27.0 docs: Speculative Decoding](https://docs.vllm.ai/en/v0.27.0/features/speculative_decoding/) | 2026-10-16 | SpeculativeDecoding |
| [vLLM docs: home page](https://docs.vllm.ai/en/v0.31.0/) | 2026-10-16 | Sources appendix, ThesisAndFraming |
| [vLLM: CacheConfig API reference](https://docs.vllm.ai/en/v0.31.0/api/vllm/config/cache/) | 2026-10-16 | Sources appendix |
| [vLLM docs: LoRAConfig](https://docs.vllm.ai/en/v0.31.0/api/vllm/config/lora/) | 2026-10-16 | LoRAServing, Sources appendix |
| [vLLM: Conserving memory](https://docs.vllm.ai/en/v0.31.0/configuration/conserving_memory/) | 2026-10-16 | OperationsFailureModes, PagedAttentionKV, Sources appendix |
| [vLLM: Optimization & tuning](https://docs.vllm.ai/en/v0.31.0/configuration/optimization/) | 2026-10-16 | DecisionGuide, DistributedInference, OperationsFailureModes, PagedAttentionKV, SchedulerBatching, Sources appendix |
| [vLLM docs: Optimization and tuning](https://docs.vllm.ai/en/v0.31.0/configuration/optimization/#performance-tuning-with-chunked-prefill) | 2026-10-16 | InferenceWorkload |
| [vLLM docs: Registering a model](https://docs.vllm.ai/en/v0.31.0/contributing/model/registration/) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vLLM docs: LiteLLM](https://docs.vllm.ai/en/v0.31.0/deployment/frameworks/litellm/) | 2026-10-16 | GatewaysAppLayer, Sources appendix |
| [vLLM docs: Open WebUI](https://docs.vllm.ai/en/v0.31.0/deployment/frameworks/open-webui/) | 2026-10-16 | GatewaysAppLayer, Sources appendix |
| [vLLM docs: KServe](https://docs.vllm.ai/en/v0.31.0/deployment/integrations/kserve/) | 2026-10-16 | LlmdKServe, Sources appendix |
| [vLLM docs: KubeRay](https://docs.vllm.ai/en/v0.31.0/deployment/integrations/kuberay/) | 2026-10-16 | RayServeLLM, Sources appendix |
| [vLLM: Architecture overview](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/) | 2026-10-16 | Sources appendix |
| [vLLM docs: API server process](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/#api-server-process) | 2026-10-16 | V1Architecture |
| [vLLM docs: DP coordinator process](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/#dp-coordinator-process-conditional) | 2026-10-16 | V1Architecture |
| [vLLM docs: GPU worker processes](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/#gpu-worker-processes) | 2026-10-16 | V1Architecture |
| [vLLM docs: process count summary](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/#process-count-summary) | 2026-10-16 | V1Architecture |
| [vLLM docs: Dual Batch Overlap](https://docs.vllm.ai/en/v0.31.0/design/dbo/) | 2026-10-16 | DistributedInference |
| [vLLM docs: HiSparse](https://docs.vllm.ai/en/v0.31.0/design/hisparse/) | 2026-10-16 | KVOffloadingLMCache |
| [vLLM docs: Metrics](https://docs.vllm.ai/en/v0.31.0/design/metrics/) | 2026-10-16 | AwsEks, AwsSageMakerBedrock, ObservabilityBench, Sources appendix |
| [vLLM docs: Model Runner V2 design](https://docs.vllm.ai/en/v0.31.0/design/model_runner_v2.html) | 2026-10-16 | codebase/CodebaseExecution |
| [vLLM docs: NIXL push-mode KV transfer](https://docs.vllm.ai/en/v0.31.0/design/nixl_kv_push_connector/) | 2026-10-16 | DisaggregatedServing, codebase/CodebaseDistributed |
| [vLLM docs: Optimization Levels](https://docs.vllm.ai/en/v0.31.0/design/optimization_levels.html) | 2026-10-16 | codebase/CodebaseConfig |
| [vLLM docs: Plugin system](https://docs.vllm.ai/en/v0.31.0/design/plugin_system/) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vLLM: Automatic prefix caching (design)](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) | 2026-10-16 | PrefixCaching, Sources appendix |
| [vLLM docs: Disaggregated encoder](https://docs.vllm.ai/en/v0.31.0/features/disagg_encoder/) | 2026-10-16 | DisaggregatedServing |
| [vLLM: Disaggregated prefilling](https://docs.vllm.ai/en/v0.31.0/features/disagg_prefill/) | 2026-10-16 | DecisionGuide, Sources appendix |
| [vLLM docs: Initialized engine snapshots](https://docs.vllm.ai/en/v0.31.0/features/initialized_snapshots/) | 2026-10-16 | OperationsFailureModes, Sources appendix, WhenNotVllm |
| [vLLM: KV offloading usage](https://docs.vllm.ai/en/v0.31.0/features/kv_offloading_usage/) | 2026-10-16 | KVOffloadingLMCache, Sources appendix |
| [vLLM: LoRA adapters](https://docs.vllm.ai/en/v0.31.0/features/lora/) | 2026-10-16 | LoRAServing, Sources appendix |
| [vLLM: Multimodal inputs](https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/) | 2026-10-16 | OpenAICompatServer, Sources appendix |
| [vLLM docs: NixlConnector compatibility matrix](https://docs.vllm.ai/en/v0.31.0/features/nixl_connector_compatibility/) | 2026-10-16 | DisaggregatedServing, codebase/CodebaseDistributed |
| [vLLM: NixlConnector usage](https://docs.vllm.ai/en/v0.31.0/features/nixl_connector_usage/) | 2026-10-16 | Sources appendix |
| [vLLM docs: Preload](https://docs.vllm.ai/en/v0.31.0/features/preload/) | 2026-10-16 | AwsEks, OperationsFailureModes, Sources appendix |
| [vLLM: Quantization](https://docs.vllm.ai/en/v0.31.0/features/quantization/) | 2026-10-16 | OperationsFailureModes, Quantization, Sources appendix |
| [vLLM docs: BitsAndBytes](https://docs.vllm.ai/en/v0.31.0/features/quantization/bnb/) | 2026-10-16 | Quantization |
| [vLLM: FP8 quantization](https://docs.vllm.ai/en/v0.31.0/features/quantization/fp8/) | 2026-10-16 | Sources appendix |
| [vLLM docs: GGUF](https://docs.vllm.ai/en/v0.31.0/features/quantization/gguf/) | 2026-10-16 | Quantization |
| [vLLM docs: GPTQModel](https://docs.vllm.ai/en/v0.31.0/features/quantization/gptqmodel/) | 2026-10-16 | Quantization |
| [vLLM docs: FP8 W8A8](https://docs.vllm.ai/en/v0.31.0/features/quantization/llm_compressor/fp8/) | 2026-10-16 | Quantization |
| [vLLM docs: INT8 W8A8](https://docs.vllm.ai/en/v0.31.0/features/quantization/llm_compressor/int8_w8a8/) | 2026-10-16 | Quantization |
| [vLLM docs: Online quantization](https://docs.vllm.ai/en/v0.31.0/features/quantization/online/) | 2026-10-16 | Quantization |
| [vLLM: Quantized KV cache](https://docs.vllm.ai/en/v0.31.0/features/quantization/quantized_kvcache/) | 2026-10-16 | Quantization, Sources appendix |
| [vLLM: Sleep mode](https://docs.vllm.ai/en/v0.31.0/features/sleep_mode/) | 2026-10-16 | OperationsFailureModes, Sources appendix |
| [vLLM: Speculative decoding](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/) | 2026-10-16 | Sources appendix, SpeculativeDecoding |
| [vLLM docs: Per-Request Acceptance Metrics](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/acceptance_metrics/) | 2026-10-16 | SpeculativeDecoding |
| [vLLM docs: Adaptive Verification](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/adaptive_verification/) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vLLM docs: Dynamic Speculative Decoding](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/dynamic_speculative_decoding/) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vLLM docs](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/extract_hidden_states/) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vLLM docs: LiLiCorr](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/lilicorr/) | 2026-10-16 | SpeculativeDecoding |
| [vLLM docs: MTP](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/mtp/) | 2026-10-16 | SpeculativeDecoding |
| [vLLM docs: Suffix Decoding](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/suffix/) | 2026-10-16 | SpeculativeDecoding |
| [vLLM: Structured outputs](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/) | 2026-10-16 | OpenAICompatServer, Sources appendix |
| [vLLM: Tool calling](https://docs.vllm.ai/en/v0.31.0/features/tool_calling/) | 2026-10-16 | OpenAICompatServer, Sources appendix |
| [vLLM docs: Text watermarking](https://docs.vllm.ai/en/v0.31.0/features/watermarking/) | 2026-10-16 | WhenNotVllm |
| [vLLM docs: Installation](https://docs.vllm.ai/en/v0.31.0/getting_started/installation/) | 2026-10-16, 2026-10-24 | AwsNeuron, Sources appendix, WhenNotVllm |
| [vLLM docs: Quickstart](https://docs.vllm.ai/en/v0.31.0/getting_started/quickstart/) | 2026-10-16 | ThesisAndFraming |
| [vLLM docs: Context Parallel Deployment](https://docs.vllm.ai/en/v0.31.0/serving/context_parallel_deployment/) | 2026-10-16 | DistributedInference |
| [vLLM: Data-parallel deployment](https://docs.vllm.ai/en/v0.31.0/serving/data_parallel_deployment/) | 2026-10-16 | DecisionGuide, DistributedInference, Sources appendix |
| [vLLM: Expert-parallel deployment](https://docs.vllm.ai/en/v0.31.0/serving/expert_parallel_deployment/) | 2026-10-16 | DistributedInference, Sources appendix |
| [vLLM docs: Claude Code](https://docs.vllm.ai/en/v0.31.0/serving/integrations/claude_code/) | 2026-10-16 | GatewaysAppLayer |
| [vLLM docs: Codex](https://docs.vllm.ai/en/v0.31.0/serving/integrations/codex/) | 2026-10-16 | GatewaysAppLayer |
| [vLLM: OpenAI-compatible server](https://docs.vllm.ai/en/v0.31.0/serving/openai_compatible_server/) | 2026-10-16 | GatewaysAppLayer, Sources appendix |
| [vLLM: Parallelism & scaling](https://docs.vllm.ai/en/v0.31.0/serving/parallelism_scaling/) | 2026-10-16 | DistributedInference, InferenceWorkload, Sources appendix |
| [vLLM: Troubleshooting](https://docs.vllm.ai/en/v0.31.0/usage/troubleshooting/) | 2026-10-16 | OperationsFailureModes, Sources appendix |
| [vLLM docs: V1 guide](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/) | 2026-10-16 | InferenceWorkload, OperationsFailureModes, SchedulerBatching, Sources appendix, ThesisAndFraming, V1Architecture |
| [vLLM docs: V1 user guide, chunked prefill](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#chunked-prefill) | 2026-10-16 | V1Architecture |
| [vLLM docs: V1 user guide, CUDA graphs](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#cuda-graphs) | 2026-10-16 | V1Architecture |
| [vLLM docs: V1 user guide, feature support](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#feature-support) | 2026-10-16 | V1Architecture |
| [vLLM docs: V1 user guide](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#kv-cache-features) | 2026-10-16 | V1Architecture |
| [vLLM docs: V1 user guide, prompt logprobs](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#prompt-logprobs-with-prefix-caching) | 2026-10-16 | V1Architecture |
| [vLLM docs: V1 user guide, removed features](https://docs.vllm.ai/en/v0.31.0/usage/v1_guide/#removed-features) | 2026-10-16 | V1Architecture |
| [ECR Public: deep-learning-containers/vllm](https://gallery.ecr.aws/deep-learning-containers/vllm) | 2026-10-16 | AwsEks, AwsGpuEfaNixl, AwsSageMakerBedrock |
| [Gateway API Inference Extension (docs)](https://gateway-api-inference-extension.sigs.k8s.io/) | 2026-10-16 | LoRAServing, Sources appendix |
| [ai-dynamo/dynamo @ v1.5.1: components/src/dynamo/vllm/args.py](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/components/src/dynamo/vllm/args.py) | 2026-10-16 | KVOffloadingLMCache, NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: components/src/dynamo/vllm/backend_args.py](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/components/src/dynamo/vllm/backend_args.py) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: docs/fern/pages/cli/kv-aware-routing/overview.mdx](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/cli/kv-aware-routing/overview.mdx) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: docs/fern/pages/kubernetes/installation/rdma-setup/efa-on-aws.mdx](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/kubernetes/installation/rdma-setup/efa-on-aws.mdx) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: docs/fern/pages/reference/backends/vllm-configuration.mdx](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/reference/backends/vllm-configuration.mdx) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: examples/backends/vllm/deploy/xpu/README.md](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/examples/backends/vllm/deploy/xpu/README.md) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: examples/backends/vllm/launch/disagg.sh](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/examples/backends/vllm/launch/disagg.sh) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: lib/bindings/kvbm/python/kvbm/vllm_integration/connector/dynamo_connector.py](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/lib/bindings/kvbm/python/kvbm/vllm_integration/connector/dynamo_connector.py) | 2026-10-16 | NvidiaDynamo |
| [ai-dynamo/dynamo @ v1.5.1: pyproject.toml](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/pyproject.toml) | 2026-10-16 | NvidiaDynamo, RayServeLLM, ThesisAndFraming, WhenNotVllm |
| [ai-dynamo/dynamo @ v1.5.1: README.md](https://github.com/ai-dynamo/dynamo/blob/v1.5.1/README.md) | 2026-10-16 | NvidiaDynamo, WhenNotVllm |
| [NVIDIA Dynamo (GitHub: ai-dynamo/dynamo, v1.5.1)](https://github.com/ai-dynamo/dynamo/tree/v1.5.1) | 2026-10-16 | Sources appendix |
| [aws-neuron/upstreaming-to-vllm (AWS fork, repository archived)](https://github.com/aws-neuron/upstreaming-to-vllm) | 2026-10-16 | Sources appendix |
| [aws-neuron/upstreaming-to-vllm (archived)](https://github.com/aws-neuron/upstreaming-to-vllm/tree/c4f76254591e9113f01cbed6684efd735ba3cb81) | 2026-10-24 | AwsNeuron |
| [aws-samples/load-test-llm-with-locust](https://github.com/aws-samples/load-test-llm-with-locust/tree/72854d749cf8d88dc1f625969df1351e526a1321) | 2026-10-16 | AwsSageMakerBedrock |
| [AWS DLC release: LMI 30.0.0](https://github.com/aws/deep-learning-containers/releases/tag/v1.0-djl-0.38.0-inf-lmi-30.0.0-cu130) | 2026-10-16 | AwsSageMakerBedrock |
| [aws/karpenter-provider-aws @ v1.15.0: pkg/apis/crds/karpenter.k8s.aws_ec2nodeclasses.yaml](https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/pkg/apis/crds/karpenter.k8s.aws_ec2nodeclasses.yaml) | 2026-10-16 | AwsEks |
| [aws/karpenter-provider-aws @ v1.15.0: website/content/en/docs/concepts/nodeclasses.md?plain=1](https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/website/content/en/docs/concepts/nodeclasses.md?plain=1) | 2026-10-16 | AwsEks, DecisionGuide, Ec2TopologyPlacement |
| [Karpenter v1.11.0 release notes](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.11.0) | 2026-10-16 | AwsEks, DecisionGuide, Ec2TopologyPlacement |
| [aws/model-hosting-container-standards @ v0.1.16: docs/sagemaker/04_sticky_session_routing.md](https://github.com/aws/model-hosting-container-standards/blob/v0.1.16/docs/sagemaker/04_sticky_session_routing.md) | 2026-10-16 | AwsSageMakerBedrock |
| [aws/model-hosting-container-standards @ v0.1.16: python/model_hosting_container_standards/sagemaker/sessions/manager.py](https://github.com/aws/model-hosting-container-standards/blob/v0.1.16/python/model_hosting_container_standards/sagemaker/sessions/manager.py) | 2026-10-16 | AwsSageMakerBedrock |
| [aws/model-hosting-container-standards (Python toolkit behind vLLM's SageMaker route; SM_VLLM_* notebooks, v0.1.16)](https://github.com/aws/model-hosting-container-standards/tree/v0.1.16) | 2026-10-16 | Sources appendix |
| [aws/model-hosting-container-standards @ v0.1.16: examples/vllm/notebooks](https://github.com/aws/model-hosting-container-standards/tree/v0.1.16/examples/vllm/notebooks) | 2026-10-16 | AwsSageMakerBedrock |
| [aws/sagemaker-python-sdk @ v2.257.7: src/sagemaker/djl_inference/model.py](https://github.com/aws/sagemaker-python-sdk/blob/v2.257.7/src/sagemaker/djl_inference/model.py) | 2026-10-16 | AwsSageMakerBedrock |
| [awslabs/ml-container-creator](https://github.com/awslabs/ml-container-creator/tree/bb89cf9de839f0b6e027f011d2264f326138fb0c) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [LiteLLM v1.105.1 release](https://github.com/BerriAI/litellm/releases/tag/v1.105.1) | 2026-10-16 | GatewaysAppLayer |
| [deepjavalibrary/djl-serving @ 42d8a9db76ee036d48010208536faffa18e4a7e4: serving/docker/lmi-container-requirements.txt](https://github.com/deepjavalibrary/djl-serving/blob/42d8a9db76ee036d48010208536faffa18e4a7e4/serving/docker/lmi-container-requirements.txt) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: engines/python/setup/djl_python/properties_manager/vllm_rb_properties.py](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/engines/python/setup/djl_python/properties_manager/vllm_rb_properties.py) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: serving/docker/lmi-container-requirements.txt](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/serving/docker/lmi-container-requirements.txt) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: serving/docker/lmi.Dockerfile](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/serving/docker/lmi.Dockerfile) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: serving/docs/lmi/deployment_guide/configurations.md](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/serving/docs/lmi/deployment_guide/configurations.md) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: serving/docs/lmi/user_guides/vllm_user_guide.md](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/serving/docs/lmi/user_guides/vllm_user_guide.md) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 8a99e6e56562bcdff4ef230e2a81b201cb61fe09: wlm/src/main/java/ai/djl/serving/wlm/LmiConfigRecommender.java](https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09/wlm/src/main/java/ai/djl/serving/wlm/LmiConfigRecommender.java) | 2026-10-16 | AwsSageMakerBedrock |
| [deepjavalibrary/djl-serving @ 9c75526391d8e858bf4bd4172929cbf11a4ae84d: serving/docker/lmi-container-requirements.txt](https://github.com/deepjavalibrary/djl-serving/blob/9c75526391d8e858bf4bd4172929cbf11a4ae84d/serving/docker/lmi-container-requirements.txt) | 2026-10-16 | AwsSageMakerBedrock |
| [llama.cpp v0.7.0](https://github.com/ggml-org/llama.cpp/releases/tag/v0.7.0) | 2026-10-16 | WhenNotVllm |
| [GitHub: huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference) | 2026-10-16 | WhenNotVllm |
| [huggingface/text-generation-inference @ b4adbf2f6e2e721280bd0ea5f91d70f7d033f5ed: README.md](https://github.com/huggingface/text-generation-inference/blob/b4adbf2f6e2e721280bd0ea5f91d70f7d033f5ed/README.md) | 2026-10-16 | WhenNotVllm |
| [TGI v3.3.7](https://github.com/huggingface/text-generation-inference/releases/tag/v3.3.7) | 2026-10-16 | WhenNotVllm |
| [Inferact/vllm-frontend-rs (Rust frontend origin, repository archived)](https://github.com/Inferact/vllm-frontend-rs) | 2026-10-16 | Sources appendix |
| [kserve/kserve @ v0.21.0: pkg/apis/serving/v1alpha1/llm_inference_service_conversion.go](https://github.com/kserve/kserve/blob/v0.21.0/pkg/apis/serving/v1alpha1/llm_inference_service_conversion.go) | 2026-10-16 | LlmdKServe |
| [kserve/kserve @ v0.21.0: pkg/apis/serving/v1alpha2/llm_inference_service_types.go](https://github.com/kserve/kserve/blob/v0.21.0/pkg/apis/serving/v1alpha2/llm_inference_service_types.go) | 2026-10-16 | LlmdKServe |
| [kubernetes-sigs/gateway-api-inference-extension @ v1.5.0: README.md](https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.5.0/README.md) | 2026-10-16 | LlmdKServe |
| [kubernetes-sigs/gateway-api-inference-extension @ v1.6.2: config/crd/bases/inference.networking.k8s.io_inferencepools.yaml](https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.6.2/config/crd/bases/inference.networking.k8s.io_inferencepools.yaml) | 2026-10-16 | LlmdKServe |
| [kubernetes-sigs/gateway-api-inference-extension @ v1.6.2: docs/proposals/003-model-server-protocol/README.md](https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.6.2/docs/proposals/003-model-server-protocol/README.md) | 2026-10-16 | LoRAServing |
| [kubernetes-sigs/gateway-api-inference-extension @ v1.6.2: README.md](https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.6.2/README.md) | 2026-10-16 | LlmdKServe |
| [GIE v1.0.0 release notes](https://github.com/kubernetes-sigs/gateway-api-inference-extension/releases/tag/v1.0.0) | 2026-10-16 | LlmdKServe |
| [GIE v1.6.2 release](https://github.com/kubernetes-sigs/gateway-api-inference-extension/releases/tag/v1.6.2) | 2026-10-16 | LlmdKServe |
| [Kubernetes Gateway API Inference Extension (GitHub, v1.6.2)](https://github.com/kubernetes-sigs/gateway-api-inference-extension/tree/v1.6.2) | 2026-10-16 | Sources appendix |
| [kubernetes-sigs/inference-perf @ v0.7.0: README.md](https://github.com/kubernetes-sigs/inference-perf/blob/v0.7.0/README.md) | 2026-10-16 | ObservabilityBench |
| [kubernetes-sigs/inference-perf (GitHub, v0.7.0)](https://github.com/kubernetes-sigs/inference-perf/tree/v0.7.0) | 2026-10-16 | Sources appendix |
| [kubernetes-sigs/lws @ v1.0.0: docs/examples/leaderworkerset/basic/vllm.yaml](https://github.com/kubernetes-sigs/lws/blob/v1.0.0/docs/examples/leaderworkerset/basic/vllm.yaml) | 2026-10-16 | AwsEks |
| [kubernetes-sigs/lws @ v1.0.0: site/content/en/docs/concepts/disaggregatedset/_index.md?plain=1](https://github.com/kubernetes-sigs/lws/blob/v1.0.0/site/content/en/docs/concepts/disaggregatedset/_index.md?plain=1) | 2026-10-16 | AwsEks |
| [kubernetes/cloud-provider-aws @ v1.37.0: pkg/providers/v1/instances_v2.go](https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1/instances_v2.go) | 2026-10-16 | Ec2TopologyPlacement |
| [kubernetes/cloud-provider-aws @ v1.37.0: pkg/providers/v1/well_known_labels.go](https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1/well_known_labels.go) | 2026-10-16 | Ec2TopologyPlacement |
| [llm-d/llm-d-router @ v1.0.0: docs/architecture.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/docs/architecture.md) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: docs/disaggregation.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/docs/disaggregation.md) | 2026-10-16 | DecisionGuide, LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/datalayer/attribute/topology/README.md?plain=1](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/datalayer/attribute/topology/README.md?plain=1) | 2026-10-16 | Ec2TopologyPlacement |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/datalayer/extractor/metrics/factories.go](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/datalayer/extractor/metrics/factories.go) | 2026-10-16 | LlmdKServe, WhenNotVllm |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/datalayer/extractor/topology/extractor.go](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/datalayer/extractor/topology/extractor.go) | 2026-10-16 | Ec2TopologyPlacement |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/requestcontrol/dataproducer/approximateprefix/README.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/requestcontrol/dataproducer/approximateprefix/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/requestcontrol/dataproducer/preciseprefixcache/README.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/requestcontrol/dataproducer/preciseprefixcache/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/filter/topologyaffinity/README.md?plain=1](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/scheduling/filter/topologyaffinity/README.md?plain=1) | 2026-10-16 | Ec2TopologyPlacement |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/scorer/mmcacheaffinity/README.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer/mmcacheaffinity/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/README.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/README.md?plain=1](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/README.md?plain=1) | 2026-10-16 | Ec2TopologyPlacement |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/scorer.go](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer/topologyaffinity/scorer.go) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/metrics/llm_d_router_metrics.go](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/metrics/llm_d_router_metrics.go) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/scheduling/scheduler_profile.go](https://github.com/llm-d/llm-d-router/blob/v1.0.0/pkg/epp/scheduling/scheduler_profile.go) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d-router @ v1.0.0: README.md](https://github.com/llm-d/llm-d-router/blob/v1.0.0/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d Router, formerly llm-d-inference-scheduler (GitHub, v1.0.0)](https://github.com/llm-d/llm-d-router/tree/v1.0.0) | 2026-10-16 | Sources appendix |
| [llm-d/llm-d-router @ v1.0.0: pkg/epp/framework/plugins/scheduling/scorer](https://github.com/llm-d/llm-d-router/tree/v1.0.0/pkg/epp/framework/plugins/scheduling/scorer) | 2026-10-16 | LlmdKServe |
| [llm-d/llm-d @ v0.10.0: README.md](https://github.com/llm-d/llm-d/blob/v0.10.0/README.md) | 2026-10-16 | LlmdKServe |
| [llm-d v0.10.0 release notes](https://github.com/llm-d/llm-d/releases/tag/v0.10.0) | 2026-10-16 | LlmdKServe, NvidiaDynamo, RayServeLLM, ThesisAndFraming |
| [llm-d (GitHub, v0.10.0)](https://github.com/llm-d/llm-d/tree/v0.10.0) | 2026-10-16 | Sources appendix |
| [LMCache/LMCache @ v0.5.6: README.md](https://github.com/LMCache/LMCache/blob/v0.5.6/README.md) | 2026-10-16 | KVOffloadingLMCache |
| [LMCache release v0.5.6](https://github.com/LMCache/LMCache/releases/tag/v0.5.6) | 2026-10-16 | KVOffloadingLMCache |
| [NVIDIA/TensorRT-LLM @ v1.2.1: README.md](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/README.md) | 2026-10-16 | WhenNotVllm |
| [NVIDIA/TensorRT-LLM @ v1.2.1: tensorrt_llm/commands/serve.py](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/commands/serve.py) | 2026-10-16 | WhenNotVllm |
| [NVIDIA/TensorRT-LLM @ v1.2.1: tensorrt_llm/llmapi/llm.py](https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/tensorrt_llm/llmapi/llm.py) | 2026-10-16 | WhenNotVllm |
| [Ollama v0.40.6](https://github.com/ollama/ollama/releases/tag/v0.40.6) | 2026-10-16 | WhenNotVllm |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/core/configs/llm_config.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/core/configs/llm_config.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/core/ingress/builder.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/core/ingress/builder.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/core/ingress/ingress.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/core/ingress/ingress.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/engines/vllm/kv_transfer/base.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/engines/vllm/kv_transfer/base.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/engines/vllm/vllm_engine.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/engines/vllm/vllm_engine.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/engines/vllm/vllm_models.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/engines/vllm/vllm_models.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/routing_policies/prefix_aware/prefix_aware_router.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/routing_policies/prefix_aware/prefix_aware_router.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/llm/_internal/serve/serving_patterns/prefill_decode/pd_server.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/llm/_internal/serve/serving_patterns/prefill_decode/pd_server.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/serve/llm/__init__.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/serve/llm/__init__.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/serve/llm/ingress.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/serve/llm/ingress.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/ray/serve/llm/request_router.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/ray/serve/llm/request_router.py) | 2026-10-16 | RayServeLLM |
| [ray-project/ray @ ray-2.59.0: python/requirements/llm/llm-requirements.txt](https://github.com/ray-project/ray/blob/ray-2.59.0/python/requirements/llm/llm-requirements.txt) | 2026-10-16 | DecisionGuide, NvidiaDynamo, RayServeLLM, ThesisAndFraming |
| [ray-project/ray @ ray-2.59.0: python/setup.py](https://github.com/ray-project/ray/blob/ray-2.59.0/python/setup.py) | 2026-10-16 | RayServeLLM |
| [sgl-project/sglang @ v0.5.21: python/sglang/srt/mem_cache/radix_cache.py](https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/mem_cache/radix_cache.py) | 2026-10-16 | WhenNotVllm |
| [sgl-project/sglang @ v0.5.21: README.md](https://github.com/sgl-project/sglang/blob/v0.5.21/README.md) | 2026-10-16 | WhenNotVllm |
| [vllm-project/guidellm @ v0.8.1: README.md](https://github.com/vllm-project/guidellm/blob/v0.8.1/README.md) | 2026-10-16 | ObservabilityBench |
| [vllm-project/guidellm (benchmark tool, v0.8.1)](https://github.com/vllm-project/guidellm/tree/v0.8.1) | 2026-10-16 | Sources appendix |
| [vllm-project/production-stack @ vllm-stack-0.1.13: helm/Chart.yaml](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/Chart.yaml) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: helm/dashboards/vllm-dashboard.json](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/dashboards/vllm-dashboard.json) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: helm/templates/deployment-router.yaml](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/templates/deployment-router.yaml) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: helm/values.schema.json](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/values.schema.json) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: helm/values.yaml](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/helm/values.yaml) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: README.md](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/README.md) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router/parsers/parser.py](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/parsers/parser.py) | 2026-10-16 | DecisionGuide, ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router/routers/routing_logic.py](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/routers/routing_logic.py) | 2026-10-16 | DecisionGuide, KVOffloadingLMCache, ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router/services/metrics_service/__init__.py](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/services/metrics_service/__init__.py) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router/services/request_service/request.py](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/services/request_service/request.py) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router/stats/engine_stats.py](https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/src/vllm_router/stats/engine_stats.py) | 2026-10-16 | LlmdKServe, ProductionStack |
| [vllm-project/production-stack (vllm-stack-0.1.13)](https://github.com/vllm-project/production-stack/tree/vllm-stack-0.1.13) | 2026-10-16 | Sources appendix |
| [vllm-project/production-stack @ vllm-stack-0.1.13: operator/api/v1alpha1](https://github.com/vllm-project/production-stack/tree/vllm-stack-0.1.13/operator/api/v1alpha1) | 2026-10-16 | ProductionStack |
| [vllm-project/production-stack @ vllm-stack-0.1.13: src/vllm_router](https://github.com/vllm-project/production-stack/tree/vllm-stack-0.1.13/src/vllm_router) | 2026-10-16 | ProductionStack |
| [vllm-project/router @ v0.1.16: README.md](https://github.com/vllm-project/router/blob/v0.1.16/README.md) | 2026-10-16 | DecisionGuide, ProductionStack |
| [tpu-inference](https://github.com/vllm-project/tpu-inference) | 2026-10-16 | WhenNotVllm |
| [vllm-project/vllm-bnb-plugin @ v0.0.3: vllm_bnb_plugin/__init__.py](https://github.com/vllm-project/vllm-bnb-plugin/blob/v0.0.3/vllm_bnb_plugin/__init__.py) | 2026-10-16 | Quantization |
| [vllm-gaudi](https://github.com/vllm-project/vllm-gaudi) | 2026-10-16 | WhenNotVllm |
| [vllm-project/vllm-gguf-plugin @ v0.0.5: vllm_gguf_plugin/plugin.py](https://github.com/vllm-project/vllm-gguf-plugin/blob/v0.0.5/vllm_gguf_plugin/plugin.py) | 2026-10-16 | Quantization |
| [vllm-metal](https://github.com/vllm-project/vllm-metal) | 2026-10-16 | WhenNotVllm |
| [vllm-neuron](https://github.com/vllm-project/vllm-neuron) | 2026-10-16 | WhenNotVllm |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: docs/getting-started/migration-nxdi-to-vllm-neuron.md?plain=1](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/docs/getting-started/migration-nxdi-to-vllm-neuron.md?plain=1) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: docs/guides/features-guide.md?plain=1](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/docs/guides/features-guide.md?plain=1) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: docs/guides/reference-configuration.md?plain=1](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/docs/guides/reference-configuration.md?plain=1) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI/run_prefill.sh](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI/run_prefill.sh) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: pyproject.toml](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/pyproject.toml) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: README.md?plain=1](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/README.md?plain=1) | 2026-10-16, 2026-10-24 | AwsNeuron, DecisionGuide |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: requirements/core.txt](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/requirements/core.txt) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron/__init__.py](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/vllm_neuron/__init__.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron/envs.py](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/vllm_neuron/envs.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron/vllm/model_runner_v2_policy.py](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/vllm_neuron/vllm/model_runner_v2_policy.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron/vllm/platform.py](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/vllm_neuron/vllm/platform.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron/vllm/worker/neuron_model_runner.py](https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/vllm_neuron/vllm/worker/neuron_model_runner.py) | 2026-10-24 | AwsNeuron |
| [v0.21.0.1.0.0 release notes](https://github.com/vllm-project/vllm-neuron/releases/tag/v0.21.0.1.0.0) | 2026-10-24 | AwsNeuron |
| [vllm-neuron v0.29.0.1.2.0 release notes](https://github.com/vllm-project/vllm-neuron/releases/tag/v0.29.0.1.2.0) | 2026-10-24 | AwsNeuron |
| [vllm-neuron at v0.29.0.1.2.0 (searched)](https://github.com/vllm-project/vllm-neuron/tree/v0.29.0.1.2.0) | 2026-10-24 | AwsNeuron, Sources appendix |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI](https://github.com/vllm-project/vllm-neuron/tree/v0.29.0.1.2.0/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm-neuron @ v0.29.0.1.2.0: vllm_neuron](https://github.com/vllm-project/vllm-neuron/tree/v0.29.0.1.2.0/vllm_neuron) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm @ 15652a6b703f059767d75e5a511c4a5accf969ad: vllm/model_executor/layers/quantization/__init__.py](https://github.com/vllm-project/vllm/blob/15652a6b703f059767d75e5a511c4a5accf969ad/vllm/model_executor/layers/quantization/__init__.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.27.0: vllm/config/speculative.py](https://github.com/vllm-project/vllm/blob/v0.27.0/vllm/config/speculative.py) | 2026-10-16 | SpeculativeDecoding |
| [vllm-project/vllm @ v0.29.0: requirements/cuda.txt](https://github.com/vllm-project/vllm/blob/v0.29.0/requirements/cuda.txt) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm @ v0.29.0: vllm/engine/arg_utils.py](https://github.com/vllm-project/vllm/blob/v0.29.0/vllm/engine/arg_utils.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm @ v0.29.0: vllm/platforms/__init__.py](https://github.com/vllm-project/vllm/blob/v0.29.0/vllm/platforms/__init__.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm @ v0.31.0: benchmarks/benchmark_serving.py](https://github.com/vllm-project/vllm/blob/v0.31.0/benchmarks/benchmark_serving.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: docker/Dockerfile](https://github.com/vllm-project/vllm/blob/v0.31.0/docker/Dockerfile) | 2026-10-16 | AwsSageMakerBedrock |
| [vllm-project/vllm @ v0.31.0: docs/configuration/optimization.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/configuration/optimization.md) | 2026-10-16 | OperationsFailureModes, PagedAttentionKV, SchedulerBatching |
| [vllm-project/vllm @ v0.31.0: docs/contributing/labels.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/contributing/labels.md) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: docs/contributing/model/registration.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/contributing/model/registration.md) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: docs/deployment/frameworks/litellm.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/deployment/frameworks/litellm.md) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: docs/deployment/frameworks/open-webui.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/deployment/frameworks/open-webui.md) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: docs/deployment/integrations/kserve.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/deployment/integrations/kserve.md) | 2026-10-16 | LlmdKServe |
| [vllm-project/vllm @ v0.31.0: docs/deployment/integrations/llm-d.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/deployment/integrations/llm-d.md) | 2026-10-16 | NvidiaDynamo |
| [vllm-project/vllm @ v0.31.0: docs/design/hisparse.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/design/hisparse.md) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: docs/design/hybrid_kv_cache_manager.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/design/hybrid_kv_cache_manager.md) | 2026-10-16 | PagedAttentionKV |
| [vllm-project/vllm @ v0.31.0: docs/design/metrics.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/design/metrics.md) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: docs/design/paged_attention.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/design/paged_attention.md) | 2026-10-16 | PagedAttentionKV |
| [vllm-project/vllm @ v0.31.0: docs/features/disagg_prefill.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/disagg_prefill.md) | 2026-10-16 | DisaggregatedServing, KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: docs/features/index_cache.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/index_cache.md) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: docs/features/kv_offloading_usage.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/kv_offloading_usage.md) | 2026-10-16 | DecisionGuide, KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: docs/features/lora.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/lora.md) | 2026-10-16 | LoRAServing, OperationsFailureModes, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: docs/features/mooncake_connector_usage.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/mooncake_connector_usage.md) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: docs/features/moriio_connector_usage.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/moriio_connector_usage.md) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: docs/features/nixl_connector_compatibility.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/nixl_connector_compatibility.md) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: docs/features/nixl_connector_usage.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/nixl_connector_usage.md) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: docs/features/structured_outputs.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/structured_outputs.md) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: docs/features/tool_calling.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/tool_calling.md) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: docs/serving/integrations/langchain.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/serving/integrations/langchain.md) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: docs/serving/integrations/llamaindex.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/serving/integrations/llamaindex.md) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: docs/serving/online_serving/openai_compatible_server.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/serving/online_serving/openai_compatible_server.md) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: docs/serving/online_serving/README.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/serving/online_serving/README.md) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: docs/serving/parallelism_scaling.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/serving/parallelism_scaling.md) | 2026-10-16 | DistributedInference, RayServeLLM, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: docs/usage/security.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/usage/security.md) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: docs/usage/troubleshooting.md](https://github.com/vllm-project/vllm/blob/v0.31.0/docs/usage/troubleshooting.md) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: examples/deployment/sagemaker-entrypoint.sh](https://github.com/vllm-project/vllm/blob/v0.31.0/examples/deployment/sagemaker-entrypoint.sh) | 2026-10-16 | AwsSageMakerBedrock |
| [vllm-project/vllm @ v0.31.0: examples/disaggregated/disaggregated_serving/disagg_proxy_pushconnector_demo.py](https://github.com/vllm-project/vllm/blob/v0.31.0/examples/disaggregated/disaggregated_serving/disagg_proxy_pushconnector_demo.py) | 2026-10-16 | DisaggregatedServing, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: examples/features/speculative_decoding/spec_decode_offline.py](https://github.com/vllm-project/vllm/blob/v0.31.0/examples/features/speculative_decoding/spec_decode_offline.py) | 2026-10-16 | SpeculativeDecoding |
| [vllm-project/vllm @ v0.31.0: examples/observability/prometheus_grafana/prometheus.yaml](https://github.com/vllm-project/vllm/blob/v0.31.0/examples/observability/prometheus_grafana/prometheus.yaml) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: requirements/common.txt](https://github.com/vllm-project/vllm/blob/v0.31.0/requirements/common.txt) | 2026-10-16 | AwsSageMakerBedrock |
| [vllm-project/vllm @ v0.31.0: requirements/kv_connectors_cu12.txt](https://github.com/vllm-project/vllm/blob/v0.31.0/requirements/kv_connectors_cu12.txt) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: requirements/kv_connectors.txt](https://github.com/vllm-project/vllm/blob/v0.31.0/requirements/kv_connectors.txt) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: rust/Cargo.toml](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/Cargo.toml) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/proto/control.proto](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/proto/control.proto) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/README.md](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/README.md) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/chat/src/multimodal.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/chat/src/multimodal.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/chat/src/parser/tool/mod.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/chat/src/parser/tool/mod.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/chat/src/renderer/selection.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/chat/src/renderer/selection.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/cmd/src/cli.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/cmd/src/cli.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/cmd/src/cli/ssl.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/cmd/src/cli/ssl.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/cmd/src/cli/unsupported.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/cmd/src/cli/unsupported.rs) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/cmd/src/main.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/cmd/src/main.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/engine-core-client/src/coordinator/handle.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/engine-core-client/src/coordinator/handle.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/engine-core-client/src/transport.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/engine-core-client/src/transport.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/managed-engine/src/process.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/managed-engine/src/process.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/parser/src/reasoning/mod.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/parser/src/reasoning/mod.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/server/src/lib.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/server/src/lib.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/server/src/middleware/auth.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/server/src/middleware/auth.rs) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/server/src/render.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/server/src/render.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/server/src/routes.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/server/src/routes.rs) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/tracing/src/lib.rs](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/tracing/src/lib.rs) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: setup.py](https://github.com/vllm-project/vllm/blob/v0.31.0/setup.py) | 2026-10-16 | ObservabilityBench, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: tests/entrypoints/serve/instrumentator/test_metrics.py](https://github.com/vllm-project/vllm/blob/v0.31.0/tests/entrypoints/serve/instrumentator/test_metrics.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: tests/v1/core/prefix_cache/test_hybrid_prefix_cache_hit_rate.py](https://github.com/vllm-project/vllm/blob/v0.31.0/tests/v1/core/prefix_cache/test_hybrid_prefix_cache_hit_rate.py) | 2026-10-16 | ProductionStack |
| [vllm-project/vllm @ v0.31.0: tests/v1/kv_connector/nixl_integration/toy_proxy_server.py](https://github.com/vllm-project/vllm/blob/v0.31.0/tests/v1/kv_connector/nixl_integration/toy_proxy_server.py) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: tools/build_rust.py](https://github.com/vllm-project/vllm/blob/v0.31.0/tools/build_rust.py) | 2026-10-16 | codebase/CodebaseArchitecture, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/__init__.py) | 2026-10-16 | codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/benchmarks/serve.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/benchmarks/serve.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/benchmarks/sweep/cli.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/benchmarks/sweep/cli.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/backends.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/backends.py) | 2026-10-16 | OperationsFailureModes, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/breakable_cudagraph.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/breakable_cudagraph.py) | 2026-10-16 | codebase/CodebaseAdvanced, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/cuda_graph.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/cuda_graph.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/passes/fusion/sequence_parallelism.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/passes/fusion/sequence_parallelism.py) | 2026-10-16 | DistributedInference |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/passes/ir/clone_elimination.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/passes/ir/clone_elimination.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/passes/ir/lowering_pass.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/passes/ir/lowering_pass.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/compilation/passes/pass_manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/compilation/passes/pass_manager.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/config/attention.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/attention.py) | 2026-10-16 | KVOffloadingLMCache, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/config/cache.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py) | 2026-10-16 | DecisionGuide, KVOffloadingLMCache, OperationsFailureModes, PagedAttentionKV, PrefixCaching, Quantization, SchedulerBatching, V1Architecture, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/config/compilation.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/compilation.py) | 2026-10-16 | codebase/CodebaseAdvanced, codebase/CodebaseConfig, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/config/device.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/device.py) | 2026-10-16 | codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/diffusion.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/diffusion.py) | 2026-10-16 | WhenNotVllm |
| [vllm-project/vllm @ v0.31.0: vllm/config/fault_tolerance.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/fault_tolerance.py) | 2026-10-16 | DistributedInference |
| [vllm-project/vllm @ v0.31.0: vllm/config/kernel.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/kernel.py) | 2026-10-16 | codebase/CodebaseAdvanced, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/config/kv_events.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/kv_events.py) | 2026-10-16 | LlmdKServe, NvidiaDynamo, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/kv_transfer.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/kv_transfer.py) | 2026-10-16 | DisaggregatedServing, KVOffloadingLMCache, codebase/CodebaseConfig, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/config/load.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/load.py) | 2026-10-16 | WhenNotVllm, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/lora.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/lora.py) | 2026-10-16 | LoRAServing, codebase/CodebaseConfig, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/config/model.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/model.py) | 2026-10-16 | DecisionGuide, DistributedInference, PrefixCaching, Quantization, codebase/CodebaseConfig, codebase/CodebaseModelLayer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/config/observability.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/observability.py) | 2026-10-16 | ObservabilityBench, SpeculativeDecoding, codebase/CodebaseAdvanced, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/parallel.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py) | 2026-10-16 | DecisionGuide, DistributedInference, RayServeLLM, SchedulerBatching, V1Architecture, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseDistributed, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/config/quantization.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/quantization.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/config/scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/scheduler.py) | 2026-10-16 | DecisionGuide, DistributedInference, GatewaysAppLayer, OpenAICompatServer, OperationsFailureModes, PagedAttentionKV, ProductionStack, SchedulerBatching, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/config/speculative.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/speculative.py) | 2026-10-16 | AwsSageMakerBedrock, DecisionGuide, SpeculativeDecoding, codebase/CodebaseAdvanced, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/structured_outputs.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/structured_outputs.py) | 2026-10-16 | V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/utils.py) | 2026-10-16 | codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/config/vllm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/vllm.py) | 2026-10-16 | DistributedInference, KVOffloadingLMCache, LoRAServing, OperationsFailureModes, PagedAttentionKV, Quantization, SchedulerBatching, SpeculativeDecoding, ThesisAndFraming, V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseConfig, codebase/CodebaseDistributed, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/all2all.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/all2all.py) | 2026-10-16 | DistributedInference |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/cuda_communicator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/cuda_communicator.py) | 2026-10-16 | DistributedInference, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/flashinfer_all_reduce.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/flashinfer_all_reduce.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/pynccl_allocator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/pynccl_allocator.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/ray_communicator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/ray_communicator.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/device_communicators/shm_broadcast.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/device_communicators/shm_broadcast.py) | 2026-10-16 | KVOffloadingLMCache, codebase/CodebaseArchitecture, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/ec_transfer/ec_connector/factory.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/ec_transfer/ec_connector/factory.py) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/elastic_ep/standby_state.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/elastic_ep/standby_state.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/factory.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/factory.py) | 2026-10-16 | DisaggregatedServing, KVOffloadingLMCache, NvidiaDynamo, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/utils.py) | 2026-10-16 | DisaggregatedServing, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/base.py) | 2026-10-16 | KVOffloadingLMCache, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/lmcache_connector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/lmcache_connector.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/lmcache_mp_connector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/lmcache_mp_connector.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/mooncake/mooncake_connector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/mooncake/mooncake_connector.py) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/moriio/moriio_engine.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/moriio/moriio_engine.py) | 2026-10-16 | DisaggregatedServing |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_scheduler.py) | 2026-10-16 | AwsGpuEfaNixl, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing, NvidiaDynamo, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing, Ec2TopologyPlacement, NvidiaDynamo, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/metadata.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/metadata.py) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_scheduler.py) | 2026-10-16 | AwsGpuEfaNixl |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing, NvidiaDynamo, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_scheduler.py) | 2026-10-16 | DisaggregatedServing, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_worker.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/push_worker.py) | 2026-10-16 | AwsGpuEfaNixl, DisaggregatedServing, NvidiaDynamo, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/stats.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/stats.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl/tp_mapping.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/tp_mapping.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/offloading/metrics.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/offloading/metrics.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/offloading/scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/offloading/scheduler.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/simple_cpu_offload_connector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/simple_cpu_offload_connector.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/parallel_state.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/parallel_state.py) | 2026-10-16 | DistributedInference, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/distributed/utils.py) | 2026-10-16 | codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/engine/arg_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/engine/arg_utils.py) | 2026-10-16, 2026-10-24 | AwsNeuron, DecisionGuide, DistributedInference, GatewaysAppLayer, InferenceWorkload, LoRAServing, OperationsFailureModes, PagedAttentionKV, PrefixCaching, Quantization, SchedulerBatching, V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseExecution, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/engine/async_llm_engine.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/engine/async_llm_engine.py) | 2026-10-16 | ThesisAndFraming |
| [vllm-project/vllm @ v0.31.0: vllm/engine/llm_engine.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/engine/llm_engine.py) | 2026-10-16 | V1Architecture, codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/anthropic/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/anthropic/api_router.py) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/chat_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/chat_utils.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cli/benchmark/main.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cli/benchmark/main.py) | 2026-10-16 | ObservabilityBench, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cli/main.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cli/main.py) | 2026-10-16 | ThesisAndFraming |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cli/preload.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cli/preload.py) | 2026-10-16 | AwsEks |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cli/serve.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cli/serve.py) | 2026-10-16 | DistributedInference, LoRAServing, OpenAICompatServer, OperationsFailureModes, ThesisAndFraming, V1Architecture, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseDistributed, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cli/snapshot.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cli/snapshot.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/cohere/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/cohere/api_router.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/generate/base/protocol.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/generate/base/protocol.py) | 2026-10-16 | OpenAICompatServer, PrefixCaching, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/generate/base/serving.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/generate/base/serving.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/api_server/app_state.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/api_server/app_state.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/api_server/entry.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/api_server/entry.py) | 2026-10-16 | SchedulerBatching |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/api_server/routers.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/api_server/routers.py) | 2026-10-16 | OpenAICompatServer, OperationsFailureModes, PrefixCaching, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/app.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/app.py) | 2026-10-16 | AwsSageMakerBedrock |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/cli_args.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/cli_args.py) | 2026-10-16 | DistributedInference, LoRAServing, OpenAICompatServer, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/dp_supervisor.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/dp_supervisor.py) | 2026-10-16 | DistributedInference, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/launcher.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/launcher.py) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers/utils/server_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/launchers/utils/server_utils.py) | 2026-10-16 | codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/llm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/llm.py) | 2026-10-16 | PrefixCaching |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/api_server.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/api_server.py) | 2026-10-16 | OpenAICompatServer, ThesisAndFraming |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/chat_completion/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/chat_completion/api_router.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/chat_completion/protocol.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/chat_completion/protocol.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/models/serving.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/models/serving.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/responses/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/responses/api_router.py) | 2026-10-16 | GatewaysAppLayer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/openai/responses/serving.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/openai/responses/serving.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/scale_out/factories.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/scale_out/factories.py) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/__init__.py) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/dev/server_info/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/dev/server_info/api_router.py) | 2026-10-16 | codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/engine/protocol.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/engine/protocol.py) | 2026-10-16 | V1Architecture |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/engine/serving.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/engine/serving.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/fault_tolerance/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/fault_tolerance/api_router.py) | 2026-10-16 | DistributedInference |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/instrumentator/health.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/instrumentator/health.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/instrumentator/metrics.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/instrumentator/metrics.py) | 2026-10-16 | AwsSageMakerBedrock, ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/lora/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/lora/api_router.py) | 2026-10-16 | LoRAServing, OpenAICompatServer, OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/middleware/authenticate.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/middleware/authenticate.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/middleware/x_request_id.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/middleware/x_request_id.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/profile/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/profile/api_router.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/sagemaker/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/sagemaker/api_router.py) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/tokenize/api_router.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/tokenize/api_router.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/serve/utils/api_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/entrypoints/serve/utils/api_utils.py) | 2026-10-16 | OperationsFailureModes, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/envs.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/envs.py) | 2026-10-16 | AwsGpuEfaNixl, DistributedInference, KVOffloadingLMCache, LoRAServing, OpenAICompatServer, OperationsFailureModes, ThesisAndFraming, V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseDistributed, codebase/CodebaseExecution, codebase/CodebaseModelLayer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/exceptions.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/exceptions.py) | 2026-10-16 | ObservabilityBench, OpenAICompatServer, OperationsFailureModes, SchedulerBatching, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/ir/op.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/ir/op.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/ir/ops/activation.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/ir/ops/activation.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/ir/ops/layernorm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/ir/ops/layernorm.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/lora/layers/base_linear.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/layers/base_linear.py) | 2026-10-16 | LoRAServing, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/layers/column_parallel_linear.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/layers/column_parallel_linear.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/layers/row_parallel_linear.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/layers/row_parallel_linear.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/model_manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/model_manager.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/ops/triton_ops/fused_moe_lora_op.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/ops/triton_ops/fused_moe_lora_op.py) | 2026-10-16 | AwsSageMakerBedrock |
| [vllm-project/vllm @ v0.31.0: vllm/lora/ops/triton_ops/lora_kernel_metadata.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/ops/triton_ops/lora_kernel_metadata.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/lora/peft_helper.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/peft_helper.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/lora/punica_wrapper/punica_base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/punica_wrapper/punica_base.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/punica_wrapper/punica_cpu.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/punica_wrapper/punica_cpu.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/punica_wrapper/punica_gpu.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/punica_wrapper/punica_gpu.py) | 2026-10-16 | LoRAServing, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/punica_wrapper/punica_selector.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/punica_wrapper/punica_selector.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/lora/punica_wrapper/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/punica_wrapper/utils.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/lora/worker_manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/lora/worker_manager.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/custom_op.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/custom_op.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/__init__.py) | 2026-10-16 | Quantization, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/mixed_precision/marlin.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/mixed_precision/marlin.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/b12x.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/b12x.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/deep_gemm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/deep_gemm.py) | 2026-10-16 | Quantization, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/flashinfer.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/flashinfer.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/humming.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/humming.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/marlin.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/marlin.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/kernels/linear/scaled_mm/pytorch.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/kernels/linear/scaled_mm/pytorch.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/attention/attention.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/attention/attention.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/linear.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/linear.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/__init__.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/auto_awq.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/auto_awq.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/base_config.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/base_config.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/fp8.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/fp8.py) | 2026-10-16 | Quantization, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/online/base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/online/base.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/online/fp8.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/online/fp8.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/online/nvfp4.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/online/nvfp4.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/layers/quantization/utils/gptq_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/layers/quantization/utils/gptq_utils.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/model_loader/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/model_loader/__init__.py) | 2026-10-16 | AwsEks |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/model_loader/weight_cache/daemon.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/model_loader/weight_cache/daemon.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/model_loader/weight_cache/ipc_loader.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/model_loader/weight_cache/ipc_loader.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/model_loader/weight_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/model_loader/weight_utils.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/config.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/config.py) | 2026-10-16 | PrefixCaching |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/interfaces_base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/interfaces_base.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/interfaces.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/interfaces.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/llama.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/llama.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/registry.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/registry.py) | 2026-10-16 | codebase/CodebaseAdvanced, codebase/CodebaseArchitecture, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models/transformers/base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/model_executor/models/transformers/base.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/models/kimi_k3/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/models/kimi_k3/__init__.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/parser/metrics.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/parser/metrics.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/__init__.py) | 2026-10-24 | AwsNeuron |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/cpu.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/cpu.py) | 2026-10-16 | codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/cuda.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/cuda.py) | 2026-10-16 | codebase/CodebaseExecution, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/interface.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/interface.py) | 2026-10-16 | DecisionGuide, OperationsFailureModes, PagedAttentionKV, codebase/CodebaseConfig, codebase/CodebaseModelLayer, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/rocm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/rocm.py) | 2026-10-16 | codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/platforms/tpu.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/tpu.py) | 2026-10-16 | WhenNotVllm |
| [vllm-project/vllm @ v0.31.0: vllm/plugins/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/plugins/__init__.py) | 2026-10-16, 2026-10-24 | AwsNeuron, LoRAServing, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/plugins/lora_resolvers/filesystem_resolver.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/plugins/lora_resolvers/filesystem_resolver.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/plugins/lora_resolvers/hf_hub_resolver.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/plugins/lora_resolvers/hf_hub_resolver.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/sampling_params.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/sampling_params.py) | 2026-10-16 | PrefixCaching, V1Architecture, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/snapshot/controller.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/snapshot/controller.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/snapshot/server.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/snapshot/server.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/tool_parsers/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/tool_parsers/__init__.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/tool_parsers/rust_tool_parser.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/tool_parsers/rust_tool_parser.py) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/tool_parsers/structural_tag_registry.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/tool_parsers/structural_tag_registry.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/tracing/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/tracing/utils.py) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/utils/argparse_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/utils/argparse_utils.py) | 2026-10-16 | PagedAttentionKV, Quantization, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/utils/gc_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/utils/gc_utils.py) | 2026-10-16 | codebase/CodebaseArchitecture, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/utils/hashing.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/utils/hashing.py) | 2026-10-16 | PrefixCaching, codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/utils/torch_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/utils/torch_utils.py) | 2026-10-16 | Quantization |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backend.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backend.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/fa_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/fa_utils.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/flash_attn.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/flash_attn.py) | 2026-10-16 | PagedAttentionKV, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/mla/cutlass_mla.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/mla/cutlass_mla.py) | 2026-10-16 | PagedAttentionKV, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/mla/flashattn_mla.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/mla/flashattn_mla.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/mla/flashmla.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/mla/flashmla.py) | 2026-10-16 | PagedAttentionKV, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/attention/backends/registry.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/attention/backends/registry.py) | 2026-10-16 | PagedAttentionKV, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/block_pool.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/block_pool.py) | 2026-10-16 | PagedAttentionKV, PrefixCaching, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/kv_cache_coordinator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/kv_cache_coordinator.py) | 2026-10-16 | PagedAttentionKV, PrefixCaching, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/kv_cache_manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/kv_cache_manager.py) | 2026-10-16 | PagedAttentionKV, SchedulerBatching, V1Architecture, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/kv_cache_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/kv_cache_utils.py) | 2026-10-16 | DecisionGuide, InferenceWorkload, LoRAServing, NvidiaDynamo, OperationsFailureModes, PagedAttentionKV, PrefixCaching, ThesisAndFraming, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/sched/output.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/sched/output.py) | 2026-10-16 | codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/sched/request_queue.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/sched/request_queue.py) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/sched/scheduler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/sched/scheduler.py) | 2026-10-16 | LoRAServing, SchedulerBatching, SpeculativeDecoding, V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/core/single_type_kv_cache_manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/single_type_kv_cache_manager.py) | 2026-10-16 | PagedAttentionKV, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/__init__.py) | 2026-10-16 | codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/admission_control.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/admission_control.py) | 2026-10-16 | codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/async_llm.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/async_llm.py) | 2026-10-16 | OpenAICompatServer, OperationsFailureModes, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/coordinator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/coordinator.py) | 2026-10-16 | V1Architecture, codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/core_client.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/core_client.py) | 2026-10-16 | LoRAServing, OperationsFailureModes, V1Architecture, codebase/CodebaseArchitecture, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/core.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/core.py) | 2026-10-16 | OperationsFailureModes, SchedulerBatching, codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseExecution, codebase/CodebaseModelLayer, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/output_processor.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/output_processor.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/v1/engine/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/utils.py) | 2026-10-16 | OperationsFailureModes, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/v1/executor/abstract.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/abstract.py) | 2026-10-16 | codebase/CodebaseArchitecture, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/v1/executor/multiproc_executor.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/multiproc_executor.py) | 2026-10-16 | codebase/CodebaseArchitecture, codebase/CodebaseConfig, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/v1/executor/ray_executor_v2.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/ray_executor_v2.py) | 2026-10-16 | codebase/CodebaseArchitecture, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/v1/executor/ray_executor.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/ray_executor.py) | 2026-10-16 | codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/v1/executor/uniproc_executor.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/uniproc_executor.py) | 2026-10-16 | V1Architecture, codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/v1/hisparse/runtime.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/hisparse/runtime.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_cache_interface.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_cache_interface.py) | 2026-10-16 | PagedAttentionKV |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/cpu/shared_offload_region.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/cpu/shared_offload_region.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/cpu/spec.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/cpu/spec.py) | 2026-10-16 | KVOffloadingLMCache, ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/file_mapper.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/file_mapper.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/backpressure.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/backpressure.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/base.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/factory.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/factory.py) | 2026-10-16 | KVOffloadingLMCache, NvidiaDynamo |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/fs/manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/fs/manager.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/kvcr/manager.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/kvcr/manager.py) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/p2p/session/session.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/p2p/session/session.py) | 2026-10-16 | PrefixCaching |
| [vllm-project/vllm @ v0.31.0: vllm/v1/kv_offload/tiering/spec.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/kv_offload/tiering/spec.py) | 2026-10-16 | KVOffloadingLMCache, ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: vllm/v1/metrics/loggers.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/metrics/loggers.py) | 2026-10-16 | AwsEks, DecisionGuide, InferenceWorkload, KVOffloadingLMCache, LlmdKServe, LoRAServing, ObservabilityBench, OperationsFailureModes, PagedAttentionKV, PrefixCaching, ProductionStack, SchedulerBatching, V1Architecture, codebase/CodebaseConfig, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/metrics/stats.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/metrics/stats.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/v1/request.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/request.py) | 2026-10-16 | codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/sample/logits_processor/builtin.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/sample/logits_processor/builtin.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/sample/logits_processor/interface.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/sample/logits_processor/interface.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/sample/rejection_sampler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/sample/rejection_sampler.py) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/sample/sampler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/sample/sampler.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/serial_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/serial_utils.py) | 2026-10-16 | codebase/CodebaseArchitecture |
| [vllm-project/vllm @ v0.31.0: vllm/v1/spec_decode/draft_model.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/spec_decode/draft_model.py) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/spec_decode/llm_base_proposer.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/spec_decode/llm_base_proposer.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/spec_decode/metrics.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/spec_decode/metrics.py) | 2026-10-16 | ObservabilityBench, SpeculativeDecoding |
| [vllm-project/vllm @ v0.31.0: vllm/v1/structured_output/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/structured_output/__init__.py) | 2026-10-16 | OpenAICompatServer, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/structured_output/backend_guidance.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/structured_output/backend_guidance.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/structured_output/backend_types.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/structured_output/backend_types.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/structured_output/backend_xgrammar.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/structured_output/backend_xgrammar.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/structured_output/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/structured_output/utils.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/utils.py) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/cpu_model_runner.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/cpu_model_runner.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu_model_runner.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu_model_runner.py) | 2026-10-16 | SpeculativeDecoding, ThesisAndFraming, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu_worker.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu_worker.py) | 2026-10-16 | InferenceWorkload, KVOffloadingLMCache, OperationsFailureModes, PagedAttentionKV, SchedulerBatching, codebase/CodebaseArchitecture, codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/attn_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/attn_utils.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/buffer_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/buffer_utils.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/cudagraph_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/cudagraph_utils.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/input_batch.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/input_batch.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/lora_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/lora_utils.py) | 2026-10-16 | LoRAServing |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/model_runner.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/model_runner.py) | 2026-10-16 | PagedAttentionKV, SpeculativeDecoding, ThesisAndFraming, codebase/CodebaseAdvanced, codebase/CodebaseExecution, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/README.md](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/README.md) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/sample/logits_processor/interface.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/sample/logits_processor/interface.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/sample/sampler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/sample/sampler.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode/__init__.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/spec_decode/__init__.py) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode/draft_model/speculator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/spec_decode/draft_model/speculator.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode/rejection_sampler_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/spec_decode/rejection_sampler_utils.py) | 2026-10-16 | SpeculativeDecoding |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode/rejection_sampler.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/spec_decode/rejection_sampler.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode/speculator.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/spec_decode/speculator.py) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/states.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/states.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/structured_outputs.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/structured_outputs.py) | 2026-10-16 | codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/ubatch_utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/gpu/ubatch_utils.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/sentinel/gpu_worker_sentinel.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/sentinel/gpu_worker_sentinel.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/startup_plan.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/startup_plan.py) | 2026-10-16 | OperationsFailureModes |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/utils.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/utils.py) | 2026-10-16 | InferenceWorkload |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/worker_base.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/worker_base.py) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/xpu_model_runner.py](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/worker/xpu_model_runner.py) | 2026-10-16 | codebase/CodebaseExecution |
| [vLLM PR #43874](https://github.com/vllm-project/vllm/pull/43874) | 2026-10-16 | NvidiaDynamo |
| [pull request #47361, Delete PagedAttention](https://github.com/vllm-project/vllm/pull/47361) | 2026-10-16 | PagedAttentionKV |
| [vLLM PR #51875](https://github.com/vllm-project/vllm/pull/51875) | 2026-10-16 | NvidiaDynamo, ThesisAndFraming |
| [vLLM releases](https://github.com/vllm-project/vllm/releases) | 2026-10-16 | KVOffloadingLMCache, OpenAICompatServer, OperationsFailureModes, ThesisAndFraming |
| [v0.24.0](https://github.com/vllm-project/vllm/releases/tag/v0.24.0) | 2026-10-16 | DisaggregatedServing, Quantization, codebase/CodebaseDistributed |
| [vLLM v0.25.0 release notes](https://github.com/vllm-project/vllm/releases/tag/v0.25.0) | 2026-10-16 | PagedAttentionKV, ThesisAndFraming, codebase/CodebaseExecution, codebase/CodebaseModelLayer |
| [vLLM v0.27.0 release notes](https://github.com/vllm-project/vllm/releases/tag/v0.27.0) | 2026-10-16 | DisaggregatedServing, DistributedInference |
| [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) | 2026-10-16 | Quantization |
| [vLLM v0.29.0 release notes](https://github.com/vllm-project/vllm/releases/tag/v0.29.0) | 2026-10-16 | OperationsFailureModes, PrefixCaching, SpeculativeDecoding, ThesisAndFraming, V1Architecture, codebase/CodebaseAdvanced, codebase/CodebaseArchitecture, codebase/CodebaseExecution, codebase/CodebaseScheduler |
| [v0.30.0](https://github.com/vllm-project/vllm/releases/tag/v0.30.0) | 2026-10-16 | Quantization, SpeculativeDecoding, codebase/CodebaseAdvanced |
| [v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0) | 2026-10-16 | AwsSageMakerBedrock, DistributedInference, Quantization, Sources appendix, codebase/CodebaseAdvanced |
| [vllm-project/vllm @ v0.31.0 (commit db9527a4)](https://github.com/vllm-project/vllm/tree/v0.31.0) | 2026-10-16 | DistributedInference, Sources appendix, codebase/CodebaseAdvanced, codebase/CodebaseArchitecture, codebase/CodebaseDistributed, codebase/CodebaseExecution, codebase/CodebaseModelLayer, codebase/CodebaseScheduler |
| [vllm-project/vllm @ v0.31.0: benchmarks](https://github.com/vllm-project/vllm/tree/v0.31.0/benchmarks) | 2026-10-16 | Sources appendix |
| [vllm-project/vllm @ v0.31.0: examples/observability/dashboards](https://github.com/vllm-project/vllm/tree/v0.31.0/examples/observability/dashboards) | 2026-10-16 | ObservabilityBench |
| [vllm-project/vllm @ v0.31.0: examples/observability/opentelemetry](https://github.com/vllm-project/vllm/tree/v0.31.0/examples/observability/opentelemetry) | 2026-10-16 | ObservabilityBench, Sources appendix |
| [vllm-project/vllm @ v0.31.0: examples/observability/prometheus_grafana](https://github.com/vllm-project/vllm/tree/v0.31.0/examples/observability/prometheus_grafana) | 2026-10-16 | ObservabilityBench, Sources appendix |
| [vllm-project/vllm @ v0.31.0: rust](https://github.com/vllm-project/vllm/tree/v0.31.0/rust) | 2026-10-16 | Sources appendix, codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: rust/src/parser/src](https://github.com/vllm-project/vllm/tree/v0.31.0/rust/src/parser/src) | 2026-10-16 | codebase/CodebaseRust |
| [vllm-project/vllm @ v0.31.0: vllm/config](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/config) | 2026-10-16 | Sources appendix, codebase/CodebaseConfig |
| [vllm-project/vllm @ v0.31.0: vllm/distributed/kv_transfer/kv_connector/v1/nixl](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl) | 2026-10-16 | AwsGpuEfaNixl, codebase/CodebaseDistributed |
| [vllm-project/vllm @ v0.31.0: vllm/entrypoints/launchers](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/entrypoints/launchers) | 2026-10-16 | OpenAICompatServer |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/model_executor) | 2026-10-16 | Sources appendix |
| [vllm-project/vllm @ v0.31.0: vllm/model_executor/models](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/model_executor/models) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/models](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/models) | 2026-10-16 | codebase/CodebaseModelLayer |
| [vllm-project/vllm @ v0.31.0: vllm/platforms](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/platforms) | 2026-10-16 | ThesisAndFraming |
| [vllm-project/vllm @ v0.31.0: vllm/v1](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1) | 2026-10-16 | Sources appendix |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1/worker/gpu) | 2026-10-16 | codebase/CodebaseExecution |
| [vllm-project/vllm @ v0.31.0: vllm/v1/worker/gpu/spec_decode](https://github.com/vllm-project/vllm/tree/v0.31.0/vllm/v1/worker/gpu/spec_decode) | 2026-10-16 | codebase/CodebaseAdvanced |
| [Hugging Face Text Generation Inference (TGI) docs (repository archived)](https://huggingface.co/docs/text-generation-inference/index) | 2026-10-16 | Sources appendix |
| [TensorRT-LLM documentation](https://nvidia.github.io/TensorRT-LLM/) | 2026-10-16 | Sources appendix |
| [libtorch-neuronx-lite wheel (searched)](https://pip.repos.neuron.amazonaws.com/libtorch-neuronx-lite/libtorch_neuronx_lite-2.13.0.1.0.3112%2B653bc48f-cp312-cp312-linux_x86_64.whl) | 2026-10-24 | AwsNeuron |
| [PyPI: nixl 1.3.2](https://pypi.org/project/nixl/1.3.2/) | 2026-10-16 | NvidiaDynamo |
| [PyTorch Foundation: welcomes vLLM (May 7, 2025)](https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/) | 2026-10-16 | WhenNotVllm |

## Tier 2: vendor and project blogs, talks, product pages (vendor figures are vendor claims)

24 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [AWS What's New: NIXL with EFA (Mar 2026)](https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/) | 2026-10-16 | Sources appendix |
| [Amazon Bedrock (product page)](https://aws.amazon.com/bedrock/) | 2026-10-16 | Sources appendix |
| [AWS ML Blog: faster auto-scaling for generative AI models](https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [AWS ML Blog: Real-time voice with SageMaker AI + vLLM (streaming)](https://aws.amazon.com/blogs/machine-learning/build-real-time-voice-applications-with-amazon-sagemaker-ai-and-vllm/) | 2026-10-16 | Sources appendix |
| [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/) | 2026-10-16 | AwsEks, AwsGpuEfaNixl, Sources appendix |
| [AWS ML Blog: multi-tenant LoRA serving](https://aws.amazon.com/blogs/machine-learning/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [AWS ML Blog: Multi-LoRA / MoE vLLM on SageMaker + Bedrock](https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [AWS ML Blog: Enhanced metrics for SageMaker AI endpoints](https://aws.amazon.com/blogs/machine-learning/enhanced-metrics-for-amazon-sagemaker-ai-endpoints-deeper-visibility-for-better-performance/) | 2026-10-16 | Sources appendix |
| [AWS ML blog: How Amazon scaled Rufus](https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/) | 2026-10-16, 2026-10-24 | AwsNeuron, Ec2TopologyPlacement, Sources appendix |
| [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/) | 2026-10-16 | AwsEks, AwsGpuEfaNixl, Sources appendix |
| [AWS ML Blog: P-EAGLE in vLLM](https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/) | 2026-10-16 | AwsSageMakerBedrock, Sources appendix |
| [AWS ML Blog: prefix-aware routing (vendor benchmark)](https://aws.amazon.com/blogs/machine-learning/reduce-llm-latency-with-prefix-aware-routing-on-amazon-sagemaker-inference/) | 2026-10-16 | AwsSageMakerBedrock |
| [EC2 P6 product page](https://aws.amazon.com/ec2/instance-types/p6/) | 2026-10-17 | AwsGpuEfaNixl |
| [NVIDIA blog: Introducing NVIDIA Dynamo](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/) | 2026-10-16 | NvidiaDynamo, Sources appendix |
| [NVIDIA blog: Dynamo accelerates llm-d](https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/) | 2026-10-16 | NvidiaDynamo, Sources appendix |
| [LiteLLM security update](https://docs.litellm.ai/blog/security-update-march-2026) | 2026-10-16 | GatewaysAppLayer, Sources appendix |
| [aws-samples/load-test-llm-with-locust (sagemaker_vllm_loadtest.ipynb)](https://github.com/aws-samples/load-test-llm-with-locust) | 2026-10-16 | Sources appendix |
| [LMCache/LMCache @ v0.5.6: README.md](https://github.com/LMCache/LMCache/blob/v0.5.6/README.md) | 2026-10-16 | KVOffloadingLMCache |
| [vllm-project/vllm @ v0.31.0: rust/src/bench/README.md](https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/bench/README.md) | 2026-10-16 | ObservabilityBench |
| [llm-d production blog (vendor claim)](https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm) | 2026-10-16 | LlmdKServe, Sources appendix |
| [vLLM blog: vLLM Router release](https://vllm-project.github.io/2025/12/13/vllm-router-release.html) | 2026-10-16 | ProductionStack, Sources appendix |
| [vLLM blog: V1 alpha release](https://vllm.ai/blog/2025-01-27-v1-alpha-release) | 2026-10-16 | PrefixCaching, Sources appendix, V1Architecture |
| [Anyscale Blog: Ray Serve LLM: Wide-EP & disaggregated serving with vLLM](https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm) | 2026-10-16 | RayServeLLM, Sources appendix |
| [PyTorch Foundation welcomes vLLM (press release)](https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html) | 2026-10-16 | Sources appendix, ThesisAndFraming |

## Tier 3: third-party analysis, papers, press

4 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [arXiv:2211.17192](https://arxiv.org/abs/2211.17192) | 2026-10-16 | Sources appendix, SpeculativeDecoding, codebase/CodebaseAdvanced |
| [arXiv:2309.06180](https://arxiv.org/abs/2309.06180) | 2026-10-16 | PagedAttentionKV, Sources appendix |
| [arXiv:2403.10444](https://arxiv.org/abs/2403.10444) | 2026-10-16 | SpeculativeDecoding, codebase/CodebaseAdvanced |
| [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/) | 2026-10-16 | GatewaysAppLayer, Sources appendix |
