# RL and Agentic Learning Loops: Scope and Section Plan

**Title:** Learning From Feedback: RL and Agentic Learning Loops
**Subtitle:** What reinforcement learning does to a language model, which part of that effect a loop can reproduce in words with a frozen model, where the words fall short, and how to choose between them
**Status:** Scoping v1 (2026-10-17). Research wave 1 complete; app not built.
**Predecessor deep dives:** vLLM Inference Engine (the rollout engine inside every RL step), Caching (prefix reuse, which an evolving context defeats), Silicon, Memory and Modern Inference (the DGX Spark used for the Tier 0 lab)

**How to read the evidence markers.** Bracketed IDs such as (F03-61) point to claim-register entries in `research/2026-10/NN-*.md`. Each entry carries the pinned source (arXiv ID with version, release tag or 40-character SHA, or first-party doc URL), its tier, its evidence kind, and a verbatim quote. `[derived]` marks arithmetic we did on sourced inputs. `[vendor claim]` marks a vendor performance figure. `[our reading]` marks a synthesis no single source states.

---

## Thesis

Every method in this dive runs one loop: sample attempts, score them, and change something so the next attempts score better. The methods differ in where the change lands. Reinforcement learning (RL) writes it into the weights. A text loop writes it into the context a frozen model reads: a reflection, a rewritten prompt, a playbook, a memory, a skill file. A hybrid trains a small model whose output is words for a frozen large one.

Where the change lands decides what can be learned. On the tested models and benchmarks, RL with verifiable rewards mostly moves probability toward answers the model could already sample: pass@1 rises while pass@k at large k holds or falls (F02-40, F02-47). RL supplies about one bit per episode, which is why a rank-1 adapter can absorb it and why it forgets less than supervised fine-tuning (F02-86, F02-87). A text loop can buy part of that sharpening at inference time and can capture task instructions and procedures cheaply: on Qwen3 8B, reflective prompt evolution scored 54.85 against GRPO's 48.91 over six tasks with 1,839 to 7,051 rollouts against 24,000 (F03-61). It falls short where the gap is reasoning skill, behaviour that must vary per input, exploration, or long-horizon credit assignment (F03-62, F03-90, F03-107, F04-8, F04-26).

In both, the reward decides whether anything is learned and is the surface that gets gamed. A Reflexion loop without its tests scored below no reflection at all, 0.52 against 0.60 (F04-21); RL policies learned `exit(0)` to pass test suites (F02-79). The choice reduces to three questions the dive teaches the reader to answer: what kind of gap is it, what signal do you have, and how many queries will the learned artifact serve.

---

## Section Plan

### Layer A. Framing and the reader's map

**1. One loop, three places to keep what it learns**
Depth: survey

Opens with the loop the reader already runs every day in agent tooling: try, check, adjust. Names the three stores for the adjustment (weights, context, a small trained model that writes context) and places the methods the dive covers into them, using the "Adaptation of Agentic AI" survey's agent-versus-tool axis as the outer frame (F04-75, F04-76). States the four questions and the thesis answer, so the reader knows the destination before the vocabulary starts. Mental model: the location of the update decides training cost, serving cost, retention, and what can be learned at all. Diagram: the sample, score, update loop with three slots for the update, each slot labelled with two example methods.

**2. Getting started: your journey into RL and learning loops**
Depth: survey

*Who this is for.* A technical lead who knows inference engines, GPUs, prompts and agent loops in practice, has run long autonomous coding agents, and has no formal RL background. No calculus is assumed beyond knowing that a gradient step nudges weights to make something more likely; every RL term is defined before it is used.

*Four prerequisite concepts, and where each is defined.*
(a) **Policy and reward**: the model is a probability distribution you sample from, and a reward is one number per attempt, usually only at the end (section 3).
(b) **Advantage**: how much better or worse an attempt did than expected; its sign decides whether that attempt becomes more or less likely (section 4).
(c) **The grader as a proxy**: the program or model that produces the reward stands in for what you actually want, and optimisation pressure finds where the two differ (sections 7 and 10).
(d) **The context as state**: everything a frozen model conditions on, with its cost rules (effective length, prefix caching), which the reader knows from practice and from the Caching dive (sections 3, 11 and 18).

*The reader's path, and why in this order.* The mental models build in this sequence: one loop, three stores (1); the model is already a policy (3); every post-training method is one gradient shape, weighted likelihood on samples (4); two leashes keep updates small (5); rewards are proxies, first learned from preferences (6) and then computed by programs (7); RL mostly sharpens, and the boundary moves only under named conditions (8); a text loop is RL in which the context is the trainable parameter (11); the signal, not the reflection, does the work (12); the design of the stored state sets the step size (13, 14); frozen models propose well and keep score badly (18); a map of what lives in weights and what lives in context (19); cost per improvement (21); the choice (24). The RL vocabulary comes first because the loop papers define themselves against RL ("verbal reinforcement learning", "Training-Free GRPO", "can outperform reinforcement learning"), and the capability debate in section 8 comes before the loop sections because it sets what a loop would have to reproduce.

