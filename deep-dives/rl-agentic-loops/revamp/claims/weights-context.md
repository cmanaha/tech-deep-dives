# Claims: section 18, What Lives in Weights & What Lives in Context (`WeightsVsContext.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Sources re-opened on 2026-10-30: arXiv PDF 2312.05934v3 (text extracted; Sections 3.2, 4.1, 4.3,
4.4, 5, 6, Table 2); arXiv abstract and HTML 2310.11324v2 (abstract, section list: grammar in 3.1,
casing example in 4.3; authors Sclar, Choi, Tsvetkov, Suhr; comments "ICLR 2024 Camera Ready
version"); arXiv PDF 2404.10859v2 (header "Published as a conference paper at COLM 2024"; abstract,
Sections 4, 4.1, 4.2, 5, footnote 6); arXiv PDF 2303.08774v6 (Section 5 Limitations, Figure 8 plot
labels and caption); arXiv abstract 2209.15189v1 (no venue on the record); arXiv abstract
2509.04259v1; arXiv abstract 2504.13837v5 (journal ref "NeurIPS 2025 Oral"). DeepSeek-R1 Table 16
was re-opened by fc07 in the v2 PDF (Supplementary F.1): Distill-Qwen-32B 72.6 / 83.3 / 94.3 / 62.1 / 57.2
against Qwen2.5-32B-Zero 47.0 / 60.0 / 91.6 / 55.0 / 40.2.

Notes for the fact checkers:
- The two ECE values (0.007 pre-train, 0.074 post-trained) are printed on the Figure 8 plots of the
  GPT-4 report ("ECE: 0.007", "ECE: 0.074"); the report does not expand ECE, so the page says
  "the calibration error printed on the report's two plots". No register row carries these two
  numbers; they are new, read at the source.
- Ovadia's FT-reg + RAG (0.810 on Mistral 7B) and the Orca2 and Llama2 rows are new from Table 2
  (register F04-43 quotes only Mistral and the Llama2 FT-reg drop).
- The 910-question count, the August to November 2023 window and "ten paraphrases for each chunk"
  are new, from Sections 4.3 and 4.4.
- Zhang et al.: the held-out-task result (Section 5) and "full coverage" (Section 4.2) are new.
- Sclar et al.: FormatSpread "without accessing model weights" is new, from the abstract.
- Diagram marks (best kept here, possible with a cost, weak, not measured, contested) are our
  reading, said so in the caption. Contested rows follow SCOPE section 18 (format; new reasoning
  skill).
- Rows owned elsewhere carry no evidence or numbers here: procedures (sections 13, 14),
  sharpening (section 8), exploration and credit (section 17); DeepSeek's 32B figures stay in
  section 7, the pass@k debate in section 8, GEPA's AIME and LiveBench-Math figures in section 14.

## Intro (h1)

- Weights are changed by a training run; context is the text a frozen model reads at each call | definition, dive vocabulary | SCOPE thesis
- On post-cutoff news multiple-choice questions, with a matching document per question, retrieval scored 0.875 on Mistral 7B against 0.504 for fine-tuning on the same documents | https://arxiv.org/abs/2312.05934v3 | F04-43; wave2-limits row 33
- Section 22 starts from this classification | SCOPE section 18 ("main input to section 22") | -

## Map (diagram and pointer paragraph)

- Cell marks are our reading of the cited studies | our reading | SCOPE section 18 rows
- Every number in the map (0.504, 0.588, 0.875, 0.481, 76 points, over 60% on five) is cited in the blocks below | see rows below | -
- Instructions and procedures: context when a reliable signal writes them (pointer to sections 13, 14) | pointer | SCOPE section 18 row 2; F04-37, F04-46 (owned by 13, 14)
- pass@1 / pass@k definitions | definition | wave2-foundations row 5
- Sharpening: weights through RL or bought per query (pointer to section 8) | pointer | SCOPE section 18 row 3
- Exploration, learning from failure, long-horizon credit weak in a general model's context (pointer to section 17) | pointer | SCOPE section 18 row 8
- Weights cell "Where it is trained in: section 17" | pointer to section 17's trained-in in-context RL (AD, DPT) | SCOPE section 17; F04-1 to F04-6

## Facts after the cutoff

