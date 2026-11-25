# Claims: section 19, Agents Running the Loop

claim | register ID

## Opening

A coding agent can improve a policy unattended only if the reset, the success check and the safety limits sit outside its reach; ENPIRE builds those three once with a person, freezes them as immutable APIs and leaves the agent the training | F04-2
ENPIRE gives each of eight real robot stations its own agent (NVIDIA with CMU and UC Berkeley, 2026) | F04-5, F04-1
A trial is one attempt from a reset until success, failure or timeout; section 16 calls it an episode or a rollout and counts the share that succeed | cross-reference to section 16
ENPIRE's headline 99% is pass@8: one rollout holds up to eight attempts, each after seeing the previous failure; a recovery measure; the paper text gives no first-try rate for the final policies (author reported) | F04-16
With independent attempts, 44% per attempt already gives 99% within eight, since 0.56^8 is about 0.01 (Derived, arithmetic shown) | F04-16
On the station the compute cap is physical, one GPU per robot; on a shared cluster it becomes a setting | F04-49

## One cycle

Code does the reset, the rollout and the success check (the verifier); the agent reads logs and papers, edits training code and launches training | F04-1, F04-2
Two stages: stage one built once per task with a person and frozen; stage two autonomous | F04-2
Each station: two arms, three cameras, its own agent, one workstation with one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB RAM; no shared cluster or off-station compute for policy work | F04-5
The agents are hosted models driven by agent programs (Codex with GPT-5.5, Claude Code with Opus 4.7) | F04-25
The station's one GPU is the only cap on the compute its agent can launch | F04-49
The success check is written by the agent from a few minutes of recorded successes and failures; for pin insertion it requires alignment, gripper height and a force estimate; two of three are not vision | F04-12
The reset is agent-written, returns the scene to the start of the hardest phase, and uses detection, pose tracking and GPU motion planning | F04-14
The person states precision, recall and latency; the zip-tie check reads two camera views within a 150 ms budget; precision and recall values are not reported | F04-13, F04-12
A false pass inflates the reported rate: 60% true with one failure in ten passed reports 0.64 (Toy, labelled illustration); precision is the bar that protects the grade (our reasoning) | none (illustration)
A held-out set of labelled snapshots: "the agent may study failures, but cannot train on the test set or alter metric computation" | F04-13
The stage-two prompt is nine lines; goal "100% success rate over each window of 50 consecutive episodes"; subagents, own Git branch, pull other stations; Git is the only channel | F04-4, F04-7
The agent picks the method (behaviour cloning, real-robot RL, scripted, a mix) and the training settings | F04-3
The largest single gain in the eight-agent pin run: a behaviour-cloning term, +10.8 percentage points | F04-23
Every idea follows one order that spends robot time last; robot access is the binding resource | F04-9, F04-21
Three calls (/start, /restart, /home); policy at 30 Hz, joint controllers at 100 Hz | F04-6
86 ideas in about 3.4 hours across eight agents, about three per agent-hour (arithmetic shown) | F04-23
SO-101 block-in-cup stage one is our mapping; ENPIRE ships an adapter for its two-arm stations and none for the SO-101 | F04-5, F04-26

## The fence

The instruction file: may improve policy and training code, must not change environment, reset, verifier, safety limits, evaluation seeds, artifact schema; "Never redefine success inside the policy"; scoring code declared read-only; in the repository files read at the pinned commit no mechanism stops the edit | F04-8
Permission prompts bypassed, unrestricted internet access, prior sessions pruned | F04-11
Safety: motion limits end the episode and reset; torque-limited gripper, essential because stations run unattended; SECURITY.md requires explicit operator intent and a physical emergency stop within reach; motion limits are software | F04-10, F04-8
In simulation ENPIRE removes get_task_info, reset_env, reset_to_initial, CLI helpers and true-target queries to stop cheating | F04-24
Table: ENPIRE, ASPIRE (program policies, second agent reproduces a repair, allowed-call check), AgenticRobotics (controller owns measurement, immutable objective, single-author preview), SEAR (sealed judge) | F04-8, F04-13, F04-27, F04-28, F04-34, F04-83
SEAR's sealed judge holds the start states and grading code and "ignores any success the policy claims" | F04-83

## How the score parts from the skill

