# EFA Deep Dive: Source Register

Plain-text register of every source declared in `src/sections/Sources.tsx`. The app is
the authority for this file: `Sources.tsx` declares ids 1 to 39, and all 39 are listed
below, grouped by tier.

Research behind the current rewrite lives in `research/2026-08-refresh/`. Ten files:
seven research reports (`01-efa-core.md` through `07-storage-datapaths.md`) and three
adversarial verification passes (`V1-verify-efa-core.md`, `V2-verify-pricing.md`,
`V3-verify-eks.md`). The earlier `research/efa-research-2026-03-22.md` was deleted in
commit `0a667ed` and no longer exists. Do not cite it.

- **Sources declared:** 39
- **Fact-check entries in the app:** 70, referencing 25 distinct source ids
- **Dead URLs:** 6 (ids 32, 33, 36, 37, 38, 39)
- **Orphans (no fact-check references them):** 14 (ids 2, 3, 6, 13, 14, 15, 16, 17, 18, 20, 22, 23, 29, 35)

Link status was probed on 2026-08-01 and recorded in
`docs/verification/2026-08-01/P4-link-rot-citation-integrity.md`. Every GitHub result
was re-verified through the GitHub REST API, because unauthenticated HEAD floods get
rate-limited and return misleading codes.

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

Pin to a commit SHA or a release tag, never to `main` or `master`. Every source-code
URL below still points at a branch, which is a defect the rewrite has to fix: a branch
URL cannot be re-verified as saying the same thing tomorrow.

Titles below drop the em-dash characters used in `Sources.tsx`. Those titles render to
the reader and the repo writing standard bans em-dashes in reader-facing text, so the
app titles need the same treatment.

## Access dates

All 39 entries carry `2026-03-22`. That is a single wave stamp, not evidence that each
URL was opened that day. The content was re-verified during the 2026-08 refresh and the
stamps were never updated, so a stamp of 2026-03-22 currently asserts a verification
that no longer holds for the six dead links.

---

## Tier 1: Official AWS documentation (14)

| id | Title | URL | Type | Accessed | Status |
|---|---|---|---|---|---|
| 1 | AWS EC2 User Guide: Elastic Fabric Adapter | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | official-docs | 2026-03-22 | OK |
| 2 | AWS EC2 User Guide: Get started with EFA and MPI | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 3 | AWS EC2 User Guide: Get started with EFA and NCCL | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 4 | AWS EC2 User Guide: EFA Accelerated Instance Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html | official-docs | 2026-03-22 | OK |
| 5 | AWS EC2 Accelerated Computing Instance Specs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | official-docs | 2026-03-22 | OK |
| 6 | AWS EC2 Placement Groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 7 | AWS EKS: Node EFA | https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html | official-docs | 2026-03-22 | OK |
| 19 | AWS Neuron Collective Communication Docs | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html | official-docs | 2026-03-22 | OK |
| 20 | AWS Neuron Training FAQ | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 21 | SageMaker Data Parallel Library | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html | official-docs | 2026-03-22 | OK |
| 22 | SageMaker Expert Parallelism | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 29 | EC2 DescribeInstanceTopology API Reference | https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html | official-docs | 2026-03-22 | OK, ORPHAN |
| 30 | EC2 Capacity Blocks for ML | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | official-docs | 2026-03-22 | OK |
| 31 | EC2 On-Demand Capacity Reservations | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html | official-docs | 2026-03-22 | OK |

## Tier 1: Source code (9)

| id | Title | URL | Type | Accessed | Status |
|---|---|---|---|---|---|
| 17 | aws/aws-ofi-nccl README | https://github.com/aws/aws-ofi-nccl/blob/master/README.md | source-code | 2026-03-22 | OK, ORPHAN |
| 18 | aws/aws-ofi-nccl Releases | https://github.com/aws/aws-ofi-nccl/releases | source-code | 2026-03-22 | OK, ORPHAN |
| 32 | NVIDIA/nccl source code (search.cc) | https://github.com/NVIDIA/nccl/blob/master/src/search.cc | source-code | 2026-03-22 | **DEAD** |
| 33 | aws/aws-ofi-nccl tuner source (nccl_ofi_tuner.cpp) | https://github.com/aws/aws-ofi-nccl/blob/master/tuner/nccl_ofi_tuner.cpp | source-code | 2026-03-22 | **DEAD** |
| 34 | aws/aws-ofi-nccl topology XML files | https://github.com/aws/aws-ofi-nccl/tree/master/topology | source-code | 2026-03-22 | OK |
| 35 | NVIDIA NIXL GitHub Repository | https://github.com/ai-dynamo/nixl | source-code | 2026-03-22 | OK, ORPHAN |
| 36 | NIXL Architecture Documentation | https://github.com/ai-dynamo/nixl/blob/main/docs/architecture.md | source-code | 2026-03-22 | **DEAD** |
| 37 | NIXL libfabric Backend README | https://github.com/ai-dynamo/nixl/blob/main/src/plugins/xfer/libfabric/README.md | source-code | 2026-03-22 | **DEAD** |
| 38 | vLLM NixlConnector Source | https://github.com/vllm-project/vllm/blob/main/vllm/distributed/kv_transfer/kv_connector/nixl_connector.py | source-code | 2026-03-22 | **DEAD** |

