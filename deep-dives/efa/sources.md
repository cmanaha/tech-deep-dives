# EFA Deep Dive: Source Register

Plain-text register of the appendix source array declared in `src/sections/Sources.tsx`.
The app is the authority for this file. `Sources.tsx` declares ids 1 to 39, and all 39
are listed below, grouped by tier.

Research behind the current rewrite lives in `research/2026-08-refresh/`. Ten files:
seven research reports (`01-efa-core.md` through `07-storage-datapaths.md`) and three
adversarial verification passes (`V1-verify-efa-core.md`, `V2-verify-pricing.md`,
`V3-verify-eks.md`). The earlier `research/efa-research-2026-03-22.md` was deleted in
commit `0a667ed` and no longer exists. Do not cite it.

- **Sources declared in the appendix:** 39
- **Fact-check entries in the appendix:** 70, referencing 25 distinct source ids
- **Glossary entries:** 98
- **Dead URLs:** 0
- **Orphans (no fact-check references them):** 14 (ids 2, 3, 6, 13, 14, 15, 16, 17, 18, 20, 22, 23, 29, 35)

Every one of the 39 URLs was re-probed on 2026-08-02. Documentation URLs were fetched
with a browser user agent and followed through redirects. Every GitHub URL was resolved
through the GitHub REST contents API at its pinned ref, because unauthenticated HEAD
floods get rate-limited and return misleading codes.

## What this file does not cover

The appendix array is no longer the whole citation surface. The section files carry
their own inline `SourceRef` citations, with per-section `docs` and `code` registries,
and those far outnumber the 39 appendix entries. The count moves with every section
edit, so it is deliberately not pinned here. Use
`bash scripts/audit/verify-citations.sh --dive efa --list` for the current extract.
That covers `src/**/*.tsx` and `*.ts`, plus `research/**/*.md` while
`pinned-refs-research` is enabled in `.gates.json`.

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

On top of the tier, the rewrite applies the code-is-the-authority rule from
`revamp/source-authority-standard.md`. Source code at a pinned commit outranks official
documentation. Official documentation outranks in-repo README, comment, and spec files,
which are navigation aids and are never proof of behavior. Where code and documentation
disagree, code wins and the disagreement is publishable content.

Each claim carries one of four provenance categories, visible to the reader:

- **A. Documented.** AWS states it. Doc URL plus access date.
- **B. Code-confirmed.** AWS documents it and the code agrees. Both cited.
- **C. Code-derived inference.** Nothing documented; read from the implementation.
  Repository, commit SHA, file path, line number, date read. The page must say plainly
  that this is inferred from source.
- **D. Doc-code contradiction.** Both sides cited, code marked authoritative, the stale
  document named.

## Pinning rule

Pin to a commit SHA or a release tag, never to `main` or `master`. A branch URL cannot
be re-verified as saying the same thing tomorrow. Every source-code URL in the appendix
now satisfies this. So does every GitHub URL in `research/**/*.md`: 75 branch-pinned
URLs were re-pinned to commit SHAs on 2026-08-02, and one branch-pinned
`raw.githubusercontent.com` reference was pinned with them.

Two scripts enforce it, both keyed on `.gates.json`:

| Key | Script | Scope |
|---|---|---|
| `pinned-refs` | `scripts/gates/pinned-refs.sh` | `src/**`, deterministic |
| `pinned-refs-research` | `scripts/gates/pinned-refs.sh` | `research/**/*.md`, deterministic |
| `pinned-refs-research` | `scripts/audit/verify-citations.sh` | `research/**/*.md`, GitHub blob and tree URLs, networked |

Both keys are true for this dive.

## Access dates

The 2026-03-22 stamps are a single wave stamp from the original build, not evidence that
each URL was opened that day. Entries touched during the 2026-08 refresh carry
`2026-08-02`. Every URL in the register was confirmed live on 2026-08-02 regardless of
the stamp it carries, so no stamp currently asserts a verification that does not hold.

## Titles

