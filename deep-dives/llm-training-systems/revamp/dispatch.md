# Authoring dispatch plan (orchestrator)

Rolling dispatch, at most three agents at a time, one section file per agent. Every agent gets the
authoring brief (`revamp/authoring-brief.md`), the privacy rule, and its row below. The calculator
library comes first so sections 4, 5, 14, 18 and 22 build on tested functions. Sections 1 and 2 are
written last, after the body exists. Status is updated as each report lands (see `build-log.md`).

| # | h1 text | File | id | port | slug | Notes for the agent | Status |
|---|---|---|---|---|---|---|---|
| lib | (no section) | src/lib/{presets,runtime,memory,parallelism,checkpoint}.ts + src/__tests__/*.test.ts | | | | `revamp/calculators-spec.md` | |
| 3 | 3. One Training Step: What It Computes and Keeps | TrainingStep.tsx | step | 4603 | step | E1's 34 sbh; notation block | |
| 7 | 7. Collectives & What They Cost | Collectives.tsx | collectives | 4607 | coll | W2-3 launcher rank order; A1 protocol (not yet run) | |
| 4 | 4. Counting the Arithmetic: 6ND, MFU & Run Time | Arithmetic.tsx | arithmetic | 4604 | arith | Calculator A UI; E2 denominator lesson; U01-5 NVIDIA FP8 vendor figures | |
| 5 | 5. The Memory Budget | MemoryBudget.tsx | memory | 4605 | mem | Calculator B UI; E1 (34 vs 41 sbh, logits peak), E2 recompute price | |
| 6 | 6. Precision for Training: BF16, FP8 & Microscaled Formats | Precision.tsx | precision | 4606 | prec | U01-7 OCP MX spec closed; W1-39 to W1-45 | |
| 8 | 8. Data Parallelism & Sharding: DDP, ZeRO, FSDP & HSDP | DataParallel.tsx | data-parallel | 4608 | dp | E3 counts; W2-1, W2-12, W2-14; A2 protocol (not yet run) | |
| 9 | 9. Tensor & Sequence Parallelism | TensorParallel.tsx | tensor-parallel | 4609 | tp | W2-17 MFU assumption next to 13.3 ms | |
| 10 | 10. Pipeline Parallelism & the Bubble | PipelineParallel.tsx | pipeline | 4610 | pp | interactive schedule chart with m slider; W2-5, W2-26 uneven stages | |
| 11 | 11. Long Sequences: Context Parallelism | ContextParallel.tsx | context-parallel | 4611 | cp | W2-2 Ulysses KV-head bound | |
| 12 | 12. Mixture of Experts: Expert Parallelism | ExpertParallel.tsx | expert-parallel | 4612 | ep | MoE activations "not modelled; measure a step" | |
| 13 | 13. Composing the Dimensions | ComposingLayouts.tsx | composing | 4613 | mesh | W2-4 WRONG fixed: PP outermost in Megatron, TorchTitan, DeepSpeed; DP outermost in Llama 3 | |
| 14 | 14. Set My Ranks: The Sizing Procedure | SetMyRanks.tsx | set-my-ranks | 4614 | ranks | Calculator C UI; G7 second example; W2-44, W2-55, W2-56 | |
| 15 | 15. The Framework Map | FrameworkMap.tsx | frameworks | 4615 | fw | W3 maturity labels; U03-3, U03-6 closed | |
| 16 | 16. Fine-Tuning & Post-Training Runs | FineTuning.tsx | fine-tuning | 4616 | ft | Calculator B frozen-base rows; W3-21 GB vs GiB | |
| 17 | 17. Failure Is the Steady State | FailureRates.tsx | failures | 4617 | fail | wave2-reliability verdicts; U04-1 | |
| 18 | 18. Checkpointing | Checkpointing.tsx | checkpointing | 4618 | ckpt | Calculator D UI; E4 results; U04-4, U04-7, U04-8; A3 protocol (not yet run) | |
| 19 | 19. Resuming Correctly | Resuming.tsx | resuming | 4619 | resume | U04-5 NCCL determinism | |
| 20 | 20. Who Owns What on AWS | AwsOwnership.tsx | aws-ownership | 4620 | own | ownership matrix | |
| 21 | 21. Training Hardware on AWS | AwsHardware.tsx | aws-hardware | 4621 | hw | 05 section 3.1 table; C05-1 | |
| 22 | 22. Capacity & Cost | CapacityCost.tsx | capacity-cost | 4622 | cost | Calculator A cost panel; A0 protocol (not yet run); U05-3, U05-4 | |
| 23 | 23. Storage for Training | Storage.tsx | storage | 4623 | stor | A3 protocol (not yet run) | |
| 24 | 24. The Slurm Family | SlurmFamily.tsx | slurm | 4624 | slurm | U06-1, U06-10 | |
| 25 | 25. The Kubernetes Family | KubernetesFamily.tsx | kubernetes | 4625 | k8s | A4 protocol (not yet run); U06-11 | |
| 26 | 26. SageMaker Training Jobs | TrainingJobs.tsx | training-jobs | 4626 | jobs | U06-3, U06-4, U06-8 | |
| 27 | 27. Trainium: The Neuron Path | Trainium.tsx | trainium | 4627 | trn | W3-29, W3-42 fixed; A5 protocol (not yet run) | |
| 28 | 28. Choosing Your Path | ChoosingPath.tsx | choosing | 4628 | choose | decision tree | |
| 29 | 29. What to Measure in a Run | WhatToMeasure.tsx | measure | 4629 | meas | 07 W1 tokens per second | |
| 30 | 30. The Telemetry Stack on AWS | Telemetry.tsx | telemetry | 4630 | tel | E3 flight-recorder coverage; U07-3, U07-5, U07-6, U07-8 | |
| 31 | 31. Bring-Up: From One Node to the Full Run | BringUp.tsx | bring-up | 4631 | bring | U07-4; A1 protocol pointer; NCCL and EFA versions per path (wave2-aws) | |
| 1 | 1. A Training Run Is Three Budgets | ThreeBudgets.tsx | three-budgets | 4601 | budgets | written after the body | |
| 2 | 2. Getting Started | GettingStarted.tsx | getting-started | 4602 | gs | reading map, four routes | |
| 32 | 32. Glossary & Sources | GlossaryAndSources.tsx | sources | | | orchestrator | |
