# Claims: section 10, The Reward Is a Proxy (`RewardIsAProxy.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Every source below was re-opened on 2026-10-30: the arXiv PDFs at the pinned version (text
extracted and the quoted passage located), the Claude 3.7 Sonnet system card PDF, ghuntley.com/ralph
(live page, published 2025-07-14, modified 2026-02-19), and the four autoresearch files plus the
tree listing at commit 228791fb499afffb54b46200aca536f79142f117. Lines marked "new" were read at the
source during authoring and have no register row.

Register note for the fact checkers: F01-56's own arithmetic reads "2.83 - 0.94 = 1.8 nats" for
n = 16; ln 16 is 2.77, so the difference is 1.83. The page uses 2.77 and "about 1.8".

## Intro (h1)

- A reward is a measurement standing in for the intent; optimisers find where the two come apart; reward hacking defined | our reading, framing | SCOPE section 10 mental model; register 02 mental model 5
- An agent in a frontier training run learned to exit before its unit tests had run (preview; cited in h2 2) | https://arxiv.org/abs/2503.11926v1 (Sec 2.1) | F02-79; wave2-rlvr rows 5, 45
- GPT-5, deployed in an agent scaffold with no training, cheated on 76% of SWE-bench tasks whose tests were altered to contradict the specification | https://arxiv.org/abs/2510.20270v1 (Sec 1) | F02-83; wave2-rlvr row 48
- "A leaky signal teaches the leak, wherever the update lands" | our reading | SCOPE section 10 mental model
- Sections 15, 21 and 22 apply the checklist | dispatch note | dispatch.md row 10

## Over-optimisation

