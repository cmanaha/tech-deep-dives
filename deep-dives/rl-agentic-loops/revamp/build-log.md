# Build log (orchestrator)

Per-section author reports, for the glossary, the fact check and the final report.

| Section | File | Cites | Diagrams (harness 1440/390) | Acronyms expanded | Open items for fact check |
| --- | --- | --- | --- | --- | --- |
| 3 Policy | LanguageModelAsPolicy.tsx | 43 | 1, 0 overlap/clip | RL, GRPO, EOS, PPO, TRL, KL, RLOO, GAE | Strongest number from E0 (one 0/1 reward per 124-164-token completion); Sutton and Barto 2.9 and TRL v1.12.0 ppo_trainer L786-L798, ppo_config L264-L267 checked beyond register |
| 4 Policy gradient | PolicyGradient.tsx | 43 | 2 (baseline weights chart, illustrative; gradient table), 0 overlap/clip | RL, SFT, PPO, GRPO, RLOO, GAE, RLHF, DPO, KL, HH; GSM8K, MATH glossed | Added DeepSeekMath 1.3B comparison (F01-71) in an expandable beyond the block; 'critic' worded per Sutton and Barto. Found generator regex bug (fixed) |
| 5 Two leashes | TwoLeashes.tsx | 42 | 2 (two-leash SVG; E0 entropy chart), 0 overlap/clip (both scroll at 390, min 640) | RL, PPO, KL, TRL, GRPO, RLHF, TRPO, SFT, RLOO, LoRA, GAE, DPO, RFT | Beyond block, sourced: clip acts only when one batch feeds more than one update (DeepSeekMath A.1.5, TRL num_iterations, E0 clip_ratio/region_mean 0.0); LoRA with beta above 0 loads no second copy (TRL code); TRL RLOO beta default 0.05 |
| 6 Preferences | PreferencesToRewards.tsx | 53 | 1 (RLHF pipeline beside DPO), 0 overlap/clip | RL, RLHF, DPO, PPO, SFT, KL, TRL, IPO, KTO, ORPO, SimPO, RLOO, GRPO, GAE, TPU, RLAIF, d-RLAIF, RLVR, LoRA; IFEval glossed; PPO-ptx explained | BOND, WARM, WARP glossed from Gemma 3 report reference titles (not in U23): glossary must verify. About 2,560 words (over target). Strongest number: 0.7 points for about 8x wall-clock |
| 8 What RL does | WhatRlDoes.tsx | 42 | 1 (schematic pass@k curves, illustrative; best-of-K ceiling), 0 overlap/clip (scrolls at 390, min 640) | RL, RLVR, GRPO, SFT, LoRA, KL, bf16, DPO, MCMC, PRM, ORM; MATH-500, AIME, Minerva, Reasoning Gym | Beyond block: Guru 32B counter-example (wave2-rlvr G1) for U1; Interplay venue ICML 2026 from authors' README at ab728f05 (wave 2 'per repo, not re-checked': fc03 verify). 8.84x landed five times (leverage pass: maybe too many). About 2,550 words |
| 7 RLVR & GRPO | RlvrAndGrpo.tsx | 76 | 1, 0 overlap/clip | RL, RLVR, GRPO, TRL, MoE, PPO, KL, DAPO, GSPO, RLOO, RFT, Dr. GRPO; AIME, MATH-500, pass@1, pass@k glossed | R1 v1 71.0% carried from wave2-rlvr row 8 without re-open (fc03 re-open); reading `reinforce_pp` as REINFORCE++ is our reading; beyond registers: TRL paper-index Dr. GRPO recipe omits `scale_rewards="none"` (doc-code conflict), verl default `rollout.n=1` reduces GRPO advantage to the raw reward (fc03 verify both at pin). About 3,000 words incl. tables (over target) |
| 9 Agentic RL | AgenticRl.tsx | 38 | 1 (agent-environment loop, masked tool tokens), 0 overlap/clip (scrolls at 390, min 660) | RL, GRPO, PPO, SFT, LoRA, TRL | Search-R1 venue COLM 2025 from the v5 PDF (wave 2 said preprint: fc04 verify); F02-70's '41%' conflicts with v5's 24% (not used; register fix); pass@(k,T) mechanism is our reading of the authors; verl masking cites F02-38 (F02-33 is TRL). About 2,200 words |
| 10 Reward proxy | RewardIsAProxy.tsx | 41 | 1 (two SVG panels, illustrative over-optimisation shape), 0 overlap/clip | RL, PPO, KL, CoT, RLHF; SWE-bench, LiveCodeBench, HumanEval, pass@1, val_bpb, nats glossed | Owns the four-item grader checklist (sections 15, 21, 22 refer to it). F01-56 arithmetic typo (2.83 for ln 16 = 2.77; ~1.8 nats holds; register fix). MacDiarmid: a hack-detecting penalty in the reward stopped hacking in their setup, which tensions with 'monitors kept out of the reward': shown in an expandable (fc04 check framing). Strongest number 76% landed four times |
| 12 Verbal | VerbalReinforcement.tsx | 36 | 1 (Reflexion loop, signal marked), 0 overlap/clip (scrolls at 390, min 680) | RL, GRPO, SFT, SCoRe, ExpeL; HotPotQA, ALFWorld, HumanEval, MBPP, GSM8K, CommonSenseQA, MATH, WebArena-Shopping glossed | Beyond registers, verified at source: self-written tests passed a wrong solution 16.3% on MBPP vs 1.4% on HumanEval; Huang oracle stopping 89.7; Huang Table 1 lists Reflexion under oracle labels; memory is a sliding window; SCoRe flip columns. Strongest number 0.52 vs 0.60 vs 0.68 (three landings) |
| 11 Text loop | TextLoopAsRl.tsx | 40 | 1 (three stores x two signals grid; self-graded methods dashed), 0 overlap/clip (scrolls at 390, min 700) | RL, PPO, ICL, GD, RLVR, GRPO, ACE, GEPA, OPRO, ProTeGi, MIPRO/MIPROv2, LoRA; F1, soft Q-learning, HumanEval, HotPotQA, AIME, AppWorld, GAIA, WebShop glossed | TextGrad venue 'Nature 2025' from Crossref, quote from arXiv v1, Nature text not read (fc05 verify); Retroformer quote is in Sec 3 of v3 (wave2-words row 31 said Sec 4); placing words-track methods on the survey's split is labelled our extension. Reflexion 0.52/0.60/0.68 landed four times here AND in sections 10 and 12 (leverage: cross-section repetition) |
| 13 Experience | AccumulatingExperience.tsx | 41 | 1 (update-rule spectrum), 0 overlap/clip (scrolls at 390) | RL, GRPO, ACE, PPO; ExpeL, CLIN, ReAct, AIME, AppWorld, FiNER, WebArena-Shopping, HotPotQA, Mean@32 glossed | Beyond register, verified at ACE v3: without delta updates task goal completion 76.2 to 67.3; pruning steady 10K to 100K tokens. Dynamic Cheatsheet text says GPT-4o full history 6.7% but Table 2 shows 13.3 (register F03-34 / wave2 row 26 quote the text; figure not used; register fix). Hedges U7, U9, U10 ship. Strongest number 18,282 to 122 tokens |
| 14 Prompt opt | PromptOptimization.tsx | 57 | 1 (GEPA loop), 0 overlap/clip (scrolls at 390, min 680) | RL, GEPA, GRPO, LoRA, ProTeGi, OPRO, MIPRO/MIPROv2, KL; GSM8K, HotpotQA, HoVer, IFBench, PUPA, AIME-2025, LiveBench-Math glossed | Beyond registers, at pinned sources: gepa-artifact GRPO arm is DSPy GRPO with LoRA on all six tasks; AIME feedback includes the worked solution; DSPy score-only metric fallback text. Strongest number 54.85/48.91/45.23 with 1,839-7,051 vs 24,000 rollouts (three landings). About 2,400 words |
| 15 Your loops | YourLoops.tsx | 34 | 1 (three loops x five RL parts grid; search loops marked 'costly: paid in samples', no missing part), 0 overlap/clip (scrolls at 390, min 700) | RL; val_bpb glossed | FunSearch 'on the order of 10^6' quote is in the main text, not Methods (wave2-limits G2 and section 11's cite say Methods: fc05 fix section 11 cite text). Hedge U11 ships. Strongest number: about 100 experiments a night, one reading each (four landings) |
| 16 Hybrids | Hybrids.tsx | 36 | 1 (advisor and student), 0 overlap/clip (scrolls at 390, min 680) | RL, GRPO, MTOB, PAG, GEPA, PPO, UCB, TRL; chrF, MATH-500, regret, soft Q-learning glossed | EVOLvE confirmed ICML 2025 (PMLR 267); BetterTogether EMNLP 2024 (ACL Anthology). Ending has a TRL reward-function sketch marked 'Illustrative, not run'. Strongest number about 70% (our arithmetic), three landings |
| 17 Words limits | WhereWordsFallShort.tsx | 31 | 1 (RULER GPT-4 row measured + schematic marked illustrative), 0 overlap/clip | RL, AD, ED, DPT, UCB, GRPO, TRAIL, MAB (in a quote); RULER, SWE-bench glossed | Greedy Agents paper intro gives 64% where Fig. 5 gives 58%: page states the discrepancy (fc07 check). verl L143-L148 and core_algos L304-L331 at v0.9.1. Tool use in F04-17 tested on GPT-4 family only (page says so). U14 hedge ships. Strongest number 87% / 58% vs 21% (three landings) |
| 19 RL systems | RlStepAsSystem.tsx | 80 (T0 9, T1 35, T2 2, T3 34) | 1 (sync vs async timelines, illustrative), 0 overlap/clip (scrolls at 390, min 680) | RL, PPO, GRPO, KL, TRL, DAPO, MTP, KV, RLHF, RLVR; AIME glossed | MemAvailable drop is 23.1/23.9 GiB (23,694/24,472 MiB): build-log cross-section block corrected. Min IS ratio 0.0 confirmed in logs (run 1 steps 8-10, run 2 steps 8 and 16). DeepSeekMath GRPO quote is in Sec 4.1.1, not Sec 1 (register fix). verl reproduction 67.4% re-summed from the public W&B record. Strongest number 8x GPUs for 45% cut (three landings) |
| 18 Weights vs context | WeightsVsContext.tsx | 24 | 1 (two-column map, contested rows amber, legend), 0 overlap/clip (scrolls at 390, min 640) | RL, RAG, SFT, KL, RLVR, GRPO; MMLU, AIME glossed | New beyond rows, logged in claims: GPT-4 calibration error 0.007 vs 0.074 read off Fig. 8 (fc07 verify the read-off); 0.810 for fine-tuning plus retrieval; FormatSpread works without weight access. DeepSeek-R1 Table 16 not re-opened (rests on wave 2) |
| 20 Cost | CostPerImprovement.tsx (+ lib/breakeven.ts, breakeven.test.ts) | about 45 | 1 (live SVG cost lines from the calculator), 0 overlap/clip (scrolls at 390; breakeven point off-screen until scrolled, result text states it) | RL, GRPO, Dr. GRPO, ProRL, DAPO, GEPA, LoRA, RFT, ACE, SFT; AIME, MATH-500 glossed | 26 tests pass (18 in breakeven.test.ts, 8 in Cite.test.tsx); mutating the formula failed 5, and fc08's
  sign flip failed 4 of the 18. W&B DAPO run re-checked (159.6 h, 489 steps). Strongest number about 665,000 with cross-model caveat (two landings) |
| 21 Lab | SideBySideLab.tsx | 29 | 2 (E0 step-time stacked bars; E1 arms labelled protocol), 0 overlap/clip | RL, GRPO, TRL, LoRA, GEPA, ACE, bf16 | All E0 figures checked against raw logs; memory 23.1/23.9 GiB (wave2-systems-cost's '23.7/24.5' is MiB/1000: register fix). F05-44 NVIDIA Spark GRPO playbook checks out. Strongest number 9 and 10 of 20 steps with no gradient at a 4% base rate (three landings) |
| 22 Choosing | Choosing.tsx | 29 (T0 4, T1 14, T3 11) | 1 (decision tree), 0 overlap/clip (scrolls at 390, min 680) | RL, GRPO, RFT, SFT, DAPO, TRL, GEPA, LoRA, RLVR; pass@k, advantage, MATH-500, AIME 2024, AIME-2025 glossed | New beyond rows: eligible existing OpenAI customers can create training jobs until January 6, 2027 (read at source). AWS service for sampling, advisor and playbook distillation marked our reading. Written before sections 20 and 23 existed: fc09 check consistency with both. E0 9/10 of 20 landed five times (leverage: maybe too many) |
| 23 AWS | RlOnAws.tsx | 53 (T1, T2) | 1 (weights and words stacks at three levels, shared grader on top), 0 overlap/clip (scrolls at 390, min 720) | RL, SFT, DPO, RFT, GRPO, LoRA, TRL, RLVR, RLAIF, MTRL, RLOO, PPO, GAE, NxD; tau2-bench, Pass^1/Pass^3, pass@k glossed | Re-tallied all 149 HyperPod GRPO recipes: only 68 set adv_estimator: grpo directly (rest inherit), one uses n: 16, so 'verl PPO trainer with GRPO estimator, 8 samples per prompt' is stated for the Qwen3 32B recipe only (register F06-37/38 fix). Rank-32 LoRA source is the best-practices post (08 APR 2026), not the walkthrough (wave2-aws G4 wording). One grader, two update targets (three landings); $80.00 per hour four times |
| 1 One loop | OneLoop.tsx | 3 cites, 2 claims | 1 (loop with three update slots, two methods each), 0 overlap/clip (scrolls at 390, min 640) | RL, PPO, GRPO, GEPA, RLHF, DPO, SCoRe, ACE, SFT | Adds a fourth route that stores nothing (inference-time sampling). Only figure 8.84x, same wording and cite as section 8. About 1,130 words |
| 2 Getting started | GettingStarted.tsx | 2 | 1 (reading map, routes L/A/R in blue/orange/green with legend), 0 overlap/clip (scrolls at 390) | RL, RLVR, GRPO, PPO, KL, GEPA | Capability boundary is defined in section 8, not 3 (page points to 8). Scope's claim that route sections gloss every skipped method failed: section 20 names DAPO and Dr. GRPO without a gloss; page tells the reader to look for one (fc08: add one-clause glosses in section 20) |

## Cross-section conditions to keep consistent

Facts that more than one section states. A section that contradicts one of these is wrong; the owner
section and source are named so the fact check can trace it.

- **TRL defaults at v1.16.0** (sections 5, 7, 19, 21): GRPOTrainer `loss_type` `dapo`, `beta` 0.0 (no
  KL term and no reference model loaded), `epsilon` 0.2, `num_generations` 8, `scale_rewards`
  `group`, `num_iterations` 1, `vllm_importance_sampling_correction` True. TRL's PPO trainer is read at
  v1.12.0; it was removed in v1.13.0 and is absent at v1.16.0 (wave2-foundations row 6).
- **E0 numbers** (sections 3, 5, 7, 19, 21; source `research/2026-10/E0-spark-smoke.md`): Qwen2.5-0.5B-
  Instruct, full fine-tuning, TRL 1.16.0 and vLLM 0.28.0 colocate on one GB10; 20 steps of 16
  completions (2 prompts x 8), up to 256 tokens. Median step 2.087 s and 2.110 s; generation 62.0% and
  62.9% of summed step time, training 29.9% and 29.5%, other preparation 6.8% and 6.5%, weight sync
  17 ms (0.9% and 0.8%). Mean reward 0.044; 9 and 10 of 20 steps had every group all zero (no gradient).
  Entropy 0.19 to 0.32. Log-probability difference vLLM against trainer averaged 0.011, largest 0.92 and
  1.14. `MemAvailable` drop 23,694 and 24,472 MiB (23.1 and 23.9 GiB); `torch.cuda.max_memory_allocated` 17.23 and 17.89
  GiB. E0 shows the mechanism, not learning: the reward did not move.
- **Generation share at scale** (sections 19, 20): 72.1% for Skywork-OR1-32B (register 05 F05-42);
  verl's public reproduction logged generation at 67.4% (wave2-systems-cost G1). E0's 62% is a 0.5B
  model with short outputs: different scale, same ordering of stages.
- **DeepSWE** (sections 9, 20): Qwen3-32B, RL only, 64 H100s, six days; 23% pass@1 at the start of RL to
  42.2% pass@1 on SWE-Bench Verified, 71.0% pass@16, all Agentica and Together AI's claims
  (`kind="vendor-claim"`); a base pass@16 was not located (wave2-rlvr rows 40, 40b).
- **The 32B base in the DeepSeek-R1 distillation comparison is Qwen's** (Qwen2.5-32B), not DeepSeek's
  (wave2-rlvr row 9).
- **pass@(k,T)** (sections 8, 9): "large k" means k up to 64, the RL arm is LoRA GRPO on
  Qwen2.5-7B-Instruct, and the multi-hop gap is 0.81 against 0.77 (wave2-rlvr row 41).
- **Sparsity** (section 8 only): 68.5% to 96.0% across ten public checkpoints and seven methods at a
  1e-5 bf16 tolerance; F02-85 names an optimisation bias that bf16 amplifies ("sparsity cannot be
  explained by precision alone"); RL's Razor (ICLR 2026) found none in float32 (wave2-rlvr rows 30, 31).
- **GEPA** (sections 11, 14, 16, 20, 21): its GRPO baseline used 24,000 rollouts; the full fine-tuning
  comparison is one task (a 2-hop HoVer program); the Pareto front is over the validation set; GEPA's
  reflector in the paper's open-model runs was Qwen3 8B (wave2-words rows 3, 6, 40).
- **MIPRO** expands as "Multi-prompt Instruction PRoposal Optimizer" (wave2-words row 38).
- **ReTool's** RL lift includes a cold-start SFT stage, and 67.0 is ReTool's own figure (wave2-words
  row 11).
- **GAE at lambda = 1** still subtracts the critic as a baseline; the critic stops standing in for
  future reward but is not ignored (wave2-foundations row 12).
- **DPT** predicts optimal actions from in-context datasets that may be random; only Algorithm
  Distillation trains on learning histories (wave2-limits row 23).
- **FunSearch** used "on the order of 10^6" samples (wave2-limits, U21 closed).
- **AWS** (sections 20, 22, 23): Amazon Nova 2 Lite RFT is $80.00 per training hour (wave2-aws G2);
  Bedrock RFT trains rank-32 LoRA adapters (AWS ML blog, Tier 2 vendor statement); Neuron documentation pinned at v2.33.0; AgentCore's
  episodic memory test on tau2-bench is AWS's own (Tier 2, vendor claim).
- **BOND, WARM, WARP** (section 6): Best-of-N Distillation, Weight Averaged Reward Models, Weight Averaged
  Rewarded Policies (arXiv titles 2407.14622v1, 2401.12187v1, 2406.16768v1, checked 2026-10-30).
- **MTOB** is "Machine Translation from One Book" (the benchmark's own abstract, arXiv 2309.16575); section 16
  wrote "with One Book" (fc06 fix).
- **Venues**: DAPO NeurIPS 2025; Reasoning with Sampling ICLR 2026; f(g(x)) ICLR 2026; Guru NeurIPS 2025
  Datasets and Benchmarks; Let's Verify Step by Step ICLR 2024; ReTool ICLR 2026; ImpossibleBench ICLR
  2026; Search-R1 COLM 2025; SCoRe ICLR 2025; LLMs are Greedy Agents ICLR 2026; Lost in the Middle
  TACL 2024; ProRL NeurIPS 2025; OpenRLHF EMNLP 2025 System Demonstrations; PipelineRL TMLR 2026;
  HybridFlow passages in its Section 2.3 (fact checks fc03 to fc08); RL's Razor ICLR 2026; F04-53 ACL Findings 2024; DeepSeek-R1 Nature; Yue et al. NeurIPS
  2025; Spurious Rewards ICML 2026; Gao et al. ICML 2023; RLOO ACL 2024; Math-Shepherd ACL 2024;
  Ovadia et al. EMNLP 2024; Shen et al. ICML 2024 (position paper).
- **OpenAI's fine-tuning platform is closed to new users** (wave2-foundations G3): any section naming
  OpenAI RFT as an option says so.
