# R2b Adversarial Re-check: Factual Grounding of Scoping v2

- **Lens:** factual re-check of v2. Whether the 35 findings of R2 (factual grounding of Scoping v1) were applied, whether the claims in the revised and new text are supported by their cited register entries, whether five load-bearing numbers match their primary sources, and whether the plan is internally consistent.
- **Date:** 2026-10-17
- **Document reviewed:** `deep-dives/rl-agentic-loops/SCOPE.md` (Scoping v2, 2026-10-17)
- **Previous review:** `reviews/2026-10/R2-factual-grounding.md` (v1 verdict FAIL, 5 BLOCKER, 14 MAJOR, 16 MINOR)
- **Registers:** `research/2026-10/01-rl-foundations.md` to `06-aws-paths.md`
- **What was checked:** (1) each of the 35 R2 findings against v2 text; (2) every cited claim in the Thesis and v2 sections 8, 13, 18, 19, 20, 22 and 23 against its register entry; (3) F02-58, F02-55, F02-64, F04-26 and F04-32 at the pinned arXiv version; (4) section cross-references, the depth distribution list and the three shorter reading routes in section 2.


## R2 findings: applied?

Section numbers in the label column are v1 (as R2 used them); the note gives the v2 location.

| # | Short label (v1 section) | Status | Note (v2 location) |
|---|---|---|---|
| 1 | 60 petaflop/s-days on the wrong model (6) | APPLIED | v2 section 6, R2 text verbatim, F01-50 scope restored. |
| 2 | Best-of-n "on the same curve" (10) | APPLIED | v2 section 10, R2 text verbatim. |
| 3 | One-bit argument as Tier 2, separated from forgetting (Thesis) | APPLIED | Thesis verbatim. Section 8's own restatement of the argument drops the source's hedges; see new finding 4. |
| 4 | "Falls short" list as a law (Thesis) | APPLIED | Thesis verbatim, [our reading] plus per-study scope. |
| 5 | Reflexion ablation conditions (Thesis) | APPLIED | Thesis and section 10, plus the full loop's 0.68. |
| 6 | "Most confusion between papers" (3) | APPLIED | Section 3, with TRL expanded. |
| 7 | Clip removes the incentive (5) | APPLIED | Section 5 verbatim. |
| 8 | "Several times the compute" (6) | APPLIED | Section 6 verbatim, [derived] label present. |
| 9 | "Only from 32B" (7) | APPLIED | Section 7 verbatim. |
| 10 | Three boundary conditions as a closed rule (8) | APPLIED | Section 8, [our reading] with settings; F02-62 handed to section 9. |
| 11 | DeepSWE 42.2% as fact (9, 21) | APPLIED | Section 9 [vendor claim]; v2 section 20 "64 H100s for six days [vendor claim]". |
| 12 | F02-62 scope (9) | APPLIED | Section 9 verbatim. Section 8's closing item 5 restates F02-62 without the scope; see new finding 2. |
| 13 | Failures-as-memory rule (12) | APPLIED | Section 12 verbatim. |
| 14 | Self-Refine model (12) | APPLIED | Section 12, GPT-3.5 named. |
| 15 | CoT monitor at low optimisation (10) | APPLIED | Section 10 verbatim. |
| 16 | Serving-cost reversal is cross-model (13, 21) | APPLIED | v2 section 13 states the pair is cross-model and defers to section 20; v2 section 20 carries the R2 text, the 665,000 breakeven, the idle-GPU exclusion and the authors' model-size attribution. Register F03-91 names both models; F03-90 carries the "≈ $4" run. |
| 17 | 76-point format figure (19) | PARTIAL | The v2 section 18 row is fixed and marked contested. The withdrawn claim survives in two places: section 22 question 1 routes "format reliability" to weights, and section 18's mental model says weights hold what must be "stable under rephrasing". See new finding 1. |
| 18 | "Frameworks correct by default" (20) | APPLIED | v2 section 19 verbatim. |
| 19 | 37 against 4.4 model mismatch (13) | APPLIED | Section 13 verbatim. |
| 20 | "Stronger models need fewer samples" (15) | APPLIED | v2 section 15 verbatim, [our reading] on the inference. |
| 21 | "A general LLM is not" (18) | APPLIED | v2 section 17. The wording drifted from R2's "were not" to "were not trained for it", which adds an unsourced claim about how the models were trained; see new finding 9. |
| 22 | AReaL verl hours author-estimated (20) | APPLIED | v2 section 19 verbatim. |
| 23 | Nova two-version staleness (22) | APPLIED | v2 section 23 verbatim. |
| 24 | LoRA GRPO comparator (Thesis, 14) | APPLIED | Thesis "LoRA GRPO"; section 14 adds the full fine-tuning note. |
| 25 | "Strictly rises" cited to F03-72 (14) | APPLIED | Section 14, with gepa v0.1.4 and DSPy 3.4.1. |
| 26 | README range "near" training rollouts (14) | APPLIED | Section 14, reworded as which budget to quote; numbers match F03-73. |
| 27 | Voyager 73% as items; Anthropic hedge scope (13) | APPLIED | Section 13 verbatim. |
| 28 | "Triple tokens" (21) | APPLIED | v2 section 20, three to five times, [derived]. |
| 29 | FunSearch "works best" (15) | APPLIED | v2 section 15. |
| 30 | Exploration fix is partial (17) | APPLIED | v2 section 16. |
| 31 | Forgetting tracks KL (19) | APPLIED | v2 section 18. |
| 32 | Four-stage step IDs; 36.4% quoted from OpenRLHF (20) | APPLIED | v2 section 19, cites F05-1, F05-3, F05-4. |
| 33 | Nova-only judge, approval, scoped "none", episodic signal (22) | APPLIED | v2 section 23, all four parts. The new sentence that the prompt override "is where a customer adds the grader" goes beyond what the override allows; see new finding 13. |
| 34 | Forgetting result's tested models (8) | APPLIED | Section 8 verbatim. |
| 35 | Register and cross-document consistency | APPLIED | F04-49 now reads peer-reviewed (NeurIPS 2025 Oral); F06-16 records the Region difference; section 1 lists the four questions with their sections; the AWS key-sources line lists the 2025-12-02, 2026-03-31 and 2026-05-14 posts. |

