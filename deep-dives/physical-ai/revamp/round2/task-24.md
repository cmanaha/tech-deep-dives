# Task: rework section 24 into the AWS overview

You are reworking one section of the published deep dive "Physical AI" (Vite + React + TypeScript + Cloudscape) in
this git worktree; dive directory `deep-dives/physical-ai/`. FIRST read `revamp/round2/authoring-brief-aws.md`
(its header rules, "Why these sections exist", the checks and the return format apply to you; its seven-block
section order does NOT: yours is below), then `revamp/authoring-brief.md` in full, then `SCOPE.md` section
"Round 2 (2026-11-20): the 30-section plan". Rule to keep and to hand verbatim to any subagent: never put personal
data (names, email addresses, account ids, hostnames, home-directory paths) in any request, header, User-Agent,
URL or query string.

You own: `src/sections/AwsOrchestration.tsx` (export `AwsOrchestration`; h1 exactly
"24. Orchestrating Physical AI on AWS"), `revamp/claims/aws-orchestration.md`,
`revamp/glossary/aws-orchestration.json`. Section id `aws-orchestration`, check port 4484, slug `orch`.
Edit nothing else.

## What changes

The section was written as the only AWS section: it carried Batch, HyperPod and EKS in depth, with snippets. Each
orchestrator now has its own section (25 AWS Batch, 26 AWS Parallel Computing Service, 27 Amazon SageMaker
HyperPod, 28 Amazon EKS), written by other authors from the new registers `research/2026-11/10a-aws-batch.md`,
`10b-aws-pcs-hyperpod.md` and `10c-aws-eks-spot.md`. Section 24 becomes the overview they hang from. The owner's
words: "I need basically to split the 15 workloads or 5 workloads in AWS"; the figure of where the five shapes
land "is a super crappy graph, that's a decision graph", it does not illustrate "what we should get out from
this." He wants the physical AI process in front: each workload introduced by what it does in the robot's loop.

## The section, in this order

1. **Opening.** What the section is: the map from the robot's loop to AWS. It depends on section 20 (the fifteen
   workloads and their shapes).
2. **The loop on AWS.** Mount `LoopOnAws` from `../components/LoopOnAws` with `emphasis="service"` (read the
   component: six stages, each with what it does, what it loads, where it runs). It replaces the old
   "jobs landing" animated figure (`JobsLandingDiagram`, `LandingBox`): delete those. Pass `cites` with the
   register entries behind its placements (F08-76, F09-5, F09-78, F09-81, F09-84, F09-100, F09-102, F09-110,
   F07-84 and others you verify) and a caption. Around it, prose that walks the loop once.
3. **The fifteen workloads placed.** One table, grouped by loop stage (collect, curate, simulate, train,
   evaluate, deploy): workload, what it does in the loop in a few words, job shape in plain words (many small
   independent jobs; one GPU for hours; many nodes for days; a service that stays up; on the device), the
   scheduler, the section that takes it apart. This is the dive's reading; say so once and cite the entries.
   Workloads that run at the edge say so. Use the workload names of `src/sections/Workloads.tsx`.
4. **The four orchestrators, each introduced by what it is and when to use it.** One short block per service
   (Batch, PCS, HyperPod, EKS): what it is in two sentences, the situation that calls for it, the situation that
   does not, and a pointer to its section. A compact side-by-side table of the four on the same rows (what you
   submit, what waits where, who starts instances, scale to zero, Spot, multi-node training, what you operate
   yourself) is welcome, with every cell backed by an entry from registers 09 and 10. Keep the existing
   three-layers diagram (`ThreeLayersDiagram`) only if it still teaches; update it to name four orchestrators.
   Move depth out: the Batch, HyperPod and EKS snippets and their long paragraphs leave this section (the other
   authors rebuild them). Keep at most one short snippet if it serves the overview.
5. **The capacity markets.** Keep and tighten what exists: On-Demand, Spot (the two-minute notice, what AWS
   recommends), On-Demand Capacity Reservations, Capacity Blocks, training plans, and which instance families each
   reaches. Register `10c` (F10-520 onward) has deeper Spot entries: use them for the Spot paragraph (the notice,
   the rebalance recommendation, the recommended allocation strategy, checkpointing advice). No prices.
6. **The glue.** Keep: S3 events, EventBridge, Step Functions, registry, storage, DCV. Keep the edge path
   (Greengrass) and its placeholder block exactly as it is.
7. **Close** on the reader's next action: pick the section of the scheduler your workload landed on, then
   section 29, Choosing.

Read the three register-10 files' sections 6 to 10 (cluster drawn, recommended configuration, workload fit, what
it does poorly, contradictions with register 09) before writing; where register 10 corrects register 09, the page
follows register 10. Define at first use every term the reader review flagged in this section: ODCR, Trainium,
SageMaker Training Jobs (see `revamp/reviews/reader.md`, section 24 and the cross-cutting list). Target 1,800 to
2,600 words: the section gets shorter than it was. Existing placeholders stay; add none.

All sections after 24 were renumbered: Choosing is 29, Glossary and Sources is 30. Run
`node revamp/tools/check-renumber.mjs` as well as the checks in the brief.
