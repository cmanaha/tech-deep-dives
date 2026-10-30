# Claims: section 3, The Language Model Is Already a Policy

File: `src/sections/LanguageModelAsPolicy.tsx`. Every source below was re-opened on 2026-10-30
(arXiv PDFs at the pinned version, the Sutton and Barto PDF, TRL files at the v1.12.0 tag, which
resolves to commit 59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be, the v1.13.0 release notes and the
v1.16.0 `trl/trainer` listing, and the E0 log at the dive's pinned commit).

One line per claim: `claim | source URL | register or wave 2 row`.

## h1 intro

- A policy is a mapping from states to probabilities of selecting each action | http://incompleteideas.net/book/RLbook2020.pdf (section 3.5) | F01-1
- A language model is a policy: fix the beginning of the sample to the prompt and generate the rest with the model | https://arxiv.org/abs/1909.08593v2 (section 2) | F01-2

## One response, two ways to count its actions

- Token view: state = prompt plus partial response, action = next token, one response = one episode | https://arxiv.org/abs/2406.09279v2 (appendix F.2) | F01-3; wave2-foundations row 1
- A state carries everything about the past that matters for the future (Markov property) | http://incompleteideas.net/book/RLbook2020.pdf (section 3.1) | F01-4
- The prefix meets the Markov test by construction; the context window is the state (labelled "our reading") | derived from SB 3.1 and ZIE19 section 2 | F01-4 (SPECULATIVE in register, labelled on page)
- InstructGPT's RL environment is a bandit environment: random customer prompt, response, reward-model score, episode ends | https://arxiv.org/abs/2203.02155v1 (section 3.5) | F01-7; wave2-foundations row 1
- Deterministic next state plus end-only reward reduce the token process to a bandit with only the prompt and the finished response as states | https://arxiv.org/abs/2402.14740v2 (section 3.3) | F01-8 (section 3.3 text read 2026-10-30, beyond the register quote)
- Contextual bandit: each action affects only its immediate reward; when actions affect the next situation it is the full RL problem | http://incompleteideas.net/book/RLbook2020.pdf (section 2.9) | not in register; read at source 2026-10-30
- The bandit setting avoids much of the complexity of the full RL problem; used to study explore/exploit | http://incompleteideas.net/book/RLbook2020.pdf (chapter 2 intro) | F01-14 (chapter 2 text read 2026-10-30)
- PPO models each token as an action; REINFORCE and RLOO model the entire generation as one action | https://arxiv.org/abs/2402.14740v2 (section 3.3) | F01-8
- Treating the response as one action lets REINFORCE optimise the sequence-level reward directly | https://arxiv.org/abs/2402.14740v2 (section 2.2, Eq. 6) | F01-8; wave2-foundations row 1
- Episode, rollout and trajectory are synonyms across papers; the dive says rollout | dive convention | SCOPE section 3 block
- Diagram: E0-style prompt, 0 reward at intermediate steps, R = 1.0 at EOS, TRL v1.12.0 PPO row with -beta KL per token and + R at the end | STI20 fn 8; E0 log; TRL ppo_trainer.py L771-L779 | F01-6, F01-9; caption says "Illustrative, not measured"

## One score at the end, spread over every token

- Reward model scores entire responses, nothing at intermediate steps; episode ends at EOS; discount factor 1 | https://arxiv.org/abs/2009.01325v3 (section 3.4, footnote 8) | F01-6; wave2-foundations row 2
- E0: mean completion length per step ranged from 124 to 164 tokens; each completion got 1.0 (correct tagged integer) or 0.0 | https://github.com/cmanaha/tech-deep-dives/blob/bcf5a9edc0c77ee9c26c76ce73d98ab037903f67/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md | Tier 0, E0 (logs.jsonl: 123.94 to 163.56 run 1, 125.5 to 162.3 run 2)
- "Sparse reward" as the label for one end-of-response score | dive's label (wave 2 notes the source states the fact, not the term) | wave2-foundations row 2
- Same end-only reward whether a reward model (section 6) or a program grader (section 7) scores | STI20 fn 8 (reward model); E0 log (program grader) | F01-6; E0
- Return = sum of rewards from step t to the end of the episode | http://incompleteideas.net/book/RLbook2020.pdf (section 3.3, Eq. 3.7) | F01-5; wave2-foundations row 4
- With one end reward and discount 1, every token's return equals the final score | arithmetic from SB 3.3 and STI20 fn 8 | derived, stated as such on page
- Credit assignment problem: long delay between actions and their effect on rewards | https://arxiv.org/abs/1506.02438v6 (section 1) | F01-12; wave2-foundations row 3
- Usually only the last token gets a reward score, which complicates a value function accurate at each token | https://arxiv.org/abs/2402.03300v3 (section 4.1.1) | F01-12; wave2-foundations row 3
- Value = expected return from a state under the policy | http://incompleteideas.net/book/RLbook2020.pdf (section 3.5) | F01-10; wave2-foundations row 4
- PPO trains a value model over incomplete responses | https://arxiv.org/abs/2406.09279v2 (appendix F.2) | F01-10
- Q = expected return after taking the action, then following the policy | http://incompleteideas.net/book/RLbook2020.pdf (section 3.5) | F01-10 (q definition read 2026-10-30)
- A = Q - V | https://arxiv.org/abs/1506.02438v6 (section 2) | F01-11; wave2-foundations row 4
- A policy-gradient step raises better-than-average and lowers worse-than-average actions; advantage measures better or worse than default behaviour | https://arxiv.org/abs/1506.02438v6 (section 2) | F01-11

## How you sample decides what can be learned

- On-policy evaluates or improves the policy making decisions; off-policy improves a different policy from the one that generated the data | http://incompleteideas.net/book/RLbook2020.pdf (section 5.4) | F01-13; wave2-foundations row 4
- E0: each of 20 steps generated 16 fresh completions with vLLM before training | E0 log (Results, stage table) | Tier 0, E0
- Exploration vs exploitation; the issue does not arise in pure supervised learning | http://incompleteideas.net/book/RLbook2020.pdf (section 1.1) | F01-14; wave2-foundations row 4
- Policy-gradient methods keep the policy from becoming deterministic to ensure exploration | http://incompleteideas.net/book/RLbook2020.pdf (section 13.1) | F01-14
- InstructGPT sampled RL rollouts at temperature 1 | https://arxiv.org/abs/2203.02155v1 (appendix C.4) | F01-15
- Tulu 2 PPO rollouts at temperature 0.7 | https://arxiv.org/abs/2406.09279v2 (appendix F.2) | F01-15
- E0 sampled at temperature 1.0 | E0 log (trainer configuration) | Tier 0, E0
- Greedy decoding returns the same response every time | definitional, no citation | none
- pass@k definition: 1 if any of k samples passes, dataset average = share solvable within k | https://arxiv.org/abs/2504.13837v5 (section 2) | F02-40; wave2-foundations row 5
- pass@k unbiased estimator with n >= k samples and c correct: 1 - C(n-c, k)/C(n, k), following Chen et al. | https://arxiv.org/abs/2504.13837v5 (appendix A.2, Eq. 2) | F02-40 (appendix read 2026-10-30); wave2-foundations row 5

## Reading an RL paper's equations

- Vocabulary table rows (policy, state, action, rollout, reward, return, value, advantage) | as cited for each term above | F01-1 to F01-14
- Token-view equations (sum over t of log pi(y_t | x, y_<t), per-token reward, value model): PPO | https://arxiv.org/abs/2406.09279v2 (appendix F.2, Eq. 4) | F01-3, F01-9
- Response-view equations (single log pi(y | x) times R(y, x)): REINFORCE, RLOO | https://arxiv.org/abs/2402.14740v2 (section 2.2, Eq. 6) | F01-8
- Sequence probability is the product of next-token probabilities | https://arxiv.org/abs/1909.08593v2 (section 2) | F01-2
- A response-level update gives every token the same weight (labelled "our arithmetic") | derived from the factorisation | derived
- TRL shipped PPO for the last time in v1.12.0; removed in v1.13.0 | https://github.com/huggingface/trl/releases/tag/v1.13.0 ; ppo_trainer.py 404 at v1.13.0 | F01-76; wave2-foundations row 6
- TRL v1.12.0 PPO: per-token reward = -kl_coef * KL, score added at one index at the end of the response | https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py#L771-L779 | F01-9; wave2-foundations row 6
- The same per-token reward as IVI24's PPO formulation | https://arxiv.org/abs/2406.09279v2 (appendix F.2, Eq. 4) | F01-9
- Critic and advantage computed per token (GAE loop over t) | https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py#L786-L798 | read at source 2026-10-30
- E0 ran GRPO with KL coefficient 0.0, TRL v1.16.0's default; one number per completion was the only reward | E0 log (trainer configuration: beta 0.0 default) | Tier 0, E0
- Expandable: verbatim L771-L779 code excerpt | https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py#L771-L779 | F01-9
- gamma defaults to 1.0 in PPOConfig at v1.12.0 | https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_config.py#L264-L267 | read at source 2026-10-30
- PPOTrainer lives under trl.experimental.ppo at v1.12.0 | `trl/experimental/ppo/__init__.py` at v1.12.0 (read 2026-10-30; the page states it next to the release-notes cite) | F01-76
- `from trl import PPOTrainer` stopped working in v1.10 | https://github.com/huggingface/trl/releases/tag/v1.13.0 | F01-76
- At v1.16.0 `trl/trainer` holds GRPO and RLOO trainers and no PPO | https://github.com/huggingface/trl/tree/v1.16.0/trl/trainer | F01-76; wave2-foundations row 6

## Edit the context, edit the policy

- Reflexion parameterises a policy as the agent's memory encoding paired with a choice of LLM parameters | https://arxiv.org/abs/2303.11366v4 (section 1, contributions) | F04-54; wave2-foundations row 8; wave2-words row 18
- Editing the memory changes which responses the policy samples while the weights stay fixed (labelled "our reading") | synthesis of F04-54 with F01-3 and F01-4 | our reading
