# 03 Learning in words: loops that improve a frozen model through text

## 1. Header

- Research date: 2026-10-16. Every source below was accessed 2026-10-16.
- Area: the "text version" of RL. Loops that get an RL-like improvement by changing words in the context (reflections, prompts, playbooks, skill libraries, memories, program populations) while the large model's weights stay frozen. Includes one bridge method (Advisor Models) where RL trains a small model whose output is words for a frozen large model.
- Out of scope here: policy gradient, PPO and GRPO mechanics (another agent covers them). GRPO appears only as a baseline.
- Reader: technical lead, strong on systems and agents, no formal RL background.
- Method: full text of each paper read from the arXiv HTML of the pinned version (abstract plus method, results tables, ablations, limitations, appendices on setup and cost). Code read with `gh api` and raw files at pinned tags. No experiments run, so there is no Tier 0 evidence in this file.
- Tiers used (per the dive brief): Tier 0 our experiments (none here). Tier 1 source code at a pinned tag or SHA, official framework or vendor docs. Tier 2 first-party lab or vendor blog posts, including an author's own post on their own method. Tier 3 academic papers (peer-reviewed or preprint, marked) and third-party analysis; in-repo READMEs and code comments are also placed at Tier 3 because the repo source-authority standard says they are orientation only. Tier 4 tutorials, summaries, press, and bibliographic metadata services.
- Evidence kinds: definition, theory/proof, benchmark claim (author-reported), ablation, production report, code behaviour.
- Quotes are verbatim except that curly quotes are straightened, to satisfy the repo style gate. Where a number is my own arithmetic it is labelled [DERIVED].
- Venue labels: taken from the arXiv comments field where the authors state it (primary). Where only Semantic Scholar metadata gives a venue, it is labelled [venue per Semantic Scholar metadata, Tier 4].

### Pinned sources

Papers (arXiv ID with version read):

| Method | arXiv | Version read | Venue |
|---|---|---|---|
| Reflexion | 2303.11366 | v4 | NeurIPS 2023 [venue per Semantic Scholar metadata, Tier 4] |
| Self-Refine | 2303.17651 | v2 | NeurIPS 2023 [venue per Semantic Scholar metadata, Tier 4] |
| LLMs cannot self-correct reasoning yet (Huang et al.) | 2310.01798 | v2 | ICLR 2024 (arXiv comments) |
| When can LLMs actually correct their own mistakes? (Kamoi et al.) | 2406.01297 | v3 | TACL 2024, vol. 12, pp. 1417-1440 (arXiv journal-ref) |
| ExpeL | 2308.10144 | v3 | AAAI-24 (arXiv comments) |
| CLIN | 2310.10134 | v1 | preprint (no venue confirmed in this research) |
| Agent Workflow Memory (AWM) | 2409.07429 | v1 | ICML [venue per Semantic Scholar metadata, Tier 4; year not confirmed] |
| ReasoningBank | 2509.25140 | v2 | ICLR 2026 (arXiv comments) |
| Dynamic Cheatsheet (DC) | 2504.07952 | v1 | EACL [venue per Semantic Scholar metadata, Tier 4] |
| Voyager | 2305.16291 | v2 | TMLR [venue per Semantic Scholar metadata, Tier 4] |
| TextGrad | 2406.07496 | v1 | Nature 639, 609-616 (2025), DOI 10.1038/s41586-025-08661-4 (Nature page, located by search; Nature full text not read) |
| ProTeGi (Automatic Prompt Optimization with "Gradient Descent" and Beam Search) | 2305.03495 | v2 | EMNLP 2023 (arXiv comments) |
| OPRO (Large Language Models as Optimizers) | 2309.03409 | v3 | ICLR 2024 (arXiv comments) |
| APE (Large Language Models Are Human-Level Prompt Engineers) | 2211.01910 | v2 | ICLR [venue per Semantic Scholar metadata, Tier 4] |
| DSPy | 2310.03714 | v1 | preprint as listed by arXiv and Semantic Scholar; conference acceptance not confirmed in this research |
| MIPROv2 (Optimizing Instructions and Demonstrations for Multi-Stage LM Programs) | 2406.11695 | v2 | EMNLP 2024 (arXiv comments) |
| GEPA | 2507.19457 | v2 (also v1 for the version comparison) | ICLR 2026 Oral (arXiv comments) |
| BetterTogether (Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together) | 2407.10930 | v2 | EMNLP 2024 (arXiv comments) |
| ACE (Agentic Context Engineering) | 2510.04618 | v3 | ICLR 2026 (arXiv comments) |
| Memento | 2508.16153 | v2 | preprint |
| A-Mem | 2502.12110 | v11 | NeurIPS 2025 (arXiv comments) |
| MemGPT | 2310.08560 | v2 | preprint |
| Training-Free GRPO | 2510.08191 | v1 | preprint (Tencent Youtu Lab, Fudan University, Xiamen University per the paper's affiliations) |
| FunSearch | Nature paper, DOI 10.1038/s41586-023-06924-6 | published 14 December 2023, Nature 625, 468-475 (2024) | Nature (peer-reviewed) |
| AlphaEvolve | 2506.13131 | v1 | white paper, preprint |
| ShinkaEvolve | 2509.19349 | v1 (abstract only) | preprint |
| Advisor Models ("How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models") | 2510.02453 | v3 | ICML 2026 (arXiv comments) |

ID corrections: none needed. Every arXiv ID in the brief resolved to the stated paper. The Advisor paper's title is "How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models" (Asawa, Zhu, O'Neill, Zaharia, Dimakis, Gonzalez), confirmed from the arXiv abstract page. ReasoningBank resolved to 2509.25140. Training-Free GRPO is confirmed as Tencent Youtu Lab work (paper affiliations; code under `TencentCloudADP/youtu-agent`).

Code (Tier 1, pinned):

| Repo | Tag | Commit SHA | Files read |
|---|---|---|---|
| stanfordnlp/dspy | 3.4.1 (latest release, published 2026-10-12) | 099982b3c3eec9fc4ec4796d49915af42367a253 | `dspy/teleprompt/gepa/gepa.py`, `dspy/teleprompt/grpo.py`, `dspy/teleprompt/bettertogether.py`, `pyproject.toml` |
| gepa-ai/gepa | v0.1.4 (the exact version DSPy 3.4.1 pins) | 8b0ce6cd99a234f6b74daf37558a2ac0ce18f975 | `src/gepa/api.py`, `src/gepa/strategies/acceptance.py`, `src/gepa/strategies/instruction_proposal.py`, `src/gepa/gepa_utils.py`, `README.md` |
| algorithmicsuperintelligence/openevolve (redirect target of codelion/openevolve) | v0.4.0 | f7b633986c0b3dbd0a171f6eb0cb0f0ba4fdfb0c | `openevolve/config.py`, `openevolve/evaluator.py`, `openevolve/database.py` (full tarball grepped) |
| SakanaAI/ShinkaEvolve | v0.0.7 | c4568adde253cacf185be3a8412c3c2142761ebe | tag pinned only, no file read |
| google-deepmind/funsearch | no release; default-branch head | cc53f274237d7ab05c19df939edbc1f9616a7c19 (2024-02-05) | SHA pinned only, no file read |

First-party docs and blogs:

- Anthropic, "Agent Skills" overview, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview (Tier 1, official docs).
- Anthropic, "Memory tool", https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool (Tier 1, official docs).
- Anthropic Engineering, "Equipping agents for the real world with Agent Skills", published Oct 16, 2025, https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (Tier 2).
- Databricks blog, "Building state-of-the-art enterprise agents 90x cheaper with automated prompt optimization", September 24, 2025, authors include Khattab, Opsahl-Ong and Zaharia (GEPA, MIPROv2 and DSPy authors), https://www.databricks.com/blog/building-state-art-enterprise-agents-90x-cheaper-automated-prompt-optimization (Tier 2, authors' own post on their own method).

## 2. Comparison table

One row per method. Every cell traces to the register IDs in the last column. "No RL baseline" is scoped to the paper read.

| Method | STATE (what persists) | UPDATE RULE | FEEDBACK SIGNAL | FROZEN | RL OR FINE-TUNING BASELINE RESULT | COST | IDs |
|---|---|---|---|---|---|---|---|
| Reflexion | Episodic buffer of self-reflections, capped at 1-3 entries | Append a new reflection after each failed trial | Binary success or scalar reward: exact match against ground truth (HotPotQA), heuristic or LLM classifier (ALFWorld), self-written unit tests (code) | Actor, evaluator and reflector LLMs (GPT-4, gpt-3.5-turbo, text-davinci-003) | Paper reports no RL baseline | Not reported | F03-1 to F03-7 |
| Self-Refine | Nothing across tasks; one output refined in place | Same model writes feedback, then rewrites the output | The model's own critique | One LLM (GPT-3.5, ChatGPT, GPT-4, Codex) | No RL baseline; compares to fine-tuned models of other sizes (Table 7, 8) | Up to 4 samples on PIE | F03-8 to F03-11 |
| Intrinsic self-correction (Huang; Kamoi) | Nothing | Prompted self-critique and revision | The model's own judgement, no external signal | GPT-3.5, GPT-4, GPT-4-Turbo, Llama-2-70b | Not a method; evidence that accuracy falls without external feedback | 3 to 5 calls vs 1 | F03-12 to F03-17 |
| ExpeL | Insight list with importance counts, plus a vector store of successful trajectories | LLM applies ADD, EDIT, UPVOTE, DOWNVOTE; insight deleted at count 0 | Environment success, contrasted success/failure pairs | gpt-3.5-turbo-0613 actor; gpt-4-0613 insight writer | No RL baseline; imitation-learning numbers quoted from ReAct paper | Not reported | F03-18 to F03-21 |
| CLIN | Memory of causal abstractions ("X is necessary for Y", "X does not contribute to Y"), plus meta-memory across episodes | LLM regenerates memory after each trial from the last trial plus the three most recent memories | Simulator reward and text observations | gpt-4 for controller, executor, memory generator | Beats small text-game RL agents (DRRN 16.7, KG-A2C 12.7, CALM 3.6 vs CLIN 52.7 to 69.5, ScienceWorld); not LLM RL | Not reported | F03-22 to F03-24 |
| Agent Workflow Memory | Library of reusable workflows (sub-routines) per website | Induce workflows from trajectories judged successful, add to memory | LLM evaluator's binary success label (online) or annotated examples (offline) | gpt-4-0613 | Paper reports no RL baseline | Fewer steps (5.9 vs 7.9) | F03-25 to F03-27 |
| ReasoningBank | Memory items (title, description, content) distilled from successes and failures | Extract items, consolidate by simple addition, embedding retrieval | LLM-as-a-judge success label, no ground truth | Gemini-2.5-flash, Gemini-2.5-pro, Claude-3.7-sonnet | Paper reports no RL baseline | Up to 16% fewer steps; token table in App. C.2 (not read in detail) | F03-28 to F03-31 |
| Dynamic Cheatsheet | Curated cheatsheet of strategies and code snippets | Curator LLM rewrites memory after (DC-Cu) or before (DC-RS) each query | The model's own assessment; no ground-truth labels | GPT-4o, Claude 3.5 Sonnet (gains small or negative for GPT-4o-mini, Haiku, R1, o1) | Paper reports no RL baseline | Tokens per AIME answer 370 baseline vs 1035 (DC-RS) and 1831 (DC-Cu) | F03-32 to F03-35 |
| Voyager | Skill library of executable JavaScript programs keyed by description embeddings | Add a program once self-verification passes | Execution errors, environment state, GPT-4 self-verification | gpt-4-0314 (code), gpt-3.5-turbo (text) | No RL comparison; authors call it not apples-to-apples | GPT-4 15x the cost of GPT-3.5 | F03-36 to F03-39 |
| Anthropic Agent Skills and memory tool | Skill folders (SKILL.md, scripts, resources); `/memories` files stored client-side | Human-authored skills; model edits memory files via tool commands | None defined by the feature | Claude models | Not applicable; docs claim no learning loop | Skill metadata ~100 tokens per skill, instructions under 5k tokens | F03-40 to F03-42 |
| TextGrad | Any text variable: a solution, a code snippet, a system prompt | "Textual gradient" (LLM critique) propagated backward through a computation graph; TGD.step rewrites the variable | LLM judge, unit tests, simulators, or ground-truth metric | Forward model (e.g. gpt-3.5-turbo-0125); gpt-4o as gradient engine | Paper reports no RL baseline | At most one extra LLM call per graph edge per iteration; 36 training examples for prompt runs | F03-43 to F03-47 |
| ProTeGi | Beam of candidate prompts | Minibatch errors -> NL "gradient" -> edit prompt; beam search with bandit selection | F1 on labelled minibatches | GPT-3, InstructGPT, ChatGPT, GPT-4 | Beats an RL-trained phrase-edit prompt optimizer by 8.2% average (RL on prompt edits, not on LLM weights) | 12 to 50 evaluations per candidate | F03-48 to F03-50 |
| OPRO | Meta-prompt holding the best 20 instructions with scores | Optimizer LLM proposes 8 new instructions per step from the scored history | Training-set accuracy | Scorer (PaLM 2-L, text-bison); optimizer (PaLM 2-L-IT, gpt-3.5-turbo, gpt-4) | Paper reports no RL baseline | 200 steps x 8 instructions on 3.5% of GSM8K train | F03-51 to F03-53 |
| APE | Pool of instruction candidates | Propose from demos, score, resample near the best (iterative Monte Carlo) | Execution accuracy on demos | InstructGPT (text-davinci-002) | Paper reports no RL baseline | Adaptive filtering to cut evaluation cost | F03-54 |
| DSPy and MIPROv2 | Instructions and few-shot demos per module of an LM program | Bootstrap demos; propose grounded instructions; Bayesian surrogate (TPE) picks combinations on minibatches | Task metric on training set | GPT-3.5 proposer; Llama-3-8B task model (MIPROv2) | Papers report no RL baseline; DSPy 3.4.1 ships GRPO and BetterTogether optimizers next to them | MIPROv2 heavy used 2,270 to 6,926 rollouts in GEPA's setup | F03-55 to F03-58 |
| GEPA | Pool of candidate programs (prompt sets) with ancestry and per-instance validation scores | Reflection LM rewrites one module's instruction from traces and feedback; accept if minibatch score strictly rises; parent drawn from the per-instance Pareto front | Score plus text feedback from the evaluator (compiler errors, missing documents, rubric breakdown) | Qwen3 8B or GPT-4.1 Mini (task model) | Qwen3 8B: GEPA 54.85 vs GRPO 48.91 aggregate over six tasks; GRPO wins AIME-2025 (38.00 vs 32.00); GEPA 1,839 to 7,051 rollouts vs GRPO 24,000 | Under $500 for all GPT-4.1 Mini runs; GEPA $86 | F03-59 to F03-73 |
| ACE | Itemised playbook of bullets with counters | Reflector extracts lessons; Curator emits delta bullets merged by non-LLM code; embedding de-duplication | Execution feedback, with or without ground-truth labels | DeepSeek-V3.1 for generator, reflector and curator | Paper reports no RL baseline; beats GEPA, MIPROv2, DC | 357 rollouts vs GEPA 1,434 on AppWorld; $2.9 vs DC $17.7 on FiNER | F03-74 to F03-80 |
| Memento | Case bank of (state, plan, reward) tuples | Append each case; retrieve by similarity or by a learned Q-function | Task success (binary reward) | GPT-4.1 planner; o3 or o4-mini executor | Beats RL-trained DeepResearcher (Qwen2.5-7B): 66.6 vs 51.8 F1, different base models | GAIA Level 3 task: 121k input, 9.8k output tokens | F03-81 to F03-83 |
| A-Mem, MemGPT | Linked notes (A-Mem); paged memory tiers (MemGPT) | Note creation, linking and attribute rewrite (A-Mem); paging (MemGPT) | None reward-driven | Underlying LLM | Not applicable: storage, not reward-driven learning | Not assessed | F03-84 to F03-85 |
| Training-Free GRPO | Experience library of natural-language lessons | Per query: G rollouts, LLM writes a "semantic advantage" for groups with winners and losers; LLM emits Add, Delete, Modify, Keep ops | Ground-truth reward (or none, in an ablation) | DeepSeek-V3.1-Terminus, Qwen3-32B, Qwen2.5-72B | Frozen 671B + text beats RL-trained 32B models; at 32B scale RL-trained models score far higher (ReTool 67.0 vs Training-Free GRPO 33.5 on AIME24, different base models) | About $18 and 6 hours vs about $10,000 for a ReTool replication | F03-86 to F03-91 |
| FunSearch | Islands of scored programs | LLM writes new versions of one function from best-shot prompts; islands reset periodically | Programmatic evaluator score | Codey (PaLM 2 based), pretrained, no fine-tuning | Not compared with RL | "Millions of LLM samples" per AlphaEvolve's Table 1 | F03-92 to F03-94 |
| AlphaEvolve | Program database of whole code files | Ensemble of Gemini 2.0 Flash and Pro proposes diffs; evaluation cascade filters | Automated evaluators, optional LLM-generated feedback | Gemini 2.0 Flash and Pro | Chosen over deep RL for data-center scheduling on interpretability and deployability grounds; no RL numbers published in the white paper | "Thousands of LLM samples suffice" | F03-95 to F03-99 |
| OpenEvolve, ShinkaEvolve | Island and MAP-Elites program archive (OpenEvolve) | LLM mutations with cascade evaluation | User evaluator, optional LLM judge | Any API LLM | No RL comparison read | ShinkaEvolve claims a circle-packing result with 150 samples | F03-100 to F03-103 |
| Advisor Models (bridge) | Weights of a small advisor model (e.g. Qwen2.5 7B) | GRPO on the advisor; reward computed on the frozen student's final output | Task reward on student output (0/1 accuracy, chrF, efficiency, judge) | The student (GPT-4o mini, GPT-4.1 mini, Gemini 2.5 Flash; transferred to GPT-5, GPT-5.2, Gemini 3 Pro) | Direct RL on the student beats it (MTOB chrF 42.38 vs 38.98, baseline 31.17), but the advisor recovers about 70% of the gain [DERIVED]; beats GEPA on all reported domains | One 8xH100 node; frontier-student training estimated at thousands of dollars, so trained on cheap students | F03-104 to F03-110 |
| BetterTogether (prompt plus weights) | Prompts and LM weights | Alternate prompt optimization and fine-tuning (SFT on bootstrapped traces) | Task metric | None (weights are tuned) | Beats weights alone by up to 60% and prompts alone by up to 6% | Not compared | F03-111 to F03-112 |

