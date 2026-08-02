# EFA-Capable EC2 Instance Matrix and Pricing — Refresh

**Research date / accessed:** 2026-08-01
**Scope:** Full EFA-enabled instance list, EFA device counts, bandwidth, accelerator specs, interconnect, EFA generation, RDMA support, placement/UltraServer requirements, us-east-1 On-Demand pricing.
**Verified against:** `deep-dives/efa/src/sections/InstanceSupport.tsx` (23 rows) and `deep-dives/efa/src/sections/Pricing.tsx`.

---

## 0. Source authority key

| Tier | Meaning | Used here |
| --- | --- | --- |
| **T1** | Official AWS documentation (EC2 User Guide, EC2 instance-types reference, AWS Price List bulk API) | Primary for every spec and price |
| **T2** | AWS-authored marketing/blog/What's New pages under `aws.amazon.com` | Used for NVLink/NeuronLink numbers, launch dates, UltraServer aggregates |
| **T3** | Third party | **Not used in this report** |
| **DERIVED** | Arithmetic performed by this research pass | Labeled inline, never presented as sourced |
| **UNKNOWN** | No AWS source found | Labeled inline |

Every URL below was fetched on **2026-08-01**.

**Primary sources:**

- **[T1-EFA]** `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` — "Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2". Contains the canonical supported-instance-type tables grouped by Nitro version, plus RDMA read/write support per instance type. Accessed 2026-08-01.
- **[T1-EFAACC]** `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html` — "Maximize network bandwidth on Amazon EC2 instances with multiple network cards". Per-instance EFA/ENA bandwidth split for P5, P5e, P6-B200, P6-B300, P6e-GB200. Accessed 2026-08-01.
- **[T1-AC]** `https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html` — accelerated computing performance + network specifications (network cards, bandwidth, vCPU, memory, accelerators, Nitro version, Spot support). Accessed 2026-08-01.
- **[T1-HPC]** `https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html` — HPC family specs. Accessed 2026-08-01.
- **[T1-CO]** `https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html` — compute optimized specs. Accessed 2026-08-01.
- **[T1-GP]** `https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html` — general purpose specs. Accessed 2026-08-01.
- **[T1-PRICE]** AWS Price List bulk API, `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv`, `Last-Modified: Tue, 28 Jul 2026 18:38:05 GMT`. Cross-checked against the AWS pricing-page feed `https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/US%20East%20(N.%20Virginia)/Linux/index.json`, `hawkFilePublicationDate: 2026-07-28T17:52:47Z`. Both accessed 2026-08-01.
- **[T1-CB]** `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html` — Capacity Blocks mechanics. Accessed 2026-08-01.
- **[T2-P5]** `https://aws.amazon.com/ec2/instance-types/p5/`, **[T2-P6]** `https://aws.amazon.com/ec2/instance-types/p6/`, **[T2-TRN1]** `https://aws.amazon.com/ec2/instance-types/trn1/`, **[T2-TRN2]** `https://aws.amazon.com/ec2/instance-types/trn2/`, **[T2-TRN3]** `https://aws.amazon.com/ec2/instance-types/trn3/`, **[T2-US]** `https://aws.amazon.com/ec2/ultraservers/`, **[T2-CBP]** `https://aws.amazon.com/ec2/capacityblocks/pricing/`, **[T2-CBO]** `https://aws.amazon.com/ec2/capacityblocks/`, **[T2-TRAINIUM]** `https://aws.amazon.com/ai/machine-learning/trainium/`. All accessed 2026-08-01.

---

## 1. THE HEADLINE CORRECTION: the EFA generation ↔ Nitro version mapping in the current site is wrong

[T1-EFA] structures the supported-instance-type list into four tables with these exact headings:

- `Using Nitro v6 (EFA v4)`
- `Using Nitro v5 (EFA v3)`
- `Using Nitro v4 (EFA v2)`
- `Using Nitro v3 (EFA v1)`

The current `InstanceSupport.tsx` uses a **different, incorrect** mapping in which Nitro v6 is labelled EFAv3 and EFAv4 is described as "P6e-GB200 UltraServers only". Under the authoritative mapping:

| EFA generation | Nitro version | Notable EFA instances (not exhaustive) | Max EFA bandwidth on that generation |
| --- | --- | --- | --- |
| EFA v4 | Nitro v6 | p6-b200, p6-b300, g7, g7e, hpc8a, c8i/m8i/r8i, c8gn/m8gn/r8gn, c8in/m8in/r8in, c8gb/m8gb/r8gb, c8a/m8a, m8azn, c9g/m9g (Graviton5), x8i, i8ge | 6,400 Gbps (p6-b300.48xlarge) [T1-EFAACC] |
| EFA v3 | Nitro v5 | p5en, p6e-gb200, trn2, trn2u, hpc7g, c7gn, c8g/m8g/r8g/x8g, i7ie, i8g | 3,200 Gbps (p5en.48xlarge, trn2.48xlarge) [T1-AC] |
| EFA v2 | Nitro v4 | p5, p5e, trn1, trn1n, hpc6a, hpc6id, hpc7a, c6in/m6in/r6in, c6a/c6i/c7a/c7i/c7g, f2, g6, g6e, gr6, u7i/u7in, x2idn/x2iedn, i4i/i7i | 3,200 Gbps (p5.48xlarge, p5e.48xlarge) [T1-AC] |
| EFA v1 | Nitro v3 | c5n, m5n/m5dn/m5zn, r5n/r5dn, i3en, x2iezn, p4d, p4de, p3dn, inf1.24xlarge, g4dn, g5, dl2q, vt1 | 400 Gbps (p4d/p4de, 4 x 100 Gbps) [T1-AC] |

RDMA support per [T1-EFA] prose: *"EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."* Exceptions listed in the tables: `c7gn.16xlarge`, `c7gn.metal`, `hpc7g.4xlarge`, `hpc7g.8xlarge`, `hpc7g.16xlarge` are **RDMA read only** (write = No) despite being Nitro v5. On Nitro v3, only `p4d.24xlarge` and `p4de.24xlarge` have RDMA read; everything else is No/No.

### CONTRADICTION: P6e-GB200 EFA generation

- **[T1-EFA]** lists `p6e-gb200.36xlarge` in the **`Using Nitro v5 (EFA v3)`** table. **[T1-AC]** independently lists the P6e-GB200 family hypervisor as **Nitro v5**.
- **[T2-P6]** states the P6 page covers "fourth-generation Elastic Fabric Adapter networking (EFAv4)" and **[T2-US]** states P6e-GB200 UltraServers deliver "up to 28.8 terabits per second of Elastic Fabric Adapter (EFAv4) networking".

Both sources are AWS-first-party and they disagree. Recommendation for the site: state **Nitro v5** (two independent T1 docs agree) and note the EFAv4 marketing claim explicitly rather than silently picking one.

---

## 2. Corrected instance matrix

### 2a. Accelerated computing (P / Trn / Inf / G / DL / F)

"EFA cards" = network cards that can host an EFA or EFA-only interface. One EFA per network card [T1-EFA, EFA limitations]. Where the primary network card index 0 is ENA-only, that is called out.