- 910 multiple-choice questions about US events, August to November 2023, after the models' cutoff, built from Wikipedia chunks | https://arxiv.org/abs/2312.05934v3 (Sections 4.1, 4.3) | new (read at source); wave2-limits row 33 (task description)
- RAG puts best-matching chunks into the context at question time | https://arxiv.org/abs/2312.05934v3 (Section 3.3, Section 5 configuration, K in 0 to 5) | definition
- Unsupervised fine-tuning = continued next-token training on raw text, no labels | https://arxiv.org/abs/2312.05934v3 (Section 3.2) | new; SCOPE review R1 (define unsupervised fine-tuning)
- Mistral 7B: base 0.481, RAG 0.875, FT on text 0.504, FT on paraphrases 0.588 | https://arxiv.org/abs/2312.05934v3 (Table 2) | F04-43; wave2-limits row 33
- Ten paraphrases per chunk | https://arxiv.org/abs/2312.05934v3 (Section 4.4) | new
- Accuracy rose monotonically with the number of paraphrases, all models | https://arxiv.org/abs/2312.05934v3 (Section 6, Figure 4) | new (F04-43 abstract quote covers the direction)
- Fine-tuned Mistral with retrieval 0.810, below retrieval on the base | https://arxiv.org/abs/2312.05934v3 (Table 2) | new
- "RAG proves particularly effective due to the one-to-one correspondence between the questions and the auxiliary dataset" | https://arxiv.org/abs/2312.05934v3 (Section 5) | wave2-limits row 33
- The 0.875 measures retrieval when the answer is always in the corpus; check your retriever's hit rate | our reading | wave2-limits row 33 condition
- Expandable: Llama2 7B 0.353 / 0.585 / 0.219 / 0.392 / 0.326 / 0.520; Orca2 7B 0.456 / 0.876 / 0.511 / 0.566 / 0.820 / 0.826; Mistral FT-par + RAG 0.830 | https://arxiv.org/abs/2312.05934v3 (Table 2) | F04-43 (Llama2 FT-reg); rest new
- Numbers identical in arXiv v3 and the EMNLP 2024 proceedings; venue EMNLP 2024 | https://aclanthology.org/2024.emnlp-main.15/ | wave2-limits G1

## Constraints and output format (contested)

- Prompt format = meaning-preserving layout choices: separators, spacing, casing; changing only the casing is one such change | https://arxiv.org/abs/2310.11324v2 (Sections 3.1, 4.3) | wave2-limits row 41 (format, not wording); new (section locations)
- Up to 76 accuracy points on LLaMA-2-13B, few-shot; sensitivity remains with model size, more few-shot examples, instruction tuning | https://arxiv.org/abs/2310.11324v2 (abstract) | F04-52; wave2-limits row 35
- Format performance only weakly correlates between models | https://arxiv.org/abs/2310.11324v2 (abstract) | F04-52; wave2-limits row 35
- A format rule a text loop finds may not survive a model change; part of what a loop learns about format is search over layouts | our reading | SCOPE section 18 row 4; F04-52 use-in-dive
- Whether training one specific format into the weights makes it reliable was not measured in the sources read | hedge | SCOPE section 18 row 4 ([our reading])
- Report accuracy as a range across plausible formats; FormatSpread estimates it "without accessing model weights" | https://arxiv.org/abs/2310.11324v2 (abstract) | new
- "so it applies to a model you reach only through an API" | https://arxiv.org/abs/2310.11324v2 (Section 1: "does not require access to the model weights, allowing its use on API-gated models"; cite now abstract and Section 1, fc07) | -

## Calibration and token cost

