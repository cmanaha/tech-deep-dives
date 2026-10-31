# fc06-words-b: fact check of sections 14, 15 and 16

Agent: fc06-words-b. Date: 2026-10-30. Files: `src/sections/PromptOptimization.tsx`,
`src/sections/YourLoops.tsx`, `src/sections/Hybrids.tsx`, and their claim lists
`revamp/claims/prompt-opt.md`, `your-loops.md`, `hybrids.md`.

Status: COMPLETE.

Sources re-opened for this check (all on 2026-10-30):
- Papers at the pinned arXiv version, PDF through `pdftotext`: GEPA 2507.19457v2, ProTeGi 2305.03495v2,
  TextGrad 2406.07496v1, OPRO 2309.03409v3, MIPRO 2406.11695v2, Revisiting OPRO 2405.10276v2, Advisor
  Models 2510.02453v3, Retroformer 2308.02151v3, Memento 2508.16153v2, Greedy Agents 2504.16078v1,
  EVOLvE 2410.06238v2, Context distillation 2209.15189v1, BetterTogether 2407.10930v2, AlphaEvolve
  2506.13131v1, Krishnamurthy et al. 2403.15371v3, MTOB 2309.16575v2. Venues from the arXiv export API
  comment and journal-ref fields, the PDF headers, and the OpenReview API where arXiv carries none.
- Code: gepa at v0.1.4 (resolves to 8b0ce6cd99a234f6b74daf37558a2ac0ce18f975), DSPy at 3.4.1 (resolves to
  099982b3c3eec9fc4ec4796d49915af42367a253), gepa-artifact at cbefbc1aa0f43dd39874ec4bf42211365dbda42e,
  karpathy/autoresearch at 228791fb499afffb54b46200aca536f79142f117, TRL `trl/trainer/grpo_trainer.py`
  at v1.16.0. Every cited line range was re-read.
- Web: FunSearch Nature article (s41586-023-06924-6, published 14 December 2023), ghuntley.com/ralph
  (published 2025-07-14, modified 2026-02-19), Amazon Bedrock prompt-caching user guide.

## PromptOptimization.tsx (section 14)

Claims checked: 77. CONFIRMED 73, UNSUPPORTED 1, WRONG 1, OVERREACH 2.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| P1 | GRPO "trained rank-16 LoRA adapters for 500 steps, a fixed 24,000 rollouts", cited only to gepa-artifact config lines | PromptOptimization.tsx:573-581 | UNSUPPORTED (at the cited source) | https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/scripts/experiment_configs.py#L11-L31 carries `"lora": True`, L159 `num_train_steps=500`; neither carries rank 16 or 24,000. Both are in https://arxiv.org/abs/2507.19457v2 App. E.4 ("rank dimension 16", "500 training steps, amounting to fixed 24,000 rollouts") | Added `GEPA, Appendix E.4` cite to the sentence |
| P2 | gepa README "35x faster than RL" cited as Tier 3 | PromptOptimization.tsx:622-628 | WRONG (tier) | The README is the project's own first-party material (https://github.com/gepa-ai/gepa/blob/v0.1.4/README.md#L42); Cite.tsx L17 puts first-party lab or vendor claims at Tier 2, and section 15 cites the autoresearch README at Tier 2 | `tier={2}`, `kind="vendor-claim"` kept |
| P3 | "OPRO worked poorly with LLaMa-2 and Mistral 7B as optimisers" | PromptOptimization.tsx:809-811 | OVERREACH | https://arxiv.org/abs/2405.10276v2 abstract: "OPRO shows limited effectiveness in small-scale LLMs" | Reworded to "OPRO showed limited effectiveness with" |
| P4 | "so the optimiser's capability bounds a text loop without a fixed size threshold" stated as fact | PromptOptimization.tsx:815-818 | OVERREACH (inference unlabelled) | Inference from two studies (Revisiting OPRO abstract; GEPA 8B self-reflection per wave2-words G1); no source states it | Labelled "in our reading" |

