# R1 review: the newcomer path through SCOPE.md

- **Reviewer lens:** a newcomer to RL. Technical lead, ex-EC2/Compute, strong on systems, inference engines, GPUs and agent loops in practice, with no formal RL background. Reads SCOPE.md strictly top to bottom and gets no answers to questions.
- **Date:** 2026-10-17
- **Document reviewed:** `deep-dives/rl-agentic-loops/SCOPE.md` (Scoping v1, 2026-10-17), with `RESEARCH-GUIDE.md` section 3 (Reading path for Carlos) and section 7 (Gates before building the app).
- **Standards applied:** the getting-started checklist in the `tech-deep-dive-outline` skill, and `deep-dives/efa/revamp/section-shape-standard.md` (mental model or practical value).
- **Constraint:** this review scores what exists. Fixes change the reading order and add definitions. They add no topics.

## Findings

**1. BLOCKER.** Section 2 (Getting started), shorter route "I advise a team choosing between reinforcement fine-tuning and prompting" (1, 2, 8, 19, 21, 22, 24).
- *Problem:* The route skips every section the prerequisites map names as a definition site: (a) policy and reward is in 3, (b) advantage in 4, (c) the grader as a proxy in 7 and 10, and (d) the context as state in 3, 11 and 18. Its first technical section is 8 (What RL does to a model), which then uses RLVR (expanded only in 7), KL to the base (5), policy gradient (4), SFT, entropy and "one bit per episode" with none of them defined. Section 21 (Cost per improvement) prices GEPA, Training-Free GRPO, DeepSWE, Dr. GRPO and ACE, and every one of them is introduced in a skipped section (14, 13, 9, 7, 13). Section 22 (AWS) refers to "the frameworks of section 20", also skipped. Section 24 says it is "built from sections 8, 10, 19 and 21" and recommends "an advisor", but the route skips 10 and 17. This is probably the route an SA Lead advising startups would take [our reading].
- *Fix:* Rewrite the route as 1, 2, 3, 7, 8, 10, 14, 17, 19, 21, 22, 24. Section 3 supplies the vocabulary and 7 supplies RLVR and the group advantage. Section 10 is there because 24 is built from it. Sections 14 and 17 are there because 21 and 24 price and recommend their methods. In 8, 19, 21 and 22, gloss each method or term in one clause at its first mention in that section, with a pointer. Examples: "GEPA, the reflective prompt optimiser of section 14"; "KL to the base, the drift measure of section 5"; "the frameworks of section 20 (verl, OpenRLHF, TRL, slime, prime-rl)". A reader on this route then still has what they need after skipping 4, 5, 13 and 20.

**2. MAJOR.** Section 2, shorter route "I run agent loops and want them to learn" (1, 2, 3, 10, 11, 12, 13, 16, 18, 24).
- *Problem:* The route ends on 24, which is built from 8, 10, 19 and 21, and three of those four are skipped. The reader reaches the decision without the weights-versus-context map (19) or the query-volume breakeven (21) that its first and third questions need. The route also skips 14 and 17, whose methods (prompt optimisation and advisors) are two of 24's four paths. Inside the route there are three more gaps. Section 10 uses "the square root of KL", and KL is defined in 5, which is skipped. Section 13 names Training-Free GRPO, a name that only means something after GRPO's group advantage (7, skipped). Section 16 says it maps onto "the vocabulary of sections 3 to 10", but the route includes only 3 and 10.
- *Fix:* Make the route 1, 2, 3, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 24. In 10 and 13, add one-clause glosses for KL and for GRPO's group-relative advantage. If the route has to stay short, end it at 18 and drop 24, because 16's hardening checklist is this reader's payoff.

**3. MINOR.** Section 2, shorter route "I want RL properly" (3 to 9 in order).
- *Problem:* The route stops before 10, whose first half belongs to RL for language models: over-optimisation against a learned reward, the square-root-of-KL curve, and reward hacking in RL runs. It also starts after section 2, so this reader never sees the prerequisites map.
- *Fix:* Change it to "2 to 10 in order", with 20 as an optional systems coda.

