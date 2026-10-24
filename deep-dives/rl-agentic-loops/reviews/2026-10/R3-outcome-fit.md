# R3 Adversarial Review: Outcome Fit

**Lens:** Outcome fit. Does every section earn its place for this reader and this question? The test is the governing rule of `deep-dives/efa/revamp/section-shape-standard.md` (content earns its place only if it builds a mental model or is practical to know), applied with the three questions of `deep-dives/efa/revamp/leverage-pass-standard.md` ("The pass": what it means to the reader, what model it builds, how the reader would use it to decide, configure, size, choose or monitor).
**Date:** 2026-10-17
**Document reviewed:** `deep-dives/rl-agentic-loops/SCOPE.md`, Scoping v1 (2026-10-17), 25 sections in 7 layers. Read against `RESEARCH-GUIDE.md` and the six claim registers in `research/2026-10/` as they stand in the working tree. `06-aws-paths.md` carries uncommitted entries F06-49 to F06-59 (AgentCore Memory, AgentCore optimization and Evaluations, Bedrock prompt optimisation), which this review uses.
**Reader:** technical lead, ex-EC2/Compute tech lead, WW SA Lead for Startups. Strong on systems, inference, GPUs and agents in practice; runs long autonomous coding loops; no formal RL background. Reads to learn the field and to advise startups.
**Question:** Q1 what RL does to a model; Q2 which parts of that effect a loop can reproduce in text with a frozen model; Q3 where the text version falls short; Q4 how to choose between them.
**Constraint:** this review scores what the plan contains. Fixes use material already in the scope or the registers. Material the question needs and the plan lacks goes to "Backlog candidates", not to the findings.

---

## Section scores