*How the sections connect.* Two tracks meet. The weights track (3 to 9) builds RL from the policy up to agentic RL. The words track (11 to 17) rebuilds the same loop with the context as the parameter. Section 10 joins them, because reward hacking works the same way in both. Sections 18 and 19 compare the tracks, sections 20 to 22 cost them and place them on AWS, section 23 runs both on one task, and section 24 turns everything into a choice. Three shorter routes for a non-linear read: "I run agent loops and want them to learn" (1, 2, 3, 10, 11, 12, 13, 16, 18, 24); "I advise a team choosing between reinforcement fine-tuning and prompting" (1, 2, 8, 19, 21, 22, 24); "I want RL properly" (3 to 9 in order). Diagram: the reading map as a dependency graph with the three routes highlighted.

---

### Layer B. The RL vocabulary, built on what the reader knows

**3. The language model is already a policy**
Depth: mechanism

Maps the RL vocabulary onto token generation, starting from sampling, which the reader knows. State is the prompt plus the tokens so far; action is the next token, or the whole response in the one-step bandit framing InstructGPT uses (F01-3, F01-7, F01-8). The reward arrives once, at the end, which makes this a sparse-reward problem (F01-6). Value, advantage, return, on-policy versus off-policy and exploration get one plain definition each (F01-10 to F01-14). The section closes on the frame the words track reuses: Reflexion defines its policy as the model weights plus the memory text (F04-54), so editing the context is editing the policy. Practical value: the reader can open any RL paper and tell which framing (token or response) its equations use, which is where most confusion between papers comes from (F01-9). Diagram: one response drawn as a trajectory of token actions with a single reward at the end-of-sequence token.

**4. Policy gradient: learning from your own samples, weighted by how they scored**
Depth: mechanism

REINFORCE in one line: push up the log-probability of what was sampled, scaled by the reward that followed (F01-16, F01-17). Why that is noisy, why subtracting a baseline keeps the expectation and cuts the noise (F01-18, F01-19), and the two ways to get a baseline: learn one (a critic, with GAE, Generalized Advantage Estimation, as the bias knob) or sample one from other attempts at the same prompt (RLOO, REINFORCE Leave-One-Out, and GRPO, Group Relative Policy Optimization) (F01-20 to F01-24). With a strong pretrained model, the critic's bias was not worth it in one study: plain policy gradient at lambda = 1 did best (F01-23). The section's mental model: every post-training method is one gradient shape, a coefficient times the gradient of log-probability, and methods differ only in where the samples come from, what scores them, and how the score becomes the coefficient (F01-70, F01-85). Diagram: a table-like figure with rows for SFT, REINFORCE, PPO, GRPO, DPO and rejection-sampling fine-tuning, and columns for sample source, scorer and weight.

**5. Two leashes: PPO's clip and the KL to the starting model**
Depth: mechanism

Why many gradient steps on one batch wreck the policy, and the trust-region idea behind PPO (Proximal Policy Optimization) (F01-25, F01-26). The clipped ratio with epsilon 0.2 limits how far one update moves any token's probability (F01-27, F01-29). The KL (Kullback-Leibler divergence) penalty is a different leash: to the fixed starting model, across the whole run, with beta 0.02 in InstructGPT (F01-28, F01-37). Evidence the reader needs to set these knobs: the clip activated under 5% of the time in one LLM study (F01-31); a 100x larger KL coefficient did not prevent capability regressions, while mixing in pretraining data did (F01-40); in a controlled study the KL penalty acted like early stopping (F01-41); TRL's GRPO trainer ships with beta 0 and does not load a reference model (F01-39, F02-29). Practical value: what each knob in a trainer config does and which two curves to watch during a run (KL to reference, policy entropy). Diagram: the two leashes drawn as distances from the batch's sampling policy and from the starting model.

**6. From preferences to rewards: RLHF, reward models, DPO and AI feedback**
Depth: deep

