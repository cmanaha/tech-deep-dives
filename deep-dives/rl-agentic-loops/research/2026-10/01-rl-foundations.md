# 01 RL foundations for LLMs: research register

## Header

- **Research date:** 2026-10-16. Every URL in this file was accessed 2026-10-16.
- **Scope:** the RL vocabulary mapped onto token generation; policy gradient, REINFORCE, baselines and GAE (generalized advantage estimation); PPO (proximal policy optimization) and its trust-region origin; KL (Kullback-Leibler) regularisation to a reference model; the RLHF (reinforcement learning from human feedback) pipeline and reward-model over-optimisation; DPO (direct preference optimization) and its relatives; RLAIF (RL from AI feedback) and Constitutional AI; what an RL weight update changes compared with SFT (supervised fine-tuning). Out of scope here: RL with verifiable rewards for reasoning, text-only "verbal" loops, agent environments (other research areas).
- **Reader:** ex-EC2/Compute tech lead, strong on systems, inference and agents, no formal RL background.
- **Quote policy:** quotes are verbatim from the pinned version, with three normalisations required by house style: curly quotes become straight quotes, typographic dashes become a hyphen or comma, and math is transcribed in plain text (subscripts flattened, Greek letters kept). Ellipses mark omissions.
- **Evidence kinds used:** definition, theory/proof, benchmark claim (author-reported), ablation, production report, code behaviour.

### Tier definitions (for this dive)