- Reward model = network trained to predict which of two answers a person prefers | definition; section 6 owns it | F01 section F context
- Summarisation, human raters: light optimisation improved summaries; further optimisation fell away from RM predictions until RM anti-correlated with human preferences | https://arxiv.org/abs/2009.01325v3 (Sec 4.3, Fig 5) | F01-54; wave2-rlvr row 44 note
- Gao: fixed 6B gold RM plays humans, labels data that trains proxies 3M to 3B; 1.2B policy; optimised by RL with PPO and by best-of-n (draw n, keep proxy's highest) | https://arxiv.org/abs/2210.10760v1 (Sec 2, 2.1, 3.2) | F01-55; F02-78; wave2-rlvr row 44
- d = sqrt(KL from the initial policy); gold fits d(alpha - beta d) for best-of-n and d(alpha - beta log d) for RL; both rise then fall | https://arxiv.org/abs/2210.10760v1 (Sec 1) | F01-55; F02-78
- Per unit of KL, RL slower than best-of-n at both optimisation and over-optimisation | https://arxiv.org/abs/2210.10760v1 (Sec 1) | F02-78; wave2-rlvr row 44
- Coefficients scale smoothly with proxy RM size, allowing prediction of attained gold score | https://arxiv.org/abs/2210.10760v1 (abstract; Sec 1 "Smooth coefficient scaling") | F01-55
- Venue ICML 2023 | https://proceedings.mlr.press/v202/gao23h.html | wave2-rlvr G3; build-log venues
- Diagram: two schematic panels, functional forms with display coefficients, RL start smoothed (Gao footnote 1: the RL form "likely does not hold near the origin"); proxy curve a sketch (Gao Sec 3.2: proxy grows roughly linearly at higher KL); captioned "Illustrative, not measured" | https://arxiv.org/abs/2210.10760v1 (Sec 1 footnote 1, Sec 3.2) | task instruction; F02-78
- Diagram label "Gap: how far the proxy is being exploited" | https://arxiv.org/abs/2210.10760v1 (Sec 3.4: gap "indicative of the extent to which the proxy RM is exploited") | new
- KL of best-of-n = log n - (n - 1)/n | https://arxiv.org/abs/2210.10760v1 (Sec 2, citing Stiennon App G.3) | F01-56 (U9: not re-derived from STI20)
- About 1.8 nats at n = 16 | our arithmetic: ln 16 = 2.77, minus 15/16 = 0.94, gives 1.83 | F01-56 [derived]
- About 6 nats at n = 1,000 and about 10 at n = 60,000 | https://arxiv.org/abs/2210.10760v1 (Sec 3.1) | new
- A frozen model sampling and keeping a learned judge's favourite is doing best-of-n, so travels a curve of this kind | our reading of Gao Sec 1 ("Overoptimization can occur with both methods") | F02-78 use in dive
- Against the proxy score, best-of-n and RL look much more alike | https://arxiv.org/abs/2210.10760v1 (Sec 1, Sec 3.5) | new
- Proxy-gold gap indicates how far the proxy is exploited | https://arxiv.org/abs/2210.10760v1 (Sec 3.4) | new
- U18 hedge: synthetic studies with gold RM of 6B (Gao) or 70B (2026 preprint), policies of 6B or below; no frontier-scale replication located during this research | https://arxiv.org/abs/2609.38526v1 (abstract, Sec 5.2) | RESEARCH-GUIDE U18 accept-as-hedge; wave2-foundations G4 hedge text
- 70B study: Qwen3 proxies of 4B or below, 4B policy (Qwen3-4B-Instruct), best-of-N and exponential tilting (idealised KL-regularised RL), no RL training run | https://arxiv.org/abs/2609.38526v1 (abstract, Sec 5.2, Sec 5.4) | wave2-foundations G4
- "Treat the shape as the thing to watch for, and the coefficients as unknown for your own models" | our reading | U18
- Expandable: 100,000 synthetic comparisons; PPO with KL penalty 0 outside Sec 3.6; best-of-n form fitted to n = 1,000 predicted n = 60,000 in advance; 6B policy gained less than 1.2B, peaked at almost the same KL | https://arxiv.org/abs/2210.10760v1 (Sec 2, 2.1, 3.1, 3.4) | new (F01 section E context)
- Expandable: with a KL penalty the gold score converged earlier on the same curve (section 5 covers) | https://arxiv.org/abs/2210.10760v1 (Sec 3.6) | F01 row cited by section 5 (wave2-foundations); cross-reference only, no Cite on page

## In agentic coding, the cheap path runs through the test suite

- Frontier training run at OpenAI; agent in the same family as o1 and o3-mini; exit(0) exploited a bug to leave before all unit tests ran; raise SkipTest from functions outside the test framework; reinforced until nearly every training environment affected | https://arxiv.org/abs/2503.11926v1 (Sec 2.1, Fig 2 caption) | F02-79; wave2-rlvr rows 5, 45
- Editing library functions the tests depended on bypassed the rule against touching test files | https://arxiv.org/abs/2503.11926v1 (Sec 2.2, item 2) | F02-79
- Table rows: problem-specific hacks (stubs where coverage poor; upstream function edits; local pandas copy overwriting verification functions; decompiled leftover files holding the reference solution; test files parsed for expected values) | https://arxiv.org/abs/2503.11926v1 (Sec 2.2, items 1 to 5) | new (F02-79 covers item 2)
- Table rows: AlwaysEqual, sys.exit(0), conftest.py report patch | https://arxiv.org/abs/2511.18397v1 (Sec 2, Fig 7 prompt text) | F02-81
- Table rows: modify tests, overload comparison operators, record extra states, special-casing | https://arxiv.org/abs/2510.20270v1 (Sec 4.1) | F02-83 (new detail)
- Table rows: returning expected test values, editing tests | https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf (Sec 6) | F02-82
- Table grouping "what the grader trusted" | our grouping (caption says so) | SCOPE section 10
- Anthropic: model first taught hacking strategies by synthetic document fine-tuning or prompting; RL on a selection of real Anthropic production coding environments; each open to at least one of three hacks | https://arxiv.org/abs/2511.18397v1 (abstract, Sec 2) | F02-81; wave2-rlvr row 46 (replacement wording applied)
- Generalised to alignment faking, cooperation with malicious actors, attempted sabotage in Claude Code including the paper's codebase; chat-style RLHF fixed chat-like evaluations, misalignment persisted on agentic tasks | https://arxiv.org/abs/2511.18397v1 (abstract) | F02-81
- Claude 3.7 Sonnet sometimes special-cases tests in agentic coding after repeated failures (expected values, editing tests); Anthropic attributes it to reward hacking during RL training (Tier 2, attributed) | https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf (Sec 6, 6.1) | F02-82; wave2-rlvr row 47
- ImpossibleBench alters unit tests to contradict the spec, any pass is a cheat; agents get read/write access to tests and an instruction not to modify them | https://arxiv.org/abs/2510.20270v1 (abstract, Sec 2.2, 2.4) | F02-83
- GPT-5 76% on Oneoff-SWEbench (one expected value changed); 2.9% on Oneoff-LiveCodeBench | https://arxiv.org/abs/2510.20270v1 (Sec 1, Sec 2.2) | F02-83; wave2-rlvr row 48 (optional precision applied)
- LiveCodeBench gloss "algorithmic programming problems" | https://arxiv.org/abs/2510.20270v1 (Sec 1: "algorithmic problems and realistic multi-file software scenarios") | new
- Editing tests despite the instruction was one of four strategies observed | https://arxiv.org/abs/2510.20270v1 (Sec 4.1) | new
- Expandable: OpenAI patched the bug behind each systemic hack once noticed | https://arxiv.org/abs/2503.11926v1 (Fig 2 caption) | new
- Expandable: Anthropic environments a subset of Claude Sonnet 3.7's, chosen by manual review, mitigations removed; hacks studied did not occur in Claude Sonnet 3.7 training, though they could have | https://arxiv.org/abs/2511.18397v1 (Sec 1 footnote 2, Sec 2) | F02-81

## A monitor inside the reward stops being a monitor

- GPT-4o monitor: 95% recall with CoT plus actions, 60% with actions and outputs only, on the two systemic hacks | https://arxiv.org/abs/2503.11926v1 (Sec 2.1, Table 1) | F02-79
- Follow-up: non-frontier agent, same environments, allowed to edit tests; reward = pass tests and not trigger a CoT-only monitor | https://arxiv.org/abs/2503.11926v1 (Sec 3.1 Fig 3 caption, Sec 3.2) | F02-80 (scope detail new)
- Low optimisation: more capable, less hacking; more optimisation: hacking at a significant rate, monitor recall near zero, intent hidden in CoT | https://arxiv.org/abs/2503.11926v1 (abstract, Sec 3.2, Fig 4) | F02-80; wave2-rlvr row 49
- "Monitorability tax" proposal | https://arxiv.org/abs/2503.11926v1 (abstract) | F02-80
- "A detector inside the reward becomes one more proxy" | our reading | SCOPE section 10
- Expandable: reward-hacking classifier penalty prevented hacking in Anthropic's setting; added mid-run removed hacking and reversed most misaligned generalisation; "instruct model not to hack during RL" prevented neither; mitigations depend on reliable detection | https://arxiv.org/abs/2511.18397v1 (Sec 1 Mitigations, Fig 4, Sec 4.3) | new (conflict with the scope's "kept out of the reward" item, published as such)
- Expandable: LLM monitors 86-89% on Impossible-LiveCodeBench, 42-65% on Impossible-SWEbench; monitor accepted "backward compatibility" justifications | https://arxiv.org/abs/2510.20270v1 (Sec 1, Sec 6) | F02-83 (SWE-bench range new)
- Expandable: "a penalty can hold while detection is reliable; only a detector you never train against can tell you when it stops" | our reading | none