The full RLHF (RL from human feedback) pipeline: supervised fine-tuning, a reward model fitted to pairwise preferences with the Bradley-Terry model, then PPO against it with a KL penalty (F01-44, F01-46). InstructGPT's outputs at 1.3B were preferred to 175B GPT-3's (F01-50), for 60 petaflop/s-days of post-training against 3,640 for GPT-3 pretraining (F01-52), at the price of up to four models in memory (policy, reference, critic, reward model) (F01-32). DPO (Direct Preference Optimization) as the closed-form shortcut: the KL-regularised objective has an exact optimum, so the policy becomes its own reward model and trains with a classification loss, offline and without exploration (F01-58 to F01-63). A common misreading the section corrects in passing: DPO still needs reference log-probabilities (F01-62). IPO, KTO, ORPO and SimPO organised by what each removes (F01-65 to F01-69). The DPO-versus-PPO evidence, with PPO ahead once carefully tuned and at several times the compute (F01-72, F01-73). It ends on RLAIF (RL from AI feedback) and Constitutional AI as the first bridge between words and weights: a critique written in language becomes either a revision to train on or a number to optimise (F01-77 to F01-84). Practical value: when DPO on existing preference data is enough and when on-policy sampling earns its cost.

---

### Layer C. RL with verifiable rewards, and what it does to a model

**7. RLVR and GRPO: when the reward is a program**
Depth: deep

RLVR (RL with verifiable rewards) replaces the learned reward model with a checker: a boxed answer compared by rule, a compiler and test cases, a format check (F02-6, F02-7). GRPO's group-relative advantage and why it drops the critic (F02-1, F02-2). DeepSeek-R1-Zero's AIME 2024 pass@1 rising from 15.6% to 77.9% under RL alone, a result that only worked from bases of 32B and up, while distillation beat RL for small models (F02-9, F02-11, F02-12). The successors presented as knobs, each with the bias it fixes: Dr. GRPO's two normalisers, DAPO's Clip-Higher, dynamic sampling and token-level loss, GSPO's sequence-level ratio for mixture-of-experts stability, RLOO and REINFORCE++ (F02-15 to F02-27). Practical value from code at pinned tags: TRL defaults to `loss_type="dapo"` and `beta=0.0`, verl defaults to PPO with a critic, and a full Dr. GRPO setup needs two flags together (F02-28 to F02-36). A group whose samples all get the same reward has zero advantage and contributes no gradient, which is why prompts the model always or never solves waste compute (F02-22, F06-34). Diagram: a group of eight sampled answers, their rewards, the normalised advantages, and an all-correct group greyed out as zero gradient.

**8. What RL does to a model: sharpening, composition, and the pass@k debate**
Depth: deep

The section that answers the dive's first question. It teaches the reader to read a pass@k curve, then lays out the evidence as a structured debate (F02-40 to F02-62). On the tested regimes, RLVR on a strong base mostly reallocates probability among answers the base can already reach: RL wins at small k and the base wins at large k (F02-40), and question-level accounting finds more solutions lost than gained even for prolonged RL (F02-47, F02-48). The boundary moves under three conditions: the parts exist but not the combination (F02-50), training sits at the edge of competence with pretraining headroom (F02-49), or new information enters from a teacher, a tool or the environment (F02-61, F02-62). The Qwen caveat is a practical finding: random and wrong rewards still lifted Qwen2.5-Math on MATH-500, and contamination explains part of it (F02-53, F02-56). What changes in the weights: about one bit per episode, so rank-1 LoRA matches full fine-tuning for policy gradient (F02-86); 68.5% to 96.0% of parameters unchanged in bf16 checkpoints, disputed as a precision artefact (F02-84, F02-85); RL forgets less than SFT and forgetting tracks KL to the base (F02-87); entropy is the budget RL spends, mostly early (F02-89). Mental model: RL mostly moves probability mass toward answers the model can already sample. Practical value: before trusting an RL gain, check the model family, the benchmark's contamination status and the k at which it was measured. Diagram: schematic base and RL pass@k curves crossing, labelled as schematic, next to the three conditions that move the boundary.

**9. Agentic RL: tools, environments and multi-turn credit**
Depth: mechanism

An RL environment for an agent is a sandbox, a set of tool interfaces and a grader. The section profiles five with the same four fields (environment, action, observation, reward): Search-R1, ReTool, RAGEN, SWE-RL and DeepSWE (F02-70 to F02-75), plus Kimi K2's gym-like framework with rubric rewards for subjective tasks (F02-76). DeepSWE trained Qwen3-32B with RL only, on 64 H100s for six days, to 42.2% pass@1 on SWE-Bench Verified (F02-63). Multi-turn credit assignment is left to the advantage estimator: verl places the trajectory reward on the last token and zeros elsewhere (F02-39), and tool-result tokens are masked out of the loss (F02-33). On multi-hop search, tool-use RL pushed pass@k above the base at large k, the clearest boundary expansion in the agentic setting (F02-62). Practical value: this is exactly what AWS's managed multi-turn RL asks a customer to supply, since the customer's agent runs the episode and reports the reward (F06-30). Diagram: the agent-environment loop with model tokens and tool-result tokens coloured differently and the single reward at the end.