| Tier | What it covers |
|---|---|
| Tier 0 | Our own experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-char SHA; official framework docs (including the project's own release notes); first-party AWS docs |
| Tier 2 | First-party lab or vendor blog posts and talks, including an author's own post about their own method |
| Tier 3 | Academic papers (peer-reviewed venue marked, otherwise "preprint") and third-party technical analysis. Textbooks are filed here |
| Tier 4 | Tutorials, summaries, press. Inspiration only, never cited as fact (none used) |

Code is the authority over docs; docs over blogs.

### Pinned sources

Papers (all Tier 3):

| Key | arXiv ID pinned | Venue (how verified) |
|---|---|---|
| TRPO | 1502.05477v5 | ICML 2015 (PDF header "Proceedings of the 31st International Conference on Machine Learning"; arXiv comment) |
| GAE | 1506.02438v6 | ICLR 2016 (PDF header) |
| CHR17 | 1706.03741v4 | NeurIPS 2017 (proceedings.neurips.cc page) |
| PPO | 1707.06347v2 | preprint |
| ZIE19 | 1909.08593v2 | preprint |
| STI20 | 2009.01325v3 | NeurIPS 2020 (PDF header) |
| OUY22 (InstructGPT) | 2203.02155v1 | NeurIPS 2022 (proceedings.neurips.cc page) |
| GAO22 | 2210.10760v1 | ICML 2023 (PMLR v202 page; the v1 PDF itself says "Preprint. Under review.") |
| CAI22 | 2212.08073v1 | preprint |
| DPO23 | 2305.18290v3 | NeurIPS 2023 (PDF header) |
| ZHE23 (LLM-as-a-judge) | 2306.05685v4 | NeurIPS 2023 Datasets and Benchmarks (PDF header) |
| LEE23 (RLAIF) | 2309.00267v3 | ICML 2024 (PDF header, PMLR 235) |
| IPO23 | 2310.12036v2 | AISTATS 2024 (PMLR v238 page; v2 PDF says "Under review.") |
| KTO24 | 2402.01306v5 | ICML 2024 (PDF header, PMLR 235) |
| DSM24 (DeepSeekMath, GRPO) | 2402.03300v3 | preprint |
| AHM24 (Back to Basics, RLOO) | 2402.14740v2 | ACL 2024 (ACL Anthology 2024.acl-long.662) |
| ORPO24 | 2403.07691v2 | EMNLP 2024 (ACL Anthology 2024.emnlp-main.626; arXiv comment says "Preprint") |
| XU24 | 2404.10719v3 | ICML 2024 (arXiv journal ref) |
| SIMPO24 | 2405.14734v3 | NeurIPS 2024 (PDF header) |
| IVI24 | 2406.09279v2 | NeurIPS 2024 (PDF header) |
| CHU25 | 2501.17161v2 | ICML 2025 (PDF header, PMLR 267) |
| MUK25 | 2505.11711v2 | NeurIPS 2025 (arXiv comment only; proceedings page not checked) |
| SHE25 (RL's Razor) | 2509.04259v1 | preprint |

Books and non-arXiv papers:

| Key | Pin | Tier |
|---|---|---|
| SB | Sutton and Barto, Reinforcement Learning: An Introduction, 2nd ed., MIT Press 2018, PDF `RLbook2020.pdf` from http://incompleteideas.net/book/the-book-2nd.html | Tier 3 (textbook) |
| WIL92 | Williams 1992, Machine Learning 8(3-4):229-256, DOI 10.1007/BF00992696 (cited through SB; original not readable, see U1) | Tier 3 |

Code (Tier 1):

| Key | Repo | Ref | Files read |
|---|---|---|---|
| TRL112 | huggingface/trl | tag v1.12.0 = 59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be (2026-08-26) | `trl/experimental/ppo/ppo_trainer.py`, `trl/experimental/ppo/ppo_config.py` |
| TRL113 | huggingface/trl | tag v1.13.0 = 3d9261f1fec9f9a8140099c78a65c7da73dce79c (2026-09-10) | release notes; repository tree (no PPO files) |
| TRL116 | huggingface/trl | tag v1.16.0 = 1b5c75ed94b7387f42532adb090c935166d4878d (2026-10-15, latest release on 2026-10-16) | `trl/trainer/dpo_config.py`, `trl/trainer/dpo_trainer.py`, `trl/trainer/grpo_config.py`, `trl/trainer/rloo_config.py` |

Blog (Tier 2): SCH20, John Schulman, "Approximating KL Divergence", posted 2020/03/07, http://joschu.net/blog/kl-approx.html (author's own post; cited by the TRL code).

---

## Claim register

Tags in "Use in dive": **[MM]** builds a mental model, **[PR]** practical to know.

### A. The RL vocabulary mapped onto token generation

**F01-1. A policy is a probability distribution over actions given a state.**
- Location: SB Section 3.5, p. 58.
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "Formally, a policy is a mapping from states to probabilities of selecting each possible action. If the agent is following policy π at time t, then π(a|s) is the probability that At = a if St = s."
- Use in dive: Getting Started vocabulary. [MM]

**F01-2. A language model already is a policy: fix the prompt, sample the rest.**
- Location: ZIE19 Section 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1909.08593v2 (accessed 2026-10-16). Tier 3 preprint, definition. "We begin with a vocabulary Σ and a language model ρ which defines a probability distribution over sequences of tokens Σn via ρ(x0 ... xn-1) = Π0≤k<n ρ(xk|x0 ... xk-1) ... ρ defines a probabilistic policy for this task via ρ(y|x) = ρ(xy)/ρ(x): fixing the beginning of the sample to x and generating subsequent tokens using ρ."
- Use in dive: the opening reframe. Nothing new is bolted on to make an LM "RL-ready"; the next-token distribution is the policy. [MM]

**F01-3. Token-level mapping: state = prompt plus partial response, action = next token, episode = one response.**
- Location: IVI24 Appendix F.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.09279v2 (accessed 2026-10-16). Tier 3 NeurIPS 2024, definition. "PPO formulates language generation as a Markov decision process (MDP), where each response y is an episode, an action is a token yt, and a state is the concatenation of a prompt and a partial response (x ◦ y<t)."
- Use in dive: the vocabulary table (RL term, LM meaning). [MM]

**F01-4. Why "prompt plus all tokens so far" is a valid state: the Markov property asks the state to carry everything that matters for the future, and an autoregressive LM conditions on the whole prefix by construction.**
- Location: SB Section 3.1, p. 49 (definition); ZIE19 Section 2 (factorisation in F01-2).
- Verdict: NEW. The definition is SB; applying it to the LM prefix is [SPECULATIVE: own derivation from the two sources].
- Evidence: SB (Tier 3, definition). "The state must include information about all aspects of the past agent-environment interaction that make a difference for the future. If it does, then the state is said to have the Markov property."
- Use in dive: explains why the context window is the state, which matters later when a text loop puts critiques and tool output into that same state. [MM]

**F01-5. Reward is a single number from the environment; return is the sum of rewards to the end of the episode.**
- Location: SB Section 1.3, p. 6 (reward); Section 3.3, p. 54, Eq. 3.7 (return, episodes).
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "On each time step, the environment sends to the reinforcement learning agent a single number called the reward. The agent's sole objective is to maximize the total reward it receives over the long run." Return: "Gt = Rt+1 + Rt+2 + Rt+3 + ... + RT, (3.7) where T is a final time step ... when the agent-environment interaction breaks naturally into subsequences, which we call episodes".
- Use in dive: vocabulary. [MM]

**F01-6. In RLHF the reward arrives only once, at the end of the response; the discount is 1. That is what makes it a sparse-reward problem.**
- Location: STI20 Section 3.4, footnote 8.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2009.01325v3 (accessed 2026-10-16). Tier 3 NeurIPS 2020, definition. "Note that the reward model only gives rewards for entire summaries, and not at intermediate time steps. In RL terminology, each episode terminates when the policy outputs the EOS token, and the discount factor γ = 1." Main text: "where each time step is a BPE token."
- Use in dive: the sparse-reward framing; one number has to be spread over hundreds of tokens. [MM]

**F01-7. InstructGPT frames each prompt-response as a one-step bandit episode.**
- Location: OUY22 Section 3.5, "Reinforcement learning (RL)".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2203.02155v1 (accessed 2026-10-16). Tier 3 NeurIPS 2022, definition. "The environment is a bandit environment which presents a random customer prompt and expects a response to the prompt. Given the prompt and response, it produces a reward determined by the reward model and ends the episode."
- Use in dive: the second of two framings (token MDP in F01-3, response bandit here). [MM]

**F01-8. Treating the whole response as one action is a legitimate choice, and it lets plain REINFORCE optimise the sequence-level reward directly.**
- Location: AHM24 Section 2.2, Eq. 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2402.14740v2 (accessed 2026-10-16). Tier 3 ACL 2024, definition. "Given that in LLM applications, r(x, y) is only obtained at the end of the full sequence, it may be more appropriate to model the entire generation as a single action, as opposed to each token." Estimator: "E x∼D, y∼πθ(.|x) [R(y, x) ∇θ log πθ(y|x)]".
- Use in dive: reconciles F01-3 and F01-7: the choice of "action" is a modelling decision, and the later trend away from per-token critics follows from it. [MM]

**F01-9. In running code, the two framings mix: the reward-model score is added at the final token, and every token also gets a per-token KL penalty.**
- Location: TRL112 `trl/experimental/ppo/ppo_trainer.py` L771-L779.
- Verdict: NEW. Category B (documented in IVI24 Appendix F.2 Eq. 4 and confirmed in code).
- Evidence: https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_trainer.py#L771-L779 (accessed 2026-10-16). Tier 1, code behaviour. `non_score_reward = -args.kl_coef * kl` (L775), `rewards = non_score_reward.clone()` (L776), `rewards[actual_start, actual_end] += scores` (L779). IVI24 App. F.2: "the sequence-level reward r is applied only to the lasttoken, and each token is penalized by a KL term".
- Use in dive: the concrete per-token reward vector: mostly small negative KL terms, one large score at the end. [MM][PR]

**F01-10. The value function predicts expected return from a state; for an LM it predicts the eventual score of a partial response.**
- Location: SB Section 3.5, p. 58, Eq. 3.12; IVI24 Appendix F.2.
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "The value function of a state s under a policy π, denoted vπ(s), is the expected return when starting in s and following π thereafter." IVI24 (Tier 3, definition): "PPO also trains a value model Vϕ(x ◦ y<t) that estimates the expected value function of incomplete responses under the active policy."
- Use in dive: what the critic is for. [MM]

**F01-11. The advantage is "how much better than usual" an action was: Q minus V. Its sign decides whether a token's probability goes up or down.**
- Location: GAE Section 2, Eq. 3 and the paragraph after it.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1506.02438v6 (accessed 2026-10-16). Tier 3 ICLR 2016, definition. "Aπ(st, at) := Qπ(st, at) - Vπ(st), (Advantage function)." And: "a step in the policy gradient direction should increase the probability of better-than-average actions and decrease the probability of worse-than-average actions. The advantage function ... measures whether or not the action is better or worse than the policy's default behavior."
- Use in dive: Getting Started; the single most useful sentence for a newcomer. [MM]

**F01-12. Spreading one end-of-response score across tokens is the credit assignment problem, and it is what makes an accurate per-token critic hard to train for LLMs.**
- Location: GAE Section 1; DSM24 Section 4.1.1.
- Verdict: NEW
- Evidence: GAE (Tier 3, definition): "A key source of difficulty is the long time delay between actions and their positive or negative effect on rewards; this issue is called the credit assignment problem". https://arxiv.org/abs/2402.03300v3 (accessed 2026-10-16), Tier 3 preprint, author analysis: "While in the LLM context, usually only the last token is assigned a reward score by the reward model, which may complicate the training of a value function that is accurate at each token."
- Use in dive: why critics fell out of favour (F01-22, F01-33). [MM]

**F01-13. On-policy means learning from the policy's own current samples; off-policy (and offline) means learning from data some other policy produced.**
- Location: SB Section 5.4, p. 100; Section 5.5, p. 103.
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "On-policy methods attempt to evaluate or improve the policy that is used to make decisions, whereas off-policy methods evaluate or improve a policy different from that used to generate the data." Section 5.5: off-policy methods "are often of greater variance and are slower to converge."
- Use in dive: the axis that later explains DPO vs PPO (F01-56) and RL vs SFT (F01-71). [MM]

**F01-14. Exploration is the RL-specific trade-off; supervised learning never faces it.**
- Location: SB Section 1.1, p. 3; Section 13.1, p. 322.
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "The agent has to exploit what it has already experienced in order to obtain reward, but it also has to explore in order to make better action selections in the future ... the entire issue of balancing exploration and exploitation does not even arise in supervised and unsupervised learning, at least in the purest forms of these paradigms." Section 13.1: "to ensure exploration we generally require that the policy never becomes deterministic".
- Use in dive: for an LM, exploration is sampling (temperature above zero) plus whatever keeps the distribution from collapsing (F01-35). [MM]

**F01-15. Rollout temperatures in published RLHF runs: 1.0 in InstructGPT, 0.7 in Tulu 2 PPO.**
- Location: OUY22 Appendix C.4; IVI24 Appendix F.2.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, production report): "The PPO clip ratio is set to 0.2, and the sampling temperature is 1 for rollouts." IVI24 (Tier 3, production report): "We use a sampling temperature τ = 0.7 for rollout".
- Use in dive: exploration is a sampling knob the reader already knows from inference. [PR]

### B. Policy gradient, REINFORCE, baselines, GAE

**F01-16. REINFORCE: push up the log-probability of the action taken, scaled by the return that followed.**
- Location: SB Section 13.3, Eq. 13.8, p. 327. REINFORCE attributed to Williams 1992 (SB p. 327 and bibliographic note 13.3, p. 338 area).
- Verdict: NEW
- Evidence: SB (Tier 3, theory). "θt+1 = θt + α Gt ∇π(At|St, θt) / π(At|St, θt). (13.8) ... The vector is the direction in parameter space that most increases the probability of repeating the action At on future visits to state St. The update increases the parameter vector in this direction proportional to the return". Attribution: "REINFORCE is due to Williams (1987, 1992)."
- Use in dive: the core update in one sentence. [MM]

**F01-17. The log-derivative trick in one line: ∇θ E[R] = E[R ∇θ log πθ(y|x)], because ∇ log x = ∇x / x.**
- Location: SB Section 13.3, pp. 327-328; LM form in AHM24 Section 2.2, Eq. 6.
- Verdict: NEW
- Evidence: SB (Tier 3, theory). "the pseudocode uses the compact expression ∇ ln π(At|St, θt) for the fractional vector ∇π(At|St, θt)/π(At|St, θt) in (13.8). That these two expressions for the vector are equivalent follows from the identity ∇ ln x = ∇x/x." AHM24 Eq. 6 (quoted in F01-8).
- Use in dive: shows why no gradient flows through the sampler or the reward model: the reward is just a weight on a log-likelihood gradient. [MM]

**F01-18. REINFORCE is unbiased but noisy; the noise grows with horizon length.**
- Location: SB Section 13.3, p. 329; GAE Section 1.
- Verdict: NEW
- Evidence: SB (Tier 3, theory): "However, as a Monte Carlo method REINFORCE may be of high variance and thus produce slow learning." GAE (Tier 3, theory): "the variance of the gradient estimator scales unfavorably with the time horizon, since the effect of an action is confounded with the effects of past and future actions."
- Use in dive: motivates baselines and critics. [MM]

**F01-19. Subtracting a baseline that does not depend on the action leaves the gradient's expectation unchanged and can cut its variance a lot.**
- Location: SB Section 13.4, Eqs. 13.10-13.11, p. 329.
- Verdict: NEW
- Evidence: SB (Tier 3, theory/proof). "The baseline can be any function, even a random variable, as long as it does not vary with a; the equation remains valid because the subtracted quantity is zero ... In general, the baseline leaves the expected value of the update unchanged, but it can have a large effect on its variance."
- Use in dive: the reason "advantage" exists. [MM]

**F01-20. A critic is a learned baseline that also scores the next state; it lowers variance at the cost of bias.**
- Location: SB Section 13.5, p. 331.
- Verdict: NEW
- Evidence: SB (Tier 3, definition). "When the state-value function is used to assess actions in this way it is called a critic, and the overall policy-gradient method is termed an actor-critic method." Also: "the one-step return is often superior to the actual return in terms of its variance and computational congeniality, even though it introduces bias."
- Use in dive: names the "second model" in PPO. [MM]

**F01-21. GAE is one knob (λ) between the low-variance, biased TD residual (λ = 0) and the unbiased, high-variance full return (λ = 1).**
- Location: GAE Section 3, Eqs. 16-18.
- Verdict: NEW
- Evidence: GAE (Tier 3, theory). "GAE(γ, 0): Ât := δt = rt + γV(st+1) - V(st) (17) ... GAE(γ, 1): Ât := Σ γ^l δt+l = Σ γ^l rt+l - V(st) (18) ... GAE(γ, 1) is γ-just regardless of the accuracy of V, but it has high variance due to the sum of terms. GAE(γ, 0) is γ-just for V = Vπ,γ and otherwise induces bias, but it typically has much lower variance."
- Use in dive: one sentence, demoted to an ExpandableSection. [MM]

**F01-22. Settings used in LLM RLHF: γ = 1, λ = 0.95, in the papers and in TRL's defaults.**
- Location: STI20 Appendix B.1; OUY22 Appendix C.4; TRL112 `ppo_config.py` L264-L271.
- Verdict: NEW. Category B (paper settings match code defaults).
- Evidence: STI20 (Tier 3, production report): "We set γ = 1 and λ = 0.95 for the advantage estimation". OUY22: "No discount is applied when estimating the generalized advantage". TRL112 https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_config.py#L264-L271 (accessed 2026-10-16), Tier 1 code: `gamma` default `1.0`, `lam` default `0.95`. For contrast, GAE Section 6.3.1 (cart-pole, 21 seeds) found "the best results are obtained at intermediate values of the parameters: γ ∈ [0.96, 0.99] and λ ∈ [0.92, 0.99]."
- Use in dive: [PR] if the reader ever configures PPO.

**F01-23. With a strong pretrained policy, the bias GAE buys is not worth it: reward fell monotonically as λ decreased, and λ = 1 (plain policy gradient) did best.**
- Location: AHM24 Section 3.1, Figure 1.
- Verdict: NEW
- Evidence: AHM24 (Tier 3 ACL 2024, ablation; Llama-7B on Anthropic HH, author-reported). "We observe a monotonically decreasing reward with decreasing λ. This supports our hypothesis that reducing variance at the cost of bias in an RHLF setting needlessly introduces bias given the stable default properties of the environment." Reason given (Section 3): "strong initialization coupled with prompt conditioning leads to the concentration of probability mass on a few tokens at each generation step".
- Use in dive: the LLM case differs from robotics, where these tools were born. [MM]

**F01-24. A critic-free baseline can be built from other samples of the same prompt: RLOO uses the leave-one-out mean, GRPO the group mean.**
- Location: AHM24 Section 2.3; DSM24 Section 4.1.1.
- Verdict: NEW
- Evidence: AHM24 (Tier 3, definition): RLOO "uses the remaining k - 1 samples to create an unbiased estimate of the expected return for the prompt, akin to a parameter-free value-function, but estimated at each training step." DSM24 (Tier 3 preprint, definition): GRPO "obviates the need for additional value function approximation as in PPO, and instead uses the average reward of multiple sampled outputs, produced in response to the same question, as the baseline."
- Use in dive: a bridge to loops: sampling k answers and comparing them is exactly what a best-of-k loop does at inference time; RL turns that comparison into a gradient. [MM]

### C. PPO and the trust region

**F01-25. Taking many gradient steps on the plain policy-gradient loss with the same batch tends to wreck the policy.**
- Location: PPO Section 2.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1707.06347v2 (accessed 2026-10-16). Tier 3 preprint, author-reported. "While it is appealing to perform multiple steps of optimization on this loss LPG using the same trajectory, doing so is not well-justified, and empirically it often leads to destructively large policy updates".
- Use in dive: the reason PPO exists. [MM]

**F01-26. TRPO's answer is a trust region: maximise the surrogate subject to a KL limit between the new and old policy.**
- Location: TRPO Section 4, Eqs. 11-12; δ value in Section 8.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1502.05477v5 (accessed 2026-10-16). Tier 3 ICML 2015, theory. "In practice, if we used the penalty coefficient C recommended by the theory above, the step sizes would be very small. One way to take larger steps in a robust way is to use a constraint on the KL divergence between the new policy and the old policy, i.e., a trust region constraint". Section 8.1: "We used δ = 0.01 for all experiments."
- Use in dive: one paragraph of history, then straight to PPO. [MM]

**F01-27. PPO replaces the hard constraint with a clipped probability ratio; ε (0.2 suggested) sets how far one update may move any token's probability before the gradient stops rewarding it.**
- Location: PPO Section 3, Eqs. 6-7.
- Verdict: NEW
- Evidence: PPO (Tier 3 preprint, theory). "Let rt(θ) denote the probability ratio rt(θ) = πθ(at|st)/πθold(at|st)". "LCLIP(θ) = Êt[min(rt(θ)Ât, clip(rt(θ), 1 - ε, 1 + ε)Ât)] (7) where epsilon is a hyperparameter, say, ε = 0.2." The clip "removes the incentive for moving rt outside of the interval [1 - ε, 1 + ε] ... With this scheme, we only ignore the change in probability ratio when it would make the objective improve, and we include it when it makes the objective worse."
- Use in dive: the central PPO equation, explained as a per-token speed limit. [MM]

**F01-28. Two different leashes: PPO's ratio leash is to the policy that generated the batch (moves every iteration); the RLHF KL leash is to the fixed starting model.**
- Location: PPO Section 3 (ratio to πθold); GAO22 Section 3.6.
- Verdict: NEW
- Evidence: GAO22 https://arxiv.org/abs/2210.10760v1 (accessed 2026-10-16), Tier 3 ICML 2023, author analysis: "It is important to note that PPO's surrogate objective incorporates an implicit penalty on DKL(πold ‖ π), where πold is a recent policy (not the initial policy) ... This penalty is used to control how fast the policy changes, but also has an indirect effect on the KL we study here, DKL(π ‖ πinit), causing it to grow much more slowly".
- Use in dive: newcomers conflate these two; separating them is a mental model in itself. [MM]

**F01-29. In PPO's own ablation, clipping at ε = 0.2 scored best, and no clipping was worse than a random policy on one task.**
- Location: PPO Section 6.1, Table 1.
- Verdict: NEW
- Evidence: PPO (Tier 3 preprint, ablation; 7 MuJoCo tasks, 1M timesteps, 3 seeds each, normalised scores, author-reported). Table 1: "No clipping or penalty -0.39; Clipping, ε = 0.1 0.76; Clipping, ε = 0.2 0.82; Clipping, ε = 0.3 0.70; Adaptive KL dtarg = 0.01 0.74; Fixed KL, β = 3. 0.72". Text: "the score is negative for the setting without clipping or penalties, because for one environment (half cheetah) it leads to a very negative score".
- Use in dive: where ε = 0.2 comes from (robot control, not language). [PR]

**F01-30. PPO's full loss adds a value-function error term and an optional entropy bonus.**
- Location: PPO Section 5, Eq. 9.
- Verdict: NEW
- Evidence: PPO (Tier 3 preprint, definition). "LCLIP+VF+S t(θ) = Êt[LCLIP t(θ) - c1 LVF t(θ) + c2 S[πθ](st)], (9) where c1, c2 are coefficients, and S denotes an entropy bonus, and LVF t is a squared-error loss (Vθ(st) - Vtarg t)^2." Code-confirmed in TRL112 `ppo_trainer.py` L843-L847: `loss = pg_loss + args.vf_coef * vf_loss` with `torch.clamp(ratio, 1.0 - args.cliprange, 1.0 + args.cliprange)` (Category B).
- Use in dive: ExpandableSection only. [PR]

**F01-31. In LLM RLHF the clip rarely activates: under 5% of the time per batch in one study, and removing it did not hurt.**
- Location: AHM24 Section 3.2.
- Verdict: NEW
- Evidence: AHM24 (Tier 3 ACL 2024, ablation, author-reported; TL;DR and Anthropic HH with Llama and Pythia models). "We empirically found in our RLHF setting that the loss is actually clipped on average < 5% of the time per batch, throughout training across all dataset and base-model pairings, which indicates that the learning regime is close to being 'on-policy'". "If anything the removal of clipping gives a slight boost in performance".
- Use in dive: part of the "PPO machinery is optional for LLMs" debate (D3). [MM]

**F01-32. RLHF-style PPO needs up to four models in memory: policy, reference, critic, reward model.**
- Location: AHM24 Section 1; TRL112 `ppo_trainer.py` L489.
- Verdict: NEW. Category B.
- Evidence: AHM24 (Tier 3, author statement): "PPO typically requires loading up to 4 models simultaneously: the generator, the reference (for KL estimation), the critic, and the reward model". TRL112 https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_trainer.py#L489 (accessed 2026-10-16), Tier 1 code: `for module in [self.policy_model, self.ref_model, self.value_model, self.reward_model]:`.
- Use in dive: the memory budget picture for a systems reader. [PR]

**F01-33. The critic is usually a separate network of comparable size to the policy, which is a large memory and compute cost.**
- Location: STI20 Section 3.4; DSM24 Section 4.1.1.
- Verdict: NEW
- Evidence: STI20 (Tier 3, production report): "For the PPO value function, we use a Transformer with completely separate parameters from the policy. This prevents updates to the value function from partially destroying the pretrained policy early in training ... In our experiments, the reward model, policy, and value function are the same size." DSM24 (Tier 3 preprint): "As the value function employed in PPO is typically another model of comparable size as the policy model, it brings a substantial memory and computational burden."
- Use in dive: what GRPO and RLOO remove. [PR]

**F01-34. "The critic must be as large as the policy" is not a rule: InstructGPT used one 6B reward model and one 6B value function for 1.3B, 6B and 175B policies.**
- Location: OUY22 Appendix C.2 and C.4.
- Verdict: WRONG if stated as a requirement. What is true: same-size critics are common (F01-33), and InstructGPT shows a 6B critic driving a 175B policy.
- Evidence: OUY22 (Tier 3, production report). "As previously mentioned, for all PPO models we use a 6B RM and a 6B value function, and the latter is initialized from the former." C.2: 175B RMs "training was more unstable which made them less suitable for use as initializations for the PPO value functions, and (2) using a 175B RM and value function greatly increase the compute requirements of PPO."
- Use in dive: preserves the scope of the "second model of similar size" shorthand. [PR]

### D. KL regularisation to a reference model

**F01-35. The per-token KL penalty keeps the policy where the reward model is valid and acts as an entropy bonus; in style tasks it is part of the task definition.**
- Location: ZIE19 Section 2, Eq. 2; STI20 Section 3.4.
- Verdict: NEW
- Evidence: ZIE19 (Tier 3 preprint, definition): "R(x, y) = r(x, y) - β log π(y|x)/ρ(y|x). (2) ... This term has several purposes: it plays the role of an entropy bonus, it prevents the policy from moving too far from the range where r is valid, and in the case of our style continuation tasks it also is an important part of the task definition". STI20: "This KL term serves two purposes. First, it acts as an entropy bonus, encouraging the policy to explore and deterring it from collapsing to a single mode. Second, it ensures the policy doesn't learn to produce outputs that are too different from those that the reward model has seen during training."
- Use in dive: what the leash prevents. [MM]

**F01-36. Without the KL leash, the policy maximises a sentiment reward with gibberish.**
- Location: ZIE19 Table 10 caption.
- Verdict: NEW
- Evidence: ZIE19 (Tier 3 preprint, ablation with samples). "Samples from a model fine-tuned to mock sentiment without a KL penalty. Without regularization towards natural language, the results are gibberish even if we include an entropy bonus (targeting 30 nats). Both policies reach a mean score of around +8.0 according to the mock sentiment model (i.e. 99.97% positive)." Sample row: "These These These sound flowed instantly easily easily easily easily!"
- Use in dive: the clearest single illustration of reward hacking. [MM]

**F01-37. InstructGPT's RL objective: reward minus a per-token KL to the SFT model, plus an optional pretraining term; β = 0.02, γ = 27.8.**
- Location: OUY22 Section 3.5, Eq. 2; Appendix C.4.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, definition and production report). "objective(φ) = E(x,y)∼DπRL [rθ(x, y) - β log(πRL φ(y|x)/πSFT(y|x))] + γ Ex∼Dpretrain [log(πRL φ(x))] (2)". "we add a per-token KL penalty from the SFT model at each token to mitigate over-optimization of the reward model." C.4: "with β = 0.02 (see Equation 2)"; "We multiply the pretraining gradients by a coefficient, γ = 27.8".
- Use in dive: the reference model is the SFT model, the starting point of RL, rather than the pretrained base. [PR]

