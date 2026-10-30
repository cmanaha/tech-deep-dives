# Claims: section 4, Policy Gradient (`src/sections/PolicyGradient.tsx`)

Every source below was re-opened on 2026-10-30 (arXiv PDFs at the pinned version, the Sutton and Barto PDF) and the quoted passage re-read. Format: `claim | source URL | register or wave 2 row`.

## Intro
- PPO, GRPO and SFT share one update shape; SFT's coefficient is 1 on every token | https://arxiv.org/abs/2402.03300v3 (Sec. 5.2.1 Eq. 5; App. A.1.1 "Gradient Coefficient: always set to 1"; A.1.5 Eq. 17-18; A.1.6 Eq. 20-21) | F01-70; wave2-foundations row 13
- The policy gradient is taken only through the log-probability term, not through the sampling distribution | https://arxiv.org/abs/2509.04259v1 (Sec. 5.1 footnote) | F01-17 (SHE25 wording); our reading for "a unit test or compiler can be the scorer"

## REINFORCE
- REINFORCE update: reward times grad log pi of the sampled response | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.3 Eq. 13.8); https://arxiv.org/abs/2402.14740v2 (Sec. 2.2 Eq. 6) | F01-16, F01-17; wave2-foundations row 9
- grad log pi is the direction that most increases the probability of repeating the action; the update moves in proportion to the return | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.3) | F01-16; wave2-foundations row 9
- SFT is the same update with coefficient 1 on fixed dataset targets | https://arxiv.org/abs/2402.03300v3 (App. A.1.1, Eq. 7) | F01-70, F01-85
- RL vs SFT: own samples vs fixed external targets; negative coefficients push probability away from poor outputs, absent in SFT | https://arxiv.org/abs/2509.04259v1 (Sec. 5.1) | F01-85

## Baseline
- REINFORCE's expected update follows the performance gradient (unbiased); it may have high variance and learn slowly | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.3, p. 329) | F01-18; wave2-foundations row 10
- Gradient variance grows with horizon because an action's effect is confounded with past and future actions | https://arxiv.org/abs/1506.02438v6 (Sec. 1) | F01-18
- Baseline update (R - b) * grad log pi | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.4 Eq. 13.11); https://arxiv.org/abs/2402.14740v2 (Eq. 7) | F01-19
- Baseline not depending on the action leaves expectation unchanged and can have a large effect on variance; cut comes from a baseline that tracks expected reward (state-value estimate; high covariance) | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.4); https://arxiv.org/abs/2402.14740v2 (Sec. 2.2) | F01-19; wave2-foundations row 10 (SCOPE NARROWER applied: "can", "when it tracks")
- Advantage sign: step should raise better-than-average and lower worse-than-average actions | https://arxiv.org/abs/1506.02438v6 (Sec. 2) | F01-11
- Diagram 1 weights (1, 1, 0, 0 and +/-0.67) | illustrative; RLOO arithmetic from https://arxiv.org/abs/2402.14740v2 (Sec. 2.3 estimator) | [derived], captioned "Illustrative, not measured"
- With 0/1 reward and no baseline, the update equals sampling from the model and SFT on correct answers only | https://arxiv.org/abs/2509.04259v1 (Sec. 5.1, "1-0 Reinforce") | F01-86 (same paragraph as F01-85)
- All samples pass, all RLOO advantages are 0, no gradient | arithmetic on the RLOO estimator, https://arxiv.org/abs/2402.14740v2 (Sec. 2.3) | [derived]; forward pointer to section 7

