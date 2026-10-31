# Claims: section 26, SageMaker Training Jobs

File: `src/sections/TrainingJobs.tsx`. Re-opened on 2026-10-31 (default accessed date): the SageMaker Developer Guide pages on distributed training, getting capacity, checkpoints (enable, resume, cluster repair), managed Spot (and its status page), warm pools, heterogeneous clusters, training plans for training jobs, SMP v2 (overview, use, release notes), SMDDP release notes, HyperPod recipes, checkpointless training and the Trainium training-job tutorial; the API reference pages DescribeTrainingJob, StoppingCondition, RetryStrategy and InfraCheckConfig; both AWS What's New posts; the SageMaker Python SDK at tag v3.28.0 (commit 94899a91d3e2e44771cb43c23cdc9923b2459cfe) and the HyperPod recipes at 2.0.11 (a6030c319908c8a1b74cb619b00476f8e6baa04f). Register rows cited without re-opening carry `accessed="2026-10-30"`: the AWS Batch service-jobs page, the HyperPod Slurm page (SMDDP), the SageMaker AI pricing page, the Capacity Blocks pricing page, the recipes tree at v1.5.1 and the v2.0.0 release notes. The p5.48xlarge rates, the 1.15 ratios and the reference run (about 91 days, $30.7M On-Demand) are computed at render time from `src/lib/presets.ts` and `src/lib/runtime.ts` with section 22's inputs, so the page and the calculators share one value.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction

- On-Demand training instances are provisioned when a job starts, released when it completes, paid per second | https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html | T06-23
- Training-job rate $63.296 per ml.p5.48xlarge-hour in us-east-1, 1.15 times EC2 On-Demand | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | T05-23; presets `PRICES`
- EC2 On-Demand $55.04 per p5.48xlarge-hour in us-east-1 | SOURCES.ec2PriceUse1 (EC2 Price List 20261029175634) | T05-20; presets `PRICES`
- Training jobs run DDP, torchrun, mpirun and parameter-server launchers | https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html | T06-23
- Ownership per concern is section 20's training-jobs column; fabric is the EFA dive section 16 | internal links | section 20; EFA dive App.tsx

## A job's life

- Pending wait set from 30 minutes to 28 days with MaxPendingTimeInSeconds, then InsufficientCapacityError | https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html | T06-23
- All of a job's instances launch in one subnet, one Availability Zone | https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html | T06-23
- Billing runs from TrainingStartTime to TrainingEndTime, including the container and data download | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_DescribeTrainingJob.html | T06-23
- MaxRuntimeInSeconds defaults to 1 day, maximum 28 days, and with a retry strategy covers all attempts | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StoppingCondition.html | T06-23
- ModelTrainer defaults MaxRuntimeInSeconds to 3,600 s when no stopping condition is passed [code] | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/defaults.py#L52-L55 and #L156-L174 | T06-28; read at v3.28.0 on 2026-10-31
- SIGTERM then 120 seconds before the job ends | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StoppingCondition.html | T06-23
- SecondaryStatus names and transitions; valid values subject to change | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_DescribeTrainingJob.html | T06-23
- A watchdog should treat an unknown status as a reason to look (our reading) | synthesis | none
- Diagram: statuses, repair, S3 sync and restore, billing lanes, warm pool, 1.15x label | pages above | Illustrative, not measured

## Checkpoints

- CheckpointConfig syncs /opt/ml/checkpoints with S3; existing checkpoints are written to the container at job start; local deletes propagate | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints.html | T06-27
- A resumed job receives checkpoints on every instance | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-resume.html | T06-27
- SDK v3 defaults the checkpoint S3 URI to a path containing the job name when unset [code] | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-core/src/sagemaker/core/training/configs.py#L350-L366; model_trainer.py#L738-L742 | read at v3.28.0 on 2026-10-31
- S3 Express One Zone directory buckets are supported | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints.html | read 2026-10-31
- One S3 location per job: multi-instance scripts must name files distinctly; no SDK setting for checkpoint frequency | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints.html | read 2026-10-31
- Per-step directories with rank in the file name, and pruning (our reading) | synthesis | sections 18, 19

