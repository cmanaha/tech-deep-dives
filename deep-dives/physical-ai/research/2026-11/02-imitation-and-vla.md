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

## 2. Currency table

Newest first-party version found on 2026-11-20, against what the seed research named.

| Item | Newest version found | Release date | Source | What the seed named |
|---|---|---|---|---|
| LeRobot | v0.7.0 (28 policy packages; N1.5 support removed; `async_inference` removed) | 2026-11-05 | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 (GitHub releases API) | LeRobot, no version |
| openpi | no releases; default branch at SHA 215abfb217dbac7d5f1273282331b9b1866c0479; holds pi0, pi0-FAST, pi0.5 | last commit 2026-08-24; newest README update entry "Sept 2025" | https://github.com/Physical-Intelligence/openpi (GitHub API) | openpi, unpinned |
| pi line (papers) | pi0.7, arXiv 2604.15483v2 | v1 2026-04-16 | https://arxiv.org/abs/2604.15483v2 | pi0.7 (arXiv 2604.15483): confirmed |
| pi line (anything newer) | none named after pi0.7 as of a 2026-10-20 archive copy (wave 2); newest post is the Pi API beta, hosted training and inference, waitlist | 2026-10-13 | https://web.archive.org/web/20261031104522/https://www.pi.website/blog/api-beta | n/a |
| GR00T N1.x (open weights and code) | N1.7: tag `n1.7-release`, model `nvidia/GR00T-N1.7-3B`; repository default branch at SHA 708617f5716c63fc0a327391492ea2b91977ae90 (commit of 2026-11-17, an N1.7 fix). Newest tag by date is `n1.6.1-release` (2026-04-23), a maintenance tag for the older line | blog 2026-04-17; tag 2026-04-18 | https://huggingface.co/blog/nvidia/gr00t-n1-7 ; GitHub releases API for NVIDIA/Isaac-GR00T | N1.7 (April 2026): confirmed |
| GR00T 2 / GR00T 2 Turbo | project page and whitepaper only; "Code Available in December" | "November 2026" on the page (day not printed) | https://research.nvidia.com/labs/gear/gr00t-2/ | GR00T 2 and Turbo, 9 Nov 2026: existence confirmed, day not confirmed |
| SmolVLA | arXiv 2506.01844v1; `lerobot/smolvla_base`; no successor located | 2025-06-02 (paper); base checkpoint 2025-06-01 | https://arxiv.org/abs/2506.01844v1 ; Hugging Face model API | SmolVLA (June 2025) |
| ACT | arXiv 2304.13705v1 (history); LeRobot `act` policy at v0.7.0 | 2023-04-23 | https://arxiv.org/abs/2304.13705v1 | ACT |
| Diffusion Policy | arXiv 2303.04137v5 (history); LeRobot `diffusion` at v0.7.0 | v5 2024-03-14 | https://arxiv.org/abs/2303.04137v5 | named, not fetched |
| FAST tokenizer | arXiv 2501.09747v1; LeRobot `pi0_fast` at v0.7.0 | 2025-01-16 | https://arxiv.org/abs/2501.09747v1 | FAST |
| Real-time chunking | arXiv 2506.07339v2 (NeurIPS 2025); LeRobot `policies/rtc` at v0.7.0; training-time RTC used by pi0.7 | v1 2025-06-09 | https://arxiv.org/abs/2506.07339v2 | RTC (2506.07339) |
| OpenVLA / OpenVLA-OFT | OFT arXiv 2502.19645v2; no 2026 successor located (repos last pushed 2025-03-23 and 2025-09-09) | 2025-02-27 | https://arxiv.org/abs/2502.19645v2 ; GitHub API | OpenVLA-OFT |
| X-VLA | arXiv 2510.10274v1; LeRobot `xvla` at v0.7.0 | 2025-10-11 | https://arxiv.org/abs/2510.10274v1 | X-VLA |
| ScaleVLA | arXiv 2611.21607v1 | 2026-11-16 | https://arxiv.org/abs/2611.21607v1 | ScaleVLA (2611.21607): confirmed |
| DreamZero | arXiv 2602.15922v1, "World Action Models are Zero-shot Policies" (listing only; owned by the world-model stream) | 2026-02-17 | https://arxiv.org/abs/2602.15922v1 | DreamZero (2602.15922): confirmed |
| Gemini Robotics | Gemini Robotics 2.5 (VLA); before it Gemini Robotics 2, ER 2 and On-Device 2 | 2026-11-10; 2026-07-30 | https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/ | 2.5 (10 Nov 2026): confirmed |

## 3. Pinned sources

All accessed 2026-11-20. Papers were downloaded as PDF at the stated version and converted with `pdftotext`; two-column extraction interleaves lines, so every quote was re-read in context.

**Papers (arXiv ID with latest version; venue as confirmed)**

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 1011.0686v3 | Ross, Gordon, Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" (DAgger) | peer-reviewed, AISTATS 2011 (PDF first-page footer) | F02-1 to F02-4 |
| 2304.13705v1 | Zhao et al., "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware" (ACT) | preprint (venue not confirmed here) | F02-5 to F02-10 |
| 2303.04137v5 | Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion" | preprint (venue not confirmed here) | F02-14 to F02-16 |
| 2410.24164v4 | Black et al., "pi0: A Vision-Language-Action Flow Model for General Robot Control" | preprint | F02-18 to F02-23, F02-32 |
| 2501.09747v1 | Pertsch et al., "FAST: Efficient Action Tokenization for Vision-Language-Action Models" | preprint | F02-25 to F02-28 |
| 2506.07339v2 | Black, Galliker, Levine, "Real-Time Execution of Action Chunking Flow Policies" | peer-reviewed, NeurIPS 2025 (arXiv comments field); abstract only | F02-30 |
| 2503.14734v2 | NVIDIA, "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots" | preprint, first-party | F02-33, F02-34 |
| 2504.16054v1 | Physical Intelligence, "pi0.5: a Vision-Language-Action Model with Open-World Generalization" | preprint | F02-48, F02-49 |
| 2511.14759v2 | Physical Intelligence, "pi*0.6: a VLA That Learns From Experience" | preprint | F02-50 |
| 2604.15483v2 | Physical Intelligence, "pi0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities" | preprint | F02-51, F02-52 |
| 2506.01844v1 | Shukor et al., "SmolVLA: A Vision-Language-Action Model for Affordable and Efficient Robotics" | preprint, first-party (Hugging Face) | F02-58 to F02-61 |
| 2502.19645v2 | Kim, Finn, Liang, "Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success" (OpenVLA-OFT) | preprint | F02-68, F02-69 |
| 2510.10274v1 | Zheng et al., "X-VLA: Soft-Prompted Transformer as Scalable Cross-Embodiment Vision-Language-Action Model" | preprint | F02-70, F02-71 |
| 2611.21607v1 | "ScaleVLA: Scaling Vision-Language-Action Models to 552 Billion Parameters" | preprint | F02-72, F02-73 |
| 2503.20020v1 | Google DeepMind, "Gemini Robotics: Bringing AI into the Physical World" | preprint (technical report), first-party | F02-78 |
| 2602.15922v1, 2406.09246v3 | DreamZero; OpenVLA | listings checked for existence and version only | currency table |

**Code (tag and 40-character SHA)**

| Repository | Tag | SHA | Files read | Entries |
|---|---|---|---|---|
| huggingface/lerobot | v0.7.0 (2026-11-05) | 410c095eacc0011d998a73383eb94abed2715af0 | `src/lerobot/policies/` listing; `act/configuration_act.py`, `act/modeling_act.py`; `diffusion/configuration_diffusion.py`, `diffusion/modeling_diffusion.py`; `smolvla/configuration_smolvla.py`; `pi0/configuration_pi0.py`; `pi05/configuration_pi05.py`; `pi0_fast/configuration_pi0_fast.py`; `groot/configuration_groot.py`; `xvla/configuration_xvla.py`; `rtc/configuration_rtc.py`; `robots/so_follower/so_follower.py`; `docs/source/{act,smolvla,pi0,pi05,pi0fast,groot,xvla,il_robots,peft_training}.mdx`, `docs/source/_toctree.yml` | F02-11 to F02-13, F02-17, F02-29, F02-31, F02-47, F02-56, F02-57, F02-62, F02-63, F02-65 to F02-67, F02-80 to F02-83 |
| Physical-Intelligence/openpi | none (no releases; default branch) | 215abfb217dbac7d5f1273282331b9b1866c0479 | `README.md`, `src/openpi/models/pi0.py`, `src/openpi/models/pi0_config.py` | F02-23, F02-24, F02-53 to F02-55 |
| NVIDIA/Isaac-GR00T | none for this SHA (default branch, commit of 2026-11-17); `n1.7-release` tag is SHA 23ace64f17aa5015259b8609d371eb61a357c776 | 708617f5716c63fc0a327391492ea2b91977ae90 | `README.md`, `gr00t/configs/model/gr00t_n1d7.py`, `scripts/deployment/README.md`, `getting_started/hardware_recommendation.md`, `examples/SO100/README.md` | F02-38, F02-41 to F02-43 |

**Model cards and first-party pages**

- https://huggingface.co/nvidia/GR00T-N1.7-3B at revision 373d34e2723d928870157d07dc216a19a624b5bb (F02-37, F02-39, F02-40)
- https://huggingface.co/blog/nvidia/gr00t-n1-7 (F02-37)
- https://research.nvidia.com/labs/gear/gr00t-n1_5/ , https://research.nvidia.com/labs/gear/gr00t-n1_6/ , https://research.nvidia.com/labs/gear/gr00t-2/ (F02-35, F02-36, F02-44 to F02-46)
- Google DeepMind blog posts for Gemini Robotics On-Device, 1.5, 2 and 2.5 (F02-74 to F02-77, F02-79)

**Not fetchable on the research date:** `pi.website` and `physicalintelligence.company` (HTTP 429 and a bot checkpoint on every attempt). No Physical Intelligence blog post is cited in this file.

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
- Evidence: https://arxiv.org/abs/1011.0686v3 | Tier 3, peer-reviewed (AISTATS 2011) | definition | "Recent approaches (Ross and Bagnell, 2010) can guarantee an expected number of mistakes linear (or nearly so) in the task horizon T and error epsilon by training over several iterations and allowing the learner to influence the input states where expert demonstration is provided (through execution of its own controls in the system)." [Section 1] and, on what the paper wants in place of the quadratic bound, "Instead we would prefer approaches that can guarantee growth linear or near-linear in T and epsilon." (accessed 2026-11-20)
- Use in dive: section 4, one paragraph of history. `[our reading]` Modern robot imitation mostly takes the other road: shorten the effective horizon T with action chunks (F02-6) instead of querying the expert again. Human-intervention data collection (covered by the real-world RL stream) is the DAgger idea in today's clothes.

### B. Action chunking, temporal ensembling and ACT

**F02-5. ACT (Action Chunking with Transformers, 2023) is the paper that introduced action chunking for robot imitation in its modern form: the policy predicts the next k actions from one observation, which divides the effective horizon by k and so attacks the T^2 term directly.**
- Location: 2304.13705v1 (Zhao, Kumar, Levine, Finn, "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware"), Section IV-A "Action Chunking and Temporal Ensemble".
- Verdict: CARRIED (seed 01, re-fetched), teaching detail NEW. History: the paper that introduced the concept.
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint (venue not confirmed in the fetched PDF) | definition | "In our implementation, we fix the chunk size to be k: every k steps, the agent receives an observation, generates the next k actions, and executes the actions in sequence (Figure 5). This implies a k-fold reduction in the effective horizon of the task. Concretely, the policy models pi_theta(a_{t:t+k} | s_t) instead of pi_theta(a_t | s_t)." (accessed 2026-11-20)
- Use in dive: section 4, the definition of a chunk and the link back to F02-2: fewer decisions means fewer chances to compound.

**F02-6. ACT's chunk size is k = 100 actions at a 50 Hz control rate, that is 2 seconds of motion per forward pass. Its ablation moves success from 1% without chunking (k = 1) to 44% at k = 100, averaged over four settings.**
- Location: 2304.13705v1, Appendix Table III "Hyperparameters of ACT" (chunk size 100, beta 10, hidden dimension 512, feedforward dimension 3200, 4 encoder layers, 7 decoder layers, 8 heads, learning rate 1e-5, batch size 8, dropout 0.1); the hardware section ("Both the teleoperation and data recording happen at 50Hz."); the ablation subsection "Action Chunking and Temporal Ensembling".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | ablation (author reported) | "We observe that performance improves drastically from 1% at k = 1 to 44% at k = 100, then slightly tapers down with higher k. This illustrates that more chunking and a lower effective horizon generally improve performance." (accessed 2026-11-20)
- Use in dive: section 4, the strongest number for chunking: 1% to 44% `[author reported]`. 100 actions / 50 Hz = 2.0 s `[derived]`.

**F02-7. Temporal ensembling: query the policy every step so chunks overlap, then average all the predictions made for the current timestep with exponentially decaying weights w_i = exp(-m * i), where w_0 belongs to the oldest prediction. It trades one forward pass per chunk for one forward pass per step in return for smoother motion.**
- Location: 2304.13705v1, Section IV-A.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | definition | "To improve smoothness and avoid discrete switching between executing and observing, we query the policy at every timestep. This makes different action chunks overlap with each other ... Our temporal ensemble performs a weighted average over these predictions with an exponential weighting scheme w_i = exp(-m * i), where w_0 is the weight for the oldest action. The speed for incorporating new observation is governed by m, where a smaller m means faster incorporation." (accessed 2026-11-20)
- Use in dive: section 4. Compute consequence `[derived]`: at 50 Hz with k = 100, plain chunking needs 0.5 forward passes per second; temporal ensembling needs 50.

**F02-8. Why ACT has a CVAE (conditional variational autoencoder, a model trained to reconstruct its input through a small random "style" variable z): human demonstrations of the same task differ from one another, and a plain regressor averages them. The CVAE encoder sees the demonstrated action sequence during training and compresses "which way the human did it" into z; at test time the encoder is thrown away and z is set to zero.**
- Location: 2304.13705v1, Section IV (the subsection on modelling human data); Fig. 4 caption; ablation subsection "Training with CVAE".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | definition and ablation | "The CVAE encoder only serves to train the CVAE decoder (the policy) and is discarded at test time." and [Fig. 4 caption] "z is simply set to the mean of the prior (i.e. zero) at test time." and "the standard VAE objective which has two terms: a reconstruction loss and a term that regularizes the encoder to a Gaussian prior. Following [23], we weight the second term with a hyperparameter beta. Intuitively, higher beta will result in less information transmitted in z" and "Overall, we found the CVAE objective to be essential in learning precise tasks from human demonstrations." (accessed 2026-11-20)
- Use in dive: section 4. Loss as the paper writes it (Algorithm 1): L = L_reconst + beta * L_reg, where L_reconst is the L1 distance between predicted and demonstrated action chunks and L_reg is the KL divergence between the encoder's distribution over z and a standard Gaussian. The paper uses L1 "instead of the more common L2 loss: we noted that L1 loss leads to more precise modeling of the action sequence."

**F02-9. ACT's published cost: about 80M parameters, trained from scratch per task in about 5 hours on one 11 GB RTX 2080 Ti, with about 0.01 s per inference on the same machine.**
- Location: 2304.13705v1, Section IV-C "Implementing ACT".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | benchmark claim (author reported) | "The model has around 80M parameters, and we train from scratch for each task. The training takes around 5 hours on a single 11G RTX 2080 Ti GPU, and the inference time is around 0.01 seconds on the same machine." (accessed 2026-11-20)
- Use in dive: sections 4 and the compute table. 0.01 s per inference is about 100 forward passes per second `[derived]`, which is why ACT can afford temporal ensembling at 50 Hz.

**F02-10. ACT's data budget: 50 demonstrations per task, about 10 minutes of teleoperation, for 80 to 90% success on six real tasks.**
- Location: 2304.13705v1, Abstract and Section I.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2304.13705v1 | Tier 3, preprint | benchmark claim (author reported) | "80-90% success, from only 10 minutes or 50 demonstration trajectories." [Section I; the abstract reads "with only 10 minutes worth of demonstrations"] (accessed 2026-11-20)
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
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint (v5 dated 14 Mar 2024; venue not confirmed in the fetched PDF) | definition | "Expressing multimodal action distributions. By learning the gradient of the action score function ... and performing Stochastic Langevin Dynamics sampling on this gradient field, Diffusion policy can express arbitrary normalizable distributions ..., which includes multimodal action distributions, a well-known challenge for policy learning." (accessed 2026-11-20)
- Use in dive: section 4. Formulas as printed: the denoising step A_t^{k-1} = alpha * (A_t^k - gamma * eps_theta(O_t, A_t^k, k) + N(0, sigma^2 I)) and the training loss L = MSE(eps^k, eps_theta(O_t, A_t^0 + eps^k, k)). Symbols: A_t^k is the action sequence at denoising iteration k for control step t; O_t the observations; eps_theta the noise-prediction network; eps^k the random noise added for iteration k; alpha, gamma, sigma the noise-schedule constants. `[our reading]` Why mean-squared-error regression fails on multimodal data: if half the demonstrations pass the block to the left of an obstacle and half to the right, the MSE-optimal single output is the average, straight into the obstacle. The paper states the property; the left/right example is ours and must be labelled as an illustration.