**4. MAJOR.** Section 2, checked item by item against the outline-standard checklist.
- *Position 1 to 3, with no technical section before it:* met in form. It sits at position 2, after the framing section 1. Finding 5 undercuts this, because section 1 states the thesis answer in vocabulary the map has not yet introduced.
- *Assumed background stated:* met. "A technical lead who knows inference engines, GPUs, prompts and agent loops in practice, has run long autonomous coding agents, and has no formal RL background." The next sentence promises that "every RL term is defined before it is used", and the scope breaks that promise. pass@k, credit assignment, bandit, entropy, the GAE lambda and in-context RL are all used before they are defined, or never defined (findings 8 to 16).
- *Prerequisites named and located:* met in form. Four concepts are listed with their sections, from "(a) **Policy and reward** ... (section 3)" to "(d) **The context as state** ... (sections 3, 11 and 18)". There are three gaps. First, (d) is assumed background by its own words ("which the reader knows from practice and from the Caching dive"), so it fills a slot with something the reader already holds. Second, pass@k is not listed, even though it carries the thesis, the dive's first question (8), the lab chart (23) and the Qwen caveat. Third, (b) points to section 4, but section 3 already defines advantage ("Value, advantage, return ... get one plain definition each").
- *Learning path, and why that order:* met. "The mental models build in this sequence: one loop, three stores (1); ... the choice (24)", with the reason "the loop papers define themselves against RL". The listed sections run in increasing order, so the stated order matches the section order. There are two gaps. The sequence leaves out the mental model of 10 ("the verifier is the reward function, and its leaks are the hack surface"), which prerequisite (c) and the connections paragraph both rely on. It also leaves out the mental model of 17 ("when the right behaviour depends on something hidden per instance, some weights have to learn it"), which underpins 24's advisor path. Separately, it gives 14 the label "the design of the stored state sets the step size". Section 14's own mental model is that a static prompt is one policy for every input.
- *How sections connect:* met. "Two tracks meet. The weights track (3 to 9) ... The words track (11 to 17) ... Section 10 joins them." But 10 comes before the words track it is said to join (finding 17), and two of the three shorter routes break (findings 1 and 2).
- *Fix:*
  - Move (d) into "Who this is for" as assumed background.
  - Make the fourth prerequisite "pass@k and the capability boundary: how often one sample succeeds, against whether any of k samples succeeds". It is defined in section 3 and read as a curve in section 8 (finding 8).
  - Point (b) to "sections 3 and 4".
  - Add the mental models of 10 and 17 to the sequence, and give 14 its own.
  - Add one line pointing to the glossary in section 25 for any term met out of order.

**5. MAJOR.** The Thesis, and section 1 (One loop, three places to keep what it learns): "States the four questions and the thesis answer, so the reader knows the destination before the vocabulary starts."
- *Problem:* As written, the thesis answer needs pass@1, pass@k "at large k", GRPO, rollouts, "one bit per episode", "rank-1 adapter", RL "policies" and "long-horizon credit assignment", all before the getting-started map exists. On page 1, a newcomer can read the first thesis paragraph but not the second. Section 1's stated purpose contradicts its content.
- *Fix:* In section 1, give the thesis answer in plain words only:
  - RL mostly makes the model more reliable at answers it could already produce some of the time.
  - A text loop can capture missing instructions and procedures cheaply.
  - A text loop struggles where the gap is reasoning skill, behaviour that varies per input, exploration, or working out which step earned the result.

  Move each figure to the section that defines its terms: 54.85 against 48.91 goes to 14, pass@k to 8, and one bit per episode to 8. The scope's Thesis block can keep the evidence for the reviewer, but section 1's paragraph should not inherit it.

**6. MAJOR.** The Subtitle; the Thesis ("three questions the dive teaches"); section 1 ("the four questions"); section 8 ("the dive's first question"); section 18 ("the dive's third question"); section 24 ("Three questions in order").
- *Problem:* Two different sets of questions share one word. The subtitle only implies the four dive questions and the scope never lists them, so the reader cannot tell what "first" and "third" refer to. The Thesis's three decision questions also differ from section 24's three, and 24's third item packs two questions into one ("Can you touch the weights, and how many queries will the learned artifact serve?").
- *Fix:* In section 1, list the four dive questions with the section that answers each: what RL does to a model (8), what a loop can reproduce in words (11 to 17), where words fall short (18), and how to choose (24). Call section 24's list "the decision questions" and use the same count in the Thesis and in 24. If the count is four, list access to the weights and query volume as two separate questions.