Summary: 34 APPLIED, 1 PARTIAL (17), 0 NOT APPLIED; two APPLIED rows (21, 33) carry new wording problems recorded below (findings 9 and 13).

## New findings

2 MAJOR and 16 MINOR. No BLOCKER: no number in the checked sections contradicts its register entry or its primary source. Every ID cited in the checked sections resolves to an entry in its register.

**1. MAJOR. Sections 18 and 22: "format reliability" and "stable under rephrasing" are still routed to weights, after the R2 finding 17 fix marked that row contested.**
- Location: section 18, "Mental model: weights hold what must be fast, calibrated, stable under rephrasing or general; context holds what is specific, recent and auditable." Section 22, question 1, "or reasoning skill, per-input behaviour, latency, calibration or format reliability (weights). Section 18 is the map."
- Cited: F04-52 (through the section 18 row).
- What the register says: F04-52, "Sensitivity remains even when increasing model size, the number of few-shot examples, or performing instruction tuning." Section 18's own row: "[our reading] Whether training a format into the weights makes it reliable was not measured in the sources read." Instruction tuning is a weight update, so the one source on stability under rephrasing says weights did not deliver it, and the map says format reliability was not measured. Section 22 calls section 18 its map and then routes the contested row to weights.
- Replacement, section 18: "Mental model: weights hold what must be fast, calibrated or general; context holds what is specific, recent and auditable. [our reading] Neither store delivered stability under prompt rephrasing in the sources read: format sensitivity survived instruction tuning (F04-52)."
- Replacement, section 22 question 1: "Missing instructions, facts or procedures (context); sharpening toward answers the model can sometimes produce (inference-time sampling or RL); or reasoning skill, per-input behaviour, latency or calibration (weights). Format reliability is a contested row: measure it on the target model before choosing where it lives. Section 18 is the map."

