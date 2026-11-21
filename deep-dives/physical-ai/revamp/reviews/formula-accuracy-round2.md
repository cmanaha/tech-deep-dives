# Formula accuracy review, round 2: sections 4, 5, 6, 7 and 8

Review date: 2026-11-20. Scope: mathematical and attribution errors only, in
`src/sections/LearningFromDemonstrations.tsx` (section 4), `VisionLanguageAction.tsx` (5),
`WorldModels.tsx` (6), `Jepa.tsx` (7) and `RobotRl.tsx` (8).

## How the sources were checked

Fetched today with `curl` (generic client name) and read as the paper's own TeX from the `alttext`
of the arXiv HTML rendering at the pinned version:

- pi0, https://arxiv.org/html/2410.24164v4 (section IV)
- V-JEPA 2, https://arxiv.org/html/2506.09985v1 (equations 1 to 5)
- LeWorldModel, https://arxiv.org/html/2603.19312v3 (equations 1 to 3)
- Recap, https://arxiv.org/html/2511.14759v2 (sections III, IV-A, IV-B, V-D, appendix A-F)
- Diffusion Policy, https://arxiv.org/html/2303.04137v5 (equations 3 to 5, section headings)
- VICReg, https://arxiv.org/html/2105.04906v3 (equations 5 and 6)
- ACT, https://arxiv.org/html/2304.13705v1 (algorithm 1, section IV-C) and the v1 PDF (figure numbers)
- Ross, Gordon and Bagnell, https://arxiv.org/html/1011.0686v3 (section 2, equation 2, theorem 2.1)
- PPO, https://arxiv.org/pdf/1707.06347v2 (PDF text, equations 6 and 7; no HTML rendering exists)

Not re-fetched: the two code sources (vjepa2 `app/vjepa/train.py` for the EMA update, le-wm
`module.py` for SIGReg). Those two formulas were checked against the register's verbatim code
quotes (F03-8, F03-38) and my own knowledge of the mathematics.

Result in one line: no displayed formula is wrong against its source. Every finding below is
about a worked example, a symbol definition, or an attribution.

## Findings, most serious first

### 1. Section 4, chunking toy example: "10,000 times lower" compares two different units

- File and line: `src/sections/LearningFromDemonstrations.tsx`, lines 543 to 549.
- Text: "With the same epsilon the ceiling is 6 x 6 x 0.001 = 0.036, which is 100 x 100 = 10,000 times lower."
- What is wrong: the arithmetic is right, the comparison is not. Theorem 2.1 bounds a total cost
  whose per-decision cost lies in [0, 1], so `T^2 epsilon` is counted in decisions. The first
  ceiling, 360, is in ticks (one decision per tick). The second, 0.036, is in chunk decisions, and
  one wrong chunk decision is up to 100 wrong ticks. In ticks the chunked ceiling is
  0.036 x 100 = 3.6, which is 100 times lower than 360. In general, cutting the horizon from T to
  T / k lowers the ceiling by k squared in decisions and by k in ticks.
- Source: https://arxiv.org/html/1011.0686v3, section 2 (definition of J with C bounded in [0, 1])
  and theorem 2.1. Fetched today for the definition; the unit conversion is my own derivation.
- Confidence: high on the mathematics; medium on whether you want the correction in ticks or a
  one-sentence caveat.
- Suggested replacement: "With the same epsilon the ceiling is 6 x 6 x 0.001 = 0.036 wrong
  decisions. A wrong decision now spoils up to 100 ticks, so in ticks the ceiling is 3.6, which
  is 100 times lower than 360."

### 2. Section 4, Diffusion Policy citation points at the wrong sections for v5

- File and line: `src/sections/LearningFromDemonstrations.tsx`, line 683
  (`<Cite id="F02-14">Diffusion Policy paper, sections 3.1 and 3.2</Cite>`).
- What is wrong: in 2303.04137v5 the denoising and training description is section 2
  (2.1 "Denoising Diffusion Probabilistic Models", 2.2 "DDPM Training", 2.3 "Diffusion for
  Visuomotor Policy Learning"). Sections 3.1 and 3.2 of v5 are "Network Architecture Options" and
  "Visual Encoder". The formula's own cite two paragraphs later (line 699, section 2.3,
  equation 5) is right, so the two cites disagree with each other. Register F02-14 carries the
  same wrong location; F11-3 already notes it.