## 3. Claim register

### Reflexion

**F03-1. Reflexion improves an agent through stored text, with the model unchanged.**
- Claim: Reflexion converts task feedback into a written self-reflection, stores it in an episodic memory buffer, and conditions the next trial on it; no weights change.
- Location: arXiv 2303.11366v4, Abstract; Sec. 3 "Memory".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | definition | "reinforce language agents not by updating weights, but instead through linguistic feedback" ; "we bound mem by a maximum number of stored experiences, \Omega (usually set to 1-3) to adhere to max context LLM limitations."
- Use in dive: the canonical example of "state = text". The 1-3 entry cap is the first instance of a context budget acting as a learning-rate limit.

**F03-2. Reflexion defines the policy as model plus memory.**
- Claim: The paper's formal object is a policy whose parameters are the LLM and the memory text, theta = {M_a, mem}.
- Location: Sec. 1 contributions; Algorithm 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | definition | "a new paradigm for 'verbal' reinforcement that parameterizes a policy as an agent's memory encoding paired with a choice of LLM parameters."
- Use in dive: the cleanest statement of the mental model "the context is the trainable parameter". Pairs with F03-90 (Training-Free GRPO says the same in GRPO vocabulary).

**F03-3. On HotPotQA, Reflexion's feedback signal is an exact match against the ground-truth answer.**
- Claim: Between trials, the HotPotQA agent is told whether its answer matched the gold answer; the agent retries failed tasks up to three consecutive failures. The improvement is per-task retry with an oracle success bit, and the paper does not test transfer of reflections to unseen questions.
- Location: Sec. 4.2.
- Verdict: WRONG if read as "Reflexion learns without labels". True statement: on HotPotQA the success signal comes from the gold answer; the self-written signal appears only in programming (unit tests) and ALFWorld (heuristic or LLM classifier).
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | benchmark claim | "between trials, we use exact match answer grading using the environment to give a binary success signal to the agent." Independent reading: Kamoi et al. TACL 2024, https://arxiv.org/abs/2406.01297v3, Sec. 4: "Reflexion (Shinn et al., 2023) generates feedback by using an exact match between the generated and ground-truth answers, which cannot be accessed in real-world applications."
- Use in dive: the single most important caveat when someone cites Reflexion as proof that agents learn from their own reflection. Supports mental model M2.

**F03-4. Reflexion's coding gains are capped by the quality of its self-written tests.**
- Claim: GPT-4 + Reflexion reaches 91.0 pass@1 on HumanEval (Python) vs 80.1 for GPT-4 alone, but scores 77.1 vs 80.1 on MBPP (Python). The authors attribute the MBPP loss to false positives: self-written tests pass on wrong code 16.3% of the time on MBPP vs 1.4% on HumanEval.
- Location: Sec. 4.3, Table 1 and Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | benchmark claim | "the false positive test execution rate for MBPP Python is 16.3% while the rate for HumanEval Python is a mere 1.4%, leading to 91% overall accuracy".
- Use in dive: practical. The evaluator is the reward model of a text loop; a leaky evaluator makes the loop stop early on wrong answers. Same lesson as reward hacking in RL, in miniature.

**F03-5. Reflexion's ablation: reflection without a grounded test signal hurts; tests without reflection do nothing.**
- Claim: On the 50 hardest HumanEval Rust problems with GPT-4: base 0.60; remove test generation 0.52; remove self-reflection 0.60; full Reflexion 0.68.
- Location: Table 3, Sec. 4.3 "Ablation study".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | ablation | "the agent is unable to determine if the current implementation is correct without unit tests ... performing harmful edits to the implementation."
- Use in dive: both halves are needed, a grounded signal and a written diagnosis. This is the text-loop analogue of "reward plus credit assignment".

**F03-6. Reflexion gives no gain on a weaker model and fails on exploration-heavy tasks.**
- Claim: With starchat-beta on HumanEval, baseline and Reflexion both score 0.26 (Table 4). On WebShop the authors stop after four trials because there is no improvement.
- Location: Appendix A, Table 4; Appendix B.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | benchmark claim | "the ability to specify self-corrections is an emergent quality of stronger, larger models." ; "Reflexion is unable to solve tasks that require a significant amount of diversity and exploration."
- Use in dive: first data point for mental model M3 (text loops select from what the model can already do).

**F03-7. Reflexion reports no RL baseline and no cost figures.**
- Claim: The comparisons are to ReAct, CoT and prior code-generation state of the art. No PPO, GRPO or fine-tuning baseline, and no token or dollar accounting.
- Location: Sec. 4 throughout; Sec. 5 Limitations.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.11366v4 | Tier 3, peer-reviewed | benchmark claim (absence) | the paper reports no RL baseline. The authors frame the method itself as RL: "At its core, Reflexion is an optimization technique that uses natural language to do policy optimization."
- Use in dive: scope the "verbal RL" label: it is RL vocabulary applied to a retry loop, with no measured comparison against weight-space RL.

### Self-Refine and the limits of self-correction

**F03-8. Self-Refine uses one model as generator, critic and reviser, with no training.**
- Claim: An LLM writes an output, writes feedback on it, and rewrites it, repeating until a stop condition.
- Location: arXiv 2303.17651v2, Abstract; Sec. 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.17651v2 | Tier 3, peer-reviewed | definition | "Self-Refine does not require any supervised training data, additional training, or reinforcement learning, and instead uses a single LLM as the generator, refiner and the feedback provider."
- Use in dive: the zero-state baseline of the family: nothing persists across tasks.

**F03-9. Self-Refine helps on preference tasks and gives almost nothing on math.**
- Claim: Table 1 gains are large on preference-style tasks (GPT-4 dialogue response 25.4 -> 74.6) and near zero on math reasoning (GPT-3.5 64.1 -> 64.1, ChatGPT 74.8 -> 75.0, GPT-4 92.9 -> 93.1). The authors trace the math result to the model failing to detect its own errors.
- Location: Table 1; Sec. 3.3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.17651v2 | Tier 3, peer-reviewed | benchmark claim | "ChatGPT feedback for 94% instances is 'everything looks good'".
- Use in dive: self-critique improves taste, not correctness. Supports M2.

**F03-10. With an external correctness signal, Self-Refine's math gain appears.**
- Claim: Using oracle feedback that only refines when the answer is wrong, math reasoning rises 64.06 -> 68.9 (GPT-3.5), 74.8 -> 76.2 (ChatGPT), 92.9 -> 93.8 (GPT-4).
- Location: Appendix H.1, Table 9.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.17651v2 | Tier 3, peer-reviewed | ablation | "This indicates the potential of external signals to optimize model performance in particular tasks."
- Use in dive: the same loop with and without a grounded signal, inside one paper. Strong evidence for M2.

**F03-11. Self-Refine needs a capable instruction-follower.**
- Claim: Vicuna-13B could not produce feedback in the required format or follow refinement prompts. Using Vicuna-13B for the first draft and ChatGPT for feedback and refinement raised math from 24.18% to 40.5%.
- Location: Sec. 3.4 "Does Self-Refine work with weaker models?"; Appendix G.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2303.17651v2 | Tier 3, peer-reviewed | ablation | "even when provided with Oracle or hard-coded feedback, it often failed to adhere to the prompts for refinement."
- Use in dive: practical. A strong critic can improve a weak generator; a weak model cannot critique itself. Same pattern recurs in TextGrad (F03-46), ExpeL (F03-19) and GEPA's recommended reflection model (F03-70).

**F03-12. Without external feedback, self-correction lowers reasoning accuracy.**
- Claim: Intrinsic self-correction (no labels to decide when to stop) reduces accuracy for GPT-3.5 and GPT-4 on GSM8K, CommonSenseQA and HotpotQA, at 3 to 5 model calls instead of 1. Examples: GPT-3.5 CommonSenseQA 75.8 -> 38.1 after one round; GPT-4 GSM8K 95.5 -> 89.0 after two rounds.
- Location: arXiv 2310.01798v2, Sec. 3.2, Table 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01798v2 | Tier 3, peer-reviewed (ICLR 2024) | benchmark claim | "We observe that, after self-correction, the accuracies of all models drop across all benchmarks."
- Use in dive: anchor number for "where the text version falls short": without a grounded signal the loop is noise or worse.

**F03-13. Published self-correction gains came from oracle labels.**
- Claim: With oracle stopping (stop when the gold label says the answer is right), the same methods show gains: GPT-4 HotpotQA 49.0 -> 59.0, GPT-3.5 CommonSenseQA 75.8 -> 89.7.
- Location: Sec. 3.2, Table 2; Sec. 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01798v2 | Tier 3, peer-reviewed | benchmark claim | "the improvements in these studies result from using oracle labels to guide the self-correction process, and the improvements vanish when oracle labels are not available."
- Use in dive: pairs with F03-3. The gap between Table 2 and Table 3 of this paper is the value of the feedback signal.

**F03-14. The failure mode: models flip correct answers to wrong ones more often than the reverse.**
- Claim: On GSM8K GPT-3.5 keeps its first answer 74.7% of the time; among changes, correct-to-incorrect is more frequent than incorrect-to-correct.
- Location: Sec. 3.3, Figure 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01798v2 | Tier 3, peer-reviewed | benchmark claim | "The fundamental issue is that LLMs cannot properly judge the correctness of their reasoning."
- Use in dive: mental model: a reflection step is a classifier on the model's own output; if that classifier is near chance, every edit is a coin flip with a downside.

**F03-15. Debate is self-consistency in disguise when compute is matched.**
- Claim: Multi-agent debate is only slightly better than self-consistency at 3 responses and worse than self-consistency at an equal number of responses.
- Location: Sec. 4, Table 7.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01798v2 | Tier 3, peer-reviewed | benchmark claim | "The observed improvement is evidently not attributed to 'self-correction', but rather to 'self-consistency'."
- Use in dive: practical. Compare any text loop against a sampling baseline at equal calls before crediting the loop. Applies to TextGrad's GPQA result (F03-45).

**F03-16. Survey verdict: prompted self-feedback does not work in general; reliable external feedback does; large-scale fine-tuning does.**
- Claim: Kamoi et al. conclude (1) no prior work shows successful self-correction with feedback from prompted LLMs except in tasks exceptionally suited to it, (2) self-correction works with reliable external feedback, (3) large-scale fine-tuning enables self-correction.
- Location: arXiv 2406.01297v3, Abstract; Sec. 4 and 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.01297v3 | Tier 3, peer-reviewed (TACL 2024) | benchmark claim (survey synthesis) | "(1) no prior work demonstrates successful self-correction with feedback from prompted LLMs, except for studies in tasks that are exceptionally suited for self-correction, (2) self-correction works well in tasks that can use reliable external feedback, and (3) large-scale fine-tuning enables self-correction."
- Use in dive: point (3) is the bridge to the RL sections: the ability to self-correct can be trained into weights, while prompting alone does not supply it. The survey also flags RL-trained self-correction as a trend (Kumar et al. 2024 SCoRe; OpenAI o1), Sec. 13; SCoRe itself was not read (UNKNOWN U4).

**F03-17. Self-Refine's evaluation used weak first-draft prompts; verifiable tasks are the exception.**
- Claim: Kamoi et al. state Self-Refine used instructions or few-shot examples for the first draft that did not match the target task (including wrong target labels), which over-evaluates refinement. They also identify tasks where verification is easier than generation (constrained generation, decomposable multi-answer tasks) as cases where intrinsic correction can work.
- Location: arXiv 2406.01297v3, Sec. 4 "Weak Initial Responses" and "Tasks in which Self-Correction is Exceptionally Effective"; Sec. 5.1 "Verifiable Tasks".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.01297v3 | Tier 3, peer-reviewed | benchmark claim (critique) | "Self-Refine (Madaan et al., 2023) uses instructions or few-shot examples that do not correctly correspond to the target task only for initial response generation (e.g., providing wrong target labels in few-shot examples)".
- Use in dive: contradiction C1. Practical rule: a text loop without a grader works when checking is cheaper than solving.

### Cross-episode experience: ExpeL, CLIN, AWM, ReasoningBank, Dynamic Cheatsheet

**F03-18. ExpeL keeps a voted list of insights, which is a learning rule with forgetting.**
- Claim: An insight-writing LLM edits a shared insight list using ADD, EDIT, DOWNVOTE and UPVOTE. A new insight starts at importance 2, rises on UPVOTE or EDIT, falls on DOWNVOTE, and is removed at 0. Separately, successful trajectories go to a Faiss store and the top-k most similar are retrieved as few-shot examples.
- Location: arXiv 2308.10144v3, Sec. 4.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2308.10144v3 | Tier 3, peer-reviewed (AAAI-24) | definition | "A newly added insight will have an initial importance count of two associated with it ... If an insight's importance count reaches zero, it will be removed."
- Use in dive: the clearest explicit "update rule" in the family: a counter per rule, incremented and decremented by evidence. Useful diagram candidate.

