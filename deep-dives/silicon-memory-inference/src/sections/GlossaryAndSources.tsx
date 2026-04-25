import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';

const glossary: GlossaryEntry[] = [
  // Memory architecture
  { acronym: 'HBM', fullForm: 'High Bandwidth Memory', description: 'Stacked DRAM on a silicon interposer adjacent to the accelerator die. HBM3, HBM3e, HBM3e+, HBM4 are current generations.' },
  { acronym: 'DDR5', fullForm: 'Double Data Rate 5', description: 'Current-generation server DRAM with up to 12 channels per socket on modern host CPUs.' },
  { acronym: 'MRDIMM', fullForm: 'Multiplexed Rank DIMM', description: 'Buffered RDIMM that runs the host bus at higher data rates while DRAM dies operate at half rate. DDR5-8800 on Xeon 6 6900P.' },
  { acronym: 'LPDDR5X', fullForm: 'Low Power DDR5X', description: 'Mobile-derived DRAM used in NVIDIA Grace at ~500 GB/s per CPU; bandwidth-per-watt design point.' },
  { acronym: 'CXL', fullForm: 'Compute Express Link', description: 'Coherent expansion bus over PCIe physical layer. CXL 2.0 = pooling, CXL 3.0 = sharing.' },
  { acronym: 'TSV', fullForm: 'Through-Silicon Via', description: 'Vertical interconnects through stacked DRAM dies in HBM packages.' },
  { acronym: 'SMEM', fullForm: 'Shared Memory', description: 'Per-SM scratchpad on NVIDIA GPUs (228 KB on Hopper, fused with L1).' },
  { acronym: 'TMEM', fullForm: 'Tensor Memory', description: 'Blackwell-specific 256 KB per-SM scratchpad dedicated to tensor-core operand staging.' },
  { acronym: 'SBUF', fullForm: 'State Buffer', description: 'Trainium scratchpad — 28 MiB per NeuronCore-v3, holds weights and activations.' },
  { acronym: 'PSUM', fullForm: 'Partial Sum Buffer', description: 'Trainium output-side scratchpad for the systolic array (2 MiB per NeuronCore-v3).' },
  { acronym: 'LLC', fullForm: 'Last-Level Cache', description: 'The largest, slowest cache before main memory (~30-100 cycles).' },
  { acronym: 'TLB', fullForm: 'Translation Lookaside Buffer', description: 'Hardware cache of virtual-to-physical address translations.' },
  { acronym: 'DRAM', fullForm: 'Dynamic Random Access Memory', description: 'Volatile main memory technology used in DDR, HBM, and LPDDR variants.' },
  { acronym: 'SRAM', fullForm: 'Static Random Access Memory', description: 'Faster, more expensive memory used for caches and on-chip scratchpads.' },

  // Chiplet and topology
  { acronym: 'CCD', fullForm: 'Core Complex Die', description: 'AMD compute chiplet — 8 (Zen 5) or 16 (Zen 5c) cores plus 32 MB L3.' },
  { acronym: 'CCX', fullForm: 'Core Complex', description: 'Cluster of cores sharing a single L3 slice within a CCD.' },
  { acronym: 'IOD', fullForm: 'I/O Die', description: 'AMD central die holding memory controllers, PCIe, and the Infinity Fabric.' },
  { acronym: 'GMI', fullForm: 'Global Memory Interconnect', description: 'AMD chiplet-to-IOD link. GMI3-Wide on Turin runs 64 B/cycle bidirectional.' },
  { acronym: 'UMC', fullForm: 'Unified Memory Controller', description: 'AMD per-channel DDR5 controller in the IO die.' },
  { acronym: 'CMN-700', fullForm: 'Coherent Mesh Network 700', description: 'ARM mesh interconnect used in Graviton4 / Neoverse V2.' },
  { acronym: 'CMN-S3', fullForm: 'Coherent Mesh Network S3', description: 'ARM successor to CMN-700, shipping in Graviton5 / Neoverse V3.' },
  { acronym: 'CHA', fullForm: 'Caching/Home Agent', description: 'Intel mesh stop that handles L3 slice and snoop filter (Xeon 6: 120 slices).' },
  { acronym: 'MDF', fullForm: 'Modular Data Fabric', description: 'Intel die-boundary mesh stop running at 2.5 GHz; carries cross-die mesh protocol.' },
  { acronym: 'EMIB', fullForm: 'Embedded Multi-die Interconnect Bridge', description: 'Intel silicon bridge in the substrate that carries high-density signals between tiles.' },
  { acronym: 'SLC', fullForm: 'System Level Cache', description: 'Graviton4 unified last-level cache (36 MB) on the CMN-700 mesh.' },
  { acronym: 'NPS', fullForm: 'NUMA Per Socket', description: 'AMD NUMA mode (NPS0 / NPS1 / NPS2 / NPS4) controlling memory-controller partitioning.' },
  { acronym: 'SNC', fullForm: 'Sub-NUMA Clustering', description: 'Intel NUMA mode; SNC3 partitions Xeon 6 6900P into three NUMA domains per tile.' },
  { acronym: 'NUMA', fullForm: 'Non-Uniform Memory Access', description: 'Architecture where memory access latency depends on which CPU is making the request.' },
  { acronym: 'NV-HBI', fullForm: 'NVIDIA High-Bandwidth Interface', description: 'Custom interconnect joining the two reticle-sized dies in Blackwell GB100 (~10 TB/s).' },
  { acronym: 'NVLink', fullForm: 'NVIDIA Link', description: 'NVIDIA GPU-to-GPU interconnect; Gen 5 on Blackwell at 1.8 TB/s per GPU.' },
  { acronym: 'NVSwitch', fullForm: 'NVIDIA Switch', description: 'NVLink switch fabric providing full bisection bandwidth in HGX and NVL72 systems.' },
  { acronym: 'MNNVL', fullForm: 'Multi-Node NVLink', description: 'NVLink protocol crossing node boundaries inside an UltraServer like NVL72.' },

  // Compute and ML
  { acronym: 'SM', fullForm: 'Streaming Multiprocessor', description: 'Independent execution unit on an NVIDIA GPU; H100 has 132 active SMs.' },
  { acronym: 'AVX-512', fullForm: 'Advanced Vector Extensions 512-bit', description: 'Intel/AMD 512-bit SIMD ISA. Native datapath on Zen 5 and Xeon Scalable.' },
  { acronym: 'SVE2', fullForm: 'Scalable Vector Extension 2', description: 'ARM SIMD ISA used by Neoverse V2 (Graviton4) and V3 (Graviton5).' },
  { acronym: 'AMX', fullForm: 'Advanced Matrix Extensions', description: 'Intel tile-register matmul ISA. Tile registers hold 16 rows × up to 64 bytes.' },
  { acronym: 'wgmma', fullForm: 'Warp-Group Matrix Multiply Accumulate', description: 'Hopper Tensor Core matmul instruction that operates on tiles staged through SMEM.' },
  { acronym: 'tcgen05', fullForm: 'Tensor Core Generation 5', description: 'Blackwell 5th-gen tensor core instruction family operating on TMEM tiles.' },
  { acronym: 'GEMM', fullForm: 'General Matrix Multiply', description: 'The dominant compute primitive in transformer models.' },
  { acronym: 'GEMV', fullForm: 'General Matrix-Vector Multiply', description: 'Matrix-vector multiplication; common decode-phase primitive.' },
  { acronym: 'CC-Cores', fullForm: 'Collective Communication Cores', description: 'Trainium dedicated silicon for collectives (16 per Trainium2 chip).' },

  // Precision
  { acronym: 'FP64', fullForm: 'Float Point 64-bit', description: 'Double precision. HPC paths only.' },
  { acronym: 'FP32', fullForm: 'Float Point 32-bit', description: 'Single precision. Master weights, optimizer state.' },
  { acronym: 'TF32', fullForm: 'TensorFloat-32', description: 'NVIDIA Ampere internal precision; FP32 storage with FP19 mantissa.' },
  { acronym: 'BF16', fullForm: 'Brain Float 16-bit', description: 'FP32 dynamic range with 7-bit mantissa. Standard training precision.' },
  { acronym: 'FP16', fullForm: 'Float Point 16-bit', description: 'Half precision. Older inference standard.' },
  { acronym: 'FP8 E4M3', fullForm: 'Float Point 8-bit (Exponent 4, Mantissa 3)', description: 'Forward-pass FP8 format on Hopper, Blackwell, Trainium.' },
  { acronym: 'FP8 E5M2', fullForm: 'Float Point 8-bit (Exponent 5, Mantissa 2)', description: 'Backward-gradient FP8 format with more dynamic range.' },
  { acronym: 'NVFP4', fullForm: 'NVIDIA FP4 (E2M1)', description: 'Blackwell 4-bit float with 16-element block scaling and dual-level scale.' },
  { acronym: 'MXFP4', fullForm: 'Microscaling FP4', description: 'OCP standard 4-bit float with 32-element blocks and E8M0 scale.' },
  { acronym: 'INT8', fullForm: 'Integer 8-bit', description: 'Quantized integer format used for production inference.' },

  // LLM inference
  { acronym: 'KV cache', fullForm: 'Key-Value Cache', description: 'Per-layer per-head K and V tensors cached during decode to avoid recomputation.' },
  { acronym: 'MHA', fullForm: 'Multi-Head Attention', description: 'Original attention: each query head has its own K and V head.' },
  { acronym: 'GQA', fullForm: 'Grouped Query Attention', description: 'Q heads grouped to share KV pairs (typically 4:1 or 8:1). Standard in modern models.' },
  { acronym: 'MQA', fullForm: 'Multi-Query Attention', description: 'All Q heads share one KV pair. Most aggressive KV-cache reduction.' },
  { acronym: 'MLA', fullForm: 'Multi-Head Latent Attention', description: 'DeepSeek-V3 attention variant with learned low-rank KV compression.' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'Sparse-activation architecture. Top-k of N experts fire per token.' },
  { acronym: 'EP', fullForm: 'Expert Parallelism', description: 'Sharding MoE experts across devices. EP=64 fits DeepSeek-R1 in one NVL72.' },
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Sharding tensors within a layer across devices.' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Splitting layers across pipeline stages on different devices.' },
  { acronym: 'PagedAttention', fullForm: 'Paged Attention', description: 'vLLM technique that pages the KV cache like virtual memory pages.' },

  // Communication
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'NVIDIA collective library; launches GPU kernels for collectives.' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'GPU-Direct RDMA library that does not consume SMs (used for KV cache transport).' },
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'AWS network interface for HPC and ML; libfabric-compatible OS-bypass.' },
  { acronym: 'SRD', fullForm: 'Scalable Reliable Datagram', description: 'AWS multi-path-spraying transport beneath EFA.' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'Network primitive that writes directly to remote memory without CPU involvement.' },

  // Isolation and determinism
  { acronym: 'NIE', fullForm: 'Nitro Isolation Engine', description: 'Formally verified Rust hypercall module providing VM isolation on Graviton5.' },
  { acronym: 'MIG', fullForm: 'Multi-Instance GPU', description: 'NVIDIA hardware partitioning of a GPU into up to 7 isolated instances.' },
  { acronym: 'TEE-I/O', fullForm: 'Trusted Execution Environment for I/O', description: 'Blackwell hardware feature that encrypts GPU memory and NVLink per MIG instance.' },
  { acronym: 'NEFF', fullForm: 'Neuron Executable File Format', description: 'Trainium ahead-of-time compiled binary. The schedule.' },
  { acronym: 'NKI', fullForm: 'Neuron Kernel Interface', description: 'Python DSL for authoring Trainium kernels against SBUF and PSUM.' },

  // Capital markets
  { acronym: 'HFT', fullForm: 'High-Frequency Trading', description: 'Trading strategies that depend on ultra-low tick-to-trade latency.' },
  { acronym: 'MiFID II', fullForm: 'Markets in Financial Instruments Directive II', description: 'EU regulation governing algorithmic trading and recordkeeping.' },
  { acronym: 'DORA', fullForm: 'Digital Operational Resilience Act', description: 'EU regulation on ICT risk management for financial services.' },
  { acronym: 'SR 11-7', fullForm: 'Supervisory Letter 11-7', description: 'US Federal Reserve guidance on model risk management.' },
  { acronym: 'CFTC', fullForm: 'Commodity Futures Trading Commission', description: 'US regulator. Part 1.31 governs recordkeeping for commodities.' },
  { acronym: 'FINRA', fullForm: 'Financial Industry Regulatory Authority', description: 'US broker-dealer self-regulatory organization. Rule 3110 covers supervision.' },

  // Compilers and tooling
  { acronym: 'PTX', fullForm: 'Parallel Thread Execution', description: 'NVIDIA virtual ISA — emitted by CUDA compilers and lowered to SASS by ptxas.' },
  { acronym: 'SASS', fullForm: 'Streaming Assembler', description: 'NVIDIA per-architecture assembly language. The actual instructions executed on the SM.' },
  { acronym: 'CUTLASS', fullForm: 'CUDA Templates for Linear Algebra Subroutines', description: 'NVIDIA C++ template library for tile-based kernels.' },
  { acronym: 'CuTe', fullForm: 'CUDA Tensors', description: 'CUTLASS layout algebra; first-class TMEM support on Blackwell.' },
  { acronym: 'Triton', fullForm: 'Triton Language', description: 'Python DSL for GPU kernels with auto-tiling. Default Inductor backend on NVIDIA.' },
  { acronym: 'Inductor', fullForm: 'PyTorch Inductor', description: 'PyTorch native compiler invoked by torch.compile.' },
  { acronym: 'XLA', fullForm: 'Accelerated Linear Algebra', description: 'OpenXLA intermediate representation; common compiler middle-end for TPU, Trainium.' },
  { acronym: 'HLO', fullForm: 'High-Level Operations', description: 'XLA IR level. Neuron compiler consumes XLA HLO and emits Neuron HLO.' },
  { acronym: 'OCP', fullForm: 'Open Compute Project', description: 'Industry standards body. MXFP4 / MXFP8 are OCP microscaling formats.' },
  { acronym: 'JEDEC', fullForm: 'Joint Electron Device Engineering Council', description: 'Memory standards body. Defines DDR, HBM, MRDIMM specifications.' },

  // Other
  { acronym: 'OS-bypass', fullForm: 'Operating System Bypass', description: 'Networking technique that lets user-space code talk directly to NIC hardware.' },
  { acronym: 'PHY', fullForm: 'Physical Layer', description: 'The lowest layer in a link — signal integrity, line coding, equalization.' },
  { acronym: 'DSA / IAA / QAT / DLB', fullForm: 'Intel on-die accelerators', description: 'Data Streaming Accelerator, In-Memory Analytics Accelerator, QuickAssist Tech, Dynamic Load Balancer — Xeon 6 IO-die-resident.' },
];

