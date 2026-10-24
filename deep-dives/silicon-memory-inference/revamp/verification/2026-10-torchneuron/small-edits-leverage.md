# Leverage pass: TorchNeuron small edits (four silicon sections)

Run: 2026-10-24. Status: COMPLETE.

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md` (four verbs: delete, reorder,
demote, re-express; no assert). Shape: `deep-dives/efa/revamp/section-shape-standard.md`.
Input: `small-edits.md` (fact-check, same directory).

Scope: blocks containing a line changed in `git diff 06fc267 HEAD` (HEAD = bdc101e) for
AwsCustomSilicon, CommunicationAndScaleOut, KernelExecutionLifecycle and DeterminismAOT.

| id | file | lines (HEAD) | block |
| --- | --- | --- | --- |
| A-MoE | AwsCustomSilicon.tsx | 304-326 | Alert "How to get MoE dispatch right on Trainium" |
| A-Trn1 | AwsCustomSilicon.tsx | 368-381 | "Trn1 and Inf2" column cell |
| C-MoE | CommunicationAndScaleOut.tsx | 351-376 | Alert "MoE dispatch on Trainium: the API to call" |
| K-lane | KernelExecutionLifecycle.tsx | 166-173 | Trainium2 row, "Stages 1-2 (host)" cell |
| K-fuse | KernelExecutionLifecycle.tsx | 443-455 | "The compiler decides what fuses." paragraph |
| D-round | DeterminismAOT.tsx | 152-173 | "Rounding." paragraph |

ExpandableSection is imported in AwsCustomSilicon, CommunicationAndScaleOut and
DeterminismAOT, not in KernelExecutionLifecycle. No block was demoted (reasons per block), so
no layout changed and no build or screenshots were needed.

## Per block

Scores are mental model / practical leverage / rigor / accuracy / economy, 1 to 5.

### A-MoE: AwsCustomSilicon "How to get MoE dispatch right on Trainium"

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 3 | 4 | 5 | 5 | 3 |
| after | 3 | 5 | 5 | 5 | 3 |

1. Meaning: the reader writing or porting MoE code to Trainium learns which collectives
   exist by release, and what TorchNeuron and TorchTitan Neuron require of expert code.
2. Model: Neuron ships its own dispatch collectives. On TorchNeuron the MoE ops run, but a
   grouped GEMM breaks the compiled graph, so the experts stay outside the compiled region. A
   diagram would not carry this better than one alert.
3. Leverage: pick the collective by Neuron release; on TorchTitan Neuron keep the experts out
   of the compiled region; do not port code that calls `torch.all_to_all_vdev_2d`.

Edit (re-express plus reorder within one sentence). AwsCustomSilicon.tsx:310-318.
- Before: "PyTorch code on TorchNeuron can call `torch._grouped_mm` and MoE dispatch and
  combine on the `neuron` device [torchNeuron233], but a grouped GEMM always forces a
  torch.compile graph break [torchCompileRef], which is an error under the `fullgraph=True`
  that TorchTitan compiles with, so on TorchTitan Neuron keep the expert computation out of
  the compiled region; its expert-parallel dispatch runs on an NKI all-to-all-v collective.
  [torchtitanNeuron]"
- After: "PyTorch code on TorchNeuron can call `torch._grouped_mm` and MoE dispatch and combine
  on the `neuron` device. [torchNeuron233] On TorchTitan Neuron, keep the expert computation
  out of the compiled region, because a grouped GEMM always forces a torch.compile graph
  break [torchCompileRef], an error under the `fullgraph=True` that TorchTitan compiles with;
  its expert-parallel dispatch runs on an NKI all-to-all-v collective. [torchtitanNeuron]"
- Why: a 60-word sentence buried the alert's one instruction behind "but ... which ... so".
  The instruction now opens its own sentence and the reason follows it. Same causal link
  ("so" becomes "because"), same three citations on the same clauses.

Not done: demotion. The fact-check calls the alert dense (five facts, five citations), but
each fact is something to do or avoid, and an ExpandableSection inside an Info alert would
add a header and hide an action. Economy stays at 3 for that reason.

### A-Trn1: AwsCustomSilicon "Trn1 and Inf2" cell

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 4 | 4 | 5 | 5 | 4 |
| after | 4 | 5 | 5 | 5 | 4 |

1. Meaning: the reader holding or considering Trn1 or Inf2 capacity learns which PyTorch
   build and which Neuron release still serve it, and that AWS's own pages disagree on the
   NxD Inference pin.
2. Model: Trn1 and Inf2 are the legacy branch. PyTorch stays on the deprecated XLA build and
   NxD Inference stays in maintenance there, while TorchNeuron and vLLM Neuron target Trn2
   and Trn3. A two-column cell is the right container.
3. Leverage: choose the torch-neuronx build; confirm the NxD Inference release with AWS
   before pinning 2.28 or 2.31.

Edit (reorder). AwsCustomSilicon.tsx:369-370 and former 380.
- Before: "... Confirm the release with AWS before pinning one. This research found no
  announced Inferentia successor."
- After: "Both remain on EC2. [ec2AcceleratedSpecs] This research found no announced
  Inferentia successor. PyTorch on them stays ... Confirm the release with AWS before pinning
  one."
- Why: the cell ended on a hedge, after its action. The instance facts (on EC2, no successor
  found) now sit together, and the cell closes on the action the h2 promises ("which Neuron
  release still serves it"). Hedge wording unchanged ("This research found"). The
  doc-versus-doc conflict keeps both attributions and both citations.

### C-MoE: CommunicationAndScaleOut "MoE dispatch on Trainium: the API to call"

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 3 | 4 | 5 | 5 | 3 |
| after | 4 | 5 | 5 | 5 | 3 |

1. Meaning: the reader writing MoE dispatch for Trainium learns the API to call and which
   PyTorch and NVIDIA paths stay on NVIDIA.
2. Model: two halves. What Neuron ships (kernel collectives by release, then engine-level
   expert parallelism in vLLM Neuron and NxD Inference), and what PyTorch code does (two
   NVIDIA-only dispatch paths, then the `neuron` c10d backend). A table could carry this;
   not commissioned, since it would add a layout for six sentences.
3. Leverage: call `nki.collectives.all_to_all_v`, or `all_to_all` on
   `init_process_group(backend="neuron")`; do not build new serving on NxD Inference expert
   parallelism, which ends on Trn2 and Trn3 in 2.34.

Edit (reorder). CommunicationAndScaleOut.tsx:355-361 (moved up), former 369-375 (removed).
- Before order: (1) NKI and Runtime AllToAllV; (2) `all_to_all_vdev_2d` on NVSHMEM, none in
  torch-neuronx; (3) TokenSwitch NVIDIA-only; (4) TorchNeuron `neuron` backend runs
  `all_to_all`; (5) Wide-EP on GB200 vs beta in vLLM Neuron, NxD Inference ending, All-Gather.
- After order: (1), (5), (2), (3), (4). Sentence text unchanged.
- Why: the alert ended on what NxD Inference documents, a library that is ending. It now
  closes on the PyTorch call, with the two NVIDIA-only paths directly ahead of it, so the
  pitfall sits beside the correct approach it protects. Each sentence moved whole with its
  citations.

Not done: demotion (each sentence names an API to call, avoid or retire), and no cut.

### K-lane: KernelExecutionLifecycle Trainium2 host cell

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 4 | 3 | 5 | 5 | 5 |
| after | 4 | 3 | 5 | 5 | 5 |

1. Meaning: in the three-silicon lane table, the cell shows what the host does on Trainium
   before dispatch.
2. Model: the host lowers to StableHLO and compiles a NEFF on first use, which the runtime
   loads, where a GPU host picks a prebuilt kernel. The table and KernelLifecycleDiagram
   already make it visible.
3. Leverage: "on first use" tells a reader the first call for a new operator or graph pays a
   compile. That is the only hook, and it is stated.

Unchanged: passes all three questions in 25 words.

### K-fuse: KernelExecutionLifecycle "The compiler decides what fuses."

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 5 | 3 | 5 | 5 | 4 |
| after | 5 | 3 | 5 | 5 | 4 |

1. Meaning: the reader tuning throughput learns that fusion is a compiler decision, and that
   on TorchNeuron it takes a graph.
2. Model: fusion needs a graph. Default eager mode is one NEFF per operator with
   intermediates through HBM; torch.compile hands neuronx-cc one graph per NEFF. A reader can
   predict HBM round trips from it.
3. Leverage: delivered two blocks later by "Which lever to pull" (an intermediate written to
   HBM and read back means fuse). This block's job is the model, and it says so through its
   bold lead.

Unchanged. Writing "so run hot paths under torch.compile" would ignore the opt-in Adaptive
Eager Execution fusion (named in DeterminismAOT, not in this block) and would be an
instruction this block cannot source.

### D-round: DeterminismAOT "Rounding."

| | model | leverage | rigor | accuracy | economy |
| --- | --- | --- | --- | --- | --- |
| before | 4 | 4 | 5 | 5 | 3 |
| after | 4 | 5 | 5 | 5 | 3 |

1. Meaning: the reader making Trainium runs replayable learns which rounding mode each
   PyTorch stack gets and which variables to pin.
2. Model: the rounding mode is a runtime setting a framework may set for you. The XLA build
   turns stochastic rounding on under `XLA_USE_BF16=1`; TorchNeuron leaves the runtime
   default, round-to-nearest-even. Eager-mode fusion is a second source of drift.
3. Leverage: set `NEURON_RT_STOCHASTIC_ROUNDING_EN` in the launch script, fix the seed if
   stochastic rounding stays, leave `TORCH_NEURONX_ENABLE_CONCATENATION` off.

Edit (reorder plus re-express). DeterminismAOT.tsx:153-156 and former 164-165.
- Before: "... default applies: off, which is round-to-nearest-even. [nrtEnvVarRef] Set it
  explicitly on either stack, so the launch script records the mode. To keep ..."
- After: "Rounding. Set `NEURON_RT_STOCHASTIC_ROUNDING_EN` on both PyTorch stacks, so the
  launch script records the mode. The XLA-based PyTorch-Neuron turns ... [nrtEnvVarRef] To
  keep ..."
- Why: the paragraph's first instruction sat after 40 words of mechanism. It now leads, and
  the two stack defaults read as its reason. "it" becomes the variable name, since the
  sentence now precedes the variable's first mention; "explicitly" goes, since "Set" with a
  named variable already says it. "Either stack" becomes "both PyTorch stacks", the same two
  stacks, named because the sentence now comes before them.

Not done: demotion. The six citations each carry one of three settings or the two stack
defaults. The defaults are the model, not supporting evidence, and an ExpandableSection
cannot sit inside a `Box variant="p"`. Economy stays at 3.

## Claim-set diff

New assertions in the after that are not in the before: **none**.

Checked mechanically: each block's visible text (Cite elements and tags stripped) was split
into sentences at HEAD and in the working tree, and the sets compared.

| block | result |
| --- | --- |
| A-MoE | One sentence split in two. Clauses identical: TorchNeuron can call the MoE ops [torchNeuron233]; grouped GEMM always breaks the graph [torchCompileRef]; error under `fullgraph=True`, keep experts out, NKI all-to-all-v dispatch [torchtitanNeuron]. "so" became "because"; same causal link the fact-check confirmed (A2, A3). |
| A-Trn1 | Sentence set identical (reorder only). |
| C-MoE | Sentence set identical (reorder only). |
| K-lane, K-fuse | Unchanged. |
| D-round | "Set it explicitly on either stack" became "Set `NEURON_RT_STOCHASTIC_ROUNDING_EN` on both PyTorch stacks". Same advice, same two stacks, referent named. No citation on it before or after (our advice, as the fact-check left it, D2). |

Citations: the multiset of `s={S.*}` references in each of the four files is identical at
HEAD and after the pass. No citation was added, removed or moved off the clause it supports.
No sourced number, conflict, hedge scope or UNKNOWN was altered; the one hedge in scope
("This research found no announced Inferentia successor") moved whole.

## Word counts

Visible prose words per block: Cite elements and JSX tags removed, punctuation-only tokens
dropped, each code span one word, alert headers excluded (unchanged). Counter:
`/tmp/lp-small-scripts/wc_block.py`.

| block | before | after |
| --- | --- | --- |
| A-MoE | 120 | 117 |
| A-Trn1 | 100 | 100 |
| C-MoE | 124 | 124 |
| K-lane | 25 | 25 |
| K-fuse | 100 | 100 |
| D-round | 77 | 77 |
| total | 546 | 543 |

## Checks

Run 2026-10-24 after all edits. Dive-root commands from
`deep-dives/silicon-memory-inference`; gates from the repo root.

| command | exit | result |
| --- | --- | --- |
| `pnpm exec tsc --noEmit` | 0 | no output |
| `pnpm exec eslint src/sections/AwsCustomSilicon.tsx src/sections/CommunicationAndScaleOut.tsx src/sections/KernelExecutionLifecycle.tsx src/sections/DeterminismAOT.tsx --max-warnings 0` | 0 | no output |
| `pnpm exec vitest run` | 0 | 2 files, 948 tests passed (sources.test.ts 913, sections.test.tsx 35) |
| `bash scripts/gates/no-ai-tells.sh` | 0 | PASS, silicon-memory-inference among 3 dives scanned |
| `bash scripts/gates/svg-a11y.sh` | 0 | PASS, silicon-memory-inference scanned |
| `bash scripts/gates/pinned-refs.sh` | 0 | PASS, silicon src and research scanned |
| `bash scripts/gates/pre-overflow.sh` | 0 | PASS, silicon-memory-inference scanned |

No ExpandableSection or other layout changed, so no build and no screenshots.

The working tree also held an edit to `src/sections/AwsCompilersAndTooling.tsx` that this
pass did not make (a concurrent leverage pass; its report is
`AwsCompilersAndTooling-leverage.md`). tsc and vitest ran with it present. It was not read
or touched.

## Gate 3

Scores cover the changed blocks within each section's argument. Gate 3 needs 7 or above.

| section | fact-check | after pass | evidence |
| --- | --- | --- | --- |
| AwsCustomSilicon | 8 | 8 | The MoE alert's TorchTitan instruction now leads its own sentence, and the Trn1 and Inf2 cell closes on its action, as the h2 ("which Neuron release still serves it") asks. The alert is still five facts and five citations in one Info box. Each is an action, so the four verbs leave nothing to cut, and the score holds. |
| CommunicationAndScaleOut | 8 | 8 | The alert now ends on the PyTorch call (`init_process_group(backend="neuron")`, `all_to_all`), with the two NVIDIA-only paths directly ahead of it, and reads as what Neuron ships, then what PyTorch code does. It is still 124 words and eight citations in one box. The fact-check backlog item (point to TorchTitan's NKI all-to-all-v) stays open. |
| KernelExecutionLifecycle | 9 | 9 | Both blocks pass all three questions and are unchanged. The fusion model ("fusion needs a graph") is clean and gets its action from "Which lever to pull". The TorchNeuron first-use gloss (open item 1) keeps it from 10. |
| DeterminismAOT | 8 | 8 | The rounding paragraph now opens on its first instruction and closes on the fusion setting, so the mechanism reads as the reason. It is still six citations in one paragraph. The seed claim's stale citation (open item 2) is inside this block and stays for the orchestrator. |

## Open items

1. **TorchNeuron has no gloss at first use.** In reading order it first appears at
   `KernelExecutionLifecycle.tsx:168` (Trainium2 lane cell), then in AwsCustomSilicon, before
   AwsCompilersAndTooling introduces it. The glossary carries it (G6 in `small-edits.md`).
   Adding "the native PyTorch backend" to the cell would add a fact to the block, which this
   pass may not do. Backlog for a content iteration.
2. **Seed advice cites the v2.32.0 JAX page** (`DeterminismAOT.tsx:166-168`, inside D-round,
   and `AwsCustomSilicon.tsx:384-392`). Carried from `small-edits.md` "For the orchestrator"
   6: the v2.33.0 runtime reference gives `NEURON_RT_STOCHASTIC_ROUNDING_SEED` a default of 0
   when unset. The claim is correct as cited. Re-citing and rewording would assert, so the
   pass left it.
3. **`XLA_USE_BF16` deprecation** (`DeterminismAOT.tsx:155-156`, inside D-round): carried
   from the same note. Correct as cited, backlog.
4. **sources.md:** the pass changed no source records, so it needs no regeneration on this
   pass's account.
