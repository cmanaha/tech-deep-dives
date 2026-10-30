# fc02-foundations: fact check of sections 4, 5 and 6

Agent: fc02-foundations. Date: 2026-10-30. Files: `src/sections/PolicyGradient.tsx`,
`src/sections/TwoLeashes.tsx`, `src/sections/PreferencesToRewards.tsx`.

Status: DONE. Corrections applied; claims files updated (`revamp/claims/policy-gradient.md`,
`leashes.md`, `preferences.md`); diagram re-verified with the harness (fc02 slug, port 4602): all
three sections "ok" at 1440 and 390, PNGs of the touched gradient-table diagram read at both widths.

Sources opened by this agent: arXiv PDFs at the pinned versions (pdftotext), the Sutton and Barto 2nd
ed. PDF, TRL clones at v1.16.0 (1b5c75ed94b7387f42532adb090c935166d4878d) and v1.12.0
(59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be), E0 raw logs `research/2026-10/E0-spark-smoke/run{1,2}/logs.jsonl`
and `E0-spark-smoke.md`, the Bedrock RFT, OpenAI RFT and two SageMaker pages, and venue pages
(OpenReview ICLR 2026, PMLR v202/v235/v238, ACL Anthology, NeurIPS proceedings).

## PolicyGradient.tsx (section 4)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 4.1 | DeepSeekMath's reasons for dropping the critic: "with only the last token rewarded it is hard to train a critic that is accurate at every token" | PolicyGradient.tsx:646-648 | OVERREACH (hedge dropped) | https://arxiv.org/abs/2402.03300v3 Sec 4.1.1: "usually only the last token is assigned a reward score ..., which may complicate the training of a value function that is accurate at each token" | Now "since usually only the last token gets a reward, that may complicate training a critic that is accurate at every token" |
| 4.2 | Gradient-table diagram, RLOO or GRPO row: weight "Reward minus a baseline from the other samples" (cell and svg title) | PolicyGradient.tsx:221, 266-267 | WRONG for GRPO | https://arxiv.org/abs/2402.03300v3 Sec 4.1.2: GRPO subtracts the group average (sample included) and divides by the group std; only RLOO uses the other k - 1 (https://arxiv.org/abs/2402.14740v2 Sec 2.3) | Cell now "from the group;", title "a baseline taken from the group". Harness re-run, PNGs read |
| 4.3 | Known item F01-71 expandable: header "Evidence that the columns move results"; close "evidence ... that each column moves the result" | PolicyGradient.tsx:775, 788-789 | OVERREACH (scope) | https://arxiv.org/abs/2402.03300v3 Sec 5.2.1, Fig 5, "Observation about Data Source" / "Observation about Gradient Coefficient": isolates sample source and weight only; the scorer differs between online RFT (Rule) and GRPO (Model, Table 10) and is never isolated. Everything else in the expandable holds at the stated scope (1.3B, GSM8K and MATH; online RFT "comparable to RFT in the early stage ... absolute advantage in the later stage"; GRPO beats online RFT, credited to "altering positive and negative gradient coefficients"; RM trained on rule judgments) | Kept. Header "Evidence that two of the columns move results"; close "the sample-source and weight columns move the result; the scorer column was not isolated" |
| 4.4 | RLOO used in the intro before its expansion | PolicyGradient.tsx:402, 526 | prose rule (acronym order) | CLAUDE.md Acronym Standard | Expansion moved to first use (intro) |

CONFIRMED: 38. Sutton and Barto 13.3 Eq 13.8 and the "direction ... that most increases the probability of repeating the action" reading; 13.3 p.329 unbiased, "may be of high variance and thus produce slow learning"; 13.4 Eq 13.11, baseline leaves the expectation unchanged with "a large effect on its variance", state-value baseline; 13.5 critic and actor-critic, one-step return trades variance for bias. GAE (ICLR 2016) Sec 1 horizon confounding and actor-critic bias, Sec 2 better-than-average, Eq 16 residual sum, Eqs 17-18 and their bias/variance properties. Ahmadian et al. (ACL 2024, checked on ACL Anthology) Eqs 6, 7, 9; Sec 1 critic and reward model; Sec 2.2 high-covariance baseline; Sec 2.3 RLOO quote and sampling-time cost; Sec 3 concentration explanation; Sec 3.1 Fig 1 (Llama-7B HH, lambda 0/0.5/0.95/1, "monotonically decreasing reward with decreasing lambda"). RL's Razor (ICLR 2026, OpenReview poster) Sec 5.1 two features, 1-0 REINFORCE equals SFT on correct answers, footnote on the log-probability term. DeepSeekMath Sec 4.1.1-4.1.2, Sec 5.2.1 Eq 5 and its three components, Table 10, App A.1.1 (coefficient 1), A.1.2-A.1.3 Eq 10, A.1.6 Eq 21. Diagram arithmetic (1 - 1/3, 0 - 2/3).