Known items, settled:
- The gepa-artifact GRPO arm is DSPy GRPO with LoRA on all six tasks: CONFIRMED. `get_optimizers()` returns one
  `GRPO` config (`from dspy.teleprompt.grpo import GRPO`, experiment_configs.py L71, L152-L171) and
  `get_benchmarks()` includes AIME and LiveBench-Math (L55-L66); `TRAIN_KWARGS_GRPO_DEFAULT` sets `"lora": True`
  (L26). A paper-versus-code point worth recording: GEPA App. E.4 says single-module systems "(e.g., figure 11)"
  used SkyRL's GRPO with full fine-tuning, while AIME and LiveBench-Math are single-module ChainOfThought programs
  (App. E.1). Table 1's 24,000 for those two tasks equals 500 steps x 48 (the DSPy LoRA config), and the code
  applies DSPy GRPO to them, so the page's reading follows the code. No page change.
- AIME feedback includes the worked solution: CONFIRMED.
  https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/benchmarks/AIME/__init__.py#L16-L39
  appends "Here's the full step-by-step solution" when `solution` is present; AIME_data.py L8-L16 loads it from
  `AI-MO/aimo-validation-aime`. run_experiments.py L278-L289 wires `metric_with_feedback` into GEPA by default.
- Reflection model defaults to the task model: CONFIRMED (gepa-artifact gepa.py L541 `instruction_lm=self.teacher_lm
  or dspy.dsp.utils.settings.lm or ...`; run_experiments.py L373-L374 configures the task LM; no `teacher_lm` in
  any experiment config).

