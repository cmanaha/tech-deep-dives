# fc05-words-a: fact check of sections 11, 12 and 13

Agent: fc05-words-a. Date: 2026-10-30. Files: `src/sections/TextLoopAsRl.tsx`,
`src/sections/VerbalReinforcement.tsx`, `src/sections/AccumulatingExperience.tsx`.

Status: DONE. Corrections applied to all three files; claims files updated (`revamp/claims/text-loop.md`,
`verbal.md`, `experience.md`). No diagram was touched (all fixes are prose, table data or Cite labels), so
the screenshot harness was not re-run.

Sources opened by this agent: 26 arXiv PDFs at the pinned versions (pdftotext -layout, in
`/tmp/rl-fc-fc05/txt`); arXiv export API comments for every cited paper; FunSearch and TextGrad
Nature pages; Crossref record for DOI 10.1038/s41586-025-08661-4; ICLR 2025 proceedings page for
SCoRe; ICLR 2026 proceedings PDF for ReTool; ACL Anthology (Dynamic Cheatsheet, EACL 2026);
OpenReview (CLIN, COLM 2024; Voyager, TMLR 2024); karpathy/autoresearch at 228791fb (program.md,
prepare.py); ghuntley.com/ralph; Claude docs memory tool and Agent Skills overview; Anthropic
engineering post on Agent Skills.

## TextLoopAsRl.tsx (section 11)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 11.1 | Reflexion row, frozen: "Actor, evaluator and reflector LLMs" | TextLoopAsRl.tsx:408 | OVERREACH | https://arxiv.org/abs/2303.11366v4 Sec 3, Evaluator: exact-match grading (reasoning), "pre-defined heuristic functions" (decision-making), or "a different instantiation of an LLM" | Now "Actor and reflector LLMs; the evaluator too, where it is an LLM" |
| 11.2 | FunSearch row cite label "FunSearch, Methods" for 10^6 samples, islands, pretrained LLM | TextLoopAsRl.tsx:642 | UNSUPPORTED at the cited location | https://www.nature.com/articles/s41586-023-06924-6: "on the order of 10^6" is in the main text ("Pretrained LLM" paragraph of the FunSearch overview), as are the islands model and the evaluator; the Methods section starts later | Label now "FunSearch, main text" |
| 11.3 | Memento cost: "Up to 121k input tokens per task at the hardest level of GAIA" | TextLoopAsRl.tsx:713 | OVERREACH (average read as a maximum) | https://arxiv.org/abs/2508.16153v2 Sec 6: "we randomly sample 10 tasks from the GAIA validation ... Average ... Level 3 peaked at 121k/9.8k" | Now "About 121k input tokens per task on average, over 10 sampled tasks at the hardest level of GAIA" |
| 11.4 | Dynamic Cheatsheet cost: "1,035 to 1,831 tokens per answer" | TextLoopAsRl.tsx:484 | OVERREACH (minor: source does not say output tokens) | https://arxiv.org/abs/2504.07952v1 footnote 13: "Claude Sonnet averaged 370 tokens under BL, 494 under DC-0, 1035 under DC-RS, and 1831 under DC-Cu" | Now "an average of 1,035 to 1,831 tokens per problem, against 370 without it" |
| 11.5 | Retroformer row cite "Sections 4.2 and 5.2, Appendix C.1" carries the F1 reward | TextLoopAsRl.tsx:676 | UNSUPPORTED at the cited location | https://arxiv.org/abs/2308.02151v3 F1 reward is Sec 4.1 "Reward Shaping" and App C.3 "Reward Function"; 3,383 samples and 4-bit LoRA are App C.1 | Label now "Sections 4.1, 4.2 and 5.2, Appendices C.1 and C.3" |
| 11.6 | Survey: "For tools and memory the survey uses a different split", cite "Section 3.2" | TextLoopAsRl.tsx:970-975 | UNSUPPORTED (partial) at the cited location | https://arxiv.org/abs/2512.16301v3 Sec 3.2 carries the tool split; memory's placement under tool adaptation (T2) is footnote 1 in Sec 2.2 | Label now "Section 3.2 and footnote 1" |
| 11.7 | GEPA "called its reflection model 17 to 90 times per task" | TextLoopAsRl.tsx:1010-1012 | OVERREACH (scope ambiguous) | https://arxiv.org/abs/2507.19457v2 App N, Table 4: "Total number of calls made by GEPA to reflection LM during optimization", per benchmark (Qwen3-8B: IFBench 17 ... AIME-2025 90) | Now "17 to 90 times in a whole optimisation run on one benchmark" |
| 11.8 | Reflexion 0.60 named "no reflection at all" (intro) and "no reflection" (predicts) | TextLoopAsRl.tsx:786, 1035 | CONFIRMED; wording harmonised | Reflexion Table 3: Base model 0.60 (no tests, no reflection) and self-reflection omission 0.60; sections 10 and 12 name the 0.52 comparator "no loop at all" | Both landings now "no loop at all", matching sections 10 and 12 |
| 11.9 | ExpeL and CLIN appear in the grid and table with no expansion or gloss | TextLoopAsRl.tsx:79-80, 427-455 | prose rule (acronym / niche name) | CLAUDE.md Acronym Standard; ExpeL abstract "Experiential Learning (ExpeL) agent"; CLIN title "A Continually Learning Language Agent" | Short-names paragraph now glosses ExpeL (the Experiential Learning agent) and CLIN (a continually learning language agent) |