Optimiser takes the cheapest route; Learning From Feedback dive section 13, The Reward Is a Proxy | cross-reference to the sibling dive
SEAR: "success in practice overstates success in the test" because the agent resets the scene itself | F04-84
FailBench: "a systematic bias toward predicting success under ambiguous evidence"; no detector above 0.60 balanced accuracy on contact-intensive assembly (author reported); covered in section 8 | F04-45
ENPIRE's later ideas +0.9 and +1.3; AgenticRobotics: "100 held-out episodes give a +/-9.5-point interval"; a same-seed re-run flipped 22 of 100 | F04-23, F04-35, F04-37
ENPIRE does not give the trial count behind each gain; at 100 episodes +0.9 and +1.3 sit inside the interval (our reasoning) | F04-23, F04-35
AgenticRobotics' 1.5w gate and paired test; the final checkpoint beat every selector by 5.6 to 10.0 points on one lineage | F04-35, F04-37
AdaRSI on the SO-101 (SO-ARM101 in the paper): rewrite of instructions, tools and procedure around a frozen VLA raised OOD success from 65% to 100% placing a toy in a bowl, 10 trials per configuration (author reported) | F04-85
Wilson lower bound with all successes is n/(n + z^2): 10 of 10 gives 0.72 (Derived) | F11-203, F06-97

## pass@8

The authors' definition and "our retries happen after witnessing the previous failure", unlike best-of-N | F04-16
Independent attempts: 1-(1-p)^8; 13% gives 0.67 (Derived); "a 13% policy stays ~13%, not 99%"; exceeding the fresh-draw line requires retries that succeed more often than first tries (our reasoning) | F04-16
The survey: ENPIRE "trains and evaluates on the same task"; stage-two trials start from the one frozen reset | F04-86, F04-2, F04-84
50 of 50 gives a Wilson lower end of 0.929 (Derived) | F04-4, F11-203

## Scaling and machines

Fig. 3, first reach of the target: pin 2.5, 0.89, 0.67 h; Push-T 4.7, 3.1, 2.0 h; about 3.7x and 2.4x, not 8x (author reported) | F04-18
Fig. 7, time to complete the objective on pin insertion: 4.5 to 2.0 h, 2.25x (author reported) | F04-20
Robot utilisation 49.1%, 30.9%, 29.8%; GPU 29.4%, 32.5%, 49.0%; GPU at eight 49.0 plus or minus 30.2 (standard deviation); robot idle the other 70% (Derived) | F04-19
Cause: robots wait on agents; "may also fail to launch parallel training sessions to exhaust GPU resources"; "the binding resource is the agent's robot-access budget, not its compute" | F04-21
The loop's machine demands: remote tokens, local CPU and disk, bursty GPU idle more than half the time; vLLM dive for self-hosting | F04-19, F04-14, F04-22
Token rate 9,269, 40,029, 140,310 per minute: 15x for 8x agents, 1.9x the linear projection; 2.5 to 16.8 million tokens, 6.7x for 2.25x; "reach success sooner, but require a disproportionately higher token budget" | F04-20
One agent on simplified Push-T: 80M total, 77M cached, 2.4M fresh, 0.27M output, about 96% re-reads; whether Fig. 7 counts cached input is not stated, and 80M against 2.5M suggests not | F04-22
Single runs: 54.41, 62.01, 105.00 minutes by pairing; slowest 1.9x the fastest (Derived); native vision 54.67 against 72.32 and 99.18 | F04-25
ASPIRE: 14.8% to 99.2% on 10 simulated tasks by model (author reported) | F04-30

## Shared capacity

Published budgets: ENPIRE approved trials, SimEX fixed iterations and trials, AgenticRobotics tool-call timeout; none lets the agent choose hardware or publishes an enforced GPU-hour or token budget | F04-49, F04-43
The tenant shape: bursty GPU, 58 of 86 ideas gave no gain, steady token demand (our reading) | F04-48, F04-23
The design is ours, not an AWS-documented robotics pattern | F04-52
Run the grader as a separate job in the manner of SEAR's sealed judge (our design) | F04-83, F04-8
AWS Batch has no timeout by default; attemptDurationSeconds; SIGTERM then SIGKILL 30 seconds later; a timed-out job is not retried; set in the job definition or at submission | F04-50
maxvCpus is the most vCPUs a compute environment may run; Karpenter NodePool spec.limits can name nvidia.com/gpu; with no limit only EC2 quotas cap; the check is eventually consistent and can overrun | F10-3, F10-407
A consumable resource with a count of one per station (our proposal); works with fair share; fair share divides capacity in proportion and is not a GPU-hour budget | F04-52, F04-51
Nitro Sandboxes, announced 9 November 2026: own Firecracker microVM and kernel; "safely execute LLM-generated code"; runtimeClassName isolated-sandbox; Kubernetes 1.36 or later; network-isolated annotation boots with no network device | F09-43
A sandbox "runs CPU workloads only"; GPU passthrough "is currently unavailable"; the agent's work inside, GPU jobs outside (our design) | F09-45
AgentCore Runtime: microVM sessions end after at most 8 hours, idle after 15 minutes by default; ENPIRE's single-agent comparison runs were given 4 h (pin) and 8 h (Push-T); state in Git | F04-53, F04-17, F04-7
