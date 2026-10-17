# 05 RL training as a system: research register

## 1. Header

- **Research date:** 2026-10-17. Every URL in this file was accessed 2026-10-17.
- **Area:** 05 of the "RL and agentic learning loops" dive. How an RL step runs as a distributed system: rollout generation (an inference workload), scoring (verifier, reward model or sandbox), training, and weight sync back to the inference engine. Step-time breakdowns, the long tail of response lengths, framework architectures (verl, OpenRLHF, TRL, asynchronous designs), cost of named runs, and feasibility of a small run on the reader's NVIDIA DGX Spark.
- **Out of scope here:** loss-function variants and algorithm debates (covered in 02, reused by ID where needed: F02-28 to F02-39 for TRL and verl code at pinned tags).
- **Reader:** ex-EC2/Compute tech lead, strong on systems, vLLM, GPUs and networking; no formal RL background.
- **Quote policy:** quotes are verbatim from the pinned version, with house-style normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text. Ellipses mark omissions.
- **Verdicts:** NEW (recorded fresh from the primary source); UNKNOWN (unresolved, see section 6); WRONG (a commonly repeated claim contradicted by the primary source, with the true statement).
- **Arithmetic:** any number not printed in a source is labelled [derived] with its inputs.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-char SHA; official framework docs; first-party vendor docs (NVIDIA, AWS) |
| Tier 2 | First-party lab or vendor blog posts and talks |
| Tier 3 | Academic papers ("peer-reviewed (venue)" only where the venue was confirmed; otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials, summaries, press. Used only to locate primary sources |

Code over docs over blogs. Vendor and author performance numbers are claims, not measurements.

**Evidence kinds:** definition, documentation of support, benchmark claim (author or vendor reported), ablation, production report, code behaviour.

### Pinned sources

(filled in as sources are read)

---

## 2. Claim register

### A. The RL step as a system: where time goes

**F05-1. One RLHF (PPO) iteration decomposes into three stages: generation (the actor decodes responses), preparation (critic values, reference log-probs and rewards, each a single forward pass), and training (actor and critic updated with Adam).**
- Location: 2409.19256v2 (HybridFlow), Sec 2.1, Figure 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25, per the PDF running header) | definition | "The RLHF workflow can be decomposed into 3 stages (Figure 1) and we take PPO as an example: Stage 1 (Generation): The actor produces responses from a batch of prompts using auto-regressive generation. Stage 2 (Preparation): Using prompts and generated responses, the critic computes their values ..., the reference policy computes their reference log probabilities, and the reward model computes their rewards ..., all via a single pass of forward computation of the respective model. Stage 3 (Learning/Training): The actor and the critic are updated via Adam" (accessed 2026-10-17)
- Use in dive: the anchor diagram for the systems section. For GRPO the critic drops out (F02-1), but the three-stage shape stays; a fourth step, weight sync, appears when generation and training run on different engines (F05-4).

**F05-2. Actor training plus actor generation is "the majority" of an RLHF iteration, with HybridFlow's own run as the example at 58.9% of total time. The figure covers both stages together; it is not a generation-only share.**
- Location: 2409.19256v2, Sec 2.2 "Unbalanced computation between actor training and generation".
- Verdict: NEW. Watch for misquotes: the 58.9% is training plus generation of the actor, not rollout alone.
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25) | benchmark claim (author reported) | "In the RLHF dataflow, training and generation of the actor model are represented by two nodes (Figure 1), which often render majority of the workload in each RLHF iteration (e.g., 58.9% of total RLHF time with HybridFlow). Actor training is computation bound [24] ... Using the same parallelism strategy (e.g., the same MP size) for generation can lead to underutilization of GPU computation resources due to its memory-bound nature [40]." (accessed 2026-10-17)
- Use in dive: mental model that training is compute-bound and generation is memory-bound, so one parallelism layout cannot suit both. Practical caution for anyone quoting a "rollout is X% of time" number.

**F05-3. Moving the actor's weights from training to generation is itself a cost: for a 70B actor, 140 GB per iteration, taking up to 36.4% of an iteration when the two stages sit on different devices.**
- Location: 2409.19256v2, Sec 2.2, citing OpenRLHF ([30] in the paper).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25) | benchmark claim (author reported, about a third-party system) | "aligning a 70B actor model requires transferring 140GB of model weights from training to generation per RLHF iteration, taking up to 36.4% of an iteration time when the two stages are on different devices [30]." Reference [30] is "OpenRLHF: A Ray-based High-performance RLHF framework" (2023). (accessed 2026-10-17)
- Use in dive: weight sync is the fourth stage of the step. A systems reader will recognise it as a bulk transfer whose cost scales with parameter count, not with batch size.

**F05-4. HybridFlow's 3D-HybridEngine reshards the actor between its training layout (for example TP=4, DP=2) and a generation layout with smaller model parallelism and more replicas, using all-gathers within "micro DP groups". It cut training-to-generation transition time by 55.2% (11.7 s) on average and by up to 89.1% (78.2 s) at 70B against baselines.**
- Location: 2409.19256v2, Sec 5.2 to 5.4 (Figure 8, Table 2), Sec 8.4 (Figure 14).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25) | benchmark claim (author reported) | "During the transition from training to generation, 3D-HybridEngine applies all-gather operations among the model parallel groups to aggregate all parameters, and then retain only a subset of model weights on each device for its generation". "HybridFlow reduces the transition time by 55.2% (11.7s) on average and the transition overhead by up to 89.1% (78.2s) with 70B models". Testbed: "a cluster of 16 machines (128 GPUs). Each machine is equipped with 8 NVIDIA A100-80GB GPUs inter-connected with 600GB/s NVLink." (accessed 2026-10-17)
- Use in dive: what "colocated with resharding" means mechanically. Practical for anyone sizing verl: TP for training and TP for rollout are separate knobs.

