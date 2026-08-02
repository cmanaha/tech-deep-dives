# EFA Deep Dive — Revamp Section Architecture and Standards-Compliance Plan

Status: proposed (design only, no code changed)
Date: 2026-08-01
Scope: full revamp of `deep-dives/efa`
Gold standard reference: `deep-dives/vllm` (29 sections + an 8-tab codebase section, 16,262 lines)

---

## 0. What this document is

Four deliverables:

1. A proposed section list for the revamped EFA deep dive, in nav order.
2. A citation architecture decision (one recommendation, argued).
3. A standards-compliance checklist, with the specific file for every mechanical fix.
4. A recommendation on which fixes become Tier 1 deterministic gates in `scripts/ci.sh`.

It is a design document. It does not change any source file.

---

## 1. Baseline: what exists today

### 1.1 Current EFA dive

`deep-dives/efa/src/App.tsx` registers 11 lazy sections, un-numbered in nav:

| # | id | Title | File | Lines |
|---|----|-------|------|-------|
| 1 | `overview` | What is EFA? | `Overview.tsx` | 112 |
| 2 | `architecture` | Architecture & SRD Protocol | `Architecture.tsx` | 344 |
| 3 | `instances` | Instance Support Matrix | `InstanceSupport.tsx` | 229 |
| 4 | `training` | AI/ML Training | `AIMLTraining.tsx` | 336 |
| 5 | `inference` | AI/ML Inference | `AIMLInference.tsx` | 206 |
| 6 | `hpc` | Traditional HPC | `HPC.tsx` | 166 |
| 7 | `comparison` | EFA vs Alternatives | `NetworkComparison.tsx` | 199 |
| 8 | `eks` | EKS & Containers | `EKSIntegration.tsx` | 152 |
| 9 | `pricing` | Pricing Analysis | `Pricing.tsx` | 140 |
| 10 | `decision` | Decision Guide | `DecisionGuide.tsx` | 352 |
| 11 | `sources` | Sources | `Sources.tsx` | 204 |

Total section source: 2,440 lines. Two diagram components (`EFADataPathDiagram.tsx` 106, `NetworkTopologyDiagram.tsx` 233), both React Flow, both imported only by `Architecture.tsx`.

vLLM by comparison: 29 sections, median section 540 lines, smallest real section 266, largest 1,333. EFA is roughly one sixth the depth of the house standard.

### 1.2 Verified defect inventory

Every item below was confirmed by reading the files, not assumed.

| Defect | Verified measurement | Where |
|---|---|---|
| Zero inline citations | `grep -c "<Link"` over `deep-dives/efa/src/sections/*.tsx` returns 0 for all 11 files | all sections |
| Dead shared component | `SourceCitation` is exported from `shared/src/index.ts` and imported by **no** deep dive | `shared/src/components/SourceCitation.tsx` |
| Fact-check register invisible to readers | 70 entries exist only in the Sources tab table | `src/sections/Sources.tsx` |
| Orphan sources | 14 of 39 source ids are never referenced by any fact-check entry: **2, 3, 6, 13, 14, 15, 16, 17, 18, 20, 22, 23, 29, 35** | `src/sections/Sources.tsx` |
| `sources.md` stale | lists 28 sources vs 39 in the app; references `research/efa-research-2026-03-22.md`, a file that does not exist (the whole `research/` tree is empty) | `sources.md:3` |
| Em-dashes | 132 in `src/` + `index.html`; 99 more in `sources.md`; **231 total** | see per-file table in §4.1 |
| En-dashes | 2, both in a numeric range | `src/sections/AIMLInference.tsx:86,87` |
| Curly quotes | 0 (clean today, but unenforced) | n/a |
| Banned LLM vocabulary | 0 hits on the CLAUDE.md banned list (clean today, but unenforced) | n/a |
| Diagram coverage | 2 diagrams, both in one section; 10 of 11 sections have none | `src/sections/Architecture.tsx:46,65` |
| Diagram accessibility | both diagrams have **zero** `role`, `aria-*`, or `<title>` attributes | `src/components/*.tsx` |
| Vacuous test | one test; `expect(container.querySelector(...)).toBeDefined()` passes even when the query returns `null`; and every section is `React.lazy` so no section ever mounts inside it | `src/__tests__/App.test.tsx` |
| Empty tracked dirs | `iac/` empty, `src/data/` empty, `research/` empty | `deep-dives/efa/` |
| Missing README | EFA is the only dive without one (`vllm` and `silicon-memory-inference` both have one) | `deep-dives/efa/` |
| Thin sections | `EKSIntegration` 152, `Pricing` 140, `HPC` 166, `NetworkComparison` 199, `AIMLInference` 206, `InstanceSupport` 229 all under the vLLM floor | see table above |

Two adjacent findings worth recording even though they are outside this revamp's scope:

- `deep-dives/vllm/README.md` is the unmodified `_template/README.md` (it still says "Deep Dive Template" and instructs the reader to copy the template). A copy-paste artifact.
- `deep-dives/vllm/` has no `sources.md`, even though `CLAUDE.md` and `AGENTS.md` both require one per dive. The repo standard is currently satisfied by zero of three dives (EFA's is stale, vLLM's is absent, only `silicon-memory-inference` has a current one).

### 1.3 The overlap constraint nobody has flagged yet

`deep-dives/vllm/src/sections/Ec2TopologyPlacement.tsx` is **790 lines** and already covers `DescribeInstanceTopology`, the `NetworkNodes` hierarchy, cluster placement groups, ODCRs, Capacity Blocks, and the control-vs-observe distinction, with two purpose-built SVG diagrams.