Score: 9/10. Accurate at the pins after the fixes; every quantitative and code-free formal claim cited; the
section builds the mental model it promises and ends on the reader's next action (place your pipeline on the table).

## TwoLeashes.tsx (section 5)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 5.1 | "the clip ... makes the KL to the starting model grow much more slowly" | TwoLeashes.tsx:544-546 | OVERREACH (hedge dropped) | https://arxiv.org/abs/2210.10760v1 Sec 3.6: "causing it to grow much more slowly (providing the implementation is well-tuned)" | Now "in a well-tuned implementation that also makes ..." |
| 5.2 | "In the full InstructGPT models the mix reduced those regressions without removing them", cited "Appendix E.6 and Section 5.3" | TwoLeashes.tsx:718-722 | UNSUPPORTED at the cited location | https://arxiv.org/abs/2203.02155v1: Sec 5.3 (Limitations) has no regression text; the evidence is Sec 4.2 ("still lags behind GPT-3 on DROP, SQuADv2, and translation") and Sec 5.4 ("does not completely mitigate performance regressions") | Cite label now "Appendix E.6 and Sections 4.2 and 5.4"; "full" (read as full-size) now "main" |
| 5.3 | Expandable: "At full scale the PPO-ptx model ... still lagged GPT-3" | TwoLeashes.tsx:773-775 | OVERREACH (scale) | Sec 4.2 says "the PPO-ptx model" with Fig 29 spanning model sizes; nothing restricts it to full scale | Now "In the main results the PPO-ptx model ..." |
| 5.4 | LoRA with beta above 0 loads no second model copy, cited only to grpo_trainer.py L987-L990 | TwoLeashes.tsx:753-762 | UNSUPPORTED by code at the cited lines (claim CONFIRMED) | TRL v1.16.0 grpo_trainer.py L987-L990 sets `ref_model = None` for PEFT, but "the adapter can be disabled" is a comment there; the code is L2722-L2737 (`use_adapter(model, adapter_name=None)` disables adapters; re-training an existing adapter loads a small "ref" adapter, still no model copy) | Added Cite to grpo_trainer.py L2722-L2737 (kind="code") |

Known items (fc02), section 5, each verified at the pin and kept:
- Clip acts only when one batch feeds more than one update: CONFIRMED. DeepSeekMath App A.1.5 ("a single update following each exploration stage, thereby ensuring that pi_old = pi_theta. In this case, we can remove the min and clip operation"); TRL v1.16.0 grpo_config.py L689-L692 (`num_iterations` 1), L528-L531 (`steps_per_generation` defaults to `gradient_accumulation_steps`); grpo_trainer.py L2634-L2655 and L3060-L3066 (old log-probabilities equal the current ones when aligned; with vLLM they are recomputed from the same weights before the update); E0 `clip_ratio/region_mean`, `low_mean`, `high_mean` 0.0 at all 20 steps of both runs. InstructGPT App C.4 is consistent (8 minibatches per batch, so its clip does act).
- LoRA with beta above 0 loads no second model copy: CONFIRMED in code (citation fixed, row 5.4).
- TRL RLOO beta default 0.05: CONFIRMED, trl/trainer/rloo_config.py L502-L508 at v1.16.0.