| # | Title | Test passed | Sub-question | Score | Justification |
|---|---|---|---|---|---|
| 1 | One loop, three places to keep what it learns | Model: where the update lands decides training cost, serving cost, retention and what can be learned. | All (frame) | 8 | Strong orienting model with the destination stated up front; loses a point for importing the survey's agent-versus-tool axis as a second frame (finding 3). |
| 2 | Getting started: your journey into RL and learning loops | Practical: four prerequisites and three reading routes. | Navigation | 6 | Needed for a newcomer, but two of the three routes skip sections that section 24 is built from, and the 13-item model chain previews the whole dive (finding 2). |
| 3 | The language model is already a policy | Both. Model: sampling is acting, and editing the context edits the policy. Practical: tell token framing from response framing in any RL paper. | Q1, frame for Q2 | 8 | Starts from what the reader already does and plants the frame the words track reuses. |
| 4 | Policy gradient: learning from your own samples | Model: every post-training method is one gradient shape, differing in sample source, scorer and weight. | Q1 | 8 | The most transferable model in Layer B; the practical hook (critic or group baseline) is thin, which is acceptable for a mechanism section that says what it is for. |
| 5 | Two leashes: PPO's clip and the KL to the starting model | Both. Model: the clip bounds one update, the KL bounds the whole run. Practical: what each trainer knob does, and which curves to watch. | Q1 | 8 | Evidence chosen for setting knobs, and a monitoring ending; the payoff can point at the metrics a managed job exposes (finding 14). |
| 6 | From preferences to rewards: RLHF, reward models, DPO and AI feedback | Partly both. Model: preferences become a learned reward; DPO is the closed-form offline route. Practical: when DPO on existing preference data is enough. The IPO, KTO, ORPO and SimPO catalogue passes neither. | Q1, Q4 | 6 | Half the section serves the reader's decisions; deep depth on the rest is backward-mode material, and the decision does not land last (finding 7). |
| 7 | RLVR and GRPO: when the reward is a program | Both. Model: the reward is a program, and a group with identical rewards gives no gradient. Practical: trainer defaults; prompts the model always or never solves waste compute. | Q1 | 7 | Required setup for section 8 with real configuration value; the successor catalogue earns its depth only when tied to the knobs on managed jobs (finding 14). |
| 8 | What RL does to a model: sharpening, composition, and the pass@k debate | Both. Model: RL mostly moves probability toward answers the model can already sample. Practical: check family, contamination and k before trusting a gain. | Q1 | 7 | The dive's core answer to Q1, but it stops before the half of the bridge to Q2 that only it can carry: what inference-time sampling buys back (finding 1). |
| 9 | Agentic RL: tools, environments and multi-turn credit | Both. Model: an RL environment is a sandbox, tool interfaces and a grader, with the reward on the last token. Practical: what a customer supplies to managed multi-turn RL. | Q1, Q4 | 8 | Lands on the reader's own work (agents) and on what a startup has to build. |
| 10 | The reward is a proxy: over-optimisation and reward hacking | Both. Model: the verifier's leaks are the hack surface, in weights and in words. Practical: how to build a grader that survives optimisation. | Q1, Q2, Q4 | 9 | Joins the two tracks and ends on the action section 24 depends on. |
| 11 | A text loop is RL with the context as the trainable parameter | Model: a text loop is an optimiser whose parameters are context tokens. Practical: weak; the step-size point belongs to 13. | Q2 | 7 | Strong frame, diluted by a second taxonomy, a duplicated step-size claim and an ending on a hedge (findings 3, 6, 16). |
| 12 | Verbal reinforcement and self-correction: the signal does the work | Both. Model: the feedback signal, not the reflection, decides whether a loop learns. Practical: invest in the grader before the reflector. | Q2, Q3 | 9 | The cleanest evidence-to-action path in the words track. |
| 13 | Experience that accumulates: memories, playbooks and skill libraries | Both. Model: the state design and its update rule are the learning rate. Practical: the playbook design checklist. | Q2 | 8 | Organised by update rule, which predicts each method's failure; repeats the cost pair and the verifier theme owned elsewhere (findings 5, 6). |
| 14 | Optimising the prompt: textual gradients and reflective prompt evolution | Both. Model: a static prompt is one policy for every input. Practical: when prompt optimisation is the first thing to try, and what feedback to give it. | Q2, Q3 | 8 | Carries the strongest same-model comparison with RL; its mental model duplicates 17's (finding 6). |
| 15 | Search loops: the model as mutation operator, the evaluator as reward | Both, weakly. The model restates 10 and 12. Practical: graded scores and an evaluation cascade. | Q2 by analogy | 5 | Most of the section repeats 10, 12 and 16; what is unique fits in one block of 16 (finding 4). |
| 16 | Your loops through the RL lens: autoresearch and Ralph | Both. Model: autoresearch is greedy hill-climbing with clean credit, no exploration term and no noise floor. Practical: the hardening checklist. | Q2, Q4 | 9 | Meets the reader in loops he runs and ends on a checklist he can apply the same day. |
| 17 | Hybrids: train a small model, keep the big one frozen | Both. Model: behaviour that depends on something hidden per instance needs weights somewhere. Practical: train a small advisor in front of an API model. | Q3, Q4 | 8 | The weight path open to a startup that builds on an API model; the related-patterns list could be shorter. |
| 18 | Where words fall short: exploration, credit assignment and the context cliff | Both. Model: frozen models propose well and keep score badly; context is a working set with a cliff. Practical: statistics in code, effective-length budgets, stable prefix first. | Q3 | 9 | Answers Q3 directly with three rules the reader can apply; credit assignment needs its RL comparator (finding 17). |
| 19 | What lives in weights, and what lives in context | Model: weights hold what must be fast, calibrated, stable or general; context holds what is specific, recent and auditable. | Q3, Q4 | 8 | The map 24 is built on; it should point to owning sections rather than restate their evidence, and it needs a sharpening row (findings 1, 19). |
| 20 | An RL step is an inference job inside a training job | Both, for the self-run path only. Model: asynchrony exists to hide the straggler tail and the weight broadcast, at the price of staleness. Practical: what to measure on a run. | Q4, indirectly | 5 | Strong for this reader's systems background but answers none of the four sub-questions, sits at deep depth and ends on a lookup table (finding 8). |
| 21 | Cost per improvement: pay once in training or on every query | Both. Model: text loops pay per query, RL pays once, so volume decides. Practical: the breakeven calculator. | Q4 | 7 | The right decision variable; the headline breakeven rests on a cross-model pair with unequal gains (finding 9). |
| 22 | RL and learning loops on AWS | Practical: which AWS service runs each path and what the customer brings to it. | Q4 | 6 | The weights side is strong and central to the reader's job; the words side, which carries the dive's default answer, is nearly empty although research 06 now covers it (finding 10). |
| 23 | Side by side: one task, an RL run and a word loop | Both, if it runs. Model: sharpening and instruction-learning on one chart. Practical: reproducible on hardware the reader owns. | Q1, Q2, Q3 | 7 | The only Tier 0 evidence for three sub-questions, but the planned design is likely to hide the instruction-learning half (finding 12). |
| 24 | Choosing: a text loop, a hybrid, or a weight update | Practical: the decision and the first action. | Q4 | 7 | The right shape and the right ending; omits SFT or distillation, the base pass-rate check and the inference-time option (finding 11). |
| 25 | Glossary and sources | Practical: lookup; required by the project standard. | Reference | 7 | Required appendix; lists PRM and ORM, which no scoped section introduces (finding 18). |

Mean 7.4. Lowest: 15 (5), 20 (5), then 2, 6 and 22 tied at 6.

## Payoff, ending and overlap per section

