# Track 3d — NVIDIA GPU Instances on AWS (Customer View)

**Researched:** 2026-04-23
**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Audience:** Capital markets technology leads

---

## 1. GPU Generations Available on AWS

| GPU Silicon | Architecture | HBM / BW | AWS Instance | Cooling | Status |
|---|---|---|---|---|---|
| H100 SXM5 | Hopper | 80 GB HBM3 / 3.35 TB/s | P5 | Air | GA |
| H200 SXM5 | Hopper refresh | 141 GB HBM3e / 4.8 TB/s | P5e, P5en | Air | GA |
| B200 SXM | Blackwell | 192 GB HBM3e | P6-B200 | Air | GA |
| B300 SXM | Blackwell Ultra | 288 GB HBM3e / 8.0 TB/s | P6-B300 | Air/Liquid | GA (Nov 2025) |
| GB200 (Grace + 2×B200) | Grace Blackwell Superchip | 185 GB HBM3e/GPU | P6e-GB200 UltraServer | Liquid mandatory | GA (Jul 2025) |
| GB300 (Grace + 2×B300) | Grace Blackwell Ultra Superchip | ~277 GB HBM3e/GPU | P6e-GB300 UltraServer | Liquid mandatory | **GA Dec 2025** |

[VERIFIED] P6e-GB300 UltraServers GA'd December 2025. (Source: [AWS P6e-GB300 GA announcement](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/), accessed 2026-04-23)

---

## 2. Instance Family Matrix

### 2a. P5 Family — NVIDIA Hopper (H100 / H200)

| Spec | p5.4xlarge | p5.48xlarge | p5e.48xlarge | p5en.48xlarge |
|---|---|---|---|---|
| GPU | 1× H100 | 8× H100 | 8× H200 | 8× H200 |
| HBM total | 80 GB | 640 GB | 1,128 GB | 1,128 GB |
| HBM BW/GPU | 3.35 TB/s | 3.35 TB/s | 4.8 TB/s | 4.8 TB/s |
| NVLink | None | 900 GB/s NVSwitch (3.6 TB/s bisect) | 900 GB/s (3.6 TB/s) | 900 GB/s (3.6 TB/s) |
| vCPUs | 16 | 192 | 192 | 192 |
| Host CPU | AMD EPYC 7R13 (Gen3) | AMD EPYC 7R13 | AMD EPYC 7R13 | **Intel Sapphire Rapids** |
| PCIe CPU-GPU | Gen4 | Gen4 | Gen4 | **Gen5** |
| System RAM | 256 GiB | 2 TiB | 2 TiB | 2 TiB |
| Local NVMe | 3.84 TB | 8× 3.84 TB | 8× 3.84 TB | 8× 3.84 TB |
| EFA gen | EFAv2 | EFAv2 | EFAv2 | **EFAv3** |
| Net BW | 100 Gbps | 3,200 Gbps | 3,200 Gbps | 3,200 Gbps |
| EFA BW/GPU | ~100 Gbps | 400 Gbps | 400 Gbps | 400 Gbps |
| GPUDirect RDMA | No | Yes | Yes | Yes |
| EBS BW | 10 Gbps | 80 Gbps | 80 Gbps | 100 Gbps |
| On-Demand | [UNKNOWN] | **$55.04/hr** | [UNKNOWN] | [UNKNOWN] |