Carlos has asked for "much deeper EC2 Instance Topology API coverage" in EFA. The plan below therefore splits the material deliberately:

- **vLLM section 23 owns the decision framing**: which lever do I pull to get my nodes close, and why is the API not a placement control.
- **EFA section 7 owns the API mechanics and the consumer chain**: request/response shape, layer semantics, `GroupName` and UltraServer identity, prerequisites and supported families, IAM, pagination, staleness, and then the thing vLLM does not cover at all: turning a topology response into a rank assignment that NCCL, MPI, Slurm, and Kubernetes actually consume.

Both sections cross-link to each other. Neither restates the other. If this split is not enforced during authoring, EFA section 7 will become a 640-line duplicate.

---

## 2. Deliverable 1 — Proposed section list

24 sections in nav order. Sizes are targets for the finished `.tsx`, chosen so the band matches vLLM: **median 520, minimum 300, maximum 760**. Nothing under 250.

Nav titles carry numeric prefixes (vLLM convention: `'1. Thesis & Framing'`). EFA currently has none; adding them is part of the rewrite of `App.tsx`.

### Layer A — Framing (sections 1-2)

| # | Title | Purpose (one line) | Target lines | Status |
|---|-------|--------------------|--------------|--------|
| 1 | Why EFA Exists | The kernel network stack is the tax; state the tax, the workloads that cannot pay it, and what EFA does and does not change. | 340 | **REWRITE** of `Overview.tsx` (112) |
| 2 | Your Journey Into EFA | Getting-started map: assumed background, the four prerequisite concepts, the reading path, and how the sections feed each other. | 300 | **NEW** |

Section 2 is mandated by the project's `tech-deep-dive-outline` standard and must sit at position 2 or 3. It is the one prose-first section (diagram optional) and must cover: who this is for (assumed: comfortable with EC2 and Linux, has run a distributed job, no RDMA background assumed); the prerequisite concepts (OS-bypass vs kernel path, collective vs point-to-point communication, intra-node vs inter-node interconnect, the placement/topology distinction) with links to the sections that define each; the sequence of mental models; and a dependency narrative so a newcomer can jump to section 16 without reading 3 through 15 linearly.

### Layer B — Mechanism (sections 3-6)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 3 | The Data Path: OS-Bypass End to End | Follow one message from `ncclSend` to the wire: verbs objects (QP/CQ/PD/AH/MR), memory registration, doorbells, LLQ, MMIO, UARN scoping, GPUDirect RDMA. | 560 | **REWRITE**, split out of `Architecture.tsx` |
| 4 | SRD: The Transport Protocol | Packet spraying across 64 paths, out-of-order delivery, receiver-side reassembly, fast retransmit, congestion control, and why SRD does not need a lossless fabric. | 540 | **REWRITE**, split out of `Architecture.tsx` |
| 5 | The EFA Device: Attachment Modes, Network Cards and Rails | EFA-with-ENA vs EFA-only, network cards vs EFA interfaces vs rails, NCI, MSI-X, huge pages, the self-referencing security group rule, cross-subnet support, driver and installer versions. | 480 | **REWRITE**, split out of `Architecture.tsx` + new material |
| 6 | libfabric and the EFA Provider | The API layer everything above sits on: `fi_info`, RDM vs DGRAM endpoints, eager vs rendezvous protocol selection, the `FI_EFA_*` and `FI_MR_*` tunables, memory registration cache, fork safety. | 520 | **NEW** |

Rationale for the three-way split of `Architecture.tsx`: at 344 lines it currently holds the data path, the protocol, the device model, the attachment modes, the software stack, and the operational gotchas. Those are four different questions with four different audiences. Splitting them is what gets each to vLLM depth instead of each getting a paragraph.

### Layer C — Placement and topology (sections 7-9)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 7 | The EC2 Instance Topology API | Full API mechanics and the consumer chain: request/response shape, `NetworkNodes` layer semantics, `GroupName` and UltraServer identity, `ZoneId`, supported families and prerequisites, IAM action, pagination, staleness, and how to turn a response into a NCCL/MPI rank map, a Slurm `topology.conf`, and Kubernetes node labels. | 640 | **NEW** (Carlos ask **a**) |
| 8 | Placement Groups, Capacity Blocks and UltraClusters | Cluster placement group, ODCR inside a CPG (`cr-cpg`), Capacity Blocks, UltraServer and UltraCluster, the anti-affinity groups that are the wrong tool, and the single-AZ blast radius that EFA forces on you. | 520 | **REWRITE**, extracted from `DecisionGuide.tsx` + `Pricing.tsx` |
| 9 | Instance Support Matrix | Which instances have EFA, how many interfaces, which generation, and the CLI to answer it for any region without trusting this page. | 560 | **KEEP-AND-EXTEND** from `InstanceSupport.tsx` (229) |

Section 7 must open by explicitly stating the boundary with vLLM section 23 and linking to it, then never re-argue the control-vs-observe point.

### Layer D — Collective libraries (sections 10-12)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 10 | NCCL over EFA: the aws-ofi-nccl Plugin | The plugin's real job: provider selection, topology XML vs `sort_rails()`, the tuner model, the env vars that silently disable it, GDR, and version compatibility. | 600 | **REWRITE**, extracted from `AIMLTraining.tsx` |
| 11 | MPI over EFA | Open MPI, Intel MPI, MPICH: how each selects the EFA provider, multi-rail on dual-device instances, and the tuning knobs that actually move the number. | 440 | **REWRITE**, extracted from `HPC.tsx` |
| 12 | Neuron Collectives over EFA | Trainium's path: the dedicated Collective Compute engine, NeuronLink vs EFA scope, NCCOM, and where the Neuron stack diverges from the NCCL model. | 420 | **NEW**, extracted from `AIMLTraining.tsx` |

