# Claims: section 12, Verbal Reinforcement & Self-Correction (`src/sections/VerbalReinforcement.tsx`)

Authored 2026-10-30. Every arXiv source below was re-fetched at the pinned version on 2026-10-30 (PDF via `https://arxiv.org/pdf/<id>`, text extracted with `pdftotext -layout`) and the cited passage re-read; venues from the PDF running header, the arXiv comments field (export API), or wave2-words G5. Format: `claim | source URL | register or wave 2 row`.

## Intro
- Reflexion reinforces a language agent through written (linguistic) feedback instead of weight updates | https://arxiv.org/abs/2303.11366v4 (abstract: "not by updating weights, but instead through linguistic feedback") | F03-1
- Reflexion venue NeurIPS 2023 | https://papers.nips.cc/paper_files/paper/2023 (proceedings index) | wave2-words G5
- Strongest number, landing 1: 50 hardest HumanEval Rust problems, GPT-4, loop without unit tests 0.52 vs 0.60 with no loop | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21, F03-5; wave2-limits row 3; wave2-rlvr row 52

## The Reflexion loop
- Three roles (Actor, Evaluator, Self-Reflection); actor and reflector are LLMs, the evaluator is exact match, a heuristic or an LLM (fc05 fix from 'each an LLM') | https://arxiv.org/abs/2303.11366v4 (Sec 3) | F03-1 (beyond the register quote; read at the pinned version)
- Evaluator reward is a binary success status or a scalar score | https://arxiv.org/abs/2303.11366v4 (Sec 3, "Self-reflection" and "The Reflexion process") | F03-1
- Memory bounded at Omega "usually set to 1-3" to adhere to max context limits | https://arxiv.org/abs/2303.11366v4 (Sec 3, Memory) | F03-1, F04-20; wave2-words row 19
- Loop runs until the evaluator passes the attempt or the trial limit | https://arxiv.org/abs/2303.11366v4 (Sec 3; Algorithm 1) | F03-1
- Memory is a sliding window with maximum capacity (oldest lesson drops out; diagram label) | https://arxiv.org/abs/2303.11366v4 (Sec 5 Limitations: "we limit long-term memory to a sliding window with maximum capacity") | F03-1 (beyond the register quote)
- Policy = "an agent's memory encoding paired with a choice of LLM parameters" | https://arxiv.org/abs/2303.11366v4 (Sec 1 contributions) | F03-2, F04-54; wave2-words row 18
- Reflector infers which earlier action led to failure and states the alternative (credit assignment in words) | https://arxiv.org/abs/2303.11366v4 (Sec 3, Self-reflection) | F03-1 (beyond the register quote)
- HotPotQA signal: exact-match grading against the gold answer, binary success signal | https://arxiv.org/abs/2303.11366v4 (Sec 4.2) | F03-3; wave2-words row 20
- Signal split: HotPotQA exact match = output-evaluated; self-written unit tests = execution-grounded; glosses per the survey | https://arxiv.org/abs/2512.16301v3 (gloss); wave 2 note | wave2-words row 35 (note for section 12)
- Programming: up to six self-generated unit tests, run against the code | https://arxiv.org/abs/2303.11366v4 (Sec 4.3: "We set n to a maximum of 6 unit tests") | F03-4 (beyond the register quote)
- ALFWorld evaluator: hand-written heuristic or an LLM (GPT) binary classifier | https://arxiv.org/abs/2303.11366v4 (Sec 4.1, Figure 3 caption) | register 03 comparison table row "Reflexion" (F03-1 to F03-7)
- Memory size 3 on HotPotQA, 1 on programming | https://arxiv.org/abs/2303.11366v4 (Sec 4.2 "memory size of 3 experiences"; Sec 4.3 "max memory limit of 1 experience") | F03-1 (beyond the register quote)
- Gains measured across retries of the same tasks | https://arxiv.org/abs/2303.11366v4 (Sec 4.2: retry failed tasks until 3 consecutive failures; Figs 3, 4 by trial number) | F03-3
- Diagram numbers: "1 to 3 lessons" only | as above | F03-1, F04-20