**2. MAJOR. Section 8, closing item 5: "no inference-time loop recovers" turns two scoped studies into a universal negative.**
- Location: section 8, item 5, "What RL adds beyond the base model's pass@k, a new combination of skills (F02-50) or tool use that widens coverage (F02-62), no inference-time loop recovers."
- Cited: F02-50, F02-62.
- What the register says: F02-50, "In a synthetic string-function setup on Llama-3.1-8B-Instruct"; F02-62, "NEW (scope limited; see U11)", "The study is small: 200 training problems, 100 test problems per category, one base model." Register 02, contradiction 9, states the supported form: "composition results show gains that resampling the base does not reach (F02-50, F02-62)." The section 8 debate block and section 9 already carry these scopes (R2 findings 10 and 12); the landing sentence drops them, and "no inference-time loop" covers loops the sources did not test. The [our reading] label covers the synthesis; it does not license widening the hedge from "was not reached in two studies" to "cannot be recovered".
- Replacement: "Where RL went beyond the base model's pass@k in the studies read, with a new combination of skills (synthetic string functions on Llama-3.1-8B-Instruct, F02-50) and with tool use that widened coverage (one small study on Qwen2.5-7B-Instruct, F02-62), resampling the base model did not reach it."

**3. MINOR. Section 18 marks new reasoning skill contested with no store, while section 22 routes reasoning skill to weights.**
- Location: section 18, "*New reasoning skill: contested* (section 8; F04-49)." Section 22, question 1, "reasoning skill ... (weights)".
- Cited: F04-49.
- What the register says: F04-49 holds both halves: RLVR's gains are "bounded by the base" on one side, and "distillation can introduce new reasoning patterns from the teacher and genuinely expand the model's reasoning capabilities". So weights is supported through distillation; the contest is only over RL. F02-12 supports the same (distillation beat RL at 32B).
- Replacement, section 18 row: "*New reasoning skill: weights, through distillation from a stronger model (F04-49, F02-12); whether RL alone adds it is contested* (section 8; F04-49)."

**4. MINOR. Section 8: the restated one-bit argument drops the source's "arguably", "assuming" and "in their runs".**
- Location: section 8, "Supervised fine-tuning supplies information on every token of its target; policy gradient's single scalar reward supplies about one bit per attempt ... Their MATH run needed about 320,000 bits ... and rank-1 LoRA matched full fine-tuning for policy gradient (F02-86)."
- Cited: F02-86.
- What the register says: "Supervised learning arguably provides O(number of tokens) bits per episode"; "Assuming each completion yields a single bit of information, the whole training process only needs to absorb 320,000 bits." The Thesis keeps "in their runs" (R2 finding 3); section 8 states the LoRA result without it. The 320,000 is an assumption-based count, not a measured need.
- Replacement: "On Thinking Machines' information argument (a Tier 2 lab blog), supervised fine-tuning arguably supplies information on every token of its target, while policy gradient's single scalar reward supplies about one bit per attempt. Assuming one bit per completion, their MATH run had about 320,000 bits to absorb, against about 3M parameters in a rank-1 LoRA (Low-Rank Adaptation, a small trainable add-on to frozen weights) on Llama-3.1-8B, and in their runs rank-1 LoRA matched full fine-tuning for policy gradient (F02-86)."