**F05-5. The best placement depends on cluster size. Colocating all models on the same GPUs won from 16 to 64 GPUs; split or standalone placement won at 96 to 128 GPUs, because a fixed batch spread over more data-parallel replicas lowers the compute-to-communication ratio. In standalone placement the other models sit idle during generation.**
- Location: 2409.19256v2, Sec 8.3 (Figures 12 and 13); Sec 2.4 on OpenRLHF and NeMo-Aligner.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25) | ablation | "From 16 to 64 GPUs, colocating all models on the same set of devices yields the best performance. For 96 to 128 GPUs with 34B models and 96 GPUs with 13B models, the split strategy becomes optimal. ... In larger clusters, RLHF throughput under colocate placement fails to scale up linearly as the batch size is fixed and the computation-to-communication ratio decreases with a larger DP size on more GPUs." On standalone systems: "in the generation stage, models except the actor are idle, wasting the GPUs they occupy." (accessed 2026-10-17)
- Use in dive: placement is a cluster-size decision, not a framework preference. For the reader's single-device case colocation is the only option.

**F05-6. A synchronous RL step waits for the longest response in the batch. AReaL names two consequences: inference GPUs idle while stragglers finish, and spreading generation over more GPUs shrinks the per-GPU decode batch until decode is memory-IO bound and extra GPUs stop helping.**
- Location: 2505.24298v5 (AReaL), Sec 1 and Sec 3.2, Figure 1 (left).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025, per the PDF footer "39th Conference on Neural Information Processing Systems (NeurIPS 2025)") | definition plus benchmark claim | "In such a synchronous design, the generation step must wait until the finish of the longest output within a batch. Due to the varying output lengths for LRMs, a synchronous RL system suffers from severe training inefficiency." "Synchronous systems distribute generation across all devices, reducing the per-GPU decoding batch size. This pushes the decoding process into a memory-IO-bound regime [4, 28] where additional devices fail to improve throughput." (accessed 2026-10-17)
- Use in dive: the long-tail mental model. A vLLM expert already knows the second half (small decode batches are bandwidth-bound); the RL-specific part is the barrier at the end of each step.

**F05-7. AReaL fully decouples generation and training onto separate GPU sets. Rollout workers accept an `update_weights` request mid-generation: they interrupt decoding, discard KV caches computed under old weights, recompute them with the new weights and continue, so one trajectory can contain segments from several policy versions.**
- Location: 2505.24298v5, Sec 4.1, Figures 2 and 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025) | definition (system design) | "The update_weights request interrupts all ongoing generations and loads parameters of new versions. Upon the interruption, the rollout workers discard KV caches computed by old weights, and re-compute them using the new weights. Afterwards, the rollout workers continue to decode the unfinished sequences ... such interruptions and in-flight weight updates would result in trajectories composed of segments produced by different model versions." "Trainer Workers continuously sample from the replay buffer ... To ensure data freshness, data from the replay buffer is used only once." (accessed 2026-10-17)
- Use in dive: "in-flight weight update" defined concretely. Mental model: async RL turns the step barrier into a producer-consumer queue.

**F05-8. AReaL bounds staleness with one parameter, eta: the rollout controller rejects new generation requests unless floor((Nr - 1)/B) <= i + eta, where Nr is trajectories generated, B the batch size and i the current policy version. eta = 0 is synchronous RL. Defaults in the paper: eta = 4 for coding, eta = 8 for math.**
- Location: 2505.24298v5, Sec 5.1, Eq. 3; Sec 7.1 (settings).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "we introduce a hyperparameter η representing the maximum permitted staleness in each training batch ... when η = 0, our system degenerates to synchronous RL with all training samples generated by the current policy." "⌊(Nr − 1)/B⌋ ≤ i + η." "when η is too small, the generation throughput can be slowed down when some extremely long trajectories are being generated." "Unless otherwise specified, we set the maximum staleness η = 4 for coding and η = 8 for math". (accessed 2026-10-17)
- Use in dive: staleness is admission control, a rate limiter on the producer side. Practical: the knob trades throughput for on-policy fidelity.

**F05-9. AReaL corrects for stale and mixed-version data with a "decoupled PPO objective" that separates the behaviour policy (which sampled the tokens) from a proximal policy (a recent target that sets the clipping centre), with importance weights between them. Without it, even slight staleness hurt final accuracy; with it, eta <= 8 had minimal impact; unbounded staleness was still worse than the on-policy oracle.**
- Location: 2505.24298v5, Sec 5.2 (Eq. 5), Sec 7.4 (Figure 5, Table 2).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025) | ablation (1.5B model, math) | "We apply a decoupled PPO objective [10] that disentangles the behavior policy and the proximal policy." "Even slight staleness can significantly degrade final performance due to the improper clipping center and policy changes during interruptible generation." "with the decoupled objective, unbounded staleness (maximum staleness → ∞) still results in inferior performance compared to the zero-staleness oracle. When properly constrained, moderate staleness (e.g., η ≤ 8) has minimal impact on final performance while significantly accelerating training". (accessed 2026-10-17)
- Use in dive: async is a systems change that forces an algorithm change. Mental model: staleness needs both a bound (F05-8) and a correction (this entry).

