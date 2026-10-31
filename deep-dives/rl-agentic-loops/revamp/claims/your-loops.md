# Claims: section 15, Your Loops Through the RL Lens (`YourLoops.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Every source below was re-opened on 2026-10-30: README.md, program.md, prepare.py and train.py of
karpathy/autoresearch at 228791fb499afffb54b46200aca536f79142f117 (raw files, line numbers checked);
the FunSearch Nature article page (open access, Nature 625, 468-475, published 2023-12-14); the
AlphaEvolve PDF at arXiv 2506.13131v1; ghuntley.com/ralph (published 2025-07-14, modified
2026-02-19 per page metadata); the Amazon Bedrock prompt-caching user guide page; the arXiv abstract
page of 2403.15371v3. Lines marked "new" were read at the source during authoring and have no
register row.

Notes for the fact checkers:
- FunSearch locations: "on the order of 10^6" sits in the main text, FunSearch section, "Pretrained
  LLM" subsection, not in Methods as wave2-limits G2 says. "For some problems we run several
  experiments" sits in the main-text "Distributed approach" subsection. The cluster-sampling equation
  (1) and "Programs that are correct are sent to the programs database to be stored" are in Methods.
  Section 11's catalogue row cites "FunSearch, Methods" for the 10^6 figure (owner: section 11).
- Venue badge "Nature 2023" follows section 11 (published 14 December 2023; volume 625 is 2024).
- autoresearch line ranges: prepare.py L31 is `TIME_BUDGET = 300`; train.py L458-L459 seeds,
  L516 schedule comment, L555-L556 progress and LR multiplier, L603-L604 wall-clock break; program.md
  L114 is the "about 100" estimate.
- Diagram marks (missing, weak or costly, present) are our reading; the search-loop column carries no
  "missing" mark by design, because they fill all five parts and their cost is samples.

## Intro (h1)

- Five RL parts defined (policy, reward, update rule, exploration, credit assignment) | definitions, dive vocabulary | SCOPE section 15 ("vocabulary of sections 3 to 10")
- At five minutes per experiment, autoresearch's instructions count on about 100 experiments over a night's sleep | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L114 | new (program.md L114; README L64 says the same, Tier 2)
- Each experiment is kept or reset on a single reading of one number | program.md L103-L104 (cited in the autoresearch block) | F04-62; wave2-limits row 7
- Hardening = finding the empty part, where noise is kept, a loop stalls, or waits on a person | our reading, framing | SCOPE section 15 payoff

## Three loops on one map (diagram)

- autoresearch policy: coding agent on a frozen model edits train.py, steered by program.md | README.md L13-L15 (Tier 2) | F04-60
- autoresearch reward: val_bpb after 5 minutes of training, read once; weak: no noise floor | prepare.py L31; program.md L103 | F04-61, F04-66; wave2-limits rows 6, 11
- autoresearch update: keep the commit if val_bpb fell, reset otherwise; greedy hill-climbing | program.md L103-L104 | F04-62; wave2-limits rows 7, 9
- autoresearch exploration: missing from what is kept; advice only ("try more radical architectural changes") | program.md L106, L112 | wave2-limits row 9
- autoresearch credit: one idea per commit | program.md L96-L98 | F04-66; wave2-limits row 10
- Search loops policy: LLM shown stored high scorers; FunSearch on the order of 10^6 samples; costly | FunSearch, Pretrained LLM; AlphaEvolve Table 1 | F03-92, F03-96; U21 (wave2-limits G2)
- Search loops reward: programmatic evaluator score, graded | FunSearch Discussion | F03-93; wave2-limits row 15
- Search loops update: store what the evaluator accepts; sample high scorers into prompts | FunSearch Methods; AlphaEvolve Figure 2 | wave2-limits row 12
- Search loops exploration: islands (FunSearch); database built for diversity (AlphaEvolve) | FunSearch Programs database; AlphaEvolve Sec 2.5 | wave2-limits row 13; new (AlphaEvolve 2.5 quote)
- Search loops credit: one score per whole program | FunSearch Methods (evaluator scores programs; aggregated score) | our reading
- Ralph policy: same prompt, fresh context each run, state in plan, AGENT.md and repo | https://ghuntley.com/ralph/ | F04-68, F04-69, F04-72; wave2-limits rows 17, 18
- Ralph reward: backpressure (tests, compiler, type checks) rejects invalid code | https://ghuntley.com/ralph/ | F04-70; wave2-limits row 19
- Ralph update: missing a scored rule; agent updates plan and AGENT.md, operator adds signs by hand | https://ghuntley.com/ralph/ | F04-72; wave2-limits row 20; our reading
- Ralph exploration: weak, none by design, one task per loop chosen by the agent | https://ghuntley.com/ralph/ ("choose the most important thing"; "one task per loop") | F04-68; our reading
- Ralph credit: notes in files say why a test exists | https://ghuntley.com/ralph/ | F04-72; wave2-limits row 18