**5. MINOR. Thesis, sections 8 and 20: the 8.84x token multiplier is the authors' analytical estimate for one setting, and section 20 feeds it to the calculator.**
- Location: Thesis, "at about 8.84 times the tokens per answer (F02-58)"; section 8 items 2 and 5 ("multiplies tokens by about 8.84"); section 20, "A third option, from section 8: inference-time sampling with no training, at about 8.84 times the tokens per answer (F02-58)."
- Cited: F02-58.
- What the primary source says (2510.14901v1, Sec 5.3, fetched): "our sampler generates 1/(4B) N_MCMC T times as many tokens as standard inference to generate a sequence of length T. Plugging in our experimental parameters N_MCMC=10, T=679 (our average output length for MATH500) and B=192, running inference with power sampling incurs a multiplier of 8.84x". The figure is computed from a formula at MATH500's average length, not measured across tasks, and it depends on output length and block size. The register entry does not record the inputs.
- Replacement, section 8 item 2 (the defining use): "... at about 8.84 times the tokens of standard inference, which the authors compute for MATH500 from their sampler settings (10 MCMC steps, a 679-token average output, 192-token blocks); the multiplier depends on output length and those settings (F02-58)." Section 20: "... at about 8.84 times the tokens per answer in the paper's MATH500 setting, entered as an editable multiplier (F02-58)." Register fix: add the formula and its three inputs to F02-58.

**6. MINOR. Section 8, closing item 3: the 15.0% is an absolute 15.0-point gain, and the contamination link is ours.**
- Location: section 8, item 3, "A forced opening phrase, "Let's solve this using Python.", raised MATH-500 by 15.0% on Qwen2.5-Math-7B and degraded other models (F02-55); the contamination result above applies to it (F02-56)."
- Cited: F02-55, F02-56.
- What the primary source says (2506.10947v2, Table 2, fetched): "Model Original Prompting Abs. Diff. ... Qwen2.5-Math-7B 49.4% 64.4% +15.0%"; the same table shows Qwen2.5-7B (not the Math variant) falling from 41.6% to 22.2%. "By 15.0%" reads as relative to most readers; the relative gain is about 30% [derived: 15.0 / 49.4]. Neither F02-55 nor F02-56 states that the contamination finding explains the prompt gain; that is our inference across two papers.
- Replacement: "A forced opening phrase, "Let's solve this using Python.", raised Qwen2.5-Math-7B's MATH-500 accuracy by 15.0 points (49.4% to 64.4%) and lowered it on Llama, OLMo2 and the non-Math Qwen2.5-7B (F02-55); [our reading] the contamination result above (F02-56) is about the same model and benchmark, so it applies to this gain too." Register fix: add the Table 2 rows, including Qwen2.5-7B, to F02-55.

**7. MINOR. Section 8, closing item 4: the PRM result drops its scale and test set, and DeepSeek's reasons are cut to one.**
- Location: section 8, item 4, "a PRM ... solved 78.2% of problems when choosing among 1,860 samples, against 72.4% for an ORM ... and 69.6% for majority vote, with a generator that was never RL-trained (F02-64). DeepSeek dropped PRMs as a training reward because they get reward-hacked, while a PRM still helps rerank the top answers (F02-13)."
- Cited: F02-64, F02-13.
- What the register and source say: F02-64, "trained a GPT-4-based PRM on PRM800K: 800K human step labels"; the paper (2305.20050v1, fetched): "solve 78.2% of problems from a representative subset of the MATH test set" and "All large-scale models are finetuned from the base GPT-4 model". For a reader weighing a learned verifier, the 800,000 human labels are the cost. F02-13 gives three reasons plus cost: steps hard to define, correctness hard to label at scale, reward hacking, and "its advantages are limited compared to the additional computational overhead".
- Replacement: "4. A learned verifier over a frozen generator: with GPT-4-based models, a PRM (process reward model, scoring each reasoning step) trained on 800,000 human step labels solved 78.2% of a representative subset of MATH test problems when choosing among 1,860 samples per problem, against 72.4% for an ORM (outcome reward model, scoring only the final answer) and 69.6% for majority vote; the generator was never RL-trained (F02-64). DeepSeek dropped PRMs as a training reward because steps are hard to define and label at scale and a model-based PRM gets reward-hacked, and found the benefit too small for the compute in large-scale RL; a PRM still helps rerank the top answers (F02-13)."

