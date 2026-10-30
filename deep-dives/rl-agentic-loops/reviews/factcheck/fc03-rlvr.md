# fc03-rlvr: fact check of sections 7 (RLVR & GRPO) and 8 (What RL Does to a Model)

Agent fc03, 2026-10-30. Pins: TRL v1.16.0 (`1b5c75ed94b7387f42532adb090c935166d4878d`), verl v0.9.1
(`1876b06d0a3e4e71e06230be10af14492ca8a75b`), shallow clones in `/tmp/rl-fc-fc03-trl` and
`/tmp/rl-fc-fc03-verl`. Papers read as arXiv HTML at the version each Cite carries. Venues checked on
OpenReview (API search), the NeurIPS 2025 and ICLR 2024/2026 proceedings indexes and the ACL Anthology.
AWS pages fetched with plain curl. E0 numbers recounted from the raw logs.

Status: COMPLETE. Fixes applied to both section files and both claims files. No diagram touched, so
the screenshot harness was not re-run.

## RlvrAndGrpo.tsx (section 7)

About 95 load-bearing claims checked (82 Cites after fixes, 76 before). CONFIRMED: 86. Non-confirmed: 9
rows: WRONG 1 (nine venue badges), OVERREACH 6, UNSUPPORTED 1, prose rule 1.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 7-1 | DAPO venue badge "preprint" (9 Cites) | RlvrAndGrpo.tsx, every `href={DAPO}` | WRONG | DAPO is in the NeurIPS 2025 main-conference proceedings: https://papers.nips.cc/paper_files/paper/2025/hash/a4277440d50f1f15d2cb4c14f7e0c0d2-Abstract-Conference.html ; OpenReview note 2a36EMSSTp, venueid `NeurIPS.cc/2025/Conference`. wave2-rlvr line 147 lists it as a preprint (register error) | all nine set to `venue="NeurIPS 2025"` |
| 7-2 | TRL GSPO knob: "set `importance_sampling_level="sequence"`" | RlvrAndGrpo.tsx:509-518 | OVERREACH (incomplete fix) | TRL v1.16.0 `trl/trainer/grpo_trainer.py#L928-L934` warns that `"sequence"` with the default `loss_type="dapo"` weights each sequence by its completion length and says to set `loss_type="grpo"` to reproduce GSPO; `docs/source/paper_index.md#L79-L97` recipe sets both | cell now says "together with `loss_type="grpo"`: with the default `"dapo"` the trainer warns that each answer is weighted by its length", cite grpo_trainer.py L928-L934 |
| 7-3 | Under TRL defaults "prompt B contributes nothing to the step" | RlvrAndGrpo.tsx:820-834 | OVERREACH | zero advantage gives no gradient, but the default `dapo` loss divides by every completion token in the batch (`grpo_trainer.py#L2497-L2498` builds `num_items_in_batch` from the loss mask; `#L3168-L3173` divides by it), so a silent group's tokens still shrink the other groups' update; DAPO v2 Sec. 3.2 says the same ("shrinking the magnitude ... of the batch gradient") | "adds no gradient to the step", plus one sentence on the divisor with both code cites |
| 7-4 | "In DeepSeek's experiments, RL from a base model failed ... on a 7B dense ... base"; next block "A 7B base did respond to RL in other work" | RlvrAndGrpo.tsx:716, 737-743 | OVERREACH (hedge scope dropped) | R1 v2 Supplementary G.1 scopes the failure to "the initial phase of our development"; Supplementary F.1, Table 17 reports DeepSeek's own Qwen2-Math-7B-Zero (about 10,000 policy-gradient steps) at 22.3% on AIME 2024 against 7.9% for Qwen2-Math-7B-Instruct | "early experiments"; "A 7B math base did respond to RL, in DeepSeek's own later run on Qwen2-Math-7B [R1 Supp. F.1, Table 17] and in other work" |
| 7-5 | "In DAPO's run the share of such prompts [all pass or all fail] grew" | RlvrAndGrpo.tsx:1084 | OVERREACH (minor) | DAPO v2 Sec. 3.2: "the number of samples with accuracy equal to 1 continues to increase" (always-solved only, Fig. 3b) | "the share of always-solved prompts grew" |
| 7-6 | SageMaker sparse-reward guidance "... larger batch or more steps, and a lower learning rate" | RlvrAndGrpo.tsx:1148 | OVERREACH (minor) | MTRL hyperparameters page, "Learning rate": "needs to be lower ... or the run needs more steps" (alternatives) | "or a lower learning rate" |
| 7-7 | verl `seq-mean-token-sum-norm` "divides by a constant" | RlvrAndGrpo.tsx:444-454 | OVERREACH (minor) | verl v0.9.1 `verl/trainer/ppo/core_algos.py#L1180-L1193`: divides by `loss_scale_factor`, else by `loss_mask.shape[-1]`; `verl/trainer/config/actor/actor.yaml#L88-L90`: "Set to a constant to ensure consistent normalization" | "divides by a fixed length, `loss_scale_factor` or, when that is unset, the response length of the loss mask"; cite widened to L1180-L1193 (the `elif` branch starts at L1180) |
| 7-8 | verl default `loss_agg_mode: token-mean`; `adv_estimator` value `rloo` | RlvrAndGrpo.tsx:399-407, 444-448 | UNSUPPORTED by the cited lines | cited `core_algos.py#L1181-L1193` holds the modes, not the default (default is `actor.yaml#L85-L86`); cited `ppo_trainer.yaml#L77-L78` does not list `rloo` (enum at `core_algos.py#L97-L110` does) | added cites actor.yaml L85-L90 and core_algos.py L97-L110 |
| 7-9 | RL terms at first use: "advantage" in the intro (defined only in the third block); "the policy drifts" in the successor table (policy never defined in the section) | RlvrAndGrpo.tsx:647, 237 | prose rule (RL term undefined at first use) | authoring brief, "Define every RL term at first use in your section" | intro gloss "an advantage, its score relative to the group, of 0"; "the model drifts toward them" |