| Instance type | Accelerator | Accel. memory | Accel. interconnect | vCPU | Instance memory | Network cards | Max EFA bandwidth | EFA gen (Nitro) | RDMA read / write | Spot | Citation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p6-b300.48xlarge | 8 x NVIDIA B300 (Blackwell Ultra) | 2,148 GiB (8 x 268 GiB) | NVLink — UNKNOWN (not stated on [T2-P6]) | 192 | 4,096 GiB | 17 (NCI 0 = ENA-only @350 Gbps; NCI 1-16 EFA-capable @400 Gbps ea.) | 6,400 Gbps EFA / up to 3,870 Gbps ENA | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T1-EFAACC] |
| p6-b200.48xlarge | 8 x NVIDIA B200 | 1,432 GiB (8 x 179 GiB) | "up to 14.4 TBp/s of total bidirectional NVLink bandwidth" | 192 | 2,048 GiB | 8 (each 400 Gbps EFA / 200 Gbps ENA) | 3,200 Gbps EFA / up to 1,600 Gbps ENA | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T1-EFAACC], NVLink from [T2-P6] |
| p6e-gb200.36xlarge | 4 x NVIDIA B200 (2 x GB200 Grace Blackwell Superchip) | 740 GiB (4 x 185 GiB) | UltraServer NVL72: "up to 130 terabytes per second of low-latency NVLink connectivity between GPUs" | 144 (Grace, arm64) | 960 GiB | up to 17 (NCI 0 = ENA @100 Gbps; NCI 1,3,5,7,9,11,13,15 EFA-only @400 Gbps; NCI 2,4,...,16 up to 200 Gbps ENA or EFA) | **1,600 Gbps EFA max** (either 4 x 400 or 8 x 200) | v3 per [T1-EFA]/[T1-AC]; **EFAv4 per [T2-P6]/[T2-US]** — see CONTRADICTION above | Yes / Yes | **No** | [T1-AC], [T1-EFA], [T1-EFAACC], NVLink from [T2-P6] |
| p5en.48xlarge | 8 x NVIDIA H200 | 1,128 GiB (8 x 141 GiB) | 900 GB/s NVSwitch | 192 | 2,048 GiB | 16 | 3,200 Gbps | v3 (Nitro v5) | Yes / Yes | Yes | [T1-AC], [T1-EFA], NVSwitch from [T2-P5] |
| p5e.48xlarge | 8 x NVIDIA H200 | 1,128 GiB (8 x 141 GiB) | 900 GB/s NVSwitch | 192 | 2,048 GiB | 32 | 3,200 Gbps total; up to 800 Gbps of that usable for IP | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T1-EFAACC], [T2-P5] |
| p5.48xlarge | 8 x NVIDIA H100 | 640 GiB (8 x 80 GiB) | 900 GB/s NVSwitch | 192 | 2,048 GiB | 32 | 3,200 Gbps total; up to 800 Gbps of that usable for IP | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T1-EFAACC], [T2-P5] |
| **p5.4xlarge** (missing from site) | 1 x NVIDIA H100 | 80 GiB | n/a (single GPU) | 16 | 256 GiB | 1 | 100 Gbps | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA]; "GPUDirect RDMA not supported in P5.4xlarge" [T2-P5] |
| p4d.24xlarge | 8 x NVIDIA A100 | 320 GiB (8 x 40 GiB) | NVSwitch — bandwidth UNKNOWN from T1/T2 pages fetched | 96 | 1,152 GiB | 4 | 400 Gbps (4 x 100) | v1 (Nitro v3) | **Yes / No** | Yes | [T1-AC], [T1-EFA] |
| p4de.24xlarge | 8 x NVIDIA A100 | 640 GiB (8 x 80 GiB) | as above | 96 | 1,152 GiB | 4 | 400 Gbps (4 x 100) | v1 (Nitro v3) | **Yes / No** | Yes | [T1-AC], [T1-EFA] |
| trn2.48xlarge | 16 x AWS Trainium2 | **CONTRADICTION**: 1.5 TB per [T2-TRN2]; 8,192 GiB (16 x 512 GiB) per [T1-AC] | NeuronLink; per-chip bandwidth UNKNOWN | 192 | 2,048 GiB | 16 | 3,200 Gbps (16 x 200) | v3 (Nitro v5) | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T2-TRN2] |
| **trn2u.48xlarge** (missing from site) | 16 x AWS Trainium2 | as trn2.48xlarge per [T2-TRN2] | NeuronLink, UltraServer member | 192 | 2,048 GiB | 16 | 3,200 Gbps (16 x 200) | v3 (Nitro v5) | Yes / Yes | **No** | [T1-AC], [T1-EFA], [T2-TRN2] |
| trn2.3xlarge | 1 x AWS Trainium2 | 96 GB per [T2-TRN2]; 512 GiB per [T1-AC] (same contradiction) | n/a | 12 | 128 GiB | 1 | 200 Gbps | v3 (Nitro v5) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| trn1n.32xlarge | 16 x AWS Trainium | 512 GB (16 x 32 GB) | "up to 768 GB/s of NeuronLink" | 128 | 512 GiB | 16 | 1,600 Gbps (16 x 100) | **v2 (Nitro v4)** | Yes / Yes | Yes | [T1-AC], [T1-EFA], NeuronLink + "EFAv2" from [T2-TRN1] |
| trn1.32xlarge | 16 x AWS Trainium | 512 GB (16 x 32 GB) | "up to 768 GB/s of NeuronLink" | 128 | 512 GiB | 8 | 800 Gbps (8 x 100) | **v2 (Nitro v4)** | Yes / Yes | Yes | [T1-AC], [T1-EFA], [T2-TRN1] |
| inf1.24xlarge | 16 x AWS Inferentia | 128 GiB (16 x 8 GiB) | n/a | 96 | 192 GiB | 1 | 100 Gbps | v1 (Nitro v3) | No / No | Yes | [T1-AC], [T1-EFA] |
| **g7e.48xlarge** (missing) | 8 x NVIDIA RTX PRO 6000 Blackwell Server Edition | 768 GiB (8 x 96 GiB) | GPUDirect P2P | 192 | 2,048 GiB | 4 | 1,600 Gbps | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA]; GPUDirect RDMA "with EFAv4 in EC2 UltraClusters" from AWS What's New 2026-01 |
| **g7e.24xlarge** (missing) | 4 x RTX PRO 6000 | 384 GiB | GPUDirect P2P | 96 | 1,024 GiB | 2 | 800 Gbps | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g7e.12xlarge / 8xlarge** (missing) | 2 / 1 x RTX PRO 6000 | 192 / 96 GiB | — | 48 / 32 | 512 / 256 GiB | 1 / 1 | 400 / 100 Gbps | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g7.48xlarge** (missing) | 8 x NVIDIA RTX PRO 4500 Blackwell | 256 GiB (8 x 32 GiB) | — | 192 | 768 GiB | 2 | 700 Gbps | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g7.24xlarge / 12xlarge / 8xlarge** (missing) | 4 / 2 / 1 x RTX PRO 4500 | 128 / 64 / 32 GiB | — | 96 / 48 / 32 | 384 / 192 / 128 GiB | 1 | 350 / 175 / 100 Gbps | v4 (Nitro v6) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g6e.48xlarge** (missing) | 8 x NVIDIA L40S | 357 GiB (8 x 44 GiB) | — | 192 | 1,536 GiB | 4 | 400 Gbps | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g6e.24xlarge / 16xl / 12xl / 8xl** (missing) | 4 / 1 / 4 / 1 x L40S | — | — | 96 / 64 / 48 / 32 | — | 2 / 1 / 1 / 1 | 200 / 35 / 100 / 25 Gbps | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **g6.48xl / 24xl / 16xl / 12xl / 8xl** (missing) | 8 / 4 / 1 / 4 / 1 x NVIDIA L4 | — | — | — | — | 1 | 100 / 50 / 25 / 40 / 25 Gbps | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **gr6.8xlarge** (missing) | 1 x NVIDIA L4 | — | — | 32 | — | 1 | 25 Gbps | v2 (Nitro v4) | Yes / Yes | Yes | [T1-AC], [T1-EFA] |
| **f2.48xlarge** (missing) | Xilinx/AMD FPGA | — | — | — | — | — | — | v2 (Nitro v4) | Yes / Yes | Yes | [T1-EFA] |
| **dl2q.24xlarge** (missing) | Qualcomm AI 100 | — | — | — | — | 1 | 100 Gbps | v1 (Nitro v3) | No / No | Yes | [T1-AC], [T1-EFA] |
| **g4dn.8xl/12xl/16xl/metal, g5.8xl-48xl, p3dn.24xlarge, vt1.24xlarge** (missing) | various | — | — | — | — | 1 | 100 Gbps class | v1 (Nitro v3) | No / No | varies | [T1-EFA] |