**8. MINOR. Thesis: the 14.2% is the dataset-wide figure, not a long-log figure.**
- Location: Thesis, "the best method located the decisive step in a long failure log 14.2% of the time (F04-26)". The wording came from R2's own replacement text for finding 4.
- Cited: F04-26.
- What the primary source says (2505.00212v3, fetched): abstract, "The best method achieves 53.5% accuracy in identifying failure-responsible agents but only 14.2% in pinpointing failure steps"; Sec 4.4, "as context length reaches its maximum, all three failure attribution methods converge to near 0%". The 14.2% covers all logs; the long-log figure is near zero. Section 17 states it correctly.
- Replacement: "and on failed multi-agent logs the best method located the decisive step 14.2% of the time, with accuracy falling as logs grew (F04-26)."

**9. MINOR. Section 17: "were not trained for it" adds an unsourced claim about how GPT-4 and its peers were trained.**
- Location: section 17, "The general LLMs tested were not trained for it: across GPT-3.5, GPT-4 and Llama2 on small bandits, only one configuration explored satisfactorily".
- Cited: F04-8 to F04-10.
- What the register says: F04-8 to F04-10 measure behaviour ("only one configuration resulted in satisfactory exploratory behavior"); none states what the models were or were not trained on, and GPT-4's training data is not public. R2's replacement read "The general LLMs tested were not:".
- Replacement: "The general LLMs tested did not show it: across GPT-3.5, GPT-4 and Llama2 on small bandits, only one configuration explored satisfactorily".

**10. MINOR. Section 13: "small models fill memory with wrong strategies" is a mechanism the entry does not state.**
- Location: section 13, "never compressing loses to curation, and small models fill memory with wrong strategies (F03-34)".
- Cited: F03-34.
- What the register says: "GPT-4o-mini under DC-Cu and DC-RS scored below its baseline on AIME 2024"; "For DC to be effective, the base model must produce correct solutions with sufficient frequency to populate the memory with high-quality, reusable strategies."
- Replacement: "never compressing loses to curation, and GPT-4o-mini scored below its own baseline on AIME 2024, since the memory needs the model to solve instances often enough to fill it with good strategies (F03-34)".

**11. MINOR. Section 19: two figures lose their scope.**
- Location: section 19, "72.1% of a 309-hour Skywork-OR1-32B run" and "colocating every model won from 16 to 64 GPUs, split placement at 96 to 128 (F05-5)".
- Cited: F05-42, F05-5.
- What the register says: F05-42, Table 7 caption "Analysis of training time usage of Skywork-OR1-32B for 1000 training steps"; the 309 hours are for those 1,000 steps, which the register does not equate with the full run. F05-5, "For 96 to 128 GPUs with 34B models and 96 GPUs with 13B models, the split strategy becomes optimal."
- Replacement: "72.1% of 309 hours over 1,000 training steps of Skywork-OR1-32B" and "in HybridFlow's runs, colocating every model won from 16 to 64 GPUs, and split placement won at 96 GPUs for 13B models and at 96 to 128 for 34B models (F05-5)".

**12. MINOR. Section 20: "no typical job length was located" omits the first-party job-length statement in the register.**
- Location: section 20, "Managed RL is priced per training hour, $80.00 for the open-weight models on Bedrock reinforcement fine-tuning (F06-16); no typical job length was located in this research."
- Cited: F06-16 (F06-11 not cited).
- What the register says: F06-11, "The RFT job can take a few hours depending on the size of your training data, number of epochs, and complexity of your reward functions." (Nova job page.) The hedge is honest about a typical figure, but the calculator needs the only first-party order of magnitude available.
- Replacement: "Managed RL is priced per training hour, $80.00 for the open-weight models on Bedrock reinforcement fine-tuning (F06-16). The Nova job page says a job "can take a few hours depending on the size of your training data, number of epochs, and complexity of your reward functions" (F06-11); no typical job length for the open-weight models was located in this research."