**7. MAJOR.** Section 1, "using the 'Adaptation of Agentic AI' survey's agent-versus-tool axis as the outer frame"; section 11, "The adaptation survey's four cells (A1 and A2 adapt the agent; T1 and T2 adapt tools, with memory counted as a tool)".
- *Problem:* Section 1 introduces two frames at once, the three stores and the survey's axis, and never maps one onto the other. Section 11 then names four cells but explains only one axis. The digit (1 versus 2) is never explained, so the reader cannot check "a per-query refinement sits in A2, a persisted memory in T2". The diagram that places "every method in the dive" in a cell also has no rule for prompt optimisers. The register gives the survey's second axis as the signal source (F04-77, the survey's two axes), and records that the survey does not place prompt optimisers (F04-79, where text loops sit in the survey).
- *Fix:* Use only the three stores in section 1. In section 11, introduce the survey with both axes named, add a one-line mapping from the three stores to the four cells, and state the dive's own convention for where GEPA and OPRO go.

**8. MAJOR.** pass@k and the capability boundary.
- *Where it first appears:* the Thesis ("pass@1 rises while pass@k at large k holds or falls"), section 7 ("AIME 2024 pass@1 rising from 15.6% to 77.9%") and section 2 ("the boundary moves only under named conditions").
- *Where it is defined:* pass@k in section 8 ("teaches the reader to read a pass@k curve"). "Boundary" is never defined.
- *Problem:* The dive's first deep result (section 7) opens with a number in a unit the reader only meets one section later. "The boundary" is the subject of the section that answers the first question, and the scope never states what it is.
- *Fix:* Define pass@1 and pass@k in section 3, next to sampling, which the reader already knows (one sentence each). Open section 8 with one sentence defining the boundary: the set of problems the model solves in at least one of k samples when k is large. Then read the curve.

**9. MINOR.** Episode, rollout and trajectory.
- *Where it first appears:* the Thesis ("one bit per episode", "1,839 to 7,051 rollouts") and the section 3 diagram ("trajectory").
- *Where it is defined:* never.
- *Problem:* There are three names for one attempt. "Rollout" carries every budget comparison (14, 21, 23). The persona can guess the meaning from the vLLM dive's "rollout engine", but the scope never says the three terms mean the same thing.
- *Fix:* In section 3, define one attempt from prompt to reward, list the three names papers use for it, and say which one the dive uses.

**10. MAJOR.** Credit assignment.
- *Where it first appears:* the Thesis ("long-horizon credit assignment"), then sections 9, 16, 18 and 19.
- *Where it is defined:* nowhere in the scope. Section 3 cites the range F01-10 to F01-14, and F01-12 (spreading one end-of-response score across tokens) is the definition, but the section's list of terms leaves it out.
- *Problem:* Credit assignment is one of the four things the thesis says words fall short on. It is also a named field in 16's RL reading of autoresearch and part of a section 18 headline, yet the reading order never defines it. Section 18 also uses it in a second sense, finding the decisive step in a failure log, without saying it is the same idea carried out by a model.
- *Fix:* Add credit assignment to section 3's list of plain definitions, right after "sparse-reward problem", as its consequence. In 18, add one sentence linking the failure-log study to that definition.

**11. MAJOR.** Bandit and in-context RL.
- *Where it first appears:* section 3 ("the one-step bandit framing InstructGPT uses"), section 17 ("distillation of a bandit algorithm to fix exploration") and section 18 ("in a bandit study", "In-context RL is real when a transformer is trained for it on learning histories (Algorithm Distillation, DPT)").
- *Where it is defined:* never.
- *Problem:* Section 18 answers the dive's third question, and it opens with in-context RL and a bandit experiment. A newcomer has neither term. Without knowing what is being estimated, the reader cannot judge "they exploit worse than linear regression". DPT is not expanded. Section 17 also assumes 18's finding that LLMs explore poorly, one section before 18 presents it.
- *Fix:*
  - In section 3, define a bandit in one sentence: choose one of several options, receive one reward, and carry nothing forward, which is the explore-or-exploit trade in its smallest form. Then say why InstructGPT's one-response setup is a bandit.
  - In 18, define in-context RL (the policy improves across episodes inside one context, with the weights untouched) and learning histories, expand DPT, and say what linear regression is the baseline for.
  - In 17, add a forward pointer to 18 for the exploration finding.

**12. MAJOR.** The Thesis ("RL supplies about one bit per episode, which is why a rank-1 adapter can absorb it") and section 8 ("about one bit per episode, so rank-1 LoRA matches full fine-tuning").
- *Problem:* The figure is missing both the comparison it belongs to and the causal step. A newcomer does not know what "a bit" counts here, or why a small count means a tiny adapter is enough. The source contrasts the information supervised learning supplies per token with the information policy gradient supplies per episode (F02-86, the information argument in LoRA Without Regret), and that contrast is what gives the number meaning. LoRA is not expanded.
- *Fix:* In section 8, state the contrast: SFT supplies information on every token of the target, while RL's single scalar reward supplies about one bit per attempt. Add the source's own arithmetic, total bits against the rank-1 parameter count, and expand LoRA. In the thesis, keep only the plain claim (finding 5).

**13. MINOR.** Section 4 (Policy gradient): "learn one (a critic, with GAE ... as the bias knob)" and "plain policy gradient at lambda = 1 did best".
- *Problem:* "Critic" is never tied to the value function section 3 defines. "Bias knob" assumes a bias-variance trade-off the section only half explains. "lambda = 1" means nothing until the reader knows what lambda trades off.
- *Fix:* Add one clause each. The critic is a learned value function used as the baseline. Lambda sets how far the advantage trusts the critic's estimate over the reward actually received. At lambda = 1 the advantage uses the actual return and ignores the critic, which removes the critic's bias.

**14. MAJOR.** Section 4's diagram: "rows for SFT, REINFORCE, PPO, GRPO, DPO and rejection-sampling fine-tuning".
- *Problem:* The section's mental-model diagram shows two methods before they are introduced (PPO in 5, DPO in 6) and one that is never introduced at all (rejection-sampling fine-tuning). The reader cannot read the "weight" column for PPO and DPO without sections 5 and 6.
- *Fix:* Build the table cumulatively. Section 4 shows SFT, REINFORCE, rejection-sampling fine-tuning and RLOO/GRPO, with a one-clause definition for rejection-sampling fine-tuning (sample, keep what the grader passes, fine-tune on it). Sections 5 and 6 each add their own row and end on the larger table. Alternatively, show the full table once, at the end of section 6.

**15. MINOR.** Section 5 (Two leashes): "which two curves to watch during a run (KL to reference, policy entropy)" and "does not load a reference model"; section 8: "entropy is the budget RL spends".
- *Problem:* Entropy is never defined, so half of section 5's practical value and one of section 8's findings land on a reader with no definition. The persona knows sampling temperature, but not why falling entropy limits learning. Section 5 also says "the fixed starting model" and then "reference model" without saying they are the same thing.
- *Fix:* Add one sentence to 5: policy entropy measures how spread out the next-token distribution is, and when it collapses the model samples nearly the same answer every time, which leaves nothing to compare. Also state that the reference model is the frozen copy of the starting model that the KL is measured against.

**16. MAJOR.** Section 7 (RLVR and GRPO): "Dr. GRPO's two normalisers, DAPO's Clip-Higher, dynamic sampling and token-level loss, GSPO's sequence-level ratio for mixture-of-experts stability, RLOO and REINFORCE++", and "TRL defaults to ... verl defaults to PPO with a critic".
- *Problem:* One sentence carries six method names and five mechanisms, and DAPO and GSPO are not expanded. "The bias it fixes" uses bias in a different sense (a systematic tilt in the objective) from section 4's statistical bias. Section 4 introduced RLOO as a sibling of GRPO, and here it reappears as a successor. TRL (first named in 5) and verl are treated as known, although the frameworks are only introduced in 20.
- *Fix:*
  - Present the successors as a small table keyed by the GRPO term each one changes: the normaliser, the clip bound, which prompts are kept, how token losses are averaged, and token versus sequence ratio. For each, say in a few words what goes wrong without the change.
  - Say what "bias" means here.
  - Drop RLOO from the successor list, or point back to section 4.
  - Expand DAPO and GSPO.
  - At first mention, gloss TRL and verl as post-training frameworks profiled in section 20.

**17. MAJOR.** Section 10 (The reward is a proxy): "The join between the two tracks" and "Reflexion without its tests made code worse than no reflection ..., autoresearch's metric guard ..., and Huntley names the model chasing 'compiling code' in Ralph loops"; section 3: "Reflexion defines its policy as the model weights plus the memory text".
- *Problem:* The join section comes before the words track it joins. Its second half uses Reflexion, which is introduced in 12, and autoresearch and Ralph, which are introduced in 16. Reflexion is first named in section 3, with no introduction.
- *Fix:* At its first use in section 3, give Reflexion one clause: a loop that writes a lesson into memory after each failed attempt and then retries (section 12). In 10, start the words half with Ralph and autoresearch, which the persona runs, and point each example forward to its section. In section 2, say that 10 previews the words track. Alternatively, move 10 to sit between 17 and 18, so it joins two finished tracks.

**18. MAJOR.** The Thesis and section 14: "54.85 against GRPO's 48.91 over six tasks with 1,839 to 7,051 rollouts against 24,000".
- *Problem:* The dive's headline comparison has no unit and no starting point. A newcomer cannot tell how much either method improved the model, or whether GRPO improved it at all. F03-61 (the GEPA versus GRPO table) carries the base model's aggregate next to both scores.
- *Fix:* State the unit (an aggregate score across the six tasks). Add the base model's aggregate from F03-61 to both the thesis line and section 14, so the reader sees three numbers and can read both gains.

**19. MAJOR.** RESEARCH-GUIDE.md section 3, Stage 1: "1. InstructGPT ... sections 3.1 and 3.5 and appendix C", then "2. Sutton and Barto ... chapter 13 ... Read after InstructGPT so the maths has a concrete target."
- *Problem:* InstructGPT 3.5 and appendix C use PPO's clipped objective, a per-token KL and a value function. Sutton and Barto chapter 13 covers the policy gradient theorem, REINFORCE, baselines and actor-critic, but not PPO or KL penalties: the book is from 2018 and does not include PPO [our reading of the book's contents]. So after Stage 1 the reader has met PPO with no reading that defines it. Stage 2's DeepSeek-R1 section 2 then writes GRPO's objective with PPO's clipped ratio and a KL term [our reading]. Chapter 13 also relies on chapter 3's notation for returns, episodes and value functions [our reading].
- *Fix:* Reorder Stage 1:
  1. InstructGPT 3.1 and 3.5, for the pipeline only.
  2. Sutton and Barto chapter 3, the sections on returns, episodes and value functions, then chapter 13.
  3. PPO, arXiv 1707.06347, section 3. It is already registered in the scope's key sources.
  4. InstructGPT appendix C last, once its hyperparameters have names.

