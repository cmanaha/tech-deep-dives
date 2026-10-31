# fc01-framing: fact check of sections 1 (One Loop), 2 (Getting Started) and 3 (The Language Model Is Already a Policy)

Agent fc01, 2026-10-30. Status: COMPLETE. Fixes applied to all three section files and their claims lists
(`revamp/claims/one-loop.md`, `getting-started.md`, `policy.md`). No diagram was touched (one caption
paragraph below section 2's map changed, outside the SVG), so the render harness was not re-run.

Sources opened by this agent: arXiv PDFs at the pinned versions, read as `pdftotext -layout` in
`/tmp/rl-fc-fc01/pdf`: 1909.08593v2, 2406.09279v2, 2203.02155v1, 2402.14740v2, 2009.01325v3, 1506.02438v6,
2402.03300v3, 2504.13837v5, 2303.11366v4, 2510.14901v1, 2512.16301v3, 2510.08191v1; Sutton and Barto,
http://incompleteideas.net/book/RLbook2020.pdf. Code through `gh api .../contents?ref=<tag>`: TRL v1.12.0
`trl/experimental/ppo/ppo_trainer.py`, `ppo_config.py`, `__init__.py`; TRL v1.13.0 `ppo_trainer.py` (404);
TRL v1.16.0 `trl/trainer` and `trl/experimental` listings and `grpo_config.py`; TRL v1.13.0 release body
and the release tag list. Venue pages (search): NeurIPS 2023 proceedings (Reflexion, hash
1b44b878bb782e6954cd888628510e90), NeurIPS 2022 proceedings (InstructGPT, hash b1efde53be364a73914f58805a001731),
ACL Anthology 2024.acl-long.662 (Ahmadian et al.). E0: every file in `research/2026-10/E0-spark-smoke/run1/`
and `run2/` (`logs.jsonl`, `steps.jsonl`, `meta.json`, `summary.json`) plus `train.py`, recomputed by script.
Owner sections read at their current state: 4, 6, 8, 10, 11, 13, 15, 16, 17, 18, 19, 20, 21, 22.

## OneLoop.tsx (section 1)

Claims checked: 34 (2 cited claims and 3 Cite badges; 29 pointer claims, each traced to the owning
section's current text). CONFIRMED 30; OVERREACH 4; WRONG 0; UNSUPPORTED 0; STALE 0. Prose-rule scan clean.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1-1 | "policy gradient, the update every RL method shares (section 4)" | OneLoop.tsx:359 | OVERREACH | PolicyGradient.tsx#L376-L379 says PPO and GRPO "both update a model this way"; value-based RL does not (Memento's soft Q-learning, Hybrids.tsx#L533-L535, is in this same section's list) | "policy gradient, the update behind PPO and GRPO (section 4)" |
| 1-2 | "The axis crosses all three stores", right after "taken from a survey of agent adaptation" | OneLoop.tsx:443-444 | OVERREACH (our extension stated as the survey's) | https://arxiv.org/abs/2512.16301v3 Section 1 contributions: the execution-grounded / output-evaluated split sorts agent updates; tools use agent-agnostic / agent-supervised. Section 11 labels the extension (TextLoopAsRl.tsx#L976-L978 "our extension of its frame") | "In this dive the axis crosses all three stores, an extension of the survey's frame, and section 11 ..." |
| 1-3 | Q1 short answer: "on the models and benchmarks tested so far, RL with verifiable rewards mostly ... sharpening" | OneLoop.tsx:473-474 | OVERREACH (hedge widened) | Owner WhatRlDoes.tsx#L347-L348: "On the models and benchmarks in the studies read here, RLVR mostly sharpens" | "on the models and benchmarks in the studies the dive read" |
| 1-4 | Table, "What the model keeps": context "Every old ability, since the weights never move"; small model "Every ability of the large model" | OneLoop.tsx:266-267 | OVERREACH | Owner WeightsVsContext.tsx#L763-L765 scopes it: "whatever it could do before a loop ran, it can still do with the loop's text removed"; text in the context can change behaviour while it is present | Context cell "Every old ability once the text is removed, since the weights never move; ..."; small-model cell "Every ability of the large model once the advice is removed; ..." |

Confirmed, with evidence (summary):
- 8.84x, both landings (L381-L388, L482-L488): https://arxiv.org/abs/2510.14901v1 Table 1 (Qwen2.5-Math-7B, MATH500: base 0.496, power sampling 0.748, GRPO (MATH) 0.785) and Section 5.3 ("NMCMC = 10, T = 679 ... B = 192 ... a multiplier of 8.84x"). Wording and cite match section 8 (WhatRlDoes.tsx#L349-L355); badge ICLR 2026 matches fc03.
- Signal-axis gloss (L436-L442): survey Section 1 ("how the signal is obtained (execution-grounded vs. output-evaluated)") and the A1/A2 definitions; gloss text matches section 11 (TextLoopAsRl.tsx#L912-L915). Badge preprint.
- Placement pointers: PPO's limits (s5); RLHF and DPO from preference pairs (s6, PreferencesToRewards.tsx#L546); GRPO with a program grader (s7); Search-R1 and DeepSWE (s9); SCoRe expansion matches VerbalReinforcement.tsx#L621 and the glossary; Reflexion, Self-Refine (s12); ExpeL, ACE, Dynamic Cheatsheet, Voyager, Training-Free GRPO (s13); GEPA (s14); Ralph, autoresearch, FunSearch, AlphaEvolve (s15); Advisor Models (GRPO), Retroformer (PPO), Memento (soft Q-learning over a case bank) (Hybrids.tsx#L352-L374, L522-L538).
- Fourth route and its pricing in section 8's closing block (WhatRlDoes.tsx#L762, L851-L856).
- Table cells for training cost and cost per query (sections 16, 19, 20), what it holds best (sections 8, 16, 18, labelled "Our reading" in the caption).
- Score pointers: section 10 grader, section 12 no outside signal, section 22's second question (Choosing.tsx#L490). Q2 to Q4 short answers match sections 8, 17, 20 and 22 (Choosing.tsx#L407-L418, L589, L807 "Start with the grader").

Score: **9/10**. One loop and three stores give a model to place any method by; the 8.84x lands twice with its
scope; every pointer now matches its owner at the owner's hedge. The page ends on the reader's next step.

## GettingStarted.tsx (section 2)

Claims checked: 34 (2 cited titles and 2 venue badges; 30 dive-internal claims: section count, routes, four
ideas, four stages, pointers, diagram node titles and arrows). CONFIRMED 32; UNSUPPORTED 1; OVERREACH 1.
Prose-rule scan clean.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 2-1 | "section 24, Glossary & Sources, lists every acronym the dive uses and every source it cites" | GettingStarted.tsx:414-415 | UNSUPPORTED | GlossaryAndSources.tsx#L228 describes itself as "Every acronym in the dive, our own experiment, and the reading list grouped by authority"; fc07 found five sources cited in sections 17 and 18 with no row there (reviews/factcheck/fc07-limits.md, orchestrator items) | "lists every acronym the dive uses and its reading list, grouped by authority" |
| 2-2 | "Section 21 ... is on no shorter route: it runs the comparison on hardware you own" | GettingStarted.tsx:550-552 | OVERREACH | SideBySideLab.tsx#L542, L773: E1, the comparison, "is a protocol, not a result: this build did not run it"; only E0, one RL step loop, was run | "it runs one RL step on hardware you can own and sets out the protocol for running the comparison there" |

Confirmed, with evidence (summary):
- Reflexion's full title: https://arxiv.org/abs/2303.11366v4 title page; NeurIPS 2023 (proceedings hash above). Training-Free GRPO's full title: https://arxiv.org/abs/2510.08191v1 title and abstract ("we propose Training-Free Group Relative Policy Optimization (Training-"); preprint.
- 24 sections and all 23 node titles match `src/App.tsx` L87-L110. Route lists and the reader profile match SCOPE.md L40, L51-L53.
- Four ideas match section 3 (policy, reward, advantage, pass@k) and section 8 (boundary, WhatRlDoes.tsx#L345-L346); grader pointers to sections 7 and 10.
- Section 10's second half uses Ralph, autoresearch and Reflexion and points to sections 12 and 15 (RewardIsAProxy.tsx#L822-L902).
- Section 22's GEPA gloss quoted verbatim (Choosing.tsx#L653-L654). Expandable pointers: section 18 to 8 (WeightsVsContext.tsx#L527-L530), section 20's calculator (CostPerImprovement.tsx#L328), section 22's pass@K cap (Choosing.tsx#L640-L646), section 15's checklist (YourLoops.tsx#L696, L704), section 22 to section 10's four checks (Choosing.tsx#L104, L496-L501), to section 7's base-rate arithmetic (Choosing.tsx#L537) and to section 23 (Choosing.tsx#L627-L636).
- Effective length and prefix caching applied in section 17 ("The context is a working set with a cliff", WhereWordsFallShort.tsx#L569).

Score: **8/10**. Accurate after the two fixes, and it ends on the reader's next action. The one-clause-gloss
promise to readers on the first two routes depends on section 20 glossing DAPO and Dr. GRPO (fc08, in
progress), so it is listed below for re-check.

## LanguageModelAsPolicy.tsx (section 3)

Claims checked: 62 (49 claim-list lines plus 13 distinct Cite sources with their badges). CONFIRMED 59;
OVERREACH 1; prose-rule fixes 2. WRONG 0, UNSUPPORTED 0, STALE 0.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 3-1 | "it is also why a per-token critic is hard to train: usually only the last token is assigned a reward score ..., which complicates training a value function that is accurate at each token" | LanguageModelAsPolicy.tsx:452-454 | OVERREACH (hedge dropped) | https://arxiv.org/abs/2402.03300v3 Section 4.1.1: "which may complicate the training of a value function that is accurate at each token" | "it also makes a per-token critic ... harder to train: ... which may complicate training a value function ..." |
| 3-2 | "critic" used before the section defines it | LanguageModelAsPolicy.tsx:452 | prose rule (RL term at first use) | Value model is defined only at L461-L470; "critic" first appears at L452 | Glossed in place: "a per-token critic, a model that predicts the final score from each token" |
| 3-3 | h1 provenance "(TRL v1.12.0 and papers, read 2026-10-30)" | LanguageModelAsPolicy.tsx:288 | provenance incomplete | The section also cites TRL v1.16.0 (`trl/trainer` listing, GRPO `beta` default) | "(TRL v1.12.0 and v1.16.0, papers read 2026-10-30)", the form section 6 uses |

Confirmed, with evidence (summary):
- E0, every figure (Tier 0, raw logs): completion mean length per step 123.94 to 163.56 (run 1) and 125.5 to 162.31 (run 2) in `logs.jsonl` `completions/mean_length`, so "124 to 164" (both landings, L428 and L659); reward 1.0 or 0.0 on the tagged integer (`train.py` `correctness`); 20 steps, each one `vllm_generate` call for 16 completions (`steps.jsonl`, `meta.json` `generation_batch_size` 16, `steps_per_generation` 1, `num_iterations` 1); `temperature` 1.0 and `beta` 0.0 in both `meta.json` files (identical), TRL 1.16.0 and vLLM 0.28.0. TRL v1.16.0 `grpo_config.py#L681-L682` `beta` default 0.0.
- TRL v1.12.0 (known item): `ppo_trainer.py#L771-L779` is the reward block, and the page's excerpt matches it line for line; `#L786-L798` is the GAE loop through `masked_fill(advantages ...)`; `ppo_config.py#L264-L267` is `gamma` default 1.0; `kl_estimator` default "k1" (L92), so the per-token term equals Ivison et al. Eq. 4. v1.13.0 release notes: "PPO is removed" and "`from trl import PPOTrainer` already stopped working in v1.10"; `ppo_trainer.py` is 404 at v1.13.0; no v1.12.x patch release exists. v1.16.0 `trl/trainer` holds GRPO and RLOO trainers (with DPO, KTO, SFT, reward, distillation) and no PPO; `trl/experimental` at v1.16.0 has no `ppo` either.
- Sutton and Barto: 3.5 policy, value and q definitions; 3.1 Markov property; 2.9 contextual bandits ("each action affects only the immediate reward. If actions are allowed to affect the next situation as well as the reward, then we have the full reinforcement learning problem") (known item); chapter 2 intro ("avoids much of the complexity of the full reinforcement learning problem"); 3.3 return; 5.4 on- and off-policy; 1.1 exploration ("does not even arise in supervised and unsupervised learning, at least in the purest forms"); 13.1 ("to ensure exploration we generally require that the policy never becomes deterministic").
- Ziegler et al. Section 2 (factorisation; "fixing the beginning of the sample to x"); Ivison et al. App. F.2 (token-view MDP, Eq. 4, value model over incomplete responses, rollout temperature 0.7), NeurIPS 2024 (PDF footer); InstructGPT Section 3.5 (bandit environment) and App. C.4 (temperature 1); Ahmadian et al. Sections 2.2 (Eq. 6) and 3.3, ACL 2024; Stiennon et al. Section 3.4 footnote 8, NeurIPS 2020 (PDF footer); GAE Sections 1 and 2 (credit assignment; A = Q - V; better-than-average reading), ICLR 2016 (PDF header); Yue et al. Section 2.2 and App. A.2 (pass@k and the unbiased estimator); Reflexion Section 1 contributions ("parameterizes a policy as an agent's memory encoding paired with a choice of LLM parameters").
- Pointers: section 4 shows the two ways to estimate the advantage (PolicyGradient.tsx#L556); section 6 meets off-policy training on fixed pairs (PreferencesToRewards.tsx#L546).
- Cross-section conditions (TRL defaults, PPO removal, E0) hold. Strongest number, one 0/1 reward per 124 to 164-token completion, lands twice.

Score: **9/10**. Accurate at the pins and against the raw logs, densely cited, and it ends on the reader's
next action. The diagram shows PPO, TRL and KL a few lines before the caption expands them.

## Repeated from sections 19-23

Figures and pointers in fc01's files that sections 19 to 23 own. Check each again after fc08 and fc09 land.

| file:line | repeated item | owner and current location | checked against |
|---|---|---|---|
| OneLoop.tsx:246 | Weights training cost: "generation takes most of each step (sections 19 and 20)" | RlStepAsSystem.tsx#L342, L478, L517 (E0 62.0% and 62.9%; Skywork 72.1%; verl 67.4%) | E0 `steps.jsonl` recomputed: `vllm_generate` 62.04% and 62.87% of summed `wall_s` |
| OneLoop.tsx:248 | Context training cost: "Little up front ... (section 20)" | CostPerImprovement.tsx#L990-L994 | section 20 text |
| OneLoop.tsx:254 | Weights cost per query: "The cost of serving the model it trained (section 20)" | CostPerImprovement.tsx#L991-L992 | section 20 text |
| OneLoop.tsx:256 | Context cost per query: tokens added, "part of which prompt caching takes back (section 20)" | CostPerImprovement.tsx#L1116-L1131 (ACE 91.8% cached, 82.6% cut) | section 20 text |
| OneLoop.tsx:452-453 | Section 22's second decision question, "what signal do you have?" | Choosing.tsx#L490 | section 22 text |
| OneLoop.tsx:503-506 | Section 22's three questions in order; "The work starts with the grader" | Choosing.tsx#L407, L434, L490, L589, L807 | section 22 text (Q3 there reads "the result", here "the learned artifact": same meaning) |
| GettingStarted.tsx:550-552 | Section 21: one RL step run, comparison protocol (corrected, 2-2) | SideBySideLab.tsx#L531, L542, L773 | section 21 text |
| GettingStarted.tsx:577-578 | Section 19 as the RL route's optional systems coda | SCOPE.md L53 | scope |
| GettingStarted.tsx:583-586 | One-clause glosses on the first two routes, GEPA example from section 22 | Choosing.tsx#L653-L654; depends on section 20 glossing DAPO and Dr. GRPO (CostPerImprovement.tsx#L1062, L1071 carry glosses now; fc08 known item) | section 22 text verbatim |
| GettingStarted.tsx:604-606 | Section 20's calculator takes inference-time sampling from section 8; section 22 caps it at the base model's pass@K | CostPerImprovement.tsx#L328; Choosing.tsx#L640-L646 | sections 20, 22 text |
| GettingStarted.tsx:612-614 | Section 22 sends a gap with no trustworthy signal to section 10's four checks | Choosing.tsx#L104, L496-L501 | section 22 text |
| GettingStarted.tsx:619-621 | Section 22 uses section 7 for the base-rate arithmetic and names an AWS service per path, detail in section 23 | Choosing.tsx#L537, L627-L636 | section 22 text |
| LanguageModelAsPolicy.tsx:428-429, 658-660 | E0: 124 to 164 tokens per completion on average, reward 1.0 or 0.0, KL coefficient 0.0 (TRL v1.16.0 default) | E0 shared with sections 19 and 21 | raw logs (see section 3 above) |
| LanguageModelAsPolicy.tsx:517-518 | E0: each of 20 steps generated 16 new completions with vLLM before it trained | E0 shared with sections 19 and 21 | `steps.jsonl` (20 `vllm_generate` calls), `meta.json` |
| LanguageModelAsPolicy.tsx:545 | E0 sampled at temperature 1.0 | E0 | `meta.json` both runs |

## Items for the orchestrator

- `GlossaryAndSources.tsx`: section 2 now describes section 24 with the glossary's own h1 wording ("every acronym ... and its reading list, grouped by authority") instead of "every source it cites". If the five missing source rows fc07 listed are added, the stronger wording could return.
- Section 2's one-clause-gloss promise (GettingStarted.tsx:583-586) rests on section 20 glossing DAPO and Dr. GRPO at first mention; re-check once fc08's edits are committed.
- Backlog, not a correction: TRL v1.17.0 and v1.17.1 have shipped since the dive's v1.16.0 pin (release list read 2026-10-30). The pin stays; the next iteration re-pins.
- Tier 0 links (`E0_URL`) point at `DIVE_REPO_SHA` bcf5a9ed, which resolves only once that commit is pushed (fc03 reported the same).

## Checks (2026-10-30, after fixes)

- typecheck: `tsc --noEmit`, exit 0, no output
- lint: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output
- test: `Test Files  2 passed (2)`, `Tests  26 passed (26)`
- `[PASS] no-ai-tells: no AI tells in 5 opted-in deep dive(s)`
- `[PASS] pinned-refs: all GitHub references pinned across 375 file(s) (5 src, 5 research)`
- `[PASS] svg-a11y: all inline <svg> accessible across 132 file(s) in 5 opted-in deep dive(s)`
- `[PASS] pre-overflow: every <pre> can scroll across 5 opted-in deep dive(s)`
