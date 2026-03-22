import React from 'react';
import { SourcesAppendix } from '@tech-deep-dives/shared';
import type { Source, FactCheckItem } from '@tech-deep-dives/shared';

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

export function Sources() {
  return <SourcesAppendix sources={sources} factChecks={factChecks} />;
}