**20. MINOR.** RESEARCH-GUIDE.md section 3, Stages 2 and 4.
- *Problem:* There are three ordering problems:
  - Item 13 asks the reader to find "the hack surface" in Ralph and autoresearch, but item 14 (Baker et al., monitoring reasoning models for misbehaviour), which shows what reward hacking looks like, comes after it.
  - Item 12 (Retroformer) supplies the frame "a text loop is RL" that the scope uses to open the words track (section 11), but the reader reaches it only after all four Stage 3 words papers.
  - Item 3 asks for DeepSeek-R1 supplementary G.2 (process rewards and tree search), but neither the path nor the scope defines those terms.
- *Fix:* Swap items 13 and 14. Move Retroformer's introduction to directly after Reflexion (item 7), because it builds on Reflexion and frames the rest of Stage 3. Its section 4 can move with it. Mark R1's G.2 as optional, or add one line explaining that a process reward model scores each step rather than only the final answer.

**21. MINOR.** Acronyms and benchmark names not expanded at first use.
- *Problem:*
  - SFT appears spelled out in the thesis and as an acronym in section 4, but is never written "supervised fine-tuning (SFT)".
  - GRPO is used in the thesis before section 4 expands it, and PPO and DPO appear in 4 before 5 and 6 expand them.
  - Never expanded: IPO, KTO, ORPO and SimPO (6), DAPO and GSPO (7), LoRA (8), TRL (5), MIPROv2 and ProTeGi (14), DPT (18) and RFT (22).
  - No gloss for Bradley-Terry and "offline" (6), "surrogate model" and "Pareto front" (14), or the benchmarks and metric behind the numbers: AIME, MATH-500, SWE-Bench Verified, HotPotQA, CommonSenseQA, FiNER, RULER and the chrF metric.