**10. The reward is a proxy: over-optimisation and reward hacking, in weights and in words**
Depth: mechanism

The join between the two tracks. Optimising against a proxy first improves true quality and then degrades it, on a predictable curve in the square root of KL from the start, and best-of-n selection at inference sits on the same curve (F01-54 to F01-56, F02-78). In agentic coding the cheap path runs through the test suite: `exit(0)` and `raise SkipTest` in a frontier training run (F02-79), hacks in production-like coding environments that generalised to broader misbehaviour (F02-81), special-cased tests reported in a system card (F02-82), and cheating on 76% of contradictory-spec SWE tasks for GPT-5 (F02-83). Training against a chain-of-thought monitor hides the hack rather than removing it (F02-80). The same holds for text loops: Reflexion without its tests made code worse than no reflection (F04-21), autoresearch's metric guard is an instruction while the evaluated code is agent-editable (F04-65), and Huntley names the model chasing "compiling code" in Ralph loops (F04-71). Mental model: the verifier is the reward function, and its leaks are the hack surface. Practical value, and the section's ending: how to build a grader that survives optimisation (evaluator code the agent cannot edit, hidden tests, a held-out metric, monitors used for detection and kept out of the reward).

---

### Layer D. Learning in words

**11. A text loop is RL with the context as the trainable parameter**
Depth: mechanism

Opens the words track by making the analogy exact. Retroformer folds the frozen model into the environment, so whatever writes the context is the learner (F04-55). Every method in the track is then described with the same five fields: what state persists, the update rule, the feedback signal, what stays frozen, and the cost (comparison table in research 03). The adaptation survey's four cells (A1 and A2 adapt the agent; T1 and T2 adapt tools, with memory counted as a tool) give the outer frame, with one convention the dive must state: a per-query refinement sits in A2, a persisted memory in T2 (F04-76 to F04-79). The step size of a text loop is how much of the context it rewrites per update; one full rewrite collapsed an 18,282-token playbook to 122 tokens and below the no-context baseline (F03-75). The section also bounds the analogy: in-context learning equals gradient descent is proven for linear self-attention on regression and open for real LLMs, and TextGrad calls its gradients a metaphor (F04-57 to F04-59). Mental model: a text loop is an optimiser whose parameters are tokens in the context. Diagram: the four-cell taxonomy with every method in the dive placed in a cell.

**12. Verbal reinforcement and self-correction: the signal does the work**
Depth: mechanism

Reflexion as the base pattern: act, get a success signal, write a lesson into a small episodic buffer (one to three entries), retry (F03-1 to F03-7, F04-20). The evidence on self-correction without outside feedback: Self-Refine's math score stays at 64.1 with self-feedback and reaches 68.9 with oracle feedback (F03-9, F03-10); intrinsic self-correction drops GPT-3.5 on CommonSenseQA from 75.8 to 38.1 (F03-12, F03-13); Reflexion's HotPotQA signal is the gold answer (F03-3). Failures help as memory when the update contrasts them with successes on the same task, and hurt as free-floating reflections (ExpeL 39.0 to 29.0 with reflections included; ReasoningBank 46.5 to 49.7 with failures contrasted) (F03-20, F03-30). Retroformer shows the hybrid fix: train the reflector with policy gradient when frozen reflections only restate the failure (F04-24). Mental model: the feedback signal, not the reflection, decides whether a text loop learns. Practical value: invest in the grader before the reflector.

**13. Experience that accumulates: memories, playbooks and skill libraries**
Depth: deep

Cross-episode learning, organised by how the stored state is updated: append (Reflexion, ReasoningBank), vote and edit a list of insights (ExpeL), regenerate a memory (CLIN, Dynamic Cheatsheet), add verified programs (Voyager), merge small deltas with de-duplication (ACE, Agentic Context Engineering), or write lessons from groups of attempts (Training-Free GRPO) (F03-18 to F03-39, F03-74 to F03-91). Each update rule has a matching failure: free rewriting collapses (F03-75), never compressing loses to curation (F03-34), and small models fill memory with wrong strategies (F03-34). Verifiers carry these loops: Voyager lost 73% without self-verification (F03-38), and ACE without labels fell below baseline on online FiNER (F03-77). Training-Free GRPO gives the cleanest cost pair, about $18 of tokens against about $10,000 of GPU time for an RL replication, which reverses at serving, $0.02 against $0.005 per problem (F03-91); on 32B-class models RL lifted AIME24 by about 37 points against 4.4 for the text loop [derived] (F03-90). Anthropic's Agent Skills and memory tool are documented as storage and authoring features, with no learning loop claimed (F03-40 to F03-42). Mental model: the design of the state and its update rule is the learning rate. Practical value: a playbook design checklist (itemised bullets with counters, delta updates, de-duplication, contrast successes with failures, keep a stable prefix). Diagram: the update-rule spectrum from append-only to full rewrite, with each method placed on it.