Also confirmed, among others: every Table 1 figure (all 28 cells and the six budgets, average 3,936), 19.0 and
13.66 margins, GEPA+Merge 52.40, Table 2 GEPA-Qwen-Opt +9.00, Table 3 +12.44 / +6.05 / +5.11 with BeamSearch
N=4 "used by APO" (ProTeGi's own beam size is b = 4), Figure 6 stall after one iteration, 9.2x shorter prompts,
$86 GEPA cost (App. E.3), 10.15% budget match, 79 to 737 training rollouts, 678 rollouts on IFBench, 45 to 150
training examples, the three tuned GRPO settings, the MIPRO expansion and both Lesson 3 quotes, OPRO 80.2 / 71.8,
TextGrad 36 examples and 72.9 to 81.1, all gepa v0.1.4 lines (api.py L66, L68, L97-L98, L142, L220-L221,
L350-L351; acceptance.py L44-L53; instruction_proposal.py L13-L29; engine.py L516-L517; state.py L486-L510;
gepa_utils.py L90-L117 with `is_dominated` matching the page's pruning rule), all DSPy 3.4.1 lines
(mipro_optimizer_v2.py L60, grpo.py L26, gepa.py L57-L65, L262-L264, L417, L462). Venues: GEPA ICLR 2026 (Oral),
ProTeGi EMNLP 2023, OPRO ICLR 2024, MIPRO EMNLP 2024, Revisiting OPRO ACL Findings 2024, Advisor Models ICML 2026
(arXiv comments or journal-ref); TextGrad Nature 2025 follows section 11's convention. The GEPA loop diagram's
pruning example (C best only where A is best; A and B sampled 3 to 1) matches `remove_dominated_programs`.

Score: 9/10. Every number matches Table 1 and the pinned code, the strongest number lands three times and the
section ends on the reader's next run. Held off 10 only by the length of the evidence-heavy middle blocks.

## YourLoops.tsx (section 15)

Claims checked: 52. CONFIRMED 51, UNSUPPORTED 1.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| Y1 | "a pretrained code model with no fine-tuning writes new versions of one function", cited to FunSearch Methods (Distributed system) only | YourLoops.tsx:545-550 | UNSUPPORTED (at the cited location) | https://www.nature.com/articles/s41586-023-06924-6: "without any fine-tuning on our problems" sits in the main-text Pretrained LLM subsection; Methods (Distributed system) carries only the quoted "Programs that are correct are sent to the programs database to be stored" | Cite label widened to "FunSearch, Pretrained LLM and Methods (Distributed system)" |

Known item, settled: the search-loop column has no "missing" mark by design: CONFIRMED consistent. The h2
description says the empty part is "nothing in the search loops, which pay in samples instead", and the diagram
marks their policy cell "COSTLY: PAID IN SAMPLES".

Also confirmed: autoresearch program.md L14, L23-L33, L37, L66-L104, L106-L112, L114 ("about 100 over the duration
of the average human sleep"); README.md L17 and L64; prepare.py L31 `TIME_BUDGET = 300`; train.py L458-L459 seed
42, L516-L526 and L555-L556 time-based schedule, L578-L579 and L603-L604 wall-clock stop after step 10 (so two
runs need not take the same number of steps: our reading holds). FunSearch Pretrained LLM "on the order of
10^6", Distributed approach "for some problems we run several experiments", Programs database quotes and the
worst-half island reset, Methods equation (1), Discussion "works best" quote; AlphaEvolve Figure 2 caption,
Sec 2.4 cascade, Sec 2.5 quote and island models, Table 1 entries; every Ralph quote, the loop one-liner and the
"tuned - like a guitar" sentence (plain hyphen in the source); Krishnamurthy et al. abstract (NeurIPS 2024 per
arXiv comments); Bedrock implicit caching quotes. Section 10's four grader checks match RewardIsAProxy.tsx
L927-L972.

Score: 9/10. Every autoresearch line range holds at the SHA and the hedges keep their scope; the 100-a-night
figure lands four times and the section ends on the reader's next overnight run.

## Hybrids.tsx (section 16)

Claims checked: 47. CONFIRMED 41, WRONG 2, OVERREACH 2, UNSUPPORTED 1, STALE 1.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| H1 | MTOB expanded as "Machine Translation with One Book" | Hybrids.tsx:400-405 | WRONG | https://arxiv.org/abs/2309.16575v2 abstract: "MTOB (Machine Translation from One Book)". The Advisor paper (Sec 4) writes "with One Book"; the benchmark's own name governs. ICLR 2024 spotlight per OpenReview note tbVWug9f2h (the arXiv v2 PDF header still reads "Preprint. Under review.") | Expansion corrected to "from One Book" and a Tier 3 cite to the MTOB abstract added with venue ICLR 2024 |
| H2 | "the student is already 'maxed-out' on math problem solving" | Hybrids.tsx:498-499 | OVERREACH (quote moved to another subject) | https://arxiv.org/abs/2510.02453v3 Figure 10 caption: "frontier models are 'maxed-out' on math problem solving" | Reworded to "frontier models are already 'maxed-out'" |
| H3 | Advice is "appended to whatever the student would normally receive" (stated for every design) | Hybrids.tsx:608-610 | OVERREACH (scope widened) | 2510.02453v3 Sec 3: "appended to any information usually provided to the student" is said of the multi-turn design; the basic design injects advice "in-context" | Narrowed: injected into the student's context; appended in the multi-turn design |
| H4 | Memento quoted as "with the LLM component fixed" | Hybrids.tsx:535 | WRONG (misquote) | https://arxiv.org/abs/2508.16153v2 Sec 3: "with the LLM component p_LLM fixed"; the quote marks dropped a symbol | Paraphrased without quote marks: "while the LLM component stays fixed" |
| H5 | Distillation "let smaller models explore better than larger ones", cited to EVOLvE abstract only | Hybrids.tsx:552-557 | UNSUPPORTED (at the cited location, minor) | https://arxiv.org/abs/2410.06238v2 abstract credits "these techniques" (inference-time support and distillation together); Sec 4 intro and 4.2 credit algorithm distillation specifically | Cite label widened to "EVOLvE, abstract and Section 4" |
| H6 | Greedy Agents (Schmied et al.) badge "preprint" | Hybrids.tsx:549 | STALE | OpenReview note weUP6H5Ko9: "ICLR 2026 Poster"; fc07 confirmed it at iclr.cc (virtual 2026 poster 10006711) and section 17 badges it ICLR 2026 | Badge set to ICLR 2026 |

Known items, settled: MTOB is "Machine Translation from One Book" (H1, fixed). Greedy Agents is ICLR 2026 (H6,
fixed; the only badge of that paper in fc06's files). The fc05 venues (SCoRe ICLR 2025, Lost in the Middle TACL
2024) do not appear in sections 14 to 16.

Also confirmed: Advisor Models abstract, Sec 3 (basic, 3-step and multi-turn designs; GRPO "based only on observed
rewards"; one-step integration; no gradient access), Figure 2 caption (API access only; advice before and after
training), Sec 4 (32,000 calls, "thousands of dollars"; chrF; RuleArena 0/1; judges GPT-5 mini and GPT-4.1 mini),
Sec 4.3 and 4.3.1 (three personalisation domains; PAG and GEPA quote; 0.94, 99.6%, 0.948; contact with the GEPA
authors), Sec 4.4.3 and Figure 9 (31.17, 38.98, 42.38; "remains the better option"; "most of the improvement over
baseline"; 3B advisor, 7B student, 20 epochs), Sec 4.4.4 (quote; MATH-500, one domain, no significant
improvement), App. A (SkyRL fork, one 8xH100 node), App. D.4 and Figure 14 (curve shapes; both still climbing);
the arithmetic 7.81 / 11.21 = 0.697. Retroformer v3 (ICLR 2024 header): Sec 3 "part of the environment" and "all
the popular RL algorithms apply", Figure 1 quote, Sec 4 and 4.2 (frozen actor, smaller local reflector, PPO,
return differences between consecutive trials). Greedy Agents Sec 4.3 (RLFT lowers regret for 2B and 9B; 2B
narrows the gap to UCB; coverage stays sub-optimal). Context distillation and BetterTogether abstracts (BetterTogether
EMNLP 2024, EVOLvE ICML 2025 per arXiv comments). TRL v1.16.0 grpo_trainer.py L177-L191 (docstring: prompts,
completions, extra columns; sync or async), L1579-L1661 (kwargs from dataset columns; one reward per completion
enforced; async functions gathered), L2229-L2247 (non-conversational completions decoded to strings). The reward
sketch is consistent with that contract and is labelled "Illustrative, not run".

Score: 9/10. After the fixes every figure matches the paper, the derived 70% is labelled ours each time it lands,
and the section ends on what to measure next. Held off 10 by the "same split, elsewhere" block, which reads more
as a catalogue than as part of the argument.

## Diagrams

No correction touched a diagram, so the harness was not run. The three diagrams were read in source: their
numbers and labels match the cited claims.

## Checks (run after the last edit)

- `pnpm --filter @tech-deep-dives/rl-agentic-loops typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/rl-agentic-loops lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- `pnpm --filter @tech-deep-dives/rl-agentic-loops test`: `Test Files  2 passed (2)`, `Tests  26 passed (26)`.
- `bash scripts/gates/no-ai-tells.sh`: `[PASS] no-ai-tells: no AI tells in 5 opted-in deep dive(s)`.
- `bash scripts/gates/pinned-refs.sh`: `[PASS] pinned-refs: all GitHub references pinned across 375 file(s) (5 src, 5 research)`.
- `bash scripts/gates/svg-a11y.sh`: `[PASS] svg-a11y: all inline <svg> accessible across 132 file(s) in 5 opted-in deep dive(s)`.
- `bash scripts/gates/pre-overflow.sh`: `[PASS] pre-overflow: every <pre> can scroll across 5 opted-in deep dive(s)`.

## Items for the orchestrator

1. `GlossaryAndSources.tsx` L106: the Greedy Agents source entry still reads "preprint". OpenReview note
   weUP6H5Ko9 lists it as an ICLR 2026 Poster, and sections 16 and 17 now badge it ICLR 2026.
2. `GlossaryAndSources.tsx` sources list (and `sources.md`): section 16 now cites the MTOB benchmark paper,
   Tanzer et al., "A Benchmark for Learning to Translate a New Language from One Grammar Book",
   https://arxiv.org/abs/2309.16575v2, Tier 3, ICLR 2024 (OpenReview tbVWug9f2h). Add it to the appendix.
3. Register 03 row F03-73: the gepa README is a first-party project claim, so Tier 2 with a vendor-claim marker,
   not Tier 3 (section 14 changed accordingly).
4. Register note for the GEPA GRPO baseline (F03-64 / wave2-words): GEPA App. E.4 says single-module systems used
   SkyRL's GRPO "(e.g., figure 11)", but the artifact at cbefbc1a runs DSPy GRPO with LoRA on all six tasks,
   AIME and LiveBench-Math included, and Table 1's 24,000 rollouts match that config. Code governs; the page follows it.
5. Register F03-106 / wave2-words row 15 (if they carry the expansion): the Advisor paper writes "Machine
   Translation with One Book"; the benchmark's name is "from One Book".
