# R3 review: outcome fit of SCOPE.md

- **Reviewer lens:** R3, outcome fit. Does the plan deliver the job brief's six goal items and the "set my ranks" requirement for this reader, and does every section earn its place? The test is the governing rule of the section-shape standard (a block earns its place by building a mental model or being practical to know), applied with the leverage pass's three questions (what it means to the reader, what model it builds, what the reader decides, configures, sizes or monitors with it).
- **Date:** 2026-10-30
- **Document reviewed:** `deep-dives/llm-training-systems/SCOPE.md`, Scoping v1 (2026-10-30): 32 sections in layers A to H, Calculators A to D and the pipeline schedule chart. Read with `RESEARCH-GUIDE.md` and the seven claim registers in `research/2026-10/`, chiefly `02-parallelism.md` section 3 (inputs, worked examples, the 12-step procedure), `01-training-step-maths.md` W1 to W8, `03-frameworks.md` W1 to W4, `05-aws-infrastructure.md` section 3 and `06-aws-orchestration.md` section 3.1 (the ownership matrix). Existing dives checked by section file names and h2 descriptions: `efa`, `silicon-memory-inference`, `vllm`, `sglang`, `rl-agentic-loops`.
- **Standards applied:** `deep-dives/efa/revamp/section-shape-standard.md`; `deep-dives/efa/revamp/leverage-pass-standard.md`; the "Content Philosophy" and "Section Shape" parts of the repo `CLAUDE.md`. Format and depth modelled on `deep-dives/rl-agentic-loops/reviews/2026-10/R3-outcome-fit.md`.
- **Constraint:** this review scores what the plan contains. Fixes cut, merge, move, reframe or rescope sections and calculators using material already in the scope or the registers; they add no topics. Material the goal needs and the plan lacks is under "Backlog, not fixes". Numbers this review computed are marked [derived in this review]: they are arithmetic on register inputs, appear in no register, and need wave 2's check before any of them reaches the page.

---

## Goal coverage

| Goal item | Sections that deliver it | Verdict |
|---|---|---|
| (1) Theoretical intuition: mental model and key maths per concept, with worked numbers on a real model and instance | 3 to 14 (the step, 6ND, memory, precision, collectives, DP and sharding, TP, PP, CP, EP, composition, sizing); 17 and 18 for failure and checkpoint maths | Covered, and the strongest part of the plan. Worked numbers on Llama 3.1 8B and 70B on p5 carry 4, 5, 8, 9, 10, 14, 17 and 18. Gaps: section 6 (precision) has no worked number; section 13 has none of its own; section 12's numbers are for DeepSeek's H800 cluster. Several sections stack published evidence past what the model needs, which drifts toward the research survey the brief rules out (finding 15). |
| (2) AWS self-managed: EC2 and EKS | 20 (ownership map), 21 (hardware), 22 (capacity and cost), 23 (storage), 24 (own Slurm, ParallelCluster), 25 (self-managed EKS), 19 (torchrun restart defaults) | Covered. Plain torchrun on EC2 without a scheduler appears only as a matrix column and section 19's `--max-restarts` default, which is enough for this reader. |
| (3) AWS managed: SageMaker training jobs, HyperPod Slurm and EKS, PCS, Batch on EKS; ParallelCluster only if the research says so | 26 (training jobs, Batch service jobs), 24 (HyperPod Slurm, PCS, ParallelCluster), 25 (HyperPod EKS, Batch on EKS), 27 (Trainium on each path), 28 (the choice) | Covered. Batch on EKS is thin (two sentences; health handling and EFA for multi-node jobs unread, U06-7, already queued for wave 2). ParallelCluster's treatment (maintained to 2028-02-20, AWS's banner steers new clusters to PCS, keep existing clusters) matches what the research found and is sized right. |
| (4) Best practices across all paths | 20 (what the script owns on every path), 17 to 19 (failure, checkpoint, restart), 22 (capacity first), 28, 31 (bring-up) | Covered, distributed, with 31 as the consolidating checklist. 31 is missing two rungs the dive already supplies: the layout bake-off and the version pin (finding 17). |
| (5) Observability and telemetry | 29 (what to measure), 30 (the telemetry stack per path), 19 (stragglers), 31 step 8 | Covered for what to measure, alerting and hang diagnosis. Thin on finding where step time goes in a low-MFU run: profilers are unread (U07-5 Holistic Trace Analysis, U07-6 Nsight Systems and `NCCL_DEBUG`), already queued for wave 2. |
| (6) Notable open-source training frameworks | 15 (framework map), 16 (fine-tuning and post-training), 27 (TorchTitan Neuron) | Covered at pinned tags with each project's own maturity words. |
| "Help me set my ranks" for a model, cluster and memory budget | 14 (procedure and Calculator C) with inputs from 5 (Calculator B), 7 to 12 and 21 | Dense models on GPUs: answerable (case a). Trainium: answerable with a rank substitution the calculator spec does not name. Mixture of experts: not answerable (case b). See the walk-throughs and findings 1 to 4. |
| At least one interactive calculator for memory and parallelism | Calculators B and C, plus A (run time and cost), D (checkpoint interval) and the section 10 schedule chart | Present. Calculator B cannot check the layouts Calculator C enumerates, and C's ranking rule is not one a reader can act on (findings 3 and 4). |
| Sections serving no goal item | None. Section 32 is the reference appendix the repo requires. | |

**Proportion.** Theory holds 12 sections (3 to 14) and four of the five deep sections (4, 5, 8, 10; 18 is the fifth); AWS holds 9 applied sections (20 to 28); keeping a run alive and operating it hold 6 (17 to 19, 29 to 31); software 2; framing and reference 3. That matches the brief, which puts the mental model first and the AWS paths second. Nothing should be cut for size before Gate 1. What is over-built is evidence density inside sections rather than the section count: published-run lists in 4, 10, 17 and 19, documentation-against-documentation contradictions in 21 that change no reader input, and date-stamped status lines that will be past by build time (finding 15, finding 19).

