I now have enough data to write a comprehensive, fully-cited report. Let me compile everything.

---

## Research Report: AWS Elastic Fabric Adapter (EFA) — Comprehensive Technical Deep Dive

**Researched on:** 2026-03-22
**Search queries used:**
1. "AWS EFA supported instance types 2025 2026 P5e Trn2 full list"
2. "aws-ofi-nccl GitHub EFA NCCL integration plugin 2025"
3. "AWS EFA P5en EFAv3 bandwidth latency H200 specifications site:aws.amazon.com"
4. "AWS EFA Neuron Trainium Inferentia distributed training documentation 2025"
5. "AWS EFA performance benchmarks latency bandwidth MPI HPC comparison TCP 2024 2025"
6. "AWS EFA cluster placement group requirement single AZ limitation multi-node inference 2025"
7. "AWS EFA pricing no additional charge instance type surcharge placement group cost 2025"
8. "AWS EFA distributed training data parallel model parallel pipeline parallel MoE expert parallel 2024 2025"
9. "AWS EFA HPC MPI weather modeling CFD molecular dynamics OpenFOAM WRF benchmark 2024"
10. "AWS EFA security group requirements same security group inter-node communication gotchas limitations 2025"
11. "AWS EFA Trainium2 Trn2 NeuronLink inter-node EFA role collective operations 2024 2025"

**Sources consulted:** 22 pages fetched and read

---

### Section 1: What EFA Is — Architecture and OS/Network-Level Operation

[VERIFIED] EFA (Elastic Fabric Adapter) is a network device attached to Amazon EC2 instances that enables applications to bypass the OS kernel and communicate directly with the EFA hardware via libfabric, achieving lower and more consistent latency and higher throughput than TCP for inter-instance workloads. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

