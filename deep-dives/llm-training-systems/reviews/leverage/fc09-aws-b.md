# Leverage pass fc09-aws-b (sections 23, 24, 25), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Run after the fact check in
`reviews/factcheck/fc09-aws-b.md`; the before-scores are for the files as the fact check left them.

Status: complete. Accuracy holds at 5 on all three files; no claim was added.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| Storage.tsx (23) | 4 | 4 | 5 | 5 | 3 |
| SlurmFamily.tsx (24) | 4 | 4 | 5 | 5 | 3 |
| KubernetesFamily.tsx (25) | 4 | 4 | 5 | 5 | 3 |

Storage: two paths (tokens trickle, checkpoints burst) is a strong model and the sizing table is directly
usable; economy is the weak axis (about 2,400 words of prose in the main component, the length item), with
S3 and connector mechanism detail sitting in the argument rather than behind a disclosure.
Slurm: the three ownership paths and the health-check and auto-resume walk-through are actionable; the
section carries supporting detail (agent-managed parameters, deep-check timings, Capacity Block edges) inline.
Kubernetes: the five-layer stack and the recovery ladder are strong models; the job-API grid and the version
paragraph are dense with evidence a reader only needs when pinning.

## Storage.tsx (section 23)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Intro (two paths) | frames the whole section as a sizing decision | tokens trickle, checkpoints burst; visible in diagram 1 | tells the reader which path to size | kept |
| What the data loader reads, P1 to P2 | derives 0.957 MB/s from MFU, 6N and bytes per token | throughput follows arithmetic, bytes follow vocabulary | stop buying storage throughput for tokens | kept |
| 405B paragraph | proves the picture holds at 16,384 GPUs | same model, larger run | none beyond P1 | demoted into the arithmetic disclosure (now "for 8B, 70B and 405B"), next to the 405B table row it explains |
| Checkpoint beside it | lands the strongest number, 16.46 GB/s and the 17,000x ratio | the gap between the paths | size for the checkpoint | kept; the ratio is repeated in the h1 description and diagram |
| Two paths diagram | one picture of both budgets | visible | where each rate lands | kept |
| Save burst | ties Meta's quote to per-GPU and per-instance shares | burst, not steady state | sizes the write | kept |
| Restart read | the read is on the critical path; the small file system reads in 14 min against 53 s | read time follows capacity on FSx | grow the file system until the read fits the restart budget; keep the index cache shared | reordered: the FSx read-time payoff now follows the critical-path sentence directly; MegaScale and OPT-175B evidence demoted into "What MegaScale and OPT-175B report about the restart read" |
| Start-up storm, non-text | request-rate and listing limits at launch | requests per prefix, listing cost | few hundred large shards | kept |
| FSx, S3, connector | tier limits that bind | throughput bought with capacity | choose tier, prefix spread, thread count, pinned stager | kept |
| Mountpoint | suits reading shards; a DCP save into it fails at its last step (ours, not run) | rename semantics decide the write path | write checkpoints through the connector or FSx | reordered: the conclusion, with its "not run" label, follows the use case; the rename evidence chain (SEMANTICS.md L8, L20-L21, filesystem.py L762-L798) demoted into "Why a DCP save into Mountpoint fails at its last step, in our reading" |
| Instance store, host memory | what survives a replacement | ephemeral tiers are caches | use as cache, keep durable copy in S3 | kept |
| Storage plan | the reader's next actions, ending on timing one save and one read | n/a | ordered list | kept; ends on the action |

## SlurmFamily.tsx (section 24)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Intro | what Slurm does for a job and the three AWS paths | controller plus node daemons; one script | pick by what the team owns | kept |
| One script, four layers | the script travels; the layers under it change hands | visible in diagram 1 | write once, check the checkpoint interval | kept |
| Your own Slurm | HealthCheckProgram limits, the suite, requeue | periodic checks hold quick tests only | what to script | kept |
| PCS | AMI rules, size fixed at creation, the version clock, health and reboot | managed controller over your nodes | size, upgrade cadence, reboot path, Capacity Block edge | kept |
| HyperPod Slurm | two tiers of health checks, auto-resume, the spare node | visible in diagram 2 | keep one spare worker | the 2025-09-11 agent date and its AMI-update note moved out of the health paragraph into the "Dated changes" disclosure, where the same date already sat; the doc-versus-doc 16-node conflict kept in the body |
| Fees | what each path costs beyond the instances | 1% versus 20% | budget | kept |
| Setup lists | the reader's next actions | n/a | per path | kept |

