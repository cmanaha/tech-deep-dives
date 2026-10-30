# fc09-lab-aws: fact check of sections 21 (Side by Side on a DGX Spark), 22 (Choosing a Text Loop, a Hybrid or a Weight Update) and 23 (RL & Learning Loops on AWS)

Agent fc09, 2026-10-30. Files: `src/sections/SideBySideLab.tsx`, `src/sections/Choosing.tsx`,
`src/sections/RlOnAws.tsx` and their claims lists `revamp/claims/lab.md`, `choosing.md`, `aws.md`.

Evidence opened for this check:
- E0 raw files under `research/2026-10/E0-spark-smoke/` (`run1/` and `run2/`: `steps.jsonl`, `logs.jsonl`,
  `summary.json`, `meta.json`, `mem.log`, `train.log`, `start`; `train.py`, `run.sh`, `pip-freeze.txt`),
  re-derived with a local script; every E0 file the page links is unchanged between `DIVE_REPO_SHA`
  bcf5a9ed and HEAD.
- TRL v1.16.0 (tag peels to `1b5c75ed94b7387f42532adb090c935166d4878d`), shallow clone.
- NVIDIA/dgx-spark-playbooks at `c035e0ac7d211509ec131b79b5b6f0f824a9e421` (unsloth README, vlm README,
  `train.yaml`, `image_vlm_config.yaml`, `Image_VLM.py`, `train_image_vlm.py`).
- aws/sagemaker-hyperpod-recipes tag 2.0.11 = `a6030c319908c8a1b74cb619b00476f8e6baa04f`, shallow clone,
  all 149 `verl-grpo-*.yaml` re-tallied.
- aws-neuron/aws-neuron-sdk tag v2.33.0 = `10832bbcc6b6920b3046a7d7aa59b6b684f6b81a`, shallow clone (blobs
  over 2 MB filtered), `git grep -w` for GRPO and PPO.
- AWS pages fetched today with plain curl (no custom headers), text extracted locally: Bedrock user guide
  (reinforcement-fine-tuning, reward-functions, reward-functions-open-weight, rft-prepare-data,
  rft-prepare-data-open-weight, custom-models, advanced-prompt-optimization-how), Bedrock pricing page,
  AWS Price List offer AmazonBedrock/20261030160456/us-east-1 (publicationDate 2026-10-30T16:04:56Z),
  What's New 2025-12-03 RFT launch, AWS ML blog RFT best practices (datePublished 2026-04-08), SageMaker AI
  developer guide (customizing-models, model-customize-open-weight, model-customize-mtrl-agent,
  model-customize-mtrl-hyperparams, customizing-models-training-sessions, training-sessions-sdk), AgentCore
  developer guide (episodic-memory-strategy, memory-episodic-prompt, memory-custom-strategy,
  memory-self-managed-strategies, optimization, optimization-how-it-works, evaluations), What's New AgentCore
  optimization preview (Apr 30, 2026) and GA (Jun 17, 2026), AWS ML blog on AgentCore episodic memory
  (datePublished 2026-01-21), Neuron v2.33.0 rendered pages (about-pytorch-neuron, archive/nxd-training),
  OpenAI RFT guide.
- Papers: GEPA 2507.19457v2 (abs page comments "Accepted to ICLR 2026 (Oral)"; HTML Table 1 and Appendix
  E.4), DAPO 2503.14476v2 HTML (Sec 3.2), AlphaEvolve 2506.13131v1 HTML (Sec 3.3.1, Sec 6). Sclar, Snell,
  DeepSeek-R1 Table 16, Advisor Models Sec 4.4.3 and Reasoning with Sampling Sec 5.3 were taken from the
  committed owner checks (fc03, fc06, fc07) and the owner sections' current text.

## SideBySideLab.tsx (section 21)