Ids 36 and 37 are typed `source-code` but are markdown documents inside a source
repository. Under the code-is-the-authority rule those are navigation aids, not proof
of behavior, and the two claims resting on id 37 have to be re-sourced from the
libfabric plugin code itself.

## Tier 2: AWS product pages, blogs, announcements, whitepapers (13)

| id | Title | URL | Type | Accessed | Status |
|---|---|---|---|---|---|
| 8 | Amazon EC2 P5 Instance Types | https://aws.amazon.com/ec2/instance-types/p5/ | product-page | 2026-03-22 | OK |
| 9 | Amazon EC2 Trn2 Instance Types | https://aws.amazon.com/ec2/instance-types/trn2/ | product-page | 2026-03-22 | OK |
| 10 | Amazon EC2 UltraServers | https://aws.amazon.com/ec2/ultraservers/ | product-page | 2026-03-22 | OK |
| 11 | AWS EFA Product Page | https://aws.amazon.com/hpc/efa/ | product-page | 2026-03-22 | OK |
| 12 | AWS What's New: P5en GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/ | announcement | 2026-03-22 | OK |
| 13 | AWS What's New: P5en N. Virginia and Jakarta (Mar 2025) | https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/ | announcement | 2026-03-22 | OK, ORPHAN |
| 14 | AWS What's New: P5en N. California (May 2025) | https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/ | announcement | 2026-03-22 | OK, ORPHAN |
| 15 | AWS What's New: Trn2 GA (Dec 2024) | https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/ | announcement | 2026-03-22 | OK, ORPHAN |
| 16 | AWS What's New: EFA Cross-Subnet (2024) | https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/ | announcement | 2026-03-22 | OK, ORPHAN |
| 23 | Multi-Node vLLM EKS Blueprints | https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/ | aws-open-source | 2026-03-22 | OK, ORPHAN |
| 26 | AWS HPC Blog: Second Generation EFA | https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/ | aws-blog | 2026-03-22 | OK |
| 27 | AWS HPC Blog: hpc7a MPI Multi-Rail EFA | https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/ | aws-blog | 2026-03-22 | OK |
| 28 | AWS HPC Benchmarking Whitepaper | https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf | whitepaper | 2026-03-22 | OK |

Id 11 is Tier 2 here and Tier 1 in the `silicon-memory-inference` dive for the same
URL. Tier 2 is the correct reading of the convention: a product page is not
documentation. The other dive is the one that needs fixing.

## Tier 3: Third-party analysis and benchmarks (3)

| id | Title | URL | Type | Accessed | Status |
|---|---|---|---|---|---|
| 24 | CFD Direct: OpenFOAM HPC with AWS EFA | https://cfd.direct/cloud/openfoam-hpc-aws-efa/ | third-party-benchmark | 2026-03-22 | OK |
| 25 | Ernest Chiang: AWS SRD Protocol Deep Dive | https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/ | third-party-analysis | 2026-03-22 | OK |
| 39 | UCCL KV-Cache Transfer Benchmark (NIXL vs NCCL) | https://github.com/NVIDIA/uccl/tree/main/benchmark | third-party-benchmark | 2026-03-22 | **DEAD, MISATTRIBUTED** |

---

## Dead URLs (6)

All six sit inside the 11-source gap that existed between this file and the app before
this rewrite. The NIXL and NCCL-internals sources were added to `Sources.tsx` in a later
wave, never propagated here, and are exactly the ones that have since rotted.