**F02-15. Diffusion Policy executes in a receding horizon: from the last T_o observations it predicts T_p actions and executes only the first T_a before re-planning. The paper found T_a = 8 best for most tasks.**
- Location: 2303.04137v5, Section 3.2 "Closed-loop action-sequence prediction"; Section 5 key findings "The tradeoff in action horizon".
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint | definition and ablation (author reported) | "at time step t the policy takes the latest T_o steps of observation data O_t as input and predicts T_p steps of actions, of which T_a steps of actions are executed on the robot without re-planning. Here, we define T_o as the observation horizon, T_p as the action prediction horizon and T_a as the action execution horizon." and "having an action horizon greater than 1 helps the policy predict consistent actions and compensate for idle portions of the demonstration, but too long a horizon reduces performance due to slow reaction time. Our experiment confirms this trade-off (Fig. 5 left) and found the action horizon of 8 steps to be optimal for most tasks that we tested." (accessed 2026-11-20)
- Use in dive: section 4. Same idea as ACT's chunk with a different vocabulary: predict long, execute a prefix, re-plan. The table of names to give the reader: ACT `chunk_size` / `n_action_steps`; Diffusion Policy T_p / T_a; openpi `action_horizon`.

**F02-16. Diffusion Policy's denoising cost: 100 iterations in training; at inference 100 in simulation, cut to 16 (or 10) on real robots with DDIM (Denoising Diffusion Implicit Models, a sampler that skips steps), giving 0.1 s per inference on an NVIDIA 3080.**
- Location: 2303.04137v5, Section 3.4 "Accelerating inference for real-time control" and Appendix "Implementation details".
- Verdict: NEW (history; closes the seed's "Diffusion Policy numbers not fetched")
- Evidence: https://arxiv.org/abs/2303.04137v5 | Tier 3, preprint | benchmark claim (author reported) | "In our real-world experiments, using DDIM with 100 training iterations and 10 inference iterations enables 0.1s inference latency on a Nvidia 3080 GPU." and "On simulation benchmarks, we used the iDDPM algorithm ... with the same 100 denoising diffusion iterations for both training and inference. We used DDIM ... on realworld benchmarks to reduce the inference denoising iterations to 16 therefore reducing inference latency." (accessed 2026-11-20)
- Use in dive: section 4 and compute table. One "inference" here is 10 to 100 passes through the denoising network, against one pass for ACT: the cost of expressiveness.

**F02-17. LeRobot's Diffusion Policy at v0.7.0 defaults to `n_obs_steps = 2`, `horizon = 64`, `n_action_steps = 32`, a ResNet-18 vision backbone, a DDPM scheduler with `num_train_timesteps = 100`, and `num_inference_steps = None`, which the model resolves to the training value: 100 denoising passes per inference unless the user sets fewer.**
- Location: `src/lerobot/policies/diffusion/configuration_diffusion.py` lines 104 to 106, 122, 139 to 149; `modeling_diffusion.py` lines 247 to 250 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/diffusion/configuration_diffusion.py | Tier 1, code at tag v0.7.0 | code behaviour | "n_obs_steps: int = 2 / horizon: int = 64 / n_action_steps: int = 32" and "noise_scheduler_type: str = "DDPM" / num_train_timesteps: int = 100" and "num_inference_steps: int | None = None"; model: "if config.num_inference_steps is None: self.num_inference_steps = self.noise_scheduler.config.num_train_timesteps" (accessed 2026-11-20)
- Use in dive: section 4. At 30 Hz, executing 32 of 64 predicted actions means one inference every 32 / 30 = 1.07 s, and that inference is 100 U-Net passes `[derived]`. The paper's own values were T_p = 16, T_a = 8 (F02-15): LeRobot's current defaults are four times longer. Note the stale in-code comment "drop_n_last_frames: int = 7  # horizon - n_action_steps - n_obs_steps + 1": with the current defaults that expression is 64 - 32 - 2 + 1 = 31, not 7 `[derived]`; 7 matches the paper's 16 / 8 / 2. See Contradictions.

### D. Flow matching, tokenised actions, and the pointer to real-time chunking

**F02-18. pi0 (October 2024) is the paper that brought flow matching into a VLA: it models the distribution of an action chunk A_t = [a_t, ..., a_{t+H-1}] given an observation o_t made of 2 or 3 camera images, a language command and the joint angles, with H = 50.**
- Location: 2410.24164v4 (Black et al., "pi0: A Vision-Language-Action Flow Model for General Robot Control"), Section IV "The pi0 model".
- Verdict: CARRIED (seed 01, re-fetched; the seed cited an unversioned URL, latest version is v4). History: the introducing paper for VLA flow matching.
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | definition | "we want to model the data distribution p(A_t | o_t), where A_t = [a_t, a_{t+1}, ..., a_{t+H-1}] corresponds to an action chunk of future actions (we use H = 50 for our tasks), and o_t is an observation. The observation consists of multiple RGB images, a language command, and the robot's proprioceptive state, such that o_t = [I_t^1, ..., I_t^n, l_t, q_t], where I_t^i is ith image (with 2 or 3 images per robot), l_t is a sequence of language tokens, and q_t is a vector of joint angles." (accessed 2026-11-20)
- Use in dive: sections 4 and 5. This one sentence is also the cleanest definition of a VLA's inputs and outputs (F02-32).

**F02-19. Flow matching in the pi0 paper's own terms: blend the demonstrated chunk with noise, A^tau = tau * A + (1 - tau) * epsilon, and train the network v_theta to output the direction from noise to data, u = A - epsilon. The loss is the squared distance between the two.**
- Location: 2410.24164v4, Section IV.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | definition | "we supervise these action tokens using a conditional flow matching loss ..., L^tau(theta) = E_{p(A_t|o_t), q(A_t^tau|A_t)} || v_theta(A_t^tau, o_t) - u(A_t^tau | A_t) ||^2, where subscripts denote robot timesteps and superscripts denote flow matching timesteps, with tau in [0, 1]. ... In practice, the network is trained by sampling random noise epsilon ~ N(0, I), computing the "noisy actions" A_t^tau = tau * A_t + (1 - tau) * epsilon, and then training the network outputs v_theta(A_t^tau, o_t) to match the denoising vector field u(A_t^tau | A_t) = A_t - epsilon." (accessed 2026-11-20)
- Use in dive: section 4, the formula block. Symbols: A_t the demonstrated chunk at robot step t; epsilon Gaussian noise of the same shape; tau the flow time in [0, 1] (0 is pure noise, 1 is the clean chunk, in the paper's convention); A_t^tau the blend; v_theta the network's predicted velocity; u the true velocity. Decomposition: the blend is a straight line from noise to data, and its derivative with respect to tau is A - epsilon, so the network learns one constant direction per (noise, data) pair.

**F02-20. At inference pi0 starts from noise and takes 10 forward Euler steps of size 0.1 along the learned velocity field; the observation is encoded once and its attention keys and values are cached, so each step only re-runs the action tokens.**
- Location: 2410.24164v4, Section IV (integration rule) and Appendix D.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | definition | "At inference time, we generate actions by integrating the learned vector field from tau = 0 to tau = 1, starting with random noise A_t^0 ~ N(0, I). We use the forward Euler integration rule: A_t^{tau + delta} = A_t^tau + delta * v_theta(A_t^tau, o_t), where delta is the integration step size. We use 10 integration steps (corresponding to delta = 0.1) in our experiments. Note that inference can be implemented efficiently by caching the attention keys and values for the prefix o_t and only recomputing the suffix corresponding to the action tokens for each integration step." (accessed 2026-11-20)
- Use in dive: section 4. 10 steps against Diffusion Policy's 100 training iterations (F02-16) is the practical argument for flow matching `[our reading]`.

**F02-21. pi0 timing on an RTX 4090 with 3 cameras: image encoders 14 ms, observation forward pass 32 ms, ten action passes 27 ms, total 73 ms on-board, 86 ms with 13 ms of network latency when the GPU is off the robot.**
- Location: 2410.24164v4, Appendix D, Table I.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | benchmark claim (author reported) | Table I rows: "image encoders 14 ms / observation forward pass 32 ms / x10 action forward pass (flow) 27 ms / network latency (if off-board) 13 ms / total on-board inference 73 ms / total off-board inference 86 ms"; text: "The operations were timed on an NVIDIA GeForce RTX 4090 consumer-grade GPU. For the mobile robot, inference was done off-board over a Wi-Fi connection, adding a small amount of network latency." (accessed 2026-11-20)
- Use in dive: sections 4 and 5 and compute table. The breakdown teaches where the time goes: 46 of 73 ms (63%) is seeing and reading (vision encoders plus VLM prefix), 27 ms (37%) is the ten action steps, 2.7 ms each `[derived]`.

**F02-22. pi0 tried ACT's temporal ensembling and dropped it: chunks are executed open-loop, with a new inference every 0.8 s on 20 Hz robots (after 16 actions) and every 0.5 s on 50 Hz robots (after 25 actions).**
- Location: 2410.24164v4, Appendix D.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | production report (author reported) | "We tried temporal ensembling [57] early on and found that it hurt policy performance, so we opted not to aggregate actions and instead execute action chunks open-loop. For the 20Hz UR5e and Franka robots, we run inference every 0.8 seconds (after executing 16 actions), and for all other robots, which run at 50Hz, we run inference every 0.5 seconds (after executing 25 actions)." (accessed 2026-11-20)
- Use in dive: section 4, a "what the field kept and what it dropped" note: chunking survived from ACT, temporal ensembling did not survive into the pi0 line.

**F02-23. pi0's action and state vectors are padded to the largest robot in the training set (18 dimensions in the paper); the open code pads to 32. A 6-dimensional SO-101 action therefore occupies 6 of 32 slots and the rest are zeros.**
- Location: 2410.24164v4, Section V-A; openpi `src/openpi/models/pi0_config.py` lines 25 to 26 at SHA 215abfb.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | definition | "The configuration vector q_t and action vectors a_t always have the dimensionality of the largest robot in the dataset (18 in our case, to accommodate two 6-DoF arms, 2 grippers, a mobile base, and a vertically actuated torso). For robots with lower-dimensional configuration and action spaces, we zero-pad the configuration and action vectors." Code: https://github.com/Physical-Intelligence/openpi/blob/215abfb217dbac7d5f1273282331b9b1866c0479/src/openpi/models/pi0_config.py | Tier 1, code at pinned SHA | "action_dim: int = 32 / action_horizon: int = 50" (accessed 2026-11-20)
- Use in dive: sections 4 and 5: how one model drives many robot bodies (cross-embodiment). The paper says 18, the released code says 32: see Contradictions.

**F02-24. openpi's current code (default branch at SHA 215abfb, last commit 2026-08-24) implements exactly the paper's recipe: sample time from a Beta(1.5, 1) distribution, blend noise and actions, regress the velocity with a mean-squared error, and sample with `num_steps = 10` Euler steps. Its time axis runs the opposite way to the paper (t = 1 is noise).**
- Location: `src/openpi/models/pi0.py` lines 188 to 214 (`compute_loss`) and 217 to 279 (`sample_actions`) at SHA 215abfb217dbac7d5f1273282331b9b1866c0479.
- Verdict: NEW
- Evidence: https://github.com/Physical-Intelligence/openpi/blob/215abfb217dbac7d5f1273282331b9b1866c0479/src/openpi/models/pi0.py | Tier 1, code at pinned SHA | code behaviour | "time = jax.random.beta(time_rng, 1.5, 1, batch_shape) * 0.999 + 0.001 / ... / x_t = time_expanded * noise + (1 - time_expanded) * actions / u_t = noise - actions" and "return jnp.mean(jnp.square(v_t - u_t), axis=-1)" and "num_steps: int | at.Int[at.Array, ""] = 10" and "# note that we use the convention more common in diffusion literature, where t=1 is noise and t=0 is the target distribution. yes, this is the opposite of the pi0 paper, and I'm sorry." (accessed 2026-11-20)
- Use in dive: section 4, the code block for flow matching: six lines carry the whole method. Tensor shapes for the worked example: noise is `(batch_size, action_horizon, action_dim)` = (1, 50, 32).

**F02-25. Tokenised actions are the alternative to a continuous head: turn the chunk into discrete tokens and let the language model predict them one by one. The naive scheme (one of 256 bins per joint per timestep) produces hundreds of tokens per chunk and learns badly at high control rates, because each next token carries almost no new information when the signal is smooth.**
- Location: 2501.09747v1 (Pertsch et al., "FAST: Efficient Action Tokenization for Vision-Language-Action Models"), Sections III and IV.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2501.09747v1 | Tier 3, preprint | definition | "For high-frequency robot data, this tokenization scheme is sub-optimal: it can easily produce hundreds of tokens per action chunk, which make training challenging and lead to slow inference." and "when using the naive per-timestep tokenization scheme, this marginal information approaches zero as the control frequency of the training signal increases: for smooth signals, as timesteps get shorter the change per timestep decreases proportionally." (accessed 2026-11-20)
- Use in dive: section 4. Worked count `[derived]`: a 6-dimensional SO-101 action times a 50-step chunk is 300 tokens under binning.

**F02-26. FAST (Frequency-space Action Sequence Tokenization) compresses the chunk before tokenising: apply the discrete cosine transform (DCT, which rewrites a signal as a sum of cosines so a smooth motion needs only a few low-frequency coefficients) to each action dimension, quantise the coefficients, then compress the result with byte-pair encoding (BPE, the same merge-frequent-pairs compressor used for text tokenisers). The result is about 30 tokens per chunk per arm.**
- Location: 2501.09747v1, Section V, Fig. 4 caption; Section VI (token counts).
- Verdict: CARRIED (seed 01, re-fetched), mechanism NEW
- Evidence: https://arxiv.org/abs/2501.09747v1 | Tier 3, preprint | definition and benchmark claim (author reported) | "Given a normalized chunk of actions, we apply discrete cosine transform (DCT) to convert the signal to the frequency domain. We then quantize the DCT coefficients and use byte-pair encoding (BPE) to compress the flattened sequence of per-dimension DCT coefficients into the final action token sequence." and "FAST consistently generates roughly 30 action tokens per chunk per robot arm (i.e., 60 tokens for the bi-manual setup) in each of the domains." (accessed 2026-11-20)
- Use in dive: section 4. 300 naive tokens against about 30 FAST tokens for one arm is a 10x compression `[derived, from F02-25's count and this quote]`.

**F02-27. The trade FAST makes: about 5x fewer training GPU-hours than flow-matching pi0, but about 750 ms per chunk at inference against under 100 ms, because 30 to 60 tokens must be decoded one at a time through the full 2B language model instead of 10 passes through a 300M action expert.**
- Location: 2501.09747v1, Section VI-E and Section VII (limitations).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2501.09747v1 | Tier 3, preprint | benchmark claim (author reported) | "while pi0 with diffusion typically predicts one second action chunks within 100ms on an NVIDIA 4090 GPU, the pi0 model with FAST tokenization needs approximately 750ms of inference time per chunk, since it must perform more autoregressive decoding steps (typically 30-60 action tokens need to be decoded, vs. 10 diffusion steps for diffusion pi0) and use the full 2B parameter language model backbone for autoregressive decoding (vs. a 300M parameter "action expert" for diffusion pi0)." and "the model in the evaluations above required 5x fewer GPU hours for training than the pi0 model" (accessed 2026-11-20)
- Use in dive: sections 4 and 5, the training-cost against inference-cost trade, with both numbers from one source.

**F02-28. One published pi0-FAST training run: three epochs over DROID, 240k iterations at batch size 256, about 4 days on 8 H100 GPUs for a 3B-parameter VLA.**
- Location: 2501.09747v1, Appendix (DROID training details).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2501.09747v1 | Tier 3, preprint | benchmark claim (author reported) | "We train policies for three epochs (240k iterations @ 256 batch size), which takes approximately 4 days on 8xH100 GPUs for the 3B parameter VLAs we are using." (accessed 2026-11-20)
- Use in dive: compute table. 8 GPUs x 96 h = 768 H100-hours `[derived]`. This is the only GPU-count-and-days figure Physical Intelligence has published for training a model of the pi0 family, as far as this research located.

**F02-29. LeRobot v0.7.0 ships pi0-FAST with a 256-token cap on the action sequence and a key-value cache on by default, and ships both families (flow and FAST) with the same 50-step chunk and 32-dimensional padding.**
- Location: `src/lerobot/policies/pi0_fast/configuration_pi0_fast.py` lines 37 to 43, 65 to 74; `pi0/configuration_pi0.py` lines 38 to 46 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi0_fast/configuration_pi0_fast.py | Tier 1, code at tag v0.7.0 | code behaviour | "chunk_size: int = 50  # Number of action steps to predict, in openpi called "action_horizon"" and "max_action_dim: int = 32 / max_action_tokens: int = 256" and "action_tokenizer_name: str = "lerobot/fast-action-tokenizer" / temperature: float = 0.0 / max_decoding_steps: int = 256" and "use_kv_cache: bool = True"; pi0 config: "num_inference_steps: int = 10  # Number of denoising steps during inference" (accessed 2026-11-20)
- Use in dive: section 4, the names the reader will type. The vocabulary bridge is in the code comment itself: LeRobot `chunk_size` is openpi `action_horizon`.

**F02-30. Pointer only (stream 07 owns it): real-time chunking (RTC) lets a slow model start computing the next chunk while the current one is still executing, by freezing the actions that will certainly run before the new chunk arrives and "inpainting" the rest so the two chunks join smoothly. It needs no retraining for diffusion or flow policies.**
- Location: arXiv 2506.07339 abstract (Black, Galliker, Levine, "Real-Time Execution of Action Chunking Flow Policies"); two versions listed, v2 latest.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025, per the arXiv comments field "published in NeurIPS 2025") | definition | "Our method, real-time chunking (RTC), is applicable to any diffusion- or flow-based VLA out of the box with no re-training. It generates the next action chunk while executing the current one, "freezing" actions guaranteed to execute and "inpainting" the rest." (accessed 2026-11-20; abstract read, full text not read in this stream)
- Use in dive: section 4 or 5, one forward pointer to the inference section.

**F02-31. RTC is a first-class module in LeRobot v0.7.0: a `policies/rtc` package, an `rtc_config` field on the pi0, pi0.5, pi0-FAST and SmolVLA configs, and a training-time variant for pi0.5 (`rtc_training_max_delay`).**
- Location: `src/lerobot/policies/rtc/configuration_rtc.py` lines 66 to 76; `pi05/configuration_pi05.py` lines 76 to 79; `smolvla/configuration_smolvla.py` lines 104 to 105 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi05/configuration_pi05.py | Tier 1, code at tag v0.7.0 | documentation of support | "# Real-Time Chunking (RTC) configuration / rtc_config: RTCConfig | None = None / # Maximum clean action-prefix length sampled during training. Zero disables trained RTC. / rtc_training_max_delay: int = 0"; RTC config defaults "max_guidance_weight: float = 10.0 / execution_horizon: int = 10" (accessed 2026-11-20)
- Use in dive: pointer for stream 07; tells the section 5 writer the feature is in the toolchain the reader will use, off by default.

### E. What a VLA is, and the fast and slow system split

**F02-32. A VLA is a vision-language model (VLM, a model pretrained on images and text from the web) extended with robot inputs and outputs: proprioceptive state (the robot's own joint readings) goes in beside images and text, and an action chunk comes out through an added "action expert". In pi0 the VLM is PaliGemma (3B parameters) and the action expert adds 300M parameters trained from scratch, 3.3B in total.**
- Location: 2410.24164v4, Section IV.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2410.24164v4 | Tier 3, preprint | definition | "We further augment this backbone with robotics-specific inputs and outputs - namely, proprioceptive state and robot actions." and "in practice we use PaliGemma [5] as our base model. PaliGemma is an open-source 3 billion parameter VLM that offers a convenient tradeoff between size and performance. We add 300M parameters for the action expert (which is initialized from scratch) for a total of 3.3 billion parameters." (accessed 2026-11-20)
- Use in dive: section 5, the opening definition. Pair with F02-18 for the input list (2 or 3 images, a language command, joint angles) and the output (H = 50 actions).

**F02-33. The fast and slow split, as GR00T N1 (March 2025) named it: "System 2" is the VLM, which reads the scene and the instruction at 10 Hz on an NVIDIA L40; "System 1" is a diffusion transformer (DiT) trained with flow matching, which turns the VLM's output tokens plus robot state into motor actions at 120 Hz. The names come from Kahneman's "Thinking, Fast and Slow".**
- Location: 2503.14734v2 (NVIDIA, "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots"), Section 1.
- Verdict: CARRIED (seed 01, re-fetched; latest version is v2)
- Evidence: https://arxiv.org/abs/2503.14734v2 | Tier 3, preprint, first-party lab | definition and vendor claim | "It adopts a dual-system compositional architecture, inspired by human cognitive processing (Kahneman, 2011). The System 2 reasoning module is a pre-trained Vision-Language Model (VLM) that runs at 10Hz on an NVIDIA L40 GPU. ... Subsequently, a Diffusion Transformer, trained with action flow-matching, serves as the System 1 action module. It cross-attends to the VLM output tokens and employs embodiment-specific encoders and decoders to handle variable state and action dimensions for motion generation. It generates closed-loop motor actions at a higher frequency (120Hz)." (accessed 2026-11-20)
- Use in dive: section 5, the System 1 / System 2 definition with rates and device. `[our reading]` "120 Hz" is the rate at which actions come out, not the rate at which the network runs: one sampling of a 16-action chunk takes 63.9 ms (F02-34), which is about 15.6 samplings per second or 250 actions per second of capacity `[derived: 1000 / 63.9 = 15.6; 15.6 x 16 = 250]`.

**F02-34. GR00T N1's published size and cost: 2.2B parameters (1.34B in the VLM), a 16-action chunk, 4 denoising steps, 63.9 ms per chunk on an L40 in bf16, and roughly 50,000 H100 GPU-hours of pretraining on up to 1,024 GPUs.**
- Location: 2503.14734v2, Section 2 (model), Section 2.1 ("K = 4 inference steps"), Section 3 "Training Infrastructure".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2503.14734v2 | Tier 3, preprint, first-party lab | benchmark claim (vendor reported) | "our publicly released GR00T-N1-2B model has 2.2B parameters in total, with 1.34B in the VLM. The inference time for sampling a chunk of 16 actions is 63.9ms on an L40 GPU using bf16." and "We use up to 1024 GPUs for a single model. GR00T-N1-2B used roughly 50,000 H100 GPU hours for pretraining. Compute-constrained finetuning was tested in the context of a single A6000 GPU. If only tuning the adapter layers (action and state encoders + action decoder) and DiT, a batch size up to 200 can be used. When tuning the vision encoder, a batch size of up to 16 can be used." and "we found K = 4 inference steps to work well across all embodiments." (accessed 2026-11-20)
- Use in dive: section 5 and compute table. Still the only GR00T release with a stated GPU-hour total.

**F02-35. GR00T N1.5 (2025) froze the VLM in both pretraining and fine-tuning and was pretrained for 250K steps on 1K H100 GPUs at global batch size 16,384.**
- Location: NVIDIA GEAR project page "GR00T N1.5", sections "Architecture" and "Training".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://research.nvidia.com/labs/gear/gr00t-n1_5/ | Tier 2, first-party lab page | vendor claim | "The VLM model is frozen during both pretraining and finetuning." and "We trained GR00T N1.5 for 250K steps on 1K H100 GPUs with global batch size 16384." (accessed 2026-11-20)
- Use in dive: section 5 lineage table. Wall-clock time and GPU-hours are not on the page (U4).

**F02-36. GR00T N1.6 (December 2025) moved to an internal Cosmos-2B VLM, doubled the DiT to 32 layers, unfroze the top 4 VLM layers in pretraining, and was pretrained for 300K steps at global batch size 16,384. Post-training is typically 10K to 30K steps at batch size 1K or less.**
- Location: NVIDIA GEAR project page "GR00T N1.6", sections "Model and Data Improvements" and "Experiments".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://research.nvidia.com/labs/gear/gr00t-n1_6/ | Tier 2, first-party lab page | vendor claim | "Base VLM: We use an internal NVIDIA Cosmos-2B VLM variant." and "Uses 2x larger DiT (32 layers vs 16 layers in N1.5). Removes N1.5's post-VLM 4-layer transformer adapter. Instead, we unfreeze the top 4 layers of the VLM during pretraining." and "GR00T N1.6 was pretrained for 300K steps with global batch size 16384. In the following robot experiments, we further post-train on small task-specific datasets; typically 10K-30K steps with global batch size 1K or less." (accessed 2026-11-20)
- Use in dive: section 5 lineage table. GPU type and count are not on the page.

**F02-37. GR00T N1.7 (blog 17 April 2026; GitHub release tag `n1.7-release` 18 April 2026) is the newest GR00T with released weights and code as of 2026-11-20: a 3B-parameter VLA with Cosmos-Reason2-2B (Qwen3-VL architecture) as System 2 and a flow-matching DiT as System 1, pretrained with 20,854 hours of human egocentric video.**
- Location: Hugging Face blog "NVIDIA Isaac GR00T N1.7: Open Reasoning VLA Model for Humanoid Robots" (Published April 17, 2026); Isaac-GR00T README at SHA 708617f, "What's New in GR00T N1.7".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://huggingface.co/blog/nvidia/gr00t-n1-7 | Tier 2, first-party vendor blog | definition and vendor claim | "GR00T N1.7 is a 3B-parameter open reasoning Vision-Language-Action (VLA) model that maps visual observations and natural language instructions to continuous robot actions. It uses an Action Cascade architecture - a dual-system design that separates high-level reasoning from low-level motor control" and "System 1 (Diffusion Transformer): A 32-layer DiT takes the VLM's output and live robot state, then denoises them into precise motor commands in real time." and "pre-training on 20,854 hours of human egocentric video spanning 20+ task categories" (accessed 2026-11-20)
- Use in dive: section 5, the current open GR00T. The Hugging Face model record reports 3,144,016,000 parameters in the safetensors file (https://huggingface.co/nvidia/GR00T-N1.7-3B at revision 373d34e2723d928870157d07dc216a19a624b5bb, API field `safetensors.total`); the model card text rounds to "3,000,000,000".

**F02-38. The N1.7 code and the N1.7 blog disagree on the action head's depth. The repository's model config sets `"num_layers": 16` and the README says the head "changes from `32` to `16` diffusion layers"; the blog says "A 32-layer DiT"; the repository's own deployment benchmark describes the LIBERO checkpoint as "32 DiT blocks". The code also sets `action_horizon = 40`, `max_action_dim = 132`, 4 inference timesteps, and a fully frozen VLM by default.**
- Location: `gr00t/configs/model/gr00t_n1d7.py` lines 40 to 47, 74 to 76, 104, 116; README "Detailed changes from N1.6"; `scripts/deployment/README.md` "Benchmark Results", all at SHA 708617f5716c63fc0a327391492ea2b91977ae90.
- Verdict: WRONG for the seed's unqualified "32-layer DiT" (seed 01 section 2.4 took it from the blog; the code default is 16). See Contradictions.
- Wave 2 (2026-11-20, SCOPE NARROWER; closes U1): The released `nvidia/GR00T-N1.7-3B` checkpoint has a 32-layer DiT action head (`diffusion_model_cfg.num_layers: 32` in its `config.json` at revision 373d34e2723d928870157d07dc216a19a624b5bb), matching the blog and the deployment benchmark. The repository's dataclass default is 16, and the README's change from 32 to 16 describes that default, not the shipped weights. The 16 that describes the shipped model is `select_layer: 16`, the VLM layer whose features feed the head. The checkpoint config records `tune_llm: true` and `tune_visual: true` (how it was pretrained); a frozen VLM is the repository's fine-tuning default, not a property of the checkpoint.
- Evidence: https://github.com/NVIDIA/Isaac-GR00T/blob/708617f5716c63fc0a327391492ea2b91977ae90/gr00t/configs/model/gr00t_n1d7.py | Tier 1, code at pinned SHA | code behaviour | "model_name: str = "nvidia/Cosmos-Reason2-2B"" and "tune_top_llm_layers: int = 0" and "max_state_dim: int = 132 / max_action_dim: int = 132 / action_horizon: int = 40" and ""num_layers": 16," and "num_inference_timesteps: int = 4"; README: "State and action dimensions expanded from `29` to `132`, and `action_horizon` expanded from `16` to `40`." and "Action head remains flow-matching DiT, but changes from `32` to `16` diffusion layers and adds newer N1.7 behavior options." (accessed 2026-11-20)
- Use in dive: section 5. State the chunk (40 actions) and denoising steps (4) from code; do not print a DiT layer count without the caveat. `[our reading]` The config also has `use_alternate_vl_dit: bool = True` with `attend_text_every_n_blocks: int = 2`, so "16 layers" and "32 blocks" may count the same stack two ways; this was not resolved (U1).

**F02-39. N1.7's pretraining compute is disclosed in its model card's energy estimate: 64 GB200 nodes with 4 GPUs each for 120 hours.**
- Location: Hugging Face model card `nvidia/GR00T-N1.7-3B`, section "Computational Load", at revision 373d34e.
- Verdict: NEW (the seed recorded N1.7 training compute as "not published")
- Evidence: https://huggingface.co/nvidia/GR00T-N1.7-3B/blob/373d34e2723d928870157d07dc216a19a624b5bb/README.md | Tier 1, first-party model card | vendor claim | "Estimated Energy and Emissions for Model Training: ... Total kWh: 64 GB200 nodes * 4 gpus per node x 1200W x 0.001 x 0.8 x 120 hours * 1.4 = 41288 kWh" (accessed 2026-11-20)
- Use in dive: compute table. 64 x 4 = 256 GPUs; 256 x 120 h = 30,720 GB200 GPU-hours `[derived]`. Caveat to print with it: the line is an energy estimate in a section headed "Internal Only: For NVIDIA Models Only", it does not say whether 120 hours is one run or the cumulative total, and it is the only place the figure appears.

**F02-40. N1.7 inference, from the model card's per-stage table (4 denoising steps, 1 camera): on an H100, TensorRT full pipeline, 6.2 ms data processing + 8.8 ms backbone + 12.3 ms action head = 27.9 ms end to end (35.9 Hz); on a Jetson AGX Thor, 8.21 + 28.89 + 56.64 = 93.8 ms (10.7 Hz); on a DGX Spark 98.6 ms (10.1 Hz); on a Jetson Orin 216.5 ms (4.6 Hz).**
- Location: model card `nvidia/GR00T-N1.7-3B`, "System Requirements and Performance", table "GR00T N1.7 Inference Timing (4 denoising steps, 1 camera)".
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): Two fixes. (1) The H100 stage timings 6.2, 8.8 and 12.3 ms sum to 27.3 ms [derived]; the card's end-to-end column prints 27.9 ms. Write the stages and the printed total separately, with no equals sign. (2) The Jetson Orin figure of 216.5 ms (4.6 Hz) is a different build: TensorRT on the action head only, "because TRT 10.3 does not support the backbone engine". The table states no numeric precision.
- Evidence: https://huggingface.co/nvidia/GR00T-N1.7-3B/blob/373d34e2723d928870157d07dc216a19a624b5bb/README.md | Tier 1, first-party model card | benchmark claim (vendor reported) | "| H100 80GB HBM3 | PyTorch Eager | 6.2 ms | 31.3 ms | 48.2 ms | 85.8 ms | 11.7 Hz | 1.00x |" and "| | **TensorRT (Full Pipeline)** | **6.2 ms** | **8.8 ms** | **12.3 ms** | **27.9 ms** | **35.9 Hz** | **3.08x** |" and "| AGX Thor | PyTorch Eager | 8.21 ms | 55.26 ms | 81.65 ms | 144.9 ms | 6.9 Hz | 1.00x |" and "| | **TensorRT (Full Pipeline)** | **8.21 ms** | **28.89 ms** | **56.64 ms** | **93.8 ms** | **10.7 Hz** | **1.54x** |" (accessed 2026-11-20)
- Use in dive: section 5 and compute table. The table shows the System 2 / System 1 cost split directly: in eager PyTorch on an H100 the "fast" action head (48.2 ms for 4 denoising steps) costs more than the "slow" backbone (31.3 ms) `[vendor claim]`. Both run once per chunk in this code path.

**F02-41. The repository at its newest commit (17 Nov 2026) publishes a second, faster set of N1.7 numbers for a different workload (LIBERO checkpoint, action horizon 40, two 256x256 cameras): H100 22.9 ms and Jetson AGX Thor 76.8 ms with the TensorRT full pipeline, and 35.6 ms on Thor with "TensorRT optimized + mixed NVFP4". The README headline "~28 Hz on Jetson AGX Thor" corresponds to that last cell.**
- Location: `scripts/deployment/README.md` "Benchmark Results"; README line 72, at SHA 708617f5716c63fc0a327391492ea2b91977ae90.
- Verdict: CARRIED (seed 01, re-fetched) with a correction of scope: the seed's "~28 Hz on Thor with TensorRT" holds only for the NVFP4-quantised build.
- Evidence: https://github.com/NVIDIA/Isaac-GR00T/blob/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party docs at pinned SHA | benchmark claim (vendor reported) | "Median complete-policy-call latency for the `nvidia/GR00T-N1.7-LIBERO` `libero_10` checkpoint (32 DiT blocks): batch size 1, action horizon 40, four denoising steps, and two 256x256 camera inputs. Timings include preprocessing and action decoding, excluding RPC." and "| AGX Thor (MAXN) | 106.8 | 100.5 | 76.8 | 35.6 |" and "| H100 80GB HBM3 | 101.5 | 53.4 | 22.9 | - |" and "| DGX Spark | 200.8 | 183.1 | 116.6 | - |"; README: "GR00T N1.7 runs at ~40 Hz on NVIDIA RTX PRO 6000 Blackwell Server Edition and ~28 Hz on Jetson AGX Thor with TensorRT." (accessed 2026-11-20)
- Use in dive: section 5 and the edge inference discussion. 1000 / 35.6 = 28.1 Hz; 1000 / 76.8 = 13.0 Hz `[derived]`. Three first-party Thor figures exist (10.7 Hz, 12.4 Hz, ~28 Hz); the dive must name the build with any number it prints. See Contradictions.

**F02-42. Fine-tuning N1.7: one GPU with 40 GB or more of memory; the default recipe trains the projector and the diffusion action head with the VLM frozen and stays under about 35 GB per GPU. Inference needs 16 GB. Measured single-GPU training throughput: 192.57 samples/s on an H100, 56.42 on an L40, 131.33 on an RTX Pro 6000 Blackwell.**
- Location: README "Hardware" and "N1.7 Single-GPU Training Performance"; `getting_started/hardware_recommendation.md`, at SHA 708617f.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://github.com/NVIDIA/Isaac-GR00T/blob/708617f5716c63fc0a327391492ea2b91977ae90/getting_started/hardware_recommendation.md | Tier 1, first-party docs at pinned SHA | documentation of support and vendor claim | "**Minimum:** 1 GPU with 40 GB+ VRAM. GR00T N1.7 is a ~3B parameter model (bfloat16)." and "**Default fine-tuning** tunes the projector + diffusion action head (not the full LLM backbone), keeping peak VRAM under ~35 GB per GPU." and "**Enabling `--tune-llm` or `--tune-visual`** significantly increases VRAM - 80 GB+ per GPU recommended."; README table: "| H100 80GB HBM3 | 1 | 115.5 | 409 | 2123.9 | 192.57 |" and "| L40 | 1 | 190.5 | 213 | 3775.5 | 56.42 |" (accessed 2026-11-20)
- Use in dive: section 5 and the SO-101 fine-tune cost. A 24 GB consumer GPU is below NVIDIA's stated minimum for N1.7 fine-tuning.

**F02-43. NVIDIA's own repository documents fine-tuning N1.7 for the SO-100 and SO-101: the guide is titled "Finetuning Models for the SO100/SO101 Robot", the base model is `nvidia/GR00T-N1.7-3B` with the `NEW_EMBODIMENT` tag, the README example uses `--max-steps 2000 --global-batch-size 32`, and the walkthrough evaluates `checkpoint-10000`. No wall-clock time is stated.**
- Location: `examples/SO100/README.md`; README "Fine-tune" section lines 470 to 500, at SHA 708617f.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Isaac-GR00T/blob/708617f5716c63fc0a327391492ea2b91977ae90/examples/SO100/README.md | Tier 1, first-party docs at pinned SHA | documentation of support | "This guide shows how to finetune a dataset collected from the [SO101](https://huggingface.co/docs/lerobot/en/so101) robot, and evaluate the model on the real robot." and "CUDA_VISIBLE_DEVICES=0 NUM_GPUS=1 uv run bash examples/finetune.sh --base-model-path nvidia/GR00T-N1.7-3B ... --embodiment-tag NEW_EMBODIMENT" and "--model-path /tmp/so100_finetune/checkpoint-10000" (accessed 2026-11-20)
- Use in dive: section 5, "can I fine-tune this for my arm": yes, first-party path exists. Estimated time `[derived, illustration only]`: 2,000 steps x 32 samples = 64,000 samples; at 192.57 samples/s on an H100 that is about 5.5 minutes of pure step time, at 56.42 samples/s on an L40 about 19 minutes; data loading, checkpointing and the longer 10,000-step walkthrough (about 28 and 95 minutes by the same arithmetic) are not included, and the throughput table was measured at maximum batch, not batch 32.

**F02-44. GR00T 2 (NVIDIA GEAR project page dated November 2026) is a different kind of model from the N1 line: a world-action model, where one diffusion transformer denoises future video and the action chunk together. Its code is not out ("Code Available in December"), and the page links a whitepaper PDF, not an arXiv paper.**
- Location: https://research.nvidia.com/labs/gear/gr00t-2/ , header and "Model Architecture".
- Verdict: CARRIED (seed 01, re-fetched). The seed's "9 Nov 2026" date is not printed on the page, which says only "November 2026" (U2).
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/ | Tier 2, first-party lab page | definition | "We introduce GR00T 2, a new generation of foundation world-action models (WAMs). GR00T 2 predicts future video and robot actions together, learning how physical interactions unfold along with the actions that produce them." and "One diffusion transformer denoises future video and robot actions together. ... GR00T 2 reads recent video, the instruction and the robot state, denoises future video and an action chunk together, executes the chunk, and repeats." and "Code Available in December" (accessed 2026-11-20)
- Use in dive: section 5, where the VLA story hands over to the world-model sections. For an SO-101 owner today, GR00T 2 is not usable: no weights, no code.

**F02-45. GR00T 2 Turbo is the on-robot variant: a 2B-parameter joint video-action transformer with a more compressive video encoder. One prediction takes 38 ms on an RTX 5090 and 124 ms on a Jetson Thor; it plans 1.6 s chunks about once per second and a separate whole-body controller (SONIC) executes them at 50 Hz. The reasoning model ("System 2") sits outside and calls GR00T 2 as a tool.**
- Location: GR00T 2 project page, sections "GR00T 2 Turbo: Efficient World-Action Modeling", "Think Slow, Move Fast", "Agentic Control".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/ | Tier 2, first-party lab page | vendor claim | "GR00T 2 Turbo lowers the cost of world-action modeling in two ways: a smaller joint video-action transformer (2B parameters) and a higher-compression video encoder that exploits redundancy in video." and "Optimized, a Turbo prediction for G1 takes 38 ms on an RTX 5090 and 124 ms onboard Jetson Thor, where it plans 1.6 s chunks of whole-body motion tokens about once per second; SONIC executes them at 50 Hz." and "A reasoning model chooses the task; GR00T 2 Turbo imagines and plans; SONIC turns latent whole-body tokens into joint targets. Everything but the reasoning model runs onboard." and "The agent runs as System 2 (S2). In an observe-reason-act-verify loop, it calls GR00T 2 as a tool" (accessed 2026-11-20)
- Use in dive: section 5, the three-rate stack in November 2026: a reasoning model off the robot, a chunk planner at about 1 Hz on a Jetson Thor, a controller at 50 Hz on a Jetson Orin NX ("SONIC on Jetson Orin NX" in the page's diagram), joint control at 1 kHz. The full GR00T 2 parameter count is not on the page (U3).

**F02-46. GR00T 2's adaptation claim: five demonstrations per task, under 3 minutes of robot data, and a 30-minute LoRA (low-rank adaptation, which trains small added matrices and leaves the base weights frozen) fine-tune on one RTX 5090 lift average success on 50 unseen tasks from 40% zero-shot to 95%.**
- Location: GR00T 2 project page, "Fast Adaptation".
- Verdict: CARRIED (seed 01, re-fetched)
- Wave 2 (2026-11-20, SCOPE NARROWER): The 50 tasks were selected as ones the model learns from five episodes (at least 80% success). Whitepaper: "the five-episode rate is high partly by construction". Replacement: on 50 tasks NVIDIA selected that way, GR00T 2 succeeds zero-shot in 40% of trials, in 71% after one demonstration and in 95% after five (under three minutes of robot data, one LoRA fine-tune of about 30 minutes on an RTX 5090 per task) [vendor claim].
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/ | Tier 2, first-party lab page | benchmark claim (vendor reported) | "On 50 tasks never seen on the target robot, only in human video or on other robots, GR00T 2 succeeds 40% of the time zero-shot. Five demonstrations per task, under 3 minutes of robot data, raise that to 95% after a 30-minute fine-tune on a single RTX 5090." and "Each adaptation is a 30-minute LoRA fine-tune on a single RTX 5090." (accessed 2026-11-20)
- Use in dive: section 5 and compute table, as the direction of travel for fine-tune cost. `[vendor claim]`, on NVIDIA's robots and tasks, not reproducible until the December code release.

**F02-47. LeRobot v0.7.0 wraps GR00T N1.7 only: its `groot` policy rejects N1.5 checkpoints and tells the user to pin `lerobot==0.5.1` to keep using them.**
- Location: `src/lerobot/policies/groot/configuration_groot.py` lines 34 to 47 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/groot/configuration_groot.py | Tier 1, code at tag v0.7.0 | code behaviour | ""GR00T N1.5 support was removed from LeRobot. " "To keep using an N1.5 checkpoint, pin the last release that supports it: " "`pip install 'lerobot==0.5.1'`. To use the current release, migrate to GR00T N1.7 " "(model_version='n1.7', base model nvidia/GR00T-N1.7-3B)."" (accessed 2026-11-20)
- Use in dive: section 5 practical note; any 2025 tutorial that fine-tunes "GR00T N1.5 on SO-101 with LeRobot" no longer runs on the current release.

### F. The pi0 line and openpi

**F02-48. pi0.5 (April 2025) put the slow and fast systems inside one network: at each inference step the same model first writes a short text subtask ("pick up the cutting board") and then produces the action chunk conditioned on it.**
- Location: 2504.16054v1 (Physical Intelligence, "pi0.5: a Vision-Language-Action Model with Open-World Generalization"), Section I and Fig. 3 caption.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2504.16054v1 | Tier 3, preprint | definition | "At runtime, during each step of inference, the model first predicts the semantic subtask, inferring the behavior that is appropriate to perform next based on the task structure and the semantics of the scene, and then predicts the low-level robot action chunk based on this subtask." (accessed 2026-11-20)
- Use in dive: section 5, the second way to build the System 1 / System 2 split: one model, two outputs, against GR00T's two modules (F02-33).

**F02-49. pi0.5 uses both action representations from section D, in sequence: 280k pretraining steps with FAST discrete tokens, then 80k post-training steps that add a flow-matching action expert (initialised from random weights) for fast continuous inference.**
- Location: 2504.16054v1, Fig. 3 caption and Section IV-D "Post-training".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2504.16054v1 | Tier 3, preprint | definition | "Robotic data uses the FAST action tokenizer to represent actions as discrete tokens [64]. Second, a post-training stage specializes the model for low-level and high-level inferences for mobile manipulation ... This stage uses flow matching to represent the action distribution, enabling efficient real-time inference and the ability to represent fine-grained continuous action sequences." and "After pre-training the model with discrete tokens for 280k gradient steps, we perform a second stage of training that we refer to as post-training. ... We optimize the objective in Equation (1), with alpha = 10.0 for 80k additional steps." (accessed 2026-11-20)
- Use in dive: section 5: tokens are cheap to train (F02-27), flow is fast to run (F02-21), so the recipe trains with one and deploys with the other. GPU type, count and hours are not in the paper (U5).

**F02-50. pi*0.6 (November 2025) grew the model (Gemma 3 4B VLM, 860M action expert) and added learning from the robot's own experience: a method named Recap trains a value function and conditions the policy on whether an action was better than expected. On the hardest tasks it more than doubles throughput and roughly halves the failure rate.**
- Location: 2511.14759v2 ("pi*0.6: a VLA That Learns From Experience"), Abstract and Section V.
- Verdict: CARRIED (seed 01, re-fetched; latest version is v2)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | definition and benchmark claim (author reported) | "(ii) The base VLM is Gemma 3 [78] 4B model. (iii) The size of the action expert is increased to 860M parameters." and "On some of the hardest tasks, RECAP more than doubles task throughput and roughly halves the task failure rate." (accessed 2026-11-20)
- Use in dive: section 5 lineage, one row; the reinforcement-learning stream owns the mechanism. Weights are not in openpi (F02-53).

**F02-51. pi0.7 (arXiv 2604.15483, v1 16 April 2026, v2 latest) is the newest Physical Intelligence model with a paper as of 2026-11-20: about 5B parameters (Gemma3 4B VLM, 860M flow-matching action expert, a video-history encoder), 50-step chunks generated in 5 denoising steps, prompted with language, episode metadata and generated subgoal images.**
- Location: 2604.15483v2 ("pi0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities"), Section IV, Fig. 2 caption.
- Verdict: CARRIED (seed 01, re-fetched; arXiv ID verified, latest version v2)
- Evidence: https://arxiv.org/abs/2604.15483v2 | Tier 3, preprint | definition | "The pi0.7 model is a 5B-parameter VLA consisting of a 4B VLM backbone, a MEM-style video history encoder and a 860M parameter action expert." and "For all experiments we use 5 denoising steps to generate the 50-step action chunks and execute H in {15, 25} steps out of the chunk." and "During training, we simulate delays of 0 to 12 timesteps, corresponding to a maximum inference latency of 240ms on a 50Hz robot." (accessed 2026-11-20)
- Use in dive: section 5, the current frontier of the pi line. Chunk mechanics unchanged since pi0 (50 actions); denoising steps halved from 10 to 5; executes only 15 or 25 of the 50 before re-planning.

**F02-52. pi0.7 is served from a datacenter GPU, not a robot computer: one NVIDIA H100, 38 ms per inference in the minimal configuration (3 cameras, 5 denoising steps), 127 ms worst case with memory and subgoal images; the 14B subgoal image generator needs 4 H100s and 1.25 s per generation.**
- Location: 2604.15483v2, Appendix D "Inference speed and optimization".
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2604.15483v2 | Tier 3, preprint | benchmark claim (author reported) | "The pi0.7 model and the high-level policy, which are both based on Gemma3 4B, use a single NVIDIA H100 GPU for inference. Various optimizations implemented after RTC [107] have brought the inference time of the minimal variant of pi0.7 down to 38ms with 3 camera inputs, 5 denoising steps, and training-time RTC [108] (which, unlike test-time RTC, incurs no additional inference-time overhead). Enabling the MEM vision encoder [37] and adding subgoal images to the context both incur additional overhead, bringing the inference time to 127ms in the worst case." and "we also use 4-way tensor parallelism on 4xH100 GPUs ... This allows us to generate subgoal images with 25 denoising steps (each including both text and image CFG) in 1.25 seconds." (accessed 2026-11-20)
- Use in dive: section 5 and compute table. Training compute is not in the paper (U5).

**F02-53. openpi, the open repository, holds pi0, pi0-FAST and pi0.5 only. Its README's newest update entries are dated September 2025, the last commit on the default branch is 2026-08-24 (a documentation fix), there are no GitHub releases, and neither pi*0.6 nor pi0.7 weights are offered. Licence: Apache-2.0.**
- Location: openpi README "Updates" and "Model Checkpoints" at SHA 215abfb217dbac7d5f1273282331b9b1866c0479; GitHub API (releases list empty, licence field, commit list).
- Verdict: NEW
- Wave 2 (2026-11-20, STALE (partial); closes U7): The "anything newer than pi0.7: not determined" row is now determined: no model newer than pi0.7 was named as of a 2026-10-20 archive copy of the company homepage. The newest post, "Frontier Models for Every Robot" (2026-10-13, read from https://web.archive.org/web/20261031104522/https://www.pi.website/blog/api-beta because the live site returned HTTP 429), offers "our latest models" for training and inference through a hosted Pi API beta with a waitlist, and names no model version. Not checked for the 30 days after that copy.
- Evidence: https://github.com/Physical-Intelligence/openpi/blob/215abfb217dbac7d5f1273282331b9b1866c0479/README.md | Tier 1, first-party repository at pinned SHA | documentation of support | "- [Sept 2025] We released PyTorch support in openpi. / - [Sept 2025] We released pi05, an upgraded version of pi0 with better open-world generalization." and "For all models, we provide _base model_ checkpoints, pre-trained on 10k+ hours of robot data" and "Note that, in this repository, we currently only support the flow matching head for both pi0.5 training and inference." (accessed 2026-11-20)
- Use in dive: section 5, the gap between the published frontier (pi0.7, April 2026) and what a reader can download (pi0.5, September 2025): about seven months and two model generations `[our reading]`.

**F02-54. openpi's published memory requirements: more than 8 GB of GPU memory for inference, more than 22.5 GB for LoRA fine-tuning (example GPU RTX 4090), more than 70 GB for full fine-tuning (A100 80 GB or H100). Training is single-node only.**
- Location: openpi README "Requirements" at SHA 215abfb.
- Verdict: CARRIED (seed 01, re-fetched at a pinned SHA)
- Wave 2 (2026-11-20, SCOPE NARROWER): The README's sentence that the training script "does not yet support multi-node training" is in the Requirements section (the JAX path); the PyTorch section of the same README at the same SHA gives a multi-node `torchrun --nnodes=<num_nodes>` command for `scripts/train_pytorch.py`. Do not write "single-node only" without naming the path.
- Evidence: https://github.com/Physical-Intelligence/openpi/blob/215abfb217dbac7d5f1273282331b9b1866c0479/README.md | Tier 1, first-party docs at pinned SHA | documentation of support | "| Inference | > 8 GB | RTX 4090 | / | Fine-Tuning (LoRA) | > 22.5 GB | RTX 4090 | / | Fine-Tuning (Full) | > 70 GB | A100 (80GB) / H100 |" and "Please also note that the current training script does not yet support multi-node training." and "The repo has been tested with Ubuntu 22.04, we do not currently support other operating systems." (accessed 2026-11-20)
- Use in dive: sections 5 and compute table. The three lines map onto three price points: any 12 GB card to run, a 24 GB card to adapt, an 80 GB card to fully retrain.

**F02-55. openpi's PyTorch port lacks pi0-FAST, mixed precision, FSDP, LoRA and EMA; those need the JAX path. Serving is built in: the model runs on one machine and streams actions to the robot over a websocket.**
- Location: openpi README "PyTorch Support" and "Remote Inference" at SHA 215abfb.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://github.com/Physical-Intelligence/openpi/blob/215abfb217dbac7d5f1273282331b9b1866c0479/README.md | Tier 1, first-party docs at pinned SHA | documentation of support | "A few features are currently not supported (this may change in the future): - The pi0-FAST model - Mixed precision training - FSDP (fully-sharded data parallelism) training - LoRA (low-rank adaptation) training - EMA (exponential moving average) weights during training" and "the model can run on a different server and stream actions to the robot via a websocket connection." (accessed 2026-11-20)
- Use in dive: section 5 practical note; the 22.5 GB LoRA line in F02-54 is a JAX-only path in openpi. LeRobot's own port has its own LoRA switch (F02-63).

**F02-56. LeRobot v0.7.0 carries pi0, pi0-FAST and pi0.5 as native policies adapted from openpi, and has started back-porting later Physical Intelligence ideas onto pi0.5: optional visual and proprioceptive memory (MEM, arXiv 2603.03596) and trained real-time chunking.**
- Location: `docs/source/pi05.mdx` line 3; `src/lerobot/policies/pi05/configuration_pi05.py` lines 41 to 54 and 76 to 79 at tag v0.7.0; v0.7.0 release notes ("feat(pi05): add optional visual and proprioceptive MEM").
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi05/configuration_pi05.py | Tier 1, code at tag v0.7.0 | documentation of support | "# MEM short-horizon observation memory (https://arxiv.org/abs/2603.03596). # Historical image tokens are fused inside SigLIP and dropped before the # language backbone. ... Both paths are opt-in and independent." and "use_visual_memory: bool = False / use_proprioceptive_memory: bool = False / memory_frames: int = 6 / memory_stride: int = 30"; docs: "The LeRobot implementation is adapted from their open source [OpenPI](https://github.com/Physical-Intelligence/openpi) repository." (accessed 2026-11-20)
- Use in dive: section 5: for an SO-101 owner the practical pi model is pi0.5 through LeRobot, with two pi0.7-era features available as switches. The MEM paper itself (2603.03596) was not read in this stream.

**F02-57. LeRobot's pi0.5 fine-tuning example is "Sized for a single 80 GB GPU" at batch size 64 for 30,000 steps; the same page gives a batch-size-8 variant. No wall-clock time is stated.**
- Location: `docs/source/pi05.mdx` lines 77 to 97 and 195 to 196 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/pi05.mdx | Tier 1, first-party docs at tag v0.7.0 | documentation of support | "Sized for a single 80 GB GPU:" followed by "--batch_size=64 \" and "--steps=30000 \" (accessed 2026-11-20)
- Use in dive: SO-101 fine-tune cost row for pi0.5.

### G. SmolVLA and the LeRobot policy list

**F02-58. SmolVLA (June 2025) is a 450M-parameter VLA, about 100M of it in the action expert, built on the SmolVLM-2 vision-language model with only the first 16 language-model layers used; the action expert is trained with flow matching to output 50-action chunks in 10 steps, with the VLM frozen.**
- Location: 2506.01844v1 (Shukor et al., "SmolVLA: A Vision-Language-Action Model for Affordable and Efficient Robotics"), the implementation-details subsection of Section 4 (experiments).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint, first-party lab (Hugging Face) | definition | "The action expert is trained with flow matching to output chunks of n = 50 actions. ... During inference, the flow matching is fixed to 10 steps. We train only the action expert module, keeping the VLM frozen. Our main model, contains 450 million parameters, with approximately 100 million dedicated to the action expert. We use only the first 16 layers of the large language model (LLM) within the VLM." (accessed 2026-11-20)
- Use in dive: section 5, the small end of the VLA range: 450M against pi0's 3.3B (about 7x smaller `[derived]`; the paper itself says pi0 is "a significantly larger model in terms of parameter count (~7x)").

**F02-59. SmolVLA's training compute as the paper states it: pretraining for 200,000 steps at global batch size 256 on 4 GPUs (type not named), about 30k GPU-hours for the whole project, on 481 community datasets holding 22.9K episodes and 10.6M frames. The paper says the model "can easily be trained on a single GPU".**
- Location: 2506.01844v1, the implementation-details subsection of Section 4, and Table 1.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint, first-party lab | benchmark claim (author reported) | "During pretraining, we train for 200,000 steps with a global batch size of 256 on all our community datasets." and "Pretraining was conducted using 4 GPUs to accomodate for large batch size, but the model can easily be trained on a single GPU due to its small size. Overall, the project consumed approximately 30k GPU hours." and Table 1: "# datasets 481 / # episodes 22.9K / # frames 10.6M" (accessed 2026-11-20)
- Use in dive: compute table. 10.6M frames at 30 frames per second is about 98 hours of robot data `[derived: 10.6e6 / 30 / 3600 = 98.1; assumes 30 fps for every dataset, which the paper does not state]`, against pi0's "over 10,000 hours": two orders of magnitude less. The 30k GPU-hours covers every experiment in the project, not one pretraining run.

**F02-60. SmolVLA on the dive's arm: the paper evaluates on SO-100 and SO-101, describes each as having six degrees of freedom with position-controlled servos, uses 50 demonstrations per task, and reports on the SO-101 pick-place task 90% success in distribution and 50% out of distribution, against 70% and 40% for ACT. SmolVLA was not pretrained on any SO-101 data.**
- Location: 2506.01844v1, Section 4.1 (experimental setup), the robot descriptions that follow it, Table 4.
- Verdict: CARRIED (seed 01, re-fetched), SO-101 detail NEW
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint, first-party lab | benchmark claim (author reported) | "Each arm has six degrees of freedom and uses low-cost servo motors that are controlled with position commands." and "Each dataset contains demonstrations relative to one task, with 10 trajectories for each of 5 distinct starting positions, resulting in a total of 50 demonstrations per dataset." and "Table 4 | Real-world benchmark (SO101). Success rate (%) for the Pick-Place-Lego task using policies trained in single-task setting." with rows "ACT 70 40" and "SmolVLA (0.45B) 90 50" [columns: In Distribution, Out of Distribution] and "Critically, SmolVLA is not pretrained on any datasets recorded for the SO101." (accessed 2026-11-20)
- Use in dive: sections 4 and 5: this is the closest published result to the dive's own task (SO-101, pick and place, 50 demonstrations). The out-of-distribution column (50%, 40%) is the honest number for "the block starts somewhere new".

**F02-61. SmolVLA's asynchronous inference: the robot keeps executing the current chunk while the next one is computed (possibly on another machine), and asks for a new chunk when the queue of remaining actions falls below a threshold. Same success rate, task time down from 13.75 s to 9.7 s (about 30% faster).**
- Location: 2506.01844v1, Section 3.3 "Asynchronous inference" and the asynchronous-inference results (Figure 5).
- Verdict: CARRIED (seed 01, re-fetched)
- Wave 2 (2026-11-20, SCOPE NARROWER): "Same success rate" is too strong. The paper's table: average success 78.3% synchronous and 73.3% asynchronous over three tasks (one task drops from 70% to 50%); task time 13.75 s to 9.70 s. Write: comparable success (78.3% against 73.3% on three tasks) with task time down from 13.75 s to 9.70 s [author reported].
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint, first-party lab | benchmark claim (author reported) | "both inference modes achieve comparable success rates across three real-world tasks. However, asynchronous inference demonstrates a substantial speed advantage (Figure 5b). On average, it completes the task in 9.7 seconds, compared to 13.75 seconds in the synchronous setting (~30% faster)." (accessed 2026-11-20)
- Use in dive: section 5 pointer to the inference section (stream 07). The paper sets the control period from "a real-world frame-rate of 30 frames per second, delta-t = 33ms", the figure the worked examples use.

**F02-62. In LeRobot v0.7.0 the SmolVLA defaults match the paper (`chunk_size = 50`, `n_action_steps = 50`, `num_steps = 10`, backbone `HuggingFaceTB/SmolVLM2-500M-Video-Instruct`, `num_vlm_layers = 16`, action expert at 0.75 of the VLM's width, images padded to 512 x 512, VLM frozen with `train_expert_only = True`), and the stand-alone async module the paper introduced has been removed in favour of a general remote policy server.**
- Location: `src/lerobot/policies/smolvla/configuration_smolvla.py` lines 28 to 30, 45, 63, 69 to 71, 85, 97 to 99 at tag v0.7.0; v0.7.0 release notes, "Breaking changes".
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/smolvla/configuration_smolvla.py | Tier 1, code at tag v0.7.0 | code behaviour | "chunk_size: int = 50 / n_action_steps: int = 50" and "num_steps: int = 10" and "freeze_vision_encoder: bool = True / train_expert_only: bool = True" and "vlm_model_name: str = "HuggingFaceTB/SmolVLM2-500M-Video-Instruct"" and "num_vlm_layers: int = 16" and "expert_width_multiplier: float = 0.75"; release notes (https://github.com/huggingface/lerobot/releases/tag/v0.7.0): "`lerobot.async_inference` and `lerobot[async]` are removed: use `lerobot[remote]`, `lerobot-policy-server` and `lerobot-rollout --inference.type=remote`." (accessed 2026-11-20)
- Use in dive: section 5 code block; and a freshness trap: tutorials written before November 2026 that import `lerobot.async_inference` no longer run.

**F02-63. LeRobot's stated SmolVLA fine-tune cost: 20,000 steps at batch size 64 take roughly 4 hours on a single A100, starting from the 450M `smolvla_base` checkpoint with about 50 recorded episodes. This is the only first-party wall-clock figure located for fine-tuning any VLA on SO-100/SO-101 data.**
- Location: `docs/source/smolvla.mdx` lines 32, 48 to 50, 62 to 63 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/smolvla.mdx | Tier 1, first-party docs at tag v0.7.0 | vendor claim | "We recommend recording ~50 episodes of your task as a starting point." and "Use [`smolvla_base`](https://hf.co/lerobot/smolvla_base), our pretrained 450M model, and fine-tune it on your data. Training the model for 20k steps will roughly take ~4 hrs on a single A100 GPU. You should tune the number of steps based on performance and your use-case." (accessed 2026-11-20)
- Use in dive: section 5 and compute table, the fine-tune row for the dive's task. 20,000 steps in 4 h is about 1.4 steps/s, or about 89 samples/s at batch 64 `[derived]`.

**F02-64. No SmolVLA successor was located as of 2026-11-20: the Hugging Face `lerobot` organisation's newest SmolVLA checkpoints (March to April 2026) are benchmark fine-tunes of the same model, `smolvla_base` still dates from 2025-06-01, and LeRobot v0.7.0 has a single `smolvla` policy package.**
- Location: Hugging Face model API, author `lerobot`, search `smolvla`, sorted by creation date; LeRobot `src/lerobot/policies/` at tag v0.7.0.
- Verdict: NEW (a statement about what this search found, not about what exists)
- Evidence: https://huggingface.co/api/models?author=lerobot&search=smolvla&sort=createdAt&direction=-1 | Tier 1, first-party registry | documentation of support | API rows: "lerobot/smolvla_vlabench 2026-04-21", "lerobot/smolvla_robocasa 2026-04-16", "lerobot/smolvla_libero 2026-03-24", "lerobot/smolvla_base 2025-06-01" (accessed 2026-11-20)
- Use in dive: currency table. Write "SmolVLA (June 2025), no successor located in this research".

**F02-65. LeRobot v0.7.0 (released 2026-11-05) ships 28 policy packages. Beyond the ones this register covers (act, diffusion, vqbet, tdmpc, pi0, pi0_fast, pi05, smolvla, groot, xvla) the directory holds cosmos3, dm05, eo1, evo1, fastwam, fineart_vla, flux3, g05, gaussian_actor, lawam, lingbot_va, lingbot_vla_v2, longwam, molmoact2, multi_task_dit, vla_jepa, wall_oss_05 and wall_x, plus the shared rtc module.**
- Location: `src/lerobot/policies/` directory listing at tag v0.7.0 (GitHub contents API); `docs/source/_toctree.yml` "Policies" section.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/tree/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies | Tier 1, code at tag v0.7.0 | documentation of support | directory entries: "act, common, cosmos3, diffusion, dm05, eo1, evo1, fastwam, fineart_vla, flux3, g05, gaussian_actor, groot, lawam, lingbot_va, lingbot_vla_v2, longwam, molmoact2, multi_task_dit, pi0, pi05, pi0_fast, rtc, smolvla, tdmpc, vla_jepa, vqbet, wall_oss_05, wall_x, xvla" (accessed 2026-11-20)
- Use in dive: section 5, "what can I fine-tune for my SO-101 today": any of these through one `lerobot-train --policy.type=...` interface. Several names are world-action models (cosmos3, fastwam, longwam, lawam) or JEPA-based (vla_jepa) and belong to the world-model streams; this stream did not read them (U8). Count: 30 directory entries minus `common` and `rtc` (shared code) leaves 28 policy packages; the toctree lists fewer because some lack a guide page. `[derived]`

**F02-66. LeRobot's own guidance for a first policy on the arm is ACT: about 80M parameters, "a few hours for 100k training steps on a single GPU", batch size 8, "often" high success with 50 demonstrations.**
- Location: `docs/source/act.mdx` lines 24 to 29 and 66 to 72 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/act.mdx | Tier 1, first-party docs at tag v0.7.0 | vendor claim | "- **Fast Training**: Trains in a few hours on a single GPU - **Lightweight**: Only ~80M parameters, making it efficient and easy to work with - **Data Efficient**: Often achieves high success rates with just 50 demonstrations" and "**Training duration**: Expect a few hours for 100k training steps on a single GPU / **Batch size**: Start with batch size 8 and adjust based on your GPU memory" (accessed 2026-11-20)
- Use in dive: section 4 close and the SO-101 fine-tune cost table. The GPU model is not named.

**F02-67. The SO-101 as LeRobot drives it: six Feetech STS3215 servos (shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper), so one action is a 6-number vector of target positions; the recording examples use two cameras at 640 x 480 and 30 frames per second, and the recorder's default is 50 episodes.**
- Location: `src/lerobot/robots/so_follower/so_follower.py` lines 72 to 77; `docs/source/il_robots.mdx` lines 114, 232, 395 to 396 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code at tag v0.7.0 | code behaviour | ""shoulder_pan": Motor(1, "sts3215", norm_mode_body), / "shoulder_lift": Motor(2, "sts3215", norm_mode_body), / "elbow_flex": Motor(3, "sts3215", norm_mode_body), / "wrist_flex": Motor(4, "sts3215", norm_mode_body), / "wrist_roll": Motor(5, "sts3215", norm_mode_body), / "gripper": Motor(6, "sts3215", MotorNormMode.RANGE_0_100),"; docs: "--robot.cameras="{ wrist: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}, top: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}}"" and "`--dataset.num_episodes=50` Total number of episodes to record (default: **50**)." (accessed 2026-11-20)
- Use in dive: the real numbers behind every worked example in sections 4 and 5: action dimension 6, control and camera rate 30 Hz, 2 cameras at 640 x 480, 50 episodes. Reconcile with the hardware stream's register before printing.

### H. OpenVLA-OFT, X-VLA, ScaleVLA

**F02-68. OpenVLA-OFT (February 2025) showed that a 7B token-predicting VLA becomes fast when its head is changed: predict the whole chunk in one parallel pass, as continuous values, with a plain L1 regression loss. On LIBERO, success went from 76.5% to 97.1% with 26x the action throughput; on a bimanual ALOHA task the policy ran at 71.4 Hz of throughput with 0.112 s latency.**
- Location: 2502.19645v2 (Kim, Finn, Liang, "Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success"), Abstract; Section VI (ALOHA experiments), Table II.
- Verdict: CARRIED (seed 01, re-fetched; latest version is v2)
- Evidence: https://arxiv.org/abs/2502.19645v2 | Tier 3, preprint | benchmark claim (author reported) | "Optimized Fine-Tuning (OFT) recipe that integrates parallel decoding, action chunking, a continuous action representation, and a simple L1 regression-based learning objective ... significantly boosting OpenVLA's average success rate across four task suites from 76.5% to 97.1% while increasing action generation throughput by 26x." and "policy maintains high throughput (71.4 Hz) and low latency (0.112 sec), as shown in Table II." (accessed 2026-11-20)
- Use in dive: section 5, a counterpoint worth one paragraph: on these benchmarks a regression head with chunking matched diffusion-style heads, so "multimodality needs diffusion" (F02-14) is a tendency, not a law `[our reading]`. No 2026 successor to OpenVLA was located: the `openvla/openvla` repository was last pushed 2025-03-23 and `moojink/openvla-oft` 2025-09-09 (GitHub API, accessed 2026-11-20).

**F02-69. OpenVLA-OFT's fine-tune compute: 50K to 150K gradient steps at batch size 64 to 128 across 8 A100 or H100 GPUs.**
- Location: 2502.19645v2, Section V (LIBERO experimental setup).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2502.19645v2 | Tier 3, preprint | benchmark claim (author reported) | "We train for 50-150K gradient steps for non-diffusion methods and 100-250K steps for diffusion methods (which converge slower), using a batch size of 64-128 across 8 A100/H100 GPUs." (accessed 2026-11-20; in the PDF this sentence runs across a column and figure break, the two halves were read separately and joined)
- Use in dive: compute table: a 7B backbone makes "fine-tuning" an 8-GPU job, the contrast with SmolVLA's one A100.

**F02-70. X-VLA (October 2025) handles many robot bodies with "soft prompts": a small set of learnable embeddings per robot type, fed to a 0.9B flow-matching transformer. Adapting to a new domain by tuning 1% of the parameters (9M) reaches 93% on LIBERO.**
- Location: 2510.10274v1 (Zheng et al., "X-VLA: Soft-Prompted Transformer as Scalable Cross-Embodiment Vision-Language-Action Model"), Abstract and Section 1.
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2510.10274v1 | Tier 3, preprint | definition and benchmark claim (author reported) | "we propose a novel Soft Prompt approach with minimally added parameters, by infusing prompt learning concepts into cross-embodiment robot learning" and "By tuning only 1% of the model parameters (9M), X-VLA-0.9B achieves 93% success rate on LIBERO" (accessed 2026-11-20)
- Use in dive: section 5, the third answer to "one model, many robots" beside zero-padding (F02-23) and per-embodiment encoders (F02-33). X-VLA is a native LeRobot policy at v0.7.0 (`policies/xvla`, `docs/source/xvla.mdx`).

**F02-71. X-VLA's pretraining compute is in its appendix: 64 NVIDIA A100 GPUs, global batch size 1024, about 4 days, on 290K episodes.**
- Location: 2510.10274v1, Appendix G "Pretraining Details"; Section 1 (data).
- Verdict: NEW (the seed recorded "pretraining data and compute not on the abstract page")
- Evidence: https://arxiv.org/abs/2510.10274v1 | Tier 3, preprint | benchmark claim (author reported) | "The pretraining of X-VLA-0.9B was carried out on 64 NVIDIA A100 GPUs with a global batch size of 1024, spanning approximately 4 days." and "a curated heterogeneous data mixture comprising 290K episodes from Droid" (accessed 2026-11-20)
- Use in dive: compute table. 64 x 96 h = about 6,100 A100-hours `[derived]`, the smallest published pretraining bill among the VLAs here with a GPU count.

**F02-72. ScaleVLA (arXiv 2611.21607v1, 16 November 2026; the PDF is dated November 17, 2026) keeps the action head fixed and swaps the VLM, from 2B up to a frozen 552B mixture-of-experts backbone (DeepSeek-V4.1-Flash). With 5 demonstrations per task, LIBERO-Goal success goes from 39.4% to 77.4%; 10 demonstrations on the 552B backbone beat 50 on the 2B one (87.8% against 85.6%).**
- Location: 2611.21607v1 ("ScaleVLA: Scaling Vision-Language-Action Models to 552 Billion Parameters"), Abstract; the sample-efficiency results.
- Verdict: CARRIED (seed 01, re-fetched; exists at the primary source)
- Evidence: https://arxiv.org/abs/2611.21607v1 | Tier 3, preprint | benchmark claim (author reported) | "We introduce ScaleVLA, which connects a 552B DeepSeek-V4.1-Flash backbone to a trainable action DiT, and systematically compare VLMs from 2B to 552B under a shared training setup. ... In sample efficiency, just 10 demonstrations outperform a 2B backbone trained with 50 (87.8% vs. 85.6%)." and "on LIBERO-Goal, from 39.4% to 77.4%" and "The language and visual backbones are frozen, while the feature adapter, state and action encoders, diffusion transformer, and action decoder are trainable." (accessed 2026-11-20)
- Use in dive: section 5, the newest evidence (four days old on the research date) on what a bigger System 2 buys: fewer demonstrations. Simulation benchmark plus a small real-robot study; four days is too new for any independent replication.

**F02-73. ScaleVLA's compute: policies trained on 64 H200 GPUs (eight nodes of eight) at global batch size 640; inference at a median 216 ms per action chunk on four H200 GPUs, reading the backbone once per chunk with no text generation and a 32-layer action DiT that runs four flow steps.**
- Location: 2611.21607v1, Section 1; Fig. 2 caption; Appendix (optimisation and normalisation; architecture).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2611.21607v1 | Tier 3, preprint | benchmark claim (author reported) | "It achieves a median inference latency of 216 ms per action chunk using four H200 GPUs (table 6). This demonstrates that frontier VLM representations can support practical, subsecond robot control, although at a higher hardware cost than smaller backbones." and "Policies are trained on 64 NVIDIA H200 GPUs (eight nodes with eight GPUs each), with a global batch size of 640" and "The action DiT alternates cross-attention and self-attention and generates an action chunk in four flow steps." (accessed 2026-11-20)
- Use in dive: section 5 and compute table: the far end of the System 2 size range, and an off-robot model by construction.

### I. Gemini Robotics (Google DeepMind)

**F02-74. Gemini Robotics 2.5 (Google DeepMind blog, 10 November 2026) is the newest Gemini Robotics VLA located: tested on over 200 tasks, with a stated 30% to 100% higher success rate than previous baselines and 20% to 30% faster task completion. The post gives no parameter count, training compute or latency.**
- Location: Google DeepMind blog, "Gemini Robotics 2.5 accelerates real-world physical intelligence" (page metadata date 2026-11-10).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/ | Tier 2, first-party lab blog | vendor claim | "Today, we are introducing Gemini Robotics 2.5, our most capable vision-language-action (VLA) model to date." and "We tested Gemini Robotics 2.5's capabilities in task breadth, performance, and complexity across over 200 distinct tasks" and "Compared to previous baselines, Gemini Robotics 2.5 achieves a 30% to 100% higher success rate depending on the type of task, while completing tasks 20% to 30% faster." (accessed 2026-11-20)
- Use in dive: section 5 lineage and currency table. `[vendor claim]`; "previous baselines" is not defined in the passage read.

**F02-75. Gemini Robotics 2 (30 July 2026) came as three models that map onto the fast and slow split: Gemini Robotics 2 (the VLA, "converts vision and language input into motor control"), Gemini Robotics ER 2 (an embodied-reasoning VLM "that acts as our agent"), and Gemini Robotics On-Device 2 (a VLA "optimized to run locally on robotic devices"). Only ER 2 is generally reachable (Google AI Studio); the two VLAs are for early-access partners.**
- Location: Google DeepMind blog, "Gemini Robotics 2 brings whole-body intelligence to robots" (page metadata date 2026-07-30).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/ | Tier 2, first-party lab blog | definition and documentation of support | "Gemini Robotics 2: Our most advanced vision-language-action model (VLA) that converts vision and language input into motor control, enabling a robot to take action." and "Gemini Robotics ER 2: Our most capable embodied reasoning (ER) model. It is a vision language model (VLM) that acts as our agent" and "Gemini Robotics ER 2, our reasoning model, is now available on Google AI Studio and in private preview on Gemini Enterprise Agent Platform. Our VLA and On-Device models are available to early-access partners." (accessed 2026-11-20)
- Use in dive: section 5: Google ships System 2 as a public API and keeps System 1 gated.

**F02-76. Gemini Robotics On-Device 2 names the SO-101 among the bodies it was adapted to: new bi-arm embodiments in "a few hours of adaptation time, typically with less than 200 examples", demonstrated on "the Dexmate, SO101, and Trossen platforms". The hardware used for adaptation and the on-device latency are not stated.**
- Location: same post, section "Adapting fast on-device models for any robot".
- Verdict: CARRIED (seed 01, re-fetched), SO-101 mention NEW
- Evidence: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/ | Tier 2, first-party lab blog | vendor claim | "This model is natively multi-embodiment and inherits our advanced "motion transfer" techniques from Gemini Robotics 1.5. We can now adapt to new bi-arm robot embodiments with just a few hours of adaptation time, typically with less than 200 examples. This works even with new embodiments with drastically different shapes, sensors and degrees of freedom, as shown below with a diverse set of tasks being performed by the Dexmate, SO101, and Trossen platforms." (accessed 2026-11-20)
- Use in dive: section 5: the dive's arm appears in a frontier lab's own demo, but in a bi-arm setup and behind early access, so it is not a path the reader can take today.

**F02-77. The first Gemini Robotics On-Device (24 June 2025) was the first Gemini Robotics VLA offered for fine-tuning, adapting to new tasks "with as few as 50 to 100 demonstrations", through an SDK limited to a trusted tester programme.**
- Location: Google DeepMind blog, "Gemini Robotics On-Device brings AI to local robotic devices" (page metadata date 2025-06-24).
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://deepmind.google/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/ | Tier 2, first-party lab blog | vendor claim | "Gemini Robotics On-Device is the first VLA model we're making available for fine-tuning." and "quickly adapt it to new domains, with as few as 50 to 100 demonstrations. Developers can access the SDK by signing up to our trusted tester program." (accessed 2026-11-20)
- Use in dive: section 5 lineage (history, superseded by On-Device 2). The 50 to 100 demonstration figure sits beside ACT's 50 (F02-10) and LeRobot's 50 (F02-63).

**F02-78. The original Gemini Robotics (tech report, March 2025) is the clearest published case of a slow system in the cloud and a fast system on the robot: a VLA backbone hosted in the cloud with query-to-response latency under 160 ms, a local action decoder on the robot's computer, about 250 ms end to end from observation to action chunk, and an effective 50 Hz control rate because each chunk holds many actions.**
- Location: arXiv 2503.20020v1 ("Gemini Robotics: Bringing AI into the Physical World"), Section 3.1 "Gemini Robotics: Model and Data".
- Verdict: CARRIED (seed 01, re-fetched; only v1 is listed)
- Evidence: https://arxiv.org/abs/2503.20020v1 | Tier 3, preprint (technical report), first-party lab | definition and vendor claim | "It consists of two components: a VLA backbone hosted in the cloud (Gemini Robotics backbone) and a local action decoder running on the robot's onboard computer (Gemini Robotics decoder). The Gemini Robotics backbone is formed by a distilled version of Gemini Robotics-ER and its query-to-response latency has been optimized from seconds to under 160ms. The on-robot Gemini Robotics decoder compensates for the latency of the backbone. When the backbone and local decoder are combined, the end-to-end latency from raw observations to low-level action chunks is approximately 250ms. With multiple actions in the chunk (Zhao et al., 2023), the effective control frequency is 50Hz." (accessed 2026-11-20)
- Use in dive: section 5, the third layout of the split (after GR00T's two modules on one GPU and pi0.5's one model with two outputs): the network sits between the two systems, and chunking is what hides the 250 ms. History (March 2025); no later Gemini Robotics release read here states a latency.

**F02-79. Gemini Robotics 1.5 (25 September 2025) made the two-model agent explicit: Gemini Robotics-ER 1.5 "orchestrates a robot's activities, like a high-level brain" and can call tools such as Google Search; Gemini Robotics 1.5, the VLA, "thinks before taking action". ER 1.5 went to developers through the Gemini API; the VLA to select partners only.**
- Location: Google DeepMind blog, "Gemini Robotics 1.5 brings AI agents into the physical world" (page metadata date 2025-09-25).
- Verdict: NEW (the seed mentioned 1.5 only in passing)
- Evidence: https://deepmind.google/blog/gemini-robotics-15-brings-ai-agents-into-the-physical-world/ | Tier 2, first-party lab blog | definition and documentation of support | "we designed two models that work together in an agentic framework. Our embodied reasoning model, Gemini Robotics-ER 1.5, orchestrates a robot's activities, like a high-level brain." and "This model thinks before taking action and shows its process" and "Starting today, we're making Gemini Robotics-ER 1.5 available to developers via the Gemini API in Google AI Studio. Gemini Robotics 1.5 is currently available to select partners." (accessed 2026-11-20)
- Use in dive: section 5 lineage (history, superseded by Gemini Robotics 2 and 2.5). It is the same pattern GR00T 2 adopted a year later (F02-45): a general reasoning model as System 2 calling the action model as a tool.

### J. Fine-tuning for an SO-101 today, and the compute table

**F02-80. LeRobot's pi0 fine-tuning example fits a full fine-tune into a few thousand steps on one GPU by turning on gradient checkpointing and bfloat16: `--steps=3000 --batch_size=32`, all weights trainable. No GPU model or time is stated.**
- Location: `docs/source/pi0.mdx` lines 58 to 80 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/pi0.mdx | Tier 1, first-party docs at tag v0.7.0 | documentation of support | "--policy.pretrained_path=lerobot/pi0_base \ ... --policy.compile_model=true \ --policy.gradient_checkpointing=true \ --policy.dtype=bfloat16 \ --policy.freeze_vision_encoder=false \ --policy.train_expert_only=false \ --steps=3000 \ --policy.device=cuda \ --batch_size=32" and "**`--policy.gradient_checkpointing=true`**: Reduces memory usage significantly during training" (accessed 2026-11-20)
- Use in dive: SO-101 fine-tune table, pi0 row. Memory comes from openpi's table (F02-54), which is for the JAX code path, so treat it as indicative for the LeRobot port.

**F02-81. LeRobot's GR00T N1.7 fine-tuning example for a new embodiment uses `--policy.chunk_size=16 --policy.n_action_steps=16`, relative actions for every joint except the gripper, bf16, batch size 64 and 20,000 steps.**
- Location: `docs/source/groot.mdx` lines 74 to 96 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/groot.mdx | Tier 1, first-party docs at tag v0.7.0 | documentation of support | "--policy.type=groot \ --policy.device=cuda \ --policy.base_model_path=nvidia/GR00T-N1.7-3B \ --policy.embodiment_tag=new_embodiment \ --policy.chunk_size=16 \ --policy.n_action_steps=16 \ --policy.use_relative_actions=true \ --policy.relative_exclude_joints='["gripper"]' \ --policy.use_bf16=true ... --batch_size=64 \ --steps=20000" (accessed 2026-11-20)
- Use in dive: SO-101 fine-tune table, GR00T row. At NVIDIA's measured 192.57 samples/s on an H100 (F02-42), 20,000 x 64 = 1.28M samples is about 1.8 hours of step time; on an L40 at 56.42 samples/s about 6.3 hours `[derived, illustration: the throughput was measured at maximum batch on NVIDIA's own loader, not through LeRobot]`.

**F02-82. LeRobot's X-VLA defaults: a 32-action chunk, 10 denoising steps, a 24-layer transformer of width 1024, 32 soft-prompt tokens for each of up to 30 domains; the fine-tuning example runs 20,000 steps with the soft prompts trainable.**
- Location: `src/lerobot/policies/xvla/configuration_xvla.py` lines 91 to 92, 111 to 116, 123; `docs/source/xvla.mdx` lines 126 to 140 at tag v0.7.0.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/xvla/configuration_xvla.py | Tier 1, code at tag v0.7.0 | code behaviour | "chunk_size: int = 32 / n_action_steps: int = 32" and "hidden_size: int = 1024 / depth: int = 24 / num_heads: int = 16" and "num_domains: int = 30 / len_soft_prompts: int = 32" and "num_denoising_steps: int = 10" (accessed 2026-11-20)
- Use in dive: SO-101 fine-tune table, X-VLA row; the soft-prompt mechanism of F02-70 in numbers.

**F02-83. LeRobot v0.7.0 has one LoRA switch for every policy (`--peft.method_type=LORA`), and the release fixed a silent failure: before it, `--policy.use_peft=true` alone ran a full fine-tune.**
- Location: `docs/source/peft_training.mdx` lines 20 to 34 at tag v0.7.0; v0.7.0 release notes, "Breaking changes", Training.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/releases/tag/v0.7.0 | Tier 1, first-party release notes | code behaviour | "`--policy.use_peft=true` alone now trains LoRA instead of silently fully fine-tuning." ; docs example: "--steps=100000 \ --batch_size=32 \ --peft.method_type=LORA \ --peft.r=64 \ --peft.lora_alpha=64" (accessed 2026-11-20)
- Use in dive: section 5 practical note for anyone on a 24 GB card: check the trainable-parameter count the trainer prints.

#### SO-101 fine-tune options (LeRobot v0.7.0), with published cost

All rows are first-party statements; none is our measurement. "not stated" means the cited source gives no figure.

| Policy (`--policy.type`) | Parameters | Starts from | Published fine-tune recipe | Published hardware and time | Entry |
|---|---|---|---|---|---|
| `act` | ~80M | scratch (ImageNet ResNet-18) | 100k steps, batch 8, 50 episodes | "a few hours ... on a single GPU" (GPU not named) `[vendor claim]`; paper: ~5 h on one 11 GB RTX 2080 Ti `[author reported]` | F02-66, F02-9 |
| `diffusion` | not read here | scratch | defaults: horizon 64, 100 denoising steps | not stated | F02-17 |
| `smolvla` | 450M | `lerobot/smolvla_base` | 20k steps, batch 64, ~50 episodes | ~4 h on one A100 `[vendor claim]` | F02-63 |
| `pi0` | 3.3B | `lerobot/pi0_base` | 3,000 steps, batch 32, gradient checkpointing, bf16 | GPU not stated; openpi: LoRA > 22.5 GB, full > 70 GB | F02-80, F02-54 |
| `pi05` | PaliGemma 2B + 300M expert (code variant names) | `lerobot/pi05_base` | 30k steps, batch 64 | "Sized for a single 80 GB GPU"; time not stated | F02-57 |
| `pi0_fast` | same backbone, token head | `lerobot/pi0fast-base` | not read in detail | not stated | F02-29 |
| `groot` (N1.7) | 3.14B | `nvidia/GR00T-N1.7-3B` | 20k steps, batch 64 (LeRobot); 2,000 steps, batch 32 (NVIDIA SO100 example) | 1 GPU with 40 GB+; under ~35 GB with VLM frozen; time not stated | F02-81, F02-42, F02-43 |
| `xvla` | 0.9B | `lerobot/xvla-base` | 20k steps, soft prompts trainable | not stated | F02-82 |

#### Compute table (published figures only)

`[A]` = author reported, `[V]` = vendor claim, `[D]` = derived here, inputs in the entry.

| Model (date) | Parameters | Pretraining compute | Fine-tune compute | Inference latency and device | Entries |
|---|---|---|---|---|---|
| ACT (Apr 2023) | ~80M `[A]` | none: trained per task, ~5 h on 1x RTX 2080 Ti 11 GB `[A]` | same | ~0.01 s on the same GPU `[A]` | F02-9 |
| Diffusion Policy (Mar 2023) | not recorded here | not recorded here | not recorded here | 0.1 s on an NVIDIA 3080 with 10 DDIM steps `[A]` | F02-16 |
| pi0 (Oct 2024) | 3.3B `[A]` | GPUs not published | openpi: LoRA > 22.5 GB, full > 70 GB `[V]` | 73 ms on RTX 4090 (86 ms off-board) `[A]` | F02-32, F02-21, F02-54 |
| pi0-FAST (Jan 2025) | 3B-class `[A]` | one run: 8x H100, ~4 days = 768 H100-h `[A]`/`[D]`; "5x fewer GPU hours" than pi0 `[A]` | not published | ~750 ms per chunk on RTX 4090 `[A]` | F02-27, F02-28 |
| GR00T N1 (Mar 2025) | 2.2B `[V]` | ~50,000 H100-h, up to 1,024 GPUs `[V]` | tested on 1x A6000 `[V]` | 63.9 ms per 16-action chunk on L40 `[V]` | F02-34 |
| pi0.5 (Apr 2025) | not stated in passages read | 280k + 80k steps; GPUs not published | LeRobot: 30k steps, one 80 GB GPU `[V]` | not published | F02-49, F02-57 |
| GR00T N1.5 (2025) | VLM 2.1B `[V]` | 1K H100, 250K steps, batch 16,384 `[V]` | not re-fetched | not published | F02-35 |
| SmolVLA (Jun 2025) | 450M `[A]` | 4 GPUs (type not named), 200k steps, batch 256; ~30k GPU-h for the whole project `[A]` | 20k steps ~4 h on 1x A100 `[V]` | latency not stated in passages read; async cuts task time 13.75 s to 9.7 s `[A]` | F02-58, F02-59, F02-61, F02-63 |
| OpenVLA-OFT (Feb 2025) | 7B backbone (OpenVLA) | (OpenVLA's) | 50-150K steps on 8x A100/H100 `[A]` | 0.112 s, 71.4 Hz throughput (device per Table II, not re-read) `[A]` | F02-68, F02-69 |
| X-VLA (Oct 2025) | 0.9B `[A]` | 64x A100, ~4 days = ~6,100 A100-h `[A]`/`[D]` | 9M trainable parameters (1%) `[A]` | not recorded here | F02-70, F02-71 |
| pi*0.6 (Nov 2025) | Gemma 3 4B + 860M expert `[A]` | not published | not published | not published | F02-50 |
| GR00T N1.6 (Dec 2025) | 3B-class | 300K steps, batch 16,384; GPUs not published `[V]` | 10K-30K steps, batch <= 1K `[V]` | not re-fetched (seed has the n1d6 branch table) | F02-36 |
| GR00T N1.7 (Apr 2026) | 3.14B (file), "3B" (card) `[V]` | 64 GB200 nodes x 4 GPUs x 120 h = 30,720 GPU-h `[V]`/`[D]` | 40 GB+ GPU; 192.57 samples/s on H100, 56.42 on L40 `[V]` | H100 TensorRT 27.9 ms; Jetson AGX Thor 93.8 ms (card), 76.8 ms or 35.6 ms with NVFP4 (repo) `[V]` | F02-37, F02-39, F02-40, F02-41, F02-42 |
| pi0.7 (Apr 2026) | ~5B `[A]` | not published | used without task fine-tuning in the paper | 38 ms to 127 ms on 1x H100; subgoal generator 1.25 s on 4x H100 `[A]` | F02-51, F02-52 |
| Gemini Robotics On-Device 2 (Jul 2026) | not published | not published | "a few hours", "less than 200 examples" (hardware not stated) `[V]` | not published | F02-76 |
| Gemini Robotics 2.5 (Nov 2026) | not published | not published | not published | not published | F02-74 |
| GR00T 2 Turbo (Nov 2026) | 2B `[V]` | not published | GR00T 2: 30-min LoRA on 1x RTX 5090 `[V]` | 38 ms on RTX 5090, 124 ms on Jetson Thor `[V]` | F02-45, F02-46 |
| ScaleVLA (Nov 2026) | 552B frozen backbone + trainable action DiT `[A]` | none of its own (frozen VLM) | 64x H200, batch 640, 5,000 to 20,000 steps `[A]` | 216 ms median on 4x H200 `[A]` | F02-72, F02-73 |

---

## 5. Teaching material

### Section 4, "Learning From Demonstrations"

**The plain-words idea.** A person steers the arm through the task some tens of times while the computer records, 30 times a second, what the cameras saw, where the joints were, and where the person told the joints to go next. Training fits a network that maps "what I see and where I am" to "where to move next", exactly as a regressor is fitted to any table of inputs and outputs (F02-1). The difficulty is that at run time the network's own small errors move the arm to places no demonstration visited, where it errs more (F02-2). Everything after plain behaviour cloning is a way to contain that: predict many actions per look (chunks, F02-5), and model the fact that people solve the same task in more than one way (CVAE, diffusion, flow matching; F02-8, F02-14, F02-19).

**Worked example on the arm (real figures, toy error rates labelled).**
- The data. One SO-101 action is 6 numbers, a target for each servo (F02-67). Recording runs at 30 Hz with two 640 x 480 cameras (F02-67). Fifty episodes (the LeRobot default, F02-67) of an assumed 20 seconds each `[illustration: episode length is ours]` give 50 x 20 x 30 = 30,000 training pairs.
- The loss. For one pair, behaviour cloning compares the predicted 6 numbers with the recorded 6 numbers; ACT uses the mean absolute difference (L1) over the whole predicted chunk (F02-8, F02-13).
- Compounding error without chunks. A 20-second pick-and-place is T = 600 decisions at 30 Hz. Suppose the policy makes a consequential mistake once in 1,000 decisions on states the demonstrations cover, epsilon = 0.001 `[illustration]`. If mistakes did not feed on each other the expected count would be T x epsilon = 0.6 per episode. The worst-case bound is T^2 x epsilon = 360,000 x 0.001 = 360, which exceeds T: the bound has stopped constraining anything, so nothing rules out drifting for the entire episode (F02-2, F02-3). The bound is a ceiling, not a forecast.
- With chunks. A 50-action chunk at 30 Hz covers 50 / 30 = 1.67 s (F02-58 for the chunk length, F02-67 for the rate). The same episode is now 600 / 50 = 12 decisions. With the same per-decision epsilon `[illustration: a chunk decision is harder than a single-step one, so equal epsilon is generous]` the bound is 12^2 x 0.001 = 0.144. That is the "k-fold reduction in the effective horizon" (F02-5) entering the bound squared: 50 squared = 2,500 times smaller.
- Forward passes per second. Executing whole 50-action chunks needs 30 / 50 = 0.6 inferences per second. Re-planning after 25 actions (as pi0 does at 50 Hz, F02-22) needs 1.2. Temporal ensembling needs 30, one per control step (F02-7, F02-13). ACT's ~0.01 s inference (F02-9) allows about 100 per second, so all three fit; pi0 at 73 ms (F02-21) allows about 13.7, so ensembling at 30 Hz does not fit; pi0-FAST at 750 ms (F02-27) allows 1.3, so even full-chunk execution at 0.6 per second leaves only 45% slack `[derived: 0.6 x 0.75 s = 0.45 of each second spent inferring]`.
- Multimodality, in one picture. `[illustration]` Half the demonstrations carry the block left of the cup's rim and half right. An L2 regressor's best single answer is the mean path, straight at the rim. A CVAE picks a mode through z; a diffusion or flow policy starts from random noise and lands on one path or the other (F02-8, F02-14).
- Tokens. The same 50 x 6 chunk is 300 tokens under per-number binning, about 30 under FAST (F02-25, F02-26).

**The mechanism (which tensor goes where).**
1. ACT (F02-8, F02-11 to F02-13). Inputs: camera images through a ResNet-18 into feature tokens; joint positions (6) through a linear layer; a latent z (32 numbers). A transformer encoder (4 layers, width 512) reads them; a transformer decoder emits `chunk_size` x 6 numbers. Training only: a second encoder reads the demonstrated chunk plus joints and outputs the mean and variance of z; loss = L1(chunk) + 10 x KL(z || N(0, I)). Inference: z = 0, one pass.
2. Diffusion Policy (F02-14 to F02-17). Tensor being denoised: (horizon, 6). Training: add noise eps^k to a demonstrated chunk at a random level k in 1..100, predict eps^k, loss = MSE. Inference: start from N(0, I), apply A^{k-1} = alpha (A^k - gamma eps_theta(O, A^k, k) + N(0, sigma^2 I)) for K steps (100 by LeRobot default, 10 to 16 with DDIM in the paper), execute the first T_a actions, repeat.
3. Flow matching (F02-19, F02-20, F02-24). Tensor: (50, 32), the 6 real dimensions zero-padded (F02-23). Training: draw tau from a Beta distribution, form tau A + (1 - tau) eps, regress the network output onto A - eps, loss = MSE. Inference: 10 Euler steps of size 0.1 from noise; the image and text prefix is encoded once and cached.
4. FAST (F02-26). Per joint, DCT over the 50 samples; scale and round the coefficients; flatten; BPE-compress with a vocabulary of 1,024 (the paper's default, "BPE vocabulary size 1024", Section V); the language model emits those tokens one at a time; decode by inverting each step.

**What it costs in compute.**
- ACT: ~80M parameters, ~5 h on one 11 GB GPU, ~10 ms per inference (F02-9). Training loads GPU tensor cores lightly and the CPU and video decoder heavily in proportion, because every sample decodes camera frames `[our reading; no source in this register measures the split]`.
- Diffusion Policy: 0.1 s per inference at 10 DDIM steps on an NVIDIA 3080 (F02-16); LeRobot's default of 100 steps is ten times that many network passes (F02-17).
- Flow VLA: pi0 73 ms on an RTX 4090, of which 46 ms is vision and language prefix and 27 ms the ten action steps (F02-21); more than 8 GB of GPU memory to run (F02-54).
- Token VLA: ~750 ms per chunk on the same GPU, 5x fewer training GPU-hours (F02-27).
- All of these are GPU tensor-core workloads at inference. None uses ray tracing. Camera capture and frame decode are CPU or video-engine work that the cited latencies do not include unless stated (GR00T's table does include "Data Processing", 6.2 ms on an H100 host and 8.21 ms on a Thor, F02-40).

### Section 5, "Vision-Language-Action Models"

**The plain-words idea.** A VLA starts from a model that already reads images and text, and adds two things: a way to feed in the robot's joint readings, and a head that outputs an action chunk instead of words (F02-32). The language instruction ("put the block in the cup") becomes an input, so one set of weights can do many tasks, and pretraining on many robots means a new arm needs tens of demonstrations where a from-scratch policy needs them for every task (F02-60, F02-63). Because reading the scene is slow and moving must be fast, every current design separates a slow part that understands from a fast part that moves; designs differ in where they cut (F02-33, F02-48, F02-78, F02-45).

**Worked example on the arm.**
- Inputs to SmolVLA for the block-in-cup task: 2 camera frames, each padded and resized to 512 x 512 (F02-62); the instruction text, up to 48 tokens (`tokenizer_max_length: int = 48`, same config file); the 6 joint positions padded to 32 (F02-62). Output: a (50, 32) tensor of which the first 6 columns are the SO-101's joints, covering 1.67 s at 30 Hz.
- One inference = one pass through the vision encoder and the first 16 VLM layers, then 10 flow steps through the ~100M action expert (F02-58, F02-62).
- Same task on GR00T N1.7: output is 40 actions (F02-38), 1.33 s at 30 Hz `[derived]`; 4 denoising steps; on a Jetson AGX Thor with TensorRT 93.8 ms per inference by the model card (F02-40), so a new chunk can be ready about every 3 control steps; with the LeRobot example's `n_action_steps=16` (F02-81) the policy runs 30 / 16 = 1.9 times per second and the GPU is busy 1.9 x 0.094 = 18% of the time `[derived]`.
- Same task on pi0 through LeRobot: 73 ms on an RTX 4090 (F02-21) for 50 actions; at one inference per chunk that is 0.6 x 0.073 = 4.4% duty `[derived]`.
- The slow/fast split in numbers, GR00T N1.7 on an H100 in eager PyTorch: backbone (System 2) 31.3 ms, action head (System 1) 48.2 ms for 4 steps (F02-40). With TensorRT: 8.8 ms and 12.3 ms. "Fast" names the output rate, not a cheaper network.
- Fine-tune cost for this task: SmolVLA ~4 h on one A100 for 20k steps (F02-63); GR00T N1.7 needs a 40 GB+ GPU (F02-42); pi0.5 an 80 GB GPU at LeRobot's example batch size (F02-57); ACT a few hours on any single GPU (F02-66).

**The mechanism.**
1. Prefix: image patches through a vision transformer become tokens; instruction text becomes tokens; both go through the VLM once per chunk. In pi0 these keys and values are cached (F02-20).
2. State: joint readings are projected to one token (pi0, F02-18) or tokenised as text (pi0.5: `discrete_state_input` is set when `pi05` is true, openpi `pi0_config.py` line 41).
3. Action head: H action tokens (50 for pi0, pi0.5, pi0.7, SmolVLA; 40 for GR00T N1.7; 16 for GR00T N1) attend to the prefix and to each other; the head is run once per denoising step (10, 10, 5, 10, 4, 4 respectively: F02-20, F02-29, F02-51, F02-58, F02-38, F02-34).
4. Cross-embodiment: zero-pad to a maximum dimension (pi0: 18 in the paper, 32 in code; GR00T N1.7: 132; F02-23, F02-38), or per-robot encoder and decoder MLPs (GR00T, F02-33), or per-robot soft prompts (X-VLA, F02-70).
5. Where the slow system lives: same network, text subtask first (pi0.5, F02-48); separate VLM on the same GPU (GR00T N1.x, F02-33); cloud VLM plus on-robot decoder (Gemini Robotics, F02-78); an external reasoning agent calling the action model as a tool (Gemini Robotics 1.5 and 2, GR00T 2; F02-79, F02-75, F02-45).

**What it costs in compute.** See the compute table in section J. The shape to teach: pretraining runs from about 6,100 A100-hours (X-VLA, F02-71) through 30,720 GB200 GPU-hours (GR00T N1.7, F02-39) to about 50,000 H100-hours (GR00T N1, F02-34), all vendor or author reported; fine-tuning for one arm and one task is one GPU for hours (F02-63, F02-42); inference is 10 to 130 ms per chunk on one GPU for 0.45B to 5B models (F02-9, F02-21, F02-40, F02-52), and it loads GPU tensor cores and GPU memory (8 GB for pi0, 16 GB for GR00T N1.7: F02-54, F02-42). Physical Intelligence and Google DeepMind publish no pretraining compute (U5, U6).

---

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 01, section 2.4 | GR00T N1.7's System 1 is "A 32-layer DiT" (from the Hugging Face blog) | The blog does say 32. The code at the newest commit sets `"num_layers": 16` and the README says the head "changes from `32` to `16` diffusion layers"; the deployment README says "32 DiT blocks". Unresolved between first-party sources; do not print a bare 32. | F02-38 |
| seed 01, sections 2.4, 17 | N1.7 "~28 Hz on Jetson AGX Thor with TensorRT" | True only for the "TensorRT optimized + mixed NVFP4" build (35.6 ms). Plain TensorRT full pipeline is 76.8 ms (repo, 2 cameras, LIBERO) or 93.8 ms / 10.7 Hz (model card, 1 camera); the hardware guide says 12.4 Hz. | F02-40, F02-41 |
| seed 01, table row GR00T N1.7 | Training compute "not published" | Model card energy estimate: "64 GB200 nodes * 4 gpus per node ... 120 hours". | F02-39 |
| seed 01, section 2.4 | N1.7 chunk length not recorded (N1's H = 16 implied for the line) | N1.7 `action_horizon` is 40; state and action padding is 132. | F02-38 |
| seed 01, section 12.7 | X-VLA "Pretraining data and compute not on the abstract page" | Appendix G: 64 A100, batch 1024, about 4 days; 290K episodes. | F02-71 |
| seed 01, section 12.6 | "NOT VERIFIED: Diffusion Policy (Chi et al. 2023) training/inference numbers" | Fetched: 100 training iterations; 10 DDIM inference iterations give 0.1 s on an NVIDIA 3080; real-robot runs use 16. | F02-16 |
| seed 01, section 2.5 | GR00T 2 dated "9 Nov 2026" | The project page prints only "November 2026". The day was not confirmed. | F02-44, U2 |
| seed 01, throughout | arXiv HTML URLs without versions (2410.24164, 2503.14734, 2511.14759, 2604.15483, 2502.19645) | Latest versions are v4, v2, v2, v2, v2. Quotes here are from those versions. | pinned sources |
| seed 01, section 18 | "GR00T N1.5 on SO-101 ... ~25 GB VRAM, 1 GPU, 10,000 max steps" as a current fine-tune row | LeRobot v0.7.0 removed N1.5 support; the supported path is N1.7 with a 40 GB+ GPU. The N1.5 blog was not re-fetched. | F02-47, F02-42 |
| seed 01, section 17 | SmolVLA "async inference" as a LeRobot feature | The module `lerobot.async_inference` was removed in v0.7.0 and replaced by `lerobot-policy-server` and `--inference.type=remote`. | F02-62 |
| seed 01, section 3.6 | openpi cited at the repository root, undated | Pinned at SHA 215abfb (last commit 2026-08-24); README content unchanged in the parts quoted. No pi*0.6 or pi0.7 weights. | F02-53, F02-54 |

Seed claims confirmed unchanged on re-fetch: ACT numbers (F02-6, F02-9, F02-10); pi0 size, H = 50, 10 steps, 73 / 86 ms (F02-18 to F02-21, F02-32); FAST 30 tokens, 750 ms, 5x, 4 days on 8 H100 (F02-26 to F02-28); GR00T N1 numbers (F02-33, F02-34); N1.5 and N1.6 training lines (F02-35, F02-36); pi0.5 280k + 80k (F02-49); pi*0.6 sizes (F02-50); pi0.7 sizes and latencies (F02-51, F02-52); SmolVLA sizes, compute and async timing (F02-58 to F02-61); OFT (F02-68, F02-69); ScaleVLA (F02-72, F02-73); GR00T 2 and Turbo (F02-44 to F02-46); Gemini Robotics posts (F02-74 to F02-78).

## 7. Mental models worth teaching

1. **Behaviour cloning is regression whose test set is written by its own mistakes.** The loss is ordinary; the trouble is that outputs become inputs (F02-1, F02-2).
2. **Errors compound with the square of the number of decisions, so make fewer decisions.** A chunk of k actions divides the horizon by k and the worst-case bound by k squared (F02-3, F02-5, F02-6).
3. **Chunk length is a dial between smooth and responsive.** Long chunks commit the arm; short ones re-decide often. Every policy exposes two numbers, how many actions it predicts and how many it executes before looking again (F02-11, F02-15, F02-17, F02-51).
4. **People do the same task several ways, and an averaging loss produces a way nobody did.** CVAE, diffusion and flow matching are three ways to pick one mode instead of the mean (F02-8, F02-14, F02-19); OFT shows a plain regressor can still win on some benchmarks (F02-68).
5. **Flow matching is diffusion with a straight path and few steps.** Train on the direction from noise to data; integrate 4 to 10 steps at run time (F02-19, F02-20, F02-38, F02-51).
6. **Tokens are cheap to train and slow to run; flows are the reverse.** 5x fewer training GPU-hours against 750 ms versus under 100 ms; pi0.5 trains with tokens and deploys with flow (F02-27, F02-49).
7. **A VLA is a VLM with joint readings in and an action chunk out** (F02-18, F02-32).
8. **"Fast and slow" is about where you cut, and the cut keeps moving outward.** Inside one model (pi0.5), two modules on one GPU (GR00T N1.x), cloud and robot (Gemini Robotics), an agent calling the action model as a tool (GR00T 2, Gemini Robotics 2) (F02-48, F02-33, F02-78, F02-45, F02-75).
9. **The published frontier and the downloadable frontier are different lists.** November 2026 papers and posts: pi0.7, GR00T 2, Gemini Robotics 2.5, ScaleVLA. Downloadable and fine-tunable for an SO-101: ACT, SmolVLA, pi0.5, GR00T N1.7, X-VLA (F02-53, F02-44, F02-74, F02-65).
10. **Fine-tuning cost is set by the backbone you leave frozen.** SmolVLA and GR00T N1.7 freeze the VLM by default and fit one GPU; unfreezing pushes N1.7 from under 35 GB to 80 GB+ (F02-62, F02-42).

## 8. Contradictions between sources

| Topic | Source A | Source B | Reading |
|---|---|---|---|
| ACT decoder depth | Paper Table III: "# decoder layers 7" (F02-6) | LeRobot code: `n_decoder_layers: int = 1`, with a comment that the original code only used the first layer (F02-12) | Code wins. The working model has 1 decoder layer. |
| pi0 action dimension | Paper: padded to 18 (F02-23) | openpi code: `action_dim: int = 32` (F02-23) | Different artefacts: the paper's internal model versus the released base checkpoints. Use 32 for anything the reader runs. |
| Flow time direction | pi0 paper: tau = 0 is noise, tau = 1 is data (F02-20) | openpi code: t = 1 is noise, t = 0 is data, by its own comment (F02-24) | Same method, mirrored axis. State which convention a formula uses. |
| GR00T N1.7 DiT depth | HF blog: "A 32-layer DiT"; deployment README: "32 DiT blocks" (F02-37, F02-41) | Repo config: `"num_layers": 16`; README: "changes from `32` to `16` diffusion layers" (F02-38) | Unresolved (U1). |
| GR00T N1.7 on Jetson AGX Thor | Model card: 93.8 ms, 10.7 Hz, TensorRT full pipeline, 1 camera (F02-40) | Repo: 76.8 ms TensorRT, 35.6 ms with NVFP4, 2 cameras, LIBERO checkpoint; hardware guide: 12.4 Hz; README headline ~28 Hz (F02-41) | Different checkpoints, camera counts and builds, measured at different times. Quote a figure only with its build. |
| GR00T N1.7 parameters | Card text: "3,000,000,000" | Card file metadata: 3,144,016,000 (F02-37) | Rounding. Use 3.14B when precision matters. |
| LeRobot Diffusion defaults | Code: `horizon = 64`, `n_action_steps = 32` (F02-17) | Same file's comment: `drop_n_last_frames: int = 7  # horizon - n_action_steps - n_obs_steps + 1`, which is 31 for those values; paper: T_p = 16, T_a = 8 (F02-15) | The comment and the 7 predate the longer defaults. Not checked whether this affects training (U9). |
| Temporal ensembling | ACT: improves ACT (F02-7) | pi0: "found that it hurt policy performance" (F02-22) | Model-dependent. LeRobot leaves it off by default (F02-13). |
| GR00T N1 "120 Hz" | Paper: System 1 "generates closed-loop motor actions at a higher frequency (120Hz)" (F02-33) | Same paper: 63.9 ms per 16-action chunk (F02-34), about 15.6 samplings per second | 120 Hz is an action output rate, reachable because each sampling yields 16 actions. |

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 (CLOSED by wave 2: 32 layers in the released checkpoint's config.json; 16 is the code default, see F02-38) | GR00T N1.7 action head depth: 16 or 32 | F02-38 | Read `gr00t/model/` for how `num_layers` and `use_alternate_vl_dit` build the stack, or load `nvidia/GR00T-N1.7-3B` config.json and count blocks. |
| U2 | GR00T 2's announcement day and full-model parameter count | F02-44, F02-45 | The whitepaper PDF linked from the project page (`assets/gr00t2_whitepaper.pdf`, not downloaded here), or the December code release. |
| U3 | Whether GR00T 2 weights will be open and under what licence | F02-44 | December 2026 release. |
| U4 | Wall-clock time and GPU-hours for GR00T N1.5 and N1.6 pretraining; GPU type for N1.6 | F02-35, F02-36 | Not on the project pages; would need a paper or model card. |
| U5 | Pretraining compute for pi0, pi0.5, pi*0.6, pi0.7 | F02-49 to F02-52 | Not in the papers' passages read. Physical Intelligence has not published it as far as this research located. |
| U6 | Parameter counts, latency and adaptation hardware for Gemini Robotics 2, 2.5 and On-Device 2 | F02-74 to F02-76 | Not in the blog posts. A tech report for 2 or 2.5 was not searched for to completion. |
| U7 (CLOSED by wave 2 to 2026-10-20: none named; Pi API beta of 2026-10-13, see F02-53) | Whether Physical Intelligence released anything after pi0.7 | F02-51, F02-53 | The company site (`pi.website`, `physicalintelligence.company`) returned HTTP 429 and a bot checkpoint on every attempt on 2026-11-20. A web search surfaced, as a snippet only, a "Pi API beta" post dated 13 October 2026 offering hosted fine-tuning and inference; it could not be fetched and is not cited as fact. Close by reading the blog index in a browser. |
| U8 | What the LeRobot v0.7.0 policies not read here are (cosmos3, dm05, eo1, evo1, fastwam, fineart_vla, flux3, g05, gaussian_actor, lawam, lingbot_va, lingbot_vla_v2, longwam, molmoact2, multi_task_dit, vla_jepa, wall_oss_05, wall_x) and whether any is a better SO-101 choice | F02-65 | Read each `docs/source/policy_*_README.md` at tag v0.7.0 and the v0.7.0 release blog (https://huggingface.co/blog/lerobot/lerobot-release-v070, not fetched). The world-model streams should own cosmos3, fastwam, longwam, lawam and vla_jepa. |
| U9 | Whether LeRobot Diffusion's `drop_n_last_frames = 7` with `horizon = 64` is intended | F02-17 | Read `modeling_diffusion.py` and the commit that changed the defaults. |
| U10 | SmolVLA inference latency on a named device | F02-58 | Not in the passages read; the paper's efficiency section and the LeRobot docs were not searched to completion. |
| U11 | ACT publication venue; Diffusion Policy journal venue; pi0, FAST, pi0.5 venues | pinned sources | Not confirmed in the fetched PDFs; listed as preprints. |
| U12 | MEM (arXiv 2603.03596) content | F02-56 | Paper not fetched; only LeRobot's code comment was read. |
| U13 | DreamZero (arXiv 2602.15922) beyond existence | currency table | Listing fetched (v1, 17 Feb 2026, title "World Action Models are Zero-shot Policies"); body not re-read here because the world-model stream owns it. |

## 10. Reading path for Carlos

1. **ACT paper, arXiv 2304.13705v1, Section IV and Fig. 4 and Fig. 5** (about 2 pages). Chunking, temporal ensembling and the CVAE in the authors' words; Fig. 8(a) is the 1% to 44% ablation.
2. **DAgger paper, arXiv 1011.0686v3, Section 1 and Section 2.1 only** (one page). The T^2 epsilon sentence and Theorem 2.1. Skip the rest.
3. **LeRobot `configuration_act.py` at v0.7.0** (178 lines). Every knob from step 1 as a named default; the decoder-layer comment at lines 108 to 111.
4. **Diffusion Policy, arXiv 2303.04137v5, Fig. 1 and Sections 3.1 to 3.4.** The multimodality picture and the T_o / T_p / T_a definitions.
5. **pi0 paper, arXiv 2410.24164v4, Section IV and Appendix D, Table I.** One page of flow matching and the 73 ms breakdown.
6. **openpi `src/openpi/models/pi0.py` at SHA 215abfb, lines 188 to 279.** The whole of flow matching for actions in about 90 lines; read `compute_loss` then `sample_actions`.
7. **FAST paper, arXiv 2501.09747v1, Section IV (the toy case study) and Fig. 4.** Why binning fails at high rates, then the DCT plus BPE pipeline.
8. **GR00T N1 paper, arXiv 2503.14734v2, Section 1 and Fig. 2.** The System 1 / System 2 picture.
9. **`nvidia/GR00T-N1.7-3B` model card, "System Requirements and Performance" table.** The per-stage latency split on eight devices; the best single table for "which part of the machine does what".
10. **SmolVLA paper, arXiv 2506.01844v1, Sections 3.3 and 4.1, Tables 3 and 4; then LeRobot `docs/source/smolvla.mdx` at v0.7.0.** The result closest to the dive's task, then the commands.
11. **GR00T 2 project page, sections "Model Architecture" and "Think Slow, Move Fast".** Where the VLA line turns into a world-action model.
12. **ScaleVLA, arXiv 2611.21607v1, abstract and Fig. 1.** The newest data point on backbone size.

## 11. Source list by tier

**Tier 1: code at pinned refs, first-party docs and model cards**
- huggingface/lerobot at tag v0.7.0, SHA 410c095eacc0011d998a73383eb94abed2715af0: `src/lerobot/policies/{act,diffusion,smolvla,pi0,pi05,pi0_fast,groot,xvla,rtc}/`, `src/lerobot/robots/so_follower/so_follower.py`, `docs/source/{act,smolvla,pi0,pi05,groot,xvla,il_robots,peft_training}.mdx`; release notes https://github.com/huggingface/lerobot/releases/tag/v0.7.0
- Physical-Intelligence/openpi, repository root https://github.com/Physical-Intelligence/openpi at SHA 215abfb217dbac7d5f1273282331b9b1866c0479: `README.md`, `src/openpi/models/pi0.py`, `src/openpi/models/pi0_config.py`
- NVIDIA/Isaac-GR00T, repository root https://github.com/NVIDIA/Isaac-GR00T at SHA 708617f5716c63fc0a327391492ea2b91977ae90: `README.md`, `gr00t/configs/model/gr00t_n1d7.py`, `scripts/deployment/README.md`, `getting_started/hardware_recommendation.md`, `examples/SO100/README.md`
- Hugging Face model card nvidia/GR00T-N1.7-3B at revision 373d34e2723d928870157d07dc216a19a624b5bb
- Hugging Face model registry API (author lerobot; author nvidia)

**Tier 2: first-party lab and vendor pages**
- https://research.nvidia.com/labs/gear/gr00t-2/
- https://research.nvidia.com/labs/gear/gr00t-n1_5/
- https://research.nvidia.com/labs/gear/gr00t-n1_6/
- https://huggingface.co/blog/nvidia/gr00t-n1-7
- https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/
- https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/
- https://deepmind.google/blog/gemini-robotics-15-brings-ai-agents-into-the-physical-world/
- https://deepmind.google/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/

**Tier 3: papers**
- Peer-reviewed: arXiv 1011.0686v3 (AISTATS 2011); arXiv 2506.07339v2 (NeurIPS 2025, abstract only)
- Preprints: arXiv 2304.13705v1, 2303.04137v5, 2410.24164v4, 2501.09747v1, 2503.14734v2, 2504.16054v1, 2511.14759v2, 2604.15483v2, 2506.01844v1, 2502.19645v2, 2510.10274v1, 2611.21607v1, 2503.20020v1; listings only: 2602.15922v1, 2406.09246v3

**Tier 4: used only to locate sources, never cited as fact**
- Two web searches for Physical Intelligence releases after pi0.7 (results pointed at pi.website, which could not be fetched; see U7).