**Note:** `dl1.24xlarge` has 4 network cards and 4 x 100 Gigabit but **EFA = No** per [T1-AC]. It is not on the [T1-EFA] supported list. Do not include it.

### 2b. HPC family

| Instance type | Processor | vCPU / cores | Memory | Network cards | Max EFA bandwidth | EFA gen (Nitro) | RDMA read / write | Spot | Citation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hpc8a.96xlarge | AMD EPYC 9R45 | 192 / 192 | 768 GiB | 2 | 300 Gbps | **v4 (Nitro v6)** | Yes / Yes | **No** | [T1-HPC], [T1-EFA] |
| hpc7a.96xlarge / 48xl / 24xl / 12xl | AMD EPYC 9R14 | 192 / 96 / 48 / 24 | 768 GiB (all sizes) | 2 | 300 Gbps (needs >=2 ENIs on separate cards; each ENI caps at 150 Gbps) | v2 (Nitro v4) | Yes / Yes | **No** | [T1-HPC], [T1-EFA] |
| hpc7g.16xlarge / 8xl / 4xl | AWS Graviton3E | 64 / 32 / 16 | 128 GiB (all sizes) | 1 | 200 Gbps | **v3 (Nitro v5)** | **Yes / No** | **No** | [T1-HPC], [T1-EFA] |
| hpc6id.32xlarge | Intel Xeon Ice Lake | 64 / 64 | 1,024 GiB | 2 | 200 Gbps (needs >=2 ENIs; each ENI caps at 170 Gbps) | **v2 (Nitro v4)** | Yes / Yes | **No** | [T1-HPC], [T1-EFA] |
| hpc6a.48xlarge | AMD EPYC 7R13 | 96 / 96 | 384 GiB | **1** | **100 Gbps** | **v2 (Nitro v4)** | Yes / Yes | **No** | [T1-HPC], [T1-EFA] |

No `hpc8g` or any HPC family newer than Hpc8a exists as of 2026-08-01 [T1-HPC instance families table].

### 2c. C / M / R / X / I / U families with EFA (largest EFA-capable size per family)

| Instance type | Network cards | Max EFA bandwidth | EFA gen (Nitro) | RDMA read / write | Citation |
| --- | --- | --- | --- | --- | --- |
| c8gn.48xlarge / metal-48xl | 2 | **600 Gbps** | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-EFA] |
| m8gn.48xlarge / metal-48xl | 2 | **600 Gbps** | v4 (Nitro v6) | Yes / Yes | [T1-GP], [T1-EFA] |
| c8in.96xlarge / m8in.96xlarge / m8idn.96xlarge (+ metal-96xl) | 2 | **600 Gbps** | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| c8in.48xlarge / m8in.48xlarge / m8idn.48xlarge | 1 | 300 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP] |
| c8gb.48xlarge / m8gb.48xlarge (+ metal-48xl) | 2 | 400 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| c8ib.96xlarge / m8ib.96xlarge / m8idb.96xlarge | 2 | 400 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP] |
| c8gb.24xlarge / m8gb.24xlarge / c8gn.24xlarge (300) / m8gn.24xlarge (300) | 1 | 200-300 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP] |
| m8azn.24xlarge / metal-24xl | 1 | 200 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-GP], [T1-EFA] |
| c9g.48xlarge / c9gd.48xlarge / m9g.48xlarge / m9gd.48xlarge (Graviton5) | 1 | 100 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| **c8i.48xlarge** | **1** | **75 Gbps** | **v4 (Nitro v6)** | Yes / Yes | [T1-CO], [T1-EFA] |
| **c8i.96xlarge** | **1** | **100 Gbps** | **v4 (Nitro v6)** | Yes / Yes | [T1-CO], [T1-EFA] |
| **m8i.48xlarge** | **1** | **75 Gbps** | **v4 (Nitro v6)** | Yes / Yes | [T1-GP], [T1-EFA] |
| **m8i.96xlarge** | **1** | **100 Gbps** | **v4 (Nitro v6)** | Yes / Yes | [T1-GP], [T1-EFA] |
| c8a.48xlarge / m8a.48xlarge (+ metal-48xl) | 1 | 75 Gbps | v4 (Nitro v6) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| c8g.48xlarge / m8g.48xlarge (+ metal) | 1 | 50 Gbps | v3 (Nitro v5) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| **c7gn.16xlarge / c7gn.metal** | 1 | 200 Gbps | **v3 (Nitro v5)** | **Yes / No** | [T1-CO], [T1-EFA] |
| c6in.32xlarge / c6in.metal | 2 | 200 Gbps | **v2 (Nitro v4)** | Yes / Yes | [T1-CO], [T1-EFA] |
| m6in.32xlarge / m6idn.32xlarge (+ metal) | 2 | 200 Gbps | v2 (Nitro v4) | Yes / Yes | [T1-GP], [T1-EFA] |
| c6gn.16xlarge | 1 | 100 Gbps | v2 (Nitro v4) | Yes / Yes | [T1-CO], [T1-EFA] |
| c6a/c6i/c6id/c7a/c7i .48xl-32xl (+ metal) | 1 | 50 Gbps | v2 (Nitro v4) | Yes / Yes | [T1-CO], [T1-EFA] |
| c7g.16xlarge / c7gd.16xlarge / m7g.16xlarge / m7gd.16xlarge (+ metal) | 1 | 30 Gbps | v2 (Nitro v4) | Yes / Yes | [T1-CO], [T1-GP], [T1-EFA] |
| c5n.18xlarge / c5n.metal | 1 | 100 Gbps | v1 (Nitro v3) | No / No | [T1-CO], [T1-EFA] |
| c5n.9xlarge | 1 | 50 Gbps | v1 (Nitro v3) | No / No | [T1-CO], [T1-EFA] |
| m5n/m5dn.24xlarge, m5zn.12xlarge (+ metal) | 1 | 100 Gbps | v1 (Nitro v3) | No / No | [T1-GP], [T1-EFA] |

