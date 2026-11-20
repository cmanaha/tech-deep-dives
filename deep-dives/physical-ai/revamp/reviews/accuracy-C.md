# Physical AI dive: technical accuracy review C (sections 15, 19 to 25)

Reviewed 2026-11-20 against the rendered text in `/tmp/pai-text/`, the claim registers in
`deep-dives/physical-ai/research/2026-11/`, the Tier 0 files in
`deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/`, and four primary pages fetched today
(AWS Batch API reference: Ec2Configuration, ComputeResource, SubmitJob; the AWS post "Train VLA models with Hugging
Face LeRobot on Amazon SageMaker AI"; Arm Telemetry Solution `neoverse_n1_r4p1_pmu.json` at the pinned SHA).

13 findings: 5 high confidence, 5 medium, 3 low. Ordered by severity.

## Intended properties

1. **No dollar figure or price: HOLDS.** No currency symbol, amount or price appears in the eight files. The only
   cost arithmetic is the invented "its hour costs 3 times as much" example in section 23, which carries no currency.
2. **Capacity Block statements scoped to the lists read on 2026-11-20: mostly holds, two sentences violate it.**
   See finding 7.

## What was recomputed and holds

- All 9 workload cards, the capability table and the sample card in sections 21, 22 and 23 reproduce from
  `results-pass2/*.csv` (all four shares, memory stall, IPC, throughput). The figures agree across sections 20 to 23.
- Section 21 worked arithmetic (12.20%, 36.54%, 0.5126, 0.8907, 45.66%, 5.60%), section 22 flush illustration
  (1.6 and 13.2 points, under 0.5 for policy), demand figures (9.8, 35.3, 49.5 GB/s), section 23 (2.56 ms, 0.51 ms,
  0.83), section 15 GPU-hours (768, 252.8, 6,144, 30,720, ratio 1,807), section 19 (15x tokens, 96% cached,
  2.4x to 3.7x, 28 + 58 = 86).
- The fifteen workloads appear with the same names and order in sections 20, 23 and 25.

---

## Finding 1 (section 24, high severity): the Batch Spot compute environment pins a non-GPU machine image on GPU families

**Quoted** (snippet "A Spot compute environment on two G families that scales to zero"):

```
"instanceTypes": [ "g6e", "g7e" ],
...
"ec2Configuration": [ { "imageType": "ECS_AL2023" } ]
```

and the sentence "Everything else, including the placeholder subnet, security group and role, is as printed."

**What is wrong.** The skeleton in the Batch guide uses `ECS_AL2023` because its `instanceTypes` is
`default_arm64` (register F09-131 quote). The dive swapped the instance types to GPU families and kept the image
type. `ECS_AL2023` is the standard ECS image with no NVIDIA driver or container runtime, so instances launched from
it register no GPU and the job definition above it, which asks for `"type": "GPU", "value": "1"`, cannot be placed.
The snippet does not work as shown.

**Evidence.** AWS Batch API Reference, Ec2Configuration, fetched 2026-11-20,
https://docs.aws.amazon.com/batch/latest/APIReference/API_Ec2Configuration.html : "ECS_AL2023 Amazon Linux 2023 :
Default for all non-GPU instance families." and "ECS_AL2023_NVIDIA Amazon Linux 2023 (GPU) : Default for all GPU
instance families and can be used for all non AWS Graviton-based instance types."

**Corrected.** Set `"imageType": "ECS_AL2023_NVIDIA"`, or drop the `ec2Configuration` block so Batch picks the GPU
image by default, and list the image type among the things changed from the skeleton.

**Confidence:** high.

Related, lower severity, same snippet: `"serviceRole": ""` is kept as an empty string. Whether the API accepts an
empty string or needs the field removed was not checked (low confidence, not counted as a finding).

---

## Finding 2 (section 25, medium severity): "3.4 to 10.9 hours on one GPU for each run" of "three policies" is not what the post's table says

**Quoted.** "AWS's post of 19 November 2026 trains three policies on an SO-101 dataset and reports 3.4 to 10.9 hours
on one GPU for each run." Also in the closing table, policy fine-tune row: "AWS reports 3.4 to 10.9 hours on one GPU
for its runs on this arm".

**What is wrong.** The timing table has five rows, covers two of the three policies, and runs from 2.8 h to 11.4 h.
ACT has no run time in it. 3.4 and 10.9 are the fastest and slowest of the three rows the post labels "Standard".

**Evidence.** The post, fetched 2026-11-20,
https://aws.amazon.com/blogs/physical-ai/train-vla-models-with-hugging-face-lerobot-on-amazon-sagemaker-ai/ :
"GR00T N1.7 Standard ml.g7e.2xlarge 32 3.4 h 640,000 ~52 / GR00T N1.7 Standard ml.g6e.2xlarge 16 4.0 h 320,000 ~22 /
GR00T N1.7 Projector only ml.g6.2xlarge 4 2.8 h 80,000 ~8 / pi0.5 Standard ml.g6e.xlarge 8 10.9 h 160,000 ~4 /
pi0.5 LoRA ml.g6.4xlarge 4 11.4 h 80,000 ~2". Register F09-82 quotes only the two N1.7 "Standard" rows and the ACT
memory row; wave2-C row 47 elides the other rows with "...".

**Corrected.** "The post trains three policies and prints run times for two of them, GR00T N1.7 and pi0.5: 2.8 to
11.4 hours for 20,000 steps on one GPU across five runs, 3.4 to 10.9 hours for the three runs that use its standard
recipe. It prints no time for ACT." Section 15 is correct as written (it names each row and its batch size).

**Confidence:** high.

---

## Finding 3 (sections 20 and 25, medium severity): GPU-parallel physics is shape A in one section and treated as shape B in the other

**Quoted, section 20** (five shapes table, row A, "Short units / None: every unit is independent / Yes, at the cost
of one unit"): "Decode and filter, embed and deduplicate, CPU physics, GPU-parallel physics, simulated cameras,
evaluation, engine build, generative augmentation".

**Quoted, section 25** (closing table, GPU-parallel physics row): "SageMaker Training Job for an occasional run;
Batch when runs come back to back", "On-Demand with a list of types; Spot when the run checkpoints", "One GPU, one
job, for hours: a stop costs the stretch since the last checkpoint."

**What is wrong.** Section 25's row is the definition of shape B ("One node for hours", "Yes, back to the last
checkpoint"), and section 24 sends shape A to "An AWS Batch array job" on "Spot, with On-Demand as the fallback".
The two sections give the same workload two different shapes, orchestrators and markets. Section 25's own decision
path puts it under "Hours of one run", not "One unit, under 30 minutes".

**Evidence.** Register F08-78 lists row 6 (GPU-parallel physics) under A; F08-80 already notes "the same physics
inside a multi-node RL run ... moves toward B or C"; section 25's row cites F09-73 (Isaac Lab training on Training
Jobs or Batch), which is an RL training run of hours.

**Corrected.** Either move GPU-parallel physics to shape B in section 20 when it is the simulator inside an RL
training run (which is how sections 8, 24 and 25 use it), or split it: stepping for evaluation is A, stepping inside
a training run is B.

**Confidence:** medium (the contradiction is certain; which side to change is the author's call).

---

## Finding 4 (section 19, medium severity): the job-definition timeout is not out of the agent's reach

**Quoted.** "Set attemptDurationSeconds (minimum 60 seconds) on the job definition. ... The job definition lives in
the scheduler, so a training script the agent rewrote cannot extend it." and, in the closing list, "Give every job
the agent can submit a timeout in the job definition."

**What is wrong.** The claim is stronger than the source. A timeout passed at submission replaces the one in the job
definition, so an agent that holds `batch:SubmitJob` (which it must, to launch its own training) can lengthen or
remove the cap in the submit call. The section's design goal, "limits ... outside the repository the agent edits",
is met only if the submission path is also outside the agent's control.

**Evidence.** AWS Batch API Reference, SubmitJob, `timeout`, fetched 2026-11-20,
https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html : "This configuration overrides any timeout
configuration specified in the job definition." Register F04-50 already records "either in your job definition, or
when you submit the job".

**Corrected.** "A timeout in the job definition is the default, and a timeout passed to SubmitJob overrides it. The
cap holds against a rewritten training script; to hold it against the agent, submit through a role or a wrapper the
agent cannot change, or deny it the override."

**Confidence:** medium (mechanism verified; IAM-level mitigations were not researched).

---

## Finding 5 (section 22, low severity): "every category within 0.5 points" does not reproduce

**Quoted.** "Across the two passes the three workload cards reproduce: throughput within 2.5% and every category
within 0.5 points."

**What is wrong.** One of the 36 category values moves by more than 0.5 points: retiring for the policy stand-in on
the Cortex-A725 is 55.50% in pass 1 and 54.81% in pass 2, a gap of 0.69 points. Every other category is within 0.47
points and throughput is within 2.45%.

**Evidence.** Recomputed from `results-pass1/results-spark-a725.csv` and `results-pass2/results-spark-a725.csv`, row
`wl_policy`, with the section's own formula and 5 slots. The same sentence is in `experiments/README.md` and
wave2-C row 43, so the error is upstream of the section.

**Corrected.** "throughput within 2.5% and every category within 0.7 points".

**Confidence:** high.

---

## Finding 6 (section 21, low severity): Neoverse N1 is listed with a slot width for a formula it cannot run

**Quoted.** "It is the S of the formula, so every percentage on a card is a share of that core's own width." with
the table row "Arm: Neoverse N1 5, Neoverse V1 8, Neoverse V2 8, Neoverse V3 10, Cortex-X925 10, Cortex-A725 5".

**What is wrong.** The number is in Arm's file, but the Neoverse N1 has no STALL_SLOT events, so the slot formula
printed in this section cannot be evaluated on it. Arm's N1 method is cycle accounting. This matters on EC2: the
section's own table lists `*6g` (Graviton2, the N1) with full PMU support at 16xlarge and then says "plan a top-down
run on a size from the middle column".

**Evidence.** Arm Telemetry Solution at ea533b73, `neoverse_n1_r4p1_pmu.json`, fetched 2026-11-20:
`"architecture": "armv8.2"`, `"pmu_architecture": "pmu_v3"`, `"num_slots": 5`; the string STALL_SLOT occurs 0 times;
the only stall metrics are `frontend_stalled_cycles` = "STALL_FRONTEND / CPU_CYCLES * 100" and
`backend_stalled_cycles`; `topdown_methodology.metric_grouping.stage_1` is `["Cycle_Accounting"]`. Register F08-16
gives N1 in brackets with no quote, and wave2-C row 5 says "Not re-checked: Neoverse N1 5".

**Corrected.** Drop N1 from the row, or add: "The N1 (Graviton2) has no slot events; on `*6g` only the cycle-based
recipe applies."

**Confidence:** medium (file facts are certain; whether a reader is misled is a judgment).

---

## Finding 7 (section 25, low severity): two Capacity Block statements are stated as permanent facts

**Quoted.** Simulated cameras row: "The RT-core requirement removes the P family, and the window reservation with
it." "Keeping the choice honest": "GPU-parallel physics that starts rendering with an RTX renderer moves to the G
family only, and leaves the window reservation behind."

**What is wrong.** Both tie the absence of a window reservation to the G family itself, with no date. Everywhere
else the section scopes it ("No G type on the lists read 2026-11-20", "The lists read on 2026-11-20 name no G-family
type"). This is the one violation of intended property 2 found.

**Evidence.** Register F09-34: the training plans page says "The availability of instance types may change over
time." F09-91: the list is "today".

**Corrected.** "...removes the P family, and with it the window reservation, which the lists read on 2026-11-20
offer for no G type."

**Confidence:** high.

---

## Finding 8 (section 24, low severity): the Spot Fleet role sentence is stronger than the parameter's own rule

**Quoted.** "The API reference adds that a SPOT environment also names a Spot Fleet role in spotIamFleetRole."

**What is wrong.** Read with the snippet, it says the snippet is missing a required field. For the allocation
strategy the snippet uses, the role is not required.

**Evidence.** AWS Batch API Reference, ComputeResource, fetched 2026-11-20,
https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html , `spotIamFleetRole`: "This role is
required if the allocation strategy set to BEST_FIT or if the allocation strategy isn't specified." The sentence the
dive relies on ("If you choose SPOT, you must also specify ...") is under `type` on the same page; the two disagree,
and the parameter's own description is the specific one.

**Corrected.** "A Spot Fleet role in spotIamFleetRole is required only with BEST_FIT or with no allocation strategy;
this snippet sets SPOT_PRICE_CAPACITY_OPTIMIZED and needs none."

**Confidence:** medium.

---

## Finding 9 (section 25, low severity): the training plans list does not name "the same families"

**Quoted.** "The SageMaker training plans list names P types of the same families."

**What is wrong.** The families named just before are "P4d, P4de, P5, P5e, P5en, P6-B200 and P6-B300". The training
plans list has no P4de, and it also holds Trainium types, which section 24 states correctly ("Both lists hold P and
Trainium types").

**Evidence.** Register F09-34 and wave2-C row 28: "ml.p4d.24xlarge, ml.p5.4xlarge, ml.p5.48xlarge, ml.p5e.48xlarge,
ml.p5en.48xlarge, ml.trn1.32xlarge, ml.trn2.48xlarge, ml.p6-b200.48xlarge, ml.p6-b300.48xlarge".

**Corrected.** "The SageMaker training plans list, read the same day, names P4d, P5, P5e, P5en, P6-B200 and P6-B300
types and two Trainium types."

**Confidence:** high.

---

## Finding 10 (section 20, low severity): the 17% run was a captioning run, cited under embedding

**Quoted.** "Embed and deduplicate (section 10). ... The input path can fill first. One run in the tool's design
notes, cancelled before it completed, left 32 H100s at about 17% utilisation because fetching the clips was the slow
side."

**What is wrong.** The run is from the robot captioning recipe: the 32 replicas were captioning engines running a
vision-language model, a different model and load from a vision encoder producing embeddings. The mechanism
(GPUs starved by fetch) transfers; the attribution to this workload does not.

**Evidence.** Register F05-76 and its wave 2 note: "a design note for the incubating robot captioning recipe records
one run ... 32 captioning replicas delivered 7.1 rows per second against a capacity near 43".

**Corrected.** "One captioning run in the same tool's design notes, cancelled before it completed, left 32 H100s at
about 17% ..."

**Confidence:** medium.

---

## Finding 11 (section 15, low severity): "the 80 GB class once every weight trains" contradicts the section's own AWS datum

**Quoted.** Table, one-node post-training row, GPU memory: "The 80 GB class once every weight trains: openpi asks
for more than 70 GB for a full fine-tune".

**What is wrong.** The same section reports "pi0.5 with all of its weights training took 10.9 hours on
ml.g6e.xlarge at batch 8", a 48 GB GPU, in the one-GPU band. The openpi figure is that repository's recipe, not a
property of training every weight.

**Evidence.** The AWS post's memory table, fetched 2026-11-20: "pi0.5 (all weights) 41 GB @ batch 16 / 40.5 GB @
batch 8" and "pi0.5 trains all of its weights on 48 GB and above ... keeps its weights in bf16". Register F02-54
(openpi: more than 70 GB for full fine-tuning) and F09-82.

**Corrected.** "More than 70 GB for a full fine-tune in openpi's own recipe; AWS trained all of pi0.5's weights in
about 41 GB in bf16 at batch 8 to 16."

**Confidence:** low (two sources, two recipes; the generalisation is the error).

---

## Finding 12 (section 25, low severity): "in AWS's sizing table" is a Cosmos 3 table, used for robot foundation-model pretraining

**Quoted.** Robot foundation-model pretraining row: "P5en or P6-B200, in AWS's sizing table".

**What is wrong.** The table sizes Cosmos 3 (a world model) for inference and post-training. It says nothing about
pretraining a VLA.

**Evidence.** Register F09-84: "Its sizing table recommends g7e.2xlarge or p5.4xlarge for one-GPU Nano inference,
p5.48xlarge for Nano post-training, p5en.48xlarge for multi-node post-training, and p6-b200.48xlarge for Blackwell
work."

**Corrected.** "P5en or P6-B200: the sizes AWS's Cosmos 3 table gives for multi-node post-training, taken here as
our reading for pretraining."

**Confidence:** low.

---

## Finding 13 (sections 21 and 23, low severity): two Tier 0 citations point at the wrong log file

**Quoted, section 23.** "10 W for the GPU alone, read from nvidia-smi ... our machine card, Spark (log in the
repository: .../pmu-cards/jetson-orin-nano.md)".
**Quoted, section 21.** "one Cortex-X925 core of a DGX Spark stepping a MuJoCo humanoid model ... our recomputation
from the raw counter file (log in the repository: .../results-pass2/results-jetson-a78ae.csv)".

**What is wrong.** The Spark's 10 W idle reading is in `pmu-cards/dgx-spark.md` ("power (10 W idle)"), not in the
Jetson card. The X925 raw counts are in `results-spark-x925.csv` (the second citation on that sentence is correct).
Cause: `src/data/registry.json` holds one log path per entry (F08-83 and F08-70) and each entry covers both machines.

**Corrected.** Point the Spark reading at `pmu-cards/dgx-spark.md`; drop the Jetson CSV from the X925 sentence.

**Confidence:** low on severity, high on the fact.

---

## Sections with no errors found

- **Section 23:** no technical error beyond the citation pointer in finding 13.
- **Section 15, 19, 20, 21, 22, 24, 25:** findings above; everything else checked against the registers holds.
