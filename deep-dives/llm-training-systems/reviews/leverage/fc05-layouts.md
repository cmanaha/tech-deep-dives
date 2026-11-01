# Leverage pass fc05-layouts (sections 13, 14), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc05-layouts.md`.

## Before-scores (1 to 5), on the post-fact-check text

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| ComposingLayouts.tsx | 5 | 4 | 5 | 5 | 3 |
| SetMyRanks.tsx | 4 | 5 | 5 | 5 | 3 |

Section 13 runs about 2,990 words of reader text, above the 2,500 target; the pod derivation for two
rank orders sits in the body of "Nest innermost-fastest", in the path of the rule it supports. Section
14 is long by design (twelve steps, two examples, a calculator), and most supporting evidence already
sits in seven expandables; its weak spots are two example paragraphs that carry cross-checks and a
second argument inside the paragraph that states the answer.

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how the
reader uses it.

### ComposingLayouts.tsx (section 13, Composing the Dimensions)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Names the one question composition adds: which dimension shares an instance | Placement decides the link; prose is enough | Frames every later block as "which link does each axis ride" |
| The device mesh | Gives the reader the grid every framework uses, and the row-major rule | Degrees multiply to the world size, the last axis varies fastest and lands inside an instance; carried by the nested-box diagram | Write any layout as a mesh; one member per instance means 50 GB/s per GPU, several mean per-instance pricing |
| Published layouts: Llama 3 | Reads Meta's three rows on the grid | Fixed tokens per batch, so DP trades against sequences; CP 16 crosses servers because TP fills them | Expect MFU to fall as DP grows at fixed batch; no Meta planner is available (hedge kept) |
| Published layouts: DeepSeek-V3 | A grid with no TP, and an EP group that spans nodes | Attention grid and expert grid differ; EP's all-to-all crosses InfiniBand once | Know when EP forces cross-node traffic and what schedule hides it |
| Published layouts: TorchTitan (plus expandable) | FSDP first, TP to 8, PP, CP next to TP, on one mesh | The same per-member count as the mesh block, applied to the 8B and 70B runs | Choose FSDP alone for 8B on one node; expect one FSDP member per host once TP 8 fills it. Paper and repository figures differ, in the expandable |
| Published layouts: Megatron Core | The default order string and its stride rule, with a docstring that disagrees | TP adjacent, PP outermost; prose with the doc-code conflict | Read the signature, not the docstring; keep adjacent ranks on one machine yourself |
| Why the largest runs split the model (plus expandable) | When sharding alone stops scaling | PTD-P's takeaways; Table 2 in the expandable | Add TP and PP above a few hundred GPUs; a poor TP/PP split costs up to half the throughput |
| Nest innermost-fastest, the per-level table and its arithmetic | Shows why TP goes innermost, with the 70B numbers | Frequency times size; the per-level table makes the 100x gap visible | Put TP on NVLink; TP spread across instances would take about 24 s against 17.5 s of compute |
| The outer two axes, order table, pods | Which of PP and DP goes outermost, and why it matters only for distance | Order decides which instances sit close; the order table shows four frameworks | Put outermost the axis that tolerates distance; read distance from the EC2 topology. The pod derivation for two orders is supporting evidence, not the rule |
| Write your layout as a mesh | The procedure in five checks | Ordered list | Multiply degrees, make TP innermost, count members per instance, check the launcher, log rank and hostname |

### SetMyRanks.tsx (section 14, Set My Ranks: The Sizing Procedure)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Defines setting the ranks and the two passes | Fit first, then price; prose | Frames the twelve steps and the two examples |
| The procedure in twelve steps | The ordered list the reader runs | Each step is a check with its owning section; the list is the model | Every step names a setting, a divisibility rule or a threshold to compute |
| What the published tools search (two expandables) | Which planner answers which step | Planners disagree on the start; supporting detail is already demoted | Use the autotuner for step 3 only; NeMo's configurator is not in current NeMo (hedge kept) |
| Example 1 | Two published layouts that both pass, and the micro-batch that decides FSDP's cost | Per-micro-batch FSDP traffic, priced per instance; table plus ranking expandable | Run layout B at its single large micro-batch or defer the sync; plan for measured peaks above formula totals |
| Example 2: the failing options | Why ZeRO-1, ZeRO-2, flat FSDP and HSDP fail on 32 H200 | The table makes the failure ladder visible | Recognise when recomputation is the only way flat FSDP fits, and what it costs (a third more compute, about 7% on EFA). The flat-ring and calculator cross-checks are supporting evidence |
| Example 2: TP 8 x DP 4 and its ZeRO-2 variant | The answer, then the trap next to it | TP divides all three memory terms by eight; ZeRO-2 under accumulation reduces on every micro-batch | Take TP 8 x DP 4 with ZeRO-1; ZeRO-2 saves memory and costs 13,652.1 GB per instance per step, 24.3% of compute. The trap sat inside the answer's paragraph |
| Example 2: margin option and H100 | What the H200's memory buys | Prose | Take TP 8 x DP 4 and TP 8 x PP 2 x DP 2 into step 12 (ends on the action) |
| Calculator C, inputs, A1 and A2 | Run the procedure on your own inputs | The result list per link | Enter the model and cluster; A1 and A2 stay marked "not yet run" |