Also EFA-capable per [T1-EFA] and not yet represented anywhere on the site: the full **R8x memory-optimized set** (r8a, r8gb, r8gn, r8i, r8id, r8in, r8idn, r8ib, r8idb at 48xl/96xl/metal — Nitro v6; r8g/r8gd/x8g at 24xl/48xl/metal — Nitro v5; r6a/r6i/r6id/r6in/r6idn/r7a/r7g/r7gd/r7i/r7iz, x2idn, x2iedn — Nitro v4; r5n/r5dn, x2iezn — Nitro v3), **x8aedz.24xlarge and x8i (48xl/64xl/96xl/metal)**, **storage-optimized** i8ge.48xlarge (Nitro v6), i7ie.48xlarge and i8g.48xlarge (Nitro v5), i4g.16xlarge / i4i.32xlarge / i7i.24xl-48xl / im4gn.16xlarge (Nitro v4), i3en.12xl/24xl/metal (Nitro v3), and the **U7i high-memory line**: u7i-6tb.112xlarge, u7i-8tb.112xlarge, u7i-12tb.224xlarge, u7in-16tb.224xlarge, u7in-24tb.224xlarge, u7in-32tb.224xlarge, u7inh-32tb.480xlarge (all Nitro v4, EFA v2).

---

## 3. Placement group, UltraServer, UltraCluster requirements

**Cluster placement group is recommended, not required.** [T1] `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html` (accessed 2026-08-01) says verbatim: *"It is not an absolute requirement to launch your EFA-enabled instances into a cluster placement group. However, we do recommend running your EFA-enabled instances in a cluster placement group as it launches the instances into a low-latency group in a single Availability Zone."*

**Same-AZ is a hard requirement.** [T1-EFA] limitations: *"EFA traffic can't cross Availability Zones or VPCs."* Also *"EFA is not supported on AWS Outposts."* and *"EFA traffic between P4d/P4de/DL1 instances and other instance types is currently not supported."*

**Security group requirement** (from AWS Batch EFA doc, T1, `https://docs.aws.amazon.com/batch/latest/userguide/efa.html`, accessed 2026-08-01): the security group must allow all inbound and outbound traffic to and from itself.

### P6e-GB200 NVL72 specifics

- `p6e-gb200.36xlarge` is **only available as part of a P6e-GB200 UltraServer**. Two UltraServer sizes exist: `u-p6e-gb200x36` = 9 instances = 36 Blackwell GPUs in one NVLink domain; `u-p6e-gb200x72` = 18 instances = 72 GPUs in one NVLink domain. [T1] `https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-nvidia-ultraserver.html` and [T1] `https://docs.aws.amazon.com/parallelcluster/latest/ug/support-nvidia-imex-p6e-gb200-instance.html`, both accessed 2026-08-01.
- UltraServers are purchased **only through EC2 Capacity Blocks for ML**, and you reserve the UltraServer, not individual instances. Each UltraServer corresponds to one Capacity Block [T1-CB]; [T1] ParallelCluster doc: *"p6e-gb200.36xlarge instances are only available via P6e-GB200 UltraServers... On purchasing an Ultraserver u-p6e-gb200x72 it will be available through a EC2 Capacity Blocks for ML which will have 18 p6e-gb200.36xlarge instances."*
- Each instance carries **2 NVIDIA GB200 Grace Blackwell Superchips** (each = 1 Grace CPU + 2 Blackwell GPUs), so 4 GPUs and 2 Grace CPUs per instance [T2, AWS ML blog `https://aws.amazon.com/blogs/machine-learning/train-and-deploy-ai-models-at-trillion-parameter-scale-with-amazon-sagemaker-hyperpod-support-for-p6e-gb200-ultraservers/`, accessed 2026-08-01].
- Per-UltraServer aggregates [T2-US]: 72 Blackwell GPUs, "360 petaflops of FP8 compute (without sparsity)", "13.4 TB of total high bandwidth memory (HBM3e)", "up to 130 terabytes per second of low-latency NVLink connectivity between GPUs", "up to 28.8 terabits per second of Elastic Fabric Adapter (EFAv4) networking".
- **DERIVED (not a sourced fact):** 18 instances x 1,600 Gbps EFA per instance = 28,800 Gbps = 28.8 Tbps. Inputs: instance count from [T1-EKS UltraServer doc], per-instance EFA cap from [T1-EFAACC]. This reproduces the [T2-US] figure, which is the citable form.
- **NCI sharing behavior** [T1-EFAACC], verbatim: NCI pairs `[1,2] [3,4] [5,6] [7,8] [9,10] [11,12] [13,14] [15,16]` share an underlying physical NIC capped at 400 Gbps; NCI pairs `[1,3] [5,7] [9,11] [13,15]` share a GPU, and each GPU supports up to 400 Gbps of EFA. **The existing site alert on this is correct.**
- **P6e-GB200 has no Spot support** [T1-AC family summary]. Neither does `trn2u` [T1-AC].

### P6-B300 network card nuance

[T1-EFAACC] verbatim: *"They have 8 GPUs and 17 network cards, where the primary network card supports only an ENA network interface with up to 350 Gbps of bandwidth. The secondary network cards support up to 400 Gbps EFA and up to 220 Gbps of ENA bandwidth."* So the count of **EFA-capable** cards is **16**, not 17. Calling p6-b300 "17 EFA interfaces" overstates it.

### Trn2 / Trn3 UltraServers

- Trn2 UltraServer = 4 x `trn2u.48xlarge` = 64 Trainium2 chips, "6 TB of shared accelerator memory with 185 TBps of total memory bandwidth" and "12.8 Tbps of EFAv3 networking bandwidth" [T2-TRN2].
- **Trn3 UltraServers are GA** and are missing from the site entirely. [T2] AWS What's New, `https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/`, accessed 2026-08-01: Trainium3, 2.52 PFLOPs FP8 per chip, 144 GB HBM3e per chip, 4.9 TB/s memory bandwidth per chip, up to 144 chips per UltraServer, NeuronSwitch-v1 all-to-all fabric that "doubles interchip interconnect bandwidth over Trn2 UltraServers", deployed in EC2 UltraClusters 3.0. [T2-TRAINIUM] adds "Up to 28.8 Tbps of aggregate scale-out bandwidth per UltraServer" and "up to 362 MXFP8 PFLOPs, 20.7 TB of HBM3e, and 706 TB/s of aggregate memory bandwidth" per UltraServer.
- **The EC2 instance type name backing Trn3 is UNKNOWN.** No `trn3.*` entry appears in [T1-EFA], [T1-AC], or the us-east-1 price list as of 2026-08-01. AWS Neuron release notes [T2, `https://aws.amazon.com/about-aws/whats-new/2026/07/aws-announce-neuron-2-31-0/`] do reference "Trn3" alongside Trn1/Trn2/Inf2/Inf1 regions. Treat Trn3 as announced-but-not-yet-in-the-EFA-instance-table; do not assert an EFA device count or instance type name.

