# EFA (Elastic Fabric Adapter) Deep Dive

Interactive single-page app about AWS EFA: what the device does, how SRD (Scalable
Reliable Datagram) differs from TCP, which EC2 instances carry it, how it reaches
containers, and when it pays for itself.

The dive answers three questions a team actually has to settle before it spends money.
Does this workload need EFA at all? Which instance family and how many devices? What
breaks when you put it behind Kubernetes or a managed training service?

## Status

Current as of 2026-10-23. The August 2026 revamp rewrote every section against pinned
source code and Tier 1 documentation; the October 2026 refresh re-verified 306 claims,
moved every code pin to the current release, and closed the carry-forward open items.
The plans are `revamp/REVAMP-PLAN.md` (August) and `revamp/REVAMP-2026-10.md` (October).

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

Twenty sections, wired in `src/App.tsx` in reading order:

| # | id | Title | Covers |
|---|---|---|---|
| 1 | `overview` | What is EFA? | OS-bypass model, encryption, cost, the three layers |
| 2 | `datapath` | The Data Path: OS-Bypass End to End | Control plane versus data plane, kernel verbs, Data Path Direct, GPUDirect RDMA |
| 3 | `srd` | SRD: The Transport Protocol | Multi-path spraying, out-of-order delivery, the libfabric reorder window, error codes |
| 4 | `device` | The EFA Device: Attachment, Cards and Rails | Interface shapes, network cards, device generations, driver channels |
| 5 | `libfabric` | libfabric and the EFA Provider | Fabrics, protocol ladder, environment variables, doc-versus-code conflicts |
| 6 | `ena` | ENA and EFA: Two Devices, One Nitro Card | Who writes the descriptor, LLQ, ENA Express |
| 7 | `topology` | The EC2 Instance Topology API | Network-node layers, capacity reservation topology, EKS labels |
| 8 | `instances` | Instance Support Matrix | Every EFA instance row, EFA and Nitro generation, P6e-GB200 sources |
| 9 | `nccl` | NCCL over EFA: the aws-ofi-nccl Plugin | Plugin layers, platform defaults, tuner, GIN and GDAKI |
| 10 | `training` | AI/ML Training | Collectives at scale, rails, Trainium |
| 11 | `inference` | AI/ML Inference | Disaggregated serving, NIXL backends, vLLM |
| 12 | `hpc` | Traditional HPC | MPI over EFA, multi-rail, HPC families |
| 13 | `storage` | Storage Data Paths: FSx, S3 and the CRT | FSx for Lustre with EFA and GDS, the CRT S3 client |
| 14 | `comparison` | EFA vs Alternatives | TCP, InfiniBand, RoCE, NVLink |
| 15 | `eks` | EFA on Amazon EKS | AMIs, device plugin versus DRA driver, Karpenter, Auto Mode |
| 16 | `sagemaker` | EFA on SageMaker and HyperPod | Training jobs, SDK environment, DLCs, HyperPod AMIs, SMDDP |
| 17 | `operations` | Operations, Observability and Failure Modes | Counters, failure signatures, installer and driver channels |
| 18 | `pricing` | Pricing Analysis | On-Demand rates from the Price List API, Capacity Blocks, capacity paths |
| 19 | `decision` | Decision Guide | When EFA pays, which instance, which capacity path |
| 20 | `sources` | Sources | Appendix sources, fact-check register, glossary |

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

Two refresh directories, each built as claim registers with pinned evidence:

- `research/2026-08-refresh/`: seven research reports (`01-efa-core.md` to
  `07-storage-datapaths.md`) and three adversarial verification passes
  (`V1-verify-efa-core.md`, `V2-verify-pricing.md`, `V3-verify-eks.md`).
- `research/2026-10-refresh/`: four claim registers (`01-software-stack.md`,
  `02-instances-pricing.md`, `03-integrations.md`, `04-open-items-sweep.md`), one
  authoring log per section group with its claim diff, and the adversarial fact check of
  the October changes.

Standards that govern every edit sit in `revamp/`: `section-shape-standard.md`,
`source-authority-standard.md`, `leverage-pass-standard.md` and `diagram-plan.md`.

Architecture decisions are in `docs/adr/`: ADR-001 tech stack, ADR-002 freshness
verification, ADR-003 iteration flywheel, ADR-004 citation architecture.

## Known gaps

Open after the October 2026 refresh. Each is scoped on the page where it matters.

1. `iac/` is empty. No Tier 0 experiment has been run.
2. P6e-GB200 hypervisor: the EC2 User Guide lists it under Nitro v6 (EFA v4); the
   accelerated computing instance-types page gives Nitro v5. Doc versus doc, unresolved.
3. EC2 topology API throttle limits: no AWS figure located.
4. Capacity Blocks: the documented shutdown-warning timing for UltraServer blocks (40
   and 70 minutes on different pages) is inconsistent; the January 2026 price change is
   unverified and not published.
5. EKS version floors (device plugin, eksctl, Bottlerocket) were removed from the EKS
   documentation; only the VPC CNI 1.18.5 floor for efa-only interfaces is current.
6. Whether rdma-core older than v64.0 binds on an 0xefa4 host is not established.
7. `scripts/audit/verify-citations.sh` does not parse citations built through local helper
   functions, so its extract understates this dive's code citations (proposal recorded
   in the October stream report).
