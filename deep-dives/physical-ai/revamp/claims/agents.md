# Claims: section 19, Agents Running the Loop

claim | register ID

An agent-run loop has two stages: people and agents build and freeze the reset, the success check and the safety limits once; the agent then improves the policy alone | F04-2
ENPIRE's name spells four modules: Environment (reset and verification), Policy Improvement, Rollout, Evolution | F04-1
The fleet is eight identical stations, each with two arms, cameras, its own agent and one workstation with one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB RAM; no shared cluster | F04-5
The grader is a binary success check the agent wrote in stage one from a few minutes of recorded successes and failures, then frozen; for pin insertion it combines visual alignment, gripper height and a force estimate | F04-12
The person states the precision, recall and latency the check must reach | F04-13
The stage-two prompt is nine lines; its goal is 100% success over each window of 50 consecutive episodes; it tells the agent to study several methods and coordinate through Git branches | F04-4
The agent picks the learning method (behaviour cloning, real-world RL, a scripted policy, or a mix) and the hyperparameters | F04-3
The instruction file fixes six steps per idea: one falsifiable hypothesis, smallest policy-side change, unit tests and offline evaluation first, only the approved number of real trials, inspect results, keep only what passes the gates; failed trials are kept | F04-9
The agent may change policy and training code and must not change the environment, reset, verifier, safety limits or evaluation seeds; these are written rules, and the repository files read show no mechanism that technically prevents the edit | F04-8
The agent reaches the hardware only through a local server with three calls (start a rollout, new rollout directory, home) | F04-6
Inside one repository the agent runs with permission prompts bypassed and unrestricted internet access | F04-11
Physical safety is independent of the agent: hard motion limits end the episode and reset, the gripper is torque-limited, an emergency stop is within reach | F04-10
Agents coordinate through Git branches | F04-7
ENPIRE's published runs use two-arm stations; no SO-101 adapter was found in the repository file list; the block-in-cup mapping is our reading | F04-26
The 99% headline is pass@8: success within up to eight sequential retries inside one rollout, a recovery measure; the one-shot rate of the final policies is not given in the paper text (author reported) | F04-16
Eight robots buy roughly 2.4x to 3.7x in time to first reach the target (Fig. 3) (author reported) | F04-18
Fig. 3 times to first reach the target: Push-T 4.7 h, 3.1 h, 2.0 h; pin insertion 2.5 h, 0.89 h, 0.67 h for one, four and eight agents (author reported) | F04-18
Robot utilisation on pin insertion is 49.1% with one agent, 30.9% with four, 29.8% with eight; GPU utilisation 29.4%, 32.5%, 49.0%; GPU at eight agents is 49.0 plus or minus 30.2 (author reported) | F04-19
Robots idle while agents read logs, write code, debug or wait for the language model; larger teams spend more time summarising each other's branches | F04-21
Fleet token rate grows 15x for 8x the agents: 9,269, 40,029 and 140,310 tokens per minute (author reported) | F04-20
Fig. 7, time to complete the objective (100% over every window of 50 consecutive episodes): 4.5 h, 3.2 h, 2.0 h, with 2.5, 7.7 and 16.8 million tokens; a different measure from Fig. 3, not combined with it (author reported) | F04-20
One agent on simplified real Push-T used 80M tokens: 77M cached input, 2.4M fresh input, 0.27M output; about 96% are re-reads of cached context (author reported) | F04-22
The eight-agent pin-insertion run tried 86 ideas in about 3.4 hours; 28 raised the team's best success rate, 58 did not | F04-23
ASPIRE: one coding agent per task writes robot control programs and trains no weights | F04-27
ASPIRE: a skill enters the library only after a second, fresh agent reproduces the fix | F04-28
ASPIRE on 10 simulated benchmark tasks: 14.8% to 99.2% success depending on the model; mean agent time 31 to 139 minutes per task (author reported; no dollar figure shipped) | F04-30
"You Don't Need To Stay in The Loop": a language-model controller owns measurement and the decision, disposable workers do the runs, the objective is immutable; single-author preprint labelled a preview | F04-34
Its campaign: one Quadro RTX 8000, rounds 0 to 26 over five calendar days, 121.6 GPU-hours over 5,475 evaluation episodes; controller token cost not kept (author reported) | F04-36
The final checkpoint beat every measurement-driven selector by 5.6 to 10.0 points; a re-run with the same seeds flipped 22 of 100 outcomes (author reported) | F04-37
RACaP reports 54.4% in-domain on LIBERO, 45.0% zero-shot on LIBERO-PRO, 46.0% on LIBERO-Long (author reported; no dollar figure shipped) | F04-42
Eureka (2023): a language model writes the reward as code; 5 iterations of 16 candidates, each a full RL training, 80 trainings per run; one station with 8 A100 GPUs, under one day per run (author reported) | F04-39
Across the loops that publish resource figures the GPU is busy a minority of the time, most experiments are discarded and tokens are the fastest-growing cost (our reading) | F04-48
None of the loops lets the agent choose its hardware or publishes an enforced GPU-hour or token budget; ENPIRE's budget is an operator-approved number of real trials | F04-49
AWS Batch has no job timeout unless attemptDurationSeconds (minimum 60 seconds) is set; SIGTERM at the limit, SIGKILL 30 seconds later; a timed-out job is not retried | F04-50
AWS Nitro Sandboxes, announced 9 November 2026 for EKS pods, ECS tasks and EC2, available in all commercial regions; each pod in its own Firecracker microVM with its own kernel; opt in with runtimeClassName isolated-sandbox or confidential-sandbox; Kubernetes 1.36 or later | F09-43
A Nitro Sandbox cannot use a GPU: "runs CPU workloads only", GPU passthrough "is currently unavailable"; the agent's own code runs inside, the GPU job outside (the split is our reading) | F09-45
