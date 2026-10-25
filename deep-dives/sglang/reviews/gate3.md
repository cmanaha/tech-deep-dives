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
