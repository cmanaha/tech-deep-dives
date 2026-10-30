# Claims: section 16, Hybrids (`src/sections/Hybrids.tsx`)

Authored 2026-10-30. Every arXiv source below was re-fetched at the pinned version on 2026-10-30 (PDF via `https://arxiv.org/pdf/<id>`, text extracted with `pdftotext`) and the cited passage re-read. TRL read at v1.16.0 (`trl/trainer/grpo_trainer.py` via raw.githubusercontent.com at the tag). Venues: Advisor Models from its v3 PDF header ("Proceedings of the 43rd International Conference on Machine Learning ... PMLR 306, 2026"); Retroformer from its v3 PDF header ("Published as a conference paper at ICLR 2024"); EVOLvE confirmed at the proceedings (proceedings.mlr.press/v267, "EVOLvE: Evaluating and Optimizing LLMs For In-Context Exploration", PMLR 267:46346-46376) and in its arXiv comments ("Published at ICML 2025"); BetterTogether confirmed in the ACL Anthology (2024.emnlp-main.597) and its arXiv comments ("EMNLP 2024"); Memento and Snell et al. carry no venue in their arXiv records (preprint); Schmied et al. (LLMs are Greedy Agents) is an ICLR 2026 poster per OpenReview weUP6H5Ko9 (badge corrected from preprint by fact check fc06, matching section 17). Format: `claim | source URL | register or wave 2 row`.

## Intro
- A hybrid keeps the large model frozen and trains a small model whose output is words in the large model's context (framing) | https://arxiv.org/abs/2510.02453v3 (abstract, Sec 3) | F03-105; wave2-words row 14
- Advisor Models trains small open-weight models to generate per-instance natural-language advice for black-box models whose weights cannot be modified | https://arxiv.org/abs/2510.02453v3 (abstract) | F03-104, F03-105
- Strongest number, landing 1 (and h1 description): on MTOB, chrF 31.17 baseline, 38.98 advisor, 42.38 direct RL; about 70% of the gain [derived] | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3, Fig 9) | F03-108; wave2-words row 15

## Two roles
- Advisor is the small trained model (e.g. Qwen2.5 7B Instruct); student is the frozen model (e.g. GPT-4o mini); "black-box" and "student" used interchangeably | https://arxiv.org/abs/2510.02453v3 (Sec 3; Sec 4 models) | F03-105; wave2-words row 14
- Basic design: advisor sits between user input and student; advice injected in-context | https://arxiv.org/abs/2510.02453v3 (Sec 3, Fig 1) | F03-105
- Training: advisor samples candidate advice, student produces outputs conditioned on it, task-specific reward computed from the output; GRPO updates the advisor "based only on observed rewards" | https://arxiv.org/abs/2510.02453v3 (Sec 3) | F03-105; wave2-words row 14
- No gradient access from the student; training needs only API access | https://arxiv.org/abs/2510.02453v3 (Sec 3; Fig 2 caption) | F03-105 (beyond the register quote)
- GRPO gloss (group of outputs per input, above-average ones made more likely) | dive-wide definition, section 7 | -
- Diagram: no numbers; scorer examples chrF, accuracy (RuleArena 0/1), judge | https://arxiv.org/abs/2510.02453v3 (Sec 4.1, 4.3) | F03-105, F03-106, F03-107
- Frozen model "can be considered as part of the environment" (Retroformer); applied to the advisor as our reading | https://arxiv.org/abs/2308.02151v3 (Sec 3, Notation and Formulation) | F04-55 (section 11's row; same quote)
- Variants: 3-step (advisor reads student's first attempt, student revises); multi-turn (actions and observations returned after every action or at intervals) | https://arxiv.org/abs/2510.02453v3 (Sec 3, Fig 2) | F03-105

## About 70% of the gain
- Authors expect direct RL to beat advisors when weights are available | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3) | F03-108
- MTOB = Machine Translation from One Book (the benchmark's own abstract; the Advisor paper writes "with One Book"; ICLR 2024 per OpenReview tbVWug9f2h; corrected by fact check fc06) | https://arxiv.org/abs/2309.16575v2 (abstract) | cross-section conditions block
- Kalamang (extremely low-resource) to English; chrF is a measure of string similarity used as reward | https://arxiv.org/abs/2510.02453v3 (Sec 4 domain description) | F03-106 (beyond the register quote)
- Qwen2.5 3B Instruct advisor, Qwen2.5 7B Instruct student, against direct training of Qwen2.5 7B Instruct, same hyperparameters, 20 epochs | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3, App D.4) | F03-108; wave2-words row 15
- Table: 31.17 / 38.98 / 42.38; gains +7.81 and +11.21 [derived] | as above | F03-108; wave2-words row 15
- Strongest number, landing 2: about 70% [derived], (38.98 - 31.17) / (42.38 - 31.17) = 7.81 / 11.21 = 0.697 | as above | F03-108; wave2-words row 15
- "remains the better option"; "make up most of the improvement over baseline" | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3) | F03-108
- Direct RL learns fast early then flattens; advisor improves steadily; both still climbing at the end | https://arxiv.org/abs/2510.02453v3 (App D.4, Fig 14) | F03-108