**F03-19. ExpeL uses a stronger model to write insights for a weaker actor.**
- Claim: Evaluation agents run on gpt-3.5-turbo-0613; insight extraction uses gpt-4-0613. Using gpt-3.5-turbo as the insight writer drops HotpotQA from 39.0 to 32.0.
- Location: Sec. 4.2; Appendix D.5; Table 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2308.10144v3 | Tier 3, peer-reviewed | ablation | "We empirically found that gpt-4-0613 is better than gpt-3.5-turbo-0613 at following instructions on how to use the insight extraction operators and hallucinated less."
- Use in dive: practical. Put the strongest model in the update step, even if serving uses a cheap one.

**F03-20. ExpeL's numbers: insights plus retrieval beat ReAct; experience is necessary; adding raw reflections hurts.**
- Claim: HotpotQA success 39.0 vs ReAct 28.0; ALFWorld 59.0 vs ReAct 40.0. Hand-crafted insights reach 32.0 (HotpotQA). Insights built with reflections included drop to 29.0. Insights extracted only from the given few-shot examples give no advantage over ReAct.
- Location: Table 3; Sec. 5.6; Figure 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2308.10144v3 | Tier 3, peer-reviewed | ablation | "using reflections in addition to success/failure pairs and lists of successes is disadvantageous, possibly due to reflections sometimes outputting hallucinations".
- Use in dive: the learned rules must come from the agent's own rollouts with outcomes. Contrast with F03-30 (ReasoningBank finds failures useful): C7.

**F03-21. ExpeL frames itself as off-policy RL with experience replay and reports no RL baseline.**
- Claim: The authors map experience gathering to off-policy learning and retrieval to experience replay. Imitation-learning numbers are quoted from the ReAct paper; no RL or fine-tuning run is made.
- Location: Appendix A.4; Sec. 5.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2308.10144v3 | Tier 3, peer-reviewed | definition | "the retrieval step is similar to experience replay ... ExpeL doesn't require access to model parameters, the design of complicated reward or loss functions, or a large number of environment interactions." The paper reports no RL baseline.
- Use in dive: a ready-made vocabulary bridge for the reader: replay buffer = retrieved trajectories.

**F03-22. CLIN's memory is structured as causal abstractions, and the structure matters.**
- Claim: CLIN stores sentences of the form "X is necessary to Y" or "X does not contribute to Y", regenerated after each trial from the latest trial and the three most recent memories. Switching to free-form advice drops average reward by 6 points.
- Location: arXiv 2310.10134v1, Sec. 3.2; Sec. 4.3 "Importance of memory structure".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.10134v1 | Tier 3, preprint | ablation | "the average reward drops by 6 points (in 10% cases compared to CLIN) when using the unstructured memory, indicating the usefulness of causal abstractions".
- Use in dive: memory schema is a design choice with measurable effect; a typed memory acts like an architecture prior.

**F03-23. CLIN beats RL agents on ScienceWorld, but those agents are small text-game RL models, not RL-trained LLMs.**
- Claim: On unseen environments (Table 1, "All" row): DRRN 16.7, KG-A2C 12.7, CALM 3.6, ReAct 29.6, Reflexion 39.4, CLIN Base 48.6, Gen-Env 52.7, Gen-Env plus Adapt 69.5. RL baselines were trained on all training variations with simulator reward; their numbers come from Lin et al. (2023).
- Location: Table 1; Sec. 4.2 and footnote 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.10134v1 | Tier 3, preprint | benchmark claim | "Language agents (including CLIN) that use NL feedback from the ScienceWorld ... perform significantly better compared to RL methods that purely rely on (sparse) numeric rewards from the environment to learn a policy."
- Use in dive: scope any "beats RL" headline: here RL means pre-LLM text-game agents without language priors, so the comparison measures the value of the pretrained prior more than text-vs-weights learning.

**F03-24. CLIN runs entirely on a frozen gpt-4.**
- Claim: Controller, executor and memory generator are gpt-4, frozen.
- Location: Sec. 3.1; Sec. 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.10134v1 | Tier 3, preprint | definition | "In this paper, we use gpt-4, the same as our generative agent baselines."
- Use in dive: comparison-table cell.

**F03-25. AWM learns reusable workflows from its own trajectories judged successful by an LLM evaluator.**
- Claim: Online AWM runs each test query, asks an LM-based evaluator (Pan et al. 2024) for a binary success label, and if successful induces workflows and adds them to memory for the next query.
- Location: arXiv 2409.07429v1, Sec. 2.3 "Online Scenario".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.07429v1 | Tier 3, peer-reviewed per Semantic Scholar metadata | definition | "If e^{t} is predicted as success, i.e., 1, we then transform it into workflow(s) ... and add {w^{t}} into the agent memory".
- Use in dive: skill library pattern for web agents. The reward model is an LLM judge, so the loop inherits its errors (F03-27).

**F03-26. AWM on WebArena: 35.5% vs 23.5% for the best published autonomous baseline.**
- Claim: With gpt-4-0613, AWM reaches 35.5 total success rate vs BrowserGym 23.5 (51.1% relative) and SteP 33.0, which uses 14 human-written workflows; average steps 5.9 vs 7.9 for BrowserGym (accessibility tree).
- Location: Table 1; Sec. 3.1.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.07429v1 | Tier 3 | benchmark claim | "AWM achieves the best published results on WebArena, surpassing the BrowserGym baseline by 12.0 absolute points and 51.1 % relative increase".
- Use in dive: an induced-workflow library matched a human-written one. The paper reports no RL baseline.

**F03-27. Online induction can learn wrong workflows from wrong trajectories.**
- Claim: Online AWM sometimes induces incorrect workflows because the trajectories are model-predicted; its advantage over offline grows as the train-test domain gap widens.
- Location: Sec. 3.2.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.07429v1 | Tier 3 | benchmark claim | "AWMonline induces workflows from model-predicted trajectories that are not always correct, thus can lead to incorrect workflows that degrade model performance."
- Use in dive: the classic self-training risk, stated for text memory.

**F03-28. ReasoningBank distils strategies from successes and failures judged by an LLM, with no ground truth.**
- Claim: After each task an LLM-as-a-judge labels the trajectory; memory items (title, description, content) are extracted from both outcomes; consolidation is "simple addition"; retrieval is embedding-based.
- Location: arXiv 2509.25140v2, Sec. 3.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25140v2 | Tier 3, peer-reviewed (ICLR 2026) | definition | "we adopt an LLM-as-a-judge (Gu et al., 2024) to label outcomes as success or failure given the query and trajectory without any ground-truth reference." ; "memory consolidation incorporates these items into ReasoningBank with a simple addition operation".
- Use in dive: append-only memory with no pruning; long-run growth is unmeasured (UNKNOWN U5).

**F03-29. ReasoningBank gains on WebArena: +8.3, +7.2 and +4.6 success-rate points over no memory.**
- Claim: Across Gemini-2.5-flash, Gemini-2.5-pro and Claude-3.7-sonnet backbones; up to 16% fewer interaction steps.
- Location: Table 1; Sec. 4.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25140v2 | Tier 3, peer-reviewed | benchmark claim | "ReasoningBank improves the overall success rate on WebArena (Table 1) by +8.3, +7.2, and +4.6 with three different backbone LLMs compared to memory-free agents." The paper reports no RL baseline.
- Use in dive: comparison-table cell; gains of a few points on a hard agent benchmark.

**F03-30. ReasoningBank turns failures into usable memory; AWM degrades when given failures.**
- Claim: On WebArena-Shopping with Gemini-2.5-flash: ReasoningBank 46.5 (successes only) -> 49.7 (with failures); AWM 44.4 -> 42.2; Synapse 40.6 -> 41.7.
- Location: Sec. 5, Figure 7.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25140v2 | Tier 3, peer-reviewed | ablation | "AWM drops from 44.4 to 42.2 ... ReasoningBank ... achieving 46.5 on success-only traces and further improving to 49.7 when failures are included."
- Use in dive: what the memory stores decides whether negative examples help. RL gets negative signal for free through the advantage sign; a text loop has to be designed to use it.

**F03-31. The LLM judge in ReasoningBank is 72.7% accurate; results are flat across simulated 70-90% judge accuracy.**
- Claim: Gemini-2.5-flash as judge agrees with ground truth 72.7% of the time on WebArena-Shopping. Simulated judges from 70% to 90% give similar success rates; 100% (ground truth) is best.
- Location: Sec. 5 "ReasoningBank exhibits robustness to LLM-as-a-Judge calibration", Figure 8.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.25140v2 | Tier 3, peer-reviewed | ablation | "We first establish the baseline accuracy by comparing the judge's predictions against ground-truth labels, which we find to be 72.7%." ; "Intuitively, the 100% (ground-truth) accuracy setting yields the best performance."
- Use in dive: practical number for anyone planning a label-free loop: a judge near 73% accurate was tolerable here, scoped to one benchmark subset. Contrast C4.

**F03-32. Dynamic Cheatsheet: a self-curated memory with no ground-truth labels.**
- Claim: A generator answers using the current cheatsheet; a curator (the same black-box model) judges its own answer and updates the cheatsheet. DC-Cu updates after answering; DC-RS retrieves the top-3 similar past items and updates before answering.
- Location: arXiv 2504.07952v1, Sec. 2.1 and 2.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.07952v1 | Tier 3, peer-reviewed per Semantic Scholar metadata | definition | "Cur does not have access to ground-truth labels; so, it has to assess the correctness and efficiency of the solutions by itself before updating the memory."
- Use in dive: the ancestor of ACE's generator/reflector/curator split (F03-74).

**F03-33. Dynamic Cheatsheet's largest gains come from discovering and storing code.**
- Claim: GPT-4o on Game of 24 rises from 10% to 99% after it discovers a Python brute-force solver, stores it and reuses it. Claude 3.5 Sonnet on AIME 2024 rises 23.3% -> 50.0% (DC-Cu); GPQA-Diamond 59.6% -> 68.7% (DC-RS).
- Location: Abstract; Sec. 4, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.07952v1 | Tier 3 | benchmark claim | "GPT-4o's success rate on the Game of 24 puzzle increased from about 10% to 99% after the model discovered and reused a Python-based solution."
- Use in dive: mental model: the most valuable thing a text loop can learn is a tool. When the lesson is executable, the loop's state behaves like a skill library (link to Voyager, F03-36).

**F03-34. Curation beats keeping everything; small and reasoning models gain little or lose.**
- Claim: Full history (append every past turn) gives 26.7% on AIME 2024 for Sonnet vs 50.0% for DC. GPT-4o-mini under DC-Cu and DC-RS scored below its baseline on AIME 2024; DeepSeek R1 and o1 showed "minimal or inconsistent improvements".
- Location: Sec. 4.4, Table 2; Sec. 4.5, Table 3; Sec. 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.07952v1 | Tier 3 | ablation | "For DC to be effective, the base model must produce correct solutions with sufficient frequency to populate the memory with high-quality, reusable strategies."
- Use in dive: two levers in one entry. The update rule must compress, and the base model must already solve some instances. Supports M1 and M3.

**F03-35. Dynamic Cheatsheet costs more tokens per query and serialises the work.**
- Claim: On AIME 2024 Claude Sonnet averaged 370 tokens per answer at baseline, 494 with an empty cheatsheet, 1,035 under DC-RS and 1,831 under DC-Cu. The memory makes queries sequential. The paper reports no RL baseline.
- Location: Sec. 5 "Cost" paragraph.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.07952v1 | Tier 3 | benchmark claim | "its sequential structure still poses challenges for large-scale parallel or batch tasks requiring independent inference."
- Use in dive: cost axis M5: test-time learning moves cost to every query and breaks batch parallelism.

### Skill libraries

**F03-36. Voyager stores verified skills as executable code indexed by embedding.**
- Claim: Each skill is a program; the key is the embedding of a GPT-3.5-written description; a skill is added after GPT-4 self-verification confirms the task succeeded.
- Location: arXiv 2305.16291v2, Sec. 2.2 and 2.3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.16291v2 | Tier 3, peer-reviewed per Semantic Scholar metadata | definition | "Each time GPT-4 generates and verifies a new skill, we add it to the skill library, represented by a vector database. The key is the embedding vector of the program description (generated by GPT-3.5), while the value is the program itself."
- Use in dive: code-as-skill pattern. Code composes and can be re-executed; prose lessons cannot.

**F03-37. Voyager's headline numbers.**
- Claim: 3.3x more unique items (63 in 160 prompting iterations), 2.3x longer map traversal, tech-tree milestones up to 15.3x faster; the only method to reach diamond level.
- Location: Abstract; Sec. 3.3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.16291v2 | Tier 3 | benchmark claim | "It obtains 3.3x more unique items, travels 2.3x longer distances, and unlocks key tech tree milestones up to 15.3x faster than prior SOTA."
- Use in dive: example of a growing library compounding capability.

**F03-38. Voyager's ablations: the verifier matters most; GPT-3.5 cannot run it.**
- Claim: Removing self-verification cuts discovered items by 73%. GPT-4 finds 5.7x more unique items than GPT-3.5 for code generation. Without the skill library, progress plateaus.
- Location: Sec. 3.4, Figure 9.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.16291v2 | Tier 3 | ablation | "Self-verification is the most important among all the feedback types. Removing the module leads to a significant drop (-73%) in the discovered item count."
- Use in dive: same lesson as F03-4 and F03-10: the success check is the reward model.

**F03-39. Voyager does not compare against RL and names cost as a limitation.**
- Claim: The authors decline to compare with pixel-based RL methods; they state GPT-4 is 15x the price of GPT-3.5 and that the method needs GPT-4.
- Location: Sec. 3.2; Sec. 4 "Cost".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.16291v2 | Tier 3 | benchmark claim | "It would not be an apple-to-apple comparison, because we rely on the high-level Mineflayer API to control the agent." ; "The GPT-4 API incurs significant costs. It is 15x more expensive than GPT-3.5."
- Use in dive: the paper reports no RL baseline; the action space (a high-level API) differs from RL work, which is itself the point: text loops win partly by choosing a better action space.

**F03-40. Anthropic Agent Skills are packaged instructions, scripts and resources loaded in three stages.**
- Claim: A Skill is a folder with SKILL.md (YAML name and description) plus optional files. Level 1 metadata is always in the system prompt at about 100 tokens per skill; Level 2 instructions load when triggered, under 5k tokens; Level 3 files and scripts cost nothing until read or run, and scripts return only their output.
- Location: Agent Skills overview, "How Skills work" table.
- Verdict: NEW
- Evidence: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | Tier 1, official docs | definition | "Level 1: Metadata | Always (at startup) | ~100 tokens per Skill" ; "Level 2: Instructions | When Skill is triggered | Under 5k tokens".
- Use in dive: a production skill library with retrieval by description match, the Voyager pattern shipped as a product. Practical numbers for budgeting context.

**F03-41. Anthropic describes skill self-authoring as a future goal; the docs page describes no automatic skill learning.**
- Claim: The engineering post states the hope that agents will create, edit and evaluate their own Skills. The docs page read on 2026-10-16 describes human-created or pre-built Skills and no learning loop.
- Location: Engineering blog (Oct 16, 2025), closing section; docs overview.
- Verdict: NEW
- Evidence: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Tier 2 | definition | "Looking further ahead, we hope to enable agents to create, edit, and evaluate Skills on their own, letting them codify their own patterns of behavior into reusable capabilities." Docs: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | Tier 1.
- Use in dive: hedge scope: within the two pages read, Anthropic claims a storage and loading mechanism, with no reward-driven learning loop. A reader who wants Voyager-style learning has to build the evaluator and the write path.