CONFIRMED: 121 of 128 claims checked (row 11.8 counted as confirmed). Reflexion Sec 1 policy quote, "semantic" gradient, "not having a
formal guarantee for success"; Sec 3 memory bound "usually set to 1-3", appended after each trial; Sec 4.2
exact-match binary signal; Sec 4.3 self-written tests; Table 3 (0.52 / 0.60 / 0.68, GPT-4, 50 hardest
HumanEval Rust); App B.1 WebShop stopped "after only four trials" and the exploration quote. Retroformer
Sec 3 quotes (both), PPO on a LongChat-7B LoRA reflector, reward = return difference between trials,
3,383 HotPotQA samples, GPT-3 text-davinci-003 or GPT-4 actor. TextGrad v1 metaphor quote and "at most n
additional language model calls" for n edges; Nature 639 (2025). von Oswald abstract (ICML 2023, PMLR
v202); Shen et al. "remains an open hypothesis", LLaMa-7B (ICML 2024, PMLR title "Position: ..."). Survey
v3 Sec 1 axes, Sec 3.2 and 3.3 quotes (DeepSeek-R1, Search-R1, ReTool). Every table row checked at the
pinned version: Self-Refine (abstract), ExpeL (Sec 4.2: ADD/EDIT/UPVOTE/DOWNVOTE, gpt-3.5-turbo-0613 and
gpt-4-0613), CLIN (Sec 3.2, three most recent memories; gpt-4 for controller, executor and memory
generator), ReasoningBank (Sec 3.2), Dynamic Cheatsheet (Sec 2, no labels; footnote 13), Voyager (Sec 2.2,
Sec 4 "15x more expensive"), ACE (Sec 3, Table 4(a) 357 vs 1,434), Training-Free GRPO ($18; $0.02 per
problem, Sec 4.2), ProTeGi (beam, bandits, gpt-3.5-turbo, 12 to 50 evaluations), OPRO (best 20, 8 per step,
200 steps), MIPRO (surrogate), GEPA (Table 1 rollouts 1,839 to 7,051 vs 24,000; App E.4 500 steps;
MIPROv2 2,270 to 6,926), autoresearch program.md L103-L104 and prepare.py L31 at 228791fb, FunSearch and
AlphaEvolve ("thousands of LLM samples suffice", Gemini 2.0 Flash and Pro), Ralph post, Advisor Models
(single node of 8xH100s), Memento (soft Q-learning, binary reward, GPT-4.1 planner, o3 for GAIA). ACE Sec
2.2 collapse figures. Krishnamurthy et al. abstract (NeurIPS 2024). All 20 venue badges in the file.

Score: 9/10. Accurate at the pins after the fixes; every quantitative cell cited; the frame is a usable
mental model and the section ends on the check to run. The 20-row table is dense for a phone reader.

