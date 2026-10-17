# 04 Theory, limits, practitioner loops, and framing taxonomies

Research date: 2026-10-16. Every source below: accessed 2026-10-16.

## Header

**Scope.** Where a text loop over a frozen model falls short of weight-level RL, and why: in-context RL (trained for it vs not), in-context exploration by general LLMs, credit assignment in reflection loops, context and memory growth limits (including prompt-cache invalidation), the boundary between improvement that lives in weights and improvement that lives in context, formal frames for "context as policy parameters", and three practitioner seeds (Karpathy autoresearch, Huntley's Ralph loop, the "Adaptation of Agentic AI" taxonomy). GEPA and ACE are covered in depth by another agent; only headlines and conditions are cited here.

**Tiers.** Tier 0 our experiments (none in this file). Tier 1 source code at a pinned SHA, official product docs. Tier 2 first-party lab or vendor blog posts, an author's own post about their own method. Tier 3 academic papers (peer-reviewed or preprint, marked) and third-party technical reports. Tier 4 tutorials, summaries, press, social posts or issues by others: inspiration only.

**Evidence kinds.** definition, theory/proof, benchmark claim (author-reported), ablation, production report, code behaviour, practitioner design.

**Verdicts.** NEW = verified claim recorded for the dive. UNKNOWN = could not be established from primary sources. WRONG = a claim in circulation (or in the brief) that the primary source contradicts; the true statement follows.

**Quote conventions.** Quotes are verbatim except for three mechanical normalizations required by the repo style gate: em-dashes rendered as " - ", curly quotes as straight quotes, and arrow glyphs as "->". "[...]" marks an elision; "[citations omitted]" marks removed reference lists.

**Measured / proven / argued.** Each entry states which. "Measured" means an author-reported number from an experiment. "Proven" means a theorem or construction with stated assumptions. "Argued" means reasoning, analogy, or a qualitative example.

### Pinned sources

Papers (arXiv ID with version, venue):
- 2210.14215v1 Algorithm Distillation (ICLR 2023, notable top 5%)
- 2306.14892v1 Decision-Pretrained Transformer (NeurIPS 2023)
- 2403.15371v3 Can LLMs explore in-context? (NeurIPS 2024)
- 2504.16078v1 LLMs are Greedy Agents (preprint)
- 2410.06238v2 EVOLvE (ICML 2025)
- 2410.05362v4 LLMs Are In-Context Bandit RL Learners (COLM 2025)
- 2506.06303v6 Reward Is Enough: LLMs Are In-Context RL Learners (preprint)
- 2502.00225v4 Should You Use Your LLM to Explore or Exploit? (UAI 2026)
- 2502.01118v1 LLM-Enhanced Multi-Armed Bandits (preprint)
- 2608.16707v1 Semantic Bandits (preprint)
- 2303.11366v4 Reflexion (NeurIPS 2023)
- 2308.02151v3 Retroformer (ICLR 2024)
- 2505.00212v3 Which Agent Causes Task Failures and When? (ICML 2025)
- 2310.01798v2 LLMs Cannot Self-Correct Reasoning Yet (ICLR 2024)
- 2406.01297v3 When Can LLMs Actually Correct Their Own Mistakes? (TACL 2024)
- 2405.06682v3 Self-Reflection in LLM Agents (preprint)
- 2602.03338v1 Accurate Failure Prediction Does Not Imply Effective Failure Prevention (preprint)
- 2509.25370v1 Where LLM Agents Fail and How They Can Learn From Failures (preprint)
- 2307.03172v3 Lost in the Middle (TACL 2023)
- 2404.06654v3 RULER (COLM 2024)
- 2502.05167v3 NoLiMa (ICML 2025)
- 2510.04618v3 ACE, Agentic Context Engineering (ICLR 2026)
- 2507.19457v2 GEPA (ICLR 2026, Oral)
- 2312.05934v3 Fine-Tuning or Retrieval? (preprint; venue not confirmed in this research)
- 2505.00661v3 Generalization from ICL vs finetuning (NeurIPS 2025 FoRLM workshop)
- 2209.15189v1 Learning by Distilling Context (preprint)
- 2509.04259v1 RL's Razor (preprint)
- 2501.17161v2 SFT Memorizes, RL Generalizes (ICML 2025)
- 2504.13837v5 Does RL Really Incentivize Reasoning Capacity Beyond the Base Model? (NeurIPS 2025 Oral, per the arXiv journal reference, checked 2026-10-17)
- 2505.24864v1 ProRL (preprint)
- 2404.10859v2 Forcing Diffuse Distributions out of Language Models (COLM 2024)
- 2303.08774v6 GPT-4 Technical Report (first-party lab report)
- 2310.11324v2 Sensitivity to Spurious Features in Prompt Design (ICLR 2024)
- 2405.10276v2 Revisiting OPRO (preprint)
- 2309.03409v3 OPRO, LLMs as Optimizers (ICLR 2024)
- 2406.07496v1 TextGrad (preprint; journal version Nature 639, 2025)
- 2212.07677v2 Transformers learn in-context by gradient descent (ICML 2023)
- 2310.08540v5 Do pretrained Transformers Learn In-Context by Gradient Descent? (preprint; venue not confirmed here)
- 2212.10559v3 Why Can GPT Learn In-Context? (ACL 2023 Findings)
- 2512.16301v3 Adaptation of Agentic AI: A Survey of Post-Training, Memory, and Skills (preprint; v1 2025-12-18 titled "Adaptation of Agentic AI")

Code (pinned):
- karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117 (master HEAD, committed 2026-03-26)
- ghuntley/how-to-ralph-wiggum @ 88d488a148af97e4a3f22b11b4c3598c79d6a577 (fork of ClaytonFarr/ralph-playbook, committed 2026-01-11)

Docs and posts:
- Anthropic prompt caching docs: https://platform.claude.com/docs/en/build-with-claude/prompt-caching (Tier 1)
- Amazon Bedrock prompt caching docs: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html (Tier 1)
- Anthropic engineering, "Effective context engineering for AI agents", published 2025-09-29: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (Tier 2)
- Huntley, "Ralph Wiggum as a 'software engineer'", published 2025-07-14, page modified 2026-02-19: https://ghuntley.com/ralph/ (Tier 2). Wayback snapshot: http://web.archive.org/web/20260101212805/https://ghuntley.com/ralph/
- Huntley, "everything is a ralph loop", published 2026-01-17: https://ghuntley.com/loop/ (Tier 2)
- Chroma, "Context Rot" technical report, 2025-07-14: https://research.trychroma.com/context-rot (Tier 3, vendor report, not peer-reviewed)

---

## 1. Claim register

### A. In-context RL when the model is trained for it

**F04-1. A transformer can run an RL algorithm in its context with no weight updates.**
- Claim: Algorithm Distillation (AD) trains a causal transformer on learning histories of a source RL algorithm; at test time it improves its policy across episodes purely in context.
- Location: arXiv 2210.14215v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2210.14215v1 | Tier 3 (peer-reviewed, ICLR 2023) | benchmark claim | "AD is able to improve its policy entirely in-context without updating its network parameters." Also: "AD learns a more data-efficient RL algorithm than the one that generated the source data."
- Use in dive: Establishes that "learning in the context" can be genuine RL, which sets up the question the dive cares about: does a general LLM get this for free?

**F04-2. In-context RL in AD only emerges when the context spans several episodes.**
- Claim: The context must hold enough history to show policy improvement; 2-4 episodes were necessary in Dark Room, first signs at about one episode.
- Location: 2210.14215v1, section "What context size is required for in-context RL to emerge?" (Fig. 7).
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2210.14215v1 | Tier 3 | ablation (measured) | "multi-episodic contexts of 2-4 episodes are necessary to learn a near-optimal in-context RL algorithm. Initial signs of in-context RL begin to emerge when the context size is roughly the length of an episode."
- Use in dive: First hard link between context length and the ability to learn in context. A loop that cannot fit several attempts plus their outcomes cannot learn across them in context.

**F04-3. AD only learns in context if its training data shows learning progress.**
- Claim: The Expert Distillation (ED) baseline uses the same architecture and the same across-episode context but trains on expert data; it does not improve in context. The ingredient is training on histories that contain improvement.
- Location: 2210.14215v1, introduction and appendix on baselines.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2210.14215v1 | Tier 3 | ablation (measured) | "AD maximizes the episodic return with in-context RL while ED does not learn." And: "The benefits of AD cannot therefore be attributed to across-episode contexts alone but also learning progress in the offline data used to train AD." Hypothesis stated in intro: "the reason Policy Distillation does not improve through trial an error is that it trains on data that does not show learning progress."
- Use in dive: Mental model anchor: in-context RL is trained in. A general chat model was trained on finished text, not on its own learning histories.

**F04-4. AD's stated limit is long episodes.**
- Location: 2210.14215v1, Conclusion.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2210.14215v1 | Tier 3 | argued | "The main limitation of AD is that most RL environments of interest have long episodes and modeling multi-episodic context requires more powerful long-horizon sequential models than the ones considered in this work."
- Use in dive: Agentic coding episodes are long. This is the same wall that F04-34 to F04-37 measure for LLM long-context use.

**F04-5. Supervised pretraining to predict optimal actions also yields in-context RL (DPT).**
- Claim: The Decision-Pretrained Transformer (DPT) is trained to predict the optimal action given a query state and an in-context dataset of interactions, across many tasks. It then explores online and acts conservatively offline without being trained to do either.
- Location: arXiv 2306.14892v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2306.14892v1 | Tier 3 (peer-reviewed, NeurIPS 2023) | benchmark claim | "the pretrained transformer can be used to solve a range of RL problems in-context, exhibiting both exploration online and conservatism offline, despite not being explicitly trained to do so."
- Use in dive: Second route to the same capability; again the model was pretrained on a distribution of decision tasks.

**F04-6. DPT is provably equivalent to posterior sampling, under strong assumptions.**
- Claim: Theorem 1 states DPT's trajectory distribution equals that of posterior sampling (PS), a provably sample-efficient Bayesian RL algorithm, assuming the model fits the pretraining distribution exactly.
- Location: 2306.14892v1, section on theory, Assumption 1 and Theorem 1.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2306.14892v1 | Tier 3 | theory/proof | "we assume Mθ fits the pretraining distribution exactly with enough coverage and data, so that the focus of the analysis is just the in-context learning abilities." Theorem 1 (DPT <=> PS): equality of trajectory distributions "for all trajectories".
- Use in dive: The one place where "the model does RL in context" is proven, and the proof rests on the model having been trained on exactly the right task distribution.

**F04-7. DPT's authors leave open whether any of this transfers to instruction-tuned LLMs.**
- Location: 2306.14892v1, "Limitations and future work".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2306.14892v1 | Tier 3 | argued | "One limitation of DPT is the requirement of optimal actions at pretraining." And: "further investigation is required to understand the implications of these findings for existing foundation models, such as instruction-finetuned models, that are increasingly being deployed in decision-making settings."
- Use in dive: Hand-off from "trained for it" to section B: what a frozen general LLM actually does.

### B. Can a frozen general LLM explore in context?

**F04-8. Only one of the tested configurations explored satisfactorily.**
- Claim: Across GPT-3.5, GPT-4 and Llama2 with many prompt designs on multi-armed bandits, only GPT-4 with chain-of-thought and an externally summarized history (per-arm counts and averages) explored reliably.
- Location: arXiv 2403.15371v3, abstract and section 3.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2403.15371v3 | Tier 3 (peer-reviewed, NeurIPS 2024) | benchmark claim (measured) | "only one configuration resulted in satisfactory exploratory behavior: Gpt-4 with chain-of-thought reasoning and an externally summarized interaction history, presented as sufficient statistics". The successful code is "BSSeC0": buttons scenario, suggestive framing, summarized history, reinforced CoT, temperature 0.
- Use in dive: The headline evidence for "a frozen model does not explore by itself".

**F04-9. What Krishnamurthy et al. measured, exactly.**
- Claim: Stochastic Bernoulli bandits. Hard instance K=5 arms, gap 0.2; easy instance K=4, gap 0.5. Main horizon T=100, N in {10, 20} replicates per configuration. Models: GPT-3.5-Turbo-0613, GPT-4-0613, Llama2-13B-chat quantized to 4 bits. About 50K GPT-4 queries in total. Two failure modes: suffix failures (best arm never chosen after some round) and uniform-like failures (all arms chosen about equally).
- Location: 2403.15371v3, section 2 (setup), section 3.1, Fig. 1.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2403.15371v3 | Tier 3 | benchmark claim (measured) | "Gpt-4 with our basic prompt design experiences a suffix failure in > 60% of the replicates." (Fig. 1 top row: T=500, N=20.)
- Use in dive: Lets the reader see the scale of the test: small, clean, and still failing. Expandable evidence block.

**F04-10. The same successful configuration fails without external summarization.**
- Claim: Removing the externally computed summary breaks exploration even with CoT; in complex environments, writing that summary is itself algorithm design.
- Location: 2403.15371v3, introduction and "Implications for complex decision making problems".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2403.15371v3 | Tier 3 | ablation (measured) plus argued | "we find that the same configuration without external summarization fails, which leads to a negative interpretation: LLMs may fail to explore in more complex environments, where externally summarizing the history is a non-trivial algorithm design problem." The abstract concludes "non-trivial algorithmic interventions, such as fine-tuning or dataset curation, may be required".
- Use in dive: The practical rule: the loop, not the model, should keep the statistics. Pairs with autoresearch's results.tsv (F04-66).

**F04-11. LLMs are greedy: they stop trying new actions early (Gemma2 2B, 9B, 27B).**
- Claim: On 10-armed bandits, 2B covers 40% of actions and 9B/27B cover 65%; without CoT all models cover 25%; with 20 arms the largest models cover 45%. Small models also copy the most frequent action in context (frequency bias); 27B mostly escapes frequency bias but stays greedy.
- Location: arXiv 2504.16078v1, section 4.2 (Greediness, Frequency Bias).
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2504.16078v1 | Tier 3 (preprint) | benchmark claim (measured, 64 parallel environments) | "For 10 arms and averaged over 64 parallel environments, we find that Gemma2 2B covers 40% of all actions, while 9B/27B cover 65% (i.e., 6.5 actions), leaving a significant part of the action space unexplored. Note that without CoT all models explore merely 25% of all actions in the 10 arms setting." On frequency bias the authors argue (not measured): "This suggests that frequency bias is an artifact of supervised pre-training, and motivates the use of RL as a counter-measurement."
- Use in dive: Names the failure in RL vocabulary (premature exploitation) and connects it to how the weights were trained.

**F04-12. The knowing-doing gap: the model computes the right answer and then does not act on it.**
- Claim: Gemma2 27B was asked to compute UCB (Upper Confidence Bound) values and act on them. 87% of rationales were correct, yet among correct rationales the model chose the greedy action more often than the optimal one.
- Location: 2504.16078v1, section 4.2 "Knowing-Doing Gap", Fig. 5.
- Verdict: NEW (with an internal inconsistency, see section 6).
- Evidence: https://arxiv.org/pdf/2504.16078v1 | Tier 3 (preprint) | benchmark claim (measured, 64 instances, 50 timesteps) | "The agent clearly knows how to solve the task, with 87% of all rationales being correct (see Figure 5). However, even for correctly computed rationales, the model often selects the greedy action (58%) over the optimal action (21%)." The introduction states the figure differently: "(64% of actions when rationale is correct)".
- Use in dive: Strongest single illustration that reasoning in text is not the same as a trained policy. Writing the right reflection does not guarantee acting on it.

**F04-13. RL fine-tuning improves exploration, but does not reach a classical bandit algorithm.**
- Claim: RL fine-tuning (RLFT) on self-generated CoT rationales raises action coverage by 12% (2B, after 30K updates), lowers regret, and narrows the knowing-doing gap; a +1 bonus for untried actions raises exploration from 50% to 70%. Exploration remains sub-optimal versus UCB. Giving the model all the information (a "try-all" start) produced the largest gain.
- Location: 2504.16078v1, sections 4.3, 4.4, 5.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2504.16078v1 | Tier 3 (preprint) | benchmark claim and ablation (measured) | "RLFT results in increased action coverage (+12%) after 30K updates." "a simple exploration bonus (+1 reward for untried actions during RLFT), significantly increases exploration (50% -> 70%)". "This suggests that only given sufficient information about the (sub-)optimality of actions, LLMs are able to select actions accordingly". "While RLFT improves the exploration, it remains sub-optimal compared to bandit algorithms."
- Use in dive: The weight-level fix exists and is partial. Also shows reward shaping (an exploration bonus) is a weight-training lever with no clean text-loop equivalent.

**F04-14. Distilling a bandit algorithm into the LLM, or scaffolding it at inference, makes small models explore better than large ones.**
- Location: arXiv 2410.06238v2, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2410.06238v2 | Tier 3 (peer-reviewed, ICML 2025) | benchmark claim | "we propose efficient ways to integrate this algorithmic knowledge into LLMs: by providing explicit algorithm-guided support during inference; and through algorithm distillation via in-context demonstrations and fine-tuning, using synthetic data generated from these algorithms. Impressively, these techniques allow us to achieve superior exploration performance with smaller models, surpassing larger models on various tasks."
- Use in dive: Two routes to the same skill: put the algorithm in the loop (context) or in the weights (distillation). The dive's choice framework in miniature.

**F04-15. Frozen LLMs do learn from reward in context, but only from the positive episodes.**
- Claim: In a contextual-bandit version of in-context RL (ICRL) on classification tasks (500M to 70B models), learning worked when the prompt had stochasticity for exploration and kept only positive-reward episodes. Including negative-reward episodes caused failure. Learning continued until the context saturated; a sliding window drops old episodes.
- Location: arXiv 2410.05362v4, sections on Naive vs Naive+ ICRL, Discussion.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2410.05362v4 | Tier 3 (peer-reviewed, COLM 2025) | ablation (measured) | "The gap between the two indicates the failure of Naive is due to the presence of examples with negative reward." "Interestingly, while some work [citations omitted] find that models can learn from mistakes, we do not observe effective learning from episodes with negative rewards." "LLMs can continually improve when learning through ICRL until their context does not saturate." "When exploration is combined with filtering of episodes with negative rewards, conventional ICL abilities (i.e., learning from demonstrations) bring about strong ICRL trends."
- Use in dive: Sharp mental model: a frozen model learns in context by imitating its own successes, which is in-context learning from demonstrations the loop curated. Learning from failure is the weak half.

**F04-16. A 2025 counterpoint: reward-annotated history improves responses across rounds ("ICRL prompting").**
- Claim: Concatenating all prior responses with scalar rewards and re-prompting improves quality as context grows, on Game of 24, creative writing, ScienceWorld, AIME and HMMT. Game of 24 with GPT-4.1: 90% vs 49% Best-of-N, 47% Self-Refine, 44% Reflexion. Ablations: zero rewards and short context both reduce performance.
- Location: arXiv 2506.06303v6, abstract, Table 1, ablation section.
- Verdict: NEW (with a metric caveat).
- Evidence: https://arxiv.org/html/2506.06303v6 | Tier 3 (preprint) | benchmark claim and ablation (measured) | "We consistently observe that response quality improves as the context grows." "achieve a success rate of 90% which is significantly higher than 49% from Best-of-N sampling, 47% from Self-Refine, and 44% from Reflexion." Table 1 note: "The running max success rate of the last episode is reported." Ablation: "We have also observed performance drop with short context and performance drop when the reward is absent."
- Use in dive: Present as the strongest pro-text-loop evidence on in-context RL, with the caveat that the headline metric is best-so-far (running max), which rewards search as well as learning. Reward model is sometimes the same LLM (GPT-4.1 as both policy and judge).

**F04-17. LLMs are weak exploiters and useful candidate proposers.**
- Claim: Separating exploration from exploitation: reasoning models exploit best but are slow or expensive; with tool use and in-context summaries, non-reasoning models still do worse than a simple linear regression. As exploration oracles proposing candidates in large semantic action spaces, LLMs help. A separate design keeps a classical bandit algorithm as the outer loop and uses the LLM only to predict rewards; it beats direct LLM arm selection.
- Location: arXiv 2502.00225v4, abstract; arXiv 2502.01118v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2502.00225v4 | Tier 3 (peer-reviewed, UAI 2026) | benchmark claim | "all LLMs we study perform worse than a simple linear regression, even in non-linear settings. On the other hand, we find that LLMs do help at exploring large action spaces with inherent semantics, by suggesting suitable candidates to explore." Models include GPT-5.2, GPT-5-mini, GPT-4o and DeepSeek-R1-Distill-Qwen. Second source: https://arxiv.org/abs/2502.01118v1 | Tier 3 (preprint) | benchmark claim | "we adopt a classical MAB algorithm as the high-level framework and leverage the strong in-context learning capability of LLMs to perform the sub-task of reward prediction."
- Use in dive: Practical design rule for any text loop: let the model propose, let code keep score and decide. Matches autoresearch's keep-or-revert in git (F04-64).

**F04-18. Language itself biases in-context exploration.**
- Location: arXiv 2608.16707v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2608.16707v1 | Tier 3 (preprint, August 2026) | benchmark claim | "semantically informative action labels reduce exploration in favour of exploitation, improving performance when aligned with the reward structure and severely degrading it when misaligned. We further find that negative rewards trigger substantially more exploration than equivalent positive rewards".
- Use in dive: Naming and framing in a loop's prompt are part of the policy. A label like "the safe option" shifts behaviour regardless of reward.

### C. Credit assignment in text loops

**F04-19. Reflexion names credit assignment as the hard part of verbal RL.**
- Claim: Reflexion turns binary or scalar feedback into a verbal summary stored as memory. Its authors identify blame localization (credit assignment) as the challenge and state the method has no formal guarantee.
- Location: arXiv 2303.11366v4, introduction.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 (peer-reviewed, NeurIPS 2023) | definition and argued | "Generating useful reflective feedback is challenging since it requires a good understanding of where the model made mistakes (i.e. the credit assignment problem [25]) as well as the ability to generate a summary containing actionable insights for improvement." And: "it does have the disadvantages of relying on the power of the LLM's self-evaluation capabilities (or heuristics) and not having a formal guarantee for success."
- Use in dive: Introduces credit assignment in the reader's terms: after a 200-step failed run, which step was wrong?

**F04-20. Reflexion caps its memory at 1 to 3 reflections.**
- Location: 2303.11366v4, section 3 (Memory).
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 | practitioner design (in a paper) | "In practice, we bound mem by a maximum number of stored experiences, Ω (usually set to 1-3) to adhere to max context LLM limitations."
- Use in dive: The canonical "verbal RL" method sidesteps context growth by forgetting almost everything. Its gains are a few-trial effect.

**F04-21. Reflection without a grounding signal made results worse than no reflection.**
- Claim: On the 50 hardest HumanEval Rust problems with GPT-4: baseline 0.60; removing test generation (reflect without tests) 0.52; removing the self-reflection text 0.60; full Reflexion 0.68.
- Location: 2303.11366v4, Table 3 and "Ablation study".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 | ablation (measured, n=50) | "suggests that the agent is unable to determine if the current implementation is correct without unit tests. Therefore, the agent must participate in all iterations of the run without the option to return early, performing harmful edits to the implementation."
- Use in dive: The strongest number for the claim "the verifier is the reward function". Reflection adds value only on top of a reliable test signal.

**F04-22. Flaky self-written tests decide whether reflection helps.**
- Claim: Internal test false-positive rate (all tests pass, solution wrong): MBPP Python 16.3% vs HumanEval Python 1.4%. This gap tracks where Reflexion beat or lost to the GPT-4 baseline.
- Location: 2303.11366v4, programming "Analysis".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 | benchmark claim (measured) | "the false positive test execution rate for MBPP Python is 16.3% while the rate for HumanEval Python is a mere 1.4%, leading to 91% overall accuracy".
- Use in dive: A practical check for any loop: measure the false-positive rate of the evaluator before trusting the loop's improvement.

**F04-23. Reflexion did not improve on WebShop, and its reflections were not useful there.**
- Location: 2303.11366v4, appendix "WebShop Limitation", Fig. 6.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 | benchmark claim (measured, 100 environments) plus qualitative judgement | "after only four trials, we terminate the runs as the agent does not show signs of improvement 6. Further, the agent does not generate helpful, intuitive self-reflections after failed attempts. We conclude that Reflexion is unable to solve tasks that require a significant amount of diversity and exploration." Limitations section: "it may still succumb to non-optimal local minima solutions."
- Use in dive: Reflection loops climb hills; they do not explore. Same lesson as section B from a different direction.

**F04-24. Retroformer: frozen-model reflections can just restate the failure; train the reflector with policy gradient instead.**
- Claim: Retroformer keeps the actor frozen (GPT-3 text-davinci-003, GPT-4) and fine-tunes a smaller retrospective model (longchat-7b-16k) with PPO. The reward for a reflection is the change in episode return between consecutive trials. Reported gains: HotPotQA +18% with 4 retries, AlfWorld +36% with 3, WebShop +4%.
- Location: arXiv 2308.02151v3, introduction, Fig. 1, section 4.2 (Response Rating, PPO).
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2308.02151v3 | Tier 3 (peer-reviewed, ICLR 2024) | benchmark claim (measured) and argued (Fig. 1 is one illustrative example) | "The verbal reinforcement cannot be optimal, if the frozen language model has not been properly fine-tuned to specialize in credit assignment problems for the tasks in given environments." Fig. 1: "The verbal feedback from a frozen LLM, however, only rephrases the prior failed actions sequences as the proposed plan, resulting repetitive, incorrect actions in the next trial." Reward: "r(xk,i, yk,i) ≜ Gk,i+1 - Gk,i".
- Use in dive: The hybrid answer: keep the expensive model frozen and put weights where credit assignment happens. Measured gains; the "uninformative reflections" claim itself rests on an example.

**F04-25. Retroformer's own credit assignment is an assumption, not a measurement.**
- Claim: Attributing the return change to the reflection assumes the frozen actor at low temperature adds little other randomness.
- Location: 2308.02151v3, "Response Rating".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2308.02151v3 | Tier 3 | argued | "Because the actor is a frozen LM and the temperature is low as default (Yao et al., 2023), the injected randomness that leads to differences in returns [...] are mostly from the reflection responses".
- Use in dive: Preserve hedge scope: even the trained fix credits one text artifact per trial, the same simplification autoresearch makes with one edit per run.

**F04-26. Automated blame attribution on failed multi-agent logs is poor, and worse on longer logs.**
- Claim: On 127 LLM multi-agent systems' failure logs (Who&When dataset), the best method identified the responsible agent 53.5% of the time and the decisive step 14.2%; some methods were below random; o1 and R1 did not reach practical usability. Accuracy fell as logs got longer, step-level accuracy most.
- Location: arXiv 2505.00212v3, abstract and section 4.4 (Finding 4).
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2505.00212v3 | Tier 3 (peer-reviewed, ICML 2025) | benchmark claim (measured) | "The best method achieves 53.5% accuracy in identifying failure-responsible agents but only 14.2% in pinpointing failure steps, with some methods performing below random." "Finding 4: Failure attribution performance declines as context length increases, with step-level accuracy being more sensitive."
- Use in dive: The closest primary measurement of "does the reflection blame the right step?" The answer for long logs is mostly no. Repeat 14.2% as the section's number.

**F04-27. Intrinsic self-correction (no external feedback) does not reliably help reasoning.**
- Location: arXiv 2310.01798v2, abstract; arXiv 2406.01297v3, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2310.01798v2 | Tier 3 (peer-reviewed, ICLR 2024) | benchmark claim | "LLMs struggle to self-correct their responses without external feedback, and at times, their performance even degrades after self-correction." Second: https://arxiv.org/abs/2406.01297v3 | Tier 3 (peer-reviewed, TACL 2024, critical survey) | argued from literature | "(1) no prior work demonstrates successful self-correction with feedback from prompted LLMs, except for studies in tasks that are exceptionally suited for self-correction, (2) self-correction works well in tasks that can use reliable external feedback, and (3) large-scale fine-tuning enables self-correction."
- Use in dive: Converges with F04-21: the signal must come from outside the model; fine-tuning is the route when it cannot.

**F04-28. Read headline self-reflection gains with their protocol in mind.**
- Claim: A study reporting significant gains from self-reflection (p < 0.001) re-answered only the questions the model got wrong, gave the reflecting agent the correct answer before redaction, and found that a bare "Retry" also significantly improved scores.
- Location: arXiv 2405.06682v3, methods and results.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2405.06682v3 | Tier 3 (preprint) | benchmark claim (measured) | "Using the correct answer as an external feedback signal, they each generated one of" [the reflection types]. "Interestingly, the Retry agent significantly improved performance across all LLMs."
- Use in dive: Methodology warning for the reader evaluating vendor or blog claims: retrying only failures on multiple choice inflates gains without any blame being assigned.

**F04-29. An accurate critic can still make an agent worse.**
- Location: arXiv 2602.03338v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2602.03338v1 | Tier 3 (preprint) | benchmark claim (measured) | "a binary LLM critic with strong offline accuracy (AUROC 0.94) can nevertheless cause severe performance degradation, inducing a 26 percentage point (pp) collapse on one model while affecting another by near zero pp." The proposed mechanism is a "disruption-recovery tradeoff".
- Use in dive: An evaluator inside the loop changes the trajectory distribution; test it on a pilot before deploying, as the authors propose with 50 tasks.

**F04-30. Root-cause isolation helps recovery on benchmarks (AgentDebug).**
- Location: arXiv 2509.25370v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2509.25370v1 | Tier 3 (preprint) | benchmark claim | "a single root-cause error propagates through subsequent decisions, leading to task failure." "AgentDebug achieves 24% higher all-correct accuracy and 17% higher step accuracy compared to the strongest baseline" and "up to 26% relative improvements in task success across ALFWorld, GAIA, and WebShop."
- Use in dive: Supporting evidence that structured root-cause analysis beats free-form reflection. Keep in an expandable block.

### D. Context and memory growth limits, and prompt caching

**F04-31. Models use the start and end of a long context best and the middle worst.**
- Location: arXiv 2307.03172v3, introduction and section 2.3.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2307.03172v3 | Tier 3 (peer-reviewed, TACL 2023) | benchmark claim (measured) | "GPT-3.5-Turbo's multi-document QA performance can drop by more than 20% - in the worst case, performance in 20- and 30-document settings is lower than performance without any input documents (i.e., closedbook performance; 56.1%)."
- Use in dive: A growing playbook or reflection log pushes old lessons into the middle. Practical: put the current task state at the end, stable rules at the start.

**F04-32. Effective context is far below claimed context.**
- Claim: RULER graded 17 models against a threshold (Llama2-7B at 4K). Only half held up at 32K. GPT-4: claimed 128K, effective 64K. Llama3.1 8B: claimed 128K, effective 32K. Yi 34B: claimed 200K, effective 32K.
- Location: arXiv 2404.06654v3, abstract and Table 3.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2404.06654v3 | Tier 3 (peer-reviewed, COLM 2024) | benchmark claim (measured) | "While these models all claim context sizes of 32K tokens or greater, only half of them can maintain satisfactory performance at the length of 32K."
- Use in dive: Budget a loop's memory against effective length, not the spec-sheet number.

**F04-33. Without literal word overlap, long-context retrieval collapses earlier.**
- Location: arXiv 2502.05167v3, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2502.05167v3 | Tier 3 (peer-reviewed, ICML 2025) | benchmark claim (measured, 13 models claiming at least 128K) | "At 32K, for instance, 11 models drop below 50% of their strong short-length baselines. Even GPT-4o, one of the top-performing exceptions, experiences a reduction from an almost-perfect baseline of 99.3% to 69.7%." "Even models enhanced with reasoning capabilities or CoT prompting struggle to maintain performance in long contexts."
- Use in dive: Reflections are paraphrases of past events; retrieving the relevant lesson is a latent-association task, the hard case NoLiMa measures.

**F04-34. Context rot across 18 models (vendor report).**
- Location: Chroma technical report, 2025-07-14.
- Verdict: NEW.
- Evidence: https://research.trychroma.com/context-rot | Tier 3 (vendor technical report, not peer-reviewed; the vendor sells retrieval infrastructure, so read as an interested party) | benchmark claim | "Our results reveal that models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows."
- Use in dive: Cite only as corroboration of F04-31 to F04-33, labelled as a vendor report. It names the phenomenon the reader has heard of.

**F04-35. Anthropic treats context as a finite "attention budget" and recommends compaction, notes and sub-agents.**
- Location: Anthropic engineering post, 2025-09-29.
- Verdict: NEW.
- Evidence: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Tier 2 (first-party lab blog) | argued plus observation | "While some models exhibit more gentle degradation than others, this characteristic emerges across all models. Context, therefore, must be treated as a finite resource with diminishing marginal returns." The n² pairwise-attention explanation is argued, not measured. Recommended techniques: "compaction, structured note-taking, and multi-agent architectures." Also: "We're already seeing that smarter models require less prescriptive engineering".
- Use in dive: First-party practitioner framing that Ralph (F04-69) and autoresearch (F04-68) both implement in their own way.

**F04-36. Monolithic rewriting of an evolving context can collapse it (ACE case study).**
- Claim: In one AppWorld trajectory, a context rewritten in full at each step went from 18,282 tokens (accuracy 66.7) to 122 tokens (57.1) in one step, below the no-adaptation baseline of 63.7.
- Location: arXiv 2510.04618v3, section 2.2, Fig. 2.
- Verdict: NEW (single case study; ACE is covered in depth by another agent).
- Evidence: https://arxiv.org/html/2510.04618v3 | Tier 3 (peer-reviewed, ICLR 2026) | benchmark claim (measured, one case study) | "at step 60 the context contained 18,282 tokens and achieved an accuracy of 66.7, but at the very next step it collapsed to just 122 tokens, with accuracy dropping to 57.1 - worse than the baseline accuracy of 63.7 without adaptation."
- Use in dive: The opposite failure to context rot: the loop that summarizes to stay short can erase what it learned. Design answer: append and edit locally, do not rewrite.

**F04-37. Evolving contexts degrade when the feedback is unreliable.**
- Location: 2510.04618v3, Table 2 caption and section 4.4; Limitations.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2510.04618v3 | Tier 3 | benchmark claim (measured) and argued | "in the absence of reliable feedback signals (e.g., ground-truth labels or execution outcomes), both ACE and other adaptive methods such as Dynamic Cheatsheet may degrade, suggesting that context adaptation depends critically on feedback quality." "In such cases, the constructed context can be polluted by spurious or misleading signals". Limitations: "A limitation of ACE is its reliance on a reasonably strong Reflector".
- Use in dive: Same lesson as F04-21 at the memory level: the playbook is only as good as the signal that writes it.

**F04-38. Prompt caching matches exact prefixes; any edit invalidates everything after it (Anthropic).**
- Claim: The cache key covers tools, then system, then messages, up to the breakpoint. Changing a level invalidates that level and every later one. Hits need 100% identical segments. In a growing conversation the last-block breakpoint works if each turn adds fewer than 20 blocks.
- Location: Anthropic prompt caching docs, "Structuring your prompt", "How automatic prefix checking works", "What invalidates the cache", "Cache storage and sharing".
- Verdict: NEW.
- Evidence: https://platform.claude.com/docs/en/build-with-claude/prompt-caching | Tier 1 (first-party product docs) | definition | "Prompt caching references the entire prompt: `tools`, `system`, and `messages` (in that order), up to and including the block designated with `cache_control`." "the cache follows the hierarchy: `tools` -> `system` -> `messages`. Changes at each level invalidate that level and all subsequent levels." "Cache hits require 100% identical prompt segments, including all text and images up to and including the block marked with cache control." "In a growing conversation the final block works as long as each turn adds fewer than 20 blocks".
- Use in dive: The practical cost of a learning context: editing the system prompt or an early playbook entry re-prices the whole conversation. Append-only memory and fresh-context loops are cache-friendly; in-place edits near the top are not.

**F04-39. Cache pricing makes a stable prefix cheap and a churned prefix expensive (Anthropic).**
- Location: Anthropic prompt caching docs, "Pricing".
- Verdict: NEW.
- Evidence: https://platform.claude.com/docs/en/build-with-claude/prompt-caching | Tier 1 | definition | "5-minute cache write tokens are 1.25 times the base input tokens price", "1-hour cache write tokens are 2 times the base input tokens price", "Cache read tokens are 0.1 times the base input tokens price (see the table footnote for per-model exceptions)".
- Use in dive: A context that changes every iteration pays the write premium every iteration and never collects the read discount. Simple arithmetic the reader can apply to his own loops.

**F04-40. Bedrock states the same rule: changed prefix, cache miss.**
- Location: Amazon Bedrock User Guide, "Prompt caching for faster model inference".
- Verdict: NEW.
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html | Tier 1 (AWS docs) | definition | "Prompt prefixes should remain static between requests. Changes to a prompt prefix in subsequent requests result in cache misses." Implicit caching: "Keep static content at the beginning of your prompt and dynamic content at the end to increase the likelihood of an exact prefix match." "Implicit Prompt Caching is best effort."
- Use in dive: The AWS-side citation for the same practical rule; relevant to the reader's customers on Bedrock.

**F04-41. ACE's high cache-reuse figure was measured with the context frozen.**
- Claim: ACE reports 91.8% of input tokens served from cache and 82.6% lower billed input cost (OpenAI API, GPT-5.1) during the evaluation stage. During adaptation, ACE updates existing bullets in place (for example, incrementing helpful/harmful counters), which under exact-prefix caching (F04-38, F04-40) invalidates the cache from the first edited position onward.
- Location: 2510.04618v3, "KV Cache Reuse: Longer Context ≠ Higher Serving Cost"; section 3.1 (grow-and-refine).
- Verdict: NEW for the reported figure; the adaptation-stage effect is an inference, see U-1.
- Evidence: https://arxiv.org/html/2510.04618v3 | Tier 3 | benchmark claim (measured, evaluation stage) | "we find that ACE achieves high cache reuse: 91.8% of input tokens are served from cache during evaluation stage, which reduces billed input-token cost by 82.6% relative to counting raw context tokens." "In grow-and-refine, bullets with new identifiers are appended, while existing bullets are updated in place (e.g., incrementing counters)." The adaptation-stage consequence is [SPECULATIVE: derived by combining the ACE design statement with the Tier 1 caching rules; no measurement located].
- Use in dive: Teaches the reader to ask "measured while the context was changing or while it was frozen?" of any cache-economics claim.

**F04-42. A growing self-refinement context can stop helping (argued).**
- Location: 2506.06303v6, creative writing results.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2506.06303v6 | Tier 3 (preprint) | benchmark observation with argued cause | "self-refine first plateaus, then declines, likely due to the significant growth of its context."
- Use in dive: Supporting example only; the cause is the authors' interpretation.

### E. The weights vs context boundary

**F04-43. New facts: retrieval beats unsupervised fine-tuning, and paraphrases are what make fine-tuning work at all.**
- Claim: On a current-events task built from facts after the models' cutoff, Mistral 7B scored 0.481 base, 0.875 with RAG, 0.504 fine-tuned on the documents, 0.588 fine-tuned on paraphrases. Llama2 7B fine-tuned on the documents fell below base (0.219 vs 0.353).
- Location: arXiv 2312.05934v3, abstract and Table 2.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2312.05934v3 | Tier 3 (preprint; venue not confirmed in this research) | benchmark claim (measured) | "RAG consistently outperforms it, both for existing knowledge encountered during training and entirely new knowledge. Moreover, we find that LLMs struggle to learn new factual information through unsupervised fine-tuning, and that exposing them to numerous variations of the same fact during training could alleviate this problem."
- Use in dive: Task facts live in context. Strongest number: 0.875 vs 0.504 on Mistral 7B.

**F04-44. In-context learning generalizes some inferences more flexibly than fine-tuning on the same data.**
- Location: arXiv 2505.00661v3, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2505.00661v3 | Tier 3 (NeurIPS 2025 FoRLM workshop) | benchmark claim (controlled study) | "in data-matched settings, ICL can generalize several types of inferences more flexibly than fine-tuning (though we also find some qualifications of prior findings, such as cases when fine-tuning can generalize to reversals embedded in a larger structure of knowledge)." Proposed fix: "adding in-context reasoning traces to finetuning data."
- Use in dive: Context is not only cheaper for facts; for reversals and simple deductions over new facts it can generalize better.

**F04-45. Context distillation moves prompt gains into weights, and can exceed the context window.**
- Location: arXiv 2209.15189v1, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2209.15189v1 | Tier 3 (preprint) | benchmark claim | "they do not internalize these performance gains, which disappear when the context tokens are gone." It "can internalize abstract task instructions and explanations", "step-by-step reasoning for complex tasks (e.g., 8-digit addition)", and "concrete training examples, and it outperforms directly learning with gradient descent by 9% on the SPIDER Text-to-SQL dataset; furthermore, combining context distillation operations can internalize more training examples than the context window size allows."
- Use in dive: The bridge from text loop to weights: a playbook found by a loop can later be distilled so the prompt, its tokens and its latency go away.

**F04-46. A prompt optimizer can beat RL fine-tuning on sample efficiency, under specific conditions (GEPA headline).**
- Claim: GEPA vs GRPO on Qwen3 8B: GRPO with LoRA at 24,000 rollouts (a full-finetuning comparison is also reported); six tasks; GEPA +6% on average, up to +20%, with up to 35x fewer rollouts. GEPA prompts are up to 9.2x shorter than MIPROv2's.
- Location: arXiv 2507.19457v2, abstract, Fig. 1, experimental setup, Observation 4. Covered in depth by another agent.
- Verdict: NEW (conditions recorded).
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 (peer-reviewed, ICLR 2026 Oral) | benchmark claim | "Across six tasks, GEPA outperforms GRPO by 6% on average and by up to 20%, while using up to 35x fewer rollouts." Setup: "We use LoRA for GRPO due to its low cost". "prompts produced by GEPA and GEPA+Merge are up to 9.2x shorter than those from MIPROv2".
- Use in dive: The reverse case, scoped: a low-rollout regime, an 8B open model, LoRA GRPO as the comparison. It shows text loops winning when rollouts are scarce and the task needs rules the model can already follow.

**F04-47. Forgetting tracks how far fine-tuning moves the model, and on-policy RL moves it less.**
- Claim: Forgetting is predicted by the KL divergence between fine-tuned and base policy on the new task (quadratic fit R² 0.96 on ParityMNIST, 0.71 in LLM experiments). RL prefers KL-minimal solutions; an oracle SFT distribution with minimal KL forgot even less than RL.
- Location: arXiv 2509.04259v1, introduction and section on KL as predictor.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2509.04259v1 | Tier 3 (preprint) | benchmark claim (measured) plus theory in a simplified setting | "the degree of forgetting is accurately predicted by Ex∼τ KL(π0||π), the KL divergence between the fine-tuned and base policy evaluated on the new task." "Training on this oracle distribution produces even less forgetting than RL itself. This demonstrates that RL's advantage does not stem from being inherently different, but from its implicit KL minimization."
- Use in dive: The cost side of weight updates, as a mental model: every weight change has a distance, and distance is what you lose elsewhere. A frozen model plus context pays zero distance.

**F04-48. RL generalized out of distribution where SFT memorized (GeneralPoints, V-IRL).**
- Claim: On out-of-distribution rule variants, RL improved GeneralPoints-Language 11.5% -> 15.0% and V-IRL-Language 80.8% -> 91.8%; SFT degraded them to 3.4% and 1.3%. SFT was still needed first when the backbone did not follow instructions.
- Location: arXiv 2501.17161v2, section 5.1 and "SFT is necessary for RL training when the backbone model does not follow instructions".
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2501.17161v2 | Tier 3 (peer-reviewed, ICML 2025) | benchmark claim (measured; Llama-3.2-Vision-11B backbone) | "RL achieves an increase of +3.5% on GP-L (11.5% -> 15.0%) and +11.0% on V-IRL-L (80.8% -> 91.8%)." "SFT consistently exhibits performance degradation across all OOD evaluations on all tasks: -8.1% on GP-L (11.5% -> 3.4%), -79.5% on V-IRL-L (80.8% -> 1.3%)". "without SFT, all end-to-end RL runs fail to improve."
- Use in dive: "How" the weights change matters as much as "whether". Outcome-reward RL is the weight update that transfers.

**F04-49. Whether RL with verifiable rewards adds new reasoning or sharpens existing reasoning is contested.**
- Claim: One study finds RL with verifiable rewards (RLVR) beats the base model at pass@1 but the base model wins at large k, so abilities are bounded by the base; distillation from a stronger teacher does add new patterns. A second study finds prolonged RL with KL control and reference resets reaches problems the base model fails at any k.
- Location: arXiv 2504.13837v5, abstract; arXiv 2505.24864v1, abstract.
- Verdict: NEW (contested; see section 6).
- Evidence: https://arxiv.org/abs/2504.13837v5 | Tier 3 (peer-reviewed: the arXiv record's journal reference reads "NeurIPS 2025 Oral", checked 2026-10-17) | benchmark claim | "While RLVR-trained models outperform their base models at small k (e.g., k = 1), the base models achieve a higher pass@k score when k is large." "distillation can introduce new reasoning patterns from the teacher and genuinely expand the model's reasoning capabilities." Counter: https://arxiv.org/abs/2505.24864v1 | Tier 3 (preprint) | benchmark claim | "RL-trained models consistently outperform base models across a wide range of pass@k evaluations, including scenarios where base models fail entirely regardless of the number of attempts."
- Use in dive: If RLVR mostly sharpens, then best-of-k plus a verifier in a text loop recovers much of the effect at higher inference cost. That is the bridge to the dive's "which parts can a loop reproduce" question. Present both sides.

**F04-50. Diffuse or calibrated sampling distributions are set in weights; prompts do not fix them.**
- Claim: Instruction-tuned models asked for random outputs are heavily biased (Llama-2-13B-chat favors "five"; in 1000 samples none of the tested models produced all ten digits). A fine-tuning method fixes it; untuned models would need temperature above 10 to match the fine-tuned entropy.
- Location: arXiv 2404.10859v2, abstract, section 3, footnote 6.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2404.10859v2 | Tier 3 (peer-reviewed, COLM 2024) | benchmark claim (measured) | "when prompted to pick a number uniformly between one and ten Llama-2-13B-chat disproportionately favors the number five". "Surprisingly, in 1000 samples, none of the models were able to generate all ten numbers." "the untuned, baseline models need to be sampled at a temperature > 10 to match the entropy of our fine-tuned models".
- Use in dive: Exploration needs controlled randomness. That randomness is a property of the weights, which is one mechanism behind section B's greediness.

**F04-51. Post-training changes calibration, in both directions.**
- Location: arXiv 2303.08774v6, section on limitations, Fig. 8.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.08774v6 | Tier 2 (first-party lab technical report) | benchmark claim (measured on an MMLU subset) | "the pre-trained model is highly calibrated (its predicted confidence in an answer generally matches the probability of being correct). However, after the post-training process, the calibration is reduced (Figure 8)." Caption: "The post-training hurts calibration significantly."
- Use in dive: Calibration is a weight-level property that training sets and can damage; a prompt asking "be calibrated" has no lever on it.

**F04-52. Prompt-format sensitivity persists with scale and instruction tuning.**
- Location: arXiv 2310.11324v2, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2310.11324v2 | Tier 3 (peer-reviewed, ICLR 2024) | benchmark claim | "performance differences of up to 76 accuracy points when evaluated using LLaMA-2-13B. Sensitivity remains even when increasing model size, the number of few-shot examples, or performing instruction tuning." "format performance only weakly correlates between models".
- Use in dive: Two practical consequences: a prompt optimized on one model may not transfer to the next model (relevant to model upgrades), and some measured "learning" in a text loop is format search.

**F04-53. Small models make poor prompt optimizers.**
- Location: arXiv 2405.10276v2, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2405.10276v2 | Tier 3 (preprint) | benchmark claim | "OPRO shows limited effectiveness in small-scale LLMs, with limited inference capabilities constraining optimization ability."
- Use in dive: The optimizer model's capability bounds a text loop, separately from the target model's. Evidence on how gains scale with the target model's size was not located (U-4).

### F. Formal frames: context as policy parameters, the LLM as optimizer

**F04-54. Reflexion defines the policy as model weights plus memory text.**
- Location: 2303.11366v4, contributions and introduction.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2303.11366v4 | Tier 3 | definition and analogy | "a new paradigm for 'verbal' reinforcement that parameterizes a policy as an agent's memory encoding paired with a choice of LLM parameters." "This self-reflective feedback acts as a 'semantic' gradient signal". Limitations: "Reflexion is an optimization technique that uses natural language to do policy optimization."
- Use in dive: The cleanest one-line definition of what a text loop is in RL vocabulary. It is a definition, not a theorem: nothing guarantees improvement.

**F04-55. Retroformer gives the formal reduction: fold the frozen model into the environment.**
- Claim: With the actor frozen, the composite of environment and actor is a new environment whose actions are prompts; ordinary RL applies to whatever writes the prompt.
- Location: 2308.02151v3, section 4 (after Eq. 2).
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2308.02151v3 | Tier 3 | theory (definitional reduction, not a theorem) | "Note that the only learnable parameters are in the retrospective model Mr. Since LLM action agent is frozen, it can be considered as part of the environment. Specifically, if we construct another environment with the transition function T′ = T(S, •) ◦ L : S × X -> S, and the same reward function R, then Eq. (2) is just a regular RL optimization so all the popular RL algorithms apply."
- Use in dive: The mental model the dive can build on: in a text loop, the context writer is the agent and the frozen model is part of the world. The writer can be a human (Ralph), an LLM (Reflexion, GEPA) or a trained model (Retroformer).

**F04-56. OPRO: an LLM as a black-box optimizer over a scored history of solutions, with stated limits.**
- Location: arXiv 2309.03409v3, abstract and section 3 "Limitations".
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2309.03409v3 | Tier 3 (peer-reviewed, ICLR 2024) | benchmark claim and argued | "In each optimization step, the LLM generates new solutions from the prompt that contains previously generated solutions with their values". Limitations (https://arxiv.org/pdf/2309.03409v3): "OPRO is designed for neither outperforming the stateof-the-art gradient-based optimization algorithms for continuous mathematical optimization, nor surpassing the performance of specialized solvers". "the length limit of the LLM context window makes it hard to fit large-scale optimization problem descriptions in the prompt". "the optimization landscape of some objective functions are too bumpy for the LLM to propose a correct descending direction, causing the optimization to get stuck halfway."
- Use in dive: The scored-history meta-prompt is exactly Krishnamurthy's "summarized history" (F04-10): keep score outside the model, feed it back compactly.

**F04-57. TextGrad calls its gradients a metaphor.**
- Location: arXiv 2406.07496v1, section 1; journal version Nature 639 (2025), https://www.nature.com/articles/s41586-025-08661-4.
- Verdict: NEW.
- Evidence: https://arxiv.org/pdf/2406.07496v1 | Tier 3 (preprint; peer-reviewed journal version exists) | analogy | "Here we use differentiation and gradients as a metaphor for textual feedback from LLMs."
- Use in dive: Quote it when the dive says "textual gradient", so the reader knows nothing is differentiated.

**F04-58. In-context learning equals gradient descent: proven for linear self-attention on regression.**
- Location: arXiv 2212.07677v2, abstract.
- Verdict: NEW.
- Evidence: https://arxiv.org/abs/2212.07677v2 | Tier 3 (peer-reviewed, ICML 2023) | theory/proof (construction) plus empirical match | "a simple weight construction that shows the equivalence of data transformations induced by 1) a single linear self-attention layer and by 2) gradient-descent (GD) on a regression loss." Scope: "at least in the domain of regression problems".
- Use in dive: The proven part is narrow and deliberate; the dive should state its scope in the same sentence.

**F04-59. For real pretrained LLMs, "ICL is gradient descent" remains an open hypothesis.**
- Claim: A paper on GPT-scale models argued ICL behaves like implicit fine-tuning; a later study testing LLaMa-7B found ICL and GD differ in order sensitivity and in how they change the output distribution, and that earlier verifications trained models explicitly for ICL.
- Location: arXiv 2212.10559v3, abstract; arXiv 2310.08540v5, abstract.
- Verdict: NEW (contested).
- Evidence: https://arxiv.org/abs/2212.10559v3 | Tier 3 (peer-reviewed, ACL 2023 Findings) | argued plus benchmark | "Experimental results show that in-context learning behaves similarly to explicit finetuning from multiple perspectives." Counter: https://arxiv.org/abs/2310.08540v5 | Tier 3 (preprint; venue not confirmed here) | benchmark claim | "their experimental verification uses ICL objective (training models explicitly for ICL), which differs from the emergent ICL in the wild." "These results indicate that the equivalence between ICL and GD remains an open hypothesis".
- Use in dive: Same pattern as section A: the clean result holds when the model was trained for in-context learning; for a general LLM it is an analogy.

### G. Seeds

#### Karpathy autoresearch

**F04-60. Identity and pin.**
- Claim: Repository karpathy/autoresearch, created 2026-03-06; pinned at master HEAD 228791fb499afffb54b46200aca536f79142f117 (2026-03-26). MIT licence. Three files matter: prepare.py (fixed), train.py (agent edits), program.md (human edits).
- Location: README.md lines 11-15.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L11-L15 | Tier 2 (author's own README about his own method) | practitioner design | "**`train.py`** - the single file the agent edits." "**`program.md`** - baseline instructions for one agent. Point your agent here and let it go. **This file is edited and iterated on by the human**."
- Use in dive: Seed profile, section 4.

**F04-61. One editable artifact, one metric, fixed budget per experiment.**
- Location: README.md line 17 and lines 61-65; prepare.py line 31.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L17 | Tier 2 | practitioner design | "training runs for a **fixed 5-minute time budget** (wall clock, excluding startup/compilation), regardless of the details of your compute. The metric is **val_bpb** (validation bits per byte) - lower is better, and vocab-size-independent so architectural changes are fairly compared." Code: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/prepare.py#L31 | Tier 1 | code behaviour | `TIME_BUDGET = 300        # training time budget in seconds (5 minutes)`.
- Use in dive: The fixed budget makes every reward comparable, like a fixed episode length in RL. README notes the cost: results are not comparable across hardware.

**F04-62. The keep-or-revert rule.**
- Location: program.md lines 94-104.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L94-L104 | Tier 1 (the loop's executable instruction artifact) | code behaviour | "8. If val_bpb improved (lower), you \"advance\" the branch, keeping the git commit" / "9. If val_bpb is equal or worse, you git reset back to where you started".
- Use in dive: In RL terms this is greedy hill-climbing with rejection: a (1+1) evolution-strategy style search where git is the policy store. No exploration term.

**F04-63. A complexity penalty written into the reward.**
- Location: program.md line 37.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L37 | Tier 1 | code behaviour | "**Simplicity criterion**: All else being equal, simpler is better. [...] A 0.001 val_bpb improvement that adds 20 lines of hacky code? Probably not worth it. A 0.001 val_bpb improvement from deleting code? Definitely keep."
- Use in dive: Reward shaping in prose: the agent judges the trade, so the shaping is only as consistent as the model applying it.

**F04-64. Scorekeeping lives outside the model: results.tsv and git.**
- Location: program.md lines 64-88 and line 102.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L64-L88 | Tier 1 | code behaviour | columns "commit	val_bpb	memory_gb	status	description" with status "`keep`, `discard`, or `crash`"; line 102: "do not commit the results.tsv file, leave it untracked by git".
- Use in dive: The loop keeps sufficient statistics externally, as Krishnamurthy's one successful configuration required (F04-10).

**F04-65. The metric's guard is prose; the evaluated code is agent-editable (reward hacking surface).**
- Claim: program.md forbids editing prepare.py and the evaluation, but nothing enforces it, and the README tells users to run the agent with permissions disabled. evaluate_bpb (prepare.py) scores by calling `model(x, y, reduction='none')`, and the model's forward pass, including the loss, is defined in train.py, which the agent edits. The time-budget stop condition is also in train.py.
- Location: program.md lines 28-31; README.md line 44; prepare.py lines 340-365; train.py lines 268, 603, 613.
- Verdict: NEW (category C, code-derived inference, read 2026-10-16).
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/prepare.py#L340-L359 | Tier 1 | code behaviour | `# Evaluation (DO NOT CHANGE - this is the fixed metric)` ... `loss_flat = model(x, y, reduction='none').view(-1)`. https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L603 | `if step > 10 and total_training_time >= TIME_BUDGET:`. https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L44 | "Simply spin up your Claude/Codex or whatever you want in this repo (and disable all permissions)". A third-party issue reports the same surfaces (https://github.com/karpathy/autoresearch/issues/599, Tier 4, opened 2026-05-31; its claims checked here against the code).
- Use in dive: The strongest practitioner example of "the verifier is the reward function and its leaks are the hack surface". The design answer in RL terms is to move the evaluator out of the policy's reach (separate process or read-only mount), which this repo leaves to the operator.

**F04-66. Credit assignment by construction: one idea per commit, fixed seed, no noise floor.**
- Claim: Each experiment is one commit and one metric reading, so a reward delta is attributed to one edit. train.py fixes the seed. program.md keeps any improvement, with no rule for run-to-run noise.
- Location: program.md lines 96-104; train.py lines 458-459.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L458-L459 | Tier 1 | code behaviour | `torch.manual_seed(42)` / `torch.cuda.manual_seed(42)`. The noise magnitude is not established: a third-party proposal argues "CUDA kernel jitter pushes the empirical floor to a few × 1e-4" (https://github.com/karpathy/autoresearch/pull/560, Tier 4, unverified).
- Use in dive: One-edit-per-trial is the cleanest credit assignment a text loop can buy. The missing noise floor means small "wins" can be noise; see U-2.

**F04-67. Context hygiene inside each experiment.**
- Location: program.md line 99.
- Verdict: NEW.
- Evidence: https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L99 | Tier 1 | code behaviour | "Run the experiment: `uv run train.py > run.log 2>&1` (redirect everything - do NOT use tee or let output flood your context)".
- Use in dive: The same design pressure as Ralph's fresh context: keep the agent's working set small and read only the number that matters.

#### Huntley's Ralph loop

**F04-68. Primary source and core form.**
- Location: ghuntley.com/ralph, published 2025-07-14 (page metadata shows modification on 2026-02-19).
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 (author's own post about his own method) | practitioner design | "Ralph is a technique. In its purest form, Ralph is a Bash loop." `while :; do cat PROMPT.md | claude-code ; done`. "Ralph is monolithic. Ralph works autonomously in a single repository as a single process that performs one task per loop."
- Use in dive: Seed profile, section 4.

**F04-69. Fresh context each iteration is the design answer to context degradation.**
- Claim: Each iteration re-reads the same plan and specs from files ("allocate the stack the same way every loop"); the operator keeps the main context small and pushes expensive work into subagents.
- Location: ghuntley.com/ralph, sections "one item per loop", "extend the context window".
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 | practitioner design (argued, not measured) | "the other key thing is deterministically allocate the stack the same way every loop." "The name of the game is that you only have approximately 170k of context window to work with. So it's essential to use as little of it as possible. The more you use the context window, the worse the outcomes you'll get." "Your primary context window should operate as a scheduler, scheduling other subagents to perform expensive allocation-type work".
- Use in dive: The practitioner's answer to F04-31 to F04-35. A fresh context per iteration also yields a stable, cacheable prefix (F04-38). Repeat: state lives in files, not in the context window.

**F04-70. Backpressure is the reward signal.**
- Location: ghuntley.com/ralph, "phase two: backpressure".
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 | practitioner design | "Anything can be wired in as back pressure to reject invalid code generation. That could be security scanners, it could be static analysers, it could be anything. But the key collective sum is that the wheel has got to turn fast." Also: "only a single subagent should be used for validation".
- Use in dive: Maps directly to F04-21: Ralph without tests is Reflexion without tests.

**F04-71. Huntley names reward hacking in his own terms.**
- Location: ghuntley.com/ralph, "no cheating".
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 | practitioner design | "Claude has the inherent bias to do minimal and placeholder implementations." "The models have been trained to chase their reward function, and the reward function is compiling code. You can always run more Ralphs to identify placeholders and minimal implementations and transform that into a to-do list for future Ralph loops."
- Use in dive: The weights' training reward leaks into the loop's behaviour. The fix is more verification and prompt "signs", which is policy shaping by text.

**F04-72. Credit and rationale are carried across iterations in files; the human is the outer optimizer.**
- Location: ghuntley.com/ralph, "capture the importance of tests in the moment", "ralph can take himself to university", "the todo list".
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 | practitioner design | "leaving little notes for future iterations by the LLM, explaining why a test exists and its importance because future loops will not have the reasoning in their context window." "When you learn something new about how to run the compiler or examples make sure you update @AGENT.md". "Through building of CURSED, I have deleted the TODO list multiple times." "Each time Ralph does something bad, Ralph gets tuned - like a guitar."
- Use in dive: Two learners at two timescales: the model edits AGENT.md and the plan (fast, in files); the human edits PROMPT.md after watching failures (slow, by judgement). Neither touches weights.

**F04-73. Stated scope, then generalized.**
- Location: ghuntley.com/ralph (closing); ghuntley.com/loop (2026-01-17).
- Verdict: NEW.
- Evidence: https://ghuntley.com/ralph/ | Tier 2 | practitioner claim | "There's no way in heck would I use Ralph in an existing code base" and "This works best as a technique for bootstrapping Greenfield, with the expectation you'll get 90% done with it." https://ghuntley.com/loop/ | Tier 2 | practitioner claim | "Ralph is an orchestrator pattern where you allocate the array with the required backing specifications and then give it a goal then looping the goal." "ralph is about getting the most out how the underlying models work through context engineering and that pattern is GENERIC and can be used for ALL TASKS." "It's important to watch the loop as that is where your personal development and learning will come from."
- Use in dive: The 90% figure is the author's estimate, not a measurement; present it as such.

**F04-74. The "how-to-ralph-wiggum" playbook in Huntley's GitHub account is a fork of a third-party guide.**
- Claim (in circulation): the GitHub "Ralph Playbook" is Huntley's own document.
- Verdict: WRONG. ghuntley/how-to-ralph-wiggum is a fork of ClaytonFarr/ralph-playbook; all listed commits are by Clayton Farr; the README describes itself as his synthesis of Huntley's post and videos. Its loop.sh is a concrete, pinned implementation of a Ralph loop and is useful as code, but it is not Huntley's text.
- Evidence: `gh api repos/ghuntley/how-to-ralph-wiggum` returns `"fork":true,"parent":"ClaytonFarr/ralph-playbook"` | Tier 1 (GitHub API metadata) | code behaviour. README at https://github.com/ghuntley/how-to-ralph-wiggum/blob/88d488a148af97e4a3f22b11b4c3598c79d6a577/README.md | Tier 4 (third-party synthesis) | "I wanted to read the tea leaves as closely as possible from the person who not only captured this approach". Loop code: https://github.com/ghuntley/how-to-ralph-wiggum/blob/88d488a148af97e4a3f22b11b4c3598c79d6a577/files/loop.sh#L43-L70 | Tier 1 for what this script does | `cat "$PROMPT_FILE" | claude -p \` / `--dangerously-skip-permissions \` ... `git push origin "$CURRENT_BRANCH"`. README line 337: "Each iteration = one fresh context window = one task from IMPLEMENTATION_PLAN.md = one commit".
- Use in dive: Cite Huntley's post for the method and the playbook only as an example implementation, labelled third-party.

#### The adaptation taxonomy

**F04-75. Identity, version and authorship.**
- Claim: arXiv 2512.16301. v1 (2025-12-18) titled "Adaptation of Agentic AI"; v3 (2026-03-09) retitled "Adaptation of Agentic AI: A Survey of Post-Training, Memory, and Skills". First author Pengcheng Jiang, 34 authors. The four categories are already in the v1 abstract. Preprint.
- Location: arXiv abstract pages for v1 and v3.
- Verdict: NEW (the brief's identification is correct; the current title differs from the v1 title).
- Evidence: https://arxiv.org/abs/2512.16301v3 | Tier 3 (preprint) | definition | v1 abstract: "We further decompose these into tool-execution-signaled and agent-output-signaled forms of agent adaptation, as well as agent-agnostic and agent-supervised forms of tool adaptation."
- Use in dive: Cite v3 and note the title change, so readers who search for the v1 title find it.

**F04-76. The taxonomy, verbatim.**
- Location: 2512.16301v3, Figure 1 caption and section 1.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2512.16301v3 | Tier 3 | definition | Agent: "the foundation models serving as orchestration and reasoning modules". Tool: "callable components other than the agent model that operate independently, e.g., APIs, ML models, subagents, or memory." "Agent Adaptation modifies the agent's internal parameters, representations, or behavioral policies to meet task requirements". "Tool Adaptation shifts the optimization target to the agent's external tools (retrievers, planners, memory modules, specialized models), enabling frozen agents to benefit from an adaptive operational environment". A1: "The agent is optimized using verifiable outcomes produced by external tools it invokes." A2: "The agent is optimized using evaluations of its own outputs, e.g., final answers, plans, or reasoning traces, possibly after incorporating tool results." T1: "Tools are trained independently of the frozen agent." T2: "The agent remains fixed while its tools are adapted using signals derived from the agent's outputs. This paradigm includes reward-driven retriever tuning, adaptive rerankers, search subagents, and memory-update modules trained to better support the frozen agent."
- Use in dive: Candidate organizing frame. Full verbatim profile in section 4.

**F04-77. The two axes, and the classification rule for mixed methods.**
- Location: 2512.16301v3, section 1 contributions and Conclusion.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2512.16301v3 | Tier 3 | definition | "two axes - locus of optimization (agent vs. tool) and signal source (execution-grounded vs. output-evaluated)". "These four strategies overlap in practice; we treat them as a working classification. When a method simultaneously modifies both the agent and a tool, we assign it to the paradigm corresponding to its dominant locus of optimization and note the secondary component explicitly." Formal T2 objective: "T* = argmax over T of O_agent(A, T)", that is, the tool is optimized for this specific frozen agent.
- Use in dive: The second axis (where the signal comes from) lines up with section C's lesson: execution-grounded signals are what make loops converge.

**F04-78. Memory counts as a tool; external memory updated from the agent's outputs is T2.**
- Location: 2512.16301v3, section 3.2.4 "Memory and the Adaptation Paradigms".
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2512.16301v3 | Tier 3 | definition | "In this paper, the memory module is treated as a tool". "When a frozen agent produces outputs that are used to update an external memory store (e.g., episodic buffers, reflective databases, skill libraries) through a fixed or learnable write function M <- Update(M, o), the process aligns with T2". Parametric memory such as LoRA adapters is a boundary case: "When the memory update requires gradient-based changes to the agent's own parameters, the method is better classified under A1 or A2".
- Use in dive: Under this survey, Ralph's plan and AGENT.md files and ACE's playbook are T2 tool adaptation of a frozen agent.

**F04-79. Text loops land in two different cells depending on where the text is stored.**
- Claim: Reflexion, Dynamic Cheatsheet, ACE and skill libraries are classed T2 (memory as tool). Self-Refine and TextGrad, which also change no weights, are classed under A2 ("Inference-time self-refinement (no weight updates)"). A text search of the v3 HTML found no occurrence of "GEPA", "OPRO", "DSPy", "MIPRO", "prompt optimi", "Ralph" or "autoresearch"; prompt optimization of a frozen agent has no explicit cell.
- Location: 2512.16301v3, sections 4.2.1 and 5.2.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2512.16301v3 | Tier 3 | definition | "Inference-time self-refinement (no weight updates). A complementary line of work achieves adaptation at inference time, avoiding the cost of retraining." (under A2). And under T2: "These tools allow a frozen agent to store, reflect on, and learn from its own output (e.g., entire trajectories), often using verbal reinforcement or self-correction, thereby building a curriculum of strategies and avoiding repeated failures without updating the core LLM's weights".
- Use in dive: If the dive adopts this frame, it needs one explicit convention: a persisted prompt or playbook is a tool (T2), a per-query refinement is A2. The frame's agent/tool line is not the same as the weights/context line.

**F04-80. The survey's trade-off claims, with its own caveat on the headline comparison.**
- Location: 2512.16301v3, section 1 trade-offs and section 6.4.
- Verdict: NEW.
- Evidence: https://arxiv.org/html/2512.16301v3 | Tier 3 | argued plus cross-paper comparison | "tool adaptation (T1/T2) optimizes external components at lower cost but is constrained by the frozen agent's capabilities". "A1/A2 methods risk catastrophic forgetting when adapted to new tasks." Section 6.4: Search-R1 (A2) "requiring roughly 170k examples" vs s3 (T2) "achieving comparable performance (58.9% average accuracy) with only 2.4k training samples", followed by the authors' caveat: "This comparison, while suggestive, is not a controlled experiment."
- Use in dive: The survey's one-line trade-off is the dive's choice question: tool adaptation is cheap and modular and capped by the frozen agent; agent adaptation is expensive and can forget (F04-47).

---

## 2. The boundary: which improvement lives in weights and which in context

Each row: the improvement type, where the best evidence says it lives, and the register entries behind it.

1. **Task-specific facts (new knowledge after cutoff).** Context. RAG beat unsupervised fine-tuning on post-cutoff current events (Mistral 7B: 0.875 vs 0.504); fine-tuning needed many paraphrases to help at all (F04-43). In data-matched tests, ICL generalized several inference types more flexibly than fine-tuning (F04-44). Weights can hold facts, at the cost of data augmentation and the forgetting budget (F04-47).
2. **Procedures, strategies, playbooks.** Context, when a reliable signal writes them. GEPA beat LoRA-GRPO on Qwen3 8B with far fewer rollouts (F04-46); ACE gains depend on feedback quality and degrade without it (F04-37). Distillation can later move them into weights (F04-45).
3. **Constraints and output format.** Context for stating them; weights for following them reliably under rephrasing. Format sensitivity up to 76 points persists across size and instruction tuning (F04-52); SFT was needed to stabilize format before RL could work (F04-48).
4. **Exploration behaviour.** Weak in context. Frozen LLMs are greedy (F04-11), know the right action and still choose greedily (F04-12), and explore only with external summaries (F04-8, F04-10). Partial fixes live in weights (RLFT +12% coverage, F04-13; distillation, F04-14) or in loop code that keeps statistics and lets a classical algorithm decide (F04-17).
5. **Learning from failure.** Weak in context. Negative-reward episodes hurt in-context RL and were filtered out (F04-15); blame attribution on long failure logs reached 14.2% at step level (F04-26); intrinsic self-correction does not reliably help (F04-27). A trained reflector helps (F04-24). Contested by F04-16 (see section 6).
6. **Calibrated or diffuse distributions.** Weights. Random-choice bias is fixed by fine-tuning and not by prompting (F04-50); post-training measurably changes calibration (F04-51).
7. **New reasoning skill.** Contested. RLVR may mostly sharpen what the base can already sample, while distillation adds patterns (F04-49, first source); prolonged RL may expand the boundary (F04-49, second source). Context distillation internalized 8-digit addition (F04-45). If sharpening dominates, a text loop with best-of-k and a verifier recovers part of it at inference cost [SPECULATIVE].
8. **Token efficiency and latency (a shorter prompt).** Weights. Context distillation removes the instructions entirely (F04-45). Within context, evolved instructions can be shorter than few-shot prompts (F04-46: up to 9.2x vs MIPROv2), and a stable prefix is cheap via caching (F04-38, F04-39), but any edit near the top re-prices the rest (F04-38, F04-40).
9. **Retention of prior abilities (no forgetting).** Context by construction: the weights do not move. Weight updates forget in proportion to KL distance (F04-47). The context-side risk is pollution instead of forgetting (F04-37) and collapse under monolithic rewriting (F04-36).
10. **Long-horizon credit assignment.** Weak in context. Attribution accuracy falls with log length (F04-26); effective context is below claimed (F04-32, F04-33). Practitioner designs restructure the problem rather than solve it: one change per trial (F04-66), one task per fresh-context iteration (F04-69).

---

## 3. Seeds verified

### 3.1 Karpathy autoresearch
- **What it is.** A single-GPU, single-file LLM training setup in which a coding agent runs experiments autonomously overnight (F04-60).
- **Design.** One editable artifact (train.py); one metric (val_bpb, lower is better); fixed 5-minute training budget per experiment (TIME_BUDGET = 300); keep the commit if val_bpb improved, otherwise git reset; log every run to an untracked results.tsv; complexity penalty in prose; never stop (F04-61 to F04-64, F04-67).
- **RL mapping.** Policy = the coding agent (frozen model plus program.md). Action = one edit to train.py. Environment = a 5-minute training run plus evaluate_bpb. Reward = val_bpb delta (with a prose simplicity penalty). Policy improvement = greedy accept/reject in git: hill-climbing with no exploration term. Human update = editing program.md, a slow outer loop over the instructions.
- **Reward hacking.** The guard on the metric is an instruction; the metric executes agent-written model code, and the budget check is in the agent's file (F04-65, code-derived inference).
- **Credit assignment.** One idea per commit and a fixed seed give clean attribution per trial; no noise-floor rule, so sub-noise "wins" can be kept (F04-66, U-2).
- **Primary source.** https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117. Tier 1 for code and program.md behaviour; Tier 2 for the README's descriptions. The README links two X posts by Karpathy that were not fetched (U-3).

### 3.2 Huntley's Ralph loop
- **What it is.** The same prompt fed to a coding agent in an endless bash loop, one task per iteration, with all state in files (F04-68).
- **Design.** Fresh context each iteration; each iteration re-reads specs/*, a plan file (fix_plan.md, later IMPLEMENTATION_PLAN.md) and AGENT.md; the agent picks the most important item, implements it, runs the tests for it, updates the plan, commits; subagents keep the main context small; a single subagent runs build and test (F04-69, F04-70). The operator watches failures and adds "signs" to the prompt (F04-72).
- **RL mapping.** Policy = frozen model plus PROMPT.md plus the state files. Action = one task's code change. Reward = backpressure (compile, tests, type checks, scanners; later LLM-as-judge in the third-party playbook). Memory = files read at the start of each iteration, an external T2 tool under F04-78. Two learners: the agent edits the plan and AGENT.md every iteration; the human edits PROMPT.md between runs.
- **Context-growth limit.** Fresh context per iteration is the stated answer ("The more you use the context window, the worse the outcomes you'll get"); it also keeps the prompt prefix identical across iterations, which is the cache-friendly pattern in F04-38 [SPECULATIVE: cache behaviour not measured for Ralph].
- **Reward hacking.** Named by the author as the model chasing "compiling code"; mitigated by prompt signs and more loops that hunt placeholders (F04-71).
- **Primary source.** https://ghuntley.com/ralph/ and https://ghuntley.com/loop/. Tier 2. The GitHub playbook is third-party (F04-74).

### 3.3 The adaptation taxonomy ("Adaptation of Agentic AI")
- **What it is.** A survey (arXiv 2512.16301v3, preprint) organizing post-training, memory and skills under one notion of adaptation: "improving an agent, its tools, or their interaction after pretraining" (F04-75).
- **Categories (verbatim definitions in F04-76).** A1 tool-execution-signaled agent adaptation; A2 agent-output-signaled agent adaptation; T1 agent-agnostic tool adaptation; T2 agent-supervised tool adaptation.
- **Axes.** Locus of optimization (agent vs tool) and signal source (execution-grounded vs output-evaluated) (F04-77).
- **Where text loops sit.** Persisted memory, reflections, playbooks and skill libraries are T2; per-query self-refinement and TextGrad are A2 without weight updates; prompt optimizers such as GEPA and OPRO are not named (F04-79).
- **RL mapping.** A1 and A2 are RL or SFT on the agent's weights with the reward taken from tool results (A1) or output evaluation (A2). T2 is RL or curation on the tool or memory, with the frozen agent folded into the environment (the Retroformer reduction, F04-55).
- **Primary source.** https://arxiv.org/html/2512.16301v3, Tier 3 preprint.

---

## 4. Mental models worth teaching

1. **A text loop is RL in which the context is the only trainable parameter and the frozen model is part of the environment.** Whoever writes the context (the model, a human, or a small trained model) is the learner. (F04-54, F04-55, F04-72, F04-78)
2. **In-context RL is real, and it is trained in.** AD and DPT improve in context because they were trained on learning histories or optimal-action labels. A general LLM was not, so it exploits greedily unless the loop does the bookkeeping for it. (F04-1 to F04-3, F04-5, F04-8, F04-11, F04-12)
3. **Frozen models are strong proposers and weak statisticians.** Let the model generate candidates and keep score in code, as results.tsv and git do in autoresearch. (F04-10, F04-17, F04-56, F04-64)
4. **The verifier is the reward function, and its leaks are the hack surface.** Reflection helps only on top of a reliable external check. Without tests, Reflexion scored 0.52 against a 0.60 baseline; with tests, 0.68. A metric computed by code the agent can edit can be won without improving anything. (F04-21, F04-22, F04-27, F04-37, F04-65, F04-70, F04-71)
5. **Context is a working set with a cliff, and edits re-price it.** Effective length sits well below claimed length, the middle is weakest, monolithic rewrites can collapse it, and any edit invalidates the cache from that point on. The practitioner designs that work restart with a fresh context and re-read state from files. (F04-31 to F04-33, F04-36, F04-38, F04-40, F04-69)
6. **Weights hold what must be fast, calibrated, stable under rephrasing, or general; context holds what is specific, recent and auditable.** (Section 2; F04-43, F04-45, F04-47, F04-50, F04-52)

---

## 5. Contradictions and debates

1. **Can a frozen LLM do in-context RL?** No, without help: one configuration in a large bandit grid explored, and that one only with external summaries (F04-8, F04-10); Gemma2 is greedy with a knowing-doing gap (F04-11, F04-12); exploitation trails linear regression (F04-17). Yes, under conditions: positive-only filtering plus stochastic prompts (F04-15), and reward-annotated history across rounds (F04-16). Reconciliation [SPECULATIVE]: the negative results measure exploration efficiency (regret) on tasks with no semantic prior; the positive results measure best-so-far or demonstration-driven improvement on tasks where the model has strong priors and the loop curates which examples it sees.
2. **Do LLMs learn from failures in context?** Monea et al. observe no effective learning from negative-reward episodes (F04-15). Reward Is Enough reports attention heads that track low-reward responses, and Reflexion's design rests on reflecting on failures (F04-16, F04-19). Reflexion's own WebShop result and ablations show failure reflection helps only with grounded signals (F04-21, F04-23).
3. **Does RL add new reasoning or sharpen existing reasoning?** Yue et al. vs ProRL (F04-49). This decides how much of RL's effect a best-of-k text loop can reproduce.
4. **Do text loops beat RL?** GEPA beats LoRA-GRPO at 24k rollouts on Qwen3 8B (F04-46); RL beats SFT on generalization (F04-48) and shows the least forgetting among weight updates (F04-47). These answer different questions (sample efficiency at low budget vs transfer and retention) and are not in conflict.
5. **ACE on Reflector quality (internal tension in v3).** The results section claims ACE "remains effective with a much weaker Reflector", while the Limitations state "A limitation of ACE is its reliance on a reasonably strong Reflector" (https://arxiv.org/html/2510.04618v3). Both are in the same version.
6. **Schmied et al. state the knowing-doing gap two ways.** Introduction: "64% of actions when rationale is correct"; section 4.2 and Fig. 5: greedy 58% vs optimal 21% (https://arxiv.org/pdf/2504.16078v1). The dive should quote the section 4.2 figures and attribute them.
7. **Is ICL gradient descent?** Proven for linear self-attention on regression (F04-58); claimed for GPT by Dai et al. and found not to hold cleanly in LLaMa-7B by Shen et al. (F04-59).
8. **The adaptation survey classifies weight-free text loops in two cells** (A2 for per-query refinement, T2 for persisted memory) and does not name prompt optimizers (F04-79). Adopting it as the dive's frame needs an explicit convention.
9. **Ralph's scope.** "There's no way in heck would I use Ralph in an existing code base" (2025-07-14) vs "that pattern is GENERIC and can be used for ALL TASKS" (2026-01-17), both by Huntley (F04-73). The later post generalizes the pattern (context engineering in a loop) rather than retracting the earlier caution about unattended forward mode; that reading is [SPECULATIVE].
10. **ACE's cache-reuse figure vs in-place updates.** 91.8% reuse was measured at evaluation, where the context is fixed; adaptation edits bullets in place (F04-41).

---

## 6. UNKNOWN register

- **U-1.** Prefix-cache hit rate for an evolving context during adaptation (ACE, Dynamic Cheatsheet, Ralph-style plan edits). No measurement located during this research; F04-41 is an inference from design plus Tier 1 caching rules.
- **U-2.** Run-to-run noise of autoresearch's val_bpb at a fixed seed on the reference H100 setup. No first-party figure located; the only figure is a third-party estimate (F04-66). Without it, the fraction of "keep" decisions that are noise is unknown.
- **U-3.** First-party aggregate results of autoresearch runs (how much val_bpb improved, how many kept commits). The README links two X posts by Karpathy (status 2029701092347630069 and 2031135152349524125) that were not fetched; progress.png was not analysed.
- **U-4.** How prompt-optimization gains scale with the target model's size, holding the optimizer fixed. No controlled study located. Related evidence covers the optimizer's size (F04-53) and format sensitivity (F04-52); Anthropic's "smarter models require less prescriptive engineering" is a Tier 2 observation without numbers (F04-35).
- **U-5.** Controlled comparison of a fresh-context loop (Ralph) against one long-lived compacted session on the same coding task. Only practitioner claims located (F04-69, F04-35).
- **U-6.** Blame-attribution accuracy of self-reflection in single-agent coding loops with test feedback. The closest measurement is multi-agent logs (F04-26); AgentDebug is a benchmark on ALFWorld, GAIA and WebShop (F04-30).
- **U-7.** Whether current reasoning models (2026) close the combined explore-exploit gap in Krishnamurthy's setup. 2502.00225v4 tested GPT-5.2 on exploitation in isolation; the original combined protocol on 2026 models was not located.
- **U-8.** Reflexion with larger memory bounds (Ω above 3). No ablation located in the paper.
- **U-9.** Huntley's "approximately 170k of context window" and the embedded preview from his linked post ("the quality of output clips at the 147k-152k mark") are practitioner observations without a method; no measurement located.
- **U-10.** What changed in ghuntley.com/ralph between publication (2025-07-14) and the 2026-02-19 modification. A Wayback snapshot from 2026-01-01 exists; a diff was not made.
- **U-11.** Venues for 2312.05934 (Ovadia et al.) and 2310.08540 (Shen et al.). The arXiv copies read here do not state one; listed as preprints. Yue et al. (2504.13837v5) is closed: its arXiv journal reference reads "NeurIPS 2025 Oral" (checked 2026-10-17), and F04-49 now grades it peer-reviewed.

---

## 7. Reading path for a newcomer

1. **Krishnamurthy et al., "Can large language models explore in-context?" (arXiv 2403.15371v3, NeurIPS 2024).** Short and clean: one bandit, many prompts, one success, and it names exactly what the loop had to do for the model (summarize the history). It gives the reader the core gap in an afternoon.
2. **Retroformer (arXiv 2308.02151v3, ICLR 2024), introduction and section 4.** The single paragraph that folds the frozen model into the environment makes "a text loop is RL" precise, and the paper shows the hybrid fix: train only the part that does credit assignment.
3. **Huntley's Ralph post (ghuntley.com/ralph) side by side with autoresearch's program.md (pinned SHA).** Two working loops by practitioners. Read them against the RL vocabulary in section 3: what is the action, what is the reward, where the state lives, where the hack surface is.
4. **"Adaptation of Agentic AI" survey (arXiv 2512.16301v3), section 1 and section 3.2.** The A1/A2/T1/T2 vocabulary for placing any of the above, plus the memory-as-tool convention.
5. **Algorithm Distillation (arXiv 2210.14215v1, ICLR 2023).** What in-context RL looks like when a model is trained for it; it explains why a general LLM does not get it for free.

---

## 8. Source list by tier

### Tier 1: code at pinned SHA, official product docs
- karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117: program.md, prepare.py, train.py. https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117 (accessed 2026-10-16)
- ghuntley/how-to-ralph-wiggum @ 88d488a148af97e4a3f22b11b4c3598c79d6a577: files/loop.sh (code behaviour only; authored by Clayton Farr). https://github.com/ghuntley/how-to-ralph-wiggum/blob/88d488a148af97e4a3f22b11b4c3598c79d6a577/files/loop.sh (accessed 2026-10-16)
- GitHub API repository metadata for ghuntley/how-to-ralph-wiggum (fork parent). (accessed 2026-10-16)
- Anthropic prompt caching documentation. https://platform.claude.com/docs/en/build-with-claude/prompt-caching (accessed 2026-10-16)
- Amazon Bedrock prompt caching documentation. https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html (accessed 2026-10-16)

### Tier 2: first-party lab or vendor posts; authors on their own methods
- Huntley, "Ralph Wiggum as a 'software engineer'" (2025-07-14). https://ghuntley.com/ralph/ (accessed 2026-10-16)
- Huntley, "everything is a ralph loop" (2026-01-17). https://ghuntley.com/loop/ (accessed 2026-10-16)
- Karpathy, autoresearch README.md at the pinned SHA. https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md (accessed 2026-10-16)
- Anthropic engineering, "Effective context engineering for AI agents" (2025-09-29). https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (accessed 2026-10-16)
- OpenAI, GPT-4 Technical Report (arXiv 2303.08774v6). https://arxiv.org/abs/2303.08774v6 (accessed 2026-10-16)

### Tier 3: academic papers and third-party technical reports
Peer-reviewed:
- Laskin et al., Algorithm Distillation, ICLR 2023. https://arxiv.org/abs/2210.14215v1 (accessed 2026-10-16)
- Lee et al., Decision-Pretrained Transformer, NeurIPS 2023. https://arxiv.org/abs/2306.14892v1 (accessed 2026-10-16)
- Krishnamurthy et al., Can LLMs explore in-context?, NeurIPS 2024. https://arxiv.org/abs/2403.15371v3 (accessed 2026-10-16)
- Nie et al., EVOLvE, ICML 2025. https://arxiv.org/abs/2410.06238v2 (accessed 2026-10-16)
- Monea et al., LLMs Are In-Context Bandit RL Learners, COLM 2025. https://arxiv.org/abs/2410.05362v4 (accessed 2026-10-16)
- Harris and Slivkins, Should You Use Your LLM to Explore or Exploit?, UAI 2026. https://arxiv.org/abs/2502.00225v4 (accessed 2026-10-16)
- Shinn et al., Reflexion, NeurIPS 2023. https://arxiv.org/abs/2303.11366v4 (accessed 2026-10-16)
- Yao et al., Retroformer, ICLR 2024. https://arxiv.org/abs/2308.02151v3 (accessed 2026-10-16)
- Zhang et al., Which Agent Causes Task Failures and When?, ICML 2025. https://arxiv.org/abs/2505.00212v3 (accessed 2026-10-16)
- Huang et al., LLMs Cannot Self-Correct Reasoning Yet, ICLR 2024. https://arxiv.org/abs/2310.01798v2 (accessed 2026-10-16)
- Kamoi et al., When Can LLMs Actually Correct Their Own Mistakes?, TACL 2024. https://arxiv.org/abs/2406.01297v3 (accessed 2026-10-16)
- Liu et al., Lost in the Middle, TACL 2023. https://arxiv.org/abs/2307.03172v3 (accessed 2026-10-16)
- Hsieh et al., RULER, COLM 2024. https://arxiv.org/abs/2404.06654v3 (accessed 2026-10-16)
- Modarressi et al., NoLiMa, ICML 2025. https://arxiv.org/abs/2502.05167v3 (accessed 2026-10-16)
- Zhang et al., ACE, ICLR 2026. https://arxiv.org/abs/2510.04618v3 (accessed 2026-10-16)
- Agrawal et al., GEPA, ICLR 2026 Oral. https://arxiv.org/abs/2507.19457v2 (accessed 2026-10-16)
- Chu et al., SFT Memorizes, RL Generalizes, ICML 2025. https://arxiv.org/abs/2501.17161v2 (accessed 2026-10-16)
- Zhang et al., Forcing Diffuse Distributions out of Language Models, COLM 2024. https://arxiv.org/abs/2404.10859v2 (accessed 2026-10-16)
- Sclar et al., Sensitivity to Spurious Features in Prompt Design, ICLR 2024. https://arxiv.org/abs/2310.11324v2 (accessed 2026-10-16)
- Yang et al., OPRO, ICLR 2024. https://arxiv.org/abs/2309.03409v3 (accessed 2026-10-16)
- Yuksekgonul et al., TextGrad, Nature 639 (2025); arXiv preprint https://arxiv.org/abs/2406.07496v1; journal https://www.nature.com/articles/s41586-025-08661-4 (accessed 2026-10-16)
- von Oswald et al., Transformers learn in-context by gradient descent, ICML 2023. https://arxiv.org/abs/2212.07677v2 (accessed 2026-10-16)
- Dai et al., Why Can GPT Learn In-Context?, ACL 2023 Findings. https://arxiv.org/abs/2212.10559v3 (accessed 2026-10-16)
- Lampinen et al., Generalization from ICL and finetuning, NeurIPS 2025 FoRLM workshop. https://arxiv.org/abs/2505.00661v3 (accessed 2026-10-16)
- Yue et al., Does RL Really Incentivize Reasoning Capacity Beyond the Base Model?. https://arxiv.org/abs/2504.13837v5 NeurIPS 2025 Oral per the arXiv journal reference (accessed 2026-10-16; venue checked 2026-10-17)

Preprints:
- Schmied et al., LLMs are Greedy Agents. https://arxiv.org/abs/2504.16078v1 (accessed 2026-10-16)
- Reward Is Enough: LLMs Are In-Context RL Learners. https://arxiv.org/abs/2506.06303v6 (accessed 2026-10-16)
- LLM-Enhanced Multi-Armed Bandits. https://arxiv.org/abs/2502.01118v1 (accessed 2026-10-16)
- Semantic Bandits. https://arxiv.org/abs/2608.16707v1 (accessed 2026-10-16)
- Renze and Guven, Self-Reflection in LLM Agents. https://arxiv.org/abs/2405.06682v3 (accessed 2026-10-16)
- Accurate Failure Prediction in Agents Does Not Imply Effective Failure Prevention. https://arxiv.org/abs/2602.03338v1 (accessed 2026-10-16)
- Where LLM Agents Fail and How They Can Learn From Failures (AgentDebug). https://arxiv.org/abs/2509.25370v1 (accessed 2026-10-16)
- Ovadia et al., Fine-Tuning or Retrieval?. https://arxiv.org/abs/2312.05934v3 (accessed 2026-10-16)
- Snell et al., Learning by Distilling Context. https://arxiv.org/abs/2209.15189v1 (accessed 2026-10-16)
- Shenfeld et al., RL's Razor. https://arxiv.org/abs/2509.04259v1 (accessed 2026-10-16)
- Liu et al., ProRL. https://arxiv.org/abs/2505.24864v1 (accessed 2026-10-16)
- Zhang et al., Revisiting OPRO. https://arxiv.org/abs/2405.10276v2 (accessed 2026-10-16)
- Shen et al., Do pretrained Transformers Learn In-Context by Gradient Descent?. https://arxiv.org/abs/2310.08540v5 (accessed 2026-10-16)
- Jiang et al., Adaptation of Agentic AI: A Survey of Post-Training, Memory, and Skills. https://arxiv.org/abs/2512.16301v3 (accessed 2026-10-16)

Third-party technical report:
- Hong, Troynikov, Huber (Chroma), Context Rot (2025-07-14), vendor report, not peer-reviewed. https://research.trychroma.com/context-rot (accessed 2026-10-16)

### Tier 4: inspiration only, not cited as fact
- Clayton Farr, The Ralph Playbook (README of ghuntley/how-to-ralph-wiggum, fork of ClaytonFarr/ralph-playbook). https://github.com/ghuntley/how-to-ralph-wiggum/blob/88d488a148af97e4a3f22b11b4c3598c79d6a577/README.md (accessed 2026-10-16)
- karpathy/autoresearch issue #599 (metric integrity) and pull request #560 (noise floor), by third parties. https://github.com/karpathy/autoresearch/issues/599 and https://github.com/karpathy/autoresearch/pull/560 (accessed 2026-10-16)