## autoresearch block

- The agent edits one file, train.py; may not touch prepare.py (data, constants, evaluation) | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L25-L31 | F04-60; wave2-limits row 4
- Metric val_bpb (validation bits per byte), lower is better | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L17 | F04-61; wave2-limits row 5
- Fixed training budget of 300 seconds | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/prepare.py#L31 | F04-61; wave2-limits row 6
- Commit each idea, keep if val_bpb improved, reset if equal or worse | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L94-L104 | F04-62; wave2-limits row 7
- Every run logged keep/discard/crash in an untracked results.tsv | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L66-L102 | F04-64; wave2-limits row 8
- Acceptance rule is greedy hill-climbing (definition: survives only if it beats the current best) | program.md L103-L104 | F04-62 use; wave2-limits row 9 (mapping is the dive's)
- Exploration only as advice: "try combining previous near-misses, try more radical architectural changes"; rewind "very very sparingly (if ever)" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L106-L112 | wave2-limits row 9
- One idea per commit and one reading | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L96-L98 | F04-66; wave2-limits row 10
- Seed fixed at 42 in the shipped train.py | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L458-L459 | F04-66; wave2-limits row 10
- train.py is the file where "Everything is fair game" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L26 | wave2-limits row 10
- Only acceptance test is whether val_bpb improved; the one magnitude named (0.001) is a complexity judgement, quoted | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L37 | F04-63; wave2-limits row 11
- Training stops on wall-clock time after the step that passes the budget | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L603-L604 | F04-65 evidence; wave2-limits row 10, G7
- Learning-rate schedule follows elapsed training time | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py#L555-L556 and #L516-L526 | new (train.py, read at SHA)
- Two runs of the same commit need not train for the same number of steps; fixed seed does not make a reading repeat; sub-noise gains can be kept | our reading of train.py | wave2-limits rows 10, 11; G7
- README concedes results "become not comparable to other people running on other compute platforms" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md#L64 | wave2-limits G7
- Run-to-run variance of val_bpb not measured in any source located; we did not measure it; treat a single small gain as unconfirmed until it repeats | hedge | U11 accept-as-hedge (wave2-limits triage); E2 not run
- About 100 single-reading decisions a night give many chances to keep noise | our reading | program.md L114 plus U11
- Expandable: no repeat-run or noise rule in program.md, README.md or train.py at this commit | our reading of the three files | wave2-limits row 11, G7
- Expandable: the evaluation runs the model code the agent edits (section 10 owns it) | section 10 reference | F04-65

## FunSearch and AlphaEvolve block

- An LLM writes candidates (frozen, pretrained in FunSearch); an evaluator runs and scores each | https://www.nature.com/articles/s41586-023-06924-6 (FunSearch overview; Pretrained LLM) | F03-92
- Both keep a scored population, ask the LLM for variants of high scorers, store variants the evaluator accepts | FunSearch Methods; https://arxiv.org/abs/2506.13131v1 (Figure 2) | wave2-limits row 12 (replacement text)
- FunSearch: pretrained code model, no fine-tuning, new versions of one function; "Programs that are correct are sent to the programs database to be stored" | FunSearch, Pretrained LLM ("without any fine-tuning") and Methods (Distributed system) for the quote; cite label widened by fact check fc06 | F03-92; wave2-limits row 12, G2
- AlphaEvolve: "promising solutions are registered back into the Program database" | https://arxiv.org/abs/2506.13131v1 (Figure 2 caption) | wave2-limits row 12
- Selection via sampling into prompts; neither keeps a candidate because it beat its parent; no revert | FunSearch; AlphaEvolve | wave2-limits row 12
- FunSearch samples an island then a program, "favouring higher-scoring and shorter programs" | FunSearch, Programs database (main text) | wave2-limits row 12
- Cluster choice probability grows exponentially with score, temperature-scaled; lower scorers keep some chance | FunSearch, Methods, equation (1) | new (Methods, read 2026-10-30)
- Islands evolved independently; diversity quote; worst half discarded and reseeded from best survivors | FunSearch, Programs database (main text) | F03-92; wave2-limits row 13
- AlphaEvolve database: "balancing exploration and exploitation"; draws in part on island-based population models | https://arxiv.org/abs/2506.13131v1 (Sec 2.5) | new (Sec 2.5 quote); wave2-limits row 12
- Population is the exploration term autoresearch lacks | our reading | SCOPE section 15 ([our reading])
- FunSearch "works best" with an efficient evaluator and rich (non-binary) scoring feedback | FunSearch, Discussion | F03-93; wave2-limits row 15
- AlphaEvolve lets the user stage evaluation as a cascade of increasing difficulty | https://arxiv.org/abs/2506.13131v1 (Sec 2.4) | F03-95; wave2-limits row 14 ("the user can specify")
- AlphaEvolve's authors: FunSearch "millions of LLM samples", AlphaEvolve thousands; whole files vs one function; hours on accelerators vs 20 minutes or less on one CPU; benefits from SOTA models vs no benefit from larger | https://arxiv.org/abs/2506.13131v1 (Table 1) | F03-96; wave2-limits row 16
- FunSearch's own total: "on the order of 10^6" samples | FunSearch, Pretrained LLM (main text) | U21 closed (wave2-limits G2)
- Several runs for some problems | FunSearch, Distributed approach (main text) | wave2-limits row 16, G2
- Better proposals mean fewer are needed; systems differ too much to isolate the model's share | our reading (scope narrowed by the second clause) | SCOPE section 15 ([our reading])

## Ralph block

- Ralph: same prompt, coding agent, endless shell loop, one task per iteration; `while :; do cat PROMPT.md | claude-code ; done` | https://ghuntley.com/ralph/ | F04-68; wave2-limits row 17
- Each iteration a new context window; state from files: plan (pick the most important item), AGENT.md updated with build learnings, specifications, notes "because future loops will not have the reasoning in their context window" | https://ghuntley.com/ralph/ | F04-69, F04-72; wave2-limits rows 17, 18
- Tests, type checks and static analysers as backpressure that rejects invalid code | https://ghuntley.com/ralph/ | F04-70; wave2-limits row 19
- Operator adds a "sign", e.g. "SLIDE DOWN, DON'T JUMP, LOOK AROUND" | https://ghuntley.com/ralph/ | F04-72; wave2-limits row 20
- Backpressure is the reward, a pass-or-reject gate | our reading | F04-70 use
- Two learners at two speeds: agent edits plan and AGENT.md; operator edits the prompt; "Each time Ralph does something bad, Ralph gets tuned - like a guitar." | https://ghuntley.com/ralph/ | F04-72
- Operator is a slow outer optimiser; no rule in code compares attempts by score; no exploration by design; credit in notes | our reading | SCOPE section 15; F04-72 use
- Fresh context is Huntley's answer to context degradation, argued from use, not measured; "approximately 170k"; "The more you use the context window, the worse the outcomes you'll get"; "burning the allocation of the specifications every loop" | https://ghuntley.com/ralph/ | F04-69; wave2-limits row 21
- autoresearch redirects run output to a log and greps two lines, not to "let output flood your context" | https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md#L99-L100 | F04-67
- Section 17 covers long-context measurements | cross-reference | SCOPE section 17

## Hardening checklist

- Section 10's four grader checks named by reference (evaluator code the agent cannot edit, hidden or read-only tests, a held-out metric, monitors kept out of the reward) | section 10 (RewardIsAProxy.tsx, "The grader checklist") | SCOPE section 15 (by reference)
- 1. Noise floor: run the unchanged best several times, accept only gains that clear the spread or repeat; autoresearch decides about 100 a night on one reading with a wall-clock cut | guidance; program.md L114, train.py L603-L604 | SCOPE checklist; U11 hedge
- 2. One change per trial; bundled changes leave a gain with no owner | guidance, our reading | F04-66
- 3. Scorekeeping in code; autoresearch's agent applies the rule by following prose | program.md L100-L104 | F04-64, F04-17 use
- 3. Bandit study: GPT-3.5, GPT-4, Llama2; one configuration explored satisfactorily: GPT-4 with chain-of-thought and an externally summarised history; configurations with chain-of-thought and unsummarised history did not | https://arxiv.org/abs/2403.15371v3 (Abstract; NeurIPS 2024 per comments) | F04-8, F04-10; wave2-limits row 1
- 4. Population when the loop stalls is the exploration term autoresearch lacks; sample parents biased toward high scores as FunSearch does | our reading | SCOPE checklist ([our reading])
- 4. A pass-or-fail check cannot rank one passing candidate above another | our reading (logic), FunSearch Discussion for the graded-score condition | F03-93
- 5. Fresh context, state in files (Ralph); raw output out of context (autoresearch); Huntley argues from use | ghuntley.com/ralph; program.md L99-L100 | F04-69, F04-67; wave2-limits row 21
- 6. Stable prefix first, evolving part after, so the stable part stays eligible for prefix caching | guidance | SCOPE checklist; wave2-limits row 22
- 6. Bedrock implicit caching: static first raises "the likelihood of an exact prefix match"; best effort; "Repeating an identical prompt doesn't guarantee a cache hit" | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html | F04-40; wave2-limits rows 22, 32
- 6. Ralph's "deterministically allocate the stack the same way every loop" already gives this layout (our reading); no cache measurement for Ralph located | https://ghuntley.com/ralph/ | F04-69 use ([SPECULATIVE] in register 04 profile); U10 hedge scope
- 6. Mechanism link: vLLM dive section 6, Automatic Prefix Caching; section 17 prices edits early in an evolving context | cross-references | authoring brief; wave2-limits row 22
- Closing: write your loop into the map, mark the empty cell; for an autoresearch-shaped loop the floor and the population; add the floor first | guidance | SCOPE section 15 ending
