# Leverage pass fc10-aws-c (sections 26, 28), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc10-aws-c.md`; the
post-fact-check state is saved in `/tmp/lts-fc-fc10-preleverage/` for the claim-set diff.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| TrainingJobs.tsx | 4 | 5 | 5 | 5 | 3 |
| ChoosingPath.tsx | 5 | 5 | 5 | 5 | 4 |

Reader words outside code, Cites and disclosures (rough count from the source): TrainingJobs about 2,330,
ChoosingPath about 2,060. TrainingJobs's weak axis is economy: the SDK block carries two paragraphs of
library release history and SDK wiring (SMP v2 and SMDDP) in the argument's path, ahead of the one
sentence the reader acts on (bring your own stack).

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how the
reader uses it.

### TrainingJobs.tsx (section 26, SageMaker Training Jobs)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | A training job is a cluster that exists for one job, at 1.15 times EC2 | Cluster per job; drawn in the lifecycle diagram | Decide whether the contract fits the run |
| A job's life | Which statuses a job passes through and which stretches bill | Billing from TrainingStartTime to TrainingEndTime; the lifecycle diagram's billing lane | Set a stopping condition (ModelTrainer stops at 3,600 s otherwise); save inside the 120 s SIGTERM window; watch SecondaryStatus |
| Checkpoints | What crosses from one attempt to the next | One S3 prefix synced both ways; drawn in the diagram's S3 band | Name the prefix yourself; per-rank files; prune old steps |
| Warm pools, Spot, training plans | Three ways to wait less or pay less | One column per option | Pick by working pattern; save before each block's edge, threshold above 30 minutes |
| GPU fails mid-job | What SageMaker repairs and what stays with the script | Repair after failure, restart from the checkpoint | Turn on the infrastructure check; keep a recent checkpoint |
| Team queues and CPU helpers | Batch queues for teams, CPU groups for preprocessing | Batch holds the queue, SageMaker runs the job | Use TrainingQueue for shared capacity; skip CPU groups for text |
| SDK and libraries | Which SDK to write against, and whether to use AWS's libraries | ModelTrainer replaces the estimators | Pin SDK v3; dry-run; bring FSDP2, TorchTitan or Megatron Core in your own container |
| SMP v2 and SMDDP (expandable, new) | The release dates and the SDK v3 wiring behind that advice, with the doc-code conflict | Supporting | For the reader who uses SMP anyway or checks our reading |
| HyperPod recipes | What the recipes give a training-job user | One pre-training recipe, the rest fine-tuning, post-training and evaluation | Start fine-tuning from a recipe; bring your own stack for pre-training |
| Recipe collection across releases (expandable) | Why older tutorials name recipes that are gone | Supporting | Use the v1 line for a v1 recipe path |
| When a cluster per job is the right shape | Price per busy hour, the 28-day limit, the next action | Per-job billing against a standing cluster's idle hours | Choose the path; run the stop-and-resume test before scaling |

Edits (four verbs only):
- **Demote.** The SMP v2 and SMDDP paragraphs (release dates, what SMP adds, the SDK v3 wiring and its
  doc-code conflict) moved into an `ExpandableSection` "SMP v2 and SMDDP: what they add, how SDK v3 wires
  SMP, and their last releases". Every Cite moved with its sentence; the doc-code conflict is kept whole.
- **Re-express.** The conclusion that had closed the SMDDP paragraph now stands in the main flow ahead
  of the disclosure: "SMP v2 and SMDDP are AWS's own training libraries, and neither has released in
  more than 18 months (release dates below). Our reading: a new project on P5 or P6 gets current PyTorch
  and NCCL by bringing FSDP2, TorchTitan or Megatron Core in its own container." The acronym expansions
  moved to this first visible use.
- Access dates: rows fc10 re-opened on 2026-10-31 (pricing page, Price List, HyperPod Slurm page,
  recipes v1.5.1 tree and v2.0.0 notes) dropped their 2026-10-30 date; the Capacity Blocks pricing page
  was not re-opened and keeps it.

### ChoosingPath.tsx (section 28, Choosing Your Path)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Every path runs the same step; the paths differ in the work around it, and the fees sit far apart | Who does the work around the step; 1.2% against 20.0% | Frames the four questions |
| Four questions, seven paths | The decision tree with fees and remaining work per leaf | The tree is the model, drawn | Walk to a leaf; read its fee and what stays with the team |
| How each fee line is computed (expandable) | The arithmetic and the offer versions | Supporting | Re-price for another fleet or Region |
| Question 1 | Cluster per job against a standing cluster | Per-job billing against idle hours | Pick training jobs when every run fits 28 days |
| Question 2 | Why gang scheduling separates Slurm from Kubernetes | All-or-nothing admission | Stay in the family the team already runs |
| Question 3 | What each fee buys in node and job recovery | Two recoveries, node and job | Weigh $15,165 against $253,624 a month against what the team would build |
| Question 4 | What changes on Trainium | Capacity and health checks differ; the stack is the team's everywhere | Choose HyperPod EKS for Trainium deep checks; pin Neuron 2.33.0 |
| Start on your leaf | The first actions per leaf | Capacity, then the script's three duties, then the leaf's checks | Open the quota request; build the three things; run the leaf's first check; go to section 31 |

No block failed the three questions. The tree carries the model, the strongest number (1.2% against
20.0%) lands in the h1, the intro, the diagram, question 3's h2 and question 3's closing paragraph, and
the section ends on the reader's next action. Edits:
- **Re-express.** "since its support table lists Kubernetes 1.28 to 1.33" became "since it supports
  Kubernetes 1.28 to 1.33 only" (the operator page: "works only with specific versions"); "lists"
  carried provenance, not strength.
- Access dates: the ten Cites to pages fc10 re-opened on 2026-10-31 dropped their 2026-10-30 date, and the
  unused register-date constant went with them.

## Claim-set diff (against `/tmp/lts-fc-fc10-preleverage/`)

New assertions in the after:
1. "SMP v2 and SMDDP are AWS's own training libraries": on the page already, SMP v2 is "a capability of
   SageMaker AI" (SMP v2 page, Cite in the disclosure) and SMDDP is offered by SageMaker AI (HyperPod Slurm
   page, Cite in the disclosure).
2. "(release dates below)": a pointer to the disclosure's dates, not a claim.
3. "FSDP2 (PyTorch's Fully Sharded Data Parallel, version 2; section 8)": a gloss of a term the page
   already used; section 8 defines it.
4. "Kubernetes 1.28 to 1.33 only": the operator page reads "works only with specific versions of
   Kubernetes".

Nothing removed: every number, Cite, hedge ("not run end to end here", "our reading"), the doc-code
conflict, the venue-free Cites and the "Illustrative, not measured" caption are still on the page.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| TrainingJobs.tsx | 4 | 5 | 5 | 5 | 4 |
| ChoosingPath.tsx | 5 | 5 | 5 | 5 | 4 |

TrainingJobs: about 200 words of library history and wiring left the argument's path; the reader now meets
"bring your own stack" before the evidence. ChoosingPath: unchanged in shape; its length is the tree's
evidence, one cited sentence per leaf.

Harness after the pass (`/tmp/lts-shots-fc10`, port 4710): training-jobs and choosing at 1440 and 390,
1 SVG each, "ok" (no overlap, clip or overflow reported). Checks: typecheck exit 0, lint exit 0, tests
"Test Files 6 passed (6)" and "Tests 168 passed (168)", no-ai-tells, pinned-refs, svg-a11y and pre-overflow
all pass.
