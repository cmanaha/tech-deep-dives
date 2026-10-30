# Claims: section 7, RLVR & GRPO (`src/sections/RlvrAndGrpo.tsx`)

Every source below was re-opened on 2026-10-30: arXiv HTML or abstract pages at the pinned version, TRL files at tag `v1.16.0` (= `1b5c75ed94b7387f42532adb090c935166d4878d`, shallow clone), verl files at tag `v0.9.1` via raw.githubusercontent.com, the AWS pages with plain curl, and the E0 log and raw `logs.jsonl` at the dive's pinned commit `bcf5a9ed` (identical to the working tree). Format: `claim | source URL | register or wave 2 row`.

## Intro
- RLVR uses a program as the reward: boxed answer checked by rule, compiler plus predefined test cases | https://arxiv.org/abs/2501.12948v2 (Sec. 2.2) | F02-6, F02-7; wave2-rlvr row 6
- R1-Zero pass@1 on AIME 2024 rose from 15.6% to 77.9% with RL alone | https://arxiv.org/abs/2501.12948v2 (Sec. 2.3, Fig. 1) | F02-9; wave2-rlvr row 8
- AIME gloss "answers are numbers" | https://arxiv.org/abs/2501.12948v2 (Fig. 1 caption: "a mathematical problem as input and a number as output") | F02-9 context
- R1-Zero and R1 trained with GRPO; GRPO samples a group per prompt and baselines on the group | https://arxiv.org/abs/2501.12948v2 (Sec. 2.1); https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1) | F02-1; wave2-rlvr row 7
- A group with identical scores has zero advantage and zero gradient | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2) | F02-22; wave2-rlvr row 22
- E0: exactly zero loss on 9 of 20 steps (run 1) and 10 of 20 (run 2), 0.5B model, fresh arithmetic | E0_URL = research/2026-10/E0-spark-smoke.md at DIVE_REPO_SHA | E0 (Tier 0); wave2-systems-cost line 56

