# RL dive: rename-and-scope plan (fine-tuning in general, mostly RL)

**Status:** built by the rl-finetune-build job on 2026-11-07, with the recommended answers to the five open questions in section 8 (the assistant's choices, each reversible; Carlos said "keep going" without answering them). Plan written 2026-11-06. No section, `App.tsx`, `index.html`, README or other dive is changed by this document. Written by the rl-finetune-scope job on branch `docs/rl-explain-sections-1-5`, on top of 5bb5e26 (accuracy fixes from the RL expert review of the round-2 prose of sections 1 to 5).

**What Carlos asked for, in his words.**

- 2026-11-03: "I want to change the whole deep dive and at the same time I want to make sure that later on we can extend to any kind of fine tuning, not just only reinforced learning. Most of it is going to be reinforced learning, but I think that I was missing and it's very close to what we're doing with distillation and stuff like that."
- 2026-11-02: "I think that we need more than that. I think that we need a similar explanation [with] graphs and charts similar to what we've done. So this technique probably should be called fine-tuning techniques." He asked whether "fine-tuning techniques" would cover most fine-tuning techniques.
- 2026-11-06: "After the 07:00 reset, start the RL dive rename and scope plan; show me three title options first."

**Inputs read.** `SCOPE.md` (v2.1), `RESEARCH-GUIDE.md`, `README.md`, `src/App.tsx`, the h1 and h2 headers of all 24 section files, the claim registers in `research/2026-10/` (searched, not read end to end), `GlossaryAndSources.tsx`, the training dive's section 16 (`deep-dives/llm-training-systems/src/sections/FineTuning.tsx`), every inbound reference to the dive's path (`git grep rl-agentic-loops`), `docs/standards/explaining-concepts.md`, and Carlos's notes in `_ops/jobs/rl-explain/carlos-feedback.md`. No web fetch was made.

**How to read the markers.** Claim IDs such as F02-12 point to entries in `research/2026-10/NN-*.md`, each with a pinned source, its tier and a verbatim quote; the first mention of each says what it is. "Old 7" and "new 9" are section numbers before and after the change. `[SPECULATIVE, verify at source]` marks a technique or fact the assistant knows only from its training data; nothing so marked may reach the page before Gate 1 research confirms it. `[our reading]` marks an inference no single source states.

---

## 1. Title options (Carlos picks)

The three options were sent to Telegram on 2026-11-06 (message 1955). None uses an acronym, so "Reinforcement Learning" is spelled out at the reader's first sight of it, in the page header. Whichever is picked, the subtitle's first "reinforcement learning" should carry "(RL)", so that the bare "RL" in the navigation ("7. RLVR & GRPO", "8. What RL Does to a Model") has its expansion above it.

**Option A. Leads with fine-tuning**
- Title: Fine-Tuning Techniques: Where the Learning Signal Comes From, With Reinforcement Learning in Depth
- Subtitle: Supervised examples, a stronger model's answers, preference pairs and scored attempts: what each signal teaches a language model, how reinforcement learning turns a score into a weight update, and when a loop over a frozen model's context does the same job
- Promise and room to grow: a map of fine-tuning organised by where the signal comes from, with reinforcement learning as the deep track. Any later technique slots into the map as one more signal source without a rename. It reuses the working title the assistant proposed for the new section (Carlos did not approve a section name; see the correction under new 3).
- Context-loop half: only in the subtitle. The title reads as a weights-only dive, so the learning-in-words sections would sit under a heading that does not announce them.

**Option B. Leads with learning from feedback**
- Title: Learning From Feedback: Fine-Tuning, Reinforcement Learning and Agentic Learning Loops
- Subtitle: How a language model learns from examples, a teacher's answers, preferences or scores, whether the change is written into its weights or into the context a frozen model reads, and how to choose between them
- Promise and room to grow: keeps today's first half, so readers and inbound links still recognise it, and adds fine-tuning as the umbrella that reinforcement learning sits under. "Fine-Tuning" in the title covers any later technique; "Learning From Feedback" is the thread that ties weights and context together.
- Context-loop half: yes, named in the title and in the subtitle.

**Option C. Names both places the learning can go**
- Title: Weights or Context: How a Language Model Learns After Pretraining
- Subtitle: Fine-tuning by where the signal comes from (supervised examples, distillation from a teacher, preference optimisation, reinforcement learning), the same loop run in words over a frozen model, and how to choose between them
- Promise and room to grow: frames the whole dive as one question, where the learning is stored, which is today's section 1 thesis. "After pretraining" scopes in every fine-tuning technique, current or later, plus prompt and memory loops, so nothing new needs a rename.
- Context-loop half: yes, it is half the title. Reinforcement learning, the bulk of the dive, appears only in the subtitle.

---

## 2. Scope

### 2.1 Fine-tuning, as the dive will use the word

Fine-tuning is any further training of an already pretrained model's weights. The training dive's section 16, Fine-Tuning & Post-Training Runs, uses the same definition and names the stages after pretraining post-training: supervised fine-tuning on example answers, preference training on ranked answers, and RL. Under that definition RL is one family of fine-tuning, which is also how AWS names it ("reinforcement fine-tuning", F06-13, Bedrock's customisation overview, Tier 1). The new map section states this at the first use of the word.

Fine-tuning techniques differ on two independent axes: where the learning signal comes from, and how much of the model changes. The dive adds a third view it already owns: where the learning is kept (the weights, the context a frozen model reads, or a small trained model).

### 2.2 Axis 1, where the learning signal comes from: the dive's new map

This axis becomes the dive's map. Every row below is a signal source named in the dive's own research, except row 7.

| # | Signal source | Technique family | What the model trains on | Signal density | Whose samples | Where in the new order | Evidence already in the registers |
|---|---|---|---|---|---|---|---|
| 1 | Raw domain text | Continued pretraining (the research calls it unsupervised fine-tuning) | Next token of documents, no instruction targets | Every token | Fixed data | One row in new 3, no section | F04-43 (retrieval scored 0.875 against 0.504 for fine-tuning on raw documents, Mistral 7B, EMNLP 2024) |
| 2 | Example answers | SFT (supervised fine-tuning) | Next token of a written answer, the prompt carries no loss | Every answer token | Fixed data | New 4 | F01-46 and F01-48 (InstructGPT's SFT stage, about 13k prompts), F01-85 (SFT on fixed targets with weight one, RL on own samples weighted by reward), F01-90 (SFT memorised where RL generalised, one 11B model, two tasks), F02-52 (RL compresses wrong trajectories, SFT expands correct ones), F02-87 (RL forgot less than SFT at matched gain) |
| 3 | A stronger model's answers | Distillation | The teacher's sampled answers (sequence level) or its next-token probabilities (token level) | Every token | Fixed teacher data | New 4 (mechanism), new 11 (against RL) | F02-12 (DeepSeek-R1's Table 16: distillation beat RL at 32B), F02-44 and F04-49 (Yue et al.: distillation brings new reasoning patterns from the teacher), F06-13 (Bedrock lists distillation), wave 2 G3 (Gemma 3 post-training relies on knowledge distillation). Token-level distillation has no claim in hand. |
| 3b | Variants of row 3 already in the registers | Context distillation; algorithm distillation; best-of-n distillation (BOND) | The same model with a prompt as its own teacher; an RL algorithm's logged learning histories; the output distribution of best-of-n sampling | Every token | Fixed data | One line each in new 4, with pointers to where they live today (old 16, 17, 18 and 22) | F04-45 (context distillation moves a prompt's effect into weights), F04-1 to F04-7 and F04-14 (algorithm distillation), BOND in the glossary and the Gemma 3 quote |
| 4 | The model's own samples, filtered by a grader | Rejection-sampling fine-tuning (expert iteration) | SFT on the samples that passed | Every token of a kept sample | Own samples | Bridge at the end of new 4; its row in the gradient table stays in new 6 | F01-71 (online rejection sampling beat offline), F02-74 (SWE-Gym trains this way, not with policy gradient) |
| 5 | Preference pairs | Preference optimisation: a reward model plus RL (RLHF), or offline DPO and its relatives | Which of two answers is better | One comparison per pair | Fixed pairs (DPO) or own samples (RLHF) | New 8 (old 6, retitled) | F01-44 to F01-69, F01-72 and F01-73 (DPO against PPO), wave 2 G3 (Llama 3 chose DPO over PPO); AI-written preferences and critiques F01-77 to F01-84 (RLAIF, Constitutional AI) |
| 6 | Scores on the model's own attempts | RL: from a learned reward model (RLHF), a program (RLVR, RL with verifiable rewards), an environment over many turns (agentic RL), or a rubric or LLM judge | The model's own answers, weighted by score | One score per response; per step with a process reward model | Own samples | New 5 to 13 (old 3 to 10) | The bulk of registers 01 and 02 |
| 7 | A teacher's per-token judgement of the model's own attempts | On-policy distillation | The student's own answers, with the teacher's probability as a target at every token | Every token | Own samples | Candidate block in new 11 | None. [SPECULATIVE, verify at source] |

Two consequences for the writing.

- **One gradient behind every row.** DeepSeekMath's unified view (F01-70: every post-training method is a coefficient times the gradient of a log-probability; methods differ in where the data comes from, what scores it and how the score becomes the coefficient) is already the mental model of old section 4. The map section states it once at intuition level, and the gradient table now starts in new 4 with the SFT and distillation rows.
- **"Signal source" takes a new meaning, and the old one is renamed.** Today section 1's "Where the score comes from" and old section 11's "Three stores, two signal sources" use signal source for a narrower split: execution-grounded (tests, a compiler, an environment) against output-evaluated (a gold answer, a rubric, a judge), from the Adaptation of Agentic AI survey (F04-77). Under the new map that split lives inside row 6, as how a score is checked. The plan renames it there ("two ways to check a score") and says so at the switch, per the explaining-concepts rule on second meanings.
- **One abbreviation collision to keep out.** RFT means reinforcement fine-tuning throughout the dive (Bedrock's name, used in old 22 and 23). Rejection-sampling fine-tuning is never abbreviated.

**Answer to Carlos's question ("would fine-tuning techniques cover most of the fine-tuning techniques?").** [our reading] By signal source, yes for every family the research names: continued pretraining, SFT, distillation and its variants, rejection sampling, preference optimisation and RL. What "fine-tuning techniques" does not answer on its own is how much of the model changes, which is the second axis, and the techniques listed in 2.5 as out of scope.

### 2.3 Axis 2, how much of the model changes: a pointer

One short block in new 3: full fine-tuning, LoRA (low-rank adaptation, small trainable matrices beside frozen weights) and QLoRA (LoRA over a base quantised to 4 bits), one line each, linking to the training dive's section 16 for memory sizing and frameworks. Two facts the RL dive already holds stay with it: in Thinking Machines' runs a rank-1 LoRA adapter matched full fine-tuning for policy-gradient RL (F02-86, Tier 2 lab blog), and serving a fine-tuned adapter is covered by the vLLM dive's section 13, LoRA & Multi-Adapter Serving. No memory arithmetic is repeated in this dive.

### 2.4 The context half: kept, as the second place a signal's lesson can be kept

The learning-in-words sections (old 11 to 16: text loops as RL, verbal reinforcement, memories and playbooks, prompt optimisation, the reader's own loops, hybrids) stay. Carlos has not said to drop them, and the new framing gives them a clear place: the signal axis is shared, and the store differs. Fine-tuning is the weights column of a grid whose rows are the signal sources.

Cells of that grid the research already supports:

| Signal source | Weights | Context of a frozen model | A small trained model |
|---|---|---|---|
| Example answers | SFT (new 4) | Few-shot demonstrations chosen by an optimiser: MIPROv2 in old 14 proposes instructions and demonstrations | n/a |
| A stronger model's answers | Distillation (new 4, new 11) | A strong model writes the prompt a cheap model runs, TextGrad (F03-46, already in old 14) | n/a |
| Preference pairs | DPO, RLHF (new 8) | None located in the research read | n/a |
| Scores on own attempts | RL (new 5 to 13) | Reflexion, playbooks, GEPA (old 12 to 14; F04-54, F03-61, F04-21) | An advisor trained with RL in front of a frozen model (old 16) |

The empty cells are a statement about the research read, not about the world. Old 18 (what lives in weights and what in context) and old 22 (the choice) already make the store decision; under the new map they take the signal row as their input.

### 2.5 What stays out

- Pretraining from scratch: the training dive owns it.
- Memory sizing, sharding and frameworks for SFT and distillation runs: the training dive's section 16. The RL dive keeps only the RL step as a system (old 19), because rollout generation makes it a different job.
- LoRA and QLoRA mechanics (training dive 16) and adapter serving (vLLM 13; SGLang 12, Talking to SGLang: APIs, LoRA & the Admin Plane).
- Model compression other than distillation used as a training signal: pruning, quantisation-aware training, architecture search. Quantisation for inference is the silicon dive's section 27.
- Weight merging and averaging (WARM and WARP appear only as names in the Gemma 3 quote): at most a name in the map, no section. [our scope call]
- Embedding and reranker fine-tuning, and vision or multimodal specifics.
- Retrieval as a technique, beyond the facts-in-context row of old 18.

A later technique enters as a row of the map. It gets a section only if it passes the section-shape test (builds a mental model or is practical to know).

---

## 3. Section map

Twenty-four sections become twenty-seven: three new, none merged or split. Merging and splitting were considered for old 6 (RLHF and DPO in one section) and not proposed, because its decision (DPO on pairs you hold first, RL when a verifier can score fresh samples) needs both methods in one place.

### 3.1 The current 24 sections

| Old | Current title | Mark | New | What changes |
|---|---|---|---|---|
| 1 | One Loop, Three Places to Keep What It Learns | Retitle, rework | 1 | Working title "One Loop: What It Learns From and Where It Keeps It". Carlos's section 1 notes apply (section 4 below). The "Three places" h2 stays as written apart from RL spelled out and two links. "Where the score comes from" widens to "Where the signal comes from", one line per row of the map, pointing to new 3; its execution-grounded split moves into new 3's row 6. |
| 2 | Getting Started | Keep, rework | 2 | The "two mechanics" h2 (the two-weight gradient step and the cost of the context) shrinks to two sentences and two links (section 4 below). The four ideas gain the signal source. The routes are rebuilt for 27 sections, plus a fourth route, "I want to choose a fine-tuning technique". |
| 3 | The Language Model Is Already a Policy | Keep | 5 | Renumber. Its opening links back to new 4: SFT trains on fixed answers, RL samples its own. |
| 4 | Policy Gradient | Keep | 6 | The gradient table now starts in new 4 with SFT and distillation; this section adds REINFORCE, rejection sampling and RLOO or GRPO. Its first h2 ("REINFORCE: fine-tune on your own samples, weighted by their score") now leans on new 4's SFT. |
| 5 | Two Leashes: PPO's Clip & the KL | Keep | 7 | The KL to the starting model is unchanged; new 4 uses a KL to a teacher first (token-level distillation), so this section says at the switch that the reference point is now the starting model. |
| 6 | From Preferences to Rewards | Retitle | 8 | "Learning From Preferences: Reward Models, RLHF & DPO", naming the signal source first to match the map. Content kept. |
| 7 | RLVR & GRPO | Keep, one claim moves | 9 | The DeepSeek-R1 distillation-against-RL figures (F02-12) move to new 11; one sentence and a pointer stay. |
| 8 | What RL Does to a Model | Keep | 10 | The debate's "new information from a teacher" setting points to new 11. The one-bit information argument (F02-86) stays here; new 11 reuses it by pointer. |
| 9 | Agentic RL | Keep | 12 | Renumber. |
| 10 | The Reward Is a Proxy | Keep | 13 | Renumber. |
| 11 | A Text Loop Is RL on the Context | Keep, one h2 retitled | 14 | h2 "Three stores, two signal sources" becomes "Three stores, two ways to check a score", tied to new 3's row 6. |
| 12 | Verbal Reinforcement & Self-Correction | Keep | 15 | Renumber. |
| 13 | Memories, Playbooks & Skill Libraries | Keep | 16 | Renumber. |
| 14 | Optimising the Prompt | Keep | 17 | Its TextGrad paragraph (strong model writes the cheap model's prompt) gains one clause tying it to distillation in new 4. |
| 15 | Your Loops Through the RL Lens | Keep | 18 | Renumber. |
| 16 | Hybrids | Keep | 19 | Renumber. |
| 17 | Where Words Fall Short | Keep | 20 | Renumber. |
| 18 | What Lives in Weights & What Lives in Context | Keep | 21 | The "new reasoning skill" row points to new 11; the "token efficiency" row (context distillation) points to new 4. |
| 19 | An RL Step Is an Inference Job Inside a Training Job | Keep | 22 | One added sentence: SFT and distillation runs are ordinary training jobs, sized in the training dive's section 16. Three other dives link to it as "section 19" (section 5 below). |
| 20 | Cost per Improvement | Keep | 23 | A distillation cost line (teacher generation priced once in training) only if Gate 1 finds a published figure; otherwise backlog. |
| 21 | Side by Side on a DGX Spark | Keep | 24 | An SFT-on-teacher arm for E1 (the five-arm protocol) goes to the backlog: new scope, new iteration. |
| 22 | Choosing a Text Loop, a Hybrid or a Weight Update | Retitle, rework | 25 | Working title "Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid". Question 2 ("What signal do you have, and what does the model score on it today?") becomes the fork into the map: written answers lead to SFT, a teacher you may train on to distillation, pairs to DPO, a grader to RL. The 0% and 95% triage (F06-9, AWS's reinforcement fine-tuning triage rule) stays. Today's single "SFT or distillation" path splits in two. Its DeepSeek-R1 paragraph shrinks to a pointer to new 11. |
| 23 | RL & Learning Loops on AWS | Retitle, rework | 26 | Working title "Fine-Tuning & Learning Loops on AWS". Adds Bedrock SFT and distillation (F06-13) and SageMaker AI distillation (wave 2 AWS row 13: the overview now lists it) beside the reinforcement fine-tuning rows; the two-stacks diagram gains them. |
| 24 | Glossary & Sources | Keep, additions | 27 | Adds distillation (sequence level, token level, on-policy if verified), continued pretraining, teacher and student, and rejection-sampling fine-tuning if missing; extends the SFT entry. |

### 3.2 New sections

**New 3. Fine-Tuning Techniques: Where the Learning Signal Comes From**
(A working title proposed by the assistant. Correction, 2026-11-07: an earlier version of this plan called it the name Carlos approved on 2026-11-03. The assistant misread his message; Carlos corrected it the same day: "let's change the name" meant renaming the whole dive. Keeping the title is fine; it is not his decision.)

- Position: after Getting Started, before the RL vocabulary. It is the map every later section hangs on.
- Depth: survey, with one mechanism (the shared gradient).
- Payoff draft: "Name the signal you have, and the family of techniques that learns from it follows."
- Explains: fine-tuning defined, with RL inside it; the seven rows of 2.2, each with what the model trains on, how dense the signal is, whose samples it uses, what it can teach and what it needs; dense against sparse as the first intuition (a target on every token against one score per response); the unified gradient (intuition, then the formula, then which term carries which choice, per the explaining-concepts standard); four published pipelines as sequences of signals; the how-much-changes pointer; the signal-by-store grid that keeps the context half in the same picture.
- Diagrams:
  - The signal-source map: one row per source, columns for training data, who supplies the target or score, density, whose samples, and the section that covers it.
  - Dense against sparse: the same six-token answer drawn twice, a target under every token (SFT, distillation) against one score after the last token (RL).
  - The signal-by-store grid of 2.4, filled cells naming a method and its section, empty cells marked "none in the research read".
  - Four published pipelines as stage strips (pretrained base, SFT, preference or RL, distillation into smaller models), each stage coloured by its signal, one strip per lab report (DeepSeek-R1, Llama 3, Gemma 3, Qwen3).
  - How much changes: full, LoRA and QLoRA as three bars of trainable share, labelled schematic, linking to training dive 16.

**New 4. Learning From Answers: Supervised Fine-Tuning & Distillation**

- Position: after new 3, before the RL vocabulary (old 3, now 5), so that policy gradient can be introduced as SFT on the model's own samples, weighted by score.
- Depth: mechanism.
- Payoff draft: "Fine-tune on answers someone else wrote, a person or a stronger model, and know what that teaches and what it costs the model you start from."
- Explains: SFT as next-token training on the answer tokens with the prompt carrying no loss, every target token weighted one; intuition, the cross-entropy formula over answer tokens, and its decomposition. What SFT teaches (format, behaviour, demonstrated reasoning) and the evidence on its price: forgetting against RL at matched gain (F02-87), memorisation on two tasks (F01-90, scoped), expansion of correct trajectories (F02-52), the format warm start RL needed (F04-48). Distillation as SFT where a stronger model writes the targets: sequence level (sample the teacher, train on its answers; DeepSeek-R1-Distill, F02-12) and token level (match the teacher's next-token distribution at every position). Token level is the dive's first use of a KL divergence, so its intuition is built here and old 5 reuses it. Context distillation and algorithm distillation as one-line variants. What distillation needs: a teacher you may train on and the inference to run it. Rejection-sampling fine-tuning as the bridge to RL: SFT on the model's own samples that a grader passed (F01-71). The gradient table opens with its SFT and distillation rows. One line each on the AWS services, detailed in new 26.
- Design choice: SFT and distillation share a section because sequence-level distillation is SFT with a teacher as the writer; a separate distillation section would repeat the loss. The comparison with RL gets its own section (new 11), because it needs the RL track first.
- Diagrams:
  - One SFT example: prompt tokens greyed with no loss, each answer token with its target and its loss term.
  - Sequence level against token level: a teacher's whole answer that the student copies, against the teacher's probability bars at one position that the student's bars are pulled toward.
  - The gradient table, rows 1 and 2 (SFT, distillation), with columns for sample source, scorer and weight, extended in new 6 to 8.
  - Rejection-sampling fine-tuning: eight own samples, the grader's ticks, the kept ones entering an SFT batch.

**New 11. Distillation or RL: A Teacher's Answers or a Score on Your Own**

- Position: after What RL Does to a Model (new 10), before Agentic RL (new 12). It needs the pass@k reading of new 10.
- Depth: deep.
- Payoff draft: "Choose between copying a stronger model and scoring your own attempts, from what each can teach and what each needs."
- Explains: the intuition first (the teacher shows the answer; the scorer judges the model's own answer; a dense target at every token against one score per response; distillation can add behaviour the student never produced, RL sharpens what it already sometimes does, and RL needs only a scorer). The evidence: on the same Qwen2.5-32B base, more than 10,000 RL steps reached 47.0 pass@1 on AIME 2024 while distillation from DeepSeek-R1 with no RL reached 72.6 (F02-12, DeepSeek-R1 supplementary Table 16, which the wave 2 RLVR re-check marked HOLDS); distillation expanded the reasoning boundary where current RLVR mostly did not (F02-44, F04-49, scoped by the authors to "current" RLVR); the information argument (F02-86, Tier 2); forgetting (F02-87); RL from a small base failing where distillation does not need it to work (F02-11). Combined recipes: prolonged RL on an already distilled 1.5B model (ProRL, F02-45). On-policy distillation as the cell between the two (the student samples, the teacher scores every token), included only if Gate 1 finds a primary source. The decision: a teacher you may train on and a gap in reasoning skill point to distillation; only a grader points to RL; a base at 0% on the grader points to SFT or distillation first (F06-9, F02-22).
- Diagrams:
  - Two loops side by side: teacher, answer, student trained on it; against student, own answers, scorer, weights.
  - DeepSeek-R1 Table 16 as grouped bars: AIME 2024, MATH, GPQA Diamond and LiveCodeBench pass@1 for QwQ-32B-Preview, Qwen2.5-32B-Zero (RL) and DeepSeek-R1-Distill-Qwen-32B, values from F02-12.
  - A pass@k sketch, labelled schematic: base, RL above at small k and below at large k, distilled above the base across k, drawn from the descriptions in F02-40 and F02-44.
  - A decision strip: teacher you may use, grader, today's score, leading to distil, SFT, RL, or distil then RL.

### 3.3 The new reading order

| Layer | New sections |
|---|---|
| A. Framing and the map | 1 One Loop: What It Learns From and Where It Keeps It; 2 Getting Started; **3 Fine-Tuning Techniques: Where the Learning Signal Comes From**; **4 Learning From Answers: Supervised Fine-Tuning & Distillation** |
| B. The RL vocabulary | 5 The Language Model Is Already a Policy; 6 Policy Gradient; 7 Two Leashes; 8 Learning From Preferences |
| C. RL with verifiable rewards, and against distillation | 9 RLVR & GRPO; 10 What RL Does to a Model; **11 Distillation or RL**; 12 Agentic RL; 13 The Reward Is a Proxy |
| D. Learning in words | 14 to 19 (old 11 to 16) |
| E. Limits and the boundary | 20, 21 (old 17, 18) |
| F. Systems and cost | 22, 23 (old 19, 20) |
| G. Practice | 24 Lab; 25 Choosing a Technique; 26 Fine-Tuning & Learning Loops on AWS |
| Reference | 27 Glossary & Sources |

---

## 4. Carlos's notes on sections 1 to 5, folded into the new order

| His note (from carlos-feedback.md) | Where it lands | What the build does |
|---|---|---|
| "we have gone too far in the opposite direction ... we're explaining, like if it was to a kid, what training is" | New 1 and 2 | Section 1's four basics paragraphs (what a model and its weights are, sampling, the context, what training is) are cut to a starting point at his level 100 to 200: open-weight models measured in billions of parameters, mixture-of-experts as a name the reader has met, prompts and context windows. The section starts from "fine-tuning changes the weights of a pretrained model". Section 2's "two mechanics" h2 shrinks to two sentences and links. Sections 3 to 5 (new 5 to 7) keep their mechanism depth; the same pass checks them for re-explained basics. |
| "You've lost the ability to link some of this stuff to the rest of the deep [dives]" | New 1, 2, 3 | Links replace the cut basics: what a training step changes goes to the training dive's section 3, One Training Step: What It Computes and Keeps; LoRA and QLoRA to its section 16; mixture of experts to the silicon dive's section 25, Mixture of Experts and Sparse Activation; the cost of a long or changing context to the vLLM dive's section 6, Automatic Prefix Caching. |
| "when we say RL for the first time, we don't introduce Reinforced Learning" | Header, subtitle, new 1 | Every title option spells it out; the subtitle carries "reinforcement learning (RL)". The only expansion in today's preview sits in the basics paragraph being cut, so the cut must carry the expansion to the first remaining use. |
| "you could have added a couple of other links, not overloaded, but the specific links to the parts where it makes sense" | All reworked and new sections | A link budget: at most two cross-dive links per section in new 1 to 4, each to a named section of another dive (the four above), none at a paragraph's end by habit. The RL dive's own sibling list gains the training dive, which it lacks today. |
| "That I quite like" (the "Three places to keep what the loop learns" h2) | New 1 | Kept as written, apart from RL spelled out and the links. |
| Distillation against RL: "So we have a good understanding and intuition of how distillation effectively is different from Reinforced Learning" | New 4 and new 11 | New 4 builds distillation as a technique; new 11 sets it against RL with the intuition, the Table 16 evidence and diagrams. The glossary gains a plain "distillation" entry, which it lacks today. |
| "we need a similar explanation [with] graphs and charts similar to what we've done" | New 3, 4, 11 | Thirteen diagrams across the three new sections, listed in 3.2, in the dive's inline-SVG style. |
| 2026-11-03: "let's change the name", which Carlos clarified the same day as renaming the whole dive | New 3 and the dive title | The dive's own title is the one picked from section 1 of this plan. "Fine-Tuning Techniques: Where the Learning Signal Comes From" is new 3's working title, proposed by the assistant, not a title Carlos approved (correction, 2026-11-07). |

Two related points that are not Carlos's notes, labelled as such:

- The rl-explain job's reader panel suggested cutting PPO's mechanism in sections 1 and 2 down to "a limit on how far one round of training can move the model". It fits the calibration above and can go in the same pass.
- `docs/standards/explaining-concepts.md` currently says that for the RL dive the ramp-up means "saying what a model's weights are before saying that training changes them". That sentence conflicts with Carlos's later section 1 note. This job does not edit the standard (open question 5).

---

## 5. Rename mechanics

### 5.1 What changes with the title (all deferred to the build)

- `src/App.tsx` lines 146 to 147: `title` and `subtitle`; the 27-entry section list; the `siblings` list gains the training dive.
- `index.html`: `<title>` and the meta description.
- `.github/pages-index.html` lines 74 to 81: the front-page card's title and description.
- `README.md`: the H1, the opening paragraph, the section count (24 to 27) and the four questions (a fifth: which technique fits the signal you have).
- `SCOPE.md`: title, subtitle, thesis and section plan, as v3. `RESEARCH-GUIDE.md`: a Gate 1 record for this iteration.
- Link texts in other dives that name the old title or "section 19" (old 19 becomes new 22):
  - `deep-dives/llm-training-systems/src/App.tsx` line 194, sibling label "RL & Agentic Learning Loops".
  - `deep-dives/llm-training-systems/src/sections/FineTuning.tsx` line 644 ("RL and Agentic Learning Loops dive") and lines 900 to 903 ("... section 19: An RL Step Is an Inference Job Inside a Training Job").
  - `deep-dives/sglang/src/sections/RlRollout.tsx` lines 593 to 596, same section 19 text.
  - `deep-dives/vllm/src/sections/OpenAICompatServer.tsx` lines 627 to 630, same section 19 text.
- Cross-references inside the dive: 783 matches of "section N" or "sections N to M" across all 24 files (a few may be section numbers inside a cited paper, which the script must leave alone). The renumber needs a scripted old-to-new mapping and a check that each reference's number still matches the title it means. This is the largest mechanical step.

### 5.2 The URL path

Inbound references to `rl-agentic-loops`, from `git grep` on this branch:

- Links that resolve to the dive's URL: `.github/pages-index.html` line 74; `deep-dives/llm-training-systems/src/App.tsx` line 194; `deep-dives/llm-training-systems/src/sections/FineTuning.tsx` lines 644 and 900; `deep-dives/sglang/src/sections/RlRollout.tsx` line 593; `deep-dives/vllm/src/sections/OpenAICompatServer.tsx` line 627.
- The deploy workflow: `.github/workflows/deploy.yml` line 34 (`pnpm --filter @tech-deep-dives/rl-agentic-loops build`), line 38 (`mkdir ... _site/rl-agentic-loops`) and line 43 (copies `dist/` into `_site/rl-agentic-loops/`).
- The package name in `deep-dives/rl-agentic-loops/package.json` and the importer key `deep-dives/rl-agentic-loops` in `pnpm-lock.yaml` (line 192).
- Forty lines in sixteen files that name the repo path (not a URL) in other dives' notes: `llm-training-systems` (`RESEARCH-GUIDE.md`, `research/2026-10/03-frameworks.md`, `06-aws-orchestration.md`, `wave1-brief.md`, `revamp/authoring-brief.md`, `revamp/claims/fine-tuning.md`, two review notes), `sglang` (`SCOPE.md`, two review notes) and `silicon-memory-inference` (TorchNeuron research, revamp and verification notes).

**Choice 1. Keep the path, change only the titles.** Nothing breaks. The cost is a slug that says "rl-agentic-loops" under a title about fine-tuning; the slug shows only in the address bar.

**Choice 2. Move the path and leave a redirect page at the old one.** GitHub Pages serves no server redirects, so the old path needs a static `rl-agentic-loops/index.html` with a `<meta http-equiv="refresh" content="0; url=../NEW-SLUG/">`, a `<link rel="canonical">` to the new URL and a plain link for readers whose browser ignores the refresh. What it breaks or costs:
- `deploy.yml` must build the dive into the new folder and also write the stub into `_site/rl-agentic-loops/`. The workflows are Carlos's, kept apart from the job scripts.
- The six inbound links either change or go through the redirect hop.
- If the source directory moves too: the package name, the deploy filter, a regenerated `pnpm-lock.yaml` importer, the forty repo-path lines above, the `_ops` job notes, and a rebase conflict for this branch, which holds 17 unmerged local commits under the old path.
- A lighter variant moves only the URL (the workflow copies the same `dist/` to the new folder and writes the stub), keeping the directory and package name. It avoids the repo-path churn, but the URL name and the directory name then differ.

**Recommendation (the assistant's).** Choice 1: keep `rl-agentic-loops` and change the titles and link texts only. It breaks nothing, needs no edit to the workflow Carlos owns, and the slug still names what most of the dive is about, RL and the loops. A move can follow later, when the dive is no longer mostly RL.

---

## 6. Research needed before building (flywheel Gate 1)

The three new sections can start from claims already in the registers; the gaps below need one research wave. Every item marked `[SPECULATIVE, verify at source]` is known to the assistant only from its training data. No fetch was made by this job.

**New 3, the map.**
- In hand: F06-13 (Bedrock's three methods, Tier 1), wave 2 AWS row 13 (SageMaker AI lists distillation), F06-22 and F06-24 (SageMaker AI techniques and the serverless table), F01-70 and F01-85 (the unified gradient), wave 2 G3 (Llama 3, Qwen3 and Gemma 3 post-training as their first-party reports state it), F02-9 to F02-12 (DeepSeek-R1), F04-43 (continued pretraining against retrieval), F04-45 (context distillation).
- Needed: the DeepSeek-R1 pipeline as a sequence of stages (cold-start SFT, reasoning RL, rejection sampling with SFT, a second RL stage) [SPECULATIVE, verify at source: re-read arXiv 2501.12948v2, a paper already in the register]; Llama 3's post-training rounds (rejection sampling, SFT, DPO) [SPECULATIVE, verify at source: arXiv 2407.21783v3, already quoted in G3]; Qwen3's stages beyond GRPO, including distillation from larger to smaller models [SPECULATIVE, verify at source: arXiv 2505.09388v1, already quoted in G3]; whether Bedrock still offers continued pretraining, since F06-13 found it absent from the overview page (Tier 1, re-read).

**New 4, SFT and distillation.**
- In hand: F01-46, F01-48, F01-71, F01-85, F01-90, F02-12, F02-44, F02-52, F02-74, F02-87, F04-45, F04-48, F06-13.
- Needed: how TRL's SFT trainer at the dive's pin (v1.16.0) keeps the prompt out of the loss, and under which option names [SPECULATIVE, verify in code at the tag]; whether TRL v1.16.0 ships a distillation trainer (a GKD trainer) [SPECULATIVE, verify in code at the tag]; the original knowledge-distillation paper, Hinton, Vinyals and Dean 2015, for soft targets and temperature [SPECULATIVE, verify at source]; sequence-level distillation, Kim and Rush 2016 [SPECULATIVE, verify at source]; the size and recipe of the DeepSeek-R1-Distill training set [SPECULATIVE, verify at source: R1 supplementary B.4.3, the location F02-12 already records]; one source on how few SFT examples set format and style, for example LIMA (Zhou et al. 2023) [SPECULATIVE, verify at source]; the terms of two or three model providers on training with their outputs, for the "teacher you may train on" condition [SPECULATIVE, verify at source, Tier 1]; Bedrock distillation's supported teacher and student pairs and how it generates training data (Tier 1).

**New 11, distillation or RL.**
- In hand: F02-11, F02-12 (Table 16 values, HOLDS in the wave 2 RLVR re-check, row 10), F02-22, F02-40, F02-44, F02-45, F02-86, F02-87, F04-49, F06-9.
- Needed: on-policy distillation from primary sources: GKD, Agarwal et al., "On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes" [SPECULATIVE, verify at source]; MiniLLM, Gu et al., distillation with a reverse KL [SPECULATIVE, verify at source]; Thinking Machines' on-policy distillation post, a Tier 2 lab blog [SPECULATIVE, verify at source, date and figures]; DeepSeek-R1's statement on applying RL on top of distilled models [SPECULATIVE, verify at source]; any controlled comparison of distillation and RL at matched compute [SPECULATIVE whether one exists; if none is located, the section says so with the scope of the search].

**Reworked sections.**
- New 25 (Choosing): F06-9 and F02-22 in hand; nothing new.
- New 26 (AWS): Bedrock SFT and distillation pricing and limits, and SageMaker AI's distillation technique page (Tier 1, current read).
- New 27 (Glossary): from the items above.

**Proposed research budget.** One wave of two agents, at most three agents at once by the job protocol: one on signal sources and distillation papers, one on AWS pages and TRL code at the pin. Each writes claim entries in the register format into a new `research/2026-11/07-fine-tuning-signals.md`. Then one refutation agent on the load-bearing numbers, as wave 2 did. Gate 1 also re-checks the dive's pins (TRL v1.16.0, verl v0.9.1) for freshness under ADR-002, without re-pinning unless a cited behaviour changed.

---

## 7. Effort

- New sections: 3 (new 3, 4 and 11), with 13 diagrams between them.
- Reworked with content changes: 4 (new 1, 2, 25, 26).
- Light edits (a retitle, a pointer, a moved claim or one sentence): 9 (new 5, 6, 7, 8, 9, 10, 14, 17, 21), plus one sentence in new 22.
- Mechanical: renumbering all 27 sections and about 783 in-dive cross-references; five link texts in three other dives; the front-page card, `index.html`, README, SCOPE and glossary.
- Agents [SPECULATIVE]: about 12. Research 2 plus refutation 1; authoring 3 for the new sections and 2 for the reworks (new 1 with 2, new 25 with 26); fact-check 2; reader review 2 (a newcomer and an RL expert, as the rl-explain job ran).
- Share of a weekly usage limit [SPECULATIVE]: about a third, between a quarter and a half. No earlier build in this repo recorded its share of the limit, so this rests on agent counts only: about 12 agents here against at least 43 for the original RL build (15 research, 4 scope review, 24 authoring, fact-check agents not counted), plus the renumber pass, which is cheap in agents but long in edits. Gate 2 (Carlos on the phone) and Gate 3 (the quality audit) are not counted.

---

## 8. Open questions for Carlos

1. **Which title: A, B or C?** Recommended: B, "Learning From Feedback: Fine-Tuning, Reinforcement Learning and Agentic Learning Loops". It keeps the half readers already know, puts fine-tuning in front of reinforcement learning as the umbrella, and keeps the loops half in the title. A uses your own words but hides the loops half; C states the dive's thesis but hides reinforcement learning, which is most of the dive.
2. **Keep the learning-in-words half (old 11 to 16) as it is?** Recommended: keep it. The signal map applies to it unchanged, and it carries half of today's thesis and the choice in old 22.
3. **Keep the URL path `rl-agentic-loops`?** Recommended: keep it (Choice 1 in 5.2). Nothing breaks and the deploy workflow stays untouched.
4. **On-policy distillation: a block in new 11, or a hedged mention?** Recommended: a block only if Gate 1 finds a peer-reviewed or first-party source; otherwise one hedged sentence that names it as the cell between distillation and RL.
5. **Update the explaining-concepts standard to your level 100 to 200 baseline?** Today it says the RL dive should explain what weights are before training. Recommended: yes, in the same commit as the section 1 rework, replacing that example with the baseline you gave (weights, billions of parameters, open-weight models, mixture of experts known by name).