---

## 4. Pricing, us-east-1, Linux, Shared tenancy, On-Demand

Source: [T1-PRICE], AWS Price List bulk API for us-east-1, `Last-Modified 2026-07-28`; cross-checked against the AWS pricing-page feed with `hawkFilePublicationDate 2026-07-28T17:52:47Z`. Filters applied: `TermType=OnDemand`, `Operating System=Linux`, `Tenancy=Shared`, `CapacityStatus=Used`, `MarketOption=OnDemand`, `preInstalledSw=NA`. Accessed 2026-08-01.

| Instance type | us-east-1 On-Demand $/hr (Linux) | Spot | Citation |
| --- | --- | --- | --- |
| p6-b300.48xlarge | **142.4160** | UNKNOWN | [T1-PRICE] |
| p6-b200.48xlarge | **113.9328** | UNKNOWN | [T1-PRICE] |
| p6e-gb200.36xlarge | **Not offered as On-Demand.** No On-Demand SKU exists in the us-east-1 price list. UltraServer-only via Capacity Blocks. | Not supported [T1-AC] | [T1-PRICE], [T1-CB] |
| p5en.48xlarge | **63.2960** | UNKNOWN | [T1-PRICE] |
| p5.48xlarge | **55.0400** | UNKNOWN | [T1-PRICE] |
| p5.4xlarge | **6.8800** | UNKNOWN | [T1-PRICE] |
| p5e.48xlarge | **No On-Demand SKU in us-east-1, us-east-2, or us-west-2 price feeds.** Capacity Blocks only. | UNKNOWN | [T1-PRICE], [T2-CBP] |
| p4de.24xlarge | **27.4470500** | UNKNOWN | [T1-PRICE] |
| p4d.24xlarge | **21.9576420** | UNKNOWN | [T1-PRICE] |
| trn1n.32xlarge | **24.7800** | UNKNOWN | [T1-PRICE] |
| trn1.32xlarge | **21.5000** | UNKNOWN | [T1-PRICE] |
| trn2.48xlarge / trn2u.48xlarge / trn2.3xlarge | **No On-Demand SKU in us-east-1, us-east-2, or us-west-2 price feeds.** Capacity Blocks / UltraServer only. | trn2 Yes, trn2u No [T1-AC] | [T1-PRICE], [T2-CBP] |
| inf1.24xlarge | **4.7210** | UNKNOWN | [T1-PRICE] |
| g7e.48xlarge | **33.1443200** | UNKNOWN | [T1-PRICE] |
| g6e.48xlarge | **30.1311800** | UNKNOWN | [T1-PRICE] |
| g7.48xlarge | **28.5132800** | UNKNOWN | [T1-PRICE] |
| m8i.96xlarge | **20.3212800** | UNKNOWN | [T1-PRICE] |
| c8i.96xlarge | **17.9923200** | UNKNOWN | [T1-PRICE] |
| m8gn.48xlarge | **13.9680** | UNKNOWN | [T1-PRICE] |
| c8gn.48xlarge | **11.3760** | UNKNOWN | [T1-PRICE] |
| m8i.48xlarge | **10.1606400** | UNKNOWN | [T1-PRICE] |
| c8i.48xlarge | **8.9961600** | UNKNOWN | [T1-PRICE] |
| c6in.32xlarge | **7.2576** | UNKNOWN | [T1-PRICE] |
| c7gn.16xlarge | **3.9936** | UNKNOWN | [T1-PRICE] |
| c5n.18xlarge | **3.8880** | UNKNOWN | [T1-PRICE] |
| hpc7g.16xlarge | **1.6832** | Not supported [T1-HPC] | [T1-PRICE] |
| hpc8a.96xlarge | **Not offered in us-east-1.** us-east-2: **7.9200** | Not supported [T1-HPC] | [T1-PRICE], Ohio feed |
| hpc7a.96xl / 48xl / 24xl / 12xl | **Not offered in us-east-1.** us-east-2: **7.2000** (identical for all four sizes) | Not supported [T1-HPC] | [T1-PRICE], Ohio feed |
| hpc6id.32xlarge | **Not offered in us-east-1.** us-east-2: **5.7000** | Not supported [T1-HPC] | [T1-PRICE], Ohio feed |
| hpc6a.48xlarge | **Not offered in us-east-1.** us-east-2: **2.8800** | Not supported [T1-HPC] | [T1-PRICE], Ohio feed |

**Spot: no figure in this report.** Spot prices are not present in the EC2 Price List bulk API or the public pricing feed and could not be sourced from any Tier 1 AWS endpoint without credentials. Every Spot cell above is **UNKNOWN**. Do not publish a Spot number, a Spot percentage, or a "60% savings" claim. What *is* sourceable is Spot *eligibility*, from the [T1-AC] / [T1-HPC] "Spot support" column: **P6e-GB200 = No, Trn2u = No, Hpc6a/Hpc6id/Hpc7a/Hpc7g/Hpc8a = No, Gr6 = Yes; P4d/P4de/P5/P5e/P5en/P6-B200/P6-B300/Trn1/Trn1n/Trn2/Inf1/G6/G6e/G7/G7e = Yes.**

### Capacity Blocks pricing (separate purchase path)

[T2-CBP], accessed 2026-08-01. The page states: *"The current prices are scheduled to be updated next in October, 2026."*

| Type | Region | Effective hourly rate | Per accelerator |
| --- | --- | --- | --- |
| u-p6e-gb200x72 (72 x B200) | US East (Dallas) Local Zone | $761.904 | $10.582 |
| u-p6e-gb200x36 (36 x B200) | US East (Dallas) Local Zone | $380.952 | $10.582 |
| p6-b300.48xlarge | us-east-1, us-west-2, US East (Atlanta) LZ | $112.32 | $14.04 |
| p6-b300.48xlarge | AWS GovCloud (US-East) | $117.00 | — |
| p6-b200.48xlarge | US East regions, us-west-2, ap-south-1 | $98.84 | $12.355 |
| p5en.48xlarge | US regions | $54.920 | $6.865 |
| p5e.48xlarge | all listed regions | $47.76 | — |
| p5.48xlarge | US regions | $41.528 | $5.191 |
| trn2.48xlarge (16 x Trainium2) | — | $35.7608 | $2.235 |
| trn1.32xlarge (16 x Trainium) | — | $9.532 | $0.596 |
| trn2.3xlarge (1 x Trainium2) | — | $2.235 | — |

