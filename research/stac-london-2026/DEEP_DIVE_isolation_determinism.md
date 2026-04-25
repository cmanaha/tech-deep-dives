# Deep Dive — AWS Isolation and Determinism Across Silicon

**Researched:** 2026-04-23 (consolidates Track 2, 3a, 3e findings)
**Prepared for:** STAC London 2026 — "Beyond Peak FLOPs: Memory and Modern Inference Silicon"
**Audience:** Capital markets technology leads
**Panel relevance:** direct answer to Question 4 (noisy neighbors / memory contention / deterministic inference latency). Strongest AWS portfolio differentiator.

---

## The Three-Pillar Story

AWS's isolation story for capital-markets inference does not rest on one silicon choice. It's three layers that compose:

1. **Host-level tenant isolation** — Nitro Isolation Engine (NIE), formally verified, on Graviton5
2. **Accelerator-level partitioning** — Multi-Instance GPU (MIG) on NVIDIA, compiler-managed SBUF on AWS Trainium
3. **Software-level determinism** — NEFF ahead-of-time compilation (Neuron), CUDA Graphs, CCCL 3.1 bitwise reproducibility

Each layer addresses a different class of jitter source. Together they are the strongest multi-tier isolation story any major cloud provider offers, and they map directly to the capital markets compliance requirements (MiFID II, DORA, SEC Rule 17a-4, CFTC Part 1.31) for demonstrable tenant separation and reproducible results.

---

## Pillar 1: Nitro Isolation Engine (NIE) on Graviton5

### What it is