## Warm pools, managed Spot, training plans

- Warm pool: KeepAlivePeriodInSeconds up to 3,600 s, matching fields, up to 28 days, cache path, billed, not with Spot or heterogeneous clusters | https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html | T06-26; W5-52
- WarmPoolStatus reports billed retention | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_DescribeTrainingJob.html | read 2026-10-31
- Managed Spot: Spot only, no On-Demand fallback, MaxWaitTimeInSeconds larger than MaxRuntimeInSeconds, checkpoints copied back, saving formula, not comparable to EC2 Spot history | https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html | T06-27; W5-51
- Up to 90% savings [vendor claim] | https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html | T06-27
- No Spot rate: the Price List lists Spot training at the On-Demand training rate | SageMaker Price List us-east-1 20261029165009 | T05-25; U05-4 (closed as hedge)
- Spot suits small, often-checkpointed jobs since a synchronous job stops when any instance is interrupted (our reading) | synthesis | section 17
- A training plan serves one target and cannot be interchanged | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-53
- Training plan at 1.15 times the Capacity Block rate, $54.92 vs $47.757 per p5.48xlarge-hour, paid up front | SageMaker Price List us-east-1; SOURCES.capacityBlocks | T05-22; T05-24; presets `PRICES`
- A job on a plan waits up to its stopping condition or 2 days, then InsufficientCapacityError; termination begins 30 minutes before the plan ends; SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP | https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html | T06-30; W5-53; build-log cross-section condition (30 min jobs, 1 h HyperPod)
- The sample saves at 30 minutes before the timestamp; the page does not say whether the timestamp is the end or the start of termination | https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html | read 2026-10-31 (new)
- Set the threshold to 30 minutes plus save time and margin (our reading) | synthesis | none

## GPU failure

- GPU health check, reboot or replace, status message, up to 10 attempts, not billed, restart from previous checkpoint, failed repair fails the job, starts only after the job fails | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html | G2; U06-4 (closed); W5-60
- The repair page names GPU errors only | same page | G2; section 20 Trainium cell
- RetryStrategy reruns InternalServerError failures 1 to 30 times | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_RetryStrategy.html | G2
- InfraCheckConfig: SageMaker-provided health check of instance hardware and cluster network connectivity, opt-in; API does not say when or how long; no Developer Guide page located | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_InfraCheckConfig.html | read 2026-10-31 (new; not in register)
- with_infra_check_config() enables it with enable_infra_check=True [code] | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/model_trainer.py#L1935-L1954 | read at v3.28.0 on 2026-10-31

## Batch queues and heterogeneous clusters

- Batch service jobs: Batch holds priorities, fair share and quota shares, SageMaker runs the job, SubmitServiceJob API not the console | https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html | T06-51; W5-54
- Batch schedules SageMaker training jobs since 2025-07-31 [Tier 2] | https://aws.amazon.com/about-aws/whats-new/2025/07/aws-batch-sagemaker-training-jobs/ | G5; U06-8 (closed)
- Quota management and preemption added 2026-03-25 [Tier 2] | https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-quota-management-preemption-sagemaker/ | read 2026-10-31
- TrainingQueue(name).submit takes a ModelTrainer, priority, share identifier, quota share, preemption config [code] | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/aws_batch/training_queue.py#L26-L47 | read at v3.28.0 on 2026-10-31
- Batch gives training-job teams what task governance gives HyperPod EKS teams (our reading) | synthesis | T06-16
- Heterogeneous clusters: mixed instance groups, through ModelTrainer, PyTorch 1.10 or later; not with warm pools | https://docs.aws.amazon.com/sagemaker/latest/dg/train-heterogeneous-cluster.html; train-warm-pools.html | T06-29
- CPU groups rarely pay for pre-tokenised text (our reading) | synthesis | section 23

## SDK and libraries

