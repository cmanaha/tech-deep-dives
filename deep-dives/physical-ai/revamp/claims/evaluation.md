# Claims: section 16, Evaluation

claim | register ID

History, 2024: the SIMPLER authors report that ranking policies by validation action MSE gave Pearson r of 0.308 with real-world success on average, against 0.924 for closed-loop simulated evaluation with a matched camera view; "validation MSE is not a good proxy for a policy's real-world performance" (author reported; landed in "Open loop against closed loop", in "Rung one", in diagram 16.2 and in "The ladder") | F06-81
Open-loop error "does not fully capture closed-loop effects such as compounding errors, contact dynamics, or recovery ability" (ICRA 2026 REAL-I challenge report) | F06-85
ABC (2026): across the authors' own policy variants lower validation action error went with better real-world performance, statistically significant, while validation loss "is not significantly correlated"; offline metrics "cannot reliably predict task success rates or reveal failure modes" (author reported) | F06-84
Our reading: action error helps choose among variants of one policy; ranking different policies or predicting a success rate takes a closed loop | F06-84, F06-81
AWS reports from a customer engagement that "offline MSE does not monotonically predict closed-loop success" (vendor claim) | F06-86
LeRobot v0.7.0's lerobot-eval runs a checkpoint closed loop in a batch of simulated environments and reports the success rate with a 95% Wilson confidence interval | F06-94
LeRobot v0.7.0 ships no SO-101 simulator of its own; the environment comes from outside, for example MuJoCo Playground | F06-38
PolaRiS scanned-twin evaluation: average Pearson r = 0.9 with real results across six paired environments, worst environment r = 0.81; four policies, each fine-tuned briefly on simulated demonstrations first (author reported) | F06-83
Benchmark saturation: "nearly all tested policies scoring between 90 and 95% success in Libero, but spanning the full spectrum from high-performing to low-performing policies in the real world" (author reported) | F06-82
LIBERO-Plus perturbs seven dimensions (camera viewpoint, lighting and robot initial state among them) and reports performance "dropping from 95% to below 30% under modest perturbations" (author reported) | F06-87
Isaac Lab-Arena v0.3 (alpha) added environment variation sweeps over lighting, backgrounds, camera parameters and object mass | F06-92
RoboWorld: 8 policies, 4,186 generated rollouts of 30 seconds, judged by a vision-language model; Pearson 0.989 and Spearman 0.970 against the RoboArena leaderboard (author reported) | F06-89
RoboArena: evaluators at seven academic institutions run double-blind pairwise comparisons; "more than 600 pairwise real-robot evaluation episodes across seven generalist policies" | F06-88
World-model evaluators report r = 0.78 (WorldGym) and 0.983 (HF-WM); a third-party test in the PolaRiS paper found an open-source video model "often produces heavy hallucinations during object interaction" and mis-ranked policies (author reported) | F06-90
40 of 50 is 80% with a 95% Wilson interval of 67.0% to 88.8%; 45 of 50 is 90% with 78.6% to 95.7%; the intervals overlap (78.6% to 88.8%); Fisher's exact test p = 0.26; 45 of 50 against 35 of 50 gives p = 0.023; about 199 trials per policy to tell a true 80% from 90% at 80% power and the 5% level (derived; diagram 16.3) | F06-97
Wilson interval formula and the hand arithmetic for 40 of 50 (centre 0.7786, half-width 0.1090; register teaching material 5.4) | F06-97
LeRobot prefers the Wilson interval because it "keeps its nominal coverage at small n_trials and at rates near 0% or 100%, which is where robot evaluations live"; the interval does not cover "variation between training runs (seeds)" | F06-95
Real-trial counts in published work: 12 trials for one task (MuJoCo Playground paper), 20 real rollouts per policy per environment (PolaRiS), 50 trials per task (ABC); "a small feasible sample size (e.g., 10 or 50) due to significant human effort and limited inference throughput of policies" | F06-96
1X (2024, history): "Even the same model weights can experience a rapid degradation in performance in a matter of days" | F06-91
Isaac Lab-Arena scaling, no cameras and no policy inference: one RTX 5880 Ada, 5.41 environment-steps per second with 1 environment and 2,390 with 1,024; eight independent runs took 1,255.2 s on one L40 GPU and 157.8 s on eight, "a 7.95x speedup" (vendor claim) | F06-93
RoboWorld: "only 100 H100 GPU hours" for the benchmark of 8 policies; our arithmetic: 12.5 GPU-hours per policy, 86 GPU-seconds per 30-second rollout (author reported, derived) | F06-89
