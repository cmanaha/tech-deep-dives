# Fact check fc10-aws-c (sections 26, 28), 2026-10-31

Files: `src/sections/TrainingJobs.tsx` (section 26, SageMaker Training Jobs), `src/sections/ChoosingPath.tsx`
(section 28, Choosing Your Path).

Evidence read anonymously (no account token, no identifying header): shallow clones of
aws/sagemaker-python-sdk at v3.28.0 (94899a91d3e2e44771cb43c23cdc9923b2459cfe) and
aws/sagemaker-hyperpod-recipes at 2.0.11 (a6030c319908c8a1b74cb619b00476f8e6baa04f), with the v1.5.1 commit
a9ba8bf1 and the v2.0.0 tag (fa19961d, 2025-12-03) fetched into the same clone; raw files from
raw.githubusercontent.com for kueue at 14b79288 (README.md), awsome-distributed-ai at 3a100257
(llama3_1_70b-training.sbatch) and aws-neuron-sdk at 10832bbc (about-torchtitan-neuron.rst,
archive/nxd-training/index.rst); the v2.0.0 release page; 46 AWS and Slurm pages fetched with curl (default
user agent) and stripped to text locally (every SageMaker, EKS, Batch, PCS, ParallelCluster, EC2 and Slurm
page either file cites, both What's New posts and the SageMaker AI and Batch pricing pages); the SageMaker
Price List offer 20261029165009 streamed and filtered to its 12 ml.p5.48xlarge rows. Every number the two
pages compute was recomputed with the dive's own `src/lib/` (`estimateRun`, `priceRun`, presets) bundled
into a scratch script: 63.296 / 55.04 = 1.15; 66.048 / 55.04 = 1.20; 54.92078 / 47.757 = 1.15; 4.2% below
HyperPod; reference run 90.67 days (91), 4 jobs of 28 days, $30.66M EC2 On-Demand, $35.26M training rate
($4.6M more); fleet bill $1,268,122; PCS $15,165 (1.2%); HyperPod $253,624 (20.0%), $8,454 a day; EKS $72;
Auto Mode $60,870 alone, $60,942 with the cluster fee.

Price List rows (SageMaker offer 20261029165009, us-east-1): Training $63.296, SpotTraining $63.296,
Cluster $66.048, Cluster-Reserved $66.048, TrainingPlanUpfrontFee $54.92078. All match the presets.

Cross-section conditions:
- "Cross-instance pricing", "ZeRO-2 under gradient accumulation", "Xid alert rule", "41 sbh": not discussed
  in either file (section 28 mentions Xid only as what the EKS node monitoring agent reads from DCGM).
- "Capacity Block edges": 11:00 and 11:30 UTC, 30 minutes for training jobs and one hour for HyperPod
  plans agree; both files now scope the plan edge to each Reserved Capacity block, as the training plans
  page does (a plan can hold several blocks with gaps; termination runs "until the next Reserved Capacity
  becomes active").
- "Trainium deep health checks": section 28 says documented on HyperPod EKS, GPU-only on HyperPod Slurm;
  agrees.
- "The default MFU": section 26 prints 40% as an assumption with its inputs. Trainium MFU: neither file
  prints a Trainium MFU figure or a "no MFU" sentence, so the 16.54% and x 632/667 items do not apply.
- Paper venues: neither file cites a paper.
- Pinned Llama 3.1 metadata links and the FSx price list: untouched.

Known items settled:
- Section 26 InfraCheckConfig: the API reference defines only `EnableInfraCheck` and "a SageMaker-provided
  health check tests the health of instance hardware and cluster network connectivity"; it says nothing of
  timing. A web search of docs.aws.amazon.com found only API and SDK reference pages, so "no Developer Guide
  page on it was located in this research" stays. The sentence "Screening before the job is opt-in" and the
  h2's "pre-start check" assumed a timing the page itself says is undocumented: corrected (row 6). Section
  20 does not mention InfraCheckConfig at all; that is fc08's call.
- Section 26 training-plan expiry: the sample's 30-minute threshold and the undefined timestamp are
  CONFIRMED; the edge is per Reserved Capacity block, not per plan (rows 3, 4).
- Section 28 branches against their owning sections: every leaf names section 24, 25 or 26 and the body
  questions name sections 16, 20, 22, 24 to 27 and 31. One leaf disagreed with its section: the PCS leaf
  put node replacement on the team, where sections 20 and 24 print that PCS terminates and replaces an
  instance rebooted outside Slurm or set `nextstate=DOWN` (row C2).
- Section 28 Auto Mode wording: the leaf now prints "$72 a month; Auto Mode adds $60,870", section 25's
  figure; the body prints both $60,870 and $60,942 with the cluster fee; the fee disclosure keeps the sum
  with its formula (row C1).

## TrainingJobs.tsx (section 26)

67 load-bearing claims checked (one per claims-file line, plus the diagram's labels and the launcher
sketch's field names against `ModelTrainer`, `SourceCode`, `Compute`, `CheckpointConfig`,
`StoppingCondition` and `InputData` at v3.28.0). 55 CONFIRMED, not listed. Code line ranges all hold:
defaults.py L52-L55 and L156-L174, model_trainer.py L738-L742, L799-L801, L920-L955, L1410-L1411,
L1935-L1954, configs.py L350-L366, distributed.py L26-L77 and L113-L128, training_queue.py L26-L47, recipe
L3-L112 (16 nodes x 8, TP 8, PP 4, CP 1, so DP 4; bf16-mixed; 2,048; micro-batch 1; global 512; async save
every 20 steps); 2.0.11 training directory holds exactly 6 recipes and no path anywhere in the repository
mentions trn, Neuron or Trainium; v1.5.1 holds 36 training recipes including the 70B p5x32/64/128 and Trn1
8B/70B; v2.0.0 holds the same six and its notes list H100, A100 and A10G.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | Launcher comment "# submits nothing" on `dry_run=True` | TrainingJobs.tsx:511 | OVERREACH (the dry run builds the request first, and `create_input_data_channel` uploads a local `source_dir` and the SDK drivers to S3 before the dry-run return) | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/model_trainer.py#L783-L817 and #L946-L954 | "# submits no job", matching the cited L920-L955 |
| 2 | A plan job waits up to its stopping condition or 2 days, "then fails with an InsufficientCapacityError" | TrainingJobs.tsx:741 | WRONG (the stopping condition stops the job; only 2 days pending ends in InsufficientCapacityError) | https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html | "until its stopping condition stops it or, after 2 days pending, fails with an InsufficientCapacityError" |
| 3 | Instances start terminating "30 minutes before the plan ends" | TrainingJobs.tsx:742 | OVERREACH (scope: termination starts 30 minutes before each Reserved Capacity block ends; a plan can hold several discontinuous blocks) | training-plan-utilization-for-training-jobs.html; https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html ("Multiple Reserved Capacity blocks in a single training plan may be discontinuous"; termination "until the next Reserved Capacity becomes active") | scoped to each block; added that a plan can hold several blocks with gaps (SM_PLANS cite), so a long job can stop at each gap |
| 4 | Timestamp "marks the plan's end or the start of termination" | TrainingJobs.tsx:753 | OVERREACH (same scope: the variable is the current capacity block's expiration) | training-plan-utilization-for-training-jobs.html | "the block's end" |
| 5 | "No Spot rate is published" | TrainingJobs.tsx:716 | OVERREACH (a claim about every AWS publication; the evidence is the Price List, which lists SpotTraining at $63.296) | SageMaker offer 20261029165009, row "SpotTraining ml.p5.48xlarge" $63.296; wave2-aws U05-4 | "The Price List carries no separate Spot rate: it lists Spot training ... at $63.296, the On-Demand training rate" |
| 6 | "Screening before the job is opt-in"; h2 "turn on the pre-start check" | TrainingJobs.tsx:768, 792 | OVERREACH (the API reference gives no timing, which the next sentence itself says) | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_InfraCheckConfig.html | "The infrastructure check is opt-in"; h2 "turn on the infrastructure check it leaves optional" |
| 7 | Batch "holds the priorities, fair-share policies and quota shares", cited to the service-jobs page | TrainingJobs.tsx:821 | UNSUPPORTED at the cite (that page carries queues and priorities only; fair-share is in the 2025-07-31 post, quota shares in the 2026-03-25 post) | https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html; https://aws.amazon.com/about-aws/whats-new/2025/07/aws-batch-sagemaker-training-jobs/; https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-quota-management-preemption-sagemaker/ | each claim moved to the source that carries it; service-jobs page re-opened, so its R1 date dropped |
| 8 | SMP v2 "is built on PyTorch FSDP" | TrainingJobs.tsx:888 | UNSUPPORTED wording (the page says SMP v2 "aligns the library's APIs and methods with open source PyTorch FSDP" and takes FSDP scripts) | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-v2.html | "aligns its API with PyTorch FSDP ..., so it takes FSDP training scripts" |
| 9 | "a new project on P5, P6 or Trainium gets current PyTorch and NCCL by bringing FSDP2, TorchTitan or Megatron Core" | TrainingJobs.tsx:932 | WRONG for Trainium (NCCL and Megatron Core are GPU stacks; the Trainium path is section 27, named in the disclosure below) | Neuron 2.33 about-torchtitan-neuron.rst L12-L26 at 10832bbc (TorchNeuron backend); section 27 | "P5 or P6" |
| 10 | "The rest of the collection is fine-tuning and post-training" | TrainingJobs.tsx:961 | WRONG (incomplete: recipes_src at 2.0.11 holds evaluation (22 YAML), fine-tuning (800, SFT, DPO, GRPO, PPO, RLVR, LoRA) and training (6)) | https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11/hyperpod_recipes/recipes_src | "fine-tuning and post-training recipes, plus evaluation recipes", with a Cite to that tree |
| 11 | A standing cluster buys "deep health checks on every node that joins" | TrainingJobs.tsx:1040 | OVERREACH (on-start deep checks run only when `OnStartDeepHealthChecks` is set on the instance group) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | "and, when switched on, deep health checks on every node that joins" |
| 12 | "989.5 TFLOPS" unexpanded | TrainingJobs.tsx:1047 | prose (acronym rule; TFLOPS is expanded in the other sections) | CLAUDE.md Acronym Standard | "TFLOPS (trillion FLOPs per second)" |

Claims-file correction: the training-plan rate is $54.92078 (Price List row TrainingPlanUpfrontFee), which
the page prints; the claims file said $54.92.

Notes, no change:
- `MaxWaitTimeInSeconds` "must be larger than" `MaxRuntimeInSeconds` follows the cited Spot page; the
  StoppingCondition API reference says "equal to or greater than". A doc-doc wording difference with no
  practical effect; left.
- The diagram's order Pending then Starting, and billing starting at Downloading, are schematic (captioned
  "Illustrative, not measured"); the API reference documents billing from `TrainingStartTime`, "when the
  training job starts on training instances", and does not map statuses to that timestamp.

Score after fixes: **9**. Every quantitative claim is computed from the calculators and cited to the Price
List, the API reference or code at v3.28.0; the corrections were scope and attribution, not numbers.

## ChoosingPath.tsx (section 28)

About 70 load-bearing claims checked (one per claims-file line, the seven leaves' fee, When and Yours
lines against sections 20, 24, 25 and 26, and the fee disclosure's six formulas). 64 CONFIRMED, not listed.
Notable confirmations: PCS Small up to 32 instances and no size change after creation; ParallelCluster 3.16
supported to 2028-02-20 and its guide's PCS recommendation; Slurm `--nodes` single value is both minimum and
maximum; EKS topology page on gang scheduling; Kueue README L25 at 14b79288 ("by default, no Pods start
until there is quota for all of them"); awsome sbatch L104-L109 (auto-resume only when
`/opt/sagemaker_cluster` exists); HyperPod Slurm DCGM level 4 at about 45 to 90 minutes,
`OnStartDeepHealthChecks` InstanceStress and InstanceConnectivity, no Trainium row, "Supported instance
families include g5, p4, and p5"; HyperPod EKS Neuron hardware check "runs a training workload"; operator
Kubernetes 1.28 to 1.33 and process-level recovery before full restarts (`numRestartBeforeFullJobRestart`);
log-pattern hang detection; Kueue through task governance; Capacity Blocks 64 per block and 256 across an
organization's accounts on a date, 11:00 and 11:30 UTC; trn2.48xlarge blocks in two Regions; default P and
Trn On-Demand quotas 0; training-plan quota must "exceed" the plan's instance count (the cited page's word;
the capacity page says "equal to or greater"); NxD Training end-of-support as of Neuron 2.32; Neuron 2.33.0
"TorchNeuron public beta"; Batch scales EKS nodes to a minimum that defaults to zero; Batch pricing "no
additional charge"; no GPU health, EFA or health handling on the Batch multi-node EKS page (hedge kept).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| C1 | Self-managed EKS leaf "$72 a month; $60,942 on Auto Mode" (and the diagram title) | ChoosingPath.tsx:317, 349 | WRONG against section 25 (section 25 prints Auto Mode's fee as $60,870; $60,942 is that plus the $72 cluster fee, unlabelled) | presets EKS_FEES 2.64192 x 32 x 720 = $60,869.84; KubernetesFamily.tsx L873-L878 | leaf and title "$72 a month; Auto Mode adds $60,870" (computed as the fee line minus the cluster fee); body "$60,870 a month and $60,942 with the cluster fee"; disclosure formula kept |
| C2 | PCS leaf "When: AWS runs only the controller"; "Yours: ... node replacement and requeue" | ChoosingPath.tsx:297, 299 | WRONG against sections 20 and 24 (PCS terminates and replaces an instance rebooted outside Slurm or set `nextstate=DOWN`; deciding a node is bad is the team's health check) | AwsOwnership.tsx L567-L581; SlurmFamily.tsx L886-L891 | "When: AWS runs Slurm, replaces downed nodes"; "Yours: node images, GPU health checks that mark bad nodes down, and requeue" |
| C3 | Training plan edge "30 minutes before the plan ends ... one hour before for HyperPod" | ChoosingPath.tsx:1033 | OVERREACH (scope: per Reserved Capacity block) | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | "30 minutes before each of its Reserved Capacity blocks ends ... one hour before for a HyperPod cluster" |
| C4 | EKS repair "an add-on plus a Karpenter feature gate otherwise" | ChoosingPath.tsx:898 | OVERREACH (the page documents two paths, Auto Mode and self-managed Karpenter; "otherwise" reaches managed node groups it does not cover) | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | "on self-managed Karpenter" |
| C5 | TorchTitan Neuron on TorchNeuron, "PyTorch's native Neuron backend", cited at L19-L26 | ChoosingPath.tsx:78, 959 | WRONG (range: "the native PyTorch backend for Neuron" is L14-L15) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L12-L26 | range and label L12-L26 |

Score after fixes: **9**. Every fee comes from `priceRun` and matches sections 22, 24 and 25; every leaf
now agrees with the section it names. The tree is labelled our reading and "not measured".

## Harness and checks (after fact check and leverage)

`npx vite build --outDir /tmp/lts-dist-fc10`, then `shoot.mjs --port 4710 --sections training-jobs,choosing`:
1 SVG per section at 1440 and 390, "ok" (no overlap, clip or overflow); the edited PCS and self-managed
EKS leaves fit their cards in both layouts (PNGs read). typecheck exit 0; lint exit 0; tests "Test Files
6 passed (6)", "Tests 168 passed (168)"; no-ai-tells, pinned-refs, svg-a11y and pre-overflow pass.

For the orchestrator: section 20 (fc08) does not mention InfraCheckConfig in its training-jobs screening
cell; whether it needs a note is fc08's call.
