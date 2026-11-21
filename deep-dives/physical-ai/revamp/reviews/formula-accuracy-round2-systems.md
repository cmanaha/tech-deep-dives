# Formula accuracy review, round 2, systems sections

Reviewed 2026-11-20. Scope: mathematical and attribution errors only, in `src/sections/` files `RobotAsComputer.tsx` (section 3), `CollectingData.tsx` (9), `PhysicsSimulation.tsx` (12), `Rendering.tsx` (13), `SimToReal.tsx` (14), `TrainingScales.tsx` (15), `Evaluation.tsx` (16), `OnRobot.tsx` (17), `PmuCards.tsx` (21), `Measurements.tsx` (22), `PricePerformance.tsx` (23). No source file was edited.

Result in one line: all 20 displayed formulas match their sources or follow from the cited numbers. No displayed equation is wrong. The findings below are about symbol definitions, decompositions, attribution and three small numeric statements in prose.

## How each source was checked

Fetched today (2026-11-20) with a generic client, at the pinned commit or version the register names. All are [AUTHORITATIVE] first-party files unless marked.

- MuJoCo `doc/computation/index.rst` at commit `4ed093a` (tag 4.0.1): https://raw.githubusercontent.com/google-deepmind/mujoco/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst
- LeRobot v0.7.0 at commit `410c095`: `src/lerobot/utils/eval_stats.py`, `src/lerobot/motors/motors_bus.py`, `docs/source/remote_inference.mdx`
- Linux v7.3 at commit `c03c1a1`: `tools/perf/pmu-events/arch/arm64/sbsa.json`
- Arm Telemetry Solution at commit `ea533b7` (tag 2026.09): `cortex_x925_r0p0_pmu.json`, `neoverse_v1_r1p2_pmu.json`, `neoverse_n1_r4p1_pmu.json`
- MuJoCo Playground at commit `084e795` (v1.0.1): `tasks/sysid/so101/README.md`, `run.py`, `sysid.py`, `data_loader.py`; `robots/so101/sim/constant.py`, `scene.py`
- Peng et al., arXiv 1710.06537: the abstract page confirms v3 exists; the equation was read from the ar5iv HTML rendering (https://ar5iv.labs.arxiv.org/html/1710.06537), which does not state which version it renders. [AUTHORITATIVE for the paper, version of the rendering not confirmed]

Not fetched, relied on the register quotes: the Feetech datasheet, the LeRobot `so_follower.py` gains (P = 16, I = 0, D = 32), the Arm Neoverse V2 file, the raw counter files of our own runs, the Isaac Lab and MuJoCo Warp benchmark files. Arithmetic on those inputs was redone from the numbers printed on the page.

## Findings, most serious first

### 1. Section 12: `f` is defined as "the contact forces", and the prose says the equation is settled "with nothing touching". In MuJoCo `f` is the constraint force, and this arm has a constraint that is always present.

- File and line: `PhysicsSimulation.tsx` lines 593 to 595 (symbol list) and 606 to 610 (decomposition).
- Text: "`f` is the contact forces, also unknown" and "with nothing touching, that settles the equation and v-dot follows directly".
- What is correct: MuJoCo's symbol table gives `f` as "constraint force" (`mjData.efc_force`) and `J` as "constraint Jacobian". The constraint types are "equality, friction loss, limit, contact". Friction loss "is modeled as a constraint". The SO-101 model the page uses sets `frictionloss` on its joints (0.2517 on the gripper, 0.0001 on shoulder_pan), and section 14 of this page lists friction loss as a fitted parameter. So the solve runs for this arm even when no shapes touch, and joint limits enter the same way. The page's own description of `J` ("the constraint Jacobian") is right; only the description of `f` and the "nothing touching" sentence narrow it.
- Source: MuJoCo `doc/computation/index.rst` at commit `4ed093a`, "General framework" symbol table (lines 168 to 201), "Constraint model" (line 827: "The types are: equality, friction loss, limit, contact"), "Friction loss" (lines 911 to 914). `robots/so101/sim/constant.py` and `scene.py` line 70 at commit `084e795` for the friction loss values. Fetched today.
- Confidence: high.
- Suggested replacement for the list item: "`f` and `J`: `f` is the constraint forces, also unknown. Contacts are the main source on this task. Joint limits and the dry friction inside a joint are constraints too. `J`, the constraint Jacobian, is a table that says how far each joint's motion moves each constraint, for example each contact point. Transposed, it converts a constraint force into forces at the joints."
- Suggested replacement for the decomposition sentence: "With no active constraint, that settles the equation and the acceleration follows directly. `J^T f` is where the constraints enter, and on this task most of them are contacts."

### 2. Section 12: the worked integration numbers use semi-implicit Euler, but the task the figure describes selects `implicitfast`, whose velocity line is a different equation.

- File and line: `PhysicsSimulation.tsx` lines 54 to 55 (step caption 5), line 86 (stage box 4), lines 613 to 633 (prose and formula).
- Text: "The integrator then turns that acceleration into the next state, the two lines in the figure's last box", followed by the semi-implicit Euler formula, the numbers `1.000 + 0.005 x 2.0 = 1.010`, and then "Variants of that arithmetic differ in how large a timestep they tolerate ... The base scene the pick-cube task builds on selects [implicitfast]."
- What is correct: the displayed formula is exactly MuJoCo's `eq_semimplicit`, and the two numbers are right for it. But `implicitfast` does not compute `v + h a`. MuJoCo's implicit integrators use `v_{t+h} = v_t + h \widehat{M}^{-1} M a(v_t)` with `\widehat{M} \equiv M + h D`, where `D` collects derivatives of velocity-dependent forces. Even the integrator named `Euler` uses that update when the model has joint damping; the docs say the plain semi-implicit update is used only "if the model has no joint damping or the eulerdamp disable flag is set". On this arm the servo's damping term is a velocity-dependent actuator force (`biasprm[2] = -kd` in `scene.py`), so the difference is not a rounding detail. The position line `q_{t+h} = q_t + h v_{t+h}` is the same in all of them. The page calls the variants a matter of timestep tolerance, which hides that the velocity arithmetic shown is not the one the task runs.
- Source: MuJoCo `doc/computation/index.rst` at commit `4ed093a`, "Numerical integration", equations `eq_semimplicit` (lines 516 to 522) and `eq_implicit_update` (lines 577 to 583), and "Integrators" (lines 633 to 645). `robots/so101/sim/scene.py` lines 64 to 66 at commit `084e795`. Fetched today.
- Confidence: high on the equations; medium on how large the difference is for this arm (not computed).
- Suggested replacement for the sentence after the worked numbers: "That is the basic form. The task's own integrator, `implicitfast`, keeps the position line and changes the velocity line: it scales the acceleration by a matrix that accounts for forces that depend on speed, such as the servo's damping, so a large timestep stays stable. In MuJoCo's notation the velocity line becomes v_{t+h} = v_t + h \widehat{M}^{-1} M a_t with \widehat{M} = M + h D." Suggested TeX if a second formula is wanted: `v_{t+h} = v_t + h\,\widehat{M}^{-1} M\,a_t, \qquad \widehat{M} \equiv M + h D`.
- Suggested addition to step caption 5: "The arithmetic shown is the semi-implicit Euler form."

### 3. Section 14: the system identification loss is attributed to the sysid README, which prints no formula.

- File and line: `SimToReal.tsx` lines 555 to 559.
- TeX: `L(\theta) = \sum_{t,\,j} \bigl( q^{\text{real}}_{t,j} - q^{\text{sim}}_{t,j}(\theta) \bigr)^2` with `source=` the SO-101 sysid README.
- What is correct: the README says only "minimizing rollout tracking error in MuJoCo physics" and "Run Gauss-Newton least squares optimization on the 24 dynamic parameters". The equation is the page's rendering. Its form is consistent with the code: `data_loader.py` adds one `mjSENS_JOINTPOS` sensor per joint and passes the measured joint angles as the sensor data, and `sysid.py` builds the residual with `mujoco.sysid.build_residual_fn` and calls `sysid.optimize`. So the residual is joint position, real against simulated, for 6 joints over the episode. Whether `mujoco.sysid` weights or normalises the residuals before squaring was not read, so the unweighted sum is unverified in that one respect.
- Source: MuJoCo Playground at commit `084e795`, `tasks/sysid/so101/README.md`, `sysid.py` lines 127 to 137, `data_loader.py` lines 188 to 214. Fetched today.
- Confidence: high that the README has no formula; medium that the unweighted form is exact.
- Suggested replacement: keep the TeX. Change the formula name to "System identification: squared tracking mismatch (this page's rendering of the least-squares fit)" and the source line to "our rendering; the README describes the fit in words, and the script compares joint-position readings". Add after "all 6 joints": "The library may scale each term before summing; this research did not read that part."

### 4. Section 14: the PD servo equation is attributed to `constant.py`, which holds only the gains. The equation is set in `scene.py`. The link to section 3's gains is looser than stated.

- File and line: `SimToReal.tsx` lines 476 to 477 and 479 to 483.
- TeX: `\mathrm{torque} = k_p\,(q_{\text{target}} - q) - k_d\,\dot{q}` with `source=` `constant.py`.
- What is correct: the equation itself is right. `scene.py` sets `gainprm[0] = kp`, `biasprm[1] = -kp`, `biasprm[2] = -kd` and `forcerange = [-FORCERANGE, FORCERANGE]`, which in MuJoCo's actuator model is force = kp x ctrl - kp x q - kd x q-dot, clipped to the force range. So "The result is capped" is also right. `constant.py` contains the values and the comment "Position servo PD gains identified from real teleop data", and no equation. Separately, "They are the P and D gains of section 3" overstates: section 3's D term multiplies the change in error between two controller passes, this one multiplies joint velocity (the two agree only while the target is fixed), and the numbers are in different units (16 and 32 in the servo's register units, 218 to 265 and 17.5 to 34.2 in the model's).
- Source: MuJoCo Playground at commit `084e795`, `robots/so101/sim/scene.py` lines 58 to 70 and `constant.py`. Fetched today.
- Confidence: high.
- Suggested replacement for the source line: "MuJoCo Playground, SO-101 scene.py (actuator setup) and constant.py (values)". Suggested replacement sentence: "They play the roles of the P and D gains of section 3: PD (proportional-derivative) control pushes in proportion to the error and brakes in proportion to the speed. Their values are in the model's units and are not the 16 and 32 written into the real servo."

### 5. Section 21: the flush correction is described as recovery after a wrong branch guess. Arm's event counts recovery after any machine flush or resteer.

- File and line: `PmuCards.tsx` lines 773 to 777 and 789 to 790.
- Text: "After a wrong branch guess the core flushes ... Their cause is the wrong guess" and "`STALL_FRONTEND_FLUSH`, the cycles the front end spent recovering".
- What is correct: the displayed formula matches Arm's Cortex-X925 file term for term (`frontend_bound` minus `STALL_FRONTEND_FLUSH / CPU_CYCLES`, `bad_speculation` plus the same term, slot width 10; 5 on the A725). The event description is "Counts cycles when the frontend could not send any micro-operations to the rename stage as the frontend is recovering from a machine flush or resteer. Example scenarios that cause a flush include branch mispredictions, taken exceptions, micro-architectural flush etc." So on the V3, X925 and A725 the term moved into bad speculation is wider than branch mispredictions. On the V1 and V2 it is branch mispredictions only (`BR_MIS_PRED * 4`).
- Source: Arm Telemetry Solution at commit `ea533b7`, `cortex_x925_r0p0_pmu.json`, objects `metrics` and `events` (event 0x8162). Fetched today.
- Confidence: high.
- Suggested replacement sentence: "After a flush the front end has nothing to hand over for a few cycles while it fetches again from the right place. A wrong branch guess is the usual cause; exceptions and other machine flushes count too." And for the list item: "`STALL_FRONTEND_FLUSH`, the cycles the front end spent recovering from any flush or resteer."

### 6. Section 22: the bias illustration borrows Arm's 4-cycle constant but counts a different event than Arm's formula does.

- File and line: `Measurements.tsx` lines 617 to 622.
- Text: "Borrowing the fixed cost of 4 cycles per mispredicted branch that Arm uses for two other cores, the physics step on the X925 would move 1.6 points".
- What is correct: the arithmetic is right: 79,584,976 x 4 / 19,922,115,591 = 1.60 points, and 256,608,053 x 4 / 7,794,987,434 = 13.2 points. But those counts are `BR_MIS_PRED_RETIRED` (register entry F08-23, our arithmetic on the missing flush correction). Arm's V1 and V2 formulas use `BR_MIS_PRED`, which counts "branches which are speculatively executed and mispredicted" and is at least as large. The illustration is therefore a lower figure than Arm's own V1 expression would give on the same run. The register says so; the page does not.
- Source: Arm Telemetry Solution at commit `ea533b7`, `neoverse_v1_r1p2_pmu.json` (`frontend_bound`: "100 * (STALL_SLOT_FRONTEND / (CPU_CYCLES * 8) - BR_MIS_PRED * 4 / CPU_CYCLES)"; event 0x0010) fetched today; the two counts from the register, not re-read from the raw file.
- Confidence: high on the event names; the size of the gap between the two events on this run is unknown.
- Suggested replacement sentence: "The constant is borrowed, and the count used is retired mispredicted branches where Arm's formula counts all mispredicted branches, so this shows which cards are sensitive (code full of branches) and does not replace the missing event."

### 7. Section 3: "under about 1.8 m/s" and "182 mm" do not agree to the digits shown.

- File and line: `RobotAsComputer.tsx` lines 843 to 846.
- Text: "moves the gripper at under about 1.8 m/s ... At that ceiling 100 ms would be 182 mm."
- What is correct: 42 RPM = 4.398 rad/s; x 0.413 m = 1.816 m/s. That is above 1.8, and 1.8 m/s x 0.1 s is 180 mm. The 182 mm uses 1.82.
- Source: own arithmetic from the page's inputs (42 RPM, 0.413 m); datasheet not fetched.
- Confidence: high.
- Suggested replacement: "moves the gripper at about 1.82 m/s at most ... At that ceiling 100 ms would be 182 mm."

### 8. Section 23: "the mean barely moves" understates a 9% shift.

- File and line: `PricePerformance.tsx` lines 545 to 546.
- Text: "if ninety-nine calls in a hundred are quick and one takes ten times as long, the mean barely moves."
- What is correct: with 99 calls at t and 1 call at 10t the mean is (99 + 10) / 100 = 1.09 t, 9% higher, and the median is unchanged at t. The point stands; the number can carry it.
- Source: own arithmetic.
- Confidence: high.
- Suggested replacement: "if ninety-nine calls in a hundred are quick and one takes ten times as long, the mean rises by 9% and the median does not move at all, while that one call is ten times over."

### 9. Section 16: the MSE formula is the page's own definition and is not labelled as such; implementations differ by a constant factor.

- File and line: `Evaluation.tsx` lines 336 to 339.
- TeX: `\mathrm{MSE} = \frac{1}{T} \sum_{t=1}^{T} \lVert a^{\text{pred}}_t - a^{\text{demo}}_t \rVert^2`, no `source`.
- What is correct: the formula is a valid definition and matches the prose ("the average squared distance between the two"). Common implementations also average over the action dimensions, which divides this by 6 on this arm, so a number computed this way is 6 times a number from such code. Rankings and correlations are unaffected. [SPECULATIVE as to which convention the SIMPLER authors used; not checked.]
- Source: own knowledge; no source fetched.
- Confidence: medium.
- Suggested addition after the formula: "Many codebases also divide by the number of action dimensions, six here, which rescales the value and changes no ranking."

### 10. Section 17: the "half the chunk" rule drops the one-tick margin that the page's own refill formula adds.

- File and line: `OnRobot.tsx` lines 762 to 764.
- Text: "the turnaround has to stay under half the chunk's duration. A 1.67 s chunk allows about 0.83 s (1.67 / 2)".
- What is correct: after a call of length R, D - R of playback remains. The client asks when R + 1/fps remains (the floor in the displayed formula). The next call fits when D - R >= R + 1/fps, so R <= (D - 1/fps) / 2 = (1.667 - 0.033) / 2 = 0.817 s. The page labels the rule as its own arithmetic, and 0.83 against 0.82 changes no conclusion. The displayed refill formula itself matches the guide verbatim: "Effective refill is `max(refill_seconds, recent maximum turnaround + 1 / fps)`".
- Source: LeRobot `docs/source/remote_inference.mdx` at commit `410c095`, lines 203 and 265. Fetched today. The inequality is own derivation. [SPECULATIVE as a reading of the client's behaviour; the client code was not read.]
- Confidence: medium.
- Suggested replacement: "the turnaround has to stay under about half the chunk's duration. A 1.67 s chunk allows about 0.8 s".

## Every displayed formula, with a verdict

Checked against source for terms, signs, units and attribution; worked numbers redone by hand.

Section 3, `RobotAsComputer.tsx`

1. Encoder steps to degrees, `(raw - mid) x 360 / 4095` (line 537): correct. Matches `motors_bus.py` `_normalize()` lines 1031 to 1033. 1024 x 360 / 4095 = 90.02.
2. PID position controller, textbook form (line 591): correct. Presented as the standard form.
3. Distance travelled during the delay, `d = v tau` (line 801): correct. 8.3, 25 and 62.5 mm redone.
4. Control-latency budget, this page's accounting (line 887): correct. Labelled as the page's own. 33.3 + 76.8 + 0 + 33.3 = 143.4 ms, 4.3 ticks, 35.9 mm, 40 ms budget all redone.

Section 12, `PhysicsSimulation.tsx`

5. Equations of motion, `M v-dot + c = tau + J^T f` (line 600): correct. Verbatim `eq:motion`. See finding 1 for the definition of `f`.
6. Semi-implicit Euler (line 621): correct. Verbatim `eq_semimplicit`, velocity first, position with the new velocity. 1.010 rad/s and 0.50505 rad redone. See finding 2 for its relation to the task's integrator.

Section 13, `Rendering.tsx`

7. Camera rays per simulation step, `E x C x W x H` (line 528): correct. Labelled as the page's count. 8,192 x 64 x 64 = 33,554,432.

Section 14, `SimToReal.tsx`

8. Domain randomisation objective (line 336): correct. Matches Peng et al. section IV, sum from t = 0 to T - 1, no discount.
9. PD servo model (line 481): correct. See finding 4 for attribution.
10. System identification loss (line 557): unverified. Form consistent with the code; weighting inside `mujoco.sysid` not read; attribution per finding 3.

Section 15, `TrainingScales.tsx`

11. GPU-hours (line 252): correct. 768, 252.8, 6,144, 30,720 and 6,144 / 3.4 = 1,807 redone.

Section 16, `Evaluation.tsx`

12. Open-loop MSE (line 338): correct. Page's own definition, see finding 9.
13. Success rate and Wilson score interval (line 549): correct. Matches `wilson_interval()` lines 79 to 84, no continuity correction. 40 of 50 gives 0.6696 to 0.8876; 45 of 50 gives 0.7864 to 0.9565. Fisher exact p-values recomputed: 0.262 and 0.0228. Sample size 199 per arm recomputed with the two-proportion normal approximation.

Section 17, `OnRobot.tsx`

14. When the client asks for the next chunk (line 748): correct. Verbatim from the remote inference guide. 0.149 + 0.033 = 0.182 s; 0.5 s x 30 = 15 actions.

Section 21, `PmuCards.tsx`

15. Slots, filled and kept (line 622): correct. Matches the sub-expressions of `sbsa.json` at Linux v7.3.
16. Top-down level 1, generic Arm form (line 631): correct. All four fractions match `sbsa.json`; `STALL_SLOT` is the sum of the front-end and back-end slot events per Arm's file. Toy run (54, 6, 15, 25%) and the X925 raw-counter run (12.20, 36.54, 45.66, 5.60%) redone.
17. Arm's flush correction, measured form (line 802): correct. Matches the Cortex-X925 file; slot widths X925 10, A725 5, V1 8, N1 5 confirmed in Arm's files. See finding 5 for what the event covers.

Section 22, `Measurements.tsx`

18. Memory demand in bytes per second (line 467): correct. 6 x 1024 x 1024 x 4 = 25,165,824 bytes; x 390 = 9.8 GB/s; 35.3 and 49.5 GB/s redone.

Section 23, `PricePerformance.tsx`

19. Cloud: work per unit of currency (line 343): correct. 3,600,000 / P against 3,000,000 / P, ratio 0.83.
20. Edge: work per joule (line 359): correct. 1,000 / 20 = 50.

Section 9, `CollectingData.tsx`: no displayed formula. The one inline symbol (`g`, line 613) and all prose arithmetic (100 minutes per session, 775 MB per hour, 3,588 bytes per frame, 257 to 1, 199 GB, 18.4 million pixels per second, average 125 decodes at GOP 250) were redone and are right.
