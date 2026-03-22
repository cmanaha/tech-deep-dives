import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SourcesAppendix, Glossary } from '@tech-deep-dives/shared';
import type { Source, FactCheckItem, GlossaryEntry } from '@tech-deep-dives/shared';

const sources: Source[] = [
  // Tier 1 — Official AWS docs
  { id: 1, title: 'AWS EC2 User Guide — Elastic Fabric Adapter', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 2, title: 'AWS EC2 User Guide — Get started with EFA and MPI', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 3, title: 'AWS EC2 User Guide — Get started with EFA and NCCL', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 4, title: 'AWS EC2 User Guide — EFA Accelerated Instance Types', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 5, title: 'AWS EC2 Accelerated Computing Instance Specs', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 6, title: 'AWS EC2 Placement Groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 7, title: 'AWS EKS — Node EFA', url: 'https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 19, title: 'AWS Neuron Collective Communication Docs', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 20, title: 'AWS Neuron Training FAQ', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 21, title: 'SageMaker Data Parallel Library', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  { id: 22, title: 'SageMaker Expert Parallelism', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html', tier: 1, type: 'official-docs', accessDate: '2026-03-22' },
  // Tier 1 — Source code
  { id: 17, title: 'aws/aws-ofi-nccl GitHub README', url: 'https://github.com/aws/aws-ofi-nccl/blob/master/README.md', tier: 1, type: 'source-code', accessDate: '2026-03-22' },
  { id: 18, title: 'aws/aws-ofi-nccl Releases', url: 'https://github.com/aws/aws-ofi-nccl/releases', tier: 1, type: 'source-code', accessDate: '2026-03-22' },
  // Tier 2 — AWS product pages, blogs, announcements
  { id: 8, title: 'Amazon EC2 P5 Instance Types', url: 'https://aws.amazon.com/ec2/instance-types/p5/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 9, title: 'Amazon EC2 Trn2 Instance Types', url: 'https://aws.amazon.com/ec2/instance-types/trn2/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 10, title: 'Amazon EC2 UltraServers', url: 'https://aws.amazon.com/ec2/ultraservers/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 11, title: 'AWS EFA Product Page', url: 'https://aws.amazon.com/hpc/efa/', tier: 2, type: 'product-page', accessDate: '2026-03-22' },
  { id: 12, title: 'AWS What\'s New — P5en GA (Dec 2024)', url: 'https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 13, title: 'AWS What\'s New — P5en N. Virginia/Jakarta (Mar 2025)', url: 'https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 14, title: 'AWS What\'s New — P5en N. California (May 2025)', url: 'https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 15, title: 'AWS What\'s New — Trn2 GA (Dec 2024)', url: 'https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 16, title: 'AWS What\'s New — EFA Cross-Subnet (2024)', url: 'https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/', tier: 2, type: 'announcement', accessDate: '2026-03-22' },
  { id: 23, title: 'Multi-Node vLLM EKS Blueprints', url: 'https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/', tier: 2, type: 'aws-open-source', accessDate: '2026-03-22' },
  { id: 26, title: 'AWS HPC Blog — Second Generation EFA', url: 'https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/', tier: 2, type: 'aws-blog', accessDate: '2026-03-22' },
  { id: 27, title: 'AWS HPC Blog — hpc7a MPI Multi-Rail EFA', url: 'https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/', tier: 2, type: 'aws-blog', accessDate: '2026-03-22' },
  { id: 28, title: 'AWS HPC Benchmarking Whitepaper', url: 'https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf', tier: 2, type: 'whitepaper', accessDate: '2026-03-22' },
  // Tier 3 — Third-party analysis, benchmarks, academic papers
  { id: 24, title: 'CFD Direct — OpenFOAM HPC with AWS EFA', url: 'https://cfd.direct/cloud/openfoam-hpc-aws-efa/', tier: 3, type: 'third-party-benchmark', accessDate: '2026-03-22' },
  { id: 25, title: 'Ernest Chiang — AWS SRD Protocol Deep Dive', url: 'https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/', tier: 3, type: 'third-party-analysis', accessDate: '2026-03-22' },
];

const factChecks: FactCheckItem[] = [
  // Overview section
  { claim: '~100+ microseconds TCP kernel overhead per message', section: 'What is EFA?', sourceId: 25 },
  { claim: '~15 microseconds EFA MPI ping-pong latency', section: 'What is EFA?', sourceId: 25 },
  { claim: 'Up to 3,200 Gbps aggregate bandwidth on P5', section: 'What is EFA?', sourceId: 8 },
  { claim: 'EFA traffic encrypted in transit by Nitro with zero performance penalty', section: 'What is EFA?', sourceId: 1 },
  { claim: 'EFA is free — no per-interface charge, no data transfer fee', section: 'What is EFA?', sourceId: 11 },

  // Architecture & SRD Protocol section
  { claim: '30-60% of total step time is network communication at 64+ nodes', section: 'Architecture & SRD Protocol', sourceId: 26 },
  { claim: '~15\u03BCs per-message latency with SRD', section: 'Architecture & SRD Protocol', sourceId: 25 },
  { claim: '64-path packet spraying in SRD', section: 'Architecture & SRD Protocol', sourceId: 25 },
  { claim: '900 GB/s NVLink bisection bandwidth intra-node', section: 'Architecture & SRD Protocol', sourceId: 8 },
  { claim: 'Up to 6,400 Gbps inter-node on P6-B300', section: 'Architecture & SRD Protocol', sourceId: 5 },
  { claim: 'Max single-flow ~5 Gbps TCP vs SRD ~25 Gbps', section: 'Architecture & SRD Protocol', sourceId: 25 },
  { claim: '~100x faster retransmission than RFC 6298 200ms minimum', section: 'Architecture & SRD Protocol', sourceId: 25 },
  { claim: 'P99.9 latency 85% reduction versus TCP', section: 'Architecture & SRD Protocol', sourceId: 25 },
  { claim: 'P5 has 32 network cards = 32 EFA interfaces', section: 'Architecture & SRD Protocol', sourceId: 4 },
  { claim: 'P5en has 16 network cards = 16 EFA but same 3,200 Gbps total', section: 'Architecture & SRD Protocol', sourceId: 12 },
  { claim: 'SRD described in IEEE Micro 2020 paper by Shalev et al.', section: 'Architecture & SRD Protocol', sourceId: 25 },

  // Instance Support Matrix section
  { claim: '6,400 Gbps bandwidth on P6-B300 with 17 EFA interfaces', section: 'Instance Support Matrix', sourceId: 5 },
  { claim: '3,200 Gbps bandwidth on P5 with 32 EFA interfaces', section: 'Instance Support Matrix', sourceId: 8 },
  { claim: '400 Gbps bandwidth on P4d with 4 EFA interfaces', section: 'Instance Support Matrix', sourceId: 4 },
  { claim: '3,200 Gbps bandwidth on Trn2 with 16 EFA interfaces', section: 'Instance Support Matrix', sourceId: 9 },
  { claim: '28.8 Tbps per UltraServer (P6e-GB200, 72 GPUs)', section: 'Instance Support Matrix', sourceId: 10 },
  { claim: 'EFAv3 has 35% lower latency vs EFAv2', section: 'Instance Support Matrix', sourceId: 12 },
  { claim: '75% faster collectives on EFAv2 vs EFAv1', section: 'Instance Support Matrix', sourceId: 26 },
  { claim: 'Inf2 does NOT have EFA; only inf1.24xlarge has single 100 Gbps EFA', section: 'Instance Support Matrix', sourceId: 4 },
  { claim: 'Hpc8a: 40% higher performance than hpc7a', section: 'Instance Support Matrix', sourceId: 5 },

  // AI/ML Training section
  { claim: '7B model allreduce: ~2.2s at 100 Gbps vs ~70ms at 3,200 Gbps (31x reduction)', section: 'AI/ML Training', sourceId: 8 },
  { claim: '85-95% scaling efficiency with EFA on P5 for DDP', section: 'AI/ML Training', sourceId: 26 },
  { claim: '40-60% scaling efficiency without EFA at same scale', section: 'AI/ML Training', sourceId: 26 },
  { claim: 'Trn1n has 16 EFA interfaces (1,600 Gbps) vs Trn1 8 EFA (800 Gbps)', section: 'AI/ML Training', sourceId: 4 },
  { claim: 'Trn2: 30-40% better price-performance than P5e', section: 'AI/ML Training', sourceId: 9 },
  { claim: 'NeuronLink 2D torus at 1 TB/s intra-node on Trn2', section: 'AI/ML Training', sourceId: 9 },
  { claim: 'CC Engine provides 10-15% additional acceleration over NCCL', section: 'AI/ML Training', sourceId: 19 },
  { claim: 'Trn2 UltraServers: 4 nodes = 64 chips, 12.8 Tbps EFA', section: 'AI/ML Training', sourceId: 9 },

  // AI/ML Inference section
  { claim: '405B parameters at fp16 = ~810GB model size', section: 'AI/ML Inference', sourceId: 8 },
  { claim: 'P5 has 640GB total GPU memory (8x H100 80GB)', section: 'AI/ML Inference', sourceId: 8 },
  { claim: 'NIXL requires libfabric 1.21.0+', section: 'AI/ML Inference', sourceId: 17 },

  // HPC section
  { claim: '98.4% parallel efficiency at 1,008 cores (28 c5n instances) for CFD', section: 'Traditional HPC', sourceId: 24 },
  { claim: '4x improvement in CFD scaling over ENA', section: 'Traditional HPC', sourceId: 11 },
  { claim: '10% speedup at 32 instances with multi-rail EFA on hpc7a', section: 'Traditional HPC', sourceId: 27 },
  { claim: '30%+ improvement at 192 instances with multi-rail EFA', section: 'Traditional HPC', sourceId: 27 },
  { claim: 'Up to 2.05x MD speedup at 2 instances vs ENA', section: 'Traditional HPC', sourceId: 28 },
  { claim: 'Hpc7a: 96 AMD EPYC cores, 300 Gbps EFA', section: 'Traditional HPC', sourceId: 5 },
  { claim: 'Hpc8a: 96 EPYC 9005 cores, 300 Gbps EFA, 42% greater memory bandwidth', section: 'Traditional HPC', sourceId: 5 },

  // EFA vs Alternatives section
  { claim: '~15.5\u03BCs MPI ping-pong latency (EFA)', section: 'EFA vs Alternatives', sourceId: 25 },
  { claim: '~100+ \u03BCs latency (TCP kernel path)', section: 'EFA vs Alternatives', sourceId: 25 },
  { claim: '~1-2 \u03BCs latency (InfiniBand RDMA)', section: 'EFA vs Alternatives', sourceId: 25 },
  { claim: '200 Gbps max ENI bandwidth (TCP)', section: 'EFA vs Alternatives', sourceId: 5 },
  { claim: '~25 Gbps max single-flow SRD vs ~5 Gbps TCP', section: 'EFA vs Alternatives', sourceId: 25 },

  // Pricing section
  { claim: 'p5.48xlarge On-Demand: $98.32/hr', section: 'Pricing Analysis', sourceId: 8 },
  { claim: 'p4d.24xlarge On-Demand: $32.77/hr', section: 'Pricing Analysis', sourceId: 8 },
  { claim: 'trn1.32xlarge On-Demand: $21.50/hr', section: 'Pricing Analysis', sourceId: 9 },
  { claim: 'trn1n.32xlarge On-Demand: $24.78/hr', section: 'Pricing Analysis', sourceId: 9 },
  { claim: 'hpc7a.96xlarge On-Demand: $3.60/hr', section: 'Pricing Analysis', sourceId: 5 },

  // Decision Guide section
  { claim: '90%+ scaling efficiency with EFA vs 40-60% without', section: 'Decision Guide', sourceId: 26 },
  { claim: '30-40% better price-performance on Trn2 vs P5e at scale', section: 'Decision Guide', sourceId: 9 },
  { claim: 'SMDDP AllGather reduces GPU SM usage from 24 to under 9', section: 'Decision Guide', sourceId: 21 },

  // EKS & Containers section
  { claim: 'VPC CNI v1.7.10+ for multi-EFA, v1.18.5+ for EFA-only', section: 'EKS & Containers', sourceId: 7 },
  { claim: 'EC2 instances with EFA pre-allocate 5,128 2MiB huge pages', section: 'EKS & Containers', sourceId: 7 },
  { claim: 'EFA Device Plugin v0.5.6+ for P6-B200', section: 'EKS & Containers', sourceId: 7 },
];

const glossary: GlossaryEntry[] = [
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'AWS network interface enabling OS-bypass networking for EC2 instances' },
  { acronym: 'SRD', fullForm: 'Scalable Reliable Datagram', description: 'AWS proprietary transport protocol for datacenter networks, purpose-built for lossy fabrics' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'Standard library for GPU-to-GPU collective operations in distributed training' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'Technology allowing direct memory access between computers without OS involvement' },
  { acronym: 'MPI', fullForm: 'Message Passing Interface', description: 'Standard communication protocol for parallel computing in HPC workloads' },
  { acronym: 'HPC', fullForm: 'High-Performance Computing', description: 'Computing paradigm for complex simulations and scientific workloads' },
  { acronym: 'ENI', fullForm: 'Elastic Network Interface', description: 'Virtual network interface in AWS VPC that can be attached to EC2 instances' },
  { acronym: 'ENA', fullForm: 'Elastic Network Adapter', description: 'AWS standard high-performance network interface for EC2 (non-OS-bypass)' },
  { acronym: 'RoCE', fullForm: 'RDMA over Converged Ethernet', description: 'Network protocol enabling RDMA over Ethernet; requires lossless fabric with PFC' },
  { acronym: 'NVLink', fullForm: 'NVIDIA GPU Interconnect', description: 'NVIDIA proprietary high-bandwidth interconnect for GPU-to-GPU communication within a node' },
  { acronym: 'NVSwitch', fullForm: 'NVIDIA GPU Switch Fabric', description: 'NVIDIA switch chip enabling all-to-all GPU communication within a node' },
  { acronym: 'PFC', fullForm: 'Priority Flow Control', description: 'Ethernet flow control mechanism that can pause traffic; required by RoCE, can cause deadlocks' },
  { acronym: 'ECMP', fullForm: 'Equal-Cost Multi-Path', description: 'Routing strategy distributing traffic across multiple equal-cost paths (flow-level, not packet-level)' },
  { acronym: 'DPU', fullForm: 'Data Processing Unit', description: 'Specialized processor offloading network, storage, and security functions from the host CPU' },
  { acronym: 'QP', fullForm: 'Queue Pair', description: 'Fundamental communication endpoint in RDMA/EFA consisting of a send queue and receive queue' },
  { acronym: 'CQ', fullForm: 'Completion Queue', description: 'Queue where hardware posts completion notifications for finished send/receive operations' },
  { acronym: 'PD', fullForm: 'Protection Domain', description: 'Security boundary in RDMA/EFA isolating memory regions and queue pairs between processes' },
  { acronym: 'WQE', fullForm: 'Work Queue Entry', description: 'Individual work item posted to a send or receive queue for the NIC to process' },
  { acronym: 'LLQ', fullForm: 'Low-Latency Queue', description: 'EFA mechanism writing descriptors directly to NIC via MMIO, skipping DMA for small messages' },
  { acronym: 'UARN', fullForm: 'User Access Region Number', description: 'Hardware-enforced per-process doorbell scoping mechanism in EFA' },
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
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'Library for multi-node inference transfer patterns including KV-cache migration (2025+)' },
  { acronym: 'KV', fullForm: 'Key-Value', description: 'As in KV-cache — stores computed attention keys and values for autoregressive inference' },
  { acronym: 'CC', fullForm: 'Collective Compute', description: 'Dedicated engine on Trainium chips orchestrating collective operations independently from NeuronCores' },
  { acronym: 'RDM', fullForm: 'Reliable Datagram Message', description: 'Libfabric endpoint type adding software reliability and message tagging over unreliable datagrams' },
  { acronym: 'DGRAM', fullForm: 'Datagram', description: 'Raw unreliable datagram endpoint type in libfabric; used directly by some MPI implementations' },
  { acronym: 'PCIe', fullForm: 'Peripheral Component Interconnect Express', description: 'High-speed serial bus standard connecting CPUs, GPUs, NICs, and other peripherals' },
  { acronym: 'SLA', fullForm: 'Service Level Agreement', description: 'Contractual commitment defining expected service availability and performance' },
  { acronym: 'SMDDP', fullForm: 'SageMaker Distributed Data Parallel', description: 'AWS library optimizing AllGather with mesh topology for reduced GPU SM usage' },
  { acronym: 'CNI', fullForm: 'Container Network Interface', description: 'Plugin specification for configuring network interfaces in Linux containers (used in Kubernetes)' },
  { acronym: 'OFI', fullForm: 'OpenFabrics Interfaces', description: 'Framework (libfabric) providing a portable API for high-performance fabric services' },
  { acronym: 'RCCL', fullForm: 'ROCm Communication Collectives Library', description: 'AMD equivalent of NCCL for ROCm GPU collective communications' },
  { acronym: 'ODCR', fullForm: 'On-Demand Capacity Reservation', description: 'AWS mechanism to reserve EC2 capacity in a specific AZ without long-term commitment' },
  { acronym: 'MSI-X', fullForm: 'Message Signaled Interrupts Extended', description: 'PCIe interrupt mechanism supporting per-queue interrupts for high-performance I/O' },
];

export function Sources() {
  return (
    <SpaceBetween size="l">
      <SourcesAppendix sources={sources} factChecks={factChecks} />
      <Glossary entries={glossary} />
    </SpaceBetween>
  );
}
