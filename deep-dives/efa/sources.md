# EFA Deep Dive: Source Register

Plain-text register of the appendix source array declared in `src/sections/Sources.tsx`.
The app is the authority for this file; it is regenerated from that array, so the counts
below are computed, not maintained by hand.

Research behind the current content lives in two refresh directories:

- `research/2026-08-refresh/`: the August rewrite. Seven research reports and three
  adversarial verification passes.
- `research/2026-10-refresh/`: the October refresh. Four claim registers
  (`01-software-stack.md`, `02-instances-pricing.md`, `03-integrations.md`,
  `04-open-items-sweep.md`), one authoring log per section group with its claim diff,
  and the adversarial fact check of every changed claim.

- **Sources declared in the appendix:** 55
- **Fact-check entries in the appendix:** 50, referencing 31 distinct source ids
- **Glossary entries:** 106
- **Orphans (no fact-check references them):** 24

## What this file does not cover

The appendix array is not the whole citation surface. The section files carry their own
inline `SourceRef` citations, with per-section `docs` and `code` registries, and those far
outnumber the appendix entries. Use `bash scripts/audit/verify-citations.sh --dive efa
--list` for the current extract. It covers `src/**/*.tsx` and `*.ts`, plus
`research/**/*.md` while `pinned-refs-research` is enabled in `.gates.json`. It does not
yet parse citations built through local helper functions (for example `lfab()` in
`Libfabric.tsx`), so its count understates the code citations in this dive.

## How sources are graded

Tier grading is repo-wide (CLAUDE.md, ADR-002):

| Tier | Meaning |
|---|---|
| 0 | Our own experiments, with the inputs, outputs and configs logged in `research/` |
| 1 | Official AWS documentation, API reference, source code |
| 2 | AWS blogs, re:Invent talks, product pages, announcements |
| 3 | Third-party technical analysis, academic papers, benchmarks |
| 4 | Tutorials and unverified posts. Inspiration only, never cited as fact |

This dive has no Tier 0 sources. `iac/` is empty and no experiment has been run.

On top of the tier, the dive applies the code-is-the-authority rule from
`revamp/source-authority-standard.md`. Source code at a pinned commit outranks official
documentation. Official documentation outranks in-repo README, comment and spec files,
which are navigation aids and never proof of behavior. Where code and documentation
disagree, code wins and the disagreement is publishable content. Each inline claim
carries one of four provenance categories visible to the reader: documented,
code-confirmed, code-derived, or documentation-versus-code conflict.

## Pinning rule

Pin to a commit SHA or a release tag, never to `main` or `master`. `scripts/gates/pinned-refs.sh`
enforces it for `src/**` (`pinned-refs`) and for `research/**/*.md`
(`pinned-refs-research`). Pins after the October 2026 refresh: amzn-drivers
`9d5ca4021f7c9f8421e404c1e89edb0b1325372c` (efa_linux_3.4.0), libfabric v2.7.0,
aws-ofi-nccl v1.22.0, NCCL v2.32.3-1, Linux v7.3, NIXL v1.5.0, vLLM v0.32.0. The full
pin-move tables, with every re-verified citation, are in `research/2026-10-refresh/`.

## Access dates

An access date records when the entry was last read against its claim. Entries re-read
during the October 2026 refresh carry `2026-10-23`; entries re-read in August carry
`2026-08-01` or `2026-08-02`. The `2026-03-22` stamps are a single wave stamp from the
original build and assert only that the URL resolved when the August pass probed it.

---

## Tier 1: Official AWS documentation, API reference and source code (34)