**F03-42. Anthropic's memory tool is client-side storage with a fixed protocol, and no evaluator.**
- Claim: Tool type `memory_20250818`; Claude issues view, create, str_replace, insert, delete and rename on `/memories`; the application executes them on its own storage. The API adds a memory protocol to the system prompt ("ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE"). Listed use cases include applying lessons from past interactions. The docs leave size caps, expiry and content filtering to the application.
- Location: Memory tool docs, "How it works", "Prompting guidance", "Security considerations".
- Verdict: NEW
- Evidence: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool | Tier 1, official docs | definition | "The memory tool operates client-side: Claude requests file operations, and your application executes them." ; use case: "Apply lessons from past interactions, decisions, and feedback to new tasks".
- Use in dive: the memory store is provided, the learning signal is not. Building ExpeL or ReasoningBank on it means adding the judge and the update policy yourself.

### Textual gradients

**F03-43. TextGrad treats LLM critique as a gradient and backpropagates it through a graph of text variables.**
- Claim: The gradient of the loss with respect to a variable is the set of critiques collected from every successor that used it (Eq. 11); TGD.step rewrites the variable from those critiques (Eq. 12). Each iteration adds at most one LLM call per graph edge.
- Location: arXiv 2406.07496v1, Sec. 2 "The general case".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.07496v1 | Tier 3, peer-reviewed (Nature 639, 2025, for the journal version; arXiv v1 read) | definition | "For a computation graph where there are n edges, each iteration of optimization performs at most n additional language model calls to compute gradients".
- Use in dive: the strongest form of the optimizer analogy: credit assignment through a multi-step pipeline is done by an LLM reading each step.

**F03-44. TextGrad on LeetCode Hard: 36% vs 31% for Reflexion with gpt-4o.**
- Claim: Zero-shot gpt-4o 23%, Reflexion 31%, TextGrad 36% (0.36 plus or minus 0.018, 5 seeds), using local test results in the objective.
- Location: Sec. 3.1, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.07496v1 | Tier 3 | benchmark claim | "these results have now been boosted to 23% for gpt-4o zero-shot and 31% when Reflexion is used. With TextGrad, we can optimize solutions to achieve a performance of 36%."
- Use in dive: instance optimization: the thing being learned is one answer, which is search, not learning that transfers.

**F03-45. TextGrad's GPQA gain uses three refinement steps plus majority voting.**
- Claim: gpt-4o zero-shot accuracy on GPQA rises from 51% to 55%; the method performs 3 test-time updates and takes a majority vote across all solutions.
- Location: Sec. 3.2, Table 2 and Method paragraph.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.07496v1 | Tier 3 | benchmark claim | "For TextGrad, we perform 3 iterations of test-time updates (i.e. update the solution three times) and perform majority voting across all solutions to get the final answer."
- Use in dive: the voting step is a self-consistency component; F03-15 says to compare against voting at equal calls. The paper does not report that comparison [scoped to v1 read].

**F03-46. TextGrad prompt optimization: a strong model writes the prompt for a cheap model, from 36 examples.**
- Claim: Forward model gpt-3.5-turbo-0125, feedback from gpt-4o; batch size 3, 12 iterations (36 training examples seen), prompt kept only if validation improves. GSM8k 72.9 -> 81.1 (equal to DSPy BootstrapFewShotRandomSearch 81.1); Object Counting 77.8 -> 91.9 vs DSPy 84.9; Word Sorting 79.8 for both.
- Location: Sec. 3.3, Table 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.07496v1 | Tier 3 | benchmark claim | "by paying a fixed cost to optimize a Prompt, the prompt-optimized weaker model can be used with cheaper inference costs instead of using the strong and more expensive model."
- Use in dive: practical. This is distillation into a prompt: the expensive model's judgement is paid once, the cheap model serves.

**F03-47. TextGrad reports no RL baseline.**
- Claim: Baselines are zero-shot CoT, Reflexion and DSPy. No RL or fine-tuning comparison.
- Location: Sec. 3 throughout.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.07496v1 | Tier 3 | benchmark claim (absence) | the paper reports no RL baseline. Its references cite AlphaTensor and AlphaDev as RL comparators only in related work.
- Use in dive: comparison-table cell.

**F03-48. ProTeGi: natural-language gradients from minibatch errors, beam search, bandit selection.**
- Claim: Errors on a minibatch produce a critique of the prompt; the prompt is edited in the "opposite semantic direction"; a beam of candidates is kept and the best are found with best-arm identification (UCB variants, successive rejects).
- Location: arXiv 2305.03495v2, Abstract; Sec. 2.1 and 2.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.03495v2 | Tier 3, peer-reviewed (EMNLP 2023) | definition | "The natural language gradients are then 'propagated' into the prompt by editing the prompt in the opposite semantic direction of the gradient."
- Use in dive: origin of "textual gradient". Its bandit selection is the first place the family spends budget deciding which candidate to evaluate, the job GEPA's Pareto selection does (F03-66).

**F03-49. ProTeGi's "RL baseline" is RL over prompt edits, and ProTeGi beats it by 8.2%.**
- Claim: Averaged over four tasks, ProTeGi beats Monte-Carlo search (APE) by 3.9%, the RL baseline by 8.2%, the initial prompt by 15.3% and AutoGPT by 15.2%. The RL baseline learns phrase-level add, paraphrase, swap and delete operations on the prompt (GrIPS and TEMPERA style); it does not update the LLM.
- Location: Sec. 3.3 and 3.4, Figure 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.03495v2 | Tier 3, peer-reviewed | benchmark claim | "On average, ProTeGi improved over the MC and RL baselines by a significant 3.9% and 8.2% margin, respectively".
- Use in dive: scope note: an "RL baseline" in a prompt-optimization paper can mean RL on prompt-edit actions, which is a different comparison from GRPO on model weights.

**F03-50. ProTeGi's setup and model dependence.**
- Claim: Minibatch 64, beam 4, 6 optimization steps, 50 development and 150 test examples per task, F1 metric, 12 to 50 evaluations per candidate. RLHF-tuned models as the optimizer "dramatically outperform" GPT-3.
- Location: Sec. 3.2; Sec. 3.4; Table 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2305.03495v2 | Tier 3 | ablation | "The RLHF-tuned models dramatically outperform GPT-3, with GPT-4 offering the best performance."
- Use in dive: an RL-trained model is the engine that makes the text optimizer work; the two are complements.

### Prompt optimizers

**F03-51. OPRO puts the optimization history in the prompt and asks the LLM for better solutions.**
- Claim: The meta-prompt holds the best 20 instructions so far with their scores and 3 training exemplars; the optimizer LLM proposes 8 new instructions per step; default run is 200 steps. Temperature trades exploration against exploitation.
- Location: arXiv 2309.03409v3, Sec. 2; Sec. 5.1; Appendix (200 steps).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2309.03409v3 | Tier 3, peer-reviewed (ICLR 2024) | definition | "In each optimization step, the LLM generates new solutions from the prompt that contains previously generated solutions with their values, then the new solutions are evaluated and added to the prompt for the next optimization step."
- Use in dive: the optimizer state is literally a scored list in context; the context window is the optimizer's memory limit.

**F03-52. OPRO's best GSM8K instruction: "Take a deep breath and work on this problem step-by-step." 80.2%.**
- Claim: With pre-trained PaLM 2-L as scorer and PaLM 2-L-IT as optimizer, 80.2% vs 71.8% for "Let's think step by step." and 34.0% for an empty instruction. Abstract: up to 8% over human prompts on GSM8K and up to 50% on Big-Bench Hard.
- Location: Table 1; Abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2309.03409v3 | Tier 3 | benchmark claim | Table 1 row "PaLM 2-L-IT | Take a deep breath and work on this problem step-by-step. | 80.2".
- Use in dive: a memorable example that the parameter being learned is a sentence.

