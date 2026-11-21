# 11c Formulas for the systems sections: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** the equations typeset in sections 3, 12, 13, 14, 16 and 21 that registers 01 to 10 do not already hold verbatim.
- **ID range:** F11-200 to F11-299.
- **Method:** each source was downloaded with `curl` at a pinned commit or an explicit arXiv version and the equation was read from the file's own TeX or reStructuredText.
- **Quote policy:** verbatim, with house normalisation (straight quotes, plain hyphens). Equations are given as the source's TeX.

## 2. Entries

**F11-200. MuJoCo's general equations of motion in continuous time are M v-dot + c = tau + J^T f, where v is the joint velocity, tau the applied force (passive, actuation, external), c the bias force (Coriolis, centrifugal, gravitational), M the inertia in joint space, J the constraint Jacobian and f the constraint force. The transpose of the Jacobian maps a constraint force to a force in joint coordinates.**
- Location: MuJoCo docs, Computation chapter, "General framework", equation labelled `eq:motion` and the symbol table above it (`doc/computation/index.rst` at tag 4.0.1)
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst | Tier 1, first-party docs at a pinned tag | definition | "The general equations of motion in continuous time are M \dot{v} + c = \tau + J^T f" ... "The transpose of the Jacobian maps force vectors from constraint to joint coordinates: the constraint force f maps to force J^T f in joint coordinates." ... symbol table: "v ... joint velocity ... mjData.qvel", "\tau ... applied force: passive, actuation, external", "c(q, v) ... bias force: Coriolis, centrifugal, gravitational ... mjData.qfrc_bias", "M(q) ... inertia in joint space ... mjData.qM", "J(q) ... constraint Jacobian ... mjData.efc_J", "f(q, v,\tau) ... constraint force ... mjData.efc_force" (accessed 2026-11-20)
- Use in dive: section 12, the one equation of the physics step, in MuJoCo's own notation.

**F11-201. MuJoCo's documentation gives semi-implicit Euler as v_{t+h} = v_t + h a_t, q_{t+h} = q_t + h v_{t+h}, with a = v-dot the joint acceleration from forward dynamics and h the timestep. The position is updated with the new velocity. The docs call this formulation "strictly better" than explicit Euler "and standard in physics simulation".**
- Location: MuJoCo docs, Computation chapter, "Numerical integration", equation labelled `eq_semimplicit` (`doc/computation/index.rst` at tag 4.0.1)
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst | Tier 1, first-party docs at a pinned tag | definition | "The end result of forward dynamics is the joint acceleration a=\dot{v} ... These are used to advance the simulation time from t to t+h" ... "the following formulation, known as semi-implicit Euler is strictly better, and standard in physics simulation: v_{t+h} = v_t + h a_t, q_{t+h} = q_t + h v_{t+h}" ... "in semi-implicit Euler, the position is updated using the new velocity." (accessed 2026-11-20)
- Use in dive: section 12, the integrator lines of the step, after the equation of motion (F11-200). The elbow numbers beside it are the figure's illustration.

**F11-202. The dynamics randomization objective of Peng et al.: the policy is trained to maximise the expected return across a distribution rho_mu of dynamics parameters mu, written E_{mu ~ rho_mu}[ E_{tau ~ p(tau | pi, mu)}[ sum_{t=0}^{T-1} r(s_t, a_t) ] ]. A set of parameters mu is sampled at the start of each episode and held fixed for the episode.**
- Location: arXiv 1710.06537v3, section IV "Method", the unnumbered displayed equation after "maximize the expected return across a distribution of dynamics models"; section IV-C "Dynamics Randomization", first sentences; section III "Background" for the symbols
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1710.06537v3 | Tier 3, peer-reviewed (ICRA 2018) | definition | "instead of training a policy under one particular dynamics model, we train a policy that can perform a task under a variety of different dynamics models. First we introduce a set of dynamics parameters \mu that parameterizes the dynamics of the simulation \hat{p}(s_{t+1} | s_t, a_t, \mu). The objective is then modified to maximize the expected return across a distribution of dynamics models \rho_\mu, \mathop{\mathbb{E}}_{\mu \sim \rho_\mu} \left[\mathbb{E}_{\tau \sim p(\tau | \pi, \mu)} \left[ \sum_{t = 0}^{T - 1} r(s_t, a_t) \right] \right]" ... "At the start of each episode, a random set of dynamics parameters \mu are sampled according to \rho_\mu and held fixed for the duration of the episode." ... Background: "p(\tau | \pi) represents the likelihood of a trajectory \tau = (s_0, a_0, s_1, ..., a_{T - 1}, s_T) under the policy \pi" (TeX source of v3 read from the arXiv e-print; the abstract page lists DOI 10.1109/ICRA.2018.8460528; accessed 2026-11-20)
- Use in dive: section 14, the one formula for what domain randomisation optimises. The equation has no number in the paper. The paper is the physics-randomisation reference the Isaac Lab paper names (F06-67).

**F11-203. LeRobot's `wilson_interval` computes the Wilson score interval for a binomial proportion with no continuity correction: p = n_success / n_trials; centre = (p + z^2 / (2 n)) / (1 + z^2 / n); half-width = z sqrt(p (1 - p) / n + z^2 / (4 n^2)) / (1 + z^2 / n); the interval is centre minus and plus the half-width, clipped to [0, 1]. The default confidence is 0.95.**
- Location: `src/lerobot/utils/eval_stats.py` at v0.7.0, function `wilson_interval`, lines 45 to 84
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/eval_stats.py | Tier 1, code at a pinned tag | code behaviour | "Wilson score interval for a binomial proportion." ... "No continuity correction is applied." ... `p = n_success / n_trials` / `z2 = z * z` / `denominator = 1.0 + z2 / n_trials` / `centre = (p + z2 / (2.0 * n_trials)) / denominator` / `half_width = z * math.sqrt(p * (1.0 - p) / n_trials + z2 / (4.0 * n_trials * n_trials)) / denominator` / `return (max(0.0, centre - half_width), min(1.0, centre + half_width))` (accessed 2026-11-20)
- Use in dive: section 16, the typeset interval formula beside the worked example of F06-97 (40 of 50). Extends F06-95, which holds the docstring's reasons for preferring this interval.