Known items settled:
- R1 v1's 71.0%: re-opened at https://arxiv.org/html/2501.12948v1, Section 2.2.4 ("jumping from an
  initial 15.6% to an impressive 71.0%") and Table 2. v2 Section 2.3 and the Nature article
  (https://www.nature.com/articles/s41586-025-09422-z) both give 77.9%. CONFIRMED.
- `reinforce_pp` read as REINFORCE++: the MTRL page lists `reinforce_pp` and `reinforce_pp_baseline`
  beside `opo`, `grpo_passk` and `gpg`, the same set verl names `reinforce_plus_plus` and
  `reinforce_plus_plus_baseline` (`core_algos.py#L97-L110`), and REINFORCE++ v9's abstract names the two
  variants "REINFORCE++" and "REINFORCE++ /w baseline". Labelled "in our reading of the identifier".
  CONFIRMED as labelled.
- TRL paper-index Dr. GRPO recipe: `paper_index.md#L297-L313` sets only `loss_type="dr_grpo"`; nothing in
  `grpo_config.py` or `grpo_trainer.py` couples `dr_grpo` to `scale_rewards` (grep), so `"group"` stays
  (`grpo_config.py#L789-L790`, `grpo_trainer.py#L2785-L2787`). Doc-code conflict CONFIRMED.
- verl default `rollout.n: 1` with GRPO: `core_algos.py#L314-L316` sets mean 0.0 and std 1.0 for a
  one-answer group, so the advantage is the raw reward over 1 + 1e-6. The default trainer is v1
  (`ppo_trainer.yaml` `use_v1: true`), whose GRPO path (`verl/trainer/ppo/v1/utils.py#L199-L207`) calls the
  same `compute_advantage`. CONFIRMED (our reading of the code, labelled).

Confirmed, code (TRL v1.16.0): grpo_config L227-L236, L237-L248, L480-L481, L681-L687, L693-L714,
L760-L761, L789-L790, L801-L802, L876-L877; grpo_trainer L2785-L2787, L3163-L3164; utils L1021-L1044
(Bessel correction); rloo_trainer L1688-L1690; paper_index L154-L164; grpo_trainer.md L189. (verl v0.9.1):
ppo_trainer.yaml L77-L78, L80-L81, L83-L90 (`filter_groups` consumed by the default v1 trainer,
`v1/trainer_base.py#L201-L215`); rollout.yaml L126-L127; actor.yaml L38-L42, L60-L61; core_algos L315-L327,
L319-L321 (`torch.std`, unbiased), L1545-L1546. `_generated_ppo_trainer.yaml` agrees on every default.

Confirmed, papers: DeepSeek-R1 v2 Sec. 1 (V3-Base, SFT bypassed), 2.1, 2.2 (accuracy plus format, Eq. 4,
equal weight, neural RMs hackable and costly to retrain), 2.3 (15.6 to 77.9, 86.7 self-consistency),
Supp. F.1 Table 16 (47.0, 50.0, 72.6, distilled models SFT only), Supp. G.1 (7B dense, 16B MoE,
repetition; 32B dense Qwen, 230B, 671B; recommendation). DeepSeekMath v3 Sec. 4.1.1, 4.1.2, Eq. 3
(preprint: CoRR only). Dr. GRPO v2 abstract, Sec. 1 (43.3%, 27 h on 8 A100), 3.1, 3.2; venue COLM 2025
(OpenReview venueid `colmweb.org/COLM/2025/Conference`). DAPO v2 expansion, Sec. 1, 3.1 (0.01 to 0.012,
entropy collapse), 3.2, 3.3, 4.1 (0.2/0.28, avg@32), 4.2, Table 1 (30/36/38/41/42/50, 47). GSPO v2 Sec.
3, 4.1, 5.1 to 5.3 (10% of experts, two orders of magnitude, Routing Replay); preprint (CoRR only).
REINFORCE++ v9 abstract; preprint (ICLR 2027 submission). RLOO v2 Sec. 2.3; ACL 2024 (Anthology
2024.acl-long.662). Spurious Rewards v2 abstract (21.4, 29.1, Llama3/OLMo2); ICML 2026 (OpenReview
venueid `ICML.cc/2026/Conference`).

Confirmed, AWS: Bedrock RFT page (several responses, reward function, GRPO); RFT job page (field list,
`trainingSamplePerPrompt: 4` in the example request); MTRL hyperparameters page (group_size 8 [2, 32];
nine advantage methods; loss_fn ppo of three; clip 0.8/1.2 with [0, 1]/[1, 10]; global_batch_size 128
{32, 64, 128}; rollouts = batch x group; importance_sampling for newcomers; (0.8, 1.2) "the safe
baseline for any first run"; zero advantage when all succeed or all fail).

Confirmed, E0 (Tier 0), against `research/2026-10/E0-spark-smoke/run1|run2/logs.jsonl` (identical at
`DIVE_REPO_SHA` bcf5a9ed): `frac_reward_zero_std` 1.0 on 9 (run 1) and 10 (run 2) of 20 steps, each with
reward 0.0, loss 0.0 and grad_norm 0.0; zero-spread groups 28/40 and 29/40; mean reward 0.04375 (0.044);
lr 1e-6, seed 0, TRL defaults per `E0-spark-smoke.md`. Arithmetic re-run: p^G + (1 - p)^G table (92/85,
70/49, 43/19, 6/0.3, 0.8/0.003), 0.70, 0.49 (9.7 steps in 20), diagram mean 0.375, std 0.5175, +1.21 and
-0.72.

Cross-section conditions: TRL defaults, E0 numbers, Qwen's 32B base and venues all consistent.

Score: **8/10**. Accurate at the pins after the fixes, every number cited, payoff (measure the base rate,
count silent prompts) lands last and the 9 and 10 of 20 figure lands three times. Length (about 3,100
words with tables) is over the 2,500 target; the leverage pass owns that.

## WhatRlDoes.tsx (section 8)

About 60 load-bearing claims checked (42 Cites). CONFIRMED: 50. Non-confirmed: 10 (WRONG 4, OVERREACH 2,
UNSUPPORTED 2, prose-rule 2).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 8-1 | Reasoning with Sampling (2510.14901v1) venue "preprint" (4 Cites) | WhatRlDoes.tsx:353, 794, 800, 807 | WRONG | ICLR 2026 proceedings: https://proceedings.iclr.cc/paper_files/paper/2026/hash/01498f17142547dadb60999c39bd0a09-Abstract-Conference.html ; OpenReview "ICLR 2026 Oral" | `venue="ICLR 2026"` |
| 8-2 | f(g(x)) (2509.25123v3) venue "preprint" (3 Cites) | WhatRlDoes.tsx:478, 482, 859 | WRONG | ICLR 2026 proceedings: https://proceedings.iclr.cc/paper_files/paper/2026/hash/eeae43a68515325cad64c0f54b2d0c70-Abstract-Conference.html | `venue="ICLR 2026"` |
| 8-3 | Guru (2506.14965v1) venue "preprint" | WhatRlDoes.tsx:545 | WRONG | NeurIPS 2025 Datasets and Benchmarks Track: https://papers.nips.cc/paper_files/paper/2025/hash/c2f71567cd53464161cab3336e8fc865-Abstract-Datasets_and_Benchmarks_Track.html | `venue="NeurIPS 2025 Datasets and Benchmarks"` |
| 8-4 | Let's Verify Step by Step (2305.20050v1) venue "preprint" | WhatRlDoes.tsx:836 | WRONG | ICLR 2024 proceedings: https://proceedings.iclr.cc/paper_files/paper/2024/hash/aca97732e30bcf1303bc22ac3924fd16-Abstract-Conference.html (DeepSeek-R1 also cites it as Lightman et al., 2024) | `venue="ICLR 2024"` |
| 8-5 | "On the models and benchmarks tested so far, RLVR mostly sharpens" | WhatRlDoes.tsx:347-348 | OVERREACH (hedge scope widened to all tests) | the evidence is the studies the section read | "in the studies read here" |
| 8-6 | "The open comparisons stop at 32B" | WhatRlDoes.tsx:537 | OVERREACH (universal from a search) | Yue et al. (to 32B), Guru (32B), Invisible Leash (to 14B) are the comparisons located | "The open comparisons located stop at 32B" |
| 8-7 | Interplay: "100M-parameter models", cited to the abstract | WhatRlDoes.tsx:491-496 | UNSUPPORTED by the cited location | 100M is in Sec. 2.4 ("models with 100M parameters"), not the abstract | cite text "abstract and Section 2.4" |
| 8-8 | "Both agree the effect does not carry to Llama or OLMo", Reasoning or Memorization cited to Section 1 | WhatRlDoes.tsx:721-727 | UNSUPPORTED by the cited location | Sec. 1 names Llama3.1 only; OLMo is in Sec. 2.1 ("these methods fails to transfer to Llama or OLMo") | cite text "Sections 1 and 2.1" |
| 8-9 | LoRA used ("LoRA GRPO") two sentences before its expansion | WhatRlDoes.tsx:508-516 | prose rule (acronym after first use) | Acronym Standard | expansion sentence moved ahead of the study sentence |
| 8-10 | MATH used unglossed ("their MATH run") | WhatRlDoes.tsx:589 | prose rule (benchmark gloss) | authoring brief, "Gloss each benchmark at first use" | "their run on MATH, a competition-math benchmark, with about 10,000 problems and 32 samples" |

Known items settled:
- Guru 32B counter-example (added beyond the scope block): Guru v1 Sec. 4.3, "On AIME, the 32B curves
  never intersect, and RL consistently outperforms the base model. On the contrary, the 7B curves cross
  at k=64." CONFIRMED at the stated scope; venue corrected (8-3).
- Interplay venue "ICML 2026": OpenReview lists it as "ICML 2026 spotlight", venueid
  `ICML.cc/2026/Conference` (note TBaUfO9znF). CONFIRMED independently of the authors' README.
- 8.84x appears six times (h1 description, intro, buy-back table, h2 description, body, landing). Reported,
  not cut: the leverage pass owns repetition.

Confirmed, papers: Yue et al. v5 abstract (model families, six RLVR algorithms, coverage and perplexity),
Sec. 2.2 (pass@k, RL-should-solve-more criterion, best-of-N/voting can miss successes, manual CoT check,
unit tests, k = 128 or 1024), 3.1 (Minerva 32B about 9% at k = 128), 7 (proprietary limit); NeurIPS 2025.
Invisible Leash v5 Sec. 3.1 (k up to 8,192 for math), 3.2 (leg_counting 28/4, 40/30; 175 vs 48; SRR 0.93
to 0.99; NDR at most 0.02); preprint (ICLR 2026 rejected, ICML 2025 workshop). f(g(x)) v3 Sec. 1
(Llama-3.1-8B-Instruct, string transformations, near zero to 30% and 15%, RFT does not generalise),
Fig. 5 caption. Curriculum RL v1 abstract and Sec. 4.1 (+9.8 pass@256, five model settings); preprint.
Pass@(k,T) v1 Sec. 3 (Qwen2.5-7B-Instruct, LoRA GRPO, 200 problems, 100 test per category, k = 64),
4.1/4.2 (0.81 vs 0.77, gap widens); preprint. Thinking Machines LoRA blog (O(1) bits, "arguably",
320,000 bits, 3M parameters, rank 1 matches FullFT, Llama-3.1-8B, MATH and GSM). RL's Razor v1 abstract
(KL on the new task), Sec. 3 (Qwen 2.5 3B-Instruct, OpenVLA 7B, matched new-task performance), Sec. 6
(float32, no sparsity); ICLR 2026. Entropy Mechanism v1 Sec. 2.2 (11 models, 4 families), 2.3 (76%, 73%,
first 200 of 2,400 steps), 2.4 (fitted curve); preprint (ICLR 2026 withdrawn). Subnetworks v2 Sec. 2,
Table 1 (ten checkpoints, seven methods, four offline preference methods, 68.5 to 96.0 at 1e-5; SFT 6 to
15%), Table 6 (50.40 to 87.58 at 1e-8); NeurIPS 2025. Path Not Taken v1 abstract, Sec. 2.3 (model-
conditioned bias, consistent across runs, invariant to datasets and recipes, bf16 amplifies); preprint
(NeurIPS 2025 workshop). Spurious Rewards v2 Sec. 2.2 (21.4, 24.1, 29.1), abstract (code reasoning
without execution, clipping bias, Llama3/OLMo2), Sec. 5.3 and Table 2 (49.4 to 64.4, Qwen2.5-1.5B +10.0,
Qwen2.5-7B 41.6 to 22.2, Llama and OLMo2 down). Reasoning or Memorization v3 Sec. 1 (54.60% vs 3.8%,
LiveMathBench 202505 0.0%), abstract (only accurate rewards pass the boundary); AAAI 2026. Reasoning with
Sampling v1 Sec. 1, 4 (alpha 4, MCMC over token blocks, no training or verifier), 5.1 (three models),
Table 1 (0.496, 0.748, 0.785), 5.3 (8.84x from N_MCMC 10, T 679, B 192). Lightman v1 Sec. 1 to 3, Fig. 3
(78.2, 72.4, 69.6, best-of-1860, PRM800K, generator not RL-trained, GPT-4 base). DeepSeek-R1 v2 Supp. G.2
(three PRM limitations, reward hacking, rerank top-N, limited against compute).

Cross-section conditions: pass@(k,T), sparsity, RL's Razor ICLR 2026, Yue NeurIPS 2025, Spurious ICML
2026, DeepSeek-R1 Nature all consistent. Schematic diagram carries "Illustrative, not measured".

Score: **8/10**. Accurate after the venue and scope fixes; mental model (sharpening versus widening,
read off the pass@k crossing) is clear and the payoff (measure base pass@k at the K you can serve) lands
last. 8.84x is landed six times, more than the argument needs.

## Problems outside fc03's files (for the orchestrator)

- DAPO (2503.14476v2) is NeurIPS 2025, and Reasoning with Sampling (2510.14901v1) is ICLR 2026. Other
  sections still badge them "preprint": `Choosing.tsx` L509 and L555 (DAPO), L611 (Sampling);
  `OneLoop.tsx` L386 and L485 (Sampling); check `CostPerImprovement.tsx` and `RlStepAsSystem.tsx`, which
  also cite these papers. `GlossaryAndSources.tsx` ids 42 and 48 say "preprint".
- Register fixes: wave2-rlvr line 147 lists DAPO, f(g(x)), Guru as preprints and Lightman as "venue
  unconfirmed"; correct to NeurIPS 2025, ICLR 2026, NeurIPS 2025 Datasets and Benchmarks, ICLR 2024.
  Dr. GRPO COLM 2025 and Interplay ICML 2026 are now confirmed on OpenReview (no longer "per repo").
- `DIVE_REPO_SHA` bcf5a9ed exists only on the local branch `feat/rl-agentic-loops-build`; the Tier 0
  links resolve once that commit is pushed.