Capacity Block mechanics [T1-CB]: reserve a start time up to 8 weeks in advance; duration 1-14 days or multiples of 7 days up to 182 days; up to 64 instances per Capacity Block; up to 256 instances across multiple Capacity Blocks. For UltraServers, one UltraServer = one Capacity Block. Instances are terminated starting **30 minutes** (instance types) or **60 minutes** (UltraServer types) before the block end time, with an EventBridge event 10 minutes before termination begins. Supported families per [T2-CBO]: P6e-GB200, P6-B300, P6-B200, P5en, P5e, P5, P4d, Trn2, Trn1.

**EFA itself is free.** [T1-EFA], "EFA pricing" section, verbatim: *"EFA is available as an optional Amazon EC2 networking feature that you can enable on any supported instance at no additional cost."* The existing site claim is correct.

---

## 5. Explicit diff against the existing site

### 5a. `InstanceSupport.tsx` — 23 rows: **15 wrong, 8 correct**

Fields checked: `accelerator`, `efaInterfaces`, `bandwidthGbps`, `efaVersion`, `nitroVersion`.

| # | Row | Verdict | What is wrong |
| --- | --- | --- | --- |
| 1 | p6-b300.48xlarge | **WRONG** | `efaVersion: EFAv3` → should be **EFAv4**. `efaInterfaces: 17` → 17 network cards but NCI 0 is ENA-only, so **16** are EFA-capable. Bandwidth 6,400 and Nitro v6 correct. |
| 2 | p6-b200.48xlarge | **WRONG** | `efaVersion: EFAv3` → **EFAv4**. Everything else correct (8 cards, 3,200 Gbps, Nitro v6, 8 x B200 179 GiB). |
| 3 | p6e-gb200.36xlarge | **WRONG** | `nitroVersion: v6` → **v5** per two independent T1 docs. `efaVersion: EFAv4` is what [T2-P6]/[T2-US] say but contradicts [T1-EFA] (v3). `efaInterfaces: 8` is one of two valid configs (8 x 200 Gbps or 4 x 400 Gbps); the instance exposes up to 17 network cards. 1,600 Gbps cap is correct. |
| 4 | p5.48xlarge | correct | — |
| 5 | p5e.48xlarge | correct | — |
| 6 | p5en.48xlarge | correct | — |
| 7 | p4d.24xlarge | correct | — |
| 8 | p4de.24xlarge | correct | Cosmetic: "A100 SXM4e" is not an AWS designation; [T1-AC] says "8 x NVIDIA A100 GPU, 640 GiB (8 x 80 GiB)". |
| 9 | trn2.48xlarge | **WRONG** | Accelerator memory "512GB HBM3" matches neither source: [T2-TRN2] says 1.5 TB, [T1-AC] says 8,192 GiB (16 x 512 GiB). EFA gen, Nitro, cards, bandwidth all correct. |
| 10 | trn2.3xlarge | correct | — |
| 11 | trn1n.32xlarge | **WRONG** | `efaVersion: EFAv1` → **EFAv2**. Confirmed twice: [T1-EFA] lists trn1n under Nitro v4 (EFA v2), and [T2-TRN1] says "Trn1n instances support up to 1600 Gbps of EFAv2 network bandwidth". |
| 12 | trn1.32xlarge | **WRONG** | `efaVersion: EFAv1` → **EFAv2**. |
| 13 | inf1.24xlarge | correct | — |
| 14 | hpc8a.96xlarge | **WRONG** | `efaVersion: EFAv3` → **EFAv4**. Accelerator text "None (96 AMD EPYC 9005)" → **192 vCPUs / 192 cores, AMD EPYC 9R45**. |
| 15 | hpc7a.96xlarge | **WRONG** | Accelerator text "None (96 AMD EPYC 9004)" → **192 vCPUs / 192 cores, AMD EPYC 9R14**. EFA gen, Nitro, cards, bandwidth correct. |
| 16 | hpc7g.16xlarge | **WRONG** | `efaVersion: EFAv2` → **EFAv3**; `nitroVersion: v4` → **v5**. Also RDMA write = **No** on hpc7g, which contradicts the site's blanket "RDMA read+write" framing. |
| 17 | hpc6a.48xlarge | **WRONG (worst row)** | `efaInterfaces: 2` → **1**; `bandwidthGbps: 200` → **100**; `efaVersion: EFAv1` → **EFAv2**. Only Nitro v4 and the 96-vCPU count are right. |
| 18 | hpc6id.32xlarge | **WRONG** | `efaVersion: EFAv1` → **EFAv2**. Cards, bandwidth, vCPU, 15.2 TB NVMe all correct. |
| 19 | c8i.48xlarge | **WRONG** | `efaInterfaces: 2` → **1**; `bandwidthGbps: 200` → **75**; `efaVersion: EFAv3` → **EFAv4**. |
| 20 | m8i.48xlarge | **WRONG** | `efaInterfaces: 2` → **1**; `bandwidthGbps: 200` → **75**; `efaVersion: EFAv3` → **EFAv4**. |
| 21 | c6in.32xlarge | **WRONG** | `efaVersion: EFAv1` → **EFAv2**. |
| 22 | c7gn.16xlarge | **WRONG** | `efaVersion: EFAv2` → **EFAv3**; `nitroVersion: v4` → **v5**. RDMA write = **No**. |
| 23 | c5n.18xlarge | correct | — |

### 5b. `InstanceSupport.tsx` — non-table prose