## Without its tests, the loop scored below no loop
- 50 hardest HumanEval problems translated to Rust (MultiPL-E) | https://arxiv.org/abs/2303.11366v4 (Table 2 caption) | F04-21
- Ablation rows: base 0.60; no tests 0.52; no reflection 0.60; full 0.68 | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21, F03-5; wave2-limits row 3
- Base row is one attempt with no loop ("The base strategy is a single code generation sample") | https://arxiv.org/abs/2303.11366v4 (Table 1 caption) | F04-21 (our identification of the base row; 0.60 matches Table 1 HumanEval RS GPT-4 60.0)
- Without tests: cannot tell if current implementation is correct, runs all iterations, "performing harmful edits to the implementation" | https://arxiv.org/abs/2303.11366v4 (Sec 4.3 Ablation study) | F04-21, F03-5
- Without reflection: tests and compilation catch errors, fixes do not reflect them, no gain over baseline | https://arxiv.org/abs/2303.11366v4 (Sec 4.3 Ablation study) | F03-5
- A false pass ends the loop early with an invalid submission | https://arxiv.org/abs/2303.11366v4 (Sec 4.3 Analysis: "the agent will prematurely report an invalid submission") | F03-4
- GPT-4 HumanEval Python 80.1 to 91.0; MBPP Python 80.1 to 77.1 | https://arxiv.org/abs/2303.11366v4 (Table 1) | F03-4
- False positive rate 16.3% MBPP Python vs 1.4% HumanEval Python, defined as P(solution wrong given all tests pass); authors attribute the MBPP result to it ('explains', not 'decided': fc05 fix) | https://arxiv.org/abs/2303.11366v4 (Sec 4.3 Analysis) | F03-4, F04-22

## Self-correction needs a signal from outside the model
- Self-Refine: one LLM as generator, refiner and feedback provider, no training | https://arxiv.org/abs/2303.17651v2 (abstract) | F03-8
- Self-Refine venue NeurIPS 2023 | proceedings index | wave2-words G5
- Math reasoning (GSM8K) GPT-3.5 64.1 to 64.1 | https://arxiv.org/abs/2303.17651v2 (Table 1; Appendix O names GSM-8k) | F03-9; wave2-words row 21
- Flat math traced to error detection; ChatGPT feedback "everything looks good" for 94% of instances | https://arxiv.org/abs/2303.17651v2 (Sec 3.3) | F03-9
- Oracle feedback (refine only when wrong): GPT-3.5 64.06 to 68.9 | https://arxiv.org/abs/2303.17651v2 (Appendix H.1, Table 9) | F03-10; wave2-words row 21
- Intrinsic self-correction defined: no external or human feedback, model decides when to stop | https://arxiv.org/abs/2310.01798v2 (Sec 2; Sec 3.2; page cite label now names both: fc05) | F03-12
- Huang et al. venue ICLR 2024 | PDF running header "Published as a conference paper at ICLR 2024" | register 03 pinned sources
- GPT-3.5 CommonSenseQA 75.8 to 38.1 after round 1, 3 calls vs 1 | https://arxiv.org/abs/2310.01798v2 (Table 3) | F03-12; wave2-words row 22
- Oracle stopping: GPT-3.5 CommonSenseQA 75.8 to 89.7; oracle run uses the correct label to decide when to stop | https://arxiv.org/abs/2310.01798v2 (Sec 3.2, Table 2) | F03-13
- Huang et al. list Reflexion under "Use of oracle labels" | https://arxiv.org/abs/2310.01798v2 (Table 1) | F03-13 (beyond the register quote; read at the pinned version)
- Kamoi et al.: Reflexion's exact match against ground truth "cannot be accessed in real-world applications" | https://arxiv.org/abs/2406.01297v3 (Sec 4, Table 4) | F03-3 (independent reading quoted in the row)
- Kamoi et al. venue TACL 2024 | arXiv journal-ref "Transactions of the Association for Computational Linguistics (2024) 12: 1417-1440" | register 03 pinned sources
- SCoRe (Self-Correction via Reinforcement Learning) expansion | https://arxiv.org/abs/2409.12917v2 (Sec 1: "Self-Correction via Reinforcement Learning (SCoRe)") | U8 closed by wave2-words G2 (expansion read at the pinned version)
- SCoRe: multi-turn RL on self-generated two-attempt episodes; second-attempt instruction asks the model to look for a mistake | https://arxiv.org/abs/2409.12917v2 (Sec 3, Sec 5, Sec 6 evaluation prompts) | wave2-words G2
- Gemini 1.5 Flash MATH: SCoRe +4.4 vs Self-Refine -1.0, first to second attempt | https://arxiv.org/abs/2409.12917v2 (Table 2; Sec 6 Models) | wave2-words G2, U8
- Gemini 1.0 Pro HumanEval: SCoRe +12.2 vs Self-Refine -1.2 | https://arxiv.org/abs/2409.12917v2 (Table 3; Sec 6 Models) | wave2-words G2, U8
- Scope: one correction round, two Gemini models; venue ICLR 2025 (oral), proceedings.iclr.cc hash 871ac99fdc5282d0301934d23945ebaa (fc05 fix: was 'preprint') | https://arxiv.org/abs/2409.12917v2 (Sec 6 "one round of self-correction") | wave2-words G2, G5 note, U8 hedge
- Training reward binary from ground truth (MATH) or passing all tests (code); no oracle at test time; second-attempt instruction does not reveal correctness | https://arxiv.org/abs/2409.12917v2 (Sec 3: "we do not assume access to this oracle at test-time"; Sec 6 Tasks and Evaluation prompts) | wave2-words G2 (setting quote)
- Expandable table: MATH base 52.6/41.4/-11.2; Self-Refine 52.8/51.8/-1.0; SFT successful traces (STaR) 53.6/54.0/+0.4; SFT paired traces (Pair-SFT) 52.4/54.2/+1.8; SCoRe 60.0/64.4/+4.4 | https://arxiv.org/abs/2409.12917v2 (Table 2) | wave2-words G2
- Expandable table: HumanEval base 53.7/56.7/+3.0; Self-Refine 53.7/52.5/-1.2; SCoRe 52.4/64.6/+12.2 | https://arxiv.org/abs/2409.12917v2 (Table 3) | wave2-words G2
- SFT row labels: STaR trains on successful repair traces, Pair-SFT on synthetically paired repair traces | https://arxiv.org/abs/2409.12917v2 (Sec 6 Baselines) | wave2-words G2 (labels read at the pinned version)
- MATH results on 500 held-out problems; HumanEval model trained on MBPP | https://arxiv.org/abs/2409.12917v2 (Sec 6 Tasks) | wave2-words G2 (beyond the G2 quote)
- SCoRe first attempt 52.6% to 60.0%; 64.4% vs Self-Refine 51.8% mixes better first answers and corrections | https://arxiv.org/abs/2409.12917v2 (Table 2) | wave2-words G2 finding
- Self-Refine on MATH flips 4.2% correct to incorrect and 3.2% incorrect to correct | https://arxiv.org/abs/2409.12917v2 (Table 2, c->i and i->c columns) | beyond G2's quote; read at the pinned version