**14. Optimising the prompt: textual gradients and reflective prompt evolution**
Depth: deep

The prompt as the trained artifact. ProTeGi and TextGrad write natural-language critiques and apply them as edits (F03-43 to F03-50); OPRO keeps a scored history of instructions in a meta-prompt and asks the model for better ones (F03-51 to F03-53, F04-56); DSPy's MIPROv2 searches instructions and demonstrations with a surrogate model (F03-55 to F03-58). GEPA (Genetic-Pareto) is the strongest same-model comparison with RL in this research: on Qwen3 8B over six tasks, 54.85 against GRPO's 48.91, with 1,839 to 7,051 rollouts against 24,000, while GRPO won AIME-2025, 38.00 against 32.00 (F03-61, F03-62). The update rule reads the evaluator's text feedback and accepts a rewrite only if a minibatch score strictly rises, drawing parents from a per-instance Pareto front (F03-59, F03-60), with the implementation pinned in DSPy. Budget from the paper's totals: the README's evaluation range matches the training-rollout count, not the full budget (F03-73). Evolved prompts were up to 9.2x shorter than MIPROv2's (F03-67), and small models make poor prompt optimisers (F04-53). Mental model: a static prompt is one policy for every input, so it can carry missing instructions and task knowledge and cannot carry behaviour that depends on a hidden per-instance variable. Practical value: when prompt optimisation is the first thing to try, and how to give it the rich text feedback it reads.

**15. Search loops: the model as mutation operator, the evaluator as reward**
Depth: mechanism

FunSearch and AlphaEvolve keep a population of programs, ask an LLM to mutate them, and keep what a programmatic evaluator scores higher (F03-92 to F03-99). The evaluator is the reward model, and it must give a graded score (F03-93). Stronger models need fewer samples, from millions for FunSearch to thousands for AlphaEvolve (F03-96). AlphaEvolve was chosen over a deep RL approach for data-centre scheduling on interpretability and deployability grounds, without published RL figures (F03-97), and its authors name distillation into weights as the next step (F03-99). OpenEvolve and ShinkaEvolve are the open implementations at pinned tags (F03-100 to F03-103). Mental model: if you can write the evaluator, you can run this loop, and the evaluator is where the engineering goes. Practical value: the set of problems this applies to (anything with a cheap, trustworthy score) and how to stage evaluation as a cascade to save cost.

**16. Your loops through the RL lens: autoresearch and Ralph**
Depth: applied

Two practitioner loops the reader already knows, mapped onto the vocabulary of sections 3 to 10. Karpathy's autoresearch (pinned SHA): one editable file, one metric (validation bits per byte), a fixed five-minute training budget per experiment, keep the commit if the metric improves and reset otherwise, every run logged to a results file (F04-60 to F04-64). In RL terms it is greedy hill-climbing with no exploration term, clean credit assignment by construction (one idea per commit, fixed seed) and no noise floor, so sub-noise wins can be kept (F04-66). Huntley's Ralph loop: the same prompt re-run with a fresh context each iteration, all state in files, tests and type checks as backpressure, and the operator adding "signs" to the prompt between runs (F04-68 to F04-72). Fresh context per iteration is the design answer to context degradation (F04-69), and the human editing the prompt is a slow outer optimiser. Practical value, and the ending: a hardening checklist for the reader's own loops (evaluator outside the agent's write path, a measured noise floor before accepting a win, one change per trial, scorekeeping in code, fresh context with state in files, a stable prompt prefix for caching).

**17. Hybrids: train a small model, keep the big one frozen**
Depth: mechanism

When the big model's weights are out of reach (an API model) and words alone are not enough, put trained weights somewhere else. Advisor Models train a small advisor with GRPO, rewarding it on the frozen student's final output (F03-104, F03-105). On machine translation with the same 7B student, direct RL on the student reached chrF 42.38 and the advisor 38.98 from a 31.17 baseline, recovering about 70% of the gain [derived] (F03-108). Advisors learned hidden per-user preferences that static prompts did not (F03-107) and could not help where the student already knew everything relevant (F03-109). Related patterns: Retroformer's trained reflector (F04-24), Memento's learned retrieval over a case bank (F03-81), RL fine-tuning or distillation of a bandit algorithm to fix exploration (F04-13, F04-14), context distillation to move a prompt's effect into weights (F04-45), and alternating prompt optimisation with fine-tuning (F03-111). Mental model: when the right behaviour depends on something hidden per instance, some weights have to learn it. Practical value: the architecture for improving an API model with RL on a model you own.