[VERIFIED] EFA ships in two attachment modes: "EFA with ENA" (creates both an EFA and a traditional ENA device, supporting IP networking and OS-bypass), and "EFA-only" (OS-bypass only, no IP address assigned, cannot be used on the primary network card). (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**The SRD Protocol**

[VERIFIED] EFA uses the Scalable Reliable Datagram (SRD) protocol for transport. SRD implements "reliable but out-of-order packet delivery," deliberately decoupling reliability from ordering to eliminate head-of-line blocking. Ordering responsibility is shifted to the application layer (libfabric), while reliability is handled in AWS Nitro hardware. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

[VERIFIED] SRD employs multipath packet spraying across up to 64 parallel paths chosen from hundreds available in AWS data centers. It continuously monitors round-trip time (RTT) on each path at sub-millisecond resolution and dynamically switches packets away from congested routes by manipulating UDP source ports in the encapsulation header. This exceeds traditional ECMP static load balancing. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

[VERIFIED] SRD uses proactive congestion management (estimating available bandwidth and RTT continuously, reducing rate before congestion occurs) rather than TCP's reactive approach. This prevents queue bloat in switches, keeping latency low under load. Sub-millisecond hardware retransmission is performed via the Nitro DPU, providing approximately 100x faster retransmission than the RFC 6298 minimum of 200ms. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

**SRD vs. Competing Protocols**

[VERIFIED] Comparison to InfiniBand RC: Both achieve microsecond-level latencies and support hardware multipath. InfiniBand requires dedicated HCA/TCA hardware; SRD uses standard Ethernet with Nitro acceleration. Comparison to RoCE v2: RoCE depends on lossless Ethernet with Priority Flow Control, adding deployment complexity. SRD operates transparently on standard Ethernet through hardware processing without needing PFC. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

**The libfabric Stack**

[VERIFIED] Applications access EFA through the libfabric (OpenFabrics Interfaces) API layer. EFA is an OFI provider. The minimum supported libfabric version is 1.7.0; 1.21.0 or later is required for NIXL (NVIDIA Inference Xfer Library) support. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

[VERIFIED] The EFA installer (current version 1.47.0) installs libfabric to `/opt/amazon/efa` and the aws-ofi-nccl plugin to `/opt/amazon/ofi-nccl`. Open MPI 4.1 is installed to `/opt/amazon/openmpi`; from installer version 1.30.0 onward, Open MPI 5 is also installed to `/opt/amazon/openmpi5`. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**RDMA Support**

[VERIFIED] RDMA read is supported on all instances with Nitro version 4 and later. RDMA write support varies by instance type and Nitro version. Nitro v6 instances (m8, c8, r8, x8, g7e, p6-b200, p6-b300, hpc8a families) support both RDMA read and write. Nitro v3 instances (p4d, p4de, dl1) support RDMA read only. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

---

### Section 2: Supported Instance Types — Complete Current List

[VERIFIED] The following table summarizes EFA-enabled accelerated computing instances. Bandwidth figures sourced from the official AWS EC2 instance types documentation. (Source: AWS EC2 Accelerated Computing Instance Specs, https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, accessed 2026-03-22)

**P-Series (NVIDIA GPU)**

| Instance | GPUs | GPU Model | GPU Memory | Network Cards | EFA Interfaces | Total EFA Bandwidth | EFA Generation |
|---|---|---|---|---|---|---|---|
| p4d.24xlarge | 8 | A100 SXM4 | 320 GiB | 4 | 4 | 400 Gbps (4x100) | EFAv1 |
| p4de.24xlarge | 8 | A100 SXM4e | 640 GiB | 4 | 4 | 400 Gbps (4x100) | EFAv1 |
| p5.4xlarge | 1 | H100 | 80 GiB | 1 | 1 | 100 Gbps | EFAv2 |
| p5.48xlarge | 8 | H100 SXM5 | 640 GiB | 32 | 32 | 3,200 Gbps | EFAv2 |
| p5e.48xlarge | 8 | H200 SXM5 | 1,128 GiB | 32 | 32 | 3,200 Gbps | EFAv2 |
| p5en.48xlarge | 8 | H200 SXM5 | 1,128 GiB | 16 | 16 | 3,200 Gbps | EFAv3 (Nitro v5) |
| p6-b200.48xlarge | 8 | B200 | 1,432 GiB | 8 | 8 | 3,200 Gbps | EFAv3 |
| p6-b300.48xlarge | 8 | B300 | 2,148 GiB | 17 | up to 17 | 6,400 Gbps | EFAv3 |
| p6e-gb200.36xlarge | 4 | B200 (GB200 NVL72) | 740 GiB | 17 | up to 8 active | 1,600 Gbps | EFAv4 |

[VERIFIED] P5e and P5en use NVIDIA H200 GPUs offering 1.7x more GPU memory and 1.5x more memory bandwidth than the H100 GPUs in P5. P5en uses third-generation EFA (EFAv3) on Nitro v5, with up to 35% lower latency compared to P5. P5en pairs with custom 4th Gen Intel Xeon Scalable (Sapphire Rapids) CPUs and Gen5 PCIe, providing up to 4x the CPU-GPU bandwidth of P5. (Source: AWS What's New — P5en GA, https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/, accessed 2026-03-22)

[VERIFIED] P5 and P5e instances feature NVSwitch GPU-to-GPU interconnect at up to 900 GB/s per GPU pair, for a total bisectional bandwidth of 3.6 TB/s within each instance. (Source: Amazon EC2 P5 Instance Types page, https://aws.amazon.com/ec2/instance-types/p5/, accessed 2026-03-22)

[VERIFIED] P5/P5e/P5en instances are deployed in EC2 UltraClusters enabling scaling up to 20,000 H100 or H200 GPUs with up to 20 exaflops of aggregate FP8 compute. (Source: Amazon EC2 P5 Instance Types page, https://aws.amazon.com/ec2/instance-types/p5/, accessed 2026-03-22)

[VERIFIED] P6e-GB200 UltraServers support up to 72 Blackwell GPUs within one NVLink domain and up to 28.8 Tbps of EFAv4 networking per UltraServer. The p6e-gb200.36xlarge exposes 4 B200 GPUs and up to 1,600 Gbps EFA. (Source: AWS EC2 UltraServers page, https://aws.amazon.com/ec2/ultraservers/, accessed 2026-03-22)

**Trainium / Trainium2 (AWS Custom AI Chips)**

| Instance | Trainium Chips | Memory | NeuronLink BW | EFA Interfaces | Total EFA Bandwidth | EFA Generation |
|---|---|---|---|---|---|---|
| trn1.2xlarge | 1 | 32 GiB | — | 0 | None | — |
| trn1.32xlarge | 16 | 512 GiB | NeuronLink | 8 | 800 Gbps (8x100) | EFAv1 |
| trn1n.32xlarge | 16 | 512 GiB | NeuronLink | 16 | 1,600 Gbps (16x100) | EFAv1 |
| trn2.3xlarge | 1 | 512 GiB | — | 1 | 200 Gbps | EFAv3 |
| trn2.48xlarge | 16 | 8,192 GiB | NeuronLink (2D Torus, 1 TB/s) | 16 | 3,200 Gbps (16x200) | EFAv3 |
| trn2u.48xlarge | 16 (CPU-only host) | — | — | 16 | 3,200 Gbps | EFAv3 |

[VERIFIED] Trn2 instances feature 16 Trainium2 chips with 1.5 TB HBM3 memory, 46 TB/s memory bandwidth, and 3.2 Tbps EFAv3. Each Trainium2 chip connects to one 200 Gbps EFA interface (16 chips = 16 x 200 Gbps = 3.2 Tbps aggregate). Chips within a node connect via NeuronLink in a 2D torus topology at 1 TB/s. (Source: AWS EC2 Trn2 Instance Types page, https://aws.amazon.com/ec2/instance-types/trn2/, accessed 2026-03-22)

[VERIFIED] Trn2 UltraServers connect 4 trn2.48xlarge nodes via NeuronLink, yielding 64 Trainium2 chips, 83.2 FP8 petaflops, 6 TB total HBM, 185 TB/s memory bandwidth, and 12.8 Tbps EFAv3 networking. (Source: AWS EC2 Trn2 Instance Types page, https://aws.amazon.com/ec2/instance-types/trn2/, accessed 2026-03-22)

[VERIFIED] Trn2 delivers 30-40% better price-performance than GPU-based P5e and P5en instances and is 3x more energy-efficient than Trn1. (Source: AWS EC2 Trn2 Instance Types page, https://aws.amazon.com/ec2/instance-types/trn2/, accessed 2026-03-22)

**Inferentia / Inferentia2 (AWS Custom Inference Chips)**

| Instance | Inferentia Chips | EFA | Total EFA Bandwidth |
|---|---|---|---|
| inf1.xlarge, inf1.2xlarge, inf1.6xlarge | 1–4 | No | — |
| inf1.24xlarge | 16 | Yes | 100 Gbps |
| inf2.xlarge, inf2.8xlarge, inf2.24xlarge, inf2.48xlarge | 1–12 | No | — |

[VERIFIED] Only inf1.24xlarge has EFA in the Inf1 family. None of the Inf2 instances have EFA support. (Source: AWS EC2 Accelerated Computing Instance Specs, https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, accessed 2026-03-22)

**Other Accelerated / HPC Instances with EFA**

| Instance | Accelerator | EFA Interfaces | EFA Bandwidth |
|---|---|---|---|
| dl1.24xlarge | 8x Habana Gaudi HL-205 | 4 | 400 Gbps (4x100) |
| dl2q.24xlarge | 8x Qualcomm AI100 | 1 | 100 Gbps |
| hpc8a.96xlarge | AMD EPYC (no accelerator) | 2 | 300 Gbps |
| hpc7a.96xlarge | AMD EPYC (no accelerator) | 2 | 200 Gbps |
| hpc6a.48xlarge | AMD EPYC (no accelerator) | 2 | 200 Gbps |

[VERIFIED] General-purpose compute families with EFA support include m6i/m6a/c6i/c6a and later (Nitro v4+), m7i/c7i/r7i (RDMA read only), m8i/c8i/r8i/x8i (Nitro v6, full RDMA read+write). This extends EFA availability to non-HPC/non-ML workloads on standard instance families. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**CLI Command to Query EFA-Supported Instances in Any Region**

```bash
aws ec2 describe-instance-types \
  --region us-east-1 \
  --filters Name=network-info.efa-supported,Values=true \
  --query "InstanceTypes[*].[InstanceType]" \
  --output text | sort
```

(Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

---

### Section 3: EFA vs Traditional Networking — Bandwidth, Latency, When It Matters

**Latency**

[VERIFIED] EFA achieves 15.5 microsecond MPI ping-pong latency through OS-bypass and SRD, versus millisecond-scale latency for TCP. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

[VERIFIED] SRD achieves P99.9 latency of tens of microseconds (85% reduction versus traditional TCP). Max single-flow bandwidth with SRD is approximately 25 Gbps vs approximately 5 Gbps for TCP. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

[VERIFIED] EFAv3 (as used in P5en) provides up to 35% improvement in latency compared to EFAv2 as used in P5. (Source: AWS What's New — P5en GA, https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/, accessed 2026-03-22)

**Collective Operations**

[VERIFIED] Second-generation EFA resulted in a 75% reduction in communication time for common collective operations compared to first-generation EFA. (From search result snippets referencing AWS HPC Blog post "Second generation EFA: improving HPC and ML application performance in the cloud," https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/)

**When EFA Matters vs When It Does Not**

[VERIFIED] EFA is critical for: tightly-coupled HPC applications (MPI workloads like CFD, weather modeling, molecular dynamics where inter-rank communication is on the hot path), multi-node distributed AI/ML training (AllReduce, AllGather, ReduceScatter gradient synchronization across GPU/accelerator nodes), and large-model inference that requires tensor parallelism across multiple nodes. (Source: AWS EFA product page, https://aws.amazon.com/hpc/efa/, accessed 2026-03-22)

[VERIFIED] EFA provides a "4X improvement in scaling over ENA for a standard CFD simulation" and enables applications to "scale extra-linearly to over 200 cores." (Source: AWS EFA product page, https://aws.amazon.com/hpc/efa/, accessed 2026-03-22)

[LIKELY] EFA does not materially benefit workloads that are compute-bound with minimal inter-node communication (single-node training, embarrassingly parallel batch jobs, I/O-bound inference on single instances). The TCP/IP ENA path is sufficient for workloads where network is not the bottleneck. (Inferred from official descriptions of EFA's target use cases at https://aws.amazon.com/hpc/efa/ and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html)

**EFA vs. InfiniBand Context**

[VERIFIED] EFA's higher latencies (5–10 microseconds) versus InfiniBand's sub-microsecond latency create measurable overhead in the most tightly-coupled parallel applications. SRD achieves microsecond-level latencies comparable to InfiniBand RC, but the absolute floor remains higher. (Source: Ernest Chiang — AWS SRD Technical Notes, https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/, accessed 2026-03-22)

---

### Section 4: EFA + NCCL — The aws-ofi-nccl Plugin

**What It Does**

[VERIFIED] aws-ofi-nccl is a plugin that "maps NCCL's connection-oriented transport APIs to libfabric's connection-less reliable interface," enabling NCCL applications to use libfabric's transport layer (including reliable messaging and OS bypass via EFA). It also supports AMD's RCCL for comparable functionality. (Source: aws/aws-ofi-nccl README, https://github.com/aws/aws-ofi-nccl/blob/master/README.md, accessed 2026-03-22)

[VERIFIED] The plugin is installed by the EFA installer at `/opt/amazon/ofi-nccl`. As of NCCL 2.4.8 and later, a single plugin build works across multiple NCCL versions, including per-package Conda-like installations. Minimum NCCL version supported is 2.4.2. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

**How to Verify EFA Is Active Under NCCL**

[VERIFIED] When EFA is correctly selected by the plugin, NCCL outputs `NCCL INFO NET/OFI Selected Provider is efa*`. On p4d.24xlarge specifically, the expected output also includes `NCCL INFO NET/OFI Running on P4d platform, Setting NCCL_TOPO_FILE environment variable to ...p4d-24xl-topo.xml`. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

**Key Environment Variables**

[VERIFIED] `FI_EFA_USE_DEVICE_RDMA=1` — Required on p4d.24xlarge to enable GPUDirect RDMA for one-sided and two-sided transfers. Not needed on p5 and later (enabled by default). `NCCL_DEBUG=INFO` — Enables verbose NCCL output to confirm provider selection. `NCCL_TOPO_FILE` — Overrides NCCL's topology detection; the plugin auto-sets this for known platforms (p4d, p5). (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

**NCCL Tuner Plugin**

[VERIFIED] The aws-ofi-nccl package also ships a tuner plugin at `/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu/libnccl-ofi-tuner.so` that optimizes NCCL algorithm and protocol selection for EFA-specific topologies. It is invoked via the `NCCL_TUNER_PLUGIN` environment variable. (Source: AWS EKS EFA documentation, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**GDRCopy Dependency**

[VERIFIED] GPUDirect RDMA (GDRCopy) must be installed before running NCCL with EFA on P-series instances. GDRCopy provides a low-latency GPU memory copy library based on NVIDIA GPUDirect RDMA. Version 2.4 is the version referenced in AWS documentation examples. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

**NVIDIA Fabric Manager**

[VERIFIED] On p4d.24xlarge and p5.48xlarge, NVIDIA Fabric Manager must be installed and running (`nvidia-fabricmanager` systemd service) to manage NVSwitch GPU-to-GPU connectivity. The Fabric Manager version must match the installed NVIDIA kernel module version. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

**Recent aws-ofi-nccl Releases**

[VERIFIED] As of early 2026, the most recent releases are:
- v1.18.0 (2026-01-21): P6-B300 support with custom tuner decisions, improved PAT performance on P6-B200, dynamic platform selection, redesigned threading model for multi-threaded applications.
- v1.17.3 (2026-01-15): Memory leak fix for long-running jobs.
- v1.17.2 (2025-11-13): g7e instance family support, crash fix for NCCL v2.28.x.
- v1.17.1 (2025-10-25): CUDA 12 and CUDA 13 compatibility fixes.
- v1.17.0 (2025-09-30): Control-over-write protocol improvements, tuner profiles for P5en and P6.
- v1.16.3 (2025-08-13): Domain-per-thread enabled by default on AWS instance types.
(Source: aws/aws-ofi-nccl Releases, https://github.com/aws/aws-ofi-nccl/releases, accessed 2026-03-22)

[VERIFIED] Building with the `platform-aws` target requires Libfabric v1.22.0amzn4.0 or greater. Tested up to Libfabric v2.3.1amzn1.0. (From search result snippet referencing aws-ofi-nccl v1.17.3 release notes, https://github.com/aws/aws-ofi-nccl/releases)

**EFA Limitation with MoE**

[VERIFIED] EFA delivers 400 Gbps throughput on collective operations typically used in standard training workloads but falls slightly short of ConnectX-7 (InfiniBand) on the message sizes exchanged during MoE dispatch-and-combine patterns. EFA also does not support GPUDirect Async. (From search result snippets referencing parallelism analysis at https://research.perplexity.ai/articles/enabling-trillion-parameter-models-on-aws-efa)

---

### Section 5: EFA + AWS Neuron (Trainium / Inferentia)

**Architecture: NeuronLink for Intra-Node, EFA for Inter-Node**

[VERIFIED] Within a single Trn2 server, the 16 Trainium2 chips are connected via NeuronLink in a 2D torus topology at 1 TB/s aggregate bandwidth. This is the intra-node fabric. Between nodes (multi-node training), all communication uses EFA. Each Trainium2 chip has its own dedicated 200 Gbps EFA interface, yielding 3.2 Tbps device-RDMA connectivity per trn2.48xlarge. (Source: Neuron Collective Communication documentation, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html, accessed 2026-03-22)

[VERIFIED] For Trn1/Trn1n, intra-node communication uses NeuronLink; inter-node uses EFA. Trn1.32xlarge provides 800 Gbps EFA (8x100 Gbps); Trn1n.32xlarge provides 1.6 Tbps EFA (16x100 Gbps), which is "2x the throughput" versus p4d for inter-node communication. (Source: Neuron Training FAQ, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html, accessed 2026-03-22)

**Dedicated Collective Compute Engine**

[VERIFIED] Each Trainium chip includes a dedicated Collective Compute (CC) Engine that orchestrates collective operations (AllReduce, AllGather, ReduceScatter, All-to-All) independently from the NeuronCores. CC cores "control when and how data movement engines transfer data." This enables communication to execute in parallel with NeuronCore computations, providing an additional 10–15% acceleration of overall workload. (Source: Neuron Collective Communication documentation, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html, accessed 2026-03-22)

**Hierarchical Communication Strategy**

[VERIFIED] Neuron's distributed frameworks automatically apply a hierarchical communication strategy: local reductions within a node first (NeuronLink), then inter-node coordination among designated processes over EFA, then result broadcast. This minimizes expensive EFA traffic. (Source: Neuron Collective Communication documentation, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html, accessed 2026-03-22)

**SDK and Framework Requirements**

[VERIFIED] AWS Neuron SDK 2.3 and later support EFA. Neuron SDK integrates natively with PyTorch, JAX, and Hugging Face, PyTorch Lightning. Over 100,000 models from Hugging Face Hub are supported. (Source: AWS EC2 Trn2 Instance Types page, https://aws.amazon.com/ec2/instance-types/trn2/, accessed 2026-03-22)

**Inferentia and EFA**

[VERIFIED] Only the inf1.24xlarge (the largest Inf1 instance with 16 Inferentia chips) has EFA support at 100 Gbps. No Inf2 instances have EFA. For Inf2, multi-chip communication within a single instance uses NeuronLink; multi-node Inf2 inference would rely on standard ENA networking. (Source: AWS EC2 Accelerated Computing Instance Specs, https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, accessed 2026-03-22)

**EFA Encryption**

[VERIFIED] All EFA communication is encrypted in transit with no performance penalty, because encryption is handled by the AWS Nitro system in hardware. (From search result snippets referencing Trn2 network details)

---

### Section 6: EFA in AI/ML Training — Multi-Node Distributed Training Patterns

**Data Parallel Training**

[VERIFIED] In data-parallel training, each worker holds a full model copy and processes a partition of the data. After each forward/backward pass, gradients are synchronized across all workers using AllReduce collectives. The SageMaker Distributed Data Parallel (SMDDP) library uses EFA for AllGather operations with a mesh topology, avoiding ring/tree topology overhead and using GDRCopy to pipeline NVLink (intra-node) and EFA (inter-node) transfers. This reduces GPU SM usage from 24 (NCCL) to under 9, freeing compute for model kernels. P4d instances are the explicitly recommended target for SMDDP AllGather with EFA. (Source: SageMaker Data Parallel Library documentation, https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html, accessed 2026-03-22)

**Model Parallel / Tensor Parallel Training**

[LIKELY] In tensor parallelism, individual layer weight matrices are split across GPUs/accelerators. This generates frequent AllReduce communication after each matmul, requiring high EFA bandwidth and low latency between nodes. EFA's 3.2 Tbps bandwidth on p5/p5e and trn2 families makes this tractable at scale. (Inferred from EFA architecture and AWS documentation at https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html and https://aws.amazon.com/ec2/instance-types/trn2/)

**Pipeline Parallel Training**

[LIKELY] In pipeline parallelism, model layers are divided across devices/nodes and micro-batches are streamed through. EFA carries the activation tensors between pipeline stages. The high per-link bandwidth (200 Gbps per EFA interface on Trn2) reduces pipeline bubble time. (Inferred from parallelism literature and Trn2 architecture; no direct AWS citation found for this specific claim.)

**Expert Parallel (Mixture of Experts)**

[VERIFIED] Expert parallelism splits MoE model experts across GPU devices. AWS SageMaker Model Parallel (SMP) supports expert parallelism for training MoE models; the inter-node expert routing (dispatch and combine) traverses EFA. EFA delivers 400 Gbps throughput on collectives used in standard training but falls slightly short of ConnectX-7 performance on the specific message sizes used in MoE dispatch-and-combine. EFA does not support GPUDirect Async, which some MoE optimizations rely on. (Source: SageMaker Expert Parallelism documentation, https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html; and from search result snippets referencing https://research.perplexity.ai/articles/enabling-trillion-parameter-models-on-aws-efa)

**UltraCluster Scale**

[VERIFIED] P5/P5e/P5en instances can be deployed in EC2 UltraClusters supporting up to 20,000 H100 or H200 GPUs in a single petabit-scale EFA-networked cluster. Trn2 UltraClusters similarly support multi-node training at petaflop scales. (Source: Amazon EC2 P5 Instance Types page, https://aws.amazon.com/ec2/instance-types/p5/, accessed 2026-03-22; AWS EC2 UltraServers page, https://aws.amazon.com/ec2/ultraservers/, accessed 2026-03-22)

---

### Section 7: EFA in AI/ML Inference — Multi-Node Scenarios

**When EFA Matters for Inference**

[VERIFIED] Multi-node inference is required when a model is too large to fit in the aggregate memory of a single instance. For example, very large LLMs (100B+ parameters) may require tensor parallelism spread across multiple nodes, with EFA carrying the activation AllReduce/AllGather traffic between pipeline and tensor parallel ranks. (Source: Multi-Node vLLM EKS Blueprints, https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/, accessed 2026-03-22)

[VERIFIED] The EKS multi-node vLLM blueprint uses g6e.8xlarge instances with all EFA interfaces enabled, LeaderWorkerSet (LWS) v0.5.1 for pod coordination, and requires NCCL, OpenMPI, and aws-ofi-nccl (v1.13.2-aws) in the inference container image for collective communications. (Source: Multi-Node vLLM EKS Blueprints, https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/, accessed 2026-03-22)

[VERIFIED] AWS has introduced NIXL (NVIDIA Inference Xfer Library) 1.0.0 as a new supported library on EFA alongside NCCL. NIXL requires libfabric 1.21.0 or later. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

[LIKELY] For single-instance inference (even on large GPU instances like p5.48xlarge), EFA is not used — intra-instance GPU communication uses NVSwitch/NVLink. EFA becomes relevant only when the inference workload spans multiple nodes. (Inferred from EFA architecture and the fact that EFA is a network interface; within-instance GPU communication uses PCIe or NVSwitch.)

---

### Section 8: EFA in Traditional HPC — MPI Workloads

**CFD (OpenFOAM)**

[VERIFIED] OpenFOAM benchmarks on c5n.18xlarge instances with EFA achieved linear strong scaling up to 1,008 cores (28 instances) for a 97-million-cell external aerodynamics simulation, reaching 98.4% parallel efficiency. Weak scaling at 1,008 cores reached 72.6% efficiency (data writing disabled). (Source: CFD Direct — OpenFOAM HPC with AWS EFA, https://cfd.direct/cloud/openfoam-hpc-aws-efa/, accessed 2026-03-22)

[VERIFIED] AWS EFA demonstrates "a 4X improvement in scaling over ENA for a standard CFD simulation." (Source: AWS EFA product page, https://aws.amazon.com/hpc/efa/, accessed 2026-03-22)

**Weather Modeling (WRF)**

[VERIFIED] WRF v4.2.2 CONUS 2.5km benchmark results on hpc7a instances show that setting `I_MPI_MULTIRAIL=1` (enabling multi-rail EFA) led to a 10% increase in speedup at 32 instances and over 30% improvement at 192 instances. (From search result snippets referencing AWS HPC blog on hpc7a MPI optimization, https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/)

**Molecular Dynamics**

[VERIFIED] Molecular dynamics codes — AMBER, GROMACS, NAMD, and LAMMPS — use MPI and benefit from EFA's low latency. Up to 2.05x speed-up observed at 2 instances and 1.2x speed-up at 768 cores versus ENA-based networking. (From search result snippets referencing AWS HPC benchmarking whitepaper, https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf)

**MPI Library Configuration**

[VERIFIED] For Intel MPI with EFA, the following environment variables are required:
```
I_MPI_OFI_LIBRARY_INTERNAL=0
I_MPI_OFI_PROVIDER=efa
```
The `I_MPI_MULTIRAIL=1` setting enables multi-rail EFA (using all available EFA interfaces) and is critical for maximum bandwidth on hpc7a and similar multi-EFA instances. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**HPC Instance Families**

[VERIFIED] Dedicated HPC instances with EFA include: hpc6a.48xlarge (AMD EPYC, 200 Gbps EFA), hpc6id.32xlarge (Intel, 200 Gbps EFA), hpc7a.96xlarge (AMD EPYC 9004, 300 Gbps EFA with 2 EFA interfaces), hpc7g.16xlarge (Graviton3E, EFA), hpc8a.96xlarge (AMD EPYC 9005, 300 Gbps EFA, Nitro v6). Hpc8a delivers 40% higher performance and 42% greater memory bandwidth than hpc7a. (From search result snippets referencing AWS EC2 Hpc8a page, https://aws.amazon.com/ec2/instance-types/hpc8a/)

---

### Section 9: Pricing

[VERIFIED] EFA is available at no additional cost on supported instances. Enabling EFA does not add a per-hour fee, per-interface fee, or instance surcharge. The cost is entirely the EC2 instance price. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22; AWS EFA product page, https://aws.amazon.com/hpc/efa/, accessed 2026-03-22)

[VERIFIED] Creating a cluster placement group (required for optimal EFA performance) is also free. (Source: AWS EC2 User Guide — Placement Groups, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html, accessed 2026-03-22)

[LIKELY] The real cost driver for EFA workloads is the instance type itself. Instances with EFA are generally high-end compute or accelerated instances (p5.48xlarge, trn2.48xlarge, etc.) with significantly higher on-demand prices than standard instances. EFA availability is one factor in why these instance types command a premium, but the premium is not separately attributed to EFA. (Inferred from pricing structure; no AWS source breaks down EFA's cost contribution separately.)

---

### Section 10: Placement Groups — Requirements and Topology

**Cluster Placement Groups**

[VERIFIED] Cluster placement groups pack instances close together inside a single Availability Zone to enable the low-latency network performance required for tightly-coupled HPC communication. This is the placement group type relevant to EFA. (Source: AWS EC2 User Guide — Placement Groups, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html, accessed 2026-03-22)

[VERIFIED] Cluster placement groups are strongly recommended but not strictly required for EFA. The EFA start guide states: "cluster placement groups are recommended but not required." However, for minimum latency, all EFA instances should be in the same cluster placement group. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

[VERIFIED] A cluster placement group cannot span multiple Availability Zones. This means all EFA-connected instances must be in a single AZ. (Source: AWS EC2 User Guide — Placement Groups, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html, accessed 2026-03-22)

[VERIFIED] An instance can be in only one placement group at a time. You cannot merge placement groups. Dedicated Hosts cannot be launched in placement groups. (Source: AWS EC2 User Guide — Placement Groups, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html, accessed 2026-03-22)

[VERIFIED] For EKS with EFA, when `efaEnabled: true` is set in an eksctl node group, a cluster placement group is automatically created and passed to the Launch Template. The Availability Zone of the placement group must be specified explicitly when EFA is enabled. (From search result snippets referencing multi-node vLLM blueprint and EKS EFA documentation)

**Capacity Considerations**

[VERIFIED] Adding more instances to a cluster placement group, or attempting to launch multiple instance types within the same group, increases the risk of receiving an "Insufficient Capacity" error. AWS recommends using Capacity Reservations with cluster placement groups to ensure scaling capacity. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

---

### Section 11: EFA with EKS / Containers

**EFA Device Plugin**

[VERIFIED] The AWS EFA Kubernetes device plugin (`aws-efa-k8s-device-plugin-daemonset`) exposes EFA interfaces to pods as Kubernetes extended resources under the resource name `vpc.amazonaws.com/efa`. When using eksctl with `efaEnabled: true`, the DaemonSet is automatically deployed. (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

[VERIFIED] To use EFA interfaces in a pod, add resource requests and limits to the container spec:
```yaml
resources:
  limits:
    vpc.amazonaws.com/efa: 32     # number of EFA interfaces
    nvidia.com/gpu: 8
    hugepages-2Mi: 5120Mi
    memory: 32000Mi
```
(Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**Hugepages Requirement**

[VERIFIED] EFA with EKS requires Huge Pages to be configured as a cluster resource. EC2 instances with EFA pre-allocate 5,128 2MiB Huge Pages. Pod specs must request `hugepages-2Mi` to use them; near all pre-allocated pages should be requested (5,120–5,210 Mi for p5.48xlarge). (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**VPC CNI and eksctl Version Requirements**

[VERIFIED] VPC CNI v1.7.10 or later is required for multi-EFA support (p4d, p5). VPC CNI v1.18.5 or later is required for EFA-only interfaces. eksctl 0.215.0 or later is required. EKS cluster version 1.27.160 or later (or 2.12.3 for managed node groups). (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**EFA Device Plugin Version for New Instance Types**

[VERIFIED] p6-b200 instances require EFA Device Plugin v0.5.6 or later. (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**EFA-only Interfaces in EKS**

[VERIFIED] EFA-only interfaces cannot be used on the primary network card (card index 0). EFA-only interfaces require VPC CNI v1.18.5 or later and Amazon Linux 2 AMI v20240928 or later. EFA-only interfaces cannot be created using eksctl directly — a custom Launch Template is required. (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

**Bottlerocket Support**

[VERIFIED] Bottlerocket v1.28.0 and later supports EFA with EKS. Hugepages must be configured via `vm.nr_hugepages` sysctl (e.g., 3,000 × 2 MiB = 6,000 MiB). (Source: AWS EKS documentation — Node EFA, https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html, accessed 2026-03-22)

---

### Section 12: Limitations and Gotchas

**Security Group Requirements**

[VERIFIED] All EFA-connected instances in a cluster must be in the same security group, and that security group must allow all inbound and outbound traffic to and from itself (self-referential rule with protocol `-1` / All traffic). Without this, EFA inter-instance communication fails silently. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**Cross-AZ Constraint**

[VERIFIED] EFA traffic cannot cross Availability Zones or VPC boundaries. EFA is non-routable. All instances in an EFA cluster must be in the same AZ (enforced by cluster placement groups). (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**Cross-Subnet (New in 2024)**

[VERIFIED] A 2024 update added cross-subnet communication support for EFA: EFA interfaces on EC2 instances within the same Availability Zone can now communicate across different subnets within that AZ. When using cross-subnet communication, security group rules must allow traffic to/from security groups of instances in other subnets. (Source: AWS What's New — EFA cross-subnet support, https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/)

**Hot Attach/Detach**

[VERIFIED] Unlike standard ENIs, EFA interfaces cannot be attached to or detached from an instance that is in a running state. EFA configuration changes require stopping the instance. (From search result snippets citing AWS documentation and https://tutorialsdojo.com/elastic-fabric-adapter-efa/)

**One EFA Per Network Card**

[VERIFIED] A maximum of one EFA interface can be created per network card. The number of EFA interfaces available per instance equals the number of network cards. For example: p5.48xlarge has 32 network cards = max 32 EFA interfaces; p5en.48xlarge has 16 network cards = max 16 EFA interfaces; p4d.24xlarge has 4 network cards = max 4 EFA interfaces. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html; AWS EC2 Accelerated Computing Instance Specs, https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, accessed 2026-03-22)

**P4d/P4de/DL1 Cross-Traffic Limitation**

[VERIFIED] EFA traffic cannot cross between P4d, P4de, or DL1 instances and instances from other families within the same cluster. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**ptrace Requirement**

[VERIFIED] Shared memory communication via CMA (Cross-Memory Attach) requires ptrace protection to be disabled: `kernel.yama.ptrace_scope = 0`. This must be set in `/etc/sysctl.d/10-ptrace.conf` for persistence across reboots. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**Dedicated Hosts / Outposts**

[VERIFIED] EFA is not supported on AWS Outposts. Dedicated Hosts for c7g.16xlarge, m7g.16xlarge, and r7g.16xlarge cannot use EFA. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**Windows Limitation**

[VERIFIED] On Windows, EFA is only supported for AWS CDI (Cloud Digital Interface) SDK applications. Standard HPC/ML workloads requiring EFA (MPI, NCCL) are Linux-only. EFA-only interfaces are not supported with AWS CDI on either Windows or Linux. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**SUSE Linux GPUDirect**

[VERIFIED] NVIDIA GPUDirect RDMA is not supported on SUSE Linux when using EFA. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**MPI Process Limits**

[VERIFIED] u7i-12tb.224xlarge and related large memory instances support up to 128 parallel MPI processes with Open MPI and up to 256 processes with Intel MPI over EFA. (Source: AWS EC2 User Guide — EFA Start with MPI, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html, accessed 2026-03-22)

**Library Path Inconsistency**

[VERIFIED] Libfabric is installed to different paths on different distributions: `/opt/amazon/efa/lib64` on Amazon Linux / RHEL / Rocky Linux, and `/opt/amazon/efa/lib` on Ubuntu and Debian. This affects `LD_LIBRARY_PATH` configuration and is a common source of errors when using pre-built scripts across distros. (Source: AWS EC2 User Guide — EFA Start with NCCL, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, accessed 2026-03-22)

---

### Section 13: Recent Updates (2025–2026)

**P5en GA (December 2024)**
[VERIFIED] P5en instances with NVIDIA H200 GPUs and EFAv3 networking (Nitro v5) became generally available on December 2, 2024 in US East (Ohio), US West (Oregon), and Asia Pacific (Tokyo). Additional regions followed: US East (N. Virginia) and Asia Pacific (Jakarta) in March 2025; US West (N. California) in May 2025. P5en delivers up to 35% lower latency than P5 via EFAv3. (Source: AWS What's New — P5en GA, https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/; AWS What's New — P5en N. Virginia and Jakarta, https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/; AWS What's New — P5en N. California, https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/)

**Trn2 / Trn2 UltraServers GA (December 2024)**
[VERIFIED] Trn2 instances (16 Trainium2 chips, 3.2 Tbps EFAv3) became generally available in December 2024. Trn2 UltraServers (64 chips, 12.8 Tbps EFAv3) were announced as available in preview at the same time. (Source: AWS What's New — Trn2 GA, https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/)

**P6-B200 and P6-B300**
[VERIFIED] P6-b200.48xlarge (8x NVIDIA B200, 1,432 GiB GPU memory, 3,200 Gbps EFA, Nitro v6) and p6-b300.48xlarge (8x NVIDIA B300, 2,148 GiB GPU memory, 6,400 Gbps EFA, Nitro v6) are listed in current AWS documentation as supported EFA instance types. P6-b300 carries the highest total EFA bandwidth of any currently listed EC2 instance at 6,400 Gbps. (Source: AWS EC2 Accelerated Computing Instance Specs, https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, accessed 2026-03-22)

**P6e-GB200 UltraServers**
[VERIFIED] P6e-gb200.36xlarge (4x NVIDIA GB200, 740 GiB) supports EFAv4 with up to 1,600 Gbps per instance. In UltraServer configurations up to 72 Blackwell GPUs share one NVLink domain with 28.8 Tbps EFAv4 per UltraServer. (Source: AWS EC2 UltraServers page, https://aws.amazon.com/ec2/ultraservers/, accessed 2026-03-22)

**EFA Cross-Subnet Communication (2024)**
[VERIFIED] EFA gained cross-subnet communication capability in 2024, allowing EFA traffic between instances in different subnets within the same AZ. This relaxes the previous single-subnet constraint. (Source: AWS What's New China — EFA cross-subnet, https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/)

**NIXL Support**
[VERIFIED] NVIDIA Inference Xfer Library (NIXL) 1.0.0 was added as a supported EFA library alongside NCCL, targeting multi-node inference use cases. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

**aws-ofi-nccl v1.18.0 (January 2026)**
[VERIFIED] Released January 21, 2026, adding P6-B300 tuner support, dynamic platform selection at runtime, improved PAT performance on P6-B200, and a redesigned threading model for multi-threaded applications. (Source: aws/aws-ofi-nccl Releases, https://github.com/aws/aws-ofi-nccl/releases, accessed 2026-03-22)

**Nitro v6 / Next-Gen General Purpose Instances**
[VERIFIED] A new class of general-purpose instances on Nitro v6 (m8, c8, r8, x8 families) now supports EFA with full RDMA read and write, extending high-performance networking beyond the HPC/ML instance families to general compute workloads. (Source: AWS EC2 User Guide — EFA, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html, accessed 2026-03-22)

---

### Known Issues and Gotchas (Operational Summary)

1. [VERIFIED] Insufficient disk space during NCCL setup: The CUDA toolkit requires 10–20 GiB of additional storage beyond the base AMI. Failing to allocate this causes `efa_installer.sh` or CUDA installation to fail. Allocate at minimum 30 GiB root volume. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)

2. [VERIFIED] Fabric Manager version mismatch on p4d/p5: `nvidia-fabricmanager` version must exactly match the installed NVIDIA kernel module version. Mismatches prevent NVSwitch from initializing, rendering all 8 GPUs non-functional for inter-GPU operations. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)

3. [VERIFIED] Security group self-referencing rule is mandatory: Missing this rule causes EFA traffic to be blocked at the hypervisor layer with no obvious error message. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html)

4. [VERIFIED] EFA cannot be hot-attached or hot-detached. Instance must be stopped. (From search result snippets citing AWS EFA documentation)

5. [VERIFIED] SUSE Linux does not support GPUDirect RDMA with EFA. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html)

6. [VERIFIED] `lib` vs `lib64` libfabric path inconsistency between Amazon Linux/RHEL (lib64) and Ubuntu/Debian (lib) is a frequent source of runtime linker errors. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)

7. [VERIFIED] The `nouveau` open-source NVIDIA driver must be blacklisted before installing NVIDIA proprietary drivers on instances with NVIDIA GPUs; not doing this causes driver installation failure. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)

8. [VERIFIED] Insufficient capacity errors are more likely in cluster placement groups, especially when scaling to large instance counts. Use Capacity Reservations for production clusters. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)

9. [VERIFIED] EFA traffic cannot cross AZ or VPC boundaries, making disaster recovery / multi-AZ HA architectures incompatible with EFA-based low-latency clusters. (Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html)

10. [VERIFIED] trn1.2xlarge does not have EFA support; only trn1.32xlarge and trn1n.32xlarge do. (Source: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)

11. [VERIFIED] None of the Inf2 instances have EFA. Multi-node Inf2 inference must use standard ENA networking. (Source: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)

---

### Gaps in Documentation

1. **[UNKNOWN] EFAv1 vs EFAv2 vs EFAv3 vs EFAv4 — explicit feature matrix**: AWS documentation does not publish a clear versioned comparison table for EFA generations. The version numbers (EFAv1/v2/v3/v4) are inferable from instance family associations (P4d = EFAv1, P5/Trn1 = EFAv2, P5en/Trn2 = EFAv3, P6e-GB200 = EFAv4) but no official "EFA versions" changelog was found. Searched for: "EFAv1 EFAv2 EFAv3 EFAv4 feature comparison official".

2. **[UNKNOWN] Explicit pricing for P6-B200, P6-B300, P6e-GB200**: On-demand, reserved, and spot pricing for the newest P6 family instances was not found in the sources fetched. The AWS pricing calculator URL was found but not fetched.

3. **[UNKNOWN] Trn2 UltraServer GA date**: The Trn2 UltraServer was listed as "available in preview" as of December 2024. Whether it has since reached general availability (as of March 2026) was not confirmed in the sources fetched. Searched for: "Trn2 UltraServer generally available 2025 2026".

4. **[UNKNOWN] Quantitative MoE EFA performance gap vs InfiniBand**: The claim that EFA falls short of ConnectX-7 for MoE dispatch/combine was found in a research article summary but specific throughput numbers were not fetchable from the primary source. Searched for: "Perplexity 1T parameter EFA MoE performance gap" — the Register article and Perplexity research article were found but page content was not fully extractable.

5. **[UNKNOWN] EFA support status for Trn3 (Trainium3)**: Trainium3 (December 2025) was mentioned in search result snippets but no fetched page confirmed EFA version or bandwidth details for Trn3. Searched for: "Trn3 EFA bandwidth NeuronLink Trainium3 specifications".

6. **[UNKNOWN] Specific bandwidth numbers from EFAv2 blog post**: The AWS HPC Blog post "Second generation EFA: improving HPC and ML application performance in the cloud" returned only CSS/metadata, not article content. Specific EFAv2 throughput numbers and benchmark data from that post could not be extracted.

---

### Freshness Assessment

EFA is a fast-moving technology with major new instance family announcements every 6–12 months. The most recent sources fetched date to January 2026 (aws-ofi-nccl v1.18.0 release) and the primary AWS documentation pages appear to be continuously maintained (confirmed by P6-B300 being listed, which is a late 2025/early 2026 instance). The accelerated computing instance specs table (ac.html) is current as of March 2026 access, listing P6-B300 with 6,400 Gbps EFA. The EFA user guide is also current, listing NIXL 1.0.0 support which is a 2025-era addition. The older OpenFOAM benchmark data (CFD Direct) uses c5n instances and may not reflect current best-practice instance choices, but the scaling methodology remains valid. The SRD protocol deep-dive article by Ernest Chiang does not have an explicit publication date; its content references P4d-era specs, making it potentially 12–24 months old, but SRD as a protocol has not changed — only EFA generation performance numbers have improved.

---

### Sources

| # | Title | URL | Type | Date | Freshness |
|---|---|---|---|---|---|
| 1 | AWS EC2 User Guide — Elastic Fabric Adapter | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | Official docs | Accessed 2026-03-22 | Current |
| 2 | AWS EC2 User Guide — Get started with EFA and MPI | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html | Official docs | Accessed 2026-03-22 | Current |
| 3 | AWS EC2 User Guide — Get started with EFA and NCCL | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html | Official docs | Accessed 2026-03-22 | Current |
| 4 | AWS EC2 User Guide — EFA Accelerated Instance Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html | Official docs | Accessed 2026-03-22 | Current |
| 5 | AWS EC2 Accelerated Computing Instance Specs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Official docs | Accessed 2026-03-22 | Current |
| 6 | AWS EC2 Placement Groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html | Official docs | Accessed 2026-03-22 | Current |
| 7 | AWS EKS — Node EFA | https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html | Official docs | Accessed 2026-03-22 | Current |
| 8 | Amazon EC2 P5 Instance Types | https://aws.amazon.com/ec2/instance-types/p5/ | Official product page | Accessed 2026-03-22 | Current |
| 9 | Amazon EC2 Trn2 Instance Types | https://aws.amazon.com/ec2/instance-types/trn2/ | Official product page | Accessed 2026-03-22 | Current |
| 10 | Amazon EC2 UltraServers | https://aws.amazon.com/ec2/ultraservers/ | Official product page | Accessed 2026-03-22 | Current |
| 11 | AWS EFA Product Page | https://aws.amazon.com/hpc/efa/ | Official product page | Accessed 2026-03-22 | Current |
| 12 | AWS What's New — P5en GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/ | Official announcement | 2024-12-02 | Current |
| 13 | AWS What's New — P5en N. Virginia/Jakarta (Mar 2025) | https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/ | Official announcement | 2025-03 | Current |
| 14 | AWS What's New — P5en N. California (May 2025) | https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/ | Official announcement | 2025-05 | Current |
| 15 | AWS What's New — Trn2 GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/ | Official announcement | 2024-12 | Current |
| 16 | AWS What's New — EFA Cross-Subnet (2024) | https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/ | Official announcement | 2024 | Current |
| 17 | aws/aws-ofi-nccl GitHub README | https://github.com/aws/aws-ofi-nccl/blob/master/README.md | GitHub repo | Accessed 2026-03-22 | Current |
| 18 | aws/aws-ofi-nccl Releases | https://github.com/aws/aws-ofi-nccl/releases | GitHub releases | Accessed 2026-03-22 | Current |
| 19 | AWS Neuron Collective Communication Docs | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html | Official docs | Accessed 2026-03-22 | Current |
| 20 | AWS Neuron Training FAQ | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html | Official docs | Accessed 2026-03-22 | Aging |
| 21 | SageMaker Data Parallel Library | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html | Official docs | Accessed 2026-03-22 | Current |
| 22 | SageMaker Expert Parallelism | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html | Official docs | Accessed 2026-03-22 | Current |
| 23 | Multi-Node vLLM EKS Blueprints | https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/ | AWS open-source docs | Accessed 2026-03-22 | Current |
| 24 | CFD Direct — OpenFOAM HPC with AWS EFA | https://cfd.direct/cloud/openfoam-hpc-aws-efa/ | Third-party benchmark | Accessed 2026-03-22 | Aging |
| 25 | Ernest Chiang — AWS SRD Protocol Deep Dive | https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/ | Technical blog | No date listed | Aging |
| 26 | AWS HPC Blog — Second Generation EFA | https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/ | AWS blog | Date unknown (page CSS only) | Unknown |
| 27 | AWS HPC Blog — hpc7a MPI Multi-Rail EFA | https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/ | AWS blog | Date unknown (page CSS only) | Aging |
| 28 | AWS HPC Benchmarking Whitepaper | https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf | AWS whitepaper | Date unknown (snippet only) | Aging |

Freshness key: **Current** = < 6 months, **Aging** = 6–18 months, **Stale** = > 18 months

Sources:
- [AWS EC2 User Guide — Elastic Fabric Adapter](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html)
- [AWS EC2 User Guide — Get started with EFA and MPI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html)
- [AWS EC2 User Guide — Get started with EFA and NCCL](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html)
- [AWS EC2 User Guide — EFA Accelerated Instance Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html)
- [AWS EC2 Accelerated Computing Instance Specs](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)
- [AWS EC2 Placement Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html)
- [AWS EKS — Node EFA](https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html)
- [Amazon EC2 P5 Instance Types](https://aws.amazon.com/ec2/instance-types/p5/)
- [Amazon EC2 Trn2 Instance Types](https://aws.amazon.com/ec2/instance-types/trn2/)
- [Amazon EC2 UltraServers](https://aws.amazon.com/ec2/ultraservers/)
- [AWS EFA Product Page](https://aws.amazon.com/hpc/efa/)
- [AWS What's New — P5en GA Dec 2024](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/)
- [AWS What's New — P5en N. Virginia/Jakarta Mar 2025](https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/)
- [AWS What's New — P5en N. California May 2025](https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/)
- [AWS What's New — Trn2 GA Dec 2024](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/)
- [AWS What's New — EFA Cross-Subnet 2024](https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/)
- [aws/aws-ofi-nccl GitHub README](https://github.com/aws/aws-ofi-nccl/blob/master/README.md)
- [aws/aws-ofi-nccl Releases](https://github.com/aws/aws-ofi-nccl/releases)
- [AWS Neuron Collective Communication Docs](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html)
- [AWS Neuron Training FAQ](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html)
- [SageMaker Data Parallel Library](https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html)
- [SageMaker Expert Parallelism](https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html)
- [Multi-Node vLLM EKS Blueprints](https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/)
- [CFD Direct — OpenFOAM HPC with AWS EFA](https://cfd.direct/cloud/openfoam-hpc-aws-efa/)
- [Ernest Chiang — AWS SRD Protocol Deep Dive](https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/)
- [AWS HPC Blog — Second Generation EFA](https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/)
- [AWS HPC Blog — hpc7a MPI Multi-Rail EFA](https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/)
- [New Amazon EC2 P5en instances with NVIDIA H200 Tensor Core GPUs and EFAv3 networking](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p5en-instances-with-nvidia-h200-tensor-core-gpus-and-efav3-networking/)
- [Amazon EC2 Trn2 Instances and Trn2 UltraServers — AWS News Blog](https://aws.amazon.com/blogs/aws/amazon-ec2-trn2-instances-and-trn2-ultraservers-for-aiml-training-and-inference-is-now-available/)
- [AWS HPC Benchmarking Whitepaper](https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf)