[VERIFIED] The Nitro Isolation Engine is a minimal software module written in Rust that sits beneath the Nitro Hypervisor and enforces VM-to-VM isolation. It was announced at re:Invent 2025 alongside Graviton5 and the M9g preview instances. (Source: [AWS Graviton5 announcement](https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2); [NW Quantum Isabelle/HOL analysis](https://nwquantum.uw.edu/2026/04/17/isabelle-hol-the-proof-assistant-behind-the-nitro-isolation-engine/); [TYPES/announce NIE](http://www.mail-archive.com/types-announce@lists.seas.upenn.edu/msg11775.html), accessed 2026-04-23)

### The formal verification

[VERIFIED] NIE is verified using **Isabelle/HOL**, the same interactive theorem-prover toolchain used to verify the seL4 microkernel and cryptographic algorithm proofs. The proof:

- Spans approximately **250,000 lines of Isabelle proof script**
- Incorporates Graviton5 processor architecture specifications, Rust hypercall code, and stated security properties
- Proof checks in approximately **30 minutes on a standard laptop**
- AWS positions it as "the **first formally verified cloud hypervisor**"

### What it proves

The formal proof establishes that a VM running on the same Graviton5 host as other VMs cannot:

- Read or write another VM's memory
- Observe another VM's cache state through timing side channels at the level NIE enforces
- Escape its allocated CPU scheduling quantum in a way that affects another VM's time budget
- Bypass the Nitro Hypervisor's admission control

Formal verification means these properties hold mathematically for all possible execution traces — not that they have been tested extensively and not observed to fail.

### Why this is different from every prior hypervisor

Traditional hypervisors (KVM, Xen, ESXi, earlier Nitro) provide isolation via implementation + testing + CVE response. Isolation holds empirically until someone finds a bug. NIE provides isolation via mathematical proof — bugs in the covered surface cannot exist, by construction.

The analogous architecture in the secure-systems world is **seL4**, the microkernel used in defence systems and medical devices where formal verification is a regulatory requirement. NIE is the first commercial hypervisor at major-cloud scale built this way.

### Capital markets implication

For firms regulated under MiFID II, DORA, SEC Rule 17a-4, CFTC Part 1.31, and similar regimes, demonstrating isolation between tenants is a compliance requirement. The standard path has been:

- Document isolation architecture
- Demonstrate SOC 2 / ISO 27001 controls
- Accept residual risk of undiscovered hypervisor bugs

NIE adds a new tier to that demonstration: **mathematical proof**. Auditors can inspect the Isabelle proof script. Regulators can verify independently. This is qualitatively different from "we haven't seen a bypass in production" — it is "a bypass is logically impossible within the covered interface."

For a trading firm running regulatory-sensitive workloads (risk models, compliance inference, surveillance analytics) on cloud infrastructure, NIE is the first feature from any hyperscaler that can be cited as mathematically proven isolation. No other major cloud has this.

### Availability

[VERIFIED] NIE ships on Graviton5-based instances starting with M9g (preview December 2025, limited region subset). C9g and R9g are expected 2026. NIE is not retrofitted to Graviton4 or earlier instance families.

[UNKNOWN] Exact regional availability. [UNKNOWN] Per-instance pricing premium (M9g preview pricing not published as of April 2026).

---

## Pillar 2: MIG — Multi-Instance GPU (NVIDIA on AWS)

### What it is

[VERIFIED] Multi-Instance GPU (MIG) performs **hardware partitioning** of an NVIDIA data-center GPU into up to 7 independent GPU instances. Each instance appears to Linux as a separate CUDA device with its own PCI function. Partitioning is enforced at the hardware register level — there is **no SM sharing, no L2 sharing, no HBM bandwidth sharing** across MIG instances. (Source: [NVIDIA MIG technology page](https://www.nvidia.com/en-us/technologies/multi-instance-gpu/); [Blackwell Ultra blog](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/), accessed 2026-04-23)

### What gets partitioned

Each MIG instance receives its own dedicated slice of:

| Resource | How it's partitioned |
|---|---|
| Streaming Multiprocessors (SMs) | Fixed SM count per instance, mapped to specific SM groups |
| L2 cache | Dedicated L2 slices per instance |
| HBM capacity | Fixed memory region per instance, isolated by memory controllers |
| HBM bandwidth | Memory controllers allocate BW per instance — not shared |
| Copy engines (DMA) | Dedicated copy engine per instance |
| Decode engines (video) | Dedicated decode engine per instance |

Because each resource is partitioned at the memory controller and fabric level, one instance's work cannot cause the other instance's HBM bandwidth to degrade. This is the core property: deterministic memory bandwidth per tenant.

### Per-generation configurations

| GPU | Max Instances | Example Configurations |
|---|---|---|
| A100 (40 GB) | 7 | 7 × ~5 GB; 3 × ~10 GB; 1 × 40 GB |
| A100 (80 GB) | 7 | 7 × ~10 GB; 3 × ~20 GB; 1 × 80 GB |
| H100 SXM5 (80 GB) | 7 | 7 × ~10 GB; 3 × ~20 GB; 1 × 80 GB |
| H200 SXM (141 GB) | 7 | 7 × ~18 GB; 3 × ~35 GB; 1 × 141 GB |
| B200 (192 GB) | 7 | 7 × ~23 GB; 2 × ~95 GB; 1 × 192 GB |
| **B300 (288 GB)** | 7 | **7 × ~34 GB; 4 × ~70 GB; 2 × ~140 GB; 1 × 288 GB** |

(Source: [Inside Blackwell Ultra blog](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/), accessed 2026-04-23)

Each profile defines the SM count, L2 slice, and HBM allocation together. You cannot allocate SMs and memory independently — the profiles are pre-set groupings that balance the resources.

### Confidential Computing + MIG (Blackwell)

[VERIFIED] Blackwell extends hardware TEE (Trusted Execution Environment) capabilities to MIG instances via **TEE-I/O** and inline NVLink protection. This means:

- Encrypted GPU memory per MIG instance — AWS and adjacent tenants cannot read the memory
- Inline-encrypted NVLink traffic between GPUs within the same confidential compute domain
- Cryptographic attestation of the MIG instance's boot state and driver
- Multi-tenant inference with **cryptographic isolation per instance**

For firms running proprietary trading models or sensitive customer data on shared GPU infrastructure, this is the combination of mathematical isolation (NIE on host) + cryptographic isolation (TEE-I/O on GPU) + hardware partitioning (MIG).

### MIG vs vGPU / time-slicing

It's worth explicitly contrasting with the weaker alternative:

| Property | MIG (hardware) | vGPU time-slicing (software) |
|---|---|---|
| SM allocation | Dedicated, fixed | Shared, scheduled |
| L2 cache | Partitioned | Shared |
| HBM bandwidth | Partitioned | Shared |
| Fault isolation | Yes (separate PCI function) | No |
| Determinism | Yes (dedicated resources) | No (scheduler-dependent) |
| Tenant noise | None (by hardware design) | High (one tenant can starve another's cache) |

For deterministic inference, MIG is the only NVIDIA-native option. Time-slicing is sufficient for throughput workloads that don't care about tail latency. Capital markets always cares about tail latency.

### Capital markets use case

For a trading desk running multiple strategy workloads on shared GPU infrastructure:

**Without MIG**: One strategy's hot loop (e.g., a risk calc spiking during market stress) can saturate HBM bandwidth and cause every other strategy's p99.9 latency to degrade by multiples. You do not know when this will happen.

**With MIG**: Single B200 (192 GB, 148 SMs) → 7 isolated strategy contexts at ~23 GB HBM / ~21 SMs / dedicated L2 slice each. One strategy's risk calc burst cannot affect any other strategy's memory bandwidth or cache state. **Deterministic tail latency per strategy regardless of neighbor behavior.**

### MIG availability on AWS

[VERIFIED] MIG is a property of NVIDIA silicon (A100 onward). All AWS P-family instances using these GPUs support MIG at the hardware level:

- P4d/P4de (A100)
- P5 (H100), P5e/P5en (H200)
- P6-B200 (B200), P6-B300 (B300)
- P6e-GB200 / P6e-GB300 UltraServers (MIG per GPU within the 72-GPU domain)

[UNKNOWN] Whether AWS exposes MIG configuration at the EC2 instance provisioning layer or requires customer to configure it via NVIDIA drivers in the guest OS. Prior audits of P5 suggest customer-managed in-guest MIG setup is the default — worth verifying before citing on panel.

---

## Pillar 3: AWS Trainium NeuronCore — Compiler-Managed Memory

### The architectural choice that changes everything

[VERIFIED] NeuronCore-v2/v3/v4 (used in Trainium1, Trainium2, Trainium3, Inferentia2) has **no hardware cache**. Memory placement is resolved entirely by the compiler at NEFF build time. This is the single most important architectural differentiator from GPU and CPU for capital markets inference workloads. (Source: [NKI Programming Model](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.25.0/general/nki/programming_model.html), accessed 2026-04-23)

Every NeuronCore has three explicitly-managed memory tiers:

- **PSUM** (Partial Sum buffer): 2 MB per NeuronCore, 128 partitions × 16 KiB. Dedicated Tensor Engine accumulator.
- **SBUF** (State Buffer): 24 MiB (NeuronCore-v2) / 28 MiB (v3) / 32 MiB (v4) per core, 128 partitions. Accessible by all compute engines. ~20× HBM bandwidth.
- **HBM**: 32 GiB (Trn1/Inf2) / 96 GiB (Trn2) / 144 GiB (Trn3) per chip.

The critical property: **the compiler decides where each tensor lives, and that decision is permanent for the compiled NEFF. No eviction. No prefetcher. No speculative cache behavior.**

### Why no cache = deterministic execution

On a GPU or CPU, cache contents are a function of prior execution history. Two identical input tensors running through identical code can produce different cache states because of something else that happened on the same SM five milliseconds earlier. Access latencies for a given memory operation are probabilistic — sometimes L1 hit (1 cycle), sometimes L2 hit (~14 cycles), sometimes DRAM (~100+ ns).

On NeuronCore, if the compiler placed a tensor in SBUF, it is in SBUF for the entire duration of that NEFF execution. There is no eviction path. Access latency is deterministic within a handful of clock cycles for every operation. For a given input shape, the instruction sequence and memory access pattern are **bitwise identical on every execution, every time**.

### NEFF and AOT compilation

[VERIFIED] The Neuron compiler (neuronx-cc) is an **ahead-of-time (AOT) compiler**. NEFF is generated once, before deployment. At inference time:

- Runtime executes the precompiled graph
- No JIT recompilation on shape changes
- No Python tracing overhead
- No first-request latency spike from kernel compilation
- Memory footprint is **locked at compile time** — predictable and static

NEFF is portable: compile once, distribute to inference fleets via S3 or config management. (Source: [Comparison of Traced vs XLA Lazy Tensor Inference](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/programming-guide/inference/trace-vs-xla-lazytensor.html), accessed 2026-04-23)

### CC-Cores: dedicated collective silicon

[VERIFIED] Trainium2 and Trainium3 each contain **16 CC-Cores (Collective Communication Cores) per chip**. These are dedicated hardware processors for AllReduce, AllGather, ReduceScatter, All-to-All, and Permute collective operations. They run **independently of the tensor compute engines**. (Source: [Neuron Collective Communication](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html), accessed 2026-04-23)

Contrast with NVIDIA GPU clusters: NCCL runs collectives on the **same CUDA cores** used for tensor operations. During tensor-parallel inference, the AllReduce phase between layers blocks the tensor engines — your model serving stalls waiting for NCCL to finish. On Trainium, tensor engines keep running while CC-Cores handle collectives. No contention.

### 15-microsecond cross-server packet latency

[VERIFIED] HBM-to-HBM packet latency across servers via EFAv3 on Trn2 UltraServer: **15 μs**. EFA bandwidth per trn2.48xlarge: 3.2 Tbps. Trn2 UltraServer aggregate: 12.8 Tbps across 64 chips. (Source: [Neuron Collective Communication](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html), accessed 2026-04-23)

This 15-μs number is contractable — AWS publishes it. Capital markets firms can include it directly in latency budget calculations for distributed inference. No equivalent hard number is published by NVIDIA for NVLink-C2C-to-NVLink-C2C inter-server collective latency.

### Capital markets implication

Three distinct advantages for latency-sensitive inference:

1. **Bitwise reproducibility at the chip level.** Audit trail: given this NEFF and this input, the output bits will match any previous or future run on any Trainium2/3 chip. No floating-point non-determinism from reduction ordering, no cache-miss variance.

2. **Predictable memory footprint.** Model fits in a known amount of SBUF/HBM, determined at compile time. No surprise OOM at inference. No need to over-provision memory for peak behavior.

3. **No collective contention with inference compute.** CC-Cores handle AllReduce silently. Tensor engines never yield to a collective.

For a trading firm's risk engine running inference every 100 milliseconds: NEFF guarantees that the 10,000th inference produces identical output to the 1st, and the p99.9 latency is bounded by the compiled instruction sequence, not by runtime cache behavior.

### Trainium vs GPU on the determinism axis

| Property | NVIDIA GPU | AWS Trainium |
|---|---|---|
| Memory management | Hardware cache + programmer-managed SMEM | Fully compiler-managed (no cache) |
| JIT compilation | Possible on shape changes | Never (NEFF is AOT) |
| Cross-execution determinism | Non-deterministic by default; CCCL 3.1 opt-in bitwise mode | Deterministic by default |
| Collective on compute cores | Yes (NCCL uses SMs) | No (dedicated CC-Cores) |
| Cold-start variance | First-call JIT spike | None (NEFF pre-loaded) |

Trainium is the more deterministic choice for latency-critical inference. GPUs have larger ecosystem support and higher raw throughput but require explicit opt-in to achieve the determinism that Trainium has by default.

---

## Pillar 4: Software-Level Determinism on GPU

For customers who need NVIDIA GPU (CUDA ecosystem, model availability on P5/P6), there are three software-level tools for bounding jitter:

### CUDA Graphs

[VERIFIED] CUDA Graphs capture the sequence of kernel launches and memory operations as a graph, replayed with a single CPU call. For batch=1 inference where dozens of small kernels launch per token, eliminating per-kernel CPU-side launch overhead (~5-20 µs per kernel) is a large p99/p99.9 improvement.

In practice: a transformer decode step that would normally issue 30-50 individual kernel launches becomes one graph replay. CPU-induced jitter from kernel launch scheduling disappears.

### CCCL 3.1 — GPU-to-GPU Bitwise Determinism

[VERIFIED] CUDA 13.1 (via CCCL 3.1) shipped three levels of floating-point determinism for `cub::DeviceReduce`:

- `not_guaranteed`: atomic reduction, fastest, non-reproducible
- `run_to_run` (default): hierarchical tree reduction, same GPU + same config = same bits
- **`gpu_to_gpu`**: Reproducible Floating-point Accumulator (RFA) via exponent-bin grouping — **bitwise-identical results across different GPU models** at 20-30% performance penalty

(Sources: [NVIDIA CCCL determinism blog](https://developer.nvidia.com/blog/controlling-floating-point-determinism-in-nvidia-cccl/); [CCCL v3.1.0 release](https://github.com/NVIDIA/cccl/releases/tag/v3.1.0), accessed 2026-04-23)

For the first time in NVIDIA's history, there is a supported path to audit-trail reproducibility across hardware upgrades. A risk engine migrating from H100 pools to B200 pools can cite `gpu_to_gpu` determinism mode and produce identical outputs.

### MIG + CUDA Graphs + CCCL determinism stack

The three tools compose:

1. **MIG** bounds which hardware resources a workload can touch
2. **CUDA Graphs** bounds kernel launch variance on the CPU side
3. **CCCL 3.1 determinism mode** bounds floating-point result variance on the GPU side

A tenant running on a MIG instance with CUDA Graph-captured inference and `gpu_to_gpu` reductions has:

- Dedicated SMs, L2, HBM bandwidth (no neighbor noise)
- Single CPU submission per inference (no launch jitter)
- Bitwise-reproducible results (auditable)

This is the fullest GPU-side determinism story AWS currently offers. Not as strong as Trainium's compiler-managed memory (GPUs still have hardware caches behind the MIG boundary that produce within-tenant variance), but materially better than baseline CUDA.

---

## How the Three Pillars Defend Against Jitter Sources

Mapping each isolation technique to the specific jitter source it addresses:

| Jitter source | NIE (Graviton5 host) | MIG (NVIDIA) | Trainium NEFF |
|---|---|---|---|
| Neighbor VM observation / side-channel | Formally proven prevented | N/A (host layer) | N/A (host layer) |
| Neighbor workload HBM bandwidth contention | N/A (accelerator layer) | **Prevented** (hardware partition) | **Prevented** (chip-level workload) |
| Neighbor workload cache eviction | N/A | **Prevented** (L2 partition) | **Not applicable** (no cache exists) |
| Cross-CPU NUMA remote access jitter | Single socket (Graviton5 eliminates NUMA) | N/A | N/A |
| JIT compilation spike on first inference | N/A | CUDA Graphs reduce | **Prevented** (NEFF AOT) |
| Kernel launch scheduler jitter | OS-level isolation via NIE | CUDA Graphs | N/A (no JIT) |
| Thermal throttling | Per-tenant power cap [UNKNOWN details] | Per-instance power control | Chip TDP bounded |
| Collective AllReduce stalling compute | N/A | N/A (single GPU) | **Prevented** (dedicated CC-Cores) |
| FP reduction non-determinism | N/A | CCCL 3.1 `gpu_to_gpu` mode | **Prevented** (by default, bitwise) |
| Hypervisor bug escape | **Formally proven prevented** | N/A | N/A |

**Every row has at least one AWS answer.** That is the portfolio story.

---

## The Panel Response Draft

For the noisy-neighbor / deterministic inference question, the response structure writes itself:

> In capital markets, jitter is not a performance issue — it's a product issue. A trading system that is fast on average but slow at the 99.9th percentile loses money at the 99.9th percentile. So when we talk about memory contention and noisy neighbors, we're talking about a multi-tier isolation problem, and every tier needs its own answer.
>
> On Graviton5, the host layer is covered by the Nitro Isolation Engine — a Rust module under the hypervisor, formally verified in Isabelle/HOL with about 250,000 lines of proof script. It is the first formally verified cloud hypervisor at major-cloud scale. For a firm regulated under MiFID II or DORA, isolation is no longer "we tested it and haven't found a bypass." It's mathematically proven.
>
> On NVIDIA silicon, the accelerator layer is MIG — hardware partitioning of SMs, L2 cache, HBM capacity, and HBM bandwidth into up to seven independent instances. A B200 becomes seven 23-GB GPUs with dedicated resources. One tenant's risk calculation cannot saturate another tenant's memory bandwidth because the memory controllers enforce the partition. On Blackwell, MIG extends to cryptographic isolation via TEE-I/O.
>
> On Trainium, we went further in a different direction — we removed the hardware cache entirely. The Neuron compiler resolves every tensor placement at build time into an explicitly-managed scratchpad called SBUF. There is no eviction path. For the same input, the same NEFF produces the same bits every time, with the same latency envelope. Collectives run on dedicated silicon — 16 CC-Cores per chip — so tensor engines never stall waiting for AllReduce. The 15-microsecond cross-server HBM-to-HBM latency on a Trn2 UltraServer is a published, contractable number.
>
> On top of all of this, CUDA Graphs remove CPU-side launch jitter and CCCL 3.1 added GPU-to-GPU bitwise determinism mode in 2025 — which means a risk engine migrating from H100 to B200 can produce bit-identical results across the hardware transition. That is an audit-trail property that didn't exist a year ago.
>
> The point isn't that one of these is the answer. The point is that capital markets workloads are heterogeneous — some want CPU-side latency on Graviton, some want GPU throughput with MIG isolation, some want bitwise reproducibility on Trainium. The portfolio is the product.

---

## Comparative Position Against Cerebras and HyperCIM

### Zigfrid (Cerebras) will claim:

"Wafer-scale SRAM eliminates cache contention and HBM refresh cycles. Our execution is deterministic by construction."

**True for fully-local mode (models ≤20B parameters that fit in 44 GB on-die SRAM).** Not true for weight-streaming mode through MemoryX, which reintroduces external data movement. MemoryX is DDR5 + Flash. The published bandwidth between MemoryX and WSE is unclear. For models larger than 20B (most frontier work), Cerebras's determinism story weakens to "best-effort streaming scheduling."

**Counter-frame:** AWS Trainium achieves determinism at **any** model size because NEFF specifies memory layout per-operation, regardless of whether the working set fits on-chip. Trainium3 has 144 GB HBM per chip; NEFF works the same for a 70B model or a 400B model.

### Tanya (HyperCIM) will claim:

"Compute-in-memory eliminates the external DRAM contention class of jitter entirely."

**True in principle** for analog CIM where compute happens in the DRAM array. In practice, HyperCIM has no published independent benchmarks, no confirmed tape-out, no tail-latency distribution, and unknown arithmetic precision. PIM's multi-tenant behavior is uncharted.

**Counter-frame:** AWS's isolation stack is **deployed today**, verifiable today, and has customer production history. Formally verified NIE ships in preview December 2025. MIG is in production on every P-family instance. NEFF is in production on every Trainium/Inferentia workload. We are not describing a future — we are describing what runs in AWS regions at this moment.

### The differentiating line on the panel

> Cerebras and HyperCIM are each purist architectural bets. Cerebras is betting that on-wafer SRAM is the answer. HyperCIM is betting that compute-in-memory is the answer. Both bets have merit and both companies are building real silicon. What AWS brings is not a bet — it's a portfolio. Every memory architecture has a place in our lineup, and every isolation technique has a production surface. When a capital markets firm needs deterministic inference today, the decision isn't "which architecture do I bet on?" — it's "which workload runs where in the portfolio I already have access to?"

---

## Known Gaps

1. **MIG provisioning path on AWS**: whether AWS exposes MIG at instance provisioning layer or requires customer in-guest driver configuration. Affects the operational story on panel.
2. **NIE proof scope**: the exact interfaces the Isabelle/HOL proof covers. The proof handles Rust hypercall code and Graviton5 architecture specs — but what about side-channel attacks (Spectre-class) that exploit shared hardware resources below the hypervisor interface? No public clarification.
3. **MIG configurations on GB200/GB300 UltraServer**: whether MIG operates within the 72-GPU NVLink domain or only per-GPU. Affects positioning for frontier-model multi-tenant serving.
4. **Trainium cross-chip determinism**: NEFF is bitwise deterministic per-chip. Across chips in trn2.48xlarge or trn2 UltraServer, whether collective results are bitwise-reproducible at the same level as within-chip is not explicitly documented.
5. **NIE behavior under partial failures**: if a Graviton5 core encounters a machine check, whether NIE guarantees isolation is preserved through the fault handling path. Relevant for trading systems that cannot tolerate even transient isolation degradation.

---

## Sources

All accessed 2026-04-23.

**Nitro Isolation Engine:**
- [AWS Graviton5 announcement](https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2)
- [NW Quantum Isabelle/HOL and NIE](https://nwquantum.uw.edu/2026/04/17/isabelle-hol-the-proof-assistant-behind-the-nitro-isolation-engine/)
- [TYPES/announce NIE formally verified hypervisor](http://www.mail-archive.com/types-announce@lists.seas.upenn.edu/msg11775.html)
- [The Register Graviton5 coverage](https://www.theregister.com/2025/12/04/amazon_graviton_5/)

**MIG:**
- [NVIDIA Multi-Instance GPU](https://www.nvidia.com/en-us/technologies/multi-instance-gpu/)
- [Minimizing DL Inference Latency with MIG](https://developer.nvidia.com/blog/minimizing-dl-inference-latency-with-mig/)
- [Inside NVIDIA Blackwell Ultra](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/)

**Trainium Neuron / NEFF / CC-Cores:**
- [NKI Programming Model](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.25.0/general/nki/programming_model.html)
- [Trainium Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html)
- [Trainium2 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html)
- [Trainium3 Architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html)
- [Neuron Collective Communication (CC-Cores)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html)
- [Traced vs XLA Lazy Tensor Inference (AOT vs JIT)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/programming-guide/inference/trace-vs-xla-lazytensor.html)
- [Neuron Compiler FAQ](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/compiler/neuronx-cc/faq.html)

**CUDA Graphs and CCCL 3.1 Determinism:**
- [Controlling Floating-Point Determinism in NVIDIA CCCL](https://developer.nvidia.com/blog/controlling-floating-point-determinism-in-nvidia-cccl/)
- [CCCL v3.1.0 release](https://github.com/NVIDIA/cccl/releases/tag/v3.1.0)
- [CUDA Graph Basics](https://docs.nvidia.com/dl-cuda-graph/cuda-graph-basics/cuda-graph.html)
- [Constant Time Launch for Straight-Line CUDA Graphs](https://developer.nvidia.com/blog/constant-time-launch-for-straight-line-cuda-graphs-and-other-performance-enhancements/)

**Cross-tier comparisons:**
- [seL4 formal verification reference (background)](https://sel4.systems/)
- [NVIDIA Capital Markets single-digit microsecond inference](https://developer.nvidia.com/blog/achieving-single-digit-microsecond-latency-inference-for-capital-markets/)
