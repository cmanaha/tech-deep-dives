# fc08-systems-cost: fact check of sections 19 and 20

Agent: fc08-systems-cost. Date: 2026-10-30. Files: `src/sections/RlStepAsSystem.tsx` (section 19),
`src/sections/CostPerImprovement.tsx` (section 20), `src/lib/breakeven.ts`,
`src/__tests__/breakeven.test.ts`; claims lists `revamp/claims/rl-systems.md`, `revamp/claims/cost.md`.

Status: DONE. Corrections applied to both section files and both claims lists. `breakeven.ts` and its
test are unchanged (the arithmetic checks out). No diagram was touched (all fixes are prose, cite labels
and venue badges), so the screenshot harness was not re-run.

Sources opened by this agent: arXiv PDFs at the pinned versions (pdftotext -layout, in `/tmp/rl-fc-fc08/txt`):
2409.19256v2 (plus its arXiv HTML for section numbering), 2505.22312v2, 2505.24298v5, 2509.19128v2,
2501.12948v2, 2405.11143v6, 2402.14740v2, 2406.09279v2, 2402.03300v3, 2503.14476v2, 2510.08191v1,
2507.19457v2, 2505.24864v1, 2503.20783v2, 2510.14901v1, 2504.07952v1, 2510.04618v3; arXiv export API
comments; ACL Anthology 2025.emnlp-demos.48 (OpenRLHF, PDF re-read); TMLR accepted-papers list
(https://jmlr.org/tmlr/papers/, PipelineRL, March 2026); https://neurips.cc/virtual/2025/poster/117423
(ProRL). Code via `gh api .../contents?ref=<tag>`: TRL v1.16.0 `grpo_config.py`, `grpo_trainer.py`,
`generation/vllm_generation.py`; TRL v1.12.0 `experimental/ppo/ppo_trainer.py`; verl v0.9.1
`ppo_trainer.yaml`, `rollout/rollout.yaml`; OpenRLHF v0.11.2 `cli/train_ppo_ray.py`; slime v0.4.0
`slime/utils/arguments.py`, `train.py`; prime-rl v0.10.0 `orchestrator.py`, `pyproject.toml`; verl-recipe
e7f88957 `dapo/README.md`. W&B public GraphQL API for run `0qjd0wap` (config, createdAt, heartbeatAt,
489-row `timing_s/step` and `timing_s/gen` history, summed locally) and the project's run list. AWS:
Bedrock pricing page, Price List API offer 20261030160456 (us-east-1), RFT user guide (supported models),
RFT job page, best-practices blog post (08 APR 2026). DeepSWE post. E0: `E0-spark-smoke.md` and every
raw file in `run1/`, `run2/` (`steps.jsonl`, `logs.jsonl`, `summary.json`, `meta.json`, `mem.log`,
`train.log`), recomputed by script.

## E0 figures against the raw logs (both files)

Recomputed from `run*/steps.jsonl`, `logs.jsonl`, `summary.json`, `mem.log`, `train.log`:
generation (`vllm_generate`) 62.04% and 62.87% of summed step time; training (wall minus
`prepare_total`) 29.89% and 29.49%; other preparation (`prepare_total - generate - score`) 6.85 to 6.87%
and 6.53%; weight sync 0.86% and 0.82%, median 0.017 s; median step (steps 2 to 20) 2.087 and 2.110 s;
`MemAvailable` 53,359 - 29,665 = 23,694 MiB (23.14 GiB) and 53,346 - 28,874 = 24,472 MiB (23.90 GiB);
`sampling_logp_difference` mean of means 0.0114 and 0.0114, max 0.920 and 1.137;
`importance_sampling_ratio/min` = 0.0 at run 1 steps 8, 9, 10 and run 2 steps 8, 16; IS max 2.80 and
2.86; vLLM startup (run 2 `train.log`): 121.69 GiB device, 0.12 -> 14.6 GiB, KV 12.71 GiB, weights 0.93
GiB. All match the page. Two E0 figures rest on the write-up alone: `torch.cuda.mem_get_info()` 11.9 GiB
free (no raw file carries it) and "other services held about 70 GB" (raw arithmetic gives 121.69 GiB -
52.1 GiB = 69.6 GiB, so GiB; page corrected, see 19.11).

## RlStepAsSystem.tsx (section 19)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 19.1 | HybridFlow cite labels "Section 2.2" for the fourth stage, memory-bound decoding, compute-bound training ("Sections 2.1 and 2.2"), the weight move, 58.9%, and 140 GB / 36.4% (twice) | RlStepAsSystem.tsx:382, 392, 412, 420, 544, 559, 871 | WRONG (section number) | https://arxiv.org/abs/2409.19256v2 (PDF and https://arxiv.org/html/2409.19256v2): all six passages sit in Sec 2.3 "RLHF Characteristics", paragraph "Unbalanced computation between actor training and generation"; Sec 2.2 is "Programming Model for Distributed ML" | All seven labels now say Section 2.3 ("Sections 2.1 and 2.3") |
| 19.2 | OpenRLHF paper badge "preprint" | RlStepAsSystem.tsx:550 | STALE (venue) | https://aclanthology.org/2025.emnlp-demos.48/ (EMNLP 2025 System Demonstrations; the Anthology PDF carries the same "often accounts for over 90%" sentence as v6) | Badge "EMNLP 2025 System Demonstrations" |
| 19.3 | PipelineRL badge "preprint" (three cites) | RlStepAsSystem.tsx:611, 641, 718 | STALE (venue) | https://jmlr.org/tmlr/papers/ lists "PipelineRL: Faster On-policy Reinforcement Learning for Long Sequence Generation", March 2026 | Badges "TMLR 2026" |
| 19.4 | "Its extra trainer forward pass over every completion took 6.8% and 6.5% of step time"; list item "The log-probability recompute ... 6.5% to 6.8%" | RlStepAsSystem.tsx:803-805, 880-882 | OVERREACH | E0 write-up names the row "Other preparation (trainer-side log-probabilities for the vLLM mismatch correction, advantages)"; raw timers: `prepare_total - generate - score`, which holds the extra forward pass and the advantage computation | Now: the forward pass "sits in the preparation time outside generation, which together with the advantage computation took 6.8% and 6.5%"; list item reworded the same way |
| 19.5 | "the remainder is 6.8% and 6.5% other preparation and 0.9% and 0.8% weight sync" | RlStepAsSystem.tsx:576-577 | OVERREACH (minor) | steps.jsonl: remainder after generation and training is 8.1% and 7.6%; about 0.3% sits in the generate wrapper outside `vllm_generate` and `weight_sync`, plus scoring | "most of the remainder is" |
| 19.6 | "TRL recomputes the trainer's log-probability of every sampled token whenever vLLM generates" | RlStepAsSystem.tsx:752-753 | OVERREACH | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2642-L2645: the recompute runs when `use_vllm and vllm_importance_sampling_correction` (or on step misalignment) | "whenever vLLM generates and the mismatch correction is on (the default)" |
| 19.7 | "measured generation shares run from 62% to 78%" in the block that also cites a source reporting more than 95% | RlStepAsSystem.tsx:522-524 | OVERREACH (inconsistent with the same block) | https://arxiv.org/abs/2406.09279v2 App G: "more than 95% of the total training time" | "the stage-by-stage breakdowns put generation at 62% ... to 78%" |
| 19.8 | slime: "an explicit `--no-offload-train` is kept unless `--release-train` is on" | RlStepAsSystem.tsx:994-996 | WRONG (misleading) | https://github.com/THUDM/slime/blob/v0.4.0/slime/utils/arguments.py#L2117-L2126: under `--release-train`, `offload_train` is set False and train actors are released instead; an explicit `--no-offload-train` is never overridden | "an explicit `--no-offload-train` is kept, and `--release-train` releases the trainer instead of offloading it" |
| 19.9 | OpenRLHF 0.95 "a value that assumes vLLM owns its GPUs" stated as fact | RlStepAsSystem.tsx:973-974 | OVERREACH (inference unlabelled) | https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L250-L255 sets the default only | "a value that, on our reading, assumes vLLM owns its GPUs" |
| 19.10 | "On a single machine colocation is the only placement" | RlStepAsSystem.tsx:1031 | OVERREACH | OpenRLHF train_ppo_ray.py#L201-L228 (separate GPUs per role by default) and slime arguments.py#L40-L79 (separate rollout GPUs) place roles apart on one multi-GPU node; only a single GPU forces colocation | "On a single GPU colocation is the only placement" |
| 19.11 | "other services held about 70 GB" | RlStepAsSystem.tsx:888 | WRONG (unit, minor) | run2/train.log 121.69 GiB device memory; run1/mem.log 53,359 MiB available: 69.6 GiB | "about 70 GiB" |
| 19.12 | Ivison cite "Appendix G" for a sentence that also states TPUv3 | RlStepAsSystem.tsx:510 | UNSUPPORTED at the cited location (partial) | https://arxiv.org/abs/2406.09279v2 App K: "256 or 128-size TPUv3 pods" | Label "Appendices G and K" |
| 19.13 | "The docstring's list of modes still tags token_truncate as the default" | RlStepAsSystem.tsx:781 | prose (history voice: "still") | - | "still" removed |
| 19.14 | "rollout" used from the h1 on with no gloss | RlStepAsSystem.tsx:342, 350-351 | prose rule (RL term at first use) | authoring brief | Intro: "writes the attempts (rollouts)" |
| 19.15 | "with no measurement behind it" (OpenRLHF's 90%) | RlStepAsSystem.tsx:549 | OVERREACH (hedge scope) | https://arxiv.org/abs/2405.11143v6 Sec 1: no citation or measurement in the paper | "with no measurement in the paper behind it" |

CONFIRMED: 75 of 93 claims checked. HybridFlow Sec 2.1 three stages, Adam, single forward pass per
scoring model; Sec 2.4 "models except the actor are idle"; Sec 8.1 testbed (A100-80GB); Sec 8.3
colocate best 16 to 64 GPUs, split (NeMo-Aligner's actor and reference on one set, critic and reward on
another) best at 96 for 13B and 96 to 128 for 34B, fixed batch over larger DP lowers
computation-to-communication; ref [30] is OpenRLHF 2023. Back to Basics Sec 1 "up to 4 models";
TRL v1.12.0 ppo_trainer.py L489. DeepSeekMath Sec 4.1.1 group-average baseline. TRL v1.16.0
grpo_config L681-L688 (beta 0.0, reference not loaded), trainer L982-L990, L2640-L2655 comment,
L2660-L2703 (exp of summed diffs, masked_fill 0.0, no lower bound when clip_min None), L2874-L2890 (logged
min after the mask), L3146-L3147, config L327-L331 vs L934-L935 doc-code conflict, L925-L962 (True,
`sequence_mask`, 3.0, None), L587-L618 and L655-L663 vLLM defaults, vllm_generation L481-L517 (per-parameter
`load_weights`, `reset_prefix_cache`). Skywork-OR1 Table 7 (309 h, 223 h, 72.1%, 8.7%), Table 8 (76.3,
76.3, 77.6 on 32 H800), Sec 4.1 and Table 5 (7B, DR 64, gs 16, 16K), Table 9 (375/270/225/205 s on
32/64/128/256 H800, 1,024 responses), Sec 5.2 quotes, Sec 8.1 (32B release at step 1000), no GPU count
for the 32B run in the text. verl run: 489 steps, 159.56 h step time, 107.56 h generation = 67.41%,
16 x 8 GPUs, span 273.77 h (114.2 h outside timers); README L45 DAPO row 16x8xH800 (the only finished
DAPO-Qwen2.5-32B run in the project). Ivison App G more than 95%, NeurIPS 2024 footer. OpenRLHF Sec 1
quote. AReaL Sec 1 quote, Sec 3.2 (underused devices; memory-IO-bound, "fail to improve throughput"),
Sec 5.1 eta, Sec 5.2 decoupled PPO, Sec 7.1 Table 1 (1.5B, 16 nodes, 250 steps, 14.8 / 41.0 / 33.6
author-estimated verl, AIME24 42.2 and 42.0), NeurIPS 2025 footer. PipelineRL Sec 1 "only briefly
pauses", Sec 3 (7B on one H100 almost linear to 128; fewer longer generations remain). DeepSeek-R1 App
B.1 MTP quote. prime-rl orchestrator L542-L543, pyproject L39-L47 and L58. verl yaml L55-L60, L45-L46,
L60-L61, L63-L64. OpenRLHF L201-L228, L240, L250-L255, L256-L290 (off, geometric mean, 0.5 and 5.0),
L707-L709. slime L40-L79, L1165-L1174, train.py L47-L97. All E0 figures (block above). Venues EuroSys
2025, NeurIPS 2025 (AReaL), Nature 2025, ACL 2024, NeurIPS 2024; Skywork-OR1 and DeepSeekMath preprint.

Score: 9/10. Accurate at the pins after the fixes; every quantitative claim cited, E0 figures match the
raw logs; the four-stage model and the 45% figure (landed four times) carry the section, and it ends on
the reader's next action. The framework-defaults expandable is dense.

## CostPerImprovement.tsx (section 20) and the calculator

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 20.1 | DAPO and Dr. GRPO named without a gloss (known item: section 2 promises one-clause glosses) | CostPerImprovement.tsx:1064, 1075 | prose rule (required edit) | RlvrAndGrpo.tsx L234 (Dr. GRPO removes the length and standard-deviation divisors), L252-L293 (DAPO Clip-Higher, dynamic sampling, token-level loss) | Dr. GRPO: "the GRPO variant of section 7 that drops the division by each answer's length and by the group's standard deviation"; DAPO: "the GRPO variant of section 7 that raises the upper clip bound, keeps only prompts whose group of answers is neither all right nor all wrong, and averages the loss over every token in the batch" |
| 20.2 | ProRL badge "preprint" | CostPerImprovement.tsx:102 | STALE (venue) | https://neurips.cc/virtual/2025/poster/117423 (NeurIPS 2025 poster, same title and authors) | Badge "NeurIPS 2025" |
| 20.3 | "$80.00 per training hour for each of its three base models": the cited pricing page and Price List carry the prices, neither carries "three base models" | CostPerImprovement.tsx:1088-1094 | UNSUPPORTED at the cited sources (true at another Tier 1 page) | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html "Supported models" table: Nova 2 Lite, gpt-oss-20B, Qwen3 32B | Cite added to that page (already source 13 in the glossary) |
| 20.4 | "rollouts" first used in the inputs paragraph, glossed only later in the GEPA paragraph | CostPerImprovement.tsx:1034, 1083 | prose rule (RL term at first use) | https://arxiv.org/abs/2507.19457v2 Sec 2 (rollouts as invocations of the system plus evaluation) | Gloss moved to first use |

CONFIRMED: 46 of 48 claims checked. Training-Free GRPO Sec 4.2 (20,000 GPU-hours at $0.5, about $10,000;
4 GPUs at $0.5, about 400 problems an hour, $0.005; "presupposes continuous GPU availability ..."; 60K
input and 8K output tokens, about $0.02 with cache-hit pricing; about $18 for 100 samples; "large
API-based model ... dedicated small model"), Table 3 (ReTool 67.0 on Qwen2.5-32B-Instruct; 82.7 on
DeepSeek-V3.1-Terminus, Mean@32), Figure 1 caption (671B). Breakeven arithmetic 9,982 / 0.015 = 665,466.7;
/ 400 = 1,664 h, 69.3 days. GEPA Table 1 (Qwen3 8B; 1,839 to 7,051, average 3,936; 24,000; 54.85 vs 48.91;
ahead on five, AIME-2025 32.00 vs 38.00), LoRA for GRPO. DeepSeek-R1 App B.4.4 and Table 7 (147K, $294K
at $2; R1-Zero 101K on 64*8 H800; 30B preparatory runs on A100 not costed). ProRL Sec 3.2 (4 nodes of 8
H100-80GB, about 16k GPU-hours), Sec 1 (more than 2k steps, 1.5B); 16,000 / 216 = 74.1. Dr. GRPO Sec 1
(27 hours on 8 A100), Sec 3.2 heading. DeepSWE post (six days on 64 H100s, Qwen3-32B, RL only; vendor
claim). verl run (above); 128 x 159.6 = 20,429 (exact timers give 20,423; "about 20,400" holds); span
gives about 35,000. Bedrock pricing page ($80.00 for gpt-oss-20b and Qwen3 32B; "The entire training
workflow is billed at an hourly rate"); Price List SKU "$80.00 per hour for Nova2.0Lite-RFT-Training-Hours
in US East (N. Virginia)"; RFT job page quote; best-practices post "EarlyStopping (enabled by default)
automatically stops training when performance improvements plateau". Dynamic Cheatsheet Sec 5 footnote
13 (370, 1035, 1831; 2.8x and 4.9x). ACE Sec 4.7 (GPT-5.1, 91.8%, 82.6%), App A.3 stages. Reasoning with
Sampling Sec 5.3 (8.84x, MATH500, T = 679). Every preset's scope text matches its source at the stated
scope (cross-model labels on the Training-Free GRPO pair, "our arithmetic" on 216, 9,216, 20,429, 2.8,
4.9; the sampler's copied cost per query labelled our assumption; Bedrock hours left to the reader with
the U22 hedge). Venues: Nature 2025, COLM 2025, ICLR 2026 (GEPA, ACE, Reasoning with Sampling), EACL 2026;
Training-Free GRPO preprint.

Calculator: `breakeven.ts` formula, dominance, side and quality-gap logic checked by reading; the page's
`applyPreset`, `parseSide` and result lines agree with it. `breakeven.test.ts` has 18 tests, all pass.
Mutation check: changing `(a.trainingCost - b.trainingCost)` to `+` failed 4 of 18; file restored
(`git diff` empty for `breakeven.ts`), 18 of 18 pass again.

Score: 9/10. Accurate at the pins after the fixes; every preset value carries its source, the 665,000
figure is landed twice with its cross-model caveat, and the section ends on the calculator and the
reader's next step. The DAPO gloss lengthens an already dense paragraph.

## Items for the orchestrator

- `GlossaryAndSources.tsx`: source 50 (ProRL) should read NeurIPS 2025, source 89 (OpenRLHF) EMNLP 2025
  System Demonstrations, source 91 (PipelineRL) TMLR 2026; all three say "preprint".
- Register 05 rows F05-2 and F05-3 give HybridFlow "Sec 2.2"; the passages are in Sec 2.3 ("RLHF
  Characteristics"). Register 05's source table lists OpenRLHF and PipelineRL as preprints.
- The calculator has 18 tests (`breakeven.test.ts`); the "26 tests" in `build-log.md` and the fc08 known
  item count the whole suite, which adds `Cite.test.tsx` (8). The build log's "mutating the formula
  failed 5" did not reproduce exactly: this mutation failed 4 (depends on the mutation chosen).
- E0 write-up (`E0-spark-smoke.md`): "other services held about 70 GB" is about 70 GiB by the raw files
  (121.69 GiB device memory, 52.1 GiB MemAvailable); `torch.cuda.mem_get_info()` 11.9 GiB is in no raw
  file (the preflight output was not kept). Both stay on the page on the write-up's authority.
- Section 19 keeps DAPO with its expansion only (no gloss): it names a run, and the route that reaches
  section 19 reads section 7 first. Add a gloss there too if the glossary pass wants symmetry.

## Checks

```
typecheck exit=0   (tsc --noEmit, no output)
lint exit=0        (eslint src --ext .ts,.tsx --max-warnings 0, no output)
Test Files  2 passed (2)
     Tests  26 passed (26)   (breakeven.test.ts 18, Cite.test.tsx 8)
[PASS] no-ai-tells: no AI tells in 5 opted-in deep dive(s)
[PASS] pinned-refs: all GitHub references pinned across 375 file(s) (5 src, 5 research)
[PASS] svg-a11y: all inline <svg> accessible across 132 file(s) in 5 opted-in deep dive(s)
[PASS] pre-overflow: every <pre> can scroll across 5 opted-in deep dive(s)
```