**F03-53. OPRO optimizes on 3.5% of the GSM8K training set with no validation split by default; context length limits scale.**
- Claim: Training accuracy on a fixed 3.5% sample (of 7,473) is the objective; the authors argue overfitting is tolerable because candidates overfit similarly. They list context window limits and rough objectives as limitations. OPRO is not compared with RL.
- Location: Sec. 5.1; Sec. 5.4; Sec. 3 "Limitations".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2309.03409v3 | Tier 3 | benchmark claim | "For simplicity, we do not set aside a validation set in our default setting of prompt optimization." ; "the length limit of the LLM context window makes it hard to fit large-scale optimization problem descriptions in the prompt".
- Use in dive: practical. About 1,600 candidate instructions (200 steps x 8) each scored on roughly 261 examples, of the order of 400k scorer calls per run [DERIVED: my arithmetic from the paper's defaults; the paper gives no total].

**F03-54. APE: propose instructions from demonstrations, score them, resample near the best.**
- Claim: An LLM infers candidate instructions from input-output pairs; candidates are scored by execution accuracy, filtered adaptively, and resampled; human-level or better on 24/24 Instruction Induction tasks and 17/21 BIG-Bench tasks with InstructGPT. No RL baseline.
- Location: arXiv 2211.01910v2, Abstract; Sec. 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2211.01910v2 | Tier 3, peer-reviewed per Semantic Scholar metadata | benchmark claim | "achieve better or comparable performance to the instructions generated by human annotators on 24/24 Instruction Induction tasks and 17/21 curated BIG-Bench tasks."
- Use in dive: the "directionless" search baseline that later methods add direction to.

**F03-55. DSPy turns prompts into parameters of a program and compiles them against a metric.**
- Claim: Modules with signatures are parameterized; teleprompters (optimizers) bootstrap demonstrations and can compile to prompts or fine-tunes. GPT-3.5 and llama2-13b-chat pipelines beat standard few-shot prompting by over 25% and 65%.
- Location: arXiv 2310.03714v1, Abstract; Sec. 3 and 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.03714v1 | Tier 3, preprint | definition | "DSPy modules are parameterized, meaning they can learn (by creating and collecting demonstrations) how to apply compositions of prompting, finetuning, augmentation, and reasoning techniques."
- Use in dive: the framework where prompt optimization and weight optimization sit behind one interface.

**F03-56. MIPROv2 uses a Bayesian surrogate to assign credit across modules.**
- Claim: Instructions are proposed with grounding (data summary, program code); a surrogate model (TPE via Optuna) learns which instruction and demo choices raise the metric from minibatch evaluations. Up to 13% accuracy gain on Llama-3-8B, best on 5 of 7 programs.
- Location: arXiv 2406.11695v2, Abstract; Sec. 3 and 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.11695v2 | Tier 3, peer-reviewed (EMNLP 2024) | benchmark claim | "MIPRO, a novel optimizer that outperforms baselines on five of seven diverse LM programs using a best-in-class open-source model (Llama3-8B), by as much as 13% accuracy." The paper reports no RL baseline.
- Use in dive: credit assignment by statistics rather than by reading traces; GEPA's contrast (F03-59).

**F03-57. MIPROv2's lesson: instructions matter most for non-obvious conditional rules.**
- Claim: Instruction optimization pays off most for rules that are not obvious to the model and cannot be shown with a few demonstrations.
- Location: Sec. 6 "Lesson 3".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2406.11695v2 | Tier 3 | ablation | "Instruction optimization is most important for tasks with conditional rules that are (i) not immediately obvious to the LM and (ii) not expressible via a limited number of few-shot examples."
- Use in dive: tells the reader when to optimize words vs examples.

**F03-58. DSPy 3.4.1 ships GEPA, MIPROv2, GRPO and BetterTogether as siblings.**
- Claim: At tag 3.4.1 the `dspy/teleprompt` package contains `gepa/`, `mipro_optimizer_v2.py`, `grpo.py` (class `GRPO(FinetuneTeleprompter)`) and `bettertogether.py`, so the same program can be optimized in prompt space, weight space, or both.
- Location: `dspy/teleprompt/` at tag 3.4.1; `grpo.py` line 26; `bettertogether.py` line 33.
- Verdict: NEW
- Evidence: https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/grpo.py#L26 and https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/bettertogether.py#L33 | Tier 1, code at tag | code behaviour | `class GRPO(FinetuneTeleprompter):` ; `class BetterTogether(Teleprompter):`
- Use in dive: practical. The choice between text and RL is a one-line optimizer swap in DSPy, given a metric and open weights.

### GEPA

**F03-59. GEPA's loop: reflect on traces, rewrite one module's prompt, keep it only if the minibatch score rises, select parents from the per-instance Pareto front.**
- Claim: Each iteration picks a candidate from the Pareto front, picks a module (round-robin), runs a minibatch, gathers traces and text feedback, asks a reflection LM to rewrite that module's instruction, and accepts the child if the minibatch score improves; accepted children are scored on the Pareto validation set. Only prompts change; weights stay fixed.
- Location: arXiv 2507.19457v2, Sec. 3, Algorithm 1 and 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3, peer-reviewed (ICLR 2026 Oral) | definition | "Note that GEPA evolves only the set of prompts, denoted as \Pi_{\Phi}, whereas the underlying LLM weights, denoted by \Theta_{\Phi} remains fixed."
- Use in dive: the reference design for a reflective text optimizer.

**F03-60. GEPA's feedback is the evaluator's text, read before it is collapsed into a scalar.**
- Claim: The metric is extended into a feedback function that returns the score plus text such as compiler errors, failed rubrics, or which documents were still missing.
- Location: Sec. 3 "Evaluation traces as diagnostic signals"; Appendix E.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3, peer-reviewed | definition | "The text that the environment produces to compute the reward (e.g. compiler error messages before giving reward 0) is the evaluation trace."
- Use in dive: mental model M2's sharpest form: RL sees reward 0; a text loop can read why the reward was 0. Practical: write metrics that explain themselves.

**F03-61. GEPA vs GRPO on Qwen3 8B (v2 Table 1): six tasks, aggregate 54.85 vs 48.91.**
- Claim: Baseline 45.23, GRPO 48.91, MIPROv2 47.84, GEPA 54.85, GEPA+Merge 52.40 (aggregate). Per task, GEPA vs GRPO: HotpotQA 62.33 vs 43.33; IFBench 38.61 vs 35.88; HoVer 52.33 vs 38.67; PUPA 91.85 vs 86.66; AIME-2025 32.00 vs 38.00; LiveBench-Math 51.95 vs 51.26. Budgets: GEPA(+Merge) 6,871 / 3,593 / 7,051 / 2,426 / 1,839 / 1,839 rollouts vs GRPO 24,000 on every task.
- Location: Sec. 4, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3, peer-reviewed | benchmark claim | caption: "GEPA and GEPA+Merge achieve better performance than GRPO with far fewer rollouts on all benchmarks except AIME."
- Use in dive: the strongest number in this area. GEPA leads by 5.94 aggregate points [DERIVED: 54.85 minus 48.91] with on average 6.1x fewer total rollouts [DERIVED: 24,000 / 3,936 average budget].

**F03-62. "GEPA outperforms GRPO" does not hold on AIME-2025.**
- Claim: On AIME-2025, GRPO (38.00) beats GEPA (32.00) and GEPA+Merge (32.00); MIPROv2 (20.00) falls below the unoptimized baseline (27.33).
- Location: Table 1.
- Verdict: WRONG as a blanket statement. True statement: GEPA beat GRPO on 5 of 6 tasks with Qwen3 8B, and lost on the competition-math task.
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3, peer-reviewed | benchmark claim | "exceeds GRPO on 5 out of 6 tasks by 19.0%, 2.73%, 13.66%, 5.19% and 0.7%."
- Use in dive: the one task where reasoning skill, not instructions, is the bottleneck is where weight updates won. Supports M3.

**F03-63. GEPA's headline average fell from 10% (v1, four tasks) to 6% (v2, six tasks).**
- Claim: v1 abstract: "Across four tasks, GEPA outperforms GRPO by 10% on average". v2 abstract: "Across six tasks, GEPA outperforms GRPO by 6% on average". The two added tasks are AIME-2025 and LiveBench-Math. ACE (2510.04618v3) still quotes the v1 range.
- Location: GEPA v1 and v2 abstracts; ACE Sec. 4.2 baselines.
- Verdict: WRONG for any citation of "10% on average" without the version. True statement: v2 reports 6% average across six tasks.
- Evidence: https://arxiv.org/abs/2507.19457v1 and https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | v1 Table 1 aggregate: GEPA 61.28 vs GRPO 51.14 on four tasks. ACE: https://arxiv.org/abs/2510.04618v3 | "achieving up to 10-20% higher accuracy with as much as 35x fewer rollouts" (straight-quoted, range hyphen normalised).
- Use in dive: pin the version when citing GEPA's GRPO result; the math tasks pulled the average down.

**F03-64. The GRPO baseline: LoRA rank 16, 500 steps, group 12, 4 instances per step, 24,000 rollouts, small datasets.**
- Claim: LoRA r=16, alpha 64, dropout 0.05 on q, k, v, o, up, down, gate; lr 1e-5; beta 0.01; gradient clipping 0.1; 20-step gradient accumulation; validation every 20 steps for early stopping; one H100/A100 for training. A full-parameter GRPO run on 2-hop HoVer (Figure 11) shows a similar gap. Datasets are small: HotpotQA 150 train / 300 val / 300 test; PUPA 111 / 111 / 221; AIME train and val from 90 problems (2022-2024).
- Location: Appendix E.4 "GRPO"; Appendix E.1; footnote 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | "GRPO optimization run for 500 training steps, amounting to fixed 24,000 rollouts, with validation performed every 20 training steps, which is used to implement early stopping." ; "We manually explore several values for [LR, beta, norm clipping] hyperparameters for both training runs."
- Use in dive: scope of "outperforms RL": a low-data regime (about a hundred to a few hundred training examples), parameter-efficient RL on an 8B model, fixed 24k-rollout budget. Whether a GRPO configuration tuned for small data would close the gap is open (UNKNOWN U2).

**F03-65. Most of GEPA's budget is validation; learning uses 79 to 737 train rollouts. The "35x" is a time-to-best ratio on IFBench.**
- Claim: GEPA reaches GRPO's best validation score after 243, 402, 330, 1,143, 1,179 and 306 rollouts; restricting to training rollouts, it needs 79 to 737 to reach its own optimum. For IFBench it "found optimal prompts after just 678 rollouts" vs GRPO's 24,000.
- Location: Sec. 4 Observation 1; Table 1 caption.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | "The majority of GEPA's rollout budget is spent on validation, where scores are utilized solely for candidate selection and not for producing learning signals."
- Use in dive: practical for budgeting. 24,000 / 678 = 35.4 [DERIVED], which is where "35x" comes from; the total-budget ratio is smaller (F03-61). A smaller validation set is the lever the authors name.

**F03-66. Pareto parent selection doubles the gain of greedy or beam selection.**
- Claim: On Qwen3 8B (four tasks), aggregate improvement: GEPA Pareto +12.44, SelectBestCandidate +6.05, BeamSearch(N=4) +5.11. Greedy selection stalls after one improvement.
- Location: Sec. 4 Observation 3, Table 3, Figure 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | ablation | "always choosing the current best candidate gives immediate improvement but quickly stalls, wasting rollouts on a single candidate."
- Use in dive: exploration matters in text space as in RL. Keeping one candidate per instance it wins on preserves diverse strategies.

**F03-67. GEPA on GPT-4.1 Mini, cost, and cross-model transfer.**
- Claim: Aggregate: baseline 53.03, Trace 56.30, MIPROv2 58.67, TextGrad 59.14, GEPA 65.22, GEPA+Merge 66.36. All GPT-4.1 Mini runs cost under $500; GEPA $86, GEPA+Merge $67, MIPROv2 $76, Trace plus TextGrad $172. Prompts optimized on Qwen3 8B lift GPT-4.1 Mini by +9.00 aggregate. GEPA prompts are up to 9.2x shorter than MIPROv2's.
- Location: Table 2; Appendix E.3; Observations 4 and 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | "It costs under $500 to run all experiments in Table 2 with GPT-4.1 mini. Specifically, GEPA costs a total of $86".
- Use in dive: practical cost anchor: tens of dollars per optimization run on a mini API model. No GRPO run is possible here (closed weights), which is the setting where text loops are the only option.

**F03-68. GEPA calls the reflection model only tens of times per run.**
- Claim: Reflection LM calls per run range from 17 (IFBench, Qwen3-8B) to 92 (HoVer, GPT-4.1-Mini).
- Location: Appendix N, Table 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | Table 4 "Total number of calls made by GEPA to reflection LM during optimization."
- Use in dive: the "learning step" is cheap; rollouts and validation dominate. Mental model: few, large updates (a whole new instruction per step) vs RL's many small ones.

**F03-69. GEPA as inference-time search: AMD NPU kernels and CUDA kernels.**
- Claim: On NPUEval with GPT-4o, a 10-step refinement agent reaches 4.25% mean vector utilization; with RAG 16.33%; with MIPROv2 19.03%; with GEPA 30.52% mean and up to 70% on some kernels. On 35 KernelBench tasks GEPA lifts fast_1 from near 0% to above 20%.
- Location: Sec. 5.1, Figures 7 and 8.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2507.19457v2 | Tier 3 | benchmark claim | "applying GEPA to Sequential10 (without RAG) dramatically boosts kernel performance, with several generated kernels achieving up to 70% vector utilization and a mean of 30.52%."
- Use in dive: when train set equals test set, the optimizer becomes a search procedure. Same family as AlphaEvolve (F03-95). The authors call these "early results".

**F03-70. DSPy's GEPA wrapper requires a reflection LM and recommends a stronger one than the task model.**
- Claim: At DSPy 3.4.1, `reflection_lm` is required (unless a custom proposer is given); the docstring recommends `dspy.LM(model='gpt-5', temperature=1.0, max_tokens=32000)`. Defaults: `reflection_minibatch_size=3`, `candidate_selection_strategy="pareto"`, `use_merge=True`; `auto` presets light/medium/heavy map to 6/12/18 candidates. DSPy pins `gepa[dspy]==0.1.4`.
- Location: `dspy/teleprompt/gepa/gepa.py` lines 26-29, 262-264, 408-409, 417; `pyproject.toml` line 41.
- Verdict: NEW
- Evidence: https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py#L408-L417 | Tier 1, code at tag | code behaviour | `reflection_minibatch_size: int = 3,` ; `use_merge: bool = True,` ; docstring (Tier 3 as a comment) "GEPA benefits from a strong reflection model." Pin: https://github.com/stanfordnlp/dspy/blob/3.4.1/pyproject.toml#L41
- Use in dive: practical. In practice the "learner" is a stronger model than the one being taught, as in ExpeL (F03-19) and TextGrad (F03-46).

**F03-71. The merge default differs between DSPy and the standalone gepa API, and the paper found merge hurt Qwen3 8B.**
- Claim: `gepa.optimize` at v0.1.4 defaults `use_merge=False`; DSPy's wrapper defaults `use_merge=True`. In the paper, GEPA+Merge underperformed GEPA on Qwen3 8B aggregate (52.40 vs 54.85) and on IFBench (28.23 vs 38.61); the authors attribute this to hyperparameters fixed across models.
- Location: gepa `src/gepa/api.py` line 68; DSPy `gepa.py` line 417; paper Table 1 and Observation 5.
- Verdict: NEW
- Evidence: https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py#L68 (`use_merge: bool = False,`) and https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py#L417 (`use_merge: bool = True,`) | Tier 1, code at tag | code behaviour. Paper: https://arxiv.org/abs/2507.19457v2 | Tier 3 | "it lead to performance degradation when used with Qwen3 8B."
- Use in dive: a default that changes with the entry point; check it before comparing runs from DSPy and from raw gepa.

**F03-72. gepa's acceptance rule is strict improvement on the minibatch sum, and its reflection prompt asks the model to write domain facts into the instruction.**
- Claim: Default `acceptance_criterion="strict_improvement"` maps to `StrictImprovementAcceptance`, which accepts only if the sum of new minibatch scores exceeds the old sum. Parents are sampled from the Pareto front in proportion to how many instances they lead. The default reflection template tells the model to "Identify all niche and domain specific factual information about the task and include it in the instruction".
- Location: `src/gepa/api.py` lines 97-98 and 357-366; `src/gepa/strategies/acceptance.py` lines 44-53; `src/gepa/gepa_utils.py` lines 90-117; `src/gepa/strategies/instruction_proposal.py` lines 13-30.
- Verdict: NEW
- Evidence: https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/acceptance.py#L44-L53 | Tier 1, code at tag | code behaviour | `return new_sum > old_sum` ; https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/instruction_proposal.py#L27 | "Identify all niche and domain specific factual information about the task and include it in the instruction, as a lot of it may not be available to the assistant in the future."
- Use in dive: mental model: GEPA's learned prompt is a compressed store of task knowledge and strategy, written by a model told to record facts the task model lacks. That is why it transfers across models (F03-67) and why it cannot store per-instance hidden structure (F03-108).

**F03-73. The gepa README compresses the paper's budget claim beyond what the paper's totals show.**
- Claim: README at v0.1.4: "35x faster than RL | 100-500 evaluations vs. 5,000-25,000+ for GRPO". The paper's GEPA totals are 1,839 to 7,051 rollouts per task (v2 Table 1); 79 to 737 counts training rollouts only.
- Location: gepa `README.md` "Key Results" table at v0.1.4; paper Table 1 and Observation 1.
- Verdict: WRONG as stated against the paper's total budgets. True statement: GEPA used 1,839 to 7,051 total rollouts vs GRPO's 24,000; the README's range is closer to the paper's training-rollout counts.
- Evidence: https://github.com/gepa-ai/gepa/blob/v0.1.4/README.md | Tier 3, in-repo README (orientation only per source-authority standard) | benchmark claim | "100-500 evaluations vs. 5,000-25,000+ for GRPO" (range hyphens normalised). Paper: https://arxiv.org/abs/2507.19457v2 | Tier 3.
- Use in dive: doc-vs-paper conflict worth a disclosure: budget a GEPA run on total metric calls, which include validation.

### Evolving context: ACE

**F03-74. ACE splits generation, reflection and curation, and merges small deltas with non-LLM code.**
- Claim: A Generator produces trajectories and marks which playbook bullets helped or misled; a Reflector extracts lessons (up to 5 refinement rounds); a Curator emits compact delta bullets that deterministic code merges into the playbook; embedding similarity de-duplicates. Counters on bullets are updated in place. The same model (DeepSeek-V3.1, non-thinking) plays all three roles.
- Location: arXiv 2510.04618v3, Sec. 3, 3.1, 3.2; Sec. 4.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3, peer-reviewed (ICLR 2026) | definition | "The Curator then synthesizes these lessons into compact delta entries, which are merged deterministically into the existing context by lightweight, non-LLM logic." ; "we use the same LLM for the Generator, Reflector, and Curator ... preventing knowledge transfer from a stronger Reflector or Curator to a weaker Generator."
- Use in dive: the update rule controls step size: append-and-dedup changes a few bullets per step instead of rewriting the whole context.

**F03-75. Context collapse: one full rewrite took a 18,282-token context to 122 tokens and dropped accuracy below the no-context baseline.**
- Claim: On AppWorld, at step 60 a monolithically rewritten context held 18,282 tokens at 66.7 accuracy; the next rewrite produced 122 tokens at 57.1, below the 63.7 baseline without adaptation.
- Location: Sec. 2.2 "Context Collapse", Figure 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3, peer-reviewed | benchmark claim | "at step 60 the context contained 18,282 tokens and achieved an accuracy of 66.7, but at the very next step it collapsed to just 122 tokens, with accuracy dropping to 57.1".
- Use in dive: the vivid number for M1: a full-rewrite update rule is a step size of 100% and can erase what was learned in one step. RL's analogue is a policy update with no trust region.

**F03-76. ACE on AppWorld: 59.4 average vs 46.4 for GEPA and 42.4 for ReAct.**
- Claim: DeepSeek-V3.1 base ReAct 42.4 average; offline ICL 46.0, GEPA 46.4, ACE 59.4 with ground-truth labels and 57.2 without; online DC 51.9, ACE 59.5 (no labels).
- Location: Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3, peer-reviewed | benchmark claim | "ReAct + ACE outperforms selected baselines by an average of 10.6%, and could achieve good performance even without access to GT labels." The paper reports no RL baseline.
- Use in dive: on a long-horizon tool-use benchmark, a rich playbook beat a single optimized instruction by about 13 points. Feeds debate C3.

**F03-77. Without labels, ACE helps on agent tasks with execution feedback and can hurt on finance.**
- Claim: FiNER (base 70.7): offline ACE with labels 78.3, without labels 71.1; online ACE with labels 76.7, without labels 67.3 (below base); online DC without labels 68.3. On Formula, online ACE without labels still reaches 78.5 vs base 67.5.
- Location: Table 2; Sec. 4.4 "Analysis: Finance Benchmark".
- Verdict: WRONG if the abstract's "without labeled supervision" is read as general. True statement: label-free ACE worked where execution feedback exists (AppWorld, Formula) and degraded below baseline on online FiNER.
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3, peer-reviewed | benchmark claim | "when ground-truth supervision or reliable execution signals are absent, both ACE and DC may degrade in performance. In such cases, the constructed context can be polluted by spurious or misleading signals".
- Use in dive: M2 again, inside one paper. Contradiction C4.

**F03-78. ACE's adaptation cost vs GEPA and DC.**
- Claim: Offline AppWorld: ACE 9,517 s and 357 rollouts vs GEPA 53,898 s and 1,434 rollouts (82.3% and 75.1% lower). Online FiNER: ACE 5,503 s and $2.9 vs DC 65,104 s and $17.7 (91.5% and 83.6% lower). Offline input and output tokens 80.8% and 83.6% lower than GEPA.
- Location: Sec. 4.7, Table 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3 | benchmark claim | "ACE achieves 82.3% reduction in adaptation latency and 75.1% reduction in the number of rollouts as compared to GEPA".
- Use in dive: cost axis M5. Skipping a validation loop is where most of the saving comes from (the paper says ACE "avoids GEPA's prompt-validation loop").

**F03-79. Long playbooks are cheap to serve when the prefix is cached.**
- Claim: With the OpenAI API (GPT-5.1), 91.8% of ACE's input tokens were served from cache during evaluation, cutting billed input cost by 82.6% relative to counting raw tokens.
- Location: Sec. 4.7 "KV Cache Reuse".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3 | benchmark claim | "ACE achieves high cache reuse: 91.8% of input tokens are served from cache during evaluation stage, which reduces billed input-token cost by 82.6% relative to counting raw context tokens."
- Use in dive: practical, and directly in the reader's inference wheelhouse: a stable playbook prefix turns the serving-cost penalty of text learning into a prompt-caching problem.

**F03-80. ACE needs a capable Reflector, and some tasks want short instructions.**
- Claim: ACE depends on the Reflector extracting real insights; HotPotQA tends to benefit from concise high-level instructions and Game of 24 needs one rule. The authors also report graceful degradation with weaker or noisy reflectors (Appendix), staying above base except under adversarial updates every iteration.
- Location: Sec. 5 "Limitations and Challenges"; Sec. 4.6 summary.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.04618v3 | Tier 3 | benchmark claim | "ACE is most beneficial in settings that demand detailed domain knowledge, complex tool use, or environment-specific strategies that go beyond what is already embedded in model weights or simple system instructions."
- Use in dive: guidance for choosing playbook vs prompt; partial resolution of C3.

### Memory-based agent learning

**F03-81. Memento learns which past case to retrieve with soft Q-learning on a small network, with the LLM fixed.**
- Claim: Memento formalises a memory-augmented MDP. The case bank stores (state, plan, reward); non-parametric retrieval uses embedding similarity; the parametric variant trains a kernel network as a Q-function with soft Q-learning (TD updates) to pick cases. GPT-4.1 plans, o3 (GAIA) or o4-mini executes.
- Location: arXiv 2508.16153v2, Sec. 3 "Soft Q-Learning for CBR Agent"; Sec. 4; Sec. 5.3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2508.16153v2 | Tier 3, preprint | definition | "we aim to learn the case retrieval policy \mu with the LLM component p_{LLM} fixed."
- Use in dive: a second bridge design: RL on a small component (the retriever), words for the big model. Compare Advisor Models (F03-105).

**F03-82. Memento beats an RL-trained 7B research agent, using much larger frozen models.**
- Claim: On seven DeepResearcher QA sets, Memento (GPT-4.1 + o4-mini) averages 66.6 F1 / 80.4 PM vs DeepResearcher 51.8 / 60.5 and R1-Searcher 47.1 / 53.7; those baselines are Qwen2.5-7B numbers taken from the DeepResearcher paper. GAIA: 87.88% Pass@3 on validation, 79.40% on test, where the test run uses the case bank built on validation.
- Location: Table 1; Sec. 5.4 "GAIA".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2508.16153v2 | Tier 3, preprint | benchmark claim | "The results of prompt-based and training-based methods using Qwen 2.5 (7B) are referred to DeepResearcher (Zheng et al., 2025)."
- Use in dive: scope note for C5: the comparison mixes method and model size, so it says a frozen frontier model with memory beat an RL-trained 7B model, not that memory beats RL on the same model.

**F03-83. Memento's memory saturates quickly; its cost sits in input tokens.**
- Claim: With about 3k training items the case bank saturates and later iterations add little. On GAIA, Level 1 tasks used 26k input / 4.7k output tokens, Level 3 121k / 9.8k. Out-of-distribution QA gains are 4.7 to 9.6 points.
- Location: Sec. 5.5.3; Sec. 6.1 (Figure 6); Sec. 5.5.4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2508.16153v2 | Tier 3, preprint | benchmark claim | "With only about 3 k training data, the Case Bank saturates quickly." ; "Level 3 peaked at 121k/9.8k".
- Use in dive: memory learning has a short horizon when the task set is finite; serving cost scales with context.

**F03-84. A-Mem organises memory and rewrites old notes, with no reward signal.**
- Claim: New memories become structured notes (context, keywords, tags), linked to related notes; linking can trigger updates to older notes ("memory evolution"). Evaluated on long-conversation QA (LoCoMo). No reward drives the updates.
- Location: arXiv 2502.12110v11, Abstract; Sec. 3; Sec. 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2502.12110v11 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "as new memories are integrated, they can trigger updates to the contextual representations and attributes of existing historical memories".
- Use in dive: classify as memory organisation, which is storage. It belongs in the dive only as the contrast case: a memory without a feedback signal does not learn a policy.

**F03-85. MemGPT is virtual context management, which is storage.**
- Claim: MemGPT pages information between context and external tiers, borrowing the operating-system virtual memory idea; it has no reward-driven update.
- Location: arXiv 2310.08560v2, Abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.08560v2 | Tier 3, preprint | definition | "we propose virtual context management, a technique drawing inspiration from hierarchical memory systems in traditional operating systems which provide the illusion of an extended virtual memory via paging between physical memory and disk."
- Use in dive: one line in the table. The reader will recognise the paging analogy instantly; it explains capacity, not learning.

### Training-Free GRPO

**F03-86. Training-Free GRPO replaces GRPO's numeric advantage with a written one.**
- Claim: For each query, G rollouts are generated; each is summarised; for groups with clear winners and losers (where numeric advantage would be non-zero), the LLM writes why some outputs won, a "semantic advantage". The LLM then emits Add, Delete, Modify or Keep operations on an experience library that is prepended to future calls.
- Location: arXiv 2510.08191v1, Sec. 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | definition | "This natural language experience A_{text} serves as our semantic advantage, functionally equivalent to vanilla GRPO's \hat{A}_{i}" ; "we generate such semantic advantages only for groups with both clear winners and losers."
- Use in dive: the closest one-to-one mapping from an RL algorithm to its text version. Good for a side-by-side diagram with the GRPO section.

**F03-87. Training-Free GRPO setup: 100 problems, 3 steps, group size 5.**
- Claim: DAPO-100 (100 random problems from DAPO-Math-17K); 3 epochs, one batch per epoch (3 steps); temperature 0.7 for learning, 0.3 for evaluation; group size 5; Mean@32 on AIME 2024 and 2025.
- Location: Sec. 3.1 "Setup".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | benchmark claim | "We run the learning process for 3 epochs with a single batch per epoch (i.e., 3 steps), using a temperature of 0.7 and a group size of 5 during the learning phase."
- Use in dive: scale contrast: 3 updates on 100 problems vs thousands of RL steps.

**F03-88. On DeepSeek-V3.1-Terminus, gains of 2.7 and 5.4 points for about $18.**
- Claim: ReAct with code interpreter: AIME24 80.0 -> 82.7, AIME25 67.9 -> 73.3 (about $18). Without tools: 68.6 -> 72.6 and 52.9 -> 54.0 (about $8).
- Location: Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | benchmark claim | Table 1 "+ Training-Free GRPO | ~$18 | DAPO-100 | DeepSeek-V3.1-Terminus | CI | 82.7 (+2.7) | 73.3 (+5.4)".
- Use in dive: comparison-table cell; small gains on a model already near its ceiling.

**F03-89. Ablations: ground truth, grouping and learning all matter.**
- Claim: Directly generated experiences (no learning) 79.8 / 67.3; without ground truth 80.7 / 68.9; group size 1 80.4 / 69.3; full method 82.7 / 73.3 (AIME24 / AIME25, ReAct baseline 80.0 / 67.9).
- Location: Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | ablation | "such directly generated experiences fail to improve the performance, highlighting the effectiveness of learned experiential knowledge".
- Use in dive: the comparison inside a group is what carries the signal, the same reason GRPO uses groups. Without labels the gain mostly disappears (M2).

**F03-90. "Beats RL" pairs a frozen 671B model against RL-trained 32B models; at 32B scale the RL-trained models score far higher.**
- Claim: Table 3: RL methods on Qwen2.5-32B-Instruct: ZeroTIR 56.7 / 33.3, SimpleTIR 59.9 / 49.2, ReTool 67.0 / 49.3, AFM 66.7 / 59.8 (AIME24 / AIME25), from a ReAct base of 29.6 / 23.1. Training-Free GRPO on Qwen3-32B (non-thinking) goes 29.1 / 19.5 -> 33.5 / 25.4; on Qwen2.5-72B 13.5 / 9.6 -> 14.9 / 11.4. Only on DeepSeek-V3.1-Terminus (82.7 / 73.3) does it exceed the RL-trained 32B models.
- Location: Table 3; Sec. 3.1 "Main Results".
- Verdict: WRONG if read as "training-free beats RL". True statement: a frozen frontier-scale model with learned text beats RL-trained 32B models; on 32B-class models, RL lifted AIME24 by about 37 points and the text loop by 4.4 [DERIVED: 67.0 minus 29.6, and 33.5 minus 29.1], with the caveat that the 32B models differ (Qwen2.5-32B vs Qwen3-32B).
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | benchmark claim | "guiding a powerful but frozen model through context-space optimization is more effective and efficient than exhaustively fine-tuning a less capable model in parameter space."
- Use in dive: the clearest available evidence for "where the text version falls short": text learning moved a 32B model a few points; RL moved a comparable 32B model tens of points. Supports M3.

**F03-91. Cost: about $18 of tokens vs about $10,000 of GPU time, and the per-query cost reverses at serving.**
- Claim: Replicating ReTool on Qwen2.5-32B took about 20,000 GPU hours at an assumed $0.5 per GPU hour (about $10,000). Training-Free GRPO used 38M input and 6.6M output tokens in 6 hours (about $18 at DeepSeek pricing). Serving: ReTool-32B on 4 GPUs at $0.5 per GPU hour processes about 400 AIME problems per hour, $0.005 per problem; Training-Free GRPO uses about 60K input and 8K output tokens per problem, about $0.02. Weak model case: QwQ-32B on a WebWalkerQA subset dropped from 27.5 to 25.5 pass@1.
- Location: Sec. 4.2 "Training Cost" and "Inference Cost"; Table 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08191v1 | Tier 3, preprint | benchmark claim | "it requires approximately 20,000 x GPU hours with the rental price of $0.5 per GPU hour, resulting in the total training expense amounts to roughly $10,000." ; "totaling about $0.02 per problem with cache hit pricing for reused contexts."
- Use in dive: the cleanest cost-per-improvement pair in the area (M5). The $0.5 per GPU hour price is the authors' assumption and is low for H100-class capacity; the reader should rescale with real rates. Breakeven: at these numbers the text loop is cheaper until roughly 660,000 served problems [DERIVED: ($10,000 minus $18) / ($0.02 minus $0.005), ignoring the RL model's idle GPU cost, which the authors argue dominates at low traffic].