## A program as the reward
- Rule-based reward = accuracy + format, equal weight; boxed math answer; compiler and test cases; `<think>` tags | https://arxiv.org/abs/2501.12948v2 (Sec. 2.2, Eq. 4) | F02-6, F02-7; wave2-rlvr row 6
- DeepSeek kept neural reward models out of reasoning RL: reward hacking at scale, retraining cost | https://arxiv.org/abs/2501.12948v2 (Sec. 2.2) | F02-6
- R1-Zero built on DeepSeek-V3-Base, SFT phase bypassed | https://arxiv.org/abs/2501.12948v2 (Sec. 1) | F02-6 (re-read)
- 15.6% to 77.9% average pass@1; 86.7% with self-consistency (majority vote) | https://arxiv.org/abs/2501.12948v2 (Sec. 2.3, Fig. 1) | F02-9; wave2-rlvr row 8
- v1 reported 71.0%; v2 and Nature report 77.9% | https://arxiv.org/abs/2501.12948v1 (Sec. 2.2.4) | F02-9; wave2-rlvr row 8 (v1 PDF fetched by W2 on 2026-10-30; not re-opened by this agent)
- RL from base failed (no meaningful AIME gains, repetition) on 7B dense and 16B MoE; worked on 32B dense (Qwen's), 230B and 671B MoE; DeepSeek recommends sufficiently large and expressive models | https://arxiv.org/abs/2501.12948v2 (Supplementary G.1) | F02-11; wave2-rlvr row 9 (WRONG verdict applied: "Qwen's")
- Qwen2.5-32B-Zero (>10K RL steps) 47.0 AIME 2024 pass@1, on par with QwQ-32B-Preview; R1-Distill-Qwen-32B 72.6, SFT only, better on all benchmarks | https://arxiv.org/abs/2501.12948v2 (Supplementary F.1, Table 16; B.3.3 "do not include an RL stage") | F02-12; wave2-rlvr row 10
- Dr. GRPO expansion "GRPO Done Right" | https://arxiv.org/abs/2503.20783v2 (Sec. 3.2 heading) | read this pass
- Dr. GRPO recipe: Qwen2.5-Math-7B to 43.3% on AIME 2024, 27 hours on 8 A100 | https://arxiv.org/abs/2503.20783v2 (abstract, Sec. 1) | F02-19; wave2-rlvr row 11
- Random rewards raised Qwen2.5-Math-7B MATH-500 by 21.4 points; spurious rewards effective for Qwen often fail on Llama3, OLMo2 | https://arxiv.org/abs/2506.10947v2 (abstract; venue ICML 2026 per wave2-rlvr G3) | F02-53; wave2-rlvr row 11
- pass@k definition | definition as in SCOPE section 3 | F02-40 (definition only)

## GRPO scores each answer against its own group
- Advantage = (r - group mean) / group std, applied to every token | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.2) | F02-2; wave2-rlvr row 7
- Group baseline removes PPO's value function, typically a model of comparable size | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1) | F02-1
- Objective averages over tokens per answer (1/|o_i|) and over G answers | https://arxiv.org/abs/2402.03300v3 (Eq. 3) | F02-2
- Diagram numbers: 3 of 8 pass, mean 0.375, std 0.52, advantages +1.21 / -0.72; all-pass group advantage 0 | illustrative; arithmetic with TRL's formula | [derived], captioned "Illustrative, not measured"
- Sample standard deviation (Bessel, n - 1) in TRL and verl | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/utils.py#L1021-L1044 ; https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/ppo/core_algos.py#L319-L321 | read this pass (code)
- Zero advantage gives zero policy gradient | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2) | F02-22
- TRL defaults beta 0.0 (no KL, no reference model) and entropy_coef 0.0 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L681-L687 ; #L876-L877 | F02-29 (entropy_coef read this pass)
- TRL num_generations default 8 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L480-L481 | read this pass (code); E0 meta agrees
- SageMaker MTRL group_size default 8 | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | F06-33; wave2-aws row 14

## Each successor changes one term
- Dr. GRPO: length divisor penalises long wrong answers less (prefers lengthier incorrect); std divisor up-weights near-always/never-solved questions; Dr. GRPO removes both | https://arxiv.org/abs/2503.20783v2 (Sec. 3.1; Fig. 1 caption) | F02-15; wave2-rlvr row 12
- DAPO expansion; clip 0.2 low / 0.28 high; at eps 0.2 a 0.01 token can reach 0.012 while a 0.9 token is unconstrained; upper clip "potentially constraining" exploration; naive GRPO run showed entropy collapse | https://arxiv.org/abs/2503.14476v2 (abstract; Sec. 1; Sec. 3.1; Sec. 4.1) | F02-20, F02-21; wave2-rlvr row 14
- Dynamic sampling keeps prompts with accuracy strictly between 0 and 1; effective prompts per batch shrink, larger gradient variance | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2, Eq. 11) | F02-22; wave2-rlvr row 15
- Token-level loss; sample-level averaging lowers long-answer tokens' contribution, under-penalises gibberish/repetition, unhealthy entropy and length growth | https://arxiv.org/abs/2503.14476v2 (Sec. 3.3, Fig. 4) | F02-20; wave2-rlvr row 16
- GSPO: one length-normalised sequence ratio, clips whole responses; token ratio from a single sample, noise accumulates; GRPO needed Routing Replay for MoE, GSPO did not (Qwen, first-party lab) | https://arxiv.org/abs/2507.18071v2 (Sec. 3, 4.1, 5.1) | F02-23, F02-24; wave2-rlvr row 17
- REINFORCE++ normalises over the global batch; argues prompt-level normalisation is biased and overfits | https://arxiv.org/abs/2501.03262v9 (abstract) | F02-26; wave2-rlvr row 18
- RLOO leave-one-out baseline | https://arxiv.org/abs/2402.14740v2 (Sec. 2.3; ACL 2024) | F02-25
- Probability ratio, clip and entropy definitions | definitions consistent with section 5 and https://arxiv.org/abs/2503.14476v2 (Eq. 10) | F01-27 context
- Part of GRPO's length growth is the length bias; Dr. GRPO keeps length from growing wildly | https://arxiv.org/abs/2503.20783v2 (Sec. 3.2) | F02-16; wave2-rlvr row 13
- Expandable: DAPO Table 1 (naive GRPO 30, +overlong filtering 36, +Clip-Higher 38, +soft overlong punishment 41, +token-level loss 42, +dynamic sampling 50; R1-Zero-Qwen-32B 47), AIME24 avg@32 on Qwen2.5-32B | https://arxiv.org/abs/2503.14476v2 (Table 1, Sec. 4.1) | F02-20
- Expandable: dynamic sampling samples more but convergence time reduced, fewer steps | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2, 4.2, Fig. 6) | read this pass
- Expandable: ~10% of activated experts change per update on Qwen3-30B-A3B; GSPO clips ~two orders of magnitude more tokens, trains more efficiently, no Routing Replay | https://arxiv.org/abs/2507.18071v2 (Sec. 5.1-5.3) | F02-24

