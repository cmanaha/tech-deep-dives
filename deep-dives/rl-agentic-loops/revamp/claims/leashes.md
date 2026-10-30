# Claims: section 5, Two Leashes: PPO's Clip & the KL (`TwoLeashes.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
TRL lines were re-read at tag v1.16.0 (SHA 1b5c75ed94b7387f42532adb090c935166d4878d) on 2026-10-30;
DeepSeekMath v3 PDF, the Gao et al. abstract and the Bedrock monitoring page were re-fetched the same day.
E0 links point at dive commit bcf5a9edc0c77ee9c26c76ce73d98ab037903f67 (files unchanged at HEAD).

## Intro and stale samples

- PPO's ratio leash is to the policy that sampled the batch (moves every iteration); the KL leash is to the fixed starting model | https://arxiv.org/abs/2210.10760v1 (Sec. 3.6) | F01-28; wave2-foundations row 17
- TRL GRPO ships `epsilon` 0.2 and `beta` 0.0 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L681-L696 | F01-39, F02-29; wave2-foundations row 21; re-read 2026-10-30
- On our 0.5B DGX Spark run, generation took about 62% of step time | https://github.com/cmanaha/tech-deep-dives/blob/bcf5a9edc0c77ee9c26c76ce73d98ab037903f67/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md | E0 (Tier 0), "Where the step time goes" (62.0% and 62.9%)
- Many optimisation steps on the plain PG loss with one batch "often leads to destructively large policy updates" | https://arxiv.org/abs/1707.06347v2 (Sec. 2.1) | F01-25; wave2-foundations row 14
- TRPO: maximise subject to a KL constraint between new and old policy (trust region) | https://arxiv.org/abs/1502.05477v5 (Sec. 4) | F01-26; wave2-foundations row 14
- PPO replaces the hard constraint with a clipped probability ratio in the loss | https://arxiv.org/abs/1707.06347v2 (Sec. 3) | F01-27; wave2-foundations row 15

## Two leashes (diagram and following paragraph)

- The clip controls how fast the policy changes, which in a well-tuned implementation makes KL to the initial policy grow much more slowly | https://arxiv.org/abs/2210.10760v1 (Sec. 3.6, "providing the implementation is well-tuned") | F01-28; wave2-foundations row 17 (fc02 restored the hedge 2026-10-30)
- Diagram numbers: epsilon 0.2 (PPO paper, TRL), beta 0.02 (InstructGPT), beta 0 in TRL GRPO, no reference model at beta 0, clip works only with 2+ updates per batch | as cited in the clip and KL rows below | F01-27, F01-37, F01-39; DSM24 A.1.5; TRL code
- KL acts on the reward in PPO and on the loss in GRPO | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1, Eq. 2 and the GRPO objective paragraph) | DSM24 re-read 2026-10-30 (F01-38 evidence quotes the same sentence)

## The clip

- ratio = pi_new / pi_old; objective min(ratio*A, clip(ratio, 1-eps, 1+eps)*A); eps = 0.2 | https://arxiv.org/abs/1707.06347v2 (Sec. 3, Eq. 6-7) | F01-27; wave2-foundations row 15
- Past 1.2 (positive A) or below 0.8 (negative A) the gradient no longer pushes; ratio can still move; one-sided (ignore only when it improves the objective) | https://arxiv.org/abs/1707.06347v2 (Sec. 3) | F01-27; wave2-foundations row 15
- Ablation: 7 MuJoCo robotics tasks, 1M timesteps, 3 seeds; eps 0.2 = 0.82, 0.1 = 0.76, 0.3 = 0.70, no clipping or penalty = -0.39 | https://arxiv.org/abs/1707.06347v2 (Sec. 6.1, Table 1) | F01-29; wave2-foundations row 16
- TRL GRPO default epsilon 0.2 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L693-L696 | re-read 2026-10-30; E0 config table
- In one RLHF study (Pythia-6.9B, Llama-7B) loss clipped on average under 5% per batch; removing the clip gave, if anything, a slight boost | https://arxiv.org/abs/2402.14740v2 (Sec. 3.2) | F01-31; wave2-foundations row 18
- With a single update per exploration stage, pi_old = pi_theta, the min and clip drop out | https://arxiv.org/abs/2402.03300v3 (App. A.1.5, Eq. 15-16) | DSM24 re-read 2026-10-30 (new to this block; same paper as F01-70)
- TRL `num_iterations` default 1 (the mu of the algorithm) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L689-L692 | re-read 2026-10-30
- With the defaults, the "old" log-probabilities come from the same weights being updated (our reading) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2634-L2655 ; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L3060-L3066 | code read 2026-10-30, kind=code
- E0: `clip_ratio/region_mean` 0.0 at every step of both runs | https://github.com/cmanaha/tech-deep-dives/blob/bcf5a9edc0c77ee9c26c76ce73d98ab037903f67/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/logs.jsonl ; .../run2/logs.jsonl | E0 (Tier 0) raw logs, read 2026-10-30
- Epsilon matters with `num_iterations` above 1 or `steps_per_generation` above `gradient_accumulation_steps` (our reading) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L528-L531 ; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2634-L2644 | code read 2026-10-30, kind=code
- (Expandable) TRL counts low-side clip (ratio below 1-eps, A below 0), high-side (above 1+eps, A above 0) and their union `clip_ratio/region_mean` | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L3272-L3279 | code read 2026-10-30, kind=code
- (Expandable) `sampling/importance_sampling_ratio` reached 2.80 and 2.86; it corrects vLLM vs trainer probability mismatch on the same weights | E0 log md (as above), "What the logs show" | E0 (Tier 0); wave2-systems-cost row 13

