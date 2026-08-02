# EFA Deep Dive Revamp — Master Plan

Session: 2026-08-01. Status: **RESEARCH COMPLETE, NOTHING APPLIED.**
No file under `deep-dives/efa/src/` has been touched. No commit made. No history rewritten.

## Artifact index

Research (permanent, fills the missing `research/` standard):
- `research/2026-08-refresh/01-efa-core.md` — SRD, driver, libfabric, aws-ofi-nccl (84 KB)
- `research/2026-08-refresh/02-ec2-topology-api.md` — Topology API + consumers (71 KB)
- `research/2026-08-refresh/03-efa-eks.md` — EKS AMI, device plugin, DRA (91 KB)
- `research/2026-08-refresh/04-efa-sagemaker.md` — Training Jobs, HyperPod, SMDDP (92 KB)
- `research/2026-08-refresh/05-instances-pricing.md` — instance matrix + pricing (44 KB)

Planning (temporary, promote or delete after review):
- `revamp/section-architecture.md` — 24-section plan, citation architecture, ci.sh gates
- `revamp/diagram-plan.md` — 30-diagram inventory + SVG authoring contract
- `revamp/git-authorship-findings.md` — history investigation and options
- `revamp/REVAMP-PLAN.md` — this file

Totals: 382 KB of research, ~380 verified facts, 5 UNKNOWN registers, 9 logged contradictions.

## The headline: this is a correctness problem, not a freshness problem

The EFA dive is not merely stale. Its single most-quoted "depth signature" claim is
now false, and its pricing is off by enough to mislead a cost decision.

**Content correctness**
- The "proof of OS bypass" argument (kernel driver deliberately omits
  `post_send`/`post_recv`/`poll_cq`) is dead. Driver r2.12.0 added a 798-line
  `efa_data_verbs.c` that implements all three. The replacement story is Data Path
  Direct, where libfabric bypasses rdma-core entirely.
- "RDMA Read and Write are emulated in software" is **wrong**. They are native
  hardware opcodes (`EFA_IO_RDMA_READ = 1`, `EFA_IO_RDMA_WRITE = 2`). The cited
  symbol `rxr_pkt_post_ctrl` no longer exists. The error traces to an unmaintained
  2019 `SRD.txt` in the same repo that its own code contradicts.
- "No GPUDirect Async" is now wrong (`FI_EFA_GDA_OPS` on the `efa-direct` fabric).
- "Setting NCCL_ALGO/NCCL_PROTO disables the tuner" is wrong for NCCL 2.22.3+.
- A fourth device generation exists (EFA v4 / Nitro v6) that the dive never mentions.
- 7 claims WRONG, 12 STALE, 15 still correct out of 34 assessed.

**Instance matrix: 15 of 23 rows wrong**, nearly all from one off-by-one. AWS's own
tables read `Nitro v6 (EFA v4)`, `Nitro v5 (EFA v3)`, `Nitro v4 (EFA v2)`,
`Nitro v3 (EFA v1)`. The dive shifts this by one generation, corrupting 9 rows and
3 of 4 "EFA Generation Evolution" cards. The entire G family is missing, including
G7e at 1,600 Gbps.

**Pricing is dangerously wrong.** p5.48xlarge is listed at $98.32/hr; the current
us-east-1 On-Demand price is $55.04 (the page is 79% high). p4d.24xlarge is listed
at $32.77 against an actual $21.96 (49% high). hpc7a.96xlarge is priced in a region
where it is not sold. The `spotEstimate` column is fabricated (four different
families all assigned an identical "60% savings") and should be deleted, not
corrected. The `costPerGbps` column is derived arithmetic presented as sourced fact.

**EKS section teaches a wrong practice.** `hostNetwork: true # Required for EFA` is
stated as a requirement with a warning Alert built on top of it. No AWS source says
this; no AWS-authored EFA workload manifest uses it. The confusion is that
`hostNetwork` belongs to the *device plugin DaemonSet*, not to workload pods. Also
wrong: "AWS Batch on EKS with EFA" (Batch MNP is ECS-only) and "cluster placement
group required" (docs say verbatim it is "not an absolute requirement"; same-AZ is
the hard constraint).

## What is genuinely new, worth its own coverage

- **The EKS AMI runs `efa_installer.sh --minimal`** — kernel module plus rdma-core
  only. libfabric, aws-ofi-nccl, NCCL and MPI must all come from your container
  image. This host/container split is the mental model the EKS section should hang
  on and it is currently absent.
- **EFA DRA driver** (`eks/aws-dranet`, added 2026-04-30) is now AWS's recommended
  path on K8s 1.34+, with topology-aware EFA-to-GPU pinning via `pcieRoot`. That is
  also what finally explains p5's 32 EFA devices: 8 GPUs x 4 EFA per PCIe root.
  Not supported on Karpenter or Auto Mode.
- **`DescribeCapacityReservationTopology`** (GA 2025-10-30) lets you rank capacity
  *before* launching, with a guarantee that the CR node set is a prefix of the
  post-launch node set. Entirely missing from the dive.
- **SageMaker has no coverage at all** and carries two valuable negative results:
  EFA is not exposed for managed real-time inference endpoints, and SMDDP is a
  frozen P4-era library (supports no P5/P6/Trn2; last release 2024-10-17).
- **A new silent-failure mode**: NVIDIA k8s-device-plugin v0.19.0+ defaults
  `--mofed-enabled=true` and steals `/dev/infiniband/uverbs*` from the EFA plugin.

## Proposed shape

11 sections -> **24 sections** (8 NEW, 15 REWRITE, 1 KEEP-AND-EXTEND), median ~520
lines, matching vLLM's size band. Includes a 6-tab "Inside the Source" section
walking amzn-drivers, libfabric, aws-ofi-nccl and the EFA installer at pinned commits.

2 diagrams -> **30 diagrams**, all inline SVG, dropping `@xyflow/react` entirely.
Both existing React Flow diagrams have live bugs: every `\n` in a node label
silently collapses to a space, `NetworkTopologyDiagram` has real geometric
collisions, and it models NVSwitch as a 7-edge chain, which is factually wrong.

**Citation architecture**: adopt vLLM's inline pattern exclusively (`[Tier-N: publisher]`
+ `<Link external>` + accessed date under the claim). Delete the dead `SourceCitation`
component. Keep the 70-entry fact-check register but re-key it to section ids and
demote it to a bulk audit index.

## Ratchet gates proposed for scripts/ci.sh

G1 no-ai-tells (em-dash/en-dash/curly quote/banned vocab), G2 citation coverage,
G3 sources.md sync (generate-then-diff), G4 SVG accessibility, G5 data invariants,
G6 real section mount tests, G7 section size floor, G8 required files.
G1/G4/G6/G7/G8 are implementable immediately.

## Open decisions for Carlos

1. Scope: all 24 sections, or a first wave (correctness fixes + the three new AWS
   integration sections) with the rest deferred?
2. Git: ref cleanup only (no force-push), or full normalization of the one
   gmail-authored merge commit (requires a force-push you must run yourself)?
3. Section 18 (ParallelCluster/Batch/Slurm) is the designated cut if scope shrinks.
4. Whether to fix vLLM's template README and missing sources.md in the same pass,
   since the audit found the repo's own sources standard is met by only 1 of 3 dives.

## Environment note

`WebSearch` failed on every call for one agent with
`API Error: 400 output_config.effort 'xhigh' is not supported when thinking is disabled`.
That agent worked around it with direct WebFetch/curl against GitHub raw and the AWS
knowledge MCP tools, which gave better provenance anyway. Worth fixing before the
next research-heavy session.