## What a trainer runs when you ask for GRPO
- TRL loss_type default "dapo" | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L801-L802 | F02-28; wave2-rlvr row 19
- TRL scale_rewards default "group"; "none" removes std scaling; "batch" scales by batch std | .../grpo_config.py#L789-L790 ; #L227-L236 | F02-30; wave2-rlvr row 21 (TRL credits "batch" to PPO Lite; the page does not attribute it to REINFORCE++)
- verl adv_estimator default gae (PPO with a critic) | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/ppo_trainer.yaml#L77-L78 | F02-35; wave2-rlvr row 20
- verl rollout.n default 1, commented "> 1 for grpo" | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/rollout/rollout.yaml#L126-L127 | read this pass (code)
- Dr. GRPO needs loss_type="dr_grpo" (constant divisor, batch x max_completion_length) and scale_rewards="none"; either alone leaves one tilt | .../grpo_trainer.py#L2785-L2787 ; #L3163-L3164 | F02-30; wave2-rlvr row 21
- TRL paper index Dr. GRPO recipe sets only loss_type="dr_grpo", so std scaling stays at "group" (doc vs code) | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/paper_index.md#L297-L313 ; .../grpo_config.py#L789-L790 | NEW this pass (not in registers)
- verl GRPO with one sample per group: mean 0, std 1, so advantage = raw reward (our reading of the code) | .../verl/trainer/ppo/core_algos.py#L315-L327 | NEW this pass (code)
- Knob table, TRL: num_generations=8 (L480-L481); RLOOTrainer leave-one-out (rloo_trainer.py L1688-L1690); loss_type values grpo / dr_grpo / dapo (L237-L248); epsilon 0.2, epsilon_high defaults to epsilon (L693-L714); importance_sampling_level default "token", "sequence" for GSPO (L760-L761) | TRL v1.16.0 files as named | F02-28, F02-32, F02-34
- Knob table, TRL: dynamic sampling not supported | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/paper_index.md#L154-L164 | NEW this pass (official docs at tag)
- Knob table, TRL: frac_reward_zero_std definition | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/grpo_trainer.md#L189 ; logged at grpo_trainer.py L2830 | read this pass
- Knob table, verl: norm_adv_by_std_in_grpo True (ppo_trainer.yaml L80-L81); loss_agg_mode token-mean and seq-mean-token-sum-norm constant divisor, Dr. GRPO's form in our reading (core_algos.py L1181-L1193; actor.yaml L86); clip_ratio_low/high 0.2/0.2 (actor.yaml L38-L42); filter_groups.enable False (ppo_trainer.yaml L83-L90); policy_loss.loss_mode vanilla (actor.yaml L60-L61) and registered "gspo" loss (core_algos.py L1545-L1546) | verl v0.9.1 files as named | F02-35, F02-36, F02-37 (filter_groups and seq-mean-token-sum-norm read this pass)