**F01-38. Published KL coefficients cluster between 0.02 and 0.05 for PPO-style RLHF, with exceptions worth knowing.**
- Location: STI20 App. B.1 (0.05); OUY22 App. C.4 (0.02); IVI24 App. F.2 (0.05, and 0.0325 with 70B reward models); DSM24 Section 4.2 (0.04, applied in the loss); TRL112 `ppo_config.py` L239-L241 (0.05); GAO22 Section 2 (0 for most runs).
- Verdict: NEW
- Evidence: STI20: "We used a KL coefficient of 0.05 for both of the main runs". IVI24: "a fixed KL penalty coefficient β = 0.05 ... for runs using larger reward models, we use a KL penalty of β = 0.0325 instead of β = 0.05. This is in line with prior work suggesting that improved reward models are more difficult to overoptimize against". DSM24: "The KL coefficient is 0.04." and "instead of adding KL penalty in the reward, GRPO regularizes by directly adding the KL divergence between the trained policy and the reference policy to the loss". TRL112 https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_config.py#L239-L241 (accessed 2026-10-16): `kl_coef` default `0.05`. GAO22: "KL penalty for all RL experiments is set to 0 except for in section 3.6."
- Use in dive: a small table in an ExpandableSection. [PR]

**F01-39. In current TRL the KL leash is off by default for GRPO (β = 0.0, reference model not even loaded) and on for RLOO (β = 0.05).**
- Location: TRL116 `grpo_config.py` L681-L688; `rloo_config.py` L502-L507.
- Verdict: NEW. Category C (code-derived; the help strings document it).
- Evidence: https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/grpo_config.py#L681-L688 (accessed 2026-10-16), Tier 1 code: `beta` default `0.0`, help "KL coefficient. If `0.0` (default), the reference model is not loaded, reducing memory usage and improving training speed." The same help cites DeepSeek-R1 using `0.001`. https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/rloo_config.py#L502-L507 (accessed 2026-10-16): `beta` default `0.05`.
- Use in dive: a reader who assumes "RL means KL to a reference" will be wrong on the default GRPO path. [PR]

**F01-40. A bigger KL coefficient does not preserve general capability on its own: InstructGPT raised it 100x and the NLP regressions remained; mixing in pretraining data fixed them.**
- Location: OUY22 Appendix E.6, Figure 34.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, ablation on the 1.3B model, author-reported). "We find that even by increasing the KL reward coefficient to 2.0, which is 100 times of the default value, the regressions still cannot be fixed. As expected, too large KL reward coefficient causes a significant drop in the validation reward. This result demonstrates that pretraining data distribution is critical for fixing the regressions".
- Use in dive: the "alignment tax" and what the leash does and does not protect. [MM][PR]

**F01-41. In a controlled study, the KL penalty acted like early stopping: it did not improve the gold-reward vs KL frontier.**
- Location: GAO22 Section 3.6, Figure 9.
- Verdict: NEW (one side of debate D1).
- Evidence: GAO22 (Tier 3 ICML 2023, ablation in a synthetic setup). "The KL penalty only causes the gold RM score to converge earlier, but does not affect the KLRL-gold reward frontier, and so the effect of the penalty on the gold score is akin to early stopping (Figure 14). However, we have seen some evidence that this result could be particularly sensitive to hyperparameters."
- Use in dive: preserves the hedge; the leash measures distance more than it prevents hacking. [MM]

**F01-42. The KL that shows up in training logs is a per-sample estimate; the simple k1 estimator is unbiased but often negative, k3 is unbiased with lower variance, and TRL's PPO offered both with k1 as default.**
- Location: TRL112 `ppo_trainer.py` L771-L774 and `ppo_config.py` L243-L251; SCH20.
- Verdict: NEW. Category B (blog definition and code agree).
- Evidence: TRL112 code: `logr = ref_logprobs - logprobs` (L773); `kl = -logr if args.kl_estimator == "k1" else (logr.exp() - 1) - logr` (L774). SCH20 http://joschu.net/blog/kl-approx.html (accessed 2026-10-16), Tier 2: k1 "has high-variance, as it's negative for half of the samples, whereas KL is always positive"; on k3: "k3 has even lower standard deviation than k2 while being unbiased, so it appears to be a strictly better estimator."
- Use in dive: reading a KL curve correctly. [PR]