| # | h2 payoff (stated, implied or weak, with a proposed line where needed) | Ending | Overlap, and which section keeps it |
|---|---|---|---|
| 1 | Stated: "Where the update lands decides what a loop can learn and what it costs" | Loop diagram with three slots; fits a framing section | Survey axis with 11; the three stores stay here (finding 3) |
| 2 | Implied: "Four ideas to hold, and the shortest route for why you are reading" | Routes graph; a next action (pick a route) | The 13-item model chain previews 1's thesis; the thesis stays in 1 (finding 2) |
| 3 | Stated: "Read any RL paper's equations by mapping them onto sampling you already run" | Bridge to the words track; acceptable | Reflexion's policy as weights plus memory with 11; 11 keeps it (finding 19) |
| 4 | Stated: "Read any post-training method as one gradient: which samples, which scorer, which weight" | The method table; summary-shaped, acceptable if labelled as the frame for 5 to 7 | None material |
| 5 | Stated: "What the clip and KL knobs do, and the two curves to watch" | Curves to watch; next action | TRL beta 0 with 7; stays here (finding 14) |
| 6 | Weak. Proposed: "Turn preference data you already collect into a weight update, and tell when offline DPO is enough" | RLAIF bridge with a practical line appended after it; wrong order | Four models in memory with 20; 20 keeps it (finding 19) |
| 7 | Implied. Proposed: "Configure a GRPO run: which knob fixes which bias, and why always-solved prompts waste the step" | Zero-advantage diagram; practical | TRL beta with 5; the zero-advantage mechanism with 22's triage rule, both feed 24 (findings 11, 14) |
| 8 | Stated: "Read an RL gain as a pass@k curve before you trust it" | Trust check, but the weights block follows it in the plan's order | RL's Razor with 19 (8 keeps it); F02-62 with 9 (9 keeps it) (finding 19) |
| 9 | Stated: "What you build to RL-train an agent: a sandbox, tool interfaces and a grader" | What the customer supplies; next action | Multi-turn RL contract with 22; the mechanism stays here (finding 19) |
| 10 | Stated: "Build a grader that survives optimisation, in weights and in words" | Grader checklist; next action | Verifier theme with 12, 13, 15, 16; grader items with 16's checklist; the grader checklist stays here (finding 5) |
| 11 | Implied. Proposed: "Use RL's vocabulary to predict how a text loop will behave" | Bound on the analogy; a hedge in the closing position (finding 16) | Step size and the 18,282-to-122-token collapse with 13 (13 keeps it); taxonomy with 1 (findings 3, 6) |
| 12 | Stated: "Invest in the signal before the reflector" | Next action | Retroformer with 17 (17 keeps it); verifier theme with 10 (a distinct facet, both stay) |
| 13 | Stated: "Design a playbook whose update rule keeps what it learned" | Checklist; next action | Cost pair with 21 (21 keeps it); stable prefix with 16 and 18; verifier paragraph with 12 (findings 5, 6) |
| 14 | Stated: "When prompt optimisation is the first thing to try, and what feedback to give it" | Next action | Per-instance limit with 17 (17 keeps it) (finding 6) |
| 15 | Weak: its model duplicates 10 and 12 | Applicability and cascade; practical | Evaluator as reward with 10 and 12; keep-or-revert with 16; merge into 16 (finding 4) |
| 16 | Stated: "Harden the loops you already run" | Checklist; next action | Grader items with 10; stable prefix with 13 and 18; fresh context with 18 (finding 5) |
| 17 | Stated: "Improve an API model you cannot train by training a small one in front of it" | Next action | Per-instance model with 14 (stays here) |
| 18 | Stated: "Where frozen models fall short, and the loop designs that work around it" | Three rules; next action | Bedrock caching with 22 (18 keeps it); fresh context with 16 |
| 19 | Stated: "Classify your gap: what belongs in weights and what in context" | Map handed to 24; acceptable for a model section | Rows restate evidence owned by 8, 14 and 18; point instead (finding 19) |
| 20 | Buried. Proposed: "Size and monitor a self-run RL job: where step time goes and what to measure" | Framework defaults table; the closing position rule 11 names as wrong (finding 8) | Named-run costs with 21; four models in memory with 6 |
| 21 | Stated: "Pay once in training or on every query: find your breakeven" | Calculator; next action | Cost pair with 13 and the thesis (stays here) |
| 22 | Weak and forward-dependent. Proposed: "Which AWS service runs each path, and what the customer brings to it" | What the customer must bring; a next action keyed to a section not yet read (finding 10) | Multi-turn contract with 9; caching with 18; the triage rule belongs in 24 |
| 23 | Stated: "See sharpening and instruction-learning on one task, on hardware you own" | The chart; needs a closing line on what to read from it | None |
| 24 | Stated: "Choose a text loop, a hybrid or a weight update, and start with the grader" | Next action | Intended aggregator of 8, 10, 19 and 21 |
| 25 | Not applicable (appendix) | Not applicable | None |

---

## Findings

### 1. BLOCKER: the plan does not answer the sharpening half of Q2

**Location:** Thesis, second paragraph ("A text loop can buy part of that sharpening at inference time"); section 8; downstream sections 19, 21, 23 and 24.

**Problem:** Q2 asks which parts of RL's effect a loop can reproduce. Section 8 establishes that RL's main effect, in the tested regimes, is sharpening. The direct answer to Q2 for that effect is that sampling and selection at inference reproduce part of it on a frozen model. The thesis asserts this without a citation, and no section owns it. The words track (11 to 17) answers a neighbouring question, what text loops can learn (instructions, procedures, facts, per-input behaviour through an advisor), which is mostly not what RL does. Register 02 holds the evidence, unused:
- F02-58: a training-free sampler on the base model's own likelihood nearly matches or beats GRPO single-shot on MATH500, HumanEval, GPQA and AlpacaEval 2.0, for Qwen2.5 and Phi-3.5-mini, with no verifier, at about 8.84 times the tokens per sequence.
- F02-55: a forced opening phrase reproduces part of the RL gain on Qwen2.5-Math and degrades other models (the contamination caveat of F02-56 applies).
- F02-64: the canonical PRM (process reward model) result is a frozen generator with a learned verifier used as a best-of-N selector.
- F02-13: DeepSeek dropped PRMs for training, while a PRM still helps rerank top-N.
- Register 02 mental model 4 states the synthesis: a frozen-model loop can buy the sharpening at inference time, pays on every query, and does not compose new skills.