## The same knobs on a managed job
- Bedrock RFT generates several responses per prompt, scores with a reward function, trains with GRPO | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-1; wave2-aws row 6
- Bedrock job request fields incl. trainingSamplePerPrompt; example value 4, not a default | https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html | F06-11; wave2-aws row 2
- MTRL: group_size 8 [2, 32]; advantage_method group_based, nine values incl. rloo, reinforce_pp, grpo_passk; loss_fn ppo, values importance_sampling / ppo / cispo; clip thresholds 0.8 / 1.2 with ranges [0,1] / [1,10]; global_batch_size 128 {32, 64, 128}; rollouts per step = global_batch_size x group_size | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | F06-33, F06-34; wave2-aws rows 14, 15 (naming note applied: "REINFORCE++, in our reading of the identifier")
- 1 - 0.2 and 1 + 0.2; 0.28 would be 1.28; 128 x 8 = 1,024 rollouts per step | our arithmetic | [derived]
- AWS suggests importance_sampling for newcomers; PPO with (0.8, 1.2) "the safe baseline for any first run" | MTRL page ("Loss function and clipping range") | F06-33

## Always-solved and never-solved prompts waste the step (ending)
- Same-reward group: zero advantage, no gradient (all succeed or all fail) | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2); MTRL page ("Batch size and group size") | F02-22, F06-34; wave2-aws row 15
- In DAPO's run accuracy-1 prompts kept increasing; fewer effective prompts, larger gradient variance; dynamic sampling fills batch with accuracy strictly between 0 and 1 | https://arxiv.org/abs/2503.14476v2 (Sec. 3.2, Fig. 3b) | F02-22
- E0 conditions: Qwen2.5-0.5B-Instruct, full fine-tuning, (a + b) * c - d, reward 1 for exact integer, 2 prompts x 8, TRL 1.16.0 defaults (loss_type dapo, beta 0, scale_rewards group), seed 0, two runs | E0_URL | E0 (Tier 0)
- Mean reward 0.044 (about 4%); 9 and 10 of 20 steps with both groups all zero, frac_reward_zero_std 1.0, loss exactly 0.0, no gradient | E0_URL; raw logs.jsonl recounted this pass (grad_norm 0.0 on those steps) | E0 (Tier 0)
- 28 of 40 groups (run 1) and 29 of 40 (run 2) with zero reward std | https://github.com/cmanaha/tech-deep-dives/blob/bcf5a9edc0c77ee9c26c76ce73d98ab037903f67/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/logs.jsonl and run2/logs.jsonl (frac_reward_zero_std per step: 1.0 counts 2 groups, 0.5 counts 1) | E0 (Tier 0), counted this pass
- Reward did not move; 20 steps at lr 1e-6 is a mechanism test | E0_URL ("What this run does not show") | E0
- Silent-group probability p^G + (1 - p)^G = 0.70 at p = 0.044, G = 8; both groups 0.49, about 10 of 20 steps; table values (1%: 92%/85%; 4.4%: 70%/49%; 10%: 43%/19%; 30%: 6%/0.3%; 50%: 0.8%/under 0.01%) | our arithmetic, assuming one rate per prompt and independent answers | [derived]
- SageMaker guidance for sparse rewards: moderate group size with larger batch or more steps; lower learning rate because useful gradient is diluted | MTRL page ("Learning rate"; "Batch size and group size") | F06-34 (same page)
- frac_reward_zero_std definition; TRL has no dynamic sampling; verl filter_groups.enable off by default | grpo_trainer.md L189; paper_index.md L154-L164; ppo_trainer.yaml L83-L90 | as above
- Section 22's second question is what the model scores on the signal today | SCOPE.md section 22 | cross-reference only