About 70 load-bearing claims checked. CONFIRMED: 62. Non-confirmed: 8 rows (WRONG 2, OVERREACH 2,
UNSUPPORTED 1, prose rule 3).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 21-1 | "GEPA beat GRPO on the same model, Qwen3 8B, across six tasks" | SideBySideLab.tsx:841-842 | OVERREACH | https://arxiv.org/html/2507.19457v2 Table 1: GEPA 54.85 against GRPO 48.91 is the aggregate; GEPA leads on five tasks and trails on AIME-2025, 32.00 against 38.00 | "on a six-task aggregate, while GRPO kept the lead on AIME-2025" |
| 21-8 | 6.8% and 6.5% called the trainer's log-probability recompute alone (prose, SVG title, diagram label) | SideBySideLab.tsx:156, 271, 588-590 | OVERREACH (bucket wider than the label) | the share is `prepare_total - generate - score` from `run*/steps.jsonl` and `summary.json`, which holds the recompute forward pass and the advantage computation (E0-spark-smoke.md stage table: "trainer-side log-probabilities for the vLLM mismatch correction, advantages"); section 19 now words it that way (fc08) | prose: "The rest of the preparation took 6.8% and 6.5%: the trainer's extra forward pass ... together with the advantage computation"; SVG title and both bar labels "Other preparation: log-probability recompute and advantages"; harness re-run (below) |
| 21-2 | "NVIDIA's Unsloth playbook container pins trl==0.26.1 and datasets==4.3.0" | SideBySideLab.tsx:681-682 | WRONG (minor) | https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-unsloth/README.md#L121 is the playbook's install step, under "Inside the container:" | "NVIDIA's Unsloth playbook installs trl==0.26.1 and datasets==4.3.0 inside its container" |
| 21-3 | "Its script samples 2 answers per prompt" cited to train_image_vlm.py L164-L188 | SideBySideLab.tsx:852-860 | UNSUPPORTED by the cited lines | the script reads `num_generations=config["hyperparameters"]["num_generations"]` (L176); the value 2 is in https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/assets/ui_image/src/train.yaml#L9 and the UI default `image_vlm_config.yaml` | "Its shipped configuration samples 2 answers per prompt", new Tier 1 code cite train.yaml L9; the `use_vllm` clause keeps the script cite |
| 21-4 | "Each run took 180 s from start to exit ..., and 81 s with the compile cache warm" | SideBySideLab.tsx:718-719 | WRONG (wording) | `run1/start` 16:34:59 to `run1/mem.log` train_exit 16:37:59 = 180 s; `run2/start` 16:39:33 to 16:40:54 = 81 s: one figure per run, not both per run | "The first run took 180 s ..., and the second took 81 s ..." |
| 21-5 | LoRA used unexpanded in prose (E0 conditions) before its expansion in the E1 list | SideBySideLab.tsx:610 | prose rule (acronym) | CLAUDE.md Acronym Standard | expansion moved to the first prose use; the E1 list now says "LoRA" |
| 21-6 | "Section 7, RLVR & GRPO" is the section's only use of RLVR, unexpanded | SideBySideLab.tsx:638 | prose rule (acronym) | CLAUDE.md Acronym Standard | "(RLVR: RL with verifiable rewards)" added, as section 22 does |
| 21-7 | "rollout" used throughout E1 (intro, diagram, budget) and never defined | SideBySideLab.tsx:542 | prose rule (RL term) | authoring brief, "Define every RL term at first use in your section" | "one rollout budget (a rollout is one sampled attempt)" |

