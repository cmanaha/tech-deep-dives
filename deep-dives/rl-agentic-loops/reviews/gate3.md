# Gate 3: section scores

Gate 3 passes when no section scores below 7/10 and the average is at least 8/10. Scores are the
adversarial fact checks' scores after their corrections (findings in `reviews/factcheck/`). The
leverage pass re-scores on its own five axes (`reviews/leverage/`); its outcome is appended when it
completes. Section 24 (Glossary & Sources) is reference material owned by the orchestrator and is not
scored.

| # | Section | File | Fact-check group | Score |
|---|---|---|---|---|
| 1 | One Loop, Three Places to Keep What It Learns | OneLoop.tsx | fc01 | 9 |
| 2 | Getting Started | GettingStarted.tsx | fc01 | 8 |
| 3 | The Language Model Is Already a Policy | LanguageModelAsPolicy.tsx | fc01 | 9 |
| 4 | Policy Gradient | PolicyGradient.tsx | fc02 | 9 |
| 5 | Two Leashes: PPO's Clip & the KL | TwoLeashes.tsx | fc02 | 9 |
| 6 | From Preferences to Rewards | PreferencesToRewards.tsx | fc02 | 8 |
| 7 | RLVR & GRPO | RlvrAndGrpo.tsx | fc03 | 8 |
| 8 | What RL Does to a Model | WhatRlDoes.tsx | fc03 | 8 |
| 9 | Agentic RL | AgenticRl.tsx | fc04 | 9 |
| 10 | The Reward Is a Proxy | RewardIsAProxy.tsx | fc04 | 9 |
| 11 | A Text Loop Is RL on the Context | TextLoopAsRl.tsx | fc05 | 9 |
| 12 | Verbal Reinforcement & Self-Correction | VerbalReinforcement.tsx | fc05 | 9 |
| 13 | Memories, Playbooks & Skill Libraries | AccumulatingExperience.tsx | fc05 | 9 |
| 17 | Where Words Fall Short | WhereWordsFallShort.tsx | fc07 | 9 |
| 18 | What Lives in Weights & What Lives in Context | WeightsVsContext.tsx | fc07 | 9 |
| 14 | Optimising the Prompt | PromptOptimization.tsx | fc06 | 9 |
| 15 | Your Loops Through the RL Lens | YourLoops.tsx | fc06 | 9 |
| 16 | Hybrids | Hybrids.tsx | fc06 | 9 |
| 19 | An RL Step Is an Inference Job Inside a Training Job | RlStepAsSystem.tsx | fc08 | 9 |
| 20 | Cost per Improvement | CostPerImprovement.tsx | fc08 | 9 |
| 21 | Side by Side on a DGX Spark | SideBySideLab.tsx | fc09 | 9 |
| 22 | Choosing a Text Loop, a Hybrid or a Weight Update | Choosing.tsx | fc09 | 9 |
| 23 | RL & Learning Loops on AWS | RlOnAws.tsx | fc09 | 9 |

## Result on the fact-check scores

23 scored sections, lowest 8 (sections 2, 6, 7 and 8), sum 203, average 8.83. Gate 3 passes: no
section below 7/10 and the average is at least 8/10. Every fact-check correction is applied and
committed (fc01 to fc09); the venue badges they settled are applied across all sections and the
glossary (one deliberate exception: section 7 cites DeepSeek-R1 v1 as the preprint it was, beside the
Nature 2025 version).

## Leverage pass

Five axes, one to five each: mental model, practical leverage, rigor, accuracy, economy. Accuracy must
stay at 5. Before and after, per section; moves and claim diffs in `reviews/leverage/<group>.md`.

| # | Section | Group | Before | After |
|---|---|---|---|---|
| 5 | Two Leashes: PPO's Clip & the KL | lv02 | 4/4/5/5/4 | 5/4/5/5/5 |
| 6 | From Preferences to Rewards | lv02 | 4/4/5/5/3 | 5/4/5/5/4 |
| 7 | RLVR & GRPO | lv02 | 4/5/5/5/3 | 4/5/5/5/3 |
| 8 | What RL Does to a Model | lv02 | 4/4/5/5/3 | 5/4/5/5/4 |
| 9 | Agentic RL | lv03 | 4/4/5/5/4 | 4/5/5/5/4 |
| 10 | The Reward Is a Proxy | lv03 | 5/4/5/5/3 | 5/5/5/5/4 |
| 11 | A Text Loop Is RL on the Context | lv03 | 5/3/5/5/3 | 5/3/5/5/4 |
| 12 | Verbal Reinforcement & Self-Correction | lv03 | 5/4/5/5/4 | 5/4/5/5/5 |
| 13 | Memories, Playbooks & Skill Libraries | lv04 | 5/4/5/5/4 | 5/4/5/5/5 |
| 14 | Optimising the Prompt | lv04 | 4/5/5/5/3 | 5/5/5/5/4 |
| 15 | Your Loops Through the RL Lens | lv04 | 5/5/5/5/4 | 5/5/5/5/4 |
| 16 | Hybrids | lv04 | 4/4/5/5/3 | 5/4/5/5/4 |
| 17 | Where Words Fall Short | lv05 | 4/4/5/5/4 | 5/4/5/5/4 |
| 18 | What Lives in Weights & What Lives in Context | lv05 | 4/4/5/5/4 | 5/4/5/5/4 |
| 19 | An RL Step Is an Inference Job Inside a Training Job | lv05 | 5/5/5/5/3 | 5/5/5/5/4 |
| 20 | Cost per Improvement | lv05 | 5/5/5/5/3 | 5/5/5/5/4 |
| 21 | Side by Side on a DGX Spark | lv06 | 4/5/5/5/4 | 4/5/5/5/4 |
| 22 | Choosing a Text Loop, a Hybrid or a Weight Update | lv06 | 4/4/5/5/3 | 5/4/5/5/4 |
| 23 | RL & Learning Loops on AWS | lv06 | 4/4/5/5/3 | 4/4/5/5/4 |
| 1 | One Loop, Three Places to Keep What It Learns | lv01 | 5/4/5/5/4 | 5/4/5/5/5 |
| 2 | Getting Started | lv01 | 4/4/5/5/4 | 4/4/5/5/5 |
| 3 | The Language Model Is Already a Policy | lv01 | 5/4/5/5/4 | 5/5/5/5/4 |
| 4 | Policy Gradient | lv01 | 5/4/5/5/4 | 5/4/5/5/5 |