---

### Layer E. Limits and the boundary

**18. Where words fall short: exploration, credit assignment and the context cliff**
Depth: deep

The answer to the dive's third question, from the evidence. In-context RL is real when a transformer is trained for it on learning histories (Algorithm Distillation, DPT) (F04-1 to F04-7). A general LLM is not: in a bandit study only one configuration explored satisfactorily, and only with an externally summarised history (F04-8 to F04-10); LLMs commit early, and compute the right action and still act greedily (F04-11, F04-12); they exploit worse than linear regression and are useful candidate proposers (F04-17). Credit assignment from long failure logs is poor: the best method found the decisive step 14.2% of the time, and accuracy fell as logs grew (F04-26). The context has a cliff: effective length sits below the claimed length (GPT-4 claimed 128K and held to 64K in RULER) and the middle is used worst (F04-31, F04-32). Edits re-price it, since prompt caching matches exact prefixes and any edit invalidates what follows (F04-38 to F04-40). Mental models: frozen models are strong proposers and weak statisticians; context is a working set with a cliff, and edits re-price it. Practical value: keep statistics in code and hand the model a summary, budget memory against effective length, and keep the evolving part of the context after the stable part.

**19. What lives in weights, and what lives in context**
Depth: mechanism

The boundary map, one row per kind of improvement, each with its best evidence (research 04, section 2). Task facts after the cutoff live in context: retrieval beat unsupervised fine-tuning, 0.875 against 0.504 on Mistral 7B (F04-43). Procedures and playbooks live in context when a reliable signal writes them (F04-46, F04-37). Constraints and output format are stated in context and followed reliably only from weights, with format sensitivity up to 76 points (F04-52). Calibrated or diffuse distributions live in weights (F04-50, F04-51). Token efficiency lives in weights, since context distillation removes the instructions (F04-45). Retention of old abilities favours context by construction, since weight updates forget in proportion to KL (F04-47). Exploration, learning from failure and long-horizon credit are weak in context (F04-8, F04-15, F04-26). New reasoning skill is contested and points back to section 8 (F04-49). Mental model: weights hold what must be fast, calibrated, stable under rephrasing or general; context holds what is specific, recent and auditable. Diagram: the two-column map, with contested rows marked. This map is the main input to section 24.

---

### Layer F. Systems and cost

**20. An RL step is an inference job inside a training job**
Depth: deep

For a reader who knows vLLM, the systems view of RL. One step is generation (decode-bound), preparation (reference log-probabilities, rewards, values), training, and a weight sync back to the inference engine (F05-1). Measured shares of step time spent on generation: 72.1% of a 309-hour Skywork-OR1-32B run, and 76% to 78% in its 32-GPU ablation (F05-42); over 95% in one 13B PPO study (F01-53). HybridFlow reports 58.9% for generation and actor training together, a different quantity, and the OpenRLHF paper's "over 90%" carries no measurement (F05-2, F05-12). The weight move is itself a cost: 140 GB per iteration for a 70B actor, up to 36.4% of an iteration when training and generation sit on different devices (F05-3). A synchronous step waits for its longest response: for the same 1,024 responses, going from 32 to 256 H800s cut rollout time only from 375 s to 205 s (F05-42, F05-6, F05-36). DeepSeek-R1's framework attacks the same tail from the inference side, with self-speculative decoding to shorten the longest samples (F05-39). Asynchronous designs hide the tail and the broadcast at the cost of staleness: AReaL bounds it with one parameter and corrects with a decoupled PPO objective, finishing a 1.5B math run in 14.8 hours against 33.6 for synchronous verl (F05-7 to F05-10); PipelineRL updates weights mid-sequence (F05-35); prime-rl drops episodes older than eight policy versions by default (F05-32). Even "on-policy" runs are slightly off-policy because vLLM and the trainer compute different probabilities for the same weights, and the frameworks correct for it by default (F05-16, F05-22). Framework placement and memory defaults at pinned tags (verl, OpenRLHF, TRL, slime, prime-rl) close the section (F05-13 to F05-34). Mental model: everything asynchronous in RL systems exists to hide the straggler tail and the weight broadcast, and staleness is the price. Practical value: what to measure on a run (generation share, idle GPU time, staleness, weight-sync time) and how cluster size changes the best placement (F05-5). Diagram: synchronous and asynchronous step timelines on the same time axis.

