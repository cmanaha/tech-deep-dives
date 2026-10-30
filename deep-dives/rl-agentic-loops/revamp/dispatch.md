# Authoring dispatch plan (orchestrator)

Rolling dispatch, at most three authoring agents at a time, one section file per agent. Every
agent gets the authoring brief, the privacy rule, and the row below. Status is updated as each
report lands (see `build-log.md`).

| # | h1 text | File | id | port | slug | Notes for the agent | Status |
|---|---|---|---|---|---|---|---|
| 3 | 3. The Language Model Is Already a Policy | LanguageModelAsPolicy.tsx | policy | 4503 | policy | TRL PPO at v1.12.0 (`TRL_PPO_TAG`) | done c6c80f3 |
| 4 | 4. Policy Gradient | PolicyGradient.tsx | policy-gradient | 4504 | pg | gradient table rows 1 to 4 | done 2d1d25d |
| 5 | 5. Two Leashes: PPO's Clip & the KL | TwoLeashes.tsx | leashes | 4505 | leash | PPO row; E0 entropy optional | done |
| 6 | 6. From Preferences to Rewards | PreferencesToRewards.tsx | preferences | 4506 | pref | DPO row completes the table; Llama 3 DPO-over-PPO (wave2-foundations G3); relatives per W1 row 29 | done |
| 7 | 7. RLVR & GRPO | RlvrAndGrpo.tsx | rlvr | 4507 | rlvr | successor table; E0 zero-gradient steps as Tier 0 point | done |
| 8 | 8. What RL Does to a Model | WhatRlDoes.tsx | what-rl-does | 4508 | wrd | schematic pass@k curves; sparsity debate per W2 rows 30-31; RL's Razor ICLR 2026 | done |
| 9 | 9. Agentic RL | AgenticRl.tsx | agentic-rl | 4509 | agentic | DeepSWE 23% to 42.2%, 71.0% pass@16 vendor claim; F02-62 scope | done |
| 10 | 10. The Reward Is a Proxy | RewardIsAProxy.tsx | reward-proxy | 4510 | proxy | grader checklist owned here; U18 hedge | done |
| 11 | 11. A Text Loop Is RL on the Context | TextLoopAsRl.tsx | text-loop | 4511 | textloop | three stores x two signals grid; signal axis gloss per W3 row 35 | done |
| 12 | 12. Verbal Reinforcement & Self-Correction | VerbalReinforcement.tsx | verbal | 4512 | verbal | SCoRe (U8) as weight-side counterpart | done |
| 13 | 13. Memories, Playbooks & Skill Libraries | AccumulatingExperience.tsx | experience | 4513 | exp | ReTool includes SFT stage (W3 row 11); Anthropic wording (row 30) | done |
| 14 | 14. Optimising the Prompt | PromptOptimization.tsx | prompt-opt | 4514 | popt | MIPRO expansion; Pareto set on validation; reflector = Qwen3 8B (U5) | dispatched |
| 15 | 15. Your Loops Through the RL Lens | YourLoops.tsx | your-loops | 4515 | loops | autoresearch at SHA; wall-clock stop; FunSearch 10^6 | dispatched |
| 16 | 16. Hybrids | Hybrids.tsx | hybrids | 4516 | hyb | advisor 70% derived | dispatched |
| 17 | 17. Where Words Fall Short | WhereWordsFallShort.tsx | words-limits | 4517 | wfs | DPT correction (W4 row 23); TRAIL hedge U14 | |
| 18 | 18. What Lives in Weights & What Lives in Context | WeightsVsContext.tsx | weights-context | 4518 | wvc | two-column map, contested rows marked | |
| 19 | 19. An RL Step Is an Inference Job Inside a Training Job | RlStepAsSystem.tsx | rl-systems | 4519 | sys | E0 Tier 0 points per wave2-systems-cost | |
| 20 | 20. Cost per Improvement | CostPerImprovement.tsx (+ src/lib/breakeven.ts, src/__tests__/breakeven.test.ts) | cost | 4520 | cost | interactive calculator; Nova $80 too | |
| 21 | 21. Side by Side on a DGX Spark | SideBySideLab.tsx | lab | 4521 | lab | E0 results; E1 protocol and predictions | |
| 22 | 22. Choosing a Text Loop, a Hybrid or a Weight Update | Choosing.tsx | choosing | 4522 | choose | three questions; paths; SageMaker distillation | |
| 23 | 23. RL & Learning Loops on AWS | RlOnAws.tsx | aws | 4523 | aws | two stacks; AgentCore vendor test; rank-32 LoRA | |
| 1 | 1. One Loop, Three Places to Keep What It Learns | OneLoop.tsx | one-loop | 4501 | oneloop | written last-but-one, after the body exists | |
| 2 | 2. Getting Started | GettingStarted.tsx | getting-started | 4502 | gs | reading map, three routes | |
| 24 | 24. Glossary & Sources | GlossaryAndSources.tsx | sources | | | orchestrator | |