| id | Title | URL | Type | Accessed | Fact-checks |
|---|---|---|---|---|---|
| 1 | AWS EC2 User Guide: Elastic Fabric Adapter | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | official-docs | 2026-03-22 | 6 |
| 2 | AWS EC2 User Guide: Get started with EFA and MPI | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html | official-docs | 2026-10-23 | 1 |
| 3 | AWS EC2 User Guide: Get started with EFA and NCCL | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html | official-docs | 2026-03-22 | 0 |
| 4 | AWS EC2 User Guide: EFA Accelerated Instance Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html | official-docs | 2026-03-22 | 5 |
| 5 | AWS EC2 Accelerated Computing Instance Specs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | official-docs | 2026-03-22 | 2 |
| 6 | AWS EC2 Placement Groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html | official-docs | 2026-03-22 | 0 |
| 7 | EKS User Guide: Manage EFA devices on Amazon EKS | https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html | official-docs | 2026-10-23 | 3 |
| 17 | aws/aws-ofi-nccl GitHub README (v1.22.0) | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/README.md | source-code | 2026-10-23 | 0 |
| 18 | aws/aws-ofi-nccl Releases | https://github.com/aws/aws-ofi-nccl/releases | source-code | 2026-03-22 | 0 |
| 19 | AWS Neuron Collective Communication Docs | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html | official-docs | 2026-10-23 | 0 |
| 20 | AWS Neuron Training FAQ | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html | official-docs | 2026-03-22 | 0 |
| 21 | SageMaker Data Parallel Library | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html | official-docs | 2026-03-22 | 1 |
| 22 | SageMaker Expert Parallelism | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html | official-docs | 2026-03-22 | 0 |
| 29 | EC2 DescribeInstanceTopology API Reference | https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html | official-docs | 2026-03-22 | 0 |
| 30 | EC2 Capacity Blocks for ML | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | official-docs | 2026-10-23 | 0 |
| 31 | EC2 On-Demand Capacity Reservations | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html | official-docs | 2026-10-23 | 0 |
| 32 | NVIDIA/nccl source code (src/graph/search.cc, v2.32.3-1) | https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/graph/search.cc | source-code | 2026-10-23 | 1 |
| 33 | aws/aws-ofi-nccl tuner source (src/tuner/nccl_ofi_tuner.cpp, v1.22.0) | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/tuner/nccl_ofi_tuner.cpp | source-code | 2026-10-23 | 1 |
| 34 | aws/aws-ofi-nccl topology XML files (v1.22.0) | https://github.com/aws/aws-ofi-nccl/tree/v1.22.0/topology | source-code | 2026-10-23 | 1 |
| 35 | NVIDIA NIXL GitHub Repository | https://github.com/ai-dynamo/nixl | source-code | 2026-03-22 | 0 |
| 36 | NIXL Repository at v1.5.0 | https://github.com/ai-dynamo/nixl/tree/v1.5.0 | source-code | 2026-10-23 | 0 |
| 37 | NIXL libfabric Backend README (src/plugins/libfabric, v1.5.0) | https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/plugins/libfabric/README.md | source-code | 2026-10-23 | 0 |
| 38 | vLLM NixlConnector Source (kv_connector/v1/nixl, v0.32.0) | https://github.com/vllm-project/vllm/tree/v0.32.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl | source-code | 2026-10-23 | 1 |
| 40 | AWS Price List bulk API, Amazon EC2, us-east-1 (version 20261022231453) | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv | api-reference | 2026-10-23 | 4 |
| 41 | AWS Price List bulk API, Amazon EC2, us-east-2 (version 20261022231453) | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv | api-reference | 2026-10-23 | 1 |
| 42 | AWS Well-Architected HPC Lens: Data protection | https://docs.aws.amazon.com/wellarchitected/latest/high-performance-computing-lens/data-protection.html | official-docs | 2026-08-02 | 1 |
| 43 | EC2 instance types: Specifications for high-performance computing instances | https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html | official-docs | 2026-08-02 | 1 |
| 46 | NIXL libfabric backend: host-posted fi_writemsg and fi_readmsg (src/utils/libfabric/libfabric_rail.cpp, v1.5.0) | https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/utils/libfabric/libfabric_rail.cpp#L1310-L1336 | source-code | 2026-10-23 | 1 |
| 47 | NVIDIA/nccl point-to-point plan selects a device kernel (src/enqueue/enqueue.cc, scheduleP2pTasksToPlan, v2.32.3-1) | https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/enqueue/enqueue.cc#L1241-L1249 | source-code | 2026-10-23 | 1 |
| 48 | EFA installer 1.51.0 ChangeLog.md and package list (inside aws-efa-installer-1.51.0.tar.gz) | https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz | official-docs | 2026-10-23 | 0 |
| 49 | AWS Neuron documentation (Neuron 2.33.0): Amazon EC2 Trn3 Architecture | https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/arch/neuron-hardware/trn3-arch.html | official-docs | 2026-10-23 | 1 |
| 51 | NVIDIA/nccl GIN backend priority: the NCCL proxy ranks above EFA-GDA (src/plugin/gin.cc, v2.32.3-1) | https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/plugin/gin.cc#L327-L340 | source-code | 2026-10-23 | 1 |
| 53 | AWS Neuron documentation (Neuron 2.33.0): Amazon EC2 Trn1 Architecture | https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/arch/neuron-hardware/trn1-arch.html | official-docs | 2026-10-23 | 1 |
| 54 | vLLM speculative decoding documentation (docs/features/speculative_decoding/README.md, v0.32.0) | https://github.com/vllm-project/vllm/blob/v0.32.0/docs/features/speculative_decoding/README.md#L3 | official-docs | 2026-10-23 | 1 |

## Tier 2: AWS product pages, blogs, announcements, whitepapers (15)