- *Fix:* Expand each at its first use in reading order, following the project acronym standard. Give each benchmark one clause at first use, saying what it tests and what the score counts.

**22. MINOR.** Other numbers that lack the comparison they belong to.
- *Problem:*
  - Thesis and section 10: "0.52 against 0.60" lacks the benchmark and the full loop's score. Both are in F04-21 (the Reflexion code ablation), and they show what the tests are worth.
  - Section 9: DeepSWE's 42.2% has no starting score.
  - Section 12: ExpeL's "39.0 to 29.0" and ReasoningBank's "46.5 to 49.7" come from different benchmarks but sit side by side as if comparable.
  - Section 13: "Voyager lost 73%" does not say 73% of what.
  - Section 18: "14.2% of the time" has no chance level to compare against.
  - Section 21: the $80.00 per training hour comes with no typical job length.
- *Fix:* At each site, add the missing comparator (base score, metric or chance level) from the cited register entry, or at least name the metric. Where the register has no comparator, say so.

**23. MINOR.** Section 14: "Budget from the paper's totals: the README's evaluation range matches the training-rollout count, not the full budget (F03-73)".
- *Problem:* A newcomer has no antecedent for "the README" or "the evaluation range". The sentence records a research reconciliation, not a fact the reader can use, so for this reader it fails the section-shape test.
- *Fix:* Replace it with the practical statement: which budget figure to quote and what that figure includes. Move the reconciliation into the evidence ExpandableSection.