**13. MINOR. Section 23: a prompt override cannot add a programmatic grader.**
- Location: section 23, "the strategy's prompts can be overridden (F06-50, F06-52); [our reading] that verdict reads the transcript with no external check, the kind of signal sections 10 and 12 identify as weak, so the override is where a customer adds the grader."
- Cited: F06-50, F06-52.
- What the register says: F06-50, "Built-in with overrides strategies let you override the default behavior of the built-in strategies by providing your own instructions and selecting a specific foundation model for the extraction and consolidation steps"; "Self-managed strategies run the customer's own pipeline and write with `BatchCreateMemoryRecords`, `BatchUpdateMemoryRecords`, `BatchDeleteMemoryRecords`." An override changes the judge's instructions and model; it cannot run tests. An execution-grounded grader needs the self-managed path.
- Replacement: "Its default signal is an LLM's yes-or-no verdict on whether the goal was achieved, and the extraction and consolidation prompts, and the model that runs them, can be overridden (F06-50, F06-52). [our reading] That verdict reads the transcript with no external check, the kind of signal sections 10 and 12 identify as weak. An override can tell the judge to rely on evidence in the transcript, such as test output; a programmatic grader needs a self-managed strategy, which runs the customer's own pipeline and writes records through the batch APIs (F06-50)."

**14. MINOR. Section 23: "from first-party AWS sources" includes one third-party source.**
- Location: section 23, "Two stacks, from first-party AWS sources, placed after the choice".
- Cited: F06-48 (inside the section).
- What the register says: F06-48, "This is Hugging Face code, not an AWS first-party source; it records what the library offers, not what AWS supports."
- Replacement: "Two stacks, from first-party AWS sources plus one Hugging Face library inventory for Trainium (F06-48), placed after the choice".

**15. MINOR. Section 23: the 66% quote drops "on average".**
- Location: section 23, "The "up to 66%" improvement figure is a vendor claim with no method on the page (F06-10)." The same short form appears in "Still to secure".
- Cited: F06-10.
- What the register says: "Reinforcement fine-tuning improves model accuracy by up to 66% on average compared to base models." The labelling is right; the quotation is cut.
- Replacement: "AWS's figure, accuracy "by up to 66% on average compared to base models", is a vendor claim with no method on the page (F06-10)."

**16. MINOR. Sections 22 and 23 promise an AWS service for every path; two paths have none.**
- Location: section 22, "The paths that follow, each naming the AWS service that runs it in section 23"; section 23, "placed after the choice so each path from section 22 can find its service".
- Cited: none.
- What the plan says: section 23 names services for the weights paths, the managed words loops and self-run loops; it names nothing for "inference-time sampling" or "an advisor". No register entry was located for either on AWS, so the fix is wording, not new facts.
- Replacement, section 22 lead-in: "The paths that follow, with the AWS service for each where one exists (section 23):". Optional addition to section 23 after the Self-run sentence: "[our reading] Two paths from section 22 have no dedicated service: inference-time sampling runs against any model endpoint, and an advisor is a small open-weight model trained with SageMaker AI RFT or training sessions (F06-24, F06-31) in front of a Bedrock model."

**17. MINOR. Connections: the Caching pointer still names section 13.**
- Location: "Caching: prefix caching rules that an evolving playbook defeats (sections 13, 17, 20)".
- What the plan says: section 13 has no caching content in v2. R3's ownership note: "15 owns the single loop checklist and the stable prefix, 17 owns the caching mechanism"; section 20 carries the 82.6% figure.
- Replacement: "Caching: prefix caching rules that an evolving playbook defeats (sections 15, 17, 20)".