## When the right answer depends on who is asking
- Prompt optimiser learns one instruction every input reads (mental model, our reading; section 14 owns it) | - | F03-72 (via section 14), scope M4
- Three personalisation tasks, preferences undisclosed and learned through scalar rewards: review length, review reading level, math-solution style | https://arxiv.org/abs/2510.02453v3 (Sec 4.3) | F03-107
- Student GPT-4o mini, advisor base Qwen2.5 7B Instruct | https://arxiv.org/abs/2510.02453v3 (Fig 5 caption) | F03-107; wave2-words row 16
- PAG (Profile-Augmented Generation) and GEPA "marginally above the un-optimized baselines, if at all" | https://arxiv.org/abs/2510.02453v3 (Sec 4.3.1) | F03-107; wave2-words row 16
- Advisor: 0.94 of max 1.0 (review length), 99.6% accuracy (review level), 0.948 of max 1.0 (math solutions) | https://arxiv.org/abs/2510.02453v3 (Sec 4.3.1, Fig 5) | F03-107; wave2-words row 16
- Authors worked with GEPA's authors to confirm a fair GEPA implementation | https://arxiv.org/abs/2510.02453v3 (Sec 4.3.1) | F03-107
- Mental model: when the right behaviour depends on something hidden per instance, some weights have to learn it | scope section 16 mental model (our reading) | F03-107, scope M4

## An advisor needs something to learn
- "there must be something for the advisor to learn" | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.4) | F03-109; wave2-words row 17
- One domain: MATH-500, Qwen2.5 7B Instruct advisor, GPT-4o mini student, same hyperparameters, 20 epochs; no significant improvement over baselines | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.4, Fig 10) | F03-109; wave2-words row 17 (SCOPE NARROWER applied: one domain)
- "maxed-out" is the authors' explanation, kept as theirs; its subject in the source is "frontier models" (page wording aligned by fact check fc06) | https://arxiv.org/abs/2510.02453v3 (Fig 10 caption, Sec 4.4.4) | F03-109; wave2-words row 17
- Gains were found on domains chosen for knowledge the student lacked (low-resource language, complex rule-following) or preferences unknown in advance | https://arxiv.org/abs/2510.02453v3 (Sec 1; Sec 4 opening desiderata) | F03-106, F03-107 (beyond the register quote)