**F05-10. AReaL's end-to-end result against synchronous verl: same steps and nodes, about half to a third of the wall-clock hours. 1.5B math on 16 nodes for 250 PPO steps: verl 33.6 h, synchronous AReaL 41.0 h, AReaL 14.8 h (AIME24 43.1*, 42.0, 42.2). 14B code on 32 nodes for 80 steps: verl 44.4 h, AReaL 21.9 h. Hardware: H800 nodes of 8 GPUs.**
- Location: 2505.24298v5, Sec 7.1 (setup) and Table 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025) | benchmark claim (author reported; verl hours were "estimated" by the authors) | Table 1 rows "w/ VeRL 43.1* 16 250 33.6", "w/ Sync.AReaL 42.0 16 250 41.0", "w/ AReaL (ours) 42.2 16 250 14.8"; 14B: "w/ VeRL 57.9* 32 80 44.4", "w/ AReaL (ours) 58.1 32 80 21.9". "We conduct experiments on an H800 GPU cluster comprising 64 nodes, each equipped with 8 GPUs." "we measure the throughput and estimate the training hours using the latest verl code for a fair comparison ... the end-to-end training time can be reduced by 2.77× compared with synchronous systems." (accessed 2026-10-17)
- Use in dive: the headline number for "why async". [derived] 1.5B run = 16 nodes x 8 GPUs = 128 H800 GPUs x 14.8 h = about 1,894 GPU-hours for AReaL, about 4,301 for verl (inputs: Table 1 nodes and hours, 8 GPUs per node from Sec 7.1).

**F05-11. Interruptible generation alone raised generation throughput by 12% (1.5B) and 17% (7B) on 4 nodes; dynamic batching for variable-length outputs added about 30% training throughput on average.**
- Location: 2505.24298v5, Sec 7.5, Figure 6a and 6b.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.24298v5 | Tier 3, peer-reviewed (NeurIPS 2025) | ablation | "Without interruptible generation, the controller must wait for the longest response. In particular, interruptible generation leads to a 12% and 17% throughput increase for 1.5B and 7B models respectively on 4 nodes". "dynamic batching yields an average of 30% throughput improvements across various model sizes." (accessed 2026-10-17)
- Use in dive: sizes the long-tail effect in isolation, smaller than the 2.77x headline that comes from full decoupling.

### B. verl (HybridFlow)

verl is the open-source implementation of HybridFlow. Algorithm defaults (advantage estimators, loss modes, agent-loop masking) are in F02-35 to F02-39 at the same pin `v0.9.1` = `1876b06d0a3e4e71e06230be10af14492ca8a75b`.

