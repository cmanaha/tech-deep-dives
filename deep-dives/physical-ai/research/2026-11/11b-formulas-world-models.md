# 11b Formulas for world models and JEPA: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** the equations typeset in section 6 "World Models: Predicting What Happens Next" and section 7 "JEPA: Predicting in Latent Space" that registers 01 to 10 do not already hold verbatim.
- **ID range:** F11-100 to F11-199.
- **Method:** the arXiv HTML rendering of the pinned version (`https://arxiv.org/html/2506.09985v1`) was downloaded with `curl` and the TeX of each equation was read from the `alttext` attribute of its MathML element, so every equation below is the paper's own TeX. Equations already held by register 03 (F03-2 equation 1, F03-18 equations 3 and 4, F03-23 equation 5, F03-36 LeWorldModel equations 1 to 3, F03-67 VICReg equation 6) were re-read against the same downloads (`2603.19312v3`, `2105.04906v3`) and match.
- **Quote policy:** verbatim, with house normalisation (straight quotes, plain hyphens). Equations are given as the paper's TeX.

## 2. Entries

**F11-100. The V-JEPA 2-AC teacher-forcing loss: over a 16-frame clip the predictor makes T = 15 next-latent predictions, each from the true actions, end-effector states and frozen-encoder feature maps up to that frame, and the loss is the mean L1 distance between each prediction and the encoder's feature map of the real next frame.**
- Location: V-JEPA 2 paper, section 3.1 "Loss function", equation (2)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "We use V-JEPA 2 encoder E(.) as an image encoder and encode each frame independently in a given clip to obtain a sequence of feature maps (z_k) k in [16], where z_k := E(x_k) ... Note that the encoder is kept frozen during this post-training phase. The sequence of feature maps, end-effector states, and actions are temporally interleaved as (a_k, s_k, z_k) k in [15] and processed with the transformer predictor network P_phi(.) to obtain a sequence of next state representation predictions (z-hat_k+1) k in [15]. The scalar-valued teacher-forcing loss function is finally computed as \mathcal{L}_{\text{teacher-forcing}}(\phi) \coloneqq \frac{1}{T}\sum^{T}_{k=1}\lVert\hat{z}_{k+1}-z_{k+1}\rVert_{1} = \frac{1}{T}\sum^{T}_{k=1}\left\lVert P_{\phi}\left(\left(a_{t},s_{t},E(x_{t})\right)_{t\leq k}\right)-E(x_{k+1})\right\rVert_{1}, (2) with T = 15." (accessed 2026-11-20)
- Use in dive: section 6, the one next-latent prediction loss of the latent family. Symbols: x_k frame k, z_k its feature map from the frozen encoder E, a_k the action between frames k and k + 1, s_k the end-effector state at frame k, P_phi the predictor with weights phi, z-hat_k+1 its prediction. Section 7 cites it as the first term of equation (4) (F03-18).

**F11-101. The V-JEPA 2-AC plan is the action sequence that minimises the energy of equation (5): (a*_i) i in [T] := argmin over a-hat_1:T of E(a-hat_1:T; z_k, s_k, z_g). The minimisation is done with the cross-entropy method: Gaussians over the action coordinates start at zero mean and unit variance and are refit to the top-k trajectories.**
- Location: V-JEPA 2 paper, section 3.2 "Energy minimization", the sentence carrying equation (5); Figure 7 caption
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "Given a planning horizon, T, we optimize a sequence of robot actions, (a^{\star}_{i})_{i\in[T]}, by minimizing a goal-conditioned energy function, \mathcal{E}(\hat{a}_{1:T};\ z_{k},s_{k},z_{g}) \coloneqq \lVert P(\hat{a}_{1:T};s_{k},z_{k})-z_{g}\rVert_{1}, (5) such that (a^{\star}_{i})_{i\in[T]} \coloneqq \text{argmin}_{\hat{a}_{1:T}}\ \mathcal{E}(\hat{a}_{1:T};\ z_{k},s_{k},z_{g})."; Figure 7 caption: "The L1 loss is optimized with respect to the actions (a_k) k in [T] using the cross-entropy method (Rubinstein, 1997). Specifically, in each planning step, we sample the action coordinates at each point in the planning horizon from a sequence of Gaussian distributions initialized with zero mean and unit variance. The population statistics of the top-k actions trajectories are used to update the mean and variance of the Gaussian distributions." (accessed 2026-11-20)
- Use in dive: section 7, the second line of the planning formula (the argmin) beside F03-23 (the energy itself).

**F11-102. The rollout notation of equation (3): P_phi(a-hat_1:T; s_k, z_k) is the last predicted feature map after running the predictor autoregressively over T actions from (s_k, z_k); with T = 2 the gradient passes through one recurrent step.**
- Location: V-JEPA 2 paper, section 3.1 "Loss function", the sentences around equations (3) and (4)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "For simplicity of exposition and with slight overloading of notation, let P_phi(a-hat_1:T; s_k, z_k) denote the final predicted state representation obtained by autoregressively running V-JEPA 2-AC with an action sequence (a-hat_i) i in [T], starting from (s_k, z_k). We can now denote the rollout loss as: \mathcal{L}_{\text{rollout}}(\phi) \coloneqq \lVert P_{\phi}(a_{1:T},s_{1},z_{1})-z_{T+1}\rVert_{1}. (3) In practice we use T = 2 for computing the rollout loss, such that we only differentiate the predictor through one recurrent step. The overall training objective is thus given by L(\phi) \coloneqq \mathcal{L}_{\text{teacher-forcing}}(\phi)+\mathcal{L}_{\text{rollout}}(\phi), (4) and is minimized with respect to the predictor weights phi." (accessed 2026-11-20)
- Use in dive: section 7, the TeX of equations (3) and (4) and the meaning of P_phi with a sequence argument; extends F03-18.