CONFIRMED: 41. PPO paper (preprint) Sec 2.1 quote, Eq 7, eps 0.2, one-sided clip quote, Sec 6.1 Table 1 (7 MuJoCo tasks, 1M timesteps, 3 seeds; 0.82, 0.76, 0.70, -0.39); TRPO (ICML 2015) Sec 4 trust region; Ahmadian Sec 3.2 (under 5% clipped per batch across Pythia-6.9B and Llama-7B pairings; slight boost without clipping); InstructGPT (NeurIPS 2022) Sec 3.5 Eq 2 and per-token KL purpose, App C.4 beta 0.02, App E.6 (KL 2.0, "100 times of the default value", "still cannot be fixed", validation reward drop, ptx coefficient of 20 or more recovers on 1.3B); Gao et al. (ICML 2023, PMLR v202) Sec 1 and 3.6 (early stopping, frontier unchanged, hyperparameter caveat), 6B gold RM, ratio leash to a recent policy; DeepSeekMath Sec 4.1.1 Eqs 1-2 (KL in the reward for PPO, in the loss for GRPO), A.1.5 Eq 18; TRL grpo_config.py L681-L696 (beta 0.0 with the quoted help text, num_iterations 1, epsilon 0.2), grpo_trainer.py L983-L986, L3267-L3270 (kl only when beta != 0, entropy always), L3272-L3279 (low, high, region clip metrics); E0: all 40 entropy values in the chart match the logs, range 0.19-0.32, steps 1-8 identical across runs, IS ratio max 2.80 and 2.86, no kl key in either log, generation 62.0% and 62.9%, caption settings (seed 0, lr 1e-6, temperature 1.0, 2 x 8, full fine-tuning); Bedrock RFT page lists `actor/entropy` and `actor/pg_clipfrac` ("frequency of clipped updates") and no KL metric.

Score: 9/10. Accurate at the pins after the fixes, E0 numbers exact, every default and flag cited to code;
strongest number (0.2, a 20% move) landed several times and the closing block is the reader's pre-run decision.

## PreferencesToRewards.tsx (section 6)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 6.1 | PPO's 0.7-point lead is "most of it in reasoning, coding and chat" | PreferencesToRewards.tsx:692 | WRONG | https://arxiv.org/abs/2406.09279v2 Table 2: deltas +1.3 reasoning, +2.9 coding, +2.3 safety, +0.1 instruction following, -2.5 truthfulness; no chat column. Sec 3.2: "PPO improves on DPO in reasoning, coding and safety capabilities most". Only the Table 2 caption says "chat" | Now "reasoning, coding and safety" |
| 6.2 | "0.7 points ... about 8 times the wall-clock" pairs a five-dataset average with timings reported for one dataset | PreferencesToRewards.tsx:351-353, 697-703, 705-722 | OVERREACH (scope mix, unlabelled) | https://arxiv.org/abs/2406.09279v2 App K: timings are "on the UltraFeedback set"; Table 2: UltraFeedback (FG) DPO 61.0, PPO 62.2 (1.2 points); 0.7 is the average over five datasets, all subsampled to 60,908 except ChatArena (20,465) | Intro: "on the dataset the authors timed"; comparison paragraph: "On the UltraFeedback set, ..."; expandable states the 1.2-point gap on that set and that no timings exist for the other four. Headline pairing kept, now scoped |
| 6.3 | "the reward model's training is in neither the 4.9 nor the 60" | PreferencesToRewards.tsx:432-433 | UNSUPPORTED | https://arxiv.org/abs/2203.02155v1 Sec 5.1 gives only "training our 175B SFT model requires 4.9 petaflops/s-days and training our 175B PPO-ptx model requires 60"; no itemisation, no reward-model figure anywhere in the paper | Now "the paper gives no separate compute figure for training the reward model" |
| 6.4 | "Z(x) only normalises, and depends on the prompt alone" | PreferencesToRewards.tsx:481 | OVERREACH (imprecise) | https://arxiv.org/abs/2305.18290v3 Sec 4 Eq 4: Z(x) = sum over y of pi_ref(y given x) exp(r(x, y) / beta); App A.1: a function of x and pi_ref, not of the policy. It does not depend on the response, which is why it cancels | Now "it depends on the prompt and not on the response" |
| 6.5 | h2 description "why a run holds four models at once" | PreferencesToRewards.tsx:366 | OVERREACH (hedge dropped) | https://arxiv.org/abs/2402.14740v2 Sec 1: "PPO typically requires loading up to 4 models simultaneously" (the body already says "up to four") | Now "why a PPO run can hold four models at once" |