### Evolutionary code search

**F03-92. FunSearch pairs a frozen pretrained code LLM with a programmatic evaluator.**
- Claim: A pretrained LLM (Codey, PaLM 2 based, no fine-tuning) proposes new versions of one function; an evaluator runs and scores them; correct programs enter an islands-model database; prompts are built "best-shot" from high scorers. The authors chose a fast model over a higher-quality slow one.
- Location: Nature paper, "FunSearch" section; Methods.
- Verdict: NEW
- Evidence: https://doi.org/10.1038/s41586-023-06924-6 | Tier 3, peer-reviewed (Nature) | definition | "FunSearch ... combines a pretrained (frozen) LLM, whose goal is to provide creative solutions, with an evaluator, which guards against confabulations and incorrect ideas."
- Use in dive: in this family the evaluator plays the reward model's role, and the LLM is a mutation operator.

**F03-93. FunSearch works best with an efficient evaluator, a rich (non-binary) score, and a skeleton.**
- Claim: The authors state the conditions explicitly and give theorem proving as out of scope for lack of a rich score.
- Location: Discussion.
- Verdict: NEW
- Evidence: https://doi.org/10.1038/s41586-023-06924-6 | Tier 3, peer-reviewed | benchmark claim | "FunSearch, at present, works best for problems having the following characteristics: (1) availability of an efficient evaluator; (2) a 'rich' scoring feedback quantifying the improvements (as opposed to a binary signal) and (3) ability to provide a skeleton with an isolated part to be evolved."
- Use in dive: the selection test for evolutionary loops, quotable as is. It mirrors RL's need for dense reward.

**F03-94. FunSearch's results: a larger cap set in dimension 8, and a better capacity lower bound.**
- Claim: A 512-vector cap set in dimension 8, larger than previously known; lower bound on cap-set capacity raised to 2.2202 (from 2.2180 via a first discovery). Programs, not raw solutions, are the output.
- Location: "Extremal combinatorics" section, Figures 4 and 5.
- Verdict: NEW
- Evidence: https://doi.org/10.1038/s41586-023-06924-6 | Tier 3, peer-reviewed | benchmark claim | "a new lower bound on the cap set capacity of 2.2202". Not compared with RL.
- Use in dive: brief, as proof that a frozen model in a search loop can produce new verified knowledge.

**F03-95. AlphaEvolve evolves whole files with an LLM ensemble and an evaluation cascade.**
- Claim: Gemini 2.0 Flash (throughput) and Gemini 2.0 Pro (quality) propose code changes; a program database feeds prompts; evaluators score; an evaluation cascade runs harder test stages only for promising candidates; LLM-generated feedback is optional for hard-to-code criteria.
- Location: arXiv 2506.13131v1, Sec. 2, 2.3, 2.4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.13131v1 | Tier 3, preprint (white paper) | definition | "Evaluation cascade (hypothesis testing): the user can specify ensembles of test cases of increasing difficulty, such that new solutions are evaluated on the next stage only if they achieve sufficiently promising results in all earlier stages."
- Use in dive: the cascade is the practical way to keep evaluator cost bounded.

**F03-96. AlphaEvolve vs FunSearch: thousands of samples instead of millions, longer evaluations, bigger models.**
- Claim: FunSearch evolves one 10-20 line Python function, needs evaluation in 20 minutes or less on one CPU, used millions of LLM samples, small LLMs with no benefit from larger; AlphaEvolve evolves hundreds of lines in any language, evaluates for hours on accelerators, "thousands of LLM samples suffice", and benefits from SOTA LLMs.
- Location: Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.13131v1 | Tier 3, preprint | benchmark claim | Table 1: "millions of LLM samples used | thousands of LLM samples suffice" and "small LLMs used; no benefit from larger | benefits from SOTA LLMs".
- Use in dive: a better model makes each proposal worth more, so the loop needs fewer of them. The millions figure for FunSearch is AlphaEvolve's description and was not checked against the FunSearch paper (UNKNOWN U11).

**F03-97. In production, Google chose AlphaEvolve over deep RL for data-center scheduling, citing interpretability and deployability.**
- Claim: An AlphaEvolve heuristic, trained against a simulator of historical fleet snapshots and checked on unseen recent data, was rolled out fleet-wide and recovers on average 0.7% of fleet compute that would otherwise be stranded. The white paper says it was chosen over a deep RL approach; it gives no RL numbers.
- Location: Sec. 3.3.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.13131v1 | Tier 3, preprint (vendor white paper reporting its own production) | production report | "AlphaEvolve was chosen over a deep reinforcement learning approach because its code solution not only leads to better performance, but also offers clear advantages in interpretability, debuggability, predictability, and ease of deployment-essential qualities for a mission-critical system." (dash character normalised)
- Use in dive: a production reason to choose text: the learned artifact is a short function an operator can read and roll back. Hedge: "better performance" is asserted without published RL numbers.

**F03-98. AlphaEvolve sped up a Gemini training kernel heuristic by 23%, about 1% of training time.**
- Claim: An evolved tiling heuristic for Pallas kernels gave an average 23% kernel speedup over the expert heuristic and a 1% reduction in Gemini's overall training time.
- Location: Sec. 3.3.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.13131v1 | Tier 3, preprint | production report | "a heuristic that yields an average 23% kernel speedup across all kernels over the existing expert-designed heuristic, and a corresponding 1% reduction in Gemini's overall training time."
- Use in dive: a number the reader will appreciate: kernel-level wins compress when amortised over a whole training run.

**F03-99. AlphaEvolve's limits and its stated next step: distil the gains into weights.**
- Claim: The method needs an automated evaluator; LLM-only evaluation is not what it was optimised for. The authors name distilling AlphaEvolve-augmented performance into the next base model as the natural next step. Ablations (no evolution, no context, no meta-prompt evolution, no full-file evolution, small base LLM only) each lower results.
- Location: Sec. 4 Ablations, Figure 8; Sec. 6 Discussion.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.13131v1 | Tier 3, preprint | ablation and benchmark claim | "The main limitation of AlphaEvolve is that it handles problems for which it is possible to devise an automated evaluator." ; "a natural next step will be to consider distilling the AlphaEvolve-augmented performance of the base LLMs into the next generation of the base models."
- Use in dive: the arc of the whole dive in one paper: search in text first, then move the result into weights.

**F03-100. OpenEvolve v0.4.0 defaults: cascade on, five islands, MAP-Elites on complexity and diversity, LLM judge off.**
- Claim: `EvaluatorConfig`: `cascade_evaluation=True`, `cascade_thresholds=[0.5, 0.75, 0.9]`, `timeout=300`, `use_llm_feedback=False`, `llm_feedback_weight=0.1`. `DatabaseConfig`: `population_size=1000`, `num_islands=5`, `feature_dimensions=["complexity", "diversity"]`, `migration_interval=50`, `migration_rate=0.1`.
- Location: `openevolve/config.py` lines 317-365 and 382-405 at v0.4.0.
- Verdict: NEW
- Evidence: https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/config.py#L382-L405 | Tier 1, code at tag | code behaviour | `cascade_evaluation: bool = True` ; `use_llm_feedback: bool = False`.
- Use in dive: practical starting configuration for an open AlphaEvolve-style loop.