Confirmed, with evidence (summary):
- Every E0 figure matches the raw files. Recomputed: median step over steps 2 to 20 2.087 s and 2.110 s;
  step 1 3.02 s and 2.60 s; shares of summed step wall-clock (`steps.jsonl`) generation 62.04% / 62.87%,
  training 29.89% / 29.49%, other preparation 6.87% / 6.53%, weight sync 0.86% / 0.82%, scoring 0.03% /
  0.02%; four stages 99.66% / 99.72%; remainder (generate wrapper minus vLLM call minus sync) 0.31% / 0.25%.
  Run 1's other preparation is 6.84% from `summary.json` timer totals and 6.87% from per-step sums, so the
  page's 6.8% (also the cross-section block's) sits inside rounding of the logged timers; left as is. Medians
  generation 1.319 / 1.341 s, training 0.604 / 0.605 s, other preparation 0.136 s both, sync 0.017 s both.
  `logs.jsonl`: mean reward 0.04375 both runs; `frac_reward_zero_std` 1.0 with loss 0.0 and grad_norm 0.0 at
  steps 2, 3, 5, 7, 13, 15, 17, 18, 20 (run 1, 9 steps) and the same plus 16 (run 2, 10 steps); per-step
  log-probability difference mean of means 0.0114 both runs, max 0.920 and 1.137; importance-sampling ratio
  max 2.803 and 2.864. `summary.json` `torch_max_alloc_gib` 17.228 and 17.894; `mem.log` first sample
  53,359 / 53,346 MiB, `summary.json` `min_avail_mib` 29,665 / 28,874, drops 23,694 / 24,472 MiB (23.1 /
  23.9 GiB); `train_gpu_mib=0` throughout; no WATCHDOG line. `run2/train.log` L33 carries the
  "(49.35/121.69 GiB) ... (0.12, 14.6 GiB)" line. `meta.json` versions (trl 1.16.0, vllm 0.28.0, GB10) and
  config defaults; `pip-freeze.txt` trl, vllm, torch, transformers pins.
- The "other preparation" bucket is the preparation path minus generation and scoring. The trainer forward for
  `old_per_token_logps` sits in it only because vLLM generates with the correction on
  (`gradient_accumulation_steps % generate_every` is 0 at the E0 settings, `grpo_trainer.py#L2640-L2655`);
  the advantage computation sits in it too, which row 21-8 now states.
- train.py L37-L65 (task and grader), L165-L183 (GRPOConfig); run.sh L2 (setsid launch), L6 (HOME, TMPDIR,
  HF_HOME, pip cache in the run directory), L13 (nice -n 10, timeout 2h), L16-L32 (10 s sampling, 15,360 MiB
  threshold). TRL `pyproject.toml#L32` (`datasets>=4.7.0`), `grpo_config.py#L656-L657` (0.3),
  `#L925-L926` (True), `num_generations` default 8 (L480-L481); 0.3 x 121.69 = 36.5.
- GEPA Appendix E.4 "GRPO optimization run for 500 training steps, amounting to fixed 24,000 rollouts"; venue
  ICLR 2026 (arXiv comments). 24,000 / 16 x 2.1 s = 3,150 s.
- Playbook `train.yaml` (`model_id: unsloth/Qwen2.5-VL-7B-Instruct`, `rank: 32`, `use_lora: true`,
  `enable_grpo: true`), `from unsloth import FastVisionModel`, no `use_vllm` in the script; README L222 "about
  100 steps can take up to about 2 hours" (vendor claim, attributed). Doc-code note, not on the page: README
  L218 lists "Number of Generations: 4" for the UI default, while `image_vlm_config.yaml` and `train.yaml` set 2.
- Pointers: section 7 derives the silent share from `p^G + (1 - p)^G` (RlvrAndGrpo.tsx L1115-L1118); section 8
  has the model-family trust check and "What a frozen model can buy back"; section 10 owns the checklist;
  section 20 is the breakeven; section 22's three questions.

Score: **9/10**. Every E0 figure matches the raw logs and every external figure its pinned source after the
fixes; the strongest number (9 and 10 of 20 steps with no gradient at a 4% base rate) lands three times and the
section ends on section 22's questions. Not 10: the E1 diagram labels use GEPA and ACE before the list below it
expands them (diagram left untouched).

## Choosing.tsx (section 22)

About 55 load-bearing claims checked, including every number repeated from sections 7, 8, 14, 16, 18 and 20
and every pointer to sections 20 and 23. CONFIRMED: 52. Non-confirmed: 3 rows (OVERREACH 2, prose rule 1).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 22-1 | OpenAI: "eligible existing customers can create training jobs until January 6, 2027" | Choosing.tsx:598-600 | OVERREACH (hedge dropped) | https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning: "Eligible existing customers can create training jobs until January 6, 2027, unless the base model shuts down earlier." | ", unless the base model shuts down earlier" added |
| 22-2 | SFT or distillation path: "When the base scores near zero on your grader", cited to Bedrock's best practices | Choosing.tsx:701 | OVERREACH (threshold widened) | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html best practices: "If rewards are consistently 0 percent, use supervised fine-tuning first" | "When the base scores a consistent 0% on your grader" (Q2 and the ending already quote it this way) |
| 22-3 | "a full group of rollouts" with rollout never defined in the section | Choosing.tsx:543 | prose rule (RL term) | authoring brief, RL terms defined at first use | "a full group of rollouts (sampled answers)" |