Titles below drop the em-dash characters that used to appear in `Sources.tsx`. Those
titles render to the reader and the repo writing standard bans em-dashes in
reader-facing text.

---

## Tier 1: Official AWS documentation (14)

| id | Title | URL | Type | Accessed | Cites | Status |
|---|---|---|---|---|---|---|
| 1 | AWS EC2 User Guide: Elastic Fabric Adapter | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | official-docs | 2026-03-22 | 1 | OK |
| 2 | AWS EC2 User Guide: Get started with EFA and MPI | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 3 | AWS EC2 User Guide: Get started with EFA and NCCL | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 4 | AWS EC2 User Guide: EFA Accelerated Instance Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html | official-docs | 2026-03-22 | 4 | OK |
| 5 | AWS EC2 Accelerated Computing Instance Specs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | official-docs | 2026-03-22 | 7 | OK |
| 6 | AWS EC2 Placement Groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 7 | AWS EKS: Node EFA | https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html | official-docs | 2026-03-22 | 3 | OK |
| 19 | AWS Neuron Collective Communication Docs | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html | official-docs | 2026-03-22 | 1 | OK |
| 20 | AWS Neuron Training FAQ | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 21 | SageMaker Data Parallel Library | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html | official-docs | 2026-03-22 | 1 | OK |
| 22 | SageMaker Expert Parallelism | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 29 | EC2 DescribeInstanceTopology API Reference | https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html | official-docs | 2026-03-22 | 0 | OK, ORPHAN |
| 30 | EC2 Capacity Blocks for ML | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | official-docs | 2026-03-22 | 2 | OK |
| 31 | EC2 On-Demand Capacity Reservations | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html | official-docs | 2026-03-22 | 1 | OK |

## Tier 1: Source code (9)

| id | Title | URL | Type | Accessed | Cites | Status |
|---|---|---|---|---|---|---|
| 17 | aws/aws-ofi-nccl GitHub README (v1.20.0) | https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/README.md | source-code | 2026-08-02 | 0 | OK, ORPHAN |
| 18 | aws/aws-ofi-nccl Releases | https://github.com/aws/aws-ofi-nccl/releases | source-code | 2026-03-22 | 0 | OK, ORPHAN |
| 32 | NVIDIA/nccl source code (src/graph/search.cc, v2.30.7-1) | https://github.com/NVIDIA/nccl/blob/v2.30.7-1/src/graph/search.cc | source-code | 2026-08-02 | 1 | OK, REPAIRED |
| 33 | aws/aws-ofi-nccl tuner source (src/tuner/nccl_ofi_tuner.cpp, v1.20.0) | https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp | source-code | 2026-08-02 | 1 | OK, REPAIRED |
| 34 | aws/aws-ofi-nccl topology XML files (v1.20.0) | https://github.com/aws/aws-ofi-nccl/tree/v1.20.0/topology | source-code | 2026-08-02 | 1 | OK, REPINNED |
| 35 | NVIDIA NIXL GitHub Repository | https://github.com/ai-dynamo/nixl | source-code | 2026-03-22 | 0 | OK, ORPHAN |
| 36 | NIXL Repository at v1.3.2 (docs/architecture.md no longer exists upstream; no equivalent document published) | https://github.com/ai-dynamo/nixl/tree/v1.3.2 | source-code | 2026-08-02 | 2 | OK, REPAIRED |
| 37 | NIXL libfabric Backend README (src/plugins/libfabric, v1.3.2) | https://github.com/ai-dynamo/nixl/blob/v1.3.2/src/plugins/libfabric/README.md | source-code | 2026-08-02 | 2 | OK, REPAIRED |
| 38 | vLLM NixlConnector Source (kv_connector/v1/nixl, v0.26.0) | https://github.com/vllm-project/vllm/tree/v0.26.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl | source-code | 2026-08-02 | 1 | OK, REPAIRED |