**F03-101. In OpenEvolve, enabling the LLM judge gives it 30% of the selection score regardless of `llm_feedback_weight`.**
- Claim: When `use_llm_feedback` is on, the weight scales the `llm_*` metrics, but if the evaluator returns `combined_score`, the code recomputes it as `accuracy * 0.7 + llm_average * 0.3` using the unweighted LLM average; the database ranks by `combined_score` when present.
- Location: `openevolve/evaluator.py` lines 194-221; `openevolve/database.py` line 715.
- Verdict: NEW (code-derived inference: OpenEvolve documents the knob in config, and the code applies a hard-coded split to the ranking score)
- Evidence: https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/evaluator.py#L204-L221 | Tier 1, code at tag | code behaviour | `weighted_value = value * self.config.llm_feedback_weight` and `accuracy * 0.7 + llm_average * 0.3`.
- Use in dive: a knob that quietly does less than its name says. If the judge is noisy, 30% of selection pressure goes to the judge.

**F03-102. OpenEvolve declares evaluator resource limits that nothing enforces.**
- Claim: `memory_limit_mb` and `cpu_limit` exist in `EvaluatorConfig` with the comment "resource limits not implemented"; a grep of the v0.4.0 `openevolve/` package finds no other reference.
- Location: `openevolve/config.py` lines 390-392 at v0.4.0.
- Verdict: NEW (code-derived inference)
- Evidence: https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/config.py#L390-L392 | Tier 1, code at tag | code behaviour | `memory_limit_mb: Optional[int] = None` with comment `# Note: resource limits not implemented` (the comment itself is Tier 3; the absence of references is the code evidence).
- Use in dive: practical. LLM-written code runs in your evaluator; sandbox it yourself (Reflexion's authors give the same advice in their Sec. 8).

**F03-103. ShinkaEvolve claims a state-of-the-art circle packing with 150 samples.**
- Claim: Parent sampling balancing exploration and exploitation, novelty rejection sampling, and bandit-based LLM ensemble selection; new SOTA circle packing "using only 150 samples".
- Location: arXiv 2509.19349v1, Abstract (body not read). Code tag v0.0.7 (c4568adde253cacf185be3a8412c3c2142761ebe).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.19349v1 | Tier 3, preprint | benchmark claim (author-reported, abstract only) | "ShinkaEvolve discovers a new state-of-the-art circle packing solution using only 150 samples".
- Use in dive: one-line mention as the open, sample-efficient variant. Treat the number as unverified until the body is read (U10).

### Advisor Models: the bridge

**F03-104. The Advisor paper's identity is confirmed.**
- Claim: arXiv 2510.02453 is "How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models" by Parth Asawa, Alan Zhu, Abigail O'Neill, Matei Zaharia, Alexandros G. Dimakis, Joseph E. Gonzalez; latest version v3; comments: ICML 2026.
- Location: arXiv abstract page.
- Verdict: NEW (ID and title verified, no correction needed)
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed (ICML 2026) | definition | citation_title "How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models".
- Use in dive: citation hygiene.

**F03-105. An advisor is a small open model trained with GRPO to write per-instance advice for a frozen black-box model.**
- Claim: The advisor (e.g. Qwen2.5 7B Instruct) sees the input (and in a 3-step variant the student's first attempt) and writes advice; the frozen student answers with that advice in context; reward on the student's output trains the advisor with GRPO. Multi-turn variants inject advice every few student steps. Training ran on a SkyRL fork on one 8xH100 node, learning rate 1e-6.
- Location: arXiv 2510.02453v3, Sec. 3; Appendix A, Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | definition | "We use Group Relative Policy Optimization (GRPO; Shao et al. (2024)) to update the advisor based only on observed rewards." ; "The Advisor Models design turns prompt engineering into an RL problem, where the advisor learns which advice reliably elicits better performance."
- Use in dive: why it sits between text and RL: the learning is real RL on weights, the effect on the big model is words. The state is weights; the interface is text.

**F03-106. Advisors beat GEPA and lift frontier models after transfer.**
- Claim: RuleArena Taxes: GPT-4.1 mini alone 64.8%, untrained advisor 52.0%, GEPA 58.4%, trained advisor 76.8%; transferred to GPT-5.2, 67.2% -> 85.6%. MTOB (Kalamang to English, chrF): GPT-4o mini 33.1, GEPA 33.0, trained advisor 45.8 (human 51.6); transferred to GPT-5, 46.2 -> 47.8. SWE efficiency: Gemini 2.5 Flash 19.1 steps at 61.2% resolve -> 14.4 steps at 61.2%; Gemini 3 Pro 31.7 -> 26.3 steps with resolve rate kept.
- Location: Sec. 4.1.1; Sec. 4.2; Figures 3 and 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | benchmark claim | "the trained advisor overcomes the loss and improves upon the standalone baseline, achieving an accuracy of 76.8%." ; GEPA "was allowed to access the reward function an equivalent number of times as in Advisor Models training."
- Use in dive: the counterweight to GEPA's GRPO claim (C2): on knowledge-heavy rule-following and a low-resource language, a static optimized prompt gave nothing while a trained advisor gave 12 points.

**F03-107. Advisors learn hidden per-user preferences that static prompts cannot.**
- Claim: With GPT-4o mini as student and Qwen2.5 7B as advisor, rewards reach 0.94 (review length), 99.6% (review reading level) and 0.948 (math solution style); GEPA and Profile-Augmented Generation are "marginally above the un-optimized baselines, if at all". The advisor even exceeds an in-context oracle that states each user's preference.
- Location: Sec. 4.3.1, Figure 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | benchmark claim | "To ensure the correctness of the baseline, we contacted the GEPA authors and worked with them to confirm a fair implementation of GEPA for these tasks."
- Use in dive: mental model M4: one static prompt is one policy for every input. When the right behaviour depends on a latent the prompt cannot see per instance, the mapping has to live in weights somewhere.

**F03-108. Direct RL on the student beats the advisor, which recovers most of the gain.**
- Claim: MTOB with a Qwen2.5 3B advisor and Qwen2.5 7B student, same hyperparameters, 20 epochs: baseline chrF 31.17, advisor 38.98, direct RL on the student 42.38. Direct RL learns faster early and then flattens; the advisor climbs steadily; both still rising at the end.
- Location: Sec. 4.4.3, Figure 9; Appendix D.4, Figure 14.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | benchmark claim | "When access to the student model's weights is available, we expect direct reinforcement learning to provide greater gains than Advisor Models." ; "Though direct RL remains the better option, the Advisor Models pipeline is able to make up most of the improvement over baseline".
- Use in dive: the only same-model, same-budget head-to-head in this area between RL on the model and a words-only interface to it. The advisor recovers about 70% of RL's gain [DERIVED: (38.98 - 31.17) / (42.38 - 31.17) = 0.70].

**F03-109. Advisors cannot help where the student already knows everything relevant.**
- Claim: On MATH-500 with GPT-4o mini, a trained advisor gives no significant improvement. The authors frame the requirement as "there must be something for the advisor to learn".
- Location: Sec. 4.4.4, Figure 10.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | ablation | "For in-distribution domains where frontier models are already highly knowledgeable, there may be nothing the advisor can learn that the student doesn't already know."
- Use in dive: the boundary condition on every words-only method: words add knowledge or steering, not reasoning capacity. Supports M3.

**F03-110. Advisor training cost: train on a cheap student, transfer to the frontier one; capabilities on other tasks are preserved.**
- Claim: Training directly with a frontier student would take 200 examples x 20 epochs x group 8 = 32,000 frontier calls, estimated at thousands of dollars, so advisors were trained with GPT-4o mini, GPT-4.1 mini or Gemini 2.5 Flash and transferred. Advisors trained on unrelated tasks do not lower the student's MATH-500 accuracy.
- Location: Sec. 4 opening; Sec. 4.4.2, Figure 8; Appendix D.5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.02453v3 | Tier 3, peer-reviewed | benchmark claim | "training in a domain with 200 examples for 20 epochs and GRPO group size 8 would make for a total of 200 x 20 x 8 = 32,000 calls to the frontier model, which we estimate to cost thousands of dollars."
- Use in dive: practical recipe: RL a 7B advisor against a mini model, deploy it in front of the frontier model. No forgetting risk because the big model never changes.

### Prompt plus weights

**F03-111. BetterTogether: alternating prompt optimization and fine-tuning beats either alone.**
- Claim: On HotPotQA, GSM8K and Iris with mistral-7b, llama-2-7b and llama-3-8b, alternating the two beats weights alone by up to 60% and prompts alone by up to 6% on average. The weight step is fine-tuning on bootstrapped traces, not RL.
- Location: arXiv 2407.10930v2, Abstract; Sec. 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.10930v2 | Tier 3, peer-reviewed (EMNLP 2024) | benchmark claim | "these BetterTogether strategies optimizing the weights and prompts of a pipeline together outperform directly optimizing weights alone and prompts alone by up to 60% and 6%, respectively, on average across LMs and tasks."
- Use in dive: the "how to choose" answer is often "both, in sequence": prompts find the strategy, weights make it cheap and reliable.

**F03-112. Databricks case: GEPA slightly beat SFT on gpt-4.1 and stacked with it; GEPA-tuned gpt-oss-120b beat Claude Opus 4.1 at lower serving cost.**
- Claim: GEPA on gpt-4.1 +2.1 points vs SFT +1.9 over baseline, and GEPA on top of SFT +4.8; GEPA-optimized gpt-4.1 is about 20% cheaper to serve than the SFT-optimized gpt-4.1. GEPA-optimized gpt-oss-120b is about 3% better than Claude Sonnet 4 and Claude Opus 4.1 while about 20x and 90x cheaper to serve.
- Location: Databricks blog, September 24, 2025.
- Verdict: NEW
- Evidence: https://www.databricks.com/blog/building-state-art-enterprise-agents-90x-cheaper-automated-prompt-optimization | Tier 2, authors' own post on their own method | benchmark claim (vendor-reported, no peer review) | "We apply GEPA on top of SFT and achieve a +4.8 point gain over the baseline"; "GEPA-optimized gpt-oss-120b surpasses state-of-the-art proprietary models Claude Sonnet 4 and Claude Opus 4.1 by ~3% while being roughly 20x and 90x cheaper to serve". DSPy's own BetterTogether docstring cites this case: https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/bettertogether.py#L42-L50 (Tier 3, code comment).
- Use in dive: the enterprise framing the reader will meet in customer conversations. Present as vendor-reported with the cost ratio coming from list serving prices, not a measured TCO.

## 4. Mental models worth teaching

**M1. A text loop is an optimizer whose parameters are tokens in the context, and its update rule sets the step size.** Reflexion appends one reflection and caps the buffer at 1-3 (F03-1); ExpeL edits a voted list with counters (F03-18); ACE merges small deltas and de-duplicates (F03-74); OPRO and GEPA write a whole new instruction per step (F03-51, F03-59). Full rewrites are the largest possible step and can erase learning in one move, as in ACE's 18,282-token to 122-token collapse (F03-75); never compressing has the opposite failure, full history scoring 26.7 vs 50.0 for a curated cheatsheet (F03-34). Reflexion's and Training-Free GRPO's own formalisms state the parameter view directly (F03-2, F03-86).

**M2. The feedback signal, not the reflection, decides whether a text loop learns.** The same loop gains with a grounded signal and loses without it: Self-Refine math 64.1 -> 64.1 with self-feedback vs 68.9 with oracle feedback (F03-9, F03-10); intrinsic self-correction drops GPT-3.5 CommonSenseQA from 75.8 to 38.1 while oracle stopping raises it to 89.7 (F03-12, F03-13); Reflexion's HotPotQA signal is the gold answer (F03-3); ACE without labels falls below baseline on online FiNER (F03-77); Training-Free GRPO without ground truth keeps little of its gain (F03-89). The richer the signal, the better: GEPA reads the evaluator's text (F03-60), and FunSearch needs a non-binary score (F03-93). The practical form: invest in the grader before the reflector.

**M3. A text loop can only select and steer behaviour the frozen model can already produce; RL can change what the model can produce.** Gains vanish on weak models (Reflexion on starchat-beta, F03-6; Self-Refine on Vicuna-13B, F03-11; Dynamic Cheatsheet on GPT-4o-mini, F03-34; Training-Free GRPO on QwQ-32B, F03-91) and where the model already knows the domain (Advisor on MATH-500, F03-109). Where reasoning skill is the bottleneck, weights win: GRPO beats GEPA on AIME-2025 (F03-62), RL lifts a 32B model about 37 AIME points vs about 4 for text learning (F03-90), and direct RL beats an advisor on the same 7B model (F03-108). Kamoi et al.'s third conclusion says the same about self-correction itself (F03-16).

**M4. A static prompt is one policy for every input; when the right behaviour depends on a latent per instance, put weights somewhere.** GEPA's learned prompt is a compressed store of task facts and strategy (F03-72), which transfers across models (F03-67) but gave nothing on hidden per-user preferences, where a 7B advisor trained with RL reached 0.94 to 99.6% (F03-107). The advisor and Memento's Q-function retriever (F03-81) both keep the big model frozen and put a small trained model in front of it.

**M5. Text loops are cheap to train and pay at serving; RL is expensive to train and cheap to serve.** Training side: GEPA used 1,839 to 7,051 rollouts vs GRPO's 24,000 (F03-61), Training-Free GRPO about $18 vs about $10,000 (F03-91), a GEPA run on GPT-4.1 Mini $86 (F03-67). Serving side: Training-Free GRPO $0.02 vs $0.005 per problem (F03-91), Dynamic Cheatsheet 370 -> 1,035 to 1,831 tokens per answer (F03-35), Memento up to 121k input tokens per task (F03-83). Prompt caching narrows the serving gap, 82.6% lower billed input for ACE (F03-79). The decision variable is expected query volume over the life of the learned artifact.

**M6. In an evolutionary code loop the evaluator is the reward model, and the LLM is a mutation operator.** FunSearch and AlphaEvolve state the requirement outright (F03-93, F03-99); verifiers are the most important component wherever ablated (Voyager -73% without self-verification, F03-38; Reflexion's false-positive tests, F03-4). Better models mean fewer samples, millions for FunSearch vs thousands for AlphaEvolve (F03-96), and AlphaEvolve's authors name distillation into weights as the next step (F03-99).

## 5. Contradictions and debates

**C1. Can models improve by critiquing themselves?**
- Yes: Self-Refine reports about 20% average gains across seven tasks with self-feedback (F03-8, F03-9); Reflexion reports large gains with self-reflection (F03-1 to F03-4).
- No, not in general: Huang et al. show accuracy drops without external feedback and attribute earlier gains to oracle labels (F03-12, F03-13); Kamoi et al. find no successful case with prompted self-feedback outside specially suited tasks and flag Self-Refine's weak first-draft prompts and Reflexion's ground-truth matching (F03-16, F03-17, F03-3).
- Reading: the two sides measure different things. Self-Refine's gains are on preference and constraint tasks where checking is easy; its math gain is near zero (F03-9). Reflexion's reasoning gains use the gold answer. Both sides agree once the feedback source is held fixed (M2).

**C2. Does reflective prompt evolution outperform RL?**
- Yes, under GEPA's conditions: Qwen3 8B, six tasks, small datasets, GRPO with LoRA at 24,000 rollouts; GEPA leads on five tasks and in aggregate (F03-61, F03-64).
- Not everywhere: GRPO wins AIME-2025 (F03-62); the headline average fell from 10% to 6% when math tasks were added (F03-63); on knowledge-heavy and personalization tasks GEPA did not improve the student while an RL-trained advisor did (F03-106, F03-107); direct RL beats an advisor on the same model (F03-108); at 32B scale RL-trained models score far above a text loop (F03-90).
- Reading: text optimization wins when the gap is missing instructions or task knowledge and data is scarce; weight updates win when the gap is reasoning skill or input-dependent behaviour. Whether a GRPO configuration tuned for 100-300 examples would change GEPA's comparison is open (U2).

**C3. Short prompts or long playbooks?**
- Short: GEPA's prompts are up to 9.2x shorter than MIPROv2's, and higher-scoring optimizers tend to produce shorter prompts; instructions show a lower generalization gap than few-shot demos (F03-67).
- Long: ACE names "brevity bias" as a failure, reports that monolithic rewriting collapses context, and beats GEPA by about 13 points on AppWorld with a growing playbook (F03-75, F03-76).
- Reading: ACE itself concedes HotPotQA prefers concise instructions and Game of 24 needs one rule (F03-80). Long playbooks pay off for tool-heavy, domain-rule-heavy tasks; short instructions for tasks where one strategy suffices. The benchmarks barely overlap (GEPA: HotpotQA, IFBench, HoVer, PUPA, math; ACE: AppWorld, FiNER, Formula), so neither paper settles it.

**C4. Can a text loop learn without labels?**
- Yes: ACE reports 57.2 on AppWorld without labels vs 59.4 with (F03-76); ReasoningBank works with a judge that is 72.7% accurate and is flat across 70-90% simulated judge accuracy (F03-31); Dynamic Cheatsheet uses no labels (F03-32).
- Only with a reliable signal: ACE and DC fall below baseline on online FiNER without labels (F03-77); Training-Free GRPO without ground truth keeps under a third of its AIME25 gain (F03-89: +1.0 vs +5.4); Dynamic Cheatsheet fails on small models whose memory fills with wrong strategies (F03-34); AWM online learns wrong workflows from wrong trajectories (F03-27).
- Reading: "label-free" in these papers usually means "execution feedback or a judge stands in for labels". Where neither exists, the loop drifts.

**C5. "Beats training-based methods" with different base models.**
- Claims: Memento beats RL-trained DeepResearcher (F03-82); Training-Free GRPO beats RL-trained ReTool and AFM (F03-90); CLIN beats DRRN, KG-A2C and CALM (F03-23).
- Each comparison mixes method with model scale or era: GPT-4.1 + o4-mini vs Qwen2.5-7B; DeepSeek-V3.1-Terminus vs Qwen2.5-32B; gpt-4 vs pre-LLM text-game agents. The same-model comparisons available (GEPA vs GRPO on Qwen3 8B, F03-61; advisor vs direct RL on Qwen2.5 7B, F03-108) give a more mixed picture.

**C6. GEPA's budget claim: README vs paper.**
- README at v0.1.4: "100-500 evaluations vs. 5,000-25,000+ for GRPO" (F03-73).
- Paper v2: 1,839 to 7,051 total rollouts per task vs 24,000, with 79 to 737 training rollouts (F03-61, F03-65).
- Reading: the README range resembles the training-rollout count, not the full budget including validation. Code-adjacent docs are orientation only; budget from the paper's totals.

**C7. Are failures useful memory?**
- No: ExpeL's insights built with reflections included drop HotpotQA from 39.0 to 29.0 (F03-20); AWM drops from 44.4 to 42.2 when failures are added (F03-30).
- Yes: ReasoningBank rises from 46.5 to 49.7 with failures (F03-30); Training-Free GRPO only writes lessons from groups that contain both winners and losers (F03-86).
- Reading: failures help when the update compares them with successes on the same task; free-floating reflections on failures add hallucinated causes.

## 6. UNKNOWN register

- **U1. GEPA's reflection model for the Qwen3 8B runs.** Appendix E.2 says all modules use the same model per system; the paper does not state, in the sections read, whether the reflection LM in Table 1 was Qwen3 8B itself or a stronger model. This matters for the "same model learns from itself" reading. Next step: check the paper's experiment config in the gepa repo or ask the authors.
- **U2. Would a small-data-tuned GRPO close the gap with GEPA?** GEPA's GRPO used fixed 24,000 rollouts, LoRA r=16, with "several values" of three hyperparameters explored manually (F03-64), on 111-300 training examples. No ablation of GRPO budget or data size was located in this research.
- **U3. Same-model, same-budget head-to-heads beyond GEPA and Advisor.** No paper read compares Reflexion, ExpeL, ACE, ReasoningBank, Dynamic Cheatsheet or Training-Free GRPO against RL on the same base model. Not located during this research; scoped to the papers read.
- **U4. SCoRe (Kumar et al. 2024, "Training language models to self-correct via reinforcement learning", arXiv 2409.12917).** Cited by Kamoi et al. as the RL route to self-correction (F03-16). Not yet read; likely the cleanest evidence that RL trains the ability prompting lacks.
- **U5. Long-run growth of append-only memories.** ReasoningBank consolidates by simple addition (F03-28); no study of memory size, retrieval quality or accuracy over thousands of tasks was located. ACE de-duplicates, but its long-horizon behaviour beyond the reported runs is not measured.
- **U6. AlphaEvolve vs deep RL numbers for scheduling.** The white paper says AlphaEvolve was chosen over a deep RL approach for "better performance" without publishing the RL figures (F03-97). Not located.
- **U7. Venues not confirmed from a primary source:** CLIN (possibly COLM 2024, unconfirmed), DSPy (possibly ICLR 2024, unconfirmed), AWM (ICML per Semantic Scholar, year unconfirmed), Dynamic Cheatsheet (EACL per Semantic Scholar), Voyager (TMLR per Semantic Scholar), APE (ICLR per Semantic Scholar), Reflexion and Self-Refine (NeurIPS 2023 per Semantic Scholar).
- **U8. OpenAI first-party docs on memory or skills.** Not yet read. Only Anthropic's docs and engineering blog were read (F03-40 to F03-42).
- **U9. TextGrad Nature version vs arXiv v1.** Located (Nature 639, 609-616, 2025) but not read; numbers in this file come from arXiv v1.
- **U10. ShinkaEvolve paper body.** Not yet read; only the abstract (F03-103). The 150-sample claim is unverified.
- **U11. FunSearch sample counts.** "Millions of LLM samples" comes from AlphaEvolve's Table 1 (F03-96), not from the FunSearch paper; not verified.
- **U12. Reflexion and ExpeL code.** Not inspected; all behaviour comes from the papers.
- **U13. How Training-Free GRPO derived $20,000 for ZeroTIR and SimpleTIR.** Only the ReTool $10,000 figure is explained (F03-91).
- **U14. MIPROv2's own rollout and cost accounting.** The only rollout counts used here (2,270 to 6,926) come from GEPA's setup (comparison table), not from the MIPROv2 paper.
- **U15. In-context RL (ICRL) line of work** (cited by Training-Free GRPO's related work): not yet read.
- **U16. Methods from the brief all read.** Every method in the brief's list of eleven was read at least at abstract-plus-results depth; ShinkaEvolve and OpenEvolve were covered at tag and config depth only.

## 7. Reading path for a newcomer

1. **Reflexion, arXiv 2303.11366v4.** The base pattern: a written lesson in memory, retried against a success signal. Read Sec. 3 for the actor/evaluator/reflector split and Sec. 4.2 for the detail that the HotPotQA signal is the gold answer. It sets up every later question about where the signal comes from.
2. **Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet", arXiv 2310.01798v2.** Tables 2 and 3 side by side are the shortest demonstration that the feedback signal, not the reflection, does the work. Read before trusting any self-improvement claim.
3. **GEPA, arXiv 2507.19457v2.** The most direct head-to-head with GRPO. Read Table 1 (including the AIME row), Appendix E.4 for the GRPO configuration and data sizes, and Sec. 3 for the reflective mutation and Pareto selection design.
4. **Advisor Models, arXiv 2510.02453v3.** The bridge: RL on a small model whose output is words for a frozen large one. Sec. 4.3 shows what a static prompt cannot learn; Sec. 4.4.3 is the same-model comparison with direct RL; Sec. 4.4.4 shows the limit.
5. **ACE, arXiv 2510.04618v3.** How to design the state and update rule of a long-lived playbook: delta updates, de-duplication, the context-collapse example, the label-free failure on FiNER, and the cost and caching analysis that a systems reader will want.

## 8. Source list by tier

### Tier 0 (our experiments)
- None in this file.

### Tier 1 (source code at pinned tag or SHA; official docs)
- stanfordnlp/dspy at 3.4.1 (099982b3c3eec9fc4ec4796d49915af42367a253): https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py ; https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/grpo.py ; https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/bettertogether.py ; https://github.com/stanfordnlp/dspy/blob/3.4.1/pyproject.toml . Accessed 2026-10-16.
- gepa-ai/gepa at v0.1.4 (8b0ce6cd99a234f6b74daf37558a2ac0ce18f975): https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py ; https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/acceptance.py ; https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/instruction_proposal.py ; https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/gepa_utils.py . Accessed 2026-10-16.
- algorithmicsuperintelligence/openevolve at v0.4.0 (f7b633986c0b3dbd0a171f6eb0cb0f0ba4fdfb0c): https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/config.py ; https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/evaluator.py ; https://github.com/algorithmicsuperintelligence/openevolve/blob/v0.4.0/openevolve/database.py . Accessed 2026-10-16.
- SakanaAI/ShinkaEvolve at v0.0.7 (c4568adde253cacf185be3a8412c3c2142761ebe): https://github.com/SakanaAI/ShinkaEvolve/tree/v0.0.7 . Tag pinned, not read. Accessed 2026-10-16.
- google-deepmind/funsearch at cc53f274237d7ab05c19df939edbc1f9616a7c19: https://github.com/google-deepmind/funsearch/tree/cc53f274237d7ab05c19df939edbc1f9616a7c19 . SHA pinned, not read. Accessed 2026-10-16.
- Anthropic, Agent Skills overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview . Accessed 2026-10-16.
- Anthropic, Memory tool: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool . Accessed 2026-10-16.

### Tier 2 (first-party lab or vendor posts)
- Anthropic Engineering, "Equipping agents for the real world with Agent Skills" (Oct 16, 2025): https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills . Accessed 2026-10-16.
- Databricks, "Building state-of-the-art enterprise agents 90x cheaper with automated prompt optimization" (September 24, 2025; authors include the GEPA, MIPROv2 and DSPy authors): https://www.databricks.com/blog/building-state-art-enterprise-agents-90x-cheaper-automated-prompt-optimization . Accessed 2026-10-16.

### Tier 3, peer-reviewed papers
- Shinn et al., Reflexion, NeurIPS 2023 [venue per Semantic Scholar]: https://arxiv.org/abs/2303.11366v4 . Accessed 2026-10-16.
- Madaan et al., Self-Refine, NeurIPS 2023 [venue per Semantic Scholar]: https://arxiv.org/abs/2303.17651v2 . Accessed 2026-10-16.
- Huang et al., Large Language Models Cannot Self-Correct Reasoning Yet, ICLR 2024: https://arxiv.org/abs/2310.01798v2 . Accessed 2026-10-16.
- Kamoi et al., When Can LLMs Actually Correct Their Own Mistakes?, TACL 2024: https://arxiv.org/abs/2406.01297v3 . Accessed 2026-10-16.
- Zhao et al., ExpeL, AAAI-24: https://arxiv.org/abs/2308.10144v3 . Accessed 2026-10-16.
- Wang et al., Agent Workflow Memory, ICML [venue per Semantic Scholar]: https://arxiv.org/abs/2409.07429v1 . Accessed 2026-10-16.
- Ouyang et al., ReasoningBank, ICLR 2026: https://arxiv.org/abs/2509.25140v2 . Accessed 2026-10-16.
- Suzgun et al., Dynamic Cheatsheet, EACL [venue per Semantic Scholar]: https://arxiv.org/abs/2504.07952v1 . Accessed 2026-10-16.
- Wang et al., Voyager, TMLR [venue per Semantic Scholar]: https://arxiv.org/abs/2305.16291v2 . Accessed 2026-10-16.
- Yuksekgonul et al., TextGrad, arXiv v1 read; journal version Nature 639, 609-616 (2025): https://arxiv.org/abs/2406.07496v1 ; https://www.nature.com/articles/s41586-025-08661-4 (located, not read). Accessed 2026-10-16.
- Pryzant et al., ProTeGi, EMNLP 2023: https://arxiv.org/abs/2305.03495v2 . Accessed 2026-10-16.
- Yang et al., OPRO, ICLR 2024: https://arxiv.org/abs/2309.03409v3 . Accessed 2026-10-16.
- Zhou et al., APE, ICLR [venue per Semantic Scholar]: https://arxiv.org/abs/2211.01910v2 . Accessed 2026-10-16.
- Opsahl-Ong et al., MIPROv2, EMNLP 2024: https://arxiv.org/abs/2406.11695v2 . Accessed 2026-10-16.
- Agrawal et al., GEPA, ICLR 2026 Oral: https://arxiv.org/abs/2507.19457v2 (and v1 for the version comparison, https://arxiv.org/abs/2507.19457v1). Accessed 2026-10-16.
- Soylu et al., BetterTogether, EMNLP 2024: https://arxiv.org/abs/2407.10930v2 . Accessed 2026-10-16.
- Zhang et al., ACE, ICLR 2026: https://arxiv.org/abs/2510.04618v3 . Accessed 2026-10-16.
- Xu et al., A-Mem, NeurIPS 2025: https://arxiv.org/abs/2502.12110v11 . Accessed 2026-10-16.
- Romera-Paredes et al., FunSearch, Nature 625, 468-475 (2024): https://doi.org/10.1038/s41586-023-06924-6 . Accessed 2026-10-16.
- Asawa et al., How to Train Your Advisor, ICML 2026: https://arxiv.org/abs/2510.02453v3 . Accessed 2026-10-16.

### Tier 3, preprints
- Majumder et al., CLIN: https://arxiv.org/abs/2310.10134v1 . Accessed 2026-10-16.
- Khattab et al., DSPy: https://arxiv.org/abs/2310.03714v1 . Accessed 2026-10-16.
- Memento: https://arxiv.org/abs/2508.16153v2 . Accessed 2026-10-16.
- Packer et al., MemGPT: https://arxiv.org/abs/2310.08560v2 . Accessed 2026-10-16.
- Cai et al., Training-Free GRPO (Tencent Youtu Lab): https://arxiv.org/abs/2510.08191v1 . Accessed 2026-10-16.
- Novikov et al., AlphaEvolve white paper: https://arxiv.org/abs/2506.13131v1 . Accessed 2026-10-16.
- ShinkaEvolve (abstract only): https://arxiv.org/abs/2509.19349v1 . Accessed 2026-10-16.

### Tier 3, in-repo docs and code comments (orientation only per the source-authority standard)
- gepa README at v0.1.4: https://github.com/gepa-ai/gepa/blob/v0.1.4/README.md . Accessed 2026-10-16.
- Docstrings and comments in DSPy `gepa.py`, DSPy `bettertogether.py`, gepa `acceptance.py`, OpenEvolve `config.py`, cited only alongside the code lines they annotate.

### Tier 4 (metadata and search, orientation only)
- Semantic Scholar Graph API batch lookup for venue metadata: https://api.semanticscholar.org/graph/v1/paper/batch . Accessed 2026-10-16.
- Web search used only to locate ReasoningBank's arXiv ID and the TextGrad Nature DOI; no claims taken from search summaries.
