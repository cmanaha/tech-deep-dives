# Claims: section 19, An RL Step Is an Inference Job Inside a Training Job (`src/sections/RlStepAsSystem.tsx`)

Authored 2026-10-30. Re-opened on 2026-10-30: arXiv PDFs at the pinned version (`https://arxiv.org/pdf/<id>`, text via `pdftotext`) for 2409.19256v2, 2505.22312v2, 2505.24298v5, 2509.19128v2, 2501.12948v2, 2405.11143v6, 2402.14740v2, 2406.09279v2, 2402.03300v3; code at the pinned tags through raw.githubusercontent.com, each tag resolved with `git ls-remote` to the register SHA (TRL v1.16.0 = 1b5c75ed, verl v0.9.1 = 1876b06d, OpenRLHF v0.11.2 = 17fd4a79, slime v0.4.0 = 0b0c277d, prime-rl v0.10.0 = 9e15490d; TRL v1.12.0 for the PPO line); verl-recipe `dapo/README.md` at e7f88957; the verl W&B run `0qjd0wap` through W&B's anonymous public GraphQL API (metadata, config and the 489-row per-step timer history, summed locally). E0 figures checked against `research/2026-10/E0-spark-smoke.md` and the raw `run1/`, `run2/` files (`steps.jsonl`, `logs.jsonl`, `summary.json`, `meta.json`, `train.log`). Venues: HybridFlow EuroSys 2025 (PDF running header); AReaL NeurIPS 2025 (PDF footer); DeepSeek-R1 Nature 2025 (dive-wide); RLOO ACL 2024; Ivison et al. NeurIPS 2024; Skywork-OR1 and DeepSeekMath preprint; OpenRLHF EMNLP 2025 System Demonstrations (ACL Anthology 2025.emnlp-demos.48) and PipelineRL TMLR 2026 (jmlr.org/tmlr/papers), both corrected by fact check fc08. Format: `claim | source URL | register or wave 2 row`.

## h1 and intro
- h1 description: eight times the GPUs bought only a 45% cut in rollout time (strongest number, landing 1) | https://arxiv.org/abs/2505.22312v2 (Table 9) | F05-42; wave2-systems-cost rows 6, 7
- An RL step runs a batch inference job and a training job on one set of weights; new weights go back before the next batch (framing) | https://arxiv.org/abs/2409.19256v2 (Sec 2.1, 2.3) | F05-1, F05-3 (framing, scope section 19)
- "Rollouts" glossed in the intro as the attempts the batch inference job writes (RL term at first use; fc08) | - | authoring brief

## One step, four stages
- PPO step decomposes into three stages (generation, preparation, training) | https://arxiv.org/abs/2409.19256v2 (Sec 2.1) | F05-1; wave2 row 1
- A fourth stage (weight move from training to generation) when the two hold separate copies | https://arxiv.org/abs/2409.19256v2 (Sec 2.3 "RLHF Characteristics"; fc08 corrected the register's Sec 2.2) | F05-3; wave2 rows 1, 18
- Actor = the policy being trained, named for its role next to the critic | scope section 19 definition (review notes: "actor and decoupled (19)") | -
- Generation is memory-bound; training is compute-bound; one parallelism layout underuses GPUs in generation | https://arxiv.org/abs/2409.19256v2 (Sec 2.3) | F05-2
- Preparation: one forward pass per scoring model; reference log-probs, critic values, reward-model rewards | https://arxiv.org/abs/2409.19256v2 (Sec 2.1) | F05-1
- Actor and critic updated with Adam | https://arxiv.org/abs/2409.19256v2 (Sec 2.1) | F05-1
- TRL colocate sync: per-parameter `load_weights` into vLLM, then `reset_prefix_cache()` | https://github.com/huggingface/trl/blob/v1.16.0/trl/generation/vllm_generation.py#L481-L517 | F05-20 (lines re-checked: sync_weights L481-L517)
- PPO holds up to four models (generator, reference, critic, reward model) | https://arxiv.org/abs/2402.14740v2 (Sec 1); https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py#L489 | F01-32; wave2 row 2
- GRPO uses the average reward of a group of sampled outputs for the same question as the baseline, no value function | https://arxiv.org/abs/2402.03300v3 (Sec 4.1.1) | F01-24; wave2-foundations row 11 (section corrected to 4.1.1 on re-open)
- TRL GRPO `beta` default 0.0; reference model not loaded when beta is 0.0 | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L681-L688; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L982-L990 | F02-28 to F02-34 (dispatch cross-section condition); lines verified at the tag
- E0: available memory fell 23.1 and 23.9 GiB (23,694 and 24,472 MiB) at the lowest point | research/2026-10/E0-spark-smoke.md (Memory table) | U16 hedge; wave2 U9. NOTE: wave2-systems-cost and dispatch.md write "23.7 and 24.5 GiB/GB"; those are the MiB values divided by 1,000, not GiB
- E0: vLLM's share 14.6 GiB at fraction 0.12, KV cache 12.71 GiB, weights 0.93 GiB; "most of that is vLLM's pool" is our reading | E0 write-up and run2/train.log (`gpu_worker.py` lines) | wave2 U16 (our reading)
- No measured memory figure for PPO's four models located in the sources read | - | U16 accept-as-hedge (RESEARCH-GUIDE section 6)