## Two ways to get a baseline
- Value function applied to the next state assesses the action; used that way it is a critic (actor-critic); one-step return lowers variance but introduces bias | http://incompleteideas.net/book/RLbook2020.pdf (Sec. 13.5) | F01-20; wave2-foundations row 11
- Actor-critic methods use a value function instead of empirical returns: lower variance at the cost of bias | https://arxiv.org/abs/1506.02438v6 (Sec. 1) | F01-20
- PPO in RLHF loads a critic | https://arxiv.org/abs/2402.14740v2 (Sec. 1, "the critic") | F01-32 context (named only; sizing left to section 19)
- GAE lambda = 0: delta_t, biased unless V accurate, lower variance; lambda = 1: return minus V, unbiased regardless of V, high variance | https://arxiv.org/abs/1506.02438v6 (Sec. 3 Eqs. 16-18) | F01-21; wave2-foundations row 12
- PPO on Llama-7B with Anthropic HH: lambda 0, 0.5, 0.95, 1 compared; reward fell monotonically with decreasing lambda; lambda = 1 best | https://arxiv.org/abs/2402.14740v2 (Sec. 3.1, Fig. 1) | F01-23; wave2-foundations row 12 (HOLDS part)
- Authors' explanation: strong initialization plus prompt conditioning concentrates probability on few tokens | https://arxiv.org/abs/2402.14740v2 (Sec. 3) | F01-23
- At lambda = 1 the critic is still subtracted as a baseline; it stops standing in for future reward | https://arxiv.org/abs/1506.02438v6 (Eq. 18); https://arxiv.org/abs/2402.14740v2 (Eq. 9) | wave2-foundations row 12 (WRONG mechanism corrected)
- RLOO: leave-one-out mean of the other k - 1 rewards; "akin to a parameter-free value-function, but estimated at each training step"; cost is increased sampling time | https://arxiv.org/abs/2402.14740v2 (Sec. 2.3) | F01-24; wave2-foundations row 11
- GRPO: group mean as baseline, divided by group standard deviation | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1, 4.1.2) | F01-24; wave2-foundations row 11
- DeepSeekMath's reasons to drop the critic: typically comparable size to the policy (memory and compute burden); usually only the last token is rewarded, which "may complicate" training a per-token-accurate value function | https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.1) | F01-12, F01-33 (kept as "typically" and "may complicate", attributed; fc02 restored the hedge 2026-10-30)
- Expandable: GAE sums residuals with weights (gamma * lambda)^l; Vanilla PG as return minus learned baseline b(s_t) trained like a value network | https://arxiv.org/abs/1506.02438v6 (Eq. 16, 18); https://arxiv.org/abs/2402.14740v2 (Eq. 9) | F01-21; wave2-foundations row 12

## One gradient, three choices
- Unified paradigm for SFT, RFT, DPO, PPO, GRPO: coefficient times grad log pi per token, averaged; three components (data source, reward function, algorithm to coefficient) | https://arxiv.org/abs/2402.03300v3 (Sec. 5.2.1 Eq. 5) | F01-70; wave2-foundations row 13 (scoped to the five named methods)
- Table rows: SFT dataset / human selection / 1; RFT samples from SFT model, rule, I(o) 1 or 0; online RFT samples from current policy; GRPO samples a group from the policy, reward model, Eq. 21 coefficient | https://arxiv.org/abs/2402.03300v3 (Table 10; App. A.1.1-A.1.3, Eq. 10; A.1.6 Eq. 21) | F01-70
- REINFORCE row: samples from current model, weight R | https://arxiv.org/abs/2402.14740v2 (Eq. 6) | F01-8, F01-16
- RLOO or GRPO row: group per prompt from current model, weight reward minus a baseline from the group (RLOO: leave-one-out mean; GRPO: group mean, divided by group std) | https://arxiv.org/abs/2402.14740v2 (Sec. 2.3); https://arxiv.org/abs/2402.03300v3 (Sec. 4.1.2) | F01-24 (fc02 2026-10-30: "from the other samples" was wrong for GRPO)
- Scorer is a reward model in both papers | https://arxiv.org/abs/2402.03300v3 (Table 10, GRPO "Model"); https://arxiv.org/abs/2402.14740v2 (Sec. 1) | F01-70
- GRPO's coefficient carries a beta (pi_ref / pi_theta - 1) term toward the reference model | https://arxiv.org/abs/2402.03300v3 (App. A.1.6 Eq. 21) | F01-70 (detail); KL itself left to section 5
- The rows change the two features that separate RL from SFT (sampling distribution, negative examples) | https://arxiv.org/abs/2509.04259v1 (Sec. 5.1) | F01-85
- Expandable: DeepSeekMath-Instruct 1.3B on GSM8K and MATH: online RFT level with RFT early, clearly ahead later; GRPO surpassed online RFT, credited by authors to positive and negative coefficients; GRPO's scorer was a reward model trained on rule judgments | https://arxiv.org/abs/2402.03300v3 (Sec. 5.2.1, Fig. 5, "Observation about Data Source" and "Observation about Gradient Coefficient") | F01-71 (same section as F01-70; not in the scope block's ID list, added as evidence for the block's mental model). fc02 2026-10-30: kept; scoped to the sample-source and weight columns, the scorer column is not isolated
- Closing action (place your pipeline on the table; two moves down) | restates the table rows above | no new claim