**Calculators, in one view.** Calculator A misses its own sequence-length input and does not show the dive's 1.1 to 1.3 times real-run band (finding 12). Calculator B lacks the pipeline, context-parallel and gradient-dtype inputs that C's layouts need, and its headroom flag is written for 80 GB parts only (finding 4). Calculator C enumerates the right layouts for dense models but ranks them on a mix of percentages that hides recomputation's cost and FSDP's accumulation mode (finding 3), rejects the published 405B and DeepSeek-V3 pipeline layouts (finding 2), and cannot memory-check its own MoE preset (finding 1). Calculator D's two input lists disagree and its storage target is wrong under an asynchronous save (finding 13). Nothing the reader needs to act on is missing a calculator; each of the four needs its inputs corrected.

---

## "Set my ranks" walk-throughs

Both cases use only the scope, the registers it cites, the 12-step procedure of `02-parallelism.md` section 3.5 (the scope's section 14 restates it) and Calculators B and C as specified. Conventions follow register 02 section 3: decimal GB, 40% MFU as the labelled working assumption (396 TFLOPS effective on H100 and H200), link peaks of 450 GB/s NVLink and 50 GB/s EFA per GPU per direction.

### Case (a): Llama 3.1 70B, full fine-tuning or pre-training, 4 x p5en.48xlarge (32 H200), 8,192 tokens

Global batch: the brief gives none. Pre-training uses the dive's 70B batch, 512 sequences (4.19M tokens; 02 section 3.2). Fine-tuning uses 64 sequences, an assumption of this review, because no register gives a fine-tuning batch.

| Step | Executed? | What the plan supplied, or what was missing |
|---|---|---|
| 1. Gather inputs | Yes | Psi 70,553,706,496, 80 layers, h 8,192, 64 heads, 8 KV heads (01 W1, T02-67). The p5en row of 05 section 3.1: 8 x H200, 141 GiB per GPU on the EC2 page (NVIDIA prints 141 GB; this review uses the smaller), NVSwitch 900 GB/s (450 per direction, register 02's reading of T02-70), 3,200 Gbps of EFA (50 GB/s per GPU), 989.5 TFLOPS dense BF16. Missing: a fine-tuning global batch. |
| 2. Model state against HBM | Yes | 1,128.9 GB against 141 GB per GPU; 05 section 3.3 already gives 0.93 p5en nodes. Shard. |
| 3. Shard over data-parallel ranks first | Yes, through Calculator B | ZeRO-1 over 32: 308.7 GB per GPU; ZeRO-2: 172.0 GB (01 W2). Both fail. FSDP over 32: 35.3 GB of state, but 179.9 GB of activations without recomputation (01 W4); with full recomputation 35.3 + 13.0 + 6.3 (logits) + 3.4 (two gathered layers) is about 58 GB, which fits [derived in this review]. HSDP with one instance per sharding group: 141.1 GB of state alone, which fails [derived in this review]. Communication for FSDP 32: one all-gather or reduce-scatter is 136.7 GB per GPU over EFA; FSDP2's default three per micro-batch (03 W1's method) is 410 GB, 8.2 s against 11.7 s of compute per 8K sequence with recomputation, about 70%. Deferring the reduction is not available: its unsharded BF16 gradient is 141.1 GB [derived in this review]. |
| 4. Tensor parallelism up to the instance | Yes | TP 8 passes the head checks (64 and 8 divide by 8, T02-15). TP 8 x DP 4 with ZeRO-1: 35.3 (weights and gradients) + 26.5 (optimizer over DP 4) + 22.5 (activations, TP 8 with SP, 01 W4) + 0.8 (logits) = 85.0 GB, with no recomputation [derived in this review]. TP traffic is about 16% of layer compute on NVLink (02 section 3.2; p5en has the same peak and link). |
| 5. Smallest PP that fits | Yes | p = 1. TP 8 x PP 2 x DP 2 is about 67 GB on the first stage, if the reader wants margin [derived in this review]. |
| 6. Context parallelism | Ambiguous | The scope's rule, "add CP at 8K tokens and above", says add it; every 8K layout the dive itself lands on omits it (finding 6). Skipped. |
| 7. Expert grid | Not applicable | Dense model. |
| 8. Divisibility | Yes | 32 = TP 8 x PP 1 x CP 1 x DP 4; 512 / 4 = 128 micro-batches per rank at b = 1 (16 for the fine-tuning batch). |
| 9. Bubble | Yes | None at p = 1. For the PP 2 alternate, 1/256 = 0.4% (pre-training batch) or 1/32 = 3.1% (fine-tuning batch) [derived in this review]. |
| 10. Bytes per link against compute | Yes | ZeRO-1 over DP 4 moves 26.5 GB per GPU per step over EFA, 0.53 s against 140 s of compute (4.19M tokens) or 17.5 s (0.52M tokens): 0.4% to 3% [derived in this review]. |
| 11. Nesting | Yes | TP inside each instance, DP across the four. |
| 12. Measure | Stated, not carried | Section 14 ends on "measure", but section 31's bring-up ladder has no rung for it (finding 17). |

**Result: a layout.** TP 8 x DP 4 with ZeRO-1 or the distributed optimizer, no recomputation, about 85 GB of 141 on paper (about 103 GB if gradients are kept in FP32, as Megatron does); alternate TP 8 x PP 2 x DP 2. Flat FSDP 32 fits only with full recomputation and spends about 70% of compute time on EFA; HSDP inside one instance does not fit. This also lands a claim section 21 makes without a layout: on 32 H100 the same TP 8 x DP 4 layout needs the same 85 GB and does not fit 80 GB, so the H200's memory removes the pipeline.

**Where Calculator C as specified falls short on this case.** It would list the same survivors, but (i) its ranking shows FSDP 32 at about 70% EFA share and TP 8 x DP 4 at 16% NVLink plus under 3% EFA, with no rule for combining shares on different links and nothing that charges FSDP 32 for the 33% more FLOPs its recomputation costs; (ii) it has no input for FSDP's per-micro-batch default against deferred reduction, nor a check that deferral's unsharded gradient fits; (iii) the "above 60 GB of 80" flag has no reading on a 141 GB part. Findings 3 and 4.

### Case (b): a mixture-of-experts model on 32 p5.48xlarge (256 H100)

Model choice: DeepSeek-V3, the scope's own MoE preset for Calculator C. Mixtral 8x7B is not workable from the plan: the registers carry no Mixtral shapes (T02-41 holds only Mixtral 8x22B's MFU). DeepSeek-V3's sequence length and batch are not in the registers either; this review assumes 4,096-token sequences where a compute time is needed.

