# Leverage pass fc08-aws-a (sections 20, 21, 22), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc08-aws-a.md`.

## Before-scores (1 to 5), on the files after the fact-check fixes

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| AwsOwnership.tsx | 5 | 4 | 5 | 5 | 3 |
| AwsHardware.tsx | 5 | 5 | 5 | 5 | 4 |
| CapacityCost.tsx | 4 | 5 | 5 | 5 | 4 |

Main-path reader words, outside expandables, Cites and code blocks (script count): section 20 about 2,255,
section 21 about 2,360 (table text included), section 22 about 2,320 (calculator excluded). Section 20 is the
economy item: the matrix carries the argument, and two blocks after it said the same thing twice. In the
two-recoveries block, "when the checking happens" still read as though training jobs had no pre-job check,
which the matrix cell now documents.

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how the reader
uses it.

### AwsOwnership.tsx (section 20, Who Owns What on AWS)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro (h1) | The step is the same on every path; the cluster around it is what you choose | Four jobs around the step (schedule, check and replace, restart, pay); prose | Frames the choice before any service detail |
| Three shapes | Seven paths reduce to three cluster shapes | Shape predicts billing and admission; three-column grid | Place any path, and know how it bills before reading its docs |
| Ownership matrix and the reading paragraphs | Who runs each of ten concerns on each path | The matrix is the model, drawn wide and narrow; colour carries ownership | Read a row to see what your team must build on a candidate path |
| Matrix expandables (three CellLists) | Every cell with its source | Supporting evidence | Check a cell before relying on it |
| Two recoveries | Node recovery and job recovery are separate, and paths differ in which they own | Two-stage recovery; prose | Pick screening (deep checks, opt-in InfraCheck) against section 17's failure rates; know that every restart ends at your checkpoint |
| Auto-resume expandable | The conditions under which auto-resume actually resumes | Supporting | Exclusive allocation, one srun, node list from scontrol |
| All-or-nothing admission | Synchronous training needs gang scheduling; Slurm has it, Kubernetes needs it added | Admit all or none; prose | Submit an oversized job and confirm no pod starts |
| A cluster per job or per team | Billing follows cluster life | Utilisation decides the cheaper shape; prose with computed rates | Compare 1.20 for every hour against 1.15 while jobs run |
| What the script owns | Checkpoint and reload, save before the window edge, log for the hang watchdog | Three duties that hold on every path | Build them before the first multi-node run; ends on the reader's next action (choose the family) |

### AwsHardware.tsx (section 21, Training Hardware on AWS)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Three numbers per instance decide what a layout can do | HBM, dense peak, scale-up domain; prose | Know what to read off any spec page |
| Scale-up domain | TP lives inside the fast link; five domain sizes on AWS | Domain edge; drawn to scale in the diagram | Cap TP at the domain; price what crosses it on EFA |
| The two 400s and the P6e-GB200 conflict | Per-instance and per-GPU EFA differ by 8x; two AWS pages disagree on GB200 | Divisor choice by collective type; prose | Divide by 400 GB/s or 50 GB/s; price GB200 crossings at both |
| Instance table and four readings | One table of calculator inputs, plus the cells to distrust | The table is the lookup | Enter per-rank HBM on trn2, the GB200 peak, the smaller of GiB and GB, 96 not 512 GiB |
| GB300 and Trn3 absence; disagreements expandable | What is missing from AWS's pages, and which figure the table takes | Supporting | Do not plan self-serve on GB300; know which Trn3 link figure applies |
| New silicon | BF16 peak holds, memory grows | Generation table makes it visible | Buy the newer part for memory, which section 14's example turns into no recomputation |
| Node-count floor | 70B state needs 1.64 p5.48xlarge | Floor table | Start the layout from the floor; ends on the reader's next action |

### CapacityCost.tsx (section 22, Capacity & Cost)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | A run is bought twice, as capacity and as a bill | Two purchases; prose with the H100-hour rates | Frames the order: capacity first |
| Capacity first | Quotas, ODCR, blocks and plans; the 256-instance ceiling | Paths table; prose | Raise the quota, pick a block or plan, plan wall-clock against 2,048 GPUs |
| A0 protocol (expandable) | The open p5e question and how to settle it | Supporting, "not yet run" | Run the read-only calls before planning on p5e blocks |
| The window's edge | 11:00 or 10:30 UTC is when the instances go | Timeline diagram | Schedule the last save one save time before the edge |
| What an hour costs | Rates on five paths with their Regions | Two tables; multipliers in prose | Quote the offering's UpfrontFee, not the table |
| Two worked bills | Peak-per-dollar and the 70B run | Formula chain shown, then priced | Compare platforms after a measured step; read the estimate as a floor |
| Calculator A cost panel | Price your own run | Interactive | Ends on the reader's next action: search offerings with the CLI command |