### Layer E — Workloads (sections 13-15)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 13 | Distributed Training | Parallelism strategy to communication pattern to EFA requirement: DDP, FSDP, TP, PP, EP, and what each does to the wire at 8, 64, and 512 nodes. | 580 | **REWRITE** of `AIMLTraining.tsx` (336) |
| 14 | Inference, KV Transfer and NIXL | Where EFA matters for serving: multi-node TP, disaggregated prefill/decode, NIXL over the libfabric backend, KV migration, and the far larger set of cases where EFA is irrelevant. | 560 | **REWRITE** of `AIMLInference.tsx` (206) |
| 15 | Traditional HPC | Tightly coupled MPI simulation: CFD, weather, molecular dynamics, measured EFA-vs-ENA deltas, and the scaling-efficiency curve that decides whether the cloud is viable for the job. | 480 | **REWRITE** of `HPC.tsx` (166) |

### Layer F — AWS platform surfaces (sections 16-18)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 16 | EFA on Amazon EKS | The full container path: EKS-optimized accelerated AMI contents, the EFA device plugin DaemonSet, `vpc.amazonaws.com/efa` extended resources, VPC CNI versions and EFA-only interfaces, launch templates, huge pages, `hostNetwork` and Multus, Karpenter and node groups, LeaderWorkerSet, and topology-aware scheduling. | 760 | **REWRITE + major extend** of `EKSIntegration.tsx` (152) (Carlos ask **b**) |
| 17 | EFA on SageMaker and HyperPod | The managed path: SageMaker training jobs with EFA, SMDDP, distribution config, and then HyperPod in depth (EKS and Slurm orchestrators, cluster creation, instance groups, health checks and auto-resume, the topology story, and where the EFA knobs are and are not exposed). | 700 | **NEW** (Carlos ask **c**) |
| 18 | EFA on ParallelCluster, Batch and Slurm | The HPC orchestration surfaces the current dive omits entirely: ParallelCluster's EFA config, Batch multi-node parallel jobs, and Slurm topology plugins fed by section 7. | 460 | **NEW** |

Section 18 is the one item on this list not explicitly requested. Justification: it is the primary EFA consumption path for the HPC half of the audience, section 15 currently has no orchestration story, and section 7's topology output needs a real consumer to be more than an API tour. If scope has to be cut, cut this one first.

### Layer G — Inside the source (section 19)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 19 | Inside the Source | Tabbed walkthrough of the code that implements everything above, pinned to specific commits. | 90 shell + 6 tabs × ~420 = ~2,610 | **NEW** |

**Recommendation: yes, do it.** The vLLM precedent works because a reader who has just been told "the scheduler does X" can immediately see the file that does X. EFA has the same opportunity and a better one in a sense: the EFA stack is the rare case where the claims in a marketing page are checkable against open source. But it is a multi-repo story, not a single repo, so the tab structure differs from vLLM's.

Proposed tabs (mirroring `deep-dives/vllm/src/sections/InsideCodebase.tsx`, with tab bodies in `src/sections/source/`):

| Tab | Label | Covers |
|-----|-------|--------|
| 1 | Repo Map & Build Chain | `amzn-drivers`, `rdma-core` EFA provider, `libfabric`, `aws-ofi-nccl`, and how `efa-installer` assembles them into the stack a running instance has. |
| 2 | The Kernel Driver | `amzn-drivers/kernel/linux/efa`: probe, BAR mapping, admin queue, UARN allocation, the verbs ops table. Backs section 3's claims. |
| 3 | The Userspace Provider | `rdma-core` `providers/efa`: QP/CQ/AH creation, the doorbell write path, LLQ descriptor construction. |
| 4 | libfabric `prov/efa` | The RDM endpoint implementation, eager/rendezvous protocol selection, the MR cache, and where each `FI_EFA_*` env var is read. Backs section 6. |
| 5 | aws-ofi-nccl | Plugin entry points, platform detection, the `topology/` XML files, `sort_rails()`, and `tuner/nccl_ofi_tuner.cpp`. Backs section 10. |
| 6 | Diagnostics & Benchmarks | `fi_pingpong`, `fi_info`, `nccl-tests`, and the EFA counters exposed via sysfs/ethtool. Backs section 21. |

Non-negotiable for this section: **every code claim carries a pinned commit SHA**, exactly as vLLM pins to `15652a6b`. Four repos means four SHAs, stated in the section header and repeated in the Glossary and Sources preamble. Without pins this section rots within a release.

### Layer H — Comparison, operations, cost, decision, reference (sections 20-24)