Ids 17, 36 and 37 are typed `source-code` but are markdown documents inside a source
repository, or a repository root. Under the code-is-the-authority rule those are
navigation aids, not proof of behavior. Id 36 is now the repository tree at `v1.3.2`
rather than a document, and its title states plainly that the architecture document it
used to point at was removed upstream with no equivalent published. The two claims
resting on id 37 still rest on a README and should be re-sourced from the libfabric
plugin code itself.

## Tier 2: AWS product pages, blogs, announcements, whitepapers (13)

| id | Title | URL | Type | Accessed | Cites | Status |
|---|---|---|---|---|---|---|
| 8 | Amazon EC2 P5 Instance Types | https://aws.amazon.com/ec2/instance-types/p5/ | product-page | 2026-03-22 | 8 | OK |
| 9 | Amazon EC2 Trn2 Instance Types | https://aws.amazon.com/ec2/instance-types/trn2/ | product-page | 2026-03-22 | 7 | OK |
| 10 | Amazon EC2 UltraServers | https://aws.amazon.com/ec2/ultraservers/ | product-page | 2026-03-22 | 1 | OK |
| 11 | AWS EFA Product Page | https://aws.amazon.com/hpc/efa/ | product-page | 2026-03-22 | 2 | OK |
| 12 | AWS What's New: P5en GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/ | announcement | 2026-03-22 | 2 | OK |
| 13 | AWS What's New: P5en N. Virginia and Jakarta (Mar 2025) | https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/ | announcement | 2026-03-22 | 0 | OK, ORPHAN |
| 14 | AWS What's New: P5en N. California (May 2025) | https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/ | announcement | 2026-03-22 | 0 | OK, ORPHAN |
| 15 | AWS What's New: Trn2 GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/ | announcement | 2026-03-22 | 0 | OK, ORPHAN |
| 16 | AWS What's New: EFA Cross-Subnet (2024) | https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/ | announcement | 2026-03-22 | 0 | OK, ORPHAN |
| 23 | Multi-Node vLLM EKS Blueprints | https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/ | aws-open-source | 2026-03-22 | 0 | OK, ORPHAN |
| 26 | AWS HPC Blog: Second Generation EFA | https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/ | aws-blog | 2026-03-22 | 5 | OK |
| 27 | AWS HPC Blog: hpc7a MPI Multi-Rail EFA | https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/ | aws-blog | 2026-03-22 | 2 | OK |
| 28 | AWS HPC Benchmarking Whitepaper | https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf | whitepaper | 2026-03-22 | 1 | OK |

Id 11 is Tier 2 here and Tier 1 in the `silicon-memory-inference` dive for the same
URL. Tier 2 is the correct reading of the convention: a product page is not
documentation. The other dive is the one that needs fixing.

## Tier 3: Third-party analysis and benchmarks (3)

| id | Title | URL | Type | Accessed | Cites | Status |
|---|---|---|---|---|---|---|
| 24 | CFD Direct: OpenFOAM HPC with AWS EFA | https://cfd.direct/cloud/openfoam-hpc-aws-efa/ | third-party-benchmark | 2026-03-22 | 1 | OK |
| 25 | Ernest Chiang: AWS SRD Protocol Deep Dive | https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/ | third-party-analysis | 2026-03-22 | 12 | OK |
| 39 | UCCL KV-Cache Transfer Benchmark (NIXL vs NCCL, uccl-project/uccl v0.1.1) | https://github.com/uccl-project/uccl/tree/v0.1.1/p2p/benchmarks | third-party-benchmark | 2026-08-02 | 1 | OK, REPAIRED |

---

## Dead URL history: all six repaired

The 2026-08-01 link-rot pass recorded in
`docs/verification/2026-08-01/P4-link-rot-citation-integrity.md` found six dead URLs.
All six sat inside the 11-source gap that existed between this file and the app: the
NIXL and NCCL-internals sources were added to `Sources.tsx` in a later wave, never
propagated here, and were exactly the ones that had rotted.

All six are now repaired in `Sources.tsx` and re-verified through the GitHub contents
API on 2026-08-02. The table is kept as a record of what changed and why.