## KubernetesFamily.tsx (section 25)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Intro | Kubernetes lacks gang admission and job restart | the gap between pods and ranks | decide which pieces to own | kept |
| Five layers | the stack and who owns each layer | visible in diagram 1 | read your path's column | kept (acronyms now expanded above the diagram, a fact-check fix) |
| Layers 1 and 2 | provisioning, the Auto Mode fee, the Capacity Block edges, device plugins | fixed fleet versus per-node fee | the $60,870 a month choice; save before the earlier edge | kept |
| Layer 3 | gang admission and topology labels | all ranks or none | install Kueue, choose a layer | kept |
| Layer 4 | four job APIs, each with a status warning | one resource per job | start from JobSet, pin versions | kept |
| Layer 5 self-managed | what node repair does and does not do | node back, then job back | budget the repair wait, own the restart | kept |
| Batch on EKS | an overlay; two open pieces | outside-in scheduling | fits many independent jobs | kept; hedges unchanged |
| HyperPod EKS | health, admission, restart, versions; A4 protocol | AWS takes the nodes | confirm the operator on your versions | kept; A4 stays labelled "not yet run" |
| Checkpointless | recovery from peers, priced in HBM | visible in diagram 2 | 6.61 GB of each H100 | kept |
| Assemble | two recipes and three checks | n/a | the reader's next actions | kept |

Section 25 already reads forward and keeps its supporting arithmetic in a disclosure; no leverage edit
earned its place beyond the fact-check fixes.

## Claim-set diff against HEAD

`git diff` on the three files. Every assertion in the after was already on the page or is a fact-check
correction recorded in `reviews/factcheck/fc09-aws-b.md` with its source:
- Storage: the 405B paragraph, the MegaScale and OPT-175B sentences and the Mountpoint rename chain moved
  verbatim with their Cites into disclosures; "bottleneck there" became "bottleneck of that read" and "In our
  reading of both" became "In our reading of Mountpoint's semantics and DCP's writer", same claims.
- Slurm: the 2025-09-11 clause deleted from the body; the disclosure now carries "which an older cluster gets
  by updating to the latest AMI", the same claim with the same Cite (`HP_AUTO_RESUME`).
- Kubernetes: "Your training container, with its framework and NCCL, runs on top" restates diagram 1's
  container bar; "Device plugins, or the Neuron DRA driver for Trainium" restates the Neuron paragraph and
  its Cite (`EKS_NEURON`).
Nothing new without a source. Venue badges, "not run" and "not yet run" labels, hedges, vendor attributions
and the strongest numbers (0.957 MB/s against 16.46 GB/s; the 45 to 90 minutes; 6.61 GB of each H100) are
unchanged.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| Storage.tsx (23) | 4 | 4 | 5 | 5 | 4 |
| SlurmFamily.tsx (24) | 4 | 4 | 5 | 5 | 3 |
| KubernetesFamily.tsx (25) | 4 | 4 | 5 | 5 | 3 |

Storage's economy rises a point: three supporting-evidence blocks (about 250 words) now sit behind
disclosures, and the restart read leads with the read-time number. Slurm and Kubernetes hold; their
remaining length is decision content (prices, version windows, settings) rather than evidence.

## Harness and checks

Harness (`vite build` to /tmp/lts-dist-fc09, shoot.mjs on port 4709): storage, slurm, kubernetes at 1440 and
390 all "ok" (1, 2 and 2 SVG diagrams); no diagram geometry or table was changed.
typecheck exit 0 (`tsc --noEmit`, no output); lint exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no
output); test exit 0 ("Test Files 6 passed (6)", "Tests 168 passed (168)"); no-ai-tells, pinned-refs,
svg-a11y and pre-overflow all PASS.