| # | Title | Purpose | Target lines | Status |
|---|-------|---------|--------------|--------|
| 20 | EFA vs the Alternatives | TCP/ENA, InfiniBand, RoCE, NVLink and NVSwitch: what each is actually for, on which axis EFA wins and loses, and the honest statement of where InfiniBand is still ahead. | 460 | **REWRITE** of `NetworkComparison.tsx` (199) |
| 21 | Operations, Observability and Failure Modes | The section the current dive has no version of: bring-up verification, `fi_info` and `fi_pingpong` triage, EFA counters, NCCL debug output that means something, the failure modes (silent TCP fallback, MR cache thrash, wrong topology file, huge-page starvation, cascading Spot interruption) and how each presents. | 620 | **NEW**, absorbs the "Operational Gotchas" block from `Architecture.tsx` |
| 22 | The Cost Model | EFA is free; the instances are not. Cost per Gbps, the placement-group tax, Capacity Blocks vs ODCR vs Spot economics, and the scaling-efficiency term that dominates all of it. | 420 | **REWRITE** of `Pricing.tsx` (140) |
| 23 | Decision Guide | The full decision tree, scenario table, and the startup scaling playbook, now able to link to a real section for every branch. | 560 | **REWRITE** of `DecisionGuide.tsx` (352) |
| 24 | Glossary and Sources | Tier-graded bibliography, the fact-check register, the acronym glossary, the access-date and commit-pin statement. | 320 | **REWRITE** of `Sources.tsx` (204) |

### Size band check

Sorted target sizes for the 23 non-shell sections: 300, 320, 340, 420, 420, 440, 460, 460, 480, 480, 520, 520, **540**, 560, 560, 560, 560, 580, 600, 620, 640, 700, 760.

- Median: **520** (vLLM: 540)
- Minimum: **300** (vLLM: 266)
- Maximum: **760** (vLLM: 1,333)
- Section total: ~11,930 lines, plus ~2,520 for section 19's tabs, plus ~2,400 for roughly 20 new diagram components. Estimated finished dive: **~17,000 lines** against vLLM's 16,262.

### Section count and mapping summary

- **NEW: 8** — sections 2, 6, 7, 12, 17, 18, 19, 21.
- **REWRITE: 15** — sections 1, 3, 4, 5, 8, 10, 11, 13, 14, 15, 16, 20, 22, 23, 24.
- **KEEP-AND-EXTEND: 1** — section 9.
- Total: 24.

Every one of the original 11 files survives in some form. Nothing is deleted outright; `Architecture.tsx` and `AIMLTraining.tsx` are each split across several new files, and `HPC.tsx` donates its MPI content to section 11.

---

## 3. Deliverable 2 — Citation architecture decision

### 3.1 The three options

**Option A — adopt the vLLM inline pattern.** A source note rendered as a `<Box variant="small">` immediately after the claim block it supports, containing a bold `[Tier-N: publisher]` marker and a Cloudscape `<Link external href="...">Title, accessed YYYY-MM-DD</Link>`. Verified in use: 145 `[Tier-` markers across 11 vLLM section files, with `AwsGpuEfaNixl.tsx` at 24, `AwsSageMakerBedrock.tsx` at 41, `Ec2TopologyPlacement.tsx` at 20.

**Option B — revive `SourceCitation`.** The existing dead component renders a superscript `[id]` that opens a Cloudscape `Popover` containing the title, an external link, and the access date.

**Option C — both.**

### 3.2 Recommendation

**Adopt Option A exclusively. Delete `SourceCitation` from `shared/`.**

The two-sentence version, as requested:

> Adopt vLLM's inline pattern (`[Tier-N: publisher]` + `<Link external>` + "accessed YYYY-MM-DD" in a `Box variant="small"` beneath the claim), because it puts the URL, the tier, and the date in the rendered text where the reader can falsify the claim without an interaction, and because it is self-contained per file, so it cannot drift out of sync the way a shared id registry already has. Delete the dead `SourceCitation` component rather than reviving it, and keep the 70-entry fact-check register with a changed job: it stops being the citation surface and becomes the bulk audit index that ADR-002 freshness re-verification runs against.

### 3.3 Why not Option B

Four reasons, in descending weight:

1. **The id registry is the failure mode we are trying to fix.** `SourceCitation` takes an `id` prop that must match an entry in `Sources.tsx`. Nothing enforces the match. That exact coupling has already produced 14 orphan sources and a `sources.md` that is 11 entries behind the app. Reviving the component reintroduces the coupling at 20x the volume (roughly 300 citations across 24 sections instead of 70 register rows).
2. **It hides the evidence behind an interaction.** The Fact-Checking standard exists so a claim is falsifiable at the point of claim. A superscript that must be clicked, on a page most often read on a phone, is a worse hit target and a worse affordance than a visible link with a date.
3. **Its type system does not match the repo's.** `SourceCitationProps['type']` is a 5-value union (`official-docs | blog | github | paper | experiment`) while `SourceType` in `SourcesAppendix.tsx` is a 13-value union. Reviving it means either reconciling the two or accepting a lossy mapping at every call site.
4. **It is not gate-able cheaply.** `[Tier-` and `accessed 20` are greppable strings a shell gate can count per file. `<SourceCitation id={17} />` requires resolving an id across module boundaries to validate, which means either a real parser or a test that imports both modules.

Option C is the worst of both: two visual conventions on one page, plus the id registry, plus double the authoring cost.

### 3.4 What happens to `SourceCitation`

Delete `shared/src/components/SourceCitation.tsx` and its two lines in `shared/src/index.ts`. It has zero consumers across all three dives, verified by grep, so removal is not a breaking change. Record the deletion in a repo-level ADR (see §4.11) so it does not get resurrected by a future agent reading the old export list.

### 3.5 What happens to the 70-entry fact-check register

Keep it. Change its role and enforce the change.

**Today** it is the only citation surface, and it is in the wrong place: a table in the last tab that a reader arrives at after every claim has already been made.

**After the revamp** it is the bulk-audit index. The inline marker makes one claim falsifiable while you read it; the register makes all claims auditable in one pass. These are different jobs and both are needed, specifically because ADR-002 ("Agentic Freshness Verification") proposes an agent that periodically re-verifies cited claims. That agent can re-check ~150 register rows. It cannot re-check 17,000 lines of prose. The register is what makes ADR-002 implementable.

