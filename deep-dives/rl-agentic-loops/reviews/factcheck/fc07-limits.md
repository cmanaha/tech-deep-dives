# fc07-limits: fact check of sections 17 (Where Words Fall Short) and 18 (What Lives in Weights & What Lives in Context)

Agent fc07, 2026-10-30. Pin: verl v0.9.1 (`agent_loop.py`, `core_algos.py` read through `gh api ...?ref=v0.9.1`).
Papers read as `pdftotext` of the versioned arXiv PDF each Cite carries (18 PDFs); the EMNLP 2024
proceedings PDF of Ovadia et al. (https://aclanthology.org/2024.emnlp-main.15.pdf); Figure 5 of
2504.16078v1 rendered to PNG and read. Fetched 2026-10-30: Anthropic prompt-caching docs, Amazon Bedrock
prompt-caching user guide, ICLR 2023 and ICLR 2026 virtual poster pages, NeurIPS 2023 proceedings page
for DPT, ACL Anthology page for TACL 2024.tacl-1.9, ICLR 2026 proceedings listing for RL's Razor (search).

Status: COMPLETE. Fixes applied to both section files and both claims lists. No diagram was touched, so
the render harness was not re-run. Typecheck, lint, tests (26 passed) and the four gates pass.

## WhereWordsFallShort.tsx (section 17)

Claims checked: 64 (54 claim-list lines plus 10 venue badges). CONFIRMED 57; WRONG 4; STALE 1; OVERREACH 2;
UNSUPPORTED 0. Prose-rule scan clean before and after.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 17-1 | Knowing-doing gap: "even when its rationale was correct it chose the greedy action more often than the optimal one, 58% against 21%" (three landings) | WhereWordsFallShort.tsx:268-271, 416-418, 680-682 | WRONG (denominator) | https://arxiv.org/pdf/2504.16078v1 Figure 5 (page 7, rendered): cells True row 58.1 / 21.6 / 10.6, False row 7.2 / 0.6 / 2.0, summing to 100, so 58 and 21 are shares of all actions. The paper's text words them as conditional ("even for correctly computed rationales ... greedy action (58%)"); as a share of correct-rationale actions greedy is 58.1 / 90.3 = 64% | All three landings now read "even with a correct rationale it chose the greedy action more often than the optimal one, in 58% of all its actions against 21%". The comparison and the strongest number stay; first Cite now names Figure 5 |
| 17-2 | Expandable: the introduction's 64% and Section 4.2's 58% presented as a discrepancy (known item) | WhereWordsFallShort.tsx:478-487 | WRONG (framing) | Same Figure 5: the introduction's "64% of actions when rationale is correct" is the conditional share of the same row (58.1 / 90.3 = 64.3%), so the two figures agree on different denominators. The real source conflict is elsewhere: the text and caption give 87% correct rationales ("sum of top row") while the row sums to 90.3 | Expandable now explains the two denominators (our arithmetic labelled) and states the 87% against 90.3% conflict as a source conflict, no page-history voice |
| 17-3 | LLMs are Greedy Agents badged "preprint"; expandable says "on Gemma2 in a 2025 preprint" | WhereWordsFallShort.tsx:272, 411, 419, 455, 485 | STALE | ICLR 2026 poster: https://iclr.cc/virtual/2026/poster/10006711 (title and five authors match; OpenReview weUP6H5Ko9). arXiv v1 record carries no venue | Four Cites set to `venue="ICLR 2026"`; text "in an ICLR 2026 paper" |
| 17-4 | Who&When: "the best automated method identified the responsible agent 53.5% of the time and the decisive step 14.2% of the time" | WhereWordsFallShort.tsx:529-533 | WRONG | https://arxiv.org/pdf/2505.00212v3 Table 1: all-at-once is best at agent level (54.33, 55.17, 51.12, 53.44: mean 53.5), step-by-step best at step level (25.51, 7.02, 15.31, 8.77: mean 14.2). Two methods; the abstract's "The best method achieves 53.5% ... but only 14.2%" merges them | "the best automated method at naming the responsible agent was right 53.5% of the time, and the best at finding the decisive step, a different method, 14.2%"; Cite now Abstract and Table 1 |
| 17-5 | Lost in the Middle badged "TACL 2023" | WhereWordsFallShort.tsx:591 | WRONG (venue year) | https://aclanthology.org/2024.tacl-1.9/ : "Transactions of the Association for Computational Linguistics, 12:157-173", 2024. The arXiv comment says accepted 2023; Compact-Bench also cites it as Liu et al. 2024a | `venue="TACL 2024"` |
| 17-6 | Intro: "The studies read for this dive say a frozen model proposes well and keeps score poorly, and that its context behaves like a working set with a cliff" | WhereWordsFallShort.tsx:263-265 | OVERREACH | The proposer/statistician split and the working-set metaphor are the dive's reading (labelled as such at L444); no study says "working set with a cliff". Closest sources: 2502.00225v4 Conclusions (LLMs useful as exploration oracles, weak at exploitation), RULER Table 3 | "In our reading of the studies collected here, a frozen model proposes well ..." |
| 17-7 | Change 1: "When the history needs shortening, extract it mechanically: ... mechanical extraction kept 79.1%" | WhereWordsFallShort.tsx:682-685 | OVERREACH | https://arxiv.org/pdf/2610.31710v2 "What the retention gap measures": 79.1% is the `anchor_index` mechanical *reference* for detail retention, not a compaction method tested on task completion; abstract: "retaining relevant information alone does not ensure successful continuation" | Recommendation labelled "(our reading)", narrowed to extracting details rather than asking a model to summarise them, and "a mechanical extraction reference" |

Confirmed, with evidence (summary):
- Algorithm Distillation 2210.14215v1: abstract quote; ED baseline definition (Sec 5 baselines); "AD maximizes the episodic return with in-context RL while ED does not learn" (text with Fig. 4); "2-4 episodes" (Fig. 7 text); long-episode limitation (Conclusion). Venue ICLR 2023: https://iclr.cc/virtual/2023/poster/11148 (top 5%).
- DPT 2306.14892v1: abstract (optimal action, exploration online and conservatism offline, posterior sampling); Sec 3 (random interactions, expert demonstrations, rollouts); Sec 6 ("fits the pretraining distribution exactly with enough coverage and data"); Limitations ("slight loss in performance", "instruction-finetuned models"). Venue NeurIPS 2023: proceedings page, Main Conference Track. Cross-section DPT condition holds.
- Krishnamurthy et al. 2403.15371v3: abstract quotes; Sec 2 prompt design ("number of plays and average rewards of each arm"); Fig. 1 greedy definition; NeurIPS 2024 (PDF footnote).
- Greedy Agents Sec 4.2: 40% / 65% coverage on 10 arms (these are the with-chain-of-thought figures; without CoT all models covered 25%, so the page shows the favourable case), "prematurely commits to a greedy strategy", 64 instances, 50 timesteps, Gemma2 27B only.
- Explore or Exploit 2502.00225v4: abstract ("all LLMs we study perform worse than a simple linear regression, even in non-linear settings"); Sec 1 model list includes GPT-5.2; small tasks fine, degrades when moderately sized; reasoning models most promising; Sec 2 tool use on GPT-4 family ("GPT-5 models are not configured for tool use"), CI lifted GPT-4 above GPT-5.2 and made it "much slower and much more expensive"; Takeaways quote citing Krishnamurthy et al. and Nie et al. 2024; proposer quote; UAI 2026 (PDF footnote).
- verl v0.9.1: `agent_loop.py#L143-L148` (`rm_scores = torch.zeros_like(...)`, `rm_scores[-1] = reward_score`); `core_algos.py#L304-L331` (sum, group mean/std by index, `* response_mask`). Section 9 walks the same code (AgenticRl.tsx:592, 601).
- Who&When: 127 systems, some below random (all-at-once step level 12.50 and 3.51 against random 19.06 and 4.16), Sec 4.4 Finding 4 and "converge to near 0%"; ICML 2025 (PMLR 267 footer).
- TRAIL 2505.08638v3: CodeAct single-agent SWE-bench split with Claude 3.7 Sonnet; Table 1 best Loc. Acc. 0.238 (Gemini 2.5 Pro); o1, o3, Claude 3.7 Sonnet "CLE" (3 of 8). No venue located (preprint).
- RULER 2404.06654v3 Table 3 GPT-4 row 96.6 / 96.3 / 95.2 / 93.2 / 87.0 / 81.2, claimed 128K, effective 64K, threshold 85.6 (Llama2-7B at 4K); abstract "only half"; COLM 2024 (PDF header). Diagram numbers match.
- Lost in the Middle abstract quote.
- Anthropic prompt caching (fetched): "100 percent identical prompt segments"; tools, system, messages hierarchy, "Changes at each level invalidate that level and all subsequent levels"; read 0.1x with per-model exceptions (17 of 21 table rows at 0.1x; Fable 5.1 and Mythos 5.1 at 0.025x, Opus 5.5 and Sonnet 5.5 at 0.05x), so "on most models" holds; 5-minute write 1.25x. The 12.5x arithmetic holds for the 0.1x models.
- Bedrock prompt caching (fetched): "Changes to a prompt prefix in subsequent requests result in cache misses."; implicit caching static-first advice; "best effort ... doesn't guarantee a cache hit"; "Support for prompt caching doesn't guarantee a cache hit for any request. Check the cache usage fields in the model response".
- Compact-Bench 2610.31710v2 abstract: 5-64% of 22, 14 backbones, 16.0% against 79.1%. No venue (preprint).
- Hedges U13, U14 (narrowed), U15 ship with scope intact. Cross-references to sections 9, 15, 18 check out.

## WeightsVsContext.tsx (section 18)

Claims checked: 71 (63 claim-list lines plus 8 venue badges). CONFIRMED 68; OVERREACH 1; UNSUPPORTED 1 (cite
location); labelling fix 1 (known item). Prose-rule scan clean before and after.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 18-1 | h2 description: "the two gaps a prompt did not close in these studies: outputs whose spread or confidence is wrong, and instructions paid for on every call" | WeightsVsContext.tsx:668 | OVERREACH | No prompt was tested on calibration: the GPT-4 report shows post-training moved it ("hurts calibration significantly", Fig. 8). Only the spread result (2404.10859v2 Sec 4.1, "Despite the prompts asking for randomness") tested a prompt | "Recognise the two gaps these studies place in the weights: outputs whose spread a prompt did not fix or whose confidence training moved, and instructions paid for on every call" |
| 18-2 | GPT-4 Technical Report Cite carries no badge (known item) | WeightsVsContext.tsx:718-720 | label (known item) | 2303.08774v6 is a first-party technical report with no peer-reviewed venue; the figure is OpenAI's measurement of its own model, so Tier 2 stays | `venue="technical report"`; visible title "GPT-4 Technical Report (OpenAI), Section 5 and Figure 8" |
| 18-3 | FormatSpread "so it applies to a model you reach only through an API", cited to the abstract only | WeightsVsContext.tsx:654-658 | UNSUPPORTED (at the cited location) | Abstract says only "without accessing model weights"; Section 1 says "does not require access to the model weights, allowing its use on API-gated models" (2310.11324v2) | Cite now "abstract and Section 1" |

Confirmed, with evidence (summary):
- Ovadia et al. 2312.05934v3: Sec 4.1 (US current events, August to November 2023, after the cutoff, Wikipedia), Sec 4.3 (910 questions), Sec 3.2 (unsupervised fine-tuning as continued next-token training, no labels), Sec 4.4 (ten paraphrases per chunk), Sec 5 ("one-to-one correspondence" quote), Sec 6 and Fig. 4 (monotonic in paraphrases, all models). Table 2, all 18 numbers incl. Mistral FT-reg + RAG 0.810 (known item), identical in arXiv v3 and the EMNLP 2024 proceedings PDF (Anthology 2024.emnlp-main.15, re-downloaded).
- Sclar et al. 2310.11324v2: abstract (76 points on LLaMA-2-13B, size / shots / instruction tuning, weak correlation between models, FormatSpread); separators, spacing, casing (Sec 3.1); ICLR 2024 (PDF header). Wave 2 row 41 wording ("format", not "rephrasing") applied.
- Zhang et al. 2404.10859v2: abstract (Llama-2-13B-chat favours five); Sec 4 (temperature one, 1,000 generations, three models); Sec 4.1 (Gemma and Llama-2 over 60% on five; none produced all ten); Sec 4.2 (near-uniform, full coverage); footnote 6 (temperature above 10, degeneration); Sec 5 (held-out sixth task); COLM 2024 (PDF header).
- GPT-4 report 2303.08774v6: Sec 5 ("pre-trained model is highly calibrated", calibration definition), Fig. 8 caption ("post-training hurts calibration significantly"), plot labels "ECE: 0.007" and "ECE: 0.074" are text in the PDF, not values read off a curve (known item settled).
- Snell et al. 2209.15189v1 abstract: "disappear when the context tokens are gone", the distillation recipe, instructions overwritten iteratively, 8-digit addition helps downstream tasks. Preprint (no venue located).
- RL's Razor 2509.04259v1 abstract (forgetting determined by KL on the new task); ICLR 2026 (proceedings.iclr.cc listing).
- Yue et al. 2504.13837v5 abstract (small-k and large-k pass@k, distillation quote); NeurIPS 2025 per cross-section block.
- DeepSeek-R1 2501.12948v2 Supplementary F.1, Table 16, re-opened: Distill-Qwen-32B 72.6 / 83.3 / 94.3 / 62.1 / 57.2 against Qwen2.5-32B-Zero 47.0 / 60.0 / 91.6 / 55.0 / 40.2, "performs significantly better ... across all benchmarks"; base is Qwen2.5-32B (cross-section condition holds).
- Diagram cells all match cited prose numbers; contested rows and caption ("our reading") as required. Cross-references to sections 7, 8, 13, 14, 17 and 22 check out (section 14: GEPA 32.00 against GRPO 38.00 on AIME-2025, 51.95 against 51.26 on LiveBench-Math, Qwen3 8B; section 22's three questions).

## Scores (after fixes)

| file | score | rationale |
|---|---|---|
| WhereWordsFallShort.tsx | 9/10 | Every number now matches its source at the stated scope, the Greedy Agents denominators are explained rather than presented as a conflict, venues current. Shape holds: strongest number landed three times, payoff ends on three changes. |
| WeightsVsContext.tsx | 9/10 | All 18 Table 2 values, the ECE labels and Table 16 verified at source; the only issues were a widened h2 description and a cite location. Map, contested rows and the classification table end on section 22. |

## Items for the orchestrator (files fc07 does not own)

- `GlossaryAndSources.tsx` row 81 (Schmied et al., LLMs are Greedy Agents): "preprint" should read "ICLR 2026" (https://iclr.cc/virtual/2026/poster/10006711).
- `GlossaryAndSources.tsx` row 85 (Liu et al., Lost in the Middle): "TACL 2023" should read "TACL 2024" (TACL 12:157-173, https://aclanthology.org/2024.tacl-1.9/).
- `Hybrids.tsx:549` (fc06 file) cites Greedy Agents with `venue="preprint"`: should be "ICLR 2026".
- `sources.md` and register 04: same two venue updates; F04-12 and wave2-limits row 26 should record that Figure 5's 58% and 21% are shares of all actions, the introduction's 64% is 58.1 / 90.3, and the text's 87% disagrees with the matrix row sum of 90.3; F04-26 and wave2-limits rows 2 and 29 should record that 53.5% (all-at-once) and 14.2% (step-by-step) are two different methods.
- `GlossaryAndSources.tsx` has no source rows for 2303.08774v6 (GPT-4 report), 2209.15189v1 (context distillation), 2404.10859v2 (Zhang et al.), 2505.08638v3 (TRAIL) or 2610.31710v2 (Compact-Bench), all cited in sections 17 and 18. Add them if that list is meant to be complete.
- Backlog, not a correction: on the four newest Claude models the cache-read multiplier is 0.05x or 0.025x, so the edit penalty in section 17 is 25x or 50x the read price rather than 12.5x; the page's "on most models" scope is accurate as written.
