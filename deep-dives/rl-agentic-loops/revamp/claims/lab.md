# Claims: section 21, Side by Side on a DGX Spark (`src/sections/SideBySideLab.tsx`)

Authored 2026-10-30. Every E0 figure was re-derived from the raw files in `research/2026-10/E0-spark-smoke/` (`run1/`, `run2/`: `steps.jsonl`, `logs.jsonl`, `summary.json`, `meta.json`, `train.log`, `mem.log`) with a local script, and matched against `research/2026-10/E0-spark-smoke.md`. Shares of step time are of summed step wall-clock over all 20 steps (they match the write-up within 0.1 point of rounding; the write-up's figures are the ones shown); seconds are medians over steps 2 to 20. Re-opened at source on 2026-10-30: GEPA v2 HTML (Table 1; Appendix E.4 "Optimizers"; arXiv comments "Accepted to ICLR 2026 (Oral)"); NVIDIA/dgx-spark-playbooks at c035e0ac (playbook-vlm-finetuning README, train.yaml, train_image_vlm.py; playbook-unsloth README); TRL v1.16.0 (tag peels to 1b5c75ed) `pyproject.toml`, `grpo_config.py`, `grpo_trainer.py`. E0 links resolve at DIVE_REPO_SHA bcf5a9ed (all cited files present and unchanged since). Format: `claim | source URL | register or wave 2 row`.

## h1 and intro
- h1 description: about 2.1 s per step on a 0.5B model (strongest supporting figure) | research/2026-10/E0-spark-smoke.md (Where the step time goes: medians 2.087 s, 2.110 s) | Tier 0 E0; wave2-systems-cost U13
- h1 description and intro: base rate about 4% (mean reward 0.044 / 0.04375 both runs); 9 of 20 steps (run 1) and 10 of 20 (run 2) with every answer scoring zero and no gradient (strongest number, landing 1) | research/2026-10/E0-spark-smoke.md (Zero-advantage steps); run1/logs.jsonl, run2/logs.jsonl (`frac_reward_zero_std` = 1.0 at steps 2,3,5,7,13,15,17,18,20 and 2,3,5,7,13,15,16,17,18,20; loss 0.0 and grad_norm 0.0 there) | Tier 0 E0
- E1 not run in this build; presented as a protocol | RESEARCH-GUIDE.md section 5 (E1) and section 7 Gate 1 check 4 | -
- Sibling link: Silicon, Memory & Inference dive for the hardware | ../silicon-memory-inference/ | brief
- Sharpening = probability moving toward answers the model could already produce (definition, dive thesis) | SCOPE.md thesis | F02-40, F02-47 (definition only, not cited on this page)

## E0: where a GRPO step's time goes
- GRPO definition (group of answers per prompt, scored, raise answers above the group average) | https://arxiv.org/abs/2402.03300v3 (Sec 4.1.1) via section 7 / 19 definitions | F01-24 (definition, no Cite)
- Qwen2.5-0.5B-Instruct, 20 steps, twice; TRL 1.16.0 and vLLM 0.28.0 colocated on one GB10 | research/2026-10/E0-spark-smoke.md (Setup); run1/meta.json (versions, `gpu: NVIDIA GB10`) | Tier 0 E0
- 8 answers for each of 2 prompts per step, capped at 256 tokens | E0-spark-smoke/train.py L165-L183 (`per_device_train_batch_size=16`, `num_generations=8`, `max_completion_length=256`) | Tier 0 E0
- Task `(a + b) * c - d`, reward 1 for exact tagged integer else 0 | E0-spark-smoke/train.py L37-L65 | Tier 0 E0
- Both runs completed 20 of 20 steps | run1/summary.json, run2/summary.json (`global_step: 20`, `status: PASS`) | Tier 0 E0
- Median step 2.087 s and 2.110 s over steps 2 to 20; step 1 warm-up (3.02 s, 2.60 s) | run*/steps.jsonl (recomputed) ; E0-spark-smoke.md | Tier 0 E0
- Generation 62.0% / 62.9%; training 29.9% / 29.5%; other preparation (the log-prob recompute for the mismatch correction plus the advantage computation, `prepare_total - generate - score`) 6.8% / 6.5% (run 1 is 6.84% from summary.json timers, 6.87% from per-step sums; fc09 aligned the wording with section 19 per fc08); weight sync 0.9% / 0.8% of summed step time | E0-spark-smoke.md (stage table); recomputed from run*/steps.jsonl and summary.json timer totals | Tier 0 E0; wave2-systems-cost row S19 table
- Weight sync 17 ms per step (median 0.017 s both runs) | run*/steps.jsonl | Tier 0 E0
- Training = loss forward + backward + optimizer step (step wall-clock minus preparation path) | E0-spark-smoke.md (Stage timing) | Tier 0 E0
- TRL runs the extra trainer forward pass for `old_per_token_logps` whenever vLLM generates and the correction is on | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2640-L2655 | F05-22; wave2-systems-cost rows 13, S19 table
- Diagram 1 medians: generation 1.319 s / 1.341 s; training 0.604 s / 0.605 s; other preparation 0.136 s both (diagram label "Other preparation: log-probability recompute and advantages"); sync 0.017 s both | E0-spark-smoke.md (stage table); recomputed | Tier 0 E0
- Caption: four stages sum to 99.6% and 99.7%; remainder is scoring (under 0.1%) and time outside the timed calls | arithmetic on the table; scoring share from E0-spark-smoke.md; remainder = `generate` wrapper minus `vllm_generate` minus `weight_sync` (0.31% / 0.25%) plus score, our reading of the timers | Tier 0 E0
- Conditions: bf16 full fine-tuning, single seed, two runs | E0-spark-smoke.md (Model; Run command) | Tier 0 E0
- E0 shows mechanism not learning: 20 steps at lr 1e-6 from a 4% base rate; reward did not move and was not expected to | E0-spark-smoke.md (What this run does not show) | Tier 0 E0
- Not tested: larger model, outputs over 256 tokens, LoRA, vLLM sleep mode, server mode | E0-spark-smoke.md (What this run does not show) | wave2-systems-cost 05 U10

## What the logs show beyond the timing
- Mean reward 0.044 both runs | run*/logs.jsonl (mean 0.04375) | Tier 0 E0
- 9 / 10 of 20 steps: both groups all zero, `frac_reward_zero_std` 1.0, loss exactly 0.0 (strongest number, landing 2) | run1/logs.jsonl, run2/logs.jsonl | Tier 0 E0
- Advantage definition; zero advantage for every answer means no update | section 7 mechanism (DAPO loss with beta 0: per-token loss proportional to advantage) | definition
- Log-prob difference mean 0.011 per step (0.0114 both runs); max single token 0.92 and 1.14 | run*/logs.jsonl `sampling/sampling_logp_difference/{mean,max}`; E0-spark-smoke.md | Tier 0 E0; wave2-systems-cost row 13
- Importance-sampling ratio up to 2.80 and 2.86 | run*/logs.jsonl `sampling/importance_sampling_ratio/max` (2.803, 2.864) | Tier 0 E0
- TRL logs these as `sampling/sampling_logp_difference` and `sampling/importance_sampling_ratio` | run*/logs.jsonl keys | Tier 0 E0
- nvidia-smi per-process memory read zero; E0 used MemAvailable and PyTorch counters | E0-spark-smoke.md (Memory); run*/mem.log (`train_gpu_mib=0`) | Tier 0 E0; F05-48 context
- MemAvailable fell 23,694 MiB and 24,472 MiB (23.1 and 23.9 GiB) at the lowest point | E0-spark-smoke.md (Memory table: 53,359 - 29,665; 53,346 - 28,874) | Tier 0 E0. NOTE: wave2-systems-cost writes "23.7 and 24.5 GiB"; those are MiB / 1,000, not GiB
- `torch.cuda.max_memory_allocated` 17.23 and 17.89 GiB | run1/summary.json 17.228, run2/summary.json 17.894 | Tier 0 E0
- vLLM fraction applied to all 121.69 GiB: 0.12 -> 14.6 GiB | run2/train.log line 33 ("Free memory on device (49.35/121.69 GiB) on startup. Desired GPU memory utilization is (0.12, 14.6 GiB)") | Tier 0 E0; wave2-systems-cost 05 U8
- Size the fraction against what `free` reports | wave2-systems-cost 05 U8 wording proposal | practical (our reading)

## Reproduce E0
- Fresh venv from PyPI wheels; install resolved in about three minutes, no build from source | E0-spark-smoke.md (Software) | Tier 0 E0
- NVIDIA Unsloth playbook installs `trl==0.26.1` and `datasets==4.3.0` inside its container (README L121 is the install step "Inside the container:"; fc09 corrected "container pins") | https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-unsloth/README.md#L121 | F05-46
- TRL 1.16.0 requires `datasets>=4.7.0` | https://github.com/huggingface/trl/blob/v1.16.0/pyproject.toml#L32 | F05-46
- Environment pinned in pip-freeze.txt (trl 1.16.0, vllm 0.28.0, torch 2.13.0, transformers 5.22.1) | E0-spark-smoke/pip-freeze.txt | Tier 0 E0
- Install lines | E0-spark-smoke.md (Software, install block) | Tier 0 E0
- GRPOConfig values set | E0-spark-smoke/train.py L165-L183 | Tier 0 E0
- Defaults left in place: loss_type dapo, beta 0.0, epsilon 0.2, scale_rewards group, importance_sampling_level token, steps_per_generation 1, num_iterations 1, vllm_enable_sleep_mode False | run1/meta.json (config) | Tier 0 E0
- vllm_importance_sampling_correction default True | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L925-L926 | F05-22; wave2-systems-cost row 14
- TRL default `vllm_gpu_memory_utilization` 0.3 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L656-L657 | F05-19
- 0.3 x 121.69 = about 36.5 GiB on the Spark | our arithmetic on the two cited figures | derived
- E0 set 0.12 as a job ceiling | E0-spark-smoke.md (trainer table: "set (job ceiling)") | Tier 0 E0
- Start to exit: run 1 180 s (download and first compile), run 2 81 s (compile cache warm); run*/start to mem.log train_exit (fc09 corrected "each run took") | E0-spark-smoke.md (Pass condition table) | Tier 0 E0
- Shared host: other services held about 70 GB throughout | E0-spark-smoke.md (Hardware) | Tier 0 E0
- Preflight: at least 40 GiB required, 52 GiB found | E0-spark-smoke.md (Host safety record) | Tier 0 E0
- Everything in one run directory (venv, HOME, TMPDIR, HF_HOME, pip cache, logs); no sudo, no service touched | E0-spark-smoke.md (Host safety record); E0-spark-smoke/run.sh L6 | Tier 0 E0
- nice -n 10, timeout 2h, own session via setsid | E0-spark-smoke/run.sh L2, L13; E0-spark-smoke.md (Run command) | Tier 0 E0
- Watchdog samples MemAvailable every 10 s, stops own process group under 15 GiB; never fired | E0-spark-smoke/run.sh L16-L32; run*/mem.log (no WATCHDOG line) | Tier 0 E0
- Teardown: remove run directory, no process left, memory back | E0-spark-smoke.md (Host safety record) | Tier 0 E0

## E1 protocol (not run; every item is protocol, not result)
- Question, task with skill gap plus unstated rule, fresh synthetic items (Countdown-style), exact-match verifier in plain Python outside any agent's write path; without the second gap the chart favours RL by task type | RESEARCH-GUIDE.md section 5, E1 Task | review R3 finding 12
- Grader checked against section 10's checklist | brief; SCOPE.md review notes (section 10 owns the grader checklist) | -
- Base-rate check first; E0's 4% left 9 and 10 of 20 steps with no gradient (strongest number, landing 3) | E0 logs as above; RESEARCH-GUIDE.md E1 Metrics (fraction of zero-advantage groups) | Tier 0 E0; F02-22
- One small Qwen-family instruct model (0.5B to 1.5B) plus a non-Qwen control; results differ by family (pointer to section 8) | RESEARCH-GUIDE.md E1 Models | F02-53 (pointer only)
- Arms (a) to (e): base; GRPO with TRL 1.16.0 and LoRA, loss_type and beta stated, rollouts counted, frac_reward_zero_std and entropy logged; GEPA through DSPy 3.4.1, same model, reflection model recorded, larger local reflector labelled; playbook loop in the ACE pattern (delta updates, de-duplication); best-of-n with the verifier on the base model | RESEARCH-GUIDE.md E1 Arms and Metrics | F02-78, F02-58 (pointer only)
- ACE delta updates = model writes only new or changed entries, code merges them, duplicates pruned | section 13 (AccumulatingExperience.tsx design checklist, ACE Section 2.2) | F03 ACE rows (pointer)
- GEPA's GRPO baseline: 500 steps, fixed 24,000 rollouts | https://arxiv.org/abs/2507.19457v2 (Appendix E.4: "GRPO optimization run for 500 training steps, amounting to fixed 24,000 rollouts") | F03-61; wave2-words row 2
- 24,000 / 16 = 1,500 steps x 2.1 s = 3,150 s, about 53 minutes of step time, before scaling to longer outputs or a larger model | our arithmetic; E0-spark-smoke.md (Implications for E1) | derived
- GEPA beat GRPO on Qwen3 8B on the six-task aggregate, GRPO kept the lead on AIME-2025 | https://arxiv.org/abs/2507.19457v2 (Table 1: aggregate 54.85 vs 48.91; AIME-2025 32.00 vs 38.00; fc09 corrected "across six tasks") | F03-61; wave2-words row 1
- NVIDIA Spark playbook runs GRPO with LoRA on Qwen2.5-VL-7B-Instruct, rank 32, through Unsloth | https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/assets/ui_image/src/train.yaml (`model_id: unsloth/Qwen2.5-VL-7B-Instruct`, `rank: 32`, `use_lora: true`) | F05-44
- NVIDIA README: about 100 steps can take up to about 2 hours (vendor claim, attributed) | https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/README.md#L222 | F05-44
- Playbook's shipped configuration samples 2 answers per prompt (now cited at train.yaml L9; the UI default `image_vlm_config.yaml` also sets 2, while README L218 lists 4) and its script does not set `use_vllm` | train.yaml L9 (`num_generations: 2`); https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/assets/ui_image/src/train_image_vlm.py#L164-L188 (no use_vllm; grep of the file finds none) | F05-44; wave2-systems-cost 05 U11 (cut: no claim about Unsloth's generation path)
- Metrics: held-out test set of at least 500 problems; pass@1 and pass@k at k = 1, 4, 16, 64, 256; tokens per query incl. learned prompt or playbook; training wall-clock; rollouts used | RESEARCH-GUIDE.md E1 Budget and Metrics | -
- Diagram 2 labels (arms, budget R, measures) | RESEARCH-GUIDE.md E1 | protocol

