# Claims: section 1, One Loop, Three Places to Keep What It Learns (`OneLoop.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Re-opened on 2026-10-30 at the pinned version: the survey 2512.16301v3 HTML (section 1 contributions,
"two axes ... execution-grounded vs. output-evaluated"; A1 and A2 definitions; section 3.2 opening) and
Reasoning with Sampling 2510.14901v1 HTML (Table 1 Qwen2.5-Math-7B MATH500 row 0.496 / 0.748 / 0.785;
section 5.3 multiplier 8.84x from N_MCMC=10, T=679, B=192). Every other assertion is a pointer to the
section that owns it and carries no figure; its source is that section's file and line, whose own
claims file holds the citation.

## Cited claims (2 sources, 3 Cite elements)

- A training-free sampler nearly matched the single-shot score of GRPO on a math benchmark, at about 8.84 times the tokens per answer (stated twice: the "fourth route stores nothing" paragraph and the answer to question 2; wording and citation identical to section 8, WhatRlDoes.tsx L346-L355) | https://arxiv.org/abs/2510.14901v1 (Table 1 and Section 5.3) | F02-58; wave2-rlvr row 4 (HOLDS); wave2-systems-cost row 28 (HOLDS)
- The dive's second axis, where the signal comes from: execution-grounded (the result of a tool call or code run: tests, a compiler, an environment) or output-evaluated (a score on the final output: an exact-match check against a gold answer, a rubric, or a judge); gloss verbatim from wave 2 | https://arxiv.org/abs/2512.16301v3 (Section 1) | F04-77; wave2-words row 35 (SCOPE NARROWER, gloss as corrected)

## Pointer claims (no figure; source is the owning section)