## Generation holds most of the clock
- Skywork-OR1-32B, 1,000 steps: 309 h total, rollout 223 h (72.1%), policy update 8.7% | https://arxiv.org/abs/2505.22312v2 (Sec 5.1, Table 7) | F05-42; wave2 row 3
- GPU count for the 32B run not stated in the report | https://arxiv.org/abs/2505.22312v2 | wave2 G2; 05 U3 hedge
- 32-GPU ablation on DeepSeek-R1-Distill-Qwen-7B at 16K context: rollout 76% to 78% (76.3%, 76.3%, 77.6%) | https://arxiv.org/abs/2505.22312v2 (Table 8, Sec 4.1, Table 5) | F05-42; wave2 row 4 (SCOPE NARROWER applied)
- verl DAPO reproduction on Qwen2.5-32B: 489 steps, 159.6 h summed `timing_s/step`, generation 107.6 h = 67.4% (our sum), 16 nodes x 8 GPUs (config), H800 (recipe README row) | https://wandb.ai/verl-org/DAPO%20Reproduction%20on%20verl/runs/0qjd0wap ; https://github.com/verl-project/verl-recipe/blob/e7f889574b8301cc0f0fc1d57c6d67f31ffeb689/dapo/README.md#L45 | wave2 G1 (proposed F05-49); re-summed 2026-10-30, reproduces
- DAPO expansion "Decoupled Clip and Dynamic sAmpling Policy Optimization" | https://arxiv.org/abs/2503.14476v2 (abstract) | wave2-rlvr row 14, G6
- DAPO authors' own hours not located | https://dapo-sia.github.io/ (per wave2) | wave2 G1, 05 U2 hedge
- 13B PPO study on TPUv3: rollout more than 95% of training time, no breakdown | https://arxiv.org/abs/2406.09279v2 (App. G, App. K) | F01-53; wave2 row 5 (SCOPE NARROWER applied)
- E0: generation 62.0% and 62.9%, training 29.9% and 29.5%, median step 2.087 and 2.110 s, 16 completions | E0 write-up "Where the step time goes"; re-computed from run*/steps.jsonl and summary.json | wave2 table "Where section 19 should carry E0", row 1; U13
- Stage-by-stage breakdowns put generation at 62% to 78% in the sources read (the page words it as breakdowns, since Ivison et al. report more than 95% without one; fc08); no general figure located | E0; Skywork Table 8 | 05 U1 accept-as-hedge (wave2 U1 text)
- Preparation is one forward pass over prompts and responses; training forward and backward cover the same tokens, so training-side cost scales with rollout tokens | https://arxiv.org/abs/2409.19256v2 (Sec 2.1) | F05-1; scope section 19 purpose
- Longer responses raise every stage, generation most (one decode step per token vs one pass per response) | - | our reading, labelled on the page

