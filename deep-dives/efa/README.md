# EFA (Elastic Fabric Adapter) Deep Dive

Interactive single-page app about AWS EFA: what the device does, how SRD (Scalable
Reliable Datagram) differs from TCP, which EC2 instances carry it, how it reaches
containers, and when it pays for itself.

The dive answers three questions a team actually has to settle before it spends money.
Does this workload need EFA at all? Which instance family and how many devices? What
breaks when you put it behind Kubernetes or a managed training service?

## Status: mid-revamp

The published app is the 2026-03 build. A full re-verification wave ran on 2026-08-01
and found correctness errors, not just staleness. Nothing under `src/` has been
rewritten yet.

Read `revamp/REVAMP-PLAN.md` and `revamp/VERIFICATION-SUMMARY.md` before editing any
section. Several claims in the live app are known wrong and are listed there with the
code that refutes them.

`iac/` is empty. Tier 0 evidence (our own measurements) needs an AWS account with P5,
P6 or Trn2 capacity, and that access does not exist yet. Until it does, every number in
this dive traces to documentation, to source code, or to third-party measurement.
Nothing here is first-party experimental data.

## Audience

Technical leads and solution architects sizing a distributed training, inference, or
HPC (High-Performance Computing) workload on AWS. The dive skips networking basics and
goes straight to architecture decisions, generation differences, cost, and the failure
modes that only show up at scale.

## Section map

Eleven sections, wired in `src/App.tsx`, rendered in left-side navigation:

| # | id | Title | Covers |
|---|---|---|---|
| 1 | `overview` | What is EFA? | OS-bypass model, what EFA replaces, what it costs |
| 2 | `architecture` | Architecture and SRD Protocol | SRD, packet spraying, device generations, NCCL topology |
| 3 | `instances` | Instance Support Matrix | 23 instance rows: device counts, bandwidth, generation |
| 4 | `training` | AI/ML Training | Collectives, scaling efficiency, Trainium, the tuner |
| 5 | `inference` | AI/ML Inference | Disaggregated prefill and decode, NIXL (NVIDIA Inference Xfer Library), KV-cache transfer |
| 6 | `hpc` | Traditional HPC | MPI (Message Passing Interface), CFD, multi-rail EFA |
| 7 | `comparison` | EFA vs Alternatives | TCP, InfiniBand, RoCE, latency and flow limits |
| 8 | `eks` | EKS and Containers | Device plugin, VPC CNI, huge pages, manifests |
| 9 | `pricing` | Pricing Analysis | On-Demand rates per family, cost per Gbps |
| 10 | `decision` | Decision Guide | When EFA is worth it, scenario table |
| 11 | `sources` | Sources | 39-source appendix, 70-entry fact-check register, glossary |

The revamp plan replaces this with 25 sections. Treat the table above as the current
state, not the target.

## Running it locally

From the repo root:

```
pnpm install
pnpm --filter @tech-deep-dives/efa dev
pnpm --filter @tech-deep-dives/efa build
```

Per-package checks:

```
pnpm --filter @tech-deep-dives/efa lint
pnpm --filter @tech-deep-dives/efa typecheck
pnpm --filter @tech-deep-dives/efa test
```

The gate that has to pass before a commit, run from the repo root:

```
pnpm gates
```

`pnpm gates` runs `scripts/ci.sh`: typecheck, then lint, then unit tests, then build,
then html-validate, across every dive in the monorepo. It runs no agents and calls no
model, so it is deterministic and fast enough for the every-commit rhythm. See ADR-004
in `docs/adr/` at the repo root.

## Sourcing standard

### Code is the authority

Everything else is orientation. Ordered strongest first:

1. Source code at a pinned commit. The implementation is what runs. This is the only
   thing that settles a disputed technical claim.
2. Official AWS documentation. A secondary check, and the only source for intent,
   support statements, and pricing.
3. Code comments, in-repo README files, in-repo spec and design documents. Not
   authoritative. Use them to navigate the code, never as proof of behavior.
4. Everything else: blogs, talks, third-party analysis. Inspiration only.

Where code and documentation disagree, code wins, and the disagreement is itself
publishable content. The rule and the case that produced it are in
`revamp/source-authority-standard.md`. The short version: the live app says RDMA Read
and Write are emulated in software, sourced from `SRD.txt`, a 2019 spec file sitting in
the same repository whose code declares both as hardware opcodes.

### The four provenance categories

Every claim must fall into one of these, and the rendered page has to show the reader
which one:

- **A. Documented.** AWS states it. Cite the doc URL and the access date.
- **B. Code-confirmed.** AWS documents it and the code agrees. Cite both. Strongest
  category.
- **C. Code-derived inference.** AWS documents nothing; the claim comes from reading
  the implementation. Cite repository, commit SHA, file path, line number, and the date
  read. The page must say plainly that this is inferred from source and is not an AWS
  statement.
- **D. Doc-code contradiction.** Both sides cited, the code's reading marked
  authoritative, the stale document named.

Pin to a commit SHA or a release tag. Never to `main` or `master`. A verification pass
has to be able to re-fetch that exact file at that exact SHA and confirm the quoted line
still says what we say it says.

### Tier grading

Repo-wide, from CLAUDE.md and ADR-002: Tier 0 (our own experiments) beats Tier 1
(official docs, API reference, source code), which beats Tier 2 (AWS blogs, product
pages, announcements), which beats Tier 3 (third-party analysis, papers, benchmarks).
Tier 4 (tutorials, unverified posts) is inspiration only and is never cited as fact.

`sources.md` is the plain-text register of all 39 sources declared in
`src/sections/Sources.tsx`, grouped by tier, with dead links and orphans marked.