| id | Dead URL | Diagnosis | Now points at |
|---|---|---|---|
| 32 | `https://github.com/NVIDIA/nccl/blob/master/src/search.cc` | Moved within the repository | `blob/v2.30.7-1/src/graph/search.cc` |
| 33 | `https://github.com/aws/aws-ofi-nccl/blob/master/tuner/nccl_ofi_tuner.cpp` | Moved into `src/` | `blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp` |
| 36 | `https://github.com/ai-dynamo/nixl/blob/main/docs/architecture.md` | Removed. `docs/` now holds `nixl.md`, `BackendGuide.md`, `python_api.md`, `telemetry.md`, `tracing.md` | `tree/v1.3.2`, the repository at the pinned tag. The title states that the architecture document is gone and that nothing equivalent was published |
| 37 | `https://github.com/ai-dynamo/nixl/blob/main/src/plugins/xfer/libfabric/README.md` | Moved. The plugin now sits at `src/plugins/libfabric/` and does carry a README there | `blob/v1.3.2/src/plugins/libfabric/README.md` |
| 38 | `https://github.com/vllm-project/vllm/blob/main/vllm/distributed/kv_transfer/kv_connector/nixl_connector.py` | Refactored from a single file into a package | `tree/v0.26.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl` |
| 39 | `https://github.com/NVIDIA/uccl/tree/main/benchmark` | Misattributed, not just moved. There is no `NVIDIA/uccl` repository and there never was | `tree/v0.1.1/p2p/benchmarks` in `uccl-project/uccl` |

### The UCCL misattribution, and the glossary entry that survived it

Id 39 was corrected to `uccl-project/uccl` in an earlier pass, but the glossary entry
for UCCL was not, so the appendix contradicted its own bibliography: the source said
`uccl-project`, the glossary said "NVIDIA library". That is fixed. UCCL is an open
source GPU communication library developed at the UC Berkeley Sky Computing Lab and UC
Davis, covering collectives, point-to-point transfers and expert parallelism. It is not
an NVIDIA project. The expansion "Unified Collective Communication Library" is correct
and comes from the project's own `collective/dpdk/README.md`.

The claim that rests on id 39, "NIXL outperforms NCCL by 30 to 50% at typical KV-cache
sizes (256KB to 1MB)", is a third-party benchmark number. It still needs re-verifying
against the benchmark scripts at `p2p/benchmarks`, which do contain both
`benchmark_nixl.py` and `benchmark_nccl.py` at `v0.1.1`.

## Orphan sources (14 of 39)

Declared in `Sources.tsx` and referenced by no entry in the 70-item `factChecks` array.
The 70 fact-checks reference only 25 distinct source ids.

| id | Tier | Title |
|---|---|---|
| 2 | 1 | AWS EC2 User Guide: Get started with EFA and MPI |
| 3 | 1 | AWS EC2 User Guide: Get started with EFA and NCCL |
| 6 | 1 | AWS EC2 Placement Groups |
| 13 | 2 | AWS What's New: P5en N. Virginia and Jakarta (Mar 2025) |
| 14 | 2 | AWS What's New: P5en N. California (May 2025) |
| 15 | 2 | AWS What's New: Trn2 GA (Dec 2024) |
| 16 | 2 | AWS What's New: EFA Cross-Subnet (2024) |
| 17 | 1 | aws/aws-ofi-nccl GitHub README (v1.20.0) |
| 18 | 1 | aws/aws-ofi-nccl Releases |
| 20 | 1 | AWS Neuron Training FAQ |
| 22 | 1 | SageMaker Expert Parallelism |
| 23 | 2 | Multi-Node vLLM EKS Blueprints |
| 29 | 1 | EC2 DescribeInstanceTopology API Reference |
| 35 | 1 | NVIDIA NIXL GitHub Repository |

Id 29 is the one to fix first. `DescribeInstanceTopology` gets substantial prose
treatment, including the "NCCL does not call the EC2 topology API" discussion, but that
claim is checked against id 32 (the NCCL source) and never against the API reference
itself.