### Expandable: what each published share counts
- HybridFlow's 58.9% counts generation and actor training together | https://arxiv.org/abs/2409.19256v2 (Sec 2.3) | F05-2; wave2 row 16
- OpenRLHF "often accounts for over 90%" with no measurement in the paper | https://arxiv.org/abs/2405.11143v6 (Sec 1) | F05-12; wave2 row 17
- RLHF and RLVR expansions | wave2-foundations U23 (RLHF); wave2-rlvr G6 (RLVR) | U23
- 140 GB per iteration for a 70B actor, up to 36.4% of an iteration on different devices, quoted from OpenRLHF 2023 (ref 30) | https://arxiv.org/abs/2409.19256v2 (Sec 2.3) | F05-3; wave2 row 18
- Skywork-OR1-32B's 1,000 steps are the released checkpoint's | https://arxiv.org/abs/2505.22312v2 (Sec 8.1, Table 12) | wave2 row 3, G2
- verl run: 273.8 h span (created 2025-04-16T12:42:27Z, last heartbeat 2025-04-27T22:28:23Z), 114 h outside the step timers | W&B run record (as above) | wave2 G1
- E0: most of the remainder (8.1% and 7.6%) is other preparation 6.8% and 6.5%, weight sync 0.9% and 0.8% | E0 write-up | dispatch cross-section E0 numbers

## The longest response sets the step
- "the generation step must wait until the finish of the longest output within a batch" | https://arxiv.org/abs/2505.24298v5 (Sec 1) | F05-6
- Varying output lengths of reasoning models leave inference devices underused until the longest finishes | https://arxiv.org/abs/2505.24298v5 (Sec 3.2) | F05-6
- As the LLM finishes shorter generations, fewer longer ones remain in progress | https://arxiv.org/abs/2509.19128v2 (Sec 3) | F05-36 (motivation figure only; the 2x is not used, so G3 needs no label)
- 1,024 responses: 375 s on 32 H800, 270 on 64, 225 on 128, 205 on 256 | https://arxiv.org/abs/2505.22312v2 (Sec 5.2, Table 9) | F05-42; wave2 row 6 (SCOPE NARROWER applied: "in Skywork's ablation setup")
- Table 9 names no model; 1,024 = 64 prompts x 16 samples, the 7B baseline (Table 5: DR 64, gs 16, T 16K) | https://arxiv.org/abs/2505.22312v2 (Table 5) | wave2 row 6 (our reading of the batch shape)
- Strongest number, landing 2: 8x the GPUs, 45% cut [(375 - 205) / 375 = 0.453] | as above | wave2 row 7 (arithmetic reproduces)
- Spreading generation over more devices shrinks the per-GPU decode batch into a memory-IO-bound regime where "additional devices fail to improve throughput" | https://arxiv.org/abs/2505.24298v5 (Sec 3.2) | F05-6
- 7B Qwen decode throughput on one H100 rises almost linearly up to a generation batch of 128 | https://arxiv.org/abs/2509.19128v2 (Sec 3) | F05-36
- Rollout time "primarily determined by the batch size and the time required to generate the longest response" | https://arxiv.org/abs/2505.22312v2 (Sec 5.2) | F05-42
- Skywork: with more resources, increase the rollout budget so rollout time stays roughly constant | https://arxiv.org/abs/2505.22312v2 (Sec 5.2) | F05-42 (beyond the register quote; same paragraph as Table 9)
- DeepSeek-R1: MTP for self-speculative decoding, "effectively minimizing the completion time for the longest samples" | https://arxiv.org/abs/2501.12948v2 (App. B.1) | F05-39; wave2 row 8

## Asynchronous designs pay for the tail in staleness
- Async: separate GPU sets run concurrently; rollouts sampled by a policy a few updates old (staleness) | https://arxiv.org/abs/2505.24298v5 (Sec 4.1); https://arxiv.org/abs/2505.07291v1 (Sec 3.2) | F05-7, F05-28 (framing, scope section 19)
- Diagram: no measured numbers; labelled "Illustrative, not measured"; staleness 0/1 and v1 to v3 are schematic | - | scope section 19 diagram
- AReaL eta = maximum permitted staleness; eta = 0 "degenerates to synchronous RL" | https://arxiv.org/abs/2505.24298v5 (Sec 5.1) | F05-8; wave2 row 9
- Decoupled PPO objective clips around a recent (proximal) policy rather than the stale behaviour policy | https://arxiv.org/abs/2505.24298v5 (Sec 5.2) | F05-9; wave2 row 9 (wording fix applied)
- AReaL 1.5B math, 16 nodes x 8 H800, 250 PPO steps: 14.8 h vs 41.0 (Sync.AReaL) vs 33.6 author-estimated (verl); AIME24 42.2 and 42.0 for the two AReaL modes | https://arxiv.org/abs/2505.24298v5 (Sec 7.1, Table 1) | F05-10; wave2 row 10 (verl's 43.1* is cited by AReaL from DeepScaleR, so not stated)
- AIME gloss: American Invitational Mathematics Examination | https://arxiv.org/abs/2505.22312v2 (Sec 8.1 benchmarks) | -
- PipelineRL: engine "only briefly pauses to receive the model weights", continues in-progress sequences | https://arxiv.org/abs/2509.19128v2 (Sec 1) | F05-35; wave2 row 11
- prime-rl `max_off_policy_steps` default 8; older episodes dropped in flight and queued | https://github.com/PrimeIntellect-ai/prime-rl/blob/v0.10.0/packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py#L542-L543 | F05-32; wave2 row 12
- Mental model: async exists to hide the straggler tail and the weight broadcast; staleness is the price; strongest number landing 3 | - | scope section 19 mental model (our reading, labelled)