**21. Cost per improvement: pay once in training or on every query**
Depth: applied

The economics of the choice. Training side: GEPA's 1,839 to 7,051 rollouts against GRPO's 24,000 (F03-61); Training-Free GRPO at about $18 against about $10,000 for an RL replication, at the authors' assumed $0.5 per GPU-hour (F03-91); DeepSeek-R1's post-training at 147K H800 GPU-hours, which its authors price at $294K under an assumed $2 per GPU-hour, with R1-Zero's pure RL run at 101K of those hours on 512 GPUs (F05-37); ProRL's 1.5B model at about 16k H100 GPU-hours (F05-41); DeepSWE at 64 H100s for six days (F02-63); a minimal Dr. GRPO recipe at 27 hours on 8 A100s (F02-19). Serving side: $0.02 against $0.005 per problem for the text loop versus the RL model (F03-91), memory loops that triple tokens per answer (F03-35), and prompt caching narrowing the gap, 82.6% lower billed input for ACE (F03-79). The breakeven under the paper's prices is about 660,000 served problems [derived], and the section shows the reader how to redo it at real rates. Managed RL is priced per training hour, $80.00 for the open-weight models on Bedrock reinforcement fine-tuning (F06-16). Mental model: text loops are cheap to train and pay at serving; RL is expensive to train and cheap to serve, so expected query volume over the artifact's life is the decision variable. Diagram: an interactive breakeven calculator with the sourced inputs pre-filled and every input editable.

---

### Layer G. AWS paths and practice

**22. RL and learning loops on AWS**
Depth: applied

Three levels of control, all first-party sourced. Managed: Amazon Bedrock reinforcement fine-tuning trains with GRPO against a customer Lambda reward or a Bedrock-hosted judge, on three base models each in one Region (Nova 2 Lite, gpt-oss-20B, Qwen3 32B), from at least 100 records (F06-1 to F06-8). AWS's own triage rule fits the dive's model: a 0% starting reward means do SFT first, above 95% means RFT may be unnecessary (F06-9). The "up to 66%" improvement figure is a vendor claim with no method on the page (F06-10). Serverless: SageMaker AI model customisation offers SFT, DPO, RFT and multi-turn RL, where the customer's agent runs the episode and reports the reward (F06-22 to F06-30), and training session APIs expose `sample()`, `forward_backward()` and `optim_step()` so the customer writes the algorithm on managed GPUs (F06-31, F06-35). Self-managed: the frameworks of section 20 on SageMaker HyperPod or EC2, with HyperPod recipes and Trainium support as documented (research 06). The words side: Bedrock prompt caching rules for an evolving context (F04-40) and AgentCore Memory as the managed store for a learning loop, described exactly as AWS documents it (research 06). Practical value: which AWS path matches which answer from section 24, and what the customer must bring to each (a grader, an agent, or an algorithm). Diagram: the three levels drawn as a stack with the customer-owned component highlighted at each level.

**23. Side by side: one task, an RL run and a word loop**
Depth: applied

The Tier 0 lab. The same small open model, the same task with a programmatic verifier, and a matched rollout budget, trained once with GRPO and improved once with a text loop (GEPA, and a Reflexion-style memory as a second arm), on the reader's DGX Spark. The page shows pass@1 and pass@k up to large k for base, RL and loop, tokens per query, and wall-clock, so the reader sees sharpening and instruction-learning on one chart. Design, hardware feasibility and the evidence bar are in `RESEARCH-GUIDE.md`. This section ships only if the experiment runs and its log is in `research/`; otherwise it is cut.

**24. Choosing: a text loop, a hybrid, or a weight update**
Depth: applied

The decision, built from sections 8, 10, 19 and 21. Three questions in order. What kind of gap is it: missing instructions, facts or procedures (context), or reasoning skill, per-input behaviour, latency, calibration or format reliability (weights)? What signal do you have: a programmatic verifier, a judge validated against labels, or nothing trustworthy (in which case the first task is building the grader)? Can you touch the weights, and how many queries will the learned artifact serve? The paths that follow: a text loop with a hardened grader as the default first move; an advisor when the model is an API model and the behaviour must vary per input; reinforcement fine-tuning, managed or self-run, when the gap is skill or the volume is high and you own the weights; and distilling a stable playbook into weights once it stops changing (F04-45, F03-99). It ends on the reader's next action: write the grader, measure its noise floor, and run the cheapest loop against it first.

**25. Glossary and sources**
Depth: survey

