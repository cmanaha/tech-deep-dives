# Physical AI dive, sections 1 to 8: technical accuracy review (reviewer A)

Scope: rendered text in /tmp/pai-text/01 to 08, checked against the claim registers in
research/2026-11/ and, where noted, the primary source. Technical errors only.
8 findings: 0 critical, 3 medium, 5 low. Ordered by severity.

Tier labels used below: [AUTHORITATIVE] = primary source or register quote of it;
[SPECULATIVE] = my own derivation or recollection.

---

## Finding 1 (medium) - Section 8: Recap's advantage formula is the pre-training estimator, not the one used in the on-robot loop

Sentence: "R_t is what happened from step t to the end of the episode, on the same scale as the value. ... A_t = R_t - V(o_t, l)" and the worked example "the episode ends sooner than that implied, at -0.30, so A_t = -0.30 - (-0.40) = +0.10."

What is wrong: the paragraph describes the policy update inside the Recap loop (autonomous rollouts, value function, retrain). In that stage the paper does not use the full-episode return. It uses an n-step estimate with a 50-step lookahead: rewards over the next 50 steps plus the value at step t+50, minus the value at t. The full-episode form (N = T) is what the paper uses for pre-training data only, and calls "a higher variance estimate".

Evidence [AUTHORITATIVE]: arXiv 2511.14759v2 (https://arxiv.org/html/2511.14759v2), Section III: A(o_t, a_t) = E[sum_{t'=t}^{t+N-1} r_t' + V(o_{t+N})] - V(o_t), "corresponding to an n-step estimate". Appendix: "We use N=50 lookahead to calculate this advantage." (fine-tuning) and "N=T for each episode, which is a higher variance estimate of the advantage" (pre-training). Register entry F04-62 (advantage conditioning) only paraphrases "advantage = observed outcome minus that value" and never quotes the formula, so the register did not catch this.

Corrected statement: "A_t = (rewards over the next N steps) + V(o_t+N, l) - V(o_t, l). In the on-robot iterations N = 50 steps; for the pre-training data the paper uses the whole rest of the episode (N = T), which reduces to R_t - V(o_t, l)." The toy example should compare the value 50 steps later (plus the step rewards in between) with the value now, or be labelled as the pre-training form.

Related, same paragraph: "eps_l is a threshold set per task" is right, but the toy "+0.05" hides that the paper sets it by percentile (about 30% of data positive in pre-training, about 40% of rollouts in fine-tuning, about 10% for the laundry task). Not an error, noted for whoever fixes the formula.

Confidence: medium (primary source read through a fetch summariser; quotes are short but unambiguous).

---

## Finding 2 (medium) - Section 6: GR00T 2 token count does not follow from the stated compression (patch step dropped)

Sentence: "Camera frames go through a frozen VAE that compresses 4 times in time and 8 times in each spatial direction, giving 280 tokens per compressed frame and camera at 224 x 320 pixels."

What is wrong: 8x per spatial direction on 224 x 320 gives 28 x 40 = 1,120 latent positions, not 280. The 280 comes from a second step the sentence omits: the latents are split into patches (2 x 2 by the arithmetic, 14 x 20 = 280). As written the mechanism and the number contradict each other. The same section handles this correctly for Cosmos 3 ("32 by 32 in space", which the register notes is 16 x 16 plus a 2 x 2 patch merge).

Evidence [AUTHORITATIVE]: register F03-104, whitepaper quote: "A frozen Wan 2.1 video VAE compresses each camera stream 4x in time and 8x in each spatial dimension. The latents are split into patches, giving 280 tokens per latent frame and camera at 224 x 320." Register synthesis line (03-world-models-and-jepa.md:937): "8x per spatial dimension, then patches, giving 280 tokens". The 2 x 2 patch size is [SPECULATIVE], derived from 1,120 / 280 = 4.

Corrected statement: "...compresses 4 times in time and 8 times in each spatial direction; the result is then split into patches, giving 280 tokens per compressed frame and camera at 224 x 320 pixels."

Confidence: high.

---

## Finding 3 (medium) - Sections 5 and 6 contradict each other on GR00T 2's size

Section 5 sentences: table row "GR00T 2 (NVIDIA) | Research page and whitepaper, November 2026 | Turbo variant: 2B. The full model has no size on the page" and "Its on-robot variant, GR00T 2 Turbo, has 2B parameters."

Section 6 sentences: "NVIDIA describes a single 2B-parameter transformer built on Cosmos-Predict2.5-2B" and the parameter table row "GR00T 2 (whitepaper, code not yet released) | Video and actions | 2B".

What is wrong: section 5 tells the reader the full model's size is unpublished while naming the whitepaper as its source; section 6 prints that size (2B) from the same whitepaper. A reader also ends up with a "smaller" Turbo variant at 2B and a full model at 2B, with nothing said about it.

Evidence [AUTHORITATIVE]: register F03-104 whitepaper quote: "a single 2B-parameter transformer processes" (full GR00T 2). Register F02-45 project-page quote: "GR00T 2 Turbo lowers the cost ... a smaller joint video-action transformer (2B parameters)". F02-45 "Use in dive" note: "The full GR00T 2 parameter count is not on the page (U3)", which is true of the page only.

Corrected statement (section 5 table): "Full model: 2B per the whitepaper. Turbo: the project page calls it a smaller transformer and also prints 2B; NVIDIA's two documents do not reconcile the two figures." Do not present Turbo's 2B as distinguishing it from the full model.

Confidence: high that the two sections disagree; which NVIDIA figure is the misprint is not something the registers resolve.

---

## Finding 4 (low to medium) - Section 5: the 63.9 ms figure is for the whole GR00T N1 model, not the action head

Sentence: "The same NVIDIA paper reports 63.9 ms to sample one chunk of 16 actions on an L40. ... So 120 Hz is a rate of actions; the action head itself runs about 15.6 times a second."

What is wrong: the source gives 63.9 ms as the inference time of the released GR00T-N1-2B model for sampling a chunk, in the same sentence as its total parameter count. It is not a timing of System 1 alone. Attributing 15.6 runs per second to "the action head itself" is stronger than the source, and it sits awkwardly beside the 10 Hz the same paragraph gives for the VLM (if one full sample including the VLM takes 63.9 ms, the VLM is not what limits it to 10 Hz).

Evidence [AUTHORITATIVE]: register F01-70, GR00T N1 paper (arXiv 2503.14734v2): "our publicly released GR00T-N1-2B model has 2.2B parameters in total, with 1.34B in the VLM. The inference time for sampling a chunk of 16 actions is 63.9ms on an L40 GPU using bf16." Register F02-33 marks the 15.6 figure "[our reading]" and "[derived]".

Corrected statement: "...the model as a whole samples a 16-action chunk about 15.6 times a second." The point of the paragraph (120 Hz counts actions, not network passes) survives.

Confidence: medium.

---

## Finding 5 (low) - Section 3: "the third term" points at the wrong term of the printed formula

Sentence: "LeRobot writes P = 16, I = 0 and D = 32 into each follower servo when it connects, which switches the third term off: the joints run as PD (proportional-derivative) controllers".

What is wrong: the formula printed just above is "drive = P x e + I x (sum of e so far) + D x (change in e since the last pass)". The term that I = 0 removes is the second one. The third term is the D term, which is on (D = 32). The conclusion (PD control) is right; the pointer is wrong.

Evidence [AUTHORITATIVE]: register F01-16, LeRobot so_follower config: "position_p_coefficient: int = 16 / position_i_coefficient: int = 0 / position_d_coefficient: int = 32". Section source RobotAsComputer.tsx lines 585 to 592.

Corrected statement: "...which switches the integral term off".

Confidence: high.

---

## Finding 6 (low) - Section 6: "A fifth arrived in 2026" overstates what the source supports

Sentence: "A fifth arrived in 2026: let the model output the action together with its prediction, so the world model is the policy." (cited to the DreamZero paper), and later "The DreamZero paper, from NVIDIA in February 2026, coined the term."

What is wrong: the cited source supports that the name "world action model" dates from February 2026, not that the use does. Models that predict future frames and actions jointly and act as the policy were published before 2026.

Evidence: [AUTHORITATIVE] register F03-93, DreamZero quote: "We term this architecture a World Action Model (WAM)" (a naming claim only). [SPECULATIVE, from memory, not re-fetched] earlier joint video-and-action policies include GR-1 (arXiv 2312.13139, 2023) and Unified Video Action Model (arXiv 2503.00200, 2025).

Corrected statement: "A fifth got its name in 2026: ..." or "A fifth became a model class of its own in 2026".

Confidence: low to medium.

---

## Finding 7 (low) - Sections 2 and 3 versus section 5: two unreconciled GR00T N1.7 latency sets

Sentences: sections 2 and 3: "a median of 22.9 ms on an H100 data-centre GPU, 76.8 ms on Jetson AGX Thor and 149.0 ms on Jetson Orin". Section 5: "a printed end-to-end figure of 27.9 ms (35.9 Hz). On a Jetson AGX Thor the card gives 93.8 ms (10.7 Hz)."

What is wrong: nothing in either number; each matches its source. But the reader gets two different TensorRT figures for the same model on the same two devices and no sentence saying they are different benchmarks. The odd-looking direction (two cameras faster than one) makes it read as an error.

Evidence [AUTHORITATIVE]: register F02-41 (deployment README: LIBERO checkpoint, action horizon 40, two 256 x 256 cameras: 22.9 ms H100, 76.8 ms Thor) against F02-40 (model card: 4 steps, 1 camera: 27.9 ms H100, 93.8 ms Thor). F02-41 "Use in dive": "Three first-party Thor figures exist (10.7 Hz, 12.4 Hz, ~28 Hz); the dive must name the build with any number it prints."

Corrected statement: in section 5, add that the repository's deployment README publishes a second, faster set for a different checkpoint and camera setup (the figures used in section 3).

Confidence: high that both sets are printed without reconciliation; low that it counts as an error.

---

## Finding 8 (low, source conflict) - Section 6: "two transformers sharing weights" in Cosmos 3

Sentence: "It has two transformers sharing weights. One is autoregressive ... The other is the diffusion transformer described above".

What is wrong: possibly nothing. NVIDIA's own two documents disagree. The docs page supports the sentence; the paper describes each size as built on a dense transformer of half the total parameters, which reads as two towers with their own weights joined by shared attention (the usual meaning of mixture-of-transformers).

Evidence [AUTHORITATIVE]: NVIDIA/Cosmos docs/reference/models.md at SHA 0eab578a (fetched): "Both modes share transformer weights, multimodal attention layers, and a unified 3D mRoPE". Against it, wave2-A.md row 75, Cosmos 3 paper section 2.5: "Nano is a 16B-parameter model built upon a dense 8B-parameter transformer", with the wave-2 note "the Cosmos 3 totals count two towers (reasoner and generator); the generator alone is half."

Corrected statement: "It combines two transformers in one model: ..." and drop "sharing weights", or attribute the phrase to the docs.

Confidence: low.

---

## Sections with no errors found

- Section 1 (One Robot, One Loop): no errors found.
- Section 2 (Getting Started): no errors found (the N1.7 latency is covered by finding 7).
- Section 4 (Learning From Demonstrations): no errors found.
- Section 7 (JEPA): no errors found.

## Checked and cleared (so nobody re-checks them)

- Section 3: degrees = (raw - mid) x 360 / 4095 matches LeRobot motors_bus.py (max_res = resolution - 1), F01-18. All speed, backlash and data-rate arithmetic recomputed and correct.
- Section 4: flow-matching target "A - noise" with t from 0 (noise) to 1 (chunk) matches pi0 paper v4 (fetched: "u(A^tau|A) = A - epsilon", "A^(tau+delta) = A^tau + delta v", 10 steps, delta 0.1, H = 50). openpi's code runs time the other way (F02-24); the dive follows the paper consistently.
- Section 4: T^2 x epsilon bound and its tightness (F02-3); ACT 1% to 44% (F02-6); Diffusion Policy 100 / 16 or 10 / 0.1 s (F02-16); LeRobot diffusion 64 / 32 and 100 passes (F02-17); FAST 30 tokens, 750 ms, 5x (F02-26, F02-27); pi0 14 + 32 + 27 = 73 ms.
- Section 6: 16 s against 4 min, 800 against 80 samples, Cosmos 1 7B (F03-25); Cosmos 3 VAE 4x and 32 x 32 (F03-96); 2,400 tokens per second arithmetic; DreamZero 5.7 s and 7 Hz (F03-103); 1,070x parameter ratio; 4.4 GPU-hours arithmetic.
- Section 7: token counts, encoder and predictor sizes (F03-4), EMA 0.99925 and half-life 924 steps (recomputed), VICReg toy covariance (recomputed, zero), SIGReg 0.09 / 17 knots / 1,024 (F03-37, F03-38), V-JEPA 2-AC 258 tokens, planner counts (F03-115), CEM toy numbers (recomputed), 60% to 70% grasp (F03-73; note the V-JEPA 2 paper's own Table 2 says 65%, which section 7 also prints, both correctly sourced).
- Section 8: 196,608,000 steps and 228 days (F04-58), 20 physics steps per control step (F06-105), Isaac Lab rates (F04-54, F04-55), piRL 77.1% to 98.3% (F04-69), AWS run (F04-70, F04-71), HIL-SERL (F04-72, F04-77).