**F01-43. Updating the reference model as an exponential moving average was one of three factors that made PPO beat DPO in one study.**
- Location: XU24 Section 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2404.10719v3 (accessed 2026-10-16). Tier 3 ICML 2024, ablation, author-reported. "using the exponential moving average for the reference model also brings additional benefits. The intuition behind this is that while the main LLM of PPO is rapidly changing, the reference model should also be updated accordingly."
- Use in dive: the reference model is a design choice, not a constant. [PR]

### E. The RLHF pipeline and reward models

**F01-44. Reward models are fitted to pairwise preferences with the Bradley-Terry model: the reward difference is the log-odds that one output is preferred.**
- Location: CHR17 Section 2.2.3, Eq. 1; STI20 Section 3.4; OUY22 Section 3.5, Eq. 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1706.03741v4 (accessed 2026-10-16), Tier 3 NeurIPS 2017, definition: "This follows the Bradley-Terry model (Bradley and Terry, 1952) for estimating score functions from pairwise preferences ... Just as the difference in Elo points of two chess players estimates the probability of one player defeating the other in a game of chess, the difference in predicted reward of two trajectory segments estimates the probability that one is chosen over the other by the human." OUY22 Eq. 1: "loss(θ) = -1/(K choose 2) E(x,yw,yl)∼D [log(σ(rθ(x, yw) - rθ(x, yl)))]"; describing STI20: "the difference in rewards represents the log odds that one response will be preferred to the other by a human labeler."
- Use in dive: the Elo analogy is the fastest way in. [MM]

**F01-45. Preference-based reward learning was sample-efficient from the start: feedback on under 1% of agent interactions, about an hour of human time.**
- Location: CHR17 Abstract.
- Verdict: NEW
- Evidence: CHR17 (Tier 3, benchmark claim on Atari and simulated robotics, author-reported). "providing feedback on less than 1% of our agent's interactions with the environment ... we show that we can successfully train complex novel behaviors with about an hour of human time."
- Use in dive: why a learned reward model changed the economics. [MM]

**F01-46. The three-step pipeline: SFT on demonstrations, reward model on comparisons, PPO against the reward model; steps 2 and 3 can iterate.**
- Location: OUY22 Section 3.1.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, production report). "Step 1: Collect demonstration data, and train a supervised policy ... Step 2: Collect comparison data, and train a reward model ... Step 3: Optimize a policy against the reward model using PPO ... Steps 2 and 3 can be iterated continuously; more comparison data is collected on the current best policy".
- Use in dive: the canonical diagram. [MM]

**F01-47. Humans enter RLHF only through demonstrations and the reward model; the RL phase itself uses prompts with no human labels.**
- Location: OUY22 Section 3.2.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, production report). "(3) our PPO dataset, without any human labels, which are used as inputs for RLHF fine-tuning."
- Use in dive: the reward model is the human proxy that runs at RL time; this is the slot an AI judge later fills (F01-63 to F01-68). [MM]

**F01-48. InstructGPT dataset sizes are prompt counts: about 13k SFT, 33k RM and 31k PPO training prompts, from about 40 contractors.**
- Location: OUY22 Section 3.2, Table 6; Section 3.4.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, production report). "The SFT dataset contains about 13k training prompts (from the API and labeler-written), the RM dataset has 33k training prompts (from the API and labeler-written), and the PPO dataset has 31k training prompts (only from the API)." Table 6 RM train: labeler 6,623 plus customer 26,584. Section 3.4: "we hired a team of about 40 contractors on Upwork and through ScaleAI."
- Use in dive: scale of human effort behind a famous result. [PR]

**F01-49. "InstructGPT's reward model was trained on 33k comparisons" misreads the paper: 33k is the prompt count, and each prompt yields up to K choose 2 comparisons with K between 4 and 9.**
- Location: OUY22 Section 3.5; Appendix A.3 text under Table 6; Appendix C.2.
- Verdict: WRONG as phrased (how often the misreading appears was not measured: [SPECULATIVE]). What is true: about 33k RM training prompts; ranked pairs "an order of magnitude larger"; no exact pair count is given (see U8).
- Evidence: OUY22 (Tier 3). "we present labelers with anywhere between K = 4 and K = 9 responses to rank. This produces (K choose 2) comparisons for each prompt". Appendix: "the number of ranked pairs we trained the model on is an order of magnitude larger than the number of prompts." C.2: "a single batch could contain up to 64 × (K choose 2) ≤ 2,304 comparisons."
- Use in dive: [PR] for anyone budgeting labels.

