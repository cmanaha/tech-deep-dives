# Leverage pass fc07-reliability (sections 17, 18, 19), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc07-reliability.md`.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| FailureRates.tsx | 5 | 4 | 5 | 5 | 4 |
| Checkpointing.tsx | 5 | 5 | 5 | 5 | 3 |
| Resuming.tsx | 4 | 5 | 5 | 5 | 3 |

Main-path reader words, outside expandables and Cites (script count, HEAD): section 17 about 1,360,
section 18 about 2,890 (calculator labels included), section 19 about 2,470. Section 17 reads at the right
length. Section 18 carries two production designs, MegaScale's and Gemini's, in the middle of the
framework-settings argument. Section 19 is the known length item: it covers four subjects (restart layer,
resizing, determinism, stragglers), and one code-level list sat in the determinism argument.

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how
the reader uses it.

### FailureRates.tsx (section 17, Failure Is the Steady State)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | A synchronous job stops when one node stops; Llama 3's 3.1 hours sets the scale | Series system, stated in one sentence | Frames the number the reader must compute for their own job |
| A synchronous job fails when any node fails | MTTF = 1 / (N_nodes x r_f), with Meta's measured rates and their spread | The formula; the chart makes the 1/N slope visible | Compute the interval from node count and rate alone |
| Chart and slope reading | Tenfold job size, tenfold shorter interval; A100 rates are the inputs available | Log-log lines; visible | Know that a 2,048-node job stops several times a day |
| How Meta counts a failure (expandable) | The counting rule and the measured-versus-projected gap | Supporting | Treat the lines as an order-of-magnitude aid |
| What large runs reported | Llama 3's 419 interruptions, causes by count, and the consistency check against Meta's rates | Calibration: one report agrees with the model; prose plus arithmetic | Node checks that exercise GPU and HBM cover the largest share |
| Other operator reports (expandable) | OPT, MegaScale, lemon nodes, the Table 5 inconsistency | Supporting | Quote counts, not Table 5's percentages |
| Goodput at that failure rate | ETTR, what operators report, what AWS's vendor figures do and do not state | Wallclock = queue + productive + unproductive; prose | Judge any goodput claim by population and conditions |
| Your job's interruption interval | The table and the two rows the dive uses, then the design hand-off | Table makes the model a lookup | Read the row, plan for the worst month, screen nodes; ends on the reader's next action |

### Checkpointing.tsx (section 18, Checkpointing)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro (h1) | Interval and storage from node count and save time | Stated in the description | The two outputs the section delivers |
| What a checkpoint holds | 12 to 14 bytes per parameter, 988 GB for 70B, plus the small states | Gradients are recomputed, so they are not saved; prose | Size the checkpoint; check RNG state, which TorchTitan does not save |
| How often to save | Young and Daly interval and ETTR, the 70B worked table, the 16K caveat | Square-root trade, drawn by the timeline diagram | Interval in hours, why async buys a shorter interval, when the formula stops holding |
| Where the formula comes from (expandable) | Provenance and regime of the approximation | Supporting | Trust the numbers to the stated regime |
| The storage a save needs | Write rate to FSx TiB or S3 parts; load is not async; retention | Three floors: write, read, retention; prose with calculator figures | Buy 19,200 GiB, not 1,200, if the restart must stay at 10 minutes; spread S3 prefixes |
| DCP and bare async_save, with E4 | Bare async_save blocks for the whole copy | Two-phase save, staging then write; E4 table shows it | Pass a pinned DefaultStager |
| TorchTitan and Megatron settings | Defaults and the setting that makes each asynchronous | Where the fence sits; prose | async_with_pinned_mem; --async-save with --use-persistent-ckpt-worker; read the rank-0 log |
| In-memory tier (body sentence) and MegaScale and Gemini (expandable, new) | Production systems land checkpoints in host memory first | One sentence carries the model; the two designs are supporting evidence | Leads to the AWS product that implements it |
| HyperPod tiered checkpointing and the AWS library | AWS's version, its memory budget and the example's two gaps | The doc-code conflict is stated with E4's error | Add a CPU backend, a pinned stager, and the data loader and scheduler to the state dict |
| E4 and A3 (expandables) | Experiment conditions and the next protocol | Supporting | Reproduce or extend |
| Calculator D and the five settings | The procedure and the calculator | Formula chain shown before the inputs | Enter measured values; ends on the reader's next action |