## What to keep from a failure
- [our reading, rendered as "our reading of these studies"] failures help as memory when the update compares them with successes, and hurt as free-floating reflections | synthesis of the three rows below | SCOPE section 12; register 03 C7
- ExpeL: gpt-3.5-turbo-0613 actor, gpt-4-0613 insight writer; HotPotQA 39.0 (insights from success/failure pairs and success lists); 29.0 with reflections added; ReAct 28.0; authors suggest hallucinated reflections misled extraction | https://arxiv.org/abs/2308.10144v3 (Sec 5.6, Table 3; Appendix model table) | F03-20, F03-19; wave2-words row 23
- ExpeL venue AAAI 2024 | arXiv comment "Accepted by the 38th Annual AAAI Conference on Artificial Intelligence (AAAI-24)" | register 03 pinned sources
- ReasoningBank, Gemini-2.5-flash, WebArena-Shopping: 46.5 success-only to 49.7 with failures | https://arxiv.org/abs/2509.25140v2 (Sec 5, Figure 7) | F03-30; wave2-words row 24
- ReasoningBank labels come from an LLM-as-a-judge without any ground-truth reference | https://arxiv.org/abs/2509.25140v2 (Sec 3.2) | F03-28; wave2-words row 24
- ReasoningBank venue ICLR 2026 | arXiv comment "Accepted to ICLR 2026" | register 03 pinned sources
- Training-Free GRPO writes semantic advantages only for groups with both clear winners and losers, because GRPO's advantage is zero when all rewards in a group are identical | https://arxiv.org/abs/2510.08191v1 (Sec 2) | F03-86; wave2-words row 12
- Retroformer: example (Figure 1) where frozen-LLM reflection only rephrases the failed action sequence as the plan, giving repetitive incorrect actions (scope: one illustrative example) | https://arxiv.org/abs/2308.02151v3 (Figure 1) | F04-24; wave2-words row 32
- Retroformer trains a smaller, local retrospective model with policy gradient while the actor LLM is frozen | https://arxiv.org/abs/2308.02151v3 (abstract; Sec 4 and 4.2: "a smaller, local language model") | F04-24
- Retroformer venue ICLR 2024 | PDF running header | wave2-words G5 incidental note

## Invest in the grader before the reflector
- [our reading] no outside signal, no learning | synthesis of the evidence above | SCOPE section 12 mental model; register 03 M2
- Strongest number, landing 2 (and full loop 0.68) | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21
- Signal glosses (execution-grounded; output-evaluated) | https://arxiv.org/abs/2512.16301v3 | wave2-words row 35 replacement text
- Recalled numbers: GSM8K flat with GPT-3.5 (64.1 to 64.1); CommonSenseQA 75.8 to 38.1 | as cited above | F03-9, F03-12
- Pointer to the grader checklist in section 10 (not restated) | n/a | SCOPE ownership note (R3)

## Acronyms and glosses used
- Expanded: RL (reinforcement learning), GRPO (Group Relative Policy Optimization), SFT (supervised fine-tuning), SCoRe (Self-Correction via Reinforcement Learning, from the paper), ExpeL (Experiential Learning agent, from the paper's abstract). LLM and API not expanded (common).
- Benchmarks glossed: HotPotQA, ALFWorld, HumanEval (and the 50-problem Rust subset), MBPP (glossed, not expanded), GSM8K, CommonSenseQA, MATH, WebArena-Shopping.
- Not expanded, named only: ReAct (glossed as the plain agent with no stored experience), pass@1 (glossed).
