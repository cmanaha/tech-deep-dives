# Claims: section 11, A Text Loop Is RL on the Context (`TextLoopAsRl.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Re-opened on 2026-10-30 at the pinned version and checked against the page text: Reflexion v4 PDF,
Retroformer v3 PDF, TextGrad v1 PDF, the survey 2512.16301v3 HTML, GEPA v2 HTML, ACE v3 HTML, ExpeL v3
PDF, Self-Refine v2, CLIN v1, ReasoningBank v2, Dynamic Cheatsheet v1, Voyager v2, Training-Free GRPO
v1, ProTeGi v2, OPRO v3, MIPRO v2, Advisor Models v3, Memento v2, AlphaEvolve v1, Krishnamurthy et al.
v3 (abstract page), von Oswald et al. (arXiv abstract and PMLR v202 page), Shen et al. (PMLR v235
page), autoresearch program.md and prepare.py at SHA 228791fb. FunSearch (Nature) and Huntley's Ralph
post are carried from wave 2 rows read 2026-10-30, not re-opened by this agent.

Venues confirmed this session: Reflexion NeurIPS 2023 (papers.nips.cc proceedings page); Retroformer
ICLR 2024 (v3 PDF header "Published as a conference paper at ICLR 2024"); von Oswald et al. ICML 2023
(PMLR v202 page); Shen et al. ICML 2024, position paper (PMLR v235 page title "Position: ..."); TextGrad
Nature 639, 609-616 (2025) via Crossref for DOI 10.1038/s41586-025-08661-4 (journal title "Optimizing
generative AI by backpropagating language model feedback"; the quote is read from arXiv v1, the Nature
text was not read); arXiv comments: OPRO ICLR 2024, ExpeL AAAI-24, ProTeGi EMNLP 2023, MIPRO EMNLP
2024, ACE ICLR 2026, GEPA ICLR 2026 (Oral), ReasoningBank ICLR 2026, Advisor Models ICML 2026,
Krishnamurthy et al. NeurIPS 2024. From wave2-words G5 (not re-checked): Self-Refine NeurIPS 2023,
CLIN COLM 2024, Dynamic Cheatsheet EACL 2026, Voyager TMLR. Preprint: survey 2512.16301v3, Memento,
Training-Free GRPO, AlphaEvolve. FunSearch: Nature (published 14 December 2023).

Location note for the fact check: the Retroformer reduction quote sits in Section 3 (Notation and
Formulation) of the v3 PDF, just before the Section 4 heading; wave2-words row 31 says "sec. 4, after
Eq. 2". The page cites Section 3.

## Intro (h1)

- A text loop improves a frozen model by changing what it reads (reflection, prompt, playbook lesson, skill file) | definitional; sources in the table rows | SCOPE thesis; register 03 header
- Playbook = a list of itemised lessons the loop maintains | SCOPE section 11 wording | SCOPE
- Mental model: a text loop is an optimiser whose parameters are tokens in the context | our reading | SCOPE section 11 mental model; F04 section 4 model 1
- Reflexion ablation, 50 hardest HumanEval Rust problems, GPT-4: 0.52 without test generation, 0.60 base, 0.68 full | https://arxiv.org/abs/2303.11366v4 (Table 3, "Ablation study") | F04-21, F03-5; wave2-limits row 3; wave2-rlvr row 52
- "RL says nothing can be learned" without a signal | our reading (RL principle) | SCOPE section 12 mental model

## The analogy, made exact