## Even a synchronous run is slightly off-policy
- TRL recomputes old_per_token_logps whenever vLLM is used with the correction on; code comment on the mismatch | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2640-L2655 | F05-22; wave2 row 13 (page now says "with its mismatch correction on, the default"; fc08)
- E0: per-token log-prob difference averaged 0.011; max single token 0.92 and 1.14 | E0 write-up; logs.jsonl `sampling/sampling_logp_difference/*` (re-computed: mean of means 0.0114 and 0.0114) | wave2 row 13
- TRL default: correction True, mode `sequence_mask`, clip_max 3.0, clip_min None | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L925-L962 | F05-22; wave2 row 14 (wording fix applied)
- Sequence ratio = exp(sum of per-token diffs); outside bounds masked_fill 0.0; loss multiplied by the ratio | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2660-L2703 ; #L3146-L3147 | wave2 row 14
- Docstring list tags `token_truncate` "(default)" while the field default is `sequence_mask` (doc-code conflict inside the file) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L327-L331 ; #L934-L935 | F05-22 verdict note
- OpenRLHF `--algo.advantage.is_correction_level` default `off`; seq level = geometric mean; bounds [0.5, 5.0] | https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L256-L290 | F05-16; wave2 row 15 (wording fix applied: "of the same kind")
- E0: the correction's extra forward pass sits in "other preparation" (with the advantage computation), 6.8% and 6.5% of step time; the raw timers do not separate the two (fc08 narrowed) | E0 write-up; https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2642-L2655 | wave2 E0 table row 4
- E0: logged `sampling/importance_sampling_ratio/min` = 0.0 in 3 of 20 steps (run 1: steps 8, 9, 10) and 2 of 20 (run 2: steps 8, 16) | research/2026-10/E0-spark-smoke/run1/logs.jsonl, run2/logs.jsonl (verified by script 2026-10-30; not in the E0 write-up) | wave2 row 14 Tier 0 note
- Logged min is post-mask, so 0.0 means at least one sequence masked (logged max 2.80 and 2.86, below the 3.0 cap) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2874-L2890 | our reading of the code, labelled