## The same split, elsewhere
- Retroformer: frozen model's reflection "only rephrases the prior failed actions sequences as the proposed plan", repeated wrong actions next trial; one example | https://arxiv.org/abs/2308.02151v3 (Fig 1) | F04-24; wave2-words row 32
- Retroformer keeps the actor frozen, fine-tunes a smaller local reflector with PPO, rating each reflection by the change in return between consecutive trials | https://arxiv.org/abs/2308.02151v3 (Sec 4, 4.2 Response Rating) | F04-24
- Memento: case bank of past experiences; learns which case to retrieve with soft Q-learning with the LLM component fixed (source: "with the LLM component p_LLM fixed"; paraphrased without quote marks by fact check fc06) | https://arxiv.org/abs/2508.16153v2 (Sec 3, "Soft Q-Learning for CBR Agent") | F03-81; wave2-words row 41 (soft Q-learning re-read at Sec 3)
- RL fine-tuning of Gemma2 2B and 9B on bandits: raised exploration, lowered regret, exploration still sub-optimal; for 2B narrowed the gap to UCB | https://arxiv.org/abs/2504.16078v1 (Sec 1; Sec 4.3) | F04-13; wave2-words row 42
- Distilling a bandit algorithm via in-context demonstrations and fine-tuning on algorithm-generated data: smaller models surpass larger ones in exploration on various tasks | https://arxiv.org/abs/2410.06238v2 (abstract; Sec 4 intro and 4.2 attribute the smaller-beats-larger result to algorithm distillation; cite label widened by fact check fc06) | F04-14; wave2-words row 42
- Context distillation: gains from instructions or scratchpad disappear without the tokens; fine-tune the model to predict its own final answer from the task input alone, internalising the gain | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45; wave2-words row 43
- BetterTogether: alternate prompt and weight optimisation of a pipeline so the same LM teaches itself | https://arxiv.org/abs/2407.10930v2 (abstract) | F03-111; wave2-words row 44

## Build it
- Integration = one environment step that calls the black-box model with the advisor's output and evaluates the reward on the student's final output | https://arxiv.org/abs/2510.02453v3 (Sec 3) | F03-105 (beyond the register quote)
- Advisor sees the task input; plus first attempt (3-step) or actions and observations (multi-turn) | https://arxiv.org/abs/2510.02453v3 (Sec 3, Fig 2) | F03-105
- Output is natural-language advice injected into the student's context; "appended to any information usually provided to the student" is stated for the multi-turn design (scope narrowed by fact check fc06) | https://arxiv.org/abs/2510.02453v3 (Sec 3) | F03-105
- Advice before and after training shown in the paper | https://arxiv.org/abs/2510.02453v3 (Fig 2) | F03-105 (beyond the register quote)
- Rewards: chrF (MTOB), 0/1 tax calculation (RuleArena Taxes), LLM judges GPT-4.1 mini (Math Solutions) and GPT-5 mini (Review Level) | https://arxiv.org/abs/2510.02453v3 (Sec 4.1, 4.3) | F03-106, F03-107 (beyond the register quote)
- 200 examples x 20 epochs x group 8 = 32,000 frontier calls, "thousands of dollars"; trained with low-cost students and transferred to frontier students | https://arxiv.org/abs/2510.02453v3 (Sec 4 opening; Sec 3 transferability) | F03-110
- "Score the student alone first" is guidance drawn from the MATH-500 limit (our reading) | - | F03-109
- GRPO; SkyRL fork on one 8xH100 node | https://arxiv.org/abs/2510.02453v3 (Sec 3; App A) | F03-105
- TRL custom reward function receives prompts and completions plus extra dataset columns, returns a list of rewards, sync or async | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L177-L191 | read at v1.16.0 (docstring)
- Code: reward functions called with prompts, completions, completion_ids and dataset columns as kwargs; exactly one reward per completion enforced; async functions gathered | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L1579-L1661 | read at v1.16.0
- Code: non-conversational datasets get completions as decoded strings | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2229-L2247 | read at v1.16.0
- Advisor as the GRPO model with student call and scorer in the reward function (our reading of the contract); code sketch labelled illustrative, not run | - | -
- Strongest number, landing 3: about 70% of direct RL's gain [derived] | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3) | F03-108