Concrete changes to the register:

- Move it out of JSX into `src/data/factChecks.ts` (see §4.7), alongside `sources.ts` and `glossary.ts`.
- Re-key `section` from a free-text string to the section id (`'topology'`, not `'Architecture & SRD Protocol'`), and assert in a unit test that every value exists in the nav array. Today `section` is free text and nothing checks it, which is why entries reference section titles that the revamp is about to change.
- Prune every entry whose claim does not survive the rewrite; add an entry for every new quantitative claim. Expected final size: roughly 150 to 200 entries for 24 sections.
- Resolve all 14 orphan sources: either attach each to a claim, or drop it. A source in the bibliography that backs nothing is either a missing citation or dead weight, and there is no way to tell which from the outside.
- Add a test asserting per-section consistency: for every section id, the count of `[Tier-` markers in that section's `.tsx` is greater than or equal to the count of register entries keyed to it. This is the mechanical link between the two surfaces. It cannot prove each individual claim is cited, but it makes "70 register entries, zero inline markers" impossible.

### 3.6 The authoring convention, stated precisely

So the authoring agents have one unambiguous target, copied from `deep-dives/vllm/src/sections/AwsEks.tsx:189-201`:

```tsx
<Box variant="small">
  Prose sentence describing what the source establishes.{' '}
  <strong>[Tier-1: AWS EKS docs]</strong>{' '}
  <Link
    external
    href="https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html"
  >
    EKS User Guide: EFA on Amazon EKS, accessed 2026-08-01
  </Link>
  .
</Box>
```

Rules:

- Every `Container` that makes a quantitative or behavioral claim ends with a source note in this shape.
- The tier number matches the tier recorded for that source in `src/data/sources.ts`. Mismatch is a test failure.
- The access date is the real date the source was fetched, formatted `YYYY-MM-DD`, and appears inside the link text so it survives copy-paste.
- A Tier 2 or Tier 3 figure is labeled as such in the prose, not just in the badge. vLLM's convention: "project-claimed and not independently benchmarked here."
- Tier 4 is never cited as fact anywhere.
- Code-level claims in section 19 carry a repo name and pinned SHA in addition to the tier marker.

---

## 4. Deliverable 3 — Standards-compliance checklist

Every mechanical fix, with the file. Ordered by defect class.

### 4.1 Em-dashes (CLAUDE.md "Writing Style: No AI Tells")

231 total. Per-file counts, measured:

| File | Em-dashes |
|------|-----------|
| `deep-dives/efa/sources.md` | 99 |
| `deep-dives/efa/src/sections/Architecture.tsx` | 26 |
| `deep-dives/efa/src/sections/AIMLTraining.tsx` | 24 |
| `deep-dives/efa/src/sections/Sources.tsx` | 22 |
| `deep-dives/efa/src/sections/DecisionGuide.tsx` | 19 |
| `deep-dives/efa/src/sections/Overview.tsx` | 10 |
| `deep-dives/efa/src/sections/AIMLInference.tsx` | 7 |
| `deep-dives/efa/src/sections/HPC.tsx` | 7 |
| `deep-dives/efa/src/sections/InstanceSupport.tsx` | 4 |
| `deep-dives/efa/src/sections/Pricing.tsx` | 4 |
| `deep-dives/efa/src/components/NetworkTopologyDiagram.tsx` | 3 |
| `deep-dives/efa/src/sections/EKSIntegration.tsx` | 2 |
| `deep-dives/efa/src/sections/NetworkComparison.tsx` | 2 |
| `deep-dives/efa/index.html` | 2 |

`&mdash;` entity count: 0.

Note that `index.html` is reader-facing (the `<title>` and the `<meta name="description">`) and is not exempt. Note also that `sources.md`'s 99 are structural field separators in a list format, so the fix there is a format change (switch to a table or a colon), not a character substitution. Because `sources.md` should be generated from `src/data/sources.ts` (§4.3), fixing the generator fixes all 99 at once.

Fix: replace with a comma, colon, parentheses, or a sentence break. Never with an en-dash or a spaced hyphen, which are the same tell wearing a hat.

### 4.2 En-dashes and curly quotes

- En-dash: `deep-dives/efa/src/sections/AIMLInference.tsx:86` (`256KB–1MB`) and `:87` (`30–50%`). Fix: plain hyphen or "to".
- Curly quotes: currently zero across the EFA dive. No fix needed; the gate in §5 prevents reintroduction.
- Banned LLM vocabulary: currently zero hits on the CLAUDE.md list. No fix needed; the gate prevents reintroduction.

### 4.3 `sources.md` sync

Three separate problems in one file:

1. `deep-dives/efa/sources.md:3` cites `research/efa-research-2026-03-22.md` as the extraction origin. The file does not exist and `research/` is empty. Fix: remove the reference, or restore the research note. Given ADR-002's stance that "code and APIs at HEAD don't lie," restoring a real research log under `research/2026-08-refresh/` is the better fix.
2. The file lists 28 sources; `src/sections/Sources.tsx` has 39. Ids 29 through 39 are missing entirely from the markdown.
3. The two will drift again the moment anyone edits one and not the other.

Fix, in the right order: move the source array to `src/data/sources.ts` (§4.7), then add `scripts/gen-sources-md.mjs` that renders `sources.md` from it, then gate on `git diff --exit-code -- deep-dives/*/sources.md` after regeneration. Hand-maintaining two copies of the same list is what produced this defect; the fix is to stop having two copies.