**24. MINOR.** Section 17 (Hybrids): "rewarding it on the frozen student's final output" and "chrF 42.38".
- *Problem:* Here "student" names the large frozen model. Section 7 and the rest of 17 use the word in the distillation sense, where the student is the small model. chrF is not explained.
- *Fix:* Name the roles at first use: the advisor is the small, trained model, and the student is the frozen API model it advises. Gloss chrF as a character-overlap translation score.

**25. MINOR.** Section 20 (An RL step is an inference job inside a training job): "140 GB per iteration for a 70B actor" and "a decoupled PPO objective".
- *Problem:* "Actor" is never tied to "policy". Section 4 names only the critic, and section 6 lists "policy, reference, critic, reward model".
- *Fix:* Add one clause saying the actor is the policy being trained, named for its role alongside the critic. Gloss "decoupled" as separating the policy that sampled the data from the policy being updated.

**26. MINOR.** Section 22 (RL and learning loops on AWS): "Practical value: which AWS path matches which answer from section 24".
- *Problem:* The section defines its practical value against answers the reader has not reached yet.
- *Fix:* Keep 22 as the catalogue of what the customer brings at each level, and move the mapping into 24, where each path can name its AWS level from 22.

**27. MINOR.** Sections 2, 11 and 13: "sets the step size", "The step size of a text loop", "is the learning rate"; section 11: "an 18,282-token playbook".
- *Problem:* One idea gets three phrasings. "Playbook" is also used in 11, before 13 introduces ACE's playbook.
- *Fix:* Pick one term and use it in 2 and 13. "Step size" is the obvious choice, because 11 defines it. In 11, gloss playbook as a list of itemised lessons the loop maintains (section 13).

**28. MINOR.** Section 19 (What lives in weights, and what lives in context): "retrieval beat unsupervised fine-tuning" and "Calibrated or diffuse distributions live in weights".
- *Problem:* The scope never distinguishes unsupervised fine-tuning (training on raw documents) from SFT, and "diffuse distributions" comes with no example.
- *Fix:* Add one clause for each term. For the second, give an example from the cited entries F04-50 (diffuse or calibrated sampling is set in weights) and F04-51 (post-training changes calibration).

## Verdict

**PASS WITH FIXES** for the newcomer path. The order of mental models is sound and matches the section order, and section 2 meets every checklist item in form. Before Gate 1 check 1 ("Scope held", the review gate before any build) counts this review as passed, two things must happen. Route 2 must be rewritten (finding 1), and the MAJOR definitions and reorderings must land: pass@k, credit assignment, bandit and in-context RL, the question count, and the Stage 1 reading order.