**F01-50. InstructGPT's headline: the 1.3B model's outputs were preferred to 175B GPT-3's; 175B InstructGPT was preferred 85 ± 3% of the time.**
- Location: OUY22 Abstract; Section 1; Section 3.4 (agreement).
- Verdict: NEW
- Evidence: OUY22 (Tier 3, benchmark claim on the authors' API prompt distribution, human raters). "In human evaluations on our prompt distribution, outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer parameters." Section 1: "Outputs from our 175B InstructGPT are preferred to 175B GPT-3 outputs 85 ± 3% of the time, and preferred 71 ± 4% of the time to few-shot 175B GPT-3." Section 3.4: "training labelers agree with each-other 72.6 ± 1.5% of the time".
- Use in dive: the motivating number; keep the "on our prompt distribution" scope. [MM]

**F01-51. Summarisation precedent: a 1.3B human-feedback policy beat a supervised model ten times its size, 61% vs 43% preference against reference summaries.**
- Location: STI20 Section 4.1; Section 1 (dataset).
- Verdict: NEW
- Evidence: STI20 (Tier 3 NeurIPS 2020, benchmark claim, human raters, TL;DR). "our 1.3B human feedback model significantly outperforming a supervised model 10× its size (61% versus 43% raw preference score against reference summaries)." "after controlling for length (Appendix F), the preference of our human feedback models vs. reference summaries drops by ~5%". Dataset: "64,832 summary comparisons on the TL;DR dataset".
- Use in dive: second data point, with the length confound named. [MM]

**F01-52. RLHF post-training costs a small fraction of pretraining compute: 60 petaflop/s-days for 175B PPO-ptx against 3,640 for GPT-3.**
- Location: OUY22 Section 5.1; STI20 Section 5.
- Verdict: NEW
- Evidence: OUY22 (Tier 3, production report). "training our 175B SFT model requires 4.9 petaflops/s-days and training our 175B PPO-ptx model requires 60 petaflops/s-days, compared to 3,640 petaflops/s-days for GPT-3". STI20: "fine-tuning our 6.7B model with RL required approximately 320 GPU-days."
- Use in dive: budget framing for a compute lead. [PR]

**F01-53. PPO training is dominated by generation: rollouts took more than 95% of total training time in one 13B study.**
- Location: IVI24 Appendix G.
- Verdict: NEW
- Evidence: IVI24 (Tier 3, production report, Tulu 2 13B on TPUv3). "Rollout (i.e., generating online responses from the policy) is the most time-consuming step in PPO, taking up more than 95% of the total training time." Appendix G also: increasing prompt batch 8x "reduces the training time by 5x (60 hours → 12 hours), while also decreasing the overall performance by 0.6% (61.7% → 61.1%)".
- Use in dive: RL training is an inference workload with a backward pass attached; this is the reader's home turf. [MM][PR]

**F01-54. Optimising against a learned reward model first improves real quality, then degrades it until the reward model is anti-correlated with humans.**
- Location: STI20 Section 4.3, Figure 5.
- Verdict: NEW
- Evidence: STI20 (Tier 3, ablation over KL coefficients, human raters). "Under light optimization, the models improve (according to labelers). However, as we optimize further, true preferences fall off compared to the prediction, and eventually the reward model becomes anti-correlated with human preferences."
- Use in dive: Goodhart in one curve. [MM]

**F01-55. The over-optimisation curve has a predictable shape in √KL: gold reward is d(α - βd) for best-of-n and d(α - β log d) for RL, with coefficients that scale smoothly with reward-model size.**
- Location: GAO22 Section 1 (functional forms and findings), Section 2.1 (setup).
- Verdict: NEW
- Evidence: GAO22 (Tier 3 ICML 2023, benchmark/scaling study in a synthetic setup: 6B gold RM, proxy RMs 3M to 3B, 1.2B policy for the RM-size sweep). "we will define d := √DKL(π ‖ πinit) ... for best-of-n (BoN) sampling, Rbon(d) = d(αbon - βbon d), and for reinforcement learning, RRL(d) = d(αRL - βRL log d)". "As a function of the KL divergence, reinforcement learning tends to be slower than best-of-n sampling at both optimization and overoptimization." "The 6B reward model from Ouyang et al. [2022] is used as the gold RM, and our proxy RMs vary from 3M to 3B parameters".
- Use in dive: the strongest number-shaped mental model in this area; it applies to best-of-n loops too. [MM]

**F01-56. Best-of-n at inference time is also optimisation against the reward model, and its KL from the base policy is log n - (n - 1)/n.**
- Location: GAO22 Section 2 (citing STI20 Appendix G.3).
- Verdict: NEW. The formula is quoted from GAO22; this research did not re-derive it from STI20 Appendix G.3 (see U9).
- Evidence: GAO22 (Tier 3). "In BoN, we generate n trajectories for the policy and use the reward model to pick the one with the highest proxy RM score ... The KL distances for BoN are computed analytically: KLbon = log n - (n-1)/n [Stiennon et al., 2020, Appendix G.3]."
- Use in dive: the first quantitative link between "a loop that samples and picks" and "RL that moves the weights". For n = 16 the formula gives about 2.83 - 0.94 = 1.8 nats [SPECULATIVE: own arithmetic from the quoted formula]. [MM][PR]

**F01-57. Retraining the reward model on fresh policy samples (online) beat a reward model trained only on the initial model's samples (offline) for summarisation; and a policy can win by exploiting how labelers judge.**
- Location: ZIE19 Section 1 and Abstract.
- Verdict: NEW
- Evidence: ZIE19 (Tier 3 preprint, ablation, human raters). "For the TL;DR dataset, human labelers preferred the policy trained with online data collection 71% of the time". Abstract: "models trained with 60,000 comparisons copy whole sentences from the input but skip irrelevant preamble; this leads to reasonable ROUGE scores and very good performance according to our human labelers, but may be exploiting the fact that labelers rely on simple heuristics."
- Use in dive: reward models go stale as the policy moves; the same staleness hits any fixed judge. [MM]

### F. Preference optimisation without RL: DPO and relatives

**F01-58. The KL-regularised RLHF objective has a closed-form optimum: the reference policy reweighted by exp(reward / β).**
- Location: DPO23 Section 3, Eq. 3; Section 4, Eq. 4; Appendix A.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.18290v3 (accessed 2026-10-16). Tier 3 NeurIPS 2023, theory. Objective: "max πθ E x∼D, y∼πθ(y|x) [rϕ(x, y)] - β DKL[πθ(y|x) ‖ πref(y|x)] (3)". Optimum: "πr(y|x) = 1/Z(x) πref(y|x) exp(1/β r(x, y)), (4) where Z(x) = Σy πref(y|x) exp(1/β r(x, y)) is the partition function."
- Use in dive: makes "what RLHF is trying to reach" concrete: a reweighting of what the starting model already says. [MM]

**F01-59. DPO's insight: invert that relation so the reward is β log(π/πref), the partition function cancels in Bradley-Terry, and the policy becomes its own reward model, trained with a classification loss.**
- Location: DPO23 Section 4, Eqs. 5-7.
- Verdict: NEW
- Evidence: DPO23 (Tier 3, theory). "r(x, y) = β log πr(y|x)/πref(y|x) + β log Z(x). (5)" "Substituting the reparameterization in Eq. 5 for r*(x, y) into the preference model Eq. 1, the partition function cancels". "LDPO(πθ; πref) = -E(x,yw,yl)∼D [log σ(β log πθ(yw|x)/πref(yw|x) - β log πθ(yl|x)/πref(yl|x))]. (7)" "In essence, the policy network represents both the language model and the (implicit) reward."
- Use in dive: the second core equation of the dive. [MM]

**F01-60. The DPO gradient raises the chosen response, lowers the rejected one, and weights each pair by how wrongly the implicit reward currently orders it; without that weight the model degenerates.**
- Location: DPO23 Section 4, "What does the DPO update do?"; Appendix Table 3.
- Verdict: NEW
- Evidence: DPO23 (Tier 3, theory plus ablation). "the examples are weighed by how much higher the implicit reward model r̂θ rates the dispreferred completions, scaled by β ... Our experiments suggest the importance of this weighting, as a naïve version of this method without the weighting coefficient can cause the language model to degenerate (Appendix Table 3)."
- Use in dive: DPO is still a weighted log-likelihood update (ties to F01-70). [MM]

**F01-61. DPO removes the separate reward model, sampling during training, and the critic or baseline.**
- Location: DPO23 Abstract; Section 5.2.
- Verdict: NEW
- Evidence: DPO23 (Tier 3). Abstract: DPO is "computationally lightweight, eliminating the need for sampling from the LM during fine-tuning or performing significant hyperparameter tuning." Section 5.2: "In contrast the DPO reparameterization yields a reward function that does not require any baselines."
- Use in dive: the "what it removes" column. [PR]

**F01-62. "DPO removes the reference model" is wrong: the loss needs reference log-probabilities for every pair. TRL can precompute them once so the reference need not stay in memory. ORPO and SimPO are the methods that drop it.**
- Location: DPO23 Eq. 7; TRL116 `dpo_trainer.py` L1349-L1351, `dpo_config.py` L227-L233; ORPO24 Section 4, Eq. 6; SIMPO24 Section 2.2.
- Verdict: WRONG as phrased. Category B for the TRL part.
- Evidence: TRL116 https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/dpo_trainer.py#L1349-L1351 (accessed 2026-10-16), Tier 1 code: `chosen_logratios = chosen_logps - ref_chosen_logps`, `rejected_logratios = rejected_logps - ref_rejected_logps`. https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/dpo_config.py#L227-L233 (accessed 2026-10-16): `precompute_ref_log_probs` default `False`, help "This allows to save memory during training, as the reference model does not need to be kept in memory." Default `beta` 0.1 at L297-L298; the default loss at L1387-L1388 is `-F.logsigmoid(self.beta * delta_score)`, matching DPO23 Eq. 7.
- Use in dive: memory planning for DPO runs. [PR]

**F01-63. DPO is offline: it learns from a fixed preference dataset, so it cannot explore responses outside that data.**
- Location: DPO23 Section 4 "DPO outline"; IVI24 Section 2.1.
- Verdict: NEW
- Evidence: DPO23: "Sample completions y1, y2 ∼ πref(·|x) for every prompt x, label with human preferences to construct the offline dataset of preferences ... In practice, one would like to reuse preference datasets publicly available". IVI24 (Tier 3): "PPO trains on online data generated by the current policy, while DPO trains on static, pre-generated offline data. This may limit exploration in DPO and thus hurt the training quality."
- Use in dive: what DPO gives up. [MM]

**F01-64. DPO's original evidence: sentiment control, TL;DR summarisation and single-turn dialogue, models up to 6B, GPT-4 as the judge for the latter two; the authors list out-of-distribution generalisation and over-optimisation as open questions.**
- Location: DPO23 Section 6; Section 6.4; Section 7.
- Verdict: NEW
- Evidence: DPO23 (Tier 3, benchmark claim, author-reported). "we evaluate algorithms with their win rate against a baseline policy, using GPT-4 as a proxy for human evaluation". Section 6.4: GPT-4 agreement with humans is "about as often as humans agree with each other". Section 7: "How does the DPO policy generalize out of distribution, compared with learning from an explicit reward function? ... how does reward over-optimization manifest in the direct preference optimization setting ... while we evaluate models up to 6B parameters". App. B: "we use a β = 0.1 ... For TL;DR summarization, we use β = 0.5".
- Use in dive: preserves the scope of "DPO matches PPO". [MM]

**F01-65. IPO's argument: with near-deterministic preferences, DPO's KL regularisation weakens toward nothing and the policy can overfit; an explicit reward model escapes this because it underfits. Evidence is theory plus small bandit examples.**
- Location: IPO23 Section 4.2; Section 5.3; Conclusion.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.12036v2 (accessed 2026-10-16). Tier 3 AISTATS 2024, theory plus toy experiments. "the strength of the KL-regularisation becomes weaker and weaker the more deterministic the preferences." "DPO, in avoiding the training of the reward function, loses the regularisation of the policy that the underfitted reward function affords." Conclusion: "Those minimal experiments are sufficient to prove that IPO is better suited to learn from sampled preferences than DPO. Future works should scale those experiments to more complex settings such as training language models on human preferences data."
- Use in dive: one paragraph in the DPO family block; label the evidence as theoretical. [MM]

**F01-66. TRL's IPO loss length-normalises the log-ratios, a detail the IPO paper does not state; TRL says it confirmed the choice with the authors.**
- Location: TRL116 `dpo_trainer.py` L1393-L1404.
- Verdict: NEW. Category D (paper and code differ in what is written down; code comment reports author confirmation).
- Evidence: https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/dpo_trainer.py#L1393-L1404 (accessed 2026-10-16), Tier 1 code: "We therefore normalize by the number of completion tokens (average per token) to make β/loss comparable across variable lengths. This length normalization is not explicitly discussed in the IPO paper; we confirmed this choice with the IPO authors, and the results reported in the paper correspond to this normalized form." `per_sequence_loss = (ipo_delta - 1 / (2 * self.beta)) ** 2`.
- Use in dive: [PR] only if the dive shows IPO settings; otherwise cut.

**F01-67. KTO learns from a per-example thumbs-up or thumbs-down instead of pairs, and reports matching or beating DPO from 1B to 30B.**
- Location: KTO24 Abstract; Section 1 contributions.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2402.01306v5 (accessed 2026-10-16). Tier 3 ICML 2024, benchmark claim (author-reported; GPT-4-judged win rates and closed-ended tasks). "it matches or exceeds the performance of preference-based methods at scales from 1B to 30B, despite only learning from a binary signal of whether an output is desirable." Contributions: "KTO can handle extreme data imbalances, matching DPO performance while using up to 90% fewer desirable examples"; "When the pretrained model is sufficiently good, one can skip supervised finetuning (SFT) and go straight to KTO without a loss in generation quality, whereas SFT is always needed for best results with DPO."
- Use in dive: a binary signal is what a test suite or a pass/fail check produces. [MM][PR]

**F01-68. ORPO folds preference learning into SFT with an odds-ratio term and no reference model.**
- Location: ORPO24 Section 4, Eq. 6; Abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2403.07691v2 (accessed 2026-10-16). Tier 3 EMNLP 2024, definition plus benchmark claim (author-reported). "LORPO = E(x,yw,yl)[LSFT + λ · LOR] (6)". Abstract: "reference model-free monolithic odds ratio preference optimization algorithm, ORPO, eliminating the necessity for an additional preference alignment phase ... fine-tuning Phi-2 (2.7B), Llama-2 (7B), and Mistral (7B) with ORPO on the UltraFeedback alone ... achieving up to 12.20% on AlpacaEval2.0 ... 66.19% on IFEval (instruction-level loose, Table 6), and 7.32 in MT-Bench".
- Use in dive: one row in a family table. [PR]

**F01-69. SimPO uses the length-normalised log-probability as the reward, adds a margin, and drops the reference model; it reports that DPO-trained models order only about half of training pairs correctly by average likelihood.**
- Location: SIMPO24 Section 2.2, Eqs. 3-4; Section 2.3, Eqs. 5-6; Abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2405.14734v3 (accessed 2026-10-16). Tier 3 NeurIPS 2024, definition plus benchmark claim (author-reported). "rSimPO(x, y) = β/|y| log πθ(y|x)". "In our experiments, we observed that only ∼ 50% of the triples from the training set satisfy this condition when trained with DPO (Figure 4b)." Abstract: "SimPO outperforms DPO by up to 6.4 points on AlpacaEval 2 and by up to 7.5 points on Arena-Hard." Section 2.3 heading text: "Although SimPO does not impose KL regularization".
- Use in dive: one row in the family table; the training-versus-generation mismatch is the mental-model nugget. [MM]

**F01-70. Every post-training method is one gradient shape, a coefficient times ∇ log π of some tokens; methods differ only in where the data comes from, what scores it, and how the score becomes the coefficient.**
- Location: DSM24 Section 5.2.1, Eq. 5, Table 10.
- Verdict: NEW
- Evidence: DSM24 (Tier 3 preprint, theory/framework). "the gradient with respect to the parameter θ of a training method can be written as: ∇θ JA(θ) = E[(q, o) ∼ D] (1/|o| Σt GCA(q, o, t, πrf) ∇θ log πθ(ot|q, o<t)). (5) There exist three key components: 1) Data Source D, which determines the training data; 2) Reward Function πrf, which is the source of the training reward signal; 3) Algorithm A: which processes the training data and the reward signal to the gradient coefficient GC". Table 10 lists SFT (data from the SFT set, coefficient 1), RFT and DPO (samples from πsft), Online RFT, PPO and GRPO (samples from πθ).
- Use in dive: the unifying frame for the whole foundation section. [MM]

**F01-71. Data source alone made a large difference: rejection-sampling fine-tuning on the live policy's samples (online) significantly beat the same method on the initial model's samples (offline).**
- Location: DSM24 Section 5.2.1, "Observation about Data Source", Figure 5.
- Verdict: NEW
- Evidence: DSM24 (Tier 3 preprint, ablation on GSM8K and MATH, author-reported). "we find that the Online RFT significantly outperforms RFT on two benchmarks. Specifically, Online RFT is comparable to RFT in the early stage of training but gains an absolute advantage in the later stage, demonstrating the superiority of online training."
- Use in dive: the on-policy axis isolated from everything else. [MM]

### G. DPO versus PPO: what the comparisons show

**F01-72. Theory: every policy PPO can reach also minimises the DPO loss, but DPO can also reach policies that exploit responses absent from the data. Experiments: PPO beat DPO in all the authors' testbeds, including code contests.**
- Location: XU24 Section 4.1, Theorem 4.1; Section 1; Section 6, Table 8.
- Verdict: NEW
- Evidence: XU24 (Tier 3 ICML 2024; theory/proof plus benchmark claims, author-reported). Theorem 4.1: "ΠPPO is a proper subset of ΠDPO." "DPO might discover solutions exploiting out-of-distribution data, posing a risk of deviating excessively from the reference policy". Section 1: "our PPO model with 34B parameters outperforms AlphaCode-41B ... exhibiting a 10@1k improvement from 16.4% to 22.4%." Key PPO factors: "advantage normalization, large batch size, and exponential moving average update for the reference model."
- Use in dive: one side of debate D2. [MM]

**F01-73. In a controlled 13B comparison, data quality mattered most; PPO beat DPO by about 0.7 points on average (up to 2.5 in math) and cost roughly 8x the wall-clock.**
- Location: IVI24 Abstract; Table 2; Appendix K.
- Verdict: NEW
- Evidence: IVI24 (Tier 3 NeurIPS 2024, ablation/benchmark on Tulu 2 13B, author-reported). "better preference data leading to the largest improvements, followed by the choice of learning algorithm, the use of improved reward models, and finally the use of additional unlabeled prompts for policy training. Notably, PPO outperforms DPO by up to 2.5% in math and 1.2% in general domains." Table 2: "PPO outperforms DPO by an average of 0.7 points". Appendix K: "PPO training with a 13B reward model and 13B policy on the UltraFeedback set takes 3 days on a 256-size pod, with the reward model training taking roughly 10 hours to train. DPO training on UltraFeedback (roughly 60,000 samples) for a 13B model takes 9 hours." (The 8x is [SPECULATIVE: own arithmetic, 72 h vs 9 h, excluding RM training].)
- Use in dive: the "how to choose" section: the gap is real but small next to data quality, and the cost gap is large. [PR]

**F01-74. A working PPO recipe has many small, consequential choices: value model initialised from the reward model, a fixed negative reward for truncated outputs, advantage whitening, a fixed KL coefficient, one epoch.**
- Location: IVI24 Appendix F.2.
- Verdict: NEW
- Evidence: IVI24 (Tier 3, production report). "We initialize the value model from the reward model. This follows from InstructGPT"; "For truncated completions, we set the reward to a large negative number (e.g., -10.0), which is referred to as the EOS trick"; "We do whiten the step-level advantages within each batch"; "We use a fixed KL penalty coefficient. The original PPO algorithm [44] has an adaptive KL controller, but most recent implementations have moved away from this"; "training beyond 1 epoch did not yield improved performance and occasionally resulted in the training collapsing entirely".
- Use in dive: ExpandableSection for practitioners; explains why PPO results vary across papers. [PR]

**F01-75. Simpler REINFORCE-style methods (vanilla policy gradient and RLOO) beat PPO, DPO and RAFT in one study, attributed to the strong pretrained starting point.**
- Location: AHM24 Abstract; Section 1 contributions.
- Verdict: NEW
- Evidence: AHM24 (Tier 3 ACL 2024, benchmark claim, author-reported). "we show that many components of PPO are unnecessary in an RLHF context and that far simpler REINFORCE-style optimization variants outperform both PPO and newly proposed 'RL-free' methods such as DPO and RAFT."
- Use in dive: debate D3. [MM]

**F01-76. TRL, Hugging Face's post-training library, removed PPOTrainer in v1.13.0; `from trl import PPOTrainer` had already stopped working in v1.10.**
- Location: TRL113 release notes "Breaking: PPO is removed"; repository trees at v1.12.0 (has `trl/experimental/ppo/`) and v1.13.0 (does not).
- Verdict: NEW. Category B (release notes and tree agree).
- Evidence: https://github.com/huggingface/trl/releases/tag/v1.13.0 (accessed 2026-10-16), Tier 1 docs: "`PPOTrainer`, `PPOConfig`, and `modeling_value_head.py` ... are gone". "Why now: unmaintained (no feature work in over a year ...), the only trainer never aligned on the input format ..., near-zero recorded usage ... `from trl import PPOTrainer` already stopped working in v1.10". Tree check: https://github.com/huggingface/trl/tree/v1.12.0/trl/experimental/ppo exists; https://github.com/huggingface/trl/tree/v1.13.0/trl/experimental has no `ppo` entry (also absent at v1.16.0). Trainers present at v1.16.0 in `trl/trainer/`: dpo, grpo, kto, reward, rloo, among others.
- Use in dive: [PR] "if you want classic PPO you are pinning an old library or using another framework"; also a signal (not proof) of where open-source practice went.

### H. AI feedback: the first bridge from words to weights

**F01-77. Constitutional AI has two stages: the model critiques and revises its own answers in text, then is fine-tuned on the revisions (SL-CAI); then AI preference labels train a preference model for RL (RL-CAI).**
- Location: CAI22 Section 1.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2212.08073v1 (accessed 2026-10-16). Tier 3 preprint, method description. "We then ask the model to critique its response according to a principle in the constitution, and then revise the original response in light of the critique ... we finetune a pretrained language model with supervised learning on the final revised responses. The main purpose of this phase is to easily and flexibly alter the distribution of the model's responses, to reduce the need for exploration and the total length of training during the second RL phase." RL stage: "This stage mimics RLHF, except that we replace human preferences for harmlessness with 'AI feedback' (i.e. we perform 'RLAIF')".
- Use in dive: the critique-revise loop is a text loop with a frozen model; CAI then distils its output into weights. This is the hinge of the whole dive. [MM]

**F01-78. The critique-revision loop is plain prompting: a critique request, a sampled critique, a revision request, a sampled revision; it can repeat.**
- Location: CAI22 Section 3.1.
- Verdict: NEW
- Evidence: CAI22 (Tier 3, method with example). "Critique Request: Identify specific ways in which the assistant's last response is harmful, unethical, racist, sexist, toxic, dangerous, or illegal." "Revision Request: Please rewrite the assistant response to remove any and all harmful, unethical, racist, sexist, toxic, dangerous, or illegal content." "we can apply the same critique-revision pipeline multiple times, giving us a sequence of revisions."
- Use in dive: a concrete example the reader can map onto their own agent loops. [MM]

**F01-79. In RL-CAI the AI's judgement becomes a number: the feedback model answers a multiple-choice question, and the normalised log-probabilities of (A) and (B) become the preference target.**
- Location: CAI22 Section 4.1.
- Verdict: NEW
- Evidence: CAI22 (Tier 3, method). "We then compute the log probability of the responses (A) and (B), and we make a labeled, preference modeling comparison example with the normalized probabilities as targets". "we wrote a set of 16 different principles, and randomly sampled a principle for each comparison label. Qualitatively, we found that ensembling over principles led to notably more robust PM behavior".
- Use in dive: words go in, a probability comes out, a scalar reward reaches the weights. [MM]

**F01-80. Chain-of-thought judges are overconfident as labelers; CAI clamped their probabilities to 40-60% to stop the policy learning extreme responses.**
- Location: CAI22 Section 4.1, "Chain-of-Thought Prompting".
- Verdict: NEW
- Evidence: CAI22 (Tier 3, ablation, qualitative). "the CoT samples typically state explicitly which multiple choice option is to be preferred, and so the probability targets are typically very confident (i.e., close to 0 or 1) and are not well-calibrated. We found that clamping the CoT probabilities to lie within the 40-60 percent range led to better and more robust behavior ... without the clamping, RL-CAI models would learn to output more extreme responses."
- Use in dive: an LLM judge's confidence is itself a reward-shaping decision. [PR]

**F01-81. AI-feedback rewards get over-optimised too: over-trained RL-CAI models turned harsh or appended boilerplate.**
- Location: CAI22 Section 4.3.
- Verdict: NEW
- Evidence: CAI22 (Tier 3, qualitative observation). "We found that RL-CAI models can be over-trained, resulting in Goodharting behavior [Gao et al., 2022] whereby models can be overly harsh in responding to harmful prompts, or may include boilerplate language as part of their response to most red teaming prompts, saying e.g. 'you are valid, valued, and cared for'".
- Use in dive: links F01-55 to AI judges. [MM]

**F01-82. RLAIF matched RLHF in head-to-head human evaluation (50% summarisation, 52% dialogue, neither significantly different from 50%), and beat it on harmlessness (88% vs 76%).**
- Location: LEE23 Table 1; Section 4.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2309.00267v3 (accessed 2026-10-16). Tier 3 ICML 2024, benchmark claim with human evaluation; PaLM 2 Large labeler, PaLM 2 XS policy. Table 1: RLAIF vs SFT 71% (summarisation), 63% (helpful dialogue); RLHF vs SFT 73%, 64%; RLAIF vs RLHF 50%, 52%. "For harmless dialogue generation, RLAIF achieves a harmless rate of 88%, outperforming both RLHF and SFT, which score 76% and 64%, respectively". "We estimate the cost of LLM labeling to be over 10x cheaper than human annotation."
- Use in dive: AI judges are a viable reward source in these tasks. [MM][PR]

**F01-83. d-RLAIF skips the reward model: an off-the-shelf LLM scores each response 1 to 10 during RL, and that score is the reward.**
- Location: LEE23 Section 2.2.2; Section 4.3; Table 1.
- Verdict: NEW
- Evidence: LEE23 (Tier 3, method plus benchmark). "In d-RLAIF, the LLM is prompted to rate the quality of a generation between 1 and 10." "D-RLAIF addresses the RM staleness issue, as the off-the-shelf LLM directly scores generated responses during RL without undergoing training." Section 4.3: "human annotators prefer d-RLAIF over SFT 74% of the time ... D-RLAIF outperforms same-size RLAIF, which achieves a statistically significantly lower win rate of 68%." Self-improvement result (abstract): "RLAIF can outperform a supervised fine-tuned baseline even when the AI labeler is the same size as the policy, or even the exact same checkpoint as the initial policy."
- Use in dive: an LLM-as-judge prompt is a reward function; the same prompt can drive a text loop or an RL run. [MM][PR]

**F01-84. Strong LLM judges agree with humans about as often as humans agree with each other (over 80% for GPT-4), but show position, verbosity and self-enhancement biases.**
- Location: ZHE23 Abstract; Section 3.3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2306.05685v4 (accessed 2026-10-16). Tier 3 NeurIPS 2023 Datasets and Benchmarks, benchmark claim. "strong LLM judges like GPT-4 can match both controlled and crowdsourced human preferences well, achieving over 80% agreement, the same level of agreement between humans." "We examine the usage and limitations of LLM-as-a-judge, including position, verbosity, and self-enhancement biases, as well as limited reasoning ability". Related: DPO23 Section 6.4, "GPT-4 prefers longer, more repetitive summaries than humans do with the GPT-4 (S) prompt"; STI20 Section 4.3, "our RMs are biased towards longer summaries".
- Use in dive: a judge used as a reward passes its biases to the policy [SPECULATIVE: inference from judge bias plus F01-54/F01-81; no source here measures bias transfer directly]. [PR]

### I. What an RL weight update changes, compared with SFT

**F01-85. The crisp difference: RL trains on the model's own samples, weighted by reward (including negative weights); SFT trains on fixed external targets with weight one.**
- Location: SHE25 Section 5.1; DSM24 Table 10.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.04259v1 (accessed 2026-10-16). Tier 3 preprint, definition. "Two features distinguish this from SFT: 1. Sampling Distribution. While in RL the training was done on outputs drawn from the model's own distribution, in SFT they come from fixed external annotations. 2. Negative Examples. While sampling from π, some of the responses will be incorrect. These are usually assigned a negative coefficient A(x, y)." DSM24 Table 10: SFT gradient coefficient "1".
- Use in dive: the one-line answer to "what does RL do that SFT does not". [MM]

**F01-86. Of those two differences, sampling from the model's own distribution is what matters for forgetting; negative examples are not.**
- Location: SHE25 Section 5.1, Figure 4.
- Verdict: NEW
- Evidence: SHE25 (Tier 3 preprint, ablation; Qwen 2.5 3B-Instruct, Science Q&A). "1-0 Reinforce behaves similarly to GRPO, while SimPO resembles SFT. Thus, the critical factor is not the presence of negative gradients but the use of on-policy data." 1-0 Reinforce "is equivalent to sampling from the model and performing SFT on correct answers only."
- Use in dive: "SFT on your own filtered samples" already behaves like RL on this axis; a loop that harvests its own good outputs for fine-tuning is on-policy. [MM][PR]

**F01-87. RL forgets less than SFT at equal new-task performance, and forgetting is predicted by the KL from the base model measured on the new task; an oracle SFT target chosen for minimal KL forgot even less than RL.**
- Location: SHE25 Abstract; Section 1; Section 4.
- Verdict: NEW
- Evidence: SHE25 (Tier 3 preprint; experiments on LLMs, a robotic foundation model, and ParityMNIST). "RL's Razor: among all ways to solve a new task, RL prefers those closest in KL to the original model." "A quadratic fit achieves R2 = 0.96 in this setting [ParityMNIST] ... The same correlation appears in our LLM experiments, with a quadratic fit achieving R2 = 0.71 (Figure 11)." Section 1: "Training on this oracle distribution produces even less forgetting than RL itself. This demonstrates that RL's advantage does not stem from being inherently different, but from its implicit KL minimization."
- Use in dive: RL changes the model in the smallest way that solves the task; this is the property a frozen-model loop gets for free (no weight change) [SPECULATIVE: framing]. [MM]

**F01-88. RL can only reinforce what the model already samples: by drawing from its own distribution, RL is confined to outputs the base model gives non-negligible probability.**
- Location: SHE25 Section 1.
- Verdict: NEW
- Evidence: SHE25 (Tier 3 preprint, author explanation). "by sampling from the model's own distribution at every step, RL constrains learning to outputs already given non-negligible probability by the base model. To improve reward, these samples are reweighted and used to update the model, which gradually shifts the policy rather than pulling it toward an arbitrary distribution."
- Use in dive: the strongest mental model in this area; pairs with F01-58 (optimum is a reweighting of πref) and F01-89. [MM]

**F01-89. In one math study, RL raised majority-vote accuracy (Maj@K) but not Pass@K: it made already-reachable correct answers more likely rather than adding new ones.**
- Location: DSM24 Section 5.2.2, Figure 7.
- Verdict: NEW
- Evidence: DSM24 (Tier 3 preprint, benchmark analysis; DeepSeekMath 7B, GSM8K and MATH, temperature 0.7). "RL enhances Maj@K's performance but not Pass@K. These findings indicate that RL enhances the model's overall performance by rendering the output distribution more robust, in other words, it seems that the improvement is attributed to boosting the correct response from TopK rather than the enhancement of fundamental capabilities."
- Use in dive: if the right answer is already in the top K samples, a sample-and-select loop can reach it without training [SPECULATIVE: implication for loops, not tested in the source]. [MM]

**F01-90. "SFT memorizes, RL generalizes" was shown on two rule and visual reasoning tasks with one 11B vision-language model: RL improved out-of-distribution success while SFT degraded it.**
- Location: CHU25 Section 5.1, Figure 6; Section 5.2, Figure 7; Section 3.
- Verdict: NEW (scope matters; see D5).
- Evidence: https://arxiv.org/abs/2501.17161v2 (accessed 2026-10-16). Tier 3 ICML 2025, benchmark claim (author-reported; Llama-3.2-Vision-11B, PPO, GeneralPoints and V-IRL). "RL achieves an increase of +3.5% on GP-L (11.5% → 15.0%) and +11.0% on V-IRL-L (80.8% → 91.8%) ... In contrast, SFT consistently exhibits performance degradation across all OOD evaluations on all tasks: -8.1% on GP-L (11.5% → 3.4%), -79.5% on V-IRL-L (80.8% → 1.3%)".
- Use in dive: the generalisation claim, with its scope attached. [MM]

**F01-91. The same study found SFT necessary before RL when the base model cannot follow instructions: without it, every end-to-end RL run failed to improve.**
- Location: CHU25 Section 5.4, Figure 9.
- Verdict: NEW
- Evidence: CHU25 (Tier 3, ablation). "SFT is necessary for RL training when the backbone model does not follow instructions. Figure 9 shows that without SFT, all end-to-end RL runs fail to improve ... the base Llama-3.2-Vision-11B model tends to generate long, tangential, and unstructured responses. This issue makes it impossible to retrieve task-related information and rewards for RL training."
- Use in dive: RL needs a policy that already produces scorable output; same constraint as F01-88. [MM][PR]

**F01-92. The RL in that study trained a text loop: each state is the system prompt plus all previous answers and verifier feedback, and the action is the whole next answer.**
- Location: CHU25 Section 3, "Sequential revision"; Figure 2.
- Verdict: NEW
- Evidence: CHU25 (Tier 3, definition). "For subsequent time steps (t ≥ 1), the input prompt vin t comprises the system prompt concatenated with all prior model and verifier outputs". "We use VER : Vn → R × Vk to denote a verifier, which evaluates the outcome of vout and generates an outcome-based reward function ... r along with textual information vver". "The action space A is defined as A := Vn."
- Use in dive: a direct precedent for "RL over a loop whose state carries textual feedback"; the hand-off point to the loop sections. [MM]

**F01-93. Two studies disagree on why RL weight updates look sparse: one finds RL touches only 5-30% of parameters because it trains near its own distribution; another finds the sparsity disappears in float32 and calls it a bfloat16 artefact. Both find the updates full-rank.**
- Location: MUK25 Abstract, Section 4; SHE25 Section 6.
- Verdict: NEW (debate D6).
- Evidence: https://arxiv.org/abs/2505.11711v2 (accessed 2026-10-16), Tier 3 NeurIPS 2025 per arXiv comment, measurement across 7 algorithms and 10 LLMs: "such large gains result from updating only a small subnetwork comprising just 5%-30% of the parameters"; "the updates to almost all parameter matrices are nearly full-rank"; "We conjecture that the this update sparsity can be primarily attributed to training on data that is near the policy distribution"; Section 4 also states finite precision is the immediate mechanism: "updates with very small magnitudes ... cannot be represented and are effectively discarded". SHE25 Section 6: "the reason for the observed sparse updates was the use of bfloat16 for model training ... Performing the same training with float32 resulted in models with identical performance but without any sparsity in their weight updates ... all algorithms lead to full rank weight updates." SHE25 also: weight-change metrics "correlated only weakly with forgetting".
- Use in dive: an ExpandableSection at most; the robust takeaway is "RL moves the weights a little", not "RL edits a subnetwork". [MM]

---

## Concept order (for the Getting Started section)

1. **The LM is already a policy** (F01-1, F01-2). Start with what the reader knows: sampling from a model is acting.
2. **State, action, episode for an LM** (F01-3, F01-4). The context window is the state; this frame is reused when loops add text to that state.
3. **Reward and return, and why it is sparse** (F01-5, F01-6). One number at EOS; everything else in RL machinery serves this constraint.
4. **Two framings: token MDP vs response bandit** (F01-7, F01-8, F01-9). Prevents confusion when papers disagree about what an "action" is.
5. **Policy gradient and REINFORCE** (F01-16, F01-17). The update is "likelihood training on your own samples, weighted by reward": the reader can now read any RL loss.
6. **Variance, baselines and advantage** (F01-18, F01-19, F01-11). Why we subtract something; makes "advantage" intuitive before any critic appears.
7. **Critics and GAE, then group baselines** (F01-20, F01-21, F01-24, F01-12). Two ways to get a baseline: learn one (critic) or sample one (RLOO, GRPO).
8. **On-policy, off-policy, exploration** (F01-13, F01-14, F01-15). Needed before PPO's ratio and before DPO's "offline".
9. **Trust regions and PPO's clip** (F01-25 to F01-29). The speed limit, with the two-leash distinction (F01-28) placed here.
10. **Reward models from preferences** (F01-44, F01-45). Bradley-Terry as Elo; the reward model is the human proxy.
11. **KL to the reference model** (F01-35 to F01-41). What the leash prevents and what it does not.
12. **The full RLHF pipeline and its cost** (F01-46 to F01-53, F01-32 to F01-34). Assemble the pieces; four models; rollout-bound.
13. **Over-optimisation** (F01-54 to F01-57). Proxy reward rises, true reward peaks then falls; best-of-n is on the same curve.
14. **DPO: the closed form** (F01-58 to F01-64). Only makes sense after 11 and 13; the policy is its own reward model, trained offline.
15. **The preference-optimisation family and the unified gradient** (F01-65 to F01-71). Organise IPO, KTO, ORPO, SimPO by what they remove; then show they are all one gradient shape.
16. **DPO vs PPO evidence and current practice** (F01-72 to F01-76). The "how to choose" input.
17. **AI feedback** (F01-77 to F01-84). Words become a scalar; this is the hand-off to the loop sections.
18. **What RL changes vs SFT** (F01-85 to F01-93). Closes the foundation with the dive's question: what the weights gain that a loop cannot hold.

## Mental models worth teaching

1. **An RL update is likelihood training on the model's own samples, weighted by how good each turned out**, so every method in this area is the same gradient with a different data source and weight (F01-16, F01-17, F01-60, F01-70, F01-85).
2. **RL can only sharpen what the model already samples**: the target of KL-regularised RLHF is the starting model reweighted by reward, on-policy sampling confines learning to outputs with non-negligible probability, and in one study RL raised Maj@K but not Pass@K (F01-58, F01-88, F01-89, F01-91).
3. **The reward is a proxy, and optimisation pressure finds its flaws on a predictable curve**: true quality rises then falls with √KL from the start point, whether the pressure comes from RL, from best-of-n selection or from an AI judge (F01-36, F01-54, F01-55, F01-56, F01-81).
4. **One score at the end of a long response is the core difficulty**; baselines, critics, GAE and group means are all ways to turn that single number into a per-token signal with less noise (F01-6, F01-12, F01-19, F01-21, F01-24).
5. **There are two leashes**: PPO's clip limits how far one update moves from the policy that sampled the batch, while the KL penalty measures how far the whole run has moved from the starting model (F01-27, F01-28, F01-35, F01-41).
6. **Feedback written in words reaches the weights in one of two ways**: as text that drives a revision which becomes a training target (SL-CAI), or as a number that becomes a reward (RL-CAI probabilities, d-RLAIF 1-10 scores) (F01-77, F01-78, F01-79, F01-83).

## Contradictions and debates

**D1. Does the KL penalty prevent reward-model over-optimisation?**
- Yes, it mitigates it: OUY22 Section 3.5 adds it "to mitigate over-optimization of the reward model" (F01-37); STI20 Section 3.4 says it keeps outputs near what the reward model has seen (F01-35); DPO23 Section 3 says it "prevents the model from deviating too far from the distribution on which the reward model is accurate".
- It acts like early stopping, without improving the gold-reward frontier: GAO22 Section 3.6 (F01-41), hedged by the authors as possibly hyperparameter-sensitive. Related: OUY22 Appendix E.6 shows a 100x larger coefficient does not stop capability regressions (F01-40); SHE25 shows on-policy RL stays KL-close without any explicit penalty (F01-87); TRL's GRPO default turns the penalty off (F01-39).
- Reading: the KL distance is a reliable measure of how hard you have optimised; whether penalising it buys anything beyond stopping earlier is unsettled in the sources read.

**D2. Is DPO as good as PPO?**
- DPO side: DPO23 Section 6 reports DPO matching or beating PPO on sentiment, TL;DR and Anthropic HH, up to 6B, GPT-4-judged (F01-64). Benchmark claims, author-reported, with the authors' own and TRL's PPO as baselines.
- PPO side: XU24 (Theorem 4.1 plus experiments, F01-72) finds PPO ahead "in all cases" once tuned with advantage normalisation, large batches and an EMA reference. IVI24 (F01-73) finds PPO ahead by about 0.7 points on average at 13B, with data quality mattering more than the algorithm.
- Reading: the published PPO wins come with careful tuning and several times the compute; the DPO wins came with less-tuned PPO baselines. Evidence kind on both sides is author-reported benchmarks.

**D3. Does LLM RL need PPO's machinery?**
- Yes, with care: PPO, STI20 and OUY22 use the clip, a learned critic and GAE; XU24 names the PPO details that matter (F01-43, F01-72); IVI24 lists more (F01-74).
- No: AHM24 finds the clip active under 5% of the time, λ = 1 best, and REINFORCE or RLOO ahead of PPO (F01-23, F01-31, F01-75). DSM24 drops the critic for group baselines (F01-24, F01-33). TRL removed PPOTrainer in v1.13.0 citing near-zero usage (F01-76).

**D4. How big is the critic?**
- "Comparable size to the policy": STI20 Section 3.4, DSM24 Section 4.1.1 (F01-33).
- Not required: OUY22 Appendix C.4, one 6B value function for policies up to 175B (F01-34).

**D5. Does RL generalise where SFT memorises?**
- For: CHU25 Sections 5.1-5.2 on GeneralPoints and V-IRL (F01-90); SHE25 shows RL forgets less (F01-87).
- Limits from the same sources: CHU25 Section 5.4 needs SFT first (F01-91); SHE25 shows a KL-minimal SFT target forgets less than RL, so the property belongs to the data, not to "RL" as such (F01-87); DSM24 shows gains concentrated in sampling reliability (F01-89). Scope of CHU25: two tasks, one model family.

**D6. Are RL weight updates sparse?**
- Yes, 5-30% of parameters, because the training data sits near the policy's own distribution: MUK25 (F01-93).
- An artefact of bfloat16; float32 training gives dense updates with identical performance: SHE25 Section 6 (F01-93).
- Common ground: both report full-rank updates, and MUK25 itself names limited floating-point precision as the immediate mechanism.

## UNKNOWN register

- **U1.** The original Williams 1992 text was not read: the hosted PDF (people.cs.umass.edu copy) is a scan whose text layer decodes to garbage, and the Springer page returned a bot challenge. REINFORCE statements here rest on SB Chapter 13, which attributes the algorithm to Williams 1987 and 1992. Verbatim quotes from Williams: UNKNOWN.
- **U2.** Bradley and Terry 1952 (Biometrika 39(3/4):324-345) was not read; cited through CHR17 and DPO23.
- **U3.** No source read gives measured memory in GB for PPO's four models at a given size. AHM24 says "up to 4 models"; OUY22 says a 175B RM and value function "greatly increase the compute requirements". A Tier 0 measurement would settle it.
- **U4.** Which algorithms current frontier labs use in production post-training: not established from first-party sources in this research. XU24 asserts ChatGPT and Claude use reward-based PPO-style RLHF; that is a third-party statement and was not verified.
- **U5.** KL coefficients used in current production systems: not located. Published values are from research runs (F01-38). The TRL GRPO help string attributes 0.001 to DeepSeek-R1; the R1 paper itself was not read here.
- **U6.** Whether GAO22's functional forms hold at frontier scale: the study is synthetic (6B gold RM, proxy RMs up to 3B, policies up to 6B). No larger replication was located during this research.
- **U7.** Whether any open-source framework still ships maintained classic PPO for LLMs (outside TRL) was not checked.
- **U8.** The exact number of ranked comparison pairs used to train the InstructGPT reward model is not stated; only "an order of magnitude larger than the number of prompts" (F01-49).
- **U9.** The derivation of KLbon = log n - (n-1)/n in STI20 Appendix G.3 was not read; GAO22 calls it analytic. Whether it is exact or a bound under all conditions was not verified here.
- **U10.** Whether MUK25 appeared at NeurIPS 2025 was taken from the arXiv comment; the proceedings page was not checked.

## Reading path (primary sources, in order)

1. **InstructGPT, Ouyang et al. 2022, arXiv 2203.02155v1 (NeurIPS 2022), Sections 3.1, 3.5 and Appendix C.** The whole pipeline in one place, the bandit framing, the per-token KL to the SFT model, and real hyperparameters. Everything after it is a modification of this.
2. **Sutton and Barto, 2nd ed., Chapter 13 (pp. 321-338).** The policy gradient theorem, REINFORCE, baselines and actor-critic, in plain notation. Read after InstructGPT so the math has a concrete target.
3. **DPO, Rafailov et al. 2023, arXiv 2305.18290v3 (NeurIPS 2023), Sections 3-5.** Shows the RLHF objective has a closed-form optimum and what is lost by fitting it offline. The cleanest way to see what on-policy sampling contributes.
4. **Gao et al. 2022, arXiv 2210.10760v1 (ICML 2023), Sections 1, 2 and 3.6.** The over-optimisation curve for both RL and best-of-n; the bridge to inference-time loops.
5. **RL's Razor, Shenfeld et al. 2025, arXiv 2509.04259v1 (preprint), Sections 1, 4 and 5.1.** The clearest current statement of how RL's weight change differs from SFT's, with the on-policy ablation.

## Source list by tier

### Tier 1: code and official framework docs
- TRL v1.12.0, SHA 59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be: https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_trainer.py (L489, L771-L779, L786-L797, L843-L847) and https://github.com/huggingface/trl/blob/59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be/trl/experimental/ppo/ppo_config.py (L231-L271). Accessed 2026-10-16. Code behaviour.
- TRL v1.13.0, SHA 3d9261f1fec9f9a8140099c78a65c7da73dce79c: release notes https://github.com/huggingface/trl/releases/tag/v1.13.0 and tree https://github.com/huggingface/trl/tree/v1.13.0/trl/experimental. Accessed 2026-10-16. Docs plus code behaviour (absence).
- TRL v1.16.0, SHA 1b5c75ed94b7387f42532adb090c935166d4878d: https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/dpo_config.py (L227-L233, L245-L252, L297-L298), https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/dpo_trainer.py (L1349-L1351, L1387-L1404), https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/grpo_config.py (L681-L695), https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/trl/trainer/rloo_config.py (L502-L507). Accessed 2026-10-16. Code behaviour.

### Tier 2: first-party blogs
- Schulman, "Approximating KL Divergence", 2020-03-07, http://joschu.net/blog/kl-approx.html. Accessed 2026-10-16. Author's own post; definitions of the k1, k2, k3 estimators.

### Tier 3: textbooks and academic papers
Peer-reviewed:
- Sutton and Barto, Reinforcement Learning: An Introduction, 2nd ed., MIT Press 2018. http://incompleteideas.net/book/the-book-2nd.html (PDF RLbook2020.pdf). Accessed 2026-10-16. Definitions, theory.
- Williams 1992, Machine Learning 8(3-4):229-256, https://doi.org/10.1007/BF00992696. Accessed 2026-10-16 (not readable, see U1).
- Schulman et al., TRPO, ICML 2015, https://arxiv.org/abs/1502.05477v5. Accessed 2026-10-16. Theory.
- Schulman et al., GAE, ICLR 2016, https://arxiv.org/abs/1506.02438v6. Accessed 2026-10-16. Definition, theory, ablation.
- Christiano et al., Deep RL from Human Preferences, NeurIPS 2017, https://arxiv.org/abs/1706.03741v4; venue page https://proceedings.neurips.cc/paper_files/paper/2017/hash/d5e2c0adad503c91f91df240d0cd4e49-Abstract.html. Accessed 2026-10-16. Definition, benchmark.
- Stiennon et al., Learning to summarize from human feedback, NeurIPS 2020, https://arxiv.org/abs/2009.01325v3. Accessed 2026-10-16. Production report, ablation, benchmark.
- Ouyang et al., InstructGPT, NeurIPS 2022, https://arxiv.org/abs/2203.02155v1; venue page https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html. Accessed 2026-10-16. Production report, benchmark, ablation.
- Gao, Schulman, Hilton, Scaling Laws for Reward Model Overoptimization, ICML 2023, https://arxiv.org/abs/2210.10760v1; venue page https://proceedings.mlr.press/v202/gao23h.html. Accessed 2026-10-16. Scaling study (synthetic), ablation.
- Rafailov et al., DPO, NeurIPS 2023, https://arxiv.org/abs/2305.18290v3. Accessed 2026-10-16. Theory, benchmark.
- Zheng et al., Judging LLM-as-a-Judge, NeurIPS 2023 Datasets and Benchmarks, https://arxiv.org/abs/2306.05685v4. Accessed 2026-10-16. Benchmark.
- Lee et al., RLAIF vs. RLHF, ICML 2024, https://arxiv.org/abs/2309.00267v3. Accessed 2026-10-16. Benchmark with human evaluation.
- Gheshlaghi Azar et al., IPO (A General Theoretical Paradigm ...), AISTATS 2024, https://arxiv.org/abs/2310.12036v2; venue page https://proceedings.mlr.press/v238/gheshlaghi-azar24a.html. Accessed 2026-10-16. Theory, toy experiments.
- Ethayarajh et al., KTO, ICML 2024, https://arxiv.org/abs/2402.01306v5. Accessed 2026-10-16. Benchmark.
- Ahmadian et al., Back to Basics (REINFORCE, RLOO), ACL 2024, https://arxiv.org/abs/2402.14740v2; venue page https://aclanthology.org/2024.acl-long.662/. Accessed 2026-10-16. Ablation, benchmark.
- Hong et al., ORPO, EMNLP 2024, https://arxiv.org/abs/2403.07691v2; venue page https://aclanthology.org/2024.emnlp-main.626/. Accessed 2026-10-16. Definition, benchmark.
- Xu et al., Is DPO Superior to PPO for LLM Alignment?, ICML 2024, https://arxiv.org/abs/2404.10719v3. Accessed 2026-10-16. Theory/proof, ablation, benchmark.
- Meng et al., SimPO, NeurIPS 2024, https://arxiv.org/abs/2405.14734v3. Accessed 2026-10-16. Definition, benchmark.
- Ivison et al., Unpacking DPO and PPO, NeurIPS 2024, https://arxiv.org/abs/2406.09279v2. Accessed 2026-10-16. Ablation, production report.
- Chu et al., SFT Memorizes, RL Generalizes, ICML 2025, https://arxiv.org/abs/2501.17161v2. Accessed 2026-10-16. Benchmark, ablation.
- Mukherjee et al., RL Finetunes Small Subnetworks, NeurIPS 2025 (per arXiv comment), https://arxiv.org/abs/2505.11711v2. Accessed 2026-10-16. Measurement study.

Preprints:
- Schulman et al., PPO, https://arxiv.org/abs/1707.06347v2. Accessed 2026-10-16. Definition, ablation.
- Ziegler et al., Fine-Tuning Language Models from Human Preferences, https://arxiv.org/abs/1909.08593v2. Accessed 2026-10-16. Definition, ablation.
- Bai et al., Constitutional AI, https://arxiv.org/abs/2212.08073v1. Accessed 2026-10-16. Method description, qualitative results.
- Shao et al., DeepSeekMath (GRPO), https://arxiv.org/abs/2402.03300v3. Accessed 2026-10-16. Method, framework, benchmark analysis.
- Shenfeld, Pari, Agrawal, RL's Razor, https://arxiv.org/abs/2509.04259v1. Accessed 2026-10-16. Ablation, theory in a simplified setting.

### Tier 4
- None used.
