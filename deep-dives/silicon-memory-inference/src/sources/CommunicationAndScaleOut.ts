import type { Source } from '../components/Cite';

/**
 * Sources for Communication and Scale-Out (CommunicationAndScaleOut.tsx and
 * CommunicationStack.tsx). Register: research/2026-10-refresh/04-other-arch.md,
 * section 0 and section 4 (CS1 to CS28). Records shared with other sections
 * reuse their URL, title, publisher and tier exactly; pages fetched for this
 * section carry the date they were read.
 */
export const S = {
  // EC2 and EFA documentation (Tier 1)
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  efaUserGuide: {
    title: 'Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  awsOfiNccl: {
    title: 'aws/aws-ofi-nccl release v1.21.1',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-ofi-nccl/releases/tag/v1.21.1',
    tier: 1,
    accessed: '2026-10-16',
  },

  // AWS Neuron documentation (Tier 1)
  trainium2Arch: {
    title: 'AWS Neuron: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trn2Arch: {
    title: 'AWS Neuron: Amazon EC2 Trn2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trn3Arch: {
    title: 'AWS Neuron: Amazon EC2 Trn3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  collectives: {
    title: 'AWS Neuron: What is Neuron Collective Communication?',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronWhatsNew: {
    title: "AWS Neuron: What's New in the AWS Neuron SDK (releases 2.27.0 to 2.32.0)",
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  nxdiMoe: {
    title: 'AWS Neuron 2.32.0: NxD Inference MoE architecture deep dive',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  pytorchNative: {
    title: 'AWS Neuron: Native PyTorch for AWS Trainium (TorchNeuron)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/pytorch-native-overview.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Collective and transfer libraries, pinned to release tags (Tier 1)
  ncclV2283: {
    title: 'NVIDIA/nccl release v2.28.3-1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/nccl/releases/tag/v2.28.3-1',
    tier: 1,
    accessed: '2026-10-16',
  },
  ncclV2323: {
    title: 'NVIDIA/nccl release v2.32.3-1 (2026-09-17)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/nccl/releases/tag/v2.32.3-1',
    tier: 1,
    accessed: '2026-10-17',
  },
  ncclEp: {
    title: 'NVIDIA/nccl release nccl-ep-v0.1.0 (NCCL EP, MoE dispatch and combine, 2026-06-08)',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/nccl/releases/tag/nccl-ep-v0.1.0',
    tier: 1,
    accessed: '2026-10-17',
  },
  nixlReadme: {
    title:
      'ai-dynamo/nixl README at tag v1.5.0 (point-to-point transfers for inference frameworks)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  nixlLibfabric: {
    title:
      'ai-dynamo/nixl libfabric plugin README at tag v1.5.0 (validated on AWS EFA, Neuron requirements)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/libfabric/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  dynamoDisaggDoc: {
    title:
      'Dynamo disaggregated serving architecture doc at tag v1.5.1 (NIXL VRAM-to-VRAM, non-blocking KV transfer)',
    publisher: 'NVIDIA Dynamo',
    url: 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1/docs/fern/pages/developer-guide/knowledge-base/concepts/system-architecture/disaggregated-serving.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  deepEpReadme: {
    title: 'DeepEP README at tag v1.2.1 (V1 kernel performance tables)',
    publisher: 'DeepSeek-AI',
    url: 'https://github.com/deepseek-ai/DeepEP/blob/v1.2.1/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  wideEpReadme: {
    title: 'TensorRT-LLM examples/wide_ep README at tag v1.2.1',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/TensorRT-LLM/blob/v1.2.1/examples/wide_ep/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  sglangExecArgs: {
    title:
      'SGLang python/sglang/srt/arg_groups/fields/exec_.py at tag v0.5.21 (--moe-a2a-backend choices)',
    publisher: 'SGLang',
    url: 'https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/arg_groups/fields/exec_.py',
    tier: 1,
    accessed: '2026-10-16',
  },
  pytorchNvshmem: {
    title:
      'PyTorch torch/csrc/distributed/c10d/symm_mem/nvshmem_extension.hpp at tag v2.14.1 (all_to_all_vdev_2d)',
    publisher: 'PyTorch',
    url: 'https://github.com/pytorch/pytorch/blob/v2.14.1/torch/csrc/distributed/c10d/symm_mem/nvshmem_extension.hpp#L64',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Open interconnect standards (Tier 1: the standards body's specification release)
  ualink10: {
    title:
      'UALink Consortium press release: UALink Consortium Releases the Ultra Accelerator Link 200G 1.0 Specification (2025-04-08, PDF)',
    publisher: 'UALink Consortium',
    url: 'https://ualinkconsortium.org/wp-content/uploads/2025/04/UALink-1.0-Specification-PR_FINAL.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  ualinkFourSpecs: {
    title:
      'UALink Consortium press release: UALink Consortium Publishes Four Specifications (2026-04-07, PDF)',
    publisher: 'UALink Consortium',
    url: 'https://ualinkconsortium.org/wp-content/uploads/2026/04/UALink-2.0-Specification-PR_FINAL.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Vendor blogs, product pages and press releases (Tier 2)
  srdHpcBlog: {
    title:
      "AWS HPC Blog: In the search for performance, there's more than one way to build a network (2021-06-22)",
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/',
    tier: 2,
    accessed: '2026-10-17',
  },
  p6Page: {
    title: 'Amazon EC2 P6 instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/p6/',
    tier: 2,
    accessed: '2026-10-17',
  },
  uecSpec10: {
    title: 'Ultra Ethernet Consortium: UEC Launches Specification 1.0 (2025-06-11)',
    publisher: 'Ultra Ethernet Consortium',
    url: 'https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/',
    tier: 2,
    accessed: '2026-10-17',
  },
  nvlinkFusionTrainium4: {
    title:
      'NVIDIA Technical Blog: AWS Integrates AI Infrastructure with NVIDIA NVLink Fusion for Trainium4 Deployment (2025-12-02)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/aws-integrates-ai-infrastructure-with-nvidia-nvlink-fusion-for-trainium4-deployment/',
    tier: 2,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