- h2 description: the two gaps these studies place in the weights, outputs whose spread a prompt did not fix (Zhang et al.) or whose confidence training moved (GPT-4 report), and instructions paid for on every call | our reading of the rows below | fc07 narrowed (no prompt was tested on calibration)
- Diffuse distribution and calibration definitions | https://arxiv.org/abs/2303.08774v6 (Section 5: "predicted confidence in an answer generally matches the probability of being correct"); 2404.10859v2 Section 2 | definition; SCOPE review R1 (diffuse example)
- Llama-2-13B-chat disproportionately favours five when asked for a uniform 1 to 10 pick | https://arxiv.org/abs/2404.10859v2 (abstract) | F04-50; wave2-limits row 36
- Temperature one; Gemma and Llama-2 put over 60% on five; in 1,000 samples none of the three models produced all ten | https://arxiv.org/abs/2404.10859v2 (Sections 4, 4.1) | F04-50; wave2-limits row 36
- The prompt asked for randomness (the context-side lever) | https://arxiv.org/abs/2404.10859v2 (Section 4.1: "Despite the prompts asking for randomness") | our framing of a sourced fact
- Fine-tuning for a uniform 1 to 10 distribution gave near-uniform output with full coverage | https://arxiv.org/abs/2404.10859v2 (Section 4.2) | new (F04-50 "a fine-tuning method fixes it")
- Untuned models need temperature above 10 to match the tuned entropy; higher temperature rarely used because of degeneration | https://arxiv.org/abs/2404.10859v2 (footnote 6) | F04-50; wave2-limits row 36
- Tuned on five tasks, more diffuse output on a held-out sixth | https://arxiv.org/abs/2404.10859v2 (Section 5) | new
- GPT-4 pre-trained model highly calibrated on an MMLU subset; post-training "hurts calibration significantly" | https://arxiv.org/abs/2303.08774v6 (Section 5, Figure 8) | F04-51; wave2-limits row 37 (one direction only)
- Calibration error printed on the plots 0.007 (pre-train) and 0.074 (post-trained) | https://arxiv.org/abs/2303.08774v6 (Figure 8 plot labels "ECE: 0.007" and "ECE: 0.074", text in the PDF, checked by fc07) | new
- GPT-4 report Cite: Tier 2 (first-party lab measuring its own model) with a "technical report" badge, no peer-reviewed venue | https://arxiv.org/abs/2303.08774v6 | fc07 (known item)
- Spread and confidence are properties of the probabilities the weights assign; the instruction did not produce the distribution | our reading | F04-50, F04-51 use-in-dive
- Test the row by sampling one prompt 1,000 times and counting distinct answers | derived from the study protocol (Section 4: 1,000 generations per task) | -
- Gains from instructions or a scratchpad disappear "when the context tokens are gone" | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45; wave2-limits row 38
- Context distillation: answer with instructions in context, then fine-tune to give that answer from the task input alone | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45; wave2-limits row 38
- Internalises abstract task instructions; can be repeated to update with new instructions and overwrite old ones | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45 (new: overwrite clause)
- Bridge from a text loop to a weight update; distil settled text, keep changing text in context | our reading | F04-45 use-in-dive
- Prompt caching prices a stable prefix and re-prices an edited one (pointer to section 17) | pointer | SCOPE section 17; F04-38 to F04-40

## Retention and new reasoning skill

- Frozen weights keep old abilities by construction | definition | SCOPE section 18 row 7
- SFT definition | definition | dive vocabulary (section 8 wording)
- Forgetting determined by the distributional shift, measured as the KL between fine-tuned and base policy on the new task | https://arxiv.org/abs/2509.04259v1 (abstract) | F04-47; wave2-limits row 39; venue ICLR 2026 per wave2-foundations
- Why RL moves less than SFT (pointer to section 8) | pointer | F02-87
- KL as a number to watch while training, beside evaluations of what must be kept | our reading | F04-47 use-in-dive
- Context-side risk: a store polluted by misleading feedback (pointer to section 13) | pointer | F04-37
- Distillation "can introduce new reasoning patterns from the teacher" | https://arxiv.org/abs/2504.13837v5 (abstract) | F04-49; wave2-limits row 40
- At 32B, a model distilled from DeepSeek-R1 with no RL stage beat RL on the same Qwen2.5-32B base on every benchmark reported; figures in section 7 | https://arxiv.org/abs/2501.12948v2 (Supplementary F.1, Table 16) | F02-12; wave2-rlvr row 10; wave2-limits row 40; task note (Qwen's base)
- Context distillation internalised step-by-step reasoning for 8-digit addition; capability helped other downstream tasks | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45
- RLVR models beat base at small k; base higher pass@k at large k | https://arxiv.org/abs/2504.13837v5 (abstract) | F02-40, F04-49; wave2-rlvr row 1
- Whether RL alone adds new skill is contested; debate in section 8 | pointer | F04-49; SCOPE section 18 row 9
- Prompt optimiser fell short of RL on AIME and came within a point on the other math benchmark, same 8B model (pointer to section 14, no figures) | pointer | F03-62; PromptOptimization.tsx L603

## Mental model

- Weights hold what must be fast, calibrated or general; context holds what is specific, recent and auditable, with one-line reasons | our reading | SCOPE section 18 mental model; F04 section 4 item 6 (minus "stable under rephrasing")
- Held-out task in the number study as the "general" example | https://arxiv.org/abs/2404.10859v2 (Section 5) | new
- Neither store delivered stability under changes to prompt format in the sources read; format sensitivity survived instruction tuning | https://arxiv.org/abs/2310.11324v2 (abstract) | wave2-limits row 41 replacement text

## Classify your gap (table and ending)

- One row per kind of improvement with a diagnostic question, a store and a next check; questions and checks restate the rows above | our reading | SCOPE section 18 rows
- "The 0.875 against 0.504 came with a matching document for every question" | https://arxiv.org/abs/2312.05934v3 | wave2-limits row 33
- Section 17's next check "keep the statistics in code and hand the model a summary" | pointer | SCOPE section 17 practical value
- Section 22's three questions (kind of gap; signal and today's score; can you touch the weights and how many queries) | pointer | SCOPE thesis paragraph 4