| Step | Executed? | What the plan supplied, or what was missing |
|---|---|---|
| 1. Gather inputs | Partly | Present: 671B total and 37B active parameters (T01-26); 61 layers, the first 3 dense and 58 MoE; h 7,168; 128 heads of 128; 1 shared and 256 routed experts of intermediate width 2,048; top-8; at most 4 nodes per token (T02-71); 14 bytes per parameter in DeepSeek's recipe (T01-47, 01 W2). Missing: MLA's compressed projection sizes (so attention parameters and activations), the dense layers' FFN width, the vocabulary, and the training sequence length and batch. Derivable: 44.0M parameters per expert assuming a three-matrix SwiGLU expert (T02-71 does not state the activation), 656.5B in the 58 x 257 experts, about 14.5B elsewhere by subtraction from the rounded 671B [derived in this review]. |
| 2. Model state against HBM | Yes | 9.39 TB at 14 bytes against 20.5 TB of cluster HBM: nearly all state must be sharded. |
| 3 and 7. Shard, then set the expert grid | Partly | EP 8 inside the instance, as the guidance prefers (T02-42): 81.7B expert parameters per GPU, 35.8 GB once sharded over EDP 32, but the sharded experts' gathers cross EFA, about 475 GB per GPU per micro-batch, 9.5 s against about 2.3 s of compute per 4,096-token sequence: fails step 10 by 4x. EP 64 across 8 instances (DeepSeek's degree, T02-40) with EDP 4: 10.2B expert parameters per GPU; ZeRO-1 style leaves 81.7 GB before activations (fails); sharding the experts over EDP 4 gives about 37 GB of model state per GPU with the dense part sharded over 256 [all derived in this review]. |
| 4. Tensor parallelism | Skipped | DeepSeek used none; the scope's guidance (expert TP 1 for fine-grained experts, T02-42) agrees. |
| 5. Smallest PP that fits | Blocked | 61 layers divide by no p above 1, so the rule "layers must divide by p" rejects every pipeline layout, including DeepSeek's own PP 16 (finding 2). The shape the published run points to, PP 4 x EP 64 x EDP 1 with about 36 GB of expert state per GPU and no expert-sharding traffic [derived in this review], cannot be considered. |
| 8. Divisibility of both grids | Yes, for p = 1 | Dense grid TP 1 x CP 1 x PP 1 x DP 256; expert grid ETP 1 x EP 64 x EDP 4 x PP 1 = 256 (T02-41, T02-72). Batch divisibility unknown. |
| Memory check (Calculator B) | No | No activation formula for an MoE or MLA layer exists in the scope or registers (01 W3 derives Llama's dense layer only), and B has no expert-grid, top-k or capacity-factor input. |
| 9. Bubble | No | No admissible p and no batch. |
| 10. Bytes per link against compute | Yes, order of magnitude | Dispatch plus combine is about 172 KB per token per MoE layer forward (02 section 3.4), about 20 MB per token per step with backward across 58 layers; at 50 GB/s that is 0.40 ms per token against 0.56 ms of compute per token per GPU (6 x 37e9 at 396 TFLOPS), about 70% before node de-duplication [derived in this review], consistent with DeepSeek's reported roughly 1:1 (T02-40). EDP 4 sharding adds about 46 GB per GPU per micro-batch over EFA. |
| 11. Nesting | Yes, as a statement | EP spans 8 instances; node-limited routing (T02-39) is the plan's answer. |

**Result: no layout worth measuring.** The procedure reaches a model-state-feasible grid (PP 1, EP 64, EDP 4 with sharded experts, about 37 GB of model state per GPU) whose activation memory it cannot check and whose EFA traffic, all-to-all plus expert sharding, exceeds compute. The layout DeepSeek's own run points toward is rejected at step 5.

**Trainium, briefly.** Llama 3.1 8B on one trn2.48xlarge is already worked in section 27 (the validated TP 4 x FSDP 16 layout, T03-38), so it is not used as case (b). The procedure reproduces it only when a rank is a logical NeuronCore with 24 GiB of HBM (03 W3): FSDP 64 with full recomputation is about 11.6 GB per rank and TP 4 x FSDP 16 about 18.7 GB, both under 24 GiB [derived in this review]. Calculator C's spec names neither the rank unit nor per-rank HBM, and step 10 has only a per-chip NeuronLink figure (05 section 3.1).

### Conclusion

"Set my ranks" is answerable from this plan for dense models on GPUs: case (a) reaches a defensible layout and the reason the alternatives fail, using only planned material. It is not answerable for mixture-of-experts models, although the plan promises it (the MoE route in section 2, the DeepSeek-V3 preset in Calculator C). The minimal change that makes the requirement answerable, in four parts, with no new topic:
1. Step 5 accepts uneven first and last pipeline stages, Llama 3's published practice (T02-35), and Calculator C flags them (finding 2).
2. Calculator B gains pipeline (with virtual stages), context-parallel and gradient-dtype inputs, states headroom as a fraction of HBM, and Calculator C carries ranks and HBM per rank for Trainium (finding 4).
3. Calculator C ranks by one estimated step time that charges recomputation, the bubble and exposed communication, and enumerates FSDP's accumulation mode with its memory price (finding 3).
4. MoE support is rescoped to what the registers can carry: model state by the two grids and expert-parallel bytes, with activation memory labelled "not modelled; measure a step", and output worded "candidate grids to test" (finding 1).

---

## Section scores

| # | Section | Score | One-line reason |
|---|---|---|---|
| 1 | A training run is three budgets | 7 | The three-budget frame plus the ownership question is the right opening; its question-to-section map duplicates section 2's (finding 11). |
| 2 | Getting started: your journey into distributed training | 7 | Prerequisites and routes are needed; three of the four routes skip sections their destination depends on (finding 8). |
| 3 | What one training step computes, and what it keeps | 9 | Model state against activations, and B = b x m x d, carry every later section; ends on the model rather than its use (finding 16). |
| 4 | Counting the arithmetic: 6ND, MFU and how long a run takes | 9 | Three honest corrections and a validation against Llama 3 405B, ending on Calculator A; the published-MFU list leans toward survey (finding 15). |
| 5 | The memory budget: 16 bytes per parameter, then activations | 8 | The memory bill and its levers with prices; the gradient dtype (16 against 18 bytes) is unstated and the headroom rule only reads on 80 GB parts (finding 4). |
| 6 | Precision for training: BF16, FP8 and the microscaled formats | 7 | "Where the scale factor lives" is a good model; no worked number, and it ends on a lookup table (finding 9). |
| 7 | Collectives: five operations and what each one costs | 9 | The cost vocabulary everything else spends, with the 9x NVLink-to-EFA gap; the reader's use of it is implied, not stated (finding 16). |
| 8 | Data parallelism and sharding: DDP, ZeRO, FSDP and HSDP | 9 | The 373 GB against 3 GB example and FSDP2's per-micro-batch default change what a reader configures. |
| 9 | Tensor and sequence parallelism: splitting every layer | 9 | Why TP stops at the instance, with numbers and the divisibility rules a framework enforces. |
| 10 | Pipeline parallelism and the bubble | 8 | Bubble formula and the first-stage memory fact are core; the schedule catalogue leans toward survey, and the divisibility rule it feeds is wrong for published layouts (findings 2, 15). |
| 11 | Long sequences: context parallelism | 7 | Distinct from SP and needed for long context; its practical ending contradicts the dive's own 8K layouts (finding 6). |
| 12 | Mixture of experts: expert parallelism | 7 | The two-grid model and the doc-against-code formula are training-specific value; the dispatch and fast-domain rule repeat the silicon dive, and its sizing cannot be completed (findings 1, 7). |
| 13 | Composing the dimensions: how frontier runs are laid out | 6 | Nesting innermost-fastest is a real model, but every element is an input to section 14 and the section ends on a hand-off (finding 5). |
| 14 | Set my ranks: the sizing procedure and calculator | 8 | The operational centre; works for dense models, fails for MoE, ranks on the wrong metric, and its 8B example repeats section 8 (findings 1 to 5). |
| 15 | The framework map: engines, front ends and maturity labels | 8 | Engine against front end is the right organising model, with defaults read in code; several "learned the hard way" facts belong to other sections (finding 10). |
| 16 | Fine-tuning and post-training runs as systems | 7 | LoRA and QLoRA memory and "the engine decides the behaviour" serve the fine-tuning reader; its 1,270 GB disagrees with section 5's 1,128.9 GB without saying why (finding 4). |
| 17 | Failure is the steady state: interruption rates and goodput | 9 | The series-system MTTF gives the interval a design must beat, landed on Llama 3's 3.1 hours; evidence stack can be demoted (finding 15). |
| 18 | Checkpointing: what to save, how often, how fast, and where | 9 | Young and Daly with worked ETTR and the two silent-default traps, ending on Calculator D; the calculator spec needs correcting (finding 13). |
| 19 | Resuming correctly: restart, elasticity, stragglers and determinism | 8 | `--max-restarts` at 0 and the straggler model are practical; four topics in one, and the determinism paragraph has little action. |
| 20 | Three shapes of a training cluster on AWS, and who owns what | 9 | "Node recovery is not job recovery" and the three things the script owns are the most useful AWS models for an ex-EC2 reader. |
| 21 | The training hardware on AWS | 7 | Scale-up domain as the TP boundary and the calculator table are needed; three of four documentation contradictions and the status lines change no input (finding 15). |
| 22 | Capacity and cost | 8 | Capacity first and the managed multipliers are decision inputs; it restates the EFA dive's Capacity Block limits and prices a published figure the registers flag (findings 7, 14). |
| 23 | Storage for training on AWS: data in, checkpoints out | 7 | "Text tokens are cheap; checkpoints are not" is a real model; the service limits are owned twice here and once in the EFA dive (findings 7, 10). |
| 24 | The Slurm family: your own Slurm, AWS PCS and HyperPod Slurm | 8 | Three paths sorted by who runs the controller and who checks the GPUs, with fees. |
| 25 | The Kubernetes family: self-managed EKS, Batch on EKS and HyperPod EKS | 8 | The pieces a synchronous job needs, the job API migration and the Auto Mode fee change real choices. |
| 26 | SageMaker training jobs: a cluster per job | 7 | The fine-tuning route lands here and the SDK and library status is practical; half the payoff restates the topic and the recipes facts are owned three times (findings 10, 16). |
| 27 | Trainium: the Neuron path for training | 8 | Current stack, the rank unit and what no managed path ships, ending on a concrete start. |
| 28 | Choosing your path | 8 | Four questions with fees and the first action per leaf; repeats the per-family endings of 24 to 26 (finding 10). |
| 29 | What to measure in a training run | 9 | Three signal layers, MFU read in tokens per second, gradient norm as the leading indicator, and an alert set. |
| 30 | The telemetry stack on AWS | 8 | Hangs first and the default-off signals per path; profilers unread (wave 2). |
| 31 | Bring-up: from one node to the full run | 9 | The right ending and the right order; missing the layout bake-off and version-pin rungs (finding 17). |
| 32 | Glossary and sources | 7 | Required appendix; the acronym list does not match the section text (finding 18). |

Mean 7.9 (254 / 32). Lowest: 13 (6), then 1, 2, 6, 11, 12, 16, 21, 23, 26 and 32 at 7.

---

## Findings

**1. BLOCKER.** Section 14 (Set my ranks) Calculator C's DeepSeek-V3 preset; section 12 (Mixture of experts); section 2's route "add 12 for MoE"; the Calculators list.
- *Problem:* The plan promises mixture-of-experts sizing and cannot deliver it. Calculator B, the memory check Calculator C runs, has no expert-grid, top-k or capacity-factor input, and no register holds an activation formula for an MoE or MLA layer (01 W3 derives Llama's dense layer only). The registers also lack DeepSeek-V3's MLA projection sizes, its dense FFN width, vocabulary, sequence length and batch, so step 1 cannot complete. Case (b) shows the result: the procedure reaches a model-state-feasible grid it cannot memory-check, with EFA traffic above compute, and rejects the layout DeepSeek's own run points to (finding 2). A calculator that ranks layouts it cannot memory-check would hand an agent or a reader a confident wrong answer.
- *Fix:* Rescope MoE in section 14 and Calculator C to what the registers carry. For an MoE model C reports model state per GPU on both grids (dense TP x CP x PP x DP; expert ETP x EP x EDP x PP; T02-41, T02-72), expert parameters from T02-71's shapes with the total from T01-26, expert-parallel bytes from T02-38 with T02-39's node-limited bound, and the world-size check of both grids. Activation memory for MoE and MLA layers is labelled "not modelled; measure a step", and the output is worded "candidate grids to test", not "layouts worth measuring". Section 12's ending and section 2's MoE route take the same wording. If the preset cannot take this shape before Gate 1, drop it from Calculator C and keep section 12 as mechanism. The missing formula and shapes go to the backlog.

**2. MAJOR.** Section 14 step 5 ("layers must divide by p") and Calculator C's divisibility filter; section 10 (Pipeline parallelism and the bubble).
- *Problem:* The rule rejects both frontier layouts the dive teaches. Llama 3 405B ran PP 16 with 126 layers (126 / 16 = 7.875), which T02-35 explains: Llama 3 removed one layer from the first and last stages to balance embedding and loss work, 7 + 14 x 8 + 7 = 126 [derived in this review]. DeepSeek-V3 ran PP 16 with 61 layers, a prime. Calculator C's 405B preset would reject the published layout that section 13 presents as the model to read.
- *Fix:* Step 5 states the rule as Megatron's default check and names uneven first and last stages as the published practice (T02-35). Calculator C admits a layout that becomes divisible after one layer moves off the first and last stages, flagged "uneven stages: confirm your framework supports them" [our reading]. Section 10 carries the same sentence where it introduces stages. Which frameworks support uneven stages, and how DeepSeek-V3 split its 61 layers, go to the backlog.

**3. MAJOR.** Section 14 and the Calculators list (Calculator C's ranking and enumeration).
- *Problem:* "Ranks them by bubble and by bytes per link as a share of compute" is not a rule a reader can act on. (i) It produces two to four percentages per layout on different links with no way to combine them. (ii) Full recomputation adds about 33% more FLOPs (section 5), which lowers every communication share while lengthening the step, so the metric rewards adding recomputation. (iii) FSDP's accumulation mode changes FSDP bytes several-fold (section 8: 373 against 156 GB for 8B on four instances; T03-2, T03-3), and deferral costs a full unsharded gradient, 141 GB for 70B, which does not fit an H200 [derived in this review]; the spec has no input for either. (iv) It does not say whether C enumerates micro-batch, recomputation mode and sharding stage or takes them as inputs. Case (a) shows the effect: flat FSDP 32 needs full recomputation to fit and spends about 70% of compute time on EFA, while TP 8 x DP 4 fits without recomputation; the share metric shows the 70% and hides the 33%.
- *Fix:* Rank by one estimated step time assembled from formulas the scope already has: compute from section 4, times the recomputation factor from section 5, times (1 + bubble) from section 10, plus exposed communication from sections 7 to 9, reported as a range between full overlap and none. Enumerate TP, PP, virtual stages, CP, DP or FSDP degree, micro-batch, recomputation mode and FSDP accumulation mode, and check each candidate's memory price (deferral's unsharded gradient included) through Calculator B. Show the per-link shares behind each step time. The same function is what "an agent can call the same procedure" refers to, so specify it once for both.

**4. MAJOR.** Section 5 (The memory budget) and the Calculators list (Calculator B); sections 14 and 16 (byte counts).
- *Problem:* Calculator B cannot check the layouts Calculator C enumerates. It has no pipeline degree or virtual stages (PP divides weights and optimizer state; interleaving raises first-stage activations from 22.8 to 26.2 GB in 02 section 3.2), no context-parallel degree (CP divides activations, and the distributed optimizer shards over DP x CP, 03 W2), and no gradient dtype. The plan uses three byte counts for one 70B model state without saying why: 16 bytes (1,128.9 GB, section 5), 18 bytes for FP32 gradients (79.4 GB per GPU in section 14's Megatron Bridge example; 1,270 GB in section 16), and 14 (DeepSeek-V3 style). In case (a), FP32 gradients move TP 8 x DP 4 from 85 to 103 GB [derived in this review]. The flag "above 60 GB of 80" has no reading on 141, 179 or 268 GB parts, or on a 24 GiB logical NeuronCore, and C's instance list does not carry Trainium's rank unit.
- *Fix:* Calculator B takes PP (with v), CP and gradient dtype (the 16- and 18-byte rows) as inputs, offers the optimizer rows section 5 already lists, and states headroom as a fraction of HBM: 75% reproduces the current 60 of 80 [our reading; no source states a headroom figure]. Sections 5 and 16 state the gradient dtype beside every byte total. Calculator C's instance table carries ranks per instance and HBM per rank, with trn2.48xlarge at 64 ranks and 24 GiB per rank at LNC=2 (T03-38, 03 W3).

**5. MAJOR.** Section 13 (Composing the dimensions) and section 14 (Set my ranks).
- *Problem:* Section 13's content is section 14's input set. Llama 3's nesting order is step 11; Megatron's "model parallelism just large enough, then data parallelism" is steps 4 and 5; TorchTitan's "FSDP alone up to about 512 GPUs" is cited in step 3's ordering note. It ends on a hand-off ("which section 14 turns into a procedure"), not a reader action, and the sentence on Llama 3's internal projection tools passes neither test. Meanwhile section 14's second worked example (8B on one and four instances) re-teaches section 8's worked example, and both of 14's examples are cases where the plan's first choices work.
- *Fix:* Merge 13 into 14 as its opening block, "the published layouts the procedure must reproduce", keeping the 4D mesh diagram and cutting the tools sentence. Section 14 points to section 8 for the 8B case and uses the space for a case where the first choice fails: case (a) above, Llama 3.1 70B on four p5en. Its result also lands section 21's claim that newer silicon buys memory rather than BF16 compute: the same TP 8 x DP 4 layout needs 85 GB, which does not fit an H100 and fits an H200 with no pipeline and no recomputation [derived in this review; wave 2 verifies]. Calculator C's validation set gains this case. The plan becomes 31 sections.

**6. MAJOR.** Section 11 (Long sequences: context parallelism), its ending; section 14 step 6.
- *Problem:* The practical ending "add CP at 8K tokens and above (Megatron-Core's guidance)" contradicts the dive's own results at 8,192 tokens: both layouts section 14 lands on for 70B use no CP, Llama 3 trained 405B at 8K with CP 1 (T02-47), and case (a) needs none. Megatron Bridge's 70B recipe does use CP 2 (T03-24). A reader following section 11 adds CP to every 8K run.
- *Fix:* Reframe as the procedure's check: add CP when the activations left after TP with SP, and after the recomputation you accept, do not fit Calculator B's budget, or at the lengths where Llama 3 used it (CP 16 at 131K tokens). Keep Megatron-Core's 8K guidance attributed, with "recommends" (advice, not a requirement), next to the counterexamples. Step 6 takes the same wording.

**7. MAJOR.** "Connections to existing deep dives"; sections 7, 9, 12, 20, 22, 23, 26 and 31.
- *Problem:* The plan re-teaches material other dives own, and the Connections list omits several overlapping sections.
  - EFA dive, `AIMLTraining` ("Each strategy puts a different pattern on the wire": DP all-reduce, TP inside the node, PP and DP across, EP all-to-all, hybrid 3D and 4D): not named at all. This dive goes much deeper and should own the material.
  - EFA dive, `Pricing` (Capacity Blocks: 64 per block, 256 across blocks, the final-day clock, no placement group): Connections says Capacity Blocks "stay there", yet section 22 restates each limit.
  - EFA dive, `StorageDataPaths` (FSx for Lustre on EFA: the 100 and 700 Gbps client ceilings and the create-time choices): restated in both section 18 and section 23.
  - EFA dive, `SageMaker` ("Three surfaces, three contracts"; "Pick the contract on who owns the fabric and how long the cluster lives"): overlaps section 20's ownership framing and section 26's lifecycle, named for neither.
  - EFA dive, `DecisionGuide` ("Four stages from one GPU to a hundred nodes") and `EKSIntegration` ("The two-node all_reduce to run first"): overlap section 31's steps 2 and 3.
  - Silicon dive, `MoeAndSparseActivation` and `CommunicationAndScaleOut`: already teach EP's twice-per-layer exchange and "keep it inside one scale-up domain", which section 12 re-teaches as its mechanism and its ending.
  - vLLM `DistributedInference` and SGLang `Parallelism`: teach the inference form of section 7's model ("how often it talks on the network decides where in the topology it can live"); not named.
- *Fix:* Name each in Connections. Each section keeps what training adds and links the rest. Section 22 keeps the training consequences (save before 11:00 UTC on the final day; the 2,048-GPU self-serve ceiling as the cap on how fast a run can finish, priced per finding 14; the managed multipliers) and links EFA `Pricing` for the limits. Section 23 states the client ceilings in one line with the link. Section 12 keeps the separate expert grid, the backward-pass doubling, capacity factor and node-limited routing as a training layout, and links the silicon dive for dispatch and the fast-domain rule. Section 31 links EFA's checks for its steps 2 and 3. Sections 7 and 9 each add one line linking the inference counterparts. Slimming EFA's `AIMLTraining` block to a pointer is backlog for that dive.

**8. MAJOR.** Section 2 (Getting started), "Four shorter routes".
- *Problem:* Three routes skip sections their destination depends on. "Help me set my ranks" omits section 4, which supplies the compute per step that step 10 and Calculator C compare bytes against. "I am fine-tuning" omits section 14 (a full fine-tune of 70B needs ranks; section 16 gives only the 16-H100 model-state floor), section 22 (P-instance quotas start at 0 vCPUs for every run, T05-31) and section 15 (section 16 says "pick the framework by the engine", which 15 defines). "Pick an AWS path and a budget" omits sections 18 and 23, although checkpoint storage is a five-figure monthly line (about $10,000 a month for the 70B example's 16.5 TiB of FSx, section 18), and section 27, although section 22's lowest dollars per peak PFLOP-hour is a Trainium row.
- *Fix:* Set my ranks: 2, 3, 4, 5, 7, 8, 9, 10, 14 (with 13 merged), 21; add 6 for FP8, 11 for long context, 12 for MoE. Fine-tuning: 2, 3, 5, 8, 14, 15, 16, 22, 26, 28. Path and budget: 1, 2, 4, 17, 18, 20, 21, 22, 23, then 24, 25, 26 or 27, then 28.

**9. MINOR.** Section 6 (Precision for training).
- *Problem:* The brief asks every maths section for worked numbers on a real model and instance; section 6 has none. It ends on a per-accelerator lookup table, the closing position shape rule 11 names as wrong. Its scale-granularity ladder partly repeats the silicon dive's `QuantizationAndPrecision` ("What each step down buys in bytes and gives up in range and resolution").
- *Fix:* Land one figure from existing inputs: on H100, FP8 doubles the vendor dense peak (989.5 to 1,979 TFLOPS, a vendor specification, 05 section 3.1) while the 70B model state stays at 1,128.9 GB, because the master copy and the moments stay FP32 (T01-39, T01-47) [derived]. That is the section's own "compute bill far more than memory bill" in numbers. End on the choice per accelerator (BF16 on Trn2; FP8 through Transformer Engine in Megatron Core on Hopper; MXFP8 on Blackwell), with the table demoted to a disclosure. The ladder diagram shows the training scales (run, tensor, tile, block) and links the silicon dive for bit layouts.

**10. MINOR.** Topics owned by more than one section in this dive.
- *Problem and keeper, per topic:*
  - FSx for Lustre per-client ceilings and S3 request rates, in sections 18 and 23: section 23 keeps them; section 18 keeps checkpoint bytes, the interval, the bandwidth target and Calculator D.
  - HyperPod recipes at 2.0.11 (mostly fine-tuning and post-training, one open-weight pre-training recipe), in sections 16, 26 and 27 and the RL dive's `RlOnAws`: section 26 keeps them; 16 and 27 keep one clause each.
  - The capacity window's edge (EC2 begins terminating 30 minutes before the end; 11:00 UTC on the final day), in sections 20, 22, 28 and 31: section 22 keeps it; the others carry one clause.
  - The path choice, in the endings of sections 24, 25 and 26 and all of 28: section 28 owns the choice across families; 24 to 26 end on setup within the family (which health checks to enable, which job API to pin).
  - Section 15's "facts learned the hard way" repeat facts owned elsewhere: TorchTitan's removed Float8 (section 6), FSDP2's per-micro-batch default (section 8), Megatron's distributed optimizer off by default (section 14), Megatron's `--async-save` trap (section 18). Section 15 keeps a one-line index with pointers and owns the facts no other section uses (Accelerate's FSDP1 default against the Trainer's FSDP2, the NeMo repository's pivot, torchtune's status, checkpoint resharding by framework).
  - Mental models: "bytes times frequency decide the link" (section 7) and "frequency matters as much as size" (section 9) are one model; so are "cross the slow link once, fan out on the fast one" (section 8) and node-limited routing (section 12). Section 7 and section 8 own them; 9 and 12 apply them by name.

**11. MINOR.** Sections 1 (A training run is three budgets) and 2 (Getting started).
- *Problem:* Section 1 lists the dive's six questions with the sections that answer each; section 2 lists six stages with section numbers. Two maps of one dive, back to back.
- *Fix:* Section 1 keeps the six questions without section numbers; section 2 owns the map and the routes.

**12. MINOR.** Section 4 and the Calculators list (Calculator A).
- *Problem:* Calculator A outputs "6ND plus attention" with no sequence-length input, and the attention term depends on it (01 W6). It does not show the section's strongest number, a real run taking 1.1 to 1.3 times the 6ND estimate, beside its result. MFU is defined against the dense peak at the training precision, but precision is not an input.
- *Fix:* Add sequence length, with the causal or no-discount choice (01 W6). Show the 1.1 to 1.3 times band as the output range. Fix precision to BF16 with a note that no first-party MFU at other precisions was located in this research (U01-5), or add precision with that caveat.

**13. MINOR.** Section 18 and the Calculators list (Calculator D).
- *Problem:* The two input lists disagree. Section 18 names save mode and restart time; the Calculators list names step time and save time and drops restart time, although section 18 says restart time dominates at 16K GPUs. "Aggregate write bandwidth is bytes over blocking time" cannot hold for an asynchronous save: a 2 s blocking save of the 988 GB checkpoint would ask about 494 GB/s of storage, against 16.5 GB/s for the 60 s synchronous case [derived in this review]. Under an asynchronous save the storage drains host memory within the interval [our reading].
- *Fix:* One input list: checkpoint bytes (from Calculator B's optimizer row), node count, failure-rate preset, step time, save mode, blocking time, restart time. Storage target: bytes over blocking time for a synchronous save; bytes over a drain budget no longer than the interval for an asynchronous one.

**14. MINOR.** Section 22 (Capacity and cost), the second worked bill.
- *Problem:* It prices Llama 3.1 70B's published 7.0M H100-hours ($48.2M On-Demand; 142 days at the 2,048-GPU ceiling) as a reference bill. Register 01 W7 shows those hours imply 25.5% utilisation, and the model card does not say what they include (U01-3). Calculator A's estimate for the same 15T tokens is 4.46M H100-hours at 40% MFU (01 W8). The page would show two incompatible bills for one model with nothing reconciling them.
- *Fix:* Price Calculator A's estimate, with the 1.1 to 1.3 times band, as the reference bill. Quote the 7.0M published hours only with U01-3's hedge text ("Meta does not split the GPU-hours by stage").

**15. MINOR.** Sections 4, 10, 17, 19 and 21: evidence stacks.
- *Problem:* The brief asks for "enough for why it works, not a research survey". Several sections stack published evidence past what their model needs: section 4's published-MFU list (PaLM, MegaScale, Llama 3, DeepSeek-V3), section 10's schedule catalogue (Zero Bubble, DualPipe, Llama 3's changes), section 17's five operator reports, section 19's four straggler studies, and section 21's documentation contradictions C05-2 to C05-4 (Blackwell HBM by page, Trainium3 NeuronLink values, the UltraServers preview label), of which only C05-1 (512 GiB against 96 GiB per Trainium2) changes a calculator input.
- *Fix:* One anchor figure in prose per claim; the rest in an ExpandableSection (shape rule 7). C05-2 to C05-4 move to the disclosure.

**16. MINOR.** Payoff lines and endings.
- *Problem:* Section 26's payoff spends its second clause on the topic ("know which SageMaker libraries are current"). Section 11's names the variants rather than the reader's moment. Sections 3 and 7 end on the model and its diagram without the one line that says what the reader does with it; section 13 ends on a hand-off (finding 5); section 6 on a table (finding 9).
- *Fix:* Section 26: "Run fine-tuning and medium jobs without keeping a cluster, and start from the SDK and libraries AWS still releases." Section 11: "Split one long sequence across GPUs when its activations no longer fit, and pick ring, all-gather or all-to-all by your attention layout." Section 3 adds that B = b x m x d is the identity Calculator C solves; section 7 adds that a measured nccl-tests bus bandwidth is read against these peaks, which section 31 does.

**17. MINOR.** Section 31 (Bring-up).
- *Problem:* Two rungs the dive already supplies are missing. The layout bake-off, the procedure's step 12 (run the two or three surviving layouts for a few hundred steps and pick by measured throughput, T02-54, T02-58), is where "set my ranks" ends, and the ladder has no place for it. The version pin, the EFA dive's `NcclOverEfa` ("Three versions and the instance type have to agree"), is not a rung either.
- *Fix:* Add the bake-off between rungs 4 and 5, and the version pin before rung 3, as links. This is a reorder of existing material.

**18. MINOR.** Section 32 (Glossary and sources).
- *Problem:* The list includes acronyms no section text uses by acronym (SwiGLU, RMSNorm, ETP, EDP, ODCR, DLC, HMA, GDS, NxDT, AMP and AMG, TE) and omits ones it does use (SMP and SMDDP in section 26, KV in section 9, RNG in section 18). ETP and EDP become used if finding 1's fix lands.
- *Fix:* Correct the list now and regenerate it from first use at build, as the scope already says.

**19. MINOR.** "Depth distribution" and date-bound status lines.
- *Problem:* The note says "the four places where the dive's numbers come from" and lists five sections (4, 5, 8, 10, 18); after finding 5 the plan has 31 sections. Section 24's "25.05 reaches PCS end of life on 2026-11-30" will be past before the build.
- *Fix:* Correct the count. Section 24 carries the model ("a yearly Slurm major upgrade") and re-reads the date at build.

---

## Backlog, not fixes

1. **Activation memory for MoE and MLA layers**, with DeepSeek-V3's MLA projection sizes, dense FFN width, vocabulary, sequence length and batch, so Calculator C can memory-check an MoE preset (finding 1). The Megatron-Core MoE guide's memory table (T02-53) is the place to start.
2. **A smaller MoE preset with published shapes** that fits 16 to 32 instances, such as Mixtral 8x7B or 8x22B; the registers hold only 8x22B's MFU (T02-41).
3. **Uneven pipeline stages**: which frameworks support them, under which settings, and how DeepSeek-V3 split 61 layers across 16 stages (finding 2).
4. **Partial recomputation by layer count** as a Calculator B mode. Case (a) shows the use: FSDP 32 on H200 leaves room for about 40 of 80 layers' activations [derived in this review], so a partial setting would sit between the 180 GB and 13 GB rows. Megatron's setting was not read.
5. **Fine-tuning global batch sizes** from first-party recipes (for example the HyperPod recipes at 2.0.11), so Calculator C has a fine-tuning default.
6. **Diagnosing a low-MFU run with a profiler** (Holistic Trace Analysis, Nsight Systems): already queued as U07-5 and U07-6.
7. **An agent-callable interface for the procedure**: input and output schema and unit conventions, for the brief's "a reader or an agent".
8. **Handing the trained checkpoint to serving**: export to Hugging Face safetensors and loading in vLLM and SGLang, linking those dives.
9. **AWS Batch on EKS health handling and EFA for multi-node parallel jobs** (U06-7, wave 2).
10. **For the EFA dive's next iteration**: slim `AIMLTraining`'s parallelism block to a pointer to this dive's sections 7 to 14.

---

## Verdict

**PASS WITH FIXES.** 1 BLOCKER, 7 MAJOR, 11 MINOR. Mean section score 7.9; lowest are section 13 (Composing the dimensions, 6), then sections 1, 2, 6, 11, 12, 16, 21, 23, 26 and 32 at 7. The plan covers all six goal items, and "set my ranks" is answerable for dense models on GPUs: case (a) reaches TP 8 x DP 4 with ZeRO-1 on four p5en and shows why flat FSDP and HSDP inside one instance fail. It is not answerable for mixture-of-experts models, which the plan promises. Finding 1 must be resolved before Gate 1, and resolving it needs no new research: rescope Calculator C's MoE support to model state on the two grids and expert-parallel bytes, with activation memory labelled unmodelled. Findings 2 to 4 are what make the dense answer trustworthy in the calculator: uneven pipeline stages, a step-time ranking, and the missing Calculator B inputs.
