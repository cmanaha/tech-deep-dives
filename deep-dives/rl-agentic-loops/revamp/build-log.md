# Build log (orchestrator)

Per-section author reports, for the glossary, the fact check and the final report.

| Section | File | Cites | Diagrams (harness 1440/390) | Acronyms expanded | Open items for fact check |
| --- | --- | --- | --- | --- | --- |
| 3 Policy | LanguageModelAsPolicy.tsx | 43 | 1, 0 overlap/clip | RL, GRPO, EOS, PPO, TRL, KL, RLOO, GAE | Strongest number from E0 (one 0/1 reward per 124-164-token completion); Sutton and Barto 2.9 and TRL v1.12.0 ppo_trainer L786-L798, ppo_config L264-L267 checked beyond register |
| 4 Policy gradient | PolicyGradient.tsx | 43 | 2 (baseline weights chart, illustrative; gradient table), 0 overlap/clip | RL, SFT, PPO, GRPO, RLOO, GAE, RLHF, DPO, KL, HH; GSM8K, MATH glossed | Added DeepSeekMath 1.3B comparison (F01-71) in an expandable beyond the block; 'critic' worded per Sutton and Barto. Found generator regex bug (fixed) |
| 5 Two leashes | TwoLeashes.tsx | 42 | 2 (two-leash SVG; E0 entropy chart), 0 overlap/clip (both scroll at 390, min 640) | RL, PPO, KL, TRL, GRPO, RLHF, TRPO, SFT, RLOO, LoRA, GAE, DPO, RFT | Beyond block, sourced: clip acts only when one batch feeds more than one update (DeepSeekMath A.1.5, TRL num_iterations, E0 clip_ratio/region_mean 0.0); LoRA with beta above 0 loads no second copy (TRL code); TRL RLOO beta default 0.05 |