Same treatment applies to `deep-dives/vllm/sources.md`, which does not exist at all.

### 4.4 Orphan sources

14 ids never referenced by any fact-check entry: **2, 3, 6, 13, 14, 15, 16, 17, 18, 20, 22, 23, 29, 35**.

Notably id **29** is the `DescribeInstanceTopology` API reference and id **35** is the NIXL repository, both of which are central to new sections 7 and 14. So several orphans are not junk, they are evidence that the current dive cites a source in its bibliography and then never uses it. The revamp resolves these by writing the sections that should have used them.

Fix: during authoring, every source must be reachable from at least one register entry. Enforced by the unit test in §5 G5.

### 4.5 Missing `README.md`

`deep-dives/efa/README.md` does not exist. EFA is the only dive without one.

Model it on `deep-dives/silicon-memory-inference/README.md`, which is the good example in the repo: thesis, audience, status, layout (a layer-by-layer section listing), and a statement of the per-section invariants. Do **not** model it on `deep-dives/vllm/README.md`, which is the unmodified template.

Required contents for EFA: thesis, audience, status, the 24-section layout grouped by the eight layers above, the access date, the four pinned commit SHAs for section 19, and the invariants each section carries (h1-rooted, inline tier-graded citation with access date, diagram, UNKNOWN flags for unverified numbers).

### 4.6 Empty `iac/`

`deep-dives/efa/iac/` is an empty tracked directory, while `CLAUDE.md` promises "IaC for all cloud resources" and "every experiment has teardown built in."

Two honest options:

- **Populate it** with one minimal, teardown-complete template: a VPC subnet, a self-referencing security group, a cluster placement group, and two EFA-enabled instances, plus a `Makefile` or shell wrapper with a `destroy` target. Add `iac/README.md` stating plainly that the template has **not been run** and that no Tier 0 experimental claim in the dive derives from it. This is the recommended option: it makes the dive reproducible without fabricating an experiment.
- **Delete it** and drop the claim from the dive's README.

What is not acceptable is leaving an empty directory that implies infrastructure exists.

### 4.7 Empty `src/data/`

`deep-dives/efa/src/data/` is empty. It should hold the four datasets currently embedded in JSX:

| New file | Moved from | Why |
|----------|-----------|-----|
| `src/data/sources.ts` | `src/sections/Sources.tsx:6-51` | So `sources.md` can be generated from it and tests can assert on it without parsing JSX |
| `src/data/factChecks.ts` | `src/sections/Sources.tsx:53-145` | So orphan/dangling checks are a unit test, not a manual audit |
| `src/data/glossary.ts` | `src/sections/Sources.tsx:147-195` | So the acronym gate can read the canonical list |
| `src/data/instances.ts` | `src/sections/InstanceSupport.tsx:1-73` | So the instance matrix is data, and section 9 plus section 22's cost-per-Gbps table read the same rows |

This is not tidiness for its own sake. Four of the seven proposed gates become trivial once these are plain data modules, and remain expensive or impossible while they are JSX literals.

### 4.8 Tests

`deep-dives/efa/src/__tests__/App.test.tsx` currently reads:

```tsx
const { container } = render(<App />);
expect(container.querySelector('#root, [class]')).toBeDefined();
```

Two independent reasons this cannot fail: `toBeDefined()` passes when `querySelector` returns `null` (null is defined), and every section is `React.lazy`, so the `Suspense` fallback renders and no section component ever mounts.

Replacement suite, four files:

| File | Asserts |
|------|---------|
| `src/__tests__/App.test.tsx` | App renders; the nav landmark and the default section's `h1` are present (`.not.toBeNull()`, never `toBeDefined()`); resolve the lazy boundary with `findBy*` so a section actually mounts |
| `src/__tests__/sections.test.tsx` | Imports all 24 section modules **eagerly** and renders each; asserts exactly one `h1` per section and a non-empty accessible name |
| `src/__tests__/nav.test.ts` | Section ids unique; `sections[]` and `sectionComponents{}` are bijective (both directions, no extra keys); nav titles carry sequential numeric prefixes |
| `src/__tests__/data-invariants.test.ts` | Zero orphan sources; zero dangling `sourceId`s; every `factCheck.section` is a real section id; every source has an ISO `accessDate`; every glossary acronym is unique; the required-acronym list is fully covered |

Per the repo's `verify-test-can-fail` standard, each new invariant must be proven falsifiable: temporarily inject the forbidden condition (add an orphan source, drop a `sectionComponents` key, remove an `h1`), confirm the test fails with the expected assertion, restore, and confirm restoration by checksum rather than by eyeballing the diff.

### 4.9 Diagrams

Current: 2 diagrams for 11 sections, both React Flow, both in `Architecture.tsx`.

Target: at least one diagram per content section. Sections 2 (prose-first by the outline standard) and 24 (reference appendix) are exempt. That is 22 diagrams for 24 sections, of which 2 exist, so roughly 20 new components.

Tool selection per the Diagram Standards, and the correction the current dive needs: **inline SVG is the default, not React Flow.** vLLM and `silicon-memory-inference` between them contain 68 inline SVGs and EFA contains zero. React Flow earns its weight only when there are many nodes and edges or when pan/zoom helps. Keep `NetworkTopologyDiagram` as React Flow; consider converting `EFADataPathDiagram` (two parallel 6-node columns, no interactivity needed) to inline SVG.