None of F02-13, F02-55, F02-58 or F02-64 appears in SCOPE.md or RESEARCH-GUIDE.md. Without them, the reader cannot price the cheapest reproduction of RL's main effect, and section 24 has no zero-training path for a sharpening gap.

**Fix:** Add a closing block to section 8, ordered last, titled for the reader's moment ("What a frozen model can buy back"):
1. Read the pass@k curve as a menu. The base's pass@k at a given k is the ceiling for best-of-k with a perfect verifier [our reading, from the definition used in F02-40].
2. Inference-time sampling recovers single-shot RL gains without training (F02-58). Land the 8.84x token figure as the block's number.
3. A trigger prompt recovers part of the gain on one family (F02-55), with the Qwen caveat (F02-56).
4. A learned verifier over a frozen generator (F02-64, F02-13). This introduces PRM and ORM, which the glossary already lists.
5. The landing: inference-time sharpening pays on every query; best-of-n needs the verifier at serving time, while the F02-58 sampler needs none but multiplies tokens; what RL adds beyond the base's pass@k (composition, F02-50; tool-use expansion, F02-62) no inference-time loop recovers [our reading, register 02 mental model 4].

Then add a "sharpening" row to 19, a per-query multiplier input to 21's calculator, an inference-time path to 24 (finding 11), and E1's existing best-of-n arm (e) to section 23's chart (finding 12).

### 2. MAJOR: section 2's routes skip the inputs section 24 is built from

**Location:** Section 2, "How the sections connect" (the three shorter routes) and "The reader's path, and why in this order".

**Problem:** Section 24 is "built from sections 8, 10, 19 and 21". The route "I run agent loops and want them to learn" (1, 2, 3, 10, 11, 12, 13, 16, 18, 24) reaches 24 without 8, 19 or 21, and skips 14, the strongest same-model comparison with RL. The route "I advise a team choosing between reinforcement fine-tuning and prompting" (1, 2, 8, 19, 21, 22, 24) is this reader's job. It skips 10, the grader that 24's next action depends on, and 17, the only weight path open to a startup building on an API model. Separately, the 13-item chain of mental models states every section's conclusion in advance. That duplicates section 1's thesis and works as a key-takeaways box at the front, which shape rule 12 excludes. The sentence explaining why the RL vocabulary comes first justifies the structure to a reviewer and gives the reader nothing to think with or act on.

**Fix:** Route 1 becomes 1, 2, 3, 8, 10, 11, 12, 13, 14, 16, 18, 19, 24, with 21 added when the loop's artifact will serve high volume. Route 2 becomes 1, 2, 8, 10, 17, 19, 21, 22, 24. Cut the 13-item chain and the ordering rationale from the page; they stay in SCOPE.md as authoring notes. Section 2 keeps who it is for, the four prerequisites and the routes.

### 3. MAJOR: two taxonomies for one idea (sections 1 and 11)

**Location:** Section 1 ("using the 'Adaptation of Agentic AI' survey's agent-versus-tool axis as the outer frame"); section 11 (the four cells A1, A2, T1 and T2, the A2-versus-T2 convention, the four-cell diagram).

**Problem:** Section 1's three stores (weights, context, a small trained model that writes context) are the dive's own frame. The thesis, 17, 19 and 24 all use them. Section 11 adds a second, four-cell classification. It splits text loops across two cells by whether the refinement persists, it does not name prompt optimisers (F04-79), and it needs a dive-specific convention before it is usable. The cell codes change nothing the reader decides or monitors, so a newcomer pays for two taxonomies plus a patch. The survey's useful content is its second axis, signal source (execution-grounded against output-evaluated, F04-77). That axis maps directly onto 24's "what signal do you have".

**Fix:** Section 1 keeps the three stores as the only frame and cites the survey once, for the signal-source axis. Section 11 drops the A1/A2/T1/T2 codes and the convention paragraph. Its diagram becomes the three stores crossed with the signal source, with every words-track method placed on it.

### 4. MAJOR: section 15 should be merged into section 16

**Location:** Section 15; RESEARCH-GUIDE.md section 7, check 5 (first candidate cut).

**Problem:** The section's mental model ("if you can write the evaluator, you can run this loop, and the evaluator is where the engineering goes") restates 10 and 12. Three things in it are unique: the graded-score requirement (F03-93), a population with islands, which acts as an exploration mechanism, and the evaluation cascade. It serves Q2 only by analogy, because these loops improve an external program rather than a frozen model's behaviour on a stream of tasks. The OpenEvolve and ShinkaEvolve tag details are sources rather than content, and ShinkaEvolve's paper body is unread (03 U10). The AlphaEvolve-over-deep-RL point (F03-97) carries no RL numbers, so it cannot serve as RL-versus-loop evidence. Its stated grounds, interpretability and deployability, are a selection criterion.

