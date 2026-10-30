# Gate 3: section scores

Gate 3 passes when no section scores below 7/10 and the average is at least 8/10. Scores are the
adversarial fact checks' scores after their corrections (findings in `reviews/factcheck/`). The
leverage pass re-scores on its own five axes (`reviews/leverage/`); its outcome is appended when it
completes. Section 24 (Glossary & Sources) is reference material owned by the orchestrator and is not
scored.

| # | Section | File | Fact-check group | Score |
|---|---|---|---|---|
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
