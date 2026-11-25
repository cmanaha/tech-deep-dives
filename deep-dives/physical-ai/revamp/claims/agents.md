# Claims: section 19, Agents Running the Loop

claim | register ID

## Opening

A coding agent can be left to improve a policy unattended only if the reset, the success check and the safety limits sit outside its reach (the section's claim, uncited); an agent that runs the reset chooses its own test and retries for free | none (our thesis); F04-24, F04-84 support the reset half
ENPIRE builds those three once with a person, freezes them as immutable APIs and leaves the agent the training | F04-2
ENPIRE gives each of eight real robot stations its own agent (NVIDIA with CMU and UC Berkeley, 2026) | F04-5, F04-1
An attempt is one try at the task, ending in success, failure or timeout; section 16 counts the share of single attempts that succeed (vocabulary: attempt; rollout of up to eight attempts) | cross-reference to section 16
ENPIRE's headline 99% pass@8 across the showcased tasks: a success anywhere in a rollout of up to eight attempts, each after seeing the previous failure; it mixes first tries with retries and is a different quantity from the first-try rate; the paper text gives no first-try rate for the final policies (author reported) | F04-16
With independent attempts, 44% per attempt already gives 99% within eight, since 0.56^8 is about 0.01; read as a first-try rate it can make a 44% policy look like a 99% one (Derived, arithmetic shown) | F04-16
On the station the compute cap is physical, one GPU per robot; on a shared cluster it becomes a setting | F04-49

## One cycle

Code does the reset, the rollout and the success check (the verifier); the agent reads logs and papers, edits training code and launches training | F04-1, F04-2
Two stages: stage one built once per task with a person and frozen; stage two autonomous | F04-2
Each station: one two-arm robot, three cameras, its own agent, one workstation with one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB RAM; no shared cluster or off-station compute for policy work; the station is the unit the fleet scales by (body keeps one robot, one GPU, its own agent and the hosted model; the hardware inventory sits in an expandable block, F04-5 and F04-25) | F04-5, F04-7
The agents are hosted models driven by agent programs (Codex with GPT-5.5, Claude Code with Opus 4.7) | F04-25
The station's one GPU is the only cap on the compute its agent can launch | F04-49
The success check is written by the agent from a few minutes of recorded successes and failures; for pin insertion it requires alignment, gripper height and a force estimate; two of three are not vision | F04-12
The reset is agent-written, returns the scene to the start of the hardest phase, and uses detection, pose tracking and GPU motion planning | F04-14
The person states precision, recall and latency; the zip-tie check reads two camera views within a 150 ms budget; the precision and recall the checks achieved are not reported (U3) | F04-13, F04-12
A false pass inflates the reported rate: with a check that passes every true success and one failure in ten, 60% true reports 0.64, precision 0.6 / 0.64 = 0.94 (Toy, labelled illustration); precision is the bar that protects the grade (our reasoning) | none (illustration)
Precision moves with the policy: the same check at 20% true success reports 0.28, precision 0.71; the figure that stays put is the share of failures the check passes, so a precision measured on the stage-one recordings holds only for their mix and drifts as the policy improves (Toy arithmetic; our reasoning) | none (illustration)
A held-out set of labelled snapshots the agent cannot train on: "the agent may study failures, but cannot train on the test set or alter metric computation" | F04-13
The stage-two prompt is nine lines; goal "100% success rate over each window of 50 consecutive episodes"; subagents, own Git branch, pull other stations; Git is the only channel | F04-4, F04-7
The agent picks the method (behaviour cloning, real-robot RL, scripted, a mix) and the training settings | F04-3
The most notable gain in the eight-agent pin run: a behaviour-cloning term, +10.8 percentage points on the "team-average best success rate" | F04-23
Every idea follows one order that spends robot time last, the resource the authors call binding; real attempts are an approved number | F04-9, F04-21
The agent's process never addresses a motor; requests go through a local station server whose three calls (/start begins a run, /restart a fresh rollout buffer directory, /home) sit in an expandable block; ENPIRE's policy at 30 Hz, the station's joint controllers at 100 Hz; 30 Hz is also the SO-101 host loop rate (section 3) | F04-6
86 ideas in about 3.4 hours across eight agents, 86 / 3.4 / 8 = 3.2 per agent-hour (Derived, arithmetic shown) | F04-23
SO-101 block-in-cup stage one is our mapping (conditional prose); no SO-101 adapter appears in the repository's file list at the pinned commit (U5), so the robot interface would be yours to write | F04-2, F04-5, F04-26

## The fence

The instruction file: may improve policy and training code, must not change environment, reset, verifier, safety limits, evaluation seeds, artifact schema; "Never redefine success inside the policy"; scoring code declared read-only; in the repository files read at the pinned commit no mechanism stops the edit | F04-8
Permission prompts bypassed, unrestricted internet access, prior sessions pruned | F04-11
Safety, two kinds: position and motion limits are software, end the attempt and reset, and are on the must-not-change list; the gripper's force bound sits in the actuator (torque-limited), essential because stations run unattended; SECURITY.md requires explicit operator intent and a physical emergency stop within reach for every real-robot command; neither source says how that fits unattended stations | F04-10, F04-8
In simulation ENPIRE removes APIs "such as" get_task_info, reset_env, reset_to_initial, CLI helpers and true-target queries to stop cheating; each leaks state or grants a retry, the two routes to a grade without a better policy (our reasoning) | F04-24
What stands between agent and grade ranges from a written rule whose enforcement is unpublished (ENPIRE, U2) to a separate process (SEAR) | F04-8, F04-83
Table: ENPIRE (by written rule; the files read show no enforcing mechanism), ASPIRE (program policies, second agent reproduces a repair, allowed-call check), AgenticRobotics (controller owns measurement, immutable objective, single-author preview), SEAR (benchmark on simulated and real tasks; sealed judge) | F04-8, F04-13, F04-27, F04-28, F04-34, F04-82, F04-83
SEAR's sealed judge holds the start states and grading code and "ignores any success the policy claims" | F04-83

## How the score parts from the skill

Optimiser takes the cheapest route; Learning From Feedback dive section 13, The Reward Is a Proxy; one such route runs through the reset | cross-reference to the sibling dive; F04-84
A VLM judge applies when the success check is a call to a general vision-language model rather than code; ambiguous attempts tend to come back as successes (scoped to FailBench's "under ambiguous evidence") | F04-45
SEAR: "success in practice overstates success in the test" because the agent resets the scene itself | F04-84
FailBench (2026): 13 VLM-based judges on 2,197 real and simulated attempts, scored by balanced accuracy (0.5 is chance); "a systematic bias toward predicting success under ambiguous evidence"; detection "approaches saturation when success is determined by observable object motion, but approaches chance when success depends on establishing contact"; no judge above 0.60 on contact-intensive assembly (author reported) | F04-45
ENPIRE's later ideas +0.9 and +1.3; AgenticRobotics runs on one GPU (one Quadro RTX 8000); "100 held-out episodes give a +/-9.5-point interval"; a same-seed re-run left the total unchanged and flipped 22 of 100; fixed seeds reproduce "an episode's initial state, not its outcome" | F04-23, F04-35, F04-36, F04-37
Too few evaluation episodes matter most late, when gains get small; a gain is the difference of two rates, so its interval is wider than one rate's (statistics, our reasoning); measured on 100 episodes each, AgenticRobotics' count, gains of +0.9 and +1.3 would sit inside the interval that count gives (conditional; our reasoning) | F04-23, F04-35
AgenticRobotics' gate: promoted outright only at 1.5w or more; a smaller positive gain kept only if a paired test on the same episodes confirms it; no gain forces a strategy change; the final checkpoint beat every selector by 5.6 to 10.0 points on one lineage | F04-35, F04-37
AdaRSI on the SO-101 (SO-ARM101 in the paper): rewrite of instructions, tools and procedure around a frozen VLA raised OOD success from 65% to 100% placing a toy in a bowl, 10 trials (attempts) per configuration (author reported) | F04-85
Wilson lower bound with all successes is n/(n + z^2): 10 of 10 gives 0.72 (Derived) | F11-203, F06-97

## pass@8

The authors' definition and "our retries happen after witnessing the previous failure", unlike best-of-N | F04-16
Independent attempts: 1-(1-p)^8; solving for 0.99 gives p = 0.44; 13% gives 0.67 (Derived); the project page's "a 13% policy stays ~13%, not 99%" is the authors' no-recovery case; 0.67 and 13% rest on different assumptions (no reason given) | F04-16
A 99% pass@8 fits a first try of 44% (fresh draws), near 99% (retries add nothing, from the authors' line), or below 44% only with retries that succeed more often than first tries, which the authors attribute to seeing the previous failure; the paper text gives no first-try rate (arithmetic and author attribution) | F04-16
By our reading SEAR's caution applies to the 99%: in stage two the scene is set by the one reset frozen in stage one, which returns it to the start of the hardest phase; the score covers the task from that phase on, from the starts that reset produces (survey sentence and F04-86 dropped: a system named once) | F04-16, F04-2, F04-14, F04-84
The nine-line prompt does not say whether an episode is one attempt or a whole rollout, so meeting the goal need not mean fifty first tries; 50 of 50 gives a Wilson lower end of 0.929, a true rate of about 93% (Derived) | F04-4, F11-203

## Scaling and machines

Fig. 3, first reach of the target (100% on pin insertion, a score of 1.0 on Push-T): pin 2.5, 0.89, 0.67 h; Push-T 4.7, 3.1, 2.0 h; about 3.7x and 2.4x, not 8x (author reported; ratios Derived); h2 title range 2.4 to 3.7 | F04-18
Fig. 7, time to complete the objective on pin insertion: "the authors report" 4.5 to 2.0 h, 2.25x (author reported chart data; ratio Derived) | F04-20
Robot utilisation 49.1%, 30.9%, 29.8%; GPU 29.4%, 32.5%, 49.0%; GPU at eight 49.0 plus or minus 30.2 (standard deviation); robot idle the other 70% (Derived) | F04-19
Cause: robots wait on agents; "may also fail to launch parallel training sessions to exhaust GPU resources"; "the binding resource is the agent's robot-access budget, not its compute": the budget rations real attempts per idea, while the fleet's pace was set by the agents, robots idle more than half the time at every fleet size | F04-21, F04-19, F04-9
The loop's machine demands: remote tokens, local CPU and disk, bursty GPU idle more than half the time; vLLM dive for self-hosting | F04-19, F04-14, F04-22
The authors report token rates 9,269, 40,029, 140,310 per minute: 15x for 8x agents, 1.9x the linear projection (Derived); 2.5 to 16.8 million tokens, 6.7x for 2.25x (Derived); "reach success sooner, but require a disproportionately higher token budget" | F04-20
One agent on simplified Push-T: 80M total, 77M cached, 2.4M fresh, 0.27M output, 77 / 80 = 96% re-reads (Derived); whether Fig. 7 counts cached input is not stated, and 80M against 2.5M suggests not, though the two are different tasks; the figure's own "Uncached work" bar (2.6M, as printed) sits at the fleet figures' scale; the cached-input rate decides the bill | F04-22
Single runs: 54.41, 62.01, 105.00 minutes by pairing; slowest 1.9x the fastest (Derived); native vision 54.67, no vision 72.32, vision as a tool 99.18; single runs on one simplified task, indicative | F04-25
ASPIRE: 14.8% to 99.2% on 10 simulated tasks by model (author reported) | F04-30

## Shared capacity

Published budgets (narrowed to two named loops; SimEX dropped as a system named once): limits an operator sets, ENPIRE approved real-robot attempts, AgenticRobotics tool-call timeout; neither of those two lets the agent choose hardware or publishes an enforced GPU-hour or token budget | F04-49
The tenant shape: bursty GPU, 58 of 86 ideas gave no gain, steady token demand (our reading) | F04-48, F04-23
Two graders (our design): the per-attempt check the agent trains against stays in the station's code with the reset and safety limits, readable not writable by the agent's credentials; a final judge in SEAR's manner as a separate job | F04-2, F04-83, F04-8
Batch offers the three caps (time per job, capacity ceiling, robot count); each holds against the agent only when set at a step the agent cannot edit (our design) | F04-50, F04-52
For scale, ENPIRE's agents spent about 3.4 x 60 x 8 / 86 = 19 agent-minutes per idea (Derived), so a training job running for hours is far out of step with that run's pace (our reasoning; no timeout value is proposed) | F04-23
The design is ours, not an AWS-documented robotics pattern | F04-52
Run the grader as a separate job in the manner of SEAR's sealed judge (our design) | F04-83, F04-8
AWS Batch has no timeout by default; attemptDurationSeconds; SIGTERM then SIGKILL 30 seconds later, so a job that handles SIGTERM has about 30 seconds; a timed-out job is not retried; set in the job definition or at submission; a submit service of yours holds the submit credentials and sets definition and timeout (our design) | F04-50
maxvCpus is the most vCPUs a compute environment may run; Karpenter NodePool spec.limits can name nvidia.com/gpu; with no limit only EC2 quotas cap; the check is eventually consistent and can overrun | F10-3, F10-407
A consumable resource with a count of one per station (our proposal); holds for jobs that declare it, and the submit service adds the declaration (our design); works with fair share; fair share divides capacity in proportion and the fair-share page names no GPU-hour cap | F04-52, F04-51
The agent's process runs LLM-written code with permission prompts off and, in ENPIRE, unrestricted internet; two hosts, alternatives (our design): a Nitro Sandbox when the network must be controlled, AgentCore Runtime when you would rather not run the cluster; neither keeps the agent from the grader, which is a matter of credentials | F04-11; none (our design)
Nitro Sandboxes, announced 9 November 2026: each pod or task in its own Firecracker microVM with its own kernel; "safely execute LLM-generated code"; runtimeClassName isolated-sandbox; Kubernetes 1.36 or later; network-isolated annotation boots with no network device; that would cut the agent off from its model and Git, so the agent's sandbox keeps a network and what it may reach is the setting you control (our reasoning; no egress mechanism named) | F09-43
A sandbox "runs CPU workloads only"; GPU passthrough "is currently unavailable"; the agent's work inside, GPU jobs outside (our design) | F09-45
AgentCore Runtime: microVM sessions end after at most 8 hours, idle after 15 minutes by default; ENPIRE's comparison of coding agents (a separate experiment from the fleet timings) ran one agent 8 h on Push-T and 4 h on pin insertion; AgenticRobotics' campaign ran over five calendar days; ENPIRE's state in Git | F04-53, F04-17, F04-36, F04-7
Closing: first-try rate on start states the agent never chose is the number to compare across policies; 99% within eight attempts is reached by independent tries at 44% (Derived) | F04-16