| id | Dead URL | Diagnosis | Replacement |
|---|---|---|---|
| 32 | `https://github.com/NVIDIA/nccl/blob/master/src/search.cc` | Moved within the repository | `https://github.com/NVIDIA/nccl/blob/master/src/graph/search.cc` |
| 33 | `https://github.com/aws/aws-ofi-nccl/blob/master/tuner/nccl_ofi_tuner.cpp` | Moved into `src/` | `https://github.com/aws/aws-ofi-nccl/blob/master/src/tuner/nccl_ofi_tuner.cpp` |
| 36 | `https://github.com/ai-dynamo/nixl/blob/main/docs/architecture.md` | Removed. `docs/` now holds `nixl.md`, `BackendGuide.md`, `python_api.md`, `telemetry.md`, `tracing.md` | No direct replacement. Nearest is `docs/nixl.md`, which is a different document and is a doc file, not code |
| 37 | `https://github.com/ai-dynamo/nixl/blob/main/src/plugins/xfer/libfabric/README.md` | Removed. The `libfabric` plugin directory still exists under `src/plugins/xfer/` and has no README | **None.** Re-source from the plugin's code |
| 38 | `https://github.com/vllm-project/vllm/blob/main/vllm/distributed/kv_transfer/kv_connector/nixl_connector.py` | Refactored from a single file into a package | `https://github.com/vllm-project/vllm/tree/main/vllm/distributed/kv_transfer/kv_connector/v1/nixl` |
| 39 | `https://github.com/NVIDIA/uccl/tree/main/benchmark` | **Misattributed, not just moved.** There is no `NVIDIA/uccl` repository and there never was. UCCL lives at `https://github.com/uccl-project/uccl`. The appendix title also calls it an NVIDIA benchmark | `https://github.com/uccl-project/uccl`. Title, URL, and attribution all need fixing, and the "NIXL outperforms NCCL by 30 to 50%" claim that rests on it needs re-verifying |

Two live claims rest on id 37, which no longer exists: "NIXL requires libfabric 1.21.0+"
and "EFA is the only validated libfabric provider for NIXL". Both are currently uncited
in practice. Two more rest on id 36: "NCCL launches a GPU kernel even for
point-to-point send/recv" and "NIXL performs transfers with zero SM consumption".

When repointing these, pin to a commit SHA. The replacement paths above are branch
paths and will rot the same way.

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
| 17 | 1 | aws/aws-ofi-nccl README |
| 18 | 1 | aws/aws-ofi-nccl Releases |
| 20 | 1 | AWS Neuron Training FAQ |
| 22 | 1 | SageMaker Expert Parallelism |
| 23 | 2 | Multi-Node vLLM EKS Blueprints |
| 29 | 1 | EC2 DescribeInstanceTopology API Reference |
| 35 | 1 | NVIDIA NIXL GitHub Repository |

Id 29 is the one to fix first. `DescribeInstanceTopology` gets substantial prose
treatment in `Architecture.tsx`, including the "NCCL does not call the EC2 topology API"
discussion, but that claim is checked against id 32 (the NCCL source) and never against
the API reference itself.

An orphan is not automatically dead weight. It can mean a real source that lost its
claim, or a claim that was never registered. Each of the 14 needs one of two outcomes:
a fact-check entry that uses it, or removal.

## Sourcing risk: the most-cited source is a personal blog

| sourceId | Publisher | Tier | Fact-checks citing it |
|---|---|---|---|
| 25 | ernestchiang.com (personal blog) | **3** | **12 of 70** |
| 8 | EC2 P5 product page | 2 | 8 |
| 9 | EC2 Trn2 product page | 2 | 7 |
| 5 | EC2 accelerated instance specs | 1 | 7 |
| 26 | AWS HPC blog | 2 | 5 |

Source 25 carries nearly every core SRD number in the dive:

- the ~15 microsecond MPI ping-pong latency
- the ~100+ microsecond TCP kernel overhead
- the 64-path packet spraying claim
- the P99.9 latency 85% reduction versus TCP
- the ~25 Gbps versus ~5 Gbps single-flow comparison
- "~100x faster retransmission than the RFC 6298 200ms minimum"
- the ~1 to 2 microsecond InfiniBand RDMA comparison
- the attribution to the IEEE Micro 2020 SRD paper

That last one is the clearest symptom. The fact-check entry literally reads "SRD
described in IEEE Micro 2020 paper by Shalev et al." and points at `sourceId: 25`
instead of at the paper. **The IEEE Micro paper is not in the sources array at all.**

The dive is laundering primary-source numbers through a third-party summary. A Tier 3
personal blog carrying more load-bearing quantitative claims than any Tier 1 source is
the single largest sourcing risk in this dive, and the rewrite has to fix it:

1. Locate and verify the Shalev et al. IEEE Micro 40(6) 2020 entry, add it as a Tier 3
   academic primary, and confirm the exact title and DOI. It was not fetched during the
   2026-08-01 audit.
2. Move every SRD protocol number off source 25 and onto either the paper or the
   libfabric and driver code, which is Tier 1 and is where the behavior actually lives.
3. Keep source 25 only for claims it originated.

## Structural gap: no inline citations

All 39 URLs in `src/` appear exclusively inside `Sources.tsx`. A grep for `href=` across
the ten section files returns zero matches. The `Link` occurrences in those files are
Cloudscape component references and prose mentions of NVLink, not anchors.

The entire citation mechanism is the appendix fact-check array. A reader in the
Architecture section who wants the source for "64-path packet spraying in SRD" has no
link to follow and has to scroll to the appendix and match the claim string by hand.
The `vllm` dive links every appendix URL from prose. This dive links none.