| Element | Verdict | Correction |
| --- | --- | --- |
| "EFA bandwidth spans **100 Gbps** (C5n, single EFA) to **6,400 Gbps** (P6-B300, 17 EFA interfaces)" | **WRONG on both ends** | Lower bound is **25 Gbps** (g6.8xlarge, g6.16xlarge, gr6.8xlarge) [T1-AC]; several EFA-capable types sit at 30 Gbps (c7g/m7g/r7g.16xlarge). Upper bound 6,400 Gbps is right but the interface count is **16** EFA-capable cards, not 17. |
| "Four generations of EFA hardware exist, each on progressively faster Nitro versions." | correct | — |
| Alert: "Inf2 instances do NOT have EFA. Only inf1.24xlarge..." | **correct** | Still true. No inf2 size appears in [T1-EFA]. |
| EFAv1 card: "P4d, Trn1, Hpc6a, C5n ... Up to 400 Gbps. RDMA read only. Nitro v3-v4." | **WRONG** | Trn1 and Hpc6a are **EFAv2 / Nitro v4**. EFA v1 = Nitro v3 only. Correct EFAv1 examples: c5n, m5n/m5dn/m5zn, r5n/r5dn, i3en, x2iezn, p3dn, p4d, p4de, inf1.24xlarge, g4dn, g5, dl2q, vt1. Max 400 Gbps (p4d/p4de) is right. "RDMA read only" applies only to p4d/p4de; the rest are No/No. |
| EFAv2 card: "P5, P5e, Hpc7a. Up to 3,200 Gbps (32 interfaces x 100 Gbps). Nitro v4." | mostly correct, incomplete | Add trn1, trn1n, hpc6a, hpc6id, c6in/m6in/r6in, g6/g6e/gr6, f2, u7i family, x2idn/x2iedn, i4i/i7i. |
| EFAv3 card: "P5en, P6-B200, P6-B300, Trn2, Hpc8a, C8i/M8i. Up to 6,400 Gbps. RDMA read+write on Nitro v6." | **WRONG** | EFAv3 = **Nitro v5 only**: p5en, p6e-gb200, trn2, trn2u, hpc7g, c7gn, c8g/m8g/r8g/x8g, i7ie, i8g. Max EFAv3 bandwidth is **3,200 Gbps**, not 6,400. P6-B200/P6-B300/Hpc8a/C8i/M8i belong in EFAv4. |
| EFAv4 card: "P6e-GB200 UltraServers only. Up to 28.8 Tbps per UltraServer. Nitro v6." | **WRONG** | EFAv4 = Nitro v6, a broad set (p6-b200, p6-b300, g7, g7e, hpc8a, the entire 8th-gen Intel/AMD/Graviton4 network-optimized line, Graviton5 c9g/m9g). Max per-instance EFA on v4 is **6,400 Gbps** (p6-b300). P6e-GB200 is listed under **Nitro v5** by [T1-EFA]. The 28.8 Tbps figure is per-UltraServer, not per-instance, and is a [T2-US] claim. |
| P6e-GB200 NCI pairing alert | **correct** | Matches [T1-EFAACC] verbatim. Could be strengthened: NCI pairs `[1,3] [5,7] [9,11] [13,15]` also share a **GPU** (400 Gbps per GPU), which is the second sharing axis the alert omits. |
| CLI snippet (`describe-instance-types --filters network-info.efa-supported`) | **correct** | Matches [T1-EFA] verbatim. |

### 5c. Instance types MISSING entirely from the 23-row table

Highest-value gaps for a technical-lead audience, in priority order:

1. **G7e** (`g7e.8xl / 12xl / 24xl / 48xl`) — up to **1,600 Gbps EFA**, EFAv4, GPUDirect P2P and GPUDirect RDMA in UltraClusters. GA January 2026. This is the highest-bandwidth EFA instance outside the P and Trn families and the site has no G row at all.
2. **G7** (`g7.8xl / 12xl / 24xl / 48xl`) — up to **700 Gbps EFA**, EFAv4. GA June 2026.
3. **trn2u.48xlarge** — the UltraServer-capable Trn2 SKU; no Spot; 16 cards / 3,200 Gbps.
4. **p5.4xlarge** — 100 Gbps EFA, single card, and explicitly **no GPUDirect RDMA** [T2-P5]. A useful "EFA without GPUDirect" teaching case.
5. **C8gn / M8gn** (`.48xlarge`, `.metal-48xl`) — **600 Gbps EFA**, EFAv4, 2 network cards. Highest-bandwidth non-accelerated EFA instances.
6. **C8in / M8in / R8in / M8idn / R8idn** `.96xlarge` — 600 Gbps EFA, EFAv4.
7. **C9g / M9g / C9gd / M9gd** `.48xlarge` — Graviton5, EFAv4, 100 Gbps.
8. **C8gb / M8gb / R8gb** `.48xlarge` — 400 Gbps EFA, EFAv4.
9. **G6 / G6e / Gr6** EFA-capable sizes — EFAv2, 25 to 400 Gbps.
10. **hpc7a.12xl / 24xl / 48xl** and **hpc7g.4xl / 8xl** — the site only lists the largest size of each HPC family.
11. **U7i / U7in / U7inh high-memory** (6 TB to 32 TB) — EFAv2, an underappreciated EFA-capable line.
12. The full **R / X / I** EFA sets and the Nitro v3 EFAv1 legacy set (m5n, r5n, i3en, x2iezn, g4dn, g5, p3dn, vt1, dl2q).
13. **Trn3 UltraServers** (GA Dec 2025) — announced, but **no `trn3.*` instance type appears in [T1-EFA]**. Cover as "announced, EC2 instance type not yet in the EFA supported-types table."

### 5d. `Pricing.tsx` — price diff

| Row | Site value | Verified 2026-07-28 value (us-east-1, Linux, On-Demand) | Verdict |
| --- | --- | --- | --- |
| p5.48xlarge | $98.32 | **$55.04** | **CHANGED — site is 79% too high.** DERIVED delta: -$43.28/hr, -44%. |
| p4d.24xlarge | $32.77 | **$21.957642** | **CHANGED — site is 49% too high.** DERIVED delta: -$10.81/hr, -33%. |
| trn1.32xlarge | $21.50 | **$21.50** | unchanged |
| trn1n.32xlarge | $24.78 | **$24.78** | unchanged |
| hpc7a.96xlarge | $3.60 | **Not offered in us-east-1.** us-east-2 = **$7.20** | **WRONG on price and on region.** The table header says "us-east-1" but hpc7a is not sold there. |

Other `Pricing.tsx` problems:

