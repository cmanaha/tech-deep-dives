# Claims: section 6, From Preferences to Rewards (`src/sections/PreferencesToRewards.tsx`)

Authored 2026-10-30. Every arXiv source below was re-fetched at the pinned version on 2026-10-30 and the quoted passage re-read with `pdftotext`. TRL lines were re-read at v1.16.0 (tag object 880617a1 -> commit 1b5c75ed94b7387f42532adb090c935166d4878d) and v1.12.0 (commit 59c4a8e104413fa9f4ca1a54eaf2ff93c0f299be). The OpenAI RFT guide and both SageMaker pages were re-fetched the same day. Format: `claim | source URL | register or wave 2 row`.

## Intro
- In a controlled 13B comparison PPO beat DPO by 0.7 points on average | https://arxiv.org/abs/2406.09279v2 (Table 2 caption) | F01-73; wave2-foundations row 31
- PPO took about 8x the wall-clock of DPO (72 h vs 9 h, our arithmetic) on the dataset the authors timed (UltraFeedback, where PPO led by 1.2 points, 62.2 vs 61.0; the 0.7 is the five-dataset average) | https://arxiv.org/abs/2406.09279v2 (App. K; Table 2) | F01-73; wave2-foundations row 32 (derived); wave2-systems-cost row 32 (fc02 2026-10-30: timing scope stated)

## RLHF
- Three steps: SFT on demonstrations, reward model on comparisons, PPO against the reward model; steps 2 and 3 can iterate on the current best policy | https://arxiv.org/abs/2203.02155v1 (Sec. 3.1) | F01-46; wave2-foundations row 22
- Reward model fitted with Bradley-Terry; reward difference = log-odds of preference; Elo analogy | https://arxiv.org/abs/1706.03741v4 (Sec. 2.2.3); https://arxiv.org/abs/2203.02155v1 (Sec. 3.5) | F01-44; wave2-foundations row 22
- Reward-model loss `-log sigmoid(r(x, y_w) - r(x, y_l))` | https://arxiv.org/abs/2203.02155v1 (Eq. 1) | F01-44
- The PPO stage uses prompts with no human labels | https://arxiv.org/abs/2203.02155v1 (Sec. 3.2, "our PPO dataset, without any human labels") | F01-47
- Per-token KL penalty from the SFT model mitigates over-optimisation of the reward model | https://arxiv.org/abs/2203.02155v1 (Sec. 3.5) | F01-46; wave2-foundations row 22
- On the authors' prompt distribution, 1.3B InstructGPT preferred to 175B GPT-3, over 100x more parameters | https://arxiv.org/abs/2203.02155v1 (abstract; Sec. 1 "over 100x fewer") | F01-50; wave2-foundations row 23
- 4.9 PF/s-days (175B SFT), 60 (175B PPO-ptx), 3,640 (GPT-3 pretraining) | https://arxiv.org/abs/2203.02155v1 (Sec. 5.1) | F01-52; wave2-foundations row 24
- PPO-ptx = PPO with pretraining gradients mixed in | https://arxiv.org/abs/2203.02155v1 (Sec. 3.5) | F01-52 context
- Under 2% of pretraining compute: (4.9 + 60) / 3,640 = 1.78%; the paper gives no separate compute figure for reward-model training | our arithmetic from the same | wave2-foundations row 24 note (derived; fc02 2026-10-30: "excluded from both figures" is not stated in the paper)
- PPO holds up to 4 models: policy, reference, critic, reward model | https://arxiv.org/abs/2402.14740v2 (Sec. 1) | F01-32; wave2-foundations row 25
- TRL v1.12.0 PPO trainer iterates over policy, ref, value and reward models at setup | https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py#L489 | F01-32; wave2-foundations row 25

## DPO
- KL-regularised objective has a closed-form optimum `pi_ref * exp(r / beta) / Z(x)`; Z(x) depends on the prompt, not the response | https://arxiv.org/abs/2305.18290v3 (Sec. 4, Eq. 4) | F01-58; wave2-foundations row 26 (fc02 2026-10-30: "depends on the prompt alone" narrowed)
- Mental-model reading of Eq. 4 (re-weighting of the reference; zero stays zero) | same, our reading of the equation | F01-58 "Use in dive"
- Reward = beta log(pi / pi_ref) + beta log Z; Z cancels in Bradley-Terry; DPO loss Eq. 7 | https://arxiv.org/abs/2305.18290v3 (Sec. 4, Eqs. 5-7) | F01-59
- Classification loss; policy network represents both LM and reward | https://arxiv.org/abs/2305.18290v3 (abstract; Sec. 4) | F01-59; wave2-foundations row 26
- Gradient raises y_w, lowers y_l, weighted by how wrongly the implicit reward orders the pair; unweighted version can degenerate | https://arxiv.org/abs/2305.18290v3 (Sec. 4, "What does the DPO update do?") | F01-60
- DPO removes the reward model, sampling during fine-tuning, and baselines/critic | https://arxiv.org/abs/2305.18290v3 (abstract; Sec. 5.2) | F01-61
- TRL DPO loss subtracts reference log-probs for chosen and rejected | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_trainer.py#L1350-L1351 | F01-62; wave2-foundations row 27
- `precompute_ref_log_probs` default False; saves memory, reference need not stay in memory | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_config.py#L227-L233 | F01-62; wave2-foundations row 27
- TRL DPO `beta` default 0.1 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_config.py#L297-L298 | F01-62 evidence
- DPO is offline; pairs sampled once from pi_ref (= pi_SFT) or reused from public datasets | https://arxiv.org/abs/2305.18290v3 (Sec. 4, DPO outline) | F01-63; wave2-foundations row 26
- PPO trains on online data, DPO on static data, which may limit exploration | https://arxiv.org/abs/2406.09279v2 (Sec. 2.1) | F01-63; wave2-foundations row 26
- A response in none of the pairs gets no direct signal | our reading of the DPO loss (terms only for y_w and y_l) | F01-63
- Diagram: same SFT model and pairs; RLHF three stages with up to 4 models in memory; DPO one stage, policy plus reference log-probs (precomputable) | sources above | F01-32, F01-46, F01-59, F01-61, F01-62