## VerbalReinforcement.tsx (section 12)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 12.1 | "three roles, each a prompted LLM" | VerbalReinforcement.tsx:455 | WRONG for the Evaluator | https://arxiv.org/abs/2303.11366v4 Sec 3 Evaluator: exact match, heuristics, or an LLM; the page itself says so at L486-L495 | Now: Actor, a prompted LLM; Evaluator by exact match, a hand-written heuristic or another LLM; Self-Reflection model, also an LLM |
| 12.2 | Self-written tests "passed a wrong solution 16.3% of the time on MBPP against 1.4% on HumanEval" | VerbalReinforcement.tsx:540-541 | OVERREACH (metric definition) | Reflexion Sec 4.3: false positive rate is "P(not pass@1 generation correct given tests pass). That is, the probability that a submission will fail given that it passes all unit tests" | Now "of the solutions that passed all their own tests, 16.3% were wrong on MBPP against 1.4% on HumanEval" |
| 12.3 | "the false-positive rate of the grader decided whether the same loop ... helped or hurt" | VerbalReinforcement.tsx:541-543 | OVERREACH (causal strength) | Reflexion Sec 4.3: "we observe a notable discrepancy between the false positive labels"; baselines 82% and 80% "relatively similar" | Now "the grader's false-positive rate explains why the same loop on the same model helped on one benchmark and hurt on the other" |
| 12.4 | SCoRe venue badge "preprint"; "in a preprint" | VerbalReinforcement.tsx:43, 626 | STALE | https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html (ICLR 2025, oral) | Venue now "ICLR 2025" (all SCoRe Cites go through one helper); "in a preprint" dropped from the scope sentence |
| 12.5 | Huang et al. "decides by itself when to stop", cite "Section 2" | VerbalReinforcement.tsx:584-588 | UNSUPPORTED (partial) at the cited location | https://arxiv.org/abs/2310.01798v2 Sec 2 defines intrinsic self-correction; the stop decision is Sec 3.2 ("requiring LLMs to independently determine when to stop") | Label now "Huang et al., Sections 2 and 3.2" |
| 12.6 | HumanEval named in the intro before its gloss (L519) | VerbalReinforcement.tsx:436 | prose rule (benchmark gloss at first use) | authoring brief: gloss each benchmark at first use | Intro now glosses HumanEval ("programming tasks checked by unit tests"); the duplicate gloss at the ablation paragraph removed |
| 12.7 | SFT used in the SCoRe table before its expansion (L643) | VerbalReinforcement.tsx:340, 348 | prose rule (acronym order) | CLAUDE.md Acronym Standard | First table row now "Supervised fine-tuning (SFT) on successful correction traces"; later prose uses SFT |

CONFIRMED: 75 of 80 claims checked. Reflexion Sec 3 (reward a success bit or scalar, memory 1-3, loop until
pass, Algorithm 1), Sec 5 sliding window, Sec 3 credit-assignment example, Sec 4.1 ALFWorld heuristic or
LLM classifier, Sec 4.2/4.3 memory 3 and 1, up to six tests; Table 1 (80.1 to 91.0, 80.1 to 77.1); Table 3
and the Sec 4.3 ablation readings ("performing harmful edits to the implementation"). Self-Refine Table 1
(64.1 to 64.1), Sec 3.3 (94%, "everything looks good"), App H.1 and Table 9 (64.06 to 68.9, refine only
when wrong). Huang et al. Table 1 (Reflexion under "Use of oracle labels"), Table 2 (89.7), Table 3 (38.1,
three calls). Kamoi et al. Sec 4 quote, TACL 2024. SCoRe Tables 2 and 3 (every cell on the page, including
c to i 4.2% and i to c 3.2%), Sec 3 (no oracle at test time), Sec 6 (binary training reward, MATH500,
trained on MBPP, second-attempt instruction does not reveal correctness, one round). ExpeL Table 3 and Sec
5.6 (39.0, 29.0, 28.0; hallucination reading). ReasoningBank Figure 7 (46.5 to 49.7, Gemini-2.5-flash,
WebArena-Shopping) and Sec 3.2 judge. Training-Free GRPO Sec 2 zero-advantage rule. Retroformer Figure 1
and the "smaller, local language model". Venues: Reflexion and Self-Refine (NeurIPS 2023 proceedings
index), Huang ICLR 2024, Kamoi TACL 2024, ExpeL AAAI 2024, ReasoningBank ICLR 2026, Retroformer ICLR 2024.