**18. MINOR. Section 2: route 2 skips section 17, which the map and the choice depend on for one of their rows.**
- Location: section 2, "I advise a team choosing between reinforcement fine-tuning and prompting": 1, 2, 3, 7, 8, 10, 14, 16, 18, 20, 22, 23.
- What the plan says: section 18 says "A row carries evidence only where no other section owns it", and its row "*Exploration, learning from failure and long-horizon credit: weak in context* (section 17)" carries no evidence of its own. Section 22 uses section 18 as its map, and section 1 assigns the dive's third question ("where the words fall short") to section 17. A reader on route 2 meets that row as a bare conclusion. Routes 1 and 3 check out against their endpoints (see below).
- Replacement: "I advise a team choosing between reinforcement fine-tuning and prompting": 1, 2, 3, 7, 8, 10, 14, 16, 17, 18, 20, 22, 23.

### Internal consistency checks that passed

- Depth distribution: the list matches every per-section Depth tag. Survey 1, 2, 24 (3); mechanism 3, 4, 5, 6, 9, 10, 11, 12, 16, 18, 19 (11); deep 7, 8, 13, 14, 17 (5); applied 15, 20, 21, 22, 23 (5); 24 sections across layers A to G (7).
- Cross-references: every "section N" pointer in sections 1 to 24 lands on the section that owns the content, except the two recorded above (finding 16, the promised service per path; finding 17, Caching). Checked pointers include 6 to 19 (four models in memory), 7 to 22 (base-rate check), 8 to 9 (F02-62's instance), 10 to 15 and 12 (Ralph, autoresearch, Reflexion), 11 to 12, 13 and 17, 13 to 20 (cost pair), 15 to 17 (caching mechanism), 23 to 19 (asynchronous design). The thesis and section 1 both send the choice to 22, and the "three decision questions" are the same three in both places.
- Routes 1 and 3: route 1 contains 8, 10, 18 and 20, the sections section 22 says it is built from, and 13, 14 and 17, which section 18 points to. Route 3 (2 to 10, 19 optional) contains everything section 10 builds on; its forward pointers to 12 and 15 are previews, as section 2 says. Route 2 includes the 3, 7, 10, 14 and 16 that R1 asked for.
- The v1-to-v2 renumbering note in the review notes matches the mapping given for this re-check, and the R2 and R3 notes cite v2 numbers correctly.

## Verified against primary source

Each entry: claim, URL fetched on 2026-10-17 (arXiv HTML at the pinned version, read as text), what was seen. All five requested fetches succeeded; one extra fetch settled a wording question in section 8.

1. **F02-58, power sampling against GRPO.** https://arxiv.org/html/2510.14901v1 . Table 1: "Qwen2.5-Math-7B Base 0.496 0.329 0.278 1.61 / Low-temperature 0.690 0.512 0.353 2.09 / Power Sampling (ours) 0.748 0.573 0.389 2.88 / GRPO (MATH) 0.785 0.537 0.399 2.38" (MATH500, HumanEval, GPQA, AlpacaEval2.0); caption "Power sampling (ours) matches and even outperforms GRPO across model families and tasks." Sec 5.3: "Plugging in our experimental parameters N_MCMC=10, T=679 (our average output length for MATH500) and B=192, running inference with power sampling incurs a multiplier of 8.84x the number of tokens as running standard inference." All four numbers match the register and SCOPE; the multiplier's derivation is finding 5. The low-temperature row (0.690) is not used in SCOPE.
2. **F02-55, the forced Python opening.** https://arxiv.org/html/2506.10947v2 . Sec 5.3: "With prompting (forcing responses to begin with "Let's solve this using Python."), MATH-500 accuracy improves by 24.2%, 15.0%, and 10.0% for Qwen2.5-Math-1.5B, Qwen2.5-Math-7B, and Qwen2.5-1.5B, respectively (Table 2), while performance degrades for other models such as Llama and OLMo2". Table 2: "Model Original Prompting Abs. Diff. ... Qwen2.5-Math-7B 49.4% 64.4% +15.0%", and Qwen2.5-7B falls from 41.6% to 22.2%. The number matches; it is an absolute difference (finding 6).
3. **F02-64, PRM against ORM and majority vote.** https://arxiv.org/html/2305.20050v1 . Figure 3 table: "ORM PRM Majority Voting % Solved (Best-of-1860) 72.4 78.2 69.6"; "the 1860 solutions we generated in total per problem"; "We use our state-of-the-art PRM to solve 78.2% of problems from a representative subset of the MATH test set"; Sec 2.1 "We do not attempt to improve the generator with reinforcement learning (RL)"; Sec 2.2 "All large-scale models are finetuned from the base GPT-4 model". Numbers match; scope is finding 7.
4. **F04-26, Who&When failure attribution.** https://arxiv.org/html/2505.00212v3 . Abstract: "failure logs from 127 LLM multi-agent systems ... The best method achieves 53.5% accuracy in identifying failure-responsible agents but only 14.2% in pinpointing failure steps, with some methods performing below random." Sec 4.4: "as context length reaches its maximum, all three failure attribution methods converge to near 0%" and "Finding 4: Failure attribution performance declines as context length increases, with step-level accuracy being more sensitive." Numbers match; the Thesis's "in a long failure log" is finding 8.
5. **F04-32, RULER effective length.** https://arxiv.org/html/2404.06654v3 . Table 3: "Models Claimed Length Effective Length ... GPT-4 128K 64K 96.6 96.3 95.2 93.2 87.0 81.2"; caption "The performance exceeding the Llama2-7B performance at 4K (85.6%) is underlined. The effective context length is the maximum length passing this threshold." GPT-4 matches. The register's other two rows also match Table 3 ("Llama3.1 (8B) 128K 32K", "Yi (34B) 200K 32K"); the appendix per-task tables give different lengths for these models, so quote Table 3 only.
6. **F02-89, entropy budget (extra).** https://arxiv.org/html/2505.22617v1 . Sec 2: "Figure 2 illustrates the average normalized entropy consumption/performance gain in percentage throughout 2400-gradient step RL runs with 11 different models. We can see that 73% of the entropy consumption and 76% of the performance gain occurred in just the first 200 gradient steps". Confirms section 8's "across 11 base models from four families", which the register keeps in separate sentences; no finding.

## Verdict

**PASS WITH FIXES.**

v2 applied 34 of R2's 35 findings in full and one in part. All five former BLOCKERs are fixed, with the replacement text or text at least as accurate, and every number in the Thesis and sections 8, 13, 18, 19, 20, 22 and 23 matches its register entry. The five primary-source spot checks (F02-58, F02-55, F02-64, F04-26, F04-32) matched their registers, as did the extra check of F02-89. Nothing found is a BLOCKER. Two MAJOR findings remain. First, the decision framework still routes "format reliability" and "stable under rephrasing" to weights, after the map was corrected to mark format reliability contested (finding 1, the unfinished part of R2 finding 17). Second, the new closing block of section 8 lands on "no inference-time loop recovers", a universal claim built on two scoped studies (finding 2). The 16 MINOR findings restore dropped scope (the 8.84x multiplier's setting, the PRM's 800,000 labels, the 14.2% as a dataset-wide figure, Skywork's 1,000 steps), fix two quotations (15.0 points, "on average"), correct what an AgentCore prompt override can do, and tidy four plan-level inconsistencies (reasoning-skill row, services per path, the Caching pointer, route 2). Each has exact replacement text. Once findings 1 and 2 are applied, the factual grounding no longer blocks the build; the MINOR fixes can go in while sections are drafted.