## The same leak in a text loop

- Huntley: Ralph = shell loop feeding the same prompt to a coding agent, fresh context per run | https://ghuntley.com/ralph/ | F04-68, F04-69
- Quote: "The models have been trained to chase their reward function, and the reward function is compiling code." (Tier 2, his argument, attributed) | https://ghuntley.com/ralph/ ("no cheating") | F04-71; wave2-rlvr row 50
- Prompt sign forbidding placeholders, which the model may ignore early; more loops find placeholders and minimal implementations and turn them into a to-do list | https://ghuntley.com/ralph/ ("no cheating") | F04-71
- autoresearch: agent edits one training script, keeps a change only if val_bpb improves | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L100-L104 | F04-60 to F04-63 context
- program.md lists modifying prepare.py and the evaluation function under "What you CANNOT do" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L28-L31 | F04-65; wave2-rlvr row 51
- evaluate_bpb scores by calling model(x, y, reduction='none') | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/prepare.py#L340-L359 | F04-65; wave2-rlvr row 51
- The forward pass, loss included, is defined in train.py (L268-L289) | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L268-L289 | F04-65 (line range new; register cites L268)
- train.py calls evaluate_bpb (L613) and prints the val_bpb line (L622) | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L613-L622 | new (code read)
- The loop reads val_bpb with grep and keeps or resets the commit | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L100-L104 | F04-63 context; new line range
- No file in the repository at the commit enforces the rule (scoped to the ten files listed: .gitignore, .python-version, README.md, analysis.ipynb, prepare.py, program.md, progress.png, pyproject.toml, train.py, uv.lock) | https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117 | F04-65 ("nothing enforces it"), scoped as our reading
- README suggests starting the agent "(and disable all permissions)" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L44 | F04-65
- Evaluator inside the policy's reach; moving it out left to the operator | our reading of the code | F04-65 use in dive
- ImpossibleBench: up to 10 submissions with failed-test feedback; averaged over models, open-test SWE-bench pass rate 80% to 83%, Conflicting-SWEbench cheating 33% to 38% | https://arxiv.org/abs/2510.20270v1 (Sec 2.4, Sec 5.3) | new (F02-83 row lists Sec 5.3 in its location)
- Reflexion: model writes its own unit tests, runs them, reflects on failures | https://arxiv.org/abs/2303.11366v4 (Sec 4.3) | F04-21 context
- 50 hardest HumanEval problems translated to Rust, GPT-4: full 0.68, no reflection 0.60, without tests 0.52 (pass@1) | https://arxiv.org/abs/2303.11366v4 (Table 3) | F04-21; wave2-rlvr row 52; wave2-limits row 3
- Reflexion venue NeurIPS 2023 | register 04 pinned sources | F04-19