**Fix:** Merge into 16 as one block after autoresearch. Autoresearch is the population-of-one case. FunSearch and AlphaEvolve add a population and islands, which is the exploration term autoresearch lacks (F04-66), require a graded score (F03-93), and stage evaluation as a cascade to save cost. Move F03-97 to 24 as the auditability criterion, next to 19's "context holds what is specific, recent and auditable". OpenEvolve and ShinkaEvolve move to the sources list. This confirms the guide's first candidate cut, carried out as a merge rather than a deletion.

### 5. MAJOR: the verifier theme is a headline in five sections, with four overlapping checklists

**Location:** Sections 10, 12, 13, 15, 16 and 18.

**Problem:** "The verifier carries the loop" is the headline of 10 ("the verifier is the reward function, and its leaks are the hack surface"), 12 ("the feedback signal, not the reflection, decides"), 13 ("Verifiers carry these loops"), 15 ("the evaluator is the reward model") and 16 ("evaluator outside the agent's write path"). Repeating the dive's strongest idea is right (shape rule 9). Restating it as a separate mental model in five sections dilutes it. Four checklists overlap: 10 (the grader), 13 (the playbook, including a stable prefix), 16 (loop hardening, including the evaluator outside the write path and a stable prefix) and 18 (the evolving context after the stable part).

**Fix:** Two facets, each with one owner. 12 owns "no external signal, no learning", with its evidence. 10 owns "a leaky signal teaches the leak", plus the grader checklist. 13's verifier paragraph shrinks to one sentence that keeps Voyager's 73% (F03-38) and points to 12. 15 merges per finding 4. One loop checklist lives in 16, and it cites 10's grader checklist for the evaluator items rather than repeating them. 13's checklist keeps only playbook structure (bullets with counters, delta updates, de-duplication, contrast successes with failures). "Stable prefix" appears once, in 16, and 18 owns the mechanism (F04-38 to F04-40).

### 6. MAJOR: three pairwise duplicates of a whole mental model or evidence set

**Location:** Sections 11 and 13, 13 and 21, 14 and 17.

**Problem and fix, per pair:**
- **Step size (11 and 13).** 11 states "the step size of a text loop is how much of the context it rewrites per update" with the 18,282-to-122-token collapse (F03-75). 13's mental model is "the design of the state and its update rule is the learning rate", with the same F03-75. 13 keeps both, because it owns the update rules. 11 keeps the parameter framing and names step size as the concept 13 develops.
- **Cost pair (13, 21 and the thesis).** The Training-Free GRPO pair ($18 against $10,000 to train; $0.02 against $0.005 per problem to serve, F03-91) sits in full in 13 and 21. 21 keeps it. 13 keeps one sentence ("cheap to train, dearer per query") with a pointer.
- **Hidden per-instance variable (14 and 17).** 14's mental model ("a static prompt is one policy for every input ... cannot carry behaviour that depends on a hidden per-instance variable") and 17's ("when the right behaviour depends on something hidden per instance, some weights have to learn it") are one model, register 03 M4. 17 keeps it with F03-107, because it is where weights are the answer. 14 closes its limits with one sentence that points to 17.

### 7. MAJOR: section 6 is deep where half its material serves no decision

**Location:** Section 6 (Depth: deep).