## DPO relatives (expandable)
- IPO bypasses the Bradley-Terry assumption; with (near-)deterministic preferences DPO overfits and KL regularisation weakens; theory plus small examples | https://arxiv.org/abs/2310.12036v2 (Sec. 1; Sec. 4.2) | F01-65; wave2-foundations rows 28, 29 (replacement text applied)
- TRL DPO trainer accepts `ipo` as a loss type | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_config.py#L245-L252 | F01-66 context (re-read 2026-10-30)
- KTO learns from a per-example desirable/undesirable label, keeps the reference model, reports matching or beating DPO from 1B to 30B | https://arxiv.org/abs/2402.01306v5 (Sec. 1) | F01-67; wave2-foundations row 29
- TRL v1.16.0 ships a KTO trainer | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/kto_trainer.py | F01-76 tree note (file re-checked HTTP 200 at the SHA)
- ORPO drops the reference model and folds preference learning into SFT, no separate preference stage | https://arxiv.org/abs/2403.07691v2 (abstract) | F01-68; wave2-foundations row 29
- SimPO drops the reference model, length-normalised log-prob reward, target margin added to Bradley-Terry | https://arxiv.org/abs/2405.14734v3 (abstract; Sec. 2.2-2.3) | F01-69; wave2-foundations row 29
- "Pairs fit DPO, IPO, ORPO, SimPO; per-response labels fit KTO" | our reading from the four papers' data requirements | F01-65 to F01-69

## Gradient table
- DeepSeekMath writes DPO in the unified gradient form | https://arxiv.org/abs/2402.03300v3 (Sec. 5.2.1, Table 10) | F01-70; wave2-foundations row 13
- DPO data source: SFT-set questions, outputs sampled from the SFT model; reward: human preference in general domain, "Rule" in math; coefficient Eq. 14 (sigmoid of beta-scaled log-ratios), applied + to preferred tokens and - to rejected tokens (Eq. 13) | https://arxiv.org/abs/2402.03300v3 (App. A.1.4, Eqs. 12-14) | F01-70 (re-read 2026-10-30)
- Rows 1-5 copied word for word from section 5's table (`TwoLeashes.tsx`) | sources cited in sections 4 and 5 | -
- DPO row scorer "an AI judge" | https://arxiv.org/abs/2212.08073v1; https://arxiv.org/abs/2309.00267v3 | F01-77, F01-82
- Reading: signed weight with fixed samples; fixed samples make DPO cheap and give up exploration | our reading | F01-63, F01-70

## PPO versus DPO
- Theorem 4.1: Pi_PPO is a proper subset of Pi_DPO; DPO may exploit out-of-distribution responses | https://arxiv.org/abs/2404.10719v3 (Sec. 4, Theorem 4.1) | F01-72; wave2-foundations row 30
- PPO surpassed other alignment methods in all cases, dialogue to code competitions | https://arxiv.org/abs/2404.10719v3 (abstract) | F01-72; wave2-foundations row 30
- Key factors: advantage normalisation, large batch size, EMA update of the reference model | https://arxiv.org/abs/2404.10719v3 (Sec. 5) | F01-72; wave2-foundations row 30
- Venue ICML 2024 for Xu et al. | https://proceedings.mlr.press/v235/xu24h.html | wave2-foundations G2
- Better preference data largest gain, then learning algorithm; PPO beats DPO by 0.7 average, up to 2.5% math; gains mostly reasoning, coding, safety | https://arxiv.org/abs/2406.09279v2 (abstract; Table 2 deltas +1.3, +2.9, +2.3; Sec. 3.2) | F01-73; wave2-foundations row 31 (fc02 2026-10-30: the Table 2 caption says "chat", but the table has no chat column and Sec. 3.2 says safety)
- PPO 3 days on a 256-size TPUv3 pod plus about 10 h reward model; DPO about 60,000 samples 9 h | https://arxiv.org/abs/2406.09279v2 (App. K) | F01-73; wave2-foundations row 32
- 72 / 9 = 8.0; (72 + 10) / 9 = 9.1; DPO pod size unstated, so wall-clock only | our arithmetic | wave2-foundations row 32