### Resuming.tsx (section 19, Resuming Correctly)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Resuming means the same run; four things decide it | The four-part frame; prose | Orients the four h2s |
| Who restarts the job | torchrun, Slurm and HyperPod each restart differently, and plain torchrun does not | The contract: load the checkpoint before the first step | --max-restarts above 0, --signal with a handler, srun --auto-resume=1, read the node list at start-up |
| Changing the job's size | Only the data-parallel width changes; the global batch follows it unless held | Replica count sets the batch; prose | Per-scale config or FIXED_WITH_SPARES; batches_committed records the work done |
| The same data, in the same order | Data order as a function of seed and counter; random streams; bitwise runs; collectives | "A function rather than a history"; stated in the text | Checkpoint the consumed-samples counter or loader state per rank; save generator state; expect low-bit differences after a node swap |
| What TorchTitan's determinism switch sets (expandable, new) | The knobs and the warning | Supporting | For the reader turning determinism on for a debugging run |
| A1 protocol (expandable) | The planned bitwise all-reduce check | Supporting | Reproduce |
| Stragglers | One slow rank sets every rank's pace; 10.4% of GPU-hours; causes mostly inside the job | Waiting shows in the healthy ranks' collectives; the diagram makes it visible | Rank by compute time, not collective time; schedule GC; balance sequence lengths |
| Other straggler reports (expandable) | MegaScale, Llama 3, ByteDance's tail, FALCON | Supporting | Machines matter at the tail |
| Before the next restart | Six settings | Restates the model as actions | Ends on the reader's next action |

No block answered none of the three questions, so nothing was deleted. Two blocks carried supporting
evidence in the argument's path; both are now in expandables.

## Edits (four verbs only)

1. Checkpointing.tsx, demote and re-express: the MegaScale (Sec 4.4) and Gemini (Amazon Science post,
   including the 92% vendor claim) paragraph moves into a new expandable "Two in-memory designs: MegaScale
   and Gemini", word for word except that "also copies" becomes "copies". The body keeps one sentence with
   both Cites: production systems land checkpoints first in host memory, the node's own or its peers', and
   the write to remote storage leaves the critical path. The HyperPod paragraph that follows ("On AWS that
   design is...") still reads from it.
2. Resuming.tsx, demote and reorder: TorchTitan's determinism knobs (deterministic algorithms, cuDNN
   settings, `CUBLAS_WORKSPACE_CONFIG=:4096:8`, flex attention without autotuning, the logged warning, utils.py
   L137-L171) move into a new expandable "What TorchTitan's determinism switch sets", placed after the
   collectives paragraph so the body runs from the PyTorch reproducibility note straight to the collectives
   gap and its conclusion. Re-express: the body gains one sentence of guidance, "Turn determinism on for a
   debugging run, where that cost is paid on purpose", which is the h2 description's promise stated where
   the cost is named.

Not changed, by decision: section 17 (each block answers Q3 and the section is short), and the Megatron
index-file detail in section 19 (it is the worked example that makes "a function rather than a history"
concrete; a demotion would save about 25 words).

## Claim-set diff (`git diff` against HEAD, read-only)

Numbers, hedges, venues and Cite tiers on removed lines against added lines, per file:

- FailureRates.tsx: removed and not re-added: "6.2" (corrected to 6.3) and 12 `venue="preprint"`
  (now `venue="HPCA 2025"`). Added: 6.3, "32" (the paper's "> 32 GPUs"), the HPCA DOI in a code comment.
  No number, hedge or "our reading" lost.
- Checkpointing.tsx: removed and not re-added: 9 `venue="preprint"` (8 now HPCA 2025, 1 now SC 2020).
  Added: the training_engine.py L884-L885 and training_config.py L551-L552 Cites (tier 1, kind code), and one
  extra MegaScale (tier 3) and Gemini (tier 2) Cite on the body summary sentence. Every number in the moved
  MegaScale and Gemini text (several seconds, two or three machines, 92%, SOSP 2023) is still on the page.
- Resuming.tsx: nothing removed that is not re-added. Added: README L94-L101 Cite (tier 1) and one
  "our reading" label.

Every `ExpandableSection` keeps its Cites; no venue badge, protocol label (A1, A3, E4) or vendor-claim
kind was dropped.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| FailureRates.tsx | 5 | 4 | 5 | 5 | 4 |
| Checkpointing.tsx | 5 | 5 | 5 | 5 | 3 |
| Resuming.tsx | 4 | 5 | 5 | 5 | 3 |

Main-path words now: section 17 about 1,360, section 18 about 2,780 (down 110), section 19 about 2,450
(down 20, with 40 more words in expandables). Economy stays at 3 for sections 18 and 19. What remains in
their main path answers Q3 with a setting, a default or a sized number. Cutting further would trade sourced
items or split the calculator from its procedure, which the four verbs do not allow. Section 19's length
comes from scope (four subjects), not from padding, so a shorter page needs a scope decision, recorded
here for the backlog. Accuracy stays at 5.