Suggested diagram per section: 1 the kernel-tax comparison; 3 the verbs-object lifecycle and the doorbell/MMIO path; 4 packet spraying across paths and the reorder buffer; 5 network cards vs interfaces vs rails; 6 the libfabric layer stack; 7 the `NetworkNodes` hierarchy and the response-to-rank-map pipeline; 8 the placement-lever decision tree; 9 a bandwidth-by-generation chart; 10 the NCCL to plugin to provider call chain; 11 MPI provider selection; 12 the Neuron CC-engine data flow; 13 communication volume by parallelism strategy; 14 disaggregated prefill/decode with the KV path; 15 the scaling-efficiency curve; 16 the EKS pod-to-EFA resource plumbing; 17 the HyperPod cluster shape; 18 the ParallelCluster/Slurm topology feed; 20 a positioning matrix; 21 a failure-mode triage tree; 22 cost per effective Gbps; 23 the master decision tree.

### 4.10 Diagram accessibility

Neither existing EFA diagram carries any accessibility attribute. Verified: `grep -n "aria-\|role=\|title" deep-dives/efa/src/components/*.tsx` returns nothing.

Requirements, split by tool because they differ:

- **Inline SVG**: `role="img"`, `aria-labelledby` pointing at a `<title id="...">` that describes what the diagram shows in a full sentence, `viewBox` present, `style={{ width: '100%', height: 'auto' }}`, and no fixed pixel `width` attribute. The pattern is in `deep-dives/vllm/src/sections/Ec2TopologyPlacement.tsx:63-150`.
- **React Flow**: the wrapping element carries `role="img"` and an `aria-label` with the same descriptive sentence, since the node graph itself is not readable by assistive technology. Both `deep-dives/efa/src/components/EFADataPathDiagram.tsx` and `NetworkTopologyDiagram.tsx` need this.

Also required by the Diagram Standards: verify no overlapping text or clipped content against the **rendered** output via the Playwright gates (`gate-react-flow-invariants`, `gate-content-overflow`), not against hand-computed coordinates.

### 4.11 ADRs

Two new ADRs, at two different levels, because the decisions have different blast radii:

| File | Records |
|------|---------|
| `docs/adr/0005-inline-citation-architecture.md` (repo level) | The Option A decision, why B and C were rejected, the deletion of `SourceCitation` from `shared/`, the authoring convention from §3.6, and the changed role of the fact-check register. Repo level because it deletes a shared export and binds all future dives. |
| `deep-dives/efa/docs/adr/ADR-004-revamp-section-architecture.md` (dive level) | The 24-section structure, the three-way split of `Architecture.tsx`, the boundary with vLLM section 23, and the decision to build section 19 across four pinned repos. |

Flag while doing this: the repo uses two ADR numbering schemes. `deep-dives/efa/docs/adr/` uses `ADR-001-...` through `ADR-003-...`; `docs/adr/` uses `0004-...`. Pick one and note the inconsistency in whichever ADR lands second. Not worth a migration, worth a sentence.

### 4.12 Acronym standard

Re-ordering the nav from 11 to 24 sections invalidates every existing first-occurrence expansion, because "first occurrence in sequential reading order" is defined by nav order. Every expansion must be re-derived after the section order is frozen, not before.

