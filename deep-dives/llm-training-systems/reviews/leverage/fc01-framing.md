# Leverage pass fc01-framing (sections 1, 2, 3), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Run after the fact check
(`reviews/factcheck/fc01-framing.md`), on the corrected files. Scores are mental model / practical leverage / rigor /
accuracy / economy, one to five.

## Before-scores (written before any leverage edit)

| Section | File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|---|
| 1 A Training Run Is Three Budgets | ThreeBudgets.tsx | 5 | 4 | 5 | 5 | 4 |
| 2 Getting Started | GettingStarted.tsx | 4 | 5 | 5 | 5 | 4 |
| 3 One Training Step | TrainingStep.tsx | 5 | 4 | 5 | 5 | 3 |

## Section 1, ThreeBudgets.tsx

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it |
|---|---|---|---|
| Opening and the six questions | The plan a team has to buy capacity against, and the order the dive answers it | The plan follows from three budgets fixed before step one; the numbered list is the visible form | Tells the reader which question to bring to section 2's routes |
| Three budgets, in plain words (three bullets, the link paragraph, the AWS paragraphs, the diagram) | The three numbers every later section refines, each tied to a public run | Arithmetic, memory and failure as budgets around one step, drawn to scale in the diagram, with the AWS ownership ring around it | Sizes the first split (128.5 GB against 80 GB), sets the cadence of failure to plan for, and names the three duties the training script owns, with the 11:00 UTC termination edge |
| The arithmetic expandable | Lets a reader recompute every figure | None of its own; supports the bullets | Checkable inputs, demoted correctly |
| Every technique trades one resource for another | A way to predict any technique's cost before its section prices it | Four resources traded against each other; three worked trades plus the parallelism rule (frequency of the collective decides its link) | Predicts that recomputation costs about a third more FLOPs, sharding costs collectives, asynchronous saves cost host memory, and that TP belongs on NVLink |
| Put a number on each budget before you choose | The reader's next action, in order | The same three budgets, now as procedures | Three estimates, each pointing at the calculator that computes it, ending on sections 20, 28 and 2 |

Edits: none. Every block answers all three questions; the strongest number (128.5 GB, 1.6 times one H100) lands in
the memory bullet, the diagram and the memory estimate; the section ends on the reader's next action. The fact-check
narrowings (one micro-batch per step; BF16 weights for the 18-byte row) are scope reductions and stay.

## Section 2, GettingStarted.tsx

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it |
|---|---|---|---|
| Opening | Permission to read a subset safely | The dive as a dependency order | Frames the routes as safe because each keeps its dependencies |
| Who the dive is written for | Whether the dive starts where the reader's experience ends | None; a prerequisite list with sibling links | Tells the reader what to read elsewhere first and where to look up a term |
| Four ideas to hold | The minimum to read any section out of order | Two kinds of state, two bills, ranks and collectives, the bandwidth hierarchy (nine times per GPU in bold) | Lets the reader price a split by link before reading the parallelism sections |
| The path, and why in this order, with the reading map | Why each stage comes where it does | One model per stage; the map shows stages, order and route marks | Choose where to enter, and see which sections a route skips |
| How the sections feed each other | Which number travels where | The calculators as a pipeline | Carry an output to the section that expects it |
| Four shorter routes, the expandable, the closing paragraph | The route for the reader's question | Each route as a chain of dependencies, reasons in the expandable | Read only the listed sections in order; closes on where to continue |

Edits: none. The section's leverage is already its routes; the one hedge the fact check restored ("our reading" on
per-instance crossing) stays. Mental model scores 4 because a survey hands off its models to the sections it names, which
is its job.

## Section 3, TrainingStep.tsx

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it |
|---|---|---|---|
| Opening | Every later section splits one of two bills | A step as two bills fixed by the model's shape | Frames the section's ending |
| Two passes and one update (table, time paragraph, expandable) | Where the arithmetic goes, a third forward and two thirds backward | 2N + 4N = 6N, visible in the table and the diagram's lane widths | Count FLOPs per token and a sequence's time on one H100 at an assumed MFU |
| What the step keeps, and for how long (diagram, 165 GB paragraph, expandable) | Which memory persists and which comes and goes | Model state flat across the step, activations rising and falling, drawn to scale against 80 GB | Know which lever acts on which state before section 5; the compile hedge tells the reader to measure the coefficient on their own build |
| Why a 16-bit run keeps a 32-bit copy | Where 4 of the 16 bytes come from | Addition below the mantissa vanishes; the FP32 master keeps it | Explains why the 16-byte count holds in BF16 training and what section 6 changes |
| Micro-batch, accumulation and the global batch | The identity every sizing step solves | B = b x m x d, with Llama 3's 16.8M tokens as the worked case | Trade a smaller micro-batch for more passes at a fixed batch |
| The notation the dive uses | One set of symbols for every later formula | Reference; identical to section 32's table | Lookup |
| Your model's two bills | The reader's two numbers to take into sections 4 and 5 | 6N, 16N or 18N, 34 sbh x L, applied to 8B and 70B | Run the three lines for one's own model; ends on the next action |

Edit (reorder): "Why a 16-bit run keeps a 32-bit copy" moved from after the notation table to directly after "What the
step keeps", the block whose 16 bytes it explains (its h2 already says "Know where 4 of the 16 bytes come from"). The
section now runs keeps, then why the 32-bit copy, then the batch identity, then the notation reference just before the
two bills that use it, so the lookup table no longer interrupts the argument between the batch identity and the
precision reasoning. No sentence changed; acronym first uses still precede their reuse (FP32, BF16 and FP16 are expanded
or glossed before the moved block).

## Claim-set diff (against HEAD)

ThreeBudgets.tsx and GettingStarted.tsx: the leverage pass changed nothing; the only differences from HEAD are the
fact-check fixes (venue badges, Section 3.2 Cite, "when each step is one micro-batch", the BF16 18-byte wording, "our
reading" on the per-instance crossing). TrainingStep.tsx (line-set comparison of HEAD against the working copy): new
lines are the compile-default sentence with its Cite (llama3/model.py L87-L89, opened at v0.4.0), 44.0 GB (recomputed),
"p x t x d", the provenance line, the RMSNorm and SiLU expansions, the JMLR badges, and the 18N line carrying the
Megatron Cite that the removed notation row held. Removed: the notation row "bytes per parameter" (its content stays in
the model-state bullet and the two-bills list). No assertion without a source on the page.

## After-scores

| Section | File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|---|
| 1 A Training Run Is Three Budgets | ThreeBudgets.tsx | 5 | 4 | 5 | 5 | 4 |
| 2 Getting Started | GettingStarted.tsx | 4 | 5 | 5 | 5 | 4 |
| 3 One Training Step | TrainingStep.tsx | 5 | 4 | 5 | 5 | 4 |

Accuracy holds at five in all three. Economy in section 3 rises by one with the reorder (the reference table no longer
splits the argument).