| Element | Verdict | Correction |
| --- | --- | --- |
| `spotEstimate` column: "~$39 (60% savings)", "~$13 (60% savings)", "~$8.60", "~$9.90" | **FABRICATED — remove** | No Tier 1 AWS source publishes these. The uniform "60% savings" applied to four different families is a giveaway. Replace with the sourceable fact (Spot *eligibility* per [T1-AC]/[T1-HPC]) or drop the column. |
| `spotEstimate` for hpc7a: "N/A (HPC)" | **correct** | [T1-HPC] family summary: Spot support = No for Hpc6a, Hpc6id, Hpc7a, Hpc7g, Hpc8a. |
| `costPerGbps` column ($0.031, $0.082, $0.027, $0.015, $0.012) | **DERIVED, presented as fact** | These are price ÷ bandwidth. They are also all stale because the underlying prices moved. If kept, label DERIVED and show the inputs. Recomputed with 2026-07-28 prices — **DERIVED**: p5.48xlarge $55.04 / 3,200 = $0.0172/Gbps-hr; p4d.24xlarge $21.957642 / 400 = $0.0549; trn1.32xlarge $21.50 / 800 = $0.0269; trn1n.32xlarge $24.78 / 1,600 = $0.0155. |
| "EFA Interface / EFA Data Transfer / Instance Premium / Cluster Placement Group = Free" | **correct** | [T1-EFA] EFA pricing section states EFA is enabled "at no additional cost". |
| "EFA requires a cluster placement group = all instances in the same AZ" | **WRONG as stated** | [T1] `efa-start.html`: *"It is not an absolute requirement to launch your EFA-enabled instances into a cluster placement group."* The hard constraint is **same Availability Zone** (EFA traffic can't cross AZs, [T1-EFA] limitations). Cluster PG is a strong recommendation, not a requirement. |
| "Capacity Blocks ... up to 6 months ... 1-64 instances per block ... Book up to 8 weeks in advance" | **correct** | [T1-CB]: 8 weeks in advance; 1-14 days or multiples of 7 up to 182 days; up to 64 instances per block. |
| "Auto-placed into UltraClusters — no manual placement group needed" | **correct** | [T2-CBO]: "EC2 Capacity Blocks are colocated in Amazon EC2 UltraClusters". |
| "End times fixed at 11:30 AM UTC" | **UNVERIFIED — remove or reword** | [T1-CB] describes the end-of-block behavior as termination beginning 30 min (instances) / 60 min (UltraServers) before the end time, with an EventBridge event 10 min prior. No fixed UTC clock time appears in the doc. |
| "No cancellation" | **UNVERIFIED** | Not stated in [T1-CB] or [T2-CBO] as fetched. |
| "Prices increased ~15% in January 2026 while On-Demand prices decreased" | **UNVERIFIABLE from current sources** | [T2-CBP] only says "The current prices are scheduled to be updated next in October, 2026." The On-Demand direction is independently confirmed (p5.48xlarge and p4d.24xlarge both fell materially), but the "~15%" Capacity Block figure has no live source. Either drop the number or attribute it to whatever source the March 2026 pass used. |
| "The only guaranteed capacity path for P5/P5e/Trn2 at scale" | overstated | [T2-CBO] lists P6e-GB200, P6-B300, P6-B200, P5en, P5e, P5, P4d, Trn2, Trn1. And [T1] `efa-start.html` explicitly offers Capacity Reservations with placement groups as an alternative. |

---

## 6. What is NEW or CHANGED since March 2026

**New EFA-capable instances / sizes that landed after March 2026** (Tier 2, AWS What's New, all accessed 2026-08-01):

| Date | Item | EFA relevance | URL |
| --- | --- | --- | --- |
| 2026-06 | **G7 GA** (us-east-2, us-west-2). 8 x NVIDIA RTX PRO 4500 Blackwell, up to 700 Gbps EFA. | New EFAv4 accelerated family | `https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/` |
| 2026-06 | **metal-48xl / metal-96xl** for M8in, M8ib, M8idn, M8idb, R8in, R8ib, R8idn, R8idb (us-east-1). EFA on 48xl, 96xl, metal-48xl, metal-96xl. | New EFAv4 sizes | `https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-metal-sizes-network-EBS/` |
| 2026-05 | **P6-B300 in us-east-1**. | 6,400 Gbps EFA now in N. Virginia | `https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-ec2-p6-b300-us-east/` |
| 2026-05 | M8gn / M8gb in eu-west-1. | EFAv4 regional expansion | `https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-ec2-m8gn-m8gb-aws-europe/` |
| 2026-05 | G7e in eu-west-2 (London). | EFAv4 regional expansion | `https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-ec2-g7e-london-region/` |
| 2026-04 | **M8in and M8ib GA** (us-east-1, us-west-2, ap-northeast-1, eu-south-2). 600 Gbps / 300 Gbps EBS. | New EFAv4 network-optimized families | `https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-ec2-m8in-m8ib/` |
| 2026-04 | P6-B300 in AWS GovCloud (US-East). | | `https://aws.amazon.com/about-aws/whats-new/2026/04/ec2-p6-b300-govcloud-us-east/` |
| 2026-04 | C8gn in eu-south-1, ap-east-1. | | `https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-ec2-c8gn-milan-hong-kong/` |
| 2026-07 | R8in / R8ib / R8idn / R8idb in ap-northeast-1, eu-central-1, eu-west-1. | | `https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-ec2-r8in-r8ib-r8idn-r8idb/` |

**Pre-March-2026 items the site still missed** (worth folding in during this refresh):

- **G7e GA, January 2026** — 8 x RTX PRO 6000 Blackwell Server Edition, 96 GB per GPU, **1,600 Gbps EFA**, "NVIDIA GPUDirect Peer to Peer (P2P) and NVIDIA GPUDirect Remote Direct Memory Access (RDMA) with EFAv4 in EC2 UltraClusters". `https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/`
- **Trn3 UltraServers GA, December 2025** — 144 Trainium3 chips per UltraServer, NeuronSwitch-v1, UltraClusters 3.0. `https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/`
- **Hpc8a GA, 2026-02-16** — us-east-2 and eu-north-1, 192 cores, 768 GiB, 300 Gbps EFA, Nitro v6 (so **EFAv4**, which is exactly what the site got wrong). `https://aws.amazon.com/about-aws/whats-new/2026/02/announcing-amazon-ec2-hpc8a-instances/`
- **M8gn / M8gb GA, December 2025**; **C8gb GA, December 2025**; metal sizes February 2026. EFA on 16xl / 24xl / 48xl sizes.

**Pricing movement since the March 2026 vintage:**

- P5 and P4d On-Demand fell sharply (p5.48xlarge $98.32 → $55.04; p4d.24xlarge $32.77 → $21.957642). Trn1 and Trn1n did not move.
- New On-Demand price points that did not exist in the March content: p6-b300.48xlarge $142.4160, p6-b200.48xlarge $113.9328, p5en.48xlarge $63.2960, g7e.48xlarge $33.1443200, g7.48xlarge $28.5132800.
- Capacity Block prices are "scheduled to be updated next in October, 2026" [T2-CBP], so the current Capacity Block table is stable through Q3 2026.

**Documentation-level change worth calling out in the deep dive:** [T1-EFA] now documents **EFA-only network interfaces** (`InterfaceType=efa-only`) as a first-class concept alongside traditional "EFA with ENA" interfaces, with a comparison table. It also now names **NIXL (NVIDIA Inference Xfer Library) 1.0.0+** alongside NCCL, Open MPI and Intel MPI in the supported interfaces list, with Libfabric 1.21.0+ required. Neither appears in the current site content.

---

## 7. Open UNKNOWNs (do not fill these with estimates)

1. **Spot prices** for every instance in this report. Not available from any credential-free Tier 1 AWS endpoint.
2. **P6-B300 NVLink bandwidth.** [T2-P6] gives 14.4 TB/s bidirectional for P6-B200 and 130 TB/s for the P6e-GB200 UltraServer, but no figure for P6-B300.
3. **P4d/P4de NVSwitch bandwidth.** Not on the pages fetched.
4. **Trn2 NeuronLink per-chip bandwidth in GB/s.** [T2-TRN1] gives 768 GB/s for Trn1; no equivalent number was found for Trn2 on [T2-TRN2] or [T2-TRAINIUM].
5. **Trn2 / trn2.3xlarge accelerator memory.** [T1-AC] and [T2-TRN2] disagree (8,192 GiB vs 1.5 TB for trn2.48xlarge; 512 GiB vs 96 GB for trn2.3xlarge). Flag as CONTRADICTION rather than picking one.
6. **Trn3 EC2 instance type name and EFA device count.** Not in [T1-EFA], [T1-AC], or the price list.
7. **p5e / p6e-gb200 / trn2 On-Demand rates.** No On-Demand SKU exists in the us-east-1, us-east-2, or us-west-2 price feeds. Only Capacity Block rates are published.
8. **Whether p6e-gb200 is EFAv3 or EFAv4.** Genuine AWS-internal contradiction; report both.
9. **Capacity Block "no cancellation" and "end times fixed at 11:30 AM UTC"** claims from the existing content.
