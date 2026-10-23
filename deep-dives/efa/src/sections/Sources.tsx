import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SourcesAppendix, Glossary } from '@tech-deep-dives/shared';
import type { Source, FactCheckItem, GlossaryEntry } from '@tech-deep-dives/shared';

const sources: Source[] = [
  // Tier 1: Official AWS docs
  { id: 1, title: 'AWS EC2 User Guide: Elastic Fabric Adapter', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 2, title: 'AWS EC2 User Guide: Get started with EFA and MPI', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 3, title: 'AWS EC2 User Guide: Get started with EFA and NCCL', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 4, title: 'AWS EC2 User Guide: EFA Accelerated Instance Types', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 5, title: 'AWS EC2 Accelerated Computing Instance Specs', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 6, title: 'AWS EC2 Placement Groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 7, title: 'EKS User Guide: Manage EFA devices on Amazon EKS', url: 'https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 19, title: 'AWS Neuron Collective Communication Docs', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 20, title: 'AWS Neuron Training FAQ', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 21, title: 'SageMaker Data Parallel Library', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 22, title: 'SageMaker Expert Parallelism', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 29, title: 'EC2 DescribeInstanceTopology API Reference', url: 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 30, title: 'EC2 Capacity Blocks for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 31, title: 'EC2 On-Demand Capacity Reservations', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 42, title: 'AWS Well-Architected HPC Lens: Data protection', url: 'https://docs.aws.amazon.com/wellarchitected/latest/high-performance-computing-lens/data-protection.html', tier: 1, type: 'official-docs', accessDate: '2026-08-02' },
  { id: 43, title: 'EC2 instance types: Specifications for high-performance computing instances', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html', tier: 1, type: 'official-docs', accessDate: '2026-08-02' },
  // Tier 1: Price List bulk API. The Pricing section pins every rate to a
  // publication version, so the version travels in the title.
  { id: 40, title: 'AWS Price List bulk API, Amazon EC2, us-east-1 (version 20261022231453)', url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv', tier: 1, type: 'api-reference', accessDate: '2026-10-23' },
  { id: 41, title: 'AWS Price List bulk API, Amazon EC2, us-east-2 (version 20261022231453)', url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv', tier: 1, type: 'api-reference', accessDate: '2026-10-23' },
  // Tier 1: Source code
  { id: 48, title: 'EFA installer 1.51.0 ChangeLog.md and package list (inside aws-efa-installer-1.51.0.tar.gz)', url: 'https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 17, title: 'aws/aws-ofi-nccl GitHub README (v1.22.0)', url: 'https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 18, title: 'aws/aws-ofi-nccl Releases', url: 'https://github.com/aws/aws-ofi-nccl/releases', tier: 1, type: 'source-code', accessDate: '2026-03-22' },
  { id: 32, title: 'NVIDIA/nccl source code (src/graph/search.cc, v2.32.3-1)', url: 'https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/graph/search.cc', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 33, title: 'aws/aws-ofi-nccl tuner source (src/tuner/nccl_ofi_tuner.cpp, v1.22.0)', url: 'https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/tuner/nccl_ofi_tuner.cpp', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 34, title: 'aws/aws-ofi-nccl topology XML files (v1.22.0)', url: 'https://github.com/aws/aws-ofi-nccl/tree/v1.22.0/topology', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 49, title: 'AWS Neuron documentation (Neuron 2.33.0): Amazon EC2 Trn3 Architecture', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/arch/neuron-hardware/trn3-arch.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 51, title: 'NVIDIA/nccl GIN backend priority: the NCCL proxy ranks above EFA-GDA (src/plugin/gin.cc, v2.32.3-1)', url: 'https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/plugin/gin.cc#L327-L340', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 53, title: 'AWS Neuron documentation (Neuron 2.33.0): Amazon EC2 Trn1 Architecture', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/arch/neuron-hardware/trn1-arch.html', tier: 1, type: 'official-docs', accessDate: '2026-10-23' },
  { id: 54, title: 'vLLM speculative decoding documentation (docs/features/speculative_decoding/README.md, v0.32.0)', url: 'https://github.com/vllm-project/vllm/blob/v0.32.0/docs/features/speculative_decoding/README.md#L3', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  // Tier 2: AWS product pages, blogs, announcements
  { id: 50, title: 'AWS News Blog: Now Available - Elastic Fabric Adapter (EFA) for Tightly-Coupled HPC Workloads (April 29, 2019)', url: 'https://aws.amazon.com/blogs/aws/now-available-elastic-fabric-adapter-efa-for-tightly-coupled-hpc-workloads/', tier: 2, type: 'aws-blog', accessDate: '2026-10-23' },
  { id: 8, title: 'Amazon EC2 P5 Instance Types', url: 'https://aws.amazon.com/ec2/instance-types/p5/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 9, title: 'Amazon EC2 Trn2 Instance Types', url: 'https://aws.amazon.com/ec2/instance-types/trn2/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 10, title: 'Amazon EC2 UltraServers', url: 'https://aws.amazon.com/ec2/ultraservers/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 11, title: 'AWS EFA Product Page', url: 'https://aws.amazon.com/hpc/efa/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 12, title: 'AWS What\'s New: P5en GA (Dec 2024)', url: 'https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 13, title: 'AWS What\'s New: P5en N. Virginia/Jakarta (Mar 2025)', url: 'https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 14, title: 'AWS What\'s New: P5en N. California (May 2025)', url: 'https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 15, title: 'AWS What\'s New: Trn2 GA (Dec 2024)', url: 'https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 16, title: 'AWS What\'s New: EFA Cross-Subnet (2024)', url: 'https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 23, title: 'Multi-Node vLLM EKS Blueprints', url: 'https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/', tier: 2, type: 'aws-open-source', accessDate: '2026-03-22' },
  { id: 26, title: 'AWS HPC Blog: Second Generation EFA', url: 'https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/', tier: 2, type: 'aws-blog', accessDate: '2026-03-22' },
  { id: 27, title: 'AWS HPC Blog: hpc7a MPI Multi-Rail EFA', url: 'https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/', tier: 2, type: 'aws-blog', accessDate: '2026-03-22' },
  { id: 28, title: 'AWS HPC Benchmarking Whitepaper', url: 'https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf', tier: 2, type: 'whitepaper', accessDate: '2026-03-22' },
  { id: 44, title: 'AWS What\'s New: Announcing new high performance computing Amazon EC2 Hpc8a instances (Feb 2026)', url: 'https://aws.amazon.com/about-aws/whats-new/2026/02/announcing-amazon-ec2-hpc8a-instances/', tier: 2, type: 'announcement', accessDate: '2026-08-02' },
  // Tier 3: Third-party analysis, benchmarks, academic papers
  { id: 55, title: 'Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (arXiv:2104.04473)', url: 'https://arxiv.org/abs/2104.04473', tier: 3, type: 'academic-paper', accessDate: '2026-10-23' },
  { id: 52, title: 'Shoeybi et al., Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism (arXiv:1909.08053)', url: 'https://arxiv.org/abs/1909.08053', tier: 3, type: 'academic-paper', accessDate: '2026-10-23' },
  { id: 24, title: 'CFD Direct: OpenFOAM HPC with AWS EFA', url: 'https://cfd.direct/cloud/openfoam-hpc-aws-efa/', tier: 3, type: 'third-party-benchmark', accessDate: '2026-03-22' },
  { id: 25, title: 'Ernest Chiang: AWS SRD Protocol Deep Dive', url: 'https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/', tier: 3, type: 'third-party-analysis', accessDate: '2026-03-22' },
  // Tier 3 because NVIDIA is a third party to AWS. The comparison sections
  // label the same page tier 2 under the vendor-neutral SourceRef scale.
  { id: 45, title: 'NVIDIA NVLink and NVLink Switch', url: 'https://www.nvidia.com/en-us/data-center/nvlink/', tier: 3, type: 'product-page', accessDate: '2026-10-23' },
  // NIXL sources
  { id: 35, title: 'NVIDIA NIXL GitHub Repository', url: 'https://github.com/ai-dynamo/nixl', tier: 1, type: 'source-code', accessDate: '2026-03-22' },
  { id: 36, title: 'NIXL Repository at v1.5.0', url: 'https://github.com/ai-dynamo/nixl/tree/v1.5.0', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 37, title: 'NIXL libfabric Backend README (src/plugins/libfabric, v1.5.0)', url: 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/libfabric/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 38, title: 'vLLM NixlConnector Source (kv_connector/v1/nixl, v0.32.0)', url: 'https://github.com/vllm-project/vllm/tree/v0.32.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 46, title: 'NIXL libfabric backend: host-posted fi_writemsg and fi_readmsg (src/utils/libfabric/libfabric_rail.cpp, v1.5.0)', url: 'https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/utils/libfabric/libfabric_rail.cpp#L1310-L1336', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
  { id: 47, title: 'NVIDIA/nccl point-to-point plan selects a device kernel (src/enqueue/enqueue.cc, scheduleP2pTasksToPlan, v2.32.3-1)', url: 'https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/enqueue/enqueue.cc#L1241-L1249', tier: 1, type: 'source-code', accessDate: '2026-10-23' },
];

/**
 * Fact-check register: a spot-check on the figures that travel, and the place a
 * reader tests whether a number in the dive holds.
 *
 * Adding a row: the `section` field names a title in the live nav in App.tsx,
 * the claim appears in that section's prose at that value, and the cited source
 * supports it. The roughly 400 inline SourceRef citations carry everything else,
 * so a section with no row here is sourced inline.
 *
 * Keeping a row out: figures the sections removed as unsourceable (the
 * per-message microsecond latencies, the single-flow SRD numbers, and the ENA
 * Express 25 Gbps figure, which describes ENA Express rather than EFA), and
 * numbers the dive corrected (prices are pinned to a price list version in the
 * Pricing section, so the pre-June-2025 p5 and p4d rates read as a price cut).
 */
const factChecks: FactCheckItem[] = [
  // What is EFA?
  { claim: 'Up to 3,200 Gbps aggregate bandwidth on P5', section: 'What is EFA?', sourceId: 4 },
  { claim: 'EFA traffic encrypted in transit by Nitro with zero performance penalty', section: 'What is EFA?', sourceId: 42 },

  // The EFA Device
  { claim: 'p5.48xlarge: 32 network cards, 33 interfaces in the AWS launch example, 32 EFA devices', section: 'The EFA Device: Attachment, Cards and Rails', sourceId: 4 },

  // The EC2 Instance Topology API
  { claim: 'Topology enters above NCCL, which never calls either topology API', section: 'The EC2 Instance Topology API', sourceId: 32 },

  // Instance Support Matrix
  { claim: '6,400 Gbps on P6-B300: 17 network cards, 16 of them EFA-capable at 400 Gbps each', section: 'Instance Support Matrix', sourceId: 4 },
  { claim: '3,200 Gbps bandwidth on P5 with 32 EFA interfaces', section: 'Instance Support Matrix', sourceId: 5 },
  { claim: '400 Gbps bandwidth on P4d with 4 EFA interfaces', section: 'Instance Support Matrix', sourceId: 1 },
  { claim: '3,200 Gbps bandwidth on Trn2 with 16 EFA interfaces', section: 'Instance Support Matrix', sourceId: 1 },
  { claim: 'P5en has 16 network cards = 16 EFA but same 3,200 Gbps total', section: 'Instance Support Matrix', sourceId: 5 },
  { claim: 'Up to 28.8 Tbps per P6e-GB200 UltraServer, on a product page that also says EFAv4', section: 'Instance Support Matrix', sourceId: 10 },
  { claim: 'Trn3 EFA bandwidth is published per UltraServer only: 12,800 Gbps for Gen1 and 28,800 Gbps for Gen2', section: 'Instance Support Matrix', sourceId: 49 },
  { claim: 'Inf2 does NOT have EFA; only inf1.24xlarge has single 100 Gbps EFA', section: 'Instance Support Matrix', sourceId: 1 },

  // NCCL over EFA
  { claim: 'NCCL ranks its own GIN proxy above EFA-GDA, so a job runs GDAKI only with NCCL_GIN_TYPE=5', section: 'NCCL over EFA: the aws-ofi-nccl Plugin', sourceId: 51 },
  { claim: 'P5 and P5en ship no static topology XML; the plugin generates one at run time', section: 'NCCL over EFA: the aws-ofi-nccl Plugin', sourceId: 34 },
  { claim: 'NCCL_ALGO and NCCL_PROTO switch the tuner off only in the v2 entry point (NCCL 2.21.x); v3 and v6 run it either way', section: 'NCCL over EFA: the aws-ofi-nccl Plugin', sourceId: 33 },

  // AI/ML Training
  { claim: 'Tensor parallelism adds allreduce operations to the forward and backward pass', section: 'AI/ML Training', sourceId: 52 },
  { claim: 'Tensor parallelism is best kept within a node because of its all-reduce cost; pipeline parallelism uses cheaper point-to-point transfers that can cross nodes', section: 'AI/ML Training', sourceId: 55 },
  { claim: '7B model allreduce: about 2.2s at 100 Gbps against about 70ms at 3,200 Gbps', section: 'AI/ML Training', sourceId: 4 },
  { claim: 'Trn1n has 16 EFA interfaces (1,600 Gbps) vs Trn1 8 EFA (800 Gbps)', section: 'AI/ML Training', sourceId: 1 },
  { claim: 'Trn2: 30 to 40% better price performance than P5e and P5en', section: 'AI/ML Training', sourceId: 9 },
  { claim: 'Trn2 UltraServers: 4 nodes = 64 chips, 12.8 Tbps EFA', section: 'AI/ML Training', sourceId: 9 },
  { claim: '900 GB/s per GPU on fourth-generation NVLink, which is what P5 carries', section: 'AI/ML Training', sourceId: 45 },

  // AI/ML Inference
  { claim: 'Speculative decoding round-trips land in inter-token latency, not time-to-first-token', section: 'AI/ML Inference', sourceId: 54 },
  { claim: '405B parameters at fp16 = ~810GB model size', section: 'AI/ML Inference', sourceId: 8 },
  { claim: 'P5 has 640GB total GPU memory (8x H100 80GB)', section: 'AI/ML Inference', sourceId: 8 },
  { claim: 'NIXL requires libfabric 1.21.0+', section: 'AI/ML Inference', sourceId: 1 },
  { claim: 'NCCL runs its point-to-point sends and receives inside a GPU kernel', section: 'AI/ML Inference', sourceId: 47 },
  { claim: 'NIXL over the libfabric backend posts transfers from host threads, with no GPU kernel launch', section: 'AI/ML Inference', sourceId: 46 },
  { claim: 'vLLM NixlConnector: prefiller as producer, decoder as consumer', section: 'AI/ML Inference', sourceId: 38 },

  // Traditional HPC
  { claim: '98.4% parallel efficiency at 1,008 cores (28 c5n instances) for CFD', section: 'Traditional HPC', sourceId: 24 },
  { claim: '10% speedup at 32 instances with multi-rail EFA on hpc7a', section: 'Traditional HPC', sourceId: 27 },
  { claim: '30%+ improvement at 192 instances with multi-rail EFA', section: 'Traditional HPC', sourceId: 27 },
  { claim: 'Hpc7a: up to 192 AMD EPYC cores, 300 Gbps EFA', section: 'Traditional HPC', sourceId: 43 },
  { claim: 'Hpc8a: up to 40% higher performance than Hpc7a', section: 'Traditional HPC', sourceId: 44 },

  // EFA vs Alternatives
  { claim: 'The one AWS per-message EFA latency figure located is 15.5 microseconds one-way MPI, from the 2019 launch post', section: 'EFA vs Alternatives', sourceId: 50 },
  { claim: 'Up to 6,400 Gbps per instance on P6-B300, the EFA row of the transport comparison', section: 'EFA vs Alternatives', sourceId: 4 },

  // Pricing Analysis
  { claim: 'EFA is an optional networking feature at no additional cost on any supported instance', section: 'Pricing Analysis', sourceId: 1 },
  { claim: 'p5.48xlarge On-Demand: $55.04/hr, us-east-1, price list 20261022231453', section: 'Pricing Analysis', sourceId: 40 },
  { claim: 'p4d.24xlarge On-Demand: $21.957642/hr, us-east-1, price list 20261022231453', section: 'Pricing Analysis', sourceId: 40 },
  { claim: 'trn1.32xlarge On-Demand: $21.50/hr', section: 'Pricing Analysis', sourceId: 40 },
  { claim: 'trn1n.32xlarge On-Demand: $24.78/hr', section: 'Pricing Analysis', sourceId: 40 },
  { claim: 'hpc7a.96xlarge On-Demand: $7.20/hr in us-east-2. There is no us-east-1 SKU', section: 'Pricing Analysis', sourceId: 41 },

  // Decision Guide
  { claim: 'trn1.32xlarge connects its Trainium chips with NeuronLink-v2 in a 2D torus, not NVLink', section: 'Decision Guide', sourceId: 53 },
  { claim: '30 to 40% better price performance on Trn2 vs P5e at scale', section: 'Decision Guide', sourceId: 9 },
  { claim: 'SMDDP AllGather reduces GPU SM usage from 24 to under 9, on P4 only', section: 'Decision Guide', sourceId: 21 },
  { claim: 'The placement group for an ODCR is chosen when the reservation is created', section: 'Decision Guide', sourceId: 2 },

  // EFA on Amazon EKS
  { claim: 'VPC CNI v1.7.10+ for multi-EFA, v1.18.5+ for EFA-only', section: 'EFA on Amazon EKS', sourceId: 7 },
  { claim: 'EC2 instances with EFA pre-allocate 5128 2MiB huge pages', section: 'EFA on Amazon EKS', sourceId: 7 },
  { claim: 'EFA Device Plugin v0.5.6+ for P6-B200', section: 'EFA on Amazon EKS', sourceId: 7 },
];

const glossary: GlossaryEntry[] = [
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'AWS network interface enabling OS-bypass networking for EC2 instances. It carries no charge of its own, and its traffic stays inside one Availability Zone' },
  { acronym: 'SRD', fullForm: 'Scalable Reliable Datagram', description: 'AWS proprietary transport protocol for datacenter networks, purpose-built for lossy fabrics' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'Standard library for GPU-to-GPU collective operations in distributed training' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'Technology allowing direct memory access between computers without OS involvement' },
  { acronym: 'MPI', fullForm: 'Message Passing Interface', description: 'Standard communication protocol for parallel computing in HPC workloads' },
  { acronym: 'HPC', fullForm: 'High-Performance Computing', description: 'Computing paradigm for complex simulations and scientific workloads' },
  { acronym: 'ENI', fullForm: 'Elastic Network Interface', description: 'Virtual network interface in AWS VPC that can be attached to EC2 instances' },
  { acronym: 'ENA', fullForm: 'Elastic Network Adapter', description: 'AWS standard high-performance network interface for EC2. Its traffic goes through the kernel stack' },
  { acronym: 'RoCE', fullForm: 'RDMA over Converged Ethernet', description: 'Network protocol enabling RDMA over Ethernet; requires lossless fabric with PFC' },
  { acronym: 'NVLink', fullForm: 'NVIDIA GPU Interconnect', description: 'NVIDIA proprietary high-bandwidth interconnect for GPU-to-GPU communication within a node' },
  { acronym: 'NVSwitch', fullForm: 'NVIDIA GPU Switch Fabric', description: 'NVIDIA switch chip enabling all-to-all GPU communication within a node' },
  { acronym: 'PFC', fullForm: 'Priority Flow Control', description: 'Ethernet flow control mechanism that can pause traffic; required by RoCE, can cause deadlocks' },
  { acronym: 'ECMP', fullForm: 'Equal-Cost Multi-Path', description: 'Routing strategy distributing traffic across multiple equal-cost paths, hashing each flow onto one path' },
  { acronym: 'DPU', fullForm: 'Data Processing Unit', description: 'Specialized processor offloading network, storage, and security functions from the host CPU' },
  { acronym: 'QP', fullForm: 'Queue Pair', description: 'Fundamental communication endpoint in RDMA/EFA consisting of a send queue and receive queue' },
  { acronym: 'CQ', fullForm: 'Completion Queue', description: 'Queue where hardware posts completion notifications for finished send/receive operations' },
  { acronym: 'PD', fullForm: 'Protection Domain', description: 'Security boundary in RDMA/EFA isolating memory regions and queue pairs between processes' },
  { acronym: 'WQE', fullForm: 'Work Queue Entry', description: 'Individual work item posted to a send or receive queue for the NIC to process' },
  { acronym: 'LLQ', fullForm: 'Low Latency Queue', description: 'EFA mechanism writing descriptors directly to NIC via MMIO, skipping DMA for small messages' },
  { acronym: 'UARN', fullForm: 'User Access Region Number', description: 'Hardware-enforced per-process doorbell scoping mechanism in EFA' },
  { acronym: 'UCX', fullForm: 'Unified Communication X', description: 'Open source communication framework. vLLM NixlConnector selects the NIXL UCX backend unless another is named; the AWS EFA and NIXL guide names the LIBFABRIC backend' },
  { acronym: 'SHARP', fullForm: 'Scalable Hierarchical Aggregation and Reduction Protocol', description: 'NVIDIA InfiniBand in-network reduction, which runs part of a collective in the switch. EFA has no switch-side equivalent' },
  { acronym: 'BBR', fullForm: 'Bottleneck Bandwidth and Round-trip propagation time', description: 'TCP congestion control algorithm, an alternative to CUBIC on WAN paths' },
  { acronym: 'LoRA', fullForm: 'Low-Rank Adaptation', description: 'Fine-tuning method that trains small low-rank matrices instead of the full weights, which keeps it on a single instance' },
  { acronym: 'QLoRA', fullForm: 'Quantized LoRA', description: 'LoRA applied to a quantized base model, cutting memory further' },
  { acronym: 'LTS', fullForm: 'Long-Term Support', description: 'Driver or software branch maintained for an extended period. The EKS AMI build pairs an NVIDIA LTS driver with a production-branch driver' },
  { acronym: 'SSM', fullForm: 'AWS Systems Manager', description: 'AWS service for managed access to instances and remote command runs' },
  { acronym: 'NGC', fullForm: 'NVIDIA GPU Cloud', description: 'NVIDIA container catalog. The EFA installer detects NGC-derived containers and changes what it installs inside them' },
  { acronym: 'ROCr', fullForm: 'ROCm Runtime', description: 'AMD GPU runtime. The libfabric EFA provider treats ROCr memory like CUDA memory when it picks a wire protocol' },
  { acronym: 'BAR', fullForm: 'Base Address Register', description: 'PCIe register defining memory-mapped I/O regions for device communication' },
  { acronym: 'DDP', fullForm: 'Distributed Data Parallel', description: 'PyTorch strategy replicating model across GPUs and synchronizing gradients via allreduce' },
  { acronym: 'FSDP', fullForm: 'Fully Sharded Data Parallel', description: 'PyTorch strategy sharding model parameters, gradients, and optimizer states across GPUs' },
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Splitting individual layers across GPUs; requires all-to-all communication every forward/backward pass' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Splitting model layers sequentially across GPUs; requires point-to-point activation transfers' },
  { acronym: 'DP', fullForm: 'Data Parallelism', description: 'Each GPU processes different data with full model copy; synchronizes via allreduce' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'Architecture routing tokens to different expert sub-networks; uses all-to-all communication' },
  { acronym: 'GDR', fullForm: 'GPUDirect RDMA', description: 'Technology enabling direct data transfer between GPU memory and network adapter' },
  { acronym: 'CFD', fullForm: 'Computational Fluid Dynamics', description: 'Simulation of fluid flow using numerical methods; common tightly-coupled HPC workload' },
  { acronym: 'WRF', fullForm: 'Weather Research and Forecasting', description: 'Mesoscale numerical weather prediction system used in atmospheric research' },
  { acronym: 'AMI', fullForm: 'Amazon Machine Image', description: 'Template for EC2 instance root volumes containing OS, application server, and applications' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'NVIDIA library for point-to-point inference transfers, including KV cache migration and disaggregated prefill and decode. Reaches EFA through its libfabric backend plugin, which requires libfabric 1.21.0 or later' },
  { acronym: 'SM', fullForm: 'Streaming Multiprocessor', description: 'GPU compute unit containing CUDA cores. NCCL runs its collectives and its send and receive in SMs; a NIXL transfer over the libfabric backend runs in none' },
  { acronym: 'KV', fullForm: 'Key-Value', description: 'As in KV-cache: stores computed attention keys and values for autoregressive inference' },
  { acronym: 'CC', fullForm: 'Collectives Communication', description: 'CC cores: dedicated synchronization processors on each Trainium NeuronCore that orchestrate collective communication' },
  { acronym: 'RDM', fullForm: 'Reliable Datagram Message', description: 'Libfabric endpoint type adding software reliability and message tagging over unreliable datagrams' },
  { acronym: 'DGRAM', fullForm: 'Datagram', description: 'Raw unreliable datagram endpoint type in libfabric; used directly by some MPI implementations' },
  { acronym: 'PCIe', fullForm: 'Peripheral Component Interconnect Express', description: 'High-speed serial bus standard connecting CPUs, GPUs, NICs, and other peripherals' },
  { acronym: 'SLA', fullForm: 'Service Level Agreement', description: 'Contractual commitment defining expected service availability and performance' },
  { acronym: 'SMDDP', fullForm: 'SageMaker Distributed Data Parallel', description: 'AWS library that replaces the NCCL AllReduce and AllGather path on a narrow instance set. Supports ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge only, with the optimized AllGather on P4 alone' },
  { acronym: 'CNI', fullForm: 'Container Network Interface', description: 'Plugin specification for configuring network interfaces in Linux containers (used in Kubernetes)' },
  { acronym: 'OFI', fullForm: 'OpenFabrics Interfaces', description: 'Framework (libfabric) providing a portable API for high-performance fabric services' },
  { acronym: 'RCCL', fullForm: 'ROCm Communication Collectives Library', description: 'AMD equivalent of NCCL for ROCm GPU collective communications' },
  { acronym: 'ODCR', fullForm: 'On-Demand Capacity Reservation', description: 'AWS mechanism to reserve EC2 capacity in a specific AZ for an open-ended duration. The placement group is chosen when the reservation is created' },
  { acronym: 'MSI-X', fullForm: 'Message Signaled Interrupts Extended', description: 'PCIe interrupt mechanism supporting per-queue interrupts for high-performance I/O' },
  { acronym: 'NCI', fullForm: 'Network Card Index', description: 'Identifier for a specific network card on a multi-NIC EC2 instance' },

  // EFA hardware generations
  { acronym: 'EFAv1', fullForm: 'Elastic Fabric Adapter generation 1', description: 'First EFA generation, on Nitro v3 instances such as P4d. The baseline AWS measures the second generation against' },
  { acronym: 'EFAv2', fullForm: 'Elastic Fabric Adapter generation 2', description: 'Second EFA generation, on Nitro v4. AWS reports 30% lower endpoint latency than the first generation and an additional 50% communication-time improvement for very small collectives' },
  { acronym: 'EFAv3', fullForm: 'Elastic Fabric Adapter generation 3', description: 'Third EFA generation, on Nitro v5 instances such as P5en and Trn2. AWS states up to 35% lower latency for P5en than for P5, which carries the previous generation' },
  { acronym: 'EFAv4', fullForm: 'Elastic Fabric Adapter generation 4', description: 'Fourth EFA generation, on Nitro v6 instances such as P6-B200 and P6-B300. The EC2 User Guide and the P6 product page also give EFA v4 for P6e-GB200, while the accelerated computing instance-types page lists its hypervisor as Nitro v5' },

  // AWS platform
  { acronym: 'EC2', fullForm: 'Elastic Compute Cloud', description: 'AWS virtual machine service. EFA attaches to EC2 instances as an additional network interface' },
  { acronym: 'EKS', fullForm: 'Elastic Kubernetes Service', description: 'AWS managed Kubernetes. Reaches EFA through the EFA device plugin or the EFA DRA driver' },
  { acronym: 'ECS', fullForm: 'Elastic Container Service', description: 'AWS container orchestrator. Exposes EFA to tasks on supported instance types' },
  { acronym: 'VPC', fullForm: 'Virtual Private Cloud', description: 'Isolated AWS network. EFA traffic stays inside one VPC and inside one Availability Zone' },
  { acronym: 'AZ', fullForm: 'Availability Zone', description: 'Isolated datacenter group inside an AWS Region. EFA traffic cannot cross an AZ boundary, which is why co-located training jobs pin to one AZ' },
  { acronym: 'IAM', fullForm: 'Identity and Access Management', description: 'AWS permissions service. Governs which principal may call the topology and capacity APIs cited here' },
  { acronym: 'AL2023', fullForm: 'Amazon Linux 2023', description: 'Current Amazon Linux generation and the AMI family the EKS EFA install scripts target' },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: 'AWS-maintained container image shipping libfabric, aws-ofi-nccl, NCCL and OpenMPI. Installs EFA with --skip-kmod, so the host keeps the kernel module' },
  { acronym: 'CRT', fullForm: 'AWS Common Runtime', description: 'S3 client library used by the AWS CLI and Boto3 for parallel multipart transfers. Its traffic is TCP on the ENA device' },

  // Kubernetes and scheduler layer
  { acronym: 'DRA', fullForm: 'Dynamic Resource Allocation', description: 'Kubernetes API for claiming specialized devices. The EFA DRA driver is the successor to the EFA device plugin' },
  { acronym: 'DRANET', fullForm: 'DRA network driver', description: 'Kubernetes network driver, upstream at kubernetes-sigs/dranet, that exposes EFA devices through DRA. AWS packages it as the aws-dranet chart in aws/eks-charts' },
  { acronym: 'SPANK', fullForm: 'Slurm Plug-in Architecture for Node and job (K)control', description: 'Slurm plug-in framework. SageMaker HyperPod builds its Slurm auto-resume health check on it' },
  { acronym: 'DCGM', fullForm: 'Data Center GPU Manager', description: 'NVIDIA GPU health and telemetry suite. HyperPod deep health checks run its level 4 diagnostics alongside the EFA benchmark' },
  { acronym: 'DKMS', fullForm: 'Dynamic Kernel Module Support', description: 'Linux framework that rebuilds out-of-tree modules against a new kernel. The EFA kernel driver installs through it' },
  { acronym: 'MOFED', fullForm: 'Mellanox OpenFabrics Enterprise Distribution', description: 'NVIDIA networking driver stack. Enabling it next to the EFA installer causes a driver collision on EKS nodes' },

  // Inference and transfer stack
  { acronym: 'DPD', fullForm: 'Disaggregated Prefill and Decode', description: 'Inference pattern that runs prefill and decode on separate nodes and ships the KV cache between them. The one documented SageMaker path where EFA carries inference traffic' },
  { acronym: 'LMCache', fullForm: 'LMCache KV cache layer', description: 'Open source KV cache layer for LLM serving. In the HyperPod DPD stack it sits above NIXL and splits prefill from decode' },
  { acronym: 'SMP', fullForm: 'SageMaker Model Parallelism library', description: 'AWS training library for sharded model parallelism. Its relationship to EFA is indirect, mediated by SMDDP or by NCCL over aws-ofi-nccl' },

  // GPU data movement
  { acronym: 'GIN', fullForm: 'GPU-Initiated Networking', description: 'NCCL plugin interface that lets a GPU kernel drive network operations. aws-ofi-nccl provides a proxy implementation and a kernel-initiated one, GDAKI' },
  { acronym: 'GDAKI', fullForm: 'GPUDirect Async Kernel-Initiated', description: 'GIN implementation in which GPU kernels drive EFA queue pairs through the libfabric FI_EFA_GDA_OPS table. The aws-ofi-nccl export reports the EFA_GDA device type, which NCCL_GIN_TYPE=5 selects, and runs on p5en, p6-b200 and p6-b300' },
  { acronym: 'GDRCopy', fullForm: 'GPUDirect RDMA Copy library', description: 'NVIDIA low-latency library for copying between host and GPU memory, and a documented EFA install step. A separate component from GPUDirect RDMA, listed here as GDR' },
  { acronym: 'GDS', fullForm: 'GPUDirect Storage', description: 'NVIDIA path moving file data straight between storage and GPU memory, skipping a host bounce buffer. Used by FSx for Lustre on a restricted instance list' },
  { acronym: 'GDRDMA', fullForm: 'GPUDirect RDMA', description: 'Token printed in the NCCL log line NET/Libfabric/0/GDRDMA, which is the evidence that the plugin selected the GPUDirect RDMA path' },
  { acronym: 'DMA', fullForm: 'Direct Memory Access', description: 'Transfer the device drives itself, straight to and from host memory' },
  { acronym: 'MMIO', fullForm: 'Memory-Mapped I/O', description: 'Addressing a device through the CPU memory map. EFA uses it for the LLQ doorbell write' },

  // Verbs and queue objects
  { acronym: 'MR', fullForm: 'Memory Region', description: 'Registered and pinned memory range the NIC is allowed to read and write directly' },
  { acronym: 'AH', fullForm: 'Address Handle', description: 'Verbs object holding the destination addressing a send needs on an unreliable or SRD endpoint' },
  { acronym: 'SQ', fullForm: 'Send Queue', description: 'Half of a queue pair. Work requests are written here for the NIC to pick up' },
  { acronym: 'RNR', fullForm: 'Receiver Not Ready', description: 'Condition where the receiver has no posted buffer. RNR retry is an SRD-only property on EFA' },
  { acronym: 'ABI', fullForm: 'Application Binary Interface', description: 'Binary contract between kernel driver and userspace provider. Changing it breaks an installed libfabric' },
  { acronym: 'VF', fullForm: 'Virtual Function', description: 'SR-IOV device presented to a guest. Every EFA PCI ID is a VF; there is no EFA physical function' },
  { acronym: 'PF', fullForm: 'Physical Function', description: 'Full PCIe function of an SR-IOV device. ENA exposes one; EFA presents virtual functions only' },

  // Network and kernel offloads
  { acronym: 'MTU', fullForm: 'Maximum Transmission Unit', description: 'Largest frame a link carries without fragmenting' },
  { acronym: 'MSS', fullForm: 'Maximum Segment Size', description: 'Largest TCP payload per segment, clamped automatically on some AWS paths' },
  { acronym: 'TSO', fullForm: 'TCP Segmentation Offload', description: 'Hardware splitting of a large TCP buffer into wire-sized segments. An ENA feature with no EFA equivalent' },
  { acronym: 'GRO', fullForm: 'Generic Receive Offload', description: 'Kernel-side merging of received packets into fewer, larger buffers' },
  { acronym: 'LRO', fullForm: 'Large Receive Offload', description: 'Hardware-side merging of received segments before they reach the kernel' },
  { acronym: 'RSS', fullForm: 'Receive Side Scaling', description: 'Hashing received flows across queues so multiple cores share the receive load' },
  { acronym: 'DIM', fullForm: 'Dynamic Interrupt Moderation', description: 'Adaptive tuning of interrupt coalescing against observed traffic' },
  { acronym: 'XDP', fullForm: 'eXpress Data Path', description: 'Kernel eBPF hook at the driver receive path. Supported on ENA; the EFA data path bypasses the kernel' },
  { acronym: 'NIC', fullForm: 'Network Interface Card', description: 'The network adapter itself. On EFA-capable instances a network card can present both an ENA and an EFA device' },
  { acronym: 'RMA', fullForm: 'Remote Memory Access', description: 'One-sided read and write into a peer address space. The libfabric DGRAM endpoint type omits it' },
  { acronym: 'AEAD', fullForm: 'Authenticated Encryption with Associated Data', description: 'Encryption class that authenticates as it encrypts. Used by the Nitro in-transit encryption applied to EFA traffic' },

  // Storage and memory
  { acronym: 'LNet', fullForm: 'Lustre Networking', description: 'Lustre transport layer. On FSx for Lustre it runs over the EFA device, and over TCP on ENA where EFA is absent' },
  { acronym: 'NVMe', fullForm: 'Non-Volatile Memory Express', description: 'Protocol for attaching solid state storage over PCIe' },
  { acronym: 'HBM3e', fullForm: 'High Bandwidth Memory 3e', description: 'Stacked memory generation on current training accelerators' },

  // Publication venue
  { acronym: 'NSDI', fullForm: 'Networked Systems Design and Implementation', description: 'USENIX conference. Named here because the SRD paper is often miscited to it. The SRD paper is Shalev et al., IEEE Micro 2020' },
];

export function Sources() {
  return (
    <SpaceBetween size="l">
      <SourcesAppendix sources={sources} factChecks={factChecks} />
      <Glossary entries={glossary} />
    </SpaceBetween>
  );
}