**Problem:** These parts pass the test:
- the RLHF pipeline (model: preferences become a learned reward, then PPO under a KL leash);
- InstructGPT's 1.3B against 175B, for 60 against 3,640 petaflop/s-days (model: post-training is a small fraction of pretraining compute and moves behaviour more than scale does);
- DPO as the closed-form offline route;
- the note that DPO still needs reference log-probabilities (practical: DPO still carries the reference model's cost).

The IPO, KTO, ORPO and SimPO catalogue passes neither test for this reader. Nothing in the dive's question turns on choosing among them, and their only AWS appearance in research 06 is ORPO in NxD Training, which has reached end of support (F06-45). The serverless SageMaker table lists SFT, DPO, RLVR and RLAIF (F06-24). The ending is the RLAIF bridge with "Practical value" appended after it, so the decision does not land last (shape rule 11).

**Fix:** Change the depth to mechanism. Collapse IPO, KTO, ORPO and SimPO into one sentence inside an ExpandableSection ("each removes one ingredient of DPO", F01-65 to F01-69). Reorder: pipeline, DPO, the DPO-versus-PPO evidence, the RLAIF bridge. Then end on the decision [our reading, from F01-72 and F01-73]: DPO on preference data you already have is the first weight update to try when the signal is pairwise, and on-policy RL earns its cost when a verifier can score fresh samples. Add a pointer to SageMaker DPO (F06-22, F06-24). Use the proposed h2 payoff in the table above.

### 8. MAJOR: section 20 answers none of the four sub-questions at deep depth and ends on a lookup table

**Location:** Section 20.

**Problem:** The section serves the self-run path (22's third level) and the training-side cost driver (21). It answers none of Q1 to Q4 directly. Its paragraph (about 330 words) is longer than section 8's (about 250) and twice section 24's (about 160). It closes on "Framework placement and memory defaults at pinned tags", a lookup table, which is the closing position shape rule 11 names as wrong. Two accounting caveats exist to show the research was careful: HybridFlow's 58.9% measures a different quantity, and OpenRLHF's "over 90%" is unmeasured (F05-2, F05-12). They help only a reader who is reading those papers.

**Fix:** Change the depth to mechanism, and open by saying what the section is for: sizing and monitoring a self-run job, and explaining why training-side cost scales with rollout tokens. Keep:
- the four-stage step;
- the generation share (72.1% of the Skywork-OR1-32B run, F05-42);
- the straggler figure (375 s to 205 s for eight times the GPUs, F05-42), the section's strongest number, landed twice;
- asynchrony as staleness traded for throughput;
- the trainer-versus-vLLM probability mismatch and its default correction (F05-16, F05-22).

Move the framework defaults and the accounting caveats into ExpandableSections. End on what to measure on a run (generation share, idle GPU time, staleness, weight-sync time) and how cluster size changes placement (F05-5).

### 9. MAJOR: section 21's headline breakeven rests on a cross-model pair with unequal gains

**Location:** Section 21 ("The breakeven under the paper's prices is about 660,000 served problems [derived]") and the calculator's pre-filled inputs.

**Problem:** The two arms behind the breakeven are different models, and they reach different quality:
- The RL arm is a ReTool replication on Qwen2.5-32B, served at $0.005 per problem on four GPUs.
- The text arm is Training-Free GRPO on DeepSeek-V3.1-Terminus, at about 60K input tokens per problem (F03-91).
- On 32B-class models, the text loop gained 4.4 AIME24 points against about 37 for RL (F03-90).
- The derivation leaves out the RL model's idle GPU cost (F03-91, use note).

Pre-filled as the section's headline number, the pair teaches a breakeven driven partly by model size and partly by unequal gains. RESEARCH-GUIDE.md section 4 already names F03-90 as the cross-model warning case. The mental model is right (pay once in training against paying per query). This number cannot carry the decision.

**Fix:** Make the calculator's structure the deliverable: training cost, per-query cost difference, quality difference and expected volume as explicit inputs, with the reader's own rates entered first. Keep 660,000 only as the paper's illustration, labelled cross-model, unequal gain and idle cost excluded. Preset a same-model training-side comparison where one exists: GEPA against GRPO on Qwen3 8B, 1,839 to 7,051 rollouts against 24,000 (F03-61), priced at the reader's cost per rollout. Add inference-time sampling (about 8.84 times the tokens, F02-58) as the third option, per finding 1.

### 10. MAJOR: section 22 has no AWS path for the dive's default answer

**Location:** Section 22.

**Problem:**
- **The words side is thin.** Section 24 makes "a text loop with a hardened grader" the default first move, yet 22 offers only prompt caching rules and AgentCore Memory for it. Research 06 now registers the managed words loops:
  - AgentCore optimization: traces plus a target evaluator produce a rewritten system prompt or tool descriptions, which batch evaluation or an A/B test validates before promotion. It went GA on 17 June 2026, and every recommendation needs the customer's approval (F06-53, F06-54).
  - AgentCore Evaluations, as that loop's signal (F06-55).
  - Bedrock Advanced Prompt Optimization: an evaluation-driven rewrite loop driven by an LLM-judge rubric, a Lambda or natural-language criteria (F06-57).
  - The episodic memory strategy, a managed reflection loop (F06-51).
- **A warning a startup needs is missing.** The episodic strategy's default signal is the model's own Yes or No on whether the goal was achieved (F06-52). Section 12's evidence says that is the condition under which text loops fail. The prompts can be overridden (F06-50). This is the most practical warning for a startup that turns the feature on.
- **"Trainium support as documented" is a placeholder.** Research 06 found that every GRPO recipe at HyperPod recipes release 2.0.11 targets P5 or P4 (F06-43), that GRPO and PPO do not appear in the Neuron docs searched (F06-44), and that optimum-neuron v0.4.5 ships an SFT trainer only (F06-48).
- **The payoff points forward.** "Which AWS path matches which answer from section 24" depends on a section the reader has not reached yet.

**Fix:**
- **Draw two stacks.** Weights: Bedrock RFT (managed), SageMaker serverless with multi-turn RL and training sessions, HyperPod recipes (self-run). Words: Bedrock Advanced Prompt Optimization and AgentCore optimization (managed loops), AgentCore Memory strategies (a managed store with a configurable update), and self-run loops such as GEPA in DSPy against Bedrock models.
- **Land the one mental model the AWS material gives** [our reading, F06-4 and F06-57]: one grader, two update targets. The same grader types (a rule-based Lambda or an LLM judge) drive RFT's weight update and Advanced Prompt Optimization's prompt rewrite.
- **Name the episodic-memory default signal and the override.**
- **Replace the Trainium placeholder with the scoped finding**, keeping the hedge ("not found in the docs searched").
- **Move 22 after 24**, so its payoff refers back to a choice the reader has already made. End it on what the customer must bring at each level, grader first. The dive then still closes on writing the grader.

### 11. MAJOR: section 24's decision omits inputs the plan already establishes

**Location:** Section 24; the thesis's three questions.

**Problem:** Four inputs the plan already has are missing from the decision:
- **SFT or distillation from a stronger model as a weight path.** For small models, distillation beat large-scale RL (F02-12, in section 7). AWS's triage rule says to do SFT first when the reward is 0% (F06-9, in section 22). The paths offer only RFT and distilling a playbook.
- **The base pass rate on the grader as a precondition for RL.** A group with identical rewards gives no gradient (F02-22, F06-34), which is the mechanism behind the 0% and 95% thresholds (F06-9). "What signal do you have" asks about the grader's type, not whether today's success rate leaves anything to learn.
- **The zero-training option for a sharpening gap**, and whether the verifier is available at serving time (finding 1).
- **Auditability as a criterion** (19's mental model; F03-97, per finding 4).

The thesis also lists three questions (gap, signal, volume), while 24 folds weight access into its third question. The advisor path depends on that gate.

**Fix:** Keep the three-question shape and the ending. Question 2 becomes "what signal do you have, and what does the model score on it today": near 0% means SFT or distillation first, near 100% means nothing is left to learn, and in between RL has gradient. The paths become:
- inference-time sampling, when the gap is sharpening and the per-query cost is acceptable;
- a text loop with a hardened grader, the default for instructions and procedures;
- an advisor, when the model is an API model and behaviour varies per input;
- SFT or distillation from a stronger model, when the base scores near zero;
- RFT, when the gap is skill or volume is high and you own the weights;
- distilling a stable playbook into weights, once it stops changing.

Align the thesis's three questions with 24's, with weight access as a gate inside question 3.

### 12. MAJOR: section 23's planned design is likely to hide the instruction-learning half of its chart

**Location:** Section 23; RESEARCH-GUIDE.md section 5, E1.

**Problem:** The section promises that "the reader sees sharpening and instruction-learning on one chart". E1 makes the instruction-learning half unlikely to show:
- **Model size.** The models are 0.5B to 1.5B, where the dive's own evidence says text loops gain little or lose: small models make poor prompt optimisers (F04-53), Dynamic Cheatsheet fell below baseline on GPT-4o-mini (F03-34), and register 03 M3 collects the pattern.
- **Task type.** The candidate tasks (Countdown, composed string transforms) are skill gaps, and E1's own prediction is that RL wins on those.

The chart would therefore show RL ahead for reasons of model size and task type, and a reader advising startups could carry that result over to frontier API models. The SCOPE paragraph also leaves out E1's best-of-n arm (e), the inference-time sharpening that finding 1 needs.

**Fix:**
- Give the task both kinds of gap: a skill component, plus an unstated rule the verifier enforces (an output convention or a domain rule absent from the prompt), so the loop has something to learn.
- Record the reflection model, and allow a larger local model as reflector, labelled as such (03 U1 asks the same question of GEPA).
- If E0's step times allow, add one point at 7B to 8B, the regime where GEPA beat GRPO (F03-61). NVIDIA's Spark playbook already runs GRPO with LoRA on a 7B model (F05-44).
- Put arm (e) on the chart.
- End the section on what the reader should conclude from the chart.

### 13. MAJOR: section 23 is the wrong second candidate cut

**Location:** RESEARCH-GUIDE.md section 7, check 5 ("section 15 (search loops) ..., then section 23 if the experiment is not ready").

**Problem:** Section 15 is the right first cut (finding 4). Section 23 is the wrong second cut for scope reasons. It already carries its own condition (E0 and E1), and it is the only section that shows Q1 to Q3 on one chart with Tier 0 evidence. Cutting it to shrink scope removes the dive's only first-hand evidence while the lowest-fit material stays: section 20 answers none of the sub-questions at deep depth, and section 6's preference-optimisation catalogue serves no decision.

**Fix:** If scope must shrink, cut in this order: (1) merge 15 into 16; (2) take 20 to mechanism depth, with its defaults behind disclosures (finding 8); (3) take 6 to mechanism and collapse its catalogue (finding 7). Section 23 stays conditional on E0 and E1 only, after finding 12's design changes.

### 14. MINOR: sections 5 and 7 do not tie their knobs to the managed jobs the reader will configure

**Location:** Sections 5 and 7.

**Problem:** Section 5's curves to watch include policy entropy. Bedrock RFT exposes it as `actor/entropy`, alongside reward statistics; a KL metric was not among the metrics registered (F06-12). Section 7's successor knobs are close to the menu SageMaker multi-turn RL exposes: `advantage_method` with `rloo`, `reinforce_pp` and `grpo_passk`, and `loss_fn` with `ppo`, `importance_sampling` and `cispo` (F06-33). They also overlap Bedrock RFT's hyperparameters (F06-11). TRL's `beta=0` default appears in both 5 and 7.

**Fix:** Section 5's payoff becomes "what each leash does, and where to watch it on a managed job". Section 7's becomes "read the knobs on a managed GRPO job". `beta=0` stays in 5, because it is the KL leash. Section 7 keeps `loss_type` and verl's critic default.

### 15. MINOR: section 8's block order, and a disputed sparsity figure in the main argument

**Location:** Section 8, "What changes in the weights".

**Problem:** The 68.5% to 96.0% unchanged-parameter figure sits in the main argument, and its precision dispute comes with it (F02-84, F02-85). The practical consequence, that RL fits in a small adapter, is already carried by the one-bit and rank-1 LoRA argument (F02-86). In the plan's order, the weights block follows the trust check, so the section's action does not land last.

**Fix:** Move the sparsity figure and its dispute into an ExpandableSection. Order the blocks: reading pass@k, the debate, the conditions that move the boundary, what changes in the weights, the trust check, then finding 1's block last.

### 16. MINOR: section 11 ends on a hedge

**Location:** Section 11, final sentences (in-context learning as gradient descent is open for real LLMs; TextGrad calls its gradients a metaphor).

**Problem:** The bound on the analogy is honest and belongs in the section, but in the closing position it leaves the reader with a caveat rather than a use for the frame.

**Fix:** Place the bound directly after the analogy is stated. End on what the frame lets the reader predict: a loop's behaviour follows from its signal (12), its step size (13) and its exploration (18).

### 17. MINOR: section 18's credit-assignment claim lacks its RL comparator, and the in-context RL detail can be demoted

**Location:** Section 18.

**Problem:** "Text falls short on credit assignment" needs a comparison point, because RL's own credit assignment is also coarse: verl places the trajectory reward on the last token (F02-39). The Algorithm Distillation and DPT detail (F04-1 to F04-7) supports a one-line model and does not need main-text depth.

**Fix:** State the contrast [our reading]. RL assigns credit statistically across many episodes. A text loop assigns it by reading one log, where the best method found the decisive step 14.2% of the time, and accuracy fell as logs grew (F04-26). Move AD and DPT into a disclosure behind the line "in-context RL is trained in; a general LLM was not".

### 18. MINOR: the glossary lists acronyms no section introduces

**Location:** Section 25 (PRM, ORM).

**Problem:** No scoped section uses PRM or ORM.

**Fix:** Finding 1 introduces both (F02-64). If finding 1's fix does not include the PRM item, remove both from the list. Check every glossary entry against first use when the app is built.

### 19. MINOR: small duplicates to resolve during the build

**Location and keeper:**
- Sections 3 and 11, Reflexion's policy as weights plus memory (F04-54): 11 owns it, and 3 keeps one bridging sentence.
- Sections 9 and 22, the customer's agent runs the episode (F06-30): 9 owns the mechanism, 22 the product.
- Sections 18 and 22, Bedrock prompt caching (F04-40): 18 owns it.
- Sections 8 and 19, RL's Razor, registered twice as F02-87 and F04-47 for one paper (2509.04259v1): 19's retention row points to 8. More generally, 19's rows carry evidence only where no other section owns it (facts by retrieval, F04-43; format sensitivity, F04-52; calibration, F04-50 and F04-51; token efficiency, F04-45) and point elsewhere otherwise.
- Sections 8 and 9, F02-62: 8 names the condition, 9 owns the instance.
- Sections 6 and 20, four models in memory (F01-32): 20 owns it.

### 20. MINOR: depth distribution after the fixes

**Location:** "Depth distribution".

**Problem:** Two of the seven deep sections (6 and 20) sit off the question's core, while the sections that carry the answer to Q4 are applied and short.

**Fix:** After findings 4, 7 and 8, the plan has 24 sections:

| Depth | Count | Sections |
|---|---|---|
| Survey | 3 | 1, 2, 25 |
| Mechanism | 11 | 3, 4, 5, 6, 9, 10, 11, 12, 17, 19, 20 |
| Deep | 5 | 7, 8, 13, 14, 18 |
| Applied | 5 | 16, 21, 22, 23, 24 |

Every deep section then sits on a sub-question: Q1 (7, 8), Q2 (13, 14) and Q3 (18). For a newcomer, the eight-section RL track (3 to 10) ahead of the words track is the right investment, because the loop papers define themselves against RL.

---

## Backlog candidates

Things the question needs that the plan does not contain. Not findings; for a later iteration.

1. **Serving a customised model on AWS.** Section 21's "RL is cheap to serve" depends on what it costs to serve the trained model. Research 06 registers RFT storage at $1.95 per model per month (F06-16), but no inference pricing for customised models.
2. **Validating an LLM judge against labels.** Section 24 offers "a judge validated against labels" as a signal tier, but no section teaches the procedure. The registers hold the inputs: ReasoningBank's 72.7% judge accuracy (F03-31) and AgentCore Evaluations (F06-55).
3. **Memory poisoning and cross-tenant leakage in learned context.** A persisted store learns from whatever reaches it, and AgentCore warns about the privacy of cross-actor reflections (F06-51). Multi-tenant startups need this.
4. **Operating the learned artifact.** Versioning, A/B promotion and rollback for prompts, playbooks and adapters (AgentCore configuration bundles and A/B tests, F06-53, F06-54).
5. **Data requirements per path, in one table.** Bedrock RFT needs at least 100 records and AWS advises starting with 100 to 200 (F06-8, F06-9); GEPA's runs used small training sets (03 U2); DPO needs preference pairs.
6. **Process rewards as RL's own answer to credit assignment**, beyond the one block in finding 1: PRM labelling cost (F02-65) and why DeepSeek dropped PRMs for training (F02-13).

---

**Verdict: PASS WITH FIXES.** The structure is sound, and 23 of 25 sections score 6 or above. Finding 1 (the sharpening half of Q2 has no owning section) must be resolved before Gate 1, and resolving it needs no new research: the evidence is already in register 02.
