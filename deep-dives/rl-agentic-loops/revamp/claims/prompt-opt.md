# Claims: section 14, Optimising the Prompt (`src/sections/PromptOptimization.tsx`)

Authored 2026-10-30. Every source below was re-opened on 2026-10-30: arXiv papers at the pinned version (GEPA and Advisor Models as arXiv HTML, the others as PDF via `pdftotext -layout`, venues from the arXiv export API comments or journal-ref field); gepa at tag v0.1.4 (resolves to 8b0ce6cd99a234f6b74daf37558a2ac0ce18f975), DSPy at tag 3.4.1 (resolves to 099982b3c3eec9fc4ec4796d49915af42367a253) and gepa-artifact at SHA cbefbc1aa0f43dd39874ec4bf42211365dbda42e, each file fetched raw and the cited lines re-read. Format: `claim | source URL | register or wave 2 row`.

## Intro
- Prompt optimisation keeps weights frozen and changes only prompts | https://arxiv.org/abs/2507.19457v2 (Sec 3: "GEPA evolves only the set of prompts ... the underlying LLM weights ... remains fixed") | F03-59
- Strongest number, landing 1: Qwen3 8B, six tasks, GEPA 54.85 vs LoRA GRPO 48.91 vs base 45.23; GEPA 1,839 to 7,051 rollouts vs GRPO 24,000 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61, F04-46; wave2-words rows 1, 2
- "strongest same-model comparison with RL located in this research" | scope wording, hedge kept | wave2-words row 10
- GRPO samples a group of answers per prompt and pushes toward better-than-average ones (gloss) | definition, as in section 7 | F01/F02 GRPO rows (gloss only)
- GEPA venue ICLR 2026 (Oral) | https://arxiv.org/abs/2507.19457v2 (arXiv comments) | F03-59