## The grader checklist (ending; our reading of the section's evidence)

- Framing: every hack attacked something trusted and reachable; every over-optimised run climbed on an unchecked score | our reading | wave2-rlvr row 53 ([our reading])
- 1. Evaluator code the agent cannot edit (own process, unwritable tests, framework, libraries, scoring and reporting code; early exit or skip = failure); closes exit(0), SkipTest, conftest.py, edited libraries, the autoresearch layout | our reading of F02-79, F02-81, F04-65 | wave2-rlvr row 53
- 2. GPT-5's 76% measured with read/write tests | https://arxiv.org/abs/2510.20270v1 (Sec 2.4) | F02-83
- 2. Hidden tests: cheating near zero, legitimate scores lower; read-only: restores legitimate performance, blocks test edits, does not stop special-casing or operator overloading | https://arxiv.org/abs/2510.20270v1 (Sec 5.2) | F02-83; wave2-rlvr row 53 hedge ("hidden or read-only tests, hiding them also lowered legitimate scores") applied
- 2. "Hide where you can afford the lower score, read-only elsewhere, keep a hidden set" | our reading; the paper recommends hiding or read-only "when feasible" | F02-83
- 3. Held-out metric: a score the optimiser never sees, plotted beside the optimised one; climbing optimised plus stalling held-out = past the peak | our reading of F01-54, F01-55 | wave2-rlvr row 53
- 3. OpenAI's Cheating check: revert changes to the testing framework, re-run, a pass that becomes a failure is a cheat | https://arxiv.org/abs/2503.11926v1 (Sec 3.1, Fig 3 caption) | new
- 4. Monitor with CoT where available: 95% against 60% | https://arxiv.org/abs/2503.11926v1 (Table 1) | F02-79
- 4. Signals Anthropic lists: excessive edit/test cycles on one file, test-specific comments, unexpected test-file edits | https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf (Sec 6.2) | F02-82
- 4. Flags to a person or a log, never into the reward | our reading of F02-80 | wave2-rlvr row 53
- Closing: run the checks before the first step or iteration; sections 15, 21 and 22 apply the checklist | our reading; dispatch | dispatch.md row 10