New acronyms the revamp introduces that need glossary entries and first-use expansion: NCCOM, LWS (already in vLLM's glossary), KEDA, CRD, MNP (Batch multi-node parallel), MR cache, SMP, and the four repo names in section 19. The existing 49-entry glossary in `Sources.tsx:147-195` is a good base and should move to `src/data/glossary.ts` intact.

### 4.13 `App.tsx`

`deep-dives/efa/src/App.tsx` (66 lines) needs: 24 lazy imports, the numbered `sections` array, the matching `sectionComponents` map, and the `siblings` array left as-is (it already links vLLM and `silicon-memory-inference` correctly). Model on `deep-dives/vllm/src/App.tsx` (191 lines), including its comment-grouped import blocks, which make a 24-entry lazy-import list readable.

### 4.14 Deploy workflow

`.github/workflows/deploy.yml` already builds all three dives explicitly and needs no change. `.github/workflows/ci.yml` runs `pnpm lint && typecheck && test && build` and is owned by Carlos; per ADR-0004 it stays decoupled from `scripts/ci.sh` and this plan proposes no edit to it.

---

## 5. Deliverable 4 — Which fixes become Tier 1 gates

ADR-0004's ratchet principle: every real bug found becomes a deterministic gate so it cannot come back. Gate criteria: deterministic, fast, no network, no LLM, same input yields the same verdict.

### 5.1 Proposed gates

Seven new gates. Five are shell scripts under `scripts/gates/`, two are Vitest files that `pnpm test` already runs.

| ID | Gate | Implementation | Catches | Ready now? |
|----|------|----------------|---------|-----------|
| **G1** | `scripts/gates/no-ai-tells.sh` | Grep `deep-dives/*/src/**/*.tsx`, `index.html`, `README.md`, `sources.md` for em-dash, `&mdash;`, en-dash, `&ndash;`, curly quotes, and the CLAUDE.md banned-vocabulary list with word boundaries. Fail on any hit. | The 231 em-dashes, the 2 en-dashes, and every future reintroduction | **Yes** |
| **G2** | `scripts/gates/citation-coverage.sh` | Per section file: assert `count("[Tier-") >= 1`, and `count("accessed 20") >= count("[Tier-")`. Exempt the glossary/sources section and tab-shell files via an explicit list. | "Zero inline citations" as a class | **After** the citation pass lands |
| **G3** | `scripts/gates/sources-sync.sh` | Run `scripts/gen-sources-md.mjs`, then `git diff --exit-code -- deep-dives/*/sources.md`. Also assert every `research/` path referenced in `sources.md` exists on disk. | The 28-vs-39 drift and the dangling `research/` reference | **After** §4.7 and the generator land |
| **G4** | `scripts/gates/svg-a11y.sh` | Every `<svg` in `deep-dives/*/src` has `role="img"`, a `viewBox`, and either `aria-labelledby` or a nested `<title`; no fixed pixel `width=` attribute. Every React Flow wrapper has `role` and `aria-label`. | The two un-labeled React Flow diagrams and every future one | **Yes** |
| **G5** | `src/__tests__/data-invariants.test.ts` | Zero orphans, zero dangling ids, `factCheck.section` is a real section id, ISO access dates, unique glossary acronyms. | The 14 orphan sources and the free-text `section` field | **After** §4.7 |
| **G6** | `src/__tests__/sections.test.tsx` + `nav.test.ts` | Eager-import and render every section, exactly one `h1` each; nav array and component map bijective. | The vacuous test and the lazy-load blind spot | **Yes** |
| **G7** | `scripts/gates/section-size.sh` | No file in `deep-dives/*/src/sections/` below 250 lines, with an explicit exemption list for tab-shell files (vLLM's `InsideCodebase.tsx` is legitimately 80 lines). | The four thin sections | **Yes** |
| **G8** | `scripts/gates/required-files.sh` | Every dive dir has `README.md`, `sources.md`, `docs/adr/`, `src/__tests__/`; no empty tracked directories anywhere under `deep-dives/`. | Missing README, empty `iac/`, empty `src/data/`, empty `research/` | **Yes** |

That is eight; G2, G3, and G5 are gated on prerequisite work landing first, which is stated rather than hidden.

### 5.2 Not recommended as Tier 1 (yet)

- **Acronym first-expansion ordering.** Checking that the first section in nav order containing an acronym also expands it requires stripping JSX to plain text and walking sections in order. Scriptable, but the text extraction is the kind of thing that produces false positives and erodes trust in the gate. Recommendation: start with the cheap half as Tier 1 (every glossary acronym's full form appears somewhere in the dive, and every acronym used appears in the glossary), and leave strict ordering to a Tier 2 advisory agent until the extractor is proven. Ratchet it up later, which is exactly the pattern ADR-0004 describes.
- **Prose word count per section.** Carlos's brief measures thinness in prose words, which is the more honest metric than line count. But extracting prose words from JSX has the same fragility problem. G7's line-count floor is the deterministic proxy; a prose-word count belongs in the Tier 2 advisory layer.
- **External link liveness.** Network-dependent by definition. `ci.sh`'s header already excludes it explicitly. This belongs to the ADR-002 freshness agent, which is the correct owner.

### 5.3 Scoping: the ratchet has to start somewhere

G1, G2, G4, and G7 applied repo-wide would fail immediately on `vllm` and `silicon-memory-inference` as well, because none of the three dives is clean today. Blocking all work on all dives is not the ratchet, it is a wall.

Recommendation: each gate reads a per-dive opt-in list, either a `deep-dives/{topic}/.gates.json` or a hardcoded array at the top of each script. EFA opts into all eight on the day its revamp lands. The other two dives are added one gate at a time as they are cleaned, and the opt-in list itself becomes the visible record of how far the ratchet has turned.

### 5.4 Proposed `scripts/ci.sh` step order

Current order is typecheck, lint, test, build, html-validate. The new static greps are sub-second and should fail first, so a stray em-dash does not cost a full TypeScript build before it reports.

```
1. no-ai-tells        (G1)   <1s
2. required-files     (G8)   <1s
3. svg-a11y           (G4)   <1s
4. section-size       (G7)   <1s
5. citation-coverage  (G2)   <1s
6. sources-sync       (G3)   ~1s   (regenerate + git diff)
7. typecheck                        (existing)
8. lint                             (existing)
9. unit tests         (G5, G6)      (existing runner, new test files)
10. build                           (existing)
11. html-validate                   (existing)
```

Keep `ci.sh`'s existing `--help` behavior, the `step`/`fail` helpers, and the header comment block describing what the script deliberately does not do. Add the new gates to that header so the contract stays self-documenting.

---

## 6. Suggested sequencing

Not part of the four deliverables, but the order matters because several gates depend on structural work.

| Phase | Name | Contents |
|-------|------|----------|
| **P0** | Foundation | §4.7 data extraction, §4.8 test suite, §4.5 README, §4.6 `iac/`, the two ADRs, delete `SourceCitation`. Land G1, G4, G6, G7, G8. |
| **P1** | Structure | Rewrite `App.tsx` to the 24-section nav; create all 24 section files as stubs that render an `h1` plus a TODO; confirm `pnpm gates` is green with G7 temporarily relaxed. |
| **P2** | Mechanism | Sections 1 through 9, with diagrams and inline citations. Land G2 and G3, then restore G7's full floor. |
| **P3** | Stacks and workloads | Sections 10 through 15. |
| **P4** | Platform surfaces | Sections 16, 17, 18. The three Carlos explicitly asked for, plus their diagrams. |
| **P5** | Inside the source | Section 19 and its six tabs, against four pinned SHAs. |
| **P6** | Close | Sections 20 through 24; acronym first-expansion pass across the frozen nav order; `sources.md` regeneration; full `pnpm gates` plus `pnpm audit --with-playwright`. |

`pnpm gates` runs between every phase, per the existing multi-wave authoring convention.