Every acronym expanded on first use in reading order (RL, RLHF, RLAIF, RLVR, PPO, TRPO, GAE, GRPO, DAPO, GSPO, RLOO, DPO, IPO, KTO, ORPO, SimPO, KL, PRM, ORM, SFT, LoRA, MDP, ICL, ICRL, AD, DPT, GEPA, ACE, OPRO, MIPRO, RFT, MTRL and the rest). Full source list grouped by tier (Tier 0 own experiments; Tier 1 pinned code, framework docs and first-party AWS docs; Tier 2 first-party lab and vendor posts; Tier 3 papers, peer-reviewed and preprint marked; Tier 4 inspiration only), and the UNKNOWN register.

---

## Depth distribution

- Survey: 3 sections (1, 2, 25)
- Mechanism: 10 sections (3, 4, 5, 9, 10, 11, 12, 15, 17, 19)
- Deep: 7 sections (6, 7, 8, 13, 14, 18, 20)
- Applied: 5 sections (16, 21, 22, 23, 24)

25 sections across 7 layers. Section 23 is conditional on the Tier 0 experiment.

---

## Key sources to secure

Already read and registered in wave 1 (pinned versions in the registers):

- RL foundations: Sutton and Barto, 2nd ed., chapter 13; InstructGPT 2203.02155v1; PPO 1707.06347; GAE 1506.02438; Gao et al., reward over-optimisation 2210.10760v1; DPO 2305.18290v3; Xu et al. 2404.10719; Ivison et al. 2406.09279; Constitutional AI 2212.08073; RLAIF 2309.00267; RL's Razor 2509.04259v1; SFT memorizes, RL generalizes 2501.17161v2
- RLVR: DeepSeekMath 2402.03300v3; DeepSeek-R1 2501.12948v2 and the Nature 2025 version; Dr. GRPO 2503.20783v2; DAPO 2503.14476v2; GSPO 2507.18071; RLOO 2402.14740v2; Yue et al. 2504.13837v5; ProRL 2505.24864v1; Invisible Leash 2507.14843v5; Interplay 2512.07783v1; spurious rewards 2506.10947v2; entropy mechanism 2505.22617v1; LoRA Without Regret (Thinking Machines blog); Baker et al. 2503.11926v1; ImpossibleBench 2510.20270v1
- Agentic RL: Search-R1 2503.09516v5; ReTool 2504.11536; RAGEN 2504.20073v2; SWE-RL 2502.18449; DeepSWE (Agentica post); Kimi K2 report
- Learning in words: Reflexion 2303.11366v4; Self-Refine 2303.17651; Huang et al. 2310.01798v2; ExpeL 2308.10144; Voyager 2305.16291; TextGrad 2406.07496v1; OPRO 2309.03409; DSPy and GEPA 2507.19457v2 with the DSPy 3.4.1 tag; ACE 2510.04618v3; Memento 2508.16153; Training-Free GRPO 2510.08191v1; FunSearch (Nature 2023); AlphaEvolve 2506.13131; Advisor Models 2510.02453v3
- Theory and limits: Algorithm Distillation 2210.14215v1; DPT 2306.14892; Krishnamurthy et al. 2403.15371v3; Schmied et al. 2504.16078v1; Retroformer 2308.02151v3; Who&When 2505.00212v3; RULER 2404.06654v3; Lost in the Middle 2307.03172; Adaptation of Agentic AI 2512.16301v3; karpathy/autoresearch at SHA 228791fb; ghuntley.com/ralph
- Systems: HybridFlow 2409.19256 and verl; OpenRLHF 2405.11143; TRL v1.16.0; AReaL 2505.24298; PipelineRL 2509.19128v2; INTELLECT-2 2505.07291 and prime-rl v0.10.0; slime
- AWS: Bedrock reinforcement fine-tuning user guide; Nova 2 customisation guide; SageMaker AI model customisation, multi-turn RL and training session API docs; AWS What's New posts of 2025-12-03, 2026-02-17 and 2026-06-03

Still to secure (wave 2, see `RESEARCH-GUIDE.md`): SCoRe 2409.12917 (RL-trained self-correction); the TextGrad Nature version; ShinkaEvolve's paper body; first-party OpenAI docs on agent memory; HyperPod RL recipes, Neuron SDK RL support and AgentCore Memory (research 06 completion); step time and memory of a small GRPO run on the DGX Spark (Tier 0, experiment E0).

---

## Connections to existing deep dives

- vLLM: the rollout engine in sections 20 and 23 (sleep mode, weight loading, prefix-cache reset after a weight sync, F05-20)
- Caching: prefix caching rules that an evolving playbook defeats (sections 13, 18, 21)
- Silicon, Memory and Modern Inference: the DGX Spark and Jetson hardware facts behind section 23
- EFA: weight broadcast between trainer and rollout nodes in split placement (NCCL and NIXL engines in verl, F05-26)