## Four ways to write a better prompt
- ProTeGi expansion; arXiv listing names it Automatic Prompt Optimization | https://arxiv.org/abs/2305.03495v2 (PDF p. 1; arXiv abstract) | wave2-words row 36, G6
- ProTeGi: minibatch errors -> LLM criticism -> edit "in the opposite semantic direction"; beam search with bandit selection | https://arxiv.org/abs/2305.03495v2 (abstract, Sec 2) | F03-48
- ProTeGi venue EMNLP 2023 | arXiv comments | F03-48
- TextGrad "backpropagates textual feedback provided by LLMs"; gradient called a metaphor | https://arxiv.org/abs/2406.07496v1 (abstract, Sec 1) | F03-43, F04-57; wave2-words row 34
- TextGrad prompt run: gpt-4o critiques for gpt-3.5-turbo-0125, 36 training examples (batch 3 x 12 iterations), GSM8K 72.9 -> 81.1 | https://arxiv.org/abs/2406.07496v1 (Sec 3.3, Table 3) | F03-46
- TextGrad: pay a fixed cost once, serve the cheaper model (paraphrase) | https://arxiv.org/abs/2406.07496v1 (Sec 3.3) | F03-46
- TextGrad venue rendered "Nature 2025" with the arXiv v1 link, matching section 11's convention | register F03-43 (journal version Nature 639, not read: U9 open) | F03-43
- OPRO expansion; meta-prompt holds earlier solutions with their values, new ones scored and added | https://arxiv.org/abs/2309.03409v3 (abstract, Sec 2) | F03-51, F04-56; wave2-words row 37
- OPRO best GSM8K instruction "Take a deep breath and work on this problem step-by-step." 80.2 vs 71.8 for "Let's think step by step." (PaLM 2-L scorer) | https://arxiv.org/abs/2309.03409v3 (Table 1) | F03-52
- OPRO signal is training-set accuracy, a number per instruction | https://arxiv.org/abs/2309.03409v3 (Sec 5.1) | F03-53
- OPRO venue ICLR 2024 | arXiv comments | F03-51
- MIPROv2 is DSPy's implementation of MIPRO; `class MIPROv2(Teleprompter)` | https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/mipro_optimizer_v2.py#L60 | wave2-words row 38, G6; F03-58
- MIPRO expansion "Multi-prompt Instruction PRoposal Optimizer" | https://arxiv.org/abs/2406.11695v2 (Sec 3) | wave2-words row 38
- MIPRO proposes instructions and demonstrations per module; surrogate model learned from minibatch evaluations | https://arxiv.org/abs/2406.11695v2 (abstract, Sec 3) | F03-56; wave2-words row 39
- MIPRO assigns credit across modules by statistics (our gloss of the surrogate's role) | https://arxiv.org/abs/2406.11695v2 (abstract: "navigate credit assignment across modules") | F03-56
- MIPRO venue EMNLP 2024 | arXiv comments | F03-56
- DSPy treats prompts of an LM program as parameters compiled against a metric (definition, uncited on page) | https://arxiv.org/abs/2310.03714v1 (abstract) | F03-55
- GEPA: evaluator returns feedback with the score; reflection model reads traces and feedback; parents drawn from a Pareto front | https://arxiv.org/abs/2507.19457v2 (Sec 3, 3.1) | F03-59, F03-60
- DSPy 3.4.1 ships GEPA, MIPROv2 and GRPO side by side (prompt space or weight space by swapping the optimiser) | https://github.com/stanfordnlp/dspy/tree/3.4.1/dspy/teleprompt ; https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/grpo.py#L26 | F03-58

## GEPA against GRPO on one model
- Six tasks and their glosses (HotpotQA, HoVer, IFBench, PUPA, AIME-2025, LiveBench-Math) | https://arxiv.org/abs/2507.19457v2 (Sec 4, App. E.1) | F03-61
- Every module of each program ran on the same model | https://arxiv.org/abs/2507.19457v2 (App. E.2) | wave2-words G1
- GRPO arm ran through DSPy's GRPO optimiser, LoRA (`"lora": True`), beta 0.01, lr 1e-5, max_grad_norm 0.1, 500 steps, group 12 | https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/scripts/experiment_configs.py#L11-L31 and #L152-L171 | beyond the register (read at pinned SHA); consistent with F03-64
- GRPO rank-16 LoRA, 500 steps, fixed 24,000 rollouts | https://arxiv.org/abs/2507.19457v2 (App. E.4) | F03-64
- GEPA budget capped per task at MIPROv2's spend | https://arxiv.org/abs/2507.19457v2 (App. E.4) | wave2-words row 2
- Reflection model in the Qwen3 8B runs was Qwen3 8B itself; both arms used one model | https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/gepa/gepa.py#L540-L546 ; .../scripts/run_experiments.py#L373-L374 | wave2-words G1, row 10; U5 closed
- Per-task table: base, GRPO, GEPA and GEPA budgets (6,871 / 3,593 / 7,051 / 2,426 / 1,839 / 1,839; average 3,936) | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61; wave2-words rows 1, 2
- Strongest number, landing 2: 54.85 vs 48.91 vs 45.23, 1,839 to 7,051 vs 24,000 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61
- Largest margins: 19.0 points on HotpotQA, 13.66 on HoVer | https://arxiv.org/abs/2507.19457v2 (Table 1; Observation 1) | F03-61, F03-62
- GRPO won AIME-2025 38.00 vs 32.00; within a point on LiveBench-Math 51.95 vs 51.26 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-62; wave2-words row 4
- Full-parameter GRPO on one task, a 2-hop HoVer program, showed a similar gap | https://arxiv.org/abs/2507.19457v2 (App. E.1; Figure 11; Sec 4 footnote 1) | wave2-words row 3
- 45 to 150 training examples per task (AIME 45 is our arithmetic: 90 problems split equally train/val) | https://arxiv.org/abs/2507.19457v2 (App. E.1) | F03-64 [derived for AIME]
- GRPO tuning limited to learning rate, beta, gradient clipping | https://arxiv.org/abs/2507.19457v2 (App. E.4: "We manually explore several values for [LR, beta, norm clipping]") | wave2-words G3
- U6 hedge: no re-run with a GRPO tuned for 100 to 300 examples located during this research | RESEARCH-GUIDE U6 (accept-as-hedge) | wave2-words G3
- KL gloss (beta weights the KL penalty keeping the model near the original) | definition | section 5 terms

### Expandable: which budget to quote
- README: "35x faster than RL", "100-500 evaluations vs. 5,000-25,000+ for GRPO" (hyphens normalised) | https://github.com/gepa-ai/gepa/blob/v0.1.4/README.md#L42 | F03-73; wave2-words row 8 (cited Tier 3 per register, marked vendor-claim)
- Most of GEPA's budget is validation, "utilized solely for candidate selection and not for producing learning signals" | https://arxiv.org/abs/2507.19457v2 (Observation 1) | F03-65
- 79 to 737 training rollouts to reach best result | https://arxiv.org/abs/2507.19457v2 (Observation 1) | F03-65; wave2-words row 8
- IFBench best prompt after 678 rollouts; 24,000 / 678 = 35.4 (our arithmetic) | https://arxiv.org/abs/2507.19457v2 (Table 1 caption) | F03-65 [derived]
- Quote total rollouts incl. validation: 1,839 to 7,051 vs 24,000 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-73; SCOPE section 14
- Budgets matched to MIPROv2 within 10.15% | https://arxiv.org/abs/2507.19457v2 (App. E.4) | wave2-words row 2 (beyond its quote, same passage)
- Artifact caps per benchmark equal Table 1's GEPA budgets | https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/scripts/experiment_configs.py#L188-L196 | wave2-words row 2

## How GEPA decides what to keep
- Diagram: six steps; minibatch of 3 training examples by default; strict acceptance; validation scoring; Pareto front over the validation set (grid illustrative, captioned) | gepa v0.1.4 files below | wave2-words rows 5, 6
- Evaluation trace example "compiler error messages before giving reward 0" | https://arxiv.org/abs/2507.19457v2 (Sec 3) | F03-60
- Feedback functions: documents still missing per hop (HotpotQA, HoVer), constraints satisfied and failed (IFBench), score breakdown into quality and PII leakage (PUPA) | https://arxiv.org/abs/2507.19457v2 (App. E.1) | F03-60 (beyond the register quote)
- DSPy metric returns score plus feedback; without feedback GEPA uses "This trajectory got a score of {score}." | https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py#L57-L65 | beyond the register (read at tag)
- Modules rewritten in turn (round_robin default) | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py#L66 | F03-59
- Default reflection prompt: "Identify all niche and domain specific factual information about the task and include it in the instruction" | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/instruction_proposal.py#L13-L29 | F03-72
- Credit assignment by reading the trace | https://arxiv.org/abs/2507.19457v2 (Sec 3: "implicit credit assignment") | F03-59
- Child re-run on the same minibatch; kept only if score sum strictly greater; tie rejected; default "strict_improvement" | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/acceptance.py#L44-L53 ; .../src/gepa/api.py#L97-L98 ; proposal built with subsample_scores_before/after on one minibatch (reflective_mutation.py L618-L623, read, not cited on page) | F03-72; wave2-words row 5
- Minibatch default 3 | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py#L350-L351 | F03-70 (DSPy default 3, same value)
- Greedy hill-climbing on a three-example estimate that can rise by chance; validation set as the check (our reading of the code) | our reading | -
- Kept child scored on full validation set | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/core/engine.py#L516-L517 | wave2-words row 6 (beyond its quote)
- Per validation example: top score and every candidate reaching it (strictly better replaces, ties added) | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/core/state.py#L486-L510 | wave2-words row 6 (beyond its quote)
- Dominated candidates pruned; survivors sampled in proportion to examples led | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/gepa_utils.py#L90-L117 | wave2-words row 6; F03-72
- `valset` used for Pareto scores; falls back to trainset when absent | https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py#L142 and #L220-L221 | wave2-words row 6
- A lower-average candidate survives if best on any one example | https://arxiv.org/abs/2507.19457v2 (Sec 3.1) + gepa_utils.py L90-L117 | F03-66
- Pareto selection +12.44 vs +6.05 SelectBestCandidate vs +5.11 BeamSearch (N=4), four Qwen3 8B tasks; beam is the selection ProTeGi (APO) uses; best-only stalled after one improvement | https://arxiv.org/abs/2507.19457v2 (Observation 3, Table 3, Figure 6) | F03-66

## What one prompt can hold
- Mental model: smallest state, one instruction set scored on a validation set, learns what every input shares | SCOPE section 14 mental model; register M4 | F03-72 (support)
- Qwen3 8B-optimised prompts lifted GPT-4.1 Mini by +9.00 aggregate | https://arxiv.org/abs/2507.19457v2 (Table 2, Observation 6) | F03-67
- GEPA prompts up to 9.2x shorter than MIPROv2's, which carry few-shot demonstrations; shorter prompts cost less per call (providers meter input tokens) | https://arxiv.org/abs/2507.19457v2 (Observation 4) | F03-67, F04-46; wave2-words row 7
- Static prompt is one policy for every input; hidden per-instance variable needs weights (section 16) | SCOPE section 14 limit; register M4 | F03-107
- Personalisation: GEPA "marginally above the un-optimized baselines, if at all"; 7B advisor trained with RL learned the preferences (student GPT-4o mini, advisor Qwen2.5 7B Instruct) | https://arxiv.org/abs/2510.02453v3 (Sec 4.3.1, Figure 5) | F03-107; wave2-words row 16
- Advisor Models venue ICML 2026 | arXiv comments; register 03 | F03-104
- AIME feedback in the reproduction code: right/wrong, the correct answer, and the full worked solution where the dataset has one; GEPA runs use metric_with_feedback by default (run_experiments.py L278-L297, read, not cited) | https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/benchmarks/AIME/__init__.py#L16-L39 ; .../AIME/AIME_data.py#L8-L16 | beyond the registers (read at pinned SHA)
- AIME-2025: base 27.33, GEPA 32.00, GRPO 38.00 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61, F03-62
- "an instruction carries what a model can be told ... here the weight update won" (our reading) | our reading; register F03-62 use and M3 | F03-62
- OPRO poor with LLaMa-2 and Mistral 7B as optimisers, "limited inference capabilities constraining optimization ability" | https://arxiv.org/abs/2405.10276v2 (abstract) | F04-53; wave2-words row 40
- Revisiting OPRO venue ACL Findings 2024 | arXiv journal-ref | wave2-words row 40, G5
- GEPA's Qwen3 8B results came from the 8B model reflecting on its own traces; no fixed size threshold | wave2-words G1 | wave2-words row 40
- DSPy GEPA wrapper requires a reflection LM (unless a custom proposer) and recommends a strong one | https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py#L262-L264 (assert at L462) | F03-70
- U12 hedge: target-size scaling, optimiser fixed, not measured in any study located | RESEARCH-GUIDE U12 (accept-as-hedge) | wave2-limits G8

## When to start here, and what to feed the optimiser
- When-to-try conditions (our reading of these studies) | our reading | M3, M4, C2
- MIPRO Lesson 3: "tasks with conditional rules that are (i) not immediately obvious to the LM and (ii) not expressible via a limited number of few-shot examples" | https://arxiv.org/abs/2406.11695v2 (Sec 6, Lesson 3) | F03-57
- GEPA's widest margins on the two retrieval programs | Table 1 (as above) | F03-61
- 45 to 150 training examples | App. E.1 (as above) | F03-64 [derived for AIME]
- GPT-4.1 Mini compared only against prompt optimisers (Table 2 has no GRPO row); GEPA cost $86 total | https://arxiv.org/abs/2507.19457v2 (Table 2; App. E.3) | F03-67
- Pointers: section 16 (Hybrids), section 20 (Cost per Improvement) | navigation | -
- Return text with every score; without it the reflector reads only the score | DSPy gepa.py L57-L65 (as above) | beyond the register
- Module-specific feedback (after each hop) and human graders' explanations as feedback | https://arxiv.org/abs/2507.19457v2 (Sec 3) | F03-60
- Seed prompt: optimisers "not yet able to infer all task rules" | https://arxiv.org/abs/2406.11695v2 (Sec 6, Lesson 3) | F03-57 (beyond the register quote)
- Without a validation set GEPA scores the Pareto front on the training examples | gepa api.py L220-L221 (as above) | wave2-words row 6
- Smaller validation set is the lever the authors name | https://arxiv.org/abs/2507.19457v2 (Observation 1) | F03-65
- Strongest number, landing 3: 1,839 to 7,051 rollouts for 54.85 vs 24,000 for 48.91 | Table 1 (as above) | F03-61
- Merge default: DSPy `use_merge=True`, `gepa.optimize` `use_merge=False`; merge lowered Qwen3 8B aggregate 54.85 -> 52.40 | https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py#L417 ; https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py#L68 ; Table 1 | F03-71

## Acronyms expanded in the file
RL, GEPA, GRPO, LoRA, ProTeGi (plus the APO listing name, written out), OPRO, MIPRO/MIPROv2, KL. Benchmarks glossed: GSM8K, HotpotQA, HoVer, IFBench, PUPA, AIME-2025, LiveBench-Math. Names, not acronyms: DSPy, TextGrad, PaLM 2-L.