An orphan is not automatically dead weight. It can mean a real source that lost its
claim, or a claim that was never registered. Several of these are cited inline from the
section files through `SourceRef` and are orphans only with respect to the appendix
`factChecks` array. Each of the 14 needs one of two outcomes: a fact-check entry that
uses it, or removal.

## Sourcing risk: the most-cited appendix source is a personal blog

| sourceId | Publisher | Tier | Fact-checks citing it |
|---|---|---|---|
| 25 | ernestchiang.com (personal blog) | 3 | 12 of 70 |
| 8 | EC2 P5 product page | 2 | 8 |
| 9 | EC2 Trn2 product page | 2 | 7 |
| 5 | EC2 accelerated instance specs | 1 | 7 |
| 26 | AWS HPC blog | 2 | 5 |

Source 25 carries nearly every core SRD number in the appendix:

- the ~15 microsecond MPI ping-pong latency
- the ~100+ microsecond TCP kernel overhead
- the 64-path packet spraying claim
- the P99.9 latency 85% reduction versus TCP
- the ~25 Gbps versus ~5 Gbps single-flow comparison
- "~100x faster retransmission than the RFC 6298 200ms minimum"
- the ~1 to 2 microsecond InfiniBand RDMA comparison
- the attribution to the IEEE Micro 2020 SRD paper

That last one is the clearest symptom. The fact-check entry reads "SRD described in IEEE
Micro 2020 paper by Shalev et al." and points at `sourceId: 25` instead of at the paper.
The IEEE Micro paper is still not in the appendix sources array.

A Tier 3 personal blog carrying more load-bearing quantitative claims than any Tier 1
source is the largest remaining sourcing risk in this appendix:

1. Locate and verify the Shalev et al. IEEE Micro 40(6) 2020 entry, add it as a Tier 3
   academic primary, and confirm the exact title and DOI. It was not fetched during the
   2026-08-01 audit and has not been fetched since.
2. Move every SRD protocol number off source 25 and onto either the paper or the
   libfabric and driver code, which is Tier 1 and is where the behavior actually lives.
   The `SrdProtocol.tsx` section already cites the driver and libfabric directly through
   `SourceRef`; the appendix `factChecks` array has not caught up.
3. Keep source 25 only for claims it originated.

## Glossary

The glossary lives in the same file, below the sources array, and is rendered by the
shared `Glossary` component sorted by acronym. It now holds 98 entries.

Three corrections landed on 2026-08-02:

- **UCCL** no longer says "NVIDIA library". See the section above.
- **NIXL** dropped an undated parenthetical and the unattributed zero-kernel-launch
  assertion. The entry now states what the pinned libfabric plugin README supports: the
  backend reaches EFA through libfabric and requires libfabric 1.21.0 or later. The
  kernel-launch claim still lives in `factChecks`, where it carries its own source id.
- **SMDDP** no longer reads as a general-purpose library. It now names the three
  supported instance types and says plainly that the optimized AllGather is P4 only and
  that nothing newer is supported, which is what the SageMaker section says at length.

51 entries were added for concepts the sections gained in this session: the EFA hardware
generations (EFAv1 to EFAv4, with the P6e-GB200 generation conflict stated rather than
resolved), the Kubernetes and scheduler layer (DRA, DRANET, SPANK, DCGM, DKMS, MOFED),
the inference stack (DPD, LMCache, SMP), GPU data movement (GIN, GDAKI, GDRCopy, GDS,
GDRDMA, DMA, MMIO), verbs objects (MR, AH, SQ, RNR, ABI, VF, PF), network and kernel
offloads (MTU, MSS, TSO, GRO, LRO, RSS, DIM, XDP, NIC, RMA, AEAD), storage and memory
(LNet, NVMe, HBM3e), the AWS platform terms used throughout (EC2, EKS, ECS, VPC, AZ,
IAM, AL2023, DLC, CRT), and NSDI, which appears only so the dive can say the SRD paper
is not an NSDI paper.

Two entries, DPU and NCI, define acronyms that no longer appear anywhere in the rendered
prose. They are accurate, so they are left in place rather than deleted.