const sources: Source[] = [
  // NVIDIA — Tier 1
  { id: 1, title: 'NVIDIA H100 product page', url: 'https://www.nvidia.com/en-us/data-center/h100/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 2, title: 'NVIDIA H200 product page', url: 'https://www.nvidia.com/en-us/data-center/h200/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 3, title: 'NVIDIA HGX overview', url: 'https://www.nvidia.com/en-us/data-center/hgx/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 4, title: 'NVIDIA GB200 NVL72', url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 5, title: 'NVIDIA GB300 NVL72', url: 'https://www.nvidia.com/en-us/data-center/gb300-nvl72/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 6, title: 'NVIDIA Grace CPU', url: 'https://www.nvidia.com/en-us/data-center/grace-cpu/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 7, title: 'NVIDIA MIG technology', url: 'https://www.nvidia.com/en-us/technologies/multi-instance-gpu/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 8, title: 'CUDA Programming Guide', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 9, title: 'Hopper Tuning Guide', url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 10, title: 'TensorRT-LLM documentation', url: 'https://nvidia.github.io/TensorRT-LLM/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 11, title: 'TensorRT-LLM Wide-EP example', url: 'https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep', tier: 1, type: 'source-code', accessDate: '2026-04-23' },
  { id: 12, title: 'CUTLASS GitHub', url: 'https://github.com/NVIDIA/cutlass', tier: 1, type: 'source-code', accessDate: '2026-04-23' },
  { id: 13, title: 'Triton documentation', url: 'https://triton-lang.org/main/index.html', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 14, title: 'NeMo MoE feature docs', url: 'https://docs.nvidia.com/nemo-framework/user-guide/24.09/nemotoolkit/features/moe.html', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },

  // NVIDIA — Tier 2
  { id: 20, title: 'NVIDIA Technical Blog — GB200 NVL72 + Dynamo for MoE', url: 'https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/', tier: 2, type: 'aws-blog', accessDate: '2026-04-23' },
  { id: 21, title: 'NVIDIA blog — Introducing NVFP4', url: 'https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/', tier: 2, type: 'aws-blog', accessDate: '2026-04-23' },
  { id: 22, title: 'NVIDIA blog — Blackwell SemiAnalysis InferenceMAX', url: 'https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/', tier: 2, type: 'aws-blog', accessDate: '2026-04-23' },

  // AWS — Tier 1
  { id: 30, title: 'AWS Neuron SDK documentation', url: 'https://awsdocs-neuron.readthedocs-hosted.com/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 31, title: 'NKI documentation', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 32, title: 'Neuron Distributed', url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 33, title: 'AWS EFA page', url: 'https://aws.amazon.com/hpc/efa/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 34, title: 'AWS M8i instance type', url: 'https://aws.amazon.com/ec2/instance-types/m8i/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },

  // AWS — Tier 2
  { id: 40, title: 'About Amazon — AWS Graviton 5', url: 'https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2', tier: 2, type: 'announcement', accessDate: '2026-04-23' },

  // Intel and AMD — Tier 1
  { id: 50, title: 'Intel Xeon 6 product brief', url: 'https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 51, title: 'Intel AMX technical overview', url: 'https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 52, title: 'AMD EPYC 9005 Series', url: 'https://www.amd.com/en/products/processors/server/epyc/9005-series.html', tier: 1, type: 'product-page', accessDate: '2026-04-23' },

  // ARM — Tier 1
  { id: 60, title: 'ARM CMN-S3', url: 'https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3', tier: 1, type: 'product-page', accessDate: '2026-04-23' },

  // Standards and frameworks
  { id: 70, title: 'CXL Consortium', url: 'https://computeexpresslink.org/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 71, title: 'PyTorch torch.compile docs', url: 'https://pytorch.org/docs/stable/torch.compiler.html', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 72, title: 'JAX documentation', url: 'https://docs.jax.dev/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },
  { id: 73, title: 'SGLang documentation', url: 'https://docs.sglang.ai/', tier: 1, type: 'official-docs', accessDate: '2026-04-23' },

  // Alternative silicon vendors
  { id: 80, title: 'Cerebras', url: 'https://www.cerebras.ai/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 81, title: 'Cerebras Inference', url: 'https://www.cerebras.ai/inference', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 82, title: 'Groq', url: 'https://groq.com/', tier: 1, type: 'product-page', accessDate: '2026-04-23' },
  { id: 83, title: 'HyperCIM', url: 'https://hypercim.com/', tier: 1, type: 'product-page', accessDate: '2026-04-24' },
  { id: 84, title: 'Samsung Semiconductor Tech Blog', url: 'https://semiconductor.samsung.com/news-events/tech-blog/', tier: 2, type: 'aws-blog', accessDate: '2026-04-23' },

  // Models and papers
  { id: 90, title: 'Mistral — Mixtral of Experts', url: 'https://mistral.ai/news/mixtral-of-experts/', tier: 2, type: 'announcement', accessDate: '2026-04-24' },
  { id: 91, title: 'DeepSeek-V3 technical report', url: 'https://arxiv.org/abs/2412.19437', tier: 3, type: 'academic-paper', accessDate: '2026-04-24' },
  { id: 92, title: 'Databricks DBRX', url: 'https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm', tier: 2, type: 'aws-blog', accessDate: '2026-04-24' },
  { id: 93, title: 'Meta — Llama 4', url: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', tier: 2, type: 'announcement', accessDate: '2026-04-24' },
  { id: 94, title: 'DeepEP repository', url: 'https://github.com/deepseek-ai/DeepEP', tier: 1, type: 'source-code', accessDate: '2026-04-24' },
  { id: 95, title: 'NIXL repository', url: 'https://github.com/ai-dynamo/nixl', tier: 1, type: 'source-code', accessDate: '2026-03-22' },
  { id: 96, title: 'SambaNova SN40L (arXiv)', url: 'https://arxiv.org/abs/2405.07518', tier: 3, type: 'academic-paper', accessDate: '2026-04-23' },

  // Foundational papers
  { id: 100, title: 'Williams, Waterman, Patterson — Roofline (CACM 2009)', url: 'https://dl.acm.org/doi/10.1145/1498765.1498785', tier: 3, type: 'academic-paper', accessDate: '2026-04-23' },

  // Third-party measurements
  { id: 110, title: 'Chips and Cheese — Xeon 6 memory', url: 'https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory', tier: 3, type: 'third-party-benchmark', accessDate: '2026-04-23' },
  { id: 111, title: 'Chips and Cheese — Turin launch', url: 'https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched', tier: 3, type: 'third-party-benchmark', accessDate: '2026-04-23' },
  { id: 112, title: 'Chips and Cheese — Zen 5 at Hot Chips 2024', url: 'https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024', tier: 3, type: 'third-party-analysis', accessDate: '2026-04-23' },
  { id: 113, title: 'Chips and Cheese — Neoverse V2 in Graviton4', url: 'https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4', tier: 3, type: 'third-party-benchmark', accessDate: '2026-04-21' },
  { id: 114, title: 'Artificial Analysis', url: 'https://artificialanalysis.ai/', tier: 3, type: 'third-party-benchmark', accessDate: '2026-04-23' },
  { id: 115, title: 'NextPlatform — Granite Rapids', url: 'https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/', tier: 3, type: 'third-party-analysis', accessDate: '2026-04-23' },
  { id: 116, title: 'The Register — Graviton 5', url: 'https://www.theregister.com/2025/12/04/amazon_graviton_5/', tier: 3, type: 'third-party-analysis', accessDate: '2026-04-23' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Vocabulary and authoritative source list for the deep dive"
          >
            Glossary and sources
          </Header>
        }
      >
        <Box variant="p">
          This is the reference appendix. The glossary below covers every
          acronym and niche term used across the deep dive, alphabetized
          and searchable. The source list that follows is the complete
          bibliography — tier-graded by authority, with access dates on
          every entry. Tier 1 (official vendor documentation, formal
          specifications, source code) is the first-class evidence; Tier 2
          is vendor blog and announcement material; Tier 3 is peer-reviewed
          papers and third-party measurement; Tier 4 (random tutorials,
          unverified posts) is excluded by policy.
        </Box>
      </Container>

      <Glossary entries={glossary} title="Glossary" />

      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