- SDK v3 replaces Estimator and framework estimators with ModelTrainer; older interfaces unsupported in v3; pip install sagemaker==2.* | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/README.rst#L40-L90 | T06-28; W5-55
- dry_run=True validates and submits no job [code] | model_trainer.py#L920-L955 at v3.28.0 | read 2026-10-31
- Launcher sketch written from SDK source, not run | SDK v3.28.0 configs.py `__all__`, model_trainer.py, distributed.py | not run (no AWS account; experiments on hold)
- SMP v2 built on PyTorch FSDP, adds hybrid sharding, TP, activation checkpointing and offloading, runs on training jobs and HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-v2.html | T06-24
- SMP v2.8.0 on 2025-04-01, PyTorch 2.5.1, NCCL 2.23.4 | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html | T06-24; W5-56
- SDK v3 takes SMP settings as Torchrun(smp=SMP(...)), passed as mp_parameters [code] | distributed.py#L26-L77, #L113-L128; model_trainer.py#L799-L801 at v3.28.0 | U06-3 (closed, code, untested)
- The SMP v2 guide documents only the SDK v2 PyTorch estimator, SDK v2.200 or later [doc-code conflict] | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-use-api-v2.html | U06-3
- SMDDP AllGather optimized for NVIDIA A100 instances | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html | T06-25
- SMDDP release notes end at v2.5.0 (2024-10-17); SMP v2.8.0 carries SMDDP 2.6.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html; model-parallel-release-notes.html | T06-25; C06-6
- Neither library has released in more than 18 months; bring FSDP2, TorchTitan or Megatron Core in your own container (our reading) | synthesis on the dates above | section 15

## HyperPod recipes

- Recipes run on HyperPod or as training jobs; GitHub holds the current list | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-recipes.html | T06-19
- At 2.0.11 the training directory holds six recipes, no Trainium or Neuron path [code] | https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11/hyperpod_recipes/recipes_src/training | T06-20; W5-57; W3-41
- ModelTrainer.from_recipe launches a recipe as a training job [code] | model_trainer.py#L1410-L1411 at v3.28.0 | read 2026-10-31
- Checkpointless Llama 3 70B: 16 ml.p5.48xlarge, TP 8, PP 4, BF16 mixed, sequence 2,048, micro-batch 1, global batch 512, async save every 20 steps [code]; DP 4 our arithmetic | https://github.com/aws/sagemaker-hyperpod-recipes/blob/2.0.11/hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml#L3-L112 | T06-21
- Checkpointless training documented for HyperPod EKS with training operator v1.2.0 or later; no page located running it as a training job | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html | T06-21; read 2026-10-31
- v1.5.1 (2025-08-14) held 36 training recipes incl. Llama 3 70B on 32, 64, 128 p5 nodes and Trn1 8B and 70B [code] | https://github.com/aws/sagemaker-hyperpod-recipes/tree/a9ba8bf184ec8b912936bed828ce7ee8554fab3f/recipes_collection/recipes/training | T06-20
- v2.0.0 (2025-12-03) carries the six recipes; notes list H100, A100, A10G | https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0 | T06-20
- The Trainium training-job tutorial names hf_llama3_70b_seq8k_trn1x16_pretrain with instance_count=1, absent at 2.0.11 [doc-code conflict] | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html | W5-58; U06-4

## When a cluster per job is the right shape

- $63.296 training job vs $66.048 HyperPod per p5.48xlarge-hour, 1.15 and 1.20 times EC2, 4.2% lower (our arithmetic) | SageMaker Price List us-east-1 20261029165009 | T05-23; presets `PRICES`
- A HyperPod cluster bills for its whole life, idle included | https://aws.amazon.com/sagemaker/ai/pricing/ | section 20 (same source)
- Reference run: Llama 3.1 70B, 15T tokens, 2,048 H100, 40% MFU (assumption), 6ND, 989.5 TFLOPS dense BF16 [vendor claim], about 91 days | src/lib/runtime.ts estimateRun; SOURCES.h100 | section 22 reference run; DEFAULT_MFU
- At least 4 jobs of at most 28 days (our arithmetic) | API_StoppingCondition | T06-23
- $30.7M EC2 On-Demand becomes $35.3M at the training rate, $4.6M more (our arithmetic) | src/lib/runtime.ts priceRun | section 22 cost panel
- Next action: small job, stopping condition, CheckpointConfig, infra check, per-rank saves and SIGTERM save, dry_run, stop-and-resume test, then scale | synthesis | experiments A0 to A5 not yet run