## Where the research lives

`research/2026-08-refresh/`. Seven research reports and three adversarial verification
passes, 2026-08-01, roughly 380 verified facts.

| File | Covers |
|---|---|
| `01-efa-core.md` | SRD internals, the `amzn-drivers` EFA kernel driver, the libfabric EFA provider data path, device generations, GPUDirect RDMA and Async, the aws-ofi-nccl plugin and its tuner |
| `02-ec2-topology-api.md` | `DescribeInstanceTopology` and `DescribeCapacityReservationTopology`, network-node hierarchy, consumers (Slurm, MPI, NCCL, Kueue), relation to placement groups and Capacity Blocks |
| `03-efa-eks.md` | EKS (Elastic Kubernetes Service) AMI build, `efa_installer.sh --minimal`, the EFA device plugin, the aws-dranet DRA (Dynamic Resource Allocation) driver, Bottlerocket |
| `04-efa-sagemaker.md` | SageMaker Training Jobs, HyperPod on Slurm and EKS, SMDDP, model parallel, and the negative result on managed inference endpoints |
| `05-instances-pricing.md` | Full EFA instance list, device counts, bandwidth, EFA generation, and us-east-1 On-Demand pricing |
| `06-ena-vs-efa.md` | What ENA (Elastic Network Adapter) actually is, the ENA-to-EFA device relationship read from PCI IDs and probe paths, ENA Express, and why "SRD is built on ENA" is wrong |
| `07-storage-datapaths.md` | S3 with the CRT (Common Runtime) over ENA, FSx for Lustre with EFA and GDS (GPUDirect Storage), multi-NIC binding, and the absence of any EFA path to S3 |
| `V1-verify-efa-core.md` | Adversarial verification of 01. One claim refuted, five downgraded to partly-correct |
| `V2-verify-pricing.md` | Adversarial verification of 05. All seven price claims confirmed against the AWS bulk price list; our causal story about when prices changed was wrong |
| `V3-verify-eks.md` | Adversarial verification of 03. The `hostNetwork` claim refuted as worded; the `--minimal` exclusion list corrected |

Planning artifacts sit in `revamp/` and are temporary. Promote or delete them after the
rewrite lands: `REVAMP-PLAN.md`, `section-architecture.md`, `diagram-plan.md`,
`source-authority-standard.md`, `VERIFICATION-SUMMARY.md`, `git-authorship-findings.md`.

Architecture decisions are in `docs/adr/`: ADR-001 tech stack, ADR-002 freshness
verification, ADR-003 iteration flywheel.

## Known gaps

Content correctness, from the 2026-08-01 verification wave:

1. **Pricing is wrong by enough to mislead a cost decision.** p5.48xlarge is shown at
   $98.32/hr against an actual $55.04 us-east-1 On-Demand. p4d.24xlarge is shown at
   $32.77 against $21.96. hpc7a.96xlarge is priced in a region where it is not sold.
   The Spot estimate column is fabricated (four families all assigned an identical 60%
   saving) and should be deleted rather than corrected.
2. **The instance matrix is off by one generation.** AWS reads Nitro v6 as EFA v4,
   Nitro v5 as EFA v3, and so on. The dive shifts this, corrupting 15 of 23 rows and 3
   of 4 generation cards. The whole G family is missing.
3. **The "proof of OS bypass" argument is dead.** It rested on the kernel driver
   omitting `post_send`, `post_recv` and `poll_cq`. Driver r2.12.0 added a 798-line
   `efa_data_verbs.c` that implements all three.
4. **"RDMA Read and Write are emulated in software" is wrong.** Both are hardware
   opcodes. The claim came from `SRD.txt`. Do not cite `SRD.txt`.
5. **The EKS section teaches a wrong practice.** `hostNetwork: true # Required for EFA`
   is not a requirement for workload pods. It belongs to the device plugin DaemonSet.
6. A fourth device generation, EFA v4 on Nitro v6, is never mentioned. The device-ID
   reading behind that label is our own inference and needs a SPECULATIVE label.

Citation integrity, from `docs/verification/2026-08-01/P4-link-rot-citation-integrity.md`:

7. **Six of 39 source URLs are dead** (ids 32, 33, 36, 37, 38, 39). Two live claims rest
   on the deleted NIXL libfabric README: "NIXL requires libfabric 1.21.0+" and "EFA is
   the only validated libfabric provider for NIXL". Source 39 is also misattributed:
   there is no `NVIDIA/uccl` repository and there never was.
8. **No inline citations exist anywhere in section prose.** All 39 URLs appear only in
   `Sources.tsx`. A reader who wants the source for a number in Architecture has to
   scroll to the appendix and match the claim string by hand.
9. **14 of 39 sources are orphans**, referenced by no fact-check entry.
10. **The most-cited source is a Tier 3 personal blog.** `ernestchiang.com` carries 12
    of 70 fact-check entries, including every core SRD latency number. The IEEE Micro
    2020 SRD paper by Shalev et al. is not in the sources array at all.
11. **Access dates are bulk stamps, not per-fetch evidence.** All 39 entries read
    `2026-03-22`. The content was re-verified in 2026-08 and the stamps were not touched.
12. Source titles in `Sources.tsx` contain em-dash characters. They render to the
    reader, and the repo writing standard bans them in reader-facing text.

Process:

13. `iac/` is empty. No Tier 0 experiment has been run, and none can be until AWS
    account access lands.
14. Open research item U-5: whether the CRT Java and Python bindings discover network
    interfaces above the C client. This must be resolved before the storage
    doc-versus-code finding ships.