Score: 9/10. Accurate after the fixes; the ablation carries the argument and lands three times; the
section ends on the reader's next hour of work.

## AccumulatingExperience.tsx (section 13)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 13.1 | ReTool venue badge "preprint" (two Cites) | AccumulatingExperience.tsx:632, 647 | STALE | https://proceedings.iclr.cc/paper_files/paper/2026/file/4038c9208dfc22644c60ad39c24e5c53-Paper-Conference.pdf header "Published as a conference paper at ICLR 2026"; section 9 already badges it ICLR 2026 | Both badges now "ICLR 2026" |
| 13.2 | ACE online, no labels, AppWorld: "59.5 against 42.4 for the ReAct baseline" | AccumulatingExperience.tsx:594-597 | OVERREACH (metric unstated) | https://arxiv.org/abs/2510.04618v3 Table 1: 59.5 and 42.4 are the Average column over test-normal and test-challenge TGC and SGC; the same section's 63.7 is ReAct's test-normal TGC | Now "averaged 59.5 across AppWorld's test splits against 42.4" |
| 13.3 | FiNER: "ACE with labels reached 76.7" | AccumulatingExperience.tsx:599-600 | OVERREACH (setting) | ACE Table 2: 76.7 is online with labels; offline with labels is 78.3 | Now "while online ACE with labels reached 76.7" |
| 13.4 | "ACE served 91.8% of its input tokens from cache" with no model named | AccumulatingExperience.tsx:658-660 | OVERREACH (model scope dropped) | ACE Sec 4.7: "In our prompt-caching study with the OpenAI API (GPT-5.1)"; the section's other ACE figures are DeepSeek-V3.1; section 20 names GPT-5.1 | Now "In a prompt-caching study with GPT-5.1 through the OpenAI API, ACE served 91.8%..." |
| 13.5 | Voyager admission rule (GPT-4 check before a program enters the library), cite "Section 3.4" | AccumulatingExperience.tsx:584-590 | UNSUPPORTED (partial) at the cited location | https://arxiv.org/abs/2305.16291v2 Sec 2.2 and 2.3 (self-verification, then "incorporate it into the skill library"); Sec 3.4 carries the -73% ablation | Label now "Voyager, Sections 2.3 and 3.4" |