- Policy = distribution the agent samples actions from; training changes its parameters | definition (section 3 owns it) | register 01
- Reflexion defines its policy as "an agent's memory encoding paired with a choice of LLM parameters" | https://arxiv.org/abs/2303.11366v4 (Sec. 1 contributions) | F04-54, F03-2; wave2-words row 18; wave2-foundations row 8
- Memory is a short buffer of written reflections; LLM parameters fixed | https://arxiv.org/abs/2303.11366v4 (Abstract, Sec. 3) | F03-1, F04-20; wave2-words row 19
- Retroformer: frozen actor "can be considered as part of the environment"; "a regular RL optimization so all the popular RL algorithms apply" | https://arxiv.org/abs/2308.02151v3 (Sec. 3, Notation and Formulation) | F04-55; wave2-words row 31
- Retroformer's writer is a small model fine-tuned with PPO | https://arxiv.org/abs/2308.02151v3 (Sec. 4.2; App. C.1: SFT, reward modelling, then PPO) | F04-24
- Whatever writes the context is the learner; the frozen model belongs to the environment | our reading of F04-54 plus F04-55 | register 04 section 4 model 1
- The writer can be a person editing the prompt between runs (Ralph operator) | https://ghuntley.com/ralph/ | F04-72; wave2-limits row 20
- RL-term table (policy, parameters, learner, environment, reward, update, step size, exploration) | our reading built on F04-54, F04-55, F04-72; step size per SCOPE section 11 | SCOPE section 11

## Where the analogy stops

- A text update computes no derivative and uses no learning rate | our reading; supported by TextGrad's metaphor statement | F04-57
- TextGrad: "we use differentiation and gradients as a metaphor for textual feedback from LLMs" | https://arxiv.org/abs/2406.07496v1 (Sec. 1) | F04-57; wave2-words row 34
- TextGrad passes critiques backward through a graph of text variables | https://arxiv.org/abs/2406.07496v1 (Sec. 2) | F03-43
- Reflexion calls its reflections a "semantic" gradient signal | https://arxiv.org/abs/2303.11366v4 (Sec. 1) | F04-54
- Reflexion lists "not having a formal guarantee for success" | https://arxiv.org/abs/2303.11366v4 (Sec. 1) | F04-19
- ICL equals gradient descent for a single linear self-attention layer on a regression loss (weight construction) | https://arxiv.org/abs/2212.07677v2 (Abstract) | F04-58; wave2-words row 33
- For pretrained LLMs the equivalence is open; position paper testing LLaMa-7B: "remains an open hypothesis" | https://arxiv.org/abs/2310.08540v5; https://proceedings.mlr.press/v235/shen24d.html | F04-59; wave2-words row 33; wave2-limits (Shen ICML 2024 position paper)
- What carries over: the loop, the roles, RL's three failure modes; no guarantee the score rises | our reading | SCOPE section 11

## Three stores, two signal sources

