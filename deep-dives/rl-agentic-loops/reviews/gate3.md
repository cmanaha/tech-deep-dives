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