CONFIRMED: 75. Ivison et al. (NeurIPS 2024, PDF footer) abstract (data first, then algorithm; up to 2.5% math), Table 2 average 0.7, Sec 3.2 same data for both, App K (256 or 128-size TPUv3 pods, 3 days on a 256-size pod, about 10 h RM, DPO about 60,000 samples 9 h, DPO pod size unstated), Sec 2.1 exploration; InstructGPT Sec 3.1 three steps and iteration, Sec 3.5 log-odds and Eq 1, Sec 3.2 "without any human labels", per-token KL, abstract and Sec 1 ("100x" / "over 100x fewer"), Sec 5.1 4.9 / 60 / 3,640, PPO-ptx definition; Christiano et al. Sec 2.2.3 Bradley-Terry and Elo; Ahmadian Sec 1 up to four models; TRL v1.12.0 trl/experimental/ppo/ppo_trainer.py L489 (policy, ref, value, reward); DPO paper (NeurIPS 2023) Eq 4, Eqs 5-7, "simple classification loss", "represents both the language model and the (implicit) reward", gradient weighting and "degenerate", no sampling during fine-tuning (abstract), no learned value function or baselines (Sec 5.2; the word "critic" is not used, the claim holds since DPO has no RL loop), DPO outline; TRL v1.16.0 dpo_trainer.py L1350-L1351, dpo_config.py L227-L233 (`precompute_ref_log_probs` False), L245-L252 (`ipo`), L297-L298 (beta 0.1), trl/trainer/kto_trainer.py (full 1,681-line trainer); IPO (AISTATS 2024, PMLR v238) Sec 1 and 4.2; KTO (ICML 2024) 1B to 30B; ORPO (EMNLP 2024, ACL Anthology) reference-free, no separate phase; SimPO (NeurIPS 2024) average log-probability, no reference, target margin; DeepSeekMath Table 10 and App A.1.4 (pairs from the SFT model, "human preference in the general domain (can be 'Rule' in mathematical tasks)", Eqs 13-14); Xu et al. (ICML 2024, PMLR v235) Theorem 4.1, abstract, three factors; Lee et al. (ICML 2024) RLAIF introduced by Bai et al., Sec 2.2.2 d-RLAIF 1-10 and staleness, Table 1 50% / 52% and 88% / 76%, PaLM 2 labeler and policy, "over 10x cheaper"; Constitutional AI Sec 1.2 both stages, Sec 4.1 normalised (A)/(B) targets and the 40-60 clamp, Sec 4.3 harsh and boilerplate, and no PPO or other optimiser named anywhere in the text; Llama 3 Sec 4.1.4 quote, rounds, beta 0.1, Sec 5.2.1 IFEval gloss; Qwen3 Sec 4.2 GRPO on 3,995 pairs; Gemma 3 Sec 3 BOND, WARM, WARP and the reference-title glosses; OpenAI RFT guide names no optimiser (it is cited for that silence only, not offered as an option, so the "closed to new users" condition does not bite); SageMaker DPO on preferred vs rejected pairs, LoRA or FFT per open-weight model.

Score: 8/10. Accurate at the pins after the fixes and densely cited; held at 8 by length (about 2,600
words, over the 2,500 target) and because the headline "0.7 points for about 8x" pairs an average with a
single-dataset timing, which the page now states but the h2 and closing landings still carry unqualified.

## Items for the orchestrator (files fc02 does not own)

- Register: wave2-foundations row 31 (F01-73) quotes the Ivison Table 2 caption "reasoning, coding, and chat"; the table and Sec 3.2 say safety, not chat. Fix the row's reading.
- Register: wave2-foundations row 24 note (F01-52) says reward-model training is excluded from the 4.9 and 60 petaflop/s-day figures; the paper does not say so.
- Cross-section: no other section repeats the 0.7 / 8x pairing or the "chat" reading (grep of `src/sections`).

## Orchestrator follow-up (2026-10-30)

The residual pairing named in the section 6 score rationale is fixed: the h2 description now reads
"Weigh a gain of about a point against about 8 times the training wall-clock"; the comparison
paragraph states the 1.2-point UltraFeedback gap with its own Table 2 cite before the "about a point
for about 8 times" sentence; the closing reading names 0.7 as the five-dataset average and 1.2 as the
timed dataset. Typecheck, lint and no-ai-tells pass after the edit.
