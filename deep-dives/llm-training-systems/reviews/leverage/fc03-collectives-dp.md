# Leverage pass fc03-collectives-dp (sections 7, 8, 9), 2026-10-31

Status: done. Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Before-scores are taken
after the fact-check fixes (`reviews/factcheck/fc03-collectives-dp.md`), so accuracy starts at 5.

## Before-scores (1 to 5)

| File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| Collectives.tsx | 5 | 4 | 5 | 5 | 4 |
| DataParallel.tsx | 5 | 5 | 5 | 5 | 4 |
| TensorParallel.tsx | 5 | 5 | 5 | 5 | 4 |

## Collectives.tsx: the three questions per block

| Block | 1. Meaning to the reader | 2. Mental model, and is it visible | 3. Leverage | Verb |
|---|---|---|---|---|
| Intro | Every split is paid in bytes, so a layout can be priced on paper | bytes / link bandwidth against compute; carried by the later diagrams | Price before running | keep |
| Ranks, degrees and where each rank runs | Where a TP group lands decides its link | Rank grid with TP fastest-varying; RankGridDiagram | Start-up hostname check per TP group (monitoring); code quotes already in an ExpandableSection | keep |
| Five operations | Recognise each collective and its bytes per rank | Before/after holdings; CollectivesFigure; WhereList routes to sections 8 to 12 | Read the bytes off a card | keep |
| All-reduce is RS then AG | One identity behind SP and ZeRO 1 and 2 | Decomposition; DecompositionDiagram; 2(n-1)/n saturates, so the link is what changes | Predicts "no extra bytes" for SP's swap and ZeRO at one micro-batch | keep |
| Reading a collective benchmark | Turn an nccl-tests row into a time and a peak comparison | algbw versus busbw; prose is enough for two formulas | Hold measured busbw against 450 and 400 GB/s | keep |
| Bandwidth hierarchy | The two numbers every estimate divides by | 450 versus 50 GB/s per GPU, ratio 9; LinkHierarchyDiagram | Which number a collective pays (combine-first versus GPU-to-GPU) | re-express: the pointer "the evidence is in the next block" now names the block ("Why the crossing is priced per instance") |
| Price a collective | The payoff: a four-step procedure and the measurement that replaces the peaks | Per-link division; strongest number 62 ms against 60 ms in the h2 and the list | Size a layout; A1 protocol already demoted, labelled "not yet run" | keep |

## DataParallel.tsx: the three questions per block

| Block | 1. Meaning to the reader | 2. Mental model, and is it visible | 3. Leverage | Verb |
|---|---|---|---|---|
| Intro | 128.5 GB of model state does not fit one GPU; the challenge is sharding without paying on the slow link | Memory against collectives | Frames the four answers | keep |
| DP and DDP | What plain replication costs | Buckets overlap the all-reduce with backward | `bucket_cap_mb` default 25 MiB; measure it | keep |
| ZeRO | Choose a stage from bytes per parameter and traffic | One class sharded per stage; ZeroStageTable | Stage 1 free in bytes; stage 2 sends per micro-batch under accumulation | keep |
| FSDP and HSDP | How wide to shard | "Cross the slow link once, fan out on the fast one"; ShardingFigure | Keep the sharding group in the instance; paper-formula conflict already demoted | keep |
| Price it: 8B on four p5.48xlarge | The payoff: the sync mode is the larger lever | Two levers; CrossingChart; strongest number "about 12 times" in h1, h2, lever paragraph and settings list | `fsdp_defer_gradient_reduction`, `reduce_dtype`, PyTorch version with every byte count; A2 labelled "not yet run" | keep |
| The ceiling is the batch | When more replicas stop helping | Critical batch size; Llama 3's fixed batch | Move further GPUs to model-splitting dimensions | keep |
| Set the data-parallel dimension | Four settings in order | Restates the levers as steps | Ends on the calculator and measuring the survivors | keep |

## TensorParallel.tsx: the three questions per block