## Predictions (protocol, each pointed at its section)
- GRPO beats both text loops at pass@1 on the skill part; on AIME-2025 GRPO beat a prompt optimiser on the same model (section 14) | RESEARCH-GUIDE.md E1 predictions | F03-62 (pointer)
- Base matches or beats GRPO at pass@256; on the models tested RL raised pass@1 while pass@k at large k held or fell (section 8) | RESEARCH-GUIDE.md E1 predictions; SCOPE thesis | F02-40, F02-47 (pointer)
- Text loops close more of the unstated-rule gap per rollout; a prompt optimiser beat GRPO on one 8B model with a fraction of its rollouts (section 14) | RESEARCH-GUIDE.md E1 predictions | F03-61 (pointer)
- Text loops learn the rule from the verifier's verdict; feed the verdict to the reflector (section 12) | section 12 h1 payoff ("give it a signal from outside the model") | F04-21 (pointer)
- Text loops cost more tokens per query than GRPO; learned context rides on every query (section 13) | RESEARCH-GUIDE.md E1 predictions | F03-35 (pointer)
- Best-of-n recovers part of GRPO's pass@1 gain at n times the inference cost (section 8) | RESEARCH-GUIDE.md E1 predictions | F02-78, F02-58 (pointer)

## Reading the results (ending)
- Verifier reports rule check and answer check separately (protocol design, our reading of the two-gap task) | - | our reading
- Rule-check gain = instruction-learning; GRPO pass@1 gain gone by pass@256 = sharpening; answer-check gain holding at pass@256 = least expected, check against the non-Qwen control | SCOPE thesis; section 8 trust check | our reading
- Per-query cost: text loops pay for learned context per query, best-of-n pays n samples, GRPO adds no prompt tokens but paid training wall-clock; section 20 turns these into breakeven volume | section 20 | our reading
- Optimiser's own capability bounds a text loop (section 14); 0.5B loops run with a 0.5B reflector unless recorded otherwise; GRPO vs text loops on the rule is the result most likely to move at 7B to 8B | section 14 (Revisiting OPRO; GEPA reflector = task model); RESEARCH-GUIDE E1 Models ("small-model result alone would understate the text loop") | F04-53, wave2-words G1 (pointer); our reading
- Re-measure the base rate on the larger model; E0's 4% left 9 and 10 of 20 steps with no gradient | E0 logs | Tier 0 E0
- Next action: take the readings to section 22's three decision questions | SCOPE section 22 | -

## Prose fixes (fc09, 2026-10-30)
- LoRA expanded at its first prose use (E0 conditions paragraph) instead of the E1 list | CLAUDE.md Acronym Standard | -
- RLVR expanded after the section 7 title, its only use in the section | CLAUDE.md Acronym Standard | -
- Rollout defined at first use ("a rollout is one sampled attempt") | authoring brief | -