CONFIRMED: 99 of 104 claims checked. ACE Sec 2.2 (step 60, 18,282 tokens, 66.7; 122 tokens, 57.1; 63.7;
"not specific to that method"), Sec 3, 3.1, 3.2 (bullets with identifier and helpful/harmful counters,
deterministic non-LLM merge, in-place counter updates, embedding de-duplication), Table 2 (67.3, 70.7),
Sec 4.1 FiNER 139 entity types, Sec 4.4 quotes, App A.5 Table 18, App A.6 Table 21 (10K to 100K).
Dynamic Cheatsheet Sec 2.1 and 2.2 (k = 3, no labels, revise or prune), Table 2 (23.3, 26.7, 50.0), Table 3
and Sec 4.5 quote (GPT-4o-mini 16.7 to 13.3). ReasoningBank Sec 3.2 ("simple addition operation", judge
"without any ground-truth reference") and App C.1 (39.0, 49.7, 46.0, 45.5, 44.4). Memento Sec 5.5.3
("saturates quickly", about 3k). Voyager Sec 2.2 (top-5, description embedding), Sec 3.4 (-73%, "most
important"). ExpeL Sec 4.2 (count two, removed at zero), abstract expansion. CLIN Sec 3.2. Training-Free
GRPO Sec 2 ("functionally equivalent to vanilla GRPO's"; Add, Delete, Modify, Keep), Sec 3.1 Mean@32,
Table 3 (29.6, 67.0, 29.1, 33.5), Sec 4.2 cost direction. ReTool abstract ("67% accuracy with 400 training
steps", cold-start SFT then RL). Claude docs memory tool (client-side, the /memories quote, "Track memory
file sizes and cap how large a file can grow", "Periodically delete memory files"); Agent Skills overview
(about 100 tokens at startup, under 5k when triggered; neither page mentions an evaluator or reward);
Anthropic engineering post (Oct 16, 2025; future-goal quote). Venues: ACE ICLR 2026 (PDF header), Dynamic
Cheatsheet EACL 2026 (ACL Anthology 2026.eacl-long.333), CLIN COLM 2024 (OpenReview), Voyager TMLR 2024
(OpenReview), ExpeL AAAI 2024, ReasoningBank ICLR 2026, Training-Free GRPO and Memento preprints (no venue
located).

Score: 9/10. Accurate after the fixes; the step-size spectrum is a clear mental model, the strongest
number (18,282 to 122) lands three times, and the section ends on the checklist and the monitoring step.

## Known items (fc05)

- Section 11, TextGrad "Nature 2025": CONFIRMED. Crossref for DOI 10.1038/s41586-025-08661-4 gives
  Nature 639, 609-616, published online 2025-03-19, authors Yuksekgonul, Bianchi, Boen, Liu, Lu, Huang;
  the Nature page reads "Published: 19 March 2025". The metaphor quote is from arXiv v1 Sec 1 and the
  Cite label says "(arXiv v1)"; the Nature full text was not readable without access.
- Section 11, Retroformer quote: CONFIRMED in Section 3 (Notation and Formulation) of v3, after Eq. 2 and
  before the Section 4 heading. The page cites Section 3.
- Section 11, FunSearch "on the order of 10^6": CONFIRMED in the Nature main text; the cite text said
  Methods (row 11.2).
- Section 12 additions: 16.3% (MBPP Python) and 1.4% (HumanEval Python) CONFIRMED as numbers, wording
  fixed (rows 12.2, 12.3); oracle stopping 75.8 to 89.7 CONFIRMED (Huang Table 2, GPT-3.5 CommonSenseQA).
- Section 13: Dynamic Cheatsheet text "fell to 6.7% using FH" versus Table 2 GPT-4o FH 13.3 on AIME
  2024: CONFIRMED conflict; the page does not use the figure. ACE Appendix A.5, Table 18: 76.2 (with
  incremental update) and 67.3 (without), ReAct 63.7, test-normal TGC, offline, DeepSeek-V3.1:
  CONFIRMED.
- Reflexion 0.52 / 0.60 / 0.68: Table 3, "GPT-4 as the base model on HumanEval Rust - 50 hardest
  problems" (Table 2 caption: "the hardest 50 problems from HumanEval Python translated to Rust with
  MultiPL-E"). Base model 0.60 = Table 1 HumanEval (RS) GPT-4 60.0, "a single code generation sample".
  Sections 11 and 12 now state it at the same scope as section 10.

## For the orchestrator (files fc05 does not own)

- `GlossaryAndSources.tsx` L87 (id 63) lists SCoRe as "preprint": it is ICLR 2025 (oral), proceedings
  hash 871ac99fdc5282d0301934d23945ebaa. L75 (id 52) lists ReTool as "preprint": ICLR 2026 (proceedings
  PDF header).
- Register / wave2-words G5: the SCoRe "preprint, no venue in arXiv record" note is stale for the same
  reason.
- Section 10 (`RewardIsAProxy.tsx` L888-L890) compares 0.68 "against 0.60 with no reflection" and calls
  0.52 "below no loop at all". Both 0.60 rows exist in Reflexion Table 3 (base and self-reflection
  omission), so it is accurate; sections 11 and 12 now name the 0.52 comparator "no loop at all" the
  same way, at the same scope (50 hardest HumanEval problems translated to Rust, GPT-4, pass@1).

## Checks (2026-10-30, after fixes)

- typecheck: exit 0 (`tsc --noEmit`, no output)
- lint: exit 0 (`eslint src --ext .ts,.tsx --max-warnings 0`, no output)
- test: 2 files, 26 tests passed
- no-ai-tells, pinned-refs, svg-a11y, pre-overflow: PASS