- Source: https://arxiv.org/html/2303.04137v5, section headings. Fetched today.
- Confidence: high.
- Suggested replacement: `Diffusion Policy paper, sections 2.1 to 2.3`.

### 3. Section 8, Recap formula: the whole-episode form is in appendix A-F, not section IV-B

- File and line: `src/sections/RobotRl.tsx`, lines 417 to 425 (prose and
  `source={... Recap paper, section IV-B, in this page's symbols}`).
- What is wrong: the formula itself and the prose around it are correct. Section IV-B holds only
  the indicator (the paper prints it as `p(I | A) = delta(A > epsilon_l)`). The n-step advantage is
  defined in section III, and the two forms the prose describes (N = 50 lookahead for
  post-training, N = T for pre-training) are in appendix A-F "Additional algorithm details".
  The cite under the formula names none of those.
- Source: https://arxiv.org/html/2511.14759v2, section III (advantage), section IV-B (indicator),
  appendix A-F ("During pre-training, we calculate the advantage estimate as ... setting N = T
  for each episode"; "We use N = 50 lookahead"). Fetched today.
- Confidence: high.
- Suggested replacement for the cite text: `Recap paper, section IV-B and appendix A-F, in this
  page's symbols`. Optional sentence, since the number is now verified: "For the rollouts
  collected on the robot the paper looks 50 steps ahead."

### 4. Sections 6 and 7: T silently changes meaning between the two halves of one formula

- File and line: `src/sections/WorldModels.tsx`, line 739 (T = 15 guesses per clip);
  `src/sections/Jepa.tsx`, lines 1196 to 1207 (T = 2 rollout steps) and 1275 (T the planning
  horizon).
- What is wrong: section 6 defines T as 15 inside the teacher-forcing loss. Section 7 then
  writes `L(phi) = L_teacher-forcing + L_rollout` and says "T = 2 in practice". Read together,
  a reader can take T = 2 for both terms. The paper overloads T the same way (equation 2 "with
  T = 15", equation 3 "In practice we use T = 2"), so the transcription is faithful; the page
  just never says the two T differ. The planning T at line 1275 is defined on the spot and is
  fine.
- Source: https://arxiv.org/html/2506.09985v1, section 3.1, equations 2 to 4. Fetched today.
- Confidence: high that the clash exists; it is a notation issue, not an equation error.
- Suggested sentence (Jepa.tsx, after "with T = 2 in practice"): "This T is the length of the
  rollout. It is a different number from the T = 15 inside the teacher-forcing loss of section 6,
  which counts the guesses per clip; the paper uses the same letter for both."

### 5. Section 4, compounding-error bound: J is defined narrower than the theorem, and the tightness result is credited to the wrong work

- File and line: `src/sections/LearningFromDemonstrations.tsx`, lines 458 to 459 and 471 to 472.
- Text (a): "Write J(pi) for the mistakes the policy is expected to make over the whole task and
  J(pi*) for the expert's own."
- What is wrong (a): in the paper J is the total expected cost over T steps for any task cost C
  bounded in [0, 1]. "Mistakes" is the special case where C is disagreement with the expert, and
  in that case J(pi*) is 0 by definition, so "the expert's own mistakes" is an empty term.
- Text (b): "The paper shows that problems exist where it is reached".
- What is wrong (b): the 2011 paper states tightness in one sentence and credits it: the theorem
  is "(Ross and Bagnell, 2010)" and the example is Kaariainen (2006). It does not show it.
- Source: https://arxiv.org/html/1011.0686v3, section 2 ("The total cost of executing policy pi
  for T-steps ... J(pi)"; "We assume C is bounded in [0,1]") and the paragraph after theorem 2.1.
  Fetched today.
- Confidence: high.
- Suggested replacements: (a) "Write J(pi) for the total cost the policy is expected to run up
  over the whole task, where each step costs between 0 and 1 (count 1 for a step that goes wrong),
  and J(pi*) for the expert's total." (b) "The paper notes that problems exist where it is
  reached, citing earlier work".

### 6. Section 4, ACT loss: the L1 norm in the formula is a sum, the prose and the code use a mean

- File and line: `src/sections/LearningFromDemonstrations.tsx`, lines 565 to 566 ("the L1 loss,
  the mean absolute difference"), 655 ("the L1 distance from the previous block") and 660
  (`\lVert \hat{a}_{t:t+k} - a_{t:t+k} \rVert_1`).
- What is wrong: `\lVert \cdot \rVert_1` adds the absolute differences. The previous block and
  LeRobot's code (per F02-13, and my own knowledge of `F.l1_loss` with mean reduction) average
  them. The two differ by a constant factor (chunk length x action width), which matters only
  because the page then quotes `beta = 10` against this term: that weight is tuned for the mean.
  Section 7 handles the same point explicitly ("add up ... The released code takes their mean").
- Source: https://arxiv.org/html/2304.13705v1, algorithm 1 and section IV-C (fetched today; the
  paper gives no explicit normalisation). LeRobot code behaviour from register F02-13 and own
  knowledge, not re-fetched.
- Confidence: medium.
- Suggested sentence (after the definition of the norm at line 655): "The bars add the absolute
  differences up; LeRobot's code takes their mean, and its default beta is set against that
  mean."

### 7. Section 5, pi0 loss: the superscript on L and the draw of tau are never defined

- File and line: `src/sections/VisionLanguageAction.tsx`, lines 612 to 630; related sentence at
  `LearningFromDemonstrations.tsx`, lines 762 to 764.
- What is wrong: the formula is `L^\tau(\theta)`, a loss at one flow time. The prose defines the
  two distributions under the expectation and never says what the superscript on L means or how
  tau is chosen. Section 4 says the loss is "averaged over demonstrations, noise draws and flow
  times", which is right for training as a whole but is not what the expectation in the pi0
  formula ranges over: the paper samples tau separately, from a beta distribution weighted
  toward the noisy end.
- Source: https://arxiv.org/html/2410.24164v4, section IV ("During training, we sample the flow
  matching timestep tau from a beta distribution that emphasizes lower (noisier) timesteps").
  Fetched today.
- Confidence: high that the definition is missing; low severity.
- Suggested sentence (before "Training minimises:"): "The superscript on L says this is the loss
  at one flow time; training draws a new tau for every example, more often near the noisy end."

### 8. Section 7, LeWorldModel citation: the typeset lines are equations 1 and 3

- File and line: `src/sections/Jepa.tsx`, line 1079 (`LeWorldModel paper, section 3.1, equations 1 to 3`).
- What is wrong: equation 1 carries both `L_pred` and `z-hat = pred_phi(z_t, a_t)`; equation 3 is
  the total. Equation 2 is the definition of SIGReg as an average over M projections, which the
  page does not typeset.
- Source: https://arxiv.org/html/2603.19312v3, section 3.1. Fetched today.
- Confidence: high; cosmetic.
- Suggested replacement: `LeWorldModel paper, section 3.1, equations 1 and 3`.

### 9. Section 6, teacher-forcing decomposition: the average is over 15 guesses, not every frame

- File and line: `src/sections/WorldModels.tsx`, line 761.
- Text: "The sum and the 1/T average the miss over every frame of the clip."
- What is correct: the sum runs over k = 1 to 15, so it averages over the 15 predicted frames
  (frames 2 to 16). The first frame is never a target.
- Source: https://arxiv.org/html/2506.09985v1, equation 2 "with T = 15". Fetched today.
- Confidence: high; minor.
- Suggested replacement: "The sum and the 1/T average the miss over the 15 guesses, one for each
  frame after the first."

## Checked and found right (no change needed)

- Flow time direction. pi0 v4 prints `A^tau = tau A + (1 - tau) epsilon`, `u = A_t - epsilon`,
  integration "from tau = 0 to tau = 1, starting with random noise A_t^0". Sections 4 and 5 use
  the same convention (0 is noise) and the same sign, and the Euler rule matches. The version pin
  matters here: from memory (not fetched, medium confidence) an earlier arXiv version printed
  `u = epsilon - A_t`, and the openpi code runs time the other way (1 is noise, velocity
  `noise - actions`, negative step). If the page ever quotes the code, the convention flips.
- pi0: H = 50, 10 steps, delta = 0.1 all match section IV.
- Diffusion Policy equation 5 is transcribed exactly, including the paper's shorthand
  `A_t^0 + epsilon^k` (the paper's own simplification of the DDPM forward process). "0 means
  clean" matches equation 4, which steps from k to k - 1.
- ACT: algorithm 1 prints MSE, section IV-C says L1; the page says so. KL direction
  `D_KL(q_phi || N(0, I))` matches line 10 of the algorithm. "z is set to zero" matches figure 4
  (PDF numbering; the HTML rendering numbers it figure 3).
- PPO: ratio, clip bounds, min, "say, epsilon = 0.2", maximisation, and the reading of the min
  ("only ignore the change in probability ratio when it would make the objective improve") all
  match section 3.
- V-JEPA 2 equations 1 to 5 match character for character, including the stop-gradient on the
  target branch only, L1 norms, the order of arguments (`a_{1:T}, s_1, z_1` in equation 3 against
  `a-hat_{1:T}; s_k, z_k` in equation 5) and P without phi in equation 5.
- VICReg equation 6 matches; s is the mean squared distance (equation 5).
- LeWorldModel: squared L2, `pred_phi(z_t, a_t)`, lambda = 0.1, M = 1024 match.
- SIGReg: the characteristic function of a standard Gaussian is `exp(-t^2 / 2)` with zero
  imaginary part; the typeset error matches the code line quoted in F03-38.
- Notation across sections 4 and 5: x and v(x, tau) in 4 map to A_t^tau and v_theta in 5, and
  section 5 says so. The reuse of epsilon (error rate, noise, clip range, Recap threshold) and of
  k (chunk length, denoising iteration) is flagged in the prose each time.

Worked examples redone:

- Section 4: 50 x 20 x 30 = 30,000. T = 600; 600 x 0.001 = 0.6; 600^2 x 0.001 = 360.
  6 x 6 x 0.001 = 0.036; 360 / 0.036 = 10,000 (arithmetic right, see finding 1). 100 / 50 Hz = 2 s;
  100 / 30 Hz = 3.33 s. Flow toy: 0.2 - 0.8 = -0.6; 0.1 x -0.6 = -0.06; 0.8, 0.74, 0.68, ..., 0.2
  after ten steps. All right.
- Section 5: 1000 / 63.9 = 15.65; 15.65 x 16 = 250.4; 50 / 30 = 1.67. Right.
- Section 7: L1 toy 1 + 0 + 1 + 2 = 4, mean 1. EMA toy 0.499625 + 0.000675 = 0.5003;
  0.0003 / 0.4 = 0.075%; 1 / 0.00075 = 1,333; ln 0.5 / ln 0.99925 = 923.9, so 924. Covariance toy:
  deviations (-1.5, -0.5, 0.5, 1.5) and (-0.5, 1.5, -1.5, 0.5), products 0.75 - 0.75 - 0.75 + 0.75
  = 0. All right.
- Section 8: 1.5 x 2 = 3; 1.2 x 2 = 2.4; min is 2.4, constant in the ratio. -0.30 - (-0.40) =
  +0.10 > 0.05. Right.

## Every displayed formula, with a verdict

Section 4, `LearningFromDemonstrations.tsx`

1. Behaviour cloning objective (line 401, Ross et al. equation 2): correct
2. Compounding-error bound (line 461, theorem 2.1): correct
3. ACT training loss (line 658, algorithm 1 with L1 from section IV-C): correct
4. Diffusion policy training loss (line 696, equation 5): correct
5. One sampling step of flow matching (line 732, pi0 section IV in page symbols): correct
6. Flow-matching training loss (line 752, pi0 section IV in page symbols): correct

Section 5, `VisionLanguageAction.tsx`

7. pi0 training loss (line 628, section IV, unnumbered): correct
8. pi0 inference step, forward Euler (line 641, section IV, unnumbered): correct
9. Action rate (line 704, own identity, no source): correct
10. Time of one VLA call (line 1159, own identity, no source): correct

Section 6, `WorldModels.tsx`

11. A world model as a function (line 429, own, no source): correct
12. V-JEPA 2-AC teacher-forcing loss (line 743, equation 2): correct

Section 7, `Jepa.tsx`

13. V-JEPA 2 pretraining objective (line 838, equation 1): correct
14. EMA update of the target encoder (line 892, vjepa2 train.py): correct (code not re-fetched; matches the register's code quote)
15. VICReg loss (line 1015, equation 6): correct
16. LeWorldModel training objective (line 1076, equations 1 and 3): correct
17. SIGReg error for one direction at one test value (line 1116, le-wm module.py): correct (code not re-fetched; matches the register's code quote)
18. V-JEPA 2-AC rollout term and total (line 1205, equations 3 and 4): correct
19. V-JEPA 2-AC planning objective (line 1281, equation 5 and the argmin sentence): correct

Section 8, `RobotRl.tsx`

20. PPO clipped surrogate objective (line 322, equation 7): correct
21. Recap advantage and label (line 422, section IV-B and appendix A-F in page symbols): correct