## The KL penalty

- InstructGPT objective: reward minus beta times per-token log-ratio to the SFT model, plus optional pretraining term; beta 0.02 | https://arxiv.org/abs/2203.02155v1 (Sec. 3.5, Eq. 2; App. C.4) | F01-37; wave2-foundations row 17
- Penalty in the reward at every token to mitigate over-optimisation of the reward model (an imperfect proxy) | https://arxiv.org/abs/2203.02155v1 (Sec. 3.5); https://arxiv.org/abs/2210.10760v1 (abstract) | F01-37; Gao abstract re-read 2026-10-30
- GRPO adds the KL to the loss instead of the reward | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1) | DSM24 re-read 2026-10-30 (quoted in F01-38)
- 1.3B ablation: KL coefficient 100x (2.0) did not fix SQuADv2 and DROP regressions and cut validation reward; pretraining mix (coefficient 20 or more) fixed them; at full scale the mix reduced without removing them (PPO-ptx still lags GPT-3 on DROP, SQuADv2, translation) | https://arxiv.org/abs/2203.02155v1 (App. E.6, Fig. 33-34; Sec. 4.2; Sec. 5.4) | F01-40; wave2-foundations row 19 (SCOPE NARROWER applied; fc02 2026-10-30: Sec. 5.3 carries no regression text, the "does not completely mitigate" sentence is Sec. 5.4; "at full scale" narrowed to "in the main results")
- Synthetic study (fixed 6B gold RM standing in for humans, labels train a proxy RM): KL penalty acted like early stopping; gold score converged earlier; frontier unchanged; authors flag hyperparameter sensitivity | https://arxiv.org/abs/2210.10760v1 (abstract, Sec. 1, Sec. 3.6) | F01-41; wave2-foundations row 20 (SCOPE NARROWER applied)
- TRL GRPO (v1.16.0) beta default 0; at 0 the reference model is not loaded | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L681-L688 ; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L983-L986 | F01-39, F02-29; wave2-foundations row 21 (tag applied)
- TRL RLOO beta default 0.05 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/rloo_config.py#L502-L508 | F01-39; re-read 2026-10-30
- With an adapter (PEFT model, e.g. LoRA) TRL disables the adapter to recover the initial model, so beta above 0 loads no second copy (our reading) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L987-L990 ; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2722-L2737 | code read 2026-10-30, kind=code (fc02 added L2722-L2737: the adapter switch-off is code there; at L987-L990 it is only a comment)
- Our reading: beta sets distance and charges reward for it; in the 1.3B ablation general skills needed pretraining data | synthesis of F01-40, F01-41 | labelled "our reading" on the page

## Gradient table

- Post-training methods in this dive (SFT, RFT, DPO, PPO, GRPO) share one gradient shape; data source, reward function, gradient coefficient | https://arxiv.org/abs/2402.03300v3 (Sec. 5.2.1, Eq. 5, Table 10) | F01-70, F01-85; wave2-foundations row 13 (scope narrowed to "methods in this dive")
- PPO row: samples from the current policy; reward model minus per-token KL to reference; GAE advantage from a learned value function times the clipped ratio | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1, Eq. 1-2; App. A.1.5, Eq. 18) | DSM24 re-read 2026-10-30
- With one update per batch the weight is the advantage alone (GC_PPO = A_t) | https://arxiv.org/abs/2402.03300v3 (App. A.1.5, Eq. 18) | DSM24 re-read 2026-10-30
- Rows 1 to 4 are section 4's summary (sources cited there) | section 4 | F01-16, F01-17, F01-24, F01-70, F01-85

## What to watch

- Entropy definition (spread of next-token distribution; collapse means near-identical samples, nothing for a group to compare) | definition; section 8 owns the evidence | scope section 5 block (no register ID)
- TRL logs `kl` only when beta is not 0 and `entropy` at every step | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L3267-L3270 | code read 2026-10-30, kind=code
- E0 logs carry no KL metric | E0 run 1 logs.jsonl (as above) | E0 (Tier 0)
- E0 entropy between 0.19 and 0.32 over 20 steps, no trend; chart values per step from logs.jsonl | E0 log md and run1/run2 logs.jsonl | E0 (Tier 0)
- Steps 1 to 8 identical across runs; sampling not bit-identical between runs | E0 run1/run2 logs.jsonl; E0 md "What this run does not show" | E0 (Tier 0)
- Chart caption conditions (seed 0, Qwen2.5-0.5B-Instruct full FT, TRL 1.16.0, vLLM 0.28.0 colocate, beta 0.0, eps 0.2, lr 1e-6, 16 completions = 2 x 8, temperature 1.0, synthetic arithmetic, reward did not move) | E0 md "Setup" and "What this run does not show" | E0 (Tier 0)
- Read entropy trend over many steps (our reading) | inference from E0 | labelled "our reading"
- Bedrock RFT reports `actor/entropy` and `actor/pg_clipfrac` (frequency of clipped updates) next to reward metrics; no KL metric among those listed on the page | https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html ("Monitor your RFT training job") | F06-12; wave2-aws row 1; re-fetched 2026-10-30 (no "kl" match)
- Clip-fraction reference points: under 5% (one RLHF study), 0.0 at one update per batch (E0) | as above | F01-31; E0