- Every method in the dive runs one loop: sample, score, change something so the next attempts score better; methods differ in where the change lands | SCOPE.md Thesis; Choosing.tsx L379-L386 | thesis
- The location of the update decides training cost, serving cost, retention and what can be learned (mental model) | SCOPE.md section 1 block; synthesis of the table rows below | [our reading], per scope
- Three stores: the weights; the context a frozen model reads; a small trained model that writes context for a large one | SCOPE.md section 1 block; TextLoopAsRl.tsx L904-L911 | scope
- A loop such as Reflexion or GEPA writes a reflection, a rewritten prompt, a playbook, a memory or a skill file | SCOPE.md Thesis; TextLoopAsRl.tsx L768-L772 | thesis
- Placement, weights: policy gradient, the update behind PPO and GRPO (s4, PolicyGradient.tsx L376-L379; fc01 narrowed from "the update every RL method shares": section 4 says PPO and GRPO, and Memento's soft Q-learning in section 16 is value-based); PPO's limits on each update (s5, TwoLeashes.tsx L443); RLHF and DPO learn from preference pairs (s6, PreferencesToRewards.tsx L63, L460); GRPO and successors, program-checked answers (s7, RlvrAndGrpo.tsx L663, L832); agentic RL, Search-R1, DeepSWE, multi-turn episodes with tools (s9, AgenticRl.tsx L352, L522); SCoRe trains self-correction with RL (s12, VerbalReinforcement.tsx L619) | files as listed | section rows
- Placement, context: Reflexion, Self-Refine (s12); ExpeL, ACE, Dynamic Cheatsheet, Voyager, Training-Free GRPO (s13); GEPA among prompt optimisers (s14); Ralph, autoresearch, FunSearch, AlphaEvolve (s15) | TextLoopAsRl.tsx L73-L102 (STORE_ROWS context row) | section 11 grid
- Training-Free GRPO is a text loop named after the RL method GRPO | CostPerImprovement.tsx L998 | section 20
- Placement, small trained model: Advisor Models, Retroformer, Memento (trains the retrieval over a case bank) (s16) | TextLoopAsRl.tsx L104-L110; Hybrids.tsx L527 | section 11 grid, section 16
- A fourth route stores nothing: sampling a frozen model and choosing, with a verifier or a sampler that needs none, is paid on every query; section 8's closing block prices it | WhatRlDoes.tsx L793, L851-L852 | F02-58, section 8 [our reading]
- Table, training cost: weights a training run paid once, generation takes most of each step (RlStepAsSystem.tsx L342; CostPerImprovement.tsx L992); context little up front (CostPerImprovement.tsx L993, L1053); small model an RL run on the small model, large model through its API (Hybrids.tsx L358) | files as listed | sections 19, 20, 16
- Table, cost per query: weights the cost of serving the trained model (CostPerImprovement.tsx L992); context added tokens, part taken back by prompt caching (CostPerImprovement.tsx L1108); small model a call on each input plus added words (Hybrids.tsx L347) | files as listed | sections 20, 16 [our reading for the small-model cell]
- Table, what the model keeps: weights forgetting grows with distance from base, RL moves it less than SFT (WeightsVsContext.tsx L755, L763-L776; WhatRlDoes.tsx L575); context keeps every old ability once the text is removed (section 18's "with the loop's text removed"; fc01 aligned), text readable and removable, store polluted by misleading feedback (WeightsVsContext.tsx L763, L775, L835-L839; AccumulatingExperience.tsx L602); small model every ability of the large model once the advice is removed (Hybrids.tsx L312-L313, L372-L374; fc01 aligned) | files as listed | sections 8, 13, 16, 18
- Table, what it holds best: weights fast, calibrated or general, sharpening, new reasoning skill through distillation (WeightsVsContext.tsx L755, L828; WhatRlDoes.tsx L348); context specific, recent and auditable, instructions, procedures, facts (WeightsVsContext.tsx L835; WhatRlDoes.tsx L874-L877); small model per-input behaviour for a model you cannot train (Hybrids.tsx L438) | files as listed | sections 8, 16, 18
- In this dive the signal axis crosses all three stores, an extension of the survey's frame (the survey applies the execution/output split to agent updates only); section 11 places every words-track method on the grid | TextLoopAsRl.tsx L909-L921, L976-L978 ("our extension of its frame") | section 11; fc01 added the extension label
- In every store the score decides whether anything is learned and is the surface that gets gamed; section 10 builds a grader for training runs and text loops; section 12 shows a loop with no outside signal | SCOPE.md Thesis para 4; RewardIsAProxy.tsx L446; VerbalReinforcement.tsx L416, L554 | thesis (F04-21, F02-79 owned by sections 10 and 12)
- Section 22's second decision question: what signal do you have | Choosing.tsx L490 | section 22
- Q1: on the models and benchmarks in the studies the dive read (section 8's hedge; fc01 narrowed from "tested so far"), RLVR mostly sharpens; the weight change is small; section 8 answers it | WhatRlDoes.tsx L341, L348, L575 | F02-40, F02-47 (owned by section 8)
- Q2: closing block of section 8, then 11 to 16; a frozen model buys part back by sampling and choosing; a text loop captures missing instructions and procedures cheaply | WhatRlDoes.tsx L851-L877; SCOPE.md Thesis para 3 | F02-58, F03-61 and F04-46 (figures left to sections 14 and 20)
- Q3: our reading, words fall short where the gap is reasoning skill, per-input behaviour, exploration or credit assignment; section 17 | SCOPE.md Thesis para 3; WeightsVsContext.tsx L808-L809; Hybrids.tsx L438; WhereWordsFallShort.tsx L388, L499 | F03-62, F03-107, F04-8, F04-26 (owned by sections 14, 16, 17)
- Q4: three decision questions in order; start with the grader; section 22 answers it | Choosing.tsx L371-L386, L805-L807 | section 22
- Section 2 gives four ideas and the shortest route; section 24 catches terms met out of order | SCOPE.md L38-L40 | scope sections 2 and 24