| id | Title | URL | Type | Accessed | Fact-checks |
|---|---|---|---|---|---|
| 8 | Amazon EC2 P5 Instance Types | https://aws.amazon.com/ec2/instance-types/p5/ | product-page | 2026-03-22 | 2 |
| 9 | Amazon EC2 Trn2 Instance Types | https://aws.amazon.com/ec2/instance-types/trn2/ | product-page | 2026-03-22 | 3 |
| 10 | Amazon EC2 UltraServers | https://aws.amazon.com/ec2/ultraservers/ | product-page | 2026-03-22 | 1 |
| 11 | AWS EFA Product Page | https://aws.amazon.com/hpc/efa/ | product-page | 2026-03-22 | 0 |
| 12 | AWS What's New: P5en GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/ | announcement | 2026-03-22 | 0 |
| 13 | AWS What's New: P5en N. Virginia/Jakarta (Mar 2025) | https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/ | announcement | 2026-03-22 | 0 |
| 14 | AWS What's New: P5en N. California (May 2025) | https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/ | announcement | 2026-03-22 | 0 |
| 15 | AWS What's New: Trn2 GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/ | announcement | 2026-03-22 | 0 |
| 16 | AWS What's New: EFA Cross-Subnet (2024) | https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/ | announcement | 2026-03-22 | 0 |
| 23 | Multi-Node vLLM EKS Blueprints | https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/ | aws-open-source | 2026-03-22 | 0 |
| 26 | AWS HPC Blog: Second Generation EFA | https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/ | aws-blog | 2026-03-22 | 0 |
| 27 | AWS HPC Blog: hpc7a MPI Multi-Rail EFA | https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/ | aws-blog | 2026-03-22 | 2 |
| 28 | AWS HPC Benchmarking Whitepaper | https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf | whitepaper | 2026-03-22 | 0 |
| 44 | AWS What's New: Announcing new high performance computing Amazon EC2 Hpc8a instances (Feb 2026) | https://aws.amazon.com/about-aws/whats-new/2026/02/announcing-amazon-ec2-hpc8a-instances/ | announcement | 2026-08-02 | 1 |
| 50 | AWS News Blog: Now Available - Elastic Fabric Adapter (EFA) for Tightly-Coupled HPC Workloads (April 29, 2019) | https://aws.amazon.com/blogs/aws/now-available-elastic-fabric-adapter-efa-for-tightly-coupled-hpc-workloads/ | aws-blog | 2026-10-23 | 1 |

## Tier 3: Third-party analysis, benchmarks, vendor pages outside AWS (6)

| id | Title | URL | Type | Accessed | Fact-checks |
|---|---|---|---|---|---|
| 24 | CFD Direct: OpenFOAM HPC with AWS EFA | https://cfd.direct/cloud/openfoam-hpc-aws-efa/ | third-party-benchmark | 2026-03-22 | 1 |
| 25 | Ernest Chiang: AWS SRD Protocol Deep Dive | https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/ | third-party-analysis | 2026-03-22 | 0 |
| 45 | NVIDIA NVLink and NVLink Switch | https://www.nvidia.com/en-us/data-center/nvlink/ | product-page | 2026-10-23 | 1 |
| 52 | Shoeybi et al., Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism (arXiv:1909.08053) | https://arxiv.org/abs/1909.08053 | academic-paper | 2026-10-23 | 1 |
| 55 | Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (arXiv:2104.04473) | https://arxiv.org/abs/2104.04473 | academic-paper | 2026-10-23 | 1 |
| 56 | NVIDIA Fabric Manager User Guide | https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html | official-docs | 2026-10-23 | 1 |

## Orphan sources

24 of 55 sources are referenced by no `factChecks` entry. An orphan is
not dead weight by default: most of these are cited inline from section files through
`SourceRef` and are orphans only with respect to the appendix fact-check array.

| id | Tier | Title |
|---|---|---|
| 3 | 1 | AWS EC2 User Guide: Get started with EFA and NCCL |
| 6 | 1 | AWS EC2 Placement Groups |
| 11 | 2 | AWS EFA Product Page |
| 12 | 2 | AWS What's New: P5en GA (Dec 2024) |
| 13 | 2 | AWS What's New: P5en N. Virginia/Jakarta (Mar 2025) |
| 14 | 2 | AWS What's New: P5en N. California (May 2025) |
| 15 | 2 | AWS What's New: Trn2 GA (Dec 2024) |
| 16 | 2 | AWS What's New: EFA Cross-Subnet (2024) |
| 17 | 1 | aws/aws-ofi-nccl GitHub README (v1.22.0) |
| 18 | 1 | aws/aws-ofi-nccl Releases |
| 19 | 1 | AWS Neuron Collective Communication Docs |
| 20 | 1 | AWS Neuron Training FAQ |
| 22 | 1 | SageMaker Expert Parallelism |
| 23 | 2 | Multi-Node vLLM EKS Blueprints |
| 25 | 3 | Ernest Chiang: AWS SRD Protocol Deep Dive |
| 26 | 2 | AWS HPC Blog: Second Generation EFA |
| 28 | 2 | AWS HPC Benchmarking Whitepaper |
| 29 | 1 | EC2 DescribeInstanceTopology API Reference |
| 30 | 1 | EC2 Capacity Blocks for ML |
| 31 | 1 | EC2 On-Demand Capacity Reservations |
| 35 | 1 | NVIDIA NIXL GitHub Repository |
| 36 | 1 | NIXL Repository at v1.5.0 |
| 37 | 1 | NIXL libfabric Backend README (src/plugins/libfabric, v1.5.0) |
| 48 | 1 | EFA installer 1.51.0 ChangeLog.md and package list (inside aws-efa-installer-1.51.0.tar.gz) |

## Glossary

The glossary lives in the same file, below the sources array, and is rendered by the
shared `Glossary` component sorted by acronym. It holds 106 entries. Entries carry no
`SourceRef`, so where an entry states a vendor figure it keeps the attribution in its
own text (for example "AWS reports").