No block answered none of the three questions, so nothing was deleted.

## Edits (four verbs only)

1. ComposingLayouts.tsx, demote and reorder: the pod derivation for the two rank orders (Meta's
   128-GPU pipeline inside a pod; PP-outermost 512-GPU stages, six per pod, two of fifteen
   boundaries crossing), 85 words, moves into a new expandable "How the two orders fall on Llama 3's
   pods". The body keeps the pods (Section 3.3.1) and Meta's reason for DP outermost (Section 3.3.2),
   and the rule "put outermost the axis whose traffic best tolerates distance" becomes its own
   paragraph after the expandable, so the h2 still ends on the reader's action (the EC2 topology).
   Re-express: "Meta places DP there because" becomes "Meta places DP outermost because", the word
   Section 3.3.2 uses, since "there" lost its antecedent.
2. SetMyRanks.tsx, demote: example 2's FSDP cross-checks (the flat ring's 410.1 GB, 1.03 s, about 9%;
   the calculator's bytes per step; the 58.0 GB with two gathered layers), 70 words, move into a new
   expandable "FSDP 32's traffic and memory, cross-checked". Re-express: "a flat ring would send
   410.1 GB" becomes "Per micro-batch, a flat ring would send 410.1 GB out of each instance", the
   scope the sentence had from its position after "out of each instance per micro-batch".
3. SetMyRanks.tsx, reorder: the ZeRO-2 variant (71.8 GB; one volume in the ZeRO paper at one
   micro-batch; DeepSpeed's per-backward reduction; 13,652.1 GB, 24.3%) becomes its own paragraph after
   "Step 4 is the answer", so the answer reads clean and the trap reads as a separate point.

Protected items held: every Cite kept with its sentence; the doc-code-conflict Cite (Megatron
docstring) unchanged; venues unchanged by this pass; "Illustrative, not measured" caption untouched;
hedges unchanged ("no release of either was located during this research", "our arithmetic", "our
reading", "plan for measured peaks above formula totals", "at a sequence length its benchmark does not
state"); A1 and A2 still "not yet run"; each section's strongest number untouched and still repeated
(section 13: TP's 1.2 TB per GPU per step, more than 100 times either outer dimension, in the h1, the
h2 description and the closing paragraph; section 14: 85 GB per GPU for TP 8 x DP 4, in the h1, the
example 2 description, the table, the answer paragraph and the closing sentence).

## Claim-set diff (after against `/tmp/lts-fc-fc05-preleverage/`, the post-fact-check state)

Word-level diff of the rendered text. Assertions in the after that are not in the before, with their
source:

- Section 13 "Meta places DP outermost because FSDP tolerates latency by prefetching weights and
  reducing gradients asynchronously": the before's sentence with "there" resolved; 2407.21783v3
  Section 3.3.2 ("(i.e., FSDP) is the outermost parallelism because it can tolerate longer network
  latency by asynchronously prefetching sharded model weights and reducing gradients"), same Cite. No
  new fact.
- Section 14 "Per micro-batch, ... out of each instance": the scope the before's flat-ring clause
  carried from the preceding "out of each instance per micro-batch" (410.1 GB x 16 micro-batches
  against the calculator's 5,080 GB per step). No new fact.
- Two expandable titles: labels, no assertion.

Assertions deleted: none. Cites deleted: none. Against HEAD (`git diff`, read-only), the only Cite
changes are the fact-check's: two Cites re-pointed (Megatron world size, now two; DeepSpeed now
`kind="code"`), three venues (Korthikanti twice, Galvatron), and one H100 vendor-claim Cite added for
the U02-7 hedge. Body prose fell by 85 words (section 13) and 70 words (section 14); total reader text
rose by 9 and 13 words (the expandable titles and the two re-expressions).

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| ComposingLayouts.tsx | 5 | 4 | 5 | 5 | 4 |
| SetMyRanks.tsx | 4 | 5 | 5 | 5 | 4 |

Economy rises a point in each file. In section 13 the argument for the outer order now runs from the
pods to Meta's reason to the rule, with the arithmetic one click away. In section 14 the FSDP
paragraph ends on its cost, and the ZeRO-2 trap no longer hides inside the answer. Section 13's body is
still about 2,900 words, above the target. The remaining length is the four published layouts, each
read on the grid, which is the section's purpose, so no more was demoted. Mental model and practical
leverage hold. Rigor and accuracy hold at 5.

## Backlog (enhancement, not applied)

- SetMyRanks.tsx: the two-pass procedure (fit, then price) exists only as an ordered list. A small
  inline SVG of the twelve steps grouped into the two passes, each step tagged with its section, would
  likely raise mental model to 5. New diagram, so new scope.

## Verification after the pass

- typecheck: `tsc --noEmit`, exit 0. lint: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0.
- test: "Test Files 6 passed (6)", "Tests 165 passed (165)".
- Gates: no-ai-tells, pinned-refs, svg-a11y and pre-overflow all PASS.
- Harness not run: no diagram or table was touched (the edits are prose and two new expandables);
  both sections were re-rendered through `react-dom/server` and the changed passages read back.