**F05-23. HybridFlow's "hybrid controller": one single controller coordinates the few models of the RL dataflow and the data moving between them, while each model runs its own distributed computation in multi-controller (SPMD) style. The argument is that the RL dataflow graph has only a few nodes, so central dispatch costs little next to the model computation it schedules.**
- Location: 2409.19256v2, Sec 1 and Sec 2.5, Figure 2(b).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2409.19256v2 | Tier 3, peer-reviewed (EuroSys '25) | definition (design rationale) | "The RLHF dataflow graph typically consists of only a few nodes. Dispatching control messages to different nodes from the single-controller incurs negligible overhead as compared to distributed computation required for nodes (models) in the dataflow. The multi-controller paradigm, known for its low latency in dispatching operators to accelerators [20], can be leveraged in distributed computation of each model. ... Our key design principle is to combine single-controller and multi-controller paradigms in a hybrid manner." (accessed 2026-10-17)
- Use in dive: mental model a systems lead will recognise: a control plane (one Python driver) over data-plane workers (SPMD groups). It is the reason the verl driver script reads like a sequential RL loop.

**F05-24. In verl the colocated "hybrid engine" is the default and, for every trainer except the v1 `separate_async` trainer, mandatory: `actor_rollout_ref.hybrid_engine: true`. The training backend is chosen per actor config: `fsdp` (dp_actor), `megatron`, `veomni` or `torchtitan`. Rollout backends are `hf`, `vllm`, `sglang` and `trtllm`, with rollout `mode: async` (AsyncLLM) by default.**
- Location: `verl/trainer/config/ppo_trainer.yaml:55-60`; `verl/trainer/config/actor/dp_actor.yaml:26`, `megatron_actor.yaml:16`, `veomni_actor.yaml:16`, `torchtitan_actor.yaml:16`; `verl/trainer/config/rollout/rollout.yaml:4-8` at `v0.9.1`.
- Verdict: NEW
- Evidence: https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/ppo_trainer.yaml#L55-L60 | Tier 1 | code behaviour | `# Whether actor and rollout colocate on the same GPUs (hybrid engine).` / `# Set to False only with the v1 separate_async trainer ...` / `# All other trainers require True.` / `hybrid_engine: true`. rollout.yaml: `# actor_rollout_ref.rollout.name: hf/vllm/sglang/trtllm.` / `name: ???` / `# sync: LLM, async: AsyncLLM` / `mode: async`. (accessed 2026-10-17)
- Use in dive: practical. verl's default is the colocated design that HybridFlow found best below 64 GPUs (F05-5).

**F05-25. verl rollout defaults that shape memory: `gpu_memory_utilization: 0.5` (fraction of GPU memory for the inference engine's KV cache), `free_cache_engine: True` (free the KV cache after generation so training can use the memory), `tensor_model_parallel_size: 2` for rollout, `load_format: dummy` (rollout starts with placeholder weights that the first sync overwrites), and `logprobs_mode: processed_logprobs`.**
- Location: `verl/trainer/config/rollout/rollout.yaml:45-46`, `:60-61`, `:63-64`, `:93`, `:100` at `v0.9.1`.
- Verdict: NEW
- Evidence: https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/rollout/rollout.yaml#L45-L64 | Tier 1 | code behaviour | `# Fraction of GPU memory used by vLLM/SGLang/TRTLLM for KV cache.` / `gpu_memory_utilization: 0.5`; `# Whether to free engine KVCache after generation.` / `free_cache_engine: True`; `# TP size for rollout. Not effective for hf` / `tensor_model_parallel_size: 2`; `load_format: dummy`. (accessed 2026-10-17)
- Use in dive: practical. On one GPU, rollout TP must be set to 1; verl's default of 2 assumes a multi-GPU node. Compare TRL's 0.3 default (F05-19).

**F05-26. verl separates weight sync into a pluggable "checkpoint engine" that moves weights from the trainer (FSDP, Megatron, VeOmni, TorchTitan) to the rollout server. Backends at the pin: colocated (CUDA IPC on the same GPU), NCCL, NIXL, Mooncake, HCCL, Kimi, and a delta engine that can send sparse patches instead of full tensors.**
- Location: `verl/checkpoint_engine/base.py:116-136` (abstraction), `:247-262` (colocated); directory listing `verl/checkpoint_engine/` at `v0.9.1`.
- Verdict: NEW
- Evidence: https://github.com/volcengine/verl/blob/v0.9.1/verl/checkpoint_engine/base.py#L116-L136 | Tier 1 | code behaviour | `"""CheckpointEngine is an abstraction to transfer weights from actor to rollout.` / `>>> actor = EngineRegistry.new(...) # FSDP, Megatron, VeOmni, TorchTitan, ...` / `>>> engine = CheckpointEngine.new(...) # NCCLCheckpointEngine, NIXLCheckpointEngine, ...` / `>>> await server_adapter.update_weights(engine.get_weights()) # update weights via cuda ipc`; `"delta_flush" -- (named_tensors, is_last) flushes; the seed may be dense, while steady updates carry sparse patches.`; `class ColocatedCheckpointEngine(CheckpointEngine): """Checkpoint engine for actor and rollout colocated on same GPU.`. Files: `nccl_checkpoint_engine.py`, `nixl_checkpoint_engine.py`, `mooncake_checkpoint_engine.py`, `hccl_checkpoint_engine.py`, `kimi_checkpoint_engine.py`, `delta_checkpoint_engine.py`. (accessed 2026-10-17)
- Use in dive: weight sync has become a transport problem with the same backends as KV-cache transfer in disaggregated inference (NIXL, Mooncake). Strong hook for a networking reader. Delta sync pairs with F02-84 (RL updates are sparse).

**F05-27. verl ships two off-policy modes in `verl/experimental`: `one_step_off_policy` and `fully_async_policy`. The fully async mode has a separate rollouter and trainer joined by a message queue, syncs parameters every `trigger_parameter_sync_step: 4` trainer steps, uses `partial_rollout: True` (generation interrupted for sync then resumed, invisible to the agent loop), requires `use_rollout_log_probs: True`, and bounds staleness with `staleness_threshold: 0.1`, which caps queued samples at required_samples x (staleness_threshold + 1) x trigger_parameter_sync_step.**
- Location: `verl/experimental/fully_async_policy/config/fully_async_ppo_trainer.yaml:9-23`, `:85-87`; formula `verl/experimental/fully_async_policy/fully_async_rollouter.py:490-496` at `v0.9.1`.
- Verdict: NEW. verl's staleness knob is a fraction of a sync window, a different unit from AReaL's eta in policy versions (F05-8).
- Evidence: https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/fully_async_policy/config/fully_async_ppo_trainer.yaml#L9-L23 | Tier 1 | code behaviour | `# Maximum samples staleness threshold` / `staleness_threshold: 0.1`; `trigger_parameter_sync_step: 4`; `# If True, LLMServerClient auto resume generation, making rollout interruption invisible to the AgentLoop.` / `partial_rollout: True`; `# Must use rollout log probs for training` / `use_rollout_log_probs: True`. Rollouter: `self.max_required_samples = int(self.required_samples * (self.staleness_threshold + 1) * self.config.async_training.trigger_parameter_sync_step)`. (accessed 2026-10-17)
- Use in dive: comparison table row for verl async. "Async" in verl means bounded queue plus in-flight interruption, the AReaL pattern.

### C. OpenRLHF

**F05-12. OpenRLHF's paper states that inference "often accounts for over 90%" of RLHF or RLVR runtime. The sentence carries no citation and no measurement in the paper; it is an author assertion. It conflicts in kind with HybridFlow's measured 58.9% for actor training plus generation combined (F05-2).**
- Location: 2405.11143v6 (OpenRLHF), Sec 1, paragraph 1.
- Verdict: UNKNOWN as a general figure (see U1). The share is workload-dependent: it rises with response length and falls as the training share grows.
- Evidence: https://arxiv.org/abs/2405.11143v6 | Tier 3, preprint | benchmark claim (author assertion, no supporting table) | "the inference phase often accounts for over 90% of the total RLHF (or RLVR) runtime, as models need to generate thousands of tokens during each inference step." (accessed 2026-10-17)
- Use in dive: show the two numbers side by side as a range, with conditions. Do not quote "90%" as a measurement.

**F05-13. OpenRLHF assigns GPUs to roles with Ray: vLLM rollout engines generate, and DeepSpeed ZeRO engines compute log-probs, reference log-probs and train actor and critic. Weights move from the DeepSpeed actor to vLLM after each update.**
- Location: 2405.11143v6, Sec 3.1, Figure 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2405.11143v6 | Tier 3, preprint | definition | "it defines two primary roles: the rollout engine, responsible for response generation to given prompts, and the ZeRO engine, which computes logprobs, reference policy logprobs, and handles model training". "The exchange of model weights between the rollout engine and the training engine is enabled by a flexible slicing and partitioning pipeline." (accessed 2026-10-17)
- Use in dive: the "separate roles" design. Contrast with verl's single-controller hybrid engine (F05-4).

**F05-14. In OpenRLHF code, placement is a set of flags, all off by default: `--train.colocate_actor_ref`, `--train.colocate_critic_reward` and `--train.colocate_all` ("including vLLM engines"). `--vllm.enable_sleep` (offload vLLM while training) only applies under `colocate_all`. Default role sizing is 8 GPUs per node each for actor, critic, reference and reward. Weight sync defaults to NCCL.**
- Location: `openrlhf/cli/train_ppo_ray.py:198-246`, `:707-709` at `v0.11.2` = `17fd4a79cc87dfb2f6185ffac634066525bcd917`.
- Verdict: NEW
- Evidence: https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L198-L246 | Tier 1 | code behaviour | `"--train.colocate_all", action="store_true", default=False, help="whether to colocate all models (including vLLM engines), if true, they will share same gpus."`; `parser.add_argument("--vllm.sync_backend", type=str, default="nccl", help="DeepSpeed -> vLLM weight sync backend")`; `"--actor.num_gpus_per_node", type=int, default=8`; `if args.vllm.enable_sleep and not args.train.colocate_all: ... args.vllm.enable_sleep = False`. (accessed 2026-10-17)
- Use in dive: practical. Out of the box OpenRLHF is "standalone" (one GPU set per role, F05-5); colocation is opt-in.

**F05-15. OpenRLHF async mode is a bounded queue between sampler and trainer (`--train.async_queue_size`, default 1). `--train.partial_rollout_enable` adds vLLM pause/resume for weight sync so generation overlaps training, and the help text states in-flight samples "may contain tokens from both old and new weights". Async cannot combine with vLLM sleep mode.**
- Location: `openrlhf/cli/train_ppo_ray.py:293-302`, `:711-718` at `v0.11.2`.
- Verdict: NEW
- Evidence: https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L293-L302 | Tier 1 | code behaviour | `parser.add_argument("--train.async_queue_size", type=int, default=1, help="Queue size for async sampler<->trainer")`; `help="Enable partial rollout in async mode. Uses vLLM pause/resume for weight sync instead of locking, allowing generation to overlap with training. In-flight samples may contain tokens from both old and new weights."`; `assert not args.vllm.enable_sleep, "Async RLHF is not supported with --vllm.enable_sleep."` (accessed 2026-10-17)
- Use in dive: "async" in OpenRLHF means one-step-ahead generation with a queue of 1 by default; partial rollout is the AReaL-style in-flight update (F05-7).

**F05-16. Even "on-policy" RL is slightly off-policy in practice, because the rollout engine (vLLM) and the trainer compute different token probabilities for the same weights. OpenRLHF exposes an importance-sampling correction for this train/rollout mismatch (`--algo.advantage.is_correction_level`, default `off`, with token or sequence granularity, mask or clip, default bounds [0.5, 5.0]).**
- Location: `openrlhf/cli/train_ppo_ray.py:255-290` at `v0.11.2`.
- Verdict: NEW. The flag and defaults are code; the claim that the mismatch matters comes from a third-party post linked in a code comment (Tier 2, not read in this pass, U6).
- Evidence: https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py#L255-L290 | Tier 1 | code behaviour | `# Train/rollout (DeepSpeed-actor vs vLLM) logprob-mismatch importance-sampling correction.` / `# Your Efficient RL Framework Secretly Brings You Off-Policy RL Training: https://fengyao.notion.site/off-policy-rl`; `"--algo.advantage.is_correction_level", type=str, default="off", choices=["off", "token", "seq"]`; `"--algo.advantage.is_correction_threshold", ... default=[0.5, 5.0]`. (accessed 2026-10-17)
- Use in dive: mental model for an inference engineer: kernel and precision differences between serving and training stacks become an algorithm issue in RL. Links to F02 on MoE routing and logprob mismatch.

**F05-17. OpenRLHF's own benchmark against verl (8 H200 GPUs, DAPO, DeepSeek-distilled Qwen 1.5B to 14B, 1K to 8K generation) reports 1.22x to 1.68x lower step time, for OpenRLHF v0.8.5 against verl v0.4.0. Both versions are far behind current releases.**
- Location: 2405.11143v6, Sec 4.1, Table 1.
- Verdict: NEW (author-reported, old versions)
- Evidence: https://arxiv.org/abs/2405.11143v6 | Tier 3, preprint | benchmark claim (author reported) | "We evaluate the training efficiency of OpenRLHF (v0.8.5) and verl (v0.4.0) by measuring the average per-step training time ... Experiments are conducted on 8 NVIDIA H200 140GB GPUs". "in the 14B-8K setting, OpenRLHF achieves a 1.56× speedup (328.6 seconds vs. 511.1 seconds)". (accessed 2026-10-17)
- Use in dive: one data point on step time at single-node scale (5 to 9 minutes per step at 14B with 8K generation). Framework speed claims are each author's own; do not rank frameworks on them.

### D. TRL GRPOTrainer and vLLM

Algorithm defaults of TRL `GRPOTrainer` (loss aggregation, `beta`, reward scaling, multi-turn tool masking) are in F02-28 to F02-34 at the same pin and are not repeated here.

**F05-18. TRL generation runs through vLLM only if `use_vllm=True` (default `False`, which falls back to `model.generate()`). `vllm_mode` then defaults to `"colocate"`: vLLM runs in the training process and shares the training GPUs. `"server"` sends requests to a separately launched vLLM server.**
- Location: `trl/trainer/grpo_config.py:119-129` (docstring) and `:587-603` (fields) at `v1.16.0` = `1b5c75ed94b7387f42532adb090c935166d4878d`.
- Verdict: NEW
- Evidence: https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L587-L603 | Tier 1 | code behaviour | `use_vllm: bool = field(default=False, ...`; `vllm_mode: str = field(default="colocate", ... "'server'`: The trainer will send generation requests to a separate vLLM server. ... `'colocate'`: vLLM will run in the same process and share the training GPUs. This avoids the need for a separate server but may cause resource contention with training."` (accessed 2026-10-17)
- Use in dive: practical. The single-GPU path for a newcomer is `use_vllm=True` with the colocate default; without `use_vllm` the rollout runs on the slow HF generate path.

**F05-19. In colocate mode vLLM gets a fixed slice of GPU memory, `vllm_gpu_memory_utilization` default 0.3, and keeps it during training unless `vllm_enable_sleep_mode=True` (default `False`), which offloads weights and KV cache during the optimizer step at the cost of host-device transfer when it wakes.**
- Location: `trl/trainer/grpo_config.py:134-136`, `:158-161` (docstrings), `:612-613`, `:656-657` (defaults) at `v1.16.0`; sleep call `trl/generation/vllm_generation.py:365-368`.
- Verdict: NEW
- Evidence: https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L656-L657 | Tier 1 | code behaviour | `vllm_gpu_memory_utilization: float = field(default=0.3,`; docstring "Enable vLLM sleep mode to offload weights/cache during the optimizer step. Keeps GPU memory usage low, but waking the engine adds host-device transfer latency." vllm_generation.py: `if self.enable_sleep_mode: self.llm.sleep(level=2)`. (accessed 2026-10-17)
- Use in dive: on a unified-memory machine (DGX Spark) "GPU memory utilization" is a fraction of the shared 128 GB pool; how vLLM sizes it there is UNKNOWN (U8). Practical: the 0.3 default is the first knob to check when colocated training runs out of memory.

**F05-20. TRL weight sync, by mode: in colocate mode each parameter is loaded in-process with vLLM's `load_weights`; in server mode the main process broadcasts parameters over NCCL to the server after announcing their metadata. Either way the prefix cache is then reset. Sync happens once per optimizer step (guarded by `_last_loaded_step`), not per micro-batch.**
- Location: `trl/generation/vllm_generation.py:481-516`; `trl/trainer/grpo_trainer.py:1769-1772` at `v1.16.0`.
- Verdict: NEW
- Evidence: https://github.com/huggingface/trl/blob/v1.16.0/trl/generation/vllm_generation.py#L481-L516 | Tier 1 | code behaviour | `if self.mode == "server": ... self.vllm_client.update_named_params(self._weight_metadata, self._iter_named_params())`; `elif self.mode == "colocate": for name, param in self._iter_named_params(): self.llm.llm_engine.model_executor.driver_worker.model_runner.model.load_weights([(name, param)])`; `self.llm.reset_prefix_cache()`. grpo_trainer.py: `if self.state.global_step != self._last_loaded_step: ... self.vllm_generation.sync_weights()`. (accessed 2026-10-17)
- Use in dive: shows the fourth stage of the step (F05-3) in about 30 lines of code. The prefix-cache reset is the detail a vLLM expert will want: cached KV from old weights is invalid.

**F05-21. At `v1.16.0`, TRL server mode uses vLLM's own server and weight-transfer engine: `VLLM_SERVER_DEV_MODE=1 vllm serve <model> --weight-transfer-config '{"backend": "nccl"}'`. `trl vllm-serve` is deprecated and only wraps that command. The supported vLLM range is `>=0.22.0,<=0.31.0`.**
- Location: `trl/generation/vllm_client.py:161-169`; `trl/scripts/vllm_serve.py:282-291`; `pyproject.toml:89-90` at `v1.16.0`.
- Verdict: NEW. Older TRL tutorials that start `trl vllm-serve` describe a path now marked for removal in v2.0.0.
- Evidence: https://github.com/huggingface/trl/blob/v1.16.0/trl/scripts/vllm_serve.py#L282-L291 | Tier 1 | code behaviour | "`trl vllm-serve` is deprecated and will be removed in v2.0.0: it now only runs vLLM's own server." vllm_client.py docstring: `$ VLLM_SERVER_DEV_MODE=1 vllm serve Qwen/Qwen2.5-7B --weight-transfer-config '{"backend": "nccl"}' --logprobs-mode processed_logprobs --max-logprobs -1`. pyproject.toml: `vllm = [ "vllm>=0.22.0,<=0.31.0",`. (accessed 2026-10-17)
- Use in dive: practical. Weight transfer for RL is now an inference-engine feature, not a trainer hack. Pins the vLLM version a DGX Spark user must match (F05-45).

**F05-22. TRL corrects the vLLM-versus-trainer logprob mismatch by default: `vllm_importance_sampling_correction=True`, mode `"sequence_mask"` (sequences whose ratio falls outside [C_min, C_max] are masked out), `clip_max` 3.0. The docstring's list also labels `"token_truncate"` as "(default)"; the field default in code is `"sequence_mask"`.**
- Location: `trl/trainer/grpo_config.py:322-340` (docstring), `:925-926`, `:934-935` (fields) at `v1.16.0`.
- Verdict: NEW, including a small in-file doc-code contradiction (code wins: `sequence_mask`).
- Evidence: https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L925-L935 | Tier 1 | code behaviour | `vllm_importance_sampling_correction: bool = field(default=True,`; `vllm_importance_sampling_mode: str = field(default="sequence_mask",`; docstring: "Whether to apply Importance Sampling (IS) to correct for the mismatch between vLLM completion logprobs and recomputed training logprobs." and "`\"token_truncate\"`: Token-level truncated IS (default)." (accessed 2026-10-17)
- Use in dive: second framework that treats the rollout engine as a slightly different policy (F05-16). OpenRLHF defaults the correction off, TRL defaults it on.

### E. Asynchronous and off-policy designs

AReaL (F05-6 to F05-11), OpenRLHF async (F05-15) and verl fully async (F05-27) are recorded above. This section adds prime-rl / INTELLECT-2, slime, PipelineRL and NeMo-RL.

**F05-28. INTELLECT-2 names three regimes. Synchronous: one GPU pool alternates inference and training, fully on-policy. Centralized one-step async: dedicated pools run concurrently, rollouts come from the previous step's policy. Decentralized two-step async: the weight broadcast is slow, so rollouts come from weights two or more steps old.**
- Location: 2505.07291v1 (INTELLECT-2), Sec 3.2, Figure 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.07291v1 | Tier 3, preprint, first-party lab (Prime Intellect) | definition | "Synchronous RL leverages the same compute resources for training and inference and sequentially switches between performing only inference and training. Therefore, training is fully on-policy. Centralized One-Step Asynchronous RL has dedicated compute resources for training and inference and performs training and inference at the same time. Therefore, rollouts are collected from the policy of the last RL step, making training off-policy by one step. Decentralized Two-Step Asynchronous RL ... inference workers don't have access to the up-to-date policy weights immediately after a training step due to the time-consuming weight broadcast." (accessed 2026-10-17)
- Use in dive: the cleanest three-panel diagram of sync vs async for the systems section. Mental model: the staleness you need equals the latency you must hide.

**F05-29. In INTELLECT-2's ablation (replicating DeepScaleR on DeepSeek-R1-Distill-Qwen-1.5B at 2,048-token context), reward trajectories with asynchrony up to four steps matched the synchronous baseline. The production run used two-step asynchrony; the authors flag delays beyond two steps as needing more study.**
- Location: 2505.07291v1, Sec 3.2 (Figure 7), Sec 4 (training setup), Sec 6 (limitations).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.07291v1 | Tier 3, preprint, first-party lab | ablation | "even with asynchrony levels of up to four, our model's reward trajectory matches the trajectory of the synchronous baseline, indicating that training on slightly off-policy data does not hurt the performance of RL training." "We used two-step asynchrony during training to enhance throughput while ensuring that we did not go too far off-policy." "Further investigation is needed to evaluate asynchronous RL with delays beyond two steps." (accessed 2026-10-17)
- Use in dive: evidence for "a few steps stale is fine" at small scale, with its scope (1.5B, 2K context, reward curves, not final benchmark). Pair with AReaL's finding that unbounded staleness hurts (F05-9).

**F05-30. INTELLECT-2 is the one primary source found that reports a compute split between inference and training for a named run: across its two main experiments the FLOP ratio "averaged 4.5x", with more compute on the inference workers than on training. Broadcasting 62 GB of weights to the swarm averaged 14 minutes (about 590 Mb/s); a full training step took about 21 to 22 minutes.**
- Location: 2505.07291v1, Sec 4.2 "Compute Utilization".
- Verdict: NEW. The sentence literally reads "ratio of training to inference FLOPs ... averaged 4.5x" and then says more compute went to inference; the clause that follows fixes the direction (inference about 4.5 times training). Quote both clauses together.
- Evidence: https://arxiv.org/abs/2505.07291v1 | Tier 3, preprint, first-party lab | production report | "the SHARDCAST broadcast to all nodes averaged 14 minutes, corresponding to a bandwidth throughput of approximately 590 Mb/s (62 GB of weights transmitted over 14 minutes)". "The ratio of training to inference FLOPs in both experiments averaged 4.5×, with significantly more compute spent on the decentralized inference workers than on the training side. In TARGET-SHORT, training nodes took approximately 22 minutes to execute a full rollout step." Run setup: QwQ-32B base, "during every rollout step, we generated 4096 samples consisting of 16 responses to 256 prompts, and performed 8 optimizer steps using a batch size of 512", maximum sequence length 32K. (accessed 2026-10-17)
- Use in dive: the strongest primary number for "RL is mostly an inference workload": roughly 4.5 FLOPs of inference per FLOP of training at 32B with long reasoning. [derived] inference share of total FLOPs = 4.5 / 5.5 = about 82% (input: the 4.5x ratio only). Quote as FLOPs, not wall-clock time.

**F05-31. prime-rl separates trainer and inference into distinct executables that exchange only data (Parquet) and checkpoints, with no Ray orchestrator. To make asynchrony transparent to the trainer, it recomputes log-probs with the policy at the start of the optimization step. INTELLECT-2 also states it did not use vLLM's log-probs because they "turned out to not be numerically stable".**
- Location: 2505.07291v1, Sec 2.1 and 2.1.1; Sec 4 training setup.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.07291v1 | Tier 3, preprint, first-party lab | definition plus production report | "PRIME-RL's architecture completely separates training and inference components into distinct executable files that communicate only when exchanging data and checkpoints. This clean separation eliminates the need for centralized orchestrators like Ray [27]". "we compute logprobabilities using the policy at the start of the optimization step rather than the policy that produced the original trajectories." "Instead of obtaining token log probabilities from our inference workers, we computed them seperately using our policy weights on the training cluster, as vLLM log probabilities turned out to not be numerically stable." (accessed 2026-10-17)
- Use in dive: third independent report of the inference-versus-training logprob gap (with F05-16, F05-22). The fix choices differ: recompute (prime-rl), importance-sample correct (TRL default), off by default (OpenRLHF).

**F05-32. At prime-rl `v0.10.0` the staleness bound is `max_off_policy_steps`, default 8: the policy version a batch trains on minus the oldest version that generated any part of the rollout (a rollout can span weight updates), queue time included. Episodes past the bound are dropped, both in flight and queued.**
- Location: `packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py:542-543`; `src/prime_rl/orchestrator/utils.py:42-45`; `src/prime_rl/orchestrator/dispatcher.py:17-20` at `v0.10.0` = `9e15490dcab1d506ce3462e69b8aa5dde45c6b3a`.
- Verdict: NEW. The code default (8) is looser than the two steps used in the INTELLECT-2 run (F05-29).
- Evidence: https://github.com/PrimeIntellect-ai/prime-rl/blob/v0.10.0/packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py#L542-L543 | Tier 1 | code behaviour | `max_off_policy_steps: int = Field(8, ge=0)` / `"""Maximum staleness of a trained rollout: the version a batch trains on (v{step-1}) minus the oldest version that generated the rollout (a rollout can span several weight updates), queue time included. Episodes past the bound are dropped, in-flight and queued ... Higher values yield better throughput at the cost of off-policy noise."""`; utils.py: `return (step - 1) - max_off_policy_steps`. (accessed 2026-10-17)
- Use in dive: comparison table. Same idea as AReaL's eta (F05-8), enforced by dropping rather than by admission control.

**F05-33. slime's top-level `train.py` is the whole synchronous RL step in about 80 lines: `rollout_manager.generate` (SGLang), offload the rollout engine, `actor_model.async_train` (Megatron), offload the trainer, onload rollout weights, pause rollout admission, `actor_model.update_weights()`, resume. It is the clearest code-level illustration of the four-stage step found in this pass.**
- Location: `train.py:13-95` at slime `v0.4.0` = `0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e`; backends listed in `slime/backends/` (`megatron_utils`, `sglang_utils`).
- Verdict: NEW
- Evidence: https://github.com/THUDM/slime/blob/v0.4.0/train.py#L13-L95 | Tier 1 | code behaviour | `rollout_data_ref = ray.get(rollout_manager.generate.remote(rollout_id))` / `if args.offload_rollout: ray.get(rollout_manager.offload.remote())` / `ray.get(actor_model.async_train(rollout_id, rollout_data_ref))` / `offload_train(actor_trains)` / `if args.offload_rollout and not release_train: ray.get(rollout_manager.onload_weights.remote())` / `was_paused = ray.get(rollout_manager.pause_rollout_admission.remote())` / `actor_model.update_weights()`. (accessed 2026-10-17)
- Use in dive: a candidate code excerpt for the step diagram; each line maps to one box (generate, score inside rollout, train, sync), plus the offload/onload "dance" that colocation needs.

**F05-34. In slime, `--colocate` (default off) puts the SGLang inference engines and the Megatron actor on the same GPUs and forces `--offload` on, which means offloading the trainer to CPU during rollout and the rollout engine during training. Without it, `--rollout-num-gpus` sets a separate inference pool and `--actor-num-gpus-per-node` defaults to 8. slime also ships a truncated importance sampling flag `--use-tis` (default off) for the train/rollout mismatch.**
- Location: `slime/utils/arguments.py:42-100`, `:1165-1174` at `v0.4.0`.
- Verdict: NEW
- Evidence: https://github.com/THUDM/slime/blob/v0.4.0/slime/utils/arguments.py#L44-L100 | Tier 1 | code behaviour | `"--colocate", action="store_true", default=False, help=("Whether to colocate the inference engines and the actor. " "Turning this on will also set --offload to true.")`; `"--offload-train" ... "Whether to offload the training actor to CPU during training. " "This will always be true when --colocate is set."` (help text as written; context says rollout); `"--rollout-num-gpus" ... "Number of GPUs for inference."`; `# Off-Policy Correction using Importance Sampling: https://fengyao.notion.site/off-policy-rl` / `"--use-tis", action="store_true", default=False`. (accessed 2026-10-17)
- Use in dive: comparison table row for slime; one more framework that pairs colocation with explicit offload, and one more mismatch correction (F05-16, F05-22, F05-31).

**F05-35. PipelineRL's "in-flight weight update": the generation engine pauses briefly to receive new weights over the inter-accelerator network, then continues the in-progress sequences, so later tokens in one sequence come from newer policies. It keeps the KV cache computed under old weights (AReaL recomputes it, F05-7): in its ablation, stale KV gave only slightly higher KL divergence than recomputing, and both stayed closer to on-policy than conventional RL.**
- Location: 2509.19128v2 (PipelineRL), Sec 1, Figure 1; Sec 5 (Figure 7); Sec 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.19128v2 | Tier 3, preprint | definition plus ablation | "during an in-flight weight update the LLM generation engine only briefly pauses to receive the model weights via a high-speed inter-accelerator network, and then proceeds to continue the generation of in-progress token sequences. In-flight updates eliminate the wasteful waits for the last sequence to finish, ensure high accelerator utilization at a constant generation batch size". "using stale KV-cache for mixed policy sequences introduces only slightly higher divergence compared to recomputing the cache. This supports our design choice in Pipeline-RL to opt for the more efficient approach of retaining the KV cache." (accessed 2026-10-17)
- Use in dive: a design fork a vLLM expert will enjoy: after a weight swap, keep or recompute the KV cache. Two primary sources chose differently.

**F05-36. PipelineRL reports about 2x faster learning than a conventional RL baseline on 128 H100 GPUs (4 DGX-H100 nodes in the introduction's wording). Its motivation figure: decode throughput for a 7B Qwen model on one H100 rises almost linearly up to a generation batch of 128, so splitting a fixed number of samples over more GPUs gains little, and as short sequences finish the batch thins to the long ones.**
- Location: 2509.19128v2, Abstract, Sec 1, Sec 3 (Figure 2a and 2b).
- Verdict: NEW. Note the internal inconsistency: the abstract says "128 H100 GPUs", the introduction says "4 DGX-H100 nodes" (32 GPUs at 8 per node [derived]). Quote each with its location; do not reconcile.
- Evidence: https://arxiv.org/abs/2509.19128v2 | Tier 3, preprint | benchmark claim (author reported) | Abstract: "Experiments conducted on long-form reasoning tasks using 128 H100 GPUs demonstrate that PipelineRL achieves approximately ∼ 2x faster learning compared to conventional RL baselines while maintaining highly on-policy training data." Sec 1: "on 4 DGX-H100 nodes, PipelineRL learns ∼ 2x faster than the comparable conventional RL baseline." Sec 3: "the throughput increases almost linearly up to the generation batch size of 128. Hence, e.g. using 2N GPUs to generate 32 samples will not be much faster than using N GPUs to generate 64. Furthermore, as the LLM finishes the shorter generations, there will be fewer longer generations still in progress". (accessed 2026-10-17)
- Use in dive: the long tail drawn as a decode-batch curve; the same physics as F05-6 from a second team.

### F. Cost of named RL runs

### G. DGX Spark feasibility evidence

---

## 3. Framework comparison table

(filled in at the end)

## 4. Feasibility notes: a small RL run on DGX Spark

(filled in at the end)

## 5. Mental models worth teaching

(filled in at the end)

## 6. UNKNOWN register

(filled in as gaps appear)

## 7. Reading path for a newcomer

(filled in at the end)

## 8. Source list by tier

(filled in at the end)
