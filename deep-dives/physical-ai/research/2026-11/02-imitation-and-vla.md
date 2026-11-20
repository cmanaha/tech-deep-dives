# 02 Imitation learning and vision-language-action models: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 02 of the "Physical AI" dive. How a robot policy is learned from demonstrations (behaviour cloning, compounding error, action chunking, ACT, diffusion policy, flow matching, tokenised actions) and what the vision-language-action (VLA) models of November 2026 are (pi0 line, GR00T line, SmolVLA, OpenVLA-OFT, X-VLA, ScaleVLA, Gemini Robotics), with their published compute.
- **Sections fed:** section 4 "Learning From Demonstrations" and section 5 "Vision-Language-Action Models".
- **Out of scope here:** real-time chunking and asynchronous execution in depth (stream 07 owns it; pointers only, F02-30, F02-31); world models and world-action models (stream 01/03); the SO-101 hardware itself (the arm's joint count and camera figures used in the worked examples are taken from the LeRobot code and SmolVLA paper read here, and must be reconciled with the hardware stream).
- **Reader:** technical reader at level 100 to 200, no robotics background. Thread task: an SO-101 arm picks up a block and places it in a cup.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text (for example `T^2 * epsilon`). Ellipses mark omissions. PDF text extraction drops some Greek letters; where a quote needed one restored it is written out as a word (epsilon, beta, tau).
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by ...); WRONG (seed said X; source says Y); UNKNOWN (unresolved, see section 9).
- **Labels:** `[author reported]` and `[vendor claim]` for performance figures; `[derived]` for arithmetic, with inputs; `[our reading]` for synthesis.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; model cards |
| Tier 2 | First-party lab or vendor blogs and project pages |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed; otherwise "preprint") |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code is the authority over documentation. Vendor and author performance numbers are claims, not measurements.

CURRENCY_TABLE_PLACEHOLDER

PINNED_SOURCES_PLACEHOLDER

---

## 4. Claim register

### A. Behaviour cloning and compounding error (history, labelled)