Confirmed, with evidence (summary):
- E0 repeats (0.044, about 4%, 9 and 10 of 20, no gradient, 2 prompts x 8, TRL v1.16.0, vLLM 0.28.0, lr 1e-6,
  reward did not move): same raw-log check as section 21. "About half the steps" = 45% and 50%.
- Bedrock RFT page: GRPO on three base models; thresholds "consistently 0 percent" and "greater than 95
  percent". DAPO v2 Sec 3.2 both quotes verbatim. SageMaker MTRL hyperparameters quote verbatim. Bedrock
  APO page (LLM-as-a-judge rubric, Lambda, natural-language criteria); AgentCore optimization (system prompts
  and tool descriptions, target evaluator); AgentCore episodic strategy (reflections across episodes);
  SageMaker customisation overview (SFT, RFT, distillation "Transfer knowledge from a teacher model to a
  student model"); training sessions ("full control over your training loop without managing GPU
  infrastructure"); HyperPod recipes tree at 2.0.11.
- Numbers repeated from owners, identical to the owners' current text: 8.84x in the MATH-500 setting
  (section 8, fc03); GEPA 54.85 / 48.91 / 45.23, 1,839 to 7,051 against 24,000, AIME-2025 38.00 against 32.00
  (section 14 and GEPA Table 1, re-read today); about 70%, ours (section 16, fc06); 72.6 against 47.0, over
  10K RL steps, every benchmark (section 7 "more than 10,000 RL steps", fc03 and fc07); up to 76 points on
  LLaMA-2-13B, remained after instruction tuning (section 18, fc07).
- AlphaEvolve v1 Sec 3.3.1 quote verbatim (the paragraph gives the 0.7% recovery and no RL figures); Sec 6
  "natural next step ... distilling" and "main limitation ... automated evaluator" verbatim. Snell abstract
  quote (fc07). Venues: DAPO NeurIPS 2025, DeepSeek-R1 Nature 2025, Sclar ICLR 2024, Reasoning with Sampling
  ICLR 2026, GEPA ICLR 2026, Advisor Models ICML 2026, Snell and AlphaEvolve preprint.
- Pointers: section 17 covers prompt caching (WhereWordsFallShort.tsx L603-L607; the claims list pointed at
  section 18's file, corrected there); section 18 "specific, recent and auditable" (WeightsVsContext.tsx
  L835-L837); section 15 noise floor (YourLoops.tsx L710-L713); section 10 checklist, item 4 now "Monitors
  used for detection, kept out of the reward" after fc04, which section 22's wording matches; section 7's
  silent-share derivation.
- Sections 20 and 23 (written after section 22): section 20 takes rates, volume and a measured quality score
  per option, as section 22 says; section 23's path table carries the same six paths with the same service
  mapping and the same "our reading" marks (sampling, advisor, playbook distillation); both name Bedrock RFT
  with GRPO on three models and the HyperPod recipes at 2.0.11. No conflict found.

Score: **9/10**. Accurate at every source after two hedge restorations; the tree, three questions and six
paths give a usable mental model and the payoff (start with the grader) lands last. Not 10: the strongest
number lands five times (the leverage pass may trim), and the diagram uses RFT and SFT before question 2
expands them.

## RlOnAws.tsx (section 23)

About 75 load-bearing claims checked. CONFIRMED: 74. Non-confirmed: 1 row (OVERREACH 1).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 23-1 | h1 description "managed RL costs $80.00 per training hour" | RlOnAws.tsx:334 | OVERREACH (scope widened) | the $80.00 rate is Bedrock RFT's for its three models (https://aws.amazon.com/bedrock/pricing/ ; Price List SKU "$80.00 per hour for Nova2.0Lite-RFT-Training-Hours in US East (N. Virginia)"); SageMaker AI's serverless RFT is also "Fully managed" (customizing-models page) and is not priced on the page | "Bedrock's managed RL costs $80.00 per training hour" |

Confirmed, with evidence (summary):
- Bedrock: GRPO workflow sentence; Nova 2 Lite us-east-1, gpt-oss-20B and Qwen3 32B us-west-2; RLVR rule-based
  graders, RLAIF Model as Judge converted into a Lambda during training; open-weight page offers custom
  Lambda only, judges called inside the Lambda; "A minimum of 100 records" on both data pages; "The entire
  training workflow is billed at an hourly rate", $80.00 for gpt-oss-20b and Qwen3 32B under "Regions: US East
  (N. Virginia) and US West (Oregon)"; Nova 2 Lite $80.00 in the Price List; "up to 66% on average"; launch post
  Dec 3, 2025, "At launch, you can use reinforcement fine-tuning with Amazon Nova 2 Lite"; best-practices post
  (08 APR 2026): "LoRA adapters with a rank of 32", "EarlyStopping (enabled by default) ... when performance
  improvements plateau", Tier 2 and attributed; Bedrock distillation on custom-models.
- SageMaker AI: six techniques, LoRA and FFT, serverless with training session APIs, training jobs with
  instance choice and recipes, HyperPod with "advanced fault recovery"; open-weight table: Qwen3 0.6B supports
  RLVR and RLAIF (smallest listed), training sessions on gpt-oss-20b, gemma-4-31B-it, Qwen3.6-27B,
  Qwen3.8-27B; MTRL agent (policy model, tool calls, UpdateReward "for the complete rollout");
  `advantage_method` default `group_based`, nine values, `reinforce_pp` and `grpo_passk` unexpanded on the
  page, `loss_fn` three values default `ppo`; training sessions sample / forward_backward / optim_step, model
  stays loaded, distributed execution and gradient synchronisation; SDK `loss_fn` ppo, importance_sampling,
  cispo take `logprobs, advantages`.
- HyperPod recipes at 2.0.11: ppo_trainer.yaml L80-L81 `adv_estimator: gae`; Qwen3 32B recipe L1-L3 inherits
  `/hydra_config/verl-0_7_0/default` (which lists `ppo_trainer`), L33-L35 override with the quoted comment,
  L50-L51 `name: vllm`, L98-L102 `reward_manager: prime` and empty `lambda_arn`, no `n:` override; rollout.yaml
  L104-L105 `n: 8`; Nova 2 Lite RFT recipe L29-L34 `off_policy_async`, `age_tolerance: 2`. Re-tally: 149
  `verl-grpo-*.yaml` files, 68 set `adv_estimator: grpo` directly, the rest inherit
  `/hydra_config/verl/algorithm/grpo`; instance types p5.48xlarge 147, p4de 95, p4d 28, p5e 2, p5en 2; every
  file names a P4 or P5 type; one file (`deepseek/verl-grpo-rlvr-deepseek-r1-distilled-qwen-7b-fft.yaml`) sets
  `n: 16`; no path in the repository matches trn1, trn2, trn3, trainium or neuron. The page states the PPO
  trainer inheritance and 8 samples for the Qwen3 32B recipe only, which the tally supports.
- Neuron v2.33.0 (tag object = 10832bbc, "Neuron SDK Release 2.33.0"): `git grep -w` finds GRPO in 0 files and
  PPO in 0 files (the page keeps "in the documentation searched"); NxD Training "reached end-of-support as of
  Neuron 2.32"; TorchNeuron "in public beta for the Neuron 2.33 release", Trn2 and Trn3, and "TorchNeuron
  (torch-neuronx for PyTorch 2.14)", so TRL's `torch-neuronx` is that backend. TRL v1.16.0
  `docs/source/aws_trainium.md` L3, L53-L82 (Transformers generation, static cache), L82 (about 12 minutes per
  new size, about 25 s per step); `grpo_config.py` L1055-L1057 (128 on `neuron`).
- AgentCore: optimization (recommendations for system prompts and tool descriptions from traces and a target
  evaluator), how it works ("Route 100% of traffic to the winning variant ... next iteration"), evaluations
  (LLM-as-a-Judge), preview post (Apr 30, 2026: batch evaluations, A/B tests, "statistical significance
  reported", "Every recommendation requires your approval before it ships"), GA post (Jun 17, 2026), episodic
  strategy ("giving models a way to learn from history"; extraction, consolidation, reflection), default
  prompt "Start with Yes or No", overrides (instructions and model per step), self-managed batch APIs.
- Episodic blog (21 JAN 2026, vendor claim, attributed): Claude 3.7, tau2-bench retail and airline, four
  parallel attempts, Pass^k definitions; retail Pass^1 77.20% against 65.80%; airline Pass^3 43.00% (ICL) against
  41% (reflection) and 24% (no memory).

Score: **9/10**. Every AWS figure was read today at a first-party page or pinned code; vendor and blog figures
stay attributed and tiered; the one grader, two update targets reading lands three times and the ending names
what to bring. Not 10: the section is long and the self-managed block reads as a catalogue.

## Diagrams

Row 21-8 changed the E0 step-time diagram's two orange-segment labels and its SVG title. Harness:
`npx vite build --outDir /tmp/rl-dist-fc09` then `shoot.mjs --port 4609 --sections lab`: "lab @1440: 2 SVG
diagram(s), 0 React Flow, ok" and "lab @390: 2 SVG diagram(s), 0 React Flow, ok" (no overlap, no clip). Both
PNGs of the touched diagram read: at 1440 the longer label ends left of its leader line and clears the sync
label below it; at 390 the diagram scrolls (min-width 680), as before. Sections 22 and 23 diagrams untouched
and read in source: the tree's thresholds and the stack cells match the cited prose.

## Checks (run after the last edit)

- `pnpm --filter @tech-deep-dives/rl-agentic-loops typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/rl-agentic-loops lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- `pnpm --filter @tech-deep-dives/rl-agentic-loops test`: `Test Files  2 passed (2)`, `Tests  26 passed (26)`.
- `bash scripts/gates/no-ai-tells.sh`: `[PASS] no-ai-tells: no AI tells in 5 opted-in deep dive(s)`.
- `bash scripts/gates/pinned-refs.sh`: `[PASS] pinned-refs: all GitHub references pinned across 375 file(s) (5 src, 5 research)`.
- `bash scripts/gates/svg-a11y.sh`: `[PASS] svg-a11y: all inline <svg> accessible across 132 file(s) in 5 opted-in deep dive(s)`.
- `bash scripts/gates/pre-overflow.sh`: `[PASS] pre-overflow: every <pre> can scroll across 5 opted-in deep dive(s)`.

## Items for the orchestrator

0. fc08's settled venues (OpenRLHF EMNLP 2025 System Demonstrations, PipelineRL TMLR 2026, ProRL NeurIPS
   2025, HybridFlow Section 2.3) do not appear in sections 21 to 23; nothing to apply. Section 22 has no
   recompute wording to align.

1. `revamp/build-log.md` section 22 row says "E0 9/10 of 20 landed five times (leverage: maybe too many)":
   still five landings; left for the leverage pass.
2. Register note (F05-44 / wave2-systems-cost 05 U11): NVIDIA's vlm-finetuning README L218 lists "Number of
   Generations: 4" for the UI default, while `image_vlm_config.yaml` and `train.yaml` at c035e0ac set 2; the
   code governs and section 21 now cites train.yaml L9.
3. Register / wave2-foundations G3: the OpenAI sentence continues "unless the base model shuts down earlier";
   section 22 now carries it. Any other section that repeats the January 6, 2027 date should carry it too.
4. Diagram-label acronyms (not fixed, diagrams untouched): section 21's E1 diagram uses GEPA and ACE, and
   section 22's tree uses RFT and SFT, before the prose expands them. If the acronym standard is read as
   covering diagram labels, the fix is an expansion in the paragraph above each diagram.