- Three stores (weights, context, small trained model writing context) | SCOPE section 1 | SCOPE
- Signal axis gloss: execution-grounded (tool call or code run: tests, compiler, environment) or output-evaluated (score on final output: exact match to gold, rubric, judge) | https://arxiv.org/abs/2512.16301v3 (Sec. 1 contributions; Secs. 3.2, 3.3) | F04-77; wave2-words row 35 (SCOPE NARROWER gloss used verbatim)
- Weights-row references: DeepSeek-R1 "ties the reward to test-case pass rates"; Search-R1 "exact matching accuracy"; ReTool "rewards only the final answer" | https://arxiv.org/abs/2512.16301v3 (Sec. 3.3) | F04-77; wave2-words row 35
- RLVR = RL with verifiable rewards, a program checks each answer; covered in sections 7 and 9 | section 7 owns it | wave2-rlvr G6 (expansion)
- GRPO scores each answer against others sampled for the same prompt; the difference is its advantage | section 7 owns it | F02-1, F02-2; F03-86
- Expansions: ACE Agentic Context Engineering; GEPA Genetic-Pareto; OPRO Optimization by PROmpting; ProTeGi Prompt Optimization with Textual Gradients; MIPROv2 = DSPy's implementation of MIPRO (Multi-prompt Instruction PRoposal Optimizer) | 2510.04618v3, 2507.19457v2, 2309.03409v3, 2305.03495v2 p.1, 2406.11695v2 | wave2-words G6, row 38
- Grid placements | our reading of each paper's signal (table "Feedback signal" column) | register 03 comparison table; wave2-words row 35 note
- Reflexion HotPotQA: exact match against the gold answer ("exact match answer grading ... binary success signal") = output-evaluated | https://arxiv.org/abs/2303.11366v4 (Sec. 4.2) | F03-3; wave2-words row 20
- Reflexion code runs use self-written unit tests, executed = execution-grounded | https://arxiv.org/abs/2303.11366v4 (Sec. 4.3) | F03-4
- ExpeL signals: "exact matching for HotpotQA and FEVER, completing the task in time for ALFWorld" | https://arxiv.org/abs/2308.10144v3 (Sec. 5) | F03-20 (placement re-read this session)
- Retroformer: HotPotQA F1 reward (soft match), environment rewards in ALFWorld and WebShop | https://arxiv.org/abs/2308.02151v3 (Sec. 4.1 "Reward Shaping"; App.) | F04-24 (placement re-read this session)
- ACE: execution feedback (AppWorld) and ground-truth labels (FiNER) | https://arxiv.org/abs/2510.04618v3 | F03-77; wave2-words row 28
- TextGrad signals: LLM judge, unit tests, simulators or a ground-truth metric | https://arxiv.org/abs/2406.07496v1 | F03-43 to F03-47 (register 03 comparison table)
- Memento: binary reward in deep-research tasks; GAIA scored by exact match | https://arxiv.org/abs/2508.16153v2 (Sec. 3, Sec. 5.2) | F03-81 (placement re-read this session)
- Self-Refine graded by its own feedback (no ground truth) | https://arxiv.org/abs/2303.17651v2 (Abstract) | F03-8
- Dynamic Cheatsheet curator "does not have access to ground-truth labels" | https://arxiv.org/abs/2504.07952v1 (Sec. 2) | F03-32
- ReasoningBank LLM judge "without any ground-truth reference" | https://arxiv.org/abs/2509.25140v2 (Sec. 3.2) | F03-28; wave2-words row 24
- The 0.52 against 0.68 is the coding (execution-grounded) case | https://arxiv.org/abs/2303.11366v4 (Table 3, HumanEval Rust) | F04-21
- Survey: agent updates split by "tool-execution feedback" or "evaluations of the agent's final output"; tools split by "optimized independently of any agent" or "adapted under the supervision of a fixed agent" | https://arxiv.org/abs/2512.16301v3 (Sec. 3.2) | F04-76, F04-77
- Applying the execution/output split to the context and small-model rows is our extension | our reading | F04-79 (survey's own placement differs)
- Section 22 reuses the signal question | SCOPE sections 1 and 22 | SCOPE

## Five fields describe every loop (table)

- Reflexion: 1 to 3 reflections; append after failed trial; exact match or self-written tests; actor, evaluator, reflector LLMs frozen; no cost figures | https://arxiv.org/abs/2303.11366v4 (Secs. 3, 4) | F03-1, F03-3, F03-4, F03-7; wave2-words row 19
- Self-Refine: nothing across tasks; rewrite from own feedback; one LLM as generator, refiner, feedback provider; "a feedback call and a rewrite call per round" is our reading of the method definition | https://arxiv.org/abs/2303.17651v2 (Abstract, Sec. 2) | F03-8
- ExpeL: insights with importance counts plus stored successful trajectories; ADD, EDIT, UPVOTE, DOWNVOTE, removed at zero; task success with success/failure comparison; gpt-3.5-turbo-0613 actor, gpt-4-0613 insight writer; no cost figures | https://arxiv.org/abs/2308.10144v3 (Sec. 4.2) | F03-18, F03-19, F03-21
- CLIN: causal abstractions ("is necessary to"); regenerated after each trial from the latest trial and the three most recent memories; simulator reward; gpt-4 in every role; no cost figures | https://arxiv.org/abs/2310.10134v1 (Secs. 3.1, 3.2) | F03-22, F03-24
- ReasoningBank: memory items (title, description, content); simple addition, embedding retrieval; LLM judge without ground truth; Gemini 2.5, Claude 3.7 Sonnet backbones; retrieved items in each prompt (mechanism) | https://arxiv.org/abs/2509.25140v2 (Sec. 3.2) | F03-28; wave2-words row 24
- Dynamic Cheatsheet: curated cheatsheet; curator rewrites after (DC-Cu) or before (DC-RS) each query; own assessment, no labels; single model curates; AIME 2024 Claude Sonnet 370 (baseline), 1035 (DC-RS), 1831 (DC-Cu) tokens per answer | https://arxiv.org/abs/2504.07952v1 (Sec. 2, Sec. 5 cost, footnote 13) | F03-32, F03-35
- Voyager: executable programs keyed by description embedding; add after self-verification; execution errors, environment feedback, self-verification; GPT-4 code, GPT-3.5 descriptions; GPT-4 "15x more expensive than GPT-3.5" | https://arxiv.org/abs/2305.16291v2 (Secs. 2, 4) | F03-36, F03-39; wave2-words row 27
- ACE: itemised bullets with helpful/harmful counters; deltas merged by non-LLM logic, embedding de-duplication; execution feedback with or without labels; DeepSeek-V3.1 in all roles; AppWorld offline 357 rollouts vs GEPA 1,434 | https://arxiv.org/abs/2510.04618v3 (Secs. 3, 4.7, Table 4) | F03-74, F03-78; wave2-words row 29
- Training-Free GRPO: experience library; semantic advantage only for groups with winners and losers; Add, Delete, Modify ops; ground-truth reward; about $18 to learn (DeepSeek-V3.1-Terminus row); about $0.02 per problem served | https://arxiv.org/abs/2510.08191v1 (Sec. 2, Sec. 4.2, Table 2) | F03-86, F03-88, F03-91; wave2-words rows 12, 13
- TextGrad: any text variable; critiques back-propagated through a graph, optimiser step rewrites; judge, tests or metric; at most n extra LLM calls per iteration for n edges | https://arxiv.org/abs/2406.07496v1 (Sec. 2) | F03-43
- ProTeGi: beam of prompts; minibatch-error critique, edit "in the opposite semantic direction", beam search and bandit selection; errors against labelled examples (binary F1 reported); gpt-3.5-turbo default; 12 to 50 evaluations per prompt candidate | https://arxiv.org/abs/2305.03495v2 (Secs. 2, 3) | F03-48, F03-50
- OPRO: meta-prompt with best 20 instructions; 8 instructions per step; training accuracy; PaLM 2, gpt-3.5-turbo, gpt-4; 200 steps default | https://arxiv.org/abs/2309.03409v3 (Secs. 2, 5) | F03-51, F03-53; wave2-words row 37
- MIPROv2: instructions and demos per module; surrogate model over minibatch evaluations; task metric; MIPROv2 rollouts 2,270 (PUPA) to 6,926 (HoVer) in GEPA's comparison | https://arxiv.org/abs/2406.11695v2 (Sec. 3); https://arxiv.org/abs/2507.19457v2 (App. E) | F03-56, F03-58; wave2-words rows 38, 39
- GEPA: candidate pool with per-instance validation scores; reflection rewrites one module's instruction, kept if the minibatch score improves; score plus evaluator text (compiler errors, rubric); task model Qwen3 8B or GPT-4.1 Mini; 1,839 to 7,051 rollouts vs 24,000 for GRPO | https://arxiv.org/abs/2507.19457v2 (Sec. 3, Table 1) | F03-59, F03-60, F03-61; wave2-words rows 1, 2
- autoresearch: train.py on a git branch plus results log; keep if val_bpb improved, else git reset; validation bits per byte; 5-minute training budget (TIME_BUDGET = 300) | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L103-L104; .../prepare.py#L31 | F04-61, F04-62, F04-64; wave2-limits rows 5 to 8
- FunSearch and AlphaEvolve: scored program database (islands in FunSearch); LLM writes variants, evaluator admits; programmatic score; pretrained code LLM (FunSearch), Gemini 2.0 Flash and Pro (AlphaEvolve); "on the order of 10^6" samples (FunSearch), "thousands of LLM samples suffice" (AlphaEvolve Table 1) | https://www.nature.com/articles/s41586-023-06924-6 (Methods); https://arxiv.org/abs/2506.13131v1 (Sec. 2, Table 1) | F03-92, F03-95, F03-96; wave2-limits row 16, G2 (U21 closed)
- Ralph: prompt file, plan file, AGENT.md, repository; agent updates plan and AGENT.md, operator adds signs between runs; backpressure (tests, compiler, type checks); fresh context each iteration re-reads plan and specs | https://ghuntley.com/ralph/ | F04-68 to F04-72; wave2-limits rows 17 to 21
- Retroformer: LoRA (4-bit quantized, r=1 or 4) on longchat-7b-16k; PPO with reward = difference in episode returns between consecutive trials; HotPotQA F1 reward; frozen actor GPT-3 text-davinci-003 or GPT-4; 3,383 reflection samples for HotPotQA | https://arxiv.org/abs/2308.02151v3 (Secs. 4.1, 4.2, 5.2; App. C.1) | F04-24, F04-25
- Advisor Models: advisor weights (Qwen2.5 7B Instruct); GRPO on the advisor; reward from the student's final output; students GPT-4o mini, GPT-4.1 mini, Gemini 2.5 Flash; single node of 8xH100 | https://arxiv.org/abs/2510.02453v3 (Secs. 3, 4; App. A) | F03-105, F03-110; wave2-words row 14
- Memento: case bank (state, plan, reward) plus Q-network; soft Q-learning on case retrieval with the LLM fixed; binary reward; GPT-4.1 planner, o3 (GAIA) or o4-mini executor; GAIA Level 3 peaked at 121k input tokens | https://arxiv.org/abs/2508.16153v2 (Secs. 3, 5.3, 6.1) | F03-81, F03-83; wave2-words row 41
- Step size = how much of the context one update rewrites; prompt vs playbook | SCOPE section 11 | SCOPE
- GEPA reflection-model calls on Qwen3 8B: 17 (IFBench) to 90 (AIME-2025) per task | https://arxiv.org/abs/2507.19457v2 (App. N, Table 4) | F03-68
- GEPA's GRPO baseline: 500 training steps, 24,000 rollouts | https://arxiv.org/abs/2507.19457v2 (App. E.4) | F03-64; wave2-words row 2

## What the frame predicts

- Signal: Reflexion 0.52 / 0.60 / 0.68 (repeat of the intro number) | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21
- Step size: ACE case study on AppWorld, full rewrite each step (shown through Dynamic Cheatsheet): 18,282 tokens to 122, accuracy 66.7 to 57.1, baseline 63.7 without adaptation | https://arxiv.org/abs/2510.04618v3 (Sec. 2.2) | F03-75, F04-36; wave2-words row 25
- "Too large a step overshoots and undoes progress" in gradient descent | general optimisation knowledge, uncited | none
- Exploration: Reflexion WebShop runs stopped after four trials without improvement; "unable to solve tasks that require a significant amount of diversity and exploration" | https://arxiv.org/abs/2303.11366v4 (App. B.1) | F04-23, F03-6
- Bandits: across GPT-3.5, GPT-4 and Llama2, only one configuration explored satisfactorily (GPT-4, chain-of-thought, externally summarised history) | https://arxiv.org/abs/2403.15371v3 (Abstract) | F04-8; wave2-limits rows 1, 24
- Closing: Reflexion moved from 0.52 to 0.68 on one change, the tests | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21