## Changes (four verbs only)

| # | file | verb | change | claims kept |
|---|---|---|---|---|
| 1 | AwsOwnership.tsx | delete | The "job restart row never stands alone" paragraph after the matrix. Script item 1 makes the same claim with the same three Cites (SageMaker repair, HyperPod auto-resume, Slurm sbatch) 300 words later, as the action | All: item 1 keeps each claim and Cite |
| 2 | AwsOwnership.tsx | re-express | The checkpoint gloss "(the saved weights and optimizer state; section 18, Checkpointing)" moved from the deleted paragraph into script item 1, its first use in reading order | Unchanged text, moved |
| 3 | AwsOwnership.tsx | re-express | Two recoveries: "SageMaker's repair starts only after the job fails" now continues "and its health check before the job is opt-in, with no documented timing", with the InfraCheckConfig Cite. Traces to the matrix cell written in Pass 1 (fact-check row 1) | New sentence names its source; scope matches the cell (opt-in, timing not documented) |

No change to AwsHardware.tsx or CapacityCost.tsx in this pass. Section 21 already ends on the reader's next
action, keeps its strongest number (1.64 p5.48xlarge) in the h1, the h2 description, the floor table and the
closing paragraph, and its demotable material is already in an expandable. Section 22's candidates were the
orchestration-fees paragraph and the Trainium2 paragraph; both change what the reader budgets, so both stay.

## Claim-set diff against HEAD (`git diff`)

New assertions in the three files, each with its source:

- Section 20: InfraCheckConfig opt-in, hardware and network check, timing not documented
  (API_InfraCheckConfig.html, twice: matrix cell and two-recoveries paragraph); PCS replaces an instance
  rebooted outside Slurm (troubleshooting_instance-terminated-after-reboot.html) or with nextstate=DOWN
  (slurm-reboot-faq.html), deciding is yours (our reading); PCS cadence (slurm-versions.html table dates, our
  arithmetic); Auto Mode and Karpenter take reserved capacity first (ml-compute-management.html); the task
  governance add-on installs Kueue (governance-setup-task-governance.html); Kubeflow Trainer alpha, APIs may
  change (Kubeflow Trainer README L104 at 658725bd); managed node groups drain 40 minutes before the end,
  self-managed nodes more than 30 (ml-node-groups.html); launchers "such as" torchrun and mpirun
  (distributed-training.html).
- Section 21: none new; anchor widened to L206-L209 and one sentence re-scoped to AWS's pages.
- Section 22: ODCR billed at the On-Demand rate whether used or not (capacity-reservations-pricing-billing.html);
  launch template must leave the placement group out (ec2-capacity-blocks.html); EKS 40 and 30 minutes
  (ml-node-groups.html); MFU hedge narrowed to "benchmark" (setup-torchtitan-neuron.rst L84); "not in this
  data" label (the table's own statement that it reads the calculator data).

Removed assertions: "fair share" through Batch service jobs (unsupported); "any launcher works"; "Yours,
nothing replaces a node" on PCS; "reserved capacity used first" for all three EKS options; the duplicate
restart paragraph (claims kept in item 1). No sourced number, doc conflict, hedge scope, UNKNOWN hedge,
vendor attribution, "Illustrative, not measured" caption, venue badge, "not yet run" label or strongest
number was traded.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| AwsOwnership.tsx | 5 | 5 | 5 | 5 | 4 |
| AwsHardware.tsx | 5 | 5 | 5 | 5 | 4 |
| CapacityCost.tsx | 4 | 5 | 5 | 5 | 4 |

Section 20 practical leverage rises from 4 to 5: the screening choice for training jobs (the opt-in
InfraCheckConfig) was only inside a matrix expandable and now sits in the main-path paragraph that weighs
screening time, next to HyperPod's deep checks. Economy rises from 3 to 4 with the duplicate paragraph gone
(about 2,235 main-path words). Accuracy holds at 5 on all three.