| Block | 1. Meaning to the reader | 2. Mental model, and is it visible | 3. Leverage | Verb |
|---|---|---|---|---|
| Intro | Training TP differs from serving TP in direction and frequency | Collectives in every layer of every micro-batch | Frames why TP needs the fastest link | keep |
| Column, then row | Where the four collectives per layer sit | f and g operators; TpLayerDiagram; code already demoted | Count TP collectives per layer | keep |
| Traffic that follows the activations | Price TP: 0.94 GB, 2.1 ms against 13.3 ms, about 16% | 8bsh(t-1)/t, h the only model dimension | Size TP's share; arithmetic and Calculator C demoted | keep |
| Why TP stops at the instance | TP's share grows with t; off-instance it outlasts compute | LayerTimeDiagram (2.1, 13.3, 18.8 ms) | TP at most 8; hostname check (monitoring) | keep |
| Which degrees the heads allow | Avoid a rejected config | Heads and KV-head divisibility | Check t before launch | keep |
| Sequence parallelism | Turn SP on: same boundary bytes plus one overlapped all-gather per block, 99.4 to 61.9 GB | SpLayerDiagram; code already demoted | Fits the 70B layout | keep (fact-check pass already narrowed the h2) |
| Set the tensor-parallel degree | Four actions and the hand-off to other dimensions | Restates the section as steps | Flags, defaults, start-up requirement demoted | keep |

## Changes made in this pass

- Collectives.tsx:1090-1092, re-express: the forward pointer names the ExpandableSection that holds
  the per-instance evidence. No claim changed.
- Line reflows with no wording change in DataParallel.tsx (the closing paragraph) and
  TensorParallel.tsx (the rank-order paragraph).
- Nothing deleted, reordered or demoted: each section already orders blocks so the payoff lands
  last, keeps code quotes, protocols and derivations in ExpandableSections, and repeats its
  strongest number. No sourced number, hedge, venue badge, "Illustrative, not measured" caption or
  "not yet run" label was touched.

## Claim-set diff against HEAD (`git diff HEAD`, read-only)

Every assertion in the after that is not in the before, with its source (all from the fact-check
pass; this pass added none):

1. torchrun rank range L618-L688: pinned PyTorch api.py, cited.
2. srun "and no distribution given ... rather than node index order": Slurm srun manual, cited.
3. NVLink "the page's prose calls the newest generation's 3 TB/s bidirectional": NVIDIA NVLink page, cited.
4. ZeRO equality "at one micro-batch per step": ZeRO Sec 7.2.1 and section 8's DeepSpeed Cite.
5. "cannot start" (DDP paper Sec 2.3), "half the 1,979 NVIDIA lists with sparsity" and "past NVIDIA's 80 GB" (H100 page): cited.
6. SP "one all-gather per block ... overlapped": SP paper Sec 4.2.2 and Megatron layers.py L768-L781, both cited in the sentence.
7. Megatron guide "there with a size of 4": guide L82-L89, cited.
8. Acronym expansions (EFA, DDP, ZeRO, FSDP, HSDP, SwiGLU): definitions, no source needed. The
   82 GB case now reads "an eager (uncompiled)" SwiGLU instead of TorchTitan v0.4.0's: a narrower
   claim, from the fact-check pass (TorchTitan model.py L87-L89 at v0.4.0).
9. Venue badges MLSys 2023 and ICLR 2024: proceedings pages listed in the fact-check file.

## After-scores (1 to 5)

| File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| Collectives.tsx | 5 | 4 | 5 | 5 | 4 |
| DataParallel.tsx | 5 | 5 | 5 | 5 | 4 |
| TensorParallel.tsx | 5 | 5 | 5 | 5 | 4 |

Accuracy held at 5. No axis moved. Collectives' leverage stays at 4: its blocks are mostly
vocabulary for later sections, which the page says outright, and connecting "Five operations" to a
monitoring hook such as profiler kernel names would need a source the page does not carry, so this
pass did not assert it.