**F02-1. Behaviour cloning is supervised learning: train a classifier or regressor to predict the expert's action from the observation the expert saw. The catch is that at run time the policy's own outputs decide what it sees next, so the training assumption that samples are independent and identically distributed (i.i.d.) no longer holds.**
- Location: 1011.0686v3 (Ross, Gordon, Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning"), Section 1 Introduction.
- Verdict: NEW (history: 2011 paper, the standard statement of the problem)
- Evidence: https://arxiv.org/abs/1011.0686v3 | Tier 3, peer-reviewed (AISTATS 2011, per the PDF first-page footer "Appearing in Proceedings of the 14th International Conference on Artificial Intelligence and Statistics (AISTATS) 2011") | definition | "A typical approach to imitation learning is to train a classifier or regressor to predict an expert's behavior given training data of the encountered observations (input) and actions (output) performed by the expert. However since the learner's prediction affects future input observations/states during execution of the learned policy, this violate the crucial i.i.d. assumption made by most statistical learning approaches." (accessed 2026-11-20)
- Use in dive: section 4, the opening definition. "Observation in, action out, trained like any regressor" is the whole of behaviour cloning; the second sentence is the reason the rest of section 4 exists.

**F02-2. The compounding-error bound: a policy that disagrees with the expert with probability epsilon per step, measured on the states the expert visits, can make up to T^2 * epsilon mistakes over a T-step task, because one mistake moves it to states the demonstrations never covered.**
- Location: 1011.0686v3, Section 1 (the informal statement) and Section 2.1, Theorem 2.1 (the formal one, credited to Ross and Bagnell 2010).
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/1011.0686v3 | Tier 3, peer-reviewed (AISTATS 2011) | definition (theorem) | "a classifier that makes a mistake with probability epsilon under the distribution of states/observations encountered by the expert can make as many as T^2 * epsilon mistakes in expectation over T-steps under the distribution of states the classifier itself induces (Ross and Bagnell, 2010). Intuitively this is because as soon as the learner makes a mistake, it may encounter completely different observations than those under expert demonstration, leading to a compounding of errors." (accessed 2026-11-20)
- Use in dive: section 4, the quadratic-in-horizon bound. The quote is the one to show. It is a worst-case upper bound, not a prediction of a given robot's failure rate.

**F02-3. Theorem 2.1 in symbols: if the policy's expected loss under the expert's state distribution is epsilon, its total cost J over T steps satisfies J(pi) <= J(pi*) + T^2 * epsilon, and the bound is tight (problems exist where the extra cost really grows quadratically in T).**
- Location: 1011.0686v3, Section 2.1 "Supervised Approach to Imitation", Theorem 2.1 and the paragraph after it.
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/1011.0686v3 | Tier 3, peer-reviewed (AISTATS 2011) | definition (theorem) | "Theorem 2.1. (Ross and Bagnell, 2010) Let E_{s ~ d_pi*}[l(s, pi)] = epsilon, then J(pi) <= J(pi*) + T^2 * epsilon." and "Note that this bound is tight, i.e. there exist problems such that a policy pi with epsilon 0-1 loss on d_pi* can incur extra cost that grows quadratically in T." and "Hence the traditional supervised learning approach has poor performance guarantees due to the quadratic growth in T." (accessed 2026-11-20)
- Use in dive: section 4, formula block. Symbols: pi is the learned policy, pi* the expert, d_pi* the distribution of states the expert visits, l the per-step loss (0-1 disagreement), T the task horizon in steps, J the total expected cost over T steps.

**F02-4. DAgger (Dataset Aggregation), the 2011 answer: run the learned policy, have the expert label the states it actually reaches, add them to the dataset, retrain, repeat. It brings the guarantee back to linear in T. It needs an expert who can be queried on the learner's own states, which teleoperated robot demonstrations do not give for free.**
- Location: 1011.0686v3, Abstract and Section 3 (the DAgger algorithm; Theorem 3.3 bounds total cost by J(pi*) + u*T*epsilon_N + O(1)).
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/1011.0686v3 | Tier 3, peer-reviewed (AISTATS 2011) | definition | "Recent approaches (Ross and Bagnell, 2010) can guarantee an expected number of mistakes linear (or nearly so) in the task horizon T and error epsilon" [Section 1] and, on what the paper wants in place of the quadratic bound, "Instead we would prefer approaches that can guarantee growth linear or near-linear in T and epsilon." (accessed 2026-11-20)
- Use in dive: section 4, one paragraph of history. `[our reading]` Modern robot imitation mostly takes the other road: shorten the effective horizon T with action chunks (F02-6) instead of querying the expert again. Human-intervention data collection (covered by the real-world RL stream) is the DAgger idea in today's clothes.

### B. Action chunking, temporal ensembling and ACT

**F02-5. ACT (Action Chunking with Transformers, 2023) is the paper that introduced action chunking for robot imitation in its modern form: the policy predicts the next k actions from one observation, which divides the effective horizon by k and so attacks the T^2 term directly.**
- Location: 2304.13705v1 (Zhao, Kumar, Levine, Finn, "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware"), Section IV-A "Action Chunking and Temporal Ensemble".
- Verdict: CARRIED (seed 01, re-fetched), teaching detail NEW. History: the paper that introduced the concept.
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint (published at RSS 2023 per the project; venue not confirmed in the fetched PDF) | definition | "In our implementation, we fix the chunk size to be k: every k steps, the agent receives an observation, generates the next k actions, and executes the actions in sequence (Figure 5). This implies a k-fold reduction in the effective horizon of the task. Concretely, the policy models pi_theta(a_{t:t+k} | s_t) instead of pi_theta(a_t | s_t)." (accessed 2026-11-20)
- Use in dive: section 4, the definition of a chunk and the link back to F02-2: fewer decisions means fewer chances to compound.

**F02-6. ACT's chunk size is k = 100 actions at a 50 Hz control rate, that is 2 seconds of motion per forward pass. Its ablation moves success from 1% without chunking (k = 1) to 44% at k = 100, averaged over four settings.**
- Location: 2304.13705v1, Appendix Table III "Hyperparameters of ACT" (chunk size 100, beta 10, hidden dimension 512, feedforward dimension 3200, 4 encoder layers, 7 decoder layers, 8 heads, learning rate 1e-5, batch size 8, dropout 0.1); Section III ("teleoperation and data recording happen at 50Hz"); Section VI-A (ablation).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | ablation (author reported) | "We observe that performance improves drastically from 1% at k = 1 to 44% at k = 100, then slightly tapers down with higher k. This illustrates that more chunking and a lower effective horizon generally improve performance." (accessed 2026-11-20)
- Use in dive: section 4, the strongest number for chunking: 1% to 44% `[author reported]`. 100 actions / 50 Hz = 2.0 s `[derived]`.

**F02-7. Temporal ensembling: query the policy every step so chunks overlap, then average all the predictions made for the current timestep with exponentially decaying weights w_i = exp(-m * i), where w_0 belongs to the oldest prediction. It trades one forward pass per chunk for one forward pass per step in return for smoother motion.**
- Location: 2304.13705v1, Section IV-A.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | definition | "To improve smoothness and avoid discrete switching between executing and observing, we query the policy at every timestep. This makes different action chunks overlap with each other ... Our temporal ensemble performs a weighted average over these predictions with an exponential weighting scheme w_i = exp(-m * i), where w_0 is the weight for the oldest action. The speed for incorporating new observation is governed by m, where a smaller m means faster incorporation." (accessed 2026-11-20)
- Use in dive: section 4. Compute consequence `[derived]`: at 50 Hz with k = 100, plain chunking needs 0.5 forward passes per second; temporal ensembling needs 50.

**F02-8. Why ACT has a CVAE (conditional variational autoencoder, a model trained to reconstruct its input through a small random "style" variable z): human demonstrations of the same task differ from one another, and a plain regressor averages them. The CVAE encoder sees the demonstrated action sequence during training and compresses "which way the human did it" into z; at test time the encoder is thrown away and z is set to zero.**
- Location: 2304.13705v1, Section IV-B "Modeling human data"; Fig. 4 caption; Section VI-B (ablation).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | definition and ablation | "The CVAE encoder only serves to train the CVAE decoder (the policy) and is discarded at test time." and "the standard VAE objective which has two terms: a reconstruction loss and a term that regularizes the encoder to a Gaussian prior. Following [23], we weight the second term with a hyperparameter beta. Intuitively, higher beta will result in less information transmitted in z" and "Overall, we found the CVAE objective to be essential in learning precise tasks from human demonstrations." (accessed 2026-11-20)
- Use in dive: section 4. Loss as the paper writes it (Algorithm 1): L = L_reconst + beta * L_reg, where L_reconst is the L1 distance between predicted and demonstrated action chunks and L_reg is the KL divergence between the encoder's distribution over z and a standard Gaussian. The paper uses L1 "instead of the more common L2 loss: we noted that L1 loss leads to more precise modeling of the action sequence."

**F02-9. ACT's published cost: about 80M parameters, trained from scratch per task in about 5 hours on one 11 GB RTX 2080 Ti, with about 0.01 s per inference on the same machine.**
- Location: 2304.13705v1, Section IV-C "Implementing ACT".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | benchmark claim (author reported) | "The model has around 80M parameters, and we train from scratch for each task. The training takes around 5 hours on a single 11G RTX 2080 Ti GPU, and the inference time is around 0.01 seconds on the same machine." (accessed 2026-11-20)
- Use in dive: sections 4 and the compute table. 0.01 s per inference is about 100 forward passes per second `[derived]`, which is why ACT can afford temporal ensembling at 50 Hz.

**F02-10. ACT's data budget: 50 demonstrations per task, about 10 minutes of teleoperation, for 80 to 90% success on six real tasks.**
- Location: 2304.13705v1, Abstract and Section I.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | benchmark claim (author reported) | "80-90% success, from only 10 minutes or 50 demonstration" [Section I; the abstract reads "with only 10 minutes worth of demonstrations"] (accessed 2026-11-20)
- Use in dive: section 4, the scale of a from-scratch imitation dataset. It anchors what "collect 50 episodes" means for the block-in-cup task.

**F02-11. LeRobot's ACT at release v0.7.0 keeps the paper's numbers as defaults: `chunk_size = 100`, `n_action_steps = 100`, `vision_backbone = "resnet18"` with ImageNet weights, `dim_model = 512`, `kl_weight = 10.0`, `use_vae = True`, `latent_dim = 32`. The docstring says the defaults target bimanual ALOHA, so an SO-101 user changes inputs and outputs and may shorten the chunk.**
- Location: `src/lerobot/policies/act/configuration_act.py` lines 84 to 86, 98 to 99, 103 to 115, 123 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/act/configuration_act.py | Tier 1, code at tag v0.7.0 | code behaviour | "n_obs_steps: int = 1 / chunk_size: int = 100 / n_action_steps: int = 100" and "vision_backbone: str = "resnet18" / pretrained_backbone_weights: str | None = "ResNet18_Weights.IMAGENET1K_V1"" and "dim_model: int = 512 / n_heads: int = 8 / dim_feedforward: int = 3200" and "kl_weight: float = 10.0"; docstring: "Defaults are configured for training on bimanual Aloha tasks like "insertion" or "transfer"." (accessed 2026-11-20)
- Use in dive: section 4, the code block that pairs with the paper's table. At a 30 Hz SO-101 recording rate, the default chunk covers 100 / 30 = 3.33 s `[derived]`.

**F02-12. LeRobot's ACT sets `n_decoder_layers = 1` although the paper's table says 7, because the original code only ever used the first decoder layer. The code is the authority here.**
- Location: `src/lerobot/policies/act/configuration_act.py` lines 108 to 111 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/act/configuration_act.py | Tier 1, code at tag v0.7.0 | code behaviour | "# Note: Although the original ACT implementation has 7 for `n_decoder_layers`, there is a bug in the code # that means only the first layer is used. Here we match the original implementation by setting this to 1." (accessed 2026-11-20)
- Use in dive: section 4, a short practical note: the paper's "7 decoder layers" (Table III) and the working model differ. Recorded under Contradictions.

**F02-13. In LeRobot's ACT, temporal ensembling is off by default and, when turned on, forces one inference per control step: `temporal_ensemble_coeff` defaults to `None`, the paper's value is 0.01, and the config raises an error unless `n_action_steps` is 1. The training loss is L1 plus `kl_weight` times the KL term.**
- Location: `configuration_act.py` lines 117 to 119 and 139 to 143; `modeling_act.py` lines 148 to 165 and 171 to 214 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/act/modeling_act.py | Tier 1, code at tag v0.7.0 | code behaviour | "loss = l1_loss + mean_kld * self.config.kl_weight" and, in the ensembler docstring, "The weights are calculated as w_i = exp(-temporal_ensemble_coeff * i) where w_0 is the oldest action." ; config: "`n_action_steps` must be 1 when using temporal ensembling. This is because the policy needs to be queried every step to compute the ensembled action." (accessed 2026-11-20)
- Use in dive: section 4, the knob that changes inference load by a factor of `chunk_size`.

### C. Multimodal action distributions and diffusion policy

**F02-14. Diffusion Policy (2023) frames the policy as a conditional denoising process: start from Gaussian noise shaped like an action sequence, and subtract the output of a noise-prediction network K times, conditioned on the observation. Its stated first advantage is that it can represent multimodal action distributions, "a well-known challenge for policy learning".**
- Location: 2303.04137v5 (Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion"), Section 1 (properties) and Section 3.1 to 3.2 (equations).
- Verdict: NEW (history: the introducing paper; the seed did not fetch it)
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint (v5, 14 Mar 2024, is the extended journal version; venue not confirmed in the fetched PDF) | definition | "Expressing multimodal action distributions. By learning the gradient of the action score function ... and performing Stochastic Langevin Dynamics sampling on this gradient field, Diffusion policy can express arbitrary normalizable distributions ..., which includes multimodal action distributions, a well-known challenge for policy learning." (accessed 2026-11-20)
- Use in dive: section 4. Formulas as printed: the denoising step A_t^{k-1} = alpha * (A_t^k - gamma * eps_theta(O_t, A_t^k, k) + N(0, sigma^2 I)) and the training loss L = MSE(eps^k, eps_theta(O_t, A_t^0 + eps^k, k)). Symbols: A_t^k is the action sequence at denoising iteration k for control step t; O_t the observations; eps_theta the noise-prediction network; eps^k the random noise added for iteration k; alpha, gamma, sigma the noise-schedule constants. `[our reading]` Why mean-squared-error regression fails on multimodal data: if half the demonstrations pass the block to the left of an obstacle and half to the right, the MSE-optimal single output is the average, straight into the obstacle. The paper states the property; the left/right example is ours and must be labelled as an illustration.

**F02-15. Diffusion Policy executes in a receding horizon: from the last T_o observations it predicts T_p actions and executes only the first T_a before re-planning. The paper found T_a = 8 best for most tasks.**
- Location: 2303.04137v5, Section 3.2 "Closed-loop action-sequence prediction"; Section 5 key findings "The tradeoff in action horizon".
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint | definition and ablation (author reported) | "at time step t the policy takes the latest T_o steps of observation data O_t as input and predicts T_p steps of actions, of which T_a steps of actions are executed on the robot without re-planning. Here, we define T_o as the observation horizon, T_p as the action prediction horizon and T_a as the action execution horizon." and "having an action horizon greater than 1 helps the policy predict consistent actions and compensate for idle portions of the demonstration, but too long a horizon reduces performance due to slow reaction time. Our experiment confirms this trade-off (Fig. 5 left) and found the action horizon of 8 steps to be optimal for most tasks that we tested." (accessed 2026-11-20)
- Use in dive: section 4. Same idea as ACT's chunk with a different vocabulary: predict long, execute a prefix, re-plan. The table of names to give the reader: ACT `chunk_size` / `n_action_steps`; Diffusion Policy T_p / T_a; openpi `action_horizon`.

**F02-16. Diffusion Policy's denoising cost: 100 iterations in training; at inference 100 in simulation, cut to 16 (or 10) on real robots with DDIM (Denoising Diffusion Implicit Models, a sampler that skips steps), giving 0.1 s per inference on an NVIDIA 3080.**
- Location: 2303.04137v5, Section 3.4 "Accelerating inference for real-time control" (hmm: heading as in PDF section on inference speed) and Appendix "Implementation details".
- Verdict: NEW (history; closes the seed's "Diffusion Policy numbers not fetched")
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint | benchmark claim (author reported) | "In our real-world experiments, using DDIM with 100 training iterations and 10 inference iterations enables 0.1s inference latency on a Nvidia 3080 GPU." and "On simulation benchmarks, we used the iDDPM algorithm ... with the same 100 denoising diffusion iterations for both training and inference. We used DDIM ... on realworld benchmarks to reduce the inference denoising iterations to 16 therefore reducing inference latency." (accessed 2026-11-20)
- Use in dive: section 4 and compute table. One "inference" here is 10 to 100 passes through the denoising network, against one pass for ACT: the cost of expressiveness.

**F02-17. LeRobot's Diffusion Policy at v0.7.0 defaults to `n_obs_steps = 2`, `horizon = 64`, `n_action_steps = 32`, a ResNet-18 vision backbone, a DDPM scheduler with `num_train_timesteps = 100`, and `num_inference_steps = None`, which the model resolves to the training value: 100 denoising passes per inference unless the user sets fewer.**
- Location: `src/lerobot/policies/diffusion/configuration_diffusion.py` lines 104 to 106, 122, 139 to 149; `modeling_diffusion.py` lines 247 to 250 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/diffusion/configuration_diffusion.py | Tier 1, code at tag v0.7.0 | code behaviour | "n_obs_steps: int = 2 / horizon: int = 64 / n_action_steps: int = 32" and "noise_scheduler_type: str = "DDPM" / num_train_timesteps: int = 100" and "num_inference_steps: int | None = None"; model: "if config.num_inference_steps is None: self.num_inference_steps = self.noise_scheduler.config.num_train_timesteps" (accessed 2026-11-20)
- Use in dive: section 4. At 30 Hz, executing 32 of 64 predicted actions means one inference every 32 / 30 = 1.07 s, and that inference is 100 U-Net passes `[derived]`. The paper's own values were T_p = 16, T_a = 8 (F02-15): LeRobot's current defaults are four times longer. Note the stale in-code comment "drop_n_last_frames: int = 7  # horizon - n_action_steps - n_obs_steps + 1": with the current defaults that expression is 64 - 32 - 2 + 1 = 31, not 7 `[derived]`; 7 matches the paper's 16 / 8 / 2. See Contradictions.