## AI feedback
- RLAIF was introduced by Bai et al. 2022 (Constitutional AI) | https://arxiv.org/abs/2309.00267v3 (abstract) | F01-77; wave2-foundations row 33
- CAI supervised stage: critique against a principle, revise, possibly repeatedly; fine-tune on final revisions | https://arxiv.org/abs/2212.08073v1 (Sec. 1.2) | F01-77, F01-78; wave2-foundations row 33
- CAI RL stage: multiple-choice AI comparison; preference model on AI harmlessness labels mixed with human helpfulness labels; RL against it | https://arxiv.org/abs/2212.08073v1 (Sec. 1.2) | F01-77; wave2-foundations row 33
- Normalised probabilities of (A) and (B) are the preference-model targets | https://arxiv.org/abs/2212.08073v1 (Sec. 4.1) | F01-79; wave2-foundations row 33
- First bridge words to weights: a critique becomes a revision to train on or a number to optimise | SCOPE section 6 wording, our reading | F01-77 to F01-84
- d-RLAIF: off-the-shelf LLM rates 1 to 10 during RL; addresses reward-model staleness | https://arxiv.org/abs/2309.00267v3 (Sec. 2.2.2) | F01-83; wave2-foundations row 33
- PaLM 2 labeler and policy; RLAIF vs RLHF 50% (summarisation), 52% (helpful dialogue), not significantly different from 50%; harmless rate 88% vs 76% | https://arxiv.org/abs/2309.00267v3 (Table 1; Sec. 4.1; Sec. 3.3 for models) | F01-82 (re-fetched 2026-10-30)
- AI labelling estimated over 10x cheaper than human annotation | https://arxiv.org/abs/2309.00267v3 (Sec. 4.1) | F01-82 (re-fetched 2026-10-30)
- CoT judge probabilities near 0 or 1; clamped to 40-60%; without the clamp RL-CAI learned more extreme responses | https://arxiv.org/abs/2212.08073v1 (Sec. 4.1) | F01-80 (re-fetched 2026-10-30)
- Over-trained RL-CAI models can be overly harsh or add boilerplate | https://arxiv.org/abs/2212.08073v1 (Sec. 4.3) | F01-81 (re-fetched 2026-10-30)
- "applies to any judge whose output becomes a training target" | our reading | F01-80

## Decision
- DPO first when the signal is pairwise; on-policy RL earns its cost when a verifier can score fresh samples | our reading from F01-72, F01-73 | wave2-foundations row 34 (labelled synthesis)
- Neither study tests a verifier | wave2-foundations row 34 | -
- Llama 3: SFT models further trained with DPO; explored PPO; DPO "required less compute for large-scale models and performed better, especially on instruction following benchmarks like IFEval" | https://arxiv.org/abs/2407.21783v3 (Sec. 4.1.4) | wave2-foundations G3
- Llama 3 used preference data collected with the best models of previous rounds, conforming better to the policy being optimised; beta 0.1 | https://arxiv.org/abs/2407.21783v3 (Sec. 4.1.4) | wave2-foundations G3 (re-read 2026-10-30)
- IFEval: about 500 verifiable instructions such as "write in more than 400 words", checked by heuristics | https://arxiv.org/abs/2407.21783v3 (Sec. 5.2.1) | gloss, re-read 2026-10-30
- Qwen3 reasoning RL: 3,995 query-verifier pairs, GRPO | https://arxiv.org/abs/2505.09388v1 (Sec. 4.2) | wave2-foundations G3; U17 hedge
- Gemma 3 RL phase based on improved versions of BOND, WARM, WARP (glosses from the report's reference titles: "Aligning LLMs with best-of-n distillation", "weight averaged reward models", "weight averaged rewarded policies") | https://arxiv.org/abs/2503.19786v1 (Sec. 3; references) | wave2-foundations G3; U17 hedge
- OpenAI and Anthropic name no current post-training algorithm in the first-party pages read: OpenAI RFT guide names a grader and weight update, no optimiser; CAI names RLAIF, no PPO (case-sensitive grep) | https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning ; https://arxiv.org/abs/2212.08073v1 | U17 accept-as-hedge; wave2-foundations G3
- SageMaker AI model customisation offers DPO ("Train on preferred vs rejected response pairs") | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22; wave2-aws row 12
- Open-weight table: DPO with LoRA or FFT per model | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-open-weight.html | F06-24; wave2-aws row 12
- Next action: DPO with TRL default beta 0.1 (= Llama 3), held-out pairs, better pairs before heavier algorithm, PPO only for a gap worth ~8x wall-clock, section 7 for checkable gaps | our reading from the cited facts above | F01-62, F01-73, G3
