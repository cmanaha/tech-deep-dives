# Gate 3: section scores

Gate 3 passes when no section scores below 7/10 and the average is at least 8/10. Scores below are
the adversarial fact checks' scores after their corrections (findings in `reviews/factcheck/`).
The leverage pass re-scores on its own five axes (`reviews/leverage/`); its outcome is appended
below when it completes.

| # | Section | File | Fact-check group | Score |
|---|---|---|---|---|
| 1 | Thesis & Framing | ThesisAndFraming.tsx | fc01 | 8 |
| 2 | Getting Started | GettingStarted.tsx | fc01 | 8 |
| 3 | The SGLang Runtime | RuntimeProcesses.tsx | fc01 | 8 |
| 4 | The Scheduler | Scheduler.tsx | fc02 | 8 |
| 5 | RadixAttention & the Radix Cache | RadixCache.tsx | fc02 | 8 |
| 6 | KV Memory & the Defaults Your GPU Picks | KvMemory.tsx | fc03 | 8 |
| 7 | HiCache | HiCache.tsx | fc03 | 8 |
| 8 | Attention Backends & Kernels | AttentionBackends.tsx | fc04 | 8 |
| 9 | Quantization & KV Precision | Quantization.tsx | fc04 | 8 |
| 10 | Structured Output | StructuredOutput.tsx | fc05 | 8 |
| 11 | Speculative Decoding | SpeculativeDecoding.tsx | fc05 | 8 |
| 12 | Talking to SGLang: APIs, LoRA & the Admin Plane | ApiSurfaces.tsx | fc06 | 8 |
| 13 | SGLang as an RL Rollout Engine | RlRollout.tsx | fc06 | 8 |
| 14 | Parallelism | Parallelism.tsx | fc07 | 9 |
| 15 | PD Disaggregation | PdDisaggregation.tsx | fc07 | 9 |
| 16 | Wide Expert Parallelism | WideExpertParallelism.tsx | fc08 | 8 |
| 17 | The Model Gateway | ModelGateway.tsx | fc08 | 8 |
| 18 | Multi-Node & Kubernetes Orchestrators | MultiNodeKubernetes.tsx | fc09 | 8 |
| 19 | SGLang on SageMaker AI & HyperPod | AwsManagedPaths.tsx | fc09 | 8 |
| 20 | SGLang on EKS & EC2 | AwsSelfManagedPaths.tsx | fc10 | 9 |
| 21 | EC2 Instances, Images & GPU-Dependent Behaviour | Ec2Instances.tsx | fc10 | 8 |
| 22 | PD & Wide EP over EFA | PdWideEpOverEfa.tsx | fc11 | 9 |
| 23 | SGLang & vLLM Compared | SglangVsVllm.tsx | fc12 | 8 |
| 24 | Ecosystem & Production Users | EcosystemUsers.tsx | fc11 | 8 |
| 25 | Operations & Failure Signatures | Operations.tsx | fc13 | 8 |
| 26 | Decision Guide | DecisionGuide.tsx | fc13 | 8 |
| 27 | Inside the Codebase (shell 9; tabs 8, 8, 8, 9, 9, 9) | InsideCodebase.tsx, codebase/*.tsx | fc14, fc15 | 8.5 |

Section 28 (Glossary & Sources) is generated reference material owned by the orchestrator and is
not scored.

Minimum 8 (no section below 7). Average over sections 1 to 27: (22 x 8 + 4 x 9 + 8.5) / 27 = 8.17.
**Gate 3 passes on the fact-check scores.**

Recurring hold-down reasons given by the checkers: length (sections 5, 8, 9, 23), dense citation
tables (23), and a numbers grid that crowds the comparison (21). These are the leverage pass's
main targets.

## Leverage pass outcome (2026-10-24)

The leverage pass (`revamp/leverage-prompts.md`, standard in `deep-dives/efa/revamp/leverage-pass-standard.md`)
scored each section 1 to 5 on mental model / practical leverage / rigor / accuracy / economy, before
and after. Accuracy held at 5 in every file, rigor held at 5, and no section lost a point on any axis.
Every new assertion is listed with its on-page source in `reviews/leverage/lv01.md` to `lv07.md`.

| # | Section | Before | After |
|---|---|---|---|
| 1 | Thesis & Framing | 4/3/5/5/3 | 5/3/5/5/3 |
| 2 | Getting Started | 4/4/5/5/3 | 4/4/5/5/4 |
| 3 | The SGLang Runtime | 4/4/5/5/3 | 4/4/5/5/4 |
| 4 | The Scheduler | 5/4/5/5/4 | 5/5/5/5/4 |
| 5 | RadixAttention & the Radix Cache | 5/4/5/5/3 | 5/4/5/5/4 |
| 6 | KV Memory | 4/5/5/5/3 | 4/5/5/5/3 |
| 7 | HiCache | 5/4/5/5/3 | 5/5/5/5/3 |
| 8 | Attention Backends | 4/4/5/5/3 | 4/4/5/5/4 |
| 9 | Quantization | 4/4/5/5/3 | 4/5/5/5/4 |
| 10 | Structured Output | 5/4/5/5/4 | 5/5/5/5/4 |
| 11 | Speculative Decoding | 5/4/5/5/3 | 5/5/5/5/4 |
| 12 | Talking to SGLang | 4/4/5/5/3 | 4/5/5/5/3 |
| 13 | RL Rollout | 4/4/5/5/3 | 4/5/5/5/4 |
| 14 | Parallelism | 5/4/5/5/4 | 5/4/5/5/4 |
| 15 | PD Disaggregation | 5/4/5/5/4 | 5/4/5/5/4 |
| 16 | Wide Expert Parallelism | 5/4/5/5/3 | 5/4/5/5/4 |
| 17 | The Model Gateway | 5/4/5/5/3 | 5/5/5/5/4 |
| 18 | Multi-Node & Kubernetes | 5/4/5/5/3 | 5/5/5/5/4 |
| 19 | SageMaker AI & HyperPod | 4/4/5/5/3 | 4/5/5/5/4 |
| 20 | EKS & EC2 | 4/5/5/5/4 | 4/5/5/5/4 |
| 21 | EC2 Instances | 4/4/5/5/3 | 4/4/5/5/4 |
| 22 | PD & Wide EP over EFA | 5/5/5/5/4 | 5/5/5/5/4 |
| 23 | SGLang & vLLM Compared | 4/4/5/5/3 | 4/5/5/5/4 |
| 24 | Ecosystem & Production Users | 4/4/5/5/4 | 4/4/5/5/4 |
| 25 | Operations | 4/4/5/5/3 | 4/5/5/5/4 |
| 26 | Decision Guide | 4/4/5/5/3 | 4/5/5/5/3 |
| 27 | Inside the Codebase (shell; six tabs) | 4/4/5/5/5; 5/4/5/5/4 each | unchanged |

Practical leverage rose in 13 sections and economy in 14. The fact-check Gate 3 scores above stand:
the pass changed order, demotion and wording only, under the same accuracy floor.