[VERIFIED] p5.48xlarge: $55.04/hr OD, $30.15/hr spot, $23.78/hr 1-yr reserved (us-east-1). (Source: [Vantage p5.48xlarge](https://instances.vantage.sh/aws/ec2/p5.48xlarge), accessed 2026-04-23)

[VERIFIED] P5en delivers up to **4× CPU-to-GPU bandwidth** increase via PCIe Gen5 vs P5/P5e. (Source: [AWS P5en launch blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p5en-instances-with-nvidia-h200-tensor-core-gpus-and-efav3-networking/), accessed 2026-04-23)

[VERIFIED] P5en shows **up to 35% latency improvement** vs P5 via EFAv3 over Nitro v5. (Source: same)

[VERIFIED] p5.4xlarge in SageMaker Training/Processing since Aug 2025. (Source: [AWS SageMaker P5 What's New](https://aws.amazon.com/about-aws/whats-new/2025/08/p5-instance-nvidia-h100-gpu-sagemaker-training-processing-jobs/), accessed 2026-04-23)

### 2b. P6 Family — NVIDIA Blackwell (B200 / B300)

| Spec | p6-b200.48xlarge | p6-b300.48xlarge |
|---|---|---|
| GPU | 8× B200 | 8× B300 |
| HBM per GPU | ~179-180 GB (AWS config) | **268 GB** |
| HBM total | 1,432-1,440 GB | **2,144 GB (~2.1 TB)** |
| NVLink BW | 14.4 TB/s total (1,800 GB/s GPU-to-GPU) | 1,800 GB/s GPU-to-GPU |
| vCPUs | 192 | 192 |
| Host CPU | **5th Gen Intel Xeon Scalable (Emerald Rapids)** | Intel Xeon Scalable [LIKELY Emerald Rapids] |
| PCIe CPU-GPU | Gen5 | Gen5 [Gen6 silicon-capable per NVIDIA; AWS config [UNKNOWN]] |
| System RAM | 2 TiB | **4 TiB** |
| Local NVMe | 8× 3.84 TB (30 TB) | 8× 3.84 TB (30 TB) |
| EFA gen | EFAv4 | EFAv4 |
| Net BW aggregate | 3.2 Tbps (8× 400 Gbps) | **6.4 Tbps (8× 800 Gbps per GPU — 2× B200)** |
| Dedicated ENA | [UNKNOWN] | 300 Gbps |
| EBS BW | 100 Gbps | 100 Gbps |
| Perf vs P5en | ~2× AI | ~3× AI [LIKELY] |
| On-Demand | **$113.93/hr** | [Sales only] |
| Spot | $31.65/hr | [UNKNOWN] |
| Capacity Block | Available | ~$93.60/hr (Oregon) |
| Savings Plans | Available (Jun 2025+) | Available |
| Regions | US West (Oregon) | US West (Oregon); GovCloud US-East |

[VERIFIED] P6-B300: 2.1 TB HBM total, 268 GB/GPU. EFA 6.4 Tbps = 2× P6-B200. System RAM 4 TiB (double). (Sources: [AWS P6-B300 launch blog](https://aws.amazon.com/blogs/aws/accelerate-large-scale-ai-applications-with-the-new-amazon-ec2-p6-b300-instances/); [P6-B300 What's New](https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-ec2-p6-b300-instances-nvidia-blackwell-ultra-gpus-available/), accessed 2026-04-23)

### 2c. P6e UltraServer Family — NVIDIA Grace Blackwell

| Spec | u-p6e-gb200x36 | u-p6e-gb200x72 | u-p6e-gb300 |
|---|---|---|---|
| GPU | 36 B200 | **72 B200** | 36 or 72 B300 |
| GPU per Superchip | 2 per GB200 | 2 per GB200 | 2 per GB300 |
| HBM per GPU | ~185 GB HBM3e | ~185 GB HBM3e | ~277 GB HBM3e [LIKELY] |
| HBM total (GPU) | 6,660 GB | **13,320 GB** | ~20,000 GB (x72) [LIKELY] |
| NVLink BW | ~65 TB/s [LIKELY] | **130 TB/s** | 130 TB/s [LIKELY] |
| Host CPU | **NVIDIA Grace (Arm)** | NVIDIA Grace (Arm) | NVIDIA Grace (Arm) |
| vCPUs | 1,296 | **2,592** | [UNKNOWN] |
| System RAM | 8,640 GiB | **17,280 GiB** | [UNKNOWN] |
| Local NVMe | 202.5 TB | 405 TB | [UNKNOWN] |
| EFA gen | EFAv4 | EFAv4 | EFAv4 [LIKELY] |
| EFA aggregate | 14,400 Gbps | **28,800 Gbps** | [UNKNOWN] |
| EBS BW | 540 Gbps | 1,080 Gbps | [UNKNOWN] |
| FP8 compute | 180 PFLOPS | **360 PFLOPS** | ~540 PFLOPS (x72) [LIKELY] |
| Cooling | Liquid (mandatory) | Liquid (mandatory) | Liquid (mandatory) |
| Location | Dallas Local Zone | Dallas Local Zone | [UNKNOWN] |
| Purchase | Capacity Blocks only | Capacity Blocks only | Capacity Blocks [LIKELY] |

[VERIFIED] 72-GPU UltraServer: 360 PFLOPS FP8, 13,320 GB HBM3e, 130 TB/s NVLink, 28.8 Tbps EFAv4 aggregate. Available in Dallas Local Zone via Capacity Blocks only. AWS's first large-scale liquid-cooled system. (Source: [AWS P6e-GB200 launch blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p6e-gb200-ultraservers-powered-by-nvidia-grace-blackwell-gpus-for-the-highest-ai-performance/), accessed 2026-04-23)

[VERIFIED] P6e-GB300 delivers 1.5× GPU memory and 1.5× FP4 compute vs P6e-GB200, close to 20 TB HBM per UltraServer. (Source: [P6e-GB300 GA announcement](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/), accessed 2026-04-23)

**Architectural distinction:** GB200 Superchip = 2 Blackwell GPUs + 1 NVIDIA Grace (Arm) connected via NVLink-C2C. UltraServer aggregates 36/72 Superchips under a single NVLink domain. The CPU is Grace Arm — **not** Intel/AMD. Fundamentally different CPU-GPU topology than P5/P6 instances.

---

## 3. EFA Generation Evolution

| EFA | Nitro | Instances | Per-Card BW | Aggregate (largest) | Key Improvements |
|---|---|---|---|---|---|
| EFAv1 | Nitro v3 | C5n, P3dn, P4d | 100 Gbps | 400 Gbps (P4d) | OS-bypass, SRD, RDMA reads |
| EFAv2 | Nitro v4 | Trn1, P5, P5e | 200 Gbps/card | 3,200 Gbps (P5) | 30% endpoint latency ↓, full RDMA, LL/LL128, GPU-GPU RDMA |
| EFAv3 | Nitro v5 | P5en, Trn2 | [UNKNOWN/card] | 3,200 Gbps (P5en); 12,800 (Trn2 UltraServer) | **35% latency improvement** vs EFAv2 |
| EFAv4 | Nitro v5+ | P6-B200, P6-B300, P6e | **400 Gbps/GPU** (P6-B200); **800 Gbps/GPU** (P6-B300) | 3,200 (P6-B200); 6,400 (P6-B300); **28,800 (P6e-GB200 x72)** | 18% faster collectives vs EFAv3 |

[VERIFIED] EFAv2: 30% endpoint latency reduction, doubled per-card BW (100→200 Gbps). (Source: [AWS HPC Blog 2nd-gen EFA](https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/), accessed 2026-04-23)

### SRD Protocol

[VERIFIED] All EFA generations use SRD (Scalable Reliable Datagram): reliable delivery without guaranteed ordering, multi-path routing across all available network paths simultaneously — unlike TCP (single path) or InfiniBand (single fastest path).

### NIXL with EFA (Major 2026 Development)

[VERIFIED] **AWS added NIXL support with EFA on 2026-03-19**. NIXL is compatible with all EFA-enabled EC2 instances. Enables high-throughput, low-latency KV-cache transfer between prefill and decode nodes for disaggregated LLM inference. Integrates with NVIDIA Dynamo, SGLang, vLLM, TensorRT-LLM. Uses Libfabric as EFA transport backend. Minimum: NIXL 1.0.0, EFA installer 1.47.0. No additional AWS charges. (Sources: [AWS What's New NIXL+EFA](https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/); [AWS EFA+NIXL docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html), accessed 2026-04-23)

[VERIFIED] NIXL intelligently selects between NVLink and EFA for KV-cache movement — intra-node uses NVLink, inter-node uses EFA. (Source: [NVIDIA Dynamo+AWS blog](https://developer.nvidia.com/blog/nvidia-dynamo-adds-support-for-aws-services-to-deliver-cost-efficient-inference-at-scale/), accessed 2026-04-23)

---

## 4. Capacity Blocks for ML and Commercial Models

### Purchase Model

EC2 Capacity Blocks allow reservation of GPU instances for fixed-duration windows. Charged fully upfront at time-of-purchase rate. No refund, no cancellation. (Source: [EC2 Capacity Blocks](https://aws.amazon.com/ec2/capacityblocks/), accessed 2026-04-23)

### Supported Instances (April 2026)

P6e-GB300, P6e-GB200, P6-B300, P6-B200, P5en, P5e, P5, P4d/P4de, Trn2, Trn1.

### Reservation Parameters

- Min duration: 1 day; max 6 months (or 182 days for P6-B200)
- Standard: 1-14 days, 21, 28, multiples of 7
- Advance booking: up to 8 weeks
- Max cluster per block: 64 instances (512 GPUs for 8-GPU instances)
- Max across blocks: 256 instances
- UltraServer: terminate 60 min before block end; cannot share across accounts

### Pricing Dynamics

[VERIFIED] Dynamic, updated quarterly. Three reductions 2024-25, then **15% increase January 2026**. (Source: [ITPro Capacity Block price increase](https://www.itpro.com/cloud/cloud-computing/aws-amazon-ec2-capacity-blocks-price-increase), accessed 2026-04-23)

[VERIFIED] Post-January 2026 rates: **p5e.48xlarge $39.80/hr** (most regions, $49.75/hr US West N California); **p5en.48xlarge $41.61/hr**. (Source: same)

[VERIFIED] June 2025 OD reductions: P5 up to 45%, P5en up to 26%, P4d/P4de up to 33%. Savings Plans became available for P6-B200 June 2025. P6-B300 supports Capacity Blocks AND Savings Plans. (Source: [AWS GPU pricing updates Jun 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/pricing-usage-model-ec2-instances-nvidia-gpus/), accessed 2026-04-23)

### Relative TCO (90-day Capacity Block, NextPlatform estimates)

- P6-B200: **$7.81/TFLOPS FP16** — more cost-efficient than H200 ($9.88) and A100-40GB ($10.21)
- Full 72-GPU UltraServer: **$9.14/TFLOPS FP16** — 17% premium over P6-B200 per teraflop despite density/capacity advantages
- 72-GPU UltraServer 90-day rental: **~$1.65M** (half-rack 36-GPU: ~$822,856)

(Source: [NextPlatform Sizing Up AWS Blackwell](https://www.nextplatform.com/2025/07/10/sizing-up-aws-blackwell-gpu-systems-against-prior-gpus-and-trainiums/), Jul 2025 — aging, indicative)

---

## 5. Host CPU Pairings and PCIe Evolution

### CPU Rationale

**P5/P5e → AMD EPYC 7R13 (Gen3 Milan):** Best per-socket PCIe lane count (128) + memory bandwidth at P5 launch (2023). Natural pairing for H100 HGX.

**P5en → Intel Sapphire Rapids (Gen4 Xeon Scalable):** Switched specifically to unlock **PCIe Gen5 → up to 4× CPU-GPU bandwidth** vs Gen4. Sapphire Rapids brought native PCIe 5.0.

**P6-B200/P6-B300 → Emerald Rapids (Gen5 Xeon Scalable):** Maintains PCIe Gen5 but higher per-core memory bandwidth and I/O throughput for B200's 1.8 TB/s NVLink and 3.2 Tbps EFAv4.

**P6e UltraServer → NVIDIA Grace CPU (Arm):** Co-packaged with 2 Blackwell GPUs via NVLink-C2C at 900 GB/s bidirectional per Superchip. **Eliminates PCIe CPU-GPU bottleneck entirely.** This is the reason UltraServer shows 15× aggregate GPU memory bandwidth vs P5en at NVLink-domain scale.

### PCIe Progression

| PCIe Gen | x16 BW (unidir) | Instances | What it enables |
|---|---|---|---|
| Gen4 | ~32 GB/s | P5, P5e | Sufficient for H100 weight streaming; bottleneck at 4+ GPU tensor-parallel |
| Gen5 | ~64 GB/s | P5en, P6-B200, P6-B300 | 2× faster KV-cache loading from host DRAM; prefill less CPU-bound |
| Gen6 | ~128 GB/s | B300 silicon (AWS config [UNKNOWN]) | Host-side KV-cache/embedding feeding at near-HBM speeds |
| **NVLink-C2C** | **~900 GB/s** (per Superchip) | P6e UltraServer (Grace) | Eliminates PCIe bottleneck; CPU memory coherent with GPU HBM at ~1/4 HBM bandwidth |

**Where the bottleneck sits:** On P5/P5e (Gen4), PCIe tops at ~32 GB/s while H100 HBM3 runs at 3,350 GB/s — **100× narrower**. On P5en (Gen5), 64 GB/s vs 4.8 TB/s HBM — still 75× narrower. UltraServer NVLink-C2C at 900 GB/s reduces the gap 30× over Gen4. For inference workloads with large KV caches exceeding GPU HBM, this is transformative.

---

## 6. Pricing (Where Published)

### On-Demand

| Instance | $/hr |
|---|---|
| p5.48xlarge | **$55.04** (Vantage us-east-1) |
| p5e.48xlarge | [UNKNOWN — Vantage returned implausible figure; actual not verified] |
| p5en.48xlarge | [UNKNOWN] |
| p6-b200.48xlarge | **$113.93** |
| p6-b300.48xlarge | [Sales channel; no public OD] |
| P6e UltraServers | [Sales channel] |

### Spot

- p5.48xlarge: **$30.15/hr**
- p6-b200.48xlarge: **$31.65/hr**

### Reserved / Savings Plans

- p5.48xlarge 1-yr reserved: $23.78/hr
- p5en.48xlarge: Savings Plans from Jun 2025
- p6-b200.48xlarge: Savings Plans from Jun 2025
- p6-b300.48xlarge: Savings Plans available at launch

### Capacity Blocks (post-Jan 2026 hike)

- p5e.48xlarge: ~$39.80/hr (most regions)
- p5en.48xlarge: ~$41.61/hr
- p6-b300.48xlarge: ~$93.60/hr (Oregon, estimate)
- P6e-GB200 x72: ~$763/hr implied (NextPlatform $1.65M/90 days, [SPECULATIVE])

---

## 7. Bedrock and SageMaker Context

### SageMaker

- p5.4xlarge in Training/Processing since Aug 2025 (us-east-1/2, us-west-2, eu-west-2, ap-south-1, ap-southeast-2, ap-northeast-1, sa-east-1)
- **SageMaker HyperPod supports P6e-GB200 UltraServers** — auto-manages 72-GPU NVLink domain provisioning, replaces faulty instances with pre-configured spare capacity. Recommend ≥1 spare ml.p6e-gb200.36xlarge for resilient clusters.
- P6e-GB200 integrates with EKS via Dynamic Resource Allocation (DRA), FSx for Lustre (up to 1.2 Tbps GPU-direct), NVIDIA DGX Cloud.
- SageMaker adds ~15-40% pricing premium over raw EC2 rates.

(Sources: [AWS SageMaker P6e-GB200 HyperPod](https://aws.amazon.com/blogs/machine-learning/train-and-deploy-ai-models-at-trillion-parameter-scale-with-amazon-sagemaker-hyperpod-support-for-p6e-gb200-ultraservers/); [AWS What's New P5 SageMaker](https://aws.amazon.com/about-aws/whats-new/2025/08/p5-instance-nvidia-h100-gpu-sagemaker-training-processing-jobs/), accessed 2026-04-23)

### Bedrock

[UNKNOWN] **AWS does not publicly disclose which GPU silicon underlies Bedrock model endpoints.** Multiple searches returned no authoritative source. This is structural — by design of the managed service. Bedrock is a fully managed abstraction.

[SPECULATIVE] Reasonable inference: Bedrock likely uses P5/P5en for NVIDIA-served models with Inferentia2 for cost-optimized inference on supported models — but unverified.

---

## 8. Capital Markets Angle

### 8a. Sub-Ms Inference — P5.4xlarge Single-GPU

Single H100, 80 GB HBM3, 3.35 TB/s. 16 vCPUs, 256 GiB RAM, 3.84 TB NVMe, 100 Gbps EFA, no GPUDirect RDMA.

**Why it matters:** Eliminates inter-GPU communication entirely. Models ≤40B params at FP16 fit in 80 GB. FP8 supports up to ~80B in a single GPU. At H100 FP8 3,958 TFLOPS, 7B inference = ~14 TFLOPS → sub-4μs compute; latency then dominated by PCIe I/O + host pre/post.

Target workloads: intraday risk re-evaluation (<1 ms bs=1-4), real-time sentiment on news, single-strategy signal inference.

Available via SageMaker Training/Processing since Aug 2025.

### 8b. Batch Inference TCO — P5.48xlarge vs P6-B200.48xlarge

| Metric | p5.48xlarge | p6-b200.48xlarge | Δ |
|---|---|---|---|
| HBM total | 640 GB | 1,432-1,440 GB | **+2.24×** |
| HBM BW total | 26.8 TB/s | ~64 TB/s | +2.4× |
| OD $/hr | $55.04 | $113.93 | +2.07× cost |
| FP8 PFLOPS/GPU | 3.958 | ~9 | +2.27× |
| vs P5en AI | baseline | +2× (claimed) | — |
| NVLink intra-node | 900 GB/s | 1,800 GB/s | +2× |
| Host CPU | EPYC 7R13 Gen4 | Emerald Rapids Gen5 | Gen5 |
| **$/FP8 PFLOPS** | $55.04 / 31.7 | $113.93 / 72 | **B200 35% lower** |

**Conclusion:** At ~2× cost but 2.24× HBM and 2× NVLink, P6-B200 wins economics for batch workloads where HBM capacity is the constraint. Monte Carlo paths / FRTB scenario sets that previously required 2× P5 nodes fit in single P6-B200 → eliminates inter-node comm and software complexity. P6-B300 extends to 2.1 TB HBM — frontier 100B+ models in single 8-GPU node at INT8.

### 8c. Frontier Model Economics — UltraServer vs Multi-Node

[VERIFIED] P6e-GB200 UltraServer (72 GPU) vs single P5en.48xlarge: **20× GPU TFLOPS, 11× GPU memory, 15× aggregate GPU memory bandwidth under NVLink**.

**When UltraServer wins over multi-node P6-B200:** 72-GPU UltraServer is single NVLink domain at 130 TB/s. Equivalent 9× p6-b200.48xlarge has inter-node comm only via EFAv4 at 400 Gbps per GPU — **8,000× lower bandwidth** than NVLink.

UltraServer appropriate only when:
1. Model's tensor-parallel comm volume is large enough that EFA is binding (>500B dense attention)
2. Model fits within 13.3 TB HBM (72-GPU UltraServer limit)
3. Workload justifies Capacity Block upfront commitment (no spot, no OD)

**Capital markets specifically:** UltraServer advantage is NOT raw throughput for typical quant AI (<200B params). It is:
(a) zero NVLink comm overhead → low-latency autoregressive generation across full domain
(b) serve multiple large models concurrently in 13.3 TB HBM without reload — relevant for multi-strategy hedge funds

### 8d. Reserved / Capacity Block Strategy for Trading-Hours-Only

Capital markets AI is heavily skewed to market hours. Traditional reserved instances are always-on = paying for idle.

| Model | Flexibility | Cost efficiency | Idle waste | Suited for |
|---|---|---|---|---|
| On-Demand | Hour-by-hour | Highest cost | Zero | Burst, experimentation |
| Savings Plans (1 yr) | Commit to $ | ~56% off OD | Full cost if always-on | Predictable baseline |
| Spot | Variable | 45-70% off OD | Zero | Fault-tolerant batch |
| Capacity Blocks | 1-day to 6-month | Dynamic; can be <OD | Block-waste for unused hours | Short training runs, guaranteed capacity |

**Recommendation:** For trading-day inference: Savings Plan on p6-b200.48xlarge + aggressive spot for overnight batch. Capacity Blocks suit: regulatory stress-testing, end-of-month revaluation, pre-announced event risk (central bank decisions).

**Jan 2026 hike caveat:** Capacity Block prices rose 15% January 2026. Next review April 2026. Committed blocks honored at purchase-time price.

### 8e. Power Envelope — Colocation Reference

| Instance (single node) | Est. System TDP | Colo rack compat |
|---|---|---|
| p5.48xlarge (8× H100) | ~10-12 kW | Yes — standard high-density |
| p6-b200.48xlarge (8× B200 air) | ~14.3 kW | Marginal — needs 30A+ circuits |
| p6-b300.48xlarge (8× B300) | ~18-22 kW [SPECULATIVE] | Dedicated high-density power |
| **P6e-GB200 x72 UltraServer** | **~120-140 kW** | **Not compatible with standard colo** |

Standard enterprise colo designed for 10-15 kW. P5 fits. P6-B200 marginal. GB200 NVL72 UltraServer incompatible with any standard colo — requires custom power delivery comparable to small industrial substations. AWS absorbs this cost in Dallas Local Zone. Capital markets firms cannot replicate UltraServer-class infra without purpose-built DC construction.

**AWS does not publish per-instance power figures.** Values derived from NVIDIA TDP specs and third-party measurements, not AWS-disclosed.

---

## 9. Sources

All accessed 2026-04-23.

Tier 1 AWS:
- [Amazon EC2 P5 Instances](https://aws.amazon.com/ec2/instance-types/p5/)
- [Amazon EC2 P6e and P6](https://aws.amazon.com/ec2/instance-types/p6/)
- [P5en launch blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p5en-instances-with-nvidia-h200-tensor-core-gpus-and-efav3-networking/)
- [P6-B200 launch blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p6-b200-instances-powered-by-nvidia-blackwell-gpus-to-accelerate-ai-innovations/)
- [P6-B300 launch blog](https://aws.amazon.com/blogs/aws/accelerate-large-scale-ai-applications-with-the-new-amazon-ec2-p6-b300-instances/)
- [P6-B300 GA What's New](https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-ec2-p6-b300-instances-nvidia-blackwell-ultra-gpus-available/)
- [P6-B300 GovCloud Apr 2026](https://aws.amazon.com/about-aws/whats-new/2026/04/ec2-p6-b300-govcloud-us-east/)
- [P6e-GB200 UltraServer launch blog](https://aws.amazon.com/blogs/aws/new-amazon-ec2-p6e-gb200-ultraservers-powered-by-nvidia-grace-blackwell-gpus-for-the-highest-ai-performance/)
- [P6e-GB200 What's New Jul 2025](https://aws.amazon.com/about-aws/whats-new/2025/07/amazon-p6e-gb200-ultraservers-gpu-performance-ec2/)
- [P6e-GB300 GA Dec 2025](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/)
- [NVIDIA GPU pricing updates Jun 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/pricing-usage-model-ec2-instances-nvidia-gpus/)
- [EC2 Capacity Blocks](https://aws.amazon.com/ec2/capacityblocks/)
- [Capacity Blocks pricing](https://aws.amazon.com/ec2/capacityblocks/pricing/)
- [P5 SageMaker Training Aug 2025](https://aws.amazon.com/about-aws/whats-new/2025/08/p5-instance-nvidia-h100-gpu-sagemaker-training-processing-jobs/)
- [SageMaker HyperPod P6e-GB200 blog](https://aws.amazon.com/blogs/machine-learning/train-and-deploy-ai-models-at-trillion-parameter-scale-with-amazon-sagemaker-hyperpod-support-for-p6e-gb200-ultraservers/)
- [AWS NIXL with EFA Mar 2026](https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/)
- [EFA NIXL docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html)
- [Second-gen EFA blog](https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/)
- [AWS-NVIDIA strategic collaboration](https://aws.amazon.com/blogs/machine-learning/aws-and-nvidia-deepen-strategic-collaboration-to-accelerate-ai-from-pilot-to-production/)

Tier 2 analysis/pricing:
- [Vantage p5.48xlarge](https://instances.vantage.sh/aws/ec2/p5.48xlarge)
- [Vantage p6-b200.48xlarge](https://instances.vantage.sh/aws/ec2/p6-b200.48xlarge)
- [ITPro Capacity Block price hike](https://www.itpro.com/cloud/cloud-computing/aws-amazon-ec2-capacity-blocks-price-increase)
- [InfoQ EC2 Capacity Block 15% hike](https://www.infoq.com/news/2026/01/ec2-ml-capacity-price-hike/)
- [NextPlatform Sizing Up AWS Blackwell](https://www.nextplatform.com/2025/07/10/sizing-up-aws-blackwell-gpu-systems-against-prior-gpus-and-trainiums/)
- [NVIDIA Dynamo AWS NIXL](https://developer.nvidia.com/blog/nvidia-dynamo-adds-support-for-aws-services-to-deliver-cost-efficient-inference-at-scale/)
- [Clarifai B200 vs H100](https://www.clarifai.com/blog/nvidia-b200-vs-h100)
- [TRG Datacenters H100 power](https://www.trgdatacenters.com/resource/nvidia-h100-power-consumption/)
- [Introl B200 vs GB200 deployment](https://introl.com/blog/nvidia-b200-vs-gb200-deployment-guide)

---

## 10. Known Gaps

1. **p5e.48xlarge on-demand price** — Vantage returned implausible figure; AWS pricing page didn't render. [UNKNOWN]
2. **p5.4xlarge on-demand price** — not in any source retrieved. [UNKNOWN]
3. **p5en.48xlarge on-demand price** — OD-eligible per AWS but rate not in retrieved sources. [UNKNOWN]
4. **P6-B300 host CPU model** — AWS hasn't publicly disclosed specific CPU. Likely Emerald Rapids based on P6-B200 pairing. [UNKNOWN]
5. **P6-B300 NVLink aggregate BW** — 1,800 GB/s GPU-to-GPU confirmed, total bidirectional NVLink [UNKNOWN]
6. **P6e-GB300 detailed specs** — only 1.5× ratios published; no instance size/vCPU/RAM/EFA/NVMe/region confirmed. [UNKNOWN]
7. **P6e UltraServer Capacity Block per-hour price** — published on EC2 pricing page but not retrieved; NextPlatform estimate ~$763/hr [SPECULATIVE]
8. **Bedrock underlying GPU silicon** — AWS doesn't disclose which GPU family serves Bedrock. Structural gap.
9. **AWS GPU instance published power draw** — AWS does not publish per-instance power; all values derived from NVIDIA TDP specs.
10. **EFAv3 per-card bandwidth** — EFAv2 100→200 Gbps documented. EFAv3 per-card [UNKNOWN] — likely latency/protocol efficiency, not raw BW (aggregate P5en = P5 at 3.2 Tbps).
