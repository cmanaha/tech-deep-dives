import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import type { GlossaryEntry, Source } from '@tech-deep-dives/shared';
import { GlossaryTable, KeySourcesTable } from '../components/AppendixTables';
import { Cite, E1_URL, E2_URL, E3_URL, E4_URL, GUIDE_URL } from '../components/Cite';

// Section 32. Source tiers (RESEARCH-GUIDE.md section 1):
//  0 = our own experiments (listed in the first panel, not in the key-sources table)
//  1 = source code at a pinned ref, framework documentation, first-party AWS documentation and
//      price files, NVIDIA specification pages (their peaks are vendor specifications)
//  2 = first-party lab and vendor posts and samples (their numbers stay claims)
//  3 = papers (venue or "preprint") and third-party technical analysis
// The array below is the curated reading list. Tier, URL, venue and accessed date are taken from
// sources.md, which revamp/tools/gen-sources.mjs generates from every inline Cite in src/, so the
// list cannot drift from what the sections cite. sources.md lists every citation.

const sources: Source[] = [
  // Tier 1: framework code and documentation at the pinned refs
  { id: 1, title: 'PyTorch v2.15.0: FSDP2 fully_shard', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fully_shard.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 2, title: 'PyTorch v2.15.0: DeviceMesh', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/device_mesh.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 3, title: 'PyTorch v2.15.0: pipeline schedules', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/pipelining/schedules.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 4, title: 'PyTorch v2.15.0: Distributed Checkpoint save and async_save', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 5, title: 'PyTorch v2.15.0: ProcessGroupNCCL watchdog and timeouts', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 6, title: 'PyTorch v2.15.0: Flight Recorder', url: 'https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/FlightRecorder.cpp', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 7, title: 'TorchTitan v0.4.0: parallelism configuration and defaults', url: 'https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 8, title: 'TorchTitan v0.4.0: Llama 3 benchmarks on H100', url: 'https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 9, title: 'TorchTitan Neuron release-2.33.0: dense model tutorials and validated layouts', url: 'https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/docs/dense-tutorials.md', tier: 1, type: 'aws-open-source', accessDate: '2026-10-31' },
  { id: 10, title: 'Megatron-LM core_v0.20.0: training arguments and defaults', url: 'https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 11, title: 'Megatron Core core_v0.20.0: parallelism guide', url: 'https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 12, title: 'Megatron Core core_v0.20.0: distributed optimizer guide', url: 'https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 13, title: 'Megatron Core core_v0.20.0: mixture-of-experts guide', url: 'https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 14, title: 'DeepSpeed v0.19.9: ZeRO stages 1 and 2', url: 'https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 15, title: 'Transformer Engine v2.21.0: FP8, MXFP8 and NVFP4 recipes', url: 'https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/common/recipe/__init__.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 16, title: 'nccl-tests v2.21.1: algorithm and bus bandwidth', url: 'https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 17, title: 'NCCL user guide: RAS (reliability, availability and serviceability)', url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/ras.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 18, title: 'DCGM v4.7.0: field definitions', url: 'https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 19, title: 'dcgm-exporter 4.8.4: default metric set', url: 'https://github.com/NVIDIA/dcgm-exporter/blob/4.8.4/etc/dcp-metrics-included.csv', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 20, title: 'NVIDIA Xid error catalog', url: 'https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 21, title: 'Holistic Trace Analysis v0.6.1', url: 'https://github.com/facebookresearch/HolisticTraceAnalysis/blob/v0.6.1/hta/trace_analysis.py', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 22, title: 'Amazon S3 Connector for PyTorch v1.5.0', url: 'https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md', tier: 1, type: 'aws-open-source', accessDate: '2026-10-31' },
  { id: 23, title: 'Mountpoint for Amazon S3 1.24.0: file system semantics', url: 'https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md', tier: 1, type: 'aws-open-source', accessDate: '2026-10-31' },
  { id: 24, title: 'SageMaker HyperPod recipes 2.0.11: checkpointless Llama 3 70B pretraining', url: 'https://github.com/aws/sagemaker-hyperpod-recipes/blob/2.0.11/hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml', tier: 1, type: 'aws-open-source', accessDate: '2026-10-31' },
  { id: 25, title: 'Kueue at commit 14b7928', url: 'https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 26, title: 'JobSet v0.13.0', url: 'https://github.com/kubernetes-sigs/jobset/blob/v0.13.0/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-31' },
  { id: 27, title: 'AWS Neuron SDK documentation: TorchTitan on Neuron', url: 'https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst', tier: 1, type: 'aws-open-source', accessDate: '2026-10-31' },
  // Tier 1: first-party AWS documentation and pricing
  { id: 28, title: 'Amazon EC2 instance types: accelerated computing specifications', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 29, title: 'Amazon EC2 user guide: Capacity Blocks for ML', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 30, title: 'Amazon EC2 Capacity Blocks pricing', url: 'https://aws.amazon.com/ec2/capacityblocks/pricing/', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  { id: 31, title: 'AWS Price List: Amazon EC2 offer 20261029175634, us-east-1', url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  { id: 32, title: 'Amazon SageMaker AI: training plans', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 33, title: 'Amazon SageMaker AI: how training jobs work', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-training.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 34, title: 'Amazon SageMaker AI: managed Spot training', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 35, title: 'SageMaker HyperPod: Slurm orchestration', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 36, title: 'SageMaker HyperPod: Slurm deep health checks', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 37, title: 'SageMaker HyperPod: Slurm auto-resume', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 38, title: 'SageMaker HyperPod: EKS orchestration', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 39, title: 'SageMaker HyperPod: health monitoring agent', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 40, title: 'SageMaker HyperPod: checkpointless training', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 41, title: 'SageMaker HyperPod: training operator', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 42, title: 'AWS Parallel Computing Service: cluster size', url: 'https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 43, title: 'AWS Parallel Computing Service: Capacity Blocks', url: 'https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 44, title: 'Amazon EKS user guide: accelerated compute for machine learning', url: 'https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 45, title: 'Amazon FSx for Lustre: SSD storage performance', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 46, title: 'Amazon S3 user guide: optimizing performance', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  { id: 47, title: 'AWS Neuron documentation: Trainium2 architecture', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html', tier: 1, type: 'official-docs', accessDate: '2026-10-31' },
  // Tier 1: NVIDIA specifications (vendor figures)
  { id: 48, title: 'NVIDIA H100 specifications', url: 'https://www.nvidia.com/en-us/data-center/h100/', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  { id: 49, title: 'NVIDIA HGX B200 and B300 specifications', url: 'https://www.nvidia.com/en-us/data-center/hgx/', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  { id: 50, title: 'NVIDIA GB200 NVL72 specifications', url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  { id: 51, title: 'NVIDIA NVLink', url: 'https://www.nvidia.com/en-us/data-center/nvlink/', tier: 1, type: 'product-page', accessDate: '2026-10-31' },
  // Tier 2: first-party lab and vendor posts and samples (their figures stay claims)
  { id: 52, title: 'AWS samples, awsome-distributed-training: nccl-tests on p5', url: 'https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md', tier: 2, type: 'aws-open-source', accessDate: '2026-10-31' },
  { id: 53, title: 'Meta, OPT-175B training chronicles: final update', url: 'https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/final_update.md', tier: 2, type: 'blog', accessDate: '2026-10-31' },
  { id: 54, title: 'Amazon Science: more efficient recovery from failures during large ML model training', url: 'https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training', tier: 2, type: 'blog', accessDate: '2026-10-31' },
  // Tier 3: training runs and reliability
  { id: 55, title: 'The Llama 3 Herd of Models, arXiv 2407.21783v3, preprint', url: 'https://arxiv.org/abs/2407.21783v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 56, title: 'PaLM: Scaling Language Modeling with Pathways, arXiv 2204.02311v5, preprint', url: 'https://arxiv.org/abs/2204.02311v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 57, title: 'OPT: Open Pre-trained Transformer Language Models, arXiv 2205.01068v4, preprint', url: 'https://arxiv.org/abs/2205.01068v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 58, title: '2 OLMo 2 Furious, arXiv 2501.00656v3, preprint; a shorter version at COLM 2025', url: 'https://arxiv.org/abs/2501.00656v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 59, title: 'DeepSeek-V3 Technical Report, arXiv 2412.19437v2, preprint', url: 'https://arxiv.org/abs/2412.19437v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 60, title: 'MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs, arXiv 2402.15627v1, NSDI 2024', url: 'https://arxiv.org/abs/2402.15627v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 61, title: 'Revisiting Reliability in Large-Scale Machine Learning Research Clusters, arXiv 2410.21680v2, preprint', url: 'https://arxiv.org/abs/2410.21680v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 62, title: 'Understanding Stragglers in Large Model Training Using What-if Analysis, arXiv 2505.05713v2, OSDI 2025', url: 'https://arxiv.org/abs/2505.05713v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 63, title: 'ByteCheckpoint: A Unified Checkpointing System for Large Foundation Model Development, arXiv 2407.20143v4, NSDI 2025', url: 'https://arxiv.org/abs/2407.20143v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: the arithmetic and memory of a step
  { id: 64, title: 'Scaling Laws for Neural Language Models, arXiv 2001.08361v1, preprint', url: 'https://arxiv.org/abs/2001.08361v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 65, title: 'Training Compute-Optimal Large Language Models, arXiv 2203.15556v1, preprint', url: 'https://arxiv.org/abs/2203.15556v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 66, title: 'An Empirical Model of Large-Batch Training, arXiv 1812.06162v1, preprint', url: 'https://arxiv.org/abs/1812.06162v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 67, title: 'Reducing Activation Recomputation in Large Transformer Models, arXiv 2205.05198v1, preprint', url: 'https://arxiv.org/abs/2205.05198v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 68, title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness, arXiv 2205.14135v2, preprint', url: 'https://arxiv.org/abs/2205.14135v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 69, title: 'Training Deep Nets with Sublinear Memory Cost, arXiv 1604.06174v2, preprint', url: 'https://arxiv.org/abs/1604.06174v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  // Tier 3: precision and optimizers
  { id: 70, title: 'Mixed Precision Training, arXiv 1710.03740v3, ICLR 2018', url: 'https://arxiv.org/abs/1710.03740v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 71, title: 'FP8 Formats for Deep Learning, arXiv 2209.05433v2, preprint', url: 'https://arxiv.org/abs/2209.05433v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 72, title: 'Microscaling Data Formats for Deep Learning, arXiv 2310.10537v3, preprint', url: 'https://arxiv.org/abs/2310.10537v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 73, title: 'Pretraining Large Language Models with NVFP4, arXiv 2509.25149v2, preprint', url: 'https://arxiv.org/abs/2509.25149v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 74, title: '8-bit Optimizers via Block-wise Quantization, arXiv 2110.02861v2, ICLR 2022', url: 'https://arxiv.org/abs/2110.02861v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 75, title: 'Muon is Scalable for LLM Training, arXiv 2502.16982v1, preprint', url: 'https://arxiv.org/abs/2502.16982v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  // Tier 3: parallelism
  { id: 76, title: 'Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism, arXiv 1909.08053v4, preprint', url: 'https://arxiv.org/abs/1909.08053v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 77, title: 'Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (PTD-P), arXiv 2104.04473v5, SC 2021', url: 'https://arxiv.org/abs/2104.04473v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 78, title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models, arXiv 1910.02054v3, preprint', url: 'https://arxiv.org/abs/1910.02054v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 79, title: 'ZeRO++: Extremely Efficient Collective Communication for Giant Model Training, arXiv 2306.10209v1, preprint', url: 'https://arxiv.org/abs/2306.10209v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 80, title: 'PyTorch Distributed: Experiences on Accelerating Data Parallel Training, arXiv 2006.15704v1, VLDB 2020', url: 'https://arxiv.org/abs/2006.15704v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 81, title: 'PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel, arXiv 2304.11277v2, PVLDB 16(12)', url: 'https://arxiv.org/abs/2304.11277v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 82, title: 'GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism, arXiv 1811.06965v5, preprint', url: 'https://arxiv.org/abs/1811.06965v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 83, title: 'Zero Bubble Pipeline Parallelism, arXiv 2401.10241v1, preprint', url: 'https://arxiv.org/abs/2401.10241v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 84, title: 'Ring Attention with Blockwise Transformers for Near-Infinite Context, arXiv 2310.01889v4, preprint', url: 'https://arxiv.org/abs/2310.01889v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 85, title: 'DeepSpeed Ulysses: System Optimizations for Enabling Training of Extreme Long Sequence Transformer Models, arXiv 2309.14509v2, preprint', url: 'https://arxiv.org/abs/2309.14509v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 86, title: 'GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding, arXiv 2006.16668v1, preprint', url: 'https://arxiv.org/abs/2006.16668v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 87, title: 'Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity, arXiv 2101.03961v3, JMLR 23 (2022)', url: 'https://arxiv.org/abs/2101.03961v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 88, title: 'MoE Parallel Folding: Heterogeneous Parallelism Mappings for Efficient Large-Scale MoE Model Training with Megatron Core, arXiv 2504.14960v3, preprint', url: 'https://arxiv.org/abs/2504.14960v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 89, title: 'TorchTitan: One-stop PyTorch native solution for production ready LLM pre-training, arXiv 2410.06511v3, preprint', url: 'https://arxiv.org/abs/2410.06511v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  // Tier 3: fine-tuning and practitioner synthesis
  { id: 90, title: 'LoRA: Low-Rank Adaptation of Large Language Models, arXiv 2106.09685v2, preprint', url: 'https://arxiv.org/abs/2106.09685v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 91, title: 'QLoRA: Efficient Finetuning of Quantized LLMs, arXiv 2305.14314v1, preprint', url: 'https://arxiv.org/abs/2305.14314v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-31' },
  { id: 92, title: 'Hugging Face, The Ultra-Scale Playbook: Training LLMs on GPU Clusters, at commit c93890d', url: 'https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc', tier: 3, type: 'blog', accessDate: '2026-10-31' },
];

/**
 * Every term and acronym the page uses, with the section that defines it. Acronyms follow the
 * expansions in SCOPE.md's section 32 block and the sections' first uses.
 */
const glossary: GlossaryEntry[] = [
  // Terms
  { acronym: 'activations', fullForm: '', description: 'Tensors the forward pass saves for the backward pass. They live only inside one step, and recomputation trades them for arithmetic. Section 3.' },
  { acronym: 'bubble', fullForm: '', description: 'Time pipeline stages sit idle while the pipeline fills and drains; more micro-batches per step, or interleaved chunks, shrink it. Section 10.' },
  { acronym: 'bus bandwidth', fullForm: '', description: "nccl-tests' figure that scales the measured rate by the collective's traffic factor, so results compare across rank counts. Section 7." },
  { acronym: 'Capacity Block', fullForm: 'EC2 Capacity Blocks for ML', description: 'Accelerated instances reserved for a fixed window, paid up front. EC2 starts terminating them 30 minutes before the window ends, 60 for P6e-GB200 UltraServer blocks. Section 22.' },
  { acronym: 'capacity factor', fullForm: '', description: "The multiple of an even token share each expert accepts in a mixture-of-experts layer; tokens past it are dropped or rerouted. Section 12." },
  { acronym: 'checkpointless training', fullForm: '', description: "HyperPod's recovery that restores a restarted rank's state from healthy peers where it can, and from the last checkpoint otherwise. Section 25." },
  { acronym: 'collective', fullForm: '', description: 'A communication operation every rank in a group joins: all-reduce, all-gather, reduce-scatter, all-to-all, broadcast. Section 7.' },
  { acronym: 'critical batch size', fullForm: '', description: 'The global batch above which a larger batch stops cutting the number of steps to reach a given loss. It grows as training proceeds. Section 8.' },
  { acronym: 'degree', fullForm: '', description: 'How many ranks one parallelism dimension spans, such as a tensor-parallel degree of 8. The degrees of all dimensions multiply to the world size. Section 7.' },
  { acronym: 'dense peak', fullForm: '', description: "An accelerator's peak rate without the 2:4 structured-sparsity doubling some specification pages quote. It is the MFU denominator. Section 4." },
  { acronym: 'device mesh', fullForm: '', description: "The ranks arranged as a grid with one axis per parallelism dimension; PyTorch's DeviceMesh. Section 13." },
  { acronym: 'gang scheduling', fullForm: '', description: "Starting all of a job's pods or tasks together or none of them, so a half-placed job never holds accelerators while it waits. Section 20." },
  { acronym: 'global batch', fullForm: '', description: 'Sequences per optimizer step across all data-parallel ranks, B = b x m x d; times the sequence length, tokens per step. Section 3.' },
  { acronym: 'goodput', fullForm: '', description: 'The share of time or compute that advances training once failures, restarts and repeated steps are taken out. This dive measures it as ETTR. Section 17.' },
  { acronym: 'gradient accumulation', fullForm: '', description: 'Summing gradients over several micro-batches before one optimizer step, which raises the global batch without raising memory. Section 3.' },
  { acronym: 'micro-batch', fullForm: '', description: 'The sequences one rank runs through one forward and backward pass. Section 3.' },
  { acronym: 'model parallelism', fullForm: '', description: 'The dimensions that split the model itself, tensor and pipeline parallelism, as opposed to splitting the data. Section 13.' },
  { acronym: 'model state', fullForm: '', description: 'Weights, gradients and optimizer state: 16 bytes per parameter for mixed-precision Adam with BF16 weights and gradients. Section 3.' },
  { acronym: 'rank', fullForm: '', description: 'One training process. On GPUs one rank drives one GPU; on Trainium2 at LNC 2 one rank drives one logical NeuronCore. Section 7.' },
  { acronym: 'rank order', fullForm: '', description: 'Which dimension varies fastest across consecutive ranks, and so which groups land inside one instance and which cross EFA. Section 13.' },
  { acronym: 'recomputation', fullForm: 'activation checkpointing', description: 'Dropping saved activations in the forward pass and recomputing them in the backward pass: memory traded for arithmetic. Sections 4 and 5.' },
  { acronym: 'resharding', fullForm: '', description: 'Freeing the gathered full parameters after use, so they are gathered again when next needed; FSDP2 controls it per pass. Sections 8 and 15.' },
  { acronym: 'scale-up domain', fullForm: '', description: 'The group of accelerators one fast link joins, NVLink or NeuronLink; past it every byte crosses EFA. Section 21.' },
  { acronym: 'sharding', fullForm: '', description: 'Splitting model state across data-parallel ranks so each holds a fraction of it, at the price of collectives to gather and reduce. Section 8.' },
  { acronym: 'straggler', fullForm: '', description: 'A rank slower than its peers. In synchronous training every rank waits for it at the next collective. Sections 17 and 19.' },
  { acronym: 'training plan', fullForm: 'SageMaker training plan', description: 'A SageMaker reservation of accelerated capacity over a set window, for training jobs or HyperPod clusters. Section 22.' },
  { acronym: 'world size', fullForm: '', description: 'The number of ranks in the job. Section 7.' },
  // Arithmetic, utilisation and reliability
  { acronym: 'ETTR', fullForm: 'effective training time ratio', description: 'Productive runtime of a job over its wallclock time; the goodput measure this dive uses. Sections 17 and 18.' },
  { acronym: 'FLOPs', fullForm: 'floating-point operations', description: 'The unit of a run\'s arithmetic bill, about 6 per parameter per token for a dense model. Section 4.' },
  { acronym: 'HFU', fullForm: 'hardware FLOPs utilization', description: 'Like MFU but counting the FLOPs the hardware ran, recomputation included, so it reads higher. Section 4.' },
  { acronym: 'MFU', fullForm: 'model FLOPs utilization', description: "The model's FLOPs per second over the accelerators' dense peak: the share of peak a run achieves. Section 4." },
  { acronym: 'MTTF', fullForm: 'mean time to failure', description: 'Average time between failures, for one node or for a whole job; a job\'s MTTF falls as it adds nodes. Section 17.' },
  { acronym: 'PFLOP', fullForm: 'petaFLOP', description: '10^15 floating-point operations. Section 4.' },
  { acronym: 'TFLOPS', fullForm: 'trillion FLOPs per second', description: 'A rate of 10^12 floating-point operations per second; peaks and achieved rates are quoted in it. Section 4.' },
  // Model shape
  { acronym: 'GQA', fullForm: 'grouped-query attention', description: 'Attention in which several query heads share one key-value head; Llama 3.1 8B has 32 query heads and 8 key-value heads. Sections 3 and 11.' },
  { acronym: 'KV', fullForm: 'key and value', description: 'The key and value tensors of attention, which context parallelism passes between ranks. Section 11.' },
  { acronym: 'MLP', fullForm: 'multilayer perceptron', description: 'The feed-forward block of a transformer layer; in Llama a three-matrix SwiGLU. Section 3.' },
  { acronym: 'MoE', fullForm: 'mixture of experts', description: 'Layers whose feed-forward block is many experts, of which a router sends each token to a few. Section 12.' },
  { acronym: 'RMSNorm', fullForm: 'root mean square normalization', description: "The normalization Llama's layers use. Section 3." },
  { acronym: 'SwiGLU', fullForm: 'swish-gated linear unit', description: "Llama's feed-forward activation: SiLU of a gate projection times an up projection. Its saved tensors set part of the activation bill. Section 3." },
  // Parallelism
  { acronym: '1F1B', fullForm: 'one forward, one backward', description: 'A pipeline schedule that alternates forward and backward micro-batches once the pipeline is full, capping saved activations per stage. Section 10.' },
  { acronym: 'CP', fullForm: 'context parallelism', description: 'Splitting one sequence across ranks, which pass keys and values around during attention. Section 11.' },
  { acronym: 'DDP', fullForm: 'Distributed Data Parallel', description: "PyTorch's data parallelism: a full model copy per rank, gradients all-reduced in buckets during the backward pass. Section 8." },
  { acronym: 'DP', fullForm: 'data parallelism', description: 'Running copies of the model on different data and combining their gradients. Section 8.' },
  { acronym: 'DTensor', fullForm: "PyTorch's distributed tensor", description: 'A tensor sharded or replicated over a device mesh; FSDP2 and PyTorch tensor parallelism build on it. Section 15.' },
  { acronym: 'EDP', fullForm: 'expert data parallelism', description: 'The data-parallel degree of the expert grid in Megatron Core. Section 12.' },
  { acronym: 'EP', fullForm: 'expert parallelism', description: "Spreading a mixture-of-experts layer's experts over ranks, with all-to-all exchanges of tokens. Section 12." },
  { acronym: 'ETP', fullForm: 'expert tensor parallelism', description: 'The tensor-parallel degree inside each expert, set apart from the attention TP in Megatron Core. Section 12.' },
  { acronym: 'FSDP', fullForm: 'Fully Sharded Data Parallel', description: "PyTorch's sharded data parallelism: parameters, gradients and optimizer state split over ranks, gathered when needed. Section 8." },
  { acronym: 'FSDP2', fullForm: 'FSDP version 2', description: "PyTorch's DTensor-based FSDP, the fully_shard API. Sections 8 and 15." },
  { acronym: 'HSDP', fullForm: 'hybrid sharded data parallel', description: 'FSDP inside a group, usually one instance, and replication across groups: the parameter gathers stay on NVLink and only the gradient all-reduce crosses EFA. Section 8.' },
  { acronym: 'PP', fullForm: 'pipeline parallelism', description: 'Splitting the layers into stages on different ranks and streaming micro-batches through them. Section 10.' },
  { acronym: 'PTD-P', fullForm: 'pipeline, tensor and data parallelism', description: "Megatron-LM's composition of the three dimensions. Section 13." },
  { acronym: 'SP', fullForm: 'sequence parallelism', description: "Megatron's split of the norm and dropout activations along the sequence, paired with tensor parallelism. Section 9." },
  { acronym: 'TP', fullForm: 'tensor parallelism', description: "Splitting each layer's matrices across ranks, with collectives inside every layer; it belongs inside a scale-up domain. Section 9." },
  { acronym: 'VP', fullForm: 'virtual pipeline chunks', description: 'Interleaved pipeline stages, several chunks per rank, which shrink the bubble for more communication. Section 10.' },
  { acronym: 'ZeRO', fullForm: 'Zero Redundancy Optimizer', description: 'Sharding of optimizer state (stage 1), gradients (stage 2) and parameters (stage 3) across data-parallel ranks. Section 8.' },
  // Precision
  { acronym: 'BF16', fullForm: 'bfloat16', description: "16-bit floating point with FP32's exponent range and 7 mantissa bits; the default training format. Section 6." },
  { acronym: 'cFP8', fullForm: 'configurable FP8', description: '8-bit floating point with configurable range and precision, a Trainium format. Section 6.' },
  { acronym: 'E4M3, E5M2', fullForm: 'FP8 encodings', description: 'The two FP8 formats, named for their exponent and mantissa bits: E4M3 for more precision, E5M2 for more range. Section 6.' },
  { acronym: 'FP16', fullForm: '16-bit floating point', description: 'IEEE half precision; narrower range than BF16, so it needs loss scaling. Section 6.' },
  { acronym: 'FP32', fullForm: '32-bit floating point', description: 'IEEE single precision; master weights and optimizer state usually stay in it. Section 6.' },
  { acronym: 'FP4', fullForm: '4-bit floating point', description: 'Section 6.' },
  { acronym: 'FP8', fullForm: '8-bit floating point', description: 'Halves the bytes of BF16 for matrix multiplications; it changes the arithmetic rate, not the model state. Section 6.' },
  { acronym: 'INT8, INT4', fullForm: '8-bit and 4-bit integers', description: 'Integer formats used to quantise communication or a frozen base model. Sections 8 and 16.' },
  { acronym: 'MX', fullForm: 'microscaling', description: 'Block formats in which 32 values share one 8-bit power-of-two (E8M0) scale. Section 6.' },
  { acronym: 'MXFP4', fullForm: 'microscaled FP4', description: 'Section 6.' },
  { acronym: 'MXFP8', fullForm: 'microscaled FP8', description: 'FP8 values in blocks of 32 with a shared scale. Section 6.' },
  { acronym: 'NF4', fullForm: '4-bit NormalFloat', description: "QLoRA's storage format for the frozen base weights. Section 16." },
  { acronym: 'NVFP4', fullForm: "NVIDIA's 4-bit floating-point format", description: 'Section 6.' },
  { acronym: 'OCP', fullForm: 'Open Compute Project', description: 'The body that publishes the MX format specification. Section 6.' },
  { acronym: 'TF32', fullForm: 'TensorFloat-32', description: "NVIDIA's tensor-core format with FP32's range and 10 bits of mantissa. Section 6." },
  // Fine-tuning
  { acronym: 'LoRA', fullForm: 'low-rank adaptation', description: 'Small trainable matrices beside frozen weights, so gradients and optimizer state cover only them. Section 16.' },
  { acronym: 'QLoRA', fullForm: 'LoRA over a 4-bit quantised base', description: 'Section 16.' },
  { acronym: 'RL', fullForm: 'reinforcement learning', description: 'Post-training in which the model generates, is scored, and is updated on the scores. Section 16.' },
  // Communication, checkpointing and telemetry
  { acronym: 'CRC', fullForm: 'cyclic redundancy check', description: 'A checksum on link traffic; DCGM reports NVLink CRC error totals per GPU. Section 29.' },
  { acronym: 'DCGM', fullForm: 'NVIDIA Data Center GPU Manager', description: 'GPU health checks, diagnostics and metrics; dcgm-exporter publishes them to Prometheus. Section 30.' },
  { acronym: 'DCP', fullForm: 'PyTorch Distributed Checkpoint', description: 'Sharded save and load of a distributed state dict, with async_save. Section 18.' },
  { acronym: 'DMA', fullForm: 'direct memory access', description: 'Copies between memories that bypass the processor; the Neuron runtime reports DMA aborts as a hardware fault. Section 30.' },
  { acronym: 'ECC', fullForm: 'error-correcting code', description: 'Memory error correction; DCGM counts the corrected and uncorrected errors per GPU. Section 30.' },
  { acronym: 'HTA', fullForm: 'Holistic Trace Analysis', description: 'A PyTorch tool that reads profiler traces from every rank to break down compute, communication and idle time. Section 30.' },
  { acronym: 'NaN, Inf', fullForm: 'not a number, infinity', description: 'The floating-point values a diverging loss or an overflowing gradient produces. Section 29.' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'The library that runs collectives on NVIDIA GPUs, over EFA through the aws-ofi-nccl plugin. Section 7.' },
  { acronym: 'RAS', fullForm: 'reliability, availability and serviceability', description: "NCCL's RAS subsystem runs in every NCCL process by default and answers queries about a running job's ranks, including during a hang. Section 30." },
  { acronym: 'RNG', fullForm: 'random number generator', description: 'Its state is saved with a checkpoint so a resumed run draws the same random numbers. Sections 18 and 19.' },
  { acronym: 'SM', fullForm: 'streaming multiprocessor', description: 'An NVIDIA GPU compute unit; SM activity is one of the counters a run alerts on. Section 30.' },
  { acronym: 'Xid', fullForm: "the NVIDIA driver's numbered GPU error reports", description: 'Each Xid has a catalog entry with an immediate action, such as reset the GPU or restart the node. Sections 29 and 30.' },
  // Hardware and storage
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'The EC2 network interface that carries collectives between instances. Sections 7 and 21.' },
  { acronym: 'GiB, MiB, TiB', fullForm: 'gibibytes, mebibytes, tebibytes', description: 'Binary units, 2^30, 2^20 and 2^40 bytes; GB is 10^9 bytes. Section 5.' },
  { acronym: 'HBM', fullForm: 'high-bandwidth memory', description: "An accelerator's on-package memory, which holds model state and activations. Sections 5 and 21." },
  { acronym: 'HDFS', fullForm: 'Hadoop Distributed File System', description: 'Section 18.' },
  { acronym: 'LNC', fullForm: 'logical NeuronCore configuration', description: 'How many physical NeuronCores one Trainium rank drives; at LNC 2 a Trainium2 chip is four ranks. Sections 4 and 27.' },
  { acronym: 'NVMe', fullForm: 'Non-Volatile Memory Express', description: 'The local instance-store SSDs on accelerated instances. Section 23.' },
  { acronym: 'POSIX', fullForm: 'Portable Operating System Interface', description: 'File semantics such as rename and append, which Mountpoint for S3 supports only in part. Section 23.' },
  { acronym: 'TPU', fullForm: 'Tensor Processing Unit', description: "Google's accelerator, on which PaLM trained. Section 4." },
  { acronym: 'vCPU', fullForm: 'virtual CPU', description: 'Section 22.' },
  // AWS and software
  { acronym: 'ALST', fullForm: 'Arctic Long Sequence Training', description: 'Long-sequence training in DeepSpeed, documented with Ulysses sequence parallelism. Section 15.' },
  { acronym: 'AMI', fullForm: 'Amazon Machine Image', description: 'The boot image of an EC2 instance; on accelerated instances it supplies the driver and the EFA software. Section 20.' },
  { acronym: 'CI', fullForm: 'continuous integration', description: 'Section 27.' },
  { acronym: 'DLAMI', fullForm: 'Deep Learning AMI', description: "AWS's AMIs with the GPU or Neuron driver and the EFA software installed, some with a framework too. Section 20." },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: "AWS's container images with a training framework and the CUDA, NCCL and aws-ofi-nccl libraries it runs on. Sections 15 and 31." },
  { acronym: 'DRA', fullForm: 'dynamic resource allocation', description: 'The Kubernetes API for claiming devices such as GPUs. Sections 20 and 25.' },
  { acronym: 'EBS', fullForm: 'Amazon Elastic Block Store', description: 'Network block volumes attached to EC2 instances. Section 25.' },
  { acronym: 'EC2', fullForm: 'Amazon Elastic Compute Cloud', description: 'Section 21.' },
  { acronym: 'EKS', fullForm: 'Amazon Elastic Kubernetes Service', description: 'Section 25.' },
  { acronym: 'FSx', fullForm: 'Amazon FSx', description: 'Managed file systems; this dive uses FSx for Lustre. Section 23.' },
  { acronym: 'GRES', fullForm: 'generic resources', description: "Slurm's name for devices such as GPUs. Section 24." },
  { acronym: 'HPC', fullForm: 'high-performance computing', description: 'Section 24.' },
  { acronym: 'NxD', fullForm: 'NeuronX Distributed', description: "AWS's distributed training library for Trainium. Section 27." },
  { acronym: 'PCS', fullForm: 'AWS Parallel Computing Service', description: 'Managed Slurm on AWS. Section 24.' },
  { acronym: 'S3', fullForm: 'Amazon Simple Storage Service', description: 'Section 23.' },
  { acronym: 'SDK', fullForm: 'software development kit', description: 'Section 26.' },
  { acronym: 'SMDDP', fullForm: 'SageMaker distributed data parallelism library', description: 'Section 26.' },
  { acronym: 'SMP', fullForm: 'SageMaker model parallelism library', description: 'Section 20.' },
  { acronym: 'UTC', fullForm: 'Coordinated Universal Time', description: "A Capacity Block's final day ends at 11:30 UTC. Section 22." },
  { acronym: 'XLA', fullForm: 'Accelerated Linear Algebra', description: 'The compiler path torch-neuronx training uses on Trainium. Section 27.' },
  // Publication venues (shown on paper citations)
  { acronym: 'COLM', fullForm: 'Conference on Language Modeling', description: 'Publication venue.' },
  { acronym: 'ICLR', fullForm: 'International Conference on Learning Representations', description: 'Publication venue.' },
  { acronym: 'JMLR', fullForm: 'Journal of Machine Learning Research', description: 'Publication venue.' },
  { acronym: 'NSDI', fullForm: 'USENIX Symposium on Networked Systems Design and Implementation', description: 'Publication venue.' },
  { acronym: 'OSDI', fullForm: 'USENIX Symposium on Operating Systems Design and Implementation', description: 'Publication venue.' },
  { acronym: 'SC', fullForm: 'International Conference for High Performance Computing, Networking, Storage and Analysis', description: 'Publication venue (Supercomputing).' },
  { acronym: 'VLDB, PVLDB', fullForm: 'Very Large Data Bases; Proceedings of the VLDB Endowment', description: 'Publication venue.' },
];

/** Section 3's notation, repeated here for the reader who arrives out of order. */
const notation: { sym: string; meaning: string }[] = [
  { sym: 'N', meaning: 'Parameters (all of them; section 4 notes the matmul-only count)' },
  { sym: 'D', meaning: 'Training tokens' },
  { sym: 's', meaning: 'Sequence length, in tokens' },
  { sym: 'b', meaning: 'Micro-batch size, in sequences' },
  { sym: 'm', meaning: 'Micro-batches per step per data-parallel rank (gradient accumulation steps)' },
  { sym: 'd', meaning: 'Data-parallel degree' },
  { sym: 'B', meaning: 'Global batch in sequences, B = b x m x d; B x s tokens' },
  { sym: 'L', meaning: 'Layers' },
  { sym: 'h', meaning: 'Hidden size' },
  { sym: 'a', meaning: 'Attention heads' },
  { sym: 'V', meaning: 'Vocabulary size' },
  { sym: 't', meaning: 'Tensor-parallel degree' },
  { sym: 'p', meaning: 'Pipeline stages' },
  { sym: 'v', meaning: 'Interleaved chunks per pipeline stage' },
  { sym: 'n', meaning: 'Ranks taking part in one collective' },
  { sym: 'r_f', meaning: 'Failures per node-day' },
  { sym: 'w_cp', meaning: 'Time a checkpoint save blocks training' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Look up any term you meet out of order and trace any number to its source and tier: every acronym with the section that defines it, our four DGX Spark experiments, and the reading list by authority (sources read 2026-10-30 and 2026-10-31)"
          >
            32. Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Every citation in the dive carries a tier. Tier 0 is our own experiment. Tier 1 is code at a pinned
            tag or commit, framework documentation, first-party AWS documentation and price files, and NVIDIA
            specification pages, whose peaks are vendor figures. Tier 2 is a lab or vendor post or sample, whose
            performance figures stay the author&apos;s claims. Tier 3 is a paper, marked with its venue or as a
            preprint. The dive&apos;s <code>sources.md</code> lists every citation, section by section; it is
            generated from the inline citations, so it holds exactly what the pages cite.
          </Box>
          <Box variant="h3">Tier 0: our own experiments</Box>
          <Box variant="p">
            Four experiments ran on one DGX Spark (one NVIDIA GB10) on 2026-10-31 with PyTorch 2.15.0. Their
            timings belong to that machine, whose CPU and GPU share one memory; what carries to an H100 is the
            mechanism each one checks.
          </Box>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <Box variant="p">
                Activation memory per Llama 3.1 8B layer matched the formula to within 0.1%: 34 bytes per s x b
                x h with a fused SwiGLU, 41 with an eager, uncompiled SwiGLU, and 2 under full
                recomputation, at every sequence length tried (sections 3 and 5){' '}
                <Cite tier={0} href={E1_URL}>
                  E1 log: activation memory per Llama 3.1 8B layer
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                On a 1.24B-parameter Llama-shaped model, full recomputation added 14% to 16% to the step for 5.4
                GB less memory, selective recomputation 8% to 11% for 3.7 GB less, and the run reached 28% to 29%
                MFU against a measured 96 to 97 TFLOPS BF16 matrix-multiply ceiling (sections 4 and 5){' '}
                <Cite tier={0} href={E2_URL}>
                  E2 log: step time, recomputation and MFU
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                FSDP2 under gradient accumulation, counted on the CPU without timing: at defaults, four
                micro-batches on a five-unit model cost 36 all-gathers and 20 reduce-scatters per step;
                deferring gradient sync cut the reduce-scatters to 5, and keeping parameters gathered after the
                backward pass cut the all-gathers to 21 (section 8){' '}
                <Cite tier={0} href={E3_URL}>
                  E3 log: FSDP2 collectives per optimizer step
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                Saving a 4.03 GB state dict with PyTorch Distributed Checkpoint, a bare <code>async_save</code>{' '}
                blocked training for 8.8 to 36 s, longer than a synchronous <code>dcp.save</code> (2.5 to 4.4 s),
                while <code>async_save</code> with a pinned-memory stager returned in about a millisecond
                (section 18){' '}
                <Cite tier={0} href={E4_URL}>
                  E4 log: checkpoint staging
                </Cite>
                .
              </Box>
            </li>
          </ul>
          <Box variant="p">
            Six experiments on AWS, A0 to A5, are written as protocols and have not run: capacity checks,
            collective baselines on two p5.48xlarge, FSDP layouts for the 8B model, checkpoint save paths to FSx
            for Lustre and S3, the smallest HyperPod EKS run, and the smallest Trainium2 run. The sections that
            depend on them keep their hedges and show the protocol marked &quot;not yet run&quot; (
            <Link external href={GUIDE_URL}>
              research guide, section 5
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>
      <Table
        header={
          <Header variant="h2" description="Section 3's symbols, for the reader who arrives out of order">
            Notation
          </Header>
        }
        columnDefinitions={[
          { id: 'sym', header: 'Symbol', cell: (r) => <code>{r.sym}</code>, width: 90 },
          { id: 'meaning', header: 'Meaning', cell: (r) => r.meaning, minWidth: 170 },
        ]}
        items={notation}
        wrapLines
        sortingDisabled
        variant="container"
      />
      <GlossaryTable entries={glossary} />
      <KeySourcesTable sources={sources} />
    </SpaceBetween>
  );
}