## What to measure, and when to split the pools
- Generation share reference points 62.0%/62.9% (E0) and 67.4% to 78% (published 7B and 32B runs) | as above | F05-42, G1, E0
- Standalone placement: "models except the actor are idle" during generation | https://arxiv.org/abs/2409.19256v2 (Sec 2.4) | F05-5
- Staleness bound examples: AReaL eta; prime-rl default 8 | as above | F05-8, F05-32
- E0 weight sync 17 ms per step, 0.8% to 0.9% of step time, 0.5B in-process | E0 write-up; steps.jsonl median 0.017 s | wave2 E0 table row 2
- HybridFlow-quoted up to 36.4% for a 70B actor across devices | https://arxiv.org/abs/2409.19256v2 (Sec 2.3) | F05-3
- Sync cost grows with parameter count and device crossing | - | wave2 E0 table row 2 mental model (our reading, labelled)
- E0 tested colocated loading only; sleep and server mode not tested | E0 "What this run does not show" | 05 U10 hedge
- DGX Spark: vLLM 0.28.0 applied 0.12 to 121.69 GiB = 14.6 GiB; other services held about 70 GiB (121.69 GiB device memory minus 52.1 GiB MemAvailable in run1/mem.log; the write-up says GB; fc08); `torch.cuda.mem_get_info()` 11.9 GiB free vs `free` 52 GiB available | E0 write-up (Setup, Memory); run2/train.log | wave2 E0 table row 5; 05 U8 closed
- HybridFlow PPO on A100-80GB: colocate best 16 to 64 GPUs; split (actor and reference on one GPU set, critic and reward on another: NeMo-Aligner's placement) best at 96 for 13B and 96 to 128 for 34B; fixed batch over larger DP lowers computation-to-communication | https://arxiv.org/abs/2409.19256v2 (Sec 8.3 opening paragraph, Figure 12; testbed Sec 8.1) | F05-5; wave2 row 20 (split definition beyond the register quote)
- Closing guidance: on a single GPU colocation is the only placement (fc08 narrowed from "a single machine": OpenRLHF and slime default to separate GPUs per role on one node); start colocated; spend extra GPUs on a larger rollout budget; split, then async, as signals appear | Skywork Sec 5.2; HybridFlow Sec 8.3 | our reading, labelled

### Expandable: framework defaults at pinned tags
- Framework speed claims are each author's own at older versions; dive does not rank frameworks | - | 05 U5 accept-as-hedge
- TRL `use_vllm` False (falls back to `model.generate()`) | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L587-L593 | F05-18; wave2 row 19
- TRL `vllm_mode` "colocate", same process, shares training GPUs | grpo_config.py#L594-L603 | F05-18
- TRL `vllm_gpu_memory_utilization` 0.3 | grpo_config.py#L655-L663 | F05-19
- TRL `vllm_enable_sleep_mode` False | grpo_config.py#L612-L618 | F05-19
- verl `hybrid_engine: true`, required by all trainers except v1 `separate_async` | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/ppo_trainer.yaml#L55-L60 | F05-24; wave2 row 19
- verl rollout `gpu_memory_utilization: 0.5` (KV cache fraction) | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/rollout/rollout.yaml#L45-L46 | F05-25
- verl `free_cache_engine: True` | rollout.yaml#L60-L61 | F05-25
- verl rollout `tensor_model_parallel_size: 2` (assumes two GPUs per replica: our reading) | rollout.yaml#L63-L64 | F05-25
- OpenRLHF colocation flags all default False | https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L206-L228 | F05-14
- OpenRLHF 8 GPUs per node per role (ref, reward, actor, critic) | train_ppo_ray.py#L201-L216 | F05-14
- OpenRLHF `--vllm.gpu_memory_utilization` 0.95 (assumes vLLM owns its GPUs: wave2 reading, now labelled "on our reading" on the page) | train_ppo_ray.py#L250-L255 | wave2 row 19 addition (a)
- OpenRLHF `--vllm.sync_backend` "nccl" | train_ppo_ray.py#L240 | F05-14
- OpenRLHF vLLM sleep forced off unless `colocate_all` | train_ppo_ray.py#L707-L709 | F05-14
- slime `--colocate` default False; actor 8 GPUs per node; separate rollout GPUs | https://github.com/THUDM/slime/blob/v0.4.0/slime/utils/arguments.py#L40-L79 | F05-34
- slime under `--colocate`: offload defaults on when unset; explicit `--no-offload-train` kept; `--release-train` sets offload_train False and releases the trainer instead (L2117-L2126; fc08 corrected "kept unless --release-train") | arguments.py#L2115-L2130 | wave2 row 19 addition (b)
- slime `train.py` loop: generate, offload rollout, train, offload train, onload rollout weights, pause admission, update_weights | https://github.com/THUDM/slime/blob/v0.4.0/train.py#L47-L97 | F05-33 (lines re-checked: loop body L47-L97)
- slime `--use-tis` default off | arguments.py#L1165-L1174 | F05-34
- prime-rl separate `inference`, `trainer`, `orchestrator` executables and an `rl` launcher | https://github.com/PrimeIntellect-ai/prime-rl/blob/v0.10.0/pyproject.toml#L39-L47 | wave2 row 19 addition (c)
- prime-rl GPU extra requires `vllm>=0.31.0` on Linux | pyproject.toml#L58 | wave2 row 19 addition (c)
- prime-rl `max_off_policy_steps` 8 | orchestrator.py#L542-L543 | F05-32
